const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-BqsL3ULf.js","./tw-candidates-CSP7aVNi.js","./help-editor-CkkuqpXP.js","./addon-DLYcQlbA.js","./protocol-BVdEmGBQ.js","./shortcuts-CdrzQFO7.js","./addon-BIr7wDW0.css","./help-styles-DXXvmpyq.js","./lp-cluster-9QOgSmRE.js","./ChoiceDialog-CfBHwFIs.js","./ChoiceDialog-C1GDnWs9.css","./ai-text-icon-B7uCWIwa.js","./lp-cluster-Cjp6agd3.css","./css-scope-BZTnmPYa.js","./loop-inspector-DO__oyAV.js","./component-extract-BD_WpxCM.js","./component-extract-vbftbw3D.css","./codemirror-BvQnBj9Y.js","./html-tag-sync-BpXNELva.js","./index-M2RCOyrL.js","./index-B5fiB6ig.js","./index-sh1K8s4m.js","./index-0IxPFT_m.js","./index-Ci-3qkVd.js","./index-DkhC0r6-.js","./index-B4S9JIPB.js","./index-BwRQ94Ql.js","./index-D9YSa79V.js","./index-DwJNgNWz.js","./utility-paint-DXCEnfCB.js","./utilities-DNDSVzBx.js","./ghost-editor-DFm9dytd.js"])))=>i.map(i=>d[i]);
import{H as qa,d as Va,K as zl}from"./shortcuts-CdrzQFO7.js";import{v as Nl,l as Wl}from"./codemirror-BvQnBj9Y.js";import{o as _,c as S,a as b,t as A,e as ql,F as q,i as dt,w as F,l as Ua,k as To,u as $,af as Gn,f as W,a1 as Vl,q as h,r as It,g as Ka,a4 as to,$ as xe,j as Ga,a0 as Xt,ad as Xa,b as rt,d as G,s as vn,_ as bn,ai as Ul,m as ut,p as Ht,B as ea,C as Kl,V as Ao,ah as Eo,aj as Gl,y as Xl,ag as Yl,D as wt,A as we,aD as Zl,z as Jl}from"./addon-DLYcQlbA.js";import{a1 as Ya,b as it,x as Za,a4 as yn,aD as Xn,a7 as Ql,aC as tc,aE as Ja,aF as ec,aG as nc,g as Mo,m as Le,aH as oc,_ as eo,aI as Qa,aJ as sc,aK as ac,aL as no,aM as tr,aj as rc,aN as ic,aO as lc,aP as er,aQ as nr,aR as Lo,aS as Fo,aT as or,aU as kn,a6 as oo,aV as cc,aW as na,aX as oa,aY as dc,aZ as uc,a_ as so,a$ as fc,b0 as pc,b1 as sr,b2 as ar,ak as E,X as hc,b3 as sa,b4 as mc,b5 as gc,b6 as vc}from"./lp-cluster-9QOgSmRE.js";import{e as aa,m as bc,a as yc,p as xn,g as rr,j as kc,k as xc,l as Fe,s as Rt,n as ir,o as _c,t as Bo,q as lr,r as cr,u as ao,v as Po,w as dr,x as Sc,y as ra,z as ur,f as ie,d as Be,A as wc,B as $c,C as Pe,D as Cc,E as fr,F as Tc,G as pr,H as _n,I as Ac,J as Ec,K as Mc,L as Lc,M as Fc,N as Bc,O as Pc,P as ia,Q as Ue}from"./css-scope-BZTnmPYa.js";import{_ as hr,o as Oo,C as Oc,m as N,N as mr}from"./ChoiceDialog-CfBHwFIs.js";import{M as gr,S as vr}from"./protocol-BVdEmGBQ.js";import{t as Ic}from"./tw-candidates-CSP7aVNi.js";import{q as $e,i as br,g as yr,a2 as kr,a3 as xr,j as Dc,a4 as jc,a5 as Hc,a6 as Rc,a7 as zc,F as la,E as Nc,G as Wc,a8 as qc,a9 as Vc,t as Uc,aa as Kc,ab as _r,ac as Gc,c as ro,Q as Xc,U as Yc,ad as Zc,ae as Jc,af as ca,d as Sr,I as Qc,J as td,K as ed,a as Io,ag as nd,ah as wr,ai as od}from"./component-extract-BD_WpxCM.js";import{h as sd,a as ad,e as rd,i as Sn,A as da,b as id,c as ld,d as tn}from"./html-tag-sync-BpXNELva.js";import{paintUtilities as ua,swapSiteCss as cd,classTokens as dd}from"./utility-paint-DXCEnfCB.js";import{u as ud,a as fd,c as fa,w as pd}from"./utilities-DNDSVzBx.js";const bt="__sve-css-rename-chip",hd='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';function md(t){const e=t.Decoration.mark({class:"sve-cm-css-token"}),n=t.StateEffect.define();return{extensions:[t.StateField.define({create(){return t.Decoration.none},update(s,r){let i;for(const c of r.effects)c.is(n)&&(i=c.value);if(i===void 0)return r.docChanged?t.Decoration.none:s;if(!i)return t.Decoration.none;const l=new t.RangeSetBuilder;return l.add(i.from,i.to,e),l.finish()},provide:s=>t.EditorView.decorations.from(s)})],setHover(s,r){s&&s.dispatch({effects:n.of(r)})}}}function xt(t){t?.getElementById(bt)?.remove()}function gd(t,e,n,o){e.style.left=`${Math.max(6,Math.min(n,t.innerWidth-28))}px`,e.style.top=`${Math.max(6,o)}px`}function vd(t,e,n,{onRename:o,title:s}){const r=t.document,i=e.coordsAtPos(n.to);if(!i)return;xt(r);const l=r.createElement("button");l.id=bt,l.type="button",l.innerHTML=hd,l.title=s,l.setAttribute("aria-label",s),l.addEventListener("mousedown",c=>{c.preventDefault(),c.stopPropagation(),xt(r),o?.(n)}),l.addEventListener("mouseleave",()=>{t.setTimeout(()=>{e.dom.matches(":hover")||l.matches(":hover")||xt(r)},120)}),r.body.appendChild(l),gd(t,l,i.right+2,i.top-1)}function bd(t,e,{onRename:n,isLocked:o,setHover:s,title:r}){if(!e?.dom||e.dom._sveClassTokenBound)return;e.dom._sveClassTokenBound=!0;let i=null,l="";const c=()=>!!o?.(),d=()=>{t.clearTimeout(i),i=null,l="",s?.(e,null),xt(t.document)},p=f=>{if(c()){d();return}d(),n?.(f)};e.dom.addEventListener("mousemove",f=>{if(c()){d();return}if(f.target?.closest?.(`#${bt}`))return;const m=e.posAtCoords({x:f.clientX,y:f.clientY});if(m==null)return;const y=aa(e.state.doc.toString(),m);if(!y){t.clearTimeout(i),i=null,l="",s?.(e,null);return}const v=`${y.from}:${y.to}:${y.name}`;s?.(e,{from:y.from,to:y.to}),!(l===v&&(i||t.document.getElementById(bt)))&&(t.clearTimeout(i),l=v,i=t.setTimeout(()=>{i=null,vd(t,e,y,{onRename:p,title:r||"Rename class"})},160))}),e.dom.addEventListener("mouseleave",f=>{f.relatedTarget?.closest?.(`#${bt}`)||t.setTimeout(()=>{t.document.getElementById(bt)?.matches(":hover")||d()},160)}),e.dom.addEventListener("dblclick",f=>{if(c())return;const m=e.posAtCoords({x:f.clientX,y:f.clientY});if(m==null)return;const y=aa(e.state.doc.toString(),m);y&&(f.preventDefault(),f.stopPropagation(),p(y))},!0),e.scrollDOM?.addEventListener("scroll",d),t.document._sveClassTokenDismiss||(t.document._sveClassTokenDismiss=!0,t.document.addEventListener("mousedown",f=>{f.target.closest(`#${bt}`)||xt(t.document)}))}const a={cssColorsPromise:null,lastUid:null,lastType:null,typeStack:[],beforePart:null,lastParts:{html:"",css:"",js:""},lastProps:[],propsDirty:!1,lastLocked:!1,lockReady:!1,lastWin:null,loadGen:0,saveTimer:null,lastBracketNames:null,lastCssSelectorNames:null,saveInFlight:null,loadInFlight:null,dragging:!1,applying:!1,htmlScopePref:!0,htmlScopeActive:!1,styleMode:"css",cssToolRow:null,cssOpenTool:"",cssOpenMenu:"",cssValues:!1,cssAll:!1,htmlAll:!1,twCss:null,twKey:"",twBusy:!1,twDirty:!1,htmlFocus:null,cssFocus:null,htmlFull:"",cssFull:"",cssPane:"full",cssScopeSnapshot:"",layoutObserver:null,layoutWin:null,observedEditor:null,observedRight:null,layoutWatchBound:!1,cssSize:"",cssState:"",cssOwnFolds:new Set,cssFoldSig:"",htmlPartialUi:null,htmlAntlersUi:null,htmlClassTokenUi:null,htmlLintUi:null,cssGhostUi:null},Zt=new Map,pa={scope:null,section:[],page:[],site:[]};function Do(t){const e=t?.location?.pathname?.match(/\/collections\/([^/]+)\//);return e?e[1]:""}function jo(t){const e=String(t||"").trim();return!e||/^(header|footer)\//.test(e)?"":e}function yd(t){return(Array.isArray(t)?t:[]).filter(e=>e?.handle).map(e=>`${e.kind==="collection"?"collection":"field"}:${e.handle}`).join("|")}function Ho({collection:t,set:e,view:n,scope:o}){return`${t}::${e}::${n||""}::${o||""}`}function $r(t){return Zt.get(t)||null}function Oe(t,{collection:e,set:n,view:o,scope:s}){const r=Ho({collection:e,set:n,view:o,scope:s}),i=Zt.get(r);if(i)return Promise.resolve(i);const l=new URLSearchParams;return e&&l.set("collection",e),n&&l.set("set",n),o&&l.set("view",o),s&&l.set("scope",s),t.fetch(`/!/sve/data-vars?${l.toString()}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(c=>c.ok?c.json():null).then(c=>{const d=c&&typeof c=="object"?c:pa;return Zt.set(r,d),d}).catch(()=>pa)}function kd(t){if(!t){Zt.clear();return}const e=`::${t}::`;for(const n of[...Zt.keys()])n.includes(e)&&Zt.delete(n)}function xd(t){if(t==null||t==="")return"";if(typeof t=="boolean")return t?"true":"false";if(Array.isArray(t))return t.length?`${t.length} ×`:"";if(typeof t=="object"){const n=Object.keys(t).length;return n?`${n} ×`:""}const e=String(t).replace(/\s+/g," ").trim();return e.length>60?`${e.slice(0,60)}…`:e}function _d(t,e){return e.split(".").reduce((n,o)=>n&&typeof n=="object"?n[o]:void 0,t)}function Ro(t,e){return!Array.isArray(t)||!e||typeof e!="object"?t||[]:t.map(n=>{if(n.parent||n.value!=null||n.var.includes(":"))return n;const o=xd(_d(e,n.var));return o?{...n,value:o}:n})}function Sd(t,e){return Array.isArray(t)?t.map(n=>({...n,items:Ro(n.items,e)})):[]}function wd(t,e,{inline:n=!1}={}){const o=String(t?.var||"").trim();if(!o)return null;if(n)return{text:`{{ ${o} }}`,cursor:`{{ ${o} }}`.length};if(t.loop)return{text:`{{ ${o} }}
  
{{ /${o} }}`,cursor:`{{ ${o} }}
  `.length};if(e?.loop&&!t.parent){const s=e.loop;return{text:`{{ ${s} }}
  {{ ${o} }}
{{ /${s} }}`,cursor:`{{ ${s} }}
  {{ ${o} }}`.length}}return{text:`{{ ${o} }}`,cursor:`{{ ${o} }}`.length}}const rg={img:{attr:"src",fieldtype:"assets",alt:!0},video:{attr:"src",fieldtype:"assets"},a:{attr:"href",fieldtype:"link"}};function ig(t){const e=$e(t);if(e!==null)return`{{ ${e}:alt | entities }}`;const n=String(t||"").trim().replace(/'/g,"%27");return n?`{{ asset url='${n}' }}{{ alt | entities }}{{ /asset }}`:""}function Cr(t,e,n){const o=String(t||"").slice(e.from,e.openTo),s=bc(o),r=new RegExp(`(\\s${n}\\s*=\\s*)(["'])`,"i").exec(s);if(!r)return null;const i=r.index+r[1].length+1,l=s.indexOf(r[2],i);return l===-1?null:{start:e.from+r.index,from:e.from+i,to:e.from+l,value:o.slice(i,l)}}const $d={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:" "};function Tr(t){return String(t??"").replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi,(e,n)=>{if(n[0]==="#"){const o=n[1]==="x"||n[1]==="X"?parseInt(n.slice(2),16):parseInt(n.slice(1),10);return Number.isFinite(o)?String.fromCodePoint(o):e}return $d[n.toLowerCase()]??e})}function Ar(t,e,n){const o=e&&!e.kind?Cr(t,e,n):null;return o?Tr(o.value):null}function ha(t,e,n,{inline:o=!0}={}){const s=String(t||"");if(!e||e.kind)return s;const r=s.slice(e.from,e.openTo),i=/\s*\{\{\s*visual_edit\b([\s\S]*?)\}\}/.exec(r),l=(i?.[1]||"").replace(/\s*(field|inline_edit|inline-edit)="[^"]*"/g,"").trim();let c="";if(n)c=` {{ visual_edit field="${n}"${o?' inline_edit="true"':""}${l?` ${l}`:""} }}`;else{if(!i||!/\bfield="/.test(i[1]))return s;l&&(c=` {{ visual_edit ${l} }}`)}if(i)return s.slice(0,e.from+i.index)+c+s.slice(e.from+i.index+i[0].length);const d=/^<[a-zA-Z][a-zA-Z0-9:-]*/.exec(r);return d?s.slice(0,e.from+d[0].length)+c+s.slice(e.from+d[0].length):s}function lg(t,e,n,o){const s=String(t||"");if(!e||e.kind||!/^[a-z][a-z0-9:-]*$/i.test(n))return s;const r=String(o??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;"),i=Cr(s,e,n);if(o===null)return i?s.slice(0,i.start)+s.slice(i.to+1):s;if(i)return s.slice(0,i.from)+r+s.slice(i.to);const l=/^<([a-zA-Z][a-zA-Z0-9:-]*)/.exec(s.slice(e.from,e.openTo));if(!l)return s;const c=e.from+l[0].length;return`${s.slice(0,c)} ${n}="${r}"${s.slice(c)}`}const Cd=new Set(["input","select","textarea","option","optgroup"]),Td=new Set(["li","dt","dd","td","th","summary","legend","caption","figcaption","address"]),Ad=new Set(["h1","h2","h3","h4","h5","h6","a","button","label","summary","legend","caption"]);function cg(t){return Ad.has(String(t||"").toLowerCase())}function Ed(t){const e=String(t||"").toLowerCase();return!e||Cd.has(e)||yc(e)?!1:Ya(e)==="text"||Td.has(e)}function Er(t,e){const n=br(t,e);return n<e.openTo?null:{from:e.openTo,to:n,text:t.slice(e.openTo,n)}}function Mr(t,e){const n=String(t||"");if(!e||e.kind||!Ed(e.tag))return null;const o=Er(n,e);return o?(e.children||[]).some(s=>s.kind||String(s.tag).toLowerCase()!=="br")||/\{\{\s*\//.test(o.text)?{kind:"markup"}:{kind:"text",text:Tr(o.text.trim().replace(/\s+/g," "))}:null}function Md(t){return String(t??"").replace(/\{\{[\s\S]*?\}\}/g,"").includes("{{")}function Ld(t){return String(t??"").split(/(\{\{[\s\S]*?\}\}|<br\b[^<>]*>)/i).map((e,n)=>n%2?e:e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")).join("")}function dg(t,e,n){const o=String(t||"");if(Mr(o,e)?.kind!=="text"||Md(n))return o;const s=Er(o,e),r=c=>s.text.trim()&&c.includes(`
`)?c:"",i=r(/^\s*/.exec(s.text)[0]),l=r(/\s*$/.exec(s.text)[0]);return o.slice(0,s.from)+i+Ld(n)+l+o.slice(s.to)}const Lr=new Set(["div","article","aside"]),Fd=new Set(["p","h1","h2","h3","h4","h5","h6","ul","ol","blockquote","hr"]),Bd=new Set(["li","p","strong","b","em","i","u","s","strike","del","code","a","br","sub","sup","ul","ol"]),Pd=new Set(["href","target","rel"]);function zo(t,e){const n=br(t,e);return n<e.openTo?null:{from:e.openTo,to:n,text:t.slice(e.openTo,n)}}function Od(t,e){const o=t.slice(e.from,e.openTo).replace(/^<[a-zA-Z0-9]+/,"").replace(/\/?>$/,"").trim();return o?e.tag!=="a"?!1:[...o.matchAll(/([^\s=]+)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]+))?/g)].map(r=>r[1].toLowerCase()).every(r=>Pd.has(r)):!0}function Fr(t,e,n){return e.every(o=>!o.kind&&n.has(String(o.tag).toLowerCase())&&Od(t,o)&&Fr(t,o.children||[],Bd))}function Id(t,e,n){let o=e.from,s="";for(const r of n)s+=t.slice(o,r.from),o=r.to;return(s+t.slice(o,e.to)).trim()!==""}function No(t,e){const n=String(t||"");if(!e||e.kind||!Lr.has(String(e.tag).toLowerCase()))return null;const o=e.children||[],s=zo(n,e);return!s||!o.length||/\{\{/.test(s.text)||Id(n,s,o)||!Fr(n,o,Fd)?null:{html:s.text.trim()}}function ug(t,e){const n=String(t||"");return!!e&&!e.kind&&/(^|\s)prose(\s|$)/.test(Ar(n,e,"class")||"")&&(!!No(n,e)||Wo(n,e)!==null)}function Wo(t,e){const n=String(t||"");if(!e||e.kind||!Lr.has(String(e.tag).toLowerCase())||(e.children||[]).length)return null;const o=zo(n,e);return o&&$e(o.text)!==null?o.text.trim():null}function fg(t,e){const n=o=>String(o||"").replace(/>\s+</g,"><").replace(/\s+/g," ").trim();return n(t)===n(e)}function pg(t,e,n){const o=String(t||"");return No(o,e)?Br(o,e,n):o}function hg(t,e,n){const o=String(t||"");if(!No(o,e)&&Wo(o,e)===null)return o;const s=String(n??"").trim(),r=s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");return Br(o,e,$e(s)!==null?s:`<p>${r}</p>`)}function Br(t,e,n){const o=zo(t,e),s=t.lastIndexOf(`
`,e.from-1)+1,r=/^[ \t]*/.exec(t.slice(s,e.from))[0],i=/\n([ \t]+)</.exec(o.text)?.[1]?.slice(r.length)||"    ",l=String(n||"").trim(),c=xn(l).map(p=>l.slice(p.from,p.to)),d=(c.length?c:[l]).filter(Boolean).map(p=>`${r}${i}${p}`);return`${t.slice(0,o.from)}
${d.join(`
`)}
${r}${t.slice(o.to)}`}function Pr(t,e,n=null){for(const o of t||[])if(o.from<=e&&e<=o.to)return o.kind==="antlers"&&o.antlers==="loop"?null:Pr(o.children,e,o.kind?n:o);return n}function Dd(t,e,n){const o=String(t||""),s=Pr(xn(o),e);if(!s)return o;if(e<s.openTo)return["src","href"].some(c=>$e(Ar(o,s,c)??"")===n)?ha(o,s,n,{inline:!1}):o;const r=Mr(o,s),i=r?.kind==="text"?r.text:Wo(o,s);return $e(i??"")===n?ha(o,s,n):o}const Ke="visual_edit",ma=[{id:"base",lang:"code_dock_visual_edit_base"},{id:"field",lang:"code_dock_visual_edit_field"}],Or=[{id:"tag",group:"base",label:"{{ visual_edit }}",standalone:"{{ visual_edit| }}"},{id:"ve_popup",group:"base",label:"popup",attr:'popup="true"'},{id:"ve_orderable",group:"base",label:"orderable",attr:'orderable="true"'},{id:"ve_section_orderable",group:"base",label:"section_orderable",attr:'section_orderable="true"'},{id:"ve_outline_inside",group:"base",label:"outline_inside",attr:'outline_inside="true"'},{id:"ve_field",group:"field",label:"field",attr:'field="|"'},{id:"ve_inline_edit",group:"field",label:"inline_edit",attr:'inline_edit="true"'},{id:"ve_insertable",group:"field",label:"insertable",attr:'insertable="true"'},{id:"ve_toolbar",group:"field",label:"toolbar",attr:'toolbar="true"'},{id:"ve_scope",group:"field",label:"scope",attr:'scope="|"'},{id:"ve_controls",group:"field",label:"controls",attr:'controls="|"'}];function jd(t){return Or.find(e=>e.id===t)||null}function Hd(t,e,n,o){let s=e;for(;s<n;){const r=t.indexOf("{{",s);if(r===-1||r>=n)return null;const i=t.indexOf("}}",r+2);if(i===-1||i+2>n)return null;const l=t.slice(r+2,i);if((l.trim().split(/\s+/)[0]||"")===o)return{openIdx:r,closeIdx:i,inner:l};s=i+2}return null}function Rd(t,e){const n=String(e).split("=")[0].trim();return new RegExp(`(^|\\s)${n}(=|\\s|$)`).test(t)}const zd={class:"sve-code-dock"},Nd={"data-sve-code-bar":""},Wd={type:"button","data-sve-code-pane-btn":"html"},qd={type:"button","data-sve-code-pane-btn":"css"},Vd={type:"button","data-sve-code-pane-btn":"alpine"},Ud={type:"button","data-sve-code-pane-btn":"js"},Kd={type:"button","data-sve-html-scope":"","aria-pressed":"true"},Gd=["innerHTML"],Xd={"data-sve-code-panes":""},Yd={"data-sve-code-pane":"html"},Zd={"data-sve-code-pane-label":""},Jd=["title","aria-label"],Qd=["innerHTML"],tu={"data-sve-code-pane":"css"},eu={"data-sve-css-chrome":"subrow-2"},nu={"data-sve-code-pane-label":""},ou={"data-sve-css-label":""},su={"data-sve-code-pane":"alpine"},au={"data-sve-code-pane-label":""},ru={"data-sve-code-pane":"js"},iu={"data-sve-code-pane-label":""},lu={__name:"CodeDockChrome",props:{htmlLabel:{type:String,required:!0},cssLabel:{type:String,required:!0},jsLabel:{type:String,required:!0},alpineLabel:{type:String,required:!0},treeIcon:{type:String,required:!0},dataIcon:{type:String,required:!0},dataLabel:{type:String,required:!0}},setup(t){return(e,n)=>(_(),S("div",zd,[n[21]||(n[21]=b("div",{"data-sve-code-grip":"","aria-hidden":"true"},null,-1)),b("div",Nd,[b("button",Wd,A(t.htmlLabel),1),b("button",qd,A(t.cssLabel),1),b("button",Vd,A(t.alpineLabel),1),b("button",Ud,A(t.jsLabel),1),n[0]||(n[0]=ql('<button type="button" data-sve-code-back hidden></button><span data-sve-code-path></span><span data-sve-code-status></span><button type="button" data-sve-all></button><button type="button" data-sve-code-strip></button><button type="button" data-sve-code-history></button><button type="button" data-sve-style-mode></button><button type="button" data-sve-values-mode></button><button type="button" data-sve-code-autosave aria-pressed="true"></button><button type="button" data-sve-code-save hidden></button>',10)),b("button",Kd,[b("span",{innerHTML:t.treeIcon},null,8,Gd)]),n[1]||(n[1]=b("button",{type:"button","data-sve-code-lock":"",hidden:""},null,-1))]),n[22]||(n[22]=b("div",{"data-sve-code-lock-banner":""},null,-1)),b("div",Xd,[b("div",Yd,[b("div",Zd,[b("span",null,A(t.htmlLabel),1),n[2]||(n[2]=b("div",{"data-sve-html-tools":""},null,-1)),n[3]||(n[3]=b("button",{type:"button","data-sve-html-tidy":""},null,-1)),b("button",{type:"button","data-sve-data-vars":"",title:t.dataLabel,"aria-label":t.dataLabel},[b("span",{innerHTML:t.dataIcon},null,8,Qd)],8,Jd),n[4]||(n[4]=b("div",{"data-sve-visual-edit-tools":""},null,-1)),n[5]||(n[5]=b("div",{"data-sve-help-tools":""},null,-1)),n[6]||(n[6]=b("div",{"data-sve-antlers-tools":""},null,-1)),n[7]||(n[7]=b("div",{"data-sve-snippet-tools":""},null,-1))]),n[8]||(n[8]=b("div",{"data-sve-html-problems":"",hidden:""},null,-1)),n[9]||(n[9]=b("div",{"data-sve-code-host":""},null,-1))]),n[18]||(n[18]=b("div",{"data-sve-code-split":"","data-sve-code-split-after":"html"},null,-1)),b("div",tu,[b("div",eu,[b("div",nu,[b("span",ou,A(t.cssLabel),1),n[10]||(n[10]=b("button",{type:"button","data-sve-css-add-class":""},null,-1)),n[11]||(n[11]=b("div",{"data-sve-css-tools":""},null,-1)),n[12]||(n[12]=b("div",{"data-sve-css-snippet-tools":""},null,-1))])]),n[13]||(n[13]=b("div",{"data-sve-css-head":""},null,-1)),n[14]||(n[14]=b("div",{"data-sve-code-host":""},null,-1)),n[15]||(n[15]=b("div",{"data-sve-tw-host":""},null,-1))]),n[19]||(n[19]=b("div",{"data-sve-code-split":"","data-sve-code-split-after":"css"},null,-1)),b("div",su,[b("div",au,[b("span",null,A(t.alpineLabel),1)]),n[16]||(n[16]=b("div",{"data-sve-alpine-host":""},null,-1))]),n[20]||(n[20]=b("div",{"data-sve-code-split":"","data-sve-code-split-after":"alpine"},null,-1)),b("div",ru,[b("div",iu,[b("span",null,A(t.jsLabel),1)]),n[17]||(n[17]=b("div",{"data-sve-code-host":""},null,-1))])])]))}};let be=null,ga=0,va=!1;function qo(t){const e=yr(it("dock:current-type")),n=kr(e);Za({source:vr,type:gr.SVE_COMPONENT_FOCUS,on:!!n,name:e?String(e).split("/").pop():"",selector:n||""},t)}function wn(t){const e=it("dock:html"),n=[...new Set((typeof e=="string"?rr(e):[]).map(o=>o.src))];Za({source:vr,type:gr.SVE_COMPONENT_MAP,items:n.map(o=>({src:o,name:String(o).split("/").pop(),selector:kr(o)})).filter(o=>o.selector)},t)}function cu(t){be=t,!va&&(va=!0,yn("dock:html-changed",()=>{be&&(be.clearTimeout(ga),ga=be.setTimeout(()=>wn(be),400))}))}const du=["data-sve-html-tool","data-tip","aria-label","data-letter","onClick","onContextmenu"],uu=["innerHTML"],fu={__name:"CodeDockHtmlTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(t){return(e,n)=>(_(!0),S(q,null,dt(t.tools,o=>(_(),S("button",{key:o.id,type:"button","data-sve-html-tool":o.id,"data-tip":o.title,"aria-label":o.title,"data-letter":o.letter?"":void 0,onClick:F(s=>t.onTool(o.id),["prevent","stop"]),onContextmenu:F(s=>t.onTool(o.id),["prevent"])},[o.letter?(_(),S(q,{key:0},[Ua(A(o.letter),1)],64)):(_(),S("span",{key:1,innerHTML:o.icon},null,8,uu))],40,du))),128))}},$t=To({tools:[],onTool:null,onKid:null}),pu=["data-sve-css-item"],hu=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],mu={key:0,"data-sve-css-kids":""},gu={key:0,"data-sve-css-sep":"","aria-hidden":"true"},vu=["data-sve-css-kid","data-sve-css-box-side","data-tip","aria-label","innerHTML","onClick","onContextmenu"],bu={__name:"CodeDockCssTools",setup(t){return(e,n)=>(_(!0),S(q,null,dt($($t).tools,o=>(_(),S("li",Gn({key:o.id,"data-sve-css-item":o.id},{ref_for:!0},o.open?{"data-sve-css-open":""}:{}),[b("button",Gn({type:"button","data-sve-css-tool":o.id,"data-tip":o.title,"aria-label":o.title},{ref_for:!0},{...o.active?{"data-active":""}:{},...o.open?{"data-open":""}:{}},{innerHTML:o.icon,onClick:F(s=>$($t).onTool?.(o.id),["prevent","stop"]),onContextmenu:F(s=>$($t).onTool?.(o.id),["prevent"])}),null,16,hu),o.open&&o.kids.length?(_(),S("div",mu,[(_(!0),S(q,null,dt(o.kids,s=>(_(),S(q,{key:s.id},[s.sep?(_(),S("span",gu)):W("",!0),b("button",Gn({type:"button","data-sve-css-kid":s.id,"data-sve-css-box-side":s.id,"data-tip":s.title,"aria-label":s.title},{ref_for:!0},s.active?{"data-active":""}:{},{innerHTML:s.icon,onClick:F(r=>$($t).onKid?.(o.id,s.id),["prevent","stop"]),onContextmenu:F(r=>$($t).onKid?.(o.id,s.id),["prevent"])}),null,16,vu)],64))),128))])):W("",!0)],16,pu))),128))}},yu=1.5,ku=16;function Ir(t,e){const n=parseFloat(t);return Number.isFinite(n)?e==="em"||e==="rem"?n*ku:n:null}function xu(t){const e=String(t||"").toLowerCase(),n=/\bmax-width\b|\bwidth\s*<=?\s*[\d.]|[\d.](px|em|rem)\s*>=?\s*width\b/.test(e),o=/\bmin-width\b|\bwidth\s*>=?\s*[\d.]|[\d.](px|em|rem)\s*<=?\s*width\b/.test(e);if(n===o)return null;const s=n?[/\bmax-width\s*:\s*([\d.]+)(px|em|rem)/,/\bwidth\s*<=?\s*([\d.]+)(px|em|rem)/,/([\d.]+)(px|em|rem)\s*>=?\s*width\b/]:[/\bmin-width\s*:\s*([\d.]+)(px|em|rem)/,/\bwidth\s*>=?\s*([\d.]+)(px|em|rem)/,/([\d.]+)(px|em|rem)\s*<=?\s*width\b/];for(const r of s){const i=e.match(r);if(i){const l=Ir(i[1],i[2]);return l===null?null:{px:l,side:n?"max":"min"}}}return null}function Ct(t,e){const n=xu(t);if(!n)return"";for(const o of e||[]){if(o.base)continue;const s=o.direction==="mobile";if((s?"min":"max")!==n.side)continue;const r=s?Number(o.min_px):Ir(String(o.max||"").replace(/[a-z]+$/i,""),(String(o.max||"").match(/[a-z]+$/i)||[""])[0]);if(r!==null&&Number.isFinite(r)&&Math.abs(r-n.px)<=yu)return o.handle}return""}function $n(t){let e="",n=0;for(;n<t.length;){const o=Cn(t,n);if(o!==n){e+=" ".repeat(o-n),n=o;continue}e+=t[n],n+=1}return e}function Cn(t,e){if(t.startsWith("/*",e)){const n=t.indexOf("*/",e+2);return n===-1?t.length:n+2}if(t.startsWith("{{",e)){const n=t.indexOf("}}",e+2);return n===-1?t.length:n+2}if(t[e]==='"'||t[e]==="'"){const n=t[e];for(let o=e+1;o<t.length;o+=1)if(t[o]==="\\")o+=1;else if(t[o]===n)return o+1;return t.length}return e}function Tn(t){const e=String(t||""),n=[],o=(s,r,i=0)=>{let l=s,c=l;for(;l<r;){const d=Cn(e,l);if(d!==l){l=d;continue}if(e[l]===";"){l+=1,c=l;continue}if(e[l]==="}")return;if(e[l]!=="{"){l+=1;continue}const p=$n(e.slice(c,l)),f=p.trim(),m=Dr(e,l,r);if(m===-1)return;/^@media\b/i.test(f)?n.push({query:f.replace(/^@media\s*/i,"").trim(),from:c+p.search(/\S/),to:m+1,bodyFrom:l+1,bodyTo:m,depth:i}):/^@(?:import|charset|use)\b/i.test(f)||o(l+1,m,i+1),l=m+1,c=l}};return o(0,e.length,0),n}function Dr(t,e,n){let o=0;for(let s=e;s<n;s+=1){const r=Cn(t,s);if(r!==s){s=r-1;continue}if(t[s]==="{")o+=1;else if(t[s]==="}"&&(o-=1,o===0))return s}return-1}function le(t){const e=String(t||""),n=(o,s)=>{const r=[];let i=o,l=i;for(;i<s;){const c=Cn(e,i);if(c!==i){i=c;continue}if(e[i]===";"){i+=1,l=i;continue}if(e[i]==="}")return r;if(e[i]!=="{"){i+=1;continue}const d=$n(e.slice(l,i)),p=d.trim(),f=Dr(e,i,s);if(f===-1)return r;r.push({prelude:p,media:/^@media\b/i.test(p),query:p.replace(/^@media\s*/i,"").trim(),from:l+d.search(/\S/),to:f+1,bodyFrom:i+1,bodyTo:f,children:/^@(?:import|charset|use)\b/i.test(p)?[]:n(i+1,f)}),i=f+1,l=i}return r};return n(0,e.length)}function _u(t,e,n){const o=String(t||"");if(!n)return[];const s=(e||[]).find(d=>d.base),r=le(o),i=[],l=d=>d.media?Ct(d.query,e)===n:d.children.some(l);if(s&&n===s.handle){const d=p=>{for(const f of p){if(f.media&&Ct(f.query,e)){i.push({from:f.from,to:f.to});continue}d(f.children)}};return d(r),i}const c=(d,p,f)=>{const m=[];for(const v of d){if(v.media&&Ct(v.query,e)===n){m.push({from:v.from,to:v.to,into:null});continue}l(v)&&m.push({from:v.from,to:v.to,into:v})}if(!m.length){f>p&&i.push({from:p,to:f});return}let y=p;for(const v of m)v.from>y&&i.push({from:y,to:v.from}),v.into&&c(v.into.children,v.into.bodyFrom,v.into.bodyTo),y=v.to;f>y&&i.push({from:y,to:f})};return c(r,0,o.length),i.filter(d=>o.slice(d.from,d.to).trim()!=="")}function Su(t,e){const n=String(t||""),o=[],s=i=>{for(const l of i){if((l.media&&Ct(l.query,e)||/^#id-/.test(l.prelude))&&$n(n.slice(l.bodyFrom,l.bodyTo)).trim()===""){o.push(l);continue}s(l.children)}};if(s(le(n)),!o.length)return n;let r=n;for(const i of o.sort((l,c)=>c.from-l.from)){let l=i.from,c=i.to;const d=r.lastIndexOf(`
`,l-1)+1;for(r.slice(d,l).trim()===""&&(l=d);r[c]===" "||r[c]==="	";)c+=1;r[c]===`
`&&(c+=1),r=r.slice(0,l)+r.slice(c)}return r}function wu(t,e){const n=String(t||""),o=[],s=i=>$n(n.slice(i.bodyFrom,i.bodyTo)).trim()==="",r=i=>{for(const l of i){if((l.media&&Ct(l.query,e)||/^#id-/.test(l.prelude))&&s(l)){o.push({from:l.from,to:l.to});continue}r(l.children)}};return r(le(n)),o}function en(t,e,n){const o=e||[],s=o.find(d=>d.base),r=[],i=d=>/^#id-/.test(d.prelude)||/^#\s*$/.test(d.prelude),l=(d,p)=>{for(const f of d){if(!f.media){l(f.children,p);continue}const m=Ct(f.query,o)||p;if(n===m){r.push(f);continue}l(f.children,m)}},c=(d,p)=>{for(const f of d){if(f.media){c(f.children,Ct(f.query,o)||p);continue}if(i(f)){const m=p||(s?s.handle:"");!n||n===m?r.push(f):l(f.children,m);continue}c(f.children,p)}};return c(le(String(t||"")),""),r.sort((d,p)=>d.from-p.from)}function An(t,e,n){return Tn(t).filter(o=>Ct(o.query,e)===n)}const C=To({tag:"",scope:"",scopeElsewhere:[],scopeElsewhereTitle:"",onScopeImport:null,onTag:null,sizes:[],onSize:null,state:"",stateLabel:"",onState:null,canEdit:!1,note:""}),$u={class:"sve-css-head"},Cu=["disabled"],Tu={key:1,class:"sve-css-scope"},Au=["title","disabled"],Eu=["title","data-active","disabled","onClick"],Mu=["data-active","disabled"],Lu={key:3,class:"sve-css-note"},Fu={__name:"CodeDockCssHead",setup(t){return(e,n)=>(_(),S("div",$u,[$(C).tag?(_(),S("button",{key:0,type:"button",class:"sve-css-tag",disabled:!$(C).canEdit,onClick:n[0]||(n[0]=F(()=>{},["prevent","stop"])),onDblclick:n[1]||(n[1]=F(o=>$(C).onTag?.(o),["prevent","stop"]))},"<"+A($(C).tag)+">",41,Cu)):W("",!0),$(C).scope?(_(),S("span",Tu,A($(C).scope),1)):W("",!0),$(C).scope&&$(C).scopeElsewhere.length?(_(),S("button",{key:2,type:"button",class:"sve-css-scope-taken",title:$(C).scopeElsewhereTitle,disabled:!$(C).canEdit,onClick:n[2]||(n[2]=F(o=>$(C).onScopeImport?.(),["prevent","stop"]))},A($(C).scopeElsewhere.join(", ")),9,Au)):W("",!0),(_(!0),S(q,null,dt($(C).sizes,o=>(_(),S("button",{key:o.key,type:"button","data-sve-css-size":"",title:o.title,"data-active":o.active?"":void 0,disabled:!$(C).canEdit,onClick:F(s=>$(C).onSize?.(o.key),["prevent","stop"])},A(o.label),9,Eu))),128)),b("button",{type:"button","data-sve-css-state":"","data-active":$(C).state?"":void 0,disabled:!$(C).canEdit,onClick:n[3]||(n[3]=F(o=>$(C).onState?.(o),["prevent","stop"]))},[Ua(A($(C).stateLabel)+" ",1),n[4]||(n[4]=b("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[b("path",{d:"m6 9 6 6 6-6"})],-1))],8,Mu),n[5]||(n[5]=b("span",{class:"sve-css-gap"},null,-1)),$(C).note?(_(),S("span",Lu,A($(C).note),1)):W("",!0)]))}},Bu=hr(Fu,[["__scopeId","data-v-22565303"]]),Pu={key:0,"data-sve-css-swatches":""},Ou=["data-sve-css-token","title","data-active","onClick"],Iu={key:0,"data-sve-css-head-row":""},Du={key:1,"data-sve-css-note-row":""},ju=["data-sve-css-token","data-active","onClick"],Hu={"data-sve-css-choice-label":""},Ru={key:0,"data-sve-css-choice-hint":""},st={__name:"CodeDockMenu",props:{kind:{type:String,required:!0},swatches:{type:Array,default:()=>[]},choices:{type:Array,default:()=>[]},onClear:{type:Function,default:null},onPick:{type:Function,required:!0}},setup(t){return(e,n)=>t.kind==="colors"?(_(),S("div",Pu,[b("button",{type:"button","data-sve-css-clear":"",title:"Clear",onClick:n[0]||(n[0]=F((...o)=>t.onClear&&t.onClear(...o),["prevent","stop"]))},[...n[1]||(n[1]=[b("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none",stroke:"currentColor","stroke-width":"1.5"},[b("path",{d:"M2 2l6 6M8 2L2 8"})],-1)])]),(_(!0),S(q,null,dt(t.swatches,o=>(_(),S("button",{key:o.name,type:"button","data-sve-css-swatch":"","data-sve-css-token":o.name,title:o.name,"data-active":o.active?"":void 0,style:Vl({background:o.hex||"transparent"}),onClick:F(s=>t.onPick(o.name),["prevent","stop"])},null,12,Ou))),128))])):(_(!0),S(q,{key:1},dt(t.choices,o=>(_(),S(q,{key:o.value},[o.heading?(_(),S("span",Iu,A(o.label),1)):o.note?(_(),S("span",Du,A(o.label),1)):(_(),S("button",{key:2,type:"button","data-sve-css-choice":"","data-sve-css-token":o.token||void 0,"data-active":o.active?"":void 0,onClick:F(s=>t.onPick(o.value),["prevent","stop"])},[b("span",Hu,A(o.label),1),o.hint?(_(),S("span",Ru,A(o.hint),1)):W("",!0)],8,ju))],64))),128))}},zu=2e4;let Dt=[],jr=0,ke=null,Yn=null;function Hr(){return Yn||(Yn=Gt.define()),Yn}function Rr(){return!!ke&&Date.now()-jr<zu}function Vo(t){return Rr()||(jr=Date.now(),ke=t.fetch("/!/sve/site-css/defined",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{defined:[]}).then(e=>(Dt=Array.isArray(e?.defined)?e.defined:[],g.html?.dispatch({effects:Hr().of(null)}),Dt)).catch(()=>(ke=null,Dt))),ke}function En(t){return t.document.getElementById(u)?.querySelector("[data-sve-code-path]")?.textContent.trim()||""}function Nu(t,e){const n=En(t),o=new Map;for(const s of Dt){const r=o.get(s.name)||new Set;r.add(s.file===n?e:String(s.file).replace(/^.*\//,"")),o.set(s.name,r)}return[...o].map(([s,r])=>({name:s,detail:[...r].join(", ")})).sort((s,r)=>s.name.localeCompare(r.name))}function Uo(t,e){const n=En(t);return e?Dt.filter(o=>o.name===e&&o.file!==n):[]}const zr=t=>[...new Set(t.map(e=>String(e.file).replace(/^.*\//,"")))];function Ko(t,e){const n=Uo(t,e).map(r=>r.css).filter(Boolean).join(`
`);if(!n)return!1;const o=it("dock:css");if(typeof o!="string")return!1;const s=kc(o,e,n);return s!==o&&it("dock:set-css",s)!==!1}function Wu(t,e){const n=t.doc.lineAt(e),o=e-n.from,s=/\bclass\s*=\s*(["'])/gi;let r;for(;r=s.exec(n.text);){const i=r[1],l=r.index+r[0].length,c=n.text.indexOf(i,l),d=c===-1?n.text.length:c;if(o<l||o>d)continue;const p=n.text.slice(l,d),f=xc(p),m=o-l;if(!f||m<f.innerFrom||m>f.innerTo)return null;const y=(p.slice(f.innerFrom,m).match(/[\w-]*$/)||[""])[0];return{from:e-y.length,typed:y}}return null}function qu(t){return e=>{const n=Wu(e.state,e.pos);return!n||!n.typed&&!e.explicit?null:Vo(t).then(o=>{const s=En(t),r=n.typed.toLowerCase(),i=new Map;for(const c of o){if(c.file===s||!String(c.name).toLowerCase().startsWith(r))continue;const d=i.get(c.name)||{files:[],css:[]};d.files.push(c),c.css&&d.css.push(c.css),i.set(c.name,d)}if(!i.size)return null;const l=[...i].slice(0,40).map(([c,d])=>({label:c,type:"class",detail:zr(d.files).join(", "),info:d.css.length?()=>{const p=t.document.createElement("pre");return p.textContent=d.css.join(`
`),p.style.cssText="margin:0;padding:.3em .5em;font:11px ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap",p}:void 0,apply:(p,f,m,y)=>{p.dispatch({changes:{from:m,to:y,insert:c},selection:{anchor:m+c.length}}),t.setTimeout(()=>Ko(t,c),0)}}));return{from:n.from,options:l,validFor:/^[\w-]*$/}})}}function Vu(t){const e=n=>{if(!Dt.length)return ot.none;const o=En(t),s=new vt;for(const r of Fe(n)){const i=Dt.filter(l=>l.name===r.name&&l.file!==o);i.length&&s.add(r.from,r.to,ot.mark({class:"sve-cm-class-taken",attributes:{title:h(t,"class_defined_in",{file:zr(i).join(", ")})}}))}return s.finish()};return gt.define({create:n=>e(n.doc.toString()),update:(n,o)=>o.docChanged||o.effects.some(s=>s.is(Hr()))?e(o.state.doc.toString()):n,provide:n=>D.decorations.from(n)})}const Uu=/^\.[a-zA-Z_][\w-]*$/;function Ku(t,e,n){return String(e||"").includes(n)?nn(t).length===1:!1}function nn(t){return le(t).filter(e=>/^@scope\b/i.test(e.prelude))}function Gu(t){const e=String(t||"");return le(e).filter(n=>Uu.test(n.prelude)?!e.slice(n.from,n.bodyFrom-1).includes("{{"):!1).map(n=>({from:n.from,to:n.to,name:n.prelude.slice(1)}))}function Xu(t,e,n){const o=String(t||"");if(!Ku(o,e,n))return o;const s=Gu(o);if(!s.length)return o;const r=nn(o)[0],i=Ju(o,r),l=s.map(m=>Qu(o.slice(m.from,m.to),o,m.from,i)).join(`

`);let c=o;for(const m of[...s].sort((y,v)=>v.from-y.from))c=Zu(c,m.from,m.to);const d=Yu(c,n);if(d===-1)return o;const p=(c.slice(0,d).match(/\n([^\S\n]*)$/)||[null,null])[1],f=p===null?d:d-p.length;return`${c.slice(0,f)}
${l}
${p??""}${c.slice(d)}`}function Yu(t,e){const n=nn(t).find(o=>o.prelude.includes(e));return n?n.bodyTo:nn(t)[0]?.bodyTo??-1}function Zu(t,e,n){let o=e,s=n;const r=t.lastIndexOf(`
`,o-1)+1;for(t.slice(r,o).trim()===""&&(o=r);t[s]===" "||t[s]==="	";)s+=1;return t[s]===`
`&&(s+=1),t.slice(0,o)+t.slice(s)}function Ju(t,e){const n=t.slice(e.bodyFrom,e.bodyTo).match(/\n([^\S\n]+)\S/);return n?n[1]:`${(t.slice(0,e.from).match(/\n([^\S\n]*)$/)||[null,""])[1]}    `}function Qu(t,e,n,o){const s=(e.slice(0,n).match(/\n([^\S\n]*)$/)||[null,""])[1];return t.split(`
`).map((r,i)=>i===0?o+r.trim():r.startsWith(s)?o+r.slice(s.length):o+r.trimStart()).join(`
`)}const tf={"data-sve-css-add-label":""},ef=["placeholder","onKeydown"],nf={key:0,"data-sve-css-add-hint":""},of={"data-sve-css-add-existing":""},sf={"data-sve-css-add-list":""},af=["onClick"],rf={"data-sve-css-add-name":""},lf={"data-sve-css-add-detail":""},cf={key:0,"data-sve-css-add-none":""},df=["disabled"],Mn={__name:"CodeDockAddClass",props:{label:{type:String,required:!0},placeholder:{type:String,default:""},initial:{type:String,default:""},onAdd:{type:Function,required:!0},options:{type:Array,default:()=>[]},onPick:{type:Function,default:null},takenText:{type:Function,default:null},existingLabel:{type:String,default:""},createLabel:{type:String,default:""},onClose:{type:Function,default:null}},setup(t){const e=t,n=It(e.initial||""),o=It(null);Ka(()=>to(()=>{o.value?.focus(),o.value?.select()}));const s=xe(()=>n.value.trim().toLowerCase()),r=xe(()=>{if(!e.options.length)return[];const c=s.value,d=[],p=[];for(const f of e.options){const m=f.name.toLowerCase();!c||m.startsWith(c)?d.push(f):m.includes(c)&&p.push(f)}return[...d,...p].slice(0,8)}),i=xe(()=>e.takenText&&s.value?e.takenText(n.value.trim()):"");function l(){const c=n.value.trim();if(!c){o.value?.focus();return}if(i.value&&e.onPick){e.onPick(c);return}e.onAdd(c)}return(c,d)=>(_(),S(q,null,[b("label",tf,A(t.label),1),Ga(b("input",{ref_key:"input",ref:o,"data-sve-css-add-input":"","onUpdate:modelValue":d[0]||(d[0]=p=>n.value=p),type:"text",placeholder:t.placeholder,onKeydown:[Xt(F(l,["prevent"]),["enter"]),d[1]||(d[1]=Xt(F(p=>t.onClose?.(),["stop","prevent"]),["escape"]))]},null,40,ef),[[Xa,n.value]]),i.value?(_(),S("div",nf,A(i.value),1)):W("",!0),t.options.length?(_(),S(q,{key:1},[b("div",of,A(t.existingLabel),1),b("div",sf,[(_(!0),S(q,null,dt(r.value,p=>(_(),S("button",{key:p.name,type:"button","data-sve-css-add-option":"",onMousedown:d[2]||(d[2]=F(()=>{},["prevent"])),onClick:F(f=>t.onPick?.(p.name),["prevent","stop"])},[b("span",rf,A(p.name),1),b("span",lf,A(p.detail),1)],40,af))),128)),r.value.length?W("",!0):(_(),S("div",cf,"—"))]),b("button",{type:"button","data-sve-css-add-create":"",disabled:!!i.value||!s.value,onMousedown:d[3]||(d[3]=F(()=>{},["prevent"])),onClick:F(l,["prevent","stop"])},A(t.createLabel),41,df)],64)):W("",!0)],64))}};function io(t,e){e._sveLockBound||(e._sveLockBound=!0,e.querySelector("[data-sve-code-lock]")?.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),!(!a.lockReady||!a.lastType)){if(a.lastLocked){ff(t);return}Nr(t,!0)}}))}function Ln(t){return t?rt(t,Ks)!=="0":!0}function uf(){const t=g.html;return!t||t.state.readOnly||!a.lastType?!1:!se(He(),a.lastParts)}function Z(t){const e=t?.document.getElementById(u),n=e?.querySelector("[data-sve-code-autosave]"),o=e?.querySelector("[data-sve-code-save]");if(!n||!o)return;const s=Ln(t),r=uf();n.setAttribute("aria-pressed",s?"true":"false"),n.title=h(t,s?"code_dock_autosave_on":"code_dock_autosave_off"),n.setAttribute("aria-label",n.title),n.innerHTML=Ml,o.hidden=s,o.title=h(t,"code_dock_save"),o.setAttribute("aria-label",o.title),o.innerHTML=Ll,r?o.setAttribute("data-dirty",""):o.removeAttribute("data-dirty")}function lo(t,e){e._sveAutosaveBound||(e._sveAutosaveBound=!0,e.querySelector("[data-sve-code-autosave]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation();const o=!Ln(t);G(t,Ks,o?"1":"0"),o?V(t.document):a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null),Z(t)}),e.querySelector("[data-sve-code-save]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),V(t.document)}))}function ff(t){t.document.getElementById(Y)?.remove();const e=Oo(t.document,Oc,{title:h(t,"code_dock_unlock_title"),body:h(t,"code_dock_unlock_body"),buttons:[{value:"cancel",label:h(t,"cancel"),variant:"ghost"},{value:"ok",label:h(t,"code_dock_unlock_confirm"),variant:"primary"}],onPick:n=>{e.dismiss(),n==="ok"&&Nr(t,!1)}});e.host.id=Y}function Nr(t,e){const n=a.lastType;if(!n)return;const o=()=>{a.lastType===n&&t.fetch("/!/sve/section-template/lock",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":vn(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:n,locked:e})}).then(async s=>{if(!s.ok)throw new Error(String(s.status));a.lastType===n&&(a.lastLocked=e,Tt(t),Ft(a.lastParts,e),K(t),R(t.document,e?h(t,"code_dock_locked"):""))}).catch(()=>{R(t.document,h(t,"code_dock_error"))})};if(e&&(V(t.document),a.saveInFlight)){a.saveInFlight.finally(o);return}o()}function ne(t,e){const n=String(e||"");if(/^(header|footer)\//.test(n))return!0;const o=t?.Statamic?.$config?.get?.("sveChromeTemplates")||{};return Object.values(o).some(s=>s&&s.type===n)}function pf(t,e){const n=new Set;return Ul(t,t.document).filter(o=>o.type!==e||o.ids.some(s=>n.has(s))?!1:(o.ids.forEach(s=>n.add(s)),!0)).length}function Ce(t){const e=a.lastType;if(!a.lastUid||!e||String(e).startsWith("view:")||ne(t,e)){Xn(t);return}if(pf(t,e)>1){Xn(t);return}const n=Ql(a.lastUid,t.document);Xn(t,n.length?{sectionUids:n}:void 0)}function hf(t,e,n){return a.saveInFlight=t.fetch("/!/sve/section-template",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":vn(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:e,html:n.html,css:n.css,js:n.js,...typeof n.tw=="string"?{tw:n.tw}:{},...Dc(t)?{props:a.lastProps}:{}})}).then(async o=>{if(o.status===423){a.lastLocked=!0,a.lockReady=!0,Tt(t),Ft(a.lastParts,!0),K(t),R(t.document,h(t,"code_dock_locked"));return}const s=await o.json().catch(()=>({}));if(!o.ok)throw new Error(s?.error==="not_writable"?"not_writable":String(o.status));if(a.lastType===e){if(a.lastParts=n,s?.tw_written===!1){a.twDirty=!0,R(t.document,h(t,"code_dock_tw_not_writable")),Z(t),Ce(t);return}R(t.document,h(t,"code_dock_saved")),Z(t),t.setTimeout(()=>{const r=t.document.getElementById(u)?.querySelector("[data-sve-code-status]");r&&r.textContent===h(t,"code_dock_saved")&&(r.textContent="")},1800)}Ce(t),t.document.getElementById("__sve-section-picker")?.dispatchEvent(new t.CustomEvent("sve-library-stale"))}).catch(o=>{R(t.document,h(t,o?.message==="not_writable"?"code_dock_not_writable":"code_dock_error"))}).finally(()=>{a.saveInFlight=null}),a.saveInFlight}function V(t){a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null);const e=a.lastType,n=a.lastWin,o=g.html;if(!o||o.state.readOnly||!e||!n||!a.lockReady)return;const s=He(),r=a.twCss!==null&&xr(n)&&Go(s.html)===a.twKey;se(s,a.lastParts)&&!(r&&a.twDirty)&&!a.propsDirty||(a.propsDirty=!1,r&&(s.tw=a.twCss,a.twDirty=!1),R(t,h(n,"code_dock_saving")),hf(n,e,s))}function Go(t){return Ic(t).sort().join(" ")}function Xo(){a.twCss=null,a.twKey="",a.twDirty=!1}function Yo(t,e){a.twCss=e,a.twKey=Go(t),a.twDirty=!1}function Zo(t,e){if(!t||!xr(t))return;const n=Go(e);n===a.twKey||a.twBusy||(a.twBusy=!0,bn(()=>import("./tw-compile-BqsL3ULf.js"),__vite__mapDeps([0,1]),import.meta.url).then(o=>o.compileTailwind(t,e)).then(o=>{a.twBusy=!1,a.twCss=o,a.twKey=n,a.twDirty=!0,Wr(t,t.document)}).catch(o=>{a.twBusy=!1,console.error("[sve] tailwind compile",o)}))}function Wr(t,e){a.saveTimer&&clearTimeout(a.saveTimer),a.saveTimer=t.setTimeout(()=>{a.saveTimer=null,V(e)},$l)}function X(t){if(a.applying)return;const e=He();if(se(e,a.lastParts)){Z(t);return}if(Z(t),Zo(t,e.html),!Ln(t)){R(t.document,h(t,"code_dock_unsaved"));return}R(t.document,h(t,"code_dock_saving")),Wr(t,t.document)}function Jo(t,e){let n=0;const o=Math.min(t.length,e.length);for(;n<o&&t[n]===e[n];)n+=1;let s=t.length,r=e.length;for(;s>n&&r>n&&t[s-1]===e[r-1];)s-=1,r-=1;return[n,s,e.slice(n,r)]}const mf='<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M2.5 3.5h11M2.5 8h11M2.5 12.5h7"/></svg>';function Qo(){const t=!!a.htmlScopePref;return{html:t,css:t&&a.styleMode!=="tw"&&!a.lastLocked}}function qr(){return a.htmlAll||Qo().css&&a.cssAll}function qt(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-all]");if(!e)return;const n=Qo(),o=qr(),s=t.document.createElement("span");s.textContent=h(t,"code_dock_all"),e.innerHTML=mf,e.appendChild(s),e.title=h(t,o?"code_dock_all_off":n.css?"code_dock_all_on":n.html?"code_dock_all_on_html":"code_dock_all_none"),e.setAttribute("aria-label",e.title),e.setAttribute("aria-pressed",o?"true":"false")}const co={};function gf(t){return co[t]=new T.state.Compartment,co[t].of(Un())}function ts(t){const e=g[t],n=co[t];!e||!n||(e.dispatch({effects:n.reconfigure([])}),e.dispatch({effects:n.reconfigure(Un())}))}function Fn(t){const e=a.lastUid,n=typeof ut=="function"?ut(t.document):[];for(const o of n){const s=Ht(o.values)||o.values;if(!(!s||typeof s!="object")&&e&&typeof ea=="function"){const r=ea(s,e);if(r){const i=r.split("."),l=Kl(s,i.slice(0,2).join("."));if(l&&typeof l=="object")return l}}}for(const o of n){const s=Ht(o.values)||o.values;if(s&&typeof s=="object")return s}return null}function es(t,e){!e||e===a.lastType||(V(t.document),Kt(t,e,"push"))}function ns(t){const e=a.typeStack.pop();if(!e){Wt(t);return}V(t.document),Kt(t,e,"keep")}function Tt(t){const e=t.document.getElementById(u),n=e?.querySelector("[data-sve-code-lock]"),o=e?.querySelector("[data-sve-code-lock-banner]");if(!e||!n)return;const s=a.lastLocked;e.toggleAttribute("data-sve-code-locked",s),qt(t),s&&(ur(t.document),xt(t.document),a.htmlPartialUi&&(a.htmlPartialUi.setHover(g.html,null),a.htmlPartialUi.setHover(g.css,null)),a.htmlClassTokenUi?.setHover(g.html,null)),n.hidden=!a.lockReady,n.setAttribute("aria-pressed",a.lastLocked?"true":"false"),n.title=h(t,a.lastLocked?"code_dock_unlock":"code_dock_lock"),n.setAttribute("aria-label",n.title),n.innerHTML=a.lastLocked?Cl:Tl,o&&(o.textContent=h(t,"code_dock_locked_banner"))}function ce(t){return t?rt(t,Ve)!=="0":a.htmlScopePref}function At(t,e,n){return t!=null&&e!=null&&t>=0&&e>t&&e<=n}function lt(){const t=globalThis.document?.getElementById(u);t&&(t.__sveHtmlScope=a.htmlScopeActive&&a.htmlFocus?{full:a.htmlFull,from:a.htmlFocus.from,to:a.htmlFocus.to,get css(){return on()}}:{get css(){return on()}})}function Mt(){const t=g.html?.state.doc.toString()??"";if(!a.htmlScopeActive||!a.htmlFocus){a.htmlFull=t,lt();return}if(a.htmlFocus.from<0||a.htmlFocus.from>a.htmlFull.length||a.htmlFocus.to<a.htmlFocus.from){a.htmlScopeActive=!1,a.htmlFull=t,a.htmlFocus=null,lt();return}a.htmlFull=a.htmlFull.slice(0,a.htmlFocus.from)+t+a.htmlFull.slice(a.htmlFocus.to),a.htmlFocus={from:a.htmlFocus.from,to:a.htmlFocus.from+t.length},lt()}function St(){return Mt(),a.htmlScopeActive?a.htmlFull:g.html?.state.doc.toString()??a.lastParts.html??""}function de(){a.lastBracketNames=Fe(St()).map(t=>t.name)}function Lt(){a.lastCssSelectorNames=dr(g.css?.state.doc.toString()??a.cssFull)}function Vr(t,e){return Array.isArray(t)&&Array.isArray(e)&&t.length===e.length&&t.every((n,o)=>n===e[o])}function os(t,e){a.cssFull=wc(a.cssFull,t,e),a.cssFull=$c(a.cssFull,e,t)}function Ur(t){if(a.applying||a.lastLocked||a.lastBracketNames==null)return;const e=Fe(St()).map(n=>n.name);Vr(a.lastBracketNames,e)||(os(a.lastBracketNames,e),a.lastBracketNames=e,pt(),Lt())}function Kr(){if(a.applying||a.lastLocked||a.lastCssSelectorNames==null||a.lastBracketNames==null||a.cssPane==="empty")return;const t=g.html,e=g.css?.state.doc.toString()??"";if(!Po(e))return;const n=dr(e);if(!t||Vr(a.lastCssSelectorNames,n))return;const o=new Set(a.lastBracketNames),{renamed:s,added:r,removed:i}=Sc(a.lastCssSelectorNames,n);let l=t.state.doc.toString();const c=l;for(const d of s){const p=Rt(d.to);!o.has(d.from)||!p||(l=ra(l,f=>f===d.from?p:f))}for(const d of i)!o.has(d)||n.includes(d)||(l=ra(l,p=>p===d?"":p));if(l=vf(l,r,o,e),l!==c){a.applying=!0;try{Vt(l)}finally{a.applying=!1}}de(),a.lastCssSelectorNames=n}function vf(t,e,n,o){if(!e.length||a.cssPane!=="tree")return t;const s=Gr(t);if(!s)return t;const r=new Set(Fe(s.full).map(d=>d.name)),{from:i}=s;let{to:l}=s,c=t;for(const d of e){const p=Rt(d);!p||n.has(p)||r.has(p)||!Cc(o,p)||({html:c,to:l}=ir(c,i,l,p),r.add(p))}return c}function Gr(t){Mt();const e=a.cssFocus?.path,n=a.htmlScopeActive&&!!a.htmlFocus;if(!e&&!n)return null;const o=n?a.htmlFocus.from:0,s=n?a.htmlFull.slice(0,o)+t+a.htmlFull.slice(a.htmlFocus.to):t,r=ie(Be(s),new Set),i=e?r.find(l=>l.path===e):r.find(l=>l.from===o);return!i||i.from<o||i.openTo-o>t.length?null:{full:s,from:i.from-o,to:i.openTo-o}}function Xr(t){const e=Rt(t),n=g.html;if(!e||!n||n.state.readOnly||a.lastLocked)return!1;const o=n.state.doc.toString(),s=Gr(o);if(!s)return!1;const{html:r}=ir(o,s.from,s.to,e);if(r===o&&!_c(o.slice(s.from,s.to)).includes(e))return!1;r!==o&&Vt(r);const i=a.lastBracketNames==null?[]:a.lastBracketNames.slice();return de(),os(i,a.lastBracketNames),pt(),Lt(),!0}function Ie(){const t=g.css?.state.doc.toString()??"";return Bo(yf())[0]?.className||ao(t)}function bf(t,e){const n=Rt(e),o=g.html;if(!n||!o||o.state.readOnly||n===t.name)return;a.applying=!0;try{o.dispatch({changes:{from:t.from,to:t.to,insert:n}})}finally{a.applying=!1}const s=a.lastBracketNames==null?[]:a.lastBracketNames.slice();de(),os(s,a.lastBracketNames),pt(),Lt(),a.lastWin&&(X(a.lastWin),P(a.lastWin))}function Yr(t,e){const n=t.document,s=g.html?.coordsAtPos(e.from);w(n),xt(n);const r=n.createElement("div"),i={getBoundingClientRect:()=>({left:s?.left??12,right:s?.right??12,top:s?.top??12,bottom:s?.bottom??12,width:0,height:0})};r.id=x,n.body.appendChild(r),z(t,i,r),r._sveApp=N(Mn,r,{label:h(t,"code_dock_css_rename_class"),placeholder:h(t,"code_dock_css_class_placeholder"),initial:e.name,onAdd:l=>{bf(e,l),w(n)}})}function ss(){return a.htmlScopePref&&!a.htmlAll&&At(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)?(a.htmlScopeActive=!0,lt(),a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to)):(a.htmlScopeActive=!1,lt(),a.htmlFull)}function ue(t,e,n){const o=g[t];if(!o)return;const s=o.state.doc.toString();a.applying=!0;try{if(s!==e){const[r,i,l]=Jo(s,e);o.dispatch({changes:{from:r,to:i,insert:l},...n?{selection:n,scrollIntoView:!0}:{}})}else n&&o.dispatch({selection:n,scrollIntoView:!0})}finally{a.applying=!1}}function Vt(t,e){ue("html",t,e)}function Zr(){if(a.htmlScopeActive)return g.html?.state.doc.toString()??"";if(a.htmlAll){const t=g.html?.state.doc.toString()??"";return At(a.htmlFocus?.from,a.htmlFocus?.to,t.length)?t.slice(a.htmlFocus.from,a.htmlFocus.to):""}return At(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)?a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to):""}function Jr(){const t=a.cssFocus?.path;if(!t)return null;const e=St(),n=ie(Be(e),new Set).find(o=>o.path===t);return n?e.slice(n.from,n.to):(a.cssFocus=null,null)}function yf(){return Jr()??Zr()}function kf(){a.cssFocus=null}function Qr(t){if(!t||a.applying||a.cssValues)return;const e=g.html;if(!e)return;Mt(),U();const n=a.htmlScopeActive&&!!a.htmlFocus,s=(n?a.htmlFocus.from:0)+e.state.selection.main.from;let r=null;for(const l of ie(Be(a.htmlFull),new Set))l.from<=s&&s<l.to&&(r=l);!r||s<r.from||s>=r.openTo||(a.cssFocus?a.cssFocus.path===r.path:n&&a.htmlFocus.from===r.from&&a.htmlFocus.to===r.to)||(a.cssFocus={path:r.path},pt())}function xf(){const t=g.html?.state.doc.toString(),e=a.htmlFocus;return t!=null&&a.htmlScopeActive&&e&&e.from>=0&&e.from<=a.htmlFull.length&&e.to>=e.from?a.htmlFull.slice(0,e.from)+t+a.htmlFull.slice(e.to):t??a.lastParts.html??""}function on(){const t=g.css?.state.doc.toString();return t==null?a.cssFull:a.cssPane==="tree"?t===a.cssScopeSnapshot?a.cssFull:cr(a.cssFull,t,Ie(),{previous:a.cssScopeSnapshot,keep:Fe(xf()).map(e=>e.name)}):a.cssPane==="full"?t:a.cssFull}function U(){const t=g.css?.state.doc.toString()??"";if(a.cssPane==="tree"){if(t===a.cssScopeSnapshot||!Po(t))return;a.cssFull=on(),a.cssScopeSnapshot=t}else a.cssPane==="full"&&(a.cssFull=t)}function _f(t,e){return(e||[]).some(n=>!Pe(t,n.className))}function pt(){let t=a.cssFull,e=[],n=!1;const o=Jr(),s=o==null&&!a.htmlScopeActive&&!(a.htmlAll&&a.htmlFocus);a.cssValues||a.cssAll||!a.htmlScopePref?(a.cssPane="full",t=a.cssFull):(e=Bo(o??(s?St():Zr())),e.length?(a.cssPane="tree",t=lr(a.cssFull,e),!a.cssFocus&&!s&&_f(a.cssFull,e)&&(a.cssFull=cr(a.cssFull,t,e[0].className),n=!0)):(a.cssPane="empty",t="")),a.cssScopeSnapshot=t,ue("css",t),Lt(),a.lastWin&&(Ut(a.lastWin,!0),P(a.lastWin),n&&X(a.lastWin))}function De(t){const e=g.html;if(!e||!a.htmlFocus)return;a.htmlAll=!1,a.htmlScopeActive||(a.htmlFull=e.state.doc.toString());const n=a.htmlFull.length,o=Math.max(0,Math.min(a.htmlFocus.from,n)),s=Math.max(o,Math.min(a.htmlFocus.to,n));if(s<=o)return;a.htmlFocus={from:o,to:s},a.htmlScopeActive=!0,lt();const r=t==null?0:Math.max(0,Math.min(t-o,s-o));Vt(a.htmlFull.slice(o,s),{anchor:r,head:r}),ts("html"),pt(),e.focus()}function Bn(t=!0,e=null){const n=g.html;if(!n)return;U(),Mt(),a.htmlScopeActive=!1,a.htmlAll=!1,lt();const o=a.htmlFull||n.state.doc.toString(),s=e!=null?{anchor:Math.max(0,Math.min(e,o.length))}:t&&At(a.htmlFocus?.from,a.htmlFocus?.to,o.length)?{anchor:a.htmlFocus.from,head:a.htmlFocus.to}:null;a.htmlFull=o,Vt(o,s),ts("html"),a.cssPane="full",a.cssScopeSnapshot=a.cssFull,ue("css",a.cssFull),Lt()}function uo(t,e){const n=g.html;if(!n||!!e===a.htmlAll){qt(t);return}if(e){Mt();const o=a.htmlFull||n.state.doc.toString(),s=At(a.htmlFocus?.from,a.htmlFocus?.to,o.length)?a.htmlFocus:null;a.htmlScopeActive=!1,a.htmlFull=o,lt(),Vt(o,s?{anchor:s.from}:null),ts("html"),a.htmlAll=!0}else{const o=n.state.doc.length;At(a.htmlFocus?.from,a.htmlFocus?.to,o)?(U(),De(null)):(a.htmlAll=!1,a.htmlFocus=null,U(),pt())}K(t)}function fe(){a.htmlFocus=null,a.htmlAll=!1,a.cssFocus=null,a.htmlScopeActive=!1,a.htmlFull="",a.cssFull="",a.cssPane="full",a.cssScopeSnapshot="",a.lastBracketNames=null,a.lastCssSelectorNames=null,lt()}let Te=!1;function Jt(t){return!!t?.document.getElementById(qa)}function sn(t,e){if(!(!t||Ao(t,"html_tree")===!1)){if(!e&&tc.mode==="content"){Jt(t)&&Ja(t);return}Jt(t)||(Te=!0,ec("html_tree").then(()=>{Jt(t)||nc(t)}).catch(()=>{}).finally(()=>{Te=!1,K(t)}))}}function K(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-html-scope]");if(!e)return;a.htmlScopePref=ce(t);const n=Ao(t,"html_tree")===!1?a.htmlScopePref:Jt(t)||Te;e.setAttribute("aria-pressed",n?"true":"false"),e.title=h(t,n?"code_dock_html_scope_off":"code_dock_html_scope"),e.setAttribute("aria-label",e.title),e.innerHTML=Ys,t.document.getElementById(u)?.toggleAttribute("data-sve-html-scoped",a.htmlScopeActive),lt(),qt(t)}function fo(t,e){e._sveHtmlScopeBound||(e._sveHtmlScopeBound=!0,a.htmlScopePref=ce(t),Sf(t,e),sn(t,a.htmlScopePref),e.querySelector("[data-sve-html-scope]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation();const o=Jt(t)||Te;a.htmlScopePref=!o,G(t,Ve,a.htmlScopePref?"1":"0"),a.htmlScopePref?a.htmlFocus&&(U(),De()):(a.htmlScopeActive||a.htmlAll)&&Bn(),sn(t,a.htmlScopePref),K(t)}))}function Sf(t,e){e._sveTreeWatchBound||(e._sveTreeWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>{if(Te||Ao(t,"html_tree")===!1||!t.document.getElementById(u))return;const n=Jt(t);n!==ce(t)&&(a.htmlScopePref=n,G(t,Ve,n?"1":"0"),n?a.htmlFocus&&(U(),De()):(a.htmlScopeActive||a.htmlAll)&&Bn(),K(t))}))}const wf=new Set(["pre","textarea","script","style"]),$f=/^(<\/|\{\{\s*\/)/;function Cf(t){let e=0;for(const n of t.split(`
`)){if(!n.trim())continue;const o=n.length-n.trimStart().length;o>0&&(e===0||o<e)&&(e=o)}return" ".repeat(e===2||e===3?e:4)}function Tf(t){const e=String(t||"");if(!e.trim())return e;const n=[],o=l=>{for(const c of l||[])n.push(c),o(c.children)};o(xn(e));const s=Cf(e),r=[];let i=0;for(const l of e.split(`
`)){const c=i,d=l.trim();i+=l.length+1;const p=c+(l.length-l.trimStart().length),f=n.filter(y=>y.from<p&&p<y.to);if(f.some(y=>wf.has(y.tag))){r.push(l);continue}if(!d)continue;const m=f.length-($f.test(d)?1:0);r.push(s.repeat(Math.max(m,0))+d)}return r.join(`
`)+(e.endsWith(`
`)?`
`:"")}function po(t,e){let n=0;for(;n<e;){const o=Af(t,n);if(o===null){n+=1;continue}if(o===-1)return e;if(o>e)return o;n=o}return e}function Af(t,e){if(t.startsWith("{{",e)){const n=t.indexOf("}}",e+2);return n===-1?-1:n+2}if(t.startsWith("<!--",e)){const n=t.indexOf("-->",e+4);return n===-1?-1:n+3}return t[e]==="<"&&/[A-Za-z/!?]/.test(t[e+1]||"")?Ef(t,e):null}function Ef(t,e){let n="",o=e+1;for(;o<t.length;){const s=t[o];if(n){s===n&&(n=""),o+=1;continue}if(t.startsWith("{{",o)){const r=t.indexOf("}}",o+2);if(r===-1)return-1;o=r+2;continue}if(s==='"'||s==="'"){n=s,o+=1;continue}if(s===">")return o+1;if(s==="<")return-1;o+=1}return-1}function as(t,e){if(t.startsWith("{{",e)){const n=t.indexOf("}}",e+2);return n===-1?t.length:n+2}if(t.startsWith("<!--",e)){const n=t.indexOf("-->",e+4);return n===-1?t.length:n+3}return e}function an(t,e){if(t[e]!=="<")return null;const n=t.indexOf(">",e+1);if(n===-1)return null;const o=t.slice(e,n+1),s=o.match(/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/);if(s)return{kind:"close",name:s[1].toLowerCase(),from:e,to:n+1};const r=o.match(/^<([A-Za-z][A-Za-z0-9:-]*)/);if(!r)return{kind:"other",from:e,to:n+1};const i=r[1].toLowerCase();return{kind:/\/\s*>$/.test(o)||["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"].includes(i)?"void":"open",name:i,from:e,to:n+1}}function ho(t,e,n){let o=1,s=n;for(;s<t.length;){const r=as(t,s);if(r!==s){s=r;continue}if(t[s]!=="<"){s+=1;continue}const i=an(t,s);if(!i)break;if(i.kind==="open"&&i.name===e)o+=1;else if(i.kind==="close"&&i.name===e&&(o-=1,o===0))return i;s=i.to}return null}function Mf(t,e){const n=[];let o=0;for(;o<e;){const s=as(t,o);if(s!==o){o=s;continue}if(t[o]!=="<"){o+=1;continue}const r=an(t,o);if(!r)return null;if(e<r.to){if(r.kind==="open")return{name:r.name,open:r,close:ho(t,r.name,r.to),at:"open"};if(r.kind==="void")return{name:r.name,open:r,close:null,at:"open"};if(r.kind==="close"){let i=null;for(let l=n.length-1;l>=0;l-=1)if(n[l].name===r.name){i=n[l];break}return{name:r.name,open:i,close:r,at:"close"}}return null}if(r.kind==="open")n.push(r);else if(r.kind==="close"){for(let i=n.length-1;i>=0;i-=1)if(n[i].name===r.name){n.splice(i);break}}o=r.to}return null}function pe(){const t=g.html;if(!t)return null;const e=t.state.selection.main.head,n=t.state.doc.toString(),o=[];let s=0;for(;s<e;){const c=as(n,s);if(c!==s){s=c;continue}if(n[s]!=="<"){s+=1;continue}const d=an(n,s);if(!d||d.from>=e)break;if(d.kind==="open")o.push(d);else if(d.kind==="close"){for(let p=o.length-1;p>=0;p-=1)if(o[p].name===d.name){o.splice(p);break}}s=d.to}const r=n.lastIndexOf("<",Math.max(0,e-1));if(r!==-1&&n.indexOf(">",r)>=e){const c=an(n,r);if(c?.kind==="open"||c?.kind==="void"){const d=c.kind==="void"?null:ho(n,c.name,c.to);return d?{name:c.name,open:c,close:d}:{name:c.name,open:c,close:null}}}const i=o[o.length-1];if(!i)return null;const l=ho(n,i.name,i.to);return{name:i.name,open:i,close:l}}function rn(t){return Zs.includes(t)}function j(){g.html?.focus(),a.lastWin&&(X(a.lastWin),je(a.lastWin))}function yt(t,e,n,o=void 0){const s=[...e].sort((r,i)=>i.from-r.from||i.to-r.to);t.dispatch({changes:s,selection:n,...o?{userEvent:o}:{}})}const Yt="input.toolbar";function oe(t,e,n){const o=g.html;if(!o||o.state.readOnly)return;const s=o.state.selection.main.head,r=o.state.doc.lineAt(s),i=r.text.slice(0,s-r.from),l=r.text.trim()?J(r.text):he(o,r)||J(r.text);let c=t,d=0;if(i.trim()!=="")c=`
${l}${t}`,d=1+l.length;else if(!r.text.trim()){c=`${l}${t}`,d=l.length,o.dispatch({changes:{from:r.from,to:r.to,insert:c},selection:ba(r.from+d+e,n),userEvent:Yt});return}o.dispatch({changes:{from:s,to:o.state.selection.main.to,insert:c},selection:ba(s+d+e,n),userEvent:Yt})}function ba(t,e){return e?{anchor:t,head:t+e}:{anchor:t}}function ti(t){const{from:e}=t.state.selection.main,n=po(t.state.doc.toString(),e);return n!==e&&t.dispatch({selection:{anchor:n}}),n}function Pn(t,e,n){const o=g.html;!o||o.state.readOnly||(ti(o),oe(t,e,n))}const Lf=new Set(["section","article","header","footer","main","nav","aside"]);function Ff(t){return rn(t)||t==="p"||t==="a"}function ya(t,e=""){if(t==="a")return'<a href="">';if(t!=="section")return e?`<${t} class="${e}">`:`<${t}>`;const n=a.lastWin?.Statamic?.$config?.get?.("sveSectionTag");return typeof n=="string"&&n.trim()?`<${t} ${n.trim()}>`:`<${t}>`}function rs(){const t=g.html;if(!t||t.state.readOnly)return;const e=t.state.doc.toString(),n=(e.match(/^[ \t]*/)||[""])[0],o=Tf(e).split(`
`).map(s=>s&&n+s).join(`
`);o!==e&&(yt(t,[{from:0,to:e.length,insert:o}],{anchor:0}),j())}function On(t,e=""){const n=g.html;if(!n||n.state.readOnly)return;const o=n.state.selection.main,s=n.state.doc.toString();if(!o.empty&&po(s,o.from)===o.from&&po(s,o.to)===o.to){const f=s.slice(o.from,o.to),m=f.match(new RegExp(`^<${t}(\\s[^>]*)?>([\\s\\S]*)</${t}>$`,"i"));if(m){yt(n,[{from:o.from,to:o.to,insert:m[2]}],{anchor:o.from,head:o.from+m[2].length},Yt),j();return}const y=ya(t,e);let v=`${y}${f}</${t}>`,k=o.from+y.length;t==="ul"&&(v=`<ul>
  <li>${f}</li>
</ul>`,k=o.from+11),yt(n,[{from:o.from,to:o.to,insert:v}],{anchor:k,head:k+f.length},Yt),j();return}const i=o.head,l=Mf(s,i);if(l&&l.name===t&&l.open&&l.close){yt(n,[{from:l.close.from,to:l.close.to,insert:""},{from:l.open.from,to:l.open.to,insert:""}],{anchor:l.open.from},Yt),j();return}const c=pe();if(c?.open&&c.close&&rn(c.name)&&rn(t)&&c.name!==t){const f=s.slice(c.open.from,c.open.to).replace(new RegExp(`^<${c.name}`,"i"),`<${t}`);yt(n,[{from:c.close.from,to:c.close.to,insert:`</${t}>`},{from:c.open.from,to:c.open.to,insert:f}],{anchor:c.open.from+t.length+1},Yt),j();return}c?.open&&c.name===t&&Ff(t)&&n.dispatch({selection:{anchor:c.close?c.close.to:c.open.to}}),ti(n);const p=(n.state.doc.lineAt(n.state.selection.main.head).text.match(/^\s*/)||[""])[0];if(t==="ul"){const f=`<ul>
${p}  <li></li>
${p}</ul>`;oe(f,`<ul>
${p}  <li>`.length)}else{const f=ya(t,e),m=`${f}</${t}>`,y=t==="a"?f.indexOf('""')+1:Lf.has(t)?f.length:m.length;oe(m,y)}j()}function ei(t,e){let n=null;for(const o of fr(t))o.kind==="loop"&&o.loopKind==="collection"&&o.from<=e&&e<o.to&&(n=o);return n}function Bf(){const t=g.html;return t?ei(t.state.doc.toString(),t.state.selection.main.head):null}function ni(){const t=g.html;if(!t||t.state.readOnly)return;const e=t.state.doc.toString(),n=ei(e,t.state.selection.main.head);if(!n)return;const o=Hc(e,n,!n.paginate);if(o===e)return;if(!pr(e,o)){a.lastWin?.Statamic?.$toast?.error(h(a.lastWin,"html_tree_locked_element"));return}const[s,r,i]=Jo(e,o);yt(t,[{from:s,to:r,insert:i}]),j()}function je(t){try{Pf(t)}catch{}}function Pf(t){const e=t?.document?.getElementById(u),o=pe()?.name||"";if(!e)return;const s=Bf();for(const r of gn){const i=e.querySelector(`[data-sve-html-tool="${r.id}"]`);if(!i)continue;const l=r.action==="pagination",c=l?!!s?.paginate:r.id==="heading"?rn(o):r.id==="div"?o==="div":o===r.tag;l&&i.toggleAttribute("data-in-loop",!!s),c?i.setAttribute("data-active",""):i.removeAttribute("data-active")}}function mo(t,e,n){const o=t.document,s=pe()?.name||"";w(o),e.setAttribute("data-open","");const r=o.createElement("div");r.id=x,o.body.appendChild(r),z(t,e,r),r._sveApp=N(st,r,{kind:"choices",choices:n.map(i=>({value:i,label:i.toUpperCase(),active:s===i})),onPick:i=>{On(i),w(o)}})}function oi(t,e){const n=t.document;w(n),e.setAttribute("data-open","");const o=n.createElement("div");o.id=x,n.body.appendChild(o),z(t,e,o),o._sveApp=N(st,o,{kind:"choices",choices:$o.map(s=>({value:s.id,label:h(t,s.lang),active:!1})),onPick:s=>{const r=$o.find(i=>i.id===s);r&&On("div",r.classes),w(n)}})}function si(t,e){const n=t.document;w(n),e.setAttribute("data-open","");const o=n.createElement("div");o.id=x,n.body.appendChild(o),z(t,e,o);const s=r=>{n.getElementById(x)&&(o._sveApp?.unmount(),o._sveApp=N(st,o,{kind:"choices",choices:r,onPick:i=>{i&&(Pn(i,i.length),j()),w(n)}}),z(t,e,o))};s([{value:"",label:h(t,"code_dock_loading")}]),t.fetch("/!/sve/components",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(r=>r.ok?r.json():{items:[]}).then(r=>{const i=Array.isArray(r.items)?r.items:[];s(i.length?i.map(l=>({value:l.tag,label:l.name})):[{value:"",label:h(t,"component_none")}])}).catch(()=>s([{value:"",label:h(t,"component_none")}]))}function ka(t){const e=Rt(t),n=g.html,o=g.css;if(!e||n?.state.readOnly||o?.state.readOnly)return;const s=pe();if(s?.open&&n){const r=n.state.doc.sliceString(s.open.from,s.open.to),i=Tc(r,e);i!==r&&n.dispatch({changes:{from:s.open.from,to:s.open.to,insert:i}})}U(),Pe(a.cssFull,e)||(a.cssFull=`${String(a.cssFull||"").trimEnd()}${a.cssFull?.trim()?`
`:""}.${e} {
}
`),pt(),de(),Lt(),a.lastWin&&(X(a.lastWin),je(a.lastWin),P(a.lastWin))}function Of(t,e){const n=t.document;if(e.hasAttribute("data-open")){w(n);return}w(n),e.setAttribute("data-open","");const o=n.createElement("div");o.id=x,n.body.appendChild(o),z(t,e,o);const s=l=>{const c=Rt(l);if(!c)return"";if(Pe(a.cssFull,c))return h(t,"class_exists_here");const d=[...new Set(Uo(t,c).map(p=>String(p.file).replace(/^.*\//,"")))];return d.length?h(t,"class_exists_pick",{file:d.join(", ")}):""},r=l=>{ka(l),Ko(t,Rt(l)),w(n)},i=()=>{if(!n.getElementById(x))return;const l=o.querySelector("[data-sve-css-add-input]")?.value||"";o._sveApp?.unmount(),o._sveApp=N(Mn,o,{label:h(t,"code_dock_css_class_name"),placeholder:h(t,"code_dock_css_class_placeholder"),initial:l,options:Nu(t,h(t,"class_this_file")),existingLabel:h(t,"code_dock_css_class_existing"),createLabel:h(t,"code_dock_css_class_create"),takenText:s,onPick:r,onClose:()=>w(n),onAdd:c=>{ka(c),w(n)}}),z(t,e,o)};i(),Vo(t).then(i)}function ai(t,e){if(a.styleMode==="tw"){w(t.document),jc(t,e);return}Of(t,e)}function If(t){const e=t?.document.querySelector(`#${u} [data-sve-css-add-class]`);return e&&e.getClientRects().length?e:null}function ri(t,e){const n=e.querySelector("[data-sve-css-add-class]");!n||n._sveBound||(n._sveBound=!0,n.innerHTML=Fl,n.title=h(t,"code_dock_css_add_class"),n.setAttribute("aria-label",n.title),n.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),ai(t,n)}))}function He(){const t={html:"",css:"",js:""};Mt(),U();for(const e of ct)e==="html"?t.html=a.htmlScopeActive?a.htmlFull:g.html?.state.doc.toString()??"":e==="css"?(t.css=a.lastWin?Su(a.cssFull,ht(a.lastWin)):a.cssFull,t.css=Xu(t.css,t.html,_l)):t[e]=g[e]?.state.doc.toString()??"";return t}function is(){if(a.cssValues||a.cssAll||!a.htmlScopePref)return a.cssPane="full",a.cssScopeSnapshot=a.cssFull,a.cssFull;const t=At(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length),e=Bo(t?a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to):a.htmlFull);if(!e.length)return a.cssPane="empty",a.cssScopeSnapshot="","";a.cssPane="tree";const n=lr(a.cssFull,e);return a.cssScopeSnapshot=n,n}function Ft(t,e){a.applying=!0;try{a.lastWin&&(a.htmlScopePref=ce(a.lastWin)),a.htmlFull=t.html??"",a.cssFull=t.css??"",a.cssAll=!1,a.htmlAll=!1;for(const n of ct){const o=g[n];let s=t[n]??"";try{s=n==="html"?ss():n==="css"?is():s}catch{s=n==="html"?a.htmlFull||t.html||"":n==="css"?a.cssFull||t.css||"":s}if(!o)continue;const r=o.state.doc.toString(),i=[te[n].reconfigure(re.readOnly.of(!!e)),ee[n].reconfigure(D.editable.of(!e))];r!==s?o.dispatch({changes:{from:0,to:r.length,insert:s},effects:i}):o.dispatch({effects:i})}}finally{a.applying=!1}de(),Lt(),Mo("dock:html-changed"),a.lastWin&&(P(a.lastWin),je(a.lastWin),K(a.lastWin),ge(a.lastWin))}function se(t,e){return t.html===e.html&&t.css===e.css&&t.js===e.js}function ii(t){return String(t||"").replace(/\/\*[\s\S]*?\*\//g,"").trim().replace(/\s*:\s*/g,": ").replace(/\s*;\s*/g,";").replace(/\s+/g," ").replace(/;+$/,";")}function li(t){const e=ii(t).match(/^([a-z-]+)\s*:/i);return e?e[1].toLowerCase():""}function ci(t){const e=ii(t),n=e.indexOf(":");return n===-1?"":e.slice(n+1).replace(/;$/,"").trim().toLowerCase()}function H(t){const e=String(t||"").trim().toLowerCase();return e==="start"||e==="flex-start"||e==="left"||e==="top"?"flex-start":e==="end"||e==="flex-end"||e==="right"||e==="bottom"?"flex-end":e==="row-reverse"?"row-reverse":e==="column-reverse"?"column-reverse":e}function Ae(t){const e=H(t);return e==="flex"||e==="inline-flex"}function Re(){const t=g.css;if(!t)return null;const e=t.state.selection.main.head,n=t.state.doc.toString(),o=[],s=[];for(let i=0;i<n.length;i+=1){if(n[i]==="{"&&n[i+1]==="{"){const l=n.indexOf("}}",i+2);if(l===-1)break;i=l+1;continue}if(n[i]==="{")o.push(i);else if(n[i]==="}"){const l=o.pop();l!=null&&s.push({from:l+1,to:i,text:n.slice(l+1,i),open:l})}}let r=null;for(const i of s)e<i.open||e>i.to||(!r||i.to-i.open<r.to-r.open)&&(r=i);return r}function Df(t){const e=String(t||"");let n="",o=0;for(let s=0;s<e.length;s+=1){if(e[s]==="{"&&e[s+1]==="{"){const r=e.indexOf("}}",s+2);if(r===-1)break;o===0&&(n+=e.slice(s,r+2)),s=r+1;continue}if(e[s]==="{"){o+=1;continue}if(e[s]==="}"){o=Math.max(0,o-1);continue}o===0&&(n+=e[s])}return n}function xa(t){const e={};for(const n of Df(t).split(";")){const o=li(n);o&&(e[o]=ci(`${n};`))}return e}function jf(t,e,n){if(!e||e.from>=e.to)return null;let o=t.state.doc.lineAt(e.from),s=0;for(;o.from<=e.to;){const r=Math.max(o.from,e.from),i=Math.min(o.to,e.to),l=t.state.doc.sliceString(r,i);if(s===0&&li(l)===n)return{from:r,to:i,text:l};if(s+=Hf(l),o.to>=t.state.doc.length||o.to>=e.to)break;o=t.state.doc.lineAt(o.to+1)}return null}function Hf(t){let e=0;const n=String(t);for(let o=0;o<n.length;o+=1){if(n[o]==="{"&&n[o+1]==="{"){const s=n.indexOf("}}",o+2);o=s===-1?n.length:s+1;continue}n[o]==="{"?e+=1:n[o]==="}"&&(e-=1)}return e}function J(t){return(String(t).match(/^\s*/)||[""])[0]}function he(t,e,n){for(let o=e.number-1;o>=1;o-=1){const s=t.state.doc.line(o),r=s.text.trim();if(!r)continue;const i=J(s.text);if(n&&(r==="{"||r.endsWith("{")))return`${i}  `;if(!(r==="}"||r.startsWith("}")))return i}return""}function Rf(t,e){const n=t.state.doc.lineAt(e);if(n.text.trim())return J(n.text);const o=he(t,n,!0);if(o)return o;const s=Re();return s?di(t,s):"  "}function di(t,e){const n=t.state.doc.lineAt(e.from),o=t.state.doc.lineAt(Math.max(e.from,e.to));for(let r=o.number;r>=n.number;r-=1){const i=t.state.doc.line(r),l=Math.max(i.from,e.from),c=Math.min(i.to,e.to),d=t.state.doc.sliceString(l,c);if(d.trim())return(d.match(/^\s*/)||[""])[0]||"  "}return`${(t.state.doc.lineAt(Math.max(0,e.from-1)).text.match(/^\s*/)||[""])[0]}  `}function _a(){g.css?.focus(),a.lastWin&&(X(a.lastWin),P(a.lastWin))}function ui(t,e){if(!e)return"";const n=t.state.doc.toString();let o=0;for(let s=e.open-1;s>=0;s-=1)if(n[s]==="}"||n[s]==="{"||n[s]===";"){o=s+1;break}return n.slice(o,e.open).replace(/\/\*[\s\S]*?\*\//g,"").trim()}function zf(t,e){if(!a.cssState||!e)return e;const n=fi(t,e);if(n)return n;const o=ui(t,e);if(!o||o.startsWith("@"))return e;const s=t.state.doc.toString(),r=kt(s,e.open),i=kt(s,e.to)||`${r}    `,l=(t.state.doc.sliceString(e.from,e.to).match(/\n([^\S\n]*)$/)||[null,null])[1],c=l===null?e.to:e.to-l.length,d=`
${i}&${me()} {
${i}}
${l??r}`;t.dispatch({changes:{from:c,to:e.to,insert:d}});const p=t.state.doc.toString(),f=p.indexOf("{",c+d.indexOf("&")),m=f===-1?-1:_n(p,f);return m===-1?e:{from:f+1,to:m,text:p.slice(f+1,m),open:f}}function kt(t,e){const n=t.lastIndexOf(`
`,e-1)+1;return(t.slice(n,e).match(/^\s*/)||[""])[0]}function Q(t){const e=g.css;if(!e||e.state.readOnly||!t.length)return;const n=Re(),o=t.some(l=>l.value!=null)?zf(e,n):n;if(!o){const l=t.filter(c=>c.value!=null).map(c=>`${c.property}: ${c.value};`).join(`
`);l&&Nf(l),_a();return}const s=[],r=[],i=di(e,o);for(const l of t){const c=jf(e,o,l.property);if(l.value==null){if(!c)continue;let d=c.from,p=c.to;e.state.doc.sliceString(p,p+1)===`
`&&(p+=1),d=Math.max(d,o.from),p=Math.min(p,o.to),s.push({from:d,to:p});continue}if(!(c&&H(ci(c.text))===H(l.value)))if(c){const d=(c.text.match(/^\s*/)||[""])[0];s.push({from:c.from,to:c.to,insert:`${d}${l.property}: ${l.value};`})}else r.push(`${i}${l.property}: ${l.value};`)}if(r.length){const l=!o.text.includes(`
`)||!/\n\s*$/.test(o.text)?`
`:"",c=(o.text.match(/\n([^\S\n]*)$/)||[null,null])[1],d=c===null?o.to:o.to-c.length,p=c===null?"":c;s.push({from:d,to:o.to,insert:`${l}${r.join(`
`)}
${p}`})}s.length&&(s.sort((l,c)=>c.from-l.from||c.to-l.to),e.dispatch({changes:s})),_a()}function et(){const t=g.css,e=Re();if(!e)return{};if(a.cssState&&t){const n=fi(t,e);return n?xa(n.text):{}}return xa(e.text)}function fi(t,e){const n=ui(t,e),o=me();if(!n||n.startsWith("@"))return null;if(n.endsWith(o))return e;const s=t.state.doc.toString(),r=i=>{const l=_n(s,i);return l===-1?null:{from:i+1,to:l,text:s.slice(i+1,l),open:i}};for(const i of[`&${o}`,`${n}${o}`]){const l=new RegExp(`(^|[^\\w-])${i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\s*\\{`,"g");let c;for(;c=l.exec(s);){const d=s.indexOf("{",c.index);if(i.startsWith("&")&&(d<e.from||d>e.to))continue;const p=r(d);if(p)return p}}return null}function pi(t){const e=et(),n=Ae(e.display),o=H(e["flex-direction"])||(n?"row":"");if(n&&o===t){const s=[];e["flex-direction"]&&s.push({property:"flex-direction",value:null}),Ae(e.display)&&s.push({property:"display",value:null}),Q(s);return}Q([{property:"display",value:"flex"},{property:"flex-direction",value:t}])}function hi(t){const e=et();if(t==="flex"&&Ae(e.display)){Q([{property:"justify-content",value:null},{property:"align-items",value:null},{property:"flex-direction",value:null},{property:"display",value:null}]);return}Q([{property:"display",value:t}])}function Nf(t){const e=g.css;if(!e||e.state.readOnly)return;const n=e.state.selection.main.head,o=e.state.doc.lineAt(n),s=o.text.slice(0,n-o.from),r=o.text.slice(n-o.from),i=Rf(e,n),l=t.replace(/;?$/,";");if(s.trim()===""&&r.trim()===""){const d=`${i}${l}
${i}`;e.dispatch({changes:{from:o.from,to:o.to,insert:d},selection:{anchor:o.from+d.length}});return}const c=`
${i}${l}
${i}`;e.dispatch({changes:{from:n,to:e.state.selection.main.to,insert:c},selection:{anchor:n+c.length}})}function P(t){try{Wf(t),nt(t)}catch{}}function Wf(t){const e=a.styleMode==="tw",n=e?{}:et(),o=Ae(e?la("display"):n.display),s=H(n["flex-direction"])||(o?"row":""),r=i=>e?Nc()?i.twGroup?!!Wc(i.twGroup):!!i.tw&&!!la(i.tw):!1:!!i.css&&i.css in n;$t.tools=Qs.map(i=>{const l=(i.kids||[]).filter(c=>c.when!=="flex"||o).map(c=>({id:c.id,title:c.title,icon:Co[c.icon]||"",sep:!!c.sep,open:a.cssOpenMenu===c.id,active:e?r(c):c.kind==="display"?o:c.kind==="flexDir"?o&&s===c.value:c.value?H(n[c.css])===H(c.value):r(c)}));return{id:i.id,title:i.title,icon:Co[i.id]||Pl[i.id]||"",open:a.cssOpenTool===i.id||a.cssOpenMenu===i.id,kids:l,active:i.value?!e&&H(n[i.css])===H(i.value):r(i)||l.some(c=>c.active)}})}function ae(t){w(t),a.cssOpenTool="",a.lastWin&&P(a.lastWin)}function w(t){const e=t?.getElementById(x);a.cssOpenMenu="",e?._sveApp?.unmount(),e?.remove(),t?.querySelectorAll("[data-sve-css-tool][data-open], [data-sve-html-tool][data-open], [data-sve-css-add-class][data-open], [data-sve-code-history][data-open]").forEach(n=>n.removeAttribute("data-open"))}function qf(t){w(t),I(t),xt(t);for(const e of ct)g[e]&&Is?.(g[e])}function mi(t){if(a.cssColorsPromise)return a.cssColorsPromise;const e=t.Statamic?.$config?.get?.("cpUrl")||`/${t.Statamic?.$config?.get?.("cpRoute")||"cp"}`;return a.cssColorsPromise=t.fetch(`${e}/color-scheme/swatches`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async n=>{if(!n.ok)return[];const o=await n.json().catch(()=>[]);return Array.isArray(o)?o:[]}).catch(()=>[]).then(n=>{const o=new Set,s=[];for(const r of n){const i=r.var||r.value||r.handle,l=String(i||"").trim().replace(/^var\((.+)\)$/,"$1");!l||o.has(l)||(o.add(l),s.push({name:l,hex:r.hex||r.color||""}))}for(const[r,i]of Js)o.has(r)||(o.add(r),s.push({name:r,hex:i}));return s}),a.cssColorsPromise}function gi(t,e){const n=et()[e]||"",o=String(n).match(/^var\(\s*([^)]+?)\s*\)$/i),s=o?o[1].trim():"";for(const r of t.querySelectorAll("[data-sve-css-token]"))s&&r.getAttribute("data-sve-css-token")===s?r.setAttribute("data-active",""):r.removeAttribute("data-active")}function z(t,e,n){const o=e.getBoundingClientRect(),s=8,r=t.innerHeight-(o.bottom+4)-s,i=o.top-4-s;n.style.maxHeight="";const l=n.offsetHeight||0,c=l>r&&i>r;n.style.left=`${Math.max(s,Math.min(o.left,t.innerWidth-220))}px`,n.style.maxHeight=`${Math.max(120,c?i:r)}px`,n.style.top=c?`${Math.max(s,o.top-4-Math.min(l,i))}px`:`${Math.max(s,o.bottom+4)}px`}function vi(t,e,n){const o=t.document;w(o),e.setAttribute("data-open","");const s=o.createElement("div");s.id=x,o.body.appendChild(s),z(t,e,s);const r=i=>{s._sveApp?.unmount(),s._sveApp=N(st,s,{kind:"colors",swatches:i,onClear:()=>{Q([{property:n,value:null}]),ae(o)},onPick:l=>{Q([{property:n,value:`var(${l})`}]),ae(o)}}),gi(s,n)};r(Js.map(([i,l])=>({name:i,hex:l}))),mi(t).then(i=>{o.getElementById(x)&&r(i.map(l=>({name:l.name,hex:l.hex})))})}function bi(t,e,n,o){const s=t.document;w(s),e.setAttribute("data-open","");const r=s.createElement("div"),i=et()[n]||"";r.id=x,s.body.appendChild(r),z(t,e,r),r._sveApp=N(st,r,{kind:"choices",choices:(o||[]).map(l=>({value:l,label:l,active:H(l)===H(i)})),onPick:l=>{const c=H(l)===H(et()[n]||"");Q([{property:n,value:c?null:l}]),ae(s)}})}function go(t,e,n,o=[]){const s=t.document;w(s),e.setAttribute("data-open",""),Rc(t);const r=s.createElement("div");r.id=x,s.body.appendChild(r),z(t,e,r);const i=()=>{const l=[...o.map(d=>({value:d,label:d})),...zc(t,n).map(d=>({value:d.value,label:d.value}))],c=et()[n]||"";r._sveApp?.unmount(),r._sveApp=N(st,r,{kind:"choices",choices:l.map(d=>({...d,active:H(d.value)===H(c)})),onPick:d=>{Q([{property:n,value:d||null}]),ae(s)}})};i(),mi(t).then(()=>{s.getElementById(x)===r&&i()})}function yi(t,e,n){const o=t.document;w(o),e.setAttribute("data-open","");const s=o.createElement("div");s.id=x,o.body.appendChild(s),z(t,e,s),s._sveApp=N(st,s,{kind:"choices",choices:Bl.map(r=>({value:r,token:r,label:r})),onPick:r=>{Q([{property:n,value:`var(${r})`}]),ae(o)}}),gi(s,n)}const Sa=/\{\{#[\s\S]*?#\}\}|\{\{[\s\S]*?\}\}/g,wa=/<!--[\s\S]*?-->/g,$a=/<(\/?)([A-Za-z][A-Za-z0-9-]*)/g,ki=/^\{\{\s*(?:\/|endif\b|endunless\b)/,Vf=/^\{\{\s*(?:\/\s*(?:if|unless)\b|endif\b|endunless\b)/,Uf=/^\{\{\s*\/\s*partial\b/;function Zn(t,e,n){return t.some(o=>e<o.to&&n>o.from)}function Kf(t){const e=new Map;for(const n of fr(t)){const o=n.kind==="loop"?"loop":"if";e.set(n.from,o);const s=t.lastIndexOf("{{",n.to-2);s>=n.openTo&&ki.test(t.slice(s,n.to))&&e.set(s,o)}for(const n of rr(t))e.set(n.from,"component");return e}function Gf(t){const e=String(t||""),n=[],o=[];wa.lastIndex=0;let s;for(;s=wa.exec(e);)n.push({from:s.index,to:s.index+s[0].length});const r=Kf(e),i=[];for(Sa.lastIndex=0;s=Sa.exec(e);){const l=s.index,c=l+s[0].length,d=s[0];if(Zn(n,l,c))continue;if(i.push({from:l,to:c}),d.startsWith("{{#")){o.push({from:l,to:c,cls:"comment"});continue}const p=ki.test(d),f=r.get(l)||(p&&Vf.test(d)?"if":"")||(p&&Uf.test(d)?"component":"");o.push({from:l,to:c,cls:(f?`fam-${f}`:"antlers")+(p?"-close":"")})}for($a.lastIndex=0;s=$a.exec(e);){const l=s.index+1+s[1].length,c=l+s[2].length;Zn(n,l,c)||Zn(i,l,c)||o.push({from:l,to:c,cls:`fam-${Ya(s[2])}`})}return o.sort((l,c)=>l.from-c.from),o}function Ca(t,e,n){const o=new e.RangeSetBuilder;let s=0;for(const r of Gf(t.doc.toString()))r.from<s||(o.add(r.from,r.to,n(r.cls)),s=r.to);return o.finish()}function Xf(t){const e=new Map,n=r=>r==="comment"?"sve-cm-antlers-comment":r==="antlers"?"sve-cm-antlers":r==="antlers-close"?"sve-cm-antlers sve-cm-antlers-close":r.endsWith("-close")?`sve-cm-${r.slice(0,-6)} sve-cm-antlers-close`:`sve-cm-${r}`,o=r=>(e.has(r)||e.set(r,t.Decoration.mark({class:n(r)})),e.get(r));return{extensions:[t.StateField.define({create(r){return Ca(r,t,o)},update(r,i){return i.docChanged?Ca(i.state,t,o):r},provide:r=>t.EditorView.decorations.from(r)})]}}const Yf=30;function Zf(t,e){const n=String(t).match(/\{\{\s*([A-Za-z_][\w:./-]*|)$/);return n?{word:n[1],from:e-n[1].length}:null}function Jf(t,e){const n=String(t).match(/\{\{\s*partial:components\/(?:image|picture)\b[^}]*:imagePath="([\w.]*)$/);return n?{word:n[1],from:e-n[1].length}:null}function Qf(t,e){const n=String(e||"").toLowerCase(),o=(Array.isArray(t)?t:[]).filter(r=>r&&typeof r.handle=="string"&&r.handle);if(n.length>=1&&"collection".startsWith(n))return o;const s=n.match(/^collection:?(.*)$/);return s?o.filter(r=>r.handle.toLowerCase().startsWith(s[1])||String(r.title||"").toLowerCase().startsWith(s[1])):[]}function tp(t,e){const n=`collection from="${t}" }}
${e}  `;return{text:`${n}
${e}{{ /collection }}`,cursor:n.length}}function xi(t,e){const n=String(e||"").toLowerCase(),o=new Set,s=[];for(const r of Array.isArray(t)?t:[]){const i=typeof r?.var=="string"?r.var:"";if(!i||o.has(i))continue;const l=[i.toLowerCase(),...String(r.label||"").toLowerCase().split(/[\s_-]+/),...i.toLowerCase().split("_")];if((n===""||l.some(c=>c.startsWith(n)))&&(o.add(i),s.push(r)),s.length>=Yf)break}return s}function _i(t){const e=String(t).match(/^[ \t]*\}\}/);return e?e[0].length:0}function ep(t){return async e=>{const n=e.state.doc.lineAt(e.pos),o=Jf(e.state.sliceDoc(n.from,e.pos),e.pos);if(o)return o.word===""&&!e.explicit?null:np(t,e,o);const s=Zf(e.state.sliceDoc(n.from,e.pos),e.pos);if(!s||s.word===""&&!e.explicit)return null;const r=Qf(t.Statamic?.$config?.get?.("sveCollections")||[],s.word).map(d=>({label:`collection from="${d.handle}"`,detail:d.title||d.handle,type:"class",boost:1,apply:(p,f,m,y)=>sp(p,d.handle,m,y)})),i=await Si(t,e.pos);if(e.aborted)return null;const l=xi(i,s.word).map(d=>({label:d.var,detail:d.label&&d.label!==d.var?d.label:"",type:"variable",apply:(p,f,m,y)=>op(p,d.var,m,y)})),c=[...r,...l];return c.length?{from:s.from,options:c,filter:!1}:null}}async function Si(t,e){const n=a.htmlScopeActive&&a.htmlFocus?a.htmlFocus.from:0,o=await tl(t,n+e).catch(()=>[]);return o.length?o:(await Qi(t).catch(()=>[])).filter(s=>!s.parent)}async function np(t,e,n){const o=(await Si(t,e.pos)).filter(r=>r.type==="assets");if(e.aborted)return null;const s=xi(o,n.word).map(r=>({label:r.var,detail:r.label&&r.label!==r.var?r.label:"",type:"variable",apply:(i,l,c,d)=>{const p=i.state.sliceDoc(d,d+1)==='"'?r.var:`${r.var}"`;i.dispatch({changes:{from:c,to:d,insert:p},selection:{anchor:c+p.length},userEvent:"input.complete"})}}));return s.length?{from:n.from,options:s,filter:!1}:null}function op(t,e,n,o){const s=t.state.sliceDoc(o,t.state.doc.lineAt(o).to),r=_i(s)?e:`${e} }}`;t.dispatch({changes:{from:n,to:o,insert:r},selection:{anchor:n+r.length},userEvent:"input.complete"})}function sp(t,e,n,o){const s=t.state.doc.lineAt(n),r=(s.text.match(/^[ \t]*/)||[""])[0],i=tp(e,r),l=_i(t.state.sliceDoc(o,s.to));t.dispatch({changes:{from:n,to:o+l,insert:i.text},selection:{anchor:n+i.cursor},userEvent:"input.complete"})}const B=To({tag:"",emptyText:"",addLabel:"",dropTitle:"",chips:[],states:[],canEdit:!1,onAdd:null,onChip:null,onDrop:null}),ap={class:"sve-al"},rp={class:"sve-al-head"},ip={key:0,class:"sve-al-tag"},lp=["title","disabled"],cp={key:0,class:"sve-al-empty"},dp={class:"sve-al-chips"},up=["data-sve-al-chip","title","disabled","onClick"],fp={class:"sve-al-name"},pp={key:0,class:"sve-al-value"},hp=["title","onClick"],mp={__name:"AlpinePanel",setup(t){return(e,n)=>(_(),S("div",ap,[b("div",rp,[$(B).tag?(_(),S("span",ip,"<"+A($(B).tag)+">",1)):W("",!0),(_(!0),S(q,null,dt($(B).states,o=>(_(),S("span",{key:o,class:"sve-al-state"},A(o),1))),128)),n[1]||(n[1]=b("span",{class:"sve-al-gap"},null,-1)),b("button",{type:"button","data-sve-al-add":"",title:$(B).addLabel,disabled:!$(B).canEdit,onClick:n[0]||(n[0]=F(o=>$(B).onAdd?.(o),["prevent","stop"]))},"+",8,lp)]),$(B).chips.length?W("",!0):(_(),S("div",cp,A($(B).emptyText),1)),b("div",dp,[(_(!0),S(q,null,dt($(B).chips,o=>(_(),S("span",{key:o.id,class:"sve-al-chip-wrap"},[b("button",{type:"button","data-sve-al-chip":o.id,title:o.title,disabled:!$(B).canEdit,onClick:F(s=>$(B).onChip?.(s,o.id),["prevent","stop"])},[b("span",fp,A(o.name),1),o.value?(_(),S("span",pp,A(o.value),1)):W("",!0)],8,up),$(B).canEdit?(_(),S("button",{key:0,type:"button",class:"sve-al-drop",title:$(B).dropTitle,onClick:F(s=>$(B).onDrop?.(o.id),["prevent","stop"])},"−",8,hp)):W("",!0)]))),128))])]))}},gp=hr(mp,[["__scopeId","data-v-15add965"]]),vp=[{id:"state",lang:"alpine_group_state"},{id:"act",lang:"alpine_group_act"},{id:"react",lang:"alpine_group_react"}],Ta=[{id:"state",group:"state",label:"alpine_state",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: false }"}]},{id:"state_text",group:"state",label:"alpine_state_text",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: '|' }"}]},{id:"toggle",group:"act",label:"alpine_toggle",icon:"toggle",needsName:!0,attrs:[{name:"@click",value:":name = !:name"}]},{id:"open",group:"act",label:"alpine_open",icon:"open",needsName:!0,attrs:[{name:"@click",value:":name = true"}]},{id:"close",group:"act",label:"alpine_close",icon:"close",needsName:!0,attrs:[{name:"@click",value:":name = false"}]},{id:"open_hover",group:"act",label:"alpine_open_hover",icon:"open",needsName:!0,attrs:[{name:"@mouseenter",value:":name = true"}]},{id:"close_leave",group:"act",label:"alpine_close_leave",icon:"close",needsName:!0,attrs:[{name:"@mouseleave",value:":name = false"}]},{id:"open_focus",group:"act",label:"alpine_open_focus",icon:"open",needsName:!0,attrs:[{name:"@focusin",value:":name = true"}]},{id:"close_blur",group:"act",label:"alpine_close_blur",icon:"close",needsName:!0,attrs:[{name:"@focusout",value:":name = false"}]},{id:"close_outside",group:"act",label:"alpine_close_outside",icon:"outside",needsName:!0,attrs:[{name:"@click.outside",value:":name = false"}]},{id:"close_escape",group:"act",label:"alpine_close_escape",icon:"escape",needsName:!0,attrs:[{name:"@keydown.escape.window",value:":name = false"}]},{id:"show",group:"react",label:"alpine_show",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"}]},{id:"show_smooth",group:"react",label:"alpine_show_smooth",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"},{name:"x-transition",value:""}]},{id:"hide_until_ready",group:"react",label:"alpine_hide_until_ready",icon:"cloak",attrs:[{name:"x-cloak",value:""}]},{id:"class_when",group:"react",label:"alpine_class_when",icon:"klass",needsName:!0,attrs:[{name:":class",value:":name ? '|' : ''"}]},{id:"text",group:"react",label:"alpine_text",icon:"text",needsName:!0,attrs:[{name:"x-text",value:":name"}]}];function bp(t){return(t?.attrs||[]).map(e=>e.name).join(" ")}const yp=/^(x-[\w:.-]+|@[\w:.-]+|:[\w-]+)$/;function kp(t){return yp.test(String(t||""))}function ze(t){const e=String(t||""),n=[],o=/([@:a-zA-Z_][\w:.@-]*)(\s*=\s*(["'])([\s\S]*?)\3)?/g;let s,r=!0;for(;s=o.exec(e);){if(r){r=!1;continue}s[0].trim()&&n.push({name:s[1],value:s[4]??"",from:s.index,to:s.index+s[0].length,alpine:kp(s[1])})}return n}function wi(t){const e=String(t||"").trim().replace(/^\{|\}$/g,""),n=[],o=/(^|,)\s*([a-zA-Z_$][\w$]*)\s*:/g;let s;for(;s=o.exec(e);)n.push(s[2]);return n}function xp(t,e){return t.map(n=>({name:n.name,value:String(n.value).replaceAll(":name:",`${e}:`).replaceAll(":name",e)}))}function ls(t,e,n){const o=g.html,s=Bt();if(!o||o.state.readOnly||!s)return;const r=a.htmlScopeActive&&!!a.htmlFocus,i=r?a.htmlFocus.from:0,c=(r?a.htmlFull:o.state.doc.toString()).slice(s.from,s.openTo),d=n===""?e:`${e}="${n}"`,p=ze(c).find(m=>m.name===e);let f;if(p)f=c.slice(0,p.from)+d+c.slice(p.to);else{const m=c.search(/\s|\/?>$/);f=m===-1?c:`${c.slice(0,m)} ${d}${c.slice(m)}`}f!==c&&(yt(o,[{from:s.from-i,to:s.openTo-i,insert:f}],null),Ne(t))}function _p(t,e){const n=g.html,o=Bt();if(!n||n.state.readOnly||!o)return;const s=a.htmlScopeActive&&!!a.htmlFocus,r=s?a.htmlFocus.from:0,l=(s?a.htmlFull:n.state.doc.toString()).slice(o.from,o.openTo),c=ze(l).find(f=>f.name===e);if(!c)return;let d=c.from;for(;d>0&&/\s/.test(l[d-1]);)d-=1;const p=l.slice(0,d)+l.slice(c.to);yt(n,[{from:o.from-r,to:o.openTo-r,insert:p}],null),Ne(t)}function vo(t){const e=g.html;if(!e)return[];const o=a.htmlScopeActive&&!!a.htmlFocus?a.htmlFull:e.state.doc.toString(),s=Bt(),r=[],i=ie(Be(o),new Set);for(const l of i){if(!s||l.from>s.from||l.to<s.to)continue;const c=ze(o.slice(l.from,l.openTo)).find(d=>d.name==="x-data");c&&r.push(...wi(c.value))}return[...new Set(r)]}function Sp(t){const e=g.html,n=Bt();if(!e||!n)return[];const s=a.htmlScopeActive&&!!a.htmlFocus?a.htmlFull:e.state.doc.toString(),r=ze(s.slice(n.from,n.openTo)).find(i=>i.name==="x-data");return r?wi(r.value):[]}function wp(t,e){const n=t.document;w(n),e.setAttribute("data-open","");const o=vo(),s=n.createElement("div");s.id=x,n.body.appendChild(s),z(t,e,s);const r=!o.length,i=!r&&!Sp().length,c=vp.filter(d=>d.id==="state"?!i:!r).flatMap(d=>{const p=Ta.filter(f=>f.group===d.id);return p.length?[{value:`\0${d.id}`,label:h(t,r&&d.id==="state"?"alpine_group_state_first":d.lang),heading:!0},...p.map(f=>({value:f.id,label:h(t,f.label),hint:bp(f)}))]:[]});r&&c.push({value:"\0note",label:h(t,"alpine_needs_state"),note:!0}),s._sveApp=N(st,s,{kind:"choices",choices:c,onPick:d=>{const p=Ta.find(f=>f.id===d);if(w(n),!!p){if(!p.needsName){for(const f of p.attrs)ls(t,f.name,f.value);return}$p(t,e,p,o)}}})}function $p(t,e,n,o){const s=t.document,r=l=>{const c=String(l||"").trim().replace(/[^\w$]/g,"");if(w(s),!!c)for(const d of xp(n.attrs,c))ls(t,d.name,d.value.replace("|",""))};if(!o.length){bo(t,e,r);return}const i=s.createElement("div");i.id=x,s.body.appendChild(i),z(t,e,i),i._sveApp=N(st,i,{kind:"choices",choices:[{value:"\0head",label:h(t,"alpine_name"),heading:!0},...o.map(l=>({value:l,label:l})),{value:"\0new",label:h(t,"alpine_new_name")}],onPick:l=>{if(l==="\0new"){bo(t,e,r);return}r(l)}})}function bo(t,e,n){const o=t.document;w(o),e.setAttribute("data-open","");const s=o.createElement("div");s.id=x,o.body.appendChild(s),z(t,e,s),s._sveApp=N(Mn,s,{label:h(t,"alpine_name"),placeholder:h(t,"alpine_name_placeholder"),onAdd:r=>n(r)})}function Ne(t){const n=t?.document.getElementById(u)?.querySelector("[data-sve-alpine-host]");if(!n)return;const o=Bt(),s=g.html,r=a.htmlScopeActive&&!!a.htmlFocus,i=s?r?a.htmlFull:s.state.doc.toString():"",l=o?ze(i.slice(o.from,o.openTo)):[];B.tag=o?.tag||"",B.canEdit=!a.lastLocked&&!!o,B.emptyText=h(t,o?vo().length?"alpine_none_ready":"alpine_none":"alpine_pick"),B.addLabel=h(t,"alpine_add"),B.dropTitle=h(t,"alpine_remove"),B.states=vo(),B.chips=l.filter(c=>c.alpine).map(c=>({id:c.name,name:c.name,value:c.value,title:c.value?`${c.name}="${c.value}"`:c.name})),B.onAdd=c=>wp(t,c.currentTarget),B.onDrop=c=>_p(t,c),B.onChip=(c,d)=>{B.chips.find(f=>f.id===d)&&bo(t,c.currentTarget,f=>ls(t,d,f))},n._sveMounted||(n._sveMounted=!0,Le(n,gp))}const Cp=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]),Tp=new Set(["html","head","body"]),Aa=new Set(["if","unless","style_push","script_push","sve_defaults","once","noparse","foreach","forelse","loop","cache","nocache","scope","collection","nav","structure","taxonomy","users","search:results","form:create","form:errors"]),Ap=new Set(["collection:count"]);function Ea(t){return Ap.has(t)?!1:Aa.has(t)||Aa.has(t.split(":")[0])}const Ep=new Set(["CloseTag","MismatchedCloseTag","IncompleteCloseTag"]),Mp=/^\s*(\/?)\s*([A-Za-z_][A-Za-z0-9_.:-]*)([\s\S]*)$/,Lp=/^\{\{\s*\/?\s*([A-Za-z_][A-Za-z0-9_.:-]*)/,Fp=3e5;function Bp(t){const e=String(t||""),n=[],o=[];let s=0;for(;s<e.length;){const r=e.indexOf("{{",s);if(r===-1)break;if(e.startsWith("{{#",r)){const d=e.indexOf("#}}",r+3);if(d===-1){o.push(r);break}n.push({from:r,to:d+3,comment:!0,body:""}),s=d+3;continue}let i=0,l=r,c=-1;for(;l<e.length;){if(e.startsWith("{{",l)){i+=1,l+=2;continue}if(e.startsWith("}}",l)){if(i-=1,l+=2,i===0){c=l;break}continue}l+=1}if(c===-1){o.push(r),s=r+2;continue}n.push({from:r,to:c,comment:!1,body:e.slice(r+2,c-2)}),s=c}return{tags:n,unclosed:o}}function Pp(t,e){let n=t;for(const o of e)n=n.slice(0,o.from)+" ".repeat(o.to-o.from)+n.slice(o.to);return n}function Op(t,e){return t===e||t.startsWith(`${e}:`)}function Ge(t,e){return(t.slice(e,e+80).match(/^<\/?([A-Za-z][A-Za-z0-9:-]*)/)?.[1]||"").toLowerCase()}function Ip(t,e,n,o,s){const r=c=>s.has(c.name)&&!/\||\?\?/.test(c.rest);for(const c of n){const d=t.slice(c,c+80).match(Lp)?.[1]||"…";o.push({from:c,to:c+2,key:"code_dock_problem_antlers_unclosed",args:{name:d}})}const i=[],l=[];for(const c of e){if(c.comment)continue;const d=c.body.match(Mp);if(!d)continue;const p=!!d[1],f=d[2].toLowerCase(),m=d[3];if(!p&&(f==="elseif"||f==="else")){let y=-1;for(let v=i.length-1;v>=0;v-=1)if(i[v].name==="if"||i[v].name==="unless"){y=v;break}if(y===-1){o.push({from:c.from,to:c.to,key:"code_dock_problem_branch_stray",args:{name:f}});continue}l.push({from:i[y].to,to:c.from}),i[y]={...i[y],to:c.to},i.length=y+1;continue}if(p||f==="endif"||f==="endunless"){const y=f==="endif"?"if":f==="endunless"?"unless":f;let v=-1;for(let k=i.length-1;k>=0;k-=1)if(Op(i[k].name,y)){v=k;break}if(v===-1){o.push({from:c.from,to:c.to,key:"code_dock_problem_pair_stray",args:{name:y}});continue}for(const k of i.slice(v+1))Ea(k.name)&&o.push({from:k.from,to:k.to,key:"code_dock_problem_pair_unclosed",args:{name:k.name}});(y==="if"||y==="unless")&&l.push({from:i[v].to,to:c.from}),i.length=v;continue}m.trim().startsWith("=")||i.push({name:f,rest:m,from:c.from,to:c.to})}for(const c of i)Ea(c.name)?o.push({from:c.from,to:c.to,key:"code_dock_problem_pair_unclosed",args:{name:c.name}}):r(c)&&o.push({from:c.from,to:c.to,key:"code_dock_problem_list_unclosed",args:{name:c.name}});return l}function Dp(t,e,n,o){const s=e.parse(t),r=new Set,i=[];s.iterate({enter(l){if(l.name==="MismatchedCloseTag"){i.push({from:l.from,to:l.to,key:"code_dock_problem_tag_stray",args:{tag:Ge(t,l.from)}});return}if(l.name==="IncompleteCloseTag"){i.push({from:l.from,to:l.to,key:"code_dock_problem_tag_unfinished",args:{tag:Ge(t,l.from)}});return}if(l.type.isError){const f=l.node.parent;f&&(f.name==="OpenTag"||f.name==="CloseTag")&&(r.add(f.from),i.push({from:f.from,to:Math.max(f.from+1,l.from),key:"code_dock_problem_tag_unfinished",args:{tag:Ge(t,f.from)}}));return}if(l.name!=="Element")return;let c=null,d=!1;for(let f=l.node.firstChild;f;f=f.nextSibling)f.name==="OpenTag"&&(c=f),Ep.has(f.name)&&(d=!0);if(!c||d)return;const p=Ge(t,c.from);!p||Cp.has(p)||Tp.has(p)||n.some(f=>c.from>=f.from&&c.from<f.to&&l.to>f.to)||i.push({from:c.from,to:c.to,key:"code_dock_problem_tag_unclosed",args:{tag:p}})}});for(const l of i)l.key==="code_dock_problem_tag_unclosed"&&r.has(l.from)||l.args.tag&&o.push(l)}function jp(t,e,n={}){const o=String(t||""),s=String(n.before||""),r=String(n.after||""),i=s+o+r;if(!i.trim()||i.length>Fp)return[];const l=[];try{const{tags:f,unclosed:m}=Bp(i),y=Ip(i,f,m,l,new Set(n.lists||[]));e&&Dp(Pp(i,f),e,y,l)}catch{return[]}const c=s.length,d=c+o.length,p=new Set;return l.filter(f=>f.from>=c&&f.from<d).map(f=>({...f,from:f.from-c,to:Math.min(f.to,d)-c})).sort((f,m)=>f.from-m.from||f.to-m.to).filter(f=>{const m=`${f.from}:${f.key}`;return p.has(m)?!1:(p.add(m),!0)})}function Hp(t,e,n=()=>({})){const o=t.Decoration.mark({class:"sve-cm-problem"}),s=t.StateEffect.define(),r=l=>{const c=jp(l.doc.toString(),e,n()),d=new t.RangeSetBuilder;let p=0;for(const f of c)f.from<p||f.to<=f.from||(d.add(f.from,f.to,o),p=f.to);return{problems:c,decorations:d.finish()}},i=t.StateField.define({create(l){return r(l)},update(l,c){return c.docChanged||c.effects.some(d=>d.is(s))?r(c.state):l},provide:l=>t.EditorView.decorations.from(l,c=>c.decorations)});return{field:i,relint:s,extensions:[i]}}const Rp=new Set(["replicator","grid","list","array","table"]);let Je=new Set,Jn=null;function $i(t){return t.document.getElementById(u)?.querySelector("[data-sve-html-problems]")||null}function zp(t,e,n){const o=$i(t);if(!o)return;const s=e.state.doc,r=n.map(c=>({from:c.from,line:s.lineAt(Math.min(c.from,s.length)).number,text:h(t,c.key,c.args)})),i=r.map(c=>`${c.line}:${c.text}`).join(`
`);if(o.dataset.sveSignature===i||(o.dataset.sveSignature=i,o.hidden=r.length===0,o.replaceChildren(),!r.length))return;const l=t.document.createElement("span");l.setAttribute("data-sve-problems-title",""),l.textContent=h(t,"code_dock_problems_title"),o.appendChild(l);for(const c of r){const d=t.document.createElement("button"),p=t.document.createElement("b");d.type="button",d.dataset.sveProblemAt=String(c.from),p.textContent=h(t,"code_dock_problem_line",{line:c.line}),d.append(p,t.document.createTextNode(` ${c.text}`)),o.appendChild(d)}}function Np(t){const e=$i(t);!e||e._sveBound||(e._sveBound=!0,e.addEventListener("mousedown",n=>n.preventDefault()),e.addEventListener("click",n=>{const o=n.target.closest("[data-sve-problem-at]"),s=g.html;if(!o||!s)return;n.preventDefault(),n.stopPropagation();const r=Math.min(Number(o.dataset.sveProblemAt)||0,s.state.doc.length);s.dispatch({selection:{anchor:r},effects:D.scrollIntoView(r,{y:"center"})}),s.focus()}))}function Wp(t){const e=[],n=o=>{for(const s of o||[])s?.loop&&Rp.has(s.type)&&s.var&&!s.parent&&e.push(s.var)};n(t?.section);for(const o of t?.page||[])n(o?.items);return e}function qp(t,e,n){const o={collection:Do(t),set:jo(a.lastType),view:"",scope:""},s=o.set?Ho(o):"";if(s===Jn)return;Jn=s;const r=l=>{if(Jn!==s)return;const c=new Set(Wp(l)),d=c.size===Je.size&&[...c].every(p=>Je.has(p));Je=c,!d&&g.html===e&&t.queueMicrotask(()=>{g.html===e&&e.dispatch({effects:n.of(null)})})};if(!s){r(null);return}const i=$r(s);if(i){r(i);return}Oe(t,o).then(r)}function Vp(){if(!a.htmlScopeActive||!a.htmlFocus)return{};const{from:t,to:e}=a.htmlFocus;return{before:a.htmlFull.slice(0,t),after:a.htmlFull.slice(e)}}function Up(t){if(!a.htmlLintUi){const{field:e,relint:n}=Hp({Decoration:ot,StateField:gt,StateEffect:Gt,RangeSetBuilder:vt,EditorView:D},Qt.parser,()=>({lists:Je,...Vp()})),o=D.updateListener.of(s=>{const r=s.transactions.some(i=>i.effects.some(l=>l.is(n)));!s.docChanged&&!r||(s.docChanged&&qp(t,s.view,n),zp(t,s.view,s.state.field(e).problems))});a.htmlLintUi={extensions:[e,o]}}return Np(t),a.htmlLintUi}const Ma=/\{\{\s*(?:vite\b[^}]*|yield_[a-z_]+|theme_tokens)\s*\}\}/g;function Kp(t,e=[]){const n=[];Ma.lastIndex=0;let o;for(;o=Ma.exec(String(t||""));)n.push(o.index,o.index+o[0].length);if(!e||!e.length)return n;const s=[];for(const r of[n,e])for(let i=0;i+1<r.length;i+=2)s.push([r[i],r[i+1]]);return s.sort((r,i)=>r[0]-i[0]||r[1]-i[1]).flat()}const Gp=["input","delete","move"];function Xp(t){return Gp.some(e=>t(e))}let Qn={text:null,ranges:[]};function Ci(t){return Qn.text!==t&&(Qn={text:t,ranges:Kp(t,t.includes("sve-lock")?Ac(t):[])}),Qn.ranges}function La(t,e){const n=new vt,o=Ci(t.doc.toString());for(let s=0;s<o.length;s+=2)n.add(o[s],o[s+1],e);return n.finish()}let Xe=null;function Yp(){if(Xe)return Xe;const t=ot.mark({class:"sve-dock-locked"}),e=gt.define({create:o=>La(o,t),update:(o,s)=>s.docChanged?La(s.state,t):o,provide:o=>D.decorations.from(o)}),n=D.baseTheme({".sve-dock-locked":{opacity:".55",borderRadius:".1875rem",backgroundColor:"rgba(127,127,127,.14)",cursor:"not-allowed"}});return Xe={extensions:[e,n,re.changeFilter.of(o=>Xp(s=>o.isUserEvent(s))?Ci(o.startState.doc.toString()):!0)]},Xe}function Zp(t,e){if(!t||!e)return t??null;const n=e.mapPos(t.from,1),o=e.mapPos(t.to,-1);return o>n?{from:n,to:o}:null}function Jp(){if(a.cssGhostUi)return a.cssGhostUi;const t=ot.mark({class:"sve-css-ghost"}),e=n=>{const o=new vt;if(!a.lastWin)return o.finish();try{for(const s of wu(n.doc.toString(),ht(a.lastWin)))o.add(s.from,s.to,t)}catch{}return o.finish()};return a.cssGhostUi=gt.define({create:n=>e(n),update:(n,o)=>o.docChanged?e(o.state):n,provide:n=>D.decorations.from(n)}),a.cssGhostUi}let Ye=null,ln=null;function Qp(){if(Ye)return Ye;ln=Gt.define();const t=ot.line({class:"sve-css-id"}),e=n=>{const o=new vt;if(!a.lastWin||!a.cssValues)return o.finish();try{const s=n.doc;for(const r of en(s.toString(),ht(a.lastWin),a.cssSize)){const i=s.lineAt(Math.min(r.from,s.length)).number,l=s.lineAt(Math.min(Math.max(r.to-1,r.from),s.length)).number;for(let c=i;c<=l;c+=1)o.add(s.line(c).from,s.line(c).from,t)}}catch{}return o.finish()};return Ye=gt.define({create:n=>e(n),update:(n,o)=>o.docChanged||o.effects.some(s=>s.is(ln))?e(o.state):n,provide:n=>D.decorations.from(n)}),Ye}function In(){ln&&g.css&&g.css.dispatch({effects:ln.of(null)})}function th(){return a.htmlPartialUi||(a.htmlPartialUi=Ec({Decoration:ot,StateField:gt,StateEffect:Gt,RangeSetBuilder:vt,EditorView:D})),a.htmlPartialUi}function eh(){return a.htmlAntlersUi||(a.htmlAntlersUi=Xf({Decoration:ot,StateField:gt,RangeSetBuilder:vt,EditorView:D})),a.htmlAntlersUi}function nh(){return a.htmlClassTokenUi||(a.htmlClassTokenUi=md({Decoration:ot,StateField:gt,StateEffect:Gt,RangeSetBuilder:vt,EditorView:D})),a.htmlClassTokenUi}function Ti(t,e,n){g[e]?.destroy();const o=pn.of([{key:"Mod-s",run:()=>(V(t.document),!0)}]);g[e]=new D({state:re.create({doc:"",extensions:[Ts(),As(),Es(),gf(e),il(e),Ps(),Bs({tooltipClass:()=>"sve-tw-complete"}),...e==="html"?[Qt.data.of({autocomplete:qc(t)}),Qt.data.of({autocomplete:qu(t)}),Qt.data.of({autocomplete:ep(t)}),Vu(t),Vc(js,t)]:[],...e==="html"?[...sd(),ad()]:[],...e==="css"?[Ns(),Jp(),Qp()]:[],pn.of([...Ms,...e==="html"?[{key:"Tab",run:rd}]:[],Ls,...Fs,...Ds,...Os]),o,D.lineWrapping,...e==="html"||e==="css"?th().extensions:[],...e==="html"?eh().extensions:[],...e==="html"?Up(t).extensions:[],...e==="html"?Yp().extensions:[],...e==="html"?nh().extensions:[],te[e].of(re.readOnly.of(!!a.lastLocked)),ee[e].of(D.editable.of(!a.lastLocked)),D.updateListener.of(s=>{e==="html"&&s.docChanged&&a.htmlAll&&!a.htmlScopeActive&&(a.htmlFocus=Zp(a.htmlFocus,s.changes)),e==="html"&&s.docChanged&&!a.applying&&(Ur(),Mo("dock:html-changed")),e==="css"&&s.docChanged&&!a.applying&&Kr(),s.docChanged&&X(t),e==="css"&&(s.docChanged||s.selectionSet)&&P(t),e==="css"&&s.docChanged&&!a.applying&&Ut(t),e==="html"&&(s.docChanged||s.selectionSet)&&(je(t),Ne(t),nt(t),a.applying||ge(t))}),D.domEventHandlers({click:(s,r)=>(e==="html"&&r===g.html&&Qr(t),!1)}),...Nl(T,{height:"auto",background:"#1E1E21",scroller:{overflow:"visible",height:"auto",minHeight:0},extraTags:s=>[{tag:s.tagName,color:"#4ec9b0"},{tag:s.attributeName,color:"#9cdcfe"},{tag:s.attributeValue,color:"#ce9178"},{tag:s.angleBracket,color:"#808080"}]})]}),parent:n})}function Ai(t){if(!t||t.querySelector(".cm-editor"))return;t.replaceChildren();const e=t.ownerDocument.createElement("span");e.style.cssText="width:16px;height:16px;margin:12px;border:2px solid #858585;border-right-color:transparent;border-radius:50%;display:block;animation:sve-cm-wait .6s linear infinite",t.appendChild(e)}function ht(t){return Eo(t).map(e=>({handle:e.handle,base:e.base,direction:e.direction,max:e.max,min_px:e.min_px,media:e.media,media_px:e.media_px,label:e.label}))}function Dn(t,e){return ht(t).find(n=>n.handle===e)||null}function me(t=a.cssState){return t?t==="before"||t==="after"?`::${t}`:`:${t}`:""}function Ut(t,e=!1){const n=g.css;if(!n||!hn||!mn)return;const o=n.state.doc.toString(),s=`${a.cssValues?"1":"0"}|${a.cssSize}|${Tn(o).map(p=>`${p.from}-${p.to}`).join(",")}`;if(!e&&s===a.cssFoldSig)return;a.cssFoldSig=s;const r=ht(t),i=new Map,l=[..._u(o,r,a.cssSize),...a.cssValues?[]:en(o,r,a.cssSize).map(p=>({from:p.from,to:p.to}))];for(const p of l)p.to>p.from&&i.set(`${p.from}:${p.to}`,{from:p.from,to:p.to});const c=[],d=new Set;Ws(n.state).between(0,o.length,(p,f)=>{const m=`${p}:${f}`;d.add(m),!i.has(m)&&a.cssOwnFolds.has(m)&&c.push(mn.of({from:p,to:f}))});for(const[p,f]of i)d.has(p)||c.push(hn.of(f));a.cssOwnFolds=new Set(i.keys()),c.length&&n.dispatch({effects:c})}function Ee(t,e){const n=a.cssFull||e;return/(max|min)-width/i.test(n)&&!/width\s*[<>]/i.test(n)&&t.media_px||t.media}function oh(t,e){const n=g.css;if(!n||n.state.readOnly)return;const o=ht(t),s=Dn(t,e),r=n.state.doc.toString();if(!s||s.base){const p=n.state.selection.main.head,f=Tn(r).find(m=>p>=m.from&&p<=m.to);f&&n.dispatch({selection:{anchor:f.from},scrollIntoView:!0});return}const i=An(r,o,e);if(i.length){const p=i[0],f=Math.min(p.bodyTo,p.bodyFrom+(r.slice(p.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);n.dispatch({selection:{anchor:f},scrollIntoView:!0});return}const l=Ee(s,r),c=cs(n,r),d=`

${c.indent}@media ${l} {
${c.indent}    
${c.indent}}${c.suffix}`;n.dispatch({changes:{from:c.at,to:c.at,insert:d},selection:{anchor:c.at+d.lastIndexOf("    ")+4},scrollIntoView:!0})}function cs(t,e){const n=Tn(e);if(n.length){const i=n[n.length-1];return{at:i.to,indent:kt(e,i.from),suffix:""}}const o=i=>({at:i.to,indent:kt(e,i.to)||`${kt(e,i.open)}    `,suffix:`
${kt(e,i.open)}`}),s=Re();if(s)return o(s);const r=sh(e);return r?o(r):{at:e.length,indent:"",suffix:""}}function sh(t){const e=String(t||"");let n=null,o=0,s=0;for(;o<e.length;){if(e[o]==="}"||e[o]===";"){o+=1,s=o;continue}if(e[o]!=="{"){o+=1;continue}const r=_n(e,o);if(r===-1||n||(n=e.slice(s,o).trim().startsWith("@")?null:{from:s,open:o,to:r},!n))return null;o=r+1,s=o}return n}function ah(t,e){const n=e===a.cssSize?"":e;a.cssSize=n,G(t,Rn,n),it("lp:set-device",{win:t,key:n?Gl(n,t):"Responsive"}),n&&oh(t,n),a.cssValues&&ds(t),Ut(t,!0),In(),nt(t),P(t)}function rh(t,e){a.cssState=zn.includes(e)?e:"",G(t,cn,a.cssState),w(t.document),nt(t),P(t)}function ih(t,e){const n=t.document;w(n),e.setAttribute("data-open","");const o=n.createElement("div");o.id=x,n.body.appendChild(o),z(t,e,o),o._sveApp=N(st,o,{kind:"choices",choices:[{value:"",label:h(t,"css_state_none"),active:!a.cssState},...zn.map(s=>({value:s,label:me(s),active:s===a.cssState}))],onPick:s=>rh(t,s)})}function nt(t){const e=t?.document.getElementById(u),n=e?.querySelector("[data-sve-css-head]");if(!n)return;const o=Bt(),s=ht(t),r=g.css?.state.doc.toString()??"";C.tag=o?.tag||"",C.scope=Mc(o?St().slice(o.from,o.openTo):"")||"",e.toggleAttribute("data-sve-css-unnamed",a.styleMode!=="tw"&&!C.scope);const i=C.scope,l=Uo(t,i);C.scopeElsewhere=[...new Set(l.map(c=>String(c.file).replace(/^.*\//,"")))],C.scopeElsewhereTitle=C.scopeElsewhere.length?`${h(t,"class_defined_in",{file:C.scopeElsewhere.join(", ")})} — ${h(t,"class_defined_import")}`:"",C.onScopeImport=()=>{Ko(t,i)&&nt(t)},i&&!Rr()&&Vo(t).then(()=>nt(t)),C.note=a.cssPane==="empty"?h(t,"css_pane_empty"):"",C.canEdit=!a.lastLocked,C.onTag=c=>Uc(t,c.currentTarget,o),C.state=a.cssState,C.stateLabel=a.cssState?me(a.cssState):h(t,"css_state"),C.onState=c=>ih(t,c.currentTarget),C.onSize=c=>ah(t,c),C.sizes=[{key:"",label:h(t,"tw_size_all"),title:h(t,"css_size_all_title"),active:!a.cssSize},...s.map(c=>{const d=c.base||An(r,s,c.handle).length>0;return{key:c.handle,label:c.label,title:c.base?h(t,"css_size_base_title"):`@media ${c.media}${d?"":`  ·  ${h(t,"css_size_new")}`}`,active:a.cssSize===c.handle}})],n._sveMounted||(n._sveMounted=!0,Le(n,Bu))}yn("lp:device",t=>{const e=a.lastWin;if(!e||!vs(e.document))return;const n=Eo(e).find(o=>o.device===t)?.handle||"";n!==a.cssSize&&(a.cssSize=n,G(e,Rn,n),Ut(e,!0),In(),nt(e),P(e))});function lh(t){const e=Math.max(0,Math.round(Date.now()/1e3-t)),n=new Date(t*1e3).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});let o=n;try{const s=new Intl.RelativeTimeFormat(void 0,{numeric:"auto"});e<90?o=s.format(-e,"second"):e<5400?o=s.format(-Math.round(e/60),"minute"):e<86400?o=s.format(-Math.round(e/3600),"hour"):o=s.format(-Math.round(e/86400),"day")}catch{}return`${o} · ${n}`}function Ei(t,e){return t.fetch(e,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}})}async function ch(t,e){const n=t.document,o=mt();if(w(n),!o)return;let s=[];try{const i=await Ei(t,`/!/sve/section-template/history?type=${encodeURIComponent(o)}`);i.ok&&(s=(await i.json())?.entries||[])}catch{s=[]}if(!n.getElementById(u)||!n.contains(e))return;e.setAttribute("data-open","");const r=n.createElement("div");r.id=x,n.body.appendChild(r),z(t,e,r),r._sveApp=N(st,r,{kind:"choices",choices:s.length?s.map(i=>({value:i.id,label:lh(i.at)})):[{value:"",label:h(t,"code_dock_history_empty")}],onPick:i=>{w(n),i&&dh(t,o,i)}})}async function dh(t,e,n){if(ft())return;let o=null;try{const s=await Ei(t,`/!/sve/section-template/history/entry?type=${encodeURIComponent(e)}&id=${encodeURIComponent(n)}`);s.ok&&(o=await s.json())}catch{o=null}!o||ft()||(Ft({html:o.html??"",css:o.css??"",js:o.js??""},a.lastLocked),X(t),ge(t))}function zt(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-code-strip]");if(!e)return;e.hidden=a.styleMode!=="tw";const n=_r(t);e.innerHTML=Ol,e.title=h(t,n?"tw_strip_on":"tw_strip_off"),e.setAttribute("aria-label",e.title),e.setAttribute("aria-pressed",n?"true":"false")}function Mi(t,e){const n=e.querySelector("[data-sve-code-strip]");!n||n._sveBound||(n._sveBound=!0,n.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),Kc(t,!_r(t)),zt(t),Gc(t)}),zt(t))}function Li(t,e){const n=e.querySelector("[data-sve-code-history]");!n||n._sveBound||(n._sveBound=!0,n.innerHTML=Il,n.title=h(t,"code_dock_history"),n.setAttribute("aria-label",n.title),n.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),n.hasAttribute("data-open")){w(t.document);return}ch(t,n)}))}function uh(){return a.styleMode}function fh(t){return a.styleMode!=="tw"?null:mh()||ph()||(hh()?null:Bt())}function ph(){const t=jn(),e=t?Fc(t.html,t.pos):null;return e?{kind:"component",tagCall:!0,src:e.src,label:e.src,from:e.from,to:e.to,openTo:e.to,path:`a${e.from}:${e.src}`}:null}function hh(){const t=jn();return!!t&&!!Bc(t.html,t.pos)}function jn(){const t=g.html;if(!t)return null;const e=a.htmlScopeActive&&!!a.htmlFocus,n=e?a.htmlFull:t.state.doc.toString(),o=e?a.htmlFocus.from:0;return{html:n,pos:o+t.state.selection.main.from}}function mh(){const t=jn();return!t||!Lc(t.html,t.pos)?null:ie(xn(t.html),new Set).find(e=>e.kind==="component"&&e.from<=t.pos&&t.pos<e.to)||null}function Bt(t){const e=jn();if(!e)return null;const{html:n,pos:o}=e,s=ie(Be(n),new Set);let r=null;for(const i of s)i.from<=o&&o<i.to&&(r=i);return r}function ge(t){a.styleMode==="tw"&&Xc(t,fh())}function Hn(t){const e=t?.document.getElementById(u),n=e?.querySelector("[data-sve-values-mode]");if(!e||!n)return;e.setAttribute("data-sve-values",a.cssValues?"on":"off");const o=t.document.createElement("span");o.textContent=h(t,"code_dock_values"),n.innerHTML=jl,n.appendChild(o),n.title=h(t,a.cssValues?"code_dock_values_off":"code_dock_values_on"),n.setAttribute("aria-label",n.title),n.setAttribute("aria-pressed",a.cssValues?"true":"false")}function ds(t){const e=g.css;if(!e||e.state.readOnly)return;const n=ht(t),o=e.state.doc.toString(),s=en(o,n,a.cssSize);if(e.focus(),s.length){const m=s[0],y=Math.min(m.bodyTo,m.bodyFrom+(o.slice(m.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);e.dispatch({selection:{anchor:y},scrollIntoView:!0});return}const r=Dn(t,a.cssSize);if(!r||r.base){const m=`#id-{{ id }} {
    `;e.dispatch({changes:{from:0,to:0,insert:`${m}
}

