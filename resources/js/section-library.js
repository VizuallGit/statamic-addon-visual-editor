/**
 * Settings toggle: `sections`
 * Section library / Patterns panel.
 * Imports leftover helpers from cp.js. Does not get imported by cp.js.
 */
import { t } from './lib/i18n.js';
import { sveState } from './cp-state.js';
import { SELECTORS } from './cp-selectors.js';
import {
  LP_SCALE_DEVICE_TO_PANE,
  applyHeaderTab,
  applyLpDevice,
  applyLpZoom,
  collectAncestorSets,
  expandSet,
  findSetByUid,
  paintLpPreviewChrome,
  positionLpBackButton,
  rowIsLocked,
  sameOrder,
  sendToPreview,
  setHeaderTab,
} from './cp.js';
import { emit } from './cp/bus.js';
import { relayoutCodeDock } from './code-dock-lazy.js';
import SectionLibraryPane from './cp/surfaces/SectionLibraryPane.vue';
import LibraryCard from './cp/surfaces/LibraryCard.vue';
import LibraryTabs from './cp/surfaces/LibraryTabs.vue';
import LibraryGroups from './cp/surfaces/LibraryGroups.vue';
import LibraryEmpty from './cp/surfaces/LibraryEmpty.vue';
import LibrarySaveButton from './cp/surfaces/LibrarySaveButton.vue';
import { mountPane } from './cp/mount-pane.js';
import {
  forgetLayoutSlots,
  layoutCards,
  layoutOpen,
  layoutSlots,
  layoutTabs,
  loadLayoutSlots,
} from './cp/library/layout-slots.js';
import {
  RIGHT_DOCK_ID,
  RIGHT_PANEL_FILL,
  isRightDockResizing,
  rightDockWidth,
  showInRightShell,
} from './right-dock.js';
import { checkPreviews, paintPreviewButtons, previewsAuto, setPreviewsAuto } from './previews-watch.js';
import {
  CHROME_DESIGNS_ID,
  COMMENTS_PANEL_ID,
  HTML_TREE_PANEL_ID,
  LIBRARY_BUTTON_ID,
  LISTVIEW_PANEL_ID,
  OUTLINE_PANEL_ID,
  PERF_PANEL_ID,
  SECTION_PICKER_ID,
} from './lib/ids.js';
import { unwrapRef } from './lib/values.js';
import { livePreviewEditorEl } from './lib/live-preview.js';
import { featureOn, sectionField } from './lib/config.js';
import { activeContainers } from './lib/publish-containers.js';
import { persistDockedPanel, setLpCollapsed } from './lp-panel.js';
import { savePageAsTemplate } from './inline-edit.js';
import { closeGlobalSectionPanel } from './global-section.js';
import { closeOutlinePanel } from './lazy/outline.js';
import { MSG, SOURCE } from './lib/protocol.js';
import { libraryState } from './library/state.js';
import {
  attachGlobalsOverlay,
  bindGlobalsOverlayLayout,
  closeRightPanels,
  closeSectionPicker,
  dismissChromeForPageEdit,
  dockedPanelWidth,
  isSectionLibraryLocked,
  placeGlobalsOverlay,
} from './library/panel-layout.js';
import { confirmDeleteLibraryItem } from './library/delete.js';
import { beginCardDrag } from './library/card-drag.js';
import { pollLibrary, refreshSectionTypes, reidSection, sectionTypes } from './library/types.js';
import {
  formHasSectionField,
  libraryGroupKey,
  libraryGroupKeys,
  libraryGroupLabel,
  libraryMatchesQuery,
  sectionGroups,
} from './library/picker.js';
import { fetchSetMeta } from './library/insert.js';
import { metaForPath, removeEmptiedBlock, rowLimits, rowLocation } from './library/row-ops.js';
import {
  fetchNestedSetMeta,
  hydrateExistingMeta,
  removeNestedRowMeta,
  rowMetaTemplate,
  writeNestedRowMeta,
} from './library/row-meta.js';

export * from './library/types.js';
export * from './library/row-meta.js';
export * from './library/insert.js';
export * from './library/panel-layout.js';
export * from './library/picker.js';
export * from './library/delete.js';
export * from './library/card-drag.js';
export * from './library/row-ops.js';
export let libraryCatchupTimer = 0;

