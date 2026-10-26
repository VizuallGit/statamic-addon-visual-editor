const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-BqsL3ULf.js","./tw-candidates-CSP7aVNi.js","./help-editor-DyrgTPYe.js","./addon-DaA9QSfE.js","./protocol-BVdEmGBQ.js","./shortcuts-BBrEL-OT.js","./addon-BIr7wDW0.css","./lp-cluster-5qvz35O7.js","./ChoiceDialog-D0V7RtFa.js","./ChoiceDialog-C1GDnWs9.css","./ai-text-icon-B7uCWIwa.js","./lp-cluster-DkH5EaZz.css","./css-scope-CvwgFAfm.js","./loop-inspector-C4O64LIt.js","./component-extract-9kavGqGf.js","./component-extract-OeU4ApI5.css","./codemirror-D0N-Eh7w.js","./html-tag-sync-BpXNELva.js","./index-M2RCOyrL.js","./index-B5fiB6ig.js","./index-sh1K8s4m.js","./index-0IxPFT_m.js","./index-Ci-3qkVd.js","./index-DkhC0r6-.js","./index-B4S9JIPB.js","./index-BwRQ94Ql.js","./index-D9YSa79V.js","./index-DwJNgNWz.js","./utility-paint-DXCEnfCB.js","./utilities-DNDSVzBx.js"])))=>i.map(i=>d[i]);
import{H as Ba,d as Pa,ad as pl}from"./shortcuts-BBrEL-OT.js";import{v as hl,l as ml}from"./codemirror-D0N-Eh7w.js";import{o as _,c as S,a as g,t as A,e as vl,F as q,i as dt,w as F,m as Oa,k as kn,u as $,af as No,f as N,a0 as gl,s as h,r as It,g as Ia,a4 as Xo,Z as ke,j as Da,$ as Xt,ad as ja,b as rt,d as G,x as ho,_ as xn,ai as bl,p as ut,q as Ht,C as Us,D as yl,V as _n,ah as Sn,al as kl,z as xl,ag as _l,l as wt,B as _e,aC as Sl,A as wl}from"./addon-DaA9QSfE.js";import{b as it,i as Ha,o as mo,j as qo,t as $l,k as Ra,l as Cl,m as Tl,g as wn,n as Al,q as Ee,u as El,v as Yo,w as za,x as Ml,y as Ll,T as Fl,z as Wa,A as Na,B as $n,C as Cn,D as qa,E as vo,F as Zo,G as Bl,H as Ks,I as Gs,J as Pl,K as Ol,L as Jo,M as Il,N as Dl,O as Va,P as Ua,Q as E,R as jl,S as Xs,U as Hl,V as Rl,W as zl}from"./lp-cluster-5qvz35O7.js";import{h as Ys,f as Ka,a as Wl,b as Nl,c as Me,s as Rt,d as Ga,e as ql,t as Tn,g as Xa,m as Ya,i as Qo,j as An,k as Za,l as Vl,r as Zs,n as Ja,o as re,p as Le,q as Ul,u as Kl,v as Fe,w as Gl,x as Qa,y as tr,z as Xl,A as er,B as go,C as Yl,D as Zl,E as Jl,F as Ql,G as tc,H as ec,I as oc,J as Js,P as Ne}from"./css-scope-CvwgFAfm.js";import{_ as or,o as En,C as nc,m as W,N as nr}from"./ChoiceDialog-D0V7RtFa.js";import{M as sr,S as ar}from"./protocol-BVdEmGBQ.js";import{t as sc}from"./tw-candidates-CSP7aVNi.js";import{c as rr,a as ir,t as lr,b as ac,d as rc,w as ic,e as lc,f as cc,g as Qs,h as dc,i as uc,j as fc,k as pc,l as hc,s as mc,m as cr,n as vc,o as tn,r as gc,p as bc,q as yc,u as kc,v as ta,H as dr,x as xc,y as _c,z as Sc,A as Mn,B as wc,_ as ur}from"./component-extract-9kavGqGf.js";import{h as $c,a as Cc,e as Tc,i as bo,A as ea,b as Ac,c as Ec,d as Ze}from"./html-tag-sync-BpXNELva.js";import{paintUtilities as oa,swapSiteCss as Mc,classTokens as Lc}from"./utility-paint-DXCEnfCB.js";import{u as Fc,a as Bc,c as na,w as Pc}from"./utilities-DNDSVzBx.js";const bt="__sve-css-rename-chip",Oc='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';function Ic(t){const e=t.Decoration.mark({class:"sve-cm-css-token"}),o=t.StateEffect.define();return{extensions:[t.StateField.define({create(){return t.Decoration.none},update(s,r){let i;for(const c of r.effects)c.is(o)&&(i=c.value);if(i===void 0)return r.docChanged?t.Decoration.none:s;if(!i)return t.Decoration.none;const l=new t.RangeSetBuilder;return l.add(i.from,i.to,e),l.finish()},provide:s=>t.EditorView.decorations.from(s)})],setHover(s,r){s&&s.dispatch({effects:o.of(r)})}}}function xt(t){t?.getElementById(bt)?.remove()}function Dc(t,e,o,n){e.style.left=`${Math.max(6,Math.min(o,t.innerWidth-28))}px`,e.style.top=`${Math.max(6,n)}px`}function jc(t,e,o,{onRename:n,title:s}){const r=t.document,i=e.coordsAtPos(o.to);if(!i)return;xt(r);const l=r.createElement("button");l.id=bt,l.type="button",l.innerHTML=Oc,l.title=s,l.setAttribute("aria-label",s),l.addEventListener("mousedown",c=>{c.preventDefault(),c.stopPropagation(),xt(r),n?.(o)}),l.addEventListener("mouseleave",()=>{t.setTimeout(()=>{e.dom.matches(":hover")||l.matches(":hover")||xt(r)},120)}),r.body.appendChild(l),Dc(t,l,i.right+2,i.top-1)}function Hc(t,e,{onRename:o,isLocked:n,setHover:s,title:r}){if(!e?.dom||e.dom._sveClassTokenBound)return;e.dom._sveClassTokenBound=!0;let i=null,l="";const c=()=>!!n?.(),d=()=>{t.clearTimeout(i),i=null,l="",s?.(e,null),xt(t.document)},f=p=>{if(c()){d();return}d(),o?.(p)};e.dom.addEventListener("mousemove",p=>{if(c()){d();return}if(p.target?.closest?.(`#${bt}`))return;const m=e.posAtCoords({x:p.clientX,y:p.clientY});if(m==null)return;const y=Ys(e.state.doc.toString(),m);if(!y){t.clearTimeout(i),i=null,l="",s?.(e,null);return}const b=`${y.from}:${y.to}:${y.name}`;s?.(e,{from:y.from,to:y.to}),!(l===b&&(i||t.document.getElementById(bt)))&&(t.clearTimeout(i),l=b,i=t.setTimeout(()=>{i=null,jc(t,e,y,{onRename:f,title:r||"Rename class"})},160))}),e.dom.addEventListener("mouseleave",p=>{p.relatedTarget?.closest?.(`#${bt}`)||t.setTimeout(()=>{t.document.getElementById(bt)?.matches(":hover")||d()},160)}),e.dom.addEventListener("dblclick",p=>{if(c())return;const m=e.posAtCoords({x:p.clientX,y:p.clientY});if(m==null)return;const y=Ys(e.state.doc.toString(),m);y&&(p.preventDefault(),p.stopPropagation(),f(y))},!0),e.scrollDOM?.addEventListener("scroll",d),t.document._sveClassTokenDismiss||(t.document._sveClassTokenDismiss=!0,t.document.addEventListener("mousedown",p=>{p.target.closest(`#${bt}`)||xt(t.document)}))}const a={cssColorsPromise:null,lastUid:null,lastType:null,typeStack:[],beforePart:null,lastParts:{html:"",css:"",js:""},lastProps:[],propsDirty:!1,lastLocked:!1,lockReady:!1,lastWin:null,loadGen:0,saveTimer:null,lastBracketNames:null,lastCssSelectorNames:null,saveInFlight:null,loadInFlight:null,dragging:!1,applying:!1,htmlScopePref:!0,htmlScopeActive:!1,styleMode:"css",cssToolRow:null,cssOpenTool:"",cssOpenMenu:"",cssValues:!1,cssAll:!1,htmlAll:!1,twCss:null,twKey:"",twBusy:!1,twDirty:!1,htmlFocus:null,cssFocus:null,htmlFull:"",cssFull:"",cssPane:"full",cssScopeSnapshot:"",layoutObserver:null,layoutWin:null,observedEditor:null,observedRight:null,layoutWatchBound:!1,cssSize:"",cssState:"",cssOwnFolds:new Set,cssFoldSig:"",htmlPartialUi:null,htmlAntlersUi:null,htmlClassTokenUi:null,htmlLintUi:null,cssGhostUi:null},Zt=new Map,sa={scope:null,section:[],page:[],site:[]};function Ln(t){const e=t?.location?.pathname?.match(/\/collections\/([^/]+)\//);return e?e[1]:""}function Fn(t){const e=String(t||"").trim();return!e||/^(header|footer)\//.test(e)?"":e}function Rc(t){return(Array.isArray(t)?t:[]).filter(e=>e?.handle).map(e=>`${e.kind==="collection"?"collection":"field"}:${e.handle}`).join("|")}function Bn({collection:t,set:e,view:o,scope:n}){return`${t}::${e}::${o||""}::${n||""}`}function fr(t){return Zt.get(t)||null}function Pn(t,{collection:e,set:o,view:n,scope:s}){const r=Bn({collection:e,set:o,view:n,scope:s}),i=Zt.get(r);if(i)return Promise.resolve(i);const l=new URLSearchParams;return e&&l.set("collection",e),o&&l.set("set",o),n&&l.set("view",n),s&&l.set("scope",s),t.fetch(`/!/sve/data-vars?${l.toString()}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(c=>c.ok?c.json():null).then(c=>{const d=c&&typeof c=="object"?c:sa;return Zt.set(r,d),d}).catch(()=>sa)}function zc(t){if(!t){Zt.clear();return}const e=`::${t}::`;for(const o of[...Zt.keys()])o.includes(e)&&Zt.delete(o)}function Wc(t){if(t==null||t==="")return"";if(typeof t=="boolean")return t?"true":"false";if(Array.isArray(t))return t.length?`${t.length} ×`:"";if(typeof t=="object"){const o=Object.keys(t).length;return o?`${o} ×`:""}const e=String(t).replace(/\s+/g," ").trim();return e.length>60?`${e.slice(0,60)}…`:e}function Nc(t,e){return e.split(".").reduce((o,n)=>o&&typeof o=="object"?o[n]:void 0,t)}function On(t,e){return!Array.isArray(t)||!e||typeof e!="object"?t||[]:t.map(o=>{if(o.parent||o.value!=null||o.var.includes(":"))return o;const n=Wc(Nc(e,o.var));return n?{...o,value:n}:o})}function qc(t,e){return Array.isArray(t)?t.map(o=>({...o,items:On(o.items,e)})):[]}function Vc(t,e,{inline:o=!1}={}){const n=String(t?.var||"").trim();if(!n)return null;if(o)return{text:`{{ ${n} }}`,cursor:`{{ ${n} }}`.length};if(t.loop)return{text:`{{ ${n} }}
  
{{ /${n} }}`,cursor:`{{ ${n} }}
  `.length};if(e?.loop&&!t.parent){const s=e.loop;return{text:`{{ ${s} }}
  {{ ${n} }}
{{ /${s} }}`,cursor:`{{ ${s} }}
  {{ ${n} }}`.length}}return{text:`{{ ${n} }}`,cursor:`{{ ${n} }}`.length}}const qe="visual_edit",aa=[{id:"base",lang:"code_dock_visual_edit_base"},{id:"field",lang:"code_dock_visual_edit_field"}],pr=[{id:"tag",group:"base",label:"{{ visual_edit }}",standalone:"{{ visual_edit| }}"},{id:"ve_popup",group:"base",label:"popup",attr:'popup="true"'},{id:"ve_orderable",group:"base",label:"orderable",attr:'orderable="true"'},{id:"ve_section_orderable",group:"base",label:"section_orderable",attr:'section_orderable="true"'},{id:"ve_outline_inside",group:"base",label:"outline_inside",attr:'outline_inside="true"'},{id:"ve_field",group:"field",label:"field",attr:'field="|"'},{id:"ve_inline_edit",group:"field",label:"inline_edit",attr:'inline_edit="true"'},{id:"ve_insertable",group:"field",label:"insertable",attr:'insertable="true"'},{id:"ve_toolbar",group:"field",label:"toolbar",attr:'toolbar="true"'},{id:"ve_scope",group:"field",label:"scope",attr:'scope="|"'},{id:"ve_controls",group:"field",label:"controls",attr:'controls="|"'}];function Uc(t){return pr.find(e=>e.id===t)||null}function Kc(t,e,o,n){let s=e;for(;s<o;){const r=t.indexOf("{{",s);if(r===-1||r>=o)return null;const i=t.indexOf("}}",r+2);if(i===-1||i+2>o)return null;const l=t.slice(r+2,i);if((l.trim().split(/\s+/)[0]||"")===n)return{openIdx:r,closeIdx:i,inner:l};s=i+2}return null}function Gc(t,e){const o=String(e).split("=")[0].trim();return new RegExp(`(^|\\s)${o}(=|\\s|$)`).test(t)}const Xc={class:"sve-code-dock"},Yc={"data-sve-code-bar":""},Zc={type:"button","data-sve-code-pane-btn":"html"},Jc={type:"button","data-sve-code-pane-btn":"css"},Qc={type:"button","data-sve-code-pane-btn":"alpine"},td={type:"button","data-sve-code-pane-btn":"js"},ed={type:"button","data-sve-html-scope":"","aria-pressed":"true"},od=["innerHTML"],nd={"data-sve-code-panes":""},sd={"data-sve-code-pane":"html"},ad={"data-sve-code-pane-label":""},rd=["title","aria-label"],id=["innerHTML"],ld={"data-sve-code-pane":"css"},cd={"data-sve-css-chrome":"subrow-2"},dd={"data-sve-code-pane-label":""},ud={"data-sve-css-label":""},fd={"data-sve-code-pane":"alpine"},pd={"data-sve-code-pane-label":""},hd={"data-sve-code-pane":"js"},md={"data-sve-code-pane-label":""},vd={__name:"CodeDockChrome",props:{htmlLabel:{type:String,required:!0},cssLabel:{type:String,required:!0},jsLabel:{type:String,required:!0},alpineLabel:{type:String,required:!0},treeIcon:{type:String,required:!0},dataIcon:{type:String,required:!0},dataLabel:{type:String,required:!0}},setup(t){return(e,o)=>(_(),S("div",Xc,[o[21]||(o[21]=g("div",{"data-sve-code-grip":"","aria-hidden":"true"},null,-1)),g("div",Yc,[g("button",Zc,A(t.htmlLabel),1),g("button",Jc,A(t.cssLabel),1),g("button",Qc,A(t.alpineLabel),1),g("button",td,A(t.jsLabel),1),o[0]||(o[0]=vl('<button type="button" data-sve-code-back hidden></button><span data-sve-code-path></span><span data-sve-code-status></span><button type="button" data-sve-all></button><button type="button" data-sve-code-strip></button><button type="button" data-sve-code-history></button><button type="button" data-sve-style-mode></button><button type="button" data-sve-values-mode></button><button type="button" data-sve-code-autosave aria-pressed="true"></button><button type="button" data-sve-code-save hidden></button>',10)),g("button",ed,[g("span",{innerHTML:t.treeIcon},null,8,od)]),o[1]||(o[1]=g("button",{type:"button","data-sve-code-lock":"",hidden:""},null,-1))]),o[22]||(o[22]=g("div",{"data-sve-code-lock-banner":""},null,-1)),g("div",nd,[g("div",sd,[g("div",ad,[g("span",null,A(t.htmlLabel),1),o[2]||(o[2]=g("div",{"data-sve-html-tools":""},null,-1)),o[3]||(o[3]=g("button",{type:"button","data-sve-html-tidy":""},null,-1)),g("button",{type:"button","data-sve-data-vars":"",title:t.dataLabel,"aria-label":t.dataLabel},[g("span",{innerHTML:t.dataIcon},null,8,id)],8,rd),o[4]||(o[4]=g("div",{"data-sve-visual-edit-tools":""},null,-1)),o[5]||(o[5]=g("div",{"data-sve-help-tools":""},null,-1)),o[6]||(o[6]=g("div",{"data-sve-antlers-tools":""},null,-1)),o[7]||(o[7]=g("div",{"data-sve-snippet-tools":""},null,-1))]),o[8]||(o[8]=g("div",{"data-sve-html-problems":"",hidden:""},null,-1)),o[9]||(o[9]=g("div",{"data-sve-code-host":""},null,-1))]),o[18]||(o[18]=g("div",{"data-sve-code-split":"","data-sve-code-split-after":"html"},null,-1)),g("div",ld,[g("div",cd,[g("div",dd,[g("span",ud,A(t.cssLabel),1),o[10]||(o[10]=g("button",{type:"button","data-sve-css-add-class":""},null,-1)),o[11]||(o[11]=g("div",{"data-sve-css-tools":""},null,-1)),o[12]||(o[12]=g("div",{"data-sve-css-snippet-tools":""},null,-1))])]),o[13]||(o[13]=g("div",{"data-sve-css-head":""},null,-1)),o[14]||(o[14]=g("div",{"data-sve-code-host":""},null,-1)),o[15]||(o[15]=g("div",{"data-sve-tw-host":""},null,-1))]),o[19]||(o[19]=g("div",{"data-sve-code-split":"","data-sve-code-split-after":"css"},null,-1)),g("div",fd,[g("div",pd,[g("span",null,A(t.alpineLabel),1)]),o[16]||(o[16]=g("div",{"data-sve-alpine-host":""},null,-1))]),o[20]||(o[20]=g("div",{"data-sve-code-split":"","data-sve-code-split-after":"alpine"},null,-1)),g("div",hd,[g("div",md,[g("span",null,A(t.jsLabel),1)]),o[17]||(o[17]=g("div",{"data-sve-code-host":""},null,-1))])])]))}};let ge=null,ra=0,ia=!1;function In(t){const e=rr(it("dock:current-type")),o=ir(e);Ha({source:ar,type:sr.SVE_COMPONENT_FOCUS,on:!!o,name:e?String(e).split("/").pop():"",selector:o||""},t)}function yo(t){const e=it("dock:html"),o=[...new Set((typeof e=="string"?Ka(e):[]).map(n=>n.src))];Ha({source:ar,type:sr.SVE_COMPONENT_MAP,items:o.map(n=>({src:n,name:String(n).split("/").pop(),selector:ir(n)})).filter(n=>n.selector)},t)}function gd(t){ge=t,!ia&&(ia=!0,mo("dock:html-changed",()=>{ge&&(ge.clearTimeout(ra),ra=ge.setTimeout(()=>yo(ge),400))}))}const bd=["data-sve-html-tool","data-tip","aria-label","data-letter","onClick","onContextmenu"],yd=["innerHTML"],kd={__name:"CodeDockHtmlTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(t){return(e,o)=>(_(!0),S(q,null,dt(t.tools,n=>(_(),S("button",{key:n.id,type:"button","data-sve-html-tool":n.id,"data-tip":n.title,"aria-label":n.title,"data-letter":n.letter?"":void 0,onClick:F(s=>t.onTool(n.id),["prevent","stop"]),onContextmenu:F(s=>t.onTool(n.id),["prevent"])},[n.letter?(_(),S(q,{key:0},[Oa(A(n.letter),1)],64)):(_(),S("span",{key:1,innerHTML:n.icon},null,8,yd))],40,bd))),128))}},$t=kn({tools:[],onTool:null,onKid:null}),xd=["data-sve-css-item"],_d=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],Sd={key:0,"data-sve-css-kids":""},wd={key:0,"data-sve-css-sep":"","aria-hidden":"true"},$d=["data-sve-css-kid","data-sve-css-box-side","data-tip","aria-label","innerHTML","onClick","onContextmenu"],Cd={__name:"CodeDockCssTools",setup(t){return(e,o)=>(_(!0),S(q,null,dt($($t).tools,n=>(_(),S("li",No({key:n.id,"data-sve-css-item":n.id},{ref_for:!0},n.open?{"data-sve-css-open":""}:{}),[g("button",No({type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title},{ref_for:!0},{...n.active?{"data-active":""}:{},...n.open?{"data-open":""}:{}},{innerHTML:n.icon,onClick:F(s=>$($t).onTool?.(n.id),["prevent","stop"]),onContextmenu:F(s=>$($t).onTool?.(n.id),["prevent"])}),null,16,_d),n.open&&n.kids.length?(_(),S("div",Sd,[(_(!0),S(q,null,dt(n.kids,s=>(_(),S(q,{key:s.id},[s.sep?(_(),S("span",wd)):N("",!0),g("button",No({type:"button","data-sve-css-kid":s.id,"data-sve-css-box-side":s.id,"data-tip":s.title,"aria-label":s.title},{ref_for:!0},s.active?{"data-active":""}:{},{innerHTML:s.icon,onClick:F(r=>$($t).onKid?.(n.id,s.id),["prevent","stop"]),onContextmenu:F(r=>$($t).onKid?.(n.id,s.id),["prevent"])}),null,16,$d)],64))),128))])):N("",!0)],16,xd))),128))}},Td=1.5,Ad=16;function hr(t,e){const o=parseFloat(t);return Number.isFinite(o)?e==="em"||e==="rem"?o*Ad:o:null}function Ed(t){const e=String(t||"").toLowerCase(),o=/\bmax-width\b|\bwidth\s*<=?\s*[\d.]|[\d.](px|em|rem)\s*>=?\s*width\b/.test(e),n=/\bmin-width\b|\bwidth\s*>=?\s*[\d.]|[\d.](px|em|rem)\s*<=?\s*width\b/.test(e);if(o===n)return null;const s=o?[/\bmax-width\s*:\s*([\d.]+)(px|em|rem)/,/\bwidth\s*<=?\s*([\d.]+)(px|em|rem)/,/([\d.]+)(px|em|rem)\s*>=?\s*width\b/]:[/\bmin-width\s*:\s*([\d.]+)(px|em|rem)/,/\bwidth\s*>=?\s*([\d.]+)(px|em|rem)/,/([\d.]+)(px|em|rem)\s*<=?\s*width\b/];for(const r of s){const i=e.match(r);if(i){const l=hr(i[1],i[2]);return l===null?null:{px:l,side:o?"max":"min"}}}return null}function Ct(t,e){const o=Ed(t);if(!o)return"";for(const n of e||[]){if(n.base)continue;const s=n.direction==="mobile";if((s?"min":"max")!==o.side)continue;const r=s?Number(n.min_px):hr(String(n.max||"").replace(/[a-z]+$/i,""),(String(n.max||"").match(/[a-z]+$/i)||[""])[0]);if(r!==null&&Number.isFinite(r)&&Math.abs(r-o.px)<=Td)return n.handle}return""}function ko(t){let e="",o=0;for(;o<t.length;){const n=xo(t,o);if(n!==o){e+=" ".repeat(n-o),o=n;continue}e+=t[o],o+=1}return e}function xo(t,e){if(t.startsWith("/*",e)){const o=t.indexOf("*/",e+2);return o===-1?t.length:o+2}if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?t.length:o+2}if(t[e]==='"'||t[e]==="'"){const o=t[e];for(let n=e+1;n<t.length;n+=1)if(t[n]==="\\")n+=1;else if(t[n]===o)return n+1;return t.length}return e}function _o(t){const e=String(t||""),o=[],n=(s,r,i=0)=>{let l=s,c=l;for(;l<r;){const d=xo(e,l);if(d!==l){l=d;continue}if(e[l]===";"){l+=1,c=l;continue}if(e[l]==="}")return;if(e[l]!=="{"){l+=1;continue}const f=ko(e.slice(c,l)),p=f.trim(),m=mr(e,l,r);if(m===-1)return;/^@media\b/i.test(p)?o.push({query:p.replace(/^@media\s*/i,"").trim(),from:c+f.search(/\S/),to:m+1,bodyFrom:l+1,bodyTo:m,depth:i}):/^@(?:import|charset|use)\b/i.test(p)||n(l+1,m,i+1),l=m+1,c=l}};return n(0,e.length,0),o}function mr(t,e,o){let n=0;for(let s=e;s<o;s+=1){const r=xo(t,s);if(r!==s){s=r-1;continue}if(t[s]==="{")n+=1;else if(t[s]==="}"&&(n-=1,n===0))return s}return-1}function ie(t){const e=String(t||""),o=(n,s)=>{const r=[];let i=n,l=i;for(;i<s;){const c=xo(e,i);if(c!==i){i=c;continue}if(e[i]===";"){i+=1,l=i;continue}if(e[i]==="}")return r;if(e[i]!=="{"){i+=1;continue}const d=ko(e.slice(l,i)),f=d.trim(),p=mr(e,i,s);if(p===-1)return r;r.push({prelude:f,media:/^@media\b/i.test(f),query:f.replace(/^@media\s*/i,"").trim(),from:l+d.search(/\S/),to:p+1,bodyFrom:i+1,bodyTo:p,children:/^@(?:import|charset|use)\b/i.test(f)?[]:o(i+1,p)}),i=p+1,l=i}return r};return o(0,e.length)}function Md(t,e,o){const n=String(t||"");if(!o)return[];const s=(e||[]).find(d=>d.base),r=ie(n),i=[],l=d=>d.media?Ct(d.query,e)===o:d.children.some(l);if(s&&o===s.handle){const d=f=>{for(const p of f){if(p.media&&Ct(p.query,e)){i.push({from:p.from,to:p.to});continue}d(p.children)}};return d(r),i}const c=(d,f,p)=>{const m=[];for(const b of d){if(b.media&&Ct(b.query,e)===o){m.push({from:b.from,to:b.to,into:null});continue}l(b)&&m.push({from:b.from,to:b.to,into:b})}if(!m.length){p>f&&i.push({from:f,to:p});return}let y=f;for(const b of m)b.from>y&&i.push({from:y,to:b.from}),b.into&&c(b.into.children,b.into.bodyFrom,b.into.bodyTo),y=b.to;p>y&&i.push({from:y,to:p})};return c(r,0,n.length),i.filter(d=>n.slice(d.from,d.to).trim()!=="")}function Ld(t,e){const o=String(t||""),n=[],s=i=>{for(const l of i){if((l.media&&Ct(l.query,e)||/^#id-/.test(l.prelude))&&ko(o.slice(l.bodyFrom,l.bodyTo)).trim()===""){n.push(l);continue}s(l.children)}};if(s(ie(o)),!n.length)return o;let r=o;for(const i of n.sort((l,c)=>c.from-l.from)){let l=i.from,c=i.to;const d=r.lastIndexOf(`
`,l-1)+1;for(r.slice(d,l).trim()===""&&(l=d);r[c]===" "||r[c]==="	";)c+=1;r[c]===`
`&&(c+=1),r=r.slice(0,l)+r.slice(c)}return r}function Fd(t,e){const o=String(t||""),n=[],s=i=>ko(o.slice(i.bodyFrom,i.bodyTo)).trim()==="",r=i=>{for(const l of i){if((l.media&&Ct(l.query,e)||/^#id-/.test(l.prelude))&&s(l)){n.push({from:l.from,to:l.to});continue}r(l.children)}};return r(ie(o)),n}function Je(t,e,o){const n=e||[],s=n.find(d=>d.base),r=[],i=d=>/^#id-/.test(d.prelude)||/^#\s*$/.test(d.prelude),l=(d,f)=>{for(const p of d){if(!p.media){l(p.children,f);continue}const m=Ct(p.query,n)||f;if(o===m){r.push(p);continue}l(p.children,m)}},c=(d,f)=>{for(const p of d){if(p.media){c(p.children,Ct(p.query,n)||f);continue}if(i(p)){const m=f||(s?s.handle:"");!o||o===m?r.push(p):l(p.children,m);continue}c(p.children,f)}};return c(ie(String(t||"")),""),r.sort((d,f)=>d.from-f.from)}function So(t,e,o){return _o(t).filter(n=>Ct(n.query,e)===o)}const C=kn({tag:"",scope:"",scopeElsewhere:[],scopeElsewhereTitle:"",onScopeImport:null,onTag:null,sizes:[],onSize:null,state:"",stateLabel:"",onState:null,canEdit:!1,note:""}),Bd={class:"sve-css-head"},Pd=["disabled"],Od={key:1,class:"sve-css-scope"},Id=["title","disabled"],Dd=["title","data-active","disabled","onClick"],jd=["data-active","disabled"],Hd={key:3,class:"sve-css-note"},Rd={__name:"CodeDockCssHead",setup(t){return(e,o)=>(_(),S("div",Bd,[$(C).tag?(_(),S("button",{key:0,type:"button",class:"sve-css-tag",disabled:!$(C).canEdit,onClick:o[0]||(o[0]=F(()=>{},["prevent","stop"])),onDblclick:o[1]||(o[1]=F(n=>$(C).onTag?.(n),["prevent","stop"]))},"<"+A($(C).tag)+">",41,Pd)):N("",!0),$(C).scope?(_(),S("span",Od,A($(C).scope),1)):N("",!0),$(C).scope&&$(C).scopeElsewhere.length?(_(),S("button",{key:2,type:"button",class:"sve-css-scope-taken",title:$(C).scopeElsewhereTitle,disabled:!$(C).canEdit,onClick:o[2]||(o[2]=F(n=>$(C).onScopeImport?.(),["prevent","stop"]))},A($(C).scopeElsewhere.join(", ")),9,Id)):N("",!0),(_(!0),S(q,null,dt($(C).sizes,n=>(_(),S("button",{key:n.key,type:"button","data-sve-css-size":"",title:n.title,"data-active":n.active?"":void 0,disabled:!$(C).canEdit,onClick:F(s=>$(C).onSize?.(n.key),["prevent","stop"])},A(n.label),9,Dd))),128)),g("button",{type:"button","data-sve-css-state":"","data-active":$(C).state?"":void 0,disabled:!$(C).canEdit,onClick:o[3]||(o[3]=F(n=>$(C).onState?.(n),["prevent","stop"]))},[Oa(A($(C).stateLabel)+" ",1),o[4]||(o[4]=g("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[g("path",{d:"m6 9 6 6 6-6"})],-1))],8,jd),o[5]||(o[5]=g("span",{class:"sve-css-gap"},null,-1)),$(C).note?(_(),S("span",Hd,A($(C).note),1)):N("",!0)]))}},zd=or(Rd,[["__scopeId","data-v-22565303"]]),Wd={key:0,"data-sve-css-swatches":""},Nd=["data-sve-css-token","title","data-active","onClick"],qd={key:0,"data-sve-css-head-row":""},Vd={key:1,"data-sve-css-note-row":""},Ud=["data-sve-css-token","data-active","onClick"],Kd={"data-sve-css-choice-label":""},Gd={key:0,"data-sve-css-choice-hint":""},st={__name:"CodeDockMenu",props:{kind:{type:String,required:!0},swatches:{type:Array,default:()=>[]},choices:{type:Array,default:()=>[]},onClear:{type:Function,default:null},onPick:{type:Function,required:!0}},setup(t){return(e,o)=>t.kind==="colors"?(_(),S("div",Wd,[g("button",{type:"button","data-sve-css-clear":"",title:"Clear",onClick:o[0]||(o[0]=F((...n)=>t.onClear&&t.onClear(...n),["prevent","stop"]))},[...o[1]||(o[1]=[g("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none",stroke:"currentColor","stroke-width":"1.5"},[g("path",{d:"M2 2l6 6M8 2L2 8"})],-1)])]),(_(!0),S(q,null,dt(t.swatches,n=>(_(),S("button",{key:n.name,type:"button","data-sve-css-swatch":"","data-sve-css-token":n.name,title:n.name,"data-active":n.active?"":void 0,style:gl({background:n.hex||"transparent"}),onClick:F(s=>t.onPick(n.name),["prevent","stop"])},null,12,Nd))),128))])):(_(!0),S(q,{key:1},dt(t.choices,n=>(_(),S(q,{key:n.value},[n.heading?(_(),S("span",qd,A(n.label),1)):n.note?(_(),S("span",Vd,A(n.label),1)):(_(),S("button",{key:2,type:"button","data-sve-css-choice":"","data-sve-css-token":n.token||void 0,"data-active":n.active?"":void 0,onClick:F(s=>t.onPick(n.value),["prevent","stop"])},[g("span",Kd,A(n.label),1),n.hint?(_(),S("span",Gd,A(n.hint),1)):N("",!0)],8,Ud))],64))),128))}},Xd=2e4;let Dt=[],vr=0,ye=null,Vo=null;function gr(){return Vo||(Vo=Gt.define()),Vo}function br(){return!!ye&&Date.now()-vr<Xd}function Dn(t){return br()||(vr=Date.now(),ye=t.fetch("/!/sve/site-css/defined",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{defined:[]}).then(e=>(Dt=Array.isArray(e?.defined)?e.defined:[],v.html?.dispatch({effects:gr().of(null)}),Dt)).catch(()=>(ye=null,Dt))),ye}function wo(t){return t.document.getElementById(u)?.querySelector("[data-sve-code-path]")?.textContent.trim()||""}function Yd(t,e){const o=wo(t),n=new Map;for(const s of Dt){const r=n.get(s.name)||new Set;r.add(s.file===o?e:String(s.file).replace(/^.*\//,"")),n.set(s.name,r)}return[...n].map(([s,r])=>({name:s,detail:[...r].join(", ")})).sort((s,r)=>s.name.localeCompare(r.name))}function jn(t,e){const o=wo(t);return e?Dt.filter(n=>n.name===e&&n.file!==o):[]}const yr=t=>[...new Set(t.map(e=>String(e.file).replace(/^.*\//,"")))];function Hn(t,e){const o=jn(t,e).map(r=>r.css).filter(Boolean).join(`
`);if(!o)return!1;const n=it("dock:css");if(typeof n!="string")return!1;const s=Wl(n,e,o);return s!==n&&it("dock:set-css",s)!==!1}function Zd(t,e){const o=t.doc.lineAt(e),n=e-o.from,s=/\bclass\s*=\s*(["'])/gi;let r;for(;r=s.exec(o.text);){const i=r[1],l=r.index+r[0].length,c=o.text.indexOf(i,l),d=c===-1?o.text.length:c;if(n<l||n>d)continue;const f=o.text.slice(l,d),p=Nl(f),m=n-l;if(!p||m<p.innerFrom||m>p.innerTo)return null;const y=(f.slice(p.innerFrom,m).match(/[\w-]*$/)||[""])[0];return{from:e-y.length,typed:y}}return null}function Jd(t){return e=>{const o=Zd(e.state,e.pos);return!o||!o.typed&&!e.explicit?null:Dn(t).then(n=>{const s=wo(t),r=o.typed.toLowerCase(),i=new Map;for(const c of n){if(c.file===s||!String(c.name).toLowerCase().startsWith(r))continue;const d=i.get(c.name)||{files:[],css:[]};d.files.push(c),c.css&&d.css.push(c.css),i.set(c.name,d)}if(!i.size)return null;const l=[...i].slice(0,40).map(([c,d])=>({label:c,type:"class",detail:yr(d.files).join(", "),info:d.css.length?()=>{const f=t.document.createElement("pre");return f.textContent=d.css.join(`
`),f.style.cssText="margin:0;padding:.3em .5em;font:11px ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap",f}:void 0,apply:(f,p,m,y)=>{f.dispatch({changes:{from:m,to:y,insert:c},selection:{anchor:m+c.length}}),t.setTimeout(()=>Hn(t,c),0)}}));return{from:o.from,options:l,validFor:/^[\w-]*$/}})}}function Qd(t){const e=o=>{if(!Dt.length)return nt.none;const n=wo(t),s=new gt;for(const r of Me(o)){const i=Dt.filter(l=>l.name===r.name&&l.file!==n);i.length&&s.add(r.from,r.to,nt.mark({class:"sve-cm-class-taken",attributes:{title:h(t,"class_defined_in",{file:yr(i).join(", ")})}}))}return s.finish()};return vt.define({create:o=>e(o.doc.toString()),update:(o,n)=>n.docChanged||n.effects.some(s=>s.is(gr()))?e(n.state.doc.toString()):o,provide:o=>I.decorations.from(o)})}const tu=/^\.[a-zA-Z_][\w-]*$/;function eu(t,e,o){return String(e||"").includes(o)?Qe(t).length===1:!1}function Qe(t){return ie(t).filter(e=>/^@scope\b/i.test(e.prelude))}function ou(t){const e=String(t||"");return ie(e).filter(o=>tu.test(o.prelude)?!e.slice(o.from,o.bodyFrom-1).includes("{{"):!1).map(o=>({from:o.from,to:o.to,name:o.prelude.slice(1)}))}function nu(t,e,o){const n=String(t||"");if(!eu(n,e,o))return n;const s=ou(n);if(!s.length)return n;const r=Qe(n)[0],i=ru(n,r),l=s.map(m=>iu(n.slice(m.from,m.to),n,m.from,i)).join(`

`);let c=n;for(const m of[...s].sort((y,b)=>b.from-y.from))c=au(c,m.from,m.to);const d=su(c,o);if(d===-1)return n;const f=(c.slice(0,d).match(/\n([^\S\n]*)$/)||[null,null])[1],p=f===null?d:d-f.length;return`${c.slice(0,p)}
${l}
${f??""}${c.slice(d)}`}function su(t,e){const o=Qe(t).find(n=>n.prelude.includes(e));return o?o.bodyTo:Qe(t)[0]?.bodyTo??-1}function au(t,e,o){let n=e,s=o;const r=t.lastIndexOf(`
`,n-1)+1;for(t.slice(r,n).trim()===""&&(n=r);t[s]===" "||t[s]==="	";)s+=1;return t[s]===`
`&&(s+=1),t.slice(0,n)+t.slice(s)}function ru(t,e){const o=t.slice(e.bodyFrom,e.bodyTo).match(/\n([^\S\n]+)\S/);return o?o[1]:`${(t.slice(0,e.from).match(/\n([^\S\n]*)$/)||[null,""])[1]}    `}function iu(t,e,o,n){const s=(e.slice(0,o).match(/\n([^\S\n]*)$/)||[null,""])[1];return t.split(`
`).map((r,i)=>i===0?n+r.trim():r.startsWith(s)?n+r.slice(s.length):n+r.trimStart()).join(`
`)}const lu={"data-sve-css-add-label":""},cu=["placeholder","onKeydown"],du={key:0,"data-sve-css-add-hint":""},uu={"data-sve-css-add-existing":""},fu={"data-sve-css-add-list":""},pu=["onClick"],hu={"data-sve-css-add-name":""},mu={"data-sve-css-add-detail":""},vu={key:0,"data-sve-css-add-none":""},gu=["disabled"],$o={__name:"CodeDockAddClass",props:{label:{type:String,required:!0},placeholder:{type:String,default:""},initial:{type:String,default:""},onAdd:{type:Function,required:!0},options:{type:Array,default:()=>[]},onPick:{type:Function,default:null},takenText:{type:Function,default:null},existingLabel:{type:String,default:""},createLabel:{type:String,default:""},onClose:{type:Function,default:null}},setup(t){const e=t,o=It(e.initial||""),n=It(null);Ia(()=>Xo(()=>{n.value?.focus(),n.value?.select()}));const s=ke(()=>o.value.trim().toLowerCase()),r=ke(()=>{if(!e.options.length)return[];const c=s.value,d=[],f=[];for(const p of e.options){const m=p.name.toLowerCase();!c||m.startsWith(c)?d.push(p):m.includes(c)&&f.push(p)}return[...d,...f].slice(0,8)}),i=ke(()=>e.takenText&&s.value?e.takenText(o.value.trim()):"");function l(){const c=o.value.trim();if(!c){n.value?.focus();return}if(i.value&&e.onPick){e.onPick(c);return}e.onAdd(c)}return(c,d)=>(_(),S(q,null,[g("label",lu,A(t.label),1),Da(g("input",{ref_key:"input",ref:n,"data-sve-css-add-input":"","onUpdate:modelValue":d[0]||(d[0]=f=>o.value=f),type:"text",placeholder:t.placeholder,onKeydown:[Xt(F(l,["prevent"]),["enter"]),d[1]||(d[1]=Xt(F(f=>t.onClose?.(),["stop","prevent"]),["escape"]))]},null,40,cu),[[ja,o.value]]),i.value?(_(),S("div",du,A(i.value),1)):N("",!0),t.options.length?(_(),S(q,{key:1},[g("div",uu,A(t.existingLabel),1),g("div",fu,[(_(!0),S(q,null,dt(r.value,f=>(_(),S("button",{key:f.name,type:"button","data-sve-css-add-option":"",onMousedown:d[2]||(d[2]=F(()=>{},["prevent"])),onClick:F(p=>t.onPick?.(f.name),["prevent","stop"])},[g("span",hu,A(f.name),1),g("span",mu,A(f.detail),1)],40,pu))),128)),r.value.length?N("",!0):(_(),S("div",vu,"—"))]),g("button",{type:"button","data-sve-css-add-create":"",disabled:!!i.value||!s.value,onMousedown:d[3]||(d[3]=F(()=>{},["prevent"])),onClick:F(l,["prevent","stop"])},A(t.createLabel),41,gu)],64)):N("",!0)],64))}};function en(t,e){e._sveLockBound||(e._sveLockBound=!0,e.querySelector("[data-sve-code-lock]")?.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),!(!a.lockReady||!a.lastType)){if(a.lastLocked){yu(t);return}kr(t,!0)}}))}function Co(t){return t?rt(t,js)!=="0":!0}function bu(){const t=v.html;return!t||t.state.readOnly||!a.lastType?!1:!ne(Ie(),a.lastParts)}function Z(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-code-autosave]"),n=e?.querySelector("[data-sve-code-save]");if(!o||!n)return;const s=Co(t),r=bu();o.setAttribute("aria-pressed",s?"true":"false"),o.title=h(t,s?"code_dock_autosave_on":"code_dock_autosave_off"),o.setAttribute("aria-label",o.title),o.innerHTML=ol,n.hidden=s,n.title=h(t,"code_dock_save"),n.setAttribute("aria-label",n.title),n.innerHTML=nl,r?n.setAttribute("data-dirty",""):n.removeAttribute("data-dirty")}function on(t,e){e._sveAutosaveBound||(e._sveAutosaveBound=!0,e.querySelector("[data-sve-code-autosave]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=!Co(t);G(t,js,n?"1":"0"),n?V(t.document):a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null),Z(t)}),e.querySelector("[data-sve-code-save]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),V(t.document)}))}function yu(t){t.document.getElementById(Y)?.remove();const e=En(t.document,nc,{title:h(t,"code_dock_unlock_title"),body:h(t,"code_dock_unlock_body"),buttons:[{value:"cancel",label:h(t,"cancel"),variant:"ghost"},{value:"ok",label:h(t,"code_dock_unlock_confirm"),variant:"primary"}],onPick:o=>{e.dismiss(),o==="ok"&&kr(t,!1)}});e.host.id=Y}function kr(t,e){const o=a.lastType;if(!o)return;const n=()=>{a.lastType===o&&t.fetch("/!/sve/section-template/lock",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":ho(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:o,locked:e})}).then(async s=>{if(!s.ok)throw new Error(String(s.status));a.lastType===o&&(a.lastLocked=e,Tt(t),Ft(a.lastParts,e),K(t),R(t.document,e?h(t,"code_dock_locked"):""))}).catch(()=>{R(t.document,h(t,"code_dock_error"))})};if(e&&(V(t.document),a.saveInFlight)){a.saveInFlight.finally(n);return}n()}function ee(t,e){const o=String(e||"");if(/^(header|footer)\//.test(o))return!0;const n=t?.Statamic?.$config?.get?.("sveChromeTemplates")||{};return Object.values(n).some(s=>s&&s.type===o)}function ku(t,e){const o=new Set;return bl(t,t.document).filter(n=>n.type!==e||n.ids.some(s=>o.has(s))?!1:(n.ids.forEach(s=>o.add(s)),!0)).length}function Se(t){const e=a.lastType;if(!a.lastUid||!e||String(e).startsWith("view:")||ee(t,e)){qo(t);return}if(ku(t,e)>1){qo(t);return}const o=$l(a.lastUid,t.document);qo(t,o.length?{sectionUids:o}:void 0)}function xu(t,e,o){return a.saveInFlight=t.fetch("/!/sve/section-template",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":ho(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:e,html:o.html,css:o.css,js:o.js,...typeof o.tw=="string"?{tw:o.tw}:{},...ac(t)?{props:a.lastProps}:{}})}).then(async n=>{if(n.status===423){a.lastLocked=!0,a.lockReady=!0,Tt(t),Ft(a.lastParts,!0),K(t),R(t.document,h(t,"code_dock_locked"));return}const s=await n.json().catch(()=>({}));if(!n.ok)throw new Error(s?.error==="not_writable"?"not_writable":String(n.status));if(a.lastType===e){if(a.lastParts=o,s?.tw_written===!1){a.twDirty=!0,R(t.document,h(t,"code_dock_tw_not_writable")),Z(t),Se(t);return}R(t.document,h(t,"code_dock_saved")),Z(t),t.setTimeout(()=>{const r=t.document.getElementById(u)?.querySelector("[data-sve-code-status]");r&&r.textContent===h(t,"code_dock_saved")&&(r.textContent="")},1800)}Se(t),t.document.getElementById("__sve-section-picker")?.dispatchEvent(new t.CustomEvent("sve-library-stale"))}).catch(n=>{R(t.document,h(t,n?.message==="not_writable"?"code_dock_not_writable":"code_dock_error"))}).finally(()=>{a.saveInFlight=null}),a.saveInFlight}function V(t){a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null);const e=a.lastType,o=a.lastWin,n=v.html;if(!n||n.state.readOnly||!e||!o||!a.lockReady)return;const s=Ie(),r=a.twCss!==null&&lr(o)&&Rn(s.html)===a.twKey;ne(s,a.lastParts)&&!(r&&a.twDirty)&&!a.propsDirty||(a.propsDirty=!1,r&&(s.tw=a.twCss,a.twDirty=!1),R(t,h(o,"code_dock_saving")),xu(o,e,s))}function Rn(t){return sc(t).sort().join(" ")}function zn(){a.twCss=null,a.twKey="",a.twDirty=!1}function Wn(t,e){a.twCss=e,a.twKey=Rn(t),a.twDirty=!1}function Nn(t,e){if(!t||!lr(t))return;const o=Rn(e);o===a.twKey||a.twBusy||(a.twBusy=!0,xn(()=>import("./tw-compile-BqsL3ULf.js"),__vite__mapDeps([0,1]),import.meta.url).then(n=>n.compileTailwind(t,e)).then(n=>{a.twBusy=!1,a.twCss=n,a.twKey=o,a.twDirty=!0,xr(t,t.document)}).catch(n=>{a.twBusy=!1,console.error("[sve] tailwind compile",n)}))}function xr(t,e){a.saveTimer&&clearTimeout(a.saveTimer),a.saveTimer=t.setTimeout(()=>{a.saveTimer=null,V(e)},Zi)}function X(t){if(a.applying)return;const e=Ie();if(ne(e,a.lastParts)){Z(t);return}if(Z(t),Nn(t,e.html),!Co(t)){R(t.document,h(t,"code_dock_unsaved"));return}R(t.document,h(t,"code_dock_saving")),xr(t,t.document)}function qn(t,e){let o=0;const n=Math.min(t.length,e.length);for(;o<n&&t[o]===e[o];)o+=1;let s=t.length,r=e.length;for(;s>o&&r>o&&t[s-1]===e[r-1];)s-=1,r-=1;return[o,s,e.slice(o,r)]}const _u='<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M2.5 3.5h11M2.5 8h11M2.5 12.5h7"/></svg>';function Vn(){const t=!!a.htmlScopePref;return{html:t,css:t&&a.styleMode!=="tw"&&!a.lastLocked}}function _r(){return a.htmlAll||Vn().css&&a.cssAll}function qt(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-all]");if(!e)return;const o=Vn(),n=_r(),s=t.document.createElement("span");s.textContent=h(t,"code_dock_all"),e.innerHTML=_u,e.appendChild(s),e.title=h(t,n?"code_dock_all_off":o.css?"code_dock_all_on":o.html?"code_dock_all_on_html":"code_dock_all_none"),e.setAttribute("aria-label",e.title),e.setAttribute("aria-pressed",n?"true":"false")}const nn={};function Su(t){return nn[t]=new T.state.Compartment,nn[t].of(zo())}function Un(t){const e=v[t],o=nn[t];!e||!o||(e.dispatch({effects:o.reconfigure([])}),e.dispatch({effects:o.reconfigure(zo())}))}function To(t){const e=a.lastUid,o=typeof ut=="function"?ut(t.document):[];for(const n of o){const s=Ht(n.values)||n.values;if(!(!s||typeof s!="object")&&e&&typeof Us=="function"){const r=Us(s,e);if(r){const i=r.split("."),l=yl(s,i.slice(0,2).join("."));if(l&&typeof l=="object")return l}}}for(const n of o){const s=Ht(n.values)||n.values;if(s&&typeof s=="object")return s}return null}function Kn(t,e){!e||e===a.lastType||(V(t.document),Kt(t,e,"push"))}function Gn(t){const e=a.typeStack.pop();if(!e){Nt(t);return}V(t.document),Kt(t,e,"keep")}function Tt(t){const e=t.document.getElementById(u),o=e?.querySelector("[data-sve-code-lock]"),n=e?.querySelector("[data-sve-code-lock-banner]");if(!e||!o)return;const s=a.lastLocked;e.toggleAttribute("data-sve-code-locked",s),qt(t),s&&(Ja(t.document),xt(t.document),a.htmlPartialUi&&(a.htmlPartialUi.setHover(v.html,null),a.htmlPartialUi.setHover(v.css,null)),a.htmlClassTokenUi?.setHover(v.html,null)),o.hidden=!a.lockReady,o.setAttribute("aria-pressed",a.lastLocked?"true":"false"),o.title=h(t,a.lastLocked?"code_dock_unlock":"code_dock_lock"),o.setAttribute("aria-label",o.title),o.innerHTML=a.lastLocked?Ji:Qi,n&&(n.textContent=h(t,"code_dock_locked_banner"))}function le(t){return t?rt(t,We)!=="0":a.htmlScopePref}function At(t,e,o){return t!=null&&e!=null&&t>=0&&e>t&&e<=o}function lt(){const t=globalThis.document?.getElementById(u);t&&(t.__sveHtmlScope=a.htmlScopeActive&&a.htmlFocus?{full:a.htmlFull,from:a.htmlFocus.from,to:a.htmlFocus.to,get css(){return to()}}:{get css(){return to()}})}function Mt(){const t=v.html?.state.doc.toString()??"";if(!a.htmlScopeActive||!a.htmlFocus){a.htmlFull=t,lt();return}if(a.htmlFocus.from<0||a.htmlFocus.from>a.htmlFull.length||a.htmlFocus.to<a.htmlFocus.from){a.htmlScopeActive=!1,a.htmlFull=t,a.htmlFocus=null,lt();return}a.htmlFull=a.htmlFull.slice(0,a.htmlFocus.from)+t+a.htmlFull.slice(a.htmlFocus.to),a.htmlFocus={from:a.htmlFocus.from,to:a.htmlFocus.from+t.length},lt()}function St(){return Mt(),a.htmlScopeActive?a.htmlFull:v.html?.state.doc.toString()??a.lastParts.html??""}function ce(){a.lastBracketNames=Me(St()).map(t=>t.name)}function Lt(){a.lastCssSelectorNames=Za(v.css?.state.doc.toString()??a.cssFull)}function Sr(t,e){return Array.isArray(t)&&Array.isArray(e)&&t.length===e.length&&t.every((o,n)=>o===e[n])}function Xn(t,e){a.cssFull=Ul(a.cssFull,t,e),a.cssFull=Kl(a.cssFull,e,t)}function wr(t){if(a.applying||a.lastLocked||a.lastBracketNames==null)return;const e=Me(St()).map(o=>o.name);Sr(a.lastBracketNames,e)||(Xn(a.lastBracketNames,e),a.lastBracketNames=e,pt(),Lt())}function $r(){if(a.applying||a.lastLocked||a.lastCssSelectorNames==null||a.lastBracketNames==null||a.cssPane==="empty")return;const t=v.html,e=v.css?.state.doc.toString()??"";if(!An(e))return;const o=Za(e);if(!t||Sr(a.lastCssSelectorNames,o))return;const n=new Set(a.lastBracketNames),{renamed:s,added:r,removed:i}=Vl(a.lastCssSelectorNames,o);let l=t.state.doc.toString();const c=l;for(const d of s){const f=Rt(d.to);!n.has(d.from)||!f||(l=Zs(l,p=>p===d.from?f:p))}for(const d of i)!n.has(d)||o.includes(d)||(l=Zs(l,f=>f===d?"":f));if(l=wu(l,r,n,e),l!==c){a.applying=!0;try{Vt(l)}finally{a.applying=!1}}ce(),a.lastCssSelectorNames=o}function wu(t,e,o,n){if(!e.length||a.cssPane!=="tree")return t;const s=Cr(t);if(!s)return t;const r=new Set(Me(s.full).map(d=>d.name)),{from:i}=s;let{to:l}=s,c=t;for(const d of e){const f=Rt(d);!f||o.has(f)||r.has(f)||!Gl(n,f)||({html:c,to:l}=Ga(c,i,l,f),r.add(f))}return c}function Cr(t){Mt();const e=a.cssFocus?.path,o=a.htmlScopeActive&&!!a.htmlFocus;if(!e&&!o)return null;const n=o?a.htmlFocus.from:0,s=o?a.htmlFull.slice(0,n)+t+a.htmlFull.slice(a.htmlFocus.to):t,r=re(Le(s),new Set),i=e?r.find(l=>l.path===e):r.find(l=>l.from===n);return!i||i.from<n||i.openTo-n>t.length?null:{full:s,from:i.from-n,to:i.openTo-n}}function Tr(t){const e=Rt(t),o=v.html;if(!e||!o||o.state.readOnly||a.lastLocked)return!1;const n=o.state.doc.toString(),s=Cr(n);if(!s)return!1;const{html:r}=Ga(n,s.from,s.to,e);if(r===n&&!ql(n.slice(s.from,s.to)).includes(e))return!1;r!==n&&Vt(r);const i=a.lastBracketNames==null?[]:a.lastBracketNames.slice();return ce(),Xn(i,a.lastBracketNames),pt(),Lt(),!0}function Be(){const t=v.css?.state.doc.toString()??"";return Tn(Cu())[0]?.className||Qo(t)}function $u(t,e){const o=Rt(e),n=v.html;if(!o||!n||n.state.readOnly||o===t.name)return;a.applying=!0;try{n.dispatch({changes:{from:t.from,to:t.to,insert:o}})}finally{a.applying=!1}const s=a.lastBracketNames==null?[]:a.lastBracketNames.slice();ce(),Xn(s,a.lastBracketNames),pt(),Lt(),a.lastWin&&(X(a.lastWin),P(a.lastWin))}function Ar(t,e){const o=t.document,s=v.html?.coordsAtPos(e.from);w(o),xt(o);const r=o.createElement("div"),i={getBoundingClientRect:()=>({left:s?.left??12,right:s?.right??12,top:s?.top??12,bottom:s?.bottom??12,width:0,height:0})};r.id=x,o.body.appendChild(r),z(t,i,r),r._sveApp=W($o,r,{label:h(t,"code_dock_css_rename_class"),placeholder:h(t,"code_dock_css_class_placeholder"),initial:e.name,onAdd:l=>{$u(e,l),w(o)}})}function Yn(){return a.htmlScopePref&&!a.htmlAll&&At(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)?(a.htmlScopeActive=!0,lt(),a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to)):(a.htmlScopeActive=!1,lt(),a.htmlFull)}function de(t,e,o){const n=v[t];if(!n)return;const s=n.state.doc.toString();a.applying=!0;try{if(s!==e){const[r,i,l]=qn(s,e);n.dispatch({changes:{from:r,to:i,insert:l},...o?{selection:o,scrollIntoView:!0}:{}})}else o&&n.dispatch({selection:o,scrollIntoView:!0})}finally{a.applying=!1}}function Vt(t,e){de("html",t,e)}function Er(){if(a.htmlScopeActive)return v.html?.state.doc.toString()??"";if(a.htmlAll){const t=v.html?.state.doc.toString()??"";return At(a.htmlFocus?.from,a.htmlFocus?.to,t.length)?t.slice(a.htmlFocus.from,a.htmlFocus.to):""}return At(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)?a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to):""}function Mr(){const t=a.cssFocus?.path;if(!t)return null;const e=St(),o=re(Le(e),new Set).find(n=>n.path===t);return o?e.slice(o.from,o.to):(a.cssFocus=null,null)}function Cu(){return Mr()??Er()}function Tu(){a.cssFocus=null}function Lr(t){if(!t||a.applying||a.cssValues)return;const e=v.html;if(!e)return;Mt(),U();const o=a.htmlScopeActive&&!!a.htmlFocus,s=(o?a.htmlFocus.from:0)+e.state.selection.main.from;let r=null;for(const l of re(Le(a.htmlFull),new Set))l.from<=s&&s<l.to&&(r=l);!r||s<r.from||s>=r.openTo||(a.cssFocus?a.cssFocus.path===r.path:o&&a.htmlFocus.from===r.from&&a.htmlFocus.to===r.to)||(a.cssFocus={path:r.path},pt())}function Au(){const t=v.html?.state.doc.toString(),e=a.htmlFocus;return t!=null&&a.htmlScopeActive&&e&&e.from>=0&&e.from<=a.htmlFull.length&&e.to>=e.from?a.htmlFull.slice(0,e.from)+t+a.htmlFull.slice(e.to):t??a.lastParts.html??""}function to(){const t=v.css?.state.doc.toString();return t==null?a.cssFull:a.cssPane==="tree"?t===a.cssScopeSnapshot?a.cssFull:Ya(a.cssFull,t,Be(),{previous:a.cssScopeSnapshot,keep:Me(Au()).map(e=>e.name)}):a.cssPane==="full"?t:a.cssFull}function U(){const t=v.css?.state.doc.toString()??"";if(a.cssPane==="tree"){if(t===a.cssScopeSnapshot||!An(t))return;a.cssFull=to(),a.cssScopeSnapshot=t}else a.cssPane==="full"&&(a.cssFull=t)}function Eu(t,e){return(e||[]).some(o=>!Fe(t,o.className))}function pt(){let t=a.cssFull,e=[],o=!1;const n=Mr(),s=n==null&&!a.htmlScopeActive&&!(a.htmlAll&&a.htmlFocus);a.cssValues||a.cssAll||!a.htmlScopePref?(a.cssPane="full",t=a.cssFull):(e=Tn(n??(s?St():Er())),e.length?(a.cssPane="tree",t=Xa(a.cssFull,e),!a.cssFocus&&!s&&Eu(a.cssFull,e)&&(a.cssFull=Ya(a.cssFull,t,e[0].className),o=!0)):(a.cssPane="empty",t="")),a.cssScopeSnapshot=t,de("css",t),Lt(),a.lastWin&&(Ut(a.lastWin,!0),P(a.lastWin),o&&X(a.lastWin))}function Pe(t){const e=v.html;if(!e||!a.htmlFocus)return;a.htmlAll=!1,a.htmlScopeActive||(a.htmlFull=e.state.doc.toString());const o=a.htmlFull.length,n=Math.max(0,Math.min(a.htmlFocus.from,o)),s=Math.max(n,Math.min(a.htmlFocus.to,o));if(s<=n)return;a.htmlFocus={from:n,to:s},a.htmlScopeActive=!0,lt();const r=t==null?0:Math.max(0,Math.min(t-n,s-n));Vt(a.htmlFull.slice(n,s),{anchor:r,head:r}),Un("html"),pt(),e.focus()}function Ao(t=!0,e=null){const o=v.html;if(!o)return;U(),Mt(),a.htmlScopeActive=!1,a.htmlAll=!1,lt();const n=a.htmlFull||o.state.doc.toString(),s=e!=null?{anchor:Math.max(0,Math.min(e,n.length))}:t&&At(a.htmlFocus?.from,a.htmlFocus?.to,n.length)?{anchor:a.htmlFocus.from,head:a.htmlFocus.to}:null;a.htmlFull=n,Vt(n,s),Un("html"),a.cssPane="full",a.cssScopeSnapshot=a.cssFull,de("css",a.cssFull),Lt()}function sn(t,e){const o=v.html;if(!o||!!e===a.htmlAll){qt(t);return}if(e){Mt();const n=a.htmlFull||o.state.doc.toString(),s=At(a.htmlFocus?.from,a.htmlFocus?.to,n.length)?a.htmlFocus:null;a.htmlScopeActive=!1,a.htmlFull=n,lt(),Vt(n,s?{anchor:s.from}:null),Un("html"),a.htmlAll=!0}else{const n=o.state.doc.length;At(a.htmlFocus?.from,a.htmlFocus?.to,n)?(U(),Pe(null)):(a.htmlAll=!1,a.htmlFocus=null,U(),pt())}K(t)}function ue(){a.htmlFocus=null,a.htmlAll=!1,a.cssFocus=null,a.htmlScopeActive=!1,a.htmlFull="",a.cssFull="",a.cssPane="full",a.cssScopeSnapshot="",a.lastBracketNames=null,a.lastCssSelectorNames=null,lt()}let we=!1;function Jt(t){return!!t?.document.getElementById(Ba)}function eo(t,e){if(!(!t||_n(t,"html_tree")===!1)){if(!e){Jt(t)&&Ra(t);return}Jt(t)||(we=!0,Cl("html_tree").then(()=>{Jt(t)||Tl(t)}).catch(()=>{}).finally(()=>{we=!1,K(t)}))}}function K(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-html-scope]");if(!e)return;a.htmlScopePref=le(t);const o=_n(t,"html_tree")===!1?a.htmlScopePref:Jt(t)||we;e.setAttribute("aria-pressed",o?"true":"false"),e.title=h(t,o?"code_dock_html_scope_off":"code_dock_html_scope"),e.setAttribute("aria-label",e.title),e.innerHTML=zs,t.document.getElementById(u)?.toggleAttribute("data-sve-html-scoped",a.htmlScopeActive),lt(),qt(t)}function an(t,e){e._sveHtmlScopeBound||(e._sveHtmlScopeBound=!0,a.htmlScopePref=le(t),Mu(t,e),eo(t,a.htmlScopePref),e.querySelector("[data-sve-html-scope]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=Jt(t)||we;a.htmlScopePref=!n,G(t,We,a.htmlScopePref?"1":"0"),a.htmlScopePref?a.htmlFocus&&(U(),Pe()):(a.htmlScopeActive||a.htmlAll)&&Ao(),eo(t,a.htmlScopePref),K(t)}))}function Mu(t,e){e._sveTreeWatchBound||(e._sveTreeWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>{if(we||_n(t,"html_tree")===!1||!t.document.getElementById(u))return;const o=Jt(t);o!==le(t)&&(a.htmlScopePref=o,G(t,We,o?"1":"0"),o?a.htmlFocus&&(U(),Pe()):(a.htmlScopeActive||a.htmlAll)&&Ao(),K(t))}))}const Lu=new Set(["pre","textarea","script","style"]),Fu=/^(<\/|\{\{\s*\/)/;function Bu(t){let e=0;for(const o of t.split(`
`)){if(!o.trim())continue;const n=o.length-o.trimStart().length;n>0&&(e===0||n<e)&&(e=n)}return" ".repeat(e===2||e===3?e:4)}function Pu(t){const e=String(t||"");if(!e.trim())return e;const o=[],n=l=>{for(const c of l||[])o.push(c),n(c.children)};n(Qa(e));const s=Bu(e),r=[];let i=0;for(const l of e.split(`
`)){const c=i,d=l.trim();i+=l.length+1;const f=c+(l.length-l.trimStart().length),p=o.filter(y=>y.from<f&&f<y.to);if(p.some(y=>Lu.has(y.tag))){r.push(l);continue}if(!d)continue;const m=p.length-(Fu.test(d)?1:0);r.push(s.repeat(Math.max(m,0))+d)}return r.join(`
`)+(e.endsWith(`
`)?`
`:"")}function rn(t,e){let o=0;for(;o<e;){const n=Ou(t,o);if(n===null){o+=1;continue}if(n===-1)return e;if(n>e)return n;o=n}return e}function Ou(t,e){if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?-1:o+2}if(t.startsWith("<!--",e)){const o=t.indexOf("-->",e+4);return o===-1?-1:o+3}return t[e]==="<"&&/[A-Za-z/!?]/.test(t[e+1]||"")?Iu(t,e):null}function Iu(t,e){let o="",n=e+1;for(;n<t.length;){const s=t[n];if(o){s===o&&(o=""),n+=1;continue}if(t.startsWith("{{",n)){const r=t.indexOf("}}",n+2);if(r===-1)return-1;n=r+2;continue}if(s==='"'||s==="'"){o=s,n+=1;continue}if(s===">")return n+1;if(s==="<")return-1;n+=1}return-1}function Zn(t,e){if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?t.length:o+2}if(t.startsWith("<!--",e)){const o=t.indexOf("-->",e+4);return o===-1?t.length:o+3}return e}function oo(t,e){if(t[e]!=="<")return null;const o=t.indexOf(">",e+1);if(o===-1)return null;const n=t.slice(e,o+1),s=n.match(/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/);if(s)return{kind:"close",name:s[1].toLowerCase(),from:e,to:o+1};const r=n.match(/^<([A-Za-z][A-Za-z0-9:-]*)/);if(!r)return{kind:"other",from:e,to:o+1};const i=r[1].toLowerCase();return{kind:/\/\s*>$/.test(n)||["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"].includes(i)?"void":"open",name:i,from:e,to:o+1}}function ln(t,e,o){let n=1,s=o;for(;s<t.length;){const r=Zn(t,s);if(r!==s){s=r;continue}if(t[s]!=="<"){s+=1;continue}const i=oo(t,s);if(!i)break;if(i.kind==="open"&&i.name===e)n+=1;else if(i.kind==="close"&&i.name===e&&(n-=1,n===0))return i;s=i.to}return null}function Du(t,e){const o=[];let n=0;for(;n<e;){const s=Zn(t,n);if(s!==n){n=s;continue}if(t[n]!=="<"){n+=1;continue}const r=oo(t,n);if(!r)return null;if(e<r.to){if(r.kind==="open")return{name:r.name,open:r,close:ln(t,r.name,r.to),at:"open"};if(r.kind==="void")return{name:r.name,open:r,close:null,at:"open"};if(r.kind==="close"){let i=null;for(let l=o.length-1;l>=0;l-=1)if(o[l].name===r.name){i=o[l];break}return{name:r.name,open:i,close:r,at:"close"}}return null}if(r.kind==="open")o.push(r);else if(r.kind==="close"){for(let i=o.length-1;i>=0;i-=1)if(o[i].name===r.name){o.splice(i);break}}n=r.to}return null}function fe(){const t=v.html;if(!t)return null;const e=t.state.selection.main.head,o=t.state.doc.toString(),n=[];let s=0;for(;s<e;){const c=Zn(o,s);if(c!==s){s=c;continue}if(o[s]!=="<"){s+=1;continue}const d=oo(o,s);if(!d||d.from>=e)break;if(d.kind==="open")n.push(d);else if(d.kind==="close"){for(let f=n.length-1;f>=0;f-=1)if(n[f].name===d.name){n.splice(f);break}}s=d.to}const r=o.lastIndexOf("<",Math.max(0,e-1));if(r!==-1&&o.indexOf(">",r)>=e){const c=oo(o,r);if(c?.kind==="open"||c?.kind==="void"){const d=c.kind==="void"?null:ln(o,c.name,c.to);return d?{name:c.name,open:c,close:d}:{name:c.name,open:c,close:null}}}const i=n[n.length-1];if(!i)return null;const l=ln(o,i.name,i.to);return{name:i.name,open:i,close:l}}function no(t){return Ws.includes(t)}function j(){v.html?.focus(),a.lastWin&&(X(a.lastWin),Oe(a.lastWin))}function yt(t,e,o,n=void 0){const s=[...e].sort((r,i)=>i.from-r.from||i.to-r.to);t.dispatch({changes:s,selection:o,...n?{userEvent:n}:{}})}const Yt="input.toolbar";function oe(t,e,o){const n=v.html;if(!n||n.state.readOnly)return;const s=n.state.selection.main.head,r=n.state.doc.lineAt(s),i=r.text.slice(0,s-r.from),l=r.text.trim()?J(r.text):pe(n,r)||J(r.text);let c=t,d=0;if(i.trim()!=="")c=`
${l}${t}`,d=1+l.length;else if(!r.text.trim()){c=`${l}${t}`,d=l.length,n.dispatch({changes:{from:r.from,to:r.to,insert:c},selection:la(r.from+d+e,o),userEvent:Yt});return}n.dispatch({changes:{from:s,to:n.state.selection.main.to,insert:c},selection:la(s+d+e,o),userEvent:Yt})}function la(t,e){return e?{anchor:t,head:t+e}:{anchor:t}}function Fr(t){const{from:e}=t.state.selection.main,o=rn(t.state.doc.toString(),e);return o!==e&&t.dispatch({selection:{anchor:o}}),o}function Eo(t,e,o){const n=v.html;!n||n.state.readOnly||(Fr(n),oe(t,e,o))}const ju=new Set(["section","article","header","footer","main","nav","aside"]);function Hu(t){return no(t)||t==="p"||t==="a"}function ca(t,e=""){if(t==="a")return'<a href="">';if(t!=="section")return e?`<${t} class="${e}">`:`<${t}>`;const o=a.lastWin?.Statamic?.$config?.get?.("sveSectionTag");return typeof o=="string"&&o.trim()?`<${t} ${o.trim()}>`:`<${t}>`}function Jn(){const t=v.html;if(!t||t.state.readOnly)return;const e=t.state.doc.toString(),o=(e.match(/^[ \t]*/)||[""])[0],n=Pu(e).split(`
`).map(s=>s&&o+s).join(`
`);n!==e&&(yt(t,[{from:0,to:e.length,insert:n}],{anchor:0}),j())}function Mo(t,e=""){const o=v.html;if(!o||o.state.readOnly)return;const n=o.state.selection.main,s=o.state.doc.toString();if(!n.empty&&rn(s,n.from)===n.from&&rn(s,n.to)===n.to){const p=s.slice(n.from,n.to),m=p.match(new RegExp(`^<${t}(\\s[^>]*)?>([\\s\\S]*)</${t}>$`,"i"));if(m){yt(o,[{from:n.from,to:n.to,insert:m[2]}],{anchor:n.from,head:n.from+m[2].length},Yt),j();return}const y=ca(t,e);let b=`${y}${p}</${t}>`,k=n.from+y.length;t==="ul"&&(b=`<ul>
  <li>${p}</li>
</ul>`,k=n.from+11),yt(o,[{from:n.from,to:n.to,insert:b}],{anchor:k,head:k+p.length},Yt),j();return}const i=n.head,l=Du(s,i);if(l&&l.name===t&&l.open&&l.close){yt(o,[{from:l.close.from,to:l.close.to,insert:""},{from:l.open.from,to:l.open.to,insert:""}],{anchor:l.open.from},Yt),j();return}const c=fe();if(c?.open&&c.close&&no(c.name)&&no(t)&&c.name!==t){const p=s.slice(c.open.from,c.open.to).replace(new RegExp(`^<${c.name}`,"i"),`<${t}`);yt(o,[{from:c.close.from,to:c.close.to,insert:`</${t}>`},{from:c.open.from,to:c.open.to,insert:p}],{anchor:c.open.from+t.length+1},Yt),j();return}c?.open&&c.name===t&&Hu(t)&&o.dispatch({selection:{anchor:c.close?c.close.to:c.open.to}}),Fr(o);const f=(o.state.doc.lineAt(o.state.selection.main.head).text.match(/^\s*/)||[""])[0];if(t==="ul"){const p=`<ul>
${f}  <li></li>
${f}</ul>`;oe(p,`<ul>
${f}  <li>`.length)}else{const p=ca(t,e),m=`${p}</${t}>`,y=t==="a"?p.indexOf('""')+1:ju.has(t)?p.length:m.length;oe(m,y)}j()}function Br(t,e){let o=null;for(const n of tr(t))n.kind==="loop"&&n.loopKind==="collection"&&n.from<=e&&e<n.to&&(o=n);return o}function Ru(){const t=v.html;return t?Br(t.state.doc.toString(),t.state.selection.main.head):null}function Pr(){const t=v.html;if(!t||t.state.readOnly)return;const e=t.state.doc.toString(),o=Br(e,t.state.selection.main.head);if(!o)return;const n=ic(e,o,!o.paginate);if(n===e)return;if(!er(e,n)){a.lastWin?.Statamic?.$toast?.error(h(a.lastWin,"html_tree_locked_element"));return}const[s,r,i]=qn(e,n);yt(t,[{from:s,to:r,insert:i}]),j()}function Oe(t){try{zu(t)}catch{}}function zu(t){const e=t?.document?.getElementById(u),n=fe()?.name||"";if(!e)return;const s=Ru();for(const r of po){const i=e.querySelector(`[data-sve-html-tool="${r.id}"]`);if(!i)continue;const l=r.action==="pagination",c=l?!!s?.paginate:r.id==="heading"?no(n):r.id==="div"?n==="div":n===r.tag;l&&i.toggleAttribute("data-in-loop",!!s),c?i.setAttribute("data-active",""):i.removeAttribute("data-active")}}function cn(t,e,o){const n=t.document,s=fe()?.name||"";w(n),e.setAttribute("data-open","");const r=n.createElement("div");r.id=x,n.body.appendChild(r),z(t,e,r),r._sveApp=W(st,r,{kind:"choices",choices:o.map(i=>({value:i,label:i.toUpperCase(),active:s===i})),onPick:i=>{Mo(i),w(n)}})}function Or(t,e){const o=t.document;w(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=x,o.body.appendChild(n),z(t,e,n),n._sveApp=W(st,n,{kind:"choices",choices:bn.map(s=>({value:s.id,label:h(t,s.lang),active:!1})),onPick:s=>{const r=bn.find(i=>i.id===s);r&&Mo("div",r.classes),w(o)}})}function Ir(t,e){const o=t.document;w(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=x,o.body.appendChild(n),z(t,e,n);const s=r=>{o.getElementById(x)&&(n._sveApp?.unmount(),n._sveApp=W(st,n,{kind:"choices",choices:r,onPick:i=>{i&&(Eo(i,i.length),j()),w(o)}}),z(t,e,n))};s([{value:"",label:h(t,"code_dock_loading")}]),t.fetch("/!/sve/components",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(r=>r.ok?r.json():{items:[]}).then(r=>{const i=Array.isArray(r.items)?r.items:[];s(i.length?i.map(l=>({value:l.tag,label:l.name})):[{value:"",label:h(t,"component_none")}])}).catch(()=>s([{value:"",label:h(t,"component_none")}]))}function da(t){const e=Rt(t),o=v.html,n=v.css;if(!e||o?.state.readOnly||n?.state.readOnly)return;const s=fe();if(s?.open&&o){const r=o.state.doc.sliceString(s.open.from,s.open.to),i=Xl(r,e);i!==r&&o.dispatch({changes:{from:s.open.from,to:s.open.to,insert:i}})}U(),Fe(a.cssFull,e)||(a.cssFull=`${String(a.cssFull||"").trimEnd()}${a.cssFull?.trim()?`
`:""}.${e} {
}
`),pt(),ce(),Lt(),a.lastWin&&(X(a.lastWin),Oe(a.lastWin),P(a.lastWin))}function Wu(t,e){const o=t.document;if(e.hasAttribute("data-open")){w(o);return}w(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=x,o.body.appendChild(n),z(t,e,n);const s=l=>{const c=Rt(l);if(!c)return"";if(Fe(a.cssFull,c))return h(t,"class_exists_here");const d=[...new Set(jn(t,c).map(f=>String(f.file).replace(/^.*\//,"")))];return d.length?h(t,"class_exists_pick",{file:d.join(", ")}):""},r=l=>{da(l),Hn(t,Rt(l)),w(o)},i=()=>{if(!o.getElementById(x))return;const l=n.querySelector("[data-sve-css-add-input]")?.value||"";n._sveApp?.unmount(),n._sveApp=W($o,n,{label:h(t,"code_dock_css_class_name"),placeholder:h(t,"code_dock_css_class_placeholder"),initial:l,options:Yd(t,h(t,"class_this_file")),existingLabel:h(t,"code_dock_css_class_existing"),createLabel:h(t,"code_dock_css_class_create"),takenText:s,onPick:r,onClose:()=>w(o),onAdd:c=>{da(c),w(o)}}),z(t,e,n)};i(),Dn(t).then(i)}function Dr(t,e){if(a.styleMode==="tw"){w(t.document),rc(t,e);return}Wu(t,e)}function Nu(t){const e=t?.document.querySelector(`#${u} [data-sve-css-add-class]`);return e&&e.getClientRects().length?e:null}function jr(t,e){const o=e.querySelector("[data-sve-css-add-class]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=sl,o.title=h(t,"code_dock_css_add_class"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Dr(t,o)}))}function Ie(){const t={html:"",css:"",js:""};Mt(),U();for(const e of ct)e==="html"?t.html=a.htmlScopeActive?a.htmlFull:v.html?.state.doc.toString()??"":e==="css"?(t.css=a.lastWin?Ld(a.cssFull,ht(a.lastWin)):a.cssFull,t.css=nu(t.css,t.html,Gi)):t[e]=v[e]?.state.doc.toString()??"";return t}function Qn(){if(a.cssValues||a.cssAll||!a.htmlScopePref)return a.cssPane="full",a.cssScopeSnapshot=a.cssFull,a.cssFull;const t=At(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length),e=Tn(t?a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to):a.htmlFull);if(!e.length)return a.cssPane="empty",a.cssScopeSnapshot="","";a.cssPane="tree";const o=Xa(a.cssFull,e);return a.cssScopeSnapshot=o,o}function Ft(t,e){a.applying=!0;try{a.lastWin&&(a.htmlScopePref=le(a.lastWin)),a.htmlFull=t.html??"",a.cssFull=t.css??"",a.cssAll=!1,a.htmlAll=!1;for(const o of ct){const n=v[o];let s=t[o]??"";try{s=o==="html"?Yn():o==="css"?Qn():s}catch{s=o==="html"?a.htmlFull||t.html||"":o==="css"?a.cssFull||t.css||"":s}if(!n)continue;const r=n.state.doc.toString(),i=[Qt[o].reconfigure(ae.readOnly.of(!!e)),te[o].reconfigure(I.editable.of(!e))];r!==s?n.dispatch({changes:{from:0,to:r.length,insert:s},effects:i}):n.dispatch({effects:i})}}finally{a.applying=!1}ce(),Lt(),wn("dock:html-changed"),a.lastWin&&(P(a.lastWin),Oe(a.lastWin),K(a.lastWin),me(a.lastWin))}function ne(t,e){return t.html===e.html&&t.css===e.css&&t.js===e.js}function Hr(t){return String(t||"").replace(/\/\*[\s\S]*?\*\//g,"").trim().replace(/\s*:\s*/g,": ").replace(/\s*;\s*/g,";").replace(/\s+/g," ").replace(/;+$/,";")}function Rr(t){const e=Hr(t).match(/^([a-z-]+)\s*:/i);return e?e[1].toLowerCase():""}function zr(t){const e=Hr(t),o=e.indexOf(":");return o===-1?"":e.slice(o+1).replace(/;$/,"").trim().toLowerCase()}function H(t){const e=String(t||"").trim().toLowerCase();return e==="start"||e==="flex-start"||e==="left"||e==="top"?"flex-start":e==="end"||e==="flex-end"||e==="right"||e==="bottom"?"flex-end":e==="row-reverse"?"row-reverse":e==="column-reverse"?"column-reverse":e}function $e(t){const e=H(t);return e==="flex"||e==="inline-flex"}function De(){const t=v.css;if(!t)return null;const e=t.state.selection.main.head,o=t.state.doc.toString(),n=[],s=[];for(let i=0;i<o.length;i+=1){if(o[i]==="{"&&o[i+1]==="{"){const l=o.indexOf("}}",i+2);if(l===-1)break;i=l+1;continue}if(o[i]==="{")n.push(i);else if(o[i]==="}"){const l=n.pop();l!=null&&s.push({from:l+1,to:i,text:o.slice(l+1,i),open:l})}}let r=null;for(const i of s)e<i.open||e>i.to||(!r||i.to-i.open<r.to-r.open)&&(r=i);return r}function qu(t){const e=String(t||"");let o="",n=0;for(let s=0;s<e.length;s+=1){if(e[s]==="{"&&e[s+1]==="{"){const r=e.indexOf("}}",s+2);if(r===-1)break;n===0&&(o+=e.slice(s,r+2)),s=r+1;continue}if(e[s]==="{"){n+=1;continue}if(e[s]==="}"){n=Math.max(0,n-1);continue}n===0&&(o+=e[s])}return o}function ua(t){const e={};for(const o of qu(t).split(";")){const n=Rr(o);n&&(e[n]=zr(`${o};`))}return e}function Vu(t,e,o){if(!e||e.from>=e.to)return null;let n=t.state.doc.lineAt(e.from),s=0;for(;n.from<=e.to;){const r=Math.max(n.from,e.from),i=Math.min(n.to,e.to),l=t.state.doc.sliceString(r,i);if(s===0&&Rr(l)===o)return{from:r,to:i,text:l};if(s+=Uu(l),n.to>=t.state.doc.length||n.to>=e.to)break;n=t.state.doc.lineAt(n.to+1)}return null}function Uu(t){let e=0;const o=String(t);for(let n=0;n<o.length;n+=1){if(o[n]==="{"&&o[n+1]==="{"){const s=o.indexOf("}}",n+2);n=s===-1?o.length:s+1;continue}o[n]==="{"?e+=1:o[n]==="}"&&(e-=1)}return e}function J(t){return(String(t).match(/^\s*/)||[""])[0]}function pe(t,e,o){for(let n=e.number-1;n>=1;n-=1){const s=t.state.doc.line(n),r=s.text.trim();if(!r)continue;const i=J(s.text);if(o&&(r==="{"||r.endsWith("{")))return`${i}  `;if(!(r==="}"||r.startsWith("}")))return i}return""}function Ku(t,e){const o=t.state.doc.lineAt(e);if(o.text.trim())return J(o.text);const n=pe(t,o,!0);if(n)return n;const s=De();return s?Wr(t,s):"  "}function Wr(t,e){const o=t.state.doc.lineAt(e.from),n=t.state.doc.lineAt(Math.max(e.from,e.to));for(let r=n.number;r>=o.number;r-=1){const i=t.state.doc.line(r),l=Math.max(i.from,e.from),c=Math.min(i.to,e.to),d=t.state.doc.sliceString(l,c);if(d.trim())return(d.match(/^\s*/)||[""])[0]||"  "}return`${(t.state.doc.lineAt(Math.max(0,e.from-1)).text.match(/^\s*/)||[""])[0]}  `}function fa(){v.css?.focus(),a.lastWin&&(X(a.lastWin),P(a.lastWin))}function Nr(t,e){if(!e)return"";const o=t.state.doc.toString();let n=0;for(let s=e.open-1;s>=0;s-=1)if(o[s]==="}"||o[s]==="{"||o[s]===";"){n=s+1;break}return o.slice(n,e.open).replace(/\/\*[\s\S]*?\*\//g,"").trim()}function Gu(t,e){if(!a.cssState||!e)return e;const o=qr(t,e);if(o)return o;const n=Nr(t,e);if(!n||n.startsWith("@"))return e;const s=t.state.doc.toString(),r=kt(s,e.open),i=kt(s,e.to)||`${r}    `,l=(t.state.doc.sliceString(e.from,e.to).match(/\n([^\S\n]*)$/)||[null,null])[1],c=l===null?e.to:e.to-l.length,d=`
${i}&${he()} {
${i}}
${l??r}`;t.dispatch({changes:{from:c,to:e.to,insert:d}});const f=t.state.doc.toString(),p=f.indexOf("{",c+d.indexOf("&")),m=p===-1?-1:go(f,p);return m===-1?e:{from:p+1,to:m,text:f.slice(p+1,m),open:p}}function kt(t,e){const o=t.lastIndexOf(`
`,e-1)+1;return(t.slice(o,e).match(/^\s*/)||[""])[0]}function Q(t){const e=v.css;if(!e||e.state.readOnly||!t.length)return;const o=De(),n=t.some(l=>l.value!=null)?Gu(e,o):o;if(!n){const l=t.filter(c=>c.value!=null).map(c=>`${c.property}: ${c.value};`).join(`
`);l&&Xu(l),fa();return}const s=[],r=[],i=Wr(e,n);for(const l of t){const c=Vu(e,n,l.property);if(l.value==null){if(!c)continue;let d=c.from,f=c.to;e.state.doc.sliceString(f,f+1)===`
`&&(f+=1),d=Math.max(d,n.from),f=Math.min(f,n.to),s.push({from:d,to:f});continue}if(!(c&&H(zr(c.text))===H(l.value)))if(c){const d=(c.text.match(/^\s*/)||[""])[0];s.push({from:c.from,to:c.to,insert:`${d}${l.property}: ${l.value};`})}else r.push(`${i}${l.property}: ${l.value};`)}if(r.length){const l=!n.text.includes(`
`)||!/\n\s*$/.test(n.text)?`
`:"",c=(n.text.match(/\n([^\S\n]*)$/)||[null,null])[1],d=c===null?n.to:n.to-c.length,f=c===null?"":c;s.push({from:d,to:n.to,insert:`${l}${r.join(`
`)}
${f}`})}s.length&&(s.sort((l,c)=>c.from-l.from||c.to-l.to),e.dispatch({changes:s})),fa()}function et(){const t=v.css,e=De();if(!e)return{};if(a.cssState&&t){const o=qr(t,e);return o?ua(o.text):{}}return ua(e.text)}function qr(t,e){const o=Nr(t,e),n=he();if(!o||o.startsWith("@"))return null;if(o.endsWith(n))return e;const s=t.state.doc.toString(),r=i=>{const l=go(s,i);return l===-1?null:{from:i+1,to:l,text:s.slice(i+1,l),open:i}};for(const i of[`&${n}`,`${o}${n}`]){const l=new RegExp(`(^|[^\\w-])${i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\s*\\{`,"g");let c;for(;c=l.exec(s);){const d=s.indexOf("{",c.index);if(i.startsWith("&")&&(d<e.from||d>e.to))continue;const f=r(d);if(f)return f}}return null}function Vr(t){const e=et(),o=$e(e.display),n=H(e["flex-direction"])||(o?"row":"");if(o&&n===t){const s=[];e["flex-direction"]&&s.push({property:"flex-direction",value:null}),$e(e.display)&&s.push({property:"display",value:null}),Q(s);return}Q([{property:"display",value:"flex"},{property:"flex-direction",value:t}])}function Ur(t){const e=et();if(t==="flex"&&$e(e.display)){Q([{property:"justify-content",value:null},{property:"align-items",value:null},{property:"flex-direction",value:null},{property:"display",value:null}]);return}Q([{property:"display",value:t}])}function Xu(t){const e=v.css;if(!e||e.state.readOnly)return;const o=e.state.selection.main.head,n=e.state.doc.lineAt(o),s=n.text.slice(0,o-n.from),r=n.text.slice(o-n.from),i=Ku(e,o),l=t.replace(/;?$/,";");if(s.trim()===""&&r.trim()===""){const d=`${i}${l}
${i}`;e.dispatch({changes:{from:n.from,to:n.to,insert:d},selection:{anchor:n.from+d.length}});return}const c=`
${i}${l}
${i}`;e.dispatch({changes:{from:o,to:e.state.selection.main.to,insert:c},selection:{anchor:o+c.length}})}function P(t){try{Yu(t),ot(t)}catch{}}function Yu(t){const e=a.styleMode==="tw",o=e?{}:et(),n=$e(e?Qs("display"):o.display),s=H(o["flex-direction"])||(n?"row":""),r=i=>e?dc()?i.twGroup?!!uc(i.twGroup):!!i.tw&&!!Qs(i.tw):!1:!!i.css&&i.css in o;$t.tools=qs.map(i=>{const l=(i.kids||[]).filter(c=>c.when!=="flex"||n).map(c=>({id:c.id,title:c.title,icon:yn[c.icon]||"",sep:!!c.sep,open:a.cssOpenMenu===c.id,active:e?r(c):c.kind==="display"?n:c.kind==="flexDir"?n&&s===c.value:c.value?H(o[c.css])===H(c.value):r(c)}));return{id:i.id,title:i.title,icon:yn[i.id]||rl[i.id]||"",open:a.cssOpenTool===i.id||a.cssOpenMenu===i.id,kids:l,active:i.value?!e&&H(o[i.css])===H(i.value):r(i)||l.some(c=>c.active)}})}function se(t){w(t),a.cssOpenTool="",a.lastWin&&P(a.lastWin)}function w(t){const e=t?.getElementById(x);a.cssOpenMenu="",e?._sveApp?.unmount(),e?.remove(),t?.querySelectorAll("[data-sve-css-tool][data-open], [data-sve-html-tool][data-open], [data-sve-css-add-class][data-open], [data-sve-code-history][data-open]").forEach(o=>o.removeAttribute("data-open"))}function Zu(t){w(t),D(t),xt(t);for(const e of ct)v[e]&&Ts?.(v[e])}function Kr(t){if(a.cssColorsPromise)return a.cssColorsPromise;const e=t.Statamic?.$config?.get?.("cpUrl")||`/${t.Statamic?.$config?.get?.("cpRoute")||"cp"}`;return a.cssColorsPromise=t.fetch(`${e}/color-scheme/swatches`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async o=>{if(!o.ok)return[];const n=await o.json().catch(()=>[]);return Array.isArray(n)?n:[]}).catch(()=>[]).then(o=>{const n=new Set,s=[];for(const r of o){const i=r.var||r.value||r.handle,l=String(i||"").trim().replace(/^var\((.+)\)$/,"$1");!l||n.has(l)||(n.add(l),s.push({name:l,hex:r.hex||r.color||""}))}for(const[r,i]of Ns)n.has(r)||(n.add(r),s.push({name:r,hex:i}));return s}),a.cssColorsPromise}function Gr(t,e){const o=et()[e]||"",n=String(o).match(/^var\(\s*([^)]+?)\s*\)$/i),s=n?n[1].trim():"";for(const r of t.querySelectorAll("[data-sve-css-token]"))s&&r.getAttribute("data-sve-css-token")===s?r.setAttribute("data-active",""):r.removeAttribute("data-active")}function z(t,e,o){const n=e.getBoundingClientRect(),s=8,r=t.innerHeight-(n.bottom+4)-s,i=n.top-4-s;o.style.maxHeight="";const l=o.offsetHeight||0,c=l>r&&i>r;o.style.left=`${Math.max(s,Math.min(n.left,t.innerWidth-220))}px`,o.style.maxHeight=`${Math.max(120,c?i:r)}px`,o.style.top=c?`${Math.max(s,n.top-4-Math.min(l,i))}px`:`${Math.max(s,n.bottom+4)}px`}function Xr(t,e,o){const n=t.document;w(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=x,n.body.appendChild(s),z(t,e,s);const r=i=>{s._sveApp?.unmount(),s._sveApp=W(st,s,{kind:"colors",swatches:i,onClear:()=>{Q([{property:o,value:null}]),se(n)},onPick:l=>{Q([{property:o,value:`var(${l})`}]),se(n)}}),Gr(s,o)};r(Ns.map(([i,l])=>({name:i,hex:l}))),Kr(t).then(i=>{n.getElementById(x)&&r(i.map(l=>({name:l.name,hex:l.hex})))})}function Yr(t,e,o,n){const s=t.document;w(s),e.setAttribute("data-open","");const r=s.createElement("div"),i=et()[o]||"";r.id=x,s.body.appendChild(r),z(t,e,r),r._sveApp=W(st,r,{kind:"choices",choices:(n||[]).map(l=>({value:l,label:l,active:H(l)===H(i)})),onPick:l=>{const c=H(l)===H(et()[o]||"");Q([{property:o,value:c?null:l}]),se(s)}})}function dn(t,e,o,n=[]){const s=t.document;w(s),e.setAttribute("data-open",""),lc(t);const r=s.createElement("div");r.id=x,s.body.appendChild(r),z(t,e,r);const i=()=>{const l=[...n.map(d=>({value:d,label:d})),...cc(t,o).map(d=>({value:d.value,label:d.value}))],c=et()[o]||"";r._sveApp?.unmount(),r._sveApp=W(st,r,{kind:"choices",choices:l.map(d=>({...d,active:H(d.value)===H(c)})),onPick:d=>{Q([{property:o,value:d||null}]),se(s)}})};i(),Kr(t).then(()=>{s.getElementById(x)===r&&i()})}function Zr(t,e,o){const n=t.document;w(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=x,n.body.appendChild(s),z(t,e,s),s._sveApp=W(st,s,{kind:"choices",choices:al.map(r=>({value:r,token:r,label:r})),onPick:r=>{Q([{property:o,value:`var(${r})`}]),se(n)}}),Gr(s,o)}const pa=/\{\{#[\s\S]*?#\}\}|\{\{[\s\S]*?\}\}/g,ha=/<!--[\s\S]*?-->/g,ma=/<(\/?)([A-Za-z][A-Za-z0-9-]*)/g,Jr=/^\{\{\s*(?:\/|endif\b|endunless\b)/,Ju=/^\{\{\s*(?:\/\s*(?:if|unless)\b|endif\b|endunless\b)/,Qu=/^\{\{\s*\/\s*partial\b/;function Uo(t,e,o){return t.some(n=>e<n.to&&o>n.from)}function tf(t){const e=new Map;for(const o of tr(t)){const n=o.kind==="loop"?"loop":"if";e.set(o.from,n);const s=t.lastIndexOf("{{",o.to-2);s>=o.openTo&&Jr.test(t.slice(s,o.to))&&e.set(s,n)}for(const o of Ka(t))e.set(o.from,"component");return e}function ef(t){const e=String(t||""),o=[],n=[];ha.lastIndex=0;let s;for(;s=ha.exec(e);)o.push({from:s.index,to:s.index+s[0].length});const r=tf(e),i=[];for(pa.lastIndex=0;s=pa.exec(e);){const l=s.index,c=l+s[0].length,d=s[0];if(Uo(o,l,c))continue;if(i.push({from:l,to:c}),d.startsWith("{{#")){n.push({from:l,to:c,cls:"comment"});continue}const f=Jr.test(d),p=r.get(l)||(f&&Ju.test(d)?"if":"")||(f&&Qu.test(d)?"component":"");n.push({from:l,to:c,cls:(p?`fam-${p}`:"antlers")+(f?"-close":"")})}for(ma.lastIndex=0;s=ma.exec(e);){const l=s.index+1+s[1].length,c=l+s[2].length;Uo(o,l,c)||Uo(i,l,c)||n.push({from:l,to:c,cls:`fam-${Al(s[2])}`})}return n.sort((l,c)=>l.from-c.from),n}function va(t,e,o){const n=new e.RangeSetBuilder;let s=0;for(const r of ef(t.doc.toString()))r.from<s||(n.add(r.from,r.to,o(r.cls)),s=r.to);return n.finish()}function of(t){const e=new Map,o=r=>r==="comment"?"sve-cm-antlers-comment":r==="antlers"?"sve-cm-antlers":r==="antlers-close"?"sve-cm-antlers sve-cm-antlers-close":r.endsWith("-close")?`sve-cm-${r.slice(0,-6)} sve-cm-antlers-close`:`sve-cm-${r}`,n=r=>(e.has(r)||e.set(r,t.Decoration.mark({class:o(r)})),e.get(r));return{extensions:[t.StateField.define({create(r){return va(r,t,n)},update(r,i){return i.docChanged?va(i.state,t,n):r},provide:r=>t.EditorView.decorations.from(r)})]}}const B=kn({tag:"",emptyText:"",addLabel:"",dropTitle:"",chips:[],states:[],canEdit:!1,onAdd:null,onChip:null,onDrop:null}),nf={class:"sve-al"},sf={class:"sve-al-head"},af={key:0,class:"sve-al-tag"},rf=["title","disabled"],lf={key:0,class:"sve-al-empty"},cf={class:"sve-al-chips"},df=["data-sve-al-chip","title","disabled","onClick"],uf={class:"sve-al-name"},ff={key:0,class:"sve-al-value"},pf=["title","onClick"],hf={__name:"AlpinePanel",setup(t){return(e,o)=>(_(),S("div",nf,[g("div",sf,[$(B).tag?(_(),S("span",af,"<"+A($(B).tag)+">",1)):N("",!0),(_(!0),S(q,null,dt($(B).states,n=>(_(),S("span",{key:n,class:"sve-al-state"},A(n),1))),128)),o[1]||(o[1]=g("span",{class:"sve-al-gap"},null,-1)),g("button",{type:"button","data-sve-al-add":"",title:$(B).addLabel,disabled:!$(B).canEdit,onClick:o[0]||(o[0]=F(n=>$(B).onAdd?.(n),["prevent","stop"]))},"+",8,rf)]),$(B).chips.length?N("",!0):(_(),S("div",lf,A($(B).emptyText),1)),g("div",cf,[(_(!0),S(q,null,dt($(B).chips,n=>(_(),S("span",{key:n.id,class:"sve-al-chip-wrap"},[g("button",{type:"button","data-sve-al-chip":n.id,title:n.title,disabled:!$(B).canEdit,onClick:F(s=>$(B).onChip?.(s,n.id),["prevent","stop"])},[g("span",uf,A(n.name),1),n.value?(_(),S("span",ff,A(n.value),1)):N("",!0)],8,df),$(B).canEdit?(_(),S("button",{key:0,type:"button",class:"sve-al-drop",title:$(B).dropTitle,onClick:F(s=>$(B).onDrop?.(n.id),["prevent","stop"])},"−",8,pf)):N("",!0)]))),128))])]))}},mf=or(hf,[["__scopeId","data-v-15add965"]]),vf=[{id:"state",lang:"alpine_group_state"},{id:"act",lang:"alpine_group_act"},{id:"react",lang:"alpine_group_react"}],ga=[{id:"state",group:"state",label:"alpine_state",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: false }"}]},{id:"state_text",group:"state",label:"alpine_state_text",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: '|' }"}]},{id:"toggle",group:"act",label:"alpine_toggle",icon:"toggle",needsName:!0,attrs:[{name:"@click",value:":name = !:name"}]},{id:"open",group:"act",label:"alpine_open",icon:"open",needsName:!0,attrs:[{name:"@click",value:":name = true"}]},{id:"close",group:"act",label:"alpine_close",icon:"close",needsName:!0,attrs:[{name:"@click",value:":name = false"}]},{id:"open_hover",group:"act",label:"alpine_open_hover",icon:"open",needsName:!0,attrs:[{name:"@mouseenter",value:":name = true"}]},{id:"close_leave",group:"act",label:"alpine_close_leave",icon:"close",needsName:!0,attrs:[{name:"@mouseleave",value:":name = false"}]},{id:"open_focus",group:"act",label:"alpine_open_focus",icon:"open",needsName:!0,attrs:[{name:"@focusin",value:":name = true"}]},{id:"close_blur",group:"act",label:"alpine_close_blur",icon:"close",needsName:!0,attrs:[{name:"@focusout",value:":name = false"}]},{id:"close_outside",group:"act",label:"alpine_close_outside",icon:"outside",needsName:!0,attrs:[{name:"@click.outside",value:":name = false"}]},{id:"close_escape",group:"act",label:"alpine_close_escape",icon:"escape",needsName:!0,attrs:[{name:"@keydown.escape.window",value:":name = false"}]},{id:"show",group:"react",label:"alpine_show",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"}]},{id:"show_smooth",group:"react",label:"alpine_show_smooth",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"},{name:"x-transition",value:""}]},{id:"hide_until_ready",group:"react",label:"alpine_hide_until_ready",icon:"cloak",attrs:[{name:"x-cloak",value:""}]},{id:"class_when",group:"react",label:"alpine_class_when",icon:"klass",needsName:!0,attrs:[{name:":class",value:":name ? '|' : ''"}]},{id:"text",group:"react",label:"alpine_text",icon:"text",needsName:!0,attrs:[{name:"x-text",value:":name"}]}];function gf(t){return(t?.attrs||[]).map(e=>e.name).join(" ")}const bf=/^(x-[\w:.-]+|@[\w:.-]+|:[\w-]+)$/;function yf(t){return bf.test(String(t||""))}function je(t){const e=String(t||""),o=[],n=/([@:a-zA-Z_][\w:.@-]*)(\s*=\s*(["'])([\s\S]*?)\3)?/g;let s,r=!0;for(;s=n.exec(e);){if(r){r=!1;continue}s[0].trim()&&o.push({name:s[1],value:s[4]??"",from:s.index,to:s.index+s[0].length,alpine:yf(s[1])})}return o}function Qr(t){const e=String(t||"").trim().replace(/^\{|\}$/g,""),o=[],n=/(^|,)\s*([a-zA-Z_$][\w$]*)\s*:/g;let s;for(;s=n.exec(e);)o.push(s[2]);return o}function kf(t,e){return t.map(o=>({name:o.name,value:String(o.value).replaceAll(":name:",`${e}:`).replaceAll(":name",e)}))}function ts(t,e,o){const n=v.html,s=Bt();if(!n||n.state.readOnly||!s)return;const r=a.htmlScopeActive&&!!a.htmlFocus,i=r?a.htmlFocus.from:0,c=(r?a.htmlFull:n.state.doc.toString()).slice(s.from,s.openTo),d=o===""?e:`${e}="${o}"`,f=je(c).find(m=>m.name===e);let p;if(f)p=c.slice(0,f.from)+d+c.slice(f.to);else{const m=c.search(/\s|\/?>$/);p=m===-1?c:`${c.slice(0,m)} ${d}${c.slice(m)}`}p!==c&&(yt(n,[{from:s.from-i,to:s.openTo-i,insert:p}],null),He(t))}function xf(t,e){const o=v.html,n=Bt();if(!o||o.state.readOnly||!n)return;const s=a.htmlScopeActive&&!!a.htmlFocus,r=s?a.htmlFocus.from:0,l=(s?a.htmlFull:o.state.doc.toString()).slice(n.from,n.openTo),c=je(l).find(p=>p.name===e);if(!c)return;let d=c.from;for(;d>0&&/\s/.test(l[d-1]);)d-=1;const f=l.slice(0,d)+l.slice(c.to);yt(o,[{from:n.from-r,to:n.openTo-r,insert:f}],null),He(t)}function un(t){const e=v.html;if(!e)return[];const n=a.htmlScopeActive&&!!a.htmlFocus?a.htmlFull:e.state.doc.toString(),s=Bt(),r=[],i=re(Le(n),new Set);for(const l of i){if(!s||l.from>s.from||l.to<s.to)continue;const c=je(n.slice(l.from,l.openTo)).find(d=>d.name==="x-data");c&&r.push(...Qr(c.value))}return[...new Set(r)]}function _f(t){const e=v.html,o=Bt();if(!e||!o)return[];const s=a.htmlScopeActive&&!!a.htmlFocus?a.htmlFull:e.state.doc.toString(),r=je(s.slice(o.from,o.openTo)).find(i=>i.name==="x-data");return r?Qr(r.value):[]}function Sf(t,e){const o=t.document;w(o),e.setAttribute("data-open","");const n=un(),s=o.createElement("div");s.id=x,o.body.appendChild(s),z(t,e,s);const r=!n.length,i=!r&&!_f().length,c=vf.filter(d=>d.id==="state"?!i:!r).flatMap(d=>{const f=ga.filter(p=>p.group===d.id);return f.length?[{value:`\0${d.id}`,label:h(t,r&&d.id==="state"?"alpine_group_state_first":d.lang),heading:!0},...f.map(p=>({value:p.id,label:h(t,p.label),hint:gf(p)}))]:[]});r&&c.push({value:"\0note",label:h(t,"alpine_needs_state"),note:!0}),s._sveApp=W(st,s,{kind:"choices",choices:c,onPick:d=>{const f=ga.find(p=>p.id===d);if(w(o),!!f){if(!f.needsName){for(const p of f.attrs)ts(t,p.name,p.value);return}wf(t,e,f,n)}}})}function wf(t,e,o,n){const s=t.document,r=l=>{const c=String(l||"").trim().replace(/[^\w$]/g,"");if(w(s),!!c)for(const d of kf(o.attrs,c))ts(t,d.name,d.value.replace("|",""))};if(!n.length){fn(t,e,r);return}const i=s.createElement("div");i.id=x,s.body.appendChild(i),z(t,e,i),i._sveApp=W(st,i,{kind:"choices",choices:[{value:"\0head",label:h(t,"alpine_name"),heading:!0},...n.map(l=>({value:l,label:l})),{value:"\0new",label:h(t,"alpine_new_name")}],onPick:l=>{if(l==="\0new"){fn(t,e,r);return}r(l)}})}function fn(t,e,o){const n=t.document;w(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=x,n.body.appendChild(s),z(t,e,s),s._sveApp=W($o,s,{label:h(t,"alpine_name"),placeholder:h(t,"alpine_name_placeholder"),onAdd:r=>o(r)})}function He(t){const o=t?.document.getElementById(u)?.querySelector("[data-sve-alpine-host]");if(!o)return;const n=Bt(),s=v.html,r=a.htmlScopeActive&&!!a.htmlFocus,i=s?r?a.htmlFull:s.state.doc.toString():"",l=n?je(i.slice(n.from,n.openTo)):[];B.tag=n?.tag||"",B.canEdit=!a.lastLocked&&!!n,B.emptyText=h(t,n?un().length?"alpine_none_ready":"alpine_none":"alpine_pick"),B.addLabel=h(t,"alpine_add"),B.dropTitle=h(t,"alpine_remove"),B.states=un(),B.chips=l.filter(c=>c.alpine).map(c=>({id:c.name,name:c.name,value:c.value,title:c.value?`${c.name}="${c.value}"`:c.name})),B.onAdd=c=>Sf(t,c.currentTarget),B.onDrop=c=>xf(t,c),B.onChip=(c,d)=>{B.chips.find(p=>p.id===d)&&fn(t,c.currentTarget,p=>ts(t,d,p))},o._sveMounted||(o._sveMounted=!0,Ee(o,mf))}const $f=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]),Cf=new Set(["html","head","body"]),ba=new Set(["if","unless","style_push","script_push","sve_defaults","once","noparse","foreach","forelse","loop","cache","nocache","scope","collection","nav","structure","taxonomy","users","search:results","form:create","form:errors"]),Tf=new Set(["collection:count"]);function ya(t){return Tf.has(t)?!1:ba.has(t)||ba.has(t.split(":")[0])}const Af=new Set(["CloseTag","MismatchedCloseTag","IncompleteCloseTag"]),Ef=/^\s*(\/?)\s*([A-Za-z_][A-Za-z0-9_.:-]*)([\s\S]*)$/,Mf=/^\{\{\s*\/?\s*([A-Za-z_][A-Za-z0-9_.:-]*)/,Lf=3e5;function Ff(t){const e=String(t||""),o=[],n=[];let s=0;for(;s<e.length;){const r=e.indexOf("{{",s);if(r===-1)break;if(e.startsWith("{{#",r)){const d=e.indexOf("#}}",r+3);if(d===-1){n.push(r);break}o.push({from:r,to:d+3,comment:!0,body:""}),s=d+3;continue}let i=0,l=r,c=-1;for(;l<e.length;){if(e.startsWith("{{",l)){i+=1,l+=2;continue}if(e.startsWith("}}",l)){if(i-=1,l+=2,i===0){c=l;break}continue}l+=1}if(c===-1){n.push(r),s=r+2;continue}o.push({from:r,to:c,comment:!1,body:e.slice(r+2,c-2)}),s=c}return{tags:o,unclosed:n}}function Bf(t,e){let o=t;for(const n of e)o=o.slice(0,n.from)+" ".repeat(n.to-n.from)+o.slice(n.to);return o}function Pf(t,e){return t===e||t.startsWith(`${e}:`)}function Ve(t,e){return(t.slice(e,e+80).match(/^<\/?([A-Za-z][A-Za-z0-9:-]*)/)?.[1]||"").toLowerCase()}function Of(t,e,o,n,s){const r=c=>s.has(c.name)&&!/\||\?\?/.test(c.rest);for(const c of o){const d=t.slice(c,c+80).match(Mf)?.[1]||"…";n.push({from:c,to:c+2,key:"code_dock_problem_antlers_unclosed",args:{name:d}})}const i=[],l=[];for(const c of e){if(c.comment)continue;const d=c.body.match(Ef);if(!d)continue;const f=!!d[1],p=d[2].toLowerCase(),m=d[3];if(!f&&(p==="elseif"||p==="else")){let y=-1;for(let b=i.length-1;b>=0;b-=1)if(i[b].name==="if"||i[b].name==="unless"){y=b;break}if(y===-1){n.push({from:c.from,to:c.to,key:"code_dock_problem_branch_stray",args:{name:p}});continue}l.push({from:i[y].to,to:c.from}),i[y]={...i[y],to:c.to},i.length=y+1;continue}if(f||p==="endif"||p==="endunless"){const y=p==="endif"?"if":p==="endunless"?"unless":p;let b=-1;for(let k=i.length-1;k>=0;k-=1)if(Pf(i[k].name,y)){b=k;break}if(b===-1){n.push({from:c.from,to:c.to,key:"code_dock_problem_pair_stray",args:{name:y}});continue}for(const k of i.slice(b+1))ya(k.name)&&n.push({from:k.from,to:k.to,key:"code_dock_problem_pair_unclosed",args:{name:k.name}});(y==="if"||y==="unless")&&l.push({from:i[b].to,to:c.from}),i.length=b;continue}m.trim().startsWith("=")||i.push({name:p,rest:m,from:c.from,to:c.to})}for(const c of i)ya(c.name)?n.push({from:c.from,to:c.to,key:"code_dock_problem_pair_unclosed",args:{name:c.name}}):r(c)&&n.push({from:c.from,to:c.to,key:"code_dock_problem_list_unclosed",args:{name:c.name}});return l}function If(t,e,o,n){const s=e.parse(t),r=new Set,i=[];s.iterate({enter(l){if(l.name==="MismatchedCloseTag"){i.push({from:l.from,to:l.to,key:"code_dock_problem_tag_stray",args:{tag:Ve(t,l.from)}});return}if(l.name==="IncompleteCloseTag"){i.push({from:l.from,to:l.to,key:"code_dock_problem_tag_unfinished",args:{tag:Ve(t,l.from)}});return}if(l.type.isError){const p=l.node.parent;p&&(p.name==="OpenTag"||p.name==="CloseTag")&&(r.add(p.from),i.push({from:p.from,to:Math.max(p.from+1,l.from),key:"code_dock_problem_tag_unfinished",args:{tag:Ve(t,p.from)}}));return}if(l.name!=="Element")return;let c=null,d=!1;for(let p=l.node.firstChild;p;p=p.nextSibling)p.name==="OpenTag"&&(c=p),Af.has(p.name)&&(d=!0);if(!c||d)return;const f=Ve(t,c.from);!f||$f.has(f)||Cf.has(f)||o.some(p=>c.from>=p.from&&c.from<p.to&&l.to>p.to)||i.push({from:c.from,to:c.to,key:"code_dock_problem_tag_unclosed",args:{tag:f}})}});for(const l of i)l.key==="code_dock_problem_tag_unclosed"&&r.has(l.from)||l.args.tag&&n.push(l)}function Df(t,e,o={}){const n=String(t||"");if(!n.trim()||n.length>Lf)return[];const s=[];try{const{tags:i,unclosed:l}=Ff(n),c=Of(n,i,l,s,new Set(o.lists||[]));e&&If(Bf(n,i),e,c,s)}catch{return[]}const r=new Set;return s.sort((i,l)=>i.from-l.from||i.to-l.to).filter(i=>{const l=`${i.from}:${i.key}`;return r.has(l)?!1:(r.add(l),!0)})}function jf(t,e,o=()=>({})){const n=t.Decoration.mark({class:"sve-cm-problem"}),s=t.StateEffect.define(),r=l=>{const c=Df(l.doc.toString(),e,o()),d=new t.RangeSetBuilder;let f=0;for(const p of c)p.from<f||p.to<=p.from||(d.add(p.from,p.to,n),f=p.to);return{problems:c,decorations:d.finish()}},i=t.StateField.define({create(l){return r(l)},update(l,c){return c.docChanged||c.effects.some(d=>d.is(s))?r(c.state):l},provide:l=>t.EditorView.decorations.from(l,c=>c.decorations)});return{field:i,relint:s,extensions:[i]}}const Hf=new Set(["replicator","grid","list","array","table"]);let Xe=new Set,Ko=null;function ti(t){return t.document.getElementById(u)?.querySelector("[data-sve-html-problems]")||null}function Rf(t,e,o){const n=ti(t);if(!n)return;const s=e.state.doc,r=o.map(c=>({from:c.from,line:s.lineAt(Math.min(c.from,s.length)).number,text:h(t,c.key,c.args)})),i=r.map(c=>`${c.line}:${c.text}`).join(`
`);if(n.dataset.sveSignature===i||(n.dataset.sveSignature=i,n.hidden=r.length===0,n.replaceChildren(),!r.length))return;const l=t.document.createElement("span");l.setAttribute("data-sve-problems-title",""),l.textContent=h(t,"code_dock_problems_title"),n.appendChild(l);for(const c of r){const d=t.document.createElement("button"),f=t.document.createElement("b");d.type="button",d.dataset.sveProblemAt=String(c.from),f.textContent=h(t,"code_dock_problem_line",{line:c.line}),d.append(f,t.document.createTextNode(` ${c.text}`)),n.appendChild(d)}}function zf(t){const e=ti(t);!e||e._sveBound||(e._sveBound=!0,e.addEventListener("mousedown",o=>o.preventDefault()),e.addEventListener("click",o=>{const n=o.target.closest("[data-sve-problem-at]"),s=v.html;if(!n||!s)return;o.preventDefault(),o.stopPropagation();const r=Math.min(Number(n.dataset.sveProblemAt)||0,s.state.doc.length);s.dispatch({selection:{anchor:r},effects:I.scrollIntoView(r,{y:"center"})}),s.focus()}))}function Wf(t){const e=[],o=n=>{for(const s of n||[])s?.loop&&Hf.has(s.type)&&s.var&&!s.parent&&e.push(s.var)};o(t?.section);for(const n of t?.page||[])o(n?.items);return e}function Nf(t,e,o){const n={collection:Ln(t),set:Fn(a.lastType),view:"",scope:""},s=n.set?Bn(n):"";if(s===Ko)return;Ko=s;const r=l=>{if(Ko!==s)return;const c=new Set(Wf(l)),d=c.size===Xe.size&&[...c].every(f=>Xe.has(f));Xe=c,!d&&v.html===e&&t.queueMicrotask(()=>{v.html===e&&e.dispatch({effects:o.of(null)})})};if(!s){r(null);return}const i=fr(s);if(i){r(i);return}Pn(t,n).then(r)}function qf(t){if(!a.htmlLintUi){const{field:e,relint:o}=jf({Decoration:nt,StateField:vt,StateEffect:Gt,RangeSetBuilder:gt,EditorView:I},Te.parser,()=>({lists:Xe})),n=I.updateListener.of(s=>{const r=s.transactions.some(i=>i.effects.some(l=>l.is(o)));!s.docChanged&&!r||(s.docChanged&&Nf(t,s.view,o),Rf(t,s.view,s.state.field(e).problems))});a.htmlLintUi={extensions:[e,n]}}return zf(t),a.htmlLintUi}const ka=/\{\{\s*(?:vite\b[^}]*|yield_[a-z_]+|theme_tokens)\s*\}\}/g;function Vf(t,e=[]){const o=[];ka.lastIndex=0;let n;for(;n=ka.exec(String(t||""));)o.push(n.index,n.index+n[0].length);if(!e||!e.length)return o;const s=[];for(const r of[o,e])for(let i=0;i+1<r.length;i+=2)s.push([r[i],r[i+1]]);return s.sort((r,i)=>r[0]-i[0]||r[1]-i[1]).flat()}const Uf=["input","delete","move"];function Kf(t){return Uf.some(e=>t(e))}let Go={text:null,ranges:[]};function ei(t){return Go.text!==t&&(Go={text:t,ranges:Vf(t,t.includes("sve-lock")?Yl(t):[])}),Go.ranges}function xa(t,e){const o=new gt,n=ei(t.doc.toString());for(let s=0;s<n.length;s+=2)o.add(n[s],n[s+1],e);return o.finish()}let Ue=null;function Gf(){if(Ue)return Ue;const t=nt.mark({class:"sve-dock-locked"}),e=vt.define({create:n=>xa(n,t),update:(n,s)=>s.docChanged?xa(s.state,t):n,provide:n=>I.decorations.from(n)}),o=I.baseTheme({".sve-dock-locked":{opacity:".55",borderRadius:".1875rem",backgroundColor:"rgba(127,127,127,.14)",cursor:"not-allowed"}});return Ue={extensions:[e,o,ae.changeFilter.of(n=>Kf(s=>n.isUserEvent(s))?ei(n.startState.doc.toString()):!0)]},Ue}function Xf(t,e){if(!t||!e)return t??null;const o=e.mapPos(t.from,1),n=e.mapPos(t.to,-1);return n>o?{from:o,to:n}:null}function Yf(){if(a.cssGhostUi)return a.cssGhostUi;const t=nt.mark({class:"sve-css-ghost"}),e=o=>{const n=new gt;if(!a.lastWin)return n.finish();try{for(const s of Fd(o.doc.toString(),ht(a.lastWin)))n.add(s.from,s.to,t)}catch{}return n.finish()};return a.cssGhostUi=vt.define({create:o=>e(o),update:(o,n)=>n.docChanged?e(n.state):o,provide:o=>I.decorations.from(o)}),a.cssGhostUi}let Ke=null,so=null;function Zf(){if(Ke)return Ke;so=Gt.define();const t=nt.line({class:"sve-css-id"}),e=o=>{const n=new gt;if(!a.lastWin||!a.cssValues)return n.finish();try{const s=o.doc;for(const r of Je(s.toString(),ht(a.lastWin),a.cssSize)){const i=s.lineAt(Math.min(r.from,s.length)).number,l=s.lineAt(Math.min(Math.max(r.to-1,r.from),s.length)).number;for(let c=i;c<=l;c+=1)n.add(s.line(c).from,s.line(c).from,t)}}catch{}return n.finish()};return Ke=vt.define({create:o=>e(o),update:(o,n)=>n.docChanged||n.effects.some(s=>s.is(so))?e(n.state):o,provide:o=>I.decorations.from(o)}),Ke}function Lo(){so&&v.css&&v.css.dispatch({effects:so.of(null)})}function Jf(){return a.htmlPartialUi||(a.htmlPartialUi=Zl({Decoration:nt,StateField:vt,StateEffect:Gt,RangeSetBuilder:gt,EditorView:I})),a.htmlPartialUi}function Qf(){return a.htmlAntlersUi||(a.htmlAntlersUi=of({Decoration:nt,StateField:vt,RangeSetBuilder:gt,EditorView:I})),a.htmlAntlersUi}function tp(){return a.htmlClassTokenUi||(a.htmlClassTokenUi=Ic({Decoration:nt,StateField:vt,StateEffect:Gt,RangeSetBuilder:gt,EditorView:I})),a.htmlClassTokenUi}function oi(t,e,o){v[e]?.destroy();const n=co.of([{key:"Mod-s",run:()=>(V(t.document),!0)}]);v[e]=new I({state:ae.create({doc:"",extensions:[bs(),ys(),ks(),Su(e),Bi(e),$s(),ws({tooltipClass:()=>"sve-tw-complete"}),...e==="html"?[Te.data.of({autocomplete:fc(t)}),Te.data.of({autocomplete:Jd(t)}),Qd(t),pc(Es,t)]:[],...e==="html"?[...$c(),Cc()]:[],...e==="css"?[Bs(),Yf(),Zf()]:[],co.of([...xs,...e==="html"?[{key:"Tab",run:Tc}]:[],_s,...Ss,...As,...Cs]),n,I.lineWrapping,...e==="html"||e==="css"?Jf().extensions:[],...e==="html"?Qf().extensions:[],...e==="html"?qf(t).extensions:[],...e==="html"?Gf().extensions:[],...e==="html"?tp().extensions:[],Qt[e].of(ae.readOnly.of(!!a.lastLocked)),te[e].of(I.editable.of(!a.lastLocked)),I.updateListener.of(s=>{e==="html"&&s.docChanged&&a.htmlAll&&!a.htmlScopeActive&&(a.htmlFocus=Xf(a.htmlFocus,s.changes)),e==="html"&&s.docChanged&&!a.applying&&(wr(),wn("dock:html-changed")),e==="css"&&s.docChanged&&!a.applying&&$r(),s.docChanged&&X(t),e==="css"&&(s.docChanged||s.selectionSet)&&P(t),e==="css"&&s.docChanged&&!a.applying&&Ut(t),e==="html"&&(s.docChanged||s.selectionSet)&&(Oe(t),He(t),ot(t),a.applying||me(t))}),I.domEventHandlers({click:(s,r)=>(e==="html"&&r===v.html&&Lr(t),!1)}),...hl(T,{height:"auto",background:"#1E1E21",scroller:{overflow:"visible",height:"auto",minHeight:0},extraTags:s=>[{tag:s.tagName,color:"#4ec9b0"},{tag:s.attributeName,color:"#9cdcfe"},{tag:s.attributeValue,color:"#ce9178"},{tag:s.angleBracket,color:"#808080"}]})]}),parent:o})}function ni(t){if(!t||t.querySelector(".cm-editor"))return;t.replaceChildren();const e=t.ownerDocument.createElement("span");e.style.cssText="width:16px;height:16px;margin:12px;border:2px solid #858585;border-right-color:transparent;border-radius:50%;display:block;animation:sve-cm-wait .6s linear infinite",t.appendChild(e)}function ht(t){return Sn(t).map(e=>({handle:e.handle,base:e.base,direction:e.direction,max:e.max,min_px:e.min_px,media:e.media,media_px:e.media_px,label:e.label}))}function Fo(t,e){return ht(t).find(o=>o.handle===e)||null}function he(t=a.cssState){return t?t==="before"||t==="after"?`::${t}`:`:${t}`:""}function Ut(t,e=!1){const o=v.css;if(!o||!uo||!fo)return;const n=o.state.doc.toString(),s=`${a.cssValues?"1":"0"}|${a.cssSize}|${_o(n).map(f=>`${f.from}-${f.to}`).join(",")}`;if(!e&&s===a.cssFoldSig)return;a.cssFoldSig=s;const r=ht(t),i=new Map,l=[...Md(n,r,a.cssSize),...a.cssValues?[]:Je(n,r,a.cssSize).map(f=>({from:f.from,to:f.to}))];for(const f of l)f.to>f.from&&i.set(`${f.from}:${f.to}`,{from:f.from,to:f.to});const c=[],d=new Set;Ps(o.state).between(0,n.length,(f,p)=>{const m=`${f}:${p}`;d.add(m),!i.has(m)&&a.cssOwnFolds.has(m)&&c.push(fo.of({from:f,to:p}))});for(const[f,p]of i)d.has(f)||c.push(uo.of(p));a.cssOwnFolds=new Set(i.keys()),c.length&&o.dispatch({effects:c})}function Ce(t,e){const o=a.cssFull||e;return/(max|min)-width/i.test(o)&&!/width\s*[<>]/i.test(o)&&t.media_px||t.media}function ep(t,e){const o=v.css;if(!o||o.state.readOnly)return;const n=ht(t),s=Fo(t,e),r=o.state.doc.toString();if(!s||s.base){const f=o.state.selection.main.head,p=_o(r).find(m=>f>=m.from&&f<=m.to);p&&o.dispatch({selection:{anchor:p.from},scrollIntoView:!0});return}const i=So(r,n,e);if(i.length){const f=i[0],p=Math.min(f.bodyTo,f.bodyFrom+(r.slice(f.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);o.dispatch({selection:{anchor:p},scrollIntoView:!0});return}const l=Ce(s,r),c=es(o,r),d=`

${c.indent}@media ${l} {
${c.indent}    
${c.indent}}${c.suffix}`;o.dispatch({changes:{from:c.at,to:c.at,insert:d},selection:{anchor:c.at+d.lastIndexOf("    ")+4},scrollIntoView:!0})}function es(t,e){const o=_o(e);if(o.length){const i=o[o.length-1];return{at:i.to,indent:kt(e,i.from),suffix:""}}const n=i=>({at:i.to,indent:kt(e,i.to)||`${kt(e,i.open)}    `,suffix:`
${kt(e,i.open)}`}),s=De();if(s)return n(s);const r=op(e);return r?n(r):{at:e.length,indent:"",suffix:""}}function op(t){const e=String(t||"");let o=null,n=0,s=0;for(;n<e.length;){if(e[n]==="}"||e[n]===";"){n+=1,s=n;continue}if(e[n]!=="{"){n+=1;continue}const r=go(e,n);if(r===-1||o||(o=e.slice(s,n).trim().startsWith("@")?null:{from:s,open:n,to:r},!o))return null;n=r+1,s=n}return o}function np(t,e){const o=e===a.cssSize?"":e;a.cssSize=o,G(t,Oo,o),it("lp:set-device",{win:t,key:o?kl(o,t):"Responsive"}),o&&ep(t,o),a.cssValues&&os(t),Ut(t,!0),Lo(),ot(t),P(t)}function sp(t,e){a.cssState=Io.includes(e)?e:"",G(t,ao,a.cssState),w(t.document),ot(t),P(t)}function ap(t,e){const o=t.document;w(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=x,o.body.appendChild(n),z(t,e,n),n._sveApp=W(st,n,{kind:"choices",choices:[{value:"",label:h(t,"css_state_none"),active:!a.cssState},...Io.map(s=>({value:s,label:he(s),active:s===a.cssState}))],onPick:s=>sp(t,s)})}function ot(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-css-head]");if(!o)return;const n=Bt(),s=ht(t),r=v.css?.state.doc.toString()??"";C.tag=n?.tag||"",C.scope=Jl(n?St().slice(n.from,n.openTo):"")||"",e.toggleAttribute("data-sve-css-unnamed",a.styleMode!=="tw"&&!C.scope);const i=C.scope,l=jn(t,i);C.scopeElsewhere=[...new Set(l.map(c=>String(c.file).replace(/^.*\//,"")))],C.scopeElsewhereTitle=C.scopeElsewhere.length?`${h(t,"class_defined_in",{file:C.scopeElsewhere.join(", ")})} — ${h(t,"class_defined_import")}`:"",C.onScopeImport=()=>{Hn(t,i)&&ot(t)},i&&!br()&&Dn(t).then(()=>ot(t)),C.note=a.cssPane==="empty"?h(t,"css_pane_empty"):"",C.canEdit=!a.lastLocked,C.onTag=c=>hc(t,c.currentTarget,n),C.state=a.cssState,C.stateLabel=a.cssState?he(a.cssState):h(t,"css_state"),C.onState=c=>ap(t,c.currentTarget),C.onSize=c=>np(t,c),C.sizes=[{key:"",label:h(t,"tw_size_all"),title:h(t,"css_size_all_title"),active:!a.cssSize},...s.map(c=>{const d=c.base||So(r,s,c.handle).length>0;return{key:c.handle,label:c.label,title:c.base?h(t,"css_size_base_title"):`@media ${c.media}${d?"":`  ·  ${h(t,"css_size_new")}`}`,active:a.cssSize===c.handle}})],o._sveMounted||(o._sveMounted=!0,Ee(o,zd))}mo("lp:device",t=>{const e=a.lastWin;if(!e||!cs(e.document))return;const o=Sn(e).find(n=>n.device===t)?.handle||"";o!==a.cssSize&&(a.cssSize=o,G(e,Oo,o),Ut(e,!0),Lo(),ot(e),P(e))});function rp(t){const e=Math.max(0,Math.round(Date.now()/1e3-t)),o=new Date(t*1e3).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});let n=o;try{const s=new Intl.RelativeTimeFormat(void 0,{numeric:"auto"});e<90?n=s.format(-e,"second"):e<5400?n=s.format(-Math.round(e/60),"minute"):e<86400?n=s.format(-Math.round(e/3600),"hour"):n=s.format(-Math.round(e/86400),"day")}catch{}return`${n} · ${o}`}function si(t,e){return t.fetch(e,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}})}async function ip(t,e){const o=t.document,n=mt();if(w(o),!n)return;let s=[];try{const i=await si(t,`/!/sve/section-template/history?type=${encodeURIComponent(n)}`);i.ok&&(s=(await i.json())?.entries||[])}catch{s=[]}if(!o.getElementById(u)||!o.contains(e))return;e.setAttribute("data-open","");const r=o.createElement("div");r.id=x,o.body.appendChild(r),z(t,e,r),r._sveApp=W(st,r,{kind:"choices",choices:s.length?s.map(i=>({value:i.id,label:rp(i.at)})):[{value:"",label:h(t,"code_dock_history_empty")}],onPick:i=>{w(o),i&&lp(t,n,i)}})}async function lp(t,e,o){if(ft())return;let n=null;try{const s=await si(t,`/!/sve/section-template/history/entry?type=${encodeURIComponent(e)}&id=${encodeURIComponent(o)}`);s.ok&&(n=await s.json())}catch{n=null}!n||ft()||(Ft({html:n.html??"",css:n.css??"",js:n.js??""},a.lastLocked),X(t),me(t))}function zt(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-code-strip]");if(!e)return;e.hidden=a.styleMode!=="tw";const o=cr(t);e.innerHTML=il,e.title=h(t,o?"tw_strip_on":"tw_strip_off"),e.setAttribute("aria-label",e.title),e.setAttribute("aria-pressed",o?"true":"false")}function ai(t,e){const o=e.querySelector("[data-sve-code-strip]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),mc(t,!cr(t)),zt(t),vc(t)}),zt(t))}function ri(t,e){const o=e.querySelector("[data-sve-code-history]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=ll,o.title=h(t,"code_dock_history"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),o.hasAttribute("data-open")){w(t.document);return}ip(t,o)}))}function cp(){return a.styleMode}function dp(t){return a.styleMode!=="tw"?null:pp()||up()||(fp()?null:Bt())}function up(){const t=Bo(),e=t?tc(t.html,t.pos):null;return e?{kind:"component",tagCall:!0,src:e.src,label:e.src,from:e.from,to:e.to,openTo:e.to,path:`a${e.from}:${e.src}`}:null}function fp(){const t=Bo();return!!t&&!!ec(t.html,t.pos)}function Bo(){const t=v.html;if(!t)return null;const e=a.htmlScopeActive&&!!a.htmlFocus,o=e?a.htmlFull:t.state.doc.toString(),n=e?a.htmlFocus.from:0;return{html:o,pos:n+t.state.selection.main.from}}function pp(){const t=Bo();return!t||!Ql(t.html,t.pos)?null:re(Qa(t.html),new Set).find(e=>e.kind==="component"&&e.from<=t.pos&&t.pos<e.to)||null}function Bt(t){const e=Bo();if(!e)return null;const{html:o,pos:n}=e,s=re(Le(o),new Set);let r=null;for(const i of s)i.from<=n&&n<i.to&&(r=i);return r}function me(t){a.styleMode==="tw"&&gc(t,dp())}function Po(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-values-mode]");if(!e||!o)return;e.setAttribute("data-sve-values",a.cssValues?"on":"off");const n=t.document.createElement("span");n.textContent=h(t,"code_dock_values"),o.innerHTML=dl,o.appendChild(n),o.title=h(t,a.cssValues?"code_dock_values_off":"code_dock_values_on"),o.setAttribute("aria-label",o.title),o.setAttribute("aria-pressed",a.cssValues?"true":"false")}function os(t){const e=v.css;if(!e||e.state.readOnly)return;const o=ht(t),n=e.state.doc.toString(),s=Je(n,o,a.cssSize);if(e.focus(),s.length){const m=s[0],y=Math.min(m.bodyTo,m.bodyFrom+(n.slice(m.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);e.dispatch({selection:{anchor:y},scrollIntoView:!0});return}const r=Fo(t,a.cssSize);if(!r||r.base){const m=`#id-{{ id }} {
    `;e.dispatch({changes:{from:0,to:0,insert:`${m}
}

`},selection:{anchor:m.length},scrollIntoView:!0});return}const i=So(n,o,a.cssSize)[0];if(i){const m=`${kt(n,i.from)}    `,y=`
${m}#id-{{ id }} {
${m}    `;e.dispatch({changes:{from:i.bodyFrom,to:i.bodyFrom,insert:`${y}
${m}}
`},selection:{anchor:i.bodyFrom+y.length},scrollIntoView:!0});return}const l=es(e,n),c=`${l.indent}    `,d=Je(n,o,"").some(m=>l.at>m.bodyFrom&&l.at<=m.bodyTo),f=d?`

${l.indent}@media ${Ce(r,n)} {
${c}`:`

${l.indent}@media ${Ce(r,n)} {
${c}#id-{{ id }} {
${c}    `,p=d?`
${l.indent}}${l.suffix}`:`
${c}}
${l.indent}}${l.suffix}`;e.dispatch({changes:{from:l.at,to:l.at,insert:`${f}${p}`},selection:{anchor:l.at+f.length},scrollIntoView:!0})}function ii(t,e){a.cssValues=!!e,G(t,Wo,a.cssValues?"1":"0"),w(t.document),a.cssOpenTool="",Po(t),U(),pt(),a.cssValues&&os(t),Ut(t,!0),Lo(),ot(t),P(t)}function _a(t,e){a.cssAll=!!e,w(t.document),a.cssOpenTool="",qt(t),U(),pt(),Ut(t,!0),ot(t),P(t)}function li(t,e){const o=Vn();e?(o.html&&sn(t,!0),o.css&&_a(t,!0)):(sn(t,!1),a.cssAll&&_a(t,!1)),qt(t)}function ci(t){li(t,!_r())}function Re(t){const e=t?.document.getElementById(u);if(!e)return;const o=a.styleMode==="tw";e.setAttribute("data-sve-style",a.styleMode);const n=e.querySelector("[data-sve-css-label]");n&&(n.textContent=o?h(t,"code_dock_style_tw"):h(t,"code_dock_css"));const s=e.querySelector("[data-sve-style-mode]");if(!s)return;const r=t.document.createElement("span");r.textContent=o?h(t,"code_dock_style_tw"):h(t,"code_dock_css"),s.innerHTML=o?ul:cl,s.appendChild(r),s.title=h(t,o?"code_dock_style_to_css":"code_dock_style_to_tw"),s.setAttribute("aria-label",s.title),s.setAttribute("aria-pressed",o?"true":"false")}function ns(t){t?.document.getElementById(u),w(t.document),tn(t),a.cssOpenTool="",a.cssOpenMenu="",a.styleMode==="tw"&&a.cssValues&&(a.cssValues=!1,G(t,Wo,"0")),Re(t),Po(t),qt(t),zt(t),a.cssToolRow?.(),a.styleMode==="tw"&&(a.htmlScopePref=!0,G(t,We,"1"),eo(t,!0)),me(t),He(t),P(t)}const Oo="sve-css-size",ao="sve-css-state",Io=["hover","focus","focus-visible","active","disabled","before","after"],Sa="data-sve-scroll-edge";function ss(t){if(!t||t._sveEdges)return;t._sveEdges=!0;const e=()=>mp(t),o=new ResizeObserver(e),n=()=>{for(const s of t.children)o.observe(s)};t.addEventListener("scroll",e,{passive:!0}),o.observe(t),n(),new MutationObserver(()=>{n(),e()}).observe(t,{childList:!0}),e()}function hp(t,e){if(!t||t._sveEdgesIn)return;t._sveEdgesIn=!0;const o=()=>t.querySelectorAll(e).forEach(ss);o(),new MutationObserver(o).observe(t,{childList:!0,subtree:!0})}function mp(t){const e=t.scrollWidth-t.clientWidth,o=t.scrollLeft>1,n=e-t.scrollLeft>1,s=o&&n?"both":o?"left":n?"right":"";s?t.setAttribute(Sa,s):t.removeAttribute(Sa)}const vp='<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.6 10.2C4.6 9.4 4 8.3 4 7a4 4 0 1 1 8 0c0 1.3-.6 2.4-1.6 3.2-.4.3-.6.8-.6 1.3V12H6.2v-.5c0-.5-.2-1-.6-1.3z"/><path d="M6.4 14h3.2"/></svg>';function gp(t,e){const o=e.querySelector("[data-sve-help-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=ze(t,o,"data-sve-help-btn",vp,h(t,"code_dock_help_off")),s=()=>{const i=Yo(t),l=h(t,i?"code_dock_help_on":"code_dock_help_off");n.setAttribute("aria-pressed",i?"true":"false"),n.title=l,n.setAttribute("aria-label",l)};n.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation(),El(t,!Yo(t))}),s();const r=za(i=>{if(!n.isConnected){r();return}i===t&&s()})}const bp={"data-sve-data-search":""},yp=["placeholder","aria-label","onKeydown"],kp={key:0,"data-sve-data-empty":""},xp={key:1,"data-sve-data-empty":""},_p=["data-cursor","title","onMouseenter","onClick"],Sp={"data-sve-data-name":""},wp={"data-sve-data-parent":""},$p={key:0,"data-sve-data-value":""},Cp={__name:"CodeDockSnippets",props:{title:{type:String,default:""},placeholder:{type:String,default:""},emptyText:{type:String,default:""},loadingText:{type:String,default:""},loading:{type:Boolean,default:!1},rows:{type:Array,required:!0},saveLabel:{type:String,required:!0},onPick:{type:Function,required:!0},onSave:{type:Function,required:!0}},setup(t){const e=t,o=It(""),n=It(null),s=It(null),r=It(-1),i=It(!1),l=ke(()=>o.value.trim().toLowerCase()),c=ke(()=>{const b=l.value;return e.rows.filter(k=>!b||k.name.toLowerCase().includes(b)||String(k.hint||"").toLowerCase().includes(b))});Ia(()=>Xo(()=>n.value?.focus()));function d(b){return["html","css","js"].filter(k=>b[k]).map(k=>k.toUpperCase()).join(" · ")}function f(b){i.value=!0;const k=c.value.length;if(!k){r.value=-1;return}const L=r.value+b;r.value=L<0?-1:Math.min(L,k-1),Xo(()=>p())}function p(){const b=s.value?.querySelector("[data-cursor]"),k=s.value;if(!b||!k)return;const L=b.offsetTop,at=L+b.offsetHeight;L<k.scrollTop?k.scrollTop=L:at>k.scrollTop+k.clientHeight&&(k.scrollTop=at-k.clientHeight)}function m(b){i.value||(r.value=b)}function y(){const b=r.value>=0?c.value[r.value]:null;b&&e.onPick(b)}return(b,k)=>(_(),S(q,null,[g("div",bp,[k[8]||(k[8]=g("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[g("circle",{cx:"11",cy:"11",r:"7"}),g("path",{d:"m20 20-3.5-3.5"})],-1)),Da(g("input",{ref_key:"input",ref:n,"data-sve-data-input":"","onUpdate:modelValue":k[0]||(k[0]=L=>o.value=L),type:"text",placeholder:t.placeholder,"aria-label":t.title,onInput:k[1]||(k[1]=L=>r.value=-1),onKeydown:[k[2]||(k[2]=Xt(F(L=>f(1),["prevent"]),["down"])),k[3]||(k[3]=Xt(F(L=>f(-1),["prevent"]),["up"])),Xt(F(y,["prevent"]),["enter"]),k[4]||(k[4]=Xt(F(()=>{},["stop"]),["escape"]))]},null,40,yp),[[ja,o.value]])]),t.loading?(_(),S("div",kp,A(t.loadingText),1)):c.value.length?N("",!0):(_(),S("div",xp,A(t.emptyText),1)),g("div",{ref_key:"rowsEl",ref:s,"data-sve-data-rows":"",onMousemove:k[5]||(k[5]=L=>i.value=!1)},[(_(!0),S(q,null,dt(c.value,(L,at)=>(_(),S("button",{key:L.name,type:"button","data-sve-data-option":"","data-cursor":at===r.value?"":void 0,title:L.hint||L.name,onMouseenter:M=>m(at),onClick:F(M=>t.onPick(L),["prevent","stop"])},[g("span",Sp,A(L.name),1),g("span",wp,A(d(L)),1),L.hint?(_(),S("span",$p,A(L.hint),1)):N("",!0)],40,_p))),128))],544),g("button",{type:"button","data-sve-snippet-save":"",onMousedown:k[6]||(k[6]=F(()=>{},["prevent"])),onClick:k[7]||(k[7]=F((...L)=>t.onSave&&t.onSave(...L),["prevent","stop"]))},A(t.saveLabel),33)],64))}},ro="    ";function Tp(t,e){if(t.startsWith("/*",e)){const o=t.indexOf("*/",e+2);return o===-1?t.length:o+2}return e}function pn(t){return String(t||"").replace(/\/\*[\s\S]*?\*\//g,"")}function io(t){const e=String(t||"").replace(/\r\n?/g,`
`).split(`
`);for(;e.length&&!e[0].trim();)e.shift();for(;e.length&&!e[e.length-1].trim();)e.pop();const o=e.filter(s=>s.trim()).map(s=>/^[ \t]*/.exec(s)[0].length),n=o.length?Math.min(...o):0;return e.map(s=>s.trim()?s.slice(n).replace(/\s+$/,""):"").join(`
`)}function hn(t,e){return io(t).split(`
`).map(o=>o?e+o:"").join(`
`)}function mn(t){const e=String(t||""),o=[];let n=0,s=0;const r=(i,l,c)=>{const d=e.slice(i,l),f=pn(d);if(!f.trim())return;const p=d.length-d.replace(/^[\s]*(?:\/\*[\s\S]*?\*\/\s*)*/,"").length,m=i+p,y=f.indexOf(":"),b=y===-1?"":f.slice(0,y).trim();if(/^-{0,2}[a-zA-Z_][\w-]*$/.test(b)){o.push({kind:"decl",prop:b,value:f.slice(y+1).trim(),from:m,to:c?l+1:l});return}o.push({kind:"other",from:m,to:c?l+1:l})};for(;n<e.length;){const i=Tp(e,n);if(i!==n){n=i;continue}const l=e[n];if(l==='"'||l==="'"){let c=n+1;for(;c<e.length&&e[c]!==l;)c+=e[c]==="\\"?2:1;n=c+1;continue}if(l===";"){r(s,n,!0),n+=1,s=n;continue}if(l==="{"){const c=go(e,n);if(c===-1)break;const d=e.slice(s,n),f=d.length-d.replace(/^[\s]*(?:\/\*[\s\S]*?\*\/\s*)*/,"").length;o.push({kind:"block",prelude:pn(d).trim().replace(/\s+/g," "),from:s+f,open:n,close:c,to:c+1}),n=c+1,s=n;continue}n+=1}return r(s,e.length,!1),o}function Ap(t){return/^[&@]/.test(t)}function Ep(t){const e=String(t||"");if(!pn(e).trim())return{problem:"empty"};if(!An(e))return{problem:"unbalanced"};const o=mn(e),n=o.filter(i=>i.kind==="block"),s=o.some(i=>i.kind!=="block"),r=n.filter(i=>!Ap(i.prelude));if(!r.length)return{body:io(e)};if(r.length===1&&n.length===1&&!s){const[i]=r;return{body:io(e.slice(i.open+1,i.close))}}return{problem:"rules"}}function Mp(t,e){return t.startsWith("--")||e.startsWith("--")?t===e:t.toLowerCase()===e.toLowerCase()}function Lp(t,e){const o=n=>n.replace(/\s+/g,"").toLowerCase();return o(t)===o(e)}function di(t,e){const o=t.lastIndexOf(`
`,e-1)+1;return(t.slice(o,e).match(/^[ \t]*/)||[""])[0]}function Fp(t,e,o){for(const n of e){const s=di(t,n.from);if(t.lastIndexOf(`
`,n.from-1)!==-1&&s.length>o.length)return s}return o+ro}function ui(t,e,{parentIndent:o=""}={}){const n=String(t||""),s=mn(n),r=mn(String(e||"")),i=Fp(n,s,o),l=i.length>o.length?i.slice(o.length):ro,c=[],d=[],f=[];for(const M of r){if(M.kind==="decl"){const O=s.find(ve=>ve.kind==="decl"&&Mp(ve.prop,M.prop));O?c.push({from:O.from,to:O.to,insert:`${M.prop}: ${M.value};`}):d.push(`${M.prop}: ${M.value};`);continue}if(M.kind==="block"){const O=s.find(Vs=>Vs.kind==="block"&&Lp(Vs.prelude,M.prelude)),ve=String(e).slice(M.open+1,M.close);O?c.push({from:O.open+1,to:O.close,insert:ui(n.slice(O.open+1,O.close),ve,{parentIndent:di(n,O.from)})}):f.push(`${M.prelude} {
${hn(ve,i+l)}
${i}}`)}}if(!c.length&&!d.length&&!f.length)return n;const p=[...s].reverse().find(M=>M.kind==="decl"),m=s.find(M=>M.kind==="block"),y=s[s.length-1],b=d.map(M=>`
${i}${M}`).join(""),k=f.map(M=>`

${i}${M}`).join("");if(!y)c.push({from:0,to:0,insert:b?b+k:k.slice(1)});else{if(b)if(p)c.push({from:p.to,to:p.to,insert:b});else{const M=m||s[0],O=n.lastIndexOf(`
`,M.from-1)+1;c.push({from:O,to:O,insert:`${b.slice(1)}

`})}k&&c.push({from:y.to,to:y.to,insert:k})}c.sort((M,O)=>O.from-M.from||O.to-M.to);let L=n;for(const M of c)L=L.slice(0,M.from)+M.insert+L.slice(M.to);return`${L.match(/\n[ \t]*$/)?L.replace(/\s+$/,""):L.replace(/[ \t]+$/,"")}
${o}`}function Bp(t,{state:e="",media:o=""}={}){let n=io(t);return e&&(n=`&${e} {
${hn(n,ro)}
}`),o&&(n=`@media ${o} {
${hn(n,ro)}
}`),n}const as="site.css",fi={"X-Requested-With":"XMLHttpRequest",Accept:"application/json"};async function Pp(t){const e=await t.fetch(`/!/sve/site-css/file?path=${encodeURIComponent(as)}&kind=css`,{credentials:"same-origin",headers:fi});if(!e.ok)throw new Error(String(e.status));return String((await e.json()).css||"")}async function Op(t,e){const o=await t.fetch("/!/sve/site-css?kind=css",{method:"POST",credentials:"same-origin",headers:{...fi,"X-CSRF-TOKEN":ho(t),"Content-Type":"application/json"},body:JSON.stringify({path:as,css:e})});if(!o.ok)throw new Error(String(o.status));return o.json()}function Ip(t){return[Ml(t),...Ll(t).map(e=>e.document)].filter(Boolean)}async function Dp(t,e,o,n){const s=await e(t,o,n),r=new Set(Lc(s));return n.filter(i=>r.has(i))}function tt(t,e,o,n){t.Statamic?.$toast?.[e]?.(h(t,o,n))}async function jp(t,e,o){if(Fc(e)){tt(t,"error","tw_utility_bad_name");return}let n;try{n=await Pp(t)}catch{tt(t,"error","tw_utility_failed");return}if(Bc(n).has(e)&&!t.confirm(h(t,"tw_utility_replace",{name:e})))return;const{compileDraft:s}=await xn(async()=>{const{compileDraft:m}=await import("./tw-compile-BqsL3ULf.js");return{compileDraft:m}},__vite__mapDeps([0,1]),import.meta.url),r=await Dp(t,s,na(n),o);if(!r.length){tt(t,"error","tw_utility_no_classes");return}const i=o.filter(m=>!r.includes(m)),l=Pc(n,{[e]:`@apply ${r.join(" ")};`});let c="";try{c=await s(t,na(l),[e])}catch(m){tt(t,"error","tw_utility_wont_compile",{reason:m?.message||String(m)});return}if(!c.trim()){tt(t,"error","tw_utility_wont_compile",{reason:h(t,"tw_utility_reason_empty")});return}const d=Ip(t);oa(d,[e],c);let f;try{f=await Op(t,l)}catch{oa(d,[],""),tt(t,"error","tw_utility_failed");return}t.dispatchEvent(new CustomEvent("sve:site-css-saved",{detail:{path:as}})),yc(t,r,e);const p=f?.build;p?.ok&&p.css?d.forEach(m=>Mc(m,p.css)):p&&tt(t,"error","tw_utility_not_built",{name:e,reason:h(t,`theme_utilities_reason_${p.reason||"error"}`)}),tt(t,"success",i.length?"tw_utility_saved_left":"tw_utility_saved",{name:e,names:i.join(" ")})}function Hp(t){if(!xl(t,"site_css")){tt(t,"error","tw_utility_no_site_css");return}const e=bc();if(!e){tt(t,"error","tw_utility_no_tag");return}if(!e.raws.length){tt(t,"error","tw_utility_no_classes");return}const o=En(t.document,nr,{heading:h(t,"tw_utility_new"),nameLabel:h(t,"snippet_name"),placeholder:h(t,"tw_utility_name_placeholder"),value:"",cancelLabel:h(t,"cancel"),saveLabel:h(t,"tw_utility_create"),onOk:n=>{o.dismiss(),jp(t,String(n||"").trim(),e.raws)}})}const Rp="/!/sve/snippets",pi="/!/sve/snippet",zp='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>',Wp='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/></svg>',Np={"X-Requested-With":"XMLHttpRequest",Accept:"application/json"};async function rs(t,e,o={}){const n=await t.fetch(e,{credentials:"same-origin",...o,headers:{...Np,...o.headers||{}}});if(!n.ok){const s=new Error(String(n.status));throw s.status=n.status,s}return n.json()}async function qp(t){const e=await rs(t,Rp);return Array.isArray(e?.items)?e.items:[]}function Vp(t,e){return rs(t,`${pi}?name=${encodeURIComponent(e)}`)}function Up(t,e){return rs(t,pi,{method:"POST",headers:{"X-CSRF-TOKEN":ho(t),"Content-Type":"application/json"},body:JSON.stringify(e)})}function Kp(t,e){return e==="css"?t.filter(o=>o.kind==="css"):t}function Gp(t){const e=v.html;if(!e||e.state.readOnly)return!1;const o=e.state.doc.lineAt(e.state.selection.main.head),n=o.text.trim()?J(o.text):pe(e,o)||J(o.text),s=bo(t.trim(),n);return Eo(s,s.length),j(),!0}function hi(t,e,o){const n=v.css;if(!n||n.state.readOnly)return!1;const s=n.state.doc.toString(),r=Fe(s,e);if(!r)return!1;const i=a.cssSize?Fo(t,a.cssSize):null;let l="";if(i&&!i.base){const f=So(s,ht(t),i.handle).find(p=>p.from>r.brace&&p.to<=r.close);l=f?f.query:Ce(i,s)}const c=s.slice(r.brace+1,r.close),d=ui(c,Bp(o,{state:he(),media:l}),{parentIndent:kt(s,r.from)});return d!==c&&n.dispatch({changes:{from:r.brace+1,to:r.close,insert:d}}),n.focus(),!0}function Xp(t,e){const o=t.document,n=o.getElementById(u),s=n?.querySelector('[data-sve-snippet-btn][data-sve-snippet-pane="css"]')||n?.querySelector("[data-sve-snippet-btn]");if(!s)return;w(o);const r=o.createElement("div");r.id=x,o.body.appendChild(r),z(t,s,r),r._sveApp=W($o,r,{label:h(t,"snippet_css_class_name"),placeholder:h(t,"code_dock_css_class_placeholder"),onClose:()=>w(o),onAdd:i=>{if(w(o),!Tr(i)){t.Statamic?.$toast?.error(h(t,"snippet_css_pick"));return}X(t),hi(t,Be(),e)}})}function Yp(t,e){if(!v.css||v.css.state.readOnly||a.lastLocked)return;if(U(),a.cssPane!=="tree"&&a.cssPane!=="empty"){t.Statamic?.$toast?.error(h(t,"snippet_css_pick"));return}const o=Be();if(!o){Xp(t,e);return}hi(t,o,e)||t.Statamic?.$toast?.error(h(t,"snippet_css_pick"))}async function Zp(t,e){let o;try{o=await Vp(t,e)}catch{t.Statamic?.$toast?.error(h(t,"snippet_read_failed"));return}const n=typeof o?.html=="string"?o.html:"",s=typeof o?.css=="string"?o.css:"",r=typeof o?.js=="string"?o.js:"";if(o?.kind==="css"){Yp(t,s);return}n.trim()&&Gp(n),(s.trim()||r.trim())&&ds(t,{css:s,js:r})}function is(t){const e=t?.state.selection.main;if(!e||e.empty)return"";const o=t.state.doc.lineAt(e.from),n=o.text.slice(0,e.from-o.from).trim()===""?o.from:e.from;return t.state.doc.sliceString(n,e.to)}function Jp(){const t=is(v.css);let e=t,o=Qo(t);if(!t.trim()){const s=v.css?.state.doc.toString()??"",r=a.cssPane==="tree"?Be():"",i=r?Fe(s,r):null;e=i?s.slice(i.from,i.to):s,o=i?r:Qo(s)}const n=Ep(e);return n.problem?{problem:n.problem}:{kind:"css",html:"",css:n.body,js:"",name:o}}function Qp(t){if(t==="css")return Jp();const e=is(v.html),o=String(it("dock:html")||""),n=String(it("dock:css")||"");if(e.trim()){const s=o.includes(e)?o.replace(e,""):o;return{kind:"html",html:ta(e),css:kc(n,e,s).move.trim(),js:"",name:wa(e)}}return{kind:"html",html:ta(o),css:n.trim(),js:String(it("dock:js")||"").trim(),name:wa(o)}}function wa(t){const e=String(t||"").match(/<([a-zA-Z][\w-]*)([^>]*)>/);if(!e)return"";const o=e[2].match(/\bclass="([^"]*)"/);return(o?o[1].split(/\s+/).find(s=>/^[a-zA-Z][\w-]*$/.test(s)):"")||e[1]}async function mi(t,e,o,n=!1){try{const s=await Up(t,{name:e,kind:o.kind,html:o.html,css:o.css,js:o.js,replace:n});t.Statamic?.$toast?.success(h(t,"snippet_saved",{name:s?.name||e}))}catch(s){if(s?.status===409&&!n){t.confirm(h(t,"snippet_replace",{name:e}))&&await mi(t,e,o,!0);return}t.Statamic?.$toast?.error(h(t,"snippet_failed"))}}const th={empty:"snippet_empty",unbalanced:"snippet_css_unbalanced",rules:"snippet_css_one_rule"};function eh(t,e){const o=Qp(e);if(o.problem){t.Statamic?.$toast?.error(h(t,th[o.problem]||"snippet_empty"));return}if(!o.html.trim()&&!o.css.trim()&&!o.js.trim()){t.Statamic?.$toast?.error(h(t,"snippet_empty"));return}const n=En(t.document,nr,{heading:h(t,"snippet_new"),nameLabel:h(t,"snippet_name"),placeholder:h(t,"snippet_name_placeholder"),value:o.name,cancelLabel:h(t,"cancel"),saveLabel:h(t,"snippet_create"),onOk:s=>{n.dismiss(),mi(t,s,o)}})}function oh(t,e,o){const n=t.document;D(n),w(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=_t,s.setAttribute("data-sve-data-menu",""),n.body.appendChild(s);const r=!!is(o==="css"?v.css:v.html).trim(),i=(l,c)=>{n.getElementById(_t)&&(s._sveApp?.unmount(),s._sveApp=W(Cp,s,{title:h(t,"code_dock_snippets"),placeholder:h(t,"code_dock_snippets_search"),emptyText:h(t,"snippet_none"),loadingText:h(t,"code_dock_loading"),loading:c,rows:l,saveLabel:h(t,r?"snippet_save_selection":"snippet_save"),onPick:d=>{D(n),Zp(t,d.name)},onSave:()=>{D(n),eh(t,o)}}),jt(t,e,s))};i([],!0),hs(t,e,s),qp(t).then(l=>i(Kp(l,o),!1)).catch(()=>i([],!1))}function $a(t,e,o,n){const s=t.createElement("span");return s.setAttribute("data-sve-snippet-face",n),s.innerHTML=e,s.appendChild(t.createTextNode(o)),s}function Ca(t,e,o,n){const s=e.querySelector(o);if(!s||s._sveBound)return;s._sveBound=!0;const r=t.document,i=ze(t,s,"data-sve-snippet-btn","",h(t,"code_dock_snippets"));i.setAttribute("data-sve-snippet-pane",n),i.removeAttribute("title"),i.removeAttribute("aria-label"),i.replaceChildren($a(r,zp,h(t,"snippet_button"),n==="css"?"css":"html")),n==="css"&&i.appendChild($a(r,Wp,h(t,"tw_utility_button"),"tw")),i.addEventListener("click",l=>{if(l.preventDefault(),l.stopPropagation(),n==="css"&&a.styleMode==="tw"){D(r),Hp(t);return}if(i.hasAttribute("data-open")){D(r);return}oh(t,i,n)})}function nh(t,e){Ca(t,e,"[data-sve-snippet-tools]","html"),Ca(t,e,"[data-sve-css-snippet-tools]","css")}const Ta=new WeakSet;function sh(t,e){a.styleMode=e==="tw"?"tw":"css",G(t,Hs,a.styleMode),ns(t)}function vi(t,e){if(e._sveStyleModeBound)return;e._sveStyleModeBound=!0,a.styleMode=rt(t,Hs)==="tw"?"tw":"css";const o=rt(t,Oo)||"";a.cssSize=Sn(t).some(n=>n.handle===o)?o:"",a.cssState=Io.includes(rt(t,ao))?rt(t,ao):"",a.cssValues=rt(t,Wo)==="1",e.querySelector("[data-sve-style-mode]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),sh(t,a.styleMode==="tw"?"css":"tw")}),e.querySelector("[data-sve-values-mode]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),ii(t,!a.cssValues)}),e.querySelector("[data-sve-all]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),ci(t)}),ns(t),Po(t),qt(t)}function gi(t,e){const o=e.querySelector("[data-sve-css-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=r=>e.querySelector(`[data-sve-css-tool="${r}"], [data-sve-css-kid="${r}"]`),s=r=>{const i=n(r.id),l=a.cssOpenMenu===r.id;if(w(t.document),l){tn(t),P(t);return}if(!i)return;const c=a.styleMode==="tw"?!r.twClass&&(!!r.tw||!!r.twGroup):!r.kind&&!r.value&&!(r.css in et())&&!!r.menu,d=()=>{c&&(a.cssOpenMenu=r.id)},f=()=>{a.cssOpenTool="",P(t)};if(a.styleMode==="tw"){tn(t),r.twClass?(xc(t,r.twClass),P(t)):r.twGroup?(_c(t,i,r.title,r.twGroup,f),d(),P(t)):r.tw&&(Sc(t,i,r.tw,f),d(),P(t));return}if(r.kind==="flexDir"){Vr(r.value);return}if(r.kind==="display"){Ur(r.value);return}if(r.value){const p=H(et()[r.css])===H(r.value);Q([{property:r.css,value:p?null:r.value}]);return}if(r.css in et()){Q([{property:r.css,value:null}]),P(t);return}r.menu==="colors"?Xr(t,i,r.css):r.menu==="spacing"?Zr(t,i,r.css):r.menu==="sizes"?dn(t,i,r.css,fl):r.menu==="choices"?Yr(t,i,r.css,r.choices):r.menu==="values"&&dn(t,i,r.css),d(),P(t)};$t.onTool=r=>{const i=Ae.get(r)?.tool;if(i){if(i.kids?.length){a.cssOpenTool=a.cssOpenTool===i.id?"":i.id,w(t.document),P(t);return}s(i)}},$t.onKid=(r,i)=>{const l=Ae.get(i);l?.kid&&s(l.kid)},a.cssToolRow=()=>{Ee(o,Cd),P(t)},a.cssToolRow(),ss(o),hp(o,"[data-sve-css-kids]"),Ta.has(t)||(Ta.add(t),t.addEventListener(_l,()=>ot(t))),t.document.addEventListener("mousedown",r=>{r.target.closest(`#${x}, [data-sve-css-tools], [data-sve-html-tools], [data-sve-css-add-class]`)||w(t.document)},!0)}function ah(t,e){const o=e.querySelector("[data-sve-html-tidy]");o&&(o.innerHTML=dr.tidy,o.title=h(t,"code_dock_html_tidy"),o.setAttribute("aria-label",o.title),o.setAttribute("data-tip",o.title))}function bi(t,e){const o=e.querySelector("[data-sve-html-tidy]");ah(t,e),!(!o||o._sveBound)&&(o._sveBound=!0,o.addEventListener("mousedown",n=>n.preventDefault()),o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Jn()}))}function yi(t,e){const o=e.querySelector("[data-sve-html-tools]");!o||o._sveBound||(o._sveBound=!0,Ee(o,kd,{tools:po.map(n=>({...n,icon:dr[n.id]||""})),onTool:n=>{const s=po.find(i=>i.id===n),r=o.querySelector(`[data-sve-html-tool="${n}"]`);if(s){if(s.menu==="heading"){cn(t,r,Ws);return}if(s.menu==="text"){cn(t,r,Fl);return}if(s.menu==="div"){Or(t,r);return}if(s.tidy){Jn();return}if(s.menu==="component"){Ir(t,r);return}if(w(t.document),s.action==="pagination"){Pr();return}if(s.snippet){Eo(s.snippet,s.caret??s.snippet.length,s.select),j();return}Mo(s.tag)}}}),ss(o),Li(t,e),Fi(t,e),gp(t,e),Mi(t,e),nh(t,e))}let xe=null,Aa=null;const rh=()=>(xe=xe||xn(()=>import("./help-editor-DyrgTPYe.js"),__vite__mapDeps([2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,1,17,18,19,20,21,22,23,24,25,26,27,28,29]),import.meta.url),xe);function ih(t,e){if(!t||!e)return;const o=n=>n?rh().then(s=>s.enableHelp(t,e)):xe?xe.then(s=>s.disableHelp(e)):Promise.resolve();Yo(t)&&o(!0),Aa?.(),Aa=za((n,s)=>{n===t&&o(s)})}E("dock:save-now",()=>(V(a.lastWin?.document),!0));let Ge=null;async function lh(t){const e=t.document;Ii(e);let o=e.getElementById(u);if(o&&!(o.querySelector('[data-sve-css-chrome="subrow-2"]')&&o.querySelector("[data-sve-css-add-class]")&&o.querySelector("[data-sve-html-tools]")&&o.querySelector("[data-sve-html-tidy]")&&o.querySelector("[data-sve-data-vars]")&&o.querySelector("[data-sve-visual-edit-tools]")&&o.querySelector("[data-sve-help-tools]")&&o.querySelector("[data-sve-html-scope]")&&o.querySelector("[data-sve-code-lock]")&&o.querySelector("[data-sve-code-back]")&&o.querySelector("[data-sve-code-autosave]")&&o.querySelector("[data-sve-code-save]")&&o.getAttribute("data-sve-code-chrome")==="scope-9")){for(const s of ct)v[s]?.destroy(),v[s]=null;o.remove(),o=null}if(!o){o=e.createElement("div"),o.id=u,o.setAttribute("data-sve-code-chrome","scope-9"),Object.defineProperty(o,"__sveSavedCss",{get:()=>a.lastParts?.css??""}),Pl(o,Ol(t)),Ee(o,vd,{htmlLabel:h(t,"code_dock_html"),cssLabel:h(t,"code_dock_css"),jsLabel:h(t,"code_dock_js"),alpineLabel:h(t,"code_dock_alpine"),treeIcon:zs,dataIcon:el,dataLabel:h(t,"data_vars_title")}),Jo(e,o),vn(o),gs(o,ms(t)),Ni(t,o),Vi(t,o),qi(t,o),gi(t,o),jr(t,o),vi(t,o),ri(t,o),ai(t,o),Il(t,o),yi(t,o),an(t,o),en(t,o),gn(t,o),on(t,o);for(const n of ct){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);ni(s)}Dl(t)}if(Jo(e,o),vn(o),bi(t,o),an(t,o),en(t,o),gn(t,o),on(t,o),ji(t),jo(t),Tt(t),K(t),Nt(t),Z(t),Re(t),zt(t),await Ki(),!v.html){for(const n of ct){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);s?.replaceChildren(),oi(t,n,s)}for(const n of["html","css"])v[n]&&oc(t,v[n],{onOpen:s=>Kn(t,s),emptyLabel:h(t,"code_dock_partials_empty"),openLabel:s=>h(t,"component_open_named",{name:s}),sectionValues:()=>To(t),isLocked:()=>ft(),setHover:(s,r)=>a.htmlPartialUi?.setHover(s,r)});Hc(t,v.html,{onRename:n=>Ar(t,n),isLocked:()=>ft(),setHover:(n,s)=>a.htmlClassTokenUi?.setHover(n,s),title:h(t,"code_dock_css_rename_class")}),ih(t,v.html)}return o}function ls(t){return Ge||(Ge=lh(t).finally(()=>{Ge=null})),Ge}async function Ea(t,e){const o=await ls(t);a.lastType=e,a.lastLocked=!0,a.lockReady=!0,a.lastParts={html:"",css:"",js:""},ue(),Tt(t),Ft(a.lastParts,!0),Ro(t.document,e),R(t.document,h(t,"code_dock_missing")),K(t),Nt(t),Z(t),Wt(t,o)}let Ma=-1;async function ki(t,e){if(Ma===a.loadGen&&!a.lastType&&t.document.getElementById(u))return;V(e);const o=++a.loadGen;Ma=o,a.lastType=null,a.typeStack=[],a.lastParts={html:"",css:"",js:""},a.lastProps=[],a.propsDirty=!1,a.lastLocked=!1,a.lockReady=!1,a.loadInFlight=null,zn(),ue();const n=await ls(t);o===a.loadGen&&(Ft(a.lastParts,!0),In(t),yo(t),Mn(t),Ro(t.document,""),R(t.document,h(t,Sl(t,t.document)?"code_dock_pick_section":"code_dock_open_template")),Tt(t),K(t),Nt(t),Z(t),Re(t),zt(t),Wt(t,n))}function xi(t){return ee(t,a.lastType)||ee(t,a.typeStack[0])}function ch(t,e,o){if(o==="replace"){if(!ee(t,e)){a.beforePart=null;return}xi(t)||(a.beforePart={type:a.lastType||"",uid:a.lastUid||"",stack:[...a.typeStack],onEmptyPage:!!a.onEmptyPage})}}function _i(t,e){if(!xi(t))return!1;const o=a.beforePart,n=o?.type||"",s=o?.stack[0]||n,r=!!(n&&o.uid&&$i(t,e,o.uid)===s),i=!!(n&&n.startsWith("view:")&&s.startsWith("view:"));return a.beforePart=null,a.lastWin=t,V(e),!r&&!i?(a.lastUid=null,a.onEmptyPage=!0,ki(t,e),!0):(a.lastUid=o.uid||null,a.onEmptyPage=o.onEmptyPage,Kt(t,n,"replace"),a.typeStack=[...o.stack],!0)}async function Kt(t,e,o="replace"){ch(t,e,o),o==="replace"?a.typeStack=[]:o==="push"&&a.lastType&&a.lastType!==e&&a.typeStack.push(a.lastType);const n=++a.loadGen;a.lastType=e,a.lockReady=!1,ue(),R(t.document,h(t,"code_dock_loading"));let s=()=>{};a.loadInFlight=new Promise(i=>{s=i}),wt(`dock loadTemplate ${e}: waiting for the dock`);const r=await ls(t);wt(`dock loadTemplate ${e}: dock ready, fetching`),Tt(t),K(t),Nt(t),Z(t),Re(t),zt(t),Wt(t,r),t.fetch(`/!/sve/section-template?type=${encodeURIComponent(e)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async i=>{if(n!==a.loadGen)return;if(i.status===404){Ea(t,e);return}if(!i.ok)throw new Error(String(i.status));const l=await i.json();if(n!==a.loadGen){wt(`dock loadTemplate ${e}: overtaken (gen ${n}/${a.loadGen})`);return}wt(`dock loadTemplate ${e}: landed ${l.path||"-"}`),a.lastParts={html:typeof l.html=="string"?l.html:"",css:typeof l.css=="string"?l.css:"",js:typeof l.js=="string"?l.js:""},a.lastProps=Array.isArray(l.props)?l.props:[],a.propsDirty=!1,a.lastType=e,a.lastLocked=!!l.locked,a.lockReady=!0,zn(),typeof l.tw=="string"&&l.tw!==""&&Wn(a.lastParts.html,l.tw),Tt(t),Ft(a.lastParts,a.lastLocked),Mn(t),a.lastLocked||Nn(t,a.lastParts.html),Ro(t.document,l.path||e),R(t.document,a.lastLocked?h(t,"code_dock_locked"):""),l.writable?.template===!1?R(t.document,h(t,"code_dock_not_writable")):l.writable?.tw===!1&&R(t.document,h(t,"code_dock_tw_not_writable")),In(t),gd(t),yo(t),K(t),Nt(t),Z(t),Wt(t,r)}).catch(i=>{wt(`dock loadTemplate ${e}: failed ${i?.message||i} (gen ${n}/${a.loadGen})`),n===a.loadGen&&(Ea(t,e),R(t.document,h(t,"code_dock_error")))}).finally(()=>{n===a.loadGen&&(a.loadInFlight=null),s()})}function mt(){return a.lastType||""}function cs(t){return!!t?.getElementById(u)}function ft(){return a.lastLocked}function ds(t,e){const o=typeof e?.html=="string"?e.html.trim():"",n=typeof e?.css=="string"?e.css.trim():"",s=typeof e?.js=="string"?e.js.trim():"";if(!o&&!n&&!s||!t?.document?.getElementById(u))return!1;let r=!1;return o&&(r=dh("html",o)||r),n&&(r=La("css",n)||r),s&&(r=La("js",s)||r),r&&X(t),r}function dh(t,e){const o=v[t];if(!o||o.state.readOnly)return!1;const n=o.state.selection.main,s=n.from>0?o.state.doc.sliceString(n.from-1,n.from):`
`,r=n.to<o.state.doc.length?o.state.doc.sliceString(n.to,n.to+1):`
`,c=`${s===`
`?"":`
`}${e}${r===`
`?"":`
`}`;return o.dispatch({changes:{from:n.from,to:n.to,insert:c},selection:{anchor:n.from+c.length}}),!0}function La(t,e){const o=v[t];if(!o||o.state.readOnly)return!1;const n=o.state.doc.length,r=`${n>0&&o.state.doc.sliceString(Math.max(0,n-1),n)!==`
`?`

`:n?`
`:""}${e}
`;return o.dispatch({changes:{from:n,insert:r},selection:{anchor:n+r.length}}),!0}function Si(t){if(Se(t),!a.lastType||!t.document.getElementById(u))return;const e=a.lastType;a.lastType=null,Kt(t,e,"keep")}function us(t){D(t),a.loadGen+=1,V(t),a.lastUid=null,a.lastType=null,a.typeStack=[],a.beforePart=null,a.lastParts={html:"",css:"",js:""},a.lastLocked=!1,a.lockReady=!1,a.lastBracketNames=null,a.lastCssSelectorNames=null,ue(),a.lastWin=t?.defaultView||a.lastWin,w(t),Ja(t),xt(t),t?.getElementById(Y)?.remove();for(const o of ct)v[o]?.destroy(),v[o]=null;t?.getElementById(u)?.remove(),Di(),t&&Ho(t,0);const e=t?.defaultView||a.lastWin;e?.document.getElementById(Ba)&&Ra(e),e&&(In(e),yo(e),Mn(e))}function wi(t){if(a.dragging)return;const e=t.document.getElementById(u);e&&(jo(t),Wt(t,e))}function $i(t,e,o){if(o){const r=Ks(o,e)||Ks(o,t.document)||o,i=Gs(r,e)||Gs(r,t.document);return Zo(t,i).trim()}const n=typeof _e=="function"?_e(t):"page_sections",s=typeof ut=="function"?ut(t.document):[];for(const r of s){const l=(Ht(r.values)||r.values)?.[n];if(Array.isArray(l))for(const c of l){const d=Zo(t,c).trim();if(d)return d}}return""}function uh(t,e,o){const n=t.Statamic?.$config?.get?.("sveChromeTemplates")||{},s=n[e]&&typeof n[e].type=="string"?n[e]:null,r=t.Statamic?.$config?.get?.("sveChromeStyles")||{},i=`${e}/${typeof r[e]=="string"&&r[e]!==""?r[e]:"style_1"}`,l=s?.type||i,c=o?.[`${e}_style`];return(!s||s.styled)&&typeof c=="string"&&c!==""?`${e}/${c}`:l}function fh(){const t=mt();if(!t)return"";if(t===Pa)return"main";if(a.lastWin&&t===vo(a.lastWin))return"template";const e=t.match(/^(header|footer)\//);if(e)return e[1];const o=a.lastWin?.Statamic?.$config?.get?.("sveChromeTemplates")||{};return["header","footer"].find(n=>o[n]?.type===t)||""}function ph(t){const e=Va||Ua;return e!=="header"&&e!=="footer"?"":$n(t)||Cn(t)?e:""}function hh(t,e){const o=Va||Ua;return o!=="header"&&o!=="footer"||!$n(e)&&!Cn(e)?"":uh(t,o,Ht(Bl()?.values)||{})}function mh(t,e){if(!e||String(e).startsWith("view:")||ee(t,e))return!1;const o=typeof _e=="function"?_e(t):"page_sections",n=typeof ut=="function"?ut(t.document):[];for(const s of n){const i=(Ht(s.values)||s.values)?.[o];if(Array.isArray(i)&&i.some(l=>Zo(t,l)===e))return!0}return!1}function vh(t){const e=qa(t)||t.getElementById("__sve-global-section-host");return e&&e.querySelector("[data-replicator-set][data-type]")?.getAttribute("data-type")||""}function gh(t,e,o){if(wt(`dock sync uid=${o||"-"} last=${a.lastUid||"-"}/${a.lastType||"-"}`),a.dragging)return;const n=!!(o&&o!==a.lastUid);if(o&&(a.lastUid=o),!t||!e||Pi(e)||!Wa(t)||!Na(t)){e&&us(e);return}const s=!o&&!!a.lastType&&a.lastType!==Pa&&!$n(e)&&!Cn(e)&&!qa(e)&&!mh(t,a.lastType);if(s&&_i(t,e))return;s&&(a.lastUid=null);const r=o||a.lastUid||"",i=hh(t,e)||vh(e)||(r?$i(t,e,r):"")||vo(t)||(!o&&!s?a.lastType:""),l=!i&&!o,c=l,d=i;if(a.onEmptyPage=l,a.lastWin=t,c){ki(t,e);return}if(d){if(d===a.lastType&&e.getElementById(u)){wt("dock same type, dock open: nothing to do");return}if(a.typeStack.length&&a.lastType&&a.lastType!==d){const f=a.typeStack[0];if(d===f&&!n)return;a.typeStack=[]}V(e),wt(`dock loadTemplate ${d}`),Kt(t,d,"replace")}}mo("tw:changed",()=>{a.lastWin&&a.styleMode==="tw"&&P(a.lastWin)});E("dock:is-open",t=>cs(t));E("dock:is-locked",()=>ft());E("dock:html",()=>St());E("dock:reveal-html",({from:t,to:e,caret:o}={})=>{const n=v.html;if(!n||t==null)return;a.htmlScopePref=le(a.lastWin),Mt(),U();const s=a.htmlFull.length,r=Math.max(0,Math.min(t,s)),i=Math.max(r,Math.min(e??t,s));a.htmlFocus=i>r?{from:r,to:i}:null,a.cssFocus=null,a.cssAll=!1;const l=o==null?null:Math.max(0,Math.min(o,s));if(a.htmlScopePref&&a.htmlFocus){Pe(l),K(a.lastWin);return}if(a.htmlScopeActive){Ao(!0,l),K(a.lastWin);return}n.dispatch({selection:l==null?{anchor:r,head:i}:{anchor:l},scrollIntoView:!0}),n.focus()});E("dock:insert-snippet",({win:t,parts:e})=>ds(t,e));E("dock:refresh",t=>Si(t));E("dock:tw-follow",()=>{a.lastWin&&me(a.lastWin)});E("dock:css",()=>(U(),a.cssFull));E("dock:set-css",t=>typeof t!="string"||ft()||!v.css||!a.lastWin?!1:(U(),a.cssFull=t,de("css",Qn()),X(a.lastWin),!0));E("dock:js",()=>v.js?.state.doc.toString()??"");E("dock:set-js",t=>typeof t!="string"||ft()||!v.js||!a.lastWin?!1:(de("js",t),X(a.lastWin),!0));E("dock:data-menu",({anchor:t,onPick:e,at:o}={})=>!t||!a.lastWin?!1:(D(a.lastWin.document),w(a.lastWin.document),fs(a.lastWin,t,e,o),!0));E("dock:props",()=>a.lastProps.map(t=>({...t})));E("dock:set-props",({win:t,props:e}={})=>!Array.isArray(e)||ft()?!1:(a.lastProps=e,a.propsDirty=!0,wc(Do(mt())),V((t||a.lastWin)?.document),!0));function Do(t){const e=/^view:partials\/(components\/[A-Za-z0-9_-]+)$/.exec(String(t||""));return e?e[1]:""}E("dock:component-src",()=>Do(mt()));E("dock:type-stack",()=>a.typeStack.map(t=>({type:t,src:Do(t)})));E("dock:component-exit-state",()=>{const t=Do(mt());return{open:!!t,name:t?t.split("/").pop():"",back:a.typeStack.length>0}});E("dock:exit-component",(t=1)=>{if(!a.lastWin||!rr(mt()))return!1;if(a.typeStack.length){for(let e=Number(t)||1;e>1&&a.typeStack.length>1;e-=1)a.typeStack.pop();Gn(a.lastWin)}else us(a.lastWin.document);return!0});E("dock:current-type",()=>mt());E("dock:on-empty-page",()=>!!a.onEmptyPage);E("dock:current-uid",()=>a.lastUid);E("dock:leave-part",()=>{const t=a.lastWin;return t?(_i(t,t.document),!0):!1});E("dock:chrome-kind",()=>fh());E("dock:collection-view",()=>a.lastWin?vo(a.lastWin):"");E("dock:chrome-open",t=>ph(t));E("dock:save-settled",()=>a.saveInFlight||null);E("dock:load-settled",()=>a.loadInFlight||null);E("dock:reset-data-vars",t=>(zc(typeof t=="string"&&t?t:void 0),!0));E("dock:refresh-preview",()=>a.lastWin?(Se(a.lastWin),!0):!1);E("dock:open-file",t=>typeof t!="string"||!t||!a.lastWin?!1:(a.onEmptyPage=!1,t===a.lastType||(V(a.lastWin.document),Kt(a.lastWin,t,"replace")),!0));E("dock:open-template",t=>typeof t!="string"||!t||!a.lastWin?!1:(Kn(a.lastWin,t),!0));E("dock:set-html",t=>{const e=t&&typeof t=="object"?t:{},o=t&&typeof t=="object"?t.html:t;if(typeof o!="string"||ft())return!1;if(o!==""&&!er(St(),o)){const i=a.lastWin;if(!(e?.unlock===!0&&i?.Statamic?.$permissions?.has?.("configure fields")===!0))return i?.Statamic?.$toast?.error(h(i,"html_tree_locked_element")),!1}const n=v.html;if(!n||!a.lastWin)return!1;if(o===""){a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null),a.twDirty=!1,a.twCss=null,a.twKey="",a.lastType=null,a.lastUid=null,a.lastParts={html:"",css:"",js:""},a.cssFull="",a.htmlFull="",a.applying=!0;try{ue();for(const i of ct){const l=v[i];if(!l)continue;const c=l.state.doc.toString();c!==""&&l.dispatch({changes:{from:0,to:c.length,insert:""}})}}finally{a.applying=!1}return!0}const s=a.htmlFull;if(a.htmlFull=o,a.htmlScopeActive)return a.htmlFocus=Ci(a.htmlFocus,s,o),Vt(Yn()),X(a.lastWin),wn("dock:html-changed"),!0;const r=n.state.doc.toString();if(r!==o){const[i,l,c]=qn(r,o);n.dispatch({changes:{from:i,to:l,insert:c}})}return!0});E("dock:take-file",t=>{const e=t?.type,o=t?.parts,n=a.lastWin;if(typeof e!="string"||!e||!o||typeof o!="object"||!n||e!==a.lastType||!a.lockReady||a.lastLocked||a.saveTimer||a.saveInFlight||a.twBusy||a.twDirty)return!1;const s=l=>typeof l=="string"?l:"",r={html:s(o.html),css:s(o.css),js:s(o.js)};if(!ne(Ie(),a.lastParts))return!1;if(ne(r,a.lastParts))return!0;const i=a.htmlFull;return a.lastParts=r,a.propsDirty=!1,Wn(r.html,s(o.tw)),a.htmlScopeActive&&(a.htmlFocus=Ci(a.htmlFocus,i,r.html)),Ft(r,!1),R(n.document,""),Z(n),n.document.getElementById(u)?.dispatchEvent(new n.Event("input",{bubbles:!0})),!0});E("dock:show-empty",()=>it("dock:set-html",""));mo("row:removed",({parentPath:t,remaining:e,win:o})=>{e===0&&t===_e(o)&&it("dock:show-empty")});function Ci(t,e,o){const n=o.length-e.length;if(!t||!n)return t;let s=0;for(;s<e.length&&s<o.length&&e[s]===o[s];)s+=1;return s>=t.to?t:s<t.from?{from:Math.max(0,t.from+n),to:Math.max(0,t.to+n)}:{from:t.from,to:Math.max(t.from,t.to+n)}}const _t="__sve-data-menu";let lo=null;function D(t){const e=t?.getElementById(_t);lo?.(),lo=null,e?._sveApp?.unmount(),e?.remove(),t?.querySelectorAll("[data-sve-data-vars][data-open], [data-sve-antlers-btn][data-open], [data-sve-visual-edit-btn][data-open], [data-sve-snippet-btn][data-open]").forEach(o=>o.removeAttribute("data-open"))}function Ti(t){if(!vo(t))return{view:"",kind:""};const e=typeof ut=="function"?ut(t.document):[];for(const o of e){const n=Ht(o.values)||o.values,s=typeof n?.source_collection=="string"?n.source_collection.trim():"";if(s)return{view:s,kind:String(n?.kind||"").trim()}}return{view:"",kind:""}}function bh(t,e){const o=St();if(Number.isFinite(e))return Js(o,e);const n=v.html;if(!n)return[];const s=a.htmlScopeActive&&a.htmlFocus?a.htmlFocus.from:0;return Js(o,s+n.state.selection.main.from)}function yh(t,e){const{view:o,kind:n}=Ti(t);return{collection:Ln(t)||"",set:Fn(mt()),view:o,kind:n,scope:Rc(bh(t,e))}}function kh(t){const{view:e,kind:o}=Ti(t),n={collection:Ln(t)||"",set:Fn(mt()),view:e,scope:""};return Pn(t,n).then(s=>On(s?.section||[],To(t)))}function xh(t){const e=typeof ut=="function"?ut(t.document):[];for(const o of e){const n=Ht(o.values)||o.values;if(n&&typeof n=="object")return n}return null}function _h(t,e){return{scope:e?.scope?.groups||[],section:On(e?.section||[],To(t)),page:qc(e?.page||[],xh(t)),site:e?.site||[]}}function Ai(t){const e=t.state.selection.main,o=t.state.doc.lineAt(e.from),n=o.text.slice(0,e.from-o.from);return/(?:^|\s)(?::|x-bind:)[\w.:-]+\s*=\s*(["'])(?:(?!\1).)*$/.test(n)}function Ei(t){const e=t.state.selection.main,o=t.state.doc.lineAt(e.from),n=o.text.slice(0,e.from-o.from);return/(?:^|\s)[\w.:@-]+\s*=\s*(["'])(?:(?!\1).)*$/.test(n)}function Sh(t,e){const o=v.html;if(!o||o.state.readOnly)return;if(Ai(o)){const c=String(t?.var||"").trim(),d=o.state.selection.main;o.dispatch({changes:{from:d.from,to:d.to,insert:c},selection:{anchor:d.from+c.length}}),j();return}const n=Vc(t,e,{inline:Ei(o)});if(!n)return;const s=o.state.selection.main,r=o.state.doc.lineAt(s.from),i=J(r.text),l=bo(n.text,i);o.dispatch({changes:{from:s.from,to:s.to,insert:l},selection:{anchor:s.from+n.cursor+(n.text.includes(`
`)?i.length:0)}}),j()}function jt(t,e,o){const n=e.getBoundingClientRect(),s=8,r=o.offsetWidth||368,i=o.offsetHeight||240,l=t.innerHeight-n.bottom-s,c=n.top-s,d=l>=i||l>=c?n.bottom+4:n.top-i-4;o.style.left=`${Math.max(s,Math.min(n.left,t.innerWidth-r-s))}px`,o.style.top=`${Math.max(s,Math.min(d,t.innerHeight-i-s))}px`}function fs(t,e,o,n){const s=t.document;D(s),e.setAttribute("data-open","");const r=s.createElement("div");r.id=_t,r.setAttribute("data-sve-data-menu",""),s.body.appendChild(r);const i=yh(t,n),l=m=>[m?.scope?.groups?.length?{id:"scope",label:m.scope.label||h(t,"data_vars_tab_loop")}:null,{id:"section",label:h(t,"data_vars_tab_section")},{id:"page",label:h(t,"data_vars_tab_page")},{id:"site",label:h(t,"data_vars_tab_site")}].filter(Boolean),c=m=>{s.getElementById(_t)&&(r._sveApp?.unmount(),r._sveApp=W(ur,r,{title:h(t,"data_vars_title"),placeholder:h(t,"data_vars_placeholder"),emptyText:h(t,"data_vars_empty"),noSectionText:h(t,"data_vars_no_section"),loopText:h(t,"data_vars_loop"),tabs:l(m),data:_h(t,m),onPick:(y,b)=>o?o(y,b):Sh(y,b)}),jt(t,e,r))};c(fr(Bn(i))||{scope:null,section:[],page:[],site:[]}),Pn(t,i).then(c),jt(t,e,r);const d=()=>jt(t,e,r),f=m=>{!r.contains(m.target)&&!e.contains(m.target)&&D(s)},p=m=>{m.key==="Escape"&&D(s)};s.addEventListener("pointerdown",f,!0),s.addEventListener("keydown",p,!0),t.addEventListener("scroll",d,!0),t.addEventListener("resize",d),lo=()=>{s.removeEventListener("pointerdown",f,!0),s.removeEventListener("keydown",p,!0),t.removeEventListener("scroll",d,!0),t.removeEventListener("resize",d)}}function ps(t,e,{title:o,placeholder:n,tabs:s,data:r,onPick:i}){const l=t.document;D(l),w(l),e.setAttribute("data-open","");const c=l.createElement("div");c.id=_t,c.setAttribute("data-sve-data-menu",""),l.body.appendChild(c),c._sveApp=W(ur,c,{title:o,placeholder:n,emptyText:h(t,"data_vars_empty"),noSectionText:h(t,"data_vars_empty"),loopText:"",tabs:s,data:r,onPick:(d,f)=>{D(l),i(d,f)}}),jt(t,e,c),hs(t,e,c)}function hs(t,e,o){const n=t.document,s=()=>jt(t,e,o),r=l=>{!o.contains(l.target)&&!e.contains(l.target)&&D(n)},i=l=>{l.key==="Escape"&&D(n)};n.addEventListener("pointerdown",r,!0),n.addEventListener("keydown",i,!0),t.addEventListener("scroll",s,!0),t.addEventListener("resize",s),lo=()=>{n.removeEventListener("pointerdown",r,!0),n.removeEventListener("keydown",i,!0),t.removeEventListener("scroll",s,!0),t.removeEventListener("resize",s)}}const wh='<svg width="21" height="11" viewBox="0 0 150 77" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M69.999 55.827a13.8 13.8 0 0 0-.812-3.799 15.4 15.4 0 0 0-1.687-3.55 18.16 18.16 0 0 0-5.686-5.418 37.7 37.7 0 0 0 3.936-6.228 18.6 18.6 0 0 0 1.812-6.228 9.88 9.88 0 0 0-1.248-5.57 9.9 9.9 0 0 0-4.125-3.959 10.46 10.46 0 0 0-10.684 1.183 13.8 13.8 0 0 0-4.061 5.107 39 39 0 0 0-1.812 4.92 49.5 49.5 0 0 1-5.436-6.227 16.9 16.9 0 0 1-2.562-5.606 28.7 28.7 0 0 1-.624-6.85c.003-2-.357-3.983-1.063-5.855a10.66 10.66 0 0 0-4.56-5.231 13.9 13.9 0 0 0-10.684-1.37 10.13 10.13 0 0 0-4.94 2.755 10.1 10.1 0 0 0-2.683 4.967 24.4 24.4 0 0 0 0 10.214 22.4 22.4 0 0 0 3.374 7.35h-1.062a23 23 0 0 1-4.124 0 19.2 19.2 0 0 0-6.248 0 6.74 6.74 0 0 0-3.374 2.74 9.45 9.45 0 0 0-.75 9.341 11.23 11.23 0 0 0 5.811 6.228 25.1 25.1 0 0 0 10.622 1.495 17.9 17.9 0 0 0 9.809-3.425 104 104 0 0 1 10.496 7.162 22.4 22.4 0 0 1 5.249 6.54 15.5 15.5 0 0 1 1.437 5.106 35 35 0 0 0 1.437 6.789 13.2 13.2 0 0 0 4.373 5.73 15.6 15.6 0 0 0 10.372 2.802 9.9 9.9 0 0 0 5.429-1.987 9.84 9.84 0 0 0 3.38-4.677A61.6 61.6 0 0 0 70 55.827m-5.061 12.456a5.05 5.05 0 0 1-1.971 2.157 5.07 5.07 0 0 1-2.84.708 9.45 9.45 0 0 1-6.248-2.367 6.6 6.6 0 0 1-2.124-2.989 50 50 0 0 1-1.625-6.788 18.7 18.7 0 0 0-2.249-5.73 28.7 28.7 0 0 0-7.435-7.35A129 129 0 0 0 27.95 38.95c-.812-.498-2.686 0-2.749 0a14.03 14.03 0 0 1-7.872 1.62 19.5 19.5 0 0 1-7.935-2.056 4.86 4.86 0 0 1-2.375-2.49 3.35 3.35 0 0 1 0-2.99 1.18 1.18 0 0 1 .875-.748c1.25 0 2.687 0 3.936-.435a33 33 0 0 0 4.749-1.122 17.6 17.6 0 0 0 4.498-2.18 1.68 1.68 0 0 0 .838-1.68 1.7 1.7 0 0 0-.213-.624 2.2 2.2 0 0 0-.937-.747 18.65 18.65 0 0 1-2.812-7.35 19.5 19.5 0 0 1 .938-7.97 4.55 4.55 0 0 1 1.326-1.834 4.57 4.57 0 0 1 2.048-.97 7.52 7.52 0 0 1 5.498.997 5.12 5.12 0 0 1 2.499 3.488 87 87 0 0 0 1.874 10.587 22.4 22.4 0 0 0 4.436 6.789 78 78 0 0 0 8.372 7.286 1.8 1.8 0 0 0 1.188 1.246 2.005 2.005 0 0 0 2.499-1.308 33.4 33.4 0 0 1 3.249-6.54 8.8 8.8 0 0 1 2.811-2.677 4.63 4.63 0 0 1 4.561 0 4 4 0 0 1 1.612 1.494c.387.638.586 1.372.575 2.118a14.7 14.7 0 0 1-.75 5.792 36.6 36.6 0 0 1-2.561 6.228v.311a2.05 2.05 0 0 0 .5 2.74 13.6 13.6 0 0 1 3.248 4.92c.375.873.563 1.745.875 2.617s.937 2.678 1.312 4.048c1.625 5.916 2.5 7.536.875 10.961zM148.848 29.42a6.6 6.6 0 0 0-3.062-2.74 16.7 16.7 0 0 0-6.248 0c-1.227.09-2.459.09-3.686 0h-.937a24.2 24.2 0 0 0 3.186-7.536c.659-3.31.659-6.716 0-10.027a9.95 9.95 0 0 0-2.072-5.336 10 10 0 0 0-4.676-3.32 12.53 12.53 0 0 0-10.184 1.556 10.78 10.78 0 0 0-4.498 5.668 16.8 16.8 0 0 0-.875 5.667 32.7 32.7 0 0 1 0 6.602 17.2 17.2 0 0 1-2.499 5.543 52 52 0 0 1-4.748 5.792 32 32 0 0 0-1.5-4.547 14.4 14.4 0 0 0-3.811-5.231 9.522 9.522 0 0 0-10.56-.996 10.16 10.16 0 0 0-3.64 4.024 10.1 10.1 0 0 0-1.045 5.317c.21 2.156.78 4.26 1.687 6.228a38.3 38.3 0 0 0 3.748 6.228 17.5 17.5 0 0 0-5.435 5.668 15 15 0 0 0-1.562 3.55 18.3 18.3 0 0 0-.75 3.674v10.09c.068 1.417.32 2.82.75 4.172a9.46 9.46 0 0 0 3.062 4.609 9.5 9.5 0 0 0 5.123 2.118 14.1 14.1 0 0 0 9.871-2.927 12.76 12.76 0 0 0 4.124-5.792 34 34 0 0 0 1.562-6.727 17.6 17.6 0 0 1 1.375-5.107 21.1 21.1 0 0 1 4.623-6.228 83 83 0 0 1 8.935-7.349 16.34 16.34 0 0 0 8.997 3.301 22.24 22.24 0 0 0 9.746-1.557 10.777 10.777 0 0 0 5.499-6.228 9.88 9.88 0 0 0-.5-8.158m-5.623 6.229a4.43 4.43 0 0 1-2.062 2.553 16.16 16.16 0 0 1-7.06 2.18 11.7 11.7 0 0 1-7.123-1.869s-1.999-.81-2.812 0a123 123 0 0 0-11.558 7.038 26.9 26.9 0 0 0-6.811 7.224 79 79 0 0 0-3.623 12.456 6.23 6.23 0 0 1-2 3.052 7.88 7.88 0 0 1-5.373 2.305 4.63 4.63 0 0 1-2.523-.809 4.6 4.6 0 0 1-1.663-2.056 9.8 9.8 0 0 1-.812-3.488c.25-2.711.881-5.373 1.874-7.91.375-1.37.75-2.678 1.187-4.048s.438-1.806.812-2.616a13.26 13.26 0 0 1 2.937-5.044 2.054 2.054 0 0 0 .375-2.74 44 44 0 0 1-2.25-6.228 17.3 17.3 0 0 1-.687-5.792 4.22 4.22 0 0 1 1.937-3.675 3.57 3.57 0 0 1 3.811 0 8.3 8.3 0 0 1 2.625 2.678 40.5 40.5 0 0 1 3.061 6.228 1.93 1.93 0 0 0 1.664 1.441c.26.029.522.005.773-.07a1.82 1.82 0 0 0 1.187-1.309 80 80 0 0 0 7.872-7.411 22.5 22.5 0 0 0 3.999-6.664 75.4 75.4 0 0 0 1.749-10.525 5.17 5.17 0 0 1 1.937-3.176 5.76 5.76 0 0 1 4.749-.935 4.11 4.11 0 0 1 3.186 2.927c.751 2.609.985 5.338.687 8.035a19 19 0 0 1-2.561 7.473s-.625 0-.75.56a1.68 1.68 0 0 0 .5 2.367c1.27.908 2.657 1.641 4.123 2.18 1.468.49 2.972.865 4.499 1.121 1.125 0 2.374 0 3.561.436s.438.311.625.623c.235.52.351 1.087.341 1.657a3.9 3.9 0 0 1-.403 1.644z"/></svg>',$h='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 9 5 12 1.8-5.2L21 14Z"/><path d="M7.2 2.2 8 5.1"/><path d="m5.1 8-2.9-.8"/><path d="M14 4.1 12 6"/><path d="m6 12-1.9 2"/></svg>';function ze(t,e,o,n,s){const r=t.document.createElement("button");return r.type="button",r.setAttribute(o,""),r.title=s,r.setAttribute("aria-label",s),r.innerHTML=`<span>${n}</span>`,r.addEventListener("mousedown",i=>i.preventDefault()),e.replaceChildren(r),r}function Ch(t){return String(t||"").replace(/\|/g,"").split(`
`)[0].trim()}function Mi(t,e){const o=e.querySelector("[data-sve-data-vars]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("mousedown",n=>n.preventDefault()),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),t.document.getElementById(_t)){D(t.document);return}w(t.document),fs(t,o)}))}function Li(t,e){const o=e.querySelector("[data-sve-antlers-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=ze(t,o,"data-sve-antlers-btn",wh,h(t,"code_dock_antlers"));n.addEventListener("click",s=>{if(s.preventDefault(),s.stopPropagation(),n.hasAttribute("data-open")){D(t.document);return}const r={};for(const i of ea)r[i.id]=Ac.filter(l=>l.group===i.id).map(l=>({id:l.id,var:l.label,value:l.inline?"":Ch(l.snippet)}));ps(t,n,{title:h(t,"code_dock_antlers"),placeholder:h(t,"code_dock_antlers_search"),tabs:ea.map(i=>({id:i.id,label:h(t,i.lang)})),data:r,onPick:i=>Th(i.id)})})}function Th(t){const e=Ec(t),o=v.html;if(!e||!o||o.state.readOnly)return;const n=o.state.selection.main.head;if(e.inline){const c=e.snippet,d=o.state.selection.main;o.dispatch({changes:{from:d.from,to:d.to,insert:c},selection:{anchor:d.from+c.length}}),j();return}const s=o.state.doc.lineAt(n),r=s.text.trim()?J(s.text):pe(o,s)||J(s.text),{text:i,cursor:l}=Ze(e.snippet);oe(bo(i,r),l),j()}function Fi(t,e){const o=e.querySelector("[data-sve-visual-edit-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=ze(t,o,"data-sve-visual-edit-btn",$h,h(t,"code_dock_visual_edit"));n.addEventListener("click",s=>{if(s.preventDefault(),s.stopPropagation(),n.hasAttribute("data-open")){D(t.document);return}const r={};for(const i of aa)r[i.id]=pr.filter(l=>l.group===i.id).map(l=>({id:l.id,var:l.label,value:l.attr?l.attr.replace(/\|/g,""):""}));ps(t,n,{title:h(t,"code_dock_visual_edit"),placeholder:h(t,"code_dock_visual_edit_search"),tabs:aa.map(i=>({id:i.id,label:h(t,i.lang)})),data:r,onPick:i=>Eh(i.id)})})}function Ah(t,e,o,n){if(Gc(o.inner,n.attr)){t.focus();return}const{text:s,cursor:r}=Ze(n.attr);let i=o.closeIdx;for(;i>o.openIdx+2&&/\s/.test(e[i-1]);)i--;t.dispatch({changes:{from:i,to:o.closeIdx,insert:` ${s} `},selection:{anchor:i+1+r}}),j()}function Eh(t){const e=Uc(t),o=v.html;if(!e||!o||o.state.readOnly)return;const n=o.state.doc.toString(),s=fe();if(s?.open){const p=Kc(n,s.open.from,s.open.to,qe);if(p){e.attr?Ah(o,n,p,e):(o.dispatch({selection:{anchor:p.openIdx+2+qe.length}}),o.focus());return}const m=s.open.from+1+s.name.length,y=e.standalone||`{{ ${qe} ${e.attr} }}`,{text:b,cursor:k}=Ze(y);o.dispatch({changes:{from:m,to:m,insert:` ${b}`},selection:{anchor:m+1+k}}),j();return}const r=o.state.selection.main.head,i=o.state.doc.lineAt(r),l=i.text.trim()?J(i.text):pe(o,i)||J(i.text),c=e.standalone||`{{ ${qe} ${e.attr} }}`,{text:d,cursor:f}=Ze(c);oe(bo(d,l),f),j()}function Bi(t){return t==="css"?Ls():t==="js"?Fs():Ms({autoCloseTags:!0})}function vn(t){if(t._sveShield)return;t._sveShield=!0;const e=o=>o.stopPropagation();for(const o of["keydown","keypress","keyup","pointerdown","pointerup","mousedown","mouseup","click","focusin"])t.addEventListener(o,e)}function Pi(t){try{return new URLSearchParams(t.defaultView?.location?.search||"").has("sve-panel")}catch{return!1}}function Mh(t){const e=parseInt(rt(t,Os)??"",10);return Number.isFinite(e)&&e>=Rs?e:Yi}function Lh(t,e){G(t,Os,String(e))}function ms(t){try{const e=JSON.parse(rt(t,Is)||"null");if(e&&typeof e=="object")return{html:e.html!==!1,css:e.css!==!1,js:e.js===!0,alpine:e.alpine===!0}}catch{}return{html:!0,css:!0,js:!1,alpine:!1}}function Fh(t,e){G(t,Is,JSON.stringify(e))}function Oi(t){try{const e=JSON.parse(rt(t,Ds)||"null");if(e&&typeof e=="object"){const o=s=>Number.isFinite(s)&&s>0?s:1,n={};for(const s of Et)n[s]=o(e[s]);return n}}catch{}return Object.fromEntries(Et.map(e=>[e,1]))}function Bh(t,e){G(t,Ds,JSON.stringify(e))}function Ii(t){wl(t,Xi,`
@keyframes sve-cm-wait { to { transform: rotate(360deg); } }
#${u} {
  /* The tree's seven families, for the marks and the toolbar below. */
  ${jl("dark")}
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
#${u} [data-sve-help-btn][aria-pressed="true"],
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
#${u}[data-sve-code-locked] [data-sve-snippet-tools],
#${u}[data-sve-code-locked] [data-sve-css-snippet-tools],
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
#${Y} {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,.5);
}
#${Y} [data-sve-unlock-card] {
  width: min(420px, calc(100vw - 32px));
  padding: 20px;
  border-radius: 12px;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 16px 40px rgba(0,0,0,.45);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${Y} [data-sve-unlock-title] {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
}
#${Y} [data-sve-unlock-body] {
  font-size: 13px;
  line-height: 1.45;
  opacity: .75;
  margin-bottom: 18px;
}
#${Y} [data-sve-unlock-actions] {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
#${Y} [data-sve-unlock-actions] button {
  all: unset;
  cursor: pointer;
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}
#${Y} [data-sve-unlock-cancel] {
  background: rgba(255,255,255,.1);
  color: #d4d4d4;
}
#${Y} [data-sve-unlock-confirm] {
  background: #b45309;
  color: #fff;
}
#${u} [data-sve-code-grip] {
  flex: 0 0 16px;
  height: 16px;
  width: 100%;
  cursor: ns-resize;
  z-index: 3;
  ${Xs("ns")}
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
#${u} [data-sve-visual-edit-tools],
#${u} [data-sve-help-tools],
#${u} [data-sve-snippet-tools],
#${u} [data-sve-css-snippet-tools] {
  pointer-events: auto;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
}
/* A snippet is not one of the row's writing tools, so a hairline sets it
   apart — the colour of the rows' own lines, a shade up to be seen on them. */
