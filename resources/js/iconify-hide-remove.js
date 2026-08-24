/**
 * Iconify's dropdown always offers Change + Remove. When that fieldtype has a
 * default, Remove cannot clear the icon — hide that item only.
 *
 * Own CP script, not addon.js, not a wrap of the Iconify Vue component.
 * FieldtypeMixin puts `config` on the Vue proxy, not always on props.
 */
(function () {
    'use strict';

    if (window.__sveIconifyHideRemove) {
        return;
    }
    window.__sveIconifyHideRemove = true;

    var pending = false;

    function vueInst(el) {
        return el && el.__vueParentComponent ? el.__vueParentComponent : null;
    }

    function configFromInst(inst) {
        if (!inst) {
            return null;
        }

        if (inst.proxy && inst.proxy.config && typeof inst.proxy.config === 'object') {
            return inst.proxy.config;
        }

        if (inst.props && inst.props.config && typeof inst.props.config === 'object') {
            return inst.props.config;
        }

        return null;
    }

    function isIconifyConfig(config) {
        if (!config || typeof config !== 'object') {
            return false;
        }

        if ((config.type || '').toLowerCase() === 'iconify') {
            return true;
        }

        return typeof config.default === 'string' && config.default.indexOf(':') !== -1;
    }

    function iconifyConfig(el) {
        var root = (el && el.closest && el.closest('.iconify-fieldtype')) || el;
        var node;
        var inst;
        var config;
        var kids;
        var i;

        if (!root) {
            return null;
        }

        node = root;
        while (node && node !== document.body) {
            inst = vueInst(node);
            config = configFromInst(inst);
            if (isIconifyConfig(config)) {
                return config;
            }
            node = node.parentElement;
        }

        kids = root.querySelectorAll('*');
        for (i = 0; i < kids.length; i++) {
            config = configFromInst(vueInst(kids[i]));
            if (isIconifyConfig(config)) {
                return config;
            }
        }

        return null;
    }

    function hasDefault(el) {
        var config = iconifyConfig(el);
        var value = config && config.default;

        if (typeof value === 'string') {
            return value.trim() !== '';
        }

        if (value && typeof value === 'object') {
            return !!(value.name || value.body);
        }

        return false;
    }

    function isRemoveLabel(text) {
        return /^(remove|fjern)$/i.test((text || '').replace(/\s+/g, ' ').trim());
    }

    function isChangeLabel(text) {
        return /^(change|skift)$/i.test((text || '').replace(/\s+/g, ' ').trim());
    }

    function hideRemoveIn(root) {
        var items = root.querySelectorAll('button, [role="menuitem"], [data-reka-dropdown-menu-item], [data-reka-menu-item]');
        var i;
        var hasChange = false;
        var removeItems = [];
        var text;

        if (!items.length) {
            items = root.querySelectorAll('div, span, a, button');
        }

        for (i = 0; i < items.length; i++) {
            text = (items[i].textContent || '').replace(/\s+/g, ' ').trim();
            if (isChangeLabel(text)) {
                hasChange = true;
            }
            if (isRemoveLabel(text)) {
                removeItems.push(items[i]);
            }
        }

        if (!hasChange || !removeItems.length) {
            return;
        }

        for (i = 0; i < removeItems.length; i++) {
            removeItems[i].hidden = true;
            removeItems[i].style.setProperty('display', 'none', 'important');
        }
    }

    function hideOpenMenus() {
        if (!pending) {
            return;
        }

        document.querySelectorAll(
            '[role="menu"], [data-reka-dropdown-menu-content], [data-reka-menu-content], [data-reka-popper-content-wrapper]'
        ).forEach(hideRemoveIn);
    }

    document.addEventListener(
        'pointerdown',
        function (event) {
            var field = event.target && event.target.closest && event.target.closest('.iconify-fieldtype');

            pending = !!(field && hasDefault(field));
        },
        true
    );

    document.addEventListener(
        'click',
        function () {
            if (!pending) {
                return;
            }

            requestAnimationFrame(hideOpenMenus);
            setTimeout(hideOpenMenus, 0);
            setTimeout(hideOpenMenus, 50);
            setTimeout(hideOpenMenus, 160);
        },
        true
    );

    new MutationObserver(hideOpenMenus).observe(document.documentElement, {
        childList: true,
        subtree: true,
    });
})();
