import{az as H}from"./code-dock-mm2Nd20p.js";import{q as d}from"./addon-CFiv3stj.js";import{cf as I,cg as A}from"./lp-cluster-B76ATITI.js";import{p as T,g as G}from"./ghost-editor-DzP9jDcF.js";import"./shortcuts-CmY5T-rr.js";import"./codemirror-CNayG5Gv.js";import"./template-elements-Bc-eO-1_.js";import"./ChoiceDialog-Tvu67hAX.js";import"./protocol-CfmvxZS7.js";import"./tw-candidates-CSP7aVNi.js";import"./component-extract-BbTRak1Y.js";import"./antlers-snippets-CL-TR35A.js";import"./utilities-BdLMDse6.js";import"./utility-paint-DbvlfUWm.js";import"./anim-still-4pEwKCsB.js";const z="__sve-ghost-edit-styles",L=6,_=8,M=`
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
`;let b=null;function B(t){if(t.getElementById(z))return;const n=t.createElement("style");n.id=z,n.textContent=M,t.head.appendChild(n)}function h(t,n,o,a){const e=t.createElement(n);return o&&e.setAttribute(o,""),a!=null&&(e.textContent=a),e}function et(t,n){l(b,!1);const{win:o,view:a}=t,e=o.document,{from:g,to:p}=a.state.selection.main,u=p>g;B(e);const i=h(e,"div","data-sve-ghost-edit"),k=h(e,"div","data-sve-ghost-edit-head"),S=h(e,"span",null,d(o,"code_dock_ghost_edit_send")),c=e.createElement("textarea"),y=h(e,"div","data-sve-ghost-edit-status",d(o,"code_dock_ghost_writing")),f=h(e,"div","data-sve-ghost-edit-actions"),w=h(e,"button","data-keep",d(o,"code_dock_ghost_edit_keep")),x=h(e,"button","data-undo",d(o,"code_dock_ghost_edit_undo"));k.append(h(e,"span",null,`✦ ${d(o,u?"code_dock_ghost_edit_title":"code_dock_ghost_insert_title")}`),S),c.rows=1,c.placeholder=d(o,u?"code_dock_ghost_edit_placeholder":"code_dock_ghost_insert_placeholder"),w.type="button",x.type="button",y.hidden=!0,f.hidden=!0,f.append(w,x),i.append(k,c,y,f),e.body.appendChild(i);const s={state:t,done:n,box:i,input:c,hint:S,status:y,actions:f,keep:w,from:g,to:p,original:a.state.sliceDoc(g,p),phase:"ask",instruction:"",written:null,abort:null},m=()=>{const r=a.coordsAtPos(g);if(!r)return;const P=Math.max(_,Math.min(r.left,o.innerWidth-i.offsetWidth-_));let E=r.bottom+L;E+i.offsetHeight>o.innerHeight-_&&r.top-i.offsetHeight-L>=_&&(E=r.top-i.offsetHeight-L),i.style.left=`${P}px`,i.style.top=`${Math.max(_,E)}px`},$=r=>{i.contains(r.target)||(s.phase==="review"?C(s,!1):l(s,!1))};o.addEventListener("scroll",m,!0),o.addEventListener("resize",m),e.addEventListener("mousedown",$,!0),s.unhook=()=>{o.removeEventListener("scroll",m,!0),o.removeEventListener("resize",m),e.removeEventListener("mousedown",$,!0)},c.addEventListener("input",()=>{c.style.height="auto",c.style.height=`${c.scrollHeight}px`,m()}),c.addEventListener("keydown",r=>{r.key==="Enter"&&!r.shiftKey&&!r.isComposing&&(r.preventDefault(),K(s))}),i.addEventListener("keydown",r=>{r.key==="Escape"&&(r.preventDefault(),r.stopPropagation(),s.phase==="review"?D(s):l(s,!0))}),w.addEventListener("click",()=>C(s,!0)),x.addEventListener("click",()=>D(s)),b=s,m(),c.focus()}async function K(t){const n=t.input.value.trim(),{state:o}=t,{view:a,win:e}=o;if(n===""||t.phase!=="ask")return;const g=a.state.doc;t.instruction=n,v(t,"writing"),I(e,"edits");const p=new e.AbortController;let u;t.abort=p;try{const{body:k}=await T(o,t.from,t.to);u=await G(e,"/edit",{...k,instruction:n},p.signal)}catch{b===t&&!p.signal.aborted&&(e.Statamic?.$toast?.error(d(e,"dock_ghost_error")),v(t,"ask"));return}if(b!==t)return;if(t.abort=null,!u.ok){e.Statamic?.$toast?.error(u.body?.message||d(e,"dock_ghost_error")),v(t,"ask");return}if(a.state.doc!==g){e.Statamic?.$toast?.error(d(e,"code_dock_ghost_edit_moved")),l(t,!0);return}const i=typeof u.body?.text=="string"?u.body.text:"";if(i===""){e.Statamic?.$toast?.error(d(e,"code_dock_ghost_edit_nothing")),v(t,"ask");return}a.dispatch({changes:{from:t.from,to:t.to,insert:i},selection:{anchor:t.from,head:t.from+i.length},userEvent:"input.toolbar",scrollIntoView:!0}),H(),t.written=i,v(t,"review")}function v(t,n){const{win:o}=t.state;t.phase=n,t.input.hidden=n!=="ask",t.input.disabled=n!=="ask",t.status.hidden=n!=="writing",t.actions.hidden=n!=="review",t.hint.textContent=d(o,n==="review"?"code_dock_ghost_edit_review":"code_dock_ghost_edit_send"),n==="ask"?t.input.focus():n==="review"&&t.keep.focus()}function C(t,n){const{win:o}=t.state;I(o,"kept"),A(o,`⌘K ${t.instruction}`,t.written),l(t,n)}function D(t){const{view:n}=t.state,{from:o,written:a,original:e}=t;a!=null&&n.state.sliceDoc(o,o+a.length)===a&&(n.dispatch({changes:{from:o,to:o+a.length,insert:e},selection:{anchor:o,head:o+e.length},userEvent:"input.toolbar"}),H()),l(t,!0)}function l(t,n){!t||b!==t||(b=null,t.abort?.abort(),t.unhook(),t.box.remove(),t.done(),n&&t.state.view.focus())}export{M as GHOST_EDIT_CSS,et as openEditBox};
