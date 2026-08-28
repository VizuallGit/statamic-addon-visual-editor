/**
 * Settings toggle: `pages`
 * Switch pages without leaving Live Preview.
 * Imports leftover helpers from cp.js. Does not get imported by cp.js.
 */
import { sve } from './cp-registry.js';
import { t } from './cp-t.js';
import { sveState } from './cp-state.js';
import { SELECTORS } from './cp-selectors.js';
import {
  FRAMED_CONTROL_STYLE,
  FRAMED_SELECT_STYLE,
  LP_SAVE_TIMEOUT,
  autoOpenLivePreview,
  coverForNavigation,
  isEmbeddedInSite,
  sendToPreview,
} from './cp.js';

async function gotoOverlay(win, url) {
  const overlay = await import('./overlay-host.js');

  overlay.gotoOverlay(win, url);
}

// ===== collection-picker =====
// --- Collection picker: move between entries without leaving the preview -------
//
// Live Preview is bound to one entry, so "staying in it" is really: navigate, and
// land back in it. `?live-preview=1` (autoOpenLivePreview) reopens it on arrival,
// so the seam doesn't show. Collections without a route have no page to render —
// they still appear, because jumping to "new blog post" is worth having, but they
// open the ordinary editor and say so.

export const COLLECTION_PICKER_ID = '__sve-collection-picker';
export const ENTRY_PICKER_ID = '__sve-entry-picker';
export const NEW_ENTRY_ID = '__sve-new-entry';

export const LP_COVER_ID = 'sve-lp-cover';

export function pickerCollections(win) {
  const list = win.Statamic?.$config?.get?.('sveCollections');

  return Array.isArray(list) ? list : [];
}

/** The entry currently open, from the CP URL. */
export function currentEntryId(win) {
  const match = win.location.pathname.match(/\/entries\/([^/]+)/);

  return match ? match[1] : null;
}

/**
 * Overlay that covers only the Live Preview iframe (falls back to full viewport).
 * Keeps confirms visually centered in the preview pane, not the whole CP.
 */
export function createPreviewCenteredOverlay(doc, id) {
  const overlay = doc.createElement('div');

  if (id) {
    overlay.id = id;
  }

  const iframe = doc.getElementById('live-preview-iframe');
  const rect = iframe?.getBoundingClientRect?.();

  if (rect && rect.width > 0 && rect.height > 0) {
    overlay.style.cssText =
      `position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;` +
      'z-index:2147483646;display:flex;align-items:center;justify-content:center;' +
      'background:rgba(0,0,0,.45);font-family:ui-sans-serif,system-ui,sans-serif;';
  } else {
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;' +
      'background:rgba(0,0,0,.45);font-family:ui-sans-serif,system-ui,sans-serif;';
  }

  return overlay;
}

export function dialogCardStyle(win) {
  return (
    'width:400px;max-width:92vw;background:var(--theme-color-content-bg,#fff);color:currentColor;' +
    'border-radius:12px;padding:22px;box-shadow:0 24px 64px rgba(0,0,0,.35);'
  );
}

/** Subtle Cancel chip — 10% white on dark CP, 10% black on light. */
export function dialogCancelButtonStyle(win) {
  const dark = win.document.documentElement.classList.contains('dark');

  return (
    `all:unset;cursor:pointer;padding:8px 14px;border-radius:8px;font-size:13px;font-weight:600;` +
    `color:currentColor;background:${dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)'};`
  );
}

/** Statamic primary — same as CP “Save & Publish”. */
export function dialogPrimaryButtonStyle() {
  return (
    'all:unset;cursor:pointer;padding:8px 14px;border-radius:8px;font-size:13px;font-weight:600;' +
    'background:var(--theme-color-primary,#4f46e5);color:#fff;'
  );
}

/** Destructive discard. */
export function dialogDangerButtonStyle() {
  return (
    'all:unset;cursor:pointer;padding:8px 14px;border-radius:8px;font-size:13px;font-weight:600;' +
    'background:#dc2626;color:#fff;'
  );
}

/**
 * Asks about unsaved work before leaving — a dialog, not a dropdown hanging off
 * whatever you happened to click. Losing edits is the kind of thing that deserves
 * the middle of the screen.
 */