#${u} [data-sve-snippet-tools],
#${u} [data-sve-css-snippet-tools] {
  margin-left: 0.35em;
  padding-left: 0.6em;
  border-left: 1px solid rgba(255,255,255,.12);
}
/* The CSS row's tools do not grow, so the snippet button is sent to the end
   itself — the same place it has in the HTML pane's row. */
#${u} [data-sve-css-snippet-tools] {
  margin-left: auto;
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
#${x} {
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
#${_t} {
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
#${u} [data-sve-help-btn],
#${u} [data-sve-snippet-btn],
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
/* The snippet button says its word (Snippet / Utility) in the row's size,
   but in normal case and without the row's tracking. */
#${u} [data-sve-snippet-btn] {
  width: auto;
  margin-right: 0;
  padding: 0 0.5em 0 0.4em;
  font: inherit;
  letter-spacing: normal;
  text-transform: none;
  opacity: .78;
}
#${u} [data-sve-snippet-btn] [data-sve-snippet-face] {
  gap: 0.35em;
  align-items: center;
}
/* Which face the CSS pane's button shows follows the pane's language
   (style-modes.js paints data-sve-style). The HTML pane's has one face. */
#${u}[data-sve-style="tw"] [data-sve-css-snippet-tools] [data-sve-snippet-face="css"],
#${u}:not([data-sve-style="tw"]) [data-sve-css-snippet-tools] [data-sve-snippet-face="tw"] {
  display: none;
}
#${u} [data-sve-data-vars] span,
#${u} [data-sve-antlers-btn] span,
#${u} [data-sve-visual-edit-btn] span,
#${u} [data-sve-help-btn] span,
#${u} [data-sve-snippet-btn] span,
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
#${u} [data-sve-help-btn]:hover,
#${u} [data-sve-snippet-btn]:hover,
#${u} [data-sve-snippet-btn][data-open],
#${u} [data-sve-html-tidy]:hover {
  background: rgba(255,255,255,.16);
  opacity: 1;
}
/* The snippet picker's one action, at its foot: what the pane holds, saved. */
[data-sve-data-menu] [data-sve-snippet-save] {
  all: unset;
  flex: 0 0 auto;
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.5em 0.6em;
  border-radius: 0.35em;
  text-align: center;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #fff;
  background: #3858e9;
  cursor: pointer;
}
[data-sve-data-menu] [data-sve-snippet-save]:hover { background: #4a68ee; }
#${x} [data-sve-css-swatches] {
  display: grid;
  grid-template-columns: repeat(8, 16px);
  gap: 4px;
}
#${x} [data-sve-css-swatch] {
  all: unset;
  cursor: pointer;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  box-sizing: border-box;
  border: 1px solid rgba(255,255,255,.2);
}
#${x} [data-sve-css-swatch]:hover,
#${x} [data-sve-css-clear]:hover {
  outline: 1px solid #fff;
  outline-offset: 1px;
}
#${x} [data-sve-css-clear] {
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
#${x} [data-sve-css-choice] {
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
#${x} [data-sve-css-choice-label] {
  flex: 1 1 auto;
  min-width: 0;
}
/* What the row actually writes, in the corner of the row that writes it. Dim,
   because it is the answer to a second question, not the first. */
