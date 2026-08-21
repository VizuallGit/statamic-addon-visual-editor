/**
 * Number beside each "From the start" checkbox.
 *
 * Own CP script — not addon.js. Re-registers only `default-sets-fieldtype`.
 *
 * Must use Vue `h()` (no `template` string): Statamic's CP Vue is runtime-only,
 * so a template here never compiles and the checkbox-only component from
 * addon.js stays on screen. Six Items is six `{ type: item }` rows.
 */
(function () {
    'use strict';

    var MAX = 24;

    function publishValues(ctx) {
        return ctx?.values?.value ?? ctx?.values ?? {};
    }

    function t(key) {
        return (window.Statamic?.$config?.get?.('sveStrings') || {})[key] ?? key;
    }

    function asRows(value) {
        if (!Array.isArray(value)) return [];

        return value.flatMap(function (item) {
            if (typeof item === 'string' && item !== '') {
                return [{ type: item }];
            }

            if (item && typeof item === 'object' && typeof item.type === 'string' && item.type !== '') {
                return [item];
            }

            return [];
        });
    }

    function clampCount(n) {
        var parsed = parseInt(n, 10);

        if (!Number.isFinite(parsed) || parsed < 1) return 1;

        return Math.min(MAX, parsed);
    }

    function register() {
        var Vue = window.Vue;

        if (!window.Statamic || !Statamic.$components || !Vue || typeof Vue.h !== 'function') {
            return;
        }

        var inject = Vue.inject;
        var computed = Vue.computed;
        var h = Vue.h;

        Statamic.$components.register('default-sets-fieldtype', {
            props: {
                value: { default: function () { return []; } },
                config: { type: Object, default: function () { return {}; } },
            },

            emits: ['update:value'],

            setup: function (props, ctx) {
                var emit = ctx.emit;
                var publishContext = inject('PublishContainerContext', null);

                var sets = computed(function () {
                    var groups = publishValues(publishContext).sets;

                    if (!Array.isArray(groups)) return [];

                    return groups.flatMap(function (group) {
                        var groupName = group?.display || group?.handle || '';

                        return (group?.sections ?? [])
                            .filter(function (set) { return set?.handle; })
                            .map(function (set) {
                                return {
                                    handle: set.handle,
                                    display: set.display || set.handle,
                                    group: groups.length > 1 ? groupName : null,
                                };
                            });
                    });
                });

                var rows = computed(function () { return asRows(props.value); });

                function isChecked(handle) {
                    return rows.value.some(function (row) { return row.type === handle; });
                }

                function countOf(handle) {
                    var n = rows.value.filter(function (row) { return row.type === handle; }).length;

                    return n > 0 ? n : 1;
                }

                function emitType(handle, count) {
                    var current = rows.value;
                    var first = current.findIndex(function (row) { return row.type === handle; });
                    var without = current.filter(function (row) { return row.type !== handle; });

                    if (count < 1) {
                        emit('update:value', without);
                        return;
                    }

                    var template = current.find(function (row) { return row.type === handle; }) || { type: handle };
                    var copies = [];
                    var i;

                    for (i = 0; i < count; i++) {
                        copies.push(Object.assign({}, template, { type: handle }));
                    }

                    var next = without.slice();
                    next.splice(first === -1 ? next.length : first, 0, ...copies);
                    emit('update:value', next);
                }

                function toggle(handle) {
                    if (isChecked(handle)) {
                        emitType(handle, 0);
                        return;
                    }

                    emit('update:value', rows.value.concat([{ type: handle }]));
                }

                function setCount(handle, value) {
                    if (!isChecked(handle)) return;

                    emitType(handle, clampCount(value));
                }

                return function () {
                    var list = sets.value;

                    if (!list.length) {
                        return h('p', { class: 'text-sm text-gray-600 dark:text-gray-400' }, t('field_from_the_start_no_sets'));
                    }

                    return h(
                        'div',
                        { class: 'flex flex-col gap-2' },
                        list.map(function (set) {
                            var checked = isChecked(set.handle);
                            var labelKids = [
                                h('input', {
                                    type: 'checkbox',
                                    checked: checked,
                                    onChange: function () { toggle(set.handle); },
                                }),
                                h('span', set.display),
                            ];

                            if (set.group) {
                                labelKids.push(h('span', { class: 'text-xs text-gray-600 dark:text-gray-400' }, set.group));
                            }

                            var rowKids = [
                                h('label', { class: 'flex items-center gap-2 cursor-pointer min-w-0' }, labelKids),
                            ];

                            if (checked) {
                                rowKids.push(h('input', {
                                    type: 'number',
                                    class: 'input-text sve-from-the-start-count',
                                    min: '1',
                                    max: String(MAX),
                                    step: '1',
                                    value: countOf(set.handle),
                                    onChange: function (event) { setCount(set.handle, event.target.value); },
                                }));
                            }

                            return h('div', { key: set.handle, class: 'flex items-center gap-2 text-sm' }, rowKids);
                        })
                    );
                };
            },
        });
    }

    function wait() {
        if (!window.Statamic || !Statamic.$components || typeof Statamic.booted !== 'function' || !window.Vue) {
            setTimeout(wait, 30);
            return;
        }

        Statamic.booted(register);

        if (Statamic.$app) {
            register();
        }
    }

    wait();
})();
