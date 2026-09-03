/**
 * Site files on their own Control Panel page (Utilities → Site Files).
 *
 * Own surface: does not import overlay, preview, bridge, the template dock or
 * the style manager. The editor is set up the way site-css.js and code-dock.js
 * each set theirs up — a third copy of the CodeMirror boilerplate rather than a
 * shared one, because those two work today and pulling them onto a common base
 * would put the template dock at risk for a tidier diff.
 *
 * Utility pages are Inertia-rendered, so the host element arrives after boot and
 * leaves again on the next CP navigation — hence watchPage, which listens for
 * that navigation rather than for every DOM change on the page.
 */
import { mountSurface } from './cp/mount.js';
import { watchPage } from './cp/page-watch.js';
import { openCpOverlay } from './cp/open-overlay.js';
import { expandHtmlTab, htmlEmmetExtensions } from './html-emmet.js';
import { htmlTagSync } from './html-tag-sync.js';
import { t } from './cp-t.js';
import FileManagerPane from './cp/surfaces/FileManagerPane.vue';
import NamePrompt from './cp/surfaces/NamePrompt.vue';
import ChoiceDialog from './cp/surfaces/ChoiceDialog.vue';
import { fileManagerUi as ui } from './cp/file-manager/store.js';

export const FILES_UTILITY_HOST = 'sve-files-utility';

const API = '/!/sve/file-manager';

let EditorView;
let keymap;
let lineNumbers;
let highlightActiveLine;
let highlightActiveLineGutter;
let tooltips;
let EditorState;
let Compartment;
let defaultKeymap;
let indentWithTab;
let historyKeymap;
let history;
let autocompletion;
let closeBrackets;
let closeBracketsKeymap;
let completionKeymap;
let cssLang;
let htmlLang;
let jsLang;
let HighlightStyle;
let syntaxHighlighting;
let tags;

let cmReady = null;
let app = null;
let host = null;
let unbindFit = null;
let editor = null;
let langBox = null;
let applying = false;
let saved = '';
let loadSeq = 0;

function loadCm() {
  if (cmReady) {
    return cmReady;
  }

  cmReady = Promise.all([
    import('@codemirror/view'),
    import('@codemirror/state'),
    import('@codemirror/commands'),
    import('@codemirror/autocomplete'),
    import('@codemirror/lang-css'),
    import('@codemirror/lang-html'),
    import('@codemirror/lang-javascript'),
    import('@codemirror/language'),
    import('@lezer/highlight'),
  ])
    .then(([view, state, commands, complete, css, html, js, language, highlight]) => {
      EditorView = view.EditorView;
      keymap = view.keymap;
      lineNumbers = view.lineNumbers;
      highlightActiveLine = view.highlightActiveLine;
      highlightActiveLineGutter = view.highlightActiveLineGutter;
      tooltips = view.tooltips;
      EditorState = state.EditorState;
      Compartment = state.Compartment;
      defaultKeymap = commands.defaultKeymap;
      indentWithTab = commands.indentWithTab;
      historyKeymap = commands.historyKeymap;
      history = commands.history;
      autocompletion = complete.autocompletion;
      closeBrackets = complete.closeBrackets;
      closeBracketsKeymap = complete.closeBracketsKeymap;
      completionKeymap = complete.completionKeymap;
      cssLang = css.css;
      htmlLang = html.html;
      jsLang = js.javascript;
      HighlightStyle = language.HighlightStyle;
      syntaxHighlighting = language.syntaxHighlighting;
      tags = highlight.tags;
    })
    .catch((err) => {
      cmReady = null;
      throw err;
    });

  return cmReady;
}