#${x} [data-sve-css-choice-hint] {
  flex: 0 0 auto;
  opacity: .45;
  font-size: 10px;
}
#${x} [data-sve-css-head-row] {
  display: block;
  padding: 8px 8px 3px;
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  opacity: .55;
}
#${x} [data-sve-css-head-row]:first-child {
  padding-top: 2px;
}
#${x} [data-sve-css-note-row] {
  display: block;
  padding: 6px 8px 2px;
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 10px;
  line-height: 1.45;
  opacity: .5;
}
#${x} [data-sve-css-choice]:hover,
#${x} [data-sve-css-swatch][data-active],
#${x} [data-sve-css-choice][data-active] {
  outline: 1px solid #fff;
  outline-offset: 1px;
  background: rgba(255,255,255,.1);
}
#${x} [data-sve-css-add-label] {
  display: block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  opacity: .55;
  margin-bottom: 6px;
}
#${x} [data-sve-css-add-input] {
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
#${x} [data-sve-css-add-hint] {
  margin-top: 6px;
  font-size: 11px;
  color: #fca5a5;
}
#${x} [data-sve-css-add-existing] {
  margin: 10px 0 4px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  opacity: .55;
}
#${x} [data-sve-css-add-list] {
  display: flex;
  flex-direction: column;
  gap: 1px;
  max-height: 14em;
  overflow-y: auto;
  margin: 0 -4px;
}
#${x} [data-sve-css-add-option] {
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
#${x} [data-sve-css-add-option]:hover,
#${x} [data-sve-css-add-option]:focus-visible {
  background: rgba(255,255,255,.1);
}
#${x} [data-sve-css-add-detail] {
  font-size: 10px;
  opacity: .5;
  font-family: ui-sans-serif, system-ui, sans-serif;
  white-space: nowrap;
}
#${x} [data-sve-css-add-none] {
  padding: 4px 6px;
  opacity: .4;
}
#${x} [data-sve-css-add-create] {
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
#${x} [data-sve-css-add-create]:hover { background: #4a68ee; }
#${x} [data-sve-css-add-create][disabled] { opacity: .35; cursor: default; }
#${u} [data-sve-code-split] {
  flex: 0 0 16px;
  cursor: col-resize;
  ${Xs("ew")}
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
#${bt} {
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
#${bt}:hover {
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
#${Ne} {
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
#${Ne} [data-sve-partial-choice] {
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
#${Ne} [data-sve-partial-choice]:hover {
  background: rgba(255,255,255,.1);
}
#${Ne} [data-sve-partial-empty] {
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
`)}function Ph(t){const e=t.querySelector(".live-preview-editor");if(!e)return 0;const o=e.getBoundingClientRect();return o.width<40||o.right<40?0:Math.round(o.right)}function Oh(t){let e=0;for(const o of["__sve-section-picker","__sve-outline-panel","__sve-html-tree-panel","__sve-listview-panel","__sve-right-dock","__sve-chrome-designs","__sve-global-section-panel","__sve-ai-panel"]){const n=t.getElementById(o);if(!n||n.hasAttribute("data-sve-chrome-hidden")||n.hasAttribute("data-sve-right-closed")||n.style.display==="none")continue;const s=n.getBoundingClientRect();s.width>40&&s.right>t.documentElement.clientWidth-8&&(e=Math.max(e,Math.round(s.width)))}return e}function jo(t){const e=t.document;if(a.layoutWin=t,typeof t.ResizeObserver!="function")return;a.layoutObserver||(a.layoutObserver=new t.ResizeObserver(()=>{a.layoutWin&&wi(a.layoutWin)}));const o=e.querySelector(".live-preview-editor"),n=e.getElementById("__sve-right-dock");o!==a.observedEditor&&(a.observedEditor&&a.layoutObserver.unobserve(a.observedEditor),a.observedEditor=o,o&&a.layoutObserver.observe(o)),n!==a.observedRight&&(a.observedRight&&a.layoutObserver.unobserve(a.observedRight),a.observedRight=n,n&&a.layoutObserver.observe(n))}function Di(){a.layoutObserver?.disconnect(),a.layoutObserver=null,a.layoutWin=null,a.observedEditor=null,a.observedRight=null}function ji(t){a.layoutWatchBound||(a.layoutWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>jo(t)))}function Ho(t,e){const o=t.querySelector(".live-preview-contents");o&&(o.style.paddingBottom=e?`${e}px`:"")}function vs(t){if(!t)return;const e=t.clientHeight,o=t.querySelector("[data-sve-code-bar]"),n=t.querySelector("[data-sve-code-lock-banner]"),s=n&&Ih(t)?.getComputedStyle(n).display!=="none"?n.offsetHeight:0,r=Math.max(64,e-(o?.offsetHeight||0)-s),i=t.querySelector("[data-sve-code-panes]");i&&(i.style.height=`${r}px`,i.style.minHeight="0",i.style.overflow="hidden"),t.querySelectorAll("[data-sve-code-host]").forEach(l=>{const c=l.closest("[data-sve-code-pane]");if(!c||c.style.display==="none")return;let d=0;for(const p of c.children)p!==l&&(d+=p.offsetHeight);const f=Math.max(64,r-d);l.style.height=`${f}px`,l.style.maxHeight=`${f}px`,l.style.minHeight="0",l.style.overflow="auto",Dh(l)})}function Ih(t){return t.ownerDocument?.defaultView||a.lastWin}function Dh(t){t._sveWheelBound||(t._sveWheelBound=!0,t.addEventListener("wheel",e=>{const o=t.scrollHeight-t.clientHeight,n=t.scrollWidth-t.clientWidth;let s=!1;if(e.deltaY&&o>0){const r=Math.min(o,Math.max(0,t.scrollTop+e.deltaY));r!==t.scrollTop&&(t.scrollTop=r,s=!0)}if(e.deltaX&&n>0){const r=Math.min(n,Math.max(0,t.scrollLeft+e.deltaX));r!==t.scrollLeft&&(t.scrollLeft=r,s=!0)}s&&(e.preventDefault(),e.stopPropagation())},{passive:!1}))}function Hi(){const t=(a.layoutWin||a.lastWin)?.document?.getElementById(u);t&&vs(t);for(const e of ct)v[e]?.requestMeasure()}function Ri(t,e){const o=ms(t),n={};for(const s of Et){const r=e.querySelector(`[data-sve-code-pane-btn="${s}"]`);n[s]=r?r.getAttribute("aria-pressed")==="true":o[s]}return n}function gs(t,e){for(const n of Et){const s=t.querySelector(`[data-sve-code-pane-btn="${n}"]`),r=t.querySelector(`[data-sve-code-pane="${n}"]`);s&&s.setAttribute("aria-pressed",e[n]?"true":"false"),r&&(r.style.display=e[n]?"flex":"none")}const o=Et.filter(n=>e[n]);t.querySelectorAll("[data-sve-code-split]").forEach(n=>{const s=n.getAttribute("data-sve-code-split-after"),r=o.indexOf(s);n.style.display=r>=0&&r<o.length-1?"block":"none"}),zi(t.ownerDocument.defaultView,t),vs(t)}function zi(t,e){const o=Oi(t);for(const n of Et){const s=e.querySelector(`[data-sve-code-pane="${n}"]`);s&&(s.style.flex=`${o[n]} 1 0`)}}function Wt(t,e){if(a.dragging)return;const o=t.document;Jo(o,e);const n=Mh(t),s=Ph(o),r=Oh(o);e.style.left=`${s}px`,e.style.right=`${r}px`,e.style.bottom="0",e.style.height=`${n}px`,Ho(o,n),vs(e)}function Wi(t,e,o,n){a.dragging=!0,Hl(t,e,o,()=>{a.dragging=!1,n?.()},"data-sve-code-drag-shield")}function Ni(t,e){if(e._sveResizeBound)return;e._sveResizeBound=!0;const o=n=>{if(n.button!==0||n.target.closest('button, a, input, select, textarea, label, [role="button"], [contenteditable], .cm-editor'))return;n.preventDefault();const s=n.clientY,r=e.getBoundingClientRect().height;let i=r;Wi(t,"ns-resize",l=>{i=Math.min(Math.max(Rs,r+(s-l.clientY)),Math.round(t.innerHeight*.7)),e.style.height=`${i}px`,Ho(t.document,i),Hi()},()=>{Lh(t,i),Wt(t,e),t.dispatchEvent(new Event("resize"))})};e.querySelector("[data-sve-code-bar]")?.addEventListener("mousedown",o),e.querySelector("[data-sve-code-grip]")?.addEventListener("mousedown",o)}function qi(t,e){e._sveSplitBound||(e._sveSplitBound=!0,e.querySelectorAll("[data-sve-code-split]").forEach(o=>{o.addEventListener("mousedown",n=>{if(n.button!==0)return;n.preventDefault(),n.stopPropagation();const s=o.getAttribute("data-sve-code-split-after"),r=Et.filter(k=>Ri(t,e)[k]),i=r.indexOf(s),l=r[i],c=r[i+1];if(!l||!c)return;const d=e.querySelector(`[data-sve-code-pane="${l}"]`),f=e.querySelector(`[data-sve-code-pane="${c}"]`),p=n.clientX,m=d.getBoundingClientRect().width,y=f.getBoundingClientRect().width,b=m+y;o.setAttribute("data-active",""),Wi(t,"col-resize",k=>{const L=k.clientX-p;let at=Math.max(Ye,Math.min(b-Ye,m+L)),M=b-at;b<Ye*2&&(at=m,M=y);const O=Oi(t);O[l]=at,O[c]=M,Bh(t,O),zi(t,e),Hi()},()=>{o.removeAttribute("data-active")})})}))}function Vi(t,e){e._svePaneBound||(e._svePaneBound=!0,e.querySelectorAll("[data-sve-code-pane-btn]").forEach(o=>{o.addEventListener("click",n=>{n.stopPropagation();const s=o.getAttribute("data-sve-code-pane-btn"),r=Ri(t,e),i={...r,[s]:!r[s]};!i.html&&!i.css&&!i.js&&(i[s]=!0),Fh(t,i),gs(e,i)})}))}function R(t,e){const o=t.getElementById(u)?.querySelector("[data-sve-code-status]");o&&(o.textContent=e||"")}function Ro(t,e){const o=t.getElementById(u)?.querySelector("[data-sve-code-path]");o&&(o.textContent=e||"",o.title=e||"")}function Nt(t){const e=t?.document?.getElementById(u)?.querySelector("[data-sve-code-back]");e&&(e.hidden=a.typeStack.length===0,e.title=h(t,"code_dock_back"),e.setAttribute("aria-label",e.title),e.innerHTML=tl)}function gn(t,e){const o=e.querySelector("[data-sve-code-back]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Gn(t)}))}let I,co,bs,ys,ks,Pt,ae,vt,Gt,gt,nt,xs,_s,Ss,zo,ws,$s,Cs,Ts,As,Es,Te,Ms,Ls,Fs,Bs,uo,fo,Ps,Ui,be=null,T=null;function Ki(){return be||(be=ml().then(t=>{T=t,I=T.view.EditorView,co=T.view.keymap,bs=T.view.lineNumbers,ys=T.view.highlightActiveLine,ks=T.view.highlightActiveLineGutter,Pt=T.state.Compartment,ae=T.state.EditorState,vt=T.state.StateField,Gt=T.state.StateEffect,gt=T.state.RangeSetBuilder,nt=T.view.Decoration,xs=T.commands.defaultKeymap,_s=T.commands.indentWithTab,Ss=T.commands.historyKeymap,zo=T.commands.history,ws=T.autocomplete.autocompletion,$s=T.autocomplete.closeBrackets,Cs=T.autocomplete.closeBracketsKeymap,Ts=T.autocomplete.closeCompletion,As=T.autocomplete.completionKeymap,Es=T.view.hoverTooltip,Te=T.langHtml.htmlLanguage,Ms=T.langHtml.html,Ls=T.langCss.css,Fs=T.langJs.javascript,T.language.HighlightStyle,T.language.syntaxHighlighting,Bs=T.language.codeFolding,uo=T.language.foldEffect,fo=T.language.unfoldEffect,Ps=T.language.foldedRanges,Ui=T.highlight.tags,Qt.html=new Pt,Qt.css=new Pt,Qt.js=new Pt,te.html=new Pt,te.css=new Pt,te.js=new Pt}).catch(t=>{throw be=null,t}),be)}const Gi="{{ _class }}",u=pl,Xi="__sve-code-dock-style",Y="__sve-code-dock-unlock",Os="sve-code-dock-height",Is="sve-code-dock-panes",Ds="sve-code-dock-widths",We="sve-html-scope-v2",js="sve-code-dock-autosave",Hs="sve-code-dock-style-mode",Wo="sve-code-dock-values",Yi=280,Rs=120,Ye=140,Zi=250,ct=["html","css","js"],Et=["html","css","alpine","js"],Ji='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',Qi='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-1"/></svg>',tl='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',zs='<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1c0 .966.784 1.75 1.75 1.75h.418A1.74 1.74 0 0 0 4 7.25v1.5c0 .49.201.932.525 1.25c-.324.318-.525.76-.525 1.25v1c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 14 12.25v-1c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1.5c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1A1.75 1.75 0 0 0 12.25 2zm8.5 7.5H8v-3h4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75M7 6.5v3H5.75A.75.75 0 0 1 5 8.75v-1.5a.75.75 0 0 1 .75-.75zm1 4h4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75H8zm-1 0V13H5.75a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-1-5V3h6.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75zm-1 0H3.75A.75.75 0 0 1 3 4.75v-1A.75.75 0 0 1 3.75 3H5z"/></svg>',el='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/><path d="M4.5 11.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/></svg>',ol='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 16.3A8.5 8.5 0 1 1 18.3 6.3"/><path d="M21 3.2v5.4h-5.4"/></svg>',nl='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',sl='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',x="__sve-css-menu",Ws=["h1","h2","h3","h4","h5","h6"],bn=[{id:"div",classes:"",lang:"code_dock_div_plain"},{id:"flex",classes:"flex",lang:"code_dock_div_flex"},{id:"flex-col",classes:"flex flex-col",lang:"code_dock_div_flex_col"},{id:"flex-row",classes:"flex flex-row",lang:"code_dock_div_flex_row"},{id:"container",classes:"wrapper",lang:"code_dock_div_container"}],po=[{id:"section",title:"section",tag:"section"},{id:"div",title:"div",menu:"div"},{id:"heading",title:"heading",menu:"heading"},{id:"text",title:"text",menu:"text"},{id:"a",title:"link",tag:"a"},{id:"img",title:"image",snippet:'<img src="" alt="">',caret:10},{id:"video",title:"video",snippet:'<video src="" controls playsinline></video>',caret:12},{id:"ul",title:"list",tag:"ul"},{id:"li",title:"list item",tag:"li"},{id:"component",title:"component",menu:"component"},{id:"loop",title:"loop",snippet:`{{ items }}

