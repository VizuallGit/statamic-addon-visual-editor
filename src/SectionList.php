<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Facades\Blueprint;
use Statamic\Facades\Fieldset;
use Statamic\Facades\YAML;

/**
 * The file a page builder's list of section types is written in.
 *
 * Usually a fieldset — `page_sections.yaml`, imported by every page blueprint —
 * but a blueprint may hold its sections field itself (a Replicator added in the
 * blueprint editor and marked as the page's sections), and then the list is in
 * the blueprint's own file. Which one it is, is {@see SectionField::listOf()}'s
 * answer; this class only reads and writes it.
 *
 * Always from disk, never from the repository's copy. That copy is the one the
 * addon injects `_visual_id` into at runtime — in memory on purpose — and
 * saving it would write the injected fields into the author's YAML for good.
 * The repository also memoises a fieldset for the whole request, so a group
 * made a moment ago in the same request would be missing from it.
 *
 * `field` is the Replicator's handle inside the file, without an import prefix.
 */
final class SectionList
{
    private function __construct(
        /** 'fieldset' or 'blueprint' */
        public readonly string $kind,
        /** The fieldset's handle, or the blueprint's fully qualified handle. */
        public readonly string $handle,
        public readonly string $field,
    ) {}

    public static function fieldset(string $handle, ?string $field = null): self
    {
        return new self('fieldset', $handle, $field ?? $handle);
    }

    public static function blueprint(string $fullyQualifiedHandle, string $field): self
    {
        return new self('blueprint', $fullyQualifiedHandle, $field);
    }

    /** The site's own list: the fieldset named after the default sections field. */
    public static function fallback(): self
    {
        return self::fieldset(SectionField::fallback());
    }

    /** The list as the client names it back, e.g. `fieldset:page_sections`. */
    public function key(): string
    {
        return $this->kind.':'.$this->handle;
    }

    /** The file's contents as they are on disk, or null when there is no file. */
    public function read(): ?array
    {
        $path = $this->path();

        return $path !== null && is_file($path) ? (YAML::file($path)->parse() ?: []) : null;
    }

    /** The Replicator's groups of sets in these contents, or null when it is not there. */
    public function sets(array $contents): ?array
    {
        $at = $this->locate($contents);

        if ($at === null) {
            return null;
        }

        $sets = static::dig($contents, $at)['sets'] ?? [];

        return is_array($sets) ? $sets : [];
    }

    /** These contents with the Replicator's sets replaced. Unchanged when it is not there. */
    public function withSets(array $contents, array $sets): array
    {
        $at = $this->locate($contents);

        if ($at === null) {
            return $contents;
        }

        $field = static::dig($contents, $at);
        $field['sets'] = $sets;

        return static::put($contents, $at, $field);
    }

    /** Writes the contents back to the file they came from. */
    public function save(array $contents): void
    {
        if ($this->kind === 'fieldset') {
            Fieldset::make($this->handle)->setContents($contents)->save();

            return;
        }

        Blueprint::find($this->handle)?->setContents($contents)->save();
    }

    private function path(): ?string
    {
        if ($this->kind === 'fieldset') {
            return Fieldset::directory().'/'.str_replace('.', '/', $this->handle).'.yaml';
        }

        return Blueprint::find($this->handle)?->path();
    }

    /**
     * Where the Replicator's config sits in the contents, as a list of keys.
     *
     * A fieldset keeps its fields flat or in `sections` ({@see FieldsetFields});
     * a blueprint in `tabs.*.sections.*.fields`. In a fieldset written before a
     * field could be named, the one Replicator is taken whatever its handle —
     * what `SectionTypeMaker::fieldIndex()` always did.
     *
     * @return list<string|int>|null
     */
    private function locate(array $contents): ?array
    {
        $lists = [];

        if ($this->kind === 'fieldset') {
            if (! empty($contents['sections']) && is_array($contents['sections'])) {
                foreach ($contents['sections'] as $s => $section) {
                    $lists[] = ['sections', $s, 'fields'];
                }
            } else {
                $lists[] = ['fields'];
            }
        } else {
            foreach (($contents['tabs'] ?? []) as $t => $tab) {
                foreach (($tab['sections'] ?? []) as $s => $section) {
                    $lists[] = ['tabs', $t, 'sections', $s, 'fields'];
                }
            }
        }

        $firstReplicator = null;

        foreach ($lists as $list) {
            foreach ((array) static::dig($contents, $list) as $i => $item) {
                if (! is_array($item) || ! is_array($item['field'] ?? null) || ! isset($item['field']['sets'])) {
                    continue;
                }

                if (($item['handle'] ?? null) === $this->field) {
                    return [...$list, $i, 'field'];
                }

                $firstReplicator ??= [...$list, $i, 'field'];
            }
        }

        return $this->kind === 'fieldset' ? $firstReplicator : null;
    }

    private static function dig(array $array, array $keys): mixed
    {
        foreach ($keys as $key) {
            if (! is_array($array) || ! array_key_exists($key, $array)) {
                return null;
            }

            $array = $array[$key];
        }

        return $array;
    }

    private static function put(array $array, array $keys, mixed $value): array
    {
        if ($keys === []) {
            return $value;
        }

        $key = array_shift($keys);
        $array[$key] = static::put(is_array($array[$key] ?? null) ? $array[$key] : [], $keys, $value);

        return $array;
    }
}