`},selection:{anchor:m.length},scrollIntoView:!0});return}const i=An(o,n,a.cssSize)[0];if(i){const m=`${kt(o,i.from)}    `,y=`
${m}#id-{{ id }} {
${m}    `;e.dispatch({changes:{from:i.bodyFrom,to:i.bodyFrom,insert:`${y}
${m}}
`},selection:{anchor:i.bodyFrom+y.length},scrollIntoView:!0});return}const l=cs(e,o),c=`${l.indent}    `,d=en(o,n,"").some(m=>l.at>m.bodyFrom&&l.at<=m.bodyTo),p=d?`

${l.indent}@media ${Ee(r,o)} {
${c}`:`

${l.indent}@media ${Ee(r,o)} {
${c}#id-{{ id }} {
${c}    `,f=d?`
${l.indent}}${l.suffix}`:`
${c}}
${l.indent}}${l.suffix}`;e.dispatch({changes:{from:l.at,to:l.at,insert:`${p}${f}`},selection:{anchor:l.at+p.length},scrollIntoView:!0})}function Fi(t,e){a.cssValues=!!e,G(t,Kn,a.cssValues?"1":"0"),w(t.document),a.cssOpenTool="",Hn(t),U(),pt(),a.cssValues&&ds(t),Ut(t,!0),In(),nt(t),P(t)}function Fa(t,e){a.cssAll=!!e,w(t.document),a.cssOpenTool="",qt(t),U(),pt(),Ut(t,!0),nt(t),P(t)}function Bi(t,e){const n=Qo();e?(n.html&&uo(t,!0),n.css&&Fa(t,!0)):(uo(t,!1),a.cssAll&&Fa(t,!1)),qt(t)}function Pi(t){Bi(t,!qr())}function We(t){const e=t?.document.getElementById(u);if(!e)return;const n=a.styleMode==="tw";e.setAttribute("data-sve-style",a.styleMode);const o=e.querySelector("[data-sve-css-label]");o&&(o.textContent=n?h(t,"code_dock_style_tw"):h(t,"code_dock_css"));const s=e.querySelector("[data-sve-style-mode]");if(!s)return;const r=t.document.createElement("span");r.textContent=n?h(t,"code_dock_style_tw"):h(t,"code_dock_css"),s.innerHTML=n?Hl:Dl,s.appendChild(r),s.title=h(t,n?"code_dock_style_to_css":"code_dock_style_to_tw"),s.setAttribute("aria-label",s.title),s.setAttribute("aria-pressed",n?"true":"false")}function us(t){t?.document.getElementById(u),w(t.document),ro(t),a.cssOpenTool="",a.cssOpenMenu="",a.styleMode==="tw"&&a.cssValues&&(a.cssValues=!1,G(t,Kn,"0")),We(t),Hn(t),qt(t),zt(t),a.cssToolRow?.(),a.styleMode==="tw"&&(a.htmlScopePref=!0,G(t,Ve,"1"),sn(t,!0)),ge(t),Ne(t),P(t)}const Rn="sve-css-size",cn="sve-css-state",zn=["hover","focus","focus-visible","active","disabled","before","after"],Ba="data-sve-scroll-edge";function fs(t){if(!t||t._sveEdges)return;t._sveEdges=!0;const e=()=>vh(t),n=new ResizeObserver(e),o=()=>{for(const s of t.children)n.observe(s)};t.addEventListener("scroll",e,{passive:!0}),n.observe(t),o(),new MutationObserver(()=>{o(),e()}).observe(t,{childList:!0}),e()}function gh(t,e){if(!t||t._sveEdgesIn)return;t._sveEdgesIn=!0;const n=()=>t.querySelectorAll(e).forEach(fs);n(),new MutationObserver(n).observe(t,{childList:!0,subtree:!0})}function vh(t){const e=t.scrollWidth-t.clientWidth,n=t.scrollLeft>1,o=e-t.scrollLeft>1,s=n&&o?"both":n?"left":o?"right":"";s?t.setAttribute(Ba,s):t.removeAttribute(Ba)}const bh='<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.6 10.2C4.6 9.4 4 8.3 4 7a4 4 0 1 1 8 0c0 1.3-.6 2.4-1.6 3.2-.4.3-.6.8-.6 1.3V12H6.2v-.5c0-.5-.2-1-.6-1.3z"/><path d="M6.4 14h3.2"/></svg>';function yh(t,e){const n=e.querySelector("[data-sve-help-tools]");if(!n||n._sveBound)return;n._sveBound=!0;const o=qe(t,n,"data-sve-help-btn",bh,h(t,"code_dock_help_off")),s=()=>{const i=eo(t),l=h(t,i?"code_dock_help_on":"code_dock_help_off");o.setAttribute("aria-pressed",i?"true":"false"),o.title=l,o.setAttribute("aria-label",l)};o.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation(),oc(t,!eo(t))}),s();const r=Qa(i=>{if(!o.isConnected){r();return}i===t&&s()})}const kh='<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2.5l1.3 3.2 3.2 1.3-3.2 1.3L8 11.5 6.7 8.3 3.5 7l3.2-1.3z"/><path d="M12.5 11v3M11 12.5h3"/></svg>';function xh(t,e){const n=e.querySelector("[data-sve-help-tools]");if(!n||!sc(t)||n.querySelector("[data-sve-ghost-btn]"))return;const o=t.document.createElement("button");o.type="button",o.setAttribute("data-sve-help-btn",""),o.setAttribute("data-sve-ghost-btn",""),o.innerHTML=`<span>${kh}</span>`,o.addEventListener("mousedown",i=>i.preventDefault()),n.appendChild(o);const s=()=>{const i=no(t),l=h(t,i?"code_dock_ghost_on":"code_dock_ghost_off");o.setAttribute("aria-pressed",i?"true":"false"),o.title=l,o.setAttribute("aria-label",l)};o.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation(),ac(t,!no(t))}),s();const r=tr(i=>{if(!o.isConnected){r();return}i===t&&s()})}const _h={"data-sve-data-search":""},Sh=["placeholder","aria-label","onKeydown"],wh={key:0,"data-sve-data-empty":""},$h={key:1,"data-sve-data-empty":""},Ch=["data-cursor","title","onMouseenter","onClick"],Th={"data-sve-data-name":""},Ah={"data-sve-data-parent":""},Eh={key:0,"data-sve-data-value":""},Mh={__name:"CodeDockSnippets",props:{title:{type:String,default:""},placeholder:{type:String,default:""},emptyText:{type:String,default:""},loadingText:{type:String,default:""},loading:{type:Boolean,default:!1},rows:{type:Array,required:!0},saveLabel:{type:String,required:!0},onPick:{type:Function,required:!0},onSave:{type:Function,required:!0}},setup(t){const e=t,n=It(""),o=It(null),s=It(null),r=It(-1),i=It(!1),l=xe(()=>n.value.trim().toLowerCase()),c=xe(()=>{const v=l.value;return e.rows.filter(k=>!v||k.name.toLowerCase().includes(v)||String(k.hint||"").toLowerCase().includes(v))});Ka(()=>to(()=>o.value?.focus()));function d(v){return["html","css","js"].filter(k=>v[k]).map(k=>k.toUpperCase()).join(" · ")}function p(v){i.value=!0;const k=c.value.length;if(!k){r.value=-1;return}const M=r.value+v;r.value=M<0?-1:Math.min(M,k-1),to(()=>f())}function f(){const v=s.value?.querySelector("[data-cursor]"),k=s.value;if(!v||!k)return;const M=v.offsetTop,at=M+v.offsetHeight;M<k.scrollTop?k.scrollTop=M:at>k.scrollTop+k.clientHeight&&(k.scrollTop=at-k.clientHeight)}function m(v){i.value||(r.value=v)}function y(){const v=r.value>=0?c.value[r.value]:null;v&&e.onPick(v)}return(v,k)=>(_(),S(q,null,[b("div",_h,[k[8]||(k[8]=b("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[b("circle",{cx:"11",cy:"11",r:"7"}),b("path",{d:"m20 20-3.5-3.5"})],-1)),Ga(b("input",{ref_key:"input",ref:o,"data-sve-data-input":"","onUpdate:modelValue":k[0]||(k[0]=M=>n.value=M),type:"text",placeholder:t.placeholder,"aria-label":t.title,onInput:k[1]||(k[1]=M=>r.value=-1),onKeydown:[k[2]||(k[2]=Xt(F(M=>p(1),["prevent"]),["down"])),k[3]||(k[3]=Xt(F(M=>p(-1),["prevent"]),["up"])),Xt(F(y,["prevent"]),["enter"]),k[4]||(k[4]=Xt(F(()=>{},["stop"]),["escape"]))]},null,40,Sh),[[Xa,n.value]])]),t.loading?(_(),S("div",wh,A(t.loadingText),1)):c.value.length?W("",!0):(_(),S("div",$h,A(t.emptyText),1)),b("div",{ref_key:"rowsEl",ref:s,"data-sve-data-rows":"",onMousemove:k[5]||(k[5]=M=>i.value=!1)},[(_(!0),S(q,null,dt(c.value,(M,at)=>(_(),S("button",{key:M.name,type:"button","data-sve-data-option":"","data-cursor":at===r.value?"":void 0,title:M.hint||M.name,onMouseenter:L=>m(at),onClick:F(L=>t.onPick(M),["prevent","stop"])},[b("span",Th,A(M.name),1),b("span",Ah,A(d(M)),1),M.hint?(_(),S("span",Eh,A(M.hint),1)):W("",!0)],40,Ch))),128))],544),b("button",{type:"button","data-sve-snippet-save":"",onMousedown:k[6]||(k[6]=F(()=>{},["prevent"])),onClick:k[7]||(k[7]=F((...M)=>t.onSave&&t.onSave(...M),["prevent","stop"]))},A(t.saveLabel),33)],64))}},dn="    ";function Lh(t,e){if(t.startsWith("/*",e)){const n=t.indexOf("*/",e+2);return n===-1?t.length:n+2}return e}function yo(t){return String(t||"").replace(/\/\*[\s\S]*?\*\//g,"")}function un(t){const e=String(t||"").replace(/\r\n?/g,`
`).split(`
`);for(;e.length&&!e[0].trim();)e.shift();for(;e.length&&!e[e.length-1].trim();)e.pop();const n=e.filter(s=>s.trim()).map(s=>/^[ \t]*/.exec(s)[0].length),o=n.length?Math.min(...n):0;return e.map(s=>s.trim()?s.slice(o).replace(/\s+$/,""):"").join(`
`)}function ko(t,e){return un(t).split(`
`).map(n=>n?e+n:"").join(`
`)}function xo(t){const e=String(t||""),n=[];let o=0,s=0;const r=(i,l,c)=>{const d=e.slice(i,l),p=yo(d);if(!p.trim())return;const f=d.length-d.replace(/^[\s]*(?:\/\*[\s\S]*?\*\/\s*)*/,"").length,m=i+f,y=p.indexOf(":"),v=y===-1?"":p.slice(0,y).trim();if(/^-{0,2}[a-zA-Z_][\w-]*$/.test(v)){n.push({kind:"decl",prop:v,value:p.slice(y+1).trim(),from:m,to:c?l+1:l});return}n.push({kind:"other",from:m,to:c?l+1:l})};for(;o<e.length;){const i=Lh(e,o);if(i!==o){o=i;continue}const l=e[o];if(l==='"'||l==="'"){let c=o+1;for(;c<e.length&&e[c]!==l;)c+=e[c]==="\\"?2:1;o=c+1;continue}if(l===";"){r(s,o,!0),o+=1,s=o;continue}if(l==="{"){const c=_n(e,o);if(c===-1)break;const d=e.slice(s,o),p=d.length-d.replace(/^[\s]*(?:\/\*[\s\S]*?\*\/\s*)*/,"").length;n.push({kind:"block",prelude:yo(d).trim().replace(/\s+/g," "),from:s+p,open:o,close:c,to:c+1}),o=c+1,s=o;continue}o+=1}return r(s,e.length,!1),n}function Fh(t){return/^[&@]/.test(t)}function Bh(t){const e=String(t||"");if(!yo(e).trim())return{problem:"empty"};if(!Po(e))return{problem:"unbalanced"};const n=xo(e),o=n.filter(i=>i.kind==="block"),s=n.some(i=>i.kind!=="block"),r=o.filter(i=>!Fh(i.prelude));if(!r.length)return{body:un(e)};if(r.length===1&&o.length===1&&!s){const[i]=r;return{body:un(e.slice(i.open+1,i.close))}}return{problem:"rules"}}function Ph(t,e){return t.startsWith("--")||e.startsWith("--")?t===e:t.toLowerCase()===e.toLowerCase()}function Oh(t,e){const n=o=>o.replace(/\s+/g,"").toLowerCase();return n(t)===n(e)}function Oi(t,e){const n=t.lastIndexOf(`
`,e-1)+1;return(t.slice(n,e).match(/^[ \t]*/)||[""])[0]}function Ih(t,e,n){for(const o of e){const s=Oi(t,o.from);if(t.lastIndexOf(`
`,o.from-1)!==-1&&s.length>n.length)return s}return n+dn}function Ii(t,e,{parentIndent:n=""}={}){const o=String(t||""),s=xo(o),r=xo(String(e||"")),i=Ih(o,s,n),l=i.length>n.length?i.slice(n.length):dn,c=[],d=[],p=[];for(const L of r){if(L.kind==="decl"){const O=s.find(ve=>ve.kind==="decl"&&Ph(ve.prop,L.prop));O?c.push({from:O.from,to:O.to,insert:`${L.prop}: ${L.value};`}):d.push(`${L.prop}: ${L.value};`);continue}if(L.kind==="block"){const O=s.find(ta=>ta.kind==="block"&&Oh(ta.prelude,L.prelude)),ve=String(e).slice(L.open+1,L.close);O?c.push({from:O.open+1,to:O.close,insert:Ii(o.slice(O.open+1,O.close),ve,{parentIndent:Oi(o,O.from)})}):p.push(`${L.prelude} {
${ko(ve,i+l)}
${i}}`)}}if(!c.length&&!d.length&&!p.length)return o;const f=[...s].reverse().find(L=>L.kind==="decl"),m=s.find(L=>L.kind==="block"),y=s[s.length-1],v=d.map(L=>`
${i}${L}`).join(""),k=p.map(L=>`