export function confirmUnsaved(win, onSave, onDiscard, onCancel = () => {}) {
  const doc = win.document;
  const overlay = createPreviewCenteredOverlay(doc);

  const card = doc.createElement('div');

  card.style.cssText =
    dialogCardStyle(win).replace('width:400px', 'width:560px');
  card.innerHTML =
    `<div style="font-size:15px;font-weight:600;margin-bottom:6px;">${t(win, 'unsaved_title')}</div>` +
    `<div style="font-size:13px;opacity:.7;line-height:1.45;margin-bottom:18px;">${t(win, 'unsaved_body')}</div>` +
    '<div data-sve-actions style="display:flex;justify-content:flex-end;gap:8px;flex-wrap:nowrap;"></div>';

  const actions = card.querySelector('[data-sve-actions]');
  const close = () => overlay.remove();

  const button = (label, style, onClick) => {
    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.textContent = label;
    btn.style.cssText = style;
    btn.addEventListener('click', () => {
      close();
      onClick();
    });
    actions.appendChild(btn);
  };

  button(t(win, 'cancel'), dialogCancelButtonStyle(win), onCancel);
  button(
    t(win, 'unsaved_discard'),
    'all:unset;cursor:pointer;padding:8px 14px;border-radius:8px;font-size:13px;font-weight:600;color:currentColor;background:rgba(128,128,128,.16);',
    onDiscard
  );
  button(t(win, 'unsaved_save'), dialogPrimaryButtonStyle(), onSave);

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      close();
      onCancel();
    }
  });

  overlay.appendChild(card);
  doc.body.appendChild(overlay);
}

/**
 * Asks before leaving Theme Settings / a globals overlay with unsaved edits.
 * Save · discard · cancel. Clean overlay (or none) runs `onLeave` immediately.
 */
export function confirmLeaveGlobalsOverlay(win, onLeave, onCancel = () => {}) {
  if (!sve.isGlobalsOverlayOpen?.(win) || !sve.hasUnsavedGlobals(win)) {
    onLeave();

    return;
  }

  confirmCloseDiscard(
    win,
    { titleKey: 'globals_close_title', bodyKey: 'globals_close_body' },
    () => {
      sve.discardGlobalsChanges(win, { refresh: true, reloadForm: false }).then(onLeave);
    },
    onCancel,
    () => {
      sve.saveGlobalsPanel(win, (ok) => {
        if (ok) {
          onLeave();
        }
      });
    }
  );
}

/**
 * Close chrome / global focus with unsaved edits.
 * Cancel · Save (optional) · Close without saving.
 */
export function confirmCloseDiscard(
  win,
  { titleKey, bodyKey, confirmKey = 'discard_close' },
  onDiscard,
  onCancel = () => {},
  onSave = null
) {
  const doc = win.document;

  doc.getElementById('__sve-close-discard')?.remove();

  const overlay = createPreviewCenteredOverlay(doc, '__sve-close-discard');

  const card = doc.createElement('div');

  card.style.cssText = dialogCardStyle(win);
  card.innerHTML =
    `<div style="font-size:15px;font-weight:600;margin-bottom:6px;">${t(win, titleKey)}</div>` +
    `<div style="font-size:13px;opacity:.7;line-height:1.45;margin-bottom:18px;">${t(win, bodyKey)}</div>` +
    '<div data-sve-actions style="display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;"></div>';

  const actions = card.querySelector('[data-sve-actions]');
  const close = () => overlay.remove();

  const button = (label, style, onClick) => {
    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.textContent = label;
    btn.style.cssText = style;
    btn.addEventListener('click', () => {
      close();
      onClick();
    });
    actions.appendChild(btn);
  };

  button(t(win, 'cancel'), dialogCancelButtonStyle(win), onCancel);

  if (typeof onSave === 'function') {
    button(t(win, 'save'), dialogPrimaryButtonStyle(), onSave);
  }

  button(t(win, confirmKey), dialogDangerButtonStyle(), onDiscard);

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      close();
      onCancel();
    }
  });

  overlay.appendChild(card);
  doc.body.appendChild(overlay);
}

/**
 * Preview asked to leave header/footer focus. Warn if Theme Settings is dirty.
 */
