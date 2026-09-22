const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-C_hT6KCx.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{o as k,a as S,b as v,t as M,k as jr,l as mt,s as Io,p as be,F as N,d as ct,w as B,f as Oo,r as ln,u as $,q as Re,g as X,_ as Po,n as Nr,v as Wn,x as Wr,y as qr,z as Vr,A as qn,B as Ur,D as G,E as j,h as m,j as Kr,C as Gr,i as Do,G as Xr,H as Vn,I as Zr,J as z,K as ot,L as Un,M as Yr,m as P,O as cn,P as zo,Q as Jr,R as Qr,S as Ho,T as dn,U as ta,V as Ut,W as un,X as ea,Y as na,Z as oa,$ as sa,a0 as fn,a1 as hn,a2 as Ro,a3 as ra,a4 as Kn,a5 as je,a6 as gt,a7 as aa,a8 as ia,a9 as la,aa as Ue,ab as ca,ac as da,ad as jo,ae as No,af as C,ag as ua,ah as fa,ai as Gn,aj as ha,ak as pa}from"./addon-CAzVZsSh.js";import{al as ff,am as hf}from"./addon-CAzVZsSh.js";import{v as ma,l as ga}from"./codemirror-DYn8t4GR.js";import{p as xe,f as Wo,h as va,t as qo,c as ya,a as Vo,b as ba,d as xa,e as ka,g as Sa,i as Xn,j as _a,k as wa,l as Uo,m as $a,n as Ca,o as Aa,q as Ta,s as Ma,r as Ko,u as Ea,v as Ke,w as La,H as Go,x as Ba,y as Fa,z as Xo,A as Ia,B as Oa,_ as Zo,C as Zn,P as oe}from"./tw-classes-BTM8tsLo.js";import{t as Pa}from"./tw-candidates-wYTeDvRv.js";import{h as Da,a as za,e as Ha,A as Yn,b as Ra,i as pn,c as ja,d as de}from"./html-tag-sync-Cw8-lxeX.js";import{M as Yo,S as Jo}from"./protocol-BzWs6Y7c.js";import"./ai-text-icon-B7uCWIwa.js";import"./index-Dpuj8sxX.js";import"./index-B5fiB6ig.js";import"./index-QkwZ_wP2.js";import"./index-CY0AOW5Y.js";import"./index-gYg9gdv3.js";import"./index-lzvKgifK.js";import"./index-BBw1nzv2.js";import"./index-DqbOpr3Y.js";import"./index-C_pm8ee_.js";import"./index-B8kpdD8S.js";const Qo=/^\.[a-zA-Z_][\w-]*$/;function mn(t){const e=String(t||""),n=/(^|\s)\[/g;let o;for(;o=n.exec(e);){const s=o.index+o[1].length,r=/\](?=\s|$)/g;r.lastIndex=s+1;const i=r.exec(e);if(i)return{from:s,to:i.index+1,innerFrom:s+1,innerTo:i.index}}return null}function ts(t){const e=String(t||""),n=mn(e);return n?e.slice(n.innerFrom,n.innerTo).replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).filter(o=>/^[a-zA-Z_][\w-]*$/.test(o)):[]}function es(t){const e=String(t||"").match(/\sclass\s*=\s*(["'])([^"']*)\1/i);return e?ts(e[2]):[]}function Na(t){return es(t)[0]||""}function ke(t){const e=String(t||""),n=[],o=/\sclass\s*=\s*(["'])/gi;let s;for(;s=o.exec(e);){const r=s[1],i=s.index+s[0].length,l=e.indexOf(r,i);if(l===-1)break;const c=e.slice(i,l),d=mn(c);if(d){const f=c.slice(d.innerFrom,d.innerTo),h=i+d.innerFrom,p=f.replace(/\{\{[\s\S]*?\}\}/g,E=>" ".repeat(E.length)),y=/[a-zA-Z_][\w-]*/g;let b;for(;b=y.exec(p);)n.push({name:b[0],from:h+b.index,to:h+b.index+b[0].length})}o.lastIndex=l+1}return n}function Jn(t,e){return ke(t).find(n=>e>=n.from&&e<=n.to)||null}function Qn(t,e){const n=String(t||""),o=ke(n);let s=n;for(let r=o.length-1;r>=0;r-=1){const i=o[r],l=e(i.name);if(l!==i.name){if(!l){let c=i.from,d=i.to;s[d]===" "?d+=1:c>0&&s[c-1]===" "&&(c-=1),s=s.slice(0,c)+s.slice(d);continue}s=s.slice(0,i.from)+l+s.slice(i.to)}}return s}function ns(t){const e=[],n=/(^|[^\w-])\.([a-zA-Z_][\w-]*)\s*\{/g;let o;for(;o=n.exec(String(t||""));)e.push(o[2]);return e}function os(t,e){const n=[],o=[],s=[];let r=0,i=0;for(;r<t.length&&i<e.length;){if(t[r]===e[i]){r+=1,i+=1;continue}const l=e.indexOf(t[r],i),c=t.indexOf(e[i],r);l===-1&&c===-1?(n.push({from:t[r],to:e[i]}),r+=1,i+=1):l===-1?(s.push(t[r]),r+=1):c===-1||l<=c?(o.push(e[i]),i+=1):(s.push(t[r]),r+=1)}for(;r<t.length;)s.push(t[r]),r+=1;for(;i<e.length;)o.push(e[i]),i+=1;return{renamed:n,added:o,removed:s}}function vt(t){let e=String(t||"").trim().replace(/^\.+/,"").replace(/\s+/g,"-").replace(/[^a-zA-Z0-9_-]/g,"");return/^[a-zA-Z_]/.test(e)||(e=e.replace(/^[^a-zA-Z_]+/,"")),Qo.test(`.${e}`)?e:""}function Wa(t,e){const n=String(t||""),o=vt(e);if(!n||!o)return n;const s=n.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(s){const r=s[1];let i=s[2];const l=mn(i);if(l){const c=i.slice(l.innerFrom,l.innerTo).trim(),f=ts(i).includes(o)?c:`${c} ${o}`.trim();i=`${i.slice(0,l.from)}[ ${f} ]${i.slice(l.to)}`}else i=`[ ${o} ] ${i}`.trim();return n.slice(0,s.index)+` class=${r}${i}${r}`+n.slice(s.index+s[0].length)}return/\/\s*>$/.test(n)?n.replace(/(\s*)(\/\s*>)$/,` class="[ ${o} ]"$1$2`):n.replace(/(\s*)>$/,` class="[ ${o} ]"$1>`)}function qa(t,e){const n=String(t).indexOf(">",e.from);return n===-1?"":t.slice(e.from,n+1)}function ss(t,e){const n=[];for(const o of e){const s=es(qa(t,o)),r=ss(t,o.children||[]);if(s.length){n.push({className:s[0],children:r});for(const i of s.slice(1))n.push({className:i,children:[]})}else n.push(...r)}return n}function Se(t){return ss(t,xe(t))}function ue(t){return String(t).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function gn(t,e){if(t.startsWith("/*",e)){const n=t.indexOf("*/",e+2);return n===-1?t.length:n+2}return e}function Tt(t,e){let n=0;for(let o=e;o<t.length;o+=1){if(t.startsWith("/*",o)){o=gn(t,o)-1;continue}if(t[o]==="{")n+=1;else if(t[o]==="}"&&(n-=1,n===0))return o}return-1}function U(t,e){const n=String(t||""),o=new RegExp(`(^|[^\\w-])\\.${ue(e)}\\s*\\{`,"g");let s;for(;s=o.exec(n);){const r=s.index+s[1].length,i=n.indexOf("{",r);if(i===-1)continue;const l=Tt(n,i);if(l!==-1)return{from:r,brace:i,close:l,to:l+1,name:e}}return null}function Va(t){const e=String(t||""),n=[],o={},s=[];let r=0,i="";const l=()=>{const c=i.trim();c&&n.push(c),i=""};for(;r<e.length;){if(e.startsWith("/*",r)){const c=gn(e,r);i+=e.slice(r,c),r=c;continue}if(e[r]==="{"){const c=i.trim(),d=Tt(e,r);if(d===-1)break;const f=e.slice(r+1,d);i="",Qo.test(c)?o[c.slice(1)]=f:c&&s.push(`${c} {${f}}`),r=d+1;continue}i+=e[r],r+=1}return l(),{decls:n.join(`
`),classes:o,other:s}}function to(t,e){const n="    ".repeat(e);return String(t||"").split(`
`).map(o=>o.trim()?n+o.trim():"").filter((o,s,r)=>o||s>0&&s<r.length-1).join(`
`)}function Ua(t,e){const n=U(t,e);return n?String(t).slice(n.brace+1,n.close):""}function rs(t,e,n){const o=Va(Ua(e,t.className)),s="    ".repeat(n),r=[];o.decls&&r.push(to(o.decls.replace(/;+\s*$/,";"),n+1));for(const l of o.other)r.push(to(l,n+1));for(const l of t.children)r.push(rs(l,e,n+1));const i=r.filter(Boolean).join(`
`);return i?`${s}.${t.className} {
${i}
${s}}`:`${s}.${t.className} {
${s}}`}function vn(t,e){return e?.length?e.map(n=>rs(n,t,0)).join(`

`)+`
`:""}function as(t){const e=String(t||"").match(/^\s*\.([a-zA-Z_][\w-]*)\s*\{/);return e?e[1]:""}function Ka(t){const e=[],n=/\.([a-zA-Z_][\w-]*)\s*\{/g;let o,s=!0;for(;o=n.exec(String(t||""));){if(s){s=!1;continue}e.push(o[1])}return e}function Ga(t,e){const n=String(t).lastIndexOf(`
`,e-1)+1,o=t.slice(n,e);return/^\s*$/.test(o)?o:""}function Xa(t,e){return e?t.split(`
`).map((n,o)=>o===0||!n?n:e+n).join(`
`):t}function Za(t,e){let n=0;for(let o=0;o<e.from;o+=1){if(t.startsWith("/*",o)){o=gn(t,o)-1;continue}t[o]==="{"?n+=1:t[o]==="}"&&(n-=1)}return n===0}function yn(t,e,n){const o=as(e)||n;if(!o)return String(t||"");let s=String(e||"").trim();s?new RegExp(`^\\.${ue(o)}\\s*\\{`).test(s)||(s=`.${o} {
${s}
}`):s=`.${o} {
}`;let r=String(t||"");const i=U(r,o),l=Ka(s);if(i){const d=Ga(r,i.from);r=r.slice(0,i.from)+Xa(s,d)+r.slice(i.to)}else r=`${r.trimEnd()}${r.trim()?`
`:""}${s}
`;const c=U(r,o);if(!c)return r;for(const d of[...new Set(l)].reverse()){const f=new RegExp(`(^|[^\\w-])\\.${ue(d)}\\s*\\{`,"g"),h=[];let p;for(;p=f.exec(r);){const y=p.index+p[1].length,b=r.indexOf("{",y),E=Tt(r,b);E!==-1&&h.push({from:y,to:E+1})}for(const y of h.reverse()){if(y.from>=c.from&&y.to<=c.to||!Za(r,y))continue;let b=y.from;const E=r.lastIndexOf(`
`,b-1)+1;/^\s*$/.test(r.slice(E,b))&&(b=E);let Bt=y.to;r[Bt]===`
`&&(Bt+=1),r=r.slice(0,b)+r.slice(Bt)}}return r}function Ne(t,e){const n=String(t||"");return`${n.trimEnd()}${n.trim()?`
`:""}.${e} {
}
`}function Ya(t,e,n){const o=vt(n);return!e||!o||e===o?String(t||""):U(t,o)?is(t,e):String(t||"").replace(new RegExp(`(^|[^\\w-])\\.${ue(e)}(\\s*\\{)`,"g"),`$1.${o}$2`)}function is(t,e){let n=String(t||"");for(;;){const o=U(n,e);if(!o)break;let s=o.from;const r=n.lastIndexOf(`
`,s-1)+1;/^\s*$/.test(n.slice(r,s))&&(s=r);let i=o.to;n[i]===`
`&&(i+=1),n=n.slice(0,s)+n.slice(i)}return n}function Ja(t,e,n){const o=Array.isArray(e)?e:[],s=Array.isArray(n)?n:[],{renamed:r,added:i}=os(o,s),l=new Set(s);let c=String(t||"");for(const d of r){const f=vt(d.to);if(f){if(l.has(d.from)){U(c,f)||(c=Ne(c,f));continue}U(c,d.from)?c=Ya(c,d.from,f):U(c,f)||(c=Ne(c,f))}}for(const d of i){const f=vt(d);!f||U(c,f)||(c=Ne(c,f))}return c}function Qa(t,e,n){const o=new Set(Array.isArray(e)?e:[]),s=new Set(Array.isArray(n)?n:[]);let r=String(t||"");for(const i of s)o.has(i)||(r=is(r,i));return r}const Q="__sve-css-rename-chip",ti='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';function ei(t){const e=t.Decoration.mark({class:"sve-cm-css-token"}),n=t.StateEffect.define();return{extensions:[t.StateField.define({create(){return t.Decoration.none},update(s,r){let i;for(const c of r.effects)c.is(n)&&(i=c.value);if(i===void 0)return r.docChanged?t.Decoration.none:s;if(!i)return t.Decoration.none;const l=new t.RangeSetBuilder;return l.add(i.from,i.to,e),l.finish()},provide:s=>t.EditorView.decorations.from(s)})],setHover(s,r){s&&s.dispatch({effects:n.of(r)})}}}function tt(t){t?.getElementById(Q)?.remove()}function ni(t,e,n,o){e.style.left=`${Math.max(6,Math.min(n,t.innerWidth-28))}px`,e.style.top=`${Math.max(6,o)}px`}function oi(t,e,n,{onRename:o,title:s}){const r=t.document,i=e.coordsAtPos(n.to);if(!i)return;tt(r);const l=r.createElement("button");l.id=Q,l.type="button",l.innerHTML=ti,l.title=s,l.setAttribute("aria-label",s),l.addEventListener("mousedown",c=>{c.preventDefault(),c.stopPropagation(),tt(r),o?.(n)}),l.addEventListener("mouseleave",()=>{t.setTimeout(()=>{e.dom.matches(":hover")||l.matches(":hover")||tt(r)},120)}),r.body.appendChild(l),ni(t,l,i.right+2,i.top-1)}function si(t,e,{onRename:n,isLocked:o,setHover:s,title:r}){if(!e?.dom||e.dom._sveClassTokenBound)return;e.dom._sveClassTokenBound=!0;let i=null,l="";const c=()=>!!o?.(),d=()=>{t.clearTimeout(i),i=null,l="",s?.(e,null),tt(t.document)},f=h=>{if(c()){d();return}d(),n?.(h)};e.dom.addEventListener("mousemove",h=>{if(c()){d();return}if(h.target?.closest?.(`#${Q}`))return;const p=e.posAtCoords({x:h.clientX,y:h.clientY});if(p==null)return;const y=Jn(e.state.doc.toString(),p);if(!y){t.clearTimeout(i),i=null,l="",s?.(e,null);return}const b=`${y.from}:${y.to}:${y.name}`;s?.(e,{from:y.from,to:y.to}),!(l===b&&(i||t.document.getElementById(Q)))&&(t.clearTimeout(i),l=b,i=t.setTimeout(()=>{i=null,oi(t,e,y,{onRename:f,title:r||"Rename class"})},160))}),e.dom.addEventListener("mouseleave",h=>{h.relatedTarget?.closest?.(`#${Q}`)||t.setTimeout(()=>{t.document.getElementById(Q)?.matches(":hover")||d()},160)}),e.dom.addEventListener("dblclick",h=>{if(c())return;const p=e.posAtCoords({x:h.clientX,y:h.clientY});if(p==null)return;const y=Jn(e.state.doc.toString(),p);y&&(h.preventDefault(),h.stopPropagation(),f(y))},!0),e.scrollDOM?.addEventListener("scroll",d),t.document._sveClassTokenDismiss||(t.document._sveClassTokenDismiss=!0,t.document.addEventListener("mousedown",h=>{h.target.closest(`#${Q}`)||tt(t.document)}))}const a={cssColorsPromise:null,lastUid:null,lastType:null,typeStack:[],lastParts:{html:"",css:"",js:""},lastProps:[],propsDirty:!1,lastLocked:!1,lockReady:!1,lastWin:null,loadGen:0,saveTimer:null,lastBracketNames:null,lastCssSelectorNames:null,saveInFlight:null,loadInFlight:null,dragging:!1,applying:!1,htmlScopePref:!0,htmlScopeActive:!1,styleMode:"css",cssToolRow:null,cssOpenTool:"",cssOpenMenu:"",cssValues:!1,twCss:null,twKey:"",twBusy:!1,twDirty:!1,htmlFocus:null,htmlFull:"",cssFull:"",cssPane:"full",cssScopeSnapshot:"",layoutObserver:null,layoutWin:null,observedEditor:null,observedRight:null,layoutWatchBound:!1,cssSize:"",cssState:"",cssOwnFolds:new Set,cssFoldSig:"",htmlPartialUi:null,htmlAntlersUi:null,htmlClassTokenUi:null,htmlLintUi:null,cssGhostUi:null},wt=new Map,eo={scope:null,section:[],page:[],site:[]};function ls(t){const e=t?.location?.pathname?.match(/\/collections\/([^/]+)\//);return e?e[1]:""}function cs(t){const e=String(t||"").trim();return!e||/^(header|footer)\//.test(e)?"":e}function ri(t){return(Array.isArray(t)?t:[]).filter(e=>e?.handle).map(e=>`${e.kind==="collection"?"collection":"field"}:${e.handle}`).join("|")}function bn({collection:t,set:e,view:n,scope:o}){return`${t}::${e}::${n||""}::${o||""}`}function ds(t){return wt.get(t)||null}function us(t,{collection:e,set:n,view:o,scope:s}){const r=bn({collection:e,set:n,view:o,scope:s}),i=wt.get(r);if(i)return Promise.resolve(i);const l=new URLSearchParams;return e&&l.set("collection",e),n&&l.set("set",n),o&&l.set("view",o),s&&l.set("scope",s),t.fetch(`/!/sve/data-vars?${l.toString()}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(c=>c.ok?c.json():null).then(c=>{const d=c&&typeof c=="object"?c:eo;return wt.set(r,d),d}).catch(()=>eo)}function ai(t){if(!t){wt.clear();return}const e=`::${t}::`;for(const n of[...wt.keys()])n.includes(e)&&wt.delete(n)}function ii(t){if(t==null||t==="")return"";if(typeof t=="boolean")return t?"true":"false";if(Array.isArray(t))return t.length?`${t.length} ×`:"";if(typeof t=="object"){const n=Object.keys(t).length;return n?`${n} ×`:""}const e=String(t).replace(/\s+/g," ").trim();return e.length>60?`${e.slice(0,60)}…`:e}function li(t,e){return e.split(".").reduce((n,o)=>n&&typeof n=="object"?n[o]:void 0,t)}function fs(t,e){return!Array.isArray(t)||!e||typeof e!="object"?t||[]:t.map(n=>{if(n.parent||n.value!=null||n.var.includes(":"))return n;const o=ii(li(e,n.var));return o?{...n,value:o}:n})}function ci(t,e){return Array.isArray(t)?t.map(n=>({...n,items:fs(n.items,e)})):[]}function di(t,e){const n=String(t?.var||"").trim();if(!n)return null;if(t.loop)return{text:`{{ ${n} }}
  
{{ /${n} }}`,cursor:`{{ ${n} }}
  `.length};if(e?.loop&&!t.parent){const o=e.loop;return{text:`{{ ${o} }}
  {{ ${n} }}
{{ /${o} }}`,cursor:`{{ ${o} }}
  {{ ${n} }}`.length}}return{text:`{{ ${n} }}`,cursor:`{{ ${n} }}`.length}}const se="visual_edit",no=[{id:"base",lang:"code_dock_visual_edit_base"},{id:"field",lang:"code_dock_visual_edit_field"}],hs=[{id:"tag",group:"base",label:"{{ visual_edit }}",standalone:"{{ visual_edit| }}"},{id:"ve_popup",group:"base",label:"popup",attr:'popup="true"'},{id:"ve_orderable",group:"base",label:"orderable",attr:'orderable="true"'},{id:"ve_section_orderable",group:"base",label:"section_orderable",attr:'section_orderable="true"'},{id:"ve_outline_inside",group:"base",label:"outline_inside",attr:'outline_inside="true"'},{id:"ve_field",group:"field",label:"field",attr:'field="|"'},{id:"ve_inline_edit",group:"field",label:"inline_edit",attr:'inline_edit="true"'},{id:"ve_insertable",group:"field",label:"insertable",attr:'insertable="true"'},{id:"ve_toolbar",group:"field",label:"toolbar",attr:'toolbar="true"'},{id:"ve_scope",group:"field",label:"scope",attr:'scope="|"'},{id:"ve_controls",group:"field",label:"controls",attr:'controls="|"'}];function ui(t){return hs.find(e=>e.id===t)||null}function fi(t,e,n,o){let s=e;for(;s<n;){const r=t.indexOf("{{",s);if(r===-1||r>=n)return null;const i=t.indexOf("}}",r+2);if(i===-1||i+2>n)return null;const l=t.slice(r+2,i);if((l.trim().split(/\s+/)[0]||"")===o)return{openIdx:r,closeIdx:i,inner:l};s=i+2}return null}function hi(t,e){const n=String(e).split("=")[0].trim();return new RegExp(`(^|\\s)${n}(=|\\s|$)`).test(t)}const pi={class:"sve-code-dock"},mi={"data-sve-code-bar":""},gi={type:"button","data-sve-code-pane-btn":"html"},vi={type:"button","data-sve-code-pane-btn":"css"},yi={type:"button","data-sve-code-pane-btn":"alpine"},bi={type:"button","data-sve-code-pane-btn":"js"},xi={type:"button","data-sve-html-scope":"","aria-pressed":"true"},ki=["innerHTML"],Si={"data-sve-code-panes":""},_i={"data-sve-code-pane":"html"},wi={"data-sve-code-pane-label":""},$i=["title","aria-label"],Ci=["innerHTML"],Ai={"data-sve-code-pane":"css"},Ti={"data-sve-css-chrome":"subrow-2"},Mi={"data-sve-code-pane-label":""},Ei={"data-sve-css-label":""},Li={"data-sve-code-pane":"alpine"},Bi={"data-sve-code-pane-label":""},Fi={"data-sve-code-pane":"js"},Ii={"data-sve-code-pane-label":""},Oi={__name:"CodeDockChrome",props:{htmlLabel:{type:String,required:!0},cssLabel:{type:String,required:!0},jsLabel:{type:String,required:!0},alpineLabel:{type:String,required:!0},treeIcon:{type:String,required:!0},dataIcon:{type:String,required:!0},dataLabel:{type:String,required:!0}},setup(t){return(e,n)=>(k(),S("div",pi,[n[18]||(n[18]=v("div",{"data-sve-code-grip":"","aria-hidden":"true"},null,-1)),v("div",mi,[v("button",gi,M(t.htmlLabel),1),v("button",vi,M(t.cssLabel),1),v("button",yi,M(t.alpineLabel),1),v("button",bi,M(t.jsLabel),1),n[0]||(n[0]=jr('<button type="button" data-sve-code-back hidden></button><span data-sve-code-path></span><span data-sve-code-status></span><button type="button" data-sve-code-strip></button><button type="button" data-sve-code-history></button><button type="button" data-sve-style-mode></button><button type="button" data-sve-values-mode></button><button type="button" data-sve-code-autosave aria-pressed="true"></button><button type="button" data-sve-code-save hidden></button>',9)),v("button",xi,[v("span",{innerHTML:t.treeIcon},null,8,ki)]),n[1]||(n[1]=v("button",{type:"button","data-sve-code-lock":"",hidden:""},null,-1))]),n[19]||(n[19]=v("div",{"data-sve-code-lock-banner":""},null,-1)),v("div",Si,[v("div",_i,[v("div",wi,[v("span",null,M(t.htmlLabel),1),n[2]||(n[2]=v("div",{"data-sve-html-tools":""},null,-1)),n[3]||(n[3]=v("button",{type:"button","data-sve-html-tidy":""},null,-1)),v("button",{type:"button","data-sve-data-vars":"",title:t.dataLabel,"aria-label":t.dataLabel},[v("span",{innerHTML:t.dataIcon},null,8,Ci)],8,$i),n[4]||(n[4]=v("div",{"data-sve-visual-edit-tools":""},null,-1)),n[5]||(n[5]=v("div",{"data-sve-antlers-tools":""},null,-1))]),n[6]||(n[6]=v("div",{"data-sve-html-problems":"",hidden:""},null,-1)),n[7]||(n[7]=v("div",{"data-sve-code-host":""},null,-1))]),n[15]||(n[15]=v("div",{"data-sve-code-split":"","data-sve-code-split-after":"html"},null,-1)),v("div",Ai,[v("div",Ti,[v("div",Mi,[v("span",Ei,M(t.cssLabel),1),n[8]||(n[8]=v("button",{type:"button","data-sve-css-add-class":""},null,-1)),n[9]||(n[9]=v("div",{"data-sve-css-tools":""},null,-1))])]),n[10]||(n[10]=v("div",{"data-sve-css-head":""},null,-1)),n[11]||(n[11]=v("div",{"data-sve-code-host":""},null,-1)),n[12]||(n[12]=v("div",{"data-sve-tw-host":""},null,-1))]),n[16]||(n[16]=v("div",{"data-sve-code-split":"","data-sve-code-split-after":"css"},null,-1)),v("div",Li,[v("div",Bi,[v("span",null,M(t.alpineLabel),1)]),n[13]||(n[13]=v("div",{"data-sve-alpine-host":""},null,-1))]),n[17]||(n[17]=v("div",{"data-sve-code-split":"","data-sve-code-split-after":"alpine"},null,-1)),v("div",Fi,[v("div",Ii,[v("span",null,M(t.jsLabel),1)]),n[14]||(n[14]=v("div",{"data-sve-code-host":""},null,-1))])])]))}},oo="view:",so="partials/";function ps(t){const e=String(t||"");if(!e.startsWith(oo))return null;const n=e.slice(oo.length);return n.startsWith(so)?n.slice(so.length):n}function Pi(t){const e=String(t||"").match(/\sclass\s*=\s*(["'])([\s\S]*?)\1/i);return e?e[2].replace(/\{\{[\s\S]*?\}\}/g,"\0").split(/[\s[\]]+/).filter(n=>n&&!n.includes("\0")&&/^[A-Za-z_][\w:./%!#-]*$/.test(n)):[]}const Di=t=>globalThis.CSS?.escape?globalThis.CSS.escape(t):t.replace(/([^\w-])/g,"\\$1");function ms(t){const e=xe(t)[0];if(!e)return null;const n=Pi(String(t).slice(e.from,e.openTo));return!n.length&&!/^(header|footer|main|nav|aside|figure|form|table)$/.test(e.tag)?null:e.tag+n.map(o=>`.${Di(o)}`).join("")}const Ot=new Map;let Ft=null,ro=0,ao=0,io=!1;async function zi(t,e){if(Ot.has(e))return Ot.get(e);const n=`view:partials/${e}`;let o=null;try{const s=await t.fetch(`/!/sve/section-template?type=${encodeURIComponent(n)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}});if(s.ok){const r=await s.json();o=typeof r.html=="string"?ms(r.html):null}}catch{}return Ot.set(e,o),o}function Hi(t){t?Ot.delete(t):Ot.clear()}function gs(t){const e=ps(mt("dock:current-type")),n=e?mt("dock:html"):"",o=e&&typeof n=="string"?ms(n):null;Io({source:Jo,type:Yo.SVE_COMPONENT_FOCUS,on:!!o,name:e?String(e).split("/").pop():"",selector:o||""},t)}async function xn(t){const e=++ao,n=mt("dock:html"),o=[...new Set((typeof n=="string"?Wo(n):[]).map(r=>r.src).filter(r=>r&&!va(r)))],s=await Promise.all(o.map(r=>zi(t,r)));e===ao&&Io({source:Jo,type:Yo.SVE_COMPONENT_MAP,items:o.map((r,i)=>({src:r,name:r.split("/").pop(),selector:s[i]})).filter(r=>r.selector)},t)}function Ri(t){Ft=t,!io&&(io=!0,be("dock:html-changed",()=>{Ft&&(Hi(ps(mt("dock:current-type"))),Ft.clearTimeout(ro),ro=Ft.setTimeout(()=>{xn(Ft)},400))}))}const ji=["data-sve-html-tool","data-tip","aria-label","data-letter","onClick","onContextmenu"],Ni=["innerHTML"],Wi={__name:"CodeDockHtmlTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(t){return(e,n)=>(k(!0),S(N,null,ct(t.tools,o=>(k(),S("button",{key:o.id,type:"button","data-sve-html-tool":o.id,"data-tip":o.title,"aria-label":o.title,"data-letter":o.letter?"":void 0,onClick:B(s=>t.onTool(o.id),["prevent","stop"]),onContextmenu:B(s=>t.onTool(o.id),["prevent"])},[o.letter?(k(),S(N,{key:0},[Oo(M(o.letter),1)],64)):(k(),S("span",{key:1,innerHTML:o.icon},null,8,Ni))],40,ji))),128))}},it=ln({tools:[],onTool:null,onKid:null}),qi=["data-sve-css-item"],Vi=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],Ui={key:0,"data-sve-css-kids":""},Ki={key:0,"data-sve-css-sep":"","aria-hidden":"true"},Gi=["data-sve-css-kid","data-sve-css-box-side","data-tip","aria-label","innerHTML","onClick","onContextmenu"],Xi={__name:"CodeDockCssTools",setup(t){return(e,n)=>(k(!0),S(N,null,ct($(it).tools,o=>(k(),S("li",Re({key:o.id,"data-sve-css-item":o.id},{ref_for:!0},o.open?{"data-sve-css-open":""}:{}),[v("button",Re({type:"button","data-sve-css-tool":o.id,"data-tip":o.title,"aria-label":o.title},{ref_for:!0},{...o.active?{"data-active":""}:{},...o.open?{"data-open":""}:{}},{innerHTML:o.icon,onClick:B(s=>$(it).onTool?.(o.id),["prevent","stop"]),onContextmenu:B(s=>$(it).onTool?.(o.id),["prevent"])}),null,16,Vi),o.open&&o.kids.length?(k(),S("div",Ui,[(k(!0),S(N,null,ct(o.kids,s=>(k(),S(N,{key:s.id},[s.sep?(k(),S("span",Ki)):X("",!0),v("button",Re({type:"button","data-sve-css-kid":s.id,"data-sve-css-box-side":s.id,"data-tip":s.title,"aria-label":s.title},{ref_for:!0},s.active?{"data-active":""}:{},{innerHTML:s.icon,onClick:B(r=>$(it).onKid?.(o.id,s.id),["prevent","stop"]),onContextmenu:B(r=>$(it).onKid?.(o.id,s.id),["prevent"])}),null,16,Gi)],64))),128))])):X("",!0)],16,qi))),128))}},Zi=1.5,Yi=16;function le(t,e){const n=parseFloat(t);return Number.isFinite(n)?e==="em"||e==="rem"?n*Yi:n:null}function Ji(t){const e=String(t||"").toLowerCase();if(/\bmin-width\b|\bwidth\s*>=?/.test(e))return null;let n=e.match(/\bmax-width\s*:\s*([\d.]+)(px|em|rem)/);return n||(n=e.match(/\bwidth\s*<=?\s*([\d.]+)(px|em|rem)/),n)?le(n[1],n[2]):(n=e.match(/([\d.]+)(px|em|rem)\s*>=?\s*width\b/),n?le(n[1],n[2]):null)}function lt(t,e){const n=Ji(t);if(n===null)return"";for(const o of e||[]){if(o.base)continue;const s=le(String(o.max||"").replace(/[a-z]+$/i,""),(String(o.max||"").match(/[a-z]+$/i)||[""])[0]);if(s!==null&&Math.abs(s-n)<=Zi)return o.handle}return""}function _e(t){let e="",n=0;for(;n<t.length;){const o=we(t,n);if(o!==n){e+=" ".repeat(o-n),n=o;continue}e+=t[n],n+=1}return e}function we(t,e){if(t.startsWith("/*",e)){const n=t.indexOf("*/",e+2);return n===-1?t.length:n+2}if(t.startsWith("{{",e)){const n=t.indexOf("}}",e+2);return n===-1?t.length:n+2}if(t[e]==='"'||t[e]==="'"){const n=t[e];for(let o=e+1;o<t.length;o+=1)if(t[o]==="\\")o+=1;else if(t[o]===n)return o+1;return t.length}return e}function $e(t){const e=String(t||""),n=[],o=(s,r,i=0)=>{let l=s,c=l;for(;l<r;){const d=we(e,l);if(d!==l){l=d;continue}if(e[l]===";"){l+=1,c=l;continue}if(e[l]==="}")return;if(e[l]!=="{"){l+=1;continue}const f=_e(e.slice(c,l)),h=f.trim(),p=vs(e,l,r);if(p===-1)return;/^@media\b/i.test(h)?n.push({query:h.replace(/^@media\s*/i,"").trim(),from:c+f.search(/\S/),to:p+1,bodyFrom:l+1,bodyTo:p,depth:i}):/^@(?:import|charset|use)\b/i.test(h)||o(l+1,p,i+1),l=p+1,c=l}};return o(0,e.length,0),n}function vs(t,e,n){let o=0;for(let s=e;s<n;s+=1){const r=we(t,s);if(r!==s){s=r-1;continue}if(t[s]==="{")o+=1;else if(t[s]==="}"&&(o-=1,o===0))return s}return-1}function Mt(t){const e=String(t||""),n=(o,s)=>{const r=[];let i=o,l=i;for(;i<s;){const c=we(e,i);if(c!==i){i=c;continue}if(e[i]===";"){i+=1,l=i;continue}if(e[i]==="}")return r;if(e[i]!=="{"){i+=1;continue}const d=_e(e.slice(l,i)),f=d.trim(),h=vs(e,i,s);if(h===-1)return r;r.push({prelude:f,media:/^@media\b/i.test(f),query:f.replace(/^@media\s*/i,"").trim(),from:l+d.search(/\S/),to:h+1,bodyFrom:i+1,bodyTo:h,children:/^@(?:import|charset|use)\b/i.test(f)?[]:n(i+1,h)}),i=h+1,l=i}return r};return n(0,e.length)}function Qi(t,e,n){const o=String(t||"");if(!n)return[];const s=(e||[]).find(d=>d.base),r=Mt(o),i=[],l=d=>d.media?lt(d.query,e)===n:d.children.some(l);if(s&&n===s.handle){const d=f=>{for(const h of f){if(h.media&&lt(h.query,e)){i.push({from:h.from,to:h.to});continue}d(h.children)}};return d(r),i}const c=(d,f,h)=>{const p=[];for(const b of d){if(b.media&&lt(b.query,e)===n){p.push({from:b.from,to:b.to,into:null});continue}l(b)&&p.push({from:b.from,to:b.to,into:b})}if(!p.length){h>f&&i.push({from:f,to:h});return}let y=f;for(const b of p)b.from>y&&i.push({from:y,to:b.from}),b.into&&c(b.into.children,b.into.bodyFrom,b.into.bodyTo),y=b.to;h>y&&i.push({from:y,to:h})};return c(r,0,o.length),i.filter(d=>o.slice(d.from,d.to).trim()!=="")}function tl(t,e){const n=String(t||""),o=[],s=i=>{for(const l of i){if((l.media&&lt(l.query,e)||/^#id-/.test(l.prelude))&&_e(n.slice(l.bodyFrom,l.bodyTo)).trim()===""){o.push(l);continue}s(l.children)}};if(s(Mt(n)),!o.length)return n;let r=n;for(const i of o.sort((l,c)=>c.from-l.from)){let l=i.from,c=i.to;const d=r.lastIndexOf(`
`,l-1)+1;for(r.slice(d,l).trim()===""&&(l=d);r[c]===" "||r[c]==="	";)c+=1;r[c]===`
`&&(c+=1),r=r.slice(0,l)+r.slice(c)}return r}function el(t,e){const n=String(t||""),o=[],s=i=>_e(n.slice(i.bodyFrom,i.bodyTo)).trim()==="",r=i=>{for(const l of i){if((l.media&&lt(l.query,e)||/^#id-/.test(l.prelude))&&s(l)){o.push({from:l.from,to:l.to});continue}r(l.children)}};return r(Mt(n)),o}function fe(t,e,n){const o=e||[],s=o.find(d=>d.base),r=[],i=d=>/^#id-/.test(d.prelude)||/^#\s*$/.test(d.prelude),l=(d,f)=>{for(const h of d){if(!h.media){l(h.children,f);continue}const p=lt(h.query,o)||f;if(n===p){r.push(h);continue}l(h.children,p)}},c=(d,f)=>{for(const h of d){if(h.media){c(h.children,lt(h.query,o)||f);continue}if(i(h)){const p=f||(s?s.handle:"");!n||n===p?r.push(h):l(h.children,p);continue}c(h.children,f)}};return c(Mt(String(t||"")),""),r.sort((d,f)=>d.from-f.from)}function kn(t,e,n){return $e(t).filter(o=>lt(o.query,e)===n)}const T=ln({tag:"",scope:"",onTag:null,sizes:[],onSize:null,state:"",stateLabel:"",onState:null,canEdit:!1,note:""}),nl={class:"sve-css-head"},ol=["disabled"],sl={key:1,class:"sve-css-scope"},rl=["title","data-active","disabled","onClick"],al=["data-active","disabled"],il={key:2,class:"sve-css-note"},ll={__name:"CodeDockCssHead",setup(t){return(e,n)=>(k(),S("div",nl,[$(T).tag?(k(),S("button",{key:0,type:"button",class:"sve-css-tag",disabled:!$(T).canEdit,onClick:n[0]||(n[0]=B(()=>{},["prevent","stop"])),onDblclick:n[1]||(n[1]=B(o=>$(T).onTag?.(o),["prevent","stop"]))},"<"+M($(T).tag)+">",41,ol)):X("",!0),$(T).scope?(k(),S("span",sl,M($(T).scope),1)):X("",!0),(k(!0),S(N,null,ct($(T).sizes,o=>(k(),S("button",{key:o.key,type:"button","data-sve-css-size":"",title:o.title,"data-active":o.active?"":void 0,disabled:!$(T).canEdit,onClick:B(s=>$(T).onSize?.(o.key),["prevent","stop"])},M(o.label),9,rl))),128)),v("button",{type:"button","data-sve-css-state":"","data-active":$(T).state?"":void 0,disabled:!$(T).canEdit,onClick:n[2]||(n[2]=B(o=>$(T).onState?.(o),["prevent","stop"]))},[Oo(M($(T).stateLabel)+" ",1),n[3]||(n[3]=v("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[v("path",{d:"m6 9 6 6 6-6"})],-1))],8,al),n[4]||(n[4]=v("span",{class:"sve-css-gap"},null,-1)),$(T).note?(k(),S("span",il,M($(T).note),1)):X("",!0)]))}},cl=Po(ll,[["__scopeId","data-v-43bc76ce"]]),dl={key:0,"data-sve-css-swatches":""},ul=["data-sve-css-token","title","data-active","onClick"],fl={key:0,"data-sve-css-head-row":""},hl={key:1,"data-sve-css-note-row":""},pl=["data-sve-css-token","data-active","onClick"],ml={"data-sve-css-choice-label":""},gl={key:0,"data-sve-css-choice-hint":""},Y={__name:"CodeDockMenu",props:{kind:{type:String,required:!0},swatches:{type:Array,default:()=>[]},choices:{type:Array,default:()=>[]},onClear:{type:Function,default:null},onPick:{type:Function,required:!0}},setup(t){return(e,n)=>t.kind==="colors"?(k(),S("div",dl,[v("button",{type:"button","data-sve-css-clear":"",title:"Clear",onClick:n[0]||(n[0]=B((...o)=>t.onClear&&t.onClear(...o),["prevent","stop"]))},[...n[1]||(n[1]=[v("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none",stroke:"currentColor","stroke-width":"1.5"},[v("path",{d:"M2 2l6 6M8 2L2 8"})],-1)])]),(k(!0),S(N,null,ct(t.swatches,o=>(k(),S("button",{key:o.name,type:"button","data-sve-css-swatch":"","data-sve-css-token":o.name,title:o.name,"data-active":o.active?"":void 0,style:Nr({background:o.hex||"transparent"}),onClick:B(s=>t.onPick(o.name),["prevent","stop"])},null,12,ul))),128))])):(k(!0),S(N,{key:1},ct(t.choices,o=>(k(),S(N,{key:o.value},[o.heading?(k(),S("span",fl,M(o.label),1)):o.note?(k(),S("span",hl,M(o.label),1)):(k(),S("button",{key:2,type:"button","data-sve-css-choice":"","data-sve-css-token":o.token||void 0,"data-active":o.active?"":void 0,onClick:B(s=>t.onPick(o.value),["prevent","stop"])},[v("span",ml,M(o.label),1),o.hint?(k(),S("span",gl,M(o.hint),1)):X("",!0)],8,pl))],64))),128))}},vl=/^\.[a-zA-Z_][\w-]*$/;function yl(t,e,n){return String(e||"").includes(n)?he(t).length===1:!1}function he(t){return Mt(t).filter(e=>/^@scope\b/i.test(e.prelude))}function bl(t){const e=String(t||"");return Mt(e).filter(n=>vl.test(n.prelude)?!e.slice(n.from,n.bodyFrom-1).includes("{{"):!1).map(n=>({from:n.from,to:n.to,name:n.prelude.slice(1)}))}function xl(t,e,n){const o=String(t||"");if(!yl(o,e,n))return o;const s=bl(o);if(!s.length)return o;const r=he(o)[0],i=_l(o,r),l=s.map(p=>wl(o.slice(p.from,p.to),o,p.from,i)).join(`

`);let c=o;for(const p of[...s].sort((y,b)=>b.from-y.from))c=Sl(c,p.from,p.to);const d=kl(c,n);if(d===-1)return o;const f=(c.slice(0,d).match(/\n([^\S\n]*)$/)||[null,null])[1],h=f===null?d:d-f.length;return`${c.slice(0,h)}
${l}
${f??""}${c.slice(d)}`}function kl(t,e){const n=he(t).find(o=>o.prelude.includes(e));return n?n.bodyTo:he(t)[0]?.bodyTo??-1}function Sl(t,e,n){let o=e,s=n;const r=t.lastIndexOf(`
`,o-1)+1;for(t.slice(r,o).trim()===""&&(o=r);t[s]===" "||t[s]==="	";)s+=1;return t[s]===`
`&&(s+=1),t.slice(0,o)+t.slice(s)}function _l(t,e){const n=t.slice(e.bodyFrom,e.bodyTo).match(/\n([^\S\n]+)\S/);return n?n[1]:`${(t.slice(0,e.from).match(/\n([^\S\n]*)$/)||[null,""])[1]}    `}function wl(t,e,n,o){const s=(e.slice(0,n).match(/\n([^\S\n]*)$/)||[null,""])[1];return t.split(`
`).map((r,i)=>i===0?o+r.trim():r.startsWith(s)?o+r.slice(s.length):o+r.trimStart()).join(`
`)}const $l={"data-sve-css-add-label":""},Cl=["placeholder","onKeydown"],Sn={__name:"CodeDockAddClass",props:{label:{type:String,required:!0},placeholder:{type:String,default:""},initial:{type:String,default:""},onAdd:{type:Function,required:!0}},setup(t){const e=t,n=Wn(e.initial||""),o=Wn(null);Wr(()=>qr(()=>{o.value?.focus(),o.value?.select()}));function s(){const r=n.value.trim();if(!r){o.value?.focus();return}e.onAdd(r)}return(r,i)=>(k(),S(N,null,[v("label",$l,M(t.label),1),Vr(v("input",{ref_key:"input",ref:o,"data-sve-css-add-input":"","onUpdate:modelValue":i[0]||(i[0]=l=>n.value=l),type:"text",placeholder:t.placeholder,onKeydown:[qn(B(s,["prevent"]),["enter"]),i[1]||(i[1]=qn(B(()=>{},["stop"]),["escape"]))]},null,40,Cl),[[Ur,n.value]])],64))}};function lo(t,e){e._sveLockBound||(e._sveLockBound=!0,e.querySelector("[data-sve-code-lock]")?.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),!(!a.lockReady||!a.lastType)){if(a.lastLocked){Tl(t);return}ys(t,!0)}}))}function _n(t){return t?G(t,Ir)!=="0":!0}function Al(){const t=g.html;return!t||t.state.readOnly||!a.lastType?!1:!Mn(Tn(),a.lastParts)}function st(t){const e=t?.document.getElementById(u),n=e?.querySelector("[data-sve-code-autosave]"),o=e?.querySelector("[data-sve-code-save]");if(!n||!o)return;const s=_n(t),r=Al();n.setAttribute("aria-pressed",s?"true":"false"),n.title=m(t,s?"code_dock_autosave_on":"code_dock_autosave_off"),n.setAttribute("aria-label",n.title),n.innerHTML=Tu,o.hidden=s,o.title=m(t,"code_dock_save"),o.setAttribute("aria-label",o.title),o.innerHTML=Mu,r?o.setAttribute("data-dirty",""):o.removeAttribute("data-dirty")}function co(t,e){e._sveAutosaveBound||(e._sveAutosaveBound=!0,e.querySelector("[data-sve-code-autosave]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation();const o=!_n(t);j(t,Ir,o?"1":"0"),o?W(t.document):a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null),st(t)}),e.querySelector("[data-sve-code-save]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),W(t.document)}))}function Tl(t){t.document.getElementById(V)?.remove();const e=Kr(t.document,Gr,{title:m(t,"code_dock_unlock_title"),body:m(t,"code_dock_unlock_body"),buttons:[{value:"cancel",label:m(t,"cancel"),variant:"ghost"},{value:"ok",label:m(t,"code_dock_unlock_confirm"),variant:"primary"}],onPick:n=>{e.dismiss(),n==="ok"&&ys(t,!1)}});e.host.id=V}function ys(t,e){const n=a.lastType;if(!n)return;const o=()=>{a.lastType===n&&t.fetch("/!/sve/section-template/lock",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Do(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:n,locked:e})}).then(async s=>{if(!s.ok)throw new Error(String(s.status));a.lastType===n&&(a.lastLocked=e,Ct(t),Zt(a.lastParts,e),q(t),O(t.document,e?m(t,"code_dock_locked"):""))}).catch(()=>{O(t.document,m(t,"code_dock_error"))})};if(e&&(W(t.document),a.saveInFlight)){a.saveInFlight.finally(o);return}o()}function bs(t,e){const n=String(e||"");if(/^(header|footer)\//.test(n))return!0;const o=t?.Statamic?.$config?.get?.("sveChromeTemplates")||{};return Object.values(o).some(s=>s&&s.type===n)}function pe(t){const e=a.lastType;if(!a.lastUid||!e||String(e).startsWith("view:")||bs(t,e)){Vn(t);return}const n=Zr(a.lastUid,t.document);Vn(t,n.length?{sectionUids:n}:void 0)}function Ml(t,e,n){return a.saveInFlight=t.fetch("/!/sve/section-template",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Do(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:e,html:n.html,css:n.css,js:n.js,...typeof n.tw=="string"?{tw:n.tw}:{},...ya(t)?{props:a.lastProps}:{}})}).then(async o=>{if(o.status===423){a.lastLocked=!0,a.lockReady=!0,Ct(t),Zt(a.lastParts,!0),q(t),O(t.document,m(t,"code_dock_locked"));return}const s=await o.json().catch(()=>({}));if(!o.ok)throw new Error(s?.error==="not_writable"?"not_writable":String(o.status));if(a.lastType===e){if(a.lastParts=n,s?.tw_written===!1){a.twDirty=!0,O(t.document,m(t,"code_dock_tw_not_writable")),st(t),pe(t);return}O(t.document,m(t,"code_dock_saved")),st(t),t.setTimeout(()=>{const r=t.document.getElementById(u)?.querySelector("[data-sve-code-status]");r&&r.textContent===m(t,"code_dock_saved")&&(r.textContent="")},1800)}pe(t),t.document.getElementById("__sve-section-picker")?.dispatchEvent(new t.CustomEvent("sve-library-stale"))}).catch(o=>{O(t.document,m(t,o?.message==="not_writable"?"code_dock_not_writable":"code_dock_error"))}).finally(()=>{a.saveInFlight=null}),a.saveInFlight}function W(t){a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null);const e=a.lastType,n=a.lastWin,o=g.html;if(!o||o.state.readOnly||!e||!n||!a.lockReady)return;const s=Tn(),r=a.twCss!==null&&qo(n)&&wn(s.html)===a.twKey;Mn(s,a.lastParts)&&!(r&&a.twDirty)&&!a.propsDirty||(a.propsDirty=!1,r&&(s.tw=a.twCss,a.twDirty=!1),O(t,m(n,"code_dock_saving")),Ml(n,e,s))}function wn(t){return Pa(t).sort().join(" ")}function El(){a.twCss=null,a.twKey="",a.twDirty=!1}function Ll(t,e){a.twCss=e,a.twKey=wn(t),a.twDirty=!1}function xs(t,e){if(!t||!qo(t))return;const n=wn(e);n===a.twKey||a.twBusy||(a.twBusy=!0,Xr(()=>import("./tw-compile-C_hT6KCx.js"),__vite__mapDeps([0,1]),import.meta.url).then(o=>o.compileTailwind(t,e)).then(o=>{a.twBusy=!1,a.twCss=o,a.twKey=n,a.twDirty=!0,ks(t,t.document)}).catch(o=>{a.twBusy=!1,console.error("[sve] tailwind compile",o)}))}function ks(t,e){a.saveTimer&&clearTimeout(a.saveTimer),a.saveTimer=t.setTimeout(()=>{a.saveTimer=null,W(e)},_u)}function J(t){if(a.applying)return;const e=Tn();if(Mn(e,a.lastParts)){st(t);return}if(st(t),xs(t,e.html),!_n(t)){O(t.document,m(t,"code_dock_unsaved"));return}O(t.document,m(t,"code_dock_saving")),ks(t,t.document)}function Ss(t,e){let n=0;const o=Math.min(t.length,e.length);for(;n<o&&t[n]===e[n];)n+=1;let s=t.length,r=e.length;for(;s>n&&r>n&&t[s-1]===e[r-1];)s-=1,r-=1;return[n,s,e.slice(n,r)]}function _s(t){const e=a.lastUid,n=typeof z=="function"?z(t.document):[];for(const o of n){const s=ot(o.values)||o.values;if(!(!s||typeof s!="object")&&e&&typeof Un=="function"){const r=Un(s,e);if(r){const i=r.split("."),l=Yr(s,i.slice(0,2).join("."));if(l&&typeof l=="object")return l}}}for(const o of n){const s=ot(o.values)||o.values;if(s&&typeof s=="object")return s}return null}function ws(t,e){!e||e===a.lastType||(W(t.document),Wt(t,e,"push"))}function $s(t){const e=a.typeStack.pop();if(!e){Vt(t);return}W(t.document),Wt(t,e,"keep")}function Ct(t){const e=t.document.getElementById(u),n=e?.querySelector("[data-sve-code-lock]"),o=e?.querySelector("[data-sve-code-lock-banner]");if(!e||!n)return;const s=a.lastLocked;e.toggleAttribute("data-sve-code-locked",s),s&&(Vo(t.document),tt(t.document),a.htmlPartialUi&&(a.htmlPartialUi.setHover(g.html,null),a.htmlPartialUi.setHover(g.css,null)),a.htmlClassTokenUi?.setHover(g.html,null)),n.hidden=!a.lockReady,n.setAttribute("aria-pressed",a.lastLocked?"true":"false"),n.title=m(t,a.lastLocked?"code_dock_unlock":"code_dock_lock"),n.setAttribute("aria-label",n.title),n.innerHTML=a.lastLocked?wu:$u,o&&(o.textContent=m(t,"code_dock_locked_banner"))}function Kt(t){return t?G(t,De)!=="0":a.htmlScopePref}function Ce(t,e,n){return t!=null&&e!=null&&t>=0&&e>t&&e<=n}function et(){const t=globalThis.document?.getElementById(u);t&&(t.__sveHtmlScope=a.htmlScopeActive&&a.htmlFocus?{full:a.htmlFull,from:a.htmlFocus.from,to:a.htmlFocus.to,css:a.cssFull}:null)}function Ae(){const t=g.html?.state.doc.toString()??"";if(!a.htmlScopeActive||!a.htmlFocus){a.htmlFull=t,et();return}if(a.htmlFocus.from<0||a.htmlFocus.from>a.htmlFull.length||a.htmlFocus.to<a.htmlFocus.from){a.htmlScopeActive=!1,a.htmlFull=t,a.htmlFocus=null,et();return}a.htmlFull=a.htmlFull.slice(0,a.htmlFocus.from)+t+a.htmlFull.slice(a.htmlFocus.to),a.htmlFocus={from:a.htmlFocus.from,to:a.htmlFocus.from+t.length},et()}function Et(){return Ae(),a.htmlScopeActive?a.htmlFull:g.html?.state.doc.toString()??a.lastParts.html??""}function Te(){a.lastBracketNames=ke(Et()).map(t=>t.name)}function Lt(){a.lastCssSelectorNames=ns(g.css?.state.doc.toString()??a.cssFull)}function Cs(t,e){return Array.isArray(t)&&Array.isArray(e)&&t.length===e.length&&t.every((n,o)=>n===e[o])}function Bl(){const t=a.htmlScopeActive?$n():Et(),e=Se(t);e.length&&(a.cssFull=yn(a.cssFull,vn(a.cssFull,e),e[0].className))}function As(t,e){a.cssFull=Ja(a.cssFull,t,e),Bl(),a.cssFull=Qa(a.cssFull,e,t)}function Fl(t){if(a.applying||a.lastLocked||a.lastBracketNames==null)return;const e=ke(Et()).map(n=>n.name);Cs(a.lastBracketNames,e)||(As(a.lastBracketNames,e),a.lastBracketNames=e,Gt(),Lt())}function Il(){if(a.applying||a.lastLocked||a.lastCssSelectorNames==null||a.lastBracketNames==null||a.cssPane==="empty")return;const t=g.html,e=ns(g.css?.state.doc.toString()??"");if(!t||Cs(a.lastCssSelectorNames,e))return;const n=new Set(a.lastBracketNames),{renamed:o,removed:s}=os(a.lastCssSelectorNames,e);let r=t.state.doc.toString();const i=r;for(const l of o){const c=vt(l.to);!n.has(l.from)||!c||(r=Qn(r,d=>d===l.from?c:d))}for(const l of s)!n.has(l)||e.includes(l)||(r=Qn(r,c=>c===l?"":c));if(r!==i){a.applying=!0;try{Ee(r)}finally{a.applying=!1}}Te(),a.lastCssSelectorNames=e}function Ol(t,e){const n=vt(e),o=g.html;if(!n||!o||o.state.readOnly||n===t.name)return;a.applying=!0;try{o.dispatch({changes:{from:t.from,to:t.to,insert:n}})}finally{a.applying=!1}const s=a.lastBracketNames==null?[]:a.lastBracketNames.slice();Te(),As(s,a.lastBracketNames),Gt(),Lt(),a.lastWin&&(J(a.lastWin),L(a.lastWin))}function Pl(t,e){const n=t.document,s=g.html?.coordsAtPos(e.from);x(n),tt(n);const r=n.createElement("div"),i={getBoundingClientRect:()=>({left:s?.left??12,right:s?.right??12,top:s?.top??12,bottom:s?.bottom??12,width:0,height:0})};r.id=_,n.body.appendChild(r),H(t,i,r),r._sveApp=P(Sn,r,{label:m(t,"code_dock_css_rename_class"),placeholder:m(t,"code_dock_css_class_placeholder"),initial:e.name,onAdd:l=>{Ol(e,l),x(n)}})}function Ts(){return a.htmlScopePref&&Ce(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)?(a.htmlScopeActive=!0,et(),a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to)):(a.htmlScopeActive=!1,et(),a.htmlFull)}function Me(t,e,n){const o=g[t];if(!o)return;const s=o.state.doc.toString();a.applying=!0;try{if(s!==e){const[r,i,l]=Ss(s,e);o.dispatch({changes:{from:r,to:i,insert:l},...n?{selection:n,scrollIntoView:!0}:{}})}else n&&o.dispatch({selection:n,scrollIntoView:!0})}finally{a.applying=!1}}function Ee(t,e){Me("html",t,e)}function $n(){return a.htmlScopeActive?g.html?.state.doc.toString()??"":Ce(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)?a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to):""}function at(){const t=g.css?.state.doc.toString()??"";if(a.cssPane==="tree"){if(t===a.cssScopeSnapshot)return;const e=Se($n())[0]?.className||as(t);a.cssFull=yn(a.cssFull,t,e),a.cssScopeSnapshot=t}else a.cssPane==="full"&&(a.cssFull=t)}function Ms(t,e){for(const n of e||[])if(!U(t,n.className)||Ms(t,n.children))return!0;return!1}function Gt(){let t=a.cssFull,e=[],n=!1;a.cssValues||!a.htmlScopePref||!a.htmlScopeActive?(a.cssPane="full",t=a.cssFull):(e=Se($n()),e.length?(a.cssPane="tree",t=vn(a.cssFull,e),Ms(a.cssFull,e)&&(a.cssFull=yn(a.cssFull,t,e[0].className),n=!0)):(a.cssPane="empty",t="")),a.cssScopeSnapshot=t,Me("css",t),Lt(),a.lastWin&&(Jt(a.lastWin,!0),L(a.lastWin),n&&J(a.lastWin))}function Cn(t){const e=g.html;if(!e||!a.htmlFocus)return;a.htmlScopeActive||(a.htmlFull=e.state.doc.toString());const n=a.htmlFull.length,o=Math.max(0,Math.min(a.htmlFocus.from,n)),s=Math.max(o,Math.min(a.htmlFocus.to,n));if(s<=o)return;a.htmlFocus={from:o,to:s},a.htmlScopeActive=!0,et();const r=t==null?0:Math.max(0,Math.min(t-o,s-o));Ee(a.htmlFull.slice(o,s),{anchor:r,head:r}),Gt(),e.focus()}function An(t=!0,e=null){const n=g.html;if(!n)return;at(),Ae(),a.htmlScopeActive=!1,et();const o=a.htmlFull||n.state.doc.toString(),s=e!=null?{anchor:Math.max(0,Math.min(e,o.length))}:t&&Ce(a.htmlFocus?.from,a.htmlFocus?.to,o.length)?{anchor:a.htmlFocus.from,head:a.htmlFocus.to}:null;a.htmlFull=o,Ee(o,s),a.cssPane="full",a.cssScopeSnapshot=a.cssFull,Me("css",a.cssFull),Lt()}function Le(){a.htmlFocus=null,a.htmlScopeActive=!1,a.htmlFull="",a.cssFull="",a.cssPane="full",a.cssScopeSnapshot="",a.lastBracketNames=null,a.lastCssSelectorNames=null,et()}let Ht=!1;function $t(t){return!!t?.document.getElementById(Ho)}function Ge(t,e){if(!(!t||cn(t,"html_tree")===!1)){if(!e){$t(t)&&zo(t);return}$t(t)||(Ht=!0,Jr("html_tree").then(()=>{$t(t)||Qr(t)}).catch(()=>{}).finally(()=>{Ht=!1,q(t)}))}}function q(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-html-scope]");if(!e)return;a.htmlScopePref=Kt(t);const n=cn(t,"html_tree")===!1?a.htmlScopePref:$t(t)||Ht;e.setAttribute("aria-pressed",n?"true":"false"),e.title=m(t,n?"code_dock_html_scope_off":"code_dock_html_scope"),e.setAttribute("aria-label",e.title),e.innerHTML=Dr,t.document.getElementById(u)?.toggleAttribute("data-sve-html-scoped",a.htmlScopeActive),et()}function uo(t,e){e._sveHtmlScopeBound||(e._sveHtmlScopeBound=!0,a.htmlScopePref=Kt(t),Dl(t,e),Ge(t,a.htmlScopePref),e.querySelector("[data-sve-html-scope]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation();const o=$t(t)||Ht;a.htmlScopePref=!o,j(t,De,a.htmlScopePref?"1":"0"),a.htmlScopePref?a.htmlFocus&&(at(),Cn()):a.htmlScopeActive&&An(),Ge(t,a.htmlScopePref),q(t)}))}function Dl(t,e){e._sveTreeWatchBound||(e._sveTreeWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>{if(Ht||cn(t,"html_tree")===!1||!t.document.getElementById(u))return;const n=$t(t);n!==Kt(t)&&(a.htmlScopePref=n,j(t,De,n?"1":"0"),n?a.htmlFocus&&(at(),Cn()):a.htmlScopeActive&&An(),q(t))}))}const zl=new Set(["pre","textarea","script","style"]),Hl=/^(<\/|\{\{\s*\/)/;function Rl(t){let e=0;for(const n of t.split(`
`)){if(!n.trim())continue;const o=n.length-n.trimStart().length;o>0&&(e===0||o<e)&&(e=o)}return" ".repeat(e===2||e===3?e:4)}function jl(t){const e=String(t||"");if(!e.trim())return e;const n=[],o=l=>{for(const c of l||[])n.push(c),o(c.children)};o(ba(e));const s=Rl(e),r=[];let i=0;for(const l of e.split(`
`)){const c=i,d=l.trim();if(i+=l.length+1,!d){r.push("");continue}const f=c+(l.length-l.trimStart().length),h=n.filter(y=>y.from<f&&f<y.to);if(h.some(y=>zl.has(y.tag))){r.push(l);continue}const p=h.length-(Hl.test(d)?1:0);r.push(s.repeat(Math.max(p,0))+d)}return r.join(`
`)}function Xe(t,e){let n=0;for(;n<e;){const o=Nl(t,n);if(o===null){n+=1;continue}if(o===-1)return e;if(o>e)return o;n=o}return e}function Nl(t,e){if(t.startsWith("{{",e)){const n=t.indexOf("}}",e+2);return n===-1?-1:n+2}if(t.startsWith("<!--",e)){const n=t.indexOf("-->",e+4);return n===-1?-1:n+3}return t[e]==="<"&&/[A-Za-z/!?]/.test(t[e+1]||"")?Wl(t,e):null}function Wl(t,e){let n="",o=e+1;for(;o<t.length;){const s=t[o];if(n){s===n&&(n=""),o+=1;continue}if(t.startsWith("{{",o)){const r=t.indexOf("}}",o+2);if(r===-1)return-1;o=r+2;continue}if(s==='"'||s==="'"){n=s,o+=1;continue}if(s===">")return o+1;if(s==="<")return-1;o+=1}return-1}function Es(t,e){if(t.startsWith("{{",e)){const n=t.indexOf("}}",e+2);return n===-1?t.length:n+2}if(t.startsWith("<!--",e)){const n=t.indexOf("-->",e+4);return n===-1?t.length:n+3}return e}function Ze(t,e){if(t[e]!=="<")return null;const n=t.indexOf(">",e+1);if(n===-1)return null;const o=t.slice(e,n+1),s=o.match(/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/);if(s)return{kind:"close",name:s[1].toLowerCase(),from:e,to:n+1};const r=o.match(/^<([A-Za-z][A-Za-z0-9:-]*)/);if(!r)return{kind:"other",from:e,to:n+1};const i=r[1].toLowerCase();return{kind:/\/\s*>$/.test(o)||["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"].includes(i)?"void":"open",name:i,from:e,to:n+1}}function fo(t,e,n){let o=1,s=n;for(;s<t.length;){const r=Es(t,s);if(r!==s){s=r;continue}if(t[s]!=="<"){s+=1;continue}const i=Ze(t,s);if(!i)break;if(i.kind==="open"&&i.name===e)o+=1;else if(i.kind==="close"&&i.name===e&&(o-=1,o===0))return i;s=i.to}return null}function Xt(){const t=g.html;if(!t)return null;const e=t.state.selection.main.head,n=t.state.doc.toString(),o=[];let s=0;for(;s<e;){const c=Es(n,s);if(c!==s){s=c;continue}if(n[s]!=="<"){s+=1;continue}const d=Ze(n,s);if(!d||d.from>=e)break;if(d.kind==="open")o.push(d);else if(d.kind==="close"){for(let f=o.length-1;f>=0;f-=1)if(o[f].name===d.name){o.splice(f);break}}s=d.to}const r=n.lastIndexOf("<",Math.max(0,e-1));if(r!==-1&&n.indexOf(">",r)>=e){const c=Ze(n,r);if(c?.kind==="open"||c?.kind==="void"){const d=c.kind==="void"?null:fo(n,c.name,c.to);return d?{name:c.name,open:c,close:d}:{name:c.name,open:c,close:null}}}const i=o[o.length-1];if(!i)return null;const l=fo(n,i.name,i.to);return{name:i.name,open:i,close:l}}function Ye(t){return zr.includes(t)}function I(){g.html?.focus(),a.lastWin&&(J(a.lastWin),Be(a.lastWin))}function ht(t,e,n){const o=[...e].sort((s,r)=>r.from-s.from||r.to-s.to);t.dispatch({changes:o,selection:n})}function Rt(t,e,n){const o=g.html;if(!o||o.state.readOnly)return;const s=o.state.selection.main.head,r=o.state.doc.lineAt(s),i=r.text.slice(0,s-r.from),l=r.text.trim()?rt(r.text):Ie(o,r)||rt(r.text);let c=t,d=0;if(i.trim()!=="")c=`
${l}${t}`,d=1+l.length;else if(!r.text.trim()){c=`${l}${t}`,d=l.length,o.dispatch({changes:{from:r.from,to:r.to,insert:c},selection:ho(r.from+d+e,n)});return}o.dispatch({changes:{from:s,to:o.state.selection.main.to,insert:c},selection:ho(s+d+e,n)})}function ho(t,e){return e?{anchor:t,head:t+e}:{anchor:t}}function Ls(t){const{from:e}=t.state.selection.main,n=Xe(t.state.doc.toString(),e);return n!==e&&t.dispatch({selection:{anchor:n}}),n}function Bs(t,e,n){const o=g.html;!o||o.state.readOnly||(Ls(o),Rt(t,e,n))}const ql=new Set(["section","article","header","footer","main","nav","aside"]);function po(t){if(t==="a")return'<a href="">';if(t!=="section")return`<${t}>`;const e=a.lastWin?.Statamic?.$config?.get?.("sveSectionTag");return typeof e=="string"&&e.trim()?`<${t} ${e.trim()}>`:`<${t}>`}function Fs(){const t=g.html;if(!t||t.state.readOnly)return;const e=t.state.doc.toString(),n=(e.match(/^[ \t]*/)||[""])[0],o=jl(e).split(`
`).map(s=>s&&n+s).join(`
`);o!==e&&(ht(t,[{from:0,to:e.length,insert:o}],{anchor:0}),I())}function Is(t){const e=g.html;if(!e||e.state.readOnly)return;const n=e.state.selection.main,o=e.state.doc.toString();if(!n.empty&&Xe(o,n.from)===n.from&&Xe(o,n.to)===n.to){const c=o.slice(n.from,n.to),d=c.match(new RegExp(`^<${t}(\\s[^>]*)?>([\\s\\S]*)</${t}>$`,"i"));if(d){ht(e,[{from:n.from,to:n.to,insert:d[2]}],{anchor:n.from,head:n.from+d[2].length}),I();return}const f=po(t);let h=`${f}${c}</${t}>`,p=n.from+f.length;t==="ul"&&(h=`<ul>
  <li>${c}</li>
</ul>`,p=n.from+11),ht(e,[{from:n.from,to:n.to,insert:h}],{anchor:p,head:p+c.length}),I();return}const r=Xt();if(r?.open&&r.close){if(r.name===t){ht(e,[{from:r.close.from,to:r.close.to,insert:""},{from:r.open.from,to:r.open.to,insert:""}],{anchor:r.open.from}),I();return}if(Ye(r.name)&&Ye(t)){const c=o.slice(r.open.from,r.open.to).replace(new RegExp(`^<${r.name}`,"i"),`<${t}`);ht(e,[{from:r.close.from,to:r.close.to,insert:`</${t}>`},{from:r.open.from,to:r.open.to,insert:c}],{anchor:r.open.from+t.length+1}),I();return}}Ls(e);const l=(e.state.doc.lineAt(e.state.selection.main.head).text.match(/^\s*/)||[""])[0];if(t==="ul"){const c=`<ul>
${l}  <li></li>
${l}</ul>`;Rt(c,`<ul>
${l}  <li>`.length)}else{const c=po(t),d=`${c}</${t}>`,f=t==="a"?c.indexOf('""')+1:ql.has(t)?c.length:d.length;Rt(d,f)}I()}function Be(t){try{Vl(t)}catch{}}function Vl(t){const e=t?.document?.getElementById(u),o=Xt()?.name||"";if(e)for(const s of an){const r=e.querySelector(`[data-sve-html-tool="${s.id}"]`);if(!r)continue;(s.id==="heading"?Ye(o):o===s.tag)?r.setAttribute("data-active",""):r.removeAttribute("data-active")}}function mo(t,e,n){const o=t.document,s=Xt()?.name||"";x(o),e.setAttribute("data-open","");const r=o.createElement("div");r.id=_,o.body.appendChild(r),H(t,e,r),r._sveApp=P(Y,r,{kind:"choices",choices:n.map(i=>({value:i,label:i.toUpperCase(),active:s===i})),onPick:i=>{Is(i),x(o)}})}function Ul(t,e){const n=t.document;x(n),e.setAttribute("data-open","");const o=n.createElement("div");o.id=_,n.body.appendChild(o),H(t,e,o);const s=r=>{n.getElementById(_)&&(o._sveApp?.unmount(),o._sveApp=P(Y,o,{kind:"choices",choices:r,onPick:i=>{i&&(Bs(i,i.length),I()),x(n)}}),H(t,e,o))};s([{value:"",label:m(t,"code_dock_loading")}]),t.fetch("/!/sve/components",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(r=>r.ok?r.json():{items:[]}).then(r=>{const i=Array.isArray(r.items)?r.items:[];s(i.length?i.map(l=>({value:l.tag,label:l.name})):[{value:"",label:m(t,"component_none")}])}).catch(()=>s([{value:"",label:m(t,"component_none")}]))}function Kl(t){const e=vt(t),n=g.html,o=g.css;if(!e||n?.state.readOnly||o?.state.readOnly)return;const s=Xt();if(s?.open&&n){const r=n.state.doc.sliceString(s.open.from,s.open.to),i=Wa(r,e);i!==r&&n.dispatch({changes:{from:s.open.from,to:s.open.to,insert:i}})}at(),U(a.cssFull,e)||(a.cssFull=`${String(a.cssFull||"").trimEnd()}${a.cssFull?.trim()?`
`:""}.${e} {
}
`),Gt(),Te(),Lt(),a.lastWin&&(J(a.lastWin),Be(a.lastWin),L(a.lastWin))}function Gl(t,e){const n=t.document;if(e.hasAttribute("data-open")){x(n);return}x(n),e.setAttribute("data-open","");const o=n.createElement("div");o.id=_,n.body.appendChild(o),H(t,e,o),o._sveApp=P(Sn,o,{label:m(t,"code_dock_css_class_name"),placeholder:m(t,"code_dock_css_class_placeholder"),onAdd:s=>{Kl(s),x(n)}})}function Xl(t,e){const n=e.querySelector("[data-sve-css-add-class]");!n||n._sveBound||(n._sveBound=!0,n.innerHTML=Eu,n.title=m(t,"code_dock_css_add_class"),n.setAttribute("aria-label",n.title),n.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),a.styleMode==="tw"){x(t.document),xa(t,n);return}Gl(t,n)}))}function Tn(){const t={html:"",css:"",js:""};Ae(),at();for(const e of nt)e==="html"?t.html=a.htmlScopeActive?a.htmlFull:g.html?.state.doc.toString()??"":e==="css"?(t.css=a.lastWin?tl(a.cssFull,ut(a.lastWin)):a.cssFull,t.css=xl(t.css,t.html,xu)):t[e]=g[e]?.state.doc.toString()??"";return t}function Os(){if(a.cssValues||!(a.htmlScopePref&&Ce(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)))return a.cssPane="full",a.cssScopeSnapshot=a.cssFull,a.cssFull;const t=Se(a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to));if(!t.length)return a.cssPane="empty",a.cssScopeSnapshot="","";a.cssPane="tree";const e=vn(a.cssFull,t);return a.cssScopeSnapshot=e,e}function Zt(t,e){a.applying=!0;try{a.lastWin&&(a.htmlScopePref=Kt(a.lastWin)),a.htmlFull=t.html??"",a.cssFull=t.css??"";for(const n of nt){const o=g[n];let s=t[n]??"";try{s=n==="html"?Ts():n==="css"?Os():s}catch{s=n==="html"?a.htmlFull||t.html||"":n==="css"?a.cssFull||t.css||"":s}if(!o)continue;const r=o.state.doc.toString(),i=[Dt[n].reconfigure(ve.readOnly.of(!!e)),zt[n].reconfigure(D.editable.of(!e))];r!==s?o.dispatch({changes:{from:0,to:r.length,insert:s},effects:i}):o.dispatch({effects:i})}}finally{a.applying=!1}Te(),Lt(),dn("dock:html-changed"),a.lastWin&&(L(a.lastWin),Be(a.lastWin),q(a.lastWin),te(a.lastWin))}function Mn(t,e){return t.html===e.html&&t.css===e.css&&t.js===e.js}function Ps(t){return String(t||"").replace(/\/\*[\s\S]*?\*\//g,"").trim().replace(/\s*:\s*/g,": ").replace(/\s*;\s*/g,";").replace(/\s+/g," ").replace(/;+$/,";")}function Ds(t){const e=Ps(t).match(/^([a-z-]+)\s*:/i);return e?e[1].toLowerCase():""}function zs(t){const e=Ps(t),n=e.indexOf(":");return n===-1?"":e.slice(n+1).replace(/;$/,"").trim().toLowerCase()}function F(t){const e=String(t||"").trim().toLowerCase();return e==="start"||e==="flex-start"||e==="left"||e==="top"?"flex-start":e==="end"||e==="flex-end"||e==="right"||e==="bottom"?"flex-end":e==="row-reverse"?"row-reverse":e==="column-reverse"?"column-reverse":e}function jt(t){const e=F(t);return e==="flex"||e==="inline-flex"}function Fe(){const t=g.css;if(!t)return null;const e=t.state.selection.main.head,n=t.state.doc.toString(),o=[],s=[];for(let i=0;i<n.length;i+=1){if(n[i]==="{"&&n[i+1]==="{"){const l=n.indexOf("}}",i+2);if(l===-1)break;i=l+1;continue}if(n[i]==="{")o.push(i);else if(n[i]==="}"){const l=o.pop();l!=null&&s.push({from:l+1,to:i,text:n.slice(l+1,i),open:l})}}let r=null;for(const i of s)e<i.open||e>i.to||(!r||i.to-i.open<r.to-r.open)&&(r=i);return r}function Zl(t){const e=String(t||"");let n="",o=0;for(let s=0;s<e.length;s+=1){if(e[s]==="{"&&e[s+1]==="{"){const r=e.indexOf("}}",s+2);if(r===-1)break;o===0&&(n+=e.slice(s,r+2)),s=r+1;continue}if(e[s]==="{"){o+=1;continue}if(e[s]==="}"){o=Math.max(0,o-1);continue}o===0&&(n+=e[s])}return n}function go(t){const e={};for(const n of Zl(t).split(";")){const o=Ds(n);o&&(e[o]=zs(`${n};`))}return e}function Yl(t,e,n){if(!e||e.from>=e.to)return null;let o=t.state.doc.lineAt(e.from),s=0;for(;o.from<=e.to;){const r=Math.max(o.from,e.from),i=Math.min(o.to,e.to),l=t.state.doc.sliceString(r,i);if(s===0&&Ds(l)===n)return{from:r,to:i,text:l};if(s+=Jl(l),o.to>=t.state.doc.length||o.to>=e.to)break;o=t.state.doc.lineAt(o.to+1)}return null}function Jl(t){let e=0;const n=String(t);for(let o=0;o<n.length;o+=1){if(n[o]==="{"&&n[o+1]==="{"){const s=n.indexOf("}}",o+2);o=s===-1?n.length:s+1;continue}n[o]==="{"?e+=1:n[o]==="}"&&(e-=1)}return e}function rt(t){return(String(t).match(/^\s*/)||[""])[0]}function Ie(t,e,n){for(let o=e.number-1;o>=1;o-=1){const s=t.state.doc.line(o),r=s.text.trim();if(!r)continue;const i=rt(s.text);if(n&&(r==="{"||r.endsWith("{")))return`${i}  `;if(!(r==="}"||r.startsWith("}")))return i}return""}function Ql(t,e){const n=t.state.doc.lineAt(e);if(n.text.trim())return rt(n.text);const o=Ie(t,n,!0);if(o)return o;const s=Fe();return s?Hs(t,s):"  "}function Hs(t,e){const n=t.state.doc.lineAt(e.from),o=t.state.doc.lineAt(Math.max(e.from,e.to));for(let r=o.number;r>=n.number;r-=1){const i=t.state.doc.line(r),l=Math.max(i.from,e.from),c=Math.min(i.to,e.to),d=t.state.doc.sliceString(l,c);if(d.trim())return(d.match(/^\s*/)||[""])[0]||"  "}return`${(t.state.doc.lineAt(Math.max(0,e.from-1)).text.match(/^\s*/)||[""])[0]}  `}function vo(){g.css?.focus(),a.lastWin&&(J(a.lastWin),L(a.lastWin))}function Rs(t,e){if(!e)return"";const n=t.state.doc.toString();let o=0;for(let s=e.open-1;s>=0;s-=1)if(n[s]==="}"||n[s]==="{"||n[s]===";"){o=s+1;break}return n.slice(o,e.open).replace(/\/\*[\s\S]*?\*\//g,"").trim()}function tc(t,e){if(!a.cssState||!e)return e;const n=js(t,e);if(n)return n;const o=Rs(t,e);if(!o||o.startsWith("@"))return e;const s=t.state.doc.toString(),r=pt(s,e.open),i=pt(s,e.to)||`${r}    `,l=(t.state.doc.sliceString(e.from,e.to).match(/\n([^\S\n]*)$/)||[null,null])[1],c=l===null?e.to:e.to-l.length,d=`
${i}&${Pe()} {
${i}}
${l??r}`;t.dispatch({changes:{from:c,to:e.to,insert:d}});const f=t.state.doc.toString(),h=f.indexOf("{",c+d.indexOf("&")),p=h===-1?-1:Tt(f,h);return p===-1?e:{from:h+1,to:p,text:f.slice(h+1,p),open:h}}function pt(t,e){const n=t.lastIndexOf(`
`,e-1)+1;return(t.slice(n,e).match(/^\s*/)||[""])[0]}function K(t){const e=g.css;if(!e||e.state.readOnly||!t.length)return;const n=Fe(),o=t.some(l=>l.value!=null)?tc(e,n):n;if(!o){const l=t.filter(c=>c.value!=null).map(c=>`${c.property}: ${c.value};`).join(`
`);l&&oc(l),vo();return}const s=[],r=[],i=Hs(e,o);for(const l of t){const c=Yl(e,o,l.property);if(l.value==null){if(!c)continue;let d=c.from,f=c.to;e.state.doc.sliceString(f,f+1)===`
`&&(f+=1),d=Math.max(d,o.from),f=Math.min(f,o.to),s.push({from:d,to:f});continue}if(!(c&&F(zs(c.text))===F(l.value)))if(c){const d=(c.text.match(/^\s*/)||[""])[0];s.push({from:c.from,to:c.to,insert:`${d}${l.property}: ${l.value};`})}else r.push(`${i}${l.property}: ${l.value};`)}if(r.length){const l=!o.text.includes(`
`)||!/\n\s*$/.test(o.text)?`
`:"",c=(o.text.match(/\n([^\S\n]*)$/)||[null,null])[1],d=c===null?o.to:o.to-c.length,f=c===null?"":c;s.push({from:d,to:o.to,insert:`${l}${r.join(`
`)}
${f}`})}s.length&&(s.sort((l,c)=>c.from-l.from||c.to-l.to),e.dispatch({changes:s})),vo()}function Z(){const t=g.css,e=Fe();if(!e)return{};if(a.cssState&&t){const n=js(t,e);return n?go(n.text):{}}return go(e.text)}function js(t,e){const n=Rs(t,e),o=Pe();if(!n||n.startsWith("@"))return null;if(n.endsWith(o))return e;const s=t.state.doc.toString(),r=i=>{const l=Tt(s,i);return l===-1?null:{from:i+1,to:l,text:s.slice(i+1,l),open:i}};for(const i of[`&${o}`,`${n}${o}`]){const l=new RegExp(`(^|[^\\w-])${i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\s*\\{`,"g");let c;for(;c=l.exec(s);){const d=s.indexOf("{",c.index);if(i.startsWith("&")&&(d<e.from||d>e.to))continue;const f=r(d);if(f)return f}}return null}function ec(t){const e=Z(),n=jt(e.display),o=F(e["flex-direction"])||(n?"row":"");if(n&&o===t){const s=[];e["flex-direction"]&&s.push({property:"flex-direction",value:null}),jt(e.display)&&s.push({property:"display",value:null}),K(s);return}K([{property:"display",value:"flex"},{property:"flex-direction",value:t}])}function nc(t){const e=Z();if(t==="flex"&&jt(e.display)){K([{property:"justify-content",value:null},{property:"align-items",value:null},{property:"flex-direction",value:null},{property:"display",value:null}]);return}K([{property:"display",value:t}])}function oc(t){const e=g.css;if(!e||e.state.readOnly)return;const n=e.state.selection.main.head,o=e.state.doc.lineAt(n),s=o.text.slice(0,n-o.from),r=o.text.slice(n-o.from),i=Ql(e,n),l=t.replace(/;?$/,";");if(s.trim()===""&&r.trim()===""){const d=`${i}${l}
${i}`;e.dispatch({changes:{from:o.from,to:o.to,insert:d},selection:{anchor:o.from+d.length}});return}const c=`
${i}${l}
${i}`;e.dispatch({changes:{from:n,to:e.state.selection.main.to,insert:c},selection:{anchor:n+c.length}})}function L(t){try{sc(t),Qt(t)}catch{}}function sc(t){const e=a.styleMode==="tw",n=e?{}:Z(),o=jt(e?Xn("display"):n.display),s=F(n["flex-direction"])||(o?"row":""),r=i=>e?_a()&&!!i.tw&&!!Xn(i.tw):!!i.css&&i.css in n;it.tools=Rr.map(i=>{const l=(i.kids||[]).filter(c=>c.when!=="flex"||o).map(c=>({id:c.id,title:c.title,icon:Fo[c.icon]||"",sep:!!c.sep,open:a.cssOpenMenu===c.id,active:e?r(c):c.kind==="display"?o:c.kind==="flexDir"?o&&s===c.value:c.value?F(n[c.css])===F(c.value):r(c)}));return{id:i.id,title:i.title,icon:Fo[i.id]||Bu[i.id]||"",open:a.cssOpenTool===i.id||a.cssOpenMenu===i.id,kids:l,active:i.value?!e&&F(n[i.css])===F(i.value):r(i)||l.some(c=>c.active)}})}function x(t){const e=t?.getElementById(_);a.cssOpenMenu="",e?._sveApp?.unmount(),e?.remove(),t?.querySelectorAll("[data-sve-css-tool][data-open], [data-sve-html-tool][data-open], [data-sve-css-add-class][data-open], [data-sve-code-history][data-open]").forEach(n=>n.removeAttribute("data-open"))}function af(t){x(t),R(t),tt(t);for(const e of nt)g[e]&&_r?.(g[e])}function Ns(t){if(a.cssColorsPromise)return a.cssColorsPromise;const e=t.Statamic?.$config?.get?.("cpUrl")||`/${t.Statamic?.$config?.get?.("cpRoute")||"cp"}`;return a.cssColorsPromise=t.fetch(`${e}/color-scheme/swatches`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async n=>{if(!n.ok)return[];const o=await n.json().catch(()=>[]);return Array.isArray(o)?o:[]}).catch(()=>[]).then(n=>{const o=new Set,s=[];for(const r of n){const i=r.var||r.value||r.handle,l=String(i||"").trim().replace(/^var\((.+)\)$/,"$1");!l||o.has(l)||(o.add(l),s.push({name:l,hex:r.hex||r.color||""}))}for(const[r,i]of Hr)o.has(r)||(o.add(r),s.push({name:r,hex:i}));return s}),a.cssColorsPromise}function Ws(t,e){const n=Z()[e]||"",o=String(n).match(/^var\(\s*([^)]+?)\s*\)$/i),s=o?o[1].trim():"";for(const r of t.querySelectorAll("[data-sve-css-token]"))s&&r.getAttribute("data-sve-css-token")===s?r.setAttribute("data-active",""):r.removeAttribute("data-active")}function H(t,e,n){const o=e.getBoundingClientRect(),s=8;n.style.left=`${Math.max(s,Math.min(o.left,t.innerWidth-220))}px`,n.style.top=`${Math.max(s,o.bottom+4)}px`}function rc(t,e,n){const o=t.document;x(o),e.setAttribute("data-open","");const s=o.createElement("div");s.id=_,o.body.appendChild(s),H(t,e,s);const r=i=>{s._sveApp?.unmount(),s._sveApp=P(Y,s,{kind:"colors",swatches:i,onClear:()=>{K([{property:n,value:null}]),x(o)},onPick:l=>{K([{property:n,value:`var(${l})`}]),x(o)}}),Ws(s,n)};r(Hr.map(([i,l])=>({name:i,hex:l}))),Ns(t).then(i=>{o.getElementById(_)&&r(i.map(l=>({name:l.name,hex:l.hex})))})}function ac(t,e,n,o){const s=t.document;x(s),e.setAttribute("data-open","");const r=s.createElement("div"),i=Z()[n]||"";r.id=_,s.body.appendChild(r),H(t,e,r),r._sveApp=P(Y,r,{kind:"choices",choices:(o||[]).map(l=>({value:l,label:l,active:F(l)===F(i)})),onPick:l=>{const c=F(l)===F(Z()[n]||"");K([{property:n,value:c?null:l}]),x(s)}})}function yo(t,e,n,o=[]){const s=t.document;x(s),e.setAttribute("data-open",""),ka(t);const r=s.createElement("div");r.id=_,s.body.appendChild(r),H(t,e,r);const i=()=>{const l=[...o.map(d=>({value:d,label:d})),...Sa(t,n).map(d=>({value:d.value,label:d.value}))],c=Z()[n]||"";r._sveApp?.unmount(),r._sveApp=P(Y,r,{kind:"choices",choices:l.map(d=>({...d,active:F(d.value)===F(c)})),onPick:d=>{K([{property:n,value:d||null}]),x(s)}})};i(),Ns(t).then(()=>{s.getElementById(_)===r&&i()})}function ic(t,e,n){const o=t.document;x(o),e.setAttribute("data-open","");const s=o.createElement("div");s.id=_,o.body.appendChild(s),H(t,e,s),s._sveApp=P(Y,s,{kind:"choices",choices:Lu.map(r=>({value:r,token:r,label:r})),onPick:r=>{K([{property:n,value:`var(${r})`}]),x(o)}}),Ws(s,n)}const bo=/\{\{#[\s\S]*?#\}\}|\{\{[\s\S]*?\}\}/g,xo=/<!--[\s\S]*?-->/g,ko=/<(\/?)([A-Za-z][A-Za-z0-9-]*)/g,qs=/^\{\{\s*(?:\/|endif\b|endunless\b)/,lc=/^\{\{\s*(?:\/\s*(?:if|unless)\b|endif\b|endunless\b)/,cc=/^\{\{\s*\/\s*partial\b/;function We(t,e,n){return t.some(o=>e<o.to&&n>o.from)}function dc(t){const e=new Map;for(const n of wa(t)){const o=n.kind==="loop"?"loop":"if";e.set(n.from,o);const s=t.lastIndexOf("{{",n.to-2);s>=n.openTo&&qs.test(t.slice(s,n.to))&&e.set(s,o)}for(const n of Wo(t))e.set(n.from,"component");return e}function uc(t){const e=String(t||""),n=[],o=[];xo.lastIndex=0;let s;for(;s=xo.exec(e);)n.push({from:s.index,to:s.index+s[0].length});const r=dc(e),i=[];for(bo.lastIndex=0;s=bo.exec(e);){const l=s.index,c=l+s[0].length,d=s[0];if(We(n,l,c))continue;if(i.push({from:l,to:c}),d.startsWith("{{#")){o.push({from:l,to:c,cls:"comment"});continue}const f=qs.test(d),h=r.get(l)||(f&&lc.test(d)?"if":"")||(f&&cc.test(d)?"component":"");o.push({from:l,to:c,cls:(h?`fam-${h}`:"antlers")+(f?"-close":"")})}for(ko.lastIndex=0;s=ko.exec(e);){const l=s.index+1+s[1].length,c=l+s[2].length;We(n,l,c)||We(i,l,c)||o.push({from:l,to:c,cls:`fam-${ta(s[2])}`})}return o.sort((l,c)=>l.from-c.from),o}function So(t,e,n){const o=new e.RangeSetBuilder;let s=0;for(const r of uc(t.doc.toString()))r.from<s||(o.add(r.from,r.to,n(r.cls)),s=r.to);return o.finish()}function fc(t){const e=new Map,n=r=>r==="comment"?"sve-cm-antlers-comment":r==="antlers"?"sve-cm-antlers":r==="antlers-close"?"sve-cm-antlers sve-cm-antlers-close":r.endsWith("-close")?`sve-cm-${r.slice(0,-6)} sve-cm-antlers-close`:`sve-cm-${r}`,o=r=>(e.has(r)||e.set(r,t.Decoration.mark({class:n(r)})),e.get(r));return{extensions:[t.StateField.define({create(r){return So(r,t,o)},update(r,i){return i.docChanged?So(i.state,t,o):r},provide:r=>t.EditorView.decorations.from(r)})]}}const A=ln({tag:"",emptyText:"",addLabel:"",dropTitle:"",chips:[],states:[],canEdit:!1,onAdd:null,onChip:null,onDrop:null}),hc={class:"sve-al"},pc={class:"sve-al-head"},mc={key:0,class:"sve-al-tag"},gc=["title","disabled"],vc={key:0,class:"sve-al-empty"},yc={class:"sve-al-chips"},bc=["data-sve-al-chip","title","disabled","onClick"],xc={class:"sve-al-name"},kc={key:0,class:"sve-al-value"},Sc=["title","onClick"],_c={__name:"AlpinePanel",setup(t){return(e,n)=>(k(),S("div",hc,[v("div",pc,[$(A).tag?(k(),S("span",mc,"<"+M($(A).tag)+">",1)):X("",!0),(k(!0),S(N,null,ct($(A).states,o=>(k(),S("span",{key:o,class:"sve-al-state"},M(o),1))),128)),n[1]||(n[1]=v("span",{class:"sve-al-gap"},null,-1)),v("button",{type:"button","data-sve-al-add":"",title:$(A).addLabel,disabled:!$(A).canEdit,onClick:n[0]||(n[0]=B(o=>$(A).onAdd?.(o),["prevent","stop"]))},"+",8,gc)]),$(A).chips.length?X("",!0):(k(),S("div",vc,M($(A).emptyText),1)),v("div",yc,[(k(!0),S(N,null,ct($(A).chips,o=>(k(),S("span",{key:o.id,class:"sve-al-chip-wrap"},[v("button",{type:"button","data-sve-al-chip":o.id,title:o.title,disabled:!$(A).canEdit,onClick:B(s=>$(A).onChip?.(s,o.id),["prevent","stop"])},[v("span",xc,M(o.name),1),o.value?(k(),S("span",kc,M(o.value),1)):X("",!0)],8,bc),$(A).canEdit?(k(),S("button",{key:0,type:"button",class:"sve-al-drop",title:$(A).dropTitle,onClick:B(s=>$(A).onDrop?.(o.id),["prevent","stop"])},"−",8,Sc)):X("",!0)]))),128))])]))}},wc=Po(_c,[["__scopeId","data-v-15add965"]]),$c=[{id:"state",lang:"alpine_group_state"},{id:"act",lang:"alpine_group_act"},{id:"react",lang:"alpine_group_react"}],_o=[{id:"state",group:"state",label:"alpine_state",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: false }"}]},{id:"state_text",group:"state",label:"alpine_state_text",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: '|' }"}]},{id:"toggle",group:"act",label:"alpine_toggle",icon:"toggle",needsName:!0,attrs:[{name:"@click",value:":name = !:name"}]},{id:"open",group:"act",label:"alpine_open",icon:"open",needsName:!0,attrs:[{name:"@click",value:":name = true"}]},{id:"close",group:"act",label:"alpine_close",icon:"close",needsName:!0,attrs:[{name:"@click",value:":name = false"}]},{id:"open_hover",group:"act",label:"alpine_open_hover",icon:"open",needsName:!0,attrs:[{name:"@mouseenter",value:":name = true"}]},{id:"close_leave",group:"act",label:"alpine_close_leave",icon:"close",needsName:!0,attrs:[{name:"@mouseleave",value:":name = false"}]},{id:"open_focus",group:"act",label:"alpine_open_focus",icon:"open",needsName:!0,attrs:[{name:"@focusin",value:":name = true"}]},{id:"close_blur",group:"act",label:"alpine_close_blur",icon:"close",needsName:!0,attrs:[{name:"@focusout",value:":name = false"}]},{id:"close_outside",group:"act",label:"alpine_close_outside",icon:"outside",needsName:!0,attrs:[{name:"@click.outside",value:":name = false"}]},{id:"close_escape",group:"act",label:"alpine_close_escape",icon:"escape",needsName:!0,attrs:[{name:"@keydown.escape.window",value:":name = false"}]},{id:"show",group:"react",label:"alpine_show",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"}]},{id:"show_smooth",group:"react",label:"alpine_show_smooth",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"},{name:"x-transition",value:""}]},{id:"hide_until_ready",group:"react",label:"alpine_hide_until_ready",icon:"cloak",attrs:[{name:"x-cloak",value:""}]},{id:"class_when",group:"react",label:"alpine_class_when",icon:"klass",needsName:!0,attrs:[{name:":class",value:":name ? '|' : ''"}]},{id:"text",group:"react",label:"alpine_text",icon:"text",needsName:!0,attrs:[{name:"x-text",value:":name"}]}];function Cc(t){return(t?.attrs||[]).map(e=>e.name).join(" ")}const Ac=/^(x-[\w:.-]+|@[\w:.-]+|:[\w-]+)$/;function Tc(t){return Ac.test(String(t||""))}function Yt(t){const e=String(t||""),n=[],o=/([@:a-zA-Z_][\w:.@-]*)(\s*=\s*(["'])([\s\S]*?)\3)?/g;let s,r=!0;for(;s=o.exec(e);){if(r){r=!1;continue}s[0].trim()&&n.push({name:s[1],value:s[4]??"",from:s.index,to:s.index+s[0].length,alpine:Tc(s[1])})}return n}function Vs(t){const e=String(t||"").trim().replace(/^\{|\}$/g,""),n=[],o=/(^|,)\s*([a-zA-Z_$][\w$]*)\s*:/g;let s;for(;s=o.exec(e);)n.push(s[2]);return n}function Mc(t,e){return t.map(n=>({name:n.name,value:String(n.value).replaceAll(":name:",`${e}:`).replaceAll(":name",e)}))}function En(t,e,n){const o=g.html,s=bt();if(!o||o.state.readOnly||!s)return;const r=a.htmlScopeActive&&!!a.htmlFocus,i=r?a.htmlFocus.from:0,c=(r?a.htmlFull:o.state.doc.toString()).slice(s.from,s.openTo),d=n===""?e:`${e}="${n}"`,f=Yt(c).find(p=>p.name===e);let h;if(f)h=c.slice(0,f.from)+d+c.slice(f.to);else{const p=c.search(/\s|\/?>$/);h=p===-1?c:`${c.slice(0,p)} ${d}${c.slice(p)}`}h!==c&&(ht(o,[{from:s.from-i,to:s.openTo-i,insert:h}],null),Oe(t))}function Ec(t,e){const n=g.html,o=bt();if(!n||n.state.readOnly||!o)return;const s=a.htmlScopeActive&&!!a.htmlFocus,r=s?a.htmlFocus.from:0,l=(s?a.htmlFull:n.state.doc.toString()).slice(o.from,o.openTo),c=Yt(l).find(h=>h.name===e);if(!c)return;let d=c.from;for(;d>0&&/\s/.test(l[d-1]);)d-=1;const f=l.slice(0,d)+l.slice(c.to);ht(n,[{from:o.from-r,to:o.openTo-r,insert:f}],null),Oe(t)}function Je(t){const e=g.html;if(!e)return[];const o=a.htmlScopeActive&&!!a.htmlFocus?a.htmlFull:e.state.doc.toString(),s=bt(),r=[],i=Uo(xe(o),new Set);for(const l of i){if(!s||l.from>s.from||l.to<s.to)continue;const c=Yt(o.slice(l.from,l.openTo)).find(d=>d.name==="x-data");c&&r.push(...Vs(c.value))}return[...new Set(r)]}function Lc(t){const e=g.html,n=bt();if(!e||!n)return[];const s=a.htmlScopeActive&&!!a.htmlFocus?a.htmlFull:e.state.doc.toString(),r=Yt(s.slice(n.from,n.openTo)).find(i=>i.name==="x-data");return r?Vs(r.value):[]}function Bc(t,e){const n=t.document;x(n),e.setAttribute("data-open","");const o=Je(),s=n.createElement("div");s.id=_,n.body.appendChild(s),H(t,e,s);const r=!o.length,i=!r&&!Lc().length,c=$c.filter(d=>d.id==="state"?!i:!r).flatMap(d=>{const f=_o.filter(h=>h.group===d.id);return f.length?[{value:`\0${d.id}`,label:m(t,r&&d.id==="state"?"alpine_group_state_first":d.lang),heading:!0},...f.map(h=>({value:h.id,label:m(t,h.label),hint:Cc(h)}))]:[]});r&&c.push({value:"\0note",label:m(t,"alpine_needs_state"),note:!0}),s._sveApp=P(Y,s,{kind:"choices",choices:c,onPick:d=>{const f=_o.find(h=>h.id===d);if(x(n),!!f){if(!f.needsName){for(const h of f.attrs)En(t,h.name,h.value);return}Fc(t,e,f,o)}}})}function Fc(t,e,n,o){const s=t.document,r=l=>{const c=String(l||"").trim().replace(/[^\w$]/g,"");if(x(s),!!c)for(const d of Mc(n.attrs,c))En(t,d.name,d.value.replace("|",""))};if(!o.length){Qe(t,e,r);return}const i=s.createElement("div");i.id=_,s.body.appendChild(i),H(t,e,i),i._sveApp=P(Y,i,{kind:"choices",choices:[{value:"\0head",label:m(t,"alpine_name"),heading:!0},...o.map(l=>({value:l,label:l})),{value:"\0new",label:m(t,"alpine_new_name")}],onPick:l=>{if(l==="\0new"){Qe(t,e,r);return}r(l)}})}function Qe(t,e,n){const o=t.document;x(o),e.setAttribute("data-open","");const s=o.createElement("div");s.id=_,o.body.appendChild(s),H(t,e,s),s._sveApp=P(Sn,s,{label:m(t,"alpine_name"),placeholder:m(t,"alpine_name_placeholder"),onAdd:r=>n(r)})}function Oe(t){const n=t?.document.getElementById(u)?.querySelector("[data-sve-alpine-host]");if(!n)return;const o=bt(),s=g.html,r=a.htmlScopeActive&&!!a.htmlFocus,i=s?r?a.htmlFull:s.state.doc.toString():"",l=o?Yt(i.slice(o.from,o.openTo)):[];A.tag=o?.tag||"",A.canEdit=!a.lastLocked&&!!o,A.emptyText=m(t,o?Je().length?"alpine_none_ready":"alpine_none":"alpine_pick"),A.addLabel=m(t,"alpine_add"),A.dropTitle=m(t,"alpine_remove"),A.states=Je(),A.chips=l.filter(c=>c.alpine).map(c=>({id:c.name,name:c.name,value:c.value,title:c.value?`${c.name}="${c.value}"`:c.name})),A.onAdd=c=>Bc(t,c.currentTarget),A.onDrop=c=>Ec(t,c),A.onChip=(c,d)=>{A.chips.find(h=>h.id===d)&&Qe(t,c.currentTarget,h=>En(t,d,h))},n._sveMounted||(n._sveMounted=!0,Ut(n,wc))}const Ic=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]),Oc=new Set(["html","head","body"]),wo=new Set(["if","unless","style_push","script_push","sve_defaults","once","noparse","foreach","forelse","loop","cache","nocache","scope","collection","nav","structure","taxonomy","users","search:results","form:create","form:errors"]),Pc=new Set(["collection:count"]);function $o(t){return Pc.has(t)?!1:wo.has(t)||wo.has(t.split(":")[0])}const Dc=new Set(["CloseTag","MismatchedCloseTag","IncompleteCloseTag"]),zc=/^\s*(\/?)\s*([A-Za-z_][A-Za-z0-9_.:-]*)([\s\S]*)$/,Hc=/^\{\{\s*\/?\s*([A-Za-z_][A-Za-z0-9_.:-]*)/,Rc=3e5;function jc(t){const e=String(t||""),n=[],o=[];let s=0;for(;s<e.length;){const r=e.indexOf("{{",s);if(r===-1)break;if(e.startsWith("{{#",r)){const d=e.indexOf("#}}",r+3);if(d===-1){o.push(r);break}n.push({from:r,to:d+3,comment:!0,body:""}),s=d+3;continue}let i=0,l=r,c=-1;for(;l<e.length;){if(e.startsWith("{{",l)){i+=1,l+=2;continue}if(e.startsWith("}}",l)){if(i-=1,l+=2,i===0){c=l;break}continue}l+=1}if(c===-1){o.push(r),s=r+2;continue}n.push({from:r,to:c,comment:!1,body:e.slice(r+2,c-2)}),s=c}return{tags:n,unclosed:o}}function Nc(t,e){let n=t;for(const o of e)n=n.slice(0,o.from)+" ".repeat(o.to-o.from)+n.slice(o.to);return n}function Wc(t,e){return t===e||t.startsWith(`${e}:`)}function re(t,e){return(t.slice(e,e+80).match(/^<\/?([A-Za-z][A-Za-z0-9:-]*)/)?.[1]||"").toLowerCase()}function qc(t,e,n,o,s){const r=c=>s.has(c.name)&&!/\||\?\?/.test(c.rest);for(const c of n){const d=t.slice(c,c+80).match(Hc)?.[1]||"…";o.push({from:c,to:c+2,key:"code_dock_problem_antlers_unclosed",args:{name:d}})}const i=[],l=[];for(const c of e){if(c.comment)continue;const d=c.body.match(zc);if(!d)continue;const f=!!d[1],h=d[2].toLowerCase(),p=d[3];if(!f&&(h==="elseif"||h==="else")){let y=-1;for(let b=i.length-1;b>=0;b-=1)if(i[b].name==="if"||i[b].name==="unless"){y=b;break}if(y===-1){o.push({from:c.from,to:c.to,key:"code_dock_problem_branch_stray",args:{name:h}});continue}l.push({from:i[y].to,to:c.from}),i[y]={...i[y],to:c.to},i.length=y+1;continue}if(f||h==="endif"||h==="endunless"){const y=h==="endif"?"if":h==="endunless"?"unless":h;let b=-1;for(let E=i.length-1;E>=0;E-=1)if(Wc(i[E].name,y)){b=E;break}if(b===-1){o.push({from:c.from,to:c.to,key:"code_dock_problem_pair_stray",args:{name:y}});continue}for(const E of i.slice(b+1))$o(E.name)&&o.push({from:E.from,to:E.to,key:"code_dock_problem_pair_unclosed",args:{name:E.name}});(y==="if"||y==="unless")&&l.push({from:i[b].to,to:c.from}),i.length=b;continue}p.trim().startsWith("=")||i.push({name:h,rest:p,from:c.from,to:c.to})}for(const c of i)$o(c.name)?o.push({from:c.from,to:c.to,key:"code_dock_problem_pair_unclosed",args:{name:c.name}}):r(c)&&o.push({from:c.from,to:c.to,key:"code_dock_problem_list_unclosed",args:{name:c.name}});return l}function Vc(t,e,n,o){const s=e.parse(t),r=new Set,i=[];s.iterate({enter(l){if(l.name==="MismatchedCloseTag"){i.push({from:l.from,to:l.to,key:"code_dock_problem_tag_stray",args:{tag:re(t,l.from)}});return}if(l.name==="IncompleteCloseTag"){i.push({from:l.from,to:l.to,key:"code_dock_problem_tag_unfinished",args:{tag:re(t,l.from)}});return}if(l.type.isError){const h=l.node.parent;h&&(h.name==="OpenTag"||h.name==="CloseTag")&&(r.add(h.from),i.push({from:h.from,to:Math.max(h.from+1,l.from),key:"code_dock_problem_tag_unfinished",args:{tag:re(t,h.from)}}));return}if(l.name!=="Element")return;let c=null,d=!1;for(let h=l.node.firstChild;h;h=h.nextSibling)h.name==="OpenTag"&&(c=h),Dc.has(h.name)&&(d=!0);if(!c||d)return;const f=re(t,c.from);!f||Ic.has(f)||Oc.has(f)||n.some(h=>c.from>=h.from&&c.from<h.to&&l.to>h.to)||i.push({from:c.from,to:c.to,key:"code_dock_problem_tag_unclosed",args:{tag:f}})}});for(const l of i)l.key==="code_dock_problem_tag_unclosed"&&r.has(l.from)||l.args.tag&&o.push(l)}function Uc(t,e,n={}){const o=String(t||"");if(!o.trim()||o.length>Rc)return[];const s=[];try{const{tags:i,unclosed:l}=jc(o),c=qc(o,i,l,s,new Set(n.lists||[]));e&&Vc(Nc(o,i),e,c,s)}catch{return[]}const r=new Set;return s.sort((i,l)=>i.from-l.from||i.to-l.to).filter(i=>{const l=`${i.from}:${i.key}`;return r.has(l)?!1:(r.add(l),!0)})}function Kc(t,e,n=()=>({})){const o=t.Decoration.mark({class:"sve-cm-problem"}),s=t.StateEffect.define(),r=l=>{const c=Uc(l.doc.toString(),e,n()),d=new t.RangeSetBuilder;let f=0;for(const h of c)h.from<f||h.to<=h.from||(d.add(h.from,h.to,o),f=h.to);return{problems:c,decorations:d.finish()}},i=t.StateField.define({create(l){return r(l)},update(l,c){return c.docChanged||c.effects.some(d=>d.is(s))?r(c.state):l},provide:l=>t.EditorView.decorations.from(l,c=>c.decorations)});return{field:i,relint:s,extensions:[i]}}const Gc=new Set(["replicator","grid","list","array","table"]);let ce=new Set,qe=null;function Us(t){return t.document.getElementById(u)?.querySelector("[data-sve-html-problems]")||null}function Xc(t,e,n){const o=Us(t);if(!o)return;const s=e.state.doc,r=n.map(c=>({from:c.from,line:s.lineAt(Math.min(c.from,s.length)).number,text:m(t,c.key,c.args)})),i=r.map(c=>`${c.line}:${c.text}`).join(`
`);if(o.dataset.sveSignature===i||(o.dataset.sveSignature=i,o.hidden=r.length===0,o.replaceChildren(),!r.length))return;const l=t.document.createElement("span");l.setAttribute("data-sve-problems-title",""),l.textContent=m(t,"code_dock_problems_title"),o.appendChild(l);for(const c of r){const d=t.document.createElement("button"),f=t.document.createElement("b");d.type="button",d.dataset.sveProblemAt=String(c.from),f.textContent=m(t,"code_dock_problem_line",{line:c.line}),d.append(f,t.document.createTextNode(` ${c.text}`)),o.appendChild(d)}}function Zc(t){const e=Us(t);!e||e._sveBound||(e._sveBound=!0,e.addEventListener("mousedown",n=>n.preventDefault()),e.addEventListener("click",n=>{const o=n.target.closest("[data-sve-problem-at]"),s=g.html;if(!o||!s)return;n.preventDefault(),n.stopPropagation();const r=Math.min(Number(o.dataset.sveProblemAt)||0,s.state.doc.length);s.dispatch({selection:{anchor:r},effects:D.scrollIntoView(r,{y:"center"})}),s.focus()}))}function Yc(t){const e=[],n=o=>{for(const s of o||[])s?.loop&&Gc.has(s.type)&&s.var&&!s.parent&&e.push(s.var)};n(t?.section);for(const o of t?.page||[])n(o?.items);return e}function Jc(t,e,n){const o={collection:ls(t),set:cs(a.lastType),view:"",scope:""},s=o.set?bn(o):"";if(s===qe)return;qe=s;const r=l=>{if(qe!==s)return;const c=new Set(Yc(l)),d=c.size===ce.size&&[...c].every(f=>ce.has(f));ce=c,!d&&g.html===e&&t.queueMicrotask(()=>{g.html===e&&e.dispatch({effects:n.of(null)})})};if(!s){r(null);return}const i=ds(s);if(i){r(i);return}us(t,o).then(r)}function Qc(t){if(!a.htmlLintUi){const{field:e,relint:n}=Kc({Decoration:_t,StateField:kt,StateEffect:ne,RangeSetBuilder:St,EditorView:D},Rn.parser,()=>({lists:ce})),o=D.updateListener.of(s=>{const r=s.transactions.some(i=>i.effects.some(l=>l.is(n)));!s.docChanged&&!r||(s.docChanged&&Jc(t,s.view,n),Xc(t,s.view,s.state.field(e).problems))});a.htmlLintUi={extensions:[e,o]}}return Zc(t),a.htmlLintUi}function td(){if(a.cssGhostUi)return a.cssGhostUi;const t=_t.mark({class:"sve-css-ghost"}),e=n=>{const o=new St;if(!a.lastWin)return o.finish();try{for(const s of el(n.doc.toString(),ut(a.lastWin)))o.add(s.from,s.to,t)}catch{}return o.finish()};return a.cssGhostUi=kt.define({create:n=>e(n),update:(n,o)=>o.docChanged?e(o.state):n,provide:n=>D.decorations.from(n)}),a.cssGhostUi}let ae=null,me=null;function ed(){if(ae)return ae;me=ne.define();const t=_t.line({class:"sve-css-id"}),e=n=>{const o=new St;if(!a.lastWin||!a.cssValues)return o.finish();try{const s=n.doc;for(const r of fe(s.toString(),ut(a.lastWin),a.cssSize)){const i=s.lineAt(Math.min(r.from,s.length)).number,l=s.lineAt(Math.min(Math.max(r.to-1,r.from),s.length)).number;for(let c=i;c<=l;c+=1)o.add(s.line(c).from,s.line(c).from,t)}}catch{}return o.finish()};return ae=kt.define({create:n=>e(n),update:(n,o)=>o.docChanged||o.effects.some(s=>s.is(me))?e(o.state):n,provide:n=>D.decorations.from(n)}),ae}function Ln(){me&&g.css&&g.css.dispatch({effects:me.of(null)})}function nd(){return a.htmlPartialUi||(a.htmlPartialUi=Aa({Decoration:_t,StateField:kt,StateEffect:ne,RangeSetBuilder:St,EditorView:D})),a.htmlPartialUi}function od(){return a.htmlAntlersUi||(a.htmlAntlersUi=fc({Decoration:_t,StateField:kt,RangeSetBuilder:St,EditorView:D})),a.htmlAntlersUi}function sd(){return a.htmlClassTokenUi||(a.htmlClassTokenUi=ei({Decoration:_t,StateField:kt,StateEffect:ne,RangeSetBuilder:St,EditorView:D})),a.htmlClassTokenUi}function rd(t,e,n){g[e]?.destroy();const o=on.of([{key:"Mod-s",run:()=>(W(t.document),!0)}]);g[e]=new D({state:ve.create({doc:"",extensions:[hr(),pr(),mr(),br(),nu(e),kr(),xr({tooltipClass:()=>"sve-tw-complete"}),...e==="html"?[Rn.data.of({autocomplete:$a(t)}),Ca($r,t)]:[],...e==="html"?[...Da(),za()]:[],...e==="css"?[Mr(),td(),ed()]:[],on.of([...gr,...e==="html"?[{key:"Tab",run:Ha}]:[],vr,...yr,...wr,...Sr]),o,D.lineWrapping,...e==="html"||e==="css"?nd().extensions:[],...e==="html"?od().extensions:[],...e==="html"?Qc(t).extensions:[],...e==="html"?sd().extensions:[],Dt[e].of(ve.readOnly.of(!!a.lastLocked)),zt[e].of(D.editable.of(!a.lastLocked)),D.updateListener.of(s=>{e==="html"&&s.docChanged&&!a.applying&&(Fl(),dn("dock:html-changed")),e==="css"&&s.docChanged&&!a.applying&&Il(),s.docChanged&&J(t),e==="css"&&(s.docChanged||s.selectionSet)&&L(t),e==="css"&&s.docChanged&&!a.applying&&Jt(t),e==="html"&&(s.docChanged||s.selectionSet)&&(Be(t),Oe(t),a.applying||te(t))}),...ma(w,{height:"auto",background:"#1E1E21",scroller:{overflow:"visible",height:"auto",minHeight:0},extraTags:s=>[{tag:s.tagName,color:"#4ec9b0"},{tag:s.attributeName,color:"#9cdcfe"},{tag:s.attributeValue,color:"#ce9178"},{tag:s.angleBracket,color:"#808080"}]})]}),parent:n})}function ad(t){if(!t||t.querySelector(".cm-editor"))return;t.replaceChildren();const e=t.ownerDocument.createElement("span");e.style.cssText="width:16px;height:16px;margin:12px;border:2px solid #858585;border-right-color:transparent;border-radius:50%;display:block;animation:sve-cm-wait .6s linear infinite",t.appendChild(e)}function ut(t){return un(t).map(e=>({handle:e.handle,base:e.base,max:e.max,media:e.media,media_px:e.media_px,label:e.label}))}function Ks(t,e){return ut(t).find(n=>n.handle===e)||null}function Pe(t=a.cssState){return t?t==="before"||t==="after"?`::${t}`:`:${t}`:""}function Jt(t,e=!1){const n=g.css;if(!n||!sn||!rn)return;const o=n.state.doc.toString(),s=`${a.cssValues?"1":"0"}|${a.cssSize}|${$e(o).map(f=>`${f.from}-${f.to}`).join(",")}`;if(!e&&s===a.cssFoldSig)return;a.cssFoldSig=s;const r=ut(t),i=new Map,l=[...Qi(o,r,a.cssSize),...a.cssValues?[]:fe(o,r,a.cssSize).map(f=>({from:f.from,to:f.to}))];for(const f of l)f.to>f.from&&i.set(`${f.from}:${f.to}`,{from:f.from,to:f.to});const c=[],d=new Set;Er(n.state).between(0,o.length,(f,h)=>{const p=`${f}:${h}`;d.add(p),!i.has(p)&&a.cssOwnFolds.has(p)&&c.push(rn.of({from:f,to:h}))});for(const[f,h]of i)d.has(f)||c.push(sn.of(h));a.cssOwnFolds=new Set(i.keys()),c.length&&n.dispatch({effects:c})}function tn(t,e){const n=a.cssFull||e;return/max-width/i.test(n)&&!/width\s*</i.test(n)&&t.media_px||t.media}function id(t,e){const n=g.css;if(!n||n.state.readOnly)return;const o=ut(t),s=Ks(t,e),r=n.state.doc.toString();if(!s||s.base){const f=n.state.selection.main.head,h=$e(r).find(p=>f>=p.from&&f<=p.to);h&&n.dispatch({selection:{anchor:h.from},scrollIntoView:!0});return}const i=kn(r,o,e);if(i.length){const f=i[0],h=Math.min(f.bodyTo,f.bodyFrom+(r.slice(f.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);n.dispatch({selection:{anchor:h},scrollIntoView:!0});return}const l=tn(s,r),c=Gs(n,r),d=`

${c.indent}@media ${l} {
${c.indent}    
${c.indent}}${c.suffix}`;n.dispatch({changes:{from:c.at,to:c.at,insert:d},selection:{anchor:c.at+d.lastIndexOf("    ")+4},scrollIntoView:!0})}function Gs(t,e){const n=$e(e);if(n.length){const i=n[n.length-1];return{at:i.to,indent:pt(e,i.from),suffix:""}}const o=i=>({at:i.to,indent:pt(e,i.to)||`${pt(e,i.open)}    `,suffix:`
${pt(e,i.open)}`}),s=Fe();if(s)return o(s);const r=ld(e);return r?o(r):{at:e.length,indent:"",suffix:""}}function ld(t){const e=String(t||"");let n=null,o=0,s=0;for(;o<e.length;){if(e[o]==="}"||e[o]===";"){o+=1,s=o;continue}if(e[o]!=="{"){o+=1;continue}const r=Tt(e,o);if(r===-1||n||(n=e.slice(s,o).trim().startsWith("@")?null:{from:s,open:o,to:r},!n))return null;o=r+1,s=o}return n}function cd(t,e){const n=e===a.cssSize?"":e;a.cssSize=n,j(t,In,n),mt("lp:set-device",{win:t,key:n?ea(n,t):"Responsive"}),n&&id(t,n),a.cssValues&&Zs(t),Jt(t,!0),Ln(),Qt(t),L(t)}function dd(t,e){a.cssState=On.includes(e)?e:"",j(t,en,a.cssState),x(t.document),Qt(t),L(t)}function ud(t,e){const n=t.document;x(n),e.setAttribute("data-open","");const o=n.createElement("div");o.id=_,n.body.appendChild(o),H(t,e,o),o._sveApp=P(Y,o,{kind:"choices",choices:[{value:"",label:m(t,"css_state_none"),active:!a.cssState},...On.map(s=>({value:s,label:Pe(s),active:s===a.cssState}))],onPick:s=>dd(t,s)})}function Qt(t){const n=t?.document.getElementById(u)?.querySelector("[data-sve-css-head]");if(!n)return;const o=bt(),s=ut(t),r=g.css?.state.doc.toString()??"";T.tag=o?.tag||"",T.scope=Na(o?Et().slice(o.from,o.openTo):"")||"",T.canEdit=!a.lastLocked,T.onTag=i=>Ta(t,i.currentTarget,o),T.state=a.cssState,T.stateLabel=a.cssState?Pe(a.cssState):m(t,"css_state"),T.onState=i=>ud(t,i.currentTarget),T.onSize=i=>cd(t,i),T.sizes=[{key:"",label:m(t,"tw_size_all"),title:m(t,"css_size_all_title"),active:!a.cssSize},...s.map(i=>{const l=i.base||kn(r,s,i.handle).length>0;return{key:i.handle,label:i.label,title:i.base?m(t,"css_size_base_title"):`@media ${i.media}${l?"":`  ·  ${m(t,"css_size_new")}`}`,active:a.cssSize===i.handle}})],n._sveMounted||(n._sveMounted=!0,Ut(n,cl))}be("lp:device",t=>{const e=a.lastWin;if(!e||!Qs(e.document))return;const n=un(e).find(o=>o.device===t)?.handle||"";n!==a.cssSize&&(a.cssSize=n,j(e,In,n),Jt(e,!0),Ln(),Qt(e),L(e))});function fd(t){const e=Math.max(0,Math.round(Date.now()/1e3-t)),n=new Date(t*1e3).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});let o=n;try{const s=new Intl.RelativeTimeFormat(void 0,{numeric:"auto"});e<90?o=s.format(-e,"second"):e<5400?o=s.format(-Math.round(e/60),"minute"):e<86400?o=s.format(-Math.round(e/3600),"hour"):o=s.format(-Math.round(e/86400),"day")}catch{}return`${o} · ${n}`}function Xs(t,e){return t.fetch(e,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}})}async function hd(t,e){const n=t.document,o=xt();if(x(n),!o)return;let s=[];try{const i=await Xs(t,`/!/sve/section-template/history?type=${encodeURIComponent(o)}`);i.ok&&(s=(await i.json())?.entries||[])}catch{s=[]}if(!n.getElementById(u)||!n.contains(e))return;e.setAttribute("data-open","");const r=n.createElement("div");r.id=_,n.body.appendChild(r),H(t,e,r),r._sveApp=P(Y,r,{kind:"choices",choices:s.length?s.map(i=>({value:i.id,label:fd(i.at)})):[{value:"",label:m(t,"code_dock_history_empty")}],onPick:i=>{x(n),i&&pd(t,o,i)}})}async function pd(t,e,n){if(dt())return;let o=null;try{const s=await Xs(t,`/!/sve/section-template/history/entry?type=${encodeURIComponent(e)}&id=${encodeURIComponent(n)}`);s.ok&&(o=await s.json())}catch{o=null}!o||dt()||(Zt({html:o.html??"",css:o.css??"",js:o.js??""},a.lastLocked),J(t),te(t))}function Nt(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-code-strip]");if(!e)return;e.hidden=a.styleMode!=="tw";const n=Ko(t);e.innerHTML=Fu,e.title=m(t,n?"tw_strip_on":"tw_strip_off"),e.setAttribute("aria-label",e.title),e.setAttribute("aria-pressed",n?"true":"false")}function md(t,e){const n=e.querySelector("[data-sve-code-strip]");!n||n._sveBound||(n._sveBound=!0,n.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),Ma(t,!Ko(t)),Nt(t),Ea(t)}),Nt(t))}function gd(t,e){const n=e.querySelector("[data-sve-code-history]");!n||n._sveBound||(n._sveBound=!0,n.innerHTML=Iu,n.title=m(t,"code_dock_history"),n.setAttribute("aria-label",n.title),n.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),n.hasAttribute("data-open")){x(t.document);return}hd(t,n)}))}function lf(){return a.styleMode}function vd(t){return a.styleMode==="tw"?bt():null}function bt(t){const e=g.html;if(!e)return null;const n=a.htmlScopeActive&&!!a.htmlFocus,o=n?a.htmlFull:e.state.doc.toString(),r=(n?a.htmlFocus.from:0)+e.state.selection.main.from,i=Uo(xe(o),new Set);let l=null;for(const c of i)c.from<=r&&r<c.to&&(l=c);return l}function te(t){a.styleMode==="tw"&&La(t,vd())}function Bn(t){const e=t?.document.getElementById(u),n=e?.querySelector("[data-sve-values-mode]");if(!e||!n)return;e.setAttribute("data-sve-values",a.cssValues?"on":"off");const o=t.document.createElement("span");o.textContent=m(t,"code_dock_values"),n.innerHTML=Pu,n.appendChild(o),n.title=m(t,a.cssValues?"code_dock_values_off":"code_dock_values_on"),n.setAttribute("aria-label",n.title),n.setAttribute("aria-pressed",a.cssValues?"true":"false")}function Zs(t){const e=g.css;if(!e||e.state.readOnly)return;const n=ut(t),o=e.state.doc.toString(),s=fe(o,n,a.cssSize);if(e.focus(),s.length){const p=s[0],y=Math.min(p.bodyTo,p.bodyFrom+(o.slice(p.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);e.dispatch({selection:{anchor:y},scrollIntoView:!0});return}const r=Ks(t,a.cssSize);if(!r||r.base){const p=`#id-{{ id }} {
    `;e.dispatch({changes:{from:0,to:0,insert:`${p}
}

`},selection:{anchor:p.length},scrollIntoView:!0});return}const i=kn(o,n,a.cssSize)[0];if(i){const p=`${pt(o,i.from)}    `,y=`
${p}#id-{{ id }} {
${p}    `;e.dispatch({changes:{from:i.bodyFrom,to:i.bodyFrom,insert:`${y}
${p}}
`},selection:{anchor:i.bodyFrom+y.length},scrollIntoView:!0});return}const l=Gs(e,o),c=`${l.indent}    `,d=fe(o,n,"").some(p=>l.at>p.bodyFrom&&l.at<=p.bodyTo),f=d?`

${l.indent}@media ${tn(r,o)} {
${c}`:`

${l.indent}@media ${tn(r,o)} {
${c}#id-{{ id }} {
${c}    `,h=d?`
${l.indent}}${l.suffix}`:`
${c}}
${l.indent}}${l.suffix}`;e.dispatch({changes:{from:l.at,to:l.at,insert:`${f}${h}`},selection:{anchor:l.at+f.length},scrollIntoView:!0})}function yd(t,e){a.cssValues=!!e,j(t,jn,a.cssValues?"1":"0"),x(t.document),a.cssOpenTool="",Bn(t),at(),Gt(),a.cssValues&&Zs(t),Jt(t,!0),Ln(),Qt(t),L(t)}function Fn(t){const e=t?.document.getElementById(u);if(!e)return;const n=a.styleMode==="tw";e.setAttribute("data-sve-style",a.styleMode);const o=e.querySelector("[data-sve-css-label]");o&&(o.textContent=n?m(t,"code_dock_style_tw"):m(t,"code_dock_css"));const s=e.querySelector("[data-sve-style-mode]");if(!s)return;const r=t.document.createElement("span");r.textContent=n?m(t,"code_dock_style_tw"):m(t,"code_dock_css"),s.innerHTML=n?Du:Ou,s.appendChild(r),s.title=m(t,n?"code_dock_style_to_css":"code_dock_style_to_tw"),s.setAttribute("aria-label",s.title),s.setAttribute("aria-pressed",n?"true":"false")}function Ys(t){t?.document.getElementById(u),x(t.document),Ke(t),a.cssOpenTool="",a.cssOpenMenu="",a.styleMode==="tw"&&a.cssValues&&(a.cssValues=!1,j(t,jn,"0")),Fn(t),Bn(t),Nt(t),a.cssToolRow?.(),a.styleMode==="tw"&&(a.htmlScopePref=!0,j(t,De,"1"),Ge(t,!0)),te(t),Oe(t),L(t)}const In="sve-css-size",en="sve-css-state",On=["hover","focus","focus-visible","active","disabled","before","after"],Co="data-sve-scroll-edge";function Pn(t){if(!t||t._sveEdges)return;t._sveEdges=!0;const e=()=>xd(t),n=new ResizeObserver(e),o=()=>{for(const s of t.children)n.observe(s)};t.addEventListener("scroll",e,{passive:!0}),n.observe(t),o(),new MutationObserver(()=>{o(),e()}).observe(t,{childList:!0}),e()}function bd(t,e){if(!t||t._sveEdgesIn)return;t._sveEdgesIn=!0;const n=()=>t.querySelectorAll(e).forEach(Pn);n(),new MutationObserver(n).observe(t,{childList:!0,subtree:!0})}function xd(t){const e=t.scrollWidth-t.clientWidth,n=t.scrollLeft>1,o=e-t.scrollLeft>1,s=n&&o?"both":n?"left":o?"right":"";s?t.setAttribute(Co,s):t.removeAttribute(Co)}function kd(t,e){a.styleMode=e==="tw"?"tw":"css",j(t,Or,a.styleMode),Ys(t)}function Sd(t,e){if(e._sveStyleModeBound)return;e._sveStyleModeBound=!0,a.styleMode=G(t,Or)==="tw"?"tw":"css";const n=G(t,In)||"";a.cssSize=un(t).some(o=>o.handle===n)?n:"",a.cssState=On.includes(G(t,en))?G(t,en):"",a.cssValues=G(t,jn)==="1",e.querySelector("[data-sve-style-mode]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),kd(t,a.styleMode==="tw"?"css":"tw")}),e.querySelector("[data-sve-values-mode]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),yd(t,!a.cssValues)}),Ys(t),Bn(t)}function _d(t,e){const n=e.querySelector("[data-sve-css-tools]");if(!n||n._sveBound)return;n._sveBound=!0;const o=r=>e.querySelector(`[data-sve-css-tool="${r}"], [data-sve-css-kid="${r}"]`),s=r=>{const i=o(r.id),l=a.cssOpenMenu===r.id;if(x(t.document),l){Ke(t),L(t);return}if(!i)return;const c=a.styleMode==="tw"?!r.twClass&&!!r.tw:!r.kind&&!r.value&&!(r.css in Z())&&!!r.menu,d=()=>{c&&(a.cssOpenMenu=r.id)};if(a.styleMode==="tw"){Ke(t),r.twClass?(Ba(t,r.twClass),L(t)):r.tw&&(Fa(t,i,r.tw,()=>L(t)),d(),L(t));return}if(r.kind==="flexDir"){ec(r.value);return}if(r.kind==="display"){nc(r.value);return}if(r.value){const f=F(Z()[r.css])===F(r.value);K([{property:r.css,value:f?null:r.value}]);return}if(r.css in Z()){K([{property:r.css,value:null}]),L(t);return}r.menu==="colors"?rc(t,i,r.css):r.menu==="spacing"?ic(t,i,r.css):r.menu==="sizes"?yo(t,i,r.css,Nu):r.menu==="choices"?ac(t,i,r.css,r.choices):r.menu==="values"&&yo(t,i,r.css),d(),L(t)};it.onTool=r=>{const i=ye.get(r)?.tool;if(i){if(i.kids?.length){a.cssOpenTool=a.cssOpenTool===i.id?"":i.id,x(t.document),L(t);return}s(i)}},it.onKid=(r,i)=>{const l=ye.get(i);l?.kid&&s(l.kid)},a.cssToolRow=()=>{Ut(n,Xi),L(t)},a.cssToolRow(),Pn(n),bd(n,"[data-sve-css-kids]"),t.document.addEventListener("mousedown",r=>{r.target.closest(`#${_}, [data-sve-css-tools], [data-sve-html-tools], [data-sve-css-add-class]`)||x(t.document)},!0)}function wd(t,e){const n=e.querySelector("[data-sve-html-tidy]");n&&(n.innerHTML=Go.tidy,n.title=m(t,"code_dock_html_tidy"),n.setAttribute("aria-label",n.title),n.setAttribute("data-tip",n.title))}function $d(t,e){const n=e.querySelector("[data-sve-html-tidy]");wd(t,e),!(!n||n._sveBound)&&(n._sveBound=!0,n.addEventListener("mousedown",o=>o.preventDefault()),n.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),Fs()}))}function Cd(t,e){const n=e.querySelector("[data-sve-html-tools]");!n||n._sveBound||(n._sveBound=!0,Ut(n,Wi,{tools:an.map(o=>({...o,icon:Go[o.id]||""})),onTool:o=>{const s=an.find(i=>i.id===o),r=n.querySelector(`[data-sve-html-tool="${o}"]`);if(s){if(s.menu==="heading"){mo(t,r,zr);return}if(s.menu==="text"){mo(t,r,na);return}if(s.tidy){Fs();return}if(s.menu==="component"){Ul(t,r);return}if(x(t.document),s.snippet){Bs(s.snippet,s.caret??s.snippet.length,s.select),I();return}Is(s.tag)}}}),Pn(n),Yd(t,e),Qd(t,e),Zd(t,e))}C("dock:save-now",()=>(W(a.lastWin?.document),!0));let ie=null;async function Ad(t){const e=t.document;lu(e);let n=e.getElementById(u);if(n&&!(n.querySelector('[data-sve-css-chrome="subrow-2"]')&&n.querySelector("[data-sve-css-add-class]")&&n.querySelector("[data-sve-html-tools]")&&n.querySelector("[data-sve-html-tidy]")&&n.querySelector("[data-sve-data-vars]")&&n.querySelector("[data-sve-visual-edit-tools]")&&n.querySelector("[data-sve-html-scope]")&&n.querySelector("[data-sve-code-lock]")&&n.querySelector("[data-sve-code-back]")&&n.querySelector("[data-sve-code-autosave]")&&n.querySelector("[data-sve-code-save]")&&n.getAttribute("data-sve-code-chrome")==="scope-9")){for(const s of nt)g[s]?.destroy(),g[s]=null;n.remove(),n=null}if(!n){n=e.createElement("div"),n.id=u,n.setAttribute("data-sve-code-chrome","scope-9"),ia(n,la(t)),Ut(n,Oi,{htmlLabel:m(t,"code_dock_html"),cssLabel:m(t,"code_dock_css"),jsLabel:m(t,"code_dock_js"),alpineLabel:m(t,"code_dock_alpine"),treeIcon:Dr,dataIcon:Au,dataLabel:m(t,"data_vars_title")}),Ue(e,n),Eo(n),cr(n,rr(t)),mu(t,n),vu(t,n),gu(t,n),_d(t,n),Xl(t,n),Sd(t,n),gd(t,n),md(t,n),ca(t,n),Cd(t,n),uo(t,n),lo(t,n),Lo(t,n),co(t,n);for(const o of nt){const s=n.querySelector(`[data-sve-code-pane="${o}"] [data-sve-code-host]`);ad(s)}da(t)}if(Ue(e,n),Eo(n),$d(t,n),uo(t,n),lo(t,n),Lo(t,n),co(t,n),fu(t),Dn(t),Ct(t),q(t),Vt(t),st(t),Fn(t),Nt(t),await bu(),!g.html){for(const o of nt){const s=n.querySelector(`[data-sve-code-pane="${o}"] [data-sve-code-host]`);s?.replaceChildren(),rd(t,o,s)}for(const o of["html","css"])g[o]&&Ia(t,g[o],{onOpen:s=>ws(t,s),emptyLabel:m(t,"code_dock_partials_empty"),openLabel:s=>m(t,"component_open_named",{name:s}),sectionValues:()=>_s(t),isLocked:()=>dt(),setHover:(s,r)=>a.htmlPartialUi?.setHover(s,r)});si(t,g.html,{onRename:o=>Pl(t,o),isLocked:()=>dt(),setHover:(o,s)=>a.htmlClassTokenUi?.setHover(o,s),title:m(t,"code_dock_css_rename_class")})}return n}function Js(t){return ie||(ie=Ad(t).finally(()=>{ie=null})),ie}async function Ao(t,e){const n=await Js(t);a.lastType=e,a.lastLocked=!0,a.lockReady=!0,a.lastParts={html:"",css:"",js:""},Le(),Ct(t),Zt(a.lastParts,!0),fr(t.document,e),O(t.document,m(t,"code_dock_missing")),q(t),Vt(t),st(t),qt(t,n)}async function Wt(t,e,n="replace"){n==="replace"?a.typeStack=[]:n==="push"&&a.lastType&&a.lastType!==e&&a.typeStack.push(a.lastType);const o=++a.loadGen;a.lastType=e,a.lockReady=!1,Le(),O(t.document,m(t,"code_dock_loading"));let s=()=>{};a.loadInFlight=new Promise(i=>{s=i});const r=await Js(t);Ct(t),q(t),Vt(t),st(t),Fn(t),Nt(t),qt(t,r),t.fetch(`/!/sve/section-template?type=${encodeURIComponent(e)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async i=>{if(o!==a.loadGen)return;if(i.status===404){Ao(t,e);return}if(!i.ok)throw new Error(String(i.status));const l=await i.json();o===a.loadGen&&(a.lastParts={html:typeof l.html=="string"?l.html:"",css:typeof l.css=="string"?l.css:"",js:typeof l.js=="string"?l.js:""},a.lastProps=Array.isArray(l.props)?l.props:[],a.propsDirty=!1,a.lastType=e,a.lastLocked=!!l.locked,a.lockReady=!0,El(),typeof l.tw=="string"&&l.tw!==""&&Ll(a.lastParts.html,l.tw),Ct(t),Zt(a.lastParts,a.lastLocked),Xo(t),a.lastLocked||xs(t,a.lastParts.html),fr(t.document,l.path||e),O(t.document,a.lastLocked?m(t,"code_dock_locked"):""),l.writable?.template===!1?O(t.document,m(t,"code_dock_not_writable")):l.writable?.tw===!1&&O(t.document,m(t,"code_dock_tw_not_writable")),gs(t),Ri(t),xn(t),q(t),Vt(t),st(t),qt(t,r))}).catch(()=>{o===a.loadGen&&(Ao(t,e),O(t.document,m(t,"code_dock_error")))}).finally(()=>{o===a.loadGen&&(a.loadInFlight=null),s()})}function xt(){return a.lastType||""}function Qs(t){return!!t?.getElementById(u)}function dt(){return a.lastLocked}function Td(t,e){const n=typeof e?.html=="string"?e.html.trim():"",o=typeof e?.css=="string"?e.css.trim():"",s=typeof e?.js=="string"?e.js.trim():"";if(!n&&!o&&!s||!t?.document?.getElementById(u))return!1;let r=!1;return n&&(r=Md("html",n)||r),o&&(r=To("css",o)||r),s&&(r=To("js",s)||r),r&&J(t),r}function Md(t,e){const n=g[t];if(!n||n.state.readOnly)return!1;const o=n.state.selection.main,s=o.from>0?n.state.doc.sliceString(o.from-1,o.from):`
`,r=o.to<n.state.doc.length?n.state.doc.sliceString(o.to,o.to+1):`
`,c=`${s===`
`?"":`
`}${e}${r===`
`?"":`
`}`;return n.dispatch({changes:{from:o.from,to:o.to,insert:c},selection:{anchor:o.from+c.length}}),!0}function To(t,e){const n=g[t];if(!n||n.state.readOnly)return!1;const o=n.state.doc.length,r=`${o>0&&n.state.doc.sliceString(Math.max(0,o-1),o)!==`
`?`

`:o?`
`:""}${e}
`;return n.dispatch({changes:{from:o,insert:r},selection:{anchor:o+r.length}}),!0}function Ed(t){if(pe(t),!a.lastType||!t.document.getElementById(u))return;const e=a.lastType;a.lastType=null,Wt(t,e,"keep")}function nn(t){R(t),a.loadGen+=1,W(t),a.lastUid=null,a.lastType=null,a.typeStack=[],a.lastParts={html:"",css:"",js:""},a.lastLocked=!1,a.lockReady=!1,a.lastBracketNames=null,a.lastCssSelectorNames=null,Le(),a.lastWin=t?.defaultView||a.lastWin,x(t),Vo(t),tt(t),t?.getElementById(V)?.remove();for(const n of nt)g[n]?.destroy(),g[n]=null;t?.getElementById(u)?.remove(),uu(),t&&zn(t,0);const e=t?.defaultView||a.lastWin;e?.document.getElementById(Ho)&&zo(e),e&&(gs(e),xn(e),Xo(e))}function Ld(t){if(a.dragging)return;const e=t.document.getElementById(u);e&&(Dn(t),qt(t,e))}function Mo(t,e,n){if(n){const r=Kn(n,e)||Kn(n,t.document)||n;return String(typeof je=="function"&&(je(r,e)||je(r,t.document))||"").trim()}const o=typeof gt=="function"?gt(t):"page_sections",s=typeof z=="function"?z(t.document):[];for(const r of s){const l=(ot(r.values)||r.values)?.[o];if(Array.isArray(l))for(const c of l){const d=typeof c?.type=="string"?c.type.trim():"";if(d)return d}}return""}function tr(t){if((t.Statamic?.$config?.get?.("sveFeatures")||{}).collection_templates!==!0)return"";const n=t.Statamic?.$config?.get?.("sveCollectionTemplatesCollection")||"templates";if(!(t.location?.pathname||"").includes(`/collections/${n}/entries/`))return"";const s=typeof z=="function"?z(t.document):[];for(const r of s){const i=ot(r.values)||r.values,l=typeof i?.view=="string"?i.view.trim():"";if(!l||l.includes(".."))continue;const c=l.replace(/\.(antlers\.html|blade\.php)$/i,"").replace(/^\/+|\/+$/g,"");if(c)return`view:${c}`}return""}function er(t,e,n){const o=t.Statamic?.$config?.get?.("sveChromeTemplates")||{},s=o[e]&&typeof o[e].type=="string"?o[e]:null,r=t.Statamic?.$config?.get?.("sveChromeStyles")||{},i=`${e}/${typeof r[e]=="string"&&r[e]!==""?r[e]:"style_1"}`,l=s?.type||i,c=n?.[`${e}_style`];return(!s||s.styled)&&typeof c=="string"&&c!==""?`${e}/${c}`:l}function Bd(t){const e=jo||No;return e!=="header"&&e!=="footer"?"":fn(t)||hn(t)?e:""}function Fd(t,e){const n=jo||No;return n!=="header"&&n!=="footer"||!fn(e)&&!hn(e)?"":er(t,n,ot(ra()?.values)||{})}function Id(t){const e=typeof gt=="function"?gt(t):"page_sections",n=typeof z=="function"?z(t.document):[];for(const o of n){const r=(ot(o.values)||o.values)?.[e];if(Array.isArray(r)&&r.length)return!0}return!1}function Od(t,e){if(!e||String(e).startsWith("view:")||bs(t,e))return!1;const n=typeof gt=="function"?gt(t):"page_sections",o=typeof z=="function"?z(t.document):[];for(const s of o){const i=(ot(s.values)||s.values)?.[n];if(Array.isArray(i)&&i.some(l=>l?.type===e))return!0}return!1}function Pd(t){const e=aa(t);if(!e)return"";const n=["header","footer"].find(o=>e.querySelector(`[data-sve-chrome="${o}"]`));return n?er(t,n,null):""}function Dd(t){const e=Ro(t)||t.getElementById("__sve-global-section-host");return e&&e.querySelector("[data-replicator-set][data-type]")?.getAttribute("data-type")||""}function cf(t,e,n){if(a.dragging)return;if(!t||!e||ou(e)||!oa(t)||!sa(t)){e&&nn(e);return}const o=Fd(t,e)||Dd(e)||Mo(t,e,n)||tr(t)||(n?"":a.lastType),s=!o&&!n&&!Id(t)?Pd(t):"",r=o||s,i=!!(n&&n!==a.lastUid);if(a.onEmptyPage=!!s,a.lastWin=t,n&&(a.lastUid=n),!r){if(a.lastType&&!fn(e)&&!hn(e)&&!Ro(e)&&!Od(t,a.lastType)){const l=Mo(t,e,null);a.lastUid=null,l?(W(e),Wt(t,l,"replace")):nn(e)}return}if(!(r===a.lastType&&e.getElementById(u))){if(a.typeStack.length&&a.lastType&&a.lastType!==r){const l=a.typeStack[0];if(r===l&&!i)return;a.typeStack=[]}W(e),Wt(t,r,"replace")}}be("tw:changed",()=>{a.lastWin&&a.styleMode==="tw"&&L(a.lastWin)});C("dock:is-open",t=>Qs(t));C("dock:is-locked",()=>dt());C("dock:html",()=>Et());C("dock:reveal-html",({from:t,to:e,caret:n}={})=>{const o=g.html;if(!o||t==null)return;a.htmlScopePref=Kt(a.lastWin),Ae(),at();const s=a.htmlFull.length,r=Math.max(0,Math.min(t,s)),i=Math.max(r,Math.min(e??t,s));a.htmlFocus=i>r?{from:r,to:i}:null;const l=n==null?null:Math.max(0,Math.min(n,s));if(a.htmlScopePref&&a.htmlFocus){Cn(l),q(a.lastWin);return}if(a.htmlScopeActive){An(!0,l),q(a.lastWin);return}o.dispatch({selection:l==null?{anchor:r,head:i}:{anchor:l},scrollIntoView:!0}),o.focus()});C("dock:insert-snippet",({win:t,parts:e})=>Td(t,e));C("dock:refresh",t=>Ed(t));C("dock:tw-follow",()=>{a.lastWin&&te(a.lastWin)});C("dock:css",()=>(at(),a.cssFull));C("dock:set-css",t=>typeof t!="string"||dt()||!g.css||!a.lastWin?!1:(at(),a.cssFull=t,Me("css",Os()),J(a.lastWin),!0));C("dock:data-menu",({anchor:t,onPick:e,at:n}={})=>!t||!a.lastWin?!1:(R(a.lastWin.document),x(a.lastWin.document),nr(a.lastWin,t,e,n),!0));C("dock:props",()=>a.lastProps.map(t=>({...t})));C("dock:set-props",({win:t,props:e}={})=>!Array.isArray(e)||dt()?!1:(a.lastProps=e,a.propsDirty=!0,Oa(ee(xt())),W((t||a.lastWin)?.document),!0));function ee(t){const e=/^view:partials\/(components\/[A-Za-z0-9_-]+)$/.exec(String(t||""));return e?e[1]:""}C("dock:component-src",()=>ee(xt()));C("dock:type-stack",()=>a.typeStack.map(t=>({type:t,src:ee(t)})));C("dock:component-exit-state",()=>{const t=ee(xt());return{open:!!t,name:t?t.split("/").pop():"",back:a.typeStack.length>0}});C("dock:exit-component",(t=1)=>{if(!a.lastWin||!ee(xt()))return!1;if(a.typeStack.length){for(let e=Number(t)||1;e>1&&a.typeStack.length>1;e-=1)a.typeStack.pop();$s(a.lastWin)}else nn(a.lastWin.document);return!0});C("dock:current-type",()=>xt());C("dock:on-empty-page",()=>!!a.onEmptyPage);C("dock:current-uid",()=>a.lastUid);C("dock:chrome-kind",t=>Bd(t));C("dock:save-settled",()=>a.saveInFlight||null);C("dock:load-settled",()=>a.loadInFlight||null);C("dock:reset-data-vars",t=>(ai(typeof t=="string"&&t?t:void 0),!0));C("dock:refresh-preview",()=>a.lastWin?(pe(a.lastWin),!0):!1);C("dock:open-template",t=>typeof t!="string"||!t||!a.lastWin?!1:(ws(a.lastWin,t),!0));C("dock:set-html",t=>{if(typeof t!="string"||dt())return!1;const e=g.html;if(!e||!a.lastWin)return!1;if(t===""){a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null),a.twDirty=!1,a.twCss=null,a.twKey="",a.lastType=null,a.lastUid=null,a.lastParts={html:"",css:"",js:""},a.cssFull="",a.htmlFull="",a.applying=!0;try{Le();for(const s of nt){const r=g[s];if(!r)continue;const i=r.state.doc.toString();i!==""&&r.dispatch({changes:{from:0,to:i.length,insert:""}})}}finally{a.applying=!1}return!0}const n=a.htmlFull;if(a.htmlFull=t,a.htmlScopeActive)return a.htmlFocus=zd(a.htmlFocus,n,t),Ee(Ts()),J(a.lastWin),dn("dock:html-changed"),!0;const o=e.state.doc.toString();if(o!==t){const[s,r,i]=Ss(o,t);e.dispatch({changes:{from:s,to:r,insert:i}})}return!0});C("dock:show-empty",()=>mt("dock:set-html",""));be("row:removed",({parentPath:t,remaining:e,win:n})=>{e===0&&t===gt(n)&&mt("dock:show-empty")});function zd(t,e,n){const o=n.length-e.length;if(!t||!o)return t;let s=0;for(;s<e.length&&s<n.length&&e[s]===n[s];)s+=1;return s>=t.to?t:s<t.from?{from:Math.max(0,t.from+o),to:Math.max(0,t.to+o)}:{from:t.from,to:Math.max(t.from,t.to+o)}}const At="__sve-data-menu";let ge=null;function R(t){const e=t?.getElementById(At);ge?.(),ge=null,e?._sveApp?.unmount(),e?.remove(),t?.querySelectorAll("[data-sve-data-vars][data-open], [data-sve-antlers-btn][data-open], [data-sve-visual-edit-btn][data-open]").forEach(n=>n.removeAttribute("data-open"))}function Hd(t){if(!tr(t))return{view:"",kind:""};const e=typeof z=="function"?z(t.document):[];for(const n of e){const o=ot(n.values)||n.values,s=typeof o?.source_collection=="string"?o.source_collection.trim():"";if(s)return{view:s,kind:String(o?.kind||"").trim()}}return{view:"",kind:""}}function Rd(t,e){const n=Et();if(Number.isFinite(e))return Zn(n,e);const o=g.html;if(!o)return[];const s=a.htmlScopeActive&&a.htmlFocus?a.htmlFocus.from:0;return Zn(n,s+o.state.selection.main.from)}function jd(t,e){const{view:n,kind:o}=Hd(t);return{collection:ls(t)||"",set:cs(xt()),view:n,kind:o,scope:ri(Rd(t,e))}}function Nd(t){const e=typeof z=="function"?z(t.document):[];for(const n of e){const o=ot(n.values)||n.values;if(o&&typeof o=="object")return o}return null}function Wd(t,e){return{scope:e?.scope?.groups||[],section:fs(e?.section||[],_s(t)),page:ci(e?.page||[],Nd(t)),site:e?.site||[]}}function qd(t){const e=t.state.selection.main,n=t.state.doc.lineAt(e.from),o=n.text.slice(0,e.from-n.from);return/(?:^|\s)(?::|x-bind:)[\w.:-]+\s*=\s*(["'])(?:(?!\1).)*$/.test(o)}function Vd(t,e){const n=g.html;if(!n||n.state.readOnly)return;if(qd(n)){const c=String(t?.var||"").trim(),d=n.state.selection.main;n.dispatch({changes:{from:d.from,to:d.to,insert:c},selection:{anchor:d.from+c.length}}),I();return}const o=di(t,e);if(!o)return;const s=n.state.selection.main,r=n.state.doc.lineAt(s.from),i=rt(r.text),l=pn(o.text,i);n.dispatch({changes:{from:s.from,to:s.to,insert:l},selection:{anchor:s.from+o.cursor+(o.text.includes(`
`)?i.length:0)}}),I()}function Pt(t,e,n){const o=e.getBoundingClientRect(),s=8,r=n.offsetWidth||368,i=n.offsetHeight||240,l=t.innerHeight-o.bottom-s,c=o.top-s,d=l>=i||l>=c?o.bottom+4:o.top-i-4;n.style.left=`${Math.max(s,Math.min(o.left,t.innerWidth-r-s))}px`,n.style.top=`${Math.max(s,Math.min(d,t.innerHeight-i-s))}px`}function nr(t,e,n,o){const s=t.document;R(s),e.setAttribute("data-open","");const r=s.createElement("div");r.id=At,r.setAttribute("data-sve-data-menu",""),s.body.appendChild(r);const i=jd(t,o),l=p=>[p?.scope?.groups?.length?{id:"scope",label:p.scope.label||m(t,"data_vars_tab_loop")}:null,{id:"section",label:m(t,"data_vars_tab_section")},{id:"page",label:m(t,"data_vars_tab_page")},{id:"site",label:m(t,"data_vars_tab_site")}].filter(Boolean),c=p=>{s.getElementById(At)&&(r._sveApp?.unmount(),r._sveApp=P(Zo,r,{title:m(t,"data_vars_title"),placeholder:m(t,"data_vars_placeholder"),emptyText:m(t,"data_vars_empty"),noSectionText:m(t,"data_vars_no_section"),loopText:m(t,"data_vars_loop"),tabs:l(p),data:Wd(t,p),onPick:(y,b)=>n?n(y,b):Vd(y,b)}),Pt(t,e,r))};c(ds(bn(i))||{scope:null,section:[],page:[],site:[]}),us(t,i).then(c),Pt(t,e,r);const d=()=>Pt(t,e,r),f=p=>{!r.contains(p.target)&&!e.contains(p.target)&&R(s)},h=p=>{p.key==="Escape"&&R(s)};s.addEventListener("pointerdown",f,!0),s.addEventListener("keydown",h,!0),t.addEventListener("scroll",d,!0),t.addEventListener("resize",d),ge=()=>{s.removeEventListener("pointerdown",f,!0),s.removeEventListener("keydown",h,!0),t.removeEventListener("scroll",d,!0),t.removeEventListener("resize",d)}}function or(t,e,{title:n,placeholder:o,tabs:s,data:r,onPick:i}){const l=t.document;R(l),x(l),e.setAttribute("data-open","");const c=l.createElement("div");c.id=At,c.setAttribute("data-sve-data-menu",""),l.body.appendChild(c),c._sveApp=P(Zo,c,{title:n,placeholder:o,emptyText:m(t,"data_vars_empty"),noSectionText:m(t,"data_vars_empty"),loopText:"",tabs:s,data:r,onPick:(d,f)=>{R(l),i(d,f)}}),Pt(t,e,c),Ud(t,e,c)}function Ud(t,e,n){const o=t.document,s=()=>Pt(t,e,n),r=l=>{!n.contains(l.target)&&!e.contains(l.target)&&R(o)},i=l=>{l.key==="Escape"&&R(o)};o.addEventListener("pointerdown",r,!0),o.addEventListener("keydown",i,!0),t.addEventListener("scroll",s,!0),t.addEventListener("resize",s),ge=()=>{o.removeEventListener("pointerdown",r,!0),o.removeEventListener("keydown",i,!0),t.removeEventListener("scroll",s,!0),t.removeEventListener("resize",s)}}const Kd='<svg width="21" height="11" viewBox="0 0 150 77" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M69.999 55.827a13.8 13.8 0 0 0-.812-3.799 15.4 15.4 0 0 0-1.687-3.55 18.16 18.16 0 0 0-5.686-5.418 37.7 37.7 0 0 0 3.936-6.228 18.6 18.6 0 0 0 1.812-6.228 9.88 9.88 0 0 0-1.248-5.57 9.9 9.9 0 0 0-4.125-3.959 10.46 10.46 0 0 0-10.684 1.183 13.8 13.8 0 0 0-4.061 5.107 39 39 0 0 0-1.812 4.92 49.5 49.5 0 0 1-5.436-6.227 16.9 16.9 0 0 1-2.562-5.606 28.7 28.7 0 0 1-.624-6.85c.003-2-.357-3.983-1.063-5.855a10.66 10.66 0 0 0-4.56-5.231 13.9 13.9 0 0 0-10.684-1.37 10.13 10.13 0 0 0-4.94 2.755 10.1 10.1 0 0 0-2.683 4.967 24.4 24.4 0 0 0 0 10.214 22.4 22.4 0 0 0 3.374 7.35h-1.062a23 23 0 0 1-4.124 0 19.2 19.2 0 0 0-6.248 0 6.74 6.74 0 0 0-3.374 2.74 9.45 9.45 0 0 0-.75 9.341 11.23 11.23 0 0 0 5.811 6.228 25.1 25.1 0 0 0 10.622 1.495 17.9 17.9 0 0 0 9.809-3.425 104 104 0 0 1 10.496 7.162 22.4 22.4 0 0 1 5.249 6.54 15.5 15.5 0 0 1 1.437 5.106 35 35 0 0 0 1.437 6.789 13.2 13.2 0 0 0 4.373 5.73 15.6 15.6 0 0 0 10.372 2.802 9.9 9.9 0 0 0 5.429-1.987 9.84 9.84 0 0 0 3.38-4.677A61.6 61.6 0 0 0 70 55.827m-5.061 12.456a5.05 5.05 0 0 1-1.971 2.157 5.07 5.07 0 0 1-2.84.708 9.45 9.45 0 0 1-6.248-2.367 6.6 6.6 0 0 1-2.124-2.989 50 50 0 0 1-1.625-6.788 18.7 18.7 0 0 0-2.249-5.73 28.7 28.7 0 0 0-7.435-7.35A129 129 0 0 0 27.95 38.95c-.812-.498-2.686 0-2.749 0a14.03 14.03 0 0 1-7.872 1.62 19.5 19.5 0 0 1-7.935-2.056 4.86 4.86 0 0 1-2.375-2.49 3.35 3.35 0 0 1 0-2.99 1.18 1.18 0 0 1 .875-.748c1.25 0 2.687 0 3.936-.435a33 33 0 0 0 4.749-1.122 17.6 17.6 0 0 0 4.498-2.18 1.68 1.68 0 0 0 .838-1.68 1.7 1.7 0 0 0-.213-.624 2.2 2.2 0 0 0-.937-.747 18.65 18.65 0 0 1-2.812-7.35 19.5 19.5 0 0 1 .938-7.97 4.55 4.55 0 0 1 1.326-1.834 4.57 4.57 0 0 1 2.048-.97 7.52 7.52 0 0 1 5.498.997 5.12 5.12 0 0 1 2.499 3.488 87 87 0 0 0 1.874 10.587 22.4 22.4 0 0 0 4.436 6.789 78 78 0 0 0 8.372 7.286 1.8 1.8 0 0 0 1.188 1.246 2.005 2.005 0 0 0 2.499-1.308 33.4 33.4 0 0 1 3.249-6.54 8.8 8.8 0 0 1 2.811-2.677 4.63 4.63 0 0 1 4.561 0 4 4 0 0 1 1.612 1.494c.387.638.586 1.372.575 2.118a14.7 14.7 0 0 1-.75 5.792 36.6 36.6 0 0 1-2.561 6.228v.311a2.05 2.05 0 0 0 .5 2.74 13.6 13.6 0 0 1 3.248 4.92c.375.873.563 1.745.875 2.617s.937 2.678 1.312 4.048c1.625 5.916 2.5 7.536.875 10.961zM148.848 29.42a6.6 6.6 0 0 0-3.062-2.74 16.7 16.7 0 0 0-6.248 0c-1.227.09-2.459.09-3.686 0h-.937a24.2 24.2 0 0 0 3.186-7.536c.659-3.31.659-6.716 0-10.027a9.95 9.95 0 0 0-2.072-5.336 10 10 0 0 0-4.676-3.32 12.53 12.53 0 0 0-10.184 1.556 10.78 10.78 0 0 0-4.498 5.668 16.8 16.8 0 0 0-.875 5.667 32.7 32.7 0 0 1 0 6.602 17.2 17.2 0 0 1-2.499 5.543 52 52 0 0 1-4.748 5.792 32 32 0 0 0-1.5-4.547 14.4 14.4 0 0 0-3.811-5.231 9.522 9.522 0 0 0-10.56-.996 10.16 10.16 0 0 0-3.64 4.024 10.1 10.1 0 0 0-1.045 5.317c.21 2.156.78 4.26 1.687 6.228a38.3 38.3 0 0 0 3.748 6.228 17.5 17.5 0 0 0-5.435 5.668 15 15 0 0 0-1.562 3.55 18.3 18.3 0 0 0-.75 3.674v10.09c.068 1.417.32 2.82.75 4.172a9.46 9.46 0 0 0 3.062 4.609 9.5 9.5 0 0 0 5.123 2.118 14.1 14.1 0 0 0 9.871-2.927 12.76 12.76 0 0 0 4.124-5.792 34 34 0 0 0 1.562-6.727 17.6 17.6 0 0 1 1.375-5.107 21.1 21.1 0 0 1 4.623-6.228 83 83 0 0 1 8.935-7.349 16.34 16.34 0 0 0 8.997 3.301 22.24 22.24 0 0 0 9.746-1.557 10.777 10.777 0 0 0 5.499-6.228 9.88 9.88 0 0 0-.5-8.158m-5.623 6.229a4.43 4.43 0 0 1-2.062 2.553 16.16 16.16 0 0 1-7.06 2.18 11.7 11.7 0 0 1-7.123-1.869s-1.999-.81-2.812 0a123 123 0 0 0-11.558 7.038 26.9 26.9 0 0 0-6.811 7.224 79 79 0 0 0-3.623 12.456 6.23 6.23 0 0 1-2 3.052 7.88 7.88 0 0 1-5.373 2.305 4.63 4.63 0 0 1-2.523-.809 4.6 4.6 0 0 1-1.663-2.056 9.8 9.8 0 0 1-.812-3.488c.25-2.711.881-5.373 1.874-7.91.375-1.37.75-2.678 1.187-4.048s.438-1.806.812-2.616a13.26 13.26 0 0 1 2.937-5.044 2.054 2.054 0 0 0 .375-2.74 44 44 0 0 1-2.25-6.228 17.3 17.3 0 0 1-.687-5.792 4.22 4.22 0 0 1 1.937-3.675 3.57 3.57 0 0 1 3.811 0 8.3 8.3 0 0 1 2.625 2.678 40.5 40.5 0 0 1 3.061 6.228 1.93 1.93 0 0 0 1.664 1.441c.26.029.522.005.773-.07a1.82 1.82 0 0 0 1.187-1.309 80 80 0 0 0 7.872-7.411 22.5 22.5 0 0 0 3.999-6.664 75.4 75.4 0 0 0 1.749-10.525 5.17 5.17 0 0 1 1.937-3.176 5.76 5.76 0 0 1 4.749-.935 4.11 4.11 0 0 1 3.186 2.927c.751 2.609.985 5.338.687 8.035a19 19 0 0 1-2.561 7.473s-.625 0-.75.56a1.68 1.68 0 0 0 .5 2.367c1.27.908 2.657 1.641 4.123 2.18 1.468.49 2.972.865 4.499 1.121 1.125 0 2.374 0 3.561.436s.438.311.625.623c.235.52.351 1.087.341 1.657a3.9 3.9 0 0 1-.403 1.644z"/></svg>',Gd='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 9 5 12 1.8-5.2L21 14Z"/><path d="M7.2 2.2 8 5.1"/><path d="m5.1 8-2.9-.8"/><path d="M14 4.1 12 6"/><path d="m6 12-1.9 2"/></svg>';function sr(t,e,n,o,s){const r=t.document.createElement("button");return r.type="button",r.setAttribute(n,""),r.title=s,r.setAttribute("aria-label",s),r.innerHTML=`<span>${o}</span>`,r.addEventListener("mousedown",i=>i.preventDefault()),e.replaceChildren(r),r}function Xd(t){return String(t||"").replace(/\|/g,"").split(`
`)[0].trim()}function Zd(t,e){const n=e.querySelector("[data-sve-data-vars]");!n||n._sveBound||(n._sveBound=!0,n.addEventListener("mousedown",o=>o.preventDefault()),n.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),t.document.getElementById(At)){R(t.document);return}x(t.document),nr(t,n)}))}function Yd(t,e){const n=e.querySelector("[data-sve-antlers-tools]");if(!n||n._sveBound)return;n._sveBound=!0;const o=sr(t,n,"data-sve-antlers-btn",Kd,m(t,"code_dock_antlers"));o.addEventListener("click",s=>{if(s.preventDefault(),s.stopPropagation(),o.hasAttribute("data-open")){R(t.document);return}const r={};for(const i of Yn)r[i.id]=Ra.filter(l=>l.group===i.id).map(l=>({id:l.id,var:l.label,value:l.inline?"":Xd(l.snippet)}));or(t,o,{title:m(t,"code_dock_antlers"),placeholder:m(t,"code_dock_antlers_search"),tabs:Yn.map(i=>({id:i.id,label:m(t,i.lang)})),data:r,onPick:i=>Jd(i.id)})})}function Jd(t){const e=ja(t),n=g.html;if(!e||!n||n.state.readOnly)return;const o=n.state.selection.main.head;if(e.inline){const c=e.snippet,d=n.state.selection.main;n.dispatch({changes:{from:d.from,to:d.to,insert:c},selection:{anchor:d.from+c.length}}),I();return}const s=n.state.doc.lineAt(o),r=s.text.trim()?rt(s.text):Ie(n,s)||rt(s.text),{text:i,cursor:l}=de(e.snippet);Rt(pn(i,r),l),I()}function Qd(t,e){const n=e.querySelector("[data-sve-visual-edit-tools]");if(!n||n._sveBound)return;n._sveBound=!0;const o=sr(t,n,"data-sve-visual-edit-btn",Gd,m(t,"code_dock_visual_edit"));o.addEventListener("click",s=>{if(s.preventDefault(),s.stopPropagation(),o.hasAttribute("data-open")){R(t.document);return}const r={};for(const i of no)r[i.id]=hs.filter(l=>l.group===i.id).map(l=>({id:l.id,var:l.label,value:l.attr?l.attr.replace(/\|/g,""):""}));or(t,o,{title:m(t,"code_dock_visual_edit"),placeholder:m(t,"code_dock_visual_edit_search"),tabs:no.map(i=>({id:i.id,label:m(t,i.lang)})),data:r,onPick:i=>eu(i.id)})})}function tu(t,e,n,o){if(hi(n.inner,o.attr)){t.focus();return}const{text:s,cursor:r}=de(o.attr);let i=n.closeIdx;for(;i>n.openIdx+2&&/\s/.test(e[i-1]);)i--;t.dispatch({changes:{from:i,to:n.closeIdx,insert:` ${s} `},selection:{anchor:i+1+r}}),I()}function eu(t){const e=ui(t),n=g.html;if(!e||!n||n.state.readOnly)return;const o=n.state.doc.toString(),s=Xt();if(s?.open){const h=fi(o,s.open.from,s.open.to,se);if(h){e.attr?tu(n,o,h,e):(n.dispatch({selection:{anchor:h.openIdx+2+se.length}}),n.focus());return}const p=s.open.from+1+s.name.length,y=e.standalone||`{{ ${se} ${e.attr} }}`,{text:b,cursor:E}=de(y);n.dispatch({changes:{from:p,to:p,insert:` ${b}`},selection:{anchor:p+1+E}}),I();return}const r=n.state.selection.main.head,i=n.state.doc.lineAt(r),l=i.text.trim()?rt(i.text):Ie(n,i)||rt(i.text),c=e.standalone||`{{ ${se} ${e.attr} }}`,{text:d,cursor:f}=de(c);Rt(pn(d,l),f),I()}function nu(t){return t==="css"?Ar():t==="js"?Tr():Cr({autoCloseTags:!0})}function Eo(t){if(t._sveShield)return;t._sveShield=!0;const e=n=>n.stopPropagation();for(const n of["keydown","keypress","keyup","pointerdown","pointerup","mousedown","mouseup","click","focusin"])t.addEventListener(n,e)}function ou(t){try{return new URLSearchParams(t.defaultView?.location?.search||"").has("sve-panel")}catch{return!1}}function su(t){const e=parseInt(G(t,Lr)??"",10);return Number.isFinite(e)&&e>=Pr?e:Su}function ru(t,e){j(t,Lr,String(e))}function rr(t){try{const e=JSON.parse(G(t,Br)||"null");if(e&&typeof e=="object")return{html:e.html!==!1,css:e.css!==!1,js:e.js===!0,alpine:e.alpine===!0}}catch{}return{html:!0,css:!0,js:!1,alpine:!1}}function au(t,e){j(t,Br,JSON.stringify(e))}function ar(t){try{const e=JSON.parse(G(t,Fr)||"null");if(e&&typeof e=="object"){const n=s=>Number.isFinite(s)&&s>0?s:1,o={};for(const s of yt)o[s]=n(e[s]);return o}}catch{}return Object.fromEntries(yt.map(e=>[e,1]))}function iu(t,e){j(t,Fr,JSON.stringify(e))}function lu(t){ua(t,ku,`
@keyframes sve-cm-wait { to { transform: rotate(360deg); } }
#${u} {
  /* The tree's seven families, for the marks and the toolbar below. */
  ${fa("dark")}
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
#${V} {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,.5);
}
#${V} [data-sve-unlock-card] {
  width: min(420px, calc(100vw - 32px));
  padding: 20px;
  border-radius: 12px;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 16px 40px rgba(0,0,0,.45);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${V} [data-sve-unlock-title] {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
}
#${V} [data-sve-unlock-body] {
  font-size: 13px;
  line-height: 1.45;
  opacity: .75;
  margin-bottom: 18px;
}
#${V} [data-sve-unlock-actions] {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
#${V} [data-sve-unlock-actions] button {
  all: unset;
  cursor: pointer;
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}
#${V} [data-sve-unlock-cancel] {
  background: rgba(255,255,255,.1);
  color: #d4d4d4;
}
#${V} [data-sve-unlock-confirm] {
  background: #b45309;
  color: #fff;
}
#${u} [data-sve-code-grip] {
  flex: 0 0 16px;
  height: 16px;
  width: 100%;
  cursor: ns-resize;
  z-index: 3;
  ${Gn("ns")}
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
#${u} [data-sve-html-tool="if"] {
  color: var(--sve-fam-if);
  background: color-mix(in srgb, var(--sve-fam-if) 13%, transparent);
  opacity: 1;
}
#${u} [data-sve-html-tool="if"]:hover,
#${u} [data-sve-html-tool="if"][data-open] {
  background: color-mix(in srgb, var(--sve-fam-if) 26%, transparent);
}
#${_} {
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
#${At} {
  position: fixed;
  z-index: 60;
  width: 23rem;
}
[data-sve-data-menu] {
  box-sizing: border-box;
  max-width: calc(100vw - 1.5rem);
  max-height: 24rem;
  overflow: auto;
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
#${_} [data-sve-css-swatches] {
  display: grid;
  grid-template-columns: repeat(8, 16px);
  gap: 4px;
}
#${_} [data-sve-css-swatch] {
  all: unset;
  cursor: pointer;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  box-sizing: border-box;
  border: 1px solid rgba(255,255,255,.2);
}
#${_} [data-sve-css-swatch]:hover,
#${_} [data-sve-css-clear]:hover {
  outline: 1px solid #fff;
  outline-offset: 1px;
}
#${_} [data-sve-css-clear] {
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
#${_} [data-sve-css-choice] {
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
#${_} [data-sve-css-choice-label] {
  flex: 1 1 auto;
  min-width: 0;
}
/* What the row actually writes, in the corner of the row that writes it. Dim,
   because it is the answer to a second question, not the first. */
