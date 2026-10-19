/**
 * Live Preview: the page's sections field, as the data.
 *
 * `sve_lite_sections` replaces the page builder's Replicator in the Live
 * Preview form. It draws nothing: the selection panel draws the selected row
 * from the form's values, and the Page Settings tab is where the column rests
 * when nothing is selected. What this field is for is being IN the form — it
 * is the one component of ours that always sits in the page's publish form,
 * so it injects the form's publish context and registers it for the panel
 * (lib/publish-containers.js), and it holds the set configs the panel resolves
 * rows against: a fieldset saved in the Fieldsets screen, or a set made a
 * minute ago, is written into `config.sets` here (refreshSetFields,
 * addSetConfig) and the panel sees it on its next paint.
 *
 * The mounting of the focused row, its neighbours, the chunked field lists,
 * the hover warm-up and the solo hand-off went with phase 2 of the selection
 * panel: no row has to mount for the panel to draw it.
 *
 * May import: lib/, cp-selectors.js (constants only). Imported by lp-cluster.js.
 */
import { mark } from '../lib/debug.js';
import { registerContainerContext, unregisterContainerContext } from '../lib/publish-containers.js';

    var liteRegistered = false;

    mark('lite-sections');

    /**
     * The fields on screen, so their set configs can be replaced when the
     * fieldset behind a section changes: the list the panel resolves rows
     * against comes from `config.sets`, handed to the form once when it was
     * built.
     */
    var livePanels = [];

    /**
     * Gives every panel the section's fields as they are now.
     *
     * `setConfigFrom` hands back the set object itself, so writing `fields` on
     * it writes into the config the panel renders from — except for its
     * not-found answer, which is a fresh `{}` that would swallow the write in
     * silence. A set that was found always carries `fields`, and that is the
     * difference being checked.
     *
     * @returns {number} panels updated
     */
    function refreshSetFields(handle, fields) {
        var updated = 0;
        var i;
        var set;

        if (!handle || !Array.isArray(fields)) {
            return 0;
        }

        for (i = 0; i < livePanels.length; i++) {
            set = setConfigFrom(livePanels[i].config, handle);

            if (!set || !set.fields) {
                continue;
            }

            set.fields = fields;
            updated++;
        }

        return updated;
    }

    /**
     * Tells every panel about a set type that did not exist when the publish
     * form was built.
     *
     * The panel renders each row from `config.sets` — the display name in the
     * header, the fields under it. A row of a set made a minute ago (the HTML
     * tree's plus) matched nothing there, so Statamic drew an empty shell:
     * no header, no fields, and so no `_visual_id` input either. `findSetByUid`
     * could not name it, every wait for it ran to the end (measured: 2.3 s
     * before the dock was even asked for the file) and the sidebar showed
     * nothing to edit. Added in the shape the config already has — grouped
     * arrays in Statamic 6, grouped or flat objects on older forms — under
     * the group the server put it in.
     *
     * @returns {number} panels updated
     */
    function addSetConfig(handle, set, group) {
        var added = 0;
        var i;
        var j;
        var config;
        var groups;
        var target;
        var entry;
        var groupKey = group || 'sections';

        if (!handle || !set || typeof set !== 'object') {
            return 0;
        }

        for (i = 0; i < livePanels.length; i++) {
            config = livePanels[i].config;
            groups = config && config.sets;

            if (!groups || setConfigFrom(config, handle).fields) {
                continue;
            }

            entry = Object.assign({ handle: handle, fields: [] }, set);

            if (Array.isArray(groups)) {
                target = null;

                for (j = 0; j < groups.length; j++) {
                    if (groups[j] && groups[j].handle === groupKey) {
                        target = groups[j];
                        break;
                    }
                }

                if (!target) {
                    target = { handle: groupKey, display: set.group_display || groupKey, sets: [] };
                    groups.push(target);
                }

                if (!Array.isArray(target.sets)) {
                    target.sets = [];
                }

                target.sets.push(entry);
            } else {
                if (!groups[groupKey] || !groups[groupKey].sets) {
                    groups[groupKey] = { display: set.group_display || groupKey, sets: {} };
                }

                if (Array.isArray(groups[groupKey].sets)) {
                    groups[groupKey].sets.push(entry);
                } else {
                    groups[groupKey].sets[handle] = entry;
                }
            }

            added++;
        }

        return added;
    }

    function setConfigFrom(config, handle) {
        var groups = (config && config.sets) || [];
        var i;
        var j;
        var sets;
        var key;
        var inner;

        if (Array.isArray(groups)) {
            for (i = 0; i < groups.length; i++) {
                sets = groups[i].sets || [];
                for (j = 0; j < sets.length; j++) {
                    if (sets[j] && sets[j].handle === handle) {
                        return sets[j];
                    }
                }
            }

            return {};
        }

        if (groups[handle] && groups[handle].fields) {
            return groups[handle];
        }

        for (key in groups) {
            if (!Object.prototype.hasOwnProperty.call(groups, key)) {
                continue;
            }

            inner = groups[key] && groups[key].sets;
            if (!inner) {
                continue;
            }

            if (inner[handle]) {
                return inner[handle];
            }

            if (Array.isArray(inner)) {
                for (i = 0; i < inner.length; i++) {
                    if (inner[i] && inner[i].handle === handle) {
                        return inner[i];
                    }
                }
            }
        }

        return {};
    }

    function liteFieldtypeOptions() {
        var Vue = window.Vue;
        var FieldtypeMixin = window.__STATAMIC__ && window.__STATAMIC__.core && window.__STATAMIC__.core.FieldtypeMixin;

        if (!window.Statamic || !Statamic.$components || !Vue || typeof Vue.h !== 'function' || !FieldtypeMixin) {
            return null;
        }

        return {
            mixins: [FieldtypeMixin],

            // The page form's whole publish context. This field always sits in
            // the form, so it is the one place of ours that can inject it; the
            // selection panel draws the selected row's fields on it.
            inject: {
                sveContainerContext: { from: 'PublishContainerContext', default: null },
            },

            created: function () {
                registerContainerContext(this.sveContainerContext);
            },

            mounted: function () {
                livePanels.push(this);
            },

            beforeUnmount: function () {
                var at = livePanels.indexOf(this);

                unregisterContainerContext(this.sveContainerContext);

                if (at !== -1) {
                    livePanels.splice(at, 1);
                }
            },

            render: function () {
                return Vue.h('div', { 'data-sve-lite': 'idle' });
            },
        };
    }

    /**
     * The real component behind the async wrapper addon.js registers at boot.
     * Statamic checks a fieldtype's existence once, at render — the deferred
     * cluster cannot win that race, so the name is registered eagerly and the
     * wrapper waits here for the prerequisites (FieldtypeMixin, Vue) to land.
     */
    function liteFieldtypeOptionsAsync() {
        return new Promise(function (resolve, reject) {
            var tries = 0;
            var tick = function () {
                var options = liteFieldtypeOptions();

                if (options) {
                    resolve(options);

                    return;
                }

                tries += 1;

                if (tries > 100) {
                    reject(new Error('sve_lite_sections prerequisites missing'));

                    return;
                }

                window.setTimeout(tick, 50);
            };

            tick();
        });
    }

    function registerLiteFieldtype() {
        if (liteRegistered) {
            return true;
        }

        // addon.js registered the name at boot as an async wrapper resolving to
        // these options — registering again would swap the component's identity
        // and remount every lite field on its next render.
        if (window.__sveLiteFieldtypeAsync) {
            liteRegistered = true;

            return true;
        }

        var options = liteFieldtypeOptions();

        if (!options) {
            return false;
        }

        Statamic.$components.register('sve_lite_sections-fieldtype', options);
        liteRegistered = true;

        return true;
    }

    function bootUntilReady() {
        if (registerLiteFieldtype()) {
            return;
        }

        var tries = 0;
        var timer = window.setInterval(function () {
            tries += 1;

            if (registerLiteFieldtype() || tries >= 60) {
                window.clearInterval(timer);
            }
        }, 50);
    }

    export { refreshSetFields as refreshLiteSetFields, addSetConfig as addLiteSetConfig, liteFieldtypeOptionsAsync };

    if (window.Statamic && typeof Statamic.booting === 'function') {
        Statamic.booting(bootUntilReady);
    }

    if (window.Statamic && typeof Statamic.configuring === 'function') {
        Statamic.configuring(bootUntilReady);
    }

    document.addEventListener('DOMContentLoaded', bootUntilReady);

    // Loaded late (addon.js defers the Live Preview cluster): booting,
    // configuring and DOMContentLoaded may all be past, and none of them fire again.
    if (document.readyState !== 'loading') {
        bootUntilReady();
    }
