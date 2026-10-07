const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-AWaJHJyk.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{H as Gn,aa as Xn,X as or}from"./ids-vn_yj3mf.js";import{v as nr,l as sr}from"./codemirror-AxInpAVg.js";import{o as x,c as _,a as g,t as A,e as ar,F as j,i as at,w as L,l as Yn,k as go,u as w,Z as Xe,f as W,X as rr,x as h,r as sn,g as ir,W as lr,T as Ye,j as cr,U as an,V as dr,b as Y,d as N,z as Zn,_ as ur,p as V,q as mt,D as rn,E as fr,B as bo,a2 as yo,a0 as pr,s as Kt,ai as hr,m as mr}from"./addon-D6th4gga.js";import{a as rt,c as Jn,o as Ae,d as ln,t as vr,f as Qn,g as gr,h as br,e as ko,i as yr,m as ee,T as kr,j as xr,k as _r,l as xo,n as _o,q as ts,u as wr,v as cn,w as Ze,x as Sr,y as $r,z as no,A as Cr,B as Tr,C as es,D as os,E as T,F as Ar,G as dn,H as Mr}from"./lp-cluster-DoyGl0mB.js";import{I as op,J as np}from"./lp-cluster-DoyGl0mB.js";import{h as un,c as ns,r as ss,f as as,a as Er,b as Lr,d as Fr,e as wo,t as rs,g as Br,i as So,j as is,m as ls,k as Pr,l as cs,n as Ir,s as Gt,o as fn,p as ds,q as Me,u as Ee,v as $o,w as Or,x as Dr,y as Hr,z as us,A as Wr,B as jr,C as fs,D as zr,E as Rr,F as Co,G as Nr,H as pn,I as qr,J as Vr,K as Ur,L as Kr,M as Gr,N as Xr,O as Yr,P as Zr,Q as Jr,R as ps,S as Qr,T as so,U as ti,V as hs,W as ei,X as oi,Y as ni,Z as To,_ as si,$ as ai,a0 as ms,a1 as hn,a2 as de}from"./antlers-edit-CiW8ACvx.js";import{_ as vs,o as ri,C as ii,m as H}from"./ChoiceDialog-CtZua5Vu.js";import{M as gs,S as bs}from"./protocol-Brvy2KuB.js";import{t as li}from"./tw-candidates-wYTeDvRv.js";import{h as ci,a as di,e as ui,A as mn,b as fi,i as Ao,c as pi,d as be}from"./html-tag-sync-BpXNELva.js";import"./ai-text-icon-B7uCWIwa.js";import"./index-M2RCOyrL.js";import"./index-B5fiB6ig.js";import"./index-sh1K8s4m.js";import"./index-0IxPFT_m.js";import"./index-Ci-3qkVd.js";import"./index-DkhC0r6-.js";import"./index-B4S9JIPB.js";import"./index-BwRQ94Ql.js";import"./index-D9YSa79V.js";import"./index-DwJNgNWz.js";const et="__sve-css-rename-chip",hi='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';function mi(t){const e=t.Decoration.mark({class:"sve-cm-css-token"}),o=t.StateEffect.define();return{extensions:[t.StateField.define({create(){return t.Decoration.none},update(s,r){let i;for(const c of r.effects)c.is(o)&&(i=c.value);if(i===void 0)return r.docChanged?t.Decoration.none:s;if(!i)return t.Decoration.none;const l=new t.RangeSetBuilder;return l.add(i.from,i.to,e),l.finish()},provide:s=>t.EditorView.decorations.from(s)})],setHover(s,r){s&&s.dispatch({effects:o.of(r)})}}}function ot(t){t?.getElementById(et)?.remove()}function vi(t,e,o,n){e.style.left=`${Math.max(6,Math.min(o,t.innerWidth-28))}px`,e.style.top=`${Math.max(6,n)}px`}function gi(t,e,o,{onRename:n,title:s}){const r=t.document,i=e.coordsAtPos(o.to);if(!i)return;ot(r);const l=r.createElement("button");l.id=et,l.type="button",l.innerHTML=hi,l.title=s,l.setAttribute("aria-label",s),l.addEventListener("mousedown",c=>{c.preventDefault(),c.stopPropagation(),ot(r),n?.(o)}),l.addEventListener("mouseleave",()=>{t.setTimeout(()=>{e.dom.matches(":hover")||l.matches(":hover")||ot(r)},120)}),r.body.appendChild(l),vi(t,l,i.right+2,i.top-1)}function bi(t,e,{onRename:o,isLocked:n,setHover:s,title:r}){if(!e?.dom||e.dom._sveClassTokenBound)return;e.dom._sveClassTokenBound=!0;let i=null,l="";const c=()=>!!n?.(),d=()=>{t.clearTimeout(i),i=null,l="",s?.(e,null),ot(t.document)},f=p=>{if(c()){d();return}d(),o?.(p)};e.dom.addEventListener("mousemove",p=>{if(c()){d();return}if(p.target?.closest?.(`#${et}`))return;const m=e.posAtCoords({x:p.clientX,y:p.clientY});if(m==null)return;const b=un(e.state.doc.toString(),m);if(!b){t.clearTimeout(i),i=null,l="",s?.(e,null);return}const k=`${b.from}:${b.to}:${b.name}`;s?.(e,{from:b.from,to:b.to}),!(l===k&&(i||t.document.getElementById(et)))&&(t.clearTimeout(i),l=k,i=t.setTimeout(()=>{i=null,gi(t,e,b,{onRename:f,title:r||"Rename class"})},160))}),e.dom.addEventListener("mouseleave",p=>{p.relatedTarget?.closest?.(`#${et}`)||t.setTimeout(()=>{t.document.getElementById(et)?.matches(":hover")||d()},160)}),e.dom.addEventListener("dblclick",p=>{if(c())return;const m=e.posAtCoords({x:p.clientX,y:p.clientY});if(m==null)return;const b=un(e.state.doc.toString(),m);b&&(p.preventDefault(),p.stopPropagation(),f(b))},!0),e.scrollDOM?.addEventListener("scroll",d),t.document._sveClassTokenDismiss||(t.document._sveClassTokenDismiss=!0,t.document.addEventListener("mousedown",p=>{p.target.closest(`#${et}`)||ot(t.document)}))}const a={cssColorsPromise:null,lastUid:null,lastType:null,typeStack:[],beforePart:null,lastParts:{html:"",css:"",js:""},lastProps:[],propsDirty:!1,lastLocked:!1,lockReady:!1,lastWin:null,loadGen:0,saveTimer:null,lastBracketNames:null,lastCssSelectorNames:null,saveInFlight:null,loadInFlight:null,dragging:!1,applying:!1,htmlScopePref:!0,htmlScopeActive:!1,styleMode:"css",cssToolRow:null,cssOpenTool:"",cssOpenMenu:"",cssValues:!1,cssAll:!1,twCss:null,twKey:"",twBusy:!1,twDirty:!1,htmlFocus:null,cssFocus:null,htmlFull:"",cssFull:"",cssPane:"full",cssScopeSnapshot:"",layoutObserver:null,layoutWin:null,observedEditor:null,observedRight:null,layoutWatchBound:!1,cssSize:"",cssState:"",cssOwnFolds:new Set,cssFoldSig:"",htmlPartialUi:null,htmlAntlersUi:null,htmlClassTokenUi:null,htmlLintUi:null,cssGhostUi:null},At=new Map,vn={scope:null,section:[],page:[],site:[]};function ys(t){const e=t?.location?.pathname?.match(/\/collections\/([^/]+)\//);return e?e[1]:""}function ks(t){const e=String(t||"").trim();return!e||/^(header|footer)\//.test(e)?"":e}function yi(t){return(Array.isArray(t)?t:[]).filter(e=>e?.handle).map(e=>`${e.kind==="collection"?"collection":"field"}:${e.handle}`).join("|")}function Mo({collection:t,set:e,view:o,scope:n}){return`${t}::${e}::${o||""}::${n||""}`}function xs(t){return At.get(t)||null}function _s(t,{collection:e,set:o,view:n,scope:s}){const r=Mo({collection:e,set:o,view:n,scope:s}),i=At.get(r);if(i)return Promise.resolve(i);const l=new URLSearchParams;return e&&l.set("collection",e),o&&l.set("set",o),n&&l.set("view",n),s&&l.set("scope",s),t.fetch(`/!/sve/data-vars?${l.toString()}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(c=>c.ok?c.json():null).then(c=>{const d=c&&typeof c=="object"?c:vn;return At.set(r,d),d}).catch(()=>vn)}function ki(t){if(!t){At.clear();return}const e=`::${t}::`;for(const o of[...At.keys()])o.includes(e)&&At.delete(o)}function xi(t){if(t==null||t==="")return"";if(typeof t=="boolean")return t?"true":"false";if(Array.isArray(t))return t.length?`${t.length} ×`:"";if(typeof t=="object"){const o=Object.keys(t).length;return o?`${o} ×`:""}const e=String(t).replace(/\s+/g," ").trim();return e.length>60?`${e.slice(0,60)}…`:e}function _i(t,e){return e.split(".").reduce((o,n)=>o&&typeof o=="object"?o[n]:void 0,t)}function ws(t,e){return!Array.isArray(t)||!e||typeof e!="object"?t||[]:t.map(o=>{if(o.parent||o.value!=null||o.var.includes(":"))return o;const n=xi(_i(e,o.var));return n?{...o,value:n}:o})}function wi(t,e){return Array.isArray(t)?t.map(o=>({...o,items:ws(o.items,e)})):[]}function Si(t,e,{inline:o=!1}={}){const n=String(t?.var||"").trim();if(!n)return null;if(o)return{text:`{{ ${n} }}`,cursor:`{{ ${n} }}`.length};if(t.loop)return{text:`{{ ${n} }}
  
{{ /${n} }}`,cursor:`{{ ${n} }}
  `.length};if(e?.loop&&!t.parent){const s=e.loop;return{text:`{{ ${s} }}
  {{ ${n} }}
{{ /${s} }}`,cursor:`{{ ${s} }}
  {{ ${n} }}`.length}}return{text:`{{ ${n} }}`,cursor:`{{ ${n} }}`.length}}const ue="visual_edit",gn=[{id:"base",lang:"code_dock_visual_edit_base"},{id:"field",lang:"code_dock_visual_edit_field"}],Ss=[{id:"tag",group:"base",label:"{{ visual_edit }}",standalone:"{{ visual_edit| }}"},{id:"ve_popup",group:"base",label:"popup",attr:'popup="true"'},{id:"ve_orderable",group:"base",label:"orderable",attr:'orderable="true"'},{id:"ve_section_orderable",group:"base",label:"section_orderable",attr:'section_orderable="true"'},{id:"ve_outline_inside",group:"base",label:"outline_inside",attr:'outline_inside="true"'},{id:"ve_field",group:"field",label:"field",attr:'field="|"'},{id:"ve_inline_edit",group:"field",label:"inline_edit",attr:'inline_edit="true"'},{id:"ve_insertable",group:"field",label:"insertable",attr:'insertable="true"'},{id:"ve_toolbar",group:"field",label:"toolbar",attr:'toolbar="true"'},{id:"ve_scope",group:"field",label:"scope",attr:'scope="|"'},{id:"ve_controls",group:"field",label:"controls",attr:'controls="|"'}];function $i(t){return Ss.find(e=>e.id===t)||null}function Ci(t,e,o,n){let s=e;for(;s<o;){const r=t.indexOf("{{",s);if(r===-1||r>=o)return null;const i=t.indexOf("}}",r+2);if(i===-1||i+2>o)return null;const l=t.slice(r+2,i);if((l.trim().split(/\s+/)[0]||"")===n)return{openIdx:r,closeIdx:i,inner:l};s=i+2}return null}function Ti(t,e){const o=String(e).split("=")[0].trim();return new RegExp(`(^|\\s)${o}(=|\\s|$)`).test(t)}const Ai={class:"sve-code-dock"},Mi={"data-sve-code-bar":""},Ei={type:"button","data-sve-code-pane-btn":"html"},Li={type:"button","data-sve-code-pane-btn":"css"},Fi={type:"button","data-sve-code-pane-btn":"alpine"},Bi={type:"button","data-sve-code-pane-btn":"js"},Pi={type:"button","data-sve-html-scope":"","aria-pressed":"true"},Ii=["innerHTML"],Oi={"data-sve-code-panes":""},Di={"data-sve-code-pane":"html"},Hi={"data-sve-code-pane-label":""},Wi=["title","aria-label"],ji=["innerHTML"],zi={"data-sve-code-pane":"css"},Ri={"data-sve-css-chrome":"subrow-2"},Ni={"data-sve-code-pane-label":""},qi={"data-sve-css-label":""},Vi={"data-sve-code-pane":"alpine"},Ui={"data-sve-code-pane-label":""},Ki={"data-sve-code-pane":"js"},Gi={"data-sve-code-pane-label":""},Xi={__name:"CodeDockChrome",props:{htmlLabel:{type:String,required:!0},cssLabel:{type:String,required:!0},jsLabel:{type:String,required:!0},alpineLabel:{type:String,required:!0},treeIcon:{type:String,required:!0},dataIcon:{type:String,required:!0},dataLabel:{type:String,required:!0}},setup(t){return(e,o)=>(x(),_("div",Ai,[o[18]||(o[18]=g("div",{"data-sve-code-grip":"","aria-hidden":"true"},null,-1)),g("div",Mi,[g("button",Ei,A(t.htmlLabel),1),g("button",Li,A(t.cssLabel),1),g("button",Fi,A(t.alpineLabel),1),g("button",Bi,A(t.jsLabel),1),o[0]||(o[0]=ar('<button type="button" data-sve-code-back hidden></button><span data-sve-code-path></span><span data-sve-code-status></span><button type="button" data-sve-code-strip></button><button type="button" data-sve-code-history></button><button type="button" data-sve-style-mode></button><button type="button" data-sve-values-mode></button><button type="button" data-sve-css-all></button><button type="button" data-sve-code-autosave aria-pressed="true"></button><button type="button" data-sve-code-save hidden></button>',10)),g("button",Pi,[g("span",{innerHTML:t.treeIcon},null,8,Ii)]),o[1]||(o[1]=g("button",{type:"button","data-sve-code-lock":"",hidden:""},null,-1))]),o[19]||(o[19]=g("div",{"data-sve-code-lock-banner":""},null,-1)),g("div",Oi,[g("div",Di,[g("div",Hi,[g("span",null,A(t.htmlLabel),1),o[2]||(o[2]=g("div",{"data-sve-html-tools":""},null,-1)),o[3]||(o[3]=g("button",{type:"button","data-sve-html-tidy":""},null,-1)),g("button",{type:"button","data-sve-data-vars":"",title:t.dataLabel,"aria-label":t.dataLabel},[g("span",{innerHTML:t.dataIcon},null,8,ji)],8,Wi),o[4]||(o[4]=g("div",{"data-sve-visual-edit-tools":""},null,-1)),o[5]||(o[5]=g("div",{"data-sve-antlers-tools":""},null,-1))]),o[6]||(o[6]=g("div",{"data-sve-html-problems":"",hidden:""},null,-1)),o[7]||(o[7]=g("div",{"data-sve-code-host":""},null,-1))]),o[15]||(o[15]=g("div",{"data-sve-code-split":"","data-sve-code-split-after":"html"},null,-1)),g("div",zi,[g("div",Ri,[g("div",Ni,[g("span",qi,A(t.cssLabel),1),o[8]||(o[8]=g("button",{type:"button","data-sve-css-add-class":""},null,-1)),o[9]||(o[9]=g("div",{"data-sve-css-tools":""},null,-1))])]),o[10]||(o[10]=g("div",{"data-sve-css-head":""},null,-1)),o[11]||(o[11]=g("div",{"data-sve-code-host":""},null,-1)),o[12]||(o[12]=g("div",{"data-sve-tw-host":""},null,-1))]),o[16]||(o[16]=g("div",{"data-sve-code-split":"","data-sve-code-split-after":"css"},null,-1)),g("div",Vi,[g("div",Ui,[g("span",null,A(t.alpineLabel),1)]),o[13]||(o[13]=g("div",{"data-sve-alpine-host":""},null,-1))]),o[17]||(o[17]=g("div",{"data-sve-code-split":"","data-sve-code-split-after":"alpine"},null,-1)),g("div",Ki,[g("div",Gi,[g("span",null,A(t.jsLabel),1)]),o[14]||(o[14]=g("div",{"data-sve-code-host":""},null,-1))])])]))}},Nt=new Map;let jt=null,bn=0,yn=0,kn=!1;async function Yi(t,e){if(Nt.has(e))return Nt.get(e);const o=`view:partials/${e}`;let n=null;try{const s=await t.fetch(`/!/sve/section-template?type=${encodeURIComponent(o)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}});if(s.ok){const r=await s.json();n=typeof r.html=="string"?ss(r.html):null}}catch{}return Nt.set(e,n),n}function Zi(t){t?Nt.delete(t):Nt.clear()}function Eo(t){const e=ns(rt("dock:current-type")),o=e?rt("dock:html"):"",n=e&&typeof o=="string"?ss(o):null;Jn({source:bs,type:gs.SVE_COMPONENT_FOCUS,on:!!n,name:e?String(e).split("/").pop():"",selector:n||""},t)}async function Le(t){const e=++yn,o=rt("dock:html"),n=[...new Set((typeof o=="string"?as(o):[]).map(r=>r.src).filter(r=>r&&!Er(r)))],s=await Promise.all(n.map(r=>Yi(t,r)));e===yn&&Jn({source:bs,type:gs.SVE_COMPONENT_MAP,items:n.map((r,i)=>({src:r,name:r.split("/").pop(),selector:s[i]})).filter(r=>r.selector)},t)}function Ji(t){jt=t,!kn&&(kn=!0,Ae("dock:html-changed",()=>{jt&&(Zi(ns(rt("dock:current-type"))),jt.clearTimeout(bn),bn=jt.setTimeout(()=>{Le(jt)},400))}))}const Qi=["data-sve-html-tool","data-tip","aria-label","data-letter","onClick","onContextmenu"],tl=["innerHTML"],el={__name:"CodeDockHtmlTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(t){return(e,o)=>(x(!0),_(j,null,at(t.tools,n=>(x(),_("button",{key:n.id,type:"button","data-sve-html-tool":n.id,"data-tip":n.title,"aria-label":n.title,"data-letter":n.letter?"":void 0,onClick:L(s=>t.onTool(n.id),["prevent","stop"]),onContextmenu:L(s=>t.onTool(n.id),["prevent"])},[n.letter?(x(),_(j,{key:0},[Yn(A(n.letter),1)],64)):(x(),_("span",{key:1,innerHTML:n.icon},null,8,tl))],40,Qi))),128))}},ft=go({tools:[],onTool:null,onKid:null}),ol=["data-sve-css-item"],nl=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],sl={key:0,"data-sve-css-kids":""},al={key:0,"data-sve-css-sep":"","aria-hidden":"true"},rl=["data-sve-css-kid","data-sve-css-box-side","data-tip","aria-label","innerHTML","onClick","onContextmenu"],il={__name:"CodeDockCssTools",setup(t){return(e,o)=>(x(!0),_(j,null,at(w(ft).tools,n=>(x(),_("li",Xe({key:n.id,"data-sve-css-item":n.id},{ref_for:!0},n.open?{"data-sve-css-open":""}:{}),[g("button",Xe({type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title},{ref_for:!0},{...n.active?{"data-active":""}:{},...n.open?{"data-open":""}:{}},{innerHTML:n.icon,onClick:L(s=>w(ft).onTool?.(n.id),["prevent","stop"]),onContextmenu:L(s=>w(ft).onTool?.(n.id),["prevent"])}),null,16,nl),n.open&&n.kids.length?(x(),_("div",sl,[(x(!0),_(j,null,at(n.kids,s=>(x(),_(j,{key:s.id},[s.sep?(x(),_("span",al)):W("",!0),g("button",Xe({type:"button","data-sve-css-kid":s.id,"data-sve-css-box-side":s.id,"data-tip":s.title,"aria-label":s.title},{ref_for:!0},s.active?{"data-active":""}:{},{innerHTML:s.icon,onClick:L(r=>w(ft).onKid?.(n.id,s.id),["prevent","stop"]),onContextmenu:L(r=>w(ft).onKid?.(n.id,s.id),["prevent"])}),null,16,rl)],64))),128))])):W("",!0)],16,ol))),128))}},ll=1.5,cl=16;function ve(t,e){const o=parseFloat(t);return Number.isFinite(o)?e==="em"||e==="rem"?o*cl:o:null}function dl(t){const e=String(t||"").toLowerCase();if(/\bmin-width\b|\bwidth\s*>=?/.test(e))return null;let o=e.match(/\bmax-width\s*:\s*([\d.]+)(px|em|rem)/);return o||(o=e.match(/\bwidth\s*<=?\s*([\d.]+)(px|em|rem)/),o)?ve(o[1],o[2]):(o=e.match(/([\d.]+)(px|em|rem)\s*>=?\s*width\b/),o?ve(o[1],o[2]):null)}function ht(t,e){const o=dl(t);if(o===null)return"";for(const n of e||[]){if(n.base)continue;const s=ve(String(n.max||"").replace(/[a-z]+$/i,""),(String(n.max||"").match(/[a-z]+$/i)||[""])[0]);if(s!==null&&Math.abs(s-o)<=ll)return n.handle}return""}function Fe(t){let e="",o=0;for(;o<t.length;){const n=Be(t,o);if(n!==o){e+=" ".repeat(n-o),o=n;continue}e+=t[o],o+=1}return e}function Be(t,e){if(t.startsWith("/*",e)){const o=t.indexOf("*/",e+2);return o===-1?t.length:o+2}if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?t.length:o+2}if(t[e]==='"'||t[e]==="'"){const o=t[e];for(let n=e+1;n<t.length;n+=1)if(t[n]==="\\")n+=1;else if(t[n]===o)return n+1;return t.length}return e}function Pe(t){const e=String(t||""),o=[],n=(s,r,i=0)=>{let l=s,c=l;for(;l<r;){const d=Be(e,l);if(d!==l){l=d;continue}if(e[l]===";"){l+=1,c=l;continue}if(e[l]==="}")return;if(e[l]!=="{"){l+=1;continue}const f=Fe(e.slice(c,l)),p=f.trim(),m=$s(e,l,r);if(m===-1)return;/^@media\b/i.test(p)?o.push({query:p.replace(/^@media\s*/i,"").trim(),from:c+f.search(/\S/),to:m+1,bodyFrom:l+1,bodyTo:m,depth:i}):/^@(?:import|charset|use)\b/i.test(p)||n(l+1,m,i+1),l=m+1,c=l}};return n(0,e.length,0),o}function $s(t,e,o){let n=0;for(let s=e;s<o;s+=1){const r=Be(t,s);if(r!==s){s=r-1;continue}if(t[s]==="{")n+=1;else if(t[s]==="}"&&(n-=1,n===0))return s}return-1}function Pt(t){const e=String(t||""),o=(n,s)=>{const r=[];let i=n,l=i;for(;i<s;){const c=Be(e,i);if(c!==i){i=c;continue}if(e[i]===";"){i+=1,l=i;continue}if(e[i]==="}")return r;if(e[i]!=="{"){i+=1;continue}const d=Fe(e.slice(l,i)),f=d.trim(),p=$s(e,i,s);if(p===-1)return r;r.push({prelude:f,media:/^@media\b/i.test(f),query:f.replace(/^@media\s*/i,"").trim(),from:l+d.search(/\S/),to:p+1,bodyFrom:i+1,bodyTo:p,children:/^@(?:import|charset|use)\b/i.test(f)?[]:o(i+1,p)}),i=p+1,l=i}return r};return o(0,e.length)}function ul(t,e,o){const n=String(t||"");if(!o)return[];const s=(e||[]).find(d=>d.base),r=Pt(n),i=[],l=d=>d.media?ht(d.query,e)===o:d.children.some(l);if(s&&o===s.handle){const d=f=>{for(const p of f){if(p.media&&ht(p.query,e)){i.push({from:p.from,to:p.to});continue}d(p.children)}};return d(r),i}const c=(d,f,p)=>{const m=[];for(const k of d){if(k.media&&ht(k.query,e)===o){m.push({from:k.from,to:k.to,into:null});continue}l(k)&&m.push({from:k.from,to:k.to,into:k})}if(!m.length){p>f&&i.push({from:f,to:p});return}let b=f;for(const k of m)k.from>b&&i.push({from:b,to:k.from}),k.into&&c(k.into.children,k.into.bodyFrom,k.into.bodyTo),b=k.to;p>b&&i.push({from:b,to:p})};return c(r,0,n.length),i.filter(d=>n.slice(d.from,d.to).trim()!=="")}function fl(t,e){const o=String(t||""),n=[],s=i=>{for(const l of i){if((l.media&&ht(l.query,e)||/^#id-/.test(l.prelude))&&Fe(o.slice(l.bodyFrom,l.bodyTo)).trim()===""){n.push(l);continue}s(l.children)}};if(s(Pt(o)),!n.length)return o;let r=o;for(const i of n.sort((l,c)=>c.from-l.from)){let l=i.from,c=i.to;const d=r.lastIndexOf(`
`,l-1)+1;for(r.slice(d,l).trim()===""&&(l=d);r[c]===" "||r[c]==="	";)c+=1;r[c]===`
`&&(c+=1),r=r.slice(0,l)+r.slice(c)}return r}function pl(t,e){const o=String(t||""),n=[],s=i=>Fe(o.slice(i.bodyFrom,i.bodyTo)).trim()==="",r=i=>{for(const l of i){if((l.media&&ht(l.query,e)||/^#id-/.test(l.prelude))&&s(l)){n.push({from:l.from,to:l.to});continue}r(l.children)}};return r(Pt(o)),n}function ye(t,e,o){const n=e||[],s=n.find(d=>d.base),r=[],i=d=>/^#id-/.test(d.prelude)||/^#\s*$/.test(d.prelude),l=(d,f)=>{for(const p of d){if(!p.media){l(p.children,f);continue}const m=ht(p.query,n)||f;if(o===m){r.push(p);continue}l(p.children,m)}},c=(d,f)=>{for(const p of d){if(p.media){c(p.children,ht(p.query,n)||f);continue}if(i(p)){const m=f||(s?s.handle:"");!o||o===m?r.push(p):l(p.children,m);continue}c(p.children,f)}};return c(Pt(String(t||"")),""),r.sort((d,f)=>d.from-f.from)}function Lo(t,e,o){return Pe(t).filter(n=>ht(n.query,e)===o)}const S=go({tag:"",scope:"",scopeElsewhere:[],scopeElsewhereTitle:"",onScopeImport:null,onTag:null,sizes:[],onSize:null,state:"",stateLabel:"",onState:null,canEdit:!1,note:""}),hl={class:"sve-css-head"},ml=["disabled"],vl={key:1,class:"sve-css-scope"},gl=["title","disabled"],bl=["title","data-active","disabled","onClick"],yl=["data-active","disabled"],kl={key:3,class:"sve-css-note"},xl={__name:"CodeDockCssHead",setup(t){return(e,o)=>(x(),_("div",hl,[w(S).tag?(x(),_("button",{key:0,type:"button",class:"sve-css-tag",disabled:!w(S).canEdit,onClick:o[0]||(o[0]=L(()=>{},["prevent","stop"])),onDblclick:o[1]||(o[1]=L(n=>w(S).onTag?.(n),["prevent","stop"]))},"<"+A(w(S).tag)+">",41,ml)):W("",!0),w(S).scope?(x(),_("span",vl,A(w(S).scope),1)):W("",!0),w(S).scope&&w(S).scopeElsewhere.length?(x(),_("button",{key:2,type:"button",class:"sve-css-scope-taken",title:w(S).scopeElsewhereTitle,disabled:!w(S).canEdit,onClick:o[2]||(o[2]=L(n=>w(S).onScopeImport?.(),["prevent","stop"]))},A(w(S).scopeElsewhere.join(", ")),9,gl)):W("",!0),(x(!0),_(j,null,at(w(S).sizes,n=>(x(),_("button",{key:n.key,type:"button","data-sve-css-size":"",title:n.title,"data-active":n.active?"":void 0,disabled:!w(S).canEdit,onClick:L(s=>w(S).onSize?.(n.key),["prevent","stop"])},A(n.label),9,bl))),128)),g("button",{type:"button","data-sve-css-state":"","data-active":w(S).state?"":void 0,disabled:!w(S).canEdit,onClick:o[3]||(o[3]=L(n=>w(S).onState?.(n),["prevent","stop"]))},[Yn(A(w(S).stateLabel)+" ",1),o[4]||(o[4]=g("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[g("path",{d:"m6 9 6 6 6-6"})],-1))],8,yl),o[5]||(o[5]=g("span",{class:"sve-css-gap"},null,-1)),w(S).note?(x(),_("span",kl,A(w(S).note),1)):W("",!0)]))}},_l=vs(xl,[["__scopeId","data-v-22565303"]]),wl={key:0,"data-sve-css-swatches":""},Sl=["data-sve-css-token","title","data-active","onClick"],$l={key:0,"data-sve-css-head-row":""},Cl={key:1,"data-sve-css-note-row":""},Tl=["data-sve-css-token","data-active","onClick"],Al={"data-sve-css-choice-label":""},Ml={key:0,"data-sve-css-choice-hint":""},tt={__name:"CodeDockMenu",props:{kind:{type:String,required:!0},swatches:{type:Array,default:()=>[]},choices:{type:Array,default:()=>[]},onClear:{type:Function,default:null},onPick:{type:Function,required:!0}},setup(t){return(e,o)=>t.kind==="colors"?(x(),_("div",wl,[g("button",{type:"button","data-sve-css-clear":"",title:"Clear",onClick:o[0]||(o[0]=L((...n)=>t.onClear&&t.onClear(...n),["prevent","stop"]))},[...o[1]||(o[1]=[g("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none",stroke:"currentColor","stroke-width":"1.5"},[g("path",{d:"M2 2l6 6M8 2L2 8"})],-1)])]),(x(!0),_(j,null,at(t.swatches,n=>(x(),_("button",{key:n.name,type:"button","data-sve-css-swatch":"","data-sve-css-token":n.name,title:n.name,"data-active":n.active?"":void 0,style:rr({background:n.hex||"transparent"}),onClick:L(s=>t.onPick(n.name),["prevent","stop"])},null,12,Sl))),128))])):(x(!0),_(j,{key:1},at(t.choices,n=>(x(),_(j,{key:n.value},[n.heading?(x(),_("span",$l,A(n.label),1)):n.note?(x(),_("span",Cl,A(n.label),1)):(x(),_("button",{key:2,type:"button","data-sve-css-choice":"","data-sve-css-token":n.token||void 0,"data-active":n.active?"":void 0,onClick:L(s=>t.onPick(n.value),["prevent","stop"])},[g("span",Al,A(n.label),1),n.hint?(x(),_("span",Ml,A(n.hint),1)):W("",!0)],8,Tl))],64))),128))}},El=2e4;let _t=[],Cs=0,Rt=null,Je=null;function Ts(){return Je||(Je=Wt.define()),Je}function As(){return!!Rt&&Date.now()-Cs<El}function Fo(t){return As()||(Cs=Date.now(),Rt=t.fetch("/!/sve/site-css/defined",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{defined:[]}).then(e=>(_t=Array.isArray(e?.defined)?e.defined:[],v.html?.dispatch({effects:Ts().of(null)}),_t)).catch(()=>(Rt=null,_t))),Rt}function Ie(t){return t.document.getElementById(u)?.querySelector("[data-sve-code-path]")?.textContent.trim()||""}function Ll(t,e){const o=Ie(t),n=new Map;for(const s of _t){const r=n.get(s.name)||new Set;r.add(s.file===o?e:String(s.file).replace(/^.*\//,"")),n.set(s.name,r)}return[...n].map(([s,r])=>({name:s,detail:[...r].join(", ")})).sort((s,r)=>s.name.localeCompare(r.name))}function Bo(t,e){const o=Ie(t);return e?_t.filter(n=>n.name===e&&n.file!==o):[]}const Ms=t=>[...new Set(t.map(e=>String(e.file).replace(/^.*\//,"")))];function Po(t,e){const o=Bo(t,e).map(r=>r.css).filter(Boolean).join(`
`);if(!o)return!1;const n=rt("dock:css");if(typeof n!="string")return!1;const s=Lr(n,e,o);return s!==n&&rt("dock:set-css",s)!==!1}function Fl(t,e){const o=t.doc.lineAt(e),n=e-o.from,s=/\bclass\s*=\s*(["'])/gi;let r;for(;r=s.exec(o.text);){const i=r[1],l=r.index+r[0].length,c=o.text.indexOf(i,l),d=c===-1?o.text.length:c;if(n<l||n>d)continue;const f=o.text.slice(l,d),p=Fr(f),m=n-l;if(!p||m<p.innerFrom||m>p.innerTo)return null;const b=(f.slice(p.innerFrom,m).match(/[\w-]*$/)||[""])[0];return{from:e-b.length,typed:b}}return null}function Bl(t){return e=>{const o=Fl(e.state,e.pos);return!o||!o.typed&&!e.explicit?null:Fo(t).then(n=>{const s=Ie(t),r=o.typed.toLowerCase(),i=new Map;for(const c of n){if(c.file===s||!String(c.name).toLowerCase().startsWith(r))continue;const d=i.get(c.name)||{files:[],css:[]};d.files.push(c),c.css&&d.css.push(c.css),i.set(c.name,d)}if(!i.size)return null;const l=[...i].slice(0,40).map(([c,d])=>({label:c,type:"class",detail:Ms(d.files).join(", "),info:d.css.length?()=>{const f=t.document.createElement("pre");return f.textContent=d.css.join(`
`),f.style.cssText="margin:0;padding:.3em .5em;font:11px ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap",f}:void 0,apply:(f,p,m,b)=>{f.dispatch({changes:{from:m,to:b,insert:c},selection:{anchor:m+c.length}}),t.setTimeout(()=>Po(t,c),0)}}));return{from:o.from,options:l,validFor:/^[\w-]*$/}})}}function Pl(t){const e=o=>{if(!_t.length)return Q.none;const n=Ie(t),s=new ut;for(const r of wo(o)){const i=_t.filter(l=>l.name===r.name&&l.file!==n);i.length&&s.add(r.from,r.to,Q.mark({class:"sve-cm-class-taken",attributes:{title:h(t,"class_defined_in",{file:Ms(i).join(", ")})}}))}return s.finish()};return dt.define({create:o=>e(o.doc.toString()),update:(o,n)=>n.docChanged||n.effects.some(s=>s.is(Ts()))?e(n.state.doc.toString()):o,provide:o=>F.decorations.from(o)})}const Il=/^\.[a-zA-Z_][\w-]*$/;function Ol(t,e,o){return String(e||"").includes(o)?ke(t).length===1:!1}function ke(t){return Pt(t).filter(e=>/^@scope\b/i.test(e.prelude))}function Dl(t){const e=String(t||"");return Pt(e).filter(o=>Il.test(o.prelude)?!e.slice(o.from,o.bodyFrom-1).includes("{{"):!1).map(o=>({from:o.from,to:o.to,name:o.prelude.slice(1)}))}function Hl(t,e,o){const n=String(t||"");if(!Ol(n,e,o))return n;const s=Dl(n);if(!s.length)return n;const r=ke(n)[0],i=zl(n,r),l=s.map(m=>Rl(n.slice(m.from,m.to),n,m.from,i)).join(`

`);let c=n;for(const m of[...s].sort((b,k)=>k.from-b.from))c=jl(c,m.from,m.to);const d=Wl(c,o);if(d===-1)return n;const f=(c.slice(0,d).match(/\n([^\S\n]*)$/)||[null,null])[1],p=f===null?d:d-f.length;return`${c.slice(0,p)}
${l}
${f??""}${c.slice(d)}`}function Wl(t,e){const o=ke(t).find(n=>n.prelude.includes(e));return o?o.bodyTo:ke(t)[0]?.bodyTo??-1}function jl(t,e,o){let n=e,s=o;const r=t.lastIndexOf(`
`,n-1)+1;for(t.slice(r,n).trim()===""&&(n=r);t[s]===" "||t[s]==="	";)s+=1;return t[s]===`
`&&(s+=1),t.slice(0,n)+t.slice(s)}function zl(t,e){const o=t.slice(e.bodyFrom,e.bodyTo).match(/\n([^\S\n]+)\S/);return o?o[1]:`${(t.slice(0,e.from).match(/\n([^\S\n]*)$/)||[null,""])[1]}    `}function Rl(t,e,o,n){const s=(e.slice(0,o).match(/\n([^\S\n]*)$/)||[null,""])[1];return t.split(`
`).map((r,i)=>i===0?n+r.trim():r.startsWith(s)?n+r.slice(s.length):n+r.trimStart()).join(`
`)}const Nl={"data-sve-css-add-label":""},ql=["placeholder","onKeydown"],Vl={key:0,"data-sve-css-add-hint":""},Ul={"data-sve-css-add-existing":""},Kl={"data-sve-css-add-list":""},Gl=["onClick"],Xl={"data-sve-css-add-name":""},Yl={"data-sve-css-add-detail":""},Zl={key:0,"data-sve-css-add-none":""},Jl=["disabled"],Io={__name:"CodeDockAddClass",props:{label:{type:String,required:!0},placeholder:{type:String,default:""},initial:{type:String,default:""},onAdd:{type:Function,required:!0},options:{type:Array,default:()=>[]},onPick:{type:Function,default:null},takenText:{type:Function,default:null},existingLabel:{type:String,default:""},createLabel:{type:String,default:""},onClose:{type:Function,default:null}},setup(t){const e=t,o=sn(e.initial||""),n=sn(null);ir(()=>lr(()=>{n.value?.focus(),n.value?.select()}));const s=Ye(()=>o.value.trim().toLowerCase()),r=Ye(()=>{if(!e.options.length)return[];const c=s.value,d=[],f=[];for(const p of e.options){const m=p.name.toLowerCase();!c||m.startsWith(c)?d.push(p):m.includes(c)&&f.push(p)}return[...d,...f].slice(0,8)}),i=Ye(()=>e.takenText&&s.value?e.takenText(o.value.trim()):"");function l(){const c=o.value.trim();if(!c){n.value?.focus();return}if(i.value&&e.onPick){e.onPick(c);return}e.onAdd(c)}return(c,d)=>(x(),_(j,null,[g("label",Nl,A(t.label),1),cr(g("input",{ref_key:"input",ref:n,"data-sve-css-add-input":"","onUpdate:modelValue":d[0]||(d[0]=f=>o.value=f),type:"text",placeholder:t.placeholder,onKeydown:[an(L(l,["prevent"]),["enter"]),d[1]||(d[1]=an(L(f=>t.onClose?.(),["stop","prevent"]),["escape"]))]},null,40,ql),[[dr,o.value]]),i.value?(x(),_("div",Vl,A(i.value),1)):W("",!0),t.options.length?(x(),_(j,{key:1},[g("div",Ul,A(t.existingLabel),1),g("div",Kl,[(x(!0),_(j,null,at(r.value,f=>(x(),_("button",{key:f.name,type:"button","data-sve-css-add-option":"",onMousedown:d[2]||(d[2]=L(()=>{},["prevent"])),onClick:L(p=>t.onPick?.(f.name),["prevent","stop"])},[g("span",Xl,A(f.name),1),g("span",Yl,A(f.detail),1)],40,Gl))),128)),r.value.length?W("",!0):(x(),_("div",Zl,"—"))]),g("button",{type:"button","data-sve-css-add-create":"",disabled:!!i.value||!s.value,onMousedown:d[3]||(d[3]=L(()=>{},["prevent"])),onClick:L(l,["prevent","stop"])},A(t.createLabel),41,Jl)],64)):W("",!0)],64))}};function xn(t,e){e._sveLockBound||(e._sveLockBound=!0,e.querySelector("[data-sve-code-lock]")?.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),!(!a.lockReady||!a.lastType)){if(a.lastLocked){tc(t);return}Es(t,!0)}}))}function Oo(t){return t?Y(t,Ga)!=="0":!0}function Ql(){const t=v.html;return!t||t.state.readOnly||!a.lastType?!1:!No(Ro(),a.lastParts)}function J(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-code-autosave]"),n=e?.querySelector("[data-sve-code-save]");if(!o||!n)return;const s=Oo(t),r=Ql();o.setAttribute("aria-pressed",s?"true":"false"),o.title=h(t,s?"code_dock_autosave_on":"code_dock_autosave_off"),o.setAttribute("aria-label",o.title),o.innerHTML=pf,n.hidden=s,n.title=h(t,"code_dock_save"),n.setAttribute("aria-label",n.title),n.innerHTML=hf,r?n.setAttribute("data-dirty",""):n.removeAttribute("data-dirty")}function _n(t,e){e._sveAutosaveBound||(e._sveAutosaveBound=!0,e.querySelector("[data-sve-code-autosave]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=!Oo(t);N(t,Ga,n?"1":"0"),n?z(t.document):a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null),J(t)}),e.querySelector("[data-sve-code-save]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),z(t.document)}))}function tc(t){t.document.getElementById(U)?.remove();const e=ri(t.document,ii,{title:h(t,"code_dock_unlock_title"),body:h(t,"code_dock_unlock_body"),buttons:[{value:"cancel",label:h(t,"cancel"),variant:"ghost"},{value:"ok",label:h(t,"code_dock_unlock_confirm"),variant:"primary"}],onPick:o=>{e.dismiss(),o==="ok"&&Es(t,!1)}});e.host.id=U}function Es(t,e){const o=a.lastType;if(!o)return;const n=()=>{a.lastType===o&&t.fetch("/!/sve/section-template/lock",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Zn(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:o,locked:e})}).then(async s=>{if(!s.ok)throw new Error(String(s.status));a.lastType===o&&(a.lastLocked=e,wt(t),Ot(a.lastParts,e),q(t),I(t.document,e?h(t,"code_dock_locked"):""))}).catch(()=>{I(t.document,h(t,"code_dock_error"))})};if(e&&(z(t.document),a.saveInFlight)){a.saveInFlight.finally(n);return}n()}function Xt(t,e){const o=String(e||"");if(/^(header|footer)\//.test(o))return!0;const n=t?.Statamic?.$config?.get?.("sveChromeTemplates")||{};return Object.values(n).some(s=>s&&s.type===o)}function xe(t){const e=a.lastType;if(!a.lastUid||!e||String(e).startsWith("view:")||Xt(t,e)){ln(t);return}const o=vr(a.lastUid,t.document);ln(t,o.length?{sectionUids:o}:void 0)}function ec(t,e,o){return a.saveInFlight=t.fetch("/!/sve/section-template",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Zn(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:e,html:o.html,css:o.css,js:o.js,...typeof o.tw=="string"?{tw:o.tw}:{},...Br(t)?{props:a.lastProps}:{}})}).then(async n=>{if(n.status===423){a.lastLocked=!0,a.lockReady=!0,wt(t),Ot(a.lastParts,!0),q(t),I(t.document,h(t,"code_dock_locked"));return}const s=await n.json().catch(()=>({}));if(!n.ok)throw new Error(s?.error==="not_writable"?"not_writable":String(n.status));if(a.lastType===e){if(a.lastParts=o,s?.tw_written===!1){a.twDirty=!0,I(t.document,h(t,"code_dock_tw_not_writable")),J(t),xe(t);return}I(t.document,h(t,"code_dock_saved")),J(t),t.setTimeout(()=>{const r=t.document.getElementById(u)?.querySelector("[data-sve-code-status]");r&&r.textContent===h(t,"code_dock_saved")&&(r.textContent="")},1800)}xe(t),t.document.getElementById("__sve-section-picker")?.dispatchEvent(new t.CustomEvent("sve-library-stale"))}).catch(n=>{I(t.document,h(t,n?.message==="not_writable"?"code_dock_not_writable":"code_dock_error"))}).finally(()=>{a.saveInFlight=null}),a.saveInFlight}function z(t){a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null);const e=a.lastType,o=a.lastWin,n=v.html;if(!n||n.state.readOnly||!e||!o||!a.lockReady)return;const s=Ro(),r=a.twCss!==null&&rs(o)&&Do(s.html)===a.twKey;No(s,a.lastParts)&&!(r&&a.twDirty)&&!a.propsDirty||(a.propsDirty=!1,r&&(s.tw=a.twCss,a.twDirty=!1),I(t,h(o,"code_dock_saving")),ec(o,e,s))}function Do(t){return li(t).sort().join(" ")}function Ls(){a.twCss=null,a.twKey="",a.twDirty=!1}function oc(t,e){a.twCss=e,a.twKey=Do(t),a.twDirty=!1}function Fs(t,e){if(!t||!rs(t))return;const o=Do(e);o===a.twKey||a.twBusy||(a.twBusy=!0,ur(()=>import("./tw-compile-AWaJHJyk.js"),__vite__mapDeps([0,1]),import.meta.url).then(n=>n.compileTailwind(t,e)).then(n=>{a.twBusy=!1,a.twCss=n,a.twKey=o,a.twDirty=!0,Bs(t,t.document)}).catch(n=>{a.twBusy=!1,console.error("[sve] tailwind compile",n)}))}function Bs(t,e){a.saveTimer&&clearTimeout(a.saveTimer),a.saveTimer=t.setTimeout(()=>{a.saveTimer=null,z(e)},lf)}function G(t){if(a.applying)return;const e=Ro();if(No(e,a.lastParts)){J(t);return}if(J(t),Fs(t,e.html),!Oo(t)){I(t.document,h(t,"code_dock_unsaved"));return}I(t.document,h(t,"code_dock_saving")),Bs(t,t.document)}function Ho(t,e){let o=0;const n=Math.min(t.length,e.length);for(;o<n&&t[o]===e[o];)o+=1;let s=t.length,r=e.length;for(;s>o&&r>o&&t[s-1]===e[r-1];)s-=1,r-=1;return[o,s,e.slice(o,r)]}function Ps(t){const e=a.lastUid,o=typeof V=="function"?V(t.document):[];for(const n of o){const s=mt(n.values)||n.values;if(!(!s||typeof s!="object")&&e&&typeof rn=="function"){const r=rn(s,e);if(r){const i=r.split("."),l=fr(s,i.slice(0,2).join("."));if(l&&typeof l=="object")return l}}}for(const n of o){const s=mt(n.values)||n.values;if(s&&typeof s=="object")return s}return null}function Is(t,e){!e||e===a.lastType||(z(t.document),Ht(t,e,"push"))}function Os(t){const e=a.typeStack.pop();if(!e){Bt(t);return}z(t.document),Ht(t,e,"keep")}function wt(t){const e=t.document.getElementById(u),o=e?.querySelector("[data-sve-code-lock]"),n=e?.querySelector("[data-sve-code-lock-banner]");if(!e||!o)return;const s=a.lastLocked;e.toggleAttribute("data-sve-code-locked",s),s&&(ds(t.document),ot(t.document),a.htmlPartialUi&&(a.htmlPartialUi.setHover(v.html,null),a.htmlPartialUi.setHover(v.css,null)),a.htmlClassTokenUi?.setHover(v.html,null)),o.hidden=!a.lockReady,o.setAttribute("aria-pressed",a.lastLocked?"true":"false"),o.title=h(t,a.lastLocked?"code_dock_unlock":"code_dock_lock"),o.setAttribute("aria-label",o.title),o.innerHTML=a.lastLocked?cf:df,n&&(n.textContent=h(t,"code_dock_locked_banner"))}function oe(t){return t?Y(t,Ue)!=="0":a.htmlScopePref}function Oe(t,e,o){return t!=null&&e!=null&&t>=0&&e>t&&e<=o}function nt(){const t=globalThis.document?.getElementById(u);t&&(t.__sveHtmlScope=a.htmlScopeActive&&a.htmlFocus?{full:a.htmlFull,from:a.htmlFocus.from,to:a.htmlFocus.to,css:a.cssFull}:null)}function ne(){const t=v.html?.state.doc.toString()??"";if(!a.htmlScopeActive||!a.htmlFocus){a.htmlFull=t,nt();return}if(a.htmlFocus.from<0||a.htmlFocus.from>a.htmlFull.length||a.htmlFocus.to<a.htmlFocus.from){a.htmlScopeActive=!1,a.htmlFull=t,a.htmlFocus=null,nt();return}a.htmlFull=a.htmlFull.slice(0,a.htmlFocus.from)+t+a.htmlFull.slice(a.htmlFocus.to),a.htmlFocus={from:a.htmlFocus.from,to:a.htmlFocus.from+t.length},nt()}function vt(){return ne(),a.htmlScopeActive?a.htmlFull:v.html?.state.doc.toString()??a.lastParts.html??""}function De(){a.lastBracketNames=wo(vt()).map(t=>t.name)}function It(){a.lastCssSelectorNames=cs(v.css?.state.doc.toString()??a.cssFull)}function Ds(t,e){return Array.isArray(t)&&Array.isArray(e)&&t.length===e.length&&t.every((o,n)=>o===e[n])}function Hs(t,e){a.cssFull=Or(a.cssFull,t,e),a.cssFull=Dr(a.cssFull,e,t)}function nc(t){if(a.applying||a.lastLocked||a.lastBracketNames==null)return;const e=wo(vt()).map(o=>o.name);Ds(a.lastBracketNames,e)||(Hs(a.lastBracketNames,e),a.lastBracketNames=e,$t(),It())}function sc(){if(a.applying||a.lastLocked||a.lastCssSelectorNames==null||a.lastBracketNames==null||a.cssPane==="empty")return;const t=v.html,e=cs(v.css?.state.doc.toString()??"");if(!t||Ds(a.lastCssSelectorNames,e))return;const o=new Set(a.lastBracketNames),{renamed:n,removed:s}=Ir(a.lastCssSelectorNames,e);let r=t.state.doc.toString();const i=r;for(const l of n){const c=Gt(l.to);!o.has(l.from)||!c||(r=fn(r,d=>d===l.from?c:d))}for(const l of s)!o.has(l)||e.includes(l)||(r=fn(r,c=>c===l?"":c));if(r!==i){a.applying=!0;try{He(r)}finally{a.applying=!1}}De(),a.lastCssSelectorNames=e}function ac(t,e){const o=Gt(e),n=v.html;if(!o||!n||n.state.readOnly||o===t.name)return;a.applying=!0;try{n.dispatch({changes:{from:t.from,to:t.to,insert:o}})}finally{a.applying=!1}const s=a.lastBracketNames==null?[]:a.lastBracketNames.slice();De(),Hs(s,a.lastBracketNames),$t(),It(),a.lastWin&&(G(a.lastWin),E(a.lastWin))}function rc(t,e){const o=t.document,s=v.html?.coordsAtPos(e.from);$(o),ot(o);const r=o.createElement("div"),i={getBoundingClientRect:()=>({left:s?.left??12,right:s?.right??12,top:s?.top??12,bottom:s?.bottom??12,width:0,height:0})};r.id=y,o.body.appendChild(r),D(t,i,r),r._sveApp=H(Io,r,{label:h(t,"code_dock_css_rename_class"),placeholder:h(t,"code_dock_css_class_placeholder"),initial:e.name,onAdd:l=>{ac(e,l),$(o)}})}function Ws(){return a.htmlScopePref&&Oe(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)?(a.htmlScopeActive=!0,nt(),a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to)):(a.htmlScopeActive=!1,nt(),a.htmlFull)}function se(t,e,o){const n=v[t];if(!n)return;const s=n.state.doc.toString();a.applying=!0;try{if(s!==e){const[r,i,l]=Ho(s,e);n.dispatch({changes:{from:r,to:i,insert:l},...o?{selection:o,scrollIntoView:!0}:{}})}else o&&n.dispatch({selection:o,scrollIntoView:!0})}finally{a.applying=!1}}function He(t,e){se("html",t,e)}function js(){return a.htmlScopeActive?v.html?.state.doc.toString()??"":Oe(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)?a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to):""}function zs(){const t=a.cssFocus?.path;if(!t)return null;const e=vt(),o=Me(Ee(e),new Set).find(n=>n.path===t);return o?e.slice(o.from,o.to):(a.cssFocus=null,null)}function ic(){return zs()??js()}function Yf(){a.cssFocus=null}function lc(t){if(!t||a.applying||a.cssValues)return;const e=v.html;if(!e)return;ne(),X();const o=a.htmlScopeActive&&!!a.htmlFocus,s=(o?a.htmlFocus.from:0)+e.state.selection.main.from;let r=null;for(const l of Me(Ee(a.htmlFull),new Set))l.from<=s&&s<l.to&&(r=l);!r||s<r.from||s>=r.openTo||(a.cssFocus?a.cssFocus.path===r.path:o&&a.htmlFocus.from===r.from&&a.htmlFocus.to===r.to)||(a.cssFocus={path:r.path},$t())}function X(){const t=v.css?.state.doc.toString()??"";if(a.cssPane==="tree"){if(t===a.cssScopeSnapshot)return;const e=So(ic())[0]?.className||Pr(t);a.cssFull=ls(a.cssFull,t,e),a.cssScopeSnapshot=t}else a.cssPane==="full"&&(a.cssFull=t)}function cc(t,e){return(e||[]).some(o=>!$o(t,o.className))}function $t(){let t=a.cssFull,e=[],o=!1;const n=zs(),s=n==null&&!a.htmlScopeActive;a.cssValues||a.cssAll||!a.htmlScopePref?(a.cssPane="full",t=a.cssFull):(e=So(n??(s?vt():js())),e.length?(a.cssPane="tree",t=is(a.cssFull,e),!a.cssFocus&&!s&&cc(a.cssFull,e)&&(a.cssFull=ls(a.cssFull,t,e[0].className),o=!0)):(a.cssPane="empty",t="")),a.cssScopeSnapshot=t,se("css",t),It(),a.lastWin&&(Dt(a.lastWin,!0),E(a.lastWin),o&&G(a.lastWin))}function Wo(t){const e=v.html;if(!e||!a.htmlFocus)return;a.htmlScopeActive||(a.htmlFull=e.state.doc.toString());const o=a.htmlFull.length,n=Math.max(0,Math.min(a.htmlFocus.from,o)),s=Math.max(n,Math.min(a.htmlFocus.to,o));if(s<=n)return;a.htmlFocus={from:n,to:s},a.htmlScopeActive=!0,nt();const r=t==null?0:Math.max(0,Math.min(t-n,s-n));He(a.htmlFull.slice(n,s),{anchor:r,head:r}),$t(),e.focus()}function jo(t=!0,e=null){const o=v.html;if(!o)return;X(),ne(),a.htmlScopeActive=!1,nt();const n=a.htmlFull||o.state.doc.toString(),s=e!=null?{anchor:Math.max(0,Math.min(e,n.length))}:t&&Oe(a.htmlFocus?.from,a.htmlFocus?.to,n.length)?{anchor:a.htmlFocus.from,head:a.htmlFocus.to}:null;a.htmlFull=n,He(n,s),a.cssPane="full",a.cssScopeSnapshot=a.cssFull,se("css",a.cssFull),It()}function ae(){a.htmlFocus=null,a.cssFocus=null,a.htmlScopeActive=!1,a.htmlFull="",a.cssFull="",a.cssPane="full",a.cssScopeSnapshot="",a.lastBracketNames=null,a.lastCssSelectorNames=null,nt()}let Yt=!1;function Mt(t){return!!t?.document.getElementById(Gn)}function ao(t,e){if(!(!t||bo(t,"html_tree")===!1)){if(!e){Mt(t)&&Qn(t);return}Mt(t)||(Yt=!0,gr("html_tree").then(()=>{Mt(t)||br(t)}).catch(()=>{}).finally(()=>{Yt=!1,q(t)}))}}function q(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-html-scope]");if(!e)return;a.htmlScopePref=oe(t);const o=bo(t,"html_tree")===!1?a.htmlScopePref:Mt(t)||Yt;e.setAttribute("aria-pressed",o?"true":"false"),e.title=h(t,o?"code_dock_html_scope_off":"code_dock_html_scope"),e.setAttribute("aria-label",e.title),e.innerHTML=Za,t.document.getElementById(u)?.toggleAttribute("data-sve-html-scoped",a.htmlScopeActive),nt()}function wn(t,e){e._sveHtmlScopeBound||(e._sveHtmlScopeBound=!0,a.htmlScopePref=oe(t),dc(t,e),ao(t,a.htmlScopePref),e.querySelector("[data-sve-html-scope]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=Mt(t)||Yt;a.htmlScopePref=!n,N(t,Ue,a.htmlScopePref?"1":"0"),a.htmlScopePref?a.htmlFocus&&(X(),Wo()):a.htmlScopeActive&&jo(),ao(t,a.htmlScopePref),q(t)}))}function dc(t,e){e._sveTreeWatchBound||(e._sveTreeWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>{if(Yt||bo(t,"html_tree")===!1||!t.document.getElementById(u))return;const o=Mt(t);o!==oe(t)&&(a.htmlScopePref=o,N(t,Ue,o?"1":"0"),o?a.htmlFocus&&(X(),Wo()):a.htmlScopeActive&&jo(),q(t))}))}const uc=new Set(["pre","textarea","script","style"]),fc=/^(<\/|\{\{\s*\/)/;function pc(t){let e=0;for(const o of t.split(`
`)){if(!o.trim())continue;const n=o.length-o.trimStart().length;n>0&&(e===0||n<e)&&(e=n)}return" ".repeat(e===2||e===3?e:4)}function hc(t){const e=String(t||"");if(!e.trim())return e;const o=[],n=l=>{for(const c of l||[])o.push(c),n(c.children)};n(Hr(e));const s=pc(e),r=[];let i=0;for(const l of e.split(`
`)){const c=i,d=l.trim();i+=l.length+1;const f=c+(l.length-l.trimStart().length),p=o.filter(b=>b.from<f&&f<b.to);if(p.some(b=>uc.has(b.tag))){r.push(l);continue}if(!d)continue;const m=p.length-(fc.test(d)?1:0);r.push(s.repeat(Math.max(m,0))+d)}return r.join(`
`)+(e.endsWith(`
`)?`
`:"")}function ro(t,e){let o=0;for(;o<e;){const n=mc(t,o);if(n===null){o+=1;continue}if(n===-1)return e;if(n>e)return n;o=n}return e}function mc(t,e){if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?-1:o+2}if(t.startsWith("<!--",e)){const o=t.indexOf("-->",e+4);return o===-1?-1:o+3}return t[e]==="<"&&/[A-Za-z/!?]/.test(t[e+1]||"")?vc(t,e):null}function vc(t,e){let o="",n=e+1;for(;n<t.length;){const s=t[n];if(o){s===o&&(o=""),n+=1;continue}if(t.startsWith("{{",n)){const r=t.indexOf("}}",n+2);if(r===-1)return-1;n=r+2;continue}if(s==='"'||s==="'"){o=s,n+=1;continue}if(s===">")return n+1;if(s==="<")return-1;n+=1}return-1}function zo(t,e){if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?t.length:o+2}if(t.startsWith("<!--",e)){const o=t.indexOf("-->",e+4);return o===-1?t.length:o+3}return e}function _e(t,e){if(t[e]!=="<")return null;const o=t.indexOf(">",e+1);if(o===-1)return null;const n=t.slice(e,o+1),s=n.match(/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/);if(s)return{kind:"close",name:s[1].toLowerCase(),from:e,to:o+1};const r=n.match(/^<([A-Za-z][A-Za-z0-9:-]*)/);if(!r)return{kind:"other",from:e,to:o+1};const i=r[1].toLowerCase();return{kind:/\/\s*>$/.test(n)||["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"].includes(i)?"void":"open",name:i,from:e,to:o+1}}function io(t,e,o){let n=1,s=o;for(;s<t.length;){const r=zo(t,s);if(r!==s){s=r;continue}if(t[s]!=="<"){s+=1;continue}const i=_e(t,s);if(!i)break;if(i.kind==="open"&&i.name===e)n+=1;else if(i.kind==="close"&&i.name===e&&(n-=1,n===0))return i;s=i.to}return null}function gc(t,e){const o=[];let n=0;for(;n<e;){const s=zo(t,n);if(s!==n){n=s;continue}if(t[n]!=="<"){n+=1;continue}const r=_e(t,n);if(!r)return null;if(e<r.to){if(r.kind==="open")return{name:r.name,open:r,close:io(t,r.name,r.to),at:"open"};if(r.kind==="void")return{name:r.name,open:r,close:null,at:"open"};if(r.kind==="close"){let i=null;for(let l=o.length-1;l>=0;l-=1)if(o[l].name===r.name){i=o[l];break}return{name:r.name,open:i,close:r,at:"close"}}return null}if(r.kind==="open")o.push(r);else if(r.kind==="close"){for(let i=o.length-1;i>=0;i-=1)if(o[i].name===r.name){o.splice(i);break}}n=r.to}return null}function re(){const t=v.html;if(!t)return null;const e=t.state.selection.main.head,o=t.state.doc.toString(),n=[];let s=0;for(;s<e;){const c=zo(o,s);if(c!==s){s=c;continue}if(o[s]!=="<"){s+=1;continue}const d=_e(o,s);if(!d||d.from>=e)break;if(d.kind==="open")n.push(d);else if(d.kind==="close"){for(let f=n.length-1;f>=0;f-=1)if(n[f].name===d.name){n.splice(f);break}}s=d.to}const r=o.lastIndexOf("<",Math.max(0,e-1));if(r!==-1&&o.indexOf(">",r)>=e){const c=_e(o,r);if(c?.kind==="open"||c?.kind==="void"){const d=c.kind==="void"?null:io(o,c.name,c.to);return d?{name:c.name,open:c,close:d}:{name:c.name,open:c,close:null}}}const i=n[n.length-1];if(!i)return null;const l=io(o,i.name,i.to);return{name:i.name,open:i,close:l}}function we(t){return Ja.includes(t)}function P(){v.html?.focus(),a.lastWin&&(G(a.lastWin),We(a.lastWin))}function pt(t,e,o,n=void 0){const s=[...e].sort((r,i)=>i.from-r.from||i.to-r.to);t.dispatch({changes:s,selection:o,...n?{userEvent:n}:{}})}const Tt="input.toolbar";function Zt(t,e,o){const n=v.html;if(!n||n.state.readOnly)return;const s=n.state.selection.main.head,r=n.state.doc.lineAt(s),i=r.text.slice(0,s-r.from),l=r.text.trim()?it(r.text):ze(n,r)||it(r.text);let c=t,d=0;if(i.trim()!=="")c=`
${l}${t}`,d=1+l.length;else if(!r.text.trim()){c=`${l}${t}`,d=l.length,n.dispatch({changes:{from:r.from,to:r.to,insert:c},selection:Sn(r.from+d+e,o),userEvent:Tt});return}n.dispatch({changes:{from:s,to:n.state.selection.main.to,insert:c},selection:Sn(s+d+e,o),userEvent:Tt})}function Sn(t,e){return e?{anchor:t,head:t+e}:{anchor:t}}function Rs(t){const{from:e}=t.state.selection.main,o=ro(t.state.doc.toString(),e);return o!==e&&t.dispatch({selection:{anchor:o}}),o}function Ns(t,e,o){const n=v.html;!n||n.state.readOnly||(Rs(n),Zt(t,e,o))}const bc=new Set(["section","article","header","footer","main","nav","aside"]);function yc(t){return we(t)||t==="p"||t==="a"}function $n(t){if(t==="a")return'<a href="">';if(t!=="section")return`<${t}>`;const e=a.lastWin?.Statamic?.$config?.get?.("sveSectionTag");return typeof e=="string"&&e.trim()?`<${t} ${e.trim()}>`:`<${t}>`}function qs(){const t=v.html;if(!t||t.state.readOnly)return;const e=t.state.doc.toString(),o=(e.match(/^[ \t]*/)||[""])[0],n=hc(e).split(`
`).map(s=>s&&o+s).join(`
`);n!==e&&(pt(t,[{from:0,to:e.length,insert:n}],{anchor:0}),P())}function Vs(t){const e=v.html;if(!e||e.state.readOnly)return;const o=e.state.selection.main,n=e.state.doc.toString();if(!o.empty&&ro(n,o.from)===o.from&&ro(n,o.to)===o.to){const f=n.slice(o.from,o.to),p=f.match(new RegExp(`^<${t}(\\s[^>]*)?>([\\s\\S]*)</${t}>$`,"i"));if(p){pt(e,[{from:o.from,to:o.to,insert:p[2]}],{anchor:o.from,head:o.from+p[2].length},Tt),P();return}const m=$n(t);let b=`${m}${f}</${t}>`,k=o.from+m.length;t==="ul"&&(b=`<ul>
  <li>${f}</li>
</ul>`,k=o.from+11),pt(e,[{from:o.from,to:o.to,insert:b}],{anchor:k,head:k+f.length},Tt),P();return}const r=o.head,i=gc(n,r);if(i&&i.name===t&&i.open&&i.close){pt(e,[{from:i.close.from,to:i.close.to,insert:""},{from:i.open.from,to:i.open.to,insert:""}],{anchor:i.open.from},Tt),P();return}const l=re();if(l?.open&&l.close&&we(l.name)&&we(t)&&l.name!==t){const f=n.slice(l.open.from,l.open.to).replace(new RegExp(`^<${l.name}`,"i"),`<${t}`);pt(e,[{from:l.close.from,to:l.close.to,insert:`</${t}>`},{from:l.open.from,to:l.open.to,insert:f}],{anchor:l.open.from+t.length+1},Tt),P();return}l?.open&&l.name===t&&yc(t)&&e.dispatch({selection:{anchor:l.close?l.close.to:l.open.to}}),Rs(e);const d=(e.state.doc.lineAt(e.state.selection.main.head).text.match(/^\s*/)||[""])[0];if(t==="ul"){const f=`<ul>
${d}  <li></li>
${d}</ul>`;Zt(f,`<ul>
${d}  <li>`.length)}else{const f=$n(t),p=`${f}</${t}>`,m=t==="a"?f.indexOf('""')+1:bc.has(t)?f.length:p.length;Zt(p,m)}P()}function Us(t,e){let o=null;for(const n of us(t))n.kind==="loop"&&n.loopKind==="collection"&&n.from<=e&&e<n.to&&(o=n);return o}function kc(){const t=v.html;return t?Us(t.state.doc.toString(),t.state.selection.main.head):null}function xc(){const t=v.html;if(!t||t.state.readOnly)return;const e=t.state.doc.toString(),o=Us(e,t.state.selection.main.head);if(!o)return;const n=jr(e,o,!o.paginate);if(n===e)return;if(!fs(e,n)){a.lastWin?.Statamic?.$toast?.error(h(a.lastWin,"html_tree_locked_element"));return}const[s,r,i]=Ho(e,n);pt(t,[{from:s,to:r,insert:i}]),P()}function We(t){try{_c(t)}catch{}}function _c(t){const e=t?.document?.getElementById(u),n=re()?.name||"";if(!e)return;const s=kc();for(const r of vo){const i=e.querySelector(`[data-sve-html-tool="${r.id}"]`);if(!i)continue;const l=r.action==="pagination",c=l?!!s?.paginate:r.id==="heading"?we(n):n===r.tag;l&&i.toggleAttribute("data-in-loop",!!s),c?i.setAttribute("data-active",""):i.removeAttribute("data-active")}}function Cn(t,e,o){const n=t.document,s=re()?.name||"";$(n),e.setAttribute("data-open","");const r=n.createElement("div");r.id=y,n.body.appendChild(r),D(t,e,r),r._sveApp=H(tt,r,{kind:"choices",choices:o.map(i=>({value:i,label:i.toUpperCase(),active:s===i})),onPick:i=>{Vs(i),$(n)}})}function wc(t,e){const o=t.document;$(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=y,o.body.appendChild(n),D(t,e,n);const s=r=>{o.getElementById(y)&&(n._sveApp?.unmount(),n._sveApp=H(tt,n,{kind:"choices",choices:r,onPick:i=>{i&&(Ns(i,i.length),P()),$(o)}}),D(t,e,n))};s([{value:"",label:h(t,"code_dock_loading")}]),t.fetch("/!/sve/components",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(r=>r.ok?r.json():{items:[]}).then(r=>{const i=Array.isArray(r.items)?r.items:[];s(i.length?i.map(l=>({value:l.tag,label:l.name})):[{value:"",label:h(t,"component_none")}])}).catch(()=>s([{value:"",label:h(t,"component_none")}]))}function Tn(t){const e=Gt(t),o=v.html,n=v.css;if(!e||o?.state.readOnly||n?.state.readOnly)return;const s=re();if(s?.open&&o){const r=o.state.doc.sliceString(s.open.from,s.open.to),i=Wr(r,e);i!==r&&o.dispatch({changes:{from:s.open.from,to:s.open.to,insert:i}})}X(),$o(a.cssFull,e)||(a.cssFull=`${String(a.cssFull||"").trimEnd()}${a.cssFull?.trim()?`
`:""}.${e} {
}
`),$t(),De(),It(),a.lastWin&&(G(a.lastWin),We(a.lastWin),E(a.lastWin))}function Sc(t,e){const o=t.document;if(e.hasAttribute("data-open")){$(o);return}$(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=y,o.body.appendChild(n),D(t,e,n);const s=l=>{const c=Gt(l);if(!c)return"";if($o(a.cssFull,c))return h(t,"class_exists_here");const d=[...new Set(Bo(t,c).map(f=>String(f.file).replace(/^.*\//,"")))];return d.length?h(t,"class_exists_pick",{file:d.join(", ")}):""},r=l=>{Tn(l),Po(t,Gt(l)),$(o)},i=()=>{if(!o.getElementById(y))return;const l=n.querySelector("[data-sve-css-add-input]")?.value||"";n._sveApp?.unmount(),n._sveApp=H(Io,n,{label:h(t,"code_dock_css_class_name"),placeholder:h(t,"code_dock_css_class_placeholder"),initial:l,options:Ll(t,h(t,"class_this_file")),existingLabel:h(t,"code_dock_css_class_existing"),createLabel:h(t,"code_dock_css_class_create"),takenText:s,onPick:r,onClose:()=>$(o),onAdd:c=>{Tn(c),$(o)}}),D(t,e,n)};i(),Fo(t).then(i)}function $c(t,e){const o=e.querySelector("[data-sve-css-add-class]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=mf,o.title=h(t,"code_dock_css_add_class"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),a.styleMode==="tw"){$(t.document),zr(t,o);return}Sc(t,o)}))}function Ro(){const t={html:"",css:"",js:""};ne(),X();for(const e of st)e==="html"?t.html=a.htmlScopeActive?a.htmlFull:v.html?.state.doc.toString()??"":e==="css"?(t.css=a.lastWin?fl(a.cssFull,gt(a.lastWin)):a.cssFull,t.css=Hl(t.css,t.html,sf)):t[e]=v[e]?.state.doc.toString()??"";return t}function Ks(){if(a.cssValues||a.cssAll||!a.htmlScopePref)return a.cssPane="full",a.cssScopeSnapshot=a.cssFull,a.cssFull;const t=Oe(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length),e=So(t?a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to):a.htmlFull);if(!e.length)return a.cssPane="empty",a.cssScopeSnapshot="","";a.cssPane="tree";const o=is(a.cssFull,e);return a.cssScopeSnapshot=o,o}function Ot(t,e){a.applying=!0;try{a.lastWin&&(a.htmlScopePref=oe(a.lastWin)),a.htmlFull=t.html??"",a.cssFull=t.css??"",a.cssAll=!1;for(const o of st){const n=v[o];let s=t[o]??"";try{s=o==="html"?Ws():o==="css"?Ks():s}catch{s=o==="html"?a.htmlFull||t.html||"":o==="css"?a.cssFull||t.css||"":s}if(!n)continue;const r=n.state.doc.toString(),i=[Vt[o].reconfigure(te.readOnly.of(!!e)),Ut[o].reconfigure(F.editable.of(!e))];r!==s?n.dispatch({changes:{from:0,to:r.length,insert:s},effects:i}):n.dispatch({effects:i})}}finally{a.applying=!1}De(),It(),ko("dock:html-changed"),a.lastWin&&(E(a.lastWin),We(a.lastWin),q(a.lastWin),le(a.lastWin))}function No(t,e){return t.html===e.html&&t.css===e.css&&t.js===e.js}function Gs(t){return String(t||"").replace(/\/\*[\s\S]*?\*\//g,"").trim().replace(/\s*:\s*/g,": ").replace(/\s*;\s*/g,";").replace(/\s+/g," ").replace(/;+$/,";")}function Xs(t){const e=Gs(t).match(/^([a-z-]+)\s*:/i);return e?e[1].toLowerCase():""}function Ys(t){const e=Gs(t),o=e.indexOf(":");return o===-1?"":e.slice(o+1).replace(/;$/,"").trim().toLowerCase()}function B(t){const e=String(t||"").trim().toLowerCase();return e==="start"||e==="flex-start"||e==="left"||e==="top"?"flex-start":e==="end"||e==="flex-end"||e==="right"||e==="bottom"?"flex-end":e==="row-reverse"?"row-reverse":e==="column-reverse"?"column-reverse":e}function Jt(t){const e=B(t);return e==="flex"||e==="inline-flex"}function je(){const t=v.css;if(!t)return null;const e=t.state.selection.main.head,o=t.state.doc.toString(),n=[],s=[];for(let i=0;i<o.length;i+=1){if(o[i]==="{"&&o[i+1]==="{"){const l=o.indexOf("}}",i+2);if(l===-1)break;i=l+1;continue}if(o[i]==="{")n.push(i);else if(o[i]==="}"){const l=n.pop();l!=null&&s.push({from:l+1,to:i,text:o.slice(l+1,i),open:l})}}let r=null;for(const i of s)e<i.open||e>i.to||(!r||i.to-i.open<r.to-r.open)&&(r=i);return r}function Cc(t){const e=String(t||"");let o="",n=0;for(let s=0;s<e.length;s+=1){if(e[s]==="{"&&e[s+1]==="{"){const r=e.indexOf("}}",s+2);if(r===-1)break;n===0&&(o+=e.slice(s,r+2)),s=r+1;continue}if(e[s]==="{"){n+=1;continue}if(e[s]==="}"){n=Math.max(0,n-1);continue}n===0&&(o+=e[s])}return o}function An(t){const e={};for(const o of Cc(t).split(";")){const n=Xs(o);n&&(e[n]=Ys(`${o};`))}return e}function Tc(t,e,o){if(!e||e.from>=e.to)return null;let n=t.state.doc.lineAt(e.from),s=0;for(;n.from<=e.to;){const r=Math.max(n.from,e.from),i=Math.min(n.to,e.to),l=t.state.doc.sliceString(r,i);if(s===0&&Xs(l)===o)return{from:r,to:i,text:l};if(s+=Ac(l),n.to>=t.state.doc.length||n.to>=e.to)break;n=t.state.doc.lineAt(n.to+1)}return null}function Ac(t){let e=0;const o=String(t);for(let n=0;n<o.length;n+=1){if(o[n]==="{"&&o[n+1]==="{"){const s=o.indexOf("}}",n+2);n=s===-1?o.length:s+1;continue}o[n]==="{"?e+=1:o[n]==="}"&&(e-=1)}return e}function it(t){return(String(t).match(/^\s*/)||[""])[0]}function ze(t,e,o){for(let n=e.number-1;n>=1;n-=1){const s=t.state.doc.line(n),r=s.text.trim();if(!r)continue;const i=it(s.text);if(o&&(r==="{"||r.endsWith("{")))return`${i}  `;if(!(r==="}"||r.startsWith("}")))return i}return""}function Mc(t,e){const o=t.state.doc.lineAt(e);if(o.text.trim())return it(o.text);const n=ze(t,o,!0);if(n)return n;const s=je();return s?Zs(t,s):"  "}function Zs(t,e){const o=t.state.doc.lineAt(e.from),n=t.state.doc.lineAt(Math.max(e.from,e.to));for(let r=n.number;r>=o.number;r-=1){const i=t.state.doc.line(r),l=Math.max(i.from,e.from),c=Math.min(i.to,e.to),d=t.state.doc.sliceString(l,c);if(d.trim())return(d.match(/^\s*/)||[""])[0]||"  "}return`${(t.state.doc.lineAt(Math.max(0,e.from-1)).text.match(/^\s*/)||[""])[0]}  `}function Mn(){v.css?.focus(),a.lastWin&&(G(a.lastWin),E(a.lastWin))}function Js(t,e){if(!e)return"";const o=t.state.doc.toString();let n=0;for(let s=e.open-1;s>=0;s-=1)if(o[s]==="}"||o[s]==="{"||o[s]===";"){n=s+1;break}return o.slice(n,e.open).replace(/\/\*[\s\S]*?\*\//g,"").trim()}function Ec(t,e){if(!a.cssState||!e)return e;const o=Qs(t,e);if(o)return o;const n=Js(t,e);if(!n||n.startsWith("@"))return e;const s=t.state.doc.toString(),r=xt(s,e.open),i=xt(s,e.to)||`${r}    `,l=(t.state.doc.sliceString(e.from,e.to).match(/\n([^\S\n]*)$/)||[null,null])[1],c=l===null?e.to:e.to-l.length,d=`
${i}&${Ne()} {
${i}}
${l??r}`;t.dispatch({changes:{from:c,to:e.to,insert:d}});const f=t.state.doc.toString(),p=f.indexOf("{",c+d.indexOf("&")),m=p===-1?-1:Co(f,p);return m===-1?e:{from:p+1,to:m,text:f.slice(p+1,m),open:p}}function xt(t,e){const o=t.lastIndexOf(`
`,e-1)+1;return(t.slice(o,e).match(/^\s*/)||[""])[0]}function K(t){const e=v.css;if(!e||e.state.readOnly||!t.length)return;const o=je(),n=t.some(l=>l.value!=null)?Ec(e,o):o;if(!n){const l=t.filter(c=>c.value!=null).map(c=>`${c.property}: ${c.value};`).join(`
`);l&&Bc(l),Mn();return}const s=[],r=[],i=Zs(e,n);for(const l of t){const c=Tc(e,n,l.property);if(l.value==null){if(!c)continue;let d=c.from,f=c.to;e.state.doc.sliceString(f,f+1)===`
`&&(f+=1),d=Math.max(d,n.from),f=Math.min(f,n.to),s.push({from:d,to:f});continue}if(!(c&&B(Ys(c.text))===B(l.value)))if(c){const d=(c.text.match(/^\s*/)||[""])[0];s.push({from:c.from,to:c.to,insert:`${d}${l.property}: ${l.value};`})}else r.push(`${i}${l.property}: ${l.value};`)}if(r.length){const l=!n.text.includes(`
`)||!/\n\s*$/.test(n.text)?`
`:"",c=(n.text.match(/\n([^\S\n]*)$/)||[null,null])[1],d=c===null?n.to:n.to-c.length,f=c===null?"":c;s.push({from:d,to:n.to,insert:`${l}${r.join(`
`)}
${f}`})}s.length&&(s.sort((l,c)=>c.from-l.from||c.to-l.to),e.dispatch({changes:s})),Mn()}function Z(){const t=v.css,e=je();if(!e)return{};if(a.cssState&&t){const o=Qs(t,e);return o?An(o.text):{}}return An(e.text)}function Qs(t,e){const o=Js(t,e),n=Ne();if(!o||o.startsWith("@"))return null;if(o.endsWith(n))return e;const s=t.state.doc.toString(),r=i=>{const l=Co(s,i);return l===-1?null:{from:i+1,to:l,text:s.slice(i+1,l),open:i}};for(const i of[`&${n}`,`${o}${n}`]){const l=new RegExp(`(^|[^\\w-])${i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\s*\\{`,"g");let c;for(;c=l.exec(s);){const d=s.indexOf("{",c.index);if(i.startsWith("&")&&(d<e.from||d>e.to))continue;const f=r(d);if(f)return f}}return null}function Lc(t){const e=Z(),o=Jt(e.display),n=B(e["flex-direction"])||(o?"row":"");if(o&&n===t){const s=[];e["flex-direction"]&&s.push({property:"flex-direction",value:null}),Jt(e.display)&&s.push({property:"display",value:null}),K(s);return}K([{property:"display",value:"flex"},{property:"flex-direction",value:t}])}function Fc(t){const e=Z();if(t==="flex"&&Jt(e.display)){K([{property:"justify-content",value:null},{property:"align-items",value:null},{property:"flex-direction",value:null},{property:"display",value:null}]);return}K([{property:"display",value:t}])}function Bc(t){const e=v.css;if(!e||e.state.readOnly)return;const o=e.state.selection.main.head,n=e.state.doc.lineAt(o),s=n.text.slice(0,o-n.from),r=n.text.slice(o-n.from),i=Mc(e,o),l=t.replace(/;?$/,";");if(s.trim()===""&&r.trim()===""){const d=`${i}${l}
${i}`;e.dispatch({changes:{from:n.from,to:n.to,insert:d},selection:{anchor:n.from+d.length}});return}const c=`
${i}${l}
${i}`;e.dispatch({changes:{from:o,to:e.state.selection.main.to,insert:c},selection:{anchor:o+c.length}})}function E(t){try{Pc(t),lt(t)}catch{}}function Pc(t){const e=a.styleMode==="tw",o=e?{}:Z(),n=Jt(e?pn("display"):o.display),s=B(o["flex-direction"])||(n?"row":""),r=i=>e?qr()?i.twGroup?!!Vr(i.twGroup):!!i.tw&&!!pn(i.tw):!1:!!i.css&&i.css in o;ft.tools=tr.map(i=>{const l=(i.kids||[]).filter(c=>c.when!=="flex"||n).map(c=>({id:c.id,title:c.title,icon:Kn[c.icon]||"",sep:!!c.sep,open:a.cssOpenMenu===c.id,active:e?r(c):c.kind==="display"?n:c.kind==="flexDir"?n&&s===c.value:c.value?B(o[c.css])===B(c.value):r(c)}));return{id:i.id,title:i.title,icon:Kn[i.id]||gf[i.id]||"",open:a.cssOpenTool===i.id||a.cssOpenMenu===i.id,kids:l,active:i.value?!e&&B(o[i.css])===B(i.value):r(i)||l.some(c=>c.active)}})}function Qt(t){$(t),a.cssOpenTool="",a.lastWin&&E(a.lastWin)}function $(t){const e=t?.getElementById(y);a.cssOpenMenu="",e?._sveApp?.unmount(),e?.remove(),t?.querySelectorAll("[data-sve-css-tool][data-open], [data-sve-html-tool][data-open], [data-sve-css-add-class][data-open], [data-sve-code-history][data-open]").forEach(o=>o.removeAttribute("data-open"))}function Zf(t){$(t),R(t),ot(t);for(const e of st)v[e]&&Da?.(v[e])}function ta(t){if(a.cssColorsPromise)return a.cssColorsPromise;const e=t.Statamic?.$config?.get?.("cpUrl")||`/${t.Statamic?.$config?.get?.("cpRoute")||"cp"}`;return a.cssColorsPromise=t.fetch(`${e}/color-scheme/swatches`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async o=>{if(!o.ok)return[];const n=await o.json().catch(()=>[]);return Array.isArray(n)?n:[]}).catch(()=>[]).then(o=>{const n=new Set,s=[];for(const r of o){const i=r.var||r.value||r.handle,l=String(i||"").trim().replace(/^var\((.+)\)$/,"$1");!l||n.has(l)||(n.add(l),s.push({name:l,hex:r.hex||r.color||""}))}for(const[r,i]of Qa)n.has(r)||(n.add(r),s.push({name:r,hex:i}));return s}),a.cssColorsPromise}function ea(t,e){const o=Z()[e]||"",n=String(o).match(/^var\(\s*([^)]+?)\s*\)$/i),s=n?n[1].trim():"";for(const r of t.querySelectorAll("[data-sve-css-token]"))s&&r.getAttribute("data-sve-css-token")===s?r.setAttribute("data-active",""):r.removeAttribute("data-active")}function D(t,e,o){const n=e.getBoundingClientRect(),s=8,r=t.innerHeight-(n.bottom+4)-s,i=n.top-4-s;o.style.maxHeight="";const l=o.offsetHeight||0,c=l>r&&i>r;o.style.left=`${Math.max(s,Math.min(n.left,t.innerWidth-220))}px`,o.style.maxHeight=`${Math.max(120,c?i:r)}px`,o.style.top=c?`${Math.max(s,n.top-4-Math.min(l,i))}px`:`${Math.max(s,n.bottom+4)}px`}function Ic(t,e,o){const n=t.document;$(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=y,n.body.appendChild(s),D(t,e,s);const r=i=>{s._sveApp?.unmount(),s._sveApp=H(tt,s,{kind:"colors",swatches:i,onClear:()=>{K([{property:o,value:null}]),Qt(n)},onPick:l=>{K([{property:o,value:`var(${l})`}]),Qt(n)}}),ea(s,o)};r(Qa.map(([i,l])=>({name:i,hex:l}))),ta(t).then(i=>{n.getElementById(y)&&r(i.map(l=>({name:l.name,hex:l.hex})))})}function Oc(t,e,o,n){const s=t.document;$(s),e.setAttribute("data-open","");const r=s.createElement("div"),i=Z()[o]||"";r.id=y,s.body.appendChild(r),D(t,e,r),r._sveApp=H(tt,r,{kind:"choices",choices:(n||[]).map(l=>({value:l,label:l,active:B(l)===B(i)})),onPick:l=>{const c=B(l)===B(Z()[o]||"");K([{property:o,value:c?null:l}]),Qt(s)}})}function En(t,e,o,n=[]){const s=t.document;$(s),e.setAttribute("data-open",""),Rr(t);const r=s.createElement("div");r.id=y,s.body.appendChild(r),D(t,e,r);const i=()=>{const l=[...n.map(d=>({value:d,label:d})),...Nr(t,o).map(d=>({value:d.value,label:d.value}))],c=Z()[o]||"";r._sveApp?.unmount(),r._sveApp=H(tt,r,{kind:"choices",choices:l.map(d=>({...d,active:B(d.value)===B(c)})),onPick:d=>{K([{property:o,value:d||null}]),Qt(s)}})};i(),ta(t).then(()=>{s.getElementById(y)===r&&i()})}function Dc(t,e,o){const n=t.document;$(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=y,n.body.appendChild(s),D(t,e,s),s._sveApp=H(tt,s,{kind:"choices",choices:vf.map(r=>({value:r,token:r,label:r})),onPick:r=>{K([{property:o,value:`var(${r})`}]),Qt(n)}}),ea(s,o)}const Ln=/\{\{#[\s\S]*?#\}\}|\{\{[\s\S]*?\}\}/g,Fn=/<!--[\s\S]*?-->/g,Bn=/<(\/?)([A-Za-z][A-Za-z0-9-]*)/g,oa=/^\{\{\s*(?:\/|endif\b|endunless\b)/,Hc=/^\{\{\s*(?:\/\s*(?:if|unless)\b|endif\b|endunless\b)/,Wc=/^\{\{\s*\/\s*partial\b/;function Qe(t,e,o){return t.some(n=>e<n.to&&o>n.from)}function jc(t){const e=new Map;for(const o of us(t)){const n=o.kind==="loop"?"loop":"if";e.set(o.from,n);const s=t.lastIndexOf("{{",o.to-2);s>=o.openTo&&oa.test(t.slice(s,o.to))&&e.set(s,n)}for(const o of as(t))e.set(o.from,"component");return e}function zc(t){const e=String(t||""),o=[],n=[];Fn.lastIndex=0;let s;for(;s=Fn.exec(e);)o.push({from:s.index,to:s.index+s[0].length});const r=jc(e),i=[];for(Ln.lastIndex=0;s=Ln.exec(e);){const l=s.index,c=l+s[0].length,d=s[0];if(Qe(o,l,c))continue;if(i.push({from:l,to:c}),d.startsWith("{{#")){n.push({from:l,to:c,cls:"comment"});continue}const f=oa.test(d),p=r.get(l)||(f&&Hc.test(d)?"if":"")||(f&&Wc.test(d)?"component":"");n.push({from:l,to:c,cls:(p?`fam-${p}`:"antlers")+(f?"-close":"")})}for(Bn.lastIndex=0;s=Bn.exec(e);){const l=s.index+1+s[1].length,c=l+s[2].length;Qe(o,l,c)||Qe(i,l,c)||n.push({from:l,to:c,cls:`fam-${yr(s[2])}`})}return n.sort((l,c)=>l.from-c.from),n}function Pn(t,e,o){const n=new e.RangeSetBuilder;let s=0;for(const r of zc(t.doc.toString()))r.from<s||(n.add(r.from,r.to,o(r.cls)),s=r.to);return n.finish()}function Rc(t){const e=new Map,o=r=>r==="comment"?"sve-cm-antlers-comment":r==="antlers"?"sve-cm-antlers":r==="antlers-close"?"sve-cm-antlers sve-cm-antlers-close":r.endsWith("-close")?`sve-cm-${r.slice(0,-6)} sve-cm-antlers-close`:`sve-cm-${r}`,n=r=>(e.has(r)||e.set(r,t.Decoration.mark({class:o(r)})),e.get(r));return{extensions:[t.StateField.define({create(r){return Pn(r,t,n)},update(r,i){return i.docChanged?Pn(i.state,t,n):r},provide:r=>t.EditorView.decorations.from(r)})]}}const M=go({tag:"",emptyText:"",addLabel:"",dropTitle:"",chips:[],states:[],canEdit:!1,onAdd:null,onChip:null,onDrop:null}),Nc={class:"sve-al"},qc={class:"sve-al-head"},Vc={key:0,class:"sve-al-tag"},Uc=["title","disabled"],Kc={key:0,class:"sve-al-empty"},Gc={class:"sve-al-chips"},Xc=["data-sve-al-chip","title","disabled","onClick"],Yc={class:"sve-al-name"},Zc={key:0,class:"sve-al-value"},Jc=["title","onClick"],Qc={__name:"AlpinePanel",setup(t){return(e,o)=>(x(),_("div",Nc,[g("div",qc,[w(M).tag?(x(),_("span",Vc,"<"+A(w(M).tag)+">",1)):W("",!0),(x(!0),_(j,null,at(w(M).states,n=>(x(),_("span",{key:n,class:"sve-al-state"},A(n),1))),128)),o[1]||(o[1]=g("span",{class:"sve-al-gap"},null,-1)),g("button",{type:"button","data-sve-al-add":"",title:w(M).addLabel,disabled:!w(M).canEdit,onClick:o[0]||(o[0]=L(n=>w(M).onAdd?.(n),["prevent","stop"]))},"+",8,Uc)]),w(M).chips.length?W("",!0):(x(),_("div",Kc,A(w(M).emptyText),1)),g("div",Gc,[(x(!0),_(j,null,at(w(M).chips,n=>(x(),_("span",{key:n.id,class:"sve-al-chip-wrap"},[g("button",{type:"button","data-sve-al-chip":n.id,title:n.title,disabled:!w(M).canEdit,onClick:L(s=>w(M).onChip?.(s,n.id),["prevent","stop"])},[g("span",Yc,A(n.name),1),n.value?(x(),_("span",Zc,A(n.value),1)):W("",!0)],8,Xc),w(M).canEdit?(x(),_("button",{key:0,type:"button",class:"sve-al-drop",title:w(M).dropTitle,onClick:L(s=>w(M).onDrop?.(n.id),["prevent","stop"])},"−",8,Jc)):W("",!0)]))),128))])]))}},td=vs(Qc,[["__scopeId","data-v-15add965"]]),ed=[{id:"state",lang:"alpine_group_state"},{id:"act",lang:"alpine_group_act"},{id:"react",lang:"alpine_group_react"}],In=[{id:"state",group:"state",label:"alpine_state",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: false }"}]},{id:"state_text",group:"state",label:"alpine_state_text",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: '|' }"}]},{id:"toggle",group:"act",label:"alpine_toggle",icon:"toggle",needsName:!0,attrs:[{name:"@click",value:":name = !:name"}]},{id:"open",group:"act",label:"alpine_open",icon:"open",needsName:!0,attrs:[{name:"@click",value:":name = true"}]},{id:"close",group:"act",label:"alpine_close",icon:"close",needsName:!0,attrs:[{name:"@click",value:":name = false"}]},{id:"open_hover",group:"act",label:"alpine_open_hover",icon:"open",needsName:!0,attrs:[{name:"@mouseenter",value:":name = true"}]},{id:"close_leave",group:"act",label:"alpine_close_leave",icon:"close",needsName:!0,attrs:[{name:"@mouseleave",value:":name = false"}]},{id:"open_focus",group:"act",label:"alpine_open_focus",icon:"open",needsName:!0,attrs:[{name:"@focusin",value:":name = true"}]},{id:"close_blur",group:"act",label:"alpine_close_blur",icon:"close",needsName:!0,attrs:[{name:"@focusout",value:":name = false"}]},{id:"close_outside",group:"act",label:"alpine_close_outside",icon:"outside",needsName:!0,attrs:[{name:"@click.outside",value:":name = false"}]},{id:"close_escape",group:"act",label:"alpine_close_escape",icon:"escape",needsName:!0,attrs:[{name:"@keydown.escape.window",value:":name = false"}]},{id:"show",group:"react",label:"alpine_show",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"}]},{id:"show_smooth",group:"react",label:"alpine_show_smooth",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"},{name:"x-transition",value:""}]},{id:"hide_until_ready",group:"react",label:"alpine_hide_until_ready",icon:"cloak",attrs:[{name:"x-cloak",value:""}]},{id:"class_when",group:"react",label:"alpine_class_when",icon:"klass",needsName:!0,attrs:[{name:":class",value:":name ? '|' : ''"}]},{id:"text",group:"react",label:"alpine_text",icon:"text",needsName:!0,attrs:[{name:"x-text",value:":name"}]}];function od(t){return(t?.attrs||[]).map(e=>e.name).join(" ")}const nd=/^(x-[\w:.-]+|@[\w:.-]+|:[\w-]+)$/;function sd(t){return nd.test(String(t||""))}function ie(t){const e=String(t||""),o=[],n=/([@:a-zA-Z_][\w:.@-]*)(\s*=\s*(["'])([\s\S]*?)\3)?/g;let s,r=!0;for(;s=n.exec(e);){if(r){r=!1;continue}s[0].trim()&&o.push({name:s[1],value:s[4]??"",from:s.index,to:s.index+s[0].length,alpine:sd(s[1])})}return o}function na(t){const e=String(t||"").trim().replace(/^\{|\}$/g,""),o=[],n=/(^|,)\s*([a-zA-Z_$][\w$]*)\s*:/g;let s;for(;s=n.exec(e);)o.push(s[2]);return o}function ad(t,e){return t.map(o=>({name:o.name,value:String(o.value).replaceAll(":name:",`${e}:`).replaceAll(":name",e)}))}function qo(t,e,o){const n=v.html,s=Ct();if(!n||n.state.readOnly||!s)return;const r=a.htmlScopeActive&&!!a.htmlFocus,i=r?a.htmlFocus.from:0,c=(r?a.htmlFull:n.state.doc.toString()).slice(s.from,s.openTo),d=o===""?e:`${e}="${o}"`,f=ie(c).find(m=>m.name===e);let p;if(f)p=c.slice(0,f.from)+d+c.slice(f.to);else{const m=c.search(/\s|\/?>$/);p=m===-1?c:`${c.slice(0,m)} ${d}${c.slice(m)}`}p!==c&&(pt(n,[{from:s.from-i,to:s.openTo-i,insert:p}],null),Re(t))}function rd(t,e){const o=v.html,n=Ct();if(!o||o.state.readOnly||!n)return;const s=a.htmlScopeActive&&!!a.htmlFocus,r=s?a.htmlFocus.from:0,l=(s?a.htmlFull:o.state.doc.toString()).slice(n.from,n.openTo),c=ie(l).find(p=>p.name===e);if(!c)return;let d=c.from;for(;d>0&&/\s/.test(l[d-1]);)d-=1;const f=l.slice(0,d)+l.slice(c.to);pt(o,[{from:n.from-r,to:n.openTo-r,insert:f}],null),Re(t)}function lo(t){const e=v.html;if(!e)return[];const n=a.htmlScopeActive&&!!a.htmlFocus?a.htmlFull:e.state.doc.toString(),s=Ct(),r=[],i=Me(Ee(n),new Set);for(const l of i){if(!s||l.from>s.from||l.to<s.to)continue;const c=ie(n.slice(l.from,l.openTo)).find(d=>d.name==="x-data");c&&r.push(...na(c.value))}return[...new Set(r)]}function id(t){const e=v.html,o=Ct();if(!e||!o)return[];const s=a.htmlScopeActive&&!!a.htmlFocus?a.htmlFull:e.state.doc.toString(),r=ie(s.slice(o.from,o.openTo)).find(i=>i.name==="x-data");return r?na(r.value):[]}function ld(t,e){const o=t.document;$(o),e.setAttribute("data-open","");const n=lo(),s=o.createElement("div");s.id=y,o.body.appendChild(s),D(t,e,s);const r=!n.length,i=!r&&!id().length,c=ed.filter(d=>d.id==="state"?!i:!r).flatMap(d=>{const f=In.filter(p=>p.group===d.id);return f.length?[{value:`\0${d.id}`,label:h(t,r&&d.id==="state"?"alpine_group_state_first":d.lang),heading:!0},...f.map(p=>({value:p.id,label:h(t,p.label),hint:od(p)}))]:[]});r&&c.push({value:"\0note",label:h(t,"alpine_needs_state"),note:!0}),s._sveApp=H(tt,s,{kind:"choices",choices:c,onPick:d=>{const f=In.find(p=>p.id===d);if($(o),!!f){if(!f.needsName){for(const p of f.attrs)qo(t,p.name,p.value);return}cd(t,e,f,n)}}})}function cd(t,e,o,n){const s=t.document,r=l=>{const c=String(l||"").trim().replace(/[^\w$]/g,"");if($(s),!!c)for(const d of ad(o.attrs,c))qo(t,d.name,d.value.replace("|",""))};if(!n.length){co(t,e,r);return}const i=s.createElement("div");i.id=y,s.body.appendChild(i),D(t,e,i),i._sveApp=H(tt,i,{kind:"choices",choices:[{value:"\0head",label:h(t,"alpine_name"),heading:!0},...n.map(l=>({value:l,label:l})),{value:"\0new",label:h(t,"alpine_new_name")}],onPick:l=>{if(l==="\0new"){co(t,e,r);return}r(l)}})}function co(t,e,o){const n=t.document;$(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=y,n.body.appendChild(s),D(t,e,s),s._sveApp=H(Io,s,{label:h(t,"alpine_name"),placeholder:h(t,"alpine_name_placeholder"),onAdd:r=>o(r)})}function Re(t){const o=t?.document.getElementById(u)?.querySelector("[data-sve-alpine-host]");if(!o)return;const n=Ct(),s=v.html,r=a.htmlScopeActive&&!!a.htmlFocus,i=s?r?a.htmlFull:s.state.doc.toString():"",l=n?ie(i.slice(n.from,n.openTo)):[];M.tag=n?.tag||"",M.canEdit=!a.lastLocked&&!!n,M.emptyText=h(t,n?lo().length?"alpine_none_ready":"alpine_none":"alpine_pick"),M.addLabel=h(t,"alpine_add"),M.dropTitle=h(t,"alpine_remove"),M.states=lo(),M.chips=l.filter(c=>c.alpine).map(c=>({id:c.name,name:c.name,value:c.value,title:c.value?`${c.name}="${c.value}"`:c.name})),M.onAdd=c=>ld(t,c.currentTarget),M.onDrop=c=>rd(t,c),M.onChip=(c,d)=>{M.chips.find(p=>p.id===d)&&co(t,c.currentTarget,p=>qo(t,d,p))},o._sveMounted||(o._sveMounted=!0,ee(o,td))}const dd=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]),ud=new Set(["html","head","body"]),On=new Set(["if","unless","style_push","script_push","sve_defaults","once","noparse","foreach","forelse","loop","cache","nocache","scope","collection","nav","structure","taxonomy","users","search:results","form:create","form:errors"]),fd=new Set(["collection:count"]);function Dn(t){return fd.has(t)?!1:On.has(t)||On.has(t.split(":")[0])}const pd=new Set(["CloseTag","MismatchedCloseTag","IncompleteCloseTag"]),hd=/^\s*(\/?)\s*([A-Za-z_][A-Za-z0-9_.:-]*)([\s\S]*)$/,md=/^\{\{\s*\/?\s*([A-Za-z_][A-Za-z0-9_.:-]*)/,vd=3e5;function gd(t){const e=String(t||""),o=[],n=[];let s=0;for(;s<e.length;){const r=e.indexOf("{{",s);if(r===-1)break;if(e.startsWith("{{#",r)){const d=e.indexOf("#}}",r+3);if(d===-1){n.push(r);break}o.push({from:r,to:d+3,comment:!0,body:""}),s=d+3;continue}let i=0,l=r,c=-1;for(;l<e.length;){if(e.startsWith("{{",l)){i+=1,l+=2;continue}if(e.startsWith("}}",l)){if(i-=1,l+=2,i===0){c=l;break}continue}l+=1}if(c===-1){n.push(r),s=r+2;continue}o.push({from:r,to:c,comment:!1,body:e.slice(r+2,c-2)}),s=c}return{tags:o,unclosed:n}}function bd(t,e){let o=t;for(const n of e)o=o.slice(0,n.from)+" ".repeat(n.to-n.from)+o.slice(n.to);return o}function yd(t,e){return t===e||t.startsWith(`${e}:`)}function fe(t,e){return(t.slice(e,e+80).match(/^<\/?([A-Za-z][A-Za-z0-9:-]*)/)?.[1]||"").toLowerCase()}function kd(t,e,o,n,s){const r=c=>s.has(c.name)&&!/\||\?\?/.test(c.rest);for(const c of o){const d=t.slice(c,c+80).match(md)?.[1]||"…";n.push({from:c,to:c+2,key:"code_dock_problem_antlers_unclosed",args:{name:d}})}const i=[],l=[];for(const c of e){if(c.comment)continue;const d=c.body.match(hd);if(!d)continue;const f=!!d[1],p=d[2].toLowerCase(),m=d[3];if(!f&&(p==="elseif"||p==="else")){let b=-1;for(let k=i.length-1;k>=0;k-=1)if(i[k].name==="if"||i[k].name==="unless"){b=k;break}if(b===-1){n.push({from:c.from,to:c.to,key:"code_dock_problem_branch_stray",args:{name:p}});continue}l.push({from:i[b].to,to:c.from}),i[b]={...i[b],to:c.to},i.length=b+1;continue}if(f||p==="endif"||p==="endunless"){const b=p==="endif"?"if":p==="endunless"?"unless":p;let k=-1;for(let O=i.length-1;O>=0;O-=1)if(yd(i[O].name,b)){k=O;break}if(k===-1){n.push({from:c.from,to:c.to,key:"code_dock_problem_pair_stray",args:{name:b}});continue}for(const O of i.slice(k+1))Dn(O.name)&&n.push({from:O.from,to:O.to,key:"code_dock_problem_pair_unclosed",args:{name:O.name}});(b==="if"||b==="unless")&&l.push({from:i[k].to,to:c.from}),i.length=k;continue}m.trim().startsWith("=")||i.push({name:p,rest:m,from:c.from,to:c.to})}for(const c of i)Dn(c.name)?n.push({from:c.from,to:c.to,key:"code_dock_problem_pair_unclosed",args:{name:c.name}}):r(c)&&n.push({from:c.from,to:c.to,key:"code_dock_problem_list_unclosed",args:{name:c.name}});return l}function xd(t,e,o,n){const s=e.parse(t),r=new Set,i=[];s.iterate({enter(l){if(l.name==="MismatchedCloseTag"){i.push({from:l.from,to:l.to,key:"code_dock_problem_tag_stray",args:{tag:fe(t,l.from)}});return}if(l.name==="IncompleteCloseTag"){i.push({from:l.from,to:l.to,key:"code_dock_problem_tag_unfinished",args:{tag:fe(t,l.from)}});return}if(l.type.isError){const p=l.node.parent;p&&(p.name==="OpenTag"||p.name==="CloseTag")&&(r.add(p.from),i.push({from:p.from,to:Math.max(p.from+1,l.from),key:"code_dock_problem_tag_unfinished",args:{tag:fe(t,p.from)}}));return}if(l.name!=="Element")return;let c=null,d=!1;for(let p=l.node.firstChild;p;p=p.nextSibling)p.name==="OpenTag"&&(c=p),pd.has(p.name)&&(d=!0);if(!c||d)return;const f=fe(t,c.from);!f||dd.has(f)||ud.has(f)||o.some(p=>c.from>=p.from&&c.from<p.to&&l.to>p.to)||i.push({from:c.from,to:c.to,key:"code_dock_problem_tag_unclosed",args:{tag:f}})}});for(const l of i)l.key==="code_dock_problem_tag_unclosed"&&r.has(l.from)||l.args.tag&&n.push(l)}function _d(t,e,o={}){const n=String(t||"");if(!n.trim()||n.length>vd)return[];const s=[];try{const{tags:i,unclosed:l}=gd(n),c=kd(n,i,l,s,new Set(o.lists||[]));e&&xd(bd(n,i),e,c,s)}catch{return[]}const r=new Set;return s.sort((i,l)=>i.from-l.from||i.to-l.to).filter(i=>{const l=`${i.from}:${i.key}`;return r.has(l)?!1:(r.add(l),!0)})}function wd(t,e,o=()=>({})){const n=t.Decoration.mark({class:"sve-cm-problem"}),s=t.StateEffect.define(),r=l=>{const c=_d(l.doc.toString(),e,o()),d=new t.RangeSetBuilder;let f=0;for(const p of c)p.from<f||p.to<=p.from||(d.add(p.from,p.to,n),f=p.to);return{problems:c,decorations:d.finish()}},i=t.StateField.define({create(l){return r(l)},update(l,c){return c.docChanged||c.effects.some(d=>d.is(s))?r(c.state):l},provide:l=>t.EditorView.decorations.from(l,c=>c.decorations)});return{field:i,relint:s,extensions:[i]}}const Sd=new Set(["replicator","grid","list","array","table"]);let ge=new Set,to=null;function sa(t){return t.document.getElementById(u)?.querySelector("[data-sve-html-problems]")||null}function $d(t,e,o){const n=sa(t);if(!n)return;const s=e.state.doc,r=o.map(c=>({from:c.from,line:s.lineAt(Math.min(c.from,s.length)).number,text:h(t,c.key,c.args)})),i=r.map(c=>`${c.line}:${c.text}`).join(`
`);if(n.dataset.sveSignature===i||(n.dataset.sveSignature=i,n.hidden=r.length===0,n.replaceChildren(),!r.length))return;const l=t.document.createElement("span");l.setAttribute("data-sve-problems-title",""),l.textContent=h(t,"code_dock_problems_title"),n.appendChild(l);for(const c of r){const d=t.document.createElement("button"),f=t.document.createElement("b");d.type="button",d.dataset.sveProblemAt=String(c.from),f.textContent=h(t,"code_dock_problem_line",{line:c.line}),d.append(f,t.document.createTextNode(` ${c.text}`)),n.appendChild(d)}}function Cd(t){const e=sa(t);!e||e._sveBound||(e._sveBound=!0,e.addEventListener("mousedown",o=>o.preventDefault()),e.addEventListener("click",o=>{const n=o.target.closest("[data-sve-problem-at]"),s=v.html;if(!n||!s)return;o.preventDefault(),o.stopPropagation();const r=Math.min(Number(n.dataset.sveProblemAt)||0,s.state.doc.length);s.dispatch({selection:{anchor:r},effects:F.scrollIntoView(r,{y:"center"})}),s.focus()}))}function Td(t){const e=[],o=n=>{for(const s of n||[])s?.loop&&Sd.has(s.type)&&s.var&&!s.parent&&e.push(s.var)};o(t?.section);for(const n of t?.page||[])o(n?.items);return e}function Ad(t,e,o){const n={collection:ys(t),set:ks(a.lastType),view:"",scope:""},s=n.set?Mo(n):"";if(s===to)return;to=s;const r=l=>{if(to!==s)return;const c=new Set(Td(l)),d=c.size===ge.size&&[...c].every(f=>ge.has(f));ge=c,!d&&v.html===e&&t.queueMicrotask(()=>{v.html===e&&e.dispatch({effects:o.of(null)})})};if(!s){r(null);return}const i=xs(s);if(i){r(i);return}_s(t,n).then(r)}function Md(t){if(!a.htmlLintUi){const{field:e,relint:o}=wd({Decoration:Q,StateField:dt,StateEffect:Wt,RangeSetBuilder:ut,EditorView:F},Ce.parser,()=>({lists:ge})),n=F.updateListener.of(s=>{const r=s.transactions.some(i=>i.effects.some(l=>l.is(o)));!s.docChanged&&!r||(s.docChanged&&Ad(t,s.view,o),$d(t,s.view,s.state.field(e).problems))});a.htmlLintUi={extensions:[e,n]}}return Cd(t),a.htmlLintUi}const Hn=/\{\{\s*(?:vite\b[^}]*|yield_[a-z_]+|theme_tokens)\s*\}\}/g;function Ed(t,e=[]){const o=[];Hn.lastIndex=0;let n;for(;n=Hn.exec(String(t||""));)o.push(n.index,n.index+n[0].length);if(!e||!e.length)return o;const s=[];for(const r of[o,e])for(let i=0;i+1<r.length;i+=2)s.push([r[i],r[i+1]]);return s.sort((r,i)=>r[0]-i[0]||r[1]-i[1]).flat()}const Ld=["input","delete","move"];function Fd(t){return Ld.some(e=>t(e))}let eo={text:null,ranges:[]};function aa(t){return eo.text!==t&&(eo={text:t,ranges:Ed(t,t.includes("sve-lock")?Ur(t):[])}),eo.ranges}function Wn(t,e){const o=new ut,n=aa(t.doc.toString());for(let s=0;s<n.length;s+=2)o.add(n[s],n[s+1],e);return o.finish()}let pe=null;function Bd(){if(pe)return pe;const t=Q.mark({class:"sve-dock-locked"}),e=dt.define({create:n=>Wn(n,t),update:(n,s)=>s.docChanged?Wn(s.state,t):n,provide:n=>F.decorations.from(n)}),o=F.baseTheme({".sve-dock-locked":{opacity:".55",borderRadius:".1875rem",backgroundColor:"rgba(127,127,127,.14)",cursor:"not-allowed"}});return pe={extensions:[e,o,te.changeFilter.of(n=>Fd(s=>n.isUserEvent(s))?aa(n.startState.doc.toString()):!0)]},pe}function Pd(){if(a.cssGhostUi)return a.cssGhostUi;const t=Q.mark({class:"sve-css-ghost"}),e=o=>{const n=new ut;if(!a.lastWin)return n.finish();try{for(const s of pl(o.doc.toString(),gt(a.lastWin)))n.add(s.from,s.to,t)}catch{}return n.finish()};return a.cssGhostUi=dt.define({create:o=>e(o),update:(o,n)=>n.docChanged?e(n.state):o,provide:o=>F.decorations.from(o)}),a.cssGhostUi}let he=null,Se=null;function Id(){if(he)return he;Se=Wt.define();const t=Q.line({class:"sve-css-id"}),e=o=>{const n=new ut;if(!a.lastWin||!a.cssValues)return n.finish();try{const s=o.doc;for(const r of ye(s.toString(),gt(a.lastWin),a.cssSize)){const i=s.lineAt(Math.min(r.from,s.length)).number,l=s.lineAt(Math.min(Math.max(r.to-1,r.from),s.length)).number;for(let c=i;c<=l;c+=1)n.add(s.line(c).from,s.line(c).from,t)}}catch{}return n.finish()};return he=dt.define({create:o=>e(o),update:(o,n)=>n.docChanged||n.effects.some(s=>s.is(Se))?e(n.state):o,provide:o=>F.decorations.from(o)}),he}function Vo(){Se&&v.css&&v.css.dispatch({effects:Se.of(null)})}function Od(){return a.htmlPartialUi||(a.htmlPartialUi=Xr({Decoration:Q,StateField:dt,StateEffect:Wt,RangeSetBuilder:ut,EditorView:F})),a.htmlPartialUi}function Dd(){return a.htmlAntlersUi||(a.htmlAntlersUi=Rc({Decoration:Q,StateField:dt,RangeSetBuilder:ut,EditorView:F})),a.htmlAntlersUi}function Hd(){return a.htmlClassTokenUi||(a.htmlClassTokenUi=mi({Decoration:Q,StateField:dt,StateEffect:Wt,RangeSetBuilder:ut,EditorView:F})),a.htmlClassTokenUi}function Wd(t,e,o){v[e]?.destroy();const n=po.of([{key:"Mod-s",run:()=>(z(t.document),!0)}]);v[e]=new F({state:te.create({doc:"",extensions:[Ta(),Aa(),Ma(),Ba(),ju(e),Ia(),Pa({tooltipClass:()=>"sve-tw-complete"}),...e==="html"?[Ce.data.of({autocomplete:Kr(t)}),Ce.data.of({autocomplete:Bl(t)}),Pl(t),Gr(Wa,t)]:[],...e==="html"?[...ci(),di()]:[],...e==="css"?[Na(),Pd(),Id()]:[],po.of([...Ea,...e==="html"?[{key:"Tab",run:ui}]:[],La,...Fa,...Ha,...Oa]),n,F.lineWrapping,...e==="html"||e==="css"?Od().extensions:[],...e==="html"?Dd().extensions:[],...e==="html"?Md(t).extensions:[],...e==="html"?Bd().extensions:[],...e==="html"?Hd().extensions:[],Vt[e].of(te.readOnly.of(!!a.lastLocked)),Ut[e].of(F.editable.of(!a.lastLocked)),F.updateListener.of(s=>{e==="html"&&s.docChanged&&!a.applying&&(nc(),ko("dock:html-changed")),e==="css"&&s.docChanged&&!a.applying&&sc(),s.docChanged&&G(t),e==="css"&&(s.docChanged||s.selectionSet)&&E(t),e==="css"&&s.docChanged&&!a.applying&&Dt(t),e==="html"&&(s.docChanged||s.selectionSet)&&(We(t),Re(t),lt(t),a.applying||le(t))}),F.domEventHandlers({click:(s,r)=>(e==="html"&&r===v.html&&lc(t),!1)}),...nr(C,{height:"auto",background:"#1E1E21",scroller:{overflow:"visible",height:"auto",minHeight:0},extraTags:s=>[{tag:s.tagName,color:"#4ec9b0"},{tag:s.attributeName,color:"#9cdcfe"},{tag:s.attributeValue,color:"#ce9178"},{tag:s.angleBracket,color:"#808080"}]})]}),parent:o})}function jd(t){if(!t||t.querySelector(".cm-editor"))return;t.replaceChildren();const e=t.ownerDocument.createElement("span");e.style.cssText="width:16px;height:16px;margin:12px;border:2px solid #858585;border-right-color:transparent;border-radius:50%;display:block;animation:sve-cm-wait .6s linear infinite",t.appendChild(e)}function gt(t){return yo(t).map(e=>({handle:e.handle,base:e.base,max:e.max,media:e.media,media_px:e.media_px,label:e.label}))}function ra(t,e){return gt(t).find(o=>o.handle===e)||null}function Ne(t=a.cssState){return t?t==="before"||t==="after"?`::${t}`:`:${t}`:""}function Dt(t,e=!1){const o=v.css;if(!o||!ho||!mo)return;const n=o.state.doc.toString(),s=`${a.cssValues?"1":"0"}|${a.cssSize}|${Pe(n).map(f=>`${f.from}-${f.to}`).join(",")}`;if(!e&&s===a.cssFoldSig)return;a.cssFoldSig=s;const r=gt(t),i=new Map,l=[...ul(n,r,a.cssSize),...a.cssValues?[]:ye(n,r,a.cssSize).map(f=>({from:f.from,to:f.to}))];for(const f of l)f.to>f.from&&i.set(`${f.from}:${f.to}`,{from:f.from,to:f.to});const c=[],d=new Set;qa(o.state).between(0,n.length,(f,p)=>{const m=`${f}:${p}`;d.add(m),!i.has(m)&&a.cssOwnFolds.has(m)&&c.push(mo.of({from:f,to:p}))});for(const[f,p]of i)d.has(f)||c.push(ho.of(p));a.cssOwnFolds=new Set(i.keys()),c.length&&o.dispatch({effects:c})}function uo(t,e){const o=a.cssFull||e;return/max-width/i.test(o)&&!/width\s*</i.test(o)&&t.media_px||t.media}function zd(t,e){const o=v.css;if(!o||o.state.readOnly)return;const n=gt(t),s=ra(t,e),r=o.state.doc.toString();if(!s||s.base){const f=o.state.selection.main.head,p=Pe(r).find(m=>f>=m.from&&f<=m.to);p&&o.dispatch({selection:{anchor:p.from},scrollIntoView:!0});return}const i=Lo(r,n,e);if(i.length){const f=i[0],p=Math.min(f.bodyTo,f.bodyFrom+(r.slice(f.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);o.dispatch({selection:{anchor:p},scrollIntoView:!0});return}const l=uo(s,r),c=ia(o,r),d=`

${c.indent}@media ${l} {
${c.indent}    
${c.indent}}${c.suffix}`;o.dispatch({changes:{from:c.at,to:c.at,insert:d},selection:{anchor:c.at+d.lastIndexOf("    ")+4},scrollIntoView:!0})}function ia(t,e){const o=Pe(e);if(o.length){const i=o[o.length-1];return{at:i.to,indent:xt(e,i.from),suffix:""}}const n=i=>({at:i.to,indent:xt(e,i.to)||`${xt(e,i.open)}    `,suffix:`
${xt(e,i.open)}`}),s=je();if(s)return n(s);const r=Rd(e);return r?n(r):{at:e.length,indent:"",suffix:""}}function Rd(t){const e=String(t||"");let o=null,n=0,s=0;for(;n<e.length;){if(e[n]==="}"||e[n]===";"){n+=1,s=n;continue}if(e[n]!=="{"){n+=1;continue}const r=Co(e,n);if(r===-1||o||(o=e.slice(s,n).trim().startsWith("@")?null:{from:s,open:n,to:r},!o))return null;n=r+1,s=n}return o}function Nd(t,e){const o=e===a.cssSize?"":e;a.cssSize=o,N(t,Go,o),rt("lp:set-device",{win:t,key:o?pr(o,t):"Responsive"}),o&&zd(t,o),a.cssValues&&ca(t),Dt(t,!0),Vo(),lt(t),E(t)}function qd(t,e){a.cssState=Xo.includes(e)?e:"",N(t,fo,a.cssState),$(t.document),lt(t),E(t)}function Vd(t,e){const o=t.document;$(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=y,o.body.appendChild(n),D(t,e,n),n._sveApp=H(tt,n,{kind:"choices",choices:[{value:"",label:h(t,"css_state_none"),active:!a.cssState},...Xo.map(s=>({value:s,label:Ne(s),active:s===a.cssState}))],onPick:s=>qd(t,s)})}function lt(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-css-head]");if(!o)return;const n=Ct(),s=gt(t),r=v.css?.state.doc.toString()??"";S.tag=n?.tag||"",S.scope=Yr(n?vt().slice(n.from,n.openTo):"")||"",e.toggleAttribute("data-sve-css-unnamed",a.styleMode!=="tw"&&!S.scope);const i=S.scope,l=Bo(t,i);S.scopeElsewhere=[...new Set(l.map(c=>String(c.file).replace(/^.*\//,"")))],S.scopeElsewhereTitle=S.scopeElsewhere.length?`${h(t,"class_defined_in",{file:S.scopeElsewhere.join(", ")})} — ${h(t,"class_defined_import")}`:"",S.onScopeImport=()=>{Po(t,i)&&lt(t)},i&&!As()&&Fo(t).then(()=>lt(t)),S.note=a.cssPane==="empty"?h(t,"css_pane_empty"):"",S.canEdit=!a.lastLocked,S.onTag=c=>Zr(t,c.currentTarget,n),S.state=a.cssState,S.stateLabel=a.cssState?Ne(a.cssState):h(t,"css_state"),S.onState=c=>Vd(t,c.currentTarget),S.onSize=c=>Nd(t,c),S.sizes=[{key:"",label:h(t,"tw_size_all"),title:h(t,"css_size_all_title"),active:!a.cssSize},...s.map(c=>{const d=c.base||Lo(r,s,c.handle).length>0;return{key:c.handle,label:c.label,title:c.base?h(t,"css_size_base_title"):`@media ${c.media}${d?"":`  ·  ${h(t,"css_size_new")}`}`,active:a.cssSize===c.handle}})],o._sveMounted||(o._sveMounted=!0,ee(o,_l))}Ae("lp:device",t=>{const e=a.lastWin;if(!e||!ha(e.document))return;const o=yo(e).find(n=>n.device===t)?.handle||"";o!==a.cssSize&&(a.cssSize=o,N(e,Go,o),Dt(e,!0),Vo(),lt(e),E(e))});function Ud(t){const e=Math.max(0,Math.round(Date.now()/1e3-t)),o=new Date(t*1e3).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});let n=o;try{const s=new Intl.RelativeTimeFormat(void 0,{numeric:"auto"});e<90?n=s.format(-e,"second"):e<5400?n=s.format(-Math.round(e/60),"minute"):e<86400?n=s.format(-Math.round(e/3600),"hour"):n=s.format(-Math.round(e/86400),"day")}catch{}return`${n} · ${o}`}function la(t,e){return t.fetch(e,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}})}async function Kd(t,e){const o=t.document,n=bt();if($(o),!n)return;let s=[];try{const i=await la(t,`/!/sve/section-template/history?type=${encodeURIComponent(n)}`);i.ok&&(s=(await i.json())?.entries||[])}catch{s=[]}if(!o.getElementById(u)||!o.contains(e))return;e.setAttribute("data-open","");const r=o.createElement("div");r.id=y,o.body.appendChild(r),D(t,e,r),r._sveApp=H(tt,r,{kind:"choices",choices:s.length?s.map(i=>({value:i.id,label:Ud(i.at)})):[{value:"",label:h(t,"code_dock_history_empty")}],onPick:i=>{$(o),i&&Gd(t,n,i)}})}async function Gd(t,e,o){if(ct())return;let n=null;try{const s=await la(t,`/!/sve/section-template/history/entry?type=${encodeURIComponent(e)}&id=${encodeURIComponent(o)}`);s.ok&&(n=await s.json())}catch{n=null}!n||ct()||(Ot({html:n.html??"",css:n.css??"",js:n.js??""},a.lastLocked),G(t),le(t))}function Et(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-code-strip]");if(!e)return;e.hidden=a.styleMode!=="tw";const o=ps(t);e.innerHTML=bf,e.title=h(t,o?"tw_strip_on":"tw_strip_off"),e.setAttribute("aria-label",e.title),e.setAttribute("aria-pressed",o?"true":"false")}function Xd(t,e){const o=e.querySelector("[data-sve-code-strip]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Jr(t,!ps(t)),Et(t),Qr(t)}),Et(t))}function Yd(t,e){const o=e.querySelector("[data-sve-code-history]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=yf,o.title=h(t,"code_dock_history"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),o.hasAttribute("data-open")){$(t.document);return}Kd(t,o)}))}function Jf(){return a.styleMode}function Zd(t){return a.styleMode==="tw"?Ct():null}function Ct(t){const e=v.html;if(!e)return null;const o=a.htmlScopeActive&&!!a.htmlFocus,n=o?a.htmlFull:e.state.doc.toString(),r=(o?a.htmlFocus.from:0)+e.state.selection.main.from,i=Me(Ee(n),new Set);let l=null;for(const c of i)c.from<=r&&r<c.to&&(l=c);return l}function le(t){a.styleMode==="tw"&&ti(t,Zd())}function Uo(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-values-mode]");if(!e||!o)return;e.setAttribute("data-sve-values",a.cssValues?"on":"off");const n=t.document.createElement("span");n.textContent=h(t,"code_dock_values"),o.innerHTML=xf,o.appendChild(n),o.title=h(t,a.cssValues?"code_dock_values_off":"code_dock_values_on"),o.setAttribute("aria-label",o.title),o.setAttribute("aria-pressed",a.cssValues?"true":"false")}function ca(t){const e=v.css;if(!e||e.state.readOnly)return;const o=gt(t),n=e.state.doc.toString(),s=ye(n,o,a.cssSize);if(e.focus(),s.length){const m=s[0],b=Math.min(m.bodyTo,m.bodyFrom+(n.slice(m.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);e.dispatch({selection:{anchor:b},scrollIntoView:!0});return}const r=ra(t,a.cssSize);if(!r||r.base){const m=`#id-{{ id }} {
    `;e.dispatch({changes:{from:0,to:0,insert:`${m}
}

`},selection:{anchor:m.length},scrollIntoView:!0});return}const i=Lo(n,o,a.cssSize)[0];if(i){const m=`${xt(n,i.from)}    `,b=`
${m}#id-{{ id }} {
${m}    `;e.dispatch({changes:{from:i.bodyFrom,to:i.bodyFrom,insert:`${b}
${m}}
`},selection:{anchor:i.bodyFrom+b.length},scrollIntoView:!0});return}const l=ia(e,n),c=`${l.indent}    `,d=ye(n,o,"").some(m=>l.at>m.bodyFrom&&l.at<=m.bodyTo),f=d?`

${l.indent}@media ${uo(r,n)} {
${c}`:`

${l.indent}@media ${uo(r,n)} {
${c}#id-{{ id }} {
${c}    `,p=d?`
${l.indent}}${l.suffix}`:`
${c}}
${l.indent}}${l.suffix}`;e.dispatch({changes:{from:l.at,to:l.at,insert:`${f}${p}`},selection:{anchor:l.at+f.length},scrollIntoView:!0})}function Jd(t,e){a.cssValues=!!e,N(t,on,a.cssValues?"1":"0"),$(t.document),a.cssOpenTool="",Uo(t),X(),$t(),a.cssValues&&ca(t),Dt(t,!0),Vo(),lt(t),E(t)}const Qd='<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M2.5 3.5h11M2.5 8h11M2.5 12.5h7"/></svg>';function Ko(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-css-all]");if(!e||!o)return;e.setAttribute("data-sve-css-all-on",a.cssAll?"on":"off");const n=t.document.createElement("span");n.textContent=h(t,"code_dock_css_all"),o.innerHTML=Qd,o.appendChild(n),o.title=h(t,a.cssAll?"code_dock_css_all_off":"code_dock_css_all_on"),o.setAttribute("aria-label",o.title),o.setAttribute("aria-pressed",a.cssAll?"true":"false")}function tu(t,e){a.cssAll=!!e,$(t.document),a.cssOpenTool="",Ko(t),X(),$t(),Dt(t,!0),lt(t),E(t)}function qe(t){const e=t?.document.getElementById(u);if(!e)return;const o=a.styleMode==="tw";e.setAttribute("data-sve-style",a.styleMode);const n=e.querySelector("[data-sve-css-label]");n&&(n.textContent=o?h(t,"code_dock_style_tw"):h(t,"code_dock_css"));const s=e.querySelector("[data-sve-style-mode]");if(!s)return;const r=t.document.createElement("span");r.textContent=o?h(t,"code_dock_style_tw"):h(t,"code_dock_css"),s.innerHTML=o?_f:kf,s.appendChild(r),s.title=h(t,o?"code_dock_style_to_css":"code_dock_style_to_tw"),s.setAttribute("aria-label",s.title),s.setAttribute("aria-pressed",o?"true":"false")}function da(t){t?.document.getElementById(u),$(t.document),so(t),a.cssOpenTool="",a.cssOpenMenu="",a.styleMode==="tw"&&a.cssValues&&(a.cssValues=!1,N(t,on,"0")),qe(t),Uo(t),Ko(t),Et(t),a.cssToolRow?.(),a.styleMode==="tw"&&(a.htmlScopePref=!0,N(t,Ue,"1"),ao(t,!0)),le(t),Re(t),E(t)}const Go="sve-css-size",fo="sve-css-state",Xo=["hover","focus","focus-visible","active","disabled","before","after"],jn="data-sve-scroll-edge";function Yo(t){if(!t||t._sveEdges)return;t._sveEdges=!0;const e=()=>ou(t),o=new ResizeObserver(e),n=()=>{for(const s of t.children)o.observe(s)};t.addEventListener("scroll",e,{passive:!0}),o.observe(t),n(),new MutationObserver(()=>{n(),e()}).observe(t,{childList:!0}),e()}function eu(t,e){if(!t||t._sveEdgesIn)return;t._sveEdgesIn=!0;const o=()=>t.querySelectorAll(e).forEach(Yo);o(),new MutationObserver(o).observe(t,{childList:!0,subtree:!0})}function ou(t){const e=t.scrollWidth-t.clientWidth,o=t.scrollLeft>1,n=e-t.scrollLeft>1,s=o&&n?"both":o?"left":n?"right":"";s?t.setAttribute(jn,s):t.removeAttribute(jn)}function nu(t,e){a.styleMode=e==="tw"?"tw":"css",N(t,Xa,a.styleMode),da(t)}function su(t,e){if(e._sveStyleModeBound)return;e._sveStyleModeBound=!0,a.styleMode=Y(t,Xa)==="tw"?"tw":"css";const o=Y(t,Go)||"";a.cssSize=yo(t).some(n=>n.handle===o)?o:"",a.cssState=Xo.includes(Y(t,fo))?Y(t,fo):"",a.cssValues=Y(t,on)==="1",e.querySelector("[data-sve-style-mode]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),nu(t,a.styleMode==="tw"?"css":"tw")}),e.querySelector("[data-sve-values-mode]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Jd(t,!a.cssValues)}),e.querySelector("[data-sve-css-all]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),tu(t,!a.cssAll)}),da(t),Uo(t),Ko(t)}function au(t,e){const o=e.querySelector("[data-sve-css-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=r=>e.querySelector(`[data-sve-css-tool="${r}"], [data-sve-css-kid="${r}"]`),s=r=>{const i=n(r.id),l=a.cssOpenMenu===r.id;if($(t.document),l){so(t),E(t);return}if(!i)return;const c=a.styleMode==="tw"?!r.twClass&&(!!r.tw||!!r.twGroup):!r.kind&&!r.value&&!(r.css in Z())&&!!r.menu,d=()=>{c&&(a.cssOpenMenu=r.id)},f=()=>{a.cssOpenTool="",E(t)};if(a.styleMode==="tw"){so(t),r.twClass?(ei(t,r.twClass),E(t)):r.twGroup?(oi(t,i,r.title,r.twGroup,f),d(),E(t)):r.tw&&(ni(t,i,r.tw,f),d(),E(t));return}if(r.kind==="flexDir"){Lc(r.value);return}if(r.kind==="display"){Fc(r.value);return}if(r.value){const p=B(Z()[r.css])===B(r.value);K([{property:r.css,value:p?null:r.value}]);return}if(r.css in Z()){K([{property:r.css,value:null}]),E(t);return}r.menu==="colors"?Ic(t,i,r.css):r.menu==="spacing"?Dc(t,i,r.css):r.menu==="sizes"?En(t,i,r.css,Mf):r.menu==="choices"?Oc(t,i,r.css,r.choices):r.menu==="values"&&En(t,i,r.css),d(),E(t)};ft.onTool=r=>{const i=Te.get(r)?.tool;if(i){if(i.kids?.length){a.cssOpenTool=a.cssOpenTool===i.id?"":i.id,$(t.document),E(t);return}s(i)}},ft.onKid=(r,i)=>{const l=Te.get(i);l?.kid&&s(l.kid)},a.cssToolRow=()=>{ee(o,il),E(t)},a.cssToolRow(),Yo(o),eu(o,"[data-sve-css-kids]"),t.document.addEventListener("mousedown",r=>{r.target.closest(`#${y}, [data-sve-css-tools], [data-sve-html-tools], [data-sve-css-add-class]`)||$(t.document)},!0)}function ru(t,e){const o=e.querySelector("[data-sve-html-tidy]");o&&(o.innerHTML=hs.tidy,o.title=h(t,"code_dock_html_tidy"),o.setAttribute("aria-label",o.title),o.setAttribute("data-tip",o.title))}function iu(t,e){const o=e.querySelector("[data-sve-html-tidy]");ru(t,e),!(!o||o._sveBound)&&(o._sveBound=!0,o.addEventListener("mousedown",n=>n.preventDefault()),o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),qs()}))}function lu(t,e){const o=e.querySelector("[data-sve-html-tools]");!o||o._sveBound||(o._sveBound=!0,ee(o,el,{tools:vo.map(n=>({...n,icon:hs[n.id]||""})),onTool:n=>{const s=vo.find(i=>i.id===n),r=o.querySelector(`[data-sve-html-tool="${n}"]`);if(s){if(s.menu==="heading"){Cn(t,r,Ja);return}if(s.menu==="text"){Cn(t,r,kr);return}if(s.tidy){qs();return}if(s.menu==="component"){wc(t,r);return}if($(t.document),s.action==="pagination"){xc();return}if(s.snippet){Ns(s.snippet,s.caret??s.snippet.length,s.select),P();return}Vs(s.tag)}}}),Yo(o),Iu(t,e),Du(t,e),Pu(t,e))}T("dock:save-now",()=>(z(a.lastWin?.document),!0));let me=null;async function cu(t){const e=t.document;Uu(e);let o=e.getElementById(u);if(o&&!(o.querySelector('[data-sve-css-chrome="subrow-2"]')&&o.querySelector("[data-sve-css-add-class]")&&o.querySelector("[data-sve-html-tools]")&&o.querySelector("[data-sve-html-tidy]")&&o.querySelector("[data-sve-data-vars]")&&o.querySelector("[data-sve-visual-edit-tools]")&&o.querySelector("[data-sve-html-scope]")&&o.querySelector("[data-sve-code-lock]")&&o.querySelector("[data-sve-code-back]")&&o.querySelector("[data-sve-code-autosave]")&&o.querySelector("[data-sve-code-save]")&&o.getAttribute("data-sve-code-chrome")==="scope-9")){for(const s of st)v[s]?.destroy(),v[s]=null;o.remove(),o=null}if(!o){o=e.createElement("div"),o.id=u,o.setAttribute("data-sve-code-chrome","scope-9"),Sr(o,$r(t)),ee(o,Xi,{htmlLabel:h(t,"code_dock_html"),cssLabel:h(t,"code_dock_css"),jsLabel:h(t,"code_dock_js"),alpineLabel:h(t,"code_dock_alpine"),treeIcon:Za,dataIcon:ff,dataLabel:h(t,"data_vars_title")}),no(e,o),qn(o),Sa(o,ka(t)),Qu(t,o),ef(t,o),tf(t,o),au(t,o),$c(t,o),su(t,o),Yd(t,o),Xd(t,o),Cr(t,o),lu(t,o),wn(t,o),xn(t,o),Vn(t,o),_n(t,o);for(const n of st){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);jd(s)}Tr(t)}if(no(e,o),qn(o),iu(t,o),wn(t,o),xn(t,o),Vn(t,o),_n(t,o),Yu(t),Jo(t),wt(t),q(t),Bt(t),J(t),qe(t),Et(t),await nf(),!v.html){for(const n of st){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);s?.replaceChildren(),Wd(t,n,s)}for(const n of["html","css"])v[n]&&si(t,v[n],{onOpen:s=>Is(t,s),emptyLabel:h(t,"code_dock_partials_empty"),openLabel:s=>h(t,"component_open_named",{name:s}),sectionValues:()=>Ps(t),isLocked:()=>ct(),setHover:(s,r)=>a.htmlPartialUi?.setHover(s,r)});bi(t,v.html,{onRename:n=>rc(t,n),isLocked:()=>ct(),setHover:(n,s)=>a.htmlClassTokenUi?.setHover(n,s),title:h(t,"code_dock_css_rename_class")})}return o}function Zo(t){return me||(me=cu(t).finally(()=>{me=null})),me}async function zn(t,e){const o=await Zo(t);a.lastType=e,a.lastLocked=!0,a.lockReady=!0,a.lastParts={html:"",css:"",js:""},ae(),wt(t),Ot(a.lastParts,!0),en(t.document,e),I(t.document,h(t,"code_dock_missing")),q(t),Bt(t),J(t),Ft(t,o)}let Rn=-1;async function ua(t,e){if(Rn===a.loadGen&&!a.lastType&&t.document.getElementById(u))return;z(e);const o=++a.loadGen;Rn=o,a.lastType=null,a.typeStack=[],a.lastParts={html:"",css:"",js:""},a.lastProps=[],a.propsDirty=!1,a.lastLocked=!1,a.lockReady=!1,a.loadInFlight=null,Ls(),ae();const n=await Zo(t);o===a.loadGen&&(Ot(a.lastParts,!0),Eo(t),Le(t),To(t),en(t.document,""),I(t.document,h(t,hr(t,t.document)?"code_dock_pick_section":"code_dock_open_template")),wt(t),q(t),Bt(t),J(t),qe(t),Et(t),Ft(t,n))}function fa(t){return Xt(t,a.lastType)||Xt(t,a.typeStack[0])}function du(t,e,o){if(o==="replace"){if(!Xt(t,e)){a.beforePart=null;return}fa(t)||(a.beforePart={type:a.lastType||"",uid:a.lastUid||"",stack:[...a.typeStack],onEmptyPage:!!a.onEmptyPage})}}function pa(t,e){if(!fa(t))return!1;const o=a.beforePart,n=o?.type||"",s=o?.stack[0]||n,r=!!(n&&o.uid&&va(t,e,o.uid)===s),i=!!(n&&n.startsWith("view:")&&s.startsWith("view:"));return a.beforePart=null,a.lastWin=t,z(e),!r&&!i?(a.lastUid=null,a.onEmptyPage=!0,ua(t,e),!0):(a.lastUid=o.uid||null,a.onEmptyPage=o.onEmptyPage,Ht(t,n,"replace"),a.typeStack=[...o.stack],!0)}async function Ht(t,e,o="replace"){du(t,e,o),o==="replace"?a.typeStack=[]:o==="push"&&a.lastType&&a.lastType!==e&&a.typeStack.push(a.lastType);const n=++a.loadGen;a.lastType=e,a.lockReady=!1,ae(),I(t.document,h(t,"code_dock_loading"));let s=()=>{};a.loadInFlight=new Promise(i=>{s=i});const r=await Zo(t);wt(t),q(t),Bt(t),J(t),qe(t),Et(t),Ft(t,r),t.fetch(`/!/sve/section-template?type=${encodeURIComponent(e)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async i=>{if(n!==a.loadGen)return;if(i.status===404){zn(t,e);return}if(!i.ok)throw new Error(String(i.status));const l=await i.json();n===a.loadGen&&(a.lastParts={html:typeof l.html=="string"?l.html:"",css:typeof l.css=="string"?l.css:"",js:typeof l.js=="string"?l.js:""},a.lastProps=Array.isArray(l.props)?l.props:[],a.propsDirty=!1,a.lastType=e,a.lastLocked=!!l.locked,a.lockReady=!0,Ls(),typeof l.tw=="string"&&l.tw!==""&&oc(a.lastParts.html,l.tw),wt(t),Ot(a.lastParts,a.lastLocked),To(t),a.lastLocked||Fs(t,a.lastParts.html),en(t.document,l.path||e),I(t.document,a.lastLocked?h(t,"code_dock_locked"):""),l.writable?.template===!1?I(t.document,h(t,"code_dock_not_writable")):l.writable?.tw===!1&&I(t.document,h(t,"code_dock_tw_not_writable")),Eo(t),Ji(t),Le(t),q(t),Bt(t),J(t),Ft(t,r))}).catch(()=>{n===a.loadGen&&(zn(t,e),I(t.document,h(t,"code_dock_error")))}).finally(()=>{n===a.loadGen&&(a.loadInFlight=null),s()})}function bt(){return a.lastType||""}function ha(t){return!!t?.getElementById(u)}function ct(){return a.lastLocked}function uu(t,e){const o=typeof e?.html=="string"?e.html.trim():"",n=typeof e?.css=="string"?e.css.trim():"",s=typeof e?.js=="string"?e.js.trim():"";if(!o&&!n&&!s||!t?.document?.getElementById(u))return!1;let r=!1;return o&&(r=fu("html",o)||r),n&&(r=Nn("css",n)||r),s&&(r=Nn("js",s)||r),r&&G(t),r}function fu(t,e){const o=v[t];if(!o||o.state.readOnly)return!1;const n=o.state.selection.main,s=n.from>0?o.state.doc.sliceString(n.from-1,n.from):`
`,r=n.to<o.state.doc.length?o.state.doc.sliceString(n.to,n.to+1):`
`,c=`${s===`
`?"":`
`}${e}${r===`
`?"":`
`}`;return o.dispatch({changes:{from:n.from,to:n.to,insert:c},selection:{anchor:n.from+c.length}}),!0}function Nn(t,e){const o=v[t];if(!o||o.state.readOnly)return!1;const n=o.state.doc.length,r=`${n>0&&o.state.doc.sliceString(Math.max(0,n-1),n)!==`
`?`

`:n?`
`:""}${e}
`;return o.dispatch({changes:{from:n,insert:r},selection:{anchor:n+r.length}}),!0}function pu(t){if(xe(t),!a.lastType||!t.document.getElementById(u))return;const e=a.lastType;a.lastType=null,Ht(t,e,"keep")}function ma(t){R(t),a.loadGen+=1,z(t),a.lastUid=null,a.lastType=null,a.typeStack=[],a.beforePart=null,a.lastParts={html:"",css:"",js:""},a.lastLocked=!1,a.lockReady=!1,a.lastBracketNames=null,a.lastCssSelectorNames=null,ae(),a.lastWin=t?.defaultView||a.lastWin,$(t),ds(t),ot(t),t?.getElementById(U)?.remove();for(const o of st)v[o]?.destroy(),v[o]=null;t?.getElementById(u)?.remove(),Xu(),t&&Qo(t,0);const e=t?.defaultView||a.lastWin;e?.document.getElementById(Gn)&&Qn(e),e&&(Eo(e),Le(e),To(e))}function hu(t){if(a.dragging)return;const e=t.document.getElementById(u);e&&(Jo(t),Ft(t,e))}function va(t,e,o){if(o){const r=cn(o,e)||cn(o,t.document)||o;return String(typeof Ze=="function"&&(Ze(r,e)||Ze(r,t.document))||"").trim()}const n=typeof Kt=="function"?Kt(t):"page_sections",s=typeof V=="function"?V(t.document):[];for(const r of s){const l=(mt(r.values)||r.values)?.[n];if(Array.isArray(l))for(const c of l){const d=typeof c?.type=="string"?c.type.trim():"";if(d)return d}}return""}function Ve(t){if((t.Statamic?.$config?.get?.("sveFeatures")||{}).collection_templates!==!0)return"";const o=t.Statamic?.$config?.get?.("sveCollectionTemplatesCollection")||"templates";if(!(t.location?.pathname||"").includes(`/collections/${o}/entries/`))return"";const s=typeof V=="function"?V(t.document):[];for(const r of s){const i=mt(r.values)||r.values,l=typeof i?.view=="string"?i.view.trim():"";if(!l||l.includes(".."))continue;const c=l.replace(/\.(antlers\.html|blade\.php)$/i,"").replace(/^\/+|\/+$/g,"");if(c)return`view:${c}`}return""}function mu(t,e,o){const n=t.Statamic?.$config?.get?.("sveChromeTemplates")||{},s=n[e]&&typeof n[e].type=="string"?n[e]:null,r=t.Statamic?.$config?.get?.("sveChromeStyles")||{},i=`${e}/${typeof r[e]=="string"&&r[e]!==""?r[e]:"style_1"}`,l=s?.type||i,c=o?.[`${e}_style`];return(!s||s.styled)&&typeof c=="string"&&c!==""?`${e}/${c}`:l}function vu(){const t=bt();if(!t)return"";if(t===Xn)return"main";if(a.lastWin&&t===Ve(a.lastWin))return"template";const e=t.match(/^(header|footer)\//);if(e)return e[1];const o=a.lastWin?.Statamic?.$config?.get?.("sveChromeTemplates")||{};return["header","footer"].find(n=>o[n]?.type===t)||""}function gu(t){const e=es||os;return e!=="header"&&e!=="footer"?"":xo(t)||_o(t)?e:""}function bu(t,e){const o=es||os;return o!=="header"&&o!=="footer"||!xo(e)&&!_o(e)?"":mu(t,o,mt(wr()?.values)||{})}function yu(t,e){if(!e||String(e).startsWith("view:")||Xt(t,e))return!1;const o=typeof Kt=="function"?Kt(t):"page_sections",n=typeof V=="function"?V(t.document):[];for(const s of n){const i=(mt(s.values)||s.values)?.[o];if(Array.isArray(i)&&i.some(l=>l?.type===e))return!0}return!1}function ku(t){const e=ts(t)||t.getElementById("__sve-global-section-host");return e&&e.querySelector("[data-replicator-set][data-type]")?.getAttribute("data-type")||""}function Qf(t,e,o){if(a.dragging)return;const n=!!(o&&o!==a.lastUid);if(o&&(a.lastUid=o),!t||!e||zu(e)||!xr(t)||!_r(t)){e&&ma(e);return}const s=!o&&!!a.lastType&&a.lastType!==Xn&&!xo(e)&&!_o(e)&&!ts(e)&&!yu(t,a.lastType);if(s&&pa(t,e))return;s&&(a.lastUid=null);const r=o||a.lastUid||"",i=bu(t,e)||ku(e)||(r?va(t,e,r):"")||Ve(t)||(!o&&!s?a.lastType:""),l=!i&&!o,c=l,d=i;if(a.onEmptyPage=l,a.lastWin=t,c){ua(t,e);return}if(d&&!(d===a.lastType&&e.getElementById(u))){if(a.typeStack.length&&a.lastType&&a.lastType!==d){const f=a.typeStack[0];if(d===f&&!n)return;a.typeStack=[]}z(e),Ht(t,d,"replace")}}Ae("tw:changed",()=>{a.lastWin&&a.styleMode==="tw"&&E(a.lastWin)});T("dock:is-open",t=>ha(t));T("dock:is-locked",()=>ct());T("dock:html",()=>vt());T("dock:reveal-html",({from:t,to:e,caret:o}={})=>{const n=v.html;if(!n||t==null)return;a.htmlScopePref=oe(a.lastWin),ne(),X();const s=a.htmlFull.length,r=Math.max(0,Math.min(t,s)),i=Math.max(r,Math.min(e??t,s));a.htmlFocus=i>r?{from:r,to:i}:null,a.cssFocus=null,a.cssAll=!1;const l=o==null?null:Math.max(0,Math.min(o,s));if(a.htmlScopePref&&a.htmlFocus){Wo(l),q(a.lastWin);return}if(a.htmlScopeActive){jo(!0,l),q(a.lastWin);return}n.dispatch({selection:l==null?{anchor:r,head:i}:{anchor:l},scrollIntoView:!0}),n.focus()});T("dock:insert-snippet",({win:t,parts:e})=>uu(t,e));T("dock:refresh",t=>pu(t));T("dock:tw-follow",()=>{a.lastWin&&le(a.lastWin)});T("dock:css",()=>(X(),a.cssFull));T("dock:set-css",t=>typeof t!="string"||ct()||!v.css||!a.lastWin?!1:(X(),a.cssFull=t,se("css",Ks()),G(a.lastWin),!0));T("dock:js",()=>v.js?.state.doc.toString()??"");T("dock:set-js",t=>typeof t!="string"||ct()||!v.js||!a.lastWin?!1:(se("js",t),G(a.lastWin),!0));T("dock:data-menu",({anchor:t,onPick:e,at:o}={})=>!t||!a.lastWin?!1:(R(a.lastWin.document),$(a.lastWin.document),ga(a.lastWin,t,e,o),!0));T("dock:props",()=>a.lastProps.map(t=>({...t})));T("dock:set-props",({win:t,props:e}={})=>!Array.isArray(e)||ct()?!1:(a.lastProps=e,a.propsDirty=!0,ai(ce(bt())),z((t||a.lastWin)?.document),!0));function ce(t){const e=/^view:partials\/(components\/[A-Za-z0-9_-]+)$/.exec(String(t||""));return e?e[1]:""}T("dock:component-src",()=>ce(bt()));T("dock:type-stack",()=>a.typeStack.map(t=>({type:t,src:ce(t)})));T("dock:component-exit-state",()=>{const t=ce(bt());return{open:!!t,name:t?t.split("/").pop():"",back:a.typeStack.length>0}});T("dock:exit-component",(t=1)=>{if(!a.lastWin||!ce(bt()))return!1;if(a.typeStack.length){for(let e=Number(t)||1;e>1&&a.typeStack.length>1;e-=1)a.typeStack.pop();Os(a.lastWin)}else ma(a.lastWin.document);return!0});T("dock:current-type",()=>bt());T("dock:on-empty-page",()=>!!a.onEmptyPage);T("dock:current-uid",()=>a.lastUid);T("dock:leave-part",()=>{const t=a.lastWin;return t?(pa(t,t.document),!0):!1});T("dock:chrome-kind",()=>vu());T("dock:collection-view",()=>a.lastWin?Ve(a.lastWin):"");T("dock:chrome-open",t=>gu(t));T("dock:save-settled",()=>a.saveInFlight||null);T("dock:load-settled",()=>a.loadInFlight||null);T("dock:reset-data-vars",t=>(ki(typeof t=="string"&&t?t:void 0),!0));T("dock:refresh-preview",()=>a.lastWin?(xe(a.lastWin),!0):!1);T("dock:open-file",t=>typeof t!="string"||!t||!a.lastWin?!1:(a.onEmptyPage=!1,t===a.lastType||(z(a.lastWin.document),Ht(a.lastWin,t,"replace")),!0));T("dock:open-template",t=>typeof t!="string"||!t||!a.lastWin?!1:(Is(a.lastWin,t),!0));T("dock:set-html",t=>{const e=t&&typeof t=="object"?t:{},o=t&&typeof t=="object"?t.html:t;if(typeof o!="string"||ct())return!1;if(o!==""&&!fs(vt(),o)){const i=a.lastWin;if(!(e?.unlock===!0&&i?.Statamic?.$permissions?.has?.("configure fields")===!0))return i?.Statamic?.$toast?.error(h(i,"html_tree_locked_element")),!1}const n=v.html;if(!n||!a.lastWin)return!1;if(o===""){a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null),a.twDirty=!1,a.twCss=null,a.twKey="",a.lastType=null,a.lastUid=null,a.lastParts={html:"",css:"",js:""},a.cssFull="",a.htmlFull="",a.applying=!0;try{ae();for(const i of st){const l=v[i];if(!l)continue;const c=l.state.doc.toString();c!==""&&l.dispatch({changes:{from:0,to:c.length,insert:""}})}}finally{a.applying=!1}return!0}const s=a.htmlFull;if(a.htmlFull=o,a.htmlScopeActive)return a.htmlFocus=xu(a.htmlFocus,s,o),He(Ws()),G(a.lastWin),ko("dock:html-changed"),!0;const r=n.state.doc.toString();if(r!==o){const[i,l,c]=Ho(r,o);n.dispatch({changes:{from:i,to:l,insert:c}})}return!0});T("dock:show-empty",()=>rt("dock:set-html",""));Ae("row:removed",({parentPath:t,remaining:e,win:o})=>{e===0&&t===Kt(o)&&rt("dock:show-empty")});function xu(t,e,o){const n=o.length-e.length;if(!t||!n)return t;let s=0;for(;s<e.length&&s<o.length&&e[s]===o[s];)s+=1;return s>=t.to?t:s<t.from?{from:Math.max(0,t.from+n),to:Math.max(0,t.to+n)}:{from:t.from,to:Math.max(t.from,t.to+n)}}const Lt="__sve-data-menu";let $e=null;function R(t){const e=t?.getElementById(Lt);$e?.(),$e=null,e?._sveApp?.unmount(),e?.remove(),t?.querySelectorAll("[data-sve-data-vars][data-open], [data-sve-antlers-btn][data-open], [data-sve-visual-edit-btn][data-open]").forEach(o=>o.removeAttribute("data-open"))}function _u(t){if(!Ve(t))return{view:"",kind:""};const e=typeof V=="function"?V(t.document):[];for(const o of e){const n=mt(o.values)||o.values,s=typeof n?.source_collection=="string"?n.source_collection.trim():"";if(s)return{view:s,kind:String(n?.kind||"").trim()}}return{view:"",kind:""}}function wu(t,e){const o=vt();if(Number.isFinite(e))return hn(o,e);const n=v.html;if(!n)return[];const s=a.htmlScopeActive&&a.htmlFocus?a.htmlFocus.from:0;return hn(o,s+n.state.selection.main.from)}function Su(t,e){const{view:o,kind:n}=_u(t);return{collection:ys(t)||"",set:ks(bt()),view:o,kind:n,scope:yi(wu(t,e))}}function $u(t){const e=typeof V=="function"?V(t.document):[];for(const o of e){const n=mt(o.values)||o.values;if(n&&typeof n=="object")return n}return null}function Cu(t,e){return{scope:e?.scope?.groups||[],section:ws(e?.section||[],Ps(t)),page:wi(e?.page||[],$u(t)),site:e?.site||[]}}function Tu(t){const e=t.state.selection.main,o=t.state.doc.lineAt(e.from),n=o.text.slice(0,e.from-o.from);return/(?:^|\s)(?::|x-bind:)[\w.:-]+\s*=\s*(["'])(?:(?!\1).)*$/.test(n)}function Au(t){const e=t.state.selection.main,o=t.state.doc.lineAt(e.from),n=o.text.slice(0,e.from-o.from);return/(?:^|\s)[\w.:@-]+\s*=\s*(["'])(?:(?!\1).)*$/.test(n)}function Mu(t,e){const o=v.html;if(!o||o.state.readOnly)return;if(Tu(o)){const c=String(t?.var||"").trim(),d=o.state.selection.main;o.dispatch({changes:{from:d.from,to:d.to,insert:c},selection:{anchor:d.from+c.length}}),P();return}const n=Si(t,e,{inline:Au(o)});if(!n)return;const s=o.state.selection.main,r=o.state.doc.lineAt(s.from),i=it(r.text),l=Ao(n.text,i);o.dispatch({changes:{from:s.from,to:s.to,insert:l},selection:{anchor:s.from+n.cursor+(n.text.includes(`
`)?i.length:0)}}),P()}function qt(t,e,o){const n=e.getBoundingClientRect(),s=8,r=o.offsetWidth||368,i=o.offsetHeight||240,l=t.innerHeight-n.bottom-s,c=n.top-s,d=l>=i||l>=c?n.bottom+4:n.top-i-4;o.style.left=`${Math.max(s,Math.min(n.left,t.innerWidth-r-s))}px`,o.style.top=`${Math.max(s,Math.min(d,t.innerHeight-i-s))}px`}function ga(t,e,o,n){const s=t.document;R(s),e.setAttribute("data-open","");const r=s.createElement("div");r.id=Lt,r.setAttribute("data-sve-data-menu",""),s.body.appendChild(r);const i=Su(t,n),l=m=>[m?.scope?.groups?.length?{id:"scope",label:m.scope.label||h(t,"data_vars_tab_loop")}:null,{id:"section",label:h(t,"data_vars_tab_section")},{id:"page",label:h(t,"data_vars_tab_page")},{id:"site",label:h(t,"data_vars_tab_site")}].filter(Boolean),c=m=>{s.getElementById(Lt)&&(r._sveApp?.unmount(),r._sveApp=H(ms,r,{title:h(t,"data_vars_title"),placeholder:h(t,"data_vars_placeholder"),emptyText:h(t,"data_vars_empty"),noSectionText:h(t,"data_vars_no_section"),loopText:h(t,"data_vars_loop"),tabs:l(m),data:Cu(t,m),onPick:(b,k)=>o?o(b,k):Mu(b,k)}),qt(t,e,r))};c(xs(Mo(i))||{scope:null,section:[],page:[],site:[]}),_s(t,i).then(c),qt(t,e,r);const d=()=>qt(t,e,r),f=m=>{!r.contains(m.target)&&!e.contains(m.target)&&R(s)},p=m=>{m.key==="Escape"&&R(s)};s.addEventListener("pointerdown",f,!0),s.addEventListener("keydown",p,!0),t.addEventListener("scroll",d,!0),t.addEventListener("resize",d),$e=()=>{s.removeEventListener("pointerdown",f,!0),s.removeEventListener("keydown",p,!0),t.removeEventListener("scroll",d,!0),t.removeEventListener("resize",d)}}function ba(t,e,{title:o,placeholder:n,tabs:s,data:r,onPick:i}){const l=t.document;R(l),$(l),e.setAttribute("data-open","");const c=l.createElement("div");c.id=Lt,c.setAttribute("data-sve-data-menu",""),l.body.appendChild(c),c._sveApp=H(ms,c,{title:o,placeholder:n,emptyText:h(t,"data_vars_empty"),noSectionText:h(t,"data_vars_empty"),loopText:"",tabs:s,data:r,onPick:(d,f)=>{R(l),i(d,f)}}),qt(t,e,c),Eu(t,e,c)}function Eu(t,e,o){const n=t.document,s=()=>qt(t,e,o),r=l=>{!o.contains(l.target)&&!e.contains(l.target)&&R(n)},i=l=>{l.key==="Escape"&&R(n)};n.addEventListener("pointerdown",r,!0),n.addEventListener("keydown",i,!0),t.addEventListener("scroll",s,!0),t.addEventListener("resize",s),$e=()=>{n.removeEventListener("pointerdown",r,!0),n.removeEventListener("keydown",i,!0),t.removeEventListener("scroll",s,!0),t.removeEventListener("resize",s)}}const Lu='<svg width="21" height="11" viewBox="0 0 150 77" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M69.999 55.827a13.8 13.8 0 0 0-.812-3.799 15.4 15.4 0 0 0-1.687-3.55 18.16 18.16 0 0 0-5.686-5.418 37.7 37.7 0 0 0 3.936-6.228 18.6 18.6 0 0 0 1.812-6.228 9.88 9.88 0 0 0-1.248-5.57 9.9 9.9 0 0 0-4.125-3.959 10.46 10.46 0 0 0-10.684 1.183 13.8 13.8 0 0 0-4.061 5.107 39 39 0 0 0-1.812 4.92 49.5 49.5 0 0 1-5.436-6.227 16.9 16.9 0 0 1-2.562-5.606 28.7 28.7 0 0 1-.624-6.85c.003-2-.357-3.983-1.063-5.855a10.66 10.66 0 0 0-4.56-5.231 13.9 13.9 0 0 0-10.684-1.37 10.13 10.13 0 0 0-4.94 2.755 10.1 10.1 0 0 0-2.683 4.967 24.4 24.4 0 0 0 0 10.214 22.4 22.4 0 0 0 3.374 7.35h-1.062a23 23 0 0 1-4.124 0 19.2 19.2 0 0 0-6.248 0 6.74 6.74 0 0 0-3.374 2.74 9.45 9.45 0 0 0-.75 9.341 11.23 11.23 0 0 0 5.811 6.228 25.1 25.1 0 0 0 10.622 1.495 17.9 17.9 0 0 0 9.809-3.425 104 104 0 0 1 10.496 7.162 22.4 22.4 0 0 1 5.249 6.54 15.5 15.5 0 0 1 1.437 5.106 35 35 0 0 0 1.437 6.789 13.2 13.2 0 0 0 4.373 5.73 15.6 15.6 0 0 0 10.372 2.802 9.9 9.9 0 0 0 5.429-1.987 9.84 9.84 0 0 0 3.38-4.677A61.6 61.6 0 0 0 70 55.827m-5.061 12.456a5.05 5.05 0 0 1-1.971 2.157 5.07 5.07 0 0 1-2.84.708 9.45 9.45 0 0 1-6.248-2.367 6.6 6.6 0 0 1-2.124-2.989 50 50 0 0 1-1.625-6.788 18.7 18.7 0 0 0-2.249-5.73 28.7 28.7 0 0 0-7.435-7.35A129 129 0 0 0 27.95 38.95c-.812-.498-2.686 0-2.749 0a14.03 14.03 0 0 1-7.872 1.62 19.5 19.5 0 0 1-7.935-2.056 4.86 4.86 0 0 1-2.375-2.49 3.35 3.35 0 0 1 0-2.99 1.18 1.18 0 0 1 .875-.748c1.25 0 2.687 0 3.936-.435a33 33 0 0 0 4.749-1.122 17.6 17.6 0 0 0 4.498-2.18 1.68 1.68 0 0 0 .838-1.68 1.7 1.7 0 0 0-.213-.624 2.2 2.2 0 0 0-.937-.747 18.65 18.65 0 0 1-2.812-7.35 19.5 19.5 0 0 1 .938-7.97 4.55 4.55 0 0 1 1.326-1.834 4.57 4.57 0 0 1 2.048-.97 7.52 7.52 0 0 1 5.498.997 5.12 5.12 0 0 1 2.499 3.488 87 87 0 0 0 1.874 10.587 22.4 22.4 0 0 0 4.436 6.789 78 78 0 0 0 8.372 7.286 1.8 1.8 0 0 0 1.188 1.246 2.005 2.005 0 0 0 2.499-1.308 33.4 33.4 0 0 1 3.249-6.54 8.8 8.8 0 0 1 2.811-2.677 4.63 4.63 0 0 1 4.561 0 4 4 0 0 1 1.612 1.494c.387.638.586 1.372.575 2.118a14.7 14.7 0 0 1-.75 5.792 36.6 36.6 0 0 1-2.561 6.228v.311a2.05 2.05 0 0 0 .5 2.74 13.6 13.6 0 0 1 3.248 4.92c.375.873.563 1.745.875 2.617s.937 2.678 1.312 4.048c1.625 5.916 2.5 7.536.875 10.961zM148.848 29.42a6.6 6.6 0 0 0-3.062-2.74 16.7 16.7 0 0 0-6.248 0c-1.227.09-2.459.09-3.686 0h-.937a24.2 24.2 0 0 0 3.186-7.536c.659-3.31.659-6.716 0-10.027a9.95 9.95 0 0 0-2.072-5.336 10 10 0 0 0-4.676-3.32 12.53 12.53 0 0 0-10.184 1.556 10.78 10.78 0 0 0-4.498 5.668 16.8 16.8 0 0 0-.875 5.667 32.7 32.7 0 0 1 0 6.602 17.2 17.2 0 0 1-2.499 5.543 52 52 0 0 1-4.748 5.792 32 32 0 0 0-1.5-4.547 14.4 14.4 0 0 0-3.811-5.231 9.522 9.522 0 0 0-10.56-.996 10.16 10.16 0 0 0-3.64 4.024 10.1 10.1 0 0 0-1.045 5.317c.21 2.156.78 4.26 1.687 6.228a38.3 38.3 0 0 0 3.748 6.228 17.5 17.5 0 0 0-5.435 5.668 15 15 0 0 0-1.562 3.55 18.3 18.3 0 0 0-.75 3.674v10.09c.068 1.417.32 2.82.75 4.172a9.46 9.46 0 0 0 3.062 4.609 9.5 9.5 0 0 0 5.123 2.118 14.1 14.1 0 0 0 9.871-2.927 12.76 12.76 0 0 0 4.124-5.792 34 34 0 0 0 1.562-6.727 17.6 17.6 0 0 1 1.375-5.107 21.1 21.1 0 0 1 4.623-6.228 83 83 0 0 1 8.935-7.349 16.34 16.34 0 0 0 8.997 3.301 22.24 22.24 0 0 0 9.746-1.557 10.777 10.777 0 0 0 5.499-6.228 9.88 9.88 0 0 0-.5-8.158m-5.623 6.229a4.43 4.43 0 0 1-2.062 2.553 16.16 16.16 0 0 1-7.06 2.18 11.7 11.7 0 0 1-7.123-1.869s-1.999-.81-2.812 0a123 123 0 0 0-11.558 7.038 26.9 26.9 0 0 0-6.811 7.224 79 79 0 0 0-3.623 12.456 6.23 6.23 0 0 1-2 3.052 7.88 7.88 0 0 1-5.373 2.305 4.63 4.63 0 0 1-2.523-.809 4.6 4.6 0 0 1-1.663-2.056 9.8 9.8 0 0 1-.812-3.488c.25-2.711.881-5.373 1.874-7.91.375-1.37.75-2.678 1.187-4.048s.438-1.806.812-2.616a13.26 13.26 0 0 1 2.937-5.044 2.054 2.054 0 0 0 .375-2.74 44 44 0 0 1-2.25-6.228 17.3 17.3 0 0 1-.687-5.792 4.22 4.22 0 0 1 1.937-3.675 3.57 3.57 0 0 1 3.811 0 8.3 8.3 0 0 1 2.625 2.678 40.5 40.5 0 0 1 3.061 6.228 1.93 1.93 0 0 0 1.664 1.441c.26.029.522.005.773-.07a1.82 1.82 0 0 0 1.187-1.309 80 80 0 0 0 7.872-7.411 22.5 22.5 0 0 0 3.999-6.664 75.4 75.4 0 0 0 1.749-10.525 5.17 5.17 0 0 1 1.937-3.176 5.76 5.76 0 0 1 4.749-.935 4.11 4.11 0 0 1 3.186 2.927c.751 2.609.985 5.338.687 8.035a19 19 0 0 1-2.561 7.473s-.625 0-.75.56a1.68 1.68 0 0 0 .5 2.367c1.27.908 2.657 1.641 4.123 2.18 1.468.49 2.972.865 4.499 1.121 1.125 0 2.374 0 3.561.436s.438.311.625.623c.235.52.351 1.087.341 1.657a3.9 3.9 0 0 1-.403 1.644z"/></svg>',Fu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 9 5 12 1.8-5.2L21 14Z"/><path d="M7.2 2.2 8 5.1"/><path d="m5.1 8-2.9-.8"/><path d="M14 4.1 12 6"/><path d="m6 12-1.9 2"/></svg>';function ya(t,e,o,n,s){const r=t.document.createElement("button");return r.type="button",r.setAttribute(o,""),r.title=s,r.setAttribute("aria-label",s),r.innerHTML=`<span>${n}</span>`,r.addEventListener("mousedown",i=>i.preventDefault()),e.replaceChildren(r),r}function Bu(t){return String(t||"").replace(/\|/g,"").split(`
`)[0].trim()}function Pu(t,e){const o=e.querySelector("[data-sve-data-vars]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("mousedown",n=>n.preventDefault()),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),t.document.getElementById(Lt)){R(t.document);return}$(t.document),ga(t,o)}))}function Iu(t,e){const o=e.querySelector("[data-sve-antlers-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=ya(t,o,"data-sve-antlers-btn",Lu,h(t,"code_dock_antlers"));n.addEventListener("click",s=>{if(s.preventDefault(),s.stopPropagation(),n.hasAttribute("data-open")){R(t.document);return}const r={};for(const i of mn)r[i.id]=fi.filter(l=>l.group===i.id).map(l=>({id:l.id,var:l.label,value:l.inline?"":Bu(l.snippet)}));ba(t,n,{title:h(t,"code_dock_antlers"),placeholder:h(t,"code_dock_antlers_search"),tabs:mn.map(i=>({id:i.id,label:h(t,i.lang)})),data:r,onPick:i=>Ou(i.id)})})}function Ou(t){const e=pi(t),o=v.html;if(!e||!o||o.state.readOnly)return;const n=o.state.selection.main.head;if(e.inline){const c=e.snippet,d=o.state.selection.main;o.dispatch({changes:{from:d.from,to:d.to,insert:c},selection:{anchor:d.from+c.length}}),P();return}const s=o.state.doc.lineAt(n),r=s.text.trim()?it(s.text):ze(o,s)||it(s.text),{text:i,cursor:l}=be(e.snippet);Zt(Ao(i,r),l),P()}function Du(t,e){const o=e.querySelector("[data-sve-visual-edit-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=ya(t,o,"data-sve-visual-edit-btn",Fu,h(t,"code_dock_visual_edit"));n.addEventListener("click",s=>{if(s.preventDefault(),s.stopPropagation(),n.hasAttribute("data-open")){R(t.document);return}const r={};for(const i of gn)r[i.id]=Ss.filter(l=>l.group===i.id).map(l=>({id:l.id,var:l.label,value:l.attr?l.attr.replace(/\|/g,""):""}));ba(t,n,{title:h(t,"code_dock_visual_edit"),placeholder:h(t,"code_dock_visual_edit_search"),tabs:gn.map(i=>({id:i.id,label:h(t,i.lang)})),data:r,onPick:i=>Wu(i.id)})})}function Hu(t,e,o,n){if(Ti(o.inner,n.attr)){t.focus();return}const{text:s,cursor:r}=be(n.attr);let i=o.closeIdx;for(;i>o.openIdx+2&&/\s/.test(e[i-1]);)i--;t.dispatch({changes:{from:i,to:o.closeIdx,insert:` ${s} `},selection:{anchor:i+1+r}}),P()}function Wu(t){const e=$i(t),o=v.html;if(!e||!o||o.state.readOnly)return;const n=o.state.doc.toString(),s=re();if(s?.open){const p=Ci(n,s.open.from,s.open.to,ue);if(p){e.attr?Hu(o,n,p,e):(o.dispatch({selection:{anchor:p.openIdx+2+ue.length}}),o.focus());return}const m=s.open.from+1+s.name.length,b=e.standalone||`{{ ${ue} ${e.attr} }}`,{text:k,cursor:O}=be(b);o.dispatch({changes:{from:m,to:m,insert:` ${k}`},selection:{anchor:m+1+O}}),P();return}const r=o.state.selection.main.head,i=o.state.doc.lineAt(r),l=i.text.trim()?it(i.text):ze(o,i)||it(i.text),c=e.standalone||`{{ ${ue} ${e.attr} }}`,{text:d,cursor:f}=be(c);Zt(Ao(d,l),f),P()}function ju(t){return t==="css"?za():t==="js"?Ra():ja({autoCloseTags:!0})}function qn(t){if(t._sveShield)return;t._sveShield=!0;const e=o=>o.stopPropagation();for(const o of["keydown","keypress","keyup","pointerdown","pointerup","mousedown","mouseup","click","focusin"])t.addEventListener(o,e)}function zu(t){try{return new URLSearchParams(t.defaultView?.location?.search||"").has("sve-panel")}catch{return!1}}function Ru(t){const e=parseInt(Y(t,Va)??"",10);return Number.isFinite(e)&&e>=Ya?e:rf}function Nu(t,e){N(t,Va,String(e))}function ka(t){try{const e=JSON.parse(Y(t,Ua)||"null");if(e&&typeof e=="object")return{html:e.html!==!1,css:e.css!==!1,js:e.js===!0,alpine:e.alpine===!0}}catch{}return{html:!0,css:!0,js:!1,alpine:!1}}function qu(t,e){N(t,Ua,JSON.stringify(e))}function xa(t){try{const e=JSON.parse(Y(t,Ka)||"null");if(e&&typeof e=="object"){const o=s=>Number.isFinite(s)&&s>0?s:1,n={};for(const s of St)n[s]=o(e[s]);return n}}catch{}return Object.fromEntries(St.map(e=>[e,1]))}function Vu(t,e){N(t,Ka,JSON.stringify(e))}function Uu(t){mr(t,af,`
@keyframes sve-cm-wait { to { transform: rotate(360deg); } }
#${u} {
  /* The tree's seven families, for the marks and the toolbar below. */
  ${Ar("dark")}
  position: fixed;
  /* Same band as the right dock: above the page, under Statamic stacks. */
  z-index: var(--z-index-above, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #1E1E21;
  color: #d4d4d4;
  border-top: 1px solid rgba(255,255,255,.12);
  /* No shadow: the sidebars sit flat against the page and this is the same
     kind of panel. The border is what marks the edge. */
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${u} [data-sve-code-bar] {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255,255,255,.08);
  user-select: none;
  cursor: ns-resize;
}
#${u} [data-sve-code-pane-btn] {
  all: unset;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .02em;
  opacity: .55;
}
#${u} [data-sve-code-pane-btn][aria-pressed="true"] {
  background: rgba(255,255,255,.12);
  opacity: 1;
}
#${u} [data-sve-code-path] {
  font-size: 11px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  opacity: .4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  margin-left: 4px;
}
#${u} [data-sve-code-back] {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin-left: 8px;
  border-radius: 6px;
  color: #d4d4d4;
  opacity: .7;
}
#${u} [data-sve-code-back]:hover {
  opacity: 1;
  background: rgba(255,255,255,.1);
}
#${u} [data-sve-code-back][hidden] {
  display: none;
}
#${u} [data-sve-code-status] {
  margin-left: auto;
  font-size: 11px;
  opacity: .7;
  flex: 0 0 auto;
}
#${u} [data-sve-code-lock] {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin-left: 4px;
  border-radius: 6px;
  color: #d4d4d4;
  opacity: .8;
  background: rgba(255,255,255,.1);
}
#${u} [data-sve-code-lock]:hover {
  opacity: 1;
  background: rgba(255,255,255,.16);
}
#${u} [data-sve-code-lock][aria-pressed="true"] {
  opacity: 1;
  color: #fbbf24;
  background: rgba(251,191,36,.12);
}
#${u} [data-sve-code-lock][hidden] {
  display: none;
}
#${u} [data-sve-html-scope] {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin-left: 4px;
  border-radius: 6px;
  color: #d4d4d4;
  opacity: .8;
  background: rgba(255,255,255,.1);
}
#${u} [data-sve-html-scope]:hover {
  opacity: 1;
  background: rgba(255,255,255,.16);
}
#${u} [data-sve-html-scope][aria-pressed="true"] {
  opacity: 1;
  color: #93c5fd;
  background: rgba(56,88,233,.22);
}
#${u} [data-sve-code-strip],
#${u} [data-sve-code-history] {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin-left: 4px;
  border-radius: 6px;
  color: #d4d4d4;
  opacity: .8;
  background: rgba(255,255,255,.1);
}
#${u} [data-sve-code-strip]:hover,
#${u} [data-sve-code-history]:hover,
#${u} [data-sve-code-history][data-open] {
  opacity: 1;
  background: rgba(255,255,255,.16);
}
#${u} [data-sve-code-strip][aria-pressed="true"] {
  opacity: 1;
  color: #7dd3fc;
  background: rgba(56,189,248,.16);
}
#${u}[data-sve-style="tw"] [data-sve-values-mode],
#${u}[data-sve-style="tw"] [data-sve-css-all],
#${u}[data-sve-code-locked] [data-sve-values-mode],
#${u}[data-sve-code-locked] [data-sve-css-all] {
  display: none;
}
#${u} [data-sve-values-mode],
#${u} [data-sve-css-all],
#${u} [data-sve-style-mode] {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 8px;
  margin-left: 4px;
  border-radius: 6px;
  color: #d4d4d4;
  opacity: .8;
  background: rgba(255,255,255,.1);
  font-size: 11px;
  white-space: nowrap;
}
#${u} [data-sve-values-mode]:hover,
#${u} [data-sve-css-all]:hover,
#${u} [data-sve-style-mode]:hover {
  opacity: 1;
  background: rgba(255,255,255,.16);
}
#${u} [data-sve-values-mode][aria-pressed="true"],
#${u} [data-sve-css-all][aria-pressed="true"],
#${u} [data-sve-style-mode][aria-pressed="true"] {
  opacity: 1;
  color: #7dd3fc;
  background: rgba(56,189,248,.16);
}
/* The CSS pane holds two things and shows one: the editor, or the chips. */
#${u} [data-sve-tw-host] {
  display: none;
}
/* The head row belongs to the editor, so it goes with it: in Tailwind mode the
   chips draw their own, and two rows asking the same question is one too many. */
