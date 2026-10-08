const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-AWaJHJyk.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{H as Jn,aa as Qn,X as lr}from"./ids-vn_yj3mf.js";import{v as cr,l as dr}from"./codemirror-_NeZ6S98.js";import{o as x,c as _,a as g,t as T,e as ur,F as z,i as at,w as F,l as ts,k as xo,u as w,Z as Ze,f as j,X as fr,x as p,r as cn,g as hr,W as pr,T as Je,j as mr,U as dn,V as vr,b as Y,d as q,z as es,_ as gr,p as U,q as mt,D as un,E as br,B as _o,a2 as wo,a0 as yr,s as Yt,ai as kr,m as xr}from"./addon-DUCFZFBM.js";import{a as rt,c as os,o as Be,d as fn,t as _r,f as ns,g as wr,h as Sr,e as So,i as $r,m as ne,T as Cr,j as Ar,k as Tr,l as $o,n as Co,q as ss,u as Mr,v as hn,w as Qe,x as Er,y as Fr,z as ao,A as Lr,B as Br,C as as,D as rs,E as A,F as Pr,G as pn,H as Ir}from"./lp-cluster-B8PWI08i.js";import{I as ph,J as mh}from"./lp-cluster-B8PWI08i.js";import{h as mn,c as is,r as ls,f as cs,a as Or,b as Dr,d as Hr,e as se,t as ds,g as jr,i as Ao,j as us,m as fs,k as hs,l as ps,n as zr,s as Lt,o as vn,p as Wr,q as ms,u as ae,v as re,w as To,x as Rr,y as Nr,z as qr,A as Vr,B as Ur,C as vs,D as Kr,E as Gr,F as gs,G as Xr,H as Yr,I as Mo,J as Zr,K as gn,L as Jr,M as Qr,N as ti,O as ei,P as oi,Q as ni,R as si,S as ai,T as ri,U as bs,V as ii,W as ro,X as li,Y as ys,Z as ci,_ as di,$ as ui,a0 as Eo,a1 as fi,a2 as hi,a3 as ks,a4 as bn,a5 as me}from"./antlers-edit-BMSqL4zG.js";import{_ as xs,o as pi,C as mi,m as H}from"./ChoiceDialog-BP05LgIr.js";import{M as _s,S as ws}from"./protocol-Brvy2KuB.js";import{t as vi}from"./tw-candidates-wYTeDvRv.js";import{h as gi,a as bi,e as yi,A as yn,b as ki,i as Fo,c as xi,d as we}from"./html-tag-sync-BpXNELva.js";import"./ai-text-icon-B7uCWIwa.js";import"./index-M2RCOyrL.js";import"./index-B5fiB6ig.js";import"./index-sh1K8s4m.js";import"./index-0IxPFT_m.js";import"./index-Ci-3qkVd.js";import"./index-DkhC0r6-.js";import"./index-B4S9JIPB.js";import"./index-BwRQ94Ql.js";import"./index-D9YSa79V.js";import"./index-DwJNgNWz.js";const ot="__sve-css-rename-chip",_i='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';function wi(t){const e=t.Decoration.mark({class:"sve-cm-css-token"}),o=t.StateEffect.define();return{extensions:[t.StateField.define({create(){return t.Decoration.none},update(s,r){let i;for(const c of r.effects)c.is(o)&&(i=c.value);if(i===void 0)return r.docChanged?t.Decoration.none:s;if(!i)return t.Decoration.none;const l=new t.RangeSetBuilder;return l.add(i.from,i.to,e),l.finish()},provide:s=>t.EditorView.decorations.from(s)})],setHover(s,r){s&&s.dispatch({effects:o.of(r)})}}}function nt(t){t?.getElementById(ot)?.remove()}function Si(t,e,o,n){e.style.left=`${Math.max(6,Math.min(o,t.innerWidth-28))}px`,e.style.top=`${Math.max(6,n)}px`}function $i(t,e,o,{onRename:n,title:s}){const r=t.document,i=e.coordsAtPos(o.to);if(!i)return;nt(r);const l=r.createElement("button");l.id=ot,l.type="button",l.innerHTML=_i,l.title=s,l.setAttribute("aria-label",s),l.addEventListener("mousedown",c=>{c.preventDefault(),c.stopPropagation(),nt(r),n?.(o)}),l.addEventListener("mouseleave",()=>{t.setTimeout(()=>{e.dom.matches(":hover")||l.matches(":hover")||nt(r)},120)}),r.body.appendChild(l),Si(t,l,i.right+2,i.top-1)}function Ci(t,e,{onRename:o,isLocked:n,setHover:s,title:r}){if(!e?.dom||e.dom._sveClassTokenBound)return;e.dom._sveClassTokenBound=!0;let i=null,l="";const c=()=>!!n?.(),d=()=>{t.clearTimeout(i),i=null,l="",s?.(e,null),nt(t.document)},f=h=>{if(c()){d();return}d(),o?.(h)};e.dom.addEventListener("mousemove",h=>{if(c()){d();return}if(h.target?.closest?.(`#${ot}`))return;const m=e.posAtCoords({x:h.clientX,y:h.clientY});if(m==null)return;const b=mn(e.state.doc.toString(),m);if(!b){t.clearTimeout(i),i=null,l="",s?.(e,null);return}const y=`${b.from}:${b.to}:${b.name}`;s?.(e,{from:b.from,to:b.to}),!(l===y&&(i||t.document.getElementById(ot)))&&(t.clearTimeout(i),l=y,i=t.setTimeout(()=>{i=null,$i(t,e,b,{onRename:f,title:r||"Rename class"})},160))}),e.dom.addEventListener("mouseleave",h=>{h.relatedTarget?.closest?.(`#${ot}`)||t.setTimeout(()=>{t.document.getElementById(ot)?.matches(":hover")||d()},160)}),e.dom.addEventListener("dblclick",h=>{if(c())return;const m=e.posAtCoords({x:h.clientX,y:h.clientY});if(m==null)return;const b=mn(e.state.doc.toString(),m);b&&(h.preventDefault(),h.stopPropagation(),f(b))},!0),e.scrollDOM?.addEventListener("scroll",d),t.document._sveClassTokenDismiss||(t.document._sveClassTokenDismiss=!0,t.document.addEventListener("mousedown",h=>{h.target.closest(`#${ot}`)||nt(t.document)}))}const a={cssColorsPromise:null,lastUid:null,lastType:null,typeStack:[],beforePart:null,lastParts:{html:"",css:"",js:""},lastProps:[],propsDirty:!1,lastLocked:!1,lockReady:!1,lastWin:null,loadGen:0,saveTimer:null,lastBracketNames:null,lastCssSelectorNames:null,saveInFlight:null,loadInFlight:null,dragging:!1,applying:!1,htmlScopePref:!0,htmlScopeActive:!1,styleMode:"css",cssToolRow:null,cssOpenTool:"",cssOpenMenu:"",cssValues:!1,cssAll:!1,htmlAll:!1,twCss:null,twKey:"",twBusy:!1,twDirty:!1,htmlFocus:null,cssFocus:null,htmlFull:"",cssFull:"",cssPane:"full",cssScopeSnapshot:"",layoutObserver:null,layoutWin:null,observedEditor:null,observedRight:null,layoutWatchBound:!1,cssSize:"",cssState:"",cssOwnFolds:new Set,cssFoldSig:"",htmlPartialUi:null,htmlAntlersUi:null,htmlClassTokenUi:null,htmlLintUi:null,cssGhostUi:null},Et=new Map,kn={scope:null,section:[],page:[],site:[]};function Ss(t){const e=t?.location?.pathname?.match(/\/collections\/([^/]+)\//);return e?e[1]:""}function $s(t){const e=String(t||"").trim();return!e||/^(header|footer)\//.test(e)?"":e}function Ai(t){return(Array.isArray(t)?t:[]).filter(e=>e?.handle).map(e=>`${e.kind==="collection"?"collection":"field"}:${e.handle}`).join("|")}function Lo({collection:t,set:e,view:o,scope:n}){return`${t}::${e}::${o||""}::${n||""}`}function Cs(t){return Et.get(t)||null}function As(t,{collection:e,set:o,view:n,scope:s}){const r=Lo({collection:e,set:o,view:n,scope:s}),i=Et.get(r);if(i)return Promise.resolve(i);const l=new URLSearchParams;return e&&l.set("collection",e),o&&l.set("set",o),n&&l.set("view",n),s&&l.set("scope",s),t.fetch(`/!/sve/data-vars?${l.toString()}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(c=>c.ok?c.json():null).then(c=>{const d=c&&typeof c=="object"?c:kn;return Et.set(r,d),d}).catch(()=>kn)}function Ti(t){if(!t){Et.clear();return}const e=`::${t}::`;for(const o of[...Et.keys()])o.includes(e)&&Et.delete(o)}function Mi(t){if(t==null||t==="")return"";if(typeof t=="boolean")return t?"true":"false";if(Array.isArray(t))return t.length?`${t.length} ×`:"";if(typeof t=="object"){const o=Object.keys(t).length;return o?`${o} ×`:""}const e=String(t).replace(/\s+/g," ").trim();return e.length>60?`${e.slice(0,60)}…`:e}function Ei(t,e){return e.split(".").reduce((o,n)=>o&&typeof o=="object"?o[n]:void 0,t)}function Ts(t,e){return!Array.isArray(t)||!e||typeof e!="object"?t||[]:t.map(o=>{if(o.parent||o.value!=null||o.var.includes(":"))return o;const n=Mi(Ei(e,o.var));return n?{...o,value:n}:o})}function Fi(t,e){return Array.isArray(t)?t.map(o=>({...o,items:Ts(o.items,e)})):[]}function Li(t,e,{inline:o=!1}={}){const n=String(t?.var||"").trim();if(!n)return null;if(o)return{text:`{{ ${n} }}`,cursor:`{{ ${n} }}`.length};if(t.loop)return{text:`{{ ${n} }}
  
{{ /${n} }}`,cursor:`{{ ${n} }}
  `.length};if(e?.loop&&!t.parent){const s=e.loop;return{text:`{{ ${s} }}
  {{ ${n} }}
{{ /${s} }}`,cursor:`{{ ${s} }}
  {{ ${n} }}`.length}}return{text:`{{ ${n} }}`,cursor:`{{ ${n} }}`.length}}const ve="visual_edit",xn=[{id:"base",lang:"code_dock_visual_edit_base"},{id:"field",lang:"code_dock_visual_edit_field"}],Ms=[{id:"tag",group:"base",label:"{{ visual_edit }}",standalone:"{{ visual_edit| }}"},{id:"ve_popup",group:"base",label:"popup",attr:'popup="true"'},{id:"ve_orderable",group:"base",label:"orderable",attr:'orderable="true"'},{id:"ve_section_orderable",group:"base",label:"section_orderable",attr:'section_orderable="true"'},{id:"ve_outline_inside",group:"base",label:"outline_inside",attr:'outline_inside="true"'},{id:"ve_field",group:"field",label:"field",attr:'field="|"'},{id:"ve_inline_edit",group:"field",label:"inline_edit",attr:'inline_edit="true"'},{id:"ve_insertable",group:"field",label:"insertable",attr:'insertable="true"'},{id:"ve_toolbar",group:"field",label:"toolbar",attr:'toolbar="true"'},{id:"ve_scope",group:"field",label:"scope",attr:'scope="|"'},{id:"ve_controls",group:"field",label:"controls",attr:'controls="|"'}];function Bi(t){return Ms.find(e=>e.id===t)||null}function Pi(t,e,o,n){let s=e;for(;s<o;){const r=t.indexOf("{{",s);if(r===-1||r>=o)return null;const i=t.indexOf("}}",r+2);if(i===-1||i+2>o)return null;const l=t.slice(r+2,i);if((l.trim().split(/\s+/)[0]||"")===n)return{openIdx:r,closeIdx:i,inner:l};s=i+2}return null}function Ii(t,e){const o=String(e).split("=")[0].trim();return new RegExp(`(^|\\s)${o}(=|\\s|$)`).test(t)}const Oi={class:"sve-code-dock"},Di={"data-sve-code-bar":""},Hi={type:"button","data-sve-code-pane-btn":"html"},ji={type:"button","data-sve-code-pane-btn":"css"},zi={type:"button","data-sve-code-pane-btn":"alpine"},Wi={type:"button","data-sve-code-pane-btn":"js"},Ri={type:"button","data-sve-html-scope":"","aria-pressed":"true"},Ni=["innerHTML"],qi={"data-sve-code-panes":""},Vi={"data-sve-code-pane":"html"},Ui={"data-sve-code-pane-label":""},Ki=["title","aria-label"],Gi=["innerHTML"],Xi={"data-sve-code-pane":"css"},Yi={"data-sve-css-chrome":"subrow-2"},Zi={"data-sve-code-pane-label":""},Ji={"data-sve-css-label":""},Qi={"data-sve-code-pane":"alpine"},tl={"data-sve-code-pane-label":""},el={"data-sve-code-pane":"js"},ol={"data-sve-code-pane-label":""},nl={__name:"CodeDockChrome",props:{htmlLabel:{type:String,required:!0},cssLabel:{type:String,required:!0},jsLabel:{type:String,required:!0},alpineLabel:{type:String,required:!0},treeIcon:{type:String,required:!0},dataIcon:{type:String,required:!0},dataLabel:{type:String,required:!0}},setup(t){return(e,o)=>(x(),_("div",Oi,[o[19]||(o[19]=g("div",{"data-sve-code-grip":"","aria-hidden":"true"},null,-1)),g("div",Di,[g("button",Hi,T(t.htmlLabel),1),g("button",ji,T(t.cssLabel),1),g("button",zi,T(t.alpineLabel),1),g("button",Wi,T(t.jsLabel),1),o[0]||(o[0]=ur('<button type="button" data-sve-code-back hidden></button><span data-sve-code-path></span><span data-sve-code-status></span><button type="button" data-sve-code-strip></button><button type="button" data-sve-code-history></button><button type="button" data-sve-style-mode></button><button type="button" data-sve-values-mode></button><button type="button" data-sve-css-all></button><button type="button" data-sve-code-autosave aria-pressed="true"></button><button type="button" data-sve-code-save hidden></button>',10)),g("button",Ri,[g("span",{innerHTML:t.treeIcon},null,8,Ni)]),o[1]||(o[1]=g("button",{type:"button","data-sve-code-lock":"",hidden:""},null,-1))]),o[20]||(o[20]=g("div",{"data-sve-code-lock-banner":""},null,-1)),g("div",qi,[g("div",Vi,[g("div",Ui,[g("span",null,T(t.htmlLabel),1),o[2]||(o[2]=g("div",{"data-sve-html-tools":""},null,-1)),o[3]||(o[3]=g("button",{type:"button","data-sve-html-tidy":""},null,-1)),g("button",{type:"button","data-sve-data-vars":"",title:t.dataLabel,"aria-label":t.dataLabel},[g("span",{innerHTML:t.dataIcon},null,8,Gi)],8,Ki),o[4]||(o[4]=g("div",{"data-sve-visual-edit-tools":""},null,-1)),o[5]||(o[5]=g("div",{"data-sve-antlers-tools":""},null,-1))]),o[6]||(o[6]=g("div",{"data-sve-html-problems":"",hidden:""},null,-1)),o[7]||(o[7]=g("div",{"data-sve-html-all-slot":""},[g("button",{type:"button","data-sve-html-all":"",hidden:""})],-1)),o[8]||(o[8]=g("div",{"data-sve-code-host":""},null,-1))]),o[16]||(o[16]=g("div",{"data-sve-code-split":"","data-sve-code-split-after":"html"},null,-1)),g("div",Xi,[g("div",Yi,[g("div",Zi,[g("span",Ji,T(t.cssLabel),1),o[9]||(o[9]=g("button",{type:"button","data-sve-css-add-class":""},null,-1)),o[10]||(o[10]=g("div",{"data-sve-css-tools":""},null,-1))])]),o[11]||(o[11]=g("div",{"data-sve-css-head":""},null,-1)),o[12]||(o[12]=g("div",{"data-sve-code-host":""},null,-1)),o[13]||(o[13]=g("div",{"data-sve-tw-host":""},null,-1))]),o[17]||(o[17]=g("div",{"data-sve-code-split":"","data-sve-code-split-after":"css"},null,-1)),g("div",Qi,[g("div",tl,[g("span",null,T(t.alpineLabel),1)]),o[14]||(o[14]=g("div",{"data-sve-alpine-host":""},null,-1))]),o[18]||(o[18]=g("div",{"data-sve-code-split":"","data-sve-code-split-after":"alpine"},null,-1)),g("div",el,[g("div",ol,[g("span",null,T(t.jsLabel),1)]),o[15]||(o[15]=g("div",{"data-sve-code-host":""},null,-1))])])]))}},Ut=new Map;let Nt=null,_n=0,wn=0,Sn=!1;async function sl(t,e){if(Ut.has(e))return Ut.get(e);const o=`view:partials/${e}`;let n=null;try{const s=await t.fetch(`/!/sve/section-template?type=${encodeURIComponent(o)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}});if(s.ok){const r=await s.json();n=typeof r.html=="string"?ls(r.html):null}}catch{}return Ut.set(e,n),n}function al(t){t?Ut.delete(t):Ut.clear()}function Bo(t){const e=is(rt("dock:current-type")),o=e?rt("dock:html"):"",n=e&&typeof o=="string"?ls(o):null;os({source:ws,type:_s.SVE_COMPONENT_FOCUS,on:!!n,name:e?String(e).split("/").pop():"",selector:n||""},t)}async function Pe(t){const e=++wn,o=rt("dock:html"),n=[...new Set((typeof o=="string"?cs(o):[]).map(r=>r.src).filter(r=>r&&!Or(r)))],s=await Promise.all(n.map(r=>sl(t,r)));e===wn&&os({source:ws,type:_s.SVE_COMPONENT_MAP,items:n.map((r,i)=>({src:r,name:r.split("/").pop(),selector:s[i]})).filter(r=>r.selector)},t)}function rl(t){Nt=t,!Sn&&(Sn=!0,Be("dock:html-changed",()=>{Nt&&(al(is(rt("dock:current-type"))),Nt.clearTimeout(_n),_n=Nt.setTimeout(()=>{Pe(Nt)},400))}))}const il=["data-sve-html-tool","data-tip","aria-label","data-letter","onClick","onContextmenu"],ll=["innerHTML"],cl={__name:"CodeDockHtmlTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(t){return(e,o)=>(x(!0),_(z,null,at(t.tools,n=>(x(),_("button",{key:n.id,type:"button","data-sve-html-tool":n.id,"data-tip":n.title,"aria-label":n.title,"data-letter":n.letter?"":void 0,onClick:F(s=>t.onTool(n.id),["prevent","stop"]),onContextmenu:F(s=>t.onTool(n.id),["prevent"])},[n.letter?(x(),_(z,{key:0},[ts(T(n.letter),1)],64)):(x(),_("span",{key:1,innerHTML:n.icon},null,8,ll))],40,il))),128))}},ft=xo({tools:[],onTool:null,onKid:null}),dl=["data-sve-css-item"],ul=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],fl={key:0,"data-sve-css-kids":""},hl={key:0,"data-sve-css-sep":"","aria-hidden":"true"},pl=["data-sve-css-kid","data-sve-css-box-side","data-tip","aria-label","innerHTML","onClick","onContextmenu"],ml={__name:"CodeDockCssTools",setup(t){return(e,o)=>(x(!0),_(z,null,at(w(ft).tools,n=>(x(),_("li",Ze({key:n.id,"data-sve-css-item":n.id},{ref_for:!0},n.open?{"data-sve-css-open":""}:{}),[g("button",Ze({type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title},{ref_for:!0},{...n.active?{"data-active":""}:{},...n.open?{"data-open":""}:{}},{innerHTML:n.icon,onClick:F(s=>w(ft).onTool?.(n.id),["prevent","stop"]),onContextmenu:F(s=>w(ft).onTool?.(n.id),["prevent"])}),null,16,ul),n.open&&n.kids.length?(x(),_("div",fl,[(x(!0),_(z,null,at(n.kids,s=>(x(),_(z,{key:s.id},[s.sep?(x(),_("span",hl)):j("",!0),g("button",Ze({type:"button","data-sve-css-kid":s.id,"data-sve-css-box-side":s.id,"data-tip":s.title,"aria-label":s.title},{ref_for:!0},s.active?{"data-active":""}:{},{innerHTML:s.icon,onClick:F(r=>w(ft).onKid?.(n.id,s.id),["prevent","stop"]),onContextmenu:F(r=>w(ft).onKid?.(n.id,s.id),["prevent"])}),null,16,pl)],64))),128))])):j("",!0)],16,dl))),128))}},vl=1.5,gl=16;function xe(t,e){const o=parseFloat(t);return Number.isFinite(o)?e==="em"||e==="rem"?o*gl:o:null}function bl(t){const e=String(t||"").toLowerCase();if(/\bmin-width\b|\bwidth\s*>=?/.test(e))return null;let o=e.match(/\bmax-width\s*:\s*([\d.]+)(px|em|rem)/);return o||(o=e.match(/\bwidth\s*<=?\s*([\d.]+)(px|em|rem)/),o)?xe(o[1],o[2]):(o=e.match(/([\d.]+)(px|em|rem)\s*>=?\s*width\b/),o?xe(o[1],o[2]):null)}function pt(t,e){const o=bl(t);if(o===null)return"";for(const n of e||[]){if(n.base)continue;const s=xe(String(n.max||"").replace(/[a-z]+$/i,""),(String(n.max||"").match(/[a-z]+$/i)||[""])[0]);if(s!==null&&Math.abs(s-o)<=vl)return n.handle}return""}function Ie(t){let e="",o=0;for(;o<t.length;){const n=Oe(t,o);if(n!==o){e+=" ".repeat(n-o),o=n;continue}e+=t[o],o+=1}return e}function Oe(t,e){if(t.startsWith("/*",e)){const o=t.indexOf("*/",e+2);return o===-1?t.length:o+2}if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?t.length:o+2}if(t[e]==='"'||t[e]==="'"){const o=t[e];for(let n=e+1;n<t.length;n+=1)if(t[n]==="\\")n+=1;else if(t[n]===o)return n+1;return t.length}return e}function De(t){const e=String(t||""),o=[],n=(s,r,i=0)=>{let l=s,c=l;for(;l<r;){const d=Oe(e,l);if(d!==l){l=d;continue}if(e[l]===";"){l+=1,c=l;continue}if(e[l]==="}")return;if(e[l]!=="{"){l+=1;continue}const f=Ie(e.slice(c,l)),h=f.trim(),m=Es(e,l,r);if(m===-1)return;/^@media\b/i.test(h)?o.push({query:h.replace(/^@media\s*/i,"").trim(),from:c+f.search(/\S/),to:m+1,bodyFrom:l+1,bodyTo:m,depth:i}):/^@(?:import|charset|use)\b/i.test(h)||n(l+1,m,i+1),l=m+1,c=l}};return n(0,e.length,0),o}function Es(t,e,o){let n=0;for(let s=e;s<o;s+=1){const r=Oe(t,s);if(r!==s){s=r-1;continue}if(t[s]==="{")n+=1;else if(t[s]==="}"&&(n-=1,n===0))return s}return-1}function Dt(t){const e=String(t||""),o=(n,s)=>{const r=[];let i=n,l=i;for(;i<s;){const c=Oe(e,i);if(c!==i){i=c;continue}if(e[i]===";"){i+=1,l=i;continue}if(e[i]==="}")return r;if(e[i]!=="{"){i+=1;continue}const d=Ie(e.slice(l,i)),f=d.trim(),h=Es(e,i,s);if(h===-1)return r;r.push({prelude:f,media:/^@media\b/i.test(f),query:f.replace(/^@media\s*/i,"").trim(),from:l+d.search(/\S/),to:h+1,bodyFrom:i+1,bodyTo:h,children:/^@(?:import|charset|use)\b/i.test(f)?[]:o(i+1,h)}),i=h+1,l=i}return r};return o(0,e.length)}function yl(t,e,o){const n=String(t||"");if(!o)return[];const s=(e||[]).find(d=>d.base),r=Dt(n),i=[],l=d=>d.media?pt(d.query,e)===o:d.children.some(l);if(s&&o===s.handle){const d=f=>{for(const h of f){if(h.media&&pt(h.query,e)){i.push({from:h.from,to:h.to});continue}d(h.children)}};return d(r),i}const c=(d,f,h)=>{const m=[];for(const y of d){if(y.media&&pt(y.query,e)===o){m.push({from:y.from,to:y.to,into:null});continue}l(y)&&m.push({from:y.from,to:y.to,into:y})}if(!m.length){h>f&&i.push({from:f,to:h});return}let b=f;for(const y of m)y.from>b&&i.push({from:b,to:y.from}),y.into&&c(y.into.children,y.into.bodyFrom,y.into.bodyTo),b=y.to;h>b&&i.push({from:b,to:h})};return c(r,0,n.length),i.filter(d=>n.slice(d.from,d.to).trim()!=="")}function kl(t,e){const o=String(t||""),n=[],s=i=>{for(const l of i){if((l.media&&pt(l.query,e)||/^#id-/.test(l.prelude))&&Ie(o.slice(l.bodyFrom,l.bodyTo)).trim()===""){n.push(l);continue}s(l.children)}};if(s(Dt(o)),!n.length)return o;let r=o;for(const i of n.sort((l,c)=>c.from-l.from)){let l=i.from,c=i.to;const d=r.lastIndexOf(`
`,l-1)+1;for(r.slice(d,l).trim()===""&&(l=d);r[c]===" "||r[c]==="	";)c+=1;r[c]===`
`&&(c+=1),r=r.slice(0,l)+r.slice(c)}return r}function xl(t,e){const o=String(t||""),n=[],s=i=>Ie(o.slice(i.bodyFrom,i.bodyTo)).trim()==="",r=i=>{for(const l of i){if((l.media&&pt(l.query,e)||/^#id-/.test(l.prelude))&&s(l)){n.push({from:l.from,to:l.to});continue}r(l.children)}};return r(Dt(o)),n}function Se(t,e,o){const n=e||[],s=n.find(d=>d.base),r=[],i=d=>/^#id-/.test(d.prelude)||/^#\s*$/.test(d.prelude),l=(d,f)=>{for(const h of d){if(!h.media){l(h.children,f);continue}const m=pt(h.query,n)||f;if(o===m){r.push(h);continue}l(h.children,m)}},c=(d,f)=>{for(const h of d){if(h.media){c(h.children,pt(h.query,n)||f);continue}if(i(h)){const m=f||(s?s.handle:"");!o||o===m?r.push(h):l(h.children,m);continue}c(h.children,f)}};return c(Dt(String(t||"")),""),r.sort((d,f)=>d.from-f.from)}function Po(t,e,o){return De(t).filter(n=>pt(n.query,e)===o)}const S=xo({tag:"",scope:"",scopeElsewhere:[],scopeElsewhereTitle:"",onScopeImport:null,onTag:null,sizes:[],onSize:null,state:"",stateLabel:"",onState:null,canEdit:!1,note:""}),_l={class:"sve-css-head"},wl=["disabled"],Sl={key:1,class:"sve-css-scope"},$l=["title","disabled"],Cl=["title","data-active","disabled","onClick"],Al=["data-active","disabled"],Tl={key:3,class:"sve-css-note"},Ml={__name:"CodeDockCssHead",setup(t){return(e,o)=>(x(),_("div",_l,[w(S).tag?(x(),_("button",{key:0,type:"button",class:"sve-css-tag",disabled:!w(S).canEdit,onClick:o[0]||(o[0]=F(()=>{},["prevent","stop"])),onDblclick:o[1]||(o[1]=F(n=>w(S).onTag?.(n),["prevent","stop"]))},"<"+T(w(S).tag)+">",41,wl)):j("",!0),w(S).scope?(x(),_("span",Sl,T(w(S).scope),1)):j("",!0),w(S).scope&&w(S).scopeElsewhere.length?(x(),_("button",{key:2,type:"button",class:"sve-css-scope-taken",title:w(S).scopeElsewhereTitle,disabled:!w(S).canEdit,onClick:o[2]||(o[2]=F(n=>w(S).onScopeImport?.(),["prevent","stop"]))},T(w(S).scopeElsewhere.join(", ")),9,$l)):j("",!0),(x(!0),_(z,null,at(w(S).sizes,n=>(x(),_("button",{key:n.key,type:"button","data-sve-css-size":"",title:n.title,"data-active":n.active?"":void 0,disabled:!w(S).canEdit,onClick:F(s=>w(S).onSize?.(n.key),["prevent","stop"])},T(n.label),9,Cl))),128)),g("button",{type:"button","data-sve-css-state":"","data-active":w(S).state?"":void 0,disabled:!w(S).canEdit,onClick:o[3]||(o[3]=F(n=>w(S).onState?.(n),["prevent","stop"]))},[ts(T(w(S).stateLabel)+" ",1),o[4]||(o[4]=g("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[g("path",{d:"m6 9 6 6 6-6"})],-1))],8,Al),o[5]||(o[5]=g("span",{class:"sve-css-gap"},null,-1)),w(S).note?(x(),_("span",Tl,T(w(S).note),1)):j("",!0)]))}},El=xs(Ml,[["__scopeId","data-v-22565303"]]),Fl={key:0,"data-sve-css-swatches":""},Ll=["data-sve-css-token","title","data-active","onClick"],Bl={key:0,"data-sve-css-head-row":""},Pl={key:1,"data-sve-css-note-row":""},Il=["data-sve-css-token","data-active","onClick"],Ol={"data-sve-css-choice-label":""},Dl={key:0,"data-sve-css-choice-hint":""},et={__name:"CodeDockMenu",props:{kind:{type:String,required:!0},swatches:{type:Array,default:()=>[]},choices:{type:Array,default:()=>[]},onClear:{type:Function,default:null},onPick:{type:Function,required:!0}},setup(t){return(e,o)=>t.kind==="colors"?(x(),_("div",Fl,[g("button",{type:"button","data-sve-css-clear":"",title:"Clear",onClick:o[0]||(o[0]=F((...n)=>t.onClear&&t.onClear(...n),["prevent","stop"]))},[...o[1]||(o[1]=[g("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none",stroke:"currentColor","stroke-width":"1.5"},[g("path",{d:"M2 2l6 6M8 2L2 8"})],-1)])]),(x(!0),_(z,null,at(t.swatches,n=>(x(),_("button",{key:n.name,type:"button","data-sve-css-swatch":"","data-sve-css-token":n.name,title:n.name,"data-active":n.active?"":void 0,style:fr({background:n.hex||"transparent"}),onClick:F(s=>t.onPick(n.name),["prevent","stop"])},null,12,Ll))),128))])):(x(!0),_(z,{key:1},at(t.choices,n=>(x(),_(z,{key:n.value},[n.heading?(x(),_("span",Bl,T(n.label),1)):n.note?(x(),_("span",Pl,T(n.label),1)):(x(),_("button",{key:2,type:"button","data-sve-css-choice":"","data-sve-css-token":n.token||void 0,"data-active":n.active?"":void 0,onClick:F(s=>t.onPick(n.value),["prevent","stop"])},[g("span",Ol,T(n.label),1),n.hint?(x(),_("span",Dl,T(n.hint),1)):j("",!0)],8,Il))],64))),128))}},Hl=2e4;let wt=[],Fs=0,Vt=null,to=null;function Ls(){return to||(to=Rt.define()),to}function Bs(){return!!Vt&&Date.now()-Fs<Hl}function Io(t){return Bs()||(Fs=Date.now(),Vt=t.fetch("/!/sve/site-css/defined",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{defined:[]}).then(e=>(wt=Array.isArray(e?.defined)?e.defined:[],v.html?.dispatch({effects:Ls().of(null)}),wt)).catch(()=>(Vt=null,wt))),Vt}function He(t){return t.document.getElementById(u)?.querySelector("[data-sve-code-path]")?.textContent.trim()||""}function jl(t,e){const o=He(t),n=new Map;for(const s of wt){const r=n.get(s.name)||new Set;r.add(s.file===o?e:String(s.file).replace(/^.*\//,"")),n.set(s.name,r)}return[...n].map(([s,r])=>({name:s,detail:[...r].join(", ")})).sort((s,r)=>s.name.localeCompare(r.name))}function Oo(t,e){const o=He(t);return e?wt.filter(n=>n.name===e&&n.file!==o):[]}const Ps=t=>[...new Set(t.map(e=>String(e.file).replace(/^.*\//,"")))];function Do(t,e){const o=Oo(t,e).map(r=>r.css).filter(Boolean).join(`
`);if(!o)return!1;const n=rt("dock:css");if(typeof n!="string")return!1;const s=Dr(n,e,o);return s!==n&&rt("dock:set-css",s)!==!1}function zl(t,e){const o=t.doc.lineAt(e),n=e-o.from,s=/\bclass\s*=\s*(["'])/gi;let r;for(;r=s.exec(o.text);){const i=r[1],l=r.index+r[0].length,c=o.text.indexOf(i,l),d=c===-1?o.text.length:c;if(n<l||n>d)continue;const f=o.text.slice(l,d),h=Hr(f),m=n-l;if(!h||m<h.innerFrom||m>h.innerTo)return null;const b=(f.slice(h.innerFrom,m).match(/[\w-]*$/)||[""])[0];return{from:e-b.length,typed:b}}return null}function Wl(t){return e=>{const o=zl(e.state,e.pos);return!o||!o.typed&&!e.explicit?null:Io(t).then(n=>{const s=He(t),r=o.typed.toLowerCase(),i=new Map;for(const c of n){if(c.file===s||!String(c.name).toLowerCase().startsWith(r))continue;const d=i.get(c.name)||{files:[],css:[]};d.files.push(c),c.css&&d.css.push(c.css),i.set(c.name,d)}if(!i.size)return null;const l=[...i].slice(0,40).map(([c,d])=>({label:c,type:"class",detail:Ps(d.files).join(", "),info:d.css.length?()=>{const f=t.document.createElement("pre");return f.textContent=d.css.join(`
`),f.style.cssText="margin:0;padding:.3em .5em;font:11px ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap",f}:void 0,apply:(f,h,m,b)=>{f.dispatch({changes:{from:m,to:b,insert:c},selection:{anchor:m+c.length}}),t.setTimeout(()=>Do(t,c),0)}}));return{from:o.from,options:l,validFor:/^[\w-]*$/}})}}function Rl(t){const e=o=>{if(!wt.length)return tt.none;const n=He(t),s=new ut;for(const r of se(o)){const i=wt.filter(l=>l.name===r.name&&l.file!==n);i.length&&s.add(r.from,r.to,tt.mark({class:"sve-cm-class-taken",attributes:{title:p(t,"class_defined_in",{file:Ps(i).join(", ")})}}))}return s.finish()};return dt.define({create:o=>e(o.doc.toString()),update:(o,n)=>n.docChanged||n.effects.some(s=>s.is(Ls()))?e(n.state.doc.toString()):o,provide:o=>B.decorations.from(o)})}const Nl=/^\.[a-zA-Z_][\w-]*$/;function ql(t,e,o){return String(e||"").includes(o)?$e(t).length===1:!1}function $e(t){return Dt(t).filter(e=>/^@scope\b/i.test(e.prelude))}function Vl(t){const e=String(t||"");return Dt(e).filter(o=>Nl.test(o.prelude)?!e.slice(o.from,o.bodyFrom-1).includes("{{"):!1).map(o=>({from:o.from,to:o.to,name:o.prelude.slice(1)}))}function Ul(t,e,o){const n=String(t||"");if(!ql(n,e,o))return n;const s=Vl(n);if(!s.length)return n;const r=$e(n)[0],i=Xl(n,r),l=s.map(m=>Yl(n.slice(m.from,m.to),n,m.from,i)).join(`

`);let c=n;for(const m of[...s].sort((b,y)=>y.from-b.from))c=Gl(c,m.from,m.to);const d=Kl(c,o);if(d===-1)return n;const f=(c.slice(0,d).match(/\n([^\S\n]*)$/)||[null,null])[1],h=f===null?d:d-f.length;return`${c.slice(0,h)}
${l}
${f??""}${c.slice(d)}`}function Kl(t,e){const o=$e(t).find(n=>n.prelude.includes(e));return o?o.bodyTo:$e(t)[0]?.bodyTo??-1}function Gl(t,e,o){let n=e,s=o;const r=t.lastIndexOf(`
`,n-1)+1;for(t.slice(r,n).trim()===""&&(n=r);t[s]===" "||t[s]==="	";)s+=1;return t[s]===`
`&&(s+=1),t.slice(0,n)+t.slice(s)}function Xl(t,e){const o=t.slice(e.bodyFrom,e.bodyTo).match(/\n([^\S\n]+)\S/);return o?o[1]:`${(t.slice(0,e.from).match(/\n([^\S\n]*)$/)||[null,""])[1]}    `}function Yl(t,e,o,n){const s=(e.slice(0,o).match(/\n([^\S\n]*)$/)||[null,""])[1];return t.split(`
`).map((r,i)=>i===0?n+r.trim():r.startsWith(s)?n+r.slice(s.length):n+r.trimStart()).join(`
`)}const Zl={"data-sve-css-add-label":""},Jl=["placeholder","onKeydown"],Ql={key:0,"data-sve-css-add-hint":""},tc={"data-sve-css-add-existing":""},ec={"data-sve-css-add-list":""},oc=["onClick"],nc={"data-sve-css-add-name":""},sc={"data-sve-css-add-detail":""},ac={key:0,"data-sve-css-add-none":""},rc=["disabled"],Ho={__name:"CodeDockAddClass",props:{label:{type:String,required:!0},placeholder:{type:String,default:""},initial:{type:String,default:""},onAdd:{type:Function,required:!0},options:{type:Array,default:()=>[]},onPick:{type:Function,default:null},takenText:{type:Function,default:null},existingLabel:{type:String,default:""},createLabel:{type:String,default:""},onClose:{type:Function,default:null}},setup(t){const e=t,o=cn(e.initial||""),n=cn(null);hr(()=>pr(()=>{n.value?.focus(),n.value?.select()}));const s=Je(()=>o.value.trim().toLowerCase()),r=Je(()=>{if(!e.options.length)return[];const c=s.value,d=[],f=[];for(const h of e.options){const m=h.name.toLowerCase();!c||m.startsWith(c)?d.push(h):m.includes(c)&&f.push(h)}return[...d,...f].slice(0,8)}),i=Je(()=>e.takenText&&s.value?e.takenText(o.value.trim()):"");function l(){const c=o.value.trim();if(!c){n.value?.focus();return}if(i.value&&e.onPick){e.onPick(c);return}e.onAdd(c)}return(c,d)=>(x(),_(z,null,[g("label",Zl,T(t.label),1),mr(g("input",{ref_key:"input",ref:n,"data-sve-css-add-input":"","onUpdate:modelValue":d[0]||(d[0]=f=>o.value=f),type:"text",placeholder:t.placeholder,onKeydown:[dn(F(l,["prevent"]),["enter"]),d[1]||(d[1]=dn(F(f=>t.onClose?.(),["stop","prevent"]),["escape"]))]},null,40,Jl),[[vr,o.value]]),i.value?(x(),_("div",Ql,T(i.value),1)):j("",!0),t.options.length?(x(),_(z,{key:1},[g("div",tc,T(t.existingLabel),1),g("div",ec,[(x(!0),_(z,null,at(r.value,f=>(x(),_("button",{key:f.name,type:"button","data-sve-css-add-option":"",onMousedown:d[2]||(d[2]=F(()=>{},["prevent"])),onClick:F(h=>t.onPick?.(f.name),["prevent","stop"])},[g("span",nc,T(f.name),1),g("span",sc,T(f.detail),1)],40,oc))),128)),r.value.length?j("",!0):(x(),_("div",ac,"—"))]),g("button",{type:"button","data-sve-css-add-create":"",disabled:!!i.value||!s.value,onMousedown:d[3]||(d[3]=F(()=>{},["prevent"])),onClick:F(l,["prevent","stop"])},T(t.createLabel),41,rc)],64)):j("",!0)],64))}};function $n(t,e){e._sveLockBound||(e._sveLockBound=!0,e.querySelector("[data-sve-code-lock]")?.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),!(!a.lockReady||!a.lastType)){if(a.lastLocked){lc(t);return}Is(t,!0)}}))}function jo(t){return t?Y(t,tr)!=="0":!0}function ic(){const t=v.html;return!t||t.state.readOnly||!a.lastType?!1:!Uo(Vo(),a.lastParts)}function Q(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-code-autosave]"),n=e?.querySelector("[data-sve-code-save]");if(!o||!n)return;const s=jo(t),r=ic();o.setAttribute("aria-pressed",s?"true":"false"),o.title=p(t,s?"code_dock_autosave_on":"code_dock_autosave_off"),o.setAttribute("aria-label",o.title),o.innerHTML=$f,n.hidden=s,n.title=p(t,"code_dock_save"),n.setAttribute("aria-label",n.title),n.innerHTML=Cf,r?n.setAttribute("data-dirty",""):n.removeAttribute("data-dirty")}function Cn(t,e){e._sveAutosaveBound||(e._sveAutosaveBound=!0,e.querySelector("[data-sve-code-autosave]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=!jo(t);q(t,tr,n?"1":"0"),n?W(t.document):a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null),Q(t)}),e.querySelector("[data-sve-code-save]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),W(t.document)}))}function lc(t){t.document.getElementById(K)?.remove();const e=pi(t.document,mi,{title:p(t,"code_dock_unlock_title"),body:p(t,"code_dock_unlock_body"),buttons:[{value:"cancel",label:p(t,"cancel"),variant:"ghost"},{value:"ok",label:p(t,"code_dock_unlock_confirm"),variant:"primary"}],onPick:o=>{e.dismiss(),o==="ok"&&Is(t,!1)}});e.host.id=K}function Is(t,e){const o=a.lastType;if(!o)return;const n=()=>{a.lastType===o&&t.fetch("/!/sve/section-template/lock",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":es(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:o,locked:e})}).then(async s=>{if(!s.ok)throw new Error(String(s.status));a.lastType===o&&(a.lastLocked=e,St(t),jt(a.lastParts,e),R(t),O(t.document,e?p(t,"code_dock_locked"):""))}).catch(()=>{O(t.document,p(t,"code_dock_error"))})};if(e&&(W(t.document),a.saveInFlight)){a.saveInFlight.finally(n);return}n()}function Zt(t,e){const o=String(e||"");if(/^(header|footer)\//.test(o))return!0;const n=t?.Statamic?.$config?.get?.("sveChromeTemplates")||{};return Object.values(n).some(s=>s&&s.type===o)}function Ce(t){const e=a.lastType;if(!a.lastUid||!e||String(e).startsWith("view:")||Zt(t,e)){fn(t);return}const o=_r(a.lastUid,t.document);fn(t,o.length?{sectionUids:o}:void 0)}function cc(t,e,o){return a.saveInFlight=t.fetch("/!/sve/section-template",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":es(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:e,html:o.html,css:o.css,js:o.js,...typeof o.tw=="string"?{tw:o.tw}:{},...jr(t)?{props:a.lastProps}:{}})}).then(async n=>{if(n.status===423){a.lastLocked=!0,a.lockReady=!0,St(t),jt(a.lastParts,!0),R(t),O(t.document,p(t,"code_dock_locked"));return}const s=await n.json().catch(()=>({}));if(!n.ok)throw new Error(s?.error==="not_writable"?"not_writable":String(n.status));if(a.lastType===e){if(a.lastParts=o,s?.tw_written===!1){a.twDirty=!0,O(t.document,p(t,"code_dock_tw_not_writable")),Q(t),Ce(t);return}O(t.document,p(t,"code_dock_saved")),Q(t),t.setTimeout(()=>{const r=t.document.getElementById(u)?.querySelector("[data-sve-code-status]");r&&r.textContent===p(t,"code_dock_saved")&&(r.textContent="")},1800)}Ce(t),t.document.getElementById("__sve-section-picker")?.dispatchEvent(new t.CustomEvent("sve-library-stale"))}).catch(n=>{O(t.document,p(t,n?.message==="not_writable"?"code_dock_not_writable":"code_dock_error"))}).finally(()=>{a.saveInFlight=null}),a.saveInFlight}function W(t){a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null);const e=a.lastType,o=a.lastWin,n=v.html;if(!n||n.state.readOnly||!e||!o||!a.lockReady)return;const s=Vo(),r=a.twCss!==null&&ds(o)&&zo(s.html)===a.twKey;Uo(s,a.lastParts)&&!(r&&a.twDirty)&&!a.propsDirty||(a.propsDirty=!1,r&&(s.tw=a.twCss,a.twDirty=!1),O(t,p(o,"code_dock_saving")),cc(o,e,s))}function zo(t){return vi(t).sort().join(" ")}function Os(){a.twCss=null,a.twKey="",a.twDirty=!1}function dc(t,e){a.twCss=e,a.twKey=zo(t),a.twDirty=!1}function Ds(t,e){if(!t||!ds(t))return;const o=zo(e);o===a.twKey||a.twBusy||(a.twBusy=!0,gr(()=>import("./tw-compile-AWaJHJyk.js"),__vite__mapDeps([0,1]),import.meta.url).then(n=>n.compileTailwind(t,e)).then(n=>{a.twBusy=!1,a.twCss=n,a.twKey=o,a.twDirty=!0,Hs(t,t.document)}).catch(n=>{a.twBusy=!1,console.error("[sve] tailwind compile",n)}))}function Hs(t,e){a.saveTimer&&clearTimeout(a.saveTimer),a.saveTimer=t.setTimeout(()=>{a.saveTimer=null,W(e)},kf)}function X(t){if(a.applying)return;const e=Vo();if(Uo(e,a.lastParts)){Q(t);return}if(Q(t),Ds(t,e.html),!jo(t)){O(t.document,p(t,"code_dock_unsaved"));return}O(t.document,p(t,"code_dock_saving")),Hs(t,t.document)}function Wo(t,e){let o=0;const n=Math.min(t.length,e.length);for(;o<n&&t[o]===e[o];)o+=1;let s=t.length,r=e.length;for(;s>o&&r>o&&t[s-1]===e[r-1];)s-=1,r-=1;return[o,s,e.slice(o,r)]}const js='<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M2.5 3.5h11M2.5 8h11M2.5 12.5h7"/></svg>',io={};function uc(t){return io[t]=new C.state.Compartment,io[t].of(an())}function Ro(t){const e=v[t],o=io[t];!e||!o||(e.dispatch({effects:o.reconfigure([])}),e.dispatch({effects:o.reconfigure(an())}))}function zs(t){const e=a.lastUid,o=typeof U=="function"?U(t.document):[];for(const n of o){const s=mt(n.values)||n.values;if(!(!s||typeof s!="object")&&e&&typeof un=="function"){const r=un(s,e);if(r){const i=r.split("."),l=br(s,i.slice(0,2).join("."));if(l&&typeof l=="object")return l}}}for(const n of o){const s=mt(n.values)||n.values;if(s&&typeof s=="object")return s}return null}function Ws(t,e){!e||e===a.lastType||(W(t.document),Wt(t,e,"push"))}function Rs(t){const e=a.typeStack.pop();if(!e){Ot(t);return}W(t.document),Wt(t,e,"keep")}function St(t){const e=t.document.getElementById(u),o=e?.querySelector("[data-sve-code-lock]"),n=e?.querySelector("[data-sve-code-lock-banner]");if(!e||!o)return;const s=a.lastLocked;e.toggleAttribute("data-sve-code-locked",s),s&&(ms(t.document),nt(t.document),a.htmlPartialUi&&(a.htmlPartialUi.setHover(v.html,null),a.htmlPartialUi.setHover(v.css,null)),a.htmlClassTokenUi?.setHover(v.html,null)),o.hidden=!a.lockReady,o.setAttribute("aria-pressed",a.lastLocked?"true":"false"),o.title=p(t,a.lastLocked?"code_dock_unlock":"code_dock_lock"),o.setAttribute("aria-label",o.title),o.innerHTML=a.lastLocked?xf:_f,n&&(n.textContent=p(t,"code_dock_locked_banner"))}function ie(t){return t?Y(t,Ge)!=="0":a.htmlScopePref}function $t(t,e,o){return t!=null&&e!=null&&t>=0&&e>t&&e<=o}function Z(){const t=globalThis.document?.getElementById(u);t&&(t.__sveHtmlScope=a.htmlScopeActive&&a.htmlFocus?{full:a.htmlFull,from:a.htmlFocus.from,to:a.htmlFocus.to,get css(){return lo()}}:a.htmlAll&&a.cssPane==="tree"?{get css(){return lo()}}:null)}function At(){const t=v.html?.state.doc.toString()??"";if(!a.htmlScopeActive||!a.htmlFocus){a.htmlFull=t,Z();return}if(a.htmlFocus.from<0||a.htmlFocus.from>a.htmlFull.length||a.htmlFocus.to<a.htmlFocus.from){a.htmlScopeActive=!1,a.htmlFull=t,a.htmlFocus=null,Z();return}a.htmlFull=a.htmlFull.slice(0,a.htmlFocus.from)+t+a.htmlFull.slice(a.htmlFocus.to),a.htmlFocus={from:a.htmlFocus.from,to:a.htmlFocus.from+t.length},Z()}function vt(){return At(),a.htmlScopeActive?a.htmlFull:v.html?.state.doc.toString()??a.lastParts.html??""}function je(){a.lastBracketNames=se(vt()).map(t=>t.name)}function Ht(){a.lastCssSelectorNames=ps(v.css?.state.doc.toString()??a.cssFull)}function Ns(t,e){return Array.isArray(t)&&Array.isArray(e)&&t.length===e.length&&t.every((o,n)=>o===e[n])}function qs(t,e){a.cssFull=Rr(a.cssFull,t,e),a.cssFull=Nr(a.cssFull,e,t)}function fc(t){if(a.applying||a.lastLocked||a.lastBracketNames==null)return;const e=se(vt()).map(o=>o.name);Ns(a.lastBracketNames,e)||(qs(a.lastBracketNames,e),a.lastBracketNames=e,gt(),Ht())}function hc(){if(a.applying||a.lastLocked||a.lastCssSelectorNames==null||a.lastBracketNames==null||a.cssPane==="empty")return;const t=v.html,e=v.css?.state.doc.toString()??"";if(!hs(e))return;const o=ps(e);if(!t||Ns(a.lastCssSelectorNames,o))return;const n=new Set(a.lastBracketNames),{renamed:s,added:r,removed:i}=zr(a.lastCssSelectorNames,o);let l=t.state.doc.toString();const c=l;for(const d of s){const f=Lt(d.to);!n.has(d.from)||!f||(l=vn(l,h=>h===d.from?f:h))}for(const d of i)!n.has(d)||o.includes(d)||(l=vn(l,f=>f===d?"":f));if(l=pc(l,r,n,e),l!==c){a.applying=!0;try{ce(l)}finally{a.applying=!1}}je(),a.lastCssSelectorNames=o}function pc(t,e,o,n){if(!e.length||a.cssPane!=="tree")return t;At();const s=a.cssFocus?.path,r=a.htmlScopeActive&&!!a.htmlFocus;if(!s&&!r)return t;const i=r?a.htmlFocus.from:0,l=r?a.htmlFull.slice(0,i)+t+a.htmlFull.slice(a.htmlFocus.to):t,c=ae(re(l),new Set),d=s?c.find(y=>y.path===s):c.find(y=>y.from===i);if(!d||d.from<i||d.openTo-i>t.length)return t;const f=new Set(se(l).map(y=>y.name)),h=d.from-i;let m=d.openTo-i,b=t;for(const y of e){const L=Lt(y);!L||o.has(L)||f.has(L)||!qr(n,L)||({html:b,to:m}=Vr(b,h,m,L),f.add(L))}return b}function mc(t,e){const o=Lt(e),n=v.html;if(!o||!n||n.state.readOnly||o===t.name)return;a.applying=!0;try{n.dispatch({changes:{from:t.from,to:t.to,insert:o}})}finally{a.applying=!1}const s=a.lastBracketNames==null?[]:a.lastBracketNames.slice();je(),qs(s,a.lastBracketNames),gt(),Ht(),a.lastWin&&(X(a.lastWin),E(a.lastWin))}function vc(t,e){const o=t.document,s=v.html?.coordsAtPos(e.from);$(o),nt(o);const r=o.createElement("div"),i={getBoundingClientRect:()=>({left:s?.left??12,right:s?.right??12,top:s?.top??12,bottom:s?.bottom??12,width:0,height:0})};r.id=k,o.body.appendChild(r),D(t,i,r),r._sveApp=H(Ho,r,{label:p(t,"code_dock_css_rename_class"),placeholder:p(t,"code_dock_css_class_placeholder"),initial:e.name,onAdd:l=>{mc(e,l),$(o)}})}function Vs(){return a.htmlScopePref&&!a.htmlAll&&$t(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)?(a.htmlScopeActive=!0,Z(),a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to)):(a.htmlScopeActive=!1,Z(),a.htmlFull)}function le(t,e,o){const n=v[t];if(!n)return;const s=n.state.doc.toString();a.applying=!0;try{if(s!==e){const[r,i,l]=Wo(s,e);n.dispatch({changes:{from:r,to:i,insert:l},...o?{selection:o,scrollIntoView:!0}:{}})}else o&&n.dispatch({selection:o,scrollIntoView:!0})}finally{a.applying=!1}}function ce(t,e){le("html",t,e)}function Us(){if(a.htmlScopeActive)return v.html?.state.doc.toString()??"";if(a.htmlAll){const t=v.html?.state.doc.toString()??"";return $t(a.htmlFocus?.from,a.htmlFocus?.to,t.length)?t.slice(a.htmlFocus.from,a.htmlFocus.to):""}return $t(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)?a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to):""}function Ks(){const t=a.cssFocus?.path;if(!t)return null;const e=vt(),o=ae(re(e),new Set).find(n=>n.path===t);return o?e.slice(o.from,o.to):(a.cssFocus=null,null)}function gc(){return Ks()??Us()}function lh(){a.cssFocus=null}function bc(t){if(!t||a.applying||a.cssValues)return;const e=v.html;if(!e)return;At(),V();const o=a.htmlScopeActive&&!!a.htmlFocus,s=(o?a.htmlFocus.from:0)+e.state.selection.main.from;let r=null;for(const l of ae(re(a.htmlFull),new Set))l.from<=s&&s<l.to&&(r=l);!r||s<r.from||s>=r.openTo||(a.cssFocus?a.cssFocus.path===r.path:o&&a.htmlFocus.from===r.from&&a.htmlFocus.to===r.to)||(a.cssFocus={path:r.path},gt())}function yc(){const t=v.html?.state.doc.toString(),e=a.htmlFocus;return t!=null&&a.htmlScopeActive&&e&&e.from>=0&&e.from<=a.htmlFull.length&&e.to>=e.from?a.htmlFull.slice(0,e.from)+t+a.htmlFull.slice(e.to):t??a.lastParts.html??""}function lo(){const t=v.css?.state.doc.toString();if(t==null)return a.cssFull;if(a.cssPane==="tree"){if(t===a.cssScopeSnapshot)return a.cssFull;const e=Ao(gc())[0]?.className||Wr(t);return fs(a.cssFull,t,e,{previous:a.cssScopeSnapshot,keep:se(yc()).map(o=>o.name)})}return a.cssPane==="full"?t:a.cssFull}function V(){const t=v.css?.state.doc.toString()??"";if(a.cssPane==="tree"){if(t===a.cssScopeSnapshot||!hs(t))return;a.cssFull=lo(),a.cssScopeSnapshot=t}else a.cssPane==="full"&&(a.cssFull=t)}function kc(t,e){return(e||[]).some(o=>!To(t,o.className))}function gt(){let t=a.cssFull,e=[],o=!1;const n=Ks(),s=n==null&&!a.htmlScopeActive&&!(a.htmlAll&&a.htmlFocus);a.cssValues||a.cssAll||!a.htmlScopePref?(a.cssPane="full",t=a.cssFull):(e=Ao(n??(s?vt():Us())),e.length?(a.cssPane="tree",t=us(a.cssFull,e),!a.cssFocus&&!s&&kc(a.cssFull,e)&&(a.cssFull=fs(a.cssFull,t,e[0].className),o=!0)):(a.cssPane="empty",t="")),a.cssScopeSnapshot=t,le("css",t),Ht(),a.lastWin&&(zt(a.lastWin,!0),E(a.lastWin),o&&X(a.lastWin))}function ze(t){const e=v.html;if(!e||!a.htmlFocus)return;a.htmlAll=!1,a.htmlScopeActive||(a.htmlFull=e.state.doc.toString());const o=a.htmlFull.length,n=Math.max(0,Math.min(a.htmlFocus.from,o)),s=Math.max(n,Math.min(a.htmlFocus.to,o));if(s<=n)return;a.htmlFocus={from:n,to:s},a.htmlScopeActive=!0,Z();const r=t==null?0:Math.max(0,Math.min(t-n,s-n));ce(a.htmlFull.slice(n,s),{anchor:r,head:r}),Ro("html"),gt(),e.focus()}function No(t=!0,e=null){const o=v.html;if(!o)return;V(),At(),a.htmlScopeActive=!1,a.htmlAll=!1,Z();const n=a.htmlFull||o.state.doc.toString(),s=e!=null?{anchor:Math.max(0,Math.min(e,n.length))}:t&&$t(a.htmlFocus?.from,a.htmlFocus?.to,n.length)?{anchor:a.htmlFocus.from,head:a.htmlFocus.to}:null;a.htmlFull=n,ce(n,s),Ro("html"),a.cssPane="full",a.cssScopeSnapshot=a.cssFull,le("css",a.cssFull),Ht()}function Gs(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-html-all]");if(!e)return;e.hidden=!a.htmlScopePref;const o=t.document.createElement("span");o.textContent=p(t,"code_dock_html_all"),e.innerHTML=js,e.appendChild(o),e.title=p(t,a.htmlAll?"code_dock_html_all_off":"code_dock_html_all_on"),e.setAttribute("aria-label",e.title),e.setAttribute("aria-pressed",a.htmlAll?"true":"false")}function xc(t,e){const o=v.html;if(!o||!!e===a.htmlAll){Gs(t);return}if(e){At();const n=a.htmlFull||o.state.doc.toString(),s=$t(a.htmlFocus?.from,a.htmlFocus?.to,n.length)?a.htmlFocus:null;a.htmlScopeActive=!1,a.htmlFull=n,Z(),ce(n,s?{anchor:s.from}:null),Ro("html"),a.htmlAll=!0}else{const n=o.state.doc.length;$t(a.htmlFocus?.from,a.htmlFocus?.to,n)?(V(),ze(null)):(a.htmlAll=!1,a.htmlFocus=null,V(),gt())}R(t)}function de(){a.htmlFocus=null,a.htmlAll=!1,a.cssFocus=null,a.htmlScopeActive=!1,a.htmlFull="",a.cssFull="",a.cssPane="full",a.cssScopeSnapshot="",a.lastBracketNames=null,a.lastCssSelectorNames=null,Z()}let Jt=!1;function Ft(t){return!!t?.document.getElementById(Jn)}function co(t,e){if(!(!t||_o(t,"html_tree")===!1)){if(!e){Ft(t)&&ns(t);return}Ft(t)||(Jt=!0,wr("html_tree").then(()=>{Ft(t)||Sr(t)}).catch(()=>{}).finally(()=>{Jt=!1,R(t)}))}}function R(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-html-scope]");if(!e)return;a.htmlScopePref=ie(t);const o=_o(t,"html_tree")===!1?a.htmlScopePref:Ft(t)||Jt;e.setAttribute("aria-pressed",o?"true":"false"),e.title=p(t,o?"code_dock_html_scope_off":"code_dock_html_scope"),e.setAttribute("aria-label",e.title),e.innerHTML=nr,t.document.getElementById(u)?.toggleAttribute("data-sve-html-scoped",a.htmlScopeActive),Z(),Gs(t)}function An(t,e){e._sveHtmlScopeBound||(e._sveHtmlScopeBound=!0,a.htmlScopePref=ie(t),_c(t,e),co(t,a.htmlScopePref),e.querySelector("[data-sve-html-all]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),xc(t,!a.htmlAll)}),e.querySelector("[data-sve-html-scope]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=Ft(t)||Jt;a.htmlScopePref=!n,q(t,Ge,a.htmlScopePref?"1":"0"),a.htmlScopePref?a.htmlFocus&&(V(),ze()):(a.htmlScopeActive||a.htmlAll)&&No(),co(t,a.htmlScopePref),R(t)}))}function _c(t,e){e._sveTreeWatchBound||(e._sveTreeWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>{if(Jt||_o(t,"html_tree")===!1||!t.document.getElementById(u))return;const o=Ft(t);o!==ie(t)&&(a.htmlScopePref=o,q(t,Ge,o?"1":"0"),o?a.htmlFocus&&(V(),ze()):(a.htmlScopeActive||a.htmlAll)&&No(),R(t))}))}const wc=new Set(["pre","textarea","script","style"]),Sc=/^(<\/|\{\{\s*\/)/;function $c(t){let e=0;for(const o of t.split(`
`)){if(!o.trim())continue;const n=o.length-o.trimStart().length;n>0&&(e===0||n<e)&&(e=n)}return" ".repeat(e===2||e===3?e:4)}function Cc(t){const e=String(t||"");if(!e.trim())return e;const o=[],n=l=>{for(const c of l||[])o.push(c),n(c.children)};n(Ur(e));const s=$c(e),r=[];let i=0;for(const l of e.split(`
`)){const c=i,d=l.trim();i+=l.length+1;const f=c+(l.length-l.trimStart().length),h=o.filter(b=>b.from<f&&f<b.to);if(h.some(b=>wc.has(b.tag))){r.push(l);continue}if(!d)continue;const m=h.length-(Sc.test(d)?1:0);r.push(s.repeat(Math.max(m,0))+d)}return r.join(`
`)+(e.endsWith(`
`)?`
`:"")}function uo(t,e){let o=0;for(;o<e;){const n=Ac(t,o);if(n===null){o+=1;continue}if(n===-1)return e;if(n>e)return n;o=n}return e}function Ac(t,e){if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?-1:o+2}if(t.startsWith("<!--",e)){const o=t.indexOf("-->",e+4);return o===-1?-1:o+3}return t[e]==="<"&&/[A-Za-z/!?]/.test(t[e+1]||"")?Tc(t,e):null}function Tc(t,e){let o="",n=e+1;for(;n<t.length;){const s=t[n];if(o){s===o&&(o=""),n+=1;continue}if(t.startsWith("{{",n)){const r=t.indexOf("}}",n+2);if(r===-1)return-1;n=r+2;continue}if(s==='"'||s==="'"){o=s,n+=1;continue}if(s===">")return n+1;if(s==="<")return-1;n+=1}return-1}function qo(t,e){if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?t.length:o+2}if(t.startsWith("<!--",e)){const o=t.indexOf("-->",e+4);return o===-1?t.length:o+3}return e}function Ae(t,e){if(t[e]!=="<")return null;const o=t.indexOf(">",e+1);if(o===-1)return null;const n=t.slice(e,o+1),s=n.match(/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/);if(s)return{kind:"close",name:s[1].toLowerCase(),from:e,to:o+1};const r=n.match(/^<([A-Za-z][A-Za-z0-9:-]*)/);if(!r)return{kind:"other",from:e,to:o+1};const i=r[1].toLowerCase();return{kind:/\/\s*>$/.test(n)||["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"].includes(i)?"void":"open",name:i,from:e,to:o+1}}function fo(t,e,o){let n=1,s=o;for(;s<t.length;){const r=qo(t,s);if(r!==s){s=r;continue}if(t[s]!=="<"){s+=1;continue}const i=Ae(t,s);if(!i)break;if(i.kind==="open"&&i.name===e)n+=1;else if(i.kind==="close"&&i.name===e&&(n-=1,n===0))return i;s=i.to}return null}function Mc(t,e){const o=[];let n=0;for(;n<e;){const s=qo(t,n);if(s!==n){n=s;continue}if(t[n]!=="<"){n+=1;continue}const r=Ae(t,n);if(!r)return null;if(e<r.to){if(r.kind==="open")return{name:r.name,open:r,close:fo(t,r.name,r.to),at:"open"};if(r.kind==="void")return{name:r.name,open:r,close:null,at:"open"};if(r.kind==="close"){let i=null;for(let l=o.length-1;l>=0;l-=1)if(o[l].name===r.name){i=o[l];break}return{name:r.name,open:i,close:r,at:"close"}}return null}if(r.kind==="open")o.push(r);else if(r.kind==="close"){for(let i=o.length-1;i>=0;i-=1)if(o[i].name===r.name){o.splice(i);break}}n=r.to}return null}function ue(){const t=v.html;if(!t)return null;const e=t.state.selection.main.head,o=t.state.doc.toString(),n=[];let s=0;for(;s<e;){const c=qo(o,s);if(c!==s){s=c;continue}if(o[s]!=="<"){s+=1;continue}const d=Ae(o,s);if(!d||d.from>=e)break;if(d.kind==="open")n.push(d);else if(d.kind==="close"){for(let f=n.length-1;f>=0;f-=1)if(n[f].name===d.name){n.splice(f);break}}s=d.to}const r=o.lastIndexOf("<",Math.max(0,e-1));if(r!==-1&&o.indexOf(">",r)>=e){const c=Ae(o,r);if(c?.kind==="open"||c?.kind==="void"){const d=c.kind==="void"?null:fo(o,c.name,c.to);return d?{name:c.name,open:c,close:d}:{name:c.name,open:c,close:null}}}const i=n[n.length-1];if(!i)return null;const l=fo(o,i.name,i.to);return{name:i.name,open:i,close:l}}function Te(t){return sr.includes(t)}function I(){v.html?.focus(),a.lastWin&&(X(a.lastWin),We(a.lastWin))}function ht(t,e,o,n=void 0){const s=[...e].sort((r,i)=>i.from-r.from||i.to-r.to);t.dispatch({changes:s,selection:o,...n?{userEvent:n}:{}})}const Mt="input.toolbar";function Qt(t,e,o){const n=v.html;if(!n||n.state.readOnly)return;const s=n.state.selection.main.head,r=n.state.doc.lineAt(s),i=r.text.slice(0,s-r.from),l=r.text.trim()?it(r.text):Ne(n,r)||it(r.text);let c=t,d=0;if(i.trim()!=="")c=`
${l}${t}`,d=1+l.length;else if(!r.text.trim()){c=`${l}${t}`,d=l.length,n.dispatch({changes:{from:r.from,to:r.to,insert:c},selection:Tn(r.from+d+e,o),userEvent:Mt});return}n.dispatch({changes:{from:s,to:n.state.selection.main.to,insert:c},selection:Tn(s+d+e,o),userEvent:Mt})}function Tn(t,e){return e?{anchor:t,head:t+e}:{anchor:t}}function Xs(t){const{from:e}=t.state.selection.main,o=uo(t.state.doc.toString(),e);return o!==e&&t.dispatch({selection:{anchor:o}}),o}function Ys(t,e,o){const n=v.html;!n||n.state.readOnly||(Xs(n),Qt(t,e,o))}const Ec=new Set(["section","article","header","footer","main","nav","aside"]);function Fc(t){return Te(t)||t==="p"||t==="a"}function Mn(t){if(t==="a")return'<a href="">';if(t!=="section")return`<${t}>`;const e=a.lastWin?.Statamic?.$config?.get?.("sveSectionTag");return typeof e=="string"&&e.trim()?`<${t} ${e.trim()}>`:`<${t}>`}function Zs(){const t=v.html;if(!t||t.state.readOnly)return;const e=t.state.doc.toString(),o=(e.match(/^[ \t]*/)||[""])[0],n=Cc(e).split(`
`).map(s=>s&&o+s).join(`
`);n!==e&&(ht(t,[{from:0,to:e.length,insert:n}],{anchor:0}),I())}function Js(t){const e=v.html;if(!e||e.state.readOnly)return;const o=e.state.selection.main,n=e.state.doc.toString();if(!o.empty&&uo(n,o.from)===o.from&&uo(n,o.to)===o.to){const f=n.slice(o.from,o.to),h=f.match(new RegExp(`^<${t}(\\s[^>]*)?>([\\s\\S]*)</${t}>$`,"i"));if(h){ht(e,[{from:o.from,to:o.to,insert:h[2]}],{anchor:o.from,head:o.from+h[2].length},Mt),I();return}const m=Mn(t);let b=`${m}${f}</${t}>`,y=o.from+m.length;t==="ul"&&(b=`<ul>
  <li>${f}</li>
</ul>`,y=o.from+11),ht(e,[{from:o.from,to:o.to,insert:b}],{anchor:y,head:y+f.length},Mt),I();return}const r=o.head,i=Mc(n,r);if(i&&i.name===t&&i.open&&i.close){ht(e,[{from:i.close.from,to:i.close.to,insert:""},{from:i.open.from,to:i.open.to,insert:""}],{anchor:i.open.from},Mt),I();return}const l=ue();if(l?.open&&l.close&&Te(l.name)&&Te(t)&&l.name!==t){const f=n.slice(l.open.from,l.open.to).replace(new RegExp(`^<${l.name}`,"i"),`<${t}`);ht(e,[{from:l.close.from,to:l.close.to,insert:`</${t}>`},{from:l.open.from,to:l.open.to,insert:f}],{anchor:l.open.from+t.length+1},Mt),I();return}l?.open&&l.name===t&&Fc(t)&&e.dispatch({selection:{anchor:l.close?l.close.to:l.open.to}}),Xs(e);const d=(e.state.doc.lineAt(e.state.selection.main.head).text.match(/^\s*/)||[""])[0];if(t==="ul"){const f=`<ul>
${d}  <li></li>
${d}</ul>`;Qt(f,`<ul>
${d}  <li>`.length)}else{const f=Mn(t),h=`${f}</${t}>`,m=t==="a"?f.indexOf('""')+1:Ec.has(t)?f.length:h.length;Qt(h,m)}I()}function Qs(t,e){let o=null;for(const n of vs(t))n.kind==="loop"&&n.loopKind==="collection"&&n.from<=e&&e<n.to&&(o=n);return o}function Lc(){const t=v.html;return t?Qs(t.state.doc.toString(),t.state.selection.main.head):null}function Bc(){const t=v.html;if(!t||t.state.readOnly)return;const e=t.state.doc.toString(),o=Qs(e,t.state.selection.main.head);if(!o)return;const n=Gr(e,o,!o.paginate);if(n===e)return;if(!gs(e,n)){a.lastWin?.Statamic?.$toast?.error(p(a.lastWin,"html_tree_locked_element"));return}const[s,r,i]=Wo(e,n);ht(t,[{from:s,to:r,insert:i}]),I()}function We(t){try{Pc(t)}catch{}}function Pc(t){const e=t?.document?.getElementById(u),n=ue()?.name||"";if(!e)return;const s=Lc();for(const r of ko){const i=e.querySelector(`[data-sve-html-tool="${r.id}"]`);if(!i)continue;const l=r.action==="pagination",c=l?!!s?.paginate:r.id==="heading"?Te(n):n===r.tag;l&&i.toggleAttribute("data-in-loop",!!s),c?i.setAttribute("data-active",""):i.removeAttribute("data-active")}}function En(t,e,o){const n=t.document,s=ue()?.name||"";$(n),e.setAttribute("data-open","");const r=n.createElement("div");r.id=k,n.body.appendChild(r),D(t,e,r),r._sveApp=H(et,r,{kind:"choices",choices:o.map(i=>({value:i,label:i.toUpperCase(),active:s===i})),onPick:i=>{Js(i),$(n)}})}function Ic(t,e){const o=t.document;$(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=k,o.body.appendChild(n),D(t,e,n);const s=r=>{o.getElementById(k)&&(n._sveApp?.unmount(),n._sveApp=H(et,n,{kind:"choices",choices:r,onPick:i=>{i&&(Ys(i,i.length),I()),$(o)}}),D(t,e,n))};s([{value:"",label:p(t,"code_dock_loading")}]),t.fetch("/!/sve/components",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(r=>r.ok?r.json():{items:[]}).then(r=>{const i=Array.isArray(r.items)?r.items:[];s(i.length?i.map(l=>({value:l.tag,label:l.name})):[{value:"",label:p(t,"component_none")}])}).catch(()=>s([{value:"",label:p(t,"component_none")}]))}function Fn(t){const e=Lt(t),o=v.html,n=v.css;if(!e||o?.state.readOnly||n?.state.readOnly)return;const s=ue();if(s?.open&&o){const r=o.state.doc.sliceString(s.open.from,s.open.to),i=Kr(r,e);i!==r&&o.dispatch({changes:{from:s.open.from,to:s.open.to,insert:i}})}V(),To(a.cssFull,e)||(a.cssFull=`${String(a.cssFull||"").trimEnd()}${a.cssFull?.trim()?`
`:""}.${e} {
}
`),gt(),je(),Ht(),a.lastWin&&(X(a.lastWin),We(a.lastWin),E(a.lastWin))}function Oc(t,e){const o=t.document;if(e.hasAttribute("data-open")){$(o);return}$(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=k,o.body.appendChild(n),D(t,e,n);const s=l=>{const c=Lt(l);if(!c)return"";if(To(a.cssFull,c))return p(t,"class_exists_here");const d=[...new Set(Oo(t,c).map(f=>String(f.file).replace(/^.*\//,"")))];return d.length?p(t,"class_exists_pick",{file:d.join(", ")}):""},r=l=>{Fn(l),Do(t,Lt(l)),$(o)},i=()=>{if(!o.getElementById(k))return;const l=n.querySelector("[data-sve-css-add-input]")?.value||"";n._sveApp?.unmount(),n._sveApp=H(Ho,n,{label:p(t,"code_dock_css_class_name"),placeholder:p(t,"code_dock_css_class_placeholder"),initial:l,options:jl(t,p(t,"class_this_file")),existingLabel:p(t,"code_dock_css_class_existing"),createLabel:p(t,"code_dock_css_class_create"),takenText:s,onPick:r,onClose:()=>$(o),onAdd:c=>{Fn(c),$(o)}}),D(t,e,n)};i(),Io(t).then(i)}function Dc(t,e){const o=e.querySelector("[data-sve-css-add-class]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=Af,o.title=p(t,"code_dock_css_add_class"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),a.styleMode==="tw"){$(t.document),Xr(t,o);return}Oc(t,o)}))}function Vo(){const t={html:"",css:"",js:""};At(),V();for(const e of st)e==="html"?t.html=a.htmlScopeActive?a.htmlFull:v.html?.state.doc.toString()??"":e==="css"?(t.css=a.lastWin?kl(a.cssFull,bt(a.lastWin)):a.cssFull,t.css=Ul(t.css,t.html,gf)):t[e]=v[e]?.state.doc.toString()??"";return t}function ta(){if(a.cssValues||a.cssAll||!a.htmlScopePref)return a.cssPane="full",a.cssScopeSnapshot=a.cssFull,a.cssFull;const t=$t(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length),e=Ao(t?a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to):a.htmlFull);if(!e.length)return a.cssPane="empty",a.cssScopeSnapshot="","";a.cssPane="tree";const o=us(a.cssFull,e);return a.cssScopeSnapshot=o,o}function jt(t,e){a.applying=!0;try{a.lastWin&&(a.htmlScopePref=ie(a.lastWin)),a.htmlFull=t.html??"",a.cssFull=t.css??"",a.cssAll=!1,a.htmlAll=!1;for(const o of st){const n=v[o];let s=t[o]??"";try{s=o==="html"?Vs():o==="css"?ta():s}catch{s=o==="html"?a.htmlFull||t.html||"":o==="css"?a.cssFull||t.css||"":s}if(!n)continue;const r=n.state.doc.toString(),i=[Gt[o].reconfigure(oe.readOnly.of(!!e)),Xt[o].reconfigure(B.editable.of(!e))];r!==s?n.dispatch({changes:{from:0,to:r.length,insert:s},effects:i}):n.dispatch({effects:i})}}finally{a.applying=!1}je(),Ht(),So("dock:html-changed"),a.lastWin&&(E(a.lastWin),We(a.lastWin),R(a.lastWin),he(a.lastWin))}function Uo(t,e){return t.html===e.html&&t.css===e.css&&t.js===e.js}function ea(t){return String(t||"").replace(/\/\*[\s\S]*?\*\//g,"").trim().replace(/\s*:\s*/g,": ").replace(/\s*;\s*/g,";").replace(/\s+/g," ").replace(/;+$/,";")}function oa(t){const e=ea(t).match(/^([a-z-]+)\s*:/i);return e?e[1].toLowerCase():""}function na(t){const e=ea(t),o=e.indexOf(":");return o===-1?"":e.slice(o+1).replace(/;$/,"").trim().toLowerCase()}function P(t){const e=String(t||"").trim().toLowerCase();return e==="start"||e==="flex-start"||e==="left"||e==="top"?"flex-start":e==="end"||e==="flex-end"||e==="right"||e==="bottom"?"flex-end":e==="row-reverse"?"row-reverse":e==="column-reverse"?"column-reverse":e}function te(t){const e=P(t);return e==="flex"||e==="inline-flex"}function Re(){const t=v.css;if(!t)return null;const e=t.state.selection.main.head,o=t.state.doc.toString(),n=[],s=[];for(let i=0;i<o.length;i+=1){if(o[i]==="{"&&o[i+1]==="{"){const l=o.indexOf("}}",i+2);if(l===-1)break;i=l+1;continue}if(o[i]==="{")n.push(i);else if(o[i]==="}"){const l=n.pop();l!=null&&s.push({from:l+1,to:i,text:o.slice(l+1,i),open:l})}}let r=null;for(const i of s)e<i.open||e>i.to||(!r||i.to-i.open<r.to-r.open)&&(r=i);return r}function Hc(t){const e=String(t||"");let o="",n=0;for(let s=0;s<e.length;s+=1){if(e[s]==="{"&&e[s+1]==="{"){const r=e.indexOf("}}",s+2);if(r===-1)break;n===0&&(o+=e.slice(s,r+2)),s=r+1;continue}if(e[s]==="{"){n+=1;continue}if(e[s]==="}"){n=Math.max(0,n-1);continue}n===0&&(o+=e[s])}return o}function Ln(t){const e={};for(const o of Hc(t).split(";")){const n=oa(o);n&&(e[n]=na(`${o};`))}return e}function jc(t,e,o){if(!e||e.from>=e.to)return null;let n=t.state.doc.lineAt(e.from),s=0;for(;n.from<=e.to;){const r=Math.max(n.from,e.from),i=Math.min(n.to,e.to),l=t.state.doc.sliceString(r,i);if(s===0&&oa(l)===o)return{from:r,to:i,text:l};if(s+=zc(l),n.to>=t.state.doc.length||n.to>=e.to)break;n=t.state.doc.lineAt(n.to+1)}return null}function zc(t){let e=0;const o=String(t);for(let n=0;n<o.length;n+=1){if(o[n]==="{"&&o[n+1]==="{"){const s=o.indexOf("}}",n+2);n=s===-1?o.length:s+1;continue}o[n]==="{"?e+=1:o[n]==="}"&&(e-=1)}return e}function it(t){return(String(t).match(/^\s*/)||[""])[0]}function Ne(t,e,o){for(let n=e.number-1;n>=1;n-=1){const s=t.state.doc.line(n),r=s.text.trim();if(!r)continue;const i=it(s.text);if(o&&(r==="{"||r.endsWith("{")))return`${i}  `;if(!(r==="}"||r.startsWith("}")))return i}return""}function Wc(t,e){const o=t.state.doc.lineAt(e);if(o.text.trim())return it(o.text);const n=Ne(t,o,!0);if(n)return n;const s=Re();return s?sa(t,s):"  "}function sa(t,e){const o=t.state.doc.lineAt(e.from),n=t.state.doc.lineAt(Math.max(e.from,e.to));for(let r=n.number;r>=o.number;r-=1){const i=t.state.doc.line(r),l=Math.max(i.from,e.from),c=Math.min(i.to,e.to),d=t.state.doc.sliceString(l,c);if(d.trim())return(d.match(/^\s*/)||[""])[0]||"  "}return`${(t.state.doc.lineAt(Math.max(0,e.from-1)).text.match(/^\s*/)||[""])[0]}  `}function Bn(){v.css?.focus(),a.lastWin&&(X(a.lastWin),E(a.lastWin))}function aa(t,e){if(!e)return"";const o=t.state.doc.toString();let n=0;for(let s=e.open-1;s>=0;s-=1)if(o[s]==="}"||o[s]==="{"||o[s]===";"){n=s+1;break}return o.slice(n,e.open).replace(/\/\*[\s\S]*?\*\//g,"").trim()}function Rc(t,e){if(!a.cssState||!e)return e;const o=ra(t,e);if(o)return o;const n=aa(t,e);if(!n||n.startsWith("@"))return e;const s=t.state.doc.toString(),r=_t(s,e.open),i=_t(s,e.to)||`${r}    `,l=(t.state.doc.sliceString(e.from,e.to).match(/\n([^\S\n]*)$/)||[null,null])[1],c=l===null?e.to:e.to-l.length,d=`
${i}&${Ve()} {
${i}}
${l??r}`;t.dispatch({changes:{from:c,to:e.to,insert:d}});const f=t.state.doc.toString(),h=f.indexOf("{",c+d.indexOf("&")),m=h===-1?-1:Mo(f,h);return m===-1?e:{from:h+1,to:m,text:f.slice(h+1,m),open:h}}function _t(t,e){const o=t.lastIndexOf(`
`,e-1)+1;return(t.slice(o,e).match(/^\s*/)||[""])[0]}function G(t){const e=v.css;if(!e||e.state.readOnly||!t.length)return;const o=Re(),n=t.some(l=>l.value!=null)?Rc(e,o):o;if(!n){const l=t.filter(c=>c.value!=null).map(c=>`${c.property}: ${c.value};`).join(`
`);l&&Vc(l),Bn();return}const s=[],r=[],i=sa(e,n);for(const l of t){const c=jc(e,n,l.property);if(l.value==null){if(!c)continue;let d=c.from,f=c.to;e.state.doc.sliceString(f,f+1)===`
`&&(f+=1),d=Math.max(d,n.from),f=Math.min(f,n.to),s.push({from:d,to:f});continue}if(!(c&&P(na(c.text))===P(l.value)))if(c){const d=(c.text.match(/^\s*/)||[""])[0];s.push({from:c.from,to:c.to,insert:`${d}${l.property}: ${l.value};`})}else r.push(`${i}${l.property}: ${l.value};`)}if(r.length){const l=!n.text.includes(`
`)||!/\n\s*$/.test(n.text)?`
`:"",c=(n.text.match(/\n([^\S\n]*)$/)||[null,null])[1],d=c===null?n.to:n.to-c.length,f=c===null?"":c;s.push({from:d,to:n.to,insert:`${l}${r.join(`
`)}
${f}`})}s.length&&(s.sort((l,c)=>c.from-l.from||c.to-l.to),e.dispatch({changes:s})),Bn()}function J(){const t=v.css,e=Re();if(!e)return{};if(a.cssState&&t){const o=ra(t,e);return o?Ln(o.text):{}}return Ln(e.text)}function ra(t,e){const o=aa(t,e),n=Ve();if(!o||o.startsWith("@"))return null;if(o.endsWith(n))return e;const s=t.state.doc.toString(),r=i=>{const l=Mo(s,i);return l===-1?null:{from:i+1,to:l,text:s.slice(i+1,l),open:i}};for(const i of[`&${n}`,`${o}${n}`]){const l=new RegExp(`(^|[^\\w-])${i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\s*\\{`,"g");let c;for(;c=l.exec(s);){const d=s.indexOf("{",c.index);if(i.startsWith("&")&&(d<e.from||d>e.to))continue;const f=r(d);if(f)return f}}return null}function Nc(t){const e=J(),o=te(e.display),n=P(e["flex-direction"])||(o?"row":"");if(o&&n===t){const s=[];e["flex-direction"]&&s.push({property:"flex-direction",value:null}),te(e.display)&&s.push({property:"display",value:null}),G(s);return}G([{property:"display",value:"flex"},{property:"flex-direction",value:t}])}function qc(t){const e=J();if(t==="flex"&&te(e.display)){G([{property:"justify-content",value:null},{property:"align-items",value:null},{property:"flex-direction",value:null},{property:"display",value:null}]);return}G([{property:"display",value:t}])}function Vc(t){const e=v.css;if(!e||e.state.readOnly)return;const o=e.state.selection.main.head,n=e.state.doc.lineAt(o),s=n.text.slice(0,o-n.from),r=n.text.slice(o-n.from),i=Wc(e,o),l=t.replace(/;?$/,";");if(s.trim()===""&&r.trim()===""){const d=`${i}${l}
${i}`;e.dispatch({changes:{from:n.from,to:n.to,insert:d},selection:{anchor:n.from+d.length}});return}const c=`
${i}${l}
${i}`;e.dispatch({changes:{from:o,to:e.state.selection.main.to,insert:c},selection:{anchor:o+c.length}})}function E(t){try{Uc(t),lt(t)}catch{}}function Uc(t){const e=a.styleMode==="tw",o=e?{}:J(),n=te(e?gn("display"):o.display),s=P(o["flex-direction"])||(n?"row":""),r=i=>e?Jr()?i.twGroup?!!Qr(i.twGroup):!!i.tw&&!!gn(i.tw):!1:!!i.css&&i.css in o;ft.tools=rr.map(i=>{const l=(i.kids||[]).filter(c=>c.when!=="flex"||n).map(c=>({id:c.id,title:c.title,icon:Zn[c.icon]||"",sep:!!c.sep,open:a.cssOpenMenu===c.id,active:e?r(c):c.kind==="display"?n:c.kind==="flexDir"?n&&s===c.value:c.value?P(o[c.css])===P(c.value):r(c)}));return{id:i.id,title:i.title,icon:Zn[i.id]||Mf[i.id]||"",open:a.cssOpenTool===i.id||a.cssOpenMenu===i.id,kids:l,active:i.value?!e&&P(o[i.css])===P(i.value):r(i)||l.some(c=>c.active)}})}function ee(t){$(t),a.cssOpenTool="",a.lastWin&&E(a.lastWin)}function $(t){const e=t?.getElementById(k);a.cssOpenMenu="",e?._sveApp?.unmount(),e?.remove(),t?.querySelectorAll("[data-sve-css-tool][data-open], [data-sve-html-tool][data-open], [data-sve-css-add-class][data-open], [data-sve-code-history][data-open]").forEach(o=>o.removeAttribute("data-open"))}function ch(t){$(t),N(t),nt(t);for(const e of st)v[e]&&Na?.(v[e])}function ia(t){if(a.cssColorsPromise)return a.cssColorsPromise;const e=t.Statamic?.$config?.get?.("cpUrl")||`/${t.Statamic?.$config?.get?.("cpRoute")||"cp"}`;return a.cssColorsPromise=t.fetch(`${e}/color-scheme/swatches`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async o=>{if(!o.ok)return[];const n=await o.json().catch(()=>[]);return Array.isArray(n)?n:[]}).catch(()=>[]).then(o=>{const n=new Set,s=[];for(const r of o){const i=r.var||r.value||r.handle,l=String(i||"").trim().replace(/^var\((.+)\)$/,"$1");!l||n.has(l)||(n.add(l),s.push({name:l,hex:r.hex||r.color||""}))}for(const[r,i]of ar)n.has(r)||(n.add(r),s.push({name:r,hex:i}));return s}),a.cssColorsPromise}function la(t,e){const o=J()[e]||"",n=String(o).match(/^var\(\s*([^)]+?)\s*\)$/i),s=n?n[1].trim():"";for(const r of t.querySelectorAll("[data-sve-css-token]"))s&&r.getAttribute("data-sve-css-token")===s?r.setAttribute("data-active",""):r.removeAttribute("data-active")}function D(t,e,o){const n=e.getBoundingClientRect(),s=8,r=t.innerHeight-(n.bottom+4)-s,i=n.top-4-s;o.style.maxHeight="";const l=o.offsetHeight||0,c=l>r&&i>r;o.style.left=`${Math.max(s,Math.min(n.left,t.innerWidth-220))}px`,o.style.maxHeight=`${Math.max(120,c?i:r)}px`,o.style.top=c?`${Math.max(s,n.top-4-Math.min(l,i))}px`:`${Math.max(s,n.bottom+4)}px`}function Kc(t,e,o){const n=t.document;$(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=k,n.body.appendChild(s),D(t,e,s);const r=i=>{s._sveApp?.unmount(),s._sveApp=H(et,s,{kind:"colors",swatches:i,onClear:()=>{G([{property:o,value:null}]),ee(n)},onPick:l=>{G([{property:o,value:`var(${l})`}]),ee(n)}}),la(s,o)};r(ar.map(([i,l])=>({name:i,hex:l}))),ia(t).then(i=>{n.getElementById(k)&&r(i.map(l=>({name:l.name,hex:l.hex})))})}function Gc(t,e,o,n){const s=t.document;$(s),e.setAttribute("data-open","");const r=s.createElement("div"),i=J()[o]||"";r.id=k,s.body.appendChild(r),D(t,e,r),r._sveApp=H(et,r,{kind:"choices",choices:(n||[]).map(l=>({value:l,label:l,active:P(l)===P(i)})),onPick:l=>{const c=P(l)===P(J()[o]||"");G([{property:o,value:c?null:l}]),ee(s)}})}function Pn(t,e,o,n=[]){const s=t.document;$(s),e.setAttribute("data-open",""),Yr(t);const r=s.createElement("div");r.id=k,s.body.appendChild(r),D(t,e,r);const i=()=>{const l=[...n.map(d=>({value:d,label:d})),...Zr(t,o).map(d=>({value:d.value,label:d.value}))],c=J()[o]||"";r._sveApp?.unmount(),r._sveApp=H(et,r,{kind:"choices",choices:l.map(d=>({...d,active:P(d.value)===P(c)})),onPick:d=>{G([{property:o,value:d||null}]),ee(s)}})};i(),ia(t).then(()=>{s.getElementById(k)===r&&i()})}function Xc(t,e,o){const n=t.document;$(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=k,n.body.appendChild(s),D(t,e,s),s._sveApp=H(et,s,{kind:"choices",choices:Tf.map(r=>({value:r,token:r,label:r})),onPick:r=>{G([{property:o,value:`var(${r})`}]),ee(n)}}),la(s,o)}const In=/\{\{#[\s\S]*?#\}\}|\{\{[\s\S]*?\}\}/g,On=/<!--[\s\S]*?-->/g,Dn=/<(\/?)([A-Za-z][A-Za-z0-9-]*)/g,ca=/^\{\{\s*(?:\/|endif\b|endunless\b)/,Yc=/^\{\{\s*(?:\/\s*(?:if|unless)\b|endif\b|endunless\b)/,Zc=/^\{\{\s*\/\s*partial\b/;function eo(t,e,o){return t.some(n=>e<n.to&&o>n.from)}function Jc(t){const e=new Map;for(const o of vs(t)){const n=o.kind==="loop"?"loop":"if";e.set(o.from,n);const s=t.lastIndexOf("{{",o.to-2);s>=o.openTo&&ca.test(t.slice(s,o.to))&&e.set(s,n)}for(const o of cs(t))e.set(o.from,"component");return e}function Qc(t){const e=String(t||""),o=[],n=[];On.lastIndex=0;let s;for(;s=On.exec(e);)o.push({from:s.index,to:s.index+s[0].length});const r=Jc(e),i=[];for(In.lastIndex=0;s=In.exec(e);){const l=s.index,c=l+s[0].length,d=s[0];if(eo(o,l,c))continue;if(i.push({from:l,to:c}),d.startsWith("{{#")){n.push({from:l,to:c,cls:"comment"});continue}const f=ca.test(d),h=r.get(l)||(f&&Yc.test(d)?"if":"")||(f&&Zc.test(d)?"component":"");n.push({from:l,to:c,cls:(h?`fam-${h}`:"antlers")+(f?"-close":"")})}for(Dn.lastIndex=0;s=Dn.exec(e);){const l=s.index+1+s[1].length,c=l+s[2].length;eo(o,l,c)||eo(i,l,c)||n.push({from:l,to:c,cls:`fam-${$r(s[2])}`})}return n.sort((l,c)=>l.from-c.from),n}function Hn(t,e,o){const n=new e.RangeSetBuilder;let s=0;for(const r of Qc(t.doc.toString()))r.from<s||(n.add(r.from,r.to,o(r.cls)),s=r.to);return n.finish()}function td(t){const e=new Map,o=r=>r==="comment"?"sve-cm-antlers-comment":r==="antlers"?"sve-cm-antlers":r==="antlers-close"?"sve-cm-antlers sve-cm-antlers-close":r.endsWith("-close")?`sve-cm-${r.slice(0,-6)} sve-cm-antlers-close`:`sve-cm-${r}`,n=r=>(e.has(r)||e.set(r,t.Decoration.mark({class:o(r)})),e.get(r));return{extensions:[t.StateField.define({create(r){return Hn(r,t,n)},update(r,i){return i.docChanged?Hn(i.state,t,n):r},provide:r=>t.EditorView.decorations.from(r)})]}}const M=xo({tag:"",emptyText:"",addLabel:"",dropTitle:"",chips:[],states:[],canEdit:!1,onAdd:null,onChip:null,onDrop:null}),ed={class:"sve-al"},od={class:"sve-al-head"},nd={key:0,class:"sve-al-tag"},sd=["title","disabled"],ad={key:0,class:"sve-al-empty"},rd={class:"sve-al-chips"},id=["data-sve-al-chip","title","disabled","onClick"],ld={class:"sve-al-name"},cd={key:0,class:"sve-al-value"},dd=["title","onClick"],ud={__name:"AlpinePanel",setup(t){return(e,o)=>(x(),_("div",ed,[g("div",od,[w(M).tag?(x(),_("span",nd,"<"+T(w(M).tag)+">",1)):j("",!0),(x(!0),_(z,null,at(w(M).states,n=>(x(),_("span",{key:n,class:"sve-al-state"},T(n),1))),128)),o[1]||(o[1]=g("span",{class:"sve-al-gap"},null,-1)),g("button",{type:"button","data-sve-al-add":"",title:w(M).addLabel,disabled:!w(M).canEdit,onClick:o[0]||(o[0]=F(n=>w(M).onAdd?.(n),["prevent","stop"]))},"+",8,sd)]),w(M).chips.length?j("",!0):(x(),_("div",ad,T(w(M).emptyText),1)),g("div",rd,[(x(!0),_(z,null,at(w(M).chips,n=>(x(),_("span",{key:n.id,class:"sve-al-chip-wrap"},[g("button",{type:"button","data-sve-al-chip":n.id,title:n.title,disabled:!w(M).canEdit,onClick:F(s=>w(M).onChip?.(s,n.id),["prevent","stop"])},[g("span",ld,T(n.name),1),n.value?(x(),_("span",cd,T(n.value),1)):j("",!0)],8,id),w(M).canEdit?(x(),_("button",{key:0,type:"button",class:"sve-al-drop",title:w(M).dropTitle,onClick:F(s=>w(M).onDrop?.(n.id),["prevent","stop"])},"−",8,dd)):j("",!0)]))),128))])]))}},fd=xs(ud,[["__scopeId","data-v-15add965"]]),hd=[{id:"state",lang:"alpine_group_state"},{id:"act",lang:"alpine_group_act"},{id:"react",lang:"alpine_group_react"}],jn=[{id:"state",group:"state",label:"alpine_state",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: false }"}]},{id:"state_text",group:"state",label:"alpine_state_text",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: '|' }"}]},{id:"toggle",group:"act",label:"alpine_toggle",icon:"toggle",needsName:!0,attrs:[{name:"@click",value:":name = !:name"}]},{id:"open",group:"act",label:"alpine_open",icon:"open",needsName:!0,attrs:[{name:"@click",value:":name = true"}]},{id:"close",group:"act",label:"alpine_close",icon:"close",needsName:!0,attrs:[{name:"@click",value:":name = false"}]},{id:"open_hover",group:"act",label:"alpine_open_hover",icon:"open",needsName:!0,attrs:[{name:"@mouseenter",value:":name = true"}]},{id:"close_leave",group:"act",label:"alpine_close_leave",icon:"close",needsName:!0,attrs:[{name:"@mouseleave",value:":name = false"}]},{id:"open_focus",group:"act",label:"alpine_open_focus",icon:"open",needsName:!0,attrs:[{name:"@focusin",value:":name = true"}]},{id:"close_blur",group:"act",label:"alpine_close_blur",icon:"close",needsName:!0,attrs:[{name:"@focusout",value:":name = false"}]},{id:"close_outside",group:"act",label:"alpine_close_outside",icon:"outside",needsName:!0,attrs:[{name:"@click.outside",value:":name = false"}]},{id:"close_escape",group:"act",label:"alpine_close_escape",icon:"escape",needsName:!0,attrs:[{name:"@keydown.escape.window",value:":name = false"}]},{id:"show",group:"react",label:"alpine_show",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"}]},{id:"show_smooth",group:"react",label:"alpine_show_smooth",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"},{name:"x-transition",value:""}]},{id:"hide_until_ready",group:"react",label:"alpine_hide_until_ready",icon:"cloak",attrs:[{name:"x-cloak",value:""}]},{id:"class_when",group:"react",label:"alpine_class_when",icon:"klass",needsName:!0,attrs:[{name:":class",value:":name ? '|' : ''"}]},{id:"text",group:"react",label:"alpine_text",icon:"text",needsName:!0,attrs:[{name:"x-text",value:":name"}]}];function pd(t){return(t?.attrs||[]).map(e=>e.name).join(" ")}const md=/^(x-[\w:.-]+|@[\w:.-]+|:[\w-]+)$/;function vd(t){return md.test(String(t||""))}function fe(t){const e=String(t||""),o=[],n=/([@:a-zA-Z_][\w:.@-]*)(\s*=\s*(["'])([\s\S]*?)\3)?/g;let s,r=!0;for(;s=n.exec(e);){if(r){r=!1;continue}s[0].trim()&&o.push({name:s[1],value:s[4]??"",from:s.index,to:s.index+s[0].length,alpine:vd(s[1])})}return o}function da(t){const e=String(t||"").trim().replace(/^\{|\}$/g,""),o=[],n=/(^|,)\s*([a-zA-Z_$][\w$]*)\s*:/g;let s;for(;s=n.exec(e);)o.push(s[2]);return o}function gd(t,e){return t.map(o=>({name:o.name,value:String(o.value).replaceAll(":name:",`${e}:`).replaceAll(":name",e)}))}function Ko(t,e,o){const n=v.html,s=Tt();if(!n||n.state.readOnly||!s)return;const r=a.htmlScopeActive&&!!a.htmlFocus,i=r?a.htmlFocus.from:0,c=(r?a.htmlFull:n.state.doc.toString()).slice(s.from,s.openTo),d=o===""?e:`${e}="${o}"`,f=fe(c).find(m=>m.name===e);let h;if(f)h=c.slice(0,f.from)+d+c.slice(f.to);else{const m=c.search(/\s|\/?>$/);h=m===-1?c:`${c.slice(0,m)} ${d}${c.slice(m)}`}h!==c&&(ht(n,[{from:s.from-i,to:s.openTo-i,insert:h}],null),qe(t))}function bd(t,e){const o=v.html,n=Tt();if(!o||o.state.readOnly||!n)return;const s=a.htmlScopeActive&&!!a.htmlFocus,r=s?a.htmlFocus.from:0,l=(s?a.htmlFull:o.state.doc.toString()).slice(n.from,n.openTo),c=fe(l).find(h=>h.name===e);if(!c)return;let d=c.from;for(;d>0&&/\s/.test(l[d-1]);)d-=1;const f=l.slice(0,d)+l.slice(c.to);ht(o,[{from:n.from-r,to:n.openTo-r,insert:f}],null),qe(t)}function ho(t){const e=v.html;if(!e)return[];const n=a.htmlScopeActive&&!!a.htmlFocus?a.htmlFull:e.state.doc.toString(),s=Tt(),r=[],i=ae(re(n),new Set);for(const l of i){if(!s||l.from>s.from||l.to<s.to)continue;const c=fe(n.slice(l.from,l.openTo)).find(d=>d.name==="x-data");c&&r.push(...da(c.value))}return[...new Set(r)]}function yd(t){const e=v.html,o=Tt();if(!e||!o)return[];const s=a.htmlScopeActive&&!!a.htmlFocus?a.htmlFull:e.state.doc.toString(),r=fe(s.slice(o.from,o.openTo)).find(i=>i.name==="x-data");return r?da(r.value):[]}function kd(t,e){const o=t.document;$(o),e.setAttribute("data-open","");const n=ho(),s=o.createElement("div");s.id=k,o.body.appendChild(s),D(t,e,s);const r=!n.length,i=!r&&!yd().length,c=hd.filter(d=>d.id==="state"?!i:!r).flatMap(d=>{const f=jn.filter(h=>h.group===d.id);return f.length?[{value:`\0${d.id}`,label:p(t,r&&d.id==="state"?"alpine_group_state_first":d.lang),heading:!0},...f.map(h=>({value:h.id,label:p(t,h.label),hint:pd(h)}))]:[]});r&&c.push({value:"\0note",label:p(t,"alpine_needs_state"),note:!0}),s._sveApp=H(et,s,{kind:"choices",choices:c,onPick:d=>{const f=jn.find(h=>h.id===d);if($(o),!!f){if(!f.needsName){for(const h of f.attrs)Ko(t,h.name,h.value);return}xd(t,e,f,n)}}})}function xd(t,e,o,n){const s=t.document,r=l=>{const c=String(l||"").trim().replace(/[^\w$]/g,"");if($(s),!!c)for(const d of gd(o.attrs,c))Ko(t,d.name,d.value.replace("|",""))};if(!n.length){po(t,e,r);return}const i=s.createElement("div");i.id=k,s.body.appendChild(i),D(t,e,i),i._sveApp=H(et,i,{kind:"choices",choices:[{value:"\0head",label:p(t,"alpine_name"),heading:!0},...n.map(l=>({value:l,label:l})),{value:"\0new",label:p(t,"alpine_new_name")}],onPick:l=>{if(l==="\0new"){po(t,e,r);return}r(l)}})}function po(t,e,o){const n=t.document;$(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=k,n.body.appendChild(s),D(t,e,s),s._sveApp=H(Ho,s,{label:p(t,"alpine_name"),placeholder:p(t,"alpine_name_placeholder"),onAdd:r=>o(r)})}function qe(t){const o=t?.document.getElementById(u)?.querySelector("[data-sve-alpine-host]");if(!o)return;const n=Tt(),s=v.html,r=a.htmlScopeActive&&!!a.htmlFocus,i=s?r?a.htmlFull:s.state.doc.toString():"",l=n?fe(i.slice(n.from,n.openTo)):[];M.tag=n?.tag||"",M.canEdit=!a.lastLocked&&!!n,M.emptyText=p(t,n?ho().length?"alpine_none_ready":"alpine_none":"alpine_pick"),M.addLabel=p(t,"alpine_add"),M.dropTitle=p(t,"alpine_remove"),M.states=ho(),M.chips=l.filter(c=>c.alpine).map(c=>({id:c.name,name:c.name,value:c.value,title:c.value?`${c.name}="${c.value}"`:c.name})),M.onAdd=c=>kd(t,c.currentTarget),M.onDrop=c=>bd(t,c),M.onChip=(c,d)=>{M.chips.find(h=>h.id===d)&&po(t,c.currentTarget,h=>Ko(t,d,h))},o._sveMounted||(o._sveMounted=!0,ne(o,fd))}const _d=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]),wd=new Set(["html","head","body"]),zn=new Set(["if","unless","style_push","script_push","sve_defaults","once","noparse","foreach","forelse","loop","cache","nocache","scope","collection","nav","structure","taxonomy","users","search:results","form:create","form:errors"]),Sd=new Set(["collection:count"]);function Wn(t){return Sd.has(t)?!1:zn.has(t)||zn.has(t.split(":")[0])}const $d=new Set(["CloseTag","MismatchedCloseTag","IncompleteCloseTag"]),Cd=/^\s*(\/?)\s*([A-Za-z_][A-Za-z0-9_.:-]*)([\s\S]*)$/,Ad=/^\{\{\s*\/?\s*([A-Za-z_][A-Za-z0-9_.:-]*)/,Td=3e5;function Md(t){const e=String(t||""),o=[],n=[];let s=0;for(;s<e.length;){const r=e.indexOf("{{",s);if(r===-1)break;if(e.startsWith("{{#",r)){const d=e.indexOf("#}}",r+3);if(d===-1){n.push(r);break}o.push({from:r,to:d+3,comment:!0,body:""}),s=d+3;continue}let i=0,l=r,c=-1;for(;l<e.length;){if(e.startsWith("{{",l)){i+=1,l+=2;continue}if(e.startsWith("}}",l)){if(i-=1,l+=2,i===0){c=l;break}continue}l+=1}if(c===-1){n.push(r),s=r+2;continue}o.push({from:r,to:c,comment:!1,body:e.slice(r+2,c-2)}),s=c}return{tags:o,unclosed:n}}function Ed(t,e){let o=t;for(const n of e)o=o.slice(0,n.from)+" ".repeat(n.to-n.from)+o.slice(n.to);return o}function Fd(t,e){return t===e||t.startsWith(`${e}:`)}function ge(t,e){return(t.slice(e,e+80).match(/^<\/?([A-Za-z][A-Za-z0-9:-]*)/)?.[1]||"").toLowerCase()}function Ld(t,e,o,n,s){const r=c=>s.has(c.name)&&!/\||\?\?/.test(c.rest);for(const c of o){const d=t.slice(c,c+80).match(Ad)?.[1]||"…";n.push({from:c,to:c+2,key:"code_dock_problem_antlers_unclosed",args:{name:d}})}const i=[],l=[];for(const c of e){if(c.comment)continue;const d=c.body.match(Cd);if(!d)continue;const f=!!d[1],h=d[2].toLowerCase(),m=d[3];if(!f&&(h==="elseif"||h==="else")){let b=-1;for(let y=i.length-1;y>=0;y-=1)if(i[y].name==="if"||i[y].name==="unless"){b=y;break}if(b===-1){n.push({from:c.from,to:c.to,key:"code_dock_problem_branch_stray",args:{name:h}});continue}l.push({from:i[b].to,to:c.from}),i[b]={...i[b],to:c.to},i.length=b+1;continue}if(f||h==="endif"||h==="endunless"){const b=h==="endif"?"if":h==="endunless"?"unless":h;let y=-1;for(let L=i.length-1;L>=0;L-=1)if(Fd(i[L].name,b)){y=L;break}if(y===-1){n.push({from:c.from,to:c.to,key:"code_dock_problem_pair_stray",args:{name:b}});continue}for(const L of i.slice(y+1))Wn(L.name)&&n.push({from:L.from,to:L.to,key:"code_dock_problem_pair_unclosed",args:{name:L.name}});(b==="if"||b==="unless")&&l.push({from:i[y].to,to:c.from}),i.length=y;continue}m.trim().startsWith("=")||i.push({name:h,rest:m,from:c.from,to:c.to})}for(const c of i)Wn(c.name)?n.push({from:c.from,to:c.to,key:"code_dock_problem_pair_unclosed",args:{name:c.name}}):r(c)&&n.push({from:c.from,to:c.to,key:"code_dock_problem_list_unclosed",args:{name:c.name}});return l}function Bd(t,e,o,n){const s=e.parse(t),r=new Set,i=[];s.iterate({enter(l){if(l.name==="MismatchedCloseTag"){i.push({from:l.from,to:l.to,key:"code_dock_problem_tag_stray",args:{tag:ge(t,l.from)}});return}if(l.name==="IncompleteCloseTag"){i.push({from:l.from,to:l.to,key:"code_dock_problem_tag_unfinished",args:{tag:ge(t,l.from)}});return}if(l.type.isError){const h=l.node.parent;h&&(h.name==="OpenTag"||h.name==="CloseTag")&&(r.add(h.from),i.push({from:h.from,to:Math.max(h.from+1,l.from),key:"code_dock_problem_tag_unfinished",args:{tag:ge(t,h.from)}}));return}if(l.name!=="Element")return;let c=null,d=!1;for(let h=l.node.firstChild;h;h=h.nextSibling)h.name==="OpenTag"&&(c=h),$d.has(h.name)&&(d=!0);if(!c||d)return;const f=ge(t,c.from);!f||_d.has(f)||wd.has(f)||o.some(h=>c.from>=h.from&&c.from<h.to&&l.to>h.to)||i.push({from:c.from,to:c.to,key:"code_dock_problem_tag_unclosed",args:{tag:f}})}});for(const l of i)l.key==="code_dock_problem_tag_unclosed"&&r.has(l.from)||l.args.tag&&n.push(l)}function Pd(t,e,o={}){const n=String(t||"");if(!n.trim()||n.length>Td)return[];const s=[];try{const{tags:i,unclosed:l}=Md(n),c=Ld(n,i,l,s,new Set(o.lists||[]));e&&Bd(Ed(n,i),e,c,s)}catch{return[]}const r=new Set;return s.sort((i,l)=>i.from-l.from||i.to-l.to).filter(i=>{const l=`${i.from}:${i.key}`;return r.has(l)?!1:(r.add(l),!0)})}function Id(t,e,o=()=>({})){const n=t.Decoration.mark({class:"sve-cm-problem"}),s=t.StateEffect.define(),r=l=>{const c=Pd(l.doc.toString(),e,o()),d=new t.RangeSetBuilder;let f=0;for(const h of c)h.from<f||h.to<=h.from||(d.add(h.from,h.to,n),f=h.to);return{problems:c,decorations:d.finish()}},i=t.StateField.define({create(l){return r(l)},update(l,c){return c.docChanged||c.effects.some(d=>d.is(s))?r(c.state):l},provide:l=>t.EditorView.decorations.from(l,c=>c.decorations)});return{field:i,relint:s,extensions:[i]}}const Od=new Set(["replicator","grid","list","array","table"]);let _e=new Set,oo=null;function ua(t){return t.document.getElementById(u)?.querySelector("[data-sve-html-problems]")||null}function Dd(t,e,o){const n=ua(t);if(!n)return;const s=e.state.doc,r=o.map(c=>({from:c.from,line:s.lineAt(Math.min(c.from,s.length)).number,text:p(t,c.key,c.args)})),i=r.map(c=>`${c.line}:${c.text}`).join(`
`);if(n.dataset.sveSignature===i||(n.dataset.sveSignature=i,n.hidden=r.length===0,n.replaceChildren(),!r.length))return;const l=t.document.createElement("span");l.setAttribute("data-sve-problems-title",""),l.textContent=p(t,"code_dock_problems_title"),n.appendChild(l);for(const c of r){const d=t.document.createElement("button"),f=t.document.createElement("b");d.type="button",d.dataset.sveProblemAt=String(c.from),f.textContent=p(t,"code_dock_problem_line",{line:c.line}),d.append(f,t.document.createTextNode(` ${c.text}`)),n.appendChild(d)}}function Hd(t){const e=ua(t);!e||e._sveBound||(e._sveBound=!0,e.addEventListener("mousedown",o=>o.preventDefault()),e.addEventListener("click",o=>{const n=o.target.closest("[data-sve-problem-at]"),s=v.html;if(!n||!s)return;o.preventDefault(),o.stopPropagation();const r=Math.min(Number(n.dataset.sveProblemAt)||0,s.state.doc.length);s.dispatch({selection:{anchor:r},effects:B.scrollIntoView(r,{y:"center"})}),s.focus()}))}function jd(t){const e=[],o=n=>{for(const s of n||[])s?.loop&&Od.has(s.type)&&s.var&&!s.parent&&e.push(s.var)};o(t?.section);for(const n of t?.page||[])o(n?.items);return e}function zd(t,e,o){const n={collection:Ss(t),set:$s(a.lastType),view:"",scope:""},s=n.set?Lo(n):"";if(s===oo)return;oo=s;const r=l=>{if(oo!==s)return;const c=new Set(jd(l)),d=c.size===_e.size&&[...c].every(f=>_e.has(f));_e=c,!d&&v.html===e&&t.queueMicrotask(()=>{v.html===e&&e.dispatch({effects:o.of(null)})})};if(!s){r(null);return}const i=Cs(s);if(i){r(i);return}As(t,n).then(r)}function Wd(t){if(!a.htmlLintUi){const{field:e,relint:o}=Id({Decoration:tt,StateField:dt,StateEffect:Rt,RangeSetBuilder:ut,EditorView:B},Fe.parser,()=>({lists:_e})),n=B.updateListener.of(s=>{const r=s.transactions.some(i=>i.effects.some(l=>l.is(o)));!s.docChanged&&!r||(s.docChanged&&zd(t,s.view,o),Dd(t,s.view,s.state.field(e).problems))});a.htmlLintUi={extensions:[e,n]}}return Hd(t),a.htmlLintUi}const Rn=/\{\{\s*(?:vite\b[^}]*|yield_[a-z_]+|theme_tokens)\s*\}\}/g;function Rd(t,e=[]){const o=[];Rn.lastIndex=0;let n;for(;n=Rn.exec(String(t||""));)o.push(n.index,n.index+n[0].length);if(!e||!e.length)return o;const s=[];for(const r of[o,e])for(let i=0;i+1<r.length;i+=2)s.push([r[i],r[i+1]]);return s.sort((r,i)=>r[0]-i[0]||r[1]-i[1]).flat()}const Nd=["input","delete","move"];function qd(t){return Nd.some(e=>t(e))}let no={text:null,ranges:[]};function fa(t){return no.text!==t&&(no={text:t,ranges:Rd(t,t.includes("sve-lock")?ti(t):[])}),no.ranges}function Nn(t,e){const o=new ut,n=fa(t.doc.toString());for(let s=0;s<n.length;s+=2)o.add(n[s],n[s+1],e);return o.finish()}let be=null;function Vd(){if(be)return be;const t=tt.mark({class:"sve-dock-locked"}),e=dt.define({create:n=>Nn(n,t),update:(n,s)=>s.docChanged?Nn(s.state,t):n,provide:n=>B.decorations.from(n)}),o=B.baseTheme({".sve-dock-locked":{opacity:".55",borderRadius:".1875rem",backgroundColor:"rgba(127,127,127,.14)",cursor:"not-allowed"}});return be={extensions:[e,o,oe.changeFilter.of(n=>qd(s=>n.isUserEvent(s))?fa(n.startState.doc.toString()):!0)]},be}function Ud(t,e){if(!t||!e)return t??null;const o=e.mapPos(t.from,1),n=e.mapPos(t.to,-1);return n>o?{from:o,to:n}:null}function Kd(){if(a.cssGhostUi)return a.cssGhostUi;const t=tt.mark({class:"sve-css-ghost"}),e=o=>{const n=new ut;if(!a.lastWin)return n.finish();try{for(const s of xl(o.doc.toString(),bt(a.lastWin)))n.add(s.from,s.to,t)}catch{}return n.finish()};return a.cssGhostUi=dt.define({create:o=>e(o),update:(o,n)=>n.docChanged?e(n.state):o,provide:o=>B.decorations.from(o)}),a.cssGhostUi}let ye=null,Me=null;function Gd(){if(ye)return ye;Me=Rt.define();const t=tt.line({class:"sve-css-id"}),e=o=>{const n=new ut;if(!a.lastWin||!a.cssValues)return n.finish();try{const s=o.doc;for(const r of Se(s.toString(),bt(a.lastWin),a.cssSize)){const i=s.lineAt(Math.min(r.from,s.length)).number,l=s.lineAt(Math.min(Math.max(r.to-1,r.from),s.length)).number;for(let c=i;c<=l;c+=1)n.add(s.line(c).from,s.line(c).from,t)}}catch{}return n.finish()};return ye=dt.define({create:o=>e(o),update:(o,n)=>n.docChanged||n.effects.some(s=>s.is(Me))?e(n.state):o,provide:o=>B.decorations.from(o)}),ye}function Go(){Me&&v.css&&v.css.dispatch({effects:Me.of(null)})}function Xd(){return a.htmlPartialUi||(a.htmlPartialUi=ni({Decoration:tt,StateField:dt,StateEffect:Rt,RangeSetBuilder:ut,EditorView:B})),a.htmlPartialUi}function Yd(){return a.htmlAntlersUi||(a.htmlAntlersUi=td({Decoration:tt,StateField:dt,RangeSetBuilder:ut,EditorView:B})),a.htmlAntlersUi}function Zd(){return a.htmlClassTokenUi||(a.htmlClassTokenUi=wi({Decoration:tt,StateField:dt,StateEffect:Rt,RangeSetBuilder:ut,EditorView:B})),a.htmlClassTokenUi}function Jd(t,e,o){v[e]?.destroy();const n=go.of([{key:"Mod-s",run:()=>(W(t.document),!0)}]);v[e]=new B({state:oe.create({doc:"",extensions:[Pa(),Ia(),Oa(),uc(e),Ju(e),Wa(),za({tooltipClass:()=>"sve-tw-complete"}),...e==="html"?[Fe.data.of({autocomplete:ei(t)}),Fe.data.of({autocomplete:Wl(t)}),Rl(t),oi(Va,t)]:[],...e==="html"?[...gi(),bi()]:[],...e==="css"?[Xa(),Kd(),Gd()]:[],go.of([...Da,...e==="html"?[{key:"Tab",run:yi}]:[],Ha,...ja,...qa,...Ra]),n,B.lineWrapping,...e==="html"||e==="css"?Xd().extensions:[],...e==="html"?Yd().extensions:[],...e==="html"?Wd(t).extensions:[],...e==="html"?Vd().extensions:[],...e==="html"?Zd().extensions:[],Gt[e].of(oe.readOnly.of(!!a.lastLocked)),Xt[e].of(B.editable.of(!a.lastLocked)),B.updateListener.of(s=>{e==="html"&&s.docChanged&&a.htmlAll&&!a.htmlScopeActive&&(a.htmlFocus=Ud(a.htmlFocus,s.changes)),e==="html"&&s.docChanged&&!a.applying&&(fc(),So("dock:html-changed")),e==="css"&&s.docChanged&&!a.applying&&hc(),s.docChanged&&X(t),e==="css"&&(s.docChanged||s.selectionSet)&&E(t),e==="css"&&s.docChanged&&!a.applying&&zt(t),e==="html"&&(s.docChanged||s.selectionSet)&&(We(t),qe(t),lt(t),a.applying||he(t))}),B.domEventHandlers({click:(s,r)=>(e==="html"&&r===v.html&&bc(t),!1)}),...cr(C,{height:"auto",background:"#1E1E21",scroller:{overflow:"visible",height:"auto",minHeight:0},extraTags:s=>[{tag:s.tagName,color:"#4ec9b0"},{tag:s.attributeName,color:"#9cdcfe"},{tag:s.attributeValue,color:"#ce9178"},{tag:s.angleBracket,color:"#808080"}]})]}),parent:o})}function Qd(t){if(!t||t.querySelector(".cm-editor"))return;t.replaceChildren();const e=t.ownerDocument.createElement("span");e.style.cssText="width:16px;height:16px;margin:12px;border:2px solid #858585;border-right-color:transparent;border-radius:50%;display:block;animation:sve-cm-wait .6s linear infinite",t.appendChild(e)}function bt(t){return wo(t).map(e=>({handle:e.handle,base:e.base,max:e.max,media:e.media,media_px:e.media_px,label:e.label}))}function ha(t,e){return bt(t).find(o=>o.handle===e)||null}function Ve(t=a.cssState){return t?t==="before"||t==="after"?`::${t}`:`:${t}`:""}function zt(t,e=!1){const o=v.css;if(!o||!bo||!yo)return;const n=o.state.doc.toString(),s=`${a.cssValues?"1":"0"}|${a.cssSize}|${De(n).map(f=>`${f.from}-${f.to}`).join(",")}`;if(!e&&s===a.cssFoldSig)return;a.cssFoldSig=s;const r=bt(t),i=new Map,l=[...yl(n,r,a.cssSize),...a.cssValues?[]:Se(n,r,a.cssSize).map(f=>({from:f.from,to:f.to}))];for(const f of l)f.to>f.from&&i.set(`${f.from}:${f.to}`,{from:f.from,to:f.to});const c=[],d=new Set;Ya(o.state).between(0,n.length,(f,h)=>{const m=`${f}:${h}`;d.add(m),!i.has(m)&&a.cssOwnFolds.has(m)&&c.push(yo.of({from:f,to:h}))});for(const[f,h]of i)d.has(f)||c.push(bo.of(h));a.cssOwnFolds=new Set(i.keys()),c.length&&o.dispatch({effects:c})}function mo(t,e){const o=a.cssFull||e;return/max-width/i.test(o)&&!/width\s*</i.test(o)&&t.media_px||t.media}function tu(t,e){const o=v.css;if(!o||o.state.readOnly)return;const n=bt(t),s=ha(t,e),r=o.state.doc.toString();if(!s||s.base){const f=o.state.selection.main.head,h=De(r).find(m=>f>=m.from&&f<=m.to);h&&o.dispatch({selection:{anchor:h.from},scrollIntoView:!0});return}const i=Po(r,n,e);if(i.length){const f=i[0],h=Math.min(f.bodyTo,f.bodyFrom+(r.slice(f.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);o.dispatch({selection:{anchor:h},scrollIntoView:!0});return}const l=mo(s,r),c=pa(o,r),d=`

${c.indent}@media ${l} {
${c.indent}    
${c.indent}}${c.suffix}`;o.dispatch({changes:{from:c.at,to:c.at,insert:d},selection:{anchor:c.at+d.lastIndexOf("    ")+4},scrollIntoView:!0})}function pa(t,e){const o=De(e);if(o.length){const i=o[o.length-1];return{at:i.to,indent:_t(e,i.from),suffix:""}}const n=i=>({at:i.to,indent:_t(e,i.to)||`${_t(e,i.open)}    `,suffix:`
${_t(e,i.open)}`}),s=Re();if(s)return n(s);const r=eu(e);return r?n(r):{at:e.length,indent:"",suffix:""}}function eu(t){const e=String(t||"");let o=null,n=0,s=0;for(;n<e.length;){if(e[n]==="}"||e[n]===";"){n+=1,s=n;continue}if(e[n]!=="{"){n+=1;continue}const r=Mo(e,n);if(r===-1||o||(o=e.slice(s,n).trim().startsWith("@")?null:{from:s,open:n,to:r},!o))return null;n=r+1,s=n}return o}function ou(t,e){const o=e===a.cssSize?"":e;a.cssSize=o,q(t,Zo,o),rt("lp:set-device",{win:t,key:o?yr(o,t):"Responsive"}),o&&tu(t,o),a.cssValues&&va(t),zt(t,!0),Go(),lt(t),E(t)}function nu(t,e){a.cssState=Jo.includes(e)?e:"",q(t,vo,a.cssState),$(t.document),lt(t),E(t)}function su(t,e){const o=t.document;$(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=k,o.body.appendChild(n),D(t,e,n),n._sveApp=H(et,n,{kind:"choices",choices:[{value:"",label:p(t,"css_state_none"),active:!a.cssState},...Jo.map(s=>({value:s,label:Ve(s),active:s===a.cssState}))],onPick:s=>nu(t,s)})}function lt(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-css-head]");if(!o)return;const n=Tt(),s=bt(t),r=v.css?.state.doc.toString()??"";S.tag=n?.tag||"",S.scope=si(n?vt().slice(n.from,n.openTo):"")||"",e.toggleAttribute("data-sve-css-unnamed",a.styleMode!=="tw"&&!S.scope);const i=S.scope,l=Oo(t,i);S.scopeElsewhere=[...new Set(l.map(c=>String(c.file).replace(/^.*\//,"")))],S.scopeElsewhereTitle=S.scopeElsewhere.length?`${p(t,"class_defined_in",{file:S.scopeElsewhere.join(", ")})} — ${p(t,"class_defined_import")}`:"",S.onScopeImport=()=>{Do(t,i)&&lt(t)},i&&!Bs()&&Io(t).then(()=>lt(t)),S.note=a.cssPane==="empty"?p(t,"css_pane_empty"):"",S.canEdit=!a.lastLocked,S.onTag=c=>ai(t,c.currentTarget,n),S.state=a.cssState,S.stateLabel=a.cssState?Ve(a.cssState):p(t,"css_state"),S.onState=c=>su(t,c.currentTarget),S.onSize=c=>ou(t,c),S.sizes=[{key:"",label:p(t,"tw_size_all"),title:p(t,"css_size_all_title"),active:!a.cssSize},...s.map(c=>{const d=c.base||Po(r,s,c.handle).length>0;return{key:c.handle,label:c.label,title:c.base?p(t,"css_size_base_title"):`@media ${c.media}${d?"":`  ·  ${p(t,"css_size_new")}`}`,active:a.cssSize===c.handle}})],o._sveMounted||(o._sveMounted=!0,ne(o,El))}Be("lp:device",t=>{const e=a.lastWin;if(!e||!xa(e.document))return;const o=wo(e).find(n=>n.device===t)?.handle||"";o!==a.cssSize&&(a.cssSize=o,q(e,Zo,o),zt(e,!0),Go(),lt(e),E(e))});function au(t){const e=Math.max(0,Math.round(Date.now()/1e3-t)),o=new Date(t*1e3).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});let n=o;try{const s=new Intl.RelativeTimeFormat(void 0,{numeric:"auto"});e<90?n=s.format(-e,"second"):e<5400?n=s.format(-Math.round(e/60),"minute"):e<86400?n=s.format(-Math.round(e/3600),"hour"):n=s.format(-Math.round(e/86400),"day")}catch{}return`${n} · ${o}`}function ma(t,e){return t.fetch(e,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}})}async function ru(t,e){const o=t.document,n=yt();if($(o),!n)return;let s=[];try{const i=await ma(t,`/!/sve/section-template/history?type=${encodeURIComponent(n)}`);i.ok&&(s=(await i.json())?.entries||[])}catch{s=[]}if(!o.getElementById(u)||!o.contains(e))return;e.setAttribute("data-open","");const r=o.createElement("div");r.id=k,o.body.appendChild(r),D(t,e,r),r._sveApp=H(et,r,{kind:"choices",choices:s.length?s.map(i=>({value:i.id,label:au(i.at)})):[{value:"",label:p(t,"code_dock_history_empty")}],onPick:i=>{$(o),i&&iu(t,n,i)}})}async function iu(t,e,o){if(ct())return;let n=null;try{const s=await ma(t,`/!/sve/section-template/history/entry?type=${encodeURIComponent(e)}&id=${encodeURIComponent(o)}`);s.ok&&(n=await s.json())}catch{n=null}!n||ct()||(jt({html:n.html??"",css:n.css??"",js:n.js??""},a.lastLocked),X(t),he(t))}function Bt(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-code-strip]");if(!e)return;e.hidden=a.styleMode!=="tw";const o=bs(t);e.innerHTML=Ef,e.title=p(t,o?"tw_strip_on":"tw_strip_off"),e.setAttribute("aria-label",e.title),e.setAttribute("aria-pressed",o?"true":"false")}function lu(t,e){const o=e.querySelector("[data-sve-code-strip]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),ri(t,!bs(t)),Bt(t),ii(t)}),Bt(t))}function cu(t,e){const o=e.querySelector("[data-sve-code-history]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=Ff,o.title=p(t,"code_dock_history"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),o.hasAttribute("data-open")){$(t.document);return}ru(t,o)}))}function dh(){return a.styleMode}function du(t){return a.styleMode==="tw"?Tt():null}function Tt(t){const e=v.html;if(!e)return null;const o=a.htmlScopeActive&&!!a.htmlFocus,n=o?a.htmlFull:e.state.doc.toString(),r=(o?a.htmlFocus.from:0)+e.state.selection.main.from,i=ae(re(n),new Set);let l=null;for(const c of i)c.from<=r&&r<c.to&&(l=c);return l}function he(t){a.styleMode==="tw"&&li(t,du())}function Xo(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-values-mode]");if(!e||!o)return;e.setAttribute("data-sve-values",a.cssValues?"on":"off");const n=t.document.createElement("span");n.textContent=p(t,"code_dock_values"),o.innerHTML=Bf,o.appendChild(n),o.title=p(t,a.cssValues?"code_dock_values_off":"code_dock_values_on"),o.setAttribute("aria-label",o.title),o.setAttribute("aria-pressed",a.cssValues?"true":"false")}function va(t){const e=v.css;if(!e||e.state.readOnly)return;const o=bt(t),n=e.state.doc.toString(),s=Se(n,o,a.cssSize);if(e.focus(),s.length){const m=s[0],b=Math.min(m.bodyTo,m.bodyFrom+(n.slice(m.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);e.dispatch({selection:{anchor:b},scrollIntoView:!0});return}const r=ha(t,a.cssSize);if(!r||r.base){const m=`#id-{{ id }} {
    `;e.dispatch({changes:{from:0,to:0,insert:`${m}
}

`},selection:{anchor:m.length},scrollIntoView:!0});return}const i=Po(n,o,a.cssSize)[0];if(i){const m=`${_t(n,i.from)}    `,b=`
${m}#id-{{ id }} {
${m}    `;e.dispatch({changes:{from:i.bodyFrom,to:i.bodyFrom,insert:`${b}
${m}}
`},selection:{anchor:i.bodyFrom+b.length},scrollIntoView:!0});return}const l=pa(e,n),c=`${l.indent}    `,d=Se(n,o,"").some(m=>l.at>m.bodyFrom&&l.at<=m.bodyTo),f=d?`

${l.indent}@media ${mo(r,n)} {
${c}`:`

${l.indent}@media ${mo(r,n)} {
${c}#id-{{ id }} {
${c}    `,h=d?`
${l.indent}}${l.suffix}`:`
${c}}
${l.indent}}${l.suffix}`;e.dispatch({changes:{from:l.at,to:l.at,insert:`${f}${h}`},selection:{anchor:l.at+f.length},scrollIntoView:!0})}function uu(t,e){a.cssValues=!!e,q(t,rn,a.cssValues?"1":"0"),$(t.document),a.cssOpenTool="",Xo(t),V(),gt(),a.cssValues&&va(t),zt(t,!0),Go(),lt(t),E(t)}function Yo(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-css-all]");if(!e||!o)return;e.setAttribute("data-sve-css-all-on",a.cssAll?"on":"off");const n=t.document.createElement("span");n.textContent=p(t,"code_dock_css_all"),o.innerHTML=js,o.appendChild(n),o.title=p(t,a.cssAll?"code_dock_css_all_off":"code_dock_css_all_on"),o.setAttribute("aria-label",o.title),o.setAttribute("aria-pressed",a.cssAll?"true":"false")}function fu(t,e){a.cssAll=!!e,$(t.document),a.cssOpenTool="",Yo(t),V(),gt(),zt(t,!0),lt(t),E(t)}function Ue(t){const e=t?.document.getElementById(u);if(!e)return;const o=a.styleMode==="tw";e.setAttribute("data-sve-style",a.styleMode);const n=e.querySelector("[data-sve-css-label]");n&&(n.textContent=o?p(t,"code_dock_style_tw"):p(t,"code_dock_css"));const s=e.querySelector("[data-sve-style-mode]");if(!s)return;const r=t.document.createElement("span");r.textContent=o?p(t,"code_dock_style_tw"):p(t,"code_dock_css"),s.innerHTML=o?Pf:Lf,s.appendChild(r),s.title=p(t,o?"code_dock_style_to_css":"code_dock_style_to_tw"),s.setAttribute("aria-label",s.title),s.setAttribute("aria-pressed",o?"true":"false")}function ga(t){t?.document.getElementById(u),$(t.document),ro(t),a.cssOpenTool="",a.cssOpenMenu="",a.styleMode==="tw"&&a.cssValues&&(a.cssValues=!1,q(t,rn,"0")),Ue(t),Xo(t),Yo(t),Bt(t),a.cssToolRow?.(),a.styleMode==="tw"&&(a.htmlScopePref=!0,q(t,Ge,"1"),co(t,!0)),he(t),qe(t),E(t)}const Zo="sve-css-size",vo="sve-css-state",Jo=["hover","focus","focus-visible","active","disabled","before","after"],qn="data-sve-scroll-edge";function Qo(t){if(!t||t._sveEdges)return;t._sveEdges=!0;const e=()=>pu(t),o=new ResizeObserver(e),n=()=>{for(const s of t.children)o.observe(s)};t.addEventListener("scroll",e,{passive:!0}),o.observe(t),n(),new MutationObserver(()=>{n(),e()}).observe(t,{childList:!0}),e()}function hu(t,e){if(!t||t._sveEdgesIn)return;t._sveEdgesIn=!0;const o=()=>t.querySelectorAll(e).forEach(Qo);o(),new MutationObserver(o).observe(t,{childList:!0,subtree:!0})}function pu(t){const e=t.scrollWidth-t.clientWidth,o=t.scrollLeft>1,n=e-t.scrollLeft>1,s=o&&n?"both":o?"left":n?"right":"";s?t.setAttribute(qn,s):t.removeAttribute(qn)}function mu(t,e){a.styleMode=e==="tw"?"tw":"css",q(t,er,a.styleMode),ga(t)}function vu(t,e){if(e._sveStyleModeBound)return;e._sveStyleModeBound=!0,a.styleMode=Y(t,er)==="tw"?"tw":"css";const o=Y(t,Zo)||"";a.cssSize=wo(t).some(n=>n.handle===o)?o:"",a.cssState=Jo.includes(Y(t,vo))?Y(t,vo):"",a.cssValues=Y(t,rn)==="1",e.querySelector("[data-sve-style-mode]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),mu(t,a.styleMode==="tw"?"css":"tw")}),e.querySelector("[data-sve-values-mode]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),uu(t,!a.cssValues)}),e.querySelector("[data-sve-css-all]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),fu(t,!a.cssAll)}),ga(t),Xo(t),Yo(t)}function gu(t,e){const o=e.querySelector("[data-sve-css-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=r=>e.querySelector(`[data-sve-css-tool="${r}"], [data-sve-css-kid="${r}"]`),s=r=>{const i=n(r.id),l=a.cssOpenMenu===r.id;if($(t.document),l){ro(t),E(t);return}if(!i)return;const c=a.styleMode==="tw"?!r.twClass&&(!!r.tw||!!r.twGroup):!r.kind&&!r.value&&!(r.css in J())&&!!r.menu,d=()=>{c&&(a.cssOpenMenu=r.id)},f=()=>{a.cssOpenTool="",E(t)};if(a.styleMode==="tw"){ro(t),r.twClass?(ci(t,r.twClass),E(t)):r.twGroup?(di(t,i,r.title,r.twGroup,f),d(),E(t)):r.tw&&(ui(t,i,r.tw,f),d(),E(t));return}if(r.kind==="flexDir"){Nc(r.value);return}if(r.kind==="display"){qc(r.value);return}if(r.value){const h=P(J()[r.css])===P(r.value);G([{property:r.css,value:h?null:r.value}]);return}if(r.css in J()){G([{property:r.css,value:null}]),E(t);return}r.menu==="colors"?Kc(t,i,r.css):r.menu==="spacing"?Xc(t,i,r.css):r.menu==="sizes"?Pn(t,i,r.css,Wf):r.menu==="choices"?Gc(t,i,r.css,r.choices):r.menu==="values"&&Pn(t,i,r.css),d(),E(t)};ft.onTool=r=>{const i=Le.get(r)?.tool;if(i){if(i.kids?.length){a.cssOpenTool=a.cssOpenTool===i.id?"":i.id,$(t.document),E(t);return}s(i)}},ft.onKid=(r,i)=>{const l=Le.get(i);l?.kid&&s(l.kid)},a.cssToolRow=()=>{ne(o,ml),E(t)},a.cssToolRow(),Qo(o),hu(o,"[data-sve-css-kids]"),t.document.addEventListener("mousedown",r=>{r.target.closest(`#${k}, [data-sve-css-tools], [data-sve-html-tools], [data-sve-css-add-class]`)||$(t.document)},!0)}function bu(t,e){const o=e.querySelector("[data-sve-html-tidy]");o&&(o.innerHTML=ys.tidy,o.title=p(t,"code_dock_html_tidy"),o.setAttribute("aria-label",o.title),o.setAttribute("data-tip",o.title))}function yu(t,e){const o=e.querySelector("[data-sve-html-tidy]");bu(t,e),!(!o||o._sveBound)&&(o._sveBound=!0,o.addEventListener("mousedown",n=>n.preventDefault()),o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Zs()}))}function ku(t,e){const o=e.querySelector("[data-sve-html-tools]");!o||o._sveBound||(o._sveBound=!0,ne(o,cl,{tools:ko.map(n=>({...n,icon:ys[n.id]||""})),onTool:n=>{const s=ko.find(i=>i.id===n),r=o.querySelector(`[data-sve-html-tool="${n}"]`);if(s){if(s.menu==="heading"){En(t,r,sr);return}if(s.menu==="text"){En(t,r,Cr);return}if(s.tidy){Zs();return}if(s.menu==="component"){Ic(t,r);return}if($(t.document),s.action==="pagination"){Bc();return}if(s.snippet){Ys(s.snippet,s.caret??s.snippet.length,s.select),I();return}Js(s.tag)}}}),Qo(o),Ku(t,e),Xu(t,e),Uu(t,e))}A("dock:save-now",()=>(W(a.lastWin?.document),!0));let ke=null;async function xu(t){const e=t.document;sf(e);let o=e.getElementById(u);if(o&&!(o.querySelector('[data-sve-css-chrome="subrow-2"]')&&o.querySelector("[data-sve-css-add-class]")&&o.querySelector("[data-sve-html-tools]")&&o.querySelector("[data-sve-html-tidy]")&&o.querySelector("[data-sve-data-vars]")&&o.querySelector("[data-sve-visual-edit-tools]")&&o.querySelector("[data-sve-html-scope]")&&o.querySelector("[data-sve-code-lock]")&&o.querySelector("[data-sve-code-back]")&&o.querySelector("[data-sve-code-autosave]")&&o.querySelector("[data-sve-code-save]")&&o.getAttribute("data-sve-code-chrome")==="scope-9")){for(const s of st)v[s]?.destroy(),v[s]=null;o.remove(),o=null}if(!o){o=e.createElement("div"),o.id=u,o.setAttribute("data-sve-code-chrome","scope-9"),Object.defineProperty(o,"__sveSavedCss",{get:()=>a.lastParts?.css??""}),Er(o,Fr(t)),ne(o,nl,{htmlLabel:p(t,"code_dock_html"),cssLabel:p(t,"code_dock_css"),jsLabel:p(t,"code_dock_js"),alpineLabel:p(t,"code_dock_alpine"),treeIcon:nr,dataIcon:Sf,dataLabel:p(t,"data_vars_title")}),ao(e,o),Gn(o),Fa(o,Aa(t)),ff(t,o),pf(t,o),hf(t,o),gu(t,o),Dc(t,o),vu(t,o),cu(t,o),lu(t,o),Lr(t,o),ku(t,o),An(t,o),$n(t,o),Xn(t,o),Cn(t,o);for(const n of st){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);Qd(s)}Br(t)}if(ao(e,o),Gn(o),yu(t,o),An(t,o),$n(t,o),Xn(t,o),Cn(t,o),cf(t),en(t),St(t),R(t),Ot(t),Q(t),Ue(t),Bt(t),await vf(),!v.html){for(const n of st){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);s?.replaceChildren(),Jd(t,n,s)}for(const n of["html","css"])v[n]&&fi(t,v[n],{onOpen:s=>Ws(t,s),emptyLabel:p(t,"code_dock_partials_empty"),openLabel:s=>p(t,"component_open_named",{name:s}),sectionValues:()=>zs(t),isLocked:()=>ct(),setHover:(s,r)=>a.htmlPartialUi?.setHover(s,r)});Ci(t,v.html,{onRename:n=>vc(t,n),isLocked:()=>ct(),setHover:(n,s)=>a.htmlClassTokenUi?.setHover(n,s),title:p(t,"code_dock_css_rename_class")})}return o}function tn(t){return ke||(ke=xu(t).finally(()=>{ke=null})),ke}async function Vn(t,e){const o=await tn(t);a.lastType=e,a.lastLocked=!0,a.lockReady=!0,a.lastParts={html:"",css:"",js:""},de(),St(t),jt(a.lastParts,!0),sn(t.document,e),O(t.document,p(t,"code_dock_missing")),R(t),Ot(t),Q(t),It(t,o)}let Un=-1;async function ba(t,e){if(Un===a.loadGen&&!a.lastType&&t.document.getElementById(u))return;W(e);const o=++a.loadGen;Un=o,a.lastType=null,a.typeStack=[],a.lastParts={html:"",css:"",js:""},a.lastProps=[],a.propsDirty=!1,a.lastLocked=!1,a.lockReady=!1,a.loadInFlight=null,Os(),de();const n=await tn(t);o===a.loadGen&&(jt(a.lastParts,!0),Bo(t),Pe(t),Eo(t),sn(t.document,""),O(t.document,p(t,kr(t,t.document)?"code_dock_pick_section":"code_dock_open_template")),St(t),R(t),Ot(t),Q(t),Ue(t),Bt(t),It(t,n))}function ya(t){return Zt(t,a.lastType)||Zt(t,a.typeStack[0])}function _u(t,e,o){if(o==="replace"){if(!Zt(t,e)){a.beforePart=null;return}ya(t)||(a.beforePart={type:a.lastType||"",uid:a.lastUid||"",stack:[...a.typeStack],onEmptyPage:!!a.onEmptyPage})}}function ka(t,e){if(!ya(t))return!1;const o=a.beforePart,n=o?.type||"",s=o?.stack[0]||n,r=!!(n&&o.uid&&wa(t,e,o.uid)===s),i=!!(n&&n.startsWith("view:")&&s.startsWith("view:"));return a.beforePart=null,a.lastWin=t,W(e),!r&&!i?(a.lastUid=null,a.onEmptyPage=!0,ba(t,e),!0):(a.lastUid=o.uid||null,a.onEmptyPage=o.onEmptyPage,Wt(t,n,"replace"),a.typeStack=[...o.stack],!0)}async function Wt(t,e,o="replace"){_u(t,e,o),o==="replace"?a.typeStack=[]:o==="push"&&a.lastType&&a.lastType!==e&&a.typeStack.push(a.lastType);const n=++a.loadGen;a.lastType=e,a.lockReady=!1,de(),O(t.document,p(t,"code_dock_loading"));let s=()=>{};a.loadInFlight=new Promise(i=>{s=i});const r=await tn(t);St(t),R(t),Ot(t),Q(t),Ue(t),Bt(t),It(t,r),t.fetch(`/!/sve/section-template?type=${encodeURIComponent(e)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async i=>{if(n!==a.loadGen)return;if(i.status===404){Vn(t,e);return}if(!i.ok)throw new Error(String(i.status));const l=await i.json();n===a.loadGen&&(a.lastParts={html:typeof l.html=="string"?l.html:"",css:typeof l.css=="string"?l.css:"",js:typeof l.js=="string"?l.js:""},a.lastProps=Array.isArray(l.props)?l.props:[],a.propsDirty=!1,a.lastType=e,a.lastLocked=!!l.locked,a.lockReady=!0,Os(),typeof l.tw=="string"&&l.tw!==""&&dc(a.lastParts.html,l.tw),St(t),jt(a.lastParts,a.lastLocked),Eo(t),a.lastLocked||Ds(t,a.lastParts.html),sn(t.document,l.path||e),O(t.document,a.lastLocked?p(t,"code_dock_locked"):""),l.writable?.template===!1?O(t.document,p(t,"code_dock_not_writable")):l.writable?.tw===!1&&O(t.document,p(t,"code_dock_tw_not_writable")),Bo(t),rl(t),Pe(t),R(t),Ot(t),Q(t),It(t,r))}).catch(()=>{n===a.loadGen&&(Vn(t,e),O(t.document,p(t,"code_dock_error")))}).finally(()=>{n===a.loadGen&&(a.loadInFlight=null),s()})}function yt(){return a.lastType||""}function xa(t){return!!t?.getElementById(u)}function ct(){return a.lastLocked}function wu(t,e){const o=typeof e?.html=="string"?e.html.trim():"",n=typeof e?.css=="string"?e.css.trim():"",s=typeof e?.js=="string"?e.js.trim():"";if(!o&&!n&&!s||!t?.document?.getElementById(u))return!1;let r=!1;return o&&(r=Su("html",o)||r),n&&(r=Kn("css",n)||r),s&&(r=Kn("js",s)||r),r&&X(t),r}function Su(t,e){const o=v[t];if(!o||o.state.readOnly)return!1;const n=o.state.selection.main,s=n.from>0?o.state.doc.sliceString(n.from-1,n.from):`
`,r=n.to<o.state.doc.length?o.state.doc.sliceString(n.to,n.to+1):`
`,c=`${s===`
`?"":`
`}${e}${r===`
`?"":`
`}`;return o.dispatch({changes:{from:n.from,to:n.to,insert:c},selection:{anchor:n.from+c.length}}),!0}function Kn(t,e){const o=v[t];if(!o||o.state.readOnly)return!1;const n=o.state.doc.length,r=`${n>0&&o.state.doc.sliceString(Math.max(0,n-1),n)!==`
`?`

`:n?`
`:""}${e}
`;return o.dispatch({changes:{from:n,insert:r},selection:{anchor:n+r.length}}),!0}function $u(t){if(Ce(t),!a.lastType||!t.document.getElementById(u))return;const e=a.lastType;a.lastType=null,Wt(t,e,"keep")}function _a(t){N(t),a.loadGen+=1,W(t),a.lastUid=null,a.lastType=null,a.typeStack=[],a.beforePart=null,a.lastParts={html:"",css:"",js:""},a.lastLocked=!1,a.lockReady=!1,a.lastBracketNames=null,a.lastCssSelectorNames=null,de(),a.lastWin=t?.defaultView||a.lastWin,$(t),ms(t),nt(t),t?.getElementById(K)?.remove();for(const o of st)v[o]?.destroy(),v[o]=null;t?.getElementById(u)?.remove(),lf(),t&&on(t,0);const e=t?.defaultView||a.lastWin;e?.document.getElementById(Jn)&&ns(e),e&&(Bo(e),Pe(e),Eo(e))}function Cu(t){if(a.dragging)return;const e=t.document.getElementById(u);e&&(en(t),It(t,e))}function wa(t,e,o){if(o){const r=hn(o,e)||hn(o,t.document)||o;return String(typeof Qe=="function"&&(Qe(r,e)||Qe(r,t.document))||"").trim()}const n=typeof Yt=="function"?Yt(t):"page_sections",s=typeof U=="function"?U(t.document):[];for(const r of s){const l=(mt(r.values)||r.values)?.[n];if(Array.isArray(l))for(const c of l){const d=typeof c?.type=="string"?c.type.trim():"";if(d)return d}}return""}function Ke(t){if((t.Statamic?.$config?.get?.("sveFeatures")||{}).collection_templates!==!0)return"";const o=t.Statamic?.$config?.get?.("sveCollectionTemplatesCollection")||"templates";if(!(t.location?.pathname||"").includes(`/collections/${o}/entries/`))return"";const s=typeof U=="function"?U(t.document):[];for(const r of s){const i=mt(r.values)||r.values,l=typeof i?.view=="string"?i.view.trim():"";if(!l||l.includes(".."))continue;const c=l.replace(/\.(antlers\.html|blade\.php)$/i,"").replace(/^\/+|\/+$/g,"");if(c)return`view:${c}`}return""}function Au(t,e,o){const n=t.Statamic?.$config?.get?.("sveChromeTemplates")||{},s=n[e]&&typeof n[e].type=="string"?n[e]:null,r=t.Statamic?.$config?.get?.("sveChromeStyles")||{},i=`${e}/${typeof r[e]=="string"&&r[e]!==""?r[e]:"style_1"}`,l=s?.type||i,c=o?.[`${e}_style`];return(!s||s.styled)&&typeof c=="string"&&c!==""?`${e}/${c}`:l}function Tu(){const t=yt();if(!t)return"";if(t===Qn)return"main";if(a.lastWin&&t===Ke(a.lastWin))return"template";const e=t.match(/^(header|footer)\//);if(e)return e[1];const o=a.lastWin?.Statamic?.$config?.get?.("sveChromeTemplates")||{};return["header","footer"].find(n=>o[n]?.type===t)||""}function Mu(t){const e=as||rs;return e!=="header"&&e!=="footer"?"":$o(t)||Co(t)?e:""}function Eu(t,e){const o=as||rs;return o!=="header"&&o!=="footer"||!$o(e)&&!Co(e)?"":Au(t,o,mt(Mr()?.values)||{})}function Fu(t,e){if(!e||String(e).startsWith("view:")||Zt(t,e))return!1;const o=typeof Yt=="function"?Yt(t):"page_sections",n=typeof U=="function"?U(t.document):[];for(const s of n){const i=(mt(s.values)||s.values)?.[o];if(Array.isArray(i)&&i.some(l=>l?.type===e))return!0}return!1}function Lu(t){const e=ss(t)||t.getElementById("__sve-global-section-host");return e&&e.querySelector("[data-replicator-set][data-type]")?.getAttribute("data-type")||""}function uh(t,e,o){if(a.dragging)return;const n=!!(o&&o!==a.lastUid);if(o&&(a.lastUid=o),!t||!e||Qu(e)||!Ar(t)||!Tr(t)){e&&_a(e);return}const s=!o&&!!a.lastType&&a.lastType!==Qn&&!$o(e)&&!Co(e)&&!ss(e)&&!Fu(t,a.lastType);if(s&&ka(t,e))return;s&&(a.lastUid=null);const r=o||a.lastUid||"",i=Eu(t,e)||Lu(e)||(r?wa(t,e,r):"")||Ke(t)||(!o&&!s?a.lastType:""),l=!i&&!o,c=l,d=i;if(a.onEmptyPage=l,a.lastWin=t,c){ba(t,e);return}if(d&&!(d===a.lastType&&e.getElementById(u))){if(a.typeStack.length&&a.lastType&&a.lastType!==d){const f=a.typeStack[0];if(d===f&&!n)return;a.typeStack=[]}W(e),Wt(t,d,"replace")}}Be("tw:changed",()=>{a.lastWin&&a.styleMode==="tw"&&E(a.lastWin)});A("dock:is-open",t=>xa(t));A("dock:is-locked",()=>ct());A("dock:html",()=>vt());A("dock:reveal-html",({from:t,to:e,caret:o}={})=>{const n=v.html;if(!n||t==null)return;a.htmlScopePref=ie(a.lastWin),At(),V();const s=a.htmlFull.length,r=Math.max(0,Math.min(t,s)),i=Math.max(r,Math.min(e??t,s));a.htmlFocus=i>r?{from:r,to:i}:null,a.cssFocus=null,a.cssAll=!1;const l=o==null?null:Math.max(0,Math.min(o,s));if(a.htmlScopePref&&a.htmlFocus){ze(l),R(a.lastWin);return}if(a.htmlScopeActive){No(!0,l),R(a.lastWin);return}n.dispatch({selection:l==null?{anchor:r,head:i}:{anchor:l},scrollIntoView:!0}),n.focus()});A("dock:insert-snippet",({win:t,parts:e})=>wu(t,e));A("dock:refresh",t=>$u(t));A("dock:tw-follow",()=>{a.lastWin&&he(a.lastWin)});A("dock:css",()=>(V(),a.cssFull));A("dock:set-css",t=>typeof t!="string"||ct()||!v.css||!a.lastWin?!1:(V(),a.cssFull=t,le("css",ta()),X(a.lastWin),!0));A("dock:js",()=>v.js?.state.doc.toString()??"");A("dock:set-js",t=>typeof t!="string"||ct()||!v.js||!a.lastWin?!1:(le("js",t),X(a.lastWin),!0));A("dock:data-menu",({anchor:t,onPick:e,at:o}={})=>!t||!a.lastWin?!1:(N(a.lastWin.document),$(a.lastWin.document),Sa(a.lastWin,t,e,o),!0));A("dock:props",()=>a.lastProps.map(t=>({...t})));A("dock:set-props",({win:t,props:e}={})=>!Array.isArray(e)||ct()?!1:(a.lastProps=e,a.propsDirty=!0,hi(pe(yt())),W((t||a.lastWin)?.document),!0));function pe(t){const e=/^view:partials\/(components\/[A-Za-z0-9_-]+)$/.exec(String(t||""));return e?e[1]:""}A("dock:component-src",()=>pe(yt()));A("dock:type-stack",()=>a.typeStack.map(t=>({type:t,src:pe(t)})));A("dock:component-exit-state",()=>{const t=pe(yt());return{open:!!t,name:t?t.split("/").pop():"",back:a.typeStack.length>0}});A("dock:exit-component",(t=1)=>{if(!a.lastWin||!pe(yt()))return!1;if(a.typeStack.length){for(let e=Number(t)||1;e>1&&a.typeStack.length>1;e-=1)a.typeStack.pop();Rs(a.lastWin)}else _a(a.lastWin.document);return!0});A("dock:current-type",()=>yt());A("dock:on-empty-page",()=>!!a.onEmptyPage);A("dock:current-uid",()=>a.lastUid);A("dock:leave-part",()=>{const t=a.lastWin;return t?(ka(t,t.document),!0):!1});A("dock:chrome-kind",()=>Tu());A("dock:collection-view",()=>a.lastWin?Ke(a.lastWin):"");A("dock:chrome-open",t=>Mu(t));A("dock:save-settled",()=>a.saveInFlight||null);A("dock:load-settled",()=>a.loadInFlight||null);A("dock:reset-data-vars",t=>(Ti(typeof t=="string"&&t?t:void 0),!0));A("dock:refresh-preview",()=>a.lastWin?(Ce(a.lastWin),!0):!1);A("dock:open-file",t=>typeof t!="string"||!t||!a.lastWin?!1:(a.onEmptyPage=!1,t===a.lastType||(W(a.lastWin.document),Wt(a.lastWin,t,"replace")),!0));A("dock:open-template",t=>typeof t!="string"||!t||!a.lastWin?!1:(Ws(a.lastWin,t),!0));A("dock:set-html",t=>{const e=t&&typeof t=="object"?t:{},o=t&&typeof t=="object"?t.html:t;if(typeof o!="string"||ct())return!1;if(o!==""&&!gs(vt(),o)){const i=a.lastWin;if(!(e?.unlock===!0&&i?.Statamic?.$permissions?.has?.("configure fields")===!0))return i?.Statamic?.$toast?.error(p(i,"html_tree_locked_element")),!1}const n=v.html;if(!n||!a.lastWin)return!1;if(o===""){a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null),a.twDirty=!1,a.twCss=null,a.twKey="",a.lastType=null,a.lastUid=null,a.lastParts={html:"",css:"",js:""},a.cssFull="",a.htmlFull="",a.applying=!0;try{de();for(const i of st){const l=v[i];if(!l)continue;const c=l.state.doc.toString();c!==""&&l.dispatch({changes:{from:0,to:c.length,insert:""}})}}finally{a.applying=!1}return!0}const s=a.htmlFull;if(a.htmlFull=o,a.htmlScopeActive)return a.htmlFocus=Bu(a.htmlFocus,s,o),ce(Vs()),X(a.lastWin),So("dock:html-changed"),!0;const r=n.state.doc.toString();if(r!==o){const[i,l,c]=Wo(r,o);n.dispatch({changes:{from:i,to:l,insert:c}})}return!0});A("dock:show-empty",()=>rt("dock:set-html",""));Be("row:removed",({parentPath:t,remaining:e,win:o})=>{e===0&&t===Yt(o)&&rt("dock:show-empty")});function Bu(t,e,o){const n=o.length-e.length;if(!t||!n)return t;let s=0;for(;s<e.length&&s<o.length&&e[s]===o[s];)s+=1;return s>=t.to?t:s<t.from?{from:Math.max(0,t.from+n),to:Math.max(0,t.to+n)}:{from:t.from,to:Math.max(t.from,t.to+n)}}const Pt="__sve-data-menu";let Ee=null;function N(t){const e=t?.getElementById(Pt);Ee?.(),Ee=null,e?._sveApp?.unmount(),e?.remove(),t?.querySelectorAll("[data-sve-data-vars][data-open], [data-sve-antlers-btn][data-open], [data-sve-visual-edit-btn][data-open]").forEach(o=>o.removeAttribute("data-open"))}function Pu(t){if(!Ke(t))return{view:"",kind:""};const e=typeof U=="function"?U(t.document):[];for(const o of e){const n=mt(o.values)||o.values,s=typeof n?.source_collection=="string"?n.source_collection.trim():"";if(s)return{view:s,kind:String(n?.kind||"").trim()}}return{view:"",kind:""}}function Iu(t,e){const o=vt();if(Number.isFinite(e))return bn(o,e);const n=v.html;if(!n)return[];const s=a.htmlScopeActive&&a.htmlFocus?a.htmlFocus.from:0;return bn(o,s+n.state.selection.main.from)}function Ou(t,e){const{view:o,kind:n}=Pu(t);return{collection:Ss(t)||"",set:$s(yt()),view:o,kind:n,scope:Ai(Iu(t,e))}}function Du(t){const e=typeof U=="function"?U(t.document):[];for(const o of e){const n=mt(o.values)||o.values;if(n&&typeof n=="object")return n}return null}function Hu(t,e){return{scope:e?.scope?.groups||[],section:Ts(e?.section||[],zs(t)),page:Fi(e?.page||[],Du(t)),site:e?.site||[]}}function ju(t){const e=t.state.selection.main,o=t.state.doc.lineAt(e.from),n=o.text.slice(0,e.from-o.from);return/(?:^|\s)(?::|x-bind:)[\w.:-]+\s*=\s*(["'])(?:(?!\1).)*$/.test(n)}function zu(t){const e=t.state.selection.main,o=t.state.doc.lineAt(e.from),n=o.text.slice(0,e.from-o.from);return/(?:^|\s)[\w.:@-]+\s*=\s*(["'])(?:(?!\1).)*$/.test(n)}function Wu(t,e){const o=v.html;if(!o||o.state.readOnly)return;if(ju(o)){const c=String(t?.var||"").trim(),d=o.state.selection.main;o.dispatch({changes:{from:d.from,to:d.to,insert:c},selection:{anchor:d.from+c.length}}),I();return}const n=Li(t,e,{inline:zu(o)});if(!n)return;const s=o.state.selection.main,r=o.state.doc.lineAt(s.from),i=it(r.text),l=Fo(n.text,i);o.dispatch({changes:{from:s.from,to:s.to,insert:l},selection:{anchor:s.from+n.cursor+(n.text.includes(`
`)?i.length:0)}}),I()}function Kt(t,e,o){const n=e.getBoundingClientRect(),s=8,r=o.offsetWidth||368,i=o.offsetHeight||240,l=t.innerHeight-n.bottom-s,c=n.top-s,d=l>=i||l>=c?n.bottom+4:n.top-i-4;o.style.left=`${Math.max(s,Math.min(n.left,t.innerWidth-r-s))}px`,o.style.top=`${Math.max(s,Math.min(d,t.innerHeight-i-s))}px`}function Sa(t,e,o,n){const s=t.document;N(s),e.setAttribute("data-open","");const r=s.createElement("div");r.id=Pt,r.setAttribute("data-sve-data-menu",""),s.body.appendChild(r);const i=Ou(t,n),l=m=>[m?.scope?.groups?.length?{id:"scope",label:m.scope.label||p(t,"data_vars_tab_loop")}:null,{id:"section",label:p(t,"data_vars_tab_section")},{id:"page",label:p(t,"data_vars_tab_page")},{id:"site",label:p(t,"data_vars_tab_site")}].filter(Boolean),c=m=>{s.getElementById(Pt)&&(r._sveApp?.unmount(),r._sveApp=H(ks,r,{title:p(t,"data_vars_title"),placeholder:p(t,"data_vars_placeholder"),emptyText:p(t,"data_vars_empty"),noSectionText:p(t,"data_vars_no_section"),loopText:p(t,"data_vars_loop"),tabs:l(m),data:Hu(t,m),onPick:(b,y)=>o?o(b,y):Wu(b,y)}),Kt(t,e,r))};c(Cs(Lo(i))||{scope:null,section:[],page:[],site:[]}),As(t,i).then(c),Kt(t,e,r);const d=()=>Kt(t,e,r),f=m=>{!r.contains(m.target)&&!e.contains(m.target)&&N(s)},h=m=>{m.key==="Escape"&&N(s)};s.addEventListener("pointerdown",f,!0),s.addEventListener("keydown",h,!0),t.addEventListener("scroll",d,!0),t.addEventListener("resize",d),Ee=()=>{s.removeEventListener("pointerdown",f,!0),s.removeEventListener("keydown",h,!0),t.removeEventListener("scroll",d,!0),t.removeEventListener("resize",d)}}function $a(t,e,{title:o,placeholder:n,tabs:s,data:r,onPick:i}){const l=t.document;N(l),$(l),e.setAttribute("data-open","");const c=l.createElement("div");c.id=Pt,c.setAttribute("data-sve-data-menu",""),l.body.appendChild(c),c._sveApp=H(ks,c,{title:o,placeholder:n,emptyText:p(t,"data_vars_empty"),noSectionText:p(t,"data_vars_empty"),loopText:"",tabs:s,data:r,onPick:(d,f)=>{N(l),i(d,f)}}),Kt(t,e,c),Ru(t,e,c)}function Ru(t,e,o){const n=t.document,s=()=>Kt(t,e,o),r=l=>{!o.contains(l.target)&&!e.contains(l.target)&&N(n)},i=l=>{l.key==="Escape"&&N(n)};n.addEventListener("pointerdown",r,!0),n.addEventListener("keydown",i,!0),t.addEventListener("scroll",s,!0),t.addEventListener("resize",s),Ee=()=>{n.removeEventListener("pointerdown",r,!0),n.removeEventListener("keydown",i,!0),t.removeEventListener("scroll",s,!0),t.removeEventListener("resize",s)}}const Nu='<svg width="21" height="11" viewBox="0 0 150 77" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M69.999 55.827a13.8 13.8 0 0 0-.812-3.799 15.4 15.4 0 0 0-1.687-3.55 18.16 18.16 0 0 0-5.686-5.418 37.7 37.7 0 0 0 3.936-6.228 18.6 18.6 0 0 0 1.812-6.228 9.88 9.88 0 0 0-1.248-5.57 9.9 9.9 0 0 0-4.125-3.959 10.46 10.46 0 0 0-10.684 1.183 13.8 13.8 0 0 0-4.061 5.107 39 39 0 0 0-1.812 4.92 49.5 49.5 0 0 1-5.436-6.227 16.9 16.9 0 0 1-2.562-5.606 28.7 28.7 0 0 1-.624-6.85c.003-2-.357-3.983-1.063-5.855a10.66 10.66 0 0 0-4.56-5.231 13.9 13.9 0 0 0-10.684-1.37 10.13 10.13 0 0 0-4.94 2.755 10.1 10.1 0 0 0-2.683 4.967 24.4 24.4 0 0 0 0 10.214 22.4 22.4 0 0 0 3.374 7.35h-1.062a23 23 0 0 1-4.124 0 19.2 19.2 0 0 0-6.248 0 6.74 6.74 0 0 0-3.374 2.74 9.45 9.45 0 0 0-.75 9.341 11.23 11.23 0 0 0 5.811 6.228 25.1 25.1 0 0 0 10.622 1.495 17.9 17.9 0 0 0 9.809-3.425 104 104 0 0 1 10.496 7.162 22.4 22.4 0 0 1 5.249 6.54 15.5 15.5 0 0 1 1.437 5.106 35 35 0 0 0 1.437 6.789 13.2 13.2 0 0 0 4.373 5.73 15.6 15.6 0 0 0 10.372 2.802 9.9 9.9 0 0 0 5.429-1.987 9.84 9.84 0 0 0 3.38-4.677A61.6 61.6 0 0 0 70 55.827m-5.061 12.456a5.05 5.05 0 0 1-1.971 2.157 5.07 5.07 0 0 1-2.84.708 9.45 9.45 0 0 1-6.248-2.367 6.6 6.6 0 0 1-2.124-2.989 50 50 0 0 1-1.625-6.788 18.7 18.7 0 0 0-2.249-5.73 28.7 28.7 0 0 0-7.435-7.35A129 129 0 0 0 27.95 38.95c-.812-.498-2.686 0-2.749 0a14.03 14.03 0 0 1-7.872 1.62 19.5 19.5 0 0 1-7.935-2.056 4.86 4.86 0 0 1-2.375-2.49 3.35 3.35 0 0 1 0-2.99 1.18 1.18 0 0 1 .875-.748c1.25 0 2.687 0 3.936-.435a33 33 0 0 0 4.749-1.122 17.6 17.6 0 0 0 4.498-2.18 1.68 1.68 0 0 0 .838-1.68 1.7 1.7 0 0 0-.213-.624 2.2 2.2 0 0 0-.937-.747 18.65 18.65 0 0 1-2.812-7.35 19.5 19.5 0 0 1 .938-7.97 4.55 4.55 0 0 1 1.326-1.834 4.57 4.57 0 0 1 2.048-.97 7.52 7.52 0 0 1 5.498.997 5.12 5.12 0 0 1 2.499 3.488 87 87 0 0 0 1.874 10.587 22.4 22.4 0 0 0 4.436 6.789 78 78 0 0 0 8.372 7.286 1.8 1.8 0 0 0 1.188 1.246 2.005 2.005 0 0 0 2.499-1.308 33.4 33.4 0 0 1 3.249-6.54 8.8 8.8 0 0 1 2.811-2.677 4.63 4.63 0 0 1 4.561 0 4 4 0 0 1 1.612 1.494c.387.638.586 1.372.575 2.118a14.7 14.7 0 0 1-.75 5.792 36.6 36.6 0 0 1-2.561 6.228v.311a2.05 2.05 0 0 0 .5 2.74 13.6 13.6 0 0 1 3.248 4.92c.375.873.563 1.745.875 2.617s.937 2.678 1.312 4.048c1.625 5.916 2.5 7.536.875 10.961zM148.848 29.42a6.6 6.6 0 0 0-3.062-2.74 16.7 16.7 0 0 0-6.248 0c-1.227.09-2.459.09-3.686 0h-.937a24.2 24.2 0 0 0 3.186-7.536c.659-3.31.659-6.716 0-10.027a9.95 9.95 0 0 0-2.072-5.336 10 10 0 0 0-4.676-3.32 12.53 12.53 0 0 0-10.184 1.556 10.78 10.78 0 0 0-4.498 5.668 16.8 16.8 0 0 0-.875 5.667 32.7 32.7 0 0 1 0 6.602 17.2 17.2 0 0 1-2.499 5.543 52 52 0 0 1-4.748 5.792 32 32 0 0 0-1.5-4.547 14.4 14.4 0 0 0-3.811-5.231 9.522 9.522 0 0 0-10.56-.996 10.16 10.16 0 0 0-3.64 4.024 10.1 10.1 0 0 0-1.045 5.317c.21 2.156.78 4.26 1.687 6.228a38.3 38.3 0 0 0 3.748 6.228 17.5 17.5 0 0 0-5.435 5.668 15 15 0 0 0-1.562 3.55 18.3 18.3 0 0 0-.75 3.674v10.09c.068 1.417.32 2.82.75 4.172a9.46 9.46 0 0 0 3.062 4.609 9.5 9.5 0 0 0 5.123 2.118 14.1 14.1 0 0 0 9.871-2.927 12.76 12.76 0 0 0 4.124-5.792 34 34 0 0 0 1.562-6.727 17.6 17.6 0 0 1 1.375-5.107 21.1 21.1 0 0 1 4.623-6.228 83 83 0 0 1 8.935-7.349 16.34 16.34 0 0 0 8.997 3.301 22.24 22.24 0 0 0 9.746-1.557 10.777 10.777 0 0 0 5.499-6.228 9.88 9.88 0 0 0-.5-8.158m-5.623 6.229a4.43 4.43 0 0 1-2.062 2.553 16.16 16.16 0 0 1-7.06 2.18 11.7 11.7 0 0 1-7.123-1.869s-1.999-.81-2.812 0a123 123 0 0 0-11.558 7.038 26.9 26.9 0 0 0-6.811 7.224 79 79 0 0 0-3.623 12.456 6.23 6.23 0 0 1-2 3.052 7.88 7.88 0 0 1-5.373 2.305 4.63 4.63 0 0 1-2.523-.809 4.6 4.6 0 0 1-1.663-2.056 9.8 9.8 0 0 1-.812-3.488c.25-2.711.881-5.373 1.874-7.91.375-1.37.75-2.678 1.187-4.048s.438-1.806.812-2.616a13.26 13.26 0 0 1 2.937-5.044 2.054 2.054 0 0 0 .375-2.74 44 44 0 0 1-2.25-6.228 17.3 17.3 0 0 1-.687-5.792 4.22 4.22 0 0 1 1.937-3.675 3.57 3.57 0 0 1 3.811 0 8.3 8.3 0 0 1 2.625 2.678 40.5 40.5 0 0 1 3.061 6.228 1.93 1.93 0 0 0 1.664 1.441c.26.029.522.005.773-.07a1.82 1.82 0 0 0 1.187-1.309 80 80 0 0 0 7.872-7.411 22.5 22.5 0 0 0 3.999-6.664 75.4 75.4 0 0 0 1.749-10.525 5.17 5.17 0 0 1 1.937-3.176 5.76 5.76 0 0 1 4.749-.935 4.11 4.11 0 0 1 3.186 2.927c.751 2.609.985 5.338.687 8.035a19 19 0 0 1-2.561 7.473s-.625 0-.75.56a1.68 1.68 0 0 0 .5 2.367c1.27.908 2.657 1.641 4.123 2.18 1.468.49 2.972.865 4.499 1.121 1.125 0 2.374 0 3.561.436s.438.311.625.623c.235.52.351 1.087.341 1.657a3.9 3.9 0 0 1-.403 1.644z"/></svg>',qu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 9 5 12 1.8-5.2L21 14Z"/><path d="M7.2 2.2 8 5.1"/><path d="m5.1 8-2.9-.8"/><path d="M14 4.1 12 6"/><path d="m6 12-1.9 2"/></svg>';function Ca(t,e,o,n,s){const r=t.document.createElement("button");return r.type="button",r.setAttribute(o,""),r.title=s,r.setAttribute("aria-label",s),r.innerHTML=`<span>${n}</span>`,r.addEventListener("mousedown",i=>i.preventDefault()),e.replaceChildren(r),r}function Vu(t){return String(t||"").replace(/\|/g,"").split(`
`)[0].trim()}function Uu(t,e){const o=e.querySelector("[data-sve-data-vars]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("mousedown",n=>n.preventDefault()),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),t.document.getElementById(Pt)){N(t.document);return}$(t.document),Sa(t,o)}))}function Ku(t,e){const o=e.querySelector("[data-sve-antlers-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=Ca(t,o,"data-sve-antlers-btn",Nu,p(t,"code_dock_antlers"));n.addEventListener("click",s=>{if(s.preventDefault(),s.stopPropagation(),n.hasAttribute("data-open")){N(t.document);return}const r={};for(const i of yn)r[i.id]=ki.filter(l=>l.group===i.id).map(l=>({id:l.id,var:l.label,value:l.inline?"":Vu(l.snippet)}));$a(t,n,{title:p(t,"code_dock_antlers"),placeholder:p(t,"code_dock_antlers_search"),tabs:yn.map(i=>({id:i.id,label:p(t,i.lang)})),data:r,onPick:i=>Gu(i.id)})})}function Gu(t){const e=xi(t),o=v.html;if(!e||!o||o.state.readOnly)return;const n=o.state.selection.main.head;if(e.inline){const c=e.snippet,d=o.state.selection.main;o.dispatch({changes:{from:d.from,to:d.to,insert:c},selection:{anchor:d.from+c.length}}),I();return}const s=o.state.doc.lineAt(n),r=s.text.trim()?it(s.text):Ne(o,s)||it(s.text),{text:i,cursor:l}=we(e.snippet);Qt(Fo(i,r),l),I()}function Xu(t,e){const o=e.querySelector("[data-sve-visual-edit-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=Ca(t,o,"data-sve-visual-edit-btn",qu,p(t,"code_dock_visual_edit"));n.addEventListener("click",s=>{if(s.preventDefault(),s.stopPropagation(),n.hasAttribute("data-open")){N(t.document);return}const r={};for(const i of xn)r[i.id]=Ms.filter(l=>l.group===i.id).map(l=>({id:l.id,var:l.label,value:l.attr?l.attr.replace(/\|/g,""):""}));$a(t,n,{title:p(t,"code_dock_visual_edit"),placeholder:p(t,"code_dock_visual_edit_search"),tabs:xn.map(i=>({id:i.id,label:p(t,i.lang)})),data:r,onPick:i=>Zu(i.id)})})}function Yu(t,e,o,n){if(Ii(o.inner,n.attr)){t.focus();return}const{text:s,cursor:r}=we(n.attr);let i=o.closeIdx;for(;i>o.openIdx+2&&/\s/.test(e[i-1]);)i--;t.dispatch({changes:{from:i,to:o.closeIdx,insert:` ${s} `},selection:{anchor:i+1+r}}),I()}function Zu(t){const e=Bi(t),o=v.html;if(!e||!o||o.state.readOnly)return;const n=o.state.doc.toString(),s=ue();if(s?.open){const h=Pi(n,s.open.from,s.open.to,ve);if(h){e.attr?Yu(o,n,h,e):(o.dispatch({selection:{anchor:h.openIdx+2+ve.length}}),o.focus());return}const m=s.open.from+1+s.name.length,b=e.standalone||`{{ ${ve} ${e.attr} }}`,{text:y,cursor:L}=we(b);o.dispatch({changes:{from:m,to:m,insert:` ${y}`},selection:{anchor:m+1+L}}),I();return}const r=o.state.selection.main.head,i=o.state.doc.lineAt(r),l=i.text.trim()?it(i.text):Ne(o,i)||it(i.text),c=e.standalone||`{{ ${ve} ${e.attr} }}`,{text:d,cursor:f}=we(c);Qt(Fo(d,l),f),I()}function Ju(t){return t==="css"?Ka():t==="js"?Ga():Ua({autoCloseTags:!0})}function Gn(t){if(t._sveShield)return;t._sveShield=!0;const e=o=>o.stopPropagation();for(const o of["keydown","keypress","keyup","pointerdown","pointerup","mousedown","mouseup","click","focusin"])t.addEventListener(o,e)}function Qu(t){try{return new URLSearchParams(t.defaultView?.location?.search||"").has("sve-panel")}catch{return!1}}function tf(t){const e=parseInt(Y(t,Za)??"",10);return Number.isFinite(e)&&e>=or?e:yf}function ef(t,e){q(t,Za,String(e))}function Aa(t){try{const e=JSON.parse(Y(t,Ja)||"null");if(e&&typeof e=="object")return{html:e.html!==!1,css:e.css!==!1,js:e.js===!0,alpine:e.alpine===!0}}catch{}return{html:!0,css:!0,js:!1,alpine:!1}}function of(t,e){q(t,Ja,JSON.stringify(e))}function Ta(t){try{const e=JSON.parse(Y(t,Qa)||"null");if(e&&typeof e=="object"){const o=s=>Number.isFinite(s)&&s>0?s:1,n={};for(const s of Ct)n[s]=o(e[s]);return n}}catch{}return Object.fromEntries(Ct.map(e=>[e,1]))}function nf(t,e){q(t,Qa,JSON.stringify(e))}function sf(t){xr(t,bf,`
@keyframes sve-cm-wait { to { transform: rotate(360deg); } }
#${u} {
  /* The tree's seven families, for the marks and the toolbar below. */
  ${Pr("dark")}
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
#${u} [data-sve-html-all],
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
#${u} [data-sve-html-all]:hover,
#${u} [data-sve-style-mode]:hover {
  opacity: 1;
  background: rgba(255,255,255,.16);
}
#${u} [data-sve-values-mode][aria-pressed="true"],
#${u} [data-sve-css-all][aria-pressed="true"],
#${u} [data-sve-html-all][aria-pressed="true"],
#${u} [data-sve-style-mode][aria-pressed="true"] {
  opacity: 1;
  color: #7dd3fc;
  background: rgba(56,189,248,.16);
}
/* The HTML pane's All: small, on the code's top right corner, with the dock's
   own translucent white — and code that runs under it is blurred, not read
   through. Gone with the tree, when the pane shows the whole file anyway. */
