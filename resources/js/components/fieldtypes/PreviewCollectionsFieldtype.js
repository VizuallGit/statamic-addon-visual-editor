/**
 * Which collections get the "Open in Live Preview" label on their rows.
 *
 * Statamic's own checkbox per collection. One without a URL is disabled — it
 * has no page to open — and says so underneath; Statamic greys it out.
 */
import { t } from '../../lib/i18n.js';
(function () {
    'use strict';

    Statamic.booting(() => {
        const { computed } = window.Vue;

        Statamic.$components.register('sve-preview-collections-fieldtype', {
            props: {
                value: { default: null },
                meta: { type: Object, default: () => ({}) },
            },

            emits: ['update:value'],

            setup(props, { emit }) {
                const collections = computed(() =>
                    Array.isArray(props.meta?.collections) ? props.meta.collections : []
                );
                const selected = computed(() => (Array.isArray(props.value) ? props.value : []));

                function isChecked(handle) {
                    return selected.value.includes(handle);
                }

                function toggle(handle, checked) {
                    emit(
                        'update:value',
                        checked
                            ? [...selected.value.filter((h) => h !== handle), handle]
                            : selected.value.filter((h) => h !== handle)
                    );
                }

                return { collections, isChecked, toggle, t: (key, replacements) => t(window, key, replacements) };
            },

            template: `
                <div class="flex flex-col gap-2">
                    <ui-checkbox
                        v-for="collection in collections"
                        :key="collection.handle"
                        :label="collection.title"
                        :description="collection.previewable ? null : t('preview_collections_no_url')"
                        :disabled="!collection.previewable"
                        :model-value="collection.previewable && isChecked(collection.handle)"
                        @update:model-value="toggle(collection.handle, $event)"
                    />
                </div>
            `,
        });
    });
})();
