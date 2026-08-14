<?php

namespace MarioHamann\StatamicVisualEditor\Fieldtypes;

use Statamic\Fields\Fieldtype;

/**
 * "Med fra start" på et Bard-felt — den tekst feltet åbner med.
 *
 * Bard-default er et ProseMirror-dokument, ikke en streng. Det er derfor YAML
 * ellers ser sådan her ud:
 *
 *     default:
 *       - type: heading
 *         attrs:
 *           level: 1
 *         content:
 *           - type: text
 *             text: 'Indtast din tekst'
 *
 * Feltet står i Bard-feltets egne indstillinger og gemmer under Statamics egen
 * `default`-nøgle, i præcis den form. CP'et viser afsnit eller overskrift
 * (niveau 1, 2 eller 3), plus den tekst redaktøren ser indtil der skrives noget
 * andet. Inline-Bard (én linje) er bare tekstfeltet.
 *
 * En default der rummer andet end de tre (et set, en liste) bevares som den er,
 * så en YAML skrevet i hånden ikke bliver ødelagt første gang nogen åbner
 * indstillingerne.
 */
class BardDefaultFieldtype extends Fieldtype
{
    protected $selectable = false;

    protected static $handle = 'bard_default';

    public function component(): string
    {
        return 'bard-default';
    }

    public function preProcess($data)
    {
        return $this->toKinds($data);
    }

    /**
     * Tom liste gemmes som `null`.
     *
     * Ellers ville hvert eneste Bard-felt få en tom `default: []` i blueprintet
     * første gang nogen åbnede dets indstillinger.
     */
    public function process($data)
    {
        return $this->toNodes($data) ?: null;
    }

    /**
     * ProseMirror-noder (og den forenklede `kind`-form fra CP'et) → den korte
     * liste editoren arbejder med.
     *
     * @return array<int, array<string, mixed>>
     */
    protected function toKinds(mixed $data): array
    {
        $kinds = [];

        foreach (is_array($data) ? $data : [] as $item) {
            if (! is_array($item)) {
                continue;
            }

            $kind = $this->kind($item);

            if ($kind) {
                $kinds[] = $kind;
            }
        }

        return $kinds;
    }

    /**
     * Den korte liste → ProseMirror-noder, klar til YAML.
     *
     * @return array<int, array<string, mixed>>
     */
    protected function toNodes(mixed $data): array
    {
        $nodes = [];

        foreach (is_array($data) ? $data : [] as $item) {
            if (! is_array($item)) {
                continue;
            }

            $node = $this->node($item);

            if ($node) {
                $nodes[] = $node;
            }
        }

        return $nodes;
    }

    /** @return array<string, mixed>|null */
    protected function kind(array $item): ?array
    {
        if (isset($item['kind']) && is_string($item['kind'])) {
            return $this->normalizeKind($item);
        }

        return match ($item['type'] ?? null) {
            'paragraph' => [
                'kind' => 'paragraph',
                'text' => $this->textOf($item),
            ],
            'heading' => [
                'kind' => 'heading',
                'level' => $this->level($item),
                'text' => $this->textOf($item),
            ],
            'text' => [
                'kind' => 'text',
                'text' => (string) ($item['text'] ?? ''),
            ],
            default => isset($item['type']) ? ['kind' => 'raw', 'node' => $item] : null,
        };
    }

    /** @return array<string, mixed>|null */
    protected function normalizeKind(array $item): ?array
    {
        return match ($item['kind']) {
            'paragraph' => [
                'kind' => 'paragraph',
                'text' => (string) ($item['text'] ?? ''),
            ],
            'heading' => [
                'kind' => 'heading',
                'level' => $this->clampLevel($item['level'] ?? 2),
                'text' => (string) ($item['text'] ?? ''),
            ],
            'text' => [
                'kind' => 'text',
                'text' => (string) ($item['text'] ?? ''),
            ],
            'raw' => isset($item['node']) && is_array($item['node'])
                ? ['kind' => 'raw', 'node' => $item['node']]
                : null,
            default => null,
        };
    }

    /** @return array<string, mixed>|null */
    protected function node(array $item): ?array
    {
        if (! isset($item['kind'])) {
            return isset($item['type']) ? $item : null;
        }

        return match ($item['kind']) {
            'paragraph' => $this->block('paragraph', (string) ($item['text'] ?? '')),
            'heading' => $this->block('heading', (string) ($item['text'] ?? ''), [
                'attrs' => ['level' => $this->clampLevel($item['level'] ?? 2)],
            ]),
            'text' => ($text = (string) ($item['text'] ?? '')) === ''
                ? null
                : ['type' => 'text', 'text' => $text],
            'raw' => is_array($item['node'] ?? null) ? $item['node'] : null,
            default => null,
        };
    }

    /**
     * @param  array<string, mixed>  $extra
     * @return array<string, mixed>
     */
    protected function block(string $type, string $text, array $extra = []): array
    {
        $node = array_merge(['type' => $type], $extra);

        if ($text !== '') {
            $node['content'] = [['type' => 'text', 'text' => $text]];
        }

        return $node;
    }

    protected function textOf(array $node): string
    {
        if (($node['type'] ?? '') === 'text') {
            return (string) ($node['text'] ?? '');
        }

        $text = '';

        foreach ($node['content'] ?? [] as $child) {
            if (is_array($child)) {
                $text .= $this->textOf($child);
            }
        }

        return $text;
    }

    protected function level(array $node): int
    {
        return $this->clampLevel($node['attrs']['level'] ?? 2);
    }

    protected function clampLevel(mixed $level): int
    {
        $level = (int) $level;

        return $level >= 1 && $level <= 6 ? $level : 2;
    }
}