/* The Alpine pane has no editor to fill it, so its panel does. */
#${u} [data-sve-alpine-host] {
  flex: 1 1 0;
  min-height: 0;
  min-width: 0;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
}
#${u} [data-sve-css-head] {
  flex: 0 0 auto;
}
#${u}[data-sve-style="tw"] [data-sve-css-head] {
  display: none;
}
/* Locked: dimmed, not gone. The Tailwind row does the same, and a row that
   disappears reads as broken — a row that is greyed out reads as locked. */
#${u}[data-sve-code-locked] [data-sve-css-head] {
  opacity: .5;
}
#${u}[data-sve-style="tw"] [data-sve-code-pane="css"] [data-sve-code-host] {
  display: none;
}
#${u}[data-sve-style="tw"] [data-sve-tw-host] {
  display: block;
  flex: 1 1 0;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
}
#${u} [data-sve-code-autosave],
#${u} [data-sve-code-save] {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin-left: 4px;
  border-radius: 6px;
  color: #d4d4d4;
  opacity: .8;
  background: rgba(255,255,255,.1);
}
#${u} [data-sve-code-autosave]:hover,
#${u} [data-sve-code-save]:hover {
  opacity: 1;
  background: rgba(255,255,255,.16);
}
#${u} [data-sve-code-autosave][aria-pressed="true"] {
  opacity: 1;
  color: #93c5fd;
  background: rgba(56,88,233,.22);
}
#${u} [data-sve-code-save][data-dirty] {
  opacity: 1;
  color: #93c5fd;
  background: rgba(56,88,233,.22);
}
#${u} [data-sve-code-save][hidden] {
  display: none;
}
#${u}[data-sve-code-locked] [data-sve-code-autosave],
#${u}[data-sve-code-locked] [data-sve-style-mode],
#${u}[data-sve-code-locked] [data-sve-code-history],
#${u}[data-sve-code-locked] [data-sve-code-strip],
#${u}[data-sve-code-locked] [data-sve-code-save] {
  pointer-events: none;
  opacity: .28;
}
#${u}[data-sve-code-locked] [data-sve-css-tools],
#${u}[data-sve-code-locked] [data-sve-html-tools],
#${u}[data-sve-code-locked] [data-sve-html-tidy],
#${u}[data-sve-code-locked] [data-sve-data-vars],
#${u}[data-sve-code-locked] [data-sve-antlers-tools],
#${u}[data-sve-code-locked] [data-sve-visual-edit-tools],
#${u}[data-sve-code-locked] [data-sve-css-add-class] {
  pointer-events: none;
  opacity: .28;
}
/* Plain CSS with no name in [ ]: the property tools have no rule to write to.
   Add class stays live — it is the way to give them one. */