export function handleRequestCloseChrome(win) {
  const finish = () => {
    sve.dismissChromeForPageEdit(win);
    // Closing the header/footer closes the drawer describing it. Parked, not
    // destroyed — form and stash survive, so stepping back in is instant. Only
    // on this deliberate exit: stepping sideways into a page section goes
    // through sve.dismissChromeForPageEdit alone and leaves the drawer alone.
    sve.parkGlobalsPanel(win);
    sendToPreview({ source: 'statamic-visual-editor', type: 'sve-force-exit-chrome' }, win);
  };

  if (!sve.hasUnsavedGlobals(win)) {
    finish();

    return;
  }

  confirmCloseDiscard(
    win,
    { titleKey: 'chrome_close_title', bodyKey: 'chrome_close_body' },
    () => {
      sve.discardGlobalsChanges(win, { refresh: true, reloadForm: true }).then(finish);
    },
    () => {},
    () => {
      sve.saveGlobalsPanel(win, (ok) => {
        if (ok) {
          finish();
        }
      });
    }
  );
}

/**
 * Preview asked to leave a global section. Warn if that section is dirty.
 */
export function handleRequestCloseGlobal(win) {
  const finish = () => {
    sve.closeGlobalSectionPanel(win);
    sendToPreview({ source: 'statamic-visual-editor', type: 'sve-force-exit-global' }, win);
  };

  if (!sve.hasUnsavedGlobalSection(win)) {
    finish();

    return;
  }

  confirmCloseDiscard(
    win,
    { titleKey: 'global_close_title', bodyKey: 'global_close_body' },
    () => finish()
  );
}

export const LP_NAV_SPINNER_ID = '__sve-nav-spinner';

/**
 * Dims the Live Preview canvas while the next page is on its way — overlay and
 * spinner fade in together, centred on the preview, not perched on the header.
 */
export function showNavSpinner(win) {
  const doc = win.document;

  if (doc.getElementById(LP_NAV_SPINNER_ID)) {
    return;
  }

  const overlay = createPreviewCenteredOverlay(doc, LP_NAV_SPINNER_ID);

  overlay.style.background = 'rgba(0,0,0,.6)';
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity .38s cubic-bezier(.4, 0, .2, 1)';
  overlay.style.pointerEvents = 'auto';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML =
    '<span style="display:flex;align-items:center;justify-content:center;width:44px;height:44px;' +
    'border-radius:999px;background:#000;color:#fff;box-shadow:0 4px 14px rgba(0,0,0,.35);">' +
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" ' +
    'stroke-linecap="round" style="animation:sve-lp-spin 1s linear infinite;">' +
    '<path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg></span>' +
    '<style>@keyframes sve-lp-spin{to{transform:rotate(360deg)}}</style>';
  doc.body.appendChild(overlay);
  void overlay.offsetWidth;
  overlay.style.opacity = '1';
}

export function hideNavSpinner(win) {
  const el = win.document.getElementById(LP_NAV_SPINNER_ID);

  if (!el || el.dataset.hiding) {
    return;
  }

  el.dataset.hiding = '1';
  el.style.opacity = '0';

  const remove = () => el.remove();

  el.addEventListener('transitionend', remove, { once: true });
  win.setTimeout(remove, 400);
}

/**
 * Saves, then goes where the user actually asked to go.
 *
 * Without revisions, Statamic answers a save with a redirect to the collection
 * listing — we swallow that and go ourselves, or we'd lose the race and land
 * in admin. With revisions there is no redirect (the form stays open), so
 * waiting for one left the spinner up forever after "Save and continue".
 *
 * If the save fails we stay put, because the error is in here.
 */
export function saveThenNavigate(win, go) {
  const router = win.__STATAMIC__?.inertia?.router;
  const save = sve.saveButtonIn(win.document);

  if (!save) {
    go();

    return;
  }

  if (typeof router?.on !== 'function') {
    sve.leaveQuietly(win, go); // no router to head off; a full load outruns the redirect

    return;
  }

  showNavSpinner(win);

  let settled = false;
  let redirectWait = null;
  let offBefore = () => {};
  let stop = () => {};

  const finish = (ok) => {
    if (settled) {
      return;
    }

    settled = true;
    stop();
    offBefore();
    clearTimeout(timer);
    clearTimeout(redirectWait);

    if (!ok) {
      hideNavSpinner(win);

      return;
    }

    sve.leaveQuietly(win, go);
  };

  // Listing redirect only (GET). The save itself is PATCH/POST — must not cancel it.
  offBefore = router.on('before', (event) => {
    const visit = event.detail?.visit;

    if (visit?.method && String(visit.method).toLowerCase() !== 'get') {
      return;
    }

    win.setTimeout(() => finish(true), 0);

    return false;
  });

  stop = sve.onEntrySave((ok) => {
    if (settled) {
      return;
    }

    if (!ok) {
      finish(false);

      return;
    }

    // Revisions stay on the form. Give a listing-redirect a beat, then leave.
    redirectWait = win.setTimeout(() => finish(true), 200);
  });

  const timer = win.setTimeout(() => finish(false), LP_SAVE_TIMEOUT);

  save.click();
}

