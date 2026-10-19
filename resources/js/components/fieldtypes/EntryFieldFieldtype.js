/**
 * "Hent fra felt" — vælg hvilket felt på samlingens entries en blok viser.
 *
 * Mulighederne kommer fra serveren for alle samlinger (meta.fields), allerede
 * skåret til de felttyper blokken tager. Hvilken samling, læses reaktivt fra
 * formularen: det felt `config.collection_field` navngiver, nærmeste på vejen
 * op fra blokkens egen række. Vælger man en anden samling, skifter listen i
 * samme øjeblik — intet skal gemmes først. Er entries håndplukkede (list_source =
 * picked), bruges de samlinger de valgte entries ligger i. Se
 * src/Fieldtypes/EntryFieldFieldtype.php.
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

        /** Formularens meta (feltdata fra serveren). Også et ref() i v6. */
        function publishMeta(ctx) {
            return ctx?.meta?.value ?? ctx?.meta ?? {};
        }

        /** Entry-id'er fra et entries-felt (liste af id'er, eller én). */
        function idsOf(value) {
            if (typeof value === 'string') return value ? [value] : [];
            return Array.isArray(value) ? value.filter(id => typeof id === 'string' && id) : [];
        }

        /**
         * Samlingerne de håndplukkede entries ligger i. Entries-feltets meta har
         * en række pr. valgt entry med `edit_url` (…/collections/{samling}/entries/…);
         * metaens form afhænger af hvor feltet sidder (replicator, sæt …), så den
         * gennemsøges i stedet for at slå en bestemt sti op.
         */
        function collectionsOf(meta, ids) {
            const want = new Set(ids);
            const found = new Set();
            const seen = new Set();

            (function walk(node, depth) {
                if (!node || typeof node !== 'object' || depth > 14 || seen.has(node)) return;
                seen.add(node);

                if (Array.isArray(node)) {
                    for (const item of node) {
                        if (item && typeof item === 'object' && want.has(item.id) && typeof item.edit_url === 'string') {
                            const match = item.edit_url.match(/\/collections\/([^/?#]+)\/entries\//);
                            if (match) found.add(decodeURIComponent(match[1]));
                        } else {
                            walk(item, depth + 1);
                        }
                    }
                    return;
                }

                for (const key of Object.keys(node)) walk(node[key], depth + 1);
            })(meta, 0);

            return [...found];
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

                /**
                 * Håndplukkede entries: felterne kommer fra de samlinger entries
                 * faktisk ligger i — ikke fra "Samling", som kan stå på noget andet
                 * (fx Sider, mens man har plukket Lejere).
                 */
                const pickedCollections = computed(() => {
                    const values = publishValues(publishContext);
                    const source = nearest(values, props.fieldPathPrefix, props.config.source_field || 'list_source');
                    if (source !== (props.config.picked_value || 'picked')) return [];

                    const ids = idsOf(nearest(values, props.fieldPathPrefix, props.config.entries_field || 'list_entries'));
                    if (!ids.length) return [];

                    return collectionsOf(publishMeta(publishContext), ids)
                        .filter(handle => Array.isArray(props.meta?.fields?.[handle]));
                });

                const collection = computed(() => pickedCollections.value[0] || handleOf(nearest(
                    publishValues(publishContext),
                    props.fieldPathPrefix,
                    props.config.collection_field || 'list_collection',
                )));

                const collectionTitle = computed(() => (pickedCollections.value.length > 1 ? pickedCollections.value : [collection.value])
                    .map(handle => props.meta?.collections?.[handle] || handle)
                    .join(', '));

                const options = computed(() => {
                    // Entries fra flere samlinger: alle deres felter, hvert handle én gang.
                    const handles = pickedCollections.value.length > 1 ? pickedCollections.value : [collection.value];
                    const seen = new Set();
                    const list = [];

                    for (const handle of handles) {
                        for (const option of (props.meta?.fields?.[handle] || [])) {
                            if (seen.has(option.handle)) continue;
                            seen.add(option.handle);
                            list.push(option);
                        }
                    }

                    return list;
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
