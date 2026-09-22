const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-CroZAfJZ.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{o as k,a as S,b as v,t as M,k as Ir,l as mt,s as Mn,p as be,F as N,d as ct,w as B,f as En,r as ao,u as $,q as Re,g as X,_ as Ln,n as Or,v as Ho,x as Pr,y as Dr,z as zr,A as Ro,B as Hr,D as G,E as j,h as p,j as Rr,C as jr,i as Bn,G as Nr,H as jo,I as Wr,J as z,K as nt,L as No,M as qr,m as P,O as io,P as Fn,Q as Vr,R as Ur,S as In,T as lo,U as Kr,V as Ut,W as co,X as Gr,Y as Xr,Z as Zr,$ as Yr,a0 as On,a1 as Pn,a2 as Dn,a3 as Jr,a4 as Wo,a5 as je,a6 as gt,a7 as Qr,a8 as ta,a9 as ea,aa as Ue,ab as oa,ac as na,ad as sa,ae as ra,af as C,ag as aa,ah as ia,ai as qo,aj as la,ak as ca}from"./addon-DhCpwkL7.js";import{al as ef,am as of}from"./addon-DhCpwkL7.js";import{v as da,l as ua}from"./codemirror-CtkoENz3.js";import{p as xe,f as zn,h as fa,t as Hn,c as ha,a as Rn,b as pa,d as ma,e as ga,g as va,i as Vo,j as ya,k as ba,l as jn,m as xa,n as ka,o as Sa,q as _a,s as wa,r as Nn,u as $a,v as Ke,w as Ca,H as Wn,x as Aa,y as Ta,z as qn,A as Ma,B as Ea,_ as Vn,C as Uo,P as ne}from"./tw-classes-D-zeTRjA.js";import{t as La}from"./tw-candidates-wYTeDvRv.js";import{h as Ba,a as Fa,e as Ia,A as Ko,b as Oa,i as uo,c as Pa,d as de}from"./html-tag-sync-Cw8-lxeX.js";import{M as Un,S as Kn}from"./protocol-BzWs6Y7c.js";import"./ai-text-icon-B7uCWIwa.js";import"./index-Dpuj8sxX.js";import"./index-B5fiB6ig.js";import"./index-QkwZ_wP2.js";import"./index-CY0AOW5Y.js";import"./index-gYg9gdv3.js";import"./index-lzvKgifK.js";import"./index-BBw1nzv2.js";import"./index-DqbOpr3Y.js";import"./index-C_pm8ee_.js";import"./index-B8kpdD8S.js";const Gn=/^\.[a-zA-Z_][\w-]*$/;function fo(t){const e=String(t||""),o=/(^|\s)\[/g;let n;for(;n=o.exec(e);){const s=n.index+n[1].length,r=/\](?=\s|$)/g;r.lastIndex=s+1;const i=r.exec(e);if(i)return{from:s,to:i.index+1,innerFrom:s+1,innerTo:i.index}}return null}function Xn(t){const e=String(t||""),o=fo(e);return o?e.slice(o.innerFrom,o.innerTo).replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).filter(n=>/^[a-zA-Z_][\w-]*$/.test(n)):[]}function Zn(t){const e=String(t||"").match(/\sclass\s*=\s*(["'])([^"']*)\1/i);return e?Xn(e[2]):[]}function Da(t){return Zn(t)[0]||""}function ke(t){const e=String(t||""),o=[],n=/\sclass\s*=\s*(["'])/gi;let s;for(;s=n.exec(e);){const r=s[1],i=s.index+s[0].length,l=e.indexOf(r,i);if(l===-1)break;const c=e.slice(i,l),d=fo(c);if(d){const h=c.slice(d.innerFrom,d.innerTo),f=i+d.innerFrom,m=h.replace(/\{\{[\s\S]*?\}\}/g,E=>" ".repeat(E.length)),y=/[a-zA-Z_][\w-]*/g;let b;for(;b=y.exec(m);)o.push({name:b[0],from:f+b.index,to:f+b.index+b[0].length})}n.lastIndex=l+1}return o}function Go(t,e){return ke(t).find(o=>e>=o.from&&e<=o.to)||null}function Xo(t,e){const o=String(t||""),n=ke(o);let s=o;for(let r=n.length-1;r>=0;r-=1){const i=n[r],l=e(i.name);if(l!==i.name){if(!l){let c=i.from,d=i.to;s[d]===" "?d+=1:c>0&&s[c-1]===" "&&(c-=1),s=s.slice(0,c)+s.slice(d);continue}s=s.slice(0,i.from)+l+s.slice(i.to)}}return s}function Yn(t){const e=[],o=/(^|[^\w-])\.([a-zA-Z_][\w-]*)\s*\{/g;let n;for(;n=o.exec(String(t||""));)e.push(n[2]);return e}function Jn(t,e){const o=[],n=[],s=[];let r=0,i=0;for(;r<t.length&&i<e.length;){if(t[r]===e[i]){r+=1,i+=1;continue}const l=e.indexOf(t[r],i),c=t.indexOf(e[i],r);l===-1&&c===-1?(o.push({from:t[r],to:e[i]}),r+=1,i+=1):l===-1?(s.push(t[r]),r+=1):c===-1||l<=c?(n.push(e[i]),i+=1):(s.push(t[r]),r+=1)}for(;r<t.length;)s.push(t[r]),r+=1;for(;i<e.length;)n.push(e[i]),i+=1;return{renamed:o,added:n,removed:s}}function vt(t){let e=String(t||"").trim().replace(/^\.+/,"").replace(/\s+/g,"-").replace(/[^a-zA-Z0-9_-]/g,"");return/^[a-zA-Z_]/.test(e)||(e=e.replace(/^[^a-zA-Z_]+/,"")),Gn.test(`.${e}`)?e:""}function za(t,e){const o=String(t||""),n=vt(e);if(!o||!n)return o;const s=o.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(s){const r=s[1];let i=s[2];const l=fo(i);if(l){const c=i.slice(l.innerFrom,l.innerTo).trim(),h=Xn(i).includes(n)?c:`${c} ${n}`.trim();i=`${i.slice(0,l.from)}[ ${h} ]${i.slice(l.to)}`}else i=`[ ${n} ] ${i}`.trim();return o.slice(0,s.index)+` class=${r}${i}${r}`+o.slice(s.index+s[0].length)}return/\/\s*>$/.test(o)?o.replace(/(\s*)(\/\s*>)$/,` class="[ ${n} ]"$1$2`):o.replace(/(\s*)>$/,` class="[ ${n} ]"$1>`)}function Ha(t,e){const o=String(t).indexOf(">",e.from);return o===-1?"":t.slice(e.from,o+1)}function Qn(t,e){const o=[];for(const n of e){const s=Zn(Ha(t,n)),r=Qn(t,n.children||[]);if(s.length){o.push({className:s[0],children:r});for(const i of s.slice(1))o.push({className:i,children:[]})}else o.push(...r)}return o}function Se(t){return Qn(t,xe(t))}function ue(t){return String(t).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function ho(t,e){if(t.startsWith("/*",e)){const o=t.indexOf("*/",e+2);return o===-1?t.length:o+2}return e}function Mt(t,e){let o=0;for(let n=e;n<t.length;n+=1){if(t.startsWith("/*",n)){n=ho(t,n)-1;continue}if(t[n]==="{")o+=1;else if(t[n]==="}"&&(o-=1,o===0))return n}return-1}function U(t,e){const o=String(t||""),n=new RegExp(`(^|[^\\w-])\\.${ue(e)}\\s*\\{`,"g");let s;for(;s=n.exec(o);){const r=s.index+s[1].length,i=o.indexOf("{",r);if(i===-1)continue;const l=Mt(o,i);if(l!==-1)return{from:r,brace:i,close:l,to:l+1,name:e}}return null}function Ra(t){const e=String(t||""),o=[],n={},s=[];let r=0,i="";const l=()=>{const c=i.trim();c&&o.push(c),i=""};for(;r<e.length;){if(e.startsWith("/*",r)){const c=ho(e,r);i+=e.slice(r,c),r=c;continue}if(e[r]==="{"){const c=i.trim(),d=Mt(e,r);if(d===-1)break;const h=e.slice(r+1,d);i="",Gn.test(c)?n[c.slice(1)]=h:c&&s.push(`${c} {${h}}`),r=d+1;continue}i+=e[r],r+=1}return l(),{decls:o.join(`
`),classes:n,other:s}}function Zo(t,e){const o="    ".repeat(e);return String(t||"").split(`
`).map(n=>n.trim()?o+n.trim():"").filter((n,s,r)=>n||s>0&&s<r.length-1).join(`
`)}function ja(t,e){const o=U(t,e);return o?String(t).slice(o.brace+1,o.close):""}function ts(t,e,o){const n=Ra(ja(e,t.className)),s="    ".repeat(o),r=[];n.decls&&r.push(Zo(n.decls.replace(/;+\s*$/,";"),o+1));for(const l of n.other)r.push(Zo(l,o+1));for(const l of t.children)r.push(ts(l,e,o+1));const i=r.filter(Boolean).join(`
`);return i?`${s}.${t.className} {
${i}
${s}}`:`${s}.${t.className} {
${s}}`}function po(t,e){return e?.length?e.map(o=>ts(o,t,0)).join(`

`)+`
`:""}function es(t){const e=String(t||"").match(/^\s*\.([a-zA-Z_][\w-]*)\s*\{/);return e?e[1]:""}function Na(t){const e=[],o=/\.([a-zA-Z_][\w-]*)\s*\{/g;let n,s=!0;for(;n=o.exec(String(t||""));){if(s){s=!1;continue}e.push(n[1])}return e}function Wa(t,e){const o=String(t).lastIndexOf(`
`,e-1)+1,n=t.slice(o,e);return/^\s*$/.test(n)?n:""}function qa(t,e){return e?t.split(`
`).map((o,n)=>n===0||!o?o:e+o).join(`
`):t}function Va(t,e){let o=0;for(let n=0;n<e.from;n+=1){if(t.startsWith("/*",n)){n=ho(t,n)-1;continue}t[n]==="{"?o+=1:t[n]==="}"&&(o-=1)}return o===0}function mo(t,e,o){const n=es(e)||o;if(!n)return String(t||"");let s=String(e||"").trim();s?new RegExp(`^\\.${ue(n)}\\s*\\{`).test(s)||(s=`.${n} {
${s}
}`):s=`.${n} {
}`;let r=String(t||"");const i=U(r,n),l=Na(s);if(i){const d=Wa(r,i.from);r=r.slice(0,i.from)+qa(s,d)+r.slice(i.to)}else r=`${r.trimEnd()}${r.trim()?`
`:""}${s}
`;const c=U(r,n);if(!c)return r;for(const d of[...new Set(l)].reverse()){const h=new RegExp(`(^|[^\\w-])\\.${ue(d)}\\s*\\{`,"g"),f=[];let m;for(;m=h.exec(r);){const y=m.index+m[1].length,b=r.indexOf("{",y),E=Mt(r,b);E!==-1&&f.push({from:y,to:E+1})}for(const y of f.reverse()){if(y.from>=c.from&&y.to<=c.to||!Va(r,y))continue;let b=y.from;const E=r.lastIndexOf(`
`,b-1)+1;/^\s*$/.test(r.slice(E,b))&&(b=E);let Ft=y.to;r[Ft]===`
`&&(Ft+=1),r=r.slice(0,b)+r.slice(Ft)}}return r}function Ne(t,e){const o=String(t||"");return`${o.trimEnd()}${o.trim()?`
`:""}.${e} {
}
`}function Ua(t,e,o){const n=vt(o);return!e||!n||e===n?String(t||""):U(t,n)?os(t,e):String(t||"").replace(new RegExp(`(^|[^\\w-])\\.${ue(e)}(\\s*\\{)`,"g"),`$1.${n}$2`)}function os(t,e){let o=String(t||"");for(;;){const n=U(o,e);if(!n)break;let s=n.from;const r=o.lastIndexOf(`
`,s-1)+1;/^\s*$/.test(o.slice(r,s))&&(s=r);let i=n.to;o[i]===`
`&&(i+=1),o=o.slice(0,s)+o.slice(i)}return o}function Ka(t,e,o){const n=Array.isArray(e)?e:[],s=Array.isArray(o)?o:[],{renamed:r,added:i}=Jn(n,s),l=new Set(s);let c=String(t||"");for(const d of r){const h=vt(d.to);if(h){if(l.has(d.from)){U(c,h)||(c=Ne(c,h));continue}U(c,d.from)?c=Ua(c,d.from,h):U(c,h)||(c=Ne(c,h))}}for(const d of i){const h=vt(d);!h||U(c,h)||(c=Ne(c,h))}return c}function Ga(t,e,o){const n=new Set(Array.isArray(e)?e:[]),s=new Set(Array.isArray(o)?o:[]);let r=String(t||"");for(const i of s)n.has(i)||(r=os(r,i));return r}const Q="__sve-css-rename-chip",Xa='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';function Za(t){const e=t.Decoration.mark({class:"sve-cm-css-token"}),o=t.StateEffect.define();return{extensions:[t.StateField.define({create(){return t.Decoration.none},update(s,r){let i;for(const c of r.effects)c.is(o)&&(i=c.value);if(i===void 0)return r.docChanged?t.Decoration.none:s;if(!i)return t.Decoration.none;const l=new t.RangeSetBuilder;return l.add(i.from,i.to,e),l.finish()},provide:s=>t.EditorView.decorations.from(s)})],setHover(s,r){s&&s.dispatch({effects:o.of(r)})}}}function tt(t){t?.getElementById(Q)?.remove()}function Ya(t,e,o,n){e.style.left=`${Math.max(6,Math.min(o,t.innerWidth-28))}px`,e.style.top=`${Math.max(6,n)}px`}function Ja(t,e,o,{onRename:n,title:s}){const r=t.document,i=e.coordsAtPos(o.to);if(!i)return;tt(r);const l=r.createElement("button");l.id=Q,l.type="button",l.innerHTML=Xa,l.title=s,l.setAttribute("aria-label",s),l.addEventListener("mousedown",c=>{c.preventDefault(),c.stopPropagation(),tt(r),n?.(o)}),l.addEventListener("mouseleave",()=>{t.setTimeout(()=>{e.dom.matches(":hover")||l.matches(":hover")||tt(r)},120)}),r.body.appendChild(l),Ya(t,l,i.right+2,i.top-1)}function Qa(t,e,{onRename:o,isLocked:n,setHover:s,title:r}){if(!e?.dom||e.dom._sveClassTokenBound)return;e.dom._sveClassTokenBound=!0;let i=null,l="";const c=()=>!!n?.(),d=()=>{t.clearTimeout(i),i=null,l="",s?.(e,null),tt(t.document)},h=f=>{if(c()){d();return}d(),o?.(f)};e.dom.addEventListener("mousemove",f=>{if(c()){d();return}if(f.target?.closest?.(`#${Q}`))return;const m=e.posAtCoords({x:f.clientX,y:f.clientY});if(m==null)return;const y=Go(e.state.doc.toString(),m);if(!y){t.clearTimeout(i),i=null,l="",s?.(e,null);return}const b=`${y.from}:${y.to}:${y.name}`;s?.(e,{from:y.from,to:y.to}),!(l===b&&(i||t.document.getElementById(Q)))&&(t.clearTimeout(i),l=b,i=t.setTimeout(()=>{i=null,Ja(t,e,y,{onRename:h,title:r||"Rename class"})},160))}),e.dom.addEventListener("mouseleave",f=>{f.relatedTarget?.closest?.(`#${Q}`)||t.setTimeout(()=>{t.document.getElementById(Q)?.matches(":hover")||d()},160)}),e.dom.addEventListener("dblclick",f=>{if(c())return;const m=e.posAtCoords({x:f.clientX,y:f.clientY});if(m==null)return;const y=Go(e.state.doc.toString(),m);y&&(f.preventDefault(),f.stopPropagation(),h(y))},!0),e.scrollDOM?.addEventListener("scroll",d),t.document._sveClassTokenDismiss||(t.document._sveClassTokenDismiss=!0,t.document.addEventListener("mousedown",f=>{f.target.closest(`#${Q}`)||tt(t.document)}))}const a={cssColorsPromise:null,lastUid:null,lastType:null,typeStack:[],lastParts:{html:"",css:"",js:""},lastProps:[],propsDirty:!1,lastLocked:!1,lockReady:!1,lastWin:null,loadGen:0,saveTimer:null,lastBracketNames:null,lastCssSelectorNames:null,saveInFlight:null,loadInFlight:null,dragging:!1,applying:!1,htmlScopePref:!0,htmlScopeActive:!1,styleMode:"css",cssToolRow:null,cssOpenTool:"",cssOpenMenu:"",cssValues:!1,twCss:null,twKey:"",twBusy:!1,twDirty:!1,htmlFocus:null,htmlFull:"",cssFull:"",cssPane:"full",cssScopeSnapshot:"",layoutObserver:null,layoutWin:null,observedEditor:null,observedRight:null,layoutWatchBound:!1,cssSize:"",cssState:"",cssOwnFolds:new Set,cssFoldSig:"",htmlPartialUi:null,htmlAntlersUi:null,htmlClassTokenUi:null,htmlLintUi:null,cssGhostUi:null},wt=new Map,Yo={scope:null,section:[],page:[],site:[]};function ns(t){const e=t?.location?.pathname?.match(/\/collections\/([^/]+)\//);return e?e[1]:""}function ss(t){const e=String(t||"").trim();return!e||/^(header|footer)\//.test(e)?"":e}function ti(t){return(Array.isArray(t)?t:[]).filter(e=>e?.handle).map(e=>`${e.kind==="collection"?"collection":"field"}:${e.handle}`).join("|")}function go({collection:t,set:e,view:o,scope:n}){return`${t}::${e}::${o||""}::${n||""}`}function rs(t){return wt.get(t)||null}function as(t,{collection:e,set:o,view:n,scope:s}){const r=go({collection:e,set:o,view:n,scope:s}),i=wt.get(r);if(i)return Promise.resolve(i);const l=new URLSearchParams;return e&&l.set("collection",e),o&&l.set("set",o),n&&l.set("view",n),s&&l.set("scope",s),t.fetch(`/!/sve/data-vars?${l.toString()}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(c=>c.ok?c.json():null).then(c=>{const d=c&&typeof c=="object"?c:Yo;return wt.set(r,d),d}).catch(()=>Yo)}function ei(t){if(!t){wt.clear();return}const e=`::${t}::`;for(const o of[...wt.keys()])o.includes(e)&&wt.delete(o)}function oi(t){if(t==null||t==="")return"";if(typeof t=="boolean")return t?"true":"false";if(Array.isArray(t))return t.length?`${t.length} ×`:"";if(typeof t=="object"){const o=Object.keys(t).length;return o?`${o} ×`:""}const e=String(t).replace(/\s+/g," ").trim();return e.length>60?`${e.slice(0,60)}…`:e}function ni(t,e){return e.split(".").reduce((o,n)=>o&&typeof o=="object"?o[n]:void 0,t)}function is(t,e){return!Array.isArray(t)||!e||typeof e!="object"?t||[]:t.map(o=>{if(o.parent||o.value!=null||o.var.includes(":"))return o;const n=oi(ni(e,o.var));return n?{...o,value:n}:o})}function si(t,e){return Array.isArray(t)?t.map(o=>({...o,items:is(o.items,e)})):[]}function ri(t,e){const o=String(t?.var||"").trim();if(!o)return null;if(t.loop)return{text:`{{ ${o} }}
  
{{ /${o} }}`,cursor:`{{ ${o} }}
  `.length};if(e?.loop&&!t.parent){const n=e.loop;return{text:`{{ ${n} }}
  {{ ${o} }}
{{ /${n} }}`,cursor:`{{ ${n} }}
  {{ ${o} }}`.length}}return{text:`{{ ${o} }}`,cursor:`{{ ${o} }}`.length}}const se="visual_edit",Jo=[{id:"base",lang:"code_dock_visual_edit_base"},{id:"field",lang:"code_dock_visual_edit_field"}],ls=[{id:"tag",group:"base",label:"{{ visual_edit }}",standalone:"{{ visual_edit| }}"},{id:"ve_popup",group:"base",label:"popup",attr:'popup="true"'},{id:"ve_orderable",group:"base",label:"orderable",attr:'orderable="true"'},{id:"ve_section_orderable",group:"base",label:"section_orderable",attr:'section_orderable="true"'},{id:"ve_outline_inside",group:"base",label:"outline_inside",attr:'outline_inside="true"'},{id:"ve_field",group:"field",label:"field",attr:'field="|"'},{id:"ve_inline_edit",group:"field",label:"inline_edit",attr:'inline_edit="true"'},{id:"ve_insertable",group:"field",label:"insertable",attr:'insertable="true"'},{id:"ve_toolbar",group:"field",label:"toolbar",attr:'toolbar="true"'},{id:"ve_scope",group:"field",label:"scope",attr:'scope="|"'},{id:"ve_controls",group:"field",label:"controls",attr:'controls="|"'}];function ai(t){return ls.find(e=>e.id===t)||null}function ii(t,e,o,n){let s=e;for(;s<o;){const r=t.indexOf("{{",s);if(r===-1||r>=o)return null;const i=t.indexOf("}}",r+2);if(i===-1||i+2>o)return null;const l=t.slice(r+2,i);if((l.trim().split(/\s+/)[0]||"")===n)return{openIdx:r,closeIdx:i,inner:l};s=i+2}return null}function li(t,e){const o=String(e).split("=")[0].trim();return new RegExp(`(^|\\s)${o}(=|\\s|$)`).test(t)}const ci={class:"sve-code-dock"},di={"data-sve-code-bar":""},ui={type:"button","data-sve-code-pane-btn":"html"},fi={type:"button","data-sve-code-pane-btn":"css"},hi={type:"button","data-sve-code-pane-btn":"alpine"},pi={type:"button","data-sve-code-pane-btn":"js"},mi={type:"button","data-sve-html-scope":"","aria-pressed":"true"},gi=["innerHTML"],vi={"data-sve-code-panes":""},yi={"data-sve-code-pane":"html"},bi={"data-sve-code-pane-label":""},xi=["title","aria-label"],ki=["innerHTML"],Si={"data-sve-code-pane":"css"},_i={"data-sve-css-chrome":"subrow-2"},wi={"data-sve-code-pane-label":""},$i={"data-sve-css-label":""},Ci={"data-sve-code-pane":"alpine"},Ai={"data-sve-code-pane-label":""},Ti={"data-sve-code-pane":"js"},Mi={"data-sve-code-pane-label":""},Ei={__name:"CodeDockChrome",props:{htmlLabel:{type:String,required:!0},cssLabel:{type:String,required:!0},jsLabel:{type:String,required:!0},alpineLabel:{type:String,required:!0},treeIcon:{type:String,required:!0},dataIcon:{type:String,required:!0},dataLabel:{type:String,required:!0}},setup(t){return(e,o)=>(k(),S("div",ci,[o[18]||(o[18]=v("div",{"data-sve-code-grip":"","aria-hidden":"true"},null,-1)),v("div",di,[v("button",ui,M(t.htmlLabel),1),v("button",fi,M(t.cssLabel),1),v("button",hi,M(t.alpineLabel),1),v("button",pi,M(t.jsLabel),1),o[0]||(o[0]=Ir('<button type="button" data-sve-code-back hidden></button><span data-sve-code-path></span><span data-sve-code-status></span><button type="button" data-sve-code-strip></button><button type="button" data-sve-code-history></button><button type="button" data-sve-style-mode></button><button type="button" data-sve-values-mode></button><button type="button" data-sve-code-autosave aria-pressed="true"></button><button type="button" data-sve-code-save hidden></button>',9)),v("button",mi,[v("span",{innerHTML:t.treeIcon},null,8,gi)]),o[1]||(o[1]=v("button",{type:"button","data-sve-code-lock":"",hidden:""},null,-1))]),o[19]||(o[19]=v("div",{"data-sve-code-lock-banner":""},null,-1)),v("div",vi,[v("div",yi,[v("div",bi,[v("span",null,M(t.htmlLabel),1),o[2]||(o[2]=v("div",{"data-sve-html-tools":""},null,-1)),o[3]||(o[3]=v("button",{type:"button","data-sve-html-tidy":""},null,-1)),v("button",{type:"button","data-sve-data-vars":"",title:t.dataLabel,"aria-label":t.dataLabel},[v("span",{innerHTML:t.dataIcon},null,8,ki)],8,xi),o[4]||(o[4]=v("div",{"data-sve-visual-edit-tools":""},null,-1)),o[5]||(o[5]=v("div",{"data-sve-antlers-tools":""},null,-1))]),o[6]||(o[6]=v("div",{"data-sve-html-problems":"",hidden:""},null,-1)),o[7]||(o[7]=v("div",{"data-sve-code-host":""},null,-1))]),o[15]||(o[15]=v("div",{"data-sve-code-split":"","data-sve-code-split-after":"html"},null,-1)),v("div",Si,[v("div",_i,[v("div",wi,[v("span",$i,M(t.cssLabel),1),o[8]||(o[8]=v("button",{type:"button","data-sve-css-add-class":""},null,-1)),o[9]||(o[9]=v("div",{"data-sve-css-tools":""},null,-1))])]),o[10]||(o[10]=v("div",{"data-sve-css-head":""},null,-1)),o[11]||(o[11]=v("div",{"data-sve-code-host":""},null,-1)),o[12]||(o[12]=v("div",{"data-sve-tw-host":""},null,-1))]),o[16]||(o[16]=v("div",{"data-sve-code-split":"","data-sve-code-split-after":"css"},null,-1)),v("div",Ci,[v("div",Ai,[v("span",null,M(t.alpineLabel),1)]),o[13]||(o[13]=v("div",{"data-sve-alpine-host":""},null,-1))]),o[17]||(o[17]=v("div",{"data-sve-code-split":"","data-sve-code-split-after":"alpine"},null,-1)),v("div",Ti,[v("div",Mi,[v("span",null,M(t.jsLabel),1)]),o[14]||(o[14]=v("div",{"data-sve-code-host":""},null,-1))])])]))}},Qo="view:",tn="partials/";function cs(t){const e=String(t||"");if(!e.startsWith(Qo))return null;const o=e.slice(Qo.length);return o.startsWith(tn)?o.slice(tn.length):o}function Li(t){const e=String(t||"").match(/\sclass\s*=\s*(["'])([\s\S]*?)\1/i);return e?e[2].replace(/\{\{[\s\S]*?\}\}/g,"\0").split(/[\s[\]]+/).filter(o=>o&&!o.includes("\0")&&/^[A-Za-z_][\w:./%!#-]*$/.test(o)):[]}const Bi=t=>globalThis.CSS?.escape?globalThis.CSS.escape(t):t.replace(/([^\w-])/g,"\\$1");function ds(t){const e=xe(t)[0];if(!e)return null;const o=Li(String(t).slice(e.from,e.openTo));return!o.length&&!/^(header|footer|main|nav|aside|figure|form|table)$/.test(e.tag)?null:e.tag+o.map(n=>`.${Bi(n)}`).join("")}const Pt=new Map;let It=null,en=0,on=0,nn=!1;async function Fi(t,e){if(Pt.has(e))return Pt.get(e);const o=`view:partials/${e}`;let n=null;try{const s=await t.fetch(`/!/sve/section-template?type=${encodeURIComponent(o)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}});if(s.ok){const r=await s.json();n=typeof r.html=="string"?ds(r.html):null}}catch{}return Pt.set(e,n),n}function Ii(t){t?Pt.delete(t):Pt.clear()}function us(t){const e=cs(mt("dock:current-type")),o=e?mt("dock:html"):"",n=e&&typeof o=="string"?ds(o):null;Mn({source:Kn,type:Un.SVE_COMPONENT_FOCUS,on:!!n,name:e?String(e).split("/").pop():"",selector:n||""},t)}async function vo(t){const e=++on,o=mt("dock:html"),n=[...new Set((typeof o=="string"?zn(o):[]).map(r=>r.src).filter(r=>r&&!fa(r)))],s=await Promise.all(n.map(r=>Fi(t,r)));e===on&&Mn({source:Kn,type:Un.SVE_COMPONENT_MAP,items:n.map((r,i)=>({src:r,name:r.split("/").pop(),selector:s[i]})).filter(r=>r.selector)},t)}function Oi(t){It=t,!nn&&(nn=!0,be("dock:html-changed",()=>{It&&(Ii(cs(mt("dock:current-type"))),It.clearTimeout(en),en=It.setTimeout(()=>{vo(It)},400))}))}const Pi=["data-sve-html-tool","data-tip","aria-label","data-letter","onClick","onContextmenu"],Di=["innerHTML"],zi={__name:"CodeDockHtmlTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(t){return(e,o)=>(k(!0),S(N,null,ct(t.tools,n=>(k(),S("button",{key:n.id,type:"button","data-sve-html-tool":n.id,"data-tip":n.title,"aria-label":n.title,"data-letter":n.letter?"":void 0,onClick:B(s=>t.onTool(n.id),["prevent","stop"]),onContextmenu:B(s=>t.onTool(n.id),["prevent"])},[n.letter?(k(),S(N,{key:0},[En(M(n.letter),1)],64)):(k(),S("span",{key:1,innerHTML:n.icon},null,8,Di))],40,Pi))),128))}},it=ao({tools:[],onTool:null,onKid:null}),Hi=["data-sve-css-item"],Ri=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],ji={key:0,"data-sve-css-kids":""},Ni={key:0,"data-sve-css-sep":"","aria-hidden":"true"},Wi=["data-sve-css-kid","data-sve-css-box-side","data-tip","aria-label","innerHTML","onClick","onContextmenu"],qi={__name:"CodeDockCssTools",setup(t){return(e,o)=>(k(!0),S(N,null,ct($(it).tools,n=>(k(),S("li",Re({key:n.id,"data-sve-css-item":n.id},{ref_for:!0},n.open?{"data-sve-css-open":""}:{}),[v("button",Re({type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title},{ref_for:!0},{...n.active?{"data-active":""}:{},...n.open?{"data-open":""}:{}},{innerHTML:n.icon,onClick:B(s=>$(it).onTool?.(n.id),["prevent","stop"]),onContextmenu:B(s=>$(it).onTool?.(n.id),["prevent"])}),null,16,Ri),n.open&&n.kids.length?(k(),S("div",ji,[(k(!0),S(N,null,ct(n.kids,s=>(k(),S(N,{key:s.id},[s.sep?(k(),S("span",Ni)):X("",!0),v("button",Re({type:"button","data-sve-css-kid":s.id,"data-sve-css-box-side":s.id,"data-tip":s.title,"aria-label":s.title},{ref_for:!0},s.active?{"data-active":""}:{},{innerHTML:s.icon,onClick:B(r=>$(it).onKid?.(n.id,s.id),["prevent","stop"]),onContextmenu:B(r=>$(it).onKid?.(n.id,s.id),["prevent"])}),null,16,Wi)],64))),128))])):X("",!0)],16,Hi))),128))}},Vi=1.5,Ui=16;function le(t,e){const o=parseFloat(t);return Number.isFinite(o)?e==="em"||e==="rem"?o*Ui:o:null}function Ki(t){const e=String(t||"").toLowerCase();if(/\bmin-width\b|\bwidth\s*>=?/.test(e))return null;let o=e.match(/\bmax-width\s*:\s*([\d.]+)(px|em|rem)/);return o||(o=e.match(/\bwidth\s*<=?\s*([\d.]+)(px|em|rem)/),o)?le(o[1],o[2]):(o=e.match(/([\d.]+)(px|em|rem)\s*>=?\s*width\b/),o?le(o[1],o[2]):null)}function lt(t,e){const o=Ki(t);if(o===null)return"";for(const n of e||[]){if(n.base)continue;const s=le(String(n.max||"").replace(/[a-z]+$/i,""),(String(n.max||"").match(/[a-z]+$/i)||[""])[0]);if(s!==null&&Math.abs(s-o)<=Vi)return n.handle}return""}function _e(t){let e="",o=0;for(;o<t.length;){const n=we(t,o);if(n!==o){e+=" ".repeat(n-o),o=n;continue}e+=t[o],o+=1}return e}function we(t,e){if(t.startsWith("/*",e)){const o=t.indexOf("*/",e+2);return o===-1?t.length:o+2}if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?t.length:o+2}if(t[e]==='"'||t[e]==="'"){const o=t[e];for(let n=e+1;n<t.length;n+=1)if(t[n]==="\\")n+=1;else if(t[n]===o)return n+1;return t.length}return e}function $e(t){const e=String(t||""),o=[],n=(s,r,i=0)=>{let l=s,c=l;for(;l<r;){const d=we(e,l);if(d!==l){l=d;continue}if(e[l]===";"){l+=1,c=l;continue}if(e[l]==="}")return;if(e[l]!=="{"){l+=1;continue}const h=_e(e.slice(c,l)),f=h.trim(),m=fs(e,l,r);if(m===-1)return;/^@media\b/i.test(f)?o.push({query:f.replace(/^@media\s*/i,"").trim(),from:c+h.search(/\S/),to:m+1,bodyFrom:l+1,bodyTo:m,depth:i}):/^@(?:import|charset|use)\b/i.test(f)||n(l+1,m,i+1),l=m+1,c=l}};return n(0,e.length,0),o}function fs(t,e,o){let n=0;for(let s=e;s<o;s+=1){const r=we(t,s);if(r!==s){s=r-1;continue}if(t[s]==="{")n+=1;else if(t[s]==="}"&&(n-=1,n===0))return s}return-1}function Et(t){const e=String(t||""),o=(n,s)=>{const r=[];let i=n,l=i;for(;i<s;){const c=we(e,i);if(c!==i){i=c;continue}if(e[i]===";"){i+=1,l=i;continue}if(e[i]==="}")return r;if(e[i]!=="{"){i+=1;continue}const d=_e(e.slice(l,i)),h=d.trim(),f=fs(e,i,s);if(f===-1)return r;r.push({prelude:h,media:/^@media\b/i.test(h),query:h.replace(/^@media\s*/i,"").trim(),from:l+d.search(/\S/),to:f+1,bodyFrom:i+1,bodyTo:f,children:/^@(?:import|charset|use)\b/i.test(h)?[]:o(i+1,f)}),i=f+1,l=i}return r};return o(0,e.length)}function Gi(t,e,o){const n=String(t||"");if(!o)return[];const s=(e||[]).find(d=>d.base),r=Et(n),i=[],l=d=>d.media?lt(d.query,e)===o:d.children.some(l);if(s&&o===s.handle){const d=h=>{for(const f of h){if(f.media&&lt(f.query,e)){i.push({from:f.from,to:f.to});continue}d(f.children)}};return d(r),i}const c=(d,h,f)=>{const m=[];for(const b of d){if(b.media&&lt(b.query,e)===o){m.push({from:b.from,to:b.to,into:null});continue}l(b)&&m.push({from:b.from,to:b.to,into:b})}if(!m.length){f>h&&i.push({from:h,to:f});return}let y=h;for(const b of m)b.from>y&&i.push({from:y,to:b.from}),b.into&&c(b.into.children,b.into.bodyFrom,b.into.bodyTo),y=b.to;f>y&&i.push({from:y,to:f})};return c(r,0,n.length),i.filter(d=>n.slice(d.from,d.to).trim()!=="")}function Xi(t,e){const o=String(t||""),n=[],s=i=>{for(const l of i){if((l.media&&lt(l.query,e)||/^#id-/.test(l.prelude))&&_e(o.slice(l.bodyFrom,l.bodyTo)).trim()===""){n.push(l);continue}s(l.children)}};if(s(Et(o)),!n.length)return o;let r=o;for(const i of n.sort((l,c)=>c.from-l.from)){let l=i.from,c=i.to;const d=r.lastIndexOf(`
`,l-1)+1;for(r.slice(d,l).trim()===""&&(l=d);r[c]===" "||r[c]==="	";)c+=1;r[c]===`
`&&(c+=1),r=r.slice(0,l)+r.slice(c)}return r}function Zi(t,e){const o=String(t||""),n=[],s=i=>_e(o.slice(i.bodyFrom,i.bodyTo)).trim()==="",r=i=>{for(const l of i){if((l.media&&lt(l.query,e)||/^#id-/.test(l.prelude))&&s(l)){n.push({from:l.from,to:l.to});continue}r(l.children)}};return r(Et(o)),n}function fe(t,e,o){const n=e||[],s=n.find(d=>d.base),r=[],i=d=>/^#id-/.test(d.prelude)||/^#\s*$/.test(d.prelude),l=(d,h)=>{for(const f of d){if(!f.media){l(f.children,h);continue}const m=lt(f.query,n)||h;if(o===m){r.push(f);continue}l(f.children,m)}},c=(d,h)=>{for(const f of d){if(f.media){c(f.children,lt(f.query,n)||h);continue}if(i(f)){const m=h||(s?s.handle:"");!o||o===m?r.push(f):l(f.children,m);continue}c(f.children,h)}};return c(Et(String(t||"")),""),r.sort((d,h)=>d.from-h.from)}function yo(t,e,o){return $e(t).filter(n=>lt(n.query,e)===o)}const T=ao({tag:"",scope:"",onTag:null,sizes:[],onSize:null,state:"",stateLabel:"",onState:null,canEdit:!1,note:""}),Yi={class:"sve-css-head"},Ji=["disabled"],Qi={key:1,class:"sve-css-scope"},tl=["title","data-active","disabled","onClick"],el=["data-active","disabled"],ol={key:2,class:"sve-css-note"},nl={__name:"CodeDockCssHead",setup(t){return(e,o)=>(k(),S("div",Yi,[$(T).tag?(k(),S("button",{key:0,type:"button",class:"sve-css-tag",disabled:!$(T).canEdit,onClick:o[0]||(o[0]=B(()=>{},["prevent","stop"])),onDblclick:o[1]||(o[1]=B(n=>$(T).onTag?.(n),["prevent","stop"]))},"<"+M($(T).tag)+">",41,Ji)):X("",!0),$(T).scope?(k(),S("span",Qi,M($(T).scope),1)):X("",!0),(k(!0),S(N,null,ct($(T).sizes,n=>(k(),S("button",{key:n.key,type:"button","data-sve-css-size":"",title:n.title,"data-active":n.active?"":void 0,disabled:!$(T).canEdit,onClick:B(s=>$(T).onSize?.(n.key),["prevent","stop"])},M(n.label),9,tl))),128)),v("button",{type:"button","data-sve-css-state":"","data-active":$(T).state?"":void 0,disabled:!$(T).canEdit,onClick:o[2]||(o[2]=B(n=>$(T).onState?.(n),["prevent","stop"]))},[En(M($(T).stateLabel)+" ",1),o[3]||(o[3]=v("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[v("path",{d:"m6 9 6 6 6-6"})],-1))],8,el),o[4]||(o[4]=v("span",{class:"sve-css-gap"},null,-1)),$(T).note?(k(),S("span",ol,M($(T).note),1)):X("",!0)]))}},sl=Ln(nl,[["__scopeId","data-v-43bc76ce"]]),rl={key:0,"data-sve-css-swatches":""},al=["data-sve-css-token","title","data-active","onClick"],il={key:0,"data-sve-css-head-row":""},ll={key:1,"data-sve-css-note-row":""},cl=["data-sve-css-token","data-active","onClick"],dl={"data-sve-css-choice-label":""},ul={key:0,"data-sve-css-choice-hint":""},Y={__name:"CodeDockMenu",props:{kind:{type:String,required:!0},swatches:{type:Array,default:()=>[]},choices:{type:Array,default:()=>[]},onClear:{type:Function,default:null},onPick:{type:Function,required:!0}},setup(t){return(e,o)=>t.kind==="colors"?(k(),S("div",rl,[v("button",{type:"button","data-sve-css-clear":"",title:"Clear",onClick:o[0]||(o[0]=B((...n)=>t.onClear&&t.onClear(...n),["prevent","stop"]))},[...o[1]||(o[1]=[v("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none",stroke:"currentColor","stroke-width":"1.5"},[v("path",{d:"M2 2l6 6M8 2L2 8"})],-1)])]),(k(!0),S(N,null,ct(t.swatches,n=>(k(),S("button",{key:n.name,type:"button","data-sve-css-swatch":"","data-sve-css-token":n.name,title:n.name,"data-active":n.active?"":void 0,style:Or({background:n.hex||"transparent"}),onClick:B(s=>t.onPick(n.name),["prevent","stop"])},null,12,al))),128))])):(k(!0),S(N,{key:1},ct(t.choices,n=>(k(),S(N,{key:n.value},[n.heading?(k(),S("span",il,M(n.label),1)):n.note?(k(),S("span",ll,M(n.label),1)):(k(),S("button",{key:2,type:"button","data-sve-css-choice":"","data-sve-css-token":n.token||void 0,"data-active":n.active?"":void 0,onClick:B(s=>t.onPick(n.value),["prevent","stop"])},[v("span",dl,M(n.label),1),n.hint?(k(),S("span",ul,M(n.hint),1)):X("",!0)],8,cl))],64))),128))}},fl=/^\.[a-zA-Z_][\w-]*$/;function hl(t,e,o){return String(e||"").includes(o)?he(t).length===1:!1}function he(t){return Et(t).filter(e=>/^@scope\b/i.test(e.prelude))}function pl(t){const e=String(t||"");return Et(e).filter(o=>fl.test(o.prelude)?!e.slice(o.from,o.bodyFrom-1).includes("{{"):!1).map(o=>({from:o.from,to:o.to,name:o.prelude.slice(1)}))}function ml(t,e,o){const n=String(t||"");if(!hl(n,e,o))return n;const s=pl(n);if(!s.length)return n;const r=he(n)[0],i=yl(n,r),l=s.map(m=>bl(n.slice(m.from,m.to),n,m.from,i)).join(`

`);let c=n;for(const m of[...s].sort((y,b)=>b.from-y.from))c=vl(c,m.from,m.to);const d=gl(c,o);if(d===-1)return n;const h=(c.slice(0,d).match(/\n([^\S\n]*)$/)||[null,null])[1],f=h===null?d:d-h.length;return`${c.slice(0,f)}
${l}
${h??""}${c.slice(d)}`}function gl(t,e){const o=he(t).find(n=>n.prelude.includes(e));return o?o.bodyTo:he(t)[0]?.bodyTo??-1}function vl(t,e,o){let n=e,s=o;const r=t.lastIndexOf(`
`,n-1)+1;for(t.slice(r,n).trim()===""&&(n=r);t[s]===" "||t[s]==="	";)s+=1;return t[s]===`
`&&(s+=1),t.slice(0,n)+t.slice(s)}function yl(t,e){const o=t.slice(e.bodyFrom,e.bodyTo).match(/\n([^\S\n]+)\S/);return o?o[1]:`${(t.slice(0,e.from).match(/\n([^\S\n]*)$/)||[null,""])[1]}    `}function bl(t,e,o,n){const s=(e.slice(0,o).match(/\n([^\S\n]*)$/)||[null,""])[1];return t.split(`
`).map((r,i)=>i===0?n+r.trim():r.startsWith(s)?n+r.slice(s.length):n+r.trimStart()).join(`
`)}const xl={"data-sve-css-add-label":""},kl=["placeholder","onKeydown"],bo={__name:"CodeDockAddClass",props:{label:{type:String,required:!0},placeholder:{type:String,default:""},initial:{type:String,default:""},onAdd:{type:Function,required:!0}},setup(t){const e=t,o=Ho(e.initial||""),n=Ho(null);Pr(()=>Dr(()=>{n.value?.focus(),n.value?.select()}));function s(){const r=o.value.trim();if(!r){n.value?.focus();return}e.onAdd(r)}return(r,i)=>(k(),S(N,null,[v("label",xl,M(t.label),1),zr(v("input",{ref_key:"input",ref:n,"data-sve-css-add-input":"","onUpdate:modelValue":i[0]||(i[0]=l=>o.value=l),type:"text",placeholder:t.placeholder,onKeydown:[Ro(B(s,["prevent"]),["enter"]),i[1]||(i[1]=Ro(B(()=>{},["stop"]),["escape"]))]},null,40,kl),[[Hr,o.value]])],64))}};function sn(t,e){e._sveLockBound||(e._sveLockBound=!0,e.querySelector("[data-sve-code-lock]")?.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),!(!a.lockReady||!a.lastType)){if(a.lastLocked){_l(t);return}hs(t,!0)}}))}function xo(t){return t?G(t,Ar)!=="0":!0}function Sl(){const t=g.html;return!t||t.state.readOnly||!a.lastType?!1:!Co($o(),a.lastParts)}function st(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-code-autosave]"),n=e?.querySelector("[data-sve-code-save]");if(!o||!n)return;const s=xo(t),r=Sl();o.setAttribute("aria-pressed",s?"true":"false"),o.title=p(t,s?"code_dock_autosave_on":"code_dock_autosave_off"),o.setAttribute("aria-label",o.title),o.innerHTML=yu,n.hidden=s,n.title=p(t,"code_dock_save"),n.setAttribute("aria-label",n.title),n.innerHTML=bu,r?n.setAttribute("data-dirty",""):n.removeAttribute("data-dirty")}function rn(t,e){e._sveAutosaveBound||(e._sveAutosaveBound=!0,e.querySelector("[data-sve-code-autosave]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=!xo(t);j(t,Ar,n?"1":"0"),n?W(t.document):a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null),st(t)}),e.querySelector("[data-sve-code-save]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),W(t.document)}))}function _l(t){t.document.getElementById(V)?.remove();const e=Rr(t.document,jr,{title:p(t,"code_dock_unlock_title"),body:p(t,"code_dock_unlock_body"),buttons:[{value:"cancel",label:p(t,"cancel"),variant:"ghost"},{value:"ok",label:p(t,"code_dock_unlock_confirm"),variant:"primary"}],onPick:o=>{e.dismiss(),o==="ok"&&hs(t,!1)}});e.host.id=V}function hs(t,e){const o=a.lastType;if(!o)return;const n=()=>{a.lastType===o&&t.fetch("/!/sve/section-template/lock",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Bn(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:o,locked:e})}).then(async s=>{if(!s.ok)throw new Error(String(s.status));a.lastType===o&&(a.lastLocked=e,Ct(t),Zt(a.lastParts,e),q(t),O(t.document,e?p(t,"code_dock_locked"):""))}).catch(()=>{O(t.document,p(t,"code_dock_error"))})};if(e&&(W(t.document),a.saveInFlight)){a.saveInFlight.finally(n);return}n()}function ps(t,e){const o=String(e||"");if(/^(header|footer)\//.test(o))return!0;const n=t?.Statamic?.$config?.get?.("sveChromeTemplates")||{};return Object.values(n).some(s=>s&&s.type===o)}function pe(t){const e=a.lastType;if(!a.lastUid||!e||String(e).startsWith("view:")||ps(t,e)){jo(t);return}const o=Wr(a.lastUid,t.document);jo(t,o.length?{sectionUids:o}:void 0)}function wl(t,e,o){return a.saveInFlight=t.fetch("/!/sve/section-template",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Bn(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:e,html:o.html,css:o.css,js:o.js,...typeof o.tw=="string"?{tw:o.tw}:{},...ha(t)?{props:a.lastProps}:{}})}).then(async n=>{if(n.status===423){a.lastLocked=!0,a.lockReady=!0,Ct(t),Zt(a.lastParts,!0),q(t),O(t.document,p(t,"code_dock_locked"));return}const s=await n.json().catch(()=>({}));if(!n.ok)throw new Error(s?.error==="not_writable"?"not_writable":String(n.status));if(a.lastType===e){if(a.lastParts=o,s?.tw_written===!1){a.twDirty=!0,O(t.document,p(t,"code_dock_tw_not_writable")),st(t),pe(t);return}O(t.document,p(t,"code_dock_saved")),st(t),t.setTimeout(()=>{const r=t.document.getElementById(u)?.querySelector("[data-sve-code-status]");r&&r.textContent===p(t,"code_dock_saved")&&(r.textContent="")},1800)}pe(t),t.document.getElementById("__sve-section-picker")?.dispatchEvent(new t.CustomEvent("sve-library-stale"))}).catch(n=>{O(t.document,p(t,n?.message==="not_writable"?"code_dock_not_writable":"code_dock_error"))}).finally(()=>{a.saveInFlight=null}),a.saveInFlight}function W(t){a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null);const e=a.lastType,o=a.lastWin,n=g.html;if(!n||n.state.readOnly||!e||!o||!a.lockReady)return;const s=$o(),r=a.twCss!==null&&Hn(o)&&ko(s.html)===a.twKey;Co(s,a.lastParts)&&!(r&&a.twDirty)&&!a.propsDirty||(a.propsDirty=!1,r&&(s.tw=a.twCss,a.twDirty=!1),O(t,p(o,"code_dock_saving")),wl(o,e,s))}function ko(t){return La(t).sort().join(" ")}function $l(){a.twCss=null,a.twKey="",a.twDirty=!1}function Cl(t,e){a.twCss=e,a.twKey=ko(t),a.twDirty=!1}function ms(t,e){if(!t||!Hn(t))return;const o=ko(e);o===a.twKey||a.twBusy||(a.twBusy=!0,Nr(()=>import("./tw-compile-CroZAfJZ.js"),__vite__mapDeps([0,1]),import.meta.url).then(n=>n.compileTailwind(t,e)).then(n=>{a.twBusy=!1,a.twCss=n,a.twKey=o,a.twDirty=!0,gs(t,t.document)}).catch(n=>{a.twBusy=!1,console.error("[sve] tailwind compile",n)}))}function gs(t,e){a.saveTimer&&clearTimeout(a.saveTimer),a.saveTimer=t.setTimeout(()=>{a.saveTimer=null,W(e)},hu)}function J(t){if(a.applying)return;const e=$o();if(Co(e,a.lastParts)){st(t);return}if(st(t),ms(t,e.html),!xo(t)){O(t.document,p(t,"code_dock_unsaved"));return}O(t.document,p(t,"code_dock_saving")),gs(t,t.document)}function vs(t,e){let o=0;const n=Math.min(t.length,e.length);for(;o<n&&t[o]===e[o];)o+=1;let s=t.length,r=e.length;for(;s>o&&r>o&&t[s-1]===e[r-1];)s-=1,r-=1;return[o,s,e.slice(o,r)]}function ys(t){const e=a.lastUid,o=typeof z=="function"?z(t.document):[];for(const n of o){const s=nt(n.values)||n.values;if(!(!s||typeof s!="object")&&e&&typeof No=="function"){const r=No(s,e);if(r){const i=r.split("."),l=qr(s,i.slice(0,2).join("."));if(l&&typeof l=="object")return l}}}for(const n of o){const s=nt(n.values)||n.values;if(s&&typeof s=="object")return s}return null}function bs(t,e){!e||e===a.lastType||(W(t.document),Wt(t,e,"push"))}function xs(t){const e=a.typeStack.pop();if(!e){Vt(t);return}W(t.document),Wt(t,e,"keep")}function Ct(t){const e=t.document.getElementById(u),o=e?.querySelector("[data-sve-code-lock]"),n=e?.querySelector("[data-sve-code-lock-banner]");if(!e||!o)return;const s=a.lastLocked;e.toggleAttribute("data-sve-code-locked",s),s&&(Rn(t.document),tt(t.document),a.htmlPartialUi&&(a.htmlPartialUi.setHover(g.html,null),a.htmlPartialUi.setHover(g.css,null)),a.htmlClassTokenUi?.setHover(g.html,null)),o.hidden=!a.lockReady,o.setAttribute("aria-pressed",a.lastLocked?"true":"false"),o.title=p(t,a.lastLocked?"code_dock_unlock":"code_dock_lock"),o.setAttribute("aria-label",o.title),o.innerHTML=a.lastLocked?pu:mu,n&&(n.textContent=p(t,"code_dock_locked_banner"))}function Kt(t){return t?G(t,De)!=="0":a.htmlScopePref}function Ce(t,e,o){return t!=null&&e!=null&&t>=0&&e>t&&e<=o}function et(){const t=globalThis.document?.getElementById(u);t&&(t.__sveHtmlScope=a.htmlScopeActive&&a.htmlFocus?{full:a.htmlFull,from:a.htmlFocus.from,to:a.htmlFocus.to,css:a.cssFull}:null)}function Ae(){const t=g.html?.state.doc.toString()??"";if(!a.htmlScopeActive||!a.htmlFocus){a.htmlFull=t,et();return}if(a.htmlFocus.from<0||a.htmlFocus.from>a.htmlFull.length||a.htmlFocus.to<a.htmlFocus.from){a.htmlScopeActive=!1,a.htmlFull=t,a.htmlFocus=null,et();return}a.htmlFull=a.htmlFull.slice(0,a.htmlFocus.from)+t+a.htmlFull.slice(a.htmlFocus.to),a.htmlFocus={from:a.htmlFocus.from,to:a.htmlFocus.from+t.length},et()}function Lt(){return Ae(),a.htmlScopeActive?a.htmlFull:g.html?.state.doc.toString()??a.lastParts.html??""}function Te(){a.lastBracketNames=ke(Lt()).map(t=>t.name)}function Bt(){a.lastCssSelectorNames=Yn(g.css?.state.doc.toString()??a.cssFull)}function ks(t,e){return Array.isArray(t)&&Array.isArray(e)&&t.length===e.length&&t.every((o,n)=>o===e[n])}function Al(){const t=a.htmlScopeActive?So():Lt(),e=Se(t);e.length&&(a.cssFull=mo(a.cssFull,po(a.cssFull,e),e[0].className))}function Ss(t,e){a.cssFull=Ka(a.cssFull,t,e),Al(),a.cssFull=Ga(a.cssFull,e,t)}function Tl(t){if(a.applying||a.lastLocked||a.lastBracketNames==null)return;const e=ke(Lt()).map(o=>o.name);ks(a.lastBracketNames,e)||(Ss(a.lastBracketNames,e),a.lastBracketNames=e,Gt(),Bt())}function Ml(){if(a.applying||a.lastLocked||a.lastCssSelectorNames==null||a.lastBracketNames==null||a.cssPane==="empty")return;const t=g.html,e=Yn(g.css?.state.doc.toString()??"");if(!t||ks(a.lastCssSelectorNames,e))return;const o=new Set(a.lastBracketNames),{renamed:n,removed:s}=Jn(a.lastCssSelectorNames,e);let r=t.state.doc.toString();const i=r;for(const l of n){const c=vt(l.to);!o.has(l.from)||!c||(r=Xo(r,d=>d===l.from?c:d))}for(const l of s)!o.has(l)||e.includes(l)||(r=Xo(r,c=>c===l?"":c));if(r!==i){a.applying=!0;try{Ee(r)}finally{a.applying=!1}}Te(),a.lastCssSelectorNames=e}function El(t,e){const o=vt(e),n=g.html;if(!o||!n||n.state.readOnly||o===t.name)return;a.applying=!0;try{n.dispatch({changes:{from:t.from,to:t.to,insert:o}})}finally{a.applying=!1}const s=a.lastBracketNames==null?[]:a.lastBracketNames.slice();Te(),Ss(s,a.lastBracketNames),Gt(),Bt(),a.lastWin&&(J(a.lastWin),L(a.lastWin))}function Ll(t,e){const o=t.document,s=g.html?.coordsAtPos(e.from);x(o),tt(o);const r=o.createElement("div"),i={getBoundingClientRect:()=>({left:s?.left??12,right:s?.right??12,top:s?.top??12,bottom:s?.bottom??12,width:0,height:0})};r.id=_,o.body.appendChild(r),H(t,i,r),r._sveApp=P(bo,r,{label:p(t,"code_dock_css_rename_class"),placeholder:p(t,"code_dock_css_class_placeholder"),initial:e.name,onAdd:l=>{El(e,l),x(o)}})}function _s(){return a.htmlScopePref&&Ce(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)?(a.htmlScopeActive=!0,et(),a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to)):(a.htmlScopeActive=!1,et(),a.htmlFull)}function Me(t,e,o){const n=g[t];if(!n)return;const s=n.state.doc.toString();a.applying=!0;try{if(s!==e){const[r,i,l]=vs(s,e);n.dispatch({changes:{from:r,to:i,insert:l},...o?{selection:o,scrollIntoView:!0}:{}})}else o&&n.dispatch({selection:o,scrollIntoView:!0})}finally{a.applying=!1}}function Ee(t,e){Me("html",t,e)}function So(){return a.htmlScopeActive?g.html?.state.doc.toString()??"":Ce(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)?a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to):""}function at(){const t=g.css?.state.doc.toString()??"";if(a.cssPane==="tree"){if(t===a.cssScopeSnapshot)return;const e=Se(So())[0]?.className||es(t);a.cssFull=mo(a.cssFull,t,e),a.cssScopeSnapshot=t}else a.cssPane==="full"&&(a.cssFull=t)}function ws(t,e){for(const o of e||[])if(!U(t,o.className)||ws(t,o.children))return!0;return!1}function Gt(){let t=a.cssFull,e=[],o=!1;a.cssValues||!a.htmlScopePref||!a.htmlScopeActive?(a.cssPane="full",t=a.cssFull):(e=Se(So()),e.length?(a.cssPane="tree",t=po(a.cssFull,e),ws(a.cssFull,e)&&(a.cssFull=mo(a.cssFull,t,e[0].className),o=!0)):(a.cssPane="empty",t="")),a.cssScopeSnapshot=t,Me("css",t),Bt(),a.lastWin&&(Jt(a.lastWin,!0),L(a.lastWin),o&&J(a.lastWin))}function _o(t){const e=g.html;if(!e||!a.htmlFocus)return;a.htmlScopeActive||(a.htmlFull=e.state.doc.toString());const o=a.htmlFull.length,n=Math.max(0,Math.min(a.htmlFocus.from,o)),s=Math.max(n,Math.min(a.htmlFocus.to,o));if(s<=n)return;a.htmlFocus={from:n,to:s},a.htmlScopeActive=!0,et();const r=t==null?0:Math.max(0,Math.min(t-n,s-n));Ee(a.htmlFull.slice(n,s),{anchor:r,head:r}),Gt(),e.focus()}function wo(t=!0,e=null){const o=g.html;if(!o)return;at(),Ae(),a.htmlScopeActive=!1,et();const n=a.htmlFull||o.state.doc.toString(),s=e!=null?{anchor:Math.max(0,Math.min(e,n.length))}:t&&Ce(a.htmlFocus?.from,a.htmlFocus?.to,n.length)?{anchor:a.htmlFocus.from,head:a.htmlFocus.to}:null;a.htmlFull=n,Ee(n,s),a.cssPane="full",a.cssScopeSnapshot=a.cssFull,Me("css",a.cssFull),Bt()}function Le(){a.htmlFocus=null,a.htmlScopeActive=!1,a.htmlFull="",a.cssFull="",a.cssPane="full",a.cssScopeSnapshot="",a.lastBracketNames=null,a.lastCssSelectorNames=null,et()}let Rt=!1;function $t(t){return!!t?.document.getElementById(In)}function Ge(t,e){if(!(!t||io(t,"html_tree")===!1)){if(!e){$t(t)&&Fn(t);return}$t(t)||(Rt=!0,Vr("html_tree").then(()=>{$t(t)||Ur(t)}).catch(()=>{}).finally(()=>{Rt=!1,q(t)}))}}function q(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-html-scope]");if(!e)return;a.htmlScopePref=Kt(t);const o=io(t,"html_tree")===!1?a.htmlScopePref:$t(t)||Rt;e.setAttribute("aria-pressed",o?"true":"false"),e.title=p(t,o?"code_dock_html_scope_off":"code_dock_html_scope"),e.setAttribute("aria-label",e.title),e.innerHTML=Er,t.document.getElementById(u)?.toggleAttribute("data-sve-html-scoped",a.htmlScopeActive),et()}function an(t,e){e._sveHtmlScopeBound||(e._sveHtmlScopeBound=!0,a.htmlScopePref=Kt(t),Bl(t,e),Ge(t,a.htmlScopePref),e.querySelector("[data-sve-html-scope]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=$t(t)||Rt;a.htmlScopePref=!n,j(t,De,a.htmlScopePref?"1":"0"),a.htmlScopePref?a.htmlFocus&&(at(),_o()):a.htmlScopeActive&&wo(),Ge(t,a.htmlScopePref),q(t)}))}function Bl(t,e){e._sveTreeWatchBound||(e._sveTreeWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>{if(Rt||io(t,"html_tree")===!1||!t.document.getElementById(u))return;const o=$t(t);o!==Kt(t)&&(a.htmlScopePref=o,j(t,De,o?"1":"0"),o?a.htmlFocus&&(at(),_o()):a.htmlScopeActive&&wo(),q(t))}))}const Fl=new Set(["pre","textarea","script","style"]),Il=/^(<\/|\{\{\s*\/)/;function Ol(t){let e=0;for(const o of t.split(`
`)){if(!o.trim())continue;const n=o.length-o.trimStart().length;n>0&&(e===0||n<e)&&(e=n)}return" ".repeat(e===2||e===3?e:4)}function Pl(t){const e=String(t||"");if(!e.trim())return e;const o=[],n=l=>{for(const c of l||[])o.push(c),n(c.children)};n(pa(e));const s=Ol(e),r=[];let i=0;for(const l of e.split(`
`)){const c=i,d=l.trim();if(i+=l.length+1,!d){r.push("");continue}const h=c+(l.length-l.trimStart().length),f=o.filter(y=>y.from<h&&h<y.to);if(f.some(y=>Fl.has(y.tag))){r.push(l);continue}const m=f.length-(Il.test(d)?1:0);r.push(s.repeat(Math.max(m,0))+d)}return r.join(`
`)}function $s(t,e){if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?t.length:o+2}if(t.startsWith("<!--",e)){const o=t.indexOf("-->",e+4);return o===-1?t.length:o+3}return e}function Xe(t,e){if(t[e]!=="<")return null;const o=t.indexOf(">",e+1);if(o===-1)return null;const n=t.slice(e,o+1),s=n.match(/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/);if(s)return{kind:"close",name:s[1].toLowerCase(),from:e,to:o+1};const r=n.match(/^<([A-Za-z][A-Za-z0-9:-]*)/);if(!r)return{kind:"other",from:e,to:o+1};const i=r[1].toLowerCase();return{kind:/\/\s*>$/.test(n)||["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"].includes(i)?"void":"open",name:i,from:e,to:o+1}}function ln(t,e,o){let n=1,s=o;for(;s<t.length;){const r=$s(t,s);if(r!==s){s=r;continue}if(t[s]!=="<"){s+=1;continue}const i=Xe(t,s);if(!i)break;if(i.kind==="open"&&i.name===e)n+=1;else if(i.kind==="close"&&i.name===e&&(n-=1,n===0))return i;s=i.to}return null}function Xt(){const t=g.html;if(!t)return null;const e=t.state.selection.main.head,o=t.state.doc.toString(),n=[];let s=0;for(;s<e;){const c=$s(o,s);if(c!==s){s=c;continue}if(o[s]!=="<"){s+=1;continue}const d=Xe(o,s);if(!d||d.from>=e)break;if(d.kind==="open")n.push(d);else if(d.kind==="close"){for(let h=n.length-1;h>=0;h-=1)if(n[h].name===d.name){n.splice(h);break}}s=d.to}const r=o.lastIndexOf("<",Math.max(0,e-1));if(r!==-1&&o.indexOf(">",r)>=e){const c=Xe(o,r);if(c?.kind==="open"||c?.kind==="void"){const d=c.kind==="void"?null:ln(o,c.name,c.to);return d?{name:c.name,open:c,close:d}:{name:c.name,open:c,close:null}}}const i=n[n.length-1];if(!i)return null;const l=ln(o,i.name,i.to);return{name:i.name,open:i,close:l}}function Ze(t){return Lr.includes(t)}function I(){g.html?.focus(),a.lastWin&&(J(a.lastWin),Be(a.lastWin))}function ht(t,e,o){const n=[...e].sort((s,r)=>r.from-s.from||r.to-s.to);t.dispatch({changes:n,selection:o})}function At(t,e,o){const n=g.html;if(!n||n.state.readOnly)return;const s=n.state.selection.main.head,r=n.state.doc.lineAt(s),i=r.text.slice(0,s-r.from),l=r.text.trim()?rt(r.text):Ie(n,r)||rt(r.text);let c=t,d=0;if(i.trim()!=="")c=`
${l}${t}`,d=1+l.length;else if(!r.text.trim()){c=`${l}${t}`,d=l.length,n.dispatch({changes:{from:r.from,to:r.to,insert:c},selection:cn(r.from+d+e,o)});return}n.dispatch({changes:{from:s,to:n.state.selection.main.to,insert:c},selection:cn(s+d+e,o)})}function cn(t,e){return e?{anchor:t,head:t+e}:{anchor:t}}const Dl=new Set(["section","article","header","footer","main","nav","aside"]);function dn(t){if(t==="a")return'<a href="">';if(t!=="section")return`<${t}>`;const e=a.lastWin?.Statamic?.$config?.get?.("sveSectionTag");return typeof e=="string"&&e.trim()?`<${t} ${e.trim()}>`:`<${t}>`}function Cs(){const t=g.html;if(!t||t.state.readOnly)return;const e=t.state.doc.toString(),o=(e.match(/^[ \t]*/)||[""])[0],n=Pl(e).split(`
`).map(s=>s&&o+s).join(`
`);n!==e&&(ht(t,[{from:0,to:e.length,insert:n}],{anchor:0}),I())}function As(t){const e=g.html;if(!e||e.state.readOnly)return;const o=e.state.selection.main,n=e.state.doc.toString();if(!o.empty){const l=n.slice(o.from,o.to),c=l.match(new RegExp(`^<${t}(\\s[^>]*)?>([\\s\\S]*)</${t}>$`,"i"));if(c){ht(e,[{from:o.from,to:o.to,insert:c[2]}],{anchor:o.from,head:o.from+c[2].length}),I();return}const d=dn(t);let h=`${d}${l}</${t}>`,f=o.from+d.length;t==="ul"&&(h=`<ul>
  <li>${l}</li>
</ul>`,f=o.from+11),ht(e,[{from:o.from,to:o.to,insert:h}],{anchor:f,head:f+l.length}),I();return}const s=Xt();if(s?.open&&s.close){if(s.name===t){ht(e,[{from:s.close.from,to:s.close.to,insert:""},{from:s.open.from,to:s.open.to,insert:""}],{anchor:s.open.from}),I();return}if(Ze(s.name)&&Ze(t)){const l=n.slice(s.open.from,s.open.to).replace(new RegExp(`^<${s.name}`,"i"),`<${t}`);ht(e,[{from:s.close.from,to:s.close.to,insert:`</${t}>`},{from:s.open.from,to:s.open.to,insert:l}],{anchor:s.open.from+t.length+1}),I();return}}const i=(e.state.doc.lineAt(o.head).text.match(/^\s*/)||[""])[0];if(t==="ul"){const l=`<ul>
${i}  <li></li>
${i}</ul>`;At(l,`<ul>
${i}  <li>`.length)}else{const l=dn(t),c=`${l}</${t}>`,d=t==="a"?l.indexOf('""')+1:Dl.has(t)?l.length:c.length;At(c,d)}I()}function Be(t){try{zl(t)}catch{}}function zl(t){const e=t?.document?.getElementById(u),n=Xt()?.name||"";if(e)for(const s of ro){const r=e.querySelector(`[data-sve-html-tool="${s.id}"]`);if(!r)continue;(s.id==="heading"?Ze(n):n===s.tag)?r.setAttribute("data-active",""):r.removeAttribute("data-active")}}function un(t,e,o){const n=t.document,s=Xt()?.name||"";x(n),e.setAttribute("data-open","");const r=n.createElement("div");r.id=_,n.body.appendChild(r),H(t,e,r),r._sveApp=P(Y,r,{kind:"choices",choices:o.map(i=>({value:i,label:i.toUpperCase(),active:s===i})),onPick:i=>{As(i),x(n)}})}function Hl(t,e){const o=t.document;x(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=_,o.body.appendChild(n),H(t,e,n);const s=r=>{o.getElementById(_)&&(n._sveApp?.unmount(),n._sveApp=P(Y,n,{kind:"choices",choices:r,onPick:i=>{i&&(At(i,i.length),I()),x(o)}}),H(t,e,n))};s([{value:"",label:p(t,"code_dock_loading")}]),t.fetch("/!/sve/components",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(r=>r.ok?r.json():{items:[]}).then(r=>{const i=Array.isArray(r.items)?r.items:[];s(i.length?i.map(l=>({value:l.tag,label:l.name})):[{value:"",label:p(t,"component_none")}])}).catch(()=>s([{value:"",label:p(t,"component_none")}]))}function Rl(t){const e=vt(t),o=g.html,n=g.css;if(!e||o?.state.readOnly||n?.state.readOnly)return;const s=Xt();if(s?.open&&o){const r=o.state.doc.sliceString(s.open.from,s.open.to),i=za(r,e);i!==r&&o.dispatch({changes:{from:s.open.from,to:s.open.to,insert:i}})}at(),U(a.cssFull,e)||(a.cssFull=`${String(a.cssFull||"").trimEnd()}${a.cssFull?.trim()?`
`:""}.${e} {
}
`),Gt(),Te(),Bt(),a.lastWin&&(J(a.lastWin),Be(a.lastWin),L(a.lastWin))}function jl(t,e){const o=t.document;if(e.hasAttribute("data-open")){x(o);return}x(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=_,o.body.appendChild(n),H(t,e,n),n._sveApp=P(bo,n,{label:p(t,"code_dock_css_class_name"),placeholder:p(t,"code_dock_css_class_placeholder"),onAdd:s=>{Rl(s),x(o)}})}function Nl(t,e){const o=e.querySelector("[data-sve-css-add-class]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=xu,o.title=p(t,"code_dock_css_add_class"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),a.styleMode==="tw"){x(t.document),ma(t,o);return}jl(t,o)}))}function $o(){const t={html:"",css:"",js:""};Ae(),at();for(const e of ot)e==="html"?t.html=a.htmlScopeActive?a.htmlFull:g.html?.state.doc.toString()??"":e==="css"?(t.css=a.lastWin?Xi(a.cssFull,ut(a.lastWin)):a.cssFull,t.css=ml(t.css,t.html,du)):t[e]=g[e]?.state.doc.toString()??"";return t}function Ts(){if(a.cssValues||!(a.htmlScopePref&&Ce(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)))return a.cssPane="full",a.cssScopeSnapshot=a.cssFull,a.cssFull;const t=Se(a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to));if(!t.length)return a.cssPane="empty",a.cssScopeSnapshot="","";a.cssPane="tree";const e=po(a.cssFull,t);return a.cssScopeSnapshot=e,e}function Zt(t,e){a.applying=!0;try{a.lastWin&&(a.htmlScopePref=Kt(a.lastWin)),a.htmlFull=t.html??"",a.cssFull=t.css??"";for(const o of ot){const n=g[o];let s=t[o]??"";try{s=o==="html"?_s():o==="css"?Ts():s}catch{s=o==="html"?a.htmlFull||t.html||"":o==="css"?a.cssFull||t.css||"":s}if(!n)continue;const r=n.state.doc.toString(),i=[zt[o].reconfigure(ve.readOnly.of(!!e)),Ht[o].reconfigure(D.editable.of(!e))];r!==s?n.dispatch({changes:{from:0,to:r.length,insert:s},effects:i}):n.dispatch({effects:i})}}finally{a.applying=!1}Te(),Bt(),lo("dock:html-changed"),a.lastWin&&(L(a.lastWin),Be(a.lastWin),q(a.lastWin),te(a.lastWin))}function Co(t,e){return t.html===e.html&&t.css===e.css&&t.js===e.js}function Ms(t){return String(t||"").replace(/\/\*[\s\S]*?\*\//g,"").trim().replace(/\s*:\s*/g,": ").replace(/\s*;\s*/g,";").replace(/\s+/g," ").replace(/;+$/,";")}function Es(t){const e=Ms(t).match(/^([a-z-]+)\s*:/i);return e?e[1].toLowerCase():""}function Ls(t){const e=Ms(t),o=e.indexOf(":");return o===-1?"":e.slice(o+1).replace(/;$/,"").trim().toLowerCase()}function F(t){const e=String(t||"").trim().toLowerCase();return e==="start"||e==="flex-start"||e==="left"||e==="top"?"flex-start":e==="end"||e==="flex-end"||e==="right"||e==="bottom"?"flex-end":e==="row-reverse"?"row-reverse":e==="column-reverse"?"column-reverse":e}function jt(t){const e=F(t);return e==="flex"||e==="inline-flex"}function Fe(){const t=g.css;if(!t)return null;const e=t.state.selection.main.head,o=t.state.doc.toString(),n=[],s=[];for(let i=0;i<o.length;i+=1){if(o[i]==="{"&&o[i+1]==="{"){const l=o.indexOf("}}",i+2);if(l===-1)break;i=l+1;continue}if(o[i]==="{")n.push(i);else if(o[i]==="}"){const l=n.pop();l!=null&&s.push({from:l+1,to:i,text:o.slice(l+1,i),open:l})}}let r=null;for(const i of s)e<i.open||e>i.to||(!r||i.to-i.open<r.to-r.open)&&(r=i);return r}function Wl(t){const e=String(t||"");let o="",n=0;for(let s=0;s<e.length;s+=1){if(e[s]==="{"&&e[s+1]==="{"){const r=e.indexOf("}}",s+2);if(r===-1)break;n===0&&(o+=e.slice(s,r+2)),s=r+1;continue}if(e[s]==="{"){n+=1;continue}if(e[s]==="}"){n=Math.max(0,n-1);continue}n===0&&(o+=e[s])}return o}function fn(t){const e={};for(const o of Wl(t).split(";")){const n=Es(o);n&&(e[n]=Ls(`${o};`))}return e}function ql(t,e,o){if(!e||e.from>=e.to)return null;let n=t.state.doc.lineAt(e.from),s=0;for(;n.from<=e.to;){const r=Math.max(n.from,e.from),i=Math.min(n.to,e.to),l=t.state.doc.sliceString(r,i);if(s===0&&Es(l)===o)return{from:r,to:i,text:l};if(s+=Vl(l),n.to>=t.state.doc.length||n.to>=e.to)break;n=t.state.doc.lineAt(n.to+1)}return null}function Vl(t){let e=0;const o=String(t);for(let n=0;n<o.length;n+=1){if(o[n]==="{"&&o[n+1]==="{"){const s=o.indexOf("}}",n+2);n=s===-1?o.length:s+1;continue}o[n]==="{"?e+=1:o[n]==="}"&&(e-=1)}return e}function rt(t){return(String(t).match(/^\s*/)||[""])[0]}function Ie(t,e,o){for(let n=e.number-1;n>=1;n-=1){const s=t.state.doc.line(n),r=s.text.trim();if(!r)continue;const i=rt(s.text);if(o&&(r==="{"||r.endsWith("{")))return`${i}  `;if(!(r==="}"||r.startsWith("}")))return i}return""}function Ul(t,e){const o=t.state.doc.lineAt(e);if(o.text.trim())return rt(o.text);const n=Ie(t,o,!0);if(n)return n;const s=Fe();return s?Bs(t,s):"  "}function Bs(t,e){const o=t.state.doc.lineAt(e.from),n=t.state.doc.lineAt(Math.max(e.from,e.to));for(let r=n.number;r>=o.number;r-=1){const i=t.state.doc.line(r),l=Math.max(i.from,e.from),c=Math.min(i.to,e.to),d=t.state.doc.sliceString(l,c);if(d.trim())return(d.match(/^\s*/)||[""])[0]||"  "}return`${(t.state.doc.lineAt(Math.max(0,e.from-1)).text.match(/^\s*/)||[""])[0]}  `}function hn(){g.css?.focus(),a.lastWin&&(J(a.lastWin),L(a.lastWin))}function Fs(t,e){if(!e)return"";const o=t.state.doc.toString();let n=0;for(let s=e.open-1;s>=0;s-=1)if(o[s]==="}"||o[s]==="{"||o[s]===";"){n=s+1;break}return o.slice(n,e.open).replace(/\/\*[\s\S]*?\*\//g,"").trim()}function Kl(t,e){if(!a.cssState||!e)return e;const o=Is(t,e);if(o)return o;const n=Fs(t,e);if(!n||n.startsWith("@"))return e;const s=t.state.doc.toString(),r=pt(s,e.open),i=pt(s,e.to)||`${r}    `,l=(t.state.doc.sliceString(e.from,e.to).match(/\n([^\S\n]*)$/)||[null,null])[1],c=l===null?e.to:e.to-l.length,d=`
${i}&${Pe()} {
${i}}
${l??r}`;t.dispatch({changes:{from:c,to:e.to,insert:d}});const h=t.state.doc.toString(),f=h.indexOf("{",c+d.indexOf("&")),m=f===-1?-1:Mt(h,f);return m===-1?e:{from:f+1,to:m,text:h.slice(f+1,m),open:f}}function pt(t,e){const o=t.lastIndexOf(`
`,e-1)+1;return(t.slice(o,e).match(/^\s*/)||[""])[0]}function K(t){const e=g.css;if(!e||e.state.readOnly||!t.length)return;const o=Fe(),n=t.some(l=>l.value!=null)?Kl(e,o):o;if(!n){const l=t.filter(c=>c.value!=null).map(c=>`${c.property}: ${c.value};`).join(`
`);l&&Zl(l),hn();return}const s=[],r=[],i=Bs(e,n);for(const l of t){const c=ql(e,n,l.property);if(l.value==null){if(!c)continue;let d=c.from,h=c.to;e.state.doc.sliceString(h,h+1)===`
`&&(h+=1),d=Math.max(d,n.from),h=Math.min(h,n.to),s.push({from:d,to:h});continue}if(!(c&&F(Ls(c.text))===F(l.value)))if(c){const d=(c.text.match(/^\s*/)||[""])[0];s.push({from:c.from,to:c.to,insert:`${d}${l.property}: ${l.value};`})}else r.push(`${i}${l.property}: ${l.value};`)}if(r.length){const l=!n.text.includes(`
`)||!/\n\s*$/.test(n.text)?`
`:"",c=(n.text.match(/\n([^\S\n]*)$/)||[null,null])[1],d=c===null?n.to:n.to-c.length,h=c===null?"":c;s.push({from:d,to:n.to,insert:`${l}${r.join(`
`)}
${h}`})}s.length&&(s.sort((l,c)=>c.from-l.from||c.to-l.to),e.dispatch({changes:s})),hn()}function Z(){const t=g.css,e=Fe();if(!e)return{};if(a.cssState&&t){const o=Is(t,e);return o?fn(o.text):{}}return fn(e.text)}function Is(t,e){const o=Fs(t,e),n=Pe();if(!o||o.startsWith("@"))return null;if(o.endsWith(n))return e;const s=t.state.doc.toString(),r=i=>{const l=Mt(s,i);return l===-1?null:{from:i+1,to:l,text:s.slice(i+1,l),open:i}};for(const i of[`&${n}`,`${o}${n}`]){const l=new RegExp(`(^|[^\\w-])${i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\s*\\{`,"g");let c;for(;c=l.exec(s);){const d=s.indexOf("{",c.index);if(i.startsWith("&")&&(d<e.from||d>e.to))continue;const h=r(d);if(h)return h}}return null}function Gl(t){const e=Z(),o=jt(e.display),n=F(e["flex-direction"])||(o?"row":"");if(o&&n===t){const s=[];e["flex-direction"]&&s.push({property:"flex-direction",value:null}),jt(e.display)&&s.push({property:"display",value:null}),K(s);return}K([{property:"display",value:"flex"},{property:"flex-direction",value:t}])}function Xl(t){const e=Z();if(t==="flex"&&jt(e.display)){K([{property:"justify-content",value:null},{property:"align-items",value:null},{property:"flex-direction",value:null},{property:"display",value:null}]);return}K([{property:"display",value:t}])}function Zl(t){const e=g.css;if(!e||e.state.readOnly)return;const o=e.state.selection.main.head,n=e.state.doc.lineAt(o),s=n.text.slice(0,o-n.from),r=n.text.slice(o-n.from),i=Ul(e,o),l=t.replace(/;?$/,";");if(s.trim()===""&&r.trim()===""){const d=`${i}${l}
${i}`;e.dispatch({changes:{from:n.from,to:n.to,insert:d},selection:{anchor:n.from+d.length}});return}const c=`
${i}${l}
${i}`;e.dispatch({changes:{from:o,to:e.state.selection.main.to,insert:c},selection:{anchor:o+c.length}})}function L(t){try{Yl(t),Qt(t)}catch{}}function Yl(t){const e=a.styleMode==="tw",o=e?{}:Z(),n=jt(e?Vo("display"):o.display),s=F(o["flex-direction"])||(n?"row":""),r=i=>e?ya()&&!!i.tw&&!!Vo(i.tw):!!i.css&&i.css in o;it.tools=Fr.map(i=>{const l=(i.kids||[]).filter(c=>c.when!=="flex"||n).map(c=>({id:c.id,title:c.title,icon:Tn[c.icon]||"",sep:!!c.sep,open:a.cssOpenMenu===c.id,active:e?r(c):c.kind==="display"?n:c.kind==="flexDir"?n&&s===c.value:c.value?F(o[c.css])===F(c.value):r(c)}));return{id:i.id,title:i.title,icon:Tn[i.id]||Su[i.id]||"",open:a.cssOpenTool===i.id||a.cssOpenMenu===i.id,kids:l,active:i.value?!e&&F(o[i.css])===F(i.value):r(i)||l.some(c=>c.active)}})}function x(t){const e=t?.getElementById(_);a.cssOpenMenu="",e?._sveApp?.unmount(),e?.remove(),t?.querySelectorAll("[data-sve-css-tool][data-open], [data-sve-html-tool][data-open], [data-sve-css-add-class][data-open], [data-sve-code-history][data-open]").forEach(o=>o.removeAttribute("data-open"))}function Zu(t){x(t),R(t),tt(t);for(const e of ot)g[e]&&gr?.(g[e])}function Os(t){if(a.cssColorsPromise)return a.cssColorsPromise;const e=t.Statamic?.$config?.get?.("cpUrl")||`/${t.Statamic?.$config?.get?.("cpRoute")||"cp"}`;return a.cssColorsPromise=t.fetch(`${e}/color-scheme/swatches`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async o=>{if(!o.ok)return[];const n=await o.json().catch(()=>[]);return Array.isArray(n)?n:[]}).catch(()=>[]).then(o=>{const n=new Set,s=[];for(const r of o){const i=r.var||r.value||r.handle,l=String(i||"").trim().replace(/^var\((.+)\)$/,"$1");!l||n.has(l)||(n.add(l),s.push({name:l,hex:r.hex||r.color||""}))}for(const[r,i]of Br)n.has(r)||(n.add(r),s.push({name:r,hex:i}));return s}),a.cssColorsPromise}function Ps(t,e){const o=Z()[e]||"",n=String(o).match(/^var\(\s*([^)]+?)\s*\)$/i),s=n?n[1].trim():"";for(const r of t.querySelectorAll("[data-sve-css-token]"))s&&r.getAttribute("data-sve-css-token")===s?r.setAttribute("data-active",""):r.removeAttribute("data-active")}function H(t,e,o){const n=e.getBoundingClientRect(),s=8;o.style.left=`${Math.max(s,Math.min(n.left,t.innerWidth-220))}px`,o.style.top=`${Math.max(s,n.bottom+4)}px`}function Jl(t,e,o){const n=t.document;x(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=_,n.body.appendChild(s),H(t,e,s);const r=i=>{s._sveApp?.unmount(),s._sveApp=P(Y,s,{kind:"colors",swatches:i,onClear:()=>{K([{property:o,value:null}]),x(n)},onPick:l=>{K([{property:o,value:`var(${l})`}]),x(n)}}),Ps(s,o)};r(Br.map(([i,l])=>({name:i,hex:l}))),Os(t).then(i=>{n.getElementById(_)&&r(i.map(l=>({name:l.name,hex:l.hex})))})}function Ql(t,e,o,n){const s=t.document;x(s),e.setAttribute("data-open","");const r=s.createElement("div"),i=Z()[o]||"";r.id=_,s.body.appendChild(r),H(t,e,r),r._sveApp=P(Y,r,{kind:"choices",choices:(n||[]).map(l=>({value:l,label:l,active:F(l)===F(i)})),onPick:l=>{const c=F(l)===F(Z()[o]||"");K([{property:o,value:c?null:l}]),x(s)}})}function pn(t,e,o,n=[]){const s=t.document;x(s),e.setAttribute("data-open",""),ga(t);const r=s.createElement("div");r.id=_,s.body.appendChild(r),H(t,e,r);const i=()=>{const l=[...n.map(d=>({value:d,label:d})),...va(t,o).map(d=>({value:d.value,label:d.value}))],c=Z()[o]||"";r._sveApp?.unmount(),r._sveApp=P(Y,r,{kind:"choices",choices:l.map(d=>({...d,active:F(d.value)===F(c)})),onPick:d=>{K([{property:o,value:d||null}]),x(s)}})};i(),Os(t).then(()=>{s.getElementById(_)===r&&i()})}function tc(t,e,o){const n=t.document;x(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=_,n.body.appendChild(s),H(t,e,s),s._sveApp=P(Y,s,{kind:"choices",choices:ku.map(r=>({value:r,token:r,label:r})),onPick:r=>{K([{property:o,value:`var(${r})`}]),x(n)}}),Ps(s,o)}const mn=/\{\{#[\s\S]*?#\}\}|\{\{[\s\S]*?\}\}/g,gn=/<!--[\s\S]*?-->/g,vn=/<(\/?)([A-Za-z][A-Za-z0-9-]*)/g,Ds=/^\{\{\s*(?:\/|endif\b|endunless\b)/,ec=/^\{\{\s*(?:\/\s*(?:if|unless)\b|endif\b|endunless\b)/,oc=/^\{\{\s*\/\s*partial\b/;function We(t,e,o){return t.some(n=>e<n.to&&o>n.from)}function nc(t){const e=new Map;for(const o of ba(t)){const n=o.kind==="loop"?"loop":"if";e.set(o.from,n);const s=t.lastIndexOf("{{",o.to-2);s>=o.openTo&&Ds.test(t.slice(s,o.to))&&e.set(s,n)}for(const o of zn(t))e.set(o.from,"component");return e}function sc(t){const e=String(t||""),o=[],n=[];gn.lastIndex=0;let s;for(;s=gn.exec(e);)o.push({from:s.index,to:s.index+s[0].length});const r=nc(e),i=[];for(mn.lastIndex=0;s=mn.exec(e);){const l=s.index,c=l+s[0].length,d=s[0];if(We(o,l,c))continue;if(i.push({from:l,to:c}),d.startsWith("{{#")){n.push({from:l,to:c,cls:"comment"});continue}const h=Ds.test(d),f=r.get(l)||(h&&ec.test(d)?"if":"")||(h&&oc.test(d)?"component":"");n.push({from:l,to:c,cls:(f?`fam-${f}`:"antlers")+(h?"-close":"")})}for(vn.lastIndex=0;s=vn.exec(e);){const l=s.index+1+s[1].length,c=l+s[2].length;We(o,l,c)||We(i,l,c)||n.push({from:l,to:c,cls:`fam-${Kr(s[2])}`})}return n.sort((l,c)=>l.from-c.from),n}function yn(t,e,o){const n=new e.RangeSetBuilder;let s=0;for(const r of sc(t.doc.toString()))r.from<s||(n.add(r.from,r.to,o(r.cls)),s=r.to);return n.finish()}function rc(t){const e=new Map,o=r=>r==="comment"?"sve-cm-antlers-comment":r==="antlers"?"sve-cm-antlers":r==="antlers-close"?"sve-cm-antlers sve-cm-antlers-close":r.endsWith("-close")?`sve-cm-${r.slice(0,-6)} sve-cm-antlers-close`:`sve-cm-${r}`,n=r=>(e.has(r)||e.set(r,t.Decoration.mark({class:o(r)})),e.get(r));return{extensions:[t.StateField.define({create(r){return yn(r,t,n)},update(r,i){return i.docChanged?yn(i.state,t,n):r},provide:r=>t.EditorView.decorations.from(r)})]}}const A=ao({tag:"",emptyText:"",addLabel:"",dropTitle:"",chips:[],states:[],canEdit:!1,onAdd:null,onChip:null,onDrop:null}),ac={class:"sve-al"},ic={class:"sve-al-head"},lc={key:0,class:"sve-al-tag"},cc=["title","disabled"],dc={key:0,class:"sve-al-empty"},uc={class:"sve-al-chips"},fc=["data-sve-al-chip","title","disabled","onClick"],hc={class:"sve-al-name"},pc={key:0,class:"sve-al-value"},mc=["title","onClick"],gc={__name:"AlpinePanel",setup(t){return(e,o)=>(k(),S("div",ac,[v("div",ic,[$(A).tag?(k(),S("span",lc,"<"+M($(A).tag)+">",1)):X("",!0),(k(!0),S(N,null,ct($(A).states,n=>(k(),S("span",{key:n,class:"sve-al-state"},M(n),1))),128)),o[1]||(o[1]=v("span",{class:"sve-al-gap"},null,-1)),v("button",{type:"button","data-sve-al-add":"",title:$(A).addLabel,disabled:!$(A).canEdit,onClick:o[0]||(o[0]=B(n=>$(A).onAdd?.(n),["prevent","stop"]))},"+",8,cc)]),$(A).chips.length?X("",!0):(k(),S("div",dc,M($(A).emptyText),1)),v("div",uc,[(k(!0),S(N,null,ct($(A).chips,n=>(k(),S("span",{key:n.id,class:"sve-al-chip-wrap"},[v("button",{type:"button","data-sve-al-chip":n.id,title:n.title,disabled:!$(A).canEdit,onClick:B(s=>$(A).onChip?.(s,n.id),["prevent","stop"])},[v("span",hc,M(n.name),1),n.value?(k(),S("span",pc,M(n.value),1)):X("",!0)],8,fc),$(A).canEdit?(k(),S("button",{key:0,type:"button",class:"sve-al-drop",title:$(A).dropTitle,onClick:B(s=>$(A).onDrop?.(n.id),["prevent","stop"])},"−",8,mc)):X("",!0)]))),128))])]))}},vc=Ln(gc,[["__scopeId","data-v-15add965"]]),yc=[{id:"state",lang:"alpine_group_state"},{id:"act",lang:"alpine_group_act"},{id:"react",lang:"alpine_group_react"}],bn=[{id:"state",group:"state",label:"alpine_state",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: false }"}]},{id:"state_text",group:"state",label:"alpine_state_text",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: '|' }"}]},{id:"toggle",group:"act",label:"alpine_toggle",icon:"toggle",needsName:!0,attrs:[{name:"@click",value:":name = !:name"}]},{id:"open",group:"act",label:"alpine_open",icon:"open",needsName:!0,attrs:[{name:"@click",value:":name = true"}]},{id:"close",group:"act",label:"alpine_close",icon:"close",needsName:!0,attrs:[{name:"@click",value:":name = false"}]},{id:"open_hover",group:"act",label:"alpine_open_hover",icon:"open",needsName:!0,attrs:[{name:"@mouseenter",value:":name = true"}]},{id:"close_leave",group:"act",label:"alpine_close_leave",icon:"close",needsName:!0,attrs:[{name:"@mouseleave",value:":name = false"}]},{id:"open_focus",group:"act",label:"alpine_open_focus",icon:"open",needsName:!0,attrs:[{name:"@focusin",value:":name = true"}]},{id:"close_blur",group:"act",label:"alpine_close_blur",icon:"close",needsName:!0,attrs:[{name:"@focusout",value:":name = false"}]},{id:"close_outside",group:"act",label:"alpine_close_outside",icon:"outside",needsName:!0,attrs:[{name:"@click.outside",value:":name = false"}]},{id:"close_escape",group:"act",label:"alpine_close_escape",icon:"escape",needsName:!0,attrs:[{name:"@keydown.escape.window",value:":name = false"}]},{id:"show",group:"react",label:"alpine_show",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"}]},{id:"show_smooth",group:"react",label:"alpine_show_smooth",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"},{name:"x-transition",value:""}]},{id:"hide_until_ready",group:"react",label:"alpine_hide_until_ready",icon:"cloak",attrs:[{name:"x-cloak",value:""}]},{id:"class_when",group:"react",label:"alpine_class_when",icon:"klass",needsName:!0,attrs:[{name:":class",value:":name ? '|' : ''"}]},{id:"text",group:"react",label:"alpine_text",icon:"text",needsName:!0,attrs:[{name:"x-text",value:":name"}]}];function bc(t){return(t?.attrs||[]).map(e=>e.name).join(" ")}const xc=/^(x-[\w:.-]+|@[\w:.-]+|:[\w-]+)$/;function kc(t){return xc.test(String(t||""))}function Yt(t){const e=String(t||""),o=[],n=/([@:a-zA-Z_][\w:.@-]*)(\s*=\s*(["'])([\s\S]*?)\3)?/g;let s,r=!0;for(;s=n.exec(e);){if(r){r=!1;continue}s[0].trim()&&o.push({name:s[1],value:s[4]??"",from:s.index,to:s.index+s[0].length,alpine:kc(s[1])})}return o}function zs(t){const e=String(t||"").trim().replace(/^\{|\}$/g,""),o=[],n=/(^|,)\s*([a-zA-Z_$][\w$]*)\s*:/g;let s;for(;s=n.exec(e);)o.push(s[2]);return o}function Sc(t,e){return t.map(o=>({name:o.name,value:String(o.value).replaceAll(":name:",`${e}:`).replaceAll(":name",e)}))}function Ao(t,e,o){const n=g.html,s=bt();if(!n||n.state.readOnly||!s)return;const r=a.htmlScopeActive&&!!a.htmlFocus,i=r?a.htmlFocus.from:0,c=(r?a.htmlFull:n.state.doc.toString()).slice(s.from,s.openTo),d=o===""?e:`${e}="${o}"`,h=Yt(c).find(m=>m.name===e);let f;if(h)f=c.slice(0,h.from)+d+c.slice(h.to);else{const m=c.search(/\s|\/?>$/);f=m===-1?c:`${c.slice(0,m)} ${d}${c.slice(m)}`}f!==c&&(ht(n,[{from:s.from-i,to:s.openTo-i,insert:f}],null),Oe(t))}function _c(t,e){const o=g.html,n=bt();if(!o||o.state.readOnly||!n)return;const s=a.htmlScopeActive&&!!a.htmlFocus,r=s?a.htmlFocus.from:0,l=(s?a.htmlFull:o.state.doc.toString()).slice(n.from,n.openTo),c=Yt(l).find(f=>f.name===e);if(!c)return;let d=c.from;for(;d>0&&/\s/.test(l[d-1]);)d-=1;const h=l.slice(0,d)+l.slice(c.to);ht(o,[{from:n.from-r,to:n.openTo-r,insert:h}],null),Oe(t)}function Ye(t){const e=g.html;if(!e)return[];const n=a.htmlScopeActive&&!!a.htmlFocus?a.htmlFull:e.state.doc.toString(),s=bt(),r=[],i=jn(xe(n),new Set);for(const l of i){if(!s||l.from>s.from||l.to<s.to)continue;const c=Yt(n.slice(l.from,l.openTo)).find(d=>d.name==="x-data");c&&r.push(...zs(c.value))}return[...new Set(r)]}function wc(t){const e=g.html,o=bt();if(!e||!o)return[];const s=a.htmlScopeActive&&!!a.htmlFocus?a.htmlFull:e.state.doc.toString(),r=Yt(s.slice(o.from,o.openTo)).find(i=>i.name==="x-data");return r?zs(r.value):[]}function $c(t,e){const o=t.document;x(o),e.setAttribute("data-open","");const n=Ye(),s=o.createElement("div");s.id=_,o.body.appendChild(s),H(t,e,s);const r=!n.length,i=!r&&!wc().length,c=yc.filter(d=>d.id==="state"?!i:!r).flatMap(d=>{const h=bn.filter(f=>f.group===d.id);return h.length?[{value:`\0${d.id}`,label:p(t,r&&d.id==="state"?"alpine_group_state_first":d.lang),heading:!0},...h.map(f=>({value:f.id,label:p(t,f.label),hint:bc(f)}))]:[]});r&&c.push({value:"\0note",label:p(t,"alpine_needs_state"),note:!0}),s._sveApp=P(Y,s,{kind:"choices",choices:c,onPick:d=>{const h=bn.find(f=>f.id===d);if(x(o),!!h){if(!h.needsName){for(const f of h.attrs)Ao(t,f.name,f.value);return}Cc(t,e,h,n)}}})}function Cc(t,e,o,n){const s=t.document,r=l=>{const c=String(l||"").trim().replace(/[^\w$]/g,"");if(x(s),!!c)for(const d of Sc(o.attrs,c))Ao(t,d.name,d.value.replace("|",""))};if(!n.length){Je(t,e,r);return}const i=s.createElement("div");i.id=_,s.body.appendChild(i),H(t,e,i),i._sveApp=P(Y,i,{kind:"choices",choices:[{value:"\0head",label:p(t,"alpine_name"),heading:!0},...n.map(l=>({value:l,label:l})),{value:"\0new",label:p(t,"alpine_new_name")}],onPick:l=>{if(l==="\0new"){Je(t,e,r);return}r(l)}})}function Je(t,e,o){const n=t.document;x(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=_,n.body.appendChild(s),H(t,e,s),s._sveApp=P(bo,s,{label:p(t,"alpine_name"),placeholder:p(t,"alpine_name_placeholder"),onAdd:r=>o(r)})}function Oe(t){const o=t?.document.getElementById(u)?.querySelector("[data-sve-alpine-host]");if(!o)return;const n=bt(),s=g.html,r=a.htmlScopeActive&&!!a.htmlFocus,i=s?r?a.htmlFull:s.state.doc.toString():"",l=n?Yt(i.slice(n.from,n.openTo)):[];A.tag=n?.tag||"",A.canEdit=!a.lastLocked&&!!n,A.emptyText=p(t,n?Ye().length?"alpine_none_ready":"alpine_none":"alpine_pick"),A.addLabel=p(t,"alpine_add"),A.dropTitle=p(t,"alpine_remove"),A.states=Ye(),A.chips=l.filter(c=>c.alpine).map(c=>({id:c.name,name:c.name,value:c.value,title:c.value?`${c.name}="${c.value}"`:c.name})),A.onAdd=c=>$c(t,c.currentTarget),A.onDrop=c=>_c(t,c),A.onChip=(c,d)=>{A.chips.find(f=>f.id===d)&&Je(t,c.currentTarget,f=>Ao(t,d,f))},o._sveMounted||(o._sveMounted=!0,Ut(o,vc))}const Ac=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]),Tc=new Set(["html","head","body"]),xn=new Set(["if","unless","style_push","script_push","sve_defaults","once","noparse","foreach","forelse","loop","cache","nocache","scope","collection","nav","structure","taxonomy","users","search:results","form:create","form:errors"]),Mc=new Set(["collection:count"]);function kn(t){return Mc.has(t)?!1:xn.has(t)||xn.has(t.split(":")[0])}const Ec=new Set(["CloseTag","MismatchedCloseTag","IncompleteCloseTag"]),Lc=/^\s*(\/?)\s*([A-Za-z_][A-Za-z0-9_.:-]*)([\s\S]*)$/,Bc=/^\{\{\s*\/?\s*([A-Za-z_][A-Za-z0-9_.:-]*)/,Fc=3e5;function Ic(t){const e=String(t||""),o=[],n=[];let s=0;for(;s<e.length;){const r=e.indexOf("{{",s);if(r===-1)break;if(e.startsWith("{{#",r)){const d=e.indexOf("#}}",r+3);if(d===-1){n.push(r);break}o.push({from:r,to:d+3,comment:!0,body:""}),s=d+3;continue}let i=0,l=r,c=-1;for(;l<e.length;){if(e.startsWith("{{",l)){i+=1,l+=2;continue}if(e.startsWith("}}",l)){if(i-=1,l+=2,i===0){c=l;break}continue}l+=1}if(c===-1){n.push(r),s=r+2;continue}o.push({from:r,to:c,comment:!1,body:e.slice(r+2,c-2)}),s=c}return{tags:o,unclosed:n}}function Oc(t,e){let o=t;for(const n of e)o=o.slice(0,n.from)+" ".repeat(n.to-n.from)+o.slice(n.to);return o}function Pc(t,e){return t===e||t.startsWith(`${e}:`)}function re(t,e){return(t.slice(e,e+80).match(/^<\/?([A-Za-z][A-Za-z0-9:-]*)/)?.[1]||"").toLowerCase()}function Dc(t,e,o,n,s){const r=c=>s.has(c.name)&&!/\||\?\?/.test(c.rest);for(const c of o){const d=t.slice(c,c+80).match(Bc)?.[1]||"…";n.push({from:c,to:c+2,key:"code_dock_problem_antlers_unclosed",args:{name:d}})}const i=[],l=[];for(const c of e){if(c.comment)continue;const d=c.body.match(Lc);if(!d)continue;const h=!!d[1],f=d[2].toLowerCase(),m=d[3];if(!h&&(f==="elseif"||f==="else")){let y=-1;for(let b=i.length-1;b>=0;b-=1)if(i[b].name==="if"||i[b].name==="unless"){y=b;break}if(y===-1){n.push({from:c.from,to:c.to,key:"code_dock_problem_branch_stray",args:{name:f}});continue}l.push({from:i[y].to,to:c.from}),i[y]={...i[y],to:c.to},i.length=y+1;continue}if(h||f==="endif"||f==="endunless"){const y=f==="endif"?"if":f==="endunless"?"unless":f;let b=-1;for(let E=i.length-1;E>=0;E-=1)if(Pc(i[E].name,y)){b=E;break}if(b===-1){n.push({from:c.from,to:c.to,key:"code_dock_problem_pair_stray",args:{name:y}});continue}for(const E of i.slice(b+1))kn(E.name)&&n.push({from:E.from,to:E.to,key:"code_dock_problem_pair_unclosed",args:{name:E.name}});(y==="if"||y==="unless")&&l.push({from:i[b].to,to:c.from}),i.length=b;continue}m.trim().startsWith("=")||i.push({name:f,rest:m,from:c.from,to:c.to})}for(const c of i)kn(c.name)?n.push({from:c.from,to:c.to,key:"code_dock_problem_pair_unclosed",args:{name:c.name}}):r(c)&&n.push({from:c.from,to:c.to,key:"code_dock_problem_list_unclosed",args:{name:c.name}});return l}function zc(t,e,o,n){const s=e.parse(t),r=new Set,i=[];s.iterate({enter(l){if(l.name==="MismatchedCloseTag"){i.push({from:l.from,to:l.to,key:"code_dock_problem_tag_stray",args:{tag:re(t,l.from)}});return}if(l.name==="IncompleteCloseTag"){i.push({from:l.from,to:l.to,key:"code_dock_problem_tag_unfinished",args:{tag:re(t,l.from)}});return}if(l.type.isError){const f=l.node.parent;f&&(f.name==="OpenTag"||f.name==="CloseTag")&&(r.add(f.from),i.push({from:f.from,to:Math.max(f.from+1,l.from),key:"code_dock_problem_tag_unfinished",args:{tag:re(t,f.from)}}));return}if(l.name!=="Element")return;let c=null,d=!1;for(let f=l.node.firstChild;f;f=f.nextSibling)f.name==="OpenTag"&&(c=f),Ec.has(f.name)&&(d=!0);if(!c||d)return;const h=re(t,c.from);!h||Ac.has(h)||Tc.has(h)||o.some(f=>c.from>=f.from&&c.from<f.to&&l.to>f.to)||i.push({from:c.from,to:c.to,key:"code_dock_problem_tag_unclosed",args:{tag:h}})}});for(const l of i)l.key==="code_dock_problem_tag_unclosed"&&r.has(l.from)||l.args.tag&&n.push(l)}function Hc(t,e,o={}){const n=String(t||"");if(!n.trim()||n.length>Fc)return[];const s=[];try{const{tags:i,unclosed:l}=Ic(n),c=Dc(n,i,l,s,new Set(o.lists||[]));e&&zc(Oc(n,i),e,c,s)}catch{return[]}const r=new Set;return s.sort((i,l)=>i.from-l.from||i.to-l.to).filter(i=>{const l=`${i.from}:${i.key}`;return r.has(l)?!1:(r.add(l),!0)})}function Rc(t,e,o=()=>({})){const n=t.Decoration.mark({class:"sve-cm-problem"}),s=t.StateEffect.define(),r=l=>{const c=Hc(l.doc.toString(),e,o()),d=new t.RangeSetBuilder;let h=0;for(const f of c)f.from<h||f.to<=f.from||(d.add(f.from,f.to,n),h=f.to);return{problems:c,decorations:d.finish()}},i=t.StateField.define({create(l){return r(l)},update(l,c){return c.docChanged||c.effects.some(d=>d.is(s))?r(c.state):l},provide:l=>t.EditorView.decorations.from(l,c=>c.decorations)});return{field:i,relint:s,extensions:[i]}}const jc=new Set(["replicator","grid","list","array","table"]);let ce=new Set,qe=null;function Hs(t){return t.document.getElementById(u)?.querySelector("[data-sve-html-problems]")||null}function Nc(t,e,o){const n=Hs(t);if(!n)return;const s=e.state.doc,r=o.map(c=>({from:c.from,line:s.lineAt(Math.min(c.from,s.length)).number,text:p(t,c.key,c.args)})),i=r.map(c=>`${c.line}:${c.text}`).join(`
`);if(n.dataset.sveSignature===i||(n.dataset.sveSignature=i,n.hidden=r.length===0,n.replaceChildren(),!r.length))return;const l=t.document.createElement("span");l.setAttribute("data-sve-problems-title",""),l.textContent=p(t,"code_dock_problems_title"),n.appendChild(l);for(const c of r){const d=t.document.createElement("button"),h=t.document.createElement("b");d.type="button",d.dataset.sveProblemAt=String(c.from),h.textContent=p(t,"code_dock_problem_line",{line:c.line}),d.append(h,t.document.createTextNode(` ${c.text}`)),n.appendChild(d)}}function Wc(t){const e=Hs(t);!e||e._sveBound||(e._sveBound=!0,e.addEventListener("mousedown",o=>o.preventDefault()),e.addEventListener("click",o=>{const n=o.target.closest("[data-sve-problem-at]"),s=g.html;if(!n||!s)return;o.preventDefault(),o.stopPropagation();const r=Math.min(Number(n.dataset.sveProblemAt)||0,s.state.doc.length);s.dispatch({selection:{anchor:r},effects:D.scrollIntoView(r,{y:"center"})}),s.focus()}))}function qc(t){const e=[],o=n=>{for(const s of n||[])s?.loop&&jc.has(s.type)&&s.var&&!s.parent&&e.push(s.var)};o(t?.section);for(const n of t?.page||[])o(n?.items);return e}function Vc(t,e,o){const n={collection:ns(t),set:ss(a.lastType),view:"",scope:""},s=n.set?go(n):"";if(s===qe)return;qe=s;const r=l=>{if(qe!==s)return;const c=new Set(qc(l)),d=c.size===ce.size&&[...c].every(h=>ce.has(h));ce=c,!d&&g.html===e&&t.queueMicrotask(()=>{g.html===e&&e.dispatch({effects:o.of(null)})})};if(!s){r(null);return}const i=rs(s);if(i){r(i);return}as(t,n).then(r)}function Uc(t){if(!a.htmlLintUi){const{field:e,relint:o}=Rc({Decoration:_t,StateField:kt,StateEffect:oe,RangeSetBuilder:St,EditorView:D},Po.parser,()=>({lists:ce})),n=D.updateListener.of(s=>{const r=s.transactions.some(i=>i.effects.some(l=>l.is(o)));!s.docChanged&&!r||(s.docChanged&&Vc(t,s.view,o),Nc(t,s.view,s.state.field(e).problems))});a.htmlLintUi={extensions:[e,n]}}return Wc(t),a.htmlLintUi}function Kc(){if(a.cssGhostUi)return a.cssGhostUi;const t=_t.mark({class:"sve-css-ghost"}),e=o=>{const n=new St;if(!a.lastWin)return n.finish();try{for(const s of Zi(o.doc.toString(),ut(a.lastWin)))n.add(s.from,s.to,t)}catch{}return n.finish()};return a.cssGhostUi=kt.define({create:o=>e(o),update:(o,n)=>n.docChanged?e(n.state):o,provide:o=>D.decorations.from(o)}),a.cssGhostUi}let ae=null,me=null;function Gc(){if(ae)return ae;me=oe.define();const t=_t.line({class:"sve-css-id"}),e=o=>{const n=new St;if(!a.lastWin||!a.cssValues)return n.finish();try{const s=o.doc;for(const r of fe(s.toString(),ut(a.lastWin),a.cssSize)){const i=s.lineAt(Math.min(r.from,s.length)).number,l=s.lineAt(Math.min(Math.max(r.to-1,r.from),s.length)).number;for(let c=i;c<=l;c+=1)n.add(s.line(c).from,s.line(c).from,t)}}catch{}return n.finish()};return ae=kt.define({create:o=>e(o),update:(o,n)=>n.docChanged||n.effects.some(s=>s.is(me))?e(n.state):o,provide:o=>D.decorations.from(o)}),ae}function To(){me&&g.css&&g.css.dispatch({effects:me.of(null)})}function Xc(){return a.htmlPartialUi||(a.htmlPartialUi=Sa({Decoration:_t,StateField:kt,StateEffect:oe,RangeSetBuilder:St,EditorView:D})),a.htmlPartialUi}function Zc(){return a.htmlAntlersUi||(a.htmlAntlersUi=rc({Decoration:_t,StateField:kt,RangeSetBuilder:St,EditorView:D})),a.htmlAntlersUi}function Yc(){return a.htmlClassTokenUi||(a.htmlClassTokenUi=Za({Decoration:_t,StateField:kt,StateEffect:oe,RangeSetBuilder:St,EditorView:D})),a.htmlClassTokenUi}function Jc(t,e,o){g[e]?.destroy();const n=oo.of([{key:"Mod-s",run:()=>(W(t.document),!0)}]);g[e]=new D({state:ve.create({doc:"",extensions:[ar(),ir(),lr(),fr(),Ud(e),pr(),hr({tooltipClass:()=>"sve-tw-complete"}),...e==="html"?[Po.data.of({autocomplete:xa(t)}),ka(yr,t)]:[],...e==="html"?[...Ba(),Fa()]:[],...e==="css"?[Sr(),Kc(),Gc()]:[],oo.of([...cr,...e==="html"?[{key:"Tab",run:Ia}]:[],dr,...ur,...vr,...mr]),n,D.lineWrapping,...e==="html"||e==="css"?Xc().extensions:[],...e==="html"?Zc().extensions:[],...e==="html"?Uc(t).extensions:[],...e==="html"?Yc().extensions:[],zt[e].of(ve.readOnly.of(!!a.lastLocked)),Ht[e].of(D.editable.of(!a.lastLocked)),D.updateListener.of(s=>{e==="html"&&s.docChanged&&!a.applying&&(Tl(),lo("dock:html-changed")),e==="css"&&s.docChanged&&!a.applying&&Ml(),s.docChanged&&J(t),e==="css"&&(s.docChanged||s.selectionSet)&&L(t),e==="css"&&s.docChanged&&!a.applying&&Jt(t),e==="html"&&(s.docChanged||s.selectionSet)&&(Be(t),Oe(t),a.applying||te(t))}),...da(w,{height:"auto",background:"#1E1E21",scroller:{overflow:"visible",height:"auto",minHeight:0},extraTags:s=>[{tag:s.tagName,color:"#4ec9b0"},{tag:s.attributeName,color:"#9cdcfe"},{tag:s.attributeValue,color:"#ce9178"},{tag:s.angleBracket,color:"#808080"}]})]}),parent:o})}function Qc(t){if(!t||t.querySelector(".cm-editor"))return;t.replaceChildren();const e=t.ownerDocument.createElement("span");e.style.cssText="width:16px;height:16px;margin:12px;border:2px solid #858585;border-right-color:transparent;border-radius:50%;display:block;animation:sve-cm-wait .6s linear infinite",t.appendChild(e)}function ut(t){return co(t).map(e=>({handle:e.handle,base:e.base,max:e.max,media:e.media,media_px:e.media_px,label:e.label}))}function Rs(t,e){return ut(t).find(o=>o.handle===e)||null}function Pe(t=a.cssState){return t?t==="before"||t==="after"?`::${t}`:`:${t}`:""}function Jt(t,e=!1){const o=g.css;if(!o||!no||!so)return;const n=o.state.doc.toString(),s=`${a.cssValues?"1":"0"}|${a.cssSize}|${$e(n).map(h=>`${h.from}-${h.to}`).join(",")}`;if(!e&&s===a.cssFoldSig)return;a.cssFoldSig=s;const r=ut(t),i=new Map,l=[...Gi(n,r,a.cssSize),...a.cssValues?[]:fe(n,r,a.cssSize).map(h=>({from:h.from,to:h.to}))];for(const h of l)h.to>h.from&&i.set(`${h.from}:${h.to}`,{from:h.from,to:h.to});const c=[],d=new Set;_r(o.state).between(0,n.length,(h,f)=>{const m=`${h}:${f}`;d.add(m),!i.has(m)&&a.cssOwnFolds.has(m)&&c.push(so.of({from:h,to:f}))});for(const[h,f]of i)d.has(h)||c.push(no.of(f));a.cssOwnFolds=new Set(i.keys()),c.length&&o.dispatch({effects:c})}function Qe(t,e){const o=a.cssFull||e;return/max-width/i.test(o)&&!/width\s*</i.test(o)&&t.media_px||t.media}function td(t,e){const o=g.css;if(!o||o.state.readOnly)return;const n=ut(t),s=Rs(t,e),r=o.state.doc.toString();if(!s||s.base){const h=o.state.selection.main.head,f=$e(r).find(m=>h>=m.from&&h<=m.to);f&&o.dispatch({selection:{anchor:f.from},scrollIntoView:!0});return}const i=yo(r,n,e);if(i.length){const h=i[0],f=Math.min(h.bodyTo,h.bodyFrom+(r.slice(h.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);o.dispatch({selection:{anchor:f},scrollIntoView:!0});return}const l=Qe(s,r),c=js(o,r),d=`

${c.indent}@media ${l} {
${c.indent}    
${c.indent}}${c.suffix}`;o.dispatch({changes:{from:c.at,to:c.at,insert:d},selection:{anchor:c.at+d.lastIndexOf("    ")+4},scrollIntoView:!0})}function js(t,e){const o=$e(e);if(o.length){const i=o[o.length-1];return{at:i.to,indent:pt(e,i.from),suffix:""}}const n=i=>({at:i.to,indent:pt(e,i.to)||`${pt(e,i.open)}    `,suffix:`
${pt(e,i.open)}`}),s=Fe();if(s)return n(s);const r=ed(e);return r?n(r):{at:e.length,indent:"",suffix:""}}function ed(t){const e=String(t||"");let o=null,n=0,s=0;for(;n<e.length;){if(e[n]==="}"||e[n]===";"){n+=1,s=n;continue}if(e[n]!=="{"){n+=1;continue}const r=Mt(e,n);if(r===-1||o||(o=e.slice(s,n).trim().startsWith("@")?null:{from:s,open:n,to:r},!o))return null;n=r+1,s=n}return o}function od(t,e){const o=e===a.cssSize?"":e;a.cssSize=o,j(t,Lo,o),mt("lp:set-device",{win:t,key:o?Gr(o,t):"Responsive"}),o&&td(t,o),a.cssValues&&Ws(t),Jt(t,!0),To(),Qt(t),L(t)}function nd(t,e){a.cssState=Bo.includes(e)?e:"",j(t,to,a.cssState),x(t.document),Qt(t),L(t)}function sd(t,e){const o=t.document;x(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=_,o.body.appendChild(n),H(t,e,n),n._sveApp=P(Y,n,{kind:"choices",choices:[{value:"",label:p(t,"css_state_none"),active:!a.cssState},...Bo.map(s=>({value:s,label:Pe(s),active:s===a.cssState}))],onPick:s=>nd(t,s)})}function Qt(t){const o=t?.document.getElementById(u)?.querySelector("[data-sve-css-head]");if(!o)return;const n=bt(),s=ut(t),r=g.css?.state.doc.toString()??"";T.tag=n?.tag||"",T.scope=Da(n?Lt().slice(n.from,n.openTo):"")||"",T.canEdit=!a.lastLocked,T.onTag=i=>_a(t,i.currentTarget,n),T.state=a.cssState,T.stateLabel=a.cssState?Pe(a.cssState):p(t,"css_state"),T.onState=i=>sd(t,i.currentTarget),T.onSize=i=>od(t,i),T.sizes=[{key:"",label:p(t,"tw_size_all"),title:p(t,"css_size_all_title"),active:!a.cssSize},...s.map(i=>{const l=i.base||yo(r,s,i.handle).length>0;return{key:i.handle,label:i.label,title:i.base?p(t,"css_size_base_title"):`@media ${i.media}${l?"":`  ·  ${p(t,"css_size_new")}`}`,active:a.cssSize===i.handle}})],o._sveMounted||(o._sveMounted=!0,Ut(o,sl))}be("lp:device",t=>{const e=a.lastWin;if(!e||!Us(e.document))return;const o=co(e).find(n=>n.device===t)?.handle||"";o!==a.cssSize&&(a.cssSize=o,j(e,Lo,o),Jt(e,!0),To(),Qt(e),L(e))});function rd(t){const e=Math.max(0,Math.round(Date.now()/1e3-t)),o=new Date(t*1e3).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});let n=o;try{const s=new Intl.RelativeTimeFormat(void 0,{numeric:"auto"});e<90?n=s.format(-e,"second"):e<5400?n=s.format(-Math.round(e/60),"minute"):e<86400?n=s.format(-Math.round(e/3600),"hour"):n=s.format(-Math.round(e/86400),"day")}catch{}return`${n} · ${o}`}function Ns(t,e){return t.fetch(e,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}})}async function ad(t,e){const o=t.document,n=xt();if(x(o),!n)return;let s=[];try{const i=await Ns(t,`/!/sve/section-template/history?type=${encodeURIComponent(n)}`);i.ok&&(s=(await i.json())?.entries||[])}catch{s=[]}if(!o.getElementById(u)||!o.contains(e))return;e.setAttribute("data-open","");const r=o.createElement("div");r.id=_,o.body.appendChild(r),H(t,e,r),r._sveApp=P(Y,r,{kind:"choices",choices:s.length?s.map(i=>({value:i.id,label:rd(i.at)})):[{value:"",label:p(t,"code_dock_history_empty")}],onPick:i=>{x(o),i&&id(t,n,i)}})}async function id(t,e,o){if(dt())return;let n=null;try{const s=await Ns(t,`/!/sve/section-template/history/entry?type=${encodeURIComponent(e)}&id=${encodeURIComponent(o)}`);s.ok&&(n=await s.json())}catch{n=null}!n||dt()||(Zt({html:n.html??"",css:n.css??"",js:n.js??""},a.lastLocked),J(t),te(t))}function Nt(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-code-strip]");if(!e)return;e.hidden=a.styleMode!=="tw";const o=Nn(t);e.innerHTML=_u,e.title=p(t,o?"tw_strip_on":"tw_strip_off"),e.setAttribute("aria-label",e.title),e.setAttribute("aria-pressed",o?"true":"false")}function ld(t,e){const o=e.querySelector("[data-sve-code-strip]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),wa(t,!Nn(t)),Nt(t),$a(t)}),Nt(t))}function cd(t,e){const o=e.querySelector("[data-sve-code-history]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=wu,o.title=p(t,"code_dock_history"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),o.hasAttribute("data-open")){x(t.document);return}ad(t,o)}))}function Yu(){return a.styleMode}function dd(t){return a.styleMode==="tw"?bt():null}function bt(t){const e=g.html;if(!e)return null;const o=a.htmlScopeActive&&!!a.htmlFocus,n=o?a.htmlFull:e.state.doc.toString(),r=(o?a.htmlFocus.from:0)+e.state.selection.main.from,i=jn(xe(n),new Set);let l=null;for(const c of i)c.from<=r&&r<c.to&&(l=c);return l}function te(t){a.styleMode==="tw"&&Ca(t,dd())}function Mo(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-values-mode]");if(!e||!o)return;e.setAttribute("data-sve-values",a.cssValues?"on":"off");const n=t.document.createElement("span");n.textContent=p(t,"code_dock_values"),o.innerHTML=Cu,o.appendChild(n),o.title=p(t,a.cssValues?"code_dock_values_off":"code_dock_values_on"),o.setAttribute("aria-label",o.title),o.setAttribute("aria-pressed",a.cssValues?"true":"false")}function Ws(t){const e=g.css;if(!e||e.state.readOnly)return;const o=ut(t),n=e.state.doc.toString(),s=fe(n,o,a.cssSize);if(e.focus(),s.length){const m=s[0],y=Math.min(m.bodyTo,m.bodyFrom+(n.slice(m.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);e.dispatch({selection:{anchor:y},scrollIntoView:!0});return}const r=Rs(t,a.cssSize);if(!r||r.base){const m=`#id-{{ id }} {
    `;e.dispatch({changes:{from:0,to:0,insert:`${m}
}

`},selection:{anchor:m.length},scrollIntoView:!0});return}const i=yo(n,o,a.cssSize)[0];if(i){const m=`${pt(n,i.from)}    `,y=`
${m}#id-{{ id }} {
${m}    `;e.dispatch({changes:{from:i.bodyFrom,to:i.bodyFrom,insert:`${y}
${m}}
`},selection:{anchor:i.bodyFrom+y.length},scrollIntoView:!0});return}const l=js(e,n),c=`${l.indent}    `,d=fe(n,o,"").some(m=>l.at>m.bodyFrom&&l.at<=m.bodyTo),h=d?`

${l.indent}@media ${Qe(r,n)} {
${c}`:`

${l.indent}@media ${Qe(r,n)} {
${c}#id-{{ id }} {
${c}    `,f=d?`
${l.indent}}${l.suffix}`:`
${c}}
${l.indent}}${l.suffix}`;e.dispatch({changes:{from:l.at,to:l.at,insert:`${h}${f}`},selection:{anchor:l.at+h.length},scrollIntoView:!0})}function ud(t,e){a.cssValues=!!e,j(t,Do,a.cssValues?"1":"0"),x(t.document),a.cssOpenTool="",Mo(t),at(),Gt(),a.cssValues&&Ws(t),Jt(t,!0),To(),Qt(t),L(t)}function Eo(t){const e=t?.document.getElementById(u);if(!e)return;const o=a.styleMode==="tw";e.setAttribute("data-sve-style",a.styleMode);const n=e.querySelector("[data-sve-css-label]");n&&(n.textContent=o?p(t,"code_dock_style_tw"):p(t,"code_dock_css"));const s=e.querySelector("[data-sve-style-mode]");if(!s)return;const r=t.document.createElement("span");r.textContent=o?p(t,"code_dock_style_tw"):p(t,"code_dock_css"),s.innerHTML=o?Au:$u,s.appendChild(r),s.title=p(t,o?"code_dock_style_to_css":"code_dock_style_to_tw"),s.setAttribute("aria-label",s.title),s.setAttribute("aria-pressed",o?"true":"false")}function qs(t){t?.document.getElementById(u),x(t.document),Ke(t),a.cssOpenTool="",a.cssOpenMenu="",a.styleMode==="tw"&&a.cssValues&&(a.cssValues=!1,j(t,Do,"0")),Eo(t),Mo(t),Nt(t),a.cssToolRow?.(),a.styleMode==="tw"&&(a.htmlScopePref=!0,j(t,De,"1"),Ge(t,!0)),te(t),Oe(t),L(t)}const Lo="sve-css-size",to="sve-css-state",Bo=["hover","focus","focus-visible","active","disabled","before","after"];function fd(t,e){a.styleMode=e==="tw"?"tw":"css",j(t,Tr,a.styleMode),qs(t)}function hd(t,e){if(e._sveStyleModeBound)return;e._sveStyleModeBound=!0,a.styleMode=G(t,Tr)==="tw"?"tw":"css";const o=G(t,Lo)||"";a.cssSize=co(t).some(n=>n.handle===o)?o:"",a.cssState=Bo.includes(G(t,to))?G(t,to):"",a.cssValues=G(t,Do)==="1",e.querySelector("[data-sve-style-mode]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),fd(t,a.styleMode==="tw"?"css":"tw")}),e.querySelector("[data-sve-values-mode]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),ud(t,!a.cssValues)}),qs(t),Mo(t)}function pd(t,e){const o=e.querySelector("[data-sve-css-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=r=>e.querySelector(`[data-sve-css-tool="${r}"], [data-sve-css-kid="${r}"]`),s=r=>{const i=n(r.id),l=a.cssOpenMenu===r.id;if(x(t.document),l){Ke(t),L(t);return}if(!i)return;const c=a.styleMode==="tw"?!r.twClass&&!!r.tw:!r.kind&&!r.value&&!(r.css in Z())&&!!r.menu,d=()=>{c&&(a.cssOpenMenu=r.id)};if(a.styleMode==="tw"){Ke(t),r.twClass?(Aa(t,r.twClass),L(t)):r.tw&&(Ta(t,i,r.tw,()=>L(t)),d(),L(t));return}if(r.kind==="flexDir"){Gl(r.value);return}if(r.kind==="display"){Xl(r.value);return}if(r.value){const h=F(Z()[r.css])===F(r.value);K([{property:r.css,value:h?null:r.value}]);return}if(r.css in Z()){K([{property:r.css,value:null}]),L(t);return}r.menu==="colors"?Jl(t,i,r.css):r.menu==="spacing"?tc(t,i,r.css):r.menu==="sizes"?pn(t,i,r.css,Bu):r.menu==="choices"?Ql(t,i,r.css,r.choices):r.menu==="values"&&pn(t,i,r.css),d(),L(t)};it.onTool=r=>{const i=ye.get(r)?.tool;if(i){if(i.kids?.length){a.cssOpenTool=a.cssOpenTool===i.id?"":i.id,x(t.document),L(t);return}s(i)}},it.onKid=(r,i)=>{const l=ye.get(i);l?.kid&&s(l.kid)},a.cssToolRow=()=>{Ut(o,qi),L(t)},a.cssToolRow(),t.document.addEventListener("mousedown",r=>{r.target.closest(`#${_}, [data-sve-css-tools], [data-sve-html-tools], [data-sve-css-add-class]`)||x(t.document)},!0)}function md(t,e){const o=e.querySelector("[data-sve-html-tidy]");o&&(o.innerHTML=Wn.tidy,o.title=p(t,"code_dock_html_tidy"),o.setAttribute("aria-label",o.title),o.setAttribute("data-tip",o.title))}function gd(t,e){const o=e.querySelector("[data-sve-html-tidy]");md(t,e),!(!o||o._sveBound)&&(o._sveBound=!0,o.addEventListener("mousedown",n=>n.preventDefault()),o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Cs()}))}function vd(t,e){const o=e.querySelector("[data-sve-html-tools]");!o||o._sveBound||(o._sveBound=!0,Ut(o,zi,{tools:ro.map(n=>({...n,icon:Wn[n.id]||""})),onTool:n=>{const s=ro.find(i=>i.id===n),r=o.querySelector(`[data-sve-html-tool="${n}"]`);if(s){if(s.menu==="heading"){un(t,r,Lr);return}if(s.menu==="text"){un(t,r,Xr);return}if(s.tidy){Cs();return}if(s.menu==="component"){Hl(t,r);return}if(x(t.document),s.snippet){At(s.snippet,s.caret??s.snippet.length,s.select),I();return}As(s.tag)}}}),jd(t,e),Wd(t,e),Rd(t,e))}C("dock:save-now",()=>(W(a.lastWin?.document),!0));let ie=null;async function yd(t){const e=t.document;Jd(e);let o=e.getElementById(u);if(o&&!(o.querySelector('[data-sve-css-chrome="subrow-2"]')&&o.querySelector("[data-sve-css-add-class]")&&o.querySelector("[data-sve-html-tools]")&&o.querySelector("[data-sve-html-tidy]")&&o.querySelector("[data-sve-data-vars]")&&o.querySelector("[data-sve-visual-edit-tools]")&&o.querySelector("[data-sve-html-scope]")&&o.querySelector("[data-sve-code-lock]")&&o.querySelector("[data-sve-code-back]")&&o.querySelector("[data-sve-code-autosave]")&&o.querySelector("[data-sve-code-save]")&&o.getAttribute("data-sve-code-chrome")==="scope-9")){for(const s of ot)g[s]?.destroy(),g[s]=null;o.remove(),o=null}if(!o){o=e.createElement("div"),o.id=u,o.setAttribute("data-sve-code-chrome","scope-9"),ta(o,ea(t)),Ut(o,Ei,{htmlLabel:p(t,"code_dock_html"),cssLabel:p(t,"code_dock_css"),jsLabel:p(t,"code_dock_js"),alpineLabel:p(t,"code_dock_alpine"),treeIcon:Er,dataIcon:vu,dataLabel:p(t,"data_vars_title")}),Ue(e,o),$n(o),or(o,Js(t)),ru(t,o),iu(t,o),au(t,o),pd(t,o),Nl(t,o),hd(t,o),cd(t,o),ld(t,o),oa(t,o),vd(t,o),an(t,o),sn(t,o),Cn(t,o),rn(t,o);for(const n of ot){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);Qc(s)}na(t)}if(Ue(e,o),$n(o),gd(t,o),an(t,o),sn(t,o),Cn(t,o),rn(t,o),ou(t),Fo(t),Ct(t),q(t),Vt(t),st(t),Eo(t),Nt(t),await cu(),!g.html){for(const n of ot){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);s?.replaceChildren(),Jc(t,n,s)}for(const n of["html","css"])g[n]&&Ma(t,g[n],{onOpen:s=>bs(t,s),emptyLabel:p(t,"code_dock_partials_empty"),openLabel:s=>p(t,"component_open_named",{name:s}),sectionValues:()=>ys(t),isLocked:()=>dt(),setHover:(s,r)=>a.htmlPartialUi?.setHover(s,r)});Qa(t,g.html,{onRename:n=>Ll(t,n),isLocked:()=>dt(),setHover:(n,s)=>a.htmlClassTokenUi?.setHover(n,s),title:p(t,"code_dock_css_rename_class")})}return o}function Vs(t){return ie||(ie=yd(t).finally(()=>{ie=null})),ie}async function Sn(t,e){const o=await Vs(t);a.lastType=e,a.lastLocked=!0,a.lockReady=!0,a.lastParts={html:"",css:"",js:""},Le(),Ct(t),Zt(a.lastParts,!0),rr(t.document,e),O(t.document,p(t,"code_dock_missing")),q(t),Vt(t),st(t),qt(t,o)}async function Wt(t,e,o="replace"){o==="replace"?a.typeStack=[]:o==="push"&&a.lastType&&a.lastType!==e&&a.typeStack.push(a.lastType);const n=++a.loadGen;a.lastType=e,a.lockReady=!1,Le(),O(t.document,p(t,"code_dock_loading"));let s=()=>{};a.loadInFlight=new Promise(i=>{s=i});const r=await Vs(t);Ct(t),q(t),Vt(t),st(t),Eo(t),Nt(t),qt(t,r),t.fetch(`/!/sve/section-template?type=${encodeURIComponent(e)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async i=>{if(n!==a.loadGen)return;if(i.status===404){Sn(t,e);return}if(!i.ok)throw new Error(String(i.status));const l=await i.json();n===a.loadGen&&(a.lastParts={html:typeof l.html=="string"?l.html:"",css:typeof l.css=="string"?l.css:"",js:typeof l.js=="string"?l.js:""},a.lastProps=Array.isArray(l.props)?l.props:[],a.propsDirty=!1,a.lastType=e,a.lastLocked=!!l.locked,a.lockReady=!0,$l(),typeof l.tw=="string"&&l.tw!==""&&Cl(a.lastParts.html,l.tw),Ct(t),Zt(a.lastParts,a.lastLocked),qn(t),a.lastLocked||ms(t,a.lastParts.html),rr(t.document,l.path||e),O(t.document,a.lastLocked?p(t,"code_dock_locked"):""),l.writable?.template===!1?O(t.document,p(t,"code_dock_not_writable")):l.writable?.tw===!1&&O(t.document,p(t,"code_dock_tw_not_writable")),us(t),Oi(t),vo(t),q(t),Vt(t),st(t),qt(t,r))}).catch(()=>{n===a.loadGen&&(Sn(t,e),O(t.document,p(t,"code_dock_error")))}).finally(()=>{n===a.loadGen&&(a.loadInFlight=null),s()})}function xt(){return a.lastType||""}function Us(t){return!!t?.getElementById(u)}function dt(){return a.lastLocked}function bd(t,e){const o=typeof e?.html=="string"?e.html.trim():"",n=typeof e?.css=="string"?e.css.trim():"",s=typeof e?.js=="string"?e.js.trim():"";if(!o&&!n&&!s||!t?.document?.getElementById(u))return!1;let r=!1;return o&&(r=xd("html",o)||r),n&&(r=_n("css",n)||r),s&&(r=_n("js",s)||r),r&&J(t),r}function xd(t,e){const o=g[t];if(!o||o.state.readOnly)return!1;const n=o.state.selection.main,s=n.from>0?o.state.doc.sliceString(n.from-1,n.from):`
`,r=n.to<o.state.doc.length?o.state.doc.sliceString(n.to,n.to+1):`
`,c=`${s===`
`?"":`
`}${e}${r===`
`?"":`
`}`;return o.dispatch({changes:{from:n.from,to:n.to,insert:c},selection:{anchor:n.from+c.length}}),!0}function _n(t,e){const o=g[t];if(!o||o.state.readOnly)return!1;const n=o.state.doc.length,r=`${n>0&&o.state.doc.sliceString(Math.max(0,n-1),n)!==`
`?`

`:n?`
`:""}${e}
`;return o.dispatch({changes:{from:n,insert:r},selection:{anchor:n+r.length}}),!0}function kd(t){if(pe(t),!a.lastType||!t.document.getElementById(u))return;const e=a.lastType;a.lastType=null,Wt(t,e,"keep")}function eo(t){R(t),a.loadGen+=1,W(t),a.lastUid=null,a.lastType=null,a.typeStack=[],a.lastParts={html:"",css:"",js:""},a.lastLocked=!1,a.lockReady=!1,a.lastBracketNames=null,a.lastCssSelectorNames=null,Le(),a.lastWin=t?.defaultView||a.lastWin,x(t),Rn(t),tt(t),t?.getElementById(V)?.remove();for(const o of ot)g[o]?.destroy(),g[o]=null;t?.getElementById(u)?.remove(),eu(),t&&Io(t,0);const e=t?.defaultView||a.lastWin;e?.document.getElementById(In)&&Fn(e),e&&(us(e),vo(e),qn(e))}function Sd(t){if(a.dragging)return;const e=t.document.getElementById(u);e&&(Fo(t),qt(t,e))}function wn(t,e,o){if(o){const r=Wo(o,e)||Wo(o,t.document)||o;return String(typeof je=="function"&&(je(r,e)||je(r,t.document))||"").trim()}const n=typeof gt=="function"?gt(t):"page_sections",s=typeof z=="function"?z(t.document):[];for(const r of s){const l=(nt(r.values)||r.values)?.[n];if(Array.isArray(l))for(const c of l){const d=typeof c?.type=="string"?c.type.trim():"";if(d)return d}}return""}function Ks(t){if((t.Statamic?.$config?.get?.("sveFeatures")||{}).collection_templates!==!0)return"";const o=t.Statamic?.$config?.get?.("sveCollectionTemplatesCollection")||"templates";if(!(t.location?.pathname||"").includes(`/collections/${o}/entries/`))return"";const s=typeof z=="function"?z(t.document):[];for(const r of s){const i=nt(r.values)||r.values,l=typeof i?.view=="string"?i.view.trim():"";if(!l||l.includes(".."))continue;const c=l.replace(/\.(antlers\.html|blade\.php)$/i,"").replace(/^\/+|\/+$/g,"");if(c)return`view:${c}`}return""}function Gs(t,e,o){const n=t.Statamic?.$config?.get?.("sveChromeTemplates")||{},s=n[e]&&typeof n[e].type=="string"?n[e]:null,r=t.Statamic?.$config?.get?.("sveChromeStyles")||{},i=`${e}/${typeof r[e]=="string"&&r[e]!==""?r[e]:"style_1"}`,l=s?.type||i,c=o?.[`${e}_style`];return(!s||s.styled)&&typeof c=="string"&&c!==""?`${e}/${c}`:l}function _d(t,e){const o=sa||ra;return o!=="header"&&o!=="footer"||!On(e)&&!Pn(e)?"":Gs(t,o,nt(Jr()?.values)||{})}function wd(t){const e=typeof gt=="function"?gt(t):"page_sections",o=typeof z=="function"?z(t.document):[];for(const n of o){const r=(nt(n.values)||n.values)?.[e];if(Array.isArray(r)&&r.length)return!0}return!1}function $d(t,e){if(!e||String(e).startsWith("view:")||ps(t,e))return!1;const o=typeof gt=="function"?gt(t):"page_sections",n=typeof z=="function"?z(t.document):[];for(const s of n){const i=(nt(s.values)||s.values)?.[o];if(Array.isArray(i)&&i.some(l=>l?.type===e))return!0}return!1}function Cd(t){const e=Qr(t);if(!e)return"";const o=["header","footer"].find(n=>e.querySelector(`[data-sve-chrome="${n}"]`));return o?Gs(t,o,null):""}function Ad(t){const e=Dn(t)||t.getElementById("__sve-global-section-host");return e&&e.querySelector("[data-replicator-set][data-type]")?.getAttribute("data-type")||""}function Ju(t,e,o){if(a.dragging)return;if(!t||!e||Kd(e)||!Zr(t)||!Yr(t)){e&&eo(e);return}const n=_d(t,e)||Ad(e)||wn(t,e,o)||Ks(t)||(o?"":a.lastType),s=!n&&!o&&!wd(t)?Cd(t):"",r=n||s,i=!!(o&&o!==a.lastUid);if(a.onEmptyPage=!!s,a.lastWin=t,o&&(a.lastUid=o),!r){if(a.lastType&&!On(e)&&!Pn(e)&&!Dn(e)&&!$d(t,a.lastType)){const l=wn(t,e,null);a.lastUid=null,l?(W(e),Wt(t,l,"replace")):eo(e)}return}if(!(r===a.lastType&&e.getElementById(u))){if(a.typeStack.length&&a.lastType&&a.lastType!==r){const l=a.typeStack[0];if(r===l&&!i)return;a.typeStack=[]}W(e),Wt(t,r,"replace")}}be("tw:changed",()=>{a.lastWin&&a.styleMode==="tw"&&L(a.lastWin)});C("dock:is-open",t=>Us(t));C("dock:is-locked",()=>dt());C("dock:html",()=>Lt());C("dock:reveal-html",({from:t,to:e,caret:o}={})=>{const n=g.html;if(!n||t==null)return;a.htmlScopePref=Kt(a.lastWin),Ae(),at();const s=a.htmlFull.length,r=Math.max(0,Math.min(t,s)),i=Math.max(r,Math.min(e??t,s));a.htmlFocus=i>r?{from:r,to:i}:null;const l=o==null?null:Math.max(0,Math.min(o,s));if(a.htmlScopePref&&a.htmlFocus){_o(l),q(a.lastWin);return}if(a.htmlScopeActive){wo(!0,l),q(a.lastWin);return}n.dispatch({selection:l==null?{anchor:r,head:i}:{anchor:l},scrollIntoView:!0}),n.focus()});C("dock:insert-snippet",({win:t,parts:e})=>bd(t,e));C("dock:refresh",t=>kd(t));C("dock:tw-follow",()=>{a.lastWin&&te(a.lastWin)});C("dock:css",()=>(at(),a.cssFull));C("dock:set-css",t=>typeof t!="string"||dt()||!g.css||!a.lastWin?!1:(at(),a.cssFull=t,Me("css",Ts()),J(a.lastWin),!0));C("dock:data-menu",({anchor:t,onPick:e,at:o}={})=>!t||!a.lastWin?!1:(R(a.lastWin.document),x(a.lastWin.document),Xs(a.lastWin,t,e,o),!0));C("dock:props",()=>a.lastProps.map(t=>({...t})));C("dock:set-props",({win:t,props:e}={})=>!Array.isArray(e)||dt()?!1:(a.lastProps=e,a.propsDirty=!0,Ea(ee(xt())),W((t||a.lastWin)?.document),!0));function ee(t){const e=/^view:partials\/(components\/[A-Za-z0-9_-]+)$/.exec(String(t||""));return e?e[1]:""}C("dock:component-src",()=>ee(xt()));C("dock:type-stack",()=>a.typeStack.map(t=>({type:t,src:ee(t)})));C("dock:component-exit-state",()=>{const t=ee(xt());return{open:!!t,name:t?t.split("/").pop():"",back:a.typeStack.length>0}});C("dock:exit-component",(t=1)=>{if(!a.lastWin||!ee(xt()))return!1;if(a.typeStack.length){for(let e=Number(t)||1;e>1&&a.typeStack.length>1;e-=1)a.typeStack.pop();xs(a.lastWin)}else eo(a.lastWin.document);return!0});C("dock:current-type",()=>xt());C("dock:on-empty-page",()=>!!a.onEmptyPage);C("dock:current-uid",()=>a.lastUid);C("dock:save-settled",()=>a.saveInFlight||null);C("dock:load-settled",()=>a.loadInFlight||null);C("dock:reset-data-vars",t=>(ei(typeof t=="string"&&t?t:void 0),!0));C("dock:refresh-preview",()=>a.lastWin?(pe(a.lastWin),!0):!1);C("dock:open-template",t=>typeof t!="string"||!t||!a.lastWin?!1:(bs(a.lastWin,t),!0));C("dock:set-html",t=>{if(typeof t!="string"||dt())return!1;const e=g.html;if(!e||!a.lastWin)return!1;if(t===""){a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null),a.twDirty=!1,a.twCss=null,a.twKey="",a.lastType=null,a.lastUid=null,a.lastParts={html:"",css:"",js:""},a.cssFull="",a.htmlFull="",a.applying=!0;try{Le();for(const s of ot){const r=g[s];if(!r)continue;const i=r.state.doc.toString();i!==""&&r.dispatch({changes:{from:0,to:i.length,insert:""}})}}finally{a.applying=!1}return!0}const o=a.htmlFull;if(a.htmlFull=t,a.htmlScopeActive)return a.htmlFocus=Td(a.htmlFocus,o,t),Ee(_s()),J(a.lastWin),lo("dock:html-changed"),!0;const n=e.state.doc.toString();if(n!==t){const[s,r,i]=vs(n,t);e.dispatch({changes:{from:s,to:r,insert:i}})}return!0});C("dock:show-empty",()=>mt("dock:set-html",""));be("row:removed",({parentPath:t,remaining:e,win:o})=>{e===0&&t===gt(o)&&mt("dock:show-empty")});function Td(t,e,o){const n=o.length-e.length;if(!t||!n)return t;let s=0;for(;s<e.length&&s<o.length&&e[s]===o[s];)s+=1;return s>=t.to?t:s<t.from?{from:Math.max(0,t.from+n),to:Math.max(0,t.to+n)}:{from:t.from,to:Math.max(t.from,t.to+n)}}const Tt="__sve-data-menu";let ge=null;function R(t){const e=t?.getElementById(Tt);ge?.(),ge=null,e?._sveApp?.unmount(),e?.remove(),t?.querySelectorAll("[data-sve-data-vars][data-open], [data-sve-antlers-btn][data-open], [data-sve-visual-edit-btn][data-open]").forEach(o=>o.removeAttribute("data-open"))}function Md(t){if(!Ks(t))return{view:"",kind:""};const e=typeof z=="function"?z(t.document):[];for(const o of e){const n=nt(o.values)||o.values,s=typeof n?.source_collection=="string"?n.source_collection.trim():"";if(s)return{view:s,kind:String(n?.kind||"").trim()}}return{view:"",kind:""}}function Ed(t,e){const o=Lt();if(Number.isFinite(e))return Uo(o,e);const n=g.html;if(!n)return[];const s=a.htmlScopeActive&&a.htmlFocus?a.htmlFocus.from:0;return Uo(o,s+n.state.selection.main.from)}function Ld(t,e){const{view:o,kind:n}=Md(t);return{collection:ns(t)||"",set:ss(xt()),view:o,kind:n,scope:ti(Ed(t,e))}}function Bd(t){const e=typeof z=="function"?z(t.document):[];for(const o of e){const n=nt(o.values)||o.values;if(n&&typeof n=="object")return n}return null}function Fd(t,e){return{scope:e?.scope?.groups||[],section:is(e?.section||[],ys(t)),page:si(e?.page||[],Bd(t)),site:e?.site||[]}}function Id(t){const e=t.state.selection.main,o=t.state.doc.lineAt(e.from),n=o.text.slice(0,e.from-o.from);return/(?:^|\s)(?::|x-bind:)[\w.:-]+\s*=\s*(["'])(?:(?!\1).)*$/.test(n)}function Od(t,e){const o=g.html;if(!o||o.state.readOnly)return;if(Id(o)){const c=String(t?.var||"").trim(),d=o.state.selection.main;o.dispatch({changes:{from:d.from,to:d.to,insert:c},selection:{anchor:d.from+c.length}}),I();return}const n=ri(t,e);if(!n)return;const s=o.state.selection.main,r=o.state.doc.lineAt(s.from),i=rt(r.text),l=uo(n.text,i);o.dispatch({changes:{from:s.from,to:s.to,insert:l},selection:{anchor:s.from+n.cursor+(n.text.includes(`
`)?i.length:0)}}),I()}function Dt(t,e,o){const n=e.getBoundingClientRect(),s=8,r=o.offsetWidth||368,i=o.offsetHeight||240,l=t.innerHeight-n.bottom-s,c=n.top-s,d=l>=i||l>=c?n.bottom+4:n.top-i-4;o.style.left=`${Math.max(s,Math.min(n.left,t.innerWidth-r-s))}px`,o.style.top=`${Math.max(s,Math.min(d,t.innerHeight-i-s))}px`}function Xs(t,e,o,n){const s=t.document;R(s),e.setAttribute("data-open","");const r=s.createElement("div");r.id=Tt,r.setAttribute("data-sve-data-menu",""),s.body.appendChild(r);const i=Ld(t,n),l=m=>[m?.scope?.groups?.length?{id:"scope",label:m.scope.label||p(t,"data_vars_tab_loop")}:null,{id:"section",label:p(t,"data_vars_tab_section")},{id:"page",label:p(t,"data_vars_tab_page")},{id:"site",label:p(t,"data_vars_tab_site")}].filter(Boolean),c=m=>{s.getElementById(Tt)&&(r._sveApp?.unmount(),r._sveApp=P(Vn,r,{title:p(t,"data_vars_title"),placeholder:p(t,"data_vars_placeholder"),emptyText:p(t,"data_vars_empty"),noSectionText:p(t,"data_vars_no_section"),loopText:p(t,"data_vars_loop"),tabs:l(m),data:Fd(t,m),onPick:(y,b)=>o?o(y,b):Od(y,b)}),Dt(t,e,r))};c(rs(go(i))||{scope:null,section:[],page:[],site:[]}),as(t,i).then(c),Dt(t,e,r);const d=()=>Dt(t,e,r),h=m=>{!r.contains(m.target)&&!e.contains(m.target)&&R(s)},f=m=>{m.key==="Escape"&&R(s)};s.addEventListener("pointerdown",h,!0),s.addEventListener("keydown",f,!0),t.addEventListener("scroll",d,!0),t.addEventListener("resize",d),ge=()=>{s.removeEventListener("pointerdown",h,!0),s.removeEventListener("keydown",f,!0),t.removeEventListener("scroll",d,!0),t.removeEventListener("resize",d)}}function Zs(t,e,{title:o,placeholder:n,tabs:s,data:r,onPick:i}){const l=t.document;R(l),x(l),e.setAttribute("data-open","");const c=l.createElement("div");c.id=Tt,c.setAttribute("data-sve-data-menu",""),l.body.appendChild(c),c._sveApp=P(Vn,c,{title:o,placeholder:n,emptyText:p(t,"data_vars_empty"),noSectionText:p(t,"data_vars_empty"),loopText:"",tabs:s,data:r,onPick:(d,h)=>{R(l),i(d,h)}}),Dt(t,e,c),Pd(t,e,c)}function Pd(t,e,o){const n=t.document,s=()=>Dt(t,e,o),r=l=>{!o.contains(l.target)&&!e.contains(l.target)&&R(n)},i=l=>{l.key==="Escape"&&R(n)};n.addEventListener("pointerdown",r,!0),n.addEventListener("keydown",i,!0),t.addEventListener("scroll",s,!0),t.addEventListener("resize",s),ge=()=>{n.removeEventListener("pointerdown",r,!0),n.removeEventListener("keydown",i,!0),t.removeEventListener("scroll",s,!0),t.removeEventListener("resize",s)}}const Dd='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/></svg>',zd='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 9 5 12 1.8-5.2L21 14Z"/><path d="M7.2 2.2 8 5.1"/><path d="m5.1 8-2.9-.8"/><path d="M14 4.1 12 6"/><path d="m6 12-1.9 2"/></svg>';function Ys(t,e,o,n,s){const r=t.document.createElement("button");return r.type="button",r.setAttribute(o,""),r.title=s,r.setAttribute("aria-label",s),r.innerHTML=`<span>${n}</span>`,r.addEventListener("mousedown",i=>i.preventDefault()),e.replaceChildren(r),r}function Hd(t){return String(t||"").replace(/\|/g,"").split(`
`)[0].trim()}function Rd(t,e){const o=e.querySelector("[data-sve-data-vars]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("mousedown",n=>n.preventDefault()),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),t.document.getElementById(Tt)){R(t.document);return}x(t.document),Xs(t,o)}))}function jd(t,e){const o=e.querySelector("[data-sve-antlers-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=Ys(t,o,"data-sve-antlers-btn",Dd,p(t,"code_dock_antlers"));n.addEventListener("click",s=>{if(s.preventDefault(),s.stopPropagation(),n.hasAttribute("data-open")){R(t.document);return}const r={};for(const i of Ko)r[i.id]=Oa.filter(l=>l.group===i.id).map(l=>({id:l.id,var:l.label,value:l.inline?"":Hd(l.snippet)}));Zs(t,n,{title:p(t,"code_dock_antlers"),placeholder:p(t,"code_dock_antlers_search"),tabs:Ko.map(i=>({id:i.id,label:p(t,i.lang)})),data:r,onPick:i=>Nd(i.id)})})}function Nd(t){const e=Pa(t),o=g.html;if(!e||!o||o.state.readOnly)return;const n=o.state.selection.main.head;if(e.inline){const c=e.snippet,d=o.state.selection.main;o.dispatch({changes:{from:d.from,to:d.to,insert:c},selection:{anchor:d.from+c.length}}),I();return}const s=o.state.doc.lineAt(n),r=s.text.trim()?rt(s.text):Ie(o,s)||rt(s.text),{text:i,cursor:l}=de(e.snippet);At(uo(i,r),l),I()}function Wd(t,e){const o=e.querySelector("[data-sve-visual-edit-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=Ys(t,o,"data-sve-visual-edit-btn",zd,p(t,"code_dock_visual_edit"));n.addEventListener("click",s=>{if(s.preventDefault(),s.stopPropagation(),n.hasAttribute("data-open")){R(t.document);return}const r={};for(const i of Jo)r[i.id]=ls.filter(l=>l.group===i.id).map(l=>({id:l.id,var:l.label,value:l.attr?l.attr.replace(/\|/g,""):""}));Zs(t,n,{title:p(t,"code_dock_visual_edit"),placeholder:p(t,"code_dock_visual_edit_search"),tabs:Jo.map(i=>({id:i.id,label:p(t,i.lang)})),data:r,onPick:i=>Vd(i.id)})})}function qd(t,e,o,n){if(li(o.inner,n.attr)){t.focus();return}const{text:s,cursor:r}=de(n.attr);let i=o.closeIdx;for(;i>o.openIdx+2&&/\s/.test(e[i-1]);)i--;t.dispatch({changes:{from:i,to:o.closeIdx,insert:` ${s} `},selection:{anchor:i+1+r}}),I()}function Vd(t){const e=ai(t),o=g.html;if(!e||!o||o.state.readOnly)return;const n=o.state.doc.toString(),s=Xt();if(s?.open){const f=ii(n,s.open.from,s.open.to,se);if(f){e.attr?qd(o,n,f,e):(o.dispatch({selection:{anchor:f.openIdx+2+se.length}}),o.focus());return}const m=s.open.from+1+s.name.length,y=e.standalone||`{{ ${se} ${e.attr} }}`,{text:b,cursor:E}=de(y);o.dispatch({changes:{from:m,to:m,insert:` ${b}`},selection:{anchor:m+1+E}}),I();return}const r=o.state.selection.main.head,i=o.state.doc.lineAt(r),l=i.text.trim()?rt(i.text):Ie(o,i)||rt(i.text),c=e.standalone||`{{ ${se} ${e.attr} }}`,{text:d,cursor:h}=de(c);At(uo(d,l),h),I()}function Ud(t){return t==="css"?xr():t==="js"?kr():br({autoCloseTags:!0})}function $n(t){if(t._sveShield)return;t._sveShield=!0;const e=o=>o.stopPropagation();for(const o of["keydown","keypress","keyup","pointerdown","pointerup","mousedown","mouseup","click","focusin"])t.addEventListener(o,e)}function Kd(t){try{return new URLSearchParams(t.defaultView?.location?.search||"").has("sve-panel")}catch{return!1}}function Gd(t){const e=parseInt(G(t,wr)??"",10);return Number.isFinite(e)&&e>=Mr?e:fu}function Xd(t,e){j(t,wr,String(e))}function Js(t){try{const e=JSON.parse(G(t,$r)||"null");if(e&&typeof e=="object")return{html:e.html!==!1,css:e.css!==!1,js:e.js===!0,alpine:e.alpine===!0}}catch{}return{html:!0,css:!0,js:!1,alpine:!1}}function Zd(t,e){j(t,$r,JSON.stringify(e))}function Qs(t){try{const e=JSON.parse(G(t,Cr)||"null");if(e&&typeof e=="object"){const o=s=>Number.isFinite(s)&&s>0?s:1,n={};for(const s of yt)n[s]=o(e[s]);return n}}catch{}return Object.fromEntries(yt.map(e=>[e,1]))}function Yd(t,e){j(t,Cr,JSON.stringify(e))}function Jd(t){aa(t,uu,`
@keyframes sve-cm-wait { to { transform: rotate(360deg); } }
#${u} {
  /* The tree's seven families, for the marks and the toolbar below. */
  ${ia("dark")}
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
  ${qo("ns")}
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
  align-self: stretch;
  margin: -7px 0;
  padding-right: 8px;
  display: flex;
  align-items: stretch;
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
#${Tt} {
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
  ${qo("ew")}
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
#${ne} {
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
#${ne} [data-sve-partial-choice] {
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
#${ne} [data-sve-partial-choice]:hover {
  background: rgba(255,255,255,.1);
}
#${ne} [data-sve-partial-empty] {
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
`)}function Qd(t){const e=t.querySelector(".live-preview-editor");if(!e)return 0;const o=e.getBoundingClientRect();return o.width<40||o.right<40?0:Math.round(o.right)}function tu(t){let e=0;for(const o of["__sve-section-picker","__sve-outline-panel","__sve-html-tree-panel","__sve-listview-panel","__sve-right-dock","__sve-chrome-designs","__sve-global-section-panel","__sve-ai-panel"]){const n=t.getElementById(o);if(!n||n.hasAttribute("data-sve-chrome-hidden")||n.hasAttribute("data-sve-right-closed")||n.style.display==="none")continue;const s=n.getBoundingClientRect();s.width>40&&s.right>t.documentElement.clientWidth-8&&(e=Math.max(e,Math.round(s.width)))}return e}function Fo(t){const e=t.document;if(a.layoutWin=t,typeof t.ResizeObserver!="function")return;a.layoutObserver||(a.layoutObserver=new t.ResizeObserver(()=>{a.layoutWin&&Sd(a.layoutWin)}));const o=e.querySelector(".live-preview-editor"),n=e.getElementById("__sve-right-dock");o!==a.observedEditor&&(a.observedEditor&&a.layoutObserver.unobserve(a.observedEditor),a.observedEditor=o,o&&a.layoutObserver.observe(o)),n!==a.observedRight&&(a.observedRight&&a.layoutObserver.unobserve(a.observedRight),a.observedRight=n,n&&a.layoutObserver.observe(n))}function eu(){a.layoutObserver?.disconnect(),a.layoutObserver=null,a.layoutWin=null,a.observedEditor=null,a.observedRight=null}function ou(t){a.layoutWatchBound||(a.layoutWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>Fo(t)))}function Io(t,e){const o=t.querySelector(".live-preview-contents");o&&(o.style.paddingBottom=e?`${e}px`:"")}function Oo(t){if(!t)return;const e=t.clientHeight,o=t.querySelector("[data-sve-code-bar]"),n=t.querySelector("[data-sve-code-lock-banner]"),s=n&&nu(t)?.getComputedStyle(n).display!=="none"?n.offsetHeight:0,r=Math.max(64,e-(o?.offsetHeight||0)-s),i=t.querySelector("[data-sve-code-panes]");i&&(i.style.height=`${r}px`,i.style.minHeight="0",i.style.overflow="hidden"),t.querySelectorAll("[data-sve-code-host]").forEach(l=>{const c=l.closest("[data-sve-code-pane]");if(!c||c.style.display==="none")return;let d=0;for(const f of c.children)f!==l&&(d+=f.offsetHeight);const h=Math.max(64,r-d);l.style.height=`${h}px`,l.style.maxHeight=`${h}px`,l.style.minHeight="0",l.style.overflow="auto",su(l)})}function nu(t){return t.ownerDocument?.defaultView||a.lastWin}function su(t){t._sveWheelBound||(t._sveWheelBound=!0,t.addEventListener("wheel",e=>{const o=t.scrollHeight-t.clientHeight,n=t.scrollWidth-t.clientWidth;let s=!1;if(e.deltaY&&o>0){const r=Math.min(o,Math.max(0,t.scrollTop+e.deltaY));r!==t.scrollTop&&(t.scrollTop=r,s=!0)}if(e.deltaX&&n>0){const r=Math.min(n,Math.max(0,t.scrollLeft+e.deltaX));r!==t.scrollLeft&&(t.scrollLeft=r,s=!0)}s&&(e.preventDefault(),e.stopPropagation())},{passive:!1}))}function tr(){const t=(a.layoutWin||a.lastWin)?.document?.getElementById(u);t&&Oo(t);for(const e of ot)g[e]?.requestMeasure()}function er(t,e){const o=Js(t),n={};for(const s of yt){const r=e.querySelector(`[data-sve-code-pane-btn="${s}"]`);n[s]=r?r.getAttribute("aria-pressed")==="true":o[s]}return n}function or(t,e){for(const n of yt){const s=t.querySelector(`[data-sve-code-pane-btn="${n}"]`),r=t.querySelector(`[data-sve-code-pane="${n}"]`);s&&s.setAttribute("aria-pressed",e[n]?"true":"false"),r&&(r.style.display=e[n]?"flex":"none")}const o=yt.filter(n=>e[n]);t.querySelectorAll("[data-sve-code-split]").forEach(n=>{const s=n.getAttribute("data-sve-code-split-after"),r=o.indexOf(s);n.style.display=r>=0&&r<o.length-1?"block":"none"}),nr(t.ownerDocument.defaultView,t),Oo(t)}function nr(t,e){const o=Qs(t);for(const n of yt){const s=e.querySelector(`[data-sve-code-pane="${n}"]`);s&&(s.style.flex=`${o[n]} 1 0`)}}function qt(t,e){if(a.dragging)return;const o=t.document;Ue(o,e);const n=Gd(t),s=Qd(o),r=tu(o);e.style.left=`${s}px`,e.style.right=`${r}px`,e.style.bottom="0",e.style.height=`${n}px`,Io(o,n),Oo(e)}function sr(t,e,o,n){a.dragging=!0,la(t,e,o,()=>{a.dragging=!1,n?.()},"data-sve-code-drag-shield")}function ru(t,e){if(e._sveResizeBound)return;e._sveResizeBound=!0;const o=n=>{if(n.button!==0||n.target.closest('button, a, input, select, textarea, label, [role="button"], [contenteditable], .cm-editor'))return;n.preventDefault();const s=n.clientY,r=e.getBoundingClientRect().height;let i=r;sr(t,"ns-resize",l=>{i=Math.min(Math.max(Mr,r+(s-l.clientY)),Math.round(t.innerHeight*.7)),e.style.height=`${i}px`,Io(t.document,i),tr()},()=>{Xd(t,i),qt(t,e),t.dispatchEvent(new Event("resize"))})};e.querySelector("[data-sve-code-bar]")?.addEventListener("mousedown",o),e.querySelector("[data-sve-code-grip]")?.addEventListener("mousedown",o)}function au(t,e){e._sveSplitBound||(e._sveSplitBound=!0,e.querySelectorAll("[data-sve-code-split]").forEach(o=>{o.addEventListener("mousedown",n=>{if(n.button!==0)return;n.preventDefault(),n.stopPropagation();const s=o.getAttribute("data-sve-code-split-after"),r=yt.filter(E=>er(t,e)[E]),i=r.indexOf(s),l=r[i],c=r[i+1];if(!l||!c)return;const d=e.querySelector(`[data-sve-code-pane="${l}"]`),h=e.querySelector(`[data-sve-code-pane="${c}"]`),f=n.clientX,m=d.getBoundingClientRect().width,y=h.getBoundingClientRect().width,b=m+y;o.setAttribute("data-active",""),sr(t,"col-resize",E=>{const Ft=E.clientX-f;let ze=Math.max(Ve,Math.min(b-Ve,m+Ft)),zo=b-ze;b<Ve*2&&(ze=m,zo=y);const He=Qs(t);He[l]=ze,He[c]=zo,Yd(t,He),nr(t,e),tr()},()=>{o.removeAttribute("data-active")})})}))}function iu(t,e){e._svePaneBound||(e._svePaneBound=!0,e.querySelectorAll("[data-sve-code-pane-btn]").forEach(o=>{o.addEventListener("click",n=>{n.stopPropagation();const s=o.getAttribute("data-sve-code-pane-btn"),r=er(t,e),i={...r,[s]:!r[s]};!i.html&&!i.css&&!i.js&&(i[s]=!0),Zd(t,i),or(e,i)})}))}function O(t,e){const o=t.getElementById(u)?.querySelector("[data-sve-code-status]");o&&(o.textContent=e||"")}function rr(t,e){const o=t.getElementById(u)?.querySelector("[data-sve-code-path]");o&&(o.textContent=e||"",o.title=e||"")}function Vt(t){const e=t?.document?.getElementById(u)?.querySelector("[data-sve-code-back]");e&&(e.hidden=a.typeStack.length===0,e.title=p(t,"code_dock_back"),e.setAttribute("aria-label",e.title),e.innerHTML=gu)}function Cn(t,e){const o=e.querySelector("[data-sve-code-back]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),xs(t)}))}let D,oo,ar,ir,lr,ft,ve,kt,oe,St,_t,cr,dr,ur,fr,hr,pr,mr,gr,vr,yr,Po,br,xr,kr,Sr,no,so,_r,lu,Ot=null,w=null;function cu(){return Ot||(Ot=ua().then(t=>{w=t,D=w.view.EditorView,oo=w.view.keymap,ar=w.view.lineNumbers,ir=w.view.highlightActiveLine,lr=w.view.highlightActiveLineGutter,ft=w.state.Compartment,ve=w.state.EditorState,kt=w.state.StateField,oe=w.state.StateEffect,St=w.state.RangeSetBuilder,_t=w.view.Decoration,cr=w.commands.defaultKeymap,dr=w.commands.indentWithTab,ur=w.commands.historyKeymap,fr=w.commands.history,hr=w.autocomplete.autocompletion,pr=w.autocomplete.closeBrackets,mr=w.autocomplete.closeBracketsKeymap,gr=w.autocomplete.closeCompletion,vr=w.autocomplete.completionKeymap,yr=w.view.hoverTooltip,Po=w.langHtml.htmlLanguage,br=w.langHtml.html,xr=w.langCss.css,kr=w.langJs.javascript,w.language.HighlightStyle,w.language.syntaxHighlighting,Sr=w.language.codeFolding,no=w.language.foldEffect,so=w.language.unfoldEffect,_r=w.language.foldedRanges,lu=w.highlight.tags,zt.html=new ft,zt.css=new ft,zt.js=new ft,Ht.html=new ft,Ht.css=new ft,Ht.js=new ft}).catch(t=>{throw Ot=null,t}),Ot)}const du="{{ _class }}",u=ca,uu="__sve-code-dock-style",V="__sve-code-dock-unlock",wr="sve-code-dock-height",$r="sve-code-dock-panes",Cr="sve-code-dock-widths",De="sve-html-scope-v2",Ar="sve-code-dock-autosave",Tr="sve-code-dock-style-mode",Do="sve-code-dock-values",fu=280,Mr=120,Ve=140,hu=250,ot=["html","css","js"],yt=["html","css","alpine","js"],pu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',mu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-1"/></svg>',gu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',Er='<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1c0 .966.784 1.75 1.75 1.75h.418A1.74 1.74 0 0 0 4 7.25v1.5c0 .49.201.932.525 1.25c-.324.318-.525.76-.525 1.25v1c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 14 12.25v-1c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1.5c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1A1.75 1.75 0 0 0 12.25 2zm8.5 7.5H8v-3h4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75M7 6.5v3H5.75A.75.75 0 0 1 5 8.75v-1.5a.75.75 0 0 1 .75-.75zm1 4h4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75H8zm-1 0V13H5.75a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-1-5V3h6.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75zm-1 0H3.75A.75.75 0 0 1 3 4.75v-1A.75.75 0 0 1 3.75 3H5z"/></svg>',vu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/><path d="M4.5 11.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/></svg>',yu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 16.3A8.5 8.5 0 1 1 18.3 6.3"/><path d="M21 3.2v5.4h-5.4"/></svg>',bu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',xu='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',_="__sve-css-menu",Lr=["h1","h2","h3","h4","h5","h6"],ro=[{id:"section",title:"section",tag:"section"},{id:"div",title:"div",tag:"div"},{id:"heading",title:"heading",menu:"heading"},{id:"text",title:"text",menu:"text"},{id:"a",title:"link",tag:"a"},{id:"img",title:"image",snippet:'<img src="" alt="">',caret:10},{id:"video",title:"video",snippet:'<video src="" controls playsinline></video>',caret:12},{id:"svg",title:"svg",tag:"svg"},{id:"ul",title:"list",tag:"ul"},{id:"li",title:"list item",tag:"li"},{id:"component",title:"component",menu:"component"},{id:"loop",title:"loop",snippet:`{{ items }}

{{ /items }}
`,caret:3,select:5},{id:"if",title:"if",snippet:`{{ if true }}

{{ /if }}
`,caret:6,select:4}],ku=["--size-100","--size-200","--size-300","--size-400","--size-500","--size-600","--size-700","--size-800","--size-900","--gutter"],Su={"tw-text":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 13 5 3l3.5 10M2.7 10h4.6"/><path d="M12.5 3.5v9M11 5l1.5-1.5L14 5M11 11l1.5 1.5L14 11"/></svg>',"tw-leading":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h8.5M6 8h8.5M6 12.5h8.5"/><path d="M2.5 4.5v7M1.4 5.6 2.5 4.5l1.1 1.1M1.4 10.4l1.1 1.1 1.1-1.1"/></svg>',"tw-font":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.2V3h10v1.2M8 3v10M6 13h4"/></svg>',"tw-radius":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 13.5v-6a5 5 0 0 1 5-5h6"/><path d="M13.5 6.5v7h-7" stroke-dasharray="2 2"/></svg>',"tw-gap":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"tw-align":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3.5h12M2 8h8M2 12.5h10"/></svg>',"tw-w":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3.5v9M14 3.5v9"/><path d="M4.5 8h7"/><path d="M6 6.2 4.2 8 6 9.8M10 6.2 11.8 8 10 9.8"/></svg>',"tw-h":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 2h9M3.5 14h9"/><path d="M8 4.5v7"/><path d="M6.2 6 8 4.2 9.8 6M6.2 10 8 11.8 9.8 10"/></svg>',"tw-maxw":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3v10M14.5 3v10"/><path d="M5 8h6"/><path d="M6.6 6.2 4.8 8l1.8 1.8M9.4 6.2 11.2 8l-1.8 1.8"/></svg>',"tw-overflow":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="1.8" y="4.5" width="8.6" height="9.7" rx="1.2"/><path d="M6.5 1.8h7.7v7.7" stroke-linecap="round"/></svg>',"tw-border":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6"/><rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" stroke-width="1" opacity=".45"/></svg>'},_u='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="10" width="18" height="11" rx="2"/><rect x="6" y="3" width="9" height="4" rx="1.4" fill="currentColor" stroke="none"/></svg>',wu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.1 12a8.9 8.9 0 1 0 2.8-6.5L3 8"/><path d="M3 3.4V8h4.6"/><path d="M12 7.4V12l3 1.8"/></svg>',$u='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>',Cu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></svg>',Au='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/><path d="M3 17c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/></svg>',Br=[["--gray-50","#fafafa"],["--gray-100","#f5f5f5"],["--gray-200","#e5e5e5"],["--gray-300","#d4d4d4"],["--gray-400","#a3a3a3"],["--gray-500","#737373"],["--gray-600","#525252"],["--gray-700","#404040"],["--gray-800","#262626"],["--gray-900","#171717"],["--gray-950","#0a0a0a"]],An=t=>[{id:`${t}-all`,icon:"box-all",title:"All sides",css:t,tw:t},{id:`${t}-block`,icon:"box-block",title:"Top and bottom",css:`${t}-block`,tw:`${t}-block`,sep:!0},{id:`${t}-block-start`,icon:"box-block-start",title:"Top",css:`${t}-block-start`,tw:`${t}-top`},{id:`${t}-block-end`,icon:"box-block-end",title:"Bottom",css:`${t}-block-end`,tw:`${t}-bottom`},{id:`${t}-inline`,icon:"box-inline",title:"Left and right",css:`${t}-inline`,tw:`${t}-inline`,sep:!0},{id:`${t}-inline-start`,icon:"box-inline-start",title:"Left",css:`${t}-inline-start`,tw:`${t}-left`},{id:`${t}-inline-end`,icon:"box-inline-end",title:"Right",css:`${t}-inline-end`,tw:`${t}-right`}],Tu=[{id:"display-flex",twClass:"flex",icon:"display-flex",title:"Flex",kind:"display",value:"flex",css:"display"},{id:"flex-row",twClass:"flex-row",icon:"flex-row",title:"Direction: row",kind:"flexDir",value:"row",css:"flex-direction",sep:!0},{id:"flex-col",twClass:"flex-col",icon:"flex-col",title:"Direction: column",kind:"flexDir",value:"column",css:"flex-direction"},{id:"justify-start",twClass:"justify-start",icon:"justify-start",title:"Justify: start",css:"justify-content",value:"flex-start",when:"flex",sep:!0},{id:"justify-center",twClass:"justify-center",icon:"justify-center",title:"Justify: center",css:"justify-content",value:"center",when:"flex"},{id:"justify-end",twClass:"justify-end",icon:"justify-end",title:"Justify: end",css:"justify-content",value:"flex-end",when:"flex"},{id:"justify-between",twClass:"justify-between",icon:"justify-between",title:"Justify: between",css:"justify-content",value:"space-between",when:"flex"},{id:"justify-around",twClass:"justify-around",icon:"justify-around",title:"Justify: around",css:"justify-content",value:"space-around",when:"flex"},{id:"align-start",twClass:"items-start",icon:"align-start",title:"Align: start",css:"align-items",value:"flex-start",when:"flex",sep:!0},{id:"align-center",twClass:"items-center",icon:"align-center",title:"Align: center",css:"align-items",value:"center",when:"flex"},{id:"align-end",twClass:"items-end",icon:"align-end",title:"Align: end",css:"align-items",value:"flex-end",when:"flex"},{id:"align-stretch",twClass:"items-stretch",icon:"align-stretch",title:"Align: stretch",css:"align-items",value:"stretch",when:"flex"}],Mu=[{id:"gap-all",icon:"gap-all",title:"Both",css:"gap",tw:"gap",menu:"spacing"},{id:"gap-row",icon:"gap-row",title:"Between rows",css:"row-gap",tw:"row-gap",menu:"spacing",sep:!0},{id:"gap-col",icon:"gap-col",title:"Between columns",css:"column-gap",tw:"column-gap",menu:"spacing"}],Eu=[{id:"bd-all",icon:"bd-all",title:"All sides",css:"border-color",tw:"border-color",menu:"colors"},{id:"bd-block",icon:"bd-block",title:"Top and bottom",css:"border-block-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-top",icon:"bd-top",title:"Top",css:"border-block-start-color",tw:"border-top-color",menu:"colors"},{id:"bd-bottom",icon:"bd-bottom",title:"Bottom",css:"border-block-end-color",tw:"border-bottom-color",menu:"colors"},{id:"bd-inline",icon:"bd-inline",title:"Left and right",css:"border-inline-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-left",icon:"bd-left",title:"Left",css:"border-inline-start-color",tw:"border-left-color",menu:"colors"},{id:"bd-right",icon:"bd-right",title:"Right",css:"border-inline-end-color",tw:"border-right-color",menu:"colors"}],Lu=[{id:"rd-all",icon:"rd-all",title:"All corners",css:"border-radius",tw:"border-radius",menu:"values"},{id:"rd-tl",icon:"rd-tl",title:"Top left",css:"border-start-start-radius",tw:"border-top-left-radius",menu:"values",sep:!0},{id:"rd-tr",icon:"rd-tr",title:"Top right",css:"border-start-end-radius",tw:"border-top-right-radius",menu:"values"},{id:"rd-br",icon:"rd-br",title:"Bottom right",css:"border-end-end-radius",tw:"border-bottom-right-radius",menu:"values"},{id:"rd-bl",icon:"rd-bl",title:"Bottom left",css:"border-end-start-radius",tw:"border-bottom-left-radius",menu:"values"}],Fr=[{id:"display",title:"Display",css:"display",tw:"display",kids:Tu},{id:"absolute",title:"Position",css:"position",tw:"position",value:"absolute"},{id:"color",title:"Text color",css:"color",tw:"color",menu:"colors"},{id:"bg",title:"Background color",css:"background-color",tw:"background-color",menu:"colors"},{id:"padding",title:"Padding",css:"padding",tw:"padding",kids:An("padding")},{id:"margin",title:"Margin",css:"margin",tw:"margin",kids:An("margin")},{id:"tw-text",title:"Font size",css:"font-size",tw:"font-size",menu:"values"},{id:"tw-leading",title:"Line height",css:"line-height",tw:"line-height",menu:"values"},{id:"tw-font",title:"Font family",css:"font-family",tw:"font-family",menu:"values"},{id:"tw-align",title:"Text align",css:"text-align",tw:"text-align",menu:"choices",choices:["left","center","right","justify"]},{id:"tw-border",title:"Border color",css:"border-color",tw:"border-color",kids:Eu},{id:"tw-radius",title:"Radius",css:"border-radius",tw:"border-radius",kids:Lu},{id:"tw-gap",title:"Gap",css:"gap",tw:"gap",kids:Mu},{id:"tw-w",title:"Width",css:"width",tw:"width",menu:"sizes"},{id:"tw-h",title:"Height",css:"height",tw:"height",menu:"sizes"},{id:"tw-maxw",title:"Max width",css:"max-width",tw:"max-width",menu:"sizes"},{id:"tw-overflow",title:"Overflow",css:"overflow",tw:"overflow",menu:"choices",choices:["visible","hidden","clip","auto","scroll"]}],Bu=["100%","auto","fit-content","min-content","max-content","100vw","100dvh","0"],ye=new Map;for(const t of Fr){ye.set(t.id,{tool:t,kid:null});for(const e of t.kids||[])ye.set(e.id,{tool:t,kid:e})}const Tn={display:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2.5" width="13" height="11" rx="1.2"/><path d="M5 6.5h6M5 9.5h4"/></svg>',"display-flex":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="3.4" height="9" rx=".4"/><rect x="6.3" y="3.5" width="3.4" height="9" rx=".4"/><rect x="10.6" y="3.5" width="3.4" height="9" rx=".4"/></svg>',"flex-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12"/><path d="M4.2 5.8 2 8l2.2 2.2"/><path d="M11.8 5.8 14 8l-2.2 2.2"/></svg>',"flex-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v12"/><path d="M5.8 4.2 8 2l2.2 2.2"/><path d="M5.8 11.8 8 14l2.2-2.2"/></svg>',"justify-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="5.4" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4.6" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="8.2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-between":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-around":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"align-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="5.4" width="9" height="2.4" rx=".4"/></svg>',"align-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="4.6" width="9" height="2.4" rx=".4"/><rect x="3.5" y="9" width="9" height="2.4" rx=".4"/></svg>',"align-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="8.2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="11.6" width="9" height="2.4" rx=".4"/></svg>',"align-stretch":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx=".5"/><rect x="9" y="2" width="4" height="12" rx=".5"/></svg>',absolute:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>',color:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.4 11.2 7.4 2.4l4 8.8"/><path d="M4.7 8.4h5.4"/><rect x="1.6" y="12.8" width="12.8" height="2.2" rx=".6" fill="currentColor" stroke="none"/></svg>',bg:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 1.9a6.1 6.1 0 1 0 0 12.2c.85 0 1.35-.55 1.35-1.25 0-.38-.18-.66-.4-.88a1.2 1.2 0 0 1 .85-2.05h1.3A3.5 3.5 0 0 0 14.1 6.1C14.1 3.75 11.4 1.9 8 1.9Z"/><circle cx="4.9" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="8" cy="4.8" r=".95" fill="currentColor" stroke="none"/><circle cx="11.1" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="4.7" cy="9.9" r=".95" fill="currentColor" stroke="none"/></svg>',padding:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/></svg>',margin:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/><path d="M2 2.5h12M2 13.5h12M2.5 2v12M13.5 2v12" stroke-dasharray="1.4 1.2"/></svg>',"box-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".4" fill="currentColor" stroke="none"/></svg>',"box-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"gap-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"gap-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="3" y="1.6" width="10" height="4.2" rx=".6"/><rect x="3" y="10.2" width="10" height="4.2" rx=".6"/><path d="M4.5 8h7"/></svg>',"gap-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"bd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4"/></svg>',"bd-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-top":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-bottom":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-left":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-right":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"rd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="3.4"/></svg>',"rd-tl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6H6a3.4 3.4 0 0 0-3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M2.6 9V6A3.4 3.4 0 0 1 6 2.6h3" stroke-width="2.2"/></svg>',"rd-tr":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6h7.4a3.4 3.4 0 0 1 3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M7 2.6h3A3.4 3.4 0 0 1 13.4 6v3" stroke-width="2.2"/></svg>',"rd-br":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6v7.4a3.4 3.4 0 0 1-3.4 3.4H2.6" stroke-width="1" opacity=".35"/><path d="M13.4 7v3a3.4 3.4 0 0 1-3.4 3.4H7" stroke-width="2.2"/></svg>',"rd-bl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6v7.4a3.4 3.4 0 0 0 3.4 3.4h7.4" stroke-width="1" opacity=".35"/><path d="M2.6 7v3A3.4 3.4 0 0 0 6 13.4h3" stroke-width="2.2"/></svg>'},g={html:null,css:null,js:null},zt={html:null,css:null,js:null},Ht={html:null,css:null,js:null};export{ef as ARMED_KEY,yu as AUTOSAVE_ICON,Ar as AUTOSAVE_KEY,gu as BACK_ICON,xu as CSS_ADD_ICON,Br as CSS_GRAYS,Bu as CSS_LENGTHS,_ as CSS_MENU_ID,$u as CSS_MODE_ICON,Lo as CSS_SIZE_KEY,ku as CSS_SPACING,Bo as CSS_STATES,to as CSS_STATE_KEY,Fr as CSS_TOOLS,Tn as CSS_TOOL_ICONS,ye as CSS_TOOL_INDEX,vu as DATA_ICON,Tt as DATA_MENU_ID,fu as DEFAULT_HEIGHT,u as DOCK_ID,_t as Decoration,ve as EditorState,D as EditorView,ot as HANDLES,wr as HEIGHT_KEY,wu as HISTORY_ICON,Lr as HTML_HEADINGS,ro as HTML_TOOLS,Cu as ID_MODE_ICON,pu as LOCK_CLOSED_ICON,mu as LOCK_OPEN_ICON,Mr as MIN_HEIGHT,Ve as MIN_PANE,yt as PANES,$r as PANES_KEY,St as RangeSetBuilder,bu as SAVE_ICON,hu as SAVE_MS,du as SCOPE_CLASS,Er as SCOPE_ICON,De as SCOPE_KEY,_u as STRIP_ICON,uu as STYLE_ID,Tr as STYLE_MODE_KEY,oe as StateEffect,kt as StateField,Au as TW_MODE_ICON,Su as TW_TOOL_ICONS,V as UNLOCK_ID,Do as VALUES_MODE_KEY,Cr as WIDTHS_KEY,Jt as applyCssFolds,Gt as applyCssScope,Xl as applyDisplay,Gl as applyFlexDirection,As as applyHtmlTag,K as applyRuleDecls,qs as applyStyleMode,hr as autocompletion,xo as autosaveEnabled,jd as bindAntlersSnippets,rn as bindAutosave,Cn as bindBack,Nl as bindCssAddClass,pd as bindCssTools,Rd as bindDataVars,cd as bindHistory,an as bindHtmlScope,gd as bindHtmlTidy,vd as bindHtmlTools,ou as bindLayoutWatch,sn as bindLock,iu as bindPaneToggles,ru as bindResize,au as bindSplitters,ld as bindStrip,hd as bindStyleMode,Wd as bindVisualEditSnippets,Le as clearHtmlScopeRange,pr as closeBrackets,mr as closeBracketsKeymap,eo as closeCodeDock,Zu as closeCodeDockPopups,gr as closeCompletion,x as closeCssMenu,R as closeDataMenu,w as cm,Yu as codeDockStyleMode,Sr as codeFolding,Ks as collectionViewType,vr as completionKeymap,xr as css,Ts as cssEditorText,Fe as cssRuleAtCursor,Rs as cssSizeRow,ut as cssSizeRows,Pe as cssStateSuffix,Z as currentFlexDecls,Lt as currentFullHtml,ys as currentSectionValues,xt as currentTemplateType,cr as defaultKeymap,ht as dispatchHtmlChanges,Ht as editableOf,g as editors,Jd as ensureStyle,ms as ensureTwCss,Ws as enterValuesRule,I as finishHtmlEdit,Tl as flushBracketSync,at as flushCssScope,Ml as flushCssToHtml,W as flushSave,no as foldEffect,_r as foldedRanges,xs as goBackTemplate,ir as highlightActiveLine,lr as highlightActiveLineGutter,fr as history,ur as historyKeymap,yr as hoverTooltip,br as html,_s as htmlEditorText,Xt as htmlElementAtCursor,Ce as htmlFocusOk,Po as htmlLanguage,Kt as htmlScopeEnabled,bt as htmlTargetFromCursor,Id as inDynamicAttribute,Ie as indentFromPrevious,dr as indentWithTab,bd as insertAiSnippet,At as insertHtmlSnippet,ps as isChromeTemplateType,Yr as isCodeDockArmed,dt as isCodeDockLocked,Us as isCodeDockOpen,Kd as isPanelFrame,kr as javascript,oo as keymap,Ud as languageOf,pt as leadingCssIndent,rt as lineIndentOf,ar as lineNumbers,cu as loadCm,Wt as loadTemplate,Jc as mountEditor,js as newSizeBlockSpot,Qe as newSizeQuery,F as normalizeFlexValue,Fo as observeDockLayout,J as onEditorInput,Ql as openCssChoiceMenu,Jl as openCssColorMenu,tc as openCssSpacingMenu,pn as openCssValueMenu,Xs as openDataVarsMenu,Hl as openHtmlComponentMenu,un as openHtmlTagMenu,bs as openNestedTemplate,Zs as openPickerMenu,Ll as openRenameClassMenu,Oe as paintAlpine,st as paintAutosave,Vt as paintBack,Qt as paintCssHead,To as paintCssIdMark,L as paintCssToolState,Qc as paintHostWait,q as paintHtmlScope,Be as paintHtmlToolState,Ct as paintLock,or as paintPaneButtons,Nt as paintStrip,Eo as paintStyleMode,Mo as paintValuesMode,H as placeCssMenu,qt as placeDock,Io as previewBottomPad,Cl as primeTailwindCompile,zt as readOnlyOf,$o as readParts,kd as refreshCodeDockFromDisk,pe as refreshPreview,Sd as relayoutCodeDock,Te as rememberBracketNames,Bt as rememberCssSelectors,$l as resetTailwindCompile,Co as sameParts,of as setCodeDockArmed,rr as setPath,O as setStatus,ud as setValuesMode,$n as shieldDock,wo as showHtmlFull,_o as showHtmlScope,eu as stopObservingDockLayout,Js as storedPanes,Ju as syncCodeDock,Ge as syncHtmlTree,Ae as syncScopedHtml,te as syncTwTarget,lu as tags,Zr as templateDockAllowed,Cs as tidyHtmlPane,so as unfoldEffect,Me as writeHandleEditor,Ee as writeHtmlEditor,Zt as writeParts};