/**
 * Stepping into a header, a footer or a global section locks the page around
 * it: the other sections fade, and a click out there does nothing. The top bar
 * is not part of that lock. Its icons stay live wherever you are: a page-level
 * tool (another page, another global set, the section library) leaves what owns
 * the editor first, the way a section click does, instead of going grey and
 * dead until you find the way out on the bar at the bottom.
 */

/**
 * Leave whatever owns the editor — chrome, a global section, or both — so a
 * page-level tool has the page to act on. Nothing owns it: nothing happens.
 */
export function leaveFocusLock(win) {
  if (!isSectionLibraryLocked(win)) {
    return false;
  }

  dismissChromeForPageEdit(win);
  closeGlobalSectionPanel(win);
  sendToPreview({ source: SOURCE, type: MSG.SVE_FORCE_EXIT_CHROME }, win);
  sendToPreview({ source: SOURCE, type: MSG.SVE_FORCE_EXIT_GLOBAL }, win);
  syncSectionLibraryAvailability(win);

  return true;
}

/**
 * Hide/disable the Sections header button (and close what those tools have open)
 * while chrome or a global section owns the editor — dragging sections there is
 * a no-op, and a panel left standing would sit over the fields you came for.
 */
export function syncSectionLibraryAvailability(win) {
  const doc = win.document;
  const locked = isSectionLibraryLocked(win);
  const btn = doc.getElementById(LIBRARY_BUTTON_ID);

  if (locked) {
    closeSectionPicker(win);
    closeOutlinePanel(win);

    if (btn) {
      btn.style.display = 'none';
      btn.setAttribute('aria-disabled', 'true');
      btn.disabled = true;
    }

    applyHeaderTab(win);

    return;
  }

  if (btn) {
    btn.style.display = '';
    btn.removeAttribute('aria-disabled');
    btn.disabled = false;
  }

  applyHeaderTab(win);
}

/**
 * Push the preview away from RIGHT-docked panels (Theme Settings, sections library, …).
 */
export function syncPreviewInset(win) {
  if (isRightDockResizing()) {
    return;
  }

  const doc = win.document;
  const el = doc.querySelector('.live-preview-contents');

  if (!el) {
    return;
  }

  const right = dockedPanelWidth(doc, [
    RIGHT_DOCK_ID,
    SECTION_PICKER_ID,
    OUTLINE_PANEL_ID,
    HTML_TREE_PANEL_ID,
    LISTVIEW_PANEL_ID,
    COMMENTS_PANEL_ID,
    PERF_PANEL_ID,
    '__sve-ai-panel',
  ]);

  el.style.transition = 'padding-right .2s ease';
  el.style.paddingRight = right ? `${right}px` : '';
  el.style.paddingLeft = '';
  relayoutCodeDock(win);

  if (LP_SCALE_DEVICE_TO_PANE) {
    applyLpDevice(win);
    applyLpZoom(win);
    paintLpPreviewChrome(win);
    win.setTimeout(() => {
      applyLpDevice(win);
      applyLpZoom(win);
      paintLpPreviewChrome(win);
    }, 220);
  }

  positionLpBackButton(win);
}

/**
 * Dock Theme Settings over the LEFT Live Preview editor.
 * Stays on document.body — reparenting an iframe reloads it (preview flicker).
 */
export function pinGlobalsPanelLeft(win, panel) {
  attachGlobalsOverlay(win, panel);
  sveState.forcePanelOpen = true;
  setLpCollapsed(win, false);
  applyHeaderTab(win);

  const editor = livePreviewEditorEl(win.document);

  if (editor && win.getComputedStyle(editor).position === 'static') {
    editor.style.position = 'relative';
  }

  panel.hidden = false;
  panel.removeAttribute('data-sve-chrome-hidden');
  bindGlobalsOverlayLayout(win);
  placeGlobalsOverlay(win);
  applyHeaderTab(win);
}

/**
 * Open Statamic's left Live Preview editor and keep it open. Chrome UI mounts
 * inside it so switching footer ↔ hero never changes sidebar width.
 */