#${u} [data-sve-html-all-slot] {
  position: relative;
  height: 0;
  z-index: 5;
}
/* Level with the first line of code: the editor's content starts 12px down
   (lib/codemirror.js) and a line is 13px × 1.55 ≈ 20px tall. */
#${u} [data-sve-html-all] {
  position: absolute;
  top: 12px;
  right: 16px;
  height: 20px;
  padding: 0 6px;
  margin-left: 0;
  gap: 4px;
  border-radius: 5px;
  font-size: 10px;
  opacity: 1;
  color: rgba(212,212,212,.8);
  background: rgba(255,255,255,.08);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
}
#${u} [data-sve-html-all] svg {
  width: 10px;
  height: 10px;
}
#${u} [data-sve-html-all]:hover {
  color: #d4d4d4;
  background: rgba(255,255,255,.14);
}
#${u} [data-sve-html-all][aria-pressed="true"] {
  color: #7dd3fc;
  background: rgba(56,189,248,.16);
}
#${u} [data-sve-html-all][hidden] {
  display: none;
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
#${K} {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,.5);
}
#${K} [data-sve-unlock-card] {
  width: min(420px, calc(100vw - 32px));
  padding: 20px;
  border-radius: 12px;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 16px 40px rgba(0,0,0,.45);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${K} [data-sve-unlock-title] {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
}
#${K} [data-sve-unlock-body] {
  font-size: 13px;
  line-height: 1.45;
  opacity: .75;
  margin-bottom: 18px;
}
#${K} [data-sve-unlock-actions] {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
#${K} [data-sve-unlock-actions] button {
  all: unset;
  cursor: pointer;
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}
#${K} [data-sve-unlock-cancel] {
  background: rgba(255,255,255,.1);
  color: #d4d4d4;
}
#${K} [data-sve-unlock-confirm] {
  background: #b45309;
  color: #fff;
}
#${u} [data-sve-code-grip] {
  flex: 0 0 16px;
  height: 16px;
  width: 100%;
  cursor: ns-resize;
  z-index: 3;
  ${pn("ns")}
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
#${k} {
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
#${Pt} {
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
#${k} [data-sve-css-swatches] {
  display: grid;
  grid-template-columns: repeat(8, 16px);
  gap: 4px;
}
#${k} [data-sve-css-swatch] {
  all: unset;
  cursor: pointer;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  box-sizing: border-box;
  border: 1px solid rgba(255,255,255,.2);
}
#${k} [data-sve-css-swatch]:hover,
#${k} [data-sve-css-clear]:hover {
  outline: 1px solid #fff;
  outline-offset: 1px;
}
#${k} [data-sve-css-clear] {
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
#${k} [data-sve-css-choice] {
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
#${k} [data-sve-css-choice-label] {
  flex: 1 1 auto;
  min-width: 0;
}
/* What the row actually writes, in the corner of the row that writes it. Dim,
   because it is the answer to a second question, not the first. */
