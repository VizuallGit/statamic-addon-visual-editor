/**
 * "Default pr. skærmstørrelse" i et felts indstillinger.
 *
 * Én rubrik pr. breakpoint undtagen basis — basis har feltets egen Default
 * Value-række længere oppe, og den bliver hvor den er. Listen kommer fra
 * serveren (`meta.breakpoints`, læst fra Breakpoints.php), så et nyt breakpoint
 * dukker op her af sig selv.
 *
 * Rubrikken tegnes med DET fieldtype der redigeres: står man i et range-felts
 * indstillinger, får hver skærmstørrelse en range. Typen og dens skala hentes
 * fra formularen omkring os via `getFieldSettingsValue` — samme greb som
 * spacing- og gap-addonets egne default-vælgere bruger. Uden det ville en range
 * vise 0-100 hvor feltet selv har 1-6.
 *
 * `resolveComponent` er ikke til pynt: `h('range-fieldtype')` med en STRENG
 * laver et HTML-element ved navn <range-fieldtype>. Det tegner ingenting og
 * siger ingenting — rubrikkerne stod tomme med kun deres navn.
 *
 * Værdien er `{tablet: …, mobile: …}`. Tomme rubrikker gemmes ikke, og den
 * skærmstørrelse arver så opad præcis som før.
 */
(function () {
    'use strict';

    Statamic.booting(() => {
        const { h, inject, computed, resolveComponent } = window.Vue;

        /** Skala- og valgmuligheds-nøgler der giver mening at arve fra feltet. */
        const INHERITED = ['min', 'max', 'step', 'options', 'clearable', 'placeholder', 'multiple', 'unit', 'mode'];

        Statamic.$components.register('sve-defaults-fieldtype', {
            inheritAttrs: false,
            props: {
                value: { default: null },
                meta: { type: Object, default: () => ({}) },
                config: { type: Object, default: () => ({}) },
                readOnly: { type: Boolean, default: false },
            },
            emits: ['update:value', 'focus', 'blur'],
            setup(props, { emit }) {
                const getSetting = inject('getFieldSettingsValue', null);

                function setting(key) {
                    if (!getSetting) return undefined;

                    try {
                        const v = getSetting(key);

                        return v === null || v === '' ? undefined : v;
                    } catch {
                        return undefined;
                    }
                }

                const rows = computed(() => props.meta?.breakpoints || []);

                /** Feltet vi står i — typen afgør hvilken kontrol rubrikkerne får. */
                const innerType = computed(() => setting('type') || 'text');

                const innerConfig = computed(() => {
                    const out = { type: innerType.value, handle: 'default', display: '' };

                    INHERITED.forEach((key) => {
                        const v = setting(key);

                        if (v !== undefined) out[key] = v;
                    });

                    return out;
                });

                const values = computed(() =>
                    props.value && typeof props.value === 'object' && !Array.isArray(props.value) ? props.value : {}
                );

                function isBlank(v) {
                    return v === null || v === undefined || v === '' || (Array.isArray(v) && !v.length);
                }

                function write(handle, v) {
                    const next = { ...values.value };

                    if (isBlank(v)) {
                        delete next[handle];
                    } else {
                        next[handle] = v;
                    }

                    emit('update:value', Object.keys(next).length ? next : null);
                }

                return () => {
                    if (!rows.value.length) return null;

                    const name = innerType.value + '-fieldtype';
                    let Inner = null;

                    try {
                        const resolved = resolveComponent(name);

                        // Uløst navn kommer tilbage som selve strengen.
                        Inner = typeof resolved === 'string' ? null : resolved;
                    } catch {
                        Inner = null;
                    }

                    return h(
                        'div',
                        { class: 'sve-defaults', style: { display: 'grid', gap: '.75rem' } },
                        rows.value.map((row) =>
                            h('div', { key: row.handle, class: 'sve-defaults-row' }, [
                                h(
                                    'div',
                                    {
                                        class: 'sve-defaults-label',
                                        style: { fontSize: '12px', fontWeight: '600', marginBottom: '.25rem', opacity: '.75' },
                                    },
                                    row.device || row.handle
                                ),
                                Inner
                                    ? h(Inner, {
                                          value: values.value[row.handle] ?? null,
                                          config: innerConfig.value,
                                          meta: {},
                                          readOnly: props.readOnly,
                                          'onUpdate:value': (v) => write(row.handle, v),
                                      })
                                    : h('div', { style: { fontSize: '12px', opacity: '.6' } }, innerType.value),
                            ])
                        )
                    );
                };
            },
        });
    });
}());
