/**
 * "Hent fra felt" — vælg hvilket felt på samlingens entries en blok viser.
 *
 * Mulighederne kommer fra serveren for alle samlinger (meta.fields), allerede
 * skåret til de felttyper blokken tager. Hvilken samling, læses reaktivt fra
 * formularen: det felt `config.collection_field` navngiver, nærmeste på vejen
 * op fra blokkens egen række. Vælger man en anden samling, skifter listen i
 * samme øjeblik — intet skal gemmes først. Se src/Fieldtypes/EntryFieldFieldtype.php.
 */
import { t } from '../../lib/i18n.js';
(function () {
    'use strict';

    Statamic.booting(() => {
        const { inject, computed } = window.Vue;

        /** Formularens værdier. `values` er et ref() i v6, men vær ikke afhængig af det. */
        function publishValues(ctx) {
            return ctx?.values?.value ?? ctx?.values ?? {};
        }

        /** Et collections-felt med max 1 er en streng eller en liste med én. */
        function handleOf(value) {
            if (typeof value === 'string') return value;
            if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
            return '';
        }

        /**
         * `key` i nærmeste række på vejen op fra `path` (fx
         * `page_sections.2.card_blocks.0` → `page_sections.2` har list_collection).
         */
        function nearest(values, path, key) {
            const parts = path ? String(path).split('.') : [];

            for (let depth = parts.length; depth >= 0; depth--) {
                let node = values;

                for (const part of parts.slice(0, depth)) {
                    node = node?.[part];
                }

                if (node && typeof node === 'object' && !Array.isArray(node) && key in node) {
                    return node[key];
                }
            }

            return undefined;
        }

        Statamic.$components.register('sve-entry-field-fieldtype', {
            props: {
                value: { default: null },
                config: { type: Object, default: () => ({}) },
                meta: { type: Object, default: () => ({}) },
                handle: { type: String, default: '' },
                fieldPathPrefix: { type: String, default: '' },
                readOnly: { type: Boolean, default: false },
            },

            emits: ['update:value'],

            setup(props, { emit }) {
                const publishContext = inject('PublishContainerContext', null);

                const collection = computed(() => handleOf(nearest(
                    publishValues(publishContext),
                    props.fieldPathPrefix,
                    props.config.collection_field || 'list_collection',
                )));

                const collectionTitle = computed(() => props.meta?.collections?.[collection.value] || collection.value);

                const options = computed(() => {
                    const list = props.meta?.fields?.[collection.value];
                    return Array.isArray(list) ? list : [];
                });

                const current = computed(() => (typeof props.value === 'string' ? props.value : ''));

                /** Samme regel som Statamics egne felter: readOnly eller visibility. */
                const locked = computed(() => props.readOnly || ['read_only', 'computed'].includes(props.config.visibility));

                /** Valgt før samlingen blev skiftet — vis det, slet det ikke i stilhed. */
                const missing = computed(() => current.value !== '' && !options.value.some(o => o.handle === current.value));

                function pick(event) {
                    emit('update:value', event.target.value || null);
                }

                return {
                    collection,
                    collectionTitle,
                    options,
                    current,
                    missing,
                    locked,
                    pick,
                    t: (key, replacements) => t(window, key, replacements),
                };
            },

            template: `
                <div class="flex flex-col gap-1">
                    <select
                        class="w-full h-10 rounded-lg ps-3 pe-9 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-925 dark:text-gray-300 shadow-ui-sm cursor-pointer"
                        :value="current"
                        :disabled="locked || !collection"
                        @change="pick"
                    >
                        <option value="">{{ t('entry_field_none') }}</option>
                        <option v-if="missing" :value="current">{{ t('entry_field_missing', { field: current, collection: collectionTitle }) }}</option>
                        <option v-for="option in options" :key="option.handle" :value="option.handle">{{ option.display }}</option>
                    </select>
                    <p v-if="!collection" class="text-xs text-gray-600 dark:text-gray-400">{{ t('entry_field_pick_collection') }}</p>
                    <p v-else-if="!options.length" class="text-xs text-gray-600 dark:text-gray-400">{{ t('entry_field_no_fields', { collection: collectionTitle }) }}</p>
                </div>
            `,
        });
    });
})();
