/**
 * Column span fieldtype — bredden vælges på en stribe, ikke i en liste.
 *
 * Striben er gitteret set oppefra: tolv felter, og man klikker (eller trækker)
 * derhen hvor blokken skal slutte. Det er den samme håndbevægelse som i Live
 * Preview, hvor man trækker i blokkens kant — feltet og preview'et er to steder
 * at gøre det samme, ikke to forskellige måder at tænke bredde på.
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

                const span = computed(() => {
                    const n = Number(props.value);

                    return Number.isFinite(n) && n > 0 ? Math.min(Math.round(n), columns.value) : null;
                });

                // Under et træk viser striben det man er på vej til, ikke det der
                // står gemt. Ellers halter den en håndbevægelse bagefter.
                const hover = ref(null);
                const dragging = ref(false);
                const shown = computed(() => hover.value ?? span.value);

                const pct = computed(() =>
                    shown.value === null ? null : Math.round((shown.value / columns.value) * 1000) / 10
                );

                const cells = computed(() =>
                    Array.from({ length: columns.value }, (_, i) => ({
                        n: i + 1,
                        on: shown.value !== null && i + 1 <= shown.value,
                    }))
                );

                const clamp = (n) => Math.max(min.value, Math.min(columns.value, n));

                /** Hvilken kolonne peger musen på — målt på striben, ikke på cellen
                 *  under markøren, så et træk hen over kanten også tæller med. */
                const spanAt = (event, el) => {
                    const rect = el.getBoundingClientRect();

                    if (rect.width <= 0) {
                        return min.value;
                    }

                    const ratio = (event.clientX - rect.left) / rect.width;

                    return clamp(Math.ceil(ratio * columns.value));
                };

                const write = (n) => {
                    if (props.readOnly) {
                        return;
                    }

                    emit('update:value', n);
                };

                const onMove = (event) => {
                    if (props.readOnly) {
                        return;
                    }

                    hover.value = spanAt(event, event.currentTarget);
                };

                const onLeave = () => {
                    if (!dragging.value) {
                        hover.value = null;
                    }
                };

                // Trækket lever på window: slipper man uden for striben, skal
                // værdien stadig sætte sig, og striben skal holde op med at følge
                // musen.
                let track = null;

                const stopDrag = () => {
                    dragging.value = false;
                    hover.value = null;

                    if (track) {
                        window.removeEventListener('pointermove', track.move, true);
                        window.removeEventListener('pointerup', track.up, true);
                        track = null;
                    }
                };

                const onDown = (event) => {
                    if (props.readOnly || event.button !== 0) {
                        return;
                    }

                    const bar = event.currentTarget;

                    event.preventDefault();
                    dragging.value = true;
                    hover.value = spanAt(event, bar);
                    write(hover.value);

                    const move = (e) => {
                        const next = spanAt(e, bar);

                        if (next !== hover.value) {
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

                return { columns, span, shown, pct, cells, onMove, onLeave, onDown, clear };
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

                    <div style="display:flex;align-items:center;gap:0.375em;min-width:6.5em;justify-content:flex-end;">
                        <span style="font-size:0.75em;font-variant-numeric:tabular-nums;opacity:.7;white-space:nowrap;">
                            <template v-if="shown === null">Auto</template>
                            <template v-else>{{ shown }}/{{ columns }} · {{ pct }}%</template>
                        </span>
                        <button
                            v-if="span !== null && !readOnly"
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