/**
 * Moves to another entry without the page going out from under you.
 *
 * Always the overlay: the host boots the next editor hidden and swaps once it
 * has painted. Same from the front-end button and from the collection picker.
 */
export function navigateFromLp(win, anchor, url, onCancel = () => {}) {

  const go = () => {
    // By the time anything calls this, the unsaved question has been put to the
    // user and answered — on every path into it.
    sve.dismissDirtyWarning(win);
    win.document.getElementById(LP_NAV_SPINNER_ID)?.remove();

    // The editor always lives in the overlay iframe. The host (site or CP)
    // boots the next page hidden and swaps once it has painted — same move
    // from the front-end button and from the collection picker. The dim
    // overlay lives on the host so it can fade out over the new page.
    if (isEmbeddedInSite(win)) {
      const onFail = (event) => {
        if (event.origin !== win.location.origin) {
          return;
        }

        if (event.data?.source !== 'statamic-visual-editor' || event.data.type !== 'lp-goto-failed') {
          return;
        }

        win.removeEventListener('message', onFail);
        hideNavSpinner(win);
        coverForNavigation(win, { blocking: true, then: () => (win.location.href = url) });
      };

      win.addEventListener('message', onFail);
      gotoOverlay(win, url);

      return;
    }

    gotoOverlay(win, url);
  };

  if (!sve.hasUnsavedWork(win) || (!sve.saveButtonIn(win.document) && !sve.hasUnsavedGlobals(win) && !sve.hasUnsavedGlobalSection(win))) {
    go();

    return;
  }

  confirmUnsaved(
    win,
    () => {
      // Globals / synced sections first, then the entry.
      sve.saveGlobalsPanel(win, (ok) => {
        if (!ok) {
          onCancel();

          return;
        }

        sve.saveGlobalSectionPanel(win, (sectionOk) => {
          if (!sectionOk) {
            onCancel();

            return;
          }

          if (!sve.hasUnsavedChanges(win) || !sve.saveButtonIn(win.document)) {
            go();

            return;
          }

          saveThenNavigate(win, go);
        });
      });
    },
    () => {
      sve.discardChanges(win);
      sve.discardGlobalsChanges(win);
      sve.clearSectionsStash(win, { refresh: false });
      go();
    },
    onCancel
  );
}

/**
 * "New page": a title and a slug, and you're in it.
 *
 * The Control Panel's create screen would do this too, but it's a whole form on a
 * whole other page — and there is nothing to fill in yet. This asks the two things
 * that can't be guessed and creates the entry bare, so the next thing you see is
 * the page itself, ready to build.
 */
