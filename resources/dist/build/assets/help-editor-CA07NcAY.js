import{o as c,c as u,a as m,t as h,F as b,i as x,w as g,f as k,r as W,$ as M,aM as me,aN as ge,k as ee,E as ve,a7 as te,s as C}from"./addon-CMRFY2V-.js";import{bg as be,bh as ke,b as R}from"./lp-cluster-rp2m8j6V.js";import{c as T,d as H,s as ye,a as D,l as $e,b as we,o as Ee,f as xe,e as Te,g as Se}from"./code-dock-BPSre8ri.js";import{O as ne,p as Ce,K as Ae,B as Le,x as oe}from"./css-scope-mT3oQaBR.js";import{c as j,i as Pe,l as Me,a as Re,h as He,b as Oe,e as Fe,d as De,g as Be,f as ze}from"./loop-inspector-CA8L7q3z.js";import"./protocol-BVdEmGBQ.js";import"./shortcuts-BBrEL-OT.js";import"./ChoiceDialog-DW9cvPZj.js";import"./ai-text-icon-B7uCWIwa.js";import"./codemirror-DT1jkJRE.js";import"./tw-candidates-CSP7aVNi.js";import"./component-extract-CtUTTtrT.js";import"./html-tag-sync-BpXNELva.js";import"./index-M2RCOyrL.js";import"./index-B5fiB6ig.js";import"./index-sh1K8s4m.js";import"./index-0IxPFT_m.js";import"./index-Ci-3qkVd.js";import"./index-DkhC0r6-.js";import"./index-B4S9JIPB.js";import"./index-BwRQ94Ql.js";import"./index-D9YSa79V.js";import"./index-DwJNgNWz.js";import"./utility-paint-DXCEnfCB.js";import"./utilities-DNDSVzBx.js";const Ie=["aria-label"],Ne={"data-sve-help-head":""},Ke=["aria-selected","data-active","onMouseenter","onClick"],We={"data-sve-help-label":""},je={key:0,"data-sve-help-meta":""},Ue={key:1,"data-sve-help-key":""},Ve={__name:"DockHelpPopup",props:{title:{type:String,default:""},closeLabel:{type:String,default:""},items:{type:Array,default:()=>[]},active:{type:Number,default:0},onAccept:{type:Function,required:!0},onHover:{type:Function,default:null}},setup(e){return(n,t)=>(c(),u("div",{"data-sve-help-popup":"",role:"listbox","aria-label":e.title},[m("div",Ne,[m("span",null,h(e.title),1),m("span",null,h(e.closeLabel),1)]),(c(!0),u(b,null,x(e.items,(s,a)=>(c(),u("button",{key:s.id,type:"button",role:"option","data-sve-help-option":"","aria-selected":a===e.active?"true":"false","data-active":a===e.active?"":void 0,onMousedown:t[0]||(t[0]=g(()=>{},["prevent"])),onMouseenter:o=>e.onHover&&e.onHover(a),onClick:g(o=>e.onAccept(a),["prevent","stop"])},[m("span",We,h(s.label),1),s.meta?(c(),u("span",je,h(s.meta),1)):k("",!0),a===e.active?(c(),u("kbd",Ue,"Tab")):k("",!0)],40,Ke))),128))],8,Ie))}},Xe=["aria-label"],Ye={"data-sve-help-head":""},qe={"data-sve-help-body":""},Ge={"data-sve-help-seg":""},Ze=["data-active","disabled","onClick"],Je=["value","disabled"],Qe={key:0,value:""},_e=["value"],et=["value","disabled"],tt=["value"],nt={key:2,"data-sve-help-box":""},ot=["value","placeholder","disabled"],it=["title","disabled"],st={"data-sve-help-sub":""},at=["value","disabled"],lt=["value"],rt={key:0,"data-sve-help-tick":""},dt=["checked","disabled"],ct={"data-sve-help-sub":""},ut=["value","disabled"],ft=["value"],pt={key:0,"data-sve-help-box":"","data-sve-help-gap":""},ht=["value","placeholder","disabled"],mt=["title","disabled"],gt={"data-sve-help-sub":""},vt=["value","placeholder","disabled"],bt={"data-sve-help-sub":""},kt=["value","placeholder","disabled"],U='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',yt={__name:"DockHelpLoop",props:{inspect:{type:Object,required:!0},canEdit:{type:Boolean,default:!0},dataTitle:{type:String,default:""},closeLabel:{type:String,default:""},on:{type:Object,required:!0}},setup(e){const n=W(null),t=W(null);function s(a,o,i){!a||!o||(a.value=o,a.focus(),a.setSelectionRange(o.length,o.length),i(o))}return(a,o)=>(c(),u("div",{"data-sve-help-loop":"",role:"dialog","aria-label":e.inspect.title},[m("div",Ye,[m("span",null,h(e.inspect.title),1),m("span",null,h(e.closeLabel),1)]),m("div",qe,[m("div",Ge,[(c(!0),u(b,null,x(e.inspect.kinds,i=>(c(),u("button",{key:i.id,type:"button","data-active":i.id===e.inspect.loopKind?"":void 0,disabled:!e.canEdit,onClick:r=>e.on.kind(i.id)},h(i.label),9,Ze))),128))]),e.inspect.loopKind==="collection"?(c(),u("select",{key:e.inspect.key+":"+e.inspect.value,value:e.inspect.value,disabled:!e.canEdit,onChange:o[0]||(o[0]=i=>e.on.commit(i.target.value))},[e.inspect.value?k("",!0):(c(),u("option",Qe,h(e.inspect.placeholder),1)),(c(!0),u(b,null,x(e.inspect.collections,i=>(c(),u("option",{key:i.handle,value:i.handle},h(i.title),9,_e))),128))],40,Je)):e.inspect.loopKind==="nav"?(c(),u("select",{key:e.inspect.key+":nav:"+e.inspect.value,value:e.inspect.value,disabled:!e.canEdit,onChange:o[1]||(o[1]=i=>e.on.commit(i.target.value))},[(c(!0),u(b,null,x(e.inspect.navs,i=>(c(),u("option",{key:i.handle,value:i.handle},h(i.title),9,tt))),128))],40,et)):(c(),u("div",nt,[(c(),u("input",{ref_key:"field",ref:n,key:e.inspect.key,type:"text",value:e.inspect.value,placeholder:e.inspect.placeholder,disabled:!e.canEdit,spellcheck:"false",onKeydown:[o[2]||(o[2]=g(()=>{},["stop"])),o[3]||(o[3]=M(g(i=>e.on.commit(i.target.value),["prevent"]),["enter"]))],onBlur:o[4]||(o[4]=i=>e.on.commit(i.target.value))},null,40,ot)),m("button",{type:"button","data-sve-help-data":"",title:e.dataTitle,disabled:!e.canEdit,innerHTML:U,onMousedown:o[5]||(o[5]=g(()=>{},["prevent"])),onClick:o[6]||(o[6]=g(i=>e.on.pickData(i.currentTarget,r=>s(n.value,r,e.on.commit)),["stop","prevent"]))},null,40,it)])),e.inspect.nav?(c(),u(b,{key:3},[m("div",st,h(e.inspect.nav.depthTitle),1),(c(),u("select",{key:e.inspect.key+":depth:"+e.inspect.nav.depth,value:e.inspect.nav.depth,disabled:!e.canEdit,onChange:o[7]||(o[7]=i=>e.on.depth(i.target.value))},[(c(!0),u(b,null,x(e.inspect.nav.depths,i=>(c(),u("option",{key:i.id,value:i.id},h(i.label),9,lt))),128))],40,at)),e.inspect.nav.homeAsked?(c(),u("label",rt,[m("input",{type:"checkbox",checked:e.inspect.nav.includeHome,disabled:!e.canEdit,onChange:o[8]||(o[8]=i=>e.on.includeHome(i.target.checked))},null,40,dt),m("span",null,h(e.inspect.nav.homeLabel),1)])):k("",!0)],64)):k("",!0),e.inspect.sort?(c(),u(b,{key:4},[m("div",ct,h(e.inspect.sort.title),1),(c(),u("select",{key:e.inspect.key+":dir:"+e.inspect.sort.dir,value:e.inspect.sort.dir,disabled:!e.canEdit,onChange:o[9]||(o[9]=i=>e.on.sortDir(i.target.value))},[(c(!0),u(b,null,x(e.inspect.sort.dirs,i=>(c(),u("option",{key:i.id,value:i.id},h(i.label),9,ft))),128))],40,ut)),e.inspect.sort.needsField?(c(),u("div",pt,[(c(),u("input",{ref_key:"sortField",ref:t,key:e.inspect.key+":field",type:"text",value:e.inspect.sort.field,placeholder:e.inspect.sort.placeholder,disabled:!e.canEdit,spellcheck:"false",onKeydown:[o[10]||(o[10]=g(()=>{},["stop"])),o[11]||(o[11]=M(g(i=>e.on.sortField(i.target.value),["prevent"]),["enter"]))],onBlur:o[12]||(o[12]=i=>e.on.sortField(i.target.value))},null,40,ht)),e.inspect.sort.pickable?(c(),u("button",{key:0,type:"button","data-sve-help-data":"",title:e.dataTitle,disabled:!e.canEdit,innerHTML:U,onMousedown:o[13]||(o[13]=g(()=>{},["prevent"])),onClick:o[14]||(o[14]=g(i=>e.on.pickData(i.currentTarget,r=>s(t.value,r,e.on.sortField)),["stop","prevent"]))},null,40,mt)):k("",!0)])):k("",!0),m("div",gt,h(e.inspect.limit.title),1),(c(),u("input",{key:e.inspect.key+":limit",type:"number",min:"1",value:e.inspect.limit.value,placeholder:e.inspect.limit.placeholder,disabled:!e.canEdit,onKeydown:[o[15]||(o[15]=g(()=>{},["stop"])),o[16]||(o[16]=M(g(i=>e.on.limit(i.target.value),["prevent"]),["enter"]))],onBlur:o[17]||(o[17]=i=>e.on.limit(i.target.value))},null,40,vt)),m("div",bt,h(e.inspect.offset.title),1),(c(),u("input",{key:e.inspect.key+":offset",type:"number",min:"0",value:e.inspect.offset.value,placeholder:e.inspect.offset.placeholder,disabled:!e.canEdit,onKeydown:[o[18]||(o[18]=g(()=>{},["stop"])),o[19]||(o[19]=M(g(i=>e.on.offset(i.target.value),["prevent"]),["enter"]))],onBlur:o[20]||(o[20]=i=>e.on.offset(i.target.value))},null,40,kt))],64)):k("",!0)])],8,Xe))}},ie=new Set(["text","textarea","markdown","bard"]),se=new Set(["markdown","bard"]),B=new Set(["grid","replicator"]),$t=/^(title|heading|headline|name)$/,w=" › ",$="    ",wt=2,ae=/\{\{\s*visual_edit\b[\s\S]*?\}\}/;function Et(e,n,t){const s=ne(e),a=Ce(e),o=le(e,a,n);if(!o)return null;const i=t.blockPartials||{};return{source:e,masked:s,rows:t.rows,scope:Tt(t.blocks,n),blocks:t.blocks,...o,isRoot:o.node===a[0],sectionPartial:!!t.sectionPartial,shellRoot:String(t.shellRoot||""),blockPartials:{src:typeof i.src=="string"?i.src:"",handles:Array.isArray(i.handles)?i.handles.filter(r=>typeof r=="string"):[]}}}function le(e,n,t,s=null){for(let a=0;a<n.length;a+=1){const o=n[a],i=xt(e,o),r=i>=0?o.to-1:o.to;if(!(o.hidden||t<o.from||t>r))return le(e,o.children,t,o)||{node:o,parent:s,siblings:n,index:a,close:i}}return null}function xt(e,n){if(Ae(n.tag)||n.to<=n.openTo)return-1;const t=e.slice(n.openTo,n.to).match(new RegExp(`</${n.tag}\\s*>$`,"i"));return t?n.to-t[0].length:-1}function Tt(e,n){const t=[];for(const s of e)if(!(s.kind!=="loop"||n<s.openTo||n>=s.to)){if(s.loopKind!=="field")return null;t.push(s.name)}return t}function re(e){const{source:n,node:t,close:s}=e;return s<0?/^\s*(<|\{\{|$)/.test(n.slice(t.openTo))?{to:t.openTo}:null:!t.children.length&&n.slice(t.openTo,s).trim()===""?{to:t.to}:null}function St(e,n){const t=e.lastIndexOf(`
`,n-1)+1;return/^[ \t]*/.exec(e.slice(t))[0]}function P(e){return{text:e.source.slice(e.node.from,e.node.openTo),masked:e.masked.slice(e.node.from,e.node.openTo)}}function A(e,n){return new RegExp(`\\s${n}\\s*=`,"i").test(e)}function Ct(e,n){const t=/\s*\/?>$/.exec(e);return t?`${e.slice(0,t.index)} ${n}${e.slice(t.index)}`:`${e} ${n}`}function L(e,n,t){const s=1+n.length;return`${e.slice(0,s)} ${t}${e.slice(s)}`}function At(e,n,t){return A(n,"class")?e:L(e,t,'class=""')}function z(e,n){return ae.test(e)?e:Ct(e,n)}function V(e,n){const t=/\sclass\s*=\s*"([^"]*)"/i.exec(e.slice(n.from,n.openTo)),s=t?t[1].trim():"";return s&&!s.includes("{{")?s:""}function Lt(e){return ne(String(e||""))}function Pt(e,n){if(!n)return[];const t=String(n).split(w),s=[];let a="";for(let o=0;o<t.length;o+=1){const i=t[o],r=e.find(d=>d.var===i&&(d.parent||"")===a);if(!r)return null;s.push(i),a=a?`${a}${w}${i}`:i,r.type==="replicator"&&o+1<t.length&&(o+=1,a=`${a}${w}${t[o]}`)}return s}function Mt(e,n){return!!e&&e.length===n.length&&e.every((t,s)=>t===n[s])}function de(e){if(!e.scope)return[];const n=new Set;return e.rows.filter(t=>!Mt(Pt(e.rows,t.parent),e.scope)||n.has(t.var)?!1:(n.add(t.var),!0))}function X(e,n){return new RegExp(`\\{\\{\\s*${n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\s*(\\}\\}|\\|)`).test(e)}function ce(e,n){return[...n].sort((t,s)=>Number(X(e,t.var))-Number(X(e,s.var)))}function Rt(e,n){const t=n.parent?`${n.parent}${w}${n.var}`:n.var;if(n.type!=="replicator")return[{set:"",rows:e.filter(a=>a.parent===t)}];const s=new Map;for(const a of e){const o=String(a.parent||"");if(!o.startsWith(`${t}${w}`))continue;const i=o.slice(t.length+w.length);i.includes(w)||(s.has(i)||s.set(i,[]),s.get(i).push(a))}return[...s].map(([a,o])=>({set:a,rows:o}))}function ue(e,n,t,s){const a=Rt(e,n).filter(r=>r.rows.some(Y)),o=(r,d)=>r.rows.filter(Y).flatMap(l=>Ht(e,l,d,s));if(!a.length)return[t];if(a.length===1)return o(a[0],t);const i=[];return a.forEach((r,d)=>{i.push(`${t}{{ ${d===0?"if":"elseif"} type == '${r.set}' }}`),i.push(...o(r,`${t}${$}`))}),i.push(`${t}{{ /if }}`),i}function Y(e){return ie.has(e.type)||B.has(e.type)}function Ht(e,n,t,s){if(B.has(n.type))return s>=wt?[]:[`${t}{{ ${n.var} }}`,...ue(e,n,`${t}${$}`,s+1),`${t}{{ /${n.var} }}`];const a=se.has(n.type)?"div":$t.test(n.var)?"h3":"p";return[`${t}<${a} {{ visual_edit field="${n.var}" inline_edit="true" }}>{{ ${n.var} }}</${a}>`]}function Ot(e,n){return e.find(t=>t.kind==="loop"&&n>=t.from&&n<=t.openTo)||null}function Ft(e,n){const t=Ot(e,n);return t?[{id:"loop-ask",key:"code_dock_help_loop_ask",args:{name:t.name},meta:t.expr,changes:[],selection:null,after:"loop",loop:t}]:[]}function Dt(e){return e.sectionPartial&&e.isRoot&&e.node.tag==="section"}function Bt(e){if(!Dt(e))return[];const{node:n,shellRoot:t}=e,s=/<section\b[^>]*>/i.exec(Lt(t));if(!s)return[];const a=t.slice(s.index,s.index+s[0].length),o=/\sid\s*=\s*"[^"]*"/i.exec(a),i=/\sclass\s*=\s*"[^"]*"/i.exec(a),r=ae.exec(a),d=P(e);if(!o||A(d.masked,"id"))return[];let l=L(d.text,"section",`${o[0].trim()}${A(d.masked,"class")||!i?"":` ${i[0].trim()}`}`);return r&&(l=z(l,r[0])),[{id:"shell",key:"code_dock_help_shell",args:{},meta:"id-{{ id }}",changes:[{from:n.from,to:n.openTo,insert:l}],selection:n.from+l.length}]}const zt=new Set(["ul","ol"]);function It(e){const{source:n,node:t}=e,s=zt.has(t.tag)?re(e):null;return s?ce(n,de(e).filter(o=>B.has(o.type))).map(o=>{const i=St(n,t.from),r=P(e),d=z(At(r.text,r.masked,t.tag),`{{ visual_edit field="${o.var}" outline_inside="true" insertable="true" }}`),l=`${i}${$}${$}`,f=[d,`${i}${$}{{ ${o.var} }}`,`${l}<li class="" {{ visual_edit orderable="true" }}>`,...ue(e.rows,o,`${l}${$}`,1),`${l}</li>`,`${i}${$}{{ /${o.var} }}`,`${i}</${t.tag}>`];return{id:`loop:${o.var}`,key:"code_dock_help_loop",args:{name:o.label||o.var},meta:[o.type,o.value].filter(Boolean).join(" · "),changes:[{from:t.from,to:s.to,insert:f.join(`
`)}],selection:t.from+f.slice(0,3).join(`
`).length}}):[]}const Nt=new Set(["h1","h2","h3","h4","h5","h6","p","span","div","a","li","strong","em","small","blockquote","figcaption","label","button","td","th","dt","dd"]),Kt=2;function Wt(e){const{source:n,node:t,close:s}=e;if(!Nt.has(t.tag))return[];const a=s>=0?t.children.length||n.slice(t.openTo,s).includes("{{")?null:t.to:re(e)?.to;return a==null?[]:ce(n,de(e).filter(i=>ie.has(i.type))).slice(0,Kt).map(i=>{const r=t.tag==="p"&&se.has(i.type)?"div":t.tag,d=P(e),l=r===t.tag?d.text:`<${r}${d.text.slice(1+t.tag.length)}`,f=z(l,`{{ visual_edit field="${i.var}" inline_edit="true" }}`),p=`{{ ${i.var} }}`,E=`${f}${p}</${r}>`;return{id:`text:${i.var}`,key:"code_dock_help_text",args:{name:i.label||i.var},meta:i.value||p,changes:[{from:t.from,to:a,insert:E}],selection:t.from+f.length+p.length}})}function jt(e,n){const{node:t,siblings:s,index:a}=e,o=P(e);if(A(o.masked,"class")||n.some(l=>l.id==="shell"))return[];const i=[],r=s.slice(0,a).reverse().find(l=>l.tag===t.tag&&V(e.source,l));if(r){const l=V(e.source,r),f=L(o.text,t.tag,`class="${l}"`);i.push({id:"class-same",key:"code_dock_help_class_same",args:{tag:t.tag},meta:l,changes:[{from:t.from,to:t.openTo,insert:f}],selection:t.from+f.length})}const d=L(o.text,t.tag,'class=""');return i.push({id:"class",key:"code_dock_help_class",args:{},meta:'class=""',changes:[{from:t.from,to:t.openTo,insert:d}],selection:t.from+1+t.tag.length+8,after:"class"}),i}function Ut(e,n){const{node:t,scope:s}=e,a=P(e);if(A(a.masked,"id")||!s||s.length||n.some(i=>i.id==="shell"))return[];const o=L(a.text,t.tag,'id=""');return[{id:"id",key:"code_dock_help_id",args:{},meta:'id=""',changes:[{from:t.from,to:t.openTo,insert:o}],selection:t.from+1+t.tag.length+5}]}const Vt=[Bt,It,Wt,jt],Xt=[Ut];function Yt(e,n,t=Vt,s=Xt){const a=q(t,e,[]).slice(0,n);return[...a,...q(s,e,a)]}function q(e,n,t){const s=[...t],a=s.length;for(const o of e)s.push(...(o(n,s)||[]).filter(Boolean));return s.slice(a)}const qt=3;function Gt(e,n,t={}){const s=String(e||""),a=Number(n);if(!Number.isFinite(a)||a<0||a>s.length)return[];const{fields:o=[],sectionPartial:i=!1,shellRoot:r="",blockPartials:d=null,locked:l=[]}=t;if(Jt([...Le(s),...l],a))return[];const f=oe(s),p=Ft(f,a);if(p.length)return p;const E=Array.isArray(o)?o.filter(K=>K&&typeof K.var=="string"):[],N=Et(s,a,{rows:E,blocks:f,sectionPartial:i,shellRoot:r,blockPartials:d});return N?Yt(N,qt):[]}function Zt(e,n){const t=Number(n)||0;return t?{...e,changes:e.changes.map(s=>({...s,from:s.from-t,to:s.to-t})),selection:e.selection==null?null:e.selection-t}:e}function Jt(e,n){for(let t=0;t+1<e.length;t+=2)if(n>=e[t]&&n<e[t+1])return!0;return!1}const G="__sve-help-styles",Qt=`
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

/* The loop panel at the caret: the same look as the suggestions, the tree's controls inside. */
[data-sve-help-loop] {
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
`;function _t(e){if(!e||e.getElementById(G))return;const n=e.createElement("style");n.id=G,n.textContent=Qt,e.head.appendChild(n)}const Z=new WeakMap,O=new WeakMap,F=4,S=8;function On(e,n){if(!e||!n||O.has(n))return;const t={win:e,view:n,open:null,writing:!1,gen:0,draft:""};O.set(n,t),n.dispatch({effects:fe(n).reconfigure(en(t))})}function Fn(e){const n=O.get(e);n&&(v(n),O.delete(e),e.dispatch({effects:fe(e).reconfigure([])}))}function fe(e){let n=Z.get(e);return n||(n=new T.state.Compartment,Z.set(e,n),e.dispatch({effects:T.state.StateEffect.appendConfig.of(n.of([]))})),n}function en(e){const{EditorView:n,keymap:t}=T.view,{Prec:s}=T.state;return[n.updateListener.of(a=>{if(H.applying){e.open&&v(e);return}if(tn(a)){J(e);return}if(e.open&&!e.writing&&(a.docChanged||a.selectionSet)){v(e);return}a.focusChanged&&!a.view.hasFocus&&e.open?.kind==="list"&&v(e)}),n.domEventHandlers({click:()=>(be(e.win)&&J(e),!1)}),s.highest(t.of([{key:"Tab",run:()=>Q(e)},{key:"Enter",run:()=>Q(e)},{key:"ArrowDown",run:()=>_(e,1)},{key:"ArrowUp",run:()=>_(e,-1)},{key:"Escape",run:()=>ln(e)}]))]}function tn(e){if(!e.docChanged)return!1;let n=!1;for(const a of e.transactions)a.isUserEvent("input.type")&&a.changes.iterChanges((o,i,r,d,l)=>{l.toString().endsWith(">")&&(n=!0)});if(!n)return!1;const t=e.state.selection.main.head,s=e.state.sliceDoc(Math.max(0,t-400),t);return/<[a-zA-Z][^<>]*>$/.test(s)}function J(e){const n=++e.gen;e.win.setTimeout(()=>{n===e.gen&&sn(e)},0)}function nn(){return H.htmlScopeActive&&H.htmlFocus?H.htmlFocus.from:0}function on(){const e=Te();return!!Se(e)&&!e.startsWith("view:")&&!R("dock:chrome-kind")}async function sn(e){const{view:n,win:t}=e,s=e.gen;if(!n.hasFocus||n.state.readOnly||!n.state.selection.main.empty||T.autocomplete.completionStatus(n.state)==="active")return;const a=n.state.doc,o=await ye(t);if(s!==e.gen||n.state.doc!==a||!n.hasFocus||!n.state.selection.main.empty)return;const i=nn(),r=D(),d=n.state.selection.main.head,l=Gt(r,i+d,{fields:o,sectionPartial:on(),shellRoot:ge(t),blockPartials:me(t),locked:$e(r)}).map(f=>Zt(f,i)).filter(f=>f.changes.every(p=>p.from>=0&&p.to<=n.state.doc.length));if(!l.length){v(e);return}an(e,l)}function an(e,n){const{win:t}=e;v(e);const s=ee({active:0}),a=he(e,"list",{render:()=>te(Ve,{title:C(t,"code_dock_help_title"),closeLabel:C(t,"code_dock_help_close"),items:n.map(o=>({id:o.id,label:C(t,o.key,o.args),meta:o.meta})),active:s.active,onAccept:o=>pe(e,o),onHover:o=>{s.active=o}})});e.open.items=n,e.open.model=s,I(e,a)}function Q(e){return e.open?.kind!=="list"?!1:(pe(e,e.open.model.active),!0)}function _(e,n){if(e.open?.kind!=="list")return!1;const{model:t,items:s}=e.open;return t.active=(t.active+n+s.length)%s.length,!0}function ln(e){return e.open?(v(e),!0):!1}function pe(e,n){const t=e.open?.items?.[n],{view:s}=e;if(t){if(v(e),t.after==="loop"){rn(e,t.loop.from);return}if(!(s.state.readOnly||!t.changes.length)){if(t.after==="class"&&ke(e.win)){const a=we(e.win);if(a){Ee(e.win,a);return}}e.writing=!0;try{s.dispatch({changes:t.changes,...t.selection==null?{}:{selection:{anchor:t.selection}},userEvent:"input.toolbar"})}finally{e.writing=!1}xe(),t.after==="class"&&T.autocomplete.startCompletion(s)}}}function y(e){return Pe(oe(D()).find(n=>n.kind==="loop"&&n.from===e))}function rn(e,n){const{win:t}=e,s=y(n);if(!s)return;e.draft="";const a=ee({inspect:j(t,s),canEdit:!e.view.state.readOnly&&R("dock:is-locked")!==!0}),o=()=>{const l=y(n);if(!l){v(e);return}a.inspect=j(t,l,{draft:e.draft})},i=l=>{if(!l||e.open?.kind!=="loop")return;const f=D(),p=y(n),E=p?l(f,p):f;if(E!==f){e.writing=!0;try{R("dock:set-html",E)}finally{e.writing=!1}}o()},r={kind:l=>i(Oe(t,y(n),l)),commit:l=>i(He(y(n),l)),sortDir:l=>{const f=Re(y(n),l);if(f.draft){e.draft=f.draft,o();return}e.draft="",i(f.edit)},sortField:l=>{const f=e.draft;e.draft="",i(Me(y(n),l,f))},limit:l=>i(ze(l)),offset:l=>i(Be(l)),depth:l=>i(De(l)),includeHome:l=>i(Fe(l)),pickData:(l,f)=>R("dock:data-menu",{anchor:l,at:n,onPick:p=>f(String(p?.var||"").trim())})},d=he(e,"loop",{render:()=>te(yt,{inspect:a.inspect,canEdit:a.canEdit,dataTitle:C(t,"data_vars_title"),closeLabel:C(t,"code_dock_help_close"),on:r})});I(e,d)}function he(e,n,t){const{win:s}=e,a=s.document;_t(a);const o=a.createElement("div");a.body.appendChild(o);const i=ve(t);i.mount(o);const r=o.firstElementChild||o,d=()=>I(e,r),l=p=>{r.contains(p.target)||p.target.closest?.("[data-sve-data-menu]")||(r.contains(a.activeElement)&&a.activeElement.blur(),v(e))},f=p=>{p.key==="Escape"&&r.contains(p.target)&&(p.preventDefault(),p.stopPropagation(),v(e),e.view.focus())};return a.addEventListener("pointerdown",l,!0),a.addEventListener("keydown",f,!0),s.addEventListener("scroll",d,!0),s.addEventListener("resize",d),e.open={kind:n,el:r,host:o,app:i,unhook:()=>{a.removeEventListener("pointerdown",l,!0),a.removeEventListener("keydown",f,!0),s.removeEventListener("scroll",d,!0),s.removeEventListener("resize",d)}},r}function I(e,n){const{view:t,win:s}=e,a=t.coordsAtPos(t.state.selection.main.head);if(!a)return;const o=n.offsetWidth,i=n.offsetHeight,r=Math.max(S,Math.min(a.left,s.innerWidth-o-S));let d=a.bottom+F;d+i>s.innerHeight-S&&a.top-i-F>=S&&(d=a.top-i-F),n.style.left=`${r}px`,n.style.top=`${Math.max(S,d)}px`}function v(e){const n=e.open;n&&(e.open=null,n.unhook(),n.app.unmount(),n.host.remove())}export{Fn as disableHelp,On as enableHelp};
