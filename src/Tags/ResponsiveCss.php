<?php

namespace MarioHamann\StatamicVisualEditor\Tags;

use MarioHamann\StatamicVisualEditor\Fieldtypes\ResponsiveFieldtype as Responsive;
use Statamic\Fields\Value;
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
 * Så står både elementet og skærmstørrelserne i skabelonen. Værdien hentes pr.
 * skærmstørrelse som `{{ padding.tablet.padding }}` — skuffen, og så feltet i den.
 */
class ResponsiveCss extends Tags
{
    public function index(): string
    {
        $selector = $this->params->get('selector') ?: '#id-'.$this->context->value('id');
        $fields = $this->fields();
        $base = Responsive::base();

        // `except="padding"` tager et felt ud af automatikken, så skabelonen kan
        // skrive det selv — typisk fordi det skal lande på et andet element end
        // sektionen. Tag'et kender kun én selector; det den ikke skriver, kan
        // skrives hvor som helst. Uden parameteren skrives alle felter som før.
        if ($except = $this->params->explode('except', [])) {
            $fields = array_diff_key($fields, array_flip($except));
        }

        $css = $selector.'{'
            .$this->declarations($fields, $base)
            .($this->isPair ? $this->parse() : '')
            .'}';

        foreach (Responsive::breakpoints() as $breakpoint) {
            if ($breakpoint['handle'] === $base || empty($breakpoint['max'])) {
                continue;
            }

            $declarations = $this->declarations($fields, $breakpoint['handle']);

            // Ingen værdier, ingen media query. En tom `@media`-blok er ikke
            // forkert, men den fortæller heller ikke nogen noget.
            if ($declarations === '') {
                continue;
            }

            $css .= '@media (max-width: '.$breakpoint['max'].'){'
                .$selector.'{'.$declarations.'}'
                .'}';
        }

        return $css;
    }

    /**
     * Sektionens responsive felter, som `handle => [breakpoint => værdi]`.
     *
     * Kendes på fieldtypen frem for på værdiens form: et felt der tilfældigvis
     * har nøglerne laptop/tablet/mobil er ikke det samme som et felt der er
     * erklæret responsivt, og forskellen er værd at holde fast i.
     *
     * @return array<string, array<string, mixed>>
     */
    protected function fields(): array
    {
        $out = [];

        foreach ($this->context->all() as $handle => $value) {
            // Genkendt på fieldtypens handle, ikke på dens klasse. Under
            // udflytningen fra projektet til addonet findes der to klasser med
            // samme handle, og kun den ene vinder opslaget. Et `instanceof`
            // ville da være falsk for hvert eneste felt, og al responsiv CSS
            // ville forsvinde fra sitet uden en fejl nogen steder. Handlen er
            // den samme uanset hvem der vandt — det er den der er kontrakten.
            if (! $value instanceof Value || $value->fieldtype()?->handle() !== Responsive::handle()) {
                continue;
            }

            $augmented = $value->value();
            $byBreakpoint = [];

            foreach (Responsive::handles() as $breakpoint) {
                // Feltets eget handle står inde i skuffen igen — indpakningen
                // gemmer det oprindelige felt under sit eget navn.
                $inner = $augmented[$breakpoint][$handle] ?? null;

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

    /** @param  array<string, array<string, mixed>>  $fields */
    protected function declarations(array $fields, string $breakpoint): string
    {
        $out = '';

        foreach ($fields as $handle => $byBreakpoint) {
            if (! array_key_exists($breakpoint, $byBreakpoint)) {
                continue;
            }

            $value = $byBreakpoint[$breakpoint];

            // Tomt = arver. En media query med `--x:` eller `--x:%` er værre
            // end ingen regel — den overskriver forælderens rigtige værdi.
            if ($value === null || $value === '' || $value === []) {
                continue;
            }

            $out .= $this->declaration($handle, $value);
        }

        return $out;
    }

    /** Ét felts værdi som CSS — enten en custom property eller feltets egen partial. */
    protected function declaration(string $handle, $value): string
    {
        $view = 'partials/responsive/'.$handle;

        if (view()->exists($view)) {
            $css = trim(view($view, ['value' => $value, 'handle' => $handle])->render());

            // Partialer kan stadig skrive tomme deklarationer (fx `--media-width:%`).
            if ($css === '' || preg_match('/:\s*;?\s*$/', $css) || preg_match('/:\s*%\s*;?\s*$/', $css)) {
                return '';
            }

            return $css;
        }

        // En værdi med struktur — et grid, et spacing-felt — kan ikke skrives i
        // en custom property uden at nogen har sagt hvordan. Det siges i en
        // partial, og indtil den findes er der ikke noget rigtigt at skrive.
        if (is_array($value) || $value instanceof \Traversable) {
            return '';
        }

        if ($value === null || $value === '') {
            return '';
        }

        return '--'.str_replace('_', '-', $handle).': '.$value.';';
    }
}
