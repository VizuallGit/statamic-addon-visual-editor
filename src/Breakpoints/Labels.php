<?php

namespace MarioHamann\StatamicVisualEditor\Breakpoints;

/**
 * The name on the button: a translation for the three built-in handles,
 * the author's own text for anything else — and never a raw key.
 * Moved verbatim out of Breakpoints in WP7d.
 */
final class Labels
{
    /** De navne der er sprognøgler. Alt andet er tekst nogen har skrevet. */
    public const LABEL_KEYS = ['desktop', 'tablet', 'mobile'];

    /**
     * Navnet der står på knappen.
     *
     * De tre indbyggede bærer en sprognøgle, så de kan oversættes; et selvvalgt
     * breakpoint bærer den tekst nogen har skrevet, og den skal stå som skrevet.
     * Derfor en fast liste og ikke "prøv at slå op": ellers ville et
     * breakpoint nogen kaldte "mobile" pludselig hedde noget andet på dansk.
     *
     * Slår opslaget fejl — sproget er ikke indlæst endnu — bliver det stadig
     * til `Desktop` og aldrig til `desktop`.
     */
    public static function label(array $row): string
    {
        $raw = trim((string) ($row['label'] ?? ''));

        if ($raw === '') {
            return ucfirst((string) $row['handle']);
        }

        if (! in_array($raw, static::LABEL_KEYS, true)) {
            return $raw;
        }

        if (! static::translationsReady()) {
            return ucfirst($raw);
        }

        $key = 'sve::messages.responsive_'.$raw;
        $out = __($key);

        return is_string($out) && $out !== $key ? $out : ucfirst($raw);
    }

    /**
     * Er `sve::` fortalt hvor den bor endnu?
     *
     * At spørge om en oversættelse for tidligt er ikke bare et tomt svar:
     * Laravel husker det tomme svar for resten af requesten, og så er hver
     * eneste `sve::`-tekst på siden en rå nøgle. Listen læses under boot —
     * enhedsknapperne skal stå der før noget rendres — så den kan udmærket
     * blive spurgt før. Derfor spørger vi først, om der er nogen at spørge.
     */
    protected static function translationsReady(): bool
    {
        try {
            $loader = app('translator')->getLoader();

            return method_exists($loader, 'namespaces')
                && array_key_exists('sve', $loader->namespaces());
        } catch (\Throwable) {
            return false;
        }
    }
}