#${_} [data-sve-css-choice-hint] {
  flex: 0 0 auto;
  opacity: .45;
  font-size: 10px;
}
#${_} [data-sve-css-head-row] {
  display: block;
  padding: 8px 8px 3px;
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  opacity: .55;
}
#${_} [data-sve-css-head-row]:first-child {
  padding-top: 2px;
}
#${_} [data-sve-css-note-row] {
  display: block;
  padding: 6px 8px 2px;
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 10px;
  line-height: 1.45;
  opacity: .5;
}
#${_} [data-sve-css-choice]:hover,
#${_} [data-sve-css-swatch][data-active],
#${_} [data-sve-css-choice][data-active] {
  outline: 1px solid #fff;
  outline-offset: 1px;
  background: rgba(255,255,255,.1);
}
#${_} [data-sve-css-add-label] {
  display: block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  opacity: .55;
  margin-bottom: 6px;
}
#${_} [data-sve-css-add-input] {
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
#${u} [data-sve-code-split] {
  flex: 0 0 16px;
  cursor: col-resize;
  ${Gn("ew")}
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
#${u} .sve-cm-css-token {
  background: rgba(215,186,125,.22);
  border-radius: 2px;
}
#${Q} {
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
#${Q}:hover {
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
#${oe} {
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
#${oe} [data-sve-partial-choice] {
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
#${oe} [data-sve-partial-choice]:hover {
  background: rgba(255,255,255,.1);
}
#${oe} [data-sve-partial-empty] {
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
`)}function cu(t){const e=t.querySelector(".live-preview-editor");if(!e)return 0;const n=e.getBoundingClientRect();return n.width<40||n.right<40?0:Math.round(n.right)}function du(t){let e=0;for(const n of["__sve-section-picker","__sve-outline-panel","__sve-html-tree-panel","__sve-listview-panel","__sve-right-dock","__sve-chrome-designs","__sve-global-section-panel","__sve-ai-panel"]){const o=t.getElementById(n);if(!o||o.hasAttribute("data-sve-chrome-hidden")||o.hasAttribute("data-sve-right-closed")||o.style.display==="none")continue;const s=o.getBoundingClientRect();s.width>40&&s.right>t.documentElement.clientWidth-8&&(e=Math.max(e,Math.round(s.width)))}return e}function Dn(t){const e=t.document;if(a.layoutWin=t,typeof t.ResizeObserver!="function")return;a.layoutObserver||(a.layoutObserver=new t.ResizeObserver(()=>{a.layoutWin&&Ld(a.layoutWin)}));const n=e.querySelector(".live-preview-editor"),o=e.getElementById("__sve-right-dock");n!==a.observedEditor&&(a.observedEditor&&a.layoutObserver.unobserve(a.observedEditor),a.observedEditor=n,n&&a.layoutObserver.observe(n)),o!==a.observedRight&&(a.observedRight&&a.layoutObserver.unobserve(a.observedRight),a.observedRight=o,o&&a.layoutObserver.observe(o))}function uu(){a.layoutObserver?.disconnect(),a.layoutObserver=null,a.layoutWin=null,a.observedEditor=null,a.observedRight=null}function fu(t){a.layoutWatchBound||(a.layoutWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>Dn(t)))}function zn(t,e){const n=t.querySelector(".live-preview-contents");n&&(n.style.paddingBottom=e?`${e}px`:"")}function Hn(t){if(!t)return;const e=t.clientHeight,n=t.querySelector("[data-sve-code-bar]"),o=t.querySelector("[data-sve-code-lock-banner]"),s=o&&hu(t)?.getComputedStyle(o).display!=="none"?o.offsetHeight:0,r=Math.max(64,e-(n?.offsetHeight||0)-s),i=t.querySelector("[data-sve-code-panes]");i&&(i.style.height=`${r}px`,i.style.minHeight="0",i.style.overflow="hidden"),t.querySelectorAll("[data-sve-code-host]").forEach(l=>{const c=l.closest("[data-sve-code-pane]");if(!c||c.style.display==="none")return;let d=0;for(const h of c.children)h!==l&&(d+=h.offsetHeight);const f=Math.max(64,r-d);l.style.height=`${f}px`,l.style.maxHeight=`${f}px`,l.style.minHeight="0",l.style.overflow="auto",pu(l)})}function hu(t){return t.ownerDocument?.defaultView||a.lastWin}function pu(t){t._sveWheelBound||(t._sveWheelBound=!0,t.addEventListener("wheel",e=>{const n=t.scrollHeight-t.clientHeight,o=t.scrollWidth-t.clientWidth;let s=!1;if(e.deltaY&&n>0){const r=Math.min(n,Math.max(0,t.scrollTop+e.deltaY));r!==t.scrollTop&&(t.scrollTop=r,s=!0)}if(e.deltaX&&o>0){const r=Math.min(o,Math.max(0,t.scrollLeft+e.deltaX));r!==t.scrollLeft&&(t.scrollLeft=r,s=!0)}s&&(e.preventDefault(),e.stopPropagation())},{passive:!1}))}function ir(){const t=(a.layoutWin||a.lastWin)?.document?.getElementById(u);t&&Hn(t);for(const e of nt)g[e]?.requestMeasure()}function lr(t,e){const n=rr(t),o={};for(const s of yt){const r=e.querySelector(`[data-sve-code-pane-btn="${s}"]`);o[s]=r?r.getAttribute("aria-pressed")==="true":n[s]}return o}function cr(t,e){for(const o of yt){const s=t.querySelector(`[data-sve-code-pane-btn="${o}"]`),r=t.querySelector(`[data-sve-code-pane="${o}"]`);s&&s.setAttribute("aria-pressed",e[o]?"true":"false"),r&&(r.style.display=e[o]?"flex":"none")}const n=yt.filter(o=>e[o]);t.querySelectorAll("[data-sve-code-split]").forEach(o=>{const s=o.getAttribute("data-sve-code-split-after"),r=n.indexOf(s);o.style.display=r>=0&&r<n.length-1?"block":"none"}),dr(t.ownerDocument.defaultView,t),Hn(t)}function dr(t,e){const n=ar(t);for(const o of yt){const s=e.querySelector(`[data-sve-code-pane="${o}"]`);s&&(s.style.flex=`${n[o]} 1 0`)}}function qt(t,e){if(a.dragging)return;const n=t.document;Ue(n,e);const o=su(t),s=cu(n),r=du(n);e.style.left=`${s}px`,e.style.right=`${r}px`,e.style.bottom="0",e.style.height=`${o}px`,zn(n,o),Hn(e)}function ur(t,e,n,o){a.dragging=!0,ha(t,e,n,()=>{a.dragging=!1,o?.()},"data-sve-code-drag-shield")}function mu(t,e){if(e._sveResizeBound)return;e._sveResizeBound=!0;const n=o=>{if(o.button!==0||o.target.closest('button, a, input, select, textarea, label, [role="button"], [contenteditable], .cm-editor'))return;o.preventDefault();const s=o.clientY,r=e.getBoundingClientRect().height;let i=r;ur(t,"ns-resize",l=>{i=Math.min(Math.max(Pr,r+(s-l.clientY)),Math.round(t.innerHeight*.7)),e.style.height=`${i}px`,zn(t.document,i),ir()},()=>{ru(t,i),qt(t,e),t.dispatchEvent(new Event("resize"))})};e.querySelector("[data-sve-code-bar]")?.addEventListener("mousedown",n),e.querySelector("[data-sve-code-grip]")?.addEventListener("mousedown",n)}function gu(t,e){e._sveSplitBound||(e._sveSplitBound=!0,e.querySelectorAll("[data-sve-code-split]").forEach(n=>{n.addEventListener("mousedown",o=>{if(o.button!==0)return;o.preventDefault(),o.stopPropagation();const s=n.getAttribute("data-sve-code-split-after"),r=yt.filter(E=>lr(t,e)[E]),i=r.indexOf(s),l=r[i],c=r[i+1];if(!l||!c)return;const d=e.querySelector(`[data-sve-code-pane="${l}"]`),f=e.querySelector(`[data-sve-code-pane="${c}"]`),h=o.clientX,p=d.getBoundingClientRect().width,y=f.getBoundingClientRect().width,b=p+y;n.setAttribute("data-active",""),ur(t,"col-resize",E=>{const Bt=E.clientX-h;let ze=Math.max(Ve,Math.min(b-Ve,p+Bt)),Nn=b-ze;b<Ve*2&&(ze=p,Nn=y);const He=ar(t);He[l]=ze,He[c]=Nn,iu(t,He),dr(t,e),ir()},()=>{n.removeAttribute("data-active")})})}))}function vu(t,e){e._svePaneBound||(e._svePaneBound=!0,e.querySelectorAll("[data-sve-code-pane-btn]").forEach(n=>{n.addEventListener("click",o=>{o.stopPropagation();const s=n.getAttribute("data-sve-code-pane-btn"),r=lr(t,e),i={...r,[s]:!r[s]};!i.html&&!i.css&&!i.js&&(i[s]=!0),au(t,i),cr(e,i)})}))}function O(t,e){const n=t.getElementById(u)?.querySelector("[data-sve-code-status]");n&&(n.textContent=e||"")}function fr(t,e){const n=t.getElementById(u)?.querySelector("[data-sve-code-path]");n&&(n.textContent=e||"",n.title=e||"")}function Vt(t){const e=t?.document?.getElementById(u)?.querySelector("[data-sve-code-back]");e&&(e.hidden=a.typeStack.length===0,e.title=m(t,"code_dock_back"),e.setAttribute("aria-label",e.title),e.innerHTML=Cu)}function Lo(t,e){const n=e.querySelector("[data-sve-code-back]");!n||n._sveBound||(n._sveBound=!0,n.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),$s(t)}))}let D,on,hr,pr,mr,ft,ve,kt,ne,St,_t,gr,vr,yr,br,xr,kr,Sr,_r,wr,$r,Rn,Cr,Ar,Tr,Mr,sn,rn,Er,yu,It=null,w=null;function bu(){return It||(It=ga().then(t=>{w=t,D=w.view.EditorView,on=w.view.keymap,hr=w.view.lineNumbers,pr=w.view.highlightActiveLine,mr=w.view.highlightActiveLineGutter,ft=w.state.Compartment,ve=w.state.EditorState,kt=w.state.StateField,ne=w.state.StateEffect,St=w.state.RangeSetBuilder,_t=w.view.Decoration,gr=w.commands.defaultKeymap,vr=w.commands.indentWithTab,yr=w.commands.historyKeymap,br=w.commands.history,xr=w.autocomplete.autocompletion,kr=w.autocomplete.closeBrackets,Sr=w.autocomplete.closeBracketsKeymap,_r=w.autocomplete.closeCompletion,wr=w.autocomplete.completionKeymap,$r=w.view.hoverTooltip,Rn=w.langHtml.htmlLanguage,Cr=w.langHtml.html,Ar=w.langCss.css,Tr=w.langJs.javascript,w.language.HighlightStyle,w.language.syntaxHighlighting,Mr=w.language.codeFolding,sn=w.language.foldEffect,rn=w.language.unfoldEffect,Er=w.language.foldedRanges,yu=w.highlight.tags,Dt.html=new ft,Dt.css=new ft,Dt.js=new ft,zt.html=new ft,zt.css=new ft,zt.js=new ft}).catch(t=>{throw It=null,t}),It)}const xu="{{ _class }}",u=pa,ku="__sve-code-dock-style",V="__sve-code-dock-unlock",Lr="sve-code-dock-height",Br="sve-code-dock-panes",Fr="sve-code-dock-widths",De="sve-html-scope-v2",Ir="sve-code-dock-autosave",Or="sve-code-dock-style-mode",jn="sve-code-dock-values",Su=280,Pr=120,Ve=140,_u=250,nt=["html","css","js"],yt=["html","css","alpine","js"],wu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',$u='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-1"/></svg>',Cu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',Dr='<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1c0 .966.784 1.75 1.75 1.75h.418A1.74 1.74 0 0 0 4 7.25v1.5c0 .49.201.932.525 1.25c-.324.318-.525.76-.525 1.25v1c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 14 12.25v-1c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1.5c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1A1.75 1.75 0 0 0 12.25 2zm8.5 7.5H8v-3h4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75M7 6.5v3H5.75A.75.75 0 0 1 5 8.75v-1.5a.75.75 0 0 1 .75-.75zm1 4h4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75H8zm-1 0V13H5.75a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-1-5V3h6.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75zm-1 0H3.75A.75.75 0 0 1 3 4.75v-1A.75.75 0 0 1 3.75 3H5z"/></svg>',Au='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/><path d="M4.5 11.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/></svg>',Tu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 16.3A8.5 8.5 0 1 1 18.3 6.3"/><path d="M21 3.2v5.4h-5.4"/></svg>',Mu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',Eu='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',_="__sve-css-menu",zr=["h1","h2","h3","h4","h5","h6"],an=[{id:"section",title:"section",tag:"section"},{id:"div",title:"div",tag:"div"},{id:"heading",title:"heading",menu:"heading"},{id:"text",title:"text",menu:"text"},{id:"a",title:"link",tag:"a"},{id:"img",title:"image",snippet:'<img src="" alt="">',caret:10},{id:"video",title:"video",snippet:'<video src="" controls playsinline></video>',caret:12},{id:"svg",title:"svg",tag:"svg"},{id:"ul",title:"list",tag:"ul"},{id:"li",title:"list item",tag:"li"},{id:"component",title:"component",menu:"component"},{id:"loop",title:"loop",snippet:`{{ items }}

