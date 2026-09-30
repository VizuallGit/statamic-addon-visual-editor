/**
 * Column span fieldtype — pladsen vælges på en stribe, ikke i en liste.
 *
 * Striben er gitteret set oppefra: tolv felter, og man klikker (eller trækker)
 * derhen hvor blokken skal ligge. Det er den samme håndbevægelse som i Live
 * Preview, hvor man trækker i blokkens kant — feltet og preview'et er to steder
 * at gøre det samme, ikke to forskellige måder at tænke bredde på.
 *
 * To gestusser, og forskellen er om man flytter sig:
 *
 *   Klik på en celle  → bredden. Blokken flyder som før: den lægger sig hvor
 *                       rækken er nået til, og fylder så mange kolonner.
 *   Træk hen over      → pladsen. Blokken begynder hvor trækket begyndte og
 *   flere celler         slutter hvor det sluttede, og holder dermed op med at
 *                        flyde.
 *
 * Det er den anden der gør overlap mulig: to blokke der begge har fået at vide
 * hvor de begynder, kan begynde samme sted. Så længe ingen har trukket et
 * interval, opfører feltet sig præcis som dengang det kun kunne bredde — og
 * gamle værdier er tal, ikke intervaller, netop derfor.
 *
 * Tom værdi er "Auto": sektionens egen CSS bestemmer. Det er en værdi man skal
 * kunne komme tilbage til, derfor krydset — ellers ville første klik på striben
 * være en dør der lukkede bag én.
 *
 * Farverne er `currentColor` med gennemsigtighed. Striben ligger i en almindelig
 * publish-formular, og den skal se rigtig ud i både lyst og mørkt tema uden at
 * kende noget til hvilket af dem der er tændt.
 */