function vscTheme() {
  return [
    EditorView.theme(
      {
        '&': { height: '100%', backgroundColor: '#242424', color: '#d4d4d4' },
        '.cm-content': {
          caretColor: '#aeafad',
          padding: '12px 0',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: '13px',
          lineHeight: '1.55',
        },
        '.cm-cursor': { borderLeftColor: '#aeafad' },
        '.cm-activeLine': { backgroundColor: '#ffffff0d' },
        '.cm-activeLineGutter': { backgroundColor: '#ffffff0d' },
        '.cm-gutters': {
          backgroundColor: '#242424',
          color: '#858585',
          border: 'none',
          borderRight: '1px solid #3c3c3c',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: '13px',
          lineHeight: '1.55',
        },
        '.cm-lineNumbers .cm-gutterElement': { paddingLeft: '8px', paddingRight: '12px' },
        '.cm-scroller': { overflow: 'auto', height: '100%', minHeight: 0 },
        '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
          backgroundColor: '#264f78 !important',
        },
      },
      { dark: true }
    ),
    syntaxHighlighting(
      HighlightStyle.define([
        { tag: tags.keyword, color: '#569cd6' },
        { tag: tags.string, color: '#ce9178' },
        { tag: tags.comment, color: '#6a9955', fontStyle: 'italic' },
        { tag: tags.number, color: '#b5cea8' },
        { tag: tags.className, color: '#d7ba7d' },
        { tag: tags.propertyName, color: '#9cdcfe' },
        { tag: tags.variableName, color: '#9cdcfe' },
        { tag: tags.tagName, color: '#569cd6' },
        { tag: tags.attributeName, color: '#9cdcfe' },
        { tag: tags.unit, color: '#b5cea8' },
        { tag: tags.color, color: '#ce9178' },
        { tag: tags.bracket, color: '#ffd700' },
        { tag: tags.punctuation, color: '#d4d4d4' },
        { tag: tags.operator, color: '#d4d4d4' },
        { tag: tags.definition(tags.propertyName), color: '#9cdcfe' },
      ])
    ),
  ];
}

/**
 * Antlers is HTML with braces in it, so it opens in the HTML mode. YAML and
 * plain text get no mode at all — a wrong grammar colours a file as if it were
 * broken, which is worse than no colour.
 *
 * HTML also gets what the template dock's HTML pane has, from the same modules:
 * tags close themselves, renaming `<h4>` renames its `</h4>` in one undo step,
 * and Tab expands Emmet and Antlers abbreviations. An Antlers file is an Antlers
 * file wherever it is opened — the two editors should not feel like two
 * different products.
 */
function languageExtension(name) {
  if (name === 'html') {
    return [htmlLang({ autoCloseTags: true }), htmlEmmetExtensions(), htmlTagSync()];
  }

  if (name === 'css') {
    return cssLang();
  }

  if (name === 'javascript') {
    return jsLang();
  }

  return [];
}

function csrfToken(win) {
  return (
    win.document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
    win.Statamic?.$config?.get?.('csrfToken') ||
    win.Statamic?.$config?.get?.('csrf_token') ||
    ''
  );
}

async function request(win, url, options = {}) {
  const res = await win.fetch(url, {
    credentials: 'same-origin',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-TOKEN': csrfToken(win),
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const err = new Error(String(res.status));

    err.status = res.status;

    throw err;
  }

  return res.json();
}

function paintLabels(win) {
  ui.title = t(win, 'files_title');
  ui.newFile = t(win, 'files_new_file');
  ui.newFolder = t(win, 'files_new_folder');
  ui.renameLabel = t(win, 'files_rename');
  ui.deleteLabel = t(win, 'files_delete');
  ui.saveLabel = t(win, 'files_save');
  ui.reloadTitle = t(win, 'files_reload');
  ui.emptyLabel = t(win, 'files_empty');
}

function flash(win, text, revertAfter = 0) {
  ui.status = text;

  if (revertAfter) {
    win.setTimeout(() => {
      if (ui.status === text) {
        ui.status = '';
      }
    }, revertAfter);
  }
}

function setContents(text, language) {
  if (!editor) {
    return;
  }

  applying = true;
  editor.dispatch({
    changes: { from: 0, to: editor.state.doc.length, insert: text },
    effects: langBox.reconfigure(languageExtension(language)),
  });
  applying = false;
  saved = text;
  ui.dirty = false;
}

function mountEditor(win, el) {
  editor?.destroy();
  editor = null;

  if (!el || !EditorView) {
    return;
  }

  langBox = new Compartment();

  editor = new EditorView({
    state: EditorState.create({
      doc: '',
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        langBox.of([]),
        closeBrackets(),
        autocompletion({ activateOnTyping: true }),
        tooltips({ parent: win.document.body }),
        keymap.of([
          ...defaultKeymap,
          // Before indentWithTab, and only where an abbreviation can mean
          // something. Returning false hands Tab on to indenting.
          {
            key: 'Tab',
            run: (view) => (ui.language === 'html' ? expandHtmlTab(view) : false),
          },
          indentWithTab,
          ...historyKeymap,
          ...completionKeymap,
          ...closeBracketsKeymap,
          {
            key: 'Mod-s',
            run: () => {
              void saveFile(win);

              return true;
            },
          },
        ]),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (!update.docChanged || applying) {
            return;
          }

          ui.dirty = editor.state.doc.toString() !== saved;
          ui.status = ui.dirty ? t(win, 'files_unsaved') : '';
        }),
        ...vscTheme(),
      ],
    }),
    parent: el,
  });
}