{{ /items }}
`,caret:3,select:5},{id:"if",title:"if",snippet:`{{ if true }}

{{ /if }}
`,caret:6,select:4}],Lu=["--size-100","--size-200","--size-300","--size-400","--size-500","--size-600","--size-700","--size-800","--size-900","--gutter"],Bu={"tw-text":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 13 5 3l3.5 10M2.7 10h4.6"/><path d="M12.5 3.5v9M11 5l1.5-1.5L14 5M11 11l1.5 1.5L14 11"/></svg>',"tw-leading":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h8.5M6 8h8.5M6 12.5h8.5"/><path d="M2.5 4.5v7M1.4 5.6 2.5 4.5l1.1 1.1M1.4 10.4l1.1 1.1 1.1-1.1"/></svg>',"tw-font":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.2V3h10v1.2M8 3v10M6 13h4"/></svg>',"tw-radius":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 13.5v-6a5 5 0 0 1 5-5h6"/><path d="M13.5 6.5v7h-7" stroke-dasharray="2 2"/></svg>',"tw-gap":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"tw-align":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3.5h12M2 8h8M2 12.5h10"/></svg>',"tw-w":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3.5v9M14 3.5v9"/><path d="M4.5 8h7"/><path d="M6 6.2 4.2 8 6 9.8M10 6.2 11.8 8 10 9.8"/></svg>',"tw-h":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 2h9M3.5 14h9"/><path d="M8 4.5v7"/><path d="M6.2 6 8 4.2 9.8 6M6.2 10 8 11.8 9.8 10"/></svg>',"tw-maxw":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3v10M14.5 3v10"/><path d="M5 8h6"/><path d="M6.6 6.2 4.8 8l1.8 1.8M9.4 6.2 11.2 8l-1.8 1.8"/></svg>',"tw-overflow":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="1.8" y="4.5" width="8.6" height="9.7" rx="1.2"/><path d="M6.5 1.8h7.7v7.7" stroke-linecap="round"/></svg>',"tw-border":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6"/><rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" stroke-width="1" opacity=".45"/></svg>'},Fu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="10" width="18" height="11" rx="2"/><rect x="6" y="3" width="9" height="4" rx="1.4" fill="currentColor" stroke="none"/></svg>',Iu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.1 12a8.9 8.9 0 1 0 2.8-6.5L3 8"/><path d="M3 3.4V8h4.6"/><path d="M12 7.4V12l3 1.8"/></svg>',Ou='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>',Pu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></svg>',Du='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/><path d="M3 17c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/></svg>',Hr=[["--gray-50","#fafafa"],["--gray-100","#f5f5f5"],["--gray-200","#e5e5e5"],["--gray-300","#d4d4d4"],["--gray-400","#a3a3a3"],["--gray-500","#737373"],["--gray-600","#525252"],["--gray-700","#404040"],["--gray-800","#262626"],["--gray-900","#171717"],["--gray-950","#0a0a0a"]],Bo=t=>[{id:`${t}-all`,icon:"box-all",title:"All sides",css:t,tw:t,menu:"spacing"},{id:`${t}-block`,icon:"box-block",title:"Top and bottom",css:`${t}-block`,tw:`${t}-block`,menu:"spacing",sep:!0},{id:`${t}-block-start`,icon:"box-block-start",title:"Top",css:`${t}-block-start`,tw:`${t}-top`,menu:"spacing"},{id:`${t}-block-end`,icon:"box-block-end",title:"Bottom",css:`${t}-block-end`,tw:`${t}-bottom`,menu:"spacing"},{id:`${t}-inline`,icon:"box-inline",title:"Left and right",css:`${t}-inline`,tw:`${t}-inline`,menu:"spacing",sep:!0},{id:`${t}-inline-start`,icon:"box-inline-start",title:"Left",css:`${t}-inline-start`,tw:`${t}-left`,menu:"spacing"},{id:`${t}-inline-end`,icon:"box-inline-end",title:"Right",css:`${t}-inline-end`,tw:`${t}-right`,menu:"spacing"}],zu=[{id:"display-flex",twClass:"flex",icon:"display-flex",title:"Flex",kind:"display",value:"flex",css:"display"},{id:"flex-row",twClass:"flex-row",icon:"flex-row",title:"Direction: row",kind:"flexDir",value:"row",css:"flex-direction",sep:!0},{id:"flex-col",twClass:"flex-col",icon:"flex-col",title:"Direction: column",kind:"flexDir",value:"column",css:"flex-direction"},{id:"justify-start",twClass:"justify-start",icon:"justify-start",title:"Justify: start",css:"justify-content",value:"flex-start",when:"flex",sep:!0},{id:"justify-center",twClass:"justify-center",icon:"justify-center",title:"Justify: center",css:"justify-content",value:"center",when:"flex"},{id:"justify-end",twClass:"justify-end",icon:"justify-end",title:"Justify: end",css:"justify-content",value:"flex-end",when:"flex"},{id:"justify-between",twClass:"justify-between",icon:"justify-between",title:"Justify: between",css:"justify-content",value:"space-between",when:"flex"},{id:"justify-around",twClass:"justify-around",icon:"justify-around",title:"Justify: around",css:"justify-content",value:"space-around",when:"flex"},{id:"align-start",twClass:"items-start",icon:"align-start",title:"Align: start",css:"align-items",value:"flex-start",when:"flex",sep:!0},{id:"align-center",twClass:"items-center",icon:"align-center",title:"Align: center",css:"align-items",value:"center",when:"flex"},{id:"align-end",twClass:"items-end",icon:"align-end",title:"Align: end",css:"align-items",value:"flex-end",when:"flex"},{id:"align-stretch",twClass:"items-stretch",icon:"align-stretch",title:"Align: stretch",css:"align-items",value:"stretch",when:"flex"}],Hu=[{id:"gap-all",icon:"gap-all",title:"Both",css:"gap",tw:"gap",menu:"spacing"},{id:"gap-row",icon:"gap-row",title:"Between rows",css:"row-gap",tw:"row-gap",menu:"spacing",sep:!0},{id:"gap-col",icon:"gap-col",title:"Between columns",css:"column-gap",tw:"column-gap",menu:"spacing"}],Ru=[{id:"bd-all",icon:"bd-all",title:"All sides",css:"border-color",tw:"border-color",menu:"colors"},{id:"bd-block",icon:"bd-block",title:"Top and bottom",css:"border-block-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-top",icon:"bd-top",title:"Top",css:"border-block-start-color",tw:"border-top-color",menu:"colors"},{id:"bd-bottom",icon:"bd-bottom",title:"Bottom",css:"border-block-end-color",tw:"border-bottom-color",menu:"colors"},{id:"bd-inline",icon:"bd-inline",title:"Left and right",css:"border-inline-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-left",icon:"bd-left",title:"Left",css:"border-inline-start-color",tw:"border-left-color",menu:"colors"},{id:"bd-right",icon:"bd-right",title:"Right",css:"border-inline-end-color",tw:"border-right-color",menu:"colors"}],ju=[{id:"rd-all",icon:"rd-all",title:"All corners",css:"border-radius",tw:"border-radius",menu:"values"},{id:"rd-tl",icon:"rd-tl",title:"Top left",css:"border-start-start-radius",tw:"border-top-left-radius",menu:"values",sep:!0},{id:"rd-tr",icon:"rd-tr",title:"Top right",css:"border-start-end-radius",tw:"border-top-right-radius",menu:"values"},{id:"rd-br",icon:"rd-br",title:"Bottom right",css:"border-end-end-radius",tw:"border-bottom-right-radius",menu:"values"},{id:"rd-bl",icon:"rd-bl",title:"Bottom left",css:"border-end-start-radius",tw:"border-bottom-left-radius",menu:"values"}],Rr=[{id:"display",title:"Display",css:"display",tw:"display",kids:zu},{id:"absolute",title:"Position",css:"position",tw:"position",value:"absolute"},{id:"color",title:"Text color",css:"color",tw:"color",menu:"colors"},{id:"bg",title:"Background color",css:"background-color",tw:"background-color",menu:"colors"},{id:"padding",title:"Padding",css:"padding",tw:"padding",kids:Bo("padding")},{id:"margin",title:"Margin",css:"margin",tw:"margin",kids:Bo("margin")},{id:"tw-text",title:"Font size",css:"font-size",tw:"font-size",menu:"values"},{id:"tw-leading",title:"Line height",css:"line-height",tw:"line-height",menu:"values"},{id:"tw-font",title:"Font family",css:"font-family",tw:"font-family",menu:"values"},{id:"tw-align",title:"Text align",css:"text-align",tw:"text-align",menu:"choices",choices:["left","center","right","justify"]},{id:"tw-border",title:"Border color",css:"border-color",tw:"border-color",kids:Ru},{id:"tw-radius",title:"Radius",css:"border-radius",tw:"border-radius",kids:ju},{id:"tw-gap",title:"Gap",css:"gap",tw:"gap",kids:Hu},{id:"tw-w",title:"Width",css:"width",tw:"width",menu:"sizes"},{id:"tw-h",title:"Height",css:"height",tw:"height",menu:"sizes"},{id:"tw-maxw",title:"Max width",css:"max-width",tw:"max-width",menu:"sizes"},{id:"tw-overflow",title:"Overflow",css:"overflow",tw:"overflow",menu:"choices",choices:["visible","hidden","clip","auto","scroll"]}],Nu=["100%","auto","fit-content","min-content","max-content","100vw","100dvh","0"],ye=new Map;for(const t of Rr){ye.set(t.id,{tool:t,kid:null});for(const e of t.kids||[])ye.set(e.id,{tool:t,kid:e})}const Fo={display:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2.5" width="13" height="11" rx="1.2"/><path d="M5 6.5h6M5 9.5h4"/></svg>',"display-flex":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="3.4" height="9" rx=".4"/><rect x="6.3" y="3.5" width="3.4" height="9" rx=".4"/><rect x="10.6" y="3.5" width="3.4" height="9" rx=".4"/></svg>',"flex-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12"/><path d="M4.2 5.8 2 8l2.2 2.2"/><path d="M11.8 5.8 14 8l-2.2 2.2"/></svg>',"flex-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v12"/><path d="M5.8 4.2 8 2l2.2 2.2"/><path d="M5.8 11.8 8 14l2.2-2.2"/></svg>',"justify-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="5.4" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4.6" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="8.2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-between":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-around":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"align-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="5.4" width="9" height="2.4" rx=".4"/></svg>',"align-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="4.6" width="9" height="2.4" rx=".4"/><rect x="3.5" y="9" width="9" height="2.4" rx=".4"/></svg>',"align-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="8.2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="11.6" width="9" height="2.4" rx=".4"/></svg>',"align-stretch":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx=".5"/><rect x="9" y="2" width="4" height="12" rx=".5"/></svg>',absolute:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>',color:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.4 11.2 7.4 2.4l4 8.8"/><path d="M4.7 8.4h5.4"/><rect x="1.6" y="12.8" width="12.8" height="2.2" rx=".6" fill="currentColor" stroke="none"/></svg>',bg:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 1.9a6.1 6.1 0 1 0 0 12.2c.85 0 1.35-.55 1.35-1.25 0-.38-.18-.66-.4-.88a1.2 1.2 0 0 1 .85-2.05h1.3A3.5 3.5 0 0 0 14.1 6.1C14.1 3.75 11.4 1.9 8 1.9Z"/><circle cx="4.9" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="8" cy="4.8" r=".95" fill="currentColor" stroke="none"/><circle cx="11.1" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="4.7" cy="9.9" r=".95" fill="currentColor" stroke="none"/></svg>',padding:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/></svg>',margin:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/><path d="M2 2.5h12M2 13.5h12M2.5 2v12M13.5 2v12" stroke-dasharray="1.4 1.2"/></svg>',"box-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".4" fill="currentColor" stroke="none"/></svg>',"box-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"gap-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"gap-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="3" y="1.6" width="10" height="4.2" rx=".6"/><rect x="3" y="10.2" width="10" height="4.2" rx=".6"/><path d="M4.5 8h7"/></svg>',"gap-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"bd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4"/></svg>',"bd-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-top":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-bottom":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-left":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-right":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"rd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="3.4"/></svg>',"rd-tl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6H6a3.4 3.4 0 0 0-3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M2.6 9V6A3.4 3.4 0 0 1 6 2.6h3" stroke-width="2.2"/></svg>',"rd-tr":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6h7.4a3.4 3.4 0 0 1 3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M7 2.6h3A3.4 3.4 0 0 1 13.4 6v3" stroke-width="2.2"/></svg>',"rd-br":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6v7.4a3.4 3.4 0 0 1-3.4 3.4H2.6" stroke-width="1" opacity=".35"/><path d="M13.4 7v3a3.4 3.4 0 0 1-3.4 3.4H7" stroke-width="2.2"/></svg>',"rd-bl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6v7.4a3.4 3.4 0 0 0 3.4 3.4h7.4" stroke-width="1" opacity=".35"/><path d="M2.6 7v3A3.4 3.4 0 0 0 6 13.4h3" stroke-width="2.2"/></svg>'},g={html:null,css:null,js:null},Dt={html:null,css:null,js:null},zt={html:null,css:null,js:null};export{ff as ARMED_KEY,Tu as AUTOSAVE_ICON,Ir as AUTOSAVE_KEY,Cu as BACK_ICON,Eu as CSS_ADD_ICON,Hr as CSS_GRAYS,Nu as CSS_LENGTHS,_ as CSS_MENU_ID,Ou as CSS_MODE_ICON,In as CSS_SIZE_KEY,Lu as CSS_SPACING,On as CSS_STATES,en as CSS_STATE_KEY,Rr as CSS_TOOLS,Fo as CSS_TOOL_ICONS,ye as CSS_TOOL_INDEX,Au as DATA_ICON,At as DATA_MENU_ID,Su as DEFAULT_HEIGHT,u as DOCK_ID,_t as Decoration,ve as EditorState,D as EditorView,nt as HANDLES,Lr as HEIGHT_KEY,Iu as HISTORY_ICON,zr as HTML_HEADINGS,an as HTML_TOOLS,Pu as ID_MODE_ICON,wu as LOCK_CLOSED_ICON,$u as LOCK_OPEN_ICON,Pr as MIN_HEIGHT,Ve as MIN_PANE,yt as PANES,Br as PANES_KEY,St as RangeSetBuilder,Mu as SAVE_ICON,_u as SAVE_MS,xu as SCOPE_CLASS,Dr as SCOPE_ICON,De as SCOPE_KEY,Fu as STRIP_ICON,ku as STYLE_ID,Or as STYLE_MODE_KEY,ne as StateEffect,kt as StateField,Du as TW_MODE_ICON,Bu as TW_TOOL_ICONS,V as UNLOCK_ID,jn as VALUES_MODE_KEY,Fr as WIDTHS_KEY,Jt as applyCssFolds,Gt as applyCssScope,nc as applyDisplay,ec as applyFlexDirection,Is as applyHtmlTag,K as applyRuleDecls,Ys as applyStyleMode,xr as autocompletion,_n as autosaveEnabled,Yd as bindAntlersSnippets,co as bindAutosave,Lo as bindBack,Xl as bindCssAddClass,_d as bindCssTools,Zd as bindDataVars,gd as bindHistory,uo as bindHtmlScope,$d as bindHtmlTidy,Cd as bindHtmlTools,fu as bindLayoutWatch,lo as bindLock,vu as bindPaneToggles,mu as bindResize,gu as bindSplitters,md as bindStrip,Sd as bindStyleMode,Qd as bindVisualEditSnippets,Le as clearHtmlScopeRange,kr as closeBrackets,Sr as closeBracketsKeymap,nn as closeCodeDock,af as closeCodeDockPopups,_r as closeCompletion,x as closeCssMenu,R as closeDataMenu,w as cm,lf as codeDockStyleMode,Mr as codeFolding,tr as collectionViewType,wr as completionKeymap,Ar as css,Os as cssEditorText,Fe as cssRuleAtCursor,Ks as cssSizeRow,ut as cssSizeRows,Pe as cssStateSuffix,Z as currentFlexDecls,Et as currentFullHtml,_s as currentSectionValues,xt as currentTemplateType,gr as defaultKeymap,ht as dispatchHtmlChanges,zt as editableOf,g as editors,lu as ensureStyle,xs as ensureTwCss,Zs as enterValuesRule,I as finishHtmlEdit,Fl as flushBracketSync,at as flushCssScope,Il as flushCssToHtml,W as flushSave,sn as foldEffect,Er as foldedRanges,$s as goBackTemplate,pr as highlightActiveLine,mr as highlightActiveLineGutter,br as history,yr as historyKeymap,$r as hoverTooltip,Cr as html,Ts as htmlEditorText,Xt as htmlElementAtCursor,Ce as htmlFocusOk,Rn as htmlLanguage,Kt as htmlScopeEnabled,bt as htmlTargetFromCursor,qd as inDynamicAttribute,Ie as indentFromPrevious,vr as indentWithTab,Td as insertAiSnippet,Bs as insertHtmlElement,Rt as insertHtmlSnippet,bs as isChromeTemplateType,sa as isCodeDockArmed,dt as isCodeDockLocked,Qs as isCodeDockOpen,ou as isPanelFrame,Tr as javascript,on as keymap,nu as languageOf,pt as leadingCssIndent,rt as lineIndentOf,hr as lineNumbers,bu as loadCm,Wt as loadTemplate,rd as mountEditor,Gs as newSizeBlockSpot,tn as newSizeQuery,F as normalizeFlexValue,Dn as observeDockLayout,J as onEditorInput,ac as openCssChoiceMenu,rc as openCssColorMenu,ic as openCssSpacingMenu,yo as openCssValueMenu,nr as openDataVarsMenu,Ul as openHtmlComponentMenu,mo as openHtmlTagMenu,ws as openNestedTemplate,or as openPickerMenu,Pl as openRenameClassMenu,Oe as paintAlpine,st as paintAutosave,Vt as paintBack,Qt as paintCssHead,Ln as paintCssIdMark,L as paintCssToolState,ad as paintHostWait,q as paintHtmlScope,Be as paintHtmlToolState,Ct as paintLock,cr as paintPaneButtons,Nt as paintStrip,Fn as paintStyleMode,Bn as paintValuesMode,H as placeCssMenu,qt as placeDock,zn as previewBottomPad,Ll as primeTailwindCompile,Dt as readOnlyOf,Tn as readParts,Ed as refreshCodeDockFromDisk,pe as refreshPreview,Ld as relayoutCodeDock,Te as rememberBracketNames,Lt as rememberCssSelectors,El as resetTailwindCompile,Mn as sameParts,hf as setCodeDockArmed,fr as setPath,O as setStatus,yd as setValuesMode,Eo as shieldDock,An as showHtmlFull,Cn as showHtmlScope,uu as stopObservingDockLayout,rr as storedPanes,cf as syncCodeDock,Ge as syncHtmlTree,Ae as syncScopedHtml,te as syncTwTarget,yu as tags,oa as templateDockAllowed,Fs as tidyHtmlPane,rn as unfoldEffect,Me as writeHandleEditor,Ee as writeHtmlEditor,Zt as writeParts};
