/**
 * Super-admin AI chat in Live Preview.
 *
 * Not an iframe of Cursor/Claude, and not the Statamic MCP addon. Those talk
 * to Statamic from the developer's machine. This panel calls Anthropic from
 * the Control Panel and runs a local Cursor agent on this site.
 *
 * Write mode returns markup in the sidebar so it can be copied or inserted —
 * files stay untouched. Build mode edits the selected section on disk.
 */

import { currentTemplateType, insertAiSnippet, isCodeDockLocked, isCodeDockOpen, refreshCodeDockFromDisk } from './code-dock.js';
import { chromeGet, chromeSet } from './chrome-prefs.js';
import { RIGHT_PANEL_FILL, releaseRightShellIfEmpty, showInRightShell } from './right-dock.js';

const PANEL_ID = '__sve-ai-panel';
const MODE_KEY = 'sve-ai-panel-mode';

let messages = [];
let sending = false;
let mode = 'write';

export function aiPanelAllowed(win) {
  return win.Statamic?.$config?.get?.('sveFeatures')?.ai_panel === true;
}

export function isAiPanelOpen(doc) {
  return !!doc?.getElementById(PANEL_ID);
}

export function closeAiPanel(win) {
  win?.document?.getElementById(PANEL_ID)?.remove();
  releaseRightShellIfEmpty(win);
}

export function ensureAiPanel(win) {
  if (!aiPanelAllowed(win) || isAiPanelOpen(win.document)) {
    return;
  }

  openAiPanel(win);
}

export function toggleAiPanel(win) {
  if (!aiPanelAllowed(win)) {
    return;
  }

  if (isAiPanelOpen(win.document)) {
    closeAiPanel(win);

    return;
  }

  openAiPanel(win);
}

function t(win, key) {
  return win.Statamic?.$config?.get?.('sveStrings')?.[key] ?? key;
}

function csrfToken(win) {
  return (
    win.document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
    win.Statamic?.$config?.get?.('csrfToken') ||
    win.Statamic?.$config?.get?.('csrf_token') ||
    ''
  );
}

function storedMode(win) {
  return chromeGet(win, MODE_KEY) === 'build' ? 'build' : 'write';
}

function persistMode(win, next) {
  mode = next === 'build' ? 'build' : 'write';
  chromeSet(win, MODE_KEY, mode);
}

function previewDocument(win) {
  const iframe = win.document.getElementById('live-preview-iframe');

  try {
    return iframe?.contentDocument || null;
  } catch {
    return null;
  }
}

function outermostSectionType(el) {
  if (!el) {
    return '';
  }

  let type = el.getAttribute('data-type') || '';

  while (el) {
    const parent = el.parentElement?.closest('[data-replicator-set]');

    if (!parent) {
      break;
    }

    el = parent;
    type = el.getAttribute('data-type') || type;
  }

  return type;
}

function typeInDocument(doc) {
  if (!doc) {
    return '';
  }

  const marked =
    doc.querySelector('[data-sve-solo-parent][data-type], [data-replicator-set][data-sve-solo-parent]') ||
    doc.querySelector('[data-replicator-set][data-sve-active], [data-sve-active][data-type]');

  return outermostSectionType(marked);
}

function currentSectionType(win) {
  return typeInDocument(win.document) || typeInDocument(previewDocument(win)) || currentTemplateType();
}

function modeBtnStyle(active) {
  return (
    'all:unset;cursor:pointer;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:' +
    (active ? '600' : '500') +
    ';background:' +
    (active ? 'var(--theme-color-primary,#4f46e5)' : 'rgba(128,128,128,.22)') +
    ';color:' +
    (active ? '#fff' : 'currentColor')
  );
}

