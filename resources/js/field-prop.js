/**
 * Selects for every `:name ?? …` in the section template.
 *
 * Own CP script — not addon.js. Registers `sve-template-props-fieldtype`.
 * The template owns the names: `headline_field` is the same kind of prop
 * as `text_field`. This field re-reads the file so a rename shows up here.
 *
 * Must use Vue `h()`: Statamic's CP Vue is runtime-only.
 */
(function () {
    'use strict';

    var SELECT_CLASS = [
        'w-full h-10 rounded-lg ps-3 pe-9',
        'appearance-none bg-no-repeat',
        'bg-white dark:bg-gray-900',
        'border border-gray-300 dark:border-gray-700',
        'text-gray-925 dark:text-gray-300',
        'shadow-ui-sm antialiased',
        'cursor-pointer',
    ].join(' ');

    function t(key, fallback) {
        return (window.Statamic?.$config?.get?.('sveStrings') || {})[key] ?? fallback ?? key;
    }

    function asMap(value) {
        return value && typeof value === 'object' && !Array.isArray(value) ? Object.assign({}, value) : {};
    }

    function asString(value) {
        if (typeof value === 'string' && value !== '') {
            return value;
        }

        if (Array.isArray(value) && typeof value[0] === 'string') {
            return value[0];
        }

        return '';
    }

    function collectionHandle(bindings, map) {
        var collection = (bindings || []).find(function (b) { return b.kind === 'collection'; });

        if (!collection) {
            return '';
        }

        return asString(map[collection.handle]) || asString(collection.fallback);
    }

    function headline(binding) {
        if (binding.label) {
            return binding.label;
        }

        if (binding.kind === 'collection') {
            return t('template_prop_collection', 'Collection');
        }

        return String(binding.handle || '')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    }

    function register() {
        var Vue = window.Vue;

        if (!window.Statamic || !Statamic.$components || !Vue || typeof Vue.h !== 'function') {
            return;
        }

        var ref = Vue.ref;
        var computed = Vue.computed;
        var onMounted = Vue.onMounted;
        var onUnmounted = Vue.onUnmounted;
        var h = Vue.h;

        Statamic.$components.register('sve-template-props-fieldtype', {
            props: {
                value: { default: function () { return {}; } },
                config: { type: Object, default: function () { return {}; } },
                meta: { type: Object, default: function () { return {}; } },
                readOnly: { type: Boolean, default: false },
            },

            emits: ['update:value'],

            setup: function (props, ctx) {
                var emit = ctx.emit;
                var bindings = ref(props.meta.bindings || []);
                var collections = ref(props.meta.collections || {});
                var fields = ref(props.meta.fields || {});
                var assetFields = ref(props.meta.assetFields || {});
                var timer = null;

                function applyPayload(data) {
                    if (!data || !Array.isArray(data.bindings)) {
                        return;
                    }

                    bindings.value = data.bindings;
                    collections.value = data.collections || collections.value;
                    fields.value = data.fields || fields.value;
                    assetFields.value = data.assetFields || assetFields.value;
                }

                function refresh() {
                    var type = props.config.section_type;

                    if (!type) {
                        return;
                    }

                    fetch('/!/sve/template-props?type=' + encodeURIComponent(type), { credentials: 'same-origin' })
                        .then(function (res) { return res.ok ? res.json() : null; })
                        .then(applyPayload)
                        .catch(function () {});
                }

                onMounted(function () {
                    refresh();
                    timer = window.setInterval(refresh, 2000);
                });

                onUnmounted(function () {
                    if (timer) {
                        window.clearInterval(timer);
                    }
                });

                var map = computed(function () { return asMap(props.value); });

                function setHandle(handle, next) {
                    var out = asMap(props.value);
                    out[handle] = next;
                    emit('update:value', out);
                }

                function optionsFor(binding) {
                    if (binding.kind === 'collection') {
                        return Object.keys(collections.value).map(function (key) {
                            return { handle: key, display: collections.value[key] || key };
                        });
                    }

                    var source = binding.kind === 'assets' ? assetFields.value : fields.value;
                    var list = source[collectionHandle(bindings.value, map.value)] || [];

                    return Array.isArray(list) ? list : [];
                }

                function currentFor(binding) {
                    return asString(map.value[binding.handle]) || asString(binding.fallback);
                }

                return function () {
                    var rows = bindings.value.map(function (binding) {
                        var current = currentFor(binding);
                        var opts = optionsFor(binding).slice();
                        var known = opts.some(function (opt) { return opt.handle === current; });

                        if (current && !known) {
                            opts.unshift({ handle: current, display: current });
                        }

                        var children = opts.map(function (opt) {
                            return h('option', { key: opt.handle, value: opt.handle }, opt.display || opt.handle);
                        });

                        if (!children.length) {
                            children.push(h('option', { value: '', disabled: true }, t('template_prop_empty', 'No matching fields on this collection')));
                        }

                        return h('label', {
                            key: binding.handle,
                            class: 'flex flex-col gap-1 mb-3',
                        }, [
                            h('span', { class: 'text-xs font-medium' }, headline(binding)),
                            h('select', {
                                class: SELECT_CLASS,
                                value: current,
                                disabled: !!props.readOnly,
                                onChange: function (event) {
                                    setHandle(binding.handle, event.target.value);
                                },
                            }, children),
                        ]);
                    });

                    if (!rows.length) {
                        return h('p', { class: 'text-xs text-gray-500' }, t('template_prop_empty', 'No matching fields on this collection'));
                    }

                    return h('div', rows);
                };
            },
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            Statamic.booted(register);
        });
    } else if (window.Statamic) {
        Statamic.booted(register);
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            Statamic.booted(register);
        });
    }
})();
