import { mark } from '../lib/debug.js';

/**
 * Grid-rækker som accordion — kun når `sve_grid_collapse` er slået til.
 *
 * Accordion'en i cp.js kører på alle stacked grids. Her slår vi den fra
 * igen, hvis fluebenet ikke er sat. Grid's Vue røres ikke.
 */
(function () {
  'use strict';

  mark('grid-collapse');

  const KEY = 'sve_grid_collapse';
  const OPEN_ATTR = 'data-sve-grid-open';
  const ROW_ATTR = 'data-sve-grid-row';
  const COLLAPSED_ATTR = 'data-sve-grid-collapsed';

  function configOf(vm) {
    return vm && vm.config && typeof vm.config === 'object' ? vm.config : null;
  }

  function vueOf(el) {
    let inst = el && el.__vueParentComponent;

    while (inst) {
      const config = configOf(inst.proxy);

      if (config && ((config.type || '').toLowerCase() === 'grid' || KEY in config)) {
        return inst.proxy;
      }

      inst = inst.parent;
    }

    return null;
  }

  function wantsCollapse(stacked) {
    const field = stacked.closest('.grid-fieldtype');
    const vm = vueOf(field || stacked);

    return !!(vm && configOf(vm) && configOf(vm)[KEY]);
  }

  function guardHeaderClick(event) {
    if (event.target.closest('button')) {
      return;
    }

    event.stopImmediatePropagation();
  }

  function openRow(row) {
    row.removeAttribute(COLLAPSED_ATTR);

    const header = row.querySelector(':scope > header');
    const title = header && header.querySelector('.sve-grid-title');
    const chevron = header && header.querySelector('.sve-grid-chevron');

    if (title) {
      title.style.display = 'none';
    }

    if (chevron) {
      chevron.style.display = 'none';
    }

    if (header && !header.__sveGridOpenGuard) {
      header.__sveGridOpenGuard = true;
      header.addEventListener('click', guardHeaderClick, true);
    }
  }

  function scan(root) {
    (root.querySelectorAll ? root.querySelectorAll('.grid-stacked') : []).forEach(function (stacked) {
      if (wantsCollapse(stacked)) {
        stacked.removeAttribute(OPEN_ATTR);

        return;
      }

      stacked.setAttribute(OPEN_ATTR, '');
      stacked.querySelectorAll('[' + ROW_ATTR + ']').forEach(openRow);
    });
  }

  function watch() {
    if (!document.body || document.body.__sveGridCollapseWatch) {
      return;
    }

    document.body.__sveGridCollapseWatch = true;
    scan(document);

    let timer = null;

    new MutationObserver(function () {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(function () {
        scan(document);
      }, 80);
    }).observe(document.body, { childList: true, subtree: true });
  }

  function wait() {
    if (!document.body) {
      setTimeout(wait, 30);

      return;
    }

    watch();
  }

  wait();
})();