${i}${L}`).join("");if(!y)c.push({from:0,to:0,insert:v?v+k:k.slice(1)});else{if(v)if(f)c.push({from:f.to,to:f.to,insert:v});else{const L=m||s[0],O=o.lastIndexOf(`
`,L.from-1)+1;c.push({from:O,to:O,insert:`${v.slice(1)}

`})}k&&c.push({from:y.to,to:y.to,insert:k})}c.sort((L,O)=>O.from-L.from||O.to-L.to);let M=o;for(const L of c)M=M.slice(0,L.from)+L.insert+M.slice(L.to);return`${M.match(/\n[ \t]*$/)?M.replace(/\s+$/,""):M.replace(/[ \t]+$/,"")}
${n}`}function Dh(t,{state:e="",media:n=""}={}){let o=un(t);return e&&(o=`&${e} {
${ko(o,dn)}
}`),n&&(o=`@media ${n} {
${ko(o,dn)}
}`),o}const ps="site.css",Di={"X-Requested-With":"XMLHttpRequest",Accept:"application/json"};async function jh(t){const e=await t.fetch(`/!/sve/site-css/file?path=${encodeURIComponent(ps)}&kind=css`,{credentials:"same-origin",headers:Di});if(!e.ok)throw new Error(String(e.status));return String((await e.json()).css||"")}async function Hh(t,e){const n=await t.fetch("/!/sve/site-css?kind=css",{method:"POST",credentials:"same-origin",headers:{...Di,"X-CSRF-TOKEN":vn(t),"Content-Type":"application/json"},body:JSON.stringify({path:ps,css:e})});if(!n.ok)throw new Error(String(n.status));return n.json()}function Rh(t){return[rc(t),...ic(t).map(e=>e.document)].filter(Boolean)}async function zh(t,e,n,o){const s=await e(t,n,o),r=new Set(dd(s));return o.filter(i=>r.has(i))}function tt(t,e,n,o){t.Statamic?.$toast?.[e]?.(h(t,n,o))}async function Nh(t,e,n){if(ud(e)){tt(t,"error","tw_utility_bad_name");return}let o;try{o=await jh(t)}catch{tt(t,"error","tw_utility_failed");return}if(fd(o).has(e)&&!t.confirm(h(t,"tw_utility_replace",{name:e})))return;const{compileDraft:s}=await bn(async()=>{const{compileDraft:m}=await import("./tw-compile-BqsL3ULf.js");return{compileDraft:m}},__vite__mapDeps([0,1]),import.meta.url),r=await zh(t,s,fa(o),n);if(!r.length){tt(t,"error","tw_utility_no_classes");return}const i=n.filter(m=>!r.includes(m)),l=pd(o,{[e]:`@apply ${r.join(" ")};`});let c="";try{c=await s(t,fa(l),[e])}catch(m){tt(t,"error","tw_utility_wont_compile",{reason:m?.message||String(m)});return}if(!c.trim()){tt(t,"error","tw_utility_wont_compile",{reason:h(t,"tw_utility_reason_empty")});return}const d=Rh(t);ua(d,[e],c);let p;try{p=await Hh(t,l)}catch{ua(d,[],""),tt(t,"error","tw_utility_failed");return}t.dispatchEvent(new CustomEvent("sve:site-css-saved",{detail:{path:ps}})),Zc(t,r,e);const f=p?.build;f?.ok&&f.css?d.forEach(m=>cd(m,f.css)):f&&tt(t,"error","tw_utility_not_built",{name:e,reason:h(t,`theme_utilities_reason_${f.reason||"error"}`)}),tt(t,"success",i.length?"tw_utility_saved_left":"tw_utility_saved",{name:e,names:i.join(" ")})}function Wh(t){if(!Xl(t,"site_css")){tt(t,"error","tw_utility_no_site_css");return}const e=Yc();if(!e){tt(t,"error","tw_utility_no_tag");return}if(!e.raws.length){tt(t,"error","tw_utility_no_classes");return}const n=Oo(t.document,mr,{heading:h(t,"tw_utility_new"),nameLabel:h(t,"snippet_name"),placeholder:h(t,"tw_utility_name_placeholder"),value:"",cancelLabel:h(t,"cancel"),saveLabel:h(t,"tw_utility_create"),onOk:o=>{n.dismiss(),Nh(t,String(o||"").trim(),e.raws)}})}const qh="/!/sve/snippets",ji="/!/sve/snippet",Vh='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>',Uh='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/></svg>',Kh={"X-Requested-With":"XMLHttpRequest",Accept:"application/json"};async function hs(t,e,n={}){const o=await t.fetch(e,{credentials:"same-origin",...n,headers:{...Kh,...n.headers||{}}});if(!o.ok){const s=new Error(String(o.status));throw s.status=o.status,s}return o.json()}async function Gh(t){const e=await hs(t,qh);return Array.isArray(e?.items)?e.items:[]}function Xh(t,e){return hs(t,`${ji}?name=${encodeURIComponent(e)}`)}function Yh(t,e){return hs(t,ji,{method:"POST",headers:{"X-CSRF-TOKEN":vn(t),"Content-Type":"application/json"},body:JSON.stringify(e)})}function Zh(t,e){return e==="css"?t.filter(n=>n.kind==="css"):t}function Jh(t){const e=g.html;if(!e||e.state.readOnly)return!1;const n=e.state.doc.lineAt(e.state.selection.main.head),o=n.text.trim()?J(n.text):he(e,n)||J(n.text),s=Sn(t.trim(),o);return Pn(s,s.length),j(),!0}function Hi(t,e,n){const o=g.css;if(!o||o.state.readOnly)return!1;const s=o.state.doc.toString(),r=Pe(s,e);if(!r)return!1;const i=a.cssSize?Dn(t,a.cssSize):null;let l="";if(i&&!i.base){const p=An(s,ht(t),i.handle).find(f=>f.from>r.brace&&f.to<=r.close);l=p?p.query:Ee(i,s)}const c=s.slice(r.brace+1,r.close),d=Ii(c,Dh(n,{state:me(),media:l}),{parentIndent:kt(s,r.from)});return d!==c&&o.dispatch({changes:{from:r.brace+1,to:r.close,insert:d}}),o.focus(),!0}function Qh(t,e){const n=t.document,o=n.getElementById(u),s=o?.querySelector('[data-sve-snippet-btn][data-sve-snippet-pane="css"]')||o?.querySelector("[data-sve-snippet-btn]");if(!s)return;w(n);const r=n.createElement("div");r.id=x,n.body.appendChild(r),z(t,s,r),r._sveApp=N(Mn,r,{label:h(t,"snippet_css_class_name"),placeholder:h(t,"code_dock_css_class_placeholder"),onClose:()=>w(n),onAdd:i=>{if(w(n),!Xr(i)){t.Statamic?.$toast?.error(h(t,"snippet_css_pick"));return}X(t),Hi(t,Ie(),e)}})}function tm(t,e){if(!g.css||g.css.state.readOnly||a.lastLocked)return;if(U(),a.cssPane!=="tree"&&a.cssPane!=="empty"){t.Statamic?.$toast?.error(h(t,"snippet_css_pick"));return}const n=Ie();if(!n){Qh(t,e);return}Hi(t,n,e)||t.Statamic?.$toast?.error(h(t,"snippet_css_pick"))}async function em(t,e){let n;try{n=await Xh(t,e)}catch{t.Statamic?.$toast?.error(h(t,"snippet_read_failed"));return}const o=typeof n?.html=="string"?n.html:"",s=typeof n?.css=="string"?n.css:"",r=typeof n?.js=="string"?n.js:"";if(n?.kind==="css"){tm(t,s);return}o.trim()&&Jh(o),(s.trim()||r.trim())&&bs(t,{css:s,js:r})}function ms(t){const e=t?.state.selection.main;if(!e||e.empty)return"";const n=t.state.doc.lineAt(e.from),o=n.text.slice(0,e.from-n.from).trim()===""?n.from:e.from;return t.state.doc.sliceString(o,e.to)}function nm(){const t=ms(g.css);let e=t,n=ao(t);if(!t.trim()){const s=g.css?.state.doc.toString()??"",r=a.cssPane==="tree"?Ie():"",i=r?Pe(s,r):null;e=i?s.slice(i.from,i.to):s,n=i?r:ao(s)}const o=Bh(e);return o.problem?{problem:o.problem}:{kind:"css",html:"",css:o.body,js:"",name:n}}function om(t){if(t==="css")return nm();const e=ms(g.html),n=String(it("dock:html")||""),o=String(it("dock:css")||"");if(e.trim()){const s=n.includes(e)?n.replace(e,""):n;return{kind:"html",html:ca(e),css:Jc(o,e,s).move.trim(),js:"",name:Pa(e)}}return{kind:"html",html:ca(n),css:o.trim(),js:String(it("dock:js")||"").trim(),name:Pa(n)}}function Pa(t){const e=String(t||"").match(/<([a-zA-Z][\w-]*)([^>]*)>/);if(!e)return"";const n=e[2].match(/\bclass="([^"]*)"/);return(n?n[1].split(/\s+/).find(s=>/^[a-zA-Z][\w-]*$/.test(s)):"")||e[1]}async function Ri(t,e,n,o=!1){try{const s=await Yh(t,{name:e,kind:n.kind,html:n.html,css:n.css,js:n.js,replace:o});t.Statamic?.$toast?.success(h(t,"snippet_saved",{name:s?.name||e}))}catch(s){if(s?.status===409&&!o){t.confirm(h(t,"snippet_replace",{name:e}))&&await Ri(t,e,n,!0);return}t.Statamic?.$toast?.error(h(t,"snippet_failed"))}}const sm={empty:"snippet_empty",unbalanced:"snippet_css_unbalanced",rules:"snippet_css_one_rule"};function am(t,e){const n=om(e);if(n.problem){t.Statamic?.$toast?.error(h(t,sm[n.problem]||"snippet_empty"));return}if(!n.html.trim()&&!n.css.trim()&&!n.js.trim()){t.Statamic?.$toast?.error(h(t,"snippet_empty"));return}const o=Oo(t.document,mr,{heading:h(t,"snippet_new"),nameLabel:h(t,"snippet_name"),placeholder:h(t,"snippet_name_placeholder"),value:n.name,cancelLabel:h(t,"cancel"),saveLabel:h(t,"snippet_create"),onOk:s=>{o.dismiss(),Ri(t,s,n)}})}function rm(t,e,n){const o=t.document;I(o),w(o),e.setAttribute("data-open","");const s=o.createElement("div");s.id=_t,s.setAttribute("data-sve-data-menu",""),o.body.appendChild(s);const r=!!ms(n==="css"?g.css:g.html).trim(),i=(l,c)=>{o.getElementById(_t)&&(s._sveApp?.unmount(),s._sveApp=N(Mh,s,{title:h(t,"code_dock_snippets"),placeholder:h(t,"code_dock_snippets_search"),emptyText:h(t,"snippet_none"),loadingText:h(t,"code_dock_loading"),loading:c,rows:l,saveLabel:h(t,r?"snippet_save_selection":"snippet_save"),onPick:d=>{I(o),em(t,d.name)},onSave:()=>{I(o),am(t,n)}}),jt(t,e,s))};i([],!0),Ss(t,e,s),Gh(t).then(l=>i(Zh(l,n),!1)).catch(()=>i([],!1))}function Oa(t,e,n,o){const s=t.createElement("span");return s.setAttribute("data-sve-snippet-face",o),s.innerHTML=e,s.appendChild(t.createTextNode(n)),s}function Ia(t,e,n,o){const s=e.querySelector(n);if(!s||s._sveBound)return;s._sveBound=!0;const r=t.document,i=qe(t,s,"data-sve-snippet-btn","",h(t,"code_dock_snippets"));i.setAttribute("data-sve-snippet-pane",o),i.removeAttribute("title"),i.removeAttribute("aria-label"),i.replaceChildren(Oa(r,Vh,h(t,"snippet_button"),o==="css"?"css":"html")),o==="css"&&i.appendChild(Oa(r,Uh,h(t,"tw_utility_button"),"tw")),i.addEventListener("click",l=>{if(l.preventDefault(),l.stopPropagation(),o==="css"&&a.styleMode==="tw"){I(r),Wh(t);return}if(i.hasAttribute("data-open")){I(r);return}rm(t,i,o)})}function im(t,e){Ia(t,e,"[data-sve-snippet-tools]","html"),Ia(t,e,"[data-sve-css-snippet-tools]","css")}const Da=new WeakSet;function lm(t,e){a.styleMode=e==="tw"?"tw":"css",G(t,Gs,a.styleMode),us(t)}function zi(t,e){if(e._sveStyleModeBound)return;e._sveStyleModeBound=!0,a.styleMode=rt(t,Gs)==="tw"?"tw":"css";const n=rt(t,Rn)||"";a.cssSize=Eo(t).some(o=>o.handle===n)?n:"",a.cssState=zn.includes(rt(t,cn))?rt(t,cn):"",a.cssValues=rt(t,Kn)==="1",e.querySelector("[data-sve-style-mode]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),lm(t,a.styleMode==="tw"?"css":"tw")}),e.querySelector("[data-sve-values-mode]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),Fi(t,!a.cssValues)}),e.querySelector("[data-sve-all]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),Pi(t)}),us(t),Hn(t),qt(t)}function Ni(t,e){const n=e.querySelector("[data-sve-css-tools]");if(!n||n._sveBound)return;n._sveBound=!0;const o=r=>e.querySelector(`[data-sve-css-tool="${r}"], [data-sve-css-kid="${r}"]`),s=r=>{const i=o(r.id),l=a.cssOpenMenu===r.id;if(w(t.document),l){ro(t),P(t);return}if(!i)return;const c=a.styleMode==="tw"?!r.twClass&&(!!r.tw||!!r.twGroup):!r.kind&&!r.value&&!(r.css in et())&&!!r.menu,d=()=>{c&&(a.cssOpenMenu=r.id)},p=()=>{a.cssOpenTool="",P(t)};if(a.styleMode==="tw"){ro(t),r.twClass?(Qc(t,r.twClass),P(t)):r.twGroup?(td(t,i,r.title,r.twGroup,p),d(),P(t)):r.tw&&(ed(t,i,r.tw,p),d(),P(t));return}if(r.kind==="flexDir"){pi(r.value);return}if(r.kind==="display"){hi(r.value);return}if(r.value){const f=H(et()[r.css])===H(r.value);Q([{property:r.css,value:f?null:r.value}]);return}if(r.css in et()){Q([{property:r.css,value:null}]),P(t);return}r.menu==="colors"?vi(t,i,r.css):r.menu==="spacing"?yi(t,i,r.css):r.menu==="sizes"?go(t,i,r.css,Rl):r.menu==="choices"?bi(t,i,r.css,r.choices):r.menu==="values"&&go(t,i,r.css),d(),P(t)};$t.onTool=r=>{const i=Me.get(r)?.tool;if(i){if(i.kids?.length){a.cssOpenTool=a.cssOpenTool===i.id?"":i.id,w(t.document),P(t);return}s(i)}},$t.onKid=(r,i)=>{const l=Me.get(i);l?.kid&&s(l.kid)},a.cssToolRow=()=>{Le(n,bu),P(t)},a.cssToolRow(),fs(n),gh(n,"[data-sve-css-kids]"),Da.has(t)||(Da.add(t),t.addEventListener(Yl,()=>nt(t))),t.document.addEventListener("mousedown",r=>{r.target.closest(`#${x}, [data-sve-css-tools], [data-sve-html-tools], [data-sve-css-add-class]`)||w(t.document)},!0)}function cm(t,e){const n=e.querySelector("[data-sve-html-tidy]");n&&(n.innerHTML=Sr.tidy||"",n.title=h(t,"code_dock_html_tidy"),n.setAttribute("aria-label",n.title),n.setAttribute("data-tip",n.title))}function Wi(t,e){const n=e.querySelector("[data-sve-html-tidy]");cm(t,e),!(!n||n._sveBound)&&(n._sveBound=!0,n.addEventListener("mousedown",o=>o.preventDefault()),n.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),rs()}))}function qi(t,e){const n=e.querySelector("[data-sve-html-tools]");!n||n._sveBound||(n._sveBound=!0,Le(n,fu,{tools:gn.map(o=>({...o,icon:Sr[o.id]||""})),onTool:o=>{const s=gn.find(i=>i.id===o),r=n.querySelector(`[data-sve-html-tool="${o}"]`);if(s){if(s.menu==="heading"){mo(t,r,Zs);return}if(s.menu==="text"){mo(t,r,lc);return}if(s.menu==="div"){oi(t,r);return}if(s.tidy){rs();return}if(s.menu==="component"){si(t,r);return}if(w(t.document),s.action==="pagination"){ni();return}if(s.snippet){Pn(s.snippet,s.caret??s.snippet.length,s.select),j();return}On(s.tag)}}}),fs(n),al(t,e),rl(t,e),yh(t,e),xh(t,e),sl(t,e),im(t,e))}let _e=null,ja=null;const dm=()=>(_e=_e||bn(()=>import("./help-editor-CkkuqpXP.js"),__vite__mapDeps([2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,1,18,19,20,21,22,23,24,25,26,27,28,29,30]),import.meta.url),_e);function um(t,e){if(!t||!e)return;const n=o=>o?dm().then(s=>s.enableHelp(t,e)):_e?_e.then(s=>s.disableHelp(e)):Promise.resolve();eo(t)&&n(!0),ja?.(),ja=Qa((o,s)=>{o===t&&n(s)})}let Se=null,Ha=null;const fm=()=>(Se=Se||bn(()=>import("./ghost-editor-DFm9dytd.js").then(t=>t.a),__vite__mapDeps([31,3,4,5,6,8,9,10,11,12]),import.meta.url),Se);function pm(t,e){if(!t||!e)return;const n=o=>o?fm().then(s=>s.enableGhost(t,e)):Se?Se.then(s=>s.disableGhost(e)):Promise.resolve();no(t)&&n(!0),Ha?.(),Ha=tr((o,s)=>{o===t&&n(s)})}E("dock:save-now",()=>(V(a.lastWin?.document),!0));let Ze=null;async function hm(t){const e=t.document;dl(e);let n=e.getElementById(u);if(n&&!(n.querySelector('[data-sve-css-chrome="subrow-2"]')&&n.querySelector("[data-sve-css-add-class]")&&n.querySelector("[data-sve-html-tools]")&&n.querySelector("[data-sve-html-tidy]")&&n.querySelector("[data-sve-data-vars]")&&n.querySelector("[data-sve-visual-edit-tools]")&&n.querySelector("[data-sve-help-tools]")&&n.querySelector("[data-sve-html-scope]")&&n.querySelector("[data-sve-code-lock]")&&n.querySelector("[data-sve-code-back]")&&n.querySelector("[data-sve-code-autosave]")&&n.querySelector("[data-sve-code-save]")&&n.getAttribute("data-sve-code-chrome")==="scope-9")){for(const s of ct)g[s]?.destroy(),g[s]=null;n.remove(),n=null}if(!n){n=e.createElement("div"),n.id=u,n.setAttribute("data-sve-code-chrome","scope-9"),Object.defineProperty(n,"__sveSavedCss",{get:()=>a.lastParts?.css??""}),dc(n,uc(t)),Le(n,lu,{htmlLabel:h(t,"code_dock_html"),cssLabel:h(t,"code_dock_css"),jsLabel:h(t,"code_dock_js"),alpineLabel:h(t,"code_dock_alpine"),treeIcon:Ys,dataIcon:El,dataLabel:h(t,"data_vars_title")}),so(e,n),So(n),Cs(n,ws(t)),vl(t,n),yl(t,n),bl(t,n),Ni(t,n),ri(t,n),zi(t,n),Li(t,n),Mi(t,n),fc(t,n),qi(t,n),fo(t,n),io(t,n),wo(t,n),lo(t,n);for(const o of ct){const s=n.querySelector(`[data-sve-code-pane="${o}"] [data-sve-code-host]`);Ai(s)}pc(t)}if(so(e,n),So(n),Wi(t,n),fo(t,n),io(t,n),wo(t,n),lo(t,n),fl(t),Wn(t),Tt(t),K(t),Wt(t),Z(t),We(t),zt(t),await xl(),!g.html){for(const o of ct){const s=n.querySelector(`[data-sve-code-pane="${o}"] [data-sve-code-host]`);s?.replaceChildren(),Ti(t,o,s)}for(const o of["html","css"])g[o]&&Pc(t,g[o],{onOpen:s=>es(t,s),emptyLabel:h(t,"code_dock_partials_empty"),openLabel:s=>h(t,"component_open_named",{name:s}),sectionValues:()=>Fn(t),isLocked:()=>ft(),setHover:(s,r)=>a.htmlPartialUi?.setHover(s,r)});bd(t,g.html,{onRename:o=>Yr(t,o),isLocked:()=>ft(),setHover:(o,s)=>a.htmlClassTokenUi?.setHover(o,s),title:h(t,"code_dock_css_rename_class")}),um(t,g.html),pm(t,g.html)}return n}function gs(t){return Ze||(Ze=hm(t).finally(()=>{Ze=null})),Ze}async function Ra(t,e){const n=await gs(t);a.lastType=e,a.lastLocked=!0,a.lockReady=!0,a.lastParts={html:"",css:"",js:""},fe(),Tt(t),Ft(a.lastParts,!0),Vn(t.document,e),R(t.document,h(t,"code_dock_missing")),K(t),Wt(t),Z(t),Nt(t,n)}let za=-1;async function Vi(t,e){if(za===a.loadGen&&!a.lastType&&t.document.getElementById(u))return;V(e);const n=++a.loadGen;za=n,a.lastType=null,a.typeStack=[],a.lastParts={html:"",css:"",js:""},a.lastProps=[],a.propsDirty=!1,a.lastLocked=!1,a.lockReady=!1,a.loadInFlight=null,Xo(),fe();const o=await gs(t);n===a.loadGen&&(Ft(a.lastParts,!0),qo(t),wn(t),Io(t),Vn(t.document,""),R(t.document,h(t,Zl(t,t.document)?"code_dock_pick_section":"code_dock_open_template")),Tt(t),K(t),Wt(t),Z(t),We(t),zt(t),Nt(t,o))}function Ui(t){return ne(t,a.lastType)||ne(t,a.typeStack[0])}function mm(t,e,n){if(n==="replace"){if(!ne(t,e)){a.beforePart=null;return}Ui(t)||(a.beforePart={type:a.lastType||"",uid:a.lastUid||"",stack:[...a.typeStack],onEmptyPage:!!a.onEmptyPage})}}function Ki(t,e){if(!Ui(t))return!1;const n=a.beforePart,o=n?.type||"",s=n?.stack[0]||o,r=!!(o&&n.uid&&Yi(t,e,n.uid)===s),i=!!(o&&o.startsWith("view:")&&s.startsWith("view:"));return a.beforePart=null,a.lastWin=t,V(e),!r&&!i?(a.lastUid=null,a.onEmptyPage=!0,Vi(t,e),!0):(a.lastUid=n.uid||null,a.onEmptyPage=n.onEmptyPage,Kt(t,o,"replace"),a.typeStack=[...n.stack],!0)}async function Kt(t,e,n="replace"){mm(t,e,n),n==="replace"?a.typeStack=[]:n==="push"&&a.lastType&&a.lastType!==e&&a.typeStack.push(a.lastType);const o=++a.loadGen;a.lastType=e,a.lockReady=!1,fe(),R(t.document,h(t,"code_dock_loading"));let s=()=>{};a.loadInFlight=new Promise(i=>{s=i}),wt(`dock loadTemplate ${e}: waiting for the dock`);const r=await gs(t);wt(`dock loadTemplate ${e}: dock ready, fetching`),Tt(t),K(t),Wt(t),Z(t),We(t),zt(t),Nt(t,r),t.fetch(`/!/sve/section-template?type=${encodeURIComponent(e)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async i=>{if(o!==a.loadGen)return;if(i.status===404){Ra(t,e);return}if(!i.ok)throw new Error(String(i.status));const l=await i.json();if(o!==a.loadGen){wt(`dock loadTemplate ${e}: overtaken (gen ${o}/${a.loadGen})`);return}wt(`dock loadTemplate ${e}: landed ${l.path||"-"}`),a.lastParts={html:typeof l.html=="string"?l.html:"",css:typeof l.css=="string"?l.css:"",js:typeof l.js=="string"?l.js:""},a.lastProps=Array.isArray(l.props)?l.props:[],a.propsDirty=!1,a.lastType=e,a.lastLocked=!!l.locked,a.lockReady=!0,Xo(),typeof l.tw=="string"&&l.tw!==""&&Yo(a.lastParts.html,l.tw),Tt(t),Ft(a.lastParts,a.lastLocked),Io(t),a.lastLocked||Zo(t,a.lastParts.html),Vn(t.document,l.path||e),R(t.document,a.lastLocked?h(t,"code_dock_locked"):""),l.writable?.template===!1?R(t.document,h(t,"code_dock_not_writable")):l.writable?.tw===!1&&R(t.document,h(t,"code_dock_tw_not_writable")),qo(t),cu(t),wn(t),K(t),Wt(t),Z(t),Nt(t,r)}).catch(i=>{wt(`dock loadTemplate ${e}: failed ${i?.message||i} (gen ${o}/${a.loadGen})`),o===a.loadGen&&(Ra(t,e),R(t.document,h(t,"code_dock_error")))}).finally(()=>{o===a.loadGen&&(a.loadInFlight=null),s()})}function mt(){return a.lastType||""}function vs(t){return!!t?.getElementById(u)}function ft(){return a.lastLocked}function bs(t,e){const n=typeof e?.html=="string"?e.html.trim():"",o=typeof e?.css=="string"?e.css.trim():"",s=typeof e?.js=="string"?e.js.trim():"";if(!n&&!o&&!s||!t?.document?.getElementById(u))return!1;let r=!1;return n&&(r=gm("html",n)||r),o&&(r=Na("css",o)||r),s&&(r=Na("js",s)||r),r&&X(t),r}function gm(t,e){const n=g[t];if(!n||n.state.readOnly)return!1;const o=n.state.selection.main,s=o.from>0?n.state.doc.sliceString(o.from-1,o.from):`
`,r=o.to<n.state.doc.length?n.state.doc.sliceString(o.to,o.to+1):`
`,c=`${s===`
`?"":`
`}${e}${r===`
`?"":`
`}`;return n.dispatch({changes:{from:o.from,to:o.to,insert:c},selection:{anchor:o.from+c.length}}),!0}function Na(t,e){const n=g[t];if(!n||n.state.readOnly)return!1;const o=n.state.doc.length,r=`${o>0&&n.state.doc.sliceString(Math.max(0,o-1),o)!==`
`?`

`:o?`
`:""}${e}
`;return n.dispatch({changes:{from:o,insert:r},selection:{anchor:o+r.length}}),!0}function Gi(t){if(Ce(t),!a.lastType||!t.document.getElementById(u))return;const e=a.lastType;a.lastType=null,Kt(t,e,"keep")}function ys(t){I(t),a.loadGen+=1,V(t),a.lastUid=null,a.lastType=null,a.typeStack=[],a.beforePart=null,a.lastParts={html:"",css:"",js:""},a.lastLocked=!1,a.lockReady=!1,a.lastBracketNames=null,a.lastCssSelectorNames=null,fe(),a.lastWin=t?.defaultView||a.lastWin,w(t),ur(t),xt(t),t?.getElementById(Y)?.remove();for(const n of ct)g[n]?.destroy(),g[n]=null;t?.getElementById(u)?.remove(),ul(),t&&qn(t,0);const e=t?.defaultView||a.lastWin;e?.document.getElementById(qa)&&Ja(e),e&&(qo(e),wn(e),Io(e))}function Xi(t){if(a.dragging)return;const e=t.document.getElementById(u);e&&(Wn(t),Nt(t,e))}function Yi(t,e,n){if(n){const r=na(n,e)||na(n,t.document)||n,i=oa(r,e)||oa(r,t.document);return oo(t,i).trim()}const o=typeof we=="function"?we(t):"page_sections",s=typeof ut=="function"?ut(t.document):[];for(const r of s){const l=(Ht(r.values)||r.values)?.[o];if(Array.isArray(l))for(const c of l){const d=oo(t,c).trim();if(d)return d}}return""}function vm(t,e,n){const o=t.Statamic?.$config?.get?.("sveChromeTemplates")||{},s=o[e]&&typeof o[e].type=="string"?o[e]:null,r=t.Statamic?.$config?.get?.("sveChromeStyles")||{},i=`${e}/${typeof r[e]=="string"&&r[e]!==""?r[e]:"style_1"}`,l=s?.type||i,c=n?.[`${e}_style`];return(!s||s.styled)&&typeof c=="string"&&c!==""?`${e}/${c}`:l}function bm(){const t=mt();if(!t)return"";if(t===Va)return"main";if(a.lastWin&&t===kn(a.lastWin))return"template";const e=t.match(/^(header|footer)\//);if(e)return e[1];const n=a.lastWin?.Statamic?.$config?.get?.("sveChromeTemplates")||{};return["header","footer"].find(o=>n[o]?.type===t)||""}function ym(t){const e=sr||ar;return e!=="header"&&e!=="footer"?"":Lo(t)||Fo(t)?e:""}function km(t,e){const n=sr||ar;return n!=="header"&&n!=="footer"||!Lo(e)&&!Fo(e)?"":vm(t,n,Ht(cc()?.values)||{})}function xm(t,e){if(!e||String(e).startsWith("view:")||ne(t,e))return!1;const n=typeof we=="function"?we(t):"page_sections",o=typeof ut=="function"?ut(t.document):[];for(const s of o){const i=(Ht(s.values)||s.values)?.[n];if(Array.isArray(i)&&i.some(l=>oo(t,l)===e))return!0}return!1}function _m(t){const e=or(t)||t.getElementById("__sve-global-section-host");return e&&e.querySelector("[data-replicator-set][data-type]")?.getAttribute("data-type")||""}function Sm(t,e,n){if(wt(`dock sync uid=${n||"-"} last=${a.lastUid||"-"}/${a.lastType||"-"}`),a.dragging)return;const o=!!(n&&n!==a.lastUid);if(n&&(a.lastUid=n),!t||!e||ll(e)||!er(t)||!nr(t)){e&&ys(e);return}const s=!n&&!!a.lastType&&a.lastType!==Va&&!Lo(e)&&!Fo(e)&&!or(e)&&!xm(t,a.lastType);if(s&&Ki(t,e))return;s&&(a.lastUid=null);const r=n||a.lastUid||"",i=km(t,e)||_m(e)||(r?Yi(t,e,r):"")||kn(t)||(!n&&!s?a.lastType:""),l=!i&&!n,c=l,d=i;if(a.onEmptyPage=l,a.lastWin=t,c){Vi(t,e);return}if(d){if(d===a.lastType&&e.getElementById(u)){wt("dock same type, dock open: nothing to do");return}if(a.typeStack.length&&a.lastType&&a.lastType!==d){const p=a.typeStack[0];if(d===p&&!o)return;a.typeStack=[]}V(e),wt(`dock loadTemplate ${d}`),Kt(t,d,"replace")}}yn("tw:changed",()=>{a.lastWin&&a.styleMode==="tw"&&P(a.lastWin)});E("dock:is-open",t=>vs(t));E("dock:is-locked",()=>ft());E("dock:html",()=>St());E("dock:reveal-html",({from:t,to:e,caret:n}={})=>{const o=g.html;if(!o||t==null)return;a.htmlScopePref=ce(a.lastWin),Mt(),U();const s=a.htmlFull.length,r=Math.max(0,Math.min(t,s)),i=Math.max(r,Math.min(e??t,s));a.htmlFocus=i>r?{from:r,to:i}:null,a.cssFocus=null,a.cssAll=!1;const l=n==null?null:Math.max(0,Math.min(n,s));if(a.htmlScopePref&&a.htmlFocus){De(l),K(a.lastWin);return}if(a.htmlScopeActive){Bn(!0,l),K(a.lastWin);return}o.dispatch({selection:l==null?{anchor:r,head:i}:{anchor:l},scrollIntoView:!0}),o.focus()});E("dock:insert-snippet",({win:t,parts:e})=>bs(t,e));E("dock:refresh",t=>Gi(t));E("dock:tw-follow",()=>{a.lastWin&&ge(a.lastWin)});E("dock:css",()=>(U(),a.cssFull));E("dock:set-css",t=>typeof t!="string"||ft()||!g.css||!a.lastWin?!1:(U(),a.cssFull=t,ue("css",is()),X(a.lastWin),!0));E("dock:js",()=>g.js?.state.doc.toString()??"");E("dock:set-js",t=>typeof t!="string"||ft()||!g.js||!a.lastWin?!1:(ue("js",t),X(a.lastWin),!0));E("dock:data-menu",({anchor:t,onPick:e,at:n,types:o,single:s}={})=>!t||!a.lastWin?!1:(I(a.lastWin.document),w(a.lastWin.document),xs(a.lastWin,t,e,n,o,s),!0));E("dock:data-model",({at:t}={})=>a.lastWin?el(a.lastWin,t):Promise.resolve(null));E("dock:props",()=>a.lastProps.map(t=>({...t})));E("dock:set-props",({win:t,props:e}={})=>!Array.isArray(e)||ft()?!1:(a.lastProps=e,a.propsDirty=!0,nd(Nn(mt())),V((t||a.lastWin)?.document),!0));function Nn(t){const e=/^view:partials\/(components\/[A-Za-z0-9_-]+)$/.exec(String(t||""));return e?e[1]:""}E("dock:component-src",()=>Nn(mt()));E("dock:type-stack",()=>a.typeStack.map(t=>({type:t,src:Nn(t)})));E("dock:component-exit-state",()=>{const t=Nn(mt());return{open:!!t,name:t?t.split("/").pop():"",back:a.typeStack.length>0}});E("dock:exit-component",(t=1)=>{if(!a.lastWin||!yr(mt()))return!1;if(a.typeStack.length){for(let e=Number(t)||1;e>1&&a.typeStack.length>1;e-=1)a.typeStack.pop();ns(a.lastWin)}else ys(a.lastWin.document);return!0});E("dock:current-type",()=>mt());E("dock:on-empty-page",()=>!!a.onEmptyPage);E("dock:current-uid",()=>a.lastUid);E("dock:leave-part",()=>{const t=a.lastWin;return t?(Ki(t,t.document),!0):!1});E("dock:chrome-kind",()=>bm());E("dock:collection-view",()=>a.lastWin?kn(a.lastWin):"");E("dock:chrome-open",t=>ym(t));E("dock:save-settled",()=>a.saveInFlight||null);E("dock:load-settled",()=>a.loadInFlight||null);E("dock:reset-data-vars",t=>(kd(typeof t=="string"&&t?t:void 0),!0));E("dock:refresh-preview",()=>a.lastWin?(Ce(a.lastWin),!0):!1);E("dock:open-file",t=>typeof t!="string"||!t||!a.lastWin?!1:(a.onEmptyPage=!1,t===a.lastType||(V(a.lastWin.document),Kt(a.lastWin,t,"replace")),!0));E("dock:open-template",t=>typeof t!="string"||!t||!a.lastWin?!1:(es(a.lastWin,t),!0));E("dock:set-html",t=>{const e=t&&typeof t=="object"?t:{},n=t&&typeof t=="object"?t.html:t;if(typeof n!="string"||ft())return!1;if(n!==""&&!pr(St(),n)){const i=a.lastWin;if(!(e?.unlock===!0&&i?.Statamic?.$permissions?.has?.("configure fields")===!0))return i?.Statamic?.$toast?.error(h(i,"html_tree_locked_element")),!1}const o=g.html;if(!o||!a.lastWin)return!1;if(n===""){a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null),a.twDirty=!1,a.twCss=null,a.twKey="",a.lastType=null,a.lastUid=null,a.lastParts={html:"",css:"",js:""},a.cssFull="",a.htmlFull="",a.applying=!0;try{fe();for(const i of ct){const l=g[i];if(!l)continue;const c=l.state.doc.toString();c!==""&&l.dispatch({changes:{from:0,to:c.length,insert:""}})}}finally{a.applying=!1}return!0}const s=a.htmlFull;if(a.htmlFull=n,a.htmlScopeActive)return a.htmlFocus=Zi(a.htmlFocus,s,n),Vt(ss()),X(a.lastWin),Mo("dock:html-changed"),!0;const r=o.state.doc.toString();if(r!==n){const[i,l,c]=Jo(r,n);o.dispatch({changes:{from:i,to:l,insert:c}})}return!0});E("dock:take-file",t=>{const e=t?.type,n=t?.parts,o=a.lastWin;if(typeof e!="string"||!e||!n||typeof n!="object"||!o||e!==a.lastType||!a.lockReady||a.lastLocked||a.saveTimer||a.saveInFlight||a.twBusy||a.twDirty)return!1;const s=l=>typeof l=="string"?l:"",r={html:s(n.html),css:s(n.css),js:s(n.js)};if(!se(He(),a.lastParts))return!1;if(se(r,a.lastParts))return!0;const i=a.htmlFull;return a.lastParts=r,a.propsDirty=!1,Yo(r.html,s(n.tw)),a.htmlScopeActive&&(a.htmlFocus=Zi(a.htmlFocus,i,r.html)),Ft(r,!1),R(o.document,""),Z(o),o.document.getElementById(u)?.dispatchEvent(new o.Event("input",{bubbles:!0})),!0});E("dock:show-empty",()=>it("dock:set-html",""));yn("row:removed",({parentPath:t,remaining:e,win:n})=>{e===0&&t===we(n)&&it("dock:show-empty")});function Zi(t,e,n){const o=n.length-e.length;if(!t||!o)return t;let s=0;for(;s<e.length&&s<n.length&&e[s]===n[s];)s+=1;return s>=t.to?t:s<t.from?{from:Math.max(0,t.from+o),to:Math.max(0,t.to+o)}:{from:t.from,to:Math.max(t.from,t.to+o)}}const _t="__sve-data-menu";let fn=null;function I(t){const e=t?.getElementById(_t);fn?.(),fn=null,e?._sveApp?.unmount(),e?.remove(),t?.querySelectorAll("[data-sve-data-vars][data-open], [data-sve-antlers-btn][data-open], [data-sve-visual-edit-btn][data-open], [data-sve-snippet-btn][data-open]").forEach(n=>n.removeAttribute("data-open"))}function Ji(t){if(!kn(t))return{view:"",kind:""};const e=typeof ut=="function"?ut(t.document):[];for(const n of e){const o=Ht(n.values)||n.values,s=typeof o?.source_collection=="string"?o.source_collection.trim():"";if(s)return{view:s,kind:String(o?.kind||"").trim()}}return{view:"",kind:""}}function wm(t,e){const n=St();if(Number.isFinite(e))return ia(n,e);const o=g.html;if(!o)return[];const s=a.htmlScopeActive&&a.htmlFocus?a.htmlFocus.from:0;return ia(n,s+o.state.selection.main.from)}function ks(t,e){const{view:n,kind:o}=Ji(t);return{collection:Do(t)||"",set:jo(mt()),view:n,kind:o,scope:yd(wm(t,e))}}function Qi(t){const{view:e,kind:n}=Ji(t),o={collection:Do(t)||"",set:jo(mt()),view:e,scope:""};return Oe(t,o).then(s=>Ro(s?.section||[],Fn(t)))}function tl(t,e){const n=ks(t,e);return n.scope?Oe(t,n).then(o=>(o?.scope?.groups||[]).flatMap(s=>Array.isArray(s.items)?s.items:[])):Promise.resolve([])}function $m(t){const e=typeof ut=="function"?ut(t.document):[];for(const n of e){const o=Ht(n.values)||n.values;if(o&&typeof o=="object")return o}return null}function _o(t,e){return{scope:e?.scope?.groups||[],section:Ro(e?.section||[],Fn(t)),page:Sd(e?.page||[],$m(t)),site:e?.site||[]}}function el(t,e){return Oe(t,ks(t,e)).then(n=>_o(t,n))}function nl(t){const e=t.state.selection.main,n=t.state.doc.lineAt(e.from),o=n.text.slice(0,e.from-n.from);return/(?:^|\s)(?::|x-bind:)[\w.:-]+\s*=\s*(["'])(?:(?!\1).)*$/.test(o)}function ol(t){const e=t.state.selection.main,n=t.state.doc.lineAt(e.from),o=n.text.slice(0,e.from-n.from);return/(?:^|\s)[\w.:@-]+\s*=\s*(["'])(?:(?!\1).)*$/.test(o)}function Cm(t,e){const n=g.html;if(!n||n.state.readOnly)return;if(nl(n)){const c=String(t?.var||"").trim(),d=n.state.selection.main;n.dispatch({changes:{from:d.from,to:d.to,insert:c},selection:{anchor:d.from+c.length}}),j();return}const o=wd(t,e,{inline:ol(n)});if(!o)return;const s=n.state.selection.main,r=n.state.doc.lineAt(s.from),i=J(r.text),l=Sn(o.text,i);n.dispatch({changes:{from:s.from,to:s.to,insert:l},selection:{anchor:s.from+o.cursor+(o.text.includes(`
`)?i.length:0)}}),e?.tab==="section"&&!t.parent&&!t.loop&&Tm(n,s.from,String(t.var)),j()}function Tm(t,e,n){const o=t.state.doc.toString(),s=Dd(o,e,n);if(s!==o){let r=0,i=0;for(;o[r]===s[r];)r+=1;for(;i<o.length-r&&i<s.length-r&&o[o.length-1-i]===s[s.length-1-i];)i+=1;t.dispatch({changes:{from:r,to:o.length-i,insert:s.slice(r,s.length-i)}})}}function jt(t,e,n){const o=e.getBoundingClientRect(),s=8,r=n.offsetWidth||368,i=n.offsetHeight||240,l=t.innerHeight-o.bottom-s,c=o.top-s,d=l>=i||l>=c?o.bottom+4:o.top-i-4;n.style.left=`${Math.max(s,Math.min(o.left,t.innerWidth-r-s))}px`,n.style.top=`${Math.max(s,Math.min(d,t.innerHeight-i-s))}px`}function xs(t,e,n,o,s,r=!1){const i=t.document;I(i),e.setAttribute("data-open","");const l=i.createElement("div");l.id=_t,l.setAttribute("data-sve-data-menu",""),i.body.appendChild(l);const c=ks(t,o),d=v=>[v?.scope?.groups?.length?{id:"scope",label:v.scope.label||h(t,"data_vars_tab_loop")}:null,{id:"section",label:h(t,"data_vars_tab_section")},{id:"page",label:h(t,"data_vars_tab_page")},{id:"site",label:h(t,"data_vars_tab_site")}].filter(Boolean),p=v=>{i.getElementById(_t)&&(l._sveApp?.unmount(),l._sveApp=N(wr,l,{title:h(t,"data_vars_title"),placeholder:h(t,"data_vars_placeholder"),emptyText:h(t,"data_vars_empty"),noSectionText:h(t,"data_vars_no_section"),loopText:h(t,"data_vars_loop"),tabs:d(v),data:s?od(_o(t,v),s,{single:r}):_o(t,v),onPick:(k,M)=>(s&&I(i),n?n(k,M):Cm(k,M))}),jt(t,e,l))};p($r(Ho(c))||{scope:null,section:[],page:[],site:[]}),Oe(t,c).then(p),jt(t,e,l);const f=()=>jt(t,e,l),m=v=>{!l.contains(v.target)&&!e.contains(v.target)&&I(i)},y=v=>{v.key==="Escape"&&I(i)};i.addEventListener("pointerdown",m,!0),i.addEventListener("keydown",y,!0),t.addEventListener("scroll",f,!0),t.addEventListener("resize",f),fn=()=>{i.removeEventListener("pointerdown",m,!0),i.removeEventListener("keydown",y,!0),t.removeEventListener("scroll",f,!0),t.removeEventListener("resize",f)}}function _s(t,e,{title:n,placeholder:o,tabs:s,data:r,onPick:i}){const l=t.document;I(l),w(l),e.setAttribute("data-open","");const c=l.createElement("div");c.id=_t,c.setAttribute("data-sve-data-menu",""),l.body.appendChild(c),c._sveApp=N(wr,c,{title:n,placeholder:o,emptyText:h(t,"data_vars_empty"),noSectionText:h(t,"data_vars_empty"),loopText:"",tabs:s,data:r,onPick:(d,p)=>{I(l),i(d,p)}}),jt(t,e,c),Ss(t,e,c)}function Ss(t,e,n){const o=t.document,s=()=>jt(t,e,n),r=l=>{!n.contains(l.target)&&!e.contains(l.target)&&I(o)},i=l=>{l.key==="Escape"&&I(o)};o.addEventListener("pointerdown",r,!0),o.addEventListener("keydown",i,!0),t.addEventListener("scroll",s,!0),t.addEventListener("resize",s),fn=()=>{o.removeEventListener("pointerdown",r,!0),o.removeEventListener("keydown",i,!0),t.removeEventListener("scroll",s,!0),t.removeEventListener("resize",s)}}const Am='<svg width="21" height="11" viewBox="0 0 150 77" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M69.999 55.827a13.8 13.8 0 0 0-.812-3.799 15.4 15.4 0 0 0-1.687-3.55 18.16 18.16 0 0 0-5.686-5.418 37.7 37.7 0 0 0 3.936-6.228 18.6 18.6 0 0 0 1.812-6.228 9.88 9.88 0 0 0-1.248-5.57 9.9 9.9 0 0 0-4.125-3.959 10.46 10.46 0 0 0-10.684 1.183 13.8 13.8 0 0 0-4.061 5.107 39 39 0 0 0-1.812 4.92 49.5 49.5 0 0 1-5.436-6.227 16.9 16.9 0 0 1-2.562-5.606 28.7 28.7 0 0 1-.624-6.85c.003-2-.357-3.983-1.063-5.855a10.66 10.66 0 0 0-4.56-5.231 13.9 13.9 0 0 0-10.684-1.37 10.13 10.13 0 0 0-4.94 2.755 10.1 10.1 0 0 0-2.683 4.967 24.4 24.4 0 0 0 0 10.214 22.4 22.4 0 0 0 3.374 7.35h-1.062a23 23 0 0 1-4.124 0 19.2 19.2 0 0 0-6.248 0 6.74 6.74 0 0 0-3.374 2.74 9.45 9.45 0 0 0-.75 9.341 11.23 11.23 0 0 0 5.811 6.228 25.1 25.1 0 0 0 10.622 1.495 17.9 17.9 0 0 0 9.809-3.425 104 104 0 0 1 10.496 7.162 22.4 22.4 0 0 1 5.249 6.54 15.5 15.5 0 0 1 1.437 5.106 35 35 0 0 0 1.437 6.789 13.2 13.2 0 0 0 4.373 5.73 15.6 15.6 0 0 0 10.372 2.802 9.9 9.9 0 0 0 5.429-1.987 9.84 9.84 0 0 0 3.38-4.677A61.6 61.6 0 0 0 70 55.827m-5.061 12.456a5.05 5.05 0 0 1-1.971 2.157 5.07 5.07 0 0 1-2.84.708 9.45 9.45 0 0 1-6.248-2.367 6.6 6.6 0 0 1-2.124-2.989 50 50 0 0 1-1.625-6.788 18.7 18.7 0 0 0-2.249-5.73 28.7 28.7 0 0 0-7.435-7.35A129 129 0 0 0 27.95 38.95c-.812-.498-2.686 0-2.749 0a14.03 14.03 0 0 1-7.872 1.62 19.5 19.5 0 0 1-7.935-2.056 4.86 4.86 0 0 1-2.375-2.49 3.35 3.35 0 0 1 0-2.99 1.18 1.18 0 0 1 .875-.748c1.25 0 2.687 0 3.936-.435a33 33 0 0 0 4.749-1.122 17.6 17.6 0 0 0 4.498-2.18 1.68 1.68 0 0 0 .838-1.68 1.7 1.7 0 0 0-.213-.624 2.2 2.2 0 0 0-.937-.747 18.65 18.65 0 0 1-2.812-7.35 19.5 19.5 0 0 1 .938-7.97 4.55 4.55 0 0 1 1.326-1.834 4.57 4.57 0 0 1 2.048-.97 7.52 7.52 0 0 1 5.498.997 5.12 5.12 0 0 1 2.499 3.488 87 87 0 0 0 1.874 10.587 22.4 22.4 0 0 0 4.436 6.789 78 78 0 0 0 8.372 7.286 1.8 1.8 0 0 0 1.188 1.246 2.005 2.005 0 0 0 2.499-1.308 33.4 33.4 0 0 1 3.249-6.54 8.8 8.8 0 0 1 2.811-2.677 4.63 4.63 0 0 1 4.561 0 4 4 0 0 1 1.612 1.494c.387.638.586 1.372.575 2.118a14.7 14.7 0 0 1-.75 5.792 36.6 36.6 0 0 1-2.561 6.228v.311a2.05 2.05 0 0 0 .5 2.74 13.6 13.6 0 0 1 3.248 4.92c.375.873.563 1.745.875 2.617s.937 2.678 1.312 4.048c1.625 5.916 2.5 7.536.875 10.961zM148.848 29.42a6.6 6.6 0 0 0-3.062-2.74 16.7 16.7 0 0 0-6.248 0c-1.227.09-2.459.09-3.686 0h-.937a24.2 24.2 0 0 0 3.186-7.536c.659-3.31.659-6.716 0-10.027a9.95 9.95 0 0 0-2.072-5.336 10 10 0 0 0-4.676-3.32 12.53 12.53 0 0 0-10.184 1.556 10.78 10.78 0 0 0-4.498 5.668 16.8 16.8 0 0 0-.875 5.667 32.7 32.7 0 0 1 0 6.602 17.2 17.2 0 0 1-2.499 5.543 52 52 0 0 1-4.748 5.792 32 32 0 0 0-1.5-4.547 14.4 14.4 0 0 0-3.811-5.231 9.522 9.522 0 0 0-10.56-.996 10.16 10.16 0 0 0-3.64 4.024 10.1 10.1 0 0 0-1.045 5.317c.21 2.156.78 4.26 1.687 6.228a38.3 38.3 0 0 0 3.748 6.228 17.5 17.5 0 0 0-5.435 5.668 15 15 0 0 0-1.562 3.55 18.3 18.3 0 0 0-.75 3.674v10.09c.068 1.417.32 2.82.75 4.172a9.46 9.46 0 0 0 3.062 4.609 9.5 9.5 0 0 0 5.123 2.118 14.1 14.1 0 0 0 9.871-2.927 12.76 12.76 0 0 0 4.124-5.792 34 34 0 0 0 1.562-6.727 17.6 17.6 0 0 1 1.375-5.107 21.1 21.1 0 0 1 4.623-6.228 83 83 0 0 1 8.935-7.349 16.34 16.34 0 0 0 8.997 3.301 22.24 22.24 0 0 0 9.746-1.557 10.777 10.777 0 0 0 5.499-6.228 9.88 9.88 0 0 0-.5-8.158m-5.623 6.229a4.43 4.43 0 0 1-2.062 2.553 16.16 16.16 0 0 1-7.06 2.18 11.7 11.7 0 0 1-7.123-1.869s-1.999-.81-2.812 0a123 123 0 0 0-11.558 7.038 26.9 26.9 0 0 0-6.811 7.224 79 79 0 0 0-3.623 12.456 6.23 6.23 0 0 1-2 3.052 7.88 7.88 0 0 1-5.373 2.305 4.63 4.63 0 0 1-2.523-.809 4.6 4.6 0 0 1-1.663-2.056 9.8 9.8 0 0 1-.812-3.488c.25-2.711.881-5.373 1.874-7.91.375-1.37.75-2.678 1.187-4.048s.438-1.806.812-2.616a13.26 13.26 0 0 1 2.937-5.044 2.054 2.054 0 0 0 .375-2.74 44 44 0 0 1-2.25-6.228 17.3 17.3 0 0 1-.687-5.792 4.22 4.22 0 0 1 1.937-3.675 3.57 3.57 0 0 1 3.811 0 8.3 8.3 0 0 1 2.625 2.678 40.5 40.5 0 0 1 3.061 6.228 1.93 1.93 0 0 0 1.664 1.441c.26.029.522.005.773-.07a1.82 1.82 0 0 0 1.187-1.309 80 80 0 0 0 7.872-7.411 22.5 22.5 0 0 0 3.999-6.664 75.4 75.4 0 0 0 1.749-10.525 5.17 5.17 0 0 1 1.937-3.176 5.76 5.76 0 0 1 4.749-.935 4.11 4.11 0 0 1 3.186 2.927c.751 2.609.985 5.338.687 8.035a19 19 0 0 1-2.561 7.473s-.625 0-.75.56a1.68 1.68 0 0 0 .5 2.367c1.27.908 2.657 1.641 4.123 2.18 1.468.49 2.972.865 4.499 1.121 1.125 0 2.374 0 3.561.436s.438.311.625.623c.235.52.351 1.087.341 1.657a3.9 3.9 0 0 1-.403 1.644z"/></svg>',Em='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 9 5 12 1.8-5.2L21 14Z"/><path d="M7.2 2.2 8 5.1"/><path d="m5.1 8-2.9-.8"/><path d="M14 4.1 12 6"/><path d="m6 12-1.9 2"/></svg>';function qe(t,e,n,o,s){const r=t.document.createElement("button");return r.type="button",r.setAttribute(n,""),r.title=s,r.setAttribute("aria-label",s),r.innerHTML=`<span>${o}</span>`,r.addEventListener("mousedown",i=>i.preventDefault()),e.replaceChildren(r),r}function Mm(t){return String(t||"").replace(/\|/g,"").split(`
`)[0].trim()}function sl(t,e){const n=e.querySelector("[data-sve-data-vars]");!n||n._sveBound||(n._sveBound=!0,n.addEventListener("mousedown",o=>o.preventDefault()),n.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),t.document.getElementById(_t)){I(t.document);return}w(t.document),xs(t,n)}))}function al(t,e){const n=e.querySelector("[data-sve-antlers-tools]");if(!n||n._sveBound)return;n._sveBound=!0;const o=qe(t,n,"data-sve-antlers-btn",Am,h(t,"code_dock_antlers"));o.addEventListener("click",s=>{if(s.preventDefault(),s.stopPropagation(),o.hasAttribute("data-open")){I(t.document);return}const r={};for(const i of da)r[i.id]=id.filter(l=>l.group===i.id).map(l=>({id:l.id,var:l.label,value:l.inline?"":Mm(l.snippet)}));_s(t,o,{title:h(t,"code_dock_antlers"),placeholder:h(t,"code_dock_antlers_search"),tabs:da.map(i=>({id:i.id,label:h(t,i.lang)})),data:r,onPick:i=>Lm(i.id)})})}function Lm(t){const e=ld(t),n=g.html;if(!e||!n||n.state.readOnly)return;const o=n.state.selection.main.head;if(e.inline){const c=e.snippet,d=n.state.selection.main;n.dispatch({changes:{from:d.from,to:d.to,insert:c},selection:{anchor:d.from+c.length}}),j();return}const s=n.state.doc.lineAt(o),r=s.text.trim()?J(s.text):he(n,s)||J(s.text),{text:i,cursor:l}=tn(e.snippet);oe(Sn(i,r),l),j()}function rl(t,e){const n=e.querySelector("[data-sve-visual-edit-tools]");if(!n||n._sveBound)return;n._sveBound=!0;const o=qe(t,n,"data-sve-visual-edit-btn",Em,h(t,"code_dock_visual_edit"));o.addEventListener("click",s=>{if(s.preventDefault(),s.stopPropagation(),o.hasAttribute("data-open")){I(t.document);return}const r={};for(const i of ma)r[i.id]=Or.filter(l=>l.group===i.id).map(l=>({id:l.id,var:l.label,value:l.attr?l.attr.replace(/\|/g,""):""}));_s(t,o,{title:h(t,"code_dock_visual_edit"),placeholder:h(t,"code_dock_visual_edit_search"),tabs:ma.map(i=>({id:i.id,label:h(t,i.lang)})),data:r,onPick:i=>Bm(i.id)})})}function Fm(t,e,n,o){if(Rd(n.inner,o.attr)){t.focus();return}const{text:s,cursor:r}=tn(o.attr);let i=n.closeIdx;for(;i>n.openIdx+2&&/\s/.test(e[i-1]);)i--;t.dispatch({changes:{from:i,to:n.closeIdx,insert:` ${s} `},selection:{anchor:i+1+r}}),j()}function Bm(t){const e=jd(t),n=g.html;if(!e||!n||n.state.readOnly)return;const o=n.state.doc.toString(),s=pe();if(s?.open){const f=Hd(o,s.open.from,s.open.to,Ke);if(f){e.attr?Fm(n,o,f,e):(n.dispatch({selection:{anchor:f.openIdx+2+Ke.length}}),n.focus());return}const m=s.open.from+1+s.name.length,y=e.standalone||`{{ ${Ke} ${e.attr} }}`,{text:v,cursor:k}=tn(y);n.dispatch({changes:{from:m,to:m,insert:` ${v}`},selection:{anchor:m+1+k}}),j();return}const r=n.state.selection.main.head,i=n.state.doc.lineAt(r),l=i.text.trim()?J(i.text):he(n,i)||J(i.text),c=e.standalone||`{{ ${Ke} ${e.attr} }}`,{text:d,cursor:p}=tn(c);oe(Sn(d,l),p),j()}function il(t){return t==="css"?Rs():t==="js"?zs():Hs({autoCloseTags:!0})}function So(t){if(t._sveShield)return;t._sveShield=!0;const e=n=>n.stopPropagation();for(const n of["keydown","keypress","keyup","pointerdown","pointerup","mousedown","mouseup","click","focusin"])t.addEventListener(n,e)}function ll(t){try{return new URLSearchParams(t.defaultView?.location?.search||"").has("sve-panel")}catch{return!1}}function Pm(t){const e=parseInt(rt(t,qs)??"",10);return Number.isFinite(e)&&e>=Xs?e:wl}function Om(t,e){G(t,qs,String(e))}function ws(t){try{const e=JSON.parse(rt(t,Vs)||"null");if(e&&typeof e=="object")return{html:e.html!==!1,css:e.css!==!1,js:e.js===!0,alpine:e.alpine===!0}}catch{}return{html:!0,css:!0,js:!1,alpine:!1}}function Im(t,e){G(t,Vs,JSON.stringify(e))}function cl(t){try{const e=JSON.parse(rt(t,Us)||"null");if(e&&typeof e=="object"){const n=s=>Number.isFinite(s)&&s>0?s:1,o={};for(const s of Et)o[s]=n(e[s]);return o}}catch{}return Object.fromEntries(Et.map(e=>[e,1]))}function Dm(t,e){G(t,Us,JSON.stringify(e))}function dl(t){Jl(t,Sl,`
@keyframes sve-cm-wait { to { transform: rotate(360deg); } }
#${u} {
  /* The tree's seven families, for the marks and the toolbar below. */
  ${hc("dark")}
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
  ${sa("ns")}
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
  /* Over the Tailwind pane's tag strip (tw-overlay.js) as well as the dock. */
  z-index: 99999;
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
  ${sa("ew")}
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
#${Ue} {
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
#${Ue} [data-sve-partial-choice] {
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
#${Ue} [data-sve-partial-choice]:hover {
  background: rgba(255,255,255,.1);
}
#${Ue} [data-sve-partial-empty] {
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
`)}function jm(t){const e=t.querySelector(".live-preview-editor");if(!e)return 0;const n=e.getBoundingClientRect();return n.width<40||n.right<40?0:Math.round(n.right)}function Hm(t){let e=0;for(const n of["__sve-section-picker","__sve-outline-panel","__sve-html-tree-panel","__sve-listview-panel","__sve-right-dock","__sve-chrome-designs","__sve-global-section-panel","__sve-ai-panel"]){const o=t.getElementById(n);if(!o||o.hasAttribute("data-sve-chrome-hidden")||o.hasAttribute("data-sve-right-closed")||o.style.display==="none")continue;const s=o.getBoundingClientRect();s.width>40&&s.right>t.documentElement.clientWidth-8&&(e=Math.max(e,Math.round(s.width)))}return e}function Wn(t){const e=t.document;if(a.layoutWin=t,typeof t.ResizeObserver!="function")return;a.layoutObserver||(a.layoutObserver=new t.ResizeObserver(()=>{a.layoutWin&&Xi(a.layoutWin)}));const n=e.querySelector(".live-preview-editor"),o=e.getElementById("__sve-right-dock");n!==a.observedEditor&&(a.observedEditor&&a.layoutObserver.unobserve(a.observedEditor),a.observedEditor=n,n&&a.layoutObserver.observe(n)),o!==a.observedRight&&(a.observedRight&&a.layoutObserver.unobserve(a.observedRight),a.observedRight=o,o&&a.layoutObserver.observe(o))}function ul(){a.layoutObserver?.disconnect(),a.layoutObserver=null,a.layoutWin=null,a.observedEditor=null,a.observedRight=null}function fl(t){a.layoutWatchBound||(a.layoutWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>Wn(t)))}function qn(t,e){const n=t.querySelector(".live-preview-contents");n&&(n.style.paddingBottom=e?`${e}px`:"")}function $s(t){if(!t)return;const e=t.clientHeight,n=t.querySelector("[data-sve-code-bar]"),o=t.querySelector("[data-sve-code-lock-banner]"),s=o&&Rm(t)?.getComputedStyle(o).display!=="none"?o.offsetHeight:0,r=Math.max(64,e-(n?.offsetHeight||0)-s),i=t.querySelector("[data-sve-code-panes]");i&&(i.style.height=`${r}px`,i.style.minHeight="0",i.style.overflow="hidden"),t.querySelectorAll("[data-sve-code-host]").forEach(l=>{const c=l.closest("[data-sve-code-pane]");if(!c||c.style.display==="none")return;let d=0;for(const f of c.children)f!==l&&(d+=f.offsetHeight);const p=Math.max(64,r-d);l.style.height=`${p}px`,l.style.maxHeight=`${p}px`,l.style.minHeight="0",l.style.overflow="auto",zm(l)})}function Rm(t){return t.ownerDocument?.defaultView||a.lastWin}function zm(t){t._sveWheelBound||(t._sveWheelBound=!0,t.addEventListener("wheel",e=>{const n=t.scrollHeight-t.clientHeight,o=t.scrollWidth-t.clientWidth;let s=!1;if(e.deltaY&&n>0){const r=Math.min(n,Math.max(0,t.scrollTop+e.deltaY));r!==t.scrollTop&&(t.scrollTop=r,s=!0)}if(e.deltaX&&o>0){const r=Math.min(o,Math.max(0,t.scrollLeft+e.deltaX));r!==t.scrollLeft&&(t.scrollLeft=r,s=!0)}s&&(e.preventDefault(),e.stopPropagation())},{passive:!1}))}function pl(){const t=(a.layoutWin||a.lastWin)?.document?.getElementById(u);t&&$s(t);for(const e of ct)g[e]?.requestMeasure()}function hl(t,e){const n=ws(t),o={};for(const s of Et){const r=e.querySelector(`[data-sve-code-pane-btn="${s}"]`);o[s]=r?r.getAttribute("aria-pressed")==="true":n[s]}return o}function Cs(t,e){for(const o of Et){const s=t.querySelector(`[data-sve-code-pane-btn="${o}"]`),r=t.querySelector(`[data-sve-code-pane="${o}"]`);s&&s.setAttribute("aria-pressed",e[o]?"true":"false"),r&&(r.style.display=e[o]?"flex":"none")}const n=Et.filter(o=>e[o]);t.querySelectorAll("[data-sve-code-split]").forEach(o=>{const s=o.getAttribute("data-sve-code-split-after"),r=n.indexOf(s);o.style.display=r>=0&&r<n.length-1?"block":"none"}),ml(t.ownerDocument.defaultView,t),$s(t)}function ml(t,e){const n=cl(t);for(const o of Et){const s=e.querySelector(`[data-sve-code-pane="${o}"]`);s&&(s.style.flex=`${n[o]} 1 0`)}}function Nt(t,e){if(a.dragging)return;const n=t.document;so(n,e);const o=Pm(t),s=jm(n),r=Hm(n);e.style.left=`${s}px`,e.style.right=`${r}px`,e.style.bottom="0",e.style.height=`${o}px`,qn(n,o),$s(e)}function gl(t,e,n,o){a.dragging=!0,mc(t,e,n,()=>{a.dragging=!1,o?.()},"data-sve-code-drag-shield")}function vl(t,e){if(e._sveResizeBound)return;e._sveResizeBound=!0;const n=o=>{if(o.button!==0||o.target.closest('button, a, input, select, textarea, label, [role="button"], [contenteditable], .cm-editor'))return;o.preventDefault();const s=o.clientY,r=e.getBoundingClientRect().height;let i=r;gl(t,"ns-resize",l=>{i=Math.min(Math.max(Xs,r+(s-l.clientY)),Math.round(t.innerHeight*.7)),e.style.height=`${i}px`,qn(t.document,i),pl()},()=>{Om(t,i),Nt(t,e),t.dispatchEvent(new Event("resize"))})};e.querySelector("[data-sve-code-bar]")?.addEventListener("mousedown",n),e.querySelector("[data-sve-code-grip]")?.addEventListener("mousedown",n)}function bl(t,e){e._sveSplitBound||(e._sveSplitBound=!0,e.querySelectorAll("[data-sve-code-split]").forEach(n=>{n.addEventListener("mousedown",o=>{if(o.button!==0)return;o.preventDefault(),o.stopPropagation();const s=n.getAttribute("data-sve-code-split-after"),r=Et.filter(k=>hl(t,e)[k]),i=r.indexOf(s),l=r[i],c=r[i+1];if(!l||!c)return;const d=e.querySelector(`[data-sve-code-pane="${l}"]`),p=e.querySelector(`[data-sve-code-pane="${c}"]`),f=o.clientX,m=d.getBoundingClientRect().width,y=p.getBoundingClientRect().width,v=m+y;n.setAttribute("data-active",""),gl(t,"col-resize",k=>{const M=k.clientX-f;let at=Math.max(Qe,Math.min(v-Qe,m+M)),L=v-at;v<Qe*2&&(at=m,L=y);const O=cl(t);O[l]=at,O[c]=L,Dm(t,O),ml(t,e),pl()},()=>{n.removeAttribute("data-active")})})}))}function yl(t,e){e._svePaneBound||(e._svePaneBound=!0,e.querySelectorAll("[data-sve-code-pane-btn]").forEach(n=>{n.addEventListener("click",o=>{o.stopPropagation();const s=n.getAttribute("data-sve-code-pane-btn"),r=hl(t,e),i={...r,[s]:!r[s]};!i.html&&!i.css&&!i.js&&(i[s]=!0),Im(t,i),Cs(e,i)})}))}function R(t,e){const n=t.getElementById(u)?.querySelector("[data-sve-code-status]");n&&(n.textContent=e||"")}function Vn(t,e){const n=t.getElementById(u)?.querySelector("[data-sve-code-path]");n&&(n.textContent=e||"",n.title=e||"")}function Wt(t){const e=t?.document?.getElementById(u)?.querySelector("[data-sve-code-back]");e&&(e.hidden=a.typeStack.length===0,e.title=h(t,"code_dock_back"),e.setAttribute("aria-label",e.title),e.innerHTML=Al)}function wo(t,e){const n=e.querySelector("[data-sve-code-back]");!n||n._sveBound||(n._sveBound=!0,n.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),ns(t)}))}let D,pn,Ts,As,Es,Pt,re,gt,Gt,vt,ot,Ms,Ls,Fs,Un,Bs,Ps,Os,Is,Ds,js,Qt,Hs,Rs,zs,Ns,hn,mn,Ws,kl,ye=null,T=null;function xl(){return ye||(ye=Wl().then(t=>{T=t,D=T.view.EditorView,pn=T.view.keymap,Ts=T.view.lineNumbers,As=T.view.highlightActiveLine,Es=T.view.highlightActiveLineGutter,Pt=T.state.Compartment,re=T.state.EditorState,gt=T.state.StateField,Gt=T.state.StateEffect,vt=T.state.RangeSetBuilder,ot=T.view.Decoration,Ms=T.commands.defaultKeymap,Ls=T.commands.indentWithTab,Fs=T.commands.historyKeymap,Un=T.commands.history,Bs=T.autocomplete.autocompletion,Ps=T.autocomplete.closeBrackets,Os=T.autocomplete.closeBracketsKeymap,Is=T.autocomplete.closeCompletion,Ds=T.autocomplete.completionKeymap,js=T.view.hoverTooltip,Qt=T.langHtml.htmlLanguage,Hs=T.langHtml.html,Rs=T.langCss.css,zs=T.langJs.javascript,T.language.HighlightStyle,T.language.syntaxHighlighting,Ns=T.language.codeFolding,hn=T.language.foldEffect,mn=T.language.unfoldEffect,Ws=T.language.foldedRanges,kl=T.highlight.tags,te.html=new Pt,te.css=new Pt,te.js=new Pt,ee.html=new Pt,ee.css=new Pt,ee.js=new Pt}).catch(t=>{throw ye=null,t}),ye)}const _l="{{ _class }}",u=zl,Sl="__sve-code-dock-style",Y="__sve-code-dock-unlock",qs="sve-code-dock-height",Vs="sve-code-dock-panes",Us="sve-code-dock-widths",Ve="sve-html-scope-v2",Ks="sve-code-dock-autosave",Gs="sve-code-dock-style-mode",Kn="sve-code-dock-values",wl=280,Xs=120,Qe=140,$l=250,ct=["html","css","js"],Et=["html","css","alpine","js"],Cl='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',Tl='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-1"/></svg>',Al='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',Ys='<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1c0 .966.784 1.75 1.75 1.75h.418A1.74 1.74 0 0 0 4 7.25v1.5c0 .49.201.932.525 1.25c-.324.318-.525.76-.525 1.25v1c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 14 12.25v-1c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1.5c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1A1.75 1.75 0 0 0 12.25 2zm8.5 7.5H8v-3h4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75M7 6.5v3H5.75A.75.75 0 0 1 5 8.75v-1.5a.75.75 0 0 1 .75-.75zm1 4h4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75H8zm-1 0V13H5.75a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-1-5V3h6.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75zm-1 0H3.75A.75.75 0 0 1 3 4.75v-1A.75.75 0 0 1 3.75 3H5z"/></svg>',El='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/><path d="M4.5 11.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/></svg>',Ml='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 16.3A8.5 8.5 0 1 1 18.3 6.3"/><path d="M21 3.2v5.4h-5.4"/></svg>',Ll='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',Fl='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',x="__sve-css-menu",Zs=["h1","h2","h3","h4","h5","h6"],$o=[{id:"div",classes:"",lang:"code_dock_div_plain"},{id:"flex",classes:"flex",lang:"code_dock_div_flex"},{id:"flex-col",classes:"flex flex-col",lang:"code_dock_div_flex_col"},{id:"flex-row",classes:"flex flex-row",lang:"code_dock_div_flex_row"},{id:"container",classes:"wrapper",lang:"code_dock_div_container"}],gn=[{id:"section",title:"section",tag:"section"},{id:"div",title:"div",menu:"div"},{id:"grid",title:"grid",snippet:`<div class="grid grid-cols-2 max-md:grid-cols-1">
    <div></div>
    <div></div>
