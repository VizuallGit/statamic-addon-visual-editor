const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-AWaJHJyk.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{H as Jo,ab as xn,X as ar}from"./ai-text-icon-Bmdp12LF.js";import{v as rr,l as ir}from"./codemirror-Wzfmc9-J.js";import{o as k,k as _,l as b,m as A,B as lr,a as ae,D as Qo,E as At,F as H,n as re,G as L,w as es,h as kn,u as w,H as Yt,x as j,_ as ts,q as cr,t as m,I as io,J as dr,K as ur,j as Jt,L as fr,M as lo,O as hr,c as X,P as q,A as pr,C as mr,z as ns,Q as gr,R as co,S as vr,T as U,U as pe,V as uo,W as yr,y as z,X as _n,Y as os,Z as br,$ as xr,g as Sn,a0 as kr,a1 as Qe,b as wn,a2 as _r,a3 as Sr,a4 as wr,a5 as $r,a6 as $n,a7 as Cn,a8 as ss,a9 as Ge,aa as Cr,ab as fo,ac as Qt,ad as Tr,ae as Ar,af as Mr,ag as rn,ah as Er,ai as Lr,aj as as,ak as rs,al as T,i as Br,am as Fr,an as ho,ao as Ir}from"./addon-DwjOoe37.js";import{ap as Yf,aq as Jf}from"./addon-DwjOoe37.js";import{p as Tn,c as is,r as ls,f as cs,h as Or,t as ds,a as Pr,b as us,d as Dr,e as zr,g as jr,i as Hr,j as po,k as Rr,l as Wr,m as fs,n as Nr,o as qr,q as Vr,s as Ur,u as Kr,v as Gr,w as hs,x as Xr,y as ln,z as Zr,H as ps,A as Yr,B as Jr,C as An,D as Qr,E as ei,F as ti,_ as ms,G as mo,P as ct}from"./tw-classes-CSESHcrn.js";import{M as gs,S as vs}from"./protocol-Brvy2KuB.js";import{t as ni}from"./tw-candidates-wYTeDvRv.js";import{h as oi,a as si,e as ai,A as go,b as ri,i as Mn,c as ii,d as vt}from"./html-tag-sync-d11C5bRZ.js";import"./index-Dpuj8sxX.js";import"./index-B5fiB6ig.js";import"./index-QkwZ_wP2.js";import"./index-CY0AOW5Y.js";import"./index-gYg9gdv3.js";import"./index-lzvKgifK.js";import"./index-BBw1nzv2.js";import"./index-DqbOpr3Y.js";import"./index-C_pm8ee_.js";import"./index-B8kpdD8S.js";const ys=/^\.[a-zA-Z_][\w-]*$/;function Mt(e){const t=String(e||""),n=/(^|\s)\[/g;let o;for(;o=n.exec(t);){const s=o.index+o[1].length,a=/\](?=\s|$)/g;a.lastIndex=s+1;const i=a.exec(t);if(i)return{from:s,to:i.index+1,innerFrom:s+1,innerTo:i.index}}return null}function bs(e){const t=String(e||""),n=Mt(t);return n?t.slice(n.innerFrom,n.innerTo).replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).filter(o=>/^[a-zA-Z_][\w-]*$/.test(o)):[]}function xs(e){const t=String(e||"").match(/\sclass\s*=\s*(["'])([^"']*)\1/i);return t?bs(t[2]):[]}function li(e){return xs(e)[0]||""}function et(e){const t=String(e||""),n=[],o=/\sclass\s*=\s*(["'])/gi;let s;for(;s=o.exec(t);){const a=s[1],i=s.index+s[0].length,l=t.indexOf(a,i);if(l===-1)break;const c=t.slice(i,l),d=Mt(c);if(d){const f=c.slice(d.innerFrom,d.innerTo),h=i+d.innerFrom,p=f.replace(/\{\{[\s\S]*?\}\}/g,E=>" ".repeat(E.length)),y=/[a-zA-Z_][\w-]*/g;let g;for(;g=y.exec(p);)n.push({name:g[0],from:h+g.index,to:h+g.index+g[0].length})}o.lastIndex=l+1}return n}function vo(e,t){return et(e).find(n=>t>=n.from&&t<=n.to)||null}function yo(e,t){const n=String(e||""),o=et(n);let s=n;for(let a=o.length-1;a>=0;a-=1){const i=o[a],l=t(i.name);if(l!==i.name){if(!l){let c=i.from,d=i.to;s[d]===" "?d+=1:c>0&&s[c-1]===" "&&(c-=1),s=s.slice(0,c)+s.slice(d);continue}s=s.slice(0,i.from)+l+s.slice(i.to)}}return s}function ks(e){const t=[],n=/(^|[^\w-])\.([a-zA-Z_][\w-]*)\s*\{/g;let o;for(;o=n.exec(String(e||""));)t.push(o[2]);return t}function _s(e,t){const n=[],o=[],s=[];let a=0,i=0;for(;a<e.length&&i<t.length;){if(e[a]===t[i]){a+=1,i+=1;continue}const l=t.indexOf(e[a],i),c=e.indexOf(t[i],a);l===-1&&c===-1?(n.push({from:e[a],to:t[i]}),a+=1,i+=1):l===-1?(s.push(e[a]),a+=1):c===-1||l<=c?(o.push(t[i]),i+=1):(s.push(e[a]),a+=1)}for(;a<e.length;)s.push(e[a]),a+=1;for(;i<t.length;)o.push(t[i]),i+=1;return{renamed:n,added:o,removed:s}}function ie(e){let t=String(e||"").trim().replace(/^\.+/,"").replace(/\s+/g,"-").replace(/[^a-zA-Z0-9_-]/g,"");return/^[a-zA-Z_]/.test(t)||(t=t.replace(/^[^a-zA-Z_]+/,"")),ys.test(`.${t}`)?t:""}function ci(e,t){const n=String(e||""),o=ie(t);if(!n||!o)return n;const s=n.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(s){const a=s[1];let i=s[2];const l=Mt(i);if(l){const c=i.slice(l.innerFrom,l.innerTo).trim(),f=bs(i).includes(o)?c:`${c} ${o}`.trim();i=`${i.slice(0,l.from)}[ ${f} ]${i.slice(l.to)}`}else i=`[ ${o} ] ${i}`.trim();return n.slice(0,s.index)+` class=${a}${i}${a}`+n.slice(s.index+s[0].length)}return/\/\s*>$/.test(n)?n.replace(/(\s*)(\/\s*>)$/,` class="[ ${o} ]"$1$2`):n.replace(/(\s*)>$/,` class="[ ${o} ]"$1>`)}function di(e,t){const n=String(e).indexOf(">",t.from);return n===-1?"":e.slice(t.from,n+1)}function Ss(e,t){const n=[];for(const o of t){const s=xs(di(e,o)),a=Ss(e,o.children||[]);if(s.length){n.push({className:s[0],children:a});for(const i of s.slice(1))n.push({className:i,children:[]})}else n.push(...a)}return n}function Et(e){return Ss(e,Tn(e))}function yt(e){return String(e).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function En(e,t){if(e.startsWith("/*",t)){const n=e.indexOf("*/",t+2);return n===-1?e.length:n+2}return t}function Ie(e,t){let n=0;for(let o=t;o<e.length;o+=1){if(e.startsWith("/*",o)){o=En(e,o)-1;continue}if(e[o]==="{")n+=1;else if(e[o]==="}"&&(n-=1,n===0))return o}return-1}function W(e,t){const n=String(e||""),o=new RegExp(`(^|[^\\w-])\\.${yt(t)}\\s*\\{`,"g");let s;for(;s=o.exec(n);){const a=s.index+s[1].length,i=n.indexOf("{",a);if(i===-1)continue;const l=Ie(n,i);if(l!==-1)return{from:a,brace:i,close:l,to:l+1,name:t}}return null}function ui(e){const t=String(e||""),n=[],o={},s=[];let a=0,i="";const l=()=>{const c=i.trim();c&&n.push(c),i=""};for(;a<t.length;){if(t.startsWith("/*",a)){const c=En(t,a);i+=t.slice(a,c),a=c;continue}if(t[a]==="{"){const c=i.trim(),d=Ie(t,a);if(d===-1)break;const f=t.slice(a+1,d);i="",ys.test(c)?o[c.slice(1)]=f:c&&s.push(`${c} {${f}}`),a=d+1;continue}i+=t[a],a+=1}return l(),{decls:n.join(`
`),classes:o,other:s}}function bo(e,t){const n="    ".repeat(t);return String(e||"").split(`
`).map(o=>o.trim()?n+o.trim():"").filter((o,s,a)=>o||s>0&&s<a.length-1).join(`
`)}function fi(e,t){const n=W(e,t);return n?String(e).slice(n.brace+1,n.close):""}function ws(e,t,n){const o=ui(fi(t,e.className)),s="    ".repeat(n),a=[];o.decls&&a.push(bo(o.decls.replace(/;+\s*$/,";"),n+1));for(const l of o.other)a.push(bo(l,n+1));for(const l of e.children)a.push(ws(l,t,n+1));const i=a.filter(Boolean).join(`
`);return i?`${s}.${e.className} {
${i}
${s}}`:`${s}.${e.className} {
${s}}`}function Ln(e,t){return t?.length?t.map(n=>ws(n,e,0)).join(`

`)+`
`:""}function $s(e){const t=String(e||"").match(/^\s*\.([a-zA-Z_][\w-]*)\s*\{/);return t?t[1]:""}function hi(e){const t=[],n=/\.([a-zA-Z_][\w-]*)\s*\{/g;let o,s=!0;for(;o=n.exec(String(e||""));){if(s){s=!1;continue}t.push(o[1])}return t}function pi(e,t){const n=String(e).lastIndexOf(`
`,t-1)+1,o=e.slice(n,t);return/^\s*$/.test(o)?o:""}function mi(e,t){return t?e.split(`
`).map((n,o)=>o===0||!n?n:t+n).join(`
`):e}function gi(e,t){let n=0;for(let o=0;o<t.from;o+=1){if(e.startsWith("/*",o)){o=En(e,o)-1;continue}e[o]==="{"?n+=1:e[o]==="}"&&(n-=1)}return n===0}function Bn(e,t,n){const o=$s(t)||n;if(!o)return String(e||"");let s=String(t||"").trim();s?new RegExp(`^\\.${yt(o)}\\s*\\{`).test(s)||(s=`.${o} {
${s}
}`):s=`.${o} {
}`;let a=String(e||"");const i=W(a,o),l=hi(s);if(i){const d=pi(a,i.from);a=a.slice(0,i.from)+mi(s,d)+a.slice(i.to)}else a=`${a.trimEnd()}${a.trim()?`
`:""}${s}
`;const c=W(a,o);if(!c)return a;for(const d of[...new Set(l)].reverse()){const f=new RegExp(`(^|[^\\w-])\\.${yt(d)}\\s*\\{`,"g"),h=[];let p;for(;p=f.exec(a);){const y=p.index+p[1].length,g=a.indexOf("{",y),E=Ie(a,g);E!==-1&&h.push({from:y,to:E+1})}for(const y of h.reverse()){if(y.from>=c.from&&y.to<=c.to||!gi(a,y))continue;let g=y.from;const E=a.lastIndexOf(`
`,g-1)+1;/^\s*$/.test(a.slice(E,g))&&(g=E);let He=y.to;a[He]===`
`&&(He+=1),a=a.slice(0,g)+a.slice(He)}}return a}function en(e,t){const n=String(e||"");return`${n.trimEnd()}${n.trim()?`
`:""}.${t} {
}
`}function vi(e,t,n){const o=String(e||""),s=g=>g.trim().replace(/;$/,"").replace(/\s+/g," "),a=String(n||"").split(`
`).map(g=>g.trim()).filter(Boolean).map(g=>g.endsWith(";")||g.endsWith("}")?g:`${g};`);if(!a.length)return o;const i=W(o,t);if(!i)return`${o.trimEnd()}${o.trim()?`

`:""}.${t} {
${a.map(g=>`  ${g}`).join(`
`)}
}
`;const l=o.slice(i.brace+1,i.close),c=new Set(l.split(/[;\n]/).map(s).filter(Boolean)),d=a.filter(g=>!c.has(s(g)));if(!d.length)return o;const f=(o.slice(0,i.close).match(/\n([ \t]*)$/)||[null,""])[1],h=(l.match(/\n([ \t]+)\S/)||[])[1]||`${f}  `,p=l.replace(/^\s*\n/,"").replace(/\s+$/,""),y=p?`
${p}`:"";return`${o.slice(0,i.brace+1)}
${d.map(g=>`${h}${g}`).join(`
`)}${y}
${f}${o.slice(i.close)}`}function yi(e,t,n){const o=ie(n);return!t||!o||t===o?String(e||""):W(e,o)?Cs(e,t):String(e||"").replace(new RegExp(`(^|[^\\w-])\\.${yt(t)}(\\s*\\{)`,"g"),`$1.${o}$2`)}function Cs(e,t){let n=String(e||"");for(;;){const o=W(n,t);if(!o)break;let s=o.from;const a=n.lastIndexOf(`
`,s-1)+1;/^\s*$/.test(n.slice(a,s))&&(s=a);let i=o.to;n[i]===`
`&&(i+=1),n=n.slice(0,s)+n.slice(i)}return n}function bi(e,t,n){const o=Array.isArray(t)?t:[],s=Array.isArray(n)?n:[],{renamed:a,added:i}=_s(o,s),l=new Set(s);let c=String(e||"");for(const d of a){const f=ie(d.to);if(f){if(l.has(d.from)){W(c,f)||(c=en(c,f));continue}W(c,d.from)?c=yi(c,d.from,f):W(c,f)||(c=en(c,f))}}for(const d of i){const f=ie(d);!f||W(c,f)||(c=en(c,f))}return c}function xi(e,t,n){const o=new Set(Array.isArray(t)?t:[]),s=new Set(Array.isArray(n)?n:[]);let a=String(e||"");for(const i of s)o.has(i)||(a=Cs(a,i));return a}const te="__sve-css-rename-chip",ki='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';function _i(e){const t=e.Decoration.mark({class:"sve-cm-css-token"}),n=e.StateEffect.define();return{extensions:[e.StateField.define({create(){return e.Decoration.none},update(s,a){let i;for(const c of a.effects)c.is(n)&&(i=c.value);if(i===void 0)return a.docChanged?e.Decoration.none:s;if(!i)return e.Decoration.none;const l=new e.RangeSetBuilder;return l.add(i.from,i.to,t),l.finish()},provide:s=>e.EditorView.decorations.from(s)})],setHover(s,a){s&&s.dispatch({effects:n.of(a)})}}}function ne(e){e?.getElementById(te)?.remove()}function Si(e,t,n,o){t.style.left=`${Math.max(6,Math.min(n,e.innerWidth-28))}px`,t.style.top=`${Math.max(6,o)}px`}function wi(e,t,n,{onRename:o,title:s}){const a=e.document,i=t.coordsAtPos(n.to);if(!i)return;ne(a);const l=a.createElement("button");l.id=te,l.type="button",l.innerHTML=ki,l.title=s,l.setAttribute("aria-label",s),l.addEventListener("mousedown",c=>{c.preventDefault(),c.stopPropagation(),ne(a),o?.(n)}),l.addEventListener("mouseleave",()=>{e.setTimeout(()=>{t.dom.matches(":hover")||l.matches(":hover")||ne(a)},120)}),a.body.appendChild(l),Si(e,l,i.right+2,i.top-1)}function $i(e,t,{onRename:n,isLocked:o,setHover:s,title:a}){if(!t?.dom||t.dom._sveClassTokenBound)return;t.dom._sveClassTokenBound=!0;let i=null,l="";const c=()=>!!o?.(),d=()=>{e.clearTimeout(i),i=null,l="",s?.(t,null),ne(e.document)},f=h=>{if(c()){d();return}d(),n?.(h)};t.dom.addEventListener("mousemove",h=>{if(c()){d();return}if(h.target?.closest?.(`#${te}`))return;const p=t.posAtCoords({x:h.clientX,y:h.clientY});if(p==null)return;const y=vo(t.state.doc.toString(),p);if(!y){e.clearTimeout(i),i=null,l="",s?.(t,null);return}const g=`${y.from}:${y.to}:${y.name}`;s?.(t,{from:y.from,to:y.to}),!(l===g&&(i||e.document.getElementById(te)))&&(e.clearTimeout(i),l=g,i=e.setTimeout(()=>{i=null,wi(e,t,y,{onRename:f,title:a||"Rename class"})},160))}),t.dom.addEventListener("mouseleave",h=>{h.relatedTarget?.closest?.(`#${te}`)||e.setTimeout(()=>{e.document.getElementById(te)?.matches(":hover")||d()},160)}),t.dom.addEventListener("dblclick",h=>{if(c())return;const p=t.posAtCoords({x:h.clientX,y:h.clientY});if(p==null)return;const y=vo(t.state.doc.toString(),p);y&&(h.preventDefault(),h.stopPropagation(),f(y))},!0),t.scrollDOM?.addEventListener("scroll",d),e.document._sveClassTokenDismiss||(e.document._sveClassTokenDismiss=!0,e.document.addEventListener("mousedown",h=>{h.target.closest(`#${te}`)||ne(e.document)}))}const r={cssColorsPromise:null,lastUid:null,lastType:null,typeStack:[],lastParts:{html:"",css:"",js:""},lastProps:[],propsDirty:!1,lastLocked:!1,lockReady:!1,lastWin:null,loadGen:0,saveTimer:null,lastBracketNames:null,lastCssSelectorNames:null,saveInFlight:null,loadInFlight:null,dragging:!1,applying:!1,htmlScopePref:!0,htmlScopeActive:!1,styleMode:"css",cssToolRow:null,cssOpenTool:"",cssOpenMenu:"",cssValues:!1,twCss:null,twKey:"",twBusy:!1,twDirty:!1,htmlFocus:null,htmlFull:"",cssFull:"",cssPane:"full",cssScopeSnapshot:"",layoutObserver:null,layoutWin:null,observedEditor:null,observedRight:null,layoutWatchBound:!1,cssSize:"",cssState:"",cssOwnFolds:new Set,cssFoldSig:"",htmlPartialUi:null,htmlAntlersUi:null,htmlClassTokenUi:null,htmlLintUi:null,cssGhostUi:null},Ae=new Map,xo={scope:null,section:[],page:[],site:[]};function Ts(e){const t=e?.location?.pathname?.match(/\/collections\/([^/]+)\//);return t?t[1]:""}function As(e){const t=String(e||"").trim();return!t||/^(header|footer)\//.test(t)?"":t}function Ci(e){return(Array.isArray(e)?e:[]).filter(t=>t?.handle).map(t=>`${t.kind==="collection"?"collection":"field"}:${t.handle}`).join("|")}function Fn({collection:e,set:t,view:n,scope:o}){return`${e}::${t}::${n||""}::${o||""}`}function Ms(e){return Ae.get(e)||null}function Es(e,{collection:t,set:n,view:o,scope:s}){const a=Fn({collection:t,set:n,view:o,scope:s}),i=Ae.get(a);if(i)return Promise.resolve(i);const l=new URLSearchParams;return t&&l.set("collection",t),n&&l.set("set",n),o&&l.set("view",o),s&&l.set("scope",s),e.fetch(`/!/sve/data-vars?${l.toString()}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(c=>c.ok?c.json():null).then(c=>{const d=c&&typeof c=="object"?c:xo;return Ae.set(a,d),d}).catch(()=>xo)}function Ti(e){if(!e){Ae.clear();return}const t=`::${e}::`;for(const n of[...Ae.keys()])n.includes(t)&&Ae.delete(n)}function Ai(e){if(e==null||e==="")return"";if(typeof e=="boolean")return e?"true":"false";if(Array.isArray(e))return e.length?`${e.length} ×`:"";if(typeof e=="object"){const n=Object.keys(e).length;return n?`${n} ×`:""}const t=String(e).replace(/\s+/g," ").trim();return t.length>60?`${t.slice(0,60)}…`:t}function Mi(e,t){return t.split(".").reduce((n,o)=>n&&typeof n=="object"?n[o]:void 0,e)}function Ls(e,t){return!Array.isArray(e)||!t||typeof t!="object"?e||[]:e.map(n=>{if(n.parent||n.value!=null||n.var.includes(":"))return n;const o=Ai(Mi(t,n.var));return o?{...n,value:o}:n})}function Ei(e,t){return Array.isArray(e)?e.map(n=>({...n,items:Ls(n.items,t)})):[]}function Li(e,t){const n=String(e?.var||"").trim();if(!n)return null;if(e.loop)return{text:`{{ ${n} }}
  
{{ /${n} }}`,cursor:`{{ ${n} }}
  `.length};if(t?.loop&&!e.parent){const o=t.loop;return{text:`{{ ${o} }}
  {{ ${n} }}
{{ /${o} }}`,cursor:`{{ ${o} }}
  {{ ${n} }}`.length}}return{text:`{{ ${n} }}`,cursor:`{{ ${n} }}`.length}}const dt="visual_edit",ko=[{id:"base",lang:"code_dock_visual_edit_base"},{id:"field",lang:"code_dock_visual_edit_field"}],Bs=[{id:"tag",group:"base",label:"{{ visual_edit }}",standalone:"{{ visual_edit| }}"},{id:"ve_popup",group:"base",label:"popup",attr:'popup="true"'},{id:"ve_orderable",group:"base",label:"orderable",attr:'orderable="true"'},{id:"ve_section_orderable",group:"base",label:"section_orderable",attr:'section_orderable="true"'},{id:"ve_outline_inside",group:"base",label:"outline_inside",attr:'outline_inside="true"'},{id:"ve_field",group:"field",label:"field",attr:'field="|"'},{id:"ve_inline_edit",group:"field",label:"inline_edit",attr:'inline_edit="true"'},{id:"ve_insertable",group:"field",label:"insertable",attr:'insertable="true"'},{id:"ve_toolbar",group:"field",label:"toolbar",attr:'toolbar="true"'},{id:"ve_scope",group:"field",label:"scope",attr:'scope="|"'},{id:"ve_controls",group:"field",label:"controls",attr:'controls="|"'}];function Bi(e){return Bs.find(t=>t.id===e)||null}function Fi(e,t,n,o){let s=t;for(;s<n;){const a=e.indexOf("{{",s);if(a===-1||a>=n)return null;const i=e.indexOf("}}",a+2);if(i===-1||i+2>n)return null;const l=e.slice(a+2,i);if((l.trim().split(/\s+/)[0]||"")===o)return{openIdx:a,closeIdx:i,inner:l};s=i+2}return null}function Ii(e,t){const n=String(t).split("=")[0].trim();return new RegExp(`(^|\\s)${n}(=|\\s|$)`).test(e)}const Oi={class:"sve-code-dock"},Pi={"data-sve-code-bar":""},Di={type:"button","data-sve-code-pane-btn":"html"},zi={type:"button","data-sve-code-pane-btn":"css"},ji={type:"button","data-sve-code-pane-btn":"alpine"},Hi={type:"button","data-sve-code-pane-btn":"js"},Ri={type:"button","data-sve-html-scope":"","aria-pressed":"true"},Wi=["innerHTML"],Ni={"data-sve-code-panes":""},qi={"data-sve-code-pane":"html"},Vi={"data-sve-code-pane-label":""},Ui=["title","aria-label"],Ki=["innerHTML"],Gi={"data-sve-code-pane":"css"},Xi={"data-sve-css-chrome":"subrow-2"},Zi={"data-sve-code-pane-label":""},Yi={"data-sve-css-label":""},Ji={"data-sve-code-pane":"alpine"},Qi={"data-sve-code-pane-label":""},el={"data-sve-code-pane":"js"},tl={"data-sve-code-pane-label":""},nl={__name:"CodeDockChrome",props:{htmlLabel:{type:String,required:!0},cssLabel:{type:String,required:!0},jsLabel:{type:String,required:!0},alpineLabel:{type:String,required:!0},treeIcon:{type:String,required:!0},dataIcon:{type:String,required:!0},dataLabel:{type:String,required:!0}},setup(e){return(t,n)=>(k(),_("div",Oi,[n[18]||(n[18]=b("div",{"data-sve-code-grip":"","aria-hidden":"true"},null,-1)),b("div",Pi,[b("button",Di,A(e.htmlLabel),1),b("button",zi,A(e.cssLabel),1),b("button",ji,A(e.alpineLabel),1),b("button",Hi,A(e.jsLabel),1),n[0]||(n[0]=lr('<button type="button" data-sve-code-back hidden></button><span data-sve-code-path></span><span data-sve-code-status></span><button type="button" data-sve-code-strip></button><button type="button" data-sve-code-history></button><button type="button" data-sve-style-mode></button><button type="button" data-sve-values-mode></button><button type="button" data-sve-code-autosave aria-pressed="true"></button><button type="button" data-sve-code-save hidden></button>',9)),b("button",Ri,[b("span",{innerHTML:e.treeIcon},null,8,Wi)]),n[1]||(n[1]=b("button",{type:"button","data-sve-code-lock":"",hidden:""},null,-1))]),n[19]||(n[19]=b("div",{"data-sve-code-lock-banner":""},null,-1)),b("div",Ni,[b("div",qi,[b("div",Vi,[b("span",null,A(e.htmlLabel),1),n[2]||(n[2]=b("div",{"data-sve-html-tools":""},null,-1)),n[3]||(n[3]=b("button",{type:"button","data-sve-html-tidy":""},null,-1)),b("button",{type:"button","data-sve-data-vars":"",title:e.dataLabel,"aria-label":e.dataLabel},[b("span",{innerHTML:e.dataIcon},null,8,Ki)],8,Ui),n[4]||(n[4]=b("div",{"data-sve-visual-edit-tools":""},null,-1)),n[5]||(n[5]=b("div",{"data-sve-antlers-tools":""},null,-1))]),n[6]||(n[6]=b("div",{"data-sve-html-problems":"",hidden:""},null,-1)),n[7]||(n[7]=b("div",{"data-sve-code-host":""},null,-1))]),n[15]||(n[15]=b("div",{"data-sve-code-split":"","data-sve-code-split-after":"html"},null,-1)),b("div",Gi,[b("div",Xi,[b("div",Zi,[b("span",Yi,A(e.cssLabel),1),n[8]||(n[8]=b("button",{type:"button","data-sve-css-add-class":""},null,-1)),n[9]||(n[9]=b("div",{"data-sve-css-tools":""},null,-1))])]),n[10]||(n[10]=b("div",{"data-sve-css-head":""},null,-1)),n[11]||(n[11]=b("div",{"data-sve-code-host":""},null,-1)),n[12]||(n[12]=b("div",{"data-sve-tw-host":""},null,-1))]),n[16]||(n[16]=b("div",{"data-sve-code-split":"","data-sve-code-split-after":"css"},null,-1)),b("div",Ji,[b("div",Qi,[b("span",null,A(e.alpineLabel),1)]),n[13]||(n[13]=b("div",{"data-sve-alpine-host":""},null,-1))]),n[17]||(n[17]=b("div",{"data-sve-code-split":"","data-sve-code-split-after":"alpine"},null,-1)),b("div",el,[b("div",tl,[b("span",null,A(e.jsLabel),1)]),n[14]||(n[14]=b("div",{"data-sve-code-host":""},null,-1))])])]))}},qe=new Map;let Re=null,_o=0,So=0,wo=!1;async function ol(e,t){if(qe.has(t))return qe.get(t);const n=`view:partials/${t}`;let o=null;try{const s=await e.fetch(`/!/sve/section-template?type=${encodeURIComponent(n)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}});if(s.ok){const a=await s.json();o=typeof a.html=="string"?ls(a.html):null}}catch{}return qe.set(t,o),o}function sl(e){e?qe.delete(e):qe.clear()}function In(e){const t=is(ae("dock:current-type")),n=t?ae("dock:html"):"",o=t&&typeof n=="string"?ls(n):null;Qo({source:vs,type:gs.SVE_COMPONENT_FOCUS,on:!!o,name:t?String(t).split("/").pop():"",selector:o||""},e)}async function Lt(e){const t=++So,n=ae("dock:html"),o=[...new Set((typeof n=="string"?cs(n):[]).map(a=>a.src).filter(a=>a&&!Or(a)))],s=await Promise.all(o.map(a=>ol(e,a)));t===So&&Qo({source:vs,type:gs.SVE_COMPONENT_MAP,items:o.map((a,i)=>({src:a,name:a.split("/").pop(),selector:s[i]})).filter(a=>a.selector)},e)}function al(e){Re=e,!wo&&(wo=!0,At("dock:html-changed",()=>{Re&&(sl(is(ae("dock:current-type"))),Re.clearTimeout(_o),_o=Re.setTimeout(()=>{Lt(Re)},400))}))}const rl=["data-sve-html-tool","data-tip","aria-label","data-letter","onClick","onContextmenu"],il=["innerHTML"],ll={__name:"CodeDockHtmlTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(e){return(t,n)=>(k(!0),_(H,null,re(e.tools,o=>(k(),_("button",{key:o.id,type:"button","data-sve-html-tool":o.id,"data-tip":o.title,"aria-label":o.title,"data-letter":o.letter?"":void 0,onClick:L(s=>e.onTool(o.id),["prevent","stop"]),onContextmenu:L(s=>e.onTool(o.id),["prevent"])},[o.letter?(k(),_(H,{key:0},[es(A(o.letter),1)],64)):(k(),_("span",{key:1,innerHTML:o.icon},null,8,il))],40,rl))),128))}},fe=kn({tools:[],onTool:null,onKid:null}),cl=["data-sve-css-item"],dl=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],ul={key:0,"data-sve-css-kids":""},fl={key:0,"data-sve-css-sep":"","aria-hidden":"true"},hl=["data-sve-css-kid","data-sve-css-box-side","data-tip","aria-label","innerHTML","onClick","onContextmenu"],pl={__name:"CodeDockCssTools",setup(e){return(t,n)=>(k(!0),_(H,null,re(w(fe).tools,o=>(k(),_("li",Yt({key:o.id,"data-sve-css-item":o.id},{ref_for:!0},o.open?{"data-sve-css-open":""}:{}),[b("button",Yt({type:"button","data-sve-css-tool":o.id,"data-tip":o.title,"aria-label":o.title},{ref_for:!0},{...o.active?{"data-active":""}:{},...o.open?{"data-open":""}:{}},{innerHTML:o.icon,onClick:L(s=>w(fe).onTool?.(o.id),["prevent","stop"]),onContextmenu:L(s=>w(fe).onTool?.(o.id),["prevent"])}),null,16,dl),o.open&&o.kids.length?(k(),_("div",ul,[(k(!0),_(H,null,re(o.kids,s=>(k(),_(H,{key:s.id},[s.sep?(k(),_("span",fl)):j("",!0),b("button",Yt({type:"button","data-sve-css-kid":s.id,"data-sve-css-box-side":s.id,"data-tip":s.title,"aria-label":s.title},{ref_for:!0},s.active?{"data-active":""}:{},{innerHTML:s.icon,onClick:L(a=>w(fe).onKid?.(o.id,s.id),["prevent","stop"]),onContextmenu:L(a=>w(fe).onKid?.(o.id,s.id),["prevent"])}),null,16,hl)],64))),128))])):j("",!0)],16,cl))),128))}},ml=1.5,gl=16;function mt(e,t){const n=parseFloat(e);return Number.isFinite(n)?t==="em"||t==="rem"?n*gl:n:null}function vl(e){const t=String(e||"").toLowerCase();if(/\bmin-width\b|\bwidth\s*>=?/.test(t))return null;let n=t.match(/\bmax-width\s*:\s*([\d.]+)(px|em|rem)/);return n||(n=t.match(/\bwidth\s*<=?\s*([\d.]+)(px|em|rem)/),n)?mt(n[1],n[2]):(n=t.match(/([\d.]+)(px|em|rem)\s*>=?\s*width\b/),n?mt(n[1],n[2]):null)}function he(e,t){const n=vl(e);if(n===null)return"";for(const o of t||[]){if(o.base)continue;const s=mt(String(o.max||"").replace(/[a-z]+$/i,""),(String(o.max||"").match(/[a-z]+$/i)||[""])[0]);if(s!==null&&Math.abs(s-n)<=ml)return o.handle}return""}function Bt(e){let t="",n=0;for(;n<e.length;){const o=Ft(e,n);if(o!==n){t+=" ".repeat(o-n),n=o;continue}t+=e[n],n+=1}return t}function Ft(e,t){if(e.startsWith("/*",t)){const n=e.indexOf("*/",t+2);return n===-1?e.length:n+2}if(e.startsWith("{{",t)){const n=e.indexOf("}}",t+2);return n===-1?e.length:n+2}if(e[t]==='"'||e[t]==="'"){const n=e[t];for(let o=t+1;o<e.length;o+=1)if(e[o]==="\\")o+=1;else if(e[o]===n)return o+1;return e.length}return t}function It(e){const t=String(e||""),n=[],o=(s,a,i=0)=>{let l=s,c=l;for(;l<a;){const d=Ft(t,l);if(d!==l){l=d;continue}if(t[l]===";"){l+=1,c=l;continue}if(t[l]==="}")return;if(t[l]!=="{"){l+=1;continue}const f=Bt(t.slice(c,l)),h=f.trim(),p=Fs(t,l,a);if(p===-1)return;/^@media\b/i.test(h)?n.push({query:h.replace(/^@media\s*/i,"").trim(),from:c+f.search(/\S/),to:p+1,bodyFrom:l+1,bodyTo:p,depth:i}):/^@(?:import|charset|use)\b/i.test(h)||o(l+1,p,i+1),l=p+1,c=l}};return o(0,t.length,0),n}function Fs(e,t,n){let o=0;for(let s=t;s<n;s+=1){const a=Ft(e,s);if(a!==s){s=a-1;continue}if(e[s]==="{")o+=1;else if(e[s]==="}"&&(o-=1,o===0))return s}return-1}function Oe(e){const t=String(e||""),n=(o,s)=>{const a=[];let i=o,l=i;for(;i<s;){const c=Ft(t,i);if(c!==i){i=c;continue}if(t[i]===";"){i+=1,l=i;continue}if(t[i]==="}")return a;if(t[i]!=="{"){i+=1;continue}const d=Bt(t.slice(l,i)),f=d.trim(),h=Fs(t,i,s);if(h===-1)return a;a.push({prelude:f,media:/^@media\b/i.test(f),query:f.replace(/^@media\s*/i,"").trim(),from:l+d.search(/\S/),to:h+1,bodyFrom:i+1,bodyTo:h,children:/^@(?:import|charset|use)\b/i.test(f)?[]:n(i+1,h)}),i=h+1,l=i}return a};return n(0,t.length)}function yl(e,t,n){const o=String(e||"");if(!n)return[];const s=(t||[]).find(d=>d.base),a=Oe(o),i=[],l=d=>d.media?he(d.query,t)===n:d.children.some(l);if(s&&n===s.handle){const d=f=>{for(const h of f){if(h.media&&he(h.query,t)){i.push({from:h.from,to:h.to});continue}d(h.children)}};return d(a),i}const c=(d,f,h)=>{const p=[];for(const g of d){if(g.media&&he(g.query,t)===n){p.push({from:g.from,to:g.to,into:null});continue}l(g)&&p.push({from:g.from,to:g.to,into:g})}if(!p.length){h>f&&i.push({from:f,to:h});return}let y=f;for(const g of p)g.from>y&&i.push({from:y,to:g.from}),g.into&&c(g.into.children,g.into.bodyFrom,g.into.bodyTo),y=g.to;h>y&&i.push({from:y,to:h})};return c(a,0,o.length),i.filter(d=>o.slice(d.from,d.to).trim()!=="")}function bl(e,t){const n=String(e||""),o=[],s=i=>{for(const l of i){if((l.media&&he(l.query,t)||/^#id-/.test(l.prelude))&&Bt(n.slice(l.bodyFrom,l.bodyTo)).trim()===""){o.push(l);continue}s(l.children)}};if(s(Oe(n)),!o.length)return n;let a=n;for(const i of o.sort((l,c)=>c.from-l.from)){let l=i.from,c=i.to;const d=a.lastIndexOf(`
`,l-1)+1;for(a.slice(d,l).trim()===""&&(l=d);a[c]===" "||a[c]==="	";)c+=1;a[c]===`
`&&(c+=1),a=a.slice(0,l)+a.slice(c)}return a}function xl(e,t){const n=String(e||""),o=[],s=i=>Bt(n.slice(i.bodyFrom,i.bodyTo)).trim()==="",a=i=>{for(const l of i){if((l.media&&he(l.query,t)||/^#id-/.test(l.prelude))&&s(l)){o.push({from:l.from,to:l.to});continue}a(l.children)}};return a(Oe(n)),o}function bt(e,t,n){const o=t||[],s=o.find(d=>d.base),a=[],i=d=>/^#id-/.test(d.prelude)||/^#\s*$/.test(d.prelude),l=(d,f)=>{for(const h of d){if(!h.media){l(h.children,f);continue}const p=he(h.query,o)||f;if(n===p){a.push(h);continue}l(h.children,p)}},c=(d,f)=>{for(const h of d){if(h.media){c(h.children,he(h.query,o)||f);continue}if(i(h)){const p=f||(s?s.handle:"");!n||n===p?a.push(h):l(h.children,p);continue}c(h.children,f)}};return c(Oe(String(e||"")),""),a.sort((d,f)=>d.from-f.from)}function On(e,t,n){return It(e).filter(o=>he(o.query,t)===n)}const $=kn({tag:"",scope:"",scopeElsewhere:[],scopeElsewhereTitle:"",onScopeImport:null,onTag:null,sizes:[],onSize:null,state:"",stateLabel:"",onState:null,canEdit:!1,note:""}),kl={class:"sve-css-head"},_l=["disabled"],Sl={key:1,class:"sve-css-scope"},wl=["title","disabled"],$l=["title","data-active","disabled","onClick"],Cl=["data-active","disabled"],Tl={key:3,class:"sve-css-note"},Al={__name:"CodeDockCssHead",setup(e){return(t,n)=>(k(),_("div",kl,[w($).tag?(k(),_("button",{key:0,type:"button",class:"sve-css-tag",disabled:!w($).canEdit,onClick:n[0]||(n[0]=L(()=>{},["prevent","stop"])),onDblclick:n[1]||(n[1]=L(o=>w($).onTag?.(o),["prevent","stop"]))},"<"+A(w($).tag)+">",41,_l)):j("",!0),w($).scope?(k(),_("span",Sl,A(w($).scope),1)):j("",!0),w($).scope&&w($).scopeElsewhere.length?(k(),_("button",{key:2,type:"button",class:"sve-css-scope-taken",title:w($).scopeElsewhereTitle,disabled:!w($).canEdit,onClick:n[2]||(n[2]=L(o=>w($).onScopeImport?.(),["prevent","stop"]))},A(w($).scopeElsewhere.join(", ")),9,wl)):j("",!0),(k(!0),_(H,null,re(w($).sizes,o=>(k(),_("button",{key:o.key,type:"button","data-sve-css-size":"",title:o.title,"data-active":o.active?"":void 0,disabled:!w($).canEdit,onClick:L(s=>w($).onSize?.(o.key),["prevent","stop"])},A(o.label),9,$l))),128)),b("button",{type:"button","data-sve-css-state":"","data-active":w($).state?"":void 0,disabled:!w($).canEdit,onClick:n[3]||(n[3]=L(o=>w($).onState?.(o),["prevent","stop"]))},[es(A(w($).stateLabel)+" ",1),n[4]||(n[4]=b("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[b("path",{d:"m6 9 6 6 6-6"})],-1))],8,Cl),n[5]||(n[5]=b("span",{class:"sve-css-gap"},null,-1)),w($).note?(k(),_("span",Tl,A(w($).note),1)):j("",!0)]))}},Ml=ts(Al,[["__scopeId","data-v-22565303"]]),El={key:0,"data-sve-css-swatches":""},Ll=["data-sve-css-token","title","data-active","onClick"],Bl={key:0,"data-sve-css-head-row":""},Fl={key:1,"data-sve-css-note-row":""},Il=["data-sve-css-token","data-active","onClick"],Ol={"data-sve-css-choice-label":""},Pl={key:0,"data-sve-css-choice-hint":""},Q={__name:"CodeDockMenu",props:{kind:{type:String,required:!0},swatches:{type:Array,default:()=>[]},choices:{type:Array,default:()=>[]},onClear:{type:Function,default:null},onPick:{type:Function,required:!0}},setup(e){return(t,n)=>e.kind==="colors"?(k(),_("div",El,[b("button",{type:"button","data-sve-css-clear":"",title:"Clear",onClick:n[0]||(n[0]=L((...o)=>e.onClear&&e.onClear(...o),["prevent","stop"]))},[...n[1]||(n[1]=[b("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none",stroke:"currentColor","stroke-width":"1.5"},[b("path",{d:"M2 2l6 6M8 2L2 8"})],-1)])]),(k(!0),_(H,null,re(e.swatches,o=>(k(),_("button",{key:o.name,type:"button","data-sve-css-swatch":"","data-sve-css-token":o.name,title:o.name,"data-active":o.active?"":void 0,style:cr({background:o.hex||"transparent"}),onClick:L(s=>e.onPick(o.name),["prevent","stop"])},null,12,Ll))),128))])):(k(!0),_(H,{key:1},re(e.choices,o=>(k(),_(H,{key:o.value},[o.heading?(k(),_("span",Bl,A(o.label),1)):o.note?(k(),_("span",Fl,A(o.label),1)):(k(),_("button",{key:2,type:"button","data-sve-css-choice":"","data-sve-css-token":o.token||void 0,"data-active":o.active?"":void 0,onClick:L(s=>e.onPick(o.value),["prevent","stop"])},[b("span",Ol,A(o.label),1),o.hint?(k(),_("span",Pl,A(o.hint),1)):j("",!0)],8,Il))],64))),128))}},Dl=2e4;let ke=[],Is=0,Ne=null,tn=null;function Os(){return tn||(tn=je.define()),tn}function Ps(){return!!Ne&&Date.now()-Is<Dl}function Pn(e){return Ps()||(Is=Date.now(),Ne=e.fetch("/!/sve/site-css/defined",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{defined:[]}).then(t=>(ke=Array.isArray(t?.defined)?t.defined:[],v.html?.dispatch({effects:Os().of(null)}),ke)).catch(()=>(Ne=null,ke))),Ne}function Ot(e){return e.document.getElementById(u)?.querySelector("[data-sve-code-path]")?.textContent.trim()||""}function zl(e,t){const n=Ot(e),o=new Map;for(const s of ke){const a=o.get(s.name)||new Set;a.add(s.file===n?t:String(s.file).replace(/^.*\//,"")),o.set(s.name,a)}return[...o].map(([s,a])=>({name:s,detail:[...a].join(", ")})).sort((s,a)=>s.name.localeCompare(a.name))}function Dn(e,t){const n=Ot(e);return t?ke.filter(o=>o.name===t&&o.file!==n):[]}const Ds=e=>[...new Set(e.map(t=>String(t.file).replace(/^.*\//,"")))];function zn(e,t){const n=Dn(e,t).map(a=>a.css).filter(Boolean).join(`
`);if(!n)return!1;const o=ae("dock:css");if(typeof o!="string")return!1;const s=vi(o,t,n);return s!==o&&ae("dock:set-css",s)!==!1}function jl(e,t){const n=e.doc.lineAt(t),o=t-n.from,s=/\bclass\s*=\s*(["'])/gi;let a;for(;a=s.exec(n.text);){const i=a[1],l=a.index+a[0].length,c=n.text.indexOf(i,l),d=c===-1?n.text.length:c;if(o<l||o>d)continue;const f=n.text.slice(l,d),h=Mt(f),p=o-l;if(!h||p<h.innerFrom||p>h.innerTo)return null;const y=(f.slice(h.innerFrom,p).match(/[\w-]*$/)||[""])[0];return{from:t-y.length,typed:y}}return null}function Hl(e){return t=>{const n=jl(t.state,t.pos);return!n||!n.typed&&!t.explicit?null:Pn(e).then(o=>{const s=Ot(e),a=n.typed.toLowerCase(),i=new Map;for(const c of o){if(c.file===s||!String(c.name).toLowerCase().startsWith(a))continue;const d=i.get(c.name)||{files:[],css:[]};d.files.push(c),c.css&&d.css.push(c.css),i.set(c.name,d)}if(!i.size)return null;const l=[...i].slice(0,40).map(([c,d])=>({label:c,type:"class",detail:Ds(d.files).join(", "),info:d.css.length?()=>{const f=e.document.createElement("pre");return f.textContent=d.css.join(`
`),f.style.cssText="margin:0;padding:.3em .5em;font:11px ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap",f}:void 0,apply:(f,h,p,y)=>{f.dispatch({changes:{from:p,to:y,insert:c},selection:{anchor:p+c.length}}),e.setTimeout(()=>zn(e,c),0)}}));return{from:n.from,options:l,validFor:/^[\w-]*$/}})}}function Rl(e){const t=n=>{if(!ke.length)return J.none;const o=Ot(e),s=new ue;for(const a of et(n)){const i=ke.filter(l=>l.name===a.name&&l.file!==o);i.length&&s.add(a.from,a.to,J.mark({class:"sve-cm-class-taken",attributes:{title:m(e,"class_defined_in",{file:Ds(i).join(", ")})}}))}return s.finish()};return de.define({create:n=>t(n.doc.toString()),update:(n,o)=>o.docChanged||o.effects.some(s=>s.is(Os()))?t(o.state.doc.toString()):n,provide:n=>I.decorations.from(n)})}const Wl=/^\.[a-zA-Z_][\w-]*$/;function Nl(e,t,n){return String(t||"").includes(n)?xt(e).length===1:!1}function xt(e){return Oe(e).filter(t=>/^@scope\b/i.test(t.prelude))}function ql(e){const t=String(e||"");return Oe(t).filter(n=>Wl.test(n.prelude)?!t.slice(n.from,n.bodyFrom-1).includes("{{"):!1).map(n=>({from:n.from,to:n.to,name:n.prelude.slice(1)}))}function Vl(e,t,n){const o=String(e||"");if(!Nl(o,t,n))return o;const s=ql(o);if(!s.length)return o;const a=xt(o)[0],i=Gl(o,a),l=s.map(p=>Xl(o.slice(p.from,p.to),o,p.from,i)).join(`

`);let c=o;for(const p of[...s].sort((y,g)=>g.from-y.from))c=Kl(c,p.from,p.to);const d=Ul(c,n);if(d===-1)return o;const f=(c.slice(0,d).match(/\n([^\S\n]*)$/)||[null,null])[1],h=f===null?d:d-f.length;return`${c.slice(0,h)}
${l}
${f??""}${c.slice(d)}`}function Ul(e,t){const n=xt(e).find(o=>o.prelude.includes(t));return n?n.bodyTo:xt(e)[0]?.bodyTo??-1}function Kl(e,t,n){let o=t,s=n;const a=e.lastIndexOf(`
`,o-1)+1;for(e.slice(a,o).trim()===""&&(o=a);e[s]===" "||e[s]==="	";)s+=1;return e[s]===`
`&&(s+=1),e.slice(0,o)+e.slice(s)}function Gl(e,t){const n=e.slice(t.bodyFrom,t.bodyTo).match(/\n([^\S\n]+)\S/);return n?n[1]:`${(e.slice(0,t.from).match(/\n([^\S\n]*)$/)||[null,""])[1]}    `}function Xl(e,t,n,o){const s=(t.slice(0,n).match(/\n([^\S\n]*)$/)||[null,""])[1];return e.split(`
`).map((a,i)=>i===0?o+a.trim():a.startsWith(s)?o+a.slice(s.length):o+a.trimStart()).join(`
`)}const Zl={"data-sve-css-add-label":""},Yl=["placeholder","onKeydown"],Jl={key:0,"data-sve-css-add-hint":""},Ql={"data-sve-css-add-existing":""},ec={"data-sve-css-add-list":""},tc=["onClick"],nc={"data-sve-css-add-name":""},oc={"data-sve-css-add-detail":""},sc={key:0,"data-sve-css-add-none":""},ac=["disabled"],jn={__name:"CodeDockAddClass",props:{label:{type:String,required:!0},placeholder:{type:String,default:""},initial:{type:String,default:""},onAdd:{type:Function,required:!0},options:{type:Array,default:()=>[]},onPick:{type:Function,default:null},takenText:{type:Function,default:null},existingLabel:{type:String,default:""},createLabel:{type:String,default:""},onClose:{type:Function,default:null}},setup(e){const t=e,n=io(t.initial||""),o=io(null);dr(()=>ur(()=>{o.value?.focus(),o.value?.select()}));const s=Jt(()=>n.value.trim().toLowerCase()),a=Jt(()=>{if(!t.options.length)return[];const c=s.value,d=[],f=[];for(const h of t.options){const p=h.name.toLowerCase();!c||p.startsWith(c)?d.push(h):p.includes(c)&&f.push(h)}return[...d,...f].slice(0,8)}),i=Jt(()=>t.takenText&&s.value?t.takenText(n.value.trim()):"");function l(){const c=n.value.trim();if(!c){o.value?.focus();return}if(i.value&&t.onPick){t.onPick(c);return}t.onAdd(c)}return(c,d)=>(k(),_(H,null,[b("label",Zl,A(e.label),1),fr(b("input",{ref_key:"input",ref:o,"data-sve-css-add-input":"","onUpdate:modelValue":d[0]||(d[0]=f=>n.value=f),type:"text",placeholder:e.placeholder,onKeydown:[lo(L(l,["prevent"]),["enter"]),d[1]||(d[1]=lo(L(f=>e.onClose?.(),["stop","prevent"]),["escape"]))]},null,40,Yl),[[hr,n.value]]),i.value?(k(),_("div",Jl,A(i.value),1)):j("",!0),e.options.length?(k(),_(H,{key:1},[b("div",Ql,A(e.existingLabel),1),b("div",ec,[(k(!0),_(H,null,re(a.value,f=>(k(),_("button",{key:f.name,type:"button","data-sve-css-add-option":"",onMousedown:d[2]||(d[2]=L(()=>{},["prevent"])),onClick:L(h=>e.onPick?.(f.name),["prevent","stop"])},[b("span",nc,A(f.name),1),b("span",oc,A(f.detail),1)],40,tc))),128)),a.value.length?j("",!0):(k(),_("div",sc,"—"))]),b("button",{type:"button","data-sve-css-add-create":"",disabled:!!i.value||!s.value,onMousedown:d[3]||(d[3]=L(()=>{},["prevent"])),onClick:L(l,["prevent","stop"])},A(e.createLabel),41,ac)],64)):j("",!0)],64))}};function $o(e,t){t._sveLockBound||(t._sveLockBound=!0,t.querySelector("[data-sve-code-lock]")?.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),!(!r.lockReady||!r.lastType)){if(r.lastLocked){ic(e);return}zs(e,!0)}}))}function Hn(e){return e?X(e,Ja)!=="0":!0}function rc(){const e=v.html;return!e||e.state.readOnly||!r.lastType?!1:!Kn(Un(),r.lastParts)}function Y(e){const t=e?.document.getElementById(u),n=t?.querySelector("[data-sve-code-autosave]"),o=t?.querySelector("[data-sve-code-save]");if(!n||!o)return;const s=Hn(e),a=rc();n.setAttribute("aria-pressed",s?"true":"false"),n.title=m(e,s?"code_dock_autosave_on":"code_dock_autosave_off"),n.setAttribute("aria-label",n.title),n.innerHTML=pf,o.hidden=s,o.title=m(e,"code_dock_save"),o.setAttribute("aria-label",o.title),o.innerHTML=mf,a?o.setAttribute("data-dirty",""):o.removeAttribute("data-dirty")}function Co(e,t){t._sveAutosaveBound||(t._sveAutosaveBound=!0,t.querySelector("[data-sve-code-autosave]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation();const o=!Hn(e);q(e,Ja,o?"1":"0"),o?R(e.document):r.saveTimer&&(clearTimeout(r.saveTimer),r.saveTimer=null),Y(e)}),t.querySelector("[data-sve-code-save]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),R(e.document)}))}function ic(e){e.document.getElementById(K)?.remove();const t=pr(e.document,mr,{title:m(e,"code_dock_unlock_title"),body:m(e,"code_dock_unlock_body"),buttons:[{value:"cancel",label:m(e,"cancel"),variant:"ghost"},{value:"ok",label:m(e,"code_dock_unlock_confirm"),variant:"primary"}],onPick:n=>{t.dismiss(),n==="ok"&&zs(e,!1)}});t.host.id=K}function zs(e,t){const n=r.lastType;if(!n)return;const o=()=>{r.lastType===n&&e.fetch("/!/sve/section-template/lock",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":ns(e),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:n,locked:t})}).then(async s=>{if(!s.ok)throw new Error(String(s.status));r.lastType===n&&(r.lastLocked=t,_e(e),De(r.lastParts,t),V(e),O(e.document,t?m(e,"code_dock_locked"):""))}).catch(()=>{O(e.document,m(e,"code_dock_error"))})};if(t&&(R(e.document),r.saveInFlight)){r.saveInFlight.finally(o);return}o()}function js(e,t){const n=String(t||"");if(/^(header|footer)\//.test(n))return!0;const o=e?.Statamic?.$config?.get?.("sveChromeTemplates")||{};return Object.values(o).some(s=>s&&s.type===n)}function kt(e){const t=r.lastType;if(!r.lastUid||!t||String(t).startsWith("view:")||js(e,t)){co(e);return}const n=vr(r.lastUid,e.document);co(e,n.length?{sectionUids:n}:void 0)}function lc(e,t,n){return r.saveInFlight=e.fetch("/!/sve/section-template",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":ns(e),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:t,html:n.html,css:n.css,js:n.js,...typeof n.tw=="string"?{tw:n.tw}:{},...Pr(e)?{props:r.lastProps}:{}})}).then(async o=>{if(o.status===423){r.lastLocked=!0,r.lockReady=!0,_e(e),De(r.lastParts,!0),V(e),O(e.document,m(e,"code_dock_locked"));return}const s=await o.json().catch(()=>({}));if(!o.ok)throw new Error(s?.error==="not_writable"?"not_writable":String(o.status));if(r.lastType===t){if(r.lastParts=n,s?.tw_written===!1){r.twDirty=!0,O(e.document,m(e,"code_dock_tw_not_writable")),Y(e),kt(e);return}O(e.document,m(e,"code_dock_saved")),Y(e),e.setTimeout(()=>{const a=e.document.getElementById(u)?.querySelector("[data-sve-code-status]");a&&a.textContent===m(e,"code_dock_saved")&&(a.textContent="")},1800)}kt(e),e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"))}).catch(o=>{O(e.document,m(e,o?.message==="not_writable"?"code_dock_not_writable":"code_dock_error"))}).finally(()=>{r.saveInFlight=null}),r.saveInFlight}function R(e){r.saveTimer&&(clearTimeout(r.saveTimer),r.saveTimer=null);const t=r.lastType,n=r.lastWin,o=v.html;if(!o||o.state.readOnly||!t||!n||!r.lockReady)return;const s=Un(),a=r.twCss!==null&&ds(n)&&Rn(s.html)===r.twKey;Kn(s,r.lastParts)&&!(a&&r.twDirty)&&!r.propsDirty||(r.propsDirty=!1,a&&(s.tw=r.twCss,r.twDirty=!1),O(e,m(n,"code_dock_saving")),lc(n,t,s))}function Rn(e){return ni(e).sort().join(" ")}function Hs(){r.twCss=null,r.twKey="",r.twDirty=!1}function cc(e,t){r.twCss=t,r.twKey=Rn(e),r.twDirty=!1}function Rs(e,t){if(!e||!ds(e))return;const n=Rn(t);n===r.twKey||r.twBusy||(r.twBusy=!0,gr(()=>import("./tw-compile-AWaJHJyk.js"),__vite__mapDeps([0,1]),import.meta.url).then(o=>o.compileTailwind(e,t)).then(o=>{r.twBusy=!1,r.twCss=o,r.twKey=n,r.twDirty=!0,Ws(e,e.document)}).catch(o=>{r.twBusy=!1,console.error("[sve] tailwind compile",o)}))}function Ws(e,t){r.saveTimer&&clearTimeout(r.saveTimer),r.saveTimer=e.setTimeout(()=>{r.saveTimer=null,R(t)},cf)}function ee(e){if(r.applying)return;const t=Un();if(Kn(t,r.lastParts)){Y(e);return}if(Y(e),Rs(e,t.html),!Hn(e)){O(e.document,m(e,"code_dock_unsaved"));return}O(e.document,m(e,"code_dock_saving")),Ws(e,e.document)}function Ns(e,t){let n=0;const o=Math.min(e.length,t.length);for(;n<o&&e[n]===t[n];)n+=1;let s=e.length,a=t.length;for(;s>n&&a>n&&e[s-1]===t[a-1];)s-=1,a-=1;return[n,s,t.slice(n,a)]}function qs(e){const t=r.lastUid,n=typeof U=="function"?U(e.document):[];for(const o of n){const s=pe(o.values)||o.values;if(!(!s||typeof s!="object")&&t&&typeof uo=="function"){const a=uo(s,t);if(a){const i=a.split("."),l=yr(s,i.slice(0,2).join("."));if(l&&typeof l=="object")return l}}}for(const o of n){const s=pe(o.values)||o.values;if(s&&typeof s=="object")return s}return null}function Vs(e,t){!t||t===r.lastType||(R(e.document),ze(e,t,"push"))}function Us(e){const t=r.typeStack.pop();if(!t){Fe(e);return}R(e.document),ze(e,t,"keep")}function _e(e){const t=e.document.getElementById(u),n=t?.querySelector("[data-sve-code-lock]"),o=t?.querySelector("[data-sve-code-lock-banner]");if(!t||!n)return;const s=r.lastLocked;t.toggleAttribute("data-sve-code-locked",s),s&&(us(e.document),ne(e.document),r.htmlPartialUi&&(r.htmlPartialUi.setHover(v.html,null),r.htmlPartialUi.setHover(v.css,null)),r.htmlClassTokenUi?.setHover(v.html,null)),n.hidden=!r.lockReady,n.setAttribute("aria-pressed",r.lastLocked?"true":"false"),n.title=m(e,r.lastLocked?"code_dock_unlock":"code_dock_lock"),n.setAttribute("aria-label",n.title),n.innerHTML=r.lastLocked?df:uf,o&&(o.textContent=m(e,"code_dock_locked_banner"))}function tt(e){return e?X(e,Gt)!=="0":r.htmlScopePref}function Pt(e,t,n){return e!=null&&t!=null&&e>=0&&t>e&&t<=n}function oe(){const e=globalThis.document?.getElementById(u);e&&(e.__sveHtmlScope=r.htmlScopeActive&&r.htmlFocus?{full:r.htmlFull,from:r.htmlFocus.from,to:r.htmlFocus.to,css:r.cssFull}:null)}function Dt(){const e=v.html?.state.doc.toString()??"";if(!r.htmlScopeActive||!r.htmlFocus){r.htmlFull=e,oe();return}if(r.htmlFocus.from<0||r.htmlFocus.from>r.htmlFull.length||r.htmlFocus.to<r.htmlFocus.from){r.htmlScopeActive=!1,r.htmlFull=e,r.htmlFocus=null,oe();return}r.htmlFull=r.htmlFull.slice(0,r.htmlFocus.from)+e+r.htmlFull.slice(r.htmlFocus.to),r.htmlFocus={from:r.htmlFocus.from,to:r.htmlFocus.from+e.length},oe()}function $e(){return Dt(),r.htmlScopeActive?r.htmlFull:v.html?.state.doc.toString()??r.lastParts.html??""}function zt(){r.lastBracketNames=et($e()).map(e=>e.name)}function Pe(){r.lastCssSelectorNames=ks(v.css?.state.doc.toString()??r.cssFull)}function Ks(e,t){return Array.isArray(e)&&Array.isArray(t)&&e.length===t.length&&e.every((n,o)=>n===t[o])}function dc(){const e=r.htmlScopeActive?Wn():$e(),t=Et(e);t.length&&(r.cssFull=Bn(r.cssFull,Ln(r.cssFull,t),t[0].className))}function Gs(e,t){r.cssFull=bi(r.cssFull,e,t),dc(),r.cssFull=xi(r.cssFull,t,e)}function uc(e){if(r.applying||r.lastLocked||r.lastBracketNames==null)return;const t=et($e()).map(n=>n.name);Ks(r.lastBracketNames,t)||(Gs(r.lastBracketNames,t),r.lastBracketNames=t,nt(),Pe())}function fc(){if(r.applying||r.lastLocked||r.lastCssSelectorNames==null||r.lastBracketNames==null||r.cssPane==="empty")return;const e=v.html,t=ks(v.css?.state.doc.toString()??"");if(!e||Ks(r.lastCssSelectorNames,t))return;const n=new Set(r.lastBracketNames),{renamed:o,removed:s}=_s(r.lastCssSelectorNames,t);let a=e.state.doc.toString();const i=a;for(const l of o){const c=ie(l.to);!n.has(l.from)||!c||(a=yo(a,d=>d===l.from?c:d))}for(const l of s)!n.has(l)||t.includes(l)||(a=yo(a,c=>c===l?"":c));if(a!==i){r.applying=!0;try{Ht(a)}finally{r.applying=!1}}zt(),r.lastCssSelectorNames=t}function hc(e,t){const n=ie(t),o=v.html;if(!n||!o||o.state.readOnly||n===e.name)return;r.applying=!0;try{o.dispatch({changes:{from:e.from,to:e.to,insert:n}})}finally{r.applying=!1}const s=r.lastBracketNames==null?[]:r.lastBracketNames.slice();zt(),Gs(s,r.lastBracketNames),nt(),Pe(),r.lastWin&&(ee(r.lastWin),B(r.lastWin))}function pc(e,t){const n=e.document,s=v.html?.coordsAtPos(t.from);S(n),ne(n);const a=n.createElement("div"),i={getBoundingClientRect:()=>({left:s?.left??12,right:s?.right??12,top:s?.top??12,bottom:s?.bottom??12,width:0,height:0})};a.id=x,n.body.appendChild(a),D(e,i,a),a._sveApp=z(jn,a,{label:m(e,"code_dock_css_rename_class"),placeholder:m(e,"code_dock_css_class_placeholder"),initial:t.name,onAdd:l=>{hc(t,l),S(n)}})}function Xs(){return r.htmlScopePref&&Pt(r.htmlFocus?.from,r.htmlFocus?.to,r.htmlFull.length)?(r.htmlScopeActive=!0,oe(),r.htmlFull.slice(r.htmlFocus.from,r.htmlFocus.to)):(r.htmlScopeActive=!1,oe(),r.htmlFull)}function jt(e,t,n){const o=v[e];if(!o)return;const s=o.state.doc.toString();r.applying=!0;try{if(s!==t){const[a,i,l]=Ns(s,t);o.dispatch({changes:{from:a,to:i,insert:l},...n?{selection:n,scrollIntoView:!0}:{}})}else n&&o.dispatch({selection:n,scrollIntoView:!0})}finally{r.applying=!1}}function Ht(e,t){jt("html",e,t)}function Wn(){return r.htmlScopeActive?v.html?.state.doc.toString()??"":Pt(r.htmlFocus?.from,r.htmlFocus?.to,r.htmlFull.length)?r.htmlFull.slice(r.htmlFocus.from,r.htmlFocus.to):""}function ce(){const e=v.css?.state.doc.toString()??"";if(r.cssPane==="tree"){if(e===r.cssScopeSnapshot)return;const t=Et(Wn())[0]?.className||$s(e);r.cssFull=Bn(r.cssFull,e,t),r.cssScopeSnapshot=e}else r.cssPane==="full"&&(r.cssFull=e)}function Zs(e,t){for(const n of t||[])if(!W(e,n.className)||Zs(e,n.children))return!0;return!1}function nt(){let e=r.cssFull,t=[],n=!1;r.cssValues||!r.htmlScopePref||!r.htmlScopeActive?(r.cssPane="full",e=r.cssFull):(t=Et(Wn()),t.length?(r.cssPane="tree",e=Ln(r.cssFull,t),Zs(r.cssFull,t)&&(r.cssFull=Bn(r.cssFull,e,t[0].className),n=!0)):(r.cssPane="empty",e="")),r.cssScopeSnapshot=e,jt("css",e),Pe(),r.lastWin&&(rt(r.lastWin,!0),B(r.lastWin),n&&ee(r.lastWin))}function Nn(e){const t=v.html;if(!t||!r.htmlFocus)return;r.htmlScopeActive||(r.htmlFull=t.state.doc.toString());const n=r.htmlFull.length,o=Math.max(0,Math.min(r.htmlFocus.from,n)),s=Math.max(o,Math.min(r.htmlFocus.to,n));if(s<=o)return;r.htmlFocus={from:o,to:s},r.htmlScopeActive=!0,oe();const a=e==null?0:Math.max(0,Math.min(e-o,s-o));Ht(r.htmlFull.slice(o,s),{anchor:a,head:a}),nt(),t.focus()}function qn(e=!0,t=null){const n=v.html;if(!n)return;ce(),Dt(),r.htmlScopeActive=!1,oe();const o=r.htmlFull||n.state.doc.toString(),s=t!=null?{anchor:Math.max(0,Math.min(t,o.length))}:e&&Pt(r.htmlFocus?.from,r.htmlFocus?.to,o.length)?{anchor:r.htmlFocus.from,head:r.htmlFocus.to}:null;r.htmlFull=o,Ht(o,s),r.cssPane="full",r.cssScopeSnapshot=r.cssFull,jt("css",r.cssFull),Pe()}function ot(){r.htmlFocus=null,r.htmlScopeActive=!1,r.htmlFull="",r.cssFull="",r.cssPane="full",r.cssScopeSnapshot="",r.lastBracketNames=null,r.lastCssSelectorNames=null,oe()}let Xe=!1;function Me(e){return!!e?.document.getElementById(Jo)}function cn(e,t){if(!(!e||_n(e,"html_tree")===!1)){if(!t){Me(e)&&os(e);return}Me(e)||(Xe=!0,br("html_tree").then(()=>{Me(e)||xr(e)}).catch(()=>{}).finally(()=>{Xe=!1,V(e)}))}}function V(e){const t=e?.document.getElementById(u)?.querySelector("[data-sve-html-scope]");if(!t)return;r.htmlScopePref=tt(e);const n=_n(e,"html_tree")===!1?r.htmlScopePref:Me(e)||Xe;t.setAttribute("aria-pressed",n?"true":"false"),t.title=m(e,n?"code_dock_html_scope_off":"code_dock_html_scope"),t.setAttribute("aria-label",t.title),t.innerHTML=tr,e.document.getElementById(u)?.toggleAttribute("data-sve-html-scoped",r.htmlScopeActive),oe()}function To(e,t){t._sveHtmlScopeBound||(t._sveHtmlScopeBound=!0,r.htmlScopePref=tt(e),mc(e,t),cn(e,r.htmlScopePref),t.querySelector("[data-sve-html-scope]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation();const o=Me(e)||Xe;r.htmlScopePref=!o,q(e,Gt,r.htmlScopePref?"1":"0"),r.htmlScopePref?r.htmlFocus&&(ce(),Nn()):r.htmlScopeActive&&qn(),cn(e,r.htmlScopePref),V(e)}))}function mc(e,t){t._sveTreeWatchBound||(t._sveTreeWatchBound=!0,e.addEventListener("sve-right-dock-change",()=>{if(Xe||_n(e,"html_tree")===!1||!e.document.getElementById(u))return;const n=Me(e);n!==tt(e)&&(r.htmlScopePref=n,q(e,Gt,n?"1":"0"),n?r.htmlFocus&&(ce(),Nn()):r.htmlScopeActive&&qn(),V(e))}))}const gc=new Set(["pre","textarea","script","style"]),vc=/^(<\/|\{\{\s*\/)/;function yc(e){let t=0;for(const n of e.split(`
`)){if(!n.trim())continue;const o=n.length-n.trimStart().length;o>0&&(t===0||o<t)&&(t=o)}return" ".repeat(t===2||t===3?t:4)}function bc(e){const t=String(e||"");if(!t.trim())return t;const n=[],o=l=>{for(const c of l||[])n.push(c),o(c.children)};o(Dr(t));const s=yc(t),a=[];let i=0;for(const l of t.split(`
`)){const c=i,d=l.trim();i+=l.length+1;const f=c+(l.length-l.trimStart().length),h=n.filter(y=>y.from<f&&f<y.to);if(h.some(y=>gc.has(y.tag))){a.push(l);continue}if(!d)continue;const p=h.length-(vc.test(d)?1:0);a.push(s.repeat(Math.max(p,0))+d)}return a.join(`
`)+(t.endsWith(`
`)?`
`:"")}function dn(e,t){let n=0;for(;n<t;){const o=xc(e,n);if(o===null){n+=1;continue}if(o===-1)return t;if(o>t)return o;n=o}return t}function xc(e,t){if(e.startsWith("{{",t)){const n=e.indexOf("}}",t+2);return n===-1?-1:n+2}if(e.startsWith("<!--",t)){const n=e.indexOf("-->",t+4);return n===-1?-1:n+3}return e[t]==="<"&&/[A-Za-z/!?]/.test(e[t+1]||"")?kc(e,t):null}function kc(e,t){let n="",o=t+1;for(;o<e.length;){const s=e[o];if(n){s===n&&(n=""),o+=1;continue}if(e.startsWith("{{",o)){const a=e.indexOf("}}",o+2);if(a===-1)return-1;o=a+2;continue}if(s==='"'||s==="'"){n=s,o+=1;continue}if(s===">")return o+1;if(s==="<")return-1;o+=1}return-1}function Vn(e,t){if(e.startsWith("{{",t)){const n=e.indexOf("}}",t+2);return n===-1?e.length:n+2}if(e.startsWith("<!--",t)){const n=e.indexOf("-->",t+4);return n===-1?e.length:n+3}return t}function _t(e,t){if(e[t]!=="<")return null;const n=e.indexOf(">",t+1);if(n===-1)return null;const o=e.slice(t,n+1),s=o.match(/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/);if(s)return{kind:"close",name:s[1].toLowerCase(),from:t,to:n+1};const a=o.match(/^<([A-Za-z][A-Za-z0-9:-]*)/);if(!a)return{kind:"other",from:t,to:n+1};const i=a[1].toLowerCase();return{kind:/\/\s*>$/.test(o)||["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"].includes(i)?"void":"open",name:i,from:t,to:n+1}}function un(e,t,n){let o=1,s=n;for(;s<e.length;){const a=Vn(e,s);if(a!==s){s=a;continue}if(e[s]!=="<"){s+=1;continue}const i=_t(e,s);if(!i)break;if(i.kind==="open"&&i.name===t)o+=1;else if(i.kind==="close"&&i.name===t&&(o-=1,o===0))return i;s=i.to}return null}function _c(e,t){const n=[];let o=0;for(;o<t;){const s=Vn(e,o);if(s!==o){o=s;continue}if(e[o]!=="<"){o+=1;continue}const a=_t(e,o);if(!a)return null;if(t<a.to){if(a.kind==="open")return{name:a.name,open:a,close:un(e,a.name,a.to),at:"open"};if(a.kind==="void")return{name:a.name,open:a,close:null,at:"open"};if(a.kind==="close"){let i=null;for(let l=n.length-1;l>=0;l-=1)if(n[l].name===a.name){i=n[l];break}return{name:a.name,open:i,close:a,at:"close"}}return null}if(a.kind==="open")n.push(a);else if(a.kind==="close"){for(let i=n.length-1;i>=0;i-=1)if(n[i].name===a.name){n.splice(i);break}}o=a.to}return null}function st(){const e=v.html;if(!e)return null;const t=e.state.selection.main.head,n=e.state.doc.toString(),o=[];let s=0;for(;s<t;){const c=Vn(n,s);if(c!==s){s=c;continue}if(n[s]!=="<"){s+=1;continue}const d=_t(n,s);if(!d||d.from>=t)break;if(d.kind==="open")o.push(d);else if(d.kind==="close"){for(let f=o.length-1;f>=0;f-=1)if(o[f].name===d.name){o.splice(f);break}}s=d.to}const a=n.lastIndexOf("<",Math.max(0,t-1));if(a!==-1&&n.indexOf(">",a)>=t){const c=_t(n,a);if(c?.kind==="open"||c?.kind==="void"){const d=c.kind==="void"?null:un(n,c.name,c.to);return d?{name:c.name,open:c,close:d}:{name:c.name,open:c,close:null}}}const i=o[o.length-1];if(!i)return null;const l=un(n,i.name,i.to);return{name:i.name,open:i,close:l}}function St(e){return nr.includes(e)}function P(){v.html?.focus(),r.lastWin&&(ee(r.lastWin),Rt(r.lastWin))}function be(e,t,n,o=void 0){const s=[...t].sort((a,i)=>i.from-a.from||i.to-a.to);e.dispatch({changes:s,selection:n,...o?{userEvent:o}:{}})}const Te="input.toolbar";function Ze(e,t,n){const o=v.html;if(!o||o.state.readOnly)return;const s=o.state.selection.main.head,a=o.state.doc.lineAt(s),i=a.text.slice(0,s-a.from),l=a.text.trim()?le(a.text):Nt(o,a)||le(a.text);let c=e,d=0;if(i.trim()!=="")c=`
${l}${e}`,d=1+l.length;else if(!a.text.trim()){c=`${l}${e}`,d=l.length,o.dispatch({changes:{from:a.from,to:a.to,insert:c},selection:Ao(a.from+d+t,n),userEvent:Te});return}o.dispatch({changes:{from:s,to:o.state.selection.main.to,insert:c},selection:Ao(s+d+t,n),userEvent:Te})}function Ao(e,t){return t?{anchor:e,head:e+t}:{anchor:e}}function Ys(e){const{from:t}=e.state.selection.main,n=dn(e.state.doc.toString(),t);return n!==t&&e.dispatch({selection:{anchor:n}}),n}function Js(e,t,n){const o=v.html;!o||o.state.readOnly||(Ys(o),Ze(e,t,n))}const Sc=new Set(["section","article","header","footer","main","nav","aside"]);function wc(e){return St(e)||e==="p"||e==="a"}function Mo(e){if(e==="a")return'<a href="">';if(e!=="section")return`<${e}>`;const t=r.lastWin?.Statamic?.$config?.get?.("sveSectionTag");return typeof t=="string"&&t.trim()?`<${e} ${t.trim()}>`:`<${e}>`}function Qs(){const e=v.html;if(!e||e.state.readOnly)return;const t=e.state.doc.toString(),n=(t.match(/^[ \t]*/)||[""])[0],o=bc(t).split(`
`).map(s=>s&&n+s).join(`
`);o!==t&&(be(e,[{from:0,to:t.length,insert:o}],{anchor:0}),P())}function ea(e){const t=v.html;if(!t||t.state.readOnly)return;const n=t.state.selection.main,o=t.state.doc.toString();if(!n.empty&&dn(o,n.from)===n.from&&dn(o,n.to)===n.to){const f=o.slice(n.from,n.to),h=f.match(new RegExp(`^<${e}(\\s[^>]*)?>([\\s\\S]*)</${e}>$`,"i"));if(h){be(t,[{from:n.from,to:n.to,insert:h[2]}],{anchor:n.from,head:n.from+h[2].length},Te),P();return}const p=Mo(e);let y=`${p}${f}</${e}>`,g=n.from+p.length;e==="ul"&&(y=`<ul>
  <li>${f}</li>
</ul>`,g=n.from+11),be(t,[{from:n.from,to:n.to,insert:y}],{anchor:g,head:g+f.length},Te),P();return}const a=n.head,i=_c(o,a);if(i&&i.name===e&&i.open&&i.close){be(t,[{from:i.close.from,to:i.close.to,insert:""},{from:i.open.from,to:i.open.to,insert:""}],{anchor:i.open.from},Te),P();return}const l=st();if(l?.open&&l.close&&St(l.name)&&St(e)&&l.name!==e){const f=o.slice(l.open.from,l.open.to).replace(new RegExp(`^<${l.name}`,"i"),`<${e}`);be(t,[{from:l.close.from,to:l.close.to,insert:`</${e}>`},{from:l.open.from,to:l.open.to,insert:f}],{anchor:l.open.from+e.length+1},Te),P();return}l?.open&&l.name===e&&wc(e)&&t.dispatch({selection:{anchor:l.close?l.close.to:l.open.to}}),Ys(t);const d=(t.state.doc.lineAt(t.state.selection.main.head).text.match(/^\s*/)||[""])[0];if(e==="ul"){const f=`<ul>
${d}  <li></li>
${d}</ul>`;Ze(f,`<ul>
${d}  <li>`.length)}else{const f=Mo(e),h=`${f}</${e}>`,p=e==="a"?f.indexOf('""')+1:Sc.has(e)?f.length:h.length;Ze(h,p)}P()}function Rt(e){try{$c(e)}catch{}}function $c(e){const t=e?.document?.getElementById(u),o=st()?.name||"";if(t)for(const s of bn){const a=t.querySelector(`[data-sve-html-tool="${s.id}"]`);if(!a)continue;(s.id==="heading"?St(o):o===s.tag)?a.setAttribute("data-active",""):a.removeAttribute("data-active")}}function Eo(e,t,n){const o=e.document,s=st()?.name||"";S(o),t.setAttribute("data-open","");const a=o.createElement("div");a.id=x,o.body.appendChild(a),D(e,t,a),a._sveApp=z(Q,a,{kind:"choices",choices:n.map(i=>({value:i,label:i.toUpperCase(),active:s===i})),onPick:i=>{ea(i),S(o)}})}function Cc(e,t){const n=e.document;S(n),t.setAttribute("data-open","");const o=n.createElement("div");o.id=x,n.body.appendChild(o),D(e,t,o);const s=a=>{n.getElementById(x)&&(o._sveApp?.unmount(),o._sveApp=z(Q,o,{kind:"choices",choices:a,onPick:i=>{i&&(Js(i,i.length),P()),S(n)}}),D(e,t,o))};s([{value:"",label:m(e,"code_dock_loading")}]),e.fetch("/!/sve/components",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(a=>a.ok?a.json():{items:[]}).then(a=>{const i=Array.isArray(a.items)?a.items:[];s(i.length?i.map(l=>({value:l.tag,label:l.name})):[{value:"",label:m(e,"component_none")}])}).catch(()=>s([{value:"",label:m(e,"component_none")}]))}function Lo(e){const t=ie(e),n=v.html,o=v.css;if(!t||n?.state.readOnly||o?.state.readOnly)return;const s=st();if(s?.open&&n){const a=n.state.doc.sliceString(s.open.from,s.open.to),i=ci(a,t);i!==a&&n.dispatch({changes:{from:s.open.from,to:s.open.to,insert:i}})}ce(),W(r.cssFull,t)||(r.cssFull=`${String(r.cssFull||"").trimEnd()}${r.cssFull?.trim()?`
`:""}.${t} {
}
`),nt(),zt(),Pe(),r.lastWin&&(ee(r.lastWin),Rt(r.lastWin),B(r.lastWin))}function Tc(e,t){const n=e.document;if(t.hasAttribute("data-open")){S(n);return}S(n),t.setAttribute("data-open","");const o=n.createElement("div");o.id=x,n.body.appendChild(o),D(e,t,o);const s=l=>{const c=ie(l);if(!c)return"";if(W(r.cssFull,c))return m(e,"class_exists_here");const d=[...new Set(Dn(e,c).map(f=>String(f.file).replace(/^.*\//,"")))];return d.length?m(e,"class_exists_pick",{file:d.join(", ")}):""},a=l=>{Lo(l),zn(e,ie(l)),S(n)},i=()=>{if(!n.getElementById(x))return;const l=o.querySelector("[data-sve-css-add-input]")?.value||"";o._sveApp?.unmount(),o._sveApp=z(jn,o,{label:m(e,"code_dock_css_class_name"),placeholder:m(e,"code_dock_css_class_placeholder"),initial:l,options:zl(e,m(e,"class_this_file")),existingLabel:m(e,"code_dock_css_class_existing"),createLabel:m(e,"code_dock_css_class_create"),takenText:s,onPick:a,onClose:()=>S(n),onAdd:c=>{Lo(c),S(n)}}),D(e,t,o)};i(),Pn(e).then(i)}function Ac(e,t){const n=t.querySelector("[data-sve-css-add-class]");!n||n._sveBound||(n._sveBound=!0,n.innerHTML=gf,n.title=m(e,"code_dock_css_add_class"),n.setAttribute("aria-label",n.title),n.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),r.styleMode==="tw"){S(e.document),zr(e,n);return}Tc(e,n)}))}function Un(){const e={html:"",css:"",js:""};Dt(),ce();for(const t of se)t==="html"?e.html=r.htmlScopeActive?r.htmlFull:v.html?.state.doc.toString()??"":t==="css"?(e.css=r.lastWin?bl(r.cssFull,ge(r.lastWin)):r.cssFull,e.css=Vl(e.css,e.html,af)):e[t]=v[t]?.state.doc.toString()??"";return e}function ta(){if(r.cssValues||!(r.htmlScopePref&&Pt(r.htmlFocus?.from,r.htmlFocus?.to,r.htmlFull.length)))return r.cssPane="full",r.cssScopeSnapshot=r.cssFull,r.cssFull;const e=Et(r.htmlFull.slice(r.htmlFocus.from,r.htmlFocus.to));if(!e.length)return r.cssPane="empty",r.cssScopeSnapshot="","";r.cssPane="tree";const t=Ln(r.cssFull,e);return r.cssScopeSnapshot=t,t}function De(e,t){r.applying=!0;try{r.lastWin&&(r.htmlScopePref=tt(r.lastWin)),r.htmlFull=e.html??"",r.cssFull=e.css??"";for(const n of se){const o=v[n];let s=e[n]??"";try{s=n==="html"?Xs():n==="css"?ta():s}catch{s=n==="html"?r.htmlFull||e.html||"":n==="css"?r.cssFull||e.css||"":s}if(!o)continue;const a=o.state.doc.toString(),i=[Ue[n].reconfigure(Je.readOnly.of(!!t)),Ke[n].reconfigure(I.editable.of(!t))];a!==s?o.dispatch({changes:{from:0,to:a.length,insert:s},effects:i}):o.dispatch({effects:i})}}finally{r.applying=!1}zt(),Pe(),Sn("dock:html-changed"),r.lastWin&&(B(r.lastWin),Rt(r.lastWin),V(r.lastWin),it(r.lastWin))}function Kn(e,t){return e.html===t.html&&e.css===t.css&&e.js===t.js}function na(e){return String(e||"").replace(/\/\*[\s\S]*?\*\//g,"").trim().replace(/\s*:\s*/g,": ").replace(/\s*;\s*/g,";").replace(/\s+/g," ").replace(/;+$/,";")}function oa(e){const t=na(e).match(/^([a-z-]+)\s*:/i);return t?t[1].toLowerCase():""}function sa(e){const t=na(e),n=t.indexOf(":");return n===-1?"":t.slice(n+1).replace(/;$/,"").trim().toLowerCase()}function F(e){const t=String(e||"").trim().toLowerCase();return t==="start"||t==="flex-start"||t==="left"||t==="top"?"flex-start":t==="end"||t==="flex-end"||t==="right"||t==="bottom"?"flex-end":t==="row-reverse"?"row-reverse":t==="column-reverse"?"column-reverse":t}function Ye(e){const t=F(e);return t==="flex"||t==="inline-flex"}function Wt(){const e=v.css;if(!e)return null;const t=e.state.selection.main.head,n=e.state.doc.toString(),o=[],s=[];for(let i=0;i<n.length;i+=1){if(n[i]==="{"&&n[i+1]==="{"){const l=n.indexOf("}}",i+2);if(l===-1)break;i=l+1;continue}if(n[i]==="{")o.push(i);else if(n[i]==="}"){const l=o.pop();l!=null&&s.push({from:l+1,to:i,text:n.slice(l+1,i),open:l})}}let a=null;for(const i of s)t<i.open||t>i.to||(!a||i.to-i.open<a.to-a.open)&&(a=i);return a}function Mc(e){const t=String(e||"");let n="",o=0;for(let s=0;s<t.length;s+=1){if(t[s]==="{"&&t[s+1]==="{"){const a=t.indexOf("}}",s+2);if(a===-1)break;o===0&&(n+=t.slice(s,a+2)),s=a+1;continue}if(t[s]==="{"){o+=1;continue}if(t[s]==="}"){o=Math.max(0,o-1);continue}o===0&&(n+=t[s])}return n}function Bo(e){const t={};for(const n of Mc(e).split(";")){const o=oa(n);o&&(t[o]=sa(`${n};`))}return t}function Ec(e,t,n){if(!t||t.from>=t.to)return null;let o=e.state.doc.lineAt(t.from),s=0;for(;o.from<=t.to;){const a=Math.max(o.from,t.from),i=Math.min(o.to,t.to),l=e.state.doc.sliceString(a,i);if(s===0&&oa(l)===n)return{from:a,to:i,text:l};if(s+=Lc(l),o.to>=e.state.doc.length||o.to>=t.to)break;o=e.state.doc.lineAt(o.to+1)}return null}function Lc(e){let t=0;const n=String(e);for(let o=0;o<n.length;o+=1){if(n[o]==="{"&&n[o+1]==="{"){const s=n.indexOf("}}",o+2);o=s===-1?n.length:s+1;continue}n[o]==="{"?t+=1:n[o]==="}"&&(t-=1)}return t}function le(e){return(String(e).match(/^\s*/)||[""])[0]}function Nt(e,t,n){for(let o=t.number-1;o>=1;o-=1){const s=e.state.doc.line(o),a=s.text.trim();if(!a)continue;const i=le(s.text);if(n&&(a==="{"||a.endsWith("{")))return`${i}  `;if(!(a==="}"||a.startsWith("}")))return i}return""}function Bc(e,t){const n=e.state.doc.lineAt(t);if(n.text.trim())return le(n.text);const o=Nt(e,n,!0);if(o)return o;const s=Wt();return s?aa(e,s):"  "}function aa(e,t){const n=e.state.doc.lineAt(t.from),o=e.state.doc.lineAt(Math.max(t.from,t.to));for(let a=o.number;a>=n.number;a-=1){const i=e.state.doc.line(a),l=Math.max(i.from,t.from),c=Math.min(i.to,t.to),d=e.state.doc.sliceString(l,c);if(d.trim())return(d.match(/^\s*/)||[""])[0]||"  "}return`${(e.state.doc.lineAt(Math.max(0,t.from-1)).text.match(/^\s*/)||[""])[0]}  `}function Fo(){v.css?.focus(),r.lastWin&&(ee(r.lastWin),B(r.lastWin))}function ra(e,t){if(!t)return"";const n=e.state.doc.toString();let o=0;for(let s=t.open-1;s>=0;s-=1)if(n[s]==="}"||n[s]==="{"||n[s]===";"){o=s+1;break}return n.slice(o,t.open).replace(/\/\*[\s\S]*?\*\//g,"").trim()}function Fc(e,t){if(!r.cssState||!t)return t;const n=ia(e,t);if(n)return n;const o=ra(e,t);if(!o||o.startsWith("@"))return t;const s=e.state.doc.toString(),a=xe(s,t.open),i=xe(s,t.to)||`${a}    `,l=(e.state.doc.sliceString(t.from,t.to).match(/\n([^\S\n]*)$/)||[null,null])[1],c=l===null?t.to:t.to-l.length,d=`
${i}&${Vt()} {
${i}}
${l??a}`;e.dispatch({changes:{from:c,to:t.to,insert:d}});const f=e.state.doc.toString(),h=f.indexOf("{",c+d.indexOf("&")),p=h===-1?-1:Ie(f,h);return p===-1?t:{from:h+1,to:p,text:f.slice(h+1,p),open:h}}function xe(e,t){const n=e.lastIndexOf(`
`,t-1)+1;return(e.slice(n,t).match(/^\s*/)||[""])[0]}function G(e){const t=v.css;if(!t||t.state.readOnly||!e.length)return;const n=Wt(),o=e.some(l=>l.value!=null)?Fc(t,n):n;if(!o){const l=e.filter(c=>c.value!=null).map(c=>`${c.property}: ${c.value};`).join(`
`);l&&Pc(l),Fo();return}const s=[],a=[],i=aa(t,o);for(const l of e){const c=Ec(t,o,l.property);if(l.value==null){if(!c)continue;let d=c.from,f=c.to;t.state.doc.sliceString(f,f+1)===`
`&&(f+=1),d=Math.max(d,o.from),f=Math.min(f,o.to),s.push({from:d,to:f});continue}if(!(c&&F(sa(c.text))===F(l.value)))if(c){const d=(c.text.match(/^\s*/)||[""])[0];s.push({from:c.from,to:c.to,insert:`${d}${l.property}: ${l.value};`})}else a.push(`${i}${l.property}: ${l.value};`)}if(a.length){const l=!o.text.includes(`
`)||!/\n\s*$/.test(o.text)?`
`:"",c=(o.text.match(/\n([^\S\n]*)$/)||[null,null])[1],d=c===null?o.to:o.to-c.length,f=c===null?"":c;s.push({from:d,to:o.to,insert:`${l}${a.join(`
`)}
${f}`})}s.length&&(s.sort((l,c)=>c.from-l.from||c.to-l.to),t.dispatch({changes:s})),Fo()}function Z(){const e=v.css,t=Wt();if(!t)return{};if(r.cssState&&e){const n=ia(e,t);return n?Bo(n.text):{}}return Bo(t.text)}function ia(e,t){const n=ra(e,t),o=Vt();if(!n||n.startsWith("@"))return null;if(n.endsWith(o))return t;const s=e.state.doc.toString(),a=i=>{const l=Ie(s,i);return l===-1?null:{from:i+1,to:l,text:s.slice(i+1,l),open:i}};for(const i of[`&${o}`,`${n}${o}`]){const l=new RegExp(`(^|[^\\w-])${i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\s*\\{`,"g");let c;for(;c=l.exec(s);){const d=s.indexOf("{",c.index);if(i.startsWith("&")&&(d<t.from||d>t.to))continue;const f=a(d);if(f)return f}}return null}function Ic(e){const t=Z(),n=Ye(t.display),o=F(t["flex-direction"])||(n?"row":"");if(n&&o===e){const s=[];t["flex-direction"]&&s.push({property:"flex-direction",value:null}),Ye(t.display)&&s.push({property:"display",value:null}),G(s);return}G([{property:"display",value:"flex"},{property:"flex-direction",value:e}])}function Oc(e){const t=Z();if(e==="flex"&&Ye(t.display)){G([{property:"justify-content",value:null},{property:"align-items",value:null},{property:"flex-direction",value:null},{property:"display",value:null}]);return}G([{property:"display",value:e}])}function Pc(e){const t=v.css;if(!t||t.state.readOnly)return;const n=t.state.selection.main.head,o=t.state.doc.lineAt(n),s=o.text.slice(0,n-o.from),a=o.text.slice(n-o.from),i=Bc(t,n),l=e.replace(/;?$/,";");if(s.trim()===""&&a.trim()===""){const d=`${i}${l}
${i}`;t.dispatch({changes:{from:o.from,to:o.to,insert:d},selection:{anchor:o.from+d.length}});return}const c=`
${i}${l}
${i}`;t.dispatch({changes:{from:n,to:t.state.selection.main.to,insert:c},selection:{anchor:n+c.length}})}function B(e){try{Dc(e),Se(e)}catch{}}function Dc(e){const t=r.styleMode==="tw",n=t?{}:Z(),o=Ye(t?po("display"):n.display),s=F(n["flex-direction"])||(o?"row":""),a=i=>t?Rr()&&!!i.tw&&!!po(i.tw):!!i.css&&i.css in n;fe.tools=sr.map(i=>{const l=(i.kids||[]).filter(c=>c.when!=="flex"||o).map(c=>({id:c.id,title:c.title,icon:Yo[c.icon]||"",sep:!!c.sep,open:r.cssOpenMenu===c.id,active:t?a(c):c.kind==="display"?o:c.kind==="flexDir"?o&&s===c.value:c.value?F(n[c.css])===F(c.value):a(c)}));return{id:i.id,title:i.title,icon:Yo[i.id]||yf[i.id]||"",open:r.cssOpenTool===i.id||r.cssOpenMenu===i.id,kids:l,active:i.value?!t&&F(n[i.css])===F(i.value):a(i)||l.some(c=>c.active)}})}function S(e){const t=e?.getElementById(x);r.cssOpenMenu="",t?._sveApp?.unmount(),t?.remove(),e?.querySelectorAll("[data-sve-css-tool][data-open], [data-sve-html-tool][data-open], [data-sve-css-add-class][data-open], [data-sve-code-history][data-open]").forEach(n=>n.removeAttribute("data-open"))}function Uf(e){S(e),N(e),ne(e);for(const t of se)v[t]&&Ra?.(v[t])}function la(e){if(r.cssColorsPromise)return r.cssColorsPromise;const t=e.Statamic?.$config?.get?.("cpUrl")||`/${e.Statamic?.$config?.get?.("cpRoute")||"cp"}`;return r.cssColorsPromise=e.fetch(`${t}/color-scheme/swatches`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async n=>{if(!n.ok)return[];const o=await n.json().catch(()=>[]);return Array.isArray(o)?o:[]}).catch(()=>[]).then(n=>{const o=new Set,s=[];for(const a of n){const i=a.var||a.value||a.handle,l=String(i||"").trim().replace(/^var\((.+)\)$/,"$1");!l||o.has(l)||(o.add(l),s.push({name:l,hex:a.hex||a.color||""}))}for(const[a,i]of or)o.has(a)||(o.add(a),s.push({name:a,hex:i}));return s}),r.cssColorsPromise}function ca(e,t){const n=Z()[t]||"",o=String(n).match(/^var\(\s*([^)]+?)\s*\)$/i),s=o?o[1].trim():"";for(const a of e.querySelectorAll("[data-sve-css-token]"))s&&a.getAttribute("data-sve-css-token")===s?a.setAttribute("data-active",""):a.removeAttribute("data-active")}function D(e,t,n){const o=t.getBoundingClientRect(),s=8,a=e.innerHeight-(o.bottom+4)-s,i=o.top-4-s;n.style.maxHeight="";const l=n.offsetHeight||0,c=l>a&&i>a;n.style.left=`${Math.max(s,Math.min(o.left,e.innerWidth-220))}px`,n.style.maxHeight=`${Math.max(120,c?i:a)}px`,n.style.top=c?`${Math.max(s,o.top-4-Math.min(l,i))}px`:`${Math.max(s,o.bottom+4)}px`}function zc(e,t,n){const o=e.document;S(o),t.setAttribute("data-open","");const s=o.createElement("div");s.id=x,o.body.appendChild(s),D(e,t,s);const a=i=>{s._sveApp?.unmount(),s._sveApp=z(Q,s,{kind:"colors",swatches:i,onClear:()=>{G([{property:n,value:null}]),S(o)},onPick:l=>{G([{property:n,value:`var(${l})`}]),S(o)}}),ca(s,n)};a(or.map(([i,l])=>({name:i,hex:l}))),la(e).then(i=>{o.getElementById(x)&&a(i.map(l=>({name:l.name,hex:l.hex})))})}function jc(e,t,n,o){const s=e.document;S(s),t.setAttribute("data-open","");const a=s.createElement("div"),i=Z()[n]||"";a.id=x,s.body.appendChild(a),D(e,t,a),a._sveApp=z(Q,a,{kind:"choices",choices:(o||[]).map(l=>({value:l,label:l,active:F(l)===F(i)})),onPick:l=>{const c=F(l)===F(Z()[n]||"");G([{property:n,value:c?null:l}]),S(s)}})}function Io(e,t,n,o=[]){const s=e.document;S(s),t.setAttribute("data-open",""),jr(e);const a=s.createElement("div");a.id=x,s.body.appendChild(a),D(e,t,a);const i=()=>{const l=[...o.map(d=>({value:d,label:d})),...Hr(e,n).map(d=>({value:d.value,label:d.value}))],c=Z()[n]||"";a._sveApp?.unmount(),a._sveApp=z(Q,a,{kind:"choices",choices:l.map(d=>({...d,active:F(d.value)===F(c)})),onPick:d=>{G([{property:n,value:d||null}]),S(s)}})};i(),la(e).then(()=>{s.getElementById(x)===a&&i()})}function Hc(e,t,n){const o=e.document;S(o),t.setAttribute("data-open","");const s=o.createElement("div");s.id=x,o.body.appendChild(s),D(e,t,s),s._sveApp=z(Q,s,{kind:"choices",choices:vf.map(a=>({value:a,token:a,label:a})),onPick:a=>{G([{property:n,value:`var(${a})`}]),S(o)}}),ca(s,n)}const Oo=/\{\{#[\s\S]*?#\}\}|\{\{[\s\S]*?\}\}/g,Po=/<!--[\s\S]*?-->/g,Do=/<(\/?)([A-Za-z][A-Za-z0-9-]*)/g,da=/^\{\{\s*(?:\/|endif\b|endunless\b)/,Rc=/^\{\{\s*(?:\/\s*(?:if|unless)\b|endif\b|endunless\b)/,Wc=/^\{\{\s*\/\s*partial\b/;function nn(e,t,n){return e.some(o=>t<o.to&&n>o.from)}function Nc(e){const t=new Map;for(const n of Wr(e)){const o=n.kind==="loop"?"loop":"if";t.set(n.from,o);const s=e.lastIndexOf("{{",n.to-2);s>=n.openTo&&da.test(e.slice(s,n.to))&&t.set(s,o)}for(const n of cs(e))t.set(n.from,"component");return t}function qc(e){const t=String(e||""),n=[],o=[];Po.lastIndex=0;let s;for(;s=Po.exec(t);)n.push({from:s.index,to:s.index+s[0].length});const a=Nc(t),i=[];for(Oo.lastIndex=0;s=Oo.exec(t);){const l=s.index,c=l+s[0].length,d=s[0];if(nn(n,l,c))continue;if(i.push({from:l,to:c}),d.startsWith("{{#")){o.push({from:l,to:c,cls:"comment"});continue}const f=da.test(d),h=a.get(l)||(f&&Rc.test(d)?"if":"")||(f&&Wc.test(d)?"component":"");o.push({from:l,to:c,cls:(h?`fam-${h}`:"antlers")+(f?"-close":"")})}for(Do.lastIndex=0;s=Do.exec(t);){const l=s.index+1+s[1].length,c=l+s[2].length;nn(n,l,c)||nn(i,l,c)||o.push({from:l,to:c,cls:`fam-${kr(s[2])}`})}return o.sort((l,c)=>l.from-c.from),o}function zo(e,t,n){const o=new t.RangeSetBuilder;let s=0;for(const a of qc(e.doc.toString()))a.from<s||(o.add(a.from,a.to,n(a.cls)),s=a.to);return o.finish()}function Vc(e){const t=new Map,n=a=>a==="comment"?"sve-cm-antlers-comment":a==="antlers"?"sve-cm-antlers":a==="antlers-close"?"sve-cm-antlers sve-cm-antlers-close":a.endsWith("-close")?`sve-cm-${a.slice(0,-6)} sve-cm-antlers-close`:`sve-cm-${a}`,o=a=>(t.has(a)||t.set(a,e.Decoration.mark({class:n(a)})),t.get(a));return{extensions:[e.StateField.define({create(a){return zo(a,e,o)},update(a,i){return i.docChanged?zo(i.state,e,o):a},provide:a=>e.EditorView.decorations.from(a)})]}}const M=kn({tag:"",emptyText:"",addLabel:"",dropTitle:"",chips:[],states:[],canEdit:!1,onAdd:null,onChip:null,onDrop:null}),Uc={class:"sve-al"},Kc={class:"sve-al-head"},Gc={key:0,class:"sve-al-tag"},Xc=["title","disabled"],Zc={key:0,class:"sve-al-empty"},Yc={class:"sve-al-chips"},Jc=["data-sve-al-chip","title","disabled","onClick"],Qc={class:"sve-al-name"},ed={key:0,class:"sve-al-value"},td=["title","onClick"],nd={__name:"AlpinePanel",setup(e){return(t,n)=>(k(),_("div",Uc,[b("div",Kc,[w(M).tag?(k(),_("span",Gc,"<"+A(w(M).tag)+">",1)):j("",!0),(k(!0),_(H,null,re(w(M).states,o=>(k(),_("span",{key:o,class:"sve-al-state"},A(o),1))),128)),n[1]||(n[1]=b("span",{class:"sve-al-gap"},null,-1)),b("button",{type:"button","data-sve-al-add":"",title:w(M).addLabel,disabled:!w(M).canEdit,onClick:n[0]||(n[0]=L(o=>w(M).onAdd?.(o),["prevent","stop"]))},"+",8,Xc)]),w(M).chips.length?j("",!0):(k(),_("div",Zc,A(w(M).emptyText),1)),b("div",Yc,[(k(!0),_(H,null,re(w(M).chips,o=>(k(),_("span",{key:o.id,class:"sve-al-chip-wrap"},[b("button",{type:"button","data-sve-al-chip":o.id,title:o.title,disabled:!w(M).canEdit,onClick:L(s=>w(M).onChip?.(s,o.id),["prevent","stop"])},[b("span",Qc,A(o.name),1),o.value?(k(),_("span",ed,A(o.value),1)):j("",!0)],8,Jc),w(M).canEdit?(k(),_("button",{key:0,type:"button",class:"sve-al-drop",title:w(M).dropTitle,onClick:L(s=>w(M).onDrop?.(o.id),["prevent","stop"])},"−",8,td)):j("",!0)]))),128))])]))}},od=ts(nd,[["__scopeId","data-v-15add965"]]),sd=[{id:"state",lang:"alpine_group_state"},{id:"act",lang:"alpine_group_act"},{id:"react",lang:"alpine_group_react"}],jo=[{id:"state",group:"state",label:"alpine_state",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: false }"}]},{id:"state_text",group:"state",label:"alpine_state_text",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: '|' }"}]},{id:"toggle",group:"act",label:"alpine_toggle",icon:"toggle",needsName:!0,attrs:[{name:"@click",value:":name = !:name"}]},{id:"open",group:"act",label:"alpine_open",icon:"open",needsName:!0,attrs:[{name:"@click",value:":name = true"}]},{id:"close",group:"act",label:"alpine_close",icon:"close",needsName:!0,attrs:[{name:"@click",value:":name = false"}]},{id:"open_hover",group:"act",label:"alpine_open_hover",icon:"open",needsName:!0,attrs:[{name:"@mouseenter",value:":name = true"}]},{id:"close_leave",group:"act",label:"alpine_close_leave",icon:"close",needsName:!0,attrs:[{name:"@mouseleave",value:":name = false"}]},{id:"open_focus",group:"act",label:"alpine_open_focus",icon:"open",needsName:!0,attrs:[{name:"@focusin",value:":name = true"}]},{id:"close_blur",group:"act",label:"alpine_close_blur",icon:"close",needsName:!0,attrs:[{name:"@focusout",value:":name = false"}]},{id:"close_outside",group:"act",label:"alpine_close_outside",icon:"outside",needsName:!0,attrs:[{name:"@click.outside",value:":name = false"}]},{id:"close_escape",group:"act",label:"alpine_close_escape",icon:"escape",needsName:!0,attrs:[{name:"@keydown.escape.window",value:":name = false"}]},{id:"show",group:"react",label:"alpine_show",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"}]},{id:"show_smooth",group:"react",label:"alpine_show_smooth",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"},{name:"x-transition",value:""}]},{id:"hide_until_ready",group:"react",label:"alpine_hide_until_ready",icon:"cloak",attrs:[{name:"x-cloak",value:""}]},{id:"class_when",group:"react",label:"alpine_class_when",icon:"klass",needsName:!0,attrs:[{name:":class",value:":name ? '|' : ''"}]},{id:"text",group:"react",label:"alpine_text",icon:"text",needsName:!0,attrs:[{name:"x-text",value:":name"}]}];function ad(e){return(e?.attrs||[]).map(t=>t.name).join(" ")}const rd=/^(x-[\w:.-]+|@[\w:.-]+|:[\w-]+)$/;function id(e){return rd.test(String(e||""))}function at(e){const t=String(e||""),n=[],o=/([@:a-zA-Z_][\w:.@-]*)(\s*=\s*(["'])([\s\S]*?)\3)?/g;let s,a=!0;for(;s=o.exec(t);){if(a){a=!1;continue}s[0].trim()&&n.push({name:s[1],value:s[4]??"",from:s.index,to:s.index+s[0].length,alpine:id(s[1])})}return n}function ua(e){const t=String(e||"").trim().replace(/^\{|\}$/g,""),n=[],o=/(^|,)\s*([a-zA-Z_$][\w$]*)\s*:/g;let s;for(;s=o.exec(t);)n.push(s[2]);return n}function ld(e,t){return e.map(n=>({name:n.name,value:String(n.value).replaceAll(":name:",`${t}:`).replaceAll(":name",t)}))}function Gn(e,t,n){const o=v.html,s=Ce();if(!o||o.state.readOnly||!s)return;const a=r.htmlScopeActive&&!!r.htmlFocus,i=a?r.htmlFocus.from:0,c=(a?r.htmlFull:o.state.doc.toString()).slice(s.from,s.openTo),d=n===""?t:`${t}="${n}"`,f=at(c).find(p=>p.name===t);let h;if(f)h=c.slice(0,f.from)+d+c.slice(f.to);else{const p=c.search(/\s|\/?>$/);h=p===-1?c:`${c.slice(0,p)} ${d}${c.slice(p)}`}h!==c&&(be(o,[{from:s.from-i,to:s.openTo-i,insert:h}],null),qt(e))}function cd(e,t){const n=v.html,o=Ce();if(!n||n.state.readOnly||!o)return;const s=r.htmlScopeActive&&!!r.htmlFocus,a=s?r.htmlFocus.from:0,l=(s?r.htmlFull:n.state.doc.toString()).slice(o.from,o.openTo),c=at(l).find(h=>h.name===t);if(!c)return;let d=c.from;for(;d>0&&/\s/.test(l[d-1]);)d-=1;const f=l.slice(0,d)+l.slice(c.to);be(n,[{from:o.from-a,to:o.openTo-a,insert:f}],null),qt(e)}function fn(e){const t=v.html;if(!t)return[];const o=r.htmlScopeActive&&!!r.htmlFocus?r.htmlFull:t.state.doc.toString(),s=Ce(),a=[],i=fs(Tn(o),new Set);for(const l of i){if(!s||l.from>s.from||l.to<s.to)continue;const c=at(o.slice(l.from,l.openTo)).find(d=>d.name==="x-data");c&&a.push(...ua(c.value))}return[...new Set(a)]}function dd(e){const t=v.html,n=Ce();if(!t||!n)return[];const s=r.htmlScopeActive&&!!r.htmlFocus?r.htmlFull:t.state.doc.toString(),a=at(s.slice(n.from,n.openTo)).find(i=>i.name==="x-data");return a?ua(a.value):[]}function ud(e,t){const n=e.document;S(n),t.setAttribute("data-open","");const o=fn(),s=n.createElement("div");s.id=x,n.body.appendChild(s),D(e,t,s);const a=!o.length,i=!a&&!dd().length,c=sd.filter(d=>d.id==="state"?!i:!a).flatMap(d=>{const f=jo.filter(h=>h.group===d.id);return f.length?[{value:`\0${d.id}`,label:m(e,a&&d.id==="state"?"alpine_group_state_first":d.lang),heading:!0},...f.map(h=>({value:h.id,label:m(e,h.label),hint:ad(h)}))]:[]});a&&c.push({value:"\0note",label:m(e,"alpine_needs_state"),note:!0}),s._sveApp=z(Q,s,{kind:"choices",choices:c,onPick:d=>{const f=jo.find(h=>h.id===d);if(S(n),!!f){if(!f.needsName){for(const h of f.attrs)Gn(e,h.name,h.value);return}fd(e,t,f,o)}}})}function fd(e,t,n,o){const s=e.document,a=l=>{const c=String(l||"").trim().replace(/[^\w$]/g,"");if(S(s),!!c)for(const d of ld(n.attrs,c))Gn(e,d.name,d.value.replace("|",""))};if(!o.length){hn(e,t,a);return}const i=s.createElement("div");i.id=x,s.body.appendChild(i),D(e,t,i),i._sveApp=z(Q,i,{kind:"choices",choices:[{value:"\0head",label:m(e,"alpine_name"),heading:!0},...o.map(l=>({value:l,label:l})),{value:"\0new",label:m(e,"alpine_new_name")}],onPick:l=>{if(l==="\0new"){hn(e,t,a);return}a(l)}})}function hn(e,t,n){const o=e.document;S(o),t.setAttribute("data-open","");const s=o.createElement("div");s.id=x,o.body.appendChild(s),D(e,t,s),s._sveApp=z(jn,s,{label:m(e,"alpine_name"),placeholder:m(e,"alpine_name_placeholder"),onAdd:a=>n(a)})}function qt(e){const n=e?.document.getElementById(u)?.querySelector("[data-sve-alpine-host]");if(!n)return;const o=Ce(),s=v.html,a=r.htmlScopeActive&&!!r.htmlFocus,i=s?a?r.htmlFull:s.state.doc.toString():"",l=o?at(i.slice(o.from,o.openTo)):[];M.tag=o?.tag||"",M.canEdit=!r.lastLocked&&!!o,M.emptyText=m(e,o?fn().length?"alpine_none_ready":"alpine_none":"alpine_pick"),M.addLabel=m(e,"alpine_add"),M.dropTitle=m(e,"alpine_remove"),M.states=fn(),M.chips=l.filter(c=>c.alpine).map(c=>({id:c.name,name:c.name,value:c.value,title:c.value?`${c.name}="${c.value}"`:c.name})),M.onAdd=c=>ud(e,c.currentTarget),M.onDrop=c=>cd(e,c),M.onChip=(c,d)=>{M.chips.find(h=>h.id===d)&&hn(e,c.currentTarget,h=>Gn(e,d,h))},n._sveMounted||(n._sveMounted=!0,Qe(n,od))}const hd=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]),pd=new Set(["html","head","body"]),Ho=new Set(["if","unless","style_push","script_push","sve_defaults","once","noparse","foreach","forelse","loop","cache","nocache","scope","collection","nav","structure","taxonomy","users","search:results","form:create","form:errors"]),md=new Set(["collection:count"]);function Ro(e){return md.has(e)?!1:Ho.has(e)||Ho.has(e.split(":")[0])}const gd=new Set(["CloseTag","MismatchedCloseTag","IncompleteCloseTag"]),vd=/^\s*(\/?)\s*([A-Za-z_][A-Za-z0-9_.:-]*)([\s\S]*)$/,yd=/^\{\{\s*\/?\s*([A-Za-z_][A-Za-z0-9_.:-]*)/,bd=3e5;function xd(e){const t=String(e||""),n=[],o=[];let s=0;for(;s<t.length;){const a=t.indexOf("{{",s);if(a===-1)break;if(t.startsWith("{{#",a)){const d=t.indexOf("#}}",a+3);if(d===-1){o.push(a);break}n.push({from:a,to:d+3,comment:!0,body:""}),s=d+3;continue}let i=0,l=a,c=-1;for(;l<t.length;){if(t.startsWith("{{",l)){i+=1,l+=2;continue}if(t.startsWith("}}",l)){if(i-=1,l+=2,i===0){c=l;break}continue}l+=1}if(c===-1){o.push(a),s=a+2;continue}n.push({from:a,to:c,comment:!1,body:t.slice(a+2,c-2)}),s=c}return{tags:n,unclosed:o}}function kd(e,t){let n=e;for(const o of t)n=n.slice(0,o.from)+" ".repeat(o.to-o.from)+n.slice(o.to);return n}function _d(e,t){return e===t||e.startsWith(`${t}:`)}function ut(e,t){return(e.slice(t,t+80).match(/^<\/?([A-Za-z][A-Za-z0-9:-]*)/)?.[1]||"").toLowerCase()}function Sd(e,t,n,o,s){const a=c=>s.has(c.name)&&!/\||\?\?/.test(c.rest);for(const c of n){const d=e.slice(c,c+80).match(yd)?.[1]||"…";o.push({from:c,to:c+2,key:"code_dock_problem_antlers_unclosed",args:{name:d}})}const i=[],l=[];for(const c of t){if(c.comment)continue;const d=c.body.match(vd);if(!d)continue;const f=!!d[1],h=d[2].toLowerCase(),p=d[3];if(!f&&(h==="elseif"||h==="else")){let y=-1;for(let g=i.length-1;g>=0;g-=1)if(i[g].name==="if"||i[g].name==="unless"){y=g;break}if(y===-1){o.push({from:c.from,to:c.to,key:"code_dock_problem_branch_stray",args:{name:h}});continue}l.push({from:i[y].to,to:c.from}),i[y]={...i[y],to:c.to},i.length=y+1;continue}if(f||h==="endif"||h==="endunless"){const y=h==="endif"?"if":h==="endunless"?"unless":h;let g=-1;for(let E=i.length-1;E>=0;E-=1)if(_d(i[E].name,y)){g=E;break}if(g===-1){o.push({from:c.from,to:c.to,key:"code_dock_problem_pair_stray",args:{name:y}});continue}for(const E of i.slice(g+1))Ro(E.name)&&o.push({from:E.from,to:E.to,key:"code_dock_problem_pair_unclosed",args:{name:E.name}});(y==="if"||y==="unless")&&l.push({from:i[g].to,to:c.from}),i.length=g;continue}p.trim().startsWith("=")||i.push({name:h,rest:p,from:c.from,to:c.to})}for(const c of i)Ro(c.name)?o.push({from:c.from,to:c.to,key:"code_dock_problem_pair_unclosed",args:{name:c.name}}):a(c)&&o.push({from:c.from,to:c.to,key:"code_dock_problem_list_unclosed",args:{name:c.name}});return l}function wd(e,t,n,o){const s=t.parse(e),a=new Set,i=[];s.iterate({enter(l){if(l.name==="MismatchedCloseTag"){i.push({from:l.from,to:l.to,key:"code_dock_problem_tag_stray",args:{tag:ut(e,l.from)}});return}if(l.name==="IncompleteCloseTag"){i.push({from:l.from,to:l.to,key:"code_dock_problem_tag_unfinished",args:{tag:ut(e,l.from)}});return}if(l.type.isError){const h=l.node.parent;h&&(h.name==="OpenTag"||h.name==="CloseTag")&&(a.add(h.from),i.push({from:h.from,to:Math.max(h.from+1,l.from),key:"code_dock_problem_tag_unfinished",args:{tag:ut(e,h.from)}}));return}if(l.name!=="Element")return;let c=null,d=!1;for(let h=l.node.firstChild;h;h=h.nextSibling)h.name==="OpenTag"&&(c=h),gd.has(h.name)&&(d=!0);if(!c||d)return;const f=ut(e,c.from);!f||hd.has(f)||pd.has(f)||n.some(h=>c.from>=h.from&&c.from<h.to&&l.to>h.to)||i.push({from:c.from,to:c.to,key:"code_dock_problem_tag_unclosed",args:{tag:f}})}});for(const l of i)l.key==="code_dock_problem_tag_unclosed"&&a.has(l.from)||l.args.tag&&o.push(l)}function $d(e,t,n={}){const o=String(e||"");if(!o.trim()||o.length>bd)return[];const s=[];try{const{tags:i,unclosed:l}=xd(o),c=Sd(o,i,l,s,new Set(n.lists||[]));t&&wd(kd(o,i),t,c,s)}catch{return[]}const a=new Set;return s.sort((i,l)=>i.from-l.from||i.to-l.to).filter(i=>{const l=`${i.from}:${i.key}`;return a.has(l)?!1:(a.add(l),!0)})}function Cd(e,t,n=()=>({})){const o=e.Decoration.mark({class:"sve-cm-problem"}),s=e.StateEffect.define(),a=l=>{const c=$d(l.doc.toString(),t,n()),d=new e.RangeSetBuilder;let f=0;for(const h of c)h.from<f||h.to<=h.from||(d.add(h.from,h.to,o),f=h.to);return{problems:c,decorations:d.finish()}},i=e.StateField.define({create(l){return a(l)},update(l,c){return c.docChanged||c.effects.some(d=>d.is(s))?a(c.state):l},provide:l=>e.EditorView.decorations.from(l,c=>c.decorations)});return{field:i,relint:s,extensions:[i]}}const Td=new Set(["replicator","grid","list","array","table"]);let gt=new Set,on=null;function fa(e){return e.document.getElementById(u)?.querySelector("[data-sve-html-problems]")||null}function Ad(e,t,n){const o=fa(e);if(!o)return;const s=t.state.doc,a=n.map(c=>({from:c.from,line:s.lineAt(Math.min(c.from,s.length)).number,text:m(e,c.key,c.args)})),i=a.map(c=>`${c.line}:${c.text}`).join(`
`);if(o.dataset.sveSignature===i||(o.dataset.sveSignature=i,o.hidden=a.length===0,o.replaceChildren(),!a.length))return;const l=e.document.createElement("span");l.setAttribute("data-sve-problems-title",""),l.textContent=m(e,"code_dock_problems_title"),o.appendChild(l);for(const c of a){const d=e.document.createElement("button"),f=e.document.createElement("b");d.type="button",d.dataset.sveProblemAt=String(c.from),f.textContent=m(e,"code_dock_problem_line",{line:c.line}),d.append(f,e.document.createTextNode(` ${c.text}`)),o.appendChild(d)}}function Md(e){const t=fa(e);!t||t._sveBound||(t._sveBound=!0,t.addEventListener("mousedown",n=>n.preventDefault()),t.addEventListener("click",n=>{const o=n.target.closest("[data-sve-problem-at]"),s=v.html;if(!o||!s)return;n.preventDefault(),n.stopPropagation();const a=Math.min(Number(o.dataset.sveProblemAt)||0,s.state.doc.length);s.dispatch({selection:{anchor:a},effects:I.scrollIntoView(a,{y:"center"})}),s.focus()}))}function Ed(e){const t=[],n=o=>{for(const s of o||[])s?.loop&&Td.has(s.type)&&s.var&&!s.parent&&t.push(s.var)};n(e?.section);for(const o of e?.page||[])n(o?.items);return t}function Ld(e,t,n){const o={collection:Ts(e),set:As(r.lastType),view:"",scope:""},s=o.set?Fn(o):"";if(s===on)return;on=s;const a=l=>{if(on!==s)return;const c=new Set(Ed(l)),d=c.size===gt.size&&[...c].every(f=>gt.has(f));gt=c,!d&&v.html===t&&e.queueMicrotask(()=>{v.html===t&&t.dispatch({effects:n.of(null)})})};if(!s){a(null);return}const i=Ms(s);if(i){a(i);return}Es(e,o).then(a)}function Bd(e){if(!r.htmlLintUi){const{field:t,relint:n}=Cd({Decoration:J,StateField:de,StateEffect:je,RangeSetBuilder:ue,EditorView:I},Ct.parser,()=>({lists:gt})),o=I.updateListener.of(s=>{const a=s.transactions.some(i=>i.effects.some(l=>l.is(n)));!s.docChanged&&!a||(s.docChanged&&Ld(e,s.view,n),Ad(e,s.view,s.state.field(t).problems))});r.htmlLintUi={extensions:[t,o]}}return Md(e),r.htmlLintUi}const Wo=/\{\{\s*(?:vite\b[^}]*|yield_[a-z_]+|theme_tokens)\s*\}\}/g;function Fd(e,t=[]){const n=[];Wo.lastIndex=0;let o;for(;o=Wo.exec(String(e||""));)n.push(o.index,o.index+o[0].length);if(!t||!t.length)return n;const s=[];for(const a of[n,t])for(let i=0;i+1<a.length;i+=2)s.push([a[i],a[i+1]]);return s.sort((a,i)=>a[0]-i[0]||a[1]-i[1]).flat()}const Id=["input","delete","move"];function Od(e){return Id.some(t=>e(t))}let sn={text:null,ranges:[]};function ha(e){return sn.text!==e&&(sn={text:e,ranges:Fd(e,e.includes("sve-lock")?Nr(e):[])}),sn.ranges}function No(e,t){const n=new ue,o=ha(e.doc.toString());for(let s=0;s<o.length;s+=2)n.add(o[s],o[s+1],t);return n.finish()}let ft=null;function Pd(){if(ft)return ft;const e=J.mark({class:"sve-dock-locked"}),t=de.define({create:o=>No(o,e),update:(o,s)=>s.docChanged?No(s.state,e):o,provide:o=>I.decorations.from(o)}),n=I.baseTheme({".sve-dock-locked":{opacity:".55",borderRadius:".1875rem",backgroundColor:"rgba(127,127,127,.14)",cursor:"not-allowed"}});return ft={extensions:[t,n,Je.changeFilter.of(o=>Od(s=>o.isUserEvent(s))?ha(o.startState.doc.toString()):!0)]},ft}function Dd(){if(r.cssGhostUi)return r.cssGhostUi;const e=J.mark({class:"sve-css-ghost"}),t=n=>{const o=new ue;if(!r.lastWin)return o.finish();try{for(const s of xl(n.doc.toString(),ge(r.lastWin)))o.add(s.from,s.to,e)}catch{}return o.finish()};return r.cssGhostUi=de.define({create:n=>t(n),update:(n,o)=>o.docChanged?t(o.state):n,provide:n=>I.decorations.from(n)}),r.cssGhostUi}let ht=null,wt=null;function zd(){if(ht)return ht;wt=je.define();const e=J.line({class:"sve-css-id"}),t=n=>{const o=new ue;if(!r.lastWin||!r.cssValues)return o.finish();try{const s=n.doc;for(const a of bt(s.toString(),ge(r.lastWin),r.cssSize)){const i=s.lineAt(Math.min(a.from,s.length)).number,l=s.lineAt(Math.min(Math.max(a.to-1,a.from),s.length)).number;for(let c=i;c<=l;c+=1)o.add(s.line(c).from,s.line(c).from,e)}}catch{}return o.finish()};return ht=de.define({create:n=>t(n),update:(n,o)=>o.docChanged||o.effects.some(s=>s.is(wt))?t(o.state):n,provide:n=>I.decorations.from(n)}),ht}function Xn(){wt&&v.css&&v.css.dispatch({effects:wt.of(null)})}function jd(){return r.htmlPartialUi||(r.htmlPartialUi=Ur({Decoration:J,StateField:de,StateEffect:je,RangeSetBuilder:ue,EditorView:I})),r.htmlPartialUi}function Hd(){return r.htmlAntlersUi||(r.htmlAntlersUi=Vc({Decoration:J,StateField:de,RangeSetBuilder:ue,EditorView:I})),r.htmlAntlersUi}function Rd(){return r.htmlClassTokenUi||(r.htmlClassTokenUi=_i({Decoration:J,StateField:de,StateEffect:je,RangeSetBuilder:ue,EditorView:I})),r.htmlClassTokenUi}function Wd(e,t,n){v[t]?.destroy();const o=gn.of([{key:"Mod-s",run:()=>(R(e.document),!0)}]);v[t]=new I({state:Je.create({doc:"",extensions:[La(),Ba(),Fa(),Da(),Ru(t),ja(),za({tooltipClass:()=>"sve-tw-complete"}),...t==="html"?[Ct.data.of({autocomplete:qr(e)}),Ct.data.of({autocomplete:Hl(e)}),Rl(e),Vr(Na,e)]:[],...t==="html"?[...oi(),si()]:[],...t==="css"?[Ka(),Dd(),zd()]:[],gn.of([...Ia,...t==="html"?[{key:"Tab",run:ai}]:[],Oa,...Pa,...Wa,...Ha]),o,I.lineWrapping,...t==="html"||t==="css"?jd().extensions:[],...t==="html"?Hd().extensions:[],...t==="html"?Bd(e).extensions:[],...t==="html"?Pd().extensions:[],...t==="html"?Rd().extensions:[],Ue[t].of(Je.readOnly.of(!!r.lastLocked)),Ke[t].of(I.editable.of(!r.lastLocked)),I.updateListener.of(s=>{t==="html"&&s.docChanged&&!r.applying&&(uc(),Sn("dock:html-changed")),t==="css"&&s.docChanged&&!r.applying&&fc(),s.docChanged&&ee(e),t==="css"&&(s.docChanged||s.selectionSet)&&B(e),t==="css"&&s.docChanged&&!r.applying&&rt(e),t==="html"&&(s.docChanged||s.selectionSet)&&(Rt(e),qt(e),r.applying||it(e))}),...rr(C,{height:"auto",background:"#1E1E21",scroller:{overflow:"visible",height:"auto",minHeight:0},extraTags:s=>[{tag:s.tagName,color:"#4ec9b0"},{tag:s.attributeName,color:"#9cdcfe"},{tag:s.attributeValue,color:"#ce9178"},{tag:s.angleBracket,color:"#808080"}]})]}),parent:n})}function Nd(e){if(!e||e.querySelector(".cm-editor"))return;e.replaceChildren();const t=e.ownerDocument.createElement("span");t.style.cssText="width:16px;height:16px;margin:12px;border:2px solid #858585;border-right-color:transparent;border-radius:50%;display:block;animation:sve-cm-wait .6s linear infinite",e.appendChild(t)}function ge(e){return wn(e).map(t=>({handle:t.handle,base:t.base,max:t.max,media:t.media,media_px:t.media_px,label:t.label}))}function pa(e,t){return ge(e).find(n=>n.handle===t)||null}function Vt(e=r.cssState){return e?e==="before"||e==="after"?`::${e}`:`:${e}`:""}function rt(e,t=!1){const n=v.css;if(!n||!vn||!yn)return;const o=n.state.doc.toString(),s=`${r.cssValues?"1":"0"}|${r.cssSize}|${It(o).map(f=>`${f.from}-${f.to}`).join(",")}`;if(!t&&s===r.cssFoldSig)return;r.cssFoldSig=s;const a=ge(e),i=new Map,l=[...yl(o,a,r.cssSize),...r.cssValues?[]:bt(o,a,r.cssSize).map(f=>({from:f.from,to:f.to}))];for(const f of l)f.to>f.from&&i.set(`${f.from}:${f.to}`,{from:f.from,to:f.to});const c=[],d=new Set;Ga(n.state).between(0,o.length,(f,h)=>{const p=`${f}:${h}`;d.add(p),!i.has(p)&&r.cssOwnFolds.has(p)&&c.push(yn.of({from:f,to:h}))});for(const[f,h]of i)d.has(f)||c.push(vn.of(h));r.cssOwnFolds=new Set(i.keys()),c.length&&n.dispatch({effects:c})}function pn(e,t){const n=r.cssFull||t;return/max-width/i.test(n)&&!/width\s*</i.test(n)&&e.media_px||e.media}function qd(e,t){const n=v.css;if(!n||n.state.readOnly)return;const o=ge(e),s=pa(e,t),a=n.state.doc.toString();if(!s||s.base){const f=n.state.selection.main.head,h=It(a).find(p=>f>=p.from&&f<=p.to);h&&n.dispatch({selection:{anchor:h.from},scrollIntoView:!0});return}const i=On(a,o,t);if(i.length){const f=i[0],h=Math.min(f.bodyTo,f.bodyFrom+(a.slice(f.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);n.dispatch({selection:{anchor:h},scrollIntoView:!0});return}const l=pn(s,a),c=ma(n,a),d=`

${c.indent}@media ${l} {
${c.indent}    
${c.indent}}${c.suffix}`;n.dispatch({changes:{from:c.at,to:c.at,insert:d},selection:{anchor:c.at+d.lastIndexOf("    ")+4},scrollIntoView:!0})}function ma(e,t){const n=It(t);if(n.length){const i=n[n.length-1];return{at:i.to,indent:xe(t,i.from),suffix:""}}const o=i=>({at:i.to,indent:xe(t,i.to)||`${xe(t,i.open)}    `,suffix:`
${xe(t,i.open)}`}),s=Wt();if(s)return o(s);const a=Vd(t);return a?o(a):{at:t.length,indent:"",suffix:""}}function Vd(e){const t=String(e||"");let n=null,o=0,s=0;for(;o<t.length;){if(t[o]==="}"||t[o]===";"){o+=1,s=o;continue}if(t[o]!=="{"){o+=1;continue}const a=Ie(t,o);if(a===-1||n||(n=t.slice(s,o).trim().startsWith("@")?null:{from:s,open:o,to:a},!n))return null;o=a+1,s=o}return n}function Ud(e,t){const n=t===r.cssSize?"":t;r.cssSize=n,q(e,Yn,n),ae("lp:set-device",{win:e,key:n?_r(n,e):"Responsive"}),n&&qd(e,n),r.cssValues&&va(e),rt(e,!0),Xn(),Se(e),B(e)}function Kd(e,t){r.cssState=Jn.includes(t)?t:"",q(e,mn,r.cssState),S(e.document),Se(e),B(e)}function Gd(e,t){const n=e.document;S(n),t.setAttribute("data-open","");const o=n.createElement("div");o.id=x,n.body.appendChild(o),D(e,t,o),o._sveApp=z(Q,o,{kind:"choices",choices:[{value:"",label:m(e,"css_state_none"),active:!r.cssState},...Jn.map(s=>({value:s,label:Vt(s),active:s===r.cssState}))],onPick:s=>Kd(e,s)})}function Se(e){const n=e?.document.getElementById(u)?.querySelector("[data-sve-css-head]");if(!n)return;const o=Ce(),s=ge(e),a=v.css?.state.doc.toString()??"";$.tag=o?.tag||"",$.scope=li(o?$e().slice(o.from,o.openTo):"")||"";const i=$.scope,l=Dn(e,i);$.scopeElsewhere=[...new Set(l.map(c=>String(c.file).replace(/^.*\//,"")))],$.scopeElsewhereTitle=$.scopeElsewhere.length?`${m(e,"class_defined_in",{file:$.scopeElsewhere.join(", ")})} — ${m(e,"class_defined_import")}`:"",$.onScopeImport=()=>{zn(e,i)&&Se(e)},i&&!Ps()&&Pn(e).then(()=>Se(e)),$.canEdit=!r.lastLocked,$.onTag=c=>Kr(e,c.currentTarget,o),$.state=r.cssState,$.stateLabel=r.cssState?Vt(r.cssState):m(e,"css_state"),$.onState=c=>Gd(e,c.currentTarget),$.onSize=c=>Ud(e,c),$.sizes=[{key:"",label:m(e,"tw_size_all"),title:m(e,"css_size_all_title"),active:!r.cssSize},...s.map(c=>{const d=c.base||On(a,s,c.handle).length>0;return{key:c.handle,label:c.label,title:c.base?m(e,"css_size_base_title"):`@media ${c.media}${d?"":`  ·  ${m(e,"css_size_new")}`}`,active:r.cssSize===c.handle}})],n._sveMounted||(n._sveMounted=!0,Qe(n,Ml))}At("lp:device",e=>{const t=r.lastWin;if(!t||!ba(t.document))return;const n=wn(t).find(o=>o.device===e)?.handle||"";n!==r.cssSize&&(r.cssSize=n,q(t,Yn,n),rt(t,!0),Xn(),Se(t),B(t))});function Xd(e){const t=Math.max(0,Math.round(Date.now()/1e3-e)),n=new Date(e*1e3).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});let o=n;try{const s=new Intl.RelativeTimeFormat(void 0,{numeric:"auto"});t<90?o=s.format(-t,"second"):t<5400?o=s.format(-Math.round(t/60),"minute"):t<86400?o=s.format(-Math.round(t/3600),"hour"):o=s.format(-Math.round(t/86400),"day")}catch{}return`${o} · ${n}`}function ga(e,t){return e.fetch(t,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}})}async function Zd(e,t){const n=e.document,o=ve();if(S(n),!o)return;let s=[];try{const i=await ga(e,`/!/sve/section-template/history?type=${encodeURIComponent(o)}`);i.ok&&(s=(await i.json())?.entries||[])}catch{s=[]}if(!n.getElementById(u)||!n.contains(t))return;t.setAttribute("data-open","");const a=n.createElement("div");a.id=x,n.body.appendChild(a),D(e,t,a),a._sveApp=z(Q,a,{kind:"choices",choices:s.length?s.map(i=>({value:i.id,label:Xd(i.at)})):[{value:"",label:m(e,"code_dock_history_empty")}],onPick:i=>{S(n),i&&Yd(e,o,i)}})}async function Yd(e,t,n){if(me())return;let o=null;try{const s=await ga(e,`/!/sve/section-template/history/entry?type=${encodeURIComponent(t)}&id=${encodeURIComponent(n)}`);s.ok&&(o=await s.json())}catch{o=null}!o||me()||(De({html:o.html??"",css:o.css??"",js:o.js??""},r.lastLocked),ee(e),it(e))}function Ee(e){const t=e?.document.getElementById(u)?.querySelector("[data-sve-code-strip]");if(!t)return;t.hidden=r.styleMode!=="tw";const n=hs(e);t.innerHTML=bf,t.title=m(e,n?"tw_strip_on":"tw_strip_off"),t.setAttribute("aria-label",t.title),t.setAttribute("aria-pressed",n?"true":"false")}function Jd(e,t){const n=t.querySelector("[data-sve-code-strip]");!n||n._sveBound||(n._sveBound=!0,n.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),Gr(e,!hs(e)),Ee(e),Xr(e)}),Ee(e))}function Qd(e,t){const n=t.querySelector("[data-sve-code-history]");!n||n._sveBound||(n._sveBound=!0,n.innerHTML=xf,n.title=m(e,"code_dock_history"),n.setAttribute("aria-label",n.title),n.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),n.hasAttribute("data-open")){S(e.document);return}Zd(e,n)}))}function Kf(){return r.styleMode}function eu(e){return r.styleMode==="tw"?Ce():null}function Ce(e){const t=v.html;if(!t)return null;const n=r.htmlScopeActive&&!!r.htmlFocus,o=n?r.htmlFull:t.state.doc.toString(),a=(n?r.htmlFocus.from:0)+t.state.selection.main.from,i=fs(Tn(o),new Set);let l=null;for(const c of i)c.from<=a&&a<c.to&&(l=c);return l}function it(e){r.styleMode==="tw"&&Zr(e,eu())}function Zn(e){const t=e?.document.getElementById(u),n=t?.querySelector("[data-sve-values-mode]");if(!t||!n)return;t.setAttribute("data-sve-values",r.cssValues?"on":"off");const o=e.document.createElement("span");o.textContent=m(e,"code_dock_values"),n.innerHTML=_f,n.appendChild(o),n.title=m(e,r.cssValues?"code_dock_values_off":"code_dock_values_on"),n.setAttribute("aria-label",n.title),n.setAttribute("aria-pressed",r.cssValues?"true":"false")}function va(e){const t=v.css;if(!t||t.state.readOnly)return;const n=ge(e),o=t.state.doc.toString(),s=bt(o,n,r.cssSize);if(t.focus(),s.length){const p=s[0],y=Math.min(p.bodyTo,p.bodyFrom+(o.slice(p.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);t.dispatch({selection:{anchor:y},scrollIntoView:!0});return}const a=pa(e,r.cssSize);if(!a||a.base){const p=`#id-{{ id }} {
    `;t.dispatch({changes:{from:0,to:0,insert:`${p}
}

`},selection:{anchor:p.length},scrollIntoView:!0});return}const i=On(o,n,r.cssSize)[0];if(i){const p=`${xe(o,i.from)}    `,y=`
${p}#id-{{ id }} {
${p}    `;t.dispatch({changes:{from:i.bodyFrom,to:i.bodyFrom,insert:`${y}
${p}}
`},selection:{anchor:i.bodyFrom+y.length},scrollIntoView:!0});return}const l=ma(t,o),c=`${l.indent}    `,d=bt(o,n,"").some(p=>l.at>p.bodyFrom&&l.at<=p.bodyTo),f=d?`

${l.indent}@media ${pn(a,o)} {
${c}`:`

${l.indent}@media ${pn(a,o)} {
${c}#id-{{ id }} {
${c}    `,h=d?`
${l.indent}}${l.suffix}`:`
${c}}
${l.indent}}${l.suffix}`;t.dispatch({changes:{from:l.at,to:l.at,insert:`${f}${h}`},selection:{anchor:l.at+f.length},scrollIntoView:!0})}function tu(e,t){r.cssValues=!!t,q(e,ao,r.cssValues?"1":"0"),S(e.document),r.cssOpenTool="",Zn(e),ce(),nt(),r.cssValues&&va(e),rt(e,!0),Xn(),Se(e),B(e)}function Ut(e){const t=e?.document.getElementById(u);if(!t)return;const n=r.styleMode==="tw";t.setAttribute("data-sve-style",r.styleMode);const o=t.querySelector("[data-sve-css-label]");o&&(o.textContent=n?m(e,"code_dock_style_tw"):m(e,"code_dock_css"));const s=t.querySelector("[data-sve-style-mode]");if(!s)return;const a=e.document.createElement("span");a.textContent=n?m(e,"code_dock_style_tw"):m(e,"code_dock_css"),s.innerHTML=n?Sf:kf,s.appendChild(a),s.title=m(e,n?"code_dock_style_to_css":"code_dock_style_to_tw"),s.setAttribute("aria-label",s.title),s.setAttribute("aria-pressed",n?"true":"false")}function ya(e){e?.document.getElementById(u),S(e.document),ln(e),r.cssOpenTool="",r.cssOpenMenu="",r.styleMode==="tw"&&r.cssValues&&(r.cssValues=!1,q(e,ao,"0")),Ut(e),Zn(e),Ee(e),r.cssToolRow?.(),r.styleMode==="tw"&&(r.htmlScopePref=!0,q(e,Gt,"1"),cn(e,!0)),it(e),qt(e),B(e)}const Yn="sve-css-size",mn="sve-css-state",Jn=["hover","focus","focus-visible","active","disabled","before","after"],qo="data-sve-scroll-edge";function Qn(e){if(!e||e._sveEdges)return;e._sveEdges=!0;const t=()=>ou(e),n=new ResizeObserver(t),o=()=>{for(const s of e.children)n.observe(s)};e.addEventListener("scroll",t,{passive:!0}),n.observe(e),o(),new MutationObserver(()=>{o(),t()}).observe(e,{childList:!0}),t()}function nu(e,t){if(!e||e._sveEdgesIn)return;e._sveEdgesIn=!0;const n=()=>e.querySelectorAll(t).forEach(Qn);n(),new MutationObserver(n).observe(e,{childList:!0,subtree:!0})}function ou(e){const t=e.scrollWidth-e.clientWidth,n=e.scrollLeft>1,o=t-e.scrollLeft>1,s=n&&o?"both":n?"left":o?"right":"";s?e.setAttribute(qo,s):e.removeAttribute(qo)}function su(e,t){r.styleMode=t==="tw"?"tw":"css",q(e,Qa,r.styleMode),ya(e)}function au(e,t){if(t._sveStyleModeBound)return;t._sveStyleModeBound=!0,r.styleMode=X(e,Qa)==="tw"?"tw":"css";const n=X(e,Yn)||"";r.cssSize=wn(e).some(o=>o.handle===n)?n:"",r.cssState=Jn.includes(X(e,mn))?X(e,mn):"",r.cssValues=X(e,ao)==="1",t.querySelector("[data-sve-style-mode]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),su(e,r.styleMode==="tw"?"css":"tw")}),t.querySelector("[data-sve-values-mode]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),tu(e,!r.cssValues)}),ya(e),Zn(e)}function ru(e,t){const n=t.querySelector("[data-sve-css-tools]");if(!n||n._sveBound)return;n._sveBound=!0;const o=a=>t.querySelector(`[data-sve-css-tool="${a}"], [data-sve-css-kid="${a}"]`),s=a=>{const i=o(a.id),l=r.cssOpenMenu===a.id;if(S(e.document),l){ln(e),B(e);return}if(!i)return;const c=r.styleMode==="tw"?!a.twClass&&!!a.tw:!a.kind&&!a.value&&!(a.css in Z())&&!!a.menu,d=()=>{c&&(r.cssOpenMenu=a.id)};if(r.styleMode==="tw"){ln(e),a.twClass?(Yr(e,a.twClass),B(e)):a.tw&&(Jr(e,i,a.tw,()=>B(e)),d(),B(e));return}if(a.kind==="flexDir"){Ic(a.value);return}if(a.kind==="display"){Oc(a.value);return}if(a.value){const f=F(Z()[a.css])===F(a.value);G([{property:a.css,value:f?null:a.value}]);return}if(a.css in Z()){G([{property:a.css,value:null}]),B(e);return}a.menu==="colors"?zc(e,i,a.css):a.menu==="spacing"?Hc(e,i,a.css):a.menu==="sizes"?Io(e,i,a.css,Af):a.menu==="choices"?jc(e,i,a.css,a.choices):a.menu==="values"&&Io(e,i,a.css),d(),B(e)};fe.onTool=a=>{const i=Tt.get(a)?.tool;if(i){if(i.kids?.length){r.cssOpenTool=r.cssOpenTool===i.id?"":i.id,S(e.document),B(e);return}s(i)}},fe.onKid=(a,i)=>{const l=Tt.get(i);l?.kid&&s(l.kid)},r.cssToolRow=()=>{Qe(n,pl),B(e)},r.cssToolRow(),Qn(n),nu(n,"[data-sve-css-kids]"),e.document.addEventListener("mousedown",a=>{a.target.closest(`#${x}, [data-sve-css-tools], [data-sve-html-tools], [data-sve-css-add-class]`)||S(e.document)},!0)}function iu(e,t){const n=t.querySelector("[data-sve-html-tidy]");n&&(n.innerHTML=ps.tidy,n.title=m(e,"code_dock_html_tidy"),n.setAttribute("aria-label",n.title),n.setAttribute("data-tip",n.title))}function lu(e,t){const n=t.querySelector("[data-sve-html-tidy]");iu(e,t),!(!n||n._sveBound)&&(n._sveBound=!0,n.addEventListener("mousedown",o=>o.preventDefault()),n.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),Qs()}))}function cu(e,t){const n=t.querySelector("[data-sve-html-tools]");!n||n._sveBound||(n._sveBound=!0,Qe(n,ll,{tools:bn.map(o=>({...o,icon:ps[o.id]||""})),onTool:o=>{const s=bn.find(i=>i.id===o),a=n.querySelector(`[data-sve-html-tool="${o}"]`);if(s){if(s.menu==="heading"){Eo(e,a,nr);return}if(s.menu==="text"){Eo(e,a,Sr);return}if(s.tidy){Qs();return}if(s.menu==="component"){Cc(e,a);return}if(S(e.document),s.snippet){Js(s.snippet,s.caret??s.snippet.length,s.select),P();return}ea(s.tag)}}}),Qn(n),Pu(e,t),zu(e,t),Ou(e,t))}T("dock:save-now",()=>(R(r.lastWin?.document),!0));let pt=null;async function du(e){const t=e.document;Ku(t);let n=t.getElementById(u);if(n&&!(n.querySelector('[data-sve-css-chrome="subrow-2"]')&&n.querySelector("[data-sve-css-add-class]")&&n.querySelector("[data-sve-html-tools]")&&n.querySelector("[data-sve-html-tidy]")&&n.querySelector("[data-sve-data-vars]")&&n.querySelector("[data-sve-visual-edit-tools]")&&n.querySelector("[data-sve-html-scope]")&&n.querySelector("[data-sve-code-lock]")&&n.querySelector("[data-sve-code-back]")&&n.querySelector("[data-sve-code-autosave]")&&n.querySelector("[data-sve-code-save]")&&n.getAttribute("data-sve-code-chrome")==="scope-9")){for(const s of se)v[s]?.destroy(),v[s]=null;n.remove(),n=null}if(!n){n=t.createElement("div"),n.id=u,n.setAttribute("data-sve-code-chrome","scope-9"),Ar(n,Mr(e)),Qe(n,nl,{htmlLabel:m(e,"code_dock_html"),cssLabel:m(e,"code_dock_css"),jsLabel:m(e,"code_dock_js"),alpineLabel:m(e,"code_dock_alpine"),treeIcon:tr,dataIcon:hf,dataLabel:m(e,"data_vars_title")}),rn(t,n),Go(n),Aa(n,wa(e)),ef(e,n),nf(e,n),tf(e,n),ru(e,n),Ac(e,n),au(e,n),Qd(e,n),Jd(e,n),Er(e,n),cu(e,n),To(e,n),$o(e,n),Xo(e,n),Co(e,n);for(const o of se){const s=n.querySelector(`[data-sve-code-pane="${o}"] [data-sve-code-host]`);Nd(s)}Lr(e)}if(rn(t,n),Go(n),lu(e,n),To(e,n),$o(e,n),Xo(e,n),Co(e,n),Yu(e),to(e),_e(e),V(e),Fe(e),Y(e),Ut(e),Ee(e),await sf(),!v.html){for(const o of se){const s=n.querySelector(`[data-sve-code-pane="${o}"] [data-sve-code-host]`);s?.replaceChildren(),Wd(e,o,s)}for(const o of["html","css"])v[o]&&Qr(e,v[o],{onOpen:s=>Vs(e,s),emptyLabel:m(e,"code_dock_partials_empty"),openLabel:s=>m(e,"component_open_named",{name:s}),sectionValues:()=>qs(e),isLocked:()=>me(),setHover:(s,a)=>r.htmlPartialUi?.setHover(s,a)});$i(e,v.html,{onRename:o=>pc(e,o),isLocked:()=>me(),setHover:(o,s)=>r.htmlClassTokenUi?.setHover(o,s),title:m(e,"code_dock_css_rename_class")})}return n}function eo(e){return pt||(pt=du(e).finally(()=>{pt=null})),pt}async function Vo(e,t){const n=await eo(e);r.lastType=t,r.lastLocked=!0,r.lockReady=!0,r.lastParts={html:"",css:"",js:""},ot(),_e(e),De(r.lastParts,!0),so(e.document,t),O(e.document,m(e,"code_dock_missing")),V(e),Fe(e),Y(e),Be(e,n)}let Uo=-1;async function uu(e,t){if(Uo===r.loadGen&&!r.lastType&&e.document.getElementById(u))return;R(t);const n=++r.loadGen;Uo=n,r.lastType=null,r.typeStack=[],r.lastParts={html:"",css:"",js:""},r.lastProps=[],r.propsDirty=!1,r.lastLocked=!1,r.lockReady=!1,r.loadInFlight=null,Hs(),ot();const o=await eo(e);n===r.loadGen&&(De(r.lastParts,!0),In(e),Lt(e),An(e),so(e.document,""),O(e.document,m(e,Tr(e,e.document)?"code_dock_pick_section":"code_dock_open_template")),_e(e),V(e),Fe(e),Y(e),Ut(e),Ee(e),Be(e,o))}async function ze(e,t,n="replace"){n==="replace"?r.typeStack=[]:n==="push"&&r.lastType&&r.lastType!==t&&r.typeStack.push(r.lastType);const o=++r.loadGen;r.lastType=t,r.lockReady=!1,ot(),O(e.document,m(e,"code_dock_loading"));let s=()=>{};r.loadInFlight=new Promise(i=>{s=i});const a=await eo(e);_e(e),V(e),Fe(e),Y(e),Ut(e),Ee(e),Be(e,a),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(t)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async i=>{if(o!==r.loadGen)return;if(i.status===404){Vo(e,t);return}if(!i.ok)throw new Error(String(i.status));const l=await i.json();o===r.loadGen&&(r.lastParts={html:typeof l.html=="string"?l.html:"",css:typeof l.css=="string"?l.css:"",js:typeof l.js=="string"?l.js:""},r.lastProps=Array.isArray(l.props)?l.props:[],r.propsDirty=!1,r.lastType=t,r.lastLocked=!!l.locked,r.lockReady=!0,Hs(),typeof l.tw=="string"&&l.tw!==""&&cc(r.lastParts.html,l.tw),_e(e),De(r.lastParts,r.lastLocked),An(e),r.lastLocked||Rs(e,r.lastParts.html),so(e.document,l.path||t),O(e.document,r.lastLocked?m(e,"code_dock_locked"):""),l.writable?.template===!1?O(e.document,m(e,"code_dock_not_writable")):l.writable?.tw===!1&&O(e.document,m(e,"code_dock_tw_not_writable")),In(e),al(e),Lt(e),V(e),Fe(e),Y(e),Be(e,a))}).catch(()=>{o===r.loadGen&&(Vo(e,t),O(e.document,m(e,"code_dock_error")))}).finally(()=>{o===r.loadGen&&(r.loadInFlight=null),s()})}function ve(){return r.lastType||""}function ba(e){return!!e?.getElementById(u)}function me(){return r.lastLocked}function fu(e,t){const n=typeof t?.html=="string"?t.html.trim():"",o=typeof t?.css=="string"?t.css.trim():"",s=typeof t?.js=="string"?t.js.trim():"";if(!n&&!o&&!s||!e?.document?.getElementById(u))return!1;let a=!1;return n&&(a=hu("html",n)||a),o&&(a=Ko("css",o)||a),s&&(a=Ko("js",s)||a),a&&ee(e),a}function hu(e,t){const n=v[e];if(!n||n.state.readOnly)return!1;const o=n.state.selection.main,s=o.from>0?n.state.doc.sliceString(o.from-1,o.from):`
`,a=o.to<n.state.doc.length?n.state.doc.sliceString(o.to,o.to+1):`
`,c=`${s===`
`?"":`
`}${t}${a===`
`?"":`
`}`;return n.dispatch({changes:{from:o.from,to:o.to,insert:c},selection:{anchor:o.from+c.length}}),!0}function Ko(e,t){const n=v[e];if(!n||n.state.readOnly)return!1;const o=n.state.doc.length,a=`${o>0&&n.state.doc.sliceString(Math.max(0,o-1),o)!==`
`?`

`:o?`
`:""}${t}
`;return n.dispatch({changes:{from:o,insert:a},selection:{anchor:o+a.length}}),!0}function pu(e){if(kt(e),!r.lastType||!e.document.getElementById(u))return;const t=r.lastType;r.lastType=null,ze(e,t,"keep")}function xa(e){N(e),r.loadGen+=1,R(e),r.lastUid=null,r.lastType=null,r.typeStack=[],r.lastParts={html:"",css:"",js:""},r.lastLocked=!1,r.lockReady=!1,r.lastBracketNames=null,r.lastCssSelectorNames=null,ot(),r.lastWin=e?.defaultView||r.lastWin,S(e),us(e),ne(e),e?.getElementById(K)?.remove();for(const n of se)v[n]?.destroy(),v[n]=null;e?.getElementById(u)?.remove(),Zu(),e&&no(e,0);const t=e?.defaultView||r.lastWin;t?.document.getElementById(Jo)&&os(t),t&&(In(t),Lt(t),An(t))}function mu(e){if(r.dragging)return;const t=e.document.getElementById(u);t&&(to(e),Be(e,t))}function gu(e,t,n){if(n){const a=fo(n,t)||fo(n,e.document)||n;return String(typeof Qt=="function"&&(Qt(a,t)||Qt(a,e.document))||"").trim()}const o=typeof Ge=="function"?Ge(e):"page_sections",s=typeof U=="function"?U(e.document):[];for(const a of s){const l=(pe(a.values)||a.values)?.[o];if(Array.isArray(l))for(const c of l){const d=typeof c?.type=="string"?c.type.trim():"";if(d)return d}}return""}function Kt(e){if((e.Statamic?.$config?.get?.("sveFeatures")||{}).collection_templates!==!0)return"";const n=e.Statamic?.$config?.get?.("sveCollectionTemplatesCollection")||"templates";if(!(e.location?.pathname||"").includes(`/collections/${n}/entries/`))return"";const s=typeof U=="function"?U(e.document):[];for(const a of s){const i=pe(a.values)||a.values,l=typeof i?.view=="string"?i.view.trim():"";if(!l||l.includes(".."))continue;const c=l.replace(/\.(antlers\.html|blade\.php)$/i,"").replace(/^\/+|\/+$/g,"");if(c)return`view:${c}`}return""}function vu(e,t,n){const o=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},s=o[t]&&typeof o[t].type=="string"?o[t]:null,a=e.Statamic?.$config?.get?.("sveChromeStyles")||{},i=`${t}/${typeof a[t]=="string"&&a[t]!==""?a[t]:"style_1"}`,l=s?.type||i,c=n?.[`${t}_style`];return(!s||s.styled)&&typeof c=="string"&&c!==""?`${t}/${c}`:l}function yu(){const e=ve();if(!e)return"";if(e===xn)return"main";if(r.lastWin&&e===Kt(r.lastWin))return"template";const t=e.match(/^(header|footer)\//);if(t)return t[1];const n=r.lastWin?.Statamic?.$config?.get?.("sveChromeTemplates")||{};return["header","footer"].find(o=>n[o]?.type===e)||""}function bu(e){const t=as||rs;return t!=="header"&&t!=="footer"?"":$n(e)||Cn(e)?t:""}function xu(e,t){const n=as||rs;return n!=="header"&&n!=="footer"||!$n(t)&&!Cn(t)?"":vu(e,n,pe(Cr()?.values)||{})}function ku(e,t){if(!t||String(t).startsWith("view:")||js(e,t))return!1;const n=typeof Ge=="function"?Ge(e):"page_sections",o=typeof U=="function"?U(e.document):[];for(const s of o){const i=(pe(s.values)||s.values)?.[n];if(Array.isArray(i)&&i.some(l=>l?.type===t))return!0}return!1}function _u(e){const t=ss(e)||e.getElementById("__sve-global-section-host");return t&&t.querySelector("[data-replicator-set][data-type]")?.getAttribute("data-type")||""}function Gf(e,t,n){if(r.dragging)return;const o=!!(n&&n!==r.lastUid);if(n&&(r.lastUid=n),!e||!t||Wu(t)||!wr(e)||!$r(e)){t&&xa(t);return}const s=!n&&!!r.lastType&&r.lastType!==xn&&!$n(t)&&!Cn(t)&&!ss(t)&&!ku(e,r.lastType);s&&(r.lastUid=null);const a=n||r.lastUid||"",i=xu(e,t)||_u(t)||(a?gu(e,t,a):"")||Kt(e)||(!n&&!s?r.lastType:""),l=!i&&!n,c=l,d=i;if(r.onEmptyPage=l,r.lastWin=e,c){uu(e,t);return}if(d&&!(d===r.lastType&&t.getElementById(u))){if(r.typeStack.length&&r.lastType&&r.lastType!==d){const f=r.typeStack[0];if(d===f&&!o)return;r.typeStack=[]}R(t),ze(e,d,"replace")}}At("tw:changed",()=>{r.lastWin&&r.styleMode==="tw"&&B(r.lastWin)});T("dock:is-open",e=>ba(e));T("dock:is-locked",()=>me());T("dock:html",()=>$e());T("dock:reveal-html",({from:e,to:t,caret:n}={})=>{const o=v.html;if(!o||e==null)return;r.htmlScopePref=tt(r.lastWin),Dt(),ce();const s=r.htmlFull.length,a=Math.max(0,Math.min(e,s)),i=Math.max(a,Math.min(t??e,s));r.htmlFocus=i>a?{from:a,to:i}:null;const l=n==null?null:Math.max(0,Math.min(n,s));if(r.htmlScopePref&&r.htmlFocus){Nn(l),V(r.lastWin);return}if(r.htmlScopeActive){qn(!0,l),V(r.lastWin);return}o.dispatch({selection:l==null?{anchor:a,head:i}:{anchor:l},scrollIntoView:!0}),o.focus()});T("dock:insert-snippet",({win:e,parts:t})=>fu(e,t));T("dock:refresh",e=>pu(e));T("dock:tw-follow",()=>{r.lastWin&&it(r.lastWin)});T("dock:css",()=>(ce(),r.cssFull));T("dock:set-css",e=>typeof e!="string"||me()||!v.css||!r.lastWin?!1:(ce(),r.cssFull=e,jt("css",ta()),ee(r.lastWin),!0));T("dock:data-menu",({anchor:e,onPick:t,at:n}={})=>!e||!r.lastWin?!1:(N(r.lastWin.document),S(r.lastWin.document),ka(r.lastWin,e,t,n),!0));T("dock:props",()=>r.lastProps.map(e=>({...e})));T("dock:set-props",({win:e,props:t}={})=>!Array.isArray(t)||me()?!1:(r.lastProps=t,r.propsDirty=!0,ei(lt(ve())),R((e||r.lastWin)?.document),!0));function lt(e){const t=/^view:partials\/(components\/[A-Za-z0-9_-]+)$/.exec(String(e||""));return t?t[1]:""}T("dock:component-src",()=>lt(ve()));T("dock:type-stack",()=>r.typeStack.map(e=>({type:e,src:lt(e)})));T("dock:component-exit-state",()=>{const e=lt(ve());return{open:!!e,name:e?e.split("/").pop():"",back:r.typeStack.length>0}});T("dock:exit-component",(e=1)=>{if(!r.lastWin||!lt(ve()))return!1;if(r.typeStack.length){for(let t=Number(e)||1;t>1&&r.typeStack.length>1;t-=1)r.typeStack.pop();Us(r.lastWin)}else xa(r.lastWin.document);return!0});T("dock:current-type",()=>ve());T("dock:on-empty-page",()=>!!r.onEmptyPage);T("dock:current-uid",()=>r.lastUid);T("dock:leave-part",()=>{const e=r.lastWin;return e?(r.lastUid=null,R(e.document),ze(e,xn,"replace"),!0):!1});T("dock:chrome-kind",()=>yu());T("dock:collection-view",()=>r.lastWin?Kt(r.lastWin):"");T("dock:chrome-open",e=>bu(e));T("dock:save-settled",()=>r.saveInFlight||null);T("dock:load-settled",()=>r.loadInFlight||null);T("dock:reset-data-vars",e=>(Ti(typeof e=="string"&&e?e:void 0),!0));T("dock:refresh-preview",()=>r.lastWin?(kt(r.lastWin),!0):!1);T("dock:open-file",e=>typeof e!="string"||!e||!r.lastWin?!1:(r.onEmptyPage=!1,e===r.lastType||(R(r.lastWin.document),ze(r.lastWin,e,"replace")),!0));T("dock:open-template",e=>typeof e!="string"||!e||!r.lastWin?!1:(Vs(r.lastWin,e),!0));T("dock:set-html",e=>{const t=e&&typeof e=="object"?e:{},n=e&&typeof e=="object"?e.html:e;if(typeof n!="string"||me())return!1;if(n!==""&&!ti($e(),n)){const i=r.lastWin;if(!(t?.unlock===!0&&i?.Statamic?.$permissions?.has?.("configure fields")===!0))return i?.Statamic?.$toast?.error(m(i,"html_tree_locked_element")),!1}const o=v.html;if(!o||!r.lastWin)return!1;if(n===""){r.saveTimer&&(clearTimeout(r.saveTimer),r.saveTimer=null),r.twDirty=!1,r.twCss=null,r.twKey="",r.lastType=null,r.lastUid=null,r.lastParts={html:"",css:"",js:""},r.cssFull="",r.htmlFull="",r.applying=!0;try{ot();for(const i of se){const l=v[i];if(!l)continue;const c=l.state.doc.toString();c!==""&&l.dispatch({changes:{from:0,to:c.length,insert:""}})}}finally{r.applying=!1}return!0}const s=r.htmlFull;if(r.htmlFull=n,r.htmlScopeActive)return r.htmlFocus=Su(r.htmlFocus,s,n),Ht(Xs()),ee(r.lastWin),Sn("dock:html-changed"),!0;const a=o.state.doc.toString();if(a!==n){const[i,l,c]=Ns(a,n);o.dispatch({changes:{from:i,to:l,insert:c}})}return!0});T("dock:show-empty",()=>ae("dock:set-html",""));At("row:removed",({parentPath:e,remaining:t,win:n})=>{t===0&&e===Ge(n)&&ae("dock:show-empty")});function Su(e,t,n){const o=n.length-t.length;if(!e||!o)return e;let s=0;for(;s<t.length&&s<n.length&&t[s]===n[s];)s+=1;return s>=e.to?e:s<e.from?{from:Math.max(0,e.from+o),to:Math.max(0,e.to+o)}:{from:e.from,to:Math.max(e.from,e.to+o)}}const Le="__sve-data-menu";let $t=null;function N(e){const t=e?.getElementById(Le);$t?.(),$t=null,t?._sveApp?.unmount(),t?.remove(),e?.querySelectorAll("[data-sve-data-vars][data-open], [data-sve-antlers-btn][data-open], [data-sve-visual-edit-btn][data-open]").forEach(n=>n.removeAttribute("data-open"))}function wu(e){if(!Kt(e))return{view:"",kind:""};const t=typeof U=="function"?U(e.document):[];for(const n of t){const o=pe(n.values)||n.values,s=typeof o?.source_collection=="string"?o.source_collection.trim():"";if(s)return{view:s,kind:String(o?.kind||"").trim()}}return{view:"",kind:""}}function $u(e,t){const n=$e();if(Number.isFinite(t))return mo(n,t);const o=v.html;if(!o)return[];const s=r.htmlScopeActive&&r.htmlFocus?r.htmlFocus.from:0;return mo(n,s+o.state.selection.main.from)}function Cu(e,t){const{view:n,kind:o}=wu(e);return{collection:Ts(e)||"",set:As(ve()),view:n,kind:o,scope:Ci($u(e,t))}}function Tu(e){const t=typeof U=="function"?U(e.document):[];for(const n of t){const o=pe(n.values)||n.values;if(o&&typeof o=="object")return o}return null}function Au(e,t){return{scope:t?.scope?.groups||[],section:Ls(t?.section||[],qs(e)),page:Ei(t?.page||[],Tu(e)),site:t?.site||[]}}function Mu(e){const t=e.state.selection.main,n=e.state.doc.lineAt(t.from),o=n.text.slice(0,t.from-n.from);return/(?:^|\s)(?::|x-bind:)[\w.:-]+\s*=\s*(["'])(?:(?!\1).)*$/.test(o)}function Eu(e,t){const n=v.html;if(!n||n.state.readOnly)return;if(Mu(n)){const c=String(e?.var||"").trim(),d=n.state.selection.main;n.dispatch({changes:{from:d.from,to:d.to,insert:c},selection:{anchor:d.from+c.length}}),P();return}const o=Li(e,t);if(!o)return;const s=n.state.selection.main,a=n.state.doc.lineAt(s.from),i=le(a.text),l=Mn(o.text,i);n.dispatch({changes:{from:s.from,to:s.to,insert:l},selection:{anchor:s.from+o.cursor+(o.text.includes(`
`)?i.length:0)}}),P()}function Ve(e,t,n){const o=t.getBoundingClientRect(),s=8,a=n.offsetWidth||368,i=n.offsetHeight||240,l=e.innerHeight-o.bottom-s,c=o.top-s,d=l>=i||l>=c?o.bottom+4:o.top-i-4;n.style.left=`${Math.max(s,Math.min(o.left,e.innerWidth-a-s))}px`,n.style.top=`${Math.max(s,Math.min(d,e.innerHeight-i-s))}px`}function ka(e,t,n,o){const s=e.document;N(s),t.setAttribute("data-open","");const a=s.createElement("div");a.id=Le,a.setAttribute("data-sve-data-menu",""),s.body.appendChild(a);const i=Cu(e,o),l=p=>[p?.scope?.groups?.length?{id:"scope",label:p.scope.label||m(e,"data_vars_tab_loop")}:null,{id:"section",label:m(e,"data_vars_tab_section")},{id:"page",label:m(e,"data_vars_tab_page")},{id:"site",label:m(e,"data_vars_tab_site")}].filter(Boolean),c=p=>{s.getElementById(Le)&&(a._sveApp?.unmount(),a._sveApp=z(ms,a,{title:m(e,"data_vars_title"),placeholder:m(e,"data_vars_placeholder"),emptyText:m(e,"data_vars_empty"),noSectionText:m(e,"data_vars_no_section"),loopText:m(e,"data_vars_loop"),tabs:l(p),data:Au(e,p),onPick:(y,g)=>n?n(y,g):Eu(y,g)}),Ve(e,t,a))};c(Ms(Fn(i))||{scope:null,section:[],page:[],site:[]}),Es(e,i).then(c),Ve(e,t,a);const d=()=>Ve(e,t,a),f=p=>{!a.contains(p.target)&&!t.contains(p.target)&&N(s)},h=p=>{p.key==="Escape"&&N(s)};s.addEventListener("pointerdown",f,!0),s.addEventListener("keydown",h,!0),e.addEventListener("scroll",d,!0),e.addEventListener("resize",d),$t=()=>{s.removeEventListener("pointerdown",f,!0),s.removeEventListener("keydown",h,!0),e.removeEventListener("scroll",d,!0),e.removeEventListener("resize",d)}}function _a(e,t,{title:n,placeholder:o,tabs:s,data:a,onPick:i}){const l=e.document;N(l),S(l),t.setAttribute("data-open","");const c=l.createElement("div");c.id=Le,c.setAttribute("data-sve-data-menu",""),l.body.appendChild(c),c._sveApp=z(ms,c,{title:n,placeholder:o,emptyText:m(e,"data_vars_empty"),noSectionText:m(e,"data_vars_empty"),loopText:"",tabs:s,data:a,onPick:(d,f)=>{N(l),i(d,f)}}),Ve(e,t,c),Lu(e,t,c)}function Lu(e,t,n){const o=e.document,s=()=>Ve(e,t,n),a=l=>{!n.contains(l.target)&&!t.contains(l.target)&&N(o)},i=l=>{l.key==="Escape"&&N(o)};o.addEventListener("pointerdown",a,!0),o.addEventListener("keydown",i,!0),e.addEventListener("scroll",s,!0),e.addEventListener("resize",s),$t=()=>{o.removeEventListener("pointerdown",a,!0),o.removeEventListener("keydown",i,!0),e.removeEventListener("scroll",s,!0),e.removeEventListener("resize",s)}}const Bu='<svg width="21" height="11" viewBox="0 0 150 77" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M69.999 55.827a13.8 13.8 0 0 0-.812-3.799 15.4 15.4 0 0 0-1.687-3.55 18.16 18.16 0 0 0-5.686-5.418 37.7 37.7 0 0 0 3.936-6.228 18.6 18.6 0 0 0 1.812-6.228 9.88 9.88 0 0 0-1.248-5.57 9.9 9.9 0 0 0-4.125-3.959 10.46 10.46 0 0 0-10.684 1.183 13.8 13.8 0 0 0-4.061 5.107 39 39 0 0 0-1.812 4.92 49.5 49.5 0 0 1-5.436-6.227 16.9 16.9 0 0 1-2.562-5.606 28.7 28.7 0 0 1-.624-6.85c.003-2-.357-3.983-1.063-5.855a10.66 10.66 0 0 0-4.56-5.231 13.9 13.9 0 0 0-10.684-1.37 10.13 10.13 0 0 0-4.94 2.755 10.1 10.1 0 0 0-2.683 4.967 24.4 24.4 0 0 0 0 10.214 22.4 22.4 0 0 0 3.374 7.35h-1.062a23 23 0 0 1-4.124 0 19.2 19.2 0 0 0-6.248 0 6.74 6.74 0 0 0-3.374 2.74 9.45 9.45 0 0 0-.75 9.341 11.23 11.23 0 0 0 5.811 6.228 25.1 25.1 0 0 0 10.622 1.495 17.9 17.9 0 0 0 9.809-3.425 104 104 0 0 1 10.496 7.162 22.4 22.4 0 0 1 5.249 6.54 15.5 15.5 0 0 1 1.437 5.106 35 35 0 0 0 1.437 6.789 13.2 13.2 0 0 0 4.373 5.73 15.6 15.6 0 0 0 10.372 2.802 9.9 9.9 0 0 0 5.429-1.987 9.84 9.84 0 0 0 3.38-4.677A61.6 61.6 0 0 0 70 55.827m-5.061 12.456a5.05 5.05 0 0 1-1.971 2.157 5.07 5.07 0 0 1-2.84.708 9.45 9.45 0 0 1-6.248-2.367 6.6 6.6 0 0 1-2.124-2.989 50 50 0 0 1-1.625-6.788 18.7 18.7 0 0 0-2.249-5.73 28.7 28.7 0 0 0-7.435-7.35A129 129 0 0 0 27.95 38.95c-.812-.498-2.686 0-2.749 0a14.03 14.03 0 0 1-7.872 1.62 19.5 19.5 0 0 1-7.935-2.056 4.86 4.86 0 0 1-2.375-2.49 3.35 3.35 0 0 1 0-2.99 1.18 1.18 0 0 1 .875-.748c1.25 0 2.687 0 3.936-.435a33 33 0 0 0 4.749-1.122 17.6 17.6 0 0 0 4.498-2.18 1.68 1.68 0 0 0 .838-1.68 1.7 1.7 0 0 0-.213-.624 2.2 2.2 0 0 0-.937-.747 18.65 18.65 0 0 1-2.812-7.35 19.5 19.5 0 0 1 .938-7.97 4.55 4.55 0 0 1 1.326-1.834 4.57 4.57 0 0 1 2.048-.97 7.52 7.52 0 0 1 5.498.997 5.12 5.12 0 0 1 2.499 3.488 87 87 0 0 0 1.874 10.587 22.4 22.4 0 0 0 4.436 6.789 78 78 0 0 0 8.372 7.286 1.8 1.8 0 0 0 1.188 1.246 2.005 2.005 0 0 0 2.499-1.308 33.4 33.4 0 0 1 3.249-6.54 8.8 8.8 0 0 1 2.811-2.677 4.63 4.63 0 0 1 4.561 0 4 4 0 0 1 1.612 1.494c.387.638.586 1.372.575 2.118a14.7 14.7 0 0 1-.75 5.792 36.6 36.6 0 0 1-2.561 6.228v.311a2.05 2.05 0 0 0 .5 2.74 13.6 13.6 0 0 1 3.248 4.92c.375.873.563 1.745.875 2.617s.937 2.678 1.312 4.048c1.625 5.916 2.5 7.536.875 10.961zM148.848 29.42a6.6 6.6 0 0 0-3.062-2.74 16.7 16.7 0 0 0-6.248 0c-1.227.09-2.459.09-3.686 0h-.937a24.2 24.2 0 0 0 3.186-7.536c.659-3.31.659-6.716 0-10.027a9.95 9.95 0 0 0-2.072-5.336 10 10 0 0 0-4.676-3.32 12.53 12.53 0 0 0-10.184 1.556 10.78 10.78 0 0 0-4.498 5.668 16.8 16.8 0 0 0-.875 5.667 32.7 32.7 0 0 1 0 6.602 17.2 17.2 0 0 1-2.499 5.543 52 52 0 0 1-4.748 5.792 32 32 0 0 0-1.5-4.547 14.4 14.4 0 0 0-3.811-5.231 9.522 9.522 0 0 0-10.56-.996 10.16 10.16 0 0 0-3.64 4.024 10.1 10.1 0 0 0-1.045 5.317c.21 2.156.78 4.26 1.687 6.228a38.3 38.3 0 0 0 3.748 6.228 17.5 17.5 0 0 0-5.435 5.668 15 15 0 0 0-1.562 3.55 18.3 18.3 0 0 0-.75 3.674v10.09c.068 1.417.32 2.82.75 4.172a9.46 9.46 0 0 0 3.062 4.609 9.5 9.5 0 0 0 5.123 2.118 14.1 14.1 0 0 0 9.871-2.927 12.76 12.76 0 0 0 4.124-5.792 34 34 0 0 0 1.562-6.727 17.6 17.6 0 0 1 1.375-5.107 21.1 21.1 0 0 1 4.623-6.228 83 83 0 0 1 8.935-7.349 16.34 16.34 0 0 0 8.997 3.301 22.24 22.24 0 0 0 9.746-1.557 10.777 10.777 0 0 0 5.499-6.228 9.88 9.88 0 0 0-.5-8.158m-5.623 6.229a4.43 4.43 0 0 1-2.062 2.553 16.16 16.16 0 0 1-7.06 2.18 11.7 11.7 0 0 1-7.123-1.869s-1.999-.81-2.812 0a123 123 0 0 0-11.558 7.038 26.9 26.9 0 0 0-6.811 7.224 79 79 0 0 0-3.623 12.456 6.23 6.23 0 0 1-2 3.052 7.88 7.88 0 0 1-5.373 2.305 4.63 4.63 0 0 1-2.523-.809 4.6 4.6 0 0 1-1.663-2.056 9.8 9.8 0 0 1-.812-3.488c.25-2.711.881-5.373 1.874-7.91.375-1.37.75-2.678 1.187-4.048s.438-1.806.812-2.616a13.26 13.26 0 0 1 2.937-5.044 2.054 2.054 0 0 0 .375-2.74 44 44 0 0 1-2.25-6.228 17.3 17.3 0 0 1-.687-5.792 4.22 4.22 0 0 1 1.937-3.675 3.57 3.57 0 0 1 3.811 0 8.3 8.3 0 0 1 2.625 2.678 40.5 40.5 0 0 1 3.061 6.228 1.93 1.93 0 0 0 1.664 1.441c.26.029.522.005.773-.07a1.82 1.82 0 0 0 1.187-1.309 80 80 0 0 0 7.872-7.411 22.5 22.5 0 0 0 3.999-6.664 75.4 75.4 0 0 0 1.749-10.525 5.17 5.17 0 0 1 1.937-3.176 5.76 5.76 0 0 1 4.749-.935 4.11 4.11 0 0 1 3.186 2.927c.751 2.609.985 5.338.687 8.035a19 19 0 0 1-2.561 7.473s-.625 0-.75.56a1.68 1.68 0 0 0 .5 2.367c1.27.908 2.657 1.641 4.123 2.18 1.468.49 2.972.865 4.499 1.121 1.125 0 2.374 0 3.561.436s.438.311.625.623c.235.52.351 1.087.341 1.657a3.9 3.9 0 0 1-.403 1.644z"/></svg>',Fu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 9 5 12 1.8-5.2L21 14Z"/><path d="M7.2 2.2 8 5.1"/><path d="m5.1 8-2.9-.8"/><path d="M14 4.1 12 6"/><path d="m6 12-1.9 2"/></svg>';function Sa(e,t,n,o,s){const a=e.document.createElement("button");return a.type="button",a.setAttribute(n,""),a.title=s,a.setAttribute("aria-label",s),a.innerHTML=`<span>${o}</span>`,a.addEventListener("mousedown",i=>i.preventDefault()),t.replaceChildren(a),a}function Iu(e){return String(e||"").replace(/\|/g,"").split(`
`)[0].trim()}function Ou(e,t){const n=t.querySelector("[data-sve-data-vars]");!n||n._sveBound||(n._sveBound=!0,n.addEventListener("mousedown",o=>o.preventDefault()),n.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),e.document.getElementById(Le)){N(e.document);return}S(e.document),ka(e,n)}))}function Pu(e,t){const n=t.querySelector("[data-sve-antlers-tools]");if(!n||n._sveBound)return;n._sveBound=!0;const o=Sa(e,n,"data-sve-antlers-btn",Bu,m(e,"code_dock_antlers"));o.addEventListener("click",s=>{if(s.preventDefault(),s.stopPropagation(),o.hasAttribute("data-open")){N(e.document);return}const a={};for(const i of go)a[i.id]=ri.filter(l=>l.group===i.id).map(l=>({id:l.id,var:l.label,value:l.inline?"":Iu(l.snippet)}));_a(e,o,{title:m(e,"code_dock_antlers"),placeholder:m(e,"code_dock_antlers_search"),tabs:go.map(i=>({id:i.id,label:m(e,i.lang)})),data:a,onPick:i=>Du(i.id)})})}function Du(e){const t=ii(e),n=v.html;if(!t||!n||n.state.readOnly)return;const o=n.state.selection.main.head;if(t.inline){const c=t.snippet,d=n.state.selection.main;n.dispatch({changes:{from:d.from,to:d.to,insert:c},selection:{anchor:d.from+c.length}}),P();return}const s=n.state.doc.lineAt(o),a=s.text.trim()?le(s.text):Nt(n,s)||le(s.text),{text:i,cursor:l}=vt(t.snippet);Ze(Mn(i,a),l),P()}function zu(e,t){const n=t.querySelector("[data-sve-visual-edit-tools]");if(!n||n._sveBound)return;n._sveBound=!0;const o=Sa(e,n,"data-sve-visual-edit-btn",Fu,m(e,"code_dock_visual_edit"));o.addEventListener("click",s=>{if(s.preventDefault(),s.stopPropagation(),o.hasAttribute("data-open")){N(e.document);return}const a={};for(const i of ko)a[i.id]=Bs.filter(l=>l.group===i.id).map(l=>({id:l.id,var:l.label,value:l.attr?l.attr.replace(/\|/g,""):""}));_a(e,o,{title:m(e,"code_dock_visual_edit"),placeholder:m(e,"code_dock_visual_edit_search"),tabs:ko.map(i=>({id:i.id,label:m(e,i.lang)})),data:a,onPick:i=>Hu(i.id)})})}function ju(e,t,n,o){if(Ii(n.inner,o.attr)){e.focus();return}const{text:s,cursor:a}=vt(o.attr);let i=n.closeIdx;for(;i>n.openIdx+2&&/\s/.test(t[i-1]);)i--;e.dispatch({changes:{from:i,to:n.closeIdx,insert:` ${s} `},selection:{anchor:i+1+a}}),P()}function Hu(e){const t=Bi(e),n=v.html;if(!t||!n||n.state.readOnly)return;const o=n.state.doc.toString(),s=st();if(s?.open){const h=Fi(o,s.open.from,s.open.to,dt);if(h){t.attr?ju(n,o,h,t):(n.dispatch({selection:{anchor:h.openIdx+2+dt.length}}),n.focus());return}const p=s.open.from+1+s.name.length,y=t.standalone||`{{ ${dt} ${t.attr} }}`,{text:g,cursor:E}=vt(y);n.dispatch({changes:{from:p,to:p,insert:` ${g}`},selection:{anchor:p+1+E}}),P();return}const a=n.state.selection.main.head,i=n.state.doc.lineAt(a),l=i.text.trim()?le(i.text):Nt(n,i)||le(i.text),c=t.standalone||`{{ ${dt} ${t.attr} }}`,{text:d,cursor:f}=vt(c);Ze(Mn(d,l),f),P()}function Ru(e){return e==="css"?Va():e==="js"?Ua():qa({autoCloseTags:!0})}function Go(e){if(e._sveShield)return;e._sveShield=!0;const t=n=>n.stopPropagation();for(const n of["keydown","keypress","keyup","pointerdown","pointerup","mousedown","mouseup","click","focusin"])e.addEventListener(n,t)}function Wu(e){try{return new URLSearchParams(e.defaultView?.location?.search||"").has("sve-panel")}catch{return!1}}function Nu(e){const t=parseInt(X(e,Xa)??"",10);return Number.isFinite(t)&&t>=er?t:lf}function qu(e,t){q(e,Xa,String(t))}function wa(e){try{const t=JSON.parse(X(e,Za)||"null");if(t&&typeof t=="object")return{html:t.html!==!1,css:t.css!==!1,js:t.js===!0,alpine:t.alpine===!0}}catch{}return{html:!0,css:!0,js:!1,alpine:!1}}function Vu(e,t){q(e,Za,JSON.stringify(t))}function $a(e){try{const t=JSON.parse(X(e,Ya)||"null");if(t&&typeof t=="object"){const n=s=>Number.isFinite(s)&&s>0?s:1,o={};for(const s of we)o[s]=n(t[s]);return o}}catch{}return Object.fromEntries(we.map(t=>[t,1]))}function Uu(e,t){q(e,Ya,JSON.stringify(t))}function Ku(e){Br(e,rf,`
@keyframes sve-cm-wait { to { transform: rotate(360deg); } }
#${u} {
  /* The tree's seven families, for the marks and the toolbar below. */
  ${Fr("dark")}
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
  ${ho("ns")}
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
#${Le} {
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
  ${ho("ew")}
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
  border-radius: 4px;
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
#${ct} {
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
#${ct} [data-sve-partial-choice] {
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
`)}function Gu(e){const t=e.querySelector(".live-preview-editor");if(!t)return 0;const n=t.getBoundingClientRect();return n.width<40||n.right<40?0:Math.round(n.right)}function Xu(e){let t=0;for(const n of["__sve-section-picker","__sve-outline-panel","__sve-html-tree-panel","__sve-listview-panel","__sve-right-dock","__sve-chrome-designs","__sve-global-section-panel","__sve-ai-panel"]){const o=e.getElementById(n);if(!o||o.hasAttribute("data-sve-chrome-hidden")||o.hasAttribute("data-sve-right-closed")||o.style.display==="none")continue;const s=o.getBoundingClientRect();s.width>40&&s.right>e.documentElement.clientWidth-8&&(t=Math.max(t,Math.round(s.width)))}return t}function to(e){const t=e.document;if(r.layoutWin=e,typeof e.ResizeObserver!="function")return;r.layoutObserver||(r.layoutObserver=new e.ResizeObserver(()=>{r.layoutWin&&mu(r.layoutWin)}));const n=t.querySelector(".live-preview-editor"),o=t.getElementById("__sve-right-dock");n!==r.observedEditor&&(r.observedEditor&&r.layoutObserver.unobserve(r.observedEditor),r.observedEditor=n,n&&r.layoutObserver.observe(n)),o!==r.observedRight&&(r.observedRight&&r.layoutObserver.unobserve(r.observedRight),r.observedRight=o,o&&r.layoutObserver.observe(o))}function Zu(){r.layoutObserver?.disconnect(),r.layoutObserver=null,r.layoutWin=null,r.observedEditor=null,r.observedRight=null}function Yu(e){r.layoutWatchBound||(r.layoutWatchBound=!0,e.addEventListener("sve-right-dock-change",()=>to(e)))}function no(e,t){const n=e.querySelector(".live-preview-contents");n&&(n.style.paddingBottom=t?`${t}px`:"")}function oo(e){if(!e)return;const t=e.clientHeight,n=e.querySelector("[data-sve-code-bar]"),o=e.querySelector("[data-sve-code-lock-banner]"),s=o&&Ju(e)?.getComputedStyle(o).display!=="none"?o.offsetHeight:0,a=Math.max(64,t-(n?.offsetHeight||0)-s),i=e.querySelector("[data-sve-code-panes]");i&&(i.style.height=`${a}px`,i.style.minHeight="0",i.style.overflow="hidden"),e.querySelectorAll("[data-sve-code-host]").forEach(l=>{const c=l.closest("[data-sve-code-pane]");if(!c||c.style.display==="none")return;let d=0;for(const h of c.children)h!==l&&(d+=h.offsetHeight);const f=Math.max(64,a-d);l.style.height=`${f}px`,l.style.maxHeight=`${f}px`,l.style.minHeight="0",l.style.overflow="auto",Qu(l)})}function Ju(e){return e.ownerDocument?.defaultView||r.lastWin}function Qu(e){e._sveWheelBound||(e._sveWheelBound=!0,e.addEventListener("wheel",t=>{const n=e.scrollHeight-e.clientHeight,o=e.scrollWidth-e.clientWidth;let s=!1;if(t.deltaY&&n>0){const a=Math.min(n,Math.max(0,e.scrollTop+t.deltaY));a!==e.scrollTop&&(e.scrollTop=a,s=!0)}if(t.deltaX&&o>0){const a=Math.min(o,Math.max(0,e.scrollLeft+t.deltaX));a!==e.scrollLeft&&(e.scrollLeft=a,s=!0)}s&&(t.preventDefault(),t.stopPropagation())},{passive:!1}))}function Ca(){const e=(r.layoutWin||r.lastWin)?.document?.getElementById(u);e&&oo(e);for(const t of se)v[t]?.requestMeasure()}function Ta(e,t){const n=wa(e),o={};for(const s of we){const a=t.querySelector(`[data-sve-code-pane-btn="${s}"]`);o[s]=a?a.getAttribute("aria-pressed")==="true":n[s]}return o}function Aa(e,t){for(const o of we){const s=e.querySelector(`[data-sve-code-pane-btn="${o}"]`),a=e.querySelector(`[data-sve-code-pane="${o}"]`);s&&s.setAttribute("aria-pressed",t[o]?"true":"false"),a&&(a.style.display=t[o]?"flex":"none")}const n=we.filter(o=>t[o]);e.querySelectorAll("[data-sve-code-split]").forEach(o=>{const s=o.getAttribute("data-sve-code-split-after"),a=n.indexOf(s);o.style.display=a>=0&&a<n.length-1?"block":"none"}),Ma(e.ownerDocument.defaultView,e),oo(e)}function Ma(e,t){const n=$a(e);for(const o of we){const s=t.querySelector(`[data-sve-code-pane="${o}"]`);s&&(s.style.flex=`${n[o]} 1 0`)}}function Be(e,t){if(r.dragging)return;const n=e.document;rn(n,t);const o=Nu(e),s=Gu(n),a=Xu(n);t.style.left=`${s}px`,t.style.right=`${a}px`,t.style.bottom="0",t.style.height=`${o}px`,no(n,o),oo(t)}function Ea(e,t,n,o){r.dragging=!0,Ir(e,t,n,()=>{r.dragging=!1,o?.()},"data-sve-code-drag-shield")}function ef(e,t){if(t._sveResizeBound)return;t._sveResizeBound=!0;const n=o=>{if(o.button!==0||o.target.closest('button, a, input, select, textarea, label, [role="button"], [contenteditable], .cm-editor'))return;o.preventDefault();const s=o.clientY,a=t.getBoundingClientRect().height;let i=a;Ea(e,"ns-resize",l=>{i=Math.min(Math.max(er,a+(s-l.clientY)),Math.round(e.innerHeight*.7)),t.style.height=`${i}px`,no(e.document,i),Ca()},()=>{qu(e,i),Be(e,t),e.dispatchEvent(new Event("resize"))})};t.querySelector("[data-sve-code-bar]")?.addEventListener("mousedown",n),t.querySelector("[data-sve-code-grip]")?.addEventListener("mousedown",n)}function tf(e,t){t._sveSplitBound||(t._sveSplitBound=!0,t.querySelectorAll("[data-sve-code-split]").forEach(n=>{n.addEventListener("mousedown",o=>{if(o.button!==0)return;o.preventDefault(),o.stopPropagation();const s=n.getAttribute("data-sve-code-split-after"),a=we.filter(E=>Ta(e,t)[E]),i=a.indexOf(s),l=a[i],c=a[i+1];if(!l||!c)return;const d=t.querySelector(`[data-sve-code-pane="${l}"]`),f=t.querySelector(`[data-sve-code-pane="${c}"]`),h=o.clientX,p=d.getBoundingClientRect().width,y=f.getBoundingClientRect().width,g=p+y;n.setAttribute("data-active",""),Ea(e,"col-resize",E=>{const He=E.clientX-h;let Xt=Math.max(an,Math.min(g-an,p+He)),ro=g-Xt;g<an*2&&(Xt=p,ro=y);const Zt=$a(e);Zt[l]=Xt,Zt[c]=ro,Uu(e,Zt),Ma(e,t),Ca()},()=>{n.removeAttribute("data-active")})})}))}function nf(e,t){t._svePaneBound||(t._svePaneBound=!0,t.querySelectorAll("[data-sve-code-pane-btn]").forEach(n=>{n.addEventListener("click",o=>{o.stopPropagation();const s=n.getAttribute("data-sve-code-pane-btn"),a=Ta(e,t),i={...a,[s]:!a[s]};!i.html&&!i.css&&!i.js&&(i[s]=!0),Vu(e,i),Aa(t,i)})}))}function O(e,t){const n=e.getElementById(u)?.querySelector("[data-sve-code-status]");n&&(n.textContent=t||"")}function so(e,t){const n=e.getElementById(u)?.querySelector("[data-sve-code-path]");n&&(n.textContent=t||"",n.title=t||"")}function Fe(e){const t=e?.document?.getElementById(u)?.querySelector("[data-sve-code-back]");t&&(t.hidden=r.typeStack.length===0,t.title=m(e,"code_dock_back"),t.setAttribute("aria-label",t.title),t.innerHTML=ff)}function Xo(e,t){const n=t.querySelector("[data-sve-code-back]");!n||n._sveBound||(n._sveBound=!0,n.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),Us(e)}))}let I,gn,La,Ba,Fa,ye,Je,de,je,ue,J,Ia,Oa,Pa,Da,za,ja,Ha,Ra,Wa,Na,Ct,qa,Va,Ua,Ka,vn,yn,Ga,of,We=null,C=null;function sf(){return We||(We=ir().then(e=>{C=e,I=C.view.EditorView,gn=C.view.keymap,La=C.view.lineNumbers,Ba=C.view.highlightActiveLine,Fa=C.view.highlightActiveLineGutter,ye=C.state.Compartment,Je=C.state.EditorState,de=C.state.StateField,je=C.state.StateEffect,ue=C.state.RangeSetBuilder,J=C.view.Decoration,Ia=C.commands.defaultKeymap,Oa=C.commands.indentWithTab,Pa=C.commands.historyKeymap,Da=C.commands.history,za=C.autocomplete.autocompletion,ja=C.autocomplete.closeBrackets,Ha=C.autocomplete.closeBracketsKeymap,Ra=C.autocomplete.closeCompletion,Wa=C.autocomplete.completionKeymap,Na=C.view.hoverTooltip,Ct=C.langHtml.htmlLanguage,qa=C.langHtml.html,Va=C.langCss.css,Ua=C.langJs.javascript,C.language.HighlightStyle,C.language.syntaxHighlighting,Ka=C.language.codeFolding,vn=C.language.foldEffect,yn=C.language.unfoldEffect,Ga=C.language.foldedRanges,of=C.highlight.tags,Ue.html=new ye,Ue.css=new ye,Ue.js=new ye,Ke.html=new ye,Ke.css=new ye,Ke.js=new ye}).catch(e=>{throw We=null,e}),We)}const af="{{ _class }}",u=ar,rf="__sve-code-dock-style",K="__sve-code-dock-unlock",Xa="sve-code-dock-height",Za="sve-code-dock-panes",Ya="sve-code-dock-widths",Gt="sve-html-scope-v2",Ja="sve-code-dock-autosave",Qa="sve-code-dock-style-mode",ao="sve-code-dock-values",lf=280,er=120,an=140,cf=250,se=["html","css","js"],we=["html","css","alpine","js"],df='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',uf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-1"/></svg>',ff='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',tr='<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1c0 .966.784 1.75 1.75 1.75h.418A1.74 1.74 0 0 0 4 7.25v1.5c0 .49.201.932.525 1.25c-.324.318-.525.76-.525 1.25v1c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 14 12.25v-1c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1.5c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1A1.75 1.75 0 0 0 12.25 2zm8.5 7.5H8v-3h4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75M7 6.5v3H5.75A.75.75 0 0 1 5 8.75v-1.5a.75.75 0 0 1 .75-.75zm1 4h4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75H8zm-1 0V13H5.75a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-1-5V3h6.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75zm-1 0H3.75A.75.75 0 0 1 3 4.75v-1A.75.75 0 0 1 3.75 3H5z"/></svg>',hf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/><path d="M4.5 11.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/></svg>',pf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 16.3A8.5 8.5 0 1 1 18.3 6.3"/><path d="M21 3.2v5.4h-5.4"/></svg>',mf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',gf='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',x="__sve-css-menu",nr=["h1","h2","h3","h4","h5","h6"],bn=[{id:"section",title:"section",tag:"section"},{id:"div",title:"div",tag:"div"},{id:"heading",title:"heading",menu:"heading"},{id:"text",title:"text",menu:"text"},{id:"a",title:"link",tag:"a"},{id:"img",title:"image",snippet:'<img src="" alt="">',caret:10},{id:"video",title:"video",snippet:'<video src="" controls playsinline></video>',caret:12},{id:"ul",title:"list",tag:"ul"},{id:"li",title:"list item",tag:"li"},{id:"component",title:"component",menu:"component"},{id:"loop",title:"loop",snippet:`{{ items }}

{{ /items }}
`,caret:3,select:5},{id:"if",title:"if",snippet:`{{ if true }}

{{ /if }}
`,caret:6,select:4}],vf=["--size-100","--size-200","--size-300","--size-400","--size-500","--size-600","--size-700","--size-800","--size-900","--gutter"],yf={"tw-text":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 13 5 3l3.5 10M2.7 10h4.6"/><path d="M12.5 3.5v9M11 5l1.5-1.5L14 5M11 11l1.5 1.5L14 11"/></svg>',"tw-leading":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h8.5M6 8h8.5M6 12.5h8.5"/><path d="M2.5 4.5v7M1.4 5.6 2.5 4.5l1.1 1.1M1.4 10.4l1.1 1.1 1.1-1.1"/></svg>',"tw-font":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.2V3h10v1.2M8 3v10M6 13h4"/></svg>',"tw-radius":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 13.5v-6a5 5 0 0 1 5-5h6"/><path d="M13.5 6.5v7h-7" stroke-dasharray="2 2"/></svg>',"tw-gap":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"tw-align":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3.5h12M2 8h8M2 12.5h10"/></svg>',"tw-w":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3.5v9M14 3.5v9"/><path d="M4.5 8h7"/><path d="M6 6.2 4.2 8 6 9.8M10 6.2 11.8 8 10 9.8"/></svg>',"tw-h":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 2h9M3.5 14h9"/><path d="M8 4.5v7"/><path d="M6.2 6 8 4.2 9.8 6M6.2 10 8 11.8 9.8 10"/></svg>',"tw-maxw":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3v10M14.5 3v10"/><path d="M5 8h6"/><path d="M6.6 6.2 4.8 8l1.8 1.8M9.4 6.2 11.2 8l-1.8 1.8"/></svg>',"tw-overflow":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="1.8" y="4.5" width="8.6" height="9.7" rx="1.2"/><path d="M6.5 1.8h7.7v7.7" stroke-linecap="round"/></svg>',"tw-border":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6"/><rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" stroke-width="1" opacity=".45"/></svg>'},bf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="10" width="18" height="11" rx="2"/><rect x="6" y="3" width="9" height="4" rx="1.4" fill="currentColor" stroke="none"/></svg>',xf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.1 12a8.9 8.9 0 1 0 2.8-6.5L3 8"/><path d="M3 3.4V8h4.6"/><path d="M12 7.4V12l3 1.8"/></svg>',kf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>',_f='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></svg>',Sf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/><path d="M3 17c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/></svg>',or=[["--gray-50","#fafafa"],["--gray-100","#f5f5f5"],["--gray-200","#e5e5e5"],["--gray-300","#d4d4d4"],["--gray-400","#a3a3a3"],["--gray-500","#737373"],["--gray-600","#525252"],["--gray-700","#404040"],["--gray-800","#262626"],["--gray-900","#171717"],["--gray-950","#0a0a0a"]],Zo=e=>[{id:`${e}-all`,icon:"box-all",title:"All sides",css:e,tw:e,menu:"spacing"},{id:`${e}-block`,icon:"box-block",title:"Top and bottom",css:`${e}-block`,tw:`${e}-block`,menu:"spacing",sep:!0},{id:`${e}-block-start`,icon:"box-block-start",title:"Top",css:`${e}-block-start`,tw:`${e}-top`,menu:"spacing"},{id:`${e}-block-end`,icon:"box-block-end",title:"Bottom",css:`${e}-block-end`,tw:`${e}-bottom`,menu:"spacing"},{id:`${e}-inline`,icon:"box-inline",title:"Left and right",css:`${e}-inline`,tw:`${e}-inline`,menu:"spacing",sep:!0},{id:`${e}-inline-start`,icon:"box-inline-start",title:"Left",css:`${e}-inline-start`,tw:`${e}-left`,menu:"spacing"},{id:`${e}-inline-end`,icon:"box-inline-end",title:"Right",css:`${e}-inline-end`,tw:`${e}-right`,menu:"spacing"}],wf=[{id:"display-flex",twClass:"flex",icon:"display-flex",title:"Flex",kind:"display",value:"flex",css:"display"},{id:"flex-row",twClass:"flex-row",icon:"flex-row",title:"Direction: row",kind:"flexDir",value:"row",css:"flex-direction",sep:!0},{id:"flex-col",twClass:"flex-col",icon:"flex-col",title:"Direction: column",kind:"flexDir",value:"column",css:"flex-direction"},{id:"justify-start",twClass:"justify-start",icon:"justify-start",title:"Justify: start",css:"justify-content",value:"flex-start",when:"flex",sep:!0},{id:"justify-center",twClass:"justify-center",icon:"justify-center",title:"Justify: center",css:"justify-content",value:"center",when:"flex"},{id:"justify-end",twClass:"justify-end",icon:"justify-end",title:"Justify: end",css:"justify-content",value:"flex-end",when:"flex"},{id:"justify-between",twClass:"justify-between",icon:"justify-between",title:"Justify: between",css:"justify-content",value:"space-between",when:"flex"},{id:"justify-around",twClass:"justify-around",icon:"justify-around",title:"Justify: around",css:"justify-content",value:"space-around",when:"flex"},{id:"align-start",twClass:"items-start",icon:"align-start",title:"Align: start",css:"align-items",value:"flex-start",when:"flex",sep:!0},{id:"align-center",twClass:"items-center",icon:"align-center",title:"Align: center",css:"align-items",value:"center",when:"flex"},{id:"align-end",twClass:"items-end",icon:"align-end",title:"Align: end",css:"align-items",value:"flex-end",when:"flex"},{id:"align-stretch",twClass:"items-stretch",icon:"align-stretch",title:"Align: stretch",css:"align-items",value:"stretch",when:"flex"}],$f=[{id:"gap-all",icon:"gap-all",title:"Both",css:"gap",tw:"gap",menu:"spacing"},{id:"gap-row",icon:"gap-row",title:"Between rows",css:"row-gap",tw:"row-gap",menu:"spacing",sep:!0},{id:"gap-col",icon:"gap-col",title:"Between columns",css:"column-gap",tw:"column-gap",menu:"spacing"}],Cf=[{id:"bd-all",icon:"bd-all",title:"All sides",css:"border-color",tw:"border-color",menu:"colors"},{id:"bd-block",icon:"bd-block",title:"Top and bottom",css:"border-block-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-top",icon:"bd-top",title:"Top",css:"border-block-start-color",tw:"border-top-color",menu:"colors"},{id:"bd-bottom",icon:"bd-bottom",title:"Bottom",css:"border-block-end-color",tw:"border-bottom-color",menu:"colors"},{id:"bd-inline",icon:"bd-inline",title:"Left and right",css:"border-inline-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-left",icon:"bd-left",title:"Left",css:"border-inline-start-color",tw:"border-left-color",menu:"colors"},{id:"bd-right",icon:"bd-right",title:"Right",css:"border-inline-end-color",tw:"border-right-color",menu:"colors"}],Tf=[{id:"rd-all",icon:"rd-all",title:"All corners",css:"border-radius",tw:"border-radius",menu:"values"},{id:"rd-tl",icon:"rd-tl",title:"Top left",css:"border-start-start-radius",tw:"border-top-left-radius",menu:"values",sep:!0},{id:"rd-tr",icon:"rd-tr",title:"Top right",css:"border-start-end-radius",tw:"border-top-right-radius",menu:"values"},{id:"rd-br",icon:"rd-br",title:"Bottom right",css:"border-end-end-radius",tw:"border-bottom-right-radius",menu:"values"},{id:"rd-bl",icon:"rd-bl",title:"Bottom left",css:"border-end-start-radius",tw:"border-bottom-left-radius",menu:"values"}],sr=[{id:"display",title:"Display",css:"display",tw:"display",kids:wf},{id:"absolute",title:"Position",css:"position",tw:"position",value:"absolute"},{id:"color",title:"Text color",css:"color",tw:"color",menu:"colors"},{id:"bg",title:"Background color",css:"background-color",tw:"background-color",menu:"colors"},{id:"padding",title:"Padding",css:"padding",tw:"padding",kids:Zo("padding")},{id:"margin",title:"Margin",css:"margin",tw:"margin",kids:Zo("margin")},{id:"tw-text",title:"Font size",css:"font-size",tw:"font-size",menu:"values"},{id:"tw-leading",title:"Line height",css:"line-height",tw:"line-height",menu:"values"},{id:"tw-font",title:"Font family",css:"font-family",tw:"font-family",menu:"values"},{id:"tw-align",title:"Text align",css:"text-align",tw:"text-align",menu:"choices",choices:["left","center","right","justify"]},{id:"tw-border",title:"Border color",css:"border-color",tw:"border-color",kids:Cf},{id:"tw-radius",title:"Radius",css:"border-radius",tw:"border-radius",kids:Tf},{id:"tw-gap",title:"Gap",css:"gap",tw:"gap",kids:$f},{id:"tw-w",title:"Width",css:"width",tw:"width",menu:"sizes"},{id:"tw-h",title:"Height",css:"height",tw:"height",menu:"sizes"},{id:"tw-maxw",title:"Max width",css:"max-width",tw:"max-width",menu:"sizes"},{id:"tw-overflow",title:"Overflow",css:"overflow",tw:"overflow",menu:"choices",choices:["visible","hidden","clip","auto","scroll"]}],Af=["100%","auto","fit-content","min-content","max-content","100vw","100dvh","0"],Tt=new Map;for(const e of sr){Tt.set(e.id,{tool:e,kid:null});for(const t of e.kids||[])Tt.set(t.id,{tool:e,kid:t})}const Yo={display:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2.5" width="13" height="11" rx="1.2"/><path d="M5 6.5h6M5 9.5h4"/></svg>',"display-flex":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="3.4" height="9" rx=".4"/><rect x="6.3" y="3.5" width="3.4" height="9" rx=".4"/><rect x="10.6" y="3.5" width="3.4" height="9" rx=".4"/></svg>',"flex-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12"/><path d="M4.2 5.8 2 8l2.2 2.2"/><path d="M11.8 5.8 14 8l-2.2 2.2"/></svg>',"flex-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v12"/><path d="M5.8 4.2 8 2l2.2 2.2"/><path d="M5.8 11.8 8 14l2.2-2.2"/></svg>',"justify-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="5.4" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4.6" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="8.2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-between":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-around":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"align-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="5.4" width="9" height="2.4" rx=".4"/></svg>',"align-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="4.6" width="9" height="2.4" rx=".4"/><rect x="3.5" y="9" width="9" height="2.4" rx=".4"/></svg>',"align-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="8.2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="11.6" width="9" height="2.4" rx=".4"/></svg>',"align-stretch":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx=".5"/><rect x="9" y="2" width="4" height="12" rx=".5"/></svg>',absolute:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>',color:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.4 11.2 7.4 2.4l4 8.8"/><path d="M4.7 8.4h5.4"/><rect x="1.6" y="12.8" width="12.8" height="2.2" rx=".6" fill="currentColor" stroke="none"/></svg>',bg:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 1.9a6.1 6.1 0 1 0 0 12.2c.85 0 1.35-.55 1.35-1.25 0-.38-.18-.66-.4-.88a1.2 1.2 0 0 1 .85-2.05h1.3A3.5 3.5 0 0 0 14.1 6.1C14.1 3.75 11.4 1.9 8 1.9Z"/><circle cx="4.9" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="8" cy="4.8" r=".95" fill="currentColor" stroke="none"/><circle cx="11.1" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="4.7" cy="9.9" r=".95" fill="currentColor" stroke="none"/></svg>',padding:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/></svg>',margin:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/><path d="M2 2.5h12M2 13.5h12M2.5 2v12M13.5 2v12" stroke-dasharray="1.4 1.2"/></svg>',"box-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".4" fill="currentColor" stroke="none"/></svg>',"box-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"gap-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"gap-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="3" y="1.6" width="10" height="4.2" rx=".6"/><rect x="3" y="10.2" width="10" height="4.2" rx=".6"/><path d="M4.5 8h7"/></svg>',"gap-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"bd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4"/></svg>',"bd-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-top":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-bottom":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-left":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-right":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"rd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="3.4"/></svg>',"rd-tl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6H6a3.4 3.4 0 0 0-3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M2.6 9V6A3.4 3.4 0 0 1 6 2.6h3" stroke-width="2.2"/></svg>',"rd-tr":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6h7.4a3.4 3.4 0 0 1 3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M7 2.6h3A3.4 3.4 0 0 1 13.4 6v3" stroke-width="2.2"/></svg>',"rd-br":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6v7.4a3.4 3.4 0 0 1-3.4 3.4H2.6" stroke-width="1" opacity=".35"/><path d="M13.4 7v3a3.4 3.4 0 0 1-3.4 3.4H7" stroke-width="2.2"/></svg>',"rd-bl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6v7.4a3.4 3.4 0 0 0 3.4 3.4h7.4" stroke-width="1" opacity=".35"/><path d="M2.6 7v3A3.4 3.4 0 0 0 6 13.4h3" stroke-width="2.2"/></svg>'},v={html:null,css:null,js:null},Ue={html:null,css:null,js:null},Ke={html:null,css:null,js:null};export{Yf as ARMED_KEY,pf as AUTOSAVE_ICON,Ja as AUTOSAVE_KEY,ff as BACK_ICON,gf as CSS_ADD_ICON,or as CSS_GRAYS,Af as CSS_LENGTHS,x as CSS_MENU_ID,kf as CSS_MODE_ICON,Yn as CSS_SIZE_KEY,vf as CSS_SPACING,Jn as CSS_STATES,mn as CSS_STATE_KEY,sr as CSS_TOOLS,Yo as CSS_TOOL_ICONS,Tt as CSS_TOOL_INDEX,hf as DATA_ICON,Le as DATA_MENU_ID,lf as DEFAULT_HEIGHT,u as DOCK_ID,J as Decoration,Je as EditorState,I as EditorView,se as HANDLES,Xa as HEIGHT_KEY,xf as HISTORY_ICON,nr as HTML_HEADINGS,bn as HTML_TOOLS,_f as ID_MODE_ICON,df as LOCK_CLOSED_ICON,uf as LOCK_OPEN_ICON,er as MIN_HEIGHT,an as MIN_PANE,we as PANES,Za as PANES_KEY,ue as RangeSetBuilder,mf as SAVE_ICON,cf as SAVE_MS,af as SCOPE_CLASS,tr as SCOPE_ICON,Gt as SCOPE_KEY,bf as STRIP_ICON,rf as STYLE_ID,Qa as STYLE_MODE_KEY,je as StateEffect,de as StateField,Sf as TW_MODE_ICON,yf as TW_TOOL_ICONS,K as UNLOCK_ID,ao as VALUES_MODE_KEY,Ya as WIDTHS_KEY,rt as applyCssFolds,nt as applyCssScope,Oc as applyDisplay,Ic as applyFlexDirection,ea as applyHtmlTag,G as applyRuleDecls,ya as applyStyleMode,za as autocompletion,Hn as autosaveEnabled,Pu as bindAntlersSnippets,Co as bindAutosave,Xo as bindBack,Ac as bindCssAddClass,ru as bindCssTools,Ou as bindDataVars,Qd as bindHistory,To as bindHtmlScope,lu as bindHtmlTidy,cu as bindHtmlTools,Yu as bindLayoutWatch,$o as bindLock,nf as bindPaneToggles,ef as bindResize,tf as bindSplitters,Jd as bindStrip,au as bindStyleMode,zu as bindVisualEditSnippets,ot as clearHtmlScopeRange,ja as closeBrackets,Ha as closeBracketsKeymap,xa as closeCodeDock,Uf as closeCodeDockPopups,Ra as closeCompletion,S as closeCssMenu,N as closeDataMenu,C as cm,Kf as codeDockStyleMode,Ka as codeFolding,Kt as collectionViewType,Wa as completionKeymap,Va as css,ta as cssEditorText,Wt as cssRuleAtCursor,pa as cssSizeRow,ge as cssSizeRows,Vt as cssStateSuffix,Z as currentFlexDecls,$e as currentFullHtml,qs as currentSectionValues,ve as currentTemplateType,Ia as defaultKeymap,be as dispatchHtmlChanges,Ke as editableOf,v as editors,Ku as ensureStyle,Rs as ensureTwCss,va as enterValuesRule,P as finishHtmlEdit,uc as flushBracketSync,ce as flushCssScope,fc as flushCssToHtml,R as flushSave,vn as foldEffect,Ga as foldedRanges,Us as goBackTemplate,Ba as highlightActiveLine,Fa as highlightActiveLineGutter,Da as history,Pa as historyKeymap,Na as hoverTooltip,qa as html,Xs as htmlEditorText,st as htmlElementAtCursor,Pt as htmlFocusOk,Ct as htmlLanguage,tt as htmlScopeEnabled,Ce as htmlTargetFromCursor,Mu as inDynamicAttribute,Nt as indentFromPrevious,Oa as indentWithTab,fu as insertAiSnippet,Js as insertHtmlElement,Ze as insertHtmlSnippet,js as isChromeTemplateType,$r as isCodeDockArmed,me as isCodeDockLocked,ba as isCodeDockOpen,Wu as isPanelFrame,Ua as javascript,gn as keymap,Ru as languageOf,xe as leadingCssIndent,le as lineIndentOf,La as lineNumbers,sf as loadCm,ze as loadTemplate,Wd as mountEditor,ma as newSizeBlockSpot,pn as newSizeQuery,F as normalizeFlexValue,to as observeDockLayout,ee as onEditorInput,jc as openCssChoiceMenu,zc as openCssColorMenu,Hc as openCssSpacingMenu,Io as openCssValueMenu,ka as openDataVarsMenu,Cc as openHtmlComponentMenu,Eo as openHtmlTagMenu,Vs as openNestedTemplate,_a as openPickerMenu,pc as openRenameClassMenu,qt as paintAlpine,Y as paintAutosave,Fe as paintBack,Se as paintCssHead,Xn as paintCssIdMark,B as paintCssToolState,Nd as paintHostWait,V as paintHtmlScope,Rt as paintHtmlToolState,_e as paintLock,Aa as paintPaneButtons,Ee as paintStrip,Ut as paintStyleMode,Zn as paintValuesMode,D as placeCssMenu,Be as placeDock,no as previewBottomPad,cc as primeTailwindCompile,Ue as readOnlyOf,Un as readParts,pu as refreshCodeDockFromDisk,kt as refreshPreview,mu as relayoutCodeDock,zt as rememberBracketNames,Pe as rememberCssSelectors,Hs as resetTailwindCompile,Kn as sameParts,Jf as setCodeDockArmed,so as setPath,O as setStatus,tu as setValuesMode,Go as shieldDock,qn as showHtmlFull,Nn as showHtmlScope,Zu as stopObservingDockLayout,wa as storedPanes,Gf as syncCodeDock,cn as syncHtmlTree,Dt as syncScopedHtml,it as syncTwTarget,of as tags,wr as templateDockAllowed,Qs as tidyHtmlPane,yn as unfoldEffect,jt as writeHandleEditor,Ht as writeHtmlEditor,De as writeParts};
