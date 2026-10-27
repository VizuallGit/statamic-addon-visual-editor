import{o as u,c as f,a as m,t as h,F as E,i as L,w as g,f as T,r as ee,$ as D,b as De,d as Fe,aM as Ne,k as he,E as Be,a7 as me,s as O}from"./addon-BrJ6DwQX.js";import{bl as ze,bm as Ue,b as N}from"./lp-cluster-gh1T3izP.js";import{h as je,f as Ke,V as Ve,c as C,d as B,s as ge,a as Y,l as We,b as Ge,o as Ye,e as Xe,g as qe,i as Je,j as Qe}from"./code-dock-LxR0WqjD.js";import{Q as ve,p as be,L as Ze,C as et,y as ke}from"./css-scope-CvwgFAfm.js";import{c as te,i as tt,l as nt,a as ot,h as it,b as st,e as rt,d as at,g as lt,f as dt}from"./loop-inspector-B2zHiah7.js";import"./protocol-BVdEmGBQ.js";import"./shortcuts-BBrEL-OT.js";import"./ChoiceDialog-BKpBo5hN.js";import"./ai-text-icon-B7uCWIwa.js";import"./codemirror-CBNZCkig.js";import"./tw-candidates-CSP7aVNi.js";import"./component-extract-CR86394o.js";import"./html-tag-sync-BpXNELva.js";import"./index-M2RCOyrL.js";import"./index-B5fiB6ig.js";import"./index-sh1K8s4m.js";import"./index-0IxPFT_m.js";import"./index-Ci-3qkVd.js";import"./index-DkhC0r6-.js";import"./index-B4S9JIPB.js";import"./index-BwRQ94Ql.js";import"./index-D9YSa79V.js";import"./index-DwJNgNWz.js";import"./utility-paint-DXCEnfCB.js";import"./utilities-DNDSVzBx.js";const ct=["aria-label"],ut={"data-sve-help-head":""},ft=["aria-selected","data-active","onMouseenter","onClick"],pt={"data-sve-help-label":""},ht={key:0,"data-sve-help-meta":""},mt={key:1,"data-sve-help-key":""},gt={__name:"DockHelpPopup",props:{title:{type:String,default:""},closeLabel:{type:String,default:""},items:{type:Array,default:()=>[]},active:{type:Number,default:0},onAccept:{type:Function,required:!0},onHover:{type:Function,default:null}},setup(e){return(t,n)=>(u(),f("div",{"data-sve-help-popup":"",role:"listbox","aria-label":e.title},[m("div",ut,[m("span",null,h(e.title),1),m("span",null,h(e.closeLabel),1)]),(u(!0),f(E,null,L(e.items,(o,i)=>(u(),f("button",{key:o.id,type:"button",role:"option","data-sve-help-option":"","aria-selected":i===e.active?"true":"false","data-active":i===e.active?"":void 0,onMousedown:n[0]||(n[0]=g(()=>{},["prevent"])),onMouseenter:r=>e.onHover&&e.onHover(i),onClick:g(r=>e.onAccept(i),["prevent","stop"])},[m("span",pt,h(o.label),1),o.meta?(u(),f("span",ht,h(o.meta),1)):T("",!0),i===e.active?(u(),f("kbd",mt,"Tab")):T("",!0)],40,ft))),128))],8,ct))}},vt=["aria-label"],bt={"data-sve-help-head":""},kt={"data-sve-help-body":""},yt={"data-sve-help-seg":""},$t=["data-active","disabled","onClick"],Et=["value","disabled"],Tt={key:0,value:""},St=["value"],wt=["value","disabled"],xt=["value"],At={key:2,"data-sve-help-box":""},Lt=["value","placeholder","disabled"],Ct=["title","disabled"],Rt={"data-sve-help-sub":""},Pt=["value","disabled"],It=["value"],Ot={key:0,"data-sve-help-tick":""},_t=["checked","disabled"],Ht={"data-sve-help-sub":""},Mt=["value","disabled"],Dt=["value"],Ft={key:0,"data-sve-help-box":"","data-sve-help-gap":""},Nt=["value","placeholder","disabled"],Bt=["title","disabled"],zt={"data-sve-help-sub":""},Ut=["value","placeholder","disabled"],jt={"data-sve-help-sub":""},Kt=["value","placeholder","disabled"],ne='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',Vt={__name:"DockHelpLoop",props:{inspect:{type:Object,required:!0},canEdit:{type:Boolean,default:!0},dataTitle:{type:String,default:""},closeLabel:{type:String,default:""},on:{type:Object,required:!0}},setup(e){const t=ee(null),n=ee(null);function o(i,r,s){!i||!r||(i.value=r,i.focus(),i.setSelectionRange(r.length,r.length),s(r))}return(i,r)=>(u(),f("div",{"data-sve-help-loop":"",role:"dialog","aria-label":e.inspect.title},[m("div",bt,[m("span",null,h(e.inspect.title),1),m("span",null,h(e.closeLabel),1)]),m("div",kt,[m("div",yt,[(u(!0),f(E,null,L(e.inspect.kinds,s=>(u(),f("button",{key:s.id,type:"button","data-active":s.id===e.inspect.loopKind?"":void 0,disabled:!e.canEdit,onClick:a=>e.on.kind(s.id)},h(s.label),9,$t))),128))]),e.inspect.loopKind==="collection"?(u(),f("select",{key:e.inspect.key+":"+e.inspect.value,value:e.inspect.value,disabled:!e.canEdit,onChange:r[0]||(r[0]=s=>e.on.commit(s.target.value))},[e.inspect.value?T("",!0):(u(),f("option",Tt,h(e.inspect.placeholder),1)),(u(!0),f(E,null,L(e.inspect.collections,s=>(u(),f("option",{key:s.handle,value:s.handle},h(s.title),9,St))),128))],40,Et)):e.inspect.loopKind==="nav"?(u(),f("select",{key:e.inspect.key+":nav:"+e.inspect.value,value:e.inspect.value,disabled:!e.canEdit,onChange:r[1]||(r[1]=s=>e.on.commit(s.target.value))},[(u(!0),f(E,null,L(e.inspect.navs,s=>(u(),f("option",{key:s.handle,value:s.handle},h(s.title),9,xt))),128))],40,wt)):(u(),f("div",At,[(u(),f("input",{ref_key:"field",ref:t,key:e.inspect.key,type:"text",value:e.inspect.value,placeholder:e.inspect.placeholder,disabled:!e.canEdit,spellcheck:"false",onKeydown:[r[2]||(r[2]=g(()=>{},["stop"])),r[3]||(r[3]=D(g(s=>e.on.commit(s.target.value),["prevent"]),["enter"]))],onBlur:r[4]||(r[4]=s=>e.on.commit(s.target.value))},null,40,Lt)),m("button",{type:"button","data-sve-help-data":"",title:e.dataTitle,disabled:!e.canEdit,innerHTML:ne,onMousedown:r[5]||(r[5]=g(()=>{},["prevent"])),onClick:r[6]||(r[6]=g(s=>e.on.pickData(s.currentTarget,a=>o(t.value,a,e.on.commit)),["stop","prevent"]))},null,40,Ct)])),e.inspect.nav?(u(),f(E,{key:3},[m("div",Rt,h(e.inspect.nav.depthTitle),1),(u(),f("select",{key:e.inspect.key+":depth:"+e.inspect.nav.depth,value:e.inspect.nav.depth,disabled:!e.canEdit,onChange:r[7]||(r[7]=s=>e.on.depth(s.target.value))},[(u(!0),f(E,null,L(e.inspect.nav.depths,s=>(u(),f("option",{key:s.id,value:s.id},h(s.label),9,It))),128))],40,Pt)),e.inspect.nav.homeAsked?(u(),f("label",Ot,[m("input",{type:"checkbox",checked:e.inspect.nav.includeHome,disabled:!e.canEdit,onChange:r[8]||(r[8]=s=>e.on.includeHome(s.target.checked))},null,40,_t),m("span",null,h(e.inspect.nav.homeLabel),1)])):T("",!0)],64)):T("",!0),e.inspect.sort?(u(),f(E,{key:4},[m("div",Ht,h(e.inspect.sort.title),1),(u(),f("select",{key:e.inspect.key+":dir:"+e.inspect.sort.dir,value:e.inspect.sort.dir,disabled:!e.canEdit,onChange:r[9]||(r[9]=s=>e.on.sortDir(s.target.value))},[(u(!0),f(E,null,L(e.inspect.sort.dirs,s=>(u(),f("option",{key:s.id,value:s.id},h(s.label),9,Dt))),128))],40,Mt)),e.inspect.sort.needsField?(u(),f("div",Ft,[(u(),f("input",{ref_key:"sortField",ref:n,key:e.inspect.key+":field",type:"text",value:e.inspect.sort.field,placeholder:e.inspect.sort.placeholder,disabled:!e.canEdit,spellcheck:"false",onKeydown:[r[10]||(r[10]=g(()=>{},["stop"])),r[11]||(r[11]=D(g(s=>e.on.sortField(s.target.value),["prevent"]),["enter"]))],onBlur:r[12]||(r[12]=s=>e.on.sortField(s.target.value))},null,40,Nt)),e.inspect.sort.pickable?(u(),f("button",{key:0,type:"button","data-sve-help-data":"",title:e.dataTitle,disabled:!e.canEdit,innerHTML:ne,onMousedown:r[13]||(r[13]=g(()=>{},["prevent"])),onClick:r[14]||(r[14]=g(s=>e.on.pickData(s.currentTarget,a=>o(n.value,a,e.on.sortField)),["stop","prevent"]))},null,40,Bt)):T("",!0)])):T("",!0),m("div",zt,h(e.inspect.limit.title),1),(u(),f("input",{key:e.inspect.key+":limit",type:"number",min:"1",value:e.inspect.limit.value,placeholder:e.inspect.limit.placeholder,disabled:!e.canEdit,onKeydown:[r[15]||(r[15]=g(()=>{},["stop"])),r[16]||(r[16]=D(g(s=>e.on.limit(s.target.value),["prevent"]),["enter"]))],onBlur:r[17]||(r[17]=s=>e.on.limit(s.target.value))},null,40,Ut)),m("div",jt,h(e.inspect.offset.title),1),(u(),f("input",{key:e.inspect.key+":offset",type:"number",min:"0",value:e.inspect.offset.value,placeholder:e.inspect.offset.placeholder,disabled:!e.canEdit,onKeydown:[r[18]||(r[18]=g(()=>{},["stop"])),r[19]||(r[19]=D(g(s=>e.on.offset(s.target.value),["prevent"]),["enter"]))],onBlur:r[20]||(r[20]=s=>e.on.offset(s.target.value))},null,40,Kt))],64)):T("",!0)])],8,vt))}},ye=new Set(["text","textarea","markdown","bard"]),z=new Set(["markdown","bard"]),j=new Set(["grid","replicator"]),Wt=new Set(["assets"]),Gt=new Set(["link"]),W=/^(title|heading|headline|name)$/,x=" › ",v="    ",Yt=2,X=/\{\{\s*visual_edit\b[\s\S]*?\}\}/;function Xt(e,t,n){const o=ve(e),i=be(e),r=$e(e,i,t);return r?{source:e,pos:t,masked:o,rows:n.rows,scope:Jt(n.blocks,t),blocks:n.blocks,...r,isRoot:r.node===i[0],sectionPartial:!!n.sectionPartial,shellRoot:String(n.shellRoot||"")}:null}function $e(e,t,n,o=null){for(let i=0;i<t.length;i+=1){const r=t[i],s=qt(e,r),a=s>=0?r.to-1:r.to;if(!(r.hidden||n<r.from||n>a))return $e(e,r.children,n,r)||{node:r,parent:o,siblings:t,index:i,close:s}}return null}function qt(e,t){if(Ze(t.tag)||t.to<=t.openTo)return-1;const n=e.slice(t.openTo,t.to).match(new RegExp(`</${t.tag}\\s*>$`,"i"));return n?t.to-n[0].length:-1}function Jt(e,t){const n=[];for(const o of e)if(!(o.kind!=="loop"||t<o.openTo||t>=o.to)){if(o.loopKind!=="field")return null;n.push(o.name)}return n}function q(e){const{source:t,node:n,close:o}=e;return o<0?/^\s*(<|\{\{|$)/.test(t.slice(n.openTo))?{to:n.openTo}:null:!n.children.length&&t.slice(n.openTo,o).trim()===""?{to:n.to}:null}function K(e,t){const n=e.lastIndexOf(`
`,t-1)+1;return/^[ \t]*/.exec(e.slice(n))[0]}function b(e){return{text:e.source.slice(e.node.from,e.node.openTo),masked:e.masked.slice(e.node.from,e.node.openTo)}}function _(e,t){return new RegExp(`\\s${t}\\s*=`,"i").test(e)}function R(e,t){return new RegExp(`\\s${Zt(t)}(?=[\\s=/>]|$)`,"i").test(e)}function Qt(e){const t=[];let n=be(e.source);for(;;){const o=n.find(i=>i.from<e.node.from&&e.node.from<i.to);if(!o)return t;t.push(o),n=o.children}}function Zt(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function Ee(e,t){const n=/\s*\/?>$/.exec(e);return n?`${e.slice(0,n.index)} ${t}${e.slice(n.index)}`:`${e} ${t}`}function y(e,t,n){const o=1+t.length;return`${e.slice(0,o)} ${n}${e.slice(o)}`}function Te(e,t,n){return _(t,"class")?e:y(e,n,'class=""')}function H(e,t){return X.test(e)?e:Ee(e,t)}function oe(e,t){const n=/\sclass\s*=\s*"([^"]*)"/i.exec(e.slice(t.from,t.openTo)),o=n?n[1].trim():"";return o&&!o.includes("{{")?o:""}function en(e){return ve(String(e||""))}function tn(e,t){if(!t)return[];const n=String(t).split(x),o=[];let i="";for(let r=0;r<n.length;r+=1){const s=n[r],a=e.find(d=>d.var===s&&(d.parent||"")===i);if(!a)return null;o.push(s),i=i?`${i}${x}${s}`:s,a.type==="replicator"&&r+1<n.length&&(r+=1,i=`${i}${x}${n[r]}`)}return o}function nn(e,t){return!!e&&e.length===t.length&&e.every((n,o)=>n===t[o])}function P(e){if(!e.scope)return[];const t=new Set;return e.rows.filter(n=>!nn(tn(e.rows,n.parent),e.scope)||t.has(n.var)?!1:(t.add(n.var),!0))}function ie(e,t){return new RegExp(`\\{\\{\\s*${t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\s*(\\}\\}|\\|)`).test(e)}function M(e,t){return[...t].sort((n,o)=>Number(ie(e,n.var))-Number(ie(e,o.var)))}function on(e,t){const n=t.parent?`${t.parent}${x}${t.var}`:t.var;if(t.type!=="replicator")return[{set:"",rows:e.filter(i=>i.parent===n)}];const o=new Map;for(const i of e){const r=String(i.parent||"");if(!r.startsWith(`${n}${x}`))continue;const s=r.slice(n.length+x.length);s.includes(x)||(o.has(s)||o.set(s,[]),o.get(s).push(i))}return[...o].map(([i,r])=>({set:i,rows:r}))}function J(e,t,n,o){const i=on(e,t).filter(a=>a.rows.some(se)),r=(a,d)=>a.rows.filter(se).flatMap(l=>sn(e,l,d,o));if(!i.length)return[n];if(i.length===1)return r(i[0],n);const s=[];return i.forEach((a,d)=>{s.push(`${n}{{ ${d===0?"if":"elseif"} type == '${a.set}' }}`),s.push(...r(a,`${n}${v}`))}),s.push(`${n}{{ /if }}`),s}function se(e){return ye.has(e.type)||j.has(e.type)}function sn(e,t,n,o){if(j.has(t.type))return o>=Yt?[]:[`${n}{{ ${t.var} }}`,...J(e,t,`${n}${v}`,o+1),`${n}{{ /${t.var} }}`];const i=z.has(t.type)?"div":W.test(t.var)?"h3":"p";return[`${n}<${i} {{ visual_edit field="${t.var}" inline_edit="true" }}>{{ ${t.var} }}</${i}>`]}function rn(e,t){return e.find(n=>n.kind==="loop"&&t>=n.from&&t<=n.openTo)||null}function an(e,t){const n=rn(e,t);return n?[{id:"loop-ask",key:"code_dock_help_loop_ask",args:{name:n.name},meta:n.expr,changes:[],selection:null,after:"loop",loop:n}]:[]}function ln(e){return e.sectionPartial&&e.isRoot&&e.node.tag==="section"}function dn(e){if(!ln(e))return[];const{node:t,shellRoot:n}=e,o=/<section\b[^>]*>/i.exec(en(n));if(!o)return[];const i=n.slice(o.index,o.index+o[0].length),r=/\sid\s*=\s*"[^"]*"/i.exec(i),s=/\sclass\s*=\s*"[^"]*"/i.exec(i),a=X.exec(i),d=b(e);if(!r||_(d.masked,"id"))return[];let l=y(d.text,"section",`${r[0].trim()}${_(d.masked,"class")||!s?"":` ${s[0].trim()}`}`);return a&&(l=H(l,a[0])),[{id:"shell",key:"code_dock_help_shell",args:{},meta:"id-{{ id }}",changes:[{from:t.from,to:t.openTo,insert:l}],selection:t.from+l.length}]}const re="{{ visual_edit }}";function cn(e){const{node:t}=e,n=b(e);if(t.tag!=="div"||X.test(n.text))return[];const o=Ee(n.text,re);return[{id:"visual-edit",key:"code_dock_help_attr",args:{attr:"visual_edit"},meta:re,changes:[{from:t.from,to:t.openTo,insert:o}],selection:t.from+o.lastIndexOf("}}"),after:"visual-edit"}]}function un(e){const{node:t,scope:n}=e,o=q(e);return o?t.tag==="div"?ae(e,i=>j.has(i.type)).map(i=>fn(e,i,o)):t.tag==="li"&&n?.length?ae(e,i=>i.type==="replicator").map(i=>pn(e,i,o)):[]:[]}function ae(e,t){return M(e.source,P(e).filter(t))}function fn(e,t,n){const{source:o,node:i}=e,r=K(o,i.from),s=b(e),a=H(Te(s.text,s.masked,i.tag),Se(t));return xe(e,t,n,[a,...we(e,t,`${r}${v}`),`${r}</${i.tag}>`],0)}function pn(e,t,n){const{source:o,node:i}=e,r=K(o,i.from),s=`${r}${v}`;return xe(e,t,n,[b(e).text,`${s}<div class="" ${Se(t)}>`,...we(e,t,`${s}${v}`),`${s}</div>`,`${r}</${i.tag}>`],1)}function Se(e){return`{{ visual_edit field="${e.var}" outline_inside="true" insertable="true" }}`}function we(e,t,n){const o=`${n}${v}`;return[`${n}{{ ${t.var} }}`,`${o}<div class="" {{ visual_edit orderable="true" }}>`,...J(e.rows,t,`${o}${v}`,1),`${o}</div>`,`${n}{{ /${t.var} }}`]}function xe(e,t,n,o,i){const{node:r}=e;return{id:`loop:${t.var}`,key:"code_dock_help_loop",args:{name:t.label||t.var},meta:[t.type,t.value].filter(Boolean).join(" · "),changes:[{from:r.from,to:n.to,insert:o.join(`
`)}],selection:r.from+o.slice(0,i+3).join(`
`).length}}function Ae(e){return Gt.has(e.type)||e.var==="url"}function hn(e){const{source:t,node:n}=e;if(n.tag!=="a")return[];const o=b(e);if(R(o.masked,"href"))return[];const i=M(t,P(e).filter(Ae)).map(s=>{const a=y(o.text,"a",`href="{{ ${s.var} }}"`);return{id:`url:${s.var}`,key:"code_dock_help_url",args:{name:s.label||s.var},meta:s.value||`{{ ${s.var} }}`,changes:[{from:n.from,to:n.openTo,insert:a}],selection:n.from+a.length}}),r=y(o.text,"a",'href=""');return i.push({id:"href",key:"code_dock_help_add_url",args:{},meta:'href=""',changes:[{from:n.from,to:n.openTo,insert:r}],selection:n.from+9}),i}const mn=new Set(["ul","ol"]);function gn(e){const{source:t,node:n}=e,o=mn.has(n.tag)?q(e):null;return o?M(t,P(e).filter(r=>j.has(r.type))).map(r=>{const s=K(t,n.from),a=b(e),d=H(Te(a.text,a.masked,n.tag),`{{ visual_edit field="${r.var}" outline_inside="true" insertable="true" }}`),l=`${s}${v}${v}`,c=[d,`${s}${v}{{ ${r.var} }}`,`${l}<li class="" {{ visual_edit orderable="true" }}>`,...J(e.rows,r,`${l}${v}`,1),`${l}</li>`,`${s}${v}{{ /${r.var} }}`,`${s}</${n.tag}>`];return{id:`loop:${r.var}`,key:"code_dock_help_loop",args:{name:r.label||r.var},meta:[r.type,r.value].filter(Boolean).join(" · "),changes:[{from:n.from,to:o.to,insert:c.join(`
`)}],selection:n.from+c.slice(0,3).join(`
`).length}}):[]}const vn=new Set(["h1","h2","h3","h4","h5","h6","p","span","a","li","strong","em","small","blockquote","figcaption","label","button","td","th","dt","dd"]),bn=new Set(["h1","h2","h3","h4","h5","h6","span","strong","em","a","button"]),kn=/^h[1-6]$/,yn=2;function $n(e,t){return e==="div"?z.has(t.type):e==="a"&&Ae(t)?!1:bn.has(e)?t.type==="text":e==="p"?t.type==="text"||z.has(t.type):ye.has(t.type)}function En(e){const{source:t,node:n,close:o,scope:i}=e;if(!vn.has(n.tag)&&n.tag!=="div")return[];if(n.tag==="li"&&!i?.length)return[];const r=o>=0?n.children.length||t.slice(n.openTo,o).includes("{{")?null:n.to:q(e)?.to;if(r==null)return[];const s=M(t,P(e).filter(d=>$n(n.tag,d)));return(kn.test(n.tag)?[...s].sort((d,l)=>Number(W.test(l.var))-Number(W.test(d.var))):s).slice(0,yn).map(d=>{const l=n.tag==="p"&&z.has(d.type)?"div":n.tag,c=b(e),p=l===n.tag?c.text:`<${l}${c.text.slice(1+n.tag.length)}`,S=n.tag==="div",A=H(p,`{{ visual_edit field="${d.var}"${S?"":' inline_edit="true"'} }}`),$=`{{ ${d.var} }}`,Me=`${A}${$}</${l}>`;return{id:`text:${d.var}`,key:S?"code_dock_help_add_field":"code_dock_help_text",args:{name:d.label||d.var},meta:d.value||$,changes:[{from:n.from,to:r,insert:Me}],selection:n.from+A.length+$.length}})}const Tn={section:{attr:"x-data",also:[]},div:{attr:"x-show",also:[]},button:{attr:"@click",also:["x-on:click"]}};function Sn(e){const{node:t}=e,n=Tn[t.tag],o=b(e);if(!n||[n.attr,...n.also].some(s=>R(o.masked,s)))return[];if(n.attr!=="x-data"&&!wn(e))return[];const{text:i,caret:r}=xn(o,t.tag,`${n.attr}=""`);return[{id:n.attr,key:"code_dock_help_attr",args:{attr:n.attr},meta:`${n.attr}=""`,changes:[{from:t.from,to:t.openTo,insert:i}],selection:t.from+r}]}function wn(e){return Qt(e).some(t=>R(e.masked.slice(t.from,t.openTo),"x-data"))}function xn(e,t,n){const o=/\sclass\s*=\s*("[^"]*"|'[^']*')/i.exec(e.masked),i=o?o.index+o[0].length:1+t.length;return{text:`${e.text.slice(0,i)} ${n}${e.text.slice(i)}`,caret:i+n.length}}const An=new Set(["img","video"]);function Ln(e){const{source:t,node:n}=e;if(!An.has(n.tag))return[];const o=b(e);if(R(o.masked,"src"))return[];const r=M(t,P(e).filter(s=>Wt.has(s.type))).map(s=>{const a=`{{ ${s.var}:url }}`,d=H(y(o.text,n.tag,`src="${a}"`),`{{ visual_edit field="${s.var}" }}`);return{id:`${n.tag}-src:${s.var}`,key:"code_dock_help_source",args:{name:s.label||s.var},meta:s.value||a,changes:[{from:n.from,to:n.openTo,insert:d}],selection:n.from+d.length}});return r.push(G(e,o,"src","code_dock_help_src",'src=""',!0)),r}function Cn(e){if(e.node.tag!=="img")return[];const t=b(e);return[!R(t.masked,"alt")&&G(e,t,"alt","code_dock_help_alt",'alt=""',!0),!R(t.masked,"loading")&&G(e,t,"lazy","code_dock_help_lazy",'loading="lazy"',!1)].filter(Boolean)}function G(e,t,n,o,i,r){const{node:s}=e,a=y(t.text,s.tag,i);return{id:n,key:o,args:{},meta:i,changes:[{from:s.from,to:s.openTo,insert:a}],selection:s.from+1+s.tag.length+1+i.length-(r?1:0)}}const le=/\{\{\s*if\s*\}\}/g;function Rn(e,t){le.lastIndex=0;let n;for(;n=le.exec(e);)if(t>=n.index&&t<=n.index+n[0].length)return{from:n.index,to:n.index+n[0].length};return null}function Pn(e){const{source:t,node:n,blocks:o}=e,i=Rn(t,e.pos);if(!i||i.from<n.openTo)return[];const r=o.some(a=>a.kind==="if"&&a.name==="if"&&a.from===i.from),s=K(t,i.from);return P(e).map(a=>{const d=r?[`{{ if ${a.var} }}`]:[`{{ if ${a.var} }}`,`${s}${v}`,`${s}{{ /if }}`];return{id:`if:${a.var}`,key:"code_dock_help_if",args:{name:a.label||a.var},meta:a.type,changes:[{from:i.from,to:i.to,insert:d.join(`
`)}],selection:i.from+d.slice(0,2).join(`
`).length}})}function In(e,t){const{node:n,siblings:o,index:i}=e,r=b(e);if(_(r.masked,"class")||t.some(l=>l.id==="shell"))return[];const s=[],a=o.slice(0,i).reverse().find(l=>l.tag===n.tag&&oe(e.source,l));if(a){const l=oe(e.source,a),c=y(r.text,n.tag,`class="${l}"`);s.push({id:"class-same",key:"code_dock_help_class_same",args:{tag:n.tag},meta:l,changes:[{from:n.from,to:n.openTo,insert:c}],selection:n.from+c.length})}const d=y(r.text,n.tag,'class=""');return s.push({id:"class",key:"code_dock_help_class",args:{},meta:'class=""',changes:[{from:n.from,to:n.openTo,insert:d}],selection:n.from+1+n.tag.length+8,after:"class"}),s}function On(e,t){const{node:n,scope:o}=e,i=b(e);if(_(i.masked,"id")||!o||o.length||t.some(s=>s.id==="shell"))return[];const r=y(i.text,n.tag,'id=""');return[{id:"id",key:"code_dock_help_id",args:{},meta:'id=""',changes:[{from:n.from,to:n.openTo,insert:r}],selection:n.from+1+n.tag.length+5}]}const _n=[Pn],Hn=[In],Mn=[dn,cn,un,hn,gn,En,Sn,Ln,Cn],Dn=[On];function Fn(e,t,n={},o={}){const{only:i=_n,head:r=Hn,rules:s=Mn,tail:a=Dn}=o,d=F(i,e,[]);if(d.length)return d;const l=Nn(F(s,e,[]),n?.[e.node.tag]).slice(0,t),c=[...F(r,e,l),...l];return[...c,...F(a,e,c)]}function Nn(e,t){const n=o=>Number(t?.[o.id])||0;return[...e].sort((o,i)=>n(i)-n(o))}function F(e,t,n){const o=[...n],i=o.length;for(const r of e)o.push(...(r(t,o)||[]).filter(Boolean));return o.slice(i)}const Bn=3;function zn(e,t,n={}){const o=String(e||""),i=Number(t);if(!Number.isFinite(i)||i<0||i>o.length)return[];const{fields:r=[],sectionPartial:s=!1,shellRoot:a="",locked:d=[],counts:l={}}=n;if(jn([...et(o),...d],i))return[];const c=ke(o),p=an(c,i);if(p.length)return p;const S=Array.isArray(r)?r.filter($=>$&&typeof $.var=="string"):[],A=Xt(o,i,{rows:S,blocks:c,sectionPartial:s,shellRoot:a});return A?Fn(A,Bn,l).map($=>({...$,tag:A.node.tag})):[]}function Un(e,t){const n=Number(t)||0;return n?{...e,changes:e.changes.map(o=>({...o,from:o.from-n,to:o.to-n})),selection:e.selection==null?null:e.selection-n}:e}function jn(e,t){for(let n=0;n+1<e.length;n+=2)if(t>=e[n]&&t<e[n+1])return!0;return!1}const de="__sve-help-styles",Kn=`
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
`;function Vn(e){if(!e||e.getElementById(de))return;const t=e.createElement("style");t.id=de,t.textContent=Kn,e.head.appendChild(t)}const Le="sve-code-dock-help-counts";function Ce(e){if(!e)return{};try{const t=JSON.parse(De(e,Le)||"{}");return t&&typeof t=="object"&&!Array.isArray(t)?t:{}}catch{return{}}}function Wn(e,t,n){if(!e||!t||!n)return;const o=Ce(e),i=o[t]&&typeof o[t]=="object"?o[t]:{};i[n]=(Number(i[n])||0)+1,o[t]=i,Fe(e,Le,JSON.stringify(o))}const Gn=[{id:"inline_edit",attr:'inline_edit="true"',key:"code_dock_help_ve_inline_edit"},{id:"field",key:"code_dock_help_ve_field"},{id:"outline_inside",attr:'outline_inside="true"',key:"code_dock_help_ve_outline_inside"},{id:"orderable",attr:'orderable="true"',key:"code_dock_help_ve_orderable"},{id:"insertable",attr:'insertable="true"',key:"code_dock_help_ve_insertable"},{id:"popup",attr:'popup="true"',key:"code_dock_help_ve_popup"},{id:"toolbar",attr:'toolbar="true"',key:"code_dock_help_ve_toolbar"},{id:"section_orderable",attr:'section_orderable="true"',key:"code_dock_help_ve_section_orderable",only:"section"}];function Re(e,t){const n=Ke(e,t.from,t.to,Ve);if(!n)return null;let o=n.closeIdx;for(;o>n.openIdx+2&&/\s/.test(e[o-1]);)o--;return{...n,at:o}}function Yn(e,t){const n=Re(e,t);return n?Gn.filter(o=>(!o.only||o.only===t.name)&&!je(n.inner,o.id)).map(o=>o.attr?Pe(n,`ve:${o.id}`,o.key,{},o.attr):{id:`ve:${o.id}`,key:o.key,args:{},meta:o.id,changes:[],selection:null,after:"visual-edit-field"}):[]}function Xn(e,t,n){const o=Re(e,t);return o?n.map(i=>Pe(o,`ve:field:${i.var}`,"code_dock_help_ve_field_name",{name:i.label||i.var},`field="${i.var}"`)):[]}function Pe(e,t,n,o,i){return{id:t,key:n,args:o,meta:i,changes:[{from:e.at,to:e.closeIdx,insert:` ${i} `}],selection:e.at+1+i.length,after:"visual-edit"}}const ce=new WeakMap,U=new WeakMap,V=4,I=8;function Po(e,t){if(!e||!t||U.has(t))return;const n={win:e,view:t,open:null,writing:!1,gen:0,draft:""};U.set(t,n),t.dispatch({effects:Ie(t).reconfigure(qn(n))})}function Io(e){const t=U.get(e);t&&(k(t),U.delete(e),e.dispatch({effects:Ie(e).reconfigure([])}))}function Ie(e){let t=ce.get(e);return t||(t=new C.state.Compartment,ce.set(e,t),e.dispatch({effects:C.state.StateEffect.appendConfig.of(t.of([]))})),t}function qn(e){const{EditorView:t,keymap:n}=C.view,{Prec:o}=C.state;return[t.updateListener.of(i=>{if(B.applying){e.open&&k(e);return}if(Jn(i)){ue(e);return}if(e.open&&!e.writing&&(i.docChanged||i.selectionSet)){k(e);return}i.focusChanged&&!i.view.hasFocus&&e.open?.kind==="list"&&k(e)}),t.domEventHandlers({click:()=>(ze(e.win)&&ue(e),!1)}),o.highest(n.of([{key:"Tab",run:()=>fe(e)},{key:"Enter",run:()=>fe(e)},{key:"ArrowDown",run:()=>pe(e,1)},{key:"ArrowUp",run:()=>pe(e,-1)},{key:"Escape",run:()=>to(e)}]))]}function Jn(e){if(!e.docChanged)return!1;let t=!1;for(const i of e.transactions)i.isUserEvent("input.type")&&i.changes.iterChanges((r,s,a,d,l)=>{l.toString().endsWith(">")&&(t=!0)});if(!t)return!1;const n=e.state.selection.main.head,o=e.state.sliceDoc(Math.max(0,n-400),n);return/<[a-zA-Z][^<>]*>$/.test(o)}function ue(e){const t=++e.gen;e.win.setTimeout(()=>{t===e.gen&&eo(e)},0)}function Qn(){return B.htmlScopeActive&&B.htmlFocus?B.htmlFocus.from:0}function Zn(){const e=qe();return!!Je(e)&&!e.startsWith("view:")&&!N("dock:chrome-kind")}async function eo(e){const{view:t,win:n}=e,o=e.gen;if(!t.hasFocus||t.state.readOnly||!t.state.selection.main.empty||C.autocomplete.completionStatus(t.state)==="active")return;const i=t.state.doc,r=await ge(n);if(o!==e.gen||t.state.doc!==i||!t.hasFocus||!t.state.selection.main.empty)return;const s=Qn(),a=Y(),d=t.state.selection.main.head,l=zn(a,s+d,{fields:r,sectionPartial:Zn(),shellRoot:Ne(n),locked:We(a),counts:Ce(n)}).map(c=>Un(c,s)).filter(c=>c.changes.every(p=>p.from>=0&&p.to<=t.state.doc.length));if(!l.length){k(e);return}Q(e,l)}function Q(e,t,n="code_dock_help_title"){const{win:o}=e;k(e);const i=he({active:0}),r=He(e,"list",{render:()=>me(gt,{title:O(o,n),closeLabel:O(o,"code_dock_help_close"),items:t.map(s=>({id:s.id,label:O(o,s.key,s.args),meta:s.meta})),active:i.active,onAccept:s=>Oe(e,s),onHover:s=>{i.active=s}})});e.open.items=t,e.open.model=i,Z(e,r)}function fe(e){return e.open?.kind!=="list"?!1:(Oe(e,e.open.model.active),!0)}function pe(e,t){if(e.open?.kind!=="list")return!1;const{model:n,items:o}=e.open;return n.active=(n.active+t+o.length)%o.length,!0}function to(e){return e.open?(k(e),!0):!1}function Oe(e,t){const n=e.open?.items?.[t],{view:o}=e;if(n){if(k(e),n.tag&&Wn(e.win,n.tag,n.id),n.after==="loop"){io(e,n.loop.from);return}if(n.after==="visual-edit-field"){oo(e);return}if(!(o.state.readOnly||!n.changes.length)){if(n.after==="class"&&Ue(e.win)){const i=Ge(e.win);if(i){Ye(e.win,i);return}}e.writing=!0;try{o.dispatch({changes:n.changes,...n.selection==null?{}:{selection:{anchor:n.selection}},userEvent:"input.toolbar"})}finally{e.writing=!1}Xe(),n.after==="class"&&C.autocomplete.startCompletion(o),n.after==="visual-edit"&&no(e)}}}function _e(){const e=Qe();return e?.open?{name:e.name,from:e.open.from,to:e.open.to}:null}function no(e){const t=_e(),n=t?Yn(e.view.state.doc.toString(),t):[];n.length&&Q(e,n,"code_dock_help_ve_title")}async function oo(e){const{view:t,win:n}=e,o=++e.gen,i=t.state.doc,r=await ge(n);if(o!==e.gen||t.state.doc!==i)return;const s=_e(),a=Array.isArray(r)?r.filter(l=>l&&typeof l.var=="string"):[],d=s?Xn(i.toString(),s,a):[];d.length&&Q(e,d,"code_dock_help_ve_field_title")}function w(e){return tt(ke(Y()).find(t=>t.kind==="loop"&&t.from===e))}function io(e,t){const{win:n}=e,o=w(t);if(!o)return;e.draft="";const i=he({inspect:te(n,o),canEdit:!e.view.state.readOnly&&N("dock:is-locked")!==!0}),r=()=>{const l=w(t);if(!l){k(e);return}i.inspect=te(n,l,{draft:e.draft})},s=l=>{if(!l||e.open?.kind!=="loop")return;const c=Y(),p=w(t),S=p?l(c,p):c;if(S!==c){e.writing=!0;try{N("dock:set-html",S)}finally{e.writing=!1}}r()},a={kind:l=>s(st(n,w(t),l)),commit:l=>s(it(w(t),l)),sortDir:l=>{const c=ot(w(t),l);if(c.draft){e.draft=c.draft,r();return}e.draft="",s(c.edit)},sortField:l=>{const c=e.draft;e.draft="",s(nt(w(t),l,c))},limit:l=>s(dt(l)),offset:l=>s(lt(l)),depth:l=>s(at(l)),includeHome:l=>s(rt(l)),pickData:(l,c)=>N("dock:data-menu",{anchor:l,at:t,onPick:p=>c(String(p?.var||"").trim())})},d=He(e,"loop",{render:()=>me(Vt,{inspect:i.inspect,canEdit:i.canEdit,dataTitle:O(n,"data_vars_title"),closeLabel:O(n,"code_dock_help_close"),on:a})});Z(e,d)}function He(e,t,n){const{win:o}=e,i=o.document;Vn(i);const r=i.createElement("div");i.body.appendChild(r);const s=Be(n);s.mount(r);const a=r.firstElementChild||r,d=()=>Z(e,a),l=p=>{a.contains(p.target)||p.target.closest?.("[data-sve-data-menu]")||(a.contains(i.activeElement)&&i.activeElement.blur(),k(e))},c=p=>{p.key==="Escape"&&a.contains(p.target)&&(p.preventDefault(),p.stopPropagation(),k(e),e.view.focus())};return i.addEventListener("pointerdown",l,!0),i.addEventListener("keydown",c,!0),o.addEventListener("scroll",d,!0),o.addEventListener("resize",d),e.open={kind:t,el:a,host:r,app:s,unhook:()=>{i.removeEventListener("pointerdown",l,!0),i.removeEventListener("keydown",c,!0),o.removeEventListener("scroll",d,!0),o.removeEventListener("resize",d)}},a}function Z(e,t){const{view:n,win:o}=e,i=n.coordsAtPos(n.state.selection.main.head);if(!i)return;const r=t.offsetWidth,s=t.offsetHeight,a=Math.max(I,Math.min(i.left,o.innerWidth-r-I));let d=i.bottom+V;d+s>o.innerHeight-I&&i.top-s-V>=I&&(d=i.top-s-V),t.style.left=`${a}px`,t.style.top=`${Math.max(I,d)}px`}function k(e){const t=e.open;t&&(e.open=null,t.unhook(),t.app.unmount(),t.host.remove())}export{Io as disableHelp,Po as enableHelp};
