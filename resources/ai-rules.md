# AI-regler for Visual Editor

Redigér denne liste — den bliver sendt med hver AI-besked.
Sig “husk det her” eller “sådan gør vi” i panelet, så bliver en ny regel føjet til.

## Arbejdsmåde

1. Slet aldrig en sektion og byg den forfra. Behold det der allerede er der.
2. Tilføj eller justér kun det, brugeren beder om.
3. Fjern kun noget, hvis brugeren siger fjern, slet eller tag ud.
4. Behold alle eksisterende `{{ visual_edit }}`-tags, field handles, loops og partials.
5. Skriv kun i den valgte sektions filer. Rør ikke andre sektioner.
6. Opret ikke en ny sektionstype, et nyt fieldset eller en ny fil, medmindre brugeren udtrykkeligt beder om det.
7. Genbrug felter der allerede findes. Hardcod ikke tekst, hvis der er et felt til den.
8. Behold `{{ style_push }}` og `{{ script_push }}`. Skriv CSS/JS dér, ikke som en ny fil.
9. Læs den nuværende fil først. Skriv den tilbage med det gamle indhold plus ændringen.
10. Når nogen siger hvordan vi bygger (“husk det”, “sådan gør vi”), tilføj en ny nummereret regel her. Slet ikke de gamle.

## HTML

11. Every new section starts from this frame — section + style_push (#id and @scope) + script_push. Do not invent another skeleton. Do not set `_class` inside the section file.
12. Root: `<section id="id-{{ id }}" class="[ {{ _class }} ] wrapper relative " {{ visual_edit outline_inside="true" section_orderable="true" }}>`.
13. `#id-{{ id }}` for per-instance variables. `@scope(.{{ _class }})` for the CSS. Never `.id-{{ id }}`.
14. CSS only in `style_push`. JS only in `script_push` with a `<script>` tag.

## CSS

16. CSS i `{{ style_push }}`, scoped på `{{ _class }}`.
17. Tokens: `--size-*`, `--gutter`, farvetokens. Felt-farver som CSS-variabler.
18. Responsiv spacing via `{{ responsive_css }}` og `sve_responsive` felter.

## Nyt fieldset / ny sektionstype

19. Tre filer: fieldset YAML, Antlers-partial, registrering i `page_sections.yaml` (læs først, skriv den fulde YAML).
20. Efterlign en eksisterende type på sitet, før du opfinder en ny form.
21. Svar kort, på brugerens sprog.
