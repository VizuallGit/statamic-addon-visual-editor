/**
 * "Med fra start" — afkrydsning af de set-typer et nyt replicator-felt får med.
 *
 * Feltet står i replicatorens egne indstillinger og gemmer under `default`,
 * samme form som YAML: `[{ type: 'icon' }, { type: 'title' }]`. Se
 * DefaultSetsFieldtype.php.
 *
 * Mulighederne er ikke skrevet ned nogen steder. De læses fra `sets`-feltet i
 * SAMME formular mens man redigerer — tilføjer man et set i fanen ved siden af,
 * dukker det op her med det samme. En række der allerede har andre nøgler
 * (indlejrede defaults) bliver liggende, så længe typen stadig er krydset af.
 */
(function () {
    'use strict';

    Statamic.booting(() => {
        const { inject, computed } = window.Vue;

        /** Formularens værdier. `values` er et ref() i v6, men vær ikke afhængig af det. */
        function publishValues(ctx) {
            return ctx?.values?.value ?? ctx?.values ?? {};
        }

        function t(key) {
            return (window.Statamic?.$config?.get?.('sveStrings') || {})[key] ?? key;
        }

        /**
         * `default` kan være rækker (`{ type }`) eller bare handles. Begge tæller
         * som rækker her, så en YAML skrevet i hånden og en afkrydsning mødes.
         */
        function asRows(value) {
            if (!Array.isArray(value)) return [];

            return value.flatMap((item) => {
                if (typeof item === 'string' && item !== '') {
                    return [{ type: item }];
                }

                if (item && typeof item === 'object' && typeof item.type === 'string' && item.type !== '') {
                    return [item];
                }

                return [];
            });
        }

        Statamic.$components.register('default-sets-fieldtype', {
            props: {
                value: { default: () => [] },
                config: { type: Object, default: () => ({}) },
            },

            emits: ['update:value'],

            setup(props, { emit }) {
                const publishContext = inject('PublishContainerContext', null);

                /**
                 * Feltets egne sets, fladet ud på tværs af grupper.
                 *
                 * Gruppenavnet følger med, så to sets med samme navn i hver sin
                 * gruppe stadig kan skelnes fra hinanden i listen.
                 */
                const sets = computed(() => {
                    const groups = publishValues(publishContext).sets;

                    if (!Array.isArray(groups)) return [];

                    return groups.flatMap((group) => {
                        const groupName = group?.display || group?.handle || '';

                        return (group?.sections ?? [])
                            .filter(set => set?.handle)
                            .map(set => ({
                                handle: set.handle,
                                display: set.display || set.handle,
                                group: groups.length > 1 ? groupName : null,
                            }));
                    });
                });

                const rows = computed(() => asRows(props.value));

                function isChecked(handle) {
                    return rows.value.some(row => row.type === handle);
                }

                function toggle(handle) {
                    if (isChecked(handle)) {
                        emit('update:value', rows.value.filter(row => row.type !== handle));
                        return;
                    }

                    emit('update:value', [...rows.value, { type: handle }]);
                }

                return { sets, isChecked, toggle, t };
            },

            template: `
                <div>
                    <p v-if="!sets.length" class="text-sm text-gray-600 dark:text-gray-400">
                        {{ t('field_from_the_start_no_sets') }}
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
                            <span>{{ set.display }}</span>
                            <span v-if="set.group" class="text-xs text-gray-600 dark:text-gray-400">
                                {{ set.group }}
                            </span>
                        </label>
                    </div>
                </div>
            `,
        });
    });
})();