function openAiPanel(win) {
  const doc = win.document;
  const panel = doc.createElement('div');

  mode = storedMode(win);

  panel.id = PANEL_ID;
  panel.style.cssText = RIGHT_PANEL_FILL;

  panel.innerHTML = `
    <div style="display:flex;align-items:center;flex:0 0 auto;gap:6px;">
      <div data-sve-right-title>
        <span data-sve-ai-name>${t(win, 'ai_panel_title')}</span>
        <span data-sve-ai-type></span>
      </div>
      <div data-sve-ai-modes></div>
      <button type="button" data-sve-close>✕</button>
    </div>
    <div data-sve-ai-hint style="padding:var(--sve-right-body-pad-block) 0 0;font-size:12px;opacity:.65;flex:0 0 auto;line-height:1.4;"></div>
    <div data-sve-ai-log style="flex:1 1 auto;min-height:0;overflow-y:auto;padding:var(--sve-right-body-pad-block) 0;display:flex;flex-direction:column;gap:10px;"></div>
    <form data-sve-ai-form style="flex:0 0 auto;border-top:1px solid rgba(128,128,128,.2);padding:var(--sve-right-body-pad-block) 0;display:flex;flex-direction:column;gap:8px;">
      <textarea data-sve-ai-input rows="4" style="width:100%;box-sizing:border-box;resize:vertical;min-height:88px;max-height:200px;padding:10px 12px;border-radius:8px;border:1px solid rgba(128,128,128,.28);background:transparent;color:inherit;font:inherit;font-size:13px;"></textarea>
      <button type="submit" data-sve-ai-send style="all:unset;cursor:pointer;box-sizing:border-box;width:100%;text-align:center;padding:8px 12px;border-radius:8px;background:var(--theme-color-primary,#4f46e5);color:#fff;font-size:13px;font-weight:600;">${t(win, 'ai_panel_send')}</button>
    </form>
  `;

  panel.querySelector('[data-sve-close]').addEventListener('click', () => {
    closeAiPanel(win);
    win.dispatchEvent(new Event('sve-ai-closed'));
  });
  panel.querySelector('[data-sve-ai-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    sendAi(win);
  });
  panel.querySelector('[data-sve-ai-input]').addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendAi(win);
    }
  });

  showInRightShell(win, panel);
  paintAiModes(win);
  paintAiChrome(win);
  paintAiLog(win);
}

function paintAiModes(win) {
  const wrap = win.document.querySelector(`#${PANEL_ID} [data-sve-ai-modes]`);

  if (!wrap) {
    return;
  }

  wrap.innerHTML = '';

  for (const id of ['write', 'build']) {
    const btn = win.document.createElement('button');

    btn.type = 'button';
    btn.setAttribute('data-sve-ai-mode', id);
    btn.textContent = t(win, id === 'build' ? 'ai_panel_mode_build' : 'ai_panel_mode_write');
    btn.style.cssText = modeBtnStyle(mode === id);
    btn.addEventListener('click', () => {
      persistMode(win, id);
      paintAiModes(win);
      paintAiChrome(win);
    });
    wrap.appendChild(btn);
  }
}

function paintAiChrome(win) {
  const typeEl = win.document.querySelector(`#${PANEL_ID} [data-sve-ai-type]`);
  const hintEl = win.document.querySelector(`#${PANEL_ID} [data-sve-ai-hint]`);
  const input = win.document.querySelector(`#${PANEL_ID} [data-sve-ai-input]`);
  const type = currentSectionType(win);

  if (typeEl) {
    if (mode === 'build') {
      typeEl.textContent = type
        ? t(win, 'ai_panel_building_for').replace(':type', type)
        : t(win, 'ai_panel_need_section_build');
    } else {
      typeEl.textContent = type
        ? t(win, 'ai_panel_writing_to').replace(':type', type)
        : t(win, 'ai_panel_need_section');
    }
  }

  if (hintEl) {
    hintEl.textContent = t(win, mode === 'build' ? 'ai_panel_hint_build' : 'ai_panel_hint');
  }

  if (input) {
    input.placeholder = t(win, mode === 'build' ? 'ai_panel_placeholder_build' : 'ai_panel_placeholder');
  }
}

