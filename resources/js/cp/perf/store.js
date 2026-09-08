/**
 * What the performance panel is showing.
 *
 * Plain display data only — the same rule the accessibility store follows, for
 * the same reason: the reading itself is a throwaway frame that is gone before
 * this is drawn, so there is nothing live in here to keep a reference to.
 */
import { reactive } from 'vue';

export const perfUi = reactive({
  tab: 'summary',
  tabs: [],
  onTab: null,
  /** idle | running | done | error */
  state: 'idle',
  message: '',
  runLabel: '',
  onRun: null,
  hint: '',
  url: '',
  score: 0,
  /** good | ok | poor — the colour of the number, not a second opinion. */
  grade: '',
  gradeLabel: '',
  /** The headline readings: weight, requests, LCP, CLS, response time, blocking. */
  metrics: [],
  /** Weight per kind, as a share of the page. */
  bars: [],
  /** Anything that changes how the numbers should be read. */
  notes: [],
  /** The count on each tab. */
  found: { images: 0, files: 0 },
});

export const perfRows = reactive({
  images: [],
  files: [],
  groups: [],
  onGroup: null,
  picked: '',
  active: '',
  onJump: null,
  emptyImages: '',
  emptyFiles: '',
});

/**
 * The Google tab, kept in its own store.
 *
 * A different reading of a different thing — their hardware, their throttling,
 * and their record of what real visitors met — so it keeps its own state rather
 * than pretending to be another view of the local one. Nothing in here is
 * touched unless the tab is opened.
 */
export const psiUi = reactive({
  /** idle | running | done | error | local */
  state: 'idle',
  message: '',
  strategy: 'mobile',
  strategies: [],
  onStrategy: null,
  onRun: null,
  runLabel: '',
  hint: '',
  score: null,
  grade: '',
  gradeLabel: '',
  cached: false,
  /** Lighthouse's own numbers from the run Google just did. */
  lab: [],
  /** What real Chrome users met, when the page has enough of them. */
  field: [],
  fieldTitle: '',
  fieldNote: '',
  fieldEmpty: '',
  opportunities: [],
  opportunitiesTitle: '',
});