</div>`,caret:59},{id:"heading",title:"heading",menu:"heading"},{id:"text",title:"text",menu:"text"},{id:"richtext",title:"rich text",snippet:`<div class="prose">
    <p></p>
</div>`,caret:27},{id:"a",title:"link",tag:"a"},{id:"button",title:"button",snippet:'<a href="" class="btn">Button</a>',caret:9},{id:"img",title:"image",snippet:'<img src="" alt="">',caret:10},{id:"gallery",title:"gallery",snippet:`<div class="grid grid-cols-3 gap-4">
    <img src="" alt="" class="w-full">
</div>`,caret:52},{id:"svg",title:"svg",snippet:'{{ svg src="" class="" }}',caret:12},{id:"video",title:"video",snippet:'<video src="" controls playsinline></video>',caret:12},{id:"ul",title:"list",tag:"ul"},{id:"li",title:"list item",tag:"li"},{id:"hr",title:"divider",snippet:"<hr>",caret:4},{id:"component",title:"component",menu:"component"},{id:"loop",title:"loop",snippet:`{{ items }}

{{ /items }}
`,caret:3,select:5},{id:"pagination",title:"pagination",action:"pagination"},{id:"if",title:"if",snippet:`{{ if true }}

{{ /if }}
`,caret:6,select:4}],Bl=["--size-100","--size-200","--size-300","--size-400","--size-500","--size-600","--size-700","--size-800","--size-900","--gutter"],Pl={"tw-text":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 13 5 3l3.5 10M2.7 10h4.6"/><path d="M12.5 3.5v9M11 5l1.5-1.5L14 5M11 11l1.5 1.5L14 11"/></svg>',"tw-leading":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h8.5M6 8h8.5M6 12.5h8.5"/><path d="M2.5 4.5v7M1.4 5.6 2.5 4.5l1.1 1.1M1.4 10.4l1.1 1.1 1.1-1.1"/></svg>',"tw-font":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.2V3h10v1.2M8 3v10M6 13h4"/></svg>',"tw-radius":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 13.5v-6a5 5 0 0 1 5-5h6"/><path d="M13.5 6.5v7h-7" stroke-dasharray="2 2"/></svg>',"tw-gap":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"tw-align":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3.5h12M2 8h8M2 12.5h10"/></svg>',"tw-w":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3.5v9M14 3.5v9"/><path d="M4.5 8h7"/><path d="M6 6.2 4.2 8 6 9.8M10 6.2 11.8 8 10 9.8"/></svg>',"tw-h":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 2h9M3.5 14h9"/><path d="M8 4.5v7"/><path d="M6.2 6 8 4.2 9.8 6M6.2 10 8 11.8 9.8 10"/></svg>',"tw-maxw":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3v10M14.5 3v10"/><path d="M5 8h6"/><path d="M6.6 6.2 4.8 8l1.8 1.8M9.4 6.2 11.2 8l-1.8 1.8"/></svg>',"tw-overflow":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="1.8" y="4.5" width="8.6" height="9.7" rx="1.2"/><path d="M6.5 1.8h7.7v7.7" stroke-linecap="round"/></svg>',"tw-border":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6"/><rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" stroke-width="1" opacity=".45"/></svg>',"tw-border-color":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6" stroke-dasharray="3.1 2.2"/><rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" fill="currentColor" stroke="none" opacity=".55"/></svg>'},Ol='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="10" width="18" height="11" rx="2"/><rect x="6" y="3" width="9" height="4" rx="1.4" fill="currentColor" stroke="none"/></svg>',Il='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.1 12a8.9 8.9 0 1 0 2.8-6.5L3 8"/><path d="M3 3.4V8h4.6"/><path d="M12 7.4V12l3 1.8"/></svg>',Dl='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>',jl='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></svg>',Hl='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/><path d="M3 17c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/></svg>',Js=[["--gray-50","#fafafa"],["--gray-100","#f5f5f5"],["--gray-200","#e5e5e5"],["--gray-300","#d4d4d4"],["--gray-400","#a3a3a3"],["--gray-500","#737373"],["--gray-600","#525252"],["--gray-700","#404040"],["--gray-800","#262626"],["--gray-900","#171717"],["--gray-950","#0a0a0a"]],Wa=t=>[{id:`${t}-all`,icon:"box-all",title:"All sides",css:t,tw:t,menu:"spacing"},{id:`${t}-block`,icon:"box-block",title:"Top and bottom",css:`${t}-block`,tw:`${t}-block`,menu:"spacing",sep:!0},{id:`${t}-block-start`,icon:"box-block-start",title:"Top",css:`${t}-block-start`,tw:`${t}-top`,menu:"spacing"},{id:`${t}-block-end`,icon:"box-block-end",title:"Bottom",css:`${t}-block-end`,tw:`${t}-bottom`,menu:"spacing"},{id:`${t}-inline`,icon:"box-inline",title:"Left and right",css:`${t}-inline`,tw:`${t}-inline`,menu:"spacing",sep:!0},{id:`${t}-inline-start`,icon:"box-inline-start",title:"Left",css:`${t}-inline-start`,tw:`${t}-left`,menu:"spacing"},{id:`${t}-inline-end`,icon:"box-inline-end",title:"Right",css:`${t}-inline-end`,tw:`${t}-right`,menu:"spacing"}],Nm=[{id:"display-flex",twClass:"flex",icon:"display-flex",title:"Flex",kind:"display",value:"flex",css:"display"},{id:"flex-row",twClass:"flex-row",icon:"flex-row",title:"Direction: row",kind:"flexDir",value:"row",css:"flex-direction",sep:!0},{id:"flex-col",twClass:"flex-col",icon:"flex-col",title:"Direction: column",kind:"flexDir",value:"column",css:"flex-direction"},{id:"justify-start",twClass:"justify-start",icon:"justify-start",title:"Justify: start",css:"justify-content",value:"flex-start",when:"flex",sep:!0},{id:"justify-center",twClass:"justify-center",icon:"justify-center",title:"Justify: center",css:"justify-content",value:"center",when:"flex"},{id:"justify-end",twClass:"justify-end",icon:"justify-end",title:"Justify: end",css:"justify-content",value:"flex-end",when:"flex"},{id:"justify-between",twClass:"justify-between",icon:"justify-between",title:"Justify: between",css:"justify-content",value:"space-between",when:"flex"},{id:"justify-around",twClass:"justify-around",icon:"justify-around",title:"Justify: around",css:"justify-content",value:"space-around",when:"flex"},{id:"align-start",twClass:"items-start",icon:"align-start",title:"Align: start",css:"align-items",value:"flex-start",when:"flex",sep:!0},{id:"align-center",twClass:"items-center",icon:"align-center",title:"Align: center",css:"align-items",value:"center",when:"flex"},{id:"align-end",twClass:"items-end",icon:"align-end",title:"Align: end",css:"align-items",value:"flex-end",when:"flex"},{id:"align-stretch",twClass:"items-stretch",icon:"align-stretch",title:"Align: stretch",css:"align-items",value:"stretch",when:"flex"}],Wm=[{id:"gap-all",icon:"gap-all",title:"Both",css:"gap",tw:"gap",menu:"spacing"},{id:"gap-row",icon:"gap-row",title:"Between rows",css:"row-gap",tw:"row-gap",menu:"spacing",sep:!0},{id:"gap-col",icon:"gap-col",title:"Between columns",css:"column-gap",tw:"column-gap",menu:"spacing"}],qm=["1px","2px","3px","4px","8px"],Ot=(t,e,n,o,s,r)=>({id:t,icon:e,title:n,css:o,menu:"choices",choices:qm,twGroup:[s,`${s}-2`,`${s}-4`,`${s}-8`],...r?{sep:!0}:{}}),Vm=[Ot("bw-all","bd-all","All sides","border-width","border"),Ot("bw-block","bd-block","Top and bottom","border-block-width","border-y",!0),Ot("bw-top","bd-top","Top","border-block-start-width","border-t"),Ot("bw-bottom","bd-bottom","Bottom","border-block-end-width","border-b"),Ot("bw-inline","bd-inline","Left and right","border-inline-width","border-x",!0),Ot("bw-left","bd-left","Left","border-inline-start-width","border-l"),Ot("bw-right","bd-right","Right","border-inline-end-width","border-r")],Um=[{id:"bd-all",icon:"bd-all",title:"All sides",css:"border-color",tw:"border-color",menu:"colors"},{id:"bd-block",icon:"bd-block",title:"Top and bottom",css:"border-block-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-top",icon:"bd-top",title:"Top",css:"border-block-start-color",tw:"border-top-color",menu:"colors"},{id:"bd-bottom",icon:"bd-bottom",title:"Bottom",css:"border-block-end-color",tw:"border-bottom-color",menu:"colors"},{id:"bd-inline",icon:"bd-inline",title:"Left and right",css:"border-inline-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-left",icon:"bd-left",title:"Left",css:"border-inline-start-color",tw:"border-left-color",menu:"colors"},{id:"bd-right",icon:"bd-right",title:"Right",css:"border-inline-end-color",tw:"border-right-color",menu:"colors"}],Km=[{id:"rd-all",icon:"rd-all",title:"All corners",css:"border-radius",tw:"border-radius",menu:"values"},{id:"rd-tl",icon:"rd-tl",title:"Top left",css:"border-start-start-radius",tw:"border-top-left-radius",menu:"values",sep:!0},{id:"rd-tr",icon:"rd-tr",title:"Top right",css:"border-start-end-radius",tw:"border-top-right-radius",menu:"values"},{id:"rd-br",icon:"rd-br",title:"Bottom right",css:"border-end-end-radius",tw:"border-bottom-right-radius",menu:"values"},{id:"rd-bl",icon:"rd-bl",title:"Bottom left",css:"border-end-start-radius",tw:"border-bottom-left-radius",menu:"values"}],Qs=[{id:"display",title:"Display",css:"display",tw:"display",kids:Nm},{id:"absolute",title:"Position",css:"position",tw:"position",value:"absolute"},{id:"color",title:"Text color",css:"color",tw:"color",menu:"colors"},{id:"bg",title:"Background color",css:"background-color",tw:"background-color",menu:"colors"},{id:"padding",title:"Padding",css:"padding",tw:"padding",kids:Wa("padding")},{id:"margin",title:"Margin",css:"margin",tw:"margin",kids:Wa("margin")},{id:"tw-text",title:"Font size",css:"font-size",tw:"font-size",menu:"values"},{id:"tw-leading",title:"Line height",css:"line-height",tw:"line-height",menu:"values"},{id:"tw-font",title:"Font family",css:"font-family",tw:"font-family",menu:"values"},{id:"tw-align",title:"Text align",css:"text-align",tw:"text-align",menu:"choices",choices:["left","center","right","justify"]},{id:"tw-border",title:"Border",css:"border-width",tw:"border-width",kids:Vm},{id:"tw-border-color",title:"Border color",css:"border-color",tw:"border-color",kids:Um},{id:"tw-radius",title:"Radius",css:"border-radius",tw:"border-radius",kids:Km},{id:"tw-gap",title:"Gap",css:"gap",tw:"gap",kids:Wm},{id:"tw-w",title:"Width",css:"width",tw:"width",menu:"sizes"},{id:"tw-h",title:"Height",css:"height",tw:"height",menu:"sizes"},{id:"tw-maxw",title:"Max width",css:"max-width",tw:"max-width",menu:"sizes"},{id:"tw-overflow",title:"Overflow",css:"overflow",tw:"overflow",menu:"choices",choices:["visible","hidden","clip","auto","scroll"]}],Rl=["100%","auto","fit-content","min-content","max-content","100vw","100dvh","0"],Me=new Map;for(const t of Qs){Me.set(t.id,{tool:t,kid:null});for(const e of t.kids||[])Me.set(e.id,{tool:t,kid:e})}const Co={display:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2.5" width="13" height="11" rx="1.2"/><path d="M5 6.5h6M5 9.5h4"/></svg>',"display-flex":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="3.4" height="9" rx=".4"/><rect x="6.3" y="3.5" width="3.4" height="9" rx=".4"/><rect x="10.6" y="3.5" width="3.4" height="9" rx=".4"/></svg>',"flex-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12"/><path d="M4.2 5.8 2 8l2.2 2.2"/><path d="M11.8 5.8 14 8l-2.2 2.2"/></svg>',"flex-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v12"/><path d="M5.8 4.2 8 2l2.2 2.2"/><path d="M5.8 11.8 8 14l2.2-2.2"/></svg>',"justify-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="5.4" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4.6" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="8.2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-between":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-around":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"align-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="5.4" width="9" height="2.4" rx=".4"/></svg>',"align-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="4.6" width="9" height="2.4" rx=".4"/><rect x="3.5" y="9" width="9" height="2.4" rx=".4"/></svg>',"align-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="8.2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="11.6" width="9" height="2.4" rx=".4"/></svg>',"align-stretch":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx=".5"/><rect x="9" y="2" width="4" height="12" rx=".5"/></svg>',absolute:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>',color:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.4 11.2 7.4 2.4l4 8.8"/><path d="M4.7 8.4h5.4"/><rect x="1.6" y="12.8" width="12.8" height="2.2" rx=".6" fill="currentColor" stroke="none"/></svg>',bg:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 1.9a6.1 6.1 0 1 0 0 12.2c.85 0 1.35-.55 1.35-1.25 0-.38-.18-.66-.4-.88a1.2 1.2 0 0 1 .85-2.05h1.3A3.5 3.5 0 0 0 14.1 6.1C14.1 3.75 11.4 1.9 8 1.9Z"/><circle cx="4.9" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="8" cy="4.8" r=".95" fill="currentColor" stroke="none"/><circle cx="11.1" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="4.7" cy="9.9" r=".95" fill="currentColor" stroke="none"/></svg>',padding:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/></svg>',margin:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/><path d="M2 2.5h12M2 13.5h12M2.5 2v12M13.5 2v12" stroke-dasharray="1.4 1.2"/></svg>',"box-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".4" fill="currentColor" stroke="none"/></svg>',"box-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"gap-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"gap-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="3" y="1.6" width="10" height="4.2" rx=".6"/><rect x="3" y="10.2" width="10" height="4.2" rx=".6"/><path d="M4.5 8h7"/></svg>',"gap-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"bd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4"/></svg>',"bd-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-top":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-bottom":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-left":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-right":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"rd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="3.4"/></svg>',"rd-tl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6H6a3.4 3.4 0 0 0-3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M2.6 9V6A3.4 3.4 0 0 1 6 2.6h3" stroke-width="2.2"/></svg>',"rd-tr":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6h7.4a3.4 3.4 0 0 1 3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M7 2.6h3A3.4 3.4 0 0 1 13.4 6v3" stroke-width="2.2"/></svg>',"rd-br":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6v7.4a3.4 3.4 0 0 1-3.4 3.4H2.6" stroke-width="1" opacity=".35"/><path d="M13.4 7v3a3.4 3.4 0 0 1-3.4 3.4H7" stroke-width="2.2"/></svg>',"rd-bl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6v7.4a3.4 3.4 0 0 0 3.4 3.4h7.4" stroke-width="1" opacity=".35"/><path d="M2.6 7v3A3.4 3.4 0 0 0 6 13.4h3" stroke-width="2.2"/></svg>'},g={html:null,css:null,js:null},te={html:null,css:null,js:null},ee={html:null,css:null,js:null},mg=Object.freeze(Object.defineProperty({__proto__:null,ARMED_KEY:gc,AUTOSAVE_ICON:Ml,AUTOSAVE_KEY:Ks,BACK_ICON:Al,CSS_ADD_ICON:Fl,CSS_GRAYS:Js,CSS_LENGTHS:Rl,CSS_MENU_ID:x,CSS_MODE_ICON:Dl,CSS_SIZE_KEY:Rn,CSS_SPACING:Bl,CSS_STATES:zn,CSS_STATE_KEY:cn,CSS_TOOLS:Qs,CSS_TOOL_ICONS:Co,CSS_TOOL_INDEX:Me,DATA_ICON:El,DATA_MENU_ID:_t,DEFAULT_HEIGHT:wl,DOCK_ID:u,get Decoration(){return ot},get EditorState(){return re},get EditorView(){return D},HANDLES:ct,HEIGHT_KEY:qs,HISTORY_ICON:Il,HTML_DIVS:$o,HTML_HEADINGS:Zs,HTML_TOOLS:gn,ID_MODE_ICON:jl,LOCK_CLOSED_ICON:Cl,LOCK_OPEN_ICON:Tl,MIN_HEIGHT:Xs,MIN_PANE:Qe,PANES:Et,PANES_KEY:Vs,get RangeSetBuilder(){return vt},SAVE_ICON:Ll,SAVE_MS:$l,SCOPE_CLASS:_l,SCOPE_ICON:Ys,SCOPE_KEY:Ve,STRIP_ICON:Ol,STYLE_ID:Sl,STYLE_MODE_KEY:Gs,get StateEffect(){return Gt},get StateField(){return gt},TW_MODE_ICON:Hl,TW_TOOL_ICONS:Pl,UNLOCK_ID:Y,VALUES_MODE_KEY:Kn,WIDTHS_KEY:Us,addClassButton:If,addClassToPickedTag:Xr,applyCssFolds:Ut,applyCssScope:pt,applyDisplay:hi,applyFlexDirection:pi,applyHtmlTag:On,applyRuleDecls:Q,applyStyleMode:us,get autocompletion(){return Bs},autosaveEnabled:Ln,bindAntlersSnippets:al,bindAutosave:lo,bindBack:wo,bindCssAddClass:ri,bindCssTools:Ni,bindDataVars:sl,bindHistory:Li,bindHtmlScope:fo,bindHtmlTidy:Wi,bindHtmlTools:qi,bindLayoutWatch:fl,bindLock:io,bindPaneToggles:yl,bindResize:vl,bindSplitters:bl,bindStrip:Mi,bindStyleMode:zi,bindVisualEditSnippets:rl,clearCssFocus:kf,clearHtmlScopeRange:fe,get closeBrackets(){return Ps},get closeBracketsKeymap(){return Os},closeCodeDock:ys,closeCodeDockPopups:qf,get closeCompletion(){return Is},closeCssMenu:w,closeCssMenuPicked:ae,closeDataMenu:I,get cm(){return T},codeDockStyleMode:uh,get codeFolding(){return Ns},get completionKeymap(){return Ds},get css(){return Rs},cssEditorText:is,cssPaneRoot:Ie,cssRuleAtCursor:Re,cssSizeRow:Dn,cssSizeRows:ht,cssStateSuffix:me,currentFlexDecls:et,currentFullHtml:St,currentSectionValues:Fn,currentTemplateType:mt,dataVarsModelAt:el,get defaultKeymap(){return Ms},dispatchHtmlChanges:yt,editableOf:ee,editors:g,ensureStyle:dl,ensureTwCss:Zo,enterValuesRule:ds,finishHtmlEdit:j,flushBracketSync:Ur,flushCssScope:U,flushCssToHtml:Kr,flushSave:V,get foldEffect(){return hn},get foldedRanges(){return Ws},goBackTemplate:ns,get highlightActiveLine(){return As},get highlightActiveLineGutter(){return Es},get history(){return Un},get historyKeymap(){return Fs},hookDataMenu:Ss,get hoverTooltip(){return js},get html(){return Hs},htmlEditorText:ss,htmlElementAtCursor:pe,htmlFocusOk:At,get htmlLanguage(){return Qt},htmlScopeEnabled:ce,htmlTargetFromCursor:Bt,inAttributeValue:ol,inDynamicAttribute:nl,indentFromPrevious:he,get indentWithTab(){return Ls},insertAiSnippet:bs,insertHtmlElement:Pn,insertHtmlSnippet:oe,isChromeTemplateType:ne,isCodeDockArmed:nr,isCodeDockLocked:ft,isCodeDockOpen:vs,isPanelFrame:ll,get javascript(){return zs},get keymap(){return pn},languageOf:il,leadingCssIndent:kt,lineIndentOf:J,get lineNumbers(){return Ts},loadCm:xl,loadTemplate:Kt,mergedCssFull:on,mountEditor:Ti,newSizeBlockSpot:cs,newSizeQuery:Ee,normalizeFlexValue:H,observeDockLayout:Wn,onEditorInput:X,openAddClass:ai,openCssChoiceMenu:bi,openCssColorMenu:vi,openCssSpacingMenu:yi,openCssValueMenu:go,openDataVarsMenu:xs,openHtmlComponentMenu:si,openHtmlDivMenu:oi,openHtmlTagMenu:mo,openNestedTemplate:es,openPickerMenu:_s,openRenameClassMenu:Yr,paintAlpine:Ne,paintAutosave:Z,paintBack:Wt,paintCssHead:nt,paintCssIdMark:In,paintCssToolState:P,paintHostWait:Ai,paintHtmlScope:K,paintHtmlToolState:je,paintLock:Tt,paintPaneButtons:Cs,paintStrip:zt,paintStyleMode:We,paintValuesMode:Hn,pickHtmlTagAtCursor:Qr,pickerButton:qe,placeCssMenu:z,placeDataMenu:jt,placeDock:Nt,previewBottomPad:qn,primeTailwindCompile:Yo,readOnlyOf:te,readParts:He,refreshCodeDockFromDisk:Gi,refreshPreview:Ce,relayoutCodeDock:Xi,rememberBracketNames:de,rememberCssSelectors:Lt,resetTailwindCompile:Xo,sameParts:se,scopeDataRows:tl,sectionDataRows:Qi,setAll:Bi,setCodeDockArmed:vc,setHtmlAll:uo,setPath:Vn,setStatus:R,setValuesMode:Fi,shieldDock:So,showHtmlFull:Bn,showHtmlScope:De,stopObservingDockLayout:ul,storedPanes:ws,syncCodeDock:Sm,syncHtmlTree:sn,syncScopedHtml:Mt,syncTwTarget:ge,get tags(){return kl},templateDockAllowed:er,tidyHtmlPane:rs,toggleAll:Pi,toggleHtmlPagination:ni,get unfoldEffect(){return mn},writeHandleEditor:ue,writeHtmlEditor:Vt,writeParts:Ft},Symbol.toStringTag,{value:"Module"}));export{rg as A,ai as B,Co as C,j as D,mt as E,jo as F,pe as G,Zs as H,tl as I,mg as J,Pl as T,Ke as V,ig as a,cg as b,Qs as c,$o as d,gn as e,wd as f,Mr as g,Md as h,ug as i,dg as j,No as k,pg as l,hg as m,Wo as n,lg as o,Rd as p,Hd as q,Ar as r,fg as s,T as t,a as u,Qi as v,ha as w,St as x,Kp as y,If as z};
