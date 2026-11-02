const i="__sve-style-panel-look",r="data-sve-scrolled",l=`
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
.sve-field-reset svg { width: 0.75rem; height: 0.75rem; }
:is(.fg-field, .fg-color, .bm-spx):hover .sve-field-reset, .sve-field-reset:focus-visible { opacity: 0.8; }
.sve-field-reset:hover, .sve-field-reset:focus-visible { background: var(--bm-bg); color: var(--bm-ink); opacity: 1 !important; }

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
.sve-build .fg-top[${r}]::after { opacity: 1; }
`;function a(e){if(e.getElementById(i))return;const t=e.createElement("style");t.id=i,t.textContent=l,e.head.append(t),e.addEventListener("scroll",o=>{const s=o.target;s?.matches?.(".bm-scroll, [data-sve-style-css]")&&s.querySelector(".fg-top")?.toggleAttribute(r,s.scrollTop>0)},!0)}export{a as startPanelLook};
