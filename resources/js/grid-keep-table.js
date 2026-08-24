/**
 * Keep table layout — den kompakte tabel (håndtag + felt + …), også når
 * sidebaren er smallere end 550px.
 *
 * Statamic skifter til GridStacked når `fields.length > 1` og containeren
 * er under 550px. Skjulte editor-felter tæller med. Vi sætter kun
 * `containerWidth` på Grid-instansen, så den bliver ved GridTable.
 * Grid's Vue-komponent wrappes eller erstattes ikke.
 */
(function () {
    'use strict';

    if (window.__sveGridKeepTable) {
        return;
    }
    window.__sveGridKeepTable = true;

    var KEY = 'sve_keep_table';
    var PIN = 9999;
    var FIELD_SEL = '.grid-fieldtype';
    var STYLE_ID = 'sve-keep-table-style';

    function ensureStyles() {
        if (document.getElementById(STYLE_ID)) {
            return;
        }

        var style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = [
            '[data-sve-keep-table] table.grid-table [data-sve-keep-table-col-hidden]{display:none;width:0;padding:0;border:0}',
            '[data-sve-keep-table] table.grid-table td.grid-cell:not([data-sve-keep-table-col-hidden]){width:100%}',
            '[data-sve-keep-table] table.grid-table td.grid-cell:not([data-sve-keep-table-col-hidden]) > *,',
            '[data-sve-keep-table] table.grid-table td.grid-cell:not([data-sve-keep-table-col-hidden]) [data-ui-combobox],',
            '[data-sve-keep-table] table.grid-table td.grid-cell:not([data-sve-keep-table-col-hidden]) [data-ui-combobox-anchor],',
            '[data-sve-keep-table] table.grid-table td.grid-cell:not([data-sve-keep-table-col-hidden]) [data-ui-combobox-trigger]{width:100%;max-width:none;box-sizing:border-box}',
        ].join('');
        document.head.appendChild(style);
    }

    function configOf(vm) {
        return vm && vm.config && typeof vm.config === 'object' ? vm.config : null;
    }

    function flagOn(vm) {
        var config = configOf(vm);

        return !!(config && config[KEY]);
    }

    function isGridVm(vm) {
        return !!(vm && typeof vm.addRow === 'function' && 'containerWidth' in vm);
    }

    function setWidth(vm, width) {
        vm.containerWidth = width;

        if (vm.$data) {
            vm.$data.containerWidth = width;
        }

        if (vm.$ && vm.$.data) {
            vm.$.data.containerWidth = width;
        }
    }

    function lock(vm) {
        if (!isGridVm(vm) || !flagOn(vm)) {
            return;
        }

        var config = configOf(vm);

        if (config && config.mode === 'stacked') {
            config.mode = 'table';
        }

        if (typeof vm.containerWidth !== 'number' || vm.containerWidth < PIN) {
            setWidth(vm, PIN);
        }

        if (vm.__sveKeepTableWatch || typeof vm.$watch !== 'function') {
            return;
        }

        vm.__sveKeepTableWatch = true;
        vm.$watch('containerWidth', function (width) {
            if (width !== PIN) {
                setWidth(vm, PIN);
            }
        }, { flush: 'sync' });
    }

    function eachAncestorProxy(el, visit) {
        var inst = el && el.__vueParentComponent;

        while (inst) {
            if (inst.proxy) {
                visit(inst.proxy);
            }

            inst = inst.parent;
        }
    }

    function lockField(el) {
        var flagged = false;
        var grids = [];
        var seen = [];

        function visit(vm) {
            if (!vm || seen.indexOf(vm) !== -1) {
                return;
            }

            seen.push(vm);

            if (flagOn(vm)) {
                flagged = true;
            }

            if (isGridVm(vm)) {
                grids.push(vm);
            }
        }

        eachAncestorProxy(el, visit);

        if (el && el.querySelectorAll) {
            el.querySelectorAll('*').forEach(function (node) {
                eachAncestorProxy(node, visit);
            });
        }

        if (!flagged) {
            return;
        }

        el.setAttribute('data-sve-keep-table', '');
        hideEditorColumns(el);

        grids.forEach(function (vm) {
            if (!flagOn(vm) && configOf(vm)) {
                configOf(vm)[KEY] = true;
            }

            lock(vm);
        });
    }

    function hideEditorColumns(field) {
        var table = field.querySelector('table.grid-table');

        if (!table) {
            return;
        }

        table.querySelectorAll('td.hidden-fieldtype, td.auto_uuid-fieldtype').forEach(function (td) {
            if (td.hasAttribute('data-sve-keep-table-col-hidden')) {
                return;
            }

            var index = td.cellIndex + 1;

            table.querySelectorAll('tr > :nth-child(' + index + ')').forEach(function (cell) {
                cell.setAttribute('data-sve-keep-table-col-hidden', '');
            });
        });
    }

    function scan(root) {
        (root.querySelectorAll ? root.querySelectorAll(FIELD_SEL) : []).forEach(lockField);
    }

    function watch() {
        if (!document.body || document.body.__sveGridKeepTableWatch) {
            return;
        }

        document.body.__sveGridKeepTableWatch = true;
        ensureStyles();
        scan(document);

        var timer = null;

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