export function claimLivePreviewEditor(win) {
  if (sveState.headerTab === 'settings') {
    setHeaderTab(win, null);
  }

  sveState.forcePanelOpen = true;
  setLpCollapsed(win, false);
  applyHeaderTab(win);

  const editor = livePreviewEditorEl(win.document);

  if (editor && win.getComputedStyle(editor).position === 'static') {
    editor.style.position = 'relative';
  }
}

/** Build the sections library panel. Caller has already handled globals. */
export function mountSectionPicker(win, options = {}) {
  const doc = win.document;
  const initialTab = options.tab || null;

  if (doc.getElementById(SECTION_PICKER_ID)) {
    return;
  }

  closeRightPanels(win, [SECTION_PICKER_ID, CHROME_DESIGNS_ID]);

  const panel = doc.createElement('div');

  panel.id = SECTION_PICKER_ID;
  panel.style.cssText = RIGHT_PANEL_FILL;
  mountPane(panel, SectionLibraryPane, {
    title: t(win, 'sections'),
    hint: t(win, 'library_hint'),
    searchPlaceholder: t(win, 'library_search_placeholder'),
    refreshLabel: t(win, 'previews_refresh'),
  });

  // Fade sits on a sibling, not on the scroller. Setting mask-image on a
  // scrollable element resets scrollLeft in Chrome.
  const syncGroupsFade = () => {
    const groups = panel.querySelector('[data-sve-groups]');
    const fade = panel.querySelector('[data-sve-groups-fade]');

    if (!groups || !fade) {
      return;
    }

    const more = groups.scrollWidth - groups.clientWidth - groups.scrollLeft > 1;

    fade.style.display = more ? 'block' : 'none';
  };

  const applyLibraryLayout = () => {
    const w = panel.getBoundingClientRect().width || rightDockWidth(win);
    const cols = w >= 720 ? 3 : w >= 480 ? 2 : 1;
    const grid = panel.querySelector('[data-sve-grid]');
    const next = String(cols);

    syncGroupsFade();

    if (!grid || grid.style.columnCount === next) {
      return;
    }

    // Masonry lives on an unconstrained inner box; the outer [data-sve-scroll]
    // scrolls. Putting column-count on the scroll box itself overflows sideways.
    grid.style.columnCount = next;
  };

  showInRightShell(win, panel);
  applyLibraryLayout();
  syncPreviewInset(win);

  try {
    const ro = new win.ResizeObserver(() => applyLibraryLayout());

    ro.observe(panel);
    panel._sveLibRo = ro;
  } catch {
    win.addEventListener('resize', applyLibraryLayout);
  }

  const tabsEl = panel.querySelector('[data-sve-tabs]');
  const searchEl = panel.querySelector('[data-sve-search]');
  const groupsWrap = panel.querySelector('[data-sve-groups-wrap]');
  const groupsEl = panel.querySelector('[data-sve-groups]');
  const gridEl = panel.querySelector('[data-sve-grid]');

  panel.querySelector('[data-sve-close]')?.addEventListener('click', () => {
    closeSectionPicker(win);

    if (sveState.headerTab === 'sections') {
      setHeaderTab(win, null);
    }

    persistDockedPanel(win);
    applyHeaderTab(win);
  });
  groupsEl.addEventListener('scroll', syncGroupsFade);

  const pageTabs = [
    { key: 'page', feature: 'library_page', label: t(win, 'tab_page') },
    { key: 'custom', feature: 'library_custom', label: t(win, 'tab_custom') },
    { key: 'global', feature: 'library_global', label: t(win, 'tab_global') },
    { key: 'template', feature: 'library_templates', label: t(win, 'tab_templates') },
  ].filter((tab) => featureOn(win, tab.feature));

  // On the layout the panel offers the layout's places instead — its header,
  // its footer, the global sections under every page — and nothing a page
  // builder takes. Read again on every render: Live Preview may have moved on
  // to a page, or back, with the panel still standing.
  let layoutMode = layoutOpen(win);
  let tabs = layoutMode ? layoutTabs(win) : pageTabs;

  forgetLayoutSlots();

  // 'page' is the natural landing tab, but a site can switch it off — then the
  // first tab that survived is what opens.
  const fallbackTab = () => (tabs.some((tab) => tab.key === 'page') ? 'page' : tabs[0]?.key);
  let active = initialTab && tabs.some((tab) => tab.key === initialTab) ? initialTab : fallbackTab();
  let saved = null;
  let templates = null;
  let query = '';
  let group = null; // null = all groups
  let typesAsked = false;
  // The sections field the list was asked for: another page may have a field,
  // and so a list, of its own.
  let typesAskedFor = '';

  // Natural-height preview cards in a CSS-columns masonry grid. The image sets
  // the card height (no fixed crop); break-inside keeps a card in one column.
  // `layout`: a card for one of the layout's places ({@see layoutCards}) —
  // in use, greyed, or dropped into its place; its trash takes it out of the
  // layout rather than deleting it from the library.
  const card = (title, imageUrl, kind, item, layout = null) => {
    const el = doc.createElement('div');

    el.setAttribute('data-sve-lib-handle', String(item?.handle || item?.id || title));
    el.setAttribute('data-sve-lib-kind', kind);

    if (kind === 'custom' && item?.section_type) {
      el.setAttribute('data-sve-lib-set', String(item.section_type));
    }
    mountPane(el, LibraryCard, {
      title,
      imageUrl: imageUrl || '',
      noPreview: t(win, 'no_preview'),
      canDelete: layout ? !!layout.onRemove : !!item?.can_delete,
      deleteLabel: layout?.removeLabel || '',
      badge: layout?.badge || '',
      note: layout?.note || '',
      disabled: !!layout?.disabled,
      previewUrl: layout?.previewUrl || '',
      onDelete:
        layout?.onRemove ||
        (() => {
          confirmDeleteLibraryItem(win, kind, item, () => {
            saved = null;
            templates = null;
            renderActive();
          });
        }),
    });

    if (!layout) {
      beginCardDrag(win, el, kind, item);
    } else if (layout.onDrop) {
      beginCardDrag(win, el, kind, item, layout);
    }

    return el;
  };

  const empty = (text) => {
    const el = doc.createElement('div');

    mountPane(el, LibraryEmpty, { text });

    return el;
  };

  const styleChip = (btn, on) => {
    btn.style.background = on ? 'var(--theme-color-primary,#4f46e5)' : 'rgba(128,128,128,.22)';
    btn.style.color = on ? '#fff' : 'currentColor';
    btn.style.fontWeight = on ? '600' : '500';
    btn.style.opacity = '1';
  };

  const renderGroups = () => {
    if (active !== 'page') {
      groupsWrap.style.display = 'none';
      groupsEl.innerHTML = '';

      return;
    }

    const types = sectionTypes(win);
    const groupsAll = sectionGroups(win);
    const ordered = libraryGroupKeys(types, groupsAll);

    if (group && !ordered.includes(group)) {
      group = null;
    }

    if (ordered.length < 2) {
      groupsWrap.style.display = 'none';
      groupsEl.innerHTML = '';
      group = null;

      return;
    }

    const scrollLeft = groupsEl.scrollLeft;

    groupsWrap.style.display = 'block';
    mountPane(groupsEl, LibraryGroups, {
      chips: [
        { key: '', label: t(win, 'library_group_all'), on: group === null },
        ...ordered.map((key) => ({
          key,
          label: libraryGroupLabel(win, key, types, groupsAll),
          on: group === key,
        })),
      ],
      onPick: (key) => {
        group = key || null;
        renderActive();
      },
    });
    groupsEl.scrollLeft = scrollLeft;
    requestAnimationFrame(syncGroupsFade);
  };

  const gridScrollEl = () => panel.querySelector('[data-sve-scroll]');

  /**
   * Fill the masonry without snapping scroll back to the top.
   *
   * Preview polling used to wipe `innerHTML` every 1.5s. Emptying the grid
   * collapses the scroll box, so `scrollTop` clamps to 0 — and the group chips
   * were rebuilt the same way. Same cards in the same order only get their
   * picture/title updated.
   */
  const paintGrid = (rows, before) => {
    const existing = [...gridEl.querySelectorAll(':scope > [data-sve-lib-handle]')];
    const sameOrder =
      existing.length === rows.length &&
      rows.length > 0 &&
      rows.every((row, i) => existing[i].getAttribute('data-sve-lib-handle') === row.key);

    if (sameOrder) {
      rows.forEach((row, i) => {
        const el = existing[i];
        const titleEl = el.querySelector('[data-sve-card-title]');

        if (titleEl && titleEl.textContent !== row.title) {
          titleEl.textContent = row.title;
        }

        const img = el.querySelector('img');

        if (row.imageUrl) {
          if (img) {
            if (img.getAttribute('src') !== row.imageUrl) {
              const h = img.getBoundingClientRect().height;

              if (h) {
                img.style.minHeight = `${Math.round(h)}px`;
                img.addEventListener(
                  'load',
                  () => {
                    img.style.minHeight = '';
                  },
                  { once: true }
                );
              }

              img.setAttribute('src', row.imageUrl);
            }
          } else {
            el.replaceWith(card(row.title, row.imageUrl, row.kind, row.item));
          }
        }
      });

      return;
    }

    const scrollEl = gridScrollEl();
    const top = scrollEl?.scrollTop ?? 0;

    gridEl.innerHTML = '';
    before?.();
    rows.forEach((row) => gridEl.appendChild(card(row.title, row.imageUrl, row.kind, row.item)));

    if (scrollEl) {
      scrollEl.scrollTop = top;
    }
  };

  const renderPage = () => {
    const types = sectionTypes(win);

    if (!types.length) {
      gridEl.innerHTML = '';
      gridEl.appendChild(empty(t(win, 'no_section_types')));

      return;
    }

    const filtered = types.filter((type) => {
      if (group && libraryGroupKey(type) !== group) {
        return false;
      }

      return libraryMatchesQuery(type, query);
    });

    if (!filtered.length) {
      gridEl.innerHTML = '';
      gridEl.appendChild(empty(t(win, 'library_no_matches')));

      return;
    }

    paintGrid(
      filtered.map((type) => ({
        key: String(type.handle),
        title: type.display,
        imageUrl: type.image_url,
        kind: 'page',
        item: type,
      }))
    );
  };

  const applyTypeRefresh = (diff = { listChanged: true, imagesChanged: true }) => {
    if (active !== 'page') {
      return;
    }

    if (diff.listChanged) {
      renderGroups();
    }

    if (diff.listChanged || diff.imagesChanged) {
      renderPage();
    }
  };

  const renderSaved = (synced) => {
    const items = (saved || []).filter((s) => !!s.synced === synced);

    if (!items.length) {
      gridEl.innerHTML = '';
      gridEl.appendChild(empty(synced ? t(win, 'no_global_sections') : t(win, 'no_saved_sections')));

      return;
    }

    const filtered = items.filter((item) => libraryMatchesQuery(item, query));

    if (!filtered.length) {
      gridEl.innerHTML = '';
      gridEl.appendChild(empty(t(win, 'library_no_matches')));

      return;
    }

    paintGrid(
      filtered.map((item) => ({
        key: String(item.id),
        title: item.title,
        imageUrl: item.preview_url,
        kind: synced ? 'global' : 'custom',
        item,
      }))
    );

    [...new Set(filtered.map((item) => item.section_type).filter(Boolean))].forEach((handle) => {
      fetchSetMeta(win, handle);
    });
  };

  // A template's card carries the whole page, so it says how many sections that
  // is — the picture alone can't tell you whether you're about to drop three
  // sections or fifteen.
  const renderTemplates = () => {
    const saveBtn = () => {
      const el = doc.createElement('div');

      mountPane(el, LibrarySaveButton, {
        label: t(win, 'save_page_as_template'),
        onSave: () =>
          savePageAsTemplate(win, () => {
            templates = null;
            renderActive();
          }),
      });

      return el;
    };

    if (!(templates || []).length) {
      gridEl.innerHTML = '';
      gridEl.appendChild(saveBtn());
      gridEl.appendChild(empty(t(win, 'no_templates')));

      return;
    }

    const filtered = templates.filter((item) => libraryMatchesQuery(item, query));

    if (!filtered.length) {
      gridEl.innerHTML = '';
      gridEl.appendChild(saveBtn());
      gridEl.appendChild(empty(t(win, 'library_no_matches')));

      return;
    }

    paintGrid(
      filtered.map((item) => ({
        key: String(item.id),
        title: `${item.title} · ${t(win, 'template_count', { count: item.count })}`,
        imageUrl: item.preview_url,
        kind: 'template',
        item,
      })),
      () => gridEl.appendChild(saveBtn())
    );
  };

  // Design cards for header/footer live in the LEFT chrome-designs panel now —
  // not in this sections library.

  // The layout's places. Short lists that change only when a card is dropped
  // or deleted, so the grid is drawn whole every time — `paintGrid` keeps
  // cards whose key did not change, and a card here changes state, not key.
  const renderLayout = () => {
    if (layoutSlots() === null) {
      gridEl.innerHTML = '';
      gridEl.appendChild(empty(t(win, 'loading')));
      void loadLayoutSlots(win).then(() => {
        if (layoutMode) {
          renderActive();
        }
      });

      return;
    }

    const view = layoutCards(win, active, { query, onChange: () => renderActive() });

    gridEl.innerHTML = '';

    if (view.empty) {
      gridEl.appendChild(empty(view.empty));

      return;
    }

    view.rows.forEach((row) => gridEl.appendChild(card(row.title, row.imageUrl, 'layout', row.item, row.opts)));
  };

  const renderActive = () => {
    const nowLayout = layoutOpen(win);

    if (nowLayout !== layoutMode) {
      layoutMode = nowLayout;
      forgetLayoutSlots();
      tabs = layoutMode ? layoutTabs(win) : pageTabs;
      active = fallbackTab();
      group = null;
    }

    mountPane(tabsEl, LibraryTabs, {
      tabs: tabs.map((tab) => ({ ...tab, on: tab.key === active })),
      onPick: (key) => {
        active = key;

        if (active !== 'page') {
          group = null;
        }

        renderActive();
      },
    });

    const hintEl = panel.querySelector('[data-sve-hint]');

    // No page builder on this blueprint: the panel still opens, and its top
    // line says why nothing dropped here lands, instead of telling you to drag.
    if (hintEl) {
      const noBuilder = !layoutMode && !formHasSectionField(win);

      hintEl.textContent = t(win, layoutMode ? 'layout_hint' : noBuilder ? 'library_no_builder' : 'library_hint');
      hintEl.toggleAttribute('data-sve-no-builder', noBuilder);
    }

    if (searchEl) {
      searchEl.placeholder = t(win, 'library_search_placeholder');
    }

    renderGroups();

    if (layoutMode) {
      renderLayout();

      return;
    }

    if (active === 'page') {
      if (!typesAsked || typesAskedFor !== sectionField(win)) {
        typesAsked = true;
        typesAskedFor = sectionField(win);
        refreshSectionTypes(win, applyTypeRefresh);
      }

      renderPage();

      return;
    }

    if (active === 'template') {
      if (templates === null) {
        gridEl.innerHTML = '';
        gridEl.appendChild(empty(t(win, 'loading')));

        pollLibrary(
          win,
          '/!/sve/templates',
          (data) => data.templates || [],
          (items) => {
            templates = items;

            if (active === 'template') {
              renderTemplates();
            }
          },
          () => {
            templates = [];
            gridEl.innerHTML = '';
            gridEl.appendChild(empty(t(win, 'templates_failed')));
          }
        );

        return;
      }

      renderTemplates();

      return;
    }

    if (saved === null) {
      gridEl.innerHTML = '';
      gridEl.appendChild(empty(t(win, 'loading')));

      pollLibrary(
        win,
        '/!/sve/saved-sections',
        (data) => data.sections || [],
        (items) => {
          saved = items;

          if (active === 'custom' || active === 'global') {
            renderSaved(active === 'global');
          }
        },
        () => {
          saved = [];
          gridEl.innerHTML = '';
          gridEl.appendChild(empty(t(win, 'saved_sections_failed')));
        }
      );

      return;
    }

    renderSaved(active === 'global');
  };

  searchEl.addEventListener('input', () => {
    query = searchEl.value;
    renderActive();
  });

  // Something was added to a library while this panel was open — a section just
  // saved from the editor, most often. The lists it has are from before that, so
  // it drops them and asks again. A screenshot follows the save; one catch-up
  // event (not a 1.5s loop) fills the picture in.
  panel.addEventListener('sve-library-stale', () => {
    saved = null;
    templates = null;
    libraryState.sectionTypesOverride = null;
    typesAsked = false;
    renderActive();

    win.clearTimeout(libraryCatchupTimer);
    libraryCatchupTimer = win.setTimeout(() => {
      panel.dispatchEvent(new win.CustomEvent('sve-library-preview-ready'));
    }, 8000);
  });

  panel.addEventListener('sve-library-preview-ready', () => {
    refreshSectionTypes(win, applyTypeRefresh);

    if (saved !== null) {
      pollLibrary(
        win,
        '/!/sve/saved-sections',
        (data) => data.sections || [],
        (items) => {
          saved = items;

          if (active === 'custom' || active === 'global') {
            renderSaved(active === 'global');
          }
        },
        () => {}
      );
    }

    if (templates !== null) {
      pollLibrary(
        win,
        '/!/sve/templates',
        (data) => data.templates || [],
        (items) => {
          templates = items;

          if (active === 'template') {
            renderTemplates();
          }
        },
        () => {}
      );
    }
  });

  panel.addEventListener('sve-set-tab', (event) => {
    const next = event.detail?.tab;

    if (!next || !tabs.some((tab) => tab.key === next)) {
      return;
    }

    active = next;
    group = null;
    renderActive();

    const activeBtn = tabsEl.querySelector(`[data-tab="${next}"]`);

    activeBtn?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
  });

  // Automatic or manual, as the HTML dock saves; previews-watch.js does the
  // work and paints both buttons. Opening the panel looks once: automatic
  // starts what is stale now, manual only marks the save button.
  const autoBtn = panel.querySelector('[data-sve-previews-auto]');
  const refreshBtn = panel.querySelector('[data-sve-previews-refresh]');

  paintPreviewButtons(win);
  void checkPreviews(win, previewsAuto(win) ? undefined : 'probe');

  autoBtn?.addEventListener('click', () => {
    const on = !previewsAuto(win);

    setPreviewsAuto(win, on);
    paintPreviewButtons(win);

    if (on) {
      void checkPreviews(win);
    }
  });

  refreshBtn?.addEventListener('click', () => {
    if (refreshBtn.hasAttribute('data-sve-busy')) {
      return;
    }

    // Only what changed is retaken (and what failed last time); the button
    // waits for the run and says what came of it — pressing it should
    // visibly do something, even when that is "nothing to do".
    checkPreviews(win, 'update').then((result) => {
      if (!result) {
        win.Statamic?.$toast?.error(t(win, 'previews_refresh_failed'));

        return;
      }

      const { first, last } = result;

      // A picture the browser could not take keeps the old one on the card,
      // which looks exactly like a button that did nothing — so say why.
      const errors = Object.entries(last.errors || {});

      if (errors.length) {
        const [name, message] = errors[0];

        win.Statamic?.$toast?.error(
          t(win, 'previews_refresh_errors', {
            count: errors.length,
            first: name === '_' ? message : `${name}: ${message}`,
          })
        );

        return;
      }

      win.Statamic?.$toast?.success(
        first.running ? t(win, 'previews_refresh_done', { count: first.stale }) : t(win, 'previews_refresh_current')
      );
    });
  });

  renderActive();
  searchEl.focus();
}

