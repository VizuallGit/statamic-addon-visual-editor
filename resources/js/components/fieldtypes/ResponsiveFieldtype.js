/**
 * Responsive fieldtype — desktop-first cascade (CSS-like).
 *
 * Stored shape: one drawer per size, `{ laptop: {handle: val}, tablet?: … }`.
 * The widest is the baseline. The narrower ones only keep real overrides;
 * anything that still matches the parent is stripped before emit (same rule as
 * PHP process()). Which sizes exist is this site's own list — see
 * `breakpoints.js`; the handles above are the three it ships with.
 *
 * Switching Live Preview devices flips which drawer Fields bind to. Fields are
 * remounted with :key=breakpoint so a tablet edit can never write into the base.
 * Dropping the key to stop icon button groups flashing froze the panel on the
 * drawer it mounted with — the value was saved correctly, only the panel lied.
 */
import { bpBase, bpForDevice, bpHandles } from '../../breakpoints.js';
import { chromeGet } from '../../chrome-prefs.js';

(function () {
    'use strict';

    Statamic.booting(() => {
        const { h, ref, computed, watch, onMounted, onUnmounted, nextTick } = window.Vue;

        const Fields = window.__STATAMIC__?.ui?.PublishFields;
        const FieldsProvider = window.__STATAMIC__?.ui?.PublishFieldsProvider;

        if (!Fields || !FieldsProvider) {
            console.warn('[responsive] PublishFields UI missing — fieldtype not registered');
            return;
        }

        /** Widest first. The first one is the baseline the rest except from. */
        const bpOrder = () => bpHandles(window);
        const baseBp = () => bpBase(window);

        function deviceToBp(device) {
            return bpForDevice(device, window)?.handle || baseBp();
        }

        function bpFromStorage() {
            try {
                return deviceToBp(chromeGet(window, 'sve-lp-device'));
            } catch {
                return baseBp();
            }
        }

        function eq(a, b) {
            return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
        }

        function clone(v) {
            return v == null ? v : JSON.parse(JSON.stringify(v));
        }

        function isBlank(v) {
            return v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0);
        }

        function str(tpl, vars) {
            return String(tpl || '').replace(/:(\w+)/g, (_, k) => (vars[k] != null ? vars[k] : ''));
        }

        Statamic.$components.register('responsive-fieldtype', {
            inheritAttrs: false,
            props: {
                value: { default: null },
                meta: { type: Object, default: () => ({}) },
                config: { type: Object, default: () => ({}) },
                handle: { type: String, default: '' },
                fieldPathPrefix: { type: String, default: '' },
                metaPathPrefix: { type: String, default: '' },
                readOnly: { type: Boolean, default: false },
                namePrefix: { type: String, default: null },
                id: { type: String, default: null },
            },
            emits: ['update:value', 'update:meta', 'focus', 'blur'],
            setup(props, { emit }) {
                const breakpoints = computed(() => props.meta?._breakpoints || []);
                const strings = computed(() => props.meta?._strings || {});
                const activeBp = ref(bpFromStorage());

                const rootPath = computed(() =>
                    props.fieldPathPrefix
                        ? `${props.fieldPathPrefix}.${props.handle}`
                        : props.handle
                );

                const metaRoot = computed(() =>
                    props.metaPathPrefix
                        ? `${props.metaPathPrefix}.${props.handle}`
                        : props.handle
                );

                const fields = computed(() => props.config?.fields || []);
                const fieldHandles = computed(() =>
                    fields.value.map((f) => f.handle).filter(Boolean)
                );

                /**
                 * A set added in the browser arrives with the fieldset's own
                 * default — the sub-fields' value, not a drawer per breakpoint.
                 * PHP's normalize() moves that into the base drawer on the way in,
                 * but nothing runs it for a set created client-side. Without the
                 * same step here every drawer reads empty: the field shows blank
                 * and the first breakpoint switch saves that blank over the default.
                 */
                function isFlat(value) {
                    return (
                        !!value &&
                        typeof value === 'object' &&
                        !bpOrder().some((bp) => bp in value)
                    );
                }

                /** Same rule as normalize(): one sub-field takes the value whole. */
                function toDrawers(value) {
                    const handles = fieldHandles.value;

                    return {
                        [baseBp()]:
                            handles.length === 1
                                ? { [handles[0]]: clone(value) }
                                : clone(value),
                    };
                }

                function needsReshaping() {
                    const value = props.value;

                    if (!isFlat(value) || !fieldHandles.value.length) {
                        return false;
                    }

                    return Array.isArray(value)
                        ? value.length > 0
                        : Object.keys(value).length > 0;
                }

                /**
                 * The same gap on the meta side. A grid keys its row meta off the
                 * row id, and a select reads `props.meta.options` unguarded — both
                 * find `null` under a drawer that preload() never built, so the
                 * field renders empty and its combobox throws on open. Empty
                 * objects are enough: every fieldtype falls back to its config.
                 */
                function normalizeMissingMeta() {
                    const meta = props.meta;

                    if (!fieldHandles.value.length) {
                        return false;
                    }

                    const next = { ...(meta || {}) };
                    let dirty = false;

                    bpOrder().forEach((bp) => {
                        if (!next[bp] || typeof next[bp] !== 'object') {
                            next[bp] = {};
                            fieldHandles.value.forEach((h) => {
                                next[bp][h] = {};
                            });
                            dirty = true;
                            return;
                        }

                        // Row-based fieldtypes (grid, replicator, bard) key their
                        // row meta off the row id under `existing`. A set created
                        // in the browser gets its rows from the set default, whose
                        // meta the server puts under `new` — so the row's own id is
                        // missing from `existing` and the render throws looking it
                        // up. `new` describes exactly such a row: use it.
                        fieldHandles.value.forEach((h) => {
                            const fm = next[bp][h];
                            // Effective, not own: the narrower drawers show the
                            // rows they inherit, and those need meta too.
                            const rows = effectiveFrom(bag.value, bp)[h];

                            if (!fm || typeof fm !== 'object' || !fm.new || !Array.isArray(rows)) {
                                return;
                            }

                            const existing = { ...(fm.existing || {}) };
                            let added = false;

                            rows.forEach((row) => {
                                const id = row?._id ?? row?.id;
                                if (id == null || existing[id]) return;
                                existing[id] = clone(fm.new);
                                added = true;
                            });

                            if (added) {
                                next[bp] = { ...next[bp], [h]: { ...fm, existing } };
                                dirty = true;
                            }
                        });
                    });

                    if (dirty) {
                        emit('update:meta', next);
                    }

                    return dirty;
                }

                const bag = computed(() => {
                    const value = props.value;
                    const raw = isFlat(value)
                        ? toDrawers(value)
                        : value && typeof value === 'object'
                          ? value
                          : {};
                    const out = {};
                    bpOrder().forEach((bp) => {
                        out[bp] = { ...(raw[bp] && typeof raw[bp] === 'object' ? raw[bp] : {}) };
                    });
                    return out;
                });

                function parentBp(bp) {
                    const order = bpOrder();
                    const i = order.indexOf(bp);
                    return i > 0 ? order[i - 1] : null;
                }

                /** Effective values at a breakpoint (cascade laptop → …). */
                function effectiveFrom(source, bp) {
                    const out = {};
                    for (const step of bpOrder()) {
                        Object.assign(out, source[step] || {});
                        if (step === bp) break;
                    }
                    return out;
                }

                /**
                 * Strip inheritance copies — keep laptop always; keep tablet/mobile
                 * only when they differ from the parent effective value.
                 */
                function cleanBag(source) {
                    const out = {};
                    let effective = {};

                    bpOrder().forEach((bp) => {
                        const chunk = {};
                        const src = source[bp] || {};

                        fieldHandles.value.forEach((h) => {
                            if (!(h in src) || isBlank(src[h])) {
                                return;
                            }

                            if (bp !== baseBp() && eq(src[h], effective[h])) {
                                return;
                            }

                            chunk[h] = clone(src[h]);
                        });

                        if (Object.keys(chunk).length) {
                            out[bp] = chunk;
                        }

                        effective = { ...effective, ...chunk };
                    });

                    return Object.keys(out).length ? out : null;
                }

                function emitBag(next) {
                    emit('update:value', cleanBag(next));
                }

                /** Keys on the active (non-base) BP that are real overrides. */
                const changedHandles = computed(() => {
                    const bp = activeBp.value;
                    if (bp === baseBp()) return [];

                    const cleaned = cleanBag(bag.value) || {};
                    const mine = cleaned[bp] || {};

                    return fieldHandles.value.filter((h) => h in mine && !isBlank(mine[h]));
                });

                const hasOverrides = computed(() => changedHandles.value.length > 0);

                const changedLabel = computed(() => {
                    const bp = breakpoints.value.find((b) => b.handle === activeBp.value);
                    const device = bp?.label || activeBp.value;
                    const n = changedHandles.value.length;

                    if (!n) return '';
                    if (n === 1) return str(strings.value.changed, { device });

                    return str(strings.value.changed_count, { count: n, device });
                });

                const resetTitle = computed(() => {
                    const parent = parentBp(activeBp.value);
                    const bp = breakpoints.value.find((b) => b.handle === parent);

                    return str(strings.value.inherit_from, {
                        device: bp?.label || parent || '',
                    });
                });

                /**
                 * Cascade display fills down the chain (laptop → tablet → mobile).
                 * A child that still matched its parent’s old effective value is
                 * inheriting — update it when the parent effective changes.
                 * Never write upward; never overwrite a real child override.
                 */
                let prevSerialized = JSON.stringify(bag.value);
                let applyingCascade = false;

                function resetActive() {
                    const bp = activeBp.value;
                    if (bp === baseBp()) return;

                    // Drop overrides for this breakpoint and show the parent’s
                    // effective values again (mobile → tablet → laptop). Emit the
                    // display fill raw — cleanBag would strip equals and leave
                    // Fields empty (no default / inherited spacing).
                    applyingCascade = true;

                    const next = clone(bag.value);
                    delete next[bp];

                    const parentEff = effectiveFrom(next, parentBp(bp));
                    next[bp] = {};
                    fieldHandles.value.forEach((h) => {
                        if (!isBlank(parentEff[h])) {
                            next[bp][h] = clone(parentEff[h]);
                        }
                    });

                    prevSerialized = JSON.stringify(next);
                    emit('update:value', next);

                    nextTick(() => {
                        applyingCascade = false;
                    });
                }

                /**
                 * Fill the active drawer for display only (equals parent).
                 * cleanBag strips these on emit, so they never become overrides —
                 * but Fields need something at `root.tablet.*` to bind to.
                 */
                function materializeDisplay(bp) {
                    // `bag` already reads a flat value as the base drawer, but the
                    // sub-fields bind to the container, not to `bag` — so a flat
                    // value has to be written back even on the base breakpoint,
                    // where there is otherwise nothing to fill.
                    const flat = needsReshaping();

                    if (bp === baseBp() && !flat) return;

                    const next = clone(bag.value);
                    let dirty = flat;

                    if (bp !== baseBp()) {
                        const parent = parentBp(bp);
                        const parentEff = effectiveFrom(bag.value, parent);
                        const cur = bag.value[bp] || {};

                        next[bp] = { ...cur };
                        fieldHandles.value.forEach((h) => {
                            if (!isBlank(cur[h])) return;
                            if (isBlank(parentEff[h])) return;
                            next[bp][h] = clone(parentEff[h]);
                            dirty = true;
                        });
                    }

                    if (dirty) {
                        // Emit RAW fill (not cleaned) so Fields see values; the next
                        // real user edit goes through emitBag → cleanBag.
                        emit('update:value', next);
                    }
                }

                watch(
                    () => JSON.stringify(props.value),
                    async () => {
                        if (applyingCascade) return;

                        const now = JSON.stringify(bag.value);
                        if (now === prevSerialized) return;

                        const prev = JSON.parse(prevSerialized || '{}');
                        prevSerialized = now;

                        const cur = clone(bag.value);
                        let dirty = false;

                        bpOrder().forEach((bp) => {
                            if (bp === baseBp()) return;

                            const parent = parentBp(bp);

                            fieldHandles.value.forEach((h) => {
                                const oldParentEff = effectiveFrom(prev, parent)[h];
                                // Use `cur` so a tablet fill updated earlier in this
                                // pass is already part of mobile’s parent effective.
                                const newParentEff = effectiveFrom(cur, parent)[h];

                                if (eq(oldParentEff, newParentEff)) return;

                                const mine = prev[bp]?.[h];
                                const wasInheriting = isBlank(mine) || eq(mine, oldParentEff);

                                if (!wasInheriting) return;
                                if (eq(cur[bp]?.[h], newParentEff)) return;

                                cur[bp] = { ...(cur[bp] || {}), [h]: clone(newParentEff) };
                                dirty = true;
                            });
                        });

                        if (!dirty) return;

                        applyingCascade = true;
                        prevSerialized = JSON.stringify(cur);
                        // Keep display fills; strip only on intentional emitBag.
                        emit('update:value', cur);
                        await nextTick();
                        applyingCascade = false;
                    }
                );

                function setBp(bp) {
                    if (!bpOrder().includes(bp) || bp === activeBp.value) {
                        return;
                    }

                    // Fill the drawer first so Fields keep their widgets and
                    // only rebind the path — no unmount, no flash.
                    materializeDisplay(bp);
                    activeBp.value = bp;
                }

                function onSveBreakpoint(e) {
                    const bp = e?.detail?.bp || deviceToBp(e?.detail?.device);
                    if (bp) setBp(bp);
                }

                function onStorage(e) {
                    if (e.key === 'sve-lp-device') setBp(deviceToBp(e.newValue));
                }

                /**
                 * Write the reshaped value back before the sub-fields render.
                 *
                 * `bag` reads a flat value as the base drawer, but the sub-fields
                 * bind to the container. A grid handed the flat array renders one
                 * row against the wrong shape and takes the panel down with it —
                 * the field goes blank and stops responding. Doing this in
                 * onMounted is too late: the first render has already happened.
                 */
                function reshapeFlatValue() {
                    if (!needsReshaping()) {
                        return false;
                    }

                    emit('update:value', toDrawers(props.value));

                    return true;
                }

                // Before the first render, not in onMounted: the sub-fields read
                // value and meta on the way up, and a grid or select that finds
                // the wrong shape there has already thrown by the time mounted
                // hooks run.
                normalizeMissingMeta();
                reshapeFlatValue();
                // …and fill every drawer before the first render too: Statamic
                // computes each field's replicator preview on render, and a grid
                // handed a null value from an empty drawer throws there.
                materializeAll();

                // A flat value can also arrive later — a set pasted in, or an
                // undo — on a field that is already mounted. Same reshaping, as
                // soon as it shows up.
                watch(
                    () => needsReshaping(),
                    (flat) => {
                        if (flat) reshapeFlatValue();
                    }
                );

                /**
                 * Fill every drawer, not just the active one.
                 *
                 * PHP's preProcess() does this on the way in, so a saved section
                 * arrives with all three drawers populated. A set created in the
                 * browser never ran through it, and a drawer left empty hands its
                 * sub-fields a null value — Statamic's own grid then does
                 * `this.value.length` unguarded and throws. `process()` strips the
                 * inherited copies again on save, so nothing extra is stored.
                 */
                function materializeAll() {
                    const next = clone(bag.value);
                    let dirty = needsReshaping();
                    let effective = { ...(next[baseBp()] || {}) };

                    bpOrder().slice(1).forEach((bp) => {
                        const cur = next[bp] || {};
                        next[bp] = { ...cur };

                        fieldHandles.value.forEach((h) => {
                            if (!isBlank(cur[h])) return;
                            if (isBlank(effective[h])) return;
                            next[bp][h] = clone(effective[h]);
                            dirty = true;
                        });

                        effective = { ...effective, ...next[bp] };
                    });

                    if (dirty) {
                        emit('update:value', next);
                    }
                }

                onMounted(() => {
                    window.addEventListener('sve:breakpoint', onSveBreakpoint);
                    window.addEventListener('storage', onStorage);
                    normalizeMissingMeta();
                    materializeAll();
                });

                onUnmounted(() => {
                    window.removeEventListener('sve:breakpoint', onSveBreakpoint);
                    window.removeEventListener('storage', onStorage);
                });

                const fieldPathPrefix = computed(() => `${rootPath.value}.${activeBp.value}`);
                const metaPathPrefix = computed(() => `${metaRoot.value}.${activeBp.value}`);

                /**
                 * Lighter tint of the CP primary (active Style-tab / Save) —
                 * same token as Visual Editor: --theme-color-primary.
                 */
                function accentColor() {
                    const dark = document.documentElement.classList.contains('dark');

                    // Soft lavender of the indigo active state — not teal, not neon.
                    return dark
                        ? 'color-mix(in srgb, var(--theme-color-primary, #4f46e5) 48%, white)'
                        : 'color-mix(in srgb, var(--theme-color-primary, #4f46e5) 62%, white)';
                }

                const dotColor = computed(() =>
                    hasOverrides.value
                        ? accentColor()
                        : 'color-mix(in oklab, currentColor 40%, transparent)'
                );

                return () => {
                    const accent = accentColor();
                    // Label is Statamic's. Dot + Reset only on tablet/mobile.
                    const showOverrideUi = activeBp.value !== baseBp();
                    const header = showOverrideUi
                        ? h(
                              'div',
                              {
                                  class: 'responsive-fieldtype-header',
                                  style: {
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      marginBottom: '6px',
                                      minHeight: '18px',
                                  },
                              },
                              [
                                  h('span', {
                                      class: 'responsive-fieldtype-dot',
                                      title: hasOverrides.value
                                          ? changedLabel.value
                                          : (strings.value.inherit_from
                                              ? str(strings.value.inherit_from, {
                                                    device:
                                                        breakpoints.value.find(
                                                            (b) =>
                                                                b.handle ===
                                                                parentBp(activeBp.value)
                                                        )?.label ||
                                                        parentBp(activeBp.value) ||
                                                        'Desktop',
                                                })
                                              : 'Responsive'),
                                      style: {
                                          width: '8px',
                                          height: '8px',
                                          borderRadius: '999px',
                                          background: dotColor.value,
                                          marginInlineStart: '4px',
                                          flexShrink: '0',
                                          display: 'inline-block',
                                          transition: 'background .15s ease, box-shadow .15s ease',
                                          boxShadow: hasOverrides.value
                                              ? '0 0 4px 1px color-mix(in srgb, var(--theme-color-primary, #4f46e5) 30%, transparent)'
                                              : 'none',
                                      },
                                  }),
                                  h('span', { style: { flex: '1' } }),
                                  hasOverrides.value
                                      ? h(
                                            'button',
                                            {
                                                type: 'button',
                                                class: 'responsive-fieldtype-reset',
                                                title: resetTitle.value,
                                                onClick: resetActive,
                                                style: {
                                                    border: 'none',
                                                    background: 'transparent',
                                                    color: accent,
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    padding: '0',
                                                    lineHeight: '1.25',
                                                    textDecoration: 'underline',
                                                    textUnderlineOffset: '2px',
                                                },
                                            },
                                            strings.value.reset || 'Nulstil'
                                        )
                                      : null,
                              ]
                          )
                        : null;

                    const fieldsTree = h(
                        FieldsProvider,
                        {
                            // The sub-fields read their value at the path they were
                            // built with, so rebinding the prefix alone leaves them
                            // showing the drawer they mounted on: switch away from a
                            // breakpoint you just edited and back, and the panel
                            // shows the parent's value while the right one is saved.
                            // Remounting is what makes the switch actually land.
                            key: activeBp.value,
                            fields: fields.value,
                            asConfig: false,
                            readOnly: props.readOnly,
                            fieldPathPrefix: fieldPathPrefix.value,
                            metaPathPrefix: metaPathPrefix.value,
                        },
                        {
                            default: () => h(Fields, { class: 'responsive-fieldtype-fields' }),
                        }
                    );

                    return h('div', { class: 'responsive-fieldtype', 'data-bp': activeBp.value }, [
                        header,
                        fieldsTree,
                    ]);
                };
            },
        });
    });
})();
