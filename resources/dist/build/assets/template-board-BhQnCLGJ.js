import{t as b,z as $}from"./addon-B_Eb9emz.js";import"./protocol-Brvy2KuB.js";import"./ai-text-icon-Clt22q9g.js";const r="sve-template-board",h="__sve-template-board-style",p="__sve-template-board-menu",f=new WeakMap;function C(e,t){const a=n=>t.filter(s=>s.kind===n),o=n=>({id:n.handle,kind:b(e,`template_board_kind_${n.kind}`),title:n.title,rows:[n]}),d=a("taxonomy");return[{id:"site",title:b(e,"template_board_group_site"),rows:a("site")},...a("collection").map(o),...d.length?d.map(o):[{id:"_taxonomies",title:b(e,"template_board_group_taxonomies"),rows:[]}]]}const E=`
#${r} { --sve-tb-card: 10.25rem; --sve-tb-line: 1px solid var(--c-border, rgba(127,127,127,.2)); }
#${r} [data-sve-tb-board] { display: flex; align-items: stretch; min-height: 24rem; }
#${r} [data-sve-tb-col] {
  display: flex; flex-direction: column; flex: 0 0 auto;
  width: calc(var(--sve-tb-card) + 3.25rem);
  border-right: var(--sve-tb-line);
}
#${r} [data-sve-tb-col]:last-child { border-right: 0; }

/* The header band across the tops of the columns. */
#${r} [data-sve-tb-head] {
  display: flex; align-items: center; gap: .4375rem;
  height: 2.875rem; padding: 0 1.125rem; line-height: 1;
  background: var(--c-bg-secondary, rgba(127,127,127,.07));
  border-right: var(--sve-tb-line);
}
#${r} [data-sve-tb-col]:last-child [data-sve-tb-head] { border-right: 0; }
#${r} [data-sve-tb-title] { font-size: .9375rem; white-space: nowrap; }
/* What kind of thing the column is, said once, ahead of its name. */
#${r} [data-sve-tb-kind] { font-size: .9375rem; opacity: .45; white-space: nowrap; }
#${r} [data-sve-tb-add] {
  display: inline-flex; align-items: center; justify-content: center;
  width: 1.375em; height: 1.375em; line-height: 1;
  font-size: 1em; border: 0; border-radius: .25rem;
  background: none; color: inherit; opacity: .6; cursor: pointer;
}
#${r} [data-sve-tb-add]:hover { opacity: 1; background: rgba(127,127,127,.2); }

#${r} [data-sve-tb-stack] { display: flex; flex-direction: column; gap: 1.5rem; padding: 1.5rem 1.125rem; }

/* A card: the thumbnail, with its name under it. */
#${r} [data-sve-tb-card] {
  display: block; width: var(--sve-tb-card);
  padding: 0; border: 0; background: none; color: inherit;
  font: inherit; text-align: left; cursor: pointer;
}
#${r} [data-sve-tb-shot] {
  display: block; height: 12.5rem; border-radius: .25rem;
  background-color: rgba(127,127,127,.08);
  background-image: repeating-linear-gradient(-45deg, rgba(127,127,127,.1) 0 .625rem, transparent .625rem 1.25rem);
}
#${r} [data-sve-tb-card]:hover [data-sve-tb-shot] { outline: 1px solid currentColor; }
#${r} [data-sve-tb-label] { display: block; margin-top: .625rem; font-size: .8125rem; font-weight: 600; line-height: 1.3; }
#${r} [data-sve-tb-note] { display: block; font-size: .75rem; opacity: .45; line-height: 1.3; }
#${r} [data-sve-tb-card][data-broken] [data-sve-tb-shot] { outline: 1px solid var(--c-danger, #dc2626); }
#${r} [data-sve-tb-card][data-broken] [data-sve-tb-note] { color: var(--c-danger, #dc2626); opacity: 1; }

/* An empty column says so once, in the space a card would take. */
#${r} [data-sve-tb-none] {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .875rem;
  width: var(--sve-tb-card); height: 12.5rem; padding: 1rem;
  border: var(--sve-tb-line); border-radius: .25rem;
  text-align: center; font-size: .8125rem; line-height: 1.45; opacity: .7;
}
#${r} [data-sve-tb-busy] { opacity: .45; pointer-events: none; }

/* The add menu is appended to <body>: a panel's stacking context traps it.
   Above the Live Preview drawer the board can also be opened in (2147483600). */
#${p} {
  position: fixed; z-index: 2147483601; min-width: 12rem; max-height: 20rem; overflow-y: auto; padding: .3125rem;
  border: 1px solid var(--c-border, rgba(127,127,127,.3)); border-radius: .5rem;
  background: var(--c-bg, #262626); box-shadow: 0 .5rem 1.5rem rgba(0,0,0,.4);
}
#${p} button {
  /* The font shorthand comes first: it resets font-size, so a size set before
     it is thrown away. That is why this menu rendered at 16px with .75rem. */
  font: inherit; font-size: .875rem; line-height: 1.3;
  display: block; width: 100%; padding: .4375rem .625rem;
  border: 0; border-radius: .3125rem; background: none;
  color: var(--c-text, inherit); text-align: left; cursor: pointer;
}
#${p} button:hover { background: rgba(127,127,127,.22); }
`;function g(e){if(e.document.getElementById(h))return;const t=e.document.createElement("style");t.id=h,t.textContent=E,e.document.head.appendChild(t)}function i(e,t,a={},o=""){const d=e.document.createElement(t);for(const[n,s]of Object.entries(a))s===null||s===!1||d.setAttribute(n,s===!0?"":String(s));return o&&(d.textContent=o),d}const T=(e,t)=>b(e,`template_board_slot_${t}`);function y(e,t,a){return T(e,a.slot)}function m(e){e.document.getElementById(p)?.remove()}function u(e,t,a){if(m(e),!a.length)return;const o=i(e,"div",{id:p}),d=t.getBoundingClientRect();o.style.left=`${Math.round(d.left)}px`,o.style.top=`${Math.round(d.bottom+4)}px`;for(const{row:s,card:l}of a){const c=i(e,"button",{type:"button"},y(e,s,l));c.addEventListener("click",()=>{m(e),k(e,s,l,t)}),o.appendChild(c)}e.document.body.appendChild(o);const n=s=>{!o.contains(s.target)&&s.target!==t&&(m(e),e.removeEventListener("pointerdown",n,!0))};e.addEventListener("pointerdown",n,!0)}function L(e,t,a){const o=i(e,"button",{type:"button","data-sve-tb-card":"","data-slot":a.slot,"data-broken":a.broken?"":null,title:a.file||a.view});return o.appendChild(i(e,"span",{"data-sve-tb-shot":""})),o.appendChild(i(e,"span",{"data-sve-tb-label":""},y(e,t,a))),a.broken?o.appendChild(i(e,"span",{"data-sve-tb-note":""},b(e,"template_board_broken"))):a.shared&&(o.appendChild(i(e,"span",{"data-sve-tb-note":""},b(e,"template_board_shared_short"))),o.title=b(e,"template_board_shared")),o.addEventListener("click",()=>{a.broken||k(e,t,a,o)}),o}function v(e,t,a){const o=f.get(t?.closest?.(`#${r}`));if(o){o(a);return}e.location.href=a}async function k(e,t,a,o){if(a.edit){v(e,o,a.edit);return}o?.setAttribute("data-sve-tb-busy","");try{const d=await e.fetch("/!/sve/template-board",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":$(e),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({handle:t.handle,slot:a.slot})}),n=await d.json().catch(()=>({}));if(!d.ok||!n.ok||!n.edit){o?.removeAttribute("data-sve-tb-busy"),e.Statamic?.$toast?.error(n.view||a.view);return}v(e,o,n.edit)}catch(d){o?.removeAttribute("data-sve-tb-busy"),console.error("[sve] open template",d)}}function z(e,t){const a=i(e,"section",{"data-sve-tb-col":"","data-group":t.id}),o=i(e,"header",{"data-sve-tb-head":""});t.kind&&o.appendChild(i(e,"span",{"data-sve-tb-kind":""},t.kind)),o.appendChild(i(e,"span",{"data-sve-tb-title":""},t.title));const d=[],n=[];for(const l of t.rows)for(const c of l.cards)(c.exists||c.broken?d:n).push({row:l,card:c});if(n.length){const l=i(e,"button",{type:"button","data-sve-tb-add":"",title:b(e,"template_board_create")},"+");l.addEventListener("click",c=>{c.stopPropagation(),u(e,l,n)}),o.appendChild(l)}a.appendChild(o);const s=i(e,"div",{"data-sve-tb-stack":""});for(const{row:l,card:c}of d)s.appendChild(L(e,l,c));if(!d.length){const l=i(e,"div",{"data-sve-tb-none":""});if(l.appendChild(i(e,"span",{},b(e,n.length?"template_board_none":"template_board_none_source"))),n.length){const c=i(e,"button",{type:"button","data-sve-tb-add":"",title:b(e,"template_board_create")},"+");c.addEventListener("click",x=>{x.stopPropagation(),u(e,c,n)}),l.appendChild(c)}s.appendChild(l)}return a.appendChild(s),a}async function _(e,t){if(!t)return;const a=await e.fetch("/!/sve/template-board",{headers:{"X-Requested-With":"XMLHttpRequest"}});if(!a.ok)return;const o=await a.json().catch(()=>null),d=Array.isArray(o?.rows)?o.rows:[];if(!e.document.contains(t))return;t.textContent="";const n=i(e,"div",{"data-sve-tb-board":""});for(const s of C(e,d))n.appendChild(z(e,s));t.appendChild(n)}function M(e=window){const t=e.document.getElementById(r);if(!t){m(e);return}t.dataset.svePainted!=="1"&&(t.dataset.svePainted="1",g(e),_(e,t))}function P(e,t,{onOpen:a}={}){return t.id=r,t.dataset.svePainted="1",a&&f.set(t,a),g(e),_(e,t)}function R(e){m(e)}export{P as mountTemplateBoard,M as syncTemplateBoard,R as unmountTemplateBoard};
