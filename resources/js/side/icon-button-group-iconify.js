import { mark } from '../lib/debug.js';

/**
 * Iconify på icon_button_group i Control Panel — ikke i Antlers.
 *
 * addon.js tegner kun `icon_html` i slottet. PHP lægger den i meta ved preload.
 * Her males SVG også fra feltets config, hvis meta er gammel eller tom.
 * Eget script, ikke addon.js.
 */
import { injectStyle } from '../lib/style.js';

(function () {
  'use strict';

  mark('icon-button-group-iconify');

  const NAME_RE = /^[a-z0-9-]+:[a-z0-9-]+$/i;
  const FIELD_SEL = '.icon_button_group-fieldtype, .icon-button-group-fieldtype';
  const cache = new Map();

  function isIconifyName(name) {
    return typeof name === 'string' && NAME_RE.test(name.trim());
  }

  function ensureStyles() {
    injectStyle(
      document,
      'sve-ibg-iconify-css',
      [
        '[data-sve-ibg-iconify] { display: inline-flex; align-items: center; justify-content: center; width: 1.125rem; height: 1.125rem; color: currentColor; }',
        '[data-sve-ibg-iconify] svg { width: 1.125rem !important; height: 1.125rem !important; display: block !important; }',
        '.icon_button_group-fieldtype button:not([data-sve-ibg-selected]), .icon-button-group-fieldtype button:not([data-sve-ibg-selected]) { opacity: 0.4; }',
        '.icon_button_group-fieldtype button:not([data-sve-ibg-selected]):hover, .icon-button-group-fieldtype button:not([data-sve-ibg-selected]):hover { opacity: 0.7; }',
        '.icon_button_group-fieldtype button[data-sve-ibg-selected], .icon-button-group-fieldtype button[data-sve-ibg-selected] { opacity: 1; }',
      ].join('\n')
    );
  }

  function normalizeSvg(markup) {
    if (!markup || typeof document === 'undefined') {
      return markup || '';
    }

    const wrap = document.createElement('div');
    wrap.innerHTML = markup;

    const svg = wrap.querySelector('svg');

    if (!svg) {
      return markup;
    }

    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.width = '1.125rem';
    svg.style.height = '1.125rem';
    svg.style.display = 'block';
    svg.querySelectorAll('[stroke]:not([stroke="none"])').forEach(function (node) {
      node.setAttribute('stroke', 'currentColor');
    });

    return wrap.innerHTML;
  }

  function fetchIcon(name) {
    const cached = cache.get(name);

    if (cached) {
      return cached;
    }

    const parts = name.split(':');
    const request = fetch('https://api.iconify.design/' + parts[0] + '/' + parts[1] + '.svg')
      .then(function (res) {
        return res.ok ? res.text() : '';
      })
      .then(function (markup) {
        return markup ? normalizeSvg(markup) : '';
      })
      .catch(function () {
        return '';
      });

    cache.set(name, request);

    return request;
  }

  function vueOf(el) {
    let inst = el && el.__vueParentComponent;

    while (inst) {
      const proxy = inst.proxy;
      const options = fieldOptions(proxy);

      if (options.length) {
        return proxy;
      }

      inst = inst.parent;
    }

    return null;
  }

  function optionName(option) {
    if (!option || typeof option !== 'object') {
      return null;
    }

    if (isIconifyName(option.icon)) {
      return option.icon.trim();
    }

    const raw = option.iconify;

    if (isIconifyName(raw)) {
      return raw.trim();
    }

    if (raw && typeof raw === 'object' && isIconifyName(raw.name)) {
      return raw.name.trim();
    }

    return null;
  }

  function fieldOptions(vm) {
    if (!vm) {
      return [];
    }

    const meta = vm.meta && Array.isArray(vm.meta.options) ? vm.meta.options : [];

    if (meta.length) {
      return meta;
    }

    const config = vm.config && Array.isArray(vm.config.options) ? vm.config.options : [];

    return config;
  }

  function paintButton(btn, markup) {
    if (!btn || !markup) {
      return;
    }

    let holder = btn.querySelector('[data-sve-ibg-iconify]');

    if (!holder) {
      holder = document.createElement('span');
      holder.setAttribute('data-sve-ibg-iconify', '');
      btn.insertBefore(holder, btn.firstChild);
    }

    if (holder.innerHTML !== markup) {
      holder.innerHTML = markup;
    }
  }

  function markSelected(el, vm) {
    const options = fieldOptions(vm);
    const buttons = el.querySelectorAll('button');
    const value = vm ? vm.value : undefined;

    buttons.forEach(function (btn, index) {
      const option = options[index];

      if (option && value == option.value) {
        btn.setAttribute('data-sve-ibg-selected', '');
      } else {
        btn.removeAttribute('data-sve-ibg-selected');
      }
    });
  }

  function watchSelected(el) {
    if (el.__sveIbgSelectedWatch) {
      return;
    }

    el.__sveIbgSelectedWatch = true;
    el.addEventListener('click', function () {
      const apply = function () {
        const vm = vueOf(el) || vueOf(el.querySelector('[class*="-fieldtype"]'));
        markSelected(el, vm);
      };

      requestAnimationFrame(apply);
      setTimeout(apply, 0);
    });
  }

  function paintField(el) {
    const vm = vueOf(el) || vueOf(el.querySelector('[class*="-fieldtype"]'));
    const options = fieldOptions(vm);

    if (!options.length) {
      return;
    }

    const buttons = el.querySelectorAll('button');

    options.forEach(function (option, index) {
      const btn = buttons[index];
      const html = option.icon_html;
      const name = optionName(option);

      if (!btn) {
        return;
      }

      if (html) {
        paintButton(btn, html);

        return;
      }

      if (!name) {
        return;
      }

      fetchIcon(name).then(function (markup) {
        if (markup) {
          paintButton(btn, markup);
        }
      });
    });

    markSelected(el, vm);
    watchSelected(el);
  }

  function scan(root) {
    ensureStyles();

    (root.querySelectorAll ? root.querySelectorAll(FIELD_SEL) : []).forEach(paintField);
  }

  function watch() {
    if (!document.body || document.body.__sveIbgPaint) {
      return;
    }

    document.body.__sveIbgPaint = true;
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
