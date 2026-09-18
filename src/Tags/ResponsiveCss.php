<?php

namespace MarioHamann\StatamicVisualEditor\Tags;

use MarioHamann\StatamicVisualEditor\Fieldtypes\ResponsiveFieldtype as Responsive;
use MarioHamann\StatamicVisualEditor\Tags\ResponsiveCss\Declarations;
use MarioHamann\StatamicVisualEditor\Tags\ResponsiveCss\SetValues;
use Statamic\Fields\Value;
use Statamic\Tags\Context;
use Statamic\Tags\Tags;

/**
 * Alle sektionens responsive felter, skrevet ud som CSS.
 *
 * En sektion har typisk tre-fire responsive felter, og hvert af dem skulle
 * ellers skrives fire steder i skabelonen: én gang på basis, én gang pr.
 * media query, plus en betingelse om at media query'en overhovedet skal stå
 * der. Det er den samme snes linjer i hver eneste sektion, og et nyt felt
 * betyder en tur rundt i dem alle sammen.
 *
 * Her er det ét kald. Tag'et finder selv felterne — det behøver ikke få dem at
 * vide, for et responsivt felt kan kendes på sin fieldtype — og skriver dem ud
 * i den rækkefølge kaskaden kræver:
 *
 *     {{ responsive_css }}
 *         --color-bg: {{ bg_color }};
 *
 *         .media{ max-inline-size: var(--media-width, 100%); }
 *     {{ /responsive_css }}
 *
 * Alt mellem tags'ene lander inde i sektionens egen regel, sammen med
 * custom properties for desktop. Tablet og mobil får hver sin media query med
 * kun de felter de selv har en værdi for — har de ingen, står der ingen media
 * query, og feltet arver opad af sig selv.
 *
 * Et felt bliver til `--handle`. Skal det skrives anderledes — en enhed bagefter,
 * eller flere deklarationer ud af én værdi — lægges der en partial i
 * `partials/responsive/{handle}`, som får værdien i `{{ value }}`. Den skrives
 * én gang og gælder så hver sektion der bruger feltet.
 *
 * Skal et felt lande et andet sted end på sektionen, kan det tages ud med
 * `except` og skrives i hånden i stedet:
 *
 *     {{ responsive_css except="padding" }} … {{ /responsive_css }}
 *
 * Eller landes med `selector` og `only`, så tag'et selv skriver det:
 *
 *     {{ responsive_css selector="#id-{{ id }} .content" only="padding" }}
 *     {{ /responsive_css }}
 *
 * Felter på en replicator-blok (fx listen) hentes med `from="list"` — typen,
 * ikke et loop i CSS:
 *
 *     {{ responsive_css selector="#id-{{ id }} .list" only="padding,gap" from="list" }}
 *     {{ /responsive_css }}
 *
 * The tag keeps what reads its parameters and context; the value reading
 * lives in `ResponsiveCss\SetValues` and the CSS in `ResponsiveCss\Declarations`.
 * Split in WP7d, code moved verbatim.
 */
class ResponsiveCss extends Tags
{
    public function index(): string
    {
        $selector = $this->params->get('selector') ?: '#id-'.$this->context->value('id');
        $previous = $this->applyFrom();

        try {
            $fields = $this->filterFields($this->fields());
            $base = Responsive::base();

            $css = $selector.'{'
                .Declarations::declarations($fields, $base)
                .($this->isPair ? $this->parse() : '')
                .'}';

            foreach (Responsive::breakpoints() as $breakpoint) {
                if ($breakpoint['handle'] === $base || empty($breakpoint['max'])) {
                    continue;
                }

                $declarations = Declarations::declarations($fields, $breakpoint['handle']);

                if ($declarations === '') {
                    continue;
                }

                $css .= '@media '.$breakpoint['media'].'{'
                    .$selector.'{'.$declarations.'}'
                    .'}';
            }

            return $css;
        } finally {
            if ($previous) {
                $this->context = $previous;
            }
        }
    }

    /**
     * `from="list"` skifter konteksten til den blok, så felterne dér er dem
     * tag'et ser — ikke sektionens. Selectoren er allerede låst, før vi skifter.
     */
    protected function applyFrom(): ?Context
    {
        $from = $this->params->get('from');

        if (! $from) {
            return null;
        }

        $previous = $this->context;
        $this->context = new Context($this->firstSetOfType((string) $from) ?? []);

        return $previous;
    }

    /** @return array<string, mixed>|null */
    protected function firstSetOfType(string $type): ?array
    {
        $blocks = $this->context->value('blocks');

        if ($blocks instanceof Value) {
            $blocks = $blocks->value();
        }

        if (! is_iterable($blocks)) {
            return null;
        }

        foreach ($blocks as $set) {
            $array = SetValues::setToArray($set);
            $setType = $array['type'] ?? null;

            if ($setType instanceof Value) {
                $setType = $setType->value();
            }

            if ($setType === $type) {
                return $array;
            }
        }

        return null;
    }

    /**
     * @param  array<string, array<string, mixed>>  $fields
     * @return array<string, array<string, mixed>>
     */
    protected function filterFields(array $fields): array
    {
        if ($except = $this->paramList('except')) {
            $fields = array_diff_key($fields, array_flip($except));
        }

        if ($only = $this->paramList('only')) {
            $fields = array_intersect_key($fields, array_flip($only));
        }

        return $fields;
    }

    /** @return array<int, string> */
    protected function paramList(string $key): array
    {
        $raw = $this->params->get($key);

        if ($raw === null || $raw === '' || $raw === []) {
            return [];
        }

        if (is_array($raw)) {
            return array_values($raw);
        }

        return preg_split('/[|,]/', (string) $raw, -1, PREG_SPLIT_NO_EMPTY) ?: [];
    }

    /**
     * Sektionens (eller blokkens) responsive felter, som `handle => [breakpoint => værdi]`.
     *
     * Kendes på fieldtypen frem for på værdiens form: et felt der tilfældigvis
     * har nøglerne laptop/tablet/mobil er ikke det samme som et felt der er
     * erklæret responsivt, og forskellen er værd at holde fast i. Rå arrays fra
     * en replicator-række tæller med, når formen matcher — ellers virker `from`
     * ikke, når værdien ikke længere er et Value-objekt.
     *
     * @return array<string, array<string, mixed>>
     */
    protected function fields(): array
    {
        $out = [];

        foreach ($this->context->all() as $handle => $value) {
            $augmented = SetValues::responsiveValue($value);

            if ($augmented === null) {
                continue;
            }

            $byBreakpoint = [];

            foreach (Responsive::handles() as $breakpoint) {
                $inner = SetValues::innerAt($augmented, $breakpoint, $handle);

                if ($inner === null || $inner === '' || $inner === []) {
                    continue;
                }

                $byBreakpoint[$breakpoint] = $inner;
            }

            if ($byBreakpoint) {
                $out[$handle] = $byBreakpoint;
            }
        }

        return $out;
    }
}
