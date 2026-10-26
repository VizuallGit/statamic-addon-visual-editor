const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-BqsL3ULf.js","./tw-candidates-CSP7aVNi.js","./help-editor-Cgu95M_S.js","./addon-C8wdRXoj.js","./protocol-BVdEmGBQ.js","./shortcuts-BBrEL-OT.js","./addon-BIr7wDW0.css","./lp-cluster-DGdBTid6.js","./ChoiceDialog-_CM1FrtC.js","./ChoiceDialog-C1GDnWs9.css","./ai-text-icon-B7uCWIwa.js","./lp-cluster-DkH5EaZz.css","./css-scope-mT3oQaBR.js","./loop-inspector-9DQBUpyx.js","./component-extract-DQjVRLDz.js","./component-extract-OeU4ApI5.css","./codemirror-Byd0mDPO.js","./html-tag-sync-BpXNELva.js","./index-M2RCOyrL.js","./index-B5fiB6ig.js","./index-sh1K8s4m.js","./index-0IxPFT_m.js","./index-Ci-3qkVd.js","./index-DkhC0r6-.js","./index-B4S9JIPB.js","./index-BwRQ94Ql.js","./index-D9YSa79V.js","./index-DwJNgNWz.js","./utility-paint-DXCEnfCB.js","./utilities-DNDSVzBx.js"])))=>i.map(i=>d[i]);
import{H as _a,d as Sa,ad as Ji}from"./shortcuts-BBrEL-OT.js";import{v as Qi,l as tl}from"./codemirror-Byd0mDPO.js";import{o as _,c as S,a as g,t as A,e as el,F as W,i as it,w as M,m as wa,k as dn,u as $,af as Oo,f as z,a0 as ol,s as h,r as Bt,g as $a,a4 as Wo,Z as me,j as Ca,$ as Vt,ad as Ta,b as st,d as U,x as lo,_ as un,ai as nl,p as lt,q as It,C as Is,D as sl,V as fn,ah as pn,al,z as rl,ag as il,l as xt,B as ge,aC as ll,A as cl}from"./addon-C8wdRXoj.js";import{b as Q,i as Aa,o as co,j as Io,t as dl,k as Ea,l as ul,m as fl,g as hn,n as pl,q as Se,u as hl,v as No,w as Ma,x as ml,y as vl,T as gl,z as La,A as Fa,B as mn,C as vn,D as Ba,E as uo,F as qo,G as bl,H as Ds,I as js,J as yl,K as kl,L as Vo,M as xl,N as _l,O as Pa,P as Oa,Q as E,R as Sl,S as Hs,U as wl,V as $l,W as Cl}from"./lp-cluster-DGdBTid6.js";import{h as Rs,f as Ia,a as Tl,b as Al,c as we,t as gn,d as Da,m as ja,e as Ha,g as Ra,i as El,s as Zt,r as zs,j as Ml,k as za,l as ne,p as $e,n as bn,o as Ll,q as Fl,u as Bl,v as Pl,w as Wa,x as Na,y as Ol,z as qa,A as yn,B as Il,C as Dl,D as jl,E as Hl,F as Rl,G as zl,H as Wl,I as Ws,P as je}from"./css-scope-mT3oQaBR.js";import{_ as Va,o as kn,C as Nl,m as R,N as Ua}from"./ChoiceDialog-_CM1FrtC.js";import{M as Ka,S as Ga}from"./protocol-BVdEmGBQ.js";import{t as ql}from"./tw-candidates-CSP7aVNi.js";import{c as Xa,a as Ya,t as Za,b as Vl,d as Ul,w as Kl,e as Gl,f as Xl,g as Ns,h as Yl,i as Zl,j as Jl,k as Ql,l as tc,s as ec,m as Ja,n as oc,o as Uo,r as nc,p as sc,q as ac,u as Do,v as rc,H as Qa,x as ic,y as lc,z as cc,A as xn,B as dc,_ as tr}from"./component-extract-DQjVRLDz.js";import{h as uc,a as fc,e as pc,i as fo,A as qs,b as hc,c as mc,d as Ue}from"./html-tag-sync-BpXNELva.js";import{paintUtilities as Vs,swapSiteCss as vc,classTokens as gc}from"./utility-paint-DXCEnfCB.js";import{u as bc,a as yc,c as Us,w as kc}from"./utilities-DNDSVzBx.js";const ht="__sve-css-rename-chip",xc='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';function _c(t){const e=t.Decoration.mark({class:"sve-cm-css-token"}),o=t.StateEffect.define();return{extensions:[t.StateField.define({create(){return t.Decoration.none},update(s,r){let i;for(const c of r.effects)c.is(o)&&(i=c.value);if(i===void 0)return r.docChanged?t.Decoration.none:s;if(!i)return t.Decoration.none;const l=new t.RangeSetBuilder;return l.add(i.from,i.to,e),l.finish()},provide:s=>t.EditorView.decorations.from(s)})],setHover(s,r){s&&s.dispatch({effects:o.of(r)})}}}function vt(t){t?.getElementById(ht)?.remove()}function Sc(t,e,o,n){e.style.left=`${Math.max(6,Math.min(o,t.innerWidth-28))}px`,e.style.top=`${Math.max(6,n)}px`}function wc(t,e,o,{onRename:n,title:s}){const r=t.document,i=e.coordsAtPos(o.to);if(!i)return;vt(r);const l=r.createElement("button");l.id=ht,l.type="button",l.innerHTML=xc,l.title=s,l.setAttribute("aria-label",s),l.addEventListener("mousedown",c=>{c.preventDefault(),c.stopPropagation(),vt(r),n?.(o)}),l.addEventListener("mouseleave",()=>{t.setTimeout(()=>{e.dom.matches(":hover")||l.matches(":hover")||vt(r)},120)}),r.body.appendChild(l),Sc(t,l,i.right+2,i.top-1)}function $c(t,e,{onRename:o,isLocked:n,setHover:s,title:r}){if(!e?.dom||e.dom._sveClassTokenBound)return;e.dom._sveClassTokenBound=!0;let i=null,l="";const c=()=>!!n?.(),d=()=>{t.clearTimeout(i),i=null,l="",s?.(e,null),vt(t.document)},p=f=>{if(c()){d();return}d(),o?.(f)};e.dom.addEventListener("mousemove",f=>{if(c()){d();return}if(f.target?.closest?.(`#${ht}`))return;const m=e.posAtCoords({x:f.clientX,y:f.clientY});if(m==null)return;const y=Rs(e.state.doc.toString(),m);if(!y){t.clearTimeout(i),i=null,l="",s?.(e,null);return}const b=`${y.from}:${y.to}:${y.name}`;s?.(e,{from:y.from,to:y.to}),!(l===b&&(i||t.document.getElementById(ht)))&&(t.clearTimeout(i),l=b,i=t.setTimeout(()=>{i=null,wc(t,e,y,{onRename:p,title:r||"Rename class"})},160))}),e.dom.addEventListener("mouseleave",f=>{f.relatedTarget?.closest?.(`#${ht}`)||t.setTimeout(()=>{t.document.getElementById(ht)?.matches(":hover")||d()},160)}),e.dom.addEventListener("dblclick",f=>{if(c())return;const m=e.posAtCoords({x:f.clientX,y:f.clientY});if(m==null)return;const y=Rs(e.state.doc.toString(),m);y&&(f.preventDefault(),f.stopPropagation(),p(y))},!0),e.scrollDOM?.addEventListener("scroll",d),t.document._sveClassTokenDismiss||(t.document._sveClassTokenDismiss=!0,t.document.addEventListener("mousedown",f=>{f.target.closest(`#${ht}`)||vt(t.document)}))}const a={cssColorsPromise:null,lastUid:null,lastType:null,typeStack:[],beforePart:null,lastParts:{html:"",css:"",js:""},lastProps:[],propsDirty:!1,lastLocked:!1,lockReady:!1,lastWin:null,loadGen:0,saveTimer:null,lastBracketNames:null,lastCssSelectorNames:null,saveInFlight:null,loadInFlight:null,dragging:!1,applying:!1,htmlScopePref:!0,htmlScopeActive:!1,styleMode:"css",cssToolRow:null,cssOpenTool:"",cssOpenMenu:"",cssValues:!1,cssAll:!1,htmlAll:!1,twCss:null,twKey:"",twBusy:!1,twDirty:!1,htmlFocus:null,cssFocus:null,htmlFull:"",cssFull:"",cssPane:"full",cssScopeSnapshot:"",layoutObserver:null,layoutWin:null,observedEditor:null,observedRight:null,layoutWatchBound:!1,cssSize:"",cssState:"",cssOwnFolds:new Set,cssFoldSig:"",htmlPartialUi:null,htmlAntlersUi:null,htmlClassTokenUi:null,htmlLintUi:null,cssGhostUi:null},Kt=new Map,Ks={scope:null,section:[],page:[],site:[]};function _n(t){const e=t?.location?.pathname?.match(/\/collections\/([^/]+)\//);return e?e[1]:""}function Sn(t){const e=String(t||"").trim();return!e||/^(header|footer)\//.test(e)?"":e}function Cc(t){return(Array.isArray(t)?t:[]).filter(e=>e?.handle).map(e=>`${e.kind==="collection"?"collection":"field"}:${e.handle}`).join("|")}function wn({collection:t,set:e,view:o,scope:n}){return`${t}::${e}::${o||""}::${n||""}`}function er(t){return Kt.get(t)||null}function $n(t,{collection:e,set:o,view:n,scope:s}){const r=wn({collection:e,set:o,view:n,scope:s}),i=Kt.get(r);if(i)return Promise.resolve(i);const l=new URLSearchParams;return e&&l.set("collection",e),o&&l.set("set",o),n&&l.set("view",n),s&&l.set("scope",s),t.fetch(`/!/sve/data-vars?${l.toString()}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(c=>c.ok?c.json():null).then(c=>{const d=c&&typeof c=="object"?c:Ks;return Kt.set(r,d),d}).catch(()=>Ks)}function Tc(t){if(!t){Kt.clear();return}const e=`::${t}::`;for(const o of[...Kt.keys()])o.includes(e)&&Kt.delete(o)}function Ac(t){if(t==null||t==="")return"";if(typeof t=="boolean")return t?"true":"false";if(Array.isArray(t))return t.length?`${t.length} ×`:"";if(typeof t=="object"){const o=Object.keys(t).length;return o?`${o} ×`:""}const e=String(t).replace(/\s+/g," ").trim();return e.length>60?`${e.slice(0,60)}…`:e}function Ec(t,e){return e.split(".").reduce((o,n)=>o&&typeof o=="object"?o[n]:void 0,t)}function Cn(t,e){return!Array.isArray(t)||!e||typeof e!="object"?t||[]:t.map(o=>{if(o.parent||o.value!=null||o.var.includes(":"))return o;const n=Ac(Ec(e,o.var));return n?{...o,value:n}:o})}function Mc(t,e){return Array.isArray(t)?t.map(o=>({...o,items:Cn(o.items,e)})):[]}function Lc(t,e,{inline:o=!1}={}){const n=String(t?.var||"").trim();if(!n)return null;if(o)return{text:`{{ ${n} }}`,cursor:`{{ ${n} }}`.length};if(t.loop)return{text:`{{ ${n} }}
  
{{ /${n} }}`,cursor:`{{ ${n} }}
  `.length};if(e?.loop&&!t.parent){const s=e.loop;return{text:`{{ ${s} }}
  {{ ${n} }}
{{ /${s} }}`,cursor:`{{ ${s} }}
  {{ ${n} }}`.length}}return{text:`{{ ${n} }}`,cursor:`{{ ${n} }}`.length}}const He="visual_edit",Gs=[{id:"base",lang:"code_dock_visual_edit_base"},{id:"field",lang:"code_dock_visual_edit_field"}],or=[{id:"tag",group:"base",label:"{{ visual_edit }}",standalone:"{{ visual_edit| }}"},{id:"ve_popup",group:"base",label:"popup",attr:'popup="true"'},{id:"ve_orderable",group:"base",label:"orderable",attr:'orderable="true"'},{id:"ve_section_orderable",group:"base",label:"section_orderable",attr:'section_orderable="true"'},{id:"ve_outline_inside",group:"base",label:"outline_inside",attr:'outline_inside="true"'},{id:"ve_field",group:"field",label:"field",attr:'field="|"'},{id:"ve_inline_edit",group:"field",label:"inline_edit",attr:'inline_edit="true"'},{id:"ve_insertable",group:"field",label:"insertable",attr:'insertable="true"'},{id:"ve_toolbar",group:"field",label:"toolbar",attr:'toolbar="true"'},{id:"ve_scope",group:"field",label:"scope",attr:'scope="|"'},{id:"ve_controls",group:"field",label:"controls",attr:'controls="|"'}];function Fc(t){return or.find(e=>e.id===t)||null}function Bc(t,e,o,n){let s=e;for(;s<o;){const r=t.indexOf("{{",s);if(r===-1||r>=o)return null;const i=t.indexOf("}}",r+2);if(i===-1||i+2>o)return null;const l=t.slice(r+2,i);if((l.trim().split(/\s+/)[0]||"")===n)return{openIdx:r,closeIdx:i,inner:l};s=i+2}return null}function Pc(t,e){const o=String(e).split("=")[0].trim();return new RegExp(`(^|\\s)${o}(=|\\s|$)`).test(t)}const Oc={class:"sve-code-dock"},Ic={"data-sve-code-bar":""},Dc={type:"button","data-sve-code-pane-btn":"html"},jc={type:"button","data-sve-code-pane-btn":"css"},Hc={type:"button","data-sve-code-pane-btn":"alpine"},Rc={type:"button","data-sve-code-pane-btn":"js"},zc={type:"button","data-sve-html-scope":"","aria-pressed":"true"},Wc=["innerHTML"],Nc={"data-sve-code-panes":""},qc={"data-sve-code-pane":"html"},Vc={"data-sve-code-pane-label":""},Uc=["title","aria-label"],Kc=["innerHTML"],Gc={"data-sve-code-pane":"css"},Xc={"data-sve-css-chrome":"subrow-2"},Yc={"data-sve-code-pane-label":""},Zc={"data-sve-css-label":""},Jc={"data-sve-code-pane":"alpine"},Qc={"data-sve-code-pane-label":""},td={"data-sve-code-pane":"js"},ed={"data-sve-code-pane-label":""},od={__name:"CodeDockChrome",props:{htmlLabel:{type:String,required:!0},cssLabel:{type:String,required:!0},jsLabel:{type:String,required:!0},alpineLabel:{type:String,required:!0},treeIcon:{type:String,required:!0},dataIcon:{type:String,required:!0},dataLabel:{type:String,required:!0}},setup(t){return(e,o)=>(_(),S("div",Oc,[o[21]||(o[21]=g("div",{"data-sve-code-grip":"","aria-hidden":"true"},null,-1)),g("div",Ic,[g("button",Dc,A(t.htmlLabel),1),g("button",jc,A(t.cssLabel),1),g("button",Hc,A(t.alpineLabel),1),g("button",Rc,A(t.jsLabel),1),o[0]||(o[0]=el('<button type="button" data-sve-code-back hidden></button><span data-sve-code-path></span><span data-sve-code-status></span><button type="button" data-sve-all></button><button type="button" data-sve-code-strip></button><button type="button" data-sve-code-history></button><button type="button" data-sve-style-mode></button><button type="button" data-sve-values-mode></button><button type="button" data-sve-code-autosave aria-pressed="true"></button><button type="button" data-sve-code-save hidden></button>',10)),g("button",zc,[g("span",{innerHTML:t.treeIcon},null,8,Wc)]),o[1]||(o[1]=g("button",{type:"button","data-sve-code-lock":"",hidden:""},null,-1))]),o[22]||(o[22]=g("div",{"data-sve-code-lock-banner":""},null,-1)),g("div",Nc,[g("div",qc,[g("div",Vc,[g("span",null,A(t.htmlLabel),1),o[2]||(o[2]=g("div",{"data-sve-html-tools":""},null,-1)),o[3]||(o[3]=g("button",{type:"button","data-sve-html-tidy":""},null,-1)),g("button",{type:"button","data-sve-data-vars":"",title:t.dataLabel,"aria-label":t.dataLabel},[g("span",{innerHTML:t.dataIcon},null,8,Kc)],8,Uc),o[4]||(o[4]=g("div",{"data-sve-visual-edit-tools":""},null,-1)),o[5]||(o[5]=g("div",{"data-sve-help-tools":""},null,-1)),o[6]||(o[6]=g("div",{"data-sve-antlers-tools":""},null,-1)),o[7]||(o[7]=g("div",{"data-sve-snippet-tools":""},null,-1))]),o[8]||(o[8]=g("div",{"data-sve-html-problems":"",hidden:""},null,-1)),o[9]||(o[9]=g("div",{"data-sve-code-host":""},null,-1))]),o[18]||(o[18]=g("div",{"data-sve-code-split":"","data-sve-code-split-after":"html"},null,-1)),g("div",Gc,[g("div",Xc,[g("div",Yc,[g("span",Zc,A(t.cssLabel),1),o[10]||(o[10]=g("button",{type:"button","data-sve-css-add-class":""},null,-1)),o[11]||(o[11]=g("div",{"data-sve-css-tools":""},null,-1)),o[12]||(o[12]=g("div",{"data-sve-css-snippet-tools":""},null,-1))])]),o[13]||(o[13]=g("div",{"data-sve-css-head":""},null,-1)),o[14]||(o[14]=g("div",{"data-sve-code-host":""},null,-1)),o[15]||(o[15]=g("div",{"data-sve-tw-host":""},null,-1))]),o[19]||(o[19]=g("div",{"data-sve-code-split":"","data-sve-code-split-after":"css"},null,-1)),g("div",Jc,[g("div",Qc,[g("span",null,A(t.alpineLabel),1)]),o[16]||(o[16]=g("div",{"data-sve-alpine-host":""},null,-1))]),o[20]||(o[20]=g("div",{"data-sve-code-split":"","data-sve-code-split-after":"alpine"},null,-1)),g("div",td,[g("div",ed,[g("span",null,A(t.jsLabel),1)]),o[17]||(o[17]=g("div",{"data-sve-code-host":""},null,-1))])])]))}};let fe=null,Xs=0,Ys=!1;function Tn(t){const e=Xa(Q("dock:current-type")),o=Ya(e);Aa({source:Ga,type:Ka.SVE_COMPONENT_FOCUS,on:!!o,name:e?String(e).split("/").pop():"",selector:o||""},t)}function po(t){const e=Q("dock:html"),o=[...new Set((typeof e=="string"?Ia(e):[]).map(n=>n.src))];Aa({source:Ga,type:Ka.SVE_COMPONENT_MAP,items:o.map(n=>({src:n,name:String(n).split("/").pop(),selector:Ya(n)})).filter(n=>n.selector)},t)}function nd(t){fe=t,!Ys&&(Ys=!0,co("dock:html-changed",()=>{fe&&(fe.clearTimeout(Xs),Xs=fe.setTimeout(()=>po(fe),400))}))}const sd=["data-sve-html-tool","data-tip","aria-label","data-letter","onClick","onContextmenu"],ad=["innerHTML"],rd={__name:"CodeDockHtmlTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(t){return(e,o)=>(_(!0),S(W,null,it(t.tools,n=>(_(),S("button",{key:n.id,type:"button","data-sve-html-tool":n.id,"data-tip":n.title,"aria-label":n.title,"data-letter":n.letter?"":void 0,onClick:M(s=>t.onTool(n.id),["prevent","stop"]),onContextmenu:M(s=>t.onTool(n.id),["prevent"])},[n.letter?(_(),S(W,{key:0},[wa(A(n.letter),1)],64)):(_(),S("span",{key:1,innerHTML:n.icon},null,8,ad))],40,sd))),128))}},_t=dn({tools:[],onTool:null,onKid:null}),id=["data-sve-css-item"],ld=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],cd={key:0,"data-sve-css-kids":""},dd={key:0,"data-sve-css-sep":"","aria-hidden":"true"},ud=["data-sve-css-kid","data-sve-css-box-side","data-tip","aria-label","innerHTML","onClick","onContextmenu"],fd={__name:"CodeDockCssTools",setup(t){return(e,o)=>(_(!0),S(W,null,it($(_t).tools,n=>(_(),S("li",Oo({key:n.id,"data-sve-css-item":n.id},{ref_for:!0},n.open?{"data-sve-css-open":""}:{}),[g("button",Oo({type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title},{ref_for:!0},{...n.active?{"data-active":""}:{},...n.open?{"data-open":""}:{}},{innerHTML:n.icon,onClick:M(s=>$(_t).onTool?.(n.id),["prevent","stop"]),onContextmenu:M(s=>$(_t).onTool?.(n.id),["prevent"])}),null,16,ld),n.open&&n.kids.length?(_(),S("div",cd,[(_(!0),S(W,null,it(n.kids,s=>(_(),S(W,{key:s.id},[s.sep?(_(),S("span",dd)):z("",!0),g("button",Oo({type:"button","data-sve-css-kid":s.id,"data-sve-css-box-side":s.id,"data-tip":s.title,"aria-label":s.title},{ref_for:!0},s.active?{"data-active":""}:{},{innerHTML:s.icon,onClick:M(r=>$(_t).onKid?.(n.id,s.id),["prevent","stop"]),onContextmenu:M(r=>$(_t).onKid?.(n.id,s.id),["prevent"])}),null,16,ud)],64))),128))])):z("",!0)],16,id))),128))}},pd=1.5,hd=16;function nr(t,e){const o=parseFloat(t);return Number.isFinite(o)?e==="em"||e==="rem"?o*hd:o:null}function md(t){const e=String(t||"").toLowerCase(),o=/\bmax-width\b|\bwidth\s*<=?\s*[\d.]|[\d.](px|em|rem)\s*>=?\s*width\b/.test(e),n=/\bmin-width\b|\bwidth\s*>=?\s*[\d.]|[\d.](px|em|rem)\s*<=?\s*width\b/.test(e);if(o===n)return null;const s=o?[/\bmax-width\s*:\s*([\d.]+)(px|em|rem)/,/\bwidth\s*<=?\s*([\d.]+)(px|em|rem)/,/([\d.]+)(px|em|rem)\s*>=?\s*width\b/]:[/\bmin-width\s*:\s*([\d.]+)(px|em|rem)/,/\bwidth\s*>=?\s*([\d.]+)(px|em|rem)/,/([\d.]+)(px|em|rem)\s*<=?\s*width\b/];for(const r of s){const i=e.match(r);if(i){const l=nr(i[1],i[2]);return l===null?null:{px:l,side:o?"max":"min"}}}return null}function wt(t,e){const o=md(t);if(!o)return"";for(const n of e||[]){if(n.base)continue;const s=n.direction==="mobile";if((s?"min":"max")!==o.side)continue;const r=s?Number(n.min_px):nr(String(n.max||"").replace(/[a-z]+$/i,""),(String(n.max||"").match(/[a-z]+$/i)||[""])[0]);if(r!==null&&Number.isFinite(r)&&Math.abs(r-o.px)<=pd)return n.handle}return""}function ho(t){let e="",o=0;for(;o<t.length;){const n=mo(t,o);if(n!==o){e+=" ".repeat(n-o),o=n;continue}e+=t[o],o+=1}return e}function mo(t,e){if(t.startsWith("/*",e)){const o=t.indexOf("*/",e+2);return o===-1?t.length:o+2}if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?t.length:o+2}if(t[e]==='"'||t[e]==="'"){const o=t[e];for(let n=e+1;n<t.length;n+=1)if(t[n]==="\\")n+=1;else if(t[n]===o)return n+1;return t.length}return e}function vo(t){const e=String(t||""),o=[],n=(s,r,i=0)=>{let l=s,c=l;for(;l<r;){const d=mo(e,l);if(d!==l){l=d;continue}if(e[l]===";"){l+=1,c=l;continue}if(e[l]==="}")return;if(e[l]!=="{"){l+=1;continue}const p=ho(e.slice(c,l)),f=p.trim(),m=sr(e,l,r);if(m===-1)return;/^@media\b/i.test(f)?o.push({query:f.replace(/^@media\s*/i,"").trim(),from:c+p.search(/\S/),to:m+1,bodyFrom:l+1,bodyTo:m,depth:i}):/^@(?:import|charset|use)\b/i.test(f)||n(l+1,m,i+1),l=m+1,c=l}};return n(0,e.length,0),o}function sr(t,e,o){let n=0;for(let s=e;s<o;s+=1){const r=mo(t,s);if(r!==s){s=r-1;continue}if(t[s]==="{")n+=1;else if(t[s]==="}"&&(n-=1,n===0))return s}return-1}function se(t){const e=String(t||""),o=(n,s)=>{const r=[];let i=n,l=i;for(;i<s;){const c=mo(e,i);if(c!==i){i=c;continue}if(e[i]===";"){i+=1,l=i;continue}if(e[i]==="}")return r;if(e[i]!=="{"){i+=1;continue}const d=ho(e.slice(l,i)),p=d.trim(),f=sr(e,i,s);if(f===-1)return r;r.push({prelude:p,media:/^@media\b/i.test(p),query:p.replace(/^@media\s*/i,"").trim(),from:l+d.search(/\S/),to:f+1,bodyFrom:i+1,bodyTo:f,children:/^@(?:import|charset|use)\b/i.test(p)?[]:o(i+1,f)}),i=f+1,l=i}return r};return o(0,e.length)}function vd(t,e,o){const n=String(t||"");if(!o)return[];const s=(e||[]).find(d=>d.base),r=se(n),i=[],l=d=>d.media?wt(d.query,e)===o:d.children.some(l);if(s&&o===s.handle){const d=p=>{for(const f of p){if(f.media&&wt(f.query,e)){i.push({from:f.from,to:f.to});continue}d(f.children)}};return d(r),i}const c=(d,p,f)=>{const m=[];for(const b of d){if(b.media&&wt(b.query,e)===o){m.push({from:b.from,to:b.to,into:null});continue}l(b)&&m.push({from:b.from,to:b.to,into:b})}if(!m.length){f>p&&i.push({from:p,to:f});return}let y=p;for(const b of m)b.from>y&&i.push({from:y,to:b.from}),b.into&&c(b.into.children,b.into.bodyFrom,b.into.bodyTo),y=b.to;f>y&&i.push({from:y,to:f})};return c(r,0,n.length),i.filter(d=>n.slice(d.from,d.to).trim()!=="")}function gd(t,e){const o=String(t||""),n=[],s=i=>{for(const l of i){if((l.media&&wt(l.query,e)||/^#id-/.test(l.prelude))&&ho(o.slice(l.bodyFrom,l.bodyTo)).trim()===""){n.push(l);continue}s(l.children)}};if(s(se(o)),!n.length)return o;let r=o;for(const i of n.sort((l,c)=>c.from-l.from)){let l=i.from,c=i.to;const d=r.lastIndexOf(`
`,l-1)+1;for(r.slice(d,l).trim()===""&&(l=d);r[c]===" "||r[c]==="	";)c+=1;r[c]===`
`&&(c+=1),r=r.slice(0,l)+r.slice(c)}return r}function bd(t,e){const o=String(t||""),n=[],s=i=>ho(o.slice(i.bodyFrom,i.bodyTo)).trim()==="",r=i=>{for(const l of i){if((l.media&&wt(l.query,e)||/^#id-/.test(l.prelude))&&s(l)){n.push({from:l.from,to:l.to});continue}r(l.children)}};return r(se(o)),n}function Ke(t,e,o){const n=e||[],s=n.find(d=>d.base),r=[],i=d=>/^#id-/.test(d.prelude)||/^#\s*$/.test(d.prelude),l=(d,p)=>{for(const f of d){if(!f.media){l(f.children,p);continue}const m=wt(f.query,n)||p;if(o===m){r.push(f);continue}l(f.children,m)}},c=(d,p)=>{for(const f of d){if(f.media){c(f.children,wt(f.query,n)||p);continue}if(i(f)){const m=p||(s?s.handle:"");!o||o===m?r.push(f):l(f.children,m);continue}c(f.children,p)}};return c(se(String(t||"")),""),r.sort((d,p)=>d.from-p.from)}function An(t,e,o){return vo(t).filter(n=>wt(n.query,e)===o)}const C=dn({tag:"",scope:"",scopeElsewhere:[],scopeElsewhereTitle:"",onScopeImport:null,onTag:null,sizes:[],onSize:null,state:"",stateLabel:"",onState:null,canEdit:!1,note:""}),yd={class:"sve-css-head"},kd=["disabled"],xd={key:1,class:"sve-css-scope"},_d=["title","disabled"],Sd=["title","data-active","disabled","onClick"],wd=["data-active","disabled"],$d={key:3,class:"sve-css-note"},Cd={__name:"CodeDockCssHead",setup(t){return(e,o)=>(_(),S("div",yd,[$(C).tag?(_(),S("button",{key:0,type:"button",class:"sve-css-tag",disabled:!$(C).canEdit,onClick:o[0]||(o[0]=M(()=>{},["prevent","stop"])),onDblclick:o[1]||(o[1]=M(n=>$(C).onTag?.(n),["prevent","stop"]))},"<"+A($(C).tag)+">",41,kd)):z("",!0),$(C).scope?(_(),S("span",xd,A($(C).scope),1)):z("",!0),$(C).scope&&$(C).scopeElsewhere.length?(_(),S("button",{key:2,type:"button",class:"sve-css-scope-taken",title:$(C).scopeElsewhereTitle,disabled:!$(C).canEdit,onClick:o[2]||(o[2]=M(n=>$(C).onScopeImport?.(),["prevent","stop"]))},A($(C).scopeElsewhere.join(", ")),9,_d)):z("",!0),(_(!0),S(W,null,it($(C).sizes,n=>(_(),S("button",{key:n.key,type:"button","data-sve-css-size":"",title:n.title,"data-active":n.active?"":void 0,disabled:!$(C).canEdit,onClick:M(s=>$(C).onSize?.(n.key),["prevent","stop"])},A(n.label),9,Sd))),128)),g("button",{type:"button","data-sve-css-state":"","data-active":$(C).state?"":void 0,disabled:!$(C).canEdit,onClick:o[3]||(o[3]=M(n=>$(C).onState?.(n),["prevent","stop"]))},[wa(A($(C).stateLabel)+" ",1),o[4]||(o[4]=g("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[g("path",{d:"m6 9 6 6 6-6"})],-1))],8,wd),o[5]||(o[5]=g("span",{class:"sve-css-gap"},null,-1)),$(C).note?(_(),S("span",$d,A($(C).note),1)):z("",!0)]))}},Td=Va(Cd,[["__scopeId","data-v-22565303"]]),Ad={key:0,"data-sve-css-swatches":""},Ed=["data-sve-css-token","title","data-active","onClick"],Md={key:0,"data-sve-css-head-row":""},Ld={key:1,"data-sve-css-note-row":""},Fd=["data-sve-css-token","data-active","onClick"],Bd={"data-sve-css-choice-label":""},Pd={key:0,"data-sve-css-choice-hint":""},nt={__name:"CodeDockMenu",props:{kind:{type:String,required:!0},swatches:{type:Array,default:()=>[]},choices:{type:Array,default:()=>[]},onClear:{type:Function,default:null},onPick:{type:Function,required:!0}},setup(t){return(e,o)=>t.kind==="colors"?(_(),S("div",Ad,[g("button",{type:"button","data-sve-css-clear":"",title:"Clear",onClick:o[0]||(o[0]=M((...n)=>t.onClear&&t.onClear(...n),["prevent","stop"]))},[...o[1]||(o[1]=[g("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none",stroke:"currentColor","stroke-width":"1.5"},[g("path",{d:"M2 2l6 6M8 2L2 8"})],-1)])]),(_(!0),S(W,null,it(t.swatches,n=>(_(),S("button",{key:n.name,type:"button","data-sve-css-swatch":"","data-sve-css-token":n.name,title:n.name,"data-active":n.active?"":void 0,style:ol({background:n.hex||"transparent"}),onClick:M(s=>t.onPick(n.name),["prevent","stop"])},null,12,Ed))),128))])):(_(!0),S(W,{key:1},it(t.choices,n=>(_(),S(W,{key:n.value},[n.heading?(_(),S("span",Md,A(n.label),1)):n.note?(_(),S("span",Ld,A(n.label),1)):(_(),S("button",{key:2,type:"button","data-sve-css-choice":"","data-sve-css-token":n.token||void 0,"data-active":n.active?"":void 0,onClick:M(s=>t.onPick(n.value),["prevent","stop"])},[g("span",Bd,A(n.label),1),n.hint?(_(),S("span",Pd,A(n.hint),1)):z("",!0)],8,Fd))],64))),128))}},Od=2e4;let Pt=[],ar=0,he=null,jo=null;function rr(){return jo||(jo=qt.define()),jo}function ir(){return!!he&&Date.now()-ar<Od}function En(t){return ir()||(ar=Date.now(),he=t.fetch("/!/sve/site-css/defined",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{defined:[]}).then(e=>(Pt=Array.isArray(e?.defined)?e.defined:[],v.html?.dispatch({effects:rr().of(null)}),Pt)).catch(()=>(he=null,Pt))),he}function go(t){return t.document.getElementById(u)?.querySelector("[data-sve-code-path]")?.textContent.trim()||""}function Id(t,e){const o=go(t),n=new Map;for(const s of Pt){const r=n.get(s.name)||new Set;r.add(s.file===o?e:String(s.file).replace(/^.*\//,"")),n.set(s.name,r)}return[...n].map(([s,r])=>({name:s,detail:[...r].join(", ")})).sort((s,r)=>s.name.localeCompare(r.name))}function Mn(t,e){const o=go(t);return e?Pt.filter(n=>n.name===e&&n.file!==o):[]}const lr=t=>[...new Set(t.map(e=>String(e.file).replace(/^.*\//,"")))];function Ln(t,e){const o=Mn(t,e).map(r=>r.css).filter(Boolean).join(`
`);if(!o)return!1;const n=Q("dock:css");if(typeof n!="string")return!1;const s=Tl(n,e,o);return s!==n&&Q("dock:set-css",s)!==!1}function Dd(t,e){const o=t.doc.lineAt(e),n=e-o.from,s=/\bclass\s*=\s*(["'])/gi;let r;for(;r=s.exec(o.text);){const i=r[1],l=r.index+r[0].length,c=o.text.indexOf(i,l),d=c===-1?o.text.length:c;if(n<l||n>d)continue;const p=o.text.slice(l,d),f=Al(p),m=n-l;if(!f||m<f.innerFrom||m>f.innerTo)return null;const y=(p.slice(f.innerFrom,m).match(/[\w-]*$/)||[""])[0];return{from:e-y.length,typed:y}}return null}function jd(t){return e=>{const o=Dd(e.state,e.pos);return!o||!o.typed&&!e.explicit?null:En(t).then(n=>{const s=go(t),r=o.typed.toLowerCase(),i=new Map;for(const c of n){if(c.file===s||!String(c.name).toLowerCase().startsWith(r))continue;const d=i.get(c.name)||{files:[],css:[]};d.files.push(c),c.css&&d.css.push(c.css),i.set(c.name,d)}if(!i.size)return null;const l=[...i].slice(0,40).map(([c,d])=>({label:c,type:"class",detail:lr(d.files).join(", "),info:d.css.length?()=>{const p=t.document.createElement("pre");return p.textContent=d.css.join(`
`),p.style.cssText="margin:0;padding:.3em .5em;font:11px ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap",p}:void 0,apply:(p,f,m,y)=>{p.dispatch({changes:{from:m,to:y,insert:c},selection:{anchor:m+c.length}}),t.setTimeout(()=>Ln(t,c),0)}}));return{from:o.from,options:l,validFor:/^[\w-]*$/}})}}function Hd(t){const e=o=>{if(!Pt.length)return ot.none;const n=go(t),s=new ft;for(const r of we(o)){const i=Pt.filter(l=>l.name===r.name&&l.file!==n);i.length&&s.add(r.from,r.to,ot.mark({class:"sve-cm-class-taken",attributes:{title:h(t,"class_defined_in",{file:lr(i).join(", ")})}}))}return s.finish()};return ut.define({create:o=>e(o.doc.toString()),update:(o,n)=>n.docChanged||n.effects.some(s=>s.is(rr()))?e(n.state.doc.toString()):o,provide:o=>P.decorations.from(o)})}const Rd=/^\.[a-zA-Z_][\w-]*$/;function zd(t,e,o){return String(e||"").includes(o)?Ge(t).length===1:!1}function Ge(t){return se(t).filter(e=>/^@scope\b/i.test(e.prelude))}function Wd(t){const e=String(t||"");return se(e).filter(o=>Rd.test(o.prelude)?!e.slice(o.from,o.bodyFrom-1).includes("{{"):!1).map(o=>({from:o.from,to:o.to,name:o.prelude.slice(1)}))}function Nd(t,e,o){const n=String(t||"");if(!zd(n,e,o))return n;const s=Wd(n);if(!s.length)return n;const r=Ge(n)[0],i=Ud(n,r),l=s.map(m=>Kd(n.slice(m.from,m.to),n,m.from,i)).join(`

`);let c=n;for(const m of[...s].sort((y,b)=>b.from-y.from))c=Vd(c,m.from,m.to);const d=qd(c,o);if(d===-1)return n;const p=(c.slice(0,d).match(/\n([^\S\n]*)$/)||[null,null])[1],f=p===null?d:d-p.length;return`${c.slice(0,f)}
${l}
${p??""}${c.slice(d)}`}function qd(t,e){const o=Ge(t).find(n=>n.prelude.includes(e));return o?o.bodyTo:Ge(t)[0]?.bodyTo??-1}function Vd(t,e,o){let n=e,s=o;const r=t.lastIndexOf(`
`,n-1)+1;for(t.slice(r,n).trim()===""&&(n=r);t[s]===" "||t[s]==="	";)s+=1;return t[s]===`
`&&(s+=1),t.slice(0,n)+t.slice(s)}function Ud(t,e){const o=t.slice(e.bodyFrom,e.bodyTo).match(/\n([^\S\n]+)\S/);return o?o[1]:`${(t.slice(0,e.from).match(/\n([^\S\n]*)$/)||[null,""])[1]}    `}function Kd(t,e,o,n){const s=(e.slice(0,o).match(/\n([^\S\n]*)$/)||[null,""])[1];return t.split(`
`).map((r,i)=>i===0?n+r.trim():r.startsWith(s)?n+r.slice(s.length):n+r.trimStart()).join(`
`)}const Gd={"data-sve-css-add-label":""},Xd=["placeholder","onKeydown"],Yd={key:0,"data-sve-css-add-hint":""},Zd={"data-sve-css-add-existing":""},Jd={"data-sve-css-add-list":""},Qd=["onClick"],tu={"data-sve-css-add-name":""},eu={"data-sve-css-add-detail":""},ou={key:0,"data-sve-css-add-none":""},nu=["disabled"],Fn={__name:"CodeDockAddClass",props:{label:{type:String,required:!0},placeholder:{type:String,default:""},initial:{type:String,default:""},onAdd:{type:Function,required:!0},options:{type:Array,default:()=>[]},onPick:{type:Function,default:null},takenText:{type:Function,default:null},existingLabel:{type:String,default:""},createLabel:{type:String,default:""},onClose:{type:Function,default:null}},setup(t){const e=t,o=Bt(e.initial||""),n=Bt(null);$a(()=>Wo(()=>{n.value?.focus(),n.value?.select()}));const s=me(()=>o.value.trim().toLowerCase()),r=me(()=>{if(!e.options.length)return[];const c=s.value,d=[],p=[];for(const f of e.options){const m=f.name.toLowerCase();!c||m.startsWith(c)?d.push(f):m.includes(c)&&p.push(f)}return[...d,...p].slice(0,8)}),i=me(()=>e.takenText&&s.value?e.takenText(o.value.trim()):"");function l(){const c=o.value.trim();if(!c){n.value?.focus();return}if(i.value&&e.onPick){e.onPick(c);return}e.onAdd(c)}return(c,d)=>(_(),S(W,null,[g("label",Gd,A(t.label),1),Ca(g("input",{ref_key:"input",ref:n,"data-sve-css-add-input":"","onUpdate:modelValue":d[0]||(d[0]=p=>o.value=p),type:"text",placeholder:t.placeholder,onKeydown:[Vt(M(l,["prevent"]),["enter"]),d[1]||(d[1]=Vt(M(p=>t.onClose?.(),["stop","prevent"]),["escape"]))]},null,40,Xd),[[Ta,o.value]]),i.value?(_(),S("div",Yd,A(i.value),1)):z("",!0),t.options.length?(_(),S(W,{key:1},[g("div",Zd,A(t.existingLabel),1),g("div",Jd,[(_(!0),S(W,null,it(r.value,p=>(_(),S("button",{key:p.name,type:"button","data-sve-css-add-option":"",onMousedown:d[2]||(d[2]=M(()=>{},["prevent"])),onClick:M(f=>t.onPick?.(p.name),["prevent","stop"])},[g("span",tu,A(p.name),1),g("span",eu,A(p.detail),1)],40,Qd))),128)),r.value.length?z("",!0):(_(),S("div",ou,"—"))]),g("button",{type:"button","data-sve-css-add-create":"",disabled:!!i.value||!s.value,onMousedown:d[3]||(d[3]=M(()=>{},["prevent"])),onClick:M(l,["prevent","stop"])},A(t.createLabel),41,nu)],64)):z("",!0)],64))}};function Ko(t,e){e._sveLockBound||(e._sveLockBound=!0,e.querySelector("[data-sve-code-lock]")?.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),!(!a.lockReady||!a.lastType)){if(a.lastLocked){au(t);return}cr(t,!0)}}))}function bo(t){return t?st(t,Es)!=="0":!0}function su(){const t=v.html;return!t||t.state.readOnly||!a.lastType?!1:!te(Ee(),a.lastParts)}function G(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-code-autosave]"),n=e?.querySelector("[data-sve-code-save]");if(!o||!n)return;const s=bo(t),r=su();o.setAttribute("aria-pressed",s?"true":"false"),o.title=h(t,s?"code_dock_autosave_on":"code_dock_autosave_off"),o.setAttribute("aria-label",o.title),o.innerHTML=zi,n.hidden=s,n.title=h(t,"code_dock_save"),n.setAttribute("aria-label",n.title),n.innerHTML=Wi,r?n.setAttribute("data-dirty",""):n.removeAttribute("data-dirty")}function Go(t,e){e._sveAutosaveBound||(e._sveAutosaveBound=!0,e.querySelector("[data-sve-code-autosave]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=!bo(t);U(t,Es,n?"1":"0"),n?N(t.document):a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null),G(t)}),e.querySelector("[data-sve-code-save]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),N(t.document)}))}function au(t){t.document.getElementById(K)?.remove();const e=kn(t.document,Nl,{title:h(t,"code_dock_unlock_title"),body:h(t,"code_dock_unlock_body"),buttons:[{value:"cancel",label:h(t,"cancel"),variant:"ghost"},{value:"ok",label:h(t,"code_dock_unlock_confirm"),variant:"primary"}],onPick:o=>{e.dismiss(),o==="ok"&&cr(t,!1)}});e.host.id=K}function cr(t,e){const o=a.lastType;if(!o)return;const n=()=>{a.lastType===o&&t.fetch("/!/sve/section-template/lock",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":lo(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:o,locked:e})}).then(async s=>{if(!s.ok)throw new Error(String(s.status));a.lastType===o&&(a.lastLocked=e,$t(t),Et(a.lastParts,e),q(t),j(t.document,e?h(t,"code_dock_locked"):""))}).catch(()=>{j(t.document,h(t,"code_dock_error"))})};if(e&&(N(t.document),a.saveInFlight)){a.saveInFlight.finally(n);return}n()}function Jt(t,e){const o=String(e||"");if(/^(header|footer)\//.test(o))return!0;const n=t?.Statamic?.$config?.get?.("sveChromeTemplates")||{};return Object.values(n).some(s=>s&&s.type===o)}function ru(t,e){const o=new Set;return nl(t,t.document).filter(n=>n.type!==e||n.ids.some(s=>o.has(s))?!1:(n.ids.forEach(s=>o.add(s)),!0)).length}function be(t){const e=a.lastType;if(!a.lastUid||!e||String(e).startsWith("view:")||Jt(t,e)){Io(t);return}if(ru(t,e)>1){Io(t);return}const o=dl(a.lastUid,t.document);Io(t,o.length?{sectionUids:o}:void 0)}function iu(t,e,o){return a.saveInFlight=t.fetch("/!/sve/section-template",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":lo(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:e,html:o.html,css:o.css,js:o.js,...typeof o.tw=="string"?{tw:o.tw}:{},...Vl(t)?{props:a.lastProps}:{}})}).then(async n=>{if(n.status===423){a.lastLocked=!0,a.lockReady=!0,$t(t),Et(a.lastParts,!0),q(t),j(t.document,h(t,"code_dock_locked"));return}const s=await n.json().catch(()=>({}));if(!n.ok)throw new Error(s?.error==="not_writable"?"not_writable":String(n.status));if(a.lastType===e){if(a.lastParts=o,s?.tw_written===!1){a.twDirty=!0,j(t.document,h(t,"code_dock_tw_not_writable")),G(t),be(t);return}j(t.document,h(t,"code_dock_saved")),G(t),t.setTimeout(()=>{const r=t.document.getElementById(u)?.querySelector("[data-sve-code-status]");r&&r.textContent===h(t,"code_dock_saved")&&(r.textContent="")},1800)}be(t),t.document.getElementById("__sve-section-picker")?.dispatchEvent(new t.CustomEvent("sve-library-stale"))}).catch(n=>{j(t.document,h(t,n?.message==="not_writable"?"code_dock_not_writable":"code_dock_error"))}).finally(()=>{a.saveInFlight=null}),a.saveInFlight}function N(t){a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null);const e=a.lastType,o=a.lastWin,n=v.html;if(!n||n.state.readOnly||!e||!o||!a.lockReady)return;const s=Ee(),r=a.twCss!==null&&Za(o)&&Bn(s.html)===a.twKey;te(s,a.lastParts)&&!(r&&a.twDirty)&&!a.propsDirty||(a.propsDirty=!1,r&&(s.tw=a.twCss,a.twDirty=!1),j(t,h(o,"code_dock_saving")),iu(o,e,s))}function Bn(t){return ql(t).sort().join(" ")}function Pn(){a.twCss=null,a.twKey="",a.twDirty=!1}function On(t,e){a.twCss=e,a.twKey=Bn(t),a.twDirty=!1}function In(t,e){if(!t||!Za(t))return;const o=Bn(e);o===a.twKey||a.twBusy||(a.twBusy=!0,un(()=>import("./tw-compile-BqsL3ULf.js"),__vite__mapDeps([0,1]),import.meta.url).then(n=>n.compileTailwind(t,e)).then(n=>{a.twBusy=!1,a.twCss=n,a.twKey=o,a.twDirty=!0,dr(t,t.document)}).catch(n=>{a.twBusy=!1,console.error("[sve] tailwind compile",n)}))}function dr(t,e){a.saveTimer&&clearTimeout(a.saveTimer),a.saveTimer=t.setTimeout(()=>{a.saveTimer=null,N(e)},Ii)}function Z(t){if(a.applying)return;const e=Ee();if(te(e,a.lastParts)){G(t);return}if(G(t),In(t,e.html),!bo(t)){j(t.document,h(t,"code_dock_unsaved"));return}j(t.document,h(t,"code_dock_saving")),dr(t,t.document)}function Dn(t,e){let o=0;const n=Math.min(t.length,e.length);for(;o<n&&t[o]===e[o];)o+=1;let s=t.length,r=e.length;for(;s>o&&r>o&&t[s-1]===e[r-1];)s-=1,r-=1;return[o,s,e.slice(o,r)]}const lu='<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M2.5 3.5h11M2.5 8h11M2.5 12.5h7"/></svg>';function jn(){const t=!!a.htmlScopePref;return{html:t,css:t&&a.styleMode!=="tw"&&!a.lastLocked}}function ur(){return a.htmlAll||jn().css&&a.cssAll}function Rt(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-all]");if(!e)return;const o=jn(),n=ur(),s=t.document.createElement("span");s.textContent=h(t,"code_dock_all"),e.innerHTML=lu,e.appendChild(s),e.title=h(t,n?"code_dock_all_off":o.css?"code_dock_all_on":o.html?"code_dock_all_on_html":"code_dock_all_none"),e.setAttribute("aria-label",e.title),e.setAttribute("aria-pressed",n?"true":"false")}const Xo={};function cu(t){return Xo[t]=new T.state.Compartment,Xo[t].of(Fo())}function Hn(t){const e=v[t],o=Xo[t];!e||!o||(e.dispatch({effects:o.reconfigure([])}),e.dispatch({effects:o.reconfigure(Fo())}))}function yo(t){const e=a.lastUid,o=typeof lt=="function"?lt(t.document):[];for(const n of o){const s=It(n.values)||n.values;if(!(!s||typeof s!="object")&&e&&typeof Is=="function"){const r=Is(s,e);if(r){const i=r.split("."),l=sl(s,i.slice(0,2).join("."));if(l&&typeof l=="object")return l}}}for(const n of o){const s=It(n.values)||n.values;if(s&&typeof s=="object")return s}return null}function Rn(t,e){!e||e===a.lastType||(N(t.document),Nt(t,e,"push"))}function zn(t){const e=a.typeStack.pop();if(!e){Ht(t);return}N(t.document),Nt(t,e,"keep")}function $t(t){const e=t.document.getElementById(u),o=e?.querySelector("[data-sve-code-lock]"),n=e?.querySelector("[data-sve-code-lock-banner]");if(!e||!o)return;const s=a.lastLocked;e.toggleAttribute("data-sve-code-locked",s),Rt(t),s&&(za(t.document),vt(t.document),a.htmlPartialUi&&(a.htmlPartialUi.setHover(v.html,null),a.htmlPartialUi.setHover(v.css,null)),a.htmlClassTokenUi?.setHover(v.html,null)),o.hidden=!a.lockReady,o.setAttribute("aria-pressed",a.lastLocked?"true":"false"),o.title=h(t,a.lastLocked?"code_dock_unlock":"code_dock_lock"),o.setAttribute("aria-label",o.title),o.innerHTML=a.lastLocked?Di:ji,n&&(n.textContent=h(t,"code_dock_locked_banner"))}function ae(t){return t?st(t,Ie)!=="0":a.htmlScopePref}function Ct(t,e,o){return t!=null&&e!=null&&t>=0&&e>t&&e<=o}function at(){const t=globalThis.document?.getElementById(u);t&&(t.__sveHtmlScope=a.htmlScopeActive&&a.htmlFocus?{full:a.htmlFull,from:a.htmlFocus.from,to:a.htmlFocus.to,get css(){return Xe()}}:{get css(){return Xe()}})}function At(){const t=v.html?.state.doc.toString()??"";if(!a.htmlScopeActive||!a.htmlFocus){a.htmlFull=t,at();return}if(a.htmlFocus.from<0||a.htmlFocus.from>a.htmlFull.length||a.htmlFocus.to<a.htmlFocus.from){a.htmlScopeActive=!1,a.htmlFull=t,a.htmlFocus=null,at();return}a.htmlFull=a.htmlFull.slice(0,a.htmlFocus.from)+t+a.htmlFull.slice(a.htmlFocus.to),a.htmlFocus={from:a.htmlFocus.from,to:a.htmlFocus.from+t.length},at()}function bt(){return At(),a.htmlScopeActive?a.htmlFull:v.html?.state.doc.toString()??a.lastParts.html??""}function Ce(){a.lastBracketNames=we(bt()).map(t=>t.name)}function zt(){a.lastCssSelectorNames=Ra(v.css?.state.doc.toString()??a.cssFull)}function fr(t,e){return Array.isArray(t)&&Array.isArray(e)&&t.length===e.length&&t.every((o,n)=>o===e[n])}function pr(t,e){a.cssFull=Ll(a.cssFull,t,e),a.cssFull=Fl(a.cssFull,e,t)}function hr(t){if(a.applying||a.lastLocked||a.lastBracketNames==null)return;const e=we(bt()).map(o=>o.name);fr(a.lastBracketNames,e)||(pr(a.lastBracketNames,e),a.lastBracketNames=e,yt(),zt())}function mr(){if(a.applying||a.lastLocked||a.lastCssSelectorNames==null||a.lastBracketNames==null||a.cssPane==="empty")return;const t=v.html,e=v.css?.state.doc.toString()??"";if(!Ha(e))return;const o=Ra(e);if(!t||fr(a.lastCssSelectorNames,o))return;const n=new Set(a.lastBracketNames),{renamed:s,added:r,removed:i}=El(a.lastCssSelectorNames,o);let l=t.state.doc.toString();const c=l;for(const d of s){const p=Zt(d.to);!n.has(d.from)||!p||(l=zs(l,f=>f===d.from?p:f))}for(const d of i)!n.has(d)||o.includes(d)||(l=zs(l,p=>p===d?"":p));if(l=du(l,r,n,e),l!==c){a.applying=!0;try{ie(l)}finally{a.applying=!1}}Ce(),a.lastCssSelectorNames=o}function du(t,e,o,n){if(!e.length||a.cssPane!=="tree")return t;At();const s=a.cssFocus?.path,r=a.htmlScopeActive&&!!a.htmlFocus;if(!s&&!r)return t;const i=r?a.htmlFocus.from:0,l=r?a.htmlFull.slice(0,i)+t+a.htmlFull.slice(a.htmlFocus.to):t,c=ne($e(l),new Set),d=s?c.find(b=>b.path===s):c.find(b=>b.from===i);if(!d||d.from<i||d.openTo-i>t.length)return t;const p=new Set(we(l).map(b=>b.name)),f=d.from-i;let m=d.openTo-i,y=t;for(const b of e){const k=Zt(b);!k||o.has(k)||p.has(k)||!Bl(n,k)||({html:y,to:m}=Pl(y,f,m,k),p.add(k))}return y}function uu(t,e){const o=Zt(e),n=v.html;if(!o||!n||n.state.readOnly||o===t.name)return;a.applying=!0;try{n.dispatch({changes:{from:t.from,to:t.to,insert:o}})}finally{a.applying=!1}const s=a.lastBracketNames==null?[]:a.lastBracketNames.slice();Ce(),pr(s,a.lastBracketNames),yt(),zt(),a.lastWin&&(Z(a.lastWin),B(a.lastWin))}function vr(t,e){const o=t.document,s=v.html?.coordsAtPos(e.from);w(o),vt(o);const r=o.createElement("div"),i={getBoundingClientRect:()=>({left:s?.left??12,right:s?.right??12,top:s?.top??12,bottom:s?.bottom??12,width:0,height:0})};r.id=x,o.body.appendChild(r),H(t,i,r),r._sveApp=R(Fn,r,{label:h(t,"code_dock_css_rename_class"),placeholder:h(t,"code_dock_css_class_placeholder"),initial:e.name,onAdd:l=>{uu(e,l),w(o)}})}function Wn(){return a.htmlScopePref&&!a.htmlAll&&Ct(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)?(a.htmlScopeActive=!0,at(),a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to)):(a.htmlScopeActive=!1,at(),a.htmlFull)}function re(t,e,o){const n=v[t];if(!n)return;const s=n.state.doc.toString();a.applying=!0;try{if(s!==e){const[r,i,l]=Dn(s,e);n.dispatch({changes:{from:r,to:i,insert:l},...o?{selection:o,scrollIntoView:!0}:{}})}else o&&n.dispatch({selection:o,scrollIntoView:!0})}finally{a.applying=!1}}function ie(t,e){re("html",t,e)}function gr(){if(a.htmlScopeActive)return v.html?.state.doc.toString()??"";if(a.htmlAll){const t=v.html?.state.doc.toString()??"";return Ct(a.htmlFocus?.from,a.htmlFocus?.to,t.length)?t.slice(a.htmlFocus.from,a.htmlFocus.to):""}return Ct(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)?a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to):""}function br(){const t=a.cssFocus?.path;if(!t)return null;const e=bt(),o=ne($e(e),new Set).find(n=>n.path===t);return o?e.slice(o.from,o.to):(a.cssFocus=null,null)}function fu(){return br()??gr()}function pu(){a.cssFocus=null}function yr(t){if(!t||a.applying||a.cssValues)return;const e=v.html;if(!e)return;At(),V();const o=a.htmlScopeActive&&!!a.htmlFocus,s=(o?a.htmlFocus.from:0)+e.state.selection.main.from;let r=null;for(const l of ne($e(a.htmlFull),new Set))l.from<=s&&s<l.to&&(r=l);!r||s<r.from||s>=r.openTo||(a.cssFocus?a.cssFocus.path===r.path:o&&a.htmlFocus.from===r.from&&a.htmlFocus.to===r.to)||(a.cssFocus={path:r.path},yt())}function hu(){const t=v.html?.state.doc.toString(),e=a.htmlFocus;return t!=null&&a.htmlScopeActive&&e&&e.from>=0&&e.from<=a.htmlFull.length&&e.to>=e.from?a.htmlFull.slice(0,e.from)+t+a.htmlFull.slice(e.to):t??a.lastParts.html??""}function Xe(){const t=v.css?.state.doc.toString();if(t==null)return a.cssFull;if(a.cssPane==="tree"){if(t===a.cssScopeSnapshot)return a.cssFull;const e=gn(fu())[0]?.className||Ml(t);return ja(a.cssFull,t,e,{previous:a.cssScopeSnapshot,keep:we(hu()).map(o=>o.name)})}return a.cssPane==="full"?t:a.cssFull}function V(){const t=v.css?.state.doc.toString()??"";if(a.cssPane==="tree"){if(t===a.cssScopeSnapshot||!Ha(t))return;a.cssFull=Xe(),a.cssScopeSnapshot=t}else a.cssPane==="full"&&(a.cssFull=t)}function mu(t,e){return(e||[]).some(o=>!bn(t,o.className))}function yt(){let t=a.cssFull,e=[],o=!1;const n=br(),s=n==null&&!a.htmlScopeActive&&!(a.htmlAll&&a.htmlFocus);a.cssValues||a.cssAll||!a.htmlScopePref?(a.cssPane="full",t=a.cssFull):(e=gn(n??(s?bt():gr())),e.length?(a.cssPane="tree",t=Da(a.cssFull,e),!a.cssFocus&&!s&&mu(a.cssFull,e)&&(a.cssFull=ja(a.cssFull,t,e[0].className),o=!0)):(a.cssPane="empty",t="")),a.cssScopeSnapshot=t,re("css",t),zt(),a.lastWin&&(Wt(a.lastWin,!0),B(a.lastWin),o&&Z(a.lastWin))}function Te(t){const e=v.html;if(!e||!a.htmlFocus)return;a.htmlAll=!1,a.htmlScopeActive||(a.htmlFull=e.state.doc.toString());const o=a.htmlFull.length,n=Math.max(0,Math.min(a.htmlFocus.from,o)),s=Math.max(n,Math.min(a.htmlFocus.to,o));if(s<=n)return;a.htmlFocus={from:n,to:s},a.htmlScopeActive=!0,at();const r=t==null?0:Math.max(0,Math.min(t-n,s-n));ie(a.htmlFull.slice(n,s),{anchor:r,head:r}),Hn("html"),yt(),e.focus()}function ko(t=!0,e=null){const o=v.html;if(!o)return;V(),At(),a.htmlScopeActive=!1,a.htmlAll=!1,at();const n=a.htmlFull||o.state.doc.toString(),s=e!=null?{anchor:Math.max(0,Math.min(e,n.length))}:t&&Ct(a.htmlFocus?.from,a.htmlFocus?.to,n.length)?{anchor:a.htmlFocus.from,head:a.htmlFocus.to}:null;a.htmlFull=n,ie(n,s),Hn("html"),a.cssPane="full",a.cssScopeSnapshot=a.cssFull,re("css",a.cssFull),zt()}function Yo(t,e){const o=v.html;if(!o||!!e===a.htmlAll){Rt(t);return}if(e){At();const n=a.htmlFull||o.state.doc.toString(),s=Ct(a.htmlFocus?.from,a.htmlFocus?.to,n.length)?a.htmlFocus:null;a.htmlScopeActive=!1,a.htmlFull=n,at(),ie(n,s?{anchor:s.from}:null),Hn("html"),a.htmlAll=!0}else{const n=o.state.doc.length;Ct(a.htmlFocus?.from,a.htmlFocus?.to,n)?(V(),Te(null)):(a.htmlAll=!1,a.htmlFocus=null,V(),yt())}q(t)}function le(){a.htmlFocus=null,a.htmlAll=!1,a.cssFocus=null,a.htmlScopeActive=!1,a.htmlFull="",a.cssFull="",a.cssPane="full",a.cssScopeSnapshot="",a.lastBracketNames=null,a.lastCssSelectorNames=null,at()}let ye=!1;function Gt(t){return!!t?.document.getElementById(_a)}function Ye(t,e){if(!(!t||fn(t,"html_tree")===!1)){if(!e){Gt(t)&&Ea(t);return}Gt(t)||(ye=!0,ul("html_tree").then(()=>{Gt(t)||fl(t)}).catch(()=>{}).finally(()=>{ye=!1,q(t)}))}}function q(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-html-scope]");if(!e)return;a.htmlScopePref=ae(t);const o=fn(t,"html_tree")===!1?a.htmlScopePref:Gt(t)||ye;e.setAttribute("aria-pressed",o?"true":"false"),e.title=h(t,o?"code_dock_html_scope_off":"code_dock_html_scope"),e.setAttribute("aria-label",e.title),e.innerHTML=Fs,t.document.getElementById(u)?.toggleAttribute("data-sve-html-scoped",a.htmlScopeActive),at(),Rt(t)}function Zo(t,e){e._sveHtmlScopeBound||(e._sveHtmlScopeBound=!0,a.htmlScopePref=ae(t),vu(t,e),Ye(t,a.htmlScopePref),e.querySelector("[data-sve-html-scope]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=Gt(t)||ye;a.htmlScopePref=!n,U(t,Ie,a.htmlScopePref?"1":"0"),a.htmlScopePref?a.htmlFocus&&(V(),Te()):(a.htmlScopeActive||a.htmlAll)&&ko(),Ye(t,a.htmlScopePref),q(t)}))}function vu(t,e){e._sveTreeWatchBound||(e._sveTreeWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>{if(ye||fn(t,"html_tree")===!1||!t.document.getElementById(u))return;const o=Gt(t);o!==ae(t)&&(a.htmlScopePref=o,U(t,Ie,o?"1":"0"),o?a.htmlFocus&&(V(),Te()):(a.htmlScopeActive||a.htmlAll)&&ko(),q(t))}))}const gu=new Set(["pre","textarea","script","style"]),bu=/^(<\/|\{\{\s*\/)/;function yu(t){let e=0;for(const o of t.split(`
`)){if(!o.trim())continue;const n=o.length-o.trimStart().length;n>0&&(e===0||n<e)&&(e=n)}return" ".repeat(e===2||e===3?e:4)}function ku(t){const e=String(t||"");if(!e.trim())return e;const o=[],n=l=>{for(const c of l||[])o.push(c),n(c.children)};n(Wa(e));const s=yu(e),r=[];let i=0;for(const l of e.split(`
`)){const c=i,d=l.trim();i+=l.length+1;const p=c+(l.length-l.trimStart().length),f=o.filter(y=>y.from<p&&p<y.to);if(f.some(y=>gu.has(y.tag))){r.push(l);continue}if(!d)continue;const m=f.length-(bu.test(d)?1:0);r.push(s.repeat(Math.max(m,0))+d)}return r.join(`
`)+(e.endsWith(`
`)?`
`:"")}function Jo(t,e){let o=0;for(;o<e;){const n=xu(t,o);if(n===null){o+=1;continue}if(n===-1)return e;if(n>e)return n;o=n}return e}function xu(t,e){if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?-1:o+2}if(t.startsWith("<!--",e)){const o=t.indexOf("-->",e+4);return o===-1?-1:o+3}return t[e]==="<"&&/[A-Za-z/!?]/.test(t[e+1]||"")?_u(t,e):null}function _u(t,e){let o="",n=e+1;for(;n<t.length;){const s=t[n];if(o){s===o&&(o=""),n+=1;continue}if(t.startsWith("{{",n)){const r=t.indexOf("}}",n+2);if(r===-1)return-1;n=r+2;continue}if(s==='"'||s==="'"){o=s,n+=1;continue}if(s===">")return n+1;if(s==="<")return-1;n+=1}return-1}function Nn(t,e){if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?t.length:o+2}if(t.startsWith("<!--",e)){const o=t.indexOf("-->",e+4);return o===-1?t.length:o+3}return e}function Ze(t,e){if(t[e]!=="<")return null;const o=t.indexOf(">",e+1);if(o===-1)return null;const n=t.slice(e,o+1),s=n.match(/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/);if(s)return{kind:"close",name:s[1].toLowerCase(),from:e,to:o+1};const r=n.match(/^<([A-Za-z][A-Za-z0-9:-]*)/);if(!r)return{kind:"other",from:e,to:o+1};const i=r[1].toLowerCase();return{kind:/\/\s*>$/.test(n)||["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"].includes(i)?"void":"open",name:i,from:e,to:o+1}}function Qo(t,e,o){let n=1,s=o;for(;s<t.length;){const r=Nn(t,s);if(r!==s){s=r;continue}if(t[s]!=="<"){s+=1;continue}const i=Ze(t,s);if(!i)break;if(i.kind==="open"&&i.name===e)n+=1;else if(i.kind==="close"&&i.name===e&&(n-=1,n===0))return i;s=i.to}return null}function Su(t,e){const o=[];let n=0;for(;n<e;){const s=Nn(t,n);if(s!==n){n=s;continue}if(t[n]!=="<"){n+=1;continue}const r=Ze(t,n);if(!r)return null;if(e<r.to){if(r.kind==="open")return{name:r.name,open:r,close:Qo(t,r.name,r.to),at:"open"};if(r.kind==="void")return{name:r.name,open:r,close:null,at:"open"};if(r.kind==="close"){let i=null;for(let l=o.length-1;l>=0;l-=1)if(o[l].name===r.name){i=o[l];break}return{name:r.name,open:i,close:r,at:"close"}}return null}if(r.kind==="open")o.push(r);else if(r.kind==="close"){for(let i=o.length-1;i>=0;i-=1)if(o[i].name===r.name){o.splice(i);break}}n=r.to}return null}function ce(){const t=v.html;if(!t)return null;const e=t.state.selection.main.head,o=t.state.doc.toString(),n=[];let s=0;for(;s<e;){const c=Nn(o,s);if(c!==s){s=c;continue}if(o[s]!=="<"){s+=1;continue}const d=Ze(o,s);if(!d||d.from>=e)break;if(d.kind==="open")n.push(d);else if(d.kind==="close"){for(let p=n.length-1;p>=0;p-=1)if(n[p].name===d.name){n.splice(p);break}}s=d.to}const r=o.lastIndexOf("<",Math.max(0,e-1));if(r!==-1&&o.indexOf(">",r)>=e){const c=Ze(o,r);if(c?.kind==="open"||c?.kind==="void"){const d=c.kind==="void"?null:Qo(o,c.name,c.to);return d?{name:c.name,open:c,close:d}:{name:c.name,open:c,close:null}}}const i=n[n.length-1];if(!i)return null;const l=Qo(o,i.name,i.to);return{name:i.name,open:i,close:l}}function Je(t){return Bs.includes(t)}function I(){v.html?.focus(),a.lastWin&&(Z(a.lastWin),Ae(a.lastWin))}function mt(t,e,o,n=void 0){const s=[...e].sort((r,i)=>i.from-r.from||i.to-r.to);t.dispatch({changes:s,selection:o,...n?{userEvent:n}:{}})}const Ut="input.toolbar";function Qt(t,e,o){const n=v.html;if(!n||n.state.readOnly)return;const s=n.state.selection.main.head,r=n.state.doc.lineAt(s),i=r.text.slice(0,s-r.from),l=r.text.trim()?X(r.text):de(n,r)||X(r.text);let c=t,d=0;if(i.trim()!=="")c=`
${l}${t}`,d=1+l.length;else if(!r.text.trim()){c=`${l}${t}`,d=l.length,n.dispatch({changes:{from:r.from,to:r.to,insert:c},selection:Zs(r.from+d+e,o),userEvent:Ut});return}n.dispatch({changes:{from:s,to:n.state.selection.main.to,insert:c},selection:Zs(s+d+e,o),userEvent:Ut})}function Zs(t,e){return e?{anchor:t,head:t+e}:{anchor:t}}function kr(t){const{from:e}=t.state.selection.main,o=Jo(t.state.doc.toString(),e);return o!==e&&t.dispatch({selection:{anchor:o}}),o}function xo(t,e,o){const n=v.html;!n||n.state.readOnly||(kr(n),Qt(t,e,o))}const wu=new Set(["section","article","header","footer","main","nav","aside"]);function $u(t){return Je(t)||t==="p"||t==="a"}function Js(t,e=""){if(t==="a")return'<a href="">';if(t!=="section")return e?`<${t} class="${e}">`:`<${t}>`;const o=a.lastWin?.Statamic?.$config?.get?.("sveSectionTag");return typeof o=="string"&&o.trim()?`<${t} ${o.trim()}>`:`<${t}>`}function qn(){const t=v.html;if(!t||t.state.readOnly)return;const e=t.state.doc.toString(),o=(e.match(/^[ \t]*/)||[""])[0],n=ku(e).split(`
`).map(s=>s&&o+s).join(`
`);n!==e&&(mt(t,[{from:0,to:e.length,insert:n}],{anchor:0}),I())}function _o(t,e=""){const o=v.html;if(!o||o.state.readOnly)return;const n=o.state.selection.main,s=o.state.doc.toString();if(!n.empty&&Jo(s,n.from)===n.from&&Jo(s,n.to)===n.to){const f=s.slice(n.from,n.to),m=f.match(new RegExp(`^<${t}(\\s[^>]*)?>([\\s\\S]*)</${t}>$`,"i"));if(m){mt(o,[{from:n.from,to:n.to,insert:m[2]}],{anchor:n.from,head:n.from+m[2].length},Ut),I();return}const y=Js(t,e);let b=`${y}${f}</${t}>`,k=n.from+y.length;t==="ul"&&(b=`<ul>
  <li>${f}</li>
</ul>`,k=n.from+11),mt(o,[{from:n.from,to:n.to,insert:b}],{anchor:k,head:k+f.length},Ut),I();return}const i=n.head,l=Su(s,i);if(l&&l.name===t&&l.open&&l.close){mt(o,[{from:l.close.from,to:l.close.to,insert:""},{from:l.open.from,to:l.open.to,insert:""}],{anchor:l.open.from},Ut),I();return}const c=ce();if(c?.open&&c.close&&Je(c.name)&&Je(t)&&c.name!==t){const f=s.slice(c.open.from,c.open.to).replace(new RegExp(`^<${c.name}`,"i"),`<${t}`);mt(o,[{from:c.close.from,to:c.close.to,insert:`</${t}>`},{from:c.open.from,to:c.open.to,insert:f}],{anchor:c.open.from+t.length+1},Ut),I();return}c?.open&&c.name===t&&$u(t)&&o.dispatch({selection:{anchor:c.close?c.close.to:c.open.to}}),kr(o);const p=(o.state.doc.lineAt(o.state.selection.main.head).text.match(/^\s*/)||[""])[0];if(t==="ul"){const f=`<ul>
${p}  <li></li>
${p}</ul>`;Qt(f,`<ul>
${p}  <li>`.length)}else{const f=Js(t,e),m=`${f}</${t}>`,y=t==="a"?f.indexOf('""')+1:wu.has(t)?f.length:m.length;Qt(m,y)}I()}function xr(t,e){let o=null;for(const n of Na(t))n.kind==="loop"&&n.loopKind==="collection"&&n.from<=e&&e<n.to&&(o=n);return o}function Cu(){const t=v.html;return t?xr(t.state.doc.toString(),t.state.selection.main.head):null}function _r(){const t=v.html;if(!t||t.state.readOnly)return;const e=t.state.doc.toString(),o=xr(e,t.state.selection.main.head);if(!o)return;const n=Kl(e,o,!o.paginate);if(n===e)return;if(!qa(e,n)){a.lastWin?.Statamic?.$toast?.error(h(a.lastWin,"html_tree_locked_element"));return}const[s,r,i]=Dn(e,n);mt(t,[{from:s,to:r,insert:i}]),I()}function Ae(t){try{Tu(t)}catch{}}function Tu(t){const e=t?.document?.getElementById(u),n=ce()?.name||"";if(!e)return;const s=Cu();for(const r of io){const i=e.querySelector(`[data-sve-html-tool="${r.id}"]`);if(!i)continue;const l=r.action==="pagination",c=l?!!s?.paginate:r.id==="heading"?Je(n):r.id==="div"?n==="div":n===r.tag;l&&i.toggleAttribute("data-in-loop",!!s),c?i.setAttribute("data-active",""):i.removeAttribute("data-active")}}function tn(t,e,o){const n=t.document,s=ce()?.name||"";w(n),e.setAttribute("data-open","");const r=n.createElement("div");r.id=x,n.body.appendChild(r),H(t,e,r),r._sveApp=R(nt,r,{kind:"choices",choices:o.map(i=>({value:i,label:i.toUpperCase(),active:s===i})),onPick:i=>{_o(i),w(n)}})}function Sr(t,e){const o=t.document;w(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=x,o.body.appendChild(n),H(t,e,n),n._sveApp=R(nt,n,{kind:"choices",choices:ln.map(s=>({value:s.id,label:h(t,s.lang),active:!1})),onPick:s=>{const r=ln.find(i=>i.id===s);r&&_o("div",r.classes),w(o)}})}function wr(t,e){const o=t.document;w(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=x,o.body.appendChild(n),H(t,e,n);const s=r=>{o.getElementById(x)&&(n._sveApp?.unmount(),n._sveApp=R(nt,n,{kind:"choices",choices:r,onPick:i=>{i&&(xo(i,i.length),I()),w(o)}}),H(t,e,n))};s([{value:"",label:h(t,"code_dock_loading")}]),t.fetch("/!/sve/components",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(r=>r.ok?r.json():{items:[]}).then(r=>{const i=Array.isArray(r.items)?r.items:[];s(i.length?i.map(l=>({value:l.tag,label:l.name})):[{value:"",label:h(t,"component_none")}])}).catch(()=>s([{value:"",label:h(t,"component_none")}]))}function Qs(t){const e=Zt(t),o=v.html,n=v.css;if(!e||o?.state.readOnly||n?.state.readOnly)return;const s=ce();if(s?.open&&o){const r=o.state.doc.sliceString(s.open.from,s.open.to),i=Ol(r,e);i!==r&&o.dispatch({changes:{from:s.open.from,to:s.open.to,insert:i}})}V(),bn(a.cssFull,e)||(a.cssFull=`${String(a.cssFull||"").trimEnd()}${a.cssFull?.trim()?`
`:""}.${e} {
}
`),yt(),Ce(),zt(),a.lastWin&&(Z(a.lastWin),Ae(a.lastWin),B(a.lastWin))}function Au(t,e){const o=t.document;if(e.hasAttribute("data-open")){w(o);return}w(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=x,o.body.appendChild(n),H(t,e,n);const s=l=>{const c=Zt(l);if(!c)return"";if(bn(a.cssFull,c))return h(t,"class_exists_here");const d=[...new Set(Mn(t,c).map(p=>String(p.file).replace(/^.*\//,"")))];return d.length?h(t,"class_exists_pick",{file:d.join(", ")}):""},r=l=>{Qs(l),Ln(t,Zt(l)),w(o)},i=()=>{if(!o.getElementById(x))return;const l=n.querySelector("[data-sve-css-add-input]")?.value||"";n._sveApp?.unmount(),n._sveApp=R(Fn,n,{label:h(t,"code_dock_css_class_name"),placeholder:h(t,"code_dock_css_class_placeholder"),initial:l,options:Id(t,h(t,"class_this_file")),existingLabel:h(t,"code_dock_css_class_existing"),createLabel:h(t,"code_dock_css_class_create"),takenText:s,onPick:r,onClose:()=>w(o),onAdd:c=>{Qs(c),w(o)}}),H(t,e,n)};i(),En(t).then(i)}function $r(t,e){if(a.styleMode==="tw"){w(t.document),Ul(t,e);return}Au(t,e)}function Eu(t){const e=t?.document.querySelector(`#${u} [data-sve-css-add-class]`);return e&&e.getClientRects().length?e:null}function Cr(t,e){const o=e.querySelector("[data-sve-css-add-class]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=Ni,o.title=h(t,"code_dock_css_add_class"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),$r(t,o)}))}function Ee(){const t={html:"",css:"",js:""};At(),V();for(const e of rt)e==="html"?t.html=a.htmlScopeActive?a.htmlFull:v.html?.state.doc.toString()??"":e==="css"?(t.css=a.lastWin?gd(a.cssFull,kt(a.lastWin)):a.cssFull,t.css=Nd(t.css,t.html,Bi)):t[e]=v[e]?.state.doc.toString()??"";return t}function Vn(){if(a.cssValues||a.cssAll||!a.htmlScopePref)return a.cssPane="full",a.cssScopeSnapshot=a.cssFull,a.cssFull;const t=Ct(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length),e=gn(t?a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to):a.htmlFull);if(!e.length)return a.cssPane="empty",a.cssScopeSnapshot="","";a.cssPane="tree";const o=Da(a.cssFull,e);return a.cssScopeSnapshot=o,o}function Et(t,e){a.applying=!0;try{a.lastWin&&(a.htmlScopePref=ae(a.lastWin)),a.htmlFull=t.html??"",a.cssFull=t.css??"",a.cssAll=!1,a.htmlAll=!1;for(const o of rt){const n=v[o];let s=t[o]??"";try{s=o==="html"?Wn():o==="css"?Vn():s}catch{s=o==="html"?a.htmlFull||t.html||"":o==="css"?a.cssFull||t.css||"":s}if(!n)continue;const r=n.state.doc.toString(),i=[Xt[o].reconfigure(oe.readOnly.of(!!e)),Yt[o].reconfigure(P.editable.of(!e))];r!==s?n.dispatch({changes:{from:0,to:r.length,insert:s},effects:i}):n.dispatch({effects:i})}}finally{a.applying=!1}Ce(),zt(),hn("dock:html-changed"),a.lastWin&&(B(a.lastWin),Ae(a.lastWin),q(a.lastWin),ue(a.lastWin))}function te(t,e){return t.html===e.html&&t.css===e.css&&t.js===e.js}function Tr(t){return String(t||"").replace(/\/\*[\s\S]*?\*\//g,"").trim().replace(/\s*:\s*/g,": ").replace(/\s*;\s*/g,";").replace(/\s+/g," ").replace(/;+$/,";")}function Ar(t){const e=Tr(t).match(/^([a-z-]+)\s*:/i);return e?e[1].toLowerCase():""}function Er(t){const e=Tr(t),o=e.indexOf(":");return o===-1?"":e.slice(o+1).replace(/;$/,"").trim().toLowerCase()}function D(t){const e=String(t||"").trim().toLowerCase();return e==="start"||e==="flex-start"||e==="left"||e==="top"?"flex-start":e==="end"||e==="flex-end"||e==="right"||e==="bottom"?"flex-end":e==="row-reverse"?"row-reverse":e==="column-reverse"?"column-reverse":e}function ke(t){const e=D(t);return e==="flex"||e==="inline-flex"}function Me(){const t=v.css;if(!t)return null;const e=t.state.selection.main.head,o=t.state.doc.toString(),n=[],s=[];for(let i=0;i<o.length;i+=1){if(o[i]==="{"&&o[i+1]==="{"){const l=o.indexOf("}}",i+2);if(l===-1)break;i=l+1;continue}if(o[i]==="{")n.push(i);else if(o[i]==="}"){const l=n.pop();l!=null&&s.push({from:l+1,to:i,text:o.slice(l+1,i),open:l})}}let r=null;for(const i of s)e<i.open||e>i.to||(!r||i.to-i.open<r.to-r.open)&&(r=i);return r}function Mu(t){const e=String(t||"");let o="",n=0;for(let s=0;s<e.length;s+=1){if(e[s]==="{"&&e[s+1]==="{"){const r=e.indexOf("}}",s+2);if(r===-1)break;n===0&&(o+=e.slice(s,r+2)),s=r+1;continue}if(e[s]==="{"){n+=1;continue}if(e[s]==="}"){n=Math.max(0,n-1);continue}n===0&&(o+=e[s])}return o}function ta(t){const e={};for(const o of Mu(t).split(";")){const n=Ar(o);n&&(e[n]=Er(`${o};`))}return e}function Lu(t,e,o){if(!e||e.from>=e.to)return null;let n=t.state.doc.lineAt(e.from),s=0;for(;n.from<=e.to;){const r=Math.max(n.from,e.from),i=Math.min(n.to,e.to),l=t.state.doc.sliceString(r,i);if(s===0&&Ar(l)===o)return{from:r,to:i,text:l};if(s+=Fu(l),n.to>=t.state.doc.length||n.to>=e.to)break;n=t.state.doc.lineAt(n.to+1)}return null}function Fu(t){let e=0;const o=String(t);for(let n=0;n<o.length;n+=1){if(o[n]==="{"&&o[n+1]==="{"){const s=o.indexOf("}}",n+2);n=s===-1?o.length:s+1;continue}o[n]==="{"?e+=1:o[n]==="}"&&(e-=1)}return e}function X(t){return(String(t).match(/^\s*/)||[""])[0]}function de(t,e,o){for(let n=e.number-1;n>=1;n-=1){const s=t.state.doc.line(n),r=s.text.trim();if(!r)continue;const i=X(s.text);if(o&&(r==="{"||r.endsWith("{")))return`${i}  `;if(!(r==="}"||r.startsWith("}")))return i}return""}function Bu(t,e){const o=t.state.doc.lineAt(e);if(o.text.trim())return X(o.text);const n=de(t,o,!0);if(n)return n;const s=Me();return s?Mr(t,s):"  "}function Mr(t,e){const o=t.state.doc.lineAt(e.from),n=t.state.doc.lineAt(Math.max(e.from,e.to));for(let r=n.number;r>=o.number;r-=1){const i=t.state.doc.line(r),l=Math.max(i.from,e.from),c=Math.min(i.to,e.to),d=t.state.doc.sliceString(l,c);if(d.trim())return(d.match(/^\s*/)||[""])[0]||"  "}return`${(t.state.doc.lineAt(Math.max(0,e.from-1)).text.match(/^\s*/)||[""])[0]}  `}function ea(){v.css?.focus(),a.lastWin&&(Z(a.lastWin),B(a.lastWin))}function Lr(t,e){if(!e)return"";const o=t.state.doc.toString();let n=0;for(let s=e.open-1;s>=0;s-=1)if(o[s]==="}"||o[s]==="{"||o[s]===";"){n=s+1;break}return o.slice(n,e.open).replace(/\/\*[\s\S]*?\*\//g,"").trim()}function Pu(t,e){if(!a.cssState||!e)return e;const o=Fr(t,e);if(o)return o;const n=Lr(t,e);if(!n||n.startsWith("@"))return e;const s=t.state.doc.toString(),r=St(s,e.open),i=St(s,e.to)||`${r}    `,l=(t.state.doc.sliceString(e.from,e.to).match(/\n([^\S\n]*)$/)||[null,null])[1],c=l===null?e.to:e.to-l.length,d=`
${i}&${Be()} {
${i}}
${l??r}`;t.dispatch({changes:{from:c,to:e.to,insert:d}});const p=t.state.doc.toString(),f=p.indexOf("{",c+d.indexOf("&")),m=f===-1?-1:yn(p,f);return m===-1?e:{from:f+1,to:m,text:p.slice(f+1,m),open:f}}function St(t,e){const o=t.lastIndexOf(`
`,e-1)+1;return(t.slice(o,e).match(/^\s*/)||[""])[0]}function Y(t){const e=v.css;if(!e||e.state.readOnly||!t.length)return;const o=Me(),n=t.some(l=>l.value!=null)?Pu(e,o):o;if(!n){const l=t.filter(c=>c.value!=null).map(c=>`${c.property}: ${c.value};`).join(`
`);l&&Ou(l),ea();return}const s=[],r=[],i=Mr(e,n);for(const l of t){const c=Lu(e,n,l.property);if(l.value==null){if(!c)continue;let d=c.from,p=c.to;e.state.doc.sliceString(p,p+1)===`
`&&(p+=1),d=Math.max(d,n.from),p=Math.min(p,n.to),s.push({from:d,to:p});continue}if(!(c&&D(Er(c.text))===D(l.value)))if(c){const d=(c.text.match(/^\s*/)||[""])[0];s.push({from:c.from,to:c.to,insert:`${d}${l.property}: ${l.value};`})}else r.push(`${i}${l.property}: ${l.value};`)}if(r.length){const l=!n.text.includes(`
`)||!/\n\s*$/.test(n.text)?`
`:"",c=(n.text.match(/\n([^\S\n]*)$/)||[null,null])[1],d=c===null?n.to:n.to-c.length,p=c===null?"":c;s.push({from:d,to:n.to,insert:`${l}${r.join(`
`)}
${p}`})}s.length&&(s.sort((l,c)=>c.from-l.from||c.to-l.to),e.dispatch({changes:s})),ea()}function tt(){const t=v.css,e=Me();if(!e)return{};if(a.cssState&&t){const o=Fr(t,e);return o?ta(o.text):{}}return ta(e.text)}function Fr(t,e){const o=Lr(t,e),n=Be();if(!o||o.startsWith("@"))return null;if(o.endsWith(n))return e;const s=t.state.doc.toString(),r=i=>{const l=yn(s,i);return l===-1?null:{from:i+1,to:l,text:s.slice(i+1,l),open:i}};for(const i of[`&${n}`,`${o}${n}`]){const l=new RegExp(`(^|[^\\w-])${i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\s*\\{`,"g");let c;for(;c=l.exec(s);){const d=s.indexOf("{",c.index);if(i.startsWith("&")&&(d<e.from||d>e.to))continue;const p=r(d);if(p)return p}}return null}function Br(t){const e=tt(),o=ke(e.display),n=D(e["flex-direction"])||(o?"row":"");if(o&&n===t){const s=[];e["flex-direction"]&&s.push({property:"flex-direction",value:null}),ke(e.display)&&s.push({property:"display",value:null}),Y(s);return}Y([{property:"display",value:"flex"},{property:"flex-direction",value:t}])}function Pr(t){const e=tt();if(t==="flex"&&ke(e.display)){Y([{property:"justify-content",value:null},{property:"align-items",value:null},{property:"flex-direction",value:null},{property:"display",value:null}]);return}Y([{property:"display",value:t}])}function Ou(t){const e=v.css;if(!e||e.state.readOnly)return;const o=e.state.selection.main.head,n=e.state.doc.lineAt(o),s=n.text.slice(0,o-n.from),r=n.text.slice(o-n.from),i=Bu(e,o),l=t.replace(/;?$/,";");if(s.trim()===""&&r.trim()===""){const d=`${i}${l}
${i}`;e.dispatch({changes:{from:n.from,to:n.to,insert:d},selection:{anchor:n.from+d.length}});return}const c=`
${i}${l}
${i}`;e.dispatch({changes:{from:o,to:e.state.selection.main.to,insert:c},selection:{anchor:o+c.length}})}function B(t){try{Iu(t),et(t)}catch{}}function Iu(t){const e=a.styleMode==="tw",o=e?{}:tt(),n=ke(e?Ns("display"):o.display),s=D(o["flex-direction"])||(n?"row":""),r=i=>e?Yl()?i.twGroup?!!Zl(i.twGroup):!!i.tw&&!!Ns(i.tw):!1:!!i.css&&i.css in o;_t.tools=Os.map(i=>{const l=(i.kids||[]).filter(c=>c.when!=="flex"||n).map(c=>({id:c.id,title:c.title,icon:cn[c.icon]||"",sep:!!c.sep,open:a.cssOpenMenu===c.id,active:e?r(c):c.kind==="display"?n:c.kind==="flexDir"?n&&s===c.value:c.value?D(o[c.css])===D(c.value):r(c)}));return{id:i.id,title:i.title,icon:cn[i.id]||Vi[i.id]||"",open:a.cssOpenTool===i.id||a.cssOpenMenu===i.id,kids:l,active:i.value?!e&&D(o[i.css])===D(i.value):r(i)||l.some(c=>c.active)}})}function ee(t){w(t),a.cssOpenTool="",a.lastWin&&B(a.lastWin)}function w(t){const e=t?.getElementById(x);a.cssOpenMenu="",e?._sveApp?.unmount(),e?.remove(),t?.querySelectorAll("[data-sve-css-tool][data-open], [data-sve-html-tool][data-open], [data-sve-css-add-class][data-open], [data-sve-code-history][data-open]").forEach(o=>o.removeAttribute("data-open"))}function Du(t){w(t),O(t),vt(t);for(const e of rt)v[e]&&bs?.(v[e])}function Or(t){if(a.cssColorsPromise)return a.cssColorsPromise;const e=t.Statamic?.$config?.get?.("cpUrl")||`/${t.Statamic?.$config?.get?.("cpRoute")||"cp"}`;return a.cssColorsPromise=t.fetch(`${e}/color-scheme/swatches`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async o=>{if(!o.ok)return[];const n=await o.json().catch(()=>[]);return Array.isArray(n)?n:[]}).catch(()=>[]).then(o=>{const n=new Set,s=[];for(const r of o){const i=r.var||r.value||r.handle,l=String(i||"").trim().replace(/^var\((.+)\)$/,"$1");!l||n.has(l)||(n.add(l),s.push({name:l,hex:r.hex||r.color||""}))}for(const[r,i]of Ps)n.has(r)||(n.add(r),s.push({name:r,hex:i}));return s}),a.cssColorsPromise}function Ir(t,e){const o=tt()[e]||"",n=String(o).match(/^var\(\s*([^)]+?)\s*\)$/i),s=n?n[1].trim():"";for(const r of t.querySelectorAll("[data-sve-css-token]"))s&&r.getAttribute("data-sve-css-token")===s?r.setAttribute("data-active",""):r.removeAttribute("data-active")}function H(t,e,o){const n=e.getBoundingClientRect(),s=8,r=t.innerHeight-(n.bottom+4)-s,i=n.top-4-s;o.style.maxHeight="";const l=o.offsetHeight||0,c=l>r&&i>r;o.style.left=`${Math.max(s,Math.min(n.left,t.innerWidth-220))}px`,o.style.maxHeight=`${Math.max(120,c?i:r)}px`,o.style.top=c?`${Math.max(s,n.top-4-Math.min(l,i))}px`:`${Math.max(s,n.bottom+4)}px`}function Dr(t,e,o){const n=t.document;w(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=x,n.body.appendChild(s),H(t,e,s);const r=i=>{s._sveApp?.unmount(),s._sveApp=R(nt,s,{kind:"colors",swatches:i,onClear:()=>{Y([{property:o,value:null}]),ee(n)},onPick:l=>{Y([{property:o,value:`var(${l})`}]),ee(n)}}),Ir(s,o)};r(Ps.map(([i,l])=>({name:i,hex:l}))),Or(t).then(i=>{n.getElementById(x)&&r(i.map(l=>({name:l.name,hex:l.hex})))})}function jr(t,e,o,n){const s=t.document;w(s),e.setAttribute("data-open","");const r=s.createElement("div"),i=tt()[o]||"";r.id=x,s.body.appendChild(r),H(t,e,r),r._sveApp=R(nt,r,{kind:"choices",choices:(n||[]).map(l=>({value:l,label:l,active:D(l)===D(i)})),onPick:l=>{const c=D(l)===D(tt()[o]||"");Y([{property:o,value:c?null:l}]),ee(s)}})}function en(t,e,o,n=[]){const s=t.document;w(s),e.setAttribute("data-open",""),Gl(t);const r=s.createElement("div");r.id=x,s.body.appendChild(r),H(t,e,r);const i=()=>{const l=[...n.map(d=>({value:d,label:d})),...Xl(t,o).map(d=>({value:d.value,label:d.value}))],c=tt()[o]||"";r._sveApp?.unmount(),r._sveApp=R(nt,r,{kind:"choices",choices:l.map(d=>({...d,active:D(d.value)===D(c)})),onPick:d=>{Y([{property:o,value:d||null}]),ee(s)}})};i(),Or(t).then(()=>{s.getElementById(x)===r&&i()})}function Hr(t,e,o){const n=t.document;w(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=x,n.body.appendChild(s),H(t,e,s),s._sveApp=R(nt,s,{kind:"choices",choices:qi.map(r=>({value:r,token:r,label:r})),onPick:r=>{Y([{property:o,value:`var(${r})`}]),ee(n)}}),Ir(s,o)}const oa=/\{\{#[\s\S]*?#\}\}|\{\{[\s\S]*?\}\}/g,na=/<!--[\s\S]*?-->/g,sa=/<(\/?)([A-Za-z][A-Za-z0-9-]*)/g,Rr=/^\{\{\s*(?:\/|endif\b|endunless\b)/,ju=/^\{\{\s*(?:\/\s*(?:if|unless)\b|endif\b|endunless\b)/,Hu=/^\{\{\s*\/\s*partial\b/;function Ho(t,e,o){return t.some(n=>e<n.to&&o>n.from)}function Ru(t){const e=new Map;for(const o of Na(t)){const n=o.kind==="loop"?"loop":"if";e.set(o.from,n);const s=t.lastIndexOf("{{",o.to-2);s>=o.openTo&&Rr.test(t.slice(s,o.to))&&e.set(s,n)}for(const o of Ia(t))e.set(o.from,"component");return e}function zu(t){const e=String(t||""),o=[],n=[];na.lastIndex=0;let s;for(;s=na.exec(e);)o.push({from:s.index,to:s.index+s[0].length});const r=Ru(e),i=[];for(oa.lastIndex=0;s=oa.exec(e);){const l=s.index,c=l+s[0].length,d=s[0];if(Ho(o,l,c))continue;if(i.push({from:l,to:c}),d.startsWith("{{#")){n.push({from:l,to:c,cls:"comment"});continue}const p=Rr.test(d),f=r.get(l)||(p&&ju.test(d)?"if":"")||(p&&Hu.test(d)?"component":"");n.push({from:l,to:c,cls:(f?`fam-${f}`:"antlers")+(p?"-close":"")})}for(sa.lastIndex=0;s=sa.exec(e);){const l=s.index+1+s[1].length,c=l+s[2].length;Ho(o,l,c)||Ho(i,l,c)||n.push({from:l,to:c,cls:`fam-${pl(s[2])}`})}return n.sort((l,c)=>l.from-c.from),n}function aa(t,e,o){const n=new e.RangeSetBuilder;let s=0;for(const r of zu(t.doc.toString()))r.from<s||(n.add(r.from,r.to,o(r.cls)),s=r.to);return n.finish()}function Wu(t){const e=new Map,o=r=>r==="comment"?"sve-cm-antlers-comment":r==="antlers"?"sve-cm-antlers":r==="antlers-close"?"sve-cm-antlers sve-cm-antlers-close":r.endsWith("-close")?`sve-cm-${r.slice(0,-6)} sve-cm-antlers-close`:`sve-cm-${r}`,n=r=>(e.has(r)||e.set(r,t.Decoration.mark({class:o(r)})),e.get(r));return{extensions:[t.StateField.define({create(r){return aa(r,t,n)},update(r,i){return i.docChanged?aa(i.state,t,n):r},provide:r=>t.EditorView.decorations.from(r)})]}}const F=dn({tag:"",emptyText:"",addLabel:"",dropTitle:"",chips:[],states:[],canEdit:!1,onAdd:null,onChip:null,onDrop:null}),Nu={class:"sve-al"},qu={class:"sve-al-head"},Vu={key:0,class:"sve-al-tag"},Uu=["title","disabled"],Ku={key:0,class:"sve-al-empty"},Gu={class:"sve-al-chips"},Xu=["data-sve-al-chip","title","disabled","onClick"],Yu={class:"sve-al-name"},Zu={key:0,class:"sve-al-value"},Ju=["title","onClick"],Qu={__name:"AlpinePanel",setup(t){return(e,o)=>(_(),S("div",Nu,[g("div",qu,[$(F).tag?(_(),S("span",Vu,"<"+A($(F).tag)+">",1)):z("",!0),(_(!0),S(W,null,it($(F).states,n=>(_(),S("span",{key:n,class:"sve-al-state"},A(n),1))),128)),o[1]||(o[1]=g("span",{class:"sve-al-gap"},null,-1)),g("button",{type:"button","data-sve-al-add":"",title:$(F).addLabel,disabled:!$(F).canEdit,onClick:o[0]||(o[0]=M(n=>$(F).onAdd?.(n),["prevent","stop"]))},"+",8,Uu)]),$(F).chips.length?z("",!0):(_(),S("div",Ku,A($(F).emptyText),1)),g("div",Gu,[(_(!0),S(W,null,it($(F).chips,n=>(_(),S("span",{key:n.id,class:"sve-al-chip-wrap"},[g("button",{type:"button","data-sve-al-chip":n.id,title:n.title,disabled:!$(F).canEdit,onClick:M(s=>$(F).onChip?.(s,n.id),["prevent","stop"])},[g("span",Yu,A(n.name),1),n.value?(_(),S("span",Zu,A(n.value),1)):z("",!0)],8,Xu),$(F).canEdit?(_(),S("button",{key:0,type:"button",class:"sve-al-drop",title:$(F).dropTitle,onClick:M(s=>$(F).onDrop?.(n.id),["prevent","stop"])},"−",8,Ju)):z("",!0)]))),128))])]))}},tf=Va(Qu,[["__scopeId","data-v-15add965"]]),ef=[{id:"state",lang:"alpine_group_state"},{id:"act",lang:"alpine_group_act"},{id:"react",lang:"alpine_group_react"}],ra=[{id:"state",group:"state",label:"alpine_state",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: false }"}]},{id:"state_text",group:"state",label:"alpine_state_text",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: '|' }"}]},{id:"toggle",group:"act",label:"alpine_toggle",icon:"toggle",needsName:!0,attrs:[{name:"@click",value:":name = !:name"}]},{id:"open",group:"act",label:"alpine_open",icon:"open",needsName:!0,attrs:[{name:"@click",value:":name = true"}]},{id:"close",group:"act",label:"alpine_close",icon:"close",needsName:!0,attrs:[{name:"@click",value:":name = false"}]},{id:"open_hover",group:"act",label:"alpine_open_hover",icon:"open",needsName:!0,attrs:[{name:"@mouseenter",value:":name = true"}]},{id:"close_leave",group:"act",label:"alpine_close_leave",icon:"close",needsName:!0,attrs:[{name:"@mouseleave",value:":name = false"}]},{id:"open_focus",group:"act",label:"alpine_open_focus",icon:"open",needsName:!0,attrs:[{name:"@focusin",value:":name = true"}]},{id:"close_blur",group:"act",label:"alpine_close_blur",icon:"close",needsName:!0,attrs:[{name:"@focusout",value:":name = false"}]},{id:"close_outside",group:"act",label:"alpine_close_outside",icon:"outside",needsName:!0,attrs:[{name:"@click.outside",value:":name = false"}]},{id:"close_escape",group:"act",label:"alpine_close_escape",icon:"escape",needsName:!0,attrs:[{name:"@keydown.escape.window",value:":name = false"}]},{id:"show",group:"react",label:"alpine_show",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"}]},{id:"show_smooth",group:"react",label:"alpine_show_smooth",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"},{name:"x-transition",value:""}]},{id:"hide_until_ready",group:"react",label:"alpine_hide_until_ready",icon:"cloak",attrs:[{name:"x-cloak",value:""}]},{id:"class_when",group:"react",label:"alpine_class_when",icon:"klass",needsName:!0,attrs:[{name:":class",value:":name ? '|' : ''"}]},{id:"text",group:"react",label:"alpine_text",icon:"text",needsName:!0,attrs:[{name:"x-text",value:":name"}]}];function of(t){return(t?.attrs||[]).map(e=>e.name).join(" ")}const nf=/^(x-[\w:.-]+|@[\w:.-]+|:[\w-]+)$/;function sf(t){return nf.test(String(t||""))}function Le(t){const e=String(t||""),o=[],n=/([@:a-zA-Z_][\w:.@-]*)(\s*=\s*(["'])([\s\S]*?)\3)?/g;let s,r=!0;for(;s=n.exec(e);){if(r){r=!1;continue}s[0].trim()&&o.push({name:s[1],value:s[4]??"",from:s.index,to:s.index+s[0].length,alpine:sf(s[1])})}return o}function zr(t){const e=String(t||"").trim().replace(/^\{|\}$/g,""),o=[],n=/(^|,)\s*([a-zA-Z_$][\w$]*)\s*:/g;let s;for(;s=n.exec(e);)o.push(s[2]);return o}function af(t,e){return t.map(o=>({name:o.name,value:String(o.value).replaceAll(":name:",`${e}:`).replaceAll(":name",e)}))}function Un(t,e,o){const n=v.html,s=Mt();if(!n||n.state.readOnly||!s)return;const r=a.htmlScopeActive&&!!a.htmlFocus,i=r?a.htmlFocus.from:0,c=(r?a.htmlFull:n.state.doc.toString()).slice(s.from,s.openTo),d=o===""?e:`${e}="${o}"`,p=Le(c).find(m=>m.name===e);let f;if(p)f=c.slice(0,p.from)+d+c.slice(p.to);else{const m=c.search(/\s|\/?>$/);f=m===-1?c:`${c.slice(0,m)} ${d}${c.slice(m)}`}f!==c&&(mt(n,[{from:s.from-i,to:s.openTo-i,insert:f}],null),Fe(t))}function rf(t,e){const o=v.html,n=Mt();if(!o||o.state.readOnly||!n)return;const s=a.htmlScopeActive&&!!a.htmlFocus,r=s?a.htmlFocus.from:0,l=(s?a.htmlFull:o.state.doc.toString()).slice(n.from,n.openTo),c=Le(l).find(f=>f.name===e);if(!c)return;let d=c.from;for(;d>0&&/\s/.test(l[d-1]);)d-=1;const p=l.slice(0,d)+l.slice(c.to);mt(o,[{from:n.from-r,to:n.openTo-r,insert:p}],null),Fe(t)}function on(t){const e=v.html;if(!e)return[];const n=a.htmlScopeActive&&!!a.htmlFocus?a.htmlFull:e.state.doc.toString(),s=Mt(),r=[],i=ne($e(n),new Set);for(const l of i){if(!s||l.from>s.from||l.to<s.to)continue;const c=Le(n.slice(l.from,l.openTo)).find(d=>d.name==="x-data");c&&r.push(...zr(c.value))}return[...new Set(r)]}function lf(t){const e=v.html,o=Mt();if(!e||!o)return[];const s=a.htmlScopeActive&&!!a.htmlFocus?a.htmlFull:e.state.doc.toString(),r=Le(s.slice(o.from,o.openTo)).find(i=>i.name==="x-data");return r?zr(r.value):[]}function cf(t,e){const o=t.document;w(o),e.setAttribute("data-open","");const n=on(),s=o.createElement("div");s.id=x,o.body.appendChild(s),H(t,e,s);const r=!n.length,i=!r&&!lf().length,c=ef.filter(d=>d.id==="state"?!i:!r).flatMap(d=>{const p=ra.filter(f=>f.group===d.id);return p.length?[{value:`\0${d.id}`,label:h(t,r&&d.id==="state"?"alpine_group_state_first":d.lang),heading:!0},...p.map(f=>({value:f.id,label:h(t,f.label),hint:of(f)}))]:[]});r&&c.push({value:"\0note",label:h(t,"alpine_needs_state"),note:!0}),s._sveApp=R(nt,s,{kind:"choices",choices:c,onPick:d=>{const p=ra.find(f=>f.id===d);if(w(o),!!p){if(!p.needsName){for(const f of p.attrs)Un(t,f.name,f.value);return}df(t,e,p,n)}}})}function df(t,e,o,n){const s=t.document,r=l=>{const c=String(l||"").trim().replace(/[^\w$]/g,"");if(w(s),!!c)for(const d of af(o.attrs,c))Un(t,d.name,d.value.replace("|",""))};if(!n.length){nn(t,e,r);return}const i=s.createElement("div");i.id=x,s.body.appendChild(i),H(t,e,i),i._sveApp=R(nt,i,{kind:"choices",choices:[{value:"\0head",label:h(t,"alpine_name"),heading:!0},...n.map(l=>({value:l,label:l})),{value:"\0new",label:h(t,"alpine_new_name")}],onPick:l=>{if(l==="\0new"){nn(t,e,r);return}r(l)}})}function nn(t,e,o){const n=t.document;w(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=x,n.body.appendChild(s),H(t,e,s),s._sveApp=R(Fn,s,{label:h(t,"alpine_name"),placeholder:h(t,"alpine_name_placeholder"),onAdd:r=>o(r)})}function Fe(t){const o=t?.document.getElementById(u)?.querySelector("[data-sve-alpine-host]");if(!o)return;const n=Mt(),s=v.html,r=a.htmlScopeActive&&!!a.htmlFocus,i=s?r?a.htmlFull:s.state.doc.toString():"",l=n?Le(i.slice(n.from,n.openTo)):[];F.tag=n?.tag||"",F.canEdit=!a.lastLocked&&!!n,F.emptyText=h(t,n?on().length?"alpine_none_ready":"alpine_none":"alpine_pick"),F.addLabel=h(t,"alpine_add"),F.dropTitle=h(t,"alpine_remove"),F.states=on(),F.chips=l.filter(c=>c.alpine).map(c=>({id:c.name,name:c.name,value:c.value,title:c.value?`${c.name}="${c.value}"`:c.name})),F.onAdd=c=>cf(t,c.currentTarget),F.onDrop=c=>rf(t,c),F.onChip=(c,d)=>{F.chips.find(f=>f.id===d)&&nn(t,c.currentTarget,f=>Un(t,d,f))},o._sveMounted||(o._sveMounted=!0,Se(o,tf))}const uf=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]),ff=new Set(["html","head","body"]),ia=new Set(["if","unless","style_push","script_push","sve_defaults","once","noparse","foreach","forelse","loop","cache","nocache","scope","collection","nav","structure","taxonomy","users","search:results","form:create","form:errors"]),pf=new Set(["collection:count"]);function la(t){return pf.has(t)?!1:ia.has(t)||ia.has(t.split(":")[0])}const hf=new Set(["CloseTag","MismatchedCloseTag","IncompleteCloseTag"]),mf=/^\s*(\/?)\s*([A-Za-z_][A-Za-z0-9_.:-]*)([\s\S]*)$/,vf=/^\{\{\s*\/?\s*([A-Za-z_][A-Za-z0-9_.:-]*)/,gf=3e5;function bf(t){const e=String(t||""),o=[],n=[];let s=0;for(;s<e.length;){const r=e.indexOf("{{",s);if(r===-1)break;if(e.startsWith("{{#",r)){const d=e.indexOf("#}}",r+3);if(d===-1){n.push(r);break}o.push({from:r,to:d+3,comment:!0,body:""}),s=d+3;continue}let i=0,l=r,c=-1;for(;l<e.length;){if(e.startsWith("{{",l)){i+=1,l+=2;continue}if(e.startsWith("}}",l)){if(i-=1,l+=2,i===0){c=l;break}continue}l+=1}if(c===-1){n.push(r),s=r+2;continue}o.push({from:r,to:c,comment:!1,body:e.slice(r+2,c-2)}),s=c}return{tags:o,unclosed:n}}function yf(t,e){let o=t;for(const n of e)o=o.slice(0,n.from)+" ".repeat(n.to-n.from)+o.slice(n.to);return o}function kf(t,e){return t===e||t.startsWith(`${e}:`)}function Re(t,e){return(t.slice(e,e+80).match(/^<\/?([A-Za-z][A-Za-z0-9:-]*)/)?.[1]||"").toLowerCase()}function xf(t,e,o,n,s){const r=c=>s.has(c.name)&&!/\||\?\?/.test(c.rest);for(const c of o){const d=t.slice(c,c+80).match(vf)?.[1]||"…";n.push({from:c,to:c+2,key:"code_dock_problem_antlers_unclosed",args:{name:d}})}const i=[],l=[];for(const c of e){if(c.comment)continue;const d=c.body.match(mf);if(!d)continue;const p=!!d[1],f=d[2].toLowerCase(),m=d[3];if(!p&&(f==="elseif"||f==="else")){let y=-1;for(let b=i.length-1;b>=0;b-=1)if(i[b].name==="if"||i[b].name==="unless"){y=b;break}if(y===-1){n.push({from:c.from,to:c.to,key:"code_dock_problem_branch_stray",args:{name:f}});continue}l.push({from:i[y].to,to:c.from}),i[y]={...i[y],to:c.to},i.length=y+1;continue}if(p||f==="endif"||f==="endunless"){const y=f==="endif"?"if":f==="endunless"?"unless":f;let b=-1;for(let k=i.length-1;k>=0;k-=1)if(kf(i[k].name,y)){b=k;break}if(b===-1){n.push({from:c.from,to:c.to,key:"code_dock_problem_pair_stray",args:{name:y}});continue}for(const k of i.slice(b+1))la(k.name)&&n.push({from:k.from,to:k.to,key:"code_dock_problem_pair_unclosed",args:{name:k.name}});(y==="if"||y==="unless")&&l.push({from:i[b].to,to:c.from}),i.length=b;continue}m.trim().startsWith("=")||i.push({name:f,rest:m,from:c.from,to:c.to})}for(const c of i)la(c.name)?n.push({from:c.from,to:c.to,key:"code_dock_problem_pair_unclosed",args:{name:c.name}}):r(c)&&n.push({from:c.from,to:c.to,key:"code_dock_problem_list_unclosed",args:{name:c.name}});return l}function _f(t,e,o,n){const s=e.parse(t),r=new Set,i=[];s.iterate({enter(l){if(l.name==="MismatchedCloseTag"){i.push({from:l.from,to:l.to,key:"code_dock_problem_tag_stray",args:{tag:Re(t,l.from)}});return}if(l.name==="IncompleteCloseTag"){i.push({from:l.from,to:l.to,key:"code_dock_problem_tag_unfinished",args:{tag:Re(t,l.from)}});return}if(l.type.isError){const f=l.node.parent;f&&(f.name==="OpenTag"||f.name==="CloseTag")&&(r.add(f.from),i.push({from:f.from,to:Math.max(f.from+1,l.from),key:"code_dock_problem_tag_unfinished",args:{tag:Re(t,f.from)}}));return}if(l.name!=="Element")return;let c=null,d=!1;for(let f=l.node.firstChild;f;f=f.nextSibling)f.name==="OpenTag"&&(c=f),hf.has(f.name)&&(d=!0);if(!c||d)return;const p=Re(t,c.from);!p||uf.has(p)||ff.has(p)||o.some(f=>c.from>=f.from&&c.from<f.to&&l.to>f.to)||i.push({from:c.from,to:c.to,key:"code_dock_problem_tag_unclosed",args:{tag:p}})}});for(const l of i)l.key==="code_dock_problem_tag_unclosed"&&r.has(l.from)||l.args.tag&&n.push(l)}function Sf(t,e,o={}){const n=String(t||"");if(!n.trim()||n.length>gf)return[];const s=[];try{const{tags:i,unclosed:l}=bf(n),c=xf(n,i,l,s,new Set(o.lists||[]));e&&_f(yf(n,i),e,c,s)}catch{return[]}const r=new Set;return s.sort((i,l)=>i.from-l.from||i.to-l.to).filter(i=>{const l=`${i.from}:${i.key}`;return r.has(l)?!1:(r.add(l),!0)})}function wf(t,e,o=()=>({})){const n=t.Decoration.mark({class:"sve-cm-problem"}),s=t.StateEffect.define(),r=l=>{const c=Sf(l.doc.toString(),e,o()),d=new t.RangeSetBuilder;let p=0;for(const f of c)f.from<p||f.to<=f.from||(d.add(f.from,f.to,n),p=f.to);return{problems:c,decorations:d.finish()}},i=t.StateField.define({create(l){return r(l)},update(l,c){return c.docChanged||c.effects.some(d=>d.is(s))?r(c.state):l},provide:l=>t.EditorView.decorations.from(l,c=>c.decorations)});return{field:i,relint:s,extensions:[i]}}const $f=new Set(["replicator","grid","list","array","table"]);let qe=new Set,Ro=null;function Wr(t){return t.document.getElementById(u)?.querySelector("[data-sve-html-problems]")||null}function Cf(t,e,o){const n=Wr(t);if(!n)return;const s=e.state.doc,r=o.map(c=>({from:c.from,line:s.lineAt(Math.min(c.from,s.length)).number,text:h(t,c.key,c.args)})),i=r.map(c=>`${c.line}:${c.text}`).join(`
`);if(n.dataset.sveSignature===i||(n.dataset.sveSignature=i,n.hidden=r.length===0,n.replaceChildren(),!r.length))return;const l=t.document.createElement("span");l.setAttribute("data-sve-problems-title",""),l.textContent=h(t,"code_dock_problems_title"),n.appendChild(l);for(const c of r){const d=t.document.createElement("button"),p=t.document.createElement("b");d.type="button",d.dataset.sveProblemAt=String(c.from),p.textContent=h(t,"code_dock_problem_line",{line:c.line}),d.append(p,t.document.createTextNode(` ${c.text}`)),n.appendChild(d)}}function Tf(t){const e=Wr(t);!e||e._sveBound||(e._sveBound=!0,e.addEventListener("mousedown",o=>o.preventDefault()),e.addEventListener("click",o=>{const n=o.target.closest("[data-sve-problem-at]"),s=v.html;if(!n||!s)return;o.preventDefault(),o.stopPropagation();const r=Math.min(Number(n.dataset.sveProblemAt)||0,s.state.doc.length);s.dispatch({selection:{anchor:r},effects:P.scrollIntoView(r,{y:"center"})}),s.focus()}))}function Af(t){const e=[],o=n=>{for(const s of n||[])s?.loop&&$f.has(s.type)&&s.var&&!s.parent&&e.push(s.var)};o(t?.section);for(const n of t?.page||[])o(n?.items);return e}function Ef(t,e,o){const n={collection:_n(t),set:Sn(a.lastType),view:"",scope:""},s=n.set?wn(n):"";if(s===Ro)return;Ro=s;const r=l=>{if(Ro!==s)return;const c=new Set(Af(l)),d=c.size===qe.size&&[...c].every(p=>qe.has(p));qe=c,!d&&v.html===e&&t.queueMicrotask(()=>{v.html===e&&e.dispatch({effects:o.of(null)})})};if(!s){r(null);return}const i=er(s);if(i){r(i);return}$n(t,n).then(r)}function Mf(t){if(!a.htmlLintUi){const{field:e,relint:o}=wf({Decoration:ot,StateField:ut,StateEffect:qt,RangeSetBuilder:ft,EditorView:P},xe.parser,()=>({lists:qe})),n=P.updateListener.of(s=>{const r=s.transactions.some(i=>i.effects.some(l=>l.is(o)));!s.docChanged&&!r||(s.docChanged&&Ef(t,s.view,o),Cf(t,s.view,s.state.field(e).problems))});a.htmlLintUi={extensions:[e,n]}}return Tf(t),a.htmlLintUi}const ca=/\{\{\s*(?:vite\b[^}]*|yield_[a-z_]+|theme_tokens)\s*\}\}/g;function Lf(t,e=[]){const o=[];ca.lastIndex=0;let n;for(;n=ca.exec(String(t||""));)o.push(n.index,n.index+n[0].length);if(!e||!e.length)return o;const s=[];for(const r of[o,e])for(let i=0;i+1<r.length;i+=2)s.push([r[i],r[i+1]]);return s.sort((r,i)=>r[0]-i[0]||r[1]-i[1]).flat()}const Ff=["input","delete","move"];function Bf(t){return Ff.some(e=>t(e))}let zo={text:null,ranges:[]};function Nr(t){return zo.text!==t&&(zo={text:t,ranges:Lf(t,t.includes("sve-lock")?Il(t):[])}),zo.ranges}function da(t,e){const o=new ft,n=Nr(t.doc.toString());for(let s=0;s<n.length;s+=2)o.add(n[s],n[s+1],e);return o.finish()}let ze=null;function Pf(){if(ze)return ze;const t=ot.mark({class:"sve-dock-locked"}),e=ut.define({create:n=>da(n,t),update:(n,s)=>s.docChanged?da(s.state,t):n,provide:n=>P.decorations.from(n)}),o=P.baseTheme({".sve-dock-locked":{opacity:".55",borderRadius:".1875rem",backgroundColor:"rgba(127,127,127,.14)",cursor:"not-allowed"}});return ze={extensions:[e,o,oe.changeFilter.of(n=>Bf(s=>n.isUserEvent(s))?Nr(n.startState.doc.toString()):!0)]},ze}function Of(t,e){if(!t||!e)return t??null;const o=e.mapPos(t.from,1),n=e.mapPos(t.to,-1);return n>o?{from:o,to:n}:null}function If(){if(a.cssGhostUi)return a.cssGhostUi;const t=ot.mark({class:"sve-css-ghost"}),e=o=>{const n=new ft;if(!a.lastWin)return n.finish();try{for(const s of bd(o.doc.toString(),kt(a.lastWin)))n.add(s.from,s.to,t)}catch{}return n.finish()};return a.cssGhostUi=ut.define({create:o=>e(o),update:(o,n)=>n.docChanged?e(n.state):o,provide:o=>P.decorations.from(o)}),a.cssGhostUi}let We=null,Qe=null;function Df(){if(We)return We;Qe=qt.define();const t=ot.line({class:"sve-css-id"}),e=o=>{const n=new ft;if(!a.lastWin||!a.cssValues)return n.finish();try{const s=o.doc;for(const r of Ke(s.toString(),kt(a.lastWin),a.cssSize)){const i=s.lineAt(Math.min(r.from,s.length)).number,l=s.lineAt(Math.min(Math.max(r.to-1,r.from),s.length)).number;for(let c=i;c<=l;c+=1)n.add(s.line(c).from,s.line(c).from,t)}}catch{}return n.finish()};return We=ut.define({create:o=>e(o),update:(o,n)=>n.docChanged||n.effects.some(s=>s.is(Qe))?e(n.state):o,provide:o=>P.decorations.from(o)}),We}function So(){Qe&&v.css&&v.css.dispatch({effects:Qe.of(null)})}function jf(){return a.htmlPartialUi||(a.htmlPartialUi=Dl({Decoration:ot,StateField:ut,StateEffect:qt,RangeSetBuilder:ft,EditorView:P})),a.htmlPartialUi}function Hf(){return a.htmlAntlersUi||(a.htmlAntlersUi=Wu({Decoration:ot,StateField:ut,RangeSetBuilder:ft,EditorView:P})),a.htmlAntlersUi}function Rf(){return a.htmlClassTokenUi||(a.htmlClassTokenUi=_c({Decoration:ot,StateField:ut,StateEffect:qt,RangeSetBuilder:ft,EditorView:P})),a.htmlClassTokenUi}function qr(t,e,o){v[e]?.destroy();const n=so.of([{key:"Mod-s",run:()=>(N(t.document),!0)}]);v[e]=new P({state:oe.create({doc:"",extensions:[cs(),ds(),us(),cu(e),bi(e),vs(),ms({tooltipClass:()=>"sve-tw-complete"}),...e==="html"?[xe.data.of({autocomplete:Jl(t)}),xe.data.of({autocomplete:jd(t)}),Hd(t),Ql(ks,t)]:[],...e==="html"?[...uc(),fc()]:[],...e==="css"?[ws(),If(),Df()]:[],so.of([...fs,...e==="html"?[{key:"Tab",run:pc}]:[],ps,...hs,...ys,...gs]),n,P.lineWrapping,...e==="html"||e==="css"?jf().extensions:[],...e==="html"?Hf().extensions:[],...e==="html"?Mf(t).extensions:[],...e==="html"?Pf().extensions:[],...e==="html"?Rf().extensions:[],Xt[e].of(oe.readOnly.of(!!a.lastLocked)),Yt[e].of(P.editable.of(!a.lastLocked)),P.updateListener.of(s=>{e==="html"&&s.docChanged&&a.htmlAll&&!a.htmlScopeActive&&(a.htmlFocus=Of(a.htmlFocus,s.changes)),e==="html"&&s.docChanged&&!a.applying&&(hr(),hn("dock:html-changed")),e==="css"&&s.docChanged&&!a.applying&&mr(),s.docChanged&&Z(t),e==="css"&&(s.docChanged||s.selectionSet)&&B(t),e==="css"&&s.docChanged&&!a.applying&&Wt(t),e==="html"&&(s.docChanged||s.selectionSet)&&(Ae(t),Fe(t),et(t),a.applying||ue(t))}),P.domEventHandlers({click:(s,r)=>(e==="html"&&r===v.html&&yr(t),!1)}),...Qi(T,{height:"auto",background:"#1E1E21",scroller:{overflow:"visible",height:"auto",minHeight:0},extraTags:s=>[{tag:s.tagName,color:"#4ec9b0"},{tag:s.attributeName,color:"#9cdcfe"},{tag:s.attributeValue,color:"#ce9178"},{tag:s.angleBracket,color:"#808080"}]})]}),parent:o})}function Vr(t){if(!t||t.querySelector(".cm-editor"))return;t.replaceChildren();const e=t.ownerDocument.createElement("span");e.style.cssText="width:16px;height:16px;margin:12px;border:2px solid #858585;border-right-color:transparent;border-radius:50%;display:block;animation:sve-cm-wait .6s linear infinite",t.appendChild(e)}function kt(t){return pn(t).map(e=>({handle:e.handle,base:e.base,direction:e.direction,max:e.max,min_px:e.min_px,media:e.media,media_px:e.media_px,label:e.label}))}function Kn(t,e){return kt(t).find(o=>o.handle===e)||null}function Be(t=a.cssState){return t?t==="before"||t==="after"?`::${t}`:`:${t}`:""}function Wt(t,e=!1){const o=v.css;if(!o||!ao||!ro)return;const n=o.state.doc.toString(),s=`${a.cssValues?"1":"0"}|${a.cssSize}|${vo(n).map(p=>`${p.from}-${p.to}`).join(",")}`;if(!e&&s===a.cssFoldSig)return;a.cssFoldSig=s;const r=kt(t),i=new Map,l=[...vd(n,r,a.cssSize),...a.cssValues?[]:Ke(n,r,a.cssSize).map(p=>({from:p.from,to:p.to}))];for(const p of l)p.to>p.from&&i.set(`${p.from}:${p.to}`,{from:p.from,to:p.to});const c=[],d=new Set;$s(o.state).between(0,n.length,(p,f)=>{const m=`${p}:${f}`;d.add(m),!i.has(m)&&a.cssOwnFolds.has(m)&&c.push(ro.of({from:p,to:f}))});for(const[p,f]of i)d.has(p)||c.push(ao.of(f));a.cssOwnFolds=new Set(i.keys()),c.length&&o.dispatch({effects:c})}function to(t,e){const o=a.cssFull||e;return/(max|min)-width/i.test(o)&&!/width\s*[<>]/i.test(o)&&t.media_px||t.media}function zf(t,e){const o=v.css;if(!o||o.state.readOnly)return;const n=kt(t),s=Kn(t,e),r=o.state.doc.toString();if(!s||s.base){const p=o.state.selection.main.head,f=vo(r).find(m=>p>=m.from&&p<=m.to);f&&o.dispatch({selection:{anchor:f.from},scrollIntoView:!0});return}const i=An(r,n,e);if(i.length){const p=i[0],f=Math.min(p.bodyTo,p.bodyFrom+(r.slice(p.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);o.dispatch({selection:{anchor:f},scrollIntoView:!0});return}const l=to(s,r),c=Gn(o,r),d=`

${c.indent}@media ${l} {
${c.indent}    
${c.indent}}${c.suffix}`;o.dispatch({changes:{from:c.at,to:c.at,insert:d},selection:{anchor:c.at+d.lastIndexOf("    ")+4},scrollIntoView:!0})}function Gn(t,e){const o=vo(e);if(o.length){const i=o[o.length-1];return{at:i.to,indent:St(e,i.from),suffix:""}}const n=i=>({at:i.to,indent:St(e,i.to)||`${St(e,i.open)}    `,suffix:`
${St(e,i.open)}`}),s=Me();if(s)return n(s);const r=Wf(e);return r?n(r):{at:e.length,indent:"",suffix:""}}function Wf(t){const e=String(t||"");let o=null,n=0,s=0;for(;n<e.length;){if(e[n]==="}"||e[n]===";"){n+=1,s=n;continue}if(e[n]!=="{"){n+=1;continue}const r=yn(e,n);if(r===-1||o||(o=e.slice(s,n).trim().startsWith("@")?null:{from:s,open:n,to:r},!o))return null;n=r+1,s=n}return o}function Nf(t,e){const o=e===a.cssSize?"":e;a.cssSize=o,U(t,Co,o),Q("lp:set-device",{win:t,key:o?al(o,t):"Responsive"}),o&&zf(t,o),a.cssValues&&Xn(t),Wt(t,!0),So(),et(t),B(t)}function qf(t,e){a.cssState=To.includes(e)?e:"",U(t,eo,a.cssState),w(t.document),et(t),B(t)}function Vf(t,e){const o=t.document;w(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=x,o.body.appendChild(n),H(t,e,n),n._sveApp=R(nt,n,{kind:"choices",choices:[{value:"",label:h(t,"css_state_none"),active:!a.cssState},...To.map(s=>({value:s,label:Be(s),active:s===a.cssState}))],onPick:s=>qf(t,s)})}function et(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-css-head]");if(!o)return;const n=Mt(),s=kt(t),r=v.css?.state.doc.toString()??"";C.tag=n?.tag||"",C.scope=jl(n?bt().slice(n.from,n.openTo):"")||"",e.toggleAttribute("data-sve-css-unnamed",a.styleMode!=="tw"&&!C.scope);const i=C.scope,l=Mn(t,i);C.scopeElsewhere=[...new Set(l.map(c=>String(c.file).replace(/^.*\//,"")))],C.scopeElsewhereTitle=C.scopeElsewhere.length?`${h(t,"class_defined_in",{file:C.scopeElsewhere.join(", ")})} — ${h(t,"class_defined_import")}`:"",C.onScopeImport=()=>{Ln(t,i)&&et(t)},i&&!ir()&&En(t).then(()=>et(t)),C.note=a.cssPane==="empty"?h(t,"css_pane_empty"):"",C.canEdit=!a.lastLocked,C.onTag=c=>tc(t,c.currentTarget,n),C.state=a.cssState,C.stateLabel=a.cssState?Be(a.cssState):h(t,"css_state"),C.onState=c=>Vf(t,c.currentTarget),C.onSize=c=>Nf(t,c),C.sizes=[{key:"",label:h(t,"tw_size_all"),title:h(t,"css_size_all_title"),active:!a.cssSize},...s.map(c=>{const d=c.base||An(r,s,c.handle).length>0;return{key:c.handle,label:c.label,title:c.base?h(t,"css_size_base_title"):`@media ${c.media}${d?"":`  ·  ${h(t,"css_size_new")}`}`,active:a.cssSize===c.handle}})],o._sveMounted||(o._sveMounted=!0,Se(o,Td))}co("lp:device",t=>{const e=a.lastWin;if(!e||!es(e.document))return;const o=pn(e).find(n=>n.device===t)?.handle||"";o!==a.cssSize&&(a.cssSize=o,U(e,Co,o),Wt(e,!0),So(),et(e),B(e))});function Uf(t){const e=Math.max(0,Math.round(Date.now()/1e3-t)),o=new Date(t*1e3).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});let n=o;try{const s=new Intl.RelativeTimeFormat(void 0,{numeric:"auto"});e<90?n=s.format(-e,"second"):e<5400?n=s.format(-Math.round(e/60),"minute"):e<86400?n=s.format(-Math.round(e/3600),"hour"):n=s.format(-Math.round(e/86400),"day")}catch{}return`${n} · ${o}`}function Ur(t,e){return t.fetch(e,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}})}async function Kf(t,e){const o=t.document,n=dt();if(w(o),!n)return;let s=[];try{const i=await Ur(t,`/!/sve/section-template/history?type=${encodeURIComponent(n)}`);i.ok&&(s=(await i.json())?.entries||[])}catch{s=[]}if(!o.getElementById(u)||!o.contains(e))return;e.setAttribute("data-open","");const r=o.createElement("div");r.id=x,o.body.appendChild(r),H(t,e,r),r._sveApp=R(nt,r,{kind:"choices",choices:s.length?s.map(i=>({value:i.id,label:Uf(i.at)})):[{value:"",label:h(t,"code_dock_history_empty")}],onPick:i=>{w(o),i&&Gf(t,n,i)}})}async function Gf(t,e,o){if(ct())return;let n=null;try{const s=await Ur(t,`/!/sve/section-template/history/entry?type=${encodeURIComponent(e)}&id=${encodeURIComponent(o)}`);s.ok&&(n=await s.json())}catch{n=null}!n||ct()||(Et({html:n.html??"",css:n.css??"",js:n.js??""},a.lastLocked),Z(t),ue(t))}function Dt(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-code-strip]");if(!e)return;e.hidden=a.styleMode!=="tw";const o=Ja(t);e.innerHTML=Ui,e.title=h(t,o?"tw_strip_on":"tw_strip_off"),e.setAttribute("aria-label",e.title),e.setAttribute("aria-pressed",o?"true":"false")}function Kr(t,e){const o=e.querySelector("[data-sve-code-strip]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),ec(t,!Ja(t)),Dt(t),oc(t)}),Dt(t))}function Gr(t,e){const o=e.querySelector("[data-sve-code-history]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=Ki,o.title=h(t,"code_dock_history"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),o.hasAttribute("data-open")){w(t.document);return}Kf(t,o)}))}function Xf(){return a.styleMode}function Yf(t){return a.styleMode!=="tw"?null:Qf()||Zf()||(Jf()?null:Mt())}function Zf(){const t=wo(),e=t?Rl(t.html,t.pos):null;return e?{kind:"component",tagCall:!0,src:e.src,label:e.src,from:e.from,to:e.to,openTo:e.to,path:`a${e.from}:${e.src}`}:null}function Jf(){const t=wo();return!!t&&!!zl(t.html,t.pos)}function wo(){const t=v.html;if(!t)return null;const e=a.htmlScopeActive&&!!a.htmlFocus,o=e?a.htmlFull:t.state.doc.toString(),n=e?a.htmlFocus.from:0;return{html:o,pos:n+t.state.selection.main.from}}function Qf(){const t=wo();return!t||!Hl(t.html,t.pos)?null:ne(Wa(t.html),new Set).find(e=>e.kind==="component"&&e.from<=t.pos&&t.pos<e.to)||null}function Mt(t){const e=wo();if(!e)return null;const{html:o,pos:n}=e,s=ne($e(o),new Set);let r=null;for(const i of s)i.from<=n&&n<i.to&&(r=i);return r}function ue(t){a.styleMode==="tw"&&nc(t,Yf())}function $o(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-values-mode]");if(!e||!o)return;e.setAttribute("data-sve-values",a.cssValues?"on":"off");const n=t.document.createElement("span");n.textContent=h(t,"code_dock_values"),o.innerHTML=Xi,o.appendChild(n),o.title=h(t,a.cssValues?"code_dock_values_off":"code_dock_values_on"),o.setAttribute("aria-label",o.title),o.setAttribute("aria-pressed",a.cssValues?"true":"false")}function Xn(t){const e=v.css;if(!e||e.state.readOnly)return;const o=kt(t),n=e.state.doc.toString(),s=Ke(n,o,a.cssSize);if(e.focus(),s.length){const m=s[0],y=Math.min(m.bodyTo,m.bodyFrom+(n.slice(m.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);e.dispatch({selection:{anchor:y},scrollIntoView:!0});return}const r=Kn(t,a.cssSize);if(!r||r.base){const m=`#id-{{ id }} {
    `;e.dispatch({changes:{from:0,to:0,insert:`${m}
}

`},selection:{anchor:m.length},scrollIntoView:!0});return}const i=An(n,o,a.cssSize)[0];if(i){const m=`${St(n,i.from)}    `,y=`
${m}#id-{{ id }} {
${m}    `;e.dispatch({changes:{from:i.bodyFrom,to:i.bodyFrom,insert:`${y}
${m}}
`},selection:{anchor:i.bodyFrom+y.length},scrollIntoView:!0});return}const l=Gn(e,n),c=`${l.indent}    `,d=Ke(n,o,"").some(m=>l.at>m.bodyFrom&&l.at<=m.bodyTo),p=d?`

${l.indent}@media ${to(r,n)} {
${c}`:`

${l.indent}@media ${to(r,n)} {
${c}#id-{{ id }} {
${c}    `,f=d?`
${l.indent}}${l.suffix}`:`
${c}}
${l.indent}}${l.suffix}`;e.dispatch({changes:{from:l.at,to:l.at,insert:`${p}${f}`},selection:{anchor:l.at+p.length},scrollIntoView:!0})}function Xr(t,e){a.cssValues=!!e,U(t,Bo,a.cssValues?"1":"0"),w(t.document),a.cssOpenTool="",$o(t),V(),yt(),a.cssValues&&Xn(t),Wt(t,!0),So(),et(t),B(t)}function ua(t,e){a.cssAll=!!e,w(t.document),a.cssOpenTool="",Rt(t),V(),yt(),Wt(t,!0),et(t),B(t)}function Yr(t,e){const o=jn();e?(o.html&&Yo(t,!0),o.css&&ua(t,!0)):(Yo(t,!1),a.cssAll&&ua(t,!1)),Rt(t)}function Zr(t){Yr(t,!ur())}function Pe(t){const e=t?.document.getElementById(u);if(!e)return;const o=a.styleMode==="tw";e.setAttribute("data-sve-style",a.styleMode);const n=e.querySelector("[data-sve-css-label]");n&&(n.textContent=o?h(t,"code_dock_style_tw"):h(t,"code_dock_css"));const s=e.querySelector("[data-sve-style-mode]");if(!s)return;const r=t.document.createElement("span");r.textContent=o?h(t,"code_dock_style_tw"):h(t,"code_dock_css"),s.innerHTML=o?Yi:Gi,s.appendChild(r),s.title=h(t,o?"code_dock_style_to_css":"code_dock_style_to_tw"),s.setAttribute("aria-label",s.title),s.setAttribute("aria-pressed",o?"true":"false")}function Yn(t){t?.document.getElementById(u),w(t.document),Uo(t),a.cssOpenTool="",a.cssOpenMenu="",a.styleMode==="tw"&&a.cssValues&&(a.cssValues=!1,U(t,Bo,"0")),Pe(t),$o(t),Rt(t),Dt(t),a.cssToolRow?.(),a.styleMode==="tw"&&(a.htmlScopePref=!0,U(t,Ie,"1"),Ye(t,!0)),ue(t),Fe(t),B(t)}const Co="sve-css-size",eo="sve-css-state",To=["hover","focus","focus-visible","active","disabled","before","after"],fa="data-sve-scroll-edge";function Zn(t){if(!t||t._sveEdges)return;t._sveEdges=!0;const e=()=>ep(t),o=new ResizeObserver(e),n=()=>{for(const s of t.children)o.observe(s)};t.addEventListener("scroll",e,{passive:!0}),o.observe(t),n(),new MutationObserver(()=>{n(),e()}).observe(t,{childList:!0}),e()}function tp(t,e){if(!t||t._sveEdgesIn)return;t._sveEdgesIn=!0;const o=()=>t.querySelectorAll(e).forEach(Zn);o(),new MutationObserver(o).observe(t,{childList:!0,subtree:!0})}function ep(t){const e=t.scrollWidth-t.clientWidth,o=t.scrollLeft>1,n=e-t.scrollLeft>1,s=o&&n?"both":o?"left":n?"right":"";s?t.setAttribute(fa,s):t.removeAttribute(fa)}const op='<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.6 10.2C4.6 9.4 4 8.3 4 7a4 4 0 1 1 8 0c0 1.3-.6 2.4-1.6 3.2-.4.3-.6.8-.6 1.3V12H6.2v-.5c0-.5-.2-1-.6-1.3z"/><path d="M6.4 14h3.2"/></svg>';function np(t,e){const o=e.querySelector("[data-sve-help-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=Oe(t,o,"data-sve-help-btn",op,h(t,"code_dock_help_off")),s=()=>{const i=No(t),l=h(t,i?"code_dock_help_on":"code_dock_help_off");n.setAttribute("aria-pressed",i?"true":"false"),n.title=l,n.setAttribute("aria-label",l)};n.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation(),hl(t,!No(t))}),s();const r=Ma(i=>{if(!n.isConnected){r();return}i===t&&s()})}const sp={"data-sve-data-search":""},ap=["placeholder","aria-label","onKeydown"],rp={key:0,"data-sve-data-empty":""},ip={key:1,"data-sve-data-empty":""},lp=["data-cursor","title","onMouseenter","onClick"],cp={"data-sve-data-name":""},dp={"data-sve-data-parent":""},up={key:0,"data-sve-data-value":""},fp={__name:"CodeDockSnippets",props:{title:{type:String,default:""},placeholder:{type:String,default:""},emptyText:{type:String,default:""},loadingText:{type:String,default:""},loading:{type:Boolean,default:!1},rows:{type:Array,required:!0},saveLabel:{type:String,required:!0},onPick:{type:Function,required:!0},onSave:{type:Function,required:!0}},setup(t){const e=t,o=Bt(""),n=Bt(null),s=Bt(null),r=Bt(-1),i=Bt(!1),l=me(()=>o.value.trim().toLowerCase()),c=me(()=>{const b=l.value;return e.rows.filter(k=>!b||k.name.toLowerCase().includes(b)||String(k.hint||"").toLowerCase().includes(b))});$a(()=>Wo(()=>n.value?.focus()));function d(b){return["html","css","js"].filter(k=>b[k]).map(k=>k.toUpperCase()).join(" · ")}function p(b){i.value=!0;const k=c.value.length;if(!k){r.value=-1;return}const L=r.value+b;r.value=L<0?-1:Math.min(L,k-1),Wo(()=>f())}function f(){const b=s.value?.querySelector("[data-cursor]"),k=s.value;if(!b||!k)return;const L=b.offsetTop,pt=L+b.offsetHeight;L<k.scrollTop?k.scrollTop=L:pt>k.scrollTop+k.clientHeight&&(k.scrollTop=pt-k.clientHeight)}function m(b){i.value||(r.value=b)}function y(){const b=r.value>=0?c.value[r.value]:null;b&&e.onPick(b)}return(b,k)=>(_(),S(W,null,[g("div",sp,[k[8]||(k[8]=g("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[g("circle",{cx:"11",cy:"11",r:"7"}),g("path",{d:"m20 20-3.5-3.5"})],-1)),Ca(g("input",{ref_key:"input",ref:n,"data-sve-data-input":"","onUpdate:modelValue":k[0]||(k[0]=L=>o.value=L),type:"text",placeholder:t.placeholder,"aria-label":t.title,onInput:k[1]||(k[1]=L=>r.value=-1),onKeydown:[k[2]||(k[2]=Vt(M(L=>p(1),["prevent"]),["down"])),k[3]||(k[3]=Vt(M(L=>p(-1),["prevent"]),["up"])),Vt(M(y,["prevent"]),["enter"]),k[4]||(k[4]=Vt(M(()=>{},["stop"]),["escape"]))]},null,40,ap),[[Ta,o.value]])]),t.loading?(_(),S("div",rp,A(t.loadingText),1)):c.value.length?z("",!0):(_(),S("div",ip,A(t.emptyText),1)),g("div",{ref_key:"rowsEl",ref:s,"data-sve-data-rows":"",onMousemove:k[5]||(k[5]=L=>i.value=!1)},[(_(!0),S(W,null,it(c.value,(L,pt)=>(_(),S("button",{key:L.name,type:"button","data-sve-data-option":"","data-cursor":pt===r.value?"":void 0,title:L.hint||L.name,onMouseenter:De=>m(pt),onClick:M(De=>t.onPick(L),["prevent","stop"])},[g("span",cp,A(L.name),1),g("span",dp,A(d(L)),1),L.hint?(_(),S("span",up,A(L.hint),1)):z("",!0)],40,lp))),128))],544),g("button",{type:"button","data-sve-snippet-save":"",onMousedown:k[6]||(k[6]=M(()=>{},["prevent"])),onClick:k[7]||(k[7]=M((...L)=>t.onSave&&t.onSave(...L),["prevent","stop"]))},A(t.saveLabel),33)],64))}},Jn="site.css",Jr={"X-Requested-With":"XMLHttpRequest",Accept:"application/json"};async function pp(t){const e=await t.fetch(`/!/sve/site-css/file?path=${encodeURIComponent(Jn)}&kind=css`,{credentials:"same-origin",headers:Jr});if(!e.ok)throw new Error(String(e.status));return String((await e.json()).css||"")}async function hp(t,e){const o=await t.fetch("/!/sve/site-css?kind=css",{method:"POST",credentials:"same-origin",headers:{...Jr,"X-CSRF-TOKEN":lo(t),"Content-Type":"application/json"},body:JSON.stringify({path:Jn,css:e})});if(!o.ok)throw new Error(String(o.status));return o.json()}function mp(t){return[ml(t),...vl(t).map(e=>e.document)].filter(Boolean)}async function vp(t,e,o,n){const s=await e(t,o,n),r=new Set(gc(s));return n.filter(i=>r.has(i))}function J(t,e,o,n){t.Statamic?.$toast?.[e]?.(h(t,o,n))}async function gp(t,e,o){if(bc(e)){J(t,"error","tw_utility_bad_name");return}let n;try{n=await pp(t)}catch{J(t,"error","tw_utility_failed");return}if(yc(n).has(e)&&!t.confirm(h(t,"tw_utility_replace",{name:e})))return;const{compileDraft:s}=await un(async()=>{const{compileDraft:m}=await import("./tw-compile-BqsL3ULf.js");return{compileDraft:m}},__vite__mapDeps([0,1]),import.meta.url),r=await vp(t,s,Us(n),o);if(!r.length){J(t,"error","tw_utility_no_classes");return}const i=o.filter(m=>!r.includes(m)),l=kc(n,{[e]:`@apply ${r.join(" ")};`});let c="";try{c=await s(t,Us(l),[e])}catch(m){J(t,"error","tw_utility_wont_compile",{reason:m?.message||String(m)});return}if(!c.trim()){J(t,"error","tw_utility_wont_compile",{reason:h(t,"tw_utility_reason_empty")});return}const d=mp(t);Vs(d,[e],c);let p;try{p=await hp(t,l)}catch{Vs(d,[],""),J(t,"error","tw_utility_failed");return}t.dispatchEvent(new CustomEvent("sve:site-css-saved",{detail:{path:Jn}})),ac(t,r,e);const f=p?.build;f?.ok&&f.css?d.forEach(m=>vc(m,f.css)):f&&J(t,"error","tw_utility_not_built",{name:e,reason:h(t,`theme_utilities_reason_${f.reason||"error"}`)}),J(t,"success",i.length?"tw_utility_saved_left":"tw_utility_saved",{name:e,names:i.join(" ")})}function bp(t){if(!rl(t,"site_css")){J(t,"error","tw_utility_no_site_css");return}const e=sc();if(!e){J(t,"error","tw_utility_no_tag");return}if(!e.raws.length){J(t,"error","tw_utility_no_classes");return}const o=kn(t.document,Ua,{heading:h(t,"tw_utility_new"),nameLabel:h(t,"snippet_name"),placeholder:h(t,"tw_utility_name_placeholder"),value:"",cancelLabel:h(t,"cancel"),saveLabel:h(t,"tw_utility_create"),onOk:n=>{o.dismiss(),gp(t,String(n||"").trim(),e.raws)}})}const yp="/!/sve/snippets",Qr="/!/sve/snippet",kp='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>',xp='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/></svg>',_p={"X-Requested-With":"XMLHttpRequest",Accept:"application/json"};async function Qn(t,e,o={}){const n=await t.fetch(e,{credentials:"same-origin",...o,headers:{..._p,...o.headers||{}}});if(!n.ok){const s=new Error(String(n.status));throw s.status=n.status,s}return n.json()}async function Sp(t){const e=await Qn(t,yp);return Array.isArray(e?.items)?e.items:[]}function wp(t,e){return Qn(t,`${Qr}?name=${encodeURIComponent(e)}`)}function $p(t,e){return Qn(t,Qr,{method:"POST",headers:{"X-CSRF-TOKEN":lo(t),"Content-Type":"application/json"},body:JSON.stringify(e)})}function Cp(t,e){return e==="css"?t.filter(o=>o.css):t}function Tp(t){const e=v.html;if(!e||e.state.readOnly)return!1;const o=e.state.doc.lineAt(e.state.selection.main.head),n=o.text.trim()?X(o.text):de(e,o)||X(o.text),s=fo(t.trim(),n);return xo(s,s.length),I(),!0}async function Ap(t,e,o){let n;try{n=await wp(t,e)}catch{t.Statamic?.$toast?.error(h(t,"snippet_read_failed"));return}const s=typeof n?.html=="string"?n.html:"",r=typeof n?.css=="string"?n.css:"",i=typeof n?.js=="string"?n.js:"";if(o==="css"){oo(t,{css:r});return}s.trim()&&Tp(s),(r.trim()||i.trim())&&oo(t,{css:r,js:i})}function sn(t){const e=t?.state.selection.main;if(!e||e.empty)return"";const o=t.state.doc.lineAt(e.from),n=o.text.slice(0,e.from-o.from).trim()===""?o.from:e.from;return t.state.doc.sliceString(n,e.to)}function Ep(t){if(t==="css"){const s=sn(v.css),r=s.trim()?s:String(Q("dock:css")||"");return{html:"",css:Do(r),js:"",name:""}}const e=sn(v.html),o=String(Q("dock:html")||""),n=String(Q("dock:css")||"");if(e.trim()){const s=o.includes(e)?o.replace(e,""):o;return{html:Do(e),css:rc(n,e,s).move.trim(),js:"",name:pa(e)}}return{html:Do(o),css:n.trim(),js:String(Q("dock:js")||"").trim(),name:pa(o)}}function pa(t){const e=String(t||"").match(/<([a-zA-Z][\w-]*)([^>]*)>/);if(!e)return"";const o=e[2].match(/\bclass="([^"]*)"/);return(o?o[1].split(/\s+/).find(s=>/^[a-zA-Z][\w-]*$/.test(s)):"")||e[1]}async function ti(t,e,o,n=!1){try{const s=await $p(t,{name:e,html:o.html,css:o.css,js:o.js,replace:n});t.Statamic?.$toast?.success(h(t,"snippet_saved",{name:s?.name||e}))}catch(s){if(s?.status===409&&!n){t.confirm(h(t,"snippet_replace",{name:e}))&&await ti(t,e,o,!0);return}t.Statamic?.$toast?.error(h(t,"snippet_failed"))}}function Mp(t,e){const o=Ep(e);if(!o.html.trim()&&!o.css.trim()&&!o.js.trim()){t.Statamic?.$toast?.error(h(t,"snippet_empty"));return}const n=kn(t.document,Ua,{heading:h(t,"snippet_new"),nameLabel:h(t,"snippet_name"),placeholder:h(t,"snippet_name_placeholder"),value:o.name,cancelLabel:h(t,"cancel"),saveLabel:h(t,"snippet_create"),onOk:s=>{n.dismiss(),ti(t,s,o)}})}function Lp(t,e,o){const n=t.document;O(n),w(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=gt,s.setAttribute("data-sve-data-menu",""),n.body.appendChild(s);const r=!!sn(o==="css"?v.css:v.html).trim(),i=(l,c)=>{n.getElementById(gt)&&(s._sveApp?.unmount(),s._sveApp=R(fp,s,{title:h(t,"code_dock_snippets"),placeholder:h(t,"code_dock_snippets_search"),emptyText:h(t,"snippet_none"),loadingText:h(t,"code_dock_loading"),loading:c,rows:l,saveLabel:h(t,r?"snippet_save_selection":"snippet_save"),onPick:d=>{O(n),Ap(t,d.name,o)},onSave:()=>{O(n),Mp(t,o)}}),Ot(t,e,s))};i([],!0),as(t,e,s),Sp(t).then(l=>i(Cp(l,o),!1)).catch(()=>i([],!1))}function ha(t,e,o,n){const s=t.createElement("span");return s.setAttribute("data-sve-snippet-face",n),s.innerHTML=e,s.appendChild(t.createTextNode(o)),s}function ma(t,e,o,n){const s=e.querySelector(o);if(!s||s._sveBound)return;s._sveBound=!0;const r=t.document,i=Oe(t,s,"data-sve-snippet-btn","",h(t,"code_dock_snippets"));i.setAttribute("data-sve-snippet-pane",n),i.removeAttribute("title"),i.removeAttribute("aria-label"),i.replaceChildren(ha(r,kp,h(t,"snippet_button"),n==="css"?"css":"html")),n==="css"&&i.appendChild(ha(r,xp,h(t,"tw_utility_button"),"tw")),i.addEventListener("click",l=>{if(l.preventDefault(),l.stopPropagation(),n==="css"&&a.styleMode==="tw"){O(r),bp(t);return}if(i.hasAttribute("data-open")){O(r);return}Lp(t,i,n)})}function Fp(t,e){ma(t,e,"[data-sve-snippet-tools]","html"),ma(t,e,"[data-sve-css-snippet-tools]","css")}const va=new WeakSet;function Bp(t,e){a.styleMode=e==="tw"?"tw":"css",U(t,Ms,a.styleMode),Yn(t)}function ei(t,e){if(e._sveStyleModeBound)return;e._sveStyleModeBound=!0,a.styleMode=st(t,Ms)==="tw"?"tw":"css";const o=st(t,Co)||"";a.cssSize=pn(t).some(n=>n.handle===o)?o:"",a.cssState=To.includes(st(t,eo))?st(t,eo):"",a.cssValues=st(t,Bo)==="1",e.querySelector("[data-sve-style-mode]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Bp(t,a.styleMode==="tw"?"css":"tw")}),e.querySelector("[data-sve-values-mode]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Xr(t,!a.cssValues)}),e.querySelector("[data-sve-all]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Zr(t)}),Yn(t),$o(t),Rt(t)}function oi(t,e){const o=e.querySelector("[data-sve-css-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=r=>e.querySelector(`[data-sve-css-tool="${r}"], [data-sve-css-kid="${r}"]`),s=r=>{const i=n(r.id),l=a.cssOpenMenu===r.id;if(w(t.document),l){Uo(t),B(t);return}if(!i)return;const c=a.styleMode==="tw"?!r.twClass&&(!!r.tw||!!r.twGroup):!r.kind&&!r.value&&!(r.css in tt())&&!!r.menu,d=()=>{c&&(a.cssOpenMenu=r.id)},p=()=>{a.cssOpenTool="",B(t)};if(a.styleMode==="tw"){Uo(t),r.twClass?(ic(t,r.twClass),B(t)):r.twGroup?(lc(t,i,r.title,r.twGroup,p),d(),B(t)):r.tw&&(cc(t,i,r.tw,p),d(),B(t));return}if(r.kind==="flexDir"){Br(r.value);return}if(r.kind==="display"){Pr(r.value);return}if(r.value){const f=D(tt()[r.css])===D(r.value);Y([{property:r.css,value:f?null:r.value}]);return}if(r.css in tt()){Y([{property:r.css,value:null}]),B(t);return}r.menu==="colors"?Dr(t,i,r.css):r.menu==="spacing"?Hr(t,i,r.css):r.menu==="sizes"?en(t,i,r.css,Zi):r.menu==="choices"?jr(t,i,r.css,r.choices):r.menu==="values"&&en(t,i,r.css),d(),B(t)};_t.onTool=r=>{const i=_e.get(r)?.tool;if(i){if(i.kids?.length){a.cssOpenTool=a.cssOpenTool===i.id?"":i.id,w(t.document),B(t);return}s(i)}},_t.onKid=(r,i)=>{const l=_e.get(i);l?.kid&&s(l.kid)},a.cssToolRow=()=>{Se(o,fd),B(t)},a.cssToolRow(),Zn(o),tp(o,"[data-sve-css-kids]"),va.has(t)||(va.add(t),t.addEventListener(il,()=>et(t))),t.document.addEventListener("mousedown",r=>{r.target.closest(`#${x}, [data-sve-css-tools], [data-sve-html-tools], [data-sve-css-add-class]`)||w(t.document)},!0)}function Pp(t,e){const o=e.querySelector("[data-sve-html-tidy]");o&&(o.innerHTML=Qa.tidy,o.title=h(t,"code_dock_html_tidy"),o.setAttribute("aria-label",o.title),o.setAttribute("data-tip",o.title))}function ni(t,e){const o=e.querySelector("[data-sve-html-tidy]");Pp(t,e),!(!o||o._sveBound)&&(o._sveBound=!0,o.addEventListener("mousedown",n=>n.preventDefault()),o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),qn()}))}function si(t,e){const o=e.querySelector("[data-sve-html-tools]");!o||o._sveBound||(o._sveBound=!0,Se(o,rd,{tools:io.map(n=>({...n,icon:Qa[n.id]||""})),onTool:n=>{const s=io.find(i=>i.id===n),r=o.querySelector(`[data-sve-html-tool="${n}"]`);if(s){if(s.menu==="heading"){tn(t,r,Bs);return}if(s.menu==="text"){tn(t,r,gl);return}if(s.menu==="div"){Sr(t,r);return}if(s.tidy){qn();return}if(s.menu==="component"){wr(t,r);return}if(w(t.document),s.action==="pagination"){_r();return}if(s.snippet){xo(s.snippet,s.caret??s.snippet.length,s.select),I();return}_o(s.tag)}}}),Zn(o),vi(t,e),gi(t,e),np(t,e),mi(t,e),Fp(t,e))}let ve=null,ga=null;const Op=()=>(ve=ve||un(()=>import("./help-editor-Cgu95M_S.js"),__vite__mapDeps([2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,1,17,18,19,20,21,22,23,24,25,26,27,28,29]),import.meta.url),ve);function Ip(t,e){if(!t||!e)return;const o=n=>n?Op().then(s=>s.enableHelp(t,e)):ve?ve.then(s=>s.disableHelp(e)):Promise.resolve();No(t)&&o(!0),ga?.(),ga=Ma((n,s)=>{n===t&&o(s)})}E("dock:save-now",()=>(N(a.lastWin?.document),!0));let Ne=null;async function Dp(t){const e=t.document;xi(e);let o=e.getElementById(u);if(o&&!(o.querySelector('[data-sve-css-chrome="subrow-2"]')&&o.querySelector("[data-sve-css-add-class]")&&o.querySelector("[data-sve-html-tools]")&&o.querySelector("[data-sve-html-tidy]")&&o.querySelector("[data-sve-data-vars]")&&o.querySelector("[data-sve-visual-edit-tools]")&&o.querySelector("[data-sve-help-tools]")&&o.querySelector("[data-sve-html-scope]")&&o.querySelector("[data-sve-code-lock]")&&o.querySelector("[data-sve-code-back]")&&o.querySelector("[data-sve-code-autosave]")&&o.querySelector("[data-sve-code-save]")&&o.getAttribute("data-sve-code-chrome")==="scope-9")){for(const s of rt)v[s]?.destroy(),v[s]=null;o.remove(),o=null}if(!o){o=e.createElement("div"),o.id=u,o.setAttribute("data-sve-code-chrome","scope-9"),Object.defineProperty(o,"__sveSavedCss",{get:()=>a.lastParts?.css??""}),yl(o,kl(t)),Se(o,od,{htmlLabel:h(t,"code_dock_html"),cssLabel:h(t,"code_dock_css"),jsLabel:h(t,"code_dock_js"),alpineLabel:h(t,"code_dock_alpine"),treeIcon:Fs,dataIcon:Ri,dataLabel:h(t,"data_vars_title")}),Vo(e,o),an(o),ls(o,rs(t)),Ai(t,o),Mi(t,o),Ei(t,o),oi(t,o),Cr(t,o),ei(t,o),Gr(t,o),Kr(t,o),xl(t,o),si(t,o),Zo(t,o),Ko(t,o),rn(t,o),Go(t,o);for(const n of rt){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);Vr(s)}_l(t)}if(Vo(e,o),an(o),ni(t,o),Zo(t,o),Ko(t,o),rn(t,o),Go(t,o),Si(t),Eo(t),$t(t),q(t),Ht(t),G(t),Pe(t),Dt(t),await Fi(),!v.html){for(const n of rt){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);s?.replaceChildren(),qr(t,n,s)}for(const n of["html","css"])v[n]&&Wl(t,v[n],{onOpen:s=>Rn(t,s),emptyLabel:h(t,"code_dock_partials_empty"),openLabel:s=>h(t,"component_open_named",{name:s}),sectionValues:()=>yo(t),isLocked:()=>ct(),setHover:(s,r)=>a.htmlPartialUi?.setHover(s,r)});$c(t,v.html,{onRename:n=>vr(t,n),isLocked:()=>ct(),setHover:(n,s)=>a.htmlClassTokenUi?.setHover(n,s),title:h(t,"code_dock_css_rename_class")}),Ip(t,v.html)}return o}function ts(t){return Ne||(Ne=Dp(t).finally(()=>{Ne=null})),Ne}async function ba(t,e){const o=await ts(t);a.lastType=e,a.lastLocked=!0,a.lockReady=!0,a.lastParts={html:"",css:"",js:""},le(),$t(t),Et(a.lastParts,!0),Lo(t.document,e),j(t.document,h(t,"code_dock_missing")),q(t),Ht(t),G(t),jt(t,o)}let ya=-1;async function ai(t,e){if(ya===a.loadGen&&!a.lastType&&t.document.getElementById(u))return;N(e);const o=++a.loadGen;ya=o,a.lastType=null,a.typeStack=[],a.lastParts={html:"",css:"",js:""},a.lastProps=[],a.propsDirty=!1,a.lastLocked=!1,a.lockReady=!1,a.loadInFlight=null,Pn(),le();const n=await ts(t);o===a.loadGen&&(Et(a.lastParts,!0),Tn(t),po(t),xn(t),Lo(t.document,""),j(t.document,h(t,ll(t,t.document)?"code_dock_pick_section":"code_dock_open_template")),$t(t),q(t),Ht(t),G(t),Pe(t),Dt(t),jt(t,n))}function ri(t){return Jt(t,a.lastType)||Jt(t,a.typeStack[0])}function jp(t,e,o){if(o==="replace"){if(!Jt(t,e)){a.beforePart=null;return}ri(t)||(a.beforePart={type:a.lastType||"",uid:a.lastUid||"",stack:[...a.typeStack],onEmptyPage:!!a.onEmptyPage})}}function ii(t,e){if(!ri(t))return!1;const o=a.beforePart,n=o?.type||"",s=o?.stack[0]||n,r=!!(n&&o.uid&&di(t,e,o.uid)===s),i=!!(n&&n.startsWith("view:")&&s.startsWith("view:"));return a.beforePart=null,a.lastWin=t,N(e),!r&&!i?(a.lastUid=null,a.onEmptyPage=!0,ai(t,e),!0):(a.lastUid=o.uid||null,a.onEmptyPage=o.onEmptyPage,Nt(t,n,"replace"),a.typeStack=[...o.stack],!0)}async function Nt(t,e,o="replace"){jp(t,e,o),o==="replace"?a.typeStack=[]:o==="push"&&a.lastType&&a.lastType!==e&&a.typeStack.push(a.lastType);const n=++a.loadGen;a.lastType=e,a.lockReady=!1,le(),j(t.document,h(t,"code_dock_loading"));let s=()=>{};a.loadInFlight=new Promise(i=>{s=i}),xt(`dock loadTemplate ${e}: waiting for the dock`);const r=await ts(t);xt(`dock loadTemplate ${e}: dock ready, fetching`),$t(t),q(t),Ht(t),G(t),Pe(t),Dt(t),jt(t,r),t.fetch(`/!/sve/section-template?type=${encodeURIComponent(e)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async i=>{if(n!==a.loadGen)return;if(i.status===404){ba(t,e);return}if(!i.ok)throw new Error(String(i.status));const l=await i.json();if(n!==a.loadGen){xt(`dock loadTemplate ${e}: overtaken (gen ${n}/${a.loadGen})`);return}xt(`dock loadTemplate ${e}: landed ${l.path||"-"}`),a.lastParts={html:typeof l.html=="string"?l.html:"",css:typeof l.css=="string"?l.css:"",js:typeof l.js=="string"?l.js:""},a.lastProps=Array.isArray(l.props)?l.props:[],a.propsDirty=!1,a.lastType=e,a.lastLocked=!!l.locked,a.lockReady=!0,Pn(),typeof l.tw=="string"&&l.tw!==""&&On(a.lastParts.html,l.tw),$t(t),Et(a.lastParts,a.lastLocked),xn(t),a.lastLocked||In(t,a.lastParts.html),Lo(t.document,l.path||e),j(t.document,a.lastLocked?h(t,"code_dock_locked"):""),l.writable?.template===!1?j(t.document,h(t,"code_dock_not_writable")):l.writable?.tw===!1&&j(t.document,h(t,"code_dock_tw_not_writable")),Tn(t),nd(t),po(t),q(t),Ht(t),G(t),jt(t,r)}).catch(i=>{xt(`dock loadTemplate ${e}: failed ${i?.message||i} (gen ${n}/${a.loadGen})`),n===a.loadGen&&(ba(t,e),j(t.document,h(t,"code_dock_error")))}).finally(()=>{n===a.loadGen&&(a.loadInFlight=null),s()})}function dt(){return a.lastType||""}function es(t){return!!t?.getElementById(u)}function ct(){return a.lastLocked}function oo(t,e){const o=typeof e?.html=="string"?e.html.trim():"",n=typeof e?.css=="string"?e.css.trim():"",s=typeof e?.js=="string"?e.js.trim():"";if(!o&&!n&&!s||!t?.document?.getElementById(u))return!1;let r=!1;return o&&(r=Hp("html",o)||r),n&&(r=ka("css",n)||r),s&&(r=ka("js",s)||r),r&&Z(t),r}function Hp(t,e){const o=v[t];if(!o||o.state.readOnly)return!1;const n=o.state.selection.main,s=n.from>0?o.state.doc.sliceString(n.from-1,n.from):`
`,r=n.to<o.state.doc.length?o.state.doc.sliceString(n.to,n.to+1):`
`,c=`${s===`
`?"":`
`}${e}${r===`
`?"":`
`}`;return o.dispatch({changes:{from:n.from,to:n.to,insert:c},selection:{anchor:n.from+c.length}}),!0}function ka(t,e){const o=v[t];if(!o||o.state.readOnly)return!1;const n=o.state.doc.length,r=`${n>0&&o.state.doc.sliceString(Math.max(0,n-1),n)!==`
`?`

`:n?`
`:""}${e}
`;return o.dispatch({changes:{from:n,insert:r},selection:{anchor:n+r.length}}),!0}function li(t){if(be(t),!a.lastType||!t.document.getElementById(u))return;const e=a.lastType;a.lastType=null,Nt(t,e,"keep")}function os(t){O(t),a.loadGen+=1,N(t),a.lastUid=null,a.lastType=null,a.typeStack=[],a.beforePart=null,a.lastParts={html:"",css:"",js:""},a.lastLocked=!1,a.lockReady=!1,a.lastBracketNames=null,a.lastCssSelectorNames=null,le(),a.lastWin=t?.defaultView||a.lastWin,w(t),za(t),vt(t),t?.getElementById(K)?.remove();for(const o of rt)v[o]?.destroy(),v[o]=null;t?.getElementById(u)?.remove(),_i(),t&&Mo(t,0);const e=t?.defaultView||a.lastWin;e?.document.getElementById(_a)&&Ea(e),e&&(Tn(e),po(e),xn(e))}function ci(t){if(a.dragging)return;const e=t.document.getElementById(u);e&&(Eo(t),jt(t,e))}function di(t,e,o){if(o){const r=Ds(o,e)||Ds(o,t.document)||o,i=js(r,e)||js(r,t.document);return qo(t,i).trim()}const n=typeof ge=="function"?ge(t):"page_sections",s=typeof lt=="function"?lt(t.document):[];for(const r of s){const l=(It(r.values)||r.values)?.[n];if(Array.isArray(l))for(const c of l){const d=qo(t,c).trim();if(d)return d}}return""}function Rp(t,e,o){const n=t.Statamic?.$config?.get?.("sveChromeTemplates")||{},s=n[e]&&typeof n[e].type=="string"?n[e]:null,r=t.Statamic?.$config?.get?.("sveChromeStyles")||{},i=`${e}/${typeof r[e]=="string"&&r[e]!==""?r[e]:"style_1"}`,l=s?.type||i,c=o?.[`${e}_style`];return(!s||s.styled)&&typeof c=="string"&&c!==""?`${e}/${c}`:l}function zp(){const t=dt();if(!t)return"";if(t===Sa)return"main";if(a.lastWin&&t===uo(a.lastWin))return"template";const e=t.match(/^(header|footer)\//);if(e)return e[1];const o=a.lastWin?.Statamic?.$config?.get?.("sveChromeTemplates")||{};return["header","footer"].find(n=>o[n]?.type===t)||""}function Wp(t){const e=Pa||Oa;return e!=="header"&&e!=="footer"?"":mn(t)||vn(t)?e:""}function Np(t,e){const o=Pa||Oa;return o!=="header"&&o!=="footer"||!mn(e)&&!vn(e)?"":Rp(t,o,It(bl()?.values)||{})}function qp(t,e){if(!e||String(e).startsWith("view:")||Jt(t,e))return!1;const o=typeof ge=="function"?ge(t):"page_sections",n=typeof lt=="function"?lt(t.document):[];for(const s of n){const i=(It(s.values)||s.values)?.[o];if(Array.isArray(i)&&i.some(l=>qo(t,l)===e))return!0}return!1}function Vp(t){const e=Ba(t)||t.getElementById("__sve-global-section-host");return e&&e.querySelector("[data-replicator-set][data-type]")?.getAttribute("data-type")||""}function Up(t,e,o){if(xt(`dock sync uid=${o||"-"} last=${a.lastUid||"-"}/${a.lastType||"-"}`),a.dragging)return;const n=!!(o&&o!==a.lastUid);if(o&&(a.lastUid=o),!t||!e||yi(e)||!La(t)||!Fa(t)){e&&os(e);return}const s=!o&&!!a.lastType&&a.lastType!==Sa&&!mn(e)&&!vn(e)&&!Ba(e)&&!qp(t,a.lastType);if(s&&ii(t,e))return;s&&(a.lastUid=null);const r=o||a.lastUid||"",i=Np(t,e)||Vp(e)||(r?di(t,e,r):"")||uo(t)||(!o&&!s?a.lastType:""),l=!i&&!o,c=l,d=i;if(a.onEmptyPage=l,a.lastWin=t,c){ai(t,e);return}if(d){if(d===a.lastType&&e.getElementById(u)){xt("dock same type, dock open: nothing to do");return}if(a.typeStack.length&&a.lastType&&a.lastType!==d){const p=a.typeStack[0];if(d===p&&!n)return;a.typeStack=[]}N(e),xt(`dock loadTemplate ${d}`),Nt(t,d,"replace")}}co("tw:changed",()=>{a.lastWin&&a.styleMode==="tw"&&B(a.lastWin)});E("dock:is-open",t=>es(t));E("dock:is-locked",()=>ct());E("dock:html",()=>bt());E("dock:reveal-html",({from:t,to:e,caret:o}={})=>{const n=v.html;if(!n||t==null)return;a.htmlScopePref=ae(a.lastWin),At(),V();const s=a.htmlFull.length,r=Math.max(0,Math.min(t,s)),i=Math.max(r,Math.min(e??t,s));a.htmlFocus=i>r?{from:r,to:i}:null,a.cssFocus=null,a.cssAll=!1;const l=o==null?null:Math.max(0,Math.min(o,s));if(a.htmlScopePref&&a.htmlFocus){Te(l),q(a.lastWin);return}if(a.htmlScopeActive){ko(!0,l),q(a.lastWin);return}n.dispatch({selection:l==null?{anchor:r,head:i}:{anchor:l},scrollIntoView:!0}),n.focus()});E("dock:insert-snippet",({win:t,parts:e})=>oo(t,e));E("dock:refresh",t=>li(t));E("dock:tw-follow",()=>{a.lastWin&&ue(a.lastWin)});E("dock:css",()=>(V(),a.cssFull));E("dock:set-css",t=>typeof t!="string"||ct()||!v.css||!a.lastWin?!1:(V(),a.cssFull=t,re("css",Vn()),Z(a.lastWin),!0));E("dock:js",()=>v.js?.state.doc.toString()??"");E("dock:set-js",t=>typeof t!="string"||ct()||!v.js||!a.lastWin?!1:(re("js",t),Z(a.lastWin),!0));E("dock:data-menu",({anchor:t,onPick:e,at:o}={})=>!t||!a.lastWin?!1:(O(a.lastWin.document),w(a.lastWin.document),ns(a.lastWin,t,e,o),!0));E("dock:props",()=>a.lastProps.map(t=>({...t})));E("dock:set-props",({win:t,props:e}={})=>!Array.isArray(e)||ct()?!1:(a.lastProps=e,a.propsDirty=!0,dc(Ao(dt())),N((t||a.lastWin)?.document),!0));function Ao(t){const e=/^view:partials\/(components\/[A-Za-z0-9_-]+)$/.exec(String(t||""));return e?e[1]:""}E("dock:component-src",()=>Ao(dt()));E("dock:type-stack",()=>a.typeStack.map(t=>({type:t,src:Ao(t)})));E("dock:component-exit-state",()=>{const t=Ao(dt());return{open:!!t,name:t?t.split("/").pop():"",back:a.typeStack.length>0}});E("dock:exit-component",(t=1)=>{if(!a.lastWin||!Xa(dt()))return!1;if(a.typeStack.length){for(let e=Number(t)||1;e>1&&a.typeStack.length>1;e-=1)a.typeStack.pop();zn(a.lastWin)}else os(a.lastWin.document);return!0});E("dock:current-type",()=>dt());E("dock:on-empty-page",()=>!!a.onEmptyPage);E("dock:current-uid",()=>a.lastUid);E("dock:leave-part",()=>{const t=a.lastWin;return t?(ii(t,t.document),!0):!1});E("dock:chrome-kind",()=>zp());E("dock:collection-view",()=>a.lastWin?uo(a.lastWin):"");E("dock:chrome-open",t=>Wp(t));E("dock:save-settled",()=>a.saveInFlight||null);E("dock:load-settled",()=>a.loadInFlight||null);E("dock:reset-data-vars",t=>(Tc(typeof t=="string"&&t?t:void 0),!0));E("dock:refresh-preview",()=>a.lastWin?(be(a.lastWin),!0):!1);E("dock:open-file",t=>typeof t!="string"||!t||!a.lastWin?!1:(a.onEmptyPage=!1,t===a.lastType||(N(a.lastWin.document),Nt(a.lastWin,t,"replace")),!0));E("dock:open-template",t=>typeof t!="string"||!t||!a.lastWin?!1:(Rn(a.lastWin,t),!0));E("dock:set-html",t=>{const e=t&&typeof t=="object"?t:{},o=t&&typeof t=="object"?t.html:t;if(typeof o!="string"||ct())return!1;if(o!==""&&!qa(bt(),o)){const i=a.lastWin;if(!(e?.unlock===!0&&i?.Statamic?.$permissions?.has?.("configure fields")===!0))return i?.Statamic?.$toast?.error(h(i,"html_tree_locked_element")),!1}const n=v.html;if(!n||!a.lastWin)return!1;if(o===""){a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null),a.twDirty=!1,a.twCss=null,a.twKey="",a.lastType=null,a.lastUid=null,a.lastParts={html:"",css:"",js:""},a.cssFull="",a.htmlFull="",a.applying=!0;try{le();for(const i of rt){const l=v[i];if(!l)continue;const c=l.state.doc.toString();c!==""&&l.dispatch({changes:{from:0,to:c.length,insert:""}})}}finally{a.applying=!1}return!0}const s=a.htmlFull;if(a.htmlFull=o,a.htmlScopeActive)return a.htmlFocus=ui(a.htmlFocus,s,o),ie(Wn()),Z(a.lastWin),hn("dock:html-changed"),!0;const r=n.state.doc.toString();if(r!==o){const[i,l,c]=Dn(r,o);n.dispatch({changes:{from:i,to:l,insert:c}})}return!0});E("dock:take-file",t=>{const e=t?.type,o=t?.parts,n=a.lastWin;if(typeof e!="string"||!e||!o||typeof o!="object"||!n||e!==a.lastType||!a.lockReady||a.lastLocked||a.saveTimer||a.saveInFlight||a.twBusy||a.twDirty)return!1;const s=l=>typeof l=="string"?l:"",r={html:s(o.html),css:s(o.css),js:s(o.js)};if(!te(Ee(),a.lastParts))return!1;if(te(r,a.lastParts))return!0;const i=a.htmlFull;return a.lastParts=r,a.propsDirty=!1,On(r.html,s(o.tw)),a.htmlScopeActive&&(a.htmlFocus=ui(a.htmlFocus,i,r.html)),Et(r,!1),j(n.document,""),G(n),n.document.getElementById(u)?.dispatchEvent(new n.Event("input",{bubbles:!0})),!0});E("dock:show-empty",()=>Q("dock:set-html",""));co("row:removed",({parentPath:t,remaining:e,win:o})=>{e===0&&t===ge(o)&&Q("dock:show-empty")});function ui(t,e,o){const n=o.length-e.length;if(!t||!n)return t;let s=0;for(;s<e.length&&s<o.length&&e[s]===o[s];)s+=1;return s>=t.to?t:s<t.from?{from:Math.max(0,t.from+n),to:Math.max(0,t.to+n)}:{from:t.from,to:Math.max(t.from,t.to+n)}}const gt="__sve-data-menu";let no=null;function O(t){const e=t?.getElementById(gt);no?.(),no=null,e?._sveApp?.unmount(),e?.remove(),t?.querySelectorAll("[data-sve-data-vars][data-open], [data-sve-antlers-btn][data-open], [data-sve-visual-edit-btn][data-open], [data-sve-snippet-btn][data-open]").forEach(o=>o.removeAttribute("data-open"))}function fi(t){if(!uo(t))return{view:"",kind:""};const e=typeof lt=="function"?lt(t.document):[];for(const o of e){const n=It(o.values)||o.values,s=typeof n?.source_collection=="string"?n.source_collection.trim():"";if(s)return{view:s,kind:String(n?.kind||"").trim()}}return{view:"",kind:""}}function Kp(t,e){const o=bt();if(Number.isFinite(e))return Ws(o,e);const n=v.html;if(!n)return[];const s=a.htmlScopeActive&&a.htmlFocus?a.htmlFocus.from:0;return Ws(o,s+n.state.selection.main.from)}function Gp(t,e){const{view:o,kind:n}=fi(t);return{collection:_n(t)||"",set:Sn(dt()),view:o,kind:n,scope:Cc(Kp(t,e))}}function Xp(t){const{view:e,kind:o}=fi(t),n={collection:_n(t)||"",set:Sn(dt()),view:e,scope:""};return $n(t,n).then(s=>Cn(s?.section||[],yo(t)))}function Yp(t){const e=typeof lt=="function"?lt(t.document):[];for(const o of e){const n=It(o.values)||o.values;if(n&&typeof n=="object")return n}return null}function Zp(t,e){return{scope:e?.scope?.groups||[],section:Cn(e?.section||[],yo(t)),page:Mc(e?.page||[],Yp(t)),site:e?.site||[]}}function pi(t){const e=t.state.selection.main,o=t.state.doc.lineAt(e.from),n=o.text.slice(0,e.from-o.from);return/(?:^|\s)(?::|x-bind:)[\w.:-]+\s*=\s*(["'])(?:(?!\1).)*$/.test(n)}function hi(t){const e=t.state.selection.main,o=t.state.doc.lineAt(e.from),n=o.text.slice(0,e.from-o.from);return/(?:^|\s)[\w.:@-]+\s*=\s*(["'])(?:(?!\1).)*$/.test(n)}function Jp(t,e){const o=v.html;if(!o||o.state.readOnly)return;if(pi(o)){const c=String(t?.var||"").trim(),d=o.state.selection.main;o.dispatch({changes:{from:d.from,to:d.to,insert:c},selection:{anchor:d.from+c.length}}),I();return}const n=Lc(t,e,{inline:hi(o)});if(!n)return;const s=o.state.selection.main,r=o.state.doc.lineAt(s.from),i=X(r.text),l=fo(n.text,i);o.dispatch({changes:{from:s.from,to:s.to,insert:l},selection:{anchor:s.from+n.cursor+(n.text.includes(`
`)?i.length:0)}}),I()}function Ot(t,e,o){const n=e.getBoundingClientRect(),s=8,r=o.offsetWidth||368,i=o.offsetHeight||240,l=t.innerHeight-n.bottom-s,c=n.top-s,d=l>=i||l>=c?n.bottom+4:n.top-i-4;o.style.left=`${Math.max(s,Math.min(n.left,t.innerWidth-r-s))}px`,o.style.top=`${Math.max(s,Math.min(d,t.innerHeight-i-s))}px`}function ns(t,e,o,n){const s=t.document;O(s),e.setAttribute("data-open","");const r=s.createElement("div");r.id=gt,r.setAttribute("data-sve-data-menu",""),s.body.appendChild(r);const i=Gp(t,n),l=m=>[m?.scope?.groups?.length?{id:"scope",label:m.scope.label||h(t,"data_vars_tab_loop")}:null,{id:"section",label:h(t,"data_vars_tab_section")},{id:"page",label:h(t,"data_vars_tab_page")},{id:"site",label:h(t,"data_vars_tab_site")}].filter(Boolean),c=m=>{s.getElementById(gt)&&(r._sveApp?.unmount(),r._sveApp=R(tr,r,{title:h(t,"data_vars_title"),placeholder:h(t,"data_vars_placeholder"),emptyText:h(t,"data_vars_empty"),noSectionText:h(t,"data_vars_no_section"),loopText:h(t,"data_vars_loop"),tabs:l(m),data:Zp(t,m),onPick:(y,b)=>o?o(y,b):Jp(y,b)}),Ot(t,e,r))};c(er(wn(i))||{scope:null,section:[],page:[],site:[]}),$n(t,i).then(c),Ot(t,e,r);const d=()=>Ot(t,e,r),p=m=>{!r.contains(m.target)&&!e.contains(m.target)&&O(s)},f=m=>{m.key==="Escape"&&O(s)};s.addEventListener("pointerdown",p,!0),s.addEventListener("keydown",f,!0),t.addEventListener("scroll",d,!0),t.addEventListener("resize",d),no=()=>{s.removeEventListener("pointerdown",p,!0),s.removeEventListener("keydown",f,!0),t.removeEventListener("scroll",d,!0),t.removeEventListener("resize",d)}}function ss(t,e,{title:o,placeholder:n,tabs:s,data:r,onPick:i}){const l=t.document;O(l),w(l),e.setAttribute("data-open","");const c=l.createElement("div");c.id=gt,c.setAttribute("data-sve-data-menu",""),l.body.appendChild(c),c._sveApp=R(tr,c,{title:o,placeholder:n,emptyText:h(t,"data_vars_empty"),noSectionText:h(t,"data_vars_empty"),loopText:"",tabs:s,data:r,onPick:(d,p)=>{O(l),i(d,p)}}),Ot(t,e,c),as(t,e,c)}function as(t,e,o){const n=t.document,s=()=>Ot(t,e,o),r=l=>{!o.contains(l.target)&&!e.contains(l.target)&&O(n)},i=l=>{l.key==="Escape"&&O(n)};n.addEventListener("pointerdown",r,!0),n.addEventListener("keydown",i,!0),t.addEventListener("scroll",s,!0),t.addEventListener("resize",s),no=()=>{n.removeEventListener("pointerdown",r,!0),n.removeEventListener("keydown",i,!0),t.removeEventListener("scroll",s,!0),t.removeEventListener("resize",s)}}const Qp='<svg width="21" height="11" viewBox="0 0 150 77" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M69.999 55.827a13.8 13.8 0 0 0-.812-3.799 15.4 15.4 0 0 0-1.687-3.55 18.16 18.16 0 0 0-5.686-5.418 37.7 37.7 0 0 0 3.936-6.228 18.6 18.6 0 0 0 1.812-6.228 9.88 9.88 0 0 0-1.248-5.57 9.9 9.9 0 0 0-4.125-3.959 10.46 10.46 0 0 0-10.684 1.183 13.8 13.8 0 0 0-4.061 5.107 39 39 0 0 0-1.812 4.92 49.5 49.5 0 0 1-5.436-6.227 16.9 16.9 0 0 1-2.562-5.606 28.7 28.7 0 0 1-.624-6.85c.003-2-.357-3.983-1.063-5.855a10.66 10.66 0 0 0-4.56-5.231 13.9 13.9 0 0 0-10.684-1.37 10.13 10.13 0 0 0-4.94 2.755 10.1 10.1 0 0 0-2.683 4.967 24.4 24.4 0 0 0 0 10.214 22.4 22.4 0 0 0 3.374 7.35h-1.062a23 23 0 0 1-4.124 0 19.2 19.2 0 0 0-6.248 0 6.74 6.74 0 0 0-3.374 2.74 9.45 9.45 0 0 0-.75 9.341 11.23 11.23 0 0 0 5.811 6.228 25.1 25.1 0 0 0 10.622 1.495 17.9 17.9 0 0 0 9.809-3.425 104 104 0 0 1 10.496 7.162 22.4 22.4 0 0 1 5.249 6.54 15.5 15.5 0 0 1 1.437 5.106 35 35 0 0 0 1.437 6.789 13.2 13.2 0 0 0 4.373 5.73 15.6 15.6 0 0 0 10.372 2.802 9.9 9.9 0 0 0 5.429-1.987 9.84 9.84 0 0 0 3.38-4.677A61.6 61.6 0 0 0 70 55.827m-5.061 12.456a5.05 5.05 0 0 1-1.971 2.157 5.07 5.07 0 0 1-2.84.708 9.45 9.45 0 0 1-6.248-2.367 6.6 6.6 0 0 1-2.124-2.989 50 50 0 0 1-1.625-6.788 18.7 18.7 0 0 0-2.249-5.73 28.7 28.7 0 0 0-7.435-7.35A129 129 0 0 0 27.95 38.95c-.812-.498-2.686 0-2.749 0a14.03 14.03 0 0 1-7.872 1.62 19.5 19.5 0 0 1-7.935-2.056 4.86 4.86 0 0 1-2.375-2.49 3.35 3.35 0 0 1 0-2.99 1.18 1.18 0 0 1 .875-.748c1.25 0 2.687 0 3.936-.435a33 33 0 0 0 4.749-1.122 17.6 17.6 0 0 0 4.498-2.18 1.68 1.68 0 0 0 .838-1.68 1.7 1.7 0 0 0-.213-.624 2.2 2.2 0 0 0-.937-.747 18.65 18.65 0 0 1-2.812-7.35 19.5 19.5 0 0 1 .938-7.97 4.55 4.55 0 0 1 1.326-1.834 4.57 4.57 0 0 1 2.048-.97 7.52 7.52 0 0 1 5.498.997 5.12 5.12 0 0 1 2.499 3.488 87 87 0 0 0 1.874 10.587 22.4 22.4 0 0 0 4.436 6.789 78 78 0 0 0 8.372 7.286 1.8 1.8 0 0 0 1.188 1.246 2.005 2.005 0 0 0 2.499-1.308 33.4 33.4 0 0 1 3.249-6.54 8.8 8.8 0 0 1 2.811-2.677 4.63 4.63 0 0 1 4.561 0 4 4 0 0 1 1.612 1.494c.387.638.586 1.372.575 2.118a14.7 14.7 0 0 1-.75 5.792 36.6 36.6 0 0 1-2.561 6.228v.311a2.05 2.05 0 0 0 .5 2.74 13.6 13.6 0 0 1 3.248 4.92c.375.873.563 1.745.875 2.617s.937 2.678 1.312 4.048c1.625 5.916 2.5 7.536.875 10.961zM148.848 29.42a6.6 6.6 0 0 0-3.062-2.74 16.7 16.7 0 0 0-6.248 0c-1.227.09-2.459.09-3.686 0h-.937a24.2 24.2 0 0 0 3.186-7.536c.659-3.31.659-6.716 0-10.027a9.95 9.95 0 0 0-2.072-5.336 10 10 0 0 0-4.676-3.32 12.53 12.53 0 0 0-10.184 1.556 10.78 10.78 0 0 0-4.498 5.668 16.8 16.8 0 0 0-.875 5.667 32.7 32.7 0 0 1 0 6.602 17.2 17.2 0 0 1-2.499 5.543 52 52 0 0 1-4.748 5.792 32 32 0 0 0-1.5-4.547 14.4 14.4 0 0 0-3.811-5.231 9.522 9.522 0 0 0-10.56-.996 10.16 10.16 0 0 0-3.64 4.024 10.1 10.1 0 0 0-1.045 5.317c.21 2.156.78 4.26 1.687 6.228a38.3 38.3 0 0 0 3.748 6.228 17.5 17.5 0 0 0-5.435 5.668 15 15 0 0 0-1.562 3.55 18.3 18.3 0 0 0-.75 3.674v10.09c.068 1.417.32 2.82.75 4.172a9.46 9.46 0 0 0 3.062 4.609 9.5 9.5 0 0 0 5.123 2.118 14.1 14.1 0 0 0 9.871-2.927 12.76 12.76 0 0 0 4.124-5.792 34 34 0 0 0 1.562-6.727 17.6 17.6 0 0 1 1.375-5.107 21.1 21.1 0 0 1 4.623-6.228 83 83 0 0 1 8.935-7.349 16.34 16.34 0 0 0 8.997 3.301 22.24 22.24 0 0 0 9.746-1.557 10.777 10.777 0 0 0 5.499-6.228 9.88 9.88 0 0 0-.5-8.158m-5.623 6.229a4.43 4.43 0 0 1-2.062 2.553 16.16 16.16 0 0 1-7.06 2.18 11.7 11.7 0 0 1-7.123-1.869s-1.999-.81-2.812 0a123 123 0 0 0-11.558 7.038 26.9 26.9 0 0 0-6.811 7.224 79 79 0 0 0-3.623 12.456 6.23 6.23 0 0 1-2 3.052 7.88 7.88 0 0 1-5.373 2.305 4.63 4.63 0 0 1-2.523-.809 4.6 4.6 0 0 1-1.663-2.056 9.8 9.8 0 0 1-.812-3.488c.25-2.711.881-5.373 1.874-7.91.375-1.37.75-2.678 1.187-4.048s.438-1.806.812-2.616a13.26 13.26 0 0 1 2.937-5.044 2.054 2.054 0 0 0 .375-2.74 44 44 0 0 1-2.25-6.228 17.3 17.3 0 0 1-.687-5.792 4.22 4.22 0 0 1 1.937-3.675 3.57 3.57 0 0 1 3.811 0 8.3 8.3 0 0 1 2.625 2.678 40.5 40.5 0 0 1 3.061 6.228 1.93 1.93 0 0 0 1.664 1.441c.26.029.522.005.773-.07a1.82 1.82 0 0 0 1.187-1.309 80 80 0 0 0 7.872-7.411 22.5 22.5 0 0 0 3.999-6.664 75.4 75.4 0 0 0 1.749-10.525 5.17 5.17 0 0 1 1.937-3.176 5.76 5.76 0 0 1 4.749-.935 4.11 4.11 0 0 1 3.186 2.927c.751 2.609.985 5.338.687 8.035a19 19 0 0 1-2.561 7.473s-.625 0-.75.56a1.68 1.68 0 0 0 .5 2.367c1.27.908 2.657 1.641 4.123 2.18 1.468.49 2.972.865 4.499 1.121 1.125 0 2.374 0 3.561.436s.438.311.625.623c.235.52.351 1.087.341 1.657a3.9 3.9 0 0 1-.403 1.644z"/></svg>',th='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 9 5 12 1.8-5.2L21 14Z"/><path d="M7.2 2.2 8 5.1"/><path d="m5.1 8-2.9-.8"/><path d="M14 4.1 12 6"/><path d="m6 12-1.9 2"/></svg>';function Oe(t,e,o,n,s){const r=t.document.createElement("button");return r.type="button",r.setAttribute(o,""),r.title=s,r.setAttribute("aria-label",s),r.innerHTML=`<span>${n}</span>`,r.addEventListener("mousedown",i=>i.preventDefault()),e.replaceChildren(r),r}function eh(t){return String(t||"").replace(/\|/g,"").split(`
`)[0].trim()}function mi(t,e){const o=e.querySelector("[data-sve-data-vars]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("mousedown",n=>n.preventDefault()),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),t.document.getElementById(gt)){O(t.document);return}w(t.document),ns(t,o)}))}function vi(t,e){const o=e.querySelector("[data-sve-antlers-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=Oe(t,o,"data-sve-antlers-btn",Qp,h(t,"code_dock_antlers"));n.addEventListener("click",s=>{if(s.preventDefault(),s.stopPropagation(),n.hasAttribute("data-open")){O(t.document);return}const r={};for(const i of qs)r[i.id]=hc.filter(l=>l.group===i.id).map(l=>({id:l.id,var:l.label,value:l.inline?"":eh(l.snippet)}));ss(t,n,{title:h(t,"code_dock_antlers"),placeholder:h(t,"code_dock_antlers_search"),tabs:qs.map(i=>({id:i.id,label:h(t,i.lang)})),data:r,onPick:i=>oh(i.id)})})}function oh(t){const e=mc(t),o=v.html;if(!e||!o||o.state.readOnly)return;const n=o.state.selection.main.head;if(e.inline){const c=e.snippet,d=o.state.selection.main;o.dispatch({changes:{from:d.from,to:d.to,insert:c},selection:{anchor:d.from+c.length}}),I();return}const s=o.state.doc.lineAt(n),r=s.text.trim()?X(s.text):de(o,s)||X(s.text),{text:i,cursor:l}=Ue(e.snippet);Qt(fo(i,r),l),I()}function gi(t,e){const o=e.querySelector("[data-sve-visual-edit-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=Oe(t,o,"data-sve-visual-edit-btn",th,h(t,"code_dock_visual_edit"));n.addEventListener("click",s=>{if(s.preventDefault(),s.stopPropagation(),n.hasAttribute("data-open")){O(t.document);return}const r={};for(const i of Gs)r[i.id]=or.filter(l=>l.group===i.id).map(l=>({id:l.id,var:l.label,value:l.attr?l.attr.replace(/\|/g,""):""}));ss(t,n,{title:h(t,"code_dock_visual_edit"),placeholder:h(t,"code_dock_visual_edit_search"),tabs:Gs.map(i=>({id:i.id,label:h(t,i.lang)})),data:r,onPick:i=>sh(i.id)})})}function nh(t,e,o,n){if(Pc(o.inner,n.attr)){t.focus();return}const{text:s,cursor:r}=Ue(n.attr);let i=o.closeIdx;for(;i>o.openIdx+2&&/\s/.test(e[i-1]);)i--;t.dispatch({changes:{from:i,to:o.closeIdx,insert:` ${s} `},selection:{anchor:i+1+r}}),I()}function sh(t){const e=Fc(t),o=v.html;if(!e||!o||o.state.readOnly)return;const n=o.state.doc.toString(),s=ce();if(s?.open){const f=Bc(n,s.open.from,s.open.to,He);if(f){e.attr?nh(o,n,f,e):(o.dispatch({selection:{anchor:f.openIdx+2+He.length}}),o.focus());return}const m=s.open.from+1+s.name.length,y=e.standalone||`{{ ${He} ${e.attr} }}`,{text:b,cursor:k}=Ue(y);o.dispatch({changes:{from:m,to:m,insert:` ${b}`},selection:{anchor:m+1+k}}),I();return}const r=o.state.selection.main.head,i=o.state.doc.lineAt(r),l=i.text.trim()?X(i.text):de(o,i)||X(i.text),c=e.standalone||`{{ ${He} ${e.attr} }}`,{text:d,cursor:p}=Ue(c);Qt(fo(d,l),p),I()}function bi(t){return t==="css"?_s():t==="js"?Ss():xs({autoCloseTags:!0})}function an(t){if(t._sveShield)return;t._sveShield=!0;const e=o=>o.stopPropagation();for(const o of["keydown","keypress","keyup","pointerdown","pointerup","mousedown","mouseup","click","focusin"])t.addEventListener(o,e)}function yi(t){try{return new URLSearchParams(t.defaultView?.location?.search||"").has("sve-panel")}catch{return!1}}function ah(t){const e=parseInt(st(t,Cs)??"",10);return Number.isFinite(e)&&e>=Ls?e:Oi}function rh(t,e){U(t,Cs,String(e))}function rs(t){try{const e=JSON.parse(st(t,Ts)||"null");if(e&&typeof e=="object")return{html:e.html!==!1,css:e.css!==!1,js:e.js===!0,alpine:e.alpine===!0}}catch{}return{html:!0,css:!0,js:!1,alpine:!1}}function ih(t,e){U(t,Ts,JSON.stringify(e))}function ki(t){try{const e=JSON.parse(st(t,As)||"null");if(e&&typeof e=="object"){const o=s=>Number.isFinite(s)&&s>0?s:1,n={};for(const s of Tt)n[s]=o(e[s]);return n}}catch{}return Object.fromEntries(Tt.map(e=>[e,1]))}function lh(t,e){U(t,As,JSON.stringify(e))}function xi(t){cl(t,Pi,`
@keyframes sve-cm-wait { to { transform: rotate(360deg); } }
#${u} {
  /* The tree's seven families, for the marks and the toolbar below. */
  ${Sl("dark")}
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
  ${Hs("ns")}
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
#${gt} {
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
  ${Hs("ew")}
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
#${ht} {
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
#${ht}:hover {
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
#${je} {
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
#${je} [data-sve-partial-choice] {
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
#${je} [data-sve-partial-choice]:hover {
  background: rgba(255,255,255,.1);
}
#${je} [data-sve-partial-empty] {
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
`)}function ch(t){const e=t.querySelector(".live-preview-editor");if(!e)return 0;const o=e.getBoundingClientRect();return o.width<40||o.right<40?0:Math.round(o.right)}function dh(t){let e=0;for(const o of["__sve-section-picker","__sve-outline-panel","__sve-html-tree-panel","__sve-listview-panel","__sve-right-dock","__sve-chrome-designs","__sve-global-section-panel","__sve-ai-panel"]){const n=t.getElementById(o);if(!n||n.hasAttribute("data-sve-chrome-hidden")||n.hasAttribute("data-sve-right-closed")||n.style.display==="none")continue;const s=n.getBoundingClientRect();s.width>40&&s.right>t.documentElement.clientWidth-8&&(e=Math.max(e,Math.round(s.width)))}return e}function Eo(t){const e=t.document;if(a.layoutWin=t,typeof t.ResizeObserver!="function")return;a.layoutObserver||(a.layoutObserver=new t.ResizeObserver(()=>{a.layoutWin&&ci(a.layoutWin)}));const o=e.querySelector(".live-preview-editor"),n=e.getElementById("__sve-right-dock");o!==a.observedEditor&&(a.observedEditor&&a.layoutObserver.unobserve(a.observedEditor),a.observedEditor=o,o&&a.layoutObserver.observe(o)),n!==a.observedRight&&(a.observedRight&&a.layoutObserver.unobserve(a.observedRight),a.observedRight=n,n&&a.layoutObserver.observe(n))}function _i(){a.layoutObserver?.disconnect(),a.layoutObserver=null,a.layoutWin=null,a.observedEditor=null,a.observedRight=null}function Si(t){a.layoutWatchBound||(a.layoutWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>Eo(t)))}function Mo(t,e){const o=t.querySelector(".live-preview-contents");o&&(o.style.paddingBottom=e?`${e}px`:"")}function is(t){if(!t)return;const e=t.clientHeight,o=t.querySelector("[data-sve-code-bar]"),n=t.querySelector("[data-sve-code-lock-banner]"),s=n&&uh(t)?.getComputedStyle(n).display!=="none"?n.offsetHeight:0,r=Math.max(64,e-(o?.offsetHeight||0)-s),i=t.querySelector("[data-sve-code-panes]");i&&(i.style.height=`${r}px`,i.style.minHeight="0",i.style.overflow="hidden"),t.querySelectorAll("[data-sve-code-host]").forEach(l=>{const c=l.closest("[data-sve-code-pane]");if(!c||c.style.display==="none")return;let d=0;for(const f of c.children)f!==l&&(d+=f.offsetHeight);const p=Math.max(64,r-d);l.style.height=`${p}px`,l.style.maxHeight=`${p}px`,l.style.minHeight="0",l.style.overflow="auto",fh(l)})}function uh(t){return t.ownerDocument?.defaultView||a.lastWin}function fh(t){t._sveWheelBound||(t._sveWheelBound=!0,t.addEventListener("wheel",e=>{const o=t.scrollHeight-t.clientHeight,n=t.scrollWidth-t.clientWidth;let s=!1;if(e.deltaY&&o>0){const r=Math.min(o,Math.max(0,t.scrollTop+e.deltaY));r!==t.scrollTop&&(t.scrollTop=r,s=!0)}if(e.deltaX&&n>0){const r=Math.min(n,Math.max(0,t.scrollLeft+e.deltaX));r!==t.scrollLeft&&(t.scrollLeft=r,s=!0)}s&&(e.preventDefault(),e.stopPropagation())},{passive:!1}))}function wi(){const t=(a.layoutWin||a.lastWin)?.document?.getElementById(u);t&&is(t);for(const e of rt)v[e]?.requestMeasure()}function $i(t,e){const o=rs(t),n={};for(const s of Tt){const r=e.querySelector(`[data-sve-code-pane-btn="${s}"]`);n[s]=r?r.getAttribute("aria-pressed")==="true":o[s]}return n}function ls(t,e){for(const n of Tt){const s=t.querySelector(`[data-sve-code-pane-btn="${n}"]`),r=t.querySelector(`[data-sve-code-pane="${n}"]`);s&&s.setAttribute("aria-pressed",e[n]?"true":"false"),r&&(r.style.display=e[n]?"flex":"none")}const o=Tt.filter(n=>e[n]);t.querySelectorAll("[data-sve-code-split]").forEach(n=>{const s=n.getAttribute("data-sve-code-split-after"),r=o.indexOf(s);n.style.display=r>=0&&r<o.length-1?"block":"none"}),Ci(t.ownerDocument.defaultView,t),is(t)}function Ci(t,e){const o=ki(t);for(const n of Tt){const s=e.querySelector(`[data-sve-code-pane="${n}"]`);s&&(s.style.flex=`${o[n]} 1 0`)}}function jt(t,e){if(a.dragging)return;const o=t.document;Vo(o,e);const n=ah(t),s=ch(o),r=dh(o);e.style.left=`${s}px`,e.style.right=`${r}px`,e.style.bottom="0",e.style.height=`${n}px`,Mo(o,n),is(e)}function Ti(t,e,o,n){a.dragging=!0,wl(t,e,o,()=>{a.dragging=!1,n?.()},"data-sve-code-drag-shield")}function Ai(t,e){if(e._sveResizeBound)return;e._sveResizeBound=!0;const o=n=>{if(n.button!==0||n.target.closest('button, a, input, select, textarea, label, [role="button"], [contenteditable], .cm-editor'))return;n.preventDefault();const s=n.clientY,r=e.getBoundingClientRect().height;let i=r;Ti(t,"ns-resize",l=>{i=Math.min(Math.max(Ls,r+(s-l.clientY)),Math.round(t.innerHeight*.7)),e.style.height=`${i}px`,Mo(t.document,i),wi()},()=>{rh(t,i),jt(t,e),t.dispatchEvent(new Event("resize"))})};e.querySelector("[data-sve-code-bar]")?.addEventListener("mousedown",o),e.querySelector("[data-sve-code-grip]")?.addEventListener("mousedown",o)}function Ei(t,e){e._sveSplitBound||(e._sveSplitBound=!0,e.querySelectorAll("[data-sve-code-split]").forEach(o=>{o.addEventListener("mousedown",n=>{if(n.button!==0)return;n.preventDefault(),n.stopPropagation();const s=o.getAttribute("data-sve-code-split-after"),r=Tt.filter(k=>$i(t,e)[k]),i=r.indexOf(s),l=r[i],c=r[i+1];if(!l||!c)return;const d=e.querySelector(`[data-sve-code-pane="${l}"]`),p=e.querySelector(`[data-sve-code-pane="${c}"]`),f=n.clientX,m=d.getBoundingClientRect().width,y=p.getBoundingClientRect().width,b=m+y;o.setAttribute("data-active",""),Ti(t,"col-resize",k=>{const L=k.clientX-f;let pt=Math.max(Ve,Math.min(b-Ve,m+L)),De=b-pt;b<Ve*2&&(pt=m,De=y);const Po=ki(t);Po[l]=pt,Po[c]=De,lh(t,Po),Ci(t,e),wi()},()=>{o.removeAttribute("data-active")})})}))}function Mi(t,e){e._svePaneBound||(e._svePaneBound=!0,e.querySelectorAll("[data-sve-code-pane-btn]").forEach(o=>{o.addEventListener("click",n=>{n.stopPropagation();const s=o.getAttribute("data-sve-code-pane-btn"),r=$i(t,e),i={...r,[s]:!r[s]};!i.html&&!i.css&&!i.js&&(i[s]=!0),ih(t,i),ls(e,i)})}))}function j(t,e){const o=t.getElementById(u)?.querySelector("[data-sve-code-status]");o&&(o.textContent=e||"")}function Lo(t,e){const o=t.getElementById(u)?.querySelector("[data-sve-code-path]");o&&(o.textContent=e||"",o.title=e||"")}function Ht(t){const e=t?.document?.getElementById(u)?.querySelector("[data-sve-code-back]");e&&(e.hidden=a.typeStack.length===0,e.title=h(t,"code_dock_back"),e.setAttribute("aria-label",e.title),e.innerHTML=Hi)}function rn(t,e){const o=e.querySelector("[data-sve-code-back]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),zn(t)}))}let P,so,cs,ds,us,Lt,oe,ut,qt,ft,ot,fs,ps,hs,Fo,ms,vs,gs,bs,ys,ks,xe,xs,_s,Ss,ws,ao,ro,$s,Li,pe=null,T=null;function Fi(){return pe||(pe=tl().then(t=>{T=t,P=T.view.EditorView,so=T.view.keymap,cs=T.view.lineNumbers,ds=T.view.highlightActiveLine,us=T.view.highlightActiveLineGutter,Lt=T.state.Compartment,oe=T.state.EditorState,ut=T.state.StateField,qt=T.state.StateEffect,ft=T.state.RangeSetBuilder,ot=T.view.Decoration,fs=T.commands.defaultKeymap,ps=T.commands.indentWithTab,hs=T.commands.historyKeymap,Fo=T.commands.history,ms=T.autocomplete.autocompletion,vs=T.autocomplete.closeBrackets,gs=T.autocomplete.closeBracketsKeymap,bs=T.autocomplete.closeCompletion,ys=T.autocomplete.completionKeymap,ks=T.view.hoverTooltip,xe=T.langHtml.htmlLanguage,xs=T.langHtml.html,_s=T.langCss.css,Ss=T.langJs.javascript,T.language.HighlightStyle,T.language.syntaxHighlighting,ws=T.language.codeFolding,ao=T.language.foldEffect,ro=T.language.unfoldEffect,$s=T.language.foldedRanges,Li=T.highlight.tags,Xt.html=new Lt,Xt.css=new Lt,Xt.js=new Lt,Yt.html=new Lt,Yt.css=new Lt,Yt.js=new Lt}).catch(t=>{throw pe=null,t}),pe)}const Bi="{{ _class }}",u=Ji,Pi="__sve-code-dock-style",K="__sve-code-dock-unlock",Cs="sve-code-dock-height",Ts="sve-code-dock-panes",As="sve-code-dock-widths",Ie="sve-html-scope-v2",Es="sve-code-dock-autosave",Ms="sve-code-dock-style-mode",Bo="sve-code-dock-values",Oi=280,Ls=120,Ve=140,Ii=250,rt=["html","css","js"],Tt=["html","css","alpine","js"],Di='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',ji='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-1"/></svg>',Hi='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',Fs='<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1c0 .966.784 1.75 1.75 1.75h.418A1.74 1.74 0 0 0 4 7.25v1.5c0 .49.201.932.525 1.25c-.324.318-.525.76-.525 1.25v1c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 14 12.25v-1c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1.5c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1A1.75 1.75 0 0 0 12.25 2zm8.5 7.5H8v-3h4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75M7 6.5v3H5.75A.75.75 0 0 1 5 8.75v-1.5a.75.75 0 0 1 .75-.75zm1 4h4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75H8zm-1 0V13H5.75a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-1-5V3h6.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75zm-1 0H3.75A.75.75 0 0 1 3 4.75v-1A.75.75 0 0 1 3.75 3H5z"/></svg>',Ri='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/><path d="M4.5 11.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/></svg>',zi='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 16.3A8.5 8.5 0 1 1 18.3 6.3"/><path d="M21 3.2v5.4h-5.4"/></svg>',Wi='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',Ni='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',x="__sve-css-menu",Bs=["h1","h2","h3","h4","h5","h6"],ln=[{id:"div",classes:"",lang:"code_dock_div_plain"},{id:"flex",classes:"flex",lang:"code_dock_div_flex"},{id:"flex-col",classes:"flex flex-col",lang:"code_dock_div_flex_col"},{id:"flex-row",classes:"flex flex-row",lang:"code_dock_div_flex_row"},{id:"container",classes:"wrapper",lang:"code_dock_div_container"}],io=[{id:"section",title:"section",tag:"section"},{id:"div",title:"div",menu:"div"},{id:"heading",title:"heading",menu:"heading"},{id:"text",title:"text",menu:"text"},{id:"a",title:"link",tag:"a"},{id:"img",title:"image",snippet:'<img src="" alt="">',caret:10},{id:"video",title:"video",snippet:'<video src="" controls playsinline></video>',caret:12},{id:"ul",title:"list",tag:"ul"},{id:"li",title:"list item",tag:"li"},{id:"component",title:"component",menu:"component"},{id:"loop",title:"loop",snippet:`{{ items }}

