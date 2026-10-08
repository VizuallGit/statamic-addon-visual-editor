import{L as k,m as q,x as l,a2 as R,z as M,a5 as j}from"./addon-DUCFZFBM.js";import{aS as f,aT as $,aU as O,p as P,aK as F,aV as H}from"./lp-cluster-B8PWI08i.js";import{q as W,z as _}from"./ids-vn_yj3mf.js";import"./protocol-Brvy2KuB.js";import"./ChoiceDialog-BP05LgIr.js";import"./ai-text-icon-B7uCWIwa.js";const w="__sve-design-overlay",d="__sve-design-bar",C="__sve-design-style",X=20*1024*1024,N=1.5*1024*1024,n={win:null,frame:null,doc:null,pwin:null,off:[],frameResize:null,entry:null,listing:null,target:null,busy:!1,status:""};function B(e){return f(e).on}function de(e){U(e,!B(e))}function U(e,t){$(e,{...f(e),on:!!t}),t?D(e):E(),Y(e)}function Y(e){const t=e.document.querySelector(`#${W} button[data-tab="design_overlay"]`);t&&F(t,B(e))}function D(e){if(!O(e)||!B(e)){E();return}n.win=e;const t=P(e);let a=null;try{a=t?.contentDocument||null}catch{a=null}if(!t||!a?.documentElement){E();return}(n.doc!==a||n.frame!==t)&&V(e,t,a);const s=k(e);s!==n.entry&&(n.entry=s,n.listing=null,n.status="",s&&G(e,s)),ee(e),u(),z()}function x(e,t,a,s){e.addEventListener(t,a,s),n.off.push(()=>e.removeEventListener(t,a,s))}function T(){n.off.splice(0).forEach(e=>{try{e()}catch{}}),n.frameResize?.disconnect(),n.frameResize=null,n.doc?.getElementById(w)?.remove(),n.doc=n.pwin=n.frame=null}function E(){T();const e=n.win?.document;e?.getElementById(d)?.remove(),e?.getElementById(C)?.remove(),n.entry=null,n.listing=null,n.status=""}function V(e,t,a){T(),n.frame=t,n.doc=a,n.pwin=a.defaultView,x(n.pwin,"resize",u),n.frameResize=new e.ResizeObserver(()=>{if(!n.frame?.isConnected){E();return}z(),u()}),n.frameResize.observe(t),x(t,"load",()=>D(e)),x(e,"resize",z)}function y(){return n.doc?j(n.doc.documentElement.clientWidth,n.win):null}function u(){K(),te()}function K(){const e=n.doc;if(!e)return;const t=f(n.win),a=n.listing?.[y()]||null;let s=e.getElementById(w);if(!a){s?.remove();return}s||(s=e.createElement("img"),s.id=w,s.alt="",s.decoding="async",s.setAttribute("aria-hidden","true"),s.style.cssText="position:absolute;left:0;top:0;height:auto;max-width:none;margin:0;padding:0;border:0;pointer-events:none;z-index:2147482990;"),s.parentNode!==e.documentElement&&e.documentElement.appendChild(s),s.getAttribute("src")!==a.url&&s.setAttribute("src",a.url);const i=`${e.documentElement.clientWidth}px`,o=String(t.opacity/100),c=t.diff?"difference":"normal";s.style.width!==i&&(s.style.width=i),s.style.opacity!==o&&(s.style.opacity=o),s.style.mixBlendMode!==c&&(s.style.mixBlendMode=c)}function L(e,t=""){return`/!/sve/design-overlay/${encodeURIComponent(e)}${t?`/${encodeURIComponent(t)}`:""}`}async function S(e,t,a={}){const s=await fetch(t,{credentials:"same-origin",...a,headers:{Accept:"application/json","X-CSRF-TOKEN":M(e),"X-Requested-With":"XMLHttpRequest",...a.headers||{}}}),i=await s.json().catch(()=>({}));if(!s.ok)throw new Error(s.status===413?l(e,"design_too_big"):i.message||l(e,"design_failed"));return i}async function G(e,t){try{const a=await S(e,L(t));n.entry===t&&(n.listing=a.overlays||{})}catch(a){n.entry===t&&(n.status=a.message)}u()}async function J(e,t){let a=null;try{a=await e.createImageBitmap(t)}catch{return t}const s=H(a.width,a.height);if(!s.scaled&&t.size<=N)return a.close?.(),t;const i=e.document.createElement("canvas");i.width=s.width,i.height=s.height,i.getContext("2d").drawImage(a,0,0,s.width,s.height),a.close?.();const o=await new Promise(c=>i.toBlob(c,"image/jpeg",.9));return o?new e.File([o],"design.jpg",{type:"image/jpeg"}):t}async function I(e,t,a){const s=n.entry;if(!(!s||!a)){if(!/^image\/(jpeg|png|webp)$/.test(a.type)){n.status=l(e,"design_wrong_type"),u();return}n.busy=!0,n.status=l(e,"design_uploading"),u();try{const i=await J(e,a);if(i.size>X)throw new Error(l(e,"design_too_big"));const o=new FormData;o.append("file",i,i.name||a.name);const c=await S(e,L(s,t),{method:"POST",body:o});n.entry===s&&(n.listing=c.overlays||{},n.status="")}catch(i){n.status=i.message||l(e,"design_failed")}finally{n.busy=!1,u()}}}async function Q(e,t){const a=n.entry,s=v(e,t);if(!(!a||!n.listing?.[t]||!e.confirm(l(e,"design_remove_confirm",{size:s})))){n.busy=!0,u();try{const i=await S(e,L(a,t),{method:"DELETE"});n.entry===a&&(n.listing=i.overlays||{},n.status="")}catch(i){n.status=i.message}finally{n.busy=!1,u()}}}function v(e,t){return R(e).find(a=>a.handle===t)?.label||t}const Z=`
#${d} {
  position: fixed;
  z-index: 2147483000;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: .25rem;
  width: max-content;
  max-width: calc(100vw - 2rem);
  padding: .25rem;
  border-radius: 1.25rem;
  background: rgba(24, 24, 27, .92);
  backdrop-filter: blur(.375rem);
  box-shadow: 0 .25rem 1rem rgba(0, 0, 0, .25);
  color: #fff;
  font: 600 .75rem/1 system-ui, -apple-system, "Segoe UI", sans-serif;
  transform: translateX(-50%);
  white-space: nowrap;
  user-select: none;
}
#${d}[hidden] { display: none; }
#${d}[data-drop] { box-shadow: 0 0 0 .125rem ${_}, 0 .25rem 1rem rgba(0, 0, 0, .25); }
#${d} [data-sve-design-title] { padding: 0 .5rem 0 .625rem; opacity: .7; letter-spacing: .02em; }
#${d} button {
  appearance: none;
  border: 0;
  margin: 0;
  padding: .375rem .625rem;
  border-radius: 999rem;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
  opacity: .65;
}
#${d} button:hover:not(:disabled) { opacity: 1; background: rgba(255, 255, 255, .08); }
#${d} button:disabled { cursor: default; opacity: .3; }
#${d} button[aria-pressed="true"] { opacity: 1; background: ${_}; }
#${d} button[data-sve-design-size][aria-current="true"] { opacity: 1; box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .55); }
#${d} button[data-sve-design-size] [data-mark] { margin-left: .3rem; opacity: .7; }
#${d} [data-sve-design-opacity] { display: inline-flex; align-items: center; gap: .375rem; padding: 0 .5rem; }
#${d} input[type="range"] { width: 6rem; accent-color: ${_}; margin: 0; }
#${d} output { min-width: 2.25rem; text-align: right; opacity: .8; font-variant-numeric: tabular-nums; }
#${d} [data-sve-design-sep] { width: 1px; align-self: stretch; margin: .25rem .125rem; background: rgba(255, 255, 255, .18); }
#${d} [data-sve-design-status] { padding: 0 .625rem; font-weight: 500; opacity: .8; }
#${d} [data-sve-design-status]:empty { display: none; }
`;function ee(e){const t=e.document;q(t,C,Z);let a=t.getElementById(d);if(a)return;a=t.createElement("div"),a.id=d,a.setAttribute("role","toolbar"),a.setAttribute("aria-label",l(e,"design_overlay"));const s=(r,m={},p="")=>{const g=t.createElement(r);return Object.entries(m).forEach(([b,h])=>g.setAttribute(b,h)),g.textContent=p,a.appendChild(g),g},i=()=>s("span",{"data-sve-design-sep":""});s("span",{"data-sve-design-title":""},l(e,"design_overlay"));for(const r of R(e))s("button",{type:"button","data-sve-design-size":r.handle}).addEventListener("click",()=>{n.target=r.handle,c.click()});i();const o=t.createElement("label");o.setAttribute("data-sve-design-opacity",""),o.title=l(e,"design_opacity"),o.innerHTML='<input type="range" min="0" max="100" step="5"><output></output>',a.appendChild(o),o.querySelector("input").addEventListener("input",r=>{$(e,{...f(e),opacity:Number(r.target.value)}),u()}),s("button",{type:"button","data-sve-design":"diff",title:l(e,"design_diff_tip")},l(e,"design_diff")).addEventListener("click",()=>{const r=f(e);$(e,{...r,diff:!r.diff}),u()}),s("button",{type:"button","data-sve-design":"remove"},l(e,"design_remove")).addEventListener("click",()=>{Q(e,y())}),s("span",{"data-sve-design-status":"",role:"status"});const c=s("input",{type:"file",accept:"image/jpeg,image/png,image/webp",hidden:""});c.addEventListener("change",()=>{const r=c.files?.[0];c.value="",I(e,n.target||y(),r)}),a.addEventListener("dragover",r=>{[...r.dataTransfer?.types||[]].includes("Files")&&(r.preventDefault(),a.dataset.drop="")}),a.addEventListener("dragleave",()=>delete a.dataset.drop),a.addEventListener("drop",r=>{r.preventDefault(),delete a.dataset.drop,I(e,y(),r.dataTransfer?.files?.[0])}),t.body.appendChild(a)}function te(){const e=n.win,t=e?.document.getElementById(d);if(!t)return;const a=f(e),s=y(),i=!n.entry;t.querySelectorAll("button[data-sve-design-size]").forEach(p=>{const g=p.dataset.sveDesignSize,b=!!n.listing?.[g],h=v(e,g),A=`${h}<span data-mark>${b?"✓":"+"}</span>`;p.innerHTML!==A&&(p.innerHTML=A),p.setAttribute("aria-current",g===s?"true":"false"),p.title=l(e,b?"design_replace_for":"design_upload_for",{size:h}),p.disabled=i||n.busy});const o=t.querySelector("[data-sve-design-opacity] input");o&&e.document.activeElement!==o&&(o.value=String(a.opacity)),t.querySelector("[data-sve-design-opacity] output").textContent=`${a.opacity}%`,t.querySelector('[data-sve-design="diff"]').setAttribute("aria-pressed",a.diff?"true":"false");const c=t.querySelector('[data-sve-design="remove"]');c.disabled=i||n.busy||!n.listing?.[s],c.title=l(e,"design_remove_for",{size:v(e,s)});let r=n.status;!r&&i?r=l(e,"design_no_entry"):!r&&n.listing&&!n.listing[s]&&(r=l(e,"design_none_for",{size:v(e,s)}));const m=t.querySelector("[data-sve-design-status]");m.textContent!==r&&(m.textContent=r)}function z(){const e=n.win,t=e?.document.getElementById(d),a=n.frame;if(!t)return;if(!a?.isConnected){t.hidden=!0;return}const s=a.getBoundingClientRect();let i=0,o=0;const c=a.ownerDocument.defaultView;if(c&&c!==e)try{const r=c.frameElement?.getBoundingClientRect();i=r?.left||0,o=r?.top||0}catch{}if(s.width<1||s.height<1){t.hidden=!0;return}t.hidden=!1,t.style.left=`${Math.round(i+s.left+s.width/2)}px`,t.style.top=`${Math.round(o+s.top+12)}px`}export{O as designAllowed,B as isDesignOn,U as setDesign,D as syncDesignToPreview,de as toggleDesign};