#${k} [data-sve-css-choice-hint] {
  flex: 0 0 auto;
  opacity: .45;
  font-size: 10px;
}
#${k} [data-sve-css-head-row] {
  display: block;
  padding: 8px 8px 3px;
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  opacity: .55;
}
#${k} [data-sve-css-head-row]:first-child {
  padding-top: 2px;
}
#${k} [data-sve-css-note-row] {
  display: block;
  padding: 6px 8px 2px;
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 10px;
  line-height: 1.45;
  opacity: .5;
}
#${k} [data-sve-css-choice]:hover,
#${k} [data-sve-css-swatch][data-active],
#${k} [data-sve-css-choice][data-active] {
  outline: 1px solid #fff;
  outline-offset: 1px;
  background: rgba(255,255,255,.1);
}
#${k} [data-sve-css-add-label] {
  display: block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  opacity: .55;
  margin-bottom: 6px;
}
#${k} [data-sve-css-add-input] {
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
#${k} [data-sve-css-add-hint] {
  margin-top: 6px;
  font-size: 11px;
  color: #fca5a5;
}
#${k} [data-sve-css-add-existing] {
  margin: 10px 0 4px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  opacity: .55;
}
#${k} [data-sve-css-add-list] {
  display: flex;
  flex-direction: column;
  gap: 1px;
  max-height: 14em;
  overflow-y: auto;
  margin: 0 -4px;
}
#${k} [data-sve-css-add-option] {
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
#${k} [data-sve-css-add-option]:hover,
#${k} [data-sve-css-add-option]:focus-visible {
  background: rgba(255,255,255,.1);
}
#${k} [data-sve-css-add-detail] {
  font-size: 10px;
  opacity: .5;
  font-family: ui-sans-serif, system-ui, sans-serif;
  white-space: nowrap;
}
#${k} [data-sve-css-add-none] {
  padding: 4px 6px;
  opacity: .4;
}
#${k} [data-sve-css-add-create] {
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
#${k} [data-sve-css-add-create]:hover { background: #4a68ee; }
#${k} [data-sve-css-add-create][disabled] { opacity: .35; cursor: default; }
#${u} [data-sve-code-split] {
  flex: 0 0 16px;
  cursor: col-resize;
  ${pn("ew")}
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
#${ot} {
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
#${ot}:hover {
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
#${me} {
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
#${me} [data-sve-partial-choice] {
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
#${me} [data-sve-partial-choice]:hover {
  background: rgba(255,255,255,.1);
}
#${me} [data-sve-partial-empty] {
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
`)}function af(t){const e=t.querySelector(".live-preview-editor");if(!e)return 0;const o=e.getBoundingClientRect();return o.width<40||o.right<40?0:Math.round(o.right)}function rf(t){let e=0;for(const o of["__sve-section-picker","__sve-outline-panel","__sve-html-tree-panel","__sve-listview-panel","__sve-right-dock","__sve-chrome-designs","__sve-global-section-panel","__sve-ai-panel"]){const n=t.getElementById(o);if(!n||n.hasAttribute("data-sve-chrome-hidden")||n.hasAttribute("data-sve-right-closed")||n.style.display==="none")continue;const s=n.getBoundingClientRect();s.width>40&&s.right>t.documentElement.clientWidth-8&&(e=Math.max(e,Math.round(s.width)))}return e}function en(t){const e=t.document;if(a.layoutWin=t,typeof t.ResizeObserver!="function")return;a.layoutObserver||(a.layoutObserver=new t.ResizeObserver(()=>{a.layoutWin&&Cu(a.layoutWin)}));const o=e.querySelector(".live-preview-editor"),n=e.getElementById("__sve-right-dock");o!==a.observedEditor&&(a.observedEditor&&a.layoutObserver.unobserve(a.observedEditor),a.observedEditor=o,o&&a.layoutObserver.observe(o)),n!==a.observedRight&&(a.observedRight&&a.layoutObserver.unobserve(a.observedRight),a.observedRight=n,n&&a.layoutObserver.observe(n))}function lf(){a.layoutObserver?.disconnect(),a.layoutObserver=null,a.layoutWin=null,a.observedEditor=null,a.observedRight=null}function cf(t){a.layoutWatchBound||(a.layoutWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>en(t)))}function on(t,e){const o=t.querySelector(".live-preview-contents");o&&(o.style.paddingBottom=e?`${e}px`:"")}function nn(t){if(!t)return;const e=t.clientHeight,o=t.querySelector("[data-sve-code-bar]"),n=t.querySelector("[data-sve-code-lock-banner]"),s=n&&df(t)?.getComputedStyle(n).display!=="none"?n.offsetHeight:0,r=Math.max(64,e-(o?.offsetHeight||0)-s),i=t.querySelector("[data-sve-code-panes]");i&&(i.style.height=`${r}px`,i.style.minHeight="0",i.style.overflow="hidden"),t.querySelectorAll("[data-sve-code-host]").forEach(l=>{const c=l.closest("[data-sve-code-pane]");if(!c||c.style.display==="none")return;let d=0;for(const h of c.children)h!==l&&(d+=h.offsetHeight);const f=Math.max(64,r-d);l.style.height=`${f}px`,l.style.maxHeight=`${f}px`,l.style.minHeight="0",l.style.overflow="auto",uf(l)})}function df(t){return t.ownerDocument?.defaultView||a.lastWin}function uf(t){t._sveWheelBound||(t._sveWheelBound=!0,t.addEventListener("wheel",e=>{const o=t.scrollHeight-t.clientHeight,n=t.scrollWidth-t.clientWidth;let s=!1;if(e.deltaY&&o>0){const r=Math.min(o,Math.max(0,t.scrollTop+e.deltaY));r!==t.scrollTop&&(t.scrollTop=r,s=!0)}if(e.deltaX&&n>0){const r=Math.min(n,Math.max(0,t.scrollLeft+e.deltaX));r!==t.scrollLeft&&(t.scrollLeft=r,s=!0)}s&&(e.preventDefault(),e.stopPropagation())},{passive:!1}))}function Ma(){const t=(a.layoutWin||a.lastWin)?.document?.getElementById(u);t&&nn(t);for(const e of st)v[e]?.requestMeasure()}function Ea(t,e){const o=Aa(t),n={};for(const s of Ct){const r=e.querySelector(`[data-sve-code-pane-btn="${s}"]`);n[s]=r?r.getAttribute("aria-pressed")==="true":o[s]}return n}function Fa(t,e){for(const n of Ct){const s=t.querySelector(`[data-sve-code-pane-btn="${n}"]`),r=t.querySelector(`[data-sve-code-pane="${n}"]`);s&&s.setAttribute("aria-pressed",e[n]?"true":"false"),r&&(r.style.display=e[n]?"flex":"none")}const o=Ct.filter(n=>e[n]);t.querySelectorAll("[data-sve-code-split]").forEach(n=>{const s=n.getAttribute("data-sve-code-split-after"),r=o.indexOf(s);n.style.display=r>=0&&r<o.length-1?"block":"none"}),La(t.ownerDocument.defaultView,t),nn(t)}function La(t,e){const o=Ta(t);for(const n of Ct){const s=e.querySelector(`[data-sve-code-pane="${n}"]`);s&&(s.style.flex=`${o[n]} 1 0`)}}function It(t,e){if(a.dragging)return;const o=t.document;ao(o,e);const n=tf(t),s=af(o),r=rf(o);e.style.left=`${s}px`,e.style.right=`${r}px`,e.style.bottom="0",e.style.height=`${n}px`,on(o,n),nn(e)}function Ba(t,e,o,n){a.dragging=!0,Ir(t,e,o,()=>{a.dragging=!1,n?.()},"data-sve-code-drag-shield")}function ff(t,e){if(e._sveResizeBound)return;e._sveResizeBound=!0;const o=n=>{if(n.button!==0||n.target.closest('button, a, input, select, textarea, label, [role="button"], [contenteditable], .cm-editor'))return;n.preventDefault();const s=n.clientY,r=e.getBoundingClientRect().height;let i=r;Ba(t,"ns-resize",l=>{i=Math.min(Math.max(or,r+(s-l.clientY)),Math.round(t.innerHeight*.7)),e.style.height=`${i}px`,on(t.document,i),Ma()},()=>{ef(t,i),It(t,e),t.dispatchEvent(new Event("resize"))})};e.querySelector("[data-sve-code-bar]")?.addEventListener("mousedown",o),e.querySelector("[data-sve-code-grip]")?.addEventListener("mousedown",o)}function hf(t,e){e._sveSplitBound||(e._sveSplitBound=!0,e.querySelectorAll("[data-sve-code-split]").forEach(o=>{o.addEventListener("mousedown",n=>{if(n.button!==0)return;n.preventDefault(),n.stopPropagation();const s=o.getAttribute("data-sve-code-split-after"),r=Ct.filter(L=>Ea(t,e)[L]),i=r.indexOf(s),l=r[i],c=r[i+1];if(!l||!c)return;const d=e.querySelector(`[data-sve-code-pane="${l}"]`),f=e.querySelector(`[data-sve-code-pane="${c}"]`),h=n.clientX,m=d.getBoundingClientRect().width,b=f.getBoundingClientRect().width,y=m+b;o.setAttribute("data-active",""),Ba(t,"col-resize",L=>{const ir=L.clientX-h;let Xe=Math.max(so,Math.min(y-so,m+ir)),ln=y-Xe;y<so*2&&(Xe=m,ln=b);const Ye=Ta(t);Ye[l]=Xe,Ye[c]=ln,nf(t,Ye),La(t,e),Ma()},()=>{o.removeAttribute("data-active")})})}))}function pf(t,e){e._svePaneBound||(e._svePaneBound=!0,e.querySelectorAll("[data-sve-code-pane-btn]").forEach(o=>{o.addEventListener("click",n=>{n.stopPropagation();const s=o.getAttribute("data-sve-code-pane-btn"),r=Ea(t,e),i={...r,[s]:!r[s]};!i.html&&!i.css&&!i.js&&(i[s]=!0),of(t,i),Fa(e,i)})}))}function O(t,e){const o=t.getElementById(u)?.querySelector("[data-sve-code-status]");o&&(o.textContent=e||"")}function sn(t,e){const o=t.getElementById(u)?.querySelector("[data-sve-code-path]");o&&(o.textContent=e||"",o.title=e||"")}function Ot(t){const e=t?.document?.getElementById(u)?.querySelector("[data-sve-code-back]");e&&(e.hidden=a.typeStack.length===0,e.title=p(t,"code_dock_back"),e.setAttribute("aria-label",e.title),e.innerHTML=wf)}function Xn(t,e){const o=e.querySelector("[data-sve-code-back]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Rs(t)}))}let B,go,Pa,Ia,Oa,kt,oe,dt,Rt,ut,tt,Da,Ha,ja,an,za,Wa,Ra,Na,qa,Va,Fe,Ua,Ka,Ga,Xa,bo,yo,Ya,mf,qt=null,C=null;function vf(){return qt||(qt=dr().then(t=>{C=t,B=C.view.EditorView,go=C.view.keymap,Pa=C.view.lineNumbers,Ia=C.view.highlightActiveLine,Oa=C.view.highlightActiveLineGutter,kt=C.state.Compartment,oe=C.state.EditorState,dt=C.state.StateField,Rt=C.state.StateEffect,ut=C.state.RangeSetBuilder,tt=C.view.Decoration,Da=C.commands.defaultKeymap,Ha=C.commands.indentWithTab,ja=C.commands.historyKeymap,an=C.commands.history,za=C.autocomplete.autocompletion,Wa=C.autocomplete.closeBrackets,Ra=C.autocomplete.closeBracketsKeymap,Na=C.autocomplete.closeCompletion,qa=C.autocomplete.completionKeymap,Va=C.view.hoverTooltip,Fe=C.langHtml.htmlLanguage,Ua=C.langHtml.html,Ka=C.langCss.css,Ga=C.langJs.javascript,C.language.HighlightStyle,C.language.syntaxHighlighting,Xa=C.language.codeFolding,bo=C.language.foldEffect,yo=C.language.unfoldEffect,Ya=C.language.foldedRanges,mf=C.highlight.tags,Gt.html=new kt,Gt.css=new kt,Gt.js=new kt,Xt.html=new kt,Xt.css=new kt,Xt.js=new kt}).catch(t=>{throw qt=null,t}),qt)}const gf="{{ _class }}",u=lr,bf="__sve-code-dock-style",K="__sve-code-dock-unlock",Za="sve-code-dock-height",Ja="sve-code-dock-panes",Qa="sve-code-dock-widths",Ge="sve-html-scope-v2",tr="sve-code-dock-autosave",er="sve-code-dock-style-mode",rn="sve-code-dock-values",yf=280,or=120,so=140,kf=250,st=["html","css","js"],Ct=["html","css","alpine","js"],xf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',_f='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-1"/></svg>',wf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',nr='<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1c0 .966.784 1.75 1.75 1.75h.418A1.74 1.74 0 0 0 4 7.25v1.5c0 .49.201.932.525 1.25c-.324.318-.525.76-.525 1.25v1c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 14 12.25v-1c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1.5c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1A1.75 1.75 0 0 0 12.25 2zm8.5 7.5H8v-3h4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75M7 6.5v3H5.75A.75.75 0 0 1 5 8.75v-1.5a.75.75 0 0 1 .75-.75zm1 4h4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75H8zm-1 0V13H5.75a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-1-5V3h6.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75zm-1 0H3.75A.75.75 0 0 1 3 4.75v-1A.75.75 0 0 1 3.75 3H5z"/></svg>',Sf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/><path d="M4.5 11.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/></svg>',$f='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 16.3A8.5 8.5 0 1 1 18.3 6.3"/><path d="M21 3.2v5.4h-5.4"/></svg>',Cf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',Af='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',k="__sve-css-menu",sr=["h1","h2","h3","h4","h5","h6"],ko=[{id:"section",title:"section",tag:"section"},{id:"div",title:"div",tag:"div"},{id:"heading",title:"heading",menu:"heading"},{id:"text",title:"text",menu:"text"},{id:"a",title:"link",tag:"a"},{id:"img",title:"image",snippet:'<img src="" alt="">',caret:10},{id:"video",title:"video",snippet:'<video src="" controls playsinline></video>',caret:12},{id:"ul",title:"list",tag:"ul"},{id:"li",title:"list item",tag:"li"},{id:"component",title:"component",menu:"component"},{id:"loop",title:"loop",snippet:`{{ items }}

