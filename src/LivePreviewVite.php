<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Foundation\Vite;
use ReflectionObject;
use ReflectionProperty;

/**
 * A Vite that cannot be talked back into hot mode.
 *
 * `DisableViteHotReload` points Vite at a hot file that does not exist, which is
 * how a Live Preview render is made to resolve assets from the build manifest.
 * Setting it on the container instance is not enough on its own: Statamic's
 * `{{ vite }}` tag takes a *clone* of that instance and calls `useHotFile(null)`
 * on it when the tag has no `hot` parameter — which every ordinary use of the tag
 * doesn't. And `hotFile()` reads `$this->hotFile ?? public_path('/hot')`, so null
 * doesn't mean "no hot file", it means "the real one" — which exists while
 * `npm run dev` runs. The dev client lands in the preview document after all, and
 * its hot reload throws the editor out of whatever it was in the middle of.
 *
 * So the answer is given by the object rather than by its state: `hotFile()` is
 * final for the length of the request, and `useHotFile()` stops being a way to
 * change it. Cloning carries the override along, because it is the class.
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
}
