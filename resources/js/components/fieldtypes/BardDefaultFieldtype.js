/**
 * "Med fra start" på et Bard-felt — den tekst feltet åbner med.
 *
 * Gemmer under `default` som ProseMirror (PHP-felttypen folder den korte liste
 * ud). Inline-Bard er ét tekstfelt; ellers en kort liste af afsnit og
 * overskrifter. Dropdownen er valget: afsnit, eller overskrift niveau 1, 2
 * eller 3. En default kan være én blok eller to (en overskrift og et afsnit).
 *
 * En `raw`-række er en node CP'et ikke kan tegne (et set, en liste). Den bliver
 * liggende, så en YAML skrevet i hånden ikke forsvinder ved Gem.
 */
(function () {
    'use strict';

    Statamic.booting(() => {
        const { inject, computed, watch } = window.Vue;

        function publishValues(ctx) {
            return ctx?.values?.value ?? ctx?.values ?? {};
        }

        /** CP-brugerens sprog — samme sveStrings som live preview. */
        function t(key, vars = {}) {
            let out = (window.Statamic?.$config?.get?.('sveStrings') || {})[key] ?? key;

            for (const [name, value] of Object.entries(vars)) {
                out = out.replaceAll(`:${name}`, String(value));
            }

            return out;
        }

        function textOf(node) {
            if (!node || typeof node !== 'object') return '';
            if (node.type === 'text') return node.text || '';

            return (node.content || []).map(textOf).join('');
        }

        /**
         * YAML-default er ProseMirror (`{ type: heading }`). CP'et arbejder med
         * `{ kind }`. Begge tæller, så en default skrevet i hånden vises her.
         */
        function asBlocks(value) {
            if (!Array.isArray(value)) return [];

            return value.flatMap((item) => {
                if (!item || typeof item !== 'object') return [];
                if (item.kind) return [item];

                if (item.type === 'paragraph') {
                    return [{ kind: 'paragraph', text: textOf(item) }];
                }

                if (item.type === 'heading') {
                    const level = Number(item.attrs?.level) || 2;

                    return [{ kind: 'heading', level, text: textOf(item) }];
                }

                if (item.type === 'text') {
                    return [{ kind: 'text', text: item.text || '' }];
                }

                if (item.type) {
                    return [{ kind: 'raw', node: item }];
                }

                return [];
            });
        }

        Statamic.$components.register('bard-default-fieldtype', {
            props: {
                value: { default: () => [] },
                config: { type: Object, default: () => ({}) },
            },

            emits: ['update:value'],

            setup(props, { emit }) {
                const publishContext = inject('PublishContainerContext', null);

                const inline = computed(() => !!publishValues(publishContext).inline);

                const headingLevels = [1, 2, 3];

                const blocks = computed(() => asBlocks(props.value));

                const inlineText = computed(() => {
                    const first = blocks.value.find(block => block.kind === 'text' || block.kind === 'paragraph' || block.kind === 'heading');

                    return first?.text ?? '';
                });

                function emitBlocks(next) {
                    emit('update:value', next);
                }

                function add() {
                    emitBlocks([...asBlocks(props.value), { kind: 'paragraph', text: '' }]);
                }

                function update(index, patch) {
                    emitBlocks(blocks.value.map((block, i) => (i === index ? { ...block, ...patch } : block)));
                }

                function remove(index) {
                    emitBlocks(blocks.value.filter((_, i) => i !== index));
                }

                function setType(index, value) {
                    if (value === 'paragraph') {
                        update(index, { kind: 'paragraph', level: undefined });
                        return;
                    }

                    update(index, { kind: 'heading', level: Number(value.slice(1)) });
                }

                function levelsFor(block) {
                    const levels = [...headingLevels];

                    if (block.kind === 'heading' && block.level && !levels.includes(block.level)) {
                        levels.push(block.level);
                        levels.sort((a, b) => a - b);
                    }

                    return levels;
                }

                function setInlineText(text) {
                    const trimmed = text ?? '';
                    const rest = blocks.value.filter(block => block.kind === 'raw');

                    emitBlocks(trimmed === '' && !rest.length
                        ? []
                        : [{ kind: 'text', text: trimmed }, ...rest]);
                }

                watch(inline, (now, was) => {
                    if (was === undefined || now === was) return;

                    const editable = blocks.value.filter(block => block.kind !== 'raw');
                    const raw = blocks.value.filter(block => block.kind === 'raw');
                    const text = editable[0]?.text ?? '';

                    if (now) {
                        emitBlocks(text === '' && !raw.length ? [] : [{ kind: 'text', text }, ...raw]);
                        return;
                    }

                    emitBlocks(text === '' && !raw.length ? [] : [{ kind: 'paragraph', text }, ...raw]);
                });

                return {
                    inline,
                    headingLevels,
                    blocks,
                    inlineText,
                    add,
                    update,
                    remove,
                    setType,
                    setInlineText,
                    levelsFor,
                    t,
                };
            },

            template: `
                <div class="flex flex-col gap-2">
                    <div v-if="inline">
                        <input
                            type="text"
                            class="input-text"
                            :value="inlineText"
                            :placeholder="t('field_from_the_start_placeholder_inline')"
                            @input="setInlineText($event.target.value)"
                        >
                    </div>
                    <template v-else>
                        <div
                            v-for="(block, index) in blocks"
                            :key="index"
                            class="flex items-center gap-2"
                        >
                            <template v-if="block.kind === 'raw'">
                                <span class="text-sm text-gray-600 dark:text-gray-400 grow">
                                    {{ t('field_from_the_start_other_block', { type: block.node?.type || 'unknown' }) }}
                                </span>
                            </template>
                            <template v-else>
                                <select
                                    class="input-text"
                                    style="width: 9rem; flex: 0 0 auto;"
                                    :value="block.kind === 'heading' ? 'h' + block.level : 'paragraph'"
                                    @change="setType(index, $event.target.value)"
                                >
                                    <option value="paragraph">{{ t('field_from_the_start_paragraph') }}</option>
                                    <option
                                        v-for="level in levelsFor(block)"
                                        :key="level"
                                        :value="'h' + level"
                                    >{{ t('field_from_the_start_headline', { level }) }}</option>
                                </select>
                                <input
                                    type="text"
                                    class="input-text grow"
                                    :value="block.text"
                                    :placeholder="t('field_from_the_start_placeholder')"
                                    @input="update(index, { text: $event.target.value })"
                                >
                            </template>
                            <button
                                type="button"
                                class="text-sm text-gray-600 dark:text-gray-400 hover:text-current"
                                @click="remove(index)"
                            >{{ t('field_from_the_start_remove') }}</button>
                        </div>
                        <button
                            type="button"
                            class="inline-flex w-auto self-start items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-blue-700"
                            style="width: auto;"
                            @click="add"
                        >
                            {{ t('field_from_the_start_add') }}
                        </button>
                    </template>
                </div>
            `,
        });
    });
})();
