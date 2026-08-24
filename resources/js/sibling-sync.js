/**
 * Søskende-synk pr. felt i visual editorens panel.
 *
 * Fluebenet `sve_sync_siblings` på feltets indstillinger (samme slags som
 * Responsive) viser SYNC/UNSYNC ved feltets label i live preview. Klik på
 * Toggle: Synced slår synk til (kopierer til søskende-Items og låser
 * felterne). Unsync på samme knap slår synk fra på alle og låser op.
 *
 * Responsive-felter synces som hele objektet (laptop/tablet/mobil). Kilden
 * skifter stadig breakpoint som den plejer; de låste rækker får samme pose.
 *
 * Ingen wrap af Statamics felt. Ingen import af overlay, preview, bridge
 * eller cp.js — kun publish-containerens setFieldValue.
 */

const CONFIG_KEY = 'sve_sync_siblings';
const STATE_KEY = '_sve_sync';
const FIELD_ATTR = 'data-sve-sync-field';
const LOCKED_ATTR = 'data-sve-sync-locked';
const SOURCE_ATTR = 'data-sve-sync-source';
const STATE_ATTR = 'data-sve-sync-state';
const STYLE_ID = 'sve-sync-siblings-style';

const SKIP_TYPES = new Set([
    'tab',
    'section',
    'spacer',
    'revealer',
    'hidden',
    'html',
    'auto_uuid',
]);

const containers = [];
let propagating = false;

function t(key) {
    return (window.Statamic?.$config?.get?.('sveStrings') || {})[key] ?? key;
}

function unwrapRef(v) {
    return v && v.__v_isRef ? v.value : v;
}

function dataGet(obj, path) {
    if (!path) return obj;

    return String(path).split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
}

function clone(v) {
    return v == null ? v : JSON.parse(JSON.stringify(v));
}

