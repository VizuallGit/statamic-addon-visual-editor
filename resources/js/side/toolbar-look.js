import { mark } from '../lib/debug.js';

/**
 * Trial look for the inline-edit toolbar and the section move bar.
 *
 * Original (bridge): 9px radius, 1px border, drop shadow, CP light/dark theme.
 * Trial: 4px radius, no border, no shadow. The pills themselves follow the
 * section — light chrome on a dark surface, dark chrome on a light one.
 *
 * Set ENABLED to false and hard-refresh CP to restore the original.
 *
 * Own CP script — not addon.js. Does not touch overlay-host / preview / bridge.
 */
import { injectStyle } from '../lib/style.js';
import { surfaceIsDark } from '../lib/surface-tone.js';
import { logCaught } from '../lib/caught.js';

(function () {
  'use strict';

  var ENABLED = true;
  var STYLE_ID = '__sve-toolbar-look';

  mark('toolbar-look');

  // Each ID gets its own suffix. Concatenating a comma-list then appending
  // ` > *` only attaches the child selector to the last ID, so the wrapper
  // was painted (white glow behind the bar) while the pills stayed dark.
  function pills(attr) {
    attr = attr || '';

    // Edit/hover bars are a transparent wrapper; the move bar *is* the pill.
    return (
      '#__sve-edit-toolbar' +
      attr +
      ' > *,' +
      '#__sve-hover-belt' +
      attr +
      ' > *,' +
      '#__sve-move-ctrl' +
      attr +
      ',' +
      '[data-sve-menu]' +
      attr
    );
  }

  function buttons(attr) {
    attr = attr || '';

    return (
      '#__sve-edit-toolbar' +
      attr +
      ' button,' +
      '#__sve-hover-belt' +
      attr +
      ' button,' +
      '#__sve-move-ctrl' +
      attr +
      ' button,' +
      '[data-sve-menu]' +
      attr +
      ' button'
    );
  }

  function seps(attr) {
    attr = attr || '';

    return (
      '#__sve-edit-toolbar' +
      attr +
      ' [data-sve-sep],' +
      '#__sve-hover-belt' +
      attr +
      ' [data-sve-sep],' +
      '[data-sve-menu]' +
      attr +
      ' [data-sve-sep]'
    );
  }

  function css() {
    if (!ENABLED) {
      return '';
    }

    return (
      pills() +
      '{' +
      'border:none!important;outline:none!important;box-shadow:none!important;' +
      'filter:none!important;border-radius:4px!important;' +
      '}' +
      buttons() +
      '{' +
      'border-radius:4px!important;outline:none!important;box-shadow:none!important;' +
      '}' +
      pills('[data-sve-tb-tone="dark"]') +
      '{' +
      'background:#ececee!important;color:#18181b!important;' +
      '}' +
      buttons('[data-sve-tb-tone="dark"]') +
      '{color:#18181b!important;}' +
      seps('[data-sve-tb-tone="dark"]') +
      '{background:rgba(0,0,0,.12)!important;}' +
      '#__sve-edit-toolbar[data-sve-tb-tone="dark"] button:hover:not([data-sve-on="1"]),' +
      '#__sve-hover-belt[data-sve-tb-tone="dark"] button:hover:not([data-sve-on="1"]),' +
      '#__sve-move-ctrl[data-sve-tb-tone="dark"] button:hover:not([data-sve-on="1"]),' +
      '[data-sve-menu][data-sve-tb-tone="dark"] button:hover{' +
      'background:rgba(0,0,0,.06)!important;' +
      '}' +
      '#__sve-edit-toolbar[data-sve-tb-tone="dark"] button[data-sve-on="1"],' +
      '#__sve-hover-belt[data-sve-tb-tone="dark"] button[data-sve-on="1"],' +
      '#__sve-move-ctrl[data-sve-tb-tone="dark"] button[data-sve-on="1"]{' +
      'background:#e4e4e7!important;' +
      '}' +
      pills('[data-sve-tb-tone="light"]') +
      '{' +
      'background:#27272a!important;color:#e4e4e7!important;' +
      '}' +
      buttons('[data-sve-tb-tone="light"]') +
      '{color:#e4e4e7!important;}' +
      seps('[data-sve-tb-tone="light"]') +
      '{background:rgba(255,255,255,.16)!important;}' +
      '#__sve-edit-toolbar[data-sve-tb-tone="light"] button:hover:not([data-sve-on="1"]),' +
      '#__sve-hover-belt[data-sve-tb-tone="light"] button:hover:not([data-sve-on="1"]),' +
      '#__sve-move-ctrl[data-sve-tb-tone="light"] button:hover:not([data-sve-on="1"]),' +
      '[data-sve-menu][data-sve-tb-tone="light"] button:hover{' +
      'background:rgba(255,255,255,.10)!important;' +
      '}' +
      '#__sve-edit-toolbar[data-sve-tb-tone="light"] button[data-sve-on="1"],' +
      '#__sve-hover-belt[data-sve-tb-tone="light"] button[data-sve-on="1"],' +
      '#__sve-move-ctrl[data-sve-tb-tone="light"] button[data-sve-on="1"]{' +
      'background:rgba(255,255,255,.20)!important;' +
      '}'
    );
  }

  function inject(win) {
    if (!win || !win.document) {
      return;
    }

    injectStyle(win.document, STYLE_ID, css());
  }

  function sampleUnder(win, bar) {
    var doc = win.document;
    var rect;
    var x;
    var y;
    var prev;
    var hit;

    if (!bar || !bar.getBoundingClientRect) {
      return null;
    }

    rect = bar.getBoundingClientRect();
    x = rect.left + Math.min(40, Math.max(8, rect.width / 2));
    y = rect.bottom + 8;
    prev = bar.style.pointerEvents;
    bar.style.pointerEvents = 'none';
    hit = doc.elementFromPoint(x, y);

    if (!hit || hit === bar || (bar.contains && bar.contains(hit))) {
      hit = doc.elementFromPoint(x, Math.max(0, rect.top - 8));
    }

    bar.style.pointerEvents = prev;

    if (hit && (hit === bar || (bar.contains && bar.contains(hit)))) {
      return null;
    }

    return hit;
  }

  function sourceForBar(win, bar) {
    var doc = win.document;
    var el;

    if (bar && bar.id === '__sve-move-ctrl') {
      el = sampleUnder(win, bar);
    } else {
      el = doc.querySelector('[data-sve-editing]') || doc.querySelector('[data-sid-hover]') || sampleUnder(win, bar);
    }

    if (el && el.closest) {
      return el.closest('[data-auto-contrast]') || el;
    }

    return el;
  }

  function applyTone(win, bar) {
    var source;
    var dark;
    var tone;

    if (!bar) {
      return;
    }

    source = sourceForBar(win, bar);
    dark = source ? surfaceIsDark(win, source) : false;
    tone = dark ? 'dark' : 'light';

    if (bar.getAttribute('data-sve-tb-tone') !== tone) {
      bar.setAttribute('data-sve-tb-tone', tone);
    }
  }

  function paint(win) {
    var doc;
    var edit;
    var hover;
    var move;
    var menu;
    var tone;

    if (!ENABLED || !win || !win.document) {
      return;
    }

    doc = win.document;
    edit = doc.getElementById('__sve-edit-toolbar');
    hover = doc.getElementById('__sve-hover-belt');
    move = doc.getElementById('__sve-move-ctrl');
    menu = doc.querySelector('[data-sve-menu]');

    if (!edit && !hover && !move && !menu) {
      return;
    }

    applyTone(win, edit);
    applyTone(win, hover);
    applyTone(win, move);

    if (menu) {
      tone =
        (edit && edit.getAttribute('data-sve-tb-tone')) || (hover && hover.getAttribute('data-sve-tb-tone')) || 'light';

      if (menu.getAttribute('data-sve-tb-tone') !== tone) {
        menu.setAttribute('data-sve-tb-tone', tone);
      }
    }
  }

  function schedulePaint(win) {
    if (!win || win.__sveToolbarLookPaint) {
      return;
    }

    win.__sveToolbarLookPaint = win.requestAnimationFrame(function () {
      win.__sveToolbarLookPaint = 0;

      try {
        paint(win);
      } catch (err) {
        // The look must not stop the binding.
        logCaught('toolbar-look: paint the toolbar', err);
      }
    });
  }

  function bindPreview(win) {
    var body;

    if (!win || !win.document || win.__sveToolbarLookBound === win.document) {
      return;
    }

    win.__sveToolbarLookBound = win.document;
    inject(win);
    schedulePaint(win);

    body = win.document.body;

    if (body && !body.__sveToolbarLookObs) {
      body.__sveToolbarLookObs = new MutationObserver(function () {
        schedulePaint(win);
      });
      body.__sveToolbarLookObs.observe(body, { childList: true });
    }

    if (!win.__sveToolbarLookWinBound) {
      win.__sveToolbarLookWinBound = true;
      win.addEventListener('statamic:preview-updated', function () {
        win.__sveToolbarLookBound = null;
        bindPreview(win);
      });
    }
  }

  function bindFrames() {
    var iframe = document.getElementById('live-preview-iframe');
    var nested;

    if (!iframe) {
      return;
    }

    try {
      bindPreview(iframe.contentWindow);
      nested = iframe.contentDocument && iframe.contentDocument.getElementById('live-preview-iframe');

      if (nested && nested.contentWindow) {
        bindPreview(nested.contentWindow);
      }
    } catch (err) {
      logCaught('toolbar-look: bind the preview', err);
    }
  }

  var timer = 0;

  function schedule() {
    if (timer) {
      return;
    }

    timer = window.setTimeout(function () {
      timer = 0;
      bindFrames();
    }, 200);
  }

  bindFrames();
  document.addEventListener('sve-chrome-render', schedule);
  document.addEventListener(
    'load',
    function (event) {
      if (event.target && event.target.id === 'live-preview-iframe') {
        schedule();
      }
    },
    true
  );
})();