function applyListing(data) {
  if (data.root) {
    ui.root = data.root;
  }

  if (Array.isArray(data.tree)) {
    ui.tree = data.tree;
  }
}

async function loadTree(win) {
  applyListing(await request(win, API));
}

/** The folder a new file or folder is created in, given what is selected. */
function currentDir() {
  if (ui.path) {
    const at = ui.path.lastIndexOf('/');

    return at === -1 ? '' : ui.path.slice(0, at);
  }

  return ui.dir;
}

function join(dir, name) {
  return dir ? `${dir}/${name}` : name;
}

/** Open every folder on the way to a path, so a new file is visible at once. */
function revealPath(path) {
  const parts = String(path || '').split('/');

  parts.pop();

  let sofar = '';

  parts.forEach((part) => {
    sofar = join(sofar, part);
    ui.open = { ...ui.open, [sofar]: true };
  });
}

async function openFile(win, path) {
  if (!path) {
    return;
  }

  if (ui.dirty && ui.path && ui.path !== path && !(await saveFile(win))) {
    return;
  }

  const seq = ++loadSeq;

  ui.loading = true;
  ui.path = path;
  ui.dir = '';
  flash(win, t(win, 'files_loading'));

  try {
    const data = await request(win, `${API}/file?path=${encodeURIComponent(path)}`);

    if (seq !== loadSeq) {
      return;
    }

    ui.name = data.name || '';
    ui.language = data.language || 'text';
    setContents(String(data.contents ?? ''), ui.language);
    ui.status = '';
  } catch (err) {
    if (seq !== loadSeq) {
      return;
    }

    flash(win, err?.status === 413 ? t(win, 'files_too_big') : t(win, 'files_error'));
  } finally {
    if (seq === loadSeq) {
      ui.loading = false;
    }
  }
}

async function saveFile(win) {
  if (!ui.path || !editor) {
    return false;
  }

  flash(win, t(win, 'files_saving'));

  const text = editor.state.doc.toString();

  try {
    await request(win, `${API}/file`, {
      method: 'POST',
      body: JSON.stringify({ path: ui.path, contents: text }),
    });

    saved = text;
    ui.dirty = false;
    flash(win, t(win, 'files_saved'), 1200);

    return true;
  } catch {
    flash(win, t(win, 'files_error'));

    return false;
  }
}

async function reloadFile(win) {
  if (!ui.path) {
    return;
  }

  ui.dirty = false;
  await openFile(win, ui.path);
}

function prompt(win, { heading, label, placeholder, value = '', saveLabel, ok }) {
  const overlay = openCpOverlay(win.document, NamePrompt, {
    heading,
    nameLabel: label,
    placeholder,
    value,
    cancelLabel: t(win, 'cancel'),
    saveLabel: saveLabel || t(win, 'files_create'),
    onOk: (next) => {
      overlay.dismiss();
      void ok(next);
    },
  });
}

function addFile(win) {
  const dir = currentDir();

  prompt(win, {
    heading: t(win, 'files_new_file'),
    label: dir ? `${ui.root}/${dir}` : ui.root,
    placeholder: 'section.antlers.html',
    ok: async (name) => {
      try {
        const data = await request(win, `${API}/file/create`, {
          method: 'POST',
          body: JSON.stringify({ path: join(dir, name) }),
        });

        applyListing(data);
        revealPath(data.path);
        await openFile(win, data.path);
      } catch {
        flash(win, t(win, 'files_create_error'));
      }
    },
  });
}

function addFolder(win) {
  const dir = currentDir();

  prompt(win, {
    heading: t(win, 'files_new_folder'),
    label: dir ? `${ui.root}/${dir}` : ui.root,
    placeholder: 'partials',
    ok: async (name) => {
      const path = join(dir, name);

      try {
        const data = await request(win, `${API}/folder/create`, {
          method: 'POST',
          body: JSON.stringify({ path }),
        });

        applyListing(data);
        // An empty folder is not in the tree yet — nothing in it to show — so
        // it is simply selected, ready for "New file".
        ui.open = { ...ui.open, [path]: true };
        ui.path = '';
        ui.dir = data.path || path;
        flash(win, t(win, 'files_folder_made'), 2400);
      } catch {
        flash(win, t(win, 'files_create_error'));
      }
    },
  });
}

