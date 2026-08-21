/**
 * Which global sets the Live Preview globe menu lists.
 *
 * Unsaved (null) follows the default: everything on except header/footer.
 * Toggling once writes the full list, so an empty save is "show none".
 */
(function () {
    'use strict';

    Statamic.booting(() => {
        const { computed } = window.Vue;

        function t(key) {
            return (window.Statamic?.$config?.get?.('sveStrings') || {})[key] ?? key;
        }

        Statamic.$components.register('globals-picker-fieldtype', {
            props: {
                value: { default: null },
                meta: { type: Object, default: () => ({}) },
            },

            emits: ['update:value'],

            setup(props, { emit }) {
                const sets = computed(() =>
                    Array.isArray(props.meta?.sets) ? props.meta.sets : []
                );
                const off = computed(() =>
                    Array.isArray(props.meta?.off) ? props.meta.off : []
                );

                const selected = computed(() => {
                    if (Array.isArray(props.value)) {
                        return props.value;
                    }

                    return sets.value
                        .map((set) => set.handle)
                        .filter((handle) => !off.value.includes(handle));
                });

                function isChecked(handle) {
                    return selected.value.includes(handle);
                }

                function toggle(handle) {
                    emit(
                        'update:value',
                        isChecked(handle)
                            ? selected.value.filter((h) => h !== handle)
                            : [...selected.value, handle]
                    );
                }

                return { sets, isChecked, toggle, t };
            },

            template: `
                <div>
                    <p v-if="!sets.length" class="text-sm text-gray-600 dark:text-gray-400">
                        {{ t('globals_picker_empty') }}
                    </p>
                    <div v-else class="flex flex-col gap-2">
                        <label
                            v-for="set in sets"
                            :key="set.handle"
                            class="flex items-center gap-2 text-sm cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                :checked="isChecked(set.handle)"
                                @change="toggle(set.handle)"
                            >
                            <span>{{ set.title }}</span>
                            <span class="text-xs text-gray-600 dark:text-gray-400">{{ set.handle }}</span>
                        </label>
                    </div>
                </div>
            `,
        });
    });
})();
