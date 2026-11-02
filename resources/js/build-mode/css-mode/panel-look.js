/**
 * What Style has with the CSS mode demo on, in either mode: the looks of a field's
 * reset (BuildFieldReset.vue), and a fade under the panel's sticky top once
 * something has scrolled under it.
 *
 * Owner: Build mode, the CSS mode demo (resources/js/build-mode/css-mode/).
 * May import: nothing. Bus messages: none.
 *
 * A sheet of its own rather than a component's: a lazy chunk's CSS file is fetched
 * from the wrong address, and with the flag off none of this is in the page.
 */

const STYLE_ID = '__sve-style-panel-look';
const SCROLLED = 'data-sve-scrolled';

const LOOK = `
.sve-field-reset {
  all: unset;
  box-sizing: border-box;
  flex: none;
  display: grid;
  place-items: center;
  width: 1.125rem;
  height: 1.125rem;
  margin-inline-end: 0.125rem;
  border-radius: 0.2rem;
  color: var(--bm-faint);
  cursor: pointer;
  opacity: 0;
}
/* The data icon's visible height and line: this glyph fills less of its box than that one does. */
.sve-build .sve-field-reset svg { width: 0.9375rem; height: 0.9375rem; stroke-width: 1.5; }
:is(.fg-field, .fg-color, .bm-spx):hover .sve-field-reset, .sve-field-reset:focus-visible { opacity: 0.8; }
.sve-field-reset:hover, .sve-field-reset:focus-visible { background: var(--bm-bg); color: var(--bm-ink); opacity: 1 !important; }

.sve-alpha { flex: none; display: inline-flex; align-items: center; gap: 0.0625rem; padding-inline-end: 0.375rem; color: var(--bm-faint); font-size: 0.6875rem; }
.sve-alpha input { all: unset; box-sizing: border-box; width: 1.625rem; text-align: right; color: var(--bm-ink); font: inherit; cursor: text; }
.sve-alpha input::placeholder { color: var(--bm-faint); opacity: 0.7; }
.sve-alpha input:focus { color: var(--bm-ink); box-shadow: 0 1px 0 var(--bm-accent); }
.sve-alpha.inh input { color: var(--bm-faint); }

/* In Spacing's box it stands inside its side's field, at the left, as the data icon does at the right. */
.bm-spx .sve-field-reset { position: absolute; z-index: 3; margin: 0; }
.sve-build .bm-spx .sve-field-reset { width: 1.125rem; height: 1.125rem; transform: none; }
.sve-build .bm-spx .sve-field-reset.bm-sp-t { top: calc(7% + 0.1875rem); bottom: auto; right: auto; left: calc(50% - 2.375rem + 0.1875rem); }
.sve-build .bm-spx .sve-field-reset.bm-sp-b { top: auto; bottom: calc(7% + 0.1875rem); right: auto; left: calc(50% - 2.375rem + 0.1875rem); }
.sve-build .bm-spx .sve-field-reset.bm-sp-l { top: calc(50% - 0.5625rem); bottom: auto; right: auto; left: calc(26.5% - 4.75rem + 0.1875rem); }
.sve-build .bm-spx .sve-field-reset.bm-sp-r { top: calc(50% - 0.5625rem); bottom: auto; left: auto; right: calc(1.5% + 4.75rem - 1.3125rem); }
.bm-spx .bm-vin:has(~ .sve-field-reset) { box-sizing: border-box; padding-inline: 1.375rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* The fields fade out under the sticky top, once there is something under it. */
.sve-build .fg-top::after {
  content: "";
  position: absolute;
  inset-inline: 0;
  top: 100%;
  height: 1.5rem;
  background: linear-gradient(var(--bm-panel), transparent);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
}
.sve-build .fg-top[${SCROLLED}]::after { opacity: 1; }
`;

export function startPanelLook(doc) {
  if (doc.getElementById(STYLE_ID)) {
    return;
  }

  const style = doc.createElement('style');

  style.id = STYLE_ID;
  style.textContent = LOOK;
  doc.head.append(style);

  // Scroll does not bubble, and Style's scroller is the panel's or the CSS mode's wrapper.
  doc.addEventListener('scroll', (event) => {
    const box = event.target;

    if (box?.matches?.('.bm-scroll, [data-sve-style-css]')) {
      box.querySelector('.fg-top')?.toggleAttribute(SCROLLED, box.scrollTop > 0);
    }
  }, true);
}