/** "−" on an orderable row: take it out, unless the field's min needs it. */
export function handleRemoveRow(data, doc, win) {
  if (rowIsLocked(data.uid, doc)) {
    return false;
  }

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = rowLocation(values, data.uid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows } = found;
    const { min } = rowLimits(values, parentPath, win);

    if (min && rows.length <= min) {
      return; // removing it would take the field below its minimum
    }

    const removedId = rows[index]?._id;
    const next = JSON.parse(JSON.stringify(rows));

    next.splice(index, 1);

    if (!next.length && data.emptyRemovesBlock) {
      // Drop the emptied row's meta first; removeEmptiedBlock then takes the
      // whole parent set out of values (its own meta cleanup is a separate path).
      removeNestedRowMeta(container, values, parentPath, removedId);

      if (removeEmptiedBlock(container, values, data.emptyRemovesBlock, rows, win)) {
        return;
      }
    }

    removeNestedRowMeta(container, values, parentPath, removedId);
    container.setFieldValue(parentPath, next);

    // Whoever cares what the page looks like without this row (the HTML tree,
    // the dock) listens for this — the handler itself is not wrapped or polled.
    emit('row:removed', { uid: data.uid, parentPath, remaining: next.length, doc, win });

    return;
  }
}

/** Whether a row may be duplicated — not when it is locked, by whichever path the duplicate came. */
export function rowDuplicable(uid, doc) {
  return !rowIsLocked(uid, doc);
}