function parseFences(text) {
  const blocks = [];
  const re = /```([A-Za-z0-9_-]*)[^\n]*\n([\s\S]*?)```/g;
  let last = 0;
  let match;

  while ((match = re.exec(text))) {
    const prose = text.slice(last, match.index).trim();

    if (prose) {
      blocks.push({ kind: 'text', content: prose });
    }

    blocks.push({
      kind: 'code',
      lang: (match[1] || '').toLowerCase(),
      content: match[2].replace(/\n$/, ''),
    });
    last = match.index + match[0].length;
  }

  const rest = text.slice(last).trim();

  if (rest) {
    blocks.push({ kind: 'text', content: rest });
  }

  if (!blocks.length && text) {
    blocks.push({ kind: 'text', content: text });
  }

  return blocks;
}

function snippetParts(blocks) {
  const parts = { html: '', css: '', js: '' };

  for (const block of blocks) {
    if (block.kind !== 'code' || !block.content.trim()) {
      continue;
    }

    if (block.lang === 'css') {
      parts.css = parts.css ? `${parts.css}\n\n${block.content}` : block.content;
    } else if (block.lang === 'js' || block.lang === 'javascript') {
      parts.js = parts.js ? `${parts.js}\n\n${block.content}` : block.content;
    } else if (block.lang === 'yaml' || block.lang === 'yml') {
      continue;
    } else {
      parts.html = parts.html ? `${parts.html}\n\n${block.content}` : block.content;
    }
  }

  return parts;
}

function hasSnippet(parts) {
  return !!(parts.html || parts.css || parts.js);
}

function copyText(win, text, btn, copiedLabel) {
  const done = () => {
    const prev = btn.textContent;

    btn.textContent = copiedLabel;
    win.setTimeout(() => {
      btn.textContent = prev;
    }, 1200);
  };

  if (win.navigator?.clipboard?.writeText) {
    win.navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(win, text, done));

    return;
  }

  fallbackCopy(win, text, done);
}

function fallbackCopy(win, text, done) {
  const area = win.document.createElement('textarea');

  area.value = text;
  area.setAttribute('readonly', '');
  area.style.cssText = 'position:fixed;left:-9999px;top:0;';
  win.document.body.appendChild(area);
  area.select();

  try {
    win.document.execCommand('copy');
    done();
  } catch {
    /* ignore */
  }

  area.remove();
}

function actionBtn(win, label) {
  const btn = win.document.createElement('button');

  btn.type = 'button';
  btn.textContent = label;
  btn.style.cssText =
    'all:unset;cursor:pointer;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:600;' +
    'background:rgba(128,128,128,.18);';

  return btn;
}

