import{t as l,z as b}from"./addon-Z1Sb4a6L.js";import"./protocol-Brvy2KuB.js";import"./ai-text-icon-B7vA1keB.js";const d="sve-template-board",c="__sve-template-board-style",f=`
#${d} { display: flex; flex-direction: column; gap: 1.75rem; }
#${d} [data-sve-tb-row] { display: flex; flex-direction: column; gap: .625rem; }
#${d} [data-sve-tb-head] {
  display: flex; align-items: baseline; gap: .5rem;
  padding-bottom: .375rem; border-bottom: 1px solid var(--c-border, rgba(127,127,127,.25));
}
#${d} [data-sve-tb-title] { font-weight: 600; line-height: 1; }
#${d} [data-sve-tb-kind] { font-size: .8em; opacity: .55; line-height: 1; }
#${d} [data-sve-tb-cards] {
  display: grid; gap: .75rem;
  grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
}
#${d} [data-sve-tb-card] {
  display: flex; flex-direction: column; gap: .3125rem;
  min-height: 5.5rem; padding: .75rem;
  border: 1px solid var(--c-border, rgba(127,127,127,.25));
  border-radius: .5rem;
  text-align: left; font: inherit; color: inherit; background: none;
}
#${d} [data-sve-tb-card][data-filled] { cursor: pointer; }
#${d} [data-sve-tb-card][data-filled]:hover { border-color: currentColor; }
#${d} [data-sve-tb-card][data-empty] { border-style: dashed; align-items: center; justify-content: center; }
#${d} [data-sve-tb-card][data-broken] { border-color: var(--c-danger, #dc2626); }
#${d} [data-sve-tb-slot] { font-weight: 600; line-height: 1.2; }
#${d} [data-sve-tb-file] { font-size: .8em; opacity: .6; font-family: ui-monospace, monospace; word-break: break-all; }
#${d} [data-sve-tb-note] { font-size: .8em; }
#${d} [data-sve-tb-card][data-broken] [data-sve-tb-note] { color: var(--c-danger, #dc2626); }
#${d} [data-sve-tb-busy] { opacity: .5; pointer-events: none; }
`;function u(e){if(e.document.getElementById(c))return;const a=e.document.createElement("style");a.id=c,a.textContent=f,e.document.head.appendChild(a)}function m(e,a){return l(e,`template_board_slot_${a}`)}function i(e,a,n={},t=""){const r=e.document.createElement(a);for(const[o,s]of Object.entries(n))s===null||s===!1||r.setAttribute(o,s===!0?"":String(s));return t&&(r.textContent=t),r}function v(e,a,n,t){const r=t.exists&&!t.broken,o=i(e,"button",{type:"button","data-sve-tb-card":"","data-slot":t.slot,"data-filled":r||null,"data-empty":!t.exists&&!t.broken?"":null,"data-broken":t.broken?"":null});return o.appendChild(i(e,"span",{"data-sve-tb-slot":""},m(e,t.slot))),t.broken?(o.appendChild(i(e,"span",{"data-sve-tb-file":""},`${t.view}.antlers.html`)),o.appendChild(i(e,"span",{"data-sve-tb-note":""},l(e,"template_board_broken")))):t.exists?o.appendChild(i(e,"span",{"data-sve-tb-file":""},t.file)):o.appendChild(i(e,"span",{"data-sve-tb-note":""},l(e,"template_board_empty"))),o.addEventListener("click",()=>h(e,a,n,t,o)),o}function h(e,a,n,t,r){if(!t.broken){if(t.exists){e.location.href=t.edit||y(e);return}g(e,a,n,t,r)}}function y(e){const a=e.Statamic?.$config?.get?.("cpUrl")||"/cp";return`${String(a).replace(/\/$/,"")}/utilities/site-files`}async function g(e,a,n,t,r){r.setAttribute("data-sve-tb-busy","");try{const o=await e.fetch("/!/sve/template-board",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":b(e),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({handle:n.handle,slot:t.slot})}),s=await o.json().catch(()=>({}));if(!o.ok||!s.ok){r.removeAttribute("data-sve-tb-busy"),e.Statamic?.$toast?.error(s.reason==="exists"?s.view:l(e,"template_board_empty"));return}if(s.edit){e.location.href=s.edit;return}await p(e,a)}catch(o){r.removeAttribute("data-sve-tb-busy"),console.error("[sve] create template",o)}}function $(e,a,n){const t=i(e,"section",{"data-sve-tb-row":"","data-handle":n.handle}),r=i(e,"header",{"data-sve-tb-head":""});r.appendChild(i(e,"h2",{"data-sve-tb-title":""},n.title)),n.kind!=="site"&&r.appendChild(i(e,"span",{"data-sve-tb-kind":""},n.handle)),t.appendChild(r);const o=i(e,"div",{"data-sve-tb-cards":""});for(const s of n.cards)o.appendChild(v(e,a,n,s));return t.appendChild(o),t}async function p(e,a){const n=await e.fetch("/!/sve/template-board",{headers:{"X-Requested-With":"XMLHttpRequest"}});if(!n.ok)return;const t=await n.json().catch(()=>null),r=Array.isArray(t?.rows)?t.rows:[];if(e.document.contains(a)){a.textContent="";for(const o of r)a.appendChild($(e,a,o))}}function _(e=window){const a=e.document.getElementById(d);a&&a.dataset.svePainted!=="1"&&(a.dataset.svePainted="1",u(e),p(e,a))}export{_ as syncTemplateBoard};
