import { reactive } from 'vue';

/**
 * The theme panel's state — one save writes every tab into site.css.
 *
 * `families` (Colors): `{ key, name, value, steps, tints, shades, generated, scale,
 * fresh, problem }` — `fresh` for a color not saved yet (only its name can
 * change), `problem` a nameProblem() key while the name is not usable.
 * `savedSteps` are each color's step names as saved, by color name.
 *
 * `sizes` (Spacing): `{ key, name, min, max, fresh, problem }` in px, the
 * `--size-*` scale; `maxViewport` is where they stop growing (the container
 * width), in px.
 *
 * `type` and `button` (Typography, Button): the tokens' CSS values as they
 * stand in the file, by token name. `fonts` are the families the dropdowns
 * offer (fonts.css, the faces the page has loaded, the theme's own), `leadings`
 * the line heights in `@theme` — the choices offered.
 *
 * `installed` (Fonts): fonts.css read back, `{ name, faces: [{ weight, style,
 * url, unicodeRange, missing }], files, bytes }` per family; `kits` its Adobe
 * Fonts kits, `{ url, families }`. `fontsWritable` says whether this server
 * can add to the folder. They change the moment a font is added — no save.
 *
 * `utilities` (Utilities): the `@utility` blocks, `{ key, name, body, fresh,
 * problem }` — the body dedented, as the tab's editor shows it; `fresh` for
 * one not saved yet (only its name can change), `problem` a name or brace
 * problem that stops the save. `savedUtilities` are the bodies as saved, by
 * name. `buildNote` says why the server did not build the site's CSS after
 * the last save, empty when it did.
 *
 * `classRows` (Classes): every class the site's CSS defines, folded to one row
 * per name by site-classes.js — `{ name, kind, files, selectors, props,
 * ambient }`, and only from the two files the tab owns — `classSources`:
 * site.css's utilities and the site's own classes file. A section's rules are
 * the section's and travel with it, so they are not in here. `classChip` and
 * `classQuery` are the chip and the search box over the list, `openClass` the
 * name unfolded.
 *
 * `classes` are the editable rules in that classes file, `{ key, name, body,
 * fresh, problem }` — the same shape as `utilities`, because they are the
 * other half of what the tab writes. `savedClasses` are the bodies as saved,
 * by name, and `classFile` the file as last read or written.
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
  installed: [],
  kits: [],
  fontsWritable: true,
  fontsStylesheet: '/fonts/fonts.css',
  fontsStatus: '',
  utilities: [],
  savedUtilities: {},
  openUtility: '',
  classRows: [],
  classSources: { entry: 'site.css', classes: 'custom-classes.css' },
  classes: [],
  savedClasses: {},
  classFile: '',
  openClassKey: '',
  removedClasses: [],
  classQuery: '',
  classChip: 'all',
  openClass: '',
  props: [],
  savedProps: {},
  openProp: '',
  vars: '',
  buildNote: '',
  saved: '',
  dirty: false,
  loading: false,
  saving: false,
  status: '',
  labels: {},
});