{{ /items }}
`,caret:3,select:5},{id:"pagination",title:"pagination",action:"pagination"},{id:"if",title:"if",snippet:`{{ if true }}

{{ /if }}
`,caret:6,select:4}],qi=["--size-100","--size-200","--size-300","--size-400","--size-500","--size-600","--size-700","--size-800","--size-900","--gutter"],Vi={"tw-text":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 13 5 3l3.5 10M2.7 10h4.6"/><path d="M12.5 3.5v9M11 5l1.5-1.5L14 5M11 11l1.5 1.5L14 11"/></svg>',"tw-leading":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h8.5M6 8h8.5M6 12.5h8.5"/><path d="M2.5 4.5v7M1.4 5.6 2.5 4.5l1.1 1.1M1.4 10.4l1.1 1.1 1.1-1.1"/></svg>',"tw-font":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.2V3h10v1.2M8 3v10M6 13h4"/></svg>',"tw-radius":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 13.5v-6a5 5 0 0 1 5-5h6"/><path d="M13.5 6.5v7h-7" stroke-dasharray="2 2"/></svg>',"tw-gap":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"tw-align":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3.5h12M2 8h8M2 12.5h10"/></svg>',"tw-w":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3.5v9M14 3.5v9"/><path d="M4.5 8h7"/><path d="M6 6.2 4.2 8 6 9.8M10 6.2 11.8 8 10 9.8"/></svg>',"tw-h":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 2h9M3.5 14h9"/><path d="M8 4.5v7"/><path d="M6.2 6 8 4.2 9.8 6M6.2 10 8 11.8 9.8 10"/></svg>',"tw-maxw":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3v10M14.5 3v10"/><path d="M5 8h6"/><path d="M6.6 6.2 4.8 8l1.8 1.8M9.4 6.2 11.2 8l-1.8 1.8"/></svg>',"tw-overflow":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="1.8" y="4.5" width="8.6" height="9.7" rx="1.2"/><path d="M6.5 1.8h7.7v7.7" stroke-linecap="round"/></svg>',"tw-border":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6"/><rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" stroke-width="1" opacity=".45"/></svg>',"tw-border-color":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6" stroke-dasharray="3.1 2.2"/><rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" fill="currentColor" stroke="none" opacity=".55"/></svg>'},Ui='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="10" width="18" height="11" rx="2"/><rect x="6" y="3" width="9" height="4" rx="1.4" fill="currentColor" stroke="none"/></svg>',Ki='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.1 12a8.9 8.9 0 1 0 2.8-6.5L3 8"/><path d="M3 3.4V8h4.6"/><path d="M12 7.4V12l3 1.8"/></svg>',Gi='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>',Xi='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></svg>',Yi='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/><path d="M3 17c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/></svg>',Ps=[["--gray-50","#fafafa"],["--gray-100","#f5f5f5"],["--gray-200","#e5e5e5"],["--gray-300","#d4d4d4"],["--gray-400","#a3a3a3"],["--gray-500","#737373"],["--gray-600","#525252"],["--gray-700","#404040"],["--gray-800","#262626"],["--gray-900","#171717"],["--gray-950","#0a0a0a"]],xa=t=>[{id:`${t}-all`,icon:"box-all",title:"All sides",css:t,tw:t,menu:"spacing"},{id:`${t}-block`,icon:"box-block",title:"Top and bottom",css:`${t}-block`,tw:`${t}-block`,menu:"spacing",sep:!0},{id:`${t}-block-start`,icon:"box-block-start",title:"Top",css:`${t}-block-start`,tw:`${t}-top`,menu:"spacing"},{id:`${t}-block-end`,icon:"box-block-end",title:"Bottom",css:`${t}-block-end`,tw:`${t}-bottom`,menu:"spacing"},{id:`${t}-inline`,icon:"box-inline",title:"Left and right",css:`${t}-inline`,tw:`${t}-inline`,menu:"spacing",sep:!0},{id:`${t}-inline-start`,icon:"box-inline-start",title:"Left",css:`${t}-inline-start`,tw:`${t}-left`,menu:"spacing"},{id:`${t}-inline-end`,icon:"box-inline-end",title:"Right",css:`${t}-inline-end`,tw:`${t}-right`,menu:"spacing"}],ph=[{id:"display-flex",twClass:"flex",icon:"display-flex",title:"Flex",kind:"display",value:"flex",css:"display"},{id:"flex-row",twClass:"flex-row",icon:"flex-row",title:"Direction: row",kind:"flexDir",value:"row",css:"flex-direction",sep:!0},{id:"flex-col",twClass:"flex-col",icon:"flex-col",title:"Direction: column",kind:"flexDir",value:"column",css:"flex-direction"},{id:"justify-start",twClass:"justify-start",icon:"justify-start",title:"Justify: start",css:"justify-content",value:"flex-start",when:"flex",sep:!0},{id:"justify-center",twClass:"justify-center",icon:"justify-center",title:"Justify: center",css:"justify-content",value:"center",when:"flex"},{id:"justify-end",twClass:"justify-end",icon:"justify-end",title:"Justify: end",css:"justify-content",value:"flex-end",when:"flex"},{id:"justify-between",twClass:"justify-between",icon:"justify-between",title:"Justify: between",css:"justify-content",value:"space-between",when:"flex"},{id:"justify-around",twClass:"justify-around",icon:"justify-around",title:"Justify: around",css:"justify-content",value:"space-around",when:"flex"},{id:"align-start",twClass:"items-start",icon:"align-start",title:"Align: start",css:"align-items",value:"flex-start",when:"flex",sep:!0},{id:"align-center",twClass:"items-center",icon:"align-center",title:"Align: center",css:"align-items",value:"center",when:"flex"},{id:"align-end",twClass:"items-end",icon:"align-end",title:"Align: end",css:"align-items",value:"flex-end",when:"flex"},{id:"align-stretch",twClass:"items-stretch",icon:"align-stretch",title:"Align: stretch",css:"align-items",value:"stretch",when:"flex"}],hh=[{id:"gap-all",icon:"gap-all",title:"Both",css:"gap",tw:"gap",menu:"spacing"},{id:"gap-row",icon:"gap-row",title:"Between rows",css:"row-gap",tw:"row-gap",menu:"spacing",sep:!0},{id:"gap-col",icon:"gap-col",title:"Between columns",css:"column-gap",tw:"column-gap",menu:"spacing"}],mh=["1px","2px","3px","4px","8px"],Ft=(t,e,o,n,s,r)=>({id:t,icon:e,title:o,css:n,menu:"choices",choices:mh,twGroup:[s,`${s}-2`,`${s}-4`,`${s}-8`],...r?{sep:!0}:{}}),vh=[Ft("bw-all","bd-all","All sides","border-width","border"),Ft("bw-block","bd-block","Top and bottom","border-block-width","border-y",!0),Ft("bw-top","bd-top","Top","border-block-start-width","border-t"),Ft("bw-bottom","bd-bottom","Bottom","border-block-end-width","border-b"),Ft("bw-inline","bd-inline","Left and right","border-inline-width","border-x",!0),Ft("bw-left","bd-left","Left","border-inline-start-width","border-l"),Ft("bw-right","bd-right","Right","border-inline-end-width","border-r")],gh=[{id:"bd-all",icon:"bd-all",title:"All sides",css:"border-color",tw:"border-color",menu:"colors"},{id:"bd-block",icon:"bd-block",title:"Top and bottom",css:"border-block-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-top",icon:"bd-top",title:"Top",css:"border-block-start-color",tw:"border-top-color",menu:"colors"},{id:"bd-bottom",icon:"bd-bottom",title:"Bottom",css:"border-block-end-color",tw:"border-bottom-color",menu:"colors"},{id:"bd-inline",icon:"bd-inline",title:"Left and right",css:"border-inline-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-left",icon:"bd-left",title:"Left",css:"border-inline-start-color",tw:"border-left-color",menu:"colors"},{id:"bd-right",icon:"bd-right",title:"Right",css:"border-inline-end-color",tw:"border-right-color",menu:"colors"}],bh=[{id:"rd-all",icon:"rd-all",title:"All corners",css:"border-radius",tw:"border-radius",menu:"values"},{id:"rd-tl",icon:"rd-tl",title:"Top left",css:"border-start-start-radius",tw:"border-top-left-radius",menu:"values",sep:!0},{id:"rd-tr",icon:"rd-tr",title:"Top right",css:"border-start-end-radius",tw:"border-top-right-radius",menu:"values"},{id:"rd-br",icon:"rd-br",title:"Bottom right",css:"border-end-end-radius",tw:"border-bottom-right-radius",menu:"values"},{id:"rd-bl",icon:"rd-bl",title:"Bottom left",css:"border-end-start-radius",tw:"border-bottom-left-radius",menu:"values"}],Os=[{id:"display",title:"Display",css:"display",tw:"display",kids:ph},{id:"absolute",title:"Position",css:"position",tw:"position",value:"absolute"},{id:"color",title:"Text color",css:"color",tw:"color",menu:"colors"},{id:"bg",title:"Background color",css:"background-color",tw:"background-color",menu:"colors"},{id:"padding",title:"Padding",css:"padding",tw:"padding",kids:xa("padding")},{id:"margin",title:"Margin",css:"margin",tw:"margin",kids:xa("margin")},{id:"tw-text",title:"Font size",css:"font-size",tw:"font-size",menu:"values"},{id:"tw-leading",title:"Line height",css:"line-height",tw:"line-height",menu:"values"},{id:"tw-font",title:"Font family",css:"font-family",tw:"font-family",menu:"values"},{id:"tw-align",title:"Text align",css:"text-align",tw:"text-align",menu:"choices",choices:["left","center","right","justify"]},{id:"tw-border",title:"Border",css:"border-width",tw:"border-width",kids:vh},{id:"tw-border-color",title:"Border color",css:"border-color",tw:"border-color",kids:gh},{id:"tw-radius",title:"Radius",css:"border-radius",tw:"border-radius",kids:bh},{id:"tw-gap",title:"Gap",css:"gap",tw:"gap",kids:hh},{id:"tw-w",title:"Width",css:"width",tw:"width",menu:"sizes"},{id:"tw-h",title:"Height",css:"height",tw:"height",menu:"sizes"},{id:"tw-maxw",title:"Max width",css:"max-width",tw:"max-width",menu:"sizes"},{id:"tw-overflow",title:"Overflow",css:"overflow",tw:"overflow",menu:"choices",choices:["visible","hidden","clip","auto","scroll"]}],Zi=["100%","auto","fit-content","min-content","max-content","100vw","100dvh","0"],_e=new Map;for(const t of Os){_e.set(t.id,{tool:t,kid:null});for(const e of t.kids||[])_e.set(e.id,{tool:t,kid:e})}const cn={display:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2.5" width="13" height="11" rx="1.2"/><path d="M5 6.5h6M5 9.5h4"/></svg>',"display-flex":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="3.4" height="9" rx=".4"/><rect x="6.3" y="3.5" width="3.4" height="9" rx=".4"/><rect x="10.6" y="3.5" width="3.4" height="9" rx=".4"/></svg>',"flex-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12"/><path d="M4.2 5.8 2 8l2.2 2.2"/><path d="M11.8 5.8 14 8l-2.2 2.2"/></svg>',"flex-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v12"/><path d="M5.8 4.2 8 2l2.2 2.2"/><path d="M5.8 11.8 8 14l2.2-2.2"/></svg>',"justify-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="5.4" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4.6" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="8.2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-between":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-around":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"align-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="5.4" width="9" height="2.4" rx=".4"/></svg>',"align-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="4.6" width="9" height="2.4" rx=".4"/><rect x="3.5" y="9" width="9" height="2.4" rx=".4"/></svg>',"align-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="8.2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="11.6" width="9" height="2.4" rx=".4"/></svg>',"align-stretch":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx=".5"/><rect x="9" y="2" width="4" height="12" rx=".5"/></svg>',absolute:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>',color:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.4 11.2 7.4 2.4l4 8.8"/><path d="M4.7 8.4h5.4"/><rect x="1.6" y="12.8" width="12.8" height="2.2" rx=".6" fill="currentColor" stroke="none"/></svg>',bg:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 1.9a6.1 6.1 0 1 0 0 12.2c.85 0 1.35-.55 1.35-1.25 0-.38-.18-.66-.4-.88a1.2 1.2 0 0 1 .85-2.05h1.3A3.5 3.5 0 0 0 14.1 6.1C14.1 3.75 11.4 1.9 8 1.9Z"/><circle cx="4.9" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="8" cy="4.8" r=".95" fill="currentColor" stroke="none"/><circle cx="11.1" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="4.7" cy="9.9" r=".95" fill="currentColor" stroke="none"/></svg>',padding:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/></svg>',margin:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/><path d="M2 2.5h12M2 13.5h12M2.5 2v12M13.5 2v12" stroke-dasharray="1.4 1.2"/></svg>',"box-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".4" fill="currentColor" stroke="none"/></svg>',"box-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"gap-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"gap-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="3" y="1.6" width="10" height="4.2" rx=".6"/><rect x="3" y="10.2" width="10" height="4.2" rx=".6"/><path d="M4.5 8h7"/></svg>',"gap-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"bd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4"/></svg>',"bd-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-top":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-bottom":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-left":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-right":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"rd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="3.4"/></svg>',"rd-tl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6H6a3.4 3.4 0 0 0-3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M2.6 9V6A3.4 3.4 0 0 1 6 2.6h3" stroke-width="2.2"/></svg>',"rd-tr":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6h7.4a3.4 3.4 0 0 1 3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M7 2.6h3A3.4 3.4 0 0 1 13.4 6v3" stroke-width="2.2"/></svg>',"rd-br":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6v7.4a3.4 3.4 0 0 1-3.4 3.4H2.6" stroke-width="1" opacity=".35"/><path d="M13.4 7v3a3.4 3.4 0 0 1-3.4 3.4H7" stroke-width="2.2"/></svg>',"rd-bl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6v7.4a3.4 3.4 0 0 0 3.4 3.4h7.4" stroke-width="1" opacity=".35"/><path d="M2.6 7v3A3.4 3.4 0 0 0 6 13.4h3" stroke-width="2.2"/></svg>'},v={html:null,css:null,js:null},Xt={html:null,css:null,js:null},Yt={html:null,css:null,js:null},Lh=Object.freeze(Object.defineProperty({__proto__:null,ARMED_KEY:$l,AUTOSAVE_ICON:zi,AUTOSAVE_KEY:Es,BACK_ICON:Hi,CSS_ADD_ICON:Ni,CSS_GRAYS:Ps,CSS_LENGTHS:Zi,CSS_MENU_ID:x,CSS_MODE_ICON:Gi,CSS_SIZE_KEY:Co,CSS_SPACING:qi,CSS_STATES:To,CSS_STATE_KEY:eo,CSS_TOOLS:Os,CSS_TOOL_ICONS:cn,CSS_TOOL_INDEX:_e,DATA_ICON:Ri,DATA_MENU_ID:gt,DEFAULT_HEIGHT:Oi,DOCK_ID:u,get Decoration(){return ot},get EditorState(){return oe},get EditorView(){return P},HANDLES:rt,HEIGHT_KEY:Cs,HISTORY_ICON:Ki,HTML_DIVS:ln,HTML_HEADINGS:Bs,HTML_TOOLS:io,ID_MODE_ICON:Xi,LOCK_CLOSED_ICON:Di,LOCK_OPEN_ICON:ji,MIN_HEIGHT:Ls,MIN_PANE:Ve,PANES:Tt,PANES_KEY:Ts,get RangeSetBuilder(){return ft},SAVE_ICON:Wi,SAVE_MS:Ii,SCOPE_CLASS:Bi,SCOPE_ICON:Fs,SCOPE_KEY:Ie,STRIP_ICON:Ui,STYLE_ID:Pi,STYLE_MODE_KEY:Ms,get StateEffect(){return qt},get StateField(){return ut},TW_MODE_ICON:Yi,TW_TOOL_ICONS:Vi,UNLOCK_ID:K,VALUES_MODE_KEY:Bo,WIDTHS_KEY:As,addClassButton:Eu,applyCssFolds:Wt,applyCssScope:yt,applyDisplay:Pr,applyFlexDirection:Br,applyHtmlTag:_o,applyRuleDecls:Y,applyStyleMode:Yn,get autocompletion(){return ms},autosaveEnabled:bo,bindAntlersSnippets:vi,bindAutosave:Go,bindBack:rn,bindCssAddClass:Cr,bindCssTools:oi,bindDataVars:mi,bindHistory:Gr,bindHtmlScope:Zo,bindHtmlTidy:ni,bindHtmlTools:si,bindLayoutWatch:Si,bindLock:Ko,bindPaneToggles:Mi,bindResize:Ai,bindSplitters:Ei,bindStrip:Kr,bindStyleMode:ei,bindVisualEditSnippets:gi,clearCssFocus:pu,clearHtmlScopeRange:le,get closeBrackets(){return vs},get closeBracketsKeymap(){return gs},closeCodeDock:os,closeCodeDockPopups:Du,get closeCompletion(){return bs},closeCssMenu:w,closeCssMenuPicked:ee,closeDataMenu:O,get cm(){return T},codeDockStyleMode:Xf,get codeFolding(){return ws},get completionKeymap(){return ys},get css(){return _s},cssEditorText:Vn,cssRuleAtCursor:Me,cssSizeRow:Kn,cssSizeRows:kt,cssStateSuffix:Be,currentFlexDecls:tt,currentFullHtml:bt,currentSectionValues:yo,currentTemplateType:dt,get defaultKeymap(){return fs},dispatchHtmlChanges:mt,editableOf:Yt,editors:v,ensureStyle:xi,ensureTwCss:In,enterValuesRule:Xn,finishHtmlEdit:I,flushBracketSync:hr,flushCssScope:V,flushCssToHtml:mr,flushSave:N,get foldEffect(){return ao},get foldedRanges(){return $s},goBackTemplate:zn,get highlightActiveLine(){return ds},get highlightActiveLineGutter(){return us},get history(){return Fo},get historyKeymap(){return hs},hookDataMenu:as,get hoverTooltip(){return ks},get html(){return xs},htmlEditorText:Wn,htmlElementAtCursor:ce,htmlFocusOk:Ct,get htmlLanguage(){return xe},htmlScopeEnabled:ae,htmlTargetFromCursor:Mt,inAttributeValue:hi,inDynamicAttribute:pi,indentFromPrevious:de,get indentWithTab(){return ps},insertAiSnippet:oo,insertHtmlElement:xo,insertHtmlSnippet:Qt,isChromeTemplateType:Jt,isCodeDockArmed:Fa,isCodeDockLocked:ct,isCodeDockOpen:es,isPanelFrame:yi,get javascript(){return Ss},get keymap(){return so},languageOf:bi,leadingCssIndent:St,lineIndentOf:X,get lineNumbers(){return cs},loadCm:Fi,loadTemplate:Nt,mergedCssFull:Xe,mountEditor:qr,newSizeBlockSpot:Gn,newSizeQuery:to,normalizeFlexValue:D,observeDockLayout:Eo,onEditorInput:Z,openAddClass:$r,openCssChoiceMenu:jr,openCssColorMenu:Dr,openCssSpacingMenu:Hr,openCssValueMenu:en,openDataVarsMenu:ns,openHtmlComponentMenu:wr,openHtmlDivMenu:Sr,openHtmlTagMenu:tn,openNestedTemplate:Rn,openPickerMenu:ss,openRenameClassMenu:vr,paintAlpine:Fe,paintAutosave:G,paintBack:Ht,paintCssHead:et,paintCssIdMark:So,paintCssToolState:B,paintHostWait:Vr,paintHtmlScope:q,paintHtmlToolState:Ae,paintLock:$t,paintPaneButtons:ls,paintStrip:Dt,paintStyleMode:Pe,paintValuesMode:$o,pickHtmlTagAtCursor:yr,pickerButton:Oe,placeCssMenu:H,placeDataMenu:Ot,placeDock:jt,previewBottomPad:Mo,primeTailwindCompile:On,readOnlyOf:Xt,readParts:Ee,refreshCodeDockFromDisk:li,refreshPreview:be,relayoutCodeDock:ci,rememberBracketNames:Ce,rememberCssSelectors:zt,resetTailwindCompile:Pn,sameParts:te,sectionDataRows:Xp,setAll:Yr,setCodeDockArmed:Cl,setHtmlAll:Yo,setPath:Lo,setStatus:j,setValuesMode:Xr,shieldDock:an,showHtmlFull:ko,showHtmlScope:Te,stopObservingDockLayout:_i,storedPanes:rs,syncCodeDock:Up,syncHtmlTree:Ye,syncScopedHtml:At,syncTwTarget:ue,get tags(){return Li},templateDockAllowed:La,tidyHtmlPane:qn,toggleAll:Zr,toggleHtmlPagination:_r,get unfoldEffect(){return ro},writeHandleEditor:re,writeHtmlEditor:ie,writeParts:Et},Symbol.toStringTag,{value:"Module"}));export{He as V,bt as a,Eu as b,T as c,a as d,I as e,Bc as f,dt as g,Pc as h,Sn as i,ce as j,Lh as k,Lf as l,$r as o,Xp as s};