export function newEntryDialog(win, collection, onCreated) {
  const doc = win.document;
  const overlay = doc.createElement('div');

  overlay.style.cssText =
    'position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;' +
    'background:rgba(0,0,0,.45);font-family:ui-sans-serif,system-ui,sans-serif;';

  const card = doc.createElement('div');
  const input =
    'width:100%;box-sizing:border-box;height:36px;padding:0 10px;border-radius:8px;' +
    'border:1px solid rgba(128,128,128,.4);background:transparent;color:currentColor;font-size:14px;';

  card.style.cssText =
    'width:420px;max-width:92vw;background:var(--theme-color-content-bg,#fff);color:currentColor;' +
    'border-radius:12px;padding:22px;box-shadow:0 24px 64px rgba(0,0,0,.35);';
  card.innerHTML = `
    <div style="font-size:15px;font-weight:600;margin-bottom:16px;">${t(win, 'new_in', { collection: collection.title })}</div>
    <label style="display:block;font-size:12px;font-weight:500;margin-bottom:5px;">${t(win, 'title')}</label>
    <input type="text" data-sve-title style="${input}margin-bottom:12px;">
    <label style="display:block;font-size:12px;font-weight:500;margin-bottom:5px;">${t(win, 'slug')}</label>
    <input type="text" data-sve-slug style="${input}">
    <div data-sve-error style="display:none;font-size:12px;color:#dc2626;margin-top:8px;"></div>
    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:20px;">
      <button type="button" data-sve-cancel style="all:unset;cursor:pointer;padding:8px 14px;border-radius:8px;font-size:13px;color:currentColor;opacity:.75;">${t(win, 'cancel')}</button>
      <button type="button" data-sve-create style="all:unset;cursor:pointer;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;background:var(--theme-color-primary,#4f46e5);color:#fff;">${t(win, 'create')}</button>
    </div>
  `;

  overlay.appendChild(card);
  doc.body.appendChild(overlay);

  const title = card.querySelector('[data-sve-title]');
  const slug = card.querySelector('[data-sve-slug]');
  const error = card.querySelector('[data-sve-error]');
  const create = card.querySelector('[data-sve-create]');
  const close = () => overlay.remove();

  title.focus();

  // The slug follows the title until it's touched, and then it's yours — retyping
  // the title shouldn't quietly undo a slug you chose on purpose.
  let slugOwned = false;

  slug.addEventListener('input', () => (slugOwned = true));
  title.addEventListener('input', () => {
    if (!slugOwned) {
      slug.value = slugify(title.value);
    }
  });

  const submit = () => {
    const name = title.value.trim();

    if (!name) {
      title.focus();

      return;
    }

    create.style.opacity = '.6';
    create.style.pointerEvents = 'none';
    error.style.display = 'none';

    win
      .fetch(`/!/sve/collections/${encodeURIComponent(collection.handle)}/entries`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': sve.csrfToken(win),
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ title: name, slug: slug.value.trim() }),
      })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));

        if (!res.ok) {
          // A taken slug is the one failure worth answering in place.
          error.textContent = body.message || t(win, 'create_failed');
          error.style.display = 'block';
          create.style.opacity = '1';
          create.style.pointerEvents = '';

          return;
        }

        close();
        onCreated(body.id);
      })
      .catch(() => {
        error.textContent = t(win, 'create_failed');
        error.style.display = 'block';
        create.style.opacity = '1';
        create.style.pointerEvents = '';
      });
  };

  card.querySelector('[data-sve-cancel]').addEventListener('click', close);
  create.addEventListener('click', submit);
  overlay.addEventListener('click', (event) => event.target === overlay && close());
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      submit();
    } else if (event.key === 'Escape') {
      close();
    }
  });
}

