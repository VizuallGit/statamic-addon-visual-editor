import{e as H}from"./code-dock-4eiu8l6K.js";import{s as d}from"./addon-BUOS5eJK.js";import{bo as I,bp as A}from"./lp-cluster-jiZ1MQYy.js";import{p as T,g as G}from"./ghost-editor-C3jV_oXG.js";import"./shortcuts-BBrEL-OT.js";import"./codemirror-QczW4GBG.js";import"./css-scope-CvwgFAfm.js";import"./ChoiceDialog-CaCHILbK.js";import"./protocol-BVdEmGBQ.js";import"./tw-candidates-CSP7aVNi.js";import"./component-extract-iHeRGR8C.js";import"./html-tag-sync-BpXNELva.js";import"./index-M2RCOyrL.js";import"./index-B5fiB6ig.js";import"./index-sh1K8s4m.js";import"./index-0IxPFT_m.js";import"./index-Ci-3qkVd.js";import"./index-DkhC0r6-.js";import"./index-B4S9JIPB.js";import"./index-BwRQ94Ql.js";import"./index-D9YSa79V.js";import"./index-DwJNgNWz.js";import"./utility-paint-DXCEnfCB.js";import"./utilities-DNDSVzBx.js";import"./ai-text-icon-B7uCWIwa.js";const C="__sve-ghost-edit-styles",L=6,_=8,M=`
[data-sve-ghost-edit] {
  position: fixed;
  z-index: 99999;
  width: min(30em, calc(100vw - 1em));
  box-sizing: border-box;
  padding: 0.55em 0.7em 0.6em;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.6rem;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.4);
  font: 500 0.75rem/1.4 system-ui, -apple-system, "Segoe UI", sans-serif;
}
[data-sve-ghost-edit-head] {
  display: flex;
  justify-content: space-between;
  gap: 1em;
  margin-bottom: 0.35em;
  font-size: 0.625rem;
  opacity: 0.6;
}
[data-sve-ghost-edit] textarea {
  display: block;
  width: 100%;
  box-sizing: border-box;
  max-height: 8em;
  margin: 0;
  padding: 0.2em 0;
  border: 0;
  outline: 0;
  resize: none;
  background: transparent;
  color: inherit;
  font: inherit;
}
[data-sve-ghost-edit] textarea::placeholder {
  color: inherit;
  opacity: 0.45;
}
[data-sve-ghost-edit-status] {
  padding: 0.2em 0;
  font-style: italic;
  opacity: 0.6;
}
[data-sve-ghost-edit-actions] {
  display: flex;
  gap: 0.4em;
  margin-top: 0.45em;
}
[data-sve-ghost-edit-actions] button {
  padding: 0.3em 0.8em;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 0.4rem;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
[data-sve-ghost-edit-actions] button:hover,
[data-sve-ghost-edit-actions] button:focus-visible {
  background: rgba(255, 255, 255, 0.1);
  outline: 0;
}
[data-sve-ghost-edit-actions] [data-keep] {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}
[data-sve-ghost-edit] [hidden] {
  display: none;
}
`;let b=null;function B(t){if(t.getElementById(C))return;const i=t.createElement("style");i.id=C,i.textContent=M,t.head.appendChild(i)}function u(t,i,o,s){const e=t.createElement(i);return o&&e.setAttribute(o,""),s!=null&&(e.textContent=s),e}function ut(t,i){l(b,!1);const{win:o,view:s}=t,e=o.document,{from:m,to:h}=s.state.selection.main,p=h>m;B(e);const n=u(e,"div","data-sve-ghost-edit"),k=u(e,"div","data-sve-ghost-edit-head"),S=u(e,"span",null,d(o,"code_dock_ghost_edit_send")),c=e.createElement("textarea"),y=u(e,"div","data-sve-ghost-edit-status",d(o,"code_dock_ghost_writing")),f=u(e,"div","data-sve-ghost-edit-actions"),w=u(e,"button","data-keep",d(o,"code_dock_ghost_edit_keep")),x=u(e,"button","data-undo",d(o,"code_dock_ghost_edit_undo"));k.append(u(e,"span",null,`✦ ${d(o,p?"code_dock_ghost_edit_title":"code_dock_ghost_insert_title")}`),S),c.rows=1,c.placeholder=d(o,p?"code_dock_ghost_edit_placeholder":"code_dock_ghost_insert_placeholder"),w.type="button",x.type="button",y.hidden=!0,f.hidden=!0,f.append(w,x),n.append(k,c,y,f),e.body.appendChild(n);const a={state:t,done:i,box:n,input:c,hint:S,status:y,actions:f,keep:w,from:m,to:h,original:s.state.sliceDoc(m,h),phase:"ask",instruction:"",written:null,abort:null},g=()=>{const r=s.coordsAtPos(m);if(!r)return;const P=Math.max(_,Math.min(r.left,o.innerWidth-n.offsetWidth-_));let E=r.bottom+L;E+n.offsetHeight>o.innerHeight-_&&r.top-n.offsetHeight-L>=_&&(E=r.top-n.offsetHeight-L),n.style.left=`${P}px`,n.style.top=`${Math.max(_,E)}px`},$=r=>{n.contains(r.target)||(a.phase==="review"?D(a,!1):l(a,!1))};o.addEventListener("scroll",g,!0),o.addEventListener("resize",g),e.addEventListener("mousedown",$,!0),a.unhook=()=>{o.removeEventListener("scroll",g,!0),o.removeEventListener("resize",g),e.removeEventListener("mousedown",$,!0)},c.addEventListener("input",()=>{c.style.height="auto",c.style.height=`${c.scrollHeight}px`,g()}),c.addEventListener("keydown",r=>{r.key==="Enter"&&!r.shiftKey&&!r.isComposing&&(r.preventDefault(),K(a))}),n.addEventListener("keydown",r=>{r.key==="Escape"&&(r.preventDefault(),r.stopPropagation(),a.phase==="review"?z(a):l(a,!0))}),w.addEventListener("click",()=>D(a,!0)),x.addEventListener("click",()=>z(a)),b=a,g(),c.focus()}async function K(t){const i=t.input.value.trim(),{state:o}=t,{view:s,win:e}=o;if(i===""||t.phase!=="ask")return;const m=s.state.doc;t.instruction=i,v(t,"writing"),I(e,"edits");const h=new e.AbortController;let p;t.abort=h;try{const{body:k}=await T(o,t.from,t.to);p=await G(e,"/edit",{...k,instruction:i},h.signal)}catch{b===t&&!h.signal.aborted&&(e.Statamic?.$toast?.error(d(e,"dock_ghost_error")),v(t,"ask"));return}if(b!==t)return;if(t.abort=null,!p.ok){e.Statamic?.$toast?.error(p.body?.message||d(e,"dock_ghost_error")),v(t,"ask");return}if(s.state.doc!==m){e.Statamic?.$toast?.error(d(e,"code_dock_ghost_edit_moved")),l(t,!0);return}const n=typeof p.body?.text=="string"?p.body.text:"";if(n===""){e.Statamic?.$toast?.error(d(e,"code_dock_ghost_edit_nothing")),v(t,"ask");return}s.dispatch({changes:{from:t.from,to:t.to,insert:n},selection:{anchor:t.from,head:t.from+n.length},userEvent:"input.toolbar",scrollIntoView:!0}),H(),t.written=n,v(t,"review")}function v(t,i){const{win:o}=t.state;t.phase=i,t.input.hidden=i!=="ask",t.input.disabled=i!=="ask",t.status.hidden=i!=="writing",t.actions.hidden=i!=="review",t.hint.textContent=d(o,i==="review"?"code_dock_ghost_edit_review":"code_dock_ghost_edit_send"),i==="ask"?t.input.focus():i==="review"&&t.keep.focus()}function D(t,i){const{win:o}=t.state;I(o,"kept"),A(o,`⌘K ${t.instruction}`,t.written),l(t,i)}function z(t){const{view:i}=t.state,{from:o,written:s,original:e}=t;s!=null&&i.state.sliceDoc(o,o+s.length)===s&&(i.dispatch({changes:{from:o,to:o+s.length,insert:e},selection:{anchor:o,head:o+e.length},userEvent:"input.toolbar"}),H()),l(t,!0)}function l(t,i){!t||b!==t||(b=null,t.abort?.abort(),t.unhook(),t.box.remove(),t.done(),i&&t.state.view.focus())}export{M as GHOST_EDIT_CSS,ut as openEditBox};
