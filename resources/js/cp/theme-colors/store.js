import { reactive } from 'vue';

/**
 * The theme colors panel's state.
 *
 * `families` is what is on screen: the file as read, plus what has changed
 * since. Each is `{ key, name, value, steps, tints, shades, generated, fresh,
 * problem }` — `fresh` for a color not saved yet (only its name can change),
 * `problem` a nameProblem() key while the name is not usable.
 *
 * `saved` is site.css as last read or written.
 */
export const themeColorsUi = reactive({
  families: [],
  openKey: '',
  saved: '',
  dirty: false,
  loading: false,
  saving: false,
  status: '',
  labels: {},
});
