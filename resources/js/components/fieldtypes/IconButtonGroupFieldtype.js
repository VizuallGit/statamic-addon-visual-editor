/**
 * Icon button group fieldtype — Statamics knapgruppe, hvor knappen må være et ikon.
 *
 * Den bygger på præcis de samme dele som `button_group` gør: `FieldtypeMixin`
 * fra kernen, og `Button` + `ButtonGroup` fra UI-kittet. Derfor arver den også
 * alt det man ellers skulle skrive igen — `update()`, `isReadOnly`, feltets navn
 * inde i en replicator, felt-handlinger og forhåndsvisningen i et sæt.
 *
 * Knappen vælger selv sin form: er der et ikon, tegnes det alene og labelen
 * bliver tooltip; er der ikke, står ordet der. Det er den samme regel som PHP
 * beskriver, og den betyder at et felt kan have ikoner på nogle muligheder og
 * ord på andre uden at nogen skal indstille noget.
 *
 * Statamic-navne går til `Button`s `icon`. Iconify (`mdi:pin`) tegnes fra
 * `icon_html` som PHP har hentet — Statamics Icon kender ikke det navn.
 */
(function () {
    'use strict';

    Statamic.booting(() => {
        const ui = window.__STATAMIC__?.ui;
        const FieldtypeMixin = window.__STATAMIC__?.core?.FieldtypeMixin;

        if (!ui?.Button || !ui?.ButtonGroup || !FieldtypeMixin) {
            console.warn('[icon-button-group] Statamic UI mangler — fieldtype ikke registreret');
            return;
        }

        Statamic.$components.register('icon-button-group-fieldtype', {
            mixins: [FieldtypeMixin],

            components: {
                Button: ui.Button,
                ButtonGroup: ui.ButtonGroup,
            },

            computed: {
                /**
                 * Muligheder kommer fra `preload()`, ikke fra config: PHP har
                 * allerede læst de tre skrivemåder og kender labelen.
                 */
                options() {
                    return this.meta?.options ?? [];
                },

                showLabels() {
                    return Boolean(this.config.show_labels);
                },

                /** Teksten der står på blokken, når sættet er klappet sammen. */
                replicatorPreview() {
                    if (!this.showFieldPreviews) {
                        return;
                    }

                    const option = this.options.find((o) => o.value === this.value);

                    return option ? option.label || option.value : this.value;
                },
            },

            methods: {
                /** Et klik på den valgte knap fravælger den, hvis feltet må ryddes. */
                updateSelectedOption(value) {
                    this.update(this.value == value && this.config.clearable ? null : value);
                },

                label(option) {
                    return option.label || option.value;
                },

                text(option) {
                    return !option.icon || this.showLabels ? this.label(option) : null;
                },

                /** Iconify tegnes i slottet; Statamic-navne går til `icon`. */
                statamicIcon(option) {
                    return option.icon_html ? null : option.icon || null;
                },

                focus() {
                    this.$refs.button?.[0]?.focus();
                },
            },

            template: `
                <ButtonGroup overflow="stack" ref="buttonGroup">
                    <Button
                        v-for="option in options"
                        ref="button"
                        :key="option.value"
                        :aria-label="label(option)"
                        :disabled="config.disabled"
                        :icon="statamicIcon(option)"
                        :icon-only="!!option.icon && !showLabels"
                        :name="name"
                        :read-only="isReadOnly"
                        :text="text(option)"
                        :title="label(option)"
                        :value="option.value"
                        :variant="value == option.value ? 'pressed' : 'default'"
                        @click="updateSelectedOption(option.value)"
                    >
                        <span
                            v-if="option.icon_html"
                            data-sve-ibg-iconify
                            v-html="option.icon_html"
                        />
                    </Button>
                </ButtonGroup>
            `,
        });
    });
})();
