/**
 * Live Preview: mount the focused page-section's fields, then its neighbours.
 *
 * Own CP script — not addon.js. Does not touch overlay-host / preview / bridge.
 *
 * The publish container still holds every section (outline, library, save,
 * preview). Vue mounts rows at their real index, so writing `page_sections.5.x`
 * cannot land on `.0`. First paint mounts only the open row. When that row is
 * ready, the neighbour below (and above, if any) parks off-screen — one at a
 * time. A third row waits for hover or until it becomes a neighbour.
 *
 * Inside a row, only what the sidebar is showing mounts: the open Content
 * tab, replicator labels, and media. Nested block fields wait for hover or
 * click. Style fields wait for the Style tab.
 *
 * First-section and neighbour preload can be restored by flipping the flags
 * below. Loaded panes stay mounted (`KEEP_MOUNTED`) until the section list
 * itself goes away.
 */
(function () {
    'use strict';

    // Restore first-open mount / neighbour warmup: set these back to true.
    var PRELOAD_FIRST_SECTION = false;
    var PRELOAD_NEIGHBORS = false;
    // Keep every section we have already shown. Set false to prune to neighbours.
    var KEEP_MOUNTED = true;

    var FOCUS = 'sve-lite-focus';
    var WARM = 'sve-lite-warm';
    var WARM_STYLE = {
        position: 'absolute',
        left: '-10000px',
        top: '0',
        visibility: 'hidden',
        pointerEvents: 'none',
    };

    function rowsOf(value) {
        return Array.isArray(value) ? value : [];
    }

    function uidOf(row) {
        return (row && (row._visual_id || row._id || row.id)) || null;
    }

    function idsOf(node) {
        var out = [];

        if (!node || typeof node !== 'object' || Array.isArray(node)) {
            return out;
        }

        if (node._visual_id) {
            out.push(String(node._visual_id));
        }

        if (node._id) {
            out.push(String(node._id));
        }

        if (node.id) {
            out.push(String(node.id));
        }

        return out;
    }

    function nodeHasUid(node, uid) {
        return idsOf(node).indexOf(String(uid)) !== -1;
    }

    var liteVm = null;

    function bindLite(vm) {
        liteVm = vm;
    }

    function unbindLite(vm) {
        if (liteVm === vm) {
            liteVm = null;
        }
    }

    function liteRows() {
        return liteVm ? rowsOf(liteVm.rows) : [];
    }

    function sectionUidFor(uid) {
        var rows = liteRows();
        var i;

        if (!uid) {
            return null;
        }

        for (i = 0; i < rows.length; i++) {
            if (containsUid(rows[i], uid)) {
                return uidOf(rows[i]);
            }
        }

        return null;
    }

    function uidOfSet(setEl) {
        var inputs = setEl.querySelectorAll('[data-visual-id]');
        var i;
        var input;

        for (i = 0; i < inputs.length; i++) {
            input = inputs[i];
            if (input.closest('[data-replicator-set]') === setEl) {
                return input.value || null;
            }
        }

        return null;
    }

    function containsUid(node, uid, depth) {
        var keys;
        var i;
        var key;

        if (!uid || !node || typeof node !== 'object' || depth > 24) {
            return false;
        }

        if (typeof node.nodeType === 'number') {
            return false;
        }

        if (nodeHasUid(node, uid)) {
            return true;
        }

        if (Array.isArray(node)) {
            return node.some(function (item) {
                return containsUid(item, uid, (depth || 0) + 1);
            });
        }

        keys = Object.keys(node);

        for (i = 0; i < keys.length; i++) {
            key = keys[i];

            if (key.indexOf('__') === 0) {
                continue;
            }

            if (containsUid(node[key], uid, (depth || 0) + 1)) {
                return true;
            }
        }

        return false;
    }

    function lookup(name) {
        var app = window.Statamic && Statamic.$app;
        var comps = window.Statamic && Statamic.$components;
        var found;
        var list;
        var ctx;

        if (app && typeof app.component === 'function') {
            try {
                found = app.component(name);
                if (found) {
                    return found;
                }
            } catch (err) {
                /* missing */
            }
        }

        if (!comps) {
            return null;
        }

        if (typeof comps.get === 'function') {
            try {
                found = comps.get(name);
                if (found) {
                    return found;
                }
            } catch (err) {
                /* missing */
            }
        }

        list = comps.components || comps.registered || {};
        if (list[name]) {
            return list[name];
        }

        ctx = app && (app._context || app._instance && app._instance.appContext);
        list = (ctx && ctx.components) || {};

        return list[name] || null;
    }

    function setConfigFrom(config, handle) {
        var groups = (config && config.sets) || [];
        var i;
        var j;
        var sets;
        var key;
        var inner;

        if (Array.isArray(groups)) {
            for (i = 0; i < groups.length; i++) {
                sets = groups[i].sets || [];
                for (j = 0; j < sets.length; j++) {
                    if (sets[j] && sets[j].handle === handle) {
                        return sets[j];
                    }
                }
            }

            return {};
        }

        if (groups[handle] && groups[handle].fields) {
            return groups[handle];
        }

        for (key in groups) {
            if (!Object.prototype.hasOwnProperty.call(groups, key)) {
                continue;
            }

            inner = groups[key] && groups[key].sets;
            if (!inner) {
                continue;
            }

            if (inner[handle]) {
                return inner[handle];
            }

            if (Array.isArray(inner)) {
                for (i = 0; i < inner.length; i++) {
                    if (inner[i] && inner[i].handle === handle) {
                        return inner[i];
                    }
                }
            }
        }

        return {};
    }

    var CHUNK_CONTENT = '__content';

    function fieldMeta(field) {
        var nested = field && field.field && typeof field.field === 'object' ? field.field : null;
        var cfg = (field && field.config && typeof field.config === 'object') ? field.config : nested;

        return {
            handle: (field && field.handle) || (cfg && cfg.handle) || '',
            type: (field && (field.type || field.fieldtype)) || (cfg && cfg.type) || '',
            style: (field && field.style) || (cfg && cfg.style) || '',
            display: (field && field.display) || (cfg && cfg.display) || '',
            visibility: (field && field.visibility) || (cfg && cfg.visibility) || '',
            defaultOpen: !!(field && field.default_open) || !!(cfg && cfg.default_open),
        };
    }

    function alwaysKeepField(meta) {
        var type;

        if (!meta) {
            return true;
        }

        if (meta.handle && String(meta.handle).charAt(0) === '_') {
            return true;
        }

        type = String(meta.type || '');

        if (meta.visibility === 'hidden') {
            return true;
        }

        return type === 'tab' || type === 'hidden' || type === 'html' || type === 'auto_uuid';
    }

    function panelChunkKey(label) {
        return 'p-' + String(label || '').replace(/\s+/g, '-').toLowerCase();
    }

    function planFieldChunks(fields) {
        var groups = [];
        var loose = [];
        var open = null;
        var panel = null;
        var seq = 0;
        var map = [];
        var i;
        var field;
        var meta;
        var preferred;
        var gkey;
        var pkey;

        loose.panels = [];

        fields = Array.isArray(fields) ? fields : [];

        for (i = 0; i < fields.length; i++) {
            field = fields[i];
            meta = fieldMeta(field);

            if (meta.type === 'tab') {
                if (meta.style === 'accordion') {
                    pkey = panelChunkKey(meta.display || meta.handle);
                    panel = { key: pkey };
                    (open ? open.panels : loose.panels).push(panel);
                    map[i] = { group: open ? open.key : CHUNK_CONTENT, panel: pkey, keep: true };
                    continue;
                }

                panel = null;
                open = {
                    key: meta.handle || ('tab-' + seq),
                    defaultOpen: meta.defaultOpen,
                    panels: [],
                };
                seq += 1;
                groups.push(open);
                map[i] = { group: open.key, panel: null, keep: true };
                continue;
            }

            gkey = open ? open.key : CHUNK_CONTENT;
            pkey = panel ? panel.key : null;
            map[i] = { group: gkey, panel: pkey, keep: alwaysKeepField(meta) };

            if (!open && !panel) {
                loose.push(i);
            }
        }

        if (loose.length || loose.panels.length) {
            groups.unshift({
                key: CHUNK_CONTENT,
                defaultOpen: false,
                panels: loose.panels,
            });
        }

        preferred = null;

        for (i = 0; i < groups.length; i++) {
            if (groups[i].defaultOpen) {
                preferred = groups[i];
                break;
            }
        }

        return {
            groups: groups,
            map: map,
            firstKey: (preferred && preferred.key) || (groups[0] && groups[0].key) || CHUNK_CONTENT,
        };
    }

    function shouldChunkFields(fields) {
        var plan = planFieldChunks(fields);
        var i;

        if (plan.groups.length > 1) {
            return true;
        }

        for (i = 0; i < plan.groups.length; i++) {
            if (plan.groups[i].panels && plan.groups[i].panels.length) {
                return true;
            }
        }

        return false;
    }

    function defaultOpened(fields) {
        var tabs = {};

        tabs[planFieldChunks(fields).firstKey] = true;

        return { tabs: tabs, panels: {}, nests: {} };
    }

    function filterChunkFields(fields, opened) {
        var plan;
        var out;
        var i;
        var slot;
        var tabs;

        if (!shouldChunkFields(fields)) {
            return fields;
        }

        plan = planFieldChunks(fields);
        opened = opened || defaultOpened(fields);
        tabs = opened.tabs || {};
        out = [];

        for (i = 0; i < fields.length; i++) {
            slot = plan.map[i] || {};

            if (slot.keep || tabs[slot.group]) {
                out.push(fields[i]);
            }
        }

        return out;
    }

    function withLocalFirstTab(fields, opened) {
        var tabs = Object.assign({}, (opened && opened.tabs) || {});
        var first = planFieldChunks(fields).firstKey;

        if (first) {
            tabs[first] = true;
        }

        return {
            tabs: tabs,
            panels: (opened && opened.panels) || {},
            nests: (opened && opened.nests) || {},
        };
    }

    function stripLockedFields(fields) {
        var out = [];
        var i;
        var meta;

        fields = Array.isArray(fields) ? fields : [];

        for (i = 0; i < fields.length; i++) {
            meta = fieldMeta(fields[i]);

            if (meta.handle && String(meta.handle).charAt(0) === '_') {
                out.push(fields[i]);
                continue;
            }

            if (meta.visibility === 'hidden' || meta.type === 'hidden' || meta.type === 'auto_uuid') {
                out.push(fields[i]);
            }
        }

        return out;
    }

    function typesOnPath(node, uid) {
        var found = null;

        function walk(n, chain) {
            var next;
            var keys;
            var i;
            var key;

            if (!n || typeof n !== 'object' || typeof n.nodeType === 'number') {
                return false;
            }

            next = chain;

            if (typeof n.type === 'string' && n.type !== '' && (n._visual_id || n.id || n._id || n.enabled !== undefined)) {
                next = chain.concat([n.type]);
            }

            if (nodeHasUid(n, uid)) {
                found = next;
                return true;
            }

            if (Array.isArray(n)) {
                for (i = 0; i < n.length; i++) {
                    if (walk(n[i], chain)) {
                        return true;
                    }
                }

                return false;
            }

            keys = Object.keys(n);

            for (i = 0; i < keys.length; i++) {
                key = keys[i];

                if (String(key).indexOf('__') === 0) {
                    continue;
                }

                if (walk(n[key], next)) {
                    return true;
                }
            }

            return false;
        }

        walk(node, []);

        return found || [];
    }

    function unlockedTypes(row, opened) {
        var out = {};
        var id;
        var chain;
        var i;

        function add(uid) {
            chain = typesOnPath(row, uid);

            for (i = 0; i < chain.length; i++) {
                out[String(chain[i])] = true;
            }
        }

        if (row && row.type) {
            out[String(row.type)] = true;
        }

        if (liteVm && liteVm.focusUid) {
            add(liteVm.focusUid);
        }

        for (id in (opened && opened.nests) || {}) {
            if (Object.prototype.hasOwnProperty.call(opened.nests, id)) {
                add(id);
            }
        }

        return out;
    }

    function filterSetsTree(sets, opened, unlocked) {
        var out;
        var key;

        if (!sets) {
            return sets;
        }

        if (Array.isArray(sets)) {
            return sets.map(function (group) {
                return filterOneSet(group, opened, unlocked, group && group.handle);
            });
        }

        out = {};

        for (key in sets) {
            if (!Object.prototype.hasOwnProperty.call(sets, key)) {
                continue;
            }

            out[key] = filterOneSet(sets[key], opened, unlocked, key);
        }

        return out;
    }

    function filterOneSet(set, opened, unlocked, key) {
        var handle;
        var locked;

        if (!set || typeof set !== 'object') {
            return set;
        }

        if (set.sets && !set.fields) {
            return Object.assign({}, set, { sets: filterSetsTree(set.sets, opened, unlocked) });
        }

        handle = (set.handle || key || '');
        locked = handle !== '' && !unlocked[String(handle)];

        if (locked && set.fields) {
            return Object.assign({}, set, { fields: stripLockedFields(set.fields) });
        }

        if (set.fields) {
            return Object.assign({}, set, { fields: filterConfigTree(set.fields, opened, unlocked) });
        }

        return set;
    }

    function cloneFilterField(field, opened, unlocked) {
        var meta = fieldMeta(field);
        var type = String(meta.type || '');
        var next;
        var sets;
        var nested;
        var fields;

        if (type !== 'replicator' && type !== 'grid' && type !== 'bard' && type !== 'sve_lite_sections') {
            return field;
        }

        next = Object.assign({}, field);

        if (next.config && typeof next.config === 'object') {
            next.config = Object.assign({}, next.config);
        }

        nested = next.field && typeof next.field === 'object' ? Object.assign({}, next.field) : null;

        if (nested) {
            next.field = nested;
        }

        sets = next.sets || (next.config && next.config.sets) || (nested && nested.sets);

        if (sets) {
            sets = filterSetsTree(sets, opened, unlocked);

            if (next.sets) {
                next.sets = sets;
            } else if (next.config && next.config.sets) {
                next.config.sets = sets;
            } else if (nested && nested.sets) {
                nested.sets = sets;
            }
        }

        fields = next.fields || (next.config && next.config.fields) || (nested && nested.fields);

        if (type === 'grid' && fields) {
            fields = filterConfigTree(fields, opened, unlocked);

            if (next.fields) {
                next.fields = fields;
            } else if (next.config && next.config.fields) {
                next.config.fields = fields;
            } else if (nested && nested.fields) {
                nested.fields = fields;
            }
        }

        return next;
    }

    function filterConfigTree(fields, opened, unlocked) {
        return filterChunkFields(fields, withLocalFirstTab(fields, opened)).map(function (field) {
            return cloneFilterField(field, opened, unlocked || {});
        });
    }

    function rowByUid(uid) {
        var rows = liteRows();
        var i;

        for (i = 0; i < rows.length; i++) {
            if (nodeHasUid(rows[i], uid)) {
                return rows[i];
            }
        }

        return null;
    }

    function openedFor(uid) {
        var row;
        var fields;

        if (liteVm && liteVm.chunks && liteVm.chunks[uid]) {
            return liteVm.chunks[uid];
        }

        row = rowByUid(uid);
        fields = row ? ((setConfigFrom(liteVm && liteVm.config, row.type) || {}).fields || []) : [];

        return defaultOpened(fields);
    }

    function openChunk(uid, kind, key) {
        var cur;
        var next;
        var all;

        if (!liteVm || !uid || !key) {
            return;
        }

        cur = openedFor(uid);
        next = {
            tabs: Object.assign({}, cur.tabs),
            panels: Object.assign({}, cur.panels),
            nests: Object.assign({}, cur.nests),
        };

        if (kind === 'tab') {
            if (next.tabs[key]) {
                return;
            }

            next.tabs[key] = true;
        } else {
            if (next.panels[key]) {
                return;
            }

            next.panels[key] = true;
        }

        all = Object.assign({}, liteVm.chunks || {});
        all[uid] = next;
        liteVm.chunks = all;
    }

    function revealUid(uid) {
        var section;
        var cur;
        var next;
        var all;
        var id;

        if (!liteVm || !uid) {
            return;
        }

        section = sectionUidFor(uid);

        if (!section) {
            return;
        }

        id = String(uid);
        cur = openedFor(section);

        if (liteVm.focusUid === uid && cur.nests && cur.nests[id]) {
            return;
        }

        next = {
            tabs: Object.assign({}, cur.tabs),
            panels: Object.assign({}, cur.panels),
            nests: Object.assign({}, cur.nests),
        };
        next.nests[id] = true;
        all = Object.assign({}, liteVm.chunks || {});
        all[section] = next;
        liteVm.chunks = all;
        liteVm.focusUid = uid;
    }

    function uidFromChunkList(list) {
        var pane;
        var sectionSet;

        if (!list || !list.closest) {
            return null;
        }

        pane = list.closest('[data-sve-lite-pane]');

        if (!pane || !list.closest('[data-sve-lite]')) {
            return null;
        }

        sectionSet = pane.querySelector('[data-replicator-set]');

        if (!sectionSet) {
            return null;
        }

        return uidOfSet(sectionSet);
    }

    function bindChunkClicks() {
        if (window.__sveLiteChunks) {
            return;
        }

        window.__sveLiteChunks = true;

        document.addEventListener('sve-tab-chunk', function (event) {
            var detail = event.detail || {};
            var list = detail.list || event.target;
            var uid;

            if (!liteVm || !list) {
                return;
            }

            uid = uidFromChunkList(list);

            if (!uid) {
                return;
            }

            if (detail.group) {
                openChunk(uid, 'tab', detail.group);
            }

            if (detail.panel) {
                openChunk(uid, 'panel', detail.panel);
            }
        });
    }

    function register() {
        var Vue = window.Vue;
        var FieldtypeMixin = window.__STATAMIC__ && window.__STATAMIC__.core && window.__STATAMIC__.core.FieldtypeMixin;
        var SetComp = lookup('replicator-fieldtype-set');

        if (!window.Statamic || !Statamic.$components || !Vue || typeof Vue.h !== 'function' || !FieldtypeMixin) {
            return false;
        }

        if (window.__sveLiteRegistered) {
            return true;
        }

        Statamic.$components.register('sve_lite_sections-fieldtype', {
            mixins: [FieldtypeMixin],

            provide: function () {
                return {
                    replicatorSets: (this.config && this.config.sets) || [],
                    showReplicatorFieldPreviews: false,
                };
            },

            data: function () {
                return { activeUid: null, keptUids: [], pending: false, chunks: {}, focusUid: null };
            },

            created: function () {
                bindLite(this);

                if (PRELOAD_FIRST_SECTION && !this.activeUid && this.rows[0]) {
                    this.activeUid = uidOf(this.rows[0]);
                    this.focusUid = this.activeUid;
                }

                ensureLiteFieldHeights(document);
                window.addEventListener(FOCUS, this.onFocus);
                window.addEventListener(WARM, this.onWarm);
            },

            mounted: function () {
                markLiteAsWide(this.$el);
                ensureLiteFieldHeights(document);

                if (!PRELOAD_FIRST_SECTION || !this.activeUid) {
                    return;
                }

                waitForSet(this.activeUid, document, window, function () {
                    var uid = liteVm && liteVm.activeUid;
                    var setEl = findSetByUid(uid, document, 'active');

                    afterExpand(setEl, window, function () {
                        waitForFieldBox(setEl, window, function () {
                            waitForSoloThenReveal(document, window, function () {
                                if (PRELOAD_NEIGHBORS) {
                                    syncNeighbors(document, window);
                                }
                            });
                        });
                    });
                }, 'active');
            },

            updated: function () {
                markLiteAsWide(this.$el);
            },

            beforeUnmount: function () {
                unbindLite(this);
                window.removeEventListener(FOCUS, this.onFocus);
                window.removeEventListener(WARM, this.onWarm);
                endLitePending(document, window);
            },

            computed: {
                rows: function () {
                    return rowsOf(this.value);
                },

                activeIndex: function () {
                    var uid = this.activeUid;
                    var rows = this.rows;
                    var i;

                    if (!uid) {
                        return -1;
                    }

                    for (i = 0; i < rows.length; i++) {
                        if (nodeHasUid(rows[i], uid)) {
                            return i;
                        }
                    }

                    return this.rows.length ? 0 : -1;
                },

                activeRow: function () {
                    var i = this.activeIndex;

                    return i >= 0 ? this.rows[i] : null;
                },

                keptRows: function () {
                    var rows = this.rows;
                    var kept = this.keptUids || [];
                    var out = [];
                    var j;
                    var i;
                    var uid;

                    for (j = 0; j < kept.length; j++) {
                        uid = kept[j];

                        for (i = 0; i < rows.length; i++) {
                            if (nodeHasUid(rows[i], uid)) {
                                out.push({ row: rows[i], index: i, uid: uid });
                                break;
                            }
                        }
                    }

                    return out;
                },
            },

            watch: {
                rows: {
                    handler: function (rows, prev) {
                        var prevIds = {};
                        var i;
                        var uid;

                        prev = prev || [];

                        for (i = 0; i < prev.length; i++) {
                            uid = uidOf(prev[i]);
                            if (uid) {
                                prevIds[String(uid)] = true;
                            }
                        }

                        if (rows.length > prev.length) {
                            for (i = 0; i < rows.length; i++) {
                                uid = uidOf(rows[i]);
                                if (uid && !prevIds[String(uid)]) {
                                    this.activeUid = uid;
                                    this.keptUids = [];
                                    return;
                                }
                            }
                        }

                        if (this.activeUid) {
                            for (i = 0; i < rows.length; i++) {
                                if (nodeHasUid(rows[i], this.activeUid)) {
                                    return;
                                }
                            }
                        }

                        this.activeUid = rows[0] ? uidOf(rows[0]) : null;
                        this.keptUids = [];
                    },
                },
            },

            methods: {
                onFocus: function (event) {
                    var uid = event.detail && event.detail.uid;
                    var rows;
                    var i;
                    var next;
                    var prev;
                    var list;
                    var neighbors;
                    var n;
                    var want;

                    if (!uid) {
                        return;
                    }

                    rows = this.rows;

                    for (i = 0; i < rows.length; i++) {
                        if (containsUid(rows[i], uid)) {
                            next = uidOf(rows[i]);

                            if (!next) {
                                return;
                            }

                            revealUid(uid);

                            prev = this.activeUid;
                            list = (this.keptUids || []).filter(function (id) {
                                return String(id) !== String(next);
                            });

                            if (KEEP_MOUNTED) {
                                if (prev && String(prev) !== String(next) && list.indexOf(prev) === -1) {
                                    list.push(prev);
                                }

                                this.activeUid = next;
                                this.keptUids = list;

                                return;
                            }

                            neighbors = neighborUidsOf(next);
                            want = {};

                            for (n = 0; n < neighbors.length; n++) {
                                want[String(neighbors[n])] = true;
                            }

                            list = list.filter(function (id) {
                                return want[String(id)];
                            });

                            if (prev && want[String(prev)] && String(prev) !== String(next) && list.indexOf(prev) === -1) {
                                list.push(prev);
                            }

                            while (list.length > 2) {
                                list.shift();
                            }

                            this.activeUid = next;
                            this.keptUids = list;

                            return;
                        }
                    }
                },

                onWarm: function (event) {
                    var uid = event.detail && event.detail.uid;
                    var rows;
                    var i;
                    var next;
                    var list;

                    if (!uid) {
                        return;
                    }

                    rows = this.rows;

                    for (i = 0; i < rows.length; i++) {
                        if (containsUid(rows[i], uid)) {
                            next = uidOf(rows[i]);

                            if (!next || String(next) === String(this.activeUid)) {
                                return;
                            }

                            list = (this.keptUids || []).filter(function (id) {
                                return String(id) !== String(next);
                            });
                            list.push(next);

                            if (!KEEP_MOUNTED) {
                                while (list.length > 2) {
                                    list.shift();
                                }
                            }

                            this.keptUids = list;

                            return;
                        }
                    }
                },

                setVnode: function (h, Set, row, index) {
                    return h(Set, {
                        key: uidOf(row) || String(index),
                        id: row._id,
                        index: index,
                        fieldPath: this.handle,
                        metaPath: this.handle,
                        values: row,
                        config: this.chunkedConfig(row),
                        collapsed: false,
                        enabled: row.enabled !== false,
                        readOnly: this.readOnly,
                        canAddSet: false,
                        hasError: false,
                        showFieldPreviews: false,
                        sortableItemClass: 'sve-lite-item',
                        sortableHandleClass: 'sve-lite-handle',
                    });
                },

                chunkedConfig: function (row) {
                    var full = setConfigFrom(this.config, row.type);
                    var uid = uidOf(row);
                    var opened = openedFor(uid);
                    var unlocked = unlockedTypes(row, opened);
                    var sig = String(uid) + ':' + Object.keys(opened.tabs || {}).sort().join(',') + ':' + Object.keys(opened.nests || {}).sort().join(',') + ':' + Object.keys(unlocked).sort().join(',');
                    var cached;

                    this._chunkCfgs = this._chunkCfgs || {};
                    cached = this._chunkCfgs[sig];

                    if (cached && cached.full === full) {
                        return cached.config;
                    }

                    cached = {
                        full: full,
                        config: Object.assign({}, full, {
                            fields: filterConfigTree(full.fields || [], opened, unlocked),
                        }),
                    };
                    this._chunkCfgs[sig] = cached;

                    return cached.config;
                },
            },

            render: function () {
                var h = Vue.h;
                var Set = SetComp || lookup('replicator-fieldtype-set');
                var panes = [];
                var seen = {};
                var width;
                var self = this;
                var i;

                function addPane(row, index, role) {
                    var id = uidOf(row);
                    var style;

                    if (!row || index < 0 || !id || seen[id]) {
                        return;
                    }

                    seen[id] = true;
                    style = (role === 'warm' || (role === 'active' && self.pending))
                        ? Object.assign({ width: width }, WARM_STYLE)
                        : null;

                    panes.push(h('div', {
                        key: id,
                        'data-sve-lite-pane': role,
                        'aria-hidden': (role === 'warm' || (role === 'active' && self.pending)) ? 'true' : 'false',
                        style: style,
                    }, [self.setVnode(h, Set, row, index)]));
                }

                if (!this.activeRow || this.activeIndex < 0) {
                    return h('div', { 'data-sve-lite': 'idle' });
                }

                if (!Set) {
                    return h('div', { 'data-sve-lite': 'missing-set' });
                }

                width = (this.$el && this.$el.parentElement && this.$el.parentElement.clientWidth)
                    ? this.$el.parentElement.clientWidth + 'px'
                    : '100%';

                addPane(this.activeRow, this.activeIndex, 'active');

                for (i = 0; i < this.keptRows.length; i++) {
                    addPane(this.keptRows[i].row, this.keptRows[i].index, 'warm');
                }

                return h('div', {
                    'data-sve-lite': 'on',
                    'data-sve-lite-pending': this.pending ? '1' : null,
                    style: { position: 'relative' },
                }, panes);
            },
        });

        window.__sveLiteRegistered = true;

        return true;
    }

    /**
     * Sibling-sync treats `.replicator-fieldtype` as a shell (do not lock the
     * whole stack). Lite replaces that shell but keeps `sve_lite_sections-fieldtype`,
     * so a nested synced field paints follow+inert on the wrapper — dim overlay,
     * no clicks. Same shell as replicator, without rebuilding sibling-sync.
     */
    function markLiteAsWide(el) {
        var wrap = el && el.closest
            ? el.closest('.sve_lite_sections-fieldtype')
            : null;
        var child;

        if (!wrap && el && el.classList && el.classList.contains('sve_lite_sections-fieldtype')) {
            wrap = el;
        }

        if (!wrap || !wrap.classList) {
            return;
        }

        wrap.classList.add('replicator-fieldtype');

        if (!wrap.hasAttribute('data-sve-sync-field')) {
            return;
        }

        wrap.removeAttribute('data-sve-sync-locked');
        wrap.removeAttribute('data-sve-sync-field');
        wrap.removeAttribute('data-sve-sync-state');
        wrap.removeAttribute('data-sve-sync-path');
        wrap.removeAttribute('data-sve-sync-source');

        for (child = wrap.firstElementChild; child; child = child.nextElementSibling) {
            child.removeAttribute('inert');
        }
    }

    function paneOfSet(setEl) {
        var pane = setEl && setEl.closest && setEl.closest('[data-sve-lite-pane]');

        return pane ? pane.getAttribute('data-sve-lite-pane') : 'active';
    }

    function findSetByUid(uid, doc, pane) {
        var sets = doc.querySelectorAll('[data-replicator-set]');
        var i;
        var want = pane || 'active';

        for (i = 0; i < sets.length; i++) {
            if (paneOfSet(sets[i]) !== want) {
                continue;
            }

            if (uidOfSet(sets[i]) != null && String(uidOfSet(sets[i])) === String(uid)) {
                return sets[i];
            }
        }

        return null;
    }

    function replicatorProxy(setEl) {
        var inst = setEl && setEl.__vueParentComponent;
        var rec = inst;

        while (rec && !(rec.proxy && typeof rec.proxy.expandSet === 'function')) {
            rec = rec.parent;
        }

        return rec && rec.proxy ? rec.proxy : null;
    }

    /**
     * Nested replicators start collapsed (accordion + preload). Statamic's
     * header toggle is a Vue onClick; a synthetic click does not open them,
     * so solo CSS hides the header and the field body stays `display:none`.
     * Call the parent Replicator's expandSet with the set id instead.
     */
    function expandMountedPath(setEl) {
        var chain = [];
        var node = setEl;
        var i;
        var inst;
        var id;
        var proxy;

        while (node) {
            if (node.hasAttribute && node.hasAttribute('data-replicator-set')) {
                chain.unshift(node);
            }

            node = node.parentElement;
        }

        for (i = 0; i < chain.length; i++) {
            inst = chain[i].__vueParentComponent;
            id = inst && inst.props && inst.props.id;
            proxy = replicatorProxy(chain[i]);

            if (proxy && id) {
                proxy.expandSet(id);
            }
        }
    }

    function afterExpand(setEl, win, done) {
        var tries = 0;

        function tick() {
            if (!setEl || setEl.getAttribute('data-collapsed') === 'false' || tries >= 20) {
                done();

                return;
            }

            if (tries === 0 || tries === 3 || tries === 8) {
                expandMountedPath(setEl);
            }

            tries += 1;
            win.setTimeout(tick, 50);
        }

        if (!setEl) {
            done();

            return;
        }

        expandMountedPath(setEl);
        win.setTimeout(tick, 0);
    }

    function setHasFields(setEl) {
        if (!setEl || setEl.getAttribute('data-collapsed') === 'true') {
            return false;
        }

        return !!setEl.querySelector(
            'input:not([type="hidden"]), textarea, select, .ProseMirror, .input-text'
        );
    }

    function waitForSet(uid, doc, win, done, pane, opts) {
        var tries = 0;
        var want = pane || 'active';
        var skipExpand = opts && opts.skipExpand;
        var alsoWarm = opts && opts.alsoWarm;

        function tick() {
            var setEl = findSetByUid(uid, doc, want);

            if (alsoWarm) {
                setEl = setEl || findSetByUid(uid, doc, 'warm');
            }

            if (setEl && (setHasFields(setEl) || tries >= 8)) {
                if (!skipExpand) {
                    expandMountedPath(setEl);
                }
                done();
                return;
            }

            if (setEl) {
                expandMountedPath(setEl);
            }

            if (tries++ < 40) {
                win.setTimeout(tick, 50);
            } else {
                done();
            }
        }

        tick();
    }

    function ensureLiteFieldHeights(doc) {
        var style;
        var css;

        if (!doc) {
            return;
        }

        css =
            '[data-sve-lite] .text-fieldtype input:not([type="hidden"]),' +
            '[data-sve-lite] .text-fieldtype .input-text{' +
            'min-height:2.5rem;box-sizing:border-box;}' +
            '[data-sve-lite] .textarea-fieldtype textarea,' +
            '[data-sve-lite] .bard-fieldtype,' +
            '[data-sve-lite] .bard-fieldtype-inner,' +
            '[data-sve-lite] .bard-content,' +
            '[data-sve-lite] .bard-fieldtype .ProseMirror,' +
            '[data-sve-lite] .bard-fieldtype [contenteditable="true"]{' +
            'min-height:8rem;box-sizing:border-box;}' +
            '[data-sve-lite] .sve-field-highlight,' +
            '[data-sve-lite] .sve-highlight{' +
            'animation:none!important;box-shadow:none!important;}' +
            '[data-sve-lite] .bard-fieldtype .ProseMirror:focus,' +
            '[data-sve-lite] .bard-fieldtype .ProseMirror:focus-visible,' +
            '[data-sve-lite] .bard-fieldtype [contenteditable="true"]:focus,' +
            '[data-sve-lite] .bard-fieldtype [contenteditable="true"]:focus-visible{' +
            'outline:none!important;box-shadow:none!important;}' +
            '@keyframes sve-lp-spin{to{transform:rotate(360deg)}}' +
            '.live-preview-editor .live-preview-fields>:not([data-sve-focus-header]){' +
            'transition:opacity .28s ease;}' +
            '.live-preview-editor[data-sve-lite-sidebar-pending]>:not(.live-preview-fields):not(.live-preview-resizer):not(#__sve-lite-spinner){' +
            'opacity:0!important;pointer-events:none!important;}' +
            '.live-preview-editor[data-sve-lite-sidebar-pending] .live-preview-fields>:not([data-sve-focus-header]){' +
            'opacity:0!important;pointer-events:none!important;transition:none;}' +
            '.live-preview-editor[data-sve-lite-sidebar-pending] [data-sve-focus-header]{' +
            'opacity:1!important;pointer-events:none;}' +
            '#__sve-lite-spinner{' +
            'position:absolute;left:0;right:0;bottom:0;top:4.25rem;z-index:30;display:flex;' +
            'align-items:center;justify-content:center;pointer-events:none;opacity:0;' +
            'transition:opacity .28s ease;}' +
            '.sve-lite-spinner-dot{' +
            'display:flex;align-items:center;justify-content:center;width:22px;height:22px;' +
            'border-radius:999px;background:#000;color:#fff;opacity:.72;}' +
            '.sve-lite-spinner-dot svg{animation:sve-lp-spin 1s linear infinite;}';

        style = doc.getElementById('sve-lite-field-heights');

        if (!style) {
            style = doc.createElement('style');
            style.id = 'sve-lite-field-heights';
            doc.head.appendChild(style);
        }

        if (style.textContent !== css) {
            style.textContent = css;
        }
    }

    function scheduleFocusExpand(doc, win) {
        var view = win || window;
        var tries = 0;

        function tick() {
            var setEl;

            if (!doc.querySelector('[data-sve-lite]')) {
                return;
            }

            setEl = doc.querySelector('[data-sve-focus-set]');

            if (!setEl || setEl.getAttribute('data-collapsed') === 'false') {
                return;
            }

            expandMountedPath(setEl);
            tries += 1;

            if (tries < 20 && setEl.getAttribute('data-collapsed') !== 'false') {
                view.setTimeout(tick, 50);
            }
        }

        tick();
    }

    function watchFocusExpand() {
        var doc;

        if (window.__sveLiteExpandWatch) {
            return;
        }

        window.__sveLiteExpandWatch = true;
        doc = document;

        new MutationObserver(function () {
            markLiteAsWide(doc.querySelector('.sve_lite_sections-fieldtype'));
            ensureLiteFieldHeights(doc);
            scheduleFocusExpand(doc, window);
        }).observe(doc.documentElement, {
            subtree: true,
            attributes: true,
            attributeFilter: ['data-sve-focus-set', 'data-collapsed', 'data-sve-lite'],
        });
    }

    function wrapSolo() {
        var sve = window.sve;

        if (!sve) {
            return false;
        }

        if (typeof sve.soloSection === 'function' && !sve.soloSection.__sveLite) {
            var orig = sve.soloSection;

            sve.soloSection = function (uid, doc, win, opts) {
                var args = arguments;

                if (!uid || !doc || !doc.querySelector('[data-sve-lite]')) {
                    return orig.apply(this, args);
                }

                window.dispatchEvent(new CustomEvent(FOCUS, { detail: { uid: uid } }));

                waitForSet(uid, doc, win || window, function () {
                    var view = win || window;

                    afterExpand(findSetByUid(uid, doc), view, function () {
                        orig.apply(sve, args);
                    });
                });

                return true;
            };

            sve.soloSection.__sveLite = true;
        }

        if (typeof sve.soloSectionSettings === 'function' && !sve.soloSectionSettings.__sveLite) {
            var origSettings = sve.soloSectionSettings;

            sve.soloSectionSettings = function (uid, doc, win) {
                var args = arguments;

                if (!uid || !doc || !doc.querySelector('[data-sve-lite]')) {
                    return origSettings.apply(this, args);
                }

                window.dispatchEvent(new CustomEvent(FOCUS, { detail: { uid: uid } }));

                waitForSet(uid, doc, win || window, function () {
                    var view = win || window;

                    afterExpand(findSetByUid(uid, doc), view, function () {
                        origSettings.apply(sve, args);
                    });
                });

                return true;
            };

            sve.soloSectionSettings.__sveLite = true;
        }

        var ok = typeof sve.soloSection === 'function' && sve.soloSection.__sveLite;

        if (ok) {
            window.__sveLiteSoloWrapped = true;
        }

        return ok;
    }

    function showingSection(uid) {
        var section = sectionUidFor(uid);

        return !!(section && liteVm && String(liteVm.activeUid) === String(section));
    }

    function keptList() {
        return (liteVm && Array.isArray(liteVm.keptUids)) ? liteVm.keptUids : [];
    }

    function isKept(uid) {
        var section = sectionUidFor(uid);
        var kept;
        var i;

        if (!section) {
            return false;
        }

        kept = keptList();

        for (i = 0; i < kept.length; i++) {
            if (String(kept[i]) === String(section)) {
                return true;
            }
        }

        return false;
    }

    function isMounted(uid) {
        return showingSection(uid) || isKept(uid);
    }

    function neighborUidsOf(uid) {
        var rows = liteRows();
        var section = sectionUidFor(uid) || uid;
        var i;
        var out = [];
        var id;

        for (i = 0; i < rows.length; i++) {
            if (!nodeHasUid(rows[i], section) && !containsUid(rows[i], uid)) {
                continue;
            }

            if (i > 0) {
                id = uidOf(rows[i - 1]);
                if (id) {
                    out.push(id);
                }
            }

            if (i + 1 < rows.length) {
                id = uidOf(rows[i + 1]);
                if (id) {
                    out.push(id);
                }
            }

            return out;
        }

        return out;
    }

    function activateSection(uid) {
        var section = sectionUidFor(uid);

        if (!liteVm || !section) {
            return null;
        }

        window.dispatchEvent(new CustomEvent(FOCUS, { detail: { uid: uid } }));

        return section;
    }

    function warmSection(uid, doc, win) {
        var section = sectionUidFor(uid);
        var view = win || window;
        var Vue = window.Vue;

        if (!liteVm || !section || String(liteVm.activeUid) === String(section)) {
            return section;
        }

        window.dispatchEvent(new CustomEvent(WARM, { detail: { uid: uid } }));

        function start() {
            waitForSet(section, doc, view, function () {}, 'warm');
        }

        if (Vue && typeof Vue.nextTick === 'function') {
            Vue.nextTick(start);
        } else {
            view.setTimeout(start, 0);
        }

        return section;
    }

    var neighborGen = 0;

    function cancelNeighbors() {
        neighborGen += 1;
    }

    function syncNeighbors(doc, win) {
        var view = win || window;
        var Vue = window.Vue;
        var wanted;
        var gen;
        var wantMap;
        var i;

        if (!PRELOAD_NEIGHBORS) {
            return;
        }

        if (!liteVm || !liteVm.activeUid) {
            return;
        }

        neighborGen += 1;
        gen = neighborGen;
        wanted = neighborUidsOf(liteVm.activeUid);
        wantMap = {};

        for (i = 0; i < wanted.length; i++) {
            wantMap[String(wanted[i])] = true;
        }

        if (!KEEP_MOUNTED) {
            liteVm.keptUids = keptList().filter(function (id) {
                return wantMap[String(id)] && String(id) !== String(liteVm.activeUid);
            });
        }

        function mountAt(index) {
            var uid;

            if (gen !== neighborGen || !liteVm) {
                return;
            }

            if (index >= wanted.length) {
                return;
            }

            uid = wanted[index];

            if (showingSection(uid) || isKept(uid)) {
                mountAt(index + 1);
                return;
            }

            window.dispatchEvent(new CustomEvent(WARM, { detail: { uid: uid } }));

            function start() {
                waitForSet(uid, doc, view, function () {
                    mountAt(index + 1);
                }, 'warm');
            }

            if (Vue && typeof Vue.nextTick === 'function') {
                Vue.nextTick(start);
            } else {
                view.setTimeout(start, 0);
            }
        }

        mountAt(0);
    }

    function instantFocusHeader(uid, doc, win) {
        var sve = window.sve;
        var view = win || window;
        var header;
        var meta;
        var back;

        if (!sve || !doc || !uid) {
            return;
        }

        if (typeof sve.ensureFocusHeader === 'function') {
            sve.ensureFocusHeader(doc);
        }

        if (typeof sve.paintFocusHeader === 'function' && typeof sve.focusRowMeta === 'function') {
            meta = sve.focusRowMeta(view, uid, doc);
            back = typeof sve.focusBack === 'function'
                ? sve.focusBack(view, doc, uid, 'section')
                : null;
            sve.paintFocusHeader(view, doc, meta, back);
        }

        header = (sve.FOCUS_HEADER_ID && doc.getElementById(sve.FOCUS_HEADER_ID))
            || doc.querySelector('[data-sve-focus-header]');

        if (header && sve.SOLO_KEEP_ATTR) {
            header.setAttribute(sve.SOLO_KEEP_ATTR, '');
        }
    }

    function waitForFieldBox(root, win, done) {
        var tries = 0;

        function tick() {
            var el = root && root.querySelector(
                '.bard-fieldtype, .bard-fieldtype [contenteditable="true"], ' +
                '.textarea-fieldtype textarea, .text-fieldtype .input-text, ' +
                '.text-fieldtype input:not([type="hidden"])'
            );
            var h = el ? el.getBoundingClientRect().height : 0;

            if (h >= 32 || tries >= 20) {
                done();
                return;
            }

            tries += 1;
            win.setTimeout(tick, 50);
        }

        tick();
    }

    var SPINNER_ID = '__sve-lite-spinner';
    var SPINNER_DELAY = 800;
    var SPINNER_FADE = 280;
    var pendingTimer = 0;
    var spinnerRemoveTimer = 0;
    var pendingGen = 0;

    function editorEl(doc) {
        return doc && doc.querySelector('.live-preview-editor');
    }

    function setSidebarPending(doc, on) {
        var editor = editorEl(doc);

        if (!editor) {
            return;
        }

        if (on) {
            editor.setAttribute('data-sve-lite-sidebar-pending', '');
        } else {
            editor.removeAttribute('data-sve-lite-sidebar-pending');
        }
    }

    function beginLitePending(doc, win, immediate) {
        var view = win || window;
        var gen;

        pendingGen += 1;
        gen = pendingGen;

        if (liteVm) {
            liteVm.pending = true;
        }

        setSidebarPending(doc, true);
        removeSpinnerNow(doc);
        view.clearTimeout(spinnerRemoveTimer);
        view.clearTimeout(pendingTimer);

        if (immediate) {
            showLiteSpinner(doc);
            return;
        }

        pendingTimer = view.setTimeout(function () {
            if (gen !== pendingGen) {
                return;
            }

            showLiteSpinner(doc);
        }, SPINNER_DELAY);
    }

    function endLitePending(doc, win) {
        var view = win || window;

        view.clearTimeout(pendingTimer);
        pendingTimer = 0;
        hideLiteSpinner(doc, view);
        setSidebarPending(doc, false);

        if (liteVm) {
            liteVm.pending = false;
        }
    }

    function showLiteSpinner(doc) {
        var editor = editorEl(doc);
        var el;
        var view;

        if (!editor || !doc) {
            return;
        }

        el = doc.getElementById(SPINNER_ID);

        if (!el) {
            el = doc.createElement('div');
            el.id = SPINNER_ID;
            el.setAttribute('aria-hidden', 'true');
            el.innerHTML =
                '<span class="sve-lite-spinner-dot">' +
                '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" ' +
                'stroke="currentColor" stroke-width="2.5" stroke-linecap="round">' +
                '<path d="M21 12a9 9 0 1 1-6.219-8.56"></path>' +
                '</svg></span>';
            editor.appendChild(el);
        }

        el.style.opacity = '0';
        view = doc.defaultView;

        if (view && typeof view.requestAnimationFrame === 'function') {
            view.requestAnimationFrame(function () {
                el.style.opacity = '1';
            });
        } else {
            el.style.opacity = '1';
        }
    }

    function hideLiteSpinner(doc, win) {
        var el = doc && doc.getElementById(SPINNER_ID);
        var view = win || (doc && doc.defaultView) || window;

        if (!el) {
            return;
        }

        el.style.opacity = '0';
        view.clearTimeout(spinnerRemoveTimer);
        spinnerRemoveTimer = view.setTimeout(function () {
            var still = doc.getElementById(SPINNER_ID);
            var editor = editorEl(doc);

            if (still && editor && !editor.hasAttribute('data-sve-lite-sidebar-pending')) {
                still.parentNode.removeChild(still);
            }
        }, SPINNER_FADE);
    }

    function removeSpinnerNow(doc) {
        var el = doc && doc.getElementById(SPINNER_ID);

        if (el && el.parentNode) {
            el.parentNode.removeChild(el);
        }
    }

    function focusPanelOn(win) {
        var feats = win.Statamic && win.Statamic.$config && typeof win.Statamic.$config.get === 'function'
            ? win.Statamic.$config.get('sveFeatures')
            : null;

        return !feats || feats.focus_panel !== false;
    }

    function activePaneHasSolo(doc) {
        var pane = doc.querySelector('[data-sve-lite-pane="active"]');

        return !!(pane && pane.querySelector('[data-sve-focus-set]'));
    }

    function waitForSoloThenReveal(doc, win, done) {
        var view = win || window;
        var tries = 0;
        var gen = pendingGen;

        function finish() {
            if (gen !== pendingGen) {
                if (done) {
                    done();
                }

                return;
            }

            endLitePending(doc, view);

            if (done) {
                done();
            }
        }

        if (!focusPanelOn(view)) {
            finish();
            return;
        }

        function tick() {
            if (activePaneHasSolo(doc) || tries >= 40) {
                finish();
                return;
            }

            tries += 1;
            view.setTimeout(tick, 50);
        }

        tick();
    }

    function afterPaint(view, fn) {
        if (view && typeof view.requestAnimationFrame === 'function') {
            view.requestAnimationFrame(function () {
                view.requestAnimationFrame(fn);
            });
            return;
        }

        view.setTimeout(fn, 0);
    }

    function watchMountedSection(uid, doc, view, reuse, done) {
        var Vue = window.Vue;

        function start() {
            waitForSet(uid, doc, view, function () {
                var setEl;

                if (reuse) {
                    done();
                    return;
                }

                setEl = findSetByUid(uid, doc, 'active') || findSetByUid(uid, doc);

                afterExpand(setEl, view, function () {
                    waitForFieldBox(setEl, view, done);
                });
            }, 'active', { skipExpand: reuse, alsoWarm: reuse });
        }

        if (Vue && typeof Vue.nextTick === 'function') {
            Vue.nextTick(start);
        } else {
            view.setTimeout(start, 0);
        }
    }

    function switchMountedSection(uid, doc, win, done) {
        var reuse = isMounted(uid);
        var section;
        var view = win || window;

        instantFocusHeader(uid, doc, view);
        cancelNeighbors();

        if (reuse) {
            pendingGen += 1;
            setSidebarPending(doc, false);

            if (liteVm) {
                liteVm.pending = false;
            }

            section = activateSection(uid);

            if (!section) {
                done();
                return;
            }

            watchMountedSection(section, doc, view, true, done);
            return;
        }

        beginLitePending(doc, view, true);

        afterPaint(view, function () {
            section = activateSection(uid);

            if (!section) {
                endLitePending(doc, view);
                done();
                return;
            }

            watchMountedSection(section, doc, view, false, done);
        });
    }

    function unpressSettingsTabs(doc) {
        if (!doc) {
            return;
        }

        doc.querySelectorAll('[data-sve-settings-tab]').forEach(function (btn) {
            btn.setAttribute('aria-pressed', 'false');
        });
    }

    function replayAsListViewClick(uid, doc) {
        var row = doc.querySelector('[data-sve-lv-uid="' + uid + '"]');
        var again;

        if (!row) {
            return;
        }

        again = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
        });
        again.__sveLiteReplay = true;
        row.dispatchEvent(again);
    }

    /**
     * sve lives in the addon module, not window.sve — wrapSolo never ran.
     * Click mounts that section first; neighbours park off-screen afterwards.
     * Hover may park one extra row in a keep-slot. Max three mounted at once.
     */
    function interceptPreviewClicks() {
        var replaying = false;

        if (window.__sveLitePreviewInterceptV5) {
            return;
        }

        window.__sveLitePreviewInterceptV5 = true;

        window.addEventListener(
            'message',
            function (event) {
                var doc = document;
                var preview;
                var data = event.data;
                var uid;
                var replay;
                var section;

                if (replaying) {
                    return;
                }

                if (!doc.querySelector('[data-sve-lite]') || !liteVm) {
                    return;
                }

                preview = doc.getElementById('live-preview-iframe');

                if (!preview || !data || data.source !== 'statamic-visual-editor') {
                    return;
                }

                if (event.source !== preview.contentWindow) {
                    return;
                }

                uid = data.scope || data.uid;
                section = sectionUidFor(uid);

                if (data.type === 'hover') {
                    scheduleLiteHover(uid, doc, window);

                    return;
                }

                if (data.type !== 'click') {
                    return;
                }

                window.clearTimeout(liteHoverTimer);
                liteHoverUid = '';

                if (!section) {
                    return;
                }

                revealUid(uid);

                if (showingSection(uid)) {
                    return;
                }

                event.stopImmediatePropagation();

                switchMountedSection(uid, doc, window, function () {
                    unpressSettingsTabs(doc);

                    try {
                        replay = new MessageEvent('message', {
                            data: data,
                            origin: event.origin,
                            source: event.source,
                        });
                    } catch (err) {
                        replay = null;
                    }

                    replaying = true;

                    if (replay) {
                        window.dispatchEvent(replay);
                    }

                    window.setTimeout(function () {
                        if (!doc.querySelector('[data-sve-focus-set]')) {
                            replayAsListViewClick(section, doc);
                        }

                        replaying = false;
                        waitForSoloThenReveal(doc, window, function () {
                            syncNeighbors(doc, window);
                        });
                    }, 50);
                });
            },
            true
        );
    }

    function uidFromTreeEvent(event) {
        var path;
        var i;
        var el;
        var uid;

        if (event.composedPath) {
            path = event.composedPath();

            for (i = 0; i < path.length; i++) {
                el = path[i];

                if (el && el.getAttribute) {
                    uid = el.getAttribute('data-sve-lv-uid');

                    if (uid) {
                        return uid;
                    }
                }
            }
        }

        el = event.target;

        if (el && el.nodeType === 3) {
            el = el.parentElement;
        }

        while (el && typeof el.closest !== 'function') {
            el = el.parentElement;
        }

        el = el && el.closest && el.closest('[data-sve-lv-uid]');

        return el ? el.getAttribute('data-sve-lv-uid') : null;
    }

    var liteHoverTimer = 0;
    var liteHoverUid = '';

    function scheduleLiteHover(uid, doc, win) {
        var view = win || window;
        var root = doc || document;

        if (!uid || !root.querySelector('[data-sve-lite]') || (liteVm && liteVm.pending) || !sectionUidFor(uid)) {
            return;
        }

        view.clearTimeout(liteHoverTimer);
        liteHoverUid = uid;
        liteHoverTimer = view.setTimeout(function () {
            var current = liteHoverUid;
            var section;

            liteHoverTimer = 0;

            if (!current || (liteVm && liteVm.pending) || !sectionUidFor(current) || !root.querySelector('[data-sve-lite]')) {
                return;
            }

            revealUid(current);
            section = sectionUidFor(current);

            if (String(liteVm.activeUid) !== String(section) && !isKept(section)) {
                warmSection(current, root, view);
            }
        }, 120);
    }

    function bindTreeRowHover(el) {
        if (!el || el.__sveLiteHoverRow || !el.getAttribute || !el.getAttribute('data-sve-lv-uid')) {
            return;
        }

        el.__sveLiteHoverRow = true;
        el.addEventListener('pointerenter', function () {
            scheduleLiteHover(el.getAttribute('data-sve-lv-uid'), document, window);
        });
    }

    function scanTreeHoverRows(root) {
        if (!root || root.nodeType !== 1) {
            return;
        }

        bindTreeRowHover(root);

        if (root.querySelectorAll) {
            root.querySelectorAll('[data-sve-lv-uid]').forEach(bindTreeRowHover);
        }
    }

    function watchBlockTreeHover() {
        var dock;
        var list;

        if (document.__sveLiteTreeWatch) {
            return;
        }

        document.__sveLiteTreeWatch = true;

        dock = document.getElementById('__sve-right-dock');
        list = document.querySelector('[data-sve-listview-list]');

        if (dock) {
            scanTreeHoverRows(dock);
        }

        if (list) {
            scanTreeHoverRows(list);
        }

        new MutationObserver(function (records) {
            var i;
            var rec;
            var j;
            var node;

            for (i = 0; i < records.length; i++) {
                rec = records[i];

                for (j = 0; j < rec.addedNodes.length; j++) {
                    node = rec.addedNodes[j];

                    if (node.nodeType !== 1) {
                        continue;
                    }

                    if (node.id === '__sve-right-dock' || (node.getAttribute && node.getAttribute('data-sve-listview-list') !== null) || (node.querySelector && (node.id === '__sve-right-dock' || node.querySelector('[data-sve-lv-uid], [data-sve-listview-list], #__sve-right-dock')))) {
                        scanTreeHoverRows(node);
                    } else if (node.getAttribute && node.getAttribute('data-sve-lv-uid')) {
                        bindTreeRowHover(node);
                    }
                }
            }
        }).observe(document.documentElement, { childList: true, subtree: true });
    }

    function interceptListViewClicks() {
        if (window.__sveLiteListInterceptV3) {
            return;
        }

        window.__sveLiteListInterceptV3 = true;

        function onTreeHover(event) {
            scheduleLiteHover(uidFromTreeEvent(event), document, window);
        }

        document.addEventListener('pointerover', onTreeHover, true);
        document.addEventListener('mouseover', onTreeHover, true);

        window.addEventListener('sve-lite-hover', function (event) {
            var uid = event.detail && event.detail.uid;

            scheduleLiteHover(uid, document, window);
        });

        watchBlockTreeHover();

        document.addEventListener(
            'click',
            function (event) {
                var doc = document;
                var row;
                var uid;

                if (event.__sveLiteReplay) {
                    return;
                }

                if (!doc.querySelector('[data-sve-lite]')) {
                    return;
                }

                if (event.target && event.target.closest && event.target.closest('[data-sve-lv-twist]')) {
                    return;
                }

                uid = uidFromTreeEvent(event);
                row = uid ? doc.querySelector('[data-sve-lv-uid="' + uid + '"]') : null;

                if (!uid || !sectionUidFor(uid)) {
                    return;
                }

                revealUid(uid);

                if (showingSection(uid) || findSetByUid(uid, doc)) {
                    return;
                }

                event.preventDefault();
                event.stopImmediatePropagation();

                switchMountedSection(uid, doc, window, function () {
                    var again;

                    if (!row || !row.isConnected) {
                        row = doc.querySelector('[data-sve-lv-uid="' + uid + '"]');
                    }

                    if (row) {
                        again = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window,
                        });
                        again.__sveLiteReplay = true;
                        row.dispatchEvent(again);
                    }

                    waitForSoloThenReveal(doc, window, function () {
                        syncNeighbors(doc, window);
                    });
                });
            },
            true
        );
    }

    function boot() {
        register();
        wrapSolo();
        interceptPreviewClicks();
        interceptListViewClicks();
        watchFocusExpand();
        bindChunkClicks();
    }

    function bootUntilReady() {
        boot();

        if (window.__sveLiteBootScheduled) {
            return;
        }

        window.__sveLiteBootScheduled = true;

        if (window.__sveLiteRegistered) {
            return;
        }

        var tries = 0;
        var timer = window.setInterval(function () {
            tries += 1;
            boot();

            if (window.__sveLiteRegistered || tries >= 60) {
                window.clearInterval(timer);
            }
        }, 50);
    }

    if (window.Statamic && typeof Statamic.booting === 'function') {
        Statamic.booting(bootUntilReady);
    }

    if (window.Statamic && typeof Statamic.configuring === 'function') {
        Statamic.configuring(bootUntilReady);
    }

    document.addEventListener('DOMContentLoaded', bootUntilReady);
})();