/** The slug Statamic would make: lowercase, ascii-ish, hyphenated. */
export function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[æ]/g, 'ae')
    .replace(/[ø]/g, 'oe')
    .replace(/[å]/g, 'aa')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function ensureCollectionPicker(win) {
  const doc = win.document;
  const header = sve.lpHeader(doc);
  const collections = pickerCollections(win);

  if (!header || !collections.length || doc.getElementById(COLLECTION_PICKER_ID)) {
    return;
  }

  const wrap = doc.createElement('div');

  // Ingen egen flade: den ligger i panelets sammensatte felt, og felterne her
  // skilles ad af de samme lyse streger som i zoom.
  wrap.style.cssText = 'display:inline-flex;align-items:center;gap:6px;font-family:inherit;';

  const collectionSelect = doc.createElement('select');

  collectionSelect.id = COLLECTION_PICKER_ID;
  collectionSelect.style.cssText = FRAMED_SELECT_STYLE;

  collections.forEach((collection) => {
    const option = doc.createElement('option');

    option.value = collection.handle;
    // Say it in the option rather than only on hover: you shouldn't have to
    // discover that a collection can't be previewed by picking it.
    option.textContent = collection.previewable
      ? collection.title
      : `${collection.title} · ${t(win, 'no_preview_collection')}`;
    collectionSelect.appendChild(option);
  });

  const entrySelect = doc.createElement('select');

  entrySelect.id = ENTRY_PICKER_ID;
  entrySelect.style.cssText = `${FRAMED_SELECT_STYLE}max-width:220px;`;

  const newBtn = doc.createElement('button');

  newBtn.type = 'button';
  newBtn.id = NEW_ENTRY_ID;
  newBtn.textContent = `+ ${t(win, 'new_entry')}`;
  // Same flat primary as Visible / active device pills.
  newBtn.style.cssText =
    `${FRAMED_CONTROL_STYLE}padding:0 .75rem;font-weight:600;` +
    `background:${sve.LP_PRIMARY_FLAT};color:#fff;opacity:1;border:none;box-shadow:none;`;

  const selected = () => collections.find((c) => c.handle === collectionSelect.value);

  const fillEntries = async (keepCurrent) => {
    const collection = selected();

    entrySelect.innerHTML = '';
    newBtn.title = t(win, 'new_in', { collection: collection?.title ?? '' });
    collectionSelect.title = collection?.previewable
      ? ''
      : t(win, 'no_preview_hint', { collection: collection?.title ?? '' });

    const placeholder = doc.createElement('option');

    placeholder.value = '';
    placeholder.textContent = t(win, 'choose_entry');
    entrySelect.appendChild(placeholder);

    let entries = [];

    try {
      const res = await win.fetch(`/!/sve/collections/${encodeURIComponent(collectionSelect.value)}/entries`, {
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      });

      entries = res.ok ? (await res.json()).entries ?? [] : [];
    } catch {
      entries = [];
    }

    entries.forEach((entry) => {
      const option = doc.createElement('option');

      option.value = entry.id;
      option.textContent = entry.published ? entry.title : `${entry.title} ·`;
      entrySelect.appendChild(option);
    });

    if (keepCurrent) {
      entrySelect.value = currentEntryId(win) ?? '';
    }
  };

  collectionSelect.addEventListener('change', () => fillEntries(false));

  entrySelect.addEventListener('change', () => {
    if (!entrySelect.value || entrySelect.value === currentEntryId(win)) {
      return;
    }

    const collection = selected();
    const url =
      `${win.location.origin}/cp/collections/${encodeURIComponent(collection.handle)}` +
      `/entries/${encodeURIComponent(entrySelect.value)}${collection.previewable ? '?live-preview=1' : ''}`;

    // Stay-put has to look like staying put: if the trip is called off, the
    // picker goes back to naming the entry that's actually open.
    navigateFromLp(win, entrySelect, url, () => {
      entrySelect.value = currentEntryId(win) ?? '';
    });
  });

  newBtn.addEventListener('click', () => {
    const collection = selected();

    newEntryDialog(win, collection, (id) => {
      const url =
        `${win.location.origin}/cp/collections/${encodeURIComponent(collection.handle)}` +
        `/entries/${encodeURIComponent(id)}${collection.previewable ? '?live-preview=1' : ''}`;

      // The entry already exists by now, so there is nothing unsaved to ask about
      // — but this is the route that knows how to land in a preview.
      navigateFromLp(win, newBtn, url);
    });
  });

  wrap.appendChild(collectionSelect);
  wrap.appendChild(entrySelect);
  wrap.appendChild(newBtn);
  header.appendChild(wrap);

  // Open on whatever you're already editing, so the picker reads as "you are
  // here" rather than an empty control.
  collectionSelect.value = sve.currentCollection(win) ?? collections[0].handle;
  fillEntries(true);
}



sve.COLLECTION_PICKER_ID = COLLECTION_PICKER_ID;
sve.ENTRY_PICKER_ID = ENTRY_PICKER_ID;
sve.NEW_ENTRY_ID = NEW_ENTRY_ID;
sve.LP_COVER_ID = LP_COVER_ID;
sve.pickerCollections = pickerCollections;
sve.currentEntryId = currentEntryId;
sve.createPreviewCenteredOverlay = createPreviewCenteredOverlay;
sve.dialogCardStyle = dialogCardStyle;
sve.dialogCancelButtonStyle = dialogCancelButtonStyle;
sve.dialogPrimaryButtonStyle = dialogPrimaryButtonStyle;
sve.dialogDangerButtonStyle = dialogDangerButtonStyle;
sve.confirmUnsaved = confirmUnsaved;
sve.confirmLeaveGlobalsOverlay = confirmLeaveGlobalsOverlay;
sve.confirmCloseDiscard = confirmCloseDiscard;
sve.handleRequestCloseChrome = handleRequestCloseChrome;
sve.handleRequestCloseGlobal = handleRequestCloseGlobal;
sve.LP_NAV_SPINNER_ID = LP_NAV_SPINNER_ID;
sve.showNavSpinner = showNavSpinner;
sve.hideNavSpinner = hideNavSpinner;
sve.saveThenNavigate = saveThenNavigate;
sve.navigateFromLp = navigateFromLp;
sve.newEntryDialog = newEntryDialog;
sve.slugify = slugify;
sve.ensureCollectionPicker = ensureCollectionPicker;
