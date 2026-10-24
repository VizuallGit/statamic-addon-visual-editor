/**
 * Which collections get the "Open in Live Preview" label on their rows.
 *
 * Statamic's own Combobox, set up the way its collections dropdown is. A
 * collection without a URL is listed last at half opacity and cannot be chosen:
 * picking it leaves the value as it was.
 */
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
                const previewable = computed(
                    () => new Set(collections.value.filter((c) => c.previewable).map((c) => c.handle))
                );

                function select(handles) {
                    emit('update:value', (Array.isArray(handles) ? handles : []).filter((h) => previewable.value.has(h)));
                }

                return { collections, selected, select };
            },

            template: `
                <ui-combobox
                    searchable
                    multiple
                    :options="collections"
                    :model-value="selected"
                    option-label="title"
                    option-value="handle"
                    :placeholder="__('Choose...')"
                    @update:model-value="select"
                >
                    <template #option="option">
                        <div
                            class="truncate grow"
                            :style="option.previewable ? null : { opacity: 0.5, cursor: 'not-allowed' }"
                            :textContent="option.title"
                        />
                    </template>
                </ui-combobox>
            `,
        });
    });
})();
