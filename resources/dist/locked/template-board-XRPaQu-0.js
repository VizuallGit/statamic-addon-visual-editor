import{t as b,z as y}from"./addon-DsVQQRYi.js";import"./protocol-Brvy2KuB.js";import"./ai-text-icon-B7vA1keB.js";const n="sve-template-board",h="__sve-template-board-style",p="__sve-template-board-menu";function k(e,t){const a=t.filter(r=>r.kind==="site"),o=t.filter(r=>r.kind!=="site");return[{id:"site",title:b(e,"template_board_group_site"),rows:a},...o.map(r=>({id:r.handle,title:r.title,rows:[r]}))]}const x=`
#${n} { --sve-tb-card: 10.25rem; --sve-tb-line: 1px solid var(--c-border, rgba(127,127,127,.2)); }
#${n} [data-sve-tb-board] { display: flex; align-items: stretch; min-height: 24rem; }
#${n} [data-sve-tb-col] {
  display: flex; flex-direction: column; flex: 0 0 auto;
  width: calc(var(--sve-tb-card) + 3.25rem);
  border-right: var(--sve-tb-line);
}
#${n} [data-sve-tb-col]:last-child { border-right: 0; }

/* The header band across the tops of the columns. */
#${n} [data-sve-tb-head] {
  display: flex; align-items: center; gap: .4375rem;
  height: 2.875rem; padding: 0 1.125rem; line-height: 1;
  background: var(--c-bg-secondary, rgba(127,127,127,.07));
  border-right: var(--sve-tb-line);
}
#${n} [data-sve-tb-col]:last-child [data-sve-tb-head] { border-right: 0; }
#${n} [data-sve-tb-title] { font-size: .9375rem; white-space: nowrap; }
#${n} [data-sve-tb-add] {
  display: inline-flex; align-items: center; justify-content: center;
  width: 1.375em; height: 1.375em; line-height: 1;
  font-size: 1em; border: 0; border-radius: .25rem;
  background: none; color: inherit; opacity: .6; cursor: pointer;
}
#${n} [data-sve-tb-add]:hover { opacity: 1; background: rgba(127,127,127,.2); }

#${n} [data-sve-tb-stack] { display: flex; flex-direction: column; gap: 1.5rem; padding: 1.5rem 1.125rem; }

/* A card: the thumbnail, with its name under it. */
#${n} [data-sve-tb-card] {
  display: block; width: var(--sve-tb-card);
  padding: 0; border: 0; background: none; color: inherit;
  font: inherit; text-align: left; cursor: pointer;
}
#${n} [data-sve-tb-shot] {
  display: block; height: 12.5rem; border-radius: .25rem;
  background-color: rgba(127,127,127,.08);
  background-image: repeating-linear-gradient(-45deg, rgba(127,127,127,.1) 0 .625rem, transparent .625rem 1.25rem);
}
#${n} [data-sve-tb-card]:hover [data-sve-tb-shot] { outline: 1px solid currentColor; }
#${n} [data-sve-tb-label] { display: block; margin-top: .625rem; font-size: .8125rem; font-weight: 600; line-height: 1.3; }
#${n} [data-sve-tb-note] { display: block; font-size: .75rem; opacity: .45; line-height: 1.3; }
#${n} [data-sve-tb-card][data-broken] [data-sve-tb-shot] { outline: 1px solid var(--c-danger, #dc2626); }
#${n} [data-sve-tb-card][data-broken] [data-sve-tb-note] { color: var(--c-danger, #dc2626); opacity: 1; }

/* An empty column says so once, in the space a card would take. */
#${n} [data-sve-tb-none] {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .875rem;
  width: var(--sve-tb-card); height: 12.5rem; padding: 1rem;
  border: var(--sve-tb-line); border-radius: .25rem;
  text-align: center; font-size: .8125rem; line-height: 1.45; opacity: .7;
}
#${n} [data-sve-tb-busy] { opacity: .45; pointer-events: none; }

/* The add menu is appended to <body>: a panel's stacking context traps it. */
#${p} {
  position: fixed; z-index: 99999; min-width: 12rem; max-height: 20rem; overflow-y: auto; padding: .3125rem;
  border: 1px solid var(--c-border, rgba(127,127,127,.3)); border-radius: .5rem;
  background: var(--c-bg, #262626); box-shadow: 0 .5rem 1.5rem rgba(0,0,0,.4);
}
#${p} button {
  display: block; width: 100%; padding: .4375rem .625rem; font-size: .875rem; line-height: 1.25;
  border: 0; border-radius: .3125rem; background: none;
  color: var(--c-text, inherit); font: inherit; text-align: left; cursor: pointer;
}
#${p} button:hover { background: rgba(127,127,127,.22); }
`;function _(e){if(e.document.getElementById(h))return;const t=e.document.createElement("style");t.id=h,t.textContent=x,e.document.head.appendChild(t)}function i(e,t,a={},o=""){const r=e.document.createElement(t);for(const[d,s]of Object.entries(a))s===null||s===!1||r.setAttribute(d,s===!0?"":String(s));return o&&(r.textContent=o),r}const $=(e,t)=>b(e,`template_board_slot_${t}`);function v(e,t,a){return $(e,a.slot)}function u(e){e.document.getElementById(p)?.remove()}function m(e,t,a){if(u(e),!a.length)return;const o=i(e,"div",{id:p}),r=t.getBoundingClientRect();o.style.left=`${Math.round(r.left)}px`,o.style.top=`${Math.round(r.bottom+4)}px`;for(const{row:s,card:l}of a){const c=i(e,"button",{type:"button"},v(e,s,l));c.addEventListener("click",()=>{u(e),f(e,s,l,t)}),o.appendChild(c)}e.document.body.appendChild(o);const d=s=>{!o.contains(s.target)&&s.target!==t&&(u(e),e.removeEventListener("pointerdown",d,!0))};e.addEventListener("pointerdown",d,!0)}function C(e,t,a){const o=i(e,"button",{type:"button","data-sve-tb-card":"","data-slot":a.slot,"data-broken":a.broken?"":null,title:a.file||a.view});return o.appendChild(i(e,"span",{"data-sve-tb-shot":""})),o.appendChild(i(e,"span",{"data-sve-tb-label":""},v(e,t,a))),a.broken?o.appendChild(i(e,"span",{"data-sve-tb-note":""},b(e,"template_board_broken"))):a.shared&&(o.appendChild(i(e,"span",{"data-sve-tb-note":""},b(e,"template_board_shared_short"))),o.title=b(e,"template_board_shared")),o.addEventListener("click",()=>{a.broken||f(e,t,a,o)}),o}async function f(e,t,a,o){if(a.edit){e.location.href=a.edit;return}o?.setAttribute("data-sve-tb-busy","");try{const r=await e.fetch("/!/sve/template-board",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":y(e),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({handle:t.handle,slot:a.slot})}),d=await r.json().catch(()=>({}));if(!r.ok||!d.ok||!d.edit){o?.removeAttribute("data-sve-tb-busy"),e.Statamic?.$toast?.error(d.view||a.view);return}e.location.href=d.edit}catch(r){o?.removeAttribute("data-sve-tb-busy"),console.error("[sve] open template",r)}}function E(e,t){const a=i(e,"section",{"data-sve-tb-col":"","data-group":t.id}),o=i(e,"header",{"data-sve-tb-head":""});o.appendChild(i(e,"span",{"data-sve-tb-title":""},t.title));const r=[],d=[];for(const l of t.rows)for(const c of l.cards)(c.exists||c.broken?r:d).push({row:l,card:c});if(d.length){const l=i(e,"button",{type:"button","data-sve-tb-add":"",title:b(e,"template_board_create")},"+");l.addEventListener("click",c=>{c.stopPropagation(),m(e,l,d)}),o.appendChild(l)}a.appendChild(o);const s=i(e,"div",{"data-sve-tb-stack":""});for(const{row:l,card:c}of r)s.appendChild(C(e,l,c));if(!r.length){const l=i(e,"div",{"data-sve-tb-none":""});l.appendChild(i(e,"span",{},b(e,"template_board_none")));const c=i(e,"button",{type:"button","data-sve-tb-add":"",title:b(e,"template_board_create")},"+");c.addEventListener("click",g=>{g.stopPropagation(),m(e,c,d)}),l.appendChild(c),s.appendChild(l)}return a.appendChild(s),a}async function L(e,t){if(!t)return;const a=await e.fetch("/!/sve/template-board",{headers:{"X-Requested-With":"XMLHttpRequest"}});if(!a.ok)return;const o=await a.json().catch(()=>null),r=Array.isArray(o?.rows)?o.rows:[];if(!e.document.contains(t))return;t.textContent="";const d=i(e,"div",{"data-sve-tb-board":""});for(const s of k(e,r))d.appendChild(E(e,s));t.appendChild(d)}function z(e=window){const t=e.document.getElementById(n);if(!t){u(e);return}t.dataset.svePainted!=="1"&&(t.dataset.svePainted="1",_(e),L(e,t))}export{z as syncTemplateBoard};