#${u}[data-sve-css-unnamed] [data-sve-css-tools] {
  pointer-events: none;
  opacity: .28;
}
#${u}[data-sve-code-locked] [data-sve-code-pane] .cm-editor,
#${u}[data-sve-code-locked] [data-sve-tw-host] {
  opacity: .62;
}
#${u} [data-sve-code-lock-banner] {
  display: none;
  flex: 0 0 auto;
  padding: 6px 12px;
  font-size: 11px;
  line-height: 1.4;
  color: #fbbf24;
  background: rgba(251,191,36,.08);
  border-bottom: 1px solid rgba(251,191,36,.18);
}
#${u}[data-sve-code-locked] [data-sve-code-lock-banner] {
  display: block;
}
#${U} {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,.5);
}
#${U} [data-sve-unlock-card] {
  width: min(420px, calc(100vw - 32px));
  padding: 20px;
  border-radius: 12px;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 16px 40px rgba(0,0,0,.45);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${U} [data-sve-unlock-title] {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
}
#${U} [data-sve-unlock-body] {
  font-size: 13px;
  line-height: 1.45;
  opacity: .75;
  margin-bottom: 18px;
}
#${U} [data-sve-unlock-actions] {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
#${U} [data-sve-unlock-actions] button {
  all: unset;
  cursor: pointer;
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}
#${U} [data-sve-unlock-cancel] {
  background: rgba(255,255,255,.1);
  color: #d4d4d4;
}
#${U} [data-sve-unlock-confirm] {
  background: #b45309;
  color: #fff;
}
#${u} [data-sve-code-grip] {
  flex: 0 0 16px;
  height: 16px;
  width: 100%;
  cursor: ns-resize;
  z-index: 3;
  ${dn("ns")}
  background-color: var(--theme-color-gray-800, #27272a);
}
#${u} .sve-code-dock {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}
#${u} [data-sve-code-panes] {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  overflow: hidden;
}
#${u} [data-sve-code-pane] {
  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
