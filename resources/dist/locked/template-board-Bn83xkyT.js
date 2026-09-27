import{t as p,z as x}from"./addon-Dp46AvRO.js";import"./protocol-Brvy2KuB.js";import"./ai-text-icon-B7vA1keB.js";const r="sve-template-board",m="__sve-template-board-style",u="__sve-template-board-menu",_=[{id:"site",label:"template_board_group_site",kinds:["site"]},{id:"collections",label:"template_board_group_collections",kinds:["collection"]},{id:"taxonomies",label:"template_board_group_taxonomies",kinds:["taxonomy"]}],$=`
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

/* The add menu is appended to <body>: a panel's stacking context traps it. */
#${u} {
  position: fixed; z-index: 99999; min-width: 12rem; max-height: 20rem; overflow-y: auto; padding: .3125rem;
  border: 1px solid var(--c-border, rgba(127,127,127,.3)); border-radius: .5rem;
  background: var(--c-bg, #262626); box-shadow: 0 .5rem 1.5rem rgba(0,0,0,.4);
}
#${u} button {
  display: block; width: 100%; padding: .5rem .625rem; line-height: 1.2;
  border: 0; border-radius: .3125rem; background: none;
  color: var(--c-text, inherit); font: inherit; text-align: left; cursor: pointer;
}
#${u} button:hover { background: rgba(127,127,127,.22); }
`;function C(e){if(e.document.getElementById(m))return;const t=e.document.createElement("style");t.id=m,t.textContent=$,e.document.head.appendChild(t)}function i(e,t,o={},a=""){const d=e.document.createElement(t);for(const[s,n]of Object.entries(o))n===null||n===!1||d.setAttribute(s,n===!0?"":String(n));return a&&(d.textContent=a),d}const v=(e,t)=>p(e,`template_board_slot_${t}`);function f(e,t,o){return t.kind==="site"?v(e,o.slot):`${t.title} ${v(e,o.slot)}`}function h(e){e.document.getElementById(u)?.remove()}function g(e,t,o){if(h(e),!o.length)return;const a=i(e,"div",{id:u}),d=t.getBoundingClientRect();a.style.left=`${Math.round(d.left)}px`,a.style.top=`${Math.round(d.bottom+4)}px`;for(const{row:n,card:b}of o){const l=i(e,"button",{type:"button"},f(e,n,b));l.addEventListener("click",()=>{h(e),y(e,n,b,t)}),a.appendChild(l)}e.document.body.appendChild(a);const s=n=>{!a.contains(n.target)&&n.target!==t&&(h(e),e.removeEventListener("pointerdown",s,!0))};e.addEventListener("pointerdown",s,!0)}function E(e,t,o){const a=i(e,"button",{type:"button","data-sve-tb-card":"","data-slot":o.slot,"data-broken":o.broken?"":null,title:o.file||o.view});return a.appendChild(i(e,"span",{"data-sve-tb-shot":""})),a.appendChild(i(e,"span",{"data-sve-tb-label":""},f(e,t,o))),o.broken?a.appendChild(i(e,"span",{"data-sve-tb-note":""},p(e,"template_board_broken"))):o.shared&&(a.appendChild(i(e,"span",{"data-sve-tb-note":""},p(e,"template_board_shared_short"))),a.title=p(e,"template_board_shared")),a.addEventListener("click",()=>{o.broken||y(e,t,o,a)}),a}async function y(e,t,o,a){if(o.edit){e.location.href=o.edit;return}a?.setAttribute("data-sve-tb-busy","");try{const d=await e.fetch("/!/sve/template-board",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":x(e),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({handle:t.handle,slot:o.slot})}),s=await d.json().catch(()=>({}));if(!d.ok||!s.ok||!s.edit){a?.removeAttribute("data-sve-tb-busy"),e.Statamic?.$toast?.error(s.view||o.view);return}e.location.href=s.edit}catch(d){a?.removeAttribute("data-sve-tb-busy"),console.error("[sve] open template",d)}}function L(e,t,o){const a=i(e,"section",{"data-sve-tb-col":"","data-group":t.id}),d=i(e,"header",{"data-sve-tb-head":""});d.appendChild(i(e,"span",{"data-sve-tb-title":""},p(e,t.label)));const s=[],n=[];for(const l of o)for(const c of l.cards)(c.exists||c.broken?s:n).push({row:l,card:c});if(n.length){const l=i(e,"button",{type:"button","data-sve-tb-add":"",title:p(e,"template_board_create")},"+");l.addEventListener("click",c=>{c.stopPropagation(),g(e,l,n)}),d.appendChild(l)}a.appendChild(d);const b=i(e,"div",{"data-sve-tb-stack":""});for(const{row:l,card:c}of s)b.appendChild(E(e,l,c));if(!s.length){const l=i(e,"div",{"data-sve-tb-none":""});l.appendChild(i(e,"span",{},p(e,"template_board_none")));const c=i(e,"button",{type:"button","data-sve-tb-add":"",title:p(e,"template_board_create")},"+");c.addEventListener("click",k=>{k.stopPropagation(),g(e,c,n)}),l.appendChild(c),b.appendChild(l)}return a.appendChild(b),a}async function S(e,t){if(!t)return;const o=await e.fetch("/!/sve/template-board",{headers:{"X-Requested-With":"XMLHttpRequest"}});if(!o.ok)return;const a=await o.json().catch(()=>null),d=Array.isArray(a?.rows)?a.rows:[];if(!e.document.contains(t))return;t.textContent="";const s=i(e,"div",{"data-sve-tb-board":""});for(const n of _)s.appendChild(L(e,n,d.filter(b=>n.kinds.includes(b.kind))));t.appendChild(s)}function z(e=window){const t=e.document.getElementById(r);if(!t){h(e);return}t.dataset.svePainted!=="1"&&(t.dataset.svePainted="1",C(e),S(e,t))}export{z as syncTemplateBoard};
