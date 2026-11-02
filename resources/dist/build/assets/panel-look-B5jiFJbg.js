const s="__sve-style-panel-look",o="data-sve-scrolled",a=`
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

/* The fields fade out under the sticky top, once there is something under it: below its line, which stays. */
.sve-build .fg-top::after {
  content: "";
  position: absolute;
  inset-inline: 0;
  top: calc(100% + 1px);
  height: 1.5rem;
  background: linear-gradient(var(--bm-panel), transparent);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
}
.sve-build .fg-top[${o}]::after { opacity: 1; }
`;function l(e){if(e.getElementById(s))return;const t=e.createElement("style");t.id=s,t.textContent=a,e.head.append(t),e.addEventListener("scroll",r=>{const i=r.target;i?.matches?.(".bm-scroll, [data-sve-style-css]")&&i.querySelector(".fg-top")?.toggleAttribute(o,i.scrollTop>0)},!0)}export{l as startPanelLook};