#${u} [data-sve-code-pane-label] {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 8px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .08em;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(255,255,255,.06);
  user-select: none;
  pointer-events: none;
  position: relative;
  z-index: 2;
  overflow: visible;
  min-width: 0;
}
#${u} [data-sve-code-pane-label] > span {
  opacity: .38;
}
#${u} [data-sve-css-add-class] {
  all: unset;
  pointer-events: auto;
  box-sizing: border-box;
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: rgba(255,255,255,.1);
  color: #d4d4d4;
  cursor: pointer;
  opacity: .75;
  flex: none;
}
#${u} [data-sve-css-add-class]:hover,
#${u} [data-sve-css-add-class][data-open] {
  background: rgba(255,255,255,.16);
  opacity: 1;
}
#${u} [data-sve-css-tools],
#${u} [data-sve-html-tools] {
  pointer-events: auto;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 2px;
  min-width: 0;
  overflow-x: auto;
  /* Scrolls like the Tailwind row, and without a bar across the buttons. */
  scrollbar-width: none;
}
#${u} [data-sve-html-tools]::-webkit-scrollbar {
  display: none;
}
#${u} [data-sve-html-tools] {
  flex: 1 1 auto;
}
#${u} [data-sve-antlers-tools],
#${u} [data-sve-visual-edit-tools] {
  pointer-events: auto;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
}
#${u} [data-sve-css-chrome] {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
/**
 * Air between the tools themselves, not between a tool's children.
 *
 * A separate rule so the HTML pane's own row, which shares the one above,
 * keeps the spacing it has. The children sit in their own containers inside
 * the pill and keep their 1px.
 */
