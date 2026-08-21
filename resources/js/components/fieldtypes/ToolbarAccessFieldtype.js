/**
 * Who may see one Live Preview toolbar icon.
 *
 * Lives under that tool's toggle. The radios are teleported into the toggle's
 * own label column (under its instructions) — not a second settings row.
 */
(function () {
    'use strict';

    Statamic.booting(() => {
        const { computed, nextTick, onMounted, onUnmounted, ref } = window.Vue;

        function t(key) {
            return (window.Statamic?.$config?.get?.('sveStrings') || {})[key] ?? key;
        }

        function rowFrom(value, fallbackAudience) {
            const current = value && typeof value === 'object' ? value : {};
            const audience =
                current.audience === 'super' || current.audience === 'people' || current.audience === 'everyone'
                    ? current.audience
                    : fallbackAudience;

            return {
                audience,
                users: Array.isArray(current.users) ? current.users.map(String) : [],
                groups: Array.isArray(current.groups) ? current.groups.map(String) : [],
            };
        }

        function fieldRoot(el) {
            return el?.closest('[data-ui-input-group]') || el?.closest('[class$="-fieldtype"]') || null;
        }

        Statamic.$components.register('toolbar-access-fieldtype', {
            props: {
                value: { default: null },
                meta: { type: Object, default: () => ({}) },
            },

            emits: ['update:value'],

            setup(props, { emit }) {
                const anchor = ref(null);
                const target = ref(null);
                const hiddenField = ref(null);

                const users = computed(() =>
                    Array.isArray(props.meta?.users) ? props.meta.users : []
                );
                const groups = computed(() =>
                    Array.isArray(props.meta?.groups) ? props.meta.groups : []
                );
                const defaultAudience = computed(() =>
                    props.meta?.default_audience === 'super' || props.meta?.default_audience === 'people'
                        ? props.meta.default_audience
                        : 'everyone'
                );
                const row = computed(() => rowFrom(props.value, defaultAudience.value));

                function emitRow(partial) {
                    emit('update:value', {
                        audience: partial.audience ?? row.value.audience,
                        users: partial.users ?? row.value.users,
                        groups: partial.groups ?? row.value.groups,
                    });
                }

                function setAudience(audience) {
                    emitRow({ audience });
                }

                function toggleUser(id) {
                    const usersForRow = row.value.users;

                    emitRow({
                        users: usersForRow.includes(id)
                            ? usersForRow.filter((item) => item !== id)
                            : [...usersForRow, id],
                    });
                }

                function toggleGroup(handle) {
                    const groupsForRow = row.value.groups;

                    emitRow({
                        groups: groupsForRow.includes(handle)
                            ? groupsForRow.filter((item) => item !== handle)
                            : [...groupsForRow, handle],
                    });
                }

                onMounted(async () => {
                    await nextTick();
                    await nextTick();

                    const mine = fieldRoot(anchor.value);
                    if (!mine) {
                        return;
                    }

                    let prev = mine.previousElementSibling;
                    while (prev && !prev.classList.contains('toggle-fieldtype')) {
                        prev = prev.previousElementSibling;
                    }

                    const header = prev?.querySelector('[data-ui-field-header]');
                    if (!header) {
                        return;
                    }

                    target.value = header;
                    await nextTick();
                    mine.setAttribute('hidden', '');
                    mine.style.display = 'none';
                    hiddenField.value = mine;
                });

                onUnmounted(() => {
                    const mine = hiddenField.value;
                    if (mine) {
                        mine.removeAttribute('hidden');
                        mine.style.removeProperty('display');
                    }
                });

                return {
                    anchor,
                    target,
                    row,
                    users,
                    groups,
                    setAudience,
                    toggleUser,
                    toggleGroup,
                    t,
                };
            },

            template: `
                <div>
                    <span ref="anchor" hidden></span>
                    <Teleport :to="target || 'body'" :disabled="!target">
                        <div class="sve-toolbar-access">
                            <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                                <label class="inline-flex items-center gap-1.5 cursor-pointer">
                                    <input type="radio" :checked="row.audience === 'everyone'" @change="setAudience('everyone')">
                                    <span>{{ t('toolbar_access_everyone') }}</span>
                                </label>
                                <label class="inline-flex items-center gap-1.5 cursor-pointer">
                                    <input type="radio" :checked="row.audience === 'super'" @change="setAudience('super')">
                                    <span>{{ t('toolbar_access_super') }}</span>
                                </label>
                                <label class="inline-flex items-center gap-1.5 cursor-pointer">
                                    <input type="radio" :checked="row.audience === 'people'" @change="setAudience('people')">
                                    <span>{{ t('toolbar_access_people') }}</span>
                                </label>
                            </div>
                            <div v-if="row.audience === 'people'" class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <div class="text-xs font-medium mb-1 opacity-70">{{ t('toolbar_access_users') }}</div>
                                    <p v-if="!users.length" class="text-xs opacity-60">{{ t('toolbar_access_empty_users') }}</p>
                                    <div v-else class="flex flex-col gap-1 max-h-40 overflow-auto">
                                        <label
                                            v-for="user in users"
                                            :key="user.id"
                                            class="flex items-center gap-2 text-sm cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                :checked="row.users.includes(user.id)"
                                                @change="toggleUser(user.id)"
                                            >
                                            <span>{{ user.name }}</span>
                                            <span v-if="user.email && user.email !== user.name" class="text-xs opacity-60">{{ user.email }}</span>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <div class="text-xs font-medium mb-1 opacity-70">{{ t('toolbar_access_groups') }}</div>
                                    <p v-if="!groups.length" class="text-xs opacity-60">{{ t('toolbar_access_empty_groups') }}</p>
                                    <div v-else class="flex flex-col gap-1 max-h-40 overflow-auto">
                                        <label
                                            v-for="group in groups"
                                            :key="group.handle"
                                            class="flex items-center gap-2 text-sm cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                :checked="row.groups.includes(group.handle)"
                                                @change="toggleGroup(group.handle)"
                                            >
                                            <span>{{ group.title }}</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Teleport>
                </div>
            `,
        });
    });
})();
