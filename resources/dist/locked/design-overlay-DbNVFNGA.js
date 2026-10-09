import{L as q,m as j,x as c,a2 as T,z as M,a5 as P}from"./addon-BoF3Hvmo.js";import{aR as g,aS as w,aT as F,p as O,aK as H,aU as W}from"./lp-cluster-DFcsPES9.js";import{q as X,z as x}from"./ids-vn_yj3mf.js";import{f as N,m as B,p as U}from"./preview-bar-B60FimI1.js";import"./protocol-Brvy2KuB.js";import"./ChoiceDialog-C-xUTM2o.js";import"./ai-text-icon-B7uCWIwa.js";const z="__sve-design-overlay",d="__sve-design-bar",k="__sve-design-style",Y=20*1024*1024,K=1.5*1024*1024,t={win:null,frame:null,doc:null,pwin:null,off:[],frameResize:null,entry:null,listing:null,target:null,bar:null,busy:!1,status:""};function L(e){return g(e).on}function pe(e){G(e,!L(e))}function G(e,n){w(e,{...g(e),on:!!n}),n?I(e):$(),V(e)}function V(e){const n=e.document.querySelector(`#${X} button[data-tab="design_overlay"]`);n&&H(n,L(e))}function I(e){if(!F(e)||!L(e)){$();return}t.win=e;const n=O(e);let a=null;try{a=n?.contentDocument||null}catch{a=null}if(!n||!a?.documentElement){$();return}(t.doc!==a||t.frame!==n)&&J(e,n,a);const r=q(e);r!==t.entry&&(t.entry=r,t.listing=null,t.status="",r&&Z(e,r)),ae(e),u(),E()}function h(e,n,a,r){e.addEventListener(n,a,r),t.off.push(()=>e.removeEventListener(n,a,r))}function C(){t.off.splice(0).forEach(e=>{try{e()}catch{}}),t.frameResize?.disconnect(),t.frameResize=null,t.doc?.getElementById(z)?.remove(),t.doc=t.pwin=t.frame=null}function $(){C(),t.bar?.remove(),t.bar?.ownerDocument.getElementById(k)?.remove(),t.bar=null,t.entry=null,t.listing=null,t.status=""}function J(e,n,a){C(),t.frame=n,t.doc=a,t.pwin=a.defaultView,h(t.pwin,"resize",u),t.frameResize=new e.ResizeObserver(()=>{if(!t.frame?.isConnected){$();return}E(),u()}),t.frameResize.observe(n),h(n,"load",()=>I(e)),h(e,"resize",E),N(e,n,E,h)}function y(){return t.doc?P(t.doc.documentElement.clientWidth,t.win):null}function u(){Q(),re()}function Q(){const e=t.doc;if(!e)return;const n=g(t.win),a=t.listing?.[y()]||null;let r=e.getElementById(z);if(!a){r?.remove();return}r||(r=e.createElement("img"),r.id=z,r.alt="",r.decoding="async",r.setAttribute("aria-hidden","true"),r.style.cssText="position:absolute;left:0;top:0;height:auto;max-width:none;margin:0;padding:0;border:0;pointer-events:none;z-index:2147482990;"),r.parentNode!==e.documentElement&&e.documentElement.appendChild(r),r.getAttribute("src")!==a.url&&r.setAttribute("src",a.url);const s=`${e.documentElement.clientWidth}px`,o=String(n.opacity/100),l=n.diff?"difference":"normal";r.style.width!==s&&(r.style.width=s),r.style.opacity!==o&&(r.style.opacity=o),r.style.mixBlendMode!==l&&(r.style.mixBlendMode=l)}function S(e,n=""){return`/!/sve/design-overlay/${encodeURIComponent(e)}${n?`/${encodeURIComponent(n)}`:""}`}async function D(e,n,a={}){const r=await fetch(n,{credentials:"same-origin",...a,headers:{Accept:"application/json","X-CSRF-TOKEN":M(e),"X-Requested-With":"XMLHttpRequest",...a.headers||{}}}),s=await r.json().catch(()=>({}));if(!r.ok)throw new Error(r.status===413?c(e,"design_too_big"):s.message||c(e,"design_failed"));return s}async function Z(e,n){try{const a=await D(e,S(n));t.entry===n&&(t.listing=a.overlays||{})}catch(a){t.entry===n&&(t.status=a.message)}u()}async function ee(e,n){let a=null;try{a=await e.createImageBitmap(n)}catch{return n}const r=W(a.width,a.height);if(!r.scaled&&n.size<=K)return a.close?.(),n;const s=e.document.createElement("canvas");s.width=r.width,s.height=r.height,s.getContext("2d").drawImage(a,0,0,r.width,r.height),a.close?.();const o=await new Promise(l=>s.toBlob(l,"image/jpeg",.9));return o?new e.File([o],"design.jpg",{type:"image/jpeg"}):n}async function R(e,n,a){const r=t.entry;if(!(!r||!a)){if(!/^image\/(jpeg|png|webp)$/.test(a.type)){t.status=c(e,"design_wrong_type"),u();return}t.busy=!0,t.status=c(e,"design_uploading"),u();try{const s=await ee(e,a);if(s.size>Y)throw new Error(c(e,"design_too_big"));const o=new FormData;o.append("file",s,s.name||a.name);const l=await D(e,S(r,n),{method:"POST",body:o});t.entry===r&&(t.listing=l.overlays||{},t.status="")}catch(s){t.status=s.message||c(e,"design_failed")}finally{t.busy=!1,u()}}}async function te(e,n){const a=t.entry,r=_(e,n);if(!(!a||!t.listing?.[n]||!e.confirm(c(e,"design_remove_confirm",{size:r})))){t.busy=!0,u();try{const s=await D(e,S(a,n),{method:"DELETE"});t.entry===a&&(t.listing=s.overlays||{},t.status="")}catch(s){t.status=s.message}finally{t.busy=!1,u()}}}function _(e,n){return T(e).find(a=>a.handle===n)?.label||n}const ne=`
#${d} {
  /* Inside Live Preview at the breakpoint overview's level — see cp/preview-bar.js. */
  position: absolute;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: .25rem;
  width: max-content;
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
#${d}[data-drop] { box-shadow: 0 0 0 .125rem ${x}, 0 .25rem 1rem rgba(0, 0, 0, .25); }
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
#${d} button[aria-pressed="true"] { opacity: 1; background: ${x}; }
#${d} button[data-sve-design-size][aria-current="true"] { opacity: 1; box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .55); }
#${d} button[data-sve-design-size] [data-mark] { margin-left: .3rem; opacity: .7; }
#${d} [data-sve-design-opacity] { display: inline-flex; align-items: center; gap: .375rem; padding: 0 .5rem; }
#${d} input[type="range"] { width: 6rem; accent-color: ${x}; margin: 0; }
#${d} output { min-width: 2.25rem; text-align: right; opacity: .8; font-variant-numeric: tabular-nums; }
#${d} [data-sve-design-sep] { width: 1px; align-self: stretch; margin: .25rem .125rem; background: rgba(255, 255, 255, .18); }
#${d} [data-sve-design-status] { padding: 0 .625rem; font-weight: 500; opacity: .8; }
#${d} [data-sve-design-status]:empty { display: none; }
`;function ae(e){const n=t.frame.ownerDocument;if(j(n,k,ne),t.bar){B(t.bar,t.frame);return}const a=n.createElement("div");a.id=d,a.setAttribute("role","toolbar"),a.setAttribute("aria-label",c(e,"design_overlay"));const r=(i,m={},p="")=>{const f=n.createElement(i);return Object.entries(m).forEach(([b,v])=>f.setAttribute(b,v)),f.textContent=p,a.appendChild(f),f},s=()=>r("span",{"data-sve-design-sep":""});r("span",{"data-sve-design-title":""},c(e,"design_overlay"));for(const i of T(e))r("button",{type:"button","data-sve-design-size":i.handle}).addEventListener("click",()=>{t.target=i.handle,l.click()});s();const o=n.createElement("label");o.setAttribute("data-sve-design-opacity",""),o.title=c(e,"design_opacity"),o.innerHTML='<input type="range" min="0" max="100" step="5"><output></output>',a.appendChild(o),o.querySelector("input").addEventListener("input",i=>{w(e,{...g(e),opacity:Number(i.target.value)}),u()}),r("button",{type:"button","data-sve-design":"diff",title:c(e,"design_diff_tip")},c(e,"design_diff")).addEventListener("click",()=>{const i=g(e);w(e,{...i,diff:!i.diff}),u()}),r("button",{type:"button","data-sve-design":"remove"},c(e,"design_remove")).addEventListener("click",()=>{te(e,y())}),r("span",{"data-sve-design-status":"",role:"status"});const l=r("input",{type:"file",accept:"image/jpeg,image/png,image/webp",hidden:""});l.addEventListener("change",()=>{const i=l.files?.[0];l.value="",R(e,t.target||y(),i)}),a.addEventListener("dragover",i=>{[...i.dataTransfer?.types||[]].includes("Files")&&(i.preventDefault(),a.dataset.drop="")}),a.addEventListener("dragleave",()=>delete a.dataset.drop),a.addEventListener("drop",i=>{i.preventDefault(),delete a.dataset.drop,R(e,y(),i.dataTransfer?.files?.[0])}),t.bar=a,B(a,t.frame)}function re(){const e=t.win,n=t.bar;if(!n)return;const a=g(e),r=y(),s=!t.entry;n.querySelectorAll("button[data-sve-design-size]").forEach(p=>{const f=p.dataset.sveDesignSize,b=!!t.listing?.[f],v=_(e,f),A=`${v}<span data-mark>${b?"✓":"+"}</span>`;p.innerHTML!==A&&(p.innerHTML=A),p.setAttribute("aria-current",f===r?"true":"false"),p.title=c(e,b?"design_replace_for":"design_upload_for",{size:v}),p.disabled=s||t.busy});const o=n.querySelector("[data-sve-design-opacity] input");o&&n.ownerDocument.activeElement!==o&&(o.value=String(a.opacity)),n.querySelector("[data-sve-design-opacity] output").textContent=`${a.opacity}%`,n.querySelector('[data-sve-design="diff"]').setAttribute("aria-pressed",a.diff?"true":"false");const l=n.querySelector('[data-sve-design="remove"]');l.disabled=s||t.busy||!t.listing?.[r],l.title=c(e,"design_remove_for",{size:_(e,r)});let i=t.status;!i&&s?i=c(e,"design_no_entry"):!i&&t.listing&&!t.listing[r]&&(i=c(e,"design_none_for",{size:_(e,r)}));const m=n.querySelector("[data-sve-design-status]");m.textContent!==i&&(m.textContent=i)}function E(){t.bar&&t.frame&&U(t.bar,t.frame,"top")}export{F as designAllowed,L as isDesignOn,G as setDesign,I as syncDesignToPreview,pe as toggleDesign};
