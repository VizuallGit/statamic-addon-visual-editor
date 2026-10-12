const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-CgCrQIlW.js","./tw-candidates-ge7VFqsV.js"])))=>i.map(i=>d[i]);
import{H as os,a4 as ns,X as fr}from"./ids-BMe4DtIu.js";import{v as hr,l as pr}from"./codemirror-D9K9gPkB.js";import{o as x,c as _,a as v,t as T,e as mr,F as j,i as at,w as F,l as ss,k as So,u as S,$ as Qe,f as W,Y as gr,x as p,r as un,g as vr,X as br,U as to,j as yr,V as fn,W as kr,b as Y,d as q,z as as,_ as xr,p as U,q as mt,D as hn,E as _r,B as wo,a4 as $o,a2 as Sr,s as Jt,ak as wr,m as $r}from"./addon-DWqHvMI7.js";import{a as rt,c as rs,o as Pe,d as pn,t as Cr,f as is,g as Ar,h as Tr,e as Co,i as Mr,m as ae,T as Er,j as Fr,k as Lr,l as Ao,n as To,q as ls,u as Br,v as mn,w as eo,x as Pr,y as Ir,z as io,A as Or,B as Dr,C as cs,D as ds,E as A,F as Hr,G as gn,H as Wr}from"./lp-cluster-BwFT4BRx.js";import{I as wh,J as $h}from"./lp-cluster-BwFT4BRx.js";import{h as vn,c as us,r as fs,f as hs,a as jr,b as zr,d as Rr,e as re,t as ps,g as Nr,i as Mo,j as ms,m as gs,k as vs,l as bs,n as qr,s as Bt,o as bn,p as Vr,q as ys,u as Ht,v as ie,w as Eo,x as Ur,y as Kr,z as Gr,A as Xr,B as ks,C as xs,D as Yr,E as Zr,F as _s,G as Jr,H as Qr,I as Fo,J as ti,K as yn,L as ei,M as oi,N as ni,O as si,P as ai,Q as ri,R as ii,S as li,T as ci,U as Ss,V as di,W as lo,X as ui,Y as fi,Z as hi,_ as pi,$ as ws,a0 as mi,a1 as gi,a2 as vi,a3 as Lo,a4 as bi,a5 as yi,a6 as $s,a7 as kn,a8 as ge}from"./antlers-edit-CY6gLouV.js";import{_ as Cs,o as ki,C as xi,m as H}from"./ChoiceDialog-CBzJ7W5S.js";import{M as As,S as Ts}from"./protocol-BGUrL6he.js";import{t as _i}from"./tw-candidates-ge7VFqsV.js";import{h as Si,a as wi,e as $i,A as xn,b as Ci,i as Bo,c as Ai,d as we}from"./html-tag-sync-BpXNELva.js";import"./ai-text-icon-B7uCWIwa.js";import"./index-M2RCOyrL.js";import"./index-B5fiB6ig.js";import"./index-sh1K8s4m.js";import"./index-0IxPFT_m.js";import"./index-Ci-3qkVd.js";import"./index-DkhC0r6-.js";import"./index-B4S9JIPB.js";import"./index-BwRQ94Ql.js";import"./index-D9YSa79V.js";import"./index-DwJNgNWz.js";const ot="__sve-css-rename-chip",Ti='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';function Mi(t){const e=t.Decoration.mark({class:"sve-cm-css-token"}),o=t.StateEffect.define();return{extensions:[t.StateField.define({create(){return t.Decoration.none},update(s,r){let i;for(const c of r.effects)c.is(o)&&(i=c.value);if(i===void 0)return r.docChanged?t.Decoration.none:s;if(!i)return t.Decoration.none;const l=new t.RangeSetBuilder;return l.add(i.from,i.to,e),l.finish()},provide:s=>t.EditorView.decorations.from(s)})],setHover(s,r){s&&s.dispatch({effects:o.of(r)})}}}function nt(t){t?.getElementById(ot)?.remove()}function Ei(t,e,o,n){e.style.left=`${Math.max(6,Math.min(o,t.innerWidth-28))}px`,e.style.top=`${Math.max(6,n)}px`}function Fi(t,e,o,{onRename:n,title:s}){const r=t.document,i=e.coordsAtPos(o.to);if(!i)return;nt(r);const l=r.createElement("button");l.id=ot,l.type="button",l.innerHTML=Ti,l.title=s,l.setAttribute("aria-label",s),l.addEventListener("mousedown",c=>{c.preventDefault(),c.stopPropagation(),nt(r),n?.(o)}),l.addEventListener("mouseleave",()=>{t.setTimeout(()=>{e.dom.matches(":hover")||l.matches(":hover")||nt(r)},120)}),r.body.appendChild(l),Ei(t,l,i.right+2,i.top-1)}function Li(t,e,{onRename:o,isLocked:n,setHover:s,title:r}){if(!e?.dom||e.dom._sveClassTokenBound)return;e.dom._sveClassTokenBound=!0;let i=null,l="";const c=()=>!!n?.(),d=()=>{t.clearTimeout(i),i=null,l="",s?.(e,null),nt(t.document)},f=h=>{if(c()){d();return}d(),o?.(h)};e.dom.addEventListener("mousemove",h=>{if(c()){d();return}if(h.target?.closest?.(`#${ot}`))return;const m=e.posAtCoords({x:h.clientX,y:h.clientY});if(m==null)return;const b=vn(e.state.doc.toString(),m);if(!b){t.clearTimeout(i),i=null,l="",s?.(e,null);return}const y=`${b.from}:${b.to}:${b.name}`;s?.(e,{from:b.from,to:b.to}),!(l===y&&(i||t.document.getElementById(ot)))&&(t.clearTimeout(i),l=y,i=t.setTimeout(()=>{i=null,Fi(t,e,b,{onRename:f,title:r||"Rename class"})},160))}),e.dom.addEventListener("mouseleave",h=>{h.relatedTarget?.closest?.(`#${ot}`)||t.setTimeout(()=>{t.document.getElementById(ot)?.matches(":hover")||d()},160)}),e.dom.addEventListener("dblclick",h=>{if(c())return;const m=e.posAtCoords({x:h.clientX,y:h.clientY});if(m==null)return;const b=vn(e.state.doc.toString(),m);b&&(h.preventDefault(),h.stopPropagation(),f(b))},!0),e.scrollDOM?.addEventListener("scroll",d),t.document._sveClassTokenDismiss||(t.document._sveClassTokenDismiss=!0,t.document.addEventListener("mousedown",h=>{h.target.closest(`#${ot}`)||nt(t.document)}))}const a={cssColorsPromise:null,lastUid:null,lastType:null,typeStack:[],beforePart:null,lastParts:{html:"",css:"",js:""},lastProps:[],propsDirty:!1,lastLocked:!1,lockReady:!1,lastWin:null,loadGen:0,saveTimer:null,lastBracketNames:null,lastCssSelectorNames:null,saveInFlight:null,loadInFlight:null,dragging:!1,applying:!1,htmlScopePref:!0,htmlScopeActive:!1,styleMode:"css",cssToolRow:null,cssOpenTool:"",cssOpenMenu:"",cssValues:!1,cssAll:!1,htmlAll:!1,twCss:null,twKey:"",twBusy:!1,twDirty:!1,htmlFocus:null,cssFocus:null,htmlFull:"",cssFull:"",cssPane:"full",cssScopeSnapshot:"",layoutObserver:null,layoutWin:null,observedEditor:null,observedRight:null,layoutWatchBound:!1,cssSize:"",cssState:"",cssOwnFolds:new Set,cssFoldSig:"",htmlPartialUi:null,htmlAntlersUi:null,htmlClassTokenUi:null,htmlLintUi:null,cssGhostUi:null},Ft=new Map,_n={scope:null,section:[],page:[],site:[]};function Ms(t){const e=t?.location?.pathname?.match(/\/collections\/([^/]+)\//);return e?e[1]:""}function Es(t){const e=String(t||"").trim();return!e||/^(header|footer)\//.test(e)?"":e}function Bi(t){return(Array.isArray(t)?t:[]).filter(e=>e?.handle).map(e=>`${e.kind==="collection"?"collection":"field"}:${e.handle}`).join("|")}function Po({collection:t,set:e,view:o,scope:n}){return`${t}::${e}::${o||""}::${n||""}`}function Fs(t){return Ft.get(t)||null}function Ls(t,{collection:e,set:o,view:n,scope:s}){const r=Po({collection:e,set:o,view:n,scope:s}),i=Ft.get(r);if(i)return Promise.resolve(i);const l=new URLSearchParams;return e&&l.set("collection",e),o&&l.set("set",o),n&&l.set("view",n),s&&l.set("scope",s),t.fetch(`/!/sve/data-vars?${l.toString()}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(c=>c.ok?c.json():null).then(c=>{const d=c&&typeof c=="object"?c:_n;return Ft.set(r,d),d}).catch(()=>_n)}function Pi(t){if(!t){Ft.clear();return}const e=`::${t}::`;for(const o of[...Ft.keys()])o.includes(e)&&Ft.delete(o)}function Ii(t){if(t==null||t==="")return"";if(typeof t=="boolean")return t?"true":"false";if(Array.isArray(t))return t.length?`${t.length} ×`:"";if(typeof t=="object"){const o=Object.keys(t).length;return o?`${o} ×`:""}const e=String(t).replace(/\s+/g," ").trim();return e.length>60?`${e.slice(0,60)}…`:e}function Oi(t,e){return e.split(".").reduce((o,n)=>o&&typeof o=="object"?o[n]:void 0,t)}function Bs(t,e){return!Array.isArray(t)||!e||typeof e!="object"?t||[]:t.map(o=>{if(o.parent||o.value!=null||o.var.includes(":"))return o;const n=Ii(Oi(e,o.var));return n?{...o,value:n}:o})}function Di(t,e){return Array.isArray(t)?t.map(o=>({...o,items:Bs(o.items,e)})):[]}function Hi(t,e,{inline:o=!1}={}){const n=String(t?.var||"").trim();if(!n)return null;if(o)return{text:`{{ ${n} }}`,cursor:`{{ ${n} }}`.length};if(t.loop)return{text:`{{ ${n} }}
  
{{ /${n} }}`,cursor:`{{ ${n} }}
  `.length};if(e?.loop&&!t.parent){const s=e.loop;return{text:`{{ ${s} }}
  {{ ${n} }}
{{ /${s} }}`,cursor:`{{ ${s} }}
  {{ ${n} }}`.length}}return{text:`{{ ${n} }}`,cursor:`{{ ${n} }}`.length}}const ve="visual_edit",Sn=[{id:"base",lang:"code_dock_visual_edit_base"},{id:"field",lang:"code_dock_visual_edit_field"}],Ps=[{id:"tag",group:"base",label:"{{ visual_edit }}",standalone:"{{ visual_edit| }}"},{id:"ve_popup",group:"base",label:"popup",attr:'popup="true"'},{id:"ve_orderable",group:"base",label:"orderable",attr:'orderable="true"'},{id:"ve_section_orderable",group:"base",label:"section_orderable",attr:'section_orderable="true"'},{id:"ve_outline_inside",group:"base",label:"outline_inside",attr:'outline_inside="true"'},{id:"ve_field",group:"field",label:"field",attr:'field="|"'},{id:"ve_inline_edit",group:"field",label:"inline_edit",attr:'inline_edit="true"'},{id:"ve_insertable",group:"field",label:"insertable",attr:'insertable="true"'},{id:"ve_toolbar",group:"field",label:"toolbar",attr:'toolbar="true"'},{id:"ve_scope",group:"field",label:"scope",attr:'scope="|"'},{id:"ve_controls",group:"field",label:"controls",attr:'controls="|"'}];function Wi(t){return Ps.find(e=>e.id===t)||null}function ji(t,e,o,n){let s=e;for(;s<o;){const r=t.indexOf("{{",s);if(r===-1||r>=o)return null;const i=t.indexOf("}}",r+2);if(i===-1||i+2>o)return null;const l=t.slice(r+2,i);if((l.trim().split(/\s+/)[0]||"")===n)return{openIdx:r,closeIdx:i,inner:l};s=i+2}return null}function zi(t,e){const o=String(e).split("=")[0].trim();return new RegExp(`(^|\\s)${o}(=|\\s|$)`).test(t)}const Ri={class:"sve-code-dock"},Ni={"data-sve-code-bar":""},qi={type:"button","data-sve-code-pane-btn":"html"},Vi={type:"button","data-sve-code-pane-btn":"css"},Ui={type:"button","data-sve-code-pane-btn":"alpine"},Ki={type:"button","data-sve-code-pane-btn":"js"},Gi={type:"button","data-sve-html-scope":"","aria-pressed":"true"},Xi=["innerHTML"],Yi={"data-sve-code-panes":""},Zi={"data-sve-code-pane":"html"},Ji={"data-sve-code-pane-label":""},Qi=["title","aria-label"],tl=["innerHTML"],el={"data-sve-code-pane":"css"},ol={"data-sve-css-chrome":"subrow-2"},nl={"data-sve-code-pane-label":""},sl={"data-sve-css-label":""},al={"data-sve-code-pane":"alpine"},rl={"data-sve-code-pane-label":""},il={"data-sve-code-pane":"js"},ll={"data-sve-code-pane-label":""},cl={__name:"CodeDockChrome",props:{htmlLabel:{type:String,required:!0},cssLabel:{type:String,required:!0},jsLabel:{type:String,required:!0},alpineLabel:{type:String,required:!0},treeIcon:{type:String,required:!0},dataIcon:{type:String,required:!0},dataLabel:{type:String,required:!0}},setup(t){return(e,o)=>(x(),_("div",Ri,[o[18]||(o[18]=v("div",{"data-sve-code-grip":"","aria-hidden":"true"},null,-1)),v("div",Ni,[v("button",qi,T(t.htmlLabel),1),v("button",Vi,T(t.cssLabel),1),v("button",Ui,T(t.alpineLabel),1),v("button",Ki,T(t.jsLabel),1),o[0]||(o[0]=mr('<button type="button" data-sve-code-back hidden></button><span data-sve-code-path></span><span data-sve-code-status></span><button type="button" data-sve-all></button><button type="button" data-sve-code-strip></button><button type="button" data-sve-code-history></button><button type="button" data-sve-style-mode></button><button type="button" data-sve-values-mode></button><button type="button" data-sve-code-autosave aria-pressed="true"></button><button type="button" data-sve-code-save hidden></button>',10)),v("button",Gi,[v("span",{innerHTML:t.treeIcon},null,8,Xi)]),o[1]||(o[1]=v("button",{type:"button","data-sve-code-lock":"",hidden:""},null,-1))]),o[19]||(o[19]=v("div",{"data-sve-code-lock-banner":""},null,-1)),v("div",Yi,[v("div",Zi,[v("div",Ji,[v("span",null,T(t.htmlLabel),1),o[2]||(o[2]=v("div",{"data-sve-html-tools":""},null,-1)),o[3]||(o[3]=v("button",{type:"button","data-sve-html-tidy":""},null,-1)),v("button",{type:"button","data-sve-data-vars":"",title:t.dataLabel,"aria-label":t.dataLabel},[v("span",{innerHTML:t.dataIcon},null,8,tl)],8,Qi),o[4]||(o[4]=v("div",{"data-sve-visual-edit-tools":""},null,-1)),o[5]||(o[5]=v("div",{"data-sve-antlers-tools":""},null,-1))]),o[6]||(o[6]=v("div",{"data-sve-html-problems":"",hidden:""},null,-1)),o[7]||(o[7]=v("div",{"data-sve-code-host":""},null,-1))]),o[15]||(o[15]=v("div",{"data-sve-code-split":"","data-sve-code-split-after":"html"},null,-1)),v("div",el,[v("div",ol,[v("div",nl,[v("span",sl,T(t.cssLabel),1),o[8]||(o[8]=v("button",{type:"button","data-sve-css-add-class":""},null,-1)),o[9]||(o[9]=v("div",{"data-sve-css-tools":""},null,-1))])]),o[10]||(o[10]=v("div",{"data-sve-css-head":""},null,-1)),o[11]||(o[11]=v("div",{"data-sve-code-host":""},null,-1)),o[12]||(o[12]=v("div",{"data-sve-tw-host":""},null,-1))]),o[16]||(o[16]=v("div",{"data-sve-code-split":"","data-sve-code-split-after":"css"},null,-1)),v("div",al,[v("div",rl,[v("span",null,T(t.alpineLabel),1)]),o[13]||(o[13]=v("div",{"data-sve-alpine-host":""},null,-1))]),o[17]||(o[17]=v("div",{"data-sve-code-split":"","data-sve-code-split-after":"alpine"},null,-1)),v("div",il,[v("div",ll,[v("span",null,T(t.jsLabel),1)]),o[14]||(o[14]=v("div",{"data-sve-code-host":""},null,-1))])])]))}},Gt=new Map;let Vt=null,wn=0,$n=0,Cn=!1;async function dl(t,e){if(Gt.has(e))return Gt.get(e);const o=`view:partials/${e}`;let n=null;try{const s=await t.fetch(`/!/sve/section-template?type=${encodeURIComponent(o)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}});if(s.ok){const r=await s.json();n=typeof r.html=="string"?fs(r.html):null}}catch{}return Gt.set(e,n),n}function ul(t){t?Gt.delete(t):Gt.clear()}function Io(t){const e=us(rt("dock:current-type")),o=e?rt("dock:html"):"",n=e&&typeof o=="string"?fs(o):null;rs({source:Ts,type:As.SVE_COMPONENT_FOCUS,on:!!n,name:e?String(e).split("/").pop():"",selector:n||""},t)}async function Ie(t){const e=++$n,o=rt("dock:html"),n=[...new Set((typeof o=="string"?hs(o):[]).map(r=>r.src).filter(r=>r&&!jr(r)))],s=await Promise.all(n.map(r=>dl(t,r)));e===$n&&rs({source:Ts,type:As.SVE_COMPONENT_MAP,items:n.map((r,i)=>({src:r,name:r.split("/").pop(),selector:s[i]})).filter(r=>r.selector)},t)}function fl(t){Vt=t,!Cn&&(Cn=!0,Pe("dock:html-changed",()=>{Vt&&(ul(us(rt("dock:current-type"))),Vt.clearTimeout(wn),wn=Vt.setTimeout(()=>{Ie(Vt)},400))}))}const hl=["data-sve-html-tool","data-tip","aria-label","data-letter","onClick","onContextmenu"],pl=["innerHTML"],ml={__name:"CodeDockHtmlTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(t){return(e,o)=>(x(!0),_(j,null,at(t.tools,n=>(x(),_("button",{key:n.id,type:"button","data-sve-html-tool":n.id,"data-tip":n.title,"aria-label":n.title,"data-letter":n.letter?"":void 0,onClick:F(s=>t.onTool(n.id),["prevent","stop"]),onContextmenu:F(s=>t.onTool(n.id),["prevent"])},[n.letter?(x(),_(j,{key:0},[ss(T(n.letter),1)],64)):(x(),_("span",{key:1,innerHTML:n.icon},null,8,pl))],40,hl))),128))}},ft=So({tools:[],onTool:null,onKid:null}),gl=["data-sve-css-item"],vl=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],bl={key:0,"data-sve-css-kids":""},yl={key:0,"data-sve-css-sep":"","aria-hidden":"true"},kl=["data-sve-css-kid","data-sve-css-box-side","data-tip","aria-label","innerHTML","onClick","onContextmenu"],xl={__name:"CodeDockCssTools",setup(t){return(e,o)=>(x(!0),_(j,null,at(S(ft).tools,n=>(x(),_("li",Qe({key:n.id,"data-sve-css-item":n.id},{ref_for:!0},n.open?{"data-sve-css-open":""}:{}),[v("button",Qe({type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title},{ref_for:!0},{...n.active?{"data-active":""}:{},...n.open?{"data-open":""}:{}},{innerHTML:n.icon,onClick:F(s=>S(ft).onTool?.(n.id),["prevent","stop"]),onContextmenu:F(s=>S(ft).onTool?.(n.id),["prevent"])}),null,16,vl),n.open&&n.kids.length?(x(),_("div",bl,[(x(!0),_(j,null,at(n.kids,s=>(x(),_(j,{key:s.id},[s.sep?(x(),_("span",yl)):W("",!0),v("button",Qe({type:"button","data-sve-css-kid":s.id,"data-sve-css-box-side":s.id,"data-tip":s.title,"aria-label":s.title},{ref_for:!0},s.active?{"data-active":""}:{},{innerHTML:s.icon,onClick:F(r=>S(ft).onKid?.(n.id,s.id),["prevent","stop"]),onContextmenu:F(r=>S(ft).onKid?.(n.id,s.id),["prevent"])}),null,16,kl)],64))),128))])):W("",!0)],16,gl))),128))}},_l=1.5,Sl=16;function _e(t,e){const o=parseFloat(t);return Number.isFinite(o)?e==="em"||e==="rem"?o*Sl:o:null}function wl(t){const e=String(t||"").toLowerCase();if(/\bmin-width\b|\bwidth\s*>=?/.test(e))return null;let o=e.match(/\bmax-width\s*:\s*([\d.]+)(px|em|rem)/);return o||(o=e.match(/\bwidth\s*<=?\s*([\d.]+)(px|em|rem)/),o)?_e(o[1],o[2]):(o=e.match(/([\d.]+)(px|em|rem)\s*>=?\s*width\b/),o?_e(o[1],o[2]):null)}function pt(t,e){const o=wl(t);if(o===null)return"";for(const n of e||[]){if(n.base)continue;const s=_e(String(n.max||"").replace(/[a-z]+$/i,""),(String(n.max||"").match(/[a-z]+$/i)||[""])[0]);if(s!==null&&Math.abs(s-o)<=_l)return n.handle}return""}function Oe(t){let e="",o=0;for(;o<t.length;){const n=De(t,o);if(n!==o){e+=" ".repeat(n-o),o=n;continue}e+=t[o],o+=1}return e}function De(t,e){if(t.startsWith("/*",e)){const o=t.indexOf("*/",e+2);return o===-1?t.length:o+2}if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?t.length:o+2}if(t[e]==='"'||t[e]==="'"){const o=t[e];for(let n=e+1;n<t.length;n+=1)if(t[n]==="\\")n+=1;else if(t[n]===o)return n+1;return t.length}return e}function He(t){const e=String(t||""),o=[],n=(s,r,i=0)=>{let l=s,c=l;for(;l<r;){const d=De(e,l);if(d!==l){l=d;continue}if(e[l]===";"){l+=1,c=l;continue}if(e[l]==="}")return;if(e[l]!=="{"){l+=1;continue}const f=Oe(e.slice(c,l)),h=f.trim(),m=Is(e,l,r);if(m===-1)return;/^@media\b/i.test(h)?o.push({query:h.replace(/^@media\s*/i,"").trim(),from:c+f.search(/\S/),to:m+1,bodyFrom:l+1,bodyTo:m,depth:i}):/^@(?:import|charset|use)\b/i.test(h)||n(l+1,m,i+1),l=m+1,c=l}};return n(0,e.length,0),o}function Is(t,e,o){let n=0;for(let s=e;s<o;s+=1){const r=De(t,s);if(r!==s){s=r-1;continue}if(t[s]==="{")n+=1;else if(t[s]==="}"&&(n-=1,n===0))return s}return-1}function Wt(t){const e=String(t||""),o=(n,s)=>{const r=[];let i=n,l=i;for(;i<s;){const c=De(e,i);if(c!==i){i=c;continue}if(e[i]===";"){i+=1,l=i;continue}if(e[i]==="}")return r;if(e[i]!=="{"){i+=1;continue}const d=Oe(e.slice(l,i)),f=d.trim(),h=Is(e,i,s);if(h===-1)return r;r.push({prelude:f,media:/^@media\b/i.test(f),query:f.replace(/^@media\s*/i,"").trim(),from:l+d.search(/\S/),to:h+1,bodyFrom:i+1,bodyTo:h,children:/^@(?:import|charset|use)\b/i.test(f)?[]:o(i+1,h)}),i=h+1,l=i}return r};return o(0,e.length)}function $l(t,e,o){const n=String(t||"");if(!o)return[];const s=(e||[]).find(d=>d.base),r=Wt(n),i=[],l=d=>d.media?pt(d.query,e)===o:d.children.some(l);if(s&&o===s.handle){const d=f=>{for(const h of f){if(h.media&&pt(h.query,e)){i.push({from:h.from,to:h.to});continue}d(h.children)}};return d(r),i}const c=(d,f,h)=>{const m=[];for(const y of d){if(y.media&&pt(y.query,e)===o){m.push({from:y.from,to:y.to,into:null});continue}l(y)&&m.push({from:y.from,to:y.to,into:y})}if(!m.length){h>f&&i.push({from:f,to:h});return}let b=f;for(const y of m)y.from>b&&i.push({from:b,to:y.from}),y.into&&c(y.into.children,y.into.bodyFrom,y.into.bodyTo),b=y.to;h>b&&i.push({from:b,to:h})};return c(r,0,n.length),i.filter(d=>n.slice(d.from,d.to).trim()!=="")}function Cl(t,e){const o=String(t||""),n=[],s=i=>{for(const l of i){if((l.media&&pt(l.query,e)||/^#id-/.test(l.prelude))&&Oe(o.slice(l.bodyFrom,l.bodyTo)).trim()===""){n.push(l);continue}s(l.children)}};if(s(Wt(o)),!n.length)return o;let r=o;for(const i of n.sort((l,c)=>c.from-l.from)){let l=i.from,c=i.to;const d=r.lastIndexOf(`
`,l-1)+1;for(r.slice(d,l).trim()===""&&(l=d);r[c]===" "||r[c]==="	";)c+=1;r[c]===`
`&&(c+=1),r=r.slice(0,l)+r.slice(c)}return r}function Al(t,e){const o=String(t||""),n=[],s=i=>Oe(o.slice(i.bodyFrom,i.bodyTo)).trim()==="",r=i=>{for(const l of i){if((l.media&&pt(l.query,e)||/^#id-/.test(l.prelude))&&s(l)){n.push({from:l.from,to:l.to});continue}r(l.children)}};return r(Wt(o)),n}function $e(t,e,o){const n=e||[],s=n.find(d=>d.base),r=[],i=d=>/^#id-/.test(d.prelude)||/^#\s*$/.test(d.prelude),l=(d,f)=>{for(const h of d){if(!h.media){l(h.children,f);continue}const m=pt(h.query,n)||f;if(o===m){r.push(h);continue}l(h.children,m)}},c=(d,f)=>{for(const h of d){if(h.media){c(h.children,pt(h.query,n)||f);continue}if(i(h)){const m=f||(s?s.handle:"");!o||o===m?r.push(h):l(h.children,m);continue}c(h.children,f)}};return c(Wt(String(t||"")),""),r.sort((d,f)=>d.from-f.from)}function Oo(t,e,o){return He(t).filter(n=>pt(n.query,e)===o)}const w=So({tag:"",scope:"",scopeElsewhere:[],scopeElsewhereTitle:"",onScopeImport:null,onTag:null,sizes:[],onSize:null,state:"",stateLabel:"",onState:null,canEdit:!1,note:""}),Tl={class:"sve-css-head"},Ml=["disabled"],El={key:1,class:"sve-css-scope"},Fl=["title","disabled"],Ll=["title","data-active","disabled","onClick"],Bl=["data-active","disabled"],Pl={key:3,class:"sve-css-note"},Il={__name:"CodeDockCssHead",setup(t){return(e,o)=>(x(),_("div",Tl,[S(w).tag?(x(),_("button",{key:0,type:"button",class:"sve-css-tag",disabled:!S(w).canEdit,onClick:o[0]||(o[0]=F(()=>{},["prevent","stop"])),onDblclick:o[1]||(o[1]=F(n=>S(w).onTag?.(n),["prevent","stop"]))},"<"+T(S(w).tag)+">",41,Ml)):W("",!0),S(w).scope?(x(),_("span",El,T(S(w).scope),1)):W("",!0),S(w).scope&&S(w).scopeElsewhere.length?(x(),_("button",{key:2,type:"button",class:"sve-css-scope-taken",title:S(w).scopeElsewhereTitle,disabled:!S(w).canEdit,onClick:o[2]||(o[2]=F(n=>S(w).onScopeImport?.(),["prevent","stop"]))},T(S(w).scopeElsewhere.join(", ")),9,Fl)):W("",!0),(x(!0),_(j,null,at(S(w).sizes,n=>(x(),_("button",{key:n.key,type:"button","data-sve-css-size":"",title:n.title,"data-active":n.active?"":void 0,disabled:!S(w).canEdit,onClick:F(s=>S(w).onSize?.(n.key),["prevent","stop"])},T(n.label),9,Ll))),128)),v("button",{type:"button","data-sve-css-state":"","data-active":S(w).state?"":void 0,disabled:!S(w).canEdit,onClick:o[3]||(o[3]=F(n=>S(w).onState?.(n),["prevent","stop"]))},[ss(T(S(w).stateLabel)+" ",1),o[4]||(o[4]=v("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[v("path",{d:"m6 9 6 6 6-6"})],-1))],8,Bl),o[5]||(o[5]=v("span",{class:"sve-css-gap"},null,-1)),S(w).note?(x(),_("span",Pl,T(S(w).note),1)):W("",!0)]))}},Ol=Cs(Il,[["__scopeId","data-v-22565303"]]),Dl={key:0,"data-sve-css-swatches":""},Hl=["data-sve-css-token","title","data-active","onClick"],Wl={key:0,"data-sve-css-head-row":""},jl={key:1,"data-sve-css-note-row":""},zl=["data-sve-css-token","data-active","onClick"],Rl={"data-sve-css-choice-label":""},Nl={key:0,"data-sve-css-choice-hint":""},et={__name:"CodeDockMenu",props:{kind:{type:String,required:!0},swatches:{type:Array,default:()=>[]},choices:{type:Array,default:()=>[]},onClear:{type:Function,default:null},onPick:{type:Function,required:!0}},setup(t){return(e,o)=>t.kind==="colors"?(x(),_("div",Dl,[v("button",{type:"button","data-sve-css-clear":"",title:"Clear",onClick:o[0]||(o[0]=F((...n)=>t.onClear&&t.onClear(...n),["prevent","stop"]))},[...o[1]||(o[1]=[v("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none",stroke:"currentColor","stroke-width":"1.5"},[v("path",{d:"M2 2l6 6M8 2L2 8"})],-1)])]),(x(!0),_(j,null,at(t.swatches,n=>(x(),_("button",{key:n.name,type:"button","data-sve-css-swatch":"","data-sve-css-token":n.name,title:n.name,"data-active":n.active?"":void 0,style:gr({background:n.hex||"transparent"}),onClick:F(s=>t.onPick(n.name),["prevent","stop"])},null,12,Hl))),128))])):(x(!0),_(j,{key:1},at(t.choices,n=>(x(),_(j,{key:n.value},[n.heading?(x(),_("span",Wl,T(n.label),1)):n.note?(x(),_("span",jl,T(n.label),1)):(x(),_("button",{key:2,type:"button","data-sve-css-choice":"","data-sve-css-token":n.token||void 0,"data-active":n.active?"":void 0,onClick:F(s=>t.onPick(n.value),["prevent","stop"])},[v("span",Rl,T(n.label),1),n.hint?(x(),_("span",Nl,T(n.hint),1)):W("",!0)],8,zl))],64))),128))}},ql=2e4;let St=[],Os=0,Kt=null,oo=null;function Ds(){return oo||(oo=qt.define()),oo}function Hs(){return!!Kt&&Date.now()-Os<ql}function Do(t){return Hs()||(Os=Date.now(),Kt=t.fetch("/!/sve/site-css/defined",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{defined:[]}).then(e=>(St=Array.isArray(e?.defined)?e.defined:[],g.html?.dispatch({effects:Ds().of(null)}),St)).catch(()=>(Kt=null,St))),Kt}function We(t){return t.document.getElementById(u)?.querySelector("[data-sve-code-path]")?.textContent.trim()||""}function Vl(t,e){const o=We(t),n=new Map;for(const s of St){const r=n.get(s.name)||new Set;r.add(s.file===o?e:String(s.file).replace(/^.*\//,"")),n.set(s.name,r)}return[...n].map(([s,r])=>({name:s,detail:[...r].join(", ")})).sort((s,r)=>s.name.localeCompare(r.name))}function Ho(t,e){const o=We(t);return e?St.filter(n=>n.name===e&&n.file!==o):[]}const Ws=t=>[...new Set(t.map(e=>String(e.file).replace(/^.*\//,"")))];function Wo(t,e){const o=Ho(t,e).map(r=>r.css).filter(Boolean).join(`
`);if(!o)return!1;const n=rt("dock:css");if(typeof n!="string")return!1;const s=zr(n,e,o);return s!==n&&rt("dock:set-css",s)!==!1}function Ul(t,e){const o=t.doc.lineAt(e),n=e-o.from,s=/\bclass\s*=\s*(["'])/gi;let r;for(;r=s.exec(o.text);){const i=r[1],l=r.index+r[0].length,c=o.text.indexOf(i,l),d=c===-1?o.text.length:c;if(n<l||n>d)continue;const f=o.text.slice(l,d),h=Rr(f),m=n-l;if(!h||m<h.innerFrom||m>h.innerTo)return null;const b=(f.slice(h.innerFrom,m).match(/[\w-]*$/)||[""])[0];return{from:e-b.length,typed:b}}return null}function Kl(t){return e=>{const o=Ul(e.state,e.pos);return!o||!o.typed&&!e.explicit?null:Do(t).then(n=>{const s=We(t),r=o.typed.toLowerCase(),i=new Map;for(const c of n){if(c.file===s||!String(c.name).toLowerCase().startsWith(r))continue;const d=i.get(c.name)||{files:[],css:[]};d.files.push(c),c.css&&d.css.push(c.css),i.set(c.name,d)}if(!i.size)return null;const l=[...i].slice(0,40).map(([c,d])=>({label:c,type:"class",detail:Ws(d.files).join(", "),info:d.css.length?()=>{const f=t.document.createElement("pre");return f.textContent=d.css.join(`
`),f.style.cssText="margin:0;padding:.3em .5em;font:11px ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap",f}:void 0,apply:(f,h,m,b)=>{f.dispatch({changes:{from:m,to:b,insert:c},selection:{anchor:m+c.length}}),t.setTimeout(()=>Wo(t,c),0)}}));return{from:o.from,options:l,validFor:/^[\w-]*$/}})}}function Gl(t){const e=o=>{if(!St.length)return tt.none;const n=We(t),s=new ut;for(const r of re(o)){const i=St.filter(l=>l.name===r.name&&l.file!==n);i.length&&s.add(r.from,r.to,tt.mark({class:"sve-cm-class-taken",attributes:{title:p(t,"class_defined_in",{file:Ws(i).join(", ")})}}))}return s.finish()};return dt.define({create:o=>e(o.doc.toString()),update:(o,n)=>n.docChanged||n.effects.some(s=>s.is(Ds()))?e(n.state.doc.toString()):o,provide:o=>B.decorations.from(o)})}const Xl=/^\.[a-zA-Z_][\w-]*$/;function Yl(t,e,o){return String(e||"").includes(o)?Ce(t).length===1:!1}function Ce(t){return Wt(t).filter(e=>/^@scope\b/i.test(e.prelude))}function Zl(t){const e=String(t||"");return Wt(e).filter(o=>Xl.test(o.prelude)?!e.slice(o.from,o.bodyFrom-1).includes("{{"):!1).map(o=>({from:o.from,to:o.to,name:o.prelude.slice(1)}))}function Jl(t,e,o){const n=String(t||"");if(!Yl(n,e,o))return n;const s=Zl(n);if(!s.length)return n;const r=Ce(n)[0],i=ec(n,r),l=s.map(m=>oc(n.slice(m.from,m.to),n,m.from,i)).join(`

`);let c=n;for(const m of[...s].sort((b,y)=>y.from-b.from))c=tc(c,m.from,m.to);const d=Ql(c,o);if(d===-1)return n;const f=(c.slice(0,d).match(/\n([^\S\n]*)$/)||[null,null])[1],h=f===null?d:d-f.length;return`${c.slice(0,h)}
${l}
${f??""}${c.slice(d)}`}function Ql(t,e){const o=Ce(t).find(n=>n.prelude.includes(e));return o?o.bodyTo:Ce(t)[0]?.bodyTo??-1}function tc(t,e,o){let n=e,s=o;const r=t.lastIndexOf(`
`,n-1)+1;for(t.slice(r,n).trim()===""&&(n=r);t[s]===" "||t[s]==="	";)s+=1;return t[s]===`
`&&(s+=1),t.slice(0,n)+t.slice(s)}function ec(t,e){const o=t.slice(e.bodyFrom,e.bodyTo).match(/\n([^\S\n]+)\S/);return o?o[1]:`${(t.slice(0,e.from).match(/\n([^\S\n]*)$/)||[null,""])[1]}    `}function oc(t,e,o,n){const s=(e.slice(0,o).match(/\n([^\S\n]*)$/)||[null,""])[1];return t.split(`
`).map((r,i)=>i===0?n+r.trim():r.startsWith(s)?n+r.slice(s.length):n+r.trimStart()).join(`
`)}const nc={"data-sve-css-add-label":""},sc=["placeholder","onKeydown"],ac={key:0,"data-sve-css-add-hint":""},rc={"data-sve-css-add-existing":""},ic={"data-sve-css-add-list":""},lc=["onClick"],cc={"data-sve-css-add-name":""},dc={"data-sve-css-add-detail":""},uc={key:0,"data-sve-css-add-none":""},fc=["disabled"],jo={__name:"CodeDockAddClass",props:{label:{type:String,required:!0},placeholder:{type:String,default:""},initial:{type:String,default:""},onAdd:{type:Function,required:!0},options:{type:Array,default:()=>[]},onPick:{type:Function,default:null},takenText:{type:Function,default:null},existingLabel:{type:String,default:""},createLabel:{type:String,default:""},onClose:{type:Function,default:null}},setup(t){const e=t,o=un(e.initial||""),n=un(null);vr(()=>br(()=>{n.value?.focus(),n.value?.select()}));const s=to(()=>o.value.trim().toLowerCase()),r=to(()=>{if(!e.options.length)return[];const c=s.value,d=[],f=[];for(const h of e.options){const m=h.name.toLowerCase();!c||m.startsWith(c)?d.push(h):m.includes(c)&&f.push(h)}return[...d,...f].slice(0,8)}),i=to(()=>e.takenText&&s.value?e.takenText(o.value.trim()):"");function l(){const c=o.value.trim();if(!c){n.value?.focus();return}if(i.value&&e.onPick){e.onPick(c);return}e.onAdd(c)}return(c,d)=>(x(),_(j,null,[v("label",nc,T(t.label),1),yr(v("input",{ref_key:"input",ref:n,"data-sve-css-add-input":"","onUpdate:modelValue":d[0]||(d[0]=f=>o.value=f),type:"text",placeholder:t.placeholder,onKeydown:[fn(F(l,["prevent"]),["enter"]),d[1]||(d[1]=fn(F(f=>t.onClose?.(),["stop","prevent"]),["escape"]))]},null,40,sc),[[kr,o.value]]),i.value?(x(),_("div",ac,T(i.value),1)):W("",!0),t.options.length?(x(),_(j,{key:1},[v("div",rc,T(t.existingLabel),1),v("div",ic,[(x(!0),_(j,null,at(r.value,f=>(x(),_("button",{key:f.name,type:"button","data-sve-css-add-option":"",onMousedown:d[2]||(d[2]=F(()=>{},["prevent"])),onClick:F(h=>t.onPick?.(f.name),["prevent","stop"])},[v("span",cc,T(f.name),1),v("span",dc,T(f.detail),1)],40,lc))),128)),r.value.length?W("",!0):(x(),_("div",uc,"—"))]),v("button",{type:"button","data-sve-css-add-create":"",disabled:!!i.value||!s.value,onMousedown:d[3]||(d[3]=F(()=>{},["prevent"])),onClick:F(l,["prevent","stop"])},T(t.createLabel),41,fc)],64)):W("",!0)],64))}};function An(t,e){e._sveLockBound||(e._sveLockBound=!0,e.querySelector("[data-sve-code-lock]")?.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),!(!a.lockReady||!a.lastType)){if(a.lastLocked){pc(t);return}js(t,!0)}}))}function zo(t){return t?Y(t,sr)!=="0":!0}function hc(){const t=g.html;return!t||t.state.readOnly||!a.lastType?!1:!Xo(Go(),a.lastParts)}function Q(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-code-autosave]"),n=e?.querySelector("[data-sve-code-save]");if(!o||!n)return;const s=zo(t),r=hc();o.setAttribute("aria-pressed",s?"true":"false"),o.title=p(t,s?"code_dock_autosave_on":"code_dock_autosave_off"),o.setAttribute("aria-label",o.title),o.innerHTML=If,n.hidden=s,n.title=p(t,"code_dock_save"),n.setAttribute("aria-label",n.title),n.innerHTML=Of,r?n.setAttribute("data-dirty",""):n.removeAttribute("data-dirty")}function Tn(t,e){e._sveAutosaveBound||(e._sveAutosaveBound=!0,e.querySelector("[data-sve-code-autosave]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=!zo(t);q(t,sr,n?"1":"0"),n?z(t.document):a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null),Q(t)}),e.querySelector("[data-sve-code-save]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),z(t.document)}))}function pc(t){t.document.getElementById(K)?.remove();const e=ki(t.document,xi,{title:p(t,"code_dock_unlock_title"),body:p(t,"code_dock_unlock_body"),buttons:[{value:"cancel",label:p(t,"cancel"),variant:"ghost"},{value:"ok",label:p(t,"code_dock_unlock_confirm"),variant:"primary"}],onPick:o=>{e.dismiss(),o==="ok"&&js(t,!1)}});e.host.id=K}function js(t,e){const o=a.lastType;if(!o)return;const n=()=>{a.lastType===o&&t.fetch("/!/sve/section-template/lock",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":as(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:o,locked:e})}).then(async s=>{if(!s.ok)throw new Error(String(s.status));a.lastType===o&&(a.lastLocked=e,wt(t),zt(a.lastParts,e),R(t),O(t.document,e?p(t,"code_dock_locked"):""))}).catch(()=>{O(t.document,p(t,"code_dock_error"))})};if(e&&(z(t.document),a.saveInFlight)){a.saveInFlight.finally(n);return}n()}function Qt(t,e){const o=String(e||"");if(/^(header|footer)\//.test(o))return!0;const n=t?.Statamic?.$config?.get?.("sveChromeTemplates")||{};return Object.values(n).some(s=>s&&s.type===o)}function Ae(t){const e=a.lastType;if(!a.lastUid||!e||String(e).startsWith("view:")||Qt(t,e)){pn(t);return}const o=Cr(a.lastUid,t.document);pn(t,o.length?{sectionUids:o}:void 0)}function mc(t,e,o){return a.saveInFlight=t.fetch("/!/sve/section-template",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":as(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:e,html:o.html,css:o.css,js:o.js,...typeof o.tw=="string"?{tw:o.tw}:{},...Nr(t)?{props:a.lastProps}:{}})}).then(async n=>{if(n.status===423){a.lastLocked=!0,a.lockReady=!0,wt(t),zt(a.lastParts,!0),R(t),O(t.document,p(t,"code_dock_locked"));return}const s=await n.json().catch(()=>({}));if(!n.ok)throw new Error(s?.error==="not_writable"?"not_writable":String(n.status));if(a.lastType===e){if(a.lastParts=o,s?.tw_written===!1){a.twDirty=!0,O(t.document,p(t,"code_dock_tw_not_writable")),Q(t),Ae(t);return}O(t.document,p(t,"code_dock_saved")),Q(t),t.setTimeout(()=>{const r=t.document.getElementById(u)?.querySelector("[data-sve-code-status]");r&&r.textContent===p(t,"code_dock_saved")&&(r.textContent="")},1800)}Ae(t),t.document.getElementById("__sve-section-picker")?.dispatchEvent(new t.CustomEvent("sve-library-stale"))}).catch(n=>{O(t.document,p(t,n?.message==="not_writable"?"code_dock_not_writable":"code_dock_error"))}).finally(()=>{a.saveInFlight=null}),a.saveInFlight}function z(t){a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null);const e=a.lastType,o=a.lastWin,n=g.html;if(!n||n.state.readOnly||!e||!o||!a.lockReady)return;const s=Go(),r=a.twCss!==null&&ps(o)&&Ro(s.html)===a.twKey;Xo(s,a.lastParts)&&!(r&&a.twDirty)&&!a.propsDirty||(a.propsDirty=!1,r&&(s.tw=a.twCss,a.twDirty=!1),O(t,p(o,"code_dock_saving")),mc(o,e,s))}function Ro(t){return _i(t).sort().join(" ")}function zs(){a.twCss=null,a.twKey="",a.twDirty=!1}function gc(t,e){a.twCss=e,a.twKey=Ro(t),a.twDirty=!1}function Rs(t,e){if(!t||!ps(t))return;const o=Ro(e);o===a.twKey||a.twBusy||(a.twBusy=!0,xr(()=>import("./tw-compile-CgCrQIlW.js"),__vite__mapDeps([0,1]),import.meta.url).then(n=>n.compileTailwind(t,e)).then(n=>{a.twBusy=!1,a.twCss=n,a.twKey=o,a.twDirty=!0,Ns(t,t.document)}).catch(n=>{a.twBusy=!1,console.error("[sve] tailwind compile",n)}))}function Ns(t,e){a.saveTimer&&clearTimeout(a.saveTimer),a.saveTimer=t.setTimeout(()=>{a.saveTimer=null,z(e)},Ef)}function X(t){if(a.applying)return;const e=Go();if(Xo(e,a.lastParts)){Q(t);return}if(Q(t),Rs(t,e.html),!zo(t)){O(t.document,p(t,"code_dock_unsaved"));return}O(t.document,p(t,"code_dock_saving")),Ns(t,t.document)}function No(t,e){let o=0;const n=Math.min(t.length,e.length);for(;o<n&&t[o]===e[o];)o+=1;let s=t.length,r=e.length;for(;s>o&&r>o&&t[s-1]===e[r-1];)s-=1,r-=1;return[o,s,e.slice(o,r)]}const vc='<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M2.5 3.5h11M2.5 8h11M2.5 12.5h7"/></svg>';function qo(){const t=!!a.htmlScopePref;return{html:t,css:t&&a.styleMode!=="tw"&&!a.lastLocked}}function qs(){return a.htmlAll||qo().css&&a.cssAll}function At(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-all]");if(!e)return;const o=qo(),n=qs(),s=t.document.createElement("span");s.textContent=p(t,"code_dock_all"),e.innerHTML=vc,e.appendChild(s),e.title=p(t,n?"code_dock_all_off":o.css?"code_dock_all_on":o.html?"code_dock_all_on_html":"code_dock_all_none"),e.setAttribute("aria-label",e.title),e.setAttribute("aria-pressed",n?"true":"false")}const co={};function bc(t){return co[t]=new C.state.Compartment,co[t].of(ln())}function Vo(t){const e=g[t],o=co[t];!e||!o||(e.dispatch({effects:o.reconfigure([])}),e.dispatch({effects:o.reconfigure(ln())}))}function Vs(t){const e=a.lastUid,o=typeof U=="function"?U(t.document):[];for(const n of o){const s=mt(n.values)||n.values;if(!(!s||typeof s!="object")&&e&&typeof hn=="function"){const r=hn(s,e);if(r){const i=r.split("."),l=_r(s,i.slice(0,2).join("."));if(l&&typeof l=="object")return l}}}for(const n of o){const s=mt(n.values)||n.values;if(s&&typeof s=="object")return s}return null}function Us(t,e){!e||e===a.lastType||(z(t.document),Nt(t,e,"push"))}function Ks(t){const e=a.typeStack.pop();if(!e){Dt(t);return}z(t.document),Nt(t,e,"keep")}function wt(t){const e=t.document.getElementById(u),o=e?.querySelector("[data-sve-code-lock]"),n=e?.querySelector("[data-sve-code-lock-banner]");if(!e||!o)return;const s=a.lastLocked;e.toggleAttribute("data-sve-code-locked",s),At(t),s&&(ys(t.document),nt(t.document),a.htmlPartialUi&&(a.htmlPartialUi.setHover(g.html,null),a.htmlPartialUi.setHover(g.css,null)),a.htmlClassTokenUi?.setHover(g.html,null)),o.hidden=!a.lockReady,o.setAttribute("aria-pressed",a.lastLocked?"true":"false"),o.title=p(t,a.lastLocked?"code_dock_unlock":"code_dock_lock"),o.setAttribute("aria-label",o.title),o.innerHTML=a.lastLocked?Ff:Lf,n&&(n.textContent=p(t,"code_dock_locked_banner"))}function le(t){return t?Y(t,Ye)!=="0":a.htmlScopePref}function $t(t,e,o){return t!=null&&e!=null&&t>=0&&e>t&&e<=o}function Z(){const t=globalThis.document?.getElementById(u);t&&(t.__sveHtmlScope=a.htmlScopeActive&&a.htmlFocus?{full:a.htmlFull,from:a.htmlFocus.from,to:a.htmlFocus.to,get css(){return uo()}}:a.htmlAll&&a.cssPane==="tree"?{get css(){return uo()}}:null)}function Tt(){const t=g.html?.state.doc.toString()??"";if(!a.htmlScopeActive||!a.htmlFocus){a.htmlFull=t,Z();return}if(a.htmlFocus.from<0||a.htmlFocus.from>a.htmlFull.length||a.htmlFocus.to<a.htmlFocus.from){a.htmlScopeActive=!1,a.htmlFull=t,a.htmlFocus=null,Z();return}a.htmlFull=a.htmlFull.slice(0,a.htmlFocus.from)+t+a.htmlFull.slice(a.htmlFocus.to),a.htmlFocus={from:a.htmlFocus.from,to:a.htmlFocus.from+t.length},Z()}function gt(){return Tt(),a.htmlScopeActive?a.htmlFull:g.html?.state.doc.toString()??a.lastParts.html??""}function je(){a.lastBracketNames=re(gt()).map(t=>t.name)}function jt(){a.lastCssSelectorNames=bs(g.css?.state.doc.toString()??a.cssFull)}function Gs(t,e){return Array.isArray(t)&&Array.isArray(e)&&t.length===e.length&&t.every((o,n)=>o===e[n])}function Xs(t,e){a.cssFull=Ur(a.cssFull,t,e),a.cssFull=Kr(a.cssFull,e,t)}function yc(t){if(a.applying||a.lastLocked||a.lastBracketNames==null)return;const e=re(gt()).map(o=>o.name);Gs(a.lastBracketNames,e)||(Xs(a.lastBracketNames,e),a.lastBracketNames=e,vt(),jt())}function kc(){if(a.applying||a.lastLocked||a.lastCssSelectorNames==null||a.lastBracketNames==null||a.cssPane==="empty")return;const t=g.html,e=g.css?.state.doc.toString()??"";if(!vs(e))return;const o=bs(e);if(!t||Gs(a.lastCssSelectorNames,o))return;const n=new Set(a.lastBracketNames),{renamed:s,added:r,removed:i}=qr(a.lastCssSelectorNames,o);let l=t.state.doc.toString();const c=l;for(const d of s){const f=Bt(d.to);!n.has(d.from)||!f||(l=bn(l,h=>h===d.from?f:h))}for(const d of i)!n.has(d)||o.includes(d)||(l=bn(l,f=>f===d?"":f));if(l=xc(l,r,n,e),l!==c){a.applying=!0;try{de(l)}finally{a.applying=!1}}je(),a.lastCssSelectorNames=o}function xc(t,e,o,n){if(!e.length||a.cssPane!=="tree")return t;Tt();const s=a.cssFocus?.path,r=a.htmlScopeActive&&!!a.htmlFocus;if(!s&&!r)return t;const i=r?a.htmlFocus.from:0,l=r?a.htmlFull.slice(0,i)+t+a.htmlFull.slice(a.htmlFocus.to):t,c=Ht(ie(l),new Set),d=s?c.find(y=>y.path===s):c.find(y=>y.from===i);if(!d||d.from<i||d.openTo-i>t.length)return t;const f=new Set(re(l).map(y=>y.name)),h=d.from-i;let m=d.openTo-i,b=t;for(const y of e){const L=Bt(y);!L||o.has(L)||f.has(L)||!Gr(n,L)||({html:b,to:m}=Xr(b,h,m,L),f.add(L))}return b}function _c(t,e){const o=Bt(e),n=g.html;if(!o||!n||n.state.readOnly||o===t.name)return;a.applying=!0;try{n.dispatch({changes:{from:t.from,to:t.to,insert:o}})}finally{a.applying=!1}const s=a.lastBracketNames==null?[]:a.lastBracketNames.slice();je(),Xs(s,a.lastBracketNames),vt(),jt(),a.lastWin&&(X(a.lastWin),E(a.lastWin))}function Sc(t,e){const o=t.document,s=g.html?.coordsAtPos(e.from);$(o),nt(o);const r=o.createElement("div"),i={getBoundingClientRect:()=>({left:s?.left??12,right:s?.right??12,top:s?.top??12,bottom:s?.bottom??12,width:0,height:0})};r.id=k,o.body.appendChild(r),D(t,i,r),r._sveApp=H(jo,r,{label:p(t,"code_dock_css_rename_class"),placeholder:p(t,"code_dock_css_class_placeholder"),initial:e.name,onAdd:l=>{_c(e,l),$(o)}})}function Ys(){return a.htmlScopePref&&!a.htmlAll&&$t(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)?(a.htmlScopeActive=!0,Z(),a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to)):(a.htmlScopeActive=!1,Z(),a.htmlFull)}function ce(t,e,o){const n=g[t];if(!n)return;const s=n.state.doc.toString();a.applying=!0;try{if(s!==e){const[r,i,l]=No(s,e);n.dispatch({changes:{from:r,to:i,insert:l},...o?{selection:o,scrollIntoView:!0}:{}})}else o&&n.dispatch({selection:o,scrollIntoView:!0})}finally{a.applying=!1}}function de(t,e){ce("html",t,e)}function Zs(){if(a.htmlScopeActive)return g.html?.state.doc.toString()??"";if(a.htmlAll){const t=g.html?.state.doc.toString()??"";return $t(a.htmlFocus?.from,a.htmlFocus?.to,t.length)?t.slice(a.htmlFocus.from,a.htmlFocus.to):""}return $t(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)?a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to):""}function Js(){const t=a.cssFocus?.path;if(!t)return null;const e=gt(),o=Ht(ie(e),new Set).find(n=>n.path===t);return o?e.slice(o.from,o.to):(a.cssFocus=null,null)}function wc(){return Js()??Zs()}function bh(){a.cssFocus=null}function $c(t){if(!t||a.applying||a.cssValues)return;const e=g.html;if(!e)return;Tt(),V();const o=a.htmlScopeActive&&!!a.htmlFocus,s=(o?a.htmlFocus.from:0)+e.state.selection.main.from;let r=null;for(const l of Ht(ie(a.htmlFull),new Set))l.from<=s&&s<l.to&&(r=l);!r||s<r.from||s>=r.openTo||(a.cssFocus?a.cssFocus.path===r.path:o&&a.htmlFocus.from===r.from&&a.htmlFocus.to===r.to)||(a.cssFocus={path:r.path},vt())}function Cc(){const t=g.html?.state.doc.toString(),e=a.htmlFocus;return t!=null&&a.htmlScopeActive&&e&&e.from>=0&&e.from<=a.htmlFull.length&&e.to>=e.from?a.htmlFull.slice(0,e.from)+t+a.htmlFull.slice(e.to):t??a.lastParts.html??""}function uo(){const t=g.css?.state.doc.toString();if(t==null)return a.cssFull;if(a.cssPane==="tree"){if(t===a.cssScopeSnapshot)return a.cssFull;const e=Mo(wc())[0]?.className||Vr(t);return gs(a.cssFull,t,e,{previous:a.cssScopeSnapshot,keep:re(Cc()).map(o=>o.name)})}return a.cssPane==="full"?t:a.cssFull}function V(){const t=g.css?.state.doc.toString()??"";if(a.cssPane==="tree"){if(t===a.cssScopeSnapshot||!vs(t))return;a.cssFull=uo(),a.cssScopeSnapshot=t}else a.cssPane==="full"&&(a.cssFull=t)}function Ac(t,e){return(e||[]).some(o=>!Eo(t,o.className))}function vt(){let t=a.cssFull,e=[],o=!1;const n=Js(),s=n==null&&!a.htmlScopeActive&&!(a.htmlAll&&a.htmlFocus);a.cssValues||a.cssAll||!a.htmlScopePref?(a.cssPane="full",t=a.cssFull):(e=Mo(n??(s?gt():Zs())),e.length?(a.cssPane="tree",t=ms(a.cssFull,e),!a.cssFocus&&!s&&Ac(a.cssFull,e)&&(a.cssFull=gs(a.cssFull,t,e[0].className),o=!0)):(a.cssPane="empty",t="")),a.cssScopeSnapshot=t,ce("css",t),jt(),a.lastWin&&(Rt(a.lastWin,!0),E(a.lastWin),o&&X(a.lastWin))}function ze(t){const e=g.html;if(!e||!a.htmlFocus)return;a.htmlAll=!1,a.htmlScopeActive||(a.htmlFull=e.state.doc.toString());const o=a.htmlFull.length,n=Math.max(0,Math.min(a.htmlFocus.from,o)),s=Math.max(n,Math.min(a.htmlFocus.to,o));if(s<=n)return;a.htmlFocus={from:n,to:s},a.htmlScopeActive=!0,Z();const r=t==null?0:Math.max(0,Math.min(t-n,s-n));de(a.htmlFull.slice(n,s),{anchor:r,head:r}),Vo("html"),vt(),e.focus()}function Uo(t=!0,e=null){const o=g.html;if(!o)return;V(),Tt(),a.htmlScopeActive=!1,a.htmlAll=!1,Z();const n=a.htmlFull||o.state.doc.toString(),s=e!=null?{anchor:Math.max(0,Math.min(e,n.length))}:t&&$t(a.htmlFocus?.from,a.htmlFocus?.to,n.length)?{anchor:a.htmlFocus.from,head:a.htmlFocus.to}:null;a.htmlFull=n,de(n,s),Vo("html"),a.cssPane="full",a.cssScopeSnapshot=a.cssFull,ce("css",a.cssFull),jt()}function Mn(t,e){const o=g.html;if(!o||!!e===a.htmlAll){At(t);return}if(e){Tt();const n=a.htmlFull||o.state.doc.toString(),s=$t(a.htmlFocus?.from,a.htmlFocus?.to,n.length)?a.htmlFocus:null;a.htmlScopeActive=!1,a.htmlFull=n,Z(),de(n,s?{anchor:s.from}:null),Vo("html"),a.htmlAll=!0}else{const n=o.state.doc.length;$t(a.htmlFocus?.from,a.htmlFocus?.to,n)?(V(),ze(null)):(a.htmlAll=!1,a.htmlFocus=null,V(),vt())}R(t)}function ue(){a.htmlFocus=null,a.htmlAll=!1,a.cssFocus=null,a.htmlScopeActive=!1,a.htmlFull="",a.cssFull="",a.cssPane="full",a.cssScopeSnapshot="",a.lastBracketNames=null,a.lastCssSelectorNames=null,Z()}let te=!1;function Lt(t){return!!t?.document.getElementById(os)}function fo(t,e){if(!(!t||wo(t,"html_tree")===!1)){if(!e){Lt(t)&&is(t);return}Lt(t)||(te=!0,Ar("html_tree").then(()=>{Lt(t)||Tr(t)}).catch(()=>{}).finally(()=>{te=!1,R(t)}))}}function R(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-html-scope]");if(!e)return;a.htmlScopePref=le(t);const o=wo(t,"html_tree")===!1?a.htmlScopePref:Lt(t)||te;e.setAttribute("aria-pressed",o?"true":"false"),e.title=p(t,o?"code_dock_html_scope_off":"code_dock_html_scope"),e.setAttribute("aria-label",e.title),e.innerHTML=ir,t.document.getElementById(u)?.toggleAttribute("data-sve-html-scoped",a.htmlScopeActive),Z(),At(t)}function En(t,e){e._sveHtmlScopeBound||(e._sveHtmlScopeBound=!0,a.htmlScopePref=le(t),Tc(t,e),fo(t,a.htmlScopePref),e.querySelector("[data-sve-html-scope]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=Lt(t)||te;a.htmlScopePref=!n,q(t,Ye,a.htmlScopePref?"1":"0"),a.htmlScopePref?a.htmlFocus&&(V(),ze()):(a.htmlScopeActive||a.htmlAll)&&Uo(),fo(t,a.htmlScopePref),R(t)}))}function Tc(t,e){e._sveTreeWatchBound||(e._sveTreeWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>{if(te||wo(t,"html_tree")===!1||!t.document.getElementById(u))return;const o=Lt(t);o!==le(t)&&(a.htmlScopePref=o,q(t,Ye,o?"1":"0"),o?a.htmlFocus&&(V(),ze()):(a.htmlScopeActive||a.htmlAll)&&Uo(),R(t))}))}const Mc=new Set(["pre","textarea","script","style"]),Ec=/^(<\/|\{\{\s*\/)/;function Fc(t){let e=0;for(const o of t.split(`
`)){if(!o.trim())continue;const n=o.length-o.trimStart().length;n>0&&(e===0||n<e)&&(e=n)}return" ".repeat(e===2||e===3?e:4)}function Lc(t){const e=String(t||"");if(!e.trim())return e;const o=[],n=l=>{for(const c of l||[])o.push(c),n(c.children)};n(ks(e));const s=Fc(e),r=[];let i=0;for(const l of e.split(`
`)){const c=i,d=l.trim();i+=l.length+1;const f=c+(l.length-l.trimStart().length),h=o.filter(b=>b.from<f&&f<b.to);if(h.some(b=>Mc.has(b.tag))){r.push(l);continue}if(!d)continue;const m=h.length-(Ec.test(d)?1:0);r.push(s.repeat(Math.max(m,0))+d)}return r.join(`
`)+(e.endsWith(`
`)?`
`:"")}function ho(t,e){let o=0;for(;o<e;){const n=Bc(t,o);if(n===null){o+=1;continue}if(n===-1)return e;if(n>e)return n;o=n}return e}function Bc(t,e){if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?-1:o+2}if(t.startsWith("<!--",e)){const o=t.indexOf("-->",e+4);return o===-1?-1:o+3}return t[e]==="<"&&/[A-Za-z/!?]/.test(t[e+1]||"")?Pc(t,e):null}function Pc(t,e){let o="",n=e+1;for(;n<t.length;){const s=t[n];if(o){s===o&&(o=""),n+=1;continue}if(t.startsWith("{{",n)){const r=t.indexOf("}}",n+2);if(r===-1)return-1;n=r+2;continue}if(s==='"'||s==="'"){o=s,n+=1;continue}if(s===">")return n+1;if(s==="<")return-1;n+=1}return-1}function Ko(t,e){if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?t.length:o+2}if(t.startsWith("<!--",e)){const o=t.indexOf("-->",e+4);return o===-1?t.length:o+3}return e}function Te(t,e){if(t[e]!=="<")return null;const o=t.indexOf(">",e+1);if(o===-1)return null;const n=t.slice(e,o+1),s=n.match(/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/);if(s)return{kind:"close",name:s[1].toLowerCase(),from:e,to:o+1};const r=n.match(/^<([A-Za-z][A-Za-z0-9:-]*)/);if(!r)return{kind:"other",from:e,to:o+1};const i=r[1].toLowerCase();return{kind:/\/\s*>$/.test(n)||["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"].includes(i)?"void":"open",name:i,from:e,to:o+1}}function po(t,e,o){let n=1,s=o;for(;s<t.length;){const r=Ko(t,s);if(r!==s){s=r;continue}if(t[s]!=="<"){s+=1;continue}const i=Te(t,s);if(!i)break;if(i.kind==="open"&&i.name===e)n+=1;else if(i.kind==="close"&&i.name===e&&(n-=1,n===0))return i;s=i.to}return null}function Ic(t,e){const o=[];let n=0;for(;n<e;){const s=Ko(t,n);if(s!==n){n=s;continue}if(t[n]!=="<"){n+=1;continue}const r=Te(t,n);if(!r)return null;if(e<r.to){if(r.kind==="open")return{name:r.name,open:r,close:po(t,r.name,r.to),at:"open"};if(r.kind==="void")return{name:r.name,open:r,close:null,at:"open"};if(r.kind==="close"){let i=null;for(let l=o.length-1;l>=0;l-=1)if(o[l].name===r.name){i=o[l];break}return{name:r.name,open:i,close:r,at:"close"}}return null}if(r.kind==="open")o.push(r);else if(r.kind==="close"){for(let i=o.length-1;i>=0;i-=1)if(o[i].name===r.name){o.splice(i);break}}n=r.to}return null}function fe(){const t=g.html;if(!t)return null;const e=t.state.selection.main.head,o=t.state.doc.toString(),n=[];let s=0;for(;s<e;){const c=Ko(o,s);if(c!==s){s=c;continue}if(o[s]!=="<"){s+=1;continue}const d=Te(o,s);if(!d||d.from>=e)break;if(d.kind==="open")n.push(d);else if(d.kind==="close"){for(let f=n.length-1;f>=0;f-=1)if(n[f].name===d.name){n.splice(f);break}}s=d.to}const r=o.lastIndexOf("<",Math.max(0,e-1));if(r!==-1&&o.indexOf(">",r)>=e){const c=Te(o,r);if(c?.kind==="open"||c?.kind==="void"){const d=c.kind==="void"?null:po(o,c.name,c.to);return d?{name:c.name,open:c,close:d}:{name:c.name,open:c,close:null}}}const i=n[n.length-1];if(!i)return null;const l=po(o,i.name,i.to);return{name:i.name,open:i,close:l}}function Me(t){return lr.includes(t)}function I(){g.html?.focus(),a.lastWin&&(X(a.lastWin),Re(a.lastWin))}function ht(t,e,o,n=void 0){const s=[...e].sort((r,i)=>i.from-r.from||i.to-r.to);t.dispatch({changes:s,selection:o,...n?{userEvent:n}:{}})}const Et="input.toolbar";function ee(t,e,o){const n=g.html;if(!n||n.state.readOnly)return;const s=n.state.selection.main.head,r=n.state.doc.lineAt(s),i=r.text.slice(0,s-r.from),l=r.text.trim()?it(r.text):qe(n,r)||it(r.text);let c=t,d=0;if(i.trim()!=="")c=`
${l}${t}`,d=1+l.length;else if(!r.text.trim()){c=`${l}${t}`,d=l.length,n.dispatch({changes:{from:r.from,to:r.to,insert:c},selection:Fn(r.from+d+e,o),userEvent:Et});return}n.dispatch({changes:{from:s,to:n.state.selection.main.to,insert:c},selection:Fn(s+d+e,o),userEvent:Et})}function Fn(t,e){return e?{anchor:t,head:t+e}:{anchor:t}}function Qs(t){const{from:e}=t.state.selection.main,o=ho(t.state.doc.toString(),e);return o!==e&&t.dispatch({selection:{anchor:o}}),o}function ta(t,e,o){const n=g.html;!n||n.state.readOnly||(Qs(n),ee(t,e,o))}const Oc=new Set(["section","article","header","footer","main","nav","aside"]);function Dc(t){return Me(t)||t==="p"||t==="a"}function Ln(t){if(t==="a")return'<a href="">';if(t!=="section")return`<${t}>`;const e=a.lastWin?.Statamic?.$config?.get?.("sveSectionTag");return typeof e=="string"&&e.trim()?`<${t} ${e.trim()}>`:`<${t}>`}function ea(){const t=g.html;if(!t||t.state.readOnly)return;const e=t.state.doc.toString(),o=(e.match(/^[ \t]*/)||[""])[0],n=Lc(e).split(`
`).map(s=>s&&o+s).join(`
`);n!==e&&(ht(t,[{from:0,to:e.length,insert:n}],{anchor:0}),I())}function oa(t){const e=g.html;if(!e||e.state.readOnly)return;const o=e.state.selection.main,n=e.state.doc.toString();if(!o.empty&&ho(n,o.from)===o.from&&ho(n,o.to)===o.to){const f=n.slice(o.from,o.to),h=f.match(new RegExp(`^<${t}(\\s[^>]*)?>([\\s\\S]*)</${t}>$`,"i"));if(h){ht(e,[{from:o.from,to:o.to,insert:h[2]}],{anchor:o.from,head:o.from+h[2].length},Et),I();return}const m=Ln(t);let b=`${m}${f}</${t}>`,y=o.from+m.length;t==="ul"&&(b=`<ul>
  <li>${f}</li>
</ul>`,y=o.from+11),ht(e,[{from:o.from,to:o.to,insert:b}],{anchor:y,head:y+f.length},Et),I();return}const r=o.head,i=Ic(n,r);if(i&&i.name===t&&i.open&&i.close){ht(e,[{from:i.close.from,to:i.close.to,insert:""},{from:i.open.from,to:i.open.to,insert:""}],{anchor:i.open.from},Et),I();return}const l=fe();if(l?.open&&l.close&&Me(l.name)&&Me(t)&&l.name!==t){const f=n.slice(l.open.from,l.open.to).replace(new RegExp(`^<${l.name}`,"i"),`<${t}`);ht(e,[{from:l.close.from,to:l.close.to,insert:`</${t}>`},{from:l.open.from,to:l.open.to,insert:f}],{anchor:l.open.from+t.length+1},Et),I();return}l?.open&&l.name===t&&Dc(t)&&e.dispatch({selection:{anchor:l.close?l.close.to:l.open.to}}),Qs(e);const d=(e.state.doc.lineAt(e.state.selection.main.head).text.match(/^\s*/)||[""])[0];if(t==="ul"){const f=`<ul>
${d}  <li></li>
${d}</ul>`;ee(f,`<ul>
${d}  <li>`.length)}else{const f=Ln(t),h=`${f}</${t}>`,m=t==="a"?f.indexOf('""')+1:Oc.has(t)?f.length:h.length;ee(h,m)}I()}function na(t,e){let o=null;for(const n of xs(t))n.kind==="loop"&&n.loopKind==="collection"&&n.from<=e&&e<n.to&&(o=n);return o}function Hc(){const t=g.html;return t?na(t.state.doc.toString(),t.state.selection.main.head):null}function Wc(){const t=g.html;if(!t||t.state.readOnly)return;const e=t.state.doc.toString(),o=na(e,t.state.selection.main.head);if(!o)return;const n=Zr(e,o,!o.paginate);if(n===e)return;if(!_s(e,n)){a.lastWin?.Statamic?.$toast?.error(p(a.lastWin,"html_tree_locked_element"));return}const[s,r,i]=No(e,n);ht(t,[{from:s,to:r,insert:i}]),I()}function Re(t){try{jc(t)}catch{}}function jc(t){const e=t?.document?.getElementById(u),n=fe()?.name||"";if(!e)return;const s=Hc();for(const r of _o){const i=e.querySelector(`[data-sve-html-tool="${r.id}"]`);if(!i)continue;const l=r.action==="pagination",c=l?!!s?.paginate:r.id==="heading"?Me(n):n===r.tag;l&&i.toggleAttribute("data-in-loop",!!s),c?i.setAttribute("data-active",""):i.removeAttribute("data-active")}}function Bn(t,e,o){const n=t.document,s=fe()?.name||"";$(n),e.setAttribute("data-open","");const r=n.createElement("div");r.id=k,n.body.appendChild(r),D(t,e,r),r._sveApp=H(et,r,{kind:"choices",choices:o.map(i=>({value:i,label:i.toUpperCase(),active:s===i})),onPick:i=>{oa(i),$(n)}})}function zc(t,e){const o=t.document;$(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=k,o.body.appendChild(n),D(t,e,n);const s=r=>{o.getElementById(k)&&(n._sveApp?.unmount(),n._sveApp=H(et,n,{kind:"choices",choices:r,onPick:i=>{i&&(ta(i,i.length),I()),$(o)}}),D(t,e,n))};s([{value:"",label:p(t,"code_dock_loading")}]),t.fetch("/!/sve/components",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(r=>r.ok?r.json():{items:[]}).then(r=>{const i=Array.isArray(r.items)?r.items:[];s(i.length?i.map(l=>({value:l.tag,label:l.name})):[{value:"",label:p(t,"component_none")}])}).catch(()=>s([{value:"",label:p(t,"component_none")}]))}function Pn(t){const e=Bt(t),o=g.html,n=g.css;if(!e||o?.state.readOnly||n?.state.readOnly)return;const s=fe();if(s?.open&&o){const r=o.state.doc.sliceString(s.open.from,s.open.to),i=Yr(r,e);i!==r&&o.dispatch({changes:{from:s.open.from,to:s.open.to,insert:i}})}V(),Eo(a.cssFull,e)||(a.cssFull=`${String(a.cssFull||"").trimEnd()}${a.cssFull?.trim()?`
`:""}.${e} {
}
`),vt(),je(),jt(),a.lastWin&&(X(a.lastWin),Re(a.lastWin),E(a.lastWin))}function Rc(t,e){const o=t.document;if(e.hasAttribute("data-open")){$(o);return}$(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=k,o.body.appendChild(n),D(t,e,n);const s=l=>{const c=Bt(l);if(!c)return"";if(Eo(a.cssFull,c))return p(t,"class_exists_here");const d=[...new Set(Ho(t,c).map(f=>String(f.file).replace(/^.*\//,"")))];return d.length?p(t,"class_exists_pick",{file:d.join(", ")}):""},r=l=>{Pn(l),Wo(t,Bt(l)),$(o)},i=()=>{if(!o.getElementById(k))return;const l=n.querySelector("[data-sve-css-add-input]")?.value||"";n._sveApp?.unmount(),n._sveApp=H(jo,n,{label:p(t,"code_dock_css_class_name"),placeholder:p(t,"code_dock_css_class_placeholder"),initial:l,options:Vl(t,p(t,"class_this_file")),existingLabel:p(t,"code_dock_css_class_existing"),createLabel:p(t,"code_dock_css_class_create"),takenText:s,onPick:r,onClose:()=>$(o),onAdd:c=>{Pn(c),$(o)}}),D(t,e,n)};i(),Do(t).then(i)}function Nc(t,e){const o=e.querySelector("[data-sve-css-add-class]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=Df,o.title=p(t,"code_dock_css_add_class"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),a.styleMode==="tw"){$(t.document),Jr(t,o);return}Rc(t,o)}))}function Go(){const t={html:"",css:"",js:""};Tt(),V();for(const e of st)e==="html"?t.html=a.htmlScopeActive?a.htmlFull:g.html?.state.doc.toString()??"":e==="css"?(t.css=a.lastWin?Cl(a.cssFull,bt(a.lastWin)):a.cssFull,t.css=Jl(t.css,t.html,Af)):t[e]=g[e]?.state.doc.toString()??"";return t}function sa(){if(a.cssValues||a.cssAll||!a.htmlScopePref)return a.cssPane="full",a.cssScopeSnapshot=a.cssFull,a.cssFull;const t=$t(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length),e=Mo(t?a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to):a.htmlFull);if(!e.length)return a.cssPane="empty",a.cssScopeSnapshot="","";a.cssPane="tree";const o=ms(a.cssFull,e);return a.cssScopeSnapshot=o,o}function zt(t,e){a.applying=!0;try{a.lastWin&&(a.htmlScopePref=le(a.lastWin)),a.htmlFull=t.html??"",a.cssFull=t.css??"",a.cssAll=!1,a.htmlAll=!1;for(const o of st){const n=g[o];let s=t[o]??"";try{s=o==="html"?Ys():o==="css"?sa():s}catch{s=o==="html"?a.htmlFull||t.html||"":o==="css"?a.cssFull||t.css||"":s}if(!n)continue;const r=n.state.doc.toString(),i=[Yt[o].reconfigure(se.readOnly.of(!!e)),Zt[o].reconfigure(B.editable.of(!e))];r!==s?n.dispatch({changes:{from:0,to:r.length,insert:s},effects:i}):n.dispatch({effects:i})}}finally{a.applying=!1}je(),jt(),Co("dock:html-changed"),a.lastWin&&(E(a.lastWin),Re(a.lastWin),R(a.lastWin),pe(a.lastWin))}function Xo(t,e){return t.html===e.html&&t.css===e.css&&t.js===e.js}function aa(t){return String(t||"").replace(/\/\*[\s\S]*?\*\//g,"").trim().replace(/\s*:\s*/g,": ").replace(/\s*;\s*/g,";").replace(/\s+/g," ").replace(/;+$/,";")}function ra(t){const e=aa(t).match(/^([a-z-]+)\s*:/i);return e?e[1].toLowerCase():""}function ia(t){const e=aa(t),o=e.indexOf(":");return o===-1?"":e.slice(o+1).replace(/;$/,"").trim().toLowerCase()}function P(t){const e=String(t||"").trim().toLowerCase();return e==="start"||e==="flex-start"||e==="left"||e==="top"?"flex-start":e==="end"||e==="flex-end"||e==="right"||e==="bottom"?"flex-end":e==="row-reverse"?"row-reverse":e==="column-reverse"?"column-reverse":e}function oe(t){const e=P(t);return e==="flex"||e==="inline-flex"}function Ne(){const t=g.css;if(!t)return null;const e=t.state.selection.main.head,o=t.state.doc.toString(),n=[],s=[];for(let i=0;i<o.length;i+=1){if(o[i]==="{"&&o[i+1]==="{"){const l=o.indexOf("}}",i+2);if(l===-1)break;i=l+1;continue}if(o[i]==="{")n.push(i);else if(o[i]==="}"){const l=n.pop();l!=null&&s.push({from:l+1,to:i,text:o.slice(l+1,i),open:l})}}let r=null;for(const i of s)e<i.open||e>i.to||(!r||i.to-i.open<r.to-r.open)&&(r=i);return r}function qc(t){const e=String(t||"");let o="",n=0;for(let s=0;s<e.length;s+=1){if(e[s]==="{"&&e[s+1]==="{"){const r=e.indexOf("}}",s+2);if(r===-1)break;n===0&&(o+=e.slice(s,r+2)),s=r+1;continue}if(e[s]==="{"){n+=1;continue}if(e[s]==="}"){n=Math.max(0,n-1);continue}n===0&&(o+=e[s])}return o}function In(t){const e={};for(const o of qc(t).split(";")){const n=ra(o);n&&(e[n]=ia(`${o};`))}return e}function Vc(t,e,o){if(!e||e.from>=e.to)return null;let n=t.state.doc.lineAt(e.from),s=0;for(;n.from<=e.to;){const r=Math.max(n.from,e.from),i=Math.min(n.to,e.to),l=t.state.doc.sliceString(r,i);if(s===0&&ra(l)===o)return{from:r,to:i,text:l};if(s+=Uc(l),n.to>=t.state.doc.length||n.to>=e.to)break;n=t.state.doc.lineAt(n.to+1)}return null}function Uc(t){let e=0;const o=String(t);for(let n=0;n<o.length;n+=1){if(o[n]==="{"&&o[n+1]==="{"){const s=o.indexOf("}}",n+2);n=s===-1?o.length:s+1;continue}o[n]==="{"?e+=1:o[n]==="}"&&(e-=1)}return e}function it(t){return(String(t).match(/^\s*/)||[""])[0]}function qe(t,e,o){for(let n=e.number-1;n>=1;n-=1){const s=t.state.doc.line(n),r=s.text.trim();if(!r)continue;const i=it(s.text);if(o&&(r==="{"||r.endsWith("{")))return`${i}  `;if(!(r==="}"||r.startsWith("}")))return i}return""}function Kc(t,e){const o=t.state.doc.lineAt(e);if(o.text.trim())return it(o.text);const n=qe(t,o,!0);if(n)return n;const s=Ne();return s?la(t,s):"  "}function la(t,e){const o=t.state.doc.lineAt(e.from),n=t.state.doc.lineAt(Math.max(e.from,e.to));for(let r=n.number;r>=o.number;r-=1){const i=t.state.doc.line(r),l=Math.max(i.from,e.from),c=Math.min(i.to,e.to),d=t.state.doc.sliceString(l,c);if(d.trim())return(d.match(/^\s*/)||[""])[0]||"  "}return`${(t.state.doc.lineAt(Math.max(0,e.from-1)).text.match(/^\s*/)||[""])[0]}  `}function On(){g.css?.focus(),a.lastWin&&(X(a.lastWin),E(a.lastWin))}function ca(t,e){if(!e)return"";const o=t.state.doc.toString();let n=0;for(let s=e.open-1;s>=0;s-=1)if(o[s]==="}"||o[s]==="{"||o[s]===";"){n=s+1;break}return o.slice(n,e.open).replace(/\/\*[\s\S]*?\*\//g,"").trim()}function Gc(t,e){if(!a.cssState||!e)return e;const o=da(t,e);if(o)return o;const n=ca(t,e);if(!n||n.startsWith("@"))return e;const s=t.state.doc.toString(),r=_t(s,e.open),i=_t(s,e.to)||`${r}    `,l=(t.state.doc.sliceString(e.from,e.to).match(/\n([^\S\n]*)$/)||[null,null])[1],c=l===null?e.to:e.to-l.length,d=`
${i}&${Ue()} {
${i}}
${l??r}`;t.dispatch({changes:{from:c,to:e.to,insert:d}});const f=t.state.doc.toString(),h=f.indexOf("{",c+d.indexOf("&")),m=h===-1?-1:Fo(f,h);return m===-1?e:{from:h+1,to:m,text:f.slice(h+1,m),open:h}}function _t(t,e){const o=t.lastIndexOf(`
`,e-1)+1;return(t.slice(o,e).match(/^\s*/)||[""])[0]}function G(t){const e=g.css;if(!e||e.state.readOnly||!t.length)return;const o=Ne(),n=t.some(l=>l.value!=null)?Gc(e,o):o;if(!n){const l=t.filter(c=>c.value!=null).map(c=>`${c.property}: ${c.value};`).join(`
`);l&&Zc(l),On();return}const s=[],r=[],i=la(e,n);for(const l of t){const c=Vc(e,n,l.property);if(l.value==null){if(!c)continue;let d=c.from,f=c.to;e.state.doc.sliceString(f,f+1)===`
`&&(f+=1),d=Math.max(d,n.from),f=Math.min(f,n.to),s.push({from:d,to:f});continue}if(!(c&&P(ia(c.text))===P(l.value)))if(c){const d=(c.text.match(/^\s*/)||[""])[0];s.push({from:c.from,to:c.to,insert:`${d}${l.property}: ${l.value};`})}else r.push(`${i}${l.property}: ${l.value};`)}if(r.length){const l=!n.text.includes(`
`)||!/\n\s*$/.test(n.text)?`
`:"",c=(n.text.match(/\n([^\S\n]*)$/)||[null,null])[1],d=c===null?n.to:n.to-c.length,f=c===null?"":c;s.push({from:d,to:n.to,insert:`${l}${r.join(`
`)}
${f}`})}s.length&&(s.sort((l,c)=>c.from-l.from||c.to-l.to),e.dispatch({changes:s})),On()}function J(){const t=g.css,e=Ne();if(!e)return{};if(a.cssState&&t){const o=da(t,e);return o?In(o.text):{}}return In(e.text)}function da(t,e){const o=ca(t,e),n=Ue();if(!o||o.startsWith("@"))return null;if(o.endsWith(n))return e;const s=t.state.doc.toString(),r=i=>{const l=Fo(s,i);return l===-1?null:{from:i+1,to:l,text:s.slice(i+1,l),open:i}};for(const i of[`&${n}`,`${o}${n}`]){const l=new RegExp(`(^|[^\\w-])${i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\s*\\{`,"g");let c;for(;c=l.exec(s);){const d=s.indexOf("{",c.index);if(i.startsWith("&")&&(d<e.from||d>e.to))continue;const f=r(d);if(f)return f}}return null}function Xc(t){const e=J(),o=oe(e.display),n=P(e["flex-direction"])||(o?"row":"");if(o&&n===t){const s=[];e["flex-direction"]&&s.push({property:"flex-direction",value:null}),oe(e.display)&&s.push({property:"display",value:null}),G(s);return}G([{property:"display",value:"flex"},{property:"flex-direction",value:t}])}function Yc(t){const e=J();if(t==="flex"&&oe(e.display)){G([{property:"justify-content",value:null},{property:"align-items",value:null},{property:"flex-direction",value:null},{property:"display",value:null}]);return}G([{property:"display",value:t}])}function Zc(t){const e=g.css;if(!e||e.state.readOnly)return;const o=e.state.selection.main.head,n=e.state.doc.lineAt(o),s=n.text.slice(0,o-n.from),r=n.text.slice(o-n.from),i=Kc(e,o),l=t.replace(/;?$/,";");if(s.trim()===""&&r.trim()===""){const d=`${i}${l}
${i}`;e.dispatch({changes:{from:n.from,to:n.to,insert:d},selection:{anchor:n.from+d.length}});return}const c=`
${i}${l}
${i}`;e.dispatch({changes:{from:o,to:e.state.selection.main.to,insert:c},selection:{anchor:o+c.length}})}function E(t){try{Jc(t),lt(t)}catch{}}function Jc(t){const e=a.styleMode==="tw",o=e?{}:J(),n=oe(e?yn("display"):o.display),s=P(o["flex-direction"])||(n?"row":""),r=i=>e?ei()?i.twGroup?!!oi(i.twGroup):!!i.tw&&!!yn(i.tw):!1:!!i.css&&i.css in o;ft.tools=dr.map(i=>{const l=(i.kids||[]).filter(c=>c.when!=="flex"||n).map(c=>({id:c.id,title:c.title,icon:es[c.icon]||"",sep:!!c.sep,open:a.cssOpenMenu===c.id,active:e?r(c):c.kind==="display"?n:c.kind==="flexDir"?n&&s===c.value:c.value?P(o[c.css])===P(c.value):r(c)}));return{id:i.id,title:i.title,icon:es[i.id]||Wf[i.id]||"",open:a.cssOpenTool===i.id||a.cssOpenMenu===i.id,kids:l,active:i.value?!e&&P(o[i.css])===P(i.value):r(i)||l.some(c=>c.active)}})}function ne(t){$(t),a.cssOpenTool="",a.lastWin&&E(a.lastWin)}function $(t){const e=t?.getElementById(k);a.cssOpenMenu="",e?._sveApp?.unmount(),e?.remove(),t?.querySelectorAll("[data-sve-css-tool][data-open], [data-sve-html-tool][data-open], [data-sve-css-add-class][data-open], [data-sve-code-history][data-open]").forEach(o=>o.removeAttribute("data-open"))}function yh(t){$(t),N(t),nt(t);for(const e of st)g[e]&&Ka?.(g[e])}function ua(t){if(a.cssColorsPromise)return a.cssColorsPromise;const e=t.Statamic?.$config?.get?.("cpUrl")||`/${t.Statamic?.$config?.get?.("cpRoute")||"cp"}`;return a.cssColorsPromise=t.fetch(`${e}/color-scheme/swatches`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async o=>{if(!o.ok)return[];const n=await o.json().catch(()=>[]);return Array.isArray(n)?n:[]}).catch(()=>[]).then(o=>{const n=new Set,s=[];for(const r of o){const i=r.var||r.value||r.handle,l=String(i||"").trim().replace(/^var\((.+)\)$/,"$1");!l||n.has(l)||(n.add(l),s.push({name:l,hex:r.hex||r.color||""}))}for(const[r,i]of cr)n.has(r)||(n.add(r),s.push({name:r,hex:i}));return s}),a.cssColorsPromise}function fa(t,e){const o=J()[e]||"",n=String(o).match(/^var\(\s*([^)]+?)\s*\)$/i),s=n?n[1].trim():"";for(const r of t.querySelectorAll("[data-sve-css-token]"))s&&r.getAttribute("data-sve-css-token")===s?r.setAttribute("data-active",""):r.removeAttribute("data-active")}function D(t,e,o){const n=e.getBoundingClientRect(),s=8,r=t.innerHeight-(n.bottom+4)-s,i=n.top-4-s;o.style.maxHeight="";const l=o.offsetHeight||0,c=l>r&&i>r;o.style.left=`${Math.max(s,Math.min(n.left,t.innerWidth-220))}px`,o.style.maxHeight=`${Math.max(120,c?i:r)}px`,o.style.top=c?`${Math.max(s,n.top-4-Math.min(l,i))}px`:`${Math.max(s,n.bottom+4)}px`}function Qc(t,e,o){const n=t.document;$(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=k,n.body.appendChild(s),D(t,e,s);const r=i=>{s._sveApp?.unmount(),s._sveApp=H(et,s,{kind:"colors",swatches:i,onClear:()=>{G([{property:o,value:null}]),ne(n)},onPick:l=>{G([{property:o,value:`var(${l})`}]),ne(n)}}),fa(s,o)};r(cr.map(([i,l])=>({name:i,hex:l}))),ua(t).then(i=>{n.getElementById(k)&&r(i.map(l=>({name:l.name,hex:l.hex})))})}function td(t,e,o,n){const s=t.document;$(s),e.setAttribute("data-open","");const r=s.createElement("div"),i=J()[o]||"";r.id=k,s.body.appendChild(r),D(t,e,r),r._sveApp=H(et,r,{kind:"choices",choices:(n||[]).map(l=>({value:l,label:l,active:P(l)===P(i)})),onPick:l=>{const c=P(l)===P(J()[o]||"");G([{property:o,value:c?null:l}]),ne(s)}})}function Dn(t,e,o,n=[]){const s=t.document;$(s),e.setAttribute("data-open",""),Qr(t);const r=s.createElement("div");r.id=k,s.body.appendChild(r),D(t,e,r);const i=()=>{const l=[...n.map(d=>({value:d,label:d})),...ti(t,o).map(d=>({value:d.value,label:d.value}))],c=J()[o]||"";r._sveApp?.unmount(),r._sveApp=H(et,r,{kind:"choices",choices:l.map(d=>({...d,active:P(d.value)===P(c)})),onPick:d=>{G([{property:o,value:d||null}]),ne(s)}})};i(),ua(t).then(()=>{s.getElementById(k)===r&&i()})}function ed(t,e,o){const n=t.document;$(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=k,n.body.appendChild(s),D(t,e,s),s._sveApp=H(et,s,{kind:"choices",choices:Hf.map(r=>({value:r,token:r,label:r})),onPick:r=>{G([{property:o,value:`var(${r})`}]),ne(n)}}),fa(s,o)}const Hn=/\{\{#[\s\S]*?#\}\}|\{\{[\s\S]*?\}\}/g,Wn=/<!--[\s\S]*?-->/g,jn=/<(\/?)([A-Za-z][A-Za-z0-9-]*)/g,ha=/^\{\{\s*(?:\/|endif\b|endunless\b)/,od=/^\{\{\s*(?:\/\s*(?:if|unless)\b|endif\b|endunless\b)/,nd=/^\{\{\s*\/\s*partial\b/;function no(t,e,o){return t.some(n=>e<n.to&&o>n.from)}function sd(t){const e=new Map;for(const o of xs(t)){const n=o.kind==="loop"?"loop":"if";e.set(o.from,n);const s=t.lastIndexOf("{{",o.to-2);s>=o.openTo&&ha.test(t.slice(s,o.to))&&e.set(s,n)}for(const o of hs(t))e.set(o.from,"component");return e}function ad(t){const e=String(t||""),o=[],n=[];Wn.lastIndex=0;let s;for(;s=Wn.exec(e);)o.push({from:s.index,to:s.index+s[0].length});const r=sd(e),i=[];for(Hn.lastIndex=0;s=Hn.exec(e);){const l=s.index,c=l+s[0].length,d=s[0];if(no(o,l,c))continue;if(i.push({from:l,to:c}),d.startsWith("{{#")){n.push({from:l,to:c,cls:"comment"});continue}const f=ha.test(d),h=r.get(l)||(f&&od.test(d)?"if":"")||(f&&nd.test(d)?"component":"");n.push({from:l,to:c,cls:(h?`fam-${h}`:"antlers")+(f?"-close":"")})}for(jn.lastIndex=0;s=jn.exec(e);){const l=s.index+1+s[1].length,c=l+s[2].length;no(o,l,c)||no(i,l,c)||n.push({from:l,to:c,cls:`fam-${Mr(s[2])}`})}return n.sort((l,c)=>l.from-c.from),n}function zn(t,e,o){const n=new e.RangeSetBuilder;let s=0;for(const r of ad(t.doc.toString()))r.from<s||(n.add(r.from,r.to,o(r.cls)),s=r.to);return n.finish()}function rd(t){const e=new Map,o=r=>r==="comment"?"sve-cm-antlers-comment":r==="antlers"?"sve-cm-antlers":r==="antlers-close"?"sve-cm-antlers sve-cm-antlers-close":r.endsWith("-close")?`sve-cm-${r.slice(0,-6)} sve-cm-antlers-close`:`sve-cm-${r}`,n=r=>(e.has(r)||e.set(r,t.Decoration.mark({class:o(r)})),e.get(r));return{extensions:[t.StateField.define({create(r){return zn(r,t,n)},update(r,i){return i.docChanged?zn(i.state,t,n):r},provide:r=>t.EditorView.decorations.from(r)})]}}const M=So({tag:"",emptyText:"",addLabel:"",dropTitle:"",chips:[],states:[],canEdit:!1,onAdd:null,onChip:null,onDrop:null}),id={class:"sve-al"},ld={class:"sve-al-head"},cd={key:0,class:"sve-al-tag"},dd=["title","disabled"],ud={key:0,class:"sve-al-empty"},fd={class:"sve-al-chips"},hd=["data-sve-al-chip","title","disabled","onClick"],pd={class:"sve-al-name"},md={key:0,class:"sve-al-value"},gd=["title","onClick"],vd={__name:"AlpinePanel",setup(t){return(e,o)=>(x(),_("div",id,[v("div",ld,[S(M).tag?(x(),_("span",cd,"<"+T(S(M).tag)+">",1)):W("",!0),(x(!0),_(j,null,at(S(M).states,n=>(x(),_("span",{key:n,class:"sve-al-state"},T(n),1))),128)),o[1]||(o[1]=v("span",{class:"sve-al-gap"},null,-1)),v("button",{type:"button","data-sve-al-add":"",title:S(M).addLabel,disabled:!S(M).canEdit,onClick:o[0]||(o[0]=F(n=>S(M).onAdd?.(n),["prevent","stop"]))},"+",8,dd)]),S(M).chips.length?W("",!0):(x(),_("div",ud,T(S(M).emptyText),1)),v("div",fd,[(x(!0),_(j,null,at(S(M).chips,n=>(x(),_("span",{key:n.id,class:"sve-al-chip-wrap"},[v("button",{type:"button","data-sve-al-chip":n.id,title:n.title,disabled:!S(M).canEdit,onClick:F(s=>S(M).onChip?.(s,n.id),["prevent","stop"])},[v("span",pd,T(n.name),1),n.value?(x(),_("span",md,T(n.value),1)):W("",!0)],8,hd),S(M).canEdit?(x(),_("button",{key:0,type:"button",class:"sve-al-drop",title:S(M).dropTitle,onClick:F(s=>S(M).onDrop?.(n.id),["prevent","stop"])},"−",8,gd)):W("",!0)]))),128))])]))}},bd=Cs(vd,[["__scopeId","data-v-15add965"]]),yd=[{id:"state",lang:"alpine_group_state"},{id:"act",lang:"alpine_group_act"},{id:"react",lang:"alpine_group_react"}],Rn=[{id:"state",group:"state",label:"alpine_state",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: false }"}]},{id:"state_text",group:"state",label:"alpine_state_text",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: '|' }"}]},{id:"toggle",group:"act",label:"alpine_toggle",icon:"toggle",needsName:!0,attrs:[{name:"@click",value:":name = !:name"}]},{id:"open",group:"act",label:"alpine_open",icon:"open",needsName:!0,attrs:[{name:"@click",value:":name = true"}]},{id:"close",group:"act",label:"alpine_close",icon:"close",needsName:!0,attrs:[{name:"@click",value:":name = false"}]},{id:"open_hover",group:"act",label:"alpine_open_hover",icon:"open",needsName:!0,attrs:[{name:"@mouseenter",value:":name = true"}]},{id:"close_leave",group:"act",label:"alpine_close_leave",icon:"close",needsName:!0,attrs:[{name:"@mouseleave",value:":name = false"}]},{id:"open_focus",group:"act",label:"alpine_open_focus",icon:"open",needsName:!0,attrs:[{name:"@focusin",value:":name = true"}]},{id:"close_blur",group:"act",label:"alpine_close_blur",icon:"close",needsName:!0,attrs:[{name:"@focusout",value:":name = false"}]},{id:"close_outside",group:"act",label:"alpine_close_outside",icon:"outside",needsName:!0,attrs:[{name:"@click.outside",value:":name = false"}]},{id:"close_escape",group:"act",label:"alpine_close_escape",icon:"escape",needsName:!0,attrs:[{name:"@keydown.escape.window",value:":name = false"}]},{id:"show",group:"react",label:"alpine_show",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"}]},{id:"show_smooth",group:"react",label:"alpine_show_smooth",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"},{name:"x-transition",value:""}]},{id:"hide_until_ready",group:"react",label:"alpine_hide_until_ready",icon:"cloak",attrs:[{name:"x-cloak",value:""}]},{id:"class_when",group:"react",label:"alpine_class_when",icon:"klass",needsName:!0,attrs:[{name:":class",value:":name ? '|' : ''"}]},{id:"text",group:"react",label:"alpine_text",icon:"text",needsName:!0,attrs:[{name:"x-text",value:":name"}]}];function kd(t){return(t?.attrs||[]).map(e=>e.name).join(" ")}const xd=/^(x-[\w:.-]+|@[\w:.-]+|:[\w-]+)$/;function _d(t){return xd.test(String(t||""))}function he(t){const e=String(t||""),o=[],n=/([@:a-zA-Z_][\w:.@-]*)(\s*=\s*(["'])([\s\S]*?)\3)?/g;let s,r=!0;for(;s=n.exec(e);){if(r){r=!1;continue}s[0].trim()&&o.push({name:s[1],value:s[4]??"",from:s.index,to:s.index+s[0].length,alpine:_d(s[1])})}return o}function pa(t){const e=String(t||"").trim().replace(/^\{|\}$/g,""),o=[],n=/(^|,)\s*([a-zA-Z_$][\w$]*)\s*:/g;let s;for(;s=n.exec(e);)o.push(s[2]);return o}function Sd(t,e){return t.map(o=>({name:o.name,value:String(o.value).replaceAll(":name:",`${e}:`).replaceAll(":name",e)}))}function Yo(t,e,o){const n=g.html,s=Mt();if(!n||n.state.readOnly||!s)return;const r=a.htmlScopeActive&&!!a.htmlFocus,i=r?a.htmlFocus.from:0,c=(r?a.htmlFull:n.state.doc.toString()).slice(s.from,s.openTo),d=o===""?e:`${e}="${o}"`,f=he(c).find(m=>m.name===e);let h;if(f)h=c.slice(0,f.from)+d+c.slice(f.to);else{const m=c.search(/\s|\/?>$/);h=m===-1?c:`${c.slice(0,m)} ${d}${c.slice(m)}`}h!==c&&(ht(n,[{from:s.from-i,to:s.openTo-i,insert:h}],null),Ve(t))}function wd(t,e){const o=g.html,n=Mt();if(!o||o.state.readOnly||!n)return;const s=a.htmlScopeActive&&!!a.htmlFocus,r=s?a.htmlFocus.from:0,l=(s?a.htmlFull:o.state.doc.toString()).slice(n.from,n.openTo),c=he(l).find(h=>h.name===e);if(!c)return;let d=c.from;for(;d>0&&/\s/.test(l[d-1]);)d-=1;const f=l.slice(0,d)+l.slice(c.to);ht(o,[{from:n.from-r,to:n.openTo-r,insert:f}],null),Ve(t)}function mo(t){const e=g.html;if(!e)return[];const n=a.htmlScopeActive&&!!a.htmlFocus?a.htmlFull:e.state.doc.toString(),s=Mt(),r=[],i=Ht(ie(n),new Set);for(const l of i){if(!s||l.from>s.from||l.to<s.to)continue;const c=he(n.slice(l.from,l.openTo)).find(d=>d.name==="x-data");c&&r.push(...pa(c.value))}return[...new Set(r)]}function $d(t){const e=g.html,o=Mt();if(!e||!o)return[];const s=a.htmlScopeActive&&!!a.htmlFocus?a.htmlFull:e.state.doc.toString(),r=he(s.slice(o.from,o.openTo)).find(i=>i.name==="x-data");return r?pa(r.value):[]}function Cd(t,e){const o=t.document;$(o),e.setAttribute("data-open","");const n=mo(),s=o.createElement("div");s.id=k,o.body.appendChild(s),D(t,e,s);const r=!n.length,i=!r&&!$d().length,c=yd.filter(d=>d.id==="state"?!i:!r).flatMap(d=>{const f=Rn.filter(h=>h.group===d.id);return f.length?[{value:`\0${d.id}`,label:p(t,r&&d.id==="state"?"alpine_group_state_first":d.lang),heading:!0},...f.map(h=>({value:h.id,label:p(t,h.label),hint:kd(h)}))]:[]});r&&c.push({value:"\0note",label:p(t,"alpine_needs_state"),note:!0}),s._sveApp=H(et,s,{kind:"choices",choices:c,onPick:d=>{const f=Rn.find(h=>h.id===d);if($(o),!!f){if(!f.needsName){for(const h of f.attrs)Yo(t,h.name,h.value);return}Ad(t,e,f,n)}}})}function Ad(t,e,o,n){const s=t.document,r=l=>{const c=String(l||"").trim().replace(/[^\w$]/g,"");if($(s),!!c)for(const d of Sd(o.attrs,c))Yo(t,d.name,d.value.replace("|",""))};if(!n.length){go(t,e,r);return}const i=s.createElement("div");i.id=k,s.body.appendChild(i),D(t,e,i),i._sveApp=H(et,i,{kind:"choices",choices:[{value:"\0head",label:p(t,"alpine_name"),heading:!0},...n.map(l=>({value:l,label:l})),{value:"\0new",label:p(t,"alpine_new_name")}],onPick:l=>{if(l==="\0new"){go(t,e,r);return}r(l)}})}function go(t,e,o){const n=t.document;$(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=k,n.body.appendChild(s),D(t,e,s),s._sveApp=H(jo,s,{label:p(t,"alpine_name"),placeholder:p(t,"alpine_name_placeholder"),onAdd:r=>o(r)})}function Ve(t){const o=t?.document.getElementById(u)?.querySelector("[data-sve-alpine-host]");if(!o)return;const n=Mt(),s=g.html,r=a.htmlScopeActive&&!!a.htmlFocus,i=s?r?a.htmlFull:s.state.doc.toString():"",l=n?he(i.slice(n.from,n.openTo)):[];M.tag=n?.tag||"",M.canEdit=!a.lastLocked&&!!n,M.emptyText=p(t,n?mo().length?"alpine_none_ready":"alpine_none":"alpine_pick"),M.addLabel=p(t,"alpine_add"),M.dropTitle=p(t,"alpine_remove"),M.states=mo(),M.chips=l.filter(c=>c.alpine).map(c=>({id:c.name,name:c.name,value:c.value,title:c.value?`${c.name}="${c.value}"`:c.name})),M.onAdd=c=>Cd(t,c.currentTarget),M.onDrop=c=>wd(t,c),M.onChip=(c,d)=>{M.chips.find(h=>h.id===d)&&go(t,c.currentTarget,h=>Yo(t,d,h))},o._sveMounted||(o._sveMounted=!0,ae(o,bd))}const Td=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]),Md=new Set(["html","head","body"]),Nn=new Set(["if","unless","style_push","script_push","sve_defaults","once","noparse","foreach","forelse","loop","cache","nocache","scope","collection","nav","structure","taxonomy","users","search:results","form:create","form:errors"]),Ed=new Set(["collection:count"]);function qn(t){return Ed.has(t)?!1:Nn.has(t)||Nn.has(t.split(":")[0])}const Fd=new Set(["CloseTag","MismatchedCloseTag","IncompleteCloseTag"]),Ld=/^\s*(\/?)\s*([A-Za-z_][A-Za-z0-9_.:-]*)([\s\S]*)$/,Bd=/^\{\{\s*\/?\s*([A-Za-z_][A-Za-z0-9_.:-]*)/,Pd=3e5;function Id(t){const e=String(t||""),o=[],n=[];let s=0;for(;s<e.length;){const r=e.indexOf("{{",s);if(r===-1)break;if(e.startsWith("{{#",r)){const d=e.indexOf("#}}",r+3);if(d===-1){n.push(r);break}o.push({from:r,to:d+3,comment:!0,body:""}),s=d+3;continue}let i=0,l=r,c=-1;for(;l<e.length;){if(e.startsWith("{{",l)){i+=1,l+=2;continue}if(e.startsWith("}}",l)){if(i-=1,l+=2,i===0){c=l;break}continue}l+=1}if(c===-1){n.push(r),s=r+2;continue}o.push({from:r,to:c,comment:!1,body:e.slice(r+2,c-2)}),s=c}return{tags:o,unclosed:n}}function Od(t,e){let o=t;for(const n of e)o=o.slice(0,n.from)+" ".repeat(n.to-n.from)+o.slice(n.to);return o}function Dd(t,e){return t===e||t.startsWith(`${e}:`)}function be(t,e){return(t.slice(e,e+80).match(/^<\/?([A-Za-z][A-Za-z0-9:-]*)/)?.[1]||"").toLowerCase()}function Hd(t,e,o,n,s){const r=c=>s.has(c.name)&&!/\||\?\?/.test(c.rest);for(const c of o){const d=t.slice(c,c+80).match(Bd)?.[1]||"…";n.push({from:c,to:c+2,key:"code_dock_problem_antlers_unclosed",args:{name:d}})}const i=[],l=[];for(const c of e){if(c.comment)continue;const d=c.body.match(Ld);if(!d)continue;const f=!!d[1],h=d[2].toLowerCase(),m=d[3];if(!f&&(h==="elseif"||h==="else")){let b=-1;for(let y=i.length-1;y>=0;y-=1)if(i[y].name==="if"||i[y].name==="unless"){b=y;break}if(b===-1){n.push({from:c.from,to:c.to,key:"code_dock_problem_branch_stray",args:{name:h}});continue}l.push({from:i[b].to,to:c.from}),i[b]={...i[b],to:c.to},i.length=b+1;continue}if(f||h==="endif"||h==="endunless"){const b=h==="endif"?"if":h==="endunless"?"unless":h;let y=-1;for(let L=i.length-1;L>=0;L-=1)if(Dd(i[L].name,b)){y=L;break}if(y===-1){n.push({from:c.from,to:c.to,key:"code_dock_problem_pair_stray",args:{name:b}});continue}for(const L of i.slice(y+1))qn(L.name)&&n.push({from:L.from,to:L.to,key:"code_dock_problem_pair_unclosed",args:{name:L.name}});(b==="if"||b==="unless")&&l.push({from:i[y].to,to:c.from}),i.length=y;continue}m.trim().startsWith("=")||i.push({name:h,rest:m,from:c.from,to:c.to})}for(const c of i)qn(c.name)?n.push({from:c.from,to:c.to,key:"code_dock_problem_pair_unclosed",args:{name:c.name}}):r(c)&&n.push({from:c.from,to:c.to,key:"code_dock_problem_list_unclosed",args:{name:c.name}});return l}function Wd(t,e,o,n){const s=e.parse(t),r=new Set,i=[];s.iterate({enter(l){if(l.name==="MismatchedCloseTag"){i.push({from:l.from,to:l.to,key:"code_dock_problem_tag_stray",args:{tag:be(t,l.from)}});return}if(l.name==="IncompleteCloseTag"){i.push({from:l.from,to:l.to,key:"code_dock_problem_tag_unfinished",args:{tag:be(t,l.from)}});return}if(l.type.isError){const h=l.node.parent;h&&(h.name==="OpenTag"||h.name==="CloseTag")&&(r.add(h.from),i.push({from:h.from,to:Math.max(h.from+1,l.from),key:"code_dock_problem_tag_unfinished",args:{tag:be(t,h.from)}}));return}if(l.name!=="Element")return;let c=null,d=!1;for(let h=l.node.firstChild;h;h=h.nextSibling)h.name==="OpenTag"&&(c=h),Fd.has(h.name)&&(d=!0);if(!c||d)return;const f=be(t,c.from);!f||Td.has(f)||Md.has(f)||o.some(h=>c.from>=h.from&&c.from<h.to&&l.to>h.to)||i.push({from:c.from,to:c.to,key:"code_dock_problem_tag_unclosed",args:{tag:f}})}});for(const l of i)l.key==="code_dock_problem_tag_unclosed"&&r.has(l.from)||l.args.tag&&n.push(l)}function jd(t,e,o={}){const n=String(t||"");if(!n.trim()||n.length>Pd)return[];const s=[];try{const{tags:i,unclosed:l}=Id(n),c=Hd(n,i,l,s,new Set(o.lists||[]));e&&Wd(Od(n,i),e,c,s)}catch{return[]}const r=new Set;return s.sort((i,l)=>i.from-l.from||i.to-l.to).filter(i=>{const l=`${i.from}:${i.key}`;return r.has(l)?!1:(r.add(l),!0)})}function zd(t,e,o=()=>({})){const n=t.Decoration.mark({class:"sve-cm-problem"}),s=t.StateEffect.define(),r=l=>{const c=jd(l.doc.toString(),e,o()),d=new t.RangeSetBuilder;let f=0;for(const h of c)h.from<f||h.to<=h.from||(d.add(h.from,h.to,n),f=h.to);return{problems:c,decorations:d.finish()}},i=t.StateField.define({create(l){return r(l)},update(l,c){return c.docChanged||c.effects.some(d=>d.is(s))?r(c.state):l},provide:l=>t.EditorView.decorations.from(l,c=>c.decorations)});return{field:i,relint:s,extensions:[i]}}const Rd=new Set(["replicator","grid","list","array","table"]);let Se=new Set,so=null;function ma(t){return t.document.getElementById(u)?.querySelector("[data-sve-html-problems]")||null}function Nd(t,e,o){const n=ma(t);if(!n)return;const s=e.state.doc,r=o.map(c=>({from:c.from,line:s.lineAt(Math.min(c.from,s.length)).number,text:p(t,c.key,c.args)})),i=r.map(c=>`${c.line}:${c.text}`).join(`
`);if(n.dataset.sveSignature===i||(n.dataset.sveSignature=i,n.hidden=r.length===0,n.replaceChildren(),!r.length))return;const l=t.document.createElement("span");l.setAttribute("data-sve-problems-title",""),l.textContent=p(t,"code_dock_problems_title"),n.appendChild(l);for(const c of r){const d=t.document.createElement("button"),f=t.document.createElement("b");d.type="button",d.dataset.sveProblemAt=String(c.from),f.textContent=p(t,"code_dock_problem_line",{line:c.line}),d.append(f,t.document.createTextNode(` ${c.text}`)),n.appendChild(d)}}function qd(t){const e=ma(t);!e||e._sveBound||(e._sveBound=!0,e.addEventListener("mousedown",o=>o.preventDefault()),e.addEventListener("click",o=>{const n=o.target.closest("[data-sve-problem-at]"),s=g.html;if(!n||!s)return;o.preventDefault(),o.stopPropagation();const r=Math.min(Number(n.dataset.sveProblemAt)||0,s.state.doc.length);s.dispatch({selection:{anchor:r},effects:B.scrollIntoView(r,{y:"center"})}),s.focus()}))}function Vd(t){const e=[],o=n=>{for(const s of n||[])s?.loop&&Rd.has(s.type)&&s.var&&!s.parent&&e.push(s.var)};o(t?.section);for(const n of t?.page||[])o(n?.items);return e}function Ud(t,e,o){const n={collection:Ms(t),set:Es(a.lastType),view:"",scope:""},s=n.set?Po(n):"";if(s===so)return;so=s;const r=l=>{if(so!==s)return;const c=new Set(Vd(l)),d=c.size===Se.size&&[...c].every(f=>Se.has(f));Se=c,!d&&g.html===e&&t.queueMicrotask(()=>{g.html===e&&e.dispatch({effects:o.of(null)})})};if(!s){r(null);return}const i=Fs(s);if(i){r(i);return}Ls(t,n).then(r)}function Kd(t){if(!a.htmlLintUi){const{field:e,relint:o}=zd({Decoration:tt,StateField:dt,StateEffect:qt,RangeSetBuilder:ut,EditorView:B},Le.parser,()=>({lists:Se})),n=B.updateListener.of(s=>{const r=s.transactions.some(i=>i.effects.some(l=>l.is(o)));!s.docChanged&&!r||(s.docChanged&&Ud(t,s.view,o),Nd(t,s.view,s.state.field(e).problems))});a.htmlLintUi={extensions:[e,n]}}return qd(t),a.htmlLintUi}const Vn=/\{\{\s*(?:vite\b[^}]*|yield_[a-z_]+|theme_tokens)\s*\}\}/g;function Gd(t,e=[]){const o=[];Vn.lastIndex=0;let n;for(;n=Vn.exec(String(t||""));)o.push(n.index,n.index+n[0].length);if(!e||!e.length)return o;const s=[];for(const r of[o,e])for(let i=0;i+1<r.length;i+=2)s.push([r[i],r[i+1]]);return s.sort((r,i)=>r[0]-i[0]||r[1]-i[1]).flat()}const Xd=["input","delete","move"];function Yd(t){return Xd.some(e=>t(e))}let ao={text:null,ranges:[]};function ga(t){return ao.text!==t&&(ao={text:t,ranges:Gd(t,t.includes("sve-lock")?ni(t):[])}),ao.ranges}function Un(t,e){const o=new ut,n=ga(t.doc.toString());for(let s=0;s<n.length;s+=2)o.add(n[s],n[s+1],e);return o.finish()}let ye=null;function Zd(){if(ye)return ye;const t=tt.mark({class:"sve-dock-locked"}),e=dt.define({create:n=>Un(n,t),update:(n,s)=>s.docChanged?Un(s.state,t):n,provide:n=>B.decorations.from(n)}),o=B.baseTheme({".sve-dock-locked":{opacity:".55",borderRadius:".1875rem",backgroundColor:"rgba(127,127,127,.14)",cursor:"not-allowed"}});return ye={extensions:[e,o,se.changeFilter.of(n=>Yd(s=>n.isUserEvent(s))?ga(n.startState.doc.toString()):!0)]},ye}function Jd(t,e){if(!t||!e)return t??null;const o=e.mapPos(t.from,1),n=e.mapPos(t.to,-1);return n>o?{from:o,to:n}:null}function Qd(){if(a.cssGhostUi)return a.cssGhostUi;const t=tt.mark({class:"sve-css-ghost"}),e=o=>{const n=new ut;if(!a.lastWin)return n.finish();try{for(const s of Al(o.doc.toString(),bt(a.lastWin)))n.add(s.from,s.to,t)}catch{}return n.finish()};return a.cssGhostUi=dt.define({create:o=>e(o),update:(o,n)=>n.docChanged?e(n.state):o,provide:o=>B.decorations.from(o)}),a.cssGhostUi}let ke=null,Ee=null;function tu(){if(ke)return ke;Ee=qt.define();const t=tt.line({class:"sve-css-id"}),e=o=>{const n=new ut;if(!a.lastWin||!a.cssValues)return n.finish();try{const s=o.doc;for(const r of $e(s.toString(),bt(a.lastWin),a.cssSize)){const i=s.lineAt(Math.min(r.from,s.length)).number,l=s.lineAt(Math.min(Math.max(r.to-1,r.from),s.length)).number;for(let c=i;c<=l;c+=1)n.add(s.line(c).from,s.line(c).from,t)}}catch{}return n.finish()};return ke=dt.define({create:o=>e(o),update:(o,n)=>n.docChanged||n.effects.some(s=>s.is(Ee))?e(n.state):o,provide:o=>B.decorations.from(o)}),ke}function Zo(){Ee&&g.css&&g.css.dispatch({effects:Ee.of(null)})}function eu(){return a.htmlPartialUi||(a.htmlPartialUi=ri({Decoration:tt,StateField:dt,StateEffect:qt,RangeSetBuilder:ut,EditorView:B})),a.htmlPartialUi}function ou(){return a.htmlAntlersUi||(a.htmlAntlersUi=rd({Decoration:tt,StateField:dt,RangeSetBuilder:ut,EditorView:B})),a.htmlAntlersUi}function nu(){return a.htmlClassTokenUi||(a.htmlClassTokenUi=Mi({Decoration:tt,StateField:dt,StateEffect:qt,RangeSetBuilder:ut,EditorView:B})),a.htmlClassTokenUi}function su(t,e,o){g[e]?.destroy();const n=yo.of([{key:"Mod-s",run:()=>(z(t.document),!0)}]);g[e]=new B({state:se.create({doc:"",extensions:[Ha(),Wa(),ja(),bc(e),cf(e),Va(),qa({tooltipClass:()=>"sve-tw-complete"}),...e==="html"?[Le.data.of({autocomplete:si(t)}),Le.data.of({autocomplete:Kl(t)}),Gl(t),ai(Xa,t)]:[],...e==="html"?[...Si(),wi()]:[],...e==="css"?[Qa(),Qd(),tu()]:[],yo.of([...za,...e==="html"?[{key:"Tab",run:$i}]:[],Ra,...Na,...Ga,...Ua]),n,B.lineWrapping,...e==="html"||e==="css"?eu().extensions:[],...e==="html"?ou().extensions:[],...e==="html"?Kd(t).extensions:[],...e==="html"?Zd().extensions:[],...e==="html"?nu().extensions:[],Yt[e].of(se.readOnly.of(!!a.lastLocked)),Zt[e].of(B.editable.of(!a.lastLocked)),B.updateListener.of(s=>{e==="html"&&s.docChanged&&a.htmlAll&&!a.htmlScopeActive&&(a.htmlFocus=Jd(a.htmlFocus,s.changes)),e==="html"&&s.docChanged&&!a.applying&&(yc(),Co("dock:html-changed")),e==="css"&&s.docChanged&&!a.applying&&kc(),s.docChanged&&X(t),e==="css"&&(s.docChanged||s.selectionSet)&&E(t),e==="css"&&s.docChanged&&!a.applying&&Rt(t),e==="html"&&(s.docChanged||s.selectionSet)&&(Re(t),Ve(t),lt(t),a.applying||pe(t))}),B.domEventHandlers({click:(s,r)=>(e==="html"&&r===g.html&&$c(t),!1)}),...hr(C,{height:"auto",background:"#1E1E21",scroller:{overflow:"visible",height:"auto",minHeight:0},extraTags:s=>[{tag:s.tagName,color:"#4ec9b0"},{tag:s.attributeName,color:"#9cdcfe"},{tag:s.attributeValue,color:"#ce9178"},{tag:s.angleBracket,color:"#808080"}]})]}),parent:o})}function au(t){if(!t||t.querySelector(".cm-editor"))return;t.replaceChildren();const e=t.ownerDocument.createElement("span");e.style.cssText="width:16px;height:16px;margin:12px;border:2px solid #858585;border-right-color:transparent;border-radius:50%;display:block;animation:sve-cm-wait .6s linear infinite",t.appendChild(e)}function bt(t){return $o(t).map(e=>({handle:e.handle,base:e.base,max:e.max,media:e.media,media_px:e.media_px,label:e.label}))}function va(t,e){return bt(t).find(o=>o.handle===e)||null}function Ue(t=a.cssState){return t?t==="before"||t==="after"?`::${t}`:`:${t}`:""}function Rt(t,e=!1){const o=g.css;if(!o||!ko||!xo)return;const n=o.state.doc.toString(),s=`${a.cssValues?"1":"0"}|${a.cssSize}|${He(n).map(f=>`${f.from}-${f.to}`).join(",")}`;if(!e&&s===a.cssFoldSig)return;a.cssFoldSig=s;const r=bt(t),i=new Map,l=[...$l(n,r,a.cssSize),...a.cssValues?[]:$e(n,r,a.cssSize).map(f=>({from:f.from,to:f.to}))];for(const f of l)f.to>f.from&&i.set(`${f.from}:${f.to}`,{from:f.from,to:f.to});const c=[],d=new Set;tr(o.state).between(0,n.length,(f,h)=>{const m=`${f}:${h}`;d.add(m),!i.has(m)&&a.cssOwnFolds.has(m)&&c.push(xo.of({from:f,to:h}))});for(const[f,h]of i)d.has(f)||c.push(ko.of(h));a.cssOwnFolds=new Set(i.keys()),c.length&&o.dispatch({effects:c})}function vo(t,e){const o=a.cssFull||e;return/max-width/i.test(o)&&!/width\s*</i.test(o)&&t.media_px||t.media}function ru(t,e){const o=g.css;if(!o||o.state.readOnly)return;const n=bt(t),s=va(t,e),r=o.state.doc.toString();if(!s||s.base){const f=o.state.selection.main.head,h=He(r).find(m=>f>=m.from&&f<=m.to);h&&o.dispatch({selection:{anchor:h.from},scrollIntoView:!0});return}const i=Oo(r,n,e);if(i.length){const f=i[0],h=Math.min(f.bodyTo,f.bodyFrom+(r.slice(f.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);o.dispatch({selection:{anchor:h},scrollIntoView:!0});return}const l=vo(s,r),c=ba(o,r),d=`

${c.indent}@media ${l} {
${c.indent}    
${c.indent}}${c.suffix}`;o.dispatch({changes:{from:c.at,to:c.at,insert:d},selection:{anchor:c.at+d.lastIndexOf("    ")+4},scrollIntoView:!0})}function ba(t,e){const o=He(e);if(o.length){const i=o[o.length-1];return{at:i.to,indent:_t(e,i.from),suffix:""}}const n=i=>({at:i.to,indent:_t(e,i.to)||`${_t(e,i.open)}    `,suffix:`
${_t(e,i.open)}`}),s=Ne();if(s)return n(s);const r=iu(e);return r?n(r):{at:e.length,indent:"",suffix:""}}function iu(t){const e=String(t||"");let o=null,n=0,s=0;for(;n<e.length;){if(e[n]==="}"||e[n]===";"){n+=1,s=n;continue}if(e[n]!=="{"){n+=1;continue}const r=Fo(e,n);if(r===-1||o||(o=e.slice(s,n).trim().startsWith("@")?null:{from:s,open:n,to:r},!o))return null;n=r+1,s=n}return o}function lu(t,e){const o=e===a.cssSize?"":e;a.cssSize=o,q(t,Qo,o),rt("lp:set-device",{win:t,key:o?Sr(o,t):"Responsive"}),o&&ru(t,o),a.cssValues&&ka(t),Rt(t,!0),Zo(),lt(t),E(t)}function cu(t,e){a.cssState=tn.includes(e)?e:"",q(t,bo,a.cssState),$(t.document),lt(t),E(t)}function du(t,e){const o=t.document;$(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=k,o.body.appendChild(n),D(t,e,n),n._sveApp=H(et,n,{kind:"choices",choices:[{value:"",label:p(t,"css_state_none"),active:!a.cssState},...tn.map(s=>({value:s,label:Ue(s),active:s===a.cssState}))],onPick:s=>cu(t,s)})}function lt(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-css-head]");if(!o)return;const n=Mt(),s=bt(t),r=g.css?.state.doc.toString()??"";w.tag=n?.tag||"",w.scope=ii(n?gt().slice(n.from,n.openTo):"")||"",e.toggleAttribute("data-sve-css-unnamed",a.styleMode!=="tw"&&!w.scope);const i=w.scope,l=Ho(t,i);w.scopeElsewhere=[...new Set(l.map(c=>String(c.file).replace(/^.*\//,"")))],w.scopeElsewhereTitle=w.scopeElsewhere.length?`${p(t,"class_defined_in",{file:w.scopeElsewhere.join(", ")})} — ${p(t,"class_defined_import")}`:"",w.onScopeImport=()=>{Wo(t,i)&&lt(t)},i&&!Hs()&&Do(t).then(()=>lt(t)),w.note=a.cssPane==="empty"?p(t,"css_pane_empty"):"",w.canEdit=!a.lastLocked,w.onTag=c=>li(t,c.currentTarget,n),w.state=a.cssState,w.stateLabel=a.cssState?Ue(a.cssState):p(t,"css_state"),w.onState=c=>du(t,c.currentTarget),w.onSize=c=>lu(t,c),w.sizes=[{key:"",label:p(t,"tw_size_all"),title:p(t,"css_size_all_title"),active:!a.cssSize},...s.map(c=>{const d=c.base||Oo(r,s,c.handle).length>0;return{key:c.handle,label:c.label,title:c.base?p(t,"css_size_base_title"):`@media ${c.media}${d?"":`  ·  ${p(t,"css_size_new")}`}`,active:a.cssSize===c.handle}})],o._sveMounted||(o._sveMounted=!0,ae(o,Ol))}Pe("lp:device",t=>{const e=a.lastWin;if(!e||!$a(e.document))return;const o=$o(e).find(n=>n.device===t)?.handle||"";o!==a.cssSize&&(a.cssSize=o,q(e,Qo,o),Rt(e,!0),Zo(),lt(e),E(e))});function uu(t){const e=Math.max(0,Math.round(Date.now()/1e3-t)),o=new Date(t*1e3).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});let n=o;try{const s=new Intl.RelativeTimeFormat(void 0,{numeric:"auto"});e<90?n=s.format(-e,"second"):e<5400?n=s.format(-Math.round(e/60),"minute"):e<86400?n=s.format(-Math.round(e/3600),"hour"):n=s.format(-Math.round(e/86400),"day")}catch{}return`${n} · ${o}`}function ya(t,e){return t.fetch(e,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}})}async function fu(t,e){const o=t.document,n=yt();if($(o),!n)return;let s=[];try{const i=await ya(t,`/!/sve/section-template/history?type=${encodeURIComponent(n)}`);i.ok&&(s=(await i.json())?.entries||[])}catch{s=[]}if(!o.getElementById(u)||!o.contains(e))return;e.setAttribute("data-open","");const r=o.createElement("div");r.id=k,o.body.appendChild(r),D(t,e,r),r._sveApp=H(et,r,{kind:"choices",choices:s.length?s.map(i=>({value:i.id,label:uu(i.at)})):[{value:"",label:p(t,"code_dock_history_empty")}],onPick:i=>{$(o),i&&hu(t,n,i)}})}async function hu(t,e,o){if(ct())return;let n=null;try{const s=await ya(t,`/!/sve/section-template/history/entry?type=${encodeURIComponent(e)}&id=${encodeURIComponent(o)}`);s.ok&&(n=await s.json())}catch{n=null}!n||ct()||(zt({html:n.html??"",css:n.css??"",js:n.js??""},a.lastLocked),X(t),pe(t))}function Pt(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-code-strip]");if(!e)return;e.hidden=a.styleMode!=="tw";const o=Ss(t);e.innerHTML=jf,e.title=p(t,o?"tw_strip_on":"tw_strip_off"),e.setAttribute("aria-label",e.title),e.setAttribute("aria-pressed",o?"true":"false")}function pu(t,e){const o=e.querySelector("[data-sve-code-strip]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),ci(t,!Ss(t)),Pt(t),di(t)}),Pt(t))}function mu(t,e){const o=e.querySelector("[data-sve-code-history]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=zf,o.title=p(t,"code_dock_history"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),o.hasAttribute("data-open")){$(t.document);return}fu(t,o)}))}function kh(){return a.styleMode}function gu(t){return a.styleMode!=="tw"?null:yu()||vu()||(bu()?null:Mt())}function vu(){const t=Ke(),e=t?hi(t.html,t.pos):null;return e?{kind:"component",tagCall:!0,src:e.src,label:e.src,from:e.from,to:e.to,openTo:e.to,path:`a${e.from}:${e.src}`}:null}function bu(){const t=Ke();return!!t&&!!pi(t.html,t.pos)}function Ke(){const t=g.html;if(!t)return null;const e=a.htmlScopeActive&&!!a.htmlFocus,o=e?a.htmlFull:t.state.doc.toString(),n=e?a.htmlFocus.from:0;return{html:o,pos:n+t.state.selection.main.from}}function yu(){const t=Ke();return!t||!fi(t.html,t.pos)?null:Ht(ks(t.html),new Set).find(e=>e.kind==="component"&&e.from<=t.pos&&t.pos<e.to)||null}function Mt(t){const e=Ke();if(!e)return null;const{html:o,pos:n}=e,s=Ht(ie(o),new Set);let r=null;for(const i of s)i.from<=n&&n<i.to&&(r=i);return r}function pe(t){a.styleMode==="tw"&&ui(t,gu())}function Jo(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-values-mode]");if(!e||!o)return;e.setAttribute("data-sve-values",a.cssValues?"on":"off");const n=t.document.createElement("span");n.textContent=p(t,"code_dock_values"),o.innerHTML=Nf,o.appendChild(n),o.title=p(t,a.cssValues?"code_dock_values_off":"code_dock_values_on"),o.setAttribute("aria-label",o.title),o.setAttribute("aria-pressed",a.cssValues?"true":"false")}function ka(t){const e=g.css;if(!e||e.state.readOnly)return;const o=bt(t),n=e.state.doc.toString(),s=$e(n,o,a.cssSize);if(e.focus(),s.length){const m=s[0],b=Math.min(m.bodyTo,m.bodyFrom+(n.slice(m.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);e.dispatch({selection:{anchor:b},scrollIntoView:!0});return}const r=va(t,a.cssSize);if(!r||r.base){const m=`#id-{{ id }} {
    `;e.dispatch({changes:{from:0,to:0,insert:`${m}
}

`},selection:{anchor:m.length},scrollIntoView:!0});return}const i=Oo(n,o,a.cssSize)[0];if(i){const m=`${_t(n,i.from)}    `,b=`
${m}#id-{{ id }} {
${m}    `;e.dispatch({changes:{from:i.bodyFrom,to:i.bodyFrom,insert:`${b}
${m}}
`},selection:{anchor:i.bodyFrom+b.length},scrollIntoView:!0});return}const l=ba(e,n),c=`${l.indent}    `,d=$e(n,o,"").some(m=>l.at>m.bodyFrom&&l.at<=m.bodyTo),f=d?`

${l.indent}@media ${vo(r,n)} {
${c}`:`

${l.indent}@media ${vo(r,n)} {
${c}#id-{{ id }} {
${c}    `,h=d?`
${l.indent}}${l.suffix}`:`
${c}}
${l.indent}}${l.suffix}`;e.dispatch({changes:{from:l.at,to:l.at,insert:`${f}${h}`},selection:{anchor:l.at+f.length},scrollIntoView:!0})}function ku(t,e){a.cssValues=!!e,q(t,cn,a.cssValues?"1":"0"),$(t.document),a.cssOpenTool="",Jo(t),V(),vt(),a.cssValues&&ka(t),Rt(t,!0),Zo(),lt(t),E(t)}function Kn(t,e){a.cssAll=!!e,$(t.document),a.cssOpenTool="",At(t),V(),vt(),Rt(t,!0),lt(t),E(t)}function xu(t,e){const o=qo();e?(o.html&&Mn(t,!0),o.css&&Kn(t,!0)):(Mn(t,!1),a.cssAll&&Kn(t,!1)),At(t)}function _u(t){xu(t,!qs())}function Ge(t){const e=t?.document.getElementById(u);if(!e)return;const o=a.styleMode==="tw";e.setAttribute("data-sve-style",a.styleMode);const n=e.querySelector("[data-sve-css-label]");n&&(n.textContent=o?p(t,"code_dock_style_tw"):p(t,"code_dock_css"));const s=e.querySelector("[data-sve-style-mode]");if(!s)return;const r=t.document.createElement("span");r.textContent=o?p(t,"code_dock_style_tw"):p(t,"code_dock_css"),s.innerHTML=o?qf:Rf,s.appendChild(r),s.title=p(t,o?"code_dock_style_to_css":"code_dock_style_to_tw"),s.setAttribute("aria-label",s.title),s.setAttribute("aria-pressed",o?"true":"false")}function xa(t){t?.document.getElementById(u),$(t.document),lo(t),a.cssOpenTool="",a.cssOpenMenu="",a.styleMode==="tw"&&a.cssValues&&(a.cssValues=!1,q(t,cn,"0")),Ge(t),Jo(t),At(t),Pt(t),a.cssToolRow?.(),a.styleMode==="tw"&&(a.htmlScopePref=!0,q(t,Ye,"1"),fo(t,!0)),pe(t),Ve(t),E(t)}const Qo="sve-css-size",bo="sve-css-state",tn=["hover","focus","focus-visible","active","disabled","before","after"],Gn="data-sve-scroll-edge";function en(t){if(!t||t._sveEdges)return;t._sveEdges=!0;const e=()=>wu(t),o=new ResizeObserver(e),n=()=>{for(const s of t.children)o.observe(s)};t.addEventListener("scroll",e,{passive:!0}),o.observe(t),n(),new MutationObserver(()=>{n(),e()}).observe(t,{childList:!0}),e()}function Su(t,e){if(!t||t._sveEdgesIn)return;t._sveEdgesIn=!0;const o=()=>t.querySelectorAll(e).forEach(en);o(),new MutationObserver(o).observe(t,{childList:!0,subtree:!0})}function wu(t){const e=t.scrollWidth-t.clientWidth,o=t.scrollLeft>1,n=e-t.scrollLeft>1,s=o&&n?"both":o?"left":n?"right":"";s?t.setAttribute(Gn,s):t.removeAttribute(Gn)}function $u(t,e){a.styleMode=e==="tw"?"tw":"css",q(t,ar,a.styleMode),xa(t)}function Cu(t,e){if(e._sveStyleModeBound)return;e._sveStyleModeBound=!0,a.styleMode=Y(t,ar)==="tw"?"tw":"css";const o=Y(t,Qo)||"";a.cssSize=$o(t).some(n=>n.handle===o)?o:"",a.cssState=tn.includes(Y(t,bo))?Y(t,bo):"",a.cssValues=Y(t,cn)==="1",e.querySelector("[data-sve-style-mode]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),$u(t,a.styleMode==="tw"?"css":"tw")}),e.querySelector("[data-sve-values-mode]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),ku(t,!a.cssValues)}),e.querySelector("[data-sve-all]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),_u(t)}),xa(t),Jo(t),At(t)}function Au(t,e){const o=e.querySelector("[data-sve-css-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=r=>e.querySelector(`[data-sve-css-tool="${r}"], [data-sve-css-kid="${r}"]`),s=r=>{const i=n(r.id),l=a.cssOpenMenu===r.id;if($(t.document),l){lo(t),E(t);return}if(!i)return;const c=a.styleMode==="tw"?!r.twClass&&(!!r.tw||!!r.twGroup):!r.kind&&!r.value&&!(r.css in J())&&!!r.menu,d=()=>{c&&(a.cssOpenMenu=r.id)},f=()=>{a.cssOpenTool="",E(t)};if(a.styleMode==="tw"){lo(t),r.twClass?(mi(t,r.twClass),E(t)):r.twGroup?(gi(t,i,r.title,r.twGroup,f),d(),E(t)):r.tw&&(vi(t,i,r.tw,f),d(),E(t));return}if(r.kind==="flexDir"){Xc(r.value);return}if(r.kind==="display"){Yc(r.value);return}if(r.value){const h=P(J()[r.css])===P(r.value);G([{property:r.css,value:h?null:r.value}]);return}if(r.css in J()){G([{property:r.css,value:null}]),E(t);return}r.menu==="colors"?Qc(t,i,r.css):r.menu==="spacing"?ed(t,i,r.css):r.menu==="sizes"?Dn(t,i,r.css,Zf):r.menu==="choices"?td(t,i,r.css,r.choices):r.menu==="values"&&Dn(t,i,r.css),d(),E(t)};ft.onTool=r=>{const i=Be.get(r)?.tool;if(i){if(i.kids?.length){a.cssOpenTool=a.cssOpenTool===i.id?"":i.id,$(t.document),E(t);return}s(i)}},ft.onKid=(r,i)=>{const l=Be.get(i);l?.kid&&s(l.kid)},a.cssToolRow=()=>{ae(o,xl),E(t)},a.cssToolRow(),en(o),Su(o,"[data-sve-css-kids]"),t.document.addEventListener("mousedown",r=>{r.target.closest(`#${k}, [data-sve-css-tools], [data-sve-html-tools], [data-sve-css-add-class]`)||$(t.document)},!0)}function Tu(t,e){const o=e.querySelector("[data-sve-html-tidy]");o&&(o.innerHTML=ws.tidy,o.title=p(t,"code_dock_html_tidy"),o.setAttribute("aria-label",o.title),o.setAttribute("data-tip",o.title))}function Mu(t,e){const o=e.querySelector("[data-sve-html-tidy]");Tu(t,e),!(!o||o._sveBound)&&(o._sveBound=!0,o.addEventListener("mousedown",n=>n.preventDefault()),o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),ea()}))}function Eu(t,e){const o=e.querySelector("[data-sve-html-tools]");!o||o._sveBound||(o._sveBound=!0,ae(o,ml,{tools:_o.map(n=>({...n,icon:ws[n.id]||""})),onTool:n=>{const s=_o.find(i=>i.id===n),r=o.querySelector(`[data-sve-html-tool="${n}"]`);if(s){if(s.menu==="heading"){Bn(t,r,lr);return}if(s.menu==="text"){Bn(t,r,Er);return}if(s.tidy){ea();return}if(s.menu==="component"){zc(t,r);return}if($(t.document),s.action==="pagination"){Wc();return}if(s.snippet){ta(s.snippet,s.caret??s.snippet.length,s.select),I();return}oa(s.tag)}}}),en(o),nf(t,e),af(t,e),of(t,e))}A("dock:save-now",()=>(z(a.lastWin?.document),!0));let xe=null;async function Fu(t){const e=t.document;mf(e);let o=e.getElementById(u);if(o&&!(o.querySelector('[data-sve-css-chrome="subrow-2"]')&&o.querySelector("[data-sve-css-add-class]")&&o.querySelector("[data-sve-html-tools]")&&o.querySelector("[data-sve-html-tidy]")&&o.querySelector("[data-sve-data-vars]")&&o.querySelector("[data-sve-visual-edit-tools]")&&o.querySelector("[data-sve-html-scope]")&&o.querySelector("[data-sve-code-lock]")&&o.querySelector("[data-sve-code-back]")&&o.querySelector("[data-sve-code-autosave]")&&o.querySelector("[data-sve-code-save]")&&o.getAttribute("data-sve-code-chrome")==="scope-9")){for(const s of st)g[s]?.destroy(),g[s]=null;o.remove(),o=null}if(!o){o=e.createElement("div"),o.id=u,o.setAttribute("data-sve-code-chrome","scope-9"),Object.defineProperty(o,"__sveSavedCss",{get:()=>a.lastParts?.css??""}),Pr(o,Ir(t)),ae(o,cl,{htmlLabel:p(t,"code_dock_html"),cssLabel:p(t,"code_dock_css"),jsLabel:p(t,"code_dock_js"),alpineLabel:p(t,"code_dock_alpine"),treeIcon:ir,dataIcon:Pf,dataLabel:p(t,"data_vars_title")}),io(e,o),Jn(o),Ia(o,Fa(t)),_f(t,o),wf(t,o),Sf(t,o),Au(t,o),Nc(t,o),Cu(t,o),mu(t,o),pu(t,o),Or(t,o),Eu(t,o),En(t,o),An(t,o),Qn(t,o),Tn(t,o);for(const n of st){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);au(s)}Dr(t)}if(io(e,o),Jn(o),Mu(t,o),En(t,o),An(t,o),Qn(t,o),Tn(t,o),yf(t),nn(t),wt(t),R(t),Dt(t),Q(t),Ge(t),Pt(t),await Cf(),!g.html){for(const n of st){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);s?.replaceChildren(),su(t,n,s)}for(const n of["html","css"])g[n]&&bi(t,g[n],{onOpen:s=>Us(t,s),emptyLabel:p(t,"code_dock_partials_empty"),openLabel:s=>p(t,"component_open_named",{name:s}),sectionValues:()=>Vs(t),isLocked:()=>ct(),setHover:(s,r)=>a.htmlPartialUi?.setHover(s,r)});Li(t,g.html,{onRename:n=>Sc(t,n),isLocked:()=>ct(),setHover:(n,s)=>a.htmlClassTokenUi?.setHover(n,s),title:p(t,"code_dock_css_rename_class")})}return o}function on(t){return xe||(xe=Fu(t).finally(()=>{xe=null})),xe}async function Xn(t,e){const o=await on(t);a.lastType=e,a.lastLocked=!0,a.lockReady=!0,a.lastParts={html:"",css:"",js:""},ue(),wt(t),zt(a.lastParts,!0),rn(t.document,e),O(t.document,p(t,"code_dock_missing")),R(t),Dt(t),Q(t),Ot(t,o)}let Yn=-1;async function _a(t,e){if(Yn===a.loadGen&&!a.lastType&&t.document.getElementById(u))return;z(e);const o=++a.loadGen;Yn=o,a.lastType=null,a.typeStack=[],a.lastParts={html:"",css:"",js:""},a.lastProps=[],a.propsDirty=!1,a.lastLocked=!1,a.lockReady=!1,a.loadInFlight=null,zs(),ue();const n=await on(t);o===a.loadGen&&(zt(a.lastParts,!0),Io(t),Ie(t),Lo(t),rn(t.document,""),O(t.document,p(t,wr(t,t.document)?"code_dock_pick_section":"code_dock_open_template")),wt(t),R(t),Dt(t),Q(t),Ge(t),Pt(t),Ot(t,n))}function Sa(t){return Qt(t,a.lastType)||Qt(t,a.typeStack[0])}function Lu(t,e,o){if(o==="replace"){if(!Qt(t,e)){a.beforePart=null;return}Sa(t)||(a.beforePart={type:a.lastType||"",uid:a.lastUid||"",stack:[...a.typeStack],onEmptyPage:!!a.onEmptyPage})}}function wa(t,e){if(!Sa(t))return!1;const o=a.beforePart,n=o?.type||"",s=o?.stack[0]||n,r=!!(n&&o.uid&&Aa(t,e,o.uid)===s),i=!!(n&&n.startsWith("view:")&&s.startsWith("view:"));return a.beforePart=null,a.lastWin=t,z(e),!r&&!i?(a.lastUid=null,a.onEmptyPage=!0,_a(t,e),!0):(a.lastUid=o.uid||null,a.onEmptyPage=o.onEmptyPage,Nt(t,n,"replace"),a.typeStack=[...o.stack],!0)}async function Nt(t,e,o="replace"){Lu(t,e,o),o==="replace"?a.typeStack=[]:o==="push"&&a.lastType&&a.lastType!==e&&a.typeStack.push(a.lastType);const n=++a.loadGen;a.lastType=e,a.lockReady=!1,ue(),O(t.document,p(t,"code_dock_loading"));let s=()=>{};a.loadInFlight=new Promise(i=>{s=i});const r=await on(t);wt(t),R(t),Dt(t),Q(t),Ge(t),Pt(t),Ot(t,r),t.fetch(`/!/sve/section-template?type=${encodeURIComponent(e)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async i=>{if(n!==a.loadGen)return;if(i.status===404){Xn(t,e);return}if(!i.ok)throw new Error(String(i.status));const l=await i.json();n===a.loadGen&&(a.lastParts={html:typeof l.html=="string"?l.html:"",css:typeof l.css=="string"?l.css:"",js:typeof l.js=="string"?l.js:""},a.lastProps=Array.isArray(l.props)?l.props:[],a.propsDirty=!1,a.lastType=e,a.lastLocked=!!l.locked,a.lockReady=!0,zs(),typeof l.tw=="string"&&l.tw!==""&&gc(a.lastParts.html,l.tw),wt(t),zt(a.lastParts,a.lastLocked),Lo(t),a.lastLocked||Rs(t,a.lastParts.html),rn(t.document,l.path||e),O(t.document,a.lastLocked?p(t,"code_dock_locked"):""),l.writable?.template===!1?O(t.document,p(t,"code_dock_not_writable")):l.writable?.tw===!1&&O(t.document,p(t,"code_dock_tw_not_writable")),Io(t),fl(t),Ie(t),R(t),Dt(t),Q(t),Ot(t,r))}).catch(()=>{n===a.loadGen&&(Xn(t,e),O(t.document,p(t,"code_dock_error")))}).finally(()=>{n===a.loadGen&&(a.loadInFlight=null),s()})}function yt(){return a.lastType||""}function $a(t){return!!t?.getElementById(u)}function ct(){return a.lastLocked}function Bu(t,e){const o=typeof e?.html=="string"?e.html.trim():"",n=typeof e?.css=="string"?e.css.trim():"",s=typeof e?.js=="string"?e.js.trim():"";if(!o&&!n&&!s||!t?.document?.getElementById(u))return!1;let r=!1;return o&&(r=Pu("html",o)||r),n&&(r=Zn("css",n)||r),s&&(r=Zn("js",s)||r),r&&X(t),r}function Pu(t,e){const o=g[t];if(!o||o.state.readOnly)return!1;const n=o.state.selection.main,s=n.from>0?o.state.doc.sliceString(n.from-1,n.from):`
`,r=n.to<o.state.doc.length?o.state.doc.sliceString(n.to,n.to+1):`
`,c=`${s===`
`?"":`
`}${e}${r===`
`?"":`
`}`;return o.dispatch({changes:{from:n.from,to:n.to,insert:c},selection:{anchor:n.from+c.length}}),!0}function Zn(t,e){const o=g[t];if(!o||o.state.readOnly)return!1;const n=o.state.doc.length,r=`${n>0&&o.state.doc.sliceString(Math.max(0,n-1),n)!==`
`?`

`:n?`
`:""}${e}
`;return o.dispatch({changes:{from:n,insert:r},selection:{anchor:n+r.length}}),!0}function Iu(t){if(Ae(t),!a.lastType||!t.document.getElementById(u))return;const e=a.lastType;a.lastType=null,Nt(t,e,"keep")}function Ca(t){N(t),a.loadGen+=1,z(t),a.lastUid=null,a.lastType=null,a.typeStack=[],a.beforePart=null,a.lastParts={html:"",css:"",js:""},a.lastLocked=!1,a.lockReady=!1,a.lastBracketNames=null,a.lastCssSelectorNames=null,ue(),a.lastWin=t?.defaultView||a.lastWin,$(t),ys(t),nt(t),t?.getElementById(K)?.remove();for(const o of st)g[o]?.destroy(),g[o]=null;t?.getElementById(u)?.remove(),bf(),t&&sn(t,0);const e=t?.defaultView||a.lastWin;e?.document.getElementById(os)&&is(e),e&&(Io(e),Ie(e),Lo(e))}function Ou(t){if(a.dragging)return;const e=t.document.getElementById(u);e&&(nn(t),Ot(t,e))}function Aa(t,e,o){if(o){const r=mn(o,e)||mn(o,t.document)||o;return String(typeof eo=="function"&&(eo(r,e)||eo(r,t.document))||"").trim()}const n=typeof Jt=="function"?Jt(t):"page_sections",s=typeof U=="function"?U(t.document):[];for(const r of s){const l=(mt(r.values)||r.values)?.[n];if(Array.isArray(l))for(const c of l){const d=typeof c?.type=="string"?c.type.trim():"";if(d)return d}}return""}function Xe(t){if((t.Statamic?.$config?.get?.("sveFeatures")||{}).collection_templates!==!0)return"";const o=t.Statamic?.$config?.get?.("sveCollectionTemplatesCollection")||"templates";if(!(t.location?.pathname||"").includes(`/collections/${o}/entries/`))return"";const s=typeof U=="function"?U(t.document):[];for(const r of s){const i=mt(r.values)||r.values,l=typeof i?.view=="string"?i.view.trim():"";if(!l||l.includes(".."))continue;const c=l.replace(/\.(antlers\.html|blade\.php)$/i,"").replace(/^\/+|\/+$/g,"");if(c)return`view:${c}`}return""}function Du(t,e,o){const n=t.Statamic?.$config?.get?.("sveChromeTemplates")||{},s=n[e]&&typeof n[e].type=="string"?n[e]:null,r=t.Statamic?.$config?.get?.("sveChromeStyles")||{},i=`${e}/${typeof r[e]=="string"&&r[e]!==""?r[e]:"style_1"}`,l=s?.type||i,c=o?.[`${e}_style`];return(!s||s.styled)&&typeof c=="string"&&c!==""?`${e}/${c}`:l}function Hu(){const t=yt();if(!t)return"";if(t===ns)return"main";if(a.lastWin&&t===Xe(a.lastWin))return"template";const e=t.match(/^(header|footer)\//);if(e)return e[1];const o=a.lastWin?.Statamic?.$config?.get?.("sveChromeTemplates")||{};return["header","footer"].find(n=>o[n]?.type===t)||""}function Wu(t){const e=cs||ds;return e!=="header"&&e!=="footer"?"":Ao(t)||To(t)?e:""}function ju(t,e){const o=cs||ds;return o!=="header"&&o!=="footer"||!Ao(e)&&!To(e)?"":Du(t,o,mt(Br()?.values)||{})}function zu(t,e){if(!e||String(e).startsWith("view:")||Qt(t,e))return!1;const o=typeof Jt=="function"?Jt(t):"page_sections",n=typeof U=="function"?U(t.document):[];for(const s of n){const i=(mt(s.values)||s.values)?.[o];if(Array.isArray(i)&&i.some(l=>l?.type===e))return!0}return!1}function Ru(t){const e=ls(t)||t.getElementById("__sve-global-section-host");return e&&e.querySelector("[data-replicator-set][data-type]")?.getAttribute("data-type")||""}function xh(t,e,o){if(a.dragging)return;const n=!!(o&&o!==a.lastUid);if(o&&(a.lastUid=o),!t||!e||df(e)||!Fr(t)||!Lr(t)){e&&Ca(e);return}const s=!o&&!!a.lastType&&a.lastType!==ns&&!Ao(e)&&!To(e)&&!ls(e)&&!zu(t,a.lastType);if(s&&wa(t,e))return;s&&(a.lastUid=null);const r=o||a.lastUid||"",i=ju(t,e)||Ru(e)||(r?Aa(t,e,r):"")||Xe(t)||(!o&&!s?a.lastType:""),l=!i&&!o,c=l,d=i;if(a.onEmptyPage=l,a.lastWin=t,c){_a(t,e);return}if(d&&!(d===a.lastType&&e.getElementById(u))){if(a.typeStack.length&&a.lastType&&a.lastType!==d){const f=a.typeStack[0];if(d===f&&!n)return;a.typeStack=[]}z(e),Nt(t,d,"replace")}}Pe("tw:changed",()=>{a.lastWin&&a.styleMode==="tw"&&E(a.lastWin)});A("dock:is-open",t=>$a(t));A("dock:is-locked",()=>ct());A("dock:html",()=>gt());A("dock:reveal-html",({from:t,to:e,caret:o}={})=>{const n=g.html;if(!n||t==null)return;a.htmlScopePref=le(a.lastWin),Tt(),V();const s=a.htmlFull.length,r=Math.max(0,Math.min(t,s)),i=Math.max(r,Math.min(e??t,s));a.htmlFocus=i>r?{from:r,to:i}:null,a.cssFocus=null,a.cssAll=!1;const l=o==null?null:Math.max(0,Math.min(o,s));if(a.htmlScopePref&&a.htmlFocus){ze(l),R(a.lastWin);return}if(a.htmlScopeActive){Uo(!0,l),R(a.lastWin);return}n.dispatch({selection:l==null?{anchor:r,head:i}:{anchor:l},scrollIntoView:!0}),n.focus()});A("dock:insert-snippet",({win:t,parts:e})=>Bu(t,e));A("dock:refresh",t=>Iu(t));A("dock:tw-follow",()=>{a.lastWin&&pe(a.lastWin)});A("dock:css",()=>(V(),a.cssFull));A("dock:set-css",t=>typeof t!="string"||ct()||!g.css||!a.lastWin?!1:(V(),a.cssFull=t,ce("css",sa()),X(a.lastWin),!0));A("dock:js",()=>g.js?.state.doc.toString()??"");A("dock:set-js",t=>typeof t!="string"||ct()||!g.js||!a.lastWin?!1:(ce("js",t),X(a.lastWin),!0));A("dock:data-menu",({anchor:t,onPick:e,at:o}={})=>!t||!a.lastWin?!1:(N(a.lastWin.document),$(a.lastWin.document),Ta(a.lastWin,t,e,o),!0));A("dock:props",()=>a.lastProps.map(t=>({...t})));A("dock:set-props",({win:t,props:e}={})=>!Array.isArray(e)||ct()?!1:(a.lastProps=e,a.propsDirty=!0,yi(me(yt())),z((t||a.lastWin)?.document),!0));function me(t){const e=/^view:partials\/(components\/[A-Za-z0-9_-]+)$/.exec(String(t||""));return e?e[1]:""}A("dock:component-src",()=>me(yt()));A("dock:type-stack",()=>a.typeStack.map(t=>({type:t,src:me(t)})));A("dock:component-exit-state",()=>{const t=me(yt());return{open:!!t,name:t?t.split("/").pop():"",back:a.typeStack.length>0}});A("dock:exit-component",(t=1)=>{if(!a.lastWin||!me(yt()))return!1;if(a.typeStack.length){for(let e=Number(t)||1;e>1&&a.typeStack.length>1;e-=1)a.typeStack.pop();Ks(a.lastWin)}else Ca(a.lastWin.document);return!0});A("dock:current-type",()=>yt());A("dock:on-empty-page",()=>!!a.onEmptyPage);A("dock:current-uid",()=>a.lastUid);A("dock:leave-part",()=>{const t=a.lastWin;return t?(wa(t,t.document),!0):!1});A("dock:chrome-kind",()=>Hu());A("dock:collection-view",()=>a.lastWin?Xe(a.lastWin):"");A("dock:chrome-open",t=>Wu(t));A("dock:save-settled",()=>a.saveInFlight||null);A("dock:load-settled",()=>a.loadInFlight||null);A("dock:reset-data-vars",t=>(Pi(typeof t=="string"&&t?t:void 0),!0));A("dock:refresh-preview",()=>a.lastWin?(Ae(a.lastWin),!0):!1);A("dock:open-file",t=>typeof t!="string"||!t||!a.lastWin?!1:(a.onEmptyPage=!1,t===a.lastType||(z(a.lastWin.document),Nt(a.lastWin,t,"replace")),!0));A("dock:open-template",t=>typeof t!="string"||!t||!a.lastWin?!1:(Us(a.lastWin,t),!0));A("dock:set-html",t=>{const e=t&&typeof t=="object"?t:{},o=t&&typeof t=="object"?t.html:t;if(typeof o!="string"||ct())return!1;if(o!==""&&!_s(gt(),o)){const i=a.lastWin;if(!(e?.unlock===!0&&i?.Statamic?.$permissions?.has?.("configure fields")===!0))return i?.Statamic?.$toast?.error(p(i,"html_tree_locked_element")),!1}const n=g.html;if(!n||!a.lastWin)return!1;if(o===""){a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null),a.twDirty=!1,a.twCss=null,a.twKey="",a.lastType=null,a.lastUid=null,a.lastParts={html:"",css:"",js:""},a.cssFull="",a.htmlFull="",a.applying=!0;try{ue();for(const i of st){const l=g[i];if(!l)continue;const c=l.state.doc.toString();c!==""&&l.dispatch({changes:{from:0,to:c.length,insert:""}})}}finally{a.applying=!1}return!0}const s=a.htmlFull;if(a.htmlFull=o,a.htmlScopeActive)return a.htmlFocus=Nu(a.htmlFocus,s,o),de(Ys()),X(a.lastWin),Co("dock:html-changed"),!0;const r=n.state.doc.toString();if(r!==o){const[i,l,c]=No(r,o);n.dispatch({changes:{from:i,to:l,insert:c}})}return!0});A("dock:show-empty",()=>rt("dock:set-html",""));Pe("row:removed",({parentPath:t,remaining:e,win:o})=>{e===0&&t===Jt(o)&&rt("dock:show-empty")});function Nu(t,e,o){const n=o.length-e.length;if(!t||!n)return t;let s=0;for(;s<e.length&&s<o.length&&e[s]===o[s];)s+=1;return s>=t.to?t:s<t.from?{from:Math.max(0,t.from+n),to:Math.max(0,t.to+n)}:{from:t.from,to:Math.max(t.from,t.to+n)}}const It="__sve-data-menu";let Fe=null;function N(t){const e=t?.getElementById(It);Fe?.(),Fe=null,e?._sveApp?.unmount(),e?.remove(),t?.querySelectorAll("[data-sve-data-vars][data-open], [data-sve-antlers-btn][data-open], [data-sve-visual-edit-btn][data-open]").forEach(o=>o.removeAttribute("data-open"))}function qu(t){if(!Xe(t))return{view:"",kind:""};const e=typeof U=="function"?U(t.document):[];for(const o of e){const n=mt(o.values)||o.values,s=typeof n?.source_collection=="string"?n.source_collection.trim():"";if(s)return{view:s,kind:String(n?.kind||"").trim()}}return{view:"",kind:""}}function Vu(t,e){const o=gt();if(Number.isFinite(e))return kn(o,e);const n=g.html;if(!n)return[];const s=a.htmlScopeActive&&a.htmlFocus?a.htmlFocus.from:0;return kn(o,s+n.state.selection.main.from)}function Uu(t,e){const{view:o,kind:n}=qu(t);return{collection:Ms(t)||"",set:Es(yt()),view:o,kind:n,scope:Bi(Vu(t,e))}}function Ku(t){const e=typeof U=="function"?U(t.document):[];for(const o of e){const n=mt(o.values)||o.values;if(n&&typeof n=="object")return n}return null}function Gu(t,e){return{scope:e?.scope?.groups||[],section:Bs(e?.section||[],Vs(t)),page:Di(e?.page||[],Ku(t)),site:e?.site||[]}}function Xu(t){const e=t.state.selection.main,o=t.state.doc.lineAt(e.from),n=o.text.slice(0,e.from-o.from);return/(?:^|\s)(?::|x-bind:)[\w.:-]+\s*=\s*(["'])(?:(?!\1).)*$/.test(n)}function Yu(t){const e=t.state.selection.main,o=t.state.doc.lineAt(e.from),n=o.text.slice(0,e.from-o.from);return/(?:^|\s)[\w.:@-]+\s*=\s*(["'])(?:(?!\1).)*$/.test(n)}function Zu(t,e){const o=g.html;if(!o||o.state.readOnly)return;if(Xu(o)){const c=String(t?.var||"").trim(),d=o.state.selection.main;o.dispatch({changes:{from:d.from,to:d.to,insert:c},selection:{anchor:d.from+c.length}}),I();return}const n=Hi(t,e,{inline:Yu(o)});if(!n)return;const s=o.state.selection.main,r=o.state.doc.lineAt(s.from),i=it(r.text),l=Bo(n.text,i);o.dispatch({changes:{from:s.from,to:s.to,insert:l},selection:{anchor:s.from+n.cursor+(n.text.includes(`
`)?i.length:0)}}),I()}function Xt(t,e,o){const n=e.getBoundingClientRect(),s=8,r=o.offsetWidth||368,i=o.offsetHeight||240,l=t.innerHeight-n.bottom-s,c=n.top-s,d=l>=i||l>=c?n.bottom+4:n.top-i-4;o.style.left=`${Math.max(s,Math.min(n.left,t.innerWidth-r-s))}px`,o.style.top=`${Math.max(s,Math.min(d,t.innerHeight-i-s))}px`}function Ta(t,e,o,n){const s=t.document;N(s),e.setAttribute("data-open","");const r=s.createElement("div");r.id=It,r.setAttribute("data-sve-data-menu",""),s.body.appendChild(r);const i=Uu(t,n),l=m=>[m?.scope?.groups?.length?{id:"scope",label:m.scope.label||p(t,"data_vars_tab_loop")}:null,{id:"section",label:p(t,"data_vars_tab_section")},{id:"page",label:p(t,"data_vars_tab_page")},{id:"site",label:p(t,"data_vars_tab_site")}].filter(Boolean),c=m=>{s.getElementById(It)&&(r._sveApp?.unmount(),r._sveApp=H($s,r,{title:p(t,"data_vars_title"),placeholder:p(t,"data_vars_placeholder"),emptyText:p(t,"data_vars_empty"),noSectionText:p(t,"data_vars_no_section"),loopText:p(t,"data_vars_loop"),tabs:l(m),data:Gu(t,m),onPick:(b,y)=>o?o(b,y):Zu(b,y)}),Xt(t,e,r))};c(Fs(Po(i))||{scope:null,section:[],page:[],site:[]}),Ls(t,i).then(c),Xt(t,e,r);const d=()=>Xt(t,e,r),f=m=>{!r.contains(m.target)&&!e.contains(m.target)&&N(s)},h=m=>{m.key==="Escape"&&N(s)};s.addEventListener("pointerdown",f,!0),s.addEventListener("keydown",h,!0),t.addEventListener("scroll",d,!0),t.addEventListener("resize",d),Fe=()=>{s.removeEventListener("pointerdown",f,!0),s.removeEventListener("keydown",h,!0),t.removeEventListener("scroll",d,!0),t.removeEventListener("resize",d)}}function Ma(t,e,{title:o,placeholder:n,tabs:s,data:r,onPick:i}){const l=t.document;N(l),$(l),e.setAttribute("data-open","");const c=l.createElement("div");c.id=It,c.setAttribute("data-sve-data-menu",""),l.body.appendChild(c),c._sveApp=H($s,c,{title:o,placeholder:n,emptyText:p(t,"data_vars_empty"),noSectionText:p(t,"data_vars_empty"),loopText:"",tabs:s,data:r,onPick:(d,f)=>{N(l),i(d,f)}}),Xt(t,e,c),Ju(t,e,c)}function Ju(t,e,o){const n=t.document,s=()=>Xt(t,e,o),r=l=>{!o.contains(l.target)&&!e.contains(l.target)&&N(n)},i=l=>{l.key==="Escape"&&N(n)};n.addEventListener("pointerdown",r,!0),n.addEventListener("keydown",i,!0),t.addEventListener("scroll",s,!0),t.addEventListener("resize",s),Fe=()=>{n.removeEventListener("pointerdown",r,!0),n.removeEventListener("keydown",i,!0),t.removeEventListener("scroll",s,!0),t.removeEventListener("resize",s)}}const Qu='<svg width="21" height="11" viewBox="0 0 150 77" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M69.999 55.827a13.8 13.8 0 0 0-.812-3.799 15.4 15.4 0 0 0-1.687-3.55 18.16 18.16 0 0 0-5.686-5.418 37.7 37.7 0 0 0 3.936-6.228 18.6 18.6 0 0 0 1.812-6.228 9.88 9.88 0 0 0-1.248-5.57 9.9 9.9 0 0 0-4.125-3.959 10.46 10.46 0 0 0-10.684 1.183 13.8 13.8 0 0 0-4.061 5.107 39 39 0 0 0-1.812 4.92 49.5 49.5 0 0 1-5.436-6.227 16.9 16.9 0 0 1-2.562-5.606 28.7 28.7 0 0 1-.624-6.85c.003-2-.357-3.983-1.063-5.855a10.66 10.66 0 0 0-4.56-5.231 13.9 13.9 0 0 0-10.684-1.37 10.13 10.13 0 0 0-4.94 2.755 10.1 10.1 0 0 0-2.683 4.967 24.4 24.4 0 0 0 0 10.214 22.4 22.4 0 0 0 3.374 7.35h-1.062a23 23 0 0 1-4.124 0 19.2 19.2 0 0 0-6.248 0 6.74 6.74 0 0 0-3.374 2.74 9.45 9.45 0 0 0-.75 9.341 11.23 11.23 0 0 0 5.811 6.228 25.1 25.1 0 0 0 10.622 1.495 17.9 17.9 0 0 0 9.809-3.425 104 104 0 0 1 10.496 7.162 22.4 22.4 0 0 1 5.249 6.54 15.5 15.5 0 0 1 1.437 5.106 35 35 0 0 0 1.437 6.789 13.2 13.2 0 0 0 4.373 5.73 15.6 15.6 0 0 0 10.372 2.802 9.9 9.9 0 0 0 5.429-1.987 9.84 9.84 0 0 0 3.38-4.677A61.6 61.6 0 0 0 70 55.827m-5.061 12.456a5.05 5.05 0 0 1-1.971 2.157 5.07 5.07 0 0 1-2.84.708 9.45 9.45 0 0 1-6.248-2.367 6.6 6.6 0 0 1-2.124-2.989 50 50 0 0 1-1.625-6.788 18.7 18.7 0 0 0-2.249-5.73 28.7 28.7 0 0 0-7.435-7.35A129 129 0 0 0 27.95 38.95c-.812-.498-2.686 0-2.749 0a14.03 14.03 0 0 1-7.872 1.62 19.5 19.5 0 0 1-7.935-2.056 4.86 4.86 0 0 1-2.375-2.49 3.35 3.35 0 0 1 0-2.99 1.18 1.18 0 0 1 .875-.748c1.25 0 2.687 0 3.936-.435a33 33 0 0 0 4.749-1.122 17.6 17.6 0 0 0 4.498-2.18 1.68 1.68 0 0 0 .838-1.68 1.7 1.7 0 0 0-.213-.624 2.2 2.2 0 0 0-.937-.747 18.65 18.65 0 0 1-2.812-7.35 19.5 19.5 0 0 1 .938-7.97 4.55 4.55 0 0 1 1.326-1.834 4.57 4.57 0 0 1 2.048-.97 7.52 7.52 0 0 1 5.498.997 5.12 5.12 0 0 1 2.499 3.488 87 87 0 0 0 1.874 10.587 22.4 22.4 0 0 0 4.436 6.789 78 78 0 0 0 8.372 7.286 1.8 1.8 0 0 0 1.188 1.246 2.005 2.005 0 0 0 2.499-1.308 33.4 33.4 0 0 1 3.249-6.54 8.8 8.8 0 0 1 2.811-2.677 4.63 4.63 0 0 1 4.561 0 4 4 0 0 1 1.612 1.494c.387.638.586 1.372.575 2.118a14.7 14.7 0 0 1-.75 5.792 36.6 36.6 0 0 1-2.561 6.228v.311a2.05 2.05 0 0 0 .5 2.74 13.6 13.6 0 0 1 3.248 4.92c.375.873.563 1.745.875 2.617s.937 2.678 1.312 4.048c1.625 5.916 2.5 7.536.875 10.961zM148.848 29.42a6.6 6.6 0 0 0-3.062-2.74 16.7 16.7 0 0 0-6.248 0c-1.227.09-2.459.09-3.686 0h-.937a24.2 24.2 0 0 0 3.186-7.536c.659-3.31.659-6.716 0-10.027a9.95 9.95 0 0 0-2.072-5.336 10 10 0 0 0-4.676-3.32 12.53 12.53 0 0 0-10.184 1.556 10.78 10.78 0 0 0-4.498 5.668 16.8 16.8 0 0 0-.875 5.667 32.7 32.7 0 0 1 0 6.602 17.2 17.2 0 0 1-2.499 5.543 52 52 0 0 1-4.748 5.792 32 32 0 0 0-1.5-4.547 14.4 14.4 0 0 0-3.811-5.231 9.522 9.522 0 0 0-10.56-.996 10.16 10.16 0 0 0-3.64 4.024 10.1 10.1 0 0 0-1.045 5.317c.21 2.156.78 4.26 1.687 6.228a38.3 38.3 0 0 0 3.748 6.228 17.5 17.5 0 0 0-5.435 5.668 15 15 0 0 0-1.562 3.55 18.3 18.3 0 0 0-.75 3.674v10.09c.068 1.417.32 2.82.75 4.172a9.46 9.46 0 0 0 3.062 4.609 9.5 9.5 0 0 0 5.123 2.118 14.1 14.1 0 0 0 9.871-2.927 12.76 12.76 0 0 0 4.124-5.792 34 34 0 0 0 1.562-6.727 17.6 17.6 0 0 1 1.375-5.107 21.1 21.1 0 0 1 4.623-6.228 83 83 0 0 1 8.935-7.349 16.34 16.34 0 0 0 8.997 3.301 22.24 22.24 0 0 0 9.746-1.557 10.777 10.777 0 0 0 5.499-6.228 9.88 9.88 0 0 0-.5-8.158m-5.623 6.229a4.43 4.43 0 0 1-2.062 2.553 16.16 16.16 0 0 1-7.06 2.18 11.7 11.7 0 0 1-7.123-1.869s-1.999-.81-2.812 0a123 123 0 0 0-11.558 7.038 26.9 26.9 0 0 0-6.811 7.224 79 79 0 0 0-3.623 12.456 6.23 6.23 0 0 1-2 3.052 7.88 7.88 0 0 1-5.373 2.305 4.63 4.63 0 0 1-2.523-.809 4.6 4.6 0 0 1-1.663-2.056 9.8 9.8 0 0 1-.812-3.488c.25-2.711.881-5.373 1.874-7.91.375-1.37.75-2.678 1.187-4.048s.438-1.806.812-2.616a13.26 13.26 0 0 1 2.937-5.044 2.054 2.054 0 0 0 .375-2.74 44 44 0 0 1-2.25-6.228 17.3 17.3 0 0 1-.687-5.792 4.22 4.22 0 0 1 1.937-3.675 3.57 3.57 0 0 1 3.811 0 8.3 8.3 0 0 1 2.625 2.678 40.5 40.5 0 0 1 3.061 6.228 1.93 1.93 0 0 0 1.664 1.441c.26.029.522.005.773-.07a1.82 1.82 0 0 0 1.187-1.309 80 80 0 0 0 7.872-7.411 22.5 22.5 0 0 0 3.999-6.664 75.4 75.4 0 0 0 1.749-10.525 5.17 5.17 0 0 1 1.937-3.176 5.76 5.76 0 0 1 4.749-.935 4.11 4.11 0 0 1 3.186 2.927c.751 2.609.985 5.338.687 8.035a19 19 0 0 1-2.561 7.473s-.625 0-.75.56a1.68 1.68 0 0 0 .5 2.367c1.27.908 2.657 1.641 4.123 2.18 1.468.49 2.972.865 4.499 1.121 1.125 0 2.374 0 3.561.436s.438.311.625.623c.235.52.351 1.087.341 1.657a3.9 3.9 0 0 1-.403 1.644z"/></svg>',tf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 9 5 12 1.8-5.2L21 14Z"/><path d="M7.2 2.2 8 5.1"/><path d="m5.1 8-2.9-.8"/><path d="M14 4.1 12 6"/><path d="m6 12-1.9 2"/></svg>';function Ea(t,e,o,n,s){const r=t.document.createElement("button");return r.type="button",r.setAttribute(o,""),r.title=s,r.setAttribute("aria-label",s),r.innerHTML=`<span>${n}</span>`,r.addEventListener("mousedown",i=>i.preventDefault()),e.replaceChildren(r),r}function ef(t){return String(t||"").replace(/\|/g,"").split(`
`)[0].trim()}function of(t,e){const o=e.querySelector("[data-sve-data-vars]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("mousedown",n=>n.preventDefault()),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),t.document.getElementById(It)){N(t.document);return}$(t.document),Ta(t,o)}))}function nf(t,e){const o=e.querySelector("[data-sve-antlers-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=Ea(t,o,"data-sve-antlers-btn",Qu,p(t,"code_dock_antlers"));n.addEventListener("click",s=>{if(s.preventDefault(),s.stopPropagation(),n.hasAttribute("data-open")){N(t.document);return}const r={};for(const i of xn)r[i.id]=Ci.filter(l=>l.group===i.id).map(l=>({id:l.id,var:l.label,value:l.inline?"":ef(l.snippet)}));Ma(t,n,{title:p(t,"code_dock_antlers"),placeholder:p(t,"code_dock_antlers_search"),tabs:xn.map(i=>({id:i.id,label:p(t,i.lang)})),data:r,onPick:i=>sf(i.id)})})}function sf(t){const e=Ai(t),o=g.html;if(!e||!o||o.state.readOnly)return;const n=o.state.selection.main.head;if(e.inline){const c=e.snippet,d=o.state.selection.main;o.dispatch({changes:{from:d.from,to:d.to,insert:c},selection:{anchor:d.from+c.length}}),I();return}const s=o.state.doc.lineAt(n),r=s.text.trim()?it(s.text):qe(o,s)||it(s.text),{text:i,cursor:l}=we(e.snippet);ee(Bo(i,r),l),I()}function af(t,e){const o=e.querySelector("[data-sve-visual-edit-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=Ea(t,o,"data-sve-visual-edit-btn",tf,p(t,"code_dock_visual_edit"));n.addEventListener("click",s=>{if(s.preventDefault(),s.stopPropagation(),n.hasAttribute("data-open")){N(t.document);return}const r={};for(const i of Sn)r[i.id]=Ps.filter(l=>l.group===i.id).map(l=>({id:l.id,var:l.label,value:l.attr?l.attr.replace(/\|/g,""):""}));Ma(t,n,{title:p(t,"code_dock_visual_edit"),placeholder:p(t,"code_dock_visual_edit_search"),tabs:Sn.map(i=>({id:i.id,label:p(t,i.lang)})),data:r,onPick:i=>lf(i.id)})})}function rf(t,e,o,n){if(zi(o.inner,n.attr)){t.focus();return}const{text:s,cursor:r}=we(n.attr);let i=o.closeIdx;for(;i>o.openIdx+2&&/\s/.test(e[i-1]);)i--;t.dispatch({changes:{from:i,to:o.closeIdx,insert:` ${s} `},selection:{anchor:i+1+r}}),I()}function lf(t){const e=Wi(t),o=g.html;if(!e||!o||o.state.readOnly)return;const n=o.state.doc.toString(),s=fe();if(s?.open){const h=ji(n,s.open.from,s.open.to,ve);if(h){e.attr?rf(o,n,h,e):(o.dispatch({selection:{anchor:h.openIdx+2+ve.length}}),o.focus());return}const m=s.open.from+1+s.name.length,b=e.standalone||`{{ ${ve} ${e.attr} }}`,{text:y,cursor:L}=we(b);o.dispatch({changes:{from:m,to:m,insert:` ${y}`},selection:{anchor:m+1+L}}),I();return}const r=o.state.selection.main.head,i=o.state.doc.lineAt(r),l=i.text.trim()?it(i.text):qe(o,i)||it(i.text),c=e.standalone||`{{ ${ve} ${e.attr} }}`,{text:d,cursor:f}=we(c);ee(Bo(d,l),f),I()}function cf(t){return t==="css"?Za():t==="js"?Ja():Ya({autoCloseTags:!0})}function Jn(t){if(t._sveShield)return;t._sveShield=!0;const e=o=>o.stopPropagation();for(const o of["keydown","keypress","keyup","pointerdown","pointerup","mousedown","mouseup","click","focusin"])t.addEventListener(o,e)}function df(t){try{return new URLSearchParams(t.defaultView?.location?.search||"").has("sve-panel")}catch{return!1}}function uf(t){const e=parseInt(Y(t,er)??"",10);return Number.isFinite(e)&&e>=rr?e:Mf}function ff(t,e){q(t,er,String(e))}function Fa(t){try{const e=JSON.parse(Y(t,or)||"null");if(e&&typeof e=="object")return{html:e.html!==!1,css:e.css!==!1,js:e.js===!0,alpine:e.alpine===!0}}catch{}return{html:!0,css:!0,js:!1,alpine:!1}}function hf(t,e){q(t,or,JSON.stringify(e))}function La(t){try{const e=JSON.parse(Y(t,nr)||"null");if(e&&typeof e=="object"){const o=s=>Number.isFinite(s)&&s>0?s:1,n={};for(const s of Ct)n[s]=o(e[s]);return n}}catch{}return Object.fromEntries(Ct.map(e=>[e,1]))}function pf(t,e){q(t,nr,JSON.stringify(e))}function mf(t){$r(t,Tf,`
@keyframes sve-cm-wait { to { transform: rotate(360deg); } }
#${u} {
  /* The tree's seven families, for the marks and the toolbar below. */
  ${Hr("dark")}
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
#${u}[data-sve-code-locked] [data-sve-values-mode] {
  display: none;
}
#${u} [data-sve-values-mode],
#${u} [data-sve-all],
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
#${u} [data-sve-all]:hover,
#${u} [data-sve-style-mode]:hover {
  opacity: 1;
  background: rgba(255,255,255,.16);
}
#${u} [data-sve-values-mode][aria-pressed="true"],
#${u} [data-sve-all][aria-pressed="true"],
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
  ${gn("ns")}
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
#${It} {
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
  ${gn("ew")}
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
#${ge} {
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
#${ge} [data-sve-partial-choice] {
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
#${ge} [data-sve-partial-choice]:hover {
  background: rgba(255,255,255,.1);
}
#${ge} [data-sve-partial-empty] {
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
`)}function gf(t){const e=t.querySelector(".live-preview-editor");if(!e)return 0;const o=e.getBoundingClientRect();return o.width<40||o.right<40?0:Math.round(o.right)}function vf(t){let e=0;for(const o of["__sve-section-picker","__sve-outline-panel","__sve-html-tree-panel","__sve-listview-panel","__sve-right-dock","__sve-chrome-designs","__sve-global-section-panel","__sve-ai-panel"]){const n=t.getElementById(o);if(!n||n.hasAttribute("data-sve-chrome-hidden")||n.hasAttribute("data-sve-right-closed")||n.style.display==="none")continue;const s=n.getBoundingClientRect();s.width>40&&s.right>t.documentElement.clientWidth-8&&(e=Math.max(e,Math.round(s.width)))}return e}function nn(t){const e=t.document;if(a.layoutWin=t,typeof t.ResizeObserver!="function")return;a.layoutObserver||(a.layoutObserver=new t.ResizeObserver(()=>{a.layoutWin&&Ou(a.layoutWin)}));const o=e.querySelector(".live-preview-editor"),n=e.getElementById("__sve-right-dock");o!==a.observedEditor&&(a.observedEditor&&a.layoutObserver.unobserve(a.observedEditor),a.observedEditor=o,o&&a.layoutObserver.observe(o)),n!==a.observedRight&&(a.observedRight&&a.layoutObserver.unobserve(a.observedRight),a.observedRight=n,n&&a.layoutObserver.observe(n))}function bf(){a.layoutObserver?.disconnect(),a.layoutObserver=null,a.layoutWin=null,a.observedEditor=null,a.observedRight=null}function yf(t){a.layoutWatchBound||(a.layoutWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>nn(t)))}function sn(t,e){const o=t.querySelector(".live-preview-contents");o&&(o.style.paddingBottom=e?`${e}px`:"")}function an(t){if(!t)return;const e=t.clientHeight,o=t.querySelector("[data-sve-code-bar]"),n=t.querySelector("[data-sve-code-lock-banner]"),s=n&&kf(t)?.getComputedStyle(n).display!=="none"?n.offsetHeight:0,r=Math.max(64,e-(o?.offsetHeight||0)-s),i=t.querySelector("[data-sve-code-panes]");i&&(i.style.height=`${r}px`,i.style.minHeight="0",i.style.overflow="hidden"),t.querySelectorAll("[data-sve-code-host]").forEach(l=>{const c=l.closest("[data-sve-code-pane]");if(!c||c.style.display==="none")return;let d=0;for(const h of c.children)h!==l&&(d+=h.offsetHeight);const f=Math.max(64,r-d);l.style.height=`${f}px`,l.style.maxHeight=`${f}px`,l.style.minHeight="0",l.style.overflow="auto",xf(l)})}function kf(t){return t.ownerDocument?.defaultView||a.lastWin}function xf(t){t._sveWheelBound||(t._sveWheelBound=!0,t.addEventListener("wheel",e=>{const o=t.scrollHeight-t.clientHeight,n=t.scrollWidth-t.clientWidth;let s=!1;if(e.deltaY&&o>0){const r=Math.min(o,Math.max(0,t.scrollTop+e.deltaY));r!==t.scrollTop&&(t.scrollTop=r,s=!0)}if(e.deltaX&&n>0){const r=Math.min(n,Math.max(0,t.scrollLeft+e.deltaX));r!==t.scrollLeft&&(t.scrollLeft=r,s=!0)}s&&(e.preventDefault(),e.stopPropagation())},{passive:!1}))}function Ba(){const t=(a.layoutWin||a.lastWin)?.document?.getElementById(u);t&&an(t);for(const e of st)g[e]?.requestMeasure()}function Pa(t,e){const o=Fa(t),n={};for(const s of Ct){const r=e.querySelector(`[data-sve-code-pane-btn="${s}"]`);n[s]=r?r.getAttribute("aria-pressed")==="true":o[s]}return n}function Ia(t,e){for(const n of Ct){const s=t.querySelector(`[data-sve-code-pane-btn="${n}"]`),r=t.querySelector(`[data-sve-code-pane="${n}"]`);s&&s.setAttribute("aria-pressed",e[n]?"true":"false"),r&&(r.style.display=e[n]?"flex":"none")}const o=Ct.filter(n=>e[n]);t.querySelectorAll("[data-sve-code-split]").forEach(n=>{const s=n.getAttribute("data-sve-code-split-after"),r=o.indexOf(s);n.style.display=r>=0&&r<o.length-1?"block":"none"}),Oa(t.ownerDocument.defaultView,t),an(t)}function Oa(t,e){const o=La(t);for(const n of Ct){const s=e.querySelector(`[data-sve-code-pane="${n}"]`);s&&(s.style.flex=`${o[n]} 1 0`)}}function Ot(t,e){if(a.dragging)return;const o=t.document;io(o,e);const n=uf(t),s=gf(o),r=vf(o);e.style.left=`${s}px`,e.style.right=`${r}px`,e.style.bottom="0",e.style.height=`${n}px`,sn(o,n),an(e)}function Da(t,e,o,n){a.dragging=!0,Wr(t,e,o,()=>{a.dragging=!1,n?.()},"data-sve-code-drag-shield")}function _f(t,e){if(e._sveResizeBound)return;e._sveResizeBound=!0;const o=n=>{if(n.button!==0||n.target.closest('button, a, input, select, textarea, label, [role="button"], [contenteditable], .cm-editor'))return;n.preventDefault();const s=n.clientY,r=e.getBoundingClientRect().height;let i=r;Da(t,"ns-resize",l=>{i=Math.min(Math.max(rr,r+(s-l.clientY)),Math.round(t.innerHeight*.7)),e.style.height=`${i}px`,sn(t.document,i),Ba()},()=>{ff(t,i),Ot(t,e),t.dispatchEvent(new Event("resize"))})};e.querySelector("[data-sve-code-bar]")?.addEventListener("mousedown",o),e.querySelector("[data-sve-code-grip]")?.addEventListener("mousedown",o)}function Sf(t,e){e._sveSplitBound||(e._sveSplitBound=!0,e.querySelectorAll("[data-sve-code-split]").forEach(o=>{o.addEventListener("mousedown",n=>{if(n.button!==0)return;n.preventDefault(),n.stopPropagation();const s=o.getAttribute("data-sve-code-split-after"),r=Ct.filter(L=>Pa(t,e)[L]),i=r.indexOf(s),l=r[i],c=r[i+1];if(!l||!c)return;const d=e.querySelector(`[data-sve-code-pane="${l}"]`),f=e.querySelector(`[data-sve-code-pane="${c}"]`),h=n.clientX,m=d.getBoundingClientRect().width,b=f.getBoundingClientRect().width,y=m+b;o.setAttribute("data-active",""),Da(t,"col-resize",L=>{const ur=L.clientX-h;let Ze=Math.max(ro,Math.min(y-ro,m+ur)),dn=y-Ze;y<ro*2&&(Ze=m,dn=b);const Je=La(t);Je[l]=Ze,Je[c]=dn,pf(t,Je),Oa(t,e),Ba()},()=>{o.removeAttribute("data-active")})})}))}function wf(t,e){e._svePaneBound||(e._svePaneBound=!0,e.querySelectorAll("[data-sve-code-pane-btn]").forEach(o=>{o.addEventListener("click",n=>{n.stopPropagation();const s=o.getAttribute("data-sve-code-pane-btn"),r=Pa(t,e),i={...r,[s]:!r[s]};!i.html&&!i.css&&!i.js&&(i[s]=!0),hf(t,i),Ia(e,i)})}))}function O(t,e){const o=t.getElementById(u)?.querySelector("[data-sve-code-status]");o&&(o.textContent=e||"")}function rn(t,e){const o=t.getElementById(u)?.querySelector("[data-sve-code-path]");o&&(o.textContent=e||"",o.title=e||"")}function Dt(t){const e=t?.document?.getElementById(u)?.querySelector("[data-sve-code-back]");e&&(e.hidden=a.typeStack.length===0,e.title=p(t,"code_dock_back"),e.setAttribute("aria-label",e.title),e.innerHTML=Bf)}function Qn(t,e){const o=e.querySelector("[data-sve-code-back]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Ks(t)}))}let B,yo,Ha,Wa,ja,kt,se,dt,qt,ut,tt,za,Ra,Na,ln,qa,Va,Ua,Ka,Ga,Xa,Le,Ya,Za,Ja,Qa,ko,xo,tr,$f,Ut=null,C=null;function Cf(){return Ut||(Ut=pr().then(t=>{C=t,B=C.view.EditorView,yo=C.view.keymap,Ha=C.view.lineNumbers,Wa=C.view.highlightActiveLine,ja=C.view.highlightActiveLineGutter,kt=C.state.Compartment,se=C.state.EditorState,dt=C.state.StateField,qt=C.state.StateEffect,ut=C.state.RangeSetBuilder,tt=C.view.Decoration,za=C.commands.defaultKeymap,Ra=C.commands.indentWithTab,Na=C.commands.historyKeymap,ln=C.commands.history,qa=C.autocomplete.autocompletion,Va=C.autocomplete.closeBrackets,Ua=C.autocomplete.closeBracketsKeymap,Ka=C.autocomplete.closeCompletion,Ga=C.autocomplete.completionKeymap,Xa=C.view.hoverTooltip,Le=C.langHtml.htmlLanguage,Ya=C.langHtml.html,Za=C.langCss.css,Ja=C.langJs.javascript,C.language.HighlightStyle,C.language.syntaxHighlighting,Qa=C.language.codeFolding,ko=C.language.foldEffect,xo=C.language.unfoldEffect,tr=C.language.foldedRanges,$f=C.highlight.tags,Yt.html=new kt,Yt.css=new kt,Yt.js=new kt,Zt.html=new kt,Zt.css=new kt,Zt.js=new kt}).catch(t=>{throw Ut=null,t}),Ut)}const Af="{{ _class }}",u=fr,Tf="__sve-code-dock-style",K="__sve-code-dock-unlock",er="sve-code-dock-height",or="sve-code-dock-panes",nr="sve-code-dock-widths",Ye="sve-html-scope-v2",sr="sve-code-dock-autosave",ar="sve-code-dock-style-mode",cn="sve-code-dock-values",Mf=280,rr=120,ro=140,Ef=250,st=["html","css","js"],Ct=["html","css","alpine","js"],Ff='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',Lf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-1"/></svg>',Bf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',ir='<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1c0 .966.784 1.75 1.75 1.75h.418A1.74 1.74 0 0 0 4 7.25v1.5c0 .49.201.932.525 1.25c-.324.318-.525.76-.525 1.25v1c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 14 12.25v-1c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1.5c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1A1.75 1.75 0 0 0 12.25 2zm8.5 7.5H8v-3h4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75M7 6.5v3H5.75A.75.75 0 0 1 5 8.75v-1.5a.75.75 0 0 1 .75-.75zm1 4h4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75H8zm-1 0V13H5.75a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-1-5V3h6.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75zm-1 0H3.75A.75.75 0 0 1 3 4.75v-1A.75.75 0 0 1 3.75 3H5z"/></svg>',Pf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/><path d="M4.5 11.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/></svg>',If='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 16.3A8.5 8.5 0 1 1 18.3 6.3"/><path d="M21 3.2v5.4h-5.4"/></svg>',Of='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',Df='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',k="__sve-css-menu",lr=["h1","h2","h3","h4","h5","h6"],_o=[{id:"section",title:"section",tag:"section"},{id:"div",title:"div",tag:"div"},{id:"heading",title:"heading",menu:"heading"},{id:"text",title:"text",menu:"text"},{id:"a",title:"link",tag:"a"},{id:"img",title:"image",snippet:'<img src="" alt="">',caret:10},{id:"video",title:"video",snippet:'<video src="" controls playsinline></video>',caret:12},{id:"ul",title:"list",tag:"ul"},{id:"li",title:"list item",tag:"li"},{id:"component",title:"component",menu:"component"},{id:"loop",title:"loop",snippet:`{{ items }}

