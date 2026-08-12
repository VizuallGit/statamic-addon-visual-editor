/**
 * "Kun én af hver" — afkrydsning af de set-typer der kun må optræde én gang.
 *
 * Feltet står i replicatorens egne indstillinger og gemmer en liste af handles
 * i `unique_sets`. Se app/Fieldtypes/UniqueSets.php.
 *
 * Mulighederne er ikke skrevet ned nogen steder. De læses fra `sets`-feltet i
 * SAMME formular mens man redigerer — tilføjer man et set i fanen ved siden af,
 * dukker det op her med det samme, uden at noget skal gemmes først. Det er hele
 * pointen med at læse dem reaktivt: de to felter kan ikke komme ud af trit.
 *
 * `sets` har den form Statamics egen Sets-fieldtype leverer til CP'et: en liste
 * af grupper, hver med sine sets under `sections`. Formen læses defensivt, for
 * et felt uden sets endnu har ingen af delene.
 */
(function () {
    'use strict';

    Statamic.booting(() => {
        const { inject, computed } = window.Vue;

        /** Formularens værdier. `values` er et ref() i v6, men vær ikke afhængig af det. */
        function publishValues(ctx) {
            return ctx?.values?.value ?? ctx?.values ?? {};
        }

        Statamic.$components.register('unique-sets-fieldtype', {
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

                const selected = computed(() => (Array.isArray(props.value) ? props.value : []));

                function isChecked(handle) {
                    return selected.value.includes(handle);
                }

                function toggle(handle) {
                    emit('update:value', isChecked(handle)
                        ? selected.value.filter(h => h !== handle)
                        : [...selected.value, handle]);
                }

                return { sets, isChecked, toggle };
            },

            template: `
                <div>
                    <p v-if="!sets.length" class="text-sm text-gray-600 dark:text-gray-400">
                        Feltet har ingen sets endnu. Opret dem under "Manage Sets" — så kan de krydses af her.
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