{{ /items }}
`,caret:3,select:5},{id:"pagination",title:"pagination",action:"pagination"},{id:"if",title:"if",snippet:`{{ if true }}

{{ /if }}
`,caret:6,select:4}],al=["--size-100","--size-200","--size-300","--size-400","--size-500","--size-600","--size-700","--size-800","--size-900","--gutter"],rl={"tw-text":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 13 5 3l3.5 10M2.7 10h4.6"/><path d="M12.5 3.5v9M11 5l1.5-1.5L14 5M11 11l1.5 1.5L14 11"/></svg>',"tw-leading":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h8.5M6 8h8.5M6 12.5h8.5"/><path d="M2.5 4.5v7M1.4 5.6 2.5 4.5l1.1 1.1M1.4 10.4l1.1 1.1 1.1-1.1"/></svg>',"tw-font":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.2V3h10v1.2M8 3v10M6 13h4"/></svg>',"tw-radius":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 13.5v-6a5 5 0 0 1 5-5h6"/><path d="M13.5 6.5v7h-7" stroke-dasharray="2 2"/></svg>',"tw-gap":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"tw-align":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3.5h12M2 8h8M2 12.5h10"/></svg>',"tw-w":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3.5v9M14 3.5v9"/><path d="M4.5 8h7"/><path d="M6 6.2 4.2 8 6 9.8M10 6.2 11.8 8 10 9.8"/></svg>',"tw-h":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 2h9M3.5 14h9"/><path d="M8 4.5v7"/><path d="M6.2 6 8 4.2 9.8 6M6.2 10 8 11.8 9.8 10"/></svg>',"tw-maxw":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3v10M14.5 3v10"/><path d="M5 8h6"/><path d="M6.6 6.2 4.8 8l1.8 1.8M9.4 6.2 11.2 8l-1.8 1.8"/></svg>',"tw-overflow":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="1.8" y="4.5" width="8.6" height="9.7" rx="1.2"/><path d="M6.5 1.8h7.7v7.7" stroke-linecap="round"/></svg>',"tw-border":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6"/><rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" stroke-width="1" opacity=".45"/></svg>',"tw-border-color":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6" stroke-dasharray="3.1 2.2"/><rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" fill="currentColor" stroke="none" opacity=".55"/></svg>'},il='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="10" width="18" height="11" rx="2"/><rect x="6" y="3" width="9" height="4" rx="1.4" fill="currentColor" stroke="none"/></svg>',ll='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.1 12a8.9 8.9 0 1 0 2.8-6.5L3 8"/><path d="M3 3.4V8h4.6"/><path d="M12 7.4V12l3 1.8"/></svg>',cl='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>',dl='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></svg>',ul='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/><path d="M3 17c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/></svg>',Ns=[["--gray-50","#fafafa"],["--gray-100","#f5f5f5"],["--gray-200","#e5e5e5"],["--gray-300","#d4d4d4"],["--gray-400","#a3a3a3"],["--gray-500","#737373"],["--gray-600","#525252"],["--gray-700","#404040"],["--gray-800","#262626"],["--gray-900","#171717"],["--gray-950","#0a0a0a"]],Fa=t=>[{id:`${t}-all`,icon:"box-all",title:"All sides",css:t,tw:t,menu:"spacing"},{id:`${t}-block`,icon:"box-block",title:"Top and bottom",css:`${t}-block`,tw:`${t}-block`,menu:"spacing",sep:!0},{id:`${t}-block-start`,icon:"box-block-start",title:"Top",css:`${t}-block-start`,tw:`${t}-top`,menu:"spacing"},{id:`${t}-block-end`,icon:"box-block-end",title:"Bottom",css:`${t}-block-end`,tw:`${t}-bottom`,menu:"spacing"},{id:`${t}-inline`,icon:"box-inline",title:"Left and right",css:`${t}-inline`,tw:`${t}-inline`,menu:"spacing",sep:!0},{id:`${t}-inline-start`,icon:"box-inline-start",title:"Left",css:`${t}-inline-start`,tw:`${t}-left`,menu:"spacing"},{id:`${t}-inline-end`,icon:"box-inline-end",title:"Right",css:`${t}-inline-end`,tw:`${t}-right`,menu:"spacing"}],jh=[{id:"display-flex",twClass:"flex",icon:"display-flex",title:"Flex",kind:"display",value:"flex",css:"display"},{id:"flex-row",twClass:"flex-row",icon:"flex-row",title:"Direction: row",kind:"flexDir",value:"row",css:"flex-direction",sep:!0},{id:"flex-col",twClass:"flex-col",icon:"flex-col",title:"Direction: column",kind:"flexDir",value:"column",css:"flex-direction"},{id:"justify-start",twClass:"justify-start",icon:"justify-start",title:"Justify: start",css:"justify-content",value:"flex-start",when:"flex",sep:!0},{id:"justify-center",twClass:"justify-center",icon:"justify-center",title:"Justify: center",css:"justify-content",value:"center",when:"flex"},{id:"justify-end",twClass:"justify-end",icon:"justify-end",title:"Justify: end",css:"justify-content",value:"flex-end",when:"flex"},{id:"justify-between",twClass:"justify-between",icon:"justify-between",title:"Justify: between",css:"justify-content",value:"space-between",when:"flex"},{id:"justify-around",twClass:"justify-around",icon:"justify-around",title:"Justify: around",css:"justify-content",value:"space-around",when:"flex"},{id:"align-start",twClass:"items-start",icon:"align-start",title:"Align: start",css:"align-items",value:"flex-start",when:"flex",sep:!0},{id:"align-center",twClass:"items-center",icon:"align-center",title:"Align: center",css:"align-items",value:"center",when:"flex"},{id:"align-end",twClass:"items-end",icon:"align-end",title:"Align: end",css:"align-items",value:"flex-end",when:"flex"},{id:"align-stretch",twClass:"items-stretch",icon:"align-stretch",title:"Align: stretch",css:"align-items",value:"stretch",when:"flex"}],Hh=[{id:"gap-all",icon:"gap-all",title:"Both",css:"gap",tw:"gap",menu:"spacing"},{id:"gap-row",icon:"gap-row",title:"Between rows",css:"row-gap",tw:"row-gap",menu:"spacing",sep:!0},{id:"gap-col",icon:"gap-col",title:"Between columns",css:"column-gap",tw:"column-gap",menu:"spacing"}],Rh=["1px","2px","3px","4px","8px"],Ot=(t,e,o,n,s,r)=>({id:t,icon:e,title:o,css:n,menu:"choices",choices:Rh,twGroup:[s,`${s}-2`,`${s}-4`,`${s}-8`],...r?{sep:!0}:{}}),zh=[Ot("bw-all","bd-all","All sides","border-width","border"),Ot("bw-block","bd-block","Top and bottom","border-block-width","border-y",!0),Ot("bw-top","bd-top","Top","border-block-start-width","border-t"),Ot("bw-bottom","bd-bottom","Bottom","border-block-end-width","border-b"),Ot("bw-inline","bd-inline","Left and right","border-inline-width","border-x",!0),Ot("bw-left","bd-left","Left","border-inline-start-width","border-l"),Ot("bw-right","bd-right","Right","border-inline-end-width","border-r")],Wh=[{id:"bd-all",icon:"bd-all",title:"All sides",css:"border-color",tw:"border-color",menu:"colors"},{id:"bd-block",icon:"bd-block",title:"Top and bottom",css:"border-block-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-top",icon:"bd-top",title:"Top",css:"border-block-start-color",tw:"border-top-color",menu:"colors"},{id:"bd-bottom",icon:"bd-bottom",title:"Bottom",css:"border-block-end-color",tw:"border-bottom-color",menu:"colors"},{id:"bd-inline",icon:"bd-inline",title:"Left and right",css:"border-inline-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-left",icon:"bd-left",title:"Left",css:"border-inline-start-color",tw:"border-left-color",menu:"colors"},{id:"bd-right",icon:"bd-right",title:"Right",css:"border-inline-end-color",tw:"border-right-color",menu:"colors"}],Nh=[{id:"rd-all",icon:"rd-all",title:"All corners",css:"border-radius",tw:"border-radius",menu:"values"},{id:"rd-tl",icon:"rd-tl",title:"Top left",css:"border-start-start-radius",tw:"border-top-left-radius",menu:"values",sep:!0},{id:"rd-tr",icon:"rd-tr",title:"Top right",css:"border-start-end-radius",tw:"border-top-right-radius",menu:"values"},{id:"rd-br",icon:"rd-br",title:"Bottom right",css:"border-end-end-radius",tw:"border-bottom-right-radius",menu:"values"},{id:"rd-bl",icon:"rd-bl",title:"Bottom left",css:"border-end-start-radius",tw:"border-bottom-left-radius",menu:"values"}],qs=[{id:"display",title:"Display",css:"display",tw:"display",kids:jh},{id:"absolute",title:"Position",css:"position",tw:"position",value:"absolute"},{id:"color",title:"Text color",css:"color",tw:"color",menu:"colors"},{id:"bg",title:"Background color",css:"background-color",tw:"background-color",menu:"colors"},{id:"padding",title:"Padding",css:"padding",tw:"padding",kids:Fa("padding")},{id:"margin",title:"Margin",css:"margin",tw:"margin",kids:Fa("margin")},{id:"tw-text",title:"Font size",css:"font-size",tw:"font-size",menu:"values"},{id:"tw-leading",title:"Line height",css:"line-height",tw:"line-height",menu:"values"},{id:"tw-font",title:"Font family",css:"font-family",tw:"font-family",menu:"values"},{id:"tw-align",title:"Text align",css:"text-align",tw:"text-align",menu:"choices",choices:["left","center","right","justify"]},{id:"tw-border",title:"Border",css:"border-width",tw:"border-width",kids:zh},{id:"tw-border-color",title:"Border color",css:"border-color",tw:"border-color",kids:Wh},{id:"tw-radius",title:"Radius",css:"border-radius",tw:"border-radius",kids:Nh},{id:"tw-gap",title:"Gap",css:"gap",tw:"gap",kids:Hh},{id:"tw-w",title:"Width",css:"width",tw:"width",menu:"sizes"},{id:"tw-h",title:"Height",css:"height",tw:"height",menu:"sizes"},{id:"tw-maxw",title:"Max width",css:"max-width",tw:"max-width",menu:"sizes"},{id:"tw-overflow",title:"Overflow",css:"overflow",tw:"overflow",menu:"choices",choices:["visible","hidden","clip","auto","scroll"]}],fl=["100%","auto","fit-content","min-content","max-content","100vw","100dvh","0"],Ae=new Map;for(const t of qs){Ae.set(t.id,{tool:t,kid:null});for(const e of t.kids||[])Ae.set(e.id,{tool:t,kid:e})}const yn={display:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2.5" width="13" height="11" rx="1.2"/><path d="M5 6.5h6M5 9.5h4"/></svg>',"display-flex":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="3.4" height="9" rx=".4"/><rect x="6.3" y="3.5" width="3.4" height="9" rx=".4"/><rect x="10.6" y="3.5" width="3.4" height="9" rx=".4"/></svg>',"flex-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12"/><path d="M4.2 5.8 2 8l2.2 2.2"/><path d="M11.8 5.8 14 8l-2.2 2.2"/></svg>',"flex-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v12"/><path d="M5.8 4.2 8 2l2.2 2.2"/><path d="M5.8 11.8 8 14l2.2-2.2"/></svg>',"justify-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="5.4" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4.6" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="8.2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-between":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-around":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"align-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="5.4" width="9" height="2.4" rx=".4"/></svg>',"align-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="4.6" width="9" height="2.4" rx=".4"/><rect x="3.5" y="9" width="9" height="2.4" rx=".4"/></svg>',"align-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="8.2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="11.6" width="9" height="2.4" rx=".4"/></svg>',"align-stretch":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx=".5"/><rect x="9" y="2" width="4" height="12" rx=".5"/></svg>',absolute:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>',color:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.4 11.2 7.4 2.4l4 8.8"/><path d="M4.7 8.4h5.4"/><rect x="1.6" y="12.8" width="12.8" height="2.2" rx=".6" fill="currentColor" stroke="none"/></svg>',bg:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 1.9a6.1 6.1 0 1 0 0 12.2c.85 0 1.35-.55 1.35-1.25 0-.38-.18-.66-.4-.88a1.2 1.2 0 0 1 .85-2.05h1.3A3.5 3.5 0 0 0 14.1 6.1C14.1 3.75 11.4 1.9 8 1.9Z"/><circle cx="4.9" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="8" cy="4.8" r=".95" fill="currentColor" stroke="none"/><circle cx="11.1" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="4.7" cy="9.9" r=".95" fill="currentColor" stroke="none"/></svg>',padding:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/></svg>',margin:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/><path d="M2 2.5h12M2 13.5h12M2.5 2v12M13.5 2v12" stroke-dasharray="1.4 1.2"/></svg>',"box-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".4" fill="currentColor" stroke="none"/></svg>',"box-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"gap-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"gap-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="3" y="1.6" width="10" height="4.2" rx=".6"/><rect x="3" y="10.2" width="10" height="4.2" rx=".6"/><path d="M4.5 8h7"/></svg>',"gap-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"bd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4"/></svg>',"bd-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-top":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-bottom":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-left":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-right":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"rd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="3.4"/></svg>',"rd-tl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6H6a3.4 3.4 0 0 0-3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M2.6 9V6A3.4 3.4 0 0 1 6 2.6h3" stroke-width="2.2"/></svg>',"rd-tr":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6h7.4a3.4 3.4 0 0 1 3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M7 2.6h3A3.4 3.4 0 0 1 13.4 6v3" stroke-width="2.2"/></svg>',"rd-br":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6v7.4a3.4 3.4 0 0 1-3.4 3.4H2.6" stroke-width="1" opacity=".35"/><path d="M13.4 7v3a3.4 3.4 0 0 1-3.4 3.4H7" stroke-width="2.2"/></svg>',"rd-bl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6v7.4a3.4 3.4 0 0 0 3.4 3.4h7.4" stroke-width="1" opacity=".35"/><path d="M2.6 7v3A3.4 3.4 0 0 0 6 13.4h3" stroke-width="2.2"/></svg>'},v={html:null,css:null,js:null},Qt={html:null,css:null,js:null},te={html:null,css:null,js:null},om=Object.freeze(Object.defineProperty({__proto__:null,ARMED_KEY:Rl,AUTOSAVE_ICON:ol,AUTOSAVE_KEY:js,BACK_ICON:tl,CSS_ADD_ICON:sl,CSS_GRAYS:Ns,CSS_LENGTHS:fl,CSS_MENU_ID:x,CSS_MODE_ICON:cl,CSS_SIZE_KEY:Oo,CSS_SPACING:al,CSS_STATES:Io,CSS_STATE_KEY:ao,CSS_TOOLS:qs,CSS_TOOL_ICONS:yn,CSS_TOOL_INDEX:Ae,DATA_ICON:el,DATA_MENU_ID:_t,DEFAULT_HEIGHT:Yi,DOCK_ID:u,get Decoration(){return nt},get EditorState(){return ae},get EditorView(){return I},HANDLES:ct,HEIGHT_KEY:Os,HISTORY_ICON:ll,HTML_DIVS:bn,HTML_HEADINGS:Ws,HTML_TOOLS:po,ID_MODE_ICON:dl,LOCK_CLOSED_ICON:Ji,LOCK_OPEN_ICON:Qi,MIN_HEIGHT:Rs,MIN_PANE:Ye,PANES:Et,PANES_KEY:Is,get RangeSetBuilder(){return gt},SAVE_ICON:nl,SAVE_MS:Zi,SCOPE_CLASS:Gi,SCOPE_ICON:zs,SCOPE_KEY:We,STRIP_ICON:il,STYLE_ID:Xi,STYLE_MODE_KEY:Hs,get StateEffect(){return Gt},get StateField(){return vt},TW_MODE_ICON:ul,TW_TOOL_ICONS:rl,UNLOCK_ID:Y,VALUES_MODE_KEY:Wo,WIDTHS_KEY:Ds,addClassButton:Nu,addClassToPickedTag:Tr,applyCssFolds:Ut,applyCssScope:pt,applyDisplay:Ur,applyFlexDirection:Vr,applyHtmlTag:Mo,applyRuleDecls:Q,applyStyleMode:ns,get autocompletion(){return ws},autosaveEnabled:Co,bindAntlersSnippets:Li,bindAutosave:on,bindBack:gn,bindCssAddClass:jr,bindCssTools:gi,bindDataVars:Mi,bindHistory:ri,bindHtmlScope:an,bindHtmlTidy:bi,bindHtmlTools:yi,bindLayoutWatch:ji,bindLock:en,bindPaneToggles:Vi,bindResize:Ni,bindSplitters:qi,bindStrip:ai,bindStyleMode:vi,bindVisualEditSnippets:Fi,clearCssFocus:Tu,clearHtmlScopeRange:ue,get closeBrackets(){return $s},get closeBracketsKeymap(){return Cs},closeCodeDock:us,closeCodeDockPopups:Zu,get closeCompletion(){return Ts},closeCssMenu:w,closeCssMenuPicked:se,closeDataMenu:D,get cm(){return T},codeDockStyleMode:cp,get codeFolding(){return Bs},get completionKeymap(){return As},get css(){return Ls},cssEditorText:Qn,cssPaneRoot:Be,cssRuleAtCursor:De,cssSizeRow:Fo,cssSizeRows:ht,cssStateSuffix:he,currentFlexDecls:et,currentFullHtml:St,currentSectionValues:To,currentTemplateType:mt,get defaultKeymap(){return xs},dispatchHtmlChanges:yt,editableOf:te,editors:v,ensureStyle:Ii,ensureTwCss:Nn,enterValuesRule:os,finishHtmlEdit:j,flushBracketSync:wr,flushCssScope:U,flushCssToHtml:$r,flushSave:V,get foldEffect(){return uo},get foldedRanges(){return Ps},goBackTemplate:Gn,get highlightActiveLine(){return ys},get highlightActiveLineGutter(){return ks},get history(){return zo},get historyKeymap(){return Ss},hookDataMenu:hs,get hoverTooltip(){return Es},get html(){return Ms},htmlEditorText:Yn,htmlElementAtCursor:fe,htmlFocusOk:At,get htmlLanguage(){return Te},htmlScopeEnabled:le,htmlTargetFromCursor:Bt,inAttributeValue:Ei,inDynamicAttribute:Ai,indentFromPrevious:pe,get indentWithTab(){return _s},insertAiSnippet:ds,insertHtmlElement:Eo,insertHtmlSnippet:oe,isChromeTemplateType:ee,isCodeDockArmed:Na,isCodeDockLocked:ft,isCodeDockOpen:cs,isPanelFrame:Pi,get javascript(){return Fs},get keymap(){return co},languageOf:Bi,leadingCssIndent:kt,lineIndentOf:J,get lineNumbers(){return bs},loadCm:Ki,loadTemplate:Kt,mergedCssFull:to,mountEditor:oi,newSizeBlockSpot:es,newSizeQuery:Ce,normalizeFlexValue:H,observeDockLayout:jo,onEditorInput:X,openAddClass:Dr,openCssChoiceMenu:Yr,openCssColorMenu:Xr,openCssSpacingMenu:Zr,openCssValueMenu:dn,openDataVarsMenu:fs,openHtmlComponentMenu:Ir,openHtmlDivMenu:Or,openHtmlTagMenu:cn,openNestedTemplate:Kn,openPickerMenu:ps,openRenameClassMenu:Ar,paintAlpine:He,paintAutosave:Z,paintBack:Nt,paintCssHead:ot,paintCssIdMark:Lo,paintCssToolState:P,paintHostWait:ni,paintHtmlScope:K,paintHtmlToolState:Oe,paintLock:Tt,paintPaneButtons:gs,paintStrip:zt,paintStyleMode:Re,paintValuesMode:Po,pickHtmlTagAtCursor:Lr,pickerButton:ze,placeCssMenu:z,placeDataMenu:jt,placeDock:Wt,previewBottomPad:Ho,primeTailwindCompile:Wn,readOnlyOf:Qt,readParts:Ie,refreshCodeDockFromDisk:Si,refreshPreview:Se,relayoutCodeDock:wi,rememberBracketNames:ce,rememberCssSelectors:Lt,resetTailwindCompile:zn,sameParts:ne,sectionDataRows:kh,setAll:li,setCodeDockArmed:zl,setHtmlAll:sn,setPath:Ro,setStatus:R,setValuesMode:ii,shieldDock:vn,showHtmlFull:Ao,showHtmlScope:Pe,stopObservingDockLayout:Di,storedPanes:ms,syncCodeDock:gh,syncHtmlTree:eo,syncScopedHtml:Mt,syncTwTarget:me,get tags(){return Ui},templateDockAllowed:Wa,tidyHtmlPane:Jn,toggleAll:ci,toggleHtmlPagination:Pr,get unfoldEffect(){return fo},writeHandleEditor:de,writeHtmlEditor:Vt,writeParts:Ft},Symbol.toStringTag,{value:"Module"}));export{qe as V,St as a,Nu as b,T as c,a as d,j as e,Kc as f,mt as g,Gc as h,Fn as i,fe as j,om as k,Vf as l,Dr as o,kh as s};