#${u} [data-sve-css-tools] {
  gap: 3px;
  scrollbar-width: none;
}
#${u} [data-sve-css-tools]::-webkit-scrollbar {
  display: none;
}

/**
 * A tool is one item, and its children live inside that item.
 *
 * The surface belongs to the item, so it wraps the icon and whatever it opens
 * without a single offset: everything stays in flow, nothing is drawn over
 * anything, and opening a group only makes its own item wider.
 */
#${u} [data-sve-css-item] {
  list-style: none;
  display: inline-flex;
  align-items: center;
  /* Same radius as the button's own highlight, so the shape around the icon
     is identical open and closed. */
  border-radius: 4px;
}
/* Only to the right: nothing may move the icon when the group opens. */
#${u} [data-sve-css-item][data-sve-css-open] {
  background: rgba(255,255,255,.12);
}
#${u} [data-sve-css-item][data-sve-css-open] > [data-sve-css-tool][data-open] {
  background: transparent;
}
#${u} [data-sve-css-kids]::before {
  content: '';
  flex: 0 0 auto;
  width: 1px;
  height: 12px;
  margin: 0 6px 0 4px;
  background: rgba(255,255,255,.16);
}
/* A tool's children, inside the tool's own list item — so they open beside the
   icon they belong to, in its highlight, never somewhere else on the row. */