{{ /items }}
`,caret:3,select:5},{id:"pagination",title:"pagination",action:"pagination"},{id:"if",title:"if",snippet:`{{ if true }}

{{ /if }}
`,caret:6,select:4}],Tf=["--size-100","--size-200","--size-300","--size-400","--size-500","--size-600","--size-700","--size-800","--size-900","--gutter"],Mf={"tw-text":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 13 5 3l3.5 10M2.7 10h4.6"/><path d="M12.5 3.5v9M11 5l1.5-1.5L14 5M11 11l1.5 1.5L14 11"/></svg>',"tw-leading":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h8.5M6 8h8.5M6 12.5h8.5"/><path d="M2.5 4.5v7M1.4 5.6 2.5 4.5l1.1 1.1M1.4 10.4l1.1 1.1 1.1-1.1"/></svg>',"tw-font":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.2V3h10v1.2M8 3v10M6 13h4"/></svg>',"tw-radius":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 13.5v-6a5 5 0 0 1 5-5h6"/><path d="M13.5 6.5v7h-7" stroke-dasharray="2 2"/></svg>',"tw-gap":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"tw-align":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3.5h12M2 8h8M2 12.5h10"/></svg>',"tw-w":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3.5v9M14 3.5v9"/><path d="M4.5 8h7"/><path d="M6 6.2 4.2 8 6 9.8M10 6.2 11.8 8 10 9.8"/></svg>',"tw-h":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 2h9M3.5 14h9"/><path d="M8 4.5v7"/><path d="M6.2 6 8 4.2 9.8 6M6.2 10 8 11.8 9.8 10"/></svg>',"tw-maxw":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3v10M14.5 3v10"/><path d="M5 8h6"/><path d="M6.6 6.2 4.8 8l1.8 1.8M9.4 6.2 11.2 8l-1.8 1.8"/></svg>',"tw-overflow":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="1.8" y="4.5" width="8.6" height="9.7" rx="1.2"/><path d="M6.5 1.8h7.7v7.7" stroke-linecap="round"/></svg>',"tw-border":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6"/><rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" stroke-width="1" opacity=".45"/></svg>',"tw-border-color":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6" stroke-dasharray="3.1 2.2"/><rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" fill="currentColor" stroke="none" opacity=".55"/></svg>'},Ef='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="10" width="18" height="11" rx="2"/><rect x="6" y="3" width="9" height="4" rx="1.4" fill="currentColor" stroke="none"/></svg>',Ff='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.1 12a8.9 8.9 0 1 0 2.8-6.5L3 8"/><path d="M3 3.4V8h4.6"/><path d="M12 7.4V12l3 1.8"/></svg>',Lf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>',Bf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></svg>',Pf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/><path d="M3 17c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/></svg>',ar=[["--gray-50","#fafafa"],["--gray-100","#f5f5f5"],["--gray-200","#e5e5e5"],["--gray-300","#d4d4d4"],["--gray-400","#a3a3a3"],["--gray-500","#737373"],["--gray-600","#525252"],["--gray-700","#404040"],["--gray-800","#262626"],["--gray-900","#171717"],["--gray-950","#0a0a0a"]],Yn=t=>[{id:`${t}-all`,icon:"box-all",title:"All sides",css:t,tw:t,menu:"spacing"},{id:`${t}-block`,icon:"box-block",title:"Top and bottom",css:`${t}-block`,tw:`${t}-block`,menu:"spacing",sep:!0},{id:`${t}-block-start`,icon:"box-block-start",title:"Top",css:`${t}-block-start`,tw:`${t}-top`,menu:"spacing"},{id:`${t}-block-end`,icon:"box-block-end",title:"Bottom",css:`${t}-block-end`,tw:`${t}-bottom`,menu:"spacing"},{id:`${t}-inline`,icon:"box-inline",title:"Left and right",css:`${t}-inline`,tw:`${t}-inline`,menu:"spacing",sep:!0},{id:`${t}-inline-start`,icon:"box-inline-start",title:"Left",css:`${t}-inline-start`,tw:`${t}-left`,menu:"spacing"},{id:`${t}-inline-end`,icon:"box-inline-end",title:"Right",css:`${t}-inline-end`,tw:`${t}-right`,menu:"spacing"}],If=[{id:"display-flex",twClass:"flex",icon:"display-flex",title:"Flex",kind:"display",value:"flex",css:"display"},{id:"flex-row",twClass:"flex-row",icon:"flex-row",title:"Direction: row",kind:"flexDir",value:"row",css:"flex-direction",sep:!0},{id:"flex-col",twClass:"flex-col",icon:"flex-col",title:"Direction: column",kind:"flexDir",value:"column",css:"flex-direction"},{id:"justify-start",twClass:"justify-start",icon:"justify-start",title:"Justify: start",css:"justify-content",value:"flex-start",when:"flex",sep:!0},{id:"justify-center",twClass:"justify-center",icon:"justify-center",title:"Justify: center",css:"justify-content",value:"center",when:"flex"},{id:"justify-end",twClass:"justify-end",icon:"justify-end",title:"Justify: end",css:"justify-content",value:"flex-end",when:"flex"},{id:"justify-between",twClass:"justify-between",icon:"justify-between",title:"Justify: between",css:"justify-content",value:"space-between",when:"flex"},{id:"justify-around",twClass:"justify-around",icon:"justify-around",title:"Justify: around",css:"justify-content",value:"space-around",when:"flex"},{id:"align-start",twClass:"items-start",icon:"align-start",title:"Align: start",css:"align-items",value:"flex-start",when:"flex",sep:!0},{id:"align-center",twClass:"items-center",icon:"align-center",title:"Align: center",css:"align-items",value:"center",when:"flex"},{id:"align-end",twClass:"items-end",icon:"align-end",title:"Align: end",css:"align-items",value:"flex-end",when:"flex"},{id:"align-stretch",twClass:"items-stretch",icon:"align-stretch",title:"Align: stretch",css:"align-items",value:"stretch",when:"flex"}],Of=[{id:"gap-all",icon:"gap-all",title:"Both",css:"gap",tw:"gap",menu:"spacing"},{id:"gap-row",icon:"gap-row",title:"Between rows",css:"row-gap",tw:"row-gap",menu:"spacing",sep:!0},{id:"gap-col",icon:"gap-col",title:"Between columns",css:"column-gap",tw:"column-gap",menu:"spacing"}],Df=["1px","2px","3px","4px","8px"],xt=(t,e,o,n,s,r)=>({id:t,icon:e,title:o,css:n,menu:"choices",choices:Df,twGroup:[s,`${s}-2`,`${s}-4`,`${s}-8`],...r?{sep:!0}:{}}),Hf=[xt("bw-all","bd-all","All sides","border-width","border"),xt("bw-block","bd-block","Top and bottom","border-block-width","border-y",!0),xt("bw-top","bd-top","Top","border-block-start-width","border-t"),xt("bw-bottom","bd-bottom","Bottom","border-block-end-width","border-b"),xt("bw-inline","bd-inline","Left and right","border-inline-width","border-x",!0),xt("bw-left","bd-left","Left","border-inline-start-width","border-l"),xt("bw-right","bd-right","Right","border-inline-end-width","border-r")],jf=[{id:"bd-all",icon:"bd-all",title:"All sides",css:"border-color",tw:"border-color",menu:"colors"},{id:"bd-block",icon:"bd-block",title:"Top and bottom",css:"border-block-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-top",icon:"bd-top",title:"Top",css:"border-block-start-color",tw:"border-top-color",menu:"colors"},{id:"bd-bottom",icon:"bd-bottom",title:"Bottom",css:"border-block-end-color",tw:"border-bottom-color",menu:"colors"},{id:"bd-inline",icon:"bd-inline",title:"Left and right",css:"border-inline-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-left",icon:"bd-left",title:"Left",css:"border-inline-start-color",tw:"border-left-color",menu:"colors"},{id:"bd-right",icon:"bd-right",title:"Right",css:"border-inline-end-color",tw:"border-right-color",menu:"colors"}],zf=[{id:"rd-all",icon:"rd-all",title:"All corners",css:"border-radius",tw:"border-radius",menu:"values"},{id:"rd-tl",icon:"rd-tl",title:"Top left",css:"border-start-start-radius",tw:"border-top-left-radius",menu:"values",sep:!0},{id:"rd-tr",icon:"rd-tr",title:"Top right",css:"border-start-end-radius",tw:"border-top-right-radius",menu:"values"},{id:"rd-br",icon:"rd-br",title:"Bottom right",css:"border-end-end-radius",tw:"border-bottom-right-radius",menu:"values"},{id:"rd-bl",icon:"rd-bl",title:"Bottom left",css:"border-end-start-radius",tw:"border-bottom-left-radius",menu:"values"}],rr=[{id:"display",title:"Display",css:"display",tw:"display",kids:If},{id:"absolute",title:"Position",css:"position",tw:"position",value:"absolute"},{id:"color",title:"Text color",css:"color",tw:"color",menu:"colors"},{id:"bg",title:"Background color",css:"background-color",tw:"background-color",menu:"colors"},{id:"padding",title:"Padding",css:"padding",tw:"padding",kids:Yn("padding")},{id:"margin",title:"Margin",css:"margin",tw:"margin",kids:Yn("margin")},{id:"tw-text",title:"Font size",css:"font-size",tw:"font-size",menu:"values"},{id:"tw-leading",title:"Line height",css:"line-height",tw:"line-height",menu:"values"},{id:"tw-font",title:"Font family",css:"font-family",tw:"font-family",menu:"values"},{id:"tw-align",title:"Text align",css:"text-align",tw:"text-align",menu:"choices",choices:["left","center","right","justify"]},{id:"tw-border",title:"Border",css:"border-width",tw:"border-width",kids:Hf},{id:"tw-border-color",title:"Border color",css:"border-color",tw:"border-color",kids:jf},{id:"tw-radius",title:"Radius",css:"border-radius",tw:"border-radius",kids:zf},{id:"tw-gap",title:"Gap",css:"gap",tw:"gap",kids:Of},{id:"tw-w",title:"Width",css:"width",tw:"width",menu:"sizes"},{id:"tw-h",title:"Height",css:"height",tw:"height",menu:"sizes"},{id:"tw-maxw",title:"Max width",css:"max-width",tw:"max-width",menu:"sizes"},{id:"tw-overflow",title:"Overflow",css:"overflow",tw:"overflow",menu:"choices",choices:["visible","hidden","clip","auto","scroll"]}],Wf=["100%","auto","fit-content","min-content","max-content","100vw","100dvh","0"],Le=new Map;for(const t of rr){Le.set(t.id,{tool:t,kid:null});for(const e of t.kids||[])Le.set(e.id,{tool:t,kid:e})}const Zn={display:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2.5" width="13" height="11" rx="1.2"/><path d="M5 6.5h6M5 9.5h4"/></svg>',"display-flex":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="3.4" height="9" rx=".4"/><rect x="6.3" y="3.5" width="3.4" height="9" rx=".4"/><rect x="10.6" y="3.5" width="3.4" height="9" rx=".4"/></svg>',"flex-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12"/><path d="M4.2 5.8 2 8l2.2 2.2"/><path d="M11.8 5.8 14 8l-2.2 2.2"/></svg>',"flex-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v12"/><path d="M5.8 4.2 8 2l2.2 2.2"/><path d="M5.8 11.8 8 14l2.2-2.2"/></svg>',"justify-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="5.4" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4.6" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="8.2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-between":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-around":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"align-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="5.4" width="9" height="2.4" rx=".4"/></svg>',"align-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="4.6" width="9" height="2.4" rx=".4"/><rect x="3.5" y="9" width="9" height="2.4" rx=".4"/></svg>',"align-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="8.2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="11.6" width="9" height="2.4" rx=".4"/></svg>',"align-stretch":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx=".5"/><rect x="9" y="2" width="4" height="12" rx=".5"/></svg>',absolute:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>',color:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.4 11.2 7.4 2.4l4 8.8"/><path d="M4.7 8.4h5.4"/><rect x="1.6" y="12.8" width="12.8" height="2.2" rx=".6" fill="currentColor" stroke="none"/></svg>',bg:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 1.9a6.1 6.1 0 1 0 0 12.2c.85 0 1.35-.55 1.35-1.25 0-.38-.18-.66-.4-.88a1.2 1.2 0 0 1 .85-2.05h1.3A3.5 3.5 0 0 0 14.1 6.1C14.1 3.75 11.4 1.9 8 1.9Z"/><circle cx="4.9" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="8" cy="4.8" r=".95" fill="currentColor" stroke="none"/><circle cx="11.1" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="4.7" cy="9.9" r=".95" fill="currentColor" stroke="none"/></svg>',padding:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/></svg>',margin:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/><path d="M2 2.5h12M2 13.5h12M2.5 2v12M13.5 2v12" stroke-dasharray="1.4 1.2"/></svg>',"box-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".4" fill="currentColor" stroke="none"/></svg>',"box-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"gap-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"gap-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="3" y="1.6" width="10" height="4.2" rx=".6"/><rect x="3" y="10.2" width="10" height="4.2" rx=".6"/><path d="M4.5 8h7"/></svg>',"gap-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"bd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4"/></svg>',"bd-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-top":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-bottom":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-left":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-right":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"rd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="3.4"/></svg>',"rd-tl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6H6a3.4 3.4 0 0 0-3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M2.6 9V6A3.4 3.4 0 0 1 6 2.6h3" stroke-width="2.2"/></svg>',"rd-tr":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6h7.4a3.4 3.4 0 0 1 3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M7 2.6h3A3.4 3.4 0 0 1 13.4 6v3" stroke-width="2.2"/></svg>',"rd-br":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6v7.4a3.4 3.4 0 0 1-3.4 3.4H2.6" stroke-width="1" opacity=".35"/><path d="M13.4 7v3a3.4 3.4 0 0 1-3.4 3.4H7" stroke-width="2.2"/></svg>',"rd-bl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6v7.4a3.4 3.4 0 0 0 3.4 3.4h7.4" stroke-width="1" opacity=".35"/><path d="M2.6 7v3A3.4 3.4 0 0 0 6 13.4h3" stroke-width="2.2"/></svg>'},v={html:null,css:null,js:null},Gt={html:null,css:null,js:null},Xt={html:null,css:null,js:null};export{ph as ARMED_KEY,$f as AUTOSAVE_ICON,tr as AUTOSAVE_KEY,wf as BACK_ICON,Af as CSS_ADD_ICON,ar as CSS_GRAYS,Wf as CSS_LENGTHS,k as CSS_MENU_ID,Lf as CSS_MODE_ICON,Zo as CSS_SIZE_KEY,Tf as CSS_SPACING,Jo as CSS_STATES,vo as CSS_STATE_KEY,rr as CSS_TOOLS,Zn as CSS_TOOL_ICONS,Le as CSS_TOOL_INDEX,Sf as DATA_ICON,Pt as DATA_MENU_ID,yf as DEFAULT_HEIGHT,u as DOCK_ID,tt as Decoration,oe as EditorState,B as EditorView,st as HANDLES,Za as HEIGHT_KEY,Ff as HISTORY_ICON,sr as HTML_HEADINGS,ko as HTML_TOOLS,Bf as ID_MODE_ICON,xf as LOCK_CLOSED_ICON,_f as LOCK_OPEN_ICON,or as MIN_HEIGHT,so as MIN_PANE,Ct as PANES,Ja as PANES_KEY,ut as RangeSetBuilder,Cf as SAVE_ICON,kf as SAVE_MS,gf as SCOPE_CLASS,nr as SCOPE_ICON,Ge as SCOPE_KEY,Ef as STRIP_ICON,bf as STYLE_ID,er as STYLE_MODE_KEY,Rt as StateEffect,dt as StateField,Pf as TW_MODE_ICON,Mf as TW_TOOL_ICONS,K as UNLOCK_ID,rn as VALUES_MODE_KEY,Qa as WIDTHS_KEY,zt as applyCssFolds,gt as applyCssScope,qc as applyDisplay,Nc as applyFlexDirection,Js as applyHtmlTag,G as applyRuleDecls,ga as applyStyleMode,za as autocompletion,jo as autosaveEnabled,Ku as bindAntlersSnippets,Cn as bindAutosave,Xn as bindBack,Dc as bindCssAddClass,gu as bindCssTools,Uu as bindDataVars,cu as bindHistory,An as bindHtmlScope,yu as bindHtmlTidy,ku as bindHtmlTools,cf as bindLayoutWatch,$n as bindLock,pf as bindPaneToggles,ff as bindResize,hf as bindSplitters,lu as bindStrip,vu as bindStyleMode,Xu as bindVisualEditSnippets,lh as clearCssFocus,de as clearHtmlScopeRange,Wa as closeBrackets,Ra as closeBracketsKeymap,_a as closeCodeDock,ch as closeCodeDockPopups,Na as closeCompletion,$ as closeCssMenu,ee as closeCssMenuPicked,N as closeDataMenu,C as cm,dh as codeDockStyleMode,Xa as codeFolding,Ke as collectionViewType,qa as completionKeymap,Ka as css,ta as cssEditorText,Re as cssRuleAtCursor,ha as cssSizeRow,bt as cssSizeRows,Ve as cssStateSuffix,J as currentFlexDecls,vt as currentFullHtml,zs as currentSectionValues,yt as currentTemplateType,Da as defaultKeymap,ht as dispatchHtmlChanges,Xt as editableOf,v as editors,sf as ensureStyle,Ds as ensureTwCss,va as enterValuesRule,I as finishHtmlEdit,fc as flushBracketSync,V as flushCssScope,hc as flushCssToHtml,W as flushSave,bo as foldEffect,Ya as foldedRanges,Rs as goBackTemplate,Ia as highlightActiveLine,Oa as highlightActiveLineGutter,an as history,ja as historyKeymap,Va as hoverTooltip,Ua as html,Vs as htmlEditorText,ue as htmlElementAtCursor,$t as htmlFocusOk,Fe as htmlLanguage,ie as htmlScopeEnabled,Tt as htmlTargetFromCursor,zu as inAttributeValue,ju as inDynamicAttribute,Ne as indentFromPrevious,Ha as indentWithTab,wu as insertAiSnippet,Ys as insertHtmlElement,Qt as insertHtmlSnippet,Zt as isChromeTemplateType,Tr as isCodeDockArmed,ct as isCodeDockLocked,xa as isCodeDockOpen,Qu as isPanelFrame,Ga as javascript,go as keymap,Ju as languageOf,_t as leadingCssIndent,it as lineIndentOf,Pa as lineNumbers,vf as loadCm,Wt as loadTemplate,lo as mergedCssFull,Jd as mountEditor,pa as newSizeBlockSpot,mo as newSizeQuery,P as normalizeFlexValue,en as observeDockLayout,X as onEditorInput,Gc as openCssChoiceMenu,Kc as openCssColorMenu,Xc as openCssSpacingMenu,Pn as openCssValueMenu,Sa as openDataVarsMenu,Ic as openHtmlComponentMenu,En as openHtmlTagMenu,Ws as openNestedTemplate,$a as openPickerMenu,vc as openRenameClassMenu,qe as paintAlpine,Q as paintAutosave,Ot as paintBack,Yo as paintCssAll,lt as paintCssHead,Go as paintCssIdMark,E as paintCssToolState,Qd as paintHostWait,Gs as paintHtmlAll,R as paintHtmlScope,We as paintHtmlToolState,St as paintLock,Fa as paintPaneButtons,Bt as paintStrip,Ue as paintStyleMode,Xo as paintValuesMode,bc as pickHtmlTagAtCursor,D as placeCssMenu,It as placeDock,on as previewBottomPad,dc as primeTailwindCompile,Gt as readOnlyOf,Vo as readParts,$u as refreshCodeDockFromDisk,Ce as refreshPreview,Cu as relayoutCodeDock,je as rememberBracketNames,Ht as rememberCssSelectors,Os as resetTailwindCompile,Uo as sameParts,mh as setCodeDockArmed,fu as setCssAll,xc as setHtmlAll,sn as setPath,O as setStatus,uu as setValuesMode,Gn as shieldDock,No as showHtmlFull,ze as showHtmlScope,lf as stopObservingDockLayout,Aa as storedPanes,uh as syncCodeDock,co as syncHtmlTree,At as syncScopedHtml,he as syncTwTarget,mf as tags,Ar as templateDockAllowed,Zs as tidyHtmlPane,Bc as toggleHtmlPagination,yo as unfoldEffect,le as writeHandleEditor,ce as writeHtmlEditor,jt as writeParts};