/**
 * Rename the open file, or the selected folder.
 *
 * The prompt holds the whole path from the root, not just the last part, so the
 * same box moves a file as well as renames it — typing a different folder in
 * front of the name is the move.
 */
function renameEntry(win) {
  const folder = !ui.path;
  const path = ui.path || ui.dir;

  if (!path) {
    return;
  }

  prompt(win, {
    heading: t(win, folder ? 'files_rename_folder' : 'files_rename_file'),
    label: ui.root,
    placeholder: path,
    value: path,
    saveLabel: t(win, 'files_rename'),
    ok: async (next) => {
      if (!next || next === path) {
        return;
      }

      try {
        const data = await request(win, `${API}/rename`, {
          method: 'POST',
          body: JSON.stringify({ from: path, to: next, folder }),
        });

        applyListing(data);
        revealPath(data.path);

        if (folder) {
          ui.dir = data.path;
        } else {
          ui.path = '';
          await openFile(win, data.path);
        }

        flash(win, t(win, 'files_renamed'), 1600);
      } catch {
        flash(win, t(win, 'files_rename_error'));
      }
    },
  });
}

function confirm(win, { title, body, confirmLabel, ok }) {
  const overlay = openCpOverlay(win.document, ChoiceDialog, {
    title,
    body,
    buttons: [
      { value: 'cancel', label: t(win, 'cancel'), variant: 'muted' },
      { value: 'ok', label: confirmLabel, variant: 'danger' },
    ],
    onPick: (value) => {
      overlay.dismiss();

      if (value === 'ok') {
        void ok();
      }
    },
  });
}

async function removeFile(win, path) {
  try {
    applyListing(
      await request(win, `${API}/file`, {
        method: 'DELETE',
        body: JSON.stringify({ path }),
      })
    );

    if (ui.path === path) {
      ui.path = '';
      ui.name = '';
      ui.language = 'text';
      setContents('', 'text');
    }

    flash(win, t(win, 'files_deleted'), 1600);
  } catch {
    flash(win, t(win, 'files_error'));
  }
}

async function removeFolder(win, path) {
  try {
    applyListing(
      await request(win, `${API}/folder`, {
        method: 'DELETE',
        body: JSON.stringify({ path }),
      })
    );

    if (ui.path.startsWith(`${path}/`)) {
      ui.path = '';
      ui.name = '';
      ui.language = 'text';
      setContents('', 'text');
    }

    ui.dir = '';
    flash(win, t(win, 'files_deleted'), 1600);
  } catch (err) {
    // 409: the folder holds something this screen never showed — a dotfile, a
    // .php file, an excluded folder. Say so rather than "failed".
    flash(win, err?.status === 409 ? t(win, 'files_folder_not_empty') : t(win, 'files_error'));
  }
}

async function remove(win) {
  if (ui.path) {
    confirm(win, {
      title: t(win, 'files_delete_file_title'),
      body: `${ui.root}/${ui.path}`,
      confirmLabel: t(win, 'files_delete'),
      ok: () => removeFile(win, ui.path),
    });

    return;
  }

  if (!ui.dir) {
    return;
  }

  const dir = ui.dir;

  // Count first: a folder is deleted with everything under it, and the number
  // is the only thing that makes that real before it happens.
  let stats = null;

  try {
    stats = await request(win, `${API}/folder?path=${encodeURIComponent(dir)}`);
  } catch {
    flash(win, t(win, 'files_error'));

    return;
  }

  confirm(win, {
    title: t(win, 'files_delete_folder_title'),
    body: t(win, 'files_delete_folder_body')
      .replace(':path', `${ui.root}/${dir}`)
      .replace(':count', String(stats.files ?? 0)),
    confirmLabel: t(win, 'files_delete'),
    ok: () => removeFolder(win, dir),
  });
}

function toggleDir(path) {
  ui.open = { ...ui.open, [path]: !ui.open[path] };
}

/**
 * Fill what is left of the page — across as well as down.
 *
 * The page is Inertia-rendered inside Statamic's own layout, so neither how far
 * down this frame starts nor how wide its wrapper lets it be is something CSS
 * here can know. Both are measured.
 *
 * Width matters more than it looks: the wrapper caps and centres, so on a narrow
 * window the frame fills and on a wide one it sits in the middle with a gap on
 * either side — the same page, two different layouts, depending on the monitor.
 * The frame is pulled out to the content column with margins of its own rather
 * than by editing the wrapper, which belongs to Statamic.
 *
 * In rem, because a viewport measurement is the one number that has to be taken
 * in pixels and nothing downstream of it should have to be.
 */
