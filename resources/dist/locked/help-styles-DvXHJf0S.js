import{r as m,o as n,c as i,a as o,t as d,F as s,i as b,f as u,w as l,a0 as h}from"./addon-DicWgWKo.js";const k=["aria-label"],x={"data-sve-help-head":""},w={"data-sve-help-body":""},E={"data-sve-help-seg":""},C=["data-active","disabled","onClick"],z=["value","disabled"],M={key:0,value:""},S=["value"],T=["value","disabled"],F=["value"],B={key:2,"data-sve-help-box":""},L=["value","placeholder","disabled"],K=["title","disabled"],D={"data-sve-help-sub":""},H=["value","disabled"],j=["value"],A={key:0,"data-sve-help-tick":""},I=["checked","disabled"],P={"data-sve-help-sub":""},O=["value","disabled"],U=["value"],V={key:0,"data-sve-help-box":"","data-sve-help-gap":""},q=["value","placeholder","disabled"],N=["title","disabled"],Y={"data-sve-help-sub":""},R=["value","placeholder","disabled"],W={"data-sve-help-sub":""},$=["value","placeholder","disabled"],y='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',Q={__name:"DockHelpLoop",props:{inspect:{type:Object,required:!0},canEdit:{type:Boolean,default:!0},dataTitle:{type:String,default:""},closeLabel:{type:String,default:""},on:{type:Object,required:!0}},setup(e){const r=m(null),p=m(null);function g(c,a,t){!c||!a||(c.value=a,c.focus(),c.setSelectionRange(a.length,a.length),t(a))}return(c,a)=>(n(),i("div",{"data-sve-help-loop":"",role:"dialog","aria-label":e.inspect.title},[o("div",x,[o("span",null,d(e.inspect.title),1),o("span",null,d(e.closeLabel),1)]),o("div",w,[o("div",E,[(n(!0),i(s,null,b(e.inspect.kinds,t=>(n(),i("button",{key:t.id,type:"button","data-active":t.id===e.inspect.loopKind?"":void 0,disabled:!e.canEdit,onClick:v=>e.on.kind(t.id)},d(t.label),9,C))),128))]),e.inspect.loopKind==="collection"?(n(),i("select",{key:e.inspect.key+":"+e.inspect.value,value:e.inspect.value,disabled:!e.canEdit,onChange:a[0]||(a[0]=t=>e.on.commit(t.target.value))},[e.inspect.value?u("",!0):(n(),i("option",M,d(e.inspect.placeholder),1)),(n(!0),i(s,null,b(e.inspect.collections,t=>(n(),i("option",{key:t.handle,value:t.handle},d(t.title),9,S))),128))],40,z)):e.inspect.loopKind==="nav"?(n(),i("select",{key:e.inspect.key+":nav:"+e.inspect.value,value:e.inspect.value,disabled:!e.canEdit,onChange:a[1]||(a[1]=t=>e.on.commit(t.target.value))},[(n(!0),i(s,null,b(e.inspect.navs,t=>(n(),i("option",{key:t.handle,value:t.handle},d(t.title),9,F))),128))],40,T)):(n(),i("div",B,[(n(),i("input",{ref_key:"field",ref:r,key:e.inspect.key,type:"text",value:e.inspect.value,placeholder:e.inspect.placeholder,disabled:!e.canEdit,spellcheck:"false",onKeydown:[a[2]||(a[2]=l(()=>{},["stop"])),a[3]||(a[3]=h(l(t=>e.on.commit(t.target.value),["prevent"]),["enter"]))],onBlur:a[4]||(a[4]=t=>e.on.commit(t.target.value))},null,40,L)),o("button",{type:"button","data-sve-help-data":"",title:e.dataTitle,disabled:!e.canEdit,innerHTML:y,onMousedown:a[5]||(a[5]=l(()=>{},["prevent"])),onClick:a[6]||(a[6]=l(t=>e.on.pickData(t.currentTarget,v=>g(r.value,v,e.on.commit)),["stop","prevent"]))},null,40,K)])),e.inspect.nav?(n(),i(s,{key:3},[o("div",D,d(e.inspect.nav.depthTitle),1),(n(),i("select",{key:e.inspect.key+":depth:"+e.inspect.nav.depth,value:e.inspect.nav.depth,disabled:!e.canEdit,onChange:a[7]||(a[7]=t=>e.on.depth(t.target.value))},[(n(!0),i(s,null,b(e.inspect.nav.depths,t=>(n(),i("option",{key:t.id,value:t.id},d(t.label),9,j))),128))],40,H)),e.inspect.nav.homeAsked?(n(),i("label",A,[o("input",{type:"checkbox",checked:e.inspect.nav.includeHome,disabled:!e.canEdit,onChange:a[8]||(a[8]=t=>e.on.includeHome(t.target.checked))},null,40,I),o("span",null,d(e.inspect.nav.homeLabel),1)])):u("",!0)],64)):u("",!0),e.inspect.sort?(n(),i(s,{key:4},[o("div",P,d(e.inspect.sort.title),1),(n(),i("select",{key:e.inspect.key+":dir:"+e.inspect.sort.dir,value:e.inspect.sort.dir,disabled:!e.canEdit,onChange:a[9]||(a[9]=t=>e.on.sortDir(t.target.value))},[(n(!0),i(s,null,b(e.inspect.sort.dirs,t=>(n(),i("option",{key:t.id,value:t.id},d(t.label),9,U))),128))],40,O)),e.inspect.sort.needsField?(n(),i("div",V,[(n(),i("input",{ref_key:"sortField",ref:p,key:e.inspect.key+":field",type:"text",value:e.inspect.sort.field,placeholder:e.inspect.sort.placeholder,disabled:!e.canEdit,spellcheck:"false",onKeydown:[a[10]||(a[10]=l(()=>{},["stop"])),a[11]||(a[11]=h(l(t=>e.on.sortField(t.target.value),["prevent"]),["enter"]))],onBlur:a[12]||(a[12]=t=>e.on.sortField(t.target.value))},null,40,q)),e.inspect.sort.pickable?(n(),i("button",{key:0,type:"button","data-sve-help-data":"",title:e.dataTitle,disabled:!e.canEdit,innerHTML:y,onMousedown:a[13]||(a[13]=l(()=>{},["prevent"])),onClick:a[14]||(a[14]=l(t=>e.on.pickData(t.currentTarget,v=>g(p.value,v,e.on.sortField)),["stop","prevent"]))},null,40,N)):u("",!0)])):u("",!0),o("div",Y,d(e.inspect.limit.title),1),(n(),i("input",{key:e.inspect.key+":limit",type:"number",min:"1",value:e.inspect.limit.value,placeholder:e.inspect.limit.placeholder,disabled:!e.canEdit,onKeydown:[a[15]||(a[15]=l(()=>{},["stop"])),a[16]||(a[16]=h(l(t=>e.on.limit(t.target.value),["prevent"]),["enter"]))],onBlur:a[17]||(a[17]=t=>e.on.limit(t.target.value))},null,40,R)),o("div",W,d(e.inspect.offset.title),1),(n(),i("input",{key:e.inspect.key+":offset",type:"number",min:"0",value:e.inspect.offset.value,placeholder:e.inspect.offset.placeholder,disabled:!e.canEdit,onKeydown:[a[18]||(a[18]=l(()=>{},["stop"])),a[19]||(a[19]=h(l(t=>e.on.offset(t.target.value),["prevent"]),["enter"]))],onBlur:a[20]||(a[20]=t=>e.on.offset(t.target.value))},null,40,$))],64)):u("",!0)])],8,k))}},f="__sve-help-styles",G=`
[data-sve-help-popup] {
  position: fixed;
  z-index: 99999;
  min-width: 15em;
  max-width: 26em;
  box-sizing: border-box;
  overflow: hidden;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.6rem;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.4);
  font: 500 0.75rem/1.4 system-ui, -apple-system, "Segoe UI", sans-serif;
}
[data-sve-help-head] {
  display: flex;
  justify-content: space-between;
  gap: 1em;
  padding: 0.45em 0.75em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  opacity: 0.55;
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
[data-sve-help-option] {
  display: flex;
  align-items: baseline;
  gap: 0.6em;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0.45em 0.75em;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
[data-sve-help-option]:hover {
  background: rgba(255, 255, 255, 0.06);
}
[data-sve-help-option][data-active] {
  background: rgba(255, 255, 255, 0.1);
}
[data-sve-help-label] {
  flex: 1 1 auto;
  min-width: 0;
}
[data-sve-help-meta] {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.55;
  font: 0.6875rem/1.4 ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}
[data-sve-help-key] {
  flex: 0 0 auto;
  padding: 0 0.4em;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 0.3em;
  opacity: 0.7;
  font: 0.625rem/1.5 ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}

/*
  The loop panel at the caret: the same look as the suggestions, the tree's
  controls inside. A condition's panel (logic-popup.js) wears the same frame.
*/
[data-sve-help-loop],
[data-sve-help-condition] {
  position: fixed;
  z-index: 99999;
  width: 17em;
  box-sizing: border-box;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.6rem;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.4);
  font: 500 0.75rem/1.4 system-ui, -apple-system, "Segoe UI", sans-serif;
}
[data-sve-help-body] {
  padding: 0.6em 0.75em 0.75em;
}
[data-sve-help-sub] {
  margin: 0.8em 0 0.35em;
  opacity: 0.55;
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
/* The kind: the class picker's tabs — a dark strip, the chosen one lifted in white. */
[data-sve-help-seg] {
  display: flex;
  gap: 0.2rem;
  margin-bottom: 0.45em;
  padding: 0.15rem;
  border-radius: 0.45em;
  background: rgba(0, 0, 0, 0.28);
}
[data-sve-help-seg] button {
  all: unset;
  flex: 1 1 0;
  box-sizing: border-box;
  padding: 0.35em 0;
  border-radius: 0.35em;
  cursor: pointer;
  text-align: center;
  font-size: 0.625rem;
  opacity: 0.65;
}
[data-sve-help-seg] button:hover {
  opacity: 1;
}
[data-sve-help-seg] button[data-active] {
  opacity: 1;
  background: rgba(255, 255, 255, 0.14);
}
[data-sve-help-seg] button:disabled {
  cursor: default;
  opacity: 0.35;
}
[data-sve-help-body] input,
[data-sve-help-body] select {
  box-sizing: border-box;
  width: 100%;
  padding: 0.45em 0.6em;
  border-radius: 0.45em;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(0, 0, 0, 0.28);
  color: inherit;
  font: 0.625rem/1.4 ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}
[data-sve-help-body] select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' fill='none' stroke='%23999' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.7em center;
  background-size: 0.65em;
  padding-right: 2.1em;
}
[data-sve-help-body] input:focus,
[data-sve-help-body] select:focus {
  outline: none;
  border-color: rgba(147, 197, 253, 0.7);
}
[data-sve-help-body] input:disabled,
[data-sve-help-body] select:disabled {
  opacity: 0.55;
}
[data-sve-help-box] {
  position: relative;
}
[data-sve-help-box][data-sve-help-gap] {
  margin-top: 0.35em;
}
[data-sve-help-box] input {
  padding-right: 2em;
}
[data-sve-help-data] {
  all: unset;
  position: absolute;
  top: 50%;
  right: 0.3em;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5em;
  height: 1.5em;
  border-radius: 0.25em;
  cursor: pointer;
  opacity: 0.55;
}
[data-sve-help-data]:hover:not(:disabled) {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
}
[data-sve-help-tick] {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-top: 0.75em;
  font-size: 0.625rem;
  cursor: pointer;
}
[data-sve-help-tick] input {
  width: auto;
  margin: 0;
  padding: 0;
  accent-color: #d4d4d4;
}
[data-sve-help-note] {
  margin: 0;
  opacity: 0.55;
  font-size: 0.6875rem;
}
/* Else if / Else: written under the condition, so they read as additions, not choices. */
[data-sve-help-branches] {
  display: flex;
  gap: 0.3em;
  margin-top: 0.6em;
}
[data-sve-help-branches] button {
  all: unset;
  box-sizing: border-box;
  padding: 0.35em 0.6em;
  border: 1px dashed rgba(255, 255, 255, 0.25);
  border-radius: 0.35em;
  cursor: pointer;
  font-size: 0.625rem;
  opacity: 0.8;
}
[data-sve-help-branches] button:hover:not(:disabled) {
  opacity: 1;
  background: rgba(255, 255, 255, 0.08);
}
[data-sve-help-branches] button:disabled {
  cursor: default;
  opacity: 0.35;
}
`;function X(e){if(!e||e.getElementById(f))return;const r=e.createElement("style");r.id=f,r.textContent=G,e.head.appendChild(r)}export{Q as _,X as e};
