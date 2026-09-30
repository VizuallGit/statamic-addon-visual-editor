const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-AWaJHJyk.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{H as Xn,a9 as go,W as Xa}from"./ids-8w5G9SWv.js";import{v as Ya,l as Za}from"./codemirror-DEdX2BEd.js";import{o as x,c as _,a as g,t as A,e as Ja,F as z,i as ae,w as E,l as Yn,k as bo,u as w,Y as Xt,f as j,W as Qa,x as p,r as an,g as er,V as tr,R as Yt,j as or,T as rn,U as nr,b as X,d as N,z as Zn,_ as sr,p as V,q as he,D as ln,E as ar,B as yo,a2 as ko,a0 as rr,s as Ue,ai as ir,m as lr}from"./addon-BZQFfesS.js";import{a as re,c as Jn,o as Tt,d as cn,t as cr,f as Qn,g as dr,h as ur,e as xo,i as fr,m as Qe,T as hr,j as pr,k as mr,l as _o,n as wo,q as es,u as vr,v as dn,w as Zt,x as gr,y as br,z as no,A as yr,B as kr,C as ts,D as os,E as T,F as xr,G as un,H as _r}from"./lp-cluster-Dr_mG1Kf.js";import{I as Kf,J as Gf}from"./lp-cluster-Dr_mG1Kf.js";import{h as fn,c as ns,r as ss,f as as,a as wr,b as Sr,d as $r,e as So,t as rs,g as Cr,i as At,j as $o,m as Co,k as Tr,l as is,n as Ar,s as Ke,o as hn,p as ls,q as Mt,u as Et,v as To,w as Mr,x as Er,y as Lr,z as Fr,A as Br,B as Ir,C as Ao,D as Or,E as pn,F as Pr,G as Dr,H as Hr,I as jr,J as zr,K as Wr,L as Rr,M as Nr,N as qr,O as Vr,P as cs,Q as Ur,R as so,S as Kr,T as ds,U as Gr,V as Xr,W as Yr,X as Mo,Y as Zr,Z as Jr,_ as Qr,$ as us,a0 as mn,a1 as ct}from"./tw-classes-BxMI-3Ny.js";import{_ as fs,o as ei,C as ti,m as H}from"./ChoiceDialog-BPSzoPKY.js";import{M as hs,S as ps}from"./protocol-Brvy2KuB.js";import{t as oi}from"./tw-candidates-wYTeDvRv.js";import{h as ni,a as si,e as ai,A as vn,b as ri,i as Eo,c as ii,d as gt}from"./html-tag-sync-NJ20OxJr.js";import"./ai-text-icon-B7uCWIwa.js";import"./index-M2RCOyrL.js";import"./index-B5fiB6ig.js";import"./index-BToaucQS.js";import"./index-CBz0uTrv.js";import"./index-DQ1U3riw.js";import"./index-Cyo6AV6W.js";import"./index-DLnatvA4.js";import"./index-D1QFLdPX.js";import"./index-uBreFNNK.js";import"./index-DFuMeYQO.js";const te="__sve-css-rename-chip",li='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';function ci(e){const t=e.Decoration.mark({class:"sve-cm-css-token"}),o=e.StateEffect.define();return{extensions:[e.StateField.define({create(){return e.Decoration.none},update(s,r){let i;for(const c of r.effects)c.is(o)&&(i=c.value);if(i===void 0)return r.docChanged?e.Decoration.none:s;if(!i)return e.Decoration.none;const l=new e.RangeSetBuilder;return l.add(i.from,i.to,t),l.finish()},provide:s=>e.EditorView.decorations.from(s)})],setHover(s,r){s&&s.dispatch({effects:o.of(r)})}}}function oe(e){e?.getElementById(te)?.remove()}function di(e,t,o,n){t.style.left=`${Math.max(6,Math.min(o,e.innerWidth-28))}px`,t.style.top=`${Math.max(6,n)}px`}function ui(e,t,o,{onRename:n,title:s}){const r=e.document,i=t.coordsAtPos(o.to);if(!i)return;oe(r);const l=r.createElement("button");l.id=te,l.type="button",l.innerHTML=li,l.title=s,l.setAttribute("aria-label",s),l.addEventListener("mousedown",c=>{c.preventDefault(),c.stopPropagation(),oe(r),n?.(o)}),l.addEventListener("mouseleave",()=>{e.setTimeout(()=>{t.dom.matches(":hover")||l.matches(":hover")||oe(r)},120)}),r.body.appendChild(l),di(e,l,i.right+2,i.top-1)}function fi(e,t,{onRename:o,isLocked:n,setHover:s,title:r}){if(!t?.dom||t.dom._sveClassTokenBound)return;t.dom._sveClassTokenBound=!0;let i=null,l="";const c=()=>!!n?.(),d=()=>{e.clearTimeout(i),i=null,l="",s?.(t,null),oe(e.document)},f=h=>{if(c()){d();return}d(),o?.(h)};t.dom.addEventListener("mousemove",h=>{if(c()){d();return}if(h.target?.closest?.(`#${te}`))return;const m=t.posAtCoords({x:h.clientX,y:h.clientY});if(m==null)return;const b=fn(t.state.doc.toString(),m);if(!b){e.clearTimeout(i),i=null,l="",s?.(t,null);return}const k=`${b.from}:${b.to}:${b.name}`;s?.(t,{from:b.from,to:b.to}),!(l===k&&(i||e.document.getElementById(te)))&&(e.clearTimeout(i),l=k,i=e.setTimeout(()=>{i=null,ui(e,t,b,{onRename:f,title:r||"Rename class"})},160))}),t.dom.addEventListener("mouseleave",h=>{h.relatedTarget?.closest?.(`#${te}`)||e.setTimeout(()=>{e.document.getElementById(te)?.matches(":hover")||d()},160)}),t.dom.addEventListener("dblclick",h=>{if(c())return;const m=t.posAtCoords({x:h.clientX,y:h.clientY});if(m==null)return;const b=fn(t.state.doc.toString(),m);b&&(h.preventDefault(),h.stopPropagation(),f(b))},!0),t.scrollDOM?.addEventListener("scroll",d),e.document._sveClassTokenDismiss||(e.document._sveClassTokenDismiss=!0,e.document.addEventListener("mousedown",h=>{h.target.closest(`#${te}`)||oe(e.document)}))}const a={cssColorsPromise:null,lastUid:null,lastType:null,typeStack:[],lastParts:{html:"",css:"",js:""},lastProps:[],propsDirty:!1,lastLocked:!1,lockReady:!1,lastWin:null,loadGen:0,saveTimer:null,lastBracketNames:null,lastCssSelectorNames:null,saveInFlight:null,loadInFlight:null,dragging:!1,applying:!1,htmlScopePref:!0,htmlScopeActive:!1,styleMode:"css",cssToolRow:null,cssOpenTool:"",cssOpenMenu:"",cssValues:!1,twCss:null,twKey:"",twBusy:!1,twDirty:!1,htmlFocus:null,cssFocus:null,htmlFull:"",cssFull:"",cssPane:"full",cssScopeSnapshot:"",layoutObserver:null,layoutWin:null,observedEditor:null,observedRight:null,layoutWatchBound:!1,cssSize:"",cssState:"",cssOwnFolds:new Set,cssFoldSig:"",htmlPartialUi:null,htmlAntlersUi:null,htmlClassTokenUi:null,htmlLintUi:null,cssGhostUi:null},Te=new Map,gn={scope:null,section:[],page:[],site:[]};function ms(e){const t=e?.location?.pathname?.match(/\/collections\/([^/]+)\//);return t?t[1]:""}function vs(e){const t=String(e||"").trim();return!t||/^(header|footer)\//.test(t)?"":t}function hi(e){return(Array.isArray(e)?e:[]).filter(t=>t?.handle).map(t=>`${t.kind==="collection"?"collection":"field"}:${t.handle}`).join("|")}function Lo({collection:e,set:t,view:o,scope:n}){return`${e}::${t}::${o||""}::${n||""}`}function gs(e){return Te.get(e)||null}function bs(e,{collection:t,set:o,view:n,scope:s}){const r=Lo({collection:t,set:o,view:n,scope:s}),i=Te.get(r);if(i)return Promise.resolve(i);const l=new URLSearchParams;return t&&l.set("collection",t),o&&l.set("set",o),n&&l.set("view",n),s&&l.set("scope",s),e.fetch(`/!/sve/data-vars?${l.toString()}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(c=>c.ok?c.json():null).then(c=>{const d=c&&typeof c=="object"?c:gn;return Te.set(r,d),d}).catch(()=>gn)}function pi(e){if(!e){Te.clear();return}const t=`::${e}::`;for(const o of[...Te.keys()])o.includes(t)&&Te.delete(o)}function mi(e){if(e==null||e==="")return"";if(typeof e=="boolean")return e?"true":"false";if(Array.isArray(e))return e.length?`${e.length} ×`:"";if(typeof e=="object"){const o=Object.keys(e).length;return o?`${o} ×`:""}const t=String(e).replace(/\s+/g," ").trim();return t.length>60?`${t.slice(0,60)}…`:t}function vi(e,t){return t.split(".").reduce((o,n)=>o&&typeof o=="object"?o[n]:void 0,e)}function ys(e,t){return!Array.isArray(e)||!t||typeof t!="object"?e||[]:e.map(o=>{if(o.parent||o.value!=null||o.var.includes(":"))return o;const n=mi(vi(t,o.var));return n?{...o,value:n}:o})}function gi(e,t){return Array.isArray(e)?e.map(o=>({...o,items:ys(o.items,t)})):[]}function bi(e,t,{inline:o=!1}={}){const n=String(e?.var||"").trim();if(!n)return null;if(o)return{text:`{{ ${n} }}`,cursor:`{{ ${n} }}`.length};if(e.loop)return{text:`{{ ${n} }}
  
{{ /${n} }}`,cursor:`{{ ${n} }}
  `.length};if(t?.loop&&!e.parent){const s=t.loop;return{text:`{{ ${s} }}
  {{ ${n} }}
{{ /${s} }}`,cursor:`{{ ${s} }}
  {{ ${n} }}`.length}}return{text:`{{ ${n} }}`,cursor:`{{ ${n} }}`.length}}const dt="visual_edit",bn=[{id:"base",lang:"code_dock_visual_edit_base"},{id:"field",lang:"code_dock_visual_edit_field"}],ks=[{id:"tag",group:"base",label:"{{ visual_edit }}",standalone:"{{ visual_edit| }}"},{id:"ve_popup",group:"base",label:"popup",attr:'popup="true"'},{id:"ve_orderable",group:"base",label:"orderable",attr:'orderable="true"'},{id:"ve_section_orderable",group:"base",label:"section_orderable",attr:'section_orderable="true"'},{id:"ve_outline_inside",group:"base",label:"outline_inside",attr:'outline_inside="true"'},{id:"ve_field",group:"field",label:"field",attr:'field="|"'},{id:"ve_inline_edit",group:"field",label:"inline_edit",attr:'inline_edit="true"'},{id:"ve_insertable",group:"field",label:"insertable",attr:'insertable="true"'},{id:"ve_toolbar",group:"field",label:"toolbar",attr:'toolbar="true"'},{id:"ve_scope",group:"field",label:"scope",attr:'scope="|"'},{id:"ve_controls",group:"field",label:"controls",attr:'controls="|"'}];function yi(e){return ks.find(t=>t.id===e)||null}function ki(e,t,o,n){let s=t;for(;s<o;){const r=e.indexOf("{{",s);if(r===-1||r>=o)return null;const i=e.indexOf("}}",r+2);if(i===-1||i+2>o)return null;const l=e.slice(r+2,i);if((l.trim().split(/\s+/)[0]||"")===n)return{openIdx:r,closeIdx:i,inner:l};s=i+2}return null}function xi(e,t){const o=String(t).split("=")[0].trim();return new RegExp(`(^|\\s)${o}(=|\\s|$)`).test(e)}const _i={class:"sve-code-dock"},wi={"data-sve-code-bar":""},Si={type:"button","data-sve-code-pane-btn":"html"},$i={type:"button","data-sve-code-pane-btn":"css"},Ci={type:"button","data-sve-code-pane-btn":"alpine"},Ti={type:"button","data-sve-code-pane-btn":"js"},Ai={type:"button","data-sve-html-scope":"","aria-pressed":"true"},Mi=["innerHTML"],Ei={"data-sve-code-panes":""},Li={"data-sve-code-pane":"html"},Fi={"data-sve-code-pane-label":""},Bi=["title","aria-label"],Ii=["innerHTML"],Oi={"data-sve-code-pane":"css"},Pi={"data-sve-css-chrome":"subrow-2"},Di={"data-sve-code-pane-label":""},Hi={"data-sve-css-label":""},ji={"data-sve-code-pane":"alpine"},zi={"data-sve-code-pane-label":""},Wi={"data-sve-code-pane":"js"},Ri={"data-sve-code-pane-label":""},Ni={__name:"CodeDockChrome",props:{htmlLabel:{type:String,required:!0},cssLabel:{type:String,required:!0},jsLabel:{type:String,required:!0},alpineLabel:{type:String,required:!0},treeIcon:{type:String,required:!0},dataIcon:{type:String,required:!0},dataLabel:{type:String,required:!0}},setup(e){return(t,o)=>(x(),_("div",_i,[o[18]||(o[18]=g("div",{"data-sve-code-grip":"","aria-hidden":"true"},null,-1)),g("div",wi,[g("button",Si,A(e.htmlLabel),1),g("button",$i,A(e.cssLabel),1),g("button",Ci,A(e.alpineLabel),1),g("button",Ti,A(e.jsLabel),1),o[0]||(o[0]=Ja('<button type="button" data-sve-code-back hidden></button><span data-sve-code-path></span><span data-sve-code-status></span><button type="button" data-sve-code-strip></button><button type="button" data-sve-code-history></button><button type="button" data-sve-style-mode></button><button type="button" data-sve-values-mode></button><button type="button" data-sve-code-autosave aria-pressed="true"></button><button type="button" data-sve-code-save hidden></button>',9)),g("button",Ai,[g("span",{innerHTML:e.treeIcon},null,8,Mi)]),o[1]||(o[1]=g("button",{type:"button","data-sve-code-lock":"",hidden:""},null,-1))]),o[19]||(o[19]=g("div",{"data-sve-code-lock-banner":""},null,-1)),g("div",Ei,[g("div",Li,[g("div",Fi,[g("span",null,A(e.htmlLabel),1),o[2]||(o[2]=g("div",{"data-sve-html-tools":""},null,-1)),o[3]||(o[3]=g("button",{type:"button","data-sve-html-tidy":""},null,-1)),g("button",{type:"button","data-sve-data-vars":"",title:e.dataLabel,"aria-label":e.dataLabel},[g("span",{innerHTML:e.dataIcon},null,8,Ii)],8,Bi),o[4]||(o[4]=g("div",{"data-sve-visual-edit-tools":""},null,-1)),o[5]||(o[5]=g("div",{"data-sve-antlers-tools":""},null,-1))]),o[6]||(o[6]=g("div",{"data-sve-html-problems":"",hidden:""},null,-1)),o[7]||(o[7]=g("div",{"data-sve-code-host":""},null,-1))]),o[15]||(o[15]=g("div",{"data-sve-code-split":"","data-sve-code-split-after":"html"},null,-1)),g("div",Oi,[g("div",Pi,[g("div",Di,[g("span",Hi,A(e.cssLabel),1),o[8]||(o[8]=g("button",{type:"button","data-sve-css-add-class":""},null,-1)),o[9]||(o[9]=g("div",{"data-sve-css-tools":""},null,-1))])]),o[10]||(o[10]=g("div",{"data-sve-css-head":""},null,-1)),o[11]||(o[11]=g("div",{"data-sve-code-host":""},null,-1)),o[12]||(o[12]=g("div",{"data-sve-tw-host":""},null,-1))]),o[16]||(o[16]=g("div",{"data-sve-code-split":"","data-sve-code-split-after":"css"},null,-1)),g("div",ji,[g("div",zi,[g("span",null,A(e.alpineLabel),1)]),o[13]||(o[13]=g("div",{"data-sve-alpine-host":""},null,-1))]),o[17]||(o[17]=g("div",{"data-sve-code-split":"","data-sve-code-split-after":"alpine"},null,-1)),g("div",Wi,[g("div",Ri,[g("span",null,A(e.jsLabel),1)]),o[14]||(o[14]=g("div",{"data-sve-code-host":""},null,-1))])])]))}},Re=new Map;let je=null,yn=0,kn=0,xn=!1;async function qi(e,t){if(Re.has(t))return Re.get(t);const o=`view:partials/${t}`;let n=null;try{const s=await e.fetch(`/!/sve/section-template?type=${encodeURIComponent(o)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}});if(s.ok){const r=await s.json();n=typeof r.html=="string"?ss(r.html):null}}catch{}return Re.set(t,n),n}function Vi(e){e?Re.delete(e):Re.clear()}function Fo(e){const t=ns(re("dock:current-type")),o=t?re("dock:html"):"",n=t&&typeof o=="string"?ss(o):null;Jn({source:ps,type:hs.SVE_COMPONENT_FOCUS,on:!!n,name:t?String(t).split("/").pop():"",selector:n||""},e)}async function Lt(e){const t=++kn,o=re("dock:html"),n=[...new Set((typeof o=="string"?as(o):[]).map(r=>r.src).filter(r=>r&&!wr(r)))],s=await Promise.all(n.map(r=>qi(e,r)));t===kn&&Jn({source:ps,type:hs.SVE_COMPONENT_MAP,items:n.map((r,i)=>({src:r,name:r.split("/").pop(),selector:s[i]})).filter(r=>r.selector)},e)}function Ui(e){je=e,!xn&&(xn=!0,Tt("dock:html-changed",()=>{je&&(Vi(ns(re("dock:current-type"))),je.clearTimeout(yn),yn=je.setTimeout(()=>{Lt(je)},400))}))}const Ki=["data-sve-html-tool","data-tip","aria-label","data-letter","onClick","onContextmenu"],Gi=["innerHTML"],Xi={__name:"CodeDockHtmlTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(e){return(t,o)=>(x(!0),_(z,null,ae(e.tools,n=>(x(),_("button",{key:n.id,type:"button","data-sve-html-tool":n.id,"data-tip":n.title,"aria-label":n.title,"data-letter":n.letter?"":void 0,onClick:E(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:E(s=>e.onTool(n.id),["prevent"])},[n.letter?(x(),_(z,{key:0},[Yn(A(n.letter),1)],64)):(x(),_("span",{key:1,innerHTML:n.icon},null,8,Gi))],40,Ki))),128))}},ue=bo({tools:[],onTool:null,onKid:null}),Yi=["data-sve-css-item"],Zi=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],Ji={key:0,"data-sve-css-kids":""},Qi={key:0,"data-sve-css-sep":"","aria-hidden":"true"},el=["data-sve-css-kid","data-sve-css-box-side","data-tip","aria-label","innerHTML","onClick","onContextmenu"],tl={__name:"CodeDockCssTools",setup(e){return(t,o)=>(x(!0),_(z,null,ae(w(ue).tools,n=>(x(),_("li",Xt({key:n.id,"data-sve-css-item":n.id},{ref_for:!0},n.open?{"data-sve-css-open":""}:{}),[g("button",Xt({type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title},{ref_for:!0},{...n.active?{"data-active":""}:{},...n.open?{"data-open":""}:{}},{innerHTML:n.icon,onClick:E(s=>w(ue).onTool?.(n.id),["prevent","stop"]),onContextmenu:E(s=>w(ue).onTool?.(n.id),["prevent"])}),null,16,Zi),n.open&&n.kids.length?(x(),_("div",Ji,[(x(!0),_(z,null,ae(n.kids,s=>(x(),_(z,{key:s.id},[s.sep?(x(),_("span",Qi)):j("",!0),g("button",Xt({type:"button","data-sve-css-kid":s.id,"data-sve-css-box-side":s.id,"data-tip":s.title,"aria-label":s.title},{ref_for:!0},s.active?{"data-active":""}:{},{innerHTML:s.icon,onClick:E(r=>w(ue).onKid?.(n.id,s.id),["prevent","stop"]),onContextmenu:E(r=>w(ue).onKid?.(n.id,s.id),["prevent"])}),null,16,el)],64))),128))])):j("",!0)],16,Yi))),128))}},ol=1.5,nl=16;function mt(e,t){const o=parseFloat(e);return Number.isFinite(o)?t==="em"||t==="rem"?o*nl:o:null}function sl(e){const t=String(e||"").toLowerCase();if(/\bmin-width\b|\bwidth\s*>=?/.test(t))return null;let o=t.match(/\bmax-width\s*:\s*([\d.]+)(px|em|rem)/);return o||(o=t.match(/\bwidth\s*<=?\s*([\d.]+)(px|em|rem)/),o)?mt(o[1],o[2]):(o=t.match(/([\d.]+)(px|em|rem)\s*>=?\s*width\b/),o?mt(o[1],o[2]):null)}function fe(e,t){const o=sl(e);if(o===null)return"";for(const n of t||[]){if(n.base)continue;const s=mt(String(n.max||"").replace(/[a-z]+$/i,""),(String(n.max||"").match(/[a-z]+$/i)||[""])[0]);if(s!==null&&Math.abs(s-o)<=ol)return n.handle}return""}function Ft(e){let t="",o=0;for(;o<e.length;){const n=Bt(e,o);if(n!==o){t+=" ".repeat(n-o),o=n;continue}t+=e[o],o+=1}return t}function Bt(e,t){if(e.startsWith("/*",t)){const o=e.indexOf("*/",t+2);return o===-1?e.length:o+2}if(e.startsWith("{{",t)){const o=e.indexOf("}}",t+2);return o===-1?e.length:o+2}if(e[t]==='"'||e[t]==="'"){const o=e[t];for(let n=t+1;n<e.length;n+=1)if(e[n]==="\\")n+=1;else if(e[n]===o)return n+1;return e.length}return t}function It(e){const t=String(e||""),o=[],n=(s,r,i=0)=>{let l=s,c=l;for(;l<r;){const d=Bt(t,l);if(d!==l){l=d;continue}if(t[l]===";"){l+=1,c=l;continue}if(t[l]==="}")return;if(t[l]!=="{"){l+=1;continue}const f=Ft(t.slice(c,l)),h=f.trim(),m=xs(t,l,r);if(m===-1)return;/^@media\b/i.test(h)?o.push({query:h.replace(/^@media\s*/i,"").trim(),from:c+f.search(/\S/),to:m+1,bodyFrom:l+1,bodyTo:m,depth:i}):/^@(?:import|charset|use)\b/i.test(h)||n(l+1,m,i+1),l=m+1,c=l}};return n(0,t.length,0),o}function xs(e,t,o){let n=0;for(let s=t;s<o;s+=1){const r=Bt(e,s);if(r!==s){s=r-1;continue}if(e[s]==="{")n+=1;else if(e[s]==="}"&&(n-=1,n===0))return s}return-1}function Be(e){const t=String(e||""),o=(n,s)=>{const r=[];let i=n,l=i;for(;i<s;){const c=Bt(t,i);if(c!==i){i=c;continue}if(t[i]===";"){i+=1,l=i;continue}if(t[i]==="}")return r;if(t[i]!=="{"){i+=1;continue}const d=Ft(t.slice(l,i)),f=d.trim(),h=xs(t,i,s);if(h===-1)return r;r.push({prelude:f,media:/^@media\b/i.test(f),query:f.replace(/^@media\s*/i,"").trim(),from:l+d.search(/\S/),to:h+1,bodyFrom:i+1,bodyTo:h,children:/^@(?:import|charset|use)\b/i.test(f)?[]:o(i+1,h)}),i=h+1,l=i}return r};return o(0,t.length)}function al(e,t,o){const n=String(e||"");if(!o)return[];const s=(t||[]).find(d=>d.base),r=Be(n),i=[],l=d=>d.media?fe(d.query,t)===o:d.children.some(l);if(s&&o===s.handle){const d=f=>{for(const h of f){if(h.media&&fe(h.query,t)){i.push({from:h.from,to:h.to});continue}d(h.children)}};return d(r),i}const c=(d,f,h)=>{const m=[];for(const k of d){if(k.media&&fe(k.query,t)===o){m.push({from:k.from,to:k.to,into:null});continue}l(k)&&m.push({from:k.from,to:k.to,into:k})}if(!m.length){h>f&&i.push({from:f,to:h});return}let b=f;for(const k of m)k.from>b&&i.push({from:b,to:k.from}),k.into&&c(k.into.children,k.into.bodyFrom,k.into.bodyTo),b=k.to;h>b&&i.push({from:b,to:h})};return c(r,0,n.length),i.filter(d=>n.slice(d.from,d.to).trim()!=="")}function rl(e,t){const o=String(e||""),n=[],s=i=>{for(const l of i){if((l.media&&fe(l.query,t)||/^#id-/.test(l.prelude))&&Ft(o.slice(l.bodyFrom,l.bodyTo)).trim()===""){n.push(l);continue}s(l.children)}};if(s(Be(o)),!n.length)return o;let r=o;for(const i of n.sort((l,c)=>c.from-l.from)){let l=i.from,c=i.to;const d=r.lastIndexOf(`
`,l-1)+1;for(r.slice(d,l).trim()===""&&(l=d);r[c]===" "||r[c]==="	";)c+=1;r[c]===`
`&&(c+=1),r=r.slice(0,l)+r.slice(c)}return r}function il(e,t){const o=String(e||""),n=[],s=i=>Ft(o.slice(i.bodyFrom,i.bodyTo)).trim()==="",r=i=>{for(const l of i){if((l.media&&fe(l.query,t)||/^#id-/.test(l.prelude))&&s(l)){n.push({from:l.from,to:l.to});continue}r(l.children)}};return r(Be(o)),n}function bt(e,t,o){const n=t||[],s=n.find(d=>d.base),r=[],i=d=>/^#id-/.test(d.prelude)||/^#\s*$/.test(d.prelude),l=(d,f)=>{for(const h of d){if(!h.media){l(h.children,f);continue}const m=fe(h.query,n)||f;if(o===m){r.push(h);continue}l(h.children,m)}},c=(d,f)=>{for(const h of d){if(h.media){c(h.children,fe(h.query,n)||f);continue}if(i(h)){const m=f||(s?s.handle:"");!o||o===m?r.push(h):l(h.children,m);continue}c(h.children,f)}};return c(Be(String(e||"")),""),r.sort((d,f)=>d.from-f.from)}function Bo(e,t,o){return It(e).filter(n=>fe(n.query,t)===o)}const S=bo({tag:"",scope:"",scopeElsewhere:[],scopeElsewhereTitle:"",onScopeImport:null,onTag:null,sizes:[],onSize:null,state:"",stateLabel:"",onState:null,canEdit:!1,note:""}),ll={class:"sve-css-head"},cl=["disabled"],dl={key:1,class:"sve-css-scope"},ul=["title","disabled"],fl=["title","data-active","disabled","onClick"],hl=["data-active","disabled"],pl={key:3,class:"sve-css-note"},ml={__name:"CodeDockCssHead",setup(e){return(t,o)=>(x(),_("div",ll,[w(S).tag?(x(),_("button",{key:0,type:"button",class:"sve-css-tag",disabled:!w(S).canEdit,onClick:o[0]||(o[0]=E(()=>{},["prevent","stop"])),onDblclick:o[1]||(o[1]=E(n=>w(S).onTag?.(n),["prevent","stop"]))},"<"+A(w(S).tag)+">",41,cl)):j("",!0),w(S).scope?(x(),_("span",dl,A(w(S).scope),1)):j("",!0),w(S).scope&&w(S).scopeElsewhere.length?(x(),_("button",{key:2,type:"button",class:"sve-css-scope-taken",title:w(S).scopeElsewhereTitle,disabled:!w(S).canEdit,onClick:o[2]||(o[2]=E(n=>w(S).onScopeImport?.(),["prevent","stop"]))},A(w(S).scopeElsewhere.join(", ")),9,ul)):j("",!0),(x(!0),_(z,null,ae(w(S).sizes,n=>(x(),_("button",{key:n.key,type:"button","data-sve-css-size":"",title:n.title,"data-active":n.active?"":void 0,disabled:!w(S).canEdit,onClick:E(s=>w(S).onSize?.(n.key),["prevent","stop"])},A(n.label),9,fl))),128)),g("button",{type:"button","data-sve-css-state":"","data-active":w(S).state?"":void 0,disabled:!w(S).canEdit,onClick:o[3]||(o[3]=E(n=>w(S).onState?.(n),["prevent","stop"]))},[Yn(A(w(S).stateLabel)+" ",1),o[4]||(o[4]=g("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[g("path",{d:"m6 9 6 6 6-6"})],-1))],8,hl),o[5]||(o[5]=g("span",{class:"sve-css-gap"},null,-1)),w(S).note?(x(),_("span",pl,A(w(S).note),1)):j("",!0)]))}},vl=fs(ml,[["__scopeId","data-v-37ce01c4"]]),gl={key:0,"data-sve-css-swatches":""},bl=["data-sve-css-token","title","data-active","onClick"],yl={key:0,"data-sve-css-head-row":""},kl={key:1,"data-sve-css-note-row":""},xl=["data-sve-css-token","data-active","onClick"],_l={"data-sve-css-choice-label":""},wl={key:0,"data-sve-css-choice-hint":""},Q={__name:"CodeDockMenu",props:{kind:{type:String,required:!0},swatches:{type:Array,default:()=>[]},choices:{type:Array,default:()=>[]},onClear:{type:Function,default:null},onPick:{type:Function,required:!0}},setup(e){return(t,o)=>e.kind==="colors"?(x(),_("div",gl,[g("button",{type:"button","data-sve-css-clear":"",title:"Clear",onClick:o[0]||(o[0]=E((...n)=>e.onClear&&e.onClear(...n),["prevent","stop"]))},[...o[1]||(o[1]=[g("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none",stroke:"currentColor","stroke-width":"1.5"},[g("path",{d:"M2 2l6 6M8 2L2 8"})],-1)])]),(x(!0),_(z,null,ae(e.swatches,n=>(x(),_("button",{key:n.name,type:"button","data-sve-css-swatch":"","data-sve-css-token":n.name,title:n.name,"data-active":n.active?"":void 0,style:Qa({background:n.hex||"transparent"}),onClick:E(s=>e.onPick(n.name),["prevent","stop"])},null,12,bl))),128))])):(x(!0),_(z,{key:1},ae(e.choices,n=>(x(),_(z,{key:n.value},[n.heading?(x(),_("span",yl,A(n.label),1)):n.note?(x(),_("span",kl,A(n.label),1)):(x(),_("button",{key:2,type:"button","data-sve-css-choice":"","data-sve-css-token":n.token||void 0,"data-active":n.active?"":void 0,onClick:E(s=>e.onPick(n.value),["prevent","stop"])},[g("span",_l,A(n.label),1),n.hint?(x(),_("span",wl,A(n.hint),1)):j("",!0)],8,xl))],64))),128))}},Sl=2e4;let _e=[],_s=0,We=null,Jt=null;function ws(){return Jt||(Jt=He.define()),Jt}function Ss(){return!!We&&Date.now()-_s<Sl}function Io(e){return Ss()||(_s=Date.now(),We=e.fetch("/!/sve/site-css/defined",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{defined:[]}).then(t=>(_e=Array.isArray(t?.defined)?t.defined:[],v.html?.dispatch({effects:ws().of(null)}),_e)).catch(()=>(We=null,_e))),We}function Ot(e){return e.document.getElementById(u)?.querySelector("[data-sve-code-path]")?.textContent.trim()||""}function $l(e,t){const o=Ot(e),n=new Map;for(const s of _e){const r=n.get(s.name)||new Set;r.add(s.file===o?t:String(s.file).replace(/^.*\//,"")),n.set(s.name,r)}return[...n].map(([s,r])=>({name:s,detail:[...r].join(", ")})).sort((s,r)=>s.name.localeCompare(r.name))}function Oo(e,t){const o=Ot(e);return t?_e.filter(n=>n.name===t&&n.file!==o):[]}const $s=e=>[...new Set(e.map(t=>String(t.file).replace(/^.*\//,"")))];function Po(e,t){const o=Oo(e,t).map(r=>r.css).filter(Boolean).join(`
`);if(!o)return!1;const n=re("dock:css");if(typeof n!="string")return!1;const s=Sr(n,t,o);return s!==n&&re("dock:set-css",s)!==!1}function Cl(e,t){const o=e.doc.lineAt(t),n=t-o.from,s=/\bclass\s*=\s*(["'])/gi;let r;for(;r=s.exec(o.text);){const i=r[1],l=r.index+r[0].length,c=o.text.indexOf(i,l),d=c===-1?o.text.length:c;if(n<l||n>d)continue;const f=o.text.slice(l,d),h=$r(f),m=n-l;if(!h||m<h.innerFrom||m>h.innerTo)return null;const b=(f.slice(h.innerFrom,m).match(/[\w-]*$/)||[""])[0];return{from:t-b.length,typed:b}}return null}function Tl(e){return t=>{const o=Cl(t.state,t.pos);return!o||!o.typed&&!t.explicit?null:Io(e).then(n=>{const s=Ot(e),r=o.typed.toLowerCase(),i=new Map;for(const c of n){if(c.file===s||!String(c.name).toLowerCase().startsWith(r))continue;const d=i.get(c.name)||{files:[],css:[]};d.files.push(c),c.css&&d.css.push(c.css),i.set(c.name,d)}if(!i.size)return null;const l=[...i].slice(0,40).map(([c,d])=>({label:c,type:"class",detail:$s(d.files).join(", "),info:d.css.length?()=>{const f=e.document.createElement("pre");return f.textContent=d.css.join(`
`),f.style.cssText="margin:0;padding:.3em .5em;font:11px ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap",f}:void 0,apply:(f,h,m,b)=>{f.dispatch({changes:{from:m,to:b,insert:c},selection:{anchor:m+c.length}}),e.setTimeout(()=>Po(e,c),0)}}));return{from:o.from,options:l,validFor:/^[\w-]*$/}})}}function Al(e){const t=o=>{if(!_e.length)return J.none;const n=Ot(e),s=new de;for(const r of So(o)){const i=_e.filter(l=>l.name===r.name&&l.file!==n);i.length&&s.add(r.from,r.to,J.mark({class:"sve-cm-class-taken",attributes:{title:p(e,"class_defined_in",{file:$s(i).join(", ")})}}))}return s.finish()};return ce.define({create:o=>t(o.doc.toString()),update:(o,n)=>n.docChanged||n.effects.some(s=>s.is(ws()))?t(n.state.doc.toString()):o,provide:o=>F.decorations.from(o)})}const Ml=/^\.[a-zA-Z_][\w-]*$/;function El(e,t,o){return String(t||"").includes(o)?yt(e).length===1:!1}function yt(e){return Be(e).filter(t=>/^@scope\b/i.test(t.prelude))}function Ll(e){const t=String(e||"");return Be(t).filter(o=>Ml.test(o.prelude)?!t.slice(o.from,o.bodyFrom-1).includes("{{"):!1).map(o=>({from:o.from,to:o.to,name:o.prelude.slice(1)}))}function Fl(e,t,o){const n=String(e||"");if(!El(n,t,o))return n;const s=Ll(n);if(!s.length)return n;const r=yt(n)[0],i=Ol(n,r),l=s.map(m=>Pl(n.slice(m.from,m.to),n,m.from,i)).join(`

`);let c=n;for(const m of[...s].sort((b,k)=>k.from-b.from))c=Il(c,m.from,m.to);const d=Bl(c,o);if(d===-1)return n;const f=(c.slice(0,d).match(/\n([^\S\n]*)$/)||[null,null])[1],h=f===null?d:d-f.length;return`${c.slice(0,h)}
${l}
${f??""}${c.slice(d)}`}function Bl(e,t){const o=yt(e).find(n=>n.prelude.includes(t));return o?o.bodyTo:yt(e)[0]?.bodyTo??-1}function Il(e,t,o){let n=t,s=o;const r=e.lastIndexOf(`
`,n-1)+1;for(e.slice(r,n).trim()===""&&(n=r);e[s]===" "||e[s]==="	";)s+=1;return e[s]===`
`&&(s+=1),e.slice(0,n)+e.slice(s)}function Ol(e,t){const o=e.slice(t.bodyFrom,t.bodyTo).match(/\n([^\S\n]+)\S/);return o?o[1]:`${(e.slice(0,t.from).match(/\n([^\S\n]*)$/)||[null,""])[1]}    `}function Pl(e,t,o,n){const s=(t.slice(0,o).match(/\n([^\S\n]*)$/)||[null,""])[1];return e.split(`
`).map((r,i)=>i===0?n+r.trim():r.startsWith(s)?n+r.slice(s.length):n+r.trimStart()).join(`
`)}const Dl={"data-sve-css-add-label":""},Hl=["placeholder","onKeydown"],jl={key:0,"data-sve-css-add-hint":""},zl={"data-sve-css-add-existing":""},Wl={"data-sve-css-add-list":""},Rl=["onClick"],Nl={"data-sve-css-add-name":""},ql={"data-sve-css-add-detail":""},Vl={key:0,"data-sve-css-add-none":""},Ul=["disabled"],Do={__name:"CodeDockAddClass",props:{label:{type:String,required:!0},placeholder:{type:String,default:""},initial:{type:String,default:""},onAdd:{type:Function,required:!0},options:{type:Array,default:()=>[]},onPick:{type:Function,default:null},takenText:{type:Function,default:null},existingLabel:{type:String,default:""},createLabel:{type:String,default:""},onClose:{type:Function,default:null}},setup(e){const t=e,o=an(t.initial||""),n=an(null);er(()=>tr(()=>{n.value?.focus(),n.value?.select()}));const s=Yt(()=>o.value.trim().toLowerCase()),r=Yt(()=>{if(!t.options.length)return[];const c=s.value,d=[],f=[];for(const h of t.options){const m=h.name.toLowerCase();!c||m.startsWith(c)?d.push(h):m.includes(c)&&f.push(h)}return[...d,...f].slice(0,8)}),i=Yt(()=>t.takenText&&s.value?t.takenText(o.value.trim()):"");function l(){const c=o.value.trim();if(!c){n.value?.focus();return}if(i.value&&t.onPick){t.onPick(c);return}t.onAdd(c)}return(c,d)=>(x(),_(z,null,[g("label",Dl,A(e.label),1),or(g("input",{ref_key:"input",ref:n,"data-sve-css-add-input":"","onUpdate:modelValue":d[0]||(d[0]=f=>o.value=f),type:"text",placeholder:e.placeholder,onKeydown:[rn(E(l,["prevent"]),["enter"]),d[1]||(d[1]=rn(E(f=>e.onClose?.(),["stop","prevent"]),["escape"]))]},null,40,Hl),[[nr,o.value]]),i.value?(x(),_("div",jl,A(i.value),1)):j("",!0),e.options.length?(x(),_(z,{key:1},[g("div",zl,A(e.existingLabel),1),g("div",Wl,[(x(!0),_(z,null,ae(r.value,f=>(x(),_("button",{key:f.name,type:"button","data-sve-css-add-option":"",onMousedown:d[2]||(d[2]=E(()=>{},["prevent"])),onClick:E(h=>e.onPick?.(f.name),["prevent","stop"])},[g("span",Nl,A(f.name),1),g("span",ql,A(f.detail),1)],40,Rl))),128)),r.value.length?j("",!0):(x(),_("div",Vl,"—"))]),g("button",{type:"button","data-sve-css-add-create":"",disabled:!!i.value||!s.value,onMousedown:d[3]||(d[3]=E(()=>{},["prevent"])),onClick:E(l,["prevent","stop"])},A(e.createLabel),41,Ul)],64)):j("",!0)],64))}};function _n(e,t){t._sveLockBound||(t._sveLockBound=!0,t.querySelector("[data-sve-code-lock]")?.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),!(!a.lockReady||!a.lastType)){if(a.lastLocked){Gl(e);return}Cs(e,!0)}}))}function Ho(e){return e?X(e,Wa)!=="0":!0}function Kl(){const e=v.html;return!e||e.state.readOnly||!a.lastType?!1:!Vo(qo(),a.lastParts)}function Z(e){const t=e?.document.getElementById(u),o=t?.querySelector("[data-sve-code-autosave]"),n=t?.querySelector("[data-sve-code-save]");if(!o||!n)return;const s=Ho(e),r=Kl();o.setAttribute("aria-pressed",s?"true":"false"),o.title=p(e,s?"code_dock_autosave_on":"code_dock_autosave_off"),o.setAttribute("aria-label",o.title),o.innerHTML=nf,n.hidden=s,n.title=p(e,"code_dock_save"),n.setAttribute("aria-label",n.title),n.innerHTML=sf,r?n.setAttribute("data-dirty",""):n.removeAttribute("data-dirty")}function wn(e,t){t._sveAutosaveBound||(t._sveAutosaveBound=!0,t.querySelector("[data-sve-code-autosave]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=!Ho(e);N(e,Wa,n?"1":"0"),n?W(e.document):a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null),Z(e)}),t.querySelector("[data-sve-code-save]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),W(e.document)}))}function Gl(e){e.document.getElementById(U)?.remove();const t=ei(e.document,ti,{title:p(e,"code_dock_unlock_title"),body:p(e,"code_dock_unlock_body"),buttons:[{value:"cancel",label:p(e,"cancel"),variant:"ghost"},{value:"ok",label:p(e,"code_dock_unlock_confirm"),variant:"primary"}],onPick:o=>{t.dismiss(),o==="ok"&&Cs(e,!1)}});t.host.id=U}function Cs(e,t){const o=a.lastType;if(!o)return;const n=()=>{a.lastType===o&&e.fetch("/!/sve/section-template/lock",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Zn(e),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:o,locked:t})}).then(async s=>{if(!s.ok)throw new Error(String(s.status));a.lastType===o&&(a.lastLocked=t,we(e),Pe(a.lastParts,t),q(e),I(e.document,t?p(e,"code_dock_locked"):""))}).catch(()=>{I(e.document,p(e,"code_dock_error"))})};if(t&&(W(e.document),a.saveInFlight)){a.saveInFlight.finally(n);return}n()}function Ts(e,t){const o=String(t||"");if(/^(header|footer)\//.test(o))return!0;const n=e?.Statamic?.$config?.get?.("sveChromeTemplates")||{};return Object.values(n).some(s=>s&&s.type===o)}function kt(e){const t=a.lastType;if(!a.lastUid||!t||String(t).startsWith("view:")||Ts(e,t)){cn(e);return}const o=cr(a.lastUid,e.document);cn(e,o.length?{sectionUids:o}:void 0)}function Xl(e,t,o){return a.saveInFlight=e.fetch("/!/sve/section-template",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Zn(e),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:t,html:o.html,css:o.css,js:o.js,...typeof o.tw=="string"?{tw:o.tw}:{},...Cr(e)?{props:a.lastProps}:{}})}).then(async n=>{if(n.status===423){a.lastLocked=!0,a.lockReady=!0,we(e),Pe(a.lastParts,!0),q(e),I(e.document,p(e,"code_dock_locked"));return}const s=await n.json().catch(()=>({}));if(!n.ok)throw new Error(s?.error==="not_writable"?"not_writable":String(n.status));if(a.lastType===t){if(a.lastParts=o,s?.tw_written===!1){a.twDirty=!0,I(e.document,p(e,"code_dock_tw_not_writable")),Z(e),kt(e);return}I(e.document,p(e,"code_dock_saved")),Z(e),e.setTimeout(()=>{const r=e.document.getElementById(u)?.querySelector("[data-sve-code-status]");r&&r.textContent===p(e,"code_dock_saved")&&(r.textContent="")},1800)}kt(e),e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"))}).catch(n=>{I(e.document,p(e,n?.message==="not_writable"?"code_dock_not_writable":"code_dock_error"))}).finally(()=>{a.saveInFlight=null}),a.saveInFlight}function W(e){a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null);const t=a.lastType,o=a.lastWin,n=v.html;if(!n||n.state.readOnly||!t||!o||!a.lockReady)return;const s=qo(),r=a.twCss!==null&&rs(o)&&jo(s.html)===a.twKey;Vo(s,a.lastParts)&&!(r&&a.twDirty)&&!a.propsDirty||(a.propsDirty=!1,r&&(s.tw=a.twCss,a.twDirty=!1),I(e,p(o,"code_dock_saving")),Xl(o,t,s))}function jo(e){return oi(e).sort().join(" ")}function As(){a.twCss=null,a.twKey="",a.twDirty=!1}function Yl(e,t){a.twCss=t,a.twKey=jo(e),a.twDirty=!1}function Ms(e,t){if(!e||!rs(e))return;const o=jo(t);o===a.twKey||a.twBusy||(a.twBusy=!0,sr(()=>import("./tw-compile-AWaJHJyk.js"),__vite__mapDeps([0,1]),import.meta.url).then(n=>n.compileTailwind(e,t)).then(n=>{a.twBusy=!1,a.twCss=n,a.twKey=o,a.twDirty=!0,Es(e,e.document)}).catch(n=>{a.twBusy=!1,console.error("[sve] tailwind compile",n)}))}function Es(e,t){a.saveTimer&&clearTimeout(a.saveTimer),a.saveTimer=e.setTimeout(()=>{a.saveTimer=null,W(t)},Ju)}function G(e){if(a.applying)return;const t=qo();if(Vo(t,a.lastParts)){Z(e);return}if(Z(e),Ms(e,t.html),!Ho(e)){I(e.document,p(e,"code_dock_unsaved"));return}I(e.document,p(e,"code_dock_saving")),Es(e,e.document)}function Ls(e,t){let o=0;const n=Math.min(e.length,t.length);for(;o<n&&e[o]===t[o];)o+=1;let s=e.length,r=t.length;for(;s>o&&r>o&&e[s-1]===t[r-1];)s-=1,r-=1;return[o,s,t.slice(o,r)]}function Fs(e){const t=a.lastUid,o=typeof V=="function"?V(e.document):[];for(const n of o){const s=he(n.values)||n.values;if(!(!s||typeof s!="object")&&t&&typeof ln=="function"){const r=ln(s,t);if(r){const i=r.split("."),l=ar(s,i.slice(0,2).join("."));if(l&&typeof l=="object")return l}}}for(const n of o){const s=he(n.values)||n.values;if(s&&typeof s=="object")return s}return null}function Bs(e,t){!t||t===a.lastType||(W(e.document),De(e,t,"push"))}function Is(e){const t=a.typeStack.pop();if(!t){Fe(e);return}W(e.document),De(e,t,"keep")}function we(e){const t=e.document.getElementById(u),o=t?.querySelector("[data-sve-code-lock]"),n=t?.querySelector("[data-sve-code-lock-banner]");if(!t||!o)return;const s=a.lastLocked;t.toggleAttribute("data-sve-code-locked",s),s&&(ls(e.document),oe(e.document),a.htmlPartialUi&&(a.htmlPartialUi.setHover(v.html,null),a.htmlPartialUi.setHover(v.css,null)),a.htmlClassTokenUi?.setHover(v.html,null)),o.hidden=!a.lockReady,o.setAttribute("aria-pressed",a.lastLocked?"true":"false"),o.title=p(e,a.lastLocked?"code_dock_unlock":"code_dock_lock"),o.setAttribute("aria-label",o.title),o.innerHTML=a.lastLocked?Qu:ef,n&&(n.textContent=p(e,"code_dock_locked_banner"))}function et(e){return e?X(e,Ut)!=="0":a.htmlScopePref}function Pt(e,t,o){return e!=null&&t!=null&&e>=0&&t>e&&t<=o}function ne(){const e=globalThis.document?.getElementById(u);e&&(e.__sveHtmlScope=a.htmlScopeActive&&a.htmlFocus?{full:a.htmlFull,from:a.htmlFocus.from,to:a.htmlFocus.to,css:a.cssFull}:null)}function tt(){const e=v.html?.state.doc.toString()??"";if(!a.htmlScopeActive||!a.htmlFocus){a.htmlFull=e,ne();return}if(a.htmlFocus.from<0||a.htmlFocus.from>a.htmlFull.length||a.htmlFocus.to<a.htmlFocus.from){a.htmlScopeActive=!1,a.htmlFull=e,a.htmlFocus=null,ne();return}a.htmlFull=a.htmlFull.slice(0,a.htmlFocus.from)+e+a.htmlFull.slice(a.htmlFocus.to),a.htmlFocus={from:a.htmlFocus.from,to:a.htmlFocus.from+e.length},ne()}function me(){return tt(),a.htmlScopeActive?a.htmlFull:v.html?.state.doc.toString()??a.lastParts.html??""}function Dt(){a.lastBracketNames=So(me()).map(e=>e.name)}function Ie(){a.lastCssSelectorNames=is(v.css?.state.doc.toString()??a.cssFull)}function Os(e,t){return Array.isArray(e)&&Array.isArray(t)&&e.length===t.length&&e.every((o,n)=>o===t[n])}function Zl(){const e=a.htmlScopeActive?zo():me(),t=At(e);t.length&&(a.cssFull=Co(a.cssFull,$o(a.cssFull,t),t[0].className))}function Ps(e,t){a.cssFull=Mr(a.cssFull,e,t),Zl(),a.cssFull=Er(a.cssFull,t,e)}function Jl(e){if(a.applying||a.lastLocked||a.lastBracketNames==null)return;const t=So(me()).map(o=>o.name);Os(a.lastBracketNames,t)||(Ps(a.lastBracketNames,t),a.lastBracketNames=t,Oe(),Ie())}function Ql(){if(a.applying||a.lastLocked||a.lastCssSelectorNames==null||a.lastBracketNames==null||a.cssPane==="empty")return;const e=v.html,t=is(v.css?.state.doc.toString()??"");if(!e||Os(a.lastCssSelectorNames,t))return;const o=new Set(a.lastBracketNames),{renamed:n,removed:s}=Ar(a.lastCssSelectorNames,t);let r=e.state.doc.toString();const i=r;for(const l of n){const c=Ke(l.to);!o.has(l.from)||!c||(r=hn(r,d=>d===l.from?c:d))}for(const l of s)!o.has(l)||t.includes(l)||(r=hn(r,c=>c===l?"":c));if(r!==i){a.applying=!0;try{Ht(r)}finally{a.applying=!1}}Dt(),a.lastCssSelectorNames=t}function ec(e,t){const o=Ke(t),n=v.html;if(!o||!n||n.state.readOnly||o===e.name)return;a.applying=!0;try{n.dispatch({changes:{from:e.from,to:e.to,insert:o}})}finally{a.applying=!1}const s=a.lastBracketNames==null?[]:a.lastBracketNames.slice();Dt(),Ps(s,a.lastBracketNames),Oe(),Ie(),a.lastWin&&(G(a.lastWin),L(a.lastWin))}function tc(e,t){const o=e.document,s=v.html?.coordsAtPos(t.from);$(o),oe(o);const r=o.createElement("div"),i={getBoundingClientRect:()=>({left:s?.left??12,right:s?.right??12,top:s?.top??12,bottom:s?.bottom??12,width:0,height:0})};r.id=y,o.body.appendChild(r),D(e,i,r),r._sveApp=H(Do,r,{label:p(e,"code_dock_css_rename_class"),placeholder:p(e,"code_dock_css_class_placeholder"),initial:t.name,onAdd:l=>{ec(t,l),$(o)}})}function Ds(){return a.htmlScopePref&&Pt(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)?(a.htmlScopeActive=!0,ne(),a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to)):(a.htmlScopeActive=!1,ne(),a.htmlFull)}function ot(e,t,o){const n=v[e];if(!n)return;const s=n.state.doc.toString();a.applying=!0;try{if(s!==t){const[r,i,l]=Ls(s,t);n.dispatch({changes:{from:r,to:i,insert:l},...o?{selection:o,scrollIntoView:!0}:{}})}else o&&n.dispatch({selection:o,scrollIntoView:!0})}finally{a.applying=!1}}function Ht(e,t){ot("html",e,t)}function zo(){return a.htmlScopeActive?v.html?.state.doc.toString()??"":Pt(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)?a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to):""}function Hs(){const e=a.cssFocus?.path;if(!e)return null;const t=me(),o=Mt(Et(t),new Set).find(n=>n.path===e);return o?t.slice(o.from,o.to):(a.cssFocus=null,null)}function oc(){return Hs()??zo()}function Wf(){a.cssFocus=null}function nc(e){if(!e||a.applying||a.cssValues)return;const t=v.html;if(!t)return;tt(),ee();const o=a.htmlScopeActive&&!!a.htmlFocus,s=(o?a.htmlFocus.from:0)+t.state.selection.main.from;let r=null;for(const l of Mt(Et(a.htmlFull),new Set))l.from<=s&&s<l.to&&(r=l);!r||s<r.from||s>=r.openTo||(a.cssFocus?a.cssFocus.path===r.path:o&&a.htmlFocus.from===r.from&&a.htmlFocus.to===r.to)||(a.cssFocus={path:r.path},Oe())}function ee(){const e=v.css?.state.doc.toString()??"";if(a.cssPane==="tree"){if(e===a.cssScopeSnapshot)return;const t=At(oc())[0]?.className||Tr(e);a.cssFull=Co(a.cssFull,e,t),a.cssScopeSnapshot=e}else a.cssPane==="full"&&(a.cssFull=e)}function js(e,t){for(const o of t||[])if(!To(e,o.className)||js(e,o.children))return!0;return!1}function Oe(){let e=a.cssFull,t=[],o=!1;const n=Hs();a.cssValues||n==null&&(!a.htmlScopePref||!a.htmlScopeActive)?(a.cssPane="full",e=a.cssFull):(t=At(n??zo()),t.length?(a.cssPane="tree",e=$o(a.cssFull,t),!a.cssFocus&&js(a.cssFull,t)&&(a.cssFull=Co(a.cssFull,e,t[0].className),o=!0)):(a.cssPane="empty",e="")),a.cssScopeSnapshot=e,ot("css",e),Ie(),a.lastWin&&(rt(a.lastWin,!0),L(a.lastWin),o&&G(a.lastWin))}function Wo(e){const t=v.html;if(!t||!a.htmlFocus)return;a.htmlScopeActive||(a.htmlFull=t.state.doc.toString());const o=a.htmlFull.length,n=Math.max(0,Math.min(a.htmlFocus.from,o)),s=Math.max(n,Math.min(a.htmlFocus.to,o));if(s<=n)return;a.htmlFocus={from:n,to:s},a.htmlScopeActive=!0,ne();const r=e==null?0:Math.max(0,Math.min(e-n,s-n));Ht(a.htmlFull.slice(n,s),{anchor:r,head:r}),Oe(),t.focus()}function Ro(e=!0,t=null){const o=v.html;if(!o)return;ee(),tt(),a.htmlScopeActive=!1,ne();const n=a.htmlFull||o.state.doc.toString(),s=t!=null?{anchor:Math.max(0,Math.min(t,n.length))}:e&&Pt(a.htmlFocus?.from,a.htmlFocus?.to,n.length)?{anchor:a.htmlFocus.from,head:a.htmlFocus.to}:null;a.htmlFull=n,Ht(n,s),a.cssPane="full",a.cssScopeSnapshot=a.cssFull,ot("css",a.cssFull),Ie()}function nt(){a.htmlFocus=null,a.cssFocus=null,a.htmlScopeActive=!1,a.htmlFull="",a.cssFull="",a.cssPane="full",a.cssScopeSnapshot="",a.lastBracketNames=null,a.lastCssSelectorNames=null,ne()}let Ge=!1;function Ae(e){return!!e?.document.getElementById(Xn)}function ao(e,t){if(!(!e||yo(e,"html_tree")===!1)){if(!t){Ae(e)&&Qn(e);return}Ae(e)||(Ge=!0,dr("html_tree").then(()=>{Ae(e)||ur(e)}).catch(()=>{}).finally(()=>{Ge=!1,q(e)}))}}function q(e){const t=e?.document.getElementById(u)?.querySelector("[data-sve-html-scope]");if(!t)return;a.htmlScopePref=et(e);const o=yo(e,"html_tree")===!1?a.htmlScopePref:Ae(e)||Ge;t.setAttribute("aria-pressed",o?"true":"false"),t.title=p(e,o?"code_dock_html_scope_off":"code_dock_html_scope"),t.setAttribute("aria-label",t.title),t.innerHTML=qa,e.document.getElementById(u)?.toggleAttribute("data-sve-html-scoped",a.htmlScopeActive),ne()}function Sn(e,t){t._sveHtmlScopeBound||(t._sveHtmlScopeBound=!0,a.htmlScopePref=et(e),sc(e,t),ao(e,a.htmlScopePref),t.querySelector("[data-sve-html-scope]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=Ae(e)||Ge;a.htmlScopePref=!n,N(e,Ut,a.htmlScopePref?"1":"0"),a.htmlScopePref?a.htmlFocus&&(ee(),Wo()):a.htmlScopeActive&&Ro(),ao(e,a.htmlScopePref),q(e)}))}function sc(e,t){t._sveTreeWatchBound||(t._sveTreeWatchBound=!0,e.addEventListener("sve-right-dock-change",()=>{if(Ge||yo(e,"html_tree")===!1||!e.document.getElementById(u))return;const o=Ae(e);o!==et(e)&&(a.htmlScopePref=o,N(e,Ut,o?"1":"0"),o?a.htmlFocus&&(ee(),Wo()):a.htmlScopeActive&&Ro(),q(e))}))}const ac=new Set(["pre","textarea","script","style"]),rc=/^(<\/|\{\{\s*\/)/;function ic(e){let t=0;for(const o of e.split(`
`)){if(!o.trim())continue;const n=o.length-o.trimStart().length;n>0&&(t===0||n<t)&&(t=n)}return" ".repeat(t===2||t===3?t:4)}function lc(e){const t=String(e||"");if(!t.trim())return t;const o=[],n=l=>{for(const c of l||[])o.push(c),n(c.children)};n(Lr(t));const s=ic(t),r=[];let i=0;for(const l of t.split(`
`)){const c=i,d=l.trim();i+=l.length+1;const f=c+(l.length-l.trimStart().length),h=o.filter(b=>b.from<f&&f<b.to);if(h.some(b=>ac.has(b.tag))){r.push(l);continue}if(!d)continue;const m=h.length-(rc.test(d)?1:0);r.push(s.repeat(Math.max(m,0))+d)}return r.join(`
`)+(t.endsWith(`
`)?`
`:"")}function ro(e,t){let o=0;for(;o<t;){const n=cc(e,o);if(n===null){o+=1;continue}if(n===-1)return t;if(n>t)return n;o=n}return t}function cc(e,t){if(e.startsWith("{{",t)){const o=e.indexOf("}}",t+2);return o===-1?-1:o+2}if(e.startsWith("<!--",t)){const o=e.indexOf("-->",t+4);return o===-1?-1:o+3}return e[t]==="<"&&/[A-Za-z/!?]/.test(e[t+1]||"")?dc(e,t):null}function dc(e,t){let o="",n=t+1;for(;n<e.length;){const s=e[n];if(o){s===o&&(o=""),n+=1;continue}if(e.startsWith("{{",n)){const r=e.indexOf("}}",n+2);if(r===-1)return-1;n=r+2;continue}if(s==='"'||s==="'"){o=s,n+=1;continue}if(s===">")return n+1;if(s==="<")return-1;n+=1}return-1}function No(e,t){if(e.startsWith("{{",t)){const o=e.indexOf("}}",t+2);return o===-1?e.length:o+2}if(e.startsWith("<!--",t)){const o=e.indexOf("-->",t+4);return o===-1?e.length:o+3}return t}function xt(e,t){if(e[t]!=="<")return null;const o=e.indexOf(">",t+1);if(o===-1)return null;const n=e.slice(t,o+1),s=n.match(/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/);if(s)return{kind:"close",name:s[1].toLowerCase(),from:t,to:o+1};const r=n.match(/^<([A-Za-z][A-Za-z0-9:-]*)/);if(!r)return{kind:"other",from:t,to:o+1};const i=r[1].toLowerCase();return{kind:/\/\s*>$/.test(n)||["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"].includes(i)?"void":"open",name:i,from:t,to:o+1}}function io(e,t,o){let n=1,s=o;for(;s<e.length;){const r=No(e,s);if(r!==s){s=r;continue}if(e[s]!=="<"){s+=1;continue}const i=xt(e,s);if(!i)break;if(i.kind==="open"&&i.name===t)n+=1;else if(i.kind==="close"&&i.name===t&&(n-=1,n===0))return i;s=i.to}return null}function uc(e,t){const o=[];let n=0;for(;n<t;){const s=No(e,n);if(s!==n){n=s;continue}if(e[n]!=="<"){n+=1;continue}const r=xt(e,n);if(!r)return null;if(t<r.to){if(r.kind==="open")return{name:r.name,open:r,close:io(e,r.name,r.to),at:"open"};if(r.kind==="void")return{name:r.name,open:r,close:null,at:"open"};if(r.kind==="close"){let i=null;for(let l=o.length-1;l>=0;l-=1)if(o[l].name===r.name){i=o[l];break}return{name:r.name,open:i,close:r,at:"close"}}return null}if(r.kind==="open")o.push(r);else if(r.kind==="close"){for(let i=o.length-1;i>=0;i-=1)if(o[i].name===r.name){o.splice(i);break}}n=r.to}return null}function st(){const e=v.html;if(!e)return null;const t=e.state.selection.main.head,o=e.state.doc.toString(),n=[];let s=0;for(;s<t;){const c=No(o,s);if(c!==s){s=c;continue}if(o[s]!=="<"){s+=1;continue}const d=xt(o,s);if(!d||d.from>=t)break;if(d.kind==="open")n.push(d);else if(d.kind==="close"){for(let f=n.length-1;f>=0;f-=1)if(n[f].name===d.name){n.splice(f);break}}s=d.to}const r=o.lastIndexOf("<",Math.max(0,t-1));if(r!==-1&&o.indexOf(">",r)>=t){const c=xt(o,r);if(c?.kind==="open"||c?.kind==="void"){const d=c.kind==="void"?null:io(o,c.name,c.to);return d?{name:c.name,open:c,close:d}:{name:c.name,open:c,close:null}}}const i=n[n.length-1];if(!i)return null;const l=io(o,i.name,i.to);return{name:i.name,open:i,close:l}}function _t(e){return Va.includes(e)}function P(){v.html?.focus(),a.lastWin&&(G(a.lastWin),jt(a.lastWin))}function ke(e,t,o,n=void 0){const s=[...t].sort((r,i)=>i.from-r.from||i.to-r.to);e.dispatch({changes:s,selection:o,...n?{userEvent:n}:{}})}const Ce="input.toolbar";function Xe(e,t,o){const n=v.html;if(!n||n.state.readOnly)return;const s=n.state.selection.main.head,r=n.state.doc.lineAt(s),i=r.text.slice(0,s-r.from),l=r.text.trim()?ie(r.text):Wt(n,r)||ie(r.text);let c=e,d=0;if(i.trim()!=="")c=`
${l}${e}`,d=1+l.length;else if(!r.text.trim()){c=`${l}${e}`,d=l.length,n.dispatch({changes:{from:r.from,to:r.to,insert:c},selection:$n(r.from+d+t,o),userEvent:Ce});return}n.dispatch({changes:{from:s,to:n.state.selection.main.to,insert:c},selection:$n(s+d+t,o),userEvent:Ce})}function $n(e,t){return t?{anchor:e,head:e+t}:{anchor:e}}function zs(e){const{from:t}=e.state.selection.main,o=ro(e.state.doc.toString(),t);return o!==t&&e.dispatch({selection:{anchor:o}}),o}function Ws(e,t,o){const n=v.html;!n||n.state.readOnly||(zs(n),Xe(e,t,o))}const fc=new Set(["section","article","header","footer","main","nav","aside"]);function hc(e){return _t(e)||e==="p"||e==="a"}function Cn(e){if(e==="a")return'<a href="">';if(e!=="section")return`<${e}>`;const t=a.lastWin?.Statamic?.$config?.get?.("sveSectionTag");return typeof t=="string"&&t.trim()?`<${e} ${t.trim()}>`:`<${e}>`}function Rs(){const e=v.html;if(!e||e.state.readOnly)return;const t=e.state.doc.toString(),o=(t.match(/^[ \t]*/)||[""])[0],n=lc(t).split(`
`).map(s=>s&&o+s).join(`
`);n!==t&&(ke(e,[{from:0,to:t.length,insert:n}],{anchor:0}),P())}function Ns(e){const t=v.html;if(!t||t.state.readOnly)return;const o=t.state.selection.main,n=t.state.doc.toString();if(!o.empty&&ro(n,o.from)===o.from&&ro(n,o.to)===o.to){const f=n.slice(o.from,o.to),h=f.match(new RegExp(`^<${e}(\\s[^>]*)?>([\\s\\S]*)</${e}>$`,"i"));if(h){ke(t,[{from:o.from,to:o.to,insert:h[2]}],{anchor:o.from,head:o.from+h[2].length},Ce),P();return}const m=Cn(e);let b=`${m}${f}</${e}>`,k=o.from+m.length;e==="ul"&&(b=`<ul>
  <li>${f}</li>
</ul>`,k=o.from+11),ke(t,[{from:o.from,to:o.to,insert:b}],{anchor:k,head:k+f.length},Ce),P();return}const r=o.head,i=uc(n,r);if(i&&i.name===e&&i.open&&i.close){ke(t,[{from:i.close.from,to:i.close.to,insert:""},{from:i.open.from,to:i.open.to,insert:""}],{anchor:i.open.from},Ce),P();return}const l=st();if(l?.open&&l.close&&_t(l.name)&&_t(e)&&l.name!==e){const f=n.slice(l.open.from,l.open.to).replace(new RegExp(`^<${l.name}`,"i"),`<${e}`);ke(t,[{from:l.close.from,to:l.close.to,insert:`</${e}>`},{from:l.open.from,to:l.open.to,insert:f}],{anchor:l.open.from+e.length+1},Ce),P();return}l?.open&&l.name===e&&hc(e)&&t.dispatch({selection:{anchor:l.close?l.close.to:l.open.to}}),zs(t);const d=(t.state.doc.lineAt(t.state.selection.main.head).text.match(/^\s*/)||[""])[0];if(e==="ul"){const f=`<ul>
${d}  <li></li>
${d}</ul>`;Xe(f,`<ul>
${d}  <li>`.length)}else{const f=Cn(e),h=`${f}</${e}>`,m=e==="a"?f.indexOf('""')+1:fc.has(e)?f.length:h.length;Xe(h,m)}P()}function jt(e){try{pc(e)}catch{}}function pc(e){const t=e?.document?.getElementById(u),n=st()?.name||"";if(t)for(const s of vo){const r=t.querySelector(`[data-sve-html-tool="${s.id}"]`);if(!r)continue;(s.id==="heading"?_t(n):n===s.tag)?r.setAttribute("data-active",""):r.removeAttribute("data-active")}}function Tn(e,t,o){const n=e.document,s=st()?.name||"";$(n),t.setAttribute("data-open","");const r=n.createElement("div");r.id=y,n.body.appendChild(r),D(e,t,r),r._sveApp=H(Q,r,{kind:"choices",choices:o.map(i=>({value:i,label:i.toUpperCase(),active:s===i})),onPick:i=>{Ns(i),$(n)}})}function mc(e,t){const o=e.document;$(o),t.setAttribute("data-open","");const n=o.createElement("div");n.id=y,o.body.appendChild(n),D(e,t,n);const s=r=>{o.getElementById(y)&&(n._sveApp?.unmount(),n._sveApp=H(Q,n,{kind:"choices",choices:r,onPick:i=>{i&&(Ws(i,i.length),P()),$(o)}}),D(e,t,n))};s([{value:"",label:p(e,"code_dock_loading")}]),e.fetch("/!/sve/components",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(r=>r.ok?r.json():{items:[]}).then(r=>{const i=Array.isArray(r.items)?r.items:[];s(i.length?i.map(l=>({value:l.tag,label:l.name})):[{value:"",label:p(e,"component_none")}])}).catch(()=>s([{value:"",label:p(e,"component_none")}]))}function An(e){const t=Ke(e),o=v.html,n=v.css;if(!t||o?.state.readOnly||n?.state.readOnly)return;const s=st();if(s?.open&&o){const r=o.state.doc.sliceString(s.open.from,s.open.to),i=Fr(r,t);i!==r&&o.dispatch({changes:{from:s.open.from,to:s.open.to,insert:i}})}ee(),To(a.cssFull,t)||(a.cssFull=`${String(a.cssFull||"").trimEnd()}${a.cssFull?.trim()?`
`:""}.${t} {
}
`),Oe(),Dt(),Ie(),a.lastWin&&(G(a.lastWin),jt(a.lastWin),L(a.lastWin))}function vc(e,t){const o=e.document;if(t.hasAttribute("data-open")){$(o);return}$(o),t.setAttribute("data-open","");const n=o.createElement("div");n.id=y,o.body.appendChild(n),D(e,t,n);const s=l=>{const c=Ke(l);if(!c)return"";if(To(a.cssFull,c))return p(e,"class_exists_here");const d=[...new Set(Oo(e,c).map(f=>String(f.file).replace(/^.*\//,"")))];return d.length?p(e,"class_exists_pick",{file:d.join(", ")}):""},r=l=>{An(l),Po(e,Ke(l)),$(o)},i=()=>{if(!o.getElementById(y))return;const l=n.querySelector("[data-sve-css-add-input]")?.value||"";n._sveApp?.unmount(),n._sveApp=H(Do,n,{label:p(e,"code_dock_css_class_name"),placeholder:p(e,"code_dock_css_class_placeholder"),initial:l,options:$l(e,p(e,"class_this_file")),existingLabel:p(e,"code_dock_css_class_existing"),createLabel:p(e,"code_dock_css_class_create"),takenText:s,onPick:r,onClose:()=>$(o),onAdd:c=>{An(c),$(o)}}),D(e,t,n)};i(),Io(e).then(i)}function gc(e,t){const o=t.querySelector("[data-sve-css-add-class]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=af,o.title=p(e,"code_dock_css_add_class"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),a.styleMode==="tw"){$(e.document),Br(e,o);return}vc(e,o)}))}function qo(){const e={html:"",css:"",js:""};tt(),ee();for(const t of se)t==="html"?e.html=a.htmlScopeActive?a.htmlFull:v.html?.state.doc.toString()??"":t==="css"?(e.css=a.lastWin?rl(a.cssFull,ve(a.lastWin)):a.cssFull,e.css=Fl(e.css,e.html,Xu)):e[t]=v[t]?.state.doc.toString()??"";return e}function qs(){if(a.cssValues||!(a.htmlScopePref&&Pt(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)))return a.cssPane="full",a.cssScopeSnapshot=a.cssFull,a.cssFull;const e=At(a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to));if(!e.length)return a.cssPane="empty",a.cssScopeSnapshot="","";a.cssPane="tree";const t=$o(a.cssFull,e);return a.cssScopeSnapshot=t,t}function Pe(e,t){a.applying=!0;try{a.lastWin&&(a.htmlScopePref=et(a.lastWin)),a.htmlFull=e.html??"",a.cssFull=e.css??"";for(const o of se){const n=v[o];let s=e[o]??"";try{s=o==="html"?Ds():o==="css"?qs():s}catch{s=o==="html"?a.htmlFull||e.html||"":o==="css"?a.cssFull||e.css||"":s}if(!n)continue;const r=n.state.doc.toString(),i=[qe[o].reconfigure(Je.readOnly.of(!!t)),Ve[o].reconfigure(F.editable.of(!t))];r!==s?n.dispatch({changes:{from:0,to:r.length,insert:s},effects:i}):n.dispatch({effects:i})}}finally{a.applying=!1}Dt(),Ie(),xo("dock:html-changed"),a.lastWin&&(L(a.lastWin),jt(a.lastWin),q(a.lastWin),it(a.lastWin))}function Vo(e,t){return e.html===t.html&&e.css===t.css&&e.js===t.js}function Vs(e){return String(e||"").replace(/\/\*[\s\S]*?\*\//g,"").trim().replace(/\s*:\s*/g,": ").replace(/\s*;\s*/g,";").replace(/\s+/g," ").replace(/;+$/,";")}function Us(e){const t=Vs(e).match(/^([a-z-]+)\s*:/i);return t?t[1].toLowerCase():""}function Ks(e){const t=Vs(e),o=t.indexOf(":");return o===-1?"":t.slice(o+1).replace(/;$/,"").trim().toLowerCase()}function B(e){const t=String(e||"").trim().toLowerCase();return t==="start"||t==="flex-start"||t==="left"||t==="top"?"flex-start":t==="end"||t==="flex-end"||t==="right"||t==="bottom"?"flex-end":t==="row-reverse"?"row-reverse":t==="column-reverse"?"column-reverse":t}function Ye(e){const t=B(e);return t==="flex"||t==="inline-flex"}function zt(){const e=v.css;if(!e)return null;const t=e.state.selection.main.head,o=e.state.doc.toString(),n=[],s=[];for(let i=0;i<o.length;i+=1){if(o[i]==="{"&&o[i+1]==="{"){const l=o.indexOf("}}",i+2);if(l===-1)break;i=l+1;continue}if(o[i]==="{")n.push(i);else if(o[i]==="}"){const l=n.pop();l!=null&&s.push({from:l+1,to:i,text:o.slice(l+1,i),open:l})}}let r=null;for(const i of s)t<i.open||t>i.to||(!r||i.to-i.open<r.to-r.open)&&(r=i);return r}function bc(e){const t=String(e||"");let o="",n=0;for(let s=0;s<t.length;s+=1){if(t[s]==="{"&&t[s+1]==="{"){const r=t.indexOf("}}",s+2);if(r===-1)break;n===0&&(o+=t.slice(s,r+2)),s=r+1;continue}if(t[s]==="{"){n+=1;continue}if(t[s]==="}"){n=Math.max(0,n-1);continue}n===0&&(o+=t[s])}return o}function Mn(e){const t={};for(const o of bc(e).split(";")){const n=Us(o);n&&(t[n]=Ks(`${o};`))}return t}function yc(e,t,o){if(!t||t.from>=t.to)return null;let n=e.state.doc.lineAt(t.from),s=0;for(;n.from<=t.to;){const r=Math.max(n.from,t.from),i=Math.min(n.to,t.to),l=e.state.doc.sliceString(r,i);if(s===0&&Us(l)===o)return{from:r,to:i,text:l};if(s+=kc(l),n.to>=e.state.doc.length||n.to>=t.to)break;n=e.state.doc.lineAt(n.to+1)}return null}function kc(e){let t=0;const o=String(e);for(let n=0;n<o.length;n+=1){if(o[n]==="{"&&o[n+1]==="{"){const s=o.indexOf("}}",n+2);n=s===-1?o.length:s+1;continue}o[n]==="{"?t+=1:o[n]==="}"&&(t-=1)}return t}function ie(e){return(String(e).match(/^\s*/)||[""])[0]}function Wt(e,t,o){for(let n=t.number-1;n>=1;n-=1){const s=e.state.doc.line(n),r=s.text.trim();if(!r)continue;const i=ie(s.text);if(o&&(r==="{"||r.endsWith("{")))return`${i}  `;if(!(r==="}"||r.startsWith("}")))return i}return""}function xc(e,t){const o=e.state.doc.lineAt(t);if(o.text.trim())return ie(o.text);const n=Wt(e,o,!0);if(n)return n;const s=zt();return s?Gs(e,s):"  "}function Gs(e,t){const o=e.state.doc.lineAt(t.from),n=e.state.doc.lineAt(Math.max(t.from,t.to));for(let r=n.number;r>=o.number;r-=1){const i=e.state.doc.line(r),l=Math.max(i.from,t.from),c=Math.min(i.to,t.to),d=e.state.doc.sliceString(l,c);if(d.trim())return(d.match(/^\s*/)||[""])[0]||"  "}return`${(e.state.doc.lineAt(Math.max(0,t.from-1)).text.match(/^\s*/)||[""])[0]}  `}function En(){v.css?.focus(),a.lastWin&&(G(a.lastWin),L(a.lastWin))}function Xs(e,t){if(!t)return"";const o=e.state.doc.toString();let n=0;for(let s=t.open-1;s>=0;s-=1)if(o[s]==="}"||o[s]==="{"||o[s]===";"){n=s+1;break}return o.slice(n,t.open).replace(/\/\*[\s\S]*?\*\//g,"").trim()}function _c(e,t){if(!a.cssState||!t)return t;const o=Ys(e,t);if(o)return o;const n=Xs(e,t);if(!n||n.startsWith("@"))return t;const s=e.state.doc.toString(),r=xe(s,t.open),i=xe(s,t.to)||`${r}    `,l=(e.state.doc.sliceString(t.from,t.to).match(/\n([^\S\n]*)$/)||[null,null])[1],c=l===null?t.to:t.to-l.length,d=`
${i}&${Nt()} {
${i}}
${l??r}`;e.dispatch({changes:{from:c,to:t.to,insert:d}});const f=e.state.doc.toString(),h=f.indexOf("{",c+d.indexOf("&")),m=h===-1?-1:Ao(f,h);return m===-1?t:{from:h+1,to:m,text:f.slice(h+1,m),open:h}}function xe(e,t){const o=e.lastIndexOf(`
`,t-1)+1;return(e.slice(o,t).match(/^\s*/)||[""])[0]}function K(e){const t=v.css;if(!t||t.state.readOnly||!e.length)return;const o=zt(),n=e.some(l=>l.value!=null)?_c(t,o):o;if(!n){const l=e.filter(c=>c.value!=null).map(c=>`${c.property}: ${c.value};`).join(`
`);l&&$c(l),En();return}const s=[],r=[],i=Gs(t,n);for(const l of e){const c=yc(t,n,l.property);if(l.value==null){if(!c)continue;let d=c.from,f=c.to;t.state.doc.sliceString(f,f+1)===`
`&&(f+=1),d=Math.max(d,n.from),f=Math.min(f,n.to),s.push({from:d,to:f});continue}if(!(c&&B(Ks(c.text))===B(l.value)))if(c){const d=(c.text.match(/^\s*/)||[""])[0];s.push({from:c.from,to:c.to,insert:`${d}${l.property}: ${l.value};`})}else r.push(`${i}${l.property}: ${l.value};`)}if(r.length){const l=!n.text.includes(`
`)||!/\n\s*$/.test(n.text)?`
`:"",c=(n.text.match(/\n([^\S\n]*)$/)||[null,null])[1],d=c===null?n.to:n.to-c.length,f=c===null?"":c;s.push({from:d,to:n.to,insert:`${l}${r.join(`
`)}
${f}`})}s.length&&(s.sort((l,c)=>c.from-l.from||c.to-l.to),t.dispatch({changes:s})),En()}function Y(){const e=v.css,t=zt();if(!t)return{};if(a.cssState&&e){const o=Ys(e,t);return o?Mn(o.text):{}}return Mn(t.text)}function Ys(e,t){const o=Xs(e,t),n=Nt();if(!o||o.startsWith("@"))return null;if(o.endsWith(n))return t;const s=e.state.doc.toString(),r=i=>{const l=Ao(s,i);return l===-1?null:{from:i+1,to:l,text:s.slice(i+1,l),open:i}};for(const i of[`&${n}`,`${o}${n}`]){const l=new RegExp(`(^|[^\\w-])${i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\s*\\{`,"g");let c;for(;c=l.exec(s);){const d=s.indexOf("{",c.index);if(i.startsWith("&")&&(d<t.from||d>t.to))continue;const f=r(d);if(f)return f}}return null}function wc(e){const t=Y(),o=Ye(t.display),n=B(t["flex-direction"])||(o?"row":"");if(o&&n===e){const s=[];t["flex-direction"]&&s.push({property:"flex-direction",value:null}),Ye(t.display)&&s.push({property:"display",value:null}),K(s);return}K([{property:"display",value:"flex"},{property:"flex-direction",value:e}])}function Sc(e){const t=Y();if(e==="flex"&&Ye(t.display)){K([{property:"justify-content",value:null},{property:"align-items",value:null},{property:"flex-direction",value:null},{property:"display",value:null}]);return}K([{property:"display",value:e}])}function $c(e){const t=v.css;if(!t||t.state.readOnly)return;const o=t.state.selection.main.head,n=t.state.doc.lineAt(o),s=n.text.slice(0,o-n.from),r=n.text.slice(o-n.from),i=xc(t,o),l=e.replace(/;?$/,";");if(s.trim()===""&&r.trim()===""){const d=`${i}${l}
${i}`;t.dispatch({changes:{from:n.from,to:n.to,insert:d},selection:{anchor:n.from+d.length}});return}const c=`
${i}${l}
${i}`;t.dispatch({changes:{from:o,to:t.state.selection.main.to,insert:c},selection:{anchor:o+c.length}})}function L(e){try{Cc(e),pe(e)}catch{}}function Cc(e){const t=a.styleMode==="tw",o=t?{}:Y(),n=Ye(t?pn("display"):o.display),s=B(o["flex-direction"])||(n?"row":""),r=i=>t?Pr()?i.twGroup?!!Dr(i.twGroup):!!i.tw&&!!pn(i.tw):!1:!!i.css&&i.css in o;ue.tools=Ka.map(i=>{const l=(i.kids||[]).filter(c=>c.when!=="flex"||n).map(c=>({id:c.id,title:c.title,icon:Gn[c.icon]||"",sep:!!c.sep,open:a.cssOpenMenu===c.id,active:t?r(c):c.kind==="display"?n:c.kind==="flexDir"?n&&s===c.value:c.value?B(o[c.css])===B(c.value):r(c)}));return{id:i.id,title:i.title,icon:Gn[i.id]||lf[i.id]||"",open:a.cssOpenTool===i.id||a.cssOpenMenu===i.id,kids:l,active:i.value?!t&&B(o[i.css])===B(i.value):r(i)||l.some(c=>c.active)}})}function Ze(e){$(e),a.cssOpenTool="",a.lastWin&&L(a.lastWin)}function $(e){const t=e?.getElementById(y);a.cssOpenMenu="",t?._sveApp?.unmount(),t?.remove(),e?.querySelectorAll("[data-sve-css-tool][data-open], [data-sve-html-tool][data-open], [data-sve-css-add-class][data-open], [data-sve-code-history][data-open]").forEach(o=>o.removeAttribute("data-open"))}function Rf(e){$(e),R(e),oe(e);for(const t of se)v[t]&&Ea?.(v[t])}function Zs(e){if(a.cssColorsPromise)return a.cssColorsPromise;const t=e.Statamic?.$config?.get?.("cpUrl")||`/${e.Statamic?.$config?.get?.("cpRoute")||"cp"}`;return a.cssColorsPromise=e.fetch(`${t}/color-scheme/swatches`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async o=>{if(!o.ok)return[];const n=await o.json().catch(()=>[]);return Array.isArray(n)?n:[]}).catch(()=>[]).then(o=>{const n=new Set,s=[];for(const r of o){const i=r.var||r.value||r.handle,l=String(i||"").trim().replace(/^var\((.+)\)$/,"$1");!l||n.has(l)||(n.add(l),s.push({name:l,hex:r.hex||r.color||""}))}for(const[r,i]of Ua)n.has(r)||(n.add(r),s.push({name:r,hex:i}));return s}),a.cssColorsPromise}function Js(e,t){const o=Y()[t]||"",n=String(o).match(/^var\(\s*([^)]+?)\s*\)$/i),s=n?n[1].trim():"";for(const r of e.querySelectorAll("[data-sve-css-token]"))s&&r.getAttribute("data-sve-css-token")===s?r.setAttribute("data-active",""):r.removeAttribute("data-active")}function D(e,t,o){const n=t.getBoundingClientRect(),s=8,r=e.innerHeight-(n.bottom+4)-s,i=n.top-4-s;o.style.maxHeight="";const l=o.offsetHeight||0,c=l>r&&i>r;o.style.left=`${Math.max(s,Math.min(n.left,e.innerWidth-220))}px`,o.style.maxHeight=`${Math.max(120,c?i:r)}px`,o.style.top=c?`${Math.max(s,n.top-4-Math.min(l,i))}px`:`${Math.max(s,n.bottom+4)}px`}function Tc(e,t,o){const n=e.document;$(n),t.setAttribute("data-open","");const s=n.createElement("div");s.id=y,n.body.appendChild(s),D(e,t,s);const r=i=>{s._sveApp?.unmount(),s._sveApp=H(Q,s,{kind:"colors",swatches:i,onClear:()=>{K([{property:o,value:null}]),Ze(n)},onPick:l=>{K([{property:o,value:`var(${l})`}]),Ze(n)}}),Js(s,o)};r(Ua.map(([i,l])=>({name:i,hex:l}))),Zs(e).then(i=>{n.getElementById(y)&&r(i.map(l=>({name:l.name,hex:l.hex})))})}function Ac(e,t,o,n){const s=e.document;$(s),t.setAttribute("data-open","");const r=s.createElement("div"),i=Y()[o]||"";r.id=y,s.body.appendChild(r),D(e,t,r),r._sveApp=H(Q,r,{kind:"choices",choices:(n||[]).map(l=>({value:l,label:l,active:B(l)===B(i)})),onPick:l=>{const c=B(l)===B(Y()[o]||"");K([{property:o,value:c?null:l}]),Ze(s)}})}function Ln(e,t,o,n=[]){const s=e.document;$(s),t.setAttribute("data-open",""),Ir(e);const r=s.createElement("div");r.id=y,s.body.appendChild(r),D(e,t,r);const i=()=>{const l=[...n.map(d=>({value:d,label:d})),...Or(e,o).map(d=>({value:d.value,label:d.value}))],c=Y()[o]||"";r._sveApp?.unmount(),r._sveApp=H(Q,r,{kind:"choices",choices:l.map(d=>({...d,active:B(d.value)===B(c)})),onPick:d=>{K([{property:o,value:d||null}]),Ze(s)}})};i(),Zs(e).then(()=>{s.getElementById(y)===r&&i()})}function Mc(e,t,o){const n=e.document;$(n),t.setAttribute("data-open","");const s=n.createElement("div");s.id=y,n.body.appendChild(s),D(e,t,s),s._sveApp=H(Q,s,{kind:"choices",choices:rf.map(r=>({value:r,token:r,label:r})),onPick:r=>{K([{property:o,value:`var(${r})`}]),Ze(n)}}),Js(s,o)}const Fn=/\{\{#[\s\S]*?#\}\}|\{\{[\s\S]*?\}\}/g,Bn=/<!--[\s\S]*?-->/g,In=/<(\/?)([A-Za-z][A-Za-z0-9-]*)/g,Qs=/^\{\{\s*(?:\/|endif\b|endunless\b)/,Ec=/^\{\{\s*(?:\/\s*(?:if|unless)\b|endif\b|endunless\b)/,Lc=/^\{\{\s*\/\s*partial\b/;function Qt(e,t,o){return e.some(n=>t<n.to&&o>n.from)}function Fc(e){const t=new Map;for(const o of Hr(e)){const n=o.kind==="loop"?"loop":"if";t.set(o.from,n);const s=e.lastIndexOf("{{",o.to-2);s>=o.openTo&&Qs.test(e.slice(s,o.to))&&t.set(s,n)}for(const o of as(e))t.set(o.from,"component");return t}function Bc(e){const t=String(e||""),o=[],n=[];Bn.lastIndex=0;let s;for(;s=Bn.exec(t);)o.push({from:s.index,to:s.index+s[0].length});const r=Fc(t),i=[];for(Fn.lastIndex=0;s=Fn.exec(t);){const l=s.index,c=l+s[0].length,d=s[0];if(Qt(o,l,c))continue;if(i.push({from:l,to:c}),d.startsWith("{{#")){n.push({from:l,to:c,cls:"comment"});continue}const f=Qs.test(d),h=r.get(l)||(f&&Ec.test(d)?"if":"")||(f&&Lc.test(d)?"component":"");n.push({from:l,to:c,cls:(h?`fam-${h}`:"antlers")+(f?"-close":"")})}for(In.lastIndex=0;s=In.exec(t);){const l=s.index+1+s[1].length,c=l+s[2].length;Qt(o,l,c)||Qt(i,l,c)||n.push({from:l,to:c,cls:`fam-${fr(s[2])}`})}return n.sort((l,c)=>l.from-c.from),n}function On(e,t,o){const n=new t.RangeSetBuilder;let s=0;for(const r of Bc(e.doc.toString()))r.from<s||(n.add(r.from,r.to,o(r.cls)),s=r.to);return n.finish()}function Ic(e){const t=new Map,o=r=>r==="comment"?"sve-cm-antlers-comment":r==="antlers"?"sve-cm-antlers":r==="antlers-close"?"sve-cm-antlers sve-cm-antlers-close":r.endsWith("-close")?`sve-cm-${r.slice(0,-6)} sve-cm-antlers-close`:`sve-cm-${r}`,n=r=>(t.has(r)||t.set(r,e.Decoration.mark({class:o(r)})),t.get(r));return{extensions:[e.StateField.define({create(r){return On(r,e,n)},update(r,i){return i.docChanged?On(i.state,e,n):r},provide:r=>e.EditorView.decorations.from(r)})]}}const M=bo({tag:"",emptyText:"",addLabel:"",dropTitle:"",chips:[],states:[],canEdit:!1,onAdd:null,onChip:null,onDrop:null}),Oc={class:"sve-al"},Pc={class:"sve-al-head"},Dc={key:0,class:"sve-al-tag"},Hc=["title","disabled"],jc={key:0,class:"sve-al-empty"},zc={class:"sve-al-chips"},Wc=["data-sve-al-chip","title","disabled","onClick"],Rc={class:"sve-al-name"},Nc={key:0,class:"sve-al-value"},qc=["title","onClick"],Vc={__name:"AlpinePanel",setup(e){return(t,o)=>(x(),_("div",Oc,[g("div",Pc,[w(M).tag?(x(),_("span",Dc,"<"+A(w(M).tag)+">",1)):j("",!0),(x(!0),_(z,null,ae(w(M).states,n=>(x(),_("span",{key:n,class:"sve-al-state"},A(n),1))),128)),o[1]||(o[1]=g("span",{class:"sve-al-gap"},null,-1)),g("button",{type:"button","data-sve-al-add":"",title:w(M).addLabel,disabled:!w(M).canEdit,onClick:o[0]||(o[0]=E(n=>w(M).onAdd?.(n),["prevent","stop"]))},"+",8,Hc)]),w(M).chips.length?j("",!0):(x(),_("div",jc,A(w(M).emptyText),1)),g("div",zc,[(x(!0),_(z,null,ae(w(M).chips,n=>(x(),_("span",{key:n.id,class:"sve-al-chip-wrap"},[g("button",{type:"button","data-sve-al-chip":n.id,title:n.title,disabled:!w(M).canEdit,onClick:E(s=>w(M).onChip?.(s,n.id),["prevent","stop"])},[g("span",Rc,A(n.name),1),n.value?(x(),_("span",Nc,A(n.value),1)):j("",!0)],8,Wc),w(M).canEdit?(x(),_("button",{key:0,type:"button",class:"sve-al-drop",title:w(M).dropTitle,onClick:E(s=>w(M).onDrop?.(n.id),["prevent","stop"])},"−",8,qc)):j("",!0)]))),128))])]))}},Uc=fs(Vc,[["__scopeId","data-v-227acb97"]]),Kc=[{id:"state",lang:"alpine_group_state"},{id:"act",lang:"alpine_group_act"},{id:"react",lang:"alpine_group_react"}],Pn=[{id:"state",group:"state",label:"alpine_state",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: false }"}]},{id:"state_text",group:"state",label:"alpine_state_text",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: '|' }"}]},{id:"toggle",group:"act",label:"alpine_toggle",icon:"toggle",needsName:!0,attrs:[{name:"@click",value:":name = !:name"}]},{id:"open",group:"act",label:"alpine_open",icon:"open",needsName:!0,attrs:[{name:"@click",value:":name = true"}]},{id:"close",group:"act",label:"alpine_close",icon:"close",needsName:!0,attrs:[{name:"@click",value:":name = false"}]},{id:"open_hover",group:"act",label:"alpine_open_hover",icon:"open",needsName:!0,attrs:[{name:"@mouseenter",value:":name = true"}]},{id:"close_leave",group:"act",label:"alpine_close_leave",icon:"close",needsName:!0,attrs:[{name:"@mouseleave",value:":name = false"}]},{id:"open_focus",group:"act",label:"alpine_open_focus",icon:"open",needsName:!0,attrs:[{name:"@focusin",value:":name = true"}]},{id:"close_blur",group:"act",label:"alpine_close_blur",icon:"close",needsName:!0,attrs:[{name:"@focusout",value:":name = false"}]},{id:"close_outside",group:"act",label:"alpine_close_outside",icon:"outside",needsName:!0,attrs:[{name:"@click.outside",value:":name = false"}]},{id:"close_escape",group:"act",label:"alpine_close_escape",icon:"escape",needsName:!0,attrs:[{name:"@keydown.escape.window",value:":name = false"}]},{id:"show",group:"react",label:"alpine_show",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"}]},{id:"show_smooth",group:"react",label:"alpine_show_smooth",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"},{name:"x-transition",value:""}]},{id:"hide_until_ready",group:"react",label:"alpine_hide_until_ready",icon:"cloak",attrs:[{name:"x-cloak",value:""}]},{id:"class_when",group:"react",label:"alpine_class_when",icon:"klass",needsName:!0,attrs:[{name:":class",value:":name ? '|' : ''"}]},{id:"text",group:"react",label:"alpine_text",icon:"text",needsName:!0,attrs:[{name:"x-text",value:":name"}]}];function Gc(e){return(e?.attrs||[]).map(t=>t.name).join(" ")}const Xc=/^(x-[\w:.-]+|@[\w:.-]+|:[\w-]+)$/;function Yc(e){return Xc.test(String(e||""))}function at(e){const t=String(e||""),o=[],n=/([@:a-zA-Z_][\w:.@-]*)(\s*=\s*(["'])([\s\S]*?)\3)?/g;let s,r=!0;for(;s=n.exec(t);){if(r){r=!1;continue}s[0].trim()&&o.push({name:s[1],value:s[4]??"",from:s.index,to:s.index+s[0].length,alpine:Yc(s[1])})}return o}function ea(e){const t=String(e||"").trim().replace(/^\{|\}$/g,""),o=[],n=/(^|,)\s*([a-zA-Z_$][\w$]*)\s*:/g;let s;for(;s=n.exec(t);)o.push(s[2]);return o}function Zc(e,t){return e.map(o=>({name:o.name,value:String(o.value).replaceAll(":name:",`${t}:`).replaceAll(":name",t)}))}function Uo(e,t,o){const n=v.html,s=$e();if(!n||n.state.readOnly||!s)return;const r=a.htmlScopeActive&&!!a.htmlFocus,i=r?a.htmlFocus.from:0,c=(r?a.htmlFull:n.state.doc.toString()).slice(s.from,s.openTo),d=o===""?t:`${t}="${o}"`,f=at(c).find(m=>m.name===t);let h;if(f)h=c.slice(0,f.from)+d+c.slice(f.to);else{const m=c.search(/\s|\/?>$/);h=m===-1?c:`${c.slice(0,m)} ${d}${c.slice(m)}`}h!==c&&(ke(n,[{from:s.from-i,to:s.openTo-i,insert:h}],null),Rt(e))}function Jc(e,t){const o=v.html,n=$e();if(!o||o.state.readOnly||!n)return;const s=a.htmlScopeActive&&!!a.htmlFocus,r=s?a.htmlFocus.from:0,l=(s?a.htmlFull:o.state.doc.toString()).slice(n.from,n.openTo),c=at(l).find(h=>h.name===t);if(!c)return;let d=c.from;for(;d>0&&/\s/.test(l[d-1]);)d-=1;const f=l.slice(0,d)+l.slice(c.to);ke(o,[{from:n.from-r,to:n.openTo-r,insert:f}],null),Rt(e)}function lo(e){const t=v.html;if(!t)return[];const n=a.htmlScopeActive&&!!a.htmlFocus?a.htmlFull:t.state.doc.toString(),s=$e(),r=[],i=Mt(Et(n),new Set);for(const l of i){if(!s||l.from>s.from||l.to<s.to)continue;const c=at(n.slice(l.from,l.openTo)).find(d=>d.name==="x-data");c&&r.push(...ea(c.value))}return[...new Set(r)]}function Qc(e){const t=v.html,o=$e();if(!t||!o)return[];const s=a.htmlScopeActive&&!!a.htmlFocus?a.htmlFull:t.state.doc.toString(),r=at(s.slice(o.from,o.openTo)).find(i=>i.name==="x-data");return r?ea(r.value):[]}function ed(e,t){const o=e.document;$(o),t.setAttribute("data-open","");const n=lo(),s=o.createElement("div");s.id=y,o.body.appendChild(s),D(e,t,s);const r=!n.length,i=!r&&!Qc().length,c=Kc.filter(d=>d.id==="state"?!i:!r).flatMap(d=>{const f=Pn.filter(h=>h.group===d.id);return f.length?[{value:`\0${d.id}`,label:p(e,r&&d.id==="state"?"alpine_group_state_first":d.lang),heading:!0},...f.map(h=>({value:h.id,label:p(e,h.label),hint:Gc(h)}))]:[]});r&&c.push({value:"\0note",label:p(e,"alpine_needs_state"),note:!0}),s._sveApp=H(Q,s,{kind:"choices",choices:c,onPick:d=>{const f=Pn.find(h=>h.id===d);if($(o),!!f){if(!f.needsName){for(const h of f.attrs)Uo(e,h.name,h.value);return}td(e,t,f,n)}}})}function td(e,t,o,n){const s=e.document,r=l=>{const c=String(l||"").trim().replace(/[^\w$]/g,"");if($(s),!!c)for(const d of Zc(o.attrs,c))Uo(e,d.name,d.value.replace("|",""))};if(!n.length){co(e,t,r);return}const i=s.createElement("div");i.id=y,s.body.appendChild(i),D(e,t,i),i._sveApp=H(Q,i,{kind:"choices",choices:[{value:"\0head",label:p(e,"alpine_name"),heading:!0},...n.map(l=>({value:l,label:l})),{value:"\0new",label:p(e,"alpine_new_name")}],onPick:l=>{if(l==="\0new"){co(e,t,r);return}r(l)}})}function co(e,t,o){const n=e.document;$(n),t.setAttribute("data-open","");const s=n.createElement("div");s.id=y,n.body.appendChild(s),D(e,t,s),s._sveApp=H(Do,s,{label:p(e,"alpine_name"),placeholder:p(e,"alpine_name_placeholder"),onAdd:r=>o(r)})}function Rt(e){const o=e?.document.getElementById(u)?.querySelector("[data-sve-alpine-host]");if(!o)return;const n=$e(),s=v.html,r=a.htmlScopeActive&&!!a.htmlFocus,i=s?r?a.htmlFull:s.state.doc.toString():"",l=n?at(i.slice(n.from,n.openTo)):[];M.tag=n?.tag||"",M.canEdit=!a.lastLocked&&!!n,M.emptyText=p(e,n?lo().length?"alpine_none_ready":"alpine_none":"alpine_pick"),M.addLabel=p(e,"alpine_add"),M.dropTitle=p(e,"alpine_remove"),M.states=lo(),M.chips=l.filter(c=>c.alpine).map(c=>({id:c.name,name:c.name,value:c.value,title:c.value?`${c.name}="${c.value}"`:c.name})),M.onAdd=c=>ed(e,c.currentTarget),M.onDrop=c=>Jc(e,c),M.onChip=(c,d)=>{M.chips.find(h=>h.id===d)&&co(e,c.currentTarget,h=>Uo(e,d,h))},o._sveMounted||(o._sveMounted=!0,Qe(o,Uc))}const od=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]),nd=new Set(["html","head","body"]),Dn=new Set(["if","unless","style_push","script_push","sve_defaults","once","noparse","foreach","forelse","loop","cache","nocache","scope","collection","nav","structure","taxonomy","users","search:results","form:create","form:errors"]),sd=new Set(["collection:count"]);function Hn(e){return sd.has(e)?!1:Dn.has(e)||Dn.has(e.split(":")[0])}const ad=new Set(["CloseTag","MismatchedCloseTag","IncompleteCloseTag"]),rd=/^\s*(\/?)\s*([A-Za-z_][A-Za-z0-9_.:-]*)([\s\S]*)$/,id=/^\{\{\s*\/?\s*([A-Za-z_][A-Za-z0-9_.:-]*)/,ld=3e5;function cd(e){const t=String(e||""),o=[],n=[];let s=0;for(;s<t.length;){const r=t.indexOf("{{",s);if(r===-1)break;if(t.startsWith("{{#",r)){const d=t.indexOf("#}}",r+3);if(d===-1){n.push(r);break}o.push({from:r,to:d+3,comment:!0,body:""}),s=d+3;continue}let i=0,l=r,c=-1;for(;l<t.length;){if(t.startsWith("{{",l)){i+=1,l+=2;continue}if(t.startsWith("}}",l)){if(i-=1,l+=2,i===0){c=l;break}continue}l+=1}if(c===-1){n.push(r),s=r+2;continue}o.push({from:r,to:c,comment:!1,body:t.slice(r+2,c-2)}),s=c}return{tags:o,unclosed:n}}function dd(e,t){let o=e;for(const n of t)o=o.slice(0,n.from)+" ".repeat(n.to-n.from)+o.slice(n.to);return o}function ud(e,t){return e===t||e.startsWith(`${t}:`)}function ut(e,t){return(e.slice(t,t+80).match(/^<\/?([A-Za-z][A-Za-z0-9:-]*)/)?.[1]||"").toLowerCase()}function fd(e,t,o,n,s){const r=c=>s.has(c.name)&&!/\||\?\?/.test(c.rest);for(const c of o){const d=e.slice(c,c+80).match(id)?.[1]||"…";n.push({from:c,to:c+2,key:"code_dock_problem_antlers_unclosed",args:{name:d}})}const i=[],l=[];for(const c of t){if(c.comment)continue;const d=c.body.match(rd);if(!d)continue;const f=!!d[1],h=d[2].toLowerCase(),m=d[3];if(!f&&(h==="elseif"||h==="else")){let b=-1;for(let k=i.length-1;k>=0;k-=1)if(i[k].name==="if"||i[k].name==="unless"){b=k;break}if(b===-1){n.push({from:c.from,to:c.to,key:"code_dock_problem_branch_stray",args:{name:h}});continue}l.push({from:i[b].to,to:c.from}),i[b]={...i[b],to:c.to},i.length=b+1;continue}if(f||h==="endif"||h==="endunless"){const b=h==="endif"?"if":h==="endunless"?"unless":h;let k=-1;for(let O=i.length-1;O>=0;O-=1)if(ud(i[O].name,b)){k=O;break}if(k===-1){n.push({from:c.from,to:c.to,key:"code_dock_problem_pair_stray",args:{name:b}});continue}for(const O of i.slice(k+1))Hn(O.name)&&n.push({from:O.from,to:O.to,key:"code_dock_problem_pair_unclosed",args:{name:O.name}});(b==="if"||b==="unless")&&l.push({from:i[k].to,to:c.from}),i.length=k;continue}m.trim().startsWith("=")||i.push({name:h,rest:m,from:c.from,to:c.to})}for(const c of i)Hn(c.name)?n.push({from:c.from,to:c.to,key:"code_dock_problem_pair_unclosed",args:{name:c.name}}):r(c)&&n.push({from:c.from,to:c.to,key:"code_dock_problem_list_unclosed",args:{name:c.name}});return l}function hd(e,t,o,n){const s=t.parse(e),r=new Set,i=[];s.iterate({enter(l){if(l.name==="MismatchedCloseTag"){i.push({from:l.from,to:l.to,key:"code_dock_problem_tag_stray",args:{tag:ut(e,l.from)}});return}if(l.name==="IncompleteCloseTag"){i.push({from:l.from,to:l.to,key:"code_dock_problem_tag_unfinished",args:{tag:ut(e,l.from)}});return}if(l.type.isError){const h=l.node.parent;h&&(h.name==="OpenTag"||h.name==="CloseTag")&&(r.add(h.from),i.push({from:h.from,to:Math.max(h.from+1,l.from),key:"code_dock_problem_tag_unfinished",args:{tag:ut(e,h.from)}}));return}if(l.name!=="Element")return;let c=null,d=!1;for(let h=l.node.firstChild;h;h=h.nextSibling)h.name==="OpenTag"&&(c=h),ad.has(h.name)&&(d=!0);if(!c||d)return;const f=ut(e,c.from);!f||od.has(f)||nd.has(f)||o.some(h=>c.from>=h.from&&c.from<h.to&&l.to>h.to)||i.push({from:c.from,to:c.to,key:"code_dock_problem_tag_unclosed",args:{tag:f}})}});for(const l of i)l.key==="code_dock_problem_tag_unclosed"&&r.has(l.from)||l.args.tag&&n.push(l)}function pd(e,t,o={}){const n=String(e||"");if(!n.trim()||n.length>ld)return[];const s=[];try{const{tags:i,unclosed:l}=cd(n),c=fd(n,i,l,s,new Set(o.lists||[]));t&&hd(dd(n,i),t,c,s)}catch{return[]}const r=new Set;return s.sort((i,l)=>i.from-l.from||i.to-l.to).filter(i=>{const l=`${i.from}:${i.key}`;return r.has(l)?!1:(r.add(l),!0)})}function md(e,t,o=()=>({})){const n=e.Decoration.mark({class:"sve-cm-problem"}),s=e.StateEffect.define(),r=l=>{const c=pd(l.doc.toString(),t,o()),d=new e.RangeSetBuilder;let f=0;for(const h of c)h.from<f||h.to<=h.from||(d.add(h.from,h.to,n),f=h.to);return{problems:c,decorations:d.finish()}},i=e.StateField.define({create(l){return r(l)},update(l,c){return c.docChanged||c.effects.some(d=>d.is(s))?r(c.state):l},provide:l=>e.EditorView.decorations.from(l,c=>c.decorations)});return{field:i,relint:s,extensions:[i]}}const vd=new Set(["replicator","grid","list","array","table"]);let vt=new Set,eo=null;function ta(e){return e.document.getElementById(u)?.querySelector("[data-sve-html-problems]")||null}function gd(e,t,o){const n=ta(e);if(!n)return;const s=t.state.doc,r=o.map(c=>({from:c.from,line:s.lineAt(Math.min(c.from,s.length)).number,text:p(e,c.key,c.args)})),i=r.map(c=>`${c.line}:${c.text}`).join(`
`);if(n.dataset.sveSignature===i||(n.dataset.sveSignature=i,n.hidden=r.length===0,n.replaceChildren(),!r.length))return;const l=e.document.createElement("span");l.setAttribute("data-sve-problems-title",""),l.textContent=p(e,"code_dock_problems_title"),n.appendChild(l);for(const c of r){const d=e.document.createElement("button"),f=e.document.createElement("b");d.type="button",d.dataset.sveProblemAt=String(c.from),f.textContent=p(e,"code_dock_problem_line",{line:c.line}),d.append(f,e.document.createTextNode(` ${c.text}`)),n.appendChild(d)}}function bd(e){const t=ta(e);!t||t._sveBound||(t._sveBound=!0,t.addEventListener("mousedown",o=>o.preventDefault()),t.addEventListener("click",o=>{const n=o.target.closest("[data-sve-problem-at]"),s=v.html;if(!n||!s)return;o.preventDefault(),o.stopPropagation();const r=Math.min(Number(n.dataset.sveProblemAt)||0,s.state.doc.length);s.dispatch({selection:{anchor:r},effects:F.scrollIntoView(r,{y:"center"})}),s.focus()}))}function yd(e){const t=[],o=n=>{for(const s of n||[])s?.loop&&vd.has(s.type)&&s.var&&!s.parent&&t.push(s.var)};o(e?.section);for(const n of e?.page||[])o(n?.items);return t}function kd(e,t,o){const n={collection:ms(e),set:vs(a.lastType),view:"",scope:""},s=n.set?Lo(n):"";if(s===eo)return;eo=s;const r=l=>{if(eo!==s)return;const c=new Set(yd(l)),d=c.size===vt.size&&[...c].every(f=>vt.has(f));vt=c,!d&&v.html===t&&e.queueMicrotask(()=>{v.html===t&&t.dispatch({effects:o.of(null)})})};if(!s){r(null);return}const i=gs(s);if(i){r(i);return}bs(e,n).then(r)}function xd(e){if(!a.htmlLintUi){const{field:t,relint:o}=md({Decoration:J,StateField:ce,StateEffect:He,RangeSetBuilder:de,EditorView:F},$t.parser,()=>({lists:vt})),n=F.updateListener.of(s=>{const r=s.transactions.some(i=>i.effects.some(l=>l.is(o)));!s.docChanged&&!r||(s.docChanged&&kd(e,s.view,o),gd(e,s.view,s.state.field(t).problems))});a.htmlLintUi={extensions:[t,n]}}return bd(e),a.htmlLintUi}const jn=/\{\{\s*(?:vite\b[^}]*|yield_[a-z_]+|theme_tokens)\s*\}\}/g;function _d(e,t=[]){const o=[];jn.lastIndex=0;let n;for(;n=jn.exec(String(e||""));)o.push(n.index,n.index+n[0].length);if(!t||!t.length)return o;const s=[];for(const r of[o,t])for(let i=0;i+1<r.length;i+=2)s.push([r[i],r[i+1]]);return s.sort((r,i)=>r[0]-i[0]||r[1]-i[1]).flat()}const wd=["input","delete","move"];function Sd(e){return wd.some(t=>e(t))}let to={text:null,ranges:[]};function oa(e){return to.text!==e&&(to={text:e,ranges:_d(e,e.includes("sve-lock")?jr(e):[])}),to.ranges}function zn(e,t){const o=new de,n=oa(e.doc.toString());for(let s=0;s<n.length;s+=2)o.add(n[s],n[s+1],t);return o.finish()}let ft=null;function $d(){if(ft)return ft;const e=J.mark({class:"sve-dock-locked"}),t=ce.define({create:n=>zn(n,e),update:(n,s)=>s.docChanged?zn(s.state,e):n,provide:n=>F.decorations.from(n)}),o=F.baseTheme({".sve-dock-locked":{opacity:".55",borderRadius:".1875rem",backgroundColor:"rgba(127,127,127,.14)",cursor:"not-allowed"}});return ft={extensions:[t,o,Je.changeFilter.of(n=>Sd(s=>n.isUserEvent(s))?oa(n.startState.doc.toString()):!0)]},ft}function Cd(){if(a.cssGhostUi)return a.cssGhostUi;const e=J.mark({class:"sve-css-ghost"}),t=o=>{const n=new de;if(!a.lastWin)return n.finish();try{for(const s of il(o.doc.toString(),ve(a.lastWin)))n.add(s.from,s.to,e)}catch{}return n.finish()};return a.cssGhostUi=ce.define({create:o=>t(o),update:(o,n)=>n.docChanged?t(n.state):o,provide:o=>F.decorations.from(o)}),a.cssGhostUi}let ht=null,wt=null;function Td(){if(ht)return ht;wt=He.define();const e=J.line({class:"sve-css-id"}),t=o=>{const n=new de;if(!a.lastWin||!a.cssValues)return n.finish();try{const s=o.doc;for(const r of bt(s.toString(),ve(a.lastWin),a.cssSize)){const i=s.lineAt(Math.min(r.from,s.length)).number,l=s.lineAt(Math.min(Math.max(r.to-1,r.from),s.length)).number;for(let c=i;c<=l;c+=1)n.add(s.line(c).from,s.line(c).from,e)}}catch{}return n.finish()};return ht=ce.define({create:o=>t(o),update:(o,n)=>n.docChanged||n.effects.some(s=>s.is(wt))?t(n.state):o,provide:o=>F.decorations.from(o)}),ht}function Ko(){wt&&v.css&&v.css.dispatch({effects:wt.of(null)})}function Ad(){return a.htmlPartialUi||(a.htmlPartialUi=Rr({Decoration:J,StateField:ce,StateEffect:He,RangeSetBuilder:de,EditorView:F})),a.htmlPartialUi}function Md(){return a.htmlAntlersUi||(a.htmlAntlersUi=Ic({Decoration:J,StateField:ce,RangeSetBuilder:de,EditorView:F})),a.htmlAntlersUi}function Ed(){return a.htmlClassTokenUi||(a.htmlClassTokenUi=ci({Decoration:J,StateField:ce,StateEffect:He,RangeSetBuilder:de,EditorView:F})),a.htmlClassTokenUi}function Ld(e,t,o){v[t]?.destroy();const n=ho.of([{key:"Mod-s",run:()=>(W(e.document),!0)}]);v[t]=new F({state:Je.create({doc:"",extensions:[ka(),xa(),_a(),Ca(),Lu(t),Aa(),Ta({tooltipClass:()=>"sve-tw-complete"}),...t==="html"?[$t.data.of({autocomplete:zr(e)}),$t.data.of({autocomplete:Tl(e)}),Al(e),Wr(Fa,e)]:[],...t==="html"?[...ni(),si()]:[],...t==="css"?[Pa(),Cd(),Td()]:[],ho.of([...wa,...t==="html"?[{key:"Tab",run:ai}]:[],Sa,...$a,...La,...Ma]),n,F.lineWrapping,...t==="html"||t==="css"?Ad().extensions:[],...t==="html"?Md().extensions:[],...t==="html"?xd(e).extensions:[],...t==="html"?$d().extensions:[],...t==="html"?Ed().extensions:[],qe[t].of(Je.readOnly.of(!!a.lastLocked)),Ve[t].of(F.editable.of(!a.lastLocked)),F.updateListener.of(s=>{t==="html"&&s.docChanged&&!a.applying&&(Jl(),xo("dock:html-changed")),t==="css"&&s.docChanged&&!a.applying&&Ql(),s.docChanged&&G(e),t==="css"&&(s.docChanged||s.selectionSet)&&L(e),t==="css"&&s.docChanged&&!a.applying&&rt(e),t==="html"&&(s.docChanged||s.selectionSet)&&(jt(e),Rt(e),pe(e),a.applying||it(e))}),F.domEventHandlers({click:(s,r)=>(t==="html"&&r===v.html&&nc(e),!1)}),...Ya(C,{height:"auto",background:"#1E1E21",scroller:{overflow:"visible",height:"auto",minHeight:0},extraTags:s=>[{tag:s.tagName,color:"#4ec9b0"},{tag:s.attributeName,color:"#9cdcfe"},{tag:s.attributeValue,color:"#ce9178"},{tag:s.angleBracket,color:"#808080"}]})]}),parent:o})}function Fd(e){if(!e||e.querySelector(".cm-editor"))return;e.replaceChildren();const t=e.ownerDocument.createElement("span");t.style.cssText="width:16px;height:16px;margin:12px;border:2px solid #858585;border-right-color:transparent;border-radius:50%;display:block;animation:sve-cm-wait .6s linear infinite",e.appendChild(t)}function ve(e){return ko(e).map(t=>({handle:t.handle,base:t.base,max:t.max,media:t.media,media_px:t.media_px,label:t.label}))}function na(e,t){return ve(e).find(o=>o.handle===t)||null}function Nt(e=a.cssState){return e?e==="before"||e==="after"?`::${e}`:`:${e}`:""}function rt(e,t=!1){const o=v.css;if(!o||!po||!mo)return;const n=o.state.doc.toString(),s=`${a.cssValues?"1":"0"}|${a.cssSize}|${It(n).map(f=>`${f.from}-${f.to}`).join(",")}`;if(!t&&s===a.cssFoldSig)return;a.cssFoldSig=s;const r=ve(e),i=new Map,l=[...al(n,r,a.cssSize),...a.cssValues?[]:bt(n,r,a.cssSize).map(f=>({from:f.from,to:f.to}))];for(const f of l)f.to>f.from&&i.set(`${f.from}:${f.to}`,{from:f.from,to:f.to});const c=[],d=new Set;Da(o.state).between(0,n.length,(f,h)=>{const m=`${f}:${h}`;d.add(m),!i.has(m)&&a.cssOwnFolds.has(m)&&c.push(mo.of({from:f,to:h}))});for(const[f,h]of i)d.has(f)||c.push(po.of(h));a.cssOwnFolds=new Set(i.keys()),c.length&&o.dispatch({effects:c})}function uo(e,t){const o=a.cssFull||t;return/max-width/i.test(o)&&!/width\s*</i.test(o)&&e.media_px||e.media}function Bd(e,t){const o=v.css;if(!o||o.state.readOnly)return;const n=ve(e),s=na(e,t),r=o.state.doc.toString();if(!s||s.base){const f=o.state.selection.main.head,h=It(r).find(m=>f>=m.from&&f<=m.to);h&&o.dispatch({selection:{anchor:h.from},scrollIntoView:!0});return}const i=Bo(r,n,t);if(i.length){const f=i[0],h=Math.min(f.bodyTo,f.bodyFrom+(r.slice(f.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);o.dispatch({selection:{anchor:h},scrollIntoView:!0});return}const l=uo(s,r),c=sa(o,r),d=`

${c.indent}@media ${l} {
${c.indent}    
${c.indent}}${c.suffix}`;o.dispatch({changes:{from:c.at,to:c.at,insert:d},selection:{anchor:c.at+d.lastIndexOf("    ")+4},scrollIntoView:!0})}function sa(e,t){const o=It(t);if(o.length){const i=o[o.length-1];return{at:i.to,indent:xe(t,i.from),suffix:""}}const n=i=>({at:i.to,indent:xe(t,i.to)||`${xe(t,i.open)}    `,suffix:`
${xe(t,i.open)}`}),s=zt();if(s)return n(s);const r=Id(t);return r?n(r):{at:t.length,indent:"",suffix:""}}function Id(e){const t=String(e||"");let o=null,n=0,s=0;for(;n<t.length;){if(t[n]==="}"||t[n]===";"){n+=1,s=n;continue}if(t[n]!=="{"){n+=1;continue}const r=Ao(t,n);if(r===-1||o||(o=t.slice(s,n).trim().startsWith("@")?null:{from:s,open:n,to:r},!o))return null;n=r+1,s=n}return o}function Od(e,t){const o=t===a.cssSize?"":t;a.cssSize=o,N(e,Xo,o),re("lp:set-device",{win:e,key:o?rr(o,e):"Responsive"}),o&&Bd(e,o),a.cssValues&&ra(e),rt(e,!0),Ko(),pe(e),L(e)}function Pd(e,t){a.cssState=Yo.includes(t)?t:"",N(e,fo,a.cssState),$(e.document),pe(e),L(e)}function Dd(e,t){const o=e.document;$(o),t.setAttribute("data-open","");const n=o.createElement("div");n.id=y,o.body.appendChild(n),D(e,t,n),n._sveApp=H(Q,n,{kind:"choices",choices:[{value:"",label:p(e,"css_state_none"),active:!a.cssState},...Yo.map(s=>({value:s,label:Nt(s),active:s===a.cssState}))],onPick:s=>Pd(e,s)})}function pe(e){const t=e?.document.getElementById(u),o=t?.querySelector("[data-sve-css-head]");if(!o)return;const n=$e(),s=ve(e),r=v.css?.state.doc.toString()??"";S.tag=n?.tag||"",S.scope=Nr(n?me().slice(n.from,n.openTo):"")||"",t.toggleAttribute("data-sve-css-unnamed",a.styleMode!=="tw"&&!S.scope);const i=S.scope,l=Oo(e,i);S.scopeElsewhere=[...new Set(l.map(c=>String(c.file).replace(/^.*\//,"")))],S.scopeElsewhereTitle=S.scopeElsewhere.length?`${p(e,"class_defined_in",{file:S.scopeElsewhere.join(", ")})} — ${p(e,"class_defined_import")}`:"",S.onScopeImport=()=>{Po(e,i)&&pe(e)},i&&!Ss()&&Io(e).then(()=>pe(e)),S.note=a.cssPane==="empty"?p(e,"css_pane_empty"):"",S.canEdit=!a.lastLocked,S.onTag=c=>qr(e,c.currentTarget,n),S.state=a.cssState,S.stateLabel=a.cssState?Nt(a.cssState):p(e,"css_state"),S.onState=c=>Dd(e,c.currentTarget),S.onSize=c=>Od(e,c),S.sizes=[{key:"",label:p(e,"tw_size_all"),title:p(e,"css_size_all_title"),active:!a.cssSize},...s.map(c=>{const d=c.base||Bo(r,s,c.handle).length>0;return{key:c.handle,label:c.label,title:c.base?p(e,"css_size_base_title"):`@media ${c.media}${d?"":`  ·  ${p(e,"css_size_new")}`}`,active:a.cssSize===c.handle}})],o._sveMounted||(o._sveMounted=!0,Qe(o,vl))}Tt("lp:device",e=>{const t=a.lastWin;if(!t||!la(t.document))return;const o=ko(t).find(n=>n.device===e)?.handle||"";o!==a.cssSize&&(a.cssSize=o,N(t,Xo,o),rt(t,!0),Ko(),pe(t),L(t))});function Hd(e){const t=Math.max(0,Math.round(Date.now()/1e3-e)),o=new Date(e*1e3).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});let n=o;try{const s=new Intl.RelativeTimeFormat(void 0,{numeric:"auto"});t<90?n=s.format(-t,"second"):t<5400?n=s.format(-Math.round(t/60),"minute"):t<86400?n=s.format(-Math.round(t/3600),"hour"):n=s.format(-Math.round(t/86400),"day")}catch{}return`${n} · ${o}`}function aa(e,t){return e.fetch(t,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}})}async function jd(e,t){const o=e.document,n=ge();if($(o),!n)return;let s=[];try{const i=await aa(e,`/!/sve/section-template/history?type=${encodeURIComponent(n)}`);i.ok&&(s=(await i.json())?.entries||[])}catch{s=[]}if(!o.getElementById(u)||!o.contains(t))return;t.setAttribute("data-open","");const r=o.createElement("div");r.id=y,o.body.appendChild(r),D(e,t,r),r._sveApp=H(Q,r,{kind:"choices",choices:s.length?s.map(i=>({value:i.id,label:Hd(i.at)})):[{value:"",label:p(e,"code_dock_history_empty")}],onPick:i=>{$(o),i&&zd(e,n,i)}})}async function zd(e,t,o){if(le())return;let n=null;try{const s=await aa(e,`/!/sve/section-template/history/entry?type=${encodeURIComponent(t)}&id=${encodeURIComponent(o)}`);s.ok&&(n=await s.json())}catch{n=null}!n||le()||(Pe({html:n.html??"",css:n.css??"",js:n.js??""},a.lastLocked),G(e),it(e))}function Me(e){const t=e?.document.getElementById(u)?.querySelector("[data-sve-code-strip]");if(!t)return;t.hidden=a.styleMode!=="tw";const o=cs(e);t.innerHTML=cf,t.title=p(e,o?"tw_strip_on":"tw_strip_off"),t.setAttribute("aria-label",t.title),t.setAttribute("aria-pressed",o?"true":"false")}function Wd(e,t){const o=t.querySelector("[data-sve-code-strip]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Vr(e,!cs(e)),Me(e),Ur(e)}),Me(e))}function Rd(e,t){const o=t.querySelector("[data-sve-code-history]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=df,o.title=p(e,"code_dock_history"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),o.hasAttribute("data-open")){$(e.document);return}jd(e,o)}))}function Nf(){return a.styleMode}function Nd(e){return a.styleMode==="tw"?$e():null}function $e(e){const t=v.html;if(!t)return null;const o=a.htmlScopeActive&&!!a.htmlFocus,n=o?a.htmlFull:t.state.doc.toString(),r=(o?a.htmlFocus.from:0)+t.state.selection.main.from,i=Mt(Et(n),new Set);let l=null;for(const c of i)c.from<=r&&r<c.to&&(l=c);return l}function it(e){a.styleMode==="tw"&&Kr(e,Nd())}function Go(e){const t=e?.document.getElementById(u),o=t?.querySelector("[data-sve-values-mode]");if(!t||!o)return;t.setAttribute("data-sve-values",a.cssValues?"on":"off");const n=e.document.createElement("span");n.textContent=p(e,"code_dock_values"),o.innerHTML=ff,o.appendChild(n),o.title=p(e,a.cssValues?"code_dock_values_off":"code_dock_values_on"),o.setAttribute("aria-label",o.title),o.setAttribute("aria-pressed",a.cssValues?"true":"false")}function ra(e){const t=v.css;if(!t||t.state.readOnly)return;const o=ve(e),n=t.state.doc.toString(),s=bt(n,o,a.cssSize);if(t.focus(),s.length){const m=s[0],b=Math.min(m.bodyTo,m.bodyFrom+(n.slice(m.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);t.dispatch({selection:{anchor:b},scrollIntoView:!0});return}const r=na(e,a.cssSize);if(!r||r.base){const m=`#id-{{ id }} {
    `;t.dispatch({changes:{from:0,to:0,insert:`${m}
}

`},selection:{anchor:m.length},scrollIntoView:!0});return}const i=Bo(n,o,a.cssSize)[0];if(i){const m=`${xe(n,i.from)}    `,b=`
${m}#id-{{ id }} {
${m}    `;t.dispatch({changes:{from:i.bodyFrom,to:i.bodyFrom,insert:`${b}
${m}}
`},selection:{anchor:i.bodyFrom+b.length},scrollIntoView:!0});return}const l=sa(t,n),c=`${l.indent}    `,d=bt(n,o,"").some(m=>l.at>m.bodyFrom&&l.at<=m.bodyTo),f=d?`

${l.indent}@media ${uo(r,n)} {
${c}`:`

${l.indent}@media ${uo(r,n)} {
${c}#id-{{ id }} {
${c}    `,h=d?`
${l.indent}}${l.suffix}`:`
${c}}
${l.indent}}${l.suffix}`;t.dispatch({changes:{from:l.at,to:l.at,insert:`${f}${h}`},selection:{anchor:l.at+f.length},scrollIntoView:!0})}function qd(e,t){a.cssValues=!!t,N(e,nn,a.cssValues?"1":"0"),$(e.document),a.cssOpenTool="",Go(e),ee(),Oe(),a.cssValues&&ra(e),rt(e,!0),Ko(),pe(e),L(e)}function qt(e){const t=e?.document.getElementById(u);if(!t)return;const o=a.styleMode==="tw";t.setAttribute("data-sve-style",a.styleMode);const n=t.querySelector("[data-sve-css-label]");n&&(n.textContent=o?p(e,"code_dock_style_tw"):p(e,"code_dock_css"));const s=t.querySelector("[data-sve-style-mode]");if(!s)return;const r=e.document.createElement("span");r.textContent=o?p(e,"code_dock_style_tw"):p(e,"code_dock_css"),s.innerHTML=o?hf:uf,s.appendChild(r),s.title=p(e,o?"code_dock_style_to_css":"code_dock_style_to_tw"),s.setAttribute("aria-label",s.title),s.setAttribute("aria-pressed",o?"true":"false")}function ia(e){e?.document.getElementById(u),$(e.document),so(e),a.cssOpenTool="",a.cssOpenMenu="",a.styleMode==="tw"&&a.cssValues&&(a.cssValues=!1,N(e,nn,"0")),qt(e),Go(e),Me(e),a.cssToolRow?.(),a.styleMode==="tw"&&(a.htmlScopePref=!0,N(e,Ut,"1"),ao(e,!0)),it(e),Rt(e),L(e)}const Xo="sve-css-size",fo="sve-css-state",Yo=["hover","focus","focus-visible","active","disabled","before","after"],Wn="data-sve-scroll-edge";function Zo(e){if(!e||e._sveEdges)return;e._sveEdges=!0;const t=()=>Ud(e),o=new ResizeObserver(t),n=()=>{for(const s of e.children)o.observe(s)};e.addEventListener("scroll",t,{passive:!0}),o.observe(e),n(),new MutationObserver(()=>{n(),t()}).observe(e,{childList:!0}),t()}function Vd(e,t){if(!e||e._sveEdgesIn)return;e._sveEdgesIn=!0;const o=()=>e.querySelectorAll(t).forEach(Zo);o(),new MutationObserver(o).observe(e,{childList:!0,subtree:!0})}function Ud(e){const t=e.scrollWidth-e.clientWidth,o=e.scrollLeft>1,n=t-e.scrollLeft>1,s=o&&n?"both":o?"left":n?"right":"";s?e.setAttribute(Wn,s):e.removeAttribute(Wn)}function Kd(e,t){a.styleMode=t==="tw"?"tw":"css",N(e,Ra,a.styleMode),ia(e)}function Gd(e,t){if(t._sveStyleModeBound)return;t._sveStyleModeBound=!0,a.styleMode=X(e,Ra)==="tw"?"tw":"css";const o=X(e,Xo)||"";a.cssSize=ko(e).some(n=>n.handle===o)?o:"",a.cssState=Yo.includes(X(e,fo))?X(e,fo):"",a.cssValues=X(e,nn)==="1",t.querySelector("[data-sve-style-mode]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Kd(e,a.styleMode==="tw"?"css":"tw")}),t.querySelector("[data-sve-values-mode]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),qd(e,!a.cssValues)}),ia(e),Go(e)}function Xd(e,t){const o=t.querySelector("[data-sve-css-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=r=>t.querySelector(`[data-sve-css-tool="${r}"], [data-sve-css-kid="${r}"]`),s=r=>{const i=n(r.id),l=a.cssOpenMenu===r.id;if($(e.document),l){so(e),L(e);return}if(!i)return;const c=a.styleMode==="tw"?!r.twClass&&(!!r.tw||!!r.twGroup):!r.kind&&!r.value&&!(r.css in Y())&&!!r.menu,d=()=>{c&&(a.cssOpenMenu=r.id)},f=()=>{a.cssOpenTool="",L(e)};if(a.styleMode==="tw"){so(e),r.twClass?(Gr(e,r.twClass),L(e)):r.twGroup?(Xr(e,i,r.title,r.twGroup,f),d(),L(e)):r.tw&&(Yr(e,i,r.tw,f),d(),L(e));return}if(r.kind==="flexDir"){wc(r.value);return}if(r.kind==="display"){Sc(r.value);return}if(r.value){const h=B(Y()[r.css])===B(r.value);K([{property:r.css,value:h?null:r.value}]);return}if(r.css in Y()){K([{property:r.css,value:null}]),L(e);return}r.menu==="colors"?Tc(e,i,r.css):r.menu==="spacing"?Mc(e,i,r.css):r.menu==="sizes"?Ln(e,i,r.css,kf):r.menu==="choices"?Ac(e,i,r.css,r.choices):r.menu==="values"&&Ln(e,i,r.css),d(),L(e)};ue.onTool=r=>{const i=Ct.get(r)?.tool;if(i){if(i.kids?.length){a.cssOpenTool=a.cssOpenTool===i.id?"":i.id,$(e.document),L(e);return}s(i)}},ue.onKid=(r,i)=>{const l=Ct.get(i);l?.kid&&s(l.kid)},a.cssToolRow=()=>{Qe(o,tl),L(e)},a.cssToolRow(),Zo(o),Vd(o,"[data-sve-css-kids]"),e.document.addEventListener("mousedown",r=>{r.target.closest(`#${y}, [data-sve-css-tools], [data-sve-html-tools], [data-sve-css-add-class]`)||$(e.document)},!0)}function Yd(e,t){const o=t.querySelector("[data-sve-html-tidy]");o&&(o.innerHTML=ds.tidy,o.title=p(e,"code_dock_html_tidy"),o.setAttribute("aria-label",o.title),o.setAttribute("data-tip",o.title))}function Zd(e,t){const o=t.querySelector("[data-sve-html-tidy]");Yd(e,t),!(!o||o._sveBound)&&(o._sveBound=!0,o.addEventListener("mousedown",n=>n.preventDefault()),o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Rs()}))}function Jd(e,t){const o=t.querySelector("[data-sve-html-tools]");!o||o._sveBound||(o._sveBound=!0,Qe(o,Xi,{tools:vo.map(n=>({...n,icon:ds[n.id]||""})),onTool:n=>{const s=vo.find(i=>i.id===n),r=o.querySelector(`[data-sve-html-tool="${n}"]`);if(s){if(s.menu==="heading"){Tn(e,r,Va);return}if(s.menu==="text"){Tn(e,r,hr);return}if(s.tidy){Rs();return}if(s.menu==="component"){mc(e,r);return}if($(e.document),s.snippet){Ws(s.snippet,s.caret??s.snippet.length,s.select),P();return}Ns(s.tag)}}}),Zo(o),Cu(e,t),Au(e,t),$u(e,t))}T("dock:save-now",()=>(W(a.lastWin?.document),!0));let pt=null;async function Qd(e){const t=e.document;Du(t);let o=t.getElementById(u);if(o&&!(o.querySelector('[data-sve-css-chrome="subrow-2"]')&&o.querySelector("[data-sve-css-add-class]")&&o.querySelector("[data-sve-html-tools]")&&o.querySelector("[data-sve-html-tidy]")&&o.querySelector("[data-sve-data-vars]")&&o.querySelector("[data-sve-visual-edit-tools]")&&o.querySelector("[data-sve-html-scope]")&&o.querySelector("[data-sve-code-lock]")&&o.querySelector("[data-sve-code-back]")&&o.querySelector("[data-sve-code-autosave]")&&o.querySelector("[data-sve-code-save]")&&o.getAttribute("data-sve-code-chrome")==="scope-9")){for(const s of se)v[s]?.destroy(),v[s]=null;o.remove(),o=null}if(!o){o=t.createElement("div"),o.id=u,o.setAttribute("data-sve-code-chrome","scope-9"),gr(o,br(e)),Qe(o,Ni,{htmlLabel:p(e,"code_dock_html"),cssLabel:p(e,"code_dock_css"),jsLabel:p(e,"code_dock_js"),alpineLabel:p(e,"code_dock_alpine"),treeIcon:qa,dataIcon:of,dataLabel:p(e,"data_vars_title")}),no(t,o),Vn(o),ga(o,ha(e)),qu(e,o),Uu(e,o),Vu(e,o),Xd(e,o),gc(e,o),Gd(e,o),Rd(e,o),Wd(e,o),yr(e,o),Jd(e,o),Sn(e,o),_n(e,o),Un(e,o),wn(e,o);for(const n of se){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);Fd(s)}kr(e)}if(no(t,o),Vn(o),Zd(e,o),Sn(e,o),_n(e,o),Un(e,o),wn(e,o),Wu(e),Qo(e),we(e),q(e),Fe(e),Z(e),qt(e),Me(e),await Gu(),!v.html){for(const n of se){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);s?.replaceChildren(),Ld(e,n,s)}for(const n of["html","css"])v[n]&&Zr(e,v[n],{onOpen:s=>Bs(e,s),emptyLabel:p(e,"code_dock_partials_empty"),openLabel:s=>p(e,"component_open_named",{name:s}),sectionValues:()=>Fs(e),isLocked:()=>le(),setHover:(s,r)=>a.htmlPartialUi?.setHover(s,r)});fi(e,v.html,{onRename:n=>tc(e,n),isLocked:()=>le(),setHover:(n,s)=>a.htmlClassTokenUi?.setHover(n,s),title:p(e,"code_dock_css_rename_class")})}return o}function Jo(e){return pt||(pt=Qd(e).finally(()=>{pt=null})),pt}async function Rn(e,t){const o=await Jo(e);a.lastType=t,a.lastLocked=!0,a.lockReady=!0,a.lastParts={html:"",css:"",js:""},nt(),we(e),Pe(a.lastParts,!0),on(e.document,t),I(e.document,p(e,"code_dock_missing")),q(e),Fe(e),Z(e),Le(e,o)}let Nn=-1;async function eu(e,t){if(Nn===a.loadGen&&!a.lastType&&e.document.getElementById(u))return;W(t);const o=++a.loadGen;Nn=o,a.lastType=null,a.typeStack=[],a.lastParts={html:"",css:"",js:""},a.lastProps=[],a.propsDirty=!1,a.lastLocked=!1,a.lockReady=!1,a.loadInFlight=null,As(),nt();const n=await Jo(e);o===a.loadGen&&(Pe(a.lastParts,!0),Fo(e),Lt(e),Mo(e),on(e.document,""),I(e.document,p(e,ir(e,e.document)?"code_dock_pick_section":"code_dock_open_template")),we(e),q(e),Fe(e),Z(e),qt(e),Me(e),Le(e,n))}async function De(e,t,o="replace"){o==="replace"?a.typeStack=[]:o==="push"&&a.lastType&&a.lastType!==t&&a.typeStack.push(a.lastType);const n=++a.loadGen;a.lastType=t,a.lockReady=!1,nt(),I(e.document,p(e,"code_dock_loading"));let s=()=>{};a.loadInFlight=new Promise(i=>{s=i});const r=await Jo(e);we(e),q(e),Fe(e),Z(e),qt(e),Me(e),Le(e,r),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(t)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async i=>{if(n!==a.loadGen)return;if(i.status===404){Rn(e,t);return}if(!i.ok)throw new Error(String(i.status));const l=await i.json();n===a.loadGen&&(a.lastParts={html:typeof l.html=="string"?l.html:"",css:typeof l.css=="string"?l.css:"",js:typeof l.js=="string"?l.js:""},a.lastProps=Array.isArray(l.props)?l.props:[],a.propsDirty=!1,a.lastType=t,a.lastLocked=!!l.locked,a.lockReady=!0,As(),typeof l.tw=="string"&&l.tw!==""&&Yl(a.lastParts.html,l.tw),we(e),Pe(a.lastParts,a.lastLocked),Mo(e),a.lastLocked||Ms(e,a.lastParts.html),on(e.document,l.path||t),I(e.document,a.lastLocked?p(e,"code_dock_locked"):""),l.writable?.template===!1?I(e.document,p(e,"code_dock_not_writable")):l.writable?.tw===!1&&I(e.document,p(e,"code_dock_tw_not_writable")),Fo(e),Ui(e),Lt(e),q(e),Fe(e),Z(e),Le(e,r))}).catch(()=>{n===a.loadGen&&(Rn(e,t),I(e.document,p(e,"code_dock_error")))}).finally(()=>{n===a.loadGen&&(a.loadInFlight=null),s()})}function ge(){return a.lastType||""}function la(e){return!!e?.getElementById(u)}function le(){return a.lastLocked}function tu(e,t){const o=typeof t?.html=="string"?t.html.trim():"",n=typeof t?.css=="string"?t.css.trim():"",s=typeof t?.js=="string"?t.js.trim():"";if(!o&&!n&&!s||!e?.document?.getElementById(u))return!1;let r=!1;return o&&(r=ou("html",o)||r),n&&(r=qn("css",n)||r),s&&(r=qn("js",s)||r),r&&G(e),r}function ou(e,t){const o=v[e];if(!o||o.state.readOnly)return!1;const n=o.state.selection.main,s=n.from>0?o.state.doc.sliceString(n.from-1,n.from):`
`,r=n.to<o.state.doc.length?o.state.doc.sliceString(n.to,n.to+1):`
`,c=`${s===`
`?"":`
`}${t}${r===`
`?"":`
`}`;return o.dispatch({changes:{from:n.from,to:n.to,insert:c},selection:{anchor:n.from+c.length}}),!0}function qn(e,t){const o=v[e];if(!o||o.state.readOnly)return!1;const n=o.state.doc.length,r=`${n>0&&o.state.doc.sliceString(Math.max(0,n-1),n)!==`
`?`

`:n?`
`:""}${t}
`;return o.dispatch({changes:{from:n,insert:r},selection:{anchor:n+r.length}}),!0}function nu(e){if(kt(e),!a.lastType||!e.document.getElementById(u))return;const t=a.lastType;a.lastType=null,De(e,t,"keep")}function ca(e){R(e),a.loadGen+=1,W(e),a.lastUid=null,a.lastType=null,a.typeStack=[],a.lastParts={html:"",css:"",js:""},a.lastLocked=!1,a.lockReady=!1,a.lastBracketNames=null,a.lastCssSelectorNames=null,nt(),a.lastWin=e?.defaultView||a.lastWin,$(e),ls(e),oe(e),e?.getElementById(U)?.remove();for(const o of se)v[o]?.destroy(),v[o]=null;e?.getElementById(u)?.remove(),zu(),e&&en(e,0);const t=e?.defaultView||a.lastWin;t?.document.getElementById(Xn)&&Qn(t),t&&(Fo(t),Lt(t),Mo(t))}function su(e){if(a.dragging)return;const t=e.document.getElementById(u);t&&(Qo(e),Le(e,t))}function au(e,t,o){if(o){const r=dn(o,t)||dn(o,e.document)||o;return String(typeof Zt=="function"&&(Zt(r,t)||Zt(r,e.document))||"").trim()}const n=typeof Ue=="function"?Ue(e):"page_sections",s=typeof V=="function"?V(e.document):[];for(const r of s){const l=(he(r.values)||r.values)?.[n];if(Array.isArray(l))for(const c of l){const d=typeof c?.type=="string"?c.type.trim():"";if(d)return d}}return""}function Vt(e){if((e.Statamic?.$config?.get?.("sveFeatures")||{}).collection_templates!==!0)return"";const o=e.Statamic?.$config?.get?.("sveCollectionTemplatesCollection")||"templates";if(!(e.location?.pathname||"").includes(`/collections/${o}/entries/`))return"";const s=typeof V=="function"?V(e.document):[];for(const r of s){const i=he(r.values)||r.values,l=typeof i?.view=="string"?i.view.trim():"";if(!l||l.includes(".."))continue;const c=l.replace(/\.(antlers\.html|blade\.php)$/i,"").replace(/^\/+|\/+$/g,"");if(c)return`view:${c}`}return""}function ru(e,t,o){const n=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},s=n[t]&&typeof n[t].type=="string"?n[t]:null,r=e.Statamic?.$config?.get?.("sveChromeStyles")||{},i=`${t}/${typeof r[t]=="string"&&r[t]!==""?r[t]:"style_1"}`,l=s?.type||i,c=o?.[`${t}_style`];return(!s||s.styled)&&typeof c=="string"&&c!==""?`${t}/${c}`:l}function iu(){const e=ge();if(!e)return"";if(e===go)return"main";if(a.lastWin&&e===Vt(a.lastWin))return"template";const t=e.match(/^(header|footer)\//);if(t)return t[1];const o=a.lastWin?.Statamic?.$config?.get?.("sveChromeTemplates")||{};return["header","footer"].find(n=>o[n]?.type===e)||""}function lu(e){const t=ts||os;return t!=="header"&&t!=="footer"?"":_o(e)||wo(e)?t:""}function cu(e,t){const o=ts||os;return o!=="header"&&o!=="footer"||!_o(t)&&!wo(t)?"":ru(e,o,he(vr()?.values)||{})}function du(e,t){if(!t||String(t).startsWith("view:")||Ts(e,t))return!1;const o=typeof Ue=="function"?Ue(e):"page_sections",n=typeof V=="function"?V(e.document):[];for(const s of n){const i=(he(s.values)||s.values)?.[o];if(Array.isArray(i)&&i.some(l=>l?.type===t))return!0}return!1}function uu(e){const t=es(e)||e.getElementById("__sve-global-section-host");return t&&t.querySelector("[data-replicator-set][data-type]")?.getAttribute("data-type")||""}function qf(e,t,o){if(a.dragging)return;const n=!!(o&&o!==a.lastUid);if(o&&(a.lastUid=o),!e||!t||Fu(t)||!pr(e)||!mr(e)){t&&ca(t);return}const s=!o&&!!a.lastType&&a.lastType!==go&&!_o(t)&&!wo(t)&&!es(t)&&!du(e,a.lastType);s&&(a.lastUid=null);const r=o||a.lastUid||"",i=cu(e,t)||uu(t)||(r?au(e,t,r):"")||Vt(e)||(!o&&!s?a.lastType:""),l=!i&&!o,c=l,d=i;if(a.onEmptyPage=l,a.lastWin=e,c){eu(e,t);return}if(d&&!(d===a.lastType&&t.getElementById(u))){if(a.typeStack.length&&a.lastType&&a.lastType!==d){const f=a.typeStack[0];if(d===f&&!n)return;a.typeStack=[]}W(t),De(e,d,"replace")}}Tt("tw:changed",()=>{a.lastWin&&a.styleMode==="tw"&&L(a.lastWin)});T("dock:is-open",e=>la(e));T("dock:is-locked",()=>le());T("dock:html",()=>me());T("dock:reveal-html",({from:e,to:t,caret:o}={})=>{const n=v.html;if(!n||e==null)return;a.htmlScopePref=et(a.lastWin),tt(),ee();const s=a.htmlFull.length,r=Math.max(0,Math.min(e,s)),i=Math.max(r,Math.min(t??e,s));a.htmlFocus=i>r?{from:r,to:i}:null,a.cssFocus=null;const l=o==null?null:Math.max(0,Math.min(o,s));if(a.htmlScopePref&&a.htmlFocus){Wo(l),q(a.lastWin);return}if(a.htmlScopeActive){Ro(!0,l),q(a.lastWin);return}n.dispatch({selection:l==null?{anchor:r,head:i}:{anchor:l},scrollIntoView:!0}),n.focus()});T("dock:insert-snippet",({win:e,parts:t})=>tu(e,t));T("dock:refresh",e=>nu(e));T("dock:tw-follow",()=>{a.lastWin&&it(a.lastWin)});T("dock:css",()=>(ee(),a.cssFull));T("dock:set-css",e=>typeof e!="string"||le()||!v.css||!a.lastWin?!1:(ee(),a.cssFull=e,ot("css",qs()),G(a.lastWin),!0));T("dock:js",()=>v.js?.state.doc.toString()??"");T("dock:set-js",e=>typeof e!="string"||le()||!v.js||!a.lastWin?!1:(ot("js",e),G(a.lastWin),!0));T("dock:data-menu",({anchor:e,onPick:t,at:o}={})=>!e||!a.lastWin?!1:(R(a.lastWin.document),$(a.lastWin.document),da(a.lastWin,e,t,o),!0));T("dock:props",()=>a.lastProps.map(e=>({...e})));T("dock:set-props",({win:e,props:t}={})=>!Array.isArray(t)||le()?!1:(a.lastProps=t,a.propsDirty=!0,Jr(lt(ge())),W((e||a.lastWin)?.document),!0));function lt(e){const t=/^view:partials\/(components\/[A-Za-z0-9_-]+)$/.exec(String(e||""));return t?t[1]:""}T("dock:component-src",()=>lt(ge()));T("dock:type-stack",()=>a.typeStack.map(e=>({type:e,src:lt(e)})));T("dock:component-exit-state",()=>{const e=lt(ge());return{open:!!e,name:e?e.split("/").pop():"",back:a.typeStack.length>0}});T("dock:exit-component",(e=1)=>{if(!a.lastWin||!lt(ge()))return!1;if(a.typeStack.length){for(let t=Number(e)||1;t>1&&a.typeStack.length>1;t-=1)a.typeStack.pop();Is(a.lastWin)}else ca(a.lastWin.document);return!0});T("dock:current-type",()=>ge());T("dock:on-empty-page",()=>!!a.onEmptyPage);T("dock:current-uid",()=>a.lastUid);T("dock:leave-part",()=>{const e=a.lastWin;return e?(a.lastUid=null,W(e.document),De(e,go,"replace"),!0):!1});T("dock:chrome-kind",()=>iu());T("dock:collection-view",()=>a.lastWin?Vt(a.lastWin):"");T("dock:chrome-open",e=>lu(e));T("dock:save-settled",()=>a.saveInFlight||null);T("dock:load-settled",()=>a.loadInFlight||null);T("dock:reset-data-vars",e=>(pi(typeof e=="string"&&e?e:void 0),!0));T("dock:refresh-preview",()=>a.lastWin?(kt(a.lastWin),!0):!1);T("dock:open-file",e=>typeof e!="string"||!e||!a.lastWin?!1:(a.onEmptyPage=!1,e===a.lastType||(W(a.lastWin.document),De(a.lastWin,e,"replace")),!0));T("dock:open-template",e=>typeof e!="string"||!e||!a.lastWin?!1:(Bs(a.lastWin,e),!0));T("dock:set-html",e=>{const t=e&&typeof e=="object"?e:{},o=e&&typeof e=="object"?e.html:e;if(typeof o!="string"||le())return!1;if(o!==""&&!Qr(me(),o)){const i=a.lastWin;if(!(t?.unlock===!0&&i?.Statamic?.$permissions?.has?.("configure fields")===!0))return i?.Statamic?.$toast?.error(p(i,"html_tree_locked_element")),!1}const n=v.html;if(!n||!a.lastWin)return!1;if(o===""){a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null),a.twDirty=!1,a.twCss=null,a.twKey="",a.lastType=null,a.lastUid=null,a.lastParts={html:"",css:"",js:""},a.cssFull="",a.htmlFull="",a.applying=!0;try{nt();for(const i of se){const l=v[i];if(!l)continue;const c=l.state.doc.toString();c!==""&&l.dispatch({changes:{from:0,to:c.length,insert:""}})}}finally{a.applying=!1}return!0}const s=a.htmlFull;if(a.htmlFull=o,a.htmlScopeActive)return a.htmlFocus=fu(a.htmlFocus,s,o),Ht(Ds()),G(a.lastWin),xo("dock:html-changed"),!0;const r=n.state.doc.toString();if(r!==o){const[i,l,c]=Ls(r,o);n.dispatch({changes:{from:i,to:l,insert:c}})}return!0});T("dock:show-empty",()=>re("dock:set-html",""));Tt("row:removed",({parentPath:e,remaining:t,win:o})=>{t===0&&e===Ue(o)&&re("dock:show-empty")});function fu(e,t,o){const n=o.length-t.length;if(!e||!n)return e;let s=0;for(;s<t.length&&s<o.length&&t[s]===o[s];)s+=1;return s>=e.to?e:s<e.from?{from:Math.max(0,e.from+n),to:Math.max(0,e.to+n)}:{from:e.from,to:Math.max(e.from,e.to+n)}}const Ee="__sve-data-menu";let St=null;function R(e){const t=e?.getElementById(Ee);St?.(),St=null,t?._sveApp?.unmount(),t?.remove(),e?.querySelectorAll("[data-sve-data-vars][data-open], [data-sve-antlers-btn][data-open], [data-sve-visual-edit-btn][data-open]").forEach(o=>o.removeAttribute("data-open"))}function hu(e){if(!Vt(e))return{view:"",kind:""};const t=typeof V=="function"?V(e.document):[];for(const o of t){const n=he(o.values)||o.values,s=typeof n?.source_collection=="string"?n.source_collection.trim():"";if(s)return{view:s,kind:String(n?.kind||"").trim()}}return{view:"",kind:""}}function pu(e,t){const o=me();if(Number.isFinite(t))return mn(o,t);const n=v.html;if(!n)return[];const s=a.htmlScopeActive&&a.htmlFocus?a.htmlFocus.from:0;return mn(o,s+n.state.selection.main.from)}function mu(e,t){const{view:o,kind:n}=hu(e);return{collection:ms(e)||"",set:vs(ge()),view:o,kind:n,scope:hi(pu(e,t))}}function vu(e){const t=typeof V=="function"?V(e.document):[];for(const o of t){const n=he(o.values)||o.values;if(n&&typeof n=="object")return n}return null}function gu(e,t){return{scope:t?.scope?.groups||[],section:ys(t?.section||[],Fs(e)),page:gi(t?.page||[],vu(e)),site:t?.site||[]}}function bu(e){const t=e.state.selection.main,o=e.state.doc.lineAt(t.from),n=o.text.slice(0,t.from-o.from);return/(?:^|\s)(?::|x-bind:)[\w.:-]+\s*=\s*(["'])(?:(?!\1).)*$/.test(n)}function yu(e){const t=e.state.selection.main,o=e.state.doc.lineAt(t.from),n=o.text.slice(0,t.from-o.from);return/(?:^|\s)[\w.:@-]+\s*=\s*(["'])(?:(?!\1).)*$/.test(n)}function ku(e,t){const o=v.html;if(!o||o.state.readOnly)return;if(bu(o)){const c=String(e?.var||"").trim(),d=o.state.selection.main;o.dispatch({changes:{from:d.from,to:d.to,insert:c},selection:{anchor:d.from+c.length}}),P();return}const n=bi(e,t,{inline:yu(o)});if(!n)return;const s=o.state.selection.main,r=o.state.doc.lineAt(s.from),i=ie(r.text),l=Eo(n.text,i);o.dispatch({changes:{from:s.from,to:s.to,insert:l},selection:{anchor:s.from+n.cursor+(n.text.includes(`
`)?i.length:0)}}),P()}function Ne(e,t,o){const n=t.getBoundingClientRect(),s=8,r=o.offsetWidth||368,i=o.offsetHeight||240,l=e.innerHeight-n.bottom-s,c=n.top-s,d=l>=i||l>=c?n.bottom+4:n.top-i-4;o.style.left=`${Math.max(s,Math.min(n.left,e.innerWidth-r-s))}px`,o.style.top=`${Math.max(s,Math.min(d,e.innerHeight-i-s))}px`}function da(e,t,o,n){const s=e.document;R(s),t.setAttribute("data-open","");const r=s.createElement("div");r.id=Ee,r.setAttribute("data-sve-data-menu",""),s.body.appendChild(r);const i=mu(e,n),l=m=>[m?.scope?.groups?.length?{id:"scope",label:m.scope.label||p(e,"data_vars_tab_loop")}:null,{id:"section",label:p(e,"data_vars_tab_section")},{id:"page",label:p(e,"data_vars_tab_page")},{id:"site",label:p(e,"data_vars_tab_site")}].filter(Boolean),c=m=>{s.getElementById(Ee)&&(r._sveApp?.unmount(),r._sveApp=H(us,r,{title:p(e,"data_vars_title"),placeholder:p(e,"data_vars_placeholder"),emptyText:p(e,"data_vars_empty"),noSectionText:p(e,"data_vars_no_section"),loopText:p(e,"data_vars_loop"),tabs:l(m),data:gu(e,m),onPick:(b,k)=>o?o(b,k):ku(b,k)}),Ne(e,t,r))};c(gs(Lo(i))||{scope:null,section:[],page:[],site:[]}),bs(e,i).then(c),Ne(e,t,r);const d=()=>Ne(e,t,r),f=m=>{!r.contains(m.target)&&!t.contains(m.target)&&R(s)},h=m=>{m.key==="Escape"&&R(s)};s.addEventListener("pointerdown",f,!0),s.addEventListener("keydown",h,!0),e.addEventListener("scroll",d,!0),e.addEventListener("resize",d),St=()=>{s.removeEventListener("pointerdown",f,!0),s.removeEventListener("keydown",h,!0),e.removeEventListener("scroll",d,!0),e.removeEventListener("resize",d)}}function ua(e,t,{title:o,placeholder:n,tabs:s,data:r,onPick:i}){const l=e.document;R(l),$(l),t.setAttribute("data-open","");const c=l.createElement("div");c.id=Ee,c.setAttribute("data-sve-data-menu",""),l.body.appendChild(c),c._sveApp=H(us,c,{title:o,placeholder:n,emptyText:p(e,"data_vars_empty"),noSectionText:p(e,"data_vars_empty"),loopText:"",tabs:s,data:r,onPick:(d,f)=>{R(l),i(d,f)}}),Ne(e,t,c),xu(e,t,c)}function xu(e,t,o){const n=e.document,s=()=>Ne(e,t,o),r=l=>{!o.contains(l.target)&&!t.contains(l.target)&&R(n)},i=l=>{l.key==="Escape"&&R(n)};n.addEventListener("pointerdown",r,!0),n.addEventListener("keydown",i,!0),e.addEventListener("scroll",s,!0),e.addEventListener("resize",s),St=()=>{n.removeEventListener("pointerdown",r,!0),n.removeEventListener("keydown",i,!0),e.removeEventListener("scroll",s,!0),e.removeEventListener("resize",s)}}const _u='<svg width="21" height="11" viewBox="0 0 150 77" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M69.999 55.827a13.8 13.8 0 0 0-.812-3.799 15.4 15.4 0 0 0-1.687-3.55 18.16 18.16 0 0 0-5.686-5.418 37.7 37.7 0 0 0 3.936-6.228 18.6 18.6 0 0 0 1.812-6.228 9.88 9.88 0 0 0-1.248-5.57 9.9 9.9 0 0 0-4.125-3.959 10.46 10.46 0 0 0-10.684 1.183 13.8 13.8 0 0 0-4.061 5.107 39 39 0 0 0-1.812 4.92 49.5 49.5 0 0 1-5.436-6.227 16.9 16.9 0 0 1-2.562-5.606 28.7 28.7 0 0 1-.624-6.85c.003-2-.357-3.983-1.063-5.855a10.66 10.66 0 0 0-4.56-5.231 13.9 13.9 0 0 0-10.684-1.37 10.13 10.13 0 0 0-4.94 2.755 10.1 10.1 0 0 0-2.683 4.967 24.4 24.4 0 0 0 0 10.214 22.4 22.4 0 0 0 3.374 7.35h-1.062a23 23 0 0 1-4.124 0 19.2 19.2 0 0 0-6.248 0 6.74 6.74 0 0 0-3.374 2.74 9.45 9.45 0 0 0-.75 9.341 11.23 11.23 0 0 0 5.811 6.228 25.1 25.1 0 0 0 10.622 1.495 17.9 17.9 0 0 0 9.809-3.425 104 104 0 0 1 10.496 7.162 22.4 22.4 0 0 1 5.249 6.54 15.5 15.5 0 0 1 1.437 5.106 35 35 0 0 0 1.437 6.789 13.2 13.2 0 0 0 4.373 5.73 15.6 15.6 0 0 0 10.372 2.802 9.9 9.9 0 0 0 5.429-1.987 9.84 9.84 0 0 0 3.38-4.677A61.6 61.6 0 0 0 70 55.827m-5.061 12.456a5.05 5.05 0 0 1-1.971 2.157 5.07 5.07 0 0 1-2.84.708 9.45 9.45 0 0 1-6.248-2.367 6.6 6.6 0 0 1-2.124-2.989 50 50 0 0 1-1.625-6.788 18.7 18.7 0 0 0-2.249-5.73 28.7 28.7 0 0 0-7.435-7.35A129 129 0 0 0 27.95 38.95c-.812-.498-2.686 0-2.749 0a14.03 14.03 0 0 1-7.872 1.62 19.5 19.5 0 0 1-7.935-2.056 4.86 4.86 0 0 1-2.375-2.49 3.35 3.35 0 0 1 0-2.99 1.18 1.18 0 0 1 .875-.748c1.25 0 2.687 0 3.936-.435a33 33 0 0 0 4.749-1.122 17.6 17.6 0 0 0 4.498-2.18 1.68 1.68 0 0 0 .838-1.68 1.7 1.7 0 0 0-.213-.624 2.2 2.2 0 0 0-.937-.747 18.65 18.65 0 0 1-2.812-7.35 19.5 19.5 0 0 1 .938-7.97 4.55 4.55 0 0 1 1.326-1.834 4.57 4.57 0 0 1 2.048-.97 7.52 7.52 0 0 1 5.498.997 5.12 5.12 0 0 1 2.499 3.488 87 87 0 0 0 1.874 10.587 22.4 22.4 0 0 0 4.436 6.789 78 78 0 0 0 8.372 7.286 1.8 1.8 0 0 0 1.188 1.246 2.005 2.005 0 0 0 2.499-1.308 33.4 33.4 0 0 1 3.249-6.54 8.8 8.8 0 0 1 2.811-2.677 4.63 4.63 0 0 1 4.561 0 4 4 0 0 1 1.612 1.494c.387.638.586 1.372.575 2.118a14.7 14.7 0 0 1-.75 5.792 36.6 36.6 0 0 1-2.561 6.228v.311a2.05 2.05 0 0 0 .5 2.74 13.6 13.6 0 0 1 3.248 4.92c.375.873.563 1.745.875 2.617s.937 2.678 1.312 4.048c1.625 5.916 2.5 7.536.875 10.961zM148.848 29.42a6.6 6.6 0 0 0-3.062-2.74 16.7 16.7 0 0 0-6.248 0c-1.227.09-2.459.09-3.686 0h-.937a24.2 24.2 0 0 0 3.186-7.536c.659-3.31.659-6.716 0-10.027a9.95 9.95 0 0 0-2.072-5.336 10 10 0 0 0-4.676-3.32 12.53 12.53 0 0 0-10.184 1.556 10.78 10.78 0 0 0-4.498 5.668 16.8 16.8 0 0 0-.875 5.667 32.7 32.7 0 0 1 0 6.602 17.2 17.2 0 0 1-2.499 5.543 52 52 0 0 1-4.748 5.792 32 32 0 0 0-1.5-4.547 14.4 14.4 0 0 0-3.811-5.231 9.522 9.522 0 0 0-10.56-.996 10.16 10.16 0 0 0-3.64 4.024 10.1 10.1 0 0 0-1.045 5.317c.21 2.156.78 4.26 1.687 6.228a38.3 38.3 0 0 0 3.748 6.228 17.5 17.5 0 0 0-5.435 5.668 15 15 0 0 0-1.562 3.55 18.3 18.3 0 0 0-.75 3.674v10.09c.068 1.417.32 2.82.75 4.172a9.46 9.46 0 0 0 3.062 4.609 9.5 9.5 0 0 0 5.123 2.118 14.1 14.1 0 0 0 9.871-2.927 12.76 12.76 0 0 0 4.124-5.792 34 34 0 0 0 1.562-6.727 17.6 17.6 0 0 1 1.375-5.107 21.1 21.1 0 0 1 4.623-6.228 83 83 0 0 1 8.935-7.349 16.34 16.34 0 0 0 8.997 3.301 22.24 22.24 0 0 0 9.746-1.557 10.777 10.777 0 0 0 5.499-6.228 9.88 9.88 0 0 0-.5-8.158m-5.623 6.229a4.43 4.43 0 0 1-2.062 2.553 16.16 16.16 0 0 1-7.06 2.18 11.7 11.7 0 0 1-7.123-1.869s-1.999-.81-2.812 0a123 123 0 0 0-11.558 7.038 26.9 26.9 0 0 0-6.811 7.224 79 79 0 0 0-3.623 12.456 6.23 6.23 0 0 1-2 3.052 7.88 7.88 0 0 1-5.373 2.305 4.63 4.63 0 0 1-2.523-.809 4.6 4.6 0 0 1-1.663-2.056 9.8 9.8 0 0 1-.812-3.488c.25-2.711.881-5.373 1.874-7.91.375-1.37.75-2.678 1.187-4.048s.438-1.806.812-2.616a13.26 13.26 0 0 1 2.937-5.044 2.054 2.054 0 0 0 .375-2.74 44 44 0 0 1-2.25-6.228 17.3 17.3 0 0 1-.687-5.792 4.22 4.22 0 0 1 1.937-3.675 3.57 3.57 0 0 1 3.811 0 8.3 8.3 0 0 1 2.625 2.678 40.5 40.5 0 0 1 3.061 6.228 1.93 1.93 0 0 0 1.664 1.441c.26.029.522.005.773-.07a1.82 1.82 0 0 0 1.187-1.309 80 80 0 0 0 7.872-7.411 22.5 22.5 0 0 0 3.999-6.664 75.4 75.4 0 0 0 1.749-10.525 5.17 5.17 0 0 1 1.937-3.176 5.76 5.76 0 0 1 4.749-.935 4.11 4.11 0 0 1 3.186 2.927c.751 2.609.985 5.338.687 8.035a19 19 0 0 1-2.561 7.473s-.625 0-.75.56a1.68 1.68 0 0 0 .5 2.367c1.27.908 2.657 1.641 4.123 2.18 1.468.49 2.972.865 4.499 1.121 1.125 0 2.374 0 3.561.436s.438.311.625.623c.235.52.351 1.087.341 1.657a3.9 3.9 0 0 1-.403 1.644z"/></svg>',wu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 9 5 12 1.8-5.2L21 14Z"/><path d="M7.2 2.2 8 5.1"/><path d="m5.1 8-2.9-.8"/><path d="M14 4.1 12 6"/><path d="m6 12-1.9 2"/></svg>';function fa(e,t,o,n,s){const r=e.document.createElement("button");return r.type="button",r.setAttribute(o,""),r.title=s,r.setAttribute("aria-label",s),r.innerHTML=`<span>${n}</span>`,r.addEventListener("mousedown",i=>i.preventDefault()),t.replaceChildren(r),r}function Su(e){return String(e||"").replace(/\|/g,"").split(`
`)[0].trim()}function $u(e,t){const o=t.querySelector("[data-sve-data-vars]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("mousedown",n=>n.preventDefault()),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),e.document.getElementById(Ee)){R(e.document);return}$(e.document),da(e,o)}))}function Cu(e,t){const o=t.querySelector("[data-sve-antlers-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=fa(e,o,"data-sve-antlers-btn",_u,p(e,"code_dock_antlers"));n.addEventListener("click",s=>{if(s.preventDefault(),s.stopPropagation(),n.hasAttribute("data-open")){R(e.document);return}const r={};for(const i of vn)r[i.id]=ri.filter(l=>l.group===i.id).map(l=>({id:l.id,var:l.label,value:l.inline?"":Su(l.snippet)}));ua(e,n,{title:p(e,"code_dock_antlers"),placeholder:p(e,"code_dock_antlers_search"),tabs:vn.map(i=>({id:i.id,label:p(e,i.lang)})),data:r,onPick:i=>Tu(i.id)})})}function Tu(e){const t=ii(e),o=v.html;if(!t||!o||o.state.readOnly)return;const n=o.state.selection.main.head;if(t.inline){const c=t.snippet,d=o.state.selection.main;o.dispatch({changes:{from:d.from,to:d.to,insert:c},selection:{anchor:d.from+c.length}}),P();return}const s=o.state.doc.lineAt(n),r=s.text.trim()?ie(s.text):Wt(o,s)||ie(s.text),{text:i,cursor:l}=gt(t.snippet);Xe(Eo(i,r),l),P()}function Au(e,t){const o=t.querySelector("[data-sve-visual-edit-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=fa(e,o,"data-sve-visual-edit-btn",wu,p(e,"code_dock_visual_edit"));n.addEventListener("click",s=>{if(s.preventDefault(),s.stopPropagation(),n.hasAttribute("data-open")){R(e.document);return}const r={};for(const i of bn)r[i.id]=ks.filter(l=>l.group===i.id).map(l=>({id:l.id,var:l.label,value:l.attr?l.attr.replace(/\|/g,""):""}));ua(e,n,{title:p(e,"code_dock_visual_edit"),placeholder:p(e,"code_dock_visual_edit_search"),tabs:bn.map(i=>({id:i.id,label:p(e,i.lang)})),data:r,onPick:i=>Eu(i.id)})})}function Mu(e,t,o,n){if(xi(o.inner,n.attr)){e.focus();return}const{text:s,cursor:r}=gt(n.attr);let i=o.closeIdx;for(;i>o.openIdx+2&&/\s/.test(t[i-1]);)i--;e.dispatch({changes:{from:i,to:o.closeIdx,insert:` ${s} `},selection:{anchor:i+1+r}}),P()}function Eu(e){const t=yi(e),o=v.html;if(!t||!o||o.state.readOnly)return;const n=o.state.doc.toString(),s=st();if(s?.open){const h=ki(n,s.open.from,s.open.to,dt);if(h){t.attr?Mu(o,n,h,t):(o.dispatch({selection:{anchor:h.openIdx+2+dt.length}}),o.focus());return}const m=s.open.from+1+s.name.length,b=t.standalone||`{{ ${dt} ${t.attr} }}`,{text:k,cursor:O}=gt(b);o.dispatch({changes:{from:m,to:m,insert:` ${k}`},selection:{anchor:m+1+O}}),P();return}const r=o.state.selection.main.head,i=o.state.doc.lineAt(r),l=i.text.trim()?ie(i.text):Wt(o,i)||ie(i.text),c=t.standalone||`{{ ${dt} ${t.attr} }}`,{text:d,cursor:f}=gt(c);Xe(Eo(d,l),f),P()}function Lu(e){return e==="css"?Ia():e==="js"?Oa():Ba({autoCloseTags:!0})}function Vn(e){if(e._sveShield)return;e._sveShield=!0;const t=o=>o.stopPropagation();for(const o of["keydown","keypress","keyup","pointerdown","pointerup","mousedown","mouseup","click","focusin"])e.addEventListener(o,t)}function Fu(e){try{return new URLSearchParams(e.defaultView?.location?.search||"").has("sve-panel")}catch{return!1}}function Bu(e){const t=parseInt(X(e,Ha)??"",10);return Number.isFinite(t)&&t>=Na?t:Zu}function Iu(e,t){N(e,Ha,String(t))}function ha(e){try{const t=JSON.parse(X(e,ja)||"null");if(t&&typeof t=="object")return{html:t.html!==!1,css:t.css!==!1,js:t.js===!0,alpine:t.alpine===!0}}catch{}return{html:!0,css:!0,js:!1,alpine:!1}}function Ou(e,t){N(e,ja,JSON.stringify(t))}function pa(e){try{const t=JSON.parse(X(e,za)||"null");if(t&&typeof t=="object"){const o=s=>Number.isFinite(s)&&s>0?s:1,n={};for(const s of Se)n[s]=o(t[s]);return n}}catch{}return Object.fromEntries(Se.map(t=>[t,1]))}function Pu(e,t){N(e,za,JSON.stringify(t))}function Du(e){lr(e,Yu,`
@keyframes sve-cm-wait { to { transform: rotate(360deg); } }
#${u} {
  /* The tree's seven families, for the marks and the toolbar below. */
  ${xr("dark")}
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
  border-radius: 0.25rem;
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
  border-radius: 0.25rem;
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
  border-radius: 0.25rem;
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
  border-radius: 0.25rem;
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
  border-radius: 0.25rem;
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
#${u}[data-sve-code-locked] [data-sve-values-mode] {
  display: none;
}
#${u} [data-sve-values-mode],
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
  border-radius: 0.25rem;
  color: #d4d4d4;
  opacity: .8;
  background: rgba(255,255,255,.1);
  font-size: 11px;
  white-space: nowrap;
}
#${u} [data-sve-values-mode]:hover,
#${u} [data-sve-style-mode]:hover {
  opacity: 1;
  background: rgba(255,255,255,.16);
}
#${u} [data-sve-values-mode][aria-pressed="true"],
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
  border-radius: 0.25rem;
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
  border-radius: 0.25rem;
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
  border-radius: 0.25rem;
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
  ${un("ns")}
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
  border-radius: 0.25rem;
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
  border-radius: 0.25rem;
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
  border-radius: 0.25rem;
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
  border-radius: 0.25rem;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 8px 24px rgba(0,0,0,.4);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${Ee} {
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
  border-radius: 0.25rem;
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
  border-radius: 0.25rem;
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
  border-radius: 0.25rem;
  background: rgba(0,0,0,.28);
}
[data-sve-data-menu] [data-sve-data-tab] {
  all: unset;
  flex: 1 1 0;
  box-sizing: border-box;
  padding: 0.35em 0;
  border-radius: 0.25rem;
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
  border-radius: 0.25rem;
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
  border-radius: 0.25rem;
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
  border-radius: 0.25rem;
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
  border-radius: 0.25rem;
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
  border-radius: 0.25rem;
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
  border-radius: 0.25rem;
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
  border-radius: 0.25rem;
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
  border-radius: 0.25rem;
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
  border-radius: 0.25rem;
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
  ${un("ew")}
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
  border-radius: 0.25rem;
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
  border-radius: 0.25rem;
}
#${te} {
  all: unset;
  position: fixed;
  z-index: 90;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 0.25rem;
  background: #3c3c3c;
  color: #d7ba7d;
  border: 1px solid rgba(255,255,255,.16);
  box-shadow: 0 2px 8px rgba(0,0,0,.35);
  cursor: pointer;
}
#${te}:hover {
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
  border-radius: 0.25rem;
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
#${ct} {
  position: fixed;
  z-index: 90;
  min-width: 168px;
  max-width: 280px;
  max-height: 240px;
  overflow: auto;
  padding: 6px;
  border-radius: 0.25rem;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 8px 24px rgba(0,0,0,.4);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${ct} [data-sve-partial-choice] {
  all: unset;
  cursor: pointer;
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 5px 8px;
  border-radius: 0.25rem;
  font-size: 13px;
  /* A sentence now — "Open image" — not a file name, and the same face the
     HTML tree's row menu uses. */
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${ct} [data-sve-partial-choice]:hover {
  background: rgba(255,255,255,.1);
}
#${ct} [data-sve-partial-empty] {
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
  border-radius: 0.25rem;
  border: 1px solid rgba(255,255,255,.25);
  margin: 0 6px 4px 0;
  vertical-align: middle;
}
.cm-tooltip.sve-tw-complete {
  background: #1E1E21 !important;
  color: #d4d4d4;
  border: 1px solid #454545 !important;
  border-radius: 0.25rem;
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
`)}function Hu(e){const t=e.querySelector(".live-preview-editor");if(!t)return 0;const o=t.getBoundingClientRect();return o.width<40||o.right<40?0:Math.round(o.right)}function ju(e){let t=0;for(const o of["__sve-section-picker","__sve-outline-panel","__sve-html-tree-panel","__sve-listview-panel","__sve-right-dock","__sve-chrome-designs","__sve-global-section-panel","__sve-ai-panel"]){const n=e.getElementById(o);if(!n||n.hasAttribute("data-sve-chrome-hidden")||n.hasAttribute("data-sve-right-closed")||n.style.display==="none")continue;const s=n.getBoundingClientRect();s.width>40&&s.right>e.documentElement.clientWidth-8&&(t=Math.max(t,Math.round(s.width)))}return t}function Qo(e){const t=e.document;if(a.layoutWin=e,typeof e.ResizeObserver!="function")return;a.layoutObserver||(a.layoutObserver=new e.ResizeObserver(()=>{a.layoutWin&&su(a.layoutWin)}));const o=t.querySelector(".live-preview-editor"),n=t.getElementById("__sve-right-dock");o!==a.observedEditor&&(a.observedEditor&&a.layoutObserver.unobserve(a.observedEditor),a.observedEditor=o,o&&a.layoutObserver.observe(o)),n!==a.observedRight&&(a.observedRight&&a.layoutObserver.unobserve(a.observedRight),a.observedRight=n,n&&a.layoutObserver.observe(n))}function zu(){a.layoutObserver?.disconnect(),a.layoutObserver=null,a.layoutWin=null,a.observedEditor=null,a.observedRight=null}function Wu(e){a.layoutWatchBound||(a.layoutWatchBound=!0,e.addEventListener("sve-right-dock-change",()=>Qo(e)))}function en(e,t){const o=e.querySelector(".live-preview-contents");o&&(o.style.paddingBottom=t?`${t}px`:"")}function tn(e){if(!e)return;const t=e.clientHeight,o=e.querySelector("[data-sve-code-bar]"),n=e.querySelector("[data-sve-code-lock-banner]"),s=n&&Ru(e)?.getComputedStyle(n).display!=="none"?n.offsetHeight:0,r=Math.max(64,t-(o?.offsetHeight||0)-s),i=e.querySelector("[data-sve-code-panes]");i&&(i.style.height=`${r}px`,i.style.minHeight="0",i.style.overflow="hidden"),e.querySelectorAll("[data-sve-code-host]").forEach(l=>{const c=l.closest("[data-sve-code-pane]");if(!c||c.style.display==="none")return;let d=0;for(const h of c.children)h!==l&&(d+=h.offsetHeight);const f=Math.max(64,r-d);l.style.height=`${f}px`,l.style.maxHeight=`${f}px`,l.style.minHeight="0",l.style.overflow="auto",Nu(l)})}function Ru(e){return e.ownerDocument?.defaultView||a.lastWin}function Nu(e){e._sveWheelBound||(e._sveWheelBound=!0,e.addEventListener("wheel",t=>{const o=e.scrollHeight-e.clientHeight,n=e.scrollWidth-e.clientWidth;let s=!1;if(t.deltaY&&o>0){const r=Math.min(o,Math.max(0,e.scrollTop+t.deltaY));r!==e.scrollTop&&(e.scrollTop=r,s=!0)}if(t.deltaX&&n>0){const r=Math.min(n,Math.max(0,e.scrollLeft+t.deltaX));r!==e.scrollLeft&&(e.scrollLeft=r,s=!0)}s&&(t.preventDefault(),t.stopPropagation())},{passive:!1}))}function ma(){const e=(a.layoutWin||a.lastWin)?.document?.getElementById(u);e&&tn(e);for(const t of se)v[t]?.requestMeasure()}function va(e,t){const o=ha(e),n={};for(const s of Se){const r=t.querySelector(`[data-sve-code-pane-btn="${s}"]`);n[s]=r?r.getAttribute("aria-pressed")==="true":o[s]}return n}function ga(e,t){for(const n of Se){const s=e.querySelector(`[data-sve-code-pane-btn="${n}"]`),r=e.querySelector(`[data-sve-code-pane="${n}"]`);s&&s.setAttribute("aria-pressed",t[n]?"true":"false"),r&&(r.style.display=t[n]?"flex":"none")}const o=Se.filter(n=>t[n]);e.querySelectorAll("[data-sve-code-split]").forEach(n=>{const s=n.getAttribute("data-sve-code-split-after"),r=o.indexOf(s);n.style.display=r>=0&&r<o.length-1?"block":"none"}),ba(e.ownerDocument.defaultView,e),tn(e)}function ba(e,t){const o=pa(e);for(const n of Se){const s=t.querySelector(`[data-sve-code-pane="${n}"]`);s&&(s.style.flex=`${o[n]} 1 0`)}}function Le(e,t){if(a.dragging)return;const o=e.document;no(o,t);const n=Bu(e),s=Hu(o),r=ju(o);t.style.left=`${s}px`,t.style.right=`${r}px`,t.style.bottom="0",t.style.height=`${n}px`,en(o,n),tn(t)}function ya(e,t,o,n){a.dragging=!0,_r(e,t,o,()=>{a.dragging=!1,n?.()},"data-sve-code-drag-shield")}function qu(e,t){if(t._sveResizeBound)return;t._sveResizeBound=!0;const o=n=>{if(n.button!==0||n.target.closest('button, a, input, select, textarea, label, [role="button"], [contenteditable], .cm-editor'))return;n.preventDefault();const s=n.clientY,r=t.getBoundingClientRect().height;let i=r;ya(e,"ns-resize",l=>{i=Math.min(Math.max(Na,r+(s-l.clientY)),Math.round(e.innerHeight*.7)),t.style.height=`${i}px`,en(e.document,i),ma()},()=>{Iu(e,i),Le(e,t),e.dispatchEvent(new Event("resize"))})};t.querySelector("[data-sve-code-bar]")?.addEventListener("mousedown",o),t.querySelector("[data-sve-code-grip]")?.addEventListener("mousedown",o)}function Vu(e,t){t._sveSplitBound||(t._sveSplitBound=!0,t.querySelectorAll("[data-sve-code-split]").forEach(o=>{o.addEventListener("mousedown",n=>{if(n.button!==0)return;n.preventDefault(),n.stopPropagation();const s=o.getAttribute("data-sve-code-split-after"),r=Se.filter(O=>va(e,t)[O]),i=r.indexOf(s),l=r[i],c=r[i+1];if(!l||!c)return;const d=t.querySelector(`[data-sve-code-pane="${l}"]`),f=t.querySelector(`[data-sve-code-pane="${c}"]`),h=n.clientX,m=d.getBoundingClientRect().width,b=f.getBoundingClientRect().width,k=m+b;o.setAttribute("data-active",""),ya(e,"col-resize",O=>{const Ga=O.clientX-h;let Kt=Math.max(oo,Math.min(k-oo,m+Ga)),sn=k-Kt;k<oo*2&&(Kt=m,sn=b);const Gt=pa(e);Gt[l]=Kt,Gt[c]=sn,Pu(e,Gt),ba(e,t),ma()},()=>{o.removeAttribute("data-active")})})}))}function Uu(e,t){t._svePaneBound||(t._svePaneBound=!0,t.querySelectorAll("[data-sve-code-pane-btn]").forEach(o=>{o.addEventListener("click",n=>{n.stopPropagation();const s=o.getAttribute("data-sve-code-pane-btn"),r=va(e,t),i={...r,[s]:!r[s]};!i.html&&!i.css&&!i.js&&(i[s]=!0),Ou(e,i),ga(t,i)})}))}function I(e,t){const o=e.getElementById(u)?.querySelector("[data-sve-code-status]");o&&(o.textContent=t||"")}function on(e,t){const o=e.getElementById(u)?.querySelector("[data-sve-code-path]");o&&(o.textContent=t||"",o.title=t||"")}function Fe(e){const t=e?.document?.getElementById(u)?.querySelector("[data-sve-code-back]");t&&(t.hidden=a.typeStack.length===0,t.title=p(e,"code_dock_back"),t.setAttribute("aria-label",t.title),t.innerHTML=tf)}function Un(e,t){const o=t.querySelector("[data-sve-code-back]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Is(e)}))}let F,ho,ka,xa,_a,be,Je,ce,He,de,J,wa,Sa,$a,Ca,Ta,Aa,Ma,Ea,La,Fa,$t,Ba,Ia,Oa,Pa,po,mo,Da,Ku,ze=null,C=null;function Gu(){return ze||(ze=Za().then(e=>{C=e,F=C.view.EditorView,ho=C.view.keymap,ka=C.view.lineNumbers,xa=C.view.highlightActiveLine,_a=C.view.highlightActiveLineGutter,be=C.state.Compartment,Je=C.state.EditorState,ce=C.state.StateField,He=C.state.StateEffect,de=C.state.RangeSetBuilder,J=C.view.Decoration,wa=C.commands.defaultKeymap,Sa=C.commands.indentWithTab,$a=C.commands.historyKeymap,Ca=C.commands.history,Ta=C.autocomplete.autocompletion,Aa=C.autocomplete.closeBrackets,Ma=C.autocomplete.closeBracketsKeymap,Ea=C.autocomplete.closeCompletion,La=C.autocomplete.completionKeymap,Fa=C.view.hoverTooltip,$t=C.langHtml.htmlLanguage,Ba=C.langHtml.html,Ia=C.langCss.css,Oa=C.langJs.javascript,C.language.HighlightStyle,C.language.syntaxHighlighting,Pa=C.language.codeFolding,po=C.language.foldEffect,mo=C.language.unfoldEffect,Da=C.language.foldedRanges,Ku=C.highlight.tags,qe.html=new be,qe.css=new be,qe.js=new be,Ve.html=new be,Ve.css=new be,Ve.js=new be}).catch(e=>{throw ze=null,e}),ze)}const Xu="{{ _class }}",u=Xa,Yu="__sve-code-dock-style",U="__sve-code-dock-unlock",Ha="sve-code-dock-height",ja="sve-code-dock-panes",za="sve-code-dock-widths",Ut="sve-html-scope-v2",Wa="sve-code-dock-autosave",Ra="sve-code-dock-style-mode",nn="sve-code-dock-values",Zu=280,Na=120,oo=140,Ju=250,se=["html","css","js"],Se=["html","css","alpine","js"],Qu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',ef='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-1"/></svg>',tf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',qa='<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1c0 .966.784 1.75 1.75 1.75h.418A1.74 1.74 0 0 0 4 7.25v1.5c0 .49.201.932.525 1.25c-.324.318-.525.76-.525 1.25v1c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 14 12.25v-1c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1.5c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1A1.75 1.75 0 0 0 12.25 2zm8.5 7.5H8v-3h4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75M7 6.5v3H5.75A.75.75 0 0 1 5 8.75v-1.5a.75.75 0 0 1 .75-.75zm1 4h4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75H8zm-1 0V13H5.75a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-1-5V3h6.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75zm-1 0H3.75A.75.75 0 0 1 3 4.75v-1A.75.75 0 0 1 3.75 3H5z"/></svg>',of='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/><path d="M4.5 11.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/></svg>',nf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 16.3A8.5 8.5 0 1 1 18.3 6.3"/><path d="M21 3.2v5.4h-5.4"/></svg>',sf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',af='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',y="__sve-css-menu",Va=["h1","h2","h3","h4","h5","h6"],vo=[{id:"section",title:"section",tag:"section"},{id:"div",title:"div",tag:"div"},{id:"heading",title:"heading",menu:"heading"},{id:"text",title:"text",menu:"text"},{id:"a",title:"link",tag:"a"},{id:"img",title:"image",snippet:'<img src="" alt="">',caret:10},{id:"video",title:"video",snippet:'<video src="" controls playsinline></video>',caret:12},{id:"ul",title:"list",tag:"ul"},{id:"li",title:"list item",tag:"li"},{id:"component",title:"component",menu:"component"},{id:"loop",title:"loop",snippet:`{{ items }}

{{ /items }}
`,caret:3,select:5},{id:"if",title:"if",snippet:`{{ if true }}

{{ /if }}
`,caret:6,select:4}],rf=["--size-100","--size-200","--size-300","--size-400","--size-500","--size-600","--size-700","--size-800","--size-900","--gutter"],lf={"tw-text":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 13 5 3l3.5 10M2.7 10h4.6"/><path d="M12.5 3.5v9M11 5l1.5-1.5L14 5M11 11l1.5 1.5L14 11"/></svg>',"tw-leading":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h8.5M6 8h8.5M6 12.5h8.5"/><path d="M2.5 4.5v7M1.4 5.6 2.5 4.5l1.1 1.1M1.4 10.4l1.1 1.1 1.1-1.1"/></svg>',"tw-font":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.2V3h10v1.2M8 3v10M6 13h4"/></svg>',"tw-radius":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 13.5v-6a5 5 0 0 1 5-5h6"/><path d="M13.5 6.5v7h-7" stroke-dasharray="2 2"/></svg>',"tw-gap":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"tw-align":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3.5h12M2 8h8M2 12.5h10"/></svg>',"tw-w":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3.5v9M14 3.5v9"/><path d="M4.5 8h7"/><path d="M6 6.2 4.2 8 6 9.8M10 6.2 11.8 8 10 9.8"/></svg>',"tw-h":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 2h9M3.5 14h9"/><path d="M8 4.5v7"/><path d="M6.2 6 8 4.2 9.8 6M6.2 10 8 11.8 9.8 10"/></svg>',"tw-maxw":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3v10M14.5 3v10"/><path d="M5 8h6"/><path d="M6.6 6.2 4.8 8l1.8 1.8M9.4 6.2 11.2 8l-1.8 1.8"/></svg>',"tw-overflow":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="1.8" y="4.5" width="8.6" height="9.7" rx="1.2"/><path d="M6.5 1.8h7.7v7.7" stroke-linecap="round"/></svg>',"tw-border":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6"/><rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" stroke-width="1" opacity=".45"/></svg>',"tw-border-color":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6" stroke-dasharray="3.1 2.2"/><rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" fill="currentColor" stroke="none" opacity=".55"/></svg>'},cf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="10" width="18" height="11" rx="2"/><rect x="6" y="3" width="9" height="4" rx="1.4" fill="currentColor" stroke="none"/></svg>',df='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.1 12a8.9 8.9 0 1 0 2.8-6.5L3 8"/><path d="M3 3.4V8h4.6"/><path d="M12 7.4V12l3 1.8"/></svg>',uf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>',ff='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></svg>',hf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/><path d="M3 17c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/></svg>',Ua=[["--gray-50","#fafafa"],["--gray-100","#f5f5f5"],["--gray-200","#e5e5e5"],["--gray-300","#d4d4d4"],["--gray-400","#a3a3a3"],["--gray-500","#737373"],["--gray-600","#525252"],["--gray-700","#404040"],["--gray-800","#262626"],["--gray-900","#171717"],["--gray-950","#0a0a0a"]],Kn=e=>[{id:`${e}-all`,icon:"box-all",title:"All sides",css:e,tw:e,menu:"spacing"},{id:`${e}-block`,icon:"box-block",title:"Top and bottom",css:`${e}-block`,tw:`${e}-block`,menu:"spacing",sep:!0},{id:`${e}-block-start`,icon:"box-block-start",title:"Top",css:`${e}-block-start`,tw:`${e}-top`,menu:"spacing"},{id:`${e}-block-end`,icon:"box-block-end",title:"Bottom",css:`${e}-block-end`,tw:`${e}-bottom`,menu:"spacing"},{id:`${e}-inline`,icon:"box-inline",title:"Left and right",css:`${e}-inline`,tw:`${e}-inline`,menu:"spacing",sep:!0},{id:`${e}-inline-start`,icon:"box-inline-start",title:"Left",css:`${e}-inline-start`,tw:`${e}-left`,menu:"spacing"},{id:`${e}-inline-end`,icon:"box-inline-end",title:"Right",css:`${e}-inline-end`,tw:`${e}-right`,menu:"spacing"}],pf=[{id:"display-flex",twClass:"flex",icon:"display-flex",title:"Flex",kind:"display",value:"flex",css:"display"},{id:"flex-row",twClass:"flex-row",icon:"flex-row",title:"Direction: row",kind:"flexDir",value:"row",css:"flex-direction",sep:!0},{id:"flex-col",twClass:"flex-col",icon:"flex-col",title:"Direction: column",kind:"flexDir",value:"column",css:"flex-direction"},{id:"justify-start",twClass:"justify-start",icon:"justify-start",title:"Justify: start",css:"justify-content",value:"flex-start",when:"flex",sep:!0},{id:"justify-center",twClass:"justify-center",icon:"justify-center",title:"Justify: center",css:"justify-content",value:"center",when:"flex"},{id:"justify-end",twClass:"justify-end",icon:"justify-end",title:"Justify: end",css:"justify-content",value:"flex-end",when:"flex"},{id:"justify-between",twClass:"justify-between",icon:"justify-between",title:"Justify: between",css:"justify-content",value:"space-between",when:"flex"},{id:"justify-around",twClass:"justify-around",icon:"justify-around",title:"Justify: around",css:"justify-content",value:"space-around",when:"flex"},{id:"align-start",twClass:"items-start",icon:"align-start",title:"Align: start",css:"align-items",value:"flex-start",when:"flex",sep:!0},{id:"align-center",twClass:"items-center",icon:"align-center",title:"Align: center",css:"align-items",value:"center",when:"flex"},{id:"align-end",twClass:"items-end",icon:"align-end",title:"Align: end",css:"align-items",value:"flex-end",when:"flex"},{id:"align-stretch",twClass:"items-stretch",icon:"align-stretch",title:"Align: stretch",css:"align-items",value:"stretch",when:"flex"}],mf=[{id:"gap-all",icon:"gap-all",title:"Both",css:"gap",tw:"gap",menu:"spacing"},{id:"gap-row",icon:"gap-row",title:"Between rows",css:"row-gap",tw:"row-gap",menu:"spacing",sep:!0},{id:"gap-col",icon:"gap-col",title:"Between columns",css:"column-gap",tw:"column-gap",menu:"spacing"}],vf=["1px","2px","3px","4px","8px"],ye=(e,t,o,n,s,r)=>({id:e,icon:t,title:o,css:n,menu:"choices",choices:vf,twGroup:[s,`${s}-2`,`${s}-4`,`${s}-8`],...r?{sep:!0}:{}}),gf=[ye("bw-all","bd-all","All sides","border-width","border"),ye("bw-block","bd-block","Top and bottom","border-block-width","border-y",!0),ye("bw-top","bd-top","Top","border-block-start-width","border-t"),ye("bw-bottom","bd-bottom","Bottom","border-block-end-width","border-b"),ye("bw-inline","bd-inline","Left and right","border-inline-width","border-x",!0),ye("bw-left","bd-left","Left","border-inline-start-width","border-l"),ye("bw-right","bd-right","Right","border-inline-end-width","border-r")],bf=[{id:"bd-all",icon:"bd-all",title:"All sides",css:"border-color",tw:"border-color",menu:"colors"},{id:"bd-block",icon:"bd-block",title:"Top and bottom",css:"border-block-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-top",icon:"bd-top",title:"Top",css:"border-block-start-color",tw:"border-top-color",menu:"colors"},{id:"bd-bottom",icon:"bd-bottom",title:"Bottom",css:"border-block-end-color",tw:"border-bottom-color",menu:"colors"},{id:"bd-inline",icon:"bd-inline",title:"Left and right",css:"border-inline-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-left",icon:"bd-left",title:"Left",css:"border-inline-start-color",tw:"border-left-color",menu:"colors"},{id:"bd-right",icon:"bd-right",title:"Right",css:"border-inline-end-color",tw:"border-right-color",menu:"colors"}],yf=[{id:"rd-all",icon:"rd-all",title:"All corners",css:"border-radius",tw:"border-radius",menu:"values"},{id:"rd-tl",icon:"rd-tl",title:"Top left",css:"border-start-start-radius",tw:"border-top-left-radius",menu:"values",sep:!0},{id:"rd-tr",icon:"rd-tr",title:"Top right",css:"border-start-end-radius",tw:"border-top-right-radius",menu:"values"},{id:"rd-br",icon:"rd-br",title:"Bottom right",css:"border-end-end-radius",tw:"border-bottom-right-radius",menu:"values"},{id:"rd-bl",icon:"rd-bl",title:"Bottom left",css:"border-end-start-radius",tw:"border-bottom-left-radius",menu:"values"}],Ka=[{id:"display",title:"Display",css:"display",tw:"display",kids:pf},{id:"absolute",title:"Position",css:"position",tw:"position",value:"absolute"},{id:"color",title:"Text color",css:"color",tw:"color",menu:"colors"},{id:"bg",title:"Background color",css:"background-color",tw:"background-color",menu:"colors"},{id:"padding",title:"Padding",css:"padding",tw:"padding",kids:Kn("padding")},{id:"margin",title:"Margin",css:"margin",tw:"margin",kids:Kn("margin")},{id:"tw-text",title:"Font size",css:"font-size",tw:"font-size",menu:"values"},{id:"tw-leading",title:"Line height",css:"line-height",tw:"line-height",menu:"values"},{id:"tw-font",title:"Font family",css:"font-family",tw:"font-family",menu:"values"},{id:"tw-align",title:"Text align",css:"text-align",tw:"text-align",menu:"choices",choices:["left","center","right","justify"]},{id:"tw-border",title:"Border",css:"border-width",tw:"border-width",kids:gf},{id:"tw-border-color",title:"Border color",css:"border-color",tw:"border-color",kids:bf},{id:"tw-radius",title:"Radius",css:"border-radius",tw:"border-radius",kids:yf},{id:"tw-gap",title:"Gap",css:"gap",tw:"gap",kids:mf},{id:"tw-w",title:"Width",css:"width",tw:"width",menu:"sizes"},{id:"tw-h",title:"Height",css:"height",tw:"height",menu:"sizes"},{id:"tw-maxw",title:"Max width",css:"max-width",tw:"max-width",menu:"sizes"},{id:"tw-overflow",title:"Overflow",css:"overflow",tw:"overflow",menu:"choices",choices:["visible","hidden","clip","auto","scroll"]}],kf=["100%","auto","fit-content","min-content","max-content","100vw","100dvh","0"],Ct=new Map;for(const e of Ka){Ct.set(e.id,{tool:e,kid:null});for(const t of e.kids||[])Ct.set(t.id,{tool:e,kid:t})}const Gn={display:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2.5" width="13" height="11" rx="1.2"/><path d="M5 6.5h6M5 9.5h4"/></svg>',"display-flex":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="3.4" height="9" rx=".4"/><rect x="6.3" y="3.5" width="3.4" height="9" rx=".4"/><rect x="10.6" y="3.5" width="3.4" height="9" rx=".4"/></svg>',"flex-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12"/><path d="M4.2 5.8 2 8l2.2 2.2"/><path d="M11.8 5.8 14 8l-2.2 2.2"/></svg>',"flex-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v12"/><path d="M5.8 4.2 8 2l2.2 2.2"/><path d="M5.8 11.8 8 14l2.2-2.2"/></svg>',"justify-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="5.4" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4.6" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="8.2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-between":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-around":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"align-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="5.4" width="9" height="2.4" rx=".4"/></svg>',"align-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="4.6" width="9" height="2.4" rx=".4"/><rect x="3.5" y="9" width="9" height="2.4" rx=".4"/></svg>',"align-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="8.2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="11.6" width="9" height="2.4" rx=".4"/></svg>',"align-stretch":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx=".5"/><rect x="9" y="2" width="4" height="12" rx=".5"/></svg>',absolute:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>',color:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.4 11.2 7.4 2.4l4 8.8"/><path d="M4.7 8.4h5.4"/><rect x="1.6" y="12.8" width="12.8" height="2.2" rx=".6" fill="currentColor" stroke="none"/></svg>',bg:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 1.9a6.1 6.1 0 1 0 0 12.2c.85 0 1.35-.55 1.35-1.25 0-.38-.18-.66-.4-.88a1.2 1.2 0 0 1 .85-2.05h1.3A3.5 3.5 0 0 0 14.1 6.1C14.1 3.75 11.4 1.9 8 1.9Z"/><circle cx="4.9" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="8" cy="4.8" r=".95" fill="currentColor" stroke="none"/><circle cx="11.1" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="4.7" cy="9.9" r=".95" fill="currentColor" stroke="none"/></svg>',padding:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/></svg>',margin:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/><path d="M2 2.5h12M2 13.5h12M2.5 2v12M13.5 2v12" stroke-dasharray="1.4 1.2"/></svg>',"box-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".4" fill="currentColor" stroke="none"/></svg>',"box-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"gap-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"gap-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="3" y="1.6" width="10" height="4.2" rx=".6"/><rect x="3" y="10.2" width="10" height="4.2" rx=".6"/><path d="M4.5 8h7"/></svg>',"gap-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"bd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4"/></svg>',"bd-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-top":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-bottom":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-left":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-right":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"rd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="3.4"/></svg>',"rd-tl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6H6a3.4 3.4 0 0 0-3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M2.6 9V6A3.4 3.4 0 0 1 6 2.6h3" stroke-width="2.2"/></svg>',"rd-tr":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6h7.4a3.4 3.4 0 0 1 3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M7 2.6h3A3.4 3.4 0 0 1 13.4 6v3" stroke-width="2.2"/></svg>',"rd-br":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6v7.4a3.4 3.4 0 0 1-3.4 3.4H2.6" stroke-width="1" opacity=".35"/><path d="M13.4 7v3a3.4 3.4 0 0 1-3.4 3.4H7" stroke-width="2.2"/></svg>',"rd-bl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6v7.4a3.4 3.4 0 0 0 3.4 3.4h7.4" stroke-width="1" opacity=".35"/><path d="M2.6 7v3A3.4 3.4 0 0 0 6 13.4h3" stroke-width="2.2"/></svg>'},v={html:null,css:null,js:null},qe={html:null,css:null,js:null},Ve={html:null,css:null,js:null};export{Kf as ARMED_KEY,nf as AUTOSAVE_ICON,Wa as AUTOSAVE_KEY,tf as BACK_ICON,af as CSS_ADD_ICON,Ua as CSS_GRAYS,kf as CSS_LENGTHS,y as CSS_MENU_ID,uf as CSS_MODE_ICON,Xo as CSS_SIZE_KEY,rf as CSS_SPACING,Yo as CSS_STATES,fo as CSS_STATE_KEY,Ka as CSS_TOOLS,Gn as CSS_TOOL_ICONS,Ct as CSS_TOOL_INDEX,of as DATA_ICON,Ee as DATA_MENU_ID,Zu as DEFAULT_HEIGHT,u as DOCK_ID,J as Decoration,Je as EditorState,F as EditorView,se as HANDLES,Ha as HEIGHT_KEY,df as HISTORY_ICON,Va as HTML_HEADINGS,vo as HTML_TOOLS,ff as ID_MODE_ICON,Qu as LOCK_CLOSED_ICON,ef as LOCK_OPEN_ICON,Na as MIN_HEIGHT,oo as MIN_PANE,Se as PANES,ja as PANES_KEY,de as RangeSetBuilder,sf as SAVE_ICON,Ju as SAVE_MS,Xu as SCOPE_CLASS,qa as SCOPE_ICON,Ut as SCOPE_KEY,cf as STRIP_ICON,Yu as STYLE_ID,Ra as STYLE_MODE_KEY,He as StateEffect,ce as StateField,hf as TW_MODE_ICON,lf as TW_TOOL_ICONS,U as UNLOCK_ID,nn as VALUES_MODE_KEY,za as WIDTHS_KEY,rt as applyCssFolds,Oe as applyCssScope,Sc as applyDisplay,wc as applyFlexDirection,Ns as applyHtmlTag,K as applyRuleDecls,ia as applyStyleMode,Ta as autocompletion,Ho as autosaveEnabled,Cu as bindAntlersSnippets,wn as bindAutosave,Un as bindBack,gc as bindCssAddClass,Xd as bindCssTools,$u as bindDataVars,Rd as bindHistory,Sn as bindHtmlScope,Zd as bindHtmlTidy,Jd as bindHtmlTools,Wu as bindLayoutWatch,_n as bindLock,Uu as bindPaneToggles,qu as bindResize,Vu as bindSplitters,Wd as bindStrip,Gd as bindStyleMode,Au as bindVisualEditSnippets,Wf as clearCssFocus,nt as clearHtmlScopeRange,Aa as closeBrackets,Ma as closeBracketsKeymap,ca as closeCodeDock,Rf as closeCodeDockPopups,Ea as closeCompletion,$ as closeCssMenu,Ze as closeCssMenuPicked,R as closeDataMenu,C as cm,Nf as codeDockStyleMode,Pa as codeFolding,Vt as collectionViewType,La as completionKeymap,Ia as css,qs as cssEditorText,zt as cssRuleAtCursor,na as cssSizeRow,ve as cssSizeRows,Nt as cssStateSuffix,Y as currentFlexDecls,me as currentFullHtml,Fs as currentSectionValues,ge as currentTemplateType,wa as defaultKeymap,ke as dispatchHtmlChanges,Ve as editableOf,v as editors,Du as ensureStyle,Ms as ensureTwCss,ra as enterValuesRule,P as finishHtmlEdit,Jl as flushBracketSync,ee as flushCssScope,Ql as flushCssToHtml,W as flushSave,po as foldEffect,Da as foldedRanges,Is as goBackTemplate,xa as highlightActiveLine,_a as highlightActiveLineGutter,Ca as history,$a as historyKeymap,Fa as hoverTooltip,Ba as html,Ds as htmlEditorText,st as htmlElementAtCursor,Pt as htmlFocusOk,$t as htmlLanguage,et as htmlScopeEnabled,$e as htmlTargetFromCursor,yu as inAttributeValue,bu as inDynamicAttribute,Wt as indentFromPrevious,Sa as indentWithTab,tu as insertAiSnippet,Ws as insertHtmlElement,Xe as insertHtmlSnippet,Ts as isChromeTemplateType,mr as isCodeDockArmed,le as isCodeDockLocked,la as isCodeDockOpen,Fu as isPanelFrame,Oa as javascript,ho as keymap,Lu as languageOf,xe as leadingCssIndent,ie as lineIndentOf,ka as lineNumbers,Gu as loadCm,De as loadTemplate,Ld as mountEditor,sa as newSizeBlockSpot,uo as newSizeQuery,B as normalizeFlexValue,Qo as observeDockLayout,G as onEditorInput,Ac as openCssChoiceMenu,Tc as openCssColorMenu,Mc as openCssSpacingMenu,Ln as openCssValueMenu,da as openDataVarsMenu,mc as openHtmlComponentMenu,Tn as openHtmlTagMenu,Bs as openNestedTemplate,ua as openPickerMenu,tc as openRenameClassMenu,Rt as paintAlpine,Z as paintAutosave,Fe as paintBack,pe as paintCssHead,Ko as paintCssIdMark,L as paintCssToolState,Fd as paintHostWait,q as paintHtmlScope,jt as paintHtmlToolState,we as paintLock,ga as paintPaneButtons,Me as paintStrip,qt as paintStyleMode,Go as paintValuesMode,nc as pickHtmlTagAtCursor,D as placeCssMenu,Le as placeDock,en as previewBottomPad,Yl as primeTailwindCompile,qe as readOnlyOf,qo as readParts,nu as refreshCodeDockFromDisk,kt as refreshPreview,su as relayoutCodeDock,Dt as rememberBracketNames,Ie as rememberCssSelectors,As as resetTailwindCompile,Vo as sameParts,Gf as setCodeDockArmed,on as setPath,I as setStatus,qd as setValuesMode,Vn as shieldDock,Ro as showHtmlFull,Wo as showHtmlScope,zu as stopObservingDockLayout,ha as storedPanes,qf as syncCodeDock,ao as syncHtmlTree,tt as syncScopedHtml,it as syncTwTarget,Ku as tags,pr as templateDockAllowed,Rs as tidyHtmlPane,mo as unfoldEffect,ot as writeHandleEditor,Ht as writeHtmlEditor,Pe as writeParts};
