import { mark } from '../lib/debug.js';

/**
 * Number beside each "From the start" checkbox.
 *
 * Own CP script — not addon.js. Re-registers only `default-sets-fieldtype`.
 *
 * Must use Vue `h()` (no `template` string): Statamic's CP Vue is runtime-only,
 * so a template here never compiles and the checkbox-only component from
 * addon.js stays on screen. Six Items is six `{ type: item }` rows.
 */
import { t } from '../lib/i18n.js';

(function () {
  'use strict';

  mark('default-sets-count');

  const MAX = 24;

  function publishValues(ctx) {
    return ctx?.values?.value ?? ctx?.values ?? {};
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
    const parsed = parseInt(n, 10);

    if (!Number.isFinite(parsed) || parsed < 1) return 1;

    return Math.min(MAX, parsed);
  }

  function register() {
    const Vue = window.Vue;

    if (!window.Statamic || !Statamic.$components || !Vue || typeof Vue.h !== 'function') {
      return;
    }

    const inject = Vue.inject;
    const computed = Vue.computed;
    const h = Vue.h;

    Statamic.$components.register('default-sets-fieldtype', {
      props: {
        value: {
          default: function () {
            return [];
          },
        },
        config: {
          type: Object,
          default: function () {
            return {};
          },
        },
      },

      emits: ['update:value'],

      setup: function (props, ctx) {
        const emit = ctx.emit;
        const publishContext = inject('PublishContainerContext', null);

        const sets = computed(function () {
          const groups = publishValues(publishContext).sets;

          if (!Array.isArray(groups)) return [];

          return groups.flatMap(function (group) {
            const groupName = group?.display || group?.handle || '';

            return (group?.sections ?? [])
              .filter(function (set) {
                return set?.handle;
              })
              .map(function (set) {
                return {
                  handle: set.handle,
                  display: set.display || set.handle,
                  group: groups.length > 1 ? groupName : null,
                };
              });
          });
        });

        const rows = computed(function () {
          return asRows(props.value);
        });

        function isChecked(handle) {
          return rows.value.some(function (row) {
            return row.type === handle;
          });
        }

        function countOf(handle) {
          const n = rows.value.filter(function (row) {
            return row.type === handle;
          }).length;

          return n > 0 ? n : 1;
        }

        function emitType(handle, count) {
          const current = rows.value;
          const first = current.findIndex(function (row) {
            return row.type === handle;
          });
          const without = current.filter(function (row) {
            return row.type !== handle;
          });

          if (count < 1) {
            emit('update:value', without);
            return;
          }

          const template = current.find(function (row) {
            return row.type === handle;
          }) || { type: handle };
          const copies = [];
          let i;

          for (i = 0; i < count; i++) {
            copies.push(Object.assign({}, template, { type: handle }));
          }

          const next = without.slice();
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
          const list = sets.value;

          if (!list.length) {
            return h(
              'p',
              { class: 'text-sm text-gray-600 dark:text-gray-400' },
              t(window, 'field_from_the_start_no_sets')
            );
          }

          return h(
            'div',
            { class: 'flex flex-col gap-2' },
            list.map(function (set) {
              const checked = isChecked(set.handle);
              const labelKids = [
                h('input', {
                  type: 'checkbox',
                  checked: checked,
                  onChange: function () {
                    toggle(set.handle);
                  },
                }),
                h('span', set.display),
              ];

              if (set.group) {
                labelKids.push(h('span', { class: 'text-xs text-gray-600 dark:text-gray-400' }, set.group));
              }

              const rowKids = [h('label', { class: 'flex items-center gap-2 cursor-pointer min-w-0' }, labelKids)];

              if (checked) {
                rowKids.push(
                  h('input', {
                    type: 'number',
                    class: 'input-text sve-from-the-start-count',
                    min: '1',
                    max: String(MAX),
                    step: '1',
                    value: countOf(set.handle),
                    onChange: function (event) {
                      setCount(set.handle, event.target.value);
                    },
                  })
                );
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