(function () {
    'use strict';

    Statamic.booting(() => {
        const { ref, computed, onUnmounted } = window.Vue;

        Statamic.$components.register('column-span-fieldtype', {
            props: {
                value: { default: null },
                meta: { type: Object, default: () => ({}) },
                config: { type: Object, default: () => ({}) },
                handle: { type: String, default: '' },
                readOnly: { type: Boolean, default: false },
            },
            emits: ['update:value', 'focus', 'blur'],

            setup(props, { emit }) {
                const columns = computed(() => {
                    const n = Number(props.meta?.columns ?? props.config?.columns ?? 12);

                    return Number.isFinite(n) && n > 0 ? Math.round(n) : 12;
                });

                const min = computed(() => {
                    const n = Number(props.meta?.min ?? props.config?.min ?? 1);

                    return Number.isFinite(n) && n > 0 ? Math.min(Math.round(n), columns.value) : 1;
                });

                /**
                 * Værdien, uanset hvilken af de to former den har.
                 *
                 * Et tal er en bredde uden mening om hvor den ligger — sådan så
                 * feltet ud før startkolonnen fandtes, og sådan ser hver eneste
                 * gemt værdi fra dengang stadig ud.
                 */
                const placement = computed(() => {
                    const raw = props.value;

                    if (raw === null || raw === undefined || raw === '') {
                        return null;
                    }

                    const source = typeof raw === 'object' ? raw : { span: raw, start: null };
                    const span = Number(source.span ?? source.value);

                    if (!Number.isFinite(span) || span < 1) {
                        return null;
                    }

                    const start = Number(source.start);

                    return {
                        span: Math.min(Math.round(span), columns.value),
                        start: Number.isFinite(start) && start > 0 ? Math.min(Math.round(start), columns.value) : null,
                    };
                });

                // Under et træk viser striben det man er på vej til, ikke det der
                // står gemt. Ellers halter den en håndbevægelse bagefter.
                const hover = ref(null);
                const shown = computed(() => hover.value ?? placement.value);

                const pct = computed(() =>
                    shown.value === null ? null : Math.round((shown.value.span / columns.value) * 1000) / 10
                );

                /** Første og sidste tændte celle. Uden start ligger blokken forrest. */
                const range = computed(() => {
                    if (shown.value === null) {
                        return null;
                    }

                    const from = shown.value.start ?? 1;

                    return { from, to: from + shown.value.span - 1 };
                });

                const cells = computed(() => {
                    const on = range.value;

                    return Array.from({ length: columns.value }, (_, i) => ({
                        n: i + 1,
                        on: on !== null && i + 1 >= on.from && i + 1 <= on.to,
                    }));
                });

                const clamp = (n) => Math.max(1, Math.min(columns.value, n));

                /** Hvilken kolonne peger musen på — målt på striben, ikke på cellen
                 *  under markøren, så et træk hen over kanten også tæller med. */
                const columnAt = (event, el) => {
                    const rect = el.getBoundingClientRect();

                    if (rect.width <= 0) {
                        return 1;
                    }

                    const ratio = (event.clientX - rect.left) / rect.width;

                    return clamp(Math.ceil(ratio * columns.value));
                };

                const write = (next) => {
                    if (props.readOnly) {
                        return;
                    }

                    // Uden start gemmes bare tallet, så en bredde bliver ved med at
                    // se ud i YAML'en som en bredde altid har gjort.
                    emit('update:value', next === null ? null : next.start === null ? next.span : { ...next });
                };

                // Trækket lever på window: slipper man uden for striben, skal
                // værdien stadig sætte sig, og striben skal holde op med at følge
                // musen.
                let track = null;
                const dragging = ref(false);

                const stopDrag = () => {
                    dragging.value = false;
                    hover.value = null;

                    if (track) {
                        window.removeEventListener('pointermove', track.move, true);
                        window.removeEventListener('pointerup', track.up, true);
                        track = null;
                    }
                };

                const onMove = (event) => {
                    if (props.readOnly || dragging.value) {
                        return;
                    }

                    hover.value = { span: Math.max(min.value, columnAt(event, event.currentTarget)), start: null };
                };

                const onLeave = () => {
                    if (!dragging.value) {
                        hover.value = null;
                    }
                };

                const onDown = (event) => {
                    if (props.readOnly || event.button !== 0) {
                        return;
                    }

                    const bar = event.currentTarget;
                    const anchor = columnAt(event, bar);

                    event.preventDefault();
                    dragging.value = true;

                    // Blev der ikke trukket, var det et klik: en bredde, uden
                    // mening om hvor den ligger. Skrevet med det samme, så striben
                    // svarer på det første tryk og ikke først når man slipper.
                    const asWidth = { span: Math.max(min.value, anchor), start: null };

                    hover.value = asWidth;
                    write(asWidth);

                    const move = (e) => {
                        const to = columnAt(e, bar);

                        // Tilbage på udgangscellen er det et klik igen — ikke et
                        // interval på én kolonne. Ellers kunne en hånd der ryster
                        // en anelse gøre en bredde til en fast plads.
                        const next =
                            to === anchor
                                ? asWidth
                                : { start: Math.min(anchor, to), span: Math.abs(to - anchor) + 1 };

                        if (
                            next.span !== hover.value?.span ||
                            next.start !== hover.value?.start
                        ) {
                            hover.value = next;
                            write(next);
                        }
                    };

                    const up = () => stopDrag();

                    track = { move, up };
                    window.addEventListener('pointermove', move, true);
                    window.addEventListener('pointerup', up, true);
                };

                const clear = () => write(null);

                onUnmounted(stopDrag);

                return { columns, placement, shown, range, pct, cells, onMove, onLeave, onDown, clear };
            },

            template: `
                <div class="column-span-fieldtype" style="display:flex;align-items:center;gap:0.75em;">
                    <div
                        class="column-span-bar"
                        :style="{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(' + columns + ', 1fr)',
                            gap: '0.125em',
                            flex: '1 1 auto',
                            height: '1.75em',
                            padding: '0.1875em',
                            borderRadius: '0.375em',
                            border: '1px solid color-mix(in srgb, currentColor 18%, transparent)',
                            background: 'color-mix(in srgb, currentColor 4%, transparent)',
                            cursor: readOnly ? 'default' : 'ew-resize',
                            touchAction: 'none',
                        }"
                        @pointermove="onMove"
                        @pointerleave="onLeave"
                        @pointerdown="onDown"
                    >
                        <span
                            v-for="cell in cells"
                            :key="cell.n"
                            :style="{
                                borderRadius: '0.1875em',
                                background: cell.on
                                    ? 'color-mix(in srgb, currentColor 70%, transparent)'
                                    : 'color-mix(in srgb, currentColor 10%, transparent)',
                                transition: 'background .08s linear',
                            }"
                        ></span>
                    </div>

                    <div style="display:flex;align-items:center;gap:0.375em;min-width:7.5em;justify-content:flex-end;">
                        <span style="font-size:0.75em;font-variant-numeric:tabular-nums;opacity:.7;white-space:nowrap;">
                            <template v-if="shown === null">Auto</template>
                            <template v-else-if="shown.start === null">{{ shown.span }}/{{ columns }} · {{ pct }}%</template>
                            <template v-else>{{ range.from }}–{{ range.to }} · {{ shown.span }}/{{ columns }}</template>
                        </span>
                        <button
                            v-if="placement !== null && !readOnly"
                            type="button"
                            title="Auto"
                            style="display:flex;align-items:center;justify-content:center;width:1.25em;height:1.25em;line-height:1;border-radius:0.25em;opacity:.5;cursor:pointer;"
                            @click="clear"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="width:0.75em;height:0.75em;">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>
            `,
        });
    });
})();
