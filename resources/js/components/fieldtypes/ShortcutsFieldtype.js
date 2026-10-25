/**
 * Settings → Keyboard shortcuts: the site's shortcut for every top-bar tool.
 *
 * One recorder per tool (cp/surfaces/ShortcutInput.vue). Empty shows the
 * built-in shortcut greyed out — it applies until the site records its own.
 * The value is a map, `{ "tool:pages": "mod+p", … }`; `none` takes a built-in
 * one away. Every user can still change their own in Live Preview (⋮ →
 * Shortcuts).
 *
 * A shortcut another tool has is moved here on a yes: that tool gets `none`,
 * in this same map. A size's built-in one is given up to the tool by itself,
 * as the site's layer is over the built-in; one a size has on its row in the
 * Screen sizes grid is changed there. The grid is read from this same form as
 * it stands (`PublishContainerContext`), so the two never disagree before a
 * save.
 *
 * Not registered by itself: addon.js imports it, as it does ToolbarAccessFieldtype.js.
 */
import ShortcutInput from '../../cp/surfaces/ShortcutInput.vue';
import { NONE, conflictsWith, isMac, resolveShortcutLayers, siteShortcuts } from '../../lib/shortcuts.js';
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

        Statamic.$components.register('sve-shortcuts-fieldtype', {
            components: { ShortcutInput },

            props: {
                value: { default: null },
                meta: { type: Object, default: () => ({}) },
            },

            emits: ['update:value'],

            setup(props, { emit }) {
                const publishContext = inject('PublishContainerContext', null);
                const mac = isMac(window.navigator);

                // [{ action, label, default }] — every tool, in the built-in order.
                const rows = computed(() => (Array.isArray(props.meta?.rows) ? props.meta.rows : []));
                const locked = computed(() => (Array.isArray(props.meta?.locked) ? props.meta.locked : []));
                const own = computed(() => plainObject(props.value));
                const sizeRows = computed(() => {
                    const list = publishValues(publishContext).breakpoints;

                    return Array.isArray(list) ? list : [];
                });
                const layers = computed(() =>
                    resolveShortcutLayers(plainObject(props.meta?.builtIn), siteShortcuts(own.value, sizeRows.value, locked.value), {})
                );

                function nameOf(action) {
                    if (action.startsWith('size:')) {
                        const handle = action.slice('size:'.length);
                        const row = sizeRows.value.find((item) => item?.handle === handle);

                        return plainObject(props.meta?.sizes)[handle] || row?.label || handle;
                    }

                    return rows.value.find((row) => row.action === action)?.label || action;
                }

                function ownerFor(action) {
                    return (combo) => {
                        const other = conflictsWith(layers.value.map, combo, action);

                        if (!other) {
                            return null;
                        }

                        return {
                            action: other,
                            label: nameOf(other),
                            movable: other.startsWith('tool:') || layers.value.level[other] === 0,
                        };
                    };
                }

                function change(action, value, moveFrom) {
                    const next = { ...own.value };

                    if (value) {
                        next[action] = value;
                    } else {
                        delete next[action];
                    }

                    if (moveFrom && moveFrom.startsWith('tool:') && moveFrom !== action) {
                        next[moveFrom] = NONE;
                    }

                    emit('update:value', next);
                }

                return { rows, own, mac, locked, ownerFor, change };
            },

            template: `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                    <div
                        v-for="row in rows"
                        :key="row.action"
                        class="flex items-center justify-between gap-3 text-sm py-1"
                        :data-sve-shortcut-row="row.action"
                    >
                        <span class="min-w-0 truncate" :title="row.label">{{ row.label }}</span>
                        <ShortcutInput
                            :value="own[row.action] || ''"
                            :inherited="row.default"
                            :mac="mac"
                            :locked="locked"
                            :owner="ownerFor(row.action)"
                            :label="row.label"
                            @change="(value, moveFrom) => change(row.action, value, moveFrom)"
                        />
                    </div>
                </div>
            `,
        });
    });
})();
