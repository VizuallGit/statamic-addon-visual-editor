import{o as f,c as p,a as m,t as h,F as w,i as P,w as g,f as E,r as oe,$ as N,aM as He,aN as Fe,k as ge,E as De,a7 as ve,s as H}from"./addon-C6ikH7xd.js";import{bg as Oe,bh as Be,b as z}from"./lp-cluster-B6RyFEk-.js";import{c as C,d as I,s as Ne,a as Z,l as ze,b as Ie,o as Ke,f as je,e as We,g as Ue}from"./code-dock-DQXThV6o.js";import{O as be,p as Ve,K as Ye,B as Xe,x as ke}from"./css-scope-mT3oQaBR.js";import{c as ie,i as qe,l as Ge,a as Ze,h as Je,b as Qe,e as _e,d as et,g as tt,f as nt}from"./loop-inspector-B0SCgdYe.js";import"./protocol-BVdEmGBQ.js";import"./shortcuts-BBrEL-OT.js";import"./ChoiceDialog-BVpbBNta.js";import"./ai-text-icon-B7uCWIwa.js";import"./codemirror-C8qq5LXV.js";import"./tw-candidates-CSP7aVNi.js";import"./component-extract-DhxEx7Ue.js";import"./html-tag-sync-BpXNELva.js";import"./index-M2RCOyrL.js";import"./index-B5fiB6ig.js";import"./index-sh1K8s4m.js";import"./index-0IxPFT_m.js";import"./index-Ci-3qkVd.js";import"./index-DkhC0r6-.js";import"./index-B4S9JIPB.js";import"./index-BwRQ94Ql.js";import"./index-D9YSa79V.js";import"./index-DwJNgNWz.js";import"./utility-paint-DXCEnfCB.js";import"./utilities-DNDSVzBx.js";const ot=["aria-label"],it={"data-sve-help-head":""},st=["aria-selected","data-active","onMouseenter","onClick"],at={"data-sve-help-label":""},rt={key:0,"data-sve-help-meta":""},lt={key:1,"data-sve-help-key":""},dt={__name:"DockHelpPopup",props:{title:{type:String,default:""},closeLabel:{type:String,default:""},items:{type:Array,default:()=>[]},active:{type:Number,default:0},onAccept:{type:Function,required:!0},onHover:{type:Function,default:null}},setup(e){return(t,n)=>(f(),p("div",{"data-sve-help-popup":"",role:"listbox","aria-label":e.title},[m("div",it,[m("span",null,h(e.title),1),m("span",null,h(e.closeLabel),1)]),(f(!0),p(w,null,P(e.items,(i,a)=>(f(),p("button",{key:i.id,type:"button",role:"option","data-sve-help-option":"","aria-selected":a===e.active?"true":"false","data-active":a===e.active?"":void 0,onMousedown:n[0]||(n[0]=g(()=>{},["prevent"])),onMouseenter:o=>e.onHover&&e.onHover(a),onClick:g(o=>e.onAccept(a),["prevent","stop"])},[m("span",at,h(i.label),1),i.meta?(f(),p("span",rt,h(i.meta),1)):E("",!0),a===e.active?(f(),p("kbd",lt,"Tab")):E("",!0)],40,st))),128))],8,ot))}},ct=["aria-label"],ut={"data-sve-help-head":""},ft={"data-sve-help-body":""},pt={"data-sve-help-seg":""},ht=["data-active","disabled","onClick"],mt=["value","disabled"],gt={key:0,value:""},vt=["value"],bt=["value","disabled"],kt=["value"],yt={key:2,"data-sve-help-box":""},$t=["value","placeholder","disabled"],wt=["title","disabled"],Et={"data-sve-help-sub":""},Tt=["value","disabled"],St=["value"],Lt={key:0,"data-sve-help-tick":""},At=["checked","disabled"],Pt={"data-sve-help-sub":""},Ct=["value","disabled"],xt=["value"],Rt={key:0,"data-sve-help-box":"","data-sve-help-gap":""},Mt=["value","placeholder","disabled"],Ht=["title","disabled"],Ft={"data-sve-help-sub":""},Dt=["value","placeholder","disabled"],Ot={"data-sve-help-sub":""},Bt=["value","placeholder","disabled"],se='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',Nt={__name:"DockHelpLoop",props:{inspect:{type:Object,required:!0},canEdit:{type:Boolean,default:!0},dataTitle:{type:String,default:""},closeLabel:{type:String,default:""},on:{type:Object,required:!0}},setup(e){const t=oe(null),n=oe(null);function i(a,o,s){!a||!o||(a.value=o,a.focus(),a.setSelectionRange(o.length,o.length),s(o))}return(a,o)=>(f(),p("div",{"data-sve-help-loop":"",role:"dialog","aria-label":e.inspect.title},[m("div",ut,[m("span",null,h(e.inspect.title),1),m("span",null,h(e.closeLabel),1)]),m("div",ft,[m("div",pt,[(f(!0),p(w,null,P(e.inspect.kinds,s=>(f(),p("button",{key:s.id,type:"button","data-active":s.id===e.inspect.loopKind?"":void 0,disabled:!e.canEdit,onClick:l=>e.on.kind(s.id)},h(s.label),9,ht))),128))]),e.inspect.loopKind==="collection"?(f(),p("select",{key:e.inspect.key+":"+e.inspect.value,value:e.inspect.value,disabled:!e.canEdit,onChange:o[0]||(o[0]=s=>e.on.commit(s.target.value))},[e.inspect.value?E("",!0):(f(),p("option",gt,h(e.inspect.placeholder),1)),(f(!0),p(w,null,P(e.inspect.collections,s=>(f(),p("option",{key:s.handle,value:s.handle},h(s.title),9,vt))),128))],40,mt)):e.inspect.loopKind==="nav"?(f(),p("select",{key:e.inspect.key+":nav:"+e.inspect.value,value:e.inspect.value,disabled:!e.canEdit,onChange:o[1]||(o[1]=s=>e.on.commit(s.target.value))},[(f(!0),p(w,null,P(e.inspect.navs,s=>(f(),p("option",{key:s.handle,value:s.handle},h(s.title),9,kt))),128))],40,bt)):(f(),p("div",yt,[(f(),p("input",{ref_key:"field",ref:t,key:e.inspect.key,type:"text",value:e.inspect.value,placeholder:e.inspect.placeholder,disabled:!e.canEdit,spellcheck:"false",onKeydown:[o[2]||(o[2]=g(()=>{},["stop"])),o[3]||(o[3]=N(g(s=>e.on.commit(s.target.value),["prevent"]),["enter"]))],onBlur:o[4]||(o[4]=s=>e.on.commit(s.target.value))},null,40,$t)),m("button",{type:"button","data-sve-help-data":"",title:e.dataTitle,disabled:!e.canEdit,innerHTML:se,onMousedown:o[5]||(o[5]=g(()=>{},["prevent"])),onClick:o[6]||(o[6]=g(s=>e.on.pickData(s.currentTarget,l=>i(t.value,l,e.on.commit)),["stop","prevent"]))},null,40,wt)])),e.inspect.nav?(f(),p(w,{key:3},[m("div",Et,h(e.inspect.nav.depthTitle),1),(f(),p("select",{key:e.inspect.key+":depth:"+e.inspect.nav.depth,value:e.inspect.nav.depth,disabled:!e.canEdit,onChange:o[7]||(o[7]=s=>e.on.depth(s.target.value))},[(f(!0),p(w,null,P(e.inspect.nav.depths,s=>(f(),p("option",{key:s.id,value:s.id},h(s.label),9,St))),128))],40,Tt)),e.inspect.nav.homeAsked?(f(),p("label",Lt,[m("input",{type:"checkbox",checked:e.inspect.nav.includeHome,disabled:!e.canEdit,onChange:o[8]||(o[8]=s=>e.on.includeHome(s.target.checked))},null,40,At),m("span",null,h(e.inspect.nav.homeLabel),1)])):E("",!0)],64)):E("",!0),e.inspect.sort?(f(),p(w,{key:4},[m("div",Pt,h(e.inspect.sort.title),1),(f(),p("select",{key:e.inspect.key+":dir:"+e.inspect.sort.dir,value:e.inspect.sort.dir,disabled:!e.canEdit,onChange:o[9]||(o[9]=s=>e.on.sortDir(s.target.value))},[(f(!0),p(w,null,P(e.inspect.sort.dirs,s=>(f(),p("option",{key:s.id,value:s.id},h(s.label),9,xt))),128))],40,Ct)),e.inspect.sort.needsField?(f(),p("div",Rt,[(f(),p("input",{ref_key:"sortField",ref:n,key:e.inspect.key+":field",type:"text",value:e.inspect.sort.field,placeholder:e.inspect.sort.placeholder,disabled:!e.canEdit,spellcheck:"false",onKeydown:[o[10]||(o[10]=g(()=>{},["stop"])),o[11]||(o[11]=N(g(s=>e.on.sortField(s.target.value),["prevent"]),["enter"]))],onBlur:o[12]||(o[12]=s=>e.on.sortField(s.target.value))},null,40,Mt)),e.inspect.sort.pickable?(f(),p("button",{key:0,type:"button","data-sve-help-data":"",title:e.dataTitle,disabled:!e.canEdit,innerHTML:se,onMousedown:o[13]||(o[13]=g(()=>{},["prevent"])),onClick:o[14]||(o[14]=g(s=>e.on.pickData(s.currentTarget,l=>i(n.value,l,e.on.sortField)),["stop","prevent"]))},null,40,Ht)):E("",!0)])):E("",!0),m("div",Ft,h(e.inspect.limit.title),1),(f(),p("input",{key:e.inspect.key+":limit",type:"number",min:"1",value:e.inspect.limit.value,placeholder:e.inspect.limit.placeholder,disabled:!e.canEdit,onKeydown:[o[15]||(o[15]=g(()=>{},["stop"])),o[16]||(o[16]=N(g(s=>e.on.limit(s.target.value),["prevent"]),["enter"]))],onBlur:o[17]||(o[17]=s=>e.on.limit(s.target.value))},null,40,Dt)),m("div",Ot,h(e.inspect.offset.title),1),(f(),p("input",{key:e.inspect.key+":offset",type:"number",min:"0",value:e.inspect.offset.value,placeholder:e.inspect.offset.placeholder,disabled:!e.canEdit,onKeydown:[o[18]||(o[18]=g(()=>{},["stop"])),o[19]||(o[19]=N(g(s=>e.on.offset(s.target.value),["prevent"]),["enter"]))],onBlur:o[20]||(o[20]=s=>e.on.offset(s.target.value))},null,40,Bt))],64)):E("",!0)])],8,ct))}},J=new Set(["text","textarea","markdown","bard"]),F=new Set(["markdown","bard"]),W=new Set(["grid","replicator"]),zt=new Set(["assets"]),ye=new Set(["link"]),X=/^(title|heading|headline|name)$/,L=" › ",v="    ",It=2,$e=/\{\{\s*visual_edit\b[\s\S]*?\}\}/;function Kt(e,t,n){const i=be(e),a=Ve(e),o=Ee(e,a,t);if(!o)return null;const s=n.blockPartials||{};return{source:e,masked:i,rows:n.rows,scope:Wt(n.blocks,t),blocks:n.blocks,...o,isRoot:o.node===a[0],sectionPartial:!!n.sectionPartial,shellRoot:String(n.shellRoot||""),blockPartials:{src:typeof s.src=="string"?s.src:"",handles:Array.isArray(s.handles)?s.handles.filter(l=>typeof l=="string"):[],image:typeof s.image=="string"?s.image:""}}}function we(e,t){return e.blockPartials.src.replace(/\{[A-Za-z_][A-Za-z0-9_]*\}/,t)}function Q(e,t){return!!e.blockPartials.src&&e.blockPartials.handles.includes(t)}function q(e){return t=>Q(e,t)?we(e,t):""}function _(e,t){return t.type==="replicator"&&te(e.rows,t).some(n=>Q(e,n.set))}function Ee(e,t,n,i=null){for(let a=0;a<t.length;a+=1){const o=t[a],s=jt(e,o),l=s>=0?o.to-1:o.to;if(!(o.hidden||n<o.from||n>l))return Ee(e,o.children,n,o)||{node:o,parent:i,siblings:t,index:a,close:s}}return null}function jt(e,t){if(Ye(t.tag)||t.to<=t.openTo)return-1;const n=e.slice(t.openTo,t.to).match(new RegExp(`</${t.tag}\\s*>$`,"i"));return n?t.to-n[0].length:-1}function Wt(e,t){const n=[];for(const i of e)if(!(i.kind!=="loop"||t<i.openTo||t>=i.to)){if(i.loopKind!=="field")return null;n.push(i.name)}return n}function D(e){const{source:t,node:n,close:i}=e;return i<0?/^\s*(<|\{\{|$)/.test(t.slice(n.openTo))?{to:n.openTo}:null:!n.children.length&&t.slice(n.openTo,i).trim()===""?{to:n.to}:null}function U(e,t){const n=e.lastIndexOf(`
`,t-1)+1;return/^[ \t]*/.exec(e.slice(n))[0]}function y(e){return{text:e.source.slice(e.node.from,e.node.openTo),masked:e.masked.slice(e.node.from,e.node.openTo)}}function b(e,t){return new RegExp(`\\s${t}\\s*=`,"i").test(e)}function Ut(e,t){const n=/\s*\/?>$/.exec(e);return n?`${e.slice(0,n.index)} ${t}${e.slice(n.index)}`:`${e} ${t}`}function T(e,t,n){const i=1+t.length;return`${e.slice(0,i)} ${n}${e.slice(i)}`}function ee(e,t,n){return b(t,"class")?e:T(e,n,'class=""')}function R(e,t){return $e.test(e)?e:Ut(e,t)}function G(e,t){const n=/\sclass\s*=\s*"([^"]*)"/i.exec(e.slice(t.from,t.openTo)),i=n?n[1].trim():"";return i&&!i.includes("{{")?i:""}function Vt(e){return be(String(e||""))}function Yt(e,t){if(!t)return[];const n=String(t).split(L),i=[];let a="";for(let o=0;o<n.length;o+=1){const s=n[o],l=e.find(d=>d.var===s&&(d.parent||"")===a);if(!l)return null;i.push(s),a=a?`${a}${L}${s}`:s,l.type==="replicator"&&o+1<n.length&&(o+=1,a=`${a}${L}${n[o]}`)}return i}function Xt(e,t){return!!e&&e.length===t.length&&e.every((n,i)=>n===t[i])}function O(e){if(!e.scope)return[];const t=new Set;return e.rows.filter(n=>!Xt(Yt(e.rows,n.parent),e.scope)||t.has(n.var)?!1:(t.add(n.var),!0))}function ae(e,t){return new RegExp(`\\{\\{\\s*${t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\s*(\\}\\}|\\|)`).test(e)}function x(e,t){return[...t].sort((n,i)=>Number(ae(e,n.var))-Number(ae(e,i.var)))}function te(e,t){const n=t.parent?`${t.parent}${L}${t.var}`:t.var;if(t.type!=="replicator")return[{set:"",rows:e.filter(a=>a.parent===n)}];const i=new Map;for(const a of e){const o=String(a.parent||"");if(!o.startsWith(`${n}${L}`))continue;const s=o.slice(n.length+L.length);s.includes(L)||(i.has(s)||i.set(s,[]),i.get(s).push(a))}return[...i].map(([a,o])=>({set:a,rows:o}))}const Te=()=>"";function K(e,t,n,i,a=Te){const o=te(e,t).filter(d=>a(d.set)||d.rows.some(re)),s=(d,r)=>a(d.set)?[`${r}{{ partial src="${a(d.set)}" }}`]:d.rows.filter(re).flatMap(c=>qt(e,c,r,i,a));if(!o.length)return[n];if(o.length===1)return s(o[0],n);const l=[];return o.forEach((d,r)=>{l.push(`${n}{{ ${r===0?"if":"elseif"} type == '${d.set}' }}`),l.push(...s(d,`${n}${v}`))}),l.push(`${n}{{ /if }}`),l}function re(e){return J.has(e.type)||W.has(e.type)}function qt(e,t,n,i,a=Te){if(W.has(t.type))return i>=It?[]:[`${n}{{ ${t.var} }}`,...K(e,t,`${n}${v}`,i+1,a),`${n}{{ /${t.var} }}`];const o=F.has(t.type)?"div":X.test(t.var)?"h3":"p";return[`${n}<${o} {{ visual_edit field="${t.var}" inline_edit="true" }}>{{ ${t.var} }}</${o}>`]}function Gt(e,t){return e.find(n=>n.kind==="loop"&&t>=n.from&&t<=n.openTo)||null}function Zt(e,t){const n=Gt(e,t);return n?[{id:"loop-ask",key:"code_dock_help_loop_ask",args:{name:n.name},meta:n.expr,changes:[],selection:null,after:"loop",loop:n}]:[]}function Se(e){return e.sectionPartial&&e.isRoot&&e.node.tag==="section"}function Jt(e){if(!Se(e))return[];const{node:t,shellRoot:n}=e,i=/<section\b[^>]*>/i.exec(Vt(n));if(!i)return[];const a=n.slice(i.index,i.index+i[0].length),o=/\sid\s*=\s*"[^"]*"/i.exec(a),s=/\sclass\s*=\s*"[^"]*"/i.exec(a),l=$e.exec(a),d=y(e);if(!o||b(d.masked,"id"))return[];let r=T(d.text,"section",`${o[0].trim()}${b(d.masked,"class")||!s?"":` ${s[0].trim()}`}`);return l&&(r=R(r,l[0])),[{id:"shell",key:"code_dock_help_shell",args:{},meta:"id-{{ id }}",changes:[{from:t.from,to:t.openTo,insert:r}],selection:t.from+r.length}]}function Qt(e){const{node:t,scope:n}=e,i=D(e);return i?Se(e)?b(y(e).masked,"id")?V(e,a=>_(e,a)).map(a=>le(e,a,i)):[]:t.tag==="div"?V(e,a=>W.has(a.type)).map(a=>_t(e,a,i)):t.tag==="li"&&n?.length?V(e,a=>a.type==="replicator").map(a=>le(e,a,i)):[]:[]}function V(e,t){return x(e.source,O(e).filter(t))}function _t(e,t,n){const{source:i,node:a}=e,o=U(i,a.from),s=y(e),l=R(ee(s.text,s.masked,a.tag),Le(t));return Pe(e,t,n,[l,...Ae(e,t,`${o}${v}`),`${o}</${a.tag}>`],0)}function le(e,t,n){const{source:i,node:a}=e,o=U(i,a.from),s=`${o}${v}`;return Pe(e,t,n,[y(e).text,`${s}<div class="" ${Le(t)}>`,...Ae(e,t,`${s}${v}`),`${s}</div>`,`${o}</${a.tag}>`],1)}function Le(e){return`{{ visual_edit field="${e.var}" outline_inside="true" insertable="true" }}`}function Ae(e,t,n){const i=`${n}${v}`,a=_(e,t)?K(e.rows,t,i,1,q(e)):[`${i}<div class="" {{ visual_edit orderable="true" }}>`,...K(e.rows,t,`${i}${v}`,1,q(e)),`${i}</div>`];return[`${n}{{ ${t.var} }}`,...a,`${n}{{ /${t.var} }}`]}function Pe(e,t,n,i,a){const{node:o}=e,s=_(e,t),l=s?i.length-1-a:a+2;return{id:`${s?"blocks":"loop"}:${t.var}`,key:s?"code_dock_help_blocks":"code_dock_help_loop",args:{name:t.label||t.var},meta:[t.type,t.value].filter(Boolean).join(" · "),changes:[{from:o.from,to:n.to,insert:i.join(`
`)}],selection:o.from+i.slice(0,l+1).join(`
`).length}}function en(e){const{source:t,node:n}=e;if(n.tag!=="a")return[];const i=y(e),a=O(e),o=x(t,a.filter(r=>ye.has(r.type))),s=D(e),l=b(i.masked,"href"),d=[];if(s&&!l){const r=x(t,a.filter(u=>J.has(u.type)&&!F.has(u.type)))[0],c=r?`{{ ${r.var} }}`:"";for(const u of o){const $=R(T(i.text,"a",`href="{{ ${u.var} }}"`),`{{ visual_edit field="${u.var}" }}`);d.push({id:`link:${u.var}`,key:"code_dock_help_link",args:{name:u.label||u.var},meta:u.value||`{{ ${u.var} }}`,changes:[{from:n.from,to:s.to,insert:`${$}${c}</a>`}],selection:n.from+$.length+c.length})}}if(s&&Q(e,"links")&&a.some(tn(e))){const r=we(e,"links"),c=`{{ partial src="${r}" }}`;d.push({id:"links-partial",key:"code_dock_help_links_partial",args:{},meta:r,changes:[{from:n.from,to:s.to,insert:c}],selection:n.from+c.length})}if(!l&&!o.length){const r=T(i.text,"a",'href=""');d.push({id:"href",key:"code_dock_help_href",args:{},meta:'href=""',changes:[{from:n.from,to:n.openTo,insert:r}],selection:n.from+9})}return d}function tn(e){return t=>t.var==="links"&&t.type==="replicator"&&te(e.rows,t).some(n=>n.rows.some(i=>ye.has(i.type)))}const nn=new Set(["ul","ol"]);function on(e){const{source:t,node:n}=e,i=nn.has(n.tag)?D(e):null;return i?x(t,O(e).filter(o=>W.has(o.type))).map(o=>{const s=U(t,n.from),l=y(e),d=R(ee(l.text,l.masked,n.tag),`{{ visual_edit field="${o.var}" outline_inside="true" insertable="true" }}`),r=`${s}${v}${v}`,c=[d,`${s}${v}{{ ${o.var} }}`,`${r}<li class="" {{ visual_edit orderable="true" }}>`,...K(e.rows,o,`${r}${v}`,1,q(e)),`${r}</li>`,`${s}${v}{{ /${o.var} }}`,`${s}</${n.tag}>`];return{id:`loop:${o.var}`,key:"code_dock_help_loop",args:{name:o.label||o.var},meta:[o.type,o.value].filter(Boolean).join(" · "),changes:[{from:n.from,to:i.to,insert:c.join(`
`)}],selection:n.from+c.slice(0,3).join(`
`).length}}):[]}const sn=new Set(["h1","h2","h3","h4","h5","h6","p","span","a","li","strong","em","small","blockquote","figcaption","label","button","td","th","dt","dd"]),an=/^h[1-6]$/,rn=2;function ln(e,t){return e==="div"?F.has(t.type):J.has(t.type)&&!(e==="button"&&F.has(t.type))}function dn(e){const{source:t,node:n,close:i,scope:a}=e;if(!sn.has(n.tag)&&n.tag!=="div")return[];if(n.tag==="li"&&!a?.length)return[];const o=i>=0?n.children.length||t.slice(n.openTo,i).includes("{{")?null:n.to:D(e)?.to;if(o==null)return[];const s=x(t,O(e).filter(d=>ln(n.tag,d)));return(an.test(n.tag)?[...s].sort((d,r)=>Number(X.test(r.var))-Number(X.test(d.var))):s).slice(0,rn).map(d=>{const r=n.tag==="p"&&F.has(d.type)?"div":n.tag,c=y(e),u=r===n.tag?c.text:`<${r}${c.text.slice(1+n.tag.length)}`,$=R(u,`{{ visual_edit field="${d.var}" inline_edit="true" }}`),A=`{{ ${d.var} }}`,B=`${$}${A}</${r}>`;return{id:`text:${d.var}`,key:"code_dock_help_text",args:{name:d.label||d.var},meta:d.value||A,changes:[{from:n.from,to:o,insert:B}],selection:n.from+$.length+A.length}})}function cn(e){const{source:t,node:n}=e,i=e.blockPartials.image,a=n.tag==="div"?D(e):null;return!i||n.tag!=="img"&&!a?[]:x(t,O(e).filter(s=>zt.has(s.type))).map(s=>{const l=a?un(e,s,i).join(`
`):Ce(i,s,G(t,n));return{id:`media:${s.var}`,key:"code_dock_help_media",args:{name:s.label||s.var},meta:s.value||i,changes:[{from:n.from,to:a?a.to:n.to,insert:l}],selection:n.from+l.length}})}function un(e,t,n){const i=U(e.source,e.node.from),a=y(e);return[R(ee(a.text,a.masked,"div"),`{{ visual_edit field="${t.var}" outline_inside="true" inline_edit="true" }}`),`${i}${v}${Ce(n,t,"")}`,`${i}</div>`]}function Ce(e,t,n){return`{{ partial:${e} :imagePath="${t.var}" class="${n}" }}`}function fn(e){const{node:t}=e;if(t.tag!=="img")return[];const n=y(e);if(!b(n.masked,"src")){const i=['src=""',!b(n.masked,"loading")&&'loading="lazy"',!b(n.masked,"alt")&&'alt=""'].filter(Boolean).join(" ");return[de(e,n,"img-attrs","code_dock_help_img_attrs",i,"src")]}return b(n.masked,"alt")?[]:[de(e,n,"alt","code_dock_help_alt",'alt=""',"alt")]}function de(e,t,n,i,a,o){const s=T(t.text,"img",a);return{id:n,key:i,args:{},meta:a,changes:[{from:e.node.from,to:e.node.openTo,insert:s}],selection:e.node.from+`<img ${o}="`.length}}function pn(e,t){const{node:n,siblings:i,index:a}=e,o=y(e);if(b(o.masked,"class")||t.some(r=>r.id==="shell"))return[];const s=[],l=i.slice(0,a).reverse().find(r=>r.tag===n.tag&&G(e.source,r));if(l){const r=G(e.source,l),c=T(o.text,n.tag,`class="${r}"`);s.push({id:"class-same",key:"code_dock_help_class_same",args:{tag:n.tag},meta:r,changes:[{from:n.from,to:n.openTo,insert:c}],selection:n.from+c.length})}const d=T(o.text,n.tag,'class=""');return s.push({id:"class",key:"code_dock_help_class",args:{},meta:'class=""',changes:[{from:n.from,to:n.openTo,insert:d}],selection:n.from+1+n.tag.length+8,after:"class"}),s}function hn(e,t){const{node:n,scope:i}=e,a=y(e);if(b(a.masked,"id")||!i||i.length||t.some(s=>s.id==="shell"))return[];const o=T(a.text,n.tag,'id=""');return[{id:"id",key:"code_dock_help_id",args:{},meta:'id=""',changes:[{from:n.from,to:n.openTo,insert:o}],selection:n.from+1+n.tag.length+5}]}const mn=[Jt,Qt,en,on,dn,cn,fn,pn],gn=[hn];function vn(e,t,n=mn,i=gn){const a=ce(n,e,[]).slice(0,t);return[...a,...ce(i,e,a)]}function ce(e,t,n){const i=[...n],a=i.length;for(const o of e)i.push(...(o(t,i)||[]).filter(Boolean));return i.slice(a)}const bn=3;function kn(e,t,n={}){const i=String(e||""),a=Number(t);if(!Number.isFinite(a)||a<0||a>i.length)return[];const{fields:o=[],sectionPartial:s=!1,shellRoot:l="",blockPartials:d=null,locked:r=[]}=n;if($n([...Xe(i),...r],a))return[];const c=ke(i),u=Zt(c,a);if(u.length)return u;const $=Array.isArray(o)?o.filter(B=>B&&typeof B.var=="string"):[],A=Kt(i,a,{rows:$,blocks:c,sectionPartial:s,shellRoot:l,blockPartials:d});return A?vn(A,bn):[]}function yn(e,t){const n=Number(t)||0;return n?{...e,changes:e.changes.map(i=>({...i,from:i.from-n,to:i.to-n})),selection:e.selection==null?null:e.selection-n}:e}function $n(e,t){for(let n=0;n+1<e.length;n+=2)if(t>=e[n]&&t<e[n+1])return!0;return!1}const ue="__sve-help-styles",wn=`
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
`;function En(e){if(!e||e.getElementById(ue))return;const t=e.createElement("style");t.id=ue,t.textContent=wn,e.head.appendChild(t)}const fe=new WeakMap,j=new WeakMap,Y=4,M=8;function oo(e,t){if(!e||!t||j.has(t))return;const n={win:e,view:t,open:null,writing:!1,gen:0,draft:""};j.set(t,n),t.dispatch({effects:xe(t).reconfigure(Tn(n))})}function io(e){const t=j.get(e);t&&(k(t),j.delete(e),e.dispatch({effects:xe(e).reconfigure([])}))}function xe(e){let t=fe.get(e);return t||(t=new C.state.Compartment,fe.set(e,t),e.dispatch({effects:C.state.StateEffect.appendConfig.of(t.of([]))})),t}function Tn(e){const{EditorView:t,keymap:n}=C.view,{Prec:i}=C.state;return[t.updateListener.of(a=>{if(I.applying){e.open&&k(e);return}if(Sn(a)){pe(e);return}if(e.open&&!e.writing&&(a.docChanged||a.selectionSet)){k(e);return}a.focusChanged&&!a.view.hasFocus&&e.open?.kind==="list"&&k(e)}),t.domEventHandlers({click:()=>(Oe(e.win)&&pe(e),!1)}),i.highest(n.of([{key:"Tab",run:()=>he(e)},{key:"Enter",run:()=>he(e)},{key:"ArrowDown",run:()=>me(e,1)},{key:"ArrowUp",run:()=>me(e,-1)},{key:"Escape",run:()=>xn(e)}]))]}function Sn(e){if(!e.docChanged)return!1;let t=!1;for(const a of e.transactions)a.isUserEvent("input.type")&&a.changes.iterChanges((o,s,l,d,r)=>{r.toString().endsWith(">")&&(t=!0)});if(!t)return!1;const n=e.state.selection.main.head,i=e.state.sliceDoc(Math.max(0,n-400),n);return/<[a-zA-Z][^<>]*>$/.test(i)}function pe(e){const t=++e.gen;e.win.setTimeout(()=>{t===e.gen&&Pn(e)},0)}function Ln(){return I.htmlScopeActive&&I.htmlFocus?I.htmlFocus.from:0}function An(){const e=We();return!!Ue(e)&&!e.startsWith("view:")&&!z("dock:chrome-kind")}async function Pn(e){const{view:t,win:n}=e,i=e.gen;if(!t.hasFocus||t.state.readOnly||!t.state.selection.main.empty||C.autocomplete.completionStatus(t.state)==="active")return;const a=t.state.doc,o=await Ne(n);if(i!==e.gen||t.state.doc!==a||!t.hasFocus||!t.state.selection.main.empty)return;const s=Ln(),l=Z(),d=t.state.selection.main.head,r=kn(l,s+d,{fields:o,sectionPartial:An(),shellRoot:Fe(n),blockPartials:He(n),locked:ze(l)}).map(c=>yn(c,s)).filter(c=>c.changes.every(u=>u.from>=0&&u.to<=t.state.doc.length));if(!r.length){k(e);return}Cn(e,r)}function Cn(e,t){const{win:n}=e;k(e);const i=ge({active:0}),a=Me(e,"list",{render:()=>ve(dt,{title:H(n,"code_dock_help_title"),closeLabel:H(n,"code_dock_help_close"),items:t.map(o=>({id:o.id,label:H(n,o.key,o.args),meta:o.meta})),active:i.active,onAccept:o=>Re(e,o),onHover:o=>{i.active=o}})});e.open.items=t,e.open.model=i,ne(e,a)}function he(e){return e.open?.kind!=="list"?!1:(Re(e,e.open.model.active),!0)}function me(e,t){if(e.open?.kind!=="list")return!1;const{model:n,items:i}=e.open;return n.active=(n.active+t+i.length)%i.length,!0}function xn(e){return e.open?(k(e),!0):!1}function Re(e,t){const n=e.open?.items?.[t],{view:i}=e;if(n){if(k(e),n.after==="loop"){Rn(e,n.loop.from);return}if(!(i.state.readOnly||!n.changes.length)){if(n.after==="class"&&Be(e.win)){const a=Ie(e.win);if(a){Ke(e.win,a);return}}e.writing=!0;try{i.dispatch({changes:n.changes,...n.selection==null?{}:{selection:{anchor:n.selection}},userEvent:"input.toolbar"})}finally{e.writing=!1}je(),n.after==="class"&&C.autocomplete.startCompletion(i)}}}function S(e){return qe(ke(Z()).find(t=>t.kind==="loop"&&t.from===e))}function Rn(e,t){const{win:n}=e,i=S(t);if(!i)return;e.draft="";const a=ge({inspect:ie(n,i),canEdit:!e.view.state.readOnly&&z("dock:is-locked")!==!0}),o=()=>{const r=S(t);if(!r){k(e);return}a.inspect=ie(n,r,{draft:e.draft})},s=r=>{if(!r||e.open?.kind!=="loop")return;const c=Z(),u=S(t),$=u?r(c,u):c;if($!==c){e.writing=!0;try{z("dock:set-html",$)}finally{e.writing=!1}}o()},l={kind:r=>s(Qe(n,S(t),r)),commit:r=>s(Je(S(t),r)),sortDir:r=>{const c=Ze(S(t),r);if(c.draft){e.draft=c.draft,o();return}e.draft="",s(c.edit)},sortField:r=>{const c=e.draft;e.draft="",s(Ge(S(t),r,c))},limit:r=>s(nt(r)),offset:r=>s(tt(r)),depth:r=>s(et(r)),includeHome:r=>s(_e(r)),pickData:(r,c)=>z("dock:data-menu",{anchor:r,at:t,onPick:u=>c(String(u?.var||"").trim())})},d=Me(e,"loop",{render:()=>ve(Nt,{inspect:a.inspect,canEdit:a.canEdit,dataTitle:H(n,"data_vars_title"),closeLabel:H(n,"code_dock_help_close"),on:l})});ne(e,d)}function Me(e,t,n){const{win:i}=e,a=i.document;En(a);const o=a.createElement("div");a.body.appendChild(o);const s=De(n);s.mount(o);const l=o.firstElementChild||o,d=()=>ne(e,l),r=u=>{l.contains(u.target)||u.target.closest?.("[data-sve-data-menu]")||(l.contains(a.activeElement)&&a.activeElement.blur(),k(e))},c=u=>{u.key==="Escape"&&l.contains(u.target)&&(u.preventDefault(),u.stopPropagation(),k(e),e.view.focus())};return a.addEventListener("pointerdown",r,!0),a.addEventListener("keydown",c,!0),i.addEventListener("scroll",d,!0),i.addEventListener("resize",d),e.open={kind:t,el:l,host:o,app:s,unhook:()=>{a.removeEventListener("pointerdown",r,!0),a.removeEventListener("keydown",c,!0),i.removeEventListener("scroll",d,!0),i.removeEventListener("resize",d)}},l}function ne(e,t){const{view:n,win:i}=e,a=n.coordsAtPos(n.state.selection.main.head);if(!a)return;const o=t.offsetWidth,s=t.offsetHeight,l=Math.max(M,Math.min(a.left,i.innerWidth-o-M));let d=a.bottom+Y;d+s>i.innerHeight-M&&a.top-s-Y>=M&&(d=a.top-s-Y),t.style.left=`${l}px`,t.style.top=`${Math.max(M,d)}px`}function k(e){const t=e.open;t&&(e.open=null,t.unhook(),t.app.unmount(),t.host.remove())}export{io as disableHelp,oo as enableHelp};