function paintAiLog(win) {
  const log = win.document.querySelector(`#${PANEL_ID} [data-sve-ai-log]`);

  if (!log) {
    return;
  }

  log.innerHTML = '';

  if (!win.Statamic?.$config?.get?.('sveAiReady')) {
    const note = win.document.createElement('div');

    note.style.cssText = 'font-size:13px;opacity:.7;line-height:1.45;';
    note.textContent = t(win, 'ai_panel_need_key');
    log.appendChild(note);
  }

  for (const row of messages) {
    const bubble = win.document.createElement('div');

    bubble.style.cssText =
      'font-size:13px;line-height:1.45;padding:8px 10px;border-radius:10px;word-break:break-word;' +
      (row.role === 'user'
        ? 'align-self:flex-end;background:rgba(128,128,128,.16);max-width:92%;white-space:pre-wrap;'
        : 'align-self:stretch;background:transparent;display:flex;flex-direction:column;gap:8px;');

    if (row.role === 'user') {
      bubble.textContent = row.content;
      log.appendChild(bubble);
      continue;
    }

    const blocks = parseFences(row.content);
    const parts = snippetParts(blocks);

    for (const block of blocks) {
      if (block.kind === 'text') {
        const p = win.document.createElement('div');

        p.style.cssText = 'white-space:pre-wrap;';
        p.textContent = block.content;
        bubble.appendChild(p);
        continue;
      }

      const wrap = win.document.createElement('div');
      const bar = win.document.createElement('div');
      const pre = win.document.createElement('pre');
      const copy = actionBtn(win, t(win, 'ai_panel_copy'));

      wrap.style.cssText = 'border:1px solid rgba(128,128,128,.22);border-radius:8px;overflow:hidden;';
      bar.style.cssText =
        'display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 8px;' +
        'background:rgba(128,128,128,.1);font-size:11px;opacity:.75;';
      bar.appendChild(win.document.createTextNode(block.lang || 'code'));
      bar.appendChild(copy);
      pre.style.cssText =
        'margin:0;padding:8px 10px;max-height:240px;overflow:auto;font:12px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace;' +
        'white-space:pre;';
      pre.textContent = block.content;
      copy.addEventListener('click', () => copyText(win, block.content, copy, t(win, 'ai_panel_copied')));
      wrap.appendChild(bar);
      wrap.appendChild(pre);
      bubble.appendChild(wrap);
    }

    if (row.mode === 'write' && hasSnippet(parts)) {
      const actions = win.document.createElement('div');
      const insert = actionBtn(win, t(win, 'ai_panel_insert'));

      actions.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;';
      insert.addEventListener('click', () => {
        if (!isCodeDockOpen(win.document)) {
          insert.textContent = t(win, 'ai_panel_insert_need_dock');
          win.setTimeout(() => {
            insert.textContent = t(win, 'ai_panel_insert');
          }, 1600);

          return;
        }

        if (isCodeDockLocked()) {
          insert.textContent = t(win, 'ai_panel_insert_locked');
          win.setTimeout(() => {
            insert.textContent = t(win, 'ai_panel_insert');
          }, 1600);

          return;
        }

        if (insertAiSnippet(win, parts)) {
          insert.textContent = t(win, 'ai_panel_inserted');
          win.setTimeout(() => {
            insert.textContent = t(win, 'ai_panel_insert');
          }, 1200);
        }
      });
      actions.appendChild(insert);
      bubble.appendChild(actions);
    }

    log.appendChild(bubble);
  }

  if (sending) {
    const wait = win.document.createElement('div');

    wait.style.cssText = 'font-size:12px;opacity:.55;';
    wait.textContent = t(win, 'ai_panel_thinking');
    log.appendChild(wait);
  }

  log.scrollTop = log.scrollHeight;
}

function sendAi(win) {
  if (sending) {
    return;
  }

  const input = win.document.querySelector(`#${PANEL_ID} [data-sve-ai-input]`);
  const text = input?.value.trim() || '';
  const type = currentSectionType(win);
  const sendMode = mode;

  if (!text) {
    return;
  }

  if (!win.Statamic?.$config?.get?.('sveAiReady')) {
    messages.push({ role: 'assistant', content: t(win, 'ai_panel_need_key') });
    paintAiLog(win);

    return;
  }

  messages.push({ role: 'user', content: text });
  input.value = '';
  sending = true;
  paintAiLog(win);

  win
    .fetch('/!/sve/ai-chat', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken(win),
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ type, messages, mode: sendMode }),
    })
    .then(async (res) => {
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || data.error || t(win, 'ai_panel_error'));
      }

      const reply = typeof data.reply === 'string' && data.reply.trim() ? data.reply.trim() : '';

      messages.push({
        role: 'assistant',
        mode: data.mode === 'build' ? 'build' : 'write',
        content: reply || (data.applied ? t(win, 'ai_panel_applied') : t(win, 'ai_panel_error')),
      });

      if (data.applied && data.mode === 'build') {
        refreshCodeDockFromDisk(win);
      }
    })
    .catch((err) => {
      messages.push({
        role: 'assistant',
        content: err?.message || t(win, 'ai_panel_error'),
      });
    })
    .finally(() => {
      sending = false;
      paintAiLog(win);
    });
}

export function relayoutAiPanel(win) {
  const panel = win.document.getElementById(PANEL_ID);

  if (!panel) {
    return;
  }

  paintAiChrome(win);
}
