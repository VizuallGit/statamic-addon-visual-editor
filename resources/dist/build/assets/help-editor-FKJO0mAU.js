import{o as c,c as u,a as h,t as m,F as b,i as E,w as g,f as k,r as U,$ as L,aM as be,k as ne,E as ke,a7 as oe,s as C}from"./addon-Bo3xgnnb.js";import{b as M}from"./lp-cluster-BVc_RpoU.js";import{c as S,d as H,s as ye,a as I,l as $e,f as xe,b as we,e as Ee}from"./code-dock-DTk1WH04.js";import{B as Se,x as ie,O as se,p as Te,K as Ce}from"./css-scope-mT3oQaBR.js";import{c as X,i as Ae,l as Le,a as Me,h as He,b as Pe,e as Fe,d as De,g as Oe,f as Be}from"./loop-inspector-CSNq7eUE.js";import"./protocol-BVdEmGBQ.js";import"./shortcuts-BBrEL-OT.js";import"./ChoiceDialog-BhmEfhvK.js";import"./ai-text-icon-B7uCWIwa.js";import"./codemirror-4dBPfaW3.js";import"./tw-candidates-CSP7aVNi.js";import"./component-extract-BWjmK-TX.js";import"./html-tag-sync-BpXNELva.js";import"./index-M2RCOyrL.js";import"./index-B5fiB6ig.js";import"./index-sh1K8s4m.js";import"./index-0IxPFT_m.js";import"./index-Ci-3qkVd.js";import"./index-DkhC0r6-.js";import"./index-B4S9JIPB.js";import"./index-BwRQ94Ql.js";import"./index-D9YSa79V.js";import"./index-DwJNgNWz.js";import"./utility-paint-DXCEnfCB.js";import"./utilities-DNDSVzBx.js";const ze=["aria-label"],Ie={"data-sve-help-head":""},Ne=["aria-selected","data-active","onMouseenter","onClick"],Ke={"data-sve-help-label":""},Re={key:0,"data-sve-help-meta":""},We={key:1,"data-sve-help-key":""},je={__name:"DockHelpPopup",props:{title:{type:String,default:""},closeLabel:{type:String,default:""},items:{type:Array,default:()=>[]},active:{type:Number,default:0},onAccept:{type:Function,required:!0},onHover:{type:Function,default:null}},setup(e){return(t,n)=>(c(),u("div",{"data-sve-help-popup":"",role:"listbox","aria-label":e.title},[h("div",Ie,[h("span",null,m(e.title),1),h("span",null,m(e.closeLabel),1)]),(c(!0),u(b,null,E(e.items,(a,s)=>(c(),u("button",{key:a.id,type:"button",role:"option","data-sve-help-option":"","aria-selected":s===e.active?"true":"false","data-active":s===e.active?"":void 0,onMousedown:n[0]||(n[0]=g(()=>{},["prevent"])),onMouseenter:o=>e.onHover&&e.onHover(s),onClick:g(o=>e.onAccept(s),["prevent","stop"])},[h("span",Ke,m(a.label),1),a.meta?(c(),u("span",Re,m(a.meta),1)):k("",!0),s===e.active?(c(),u("kbd",We,"Tab")):k("",!0)],40,Ne))),128))],8,ze))}},Ve=["aria-label"],Ue={"data-sve-help-head":""},Xe={"data-sve-help-body":""},Ye={"data-sve-help-seg":""},qe=["data-active","disabled","onClick"],Ge=["value","disabled"],Ze={key:0,value:""},Je=["value"],Qe=["value","disabled"],_e=["value"],et={key:2,"data-sve-help-box":""},tt=["value","placeholder","disabled"],nt=["title","disabled"],ot={"data-sve-help-sub":""},it=["value","disabled"],st=["value"],at={key:0,"data-sve-help-tick":""},lt=["checked","disabled"],rt={"data-sve-help-sub":""},dt=["value","disabled"],ct=["value"],ut={key:0,"data-sve-help-box":"","data-sve-help-gap":""},ft=["value","placeholder","disabled"],pt=["title","disabled"],mt={"data-sve-help-sub":""},ht=["value","placeholder","disabled"],gt={"data-sve-help-sub":""},vt=["value","placeholder","disabled"],Y='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',bt={__name:"DockHelpLoop",props:{inspect:{type:Object,required:!0},canEdit:{type:Boolean,default:!0},dataTitle:{type:String,default:""},closeLabel:{type:String,default:""},on:{type:Object,required:!0}},setup(e){const t=U(null),n=U(null);function a(s,o,i){!s||!o||(s.value=o,s.focus(),s.setSelectionRange(o.length,o.length),i(o))}return(s,o)=>(c(),u("div",{"data-sve-help-loop":"",role:"dialog","aria-label":e.inspect.title},[h("div",Ue,[h("span",null,m(e.inspect.title),1),h("span",null,m(e.closeLabel),1)]),h("div",Xe,[h("div",Ye,[(c(!0),u(b,null,E(e.inspect.kinds,i=>(c(),u("button",{key:i.id,type:"button","data-active":i.id===e.inspect.loopKind?"":void 0,disabled:!e.canEdit,onClick:r=>e.on.kind(i.id)},m(i.label),9,qe))),128))]),e.inspect.loopKind==="collection"?(c(),u("select",{key:e.inspect.key+":"+e.inspect.value,value:e.inspect.value,disabled:!e.canEdit,onChange:o[0]||(o[0]=i=>e.on.commit(i.target.value))},[e.inspect.value?k("",!0):(c(),u("option",Ze,m(e.inspect.placeholder),1)),(c(!0),u(b,null,E(e.inspect.collections,i=>(c(),u("option",{key:i.handle,value:i.handle},m(i.title),9,Je))),128))],40,Ge)):e.inspect.loopKind==="nav"?(c(),u("select",{key:e.inspect.key+":nav:"+e.inspect.value,value:e.inspect.value,disabled:!e.canEdit,onChange:o[1]||(o[1]=i=>e.on.commit(i.target.value))},[(c(!0),u(b,null,E(e.inspect.navs,i=>(c(),u("option",{key:i.handle,value:i.handle},m(i.title),9,_e))),128))],40,Qe)):(c(),u("div",et,[(c(),u("input",{ref_key:"field",ref:t,key:e.inspect.key,type:"text",value:e.inspect.value,placeholder:e.inspect.placeholder,disabled:!e.canEdit,spellcheck:"false",onKeydown:[o[2]||(o[2]=g(()=>{},["stop"])),o[3]||(o[3]=L(g(i=>e.on.commit(i.target.value),["prevent"]),["enter"]))],onBlur:o[4]||(o[4]=i=>e.on.commit(i.target.value))},null,40,tt)),h("button",{type:"button","data-sve-help-data":"",title:e.dataTitle,disabled:!e.canEdit,innerHTML:Y,onMousedown:o[5]||(o[5]=g(()=>{},["prevent"])),onClick:o[6]||(o[6]=g(i=>e.on.pickData(i.currentTarget,r=>a(t.value,r,e.on.commit)),["stop","prevent"]))},null,40,nt)])),e.inspect.nav?(c(),u(b,{key:3},[h("div",ot,m(e.inspect.nav.depthTitle),1),(c(),u("select",{key:e.inspect.key+":depth:"+e.inspect.nav.depth,value:e.inspect.nav.depth,disabled:!e.canEdit,onChange:o[7]||(o[7]=i=>e.on.depth(i.target.value))},[(c(!0),u(b,null,E(e.inspect.nav.depths,i=>(c(),u("option",{key:i.id,value:i.id},m(i.label),9,st))),128))],40,it)),e.inspect.nav.homeAsked?(c(),u("label",at,[h("input",{type:"checkbox",checked:e.inspect.nav.includeHome,disabled:!e.canEdit,onChange:o[8]||(o[8]=i=>e.on.includeHome(i.target.checked))},null,40,lt),h("span",null,m(e.inspect.nav.homeLabel),1)])):k("",!0)],64)):k("",!0),e.inspect.sort?(c(),u(b,{key:4},[h("div",rt,m(e.inspect.sort.title),1),(c(),u("select",{key:e.inspect.key+":dir:"+e.inspect.sort.dir,value:e.inspect.sort.dir,disabled:!e.canEdit,onChange:o[9]||(o[9]=i=>e.on.sortDir(i.target.value))},[(c(!0),u(b,null,E(e.inspect.sort.dirs,i=>(c(),u("option",{key:i.id,value:i.id},m(i.label),9,ct))),128))],40,dt)),e.inspect.sort.needsField?(c(),u("div",ut,[(c(),u("input",{ref_key:"sortField",ref:n,key:e.inspect.key+":field",type:"text",value:e.inspect.sort.field,placeholder:e.inspect.sort.placeholder,disabled:!e.canEdit,spellcheck:"false",onKeydown:[o[10]||(o[10]=g(()=>{},["stop"])),o[11]||(o[11]=L(g(i=>e.on.sortField(i.target.value),["prevent"]),["enter"]))],onBlur:o[12]||(o[12]=i=>e.on.sortField(i.target.value))},null,40,ft)),e.inspect.sort.pickable?(c(),u("button",{key:0,type:"button","data-sve-help-data":"",title:e.dataTitle,disabled:!e.canEdit,innerHTML:Y,onMousedown:o[13]||(o[13]=g(()=>{},["prevent"])),onClick:o[14]||(o[14]=g(i=>e.on.pickData(i.currentTarget,r=>a(n.value,r,e.on.sortField)),["stop","prevent"]))},null,40,pt)):k("",!0)])):k("",!0),h("div",mt,m(e.inspect.limit.title),1),(c(),u("input",{key:e.inspect.key+":limit",type:"number",min:"1",value:e.inspect.limit.value,placeholder:e.inspect.limit.placeholder,disabled:!e.canEdit,onKeydown:[o[15]||(o[15]=g(()=>{},["stop"])),o[16]||(o[16]=L(g(i=>e.on.limit(i.target.value),["prevent"]),["enter"]))],onBlur:o[17]||(o[17]=i=>e.on.limit(i.target.value))},null,40,ht)),h("div",gt,m(e.inspect.offset.title),1),(c(),u("input",{key:e.inspect.key+":offset",type:"number",min:"0",value:e.inspect.offset.value,placeholder:e.inspect.offset.placeholder,disabled:!e.canEdit,onKeydown:[o[18]||(o[18]=g(()=>{},["stop"])),o[19]||(o[19]=L(g(i=>e.on.offset(i.target.value),["prevent"]),["enter"]))],onBlur:o[20]||(o[20]=i=>e.on.offset(i.target.value))},null,40,vt))],64)):k("",!0)])],8,Ve))}},kt=3,ae=new Set(["text","textarea","markdown","bard"]),le=new Set(["markdown","bard"]),N=new Set(["grid","replicator"]),yt=new Set(["h1","h2","h3","h4","h5","h6","p","span","div","a","li","strong","em","small","blockquote","figcaption","label","button","td","th","dt","dd"]),$t=new Set(["ul","ol"]),xt=/^(title|heading|headline|name)$/,w=" › ",x="    ",wt=2;function Et(e,t,n={}){const a=String(e||""),s=Number(t);if(!Number.isFinite(s)||s<0||s>a.length)return[];const{fields:o=[],sectionPartial:i=!1,shellRoot:r="",locked:d=[]}=n;if(Tt([...Se(a),...d],s))return[];const l=ie(a),f=Ct(l,s);if(f)return[{id:"loop-ask",key:"code_dock_help_loop_ask",args:{name:f.name},meta:f.expr,changes:[],selection:null,loop:f}];const p=se(a),y=Te(a),B=re(a,y,s);if(!B)return[];const W=Array.isArray(o)?o.filter(V=>V&&typeof V.var=="string"):[],ve=Pt(W,l,s),A={source:a,masked:p,rows:W,scope:ve,...B},j=i&&B.node===y[0]?Bt(A,r):null;return[j,...It(A),...Kt(A),...j?[]:Rt(A)].filter(Boolean).slice(0,kt)}function St(e,t){const n=Number(t)||0;return n?{...e,changes:e.changes.map(a=>({...a,from:a.from-n,to:a.to-n})),selection:e.selection==null?null:e.selection-n}:e}function Tt(e,t){for(let n=0;n+1<e.length;n+=2)if(t>=e[n]&&t<e[n+1])return!0;return!1}function Ct(e,t){return e.find(n=>n.kind==="loop"&&t>=n.from&&t<=n.openTo)||null}function re(e,t,n,a=null){for(let s=0;s<t.length;s+=1){const o=t[s],i=At(e,o),r=i>=0?o.to-1:o.to;if(!(o.hidden||n<o.from||n>r))return re(e,o.children,n,o)||{node:o,parent:a,siblings:t,index:s,close:i}}return null}function At(e,t){if(Ce(t.tag)||t.to<=t.openTo)return-1;const n=e.slice(t.openTo,t.to).match(new RegExp(`</${t.tag}\\s*>$`,"i"));return n?t.to-n[0].length:-1}function de(e){const{source:t,node:n,close:a}=e;return a<0?/^\s*(<|\{\{|$)/.test(t.slice(n.openTo))?{to:n.openTo}:null:!n.children.length&&t.slice(n.openTo,a).trim()===""?{to:n.to}:null}function Lt(e,t){const n=e.lastIndexOf(`
`,t-1)+1;return/^[ \t]*/.exec(e.slice(n))[0]}function O(e){return{text:e.source.slice(e.node.from,e.node.openTo),masked:e.masked.slice(e.node.from,e.node.openTo)}}function P(e,t){return new RegExp(`\\s${t}\\s*=`,"i").test(e)}const ce=/\{\{\s*visual_edit\b[\s\S]*?\}\}/;function Mt(e,t){const n=/\s*\/?>$/.exec(e);return n?`${e.slice(0,n.index)} ${t}${e.slice(n.index)}`:`${e} ${t}`}function F(e,t,n){const a=1+t.length;return`${e.slice(0,a)} ${n}${e.slice(a)}`}function Ht(e,t,n){return P(t,"class")?e:F(e,n,'class=""')}function K(e,t){return ce.test(e)?e:Mt(e,t)}function Pt(e,t,n){const a=[];for(const s of t)if(!(s.kind!=="loop"||n<s.openTo||n>=s.to)){if(s.loopKind!=="field")return null;a.push(s.name)}return a}function Ft(e,t){if(!t)return[];const n=String(t).split(w),a=[];let s="";for(let o=0;o<n.length;o+=1){const i=n[o],r=e.find(d=>d.var===i&&(d.parent||"")===s);if(!r)return null;a.push(i),s=s?`${s}${w}${i}`:i,r.type==="replicator"&&o+1<n.length&&(o+=1,s=`${s}${w}${n[o]}`)}return a}function Dt(e,t){return!!e&&e.length===t.length&&e.every((n,a)=>n===t[a])}function ue(e){if(!e.scope)return[];const t=new Set;return e.rows.filter(n=>!Dt(Ft(e.rows,n.parent),e.scope)||t.has(n.var)?!1:(t.add(n.var),!0))}function q(e,t){return new RegExp(`\\{\\{\\s*${t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\s*(\\}\\}|\\|)`).test(e)}function fe(e,t){return[...t].sort((n,a)=>Number(q(e,n.var))-Number(q(e,a.var)))}function Ot(e,t){const n=t.parent?`${t.parent}${w}${t.var}`:t.var;if(t.type!=="replicator")return[{set:"",rows:e.filter(s=>s.parent===n)}];const a=new Map;for(const s of e){const o=String(s.parent||"");if(!o.startsWith(`${n}${w}`))continue;const i=o.slice(n.length+w.length);i.includes(w)||(a.has(i)||a.set(i,[]),a.get(i).push(s))}return[...a].map(([s,o])=>({set:s,rows:o}))}function Bt(e,t){const{node:n}=e,a=/<section\b[^>]*>/i.exec(zt(t));if(n.tag!=="section"||!a)return null;const s=String(t).slice(a.index,a.index+a[0].length),o=/\sid\s*=\s*"[^"]*"/i.exec(s),i=/\sclass\s*=\s*"[^"]*"/i.exec(s),r=ce.exec(s),d=O(e);if(!o||P(d.masked,"id"))return null;let l=F(d.text,"section",`${o[0].trim()}${P(d.masked,"class")||!i?"":` ${i[0].trim()}`}`);return r&&(l=K(l,r[0])),{id:"shell",key:"code_dock_help_shell",args:{},meta:"id-{{ id }}",changes:[{from:n.from,to:n.openTo,insert:l}],selection:n.from+l.length}}function zt(e){return se(String(e||""))}function It(e){const{source:t,node:n}=e,a=$t.has(n.tag)?de(e):null;return a?fe(t,ue(e).filter(o=>N.has(o.type))).map(o=>{const i=Lt(t,n.from),r=O(e),d=K(Ht(r.text,r.masked,n.tag),`{{ visual_edit field="${o.var}" outline_inside="true" insertable="true" }}`),l=`${i}${x}${x}`,f=[d,`${i}${x}{{ ${o.var} }}`,`${l}<li class="" {{ visual_edit orderable="true" }}>`,...pe(e.rows,o,`${l}${x}`,1),`${l}</li>`,`${i}${x}{{ /${o.var} }}`,`${i}</${n.tag}>`];return{id:`loop:${o.var}`,key:"code_dock_help_loop",args:{name:o.label||o.var},meta:[o.type,o.value].filter(Boolean).join(" · "),changes:[{from:n.from,to:a.to,insert:f.join(`
`)}],selection:n.from+f.slice(0,3).join(`
`).length}}):[]}function pe(e,t,n,a){const s=Ot(e,t).filter(r=>r.rows.some(G)),o=(r,d)=>r.rows.filter(G).flatMap(l=>Nt(e,l,d,a));if(!s.length)return[n];if(s.length===1)return o(s[0],n);const i=[];return s.forEach((r,d)=>{i.push(`${n}{{ ${d===0?"if":"elseif"} type == '${r.set}' }}`),i.push(...o(r,`${n}${x}`))}),i.push(`${n}{{ /if }}`),i}function G(e){return ae.has(e.type)||N.has(e.type)}function Nt(e,t,n,a){if(N.has(t.type))return a>=wt?[]:[`${n}{{ ${t.var} }}`,...pe(e,t,`${n}${x}`,a+1),`${n}{{ /${t.var} }}`];const s=le.has(t.type)?"div":xt.test(t.var)?"h3":"p";return[`${n}<${s} {{ visual_edit field="${t.var}" inline_edit="true" }}>{{ ${t.var} }}</${s}>`]}function Kt(e){const{source:t,node:n,close:a}=e;if(!yt.has(n.tag))return[];const s=a>=0?n.children.length||t.slice(n.openTo,a).includes("{{")?null:n.to:de(e)?.to;return s==null?[]:fe(t,ue(e).filter(i=>ae.has(i.type))).slice(0,2).map(i=>{const r=n.tag==="p"&&le.has(i.type)?"div":n.tag,d=O(e),l=r===n.tag?d.text:`<${r}${d.text.slice(1+n.tag.length)}`,f=K(l,`{{ visual_edit field="${i.var}" inline_edit="true" }}`),p=`{{ ${i.var} }}`,y=`${f}${p}</${r}>`;return{id:`text:${i.var}`,key:"code_dock_help_text",args:{name:i.label||i.var},meta:i.value||p,changes:[{from:n.from,to:s,insert:y}],selection:n.from+f.length+p.length}})}function Rt(e){const{node:t,siblings:n,index:a}=e,s=O(e);if(P(s.masked,"class"))return[];const o=[],i=n.slice(0,a).reverse().find(d=>d.tag===t.tag&&Z(e.source,d));if(i){const d=Z(e.source,i),l=F(s.text,t.tag,`class="${d}"`);o.push({id:"class-same",key:"code_dock_help_class_same",args:{tag:t.tag},meta:d,changes:[{from:t.from,to:t.openTo,insert:l}],selection:t.from+l.length})}const r=F(s.text,t.tag,'class=""');return o.push({id:"class",key:"code_dock_help_class",args:{},meta:'class=""',changes:[{from:t.from,to:t.openTo,insert:r}],selection:t.from+1+t.tag.length+8}),o}function Z(e,t){const n=/\sclass\s*=\s*"([^"]*)"/i.exec(e.slice(t.from,t.openTo)),a=n?n[1].trim():"";return a&&!a.includes("{{")?a:""}const J="__sve-help-styles",Wt=`
[data-sve-help-popup] {
  position: fixed;
  z-index: 99999;
  min-width: 15em;
  max-width: 26em;
  box-sizing: border-box;
  overflow: hidden;
  background: #262b3d;
  color: #d6dbe6;
  border: 1px solid #343b52;
  border-radius: 0.55em;
  box-shadow: 0 0.6em 1.6em rgba(0, 0, 0, 0.35);
  font: 500 0.8125rem/1.4 system-ui, -apple-system, "Segoe UI", sans-serif;
}
[data-sve-help-head] {
  display: flex;
  justify-content: space-between;
  gap: 1em;
  padding: 0.4em 0.75em;
  border-bottom: 1px solid #343b52;
  color: #8a93a8;
  font-size: 0.7rem;
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
[data-sve-help-option][data-active] {
  background: #33406b;
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
  color: #8a93a8;
  font: 0.72rem/1.4 ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}
[data-sve-help-key] {
  flex: 0 0 auto;
  padding: 0 0.4em;
  border: 1px solid #343b52;
  border-radius: 0.3em;
  color: #8a93a8;
  font: 0.7rem/1.5 ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}

/* The loop panel at the caret: the same look as the suggestions, the tree's controls inside. */
[data-sve-help-loop] {
  position: fixed;
  z-index: 99999;
  width: 17em;
  box-sizing: border-box;
  background: #262b3d;
  color: #d6dbe6;
  border: 1px solid #343b52;
  border-radius: 0.55em;
  box-shadow: 0 0.6em 1.6em rgba(0, 0, 0, 0.35);
  font: 500 0.8125rem/1.4 system-ui, -apple-system, "Segoe UI", sans-serif;
}
[data-sve-help-body] {
  padding: 0.6em 0.75em 0.75em;
}
[data-sve-help-sub] {
  margin: 0.8em 0 0.35em;
  color: #8a93a8;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
[data-sve-help-seg] {
  display: flex;
  gap: 0.2em;
  margin-bottom: 0.45em;
}
[data-sve-help-seg] button {
  all: unset;
  flex: 1 1 0;
  box-sizing: border-box;
  padding: 0.35em 0.5em;
  border-radius: 0.3em;
  background: rgba(128, 128, 128, 0.16);
  cursor: pointer;
  text-align: center;
  font-size: 0.6875rem;
}
[data-sve-help-seg] button[data-active] {
  background: #3858e9;
  color: #fff;
}
[data-sve-help-seg] button:disabled {
  cursor: default;
  opacity: 0.45;
}
[data-sve-help-body] input,
[data-sve-help-body] select {
  box-sizing: border-box;
  width: 100%;
  padding: 0.45em 0.6em;
  border-radius: 0.35em;
  border: 1px solid rgba(128, 128, 128, 0.35);
  background: rgba(0, 0, 0, 0.22);
  color: inherit;
  font: 0.6875rem/1.4 ui-monospace, "SF Mono", Menlo, Consolas, monospace;
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
  outline: 0.125rem solid #3858e9;
  outline-offset: -1px;
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
  background: rgba(128, 128, 128, 0.22);
}
[data-sve-help-tick] {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-top: 0.75em;
  font-size: 0.6875rem;
  cursor: pointer;
}
[data-sve-help-tick] input {
  width: auto;
  margin: 0;
  padding: 0;
  accent-color: #3858e9;
}
`;function jt(e){if(!e||e.getElementById(J))return;const t=e.createElement("style");t.id=J,t.textContent=Wt,e.head.appendChild(t)}const Q=new WeakMap,D=new WeakMap,z=4,T=8;function En(e,t){if(!e||!t||D.has(t))return;const n={win:e,view:t,open:null,writing:!1,gen:0,draft:""};D.set(t,n),t.dispatch({effects:me(t).reconfigure(Vt(n))})}function Sn(e){const t=D.get(e);t&&(v(t),D.delete(e),e.dispatch({effects:me(e).reconfigure([])}))}function me(e){let t=Q.get(e);return t||(t=new S.state.Compartment,Q.set(e,t),e.dispatch({effects:S.state.StateEffect.appendConfig.of(t.of([]))})),t}function Vt(e){const{EditorView:t,keymap:n}=S.view,{Prec:a}=S.state;return[t.updateListener.of(s=>{if(H.applying){e.open&&v(e);return}if(Ut(s)){_(e);return}if(e.open&&!e.writing&&(s.docChanged||s.selectionSet)){v(e);return}s.focusChanged&&!s.view.hasFocus&&e.open?.kind==="list"&&v(e)}),t.domEventHandlers({click:()=>(_(e),!1)}),a.highest(n.of([{key:"Tab",run:()=>ee(e)},{key:"Enter",run:()=>ee(e)},{key:"ArrowDown",run:()=>te(e,1)},{key:"ArrowUp",run:()=>te(e,-1)},{key:"Escape",run:()=>Zt(e)}]))]}function Ut(e){if(!e.docChanged)return!1;let t=!1;for(const s of e.transactions)s.isUserEvent("input.type")&&s.changes.iterChanges((o,i,r,d,l)=>{l.toString().endsWith(">")&&(t=!0)});if(!t)return!1;const n=e.state.selection.main.head,a=e.state.sliceDoc(Math.max(0,n-400),n);return/<[a-zA-Z][^<>]*>$/.test(a)}function _(e){const t=++e.gen;e.win.setTimeout(()=>{t===e.gen&&qt(e)},0)}function Xt(){return H.htmlScopeActive&&H.htmlFocus?H.htmlFocus.from:0}function Yt(){const e=we();return!!Ee(e)&&!e.startsWith("view:")&&!M("dock:chrome-kind")}async function qt(e){const{view:t,win:n}=e,a=e.gen;if(!t.hasFocus||t.state.readOnly||!t.state.selection.main.empty||S.autocomplete.completionStatus(t.state)==="active")return;const s=t.state.doc,o=await ye(n);if(a!==e.gen||t.state.doc!==s||!t.hasFocus||!t.state.selection.main.empty)return;const i=Xt(),r=I(),d=t.state.selection.main.head,l=Et(r,i+d,{fields:o,sectionPartial:Yt(),shellRoot:be(n),locked:$e(r)}).map(f=>St(f,i)).filter(f=>f.changes.every(p=>p.from>=0&&p.to<=t.state.doc.length));if(!l.length){v(e);return}Gt(e,l)}function Gt(e,t){const{win:n}=e;v(e);const a=ne({active:0}),s=ge(e,"list",{render:()=>oe(je,{title:C(n,"code_dock_help_title"),closeLabel:C(n,"code_dock_help_close"),items:t.map(o=>({id:o.id,label:C(n,o.key,o.args),meta:o.meta})),active:a.active,onAccept:o=>he(e,o),onHover:o=>{a.active=o}})});e.open.items=t,e.open.model=a,R(e,s)}function ee(e){return e.open?.kind!=="list"?!1:(he(e,e.open.model.active),!0)}function te(e,t){if(e.open?.kind!=="list")return!1;const{model:n,items:a}=e.open;return n.active=(n.active+t+a.length)%a.length,!0}function Zt(e){return e.open?(v(e),!0):!1}function he(e,t){const n=e.open?.items?.[t],{view:a}=e;if(n){if(v(e),n.id==="loop-ask"){Jt(e,n.loop.from);return}if(!(a.state.readOnly||!n.changes.length)){e.writing=!0;try{a.dispatch({changes:n.changes,...n.selection==null?{}:{selection:{anchor:n.selection}},userEvent:"input.toolbar"})}finally{e.writing=!1}xe(),n.id==="class"&&S.autocomplete.startCompletion(a)}}}function $(e){return Ae(ie(I()).find(t=>t.kind==="loop"&&t.from===e))}function Jt(e,t){const{win:n}=e,a=$(t);if(!a)return;e.draft="";const s=ne({inspect:X(n,a),canEdit:!e.view.state.readOnly&&M("dock:is-locked")!==!0}),o=()=>{const l=$(t);if(!l){v(e);return}s.inspect=X(n,l,{draft:e.draft})},i=l=>{if(!l||e.open?.kind!=="loop")return;const f=I(),p=$(t),y=p?l(f,p):f;if(y!==f){e.writing=!0;try{M("dock:set-html",y)}finally{e.writing=!1}}o()},r={kind:l=>i(Pe(n,$(t),l)),commit:l=>i(He($(t),l)),sortDir:l=>{const f=Me($(t),l);if(f.draft){e.draft=f.draft,o();return}e.draft="",i(f.edit)},sortField:l=>{const f=e.draft;e.draft="",i(Le($(t),l,f))},limit:l=>i(Be(l)),offset:l=>i(Oe(l)),depth:l=>i(De(l)),includeHome:l=>i(Fe(l)),pickData:(l,f)=>M("dock:data-menu",{anchor:l,at:t,onPick:p=>f(String(p?.var||"").trim())})},d=ge(e,"loop",{render:()=>oe(bt,{inspect:s.inspect,canEdit:s.canEdit,dataTitle:C(n,"data_vars_title"),closeLabel:C(n,"code_dock_help_close"),on:r})});R(e,d)}function ge(e,t,n){const{win:a}=e,s=a.document;jt(s);const o=s.createElement("div");s.body.appendChild(o);const i=ke(n);i.mount(o);const r=o.firstElementChild||o,d=()=>R(e,r),l=p=>{r.contains(p.target)||p.target.closest?.("[data-sve-data-menu]")||(r.contains(s.activeElement)&&s.activeElement.blur(),v(e))},f=p=>{p.key==="Escape"&&r.contains(p.target)&&(p.preventDefault(),p.stopPropagation(),v(e),e.view.focus())};return s.addEventListener("pointerdown",l,!0),s.addEventListener("keydown",f,!0),a.addEventListener("scroll",d,!0),a.addEventListener("resize",d),e.open={kind:t,el:r,host:o,app:i,unhook:()=>{s.removeEventListener("pointerdown",l,!0),s.removeEventListener("keydown",f,!0),a.removeEventListener("scroll",d,!0),a.removeEventListener("resize",d)}},r}function R(e,t){const{view:n,win:a}=e,s=n.coordsAtPos(n.state.selection.main.head);if(!s)return;const o=t.offsetWidth,i=t.offsetHeight,r=Math.max(T,Math.min(s.left,a.innerWidth-o-T));let d=s.bottom+z;d+i>a.innerHeight-T&&s.top-i-z>=T&&(d=s.top-i-z),t.style.left=`${r}px`,t.style.top=`${Math.max(T,d)}px`}function v(e){const t=e.open;t&&(e.open=null,t.unhook(),t.app.unmount(),t.host.remove())}export{Sn as disableHelp,En as enableHelp};