/* A size block that is in the editor but not in the file. Faded says what a
   dialog would have to explain: nothing here is saved until you write in it. */
#${u} .sve-css-ghost {
  opacity: .32;
}
/* The section's own layer, while it is showing. Same blue the ID button lights
   up in, so the button and the rule it opened are plainly the same thing.

   Loud on purpose. At a tenth of an alpha it was technically drawn and
   practically invisible: two dim lines at the top of a file you were not
   looking at, which is indistinguishable from the button doing nothing. */
#${u} .cm-line.sve-css-id {
  background: rgba(56,189,248,.16);
  box-shadow: inset 3px 0 0 #38bdf8;
}
/* An empty ID rule is still unsaved, and still dropped on the way to disk —
   but it is not faded while the ID is open. It is the one rule the button just
   asked you to write in; drawing it at a third of its strength was telling you
   to type somewhere you could barely see. */
#${u}[data-sve-values="on"] .cm-line.sve-css-id .sve-css-ghost {
  opacity: 1;
}
#${u} [data-sve-css-kids] {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 2px;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}
#${u} [data-sve-css-kids]::-webkit-scrollbar {
  display: none;
}
/**
 * A row with more behind an edge fades out at that edge.
 *
 * The rows scroll without a bar, so the fade is the only sign that there are
 * buttons past the edge. scroll-edges.js measures which edges have more and
 * writes data-sve-scroll-edge; a row that fits carries nothing and is drawn
 * whole. A mask, not an overlay: the row's own buttons fade into whatever is
 * behind them, and nothing sits on top of them to catch a click.
 */