{{ /items }}
`,caret:3,select:5},{id:"pagination",title:"pagination",action:"pagination"},{id:"if",title:"if",snippet:`{{ if true }}

{{ /if }}
`,caret:6,select:4}],Hf=["--size-100","--size-200","--size-300","--size-400","--size-500","--size-600","--size-700","--size-800","--size-900","--gutter"],Wf={"tw-text":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 13 5 3l3.5 10M2.7 10h4.6"/><path d="M12.5 3.5v9M11 5l1.5-1.5L14 5M11 11l1.5 1.5L14 11"/></svg>',"tw-leading":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h8.5M6 8h8.5M6 12.5h8.5"/><path d="M2.5 4.5v7M1.4 5.6 2.5 4.5l1.1 1.1M1.4 10.4l1.1 1.1 1.1-1.1"/></svg>',"tw-font":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.2V3h10v1.2M8 3v10M6 13h4"/></svg>',"tw-radius":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 13.5v-6a5 5 0 0 1 5-5h6"/><path d="M13.5 6.5v7h-7" stroke-dasharray="2 2"/></svg>',"tw-gap":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"tw-align":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3.5h12M2 8h8M2 12.5h10"/></svg>',"tw-w":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3.5v9M14 3.5v9"/><path d="M4.5 8h7"/><path d="M6 6.2 4.2 8 6 9.8M10 6.2 11.8 8 10 9.8"/></svg>',"tw-h":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 2h9M3.5 14h9"/><path d="M8 4.5v7"/><path d="M6.2 6 8 4.2 9.8 6M6.2 10 8 11.8 9.8 10"/></svg>',"tw-maxw":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3v10M14.5 3v10"/><path d="M5 8h6"/><path d="M6.6 6.2 4.8 8l1.8 1.8M9.4 6.2 11.2 8l-1.8 1.8"/></svg>',"tw-overflow":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="1.8" y="4.5" width="8.6" height="9.7" rx="1.2"/><path d="M6.5 1.8h7.7v7.7" stroke-linecap="round"/></svg>',"tw-border":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6"/><rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" stroke-width="1" opacity=".45"/></svg>',"tw-border-color":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6" stroke-dasharray="3.1 2.2"/><rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" fill="currentColor" stroke="none" opacity=".55"/></svg>'},jf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="10" width="18" height="11" rx="2"/><rect x="6" y="3" width="9" height="4" rx="1.4" fill="currentColor" stroke="none"/></svg>',zf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.1 12a8.9 8.9 0 1 0 2.8-6.5L3 8"/><path d="M3 3.4V8h4.6"/><path d="M12 7.4V12l3 1.8"/></svg>',Rf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>',Nf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></svg>',qf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/><path d="M3 17c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/></svg>',cr=[["--gray-50","#fafafa"],["--gray-100","#f5f5f5"],["--gray-200","#e5e5e5"],["--gray-300","#d4d4d4"],["--gray-400","#a3a3a3"],["--gray-500","#737373"],["--gray-600","#525252"],["--gray-700","#404040"],["--gray-800","#262626"],["--gray-900","#171717"],["--gray-950","#0a0a0a"]],ts=t=>[{id:`${t}-all`,icon:"box-all",title:"All sides",css:t,tw:t,menu:"spacing"},{id:`${t}-block`,icon:"box-block",title:"Top and bottom",css:`${t}-block`,tw:`${t}-block`,menu:"spacing",sep:!0},{id:`${t}-block-start`,icon:"box-block-start",title:"Top",css:`${t}-block-start`,tw:`${t}-top`,menu:"spacing"},{id:`${t}-block-end`,icon:"box-block-end",title:"Bottom",css:`${t}-block-end`,tw:`${t}-bottom`,menu:"spacing"},{id:`${t}-inline`,icon:"box-inline",title:"Left and right",css:`${t}-inline`,tw:`${t}-inline`,menu:"spacing",sep:!0},{id:`${t}-inline-start`,icon:"box-inline-start",title:"Left",css:`${t}-inline-start`,tw:`${t}-left`,menu:"spacing"},{id:`${t}-inline-end`,icon:"box-inline-end",title:"Right",css:`${t}-inline-end`,tw:`${t}-right`,menu:"spacing"}],Vf=[{id:"display-flex",twClass:"flex",icon:"display-flex",title:"Flex",kind:"display",value:"flex",css:"display"},{id:"flex-row",twClass:"flex-row",icon:"flex-row",title:"Direction: row",kind:"flexDir",value:"row",css:"flex-direction",sep:!0},{id:"flex-col",twClass:"flex-col",icon:"flex-col",title:"Direction: column",kind:"flexDir",value:"column",css:"flex-direction"},{id:"justify-start",twClass:"justify-start",icon:"justify-start",title:"Justify: start",css:"justify-content",value:"flex-start",when:"flex",sep:!0},{id:"justify-center",twClass:"justify-center",icon:"justify-center",title:"Justify: center",css:"justify-content",value:"center",when:"flex"},{id:"justify-end",twClass:"justify-end",icon:"justify-end",title:"Justify: end",css:"justify-content",value:"flex-end",when:"flex"},{id:"justify-between",twClass:"justify-between",icon:"justify-between",title:"Justify: between",css:"justify-content",value:"space-between",when:"flex"},{id:"justify-around",twClass:"justify-around",icon:"justify-around",title:"Justify: around",css:"justify-content",value:"space-around",when:"flex"},{id:"align-start",twClass:"items-start",icon:"align-start",title:"Align: start",css:"align-items",value:"flex-start",when:"flex",sep:!0},{id:"align-center",twClass:"items-center",icon:"align-center",title:"Align: center",css:"align-items",value:"center",when:"flex"},{id:"align-end",twClass:"items-end",icon:"align-end",title:"Align: end",css:"align-items",value:"flex-end",when:"flex"},{id:"align-stretch",twClass:"items-stretch",icon:"align-stretch",title:"Align: stretch",css:"align-items",value:"stretch",when:"flex"}],Uf=[{id:"gap-all",icon:"gap-all",title:"Both",css:"gap",tw:"gap",menu:"spacing"},{id:"gap-row",icon:"gap-row",title:"Between rows",css:"row-gap",tw:"row-gap",menu:"spacing",sep:!0},{id:"gap-col",icon:"gap-col",title:"Between columns",css:"column-gap",tw:"column-gap",menu:"spacing"}],Kf=["1px","2px","3px","4px","8px"],xt=(t,e,o,n,s,r)=>({id:t,icon:e,title:o,css:n,menu:"choices",choices:Kf,twGroup:[s,`${s}-2`,`${s}-4`,`${s}-8`],...r?{sep:!0}:{}}),Gf=[xt("bw-all","bd-all","All sides","border-width","border"),xt("bw-block","bd-block","Top and bottom","border-block-width","border-y",!0),xt("bw-top","bd-top","Top","border-block-start-width","border-t"),xt("bw-bottom","bd-bottom","Bottom","border-block-end-width","border-b"),xt("bw-inline","bd-inline","Left and right","border-inline-width","border-x",!0),xt("bw-left","bd-left","Left","border-inline-start-width","border-l"),xt("bw-right","bd-right","Right","border-inline-end-width","border-r")],Xf=[{id:"bd-all",icon:"bd-all",title:"All sides",css:"border-color",tw:"border-color",menu:"colors"},{id:"bd-block",icon:"bd-block",title:"Top and bottom",css:"border-block-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-top",icon:"bd-top",title:"Top",css:"border-block-start-color",tw:"border-top-color",menu:"colors"},{id:"bd-bottom",icon:"bd-bottom",title:"Bottom",css:"border-block-end-color",tw:"border-bottom-color",menu:"colors"},{id:"bd-inline",icon:"bd-inline",title:"Left and right",css:"border-inline-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-left",icon:"bd-left",title:"Left",css:"border-inline-start-color",tw:"border-left-color",menu:"colors"},{id:"bd-right",icon:"bd-right",title:"Right",css:"border-inline-end-color",tw:"border-right-color",menu:"colors"}],Yf=[{id:"rd-all",icon:"rd-all",title:"All corners",css:"border-radius",tw:"border-radius",menu:"values"},{id:"rd-tl",icon:"rd-tl",title:"Top left",css:"border-start-start-radius",tw:"border-top-left-radius",menu:"values",sep:!0},{id:"rd-tr",icon:"rd-tr",title:"Top right",css:"border-start-end-radius",tw:"border-top-right-radius",menu:"values"},{id:"rd-br",icon:"rd-br",title:"Bottom right",css:"border-end-end-radius",tw:"border-bottom-right-radius",menu:"values"},{id:"rd-bl",icon:"rd-bl",title:"Bottom left",css:"border-end-start-radius",tw:"border-bottom-left-radius",menu:"values"}],dr=[{id:"display",title:"Display",css:"display",tw:"display",kids:Vf},{id:"absolute",title:"Position",css:"position",tw:"position",value:"absolute"},{id:"color",title:"Text color",css:"color",tw:"color",menu:"colors"},{id:"bg",title:"Background color",css:"background-color",tw:"background-color",menu:"colors"},{id:"padding",title:"Padding",css:"padding",tw:"padding",kids:ts("padding")},{id:"margin",title:"Margin",css:"margin",tw:"margin",kids:ts("margin")},{id:"tw-text",title:"Font size",css:"font-size",tw:"font-size",menu:"values"},{id:"tw-leading",title:"Line height",css:"line-height",tw:"line-height",menu:"values"},{id:"tw-font",title:"Font family",css:"font-family",tw:"font-family",menu:"values"},{id:"tw-align",title:"Text align",css:"text-align",tw:"text-align",menu:"choices",choices:["left","center","right","justify"]},{id:"tw-border",title:"Border",css:"border-width",tw:"border-width",kids:Gf},{id:"tw-border-color",title:"Border color",css:"border-color",tw:"border-color",kids:Xf},{id:"tw-radius",title:"Radius",css:"border-radius",tw:"border-radius",kids:Yf},{id:"tw-gap",title:"Gap",css:"gap",tw:"gap",kids:Uf},{id:"tw-w",title:"Width",css:"width",tw:"width",menu:"sizes"},{id:"tw-h",title:"Height",css:"height",tw:"height",menu:"sizes"},{id:"tw-maxw",title:"Max width",css:"max-width",tw:"max-width",menu:"sizes"},{id:"tw-overflow",title:"Overflow",css:"overflow",tw:"overflow",menu:"choices",choices:["visible","hidden","clip","auto","scroll"]}],Zf=["100%","auto","fit-content","min-content","max-content","100vw","100dvh","0"],Be=new Map;for(const t of dr){Be.set(t.id,{tool:t,kid:null});for(const e of t.kids||[])Be.set(e.id,{tool:t,kid:e})}const es={display:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2.5" width="13" height="11" rx="1.2"/><path d="M5 6.5h6M5 9.5h4"/></svg>',"display-flex":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="3.4" height="9" rx=".4"/><rect x="6.3" y="3.5" width="3.4" height="9" rx=".4"/><rect x="10.6" y="3.5" width="3.4" height="9" rx=".4"/></svg>',"flex-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12"/><path d="M4.2 5.8 2 8l2.2 2.2"/><path d="M11.8 5.8 14 8l-2.2 2.2"/></svg>',"flex-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v12"/><path d="M5.8 4.2 8 2l2.2 2.2"/><path d="M5.8 11.8 8 14l2.2-2.2"/></svg>',"justify-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="5.4" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4.6" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="8.2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-between":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-around":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"align-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="5.4" width="9" height="2.4" rx=".4"/></svg>',"align-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="4.6" width="9" height="2.4" rx=".4"/><rect x="3.5" y="9" width="9" height="2.4" rx=".4"/></svg>',"align-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="8.2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="11.6" width="9" height="2.4" rx=".4"/></svg>',"align-stretch":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx=".5"/><rect x="9" y="2" width="4" height="12" rx=".5"/></svg>',absolute:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>',color:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.4 11.2 7.4 2.4l4 8.8"/><path d="M4.7 8.4h5.4"/><rect x="1.6" y="12.8" width="12.8" height="2.2" rx=".6" fill="currentColor" stroke="none"/></svg>',bg:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 1.9a6.1 6.1 0 1 0 0 12.2c.85 0 1.35-.55 1.35-1.25 0-.38-.18-.66-.4-.88a1.2 1.2 0 0 1 .85-2.05h1.3A3.5 3.5 0 0 0 14.1 6.1C14.1 3.75 11.4 1.9 8 1.9Z"/><circle cx="4.9" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="8" cy="4.8" r=".95" fill="currentColor" stroke="none"/><circle cx="11.1" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="4.7" cy="9.9" r=".95" fill="currentColor" stroke="none"/></svg>',padding:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/></svg>',margin:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/><path d="M2 2.5h12M2 13.5h12M2.5 2v12M13.5 2v12" stroke-dasharray="1.4 1.2"/></svg>',"box-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".4" fill="currentColor" stroke="none"/></svg>',"box-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"gap-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"gap-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="3" y="1.6" width="10" height="4.2" rx=".6"/><rect x="3" y="10.2" width="10" height="4.2" rx=".6"/><path d="M4.5 8h7"/></svg>',"gap-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"bd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4"/></svg>',"bd-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-top":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-bottom":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-left":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-right":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"rd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="3.4"/></svg>',"rd-tl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6H6a3.4 3.4 0 0 0-3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M2.6 9V6A3.4 3.4 0 0 1 6 2.6h3" stroke-width="2.2"/></svg>',"rd-tr":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6h7.4a3.4 3.4 0 0 1 3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M7 2.6h3A3.4 3.4 0 0 1 13.4 6v3" stroke-width="2.2"/></svg>',"rd-br":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6v7.4a3.4 3.4 0 0 1-3.4 3.4H2.6" stroke-width="1" opacity=".35"/><path d="M13.4 7v3a3.4 3.4 0 0 1-3.4 3.4H7" stroke-width="2.2"/></svg>',"rd-bl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6v7.4a3.4 3.4 0 0 0 3.4 3.4h7.4" stroke-width="1" opacity=".35"/><path d="M2.6 7v3A3.4 3.4 0 0 0 6 13.4h3" stroke-width="2.2"/></svg>'},g={html:null,css:null,js:null},Yt={html:null,css:null,js:null},Zt={html:null,css:null,js:null};export{wh as ARMED_KEY,If as AUTOSAVE_ICON,sr as AUTOSAVE_KEY,Bf as BACK_ICON,Df as CSS_ADD_ICON,cr as CSS_GRAYS,Zf as CSS_LENGTHS,k as CSS_MENU_ID,Rf as CSS_MODE_ICON,Qo as CSS_SIZE_KEY,Hf as CSS_SPACING,tn as CSS_STATES,bo as CSS_STATE_KEY,dr as CSS_TOOLS,es as CSS_TOOL_ICONS,Be as CSS_TOOL_INDEX,Pf as DATA_ICON,It as DATA_MENU_ID,Mf as DEFAULT_HEIGHT,u as DOCK_ID,tt as Decoration,se as EditorState,B as EditorView,st as HANDLES,er as HEIGHT_KEY,zf as HISTORY_ICON,lr as HTML_HEADINGS,_o as HTML_TOOLS,Nf as ID_MODE_ICON,Ff as LOCK_CLOSED_ICON,Lf as LOCK_OPEN_ICON,rr as MIN_HEIGHT,ro as MIN_PANE,Ct as PANES,or as PANES_KEY,ut as RangeSetBuilder,Of as SAVE_ICON,Ef as SAVE_MS,Af as SCOPE_CLASS,ir as SCOPE_ICON,Ye as SCOPE_KEY,jf as STRIP_ICON,Tf as STYLE_ID,ar as STYLE_MODE_KEY,qt as StateEffect,dt as StateField,qf as TW_MODE_ICON,Wf as TW_TOOL_ICONS,K as UNLOCK_ID,cn as VALUES_MODE_KEY,nr as WIDTHS_KEY,Rt as applyCssFolds,vt as applyCssScope,Yc as applyDisplay,Xc as applyFlexDirection,oa as applyHtmlTag,G as applyRuleDecls,xa as applyStyleMode,qa as autocompletion,zo as autosaveEnabled,nf as bindAntlersSnippets,Tn as bindAutosave,Qn as bindBack,Nc as bindCssAddClass,Au as bindCssTools,of as bindDataVars,mu as bindHistory,En as bindHtmlScope,Mu as bindHtmlTidy,Eu as bindHtmlTools,yf as bindLayoutWatch,An as bindLock,wf as bindPaneToggles,_f as bindResize,Sf as bindSplitters,pu as bindStrip,Cu as bindStyleMode,af as bindVisualEditSnippets,bh as clearCssFocus,ue as clearHtmlScopeRange,Va as closeBrackets,Ua as closeBracketsKeymap,Ca as closeCodeDock,yh as closeCodeDockPopups,Ka as closeCompletion,$ as closeCssMenu,ne as closeCssMenuPicked,N as closeDataMenu,C as cm,kh as codeDockStyleMode,Qa as codeFolding,Xe as collectionViewType,Ga as completionKeymap,Za as css,sa as cssEditorText,Ne as cssRuleAtCursor,va as cssSizeRow,bt as cssSizeRows,Ue as cssStateSuffix,J as currentFlexDecls,gt as currentFullHtml,Vs as currentSectionValues,yt as currentTemplateType,za as defaultKeymap,ht as dispatchHtmlChanges,Zt as editableOf,g as editors,mf as ensureStyle,Rs as ensureTwCss,ka as enterValuesRule,I as finishHtmlEdit,yc as flushBracketSync,V as flushCssScope,kc as flushCssToHtml,z as flushSave,ko as foldEffect,tr as foldedRanges,Ks as goBackTemplate,Wa as highlightActiveLine,ja as highlightActiveLineGutter,ln as history,Na as historyKeymap,Xa as hoverTooltip,Ya as html,Ys as htmlEditorText,fe as htmlElementAtCursor,$t as htmlFocusOk,Le as htmlLanguage,le as htmlScopeEnabled,Mt as htmlTargetFromCursor,Yu as inAttributeValue,Xu as inDynamicAttribute,qe as indentFromPrevious,Ra as indentWithTab,Bu as insertAiSnippet,ta as insertHtmlElement,ee as insertHtmlSnippet,Qt as isChromeTemplateType,Lr as isCodeDockArmed,ct as isCodeDockLocked,$a as isCodeDockOpen,df as isPanelFrame,Ja as javascript,yo as keymap,cf as languageOf,_t as leadingCssIndent,it as lineIndentOf,Ha as lineNumbers,Cf as loadCm,Nt as loadTemplate,uo as mergedCssFull,su as mountEditor,ba as newSizeBlockSpot,vo as newSizeQuery,P as normalizeFlexValue,nn as observeDockLayout,X as onEditorInput,td as openCssChoiceMenu,Qc as openCssColorMenu,ed as openCssSpacingMenu,Dn as openCssValueMenu,Ta as openDataVarsMenu,zc as openHtmlComponentMenu,Bn as openHtmlTagMenu,Us as openNestedTemplate,Ma as openPickerMenu,Sc as openRenameClassMenu,Ve as paintAlpine,Q as paintAutosave,Dt as paintBack,lt as paintCssHead,Zo as paintCssIdMark,E as paintCssToolState,au as paintHostWait,R as paintHtmlScope,Re as paintHtmlToolState,wt as paintLock,Ia as paintPaneButtons,Pt as paintStrip,Ge as paintStyleMode,Jo as paintValuesMode,$c as pickHtmlTagAtCursor,D as placeCssMenu,Ot as placeDock,sn as previewBottomPad,gc as primeTailwindCompile,Yt as readOnlyOf,Go as readParts,Iu as refreshCodeDockFromDisk,Ae as refreshPreview,Ou as relayoutCodeDock,je as rememberBracketNames,jt as rememberCssSelectors,zs as resetTailwindCompile,Xo as sameParts,xu as setAll,$h as setCodeDockArmed,Mn as setHtmlAll,rn as setPath,O as setStatus,ku as setValuesMode,Jn as shieldDock,Uo as showHtmlFull,ze as showHtmlScope,bf as stopObservingDockLayout,Fa as storedPanes,xh as syncCodeDock,fo as syncHtmlTree,Tt as syncScopedHtml,pe as syncTwTarget,$f as tags,Fr as templateDockAllowed,ea as tidyHtmlPane,_u as toggleAll,Wc as toggleHtmlPagination,xo as unfoldEffect,ce as writeHandleEditor,de as writeHtmlEditor,zt as writeParts};
