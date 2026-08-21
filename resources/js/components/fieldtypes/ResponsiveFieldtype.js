/**
 * Responsive fieldtype — desktop-first cascade (CSS-like).
 *
 * Stored shape: { laptop: {handle: val}, tablet?: {...}, mobile?: {...} }
 * Laptop is the baseline. Tablet/mobile only keep real overrides; anything that
 * still matches the parent is stripped before emit (same rule as PHP process()).
 *
 * Switching Live Preview devices flips which drawer Fields bind to. Fields are
 * remounted with :key=breakpoint so a tablet edit can never write into laptop.
 */
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

        const BP_ORDER = ['laptop', 'tablet', 'mobile'];

        function deviceToBp(device) {
            if (!device || device === 'Responsive' || device === 'Desktop' || device === 'Laptop') {
                return 'laptop';
            }
            if (device === 'Tablet') return 'tablet';
            if (device === 'Mobile') return 'mobile';
            return 'laptop';
        }

        function bpFromStorage() {
            try {
                return deviceToBp(chromeGet(window, 'sve-lp-device'));
            } catch {
                return 'laptop';
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
                const fieldsReady = ref(true);

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

                const bag = computed(() => {
                    const raw = props.value && typeof props.value === 'object' ? props.value : {};
                    const out = {};
                    BP_ORDER.forEach((bp) => {
                        out[bp] = { ...(raw[bp] && typeof raw[bp] === 'object' ? raw[bp] : {}) };
                    });
                    return out;
                });

                function parentBp(bp) {
                    const i = BP_ORDER.indexOf(bp);
                    return i > 0 ? BP_ORDER[i - 1] : null;
                }

                /** Effective values at a breakpoint (cascade laptop → …). */
                function effectiveFrom(source, bp) {
                    const out = {};
                    for (const step of BP_ORDER) {
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

                    BP_ORDER.forEach((bp) => {
                        const chunk = {};
                        const src = source[bp] || {};

                        fieldHandles.value.forEach((h) => {
                            if (!(h in src) || isBlank(src[h])) {
                                return;
                            }

                            if (bp !== 'laptop' && eq(src[h], effective[h])) {
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
                    if (bp === 'laptop') return [];

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
                    if (bp === 'laptop') return;

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
                    if (bp === 'laptop') return;

                    const parent = parentBp(bp);
                    const parentEff = effectiveFrom(bag.value, parent);
                    const cur = bag.value[bp] || {};
                    const next = clone(bag.value);
                    let dirty = false;

                    next[bp] = { ...cur };
                    fieldHandles.value.forEach((h) => {
                        if (!isBlank(cur[h])) return;
                        if (isBlank(parentEff[h])) return;
                        next[bp][h] = clone(parentEff[h]);
                        dirty = true;
                    });

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

                        BP_ORDER.forEach((bp) => {
                            if (bp === 'laptop') return;

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

                async function setBp(bp) {
                    if (!BP_ORDER.includes(bp) || bp === activeBp.value) {
                        return;
                    }

                    // Tear down Fields before flipping the path, so a stale
                    // tablet control cannot emit into laptop.
                    fieldsReady.value = false;
                    await nextTick();
                    activeBp.value = bp;
                    materializeDisplay(bp);
                    await nextTick();
                    fieldsReady.value = true;
                }

                function onSveBreakpoint(e) {
                    const bp = e?.detail?.bp || deviceToBp(e?.detail?.device);
                    if (bp) setBp(bp);
                }

                function onStorage(e) {
                    if (e.key === 'sve-lp-device') setBp(deviceToBp(e.newValue));
                }

                onMounted(() => {
                    window.addEventListener('sve:breakpoint', onSveBreakpoint);
                    window.addEventListener('storage', onStorage);
                    materializeDisplay(activeBp.value);
                });

                onUnmounted(() => {
                    window.removeEventListener('sve:breakpoint', onSveBreakpoint);
                    window.removeEventListener('storage', onStorage);
                });

                const fieldPathPrefix = computed(() => `${rootPath.value}.${activeBp.value}`);
                const metaPathPrefix = computed(() => `${metaRoot.value}.${activeBp.value}`);

                const label = computed(() => props.config?.display || props.handle || '');

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
                    // Dot + Reset only matter on tablet/mobile — laptop is the baseline.
                    const showOverrideUi = activeBp.value !== 'laptop';
                    const header = h(
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
                            h(
                                'span',
                                {
                                    class: 'responsive-fieldtype-label',
                                    style: {
                                        fontSize: '12px',
                                        fontWeight: '500',
                                        lineHeight: '1.25',
                                    },
                                },
                                label.value
                            ),
                            showOverrideUi
                                ? h('span', {
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
                                  })
                                : null,
                            h('span', { style: { flex: '1' } }),
                            showOverrideUi && hasOverrides.value
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
                    );

                    const fieldsTree = fieldsReady.value
                        ? h(
                              FieldsProvider,
                              {
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
                          )
                        : null;

                    return h('div', { class: 'responsive-fieldtype', 'data-bp': activeBp.value }, [
                        header,
                        fieldsTree,
                    ]);
                };
            },
        });
    });
})();