#${u} [data-sve-scroll-edge="right"] {
  -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 2.75em), transparent);
  mask-image: linear-gradient(to right, #000 calc(100% - 2.75em), transparent);
}
#${u} [data-sve-scroll-edge="left"] {
  -webkit-mask-image: linear-gradient(to right, transparent, #000 2.75em);
  mask-image: linear-gradient(to right, transparent, #000 2.75em);
}
#${u} [data-sve-scroll-edge="both"] {
  -webkit-mask-image: linear-gradient(to right, transparent, #000 2.75em, #000 calc(100% - 2.75em), transparent);
  mask-image: linear-gradient(to right, transparent, #000 2.75em, #000 calc(100% - 2.75em), transparent);
}
#${u} [data-sve-css-sep] {
  width: 1px;
  height: 12px;
  margin: 0 4px;
  background: rgba(255,255,255,.16);
  flex: 0 0 auto;
}
#${u} [data-sve-css-tool],
#${u} [data-sve-css-box-side],
#${u} [data-sve-html-tool] {
  all: unset;
  cursor: pointer;
  position: relative;
  /* Every button keeps its size and the row scrolls instead. Left to shrink,
     the last few squeezed themselves into slivers rather than admitting there
     was no room — and squeezed icons read as missing ones. */
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #d4d4d4;
  opacity: .7;
}
#${u} [data-sve-css-tool]:hover,
#${u} [data-sve-css-tool][data-open],
#${u} [data-sve-css-tool][data-active],
#${u} [data-sve-html-tool]:hover,
#${u} [data-sve-html-tool][data-open],
#${u} [data-sve-html-tool][data-active] {
  background: rgba(255,255,255,.12);
  opacity: 1;
}
#${u} [data-sve-css-box-side]:hover,
#${u} [data-sve-css-box-side][data-open],
#${u} [data-sve-css-box-side][data-active],
#${u} [data-sve-css-kids] [data-sve-css-kid]:hover,
#${u} [data-sve-css-kids] [data-sve-css-kid][data-active] {
  background: transparent;
  opacity: 1;
}
/* The hover label lives on the body — see bindTips. A row that scrolls
   would clip anything drawn inside it. */
#${u} [data-sve-html-tool][data-letter] {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: none;
  font-family: ui-sans-serif, system-ui, sans-serif;
}
/* The last three buttons write Antlers, not a tag: a component call, a loop,
   a condition. They decide what renders and how often, which is a different
   kind of thing from adding a paragraph - so they carry a colour and read as
   a group at the end of the row rather than as three more tags. Each keeps
   its own hover, or a marked button would look dead under the pointer.
   No backticks in here: this whole sheet is a template literal. */
#${u} [data-sve-html-tool="component"] {
  color: var(--sve-fam-component);
  background: color-mix(in srgb, var(--sve-fam-component) 13%, transparent);
  opacity: 1;
}
#${u} [data-sve-html-tool="component"]:hover,
#${u} [data-sve-html-tool="component"][data-open] {
  background: color-mix(in srgb, var(--sve-fam-component) 26%, transparent);
}
#${u} [data-sve-html-tool="loop"] {
  color: var(--sve-fam-loop);
  background: color-mix(in srgb, var(--sve-fam-loop) 15%, transparent);
  opacity: 1;
}
#${u} [data-sve-html-tool="loop"]:hover,
#${u} [data-sve-html-tool="loop"][data-open] {
  background: color-mix(in srgb, var(--sve-fam-loop) 28%, transparent);
}
/* Pages belong to a loop, so they wear its colour. Lit while the loop the
   caret is in already pages. Only there at all while the caret is in a
   collection loop (data-in-loop, set by paintHtmlToolState) - hidden until
   then, so a dock that has not painted yet shows no button it cannot use. */
#${u} [data-sve-html-tool="pagination"] {
  color: var(--sve-fam-loop);
  background: color-mix(in srgb, var(--sve-fam-loop) 15%, transparent);
  opacity: 1;
}
#${u} [data-sve-html-tool="pagination"]:not([data-in-loop]) {
  display: none;
}
#${u} [data-sve-html-tool="pagination"]:hover,
#${u} [data-sve-html-tool="pagination"][data-active] {
  background: color-mix(in srgb, var(--sve-fam-loop) 28%, transparent);
}
#${u} [data-sve-html-tool="if"] {
  color: var(--sve-fam-if);
  background: color-mix(in srgb, var(--sve-fam-if) 13%, transparent);
  opacity: 1;
}
#${u} [data-sve-html-tool="if"]:hover,
#${u} [data-sve-html-tool="if"][data-open] {
  background: color-mix(in srgb, var(--sve-fam-if) 26%, transparent);
}
#${y} {
  position: fixed;
  z-index: 60;
  min-width: 168px;
  max-width: 268px;
  max-height: 22rem;
  overflow: auto;
  padding: 8px;
  border-radius: 8px;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 8px 24px rgba(0,0,0,.4);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${Lt} {
  position: fixed;
  z-index: 60;
  width: 23rem;
}
[data-sve-data-menu] {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  max-width: calc(100vw - 1.5rem);
  max-height: 24rem;
  /* The search and the tabs stay put; only the rows under them scroll. */
  overflow: hidden;
  padding: 0.5rem;
  border-radius: 0.5em;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 0.5em 1.5em rgba(0,0,0,.4);
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 0.75rem;
}
[data-sve-data-menu] [data-sve-data-search] {
  display: flex;
  align-items: center;
  gap: 0.5em;
  box-sizing: border-box;
  height: 2.2rem;
  padding: 0 0.6em;
  margin-bottom: 0.45rem;
  border-radius: 0.45em;
  border: 1px solid rgba(255,255,255,.18);
  background: rgba(0,0,0,.28);
}
[data-sve-data-menu] [data-sve-data-search]:focus-within {
  border-color: rgba(147,197,253,.7);
}
[data-sve-data-menu] [data-sve-data-search] svg {
  flex: 0 0 auto;
  opacity: .5;
}
[data-sve-data-menu] [data-sve-data-input] {
  all: unset;
  flex: 1 1 auto;
  min-width: 0;
  color: inherit;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.75rem;
}
[data-sve-data-menu] [data-sve-data-rows] {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}
/* The search and the tabs keep their height however long the list is. */
[data-sve-data-menu] [data-sve-data-search],
[data-sve-data-menu] [data-sve-data-tabs] {
  flex: 0 0 auto;
}
[data-sve-data-menu] [data-sve-data-tabs] {
  display: flex;
  gap: 0.2rem;
  margin-bottom: 0.45rem;
  padding: 0.15rem;
  border-radius: 0.45em;
  background: rgba(0,0,0,.28);
}
[data-sve-data-menu] [data-sve-data-tab] {
  all: unset;
  flex: 1 1 0;
  box-sizing: border-box;
  padding: 0.35em 0;
  border-radius: 0.35em;
  cursor: pointer;
  text-align: center;
  font-size: 0.6875rem;
  opacity: .65;
}
[data-sve-data-menu] [data-sve-data-tab]:hover { opacity: 1; }
[data-sve-data-menu] [data-sve-data-tab][data-active] {
  opacity: 1;
  background: rgba(255,255,255,.14);
}
[data-sve-data-menu] [data-sve-data-group] {
  padding: 0.6em 0.5em 0.25em;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  opacity: .45;
}
[data-sve-data-menu] [data-sve-data-option] {
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: baseline;
  gap: 0.5em;
  width: 100%;
  padding: 0.35em 0.5em;
  border-radius: 0.35em;
  cursor: pointer;
}
[data-sve-data-menu] [data-sve-data-option]:hover,
[data-sve-data-menu] [data-sve-data-option][data-cursor] {
  background: rgba(255,255,255,.1);
}
[data-sve-data-menu] [data-sve-data-name] {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
[data-sve-data-menu] [data-sve-data-parent] {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.625rem;
  opacity: .4;
}
[data-sve-data-menu] [data-sve-data-value] {
  flex: 0 1 auto;
  margin-left: auto;
  max-width: 45%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
  font-size: 0.6875rem;
  opacity: .5;
}
[data-sve-data-menu] [data-sve-data-loop] {
  flex: 0 0 auto;
  margin-left: auto;
  padding: 0.1em 0.45em;
  border-radius: 0.3em;
  background: rgba(255,255,255,.1);
  font-size: 0.5625rem;
  letter-spacing: .04em;
  text-transform: uppercase;
  opacity: .6;
}
[data-sve-data-menu] [data-sve-data-empty] {
  padding: 0.5em;
  opacity: .55;
}
#${u} [data-sve-data-vars],
#${u} [data-sve-antlers-btn],
#${u} [data-sve-visual-edit-btn],
#${u} [data-sve-html-tidy] {
  pointer-events: auto;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 1.65em;
  height: 1.65em;
  margin-right: 0.35em;
  padding: 0;
  border: 0;
  border-radius: 0.3em;
  background: transparent;
  color: #d4d4d4;
  opacity: .62;
  cursor: pointer;
}
/* The Antlers mark is wide; the button grows with it rather than cropping it. */
#${u} [data-sve-antlers-btn] {
  width: auto;
  min-width: 1.65em;
  padding: 0 0.3em;
}
#${u} [data-sve-data-vars] span,
#${u} [data-sve-antlers-btn] span,
#${u} [data-sve-visual-edit-btn] span,
#${u} [data-sve-html-tidy] svg {
  display: flex;
  line-height: 1;
}
#${u} [data-sve-data-vars]:hover,
#${u} [data-sve-data-vars][data-open],
#${u} [data-sve-antlers-btn]:hover,
#${u} [data-sve-antlers-btn][data-open],
#${u} [data-sve-visual-edit-btn]:hover,
#${u} [data-sve-visual-edit-btn][data-open],
#${u} [data-sve-html-tidy]:hover {
  background: rgba(255,255,255,.16);
  opacity: 1;
}
#${y} [data-sve-css-swatches] {
  display: grid;
  grid-template-columns: repeat(8, 16px);
  gap: 4px;
}
#${y} [data-sve-css-swatch] {
  all: unset;
  cursor: pointer;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  box-sizing: border-box;
  border: 1px solid rgba(255,255,255,.2);
}
#${y} [data-sve-css-swatch]:hover,
#${y} [data-sve-css-clear]:hover {
  outline: 1px solid #fff;
  outline-offset: 1px;
}
#${y} [data-sve-css-clear] {
  all: unset;
  cursor: pointer;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  box-sizing: border-box;
  border: 1px solid rgba(255,255,255,.35);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #d4d4d4;
  background: repeating-conic-gradient(#3f3f3f 0% 25%, #2a2a2a 0% 50%) 50% / 8px 8px;
}
#${y} [data-sve-css-choice] {
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: baseline;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
#${y} [data-sve-css-choice-label] {
  flex: 1 1 auto;
  min-width: 0;
}
/* What the row actually writes, in the corner of the row that writes it. Dim,
   because it is the answer to a second question, not the first. */
#${y} [data-sve-css-choice-hint] {
  flex: 0 0 auto;
  opacity: .45;
  font-size: 10px;
}
#${y} [data-sve-css-head-row] {
  display: block;
  padding: 8px 8px 3px;
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  opacity: .55;
}
#${y} [data-sve-css-head-row]:first-child {
  padding-top: 2px;
}
#${y} [data-sve-css-note-row] {
  display: block;
  padding: 6px 8px 2px;
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 10px;
  line-height: 1.45;
  opacity: .5;
}
#${y} [data-sve-css-choice]:hover,
#${y} [data-sve-css-swatch][data-active],
#${y} [data-sve-css-choice][data-active] {
  outline: 1px solid #fff;
  outline-offset: 1px;
  background: rgba(255,255,255,.1);
}
#${y} [data-sve-css-add-label] {
  display: block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  opacity: .55;
  margin-bottom: 6px;
}
#${y} [data-sve-css-add-input] {
  box-sizing: border-box;
  width: 100%;
  height: 28px;
  padding: 0 8px;
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 4px;
  background: #1E1E21;
  color: #d4d4d4;
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
/* The "+" menu's search: the site's classes to pick from, a red word when the
   typed name is taken, and the one button that makes a new one. */
#${y} [data-sve-css-add-hint] {
  margin-top: 6px;
  font-size: 11px;
  color: #fca5a5;
}
#${y} [data-sve-css-add-existing] {
  margin: 10px 0 4px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  opacity: .55;
}
#${y} [data-sve-css-add-list] {
  display: flex;
  flex-direction: column;
  gap: 1px;
  max-height: 14em;
  overflow-y: auto;
  margin: 0 -4px;
}
#${y} [data-sve-css-add-option] {
  all: unset;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 6px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
#${y} [data-sve-css-add-option]:hover,
#${y} [data-sve-css-add-option]:focus-visible {
  background: rgba(255,255,255,.1);
}
#${y} [data-sve-css-add-detail] {
  font-size: 10px;
  opacity: .5;
  font-family: ui-sans-serif, system-ui, sans-serif;
  white-space: nowrap;
}
#${y} [data-sve-css-add-none] {
  padding: 4px 6px;
  opacity: .4;
}
#${y} [data-sve-css-add-create] {
  all: unset;
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin-top: 8px;
  padding: 6px 8px;
  border-radius: 4px;
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  background: #3858e9;
  cursor: pointer;
}
#${y} [data-sve-css-add-create]:hover { background: #4a68ee; }
#${y} [data-sve-css-add-create][disabled] { opacity: .35; cursor: default; }
#${u} [data-sve-code-split] {
  flex: 0 0 16px;
  cursor: col-resize;
  ${dn("ew")}
  background-color: var(--theme-color-gray-800, #27272a);
  position: relative;
  z-index: 1;
}
#${u} [data-sve-code-split]:hover,
#${u} [data-sve-code-split][data-active] {
  filter: brightness(1.15);
}
#${u} [data-sve-code-pane] .cm-editor {
  height: auto !important;
  min-height: 0;
  overflow: visible;
}
#${u} [data-sve-code-pane] .cm-scroller {
  overflow: visible !important;
  height: auto !important;
  min-height: 0 !important;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
#${u} [data-sve-code-host] {
  flex: 1 1 0;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,.35) transparent;
}
#${u} [data-sve-code-host]::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
#${u} [data-sve-code-host]::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,.28);
  border-radius: 6px;
}
/* A bracket name the site already defines elsewhere: red, the file in the title. */
#${u} .sve-cm-class-taken {
  color: #fca5a5;
  text-decoration: underline wavy rgba(248,113,113,.9);
  text-underline-offset: .18em;
  cursor: help;
}
#${u} .sve-cm-css-token {
  background: rgba(215,186,125,.22);
  border-radius: 2px;
}
#${et} {
  all: unset;
  position: fixed;
  z-index: 90;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background: #3c3c3c;
  color: #d7ba7d;
  border: 1px solid rgba(255,255,255,.16);
  box-shadow: 0 2px 8px rgba(0,0,0,.35);
  cursor: pointer;
}
#${et}:hover {
  background: #4a4a4a;
}
/* The tree's families, in the code (antlers-highlight.js marks them; the
   colours are the one table in lib/tag-families.js, set on the dock as
   variables below). A tag name wears its family; an Antlers value keeps the
   one Antlers colour; what closes a block is held back, so an opening line
   and its closing line do not read as the same thing. */
#${u} .sve-cm-antlers {
  color: #b9a6ff;
}
/* The span inside as well: CodeMirror wraps a tag name in its own highlight
   span, drawn INSIDE the family mark and carrying its own colour — measured
   in the browser, a section sat blue on the outside and teal on the text.
   An Antlers tag has no inner span; the second selector is for the names. */
#${u} .sve-cm-fam-layout, #${u} .sve-cm-fam-layout span { color: var(--sve-fam-layout); }
#${u} .sve-cm-fam-text, #${u} .sve-cm-fam-text span { color: var(--sve-fam-text); }
#${u} .sve-cm-fam-media, #${u} .sve-cm-fam-media span { color: var(--sve-fam-media); }
#${u} .sve-cm-fam-loop, #${u} .sve-cm-fam-loop span { color: var(--sve-fam-loop); }
#${u} .sve-cm-fam-if, #${u} .sve-cm-fam-if span { color: var(--sve-fam-if); }
#${u} .sve-cm-fam-component, #${u} .sve-cm-fam-component span { color: var(--sve-fam-component); }
#${u} .sve-cm-fam-other, #${u} .sve-cm-fam-other span { color: var(--sve-fam-other); }
#${u} .sve-cm-antlers-close {
  opacity: .72;
}
#${u} .sve-cm-antlers-comment {
  color: #6b8f6b;
  font-style: italic;
}
/* Where the file is broken (template-lint.js finds it, dock/problems.js
   paints it): the range wears a wavy line in the editor, and the strip under
   the tool row says it in words. The strip is hidden while there is nothing
   to say, so a file that is fine looks as it always did. */