function eq(a, b) {
    return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

function isSet(row) {
    return row && typeof row === 'object' && !Array.isArray(row) && typeof row.type === 'string';
}

function rowId(row) {
    return row?._visual_id || row?._id || row?.id || null;
}

function pick(vm, key) {
    if (!vm) return undefined;

    if (vm[key] != null && typeof vm[key] !== 'function') return unwrapRef(vm[key]);
    if (vm.$props?.[key] != null) return unwrapRef(vm.$props[key]);
    if (vm.$attrs?.[key] != null) return unwrapRef(vm.$attrs[key]);

    const raw = vm.$?.props?.[key] ?? vm.$?.vnode?.props?.[key];

    if (raw != null) return unwrapRef(raw);

    const kebab = key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

    return unwrapRef(vm.$attrs?.[kebab]);
}

function configOf(vm) {
    const config = pick(vm, 'config');

    return config && typeof config === 'object' ? config : null;
}

function handleOf(vm) {
    return pick(vm, 'handle') || configOf(vm)?.handle || null;
}

/**
 * Kun feltet med fluebenet. Ikke Icon, bare fordi Size længere nede i
 * samme sæt har synk — og ikke fordi handle mangler på en forælder.
 */
function isSyncOwner(vm) {
    if (!vm) return false;

    const own = configOf(vm);

    if (own?.[CONFIG_KEY] && !SKIP_TYPES.has(own.type)) return true;

    const handle = handleOf(vm);

    if (!handle) return false;

    for (let node = vm.$parent; node; node = node.$parent) {
        const config = configOf(node);

        if (!config?.[CONFIG_KEY] || SKIP_TYPES.has(config.type)) continue;

        return handleOf(node) === handle;
    }

    return false;
}

function inEditorPanel(el) {
    if (!el?.closest) return false;

    if (
        el.closest('.live-preview-editor')
        || el.closest('.live-preview-fields')
        || el.closest('[data-sve-focus-set]')
        || el.closest('[data-sve-panel-column]')
    ) {
        return true;
    }

    const doc = el.ownerDocument || document;

    return doc.documentElement?.hasAttribute('data-sve-focus')
        || new URLSearchParams(doc.defaultView?.location?.search || '').has('sve-panel');
}

function parseSync(raw) {
    if (!raw) return {};

    if (typeof raw === 'string') {
        try {
            return JSON.parse(raw) || {};
        } catch {
            return {};
        }
    }

    return typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
}

function syncMap(row) {
    return parseSync(row?.[STATE_KEY]);
}

function roleOf(row, key) {
    const entry = syncMap(row)[key];

    if (entry?.role === 'source' || entry?.role === 'follow') return entry.role;

    return 'off';
}

function findSource(siblings, key) {
    return siblings.find((s) => syncMap(s.row)[key]?.role === 'source') || null;
}

function writeSync(container, rowPath, map) {
    write(container, `${rowPath}.${STATE_KEY}`, Object.keys(map).length ? map : {});
}

function write(container, path, value) {
    const fn = container._sveSyncWrite || container.setFieldValue.bind(container);

    fn(path, value);
}

/** Stien til feltet inde i én Item (fx list.1.blocks.0.size). */
function fieldInRow(rowPath, row, chain) {
    const handle = chain[chain.length - 1];
    let path = rowPath;
    let current = row;

    for (const type of chain.slice(0, -1)) {
        const found = findSetByType(current, type, path);

        if (!found) return null;

        current = found.row;
        path = found.path;
    }

    if (!current || typeof current !== 'object') return null;

    return { setPath: path, setRow: current, path: `${path}.${handle}`, handle };
}

/**
 * Skriver hver Item for sig, og derefter ikon-sættet + selve feltet.
 * En dyb size-sti alene bliver ofte stående; hele listen reloadede for meget.
 */
function writeRows(container, parentPath, rows, type, chain, fieldValue) {
    rows.forEach((row, i) => {
        if (!isSet(row) || (type && row.type !== type)) return;

        const rowPath = `${parentPath}.${i}`;

        write(container, rowPath, clone(row));

        if (fieldValue === undefined || !chain) return;

        const target = fieldInRow(rowPath, row, chain);

        if (!target) return;

        const nextSet = clone(target.setRow);

        nextSet[target.handle] = clone(fieldValue);
        write(container, target.setPath, nextSet);
        write(container, target.path, clone(fieldValue));
    });
}

function rootElement(vm) {
    const el = vm.$el;

    if (el?.nodeType === Node.ELEMENT_NODE) return el;

    return el?.parentElement ?? null;
}

function ownerVm(vm) {
    for (let node = vm; node; node = node.$parent) {
        const config = configOf(node);

        if (config?.[CONFIG_KEY] && !SKIP_TYPES.has(config.type)) return node;
    }

    return vm;
}

function fieldPathOf(vm) {
    vm = ownerVm(vm);

    const handle = pick(vm, 'handle') || configOf(vm)?.handle;

    for (let parent = vm; parent; parent = parent.$parent) {
        const name = pick(parent, 'name');

        if (typeof name === 'string' && name.includes('.')) {
            if (!handle || name === handle || name.endsWith(`.${handle}`)) return name;
        }

        const prefix = pick(parent, 'fieldPathPrefix');
        const parentHandle = pick(parent, 'handle') || handle;

        if (typeof prefix === 'string' && prefix && parentHandle) {
            if (prefix === parentHandle || prefix.endsWith(`.${parentHandle}`)) return prefix;

            return `${prefix}.${parentHandle}`;
        }
    }

    return typeof handle === 'string' && handle ? handle : null;
}

function typeChain(values, setPath, fieldPath) {
    const rel = fieldPath.slice(setPath.length + 1);

    if (!rel) return [];

    const parts = rel.split('.');
    const chain = [];
    let cursor = setPath;

    for (let i = 0; i < parts.length - 1; i++) {
        cursor = `${cursor}.${parts[i]}`;
        const val = dataGet(values, cursor);

        if (isSet(val)) chain.push(val.type);
    }

    chain.push(parts[parts.length - 1]);

    return chain;
}

function findSiblingScope(values, fieldPath) {
    if (!values || typeof fieldPath !== 'string' || !fieldPath) return null;

    const parts = fieldPath.split('.');

    if (parts.length < 2 || /^\d+$/.test(parts[parts.length - 1])) return null;

    const setAncestors = [];

    for (let i = 0; i < parts.length - 1; i++) {
        if (!/^\d+$/.test(parts[i])) continue;

        const setPath = parts.slice(0, i + 1).join('.');
        const parentPath = parts.slice(0, i).join('.');
        const parent = dataGet(values, parentPath);
        const row = dataGet(values, setPath);

        if (!Array.isArray(parent) || !isSet(row)) continue;

        setAncestors.push({
            setPath,
            setIndex: Number(parts[i]),
            parentPath,
            parent,
            type: row.type,
        });
    }

    // Nærmeste sæt med rigtige søskende. Icon inde i Item har ingen
    // ikon-søskende (kun Title ved siden af) — vi går derfor op til Item,
    // som ligger flere gange under List. Det er Item der er søskende.
    for (let a = setAncestors.length - 1; a >= 0; a--) {
        const current = setAncestors[a];
        const sameType = current.parent
            .map((row, i) => ({ row, i }))
            .filter(({ row }) => isSet(row) && row.type === current.type);

        if (sameType.length < 2) continue;

        const chain = typeChain(values, current.setPath, fieldPath);

        if (!chain.length) continue;

        return {
            parentPath: current.parentPath,
            currentIndex: current.setIndex,
            chain,
            key: chain.join('.'),
            siblings: sameType.map(({ row, i }) => ({
                index: i,
                path: `${current.parentPath}.${i}`,
                id: rowId(row),
                row,
            })),
        };
    }

    return null;
}

function findSetInObject(obj, type) {
    if (isSet(obj) && obj.type === type) return obj;
    if (!obj || typeof obj !== 'object') return null;

    for (const key of Object.keys(obj)) {
        if (key.startsWith('_')) continue;

        const val = obj[key];

        if (Array.isArray(val)) {
            for (const item of val) {
                const found = findSetInObject(item, type);

                if (found) return found;
            }
        } else if (val && typeof val === 'object') {
            const found = findSetInObject(val, type);

            if (found) return found;
        }
    }

    return null;
}

function findSetByType(obj, type, path) {
    if (isSet(obj) && obj.type === type) return { row: obj, path };
    if (!obj || typeof obj !== 'object') return null;

    for (const key of Object.keys(obj)) {
        if (key.startsWith('_')) continue;

        const val = obj[key];
        const next = path ? `${path}.${key}` : key;

        if (Array.isArray(val)) {
            for (let i = 0; i < val.length; i++) {
                const found = findSetByType(val[i], type, `${next}.${i}`);

                if (found) return found;
            }
        } else if (val && typeof val === 'object') {
            const found = findSetByType(val, type, next);

            if (found) return found;
        }
    }

    return null;
}

function resolveFieldInSibling(values, siblingPath, chain) {
    const handle = chain[chain.length - 1];
    const types = chain.slice(0, -1);
    let path = siblingPath;
    let row = dataGet(values, siblingPath);

    for (const type of types) {
        const found = findSetByType(row, type, path);

        if (!found) return null;

        row = found.row;
        path = found.path;
    }

    return { path: path ? `${path}.${handle}` : handle };
}

function getValueByChain(row, chain) {
    const handle = chain[chain.length - 1];
    let current = row;

    for (const type of chain.slice(0, -1)) {
        current = findSetInObject(current, type);

        if (!current) return undefined;
    }

    return current?.[handle];
}

function applyChainValue(row, chain, value) {
    const handle = chain[chain.length - 1];
    let current = row;

    for (const type of chain.slice(0, -1)) {
        current = findSetInObject(current, type);

        if (!current) return;
    }

    if (current && typeof current === 'object') current[handle] = value;
}

/**
 * Select skriver 'lg' på ....size.laptop.size. Læg det i posen, så følgere
 * ikke får den gamle md fra values i samme tick.
 */
function mergeWritten(path, value, fromValues, handle) {
    if (value !== undefined && typeof value === 'object' && !Array.isArray(value)) {
        return clone(value);
    }

    if (!fromValues || typeof fromValues !== 'object' || Array.isArray(fromValues)) {
        return value;
    }

    const bag = clone(fromValues);
    const needle = `.${handle}.`;
    const at = String(path).lastIndexOf(needle);

    if (at === -1) return value === undefined ? bag : value;

    const suffix = String(path).slice(at + needle.length);

    if (!suffix) return value === undefined ? bag : value;

    const parts = suffix.split('.');
    let cursor = bag;

    for (let i = 0; i < parts.length - 1; i++) {
        if (!cursor[parts[i]] || typeof cursor[parts[i]] !== 'object') cursor[parts[i]] = {};
        cursor = cursor[parts[i]];
    }

    cursor[parts[parts.length - 1]] = value;

    return bag;
}

function becomeSource(container, values, scope, current) {
    const key = scope.key;
    const sourceType = dataGet(values, current.path)?.type;
    const sourceValue = getValueByChain(dataGet(values, current.path), scope.chain);
    const next = clone(dataGet(values, scope.parentPath) || []);

    next.forEach((row, i) => {
        if (!isSet(row) || row.type !== sourceType) return;

        const map = { ...syncMap(row) };

        if (i === current.index) {
            map[key] = { role: 'source' };
        } else {
            map[key] = { role: 'follow', source: current.id };
            applyChainValue(row, scope.chain, clone(sourceValue));
        }

        row[STATE_KEY] = Object.keys(map).length ? map : {};
    });

    propagating = true;

    try {
        writeRows(container, scope.parentPath, next, sourceType, scope.chain, sourceValue);
    } finally {
        propagating = false;
    }
}

function unlockAll(container, values, scope) {
    const next = clone(dataGet(values, scope.parentPath) || []);
    const sourceType = dataGet(values, scope.siblings[0]?.path)?.type;

    next.forEach((row) => {
        const map = { ...syncMap(row) };

        delete map[scope.key];
        row[STATE_KEY] = Object.keys(map).length ? map : {};
    });

    propagating = true;

    try {
        writeRows(container, scope.parentPath, next, sourceType);
    } finally {
        propagating = false;
    }
}

function detachOne(container, values, sibling, key) {
    const map = { ...syncMap(dataGet(values, sibling.path)) };

    delete map[key];
    writeSync(container, sibling.path, map);
}

function attachOne(container, values, scope, sibling, source) {
    const srcResolved = resolveFieldInSibling(values, source.path, scope.chain);
    const sourceValue = srcResolved ? dataGet(values, srcResolved.path) : undefined;
    const map = { ...syncMap(dataGet(values, sibling.path)) };

    map[scope.key] = { role: 'follow', source: source.id };

    propagating = true;

    try {
        writeSync(container, sibling.path, map);

        const target = resolveFieldInSibling(values, sibling.path, scope.chain);

        if (target) write(container, target.path, clone(sourceValue));
    } finally {
        propagating = false;
    }
}

function onToggle(container, fieldPath) {
    const values = unwrapRef(container.values);
    const scope = findSiblingScope(values, fieldPath);

    if (!scope) return;

    const current = scope.siblings.find((s) => s.index === scope.currentIndex);

    if (!current) return;

    const role = roleOf(dataGet(values, current.path), scope.key);

    if (role === 'source' || role === 'follow') {
        unlockAll(container, values, scope);

        return;
    }

    becomeSource(container, values, scope, current);
}

function propagate(container, path, value) {
    const values = unwrapRef(container.values);

    if (!values || typeof path !== 'string' || /^\d+$/.test(path.split('.').pop())) return;

    const scope = findSiblingScope(values, path);

    if (!scope) return;

    const current = scope.siblings.find((s) => s.index === scope.currentIndex);

    if (!current || roleOf(dataGet(values, current.path), scope.key) !== 'source') return;

    // Responsive size kommer som hele posen. En select skriver 'lg' på den
    // indre sti — læg det i posen, så Large ikke tabes i samme tick.
    const fromValues = getValueByChain(dataGet(values, current.path), scope.chain);
    const sourceValue = mergeWritten(path, value, fromValues, scope.chain[scope.chain.length - 1]);
    const sourceType = dataGet(values, current.path)?.type;
    const next = clone(dataGet(values, scope.parentPath) || []);
    let changed = false;

    next.forEach((row, i) => {
        if (!isSet(row) || row.type !== sourceType) return;

        if (i === current.index) {
            if (sourceValue !== undefined && !eq(getValueByChain(row, scope.chain), sourceValue)) {
                applyChainValue(row, scope.chain, clone(sourceValue));
            }

            return;
        }

        if (roleOf(row, scope.key) !== 'follow') return;
        if (eq(getValueByChain(row, scope.chain), sourceValue)) return;

        applyChainValue(row, scope.chain, clone(sourceValue ?? value));
        changed = true;
    });

    if (!changed) return;

    propagating = true;

    try {
        writeRows(container, scope.parentPath, next, sourceType, scope.chain, sourceValue);
    } finally {
        propagating = false;
    }
}

function inheritOnNewRows(container, parentPath, before, after) {
    if (!Array.isArray(before) || !Array.isArray(after) || after.length <= before.length) return;

    propagating = true;

    try {
        after.forEach((row, i) => {
            if (i < before.length || !isSet(row)) return;

            const peers = after.filter((r) => isSet(r) && r.type === row.type);
            const keys = new Set();

            peers.forEach((peer) => {
                Object.entries(syncMap(peer)).forEach(([key, entry]) => {
                    if (entry?.role === 'source' || entry?.role === 'follow') keys.add(key);
                });
            });

            if (!keys.size) return;

            const next = clone(row);
            const map = { ...syncMap(next) };
            let changed = false;

            keys.forEach((key) => {
                const src = peers.find((r) => syncMap(r)[key]?.role === 'source');

                if (!src) return;

                const chain = key.split('.');

                map[key] = { role: 'follow', source: rowId(src) };
                applyChainValue(next, chain, clone(getValueByChain(src, chain)));
                changed = true;
            });

            if (!changed) return;

            next[STATE_KEY] = map;
            write(container, `${parentPath}.${i}`, next);
        });
    } finally {
        propagating = false;
    }
}

function hookContainer(container) {
    if (!container || typeof container.setFieldValue !== 'function') return;

    if (!containers.includes(container)) containers.push(container);

    if (container._sveSyncHooked) return;

    const original = container.setFieldValue.bind(container);

    container._sveSyncWrite = original;
    container._sveSyncHooked = true;
    container.setFieldValue = function (path, value) {
        const before = clone(dataGet(unwrapRef(container.values), path));
        const result = original(path, value);

        if (!propagating && typeof path === 'string') {
            if (Array.isArray(value) && Array.isArray(before) && value.length > before.length) {
                inheritOnNewRows(container, path, before, value);
            } else {
                propagate(container, path, value);
            }
        }

        return result;
    };

    watchValues(container);
}

/**
 * Farve, radius m.m. skriver ofte udenom setFieldValue. Når en kilde-værdi
 * skifter i values, kopieres den til følgerne — samme regel for alle felter.
 */
function collectSourceFields(values) {
    const out = [];

    function walk(obj, path) {
        if (!obj || typeof obj !== 'object') return;

        if (Array.isArray(obj)) {
            obj.forEach((v, i) => walk(v, path ? `${path}.${i}` : String(i)));

            return;
        }

        if (isSet(obj)) {
            Object.entries(syncMap(obj)).forEach(([key, entry]) => {
                if (entry?.role !== 'source') return;

                const target = fieldInRow(path, obj, key.split('.'));

                if (!target) return;

                out.push({ path: target.path, value: getValueByChain(obj, key.split('.')) });
            });
        }

        Object.keys(obj).forEach((key) => {
            if (key.startsWith('_')) return;

            walk(obj[key], path ? `${path}.${key}` : key);
        });
    }

    walk(values, '');

    return out;
}

function flushSources(container) {
    if (propagating) return;

    collectSourceFields(unwrapRef(container.values)).forEach(({ path, value }) => {
        propagate(container, path, value);
    });
}

function watchValues(container) {
    const watch = window.Vue?.watch;

    if (!watch || container._sveSyncWatchValues) return;

    container._sveSyncWatchValues = true;
    watch(
        () => unwrapRef(container.values),
        () => flushSources(container),
        { deep: true },
    );
}

function containerOf(vm) {
    for (let parent = vm; parent; parent = parent.$parent) {
        if (typeof parent.setFieldValue === 'function' && parent.values) {
            hookContainer(parent);

            return parent;
        }
    }

    return containers[0] || null;
}

function listOf(el) {
    return el?.closest?.('[data-sve-panel-body], .publish-fields') || null;
}

function isWideFieldtype(el) {
    return /replicator-fieldtype|grid-fieldtype|bard-fieldtype|tab-fieldtype|section-fieldtype/.test(el?.className || '');
}

function isWideRow(el) {
    return !el
        || isWideFieldtype(el)
        || el.classList?.contains('publish-fields')
        || el.classList?.contains('publish-form')
        || el.matches?.('form, [data-sve-panel-body], [data-sve-focus-set]');
}

/** Ydre Statamic-wrapper hedder også responsive-fieldtype — brug den med header. */
function responsiveRow(el) {
    const start = el?.closest?.('.responsive-fieldtype') || (el?.matches?.('.responsive-fieldtype') ? el : null);

    if (!start) return null;

    if (start.querySelector(':scope > .responsive-fieldtype-header')) return start;

    return start.querySelector('.responsive-fieldtype:has(> .responsive-fieldtype-header)') || start;
}

function fieldRow(el) {
    if (!el?.closest) return null;

    const marked = el.closest('.sve-sync-siblings');

    if (marked && inEditorPanel(marked) && !isWideRow(marked)) {
        const inner = responsiveRow(marked);

        return inner && inEditorPanel(inner) ? inner : marked;
    }

    const responsive = responsiveRow(el);

    if (responsive && inEditorPanel(responsive)) return responsive;

    let ft = el.closest('[class*="-fieldtype"]');

    while (ft && isWideRow(ft)) {
        ft = ft.parentElement?.closest('[class*="-fieldtype"]') || null;
    }

    if (!ft || !inEditorPanel(ft)) return null;

    return ft;
}

function ownLabel(row) {
    return row.querySelector(':scope > .responsive-fieldtype-header > .responsive-fieldtype-label')
        || row.querySelector(':scope > [data-ui-field-header] [data-ui-label] > div')
        || row.querySelector(':scope > [data-ui-field-header] > label:not(.sr-only):not(:has(> div))')
        || row.querySelector(':scope > [data-ui-field-header] > label:not(.sr-only)')
        || row.querySelector(':scope > [data-ui-label]')
        || row.querySelector(':scope > label:not(.sr-only)');
}

function vueOf(el) {
    let inst = el?.__vueParentComponent;

    while (inst) {
        const proxy = inst.proxy;

        if (proxy && (configOf(proxy) || handleOf(proxy))) return proxy;

        inst = inst.parent;
    }

    return null;
}

function paintRow(row, vm) {
    const container = vm ? containerOf(vm) : containers[0] || null;
    const values = container ? unwrapRef(container.values) : null;
    const path = vm ? fieldPathOf(vm) : null;
    const scope = values && path ? findSiblingScope(values, path) : null;
    let state = 'off';

    if (scope) {
        const current = scope.siblings.find((s) => s.index === scope.currentIndex);
        const role = current ? roleOf(current.row, scope.key) : 'off';
        const source = findSource(scope.siblings, scope.key);

        state = role === 'source' || role === 'follow'
            ? role
            : source
                ? 'detached'
                : 'off';
    }

    const titles = {
        off: t('sync_siblings_off'),
        source: t('sync_siblings_source'),
        follow: t('sync_siblings_follow'),
        detached: t('sync_siblings_detached'),
    };

    if (isWideRow(row)) return;

    row.setAttribute(FIELD_ATTR, '');
    row.setAttribute(STATE_ATTR, state);
    row.toggleAttribute(LOCKED_ATTR, state === 'follow');
    row.toggleAttribute(SOURCE_ATTR, state === 'source');
    if (path) row.setAttribute('data-sve-sync-path', path);
    row.title = titles[state] || titles.off;
    applyLock(row, state === 'follow');
}

function clickedBeforeBadge(e, row) {
    if (e.target !== row) return false;

    const before = row.ownerDocument.defaultView.getComputedStyle(row, '::before');

    if (!before || before.content === 'none' || !/Sync/i.test(before.content || '')) return false;

    const box = row.getBoundingClientRect();

    return e.clientY <= box.top + 28 && e.clientX <= box.left + 92;
}

function clickedBadge(e, row) {
    if (clickedBeforeBadge(e, row)) return true;

    const label = ownLabel(row);

    if (!label || !label.contains(e.target)) return false;

    const on = row.getAttribute(STATE_ATTR) === 'source' || row.getAttribute(STATE_ATTR) === 'follow';

    if (on) return true;

    const inner = label.matches('[data-ui-label]')
        ? (label.querySelector(':scope > div') || label)
        : label;
    const span = inner.querySelector('span');
    const left = span ? span.getBoundingClientRect().right : inner.getBoundingClientRect().left;

    return e.clientX >= left + 2;
}

function isLockExempt(el) {
    return el.matches('.responsive-fieldtype-header, [data-ui-field-header], label.sr-only');
}

function applyLock(row, locked) {
    [...row.children].forEach((child) => {
        if (isLockExempt(child)) {
            child.removeAttribute('inert');

            return;
        }

        child.toggleAttribute('inert', locked);
    });
}

function showState(row, state) {
    row.setAttribute(FIELD_ATTR, '');
    row.setAttribute(STATE_ATTR, state);
    row.toggleAttribute(LOCKED_ATTR, state === 'follow');
    row.toggleAttribute(SOURCE_ATTR, state === 'source');
    applyLock(row, state === 'follow');
}

function onLockedInteract(e) {
    const row = e.target.closest?.(`[${LOCKED_ATTR}]`);

    if (!row || !inEditorPanel(row)) return;
    if (row.getAttribute(STATE_ATTR) !== 'follow') return;
    if (clickedBadge(e, row)) return;

    e.preventDefault();
    e.stopPropagation();
}

function toggleRow(row) {
    const vm = vueOf(row) || vueOf(row.querySelector('[class*="-fieldtype"]'));
    const container = vm ? containerOf(vm) : containers[0] || null;
    const path = (vm && fieldPathOf(vm)) || row.getAttribute('data-sve-sync-path');

    if (!container || !path) return;

    const on = row.getAttribute(STATE_ATTR) === 'source' || row.getAttribute(STATE_ATTR) === 'follow';

    showState(row, on ? 'off' : 'source');
    onToggle(container, path);

    const doc = row.ownerDocument || document;
    const run = () => scan(doc);

    doc.defaultView?.setTimeout(run, 50);
    doc.defaultView?.setTimeout(run, 250);
}

function stamp(vm) {
    if (!isSyncOwner(vm)) return;

    const root = rootElement(vm);

    if (!root || !inEditorPanel(root)) return;

    const row = fieldRow(root);

    if (!row) return;

    paintRow(row, vm);
}

/**
 * Select/color skriver ofte udenom container.setFieldValue (in-place på
 * responsive-posen). Når kildens værdi skifter, kopier til følgerne.
 */
function syncFromVm(vm) {
    if (!isSyncOwner(vm) || propagating) return;

    const owner = ownerVm(vm) || vm;
    const path = fieldPathOf(owner);
    const value = pick(owner, 'value');

    if (!path) return;

    if (owner._sveSyncLast !== undefined && eq(owner._sveSyncLast, value)) return;

    const prev = owner._sveSyncLast;

    owner._sveSyncLast = clone(value);

    if (prev === undefined) return;

    const container = containerOf(owner);
    const fromValues = container && path ? dataGet(unwrapRef(container.values), path) : undefined;
    const next = value !== undefined ? value : fromValues;

    if (container) propagate(container, path, next);
}

function scan(doc) {
    const roots = [
        doc.querySelector('.live-preview-editor'),
        doc.querySelector('.live-preview-fields'),
    ].filter(Boolean);

    if (!roots.length && new URLSearchParams(doc.defaultView?.location?.search || '').has('sve-panel')) {
        const form = doc.querySelector('.publish-fields, form.publish-form');

        if (form) roots.push(form);
    }

    const seen = new Set();

    roots.forEach((root) => {
        root.querySelectorAll('.sve-sync-siblings, .responsive-fieldtype, [class*="-fieldtype"]').forEach((el) => {
            if (isWideRow(el)) return;

            const vm = vueOf(el) || vueOf(el.querySelector('[class*="-fieldtype"]'));

            if (!isSyncOwner(vm)) return;

            const row = fieldRow(el);

            if (!row || isWideRow(row) || seen.has(row)) return;

            seen.add(row);
            paintRow(row, vm);
        });
    });
}

function onEditorClick(e) {
    if (!e.isTrusted) return;

    const row = e.target.closest?.(`[${FIELD_ATTR}]`);

    if (!row || !clickedBadge(e, row)) return;

    e.preventDefault();
    e.stopPropagation();
    toggleRow(row);
}

function ensureStyles(doc) {
    doc.getElementById(STYLE_ID)?.remove();

    const style = doc.createElement('style');

    style.id = STYLE_ID;
    style.textContent = `
        [data-sve-sync-field] > .responsive-fieldtype-header,
        [data-sve-sync-field] > .responsive-fieldtype-header > .responsive-fieldtype-label,
        [data-sve-sync-field] > [data-ui-field-header] [data-ui-label] > div,
        [data-sve-sync-field] > [data-ui-field-header] > label:not(.sr-only):not(:has(> div)) {
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        [data-sve-sync-field] > .responsive-fieldtype-header > .responsive-fieldtype-label::after,
        [data-sve-sync-field] > [data-ui-field-header] [data-ui-label] > div::after,
        [data-sve-sync-field] > [data-ui-field-header] > label:not(.sr-only):not(:has(> div))::after,
        [data-sve-sync-field]:has(> label.sr-only)::before {
            content: 'Synced';
            flex: none;
            cursor: pointer;
            font-size: 10px;
            font-weight: 600;
            line-height: 1;
            padding: 2px 7px;
            border-radius: 4px;
            color: color-mix(in oklab, currentColor 70%, transparent);
            background: color-mix(in oklab, currentColor 14%, transparent);
            box-shadow: none;
        }
        [data-sve-sync-field]:has(> label.sr-only)::before {
            align-self: flex-start;
            margin-bottom: 6px;
        }
        [data-sve-sync-field][data-sve-sync-state="source"] > .responsive-fieldtype-header > .responsive-fieldtype-label::after,
        [data-sve-sync-field][data-sve-sync-state="follow"] > .responsive-fieldtype-header > .responsive-fieldtype-label::after,
        [data-sve-sync-field][data-sve-sync-state="source"] > [data-ui-field-header] [data-ui-label] > div::after,
        [data-sve-sync-field][data-sve-sync-state="follow"] > [data-ui-field-header] [data-ui-label] > div::after,
        [data-sve-sync-field][data-sve-sync-state="source"] > [data-ui-field-header] > label:not(.sr-only):not(:has(> div))::after,
        [data-sve-sync-field][data-sve-sync-state="follow"] > [data-ui-field-header] > label:not(.sr-only):not(:has(> div))::after,
        [data-sve-sync-field][data-sve-sync-state="source"]:has(> label.sr-only)::before,
        [data-sve-sync-field][data-sve-sync-state="follow"]:has(> label.sr-only)::before {
            content: 'Unsync';
            color: #fff;
            background: var(--theme-color-primary, #4f46e5);
            box-shadow: none;
        }
        [data-sve-sync-field][data-sve-sync-locked] > *:not(.responsive-fieldtype-header):not([data-ui-field-header]):not(label.sr-only) {
            pointer-events: none !important;
            opacity: 0.45;
        }
    `;
    doc.head.appendChild(style);
}

function registerContainers() {
    const events = window.Statamic?.$events;

    if (!events?.$on) return;

    events.$on('publish-container-created', (payload) => {
        if (payload?.setFieldValue && payload?.values) {
            hookContainer(payload);
        }
    });

    events.$on('publish-container-destroyed', (payload) => {
        const index = containers.findIndex((c) => c.name === payload?.name);

        if (index !== -1) containers.splice(index, 1);
    });
}

Statamic.configuring(() => {
    Statamic.$app.mixin({
        mounted() { stamp(this); },
        updated() {
            stamp(this);
            syncFromVm(this);
        },
    });
});

Statamic.booting(() => {
    registerContainers();
    ensureStyles(document);

    const doc = document;
    const run = () => scan(doc);

    doc.addEventListener('click', onEditorClick, true);
    ['pointerdown', 'mousedown', 'click', 'input', 'change'].forEach((type) => {
        doc.addEventListener(type, onLockedInteract, true);
    });
    doc.defaultView?.setTimeout(run, 300);
    doc.addEventListener('sve-chrome-render', run);

    const editor = () => doc.querySelector('.live-preview-editor');
    const watch = () => {
        const pane = editor();

        if (!pane || pane.__sveSyncWatch) return;

        pane.__sveSyncWatch = true;
        new MutationObserver(() => {
            doc.defaultView?.clearTimeout(doc.__sveSyncScan);
            doc.__sveSyncScan = doc.defaultView?.setTimeout(run, 160);
        }).observe(pane, { childList: true, subtree: true });
    };

    watch();
    new MutationObserver(watch).observe(doc.documentElement, { childList: true, subtree: true });
});
