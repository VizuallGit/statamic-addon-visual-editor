import { reactive } from 'vue';

/**
 * The theme panel's state — one save writes every tab into site.css.
 *
 * `families` (Colors): `{ key, name, value, steps, tints, shades, generated,
 * fresh, problem }` — `fresh` for a color not saved yet (only its name can
 * change), `problem` a nameProblem() key while the name is not usable.
 * `savedSteps` are each color's step names as saved, by color name.
 *
 * `sizes` (Spacing): `{ key, name, min, max, fresh, problem }` in px, the
 * `--size-*` scale; `maxViewport` is where they stop growing (the container
 * width), in px.
 *
 * `type` and `button` (Typography, Button): the tokens' CSS values as they
 * stand in the file, by token name. `fonts` are the families the page has
 * loaded, `leadings` the line heights in `@theme` — the choices offered.
 *
 * `saved` is site.css as last read or written.
 */
export const themePanelUi = reactive({
  tab: 'colors',
  families: [],
  savedSteps: {},
  openKey: '',
  sizes: [],
  maxViewport: 1280,
  selectedSize: '',
  type: {},
  button: {},
  fonts: [],
  leadings: [],
  saved: '',
  dirty: false,
  loading: false,
  saving: false,
  status: '',
  labels: {},
});