#${u} .sve-cm-problem {
  text-decoration: underline wavy #f0716b;
  text-decoration-skip-ink: none;
  text-underline-offset: 3px;
  background: rgba(240, 113, 107, .10);
}
#${u} [data-sve-html-problems] {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px 8px;
  padding: 4px 10px;
  font-size: 11px;
  line-height: 1.4;
  color: #f5c2bf;
  background: rgba(240, 113, 107, .10);
  border-bottom: 1px solid rgba(240, 113, 107, .25);
}
#${u} [data-sve-html-problems][hidden] {
  display: none;
}
#${u} [data-sve-html-problems] [data-sve-problems-title] {
  flex: 0 0 auto;
  font-weight: 600;
  color: #f0716b;
}
#${u} [data-sve-html-problems] button {
  all: unset;
  cursor: pointer;
  padding: 1px 6px;
  border-radius: 4px;
  color: inherit;
  font: inherit;
  white-space: nowrap;
}
#${u} [data-sve-html-problems] button:hover {
  background: rgba(255, 255, 255, .12);
}
#${u} [data-sve-html-problems] button b {
  font-weight: 600;
  opacity: .8;
}
#${u} .sve-cm-partial {
  text-decoration: underline dotted;
  text-underline-offset: 3px;
  background: color-mix(in srgb, var(--sve-fam-component) 16%, transparent);
  /* Text, because the left button writes here now. The underline still says
     there is a file behind it; the right button is what opens it. */
  cursor: text;
}
#${u} .sve-cm-partial-line {
  background: color-mix(in srgb, var(--sve-fam-component) 10%, transparent);
}
#${u}[data-sve-code-locked] .sve-cm-partial {
  text-decoration: none;
  background: transparent;
  cursor: default;
  pointer-events: none;
}
#${u}[data-sve-code-locked] .sve-cm-partial-line {
  background: transparent;
}
#${de} {
  position: fixed;
  z-index: 90;
  min-width: 168px;
  max-width: 280px;
  max-height: 240px;
  overflow: auto;
  padding: 6px;
  border-radius: 8px;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 8px 24px rgba(0,0,0,.4);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${de} [data-sve-partial-choice] {
  all: unset;
  cursor: pointer;
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 13px;
  /* A sentence now — "Open image" — not a file name, and the same face the
     HTML tree's row menu uses. */
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${de} [data-sve-partial-choice]:hover {
  background: rgba(255,255,255,.1);
}
#${de} [data-sve-partial-empty] {
  padding: 6px 8px;
  font-size: 12px;
  opacity: .55;
}
.sve-tw-info {
  font: 11px/1.4 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  padding: 6px 8px;
  max-width: 320px;
  color: #d4d4d4;
}
.sve-tw-info pre {
  margin: 0;
  white-space: pre-wrap;
  font: inherit;
}
.sve-tw-swatch {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  border: 1px solid rgba(255,255,255,.25);
  margin: 0 6px 4px 0;
  vertical-align: middle;
}
.cm-tooltip.sve-tw-complete {
  background: #1E1E21 !important;
  color: #d4d4d4;
  border: 1px solid #454545 !important;
  border-radius: 4px;
  box-shadow: 0 4px 16px rgba(0,0,0,.45);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
  font-size: 12px !important;
  line-height: 18px !important;
  padding: 0 !important;
  overflow: hidden;
}
.cm-tooltip.sve-tw-complete > ul {
  font: inherit !important;
  max-height: 240px;
  padding: 2px 0;
  margin: 0;
}
.cm-tooltip.sve-tw-complete > ul > li {
  padding: 1px 8px 1px 6px !important;
  line-height: 22px !important;
  font: inherit !important;
}
.cm-tooltip.sve-tw-complete > ul > li[aria-selected] {
  background: rgba(255,255,255,.1) !important;
}
.cm-tooltip.sve-tw-complete .cm-completionLabel {
  color: #9cdcfe;
  font-size: 12px !important;
}
.cm-tooltip.sve-tw-complete .cm-completionMatchedText {
  text-decoration: none;
  font-weight: 600;
}
.cm-tooltip.sve-tw-complete .cm-completionDetail {
  display: none;
  color: #808080 !important;
  font-size: 11px !important;
  font-style: normal !important;
  margin-left: 16px;
}
.cm-tooltip.sve-tw-complete > ul > li[aria-selected] .cm-completionDetail {
  display: inline;
}
.cm-tooltip.sve-tw-complete .cm-completionIcon {
  width: 14px;
  height: 14px;
  opacity: .65;
  font-size: 11px !important;
  margin-right: 6px;
}
#${u} .emmet-tracker {
  text-decoration: underline 1px #4ade80;
}
`)}function Ku(t){const e=t.querySelector(".live-preview-editor");if(!e)return 0;const o=e.getBoundingClientRect();return o.width<40||o.right<40?0:Math.round(o.right)}function Gu(t){let e=0;for(const o of["__sve-section-picker","__sve-outline-panel","__sve-html-tree-panel","__sve-listview-panel","__sve-right-dock","__sve-chrome-designs","__sve-global-section-panel","__sve-ai-panel"]){const n=t.getElementById(o);if(!n||n.hasAttribute("data-sve-chrome-hidden")||n.hasAttribute("data-sve-right-closed")||n.style.display==="none")continue;const s=n.getBoundingClientRect();s.width>40&&s.right>t.documentElement.clientWidth-8&&(e=Math.max(e,Math.round(s.width)))}return e}function Jo(t){const e=t.document;if(a.layoutWin=t,typeof t.ResizeObserver!="function")return;a.layoutObserver||(a.layoutObserver=new t.ResizeObserver(()=>{a.layoutWin&&hu(a.layoutWin)}));const o=e.querySelector(".live-preview-editor"),n=e.getElementById("__sve-right-dock");o!==a.observedEditor&&(a.observedEditor&&a.layoutObserver.unobserve(a.observedEditor),a.observedEditor=o,o&&a.layoutObserver.observe(o)),n!==a.observedRight&&(a.observedRight&&a.layoutObserver.unobserve(a.observedRight),a.observedRight=n,n&&a.layoutObserver.observe(n))}function Xu(){a.layoutObserver?.disconnect(),a.layoutObserver=null,a.layoutWin=null,a.observedEditor=null,a.observedRight=null}function Yu(t){a.layoutWatchBound||(a.layoutWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>Jo(t)))}function Qo(t,e){const o=t.querySelector(".live-preview-contents");o&&(o.style.paddingBottom=e?`${e}px`:"")}function tn(t){if(!t)return;const e=t.clientHeight,o=t.querySelector("[data-sve-code-bar]"),n=t.querySelector("[data-sve-code-lock-banner]"),s=n&&Zu(t)?.getComputedStyle(n).display!=="none"?n.offsetHeight:0,r=Math.max(64,e-(o?.offsetHeight||0)-s),i=t.querySelector("[data-sve-code-panes]");i&&(i.style.height=`${r}px`,i.style.minHeight="0",i.style.overflow="hidden"),t.querySelectorAll("[data-sve-code-host]").forEach(l=>{const c=l.closest("[data-sve-code-pane]");if(!c||c.style.display==="none")return;let d=0;for(const p of c.children)p!==l&&(d+=p.offsetHeight);const f=Math.max(64,r-d);l.style.height=`${f}px`,l.style.maxHeight=`${f}px`,l.style.minHeight="0",l.style.overflow="auto",Ju(l)})}function Zu(t){return t.ownerDocument?.defaultView||a.lastWin}function Ju(t){t._sveWheelBound||(t._sveWheelBound=!0,t.addEventListener("wheel",e=>{const o=t.scrollHeight-t.clientHeight,n=t.scrollWidth-t.clientWidth;let s=!1;if(e.deltaY&&o>0){const r=Math.min(o,Math.max(0,t.scrollTop+e.deltaY));r!==t.scrollTop&&(t.scrollTop=r,s=!0)}if(e.deltaX&&n>0){const r=Math.min(n,Math.max(0,t.scrollLeft+e.deltaX));r!==t.scrollLeft&&(t.scrollLeft=r,s=!0)}s&&(e.preventDefault(),e.stopPropagation())},{passive:!1}))}function _a(){const t=(a.layoutWin||a.lastWin)?.document?.getElementById(u);t&&tn(t);for(const e of st)v[e]?.requestMeasure()}function wa(t,e){const o=ka(t),n={};for(const s of St){const r=e.querySelector(`[data-sve-code-pane-btn="${s}"]`);n[s]=r?r.getAttribute("aria-pressed")==="true":o[s]}return n}function Sa(t,e){for(const n of St){const s=t.querySelector(`[data-sve-code-pane-btn="${n}"]`),r=t.querySelector(`[data-sve-code-pane="${n}"]`);s&&s.setAttribute("aria-pressed",e[n]?"true":"false"),r&&(r.style.display=e[n]?"flex":"none")}const o=St.filter(n=>e[n]);t.querySelectorAll("[data-sve-code-split]").forEach(n=>{const s=n.getAttribute("data-sve-code-split-after"),r=o.indexOf(s);n.style.display=r>=0&&r<o.length-1?"block":"none"}),$a(t.ownerDocument.defaultView,t),tn(t)}function $a(t,e){const o=xa(t);for(const n of St){const s=e.querySelector(`[data-sve-code-pane="${n}"]`);s&&(s.style.flex=`${o[n]} 1 0`)}}function Ft(t,e){if(a.dragging)return;const o=t.document;no(o,e);const n=Ru(t),s=Ku(o),r=Gu(o);e.style.left=`${s}px`,e.style.right=`${r}px`,e.style.bottom="0",e.style.height=`${n}px`,Qo(o,n),tn(e)}function Ca(t,e,o,n){a.dragging=!0,Mr(t,e,o,()=>{a.dragging=!1,n?.()},"data-sve-code-drag-shield")}function Qu(t,e){if(e._sveResizeBound)return;e._sveResizeBound=!0;const o=n=>{if(n.button!==0||n.target.closest('button, a, input, select, textarea, label, [role="button"], [contenteditable], .cm-editor'))return;n.preventDefault();const s=n.clientY,r=e.getBoundingClientRect().height;let i=r;Ca(t,"ns-resize",l=>{i=Math.min(Math.max(Ya,r+(s-l.clientY)),Math.round(t.innerHeight*.7)),e.style.height=`${i}px`,Qo(t.document,i),_a()},()=>{Nu(t,i),Ft(t,e),t.dispatchEvent(new Event("resize"))})};e.querySelector("[data-sve-code-bar]")?.addEventListener("mousedown",o),e.querySelector("[data-sve-code-grip]")?.addEventListener("mousedown",o)}function tf(t,e){e._sveSplitBound||(e._sveSplitBound=!0,e.querySelectorAll("[data-sve-code-split]").forEach(o=>{o.addEventListener("mousedown",n=>{if(n.button!==0)return;n.preventDefault(),n.stopPropagation();const s=o.getAttribute("data-sve-code-split-after"),r=St.filter(O=>wa(t,e)[O]),i=r.indexOf(s),l=r[i],c=r[i+1];if(!l||!c)return;const d=e.querySelector(`[data-sve-code-pane="${l}"]`),f=e.querySelector(`[data-sve-code-pane="${c}"]`),p=n.clientX,m=d.getBoundingClientRect().width,b=f.getBoundingClientRect().width,k=m+b;o.setAttribute("data-active",""),Ca(t,"col-resize",O=>{const er=O.clientX-p;let Ke=Math.max(oo,Math.min(k-oo,m+er)),nn=k-Ke;k<oo*2&&(Ke=m,nn=b);const Ge=xa(t);Ge[l]=Ke,Ge[c]=nn,Vu(t,Ge),$a(t,e),_a()},()=>{o.removeAttribute("data-active")})})}))}function ef(t,e){e._svePaneBound||(e._svePaneBound=!0,e.querySelectorAll("[data-sve-code-pane-btn]").forEach(o=>{o.addEventListener("click",n=>{n.stopPropagation();const s=o.getAttribute("data-sve-code-pane-btn"),r=wa(t,e),i={...r,[s]:!r[s]};!i.html&&!i.css&&!i.js&&(i[s]=!0),qu(t,i),Sa(e,i)})}))}function I(t,e){const o=t.getElementById(u)?.querySelector("[data-sve-code-status]");o&&(o.textContent=e||"")}function en(t,e){const o=t.getElementById(u)?.querySelector("[data-sve-code-path]");o&&(o.textContent=e||"",o.title=e||"")}function Bt(t){const e=t?.document?.getElementById(u)?.querySelector("[data-sve-code-back]");e&&(e.hidden=a.typeStack.length===0,e.title=h(t,"code_dock_back"),e.setAttribute("aria-label",e.title),e.innerHTML=uf)}function Vn(t,e){const o=e.querySelector("[data-sve-code-back]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Os(t)}))}let F,po,Ta,Aa,Ma,yt,te,dt,Wt,ut,Q,Ea,La,Fa,Ba,Pa,Ia,Oa,Da,Ha,Wa,Ce,ja,za,Ra,Na,ho,mo,qa,of,zt=null,C=null;function nf(){return zt||(zt=sr().then(t=>{C=t,F=C.view.EditorView,po=C.view.keymap,Ta=C.view.lineNumbers,Aa=C.view.highlightActiveLine,Ma=C.view.highlightActiveLineGutter,yt=C.state.Compartment,te=C.state.EditorState,dt=C.state.StateField,Wt=C.state.StateEffect,ut=C.state.RangeSetBuilder,Q=C.view.Decoration,Ea=C.commands.defaultKeymap,La=C.commands.indentWithTab,Fa=C.commands.historyKeymap,Ba=C.commands.history,Pa=C.autocomplete.autocompletion,Ia=C.autocomplete.closeBrackets,Oa=C.autocomplete.closeBracketsKeymap,Da=C.autocomplete.closeCompletion,Ha=C.autocomplete.completionKeymap,Wa=C.view.hoverTooltip,Ce=C.langHtml.htmlLanguage,ja=C.langHtml.html,za=C.langCss.css,Ra=C.langJs.javascript,C.language.HighlightStyle,C.language.syntaxHighlighting,Na=C.language.codeFolding,ho=C.language.foldEffect,mo=C.language.unfoldEffect,qa=C.language.foldedRanges,of=C.highlight.tags,Vt.html=new yt,Vt.css=new yt,Vt.js=new yt,Ut.html=new yt,Ut.css=new yt,Ut.js=new yt}).catch(t=>{throw zt=null,t}),zt)}const sf="{{ _class }}",u=or,af="__sve-code-dock-style",U="__sve-code-dock-unlock",Va="sve-code-dock-height",Ua="sve-code-dock-panes",Ka="sve-code-dock-widths",Ue="sve-html-scope-v2",Ga="sve-code-dock-autosave",Xa="sve-code-dock-style-mode",on="sve-code-dock-values",rf=280,Ya=120,oo=140,lf=250,st=["html","css","js"],St=["html","css","alpine","js"],cf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',df='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-1"/></svg>',uf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',Za='<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1c0 .966.784 1.75 1.75 1.75h.418A1.74 1.74 0 0 0 4 7.25v1.5c0 .49.201.932.525 1.25c-.324.318-.525.76-.525 1.25v1c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 14 12.25v-1c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1.5c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1A1.75 1.75 0 0 0 12.25 2zm8.5 7.5H8v-3h4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75M7 6.5v3H5.75A.75.75 0 0 1 5 8.75v-1.5a.75.75 0 0 1 .75-.75zm1 4h4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75H8zm-1 0V13H5.75a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-1-5V3h6.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75zm-1 0H3.75A.75.75 0 0 1 3 4.75v-1A.75.75 0 0 1 3.75 3H5z"/></svg>',ff='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/><path d="M4.5 11.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/></svg>',pf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 16.3A8.5 8.5 0 1 1 18.3 6.3"/><path d="M21 3.2v5.4h-5.4"/></svg>',hf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',mf='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',y="__sve-css-menu",Ja=["h1","h2","h3","h4","h5","h6"],vo=[{id:"section",title:"section",tag:"section"},{id:"div",title:"div",tag:"div"},{id:"heading",title:"heading",menu:"heading"},{id:"text",title:"text",menu:"text"},{id:"a",title:"link",tag:"a"},{id:"img",title:"image",snippet:'<img src="" alt="">',caret:10},{id:"video",title:"video",snippet:'<video src="" controls playsinline></video>',caret:12},{id:"ul",title:"list",tag:"ul"},{id:"li",title:"list item",tag:"li"},{id:"component",title:"component",menu:"component"},{id:"loop",title:"loop",snippet:`{{ items }}

{{ /items }}
`,caret:3,select:5},{id:"pagination",title:"pagination",action:"pagination"},{id:"if",title:"if",snippet:`{{ if true }}

{{ /if }}
`,caret:6,select:4}],vf=["--size-100","--size-200","--size-300","--size-400","--size-500","--size-600","--size-700","--size-800","--size-900","--gutter"],gf={"tw-text":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 13 5 3l3.5 10M2.7 10h4.6"/><path d="M12.5 3.5v9M11 5l1.5-1.5L14 5M11 11l1.5 1.5L14 11"/></svg>',"tw-leading":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h8.5M6 8h8.5M6 12.5h8.5"/><path d="M2.5 4.5v7M1.4 5.6 2.5 4.5l1.1 1.1M1.4 10.4l1.1 1.1 1.1-1.1"/></svg>',"tw-font":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.2V3h10v1.2M8 3v10M6 13h4"/></svg>',"tw-radius":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 13.5v-6a5 5 0 0 1 5-5h6"/><path d="M13.5 6.5v7h-7" stroke-dasharray="2 2"/></svg>',"tw-gap":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"tw-align":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3.5h12M2 8h8M2 12.5h10"/></svg>',"tw-w":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3.5v9M14 3.5v9"/><path d="M4.5 8h7"/><path d="M6 6.2 4.2 8 6 9.8M10 6.2 11.8 8 10 9.8"/></svg>',"tw-h":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 2h9M3.5 14h9"/><path d="M8 4.5v7"/><path d="M6.2 6 8 4.2 9.8 6M6.2 10 8 11.8 9.8 10"/></svg>',"tw-maxw":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3v10M14.5 3v10"/><path d="M5 8h6"/><path d="M6.6 6.2 4.8 8l1.8 1.8M9.4 6.2 11.2 8l-1.8 1.8"/></svg>',"tw-overflow":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="1.8" y="4.5" width="8.6" height="9.7" rx="1.2"/><path d="M6.5 1.8h7.7v7.7" stroke-linecap="round"/></svg>',"tw-border":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6"/><rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" stroke-width="1" opacity=".45"/></svg>',"tw-border-color":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6" stroke-dasharray="3.1 2.2"/><rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" fill="currentColor" stroke="none" opacity=".55"/></svg>'},bf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="10" width="18" height="11" rx="2"/><rect x="6" y="3" width="9" height="4" rx="1.4" fill="currentColor" stroke="none"/></svg>',yf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.1 12a8.9 8.9 0 1 0 2.8-6.5L3 8"/><path d="M3 3.4V8h4.6"/><path d="M12 7.4V12l3 1.8"/></svg>',kf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>',xf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></svg>',_f='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/><path d="M3 17c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/></svg>',Qa=[["--gray-50","#fafafa"],["--gray-100","#f5f5f5"],["--gray-200","#e5e5e5"],["--gray-300","#d4d4d4"],["--gray-400","#a3a3a3"],["--gray-500","#737373"],["--gray-600","#525252"],["--gray-700","#404040"],["--gray-800","#262626"],["--gray-900","#171717"],["--gray-950","#0a0a0a"]],Un=t=>[{id:`${t}-all`,icon:"box-all",title:"All sides",css:t,tw:t,menu:"spacing"},{id:`${t}-block`,icon:"box-block",title:"Top and bottom",css:`${t}-block`,tw:`${t}-block`,menu:"spacing",sep:!0},{id:`${t}-block-start`,icon:"box-block-start",title:"Top",css:`${t}-block-start`,tw:`${t}-top`,menu:"spacing"},{id:`${t}-block-end`,icon:"box-block-end",title:"Bottom",css:`${t}-block-end`,tw:`${t}-bottom`,menu:"spacing"},{id:`${t}-inline`,icon:"box-inline",title:"Left and right",css:`${t}-inline`,tw:`${t}-inline`,menu:"spacing",sep:!0},{id:`${t}-inline-start`,icon:"box-inline-start",title:"Left",css:`${t}-inline-start`,tw:`${t}-left`,menu:"spacing"},{id:`${t}-inline-end`,icon:"box-inline-end",title:"Right",css:`${t}-inline-end`,tw:`${t}-right`,menu:"spacing"}],wf=[{id:"display-flex",twClass:"flex",icon:"display-flex",title:"Flex",kind:"display",value:"flex",css:"display"},{id:"flex-row",twClass:"flex-row",icon:"flex-row",title:"Direction: row",kind:"flexDir",value:"row",css:"flex-direction",sep:!0},{id:"flex-col",twClass:"flex-col",icon:"flex-col",title:"Direction: column",kind:"flexDir",value:"column",css:"flex-direction"},{id:"justify-start",twClass:"justify-start",icon:"justify-start",title:"Justify: start",css:"justify-content",value:"flex-start",when:"flex",sep:!0},{id:"justify-center",twClass:"justify-center",icon:"justify-center",title:"Justify: center",css:"justify-content",value:"center",when:"flex"},{id:"justify-end",twClass:"justify-end",icon:"justify-end",title:"Justify: end",css:"justify-content",value:"flex-end",when:"flex"},{id:"justify-between",twClass:"justify-between",icon:"justify-between",title:"Justify: between",css:"justify-content",value:"space-between",when:"flex"},{id:"justify-around",twClass:"justify-around",icon:"justify-around",title:"Justify: around",css:"justify-content",value:"space-around",when:"flex"},{id:"align-start",twClass:"items-start",icon:"align-start",title:"Align: start",css:"align-items",value:"flex-start",when:"flex",sep:!0},{id:"align-center",twClass:"items-center",icon:"align-center",title:"Align: center",css:"align-items",value:"center",when:"flex"},{id:"align-end",twClass:"items-end",icon:"align-end",title:"Align: end",css:"align-items",value:"flex-end",when:"flex"},{id:"align-stretch",twClass:"items-stretch",icon:"align-stretch",title:"Align: stretch",css:"align-items",value:"stretch",when:"flex"}],Sf=[{id:"gap-all",icon:"gap-all",title:"Both",css:"gap",tw:"gap",menu:"spacing"},{id:"gap-row",icon:"gap-row",title:"Between rows",css:"row-gap",tw:"row-gap",menu:"spacing",sep:!0},{id:"gap-col",icon:"gap-col",title:"Between columns",css:"column-gap",tw:"column-gap",menu:"spacing"}],$f=["1px","2px","3px","4px","8px"],kt=(t,e,o,n,s,r)=>({id:t,icon:e,title:o,css:n,menu:"choices",choices:$f,twGroup:[s,`${s}-2`,`${s}-4`,`${s}-8`],...r?{sep:!0}:{}}),Cf=[kt("bw-all","bd-all","All sides","border-width","border"),kt("bw-block","bd-block","Top and bottom","border-block-width","border-y",!0),kt("bw-top","bd-top","Top","border-block-start-width","border-t"),kt("bw-bottom","bd-bottom","Bottom","border-block-end-width","border-b"),kt("bw-inline","bd-inline","Left and right","border-inline-width","border-x",!0),kt("bw-left","bd-left","Left","border-inline-start-width","border-l"),kt("bw-right","bd-right","Right","border-inline-end-width","border-r")],Tf=[{id:"bd-all",icon:"bd-all",title:"All sides",css:"border-color",tw:"border-color",menu:"colors"},{id:"bd-block",icon:"bd-block",title:"Top and bottom",css:"border-block-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-top",icon:"bd-top",title:"Top",css:"border-block-start-color",tw:"border-top-color",menu:"colors"},{id:"bd-bottom",icon:"bd-bottom",title:"Bottom",css:"border-block-end-color",tw:"border-bottom-color",menu:"colors"},{id:"bd-inline",icon:"bd-inline",title:"Left and right",css:"border-inline-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-left",icon:"bd-left",title:"Left",css:"border-inline-start-color",tw:"border-left-color",menu:"colors"},{id:"bd-right",icon:"bd-right",title:"Right",css:"border-inline-end-color",tw:"border-right-color",menu:"colors"}],Af=[{id:"rd-all",icon:"rd-all",title:"All corners",css:"border-radius",tw:"border-radius",menu:"values"},{id:"rd-tl",icon:"rd-tl",title:"Top left",css:"border-start-start-radius",tw:"border-top-left-radius",menu:"values",sep:!0},{id:"rd-tr",icon:"rd-tr",title:"Top right",css:"border-start-end-radius",tw:"border-top-right-radius",menu:"values"},{id:"rd-br",icon:"rd-br",title:"Bottom right",css:"border-end-end-radius",tw:"border-bottom-right-radius",menu:"values"},{id:"rd-bl",icon:"rd-bl",title:"Bottom left",css:"border-end-start-radius",tw:"border-bottom-left-radius",menu:"values"}],tr=[{id:"display",title:"Display",css:"display",tw:"display",kids:wf},{id:"absolute",title:"Position",css:"position",tw:"position",value:"absolute"},{id:"color",title:"Text color",css:"color",tw:"color",menu:"colors"},{id:"bg",title:"Background color",css:"background-color",tw:"background-color",menu:"colors"},{id:"padding",title:"Padding",css:"padding",tw:"padding",kids:Un("padding")},{id:"margin",title:"Margin",css:"margin",tw:"margin",kids:Un("margin")},{id:"tw-text",title:"Font size",css:"font-size",tw:"font-size",menu:"values"},{id:"tw-leading",title:"Line height",css:"line-height",tw:"line-height",menu:"values"},{id:"tw-font",title:"Font family",css:"font-family",tw:"font-family",menu:"values"},{id:"tw-align",title:"Text align",css:"text-align",tw:"text-align",menu:"choices",choices:["left","center","right","justify"]},{id:"tw-border",title:"Border",css:"border-width",tw:"border-width",kids:Cf},{id:"tw-border-color",title:"Border color",css:"border-color",tw:"border-color",kids:Tf},{id:"tw-radius",title:"Radius",css:"border-radius",tw:"border-radius",kids:Af},{id:"tw-gap",title:"Gap",css:"gap",tw:"gap",kids:Sf},{id:"tw-w",title:"Width",css:"width",tw:"width",menu:"sizes"},{id:"tw-h",title:"Height",css:"height",tw:"height",menu:"sizes"},{id:"tw-maxw",title:"Max width",css:"max-width",tw:"max-width",menu:"sizes"},{id:"tw-overflow",title:"Overflow",css:"overflow",tw:"overflow",menu:"choices",choices:["visible","hidden","clip","auto","scroll"]}],Mf=["100%","auto","fit-content","min-content","max-content","100vw","100dvh","0"],Te=new Map;for(const t of tr){Te.set(t.id,{tool:t,kid:null});for(const e of t.kids||[])Te.set(e.id,{tool:t,kid:e})}const Kn={display:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2.5" width="13" height="11" rx="1.2"/><path d="M5 6.5h6M5 9.5h4"/></svg>',"display-flex":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="3.4" height="9" rx=".4"/><rect x="6.3" y="3.5" width="3.4" height="9" rx=".4"/><rect x="10.6" y="3.5" width="3.4" height="9" rx=".4"/></svg>',"flex-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12"/><path d="M4.2 5.8 2 8l2.2 2.2"/><path d="M11.8 5.8 14 8l-2.2 2.2"/></svg>',"flex-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v12"/><path d="M5.8 4.2 8 2l2.2 2.2"/><path d="M5.8 11.8 8 14l2.2-2.2"/></svg>',"justify-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="5.4" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4.6" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="8.2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-between":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-around":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"align-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="5.4" width="9" height="2.4" rx=".4"/></svg>',"align-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="4.6" width="9" height="2.4" rx=".4"/><rect x="3.5" y="9" width="9" height="2.4" rx=".4"/></svg>',"align-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="8.2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="11.6" width="9" height="2.4" rx=".4"/></svg>',"align-stretch":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx=".5"/><rect x="9" y="2" width="4" height="12" rx=".5"/></svg>',absolute:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>',color:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.4 11.2 7.4 2.4l4 8.8"/><path d="M4.7 8.4h5.4"/><rect x="1.6" y="12.8" width="12.8" height="2.2" rx=".6" fill="currentColor" stroke="none"/></svg>',bg:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 1.9a6.1 6.1 0 1 0 0 12.2c.85 0 1.35-.55 1.35-1.25 0-.38-.18-.66-.4-.88a1.2 1.2 0 0 1 .85-2.05h1.3A3.5 3.5 0 0 0 14.1 6.1C14.1 3.75 11.4 1.9 8 1.9Z"/><circle cx="4.9" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="8" cy="4.8" r=".95" fill="currentColor" stroke="none"/><circle cx="11.1" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="4.7" cy="9.9" r=".95" fill="currentColor" stroke="none"/></svg>',padding:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/></svg>',margin:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/><path d="M2 2.5h12M2 13.5h12M2.5 2v12M13.5 2v12" stroke-dasharray="1.4 1.2"/></svg>',"box-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".4" fill="currentColor" stroke="none"/></svg>',"box-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"gap-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"gap-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="3" y="1.6" width="10" height="4.2" rx=".6"/><rect x="3" y="10.2" width="10" height="4.2" rx=".6"/><path d="M4.5 8h7"/></svg>',"gap-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"bd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4"/></svg>',"bd-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-top":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-bottom":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-left":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-right":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"rd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="3.4"/></svg>',"rd-tl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6H6a3.4 3.4 0 0 0-3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M2.6 9V6A3.4 3.4 0 0 1 6 2.6h3" stroke-width="2.2"/></svg>',"rd-tr":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6h7.4a3.4 3.4 0 0 1 3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M7 2.6h3A3.4 3.4 0 0 1 13.4 6v3" stroke-width="2.2"/></svg>',"rd-br":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6v7.4a3.4 3.4 0 0 1-3.4 3.4H2.6" stroke-width="1" opacity=".35"/><path d="M13.4 7v3a3.4 3.4 0 0 1-3.4 3.4H7" stroke-width="2.2"/></svg>',"rd-bl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6v7.4a3.4 3.4 0 0 0 3.4 3.4h7.4" stroke-width="1" opacity=".35"/><path d="M2.6 7v3A3.4 3.4 0 0 0 6 13.4h3" stroke-width="2.2"/></svg>'},v={html:null,css:null,js:null},Vt={html:null,css:null,js:null},Ut={html:null,css:null,js:null};export{op as ARMED_KEY,pf as AUTOSAVE_ICON,Ga as AUTOSAVE_KEY,uf as BACK_ICON,mf as CSS_ADD_ICON,Qa as CSS_GRAYS,Mf as CSS_LENGTHS,y as CSS_MENU_ID,kf as CSS_MODE_ICON,Go as CSS_SIZE_KEY,vf as CSS_SPACING,Xo as CSS_STATES,fo as CSS_STATE_KEY,tr as CSS_TOOLS,Kn as CSS_TOOL_ICONS,Te as CSS_TOOL_INDEX,ff as DATA_ICON,Lt as DATA_MENU_ID,rf as DEFAULT_HEIGHT,u as DOCK_ID,Q as Decoration,te as EditorState,F as EditorView,st as HANDLES,Va as HEIGHT_KEY,yf as HISTORY_ICON,Ja as HTML_HEADINGS,vo as HTML_TOOLS,xf as ID_MODE_ICON,cf as LOCK_CLOSED_ICON,df as LOCK_OPEN_ICON,Ya as MIN_HEIGHT,oo as MIN_PANE,St as PANES,Ua as PANES_KEY,ut as RangeSetBuilder,hf as SAVE_ICON,lf as SAVE_MS,sf as SCOPE_CLASS,Za as SCOPE_ICON,Ue as SCOPE_KEY,bf as STRIP_ICON,af as STYLE_ID,Xa as STYLE_MODE_KEY,Wt as StateEffect,dt as StateField,_f as TW_MODE_ICON,gf as TW_TOOL_ICONS,U as UNLOCK_ID,on as VALUES_MODE_KEY,Ka as WIDTHS_KEY,Dt as applyCssFolds,$t as applyCssScope,Fc as applyDisplay,Lc as applyFlexDirection,Vs as applyHtmlTag,K as applyRuleDecls,da as applyStyleMode,Pa as autocompletion,Oo as autosaveEnabled,Iu as bindAntlersSnippets,_n as bindAutosave,Vn as bindBack,$c as bindCssAddClass,au as bindCssTools,Pu as bindDataVars,Yd as bindHistory,wn as bindHtmlScope,iu as bindHtmlTidy,lu as bindHtmlTools,Yu as bindLayoutWatch,xn as bindLock,ef as bindPaneToggles,Qu as bindResize,tf as bindSplitters,Xd as bindStrip,su as bindStyleMode,Du as bindVisualEditSnippets,Yf as clearCssFocus,ae as clearHtmlScopeRange,Ia as closeBrackets,Oa as closeBracketsKeymap,ma as closeCodeDock,Zf as closeCodeDockPopups,Da as closeCompletion,$ as closeCssMenu,Qt as closeCssMenuPicked,R as closeDataMenu,C as cm,Jf as codeDockStyleMode,Na as codeFolding,Ve as collectionViewType,Ha as completionKeymap,za as css,Ks as cssEditorText,je as cssRuleAtCursor,ra as cssSizeRow,gt as cssSizeRows,Ne as cssStateSuffix,Z as currentFlexDecls,vt as currentFullHtml,Ps as currentSectionValues,bt as currentTemplateType,Ea as defaultKeymap,pt as dispatchHtmlChanges,Ut as editableOf,v as editors,Uu as ensureStyle,Fs as ensureTwCss,ca as enterValuesRule,P as finishHtmlEdit,nc as flushBracketSync,X as flushCssScope,sc as flushCssToHtml,z as flushSave,ho as foldEffect,qa as foldedRanges,Os as goBackTemplate,Aa as highlightActiveLine,Ma as highlightActiveLineGutter,Ba as history,Fa as historyKeymap,Wa as hoverTooltip,ja as html,Ws as htmlEditorText,re as htmlElementAtCursor,Oe as htmlFocusOk,Ce as htmlLanguage,oe as htmlScopeEnabled,Ct as htmlTargetFromCursor,Au as inAttributeValue,Tu as inDynamicAttribute,ze as indentFromPrevious,La as indentWithTab,uu as insertAiSnippet,Ns as insertHtmlElement,Zt as insertHtmlSnippet,Xt as isChromeTemplateType,_r as isCodeDockArmed,ct as isCodeDockLocked,ha as isCodeDockOpen,zu as isPanelFrame,Ra as javascript,po as keymap,ju as languageOf,xt as leadingCssIndent,it as lineIndentOf,Ta as lineNumbers,nf as loadCm,Ht as loadTemplate,Wd as mountEditor,ia as newSizeBlockSpot,uo as newSizeQuery,B as normalizeFlexValue,Jo as observeDockLayout,G as onEditorInput,Oc as openCssChoiceMenu,Ic as openCssColorMenu,Dc as openCssSpacingMenu,En as openCssValueMenu,ga as openDataVarsMenu,wc as openHtmlComponentMenu,Cn as openHtmlTagMenu,Is as openNestedTemplate,ba as openPickerMenu,rc as openRenameClassMenu,Re as paintAlpine,J as paintAutosave,Bt as paintBack,Ko as paintCssAll,lt as paintCssHead,Vo as paintCssIdMark,E as paintCssToolState,jd as paintHostWait,q as paintHtmlScope,We as paintHtmlToolState,wt as paintLock,Sa as paintPaneButtons,Et as paintStrip,qe as paintStyleMode,Uo as paintValuesMode,lc as pickHtmlTagAtCursor,D as placeCssMenu,Ft as placeDock,Qo as previewBottomPad,oc as primeTailwindCompile,Vt as readOnlyOf,Ro as readParts,pu as refreshCodeDockFromDisk,xe as refreshPreview,hu as relayoutCodeDock,De as rememberBracketNames,It as rememberCssSelectors,Ls as resetTailwindCompile,No as sameParts,np as setCodeDockArmed,tu as setCssAll,en as setPath,I as setStatus,Jd as setValuesMode,qn as shieldDock,jo as showHtmlFull,Wo as showHtmlScope,Xu as stopObservingDockLayout,ka as storedPanes,Qf as syncCodeDock,ao as syncHtmlTree,ne as syncScopedHtml,le as syncTwTarget,of as tags,xr as templateDockAllowed,qs as tidyHtmlPane,xc as toggleHtmlPagination,mo as unfoldEffect,se as writeHandleEditor,He as writeHtmlEditor,Ot as writeParts};
