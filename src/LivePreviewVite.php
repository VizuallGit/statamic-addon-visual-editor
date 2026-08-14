<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Foundation\Vite;
use Illuminate\Support\Collection;
use Illuminate\Support\HtmlString;
use ReflectionObject;
use ReflectionProperty;

/**
 * Vite for Live Preview and screenshot renders: hot assets, no HMR client.
 *
 * `npm run dev` (and `npm run dev:previews`) must reach these documents — that
 * is how a new Tailwind class shows up without `npm run build`. What must not
 * reach them is `@vite/client`. The preview is morphed in place by preview.js;
 * Vite's full-reload throws the editor out of an open header or inline edit and
 * can surface Chrome's "Reload site?" prompt.
 *
 * Statamic's `{{ vite }}` tag clones the container instance and calls
 * `useHotFile(null)` when the tag has no `hot` parameter. `hotFile()` then
 * falls back to `public/hot`, which is what we want — but only if this class
 * still answers for the clone. `useHotFile()` is inert and `hotFile()` is
 * locked, so the clone keeps the same file and the same "no client" `__invoke`.
 */
class LivePreviewVite extends Vite
{
    protected string $lockedHotFile = '';

    /**
     * Takes over from the instance already in the container, carrying its
     * configuration across — an app that called `Vite::prefetch()` or set its own
     * build directory in a service provider must not quietly lose it here.
     */
    public static function lock(Vite $from, string $hotFile): self
    {
        $locked = new self;

        foreach ((new ReflectionObject($from))->getProperties() as $property) {
            if ($property->isStatic() || $property->isReadOnly()) {
                continue;
            }

            $target = new ReflectionProperty(Vite::class, $property->getName());
            $target->setAccessible(true);
            $property->setAccessible(true);

            $target->setValue($locked, $property->getValue($from));
        }

        $locked->lockedHotFile = $hotFile;

        return $locked;
    }

    public function hotFile()
    {
        return $this->lockedHotFile;
    }

    /** Deliberately inert — see the class docblock. */
    public function useHotFile($path)
    {
        return $this;
    }

    /**
     * Same as Laravel's hot path, minus `@vite/client`. CSS/JS still come from
     * the Vite server; a missing hot file falls through to the build manifest.
     */
    public function __invoke($entrypoints, $buildDirectory = null)
    {
        if (! $this->isRunningHot()) {
            return parent::__invoke($entrypoints, $buildDirectory);
        }

        $entrypoints = new Collection($entrypoints);

        return new HtmlString(
            $entrypoints
                ->map(fn ($entrypoint) => $this->makeTagForChunk(
                    $entrypoint,
                    $this->hotAsset($entrypoint),
                    null,
                    null
                ))
                ->join('')
        );
    }
}
