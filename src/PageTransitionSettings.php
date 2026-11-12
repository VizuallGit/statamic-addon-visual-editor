<?php

namespace MarioHamann\StatamicVisualEditor;

use MarioHamann\StatamicVisualEditor\Http\Controllers\SectionTemplateController\Persist;
use Symfony\Component\Yaml\Exception\ParseException;
use Symfony\Component\Yaml\Yaml;

/**
 * How the whole site changes from one page to the next: Build → Animation →
 * Page transition → «Whole site».
 *
 * The site keeps the settings in resources/visual-editor/page-transitions.yaml
 * (beside animations.yaml), and InjectPageTransitions puts the CSS they make
 * at the end of every page's <head>: unlayered and last, so it wins over the
 * site's own `@view-transition` rules wherever they sit (base.css). Nothing
 * saved, nothing put on: the site's own CSS decides, as before. CSS only.
 *
 * - enabled  false: `navigation: none`, no page change animates, paired
 *            elements included.
 * - style    fade: the old page fades out, then the new one in (no double
 *            exposure); crossfade: the browser's own, both at once; slide:
 *            the new page slides all the way in from the right over the old,
 *            which moves a little left and dims; none: the page changes at
 *            once, paired elements still fly.
 * - duration seconds, 0.1–1.5.
 * - header   the site's header (`data-sve-chrome="header"`) stands still
 *            while the page under it changes.
 *
 * An element named on one page only — a card in a list whose partner is not
 * on the next page — is its own layer in the transition. `:only-child` (an
 * old image with no new beside it, or the other way round) makes it leave or
 * arrive with the page, instead of standing over the new page for its own
 * motion's length.
 */
final class PageTransitionSettings
{
    public const STYLES = ['fade', 'crossfade', 'slide', 'none'];

    /** What the site does before anything is saved: the browser's own crossfade. */
    public const DEFAULTS = ['enabled' => true, 'style' => 'crossfade', 'duration' => 0.25, 'header' => false];

    public const MIN_DURATION = 0.1;

    public const MAX_DURATION = 1.5;

    private static bool $read = false;

    private static ?array $memo = null;

    public static function file(): string
    {
        $configured = config('statamic-visual-editor.page_transitions.file');

        return is_string($configured) && $configured !== ''
            ? $configured
            : resource_path('visual-editor/page-transitions.yaml');
    }

    /** The saved settings, cleaned; null when none are saved. Read once per request. */
    public static function read(): ?array
    {
        if (self::$read) {
            return self::$memo;
        }

        self::$read = true;
        $path = self::file();

        if (! is_file($path)) {
            return self::$memo = null;
        }

        try {
            $data = Yaml::parse((string) file_get_contents($path));
        } catch (ParseException) {
            $data = null;
        }

        return self::$memo = is_array($data) ? self::clean($data) : null;
    }

    /** Forget what this request read: the next read() reads the file again. */
    public static function forget(): void
    {
        self::$read = false;
        self::$memo = null;
    }

    /** @return array{enabled: bool, style: string, duration: float, header: bool} */
    public static function clean(array $in): array
    {
        $style = in_array($in['style'] ?? null, self::STYLES, true) ? $in['style'] : self::DEFAULTS['style'];
        $duration = is_numeric($in['duration'] ?? null)
            ? round(max(self::MIN_DURATION, min(self::MAX_DURATION, (float) $in['duration'])), 2)
            : self::DEFAULTS['duration'];

        return [
            'enabled' => filter_var($in['enabled'] ?? self::DEFAULTS['enabled'], FILTER_VALIDATE_BOOLEAN),
            'style' => $style,
            'duration' => $duration,
            'header' => filter_var($in['header'] ?? self::DEFAULTS['header'], FILTER_VALIDATE_BOOLEAN),
        ];
    }

    /** @return array{enabled: bool, style: string, duration: float, header: bool} what was written */
    public static function write(array $settings): array
    {
        $clean = self::clean($settings);
        $path = self::file();

        if (! is_dir(dirname($path))) {
            mkdir(dirname($path), 0755, true);
        }

        file_put_contents($path, Yaml::dump($clean, 2, 2));
        self::forget();

        Persist::flushStaticCache();
        GitSync::after('page transitions');

        return $clean;
    }

    /** The CSS the settings make; '' for none saved. */
    public static function css(?array $settings): string
    {
        if ($settings === null) {
            return '';
        }

        $settings = self::clean($settings);

        if (! $settings['enabled']) {
            return '@view-transition{navigation:none}';
        }

        $ms = (int) round($settings['duration'] * 1000);
        $half = (int) round($ms / 2);
        $ease = 'cubic-bezier(.4,0,.2,1)';

        $css = '@view-transition{navigation:auto}'
            ."::view-transition-group(root){animation-duration:{$ms}ms}";

        $old = '::view-transition-old(root),::view-transition-old(*):only-child';
        $new = '::view-transition-new(root),::view-transition-new(*):only-child';

        $css .= match ($settings['style']) {
            'fade' => "{$old}{animation:{$half}ms ease-in both sve-vt-fade-out;mix-blend-mode:normal}"
                ."{$new}{animation:{$half}ms ease-out {$half}ms both sve-vt-fade-in;mix-blend-mode:normal}",
            'crossfade' => "::view-transition-old(*):only-child{animation:{$ms}ms ease both sve-vt-fade-out}"
                ."::view-transition-new(*):only-child{animation:{$ms}ms ease both sve-vt-fade-in}",
            'slide' => "{$old}{animation:{$ms}ms {$ease} both sve-vt-slide-out;mix-blend-mode:normal}"
                ."{$new}{animation:{$ms}ms {$ease} both sve-vt-slide-in;mix-blend-mode:normal}"
                .'@keyframes sve-vt-slide-out{to{transform:translateX(-30%);opacity:.4}}'
                .'@keyframes sve-vt-slide-in{from{transform:translateX(100%)}}',
            'none' => "{$old}{animation:none;opacity:0}{$new}{animation:none;mix-blend-mode:normal}",
            default => '',
        };

        $css .= '@keyframes sve-vt-fade-out{to{opacity:0}}@keyframes sve-vt-fade-in{from{opacity:0}}';

        if ($settings['header']) {
            $css .= '[data-sve-chrome="header"]{view-transition-name:sve-site-head}'
                .'::view-transition-group(sve-site-head){animation:none}'
                .'::view-transition-old(sve-site-head){animation:none;opacity:0}'
                .'::view-transition-new(sve-site-head){animation:none}';
        }

        return $css.'@media (prefers-reduced-motion){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none!important}}';
    }
}