/**
 * Duplicate an orderable row (replicator set, Bard set, or grid row), keeping
 * its content but giving every id a fresh value — same idea as Statamic's
 * "Duplicate Set".
 *
 * `data.asType`: the copy is a row of that set instead — a section type just
 * made from this one (section-copy.js), with the same fields, so the row's
 * values and meta carry over as they are. Answers the copy, or nothing.
 */
export async function handleDuplicateRow(data, doc, win) {
  if (rowIsLocked(data.uid, doc)) {
    return false;
  }

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = rowLocation(values, data.uid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows, kind } = found;
    const { max } = rowLimits(values, parentPath, win);

    if (max && rows.length >= max) {
      return;
    }

    const copy = reidSection(win, rows[index]);

    if (copy && typeof copy === 'object' && 'enabled' in copy) {
      copy.enabled = true;
    }

    if (data.asType && copy && typeof copy === 'object' && typeof copy.type === 'string') {
      copy.type = data.asType;
    }

    if (kind === 'bard-set' && copy?.type === 'set' && copy.attrs) {
      copy.attrs = { ...copy.attrs, enabled: true };

      const setHandle = copy.attrs.values?.type;
      const rowId = copy.attrs.id;

      if (setHandle && rowId) {
        const field = parentPath.slice(parentPath.lastIndexOf('.') + 1);
        const meta = await fetchNestedSetMeta(win, field, setHandle);

        writeNestedRowMeta(container, values, parentPath, rowId, meta?.new);
      }
    } else if (copy?._id) {
      // Clone the original row's meta and re-key nested `existing` to the copy's
      // new ids. `rowMetaTemplate` prefers blank `new`, whose nested keys belong
      // to fieldset defaults — same empty-sidebar bug as a custom insert.
      const fieldMeta = metaForPath(unwrapRef(container.meta) || {}, values, parentPath);
      const sampleId = rows[index]?._id;
      const sampleMeta =
        (sampleId && fieldMeta?.existing?.[sampleId]
          ? JSON.parse(JSON.stringify(fieldMeta.existing[sampleId]))
          : null) ||
        rowMetaTemplate(container, values, parentPath, rows[index]) ||
        {};

      writeNestedRowMeta(container, values, parentPath, copy._id, hydrateExistingMeta(copy, sampleMeta, rows[index]));
    }

    const next = JSON.parse(JSON.stringify(rows));

    next.splice(index + 1, 0, copy);
    container.setFieldValue(parentPath, next);

    return copy;
  }
}

/**
 * Answers the preview's row-caps request: whether the row's field can take
 * another row / lose this one, given its min/max. Lets the preview grey out the
 * +/− that would break the limit (the limit is still enforced here too).
 */
export function handleRowCaps(data, doc, win) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = rowLocation(values, data.uid);

    if (!found) {
      continue;
    }

    const { parentPath, rows } = found;
    const { min, max } = rowLimits(values, parentPath, win);
    const count = rows.length;

    sendToPreview(
      {
        source: SOURCE,
        type: MSG.ROW_CAPS_RESULT,
        uid: data.uid,
        canAdd: !max || count < max,
        canRemove: !min || count > min,
      },
      win
    );

    return;
  }
}
