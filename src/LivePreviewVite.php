<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Foundation\Vite;
use ReflectionObject;
use ReflectionProperty;

/**
 * Vite with a locked hot file, so Statamic's `{{ vite }}` clone cannot fall
 * off `npm run dev`.
 *
 * Live Preview keeps `@vite/client` — CSS `update` paints a newly compiled
 * utility in the iframe. Screenshots strip that client after render
 * (`DisableViteHotReload`): a `full-reload` mid-capture is a blank frame.
 *
 * `useHotFile()` is inert and `hotFile()` is locked, so a clone keeps the
 * same file. Laravel's `__invoke` prepends the client while hot.
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
     * Same as Laravel's hot path, including `@vite/client`.
     *
     * The lock on `hotFile()` is the point of this class. Omitting the client
     * left the iframe on the CSS it loaded at open — a class that already lived
     * in that sheet showed up, a newly compiled one did not. CSS `update` is
     * what paints the new utility; InjectBridgeScript swallows `full-reload`.
     *
     * Statamic's `{{ vite }}` tag calls `toHtml()`, which calls this.
     */
    public function __invoke($entrypoints, $buildDirectory = null)
    {
        return parent::__invoke($entrypoints, $buildDirectory);
    }

    /**
     * Last line of defence: if some other `{{ vite }}` / `@vite` path still
     * printed `@vite/client`, cut that script out of the finished HTML.
     * The public site and Live Preview are untouched — this only runs on
     * screenshot render responses.
     */
    public static function stripClientScript(string $html): string
    {
        if (! str_contains($html, '@vite/client')) {
            return $html;
        }

        $stripped = preg_replace(
            '#<script\b[^>]*\bsrc=(["\'])[^"\']*@vite/client[^"\']*\1[^>]*>\s*</script>#i',
            '',
            $html
        );

        return is_string($stripped) ? $stripped : $html;
    }
}
