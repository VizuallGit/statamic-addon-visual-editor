/**
 * One keyboard shortcut: the Shortcut column of Settings → Screen sizes.
 *
 * The site's own for that size, recorded with cp/surfaces/ShortcutInput.vue.
 * Empty shows the built-in one greyed out (Desktop, Tablet and Mobile have
 * one); `none` takes it away. The row's handle is read from this same form —
 * the cell's `fieldPathPrefix` is the row's path, `breakpoints.<index>` — so a
 * size never reads its own shortcut as another's.
 *
 * A built-in shortcut another action has is given up to the size by itself,
 * as the site's layer is over the built-in. One the site gave a tool (Keyboard
 * shortcuts, above) or another size (its row) is changed where it was given;
 * this cell writes only itself.
 *
 * Not registered by itself: addon.js imports it, as it does ToolbarAccessFieldtype.js.
 */
import ShortcutInput from '../../cp/surfaces/ShortcutInput.vue';
import { conflictsWith, isMac, resolveShortcutLayers, siteShortcuts } from '../../lib/shortcuts.js';
import { dataGet } from '../../lib/values.js';
(function () {
    'use strict';

    Statamic.booting(() => {
        const { computed, inject } = window.Vue;

        /** The form's values. `values` is a ref() in v6, but do not depend on it. */
        function publishValues(ctx) {
            return ctx?.values?.value ?? ctx?.values ?? {};
        }

        function plainObject(value) {
            return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
        }

        Statamic.$components.register('sve-shortcut-fieldtype', {
            components: { ShortcutInput },

            props: {
                value: { default: null },
                meta: { type: Object, default: () => ({}) },
                fieldPathPrefix: { type: String, default: '' },
            },

            emits: ['update:value'],

            setup(props, { emit }) {
                const publishContext = inject('PublishContainerContext', null);
                const mac = isMac(window.navigator);
                const builtIn = computed(() => plainObject(props.meta?.builtIn));
                const locked = computed(() => (Array.isArray(props.meta?.locked) ? props.meta.locked : []));
                const values = computed(() => publishValues(publishContext));
                const sizeRows = computed(() => (Array.isArray(values.value.breakpoints) ? values.value.breakpoints : []));
                const handle = computed(() => {
                    const row = props.fieldPathPrefix ? dataGet(values.value, props.fieldPathPrefix) : null;

                    return typeof row?.handle === 'string' ? row.handle : '';
                });
                const action = computed(() => (handle.value ? `size:${handle.value}` : ''));
                const layers = computed(() =>
                    resolveShortcutLayers(builtIn.value, siteShortcuts(values.value.shortcuts, sizeRows.value, locked.value), {})
                );
                const inherited = computed(() => builtIn.value[action.value] || '');

                function nameOf(other) {
                    if (other.startsWith('size:')) {
                        const key = other.slice('size:'.length);
                        const row = sizeRows.value.find((item) => item?.handle === key);

                        return plainObject(props.meta?.sizes)[key] || row?.label || key;
                    }

                    return plainObject(props.meta?.labels)[other] || other;
                }

                function owner(combo) {
                    const other = conflictsWith(layers.value.map, combo, action.value);

                    return other ? { action: other, label: nameOf(other), movable: layers.value.level[other] === 0 } : null;
                }

                function change(value) {
                    emit('update:value', value);
                }

                return { mac, locked, inherited, owner, change };
            },

            template: `
                <div>
                    <ShortcutInput
                        :value="value || ''"
                        :inherited="inherited"
                        :mac="mac"
                        :locked="locked"
                        :owner="owner"
                        @change="change"
                    />
                </div>
            `,
        });
    });
})();