function fitFrame(win, el) {
  const frame = el.isConnected ? el.querySelector('[data-sve-files-frame]') : null;

  if (!frame) {
    return;
  }

  const rootSize = parseFloat(win.getComputedStyle(win.document.documentElement).fontSize) || 16;
  const inset = rootSize;

  // Measured with its own margins out of the way, so the numbers describe where
  // the wrapper puts it rather than where the last measurement left it.
  frame.style.marginLeft = '0px';
  frame.style.marginRight = '0px';

  const rect = frame.getBoundingClientRect();
  const band = bandFor(win, frame);

  if (band) {
    frame.style.marginLeft = `${(band.left + inset - rect.left) / rootSize}rem`;
    frame.style.marginRight = `${(rect.right - (band.right - inset)) / rootSize}rem`;
  } else {
    frame.style.marginLeft = '';
    frame.style.marginRight = '';
  }

  const available = win.innerHeight - frame.getBoundingClientRect().top - inset;

  frame.style.setProperty('--sve-files-height', `${Math.max(20, available / rootSize)}rem`);
}

/**
 * The column the page actually has, inside its padding.
 *
 * Not `main`: on a wide window that element is itself the capped, centred
 * container, so measuring it hands back the very width we are trying to escape.
 * What we want is the box the cap sits inside — the column beside the sidebar.
 *
 * So: the widest ancestor that starts clear of the window's left edge. Clear of
 * the edge is what says "beside the sidebar rather than behind it", and widest
 * is what steps over the cap to the column holding it. Ancestors that clip are
 * skipped, since reaching past one of those only hides the frame.
 */
function bandFor(win, frame) {
  let best = null;

  for (let el = frame.parentElement; el && el !== win.document.body; el = el.parentElement) {
    const style = win.getComputedStyle(el);

    if (style.overflowX !== 'visible' || style.position === 'fixed') {
      break;
    }

    const rect = el.getBoundingClientRect();

    if (rect.left <= 0 || rect.width <= 0) {
      continue;
    }

    const left = rect.left + (parseFloat(style.paddingLeft) || 0);
    const right = rect.right - (parseFloat(style.paddingRight) || 0);

    if (right - left > 0 && (!best || right - left > best.right - best.left)) {
      best = { left, right };
    }
  }

  return best;
}

function bindFit(win, el) {
  const run = () => fitFrame(win, el);

  run();
  // Twice: once now, and once after the layout has settled — a webfont or a
  // late-loading header moves the top edge after the first measurement.
  win.requestAnimationFrame(run);
  win.addEventListener('resize', run);

  return () => win.removeEventListener('resize', run);
}

function unmount() {
  unbindFit?.();
  unbindFit = null;
  editor?.destroy();
  editor = null;
  app?.unmount();
  app = null;
  host = null;
  saved = '';
  ui.path = '';
  ui.dir = '';
  ui.name = '';
  ui.tree = [];
  ui.dirty = false;
  ui.status = '';
}

function mount(win, el) {
  host = el;
  paintLabels(win);

  app = mountSurface(FileManagerPane, el, {
    onSelect: (path) => void openFile(win, path),
    onSelectDir: (path) => {
      ui.path = '';
      ui.dir = path;
    },
    onToggleDir: toggleDir,
    onAddFile: () => addFile(win),
    onAddFolder: () => addFolder(win),
    onRename: () => renameEntry(win),
    onDelete: () => void remove(win),
    onSave: () => void saveFile(win),
    onReload: () => void reloadFile(win),
  });

  unbindFit = bindFit(win, el);

  const editorHost = el.querySelector('[data-sve-files-host]');

  void loadCm()
    .then(() => {
      if (host !== el) {
        return null;
      }

      mountEditor(win, editorHost);

      return loadTree(win);
    })
    .catch(() => flash(win, t(win, 'files_error')));
}

function allowed(win) {
  if (win.Statamic?.$config?.get?.('sveEnabled') === false) {
    return false;
  }

  return win.Statamic?.$config?.get?.('sveFeatures')?.file_manager === true;
}

function sync(win) {
  const el = win.document.getElementById(FILES_UTILITY_HOST);

  if (el === host) {
    return;
  }

  unmount();

  if (el && allowed(win)) {
    mount(win, el);
  }
}

export function initFileManager(win = window) {
  watchPage(win, () => sync(win));
}
