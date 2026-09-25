const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-C_hT6KCx.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{H as No,a6 as he,X as Qa}from"./ai-text-icon-BLblG_5e.js";import{v as tr,l as er}from"./codemirror-BhZ-2O48.js";import{o as k,j as _,k as b,l as A,A as nr,a as ot,B as qo,D as we,F as H,m as st,E as L,v as Vo,g as gn,u as w,G as Ke,w as j,_ as Uo,n as or,t as m,H as Jn,I as sr,J as ar,h as Ge,K as rr,L as Qn,M as ir,c as X,O as N,z as lr,C as cr,y as Ko,P as dr,Q as to,R as ur,S as V,T as ft,U as eo,V as fr,x as z,W as vn,X as Go,Y as hr,Z as pr,f as yn,$ as mr,a0 as Zt,b as bn,a1 as gr,a2 as vr,a3 as yr,a4 as br,a5 as xn,a6 as kn,a7 as Xo,a8 as Nt,a9 as xr,aa as no,ab as Xe,ac as kr,ad as _r,ae as en,af as Sr,ag as wr,ah as Zo,ai as Yo,aj as T,i as $r,ak as Cr,al as oo,am as Tr}from"./addon-DGXExEtp.js";import{an as zf,ao as jf}from"./addon-DGXExEtp.js";import{p as $e,f as Jo,h as Ar,t as Qo,c as Mr,a as ts,b as Er,d as Lr,e as Br,g as Fr,i as so,j as Ir,k as Or,l as es,m as Pr,n as Dr,o as zr,q as jr,s as Hr,r as ns,u as Rr,v as nn,w as Wr,H as os,x as Nr,y as qr,z as ss,A as Vr,B as Ur,_ as as,C as ao,P as re}from"./tw-classes-DytoUuCD.js";import{M as rs,S as is}from"./protocol-Brvy2KuB.js";import{t as Kr}from"./tw-candidates-wYTeDvRv.js";import{h as Gr,a as Xr,e as Zr,A as ro,b as Yr,i as _n,c as Jr,d as pe}from"./html-tag-sync-d11C5bRZ.js";import"./index-Dpuj8sxX.js";import"./index-B5fiB6ig.js";import"./index-QkwZ_wP2.js";import"./index-CY0AOW5Y.js";import"./index-gYg9gdv3.js";import"./index-lzvKgifK.js";import"./index-BBw1nzv2.js";import"./index-DqbOpr3Y.js";import"./index-C_pm8ee_.js";import"./index-B8kpdD8S.js";const ls=/^\.[a-zA-Z_][\w-]*$/;function Ce(t){const e=String(t||""),n=/(^|\s)\[/g;let o;for(;o=n.exec(e);){const s=o.index+o[1].length,a=/\](?=\s|$)/g;a.lastIndex=s+1;const i=a.exec(e);if(i)return{from:s,to:i.index+1,innerFrom:s+1,innerTo:i.index}}return null}function cs(t){const e=String(t||""),n=Ce(e);return n?e.slice(n.innerFrom,n.innerTo).replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).filter(o=>/^[a-zA-Z_][\w-]*$/.test(o)):[]}function ds(t){const e=String(t||"").match(/\sclass\s*=\s*(["'])([^"']*)\1/i);return e?cs(e[2]):[]}function Qr(t){return ds(t)[0]||""}function Yt(t){const e=String(t||""),n=[],o=/\sclass\s*=\s*(["'])/gi;let s;for(;s=o.exec(e);){const a=s[1],i=s.index+s[0].length,l=e.indexOf(a,i);if(l===-1)break;const c=e.slice(i,l),d=Ce(c);if(d){const f=c.slice(d.innerFrom,d.innerTo),h=i+d.innerFrom,p=f.replace(/\{\{[\s\S]*?\}\}/g,E=>" ".repeat(E.length)),y=/[a-zA-Z_][\w-]*/g;let v;for(;v=y.exec(p);)n.push({name:v[0],from:h+v.index,to:h+v.index+v[0].length})}o.lastIndex=l+1}return n}function io(t,e){return Yt(t).find(n=>e>=n.from&&e<=n.to)||null}function lo(t,e){const n=String(t||""),o=Yt(n);let s=n;for(let a=o.length-1;a>=0;a-=1){const i=o[a],l=e(i.name);if(l!==i.name){if(!l){let c=i.from,d=i.to;s[d]===" "?d+=1:c>0&&s[c-1]===" "&&(c-=1),s=s.slice(0,c)+s.slice(d);continue}s=s.slice(0,i.from)+l+s.slice(i.to)}}return s}function us(t){const e=[],n=/(^|[^\w-])\.([a-zA-Z_][\w-]*)\s*\{/g;let o;for(;o=n.exec(String(t||""));)e.push(o[2]);return e}function fs(t,e){const n=[],o=[],s=[];let a=0,i=0;for(;a<t.length&&i<e.length;){if(t[a]===e[i]){a+=1,i+=1;continue}const l=e.indexOf(t[a],i),c=t.indexOf(e[i],a);l===-1&&c===-1?(n.push({from:t[a],to:e[i]}),a+=1,i+=1):l===-1?(s.push(t[a]),a+=1):c===-1||l<=c?(o.push(e[i]),i+=1):(s.push(t[a]),a+=1)}for(;a<t.length;)s.push(t[a]),a+=1;for(;i<e.length;)o.push(e[i]),i+=1;return{renamed:n,added:o,removed:s}}function at(t){let e=String(t||"").trim().replace(/^\.+/,"").replace(/\s+/g,"-").replace(/[^a-zA-Z0-9_-]/g,"");return/^[a-zA-Z_]/.test(e)||(e=e.replace(/^[^a-zA-Z_]+/,"")),ls.test(`.${e}`)?e:""}function ti(t,e){const n=String(t||""),o=at(e);if(!n||!o)return n;const s=n.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(s){const a=s[1];let i=s[2];const l=Ce(i);if(l){const c=i.slice(l.innerFrom,l.innerTo).trim(),f=cs(i).includes(o)?c:`${c} ${o}`.trim();i=`${i.slice(0,l.from)}[ ${f} ]${i.slice(l.to)}`}else i=`[ ${o} ] ${i}`.trim();return n.slice(0,s.index)+` class=${a}${i}${a}`+n.slice(s.index+s[0].length)}return/\/\s*>$/.test(n)?n.replace(/(\s*)(\/\s*>)$/,` class="[ ${o} ]"$1$2`):n.replace(/(\s*)>$/,` class="[ ${o} ]"$1>`)}function ei(t,e){const n=String(t).indexOf(">",e.from);return n===-1?"":t.slice(e.from,n+1)}function hs(t,e){const n=[];for(const o of e){const s=ds(ei(t,o)),a=hs(t,o.children||[]);if(s.length){n.push({className:s[0],children:a});for(const i of s.slice(1))n.push({className:i,children:[]})}else n.push(...a)}return n}function Te(t){return hs(t,$e(t))}function me(t){return String(t).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function Sn(t,e){if(t.startsWith("/*",e)){const n=t.indexOf("*/",e+2);return n===-1?t.length:n+2}return e}function Mt(t,e){let n=0;for(let o=e;o<t.length;o+=1){if(t.startsWith("/*",o)){o=Sn(t,o)-1;continue}if(t[o]==="{")n+=1;else if(t[o]==="}"&&(n-=1,n===0))return o}return-1}function R(t,e){const n=String(t||""),o=new RegExp(`(^|[^\\w-])\\.${me(e)}\\s*\\{`,"g");let s;for(;s=o.exec(n);){const a=s.index+s[1].length,i=n.indexOf("{",a);if(i===-1)continue;const l=Mt(n,i);if(l!==-1)return{from:a,brace:i,close:l,to:l+1,name:e}}return null}function ni(t){const e=String(t||""),n=[],o={},s=[];let a=0,i="";const l=()=>{const c=i.trim();c&&n.push(c),i=""};for(;a<e.length;){if(e.startsWith("/*",a)){const c=Sn(e,a);i+=e.slice(a,c),a=c;continue}if(e[a]==="{"){const c=i.trim(),d=Mt(e,a);if(d===-1)break;const f=e.slice(a+1,d);i="",ls.test(c)?o[c.slice(1)]=f:c&&s.push(`${c} {${f}}`),a=d+1;continue}i+=e[a],a+=1}return l(),{decls:n.join(`
`),classes:o,other:s}}function co(t,e){const n="    ".repeat(e);return String(t||"").split(`
`).map(o=>o.trim()?n+o.trim():"").filter((o,s,a)=>o||s>0&&s<a.length-1).join(`
`)}function oi(t,e){const n=R(t,e);return n?String(t).slice(n.brace+1,n.close):""}function ps(t,e,n){const o=ni(oi(e,t.className)),s="    ".repeat(n),a=[];o.decls&&a.push(co(o.decls.replace(/;+\s*$/,";"),n+1));for(const l of o.other)a.push(co(l,n+1));for(const l of t.children)a.push(ps(l,e,n+1));const i=a.filter(Boolean).join(`
`);return i?`${s}.${t.className} {
${i}
${s}}`:`${s}.${t.className} {
${s}}`}function wn(t,e){return e?.length?e.map(n=>ps(n,t,0)).join(`

`)+`
`:""}function ms(t){const e=String(t||"").match(/^\s*\.([a-zA-Z_][\w-]*)\s*\{/);return e?e[1]:""}function si(t){const e=[],n=/\.([a-zA-Z_][\w-]*)\s*\{/g;let o,s=!0;for(;o=n.exec(String(t||""));){if(s){s=!1;continue}e.push(o[1])}return e}function ai(t,e){const n=String(t).lastIndexOf(`
`,e-1)+1,o=t.slice(n,e);return/^\s*$/.test(o)?o:""}function ri(t,e){return e?t.split(`
`).map((n,o)=>o===0||!n?n:e+n).join(`
`):t}function ii(t,e){let n=0;for(let o=0;o<e.from;o+=1){if(t.startsWith("/*",o)){o=Sn(t,o)-1;continue}t[o]==="{"?n+=1:t[o]==="}"&&(n-=1)}return n===0}function $n(t,e,n){const o=ms(e)||n;if(!o)return String(t||"");let s=String(e||"").trim();s?new RegExp(`^\\.${me(o)}\\s*\\{`).test(s)||(s=`.${o} {
${s}
}`):s=`.${o} {
}`;let a=String(t||"");const i=R(a,o),l=si(s);if(i){const d=ai(a,i.from);a=a.slice(0,i.from)+ri(s,d)+a.slice(i.to)}else a=`${a.trimEnd()}${a.trim()?`
`:""}${s}
`;const c=R(a,o);if(!c)return a;for(const d of[...new Set(l)].reverse()){const f=new RegExp(`(^|[^\\w-])\\.${me(d)}\\s*\\{`,"g"),h=[];let p;for(;p=f.exec(a);){const y=p.index+p[1].length,v=a.indexOf("{",y),E=Mt(a,v);E!==-1&&h.push({from:y,to:E+1})}for(const y of h.reverse()){if(y.from>=c.from&&y.to<=c.to||!ii(a,y))continue;let v=y.from;const E=a.lastIndexOf(`
`,v-1)+1;/^\s*$/.test(a.slice(E,v))&&(v=E);let Ot=y.to;a[Ot]===`
`&&(Ot+=1),a=a.slice(0,v)+a.slice(Ot)}}return a}function Ze(t,e){const n=String(t||"");return`${n.trimEnd()}${n.trim()?`
`:""}.${e} {
}
`}function li(t,e,n){const o=String(t||""),s=v=>v.trim().replace(/;$/,"").replace(/\s+/g," "),a=String(n||"").split(`
`).map(v=>v.trim()).filter(Boolean).map(v=>v.endsWith(";")||v.endsWith("}")?v:`${v};`);if(!a.length)return o;const i=R(o,e);if(!i)return`${o.trimEnd()}${o.trim()?`

`:""}.${e} {
${a.map(v=>`  ${v}`).join(`
`)}
}
`;const l=o.slice(i.brace+1,i.close),c=new Set(l.split(/[;\n]/).map(s).filter(Boolean)),d=a.filter(v=>!c.has(s(v)));if(!d.length)return o;const f=(o.slice(0,i.close).match(/\n([ \t]*)$/)||[null,""])[1],h=(l.match(/\n([ \t]+)\S/)||[])[1]||`${f}  `,p=l.replace(/^\s*\n/,"").replace(/\s+$/,""),y=p?`
${p}`:"";return`${o.slice(0,i.brace+1)}
${d.map(v=>`${h}${v}`).join(`
`)}${y}
${f}${o.slice(i.close)}`}function ci(t,e,n){const o=at(n);return!e||!o||e===o?String(t||""):R(t,o)?gs(t,e):String(t||"").replace(new RegExp(`(^|[^\\w-])\\.${me(e)}(\\s*\\{)`,"g"),`$1.${o}$2`)}function gs(t,e){let n=String(t||"");for(;;){const o=R(n,e);if(!o)break;let s=o.from;const a=n.lastIndexOf(`
`,s-1)+1;/^\s*$/.test(n.slice(a,s))&&(s=a);let i=o.to;n[i]===`
`&&(i+=1),n=n.slice(0,s)+n.slice(i)}return n}function di(t,e,n){const o=Array.isArray(e)?e:[],s=Array.isArray(n)?n:[],{renamed:a,added:i}=fs(o,s),l=new Set(s);let c=String(t||"");for(const d of a){const f=at(d.to);if(f){if(l.has(d.from)){R(c,f)||(c=Ze(c,f));continue}R(c,d.from)?c=ci(c,d.from,f):R(c,f)||(c=Ze(c,f))}}for(const d of i){const f=at(d);!f||R(c,f)||(c=Ze(c,f))}return c}function ui(t,e,n){const o=new Set(Array.isArray(e)?e:[]),s=new Set(Array.isArray(n)?n:[]);let a=String(t||"");for(const i of s)o.has(i)||(a=gs(a,i));return a}const Q="__sve-css-rename-chip",fi='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';function hi(t){const e=t.Decoration.mark({class:"sve-cm-css-token"}),n=t.StateEffect.define();return{extensions:[t.StateField.define({create(){return t.Decoration.none},update(s,a){let i;for(const c of a.effects)c.is(n)&&(i=c.value);if(i===void 0)return a.docChanged?t.Decoration.none:s;if(!i)return t.Decoration.none;const l=new t.RangeSetBuilder;return l.add(i.from,i.to,e),l.finish()},provide:s=>t.EditorView.decorations.from(s)})],setHover(s,a){s&&s.dispatch({effects:n.of(a)})}}}function tt(t){t?.getElementById(Q)?.remove()}function pi(t,e,n,o){e.style.left=`${Math.max(6,Math.min(n,t.innerWidth-28))}px`,e.style.top=`${Math.max(6,o)}px`}function mi(t,e,n,{onRename:o,title:s}){const a=t.document,i=e.coordsAtPos(n.to);if(!i)return;tt(a);const l=a.createElement("button");l.id=Q,l.type="button",l.innerHTML=fi,l.title=s,l.setAttribute("aria-label",s),l.addEventListener("mousedown",c=>{c.preventDefault(),c.stopPropagation(),tt(a),o?.(n)}),l.addEventListener("mouseleave",()=>{t.setTimeout(()=>{e.dom.matches(":hover")||l.matches(":hover")||tt(a)},120)}),a.body.appendChild(l),pi(t,l,i.right+2,i.top-1)}function gi(t,e,{onRename:n,isLocked:o,setHover:s,title:a}){if(!e?.dom||e.dom._sveClassTokenBound)return;e.dom._sveClassTokenBound=!0;let i=null,l="";const c=()=>!!o?.(),d=()=>{t.clearTimeout(i),i=null,l="",s?.(e,null),tt(t.document)},f=h=>{if(c()){d();return}d(),n?.(h)};e.dom.addEventListener("mousemove",h=>{if(c()){d();return}if(h.target?.closest?.(`#${Q}`))return;const p=e.posAtCoords({x:h.clientX,y:h.clientY});if(p==null)return;const y=io(e.state.doc.toString(),p);if(!y){t.clearTimeout(i),i=null,l="",s?.(e,null);return}const v=`${y.from}:${y.to}:${y.name}`;s?.(e,{from:y.from,to:y.to}),!(l===v&&(i||t.document.getElementById(Q)))&&(t.clearTimeout(i),l=v,i=t.setTimeout(()=>{i=null,mi(t,e,y,{onRename:f,title:a||"Rename class"})},160))}),e.dom.addEventListener("mouseleave",h=>{h.relatedTarget?.closest?.(`#${Q}`)||t.setTimeout(()=>{t.document.getElementById(Q)?.matches(":hover")||d()},160)}),e.dom.addEventListener("dblclick",h=>{if(c())return;const p=e.posAtCoords({x:h.clientX,y:h.clientY});if(p==null)return;const y=io(e.state.doc.toString(),p);y&&(h.preventDefault(),h.stopPropagation(),f(y))},!0),e.scrollDOM?.addEventListener("scroll",d),t.document._sveClassTokenDismiss||(t.document._sveClassTokenDismiss=!0,t.document.addEventListener("mousedown",h=>{h.target.closest(`#${Q}`)||tt(t.document)}))}const r={cssColorsPromise:null,lastUid:null,lastType:null,typeStack:[],lastParts:{html:"",css:"",js:""},lastProps:[],propsDirty:!1,lastLocked:!1,lockReady:!1,lastWin:null,loadGen:0,saveTimer:null,lastBracketNames:null,lastCssSelectorNames:null,saveInFlight:null,loadInFlight:null,dragging:!1,applying:!1,htmlScopePref:!0,htmlScopeActive:!1,styleMode:"css",cssToolRow:null,cssOpenTool:"",cssOpenMenu:"",cssValues:!1,twCss:null,twKey:"",twBusy:!1,twDirty:!1,htmlFocus:null,htmlFull:"",cssFull:"",cssPane:"full",cssScopeSnapshot:"",layoutObserver:null,layoutWin:null,observedEditor:null,observedRight:null,layoutWatchBound:!1,cssSize:"",cssState:"",cssOwnFolds:new Set,cssFoldSig:"",htmlPartialUi:null,htmlAntlersUi:null,htmlClassTokenUi:null,htmlLintUi:null,cssGhostUi:null},$t=new Map,uo={scope:null,section:[],page:[],site:[]};function vs(t){const e=t?.location?.pathname?.match(/\/collections\/([^/]+)\//);return e?e[1]:""}function ys(t){const e=String(t||"").trim();return!e||/^(header|footer)\//.test(e)?"":e}function vi(t){return(Array.isArray(t)?t:[]).filter(e=>e?.handle).map(e=>`${e.kind==="collection"?"collection":"field"}:${e.handle}`).join("|")}function Cn({collection:t,set:e,view:n,scope:o}){return`${t}::${e}::${n||""}::${o||""}`}function bs(t){return $t.get(t)||null}function xs(t,{collection:e,set:n,view:o,scope:s}){const a=Cn({collection:e,set:n,view:o,scope:s}),i=$t.get(a);if(i)return Promise.resolve(i);const l=new URLSearchParams;return e&&l.set("collection",e),n&&l.set("set",n),o&&l.set("view",o),s&&l.set("scope",s),t.fetch(`/!/sve/data-vars?${l.toString()}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(c=>c.ok?c.json():null).then(c=>{const d=c&&typeof c=="object"?c:uo;return $t.set(a,d),d}).catch(()=>uo)}function yi(t){if(!t){$t.clear();return}const e=`::${t}::`;for(const n of[...$t.keys()])n.includes(e)&&$t.delete(n)}function bi(t){if(t==null||t==="")return"";if(typeof t=="boolean")return t?"true":"false";if(Array.isArray(t))return t.length?`${t.length} ×`:"";if(typeof t=="object"){const n=Object.keys(t).length;return n?`${n} ×`:""}const e=String(t).replace(/\s+/g," ").trim();return e.length>60?`${e.slice(0,60)}…`:e}function xi(t,e){return e.split(".").reduce((n,o)=>n&&typeof n=="object"?n[o]:void 0,t)}function ks(t,e){return!Array.isArray(t)||!e||typeof e!="object"?t||[]:t.map(n=>{if(n.parent||n.value!=null||n.var.includes(":"))return n;const o=bi(xi(e,n.var));return o?{...n,value:o}:n})}function ki(t,e){return Array.isArray(t)?t.map(n=>({...n,items:ks(n.items,e)})):[]}function _i(t,e){const n=String(t?.var||"").trim();if(!n)return null;if(t.loop)return{text:`{{ ${n} }}
  
{{ /${n} }}`,cursor:`{{ ${n} }}
  `.length};if(e?.loop&&!t.parent){const o=e.loop;return{text:`{{ ${o} }}
  {{ ${n} }}
{{ /${o} }}`,cursor:`{{ ${o} }}
  {{ ${n} }}`.length}}return{text:`{{ ${n} }}`,cursor:`{{ ${n} }}`.length}}const ie="visual_edit",fo=[{id:"base",lang:"code_dock_visual_edit_base"},{id:"field",lang:"code_dock_visual_edit_field"}],_s=[{id:"tag",group:"base",label:"{{ visual_edit }}",standalone:"{{ visual_edit| }}"},{id:"ve_popup",group:"base",label:"popup",attr:'popup="true"'},{id:"ve_orderable",group:"base",label:"orderable",attr:'orderable="true"'},{id:"ve_section_orderable",group:"base",label:"section_orderable",attr:'section_orderable="true"'},{id:"ve_outline_inside",group:"base",label:"outline_inside",attr:'outline_inside="true"'},{id:"ve_field",group:"field",label:"field",attr:'field="|"'},{id:"ve_inline_edit",group:"field",label:"inline_edit",attr:'inline_edit="true"'},{id:"ve_insertable",group:"field",label:"insertable",attr:'insertable="true"'},{id:"ve_toolbar",group:"field",label:"toolbar",attr:'toolbar="true"'},{id:"ve_scope",group:"field",label:"scope",attr:'scope="|"'},{id:"ve_controls",group:"field",label:"controls",attr:'controls="|"'}];function Si(t){return _s.find(e=>e.id===t)||null}function wi(t,e,n,o){let s=e;for(;s<n;){const a=t.indexOf("{{",s);if(a===-1||a>=n)return null;const i=t.indexOf("}}",a+2);if(i===-1||i+2>n)return null;const l=t.slice(a+2,i);if((l.trim().split(/\s+/)[0]||"")===o)return{openIdx:a,closeIdx:i,inner:l};s=i+2}return null}function $i(t,e){const n=String(e).split("=")[0].trim();return new RegExp(`(^|\\s)${n}(=|\\s|$)`).test(t)}const Ci={class:"sve-code-dock"},Ti={"data-sve-code-bar":""},Ai={type:"button","data-sve-code-pane-btn":"html"},Mi={type:"button","data-sve-code-pane-btn":"css"},Ei={type:"button","data-sve-code-pane-btn":"alpine"},Li={type:"button","data-sve-code-pane-btn":"js"},Bi={type:"button","data-sve-html-scope":"","aria-pressed":"true"},Fi=["innerHTML"],Ii={"data-sve-code-panes":""},Oi={"data-sve-code-pane":"html"},Pi={"data-sve-code-pane-label":""},Di=["title","aria-label"],zi=["innerHTML"],ji={"data-sve-code-pane":"css"},Hi={"data-sve-css-chrome":"subrow-2"},Ri={"data-sve-code-pane-label":""},Wi={"data-sve-css-label":""},Ni={"data-sve-code-pane":"alpine"},qi={"data-sve-code-pane-label":""},Vi={"data-sve-code-pane":"js"},Ui={"data-sve-code-pane-label":""},Ki={__name:"CodeDockChrome",props:{htmlLabel:{type:String,required:!0},cssLabel:{type:String,required:!0},jsLabel:{type:String,required:!0},alpineLabel:{type:String,required:!0},treeIcon:{type:String,required:!0},dataIcon:{type:String,required:!0},dataLabel:{type:String,required:!0}},setup(t){return(e,n)=>(k(),_("div",Ci,[n[18]||(n[18]=b("div",{"data-sve-code-grip":"","aria-hidden":"true"},null,-1)),b("div",Ti,[b("button",Ai,A(t.htmlLabel),1),b("button",Mi,A(t.cssLabel),1),b("button",Ei,A(t.alpineLabel),1),b("button",Li,A(t.jsLabel),1),n[0]||(n[0]=nr('<button type="button" data-sve-code-back hidden></button><span data-sve-code-path></span><span data-sve-code-status></span><button type="button" data-sve-code-strip></button><button type="button" data-sve-code-history></button><button type="button" data-sve-style-mode></button><button type="button" data-sve-values-mode></button><button type="button" data-sve-code-autosave aria-pressed="true"></button><button type="button" data-sve-code-save hidden></button>',9)),b("button",Bi,[b("span",{innerHTML:t.treeIcon},null,8,Fi)]),n[1]||(n[1]=b("button",{type:"button","data-sve-code-lock":"",hidden:""},null,-1))]),n[19]||(n[19]=b("div",{"data-sve-code-lock-banner":""},null,-1)),b("div",Ii,[b("div",Oi,[b("div",Pi,[b("span",null,A(t.htmlLabel),1),n[2]||(n[2]=b("div",{"data-sve-html-tools":""},null,-1)),n[3]||(n[3]=b("button",{type:"button","data-sve-html-tidy":""},null,-1)),b("button",{type:"button","data-sve-data-vars":"",title:t.dataLabel,"aria-label":t.dataLabel},[b("span",{innerHTML:t.dataIcon},null,8,zi)],8,Di),n[4]||(n[4]=b("div",{"data-sve-visual-edit-tools":""},null,-1)),n[5]||(n[5]=b("div",{"data-sve-antlers-tools":""},null,-1))]),n[6]||(n[6]=b("div",{"data-sve-html-problems":"",hidden:""},null,-1)),n[7]||(n[7]=b("div",{"data-sve-code-host":""},null,-1))]),n[15]||(n[15]=b("div",{"data-sve-code-split":"","data-sve-code-split-after":"html"},null,-1)),b("div",ji,[b("div",Hi,[b("div",Ri,[b("span",Wi,A(t.cssLabel),1),n[8]||(n[8]=b("button",{type:"button","data-sve-css-add-class":""},null,-1)),n[9]||(n[9]=b("div",{"data-sve-css-tools":""},null,-1))])]),n[10]||(n[10]=b("div",{"data-sve-css-head":""},null,-1)),n[11]||(n[11]=b("div",{"data-sve-code-host":""},null,-1)),n[12]||(n[12]=b("div",{"data-sve-tw-host":""},null,-1))]),n[16]||(n[16]=b("div",{"data-sve-code-split":"","data-sve-code-split-after":"css"},null,-1)),b("div",Ni,[b("div",qi,[b("span",null,A(t.alpineLabel),1)]),n[13]||(n[13]=b("div",{"data-sve-alpine-host":""},null,-1))]),n[17]||(n[17]=b("div",{"data-sve-code-split":"","data-sve-code-split-after":"alpine"},null,-1)),b("div",Vi,[b("div",Ui,[b("span",null,A(t.jsLabel),1)]),n[14]||(n[14]=b("div",{"data-sve-code-host":""},null,-1))])])]))}},ho="view:",po="partials/";function Ss(t){const e=String(t||"");if(!e.startsWith(ho))return null;const n=e.slice(ho.length);return n.startsWith(po)?n.slice(po.length):n}function Gi(t){const e=String(t||"").match(/\sclass\s*=\s*(["'])([\s\S]*?)\1/i);return e?e[2].replace(/\{\{[\s\S]*?\}\}/g,"\0").split(/[\s[\]]+/).filter(n=>n&&!n.includes("\0")&&/^[A-Za-z_][\w:./%!#-]*$/.test(n)):[]}const Xi=t=>globalThis.CSS?.escape?globalThis.CSS.escape(t):t.replace(/([^\w-])/g,"\\$1");function ws(t){const e=$e(t)[0];if(!e)return null;const n=Gi(String(t).slice(e.from,e.openTo));return!n.length&&!/^(header|footer|main|nav|aside|figure|form|table)$/.test(e.tag)?null:e.tag+n.map(o=>`.${Xi(o)}`).join("")}const jt=new Map;let Pt=null,mo=0,go=0,vo=!1;async function Zi(t,e){if(jt.has(e))return jt.get(e);const n=`view:partials/${e}`;let o=null;try{const s=await t.fetch(`/!/sve/section-template?type=${encodeURIComponent(n)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}});if(s.ok){const a=await s.json();o=typeof a.html=="string"?ws(a.html):null}}catch{}return jt.set(e,o),o}function Yi(t){t?jt.delete(t):jt.clear()}function $s(t){const e=Ss(ot("dock:current-type")),n=e?ot("dock:html"):"",o=e&&typeof n=="string"?ws(n):null;qo({source:is,type:rs.SVE_COMPONENT_FOCUS,on:!!o,name:e?String(e).split("/").pop():"",selector:o||""},t)}async function Tn(t){const e=++go,n=ot("dock:html"),o=[...new Set((typeof n=="string"?Jo(n):[]).map(a=>a.src).filter(a=>a&&!Ar(a)))],s=await Promise.all(o.map(a=>Zi(t,a)));e===go&&qo({source:is,type:rs.SVE_COMPONENT_MAP,items:o.map((a,i)=>({src:a,name:a.split("/").pop(),selector:s[i]})).filter(a=>a.selector)},t)}function Ji(t){Pt=t,!vo&&(vo=!0,we("dock:html-changed",()=>{Pt&&(Yi(Ss(ot("dock:current-type"))),Pt.clearTimeout(mo),mo=Pt.setTimeout(()=>{Tn(Pt)},400))}))}const Qi=["data-sve-html-tool","data-tip","aria-label","data-letter","onClick","onContextmenu"],tl=["innerHTML"],el={__name:"CodeDockHtmlTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(t){return(e,n)=>(k(!0),_(H,null,st(t.tools,o=>(k(),_("button",{key:o.id,type:"button","data-sve-html-tool":o.id,"data-tip":o.title,"aria-label":o.title,"data-letter":o.letter?"":void 0,onClick:L(s=>t.onTool(o.id),["prevent","stop"]),onContextmenu:L(s=>t.onTool(o.id),["prevent"])},[o.letter?(k(),_(H,{key:0},[Vo(A(o.letter),1)],64)):(k(),_("span",{key:1,innerHTML:o.icon},null,8,tl))],40,Qi))),128))}},dt=gn({tools:[],onTool:null,onKid:null}),nl=["data-sve-css-item"],ol=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],sl={key:0,"data-sve-css-kids":""},al={key:0,"data-sve-css-sep":"","aria-hidden":"true"},rl=["data-sve-css-kid","data-sve-css-box-side","data-tip","aria-label","innerHTML","onClick","onContextmenu"],il={__name:"CodeDockCssTools",setup(t){return(e,n)=>(k(!0),_(H,null,st(w(dt).tools,o=>(k(),_("li",Ke({key:o.id,"data-sve-css-item":o.id},{ref_for:!0},o.open?{"data-sve-css-open":""}:{}),[b("button",Ke({type:"button","data-sve-css-tool":o.id,"data-tip":o.title,"aria-label":o.title},{ref_for:!0},{...o.active?{"data-active":""}:{},...o.open?{"data-open":""}:{}},{innerHTML:o.icon,onClick:L(s=>w(dt).onTool?.(o.id),["prevent","stop"]),onContextmenu:L(s=>w(dt).onTool?.(o.id),["prevent"])}),null,16,ol),o.open&&o.kids.length?(k(),_("div",sl,[(k(!0),_(H,null,st(o.kids,s=>(k(),_(H,{key:s.id},[s.sep?(k(),_("span",al)):j("",!0),b("button",Ke({type:"button","data-sve-css-kid":s.id,"data-sve-css-box-side":s.id,"data-tip":s.title,"aria-label":s.title},{ref_for:!0},s.active?{"data-active":""}:{},{innerHTML:s.icon,onClick:L(a=>w(dt).onKid?.(o.id,s.id),["prevent","stop"]),onContextmenu:L(a=>w(dt).onKid?.(o.id,s.id),["prevent"])}),null,16,rl)],64))),128))])):j("",!0)],16,nl))),128))}},ll=1.5,cl=16;function ue(t,e){const n=parseFloat(t);return Number.isFinite(n)?e==="em"||e==="rem"?n*cl:n:null}function dl(t){const e=String(t||"").toLowerCase();if(/\bmin-width\b|\bwidth\s*>=?/.test(e))return null;let n=e.match(/\bmax-width\s*:\s*([\d.]+)(px|em|rem)/);return n||(n=e.match(/\bwidth\s*<=?\s*([\d.]+)(px|em|rem)/),n)?ue(n[1],n[2]):(n=e.match(/([\d.]+)(px|em|rem)\s*>=?\s*width\b/),n?ue(n[1],n[2]):null)}function ut(t,e){const n=dl(t);if(n===null)return"";for(const o of e||[]){if(o.base)continue;const s=ue(String(o.max||"").replace(/[a-z]+$/i,""),(String(o.max||"").match(/[a-z]+$/i)||[""])[0]);if(s!==null&&Math.abs(s-n)<=ll)return o.handle}return""}function Ae(t){let e="",n=0;for(;n<t.length;){const o=Me(t,n);if(o!==n){e+=" ".repeat(o-n),n=o;continue}e+=t[n],n+=1}return e}function Me(t,e){if(t.startsWith("/*",e)){const n=t.indexOf("*/",e+2);return n===-1?t.length:n+2}if(t.startsWith("{{",e)){const n=t.indexOf("}}",e+2);return n===-1?t.length:n+2}if(t[e]==='"'||t[e]==="'"){const n=t[e];for(let o=e+1;o<t.length;o+=1)if(t[o]==="\\")o+=1;else if(t[o]===n)return o+1;return t.length}return e}function Ee(t){const e=String(t||""),n=[],o=(s,a,i=0)=>{let l=s,c=l;for(;l<a;){const d=Me(e,l);if(d!==l){l=d;continue}if(e[l]===";"){l+=1,c=l;continue}if(e[l]==="}")return;if(e[l]!=="{"){l+=1;continue}const f=Ae(e.slice(c,l)),h=f.trim(),p=Cs(e,l,a);if(p===-1)return;/^@media\b/i.test(h)?n.push({query:h.replace(/^@media\s*/i,"").trim(),from:c+f.search(/\S/),to:p+1,bodyFrom:l+1,bodyTo:p,depth:i}):/^@(?:import|charset|use)\b/i.test(h)||o(l+1,p,i+1),l=p+1,c=l}};return o(0,e.length,0),n}function Cs(t,e,n){let o=0;for(let s=e;s<n;s+=1){const a=Me(t,s);if(a!==s){s=a-1;continue}if(t[s]==="{")o+=1;else if(t[s]==="}"&&(o-=1,o===0))return s}return-1}function Et(t){const e=String(t||""),n=(o,s)=>{const a=[];let i=o,l=i;for(;i<s;){const c=Me(e,i);if(c!==i){i=c;continue}if(e[i]===";"){i+=1,l=i;continue}if(e[i]==="}")return a;if(e[i]!=="{"){i+=1;continue}const d=Ae(e.slice(l,i)),f=d.trim(),h=Cs(e,i,s);if(h===-1)return a;a.push({prelude:f,media:/^@media\b/i.test(f),query:f.replace(/^@media\s*/i,"").trim(),from:l+d.search(/\S/),to:h+1,bodyFrom:i+1,bodyTo:h,children:/^@(?:import|charset|use)\b/i.test(f)?[]:n(i+1,h)}),i=h+1,l=i}return a};return n(0,e.length)}function ul(t,e,n){const o=String(t||"");if(!n)return[];const s=(e||[]).find(d=>d.base),a=Et(o),i=[],l=d=>d.media?ut(d.query,e)===n:d.children.some(l);if(s&&n===s.handle){const d=f=>{for(const h of f){if(h.media&&ut(h.query,e)){i.push({from:h.from,to:h.to});continue}d(h.children)}};return d(a),i}const c=(d,f,h)=>{const p=[];for(const v of d){if(v.media&&ut(v.query,e)===n){p.push({from:v.from,to:v.to,into:null});continue}l(v)&&p.push({from:v.from,to:v.to,into:v})}if(!p.length){h>f&&i.push({from:f,to:h});return}let y=f;for(const v of p)v.from>y&&i.push({from:y,to:v.from}),v.into&&c(v.into.children,v.into.bodyFrom,v.into.bodyTo),y=v.to;h>y&&i.push({from:y,to:h})};return c(a,0,o.length),i.filter(d=>o.slice(d.from,d.to).trim()!=="")}function fl(t,e){const n=String(t||""),o=[],s=i=>{for(const l of i){if((l.media&&ut(l.query,e)||/^#id-/.test(l.prelude))&&Ae(n.slice(l.bodyFrom,l.bodyTo)).trim()===""){o.push(l);continue}s(l.children)}};if(s(Et(n)),!o.length)return n;let a=n;for(const i of o.sort((l,c)=>c.from-l.from)){let l=i.from,c=i.to;const d=a.lastIndexOf(`
`,l-1)+1;for(a.slice(d,l).trim()===""&&(l=d);a[c]===" "||a[c]==="	";)c+=1;a[c]===`
`&&(c+=1),a=a.slice(0,l)+a.slice(c)}return a}function hl(t,e){const n=String(t||""),o=[],s=i=>Ae(n.slice(i.bodyFrom,i.bodyTo)).trim()==="",a=i=>{for(const l of i){if((l.media&&ut(l.query,e)||/^#id-/.test(l.prelude))&&s(l)){o.push({from:l.from,to:l.to});continue}a(l.children)}};return a(Et(n)),o}function ge(t,e,n){const o=e||[],s=o.find(d=>d.base),a=[],i=d=>/^#id-/.test(d.prelude)||/^#\s*$/.test(d.prelude),l=(d,f)=>{for(const h of d){if(!h.media){l(h.children,f);continue}const p=ut(h.query,o)||f;if(n===p){a.push(h);continue}l(h.children,p)}},c=(d,f)=>{for(const h of d){if(h.media){c(h.children,ut(h.query,o)||f);continue}if(i(h)){const p=f||(s?s.handle:"");!n||n===p?a.push(h):l(h.children,p);continue}c(h.children,f)}};return c(Et(String(t||"")),""),a.sort((d,f)=>d.from-f.from)}function An(t,e,n){return Ee(t).filter(o=>ut(o.query,e)===n)}const $=gn({tag:"",scope:"",scopeElsewhere:[],scopeElsewhereTitle:"",onScopeImport:null,onTag:null,sizes:[],onSize:null,state:"",stateLabel:"",onState:null,canEdit:!1,note:""}),pl={class:"sve-css-head"},ml=["disabled"],gl={key:1,class:"sve-css-scope"},vl=["title","disabled"],yl=["title","data-active","disabled","onClick"],bl=["data-active","disabled"],xl={key:3,class:"sve-css-note"},kl={__name:"CodeDockCssHead",setup(t){return(e,n)=>(k(),_("div",pl,[w($).tag?(k(),_("button",{key:0,type:"button",class:"sve-css-tag",disabled:!w($).canEdit,onClick:n[0]||(n[0]=L(()=>{},["prevent","stop"])),onDblclick:n[1]||(n[1]=L(o=>w($).onTag?.(o),["prevent","stop"]))},"<"+A(w($).tag)+">",41,ml)):j("",!0),w($).scope?(k(),_("span",gl,A(w($).scope),1)):j("",!0),w($).scope&&w($).scopeElsewhere.length?(k(),_("button",{key:2,type:"button",class:"sve-css-scope-taken",title:w($).scopeElsewhereTitle,disabled:!w($).canEdit,onClick:n[2]||(n[2]=L(o=>w($).onScopeImport?.(),["prevent","stop"]))},A(w($).scopeElsewhere.join(", ")),9,vl)):j("",!0),(k(!0),_(H,null,st(w($).sizes,o=>(k(),_("button",{key:o.key,type:"button","data-sve-css-size":"",title:o.title,"data-active":o.active?"":void 0,disabled:!w($).canEdit,onClick:L(s=>w($).onSize?.(o.key),["prevent","stop"])},A(o.label),9,yl))),128)),b("button",{type:"button","data-sve-css-state":"","data-active":w($).state?"":void 0,disabled:!w($).canEdit,onClick:n[3]||(n[3]=L(o=>w($).onState?.(o),["prevent","stop"]))},[Vo(A(w($).stateLabel)+" ",1),n[4]||(n[4]=b("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[b("path",{d:"m6 9 6 6 6-6"})],-1))],8,bl),n[5]||(n[5]=b("span",{class:"sve-css-gap"},null,-1)),w($).note?(k(),_("span",xl,A(w($).note),1)):j("",!0)]))}},_l=Uo(kl,[["__scopeId","data-v-22565303"]]),Sl={key:0,"data-sve-css-swatches":""},wl=["data-sve-css-token","title","data-active","onClick"],$l={key:0,"data-sve-css-head-row":""},Cl={key:1,"data-sve-css-note-row":""},Tl=["data-sve-css-token","data-active","onClick"],Al={"data-sve-css-choice-label":""},Ml={key:0,"data-sve-css-choice-hint":""},Y={__name:"CodeDockMenu",props:{kind:{type:String,required:!0},swatches:{type:Array,default:()=>[]},choices:{type:Array,default:()=>[]},onClear:{type:Function,default:null},onPick:{type:Function,required:!0}},setup(t){return(e,n)=>t.kind==="colors"?(k(),_("div",Sl,[b("button",{type:"button","data-sve-css-clear":"",title:"Clear",onClick:n[0]||(n[0]=L((...o)=>t.onClear&&t.onClear(...o),["prevent","stop"]))},[...n[1]||(n[1]=[b("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none",stroke:"currentColor","stroke-width":"1.5"},[b("path",{d:"M2 2l6 6M8 2L2 8"})],-1)])]),(k(!0),_(H,null,st(t.swatches,o=>(k(),_("button",{key:o.name,type:"button","data-sve-css-swatch":"","data-sve-css-token":o.name,title:o.name,"data-active":o.active?"":void 0,style:or({background:o.hex||"transparent"}),onClick:L(s=>t.onPick(o.name),["prevent","stop"])},null,12,wl))),128))])):(k(!0),_(H,{key:1},st(t.choices,o=>(k(),_(H,{key:o.value},[o.heading?(k(),_("span",$l,A(o.label),1)):o.note?(k(),_("span",Cl,A(o.label),1)):(k(),_("button",{key:2,type:"button","data-sve-css-choice":"","data-sve-css-token":o.token||void 0,"data-active":o.active?"":void 0,onClick:L(s=>t.onPick(o.value),["prevent","stop"])},[b("span",Al,A(o.label),1),o.hint?(k(),_("span",Ml,A(o.hint),1)):j("",!0)],8,Tl))],64))),128))}},El=2e4;let kt=[],Ts=0,zt=null,Ye=null;function As(){return Ye||(Ye=It.define()),Ye}function Ms(){return!!zt&&Date.now()-Ts<El}function Mn(t){return Ms()||(Ts=Date.now(),zt=t.fetch("/!/sve/site-css/defined",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{defined:[]}).then(e=>(kt=Array.isArray(e?.defined)?e.defined:[],g.html?.dispatch({effects:As().of(null)}),kt)).catch(()=>(zt=null,kt))),zt}function Le(t){return t.document.getElementById(u)?.querySelector("[data-sve-code-path]")?.textContent.trim()||""}function Ll(t,e){const n=Le(t),o=new Map;for(const s of kt){const a=o.get(s.name)||new Set;a.add(s.file===n?e:String(s.file).replace(/^.*\//,"")),o.set(s.name,a)}return[...o].map(([s,a])=>({name:s,detail:[...a].join(", ")})).sort((s,a)=>s.name.localeCompare(a.name))}function En(t,e){const n=Le(t);return e?kt.filter(o=>o.name===e&&o.file!==n):[]}const Es=t=>[...new Set(t.map(e=>String(e.file).replace(/^.*\//,"")))];function Ln(t,e){const n=En(t,e).map(a=>a.css).filter(Boolean).join(`
`);if(!n)return!1;const o=ot("dock:css");if(typeof o!="string")return!1;const s=li(o,e,n);return s!==o&&ot("dock:set-css",s)!==!1}function Bl(t,e){const n=t.doc.lineAt(e),o=e-n.from,s=/\bclass\s*=\s*(["'])/gi;let a;for(;a=s.exec(n.text);){const i=a[1],l=a.index+a[0].length,c=n.text.indexOf(i,l),d=c===-1?n.text.length:c;if(o<l||o>d)continue;const f=n.text.slice(l,d),h=Ce(f),p=o-l;if(!h||p<h.innerFrom||p>h.innerTo)return null;const y=(f.slice(h.innerFrom,p).match(/[\w-]*$/)||[""])[0];return{from:e-y.length,typed:y}}return null}function Fl(t){return e=>{const n=Bl(e.state,e.pos);return!n||!n.typed&&!e.explicit?null:Mn(t).then(o=>{const s=Le(t),a=n.typed.toLowerCase(),i=new Map;for(const c of o){if(c.file===s||!String(c.name).toLowerCase().startsWith(a))continue;const d=i.get(c.name)||{files:[],css:[]};d.files.push(c),c.css&&d.css.push(c.css),i.set(c.name,d)}if(!i.size)return null;const l=[...i].slice(0,40).map(([c,d])=>({label:c,type:"class",detail:Es(d.files).join(", "),info:d.css.length?()=>{const f=t.document.createElement("pre");return f.textContent=d.css.join(`
`),f.style.cssText="margin:0;padding:.3em .5em;font:11px ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap",f}:void 0,apply:(f,h,p,y)=>{f.dispatch({changes:{from:p,to:y,insert:c},selection:{anchor:p+c.length}}),t.setTimeout(()=>Ln(t,c),0)}}));return{from:n.from,options:l,validFor:/^[\w-]*$/}})}}function Il(t){const e=n=>{if(!kt.length)return lt.none;const o=Le(t),s=new vt;for(const a of Yt(n)){const i=kt.filter(l=>l.name===a.name&&l.file!==o);i.length&&s.add(a.from,a.to,lt.mark({class:"sve-cm-class-taken",attributes:{title:m(t,"class_defined_in",{file:Es(i).join(", ")})}}))}return s.finish()};return gt.define({create:n=>e(n.doc.toString()),update:(n,o)=>o.docChanged||o.effects.some(s=>s.is(As()))?e(o.state.doc.toString()):n,provide:n=>P.decorations.from(n)})}const Ol=/^\.[a-zA-Z_][\w-]*$/;function Pl(t,e,n){return String(e||"").includes(n)?ve(t).length===1:!1}function ve(t){return Et(t).filter(e=>/^@scope\b/i.test(e.prelude))}function Dl(t){const e=String(t||"");return Et(e).filter(n=>Ol.test(n.prelude)?!e.slice(n.from,n.bodyFrom-1).includes("{{"):!1).map(n=>({from:n.from,to:n.to,name:n.prelude.slice(1)}))}function zl(t,e,n){const o=String(t||"");if(!Pl(o,e,n))return o;const s=Dl(o);if(!s.length)return o;const a=ve(o)[0],i=Rl(o,a),l=s.map(p=>Wl(o.slice(p.from,p.to),o,p.from,i)).join(`

`);let c=o;for(const p of[...s].sort((y,v)=>v.from-y.from))c=Hl(c,p.from,p.to);const d=jl(c,n);if(d===-1)return o;const f=(c.slice(0,d).match(/\n([^\S\n]*)$/)||[null,null])[1],h=f===null?d:d-f.length;return`${c.slice(0,h)}
${l}
${f??""}${c.slice(d)}`}function jl(t,e){const n=ve(t).find(o=>o.prelude.includes(e));return n?n.bodyTo:ve(t)[0]?.bodyTo??-1}function Hl(t,e,n){let o=e,s=n;const a=t.lastIndexOf(`
`,o-1)+1;for(t.slice(a,o).trim()===""&&(o=a);t[s]===" "||t[s]==="	";)s+=1;return t[s]===`
`&&(s+=1),t.slice(0,o)+t.slice(s)}function Rl(t,e){const n=t.slice(e.bodyFrom,e.bodyTo).match(/\n([^\S\n]+)\S/);return n?n[1]:`${(t.slice(0,e.from).match(/\n([^\S\n]*)$/)||[null,""])[1]}    `}function Wl(t,e,n,o){const s=(e.slice(0,n).match(/\n([^\S\n]*)$/)||[null,""])[1];return t.split(`
`).map((a,i)=>i===0?o+a.trim():a.startsWith(s)?o+a.slice(s.length):o+a.trimStart()).join(`
`)}const Nl={"data-sve-css-add-label":""},ql=["placeholder","onKeydown"],Vl={key:0,"data-sve-css-add-hint":""},Ul={"data-sve-css-add-existing":""},Kl={"data-sve-css-add-list":""},Gl=["onClick"],Xl={"data-sve-css-add-name":""},Zl={"data-sve-css-add-detail":""},Yl={key:0,"data-sve-css-add-none":""},Jl=["disabled"],Bn={__name:"CodeDockAddClass",props:{label:{type:String,required:!0},placeholder:{type:String,default:""},initial:{type:String,default:""},onAdd:{type:Function,required:!0},options:{type:Array,default:()=>[]},onPick:{type:Function,default:null},takenText:{type:Function,default:null},existingLabel:{type:String,default:""},createLabel:{type:String,default:""},onClose:{type:Function,default:null}},setup(t){const e=t,n=Jn(e.initial||""),o=Jn(null);sr(()=>ar(()=>{o.value?.focus(),o.value?.select()}));const s=Ge(()=>n.value.trim().toLowerCase()),a=Ge(()=>{if(!e.options.length)return[];const c=s.value,d=[],f=[];for(const h of e.options){const p=h.name.toLowerCase();!c||p.startsWith(c)?d.push(h):p.includes(c)&&f.push(h)}return[...d,...f].slice(0,8)}),i=Ge(()=>e.takenText&&s.value?e.takenText(n.value.trim()):"");function l(){const c=n.value.trim();if(!c){o.value?.focus();return}if(i.value&&e.onPick){e.onPick(c);return}e.onAdd(c)}return(c,d)=>(k(),_(H,null,[b("label",Nl,A(t.label),1),rr(b("input",{ref_key:"input",ref:o,"data-sve-css-add-input":"","onUpdate:modelValue":d[0]||(d[0]=f=>n.value=f),type:"text",placeholder:t.placeholder,onKeydown:[Qn(L(l,["prevent"]),["enter"]),d[1]||(d[1]=Qn(L(f=>t.onClose?.(),["stop","prevent"]),["escape"]))]},null,40,ql),[[ir,n.value]]),i.value?(k(),_("div",Vl,A(i.value),1)):j("",!0),t.options.length?(k(),_(H,{key:1},[b("div",Ul,A(t.existingLabel),1),b("div",Kl,[(k(!0),_(H,null,st(a.value,f=>(k(),_("button",{key:f.name,type:"button","data-sve-css-add-option":"",onMousedown:d[2]||(d[2]=L(()=>{},["prevent"])),onClick:L(h=>t.onPick?.(f.name),["prevent","stop"])},[b("span",Xl,A(f.name),1),b("span",Zl,A(f.detail),1)],40,Gl))),128)),a.value.length?j("",!0):(k(),_("div",Yl,"—"))]),b("button",{type:"button","data-sve-css-add-create":"",disabled:!!i.value||!s.value,onMousedown:d[3]||(d[3]=L(()=>{},["prevent"])),onClick:L(l,["prevent","stop"])},A(t.createLabel),41,Jl)],64)):j("",!0)],64))}};function yo(t,e){e._sveLockBound||(e._sveLockBound=!0,e.querySelector("[data-sve-code-lock]")?.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),!(!r.lockReady||!r.lastType)){if(r.lastLocked){tc(t);return}Ls(t,!0)}}))}function Fn(t){return t?X(t,Ua)!=="0":!0}function Ql(){const t=g.html;return!t||t.state.readOnly||!r.lastType?!1:!jn(zn(),r.lastParts)}function rt(t){const e=t?.document.getElementById(u),n=e?.querySelector("[data-sve-code-autosave]"),o=e?.querySelector("[data-sve-code-save]");if(!n||!o)return;const s=Fn(t),a=Ql();n.setAttribute("aria-pressed",s?"true":"false"),n.title=m(t,s?"code_dock_autosave_on":"code_dock_autosave_off"),n.setAttribute("aria-label",n.title),n.innerHTML=tf,o.hidden=s,o.title=m(t,"code_dock_save"),o.setAttribute("aria-label",o.title),o.innerHTML=ef,a?o.setAttribute("data-dirty",""):o.removeAttribute("data-dirty")}function bo(t,e){e._sveAutosaveBound||(e._sveAutosaveBound=!0,e.querySelector("[data-sve-code-autosave]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation();const o=!Fn(t);N(t,Ua,o?"1":"0"),o?q(t.document):r.saveTimer&&(clearTimeout(r.saveTimer),r.saveTimer=null),rt(t)}),e.querySelector("[data-sve-code-save]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),q(t.document)}))}function tc(t){t.document.getElementById(K)?.remove();const e=lr(t.document,cr,{title:m(t,"code_dock_unlock_title"),body:m(t,"code_dock_unlock_body"),buttons:[{value:"cancel",label:m(t,"cancel"),variant:"ghost"},{value:"ok",label:m(t,"code_dock_unlock_confirm"),variant:"primary"}],onPick:n=>{e.dismiss(),n==="ok"&&Ls(t,!1)}});e.host.id=K}function Ls(t,e){const n=r.lastType;if(!n)return;const o=()=>{r.lastType===n&&t.fetch("/!/sve/section-template/lock",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Ko(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:n,locked:e})}).then(async s=>{if(!s.ok)throw new Error(String(s.status));r.lastType===n&&(r.lastLocked=e,Tt(t),ee(r.lastParts,e),U(t),O(t.document,e?m(t,"code_dock_locked"):""))}).catch(()=>{O(t.document,m(t,"code_dock_error"))})};if(e&&(q(t.document),r.saveInFlight)){r.saveInFlight.finally(o);return}o()}function Bs(t,e){const n=String(e||"");if(/^(header|footer)\//.test(n))return!0;const o=t?.Statamic?.$config?.get?.("sveChromeTemplates")||{};return Object.values(o).some(s=>s&&s.type===n)}function ye(t){const e=r.lastType;if(!r.lastUid||!e||String(e).startsWith("view:")||Bs(t,e)){to(t);return}const n=ur(r.lastUid,t.document);to(t,n.length?{sectionUids:n}:void 0)}function ec(t,e,n){return r.saveInFlight=t.fetch("/!/sve/section-template",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Ko(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:e,html:n.html,css:n.css,js:n.js,...typeof n.tw=="string"?{tw:n.tw}:{},...Mr(t)?{props:r.lastProps}:{}})}).then(async o=>{if(o.status===423){r.lastLocked=!0,r.lockReady=!0,Tt(t),ee(r.lastParts,!0),U(t),O(t.document,m(t,"code_dock_locked"));return}const s=await o.json().catch(()=>({}));if(!o.ok)throw new Error(s?.error==="not_writable"?"not_writable":String(o.status));if(r.lastType===e){if(r.lastParts=n,s?.tw_written===!1){r.twDirty=!0,O(t.document,m(t,"code_dock_tw_not_writable")),rt(t),ye(t);return}O(t.document,m(t,"code_dock_saved")),rt(t),t.setTimeout(()=>{const a=t.document.getElementById(u)?.querySelector("[data-sve-code-status]");a&&a.textContent===m(t,"code_dock_saved")&&(a.textContent="")},1800)}ye(t),t.document.getElementById("__sve-section-picker")?.dispatchEvent(new t.CustomEvent("sve-library-stale"))}).catch(o=>{O(t.document,m(t,o?.message==="not_writable"?"code_dock_not_writable":"code_dock_error"))}).finally(()=>{r.saveInFlight=null}),r.saveInFlight}function q(t){r.saveTimer&&(clearTimeout(r.saveTimer),r.saveTimer=null);const e=r.lastType,n=r.lastWin,o=g.html;if(!o||o.state.readOnly||!e||!n||!r.lockReady)return;const s=zn(),a=r.twCss!==null&&Qo(n)&&In(s.html)===r.twKey;jn(s,r.lastParts)&&!(a&&r.twDirty)&&!r.propsDirty||(r.propsDirty=!1,a&&(s.tw=r.twCss,r.twDirty=!1),O(t,m(n,"code_dock_saving")),ec(n,e,s))}function In(t){return Kr(t).sort().join(" ")}function nc(){r.twCss=null,r.twKey="",r.twDirty=!1}function oc(t,e){r.twCss=e,r.twKey=In(t),r.twDirty=!1}function Fs(t,e){if(!t||!Qo(t))return;const n=In(e);n===r.twKey||r.twBusy||(r.twBusy=!0,dr(()=>import("./tw-compile-C_hT6KCx.js"),__vite__mapDeps([0,1]),import.meta.url).then(o=>o.compileTailwind(t,e)).then(o=>{r.twBusy=!1,r.twCss=o,r.twKey=n,r.twDirty=!0,Is(t,t.document)}).catch(o=>{r.twBusy=!1,console.error("[sve] tailwind compile",o)}))}function Is(t,e){r.saveTimer&&clearTimeout(r.saveTimer),r.saveTimer=t.setTimeout(()=>{r.saveTimer=null,q(e)},Xu)}function J(t){if(r.applying)return;const e=zn();if(jn(e,r.lastParts)){rt(t);return}if(rt(t),Fs(t,e.html),!Fn(t)){O(t.document,m(t,"code_dock_unsaved"));return}O(t.document,m(t,"code_dock_saving")),Is(t,t.document)}function Os(t,e){let n=0;const o=Math.min(t.length,e.length);for(;n<o&&t[n]===e[n];)n+=1;let s=t.length,a=e.length;for(;s>n&&a>n&&t[s-1]===e[a-1];)s-=1,a-=1;return[n,s,e.slice(n,a)]}function Ps(t){const e=r.lastUid,n=typeof V=="function"?V(t.document):[];for(const o of n){const s=ft(o.values)||o.values;if(!(!s||typeof s!="object")&&e&&typeof eo=="function"){const a=eo(s,e);if(a){const i=a.split("."),l=fr(s,i.slice(0,2).join("."));if(l&&typeof l=="object")return l}}}for(const o of n){const s=ft(o.values)||o.values;if(s&&typeof s=="object")return s}return null}function Ds(t,e){!e||e===r.lastType||(q(t.document),Ft(t,e,"push"))}function zs(t){const e=r.typeStack.pop();if(!e){Xt(t);return}q(t.document),Ft(t,e,"keep")}function Tt(t){const e=t.document.getElementById(u),n=e?.querySelector("[data-sve-code-lock]"),o=e?.querySelector("[data-sve-code-lock-banner]");if(!e||!n)return;const s=r.lastLocked;e.toggleAttribute("data-sve-code-locked",s),s&&(ts(t.document),tt(t.document),r.htmlPartialUi&&(r.htmlPartialUi.setHover(g.html,null),r.htmlPartialUi.setHover(g.css,null)),r.htmlClassTokenUi?.setHover(g.html,null)),n.hidden=!r.lockReady,n.setAttribute("aria-pressed",r.lastLocked?"true":"false"),n.title=m(t,r.lastLocked?"code_dock_unlock":"code_dock_lock"),n.setAttribute("aria-label",n.title),n.innerHTML=r.lastLocked?Zu:Yu,o&&(o.textContent=m(t,"code_dock_locked_banner"))}function Jt(t){return t?X(t,qe)!=="0":r.htmlScopePref}function Be(t,e,n){return t!=null&&e!=null&&t>=0&&e>t&&e<=n}function et(){const t=globalThis.document?.getElementById(u);t&&(t.__sveHtmlScope=r.htmlScopeActive&&r.htmlFocus?{full:r.htmlFull,from:r.htmlFocus.from,to:r.htmlFocus.to,css:r.cssFull}:null)}function Fe(){const t=g.html?.state.doc.toString()??"";if(!r.htmlScopeActive||!r.htmlFocus){r.htmlFull=t,et();return}if(r.htmlFocus.from<0||r.htmlFocus.from>r.htmlFull.length||r.htmlFocus.to<r.htmlFocus.from){r.htmlScopeActive=!1,r.htmlFull=t,r.htmlFocus=null,et();return}r.htmlFull=r.htmlFull.slice(0,r.htmlFocus.from)+t+r.htmlFull.slice(r.htmlFocus.to),r.htmlFocus={from:r.htmlFocus.from,to:r.htmlFocus.from+t.length},et()}function Lt(){return Fe(),r.htmlScopeActive?r.htmlFull:g.html?.state.doc.toString()??r.lastParts.html??""}function Ie(){r.lastBracketNames=Yt(Lt()).map(t=>t.name)}function Bt(){r.lastCssSelectorNames=us(g.css?.state.doc.toString()??r.cssFull)}function js(t,e){return Array.isArray(t)&&Array.isArray(e)&&t.length===e.length&&t.every((n,o)=>n===e[o])}function sc(){const t=r.htmlScopeActive?On():Lt(),e=Te(t);e.length&&(r.cssFull=$n(r.cssFull,wn(r.cssFull,e),e[0].className))}function Hs(t,e){r.cssFull=di(r.cssFull,t,e),sc(),r.cssFull=ui(r.cssFull,e,t)}function ac(t){if(r.applying||r.lastLocked||r.lastBracketNames==null)return;const e=Yt(Lt()).map(n=>n.name);js(r.lastBracketNames,e)||(Hs(r.lastBracketNames,e),r.lastBracketNames=e,Qt(),Bt())}function rc(){if(r.applying||r.lastLocked||r.lastCssSelectorNames==null||r.lastBracketNames==null||r.cssPane==="empty")return;const t=g.html,e=us(g.css?.state.doc.toString()??"");if(!t||js(r.lastCssSelectorNames,e))return;const n=new Set(r.lastBracketNames),{renamed:o,removed:s}=fs(r.lastCssSelectorNames,e);let a=t.state.doc.toString();const i=a;for(const l of o){const c=at(l.to);!n.has(l.from)||!c||(a=lo(a,d=>d===l.from?c:d))}for(const l of s)!n.has(l)||e.includes(l)||(a=lo(a,c=>c===l?"":c));if(a!==i){r.applying=!0;try{Pe(a)}finally{r.applying=!1}}Ie(),r.lastCssSelectorNames=e}function ic(t,e){const n=at(e),o=g.html;if(!n||!o||o.state.readOnly||n===t.name)return;r.applying=!0;try{o.dispatch({changes:{from:t.from,to:t.to,insert:n}})}finally{r.applying=!1}const s=r.lastBracketNames==null?[]:r.lastBracketNames.slice();Ie(),Hs(s,r.lastBracketNames),Qt(),Bt(),r.lastWin&&(J(r.lastWin),B(r.lastWin))}function lc(t,e){const n=t.document,s=g.html?.coordsAtPos(e.from);S(n),tt(n);const a=n.createElement("div"),i={getBoundingClientRect:()=>({left:s?.left??12,right:s?.right??12,top:s?.top??12,bottom:s?.bottom??12,width:0,height:0})};a.id=x,n.body.appendChild(a),D(t,i,a),a._sveApp=z(Bn,a,{label:m(t,"code_dock_css_rename_class"),placeholder:m(t,"code_dock_css_class_placeholder"),initial:e.name,onAdd:l=>{ic(e,l),S(n)}})}function Rs(){return r.htmlScopePref&&Be(r.htmlFocus?.from,r.htmlFocus?.to,r.htmlFull.length)?(r.htmlScopeActive=!0,et(),r.htmlFull.slice(r.htmlFocus.from,r.htmlFocus.to)):(r.htmlScopeActive=!1,et(),r.htmlFull)}function Oe(t,e,n){const o=g[t];if(!o)return;const s=o.state.doc.toString();r.applying=!0;try{if(s!==e){const[a,i,l]=Os(s,e);o.dispatch({changes:{from:a,to:i,insert:l},...n?{selection:n,scrollIntoView:!0}:{}})}else n&&o.dispatch({selection:n,scrollIntoView:!0})}finally{r.applying=!1}}function Pe(t,e){Oe("html",t,e)}function On(){return r.htmlScopeActive?g.html?.state.doc.toString()??"":Be(r.htmlFocus?.from,r.htmlFocus?.to,r.htmlFull.length)?r.htmlFull.slice(r.htmlFocus.from,r.htmlFocus.to):""}function ct(){const t=g.css?.state.doc.toString()??"";if(r.cssPane==="tree"){if(t===r.cssScopeSnapshot)return;const e=Te(On())[0]?.className||ms(t);r.cssFull=$n(r.cssFull,t,e),r.cssScopeSnapshot=t}else r.cssPane==="full"&&(r.cssFull=t)}function Ws(t,e){for(const n of e||[])if(!R(t,n.className)||Ws(t,n.children))return!0;return!1}function Qt(){let t=r.cssFull,e=[],n=!1;r.cssValues||!r.htmlScopePref||!r.htmlScopeActive?(r.cssPane="full",t=r.cssFull):(e=Te(On()),e.length?(r.cssPane="tree",t=wn(r.cssFull,e),Ws(r.cssFull,e)&&(r.cssFull=$n(r.cssFull,t,e[0].className),n=!0)):(r.cssPane="empty",t="")),r.cssScopeSnapshot=t,Oe("css",t),Bt(),r.lastWin&&(oe(r.lastWin,!0),B(r.lastWin),n&&J(r.lastWin))}function Pn(t){const e=g.html;if(!e||!r.htmlFocus)return;r.htmlScopeActive||(r.htmlFull=e.state.doc.toString());const n=r.htmlFull.length,o=Math.max(0,Math.min(r.htmlFocus.from,n)),s=Math.max(o,Math.min(r.htmlFocus.to,n));if(s<=o)return;r.htmlFocus={from:o,to:s},r.htmlScopeActive=!0,et();const a=t==null?0:Math.max(0,Math.min(t-o,s-o));Pe(r.htmlFull.slice(o,s),{anchor:a,head:a}),Qt(),e.focus()}function Dn(t=!0,e=null){const n=g.html;if(!n)return;ct(),Fe(),r.htmlScopeActive=!1,et();const o=r.htmlFull||n.state.doc.toString(),s=e!=null?{anchor:Math.max(0,Math.min(e,o.length))}:t&&Be(r.htmlFocus?.from,r.htmlFocus?.to,o.length)?{anchor:r.htmlFocus.from,head:r.htmlFocus.to}:null;r.htmlFull=o,Pe(o,s),r.cssPane="full",r.cssScopeSnapshot=r.cssFull,Oe("css",r.cssFull),Bt()}function De(){r.htmlFocus=null,r.htmlScopeActive=!1,r.htmlFull="",r.cssFull="",r.cssPane="full",r.cssScopeSnapshot="",r.lastBracketNames=null,r.lastCssSelectorNames=null,et()}let qt=!1;function Ct(t){return!!t?.document.getElementById(No)}function on(t,e){if(!(!t||vn(t,"html_tree")===!1)){if(!e){Ct(t)&&Go(t);return}Ct(t)||(qt=!0,hr("html_tree").then(()=>{Ct(t)||pr(t)}).catch(()=>{}).finally(()=>{qt=!1,U(t)}))}}function U(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-html-scope]");if(!e)return;r.htmlScopePref=Jt(t);const n=vn(t,"html_tree")===!1?r.htmlScopePref:Ct(t)||qt;e.setAttribute("aria-pressed",n?"true":"false"),e.title=m(t,n?"code_dock_html_scope_off":"code_dock_html_scope"),e.setAttribute("aria-label",e.title),e.innerHTML=Xa,t.document.getElementById(u)?.toggleAttribute("data-sve-html-scoped",r.htmlScopeActive),et()}function xo(t,e){e._sveHtmlScopeBound||(e._sveHtmlScopeBound=!0,r.htmlScopePref=Jt(t),cc(t,e),on(t,r.htmlScopePref),e.querySelector("[data-sve-html-scope]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation();const o=Ct(t)||qt;r.htmlScopePref=!o,N(t,qe,r.htmlScopePref?"1":"0"),r.htmlScopePref?r.htmlFocus&&(ct(),Pn()):r.htmlScopeActive&&Dn(),on(t,r.htmlScopePref),U(t)}))}function cc(t,e){e._sveTreeWatchBound||(e._sveTreeWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>{if(qt||vn(t,"html_tree")===!1||!t.document.getElementById(u))return;const n=Ct(t);n!==Jt(t)&&(r.htmlScopePref=n,N(t,qe,n?"1":"0"),n?r.htmlFocus&&(ct(),Pn()):r.htmlScopeActive&&Dn(),U(t))}))}const dc=new Set(["pre","textarea","script","style"]),uc=/^(<\/|\{\{\s*\/)/;function fc(t){let e=0;for(const n of t.split(`
`)){if(!n.trim())continue;const o=n.length-n.trimStart().length;o>0&&(e===0||o<e)&&(e=o)}return" ".repeat(e===2||e===3?e:4)}function hc(t){const e=String(t||"");if(!e.trim())return e;const n=[],o=l=>{for(const c of l||[])n.push(c),o(c.children)};o(Er(e));const s=fc(e),a=[];let i=0;for(const l of e.split(`
`)){const c=i,d=l.trim();i+=l.length+1;const f=c+(l.length-l.trimStart().length),h=n.filter(y=>y.from<f&&f<y.to);if(h.some(y=>dc.has(y.tag))){a.push(l);continue}if(!d)continue;const p=h.length-(uc.test(d)?1:0);a.push(s.repeat(Math.max(p,0))+d)}return a.join(`
`)+(e.endsWith(`
`)?`
`:"")}function sn(t,e){let n=0;for(;n<e;){const o=pc(t,n);if(o===null){n+=1;continue}if(o===-1)return e;if(o>e)return o;n=o}return e}function pc(t,e){if(t.startsWith("{{",e)){const n=t.indexOf("}}",e+2);return n===-1?-1:n+2}if(t.startsWith("<!--",e)){const n=t.indexOf("-->",e+4);return n===-1?-1:n+3}return t[e]==="<"&&/[A-Za-z/!?]/.test(t[e+1]||"")?mc(t,e):null}function mc(t,e){let n="",o=e+1;for(;o<t.length;){const s=t[o];if(n){s===n&&(n=""),o+=1;continue}if(t.startsWith("{{",o)){const a=t.indexOf("}}",o+2);if(a===-1)return-1;o=a+2;continue}if(s==='"'||s==="'"){n=s,o+=1;continue}if(s===">")return o+1;if(s==="<")return-1;o+=1}return-1}function Ns(t,e){if(t.startsWith("{{",e)){const n=t.indexOf("}}",e+2);return n===-1?t.length:n+2}if(t.startsWith("<!--",e)){const n=t.indexOf("-->",e+4);return n===-1?t.length:n+3}return e}function an(t,e){if(t[e]!=="<")return null;const n=t.indexOf(">",e+1);if(n===-1)return null;const o=t.slice(e,n+1),s=o.match(/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/);if(s)return{kind:"close",name:s[1].toLowerCase(),from:e,to:n+1};const a=o.match(/^<([A-Za-z][A-Za-z0-9:-]*)/);if(!a)return{kind:"other",from:e,to:n+1};const i=a[1].toLowerCase();return{kind:/\/\s*>$/.test(o)||["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"].includes(i)?"void":"open",name:i,from:e,to:n+1}}function ko(t,e,n){let o=1,s=n;for(;s<t.length;){const a=Ns(t,s);if(a!==s){s=a;continue}if(t[s]!=="<"){s+=1;continue}const i=an(t,s);if(!i)break;if(i.kind==="open"&&i.name===e)o+=1;else if(i.kind==="close"&&i.name===e&&(o-=1,o===0))return i;s=i.to}return null}function te(){const t=g.html;if(!t)return null;const e=t.state.selection.main.head,n=t.state.doc.toString(),o=[];let s=0;for(;s<e;){const c=Ns(n,s);if(c!==s){s=c;continue}if(n[s]!=="<"){s+=1;continue}const d=an(n,s);if(!d||d.from>=e)break;if(d.kind==="open")o.push(d);else if(d.kind==="close"){for(let f=o.length-1;f>=0;f-=1)if(o[f].name===d.name){o.splice(f);break}}s=d.to}const a=n.lastIndexOf("<",Math.max(0,e-1));if(a!==-1&&n.indexOf(">",a)>=e){const c=an(n,a);if(c?.kind==="open"||c?.kind==="void"){const d=c.kind==="void"?null:ko(n,c.name,c.to);return d?{name:c.name,open:c,close:d}:{name:c.name,open:c,close:null}}}const i=o[o.length-1];if(!i)return null;const l=ko(n,i.name,i.to);return{name:i.name,open:i,close:l}}function rn(t){return Za.includes(t)}function I(){g.html?.focus(),r.lastWin&&(J(r.lastWin),ze(r.lastWin))}function bt(t,e,n){const o=[...e].sort((s,a)=>a.from-s.from||a.to-s.to);t.dispatch({changes:o,selection:n})}function Vt(t,e,n){const o=g.html;if(!o||o.state.readOnly)return;const s=o.state.selection.main.head,a=o.state.doc.lineAt(s),i=a.text.slice(0,s-a.from),l=a.text.trim()?it(a.text):He(o,a)||it(a.text);let c=t,d=0;if(i.trim()!=="")c=`
${l}${t}`,d=1+l.length;else if(!a.text.trim()){c=`${l}${t}`,d=l.length,o.dispatch({changes:{from:a.from,to:a.to,insert:c},selection:_o(a.from+d+e,n)});return}o.dispatch({changes:{from:s,to:o.state.selection.main.to,insert:c},selection:_o(s+d+e,n)})}function _o(t,e){return e?{anchor:t,head:t+e}:{anchor:t}}function qs(t){const{from:e}=t.state.selection.main,n=sn(t.state.doc.toString(),e);return n!==e&&t.dispatch({selection:{anchor:n}}),n}function Vs(t,e,n){const o=g.html;!o||o.state.readOnly||(qs(o),Vt(t,e,n))}const gc=new Set(["section","article","header","footer","main","nav","aside"]);function So(t){if(t==="a")return'<a href="">';if(t!=="section")return`<${t}>`;const e=r.lastWin?.Statamic?.$config?.get?.("sveSectionTag");return typeof e=="string"&&e.trim()?`<${t} ${e.trim()}>`:`<${t}>`}function Us(){const t=g.html;if(!t||t.state.readOnly)return;const e=t.state.doc.toString(),n=(e.match(/^[ \t]*/)||[""])[0],o=hc(e).split(`
`).map(s=>s&&n+s).join(`
`);o!==e&&(bt(t,[{from:0,to:e.length,insert:o}],{anchor:0}),I())}function Ks(t){const e=g.html;if(!e||e.state.readOnly)return;const n=e.state.selection.main,o=e.state.doc.toString();if(!n.empty&&sn(o,n.from)===n.from&&sn(o,n.to)===n.to){const c=o.slice(n.from,n.to),d=c.match(new RegExp(`^<${t}(\\s[^>]*)?>([\\s\\S]*)</${t}>$`,"i"));if(d){bt(e,[{from:n.from,to:n.to,insert:d[2]}],{anchor:n.from,head:n.from+d[2].length}),I();return}const f=So(t);let h=`${f}${c}</${t}>`,p=n.from+f.length;t==="ul"&&(h=`<ul>
  <li>${c}</li>
</ul>`,p=n.from+11),bt(e,[{from:n.from,to:n.to,insert:h}],{anchor:p,head:p+c.length}),I();return}const a=te();if(a?.open&&a.close){if(a.name===t){bt(e,[{from:a.close.from,to:a.close.to,insert:""},{from:a.open.from,to:a.open.to,insert:""}],{anchor:a.open.from}),I();return}if(rn(a.name)&&rn(t)){const c=o.slice(a.open.from,a.open.to).replace(new RegExp(`^<${a.name}`,"i"),`<${t}`);bt(e,[{from:a.close.from,to:a.close.to,insert:`</${t}>`},{from:a.open.from,to:a.open.to,insert:c}],{anchor:a.open.from+t.length+1}),I();return}}qs(e);const l=(e.state.doc.lineAt(e.state.selection.main.head).text.match(/^\s*/)||[""])[0];if(t==="ul"){const c=`<ul>
${l}  <li></li>
${l}</ul>`;Vt(c,`<ul>
${l}  <li>`.length)}else{const c=So(t),d=`${c}</${t}>`,f=t==="a"?c.indexOf('""')+1:gc.has(t)?c.length:d.length;Vt(d,f)}I()}function ze(t){try{vc(t)}catch{}}function vc(t){const e=t?.document?.getElementById(u),o=te()?.name||"";if(e)for(const s of mn){const a=e.querySelector(`[data-sve-html-tool="${s.id}"]`);if(!a)continue;(s.id==="heading"?rn(o):o===s.tag)?a.setAttribute("data-active",""):a.removeAttribute("data-active")}}function wo(t,e,n){const o=t.document,s=te()?.name||"";S(o),e.setAttribute("data-open","");const a=o.createElement("div");a.id=x,o.body.appendChild(a),D(t,e,a),a._sveApp=z(Y,a,{kind:"choices",choices:n.map(i=>({value:i,label:i.toUpperCase(),active:s===i})),onPick:i=>{Ks(i),S(o)}})}function yc(t,e){const n=t.document;S(n),e.setAttribute("data-open","");const o=n.createElement("div");o.id=x,n.body.appendChild(o),D(t,e,o);const s=a=>{n.getElementById(x)&&(o._sveApp?.unmount(),o._sveApp=z(Y,o,{kind:"choices",choices:a,onPick:i=>{i&&(Vs(i,i.length),I()),S(n)}}),D(t,e,o))};s([{value:"",label:m(t,"code_dock_loading")}]),t.fetch("/!/sve/components",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(a=>a.ok?a.json():{items:[]}).then(a=>{const i=Array.isArray(a.items)?a.items:[];s(i.length?i.map(l=>({value:l.tag,label:l.name})):[{value:"",label:m(t,"component_none")}])}).catch(()=>s([{value:"",label:m(t,"component_none")}]))}function $o(t){const e=at(t),n=g.html,o=g.css;if(!e||n?.state.readOnly||o?.state.readOnly)return;const s=te();if(s?.open&&n){const a=n.state.doc.sliceString(s.open.from,s.open.to),i=ti(a,e);i!==a&&n.dispatch({changes:{from:s.open.from,to:s.open.to,insert:i}})}ct(),R(r.cssFull,e)||(r.cssFull=`${String(r.cssFull||"").trimEnd()}${r.cssFull?.trim()?`
`:""}.${e} {
}
`),Qt(),Ie(),Bt(),r.lastWin&&(J(r.lastWin),ze(r.lastWin),B(r.lastWin))}function bc(t,e){const n=t.document;if(e.hasAttribute("data-open")){S(n);return}S(n),e.setAttribute("data-open","");const o=n.createElement("div");o.id=x,n.body.appendChild(o),D(t,e,o);const s=l=>{const c=at(l);if(!c)return"";if(R(r.cssFull,c))return m(t,"class_exists_here");const d=[...new Set(En(t,c).map(f=>String(f.file).replace(/^.*\//,"")))];return d.length?m(t,"class_exists_pick",{file:d.join(", ")}):""},a=l=>{$o(l),Ln(t,at(l)),S(n)},i=()=>{if(!n.getElementById(x))return;const l=o.querySelector("[data-sve-css-add-input]")?.value||"";o._sveApp?.unmount(),o._sveApp=z(Bn,o,{label:m(t,"code_dock_css_class_name"),placeholder:m(t,"code_dock_css_class_placeholder"),initial:l,options:Ll(t,m(t,"class_this_file")),existingLabel:m(t,"code_dock_css_class_existing"),createLabel:m(t,"code_dock_css_class_create"),takenText:s,onPick:a,onClose:()=>S(n),onAdd:c=>{$o(c),S(n)}}),D(t,e,o)};i(),Mn(t).then(i)}function xc(t,e){const n=e.querySelector("[data-sve-css-add-class]");!n||n._sveBound||(n._sveBound=!0,n.innerHTML=nf,n.title=m(t,"code_dock_css_add_class"),n.setAttribute("aria-label",n.title),n.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),r.styleMode==="tw"){S(t.document),Lr(t,n);return}bc(t,n)}))}function zn(){const t={html:"",css:"",js:""};Fe(),ct();for(const e of nt)e==="html"?t.html=r.htmlScopeActive?r.htmlFull:g.html?.state.doc.toString()??"":e==="css"?(t.css=r.lastWin?fl(r.cssFull,pt(r.lastWin)):r.cssFull,t.css=zl(t.css,t.html,Uu)):t[e]=g[e]?.state.doc.toString()??"";return t}function Gs(){if(r.cssValues||!(r.htmlScopePref&&Be(r.htmlFocus?.from,r.htmlFocus?.to,r.htmlFull.length)))return r.cssPane="full",r.cssScopeSnapshot=r.cssFull,r.cssFull;const t=Te(r.htmlFull.slice(r.htmlFocus.from,r.htmlFocus.to));if(!t.length)return r.cssPane="empty",r.cssScopeSnapshot="","";r.cssPane="tree";const e=wn(r.cssFull,t);return r.cssScopeSnapshot=e,e}function ee(t,e){r.applying=!0;try{r.lastWin&&(r.htmlScopePref=Jt(r.lastWin)),r.htmlFull=t.html??"",r.cssFull=t.css??"";for(const n of nt){const o=g[n];let s=t[n]??"";try{s=n==="html"?Rs():n==="css"?Gs():s}catch{s=n==="html"?r.htmlFull||t.html||"":n==="css"?r.cssFull||t.css||"":s}if(!o)continue;const a=o.state.doc.toString(),i=[Rt[n].reconfigure(ke.readOnly.of(!!e)),Wt[n].reconfigure(P.editable.of(!e))];a!==s?o.dispatch({changes:{from:0,to:a.length,insert:s},effects:i}):o.dispatch({effects:i})}}finally{r.applying=!1}Ie(),Bt(),yn("dock:html-changed"),r.lastWin&&(B(r.lastWin),ze(r.lastWin),U(r.lastWin),se(r.lastWin))}function jn(t,e){return t.html===e.html&&t.css===e.css&&t.js===e.js}function Xs(t){return String(t||"").replace(/\/\*[\s\S]*?\*\//g,"").trim().replace(/\s*:\s*/g,": ").replace(/\s*;\s*/g,";").replace(/\s+/g," ").replace(/;+$/,";")}function Zs(t){const e=Xs(t).match(/^([a-z-]+)\s*:/i);return e?e[1].toLowerCase():""}function Ys(t){const e=Xs(t),n=e.indexOf(":");return n===-1?"":e.slice(n+1).replace(/;$/,"").trim().toLowerCase()}function F(t){const e=String(t||"").trim().toLowerCase();return e==="start"||e==="flex-start"||e==="left"||e==="top"?"flex-start":e==="end"||e==="flex-end"||e==="right"||e==="bottom"?"flex-end":e==="row-reverse"?"row-reverse":e==="column-reverse"?"column-reverse":e}function Ut(t){const e=F(t);return e==="flex"||e==="inline-flex"}function je(){const t=g.css;if(!t)return null;const e=t.state.selection.main.head,n=t.state.doc.toString(),o=[],s=[];for(let i=0;i<n.length;i+=1){if(n[i]==="{"&&n[i+1]==="{"){const l=n.indexOf("}}",i+2);if(l===-1)break;i=l+1;continue}if(n[i]==="{")o.push(i);else if(n[i]==="}"){const l=o.pop();l!=null&&s.push({from:l+1,to:i,text:n.slice(l+1,i),open:l})}}let a=null;for(const i of s)e<i.open||e>i.to||(!a||i.to-i.open<a.to-a.open)&&(a=i);return a}function kc(t){const e=String(t||"");let n="",o=0;for(let s=0;s<e.length;s+=1){if(e[s]==="{"&&e[s+1]==="{"){const a=e.indexOf("}}",s+2);if(a===-1)break;o===0&&(n+=e.slice(s,a+2)),s=a+1;continue}if(e[s]==="{"){o+=1;continue}if(e[s]==="}"){o=Math.max(0,o-1);continue}o===0&&(n+=e[s])}return n}function Co(t){const e={};for(const n of kc(t).split(";")){const o=Zs(n);o&&(e[o]=Ys(`${n};`))}return e}function _c(t,e,n){if(!e||e.from>=e.to)return null;let o=t.state.doc.lineAt(e.from),s=0;for(;o.from<=e.to;){const a=Math.max(o.from,e.from),i=Math.min(o.to,e.to),l=t.state.doc.sliceString(a,i);if(s===0&&Zs(l)===n)return{from:a,to:i,text:l};if(s+=Sc(l),o.to>=t.state.doc.length||o.to>=e.to)break;o=t.state.doc.lineAt(o.to+1)}return null}function Sc(t){let e=0;const n=String(t);for(let o=0;o<n.length;o+=1){if(n[o]==="{"&&n[o+1]==="{"){const s=n.indexOf("}}",o+2);o=s===-1?n.length:s+1;continue}n[o]==="{"?e+=1:n[o]==="}"&&(e-=1)}return e}function it(t){return(String(t).match(/^\s*/)||[""])[0]}function He(t,e,n){for(let o=e.number-1;o>=1;o-=1){const s=t.state.doc.line(o),a=s.text.trim();if(!a)continue;const i=it(s.text);if(n&&(a==="{"||a.endsWith("{")))return`${i}  `;if(!(a==="}"||a.startsWith("}")))return i}return""}function wc(t,e){const n=t.state.doc.lineAt(e);if(n.text.trim())return it(n.text);const o=He(t,n,!0);if(o)return o;const s=je();return s?Js(t,s):"  "}function Js(t,e){const n=t.state.doc.lineAt(e.from),o=t.state.doc.lineAt(Math.max(e.from,e.to));for(let a=o.number;a>=n.number;a-=1){const i=t.state.doc.line(a),l=Math.max(i.from,e.from),c=Math.min(i.to,e.to),d=t.state.doc.sliceString(l,c);if(d.trim())return(d.match(/^\s*/)||[""])[0]||"  "}return`${(t.state.doc.lineAt(Math.max(0,e.from-1)).text.match(/^\s*/)||[""])[0]}  `}function To(){g.css?.focus(),r.lastWin&&(J(r.lastWin),B(r.lastWin))}function Qs(t,e){if(!e)return"";const n=t.state.doc.toString();let o=0;for(let s=e.open-1;s>=0;s-=1)if(n[s]==="}"||n[s]==="{"||n[s]===";"){o=s+1;break}return n.slice(o,e.open).replace(/\/\*[\s\S]*?\*\//g,"").trim()}function $c(t,e){if(!r.cssState||!e)return e;const n=ta(t,e);if(n)return n;const o=Qs(t,e);if(!o||o.startsWith("@"))return e;const s=t.state.doc.toString(),a=xt(s,e.open),i=xt(s,e.to)||`${a}    `,l=(t.state.doc.sliceString(e.from,e.to).match(/\n([^\S\n]*)$/)||[null,null])[1],c=l===null?e.to:e.to-l.length,d=`
${i}&${We()} {
${i}}
${l??a}`;t.dispatch({changes:{from:c,to:e.to,insert:d}});const f=t.state.doc.toString(),h=f.indexOf("{",c+d.indexOf("&")),p=h===-1?-1:Mt(f,h);return p===-1?e:{from:h+1,to:p,text:f.slice(h+1,p),open:h}}function xt(t,e){const n=t.lastIndexOf(`
`,e-1)+1;return(t.slice(n,e).match(/^\s*/)||[""])[0]}function G(t){const e=g.css;if(!e||e.state.readOnly||!t.length)return;const n=je(),o=t.some(l=>l.value!=null)?$c(e,n):n;if(!o){const l=t.filter(c=>c.value!=null).map(c=>`${c.property}: ${c.value};`).join(`
`);l&&Ac(l),To();return}const s=[],a=[],i=Js(e,o);for(const l of t){const c=_c(e,o,l.property);if(l.value==null){if(!c)continue;let d=c.from,f=c.to;e.state.doc.sliceString(f,f+1)===`
`&&(f+=1),d=Math.max(d,o.from),f=Math.min(f,o.to),s.push({from:d,to:f});continue}if(!(c&&F(Ys(c.text))===F(l.value)))if(c){const d=(c.text.match(/^\s*/)||[""])[0];s.push({from:c.from,to:c.to,insert:`${d}${l.property}: ${l.value};`})}else a.push(`${i}${l.property}: ${l.value};`)}if(a.length){const l=!o.text.includes(`
`)||!/\n\s*$/.test(o.text)?`
`:"",c=(o.text.match(/\n([^\S\n]*)$/)||[null,null])[1],d=c===null?o.to:o.to-c.length,f=c===null?"":c;s.push({from:d,to:o.to,insert:`${l}${a.join(`
`)}
${f}`})}s.length&&(s.sort((l,c)=>c.from-l.from||c.to-l.to),e.dispatch({changes:s})),To()}function Z(){const t=g.css,e=je();if(!e)return{};if(r.cssState&&t){const n=ta(t,e);return n?Co(n.text):{}}return Co(e.text)}function ta(t,e){const n=Qs(t,e),o=We();if(!n||n.startsWith("@"))return null;if(n.endsWith(o))return e;const s=t.state.doc.toString(),a=i=>{const l=Mt(s,i);return l===-1?null:{from:i+1,to:l,text:s.slice(i+1,l),open:i}};for(const i of[`&${o}`,`${n}${o}`]){const l=new RegExp(`(^|[^\\w-])${i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\s*\\{`,"g");let c;for(;c=l.exec(s);){const d=s.indexOf("{",c.index);if(i.startsWith("&")&&(d<e.from||d>e.to))continue;const f=a(d);if(f)return f}}return null}function Cc(t){const e=Z(),n=Ut(e.display),o=F(e["flex-direction"])||(n?"row":"");if(n&&o===t){const s=[];e["flex-direction"]&&s.push({property:"flex-direction",value:null}),Ut(e.display)&&s.push({property:"display",value:null}),G(s);return}G([{property:"display",value:"flex"},{property:"flex-direction",value:t}])}function Tc(t){const e=Z();if(t==="flex"&&Ut(e.display)){G([{property:"justify-content",value:null},{property:"align-items",value:null},{property:"flex-direction",value:null},{property:"display",value:null}]);return}G([{property:"display",value:t}])}function Ac(t){const e=g.css;if(!e||e.state.readOnly)return;const n=e.state.selection.main.head,o=e.state.doc.lineAt(n),s=o.text.slice(0,n-o.from),a=o.text.slice(n-o.from),i=wc(e,n),l=t.replace(/;?$/,";");if(s.trim()===""&&a.trim()===""){const d=`${i}${l}
${i}`;e.dispatch({changes:{from:o.from,to:o.to,insert:d},selection:{anchor:o.from+d.length}});return}const c=`
${i}${l}
${i}`;e.dispatch({changes:{from:n,to:e.state.selection.main.to,insert:c},selection:{anchor:n+c.length}})}function B(t){try{Mc(t),_t(t)}catch{}}function Mc(t){const e=r.styleMode==="tw",n=e?{}:Z(),o=Ut(e?so("display"):n.display),s=F(n["flex-direction"])||(o?"row":""),a=i=>e?Ir()&&!!i.tw&&!!so(i.tw):!!i.css&&i.css in n;dt.tools=Ja.map(i=>{const l=(i.kids||[]).filter(c=>c.when!=="flex"||o).map(c=>({id:c.id,title:c.title,icon:Wo[c.icon]||"",sep:!!c.sep,open:r.cssOpenMenu===c.id,active:e?a(c):c.kind==="display"?o:c.kind==="flexDir"?o&&s===c.value:c.value?F(n[c.css])===F(c.value):a(c)}));return{id:i.id,title:i.title,icon:Wo[i.id]||sf[i.id]||"",open:r.cssOpenTool===i.id||r.cssOpenMenu===i.id,kids:l,active:i.value?!e&&F(n[i.css])===F(i.value):a(i)||l.some(c=>c.active)}})}function S(t){const e=t?.getElementById(x);r.cssOpenMenu="",e?._sveApp?.unmount(),e?.remove(),t?.querySelectorAll("[data-sve-css-tool][data-open], [data-sve-html-tool][data-open], [data-sve-css-add-class][data-open], [data-sve-code-history][data-open]").forEach(n=>n.removeAttribute("data-open"))}function Ff(t){S(t),W(t),tt(t);for(const e of nt)g[e]&&Oa?.(g[e])}function ea(t){if(r.cssColorsPromise)return r.cssColorsPromise;const e=t.Statamic?.$config?.get?.("cpUrl")||`/${t.Statamic?.$config?.get?.("cpRoute")||"cp"}`;return r.cssColorsPromise=t.fetch(`${e}/color-scheme/swatches`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async n=>{if(!n.ok)return[];const o=await n.json().catch(()=>[]);return Array.isArray(o)?o:[]}).catch(()=>[]).then(n=>{const o=new Set,s=[];for(const a of n){const i=a.var||a.value||a.handle,l=String(i||"").trim().replace(/^var\((.+)\)$/,"$1");!l||o.has(l)||(o.add(l),s.push({name:l,hex:a.hex||a.color||""}))}for(const[a,i]of Ya)o.has(a)||(o.add(a),s.push({name:a,hex:i}));return s}),r.cssColorsPromise}function na(t,e){const n=Z()[e]||"",o=String(n).match(/^var\(\s*([^)]+?)\s*\)$/i),s=o?o[1].trim():"";for(const a of t.querySelectorAll("[data-sve-css-token]"))s&&a.getAttribute("data-sve-css-token")===s?a.setAttribute("data-active",""):a.removeAttribute("data-active")}function D(t,e,n){const o=e.getBoundingClientRect(),s=8,a=t.innerHeight-(o.bottom+4)-s,i=o.top-4-s;n.style.maxHeight="";const l=n.offsetHeight||0,c=l>a&&i>a;n.style.left=`${Math.max(s,Math.min(o.left,t.innerWidth-220))}px`,n.style.maxHeight=`${Math.max(120,c?i:a)}px`,n.style.top=c?`${Math.max(s,o.top-4-Math.min(l,i))}px`:`${Math.max(s,o.bottom+4)}px`}function Ec(t,e,n){const o=t.document;S(o),e.setAttribute("data-open","");const s=o.createElement("div");s.id=x,o.body.appendChild(s),D(t,e,s);const a=i=>{s._sveApp?.unmount(),s._sveApp=z(Y,s,{kind:"colors",swatches:i,onClear:()=>{G([{property:n,value:null}]),S(o)},onPick:l=>{G([{property:n,value:`var(${l})`}]),S(o)}}),na(s,n)};a(Ya.map(([i,l])=>({name:i,hex:l}))),ea(t).then(i=>{o.getElementById(x)&&a(i.map(l=>({name:l.name,hex:l.hex})))})}function Lc(t,e,n,o){const s=t.document;S(s),e.setAttribute("data-open","");const a=s.createElement("div"),i=Z()[n]||"";a.id=x,s.body.appendChild(a),D(t,e,a),a._sveApp=z(Y,a,{kind:"choices",choices:(o||[]).map(l=>({value:l,label:l,active:F(l)===F(i)})),onPick:l=>{const c=F(l)===F(Z()[n]||"");G([{property:n,value:c?null:l}]),S(s)}})}function Ao(t,e,n,o=[]){const s=t.document;S(s),e.setAttribute("data-open",""),Br(t);const a=s.createElement("div");a.id=x,s.body.appendChild(a),D(t,e,a);const i=()=>{const l=[...o.map(d=>({value:d,label:d})),...Fr(t,n).map(d=>({value:d.value,label:d.value}))],c=Z()[n]||"";a._sveApp?.unmount(),a._sveApp=z(Y,a,{kind:"choices",choices:l.map(d=>({...d,active:F(d.value)===F(c)})),onPick:d=>{G([{property:n,value:d||null}]),S(s)}})};i(),ea(t).then(()=>{s.getElementById(x)===a&&i()})}function Bc(t,e,n){const o=t.document;S(o),e.setAttribute("data-open","");const s=o.createElement("div");s.id=x,o.body.appendChild(s),D(t,e,s),s._sveApp=z(Y,s,{kind:"choices",choices:of.map(a=>({value:a,token:a,label:a})),onPick:a=>{G([{property:n,value:`var(${a})`}]),S(o)}}),na(s,n)}const Mo=/\{\{#[\s\S]*?#\}\}|\{\{[\s\S]*?\}\}/g,Eo=/<!--[\s\S]*?-->/g,Lo=/<(\/?)([A-Za-z][A-Za-z0-9-]*)/g,oa=/^\{\{\s*(?:\/|endif\b|endunless\b)/,Fc=/^\{\{\s*(?:\/\s*(?:if|unless)\b|endif\b|endunless\b)/,Ic=/^\{\{\s*\/\s*partial\b/;function Je(t,e,n){return t.some(o=>e<o.to&&n>o.from)}function Oc(t){const e=new Map;for(const n of Or(t)){const o=n.kind==="loop"?"loop":"if";e.set(n.from,o);const s=t.lastIndexOf("{{",n.to-2);s>=n.openTo&&oa.test(t.slice(s,n.to))&&e.set(s,o)}for(const n of Jo(t))e.set(n.from,"component");return e}function Pc(t){const e=String(t||""),n=[],o=[];Eo.lastIndex=0;let s;for(;s=Eo.exec(e);)n.push({from:s.index,to:s.index+s[0].length});const a=Oc(e),i=[];for(Mo.lastIndex=0;s=Mo.exec(e);){const l=s.index,c=l+s[0].length,d=s[0];if(Je(n,l,c))continue;if(i.push({from:l,to:c}),d.startsWith("{{#")){o.push({from:l,to:c,cls:"comment"});continue}const f=oa.test(d),h=a.get(l)||(f&&Fc.test(d)?"if":"")||(f&&Ic.test(d)?"component":"");o.push({from:l,to:c,cls:(h?`fam-${h}`:"antlers")+(f?"-close":"")})}for(Lo.lastIndex=0;s=Lo.exec(e);){const l=s.index+1+s[1].length,c=l+s[2].length;Je(n,l,c)||Je(i,l,c)||o.push({from:l,to:c,cls:`fam-${mr(s[2])}`})}return o.sort((l,c)=>l.from-c.from),o}function Bo(t,e,n){const o=new e.RangeSetBuilder;let s=0;for(const a of Pc(t.doc.toString()))a.from<s||(o.add(a.from,a.to,n(a.cls)),s=a.to);return o.finish()}function Dc(t){const e=new Map,n=a=>a==="comment"?"sve-cm-antlers-comment":a==="antlers"?"sve-cm-antlers":a==="antlers-close"?"sve-cm-antlers sve-cm-antlers-close":a.endsWith("-close")?`sve-cm-${a.slice(0,-6)} sve-cm-antlers-close`:`sve-cm-${a}`,o=a=>(e.has(a)||e.set(a,t.Decoration.mark({class:n(a)})),e.get(a));return{extensions:[t.StateField.define({create(a){return Bo(a,t,o)},update(a,i){return i.docChanged?Bo(i.state,t,o):a},provide:a=>t.EditorView.decorations.from(a)})]}}const M=gn({tag:"",emptyText:"",addLabel:"",dropTitle:"",chips:[],states:[],canEdit:!1,onAdd:null,onChip:null,onDrop:null}),zc={class:"sve-al"},jc={class:"sve-al-head"},Hc={key:0,class:"sve-al-tag"},Rc=["title","disabled"],Wc={key:0,class:"sve-al-empty"},Nc={class:"sve-al-chips"},qc=["data-sve-al-chip","title","disabled","onClick"],Vc={class:"sve-al-name"},Uc={key:0,class:"sve-al-value"},Kc=["title","onClick"],Gc={__name:"AlpinePanel",setup(t){return(e,n)=>(k(),_("div",zc,[b("div",jc,[w(M).tag?(k(),_("span",Hc,"<"+A(w(M).tag)+">",1)):j("",!0),(k(!0),_(H,null,st(w(M).states,o=>(k(),_("span",{key:o,class:"sve-al-state"},A(o),1))),128)),n[1]||(n[1]=b("span",{class:"sve-al-gap"},null,-1)),b("button",{type:"button","data-sve-al-add":"",title:w(M).addLabel,disabled:!w(M).canEdit,onClick:n[0]||(n[0]=L(o=>w(M).onAdd?.(o),["prevent","stop"]))},"+",8,Rc)]),w(M).chips.length?j("",!0):(k(),_("div",Wc,A(w(M).emptyText),1)),b("div",Nc,[(k(!0),_(H,null,st(w(M).chips,o=>(k(),_("span",{key:o.id,class:"sve-al-chip-wrap"},[b("button",{type:"button","data-sve-al-chip":o.id,title:o.title,disabled:!w(M).canEdit,onClick:L(s=>w(M).onChip?.(s,o.id),["prevent","stop"])},[b("span",Vc,A(o.name),1),o.value?(k(),_("span",Uc,A(o.value),1)):j("",!0)],8,qc),w(M).canEdit?(k(),_("button",{key:0,type:"button",class:"sve-al-drop",title:w(M).dropTitle,onClick:L(s=>w(M).onDrop?.(o.id),["prevent","stop"])},"−",8,Kc)):j("",!0)]))),128))])]))}},Xc=Uo(Gc,[["__scopeId","data-v-15add965"]]),Zc=[{id:"state",lang:"alpine_group_state"},{id:"act",lang:"alpine_group_act"},{id:"react",lang:"alpine_group_react"}],Fo=[{id:"state",group:"state",label:"alpine_state",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: false }"}]},{id:"state_text",group:"state",label:"alpine_state_text",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: '|' }"}]},{id:"toggle",group:"act",label:"alpine_toggle",icon:"toggle",needsName:!0,attrs:[{name:"@click",value:":name = !:name"}]},{id:"open",group:"act",label:"alpine_open",icon:"open",needsName:!0,attrs:[{name:"@click",value:":name = true"}]},{id:"close",group:"act",label:"alpine_close",icon:"close",needsName:!0,attrs:[{name:"@click",value:":name = false"}]},{id:"open_hover",group:"act",label:"alpine_open_hover",icon:"open",needsName:!0,attrs:[{name:"@mouseenter",value:":name = true"}]},{id:"close_leave",group:"act",label:"alpine_close_leave",icon:"close",needsName:!0,attrs:[{name:"@mouseleave",value:":name = false"}]},{id:"open_focus",group:"act",label:"alpine_open_focus",icon:"open",needsName:!0,attrs:[{name:"@focusin",value:":name = true"}]},{id:"close_blur",group:"act",label:"alpine_close_blur",icon:"close",needsName:!0,attrs:[{name:"@focusout",value:":name = false"}]},{id:"close_outside",group:"act",label:"alpine_close_outside",icon:"outside",needsName:!0,attrs:[{name:"@click.outside",value:":name = false"}]},{id:"close_escape",group:"act",label:"alpine_close_escape",icon:"escape",needsName:!0,attrs:[{name:"@keydown.escape.window",value:":name = false"}]},{id:"show",group:"react",label:"alpine_show",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"}]},{id:"show_smooth",group:"react",label:"alpine_show_smooth",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"},{name:"x-transition",value:""}]},{id:"hide_until_ready",group:"react",label:"alpine_hide_until_ready",icon:"cloak",attrs:[{name:"x-cloak",value:""}]},{id:"class_when",group:"react",label:"alpine_class_when",icon:"klass",needsName:!0,attrs:[{name:":class",value:":name ? '|' : ''"}]},{id:"text",group:"react",label:"alpine_text",icon:"text",needsName:!0,attrs:[{name:"x-text",value:":name"}]}];function Yc(t){return(t?.attrs||[]).map(e=>e.name).join(" ")}const Jc=/^(x-[\w:.-]+|@[\w:.-]+|:[\w-]+)$/;function Qc(t){return Jc.test(String(t||""))}function ne(t){const e=String(t||""),n=[],o=/([@:a-zA-Z_][\w:.@-]*)(\s*=\s*(["'])([\s\S]*?)\3)?/g;let s,a=!0;for(;s=o.exec(e);){if(a){a=!1;continue}s[0].trim()&&n.push({name:s[1],value:s[4]??"",from:s.index,to:s.index+s[0].length,alpine:Qc(s[1])})}return n}function sa(t){const e=String(t||"").trim().replace(/^\{|\}$/g,""),n=[],o=/(^|,)\s*([a-zA-Z_$][\w$]*)\s*:/g;let s;for(;s=o.exec(e);)n.push(s[2]);return n}function td(t,e){return t.map(n=>({name:n.name,value:String(n.value).replaceAll(":name:",`${e}:`).replaceAll(":name",e)}))}function Hn(t,e,n){const o=g.html,s=wt();if(!o||o.state.readOnly||!s)return;const a=r.htmlScopeActive&&!!r.htmlFocus,i=a?r.htmlFocus.from:0,c=(a?r.htmlFull:o.state.doc.toString()).slice(s.from,s.openTo),d=n===""?e:`${e}="${n}"`,f=ne(c).find(p=>p.name===e);let h;if(f)h=c.slice(0,f.from)+d+c.slice(f.to);else{const p=c.search(/\s|\/?>$/);h=p===-1?c:`${c.slice(0,p)} ${d}${c.slice(p)}`}h!==c&&(bt(o,[{from:s.from-i,to:s.openTo-i,insert:h}],null),Re(t))}function ed(t,e){const n=g.html,o=wt();if(!n||n.state.readOnly||!o)return;const s=r.htmlScopeActive&&!!r.htmlFocus,a=s?r.htmlFocus.from:0,l=(s?r.htmlFull:n.state.doc.toString()).slice(o.from,o.openTo),c=ne(l).find(h=>h.name===e);if(!c)return;let d=c.from;for(;d>0&&/\s/.test(l[d-1]);)d-=1;const f=l.slice(0,d)+l.slice(c.to);bt(n,[{from:o.from-a,to:o.openTo-a,insert:f}],null),Re(t)}function ln(t){const e=g.html;if(!e)return[];const o=r.htmlScopeActive&&!!r.htmlFocus?r.htmlFull:e.state.doc.toString(),s=wt(),a=[],i=es($e(o),new Set);for(const l of i){if(!s||l.from>s.from||l.to<s.to)continue;const c=ne(o.slice(l.from,l.openTo)).find(d=>d.name==="x-data");c&&a.push(...sa(c.value))}return[...new Set(a)]}function nd(t){const e=g.html,n=wt();if(!e||!n)return[];const s=r.htmlScopeActive&&!!r.htmlFocus?r.htmlFull:e.state.doc.toString(),a=ne(s.slice(n.from,n.openTo)).find(i=>i.name==="x-data");return a?sa(a.value):[]}function od(t,e){const n=t.document;S(n),e.setAttribute("data-open","");const o=ln(),s=n.createElement("div");s.id=x,n.body.appendChild(s),D(t,e,s);const a=!o.length,i=!a&&!nd().length,c=Zc.filter(d=>d.id==="state"?!i:!a).flatMap(d=>{const f=Fo.filter(h=>h.group===d.id);return f.length?[{value:`\0${d.id}`,label:m(t,a&&d.id==="state"?"alpine_group_state_first":d.lang),heading:!0},...f.map(h=>({value:h.id,label:m(t,h.label),hint:Yc(h)}))]:[]});a&&c.push({value:"\0note",label:m(t,"alpine_needs_state"),note:!0}),s._sveApp=z(Y,s,{kind:"choices",choices:c,onPick:d=>{const f=Fo.find(h=>h.id===d);if(S(n),!!f){if(!f.needsName){for(const h of f.attrs)Hn(t,h.name,h.value);return}sd(t,e,f,o)}}})}function sd(t,e,n,o){const s=t.document,a=l=>{const c=String(l||"").trim().replace(/[^\w$]/g,"");if(S(s),!!c)for(const d of td(n.attrs,c))Hn(t,d.name,d.value.replace("|",""))};if(!o.length){cn(t,e,a);return}const i=s.createElement("div");i.id=x,s.body.appendChild(i),D(t,e,i),i._sveApp=z(Y,i,{kind:"choices",choices:[{value:"\0head",label:m(t,"alpine_name"),heading:!0},...o.map(l=>({value:l,label:l})),{value:"\0new",label:m(t,"alpine_new_name")}],onPick:l=>{if(l==="\0new"){cn(t,e,a);return}a(l)}})}function cn(t,e,n){const o=t.document;S(o),e.setAttribute("data-open","");const s=o.createElement("div");s.id=x,o.body.appendChild(s),D(t,e,s),s._sveApp=z(Bn,s,{label:m(t,"alpine_name"),placeholder:m(t,"alpine_name_placeholder"),onAdd:a=>n(a)})}function Re(t){const n=t?.document.getElementById(u)?.querySelector("[data-sve-alpine-host]");if(!n)return;const o=wt(),s=g.html,a=r.htmlScopeActive&&!!r.htmlFocus,i=s?a?r.htmlFull:s.state.doc.toString():"",l=o?ne(i.slice(o.from,o.openTo)):[];M.tag=o?.tag||"",M.canEdit=!r.lastLocked&&!!o,M.emptyText=m(t,o?ln().length?"alpine_none_ready":"alpine_none":"alpine_pick"),M.addLabel=m(t,"alpine_add"),M.dropTitle=m(t,"alpine_remove"),M.states=ln(),M.chips=l.filter(c=>c.alpine).map(c=>({id:c.name,name:c.name,value:c.value,title:c.value?`${c.name}="${c.value}"`:c.name})),M.onAdd=c=>od(t,c.currentTarget),M.onDrop=c=>ed(t,c),M.onChip=(c,d)=>{M.chips.find(h=>h.id===d)&&cn(t,c.currentTarget,h=>Hn(t,d,h))},n._sveMounted||(n._sveMounted=!0,Zt(n,Xc))}const ad=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]),rd=new Set(["html","head","body"]),Io=new Set(["if","unless","style_push","script_push","sve_defaults","once","noparse","foreach","forelse","loop","cache","nocache","scope","collection","nav","structure","taxonomy","users","search:results","form:create","form:errors"]),id=new Set(["collection:count"]);function Oo(t){return id.has(t)?!1:Io.has(t)||Io.has(t.split(":")[0])}const ld=new Set(["CloseTag","MismatchedCloseTag","IncompleteCloseTag"]),cd=/^\s*(\/?)\s*([A-Za-z_][A-Za-z0-9_.:-]*)([\s\S]*)$/,dd=/^\{\{\s*\/?\s*([A-Za-z_][A-Za-z0-9_.:-]*)/,ud=3e5;function fd(t){const e=String(t||""),n=[],o=[];let s=0;for(;s<e.length;){const a=e.indexOf("{{",s);if(a===-1)break;if(e.startsWith("{{#",a)){const d=e.indexOf("#}}",a+3);if(d===-1){o.push(a);break}n.push({from:a,to:d+3,comment:!0,body:""}),s=d+3;continue}let i=0,l=a,c=-1;for(;l<e.length;){if(e.startsWith("{{",l)){i+=1,l+=2;continue}if(e.startsWith("}}",l)){if(i-=1,l+=2,i===0){c=l;break}continue}l+=1}if(c===-1){o.push(a),s=a+2;continue}n.push({from:a,to:c,comment:!1,body:e.slice(a+2,c-2)}),s=c}return{tags:n,unclosed:o}}function hd(t,e){let n=t;for(const o of e)n=n.slice(0,o.from)+" ".repeat(o.to-o.from)+n.slice(o.to);return n}function pd(t,e){return t===e||t.startsWith(`${e}:`)}function le(t,e){return(t.slice(e,e+80).match(/^<\/?([A-Za-z][A-Za-z0-9:-]*)/)?.[1]||"").toLowerCase()}function md(t,e,n,o,s){const a=c=>s.has(c.name)&&!/\||\?\?/.test(c.rest);for(const c of n){const d=t.slice(c,c+80).match(dd)?.[1]||"…";o.push({from:c,to:c+2,key:"code_dock_problem_antlers_unclosed",args:{name:d}})}const i=[],l=[];for(const c of e){if(c.comment)continue;const d=c.body.match(cd);if(!d)continue;const f=!!d[1],h=d[2].toLowerCase(),p=d[3];if(!f&&(h==="elseif"||h==="else")){let y=-1;for(let v=i.length-1;v>=0;v-=1)if(i[v].name==="if"||i[v].name==="unless"){y=v;break}if(y===-1){o.push({from:c.from,to:c.to,key:"code_dock_problem_branch_stray",args:{name:h}});continue}l.push({from:i[y].to,to:c.from}),i[y]={...i[y],to:c.to},i.length=y+1;continue}if(f||h==="endif"||h==="endunless"){const y=h==="endif"?"if":h==="endunless"?"unless":h;let v=-1;for(let E=i.length-1;E>=0;E-=1)if(pd(i[E].name,y)){v=E;break}if(v===-1){o.push({from:c.from,to:c.to,key:"code_dock_problem_pair_stray",args:{name:y}});continue}for(const E of i.slice(v+1))Oo(E.name)&&o.push({from:E.from,to:E.to,key:"code_dock_problem_pair_unclosed",args:{name:E.name}});(y==="if"||y==="unless")&&l.push({from:i[v].to,to:c.from}),i.length=v;continue}p.trim().startsWith("=")||i.push({name:h,rest:p,from:c.from,to:c.to})}for(const c of i)Oo(c.name)?o.push({from:c.from,to:c.to,key:"code_dock_problem_pair_unclosed",args:{name:c.name}}):a(c)&&o.push({from:c.from,to:c.to,key:"code_dock_problem_list_unclosed",args:{name:c.name}});return l}function gd(t,e,n,o){const s=e.parse(t),a=new Set,i=[];s.iterate({enter(l){if(l.name==="MismatchedCloseTag"){i.push({from:l.from,to:l.to,key:"code_dock_problem_tag_stray",args:{tag:le(t,l.from)}});return}if(l.name==="IncompleteCloseTag"){i.push({from:l.from,to:l.to,key:"code_dock_problem_tag_unfinished",args:{tag:le(t,l.from)}});return}if(l.type.isError){const h=l.node.parent;h&&(h.name==="OpenTag"||h.name==="CloseTag")&&(a.add(h.from),i.push({from:h.from,to:Math.max(h.from+1,l.from),key:"code_dock_problem_tag_unfinished",args:{tag:le(t,h.from)}}));return}if(l.name!=="Element")return;let c=null,d=!1;for(let h=l.node.firstChild;h;h=h.nextSibling)h.name==="OpenTag"&&(c=h),ld.has(h.name)&&(d=!0);if(!c||d)return;const f=le(t,c.from);!f||ad.has(f)||rd.has(f)||n.some(h=>c.from>=h.from&&c.from<h.to&&l.to>h.to)||i.push({from:c.from,to:c.to,key:"code_dock_problem_tag_unclosed",args:{tag:f}})}});for(const l of i)l.key==="code_dock_problem_tag_unclosed"&&a.has(l.from)||l.args.tag&&o.push(l)}function vd(t,e,n={}){const o=String(t||"");if(!o.trim()||o.length>ud)return[];const s=[];try{const{tags:i,unclosed:l}=fd(o),c=md(o,i,l,s,new Set(n.lists||[]));e&&gd(hd(o,i),e,c,s)}catch{return[]}const a=new Set;return s.sort((i,l)=>i.from-l.from||i.to-l.to).filter(i=>{const l=`${i.from}:${i.key}`;return a.has(l)?!1:(a.add(l),!0)})}function yd(t,e,n=()=>({})){const o=t.Decoration.mark({class:"sve-cm-problem"}),s=t.StateEffect.define(),a=l=>{const c=vd(l.doc.toString(),e,n()),d=new t.RangeSetBuilder;let f=0;for(const h of c)h.from<f||h.to<=h.from||(d.add(h.from,h.to,o),f=h.to);return{problems:c,decorations:d.finish()}},i=t.StateField.define({create(l){return a(l)},update(l,c){return c.docChanged||c.effects.some(d=>d.is(s))?a(c.state):l},provide:l=>t.EditorView.decorations.from(l,c=>c.decorations)});return{field:i,relint:s,extensions:[i]}}const bd=new Set(["replicator","grid","list","array","table"]);let fe=new Set,Qe=null;function aa(t){return t.document.getElementById(u)?.querySelector("[data-sve-html-problems]")||null}function xd(t,e,n){const o=aa(t);if(!o)return;const s=e.state.doc,a=n.map(c=>({from:c.from,line:s.lineAt(Math.min(c.from,s.length)).number,text:m(t,c.key,c.args)})),i=a.map(c=>`${c.line}:${c.text}`).join(`
`);if(o.dataset.sveSignature===i||(o.dataset.sveSignature=i,o.hidden=a.length===0,o.replaceChildren(),!a.length))return;const l=t.document.createElement("span");l.setAttribute("data-sve-problems-title",""),l.textContent=m(t,"code_dock_problems_title"),o.appendChild(l);for(const c of a){const d=t.document.createElement("button"),f=t.document.createElement("b");d.type="button",d.dataset.sveProblemAt=String(c.from),f.textContent=m(t,"code_dock_problem_line",{line:c.line}),d.append(f,t.document.createTextNode(` ${c.text}`)),o.appendChild(d)}}function kd(t){const e=aa(t);!e||e._sveBound||(e._sveBound=!0,e.addEventListener("mousedown",n=>n.preventDefault()),e.addEventListener("click",n=>{const o=n.target.closest("[data-sve-problem-at]"),s=g.html;if(!o||!s)return;n.preventDefault(),n.stopPropagation();const a=Math.min(Number(o.dataset.sveProblemAt)||0,s.state.doc.length);s.dispatch({selection:{anchor:a},effects:P.scrollIntoView(a,{y:"center"})}),s.focus()}))}function _d(t){const e=[],n=o=>{for(const s of o||[])s?.loop&&bd.has(s.type)&&s.var&&!s.parent&&e.push(s.var)};n(t?.section);for(const o of t?.page||[])n(o?.items);return e}function Sd(t,e,n){const o={collection:vs(t),set:ys(r.lastType),view:"",scope:""},s=o.set?Cn(o):"";if(s===Qe)return;Qe=s;const a=l=>{if(Qe!==s)return;const c=new Set(_d(l)),d=c.size===fe.size&&[...c].every(f=>fe.has(f));fe=c,!d&&g.html===e&&t.queueMicrotask(()=>{g.html===e&&e.dispatch({effects:n.of(null)})})};if(!s){a(null);return}const i=bs(s);if(i){a(i);return}xs(t,o).then(a)}function wd(t){if(!r.htmlLintUi){const{field:e,relint:n}=yd({Decoration:lt,StateField:gt,StateEffect:It,RangeSetBuilder:vt,EditorView:P},_e.parser,()=>({lists:fe})),o=P.updateListener.of(s=>{const a=s.transactions.some(i=>i.effects.some(l=>l.is(n)));!s.docChanged&&!a||(s.docChanged&&Sd(t,s.view,n),xd(t,s.view,s.state.field(e).problems))});r.htmlLintUi={extensions:[e,o]}}return kd(t),r.htmlLintUi}function $d(){if(r.cssGhostUi)return r.cssGhostUi;const t=lt.mark({class:"sve-css-ghost"}),e=n=>{const o=new vt;if(!r.lastWin)return o.finish();try{for(const s of hl(n.doc.toString(),pt(r.lastWin)))o.add(s.from,s.to,t)}catch{}return o.finish()};return r.cssGhostUi=gt.define({create:n=>e(n),update:(n,o)=>o.docChanged?e(o.state):n,provide:n=>P.decorations.from(n)}),r.cssGhostUi}let ce=null,be=null;function Cd(){if(ce)return ce;be=It.define();const t=lt.line({class:"sve-css-id"}),e=n=>{const o=new vt;if(!r.lastWin||!r.cssValues)return o.finish();try{const s=n.doc;for(const a of ge(s.toString(),pt(r.lastWin),r.cssSize)){const i=s.lineAt(Math.min(a.from,s.length)).number,l=s.lineAt(Math.min(Math.max(a.to-1,a.from),s.length)).number;for(let c=i;c<=l;c+=1)o.add(s.line(c).from,s.line(c).from,t)}}catch{}return o.finish()};return ce=gt.define({create:n=>e(n),update:(n,o)=>o.docChanged||o.effects.some(s=>s.is(be))?e(o.state):n,provide:n=>P.decorations.from(n)}),ce}function Rn(){be&&g.css&&g.css.dispatch({effects:be.of(null)})}function Td(){return r.htmlPartialUi||(r.htmlPartialUi=zr({Decoration:lt,StateField:gt,StateEffect:It,RangeSetBuilder:vt,EditorView:P})),r.htmlPartialUi}function Ad(){return r.htmlAntlersUi||(r.htmlAntlersUi=Dc({Decoration:lt,StateField:gt,RangeSetBuilder:vt,EditorView:P})),r.htmlAntlersUi}function Md(){return r.htmlClassTokenUi||(r.htmlClassTokenUi=hi({Decoration:lt,StateField:gt,StateEffect:It,RangeSetBuilder:vt,EditorView:P})),r.htmlClassTokenUi}function Ed(t,e,n){g[e]?.destroy();const o=fn.of([{key:"Mod-s",run:()=>(q(t.document),!0)}]);g[e]=new P({state:ke.create({doc:"",extensions:[$a(),Ca(),Ta(),La(),Au(e),Fa(),Ba({tooltipClass:()=>"sve-tw-complete"}),...e==="html"?[_e.data.of({autocomplete:Pr(t)}),_e.data.of({autocomplete:Fl(t)}),Il(t),Dr(Da,t)]:[],...e==="html"?[...Gr(),Xr()]:[],...e==="css"?[Ra(),$d(),Cd()]:[],fn.of([...Aa,...e==="html"?[{key:"Tab",run:Zr}]:[],Ma,...Ea,...Pa,...Ia]),o,P.lineWrapping,...e==="html"||e==="css"?Td().extensions:[],...e==="html"?Ad().extensions:[],...e==="html"?wd(t).extensions:[],...e==="html"?Md().extensions:[],Rt[e].of(ke.readOnly.of(!!r.lastLocked)),Wt[e].of(P.editable.of(!r.lastLocked)),P.updateListener.of(s=>{e==="html"&&s.docChanged&&!r.applying&&(ac(),yn("dock:html-changed")),e==="css"&&s.docChanged&&!r.applying&&rc(),s.docChanged&&J(t),e==="css"&&(s.docChanged||s.selectionSet)&&B(t),e==="css"&&s.docChanged&&!r.applying&&oe(t),e==="html"&&(s.docChanged||s.selectionSet)&&(ze(t),Re(t),r.applying||se(t))}),...tr(C,{height:"auto",background:"#1E1E21",scroller:{overflow:"visible",height:"auto",minHeight:0},extraTags:s=>[{tag:s.tagName,color:"#4ec9b0"},{tag:s.attributeName,color:"#9cdcfe"},{tag:s.attributeValue,color:"#ce9178"},{tag:s.angleBracket,color:"#808080"}]})]}),parent:n})}function Ld(t){if(!t||t.querySelector(".cm-editor"))return;t.replaceChildren();const e=t.ownerDocument.createElement("span");e.style.cssText="width:16px;height:16px;margin:12px;border:2px solid #858585;border-right-color:transparent;border-radius:50%;display:block;animation:sve-cm-wait .6s linear infinite",t.appendChild(e)}function pt(t){return bn(t).map(e=>({handle:e.handle,base:e.base,max:e.max,media:e.media,media_px:e.media_px,label:e.label}))}function ra(t,e){return pt(t).find(n=>n.handle===e)||null}function We(t=r.cssState){return t?t==="before"||t==="after"?`::${t}`:`:${t}`:""}function oe(t,e=!1){const n=g.css;if(!n||!hn||!pn)return;const o=n.state.doc.toString(),s=`${r.cssValues?"1":"0"}|${r.cssSize}|${Ee(o).map(f=>`${f.from}-${f.to}`).join(",")}`;if(!e&&s===r.cssFoldSig)return;r.cssFoldSig=s;const a=pt(t),i=new Map,l=[...ul(o,a,r.cssSize),...r.cssValues?[]:ge(o,a,r.cssSize).map(f=>({from:f.from,to:f.to}))];for(const f of l)f.to>f.from&&i.set(`${f.from}:${f.to}`,{from:f.from,to:f.to});const c=[],d=new Set;Wa(n.state).between(0,o.length,(f,h)=>{const p=`${f}:${h}`;d.add(p),!i.has(p)&&r.cssOwnFolds.has(p)&&c.push(pn.of({from:f,to:h}))});for(const[f,h]of i)d.has(f)||c.push(hn.of(h));r.cssOwnFolds=new Set(i.keys()),c.length&&n.dispatch({effects:c})}function dn(t,e){const n=r.cssFull||e;return/max-width/i.test(n)&&!/width\s*</i.test(n)&&t.media_px||t.media}function Bd(t,e){const n=g.css;if(!n||n.state.readOnly)return;const o=pt(t),s=ra(t,e),a=n.state.doc.toString();if(!s||s.base){const f=n.state.selection.main.head,h=Ee(a).find(p=>f>=p.from&&f<=p.to);h&&n.dispatch({selection:{anchor:h.from},scrollIntoView:!0});return}const i=An(a,o,e);if(i.length){const f=i[0],h=Math.min(f.bodyTo,f.bodyFrom+(a.slice(f.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);n.dispatch({selection:{anchor:h},scrollIntoView:!0});return}const l=dn(s,a),c=ia(n,a),d=`

${c.indent}@media ${l} {
${c.indent}    
${c.indent}}${c.suffix}`;n.dispatch({changes:{from:c.at,to:c.at,insert:d},selection:{anchor:c.at+d.lastIndexOf("    ")+4},scrollIntoView:!0})}function ia(t,e){const n=Ee(e);if(n.length){const i=n[n.length-1];return{at:i.to,indent:xt(e,i.from),suffix:""}}const o=i=>({at:i.to,indent:xt(e,i.to)||`${xt(e,i.open)}    `,suffix:`
${xt(e,i.open)}`}),s=je();if(s)return o(s);const a=Fd(e);return a?o(a):{at:e.length,indent:"",suffix:""}}function Fd(t){const e=String(t||"");let n=null,o=0,s=0;for(;o<e.length;){if(e[o]==="}"||e[o]===";"){o+=1,s=o;continue}if(e[o]!=="{"){o+=1;continue}const a=Mt(e,o);if(a===-1||n||(n=e.slice(s,o).trim().startsWith("@")?null:{from:s,open:o,to:a},!n))return null;o=a+1,s=o}return n}function Id(t,e){const n=e===r.cssSize?"":e;r.cssSize=n,N(t,qn,n),ot("lp:set-device",{win:t,key:n?gr(n,t):"Responsive"}),n&&Bd(t,n),r.cssValues&&ca(t),oe(t,!0),Rn(),_t(t),B(t)}function Od(t,e){r.cssState=Vn.includes(e)?e:"",N(t,un,r.cssState),S(t.document),_t(t),B(t)}function Pd(t,e){const n=t.document;S(n),e.setAttribute("data-open","");const o=n.createElement("div");o.id=x,n.body.appendChild(o),D(t,e,o),o._sveApp=z(Y,o,{kind:"choices",choices:[{value:"",label:m(t,"css_state_none"),active:!r.cssState},...Vn.map(s=>({value:s,label:We(s),active:s===r.cssState}))],onPick:s=>Od(t,s)})}function _t(t){const n=t?.document.getElementById(u)?.querySelector("[data-sve-css-head]");if(!n)return;const o=wt(),s=pt(t),a=g.css?.state.doc.toString()??"";$.tag=o?.tag||"",$.scope=Qr(o?Lt().slice(o.from,o.openTo):"")||"";const i=$.scope,l=En(t,i);$.scopeElsewhere=[...new Set(l.map(c=>String(c.file).replace(/^.*\//,"")))],$.scopeElsewhereTitle=$.scopeElsewhere.length?`${m(t,"class_defined_in",{file:$.scopeElsewhere.join(", ")})} — ${m(t,"class_defined_import")}`:"",$.onScopeImport=()=>{Ln(t,i)&&_t(t)},i&&!Ms()&&Mn(t).then(()=>_t(t)),$.canEdit=!r.lastLocked,$.onTag=c=>jr(t,c.currentTarget,o),$.state=r.cssState,$.stateLabel=r.cssState?We(r.cssState):m(t,"css_state"),$.onState=c=>Pd(t,c.currentTarget),$.onSize=c=>Id(t,c),$.sizes=[{key:"",label:m(t,"tw_size_all"),title:m(t,"css_size_all_title"),active:!r.cssSize},...s.map(c=>{const d=c.base||An(a,s,c.handle).length>0;return{key:c.handle,label:c.label,title:c.base?m(t,"css_size_base_title"):`@media ${c.media}${d?"":`  ·  ${m(t,"css_size_new")}`}`,active:r.cssSize===c.handle}})],n._sveMounted||(n._sveMounted=!0,Zt(n,_l))}we("lp:device",t=>{const e=r.lastWin;if(!e||!fa(e.document))return;const n=bn(e).find(o=>o.device===t)?.handle||"";n!==r.cssSize&&(r.cssSize=n,N(e,qn,n),oe(e,!0),Rn(),_t(e),B(e))});function Dd(t){const e=Math.max(0,Math.round(Date.now()/1e3-t)),n=new Date(t*1e3).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});let o=n;try{const s=new Intl.RelativeTimeFormat(void 0,{numeric:"auto"});e<90?o=s.format(-e,"second"):e<5400?o=s.format(-Math.round(e/60),"minute"):e<86400?o=s.format(-Math.round(e/3600),"hour"):o=s.format(-Math.round(e/86400),"day")}catch{}return`${o} · ${n}`}function la(t,e){return t.fetch(e,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}})}async function zd(t,e){const n=t.document,o=mt();if(S(n),!o)return;let s=[];try{const i=await la(t,`/!/sve/section-template/history?type=${encodeURIComponent(o)}`);i.ok&&(s=(await i.json())?.entries||[])}catch{s=[]}if(!n.getElementById(u)||!n.contains(e))return;e.setAttribute("data-open","");const a=n.createElement("div");a.id=x,n.body.appendChild(a),D(t,e,a),a._sveApp=z(Y,a,{kind:"choices",choices:s.length?s.map(i=>({value:i.id,label:Dd(i.at)})):[{value:"",label:m(t,"code_dock_history_empty")}],onPick:i=>{S(n),i&&jd(t,o,i)}})}async function jd(t,e,n){if(ht())return;let o=null;try{const s=await la(t,`/!/sve/section-template/history/entry?type=${encodeURIComponent(e)}&id=${encodeURIComponent(n)}`);s.ok&&(o=await s.json())}catch{o=null}!o||ht()||(ee({html:o.html??"",css:o.css??"",js:o.js??""},r.lastLocked),J(t),se(t))}function Kt(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-code-strip]");if(!e)return;e.hidden=r.styleMode!=="tw";const n=ns(t);e.innerHTML=af,e.title=m(t,n?"tw_strip_on":"tw_strip_off"),e.setAttribute("aria-label",e.title),e.setAttribute("aria-pressed",n?"true":"false")}function Hd(t,e){const n=e.querySelector("[data-sve-code-strip]");!n||n._sveBound||(n._sveBound=!0,n.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),Hr(t,!ns(t)),Kt(t),Rr(t)}),Kt(t))}function Rd(t,e){const n=e.querySelector("[data-sve-code-history]");!n||n._sveBound||(n._sveBound=!0,n.innerHTML=rf,n.title=m(t,"code_dock_history"),n.setAttribute("aria-label",n.title),n.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),n.hasAttribute("data-open")){S(t.document);return}zd(t,n)}))}function If(){return r.styleMode}function Wd(t){return r.styleMode==="tw"?wt():null}function wt(t){const e=g.html;if(!e)return null;const n=r.htmlScopeActive&&!!r.htmlFocus,o=n?r.htmlFull:e.state.doc.toString(),a=(n?r.htmlFocus.from:0)+e.state.selection.main.from,i=es($e(o),new Set);let l=null;for(const c of i)c.from<=a&&a<c.to&&(l=c);return l}function se(t){r.styleMode==="tw"&&Wr(t,Wd())}function Wn(t){const e=t?.document.getElementById(u),n=e?.querySelector("[data-sve-values-mode]");if(!e||!n)return;e.setAttribute("data-sve-values",r.cssValues?"on":"off");const o=t.document.createElement("span");o.textContent=m(t,"code_dock_values"),n.innerHTML=cf,n.appendChild(o),n.title=m(t,r.cssValues?"code_dock_values_off":"code_dock_values_on"),n.setAttribute("aria-label",n.title),n.setAttribute("aria-pressed",r.cssValues?"true":"false")}function ca(t){const e=g.css;if(!e||e.state.readOnly)return;const n=pt(t),o=e.state.doc.toString(),s=ge(o,n,r.cssSize);if(e.focus(),s.length){const p=s[0],y=Math.min(p.bodyTo,p.bodyFrom+(o.slice(p.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);e.dispatch({selection:{anchor:y},scrollIntoView:!0});return}const a=ra(t,r.cssSize);if(!a||a.base){const p=`#id-{{ id }} {
    `;e.dispatch({changes:{from:0,to:0,insert:`${p}
}

`},selection:{anchor:p.length},scrollIntoView:!0});return}const i=An(o,n,r.cssSize)[0];if(i){const p=`${xt(o,i.from)}    `,y=`
${p}#id-{{ id }} {
${p}    `;e.dispatch({changes:{from:i.bodyFrom,to:i.bodyFrom,insert:`${y}
${p}}
`},selection:{anchor:i.bodyFrom+y.length},scrollIntoView:!0});return}const l=ia(e,o),c=`${l.indent}    `,d=ge(o,n,"").some(p=>l.at>p.bodyFrom&&l.at<=p.bodyTo),f=d?`

${l.indent}@media ${dn(a,o)} {
${c}`:`

${l.indent}@media ${dn(a,o)} {
${c}#id-{{ id }} {
${c}    `,h=d?`
${l.indent}}${l.suffix}`:`
${c}}
${l.indent}}${l.suffix}`;e.dispatch({changes:{from:l.at,to:l.at,insert:`${f}${h}`},selection:{anchor:l.at+f.length},scrollIntoView:!0})}function Nd(t,e){r.cssValues=!!e,N(t,Zn,r.cssValues?"1":"0"),S(t.document),r.cssOpenTool="",Wn(t),ct(),Qt(),r.cssValues&&ca(t),oe(t,!0),Rn(),_t(t),B(t)}function Nn(t){const e=t?.document.getElementById(u);if(!e)return;const n=r.styleMode==="tw";e.setAttribute("data-sve-style",r.styleMode);const o=e.querySelector("[data-sve-css-label]");o&&(o.textContent=n?m(t,"code_dock_style_tw"):m(t,"code_dock_css"));const s=e.querySelector("[data-sve-style-mode]");if(!s)return;const a=t.document.createElement("span");a.textContent=n?m(t,"code_dock_style_tw"):m(t,"code_dock_css"),s.innerHTML=n?df:lf,s.appendChild(a),s.title=m(t,n?"code_dock_style_to_css":"code_dock_style_to_tw"),s.setAttribute("aria-label",s.title),s.setAttribute("aria-pressed",n?"true":"false")}function da(t){t?.document.getElementById(u),S(t.document),nn(t),r.cssOpenTool="",r.cssOpenMenu="",r.styleMode==="tw"&&r.cssValues&&(r.cssValues=!1,N(t,Zn,"0")),Nn(t),Wn(t),Kt(t),r.cssToolRow?.(),r.styleMode==="tw"&&(r.htmlScopePref=!0,N(t,qe,"1"),on(t,!0)),se(t),Re(t),B(t)}const qn="sve-css-size",un="sve-css-state",Vn=["hover","focus","focus-visible","active","disabled","before","after"],Po="data-sve-scroll-edge";function Un(t){if(!t||t._sveEdges)return;t._sveEdges=!0;const e=()=>Vd(t),n=new ResizeObserver(e),o=()=>{for(const s of t.children)n.observe(s)};t.addEventListener("scroll",e,{passive:!0}),n.observe(t),o(),new MutationObserver(()=>{o(),e()}).observe(t,{childList:!0}),e()}function qd(t,e){if(!t||t._sveEdgesIn)return;t._sveEdgesIn=!0;const n=()=>t.querySelectorAll(e).forEach(Un);n(),new MutationObserver(n).observe(t,{childList:!0,subtree:!0})}function Vd(t){const e=t.scrollWidth-t.clientWidth,n=t.scrollLeft>1,o=e-t.scrollLeft>1,s=n&&o?"both":n?"left":o?"right":"";s?t.setAttribute(Po,s):t.removeAttribute(Po)}function Ud(t,e){r.styleMode=e==="tw"?"tw":"css",N(t,Ka,r.styleMode),da(t)}function Kd(t,e){if(e._sveStyleModeBound)return;e._sveStyleModeBound=!0,r.styleMode=X(t,Ka)==="tw"?"tw":"css";const n=X(t,qn)||"";r.cssSize=bn(t).some(o=>o.handle===n)?n:"",r.cssState=Vn.includes(X(t,un))?X(t,un):"",r.cssValues=X(t,Zn)==="1",e.querySelector("[data-sve-style-mode]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),Ud(t,r.styleMode==="tw"?"css":"tw")}),e.querySelector("[data-sve-values-mode]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),Nd(t,!r.cssValues)}),da(t),Wn(t)}function Gd(t,e){const n=e.querySelector("[data-sve-css-tools]");if(!n||n._sveBound)return;n._sveBound=!0;const o=a=>e.querySelector(`[data-sve-css-tool="${a}"], [data-sve-css-kid="${a}"]`),s=a=>{const i=o(a.id),l=r.cssOpenMenu===a.id;if(S(t.document),l){nn(t),B(t);return}if(!i)return;const c=r.styleMode==="tw"?!a.twClass&&!!a.tw:!a.kind&&!a.value&&!(a.css in Z())&&!!a.menu,d=()=>{c&&(r.cssOpenMenu=a.id)};if(r.styleMode==="tw"){nn(t),a.twClass?(Nr(t,a.twClass),B(t)):a.tw&&(qr(t,i,a.tw,()=>B(t)),d(),B(t));return}if(a.kind==="flexDir"){Cc(a.value);return}if(a.kind==="display"){Tc(a.value);return}if(a.value){const f=F(Z()[a.css])===F(a.value);G([{property:a.css,value:f?null:a.value}]);return}if(a.css in Z()){G([{property:a.css,value:null}]),B(t);return}a.menu==="colors"?Ec(t,i,a.css):a.menu==="spacing"?Bc(t,i,a.css):a.menu==="sizes"?Ao(t,i,a.css,mf):a.menu==="choices"?Lc(t,i,a.css,a.choices):a.menu==="values"&&Ao(t,i,a.css),d(),B(t)};dt.onTool=a=>{const i=Se.get(a)?.tool;if(i){if(i.kids?.length){r.cssOpenTool=r.cssOpenTool===i.id?"":i.id,S(t.document),B(t);return}s(i)}},dt.onKid=(a,i)=>{const l=Se.get(i);l?.kid&&s(l.kid)},r.cssToolRow=()=>{Zt(n,il),B(t)},r.cssToolRow(),Un(n),qd(n,"[data-sve-css-kids]"),t.document.addEventListener("mousedown",a=>{a.target.closest(`#${x}, [data-sve-css-tools], [data-sve-html-tools], [data-sve-css-add-class]`)||S(t.document)},!0)}function Xd(t,e){const n=e.querySelector("[data-sve-html-tidy]");n&&(n.innerHTML=os.tidy,n.title=m(t,"code_dock_html_tidy"),n.setAttribute("aria-label",n.title),n.setAttribute("data-tip",n.title))}function Zd(t,e){const n=e.querySelector("[data-sve-html-tidy]");Xd(t,e),!(!n||n._sveBound)&&(n._sveBound=!0,n.addEventListener("mousedown",o=>o.preventDefault()),n.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),Us()}))}function Yd(t,e){const n=e.querySelector("[data-sve-html-tools]");!n||n._sveBound||(n._sveBound=!0,Zt(n,el,{tools:mn.map(o=>({...o,icon:os[o.id]||""})),onTool:o=>{const s=mn.find(i=>i.id===o),a=n.querySelector(`[data-sve-html-tool="${o}"]`);if(s){if(s.menu==="heading"){wo(t,a,Za);return}if(s.menu==="text"){wo(t,a,vr);return}if(s.tidy){Us();return}if(s.menu==="component"){yc(t,a);return}if(S(t.document),s.snippet){Vs(s.snippet,s.caret??s.snippet.length,s.select),I();return}Ks(s.tag)}}}),Un(n),Su(t,e),$u(t,e),_u(t,e))}T("dock:save-now",()=>(q(r.lastWin?.document),!0));let de=null;async function Jd(t){const e=t.document;Iu(e);let n=e.getElementById(u);if(n&&!(n.querySelector('[data-sve-css-chrome="subrow-2"]')&&n.querySelector("[data-sve-css-add-class]")&&n.querySelector("[data-sve-html-tools]")&&n.querySelector("[data-sve-html-tidy]")&&n.querySelector("[data-sve-data-vars]")&&n.querySelector("[data-sve-visual-edit-tools]")&&n.querySelector("[data-sve-html-scope]")&&n.querySelector("[data-sve-code-lock]")&&n.querySelector("[data-sve-code-back]")&&n.querySelector("[data-sve-code-autosave]")&&n.querySelector("[data-sve-code-save]")&&n.getAttribute("data-sve-code-chrome")==="scope-9")){for(const s of nt)g[s]?.destroy(),g[s]=null;n.remove(),n=null}if(!n){n=e.createElement("div"),n.id=u,n.setAttribute("data-sve-code-chrome","scope-9"),kr(n,_r(t)),Zt(n,Ki,{htmlLabel:m(t,"code_dock_html"),cssLabel:m(t,"code_dock_css"),jsLabel:m(t,"code_dock_js"),alpineLabel:m(t,"code_dock_alpine"),treeIcon:Xa,dataIcon:Qu,dataLabel:m(t,"data_vars_title")}),en(e,n),jo(n),ka(n,va(t)),Ru(t,n),Nu(t,n),Wu(t,n),Gd(t,n),xc(t,n),Kd(t,n),Rd(t,n),Hd(t,n),Sr(t,n),Yd(t,n),xo(t,n),yo(t,n),Ho(t,n),bo(t,n);for(const o of nt){const s=n.querySelector(`[data-sve-code-pane="${o}"] [data-sve-code-host]`);Ld(s)}wr(t)}if(en(e,n),jo(n),Zd(t,n),xo(t,n),yo(t,n),Ho(t,n),bo(t,n),zu(t),Kn(t),Tt(t),U(t),Xt(t),rt(t),Nn(t),Kt(t),await Vu(),!g.html){for(const o of nt){const s=n.querySelector(`[data-sve-code-pane="${o}"] [data-sve-code-host]`);s?.replaceChildren(),Ed(t,o,s)}for(const o of["html","css"])g[o]&&Vr(t,g[o],{onOpen:s=>Ds(t,s),emptyLabel:m(t,"code_dock_partials_empty"),openLabel:s=>m(t,"component_open_named",{name:s}),sectionValues:()=>Ps(t),isLocked:()=>ht(),setHover:(s,a)=>r.htmlPartialUi?.setHover(s,a)});gi(t,g.html,{onRename:o=>lc(t,o),isLocked:()=>ht(),setHover:(o,s)=>r.htmlClassTokenUi?.setHover(o,s),title:m(t,"code_dock_css_rename_class")})}return n}function ua(t){return de||(de=Jd(t).finally(()=>{de=null})),de}async function Do(t,e){const n=await ua(t);r.lastType=e,r.lastLocked=!0,r.lockReady=!0,r.lastParts={html:"",css:"",js:""},De(),Tt(t),ee(r.lastParts,!0),wa(t.document,e),O(t.document,m(t,"code_dock_missing")),U(t),Xt(t),rt(t),Gt(t,n)}async function Ft(t,e,n="replace"){n==="replace"?r.typeStack=[]:n==="push"&&r.lastType&&r.lastType!==e&&r.typeStack.push(r.lastType);const o=++r.loadGen;r.lastType=e,r.lockReady=!1,De(),O(t.document,m(t,"code_dock_loading"));let s=()=>{};r.loadInFlight=new Promise(i=>{s=i});const a=await ua(t);Tt(t),U(t),Xt(t),rt(t),Nn(t),Kt(t),Gt(t,a),t.fetch(`/!/sve/section-template?type=${encodeURIComponent(e)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async i=>{if(o!==r.loadGen)return;if(i.status===404){Do(t,e);return}if(!i.ok)throw new Error(String(i.status));const l=await i.json();o===r.loadGen&&(r.lastParts={html:typeof l.html=="string"?l.html:"",css:typeof l.css=="string"?l.css:"",js:typeof l.js=="string"?l.js:""},r.lastProps=Array.isArray(l.props)?l.props:[],r.propsDirty=!1,r.lastType=e,r.lastLocked=!!l.locked,r.lockReady=!0,nc(),typeof l.tw=="string"&&l.tw!==""&&oc(r.lastParts.html,l.tw),Tt(t),ee(r.lastParts,r.lastLocked),ss(t),r.lastLocked||Fs(t,r.lastParts.html),wa(t.document,l.path||e),O(t.document,r.lastLocked?m(t,"code_dock_locked"):""),l.writable?.template===!1?O(t.document,m(t,"code_dock_not_writable")):l.writable?.tw===!1&&O(t.document,m(t,"code_dock_tw_not_writable")),$s(t),Ji(t),Tn(t),U(t),Xt(t),rt(t),Gt(t,a))}).catch(()=>{o===r.loadGen&&(Do(t,e),O(t.document,m(t,"code_dock_error")))}).finally(()=>{o===r.loadGen&&(r.loadInFlight=null),s()})}function mt(){return r.lastType||""}function fa(t){return!!t?.getElementById(u)}function ht(){return r.lastLocked}function Qd(t,e){const n=typeof e?.html=="string"?e.html.trim():"",o=typeof e?.css=="string"?e.css.trim():"",s=typeof e?.js=="string"?e.js.trim():"";if(!n&&!o&&!s||!t?.document?.getElementById(u))return!1;let a=!1;return n&&(a=tu("html",n)||a),o&&(a=zo("css",o)||a),s&&(a=zo("js",s)||a),a&&J(t),a}function tu(t,e){const n=g[t];if(!n||n.state.readOnly)return!1;const o=n.state.selection.main,s=o.from>0?n.state.doc.sliceString(o.from-1,o.from):`
`,a=o.to<n.state.doc.length?n.state.doc.sliceString(o.to,o.to+1):`
`,c=`${s===`
`?"":`
`}${e}${a===`
`?"":`
`}`;return n.dispatch({changes:{from:o.from,to:o.to,insert:c},selection:{anchor:o.from+c.length}}),!0}function zo(t,e){const n=g[t];if(!n||n.state.readOnly)return!1;const o=n.state.doc.length,a=`${o>0&&n.state.doc.sliceString(Math.max(0,o-1),o)!==`
`?`

`:o?`
`:""}${e}
`;return n.dispatch({changes:{from:o,insert:a},selection:{anchor:o+a.length}}),!0}function eu(t){if(ye(t),!r.lastType||!t.document.getElementById(u))return;const e=r.lastType;r.lastType=null,Ft(t,e,"keep")}function ha(t){W(t),r.loadGen+=1,q(t),r.lastUid=null,r.lastType=null,r.typeStack=[],r.lastParts={html:"",css:"",js:""},r.lastLocked=!1,r.lockReady=!1,r.lastBracketNames=null,r.lastCssSelectorNames=null,De(),r.lastWin=t?.defaultView||r.lastWin,S(t),ts(t),tt(t),t?.getElementById(K)?.remove();for(const n of nt)g[n]?.destroy(),g[n]=null;t?.getElementById(u)?.remove(),Du(),t&&Gn(t,0);const e=t?.defaultView||r.lastWin;e?.document.getElementById(No)&&Go(e),e&&($s(e),Tn(e),ss(e))}function nu(t){if(r.dragging)return;const e=t.document.getElementById(u);e&&(Kn(t),Gt(t,e))}function ou(t,e,n){if(n){const a=no(n,e)||no(n,t.document)||n;return String(typeof Xe=="function"&&(Xe(a,e)||Xe(a,t.document))||"").trim()}const o=typeof Nt=="function"?Nt(t):"page_sections",s=typeof V=="function"?V(t.document):[];for(const a of s){const l=(ft(a.values)||a.values)?.[o];if(Array.isArray(l))for(const c of l){const d=typeof c?.type=="string"?c.type.trim():"";if(d)return d}}return""}function Ne(t){if((t.Statamic?.$config?.get?.("sveFeatures")||{}).collection_templates!==!0)return"";const n=t.Statamic?.$config?.get?.("sveCollectionTemplatesCollection")||"templates";if(!(t.location?.pathname||"").includes(`/collections/${n}/entries/`))return"";const s=typeof V=="function"?V(t.document):[];for(const a of s){const i=ft(a.values)||a.values,l=typeof i?.view=="string"?i.view.trim():"";if(!l||l.includes(".."))continue;const c=l.replace(/\.(antlers\.html|blade\.php)$/i,"").replace(/^\/+|\/+$/g,"");if(c)return`view:${c}`}return""}function su(t,e,n){const o=t.Statamic?.$config?.get?.("sveChromeTemplates")||{},s=o[e]&&typeof o[e].type=="string"?o[e]:null,a=t.Statamic?.$config?.get?.("sveChromeStyles")||{},i=`${e}/${typeof a[e]=="string"&&a[e]!==""?a[e]:"style_1"}`,l=s?.type||i,c=n?.[`${e}_style`];return(!s||s.styled)&&typeof c=="string"&&c!==""?`${e}/${c}`:l}function au(){const t=mt();if(!t)return"";if(t===he)return"main";if(r.lastWin&&t===Ne(r.lastWin))return"template";const e=t.match(/^(header|footer)\//);if(e)return e[1];const n=r.lastWin?.Statamic?.$config?.get?.("sveChromeTemplates")||{};return["header","footer"].find(o=>n[o]?.type===t)||""}function ru(t){const e=Zo||Yo;return e!=="header"&&e!=="footer"?"":xn(t)||kn(t)?e:""}function iu(t,e){const n=Zo||Yo;return n!=="header"&&n!=="footer"||!xn(e)&&!kn(e)?"":su(t,n,ft(xr()?.values)||{})}function lu(t,e){if(!e||String(e).startsWith("view:")||Bs(t,e))return!1;const n=typeof Nt=="function"?Nt(t):"page_sections",o=typeof V=="function"?V(t.document):[];for(const s of o){const i=(ft(s.values)||s.values)?.[n];if(Array.isArray(i)&&i.some(l=>l?.type===e))return!0}return!1}function cu(t){const e=Xo(t)||t.getElementById("__sve-global-section-host");return e&&e.querySelector("[data-replicator-set][data-type]")?.getAttribute("data-type")||""}function Of(t,e,n){if(r.dragging)return;const o=!!(n&&n!==r.lastUid);if(n&&(r.lastUid=n),!t||!e||Mu(e)||!yr(t)||!br(t)){e&&ha(e);return}const s=!n&&!!r.lastType&&r.lastType!==he&&!xn(e)&&!kn(e)&&!Xo(e)&&!lu(t,r.lastType);s&&(r.lastUid=null);const a=n||r.lastUid||"",i=iu(t,e)||cu(e)||(a?ou(t,e,a):"")||Ne(t)||(!n&&!s?r.lastType:""),l=i||(n?"":he);if(r.onEmptyPage=!i&&!n,r.lastWin=t,!!l&&!(l===r.lastType&&e.getElementById(u))){if(r.typeStack.length&&r.lastType&&r.lastType!==l){const c=r.typeStack[0];if(l===c&&!o)return;r.typeStack=[]}q(e),Ft(t,l,"replace")}}we("tw:changed",()=>{r.lastWin&&r.styleMode==="tw"&&B(r.lastWin)});T("dock:is-open",t=>fa(t));T("dock:is-locked",()=>ht());T("dock:html",()=>Lt());T("dock:reveal-html",({from:t,to:e,caret:n}={})=>{const o=g.html;if(!o||t==null)return;r.htmlScopePref=Jt(r.lastWin),Fe(),ct();const s=r.htmlFull.length,a=Math.max(0,Math.min(t,s)),i=Math.max(a,Math.min(e??t,s));r.htmlFocus=i>a?{from:a,to:i}:null;const l=n==null?null:Math.max(0,Math.min(n,s));if(r.htmlScopePref&&r.htmlFocus){Pn(l),U(r.lastWin);return}if(r.htmlScopeActive){Dn(!0,l),U(r.lastWin);return}o.dispatch({selection:l==null?{anchor:a,head:i}:{anchor:l},scrollIntoView:!0}),o.focus()});T("dock:insert-snippet",({win:t,parts:e})=>Qd(t,e));T("dock:refresh",t=>eu(t));T("dock:tw-follow",()=>{r.lastWin&&se(r.lastWin)});T("dock:css",()=>(ct(),r.cssFull));T("dock:set-css",t=>typeof t!="string"||ht()||!g.css||!r.lastWin?!1:(ct(),r.cssFull=t,Oe("css",Gs()),J(r.lastWin),!0));T("dock:data-menu",({anchor:t,onPick:e,at:n}={})=>!t||!r.lastWin?!1:(W(r.lastWin.document),S(r.lastWin.document),pa(r.lastWin,t,e,n),!0));T("dock:props",()=>r.lastProps.map(t=>({...t})));T("dock:set-props",({win:t,props:e}={})=>!Array.isArray(e)||ht()?!1:(r.lastProps=e,r.propsDirty=!0,Ur(ae(mt())),q((t||r.lastWin)?.document),!0));function ae(t){const e=/^view:partials\/(components\/[A-Za-z0-9_-]+)$/.exec(String(t||""));return e?e[1]:""}T("dock:component-src",()=>ae(mt()));T("dock:type-stack",()=>r.typeStack.map(t=>({type:t,src:ae(t)})));T("dock:component-exit-state",()=>{const t=ae(mt());return{open:!!t,name:t?t.split("/").pop():"",back:r.typeStack.length>0}});T("dock:exit-component",(t=1)=>{if(!r.lastWin||!ae(mt()))return!1;if(r.typeStack.length){for(let e=Number(t)||1;e>1&&r.typeStack.length>1;e-=1)r.typeStack.pop();zs(r.lastWin)}else ha(r.lastWin.document);return!0});T("dock:current-type",()=>mt());T("dock:on-empty-page",()=>!!r.onEmptyPage);T("dock:current-uid",()=>r.lastUid);T("dock:leave-part",()=>{const t=r.lastWin;return t?(r.lastUid=null,q(t.document),Ft(t,he,"replace"),!0):!1});T("dock:chrome-kind",()=>au());T("dock:collection-view",()=>r.lastWin?Ne(r.lastWin):"");T("dock:chrome-open",t=>ru(t));T("dock:save-settled",()=>r.saveInFlight||null);T("dock:load-settled",()=>r.loadInFlight||null);T("dock:reset-data-vars",t=>(yi(typeof t=="string"&&t?t:void 0),!0));T("dock:refresh-preview",()=>r.lastWin?(ye(r.lastWin),!0):!1);T("dock:open-file",t=>typeof t!="string"||!t||!r.lastWin?!1:(t===r.lastType||(q(r.lastWin.document),Ft(r.lastWin,t,"replace")),!0));T("dock:open-template",t=>typeof t!="string"||!t||!r.lastWin?!1:(Ds(r.lastWin,t),!0));T("dock:set-html",t=>{if(typeof t!="string"||ht())return!1;const e=g.html;if(!e||!r.lastWin)return!1;if(t===""){r.saveTimer&&(clearTimeout(r.saveTimer),r.saveTimer=null),r.twDirty=!1,r.twCss=null,r.twKey="",r.lastType=null,r.lastUid=null,r.lastParts={html:"",css:"",js:""},r.cssFull="",r.htmlFull="",r.applying=!0;try{De();for(const s of nt){const a=g[s];if(!a)continue;const i=a.state.doc.toString();i!==""&&a.dispatch({changes:{from:0,to:i.length,insert:""}})}}finally{r.applying=!1}return!0}const n=r.htmlFull;if(r.htmlFull=t,r.htmlScopeActive)return r.htmlFocus=du(r.htmlFocus,n,t),Pe(Rs()),J(r.lastWin),yn("dock:html-changed"),!0;const o=e.state.doc.toString();if(o!==t){const[s,a,i]=Os(o,t);e.dispatch({changes:{from:s,to:a,insert:i}})}return!0});T("dock:show-empty",()=>ot("dock:set-html",""));we("row:removed",({parentPath:t,remaining:e,win:n})=>{e===0&&t===Nt(n)&&ot("dock:show-empty")});function du(t,e,n){const o=n.length-e.length;if(!t||!o)return t;let s=0;for(;s<e.length&&s<n.length&&e[s]===n[s];)s+=1;return s>=t.to?t:s<t.from?{from:Math.max(0,t.from+o),to:Math.max(0,t.to+o)}:{from:t.from,to:Math.max(t.from,t.to+o)}}const At="__sve-data-menu";let xe=null;function W(t){const e=t?.getElementById(At);xe?.(),xe=null,e?._sveApp?.unmount(),e?.remove(),t?.querySelectorAll("[data-sve-data-vars][data-open], [data-sve-antlers-btn][data-open], [data-sve-visual-edit-btn][data-open]").forEach(n=>n.removeAttribute("data-open"))}function uu(t){if(!Ne(t))return{view:"",kind:""};const e=typeof V=="function"?V(t.document):[];for(const n of e){const o=ft(n.values)||n.values,s=typeof o?.source_collection=="string"?o.source_collection.trim():"";if(s)return{view:s,kind:String(o?.kind||"").trim()}}return{view:"",kind:""}}function fu(t,e){const n=Lt();if(Number.isFinite(e))return ao(n,e);const o=g.html;if(!o)return[];const s=r.htmlScopeActive&&r.htmlFocus?r.htmlFocus.from:0;return ao(n,s+o.state.selection.main.from)}function hu(t,e){const{view:n,kind:o}=uu(t);return{collection:vs(t)||"",set:ys(mt()),view:n,kind:o,scope:vi(fu(t,e))}}function pu(t){const e=typeof V=="function"?V(t.document):[];for(const n of e){const o=ft(n.values)||n.values;if(o&&typeof o=="object")return o}return null}function mu(t,e){return{scope:e?.scope?.groups||[],section:ks(e?.section||[],Ps(t)),page:ki(e?.page||[],pu(t)),site:e?.site||[]}}function gu(t){const e=t.state.selection.main,n=t.state.doc.lineAt(e.from),o=n.text.slice(0,e.from-n.from);return/(?:^|\s)(?::|x-bind:)[\w.:-]+\s*=\s*(["'])(?:(?!\1).)*$/.test(o)}function vu(t,e){const n=g.html;if(!n||n.state.readOnly)return;if(gu(n)){const c=String(t?.var||"").trim(),d=n.state.selection.main;n.dispatch({changes:{from:d.from,to:d.to,insert:c},selection:{anchor:d.from+c.length}}),I();return}const o=_i(t,e);if(!o)return;const s=n.state.selection.main,a=n.state.doc.lineAt(s.from),i=it(a.text),l=_n(o.text,i);n.dispatch({changes:{from:s.from,to:s.to,insert:l},selection:{anchor:s.from+o.cursor+(o.text.includes(`
`)?i.length:0)}}),I()}function Ht(t,e,n){const o=e.getBoundingClientRect(),s=8,a=n.offsetWidth||368,i=n.offsetHeight||240,l=t.innerHeight-o.bottom-s,c=o.top-s,d=l>=i||l>=c?o.bottom+4:o.top-i-4;n.style.left=`${Math.max(s,Math.min(o.left,t.innerWidth-a-s))}px`,n.style.top=`${Math.max(s,Math.min(d,t.innerHeight-i-s))}px`}function pa(t,e,n,o){const s=t.document;W(s),e.setAttribute("data-open","");const a=s.createElement("div");a.id=At,a.setAttribute("data-sve-data-menu",""),s.body.appendChild(a);const i=hu(t,o),l=p=>[p?.scope?.groups?.length?{id:"scope",label:p.scope.label||m(t,"data_vars_tab_loop")}:null,{id:"section",label:m(t,"data_vars_tab_section")},{id:"page",label:m(t,"data_vars_tab_page")},{id:"site",label:m(t,"data_vars_tab_site")}].filter(Boolean),c=p=>{s.getElementById(At)&&(a._sveApp?.unmount(),a._sveApp=z(as,a,{title:m(t,"data_vars_title"),placeholder:m(t,"data_vars_placeholder"),emptyText:m(t,"data_vars_empty"),noSectionText:m(t,"data_vars_no_section"),loopText:m(t,"data_vars_loop"),tabs:l(p),data:mu(t,p),onPick:(y,v)=>n?n(y,v):vu(y,v)}),Ht(t,e,a))};c(bs(Cn(i))||{scope:null,section:[],page:[],site:[]}),xs(t,i).then(c),Ht(t,e,a);const d=()=>Ht(t,e,a),f=p=>{!a.contains(p.target)&&!e.contains(p.target)&&W(s)},h=p=>{p.key==="Escape"&&W(s)};s.addEventListener("pointerdown",f,!0),s.addEventListener("keydown",h,!0),t.addEventListener("scroll",d,!0),t.addEventListener("resize",d),xe=()=>{s.removeEventListener("pointerdown",f,!0),s.removeEventListener("keydown",h,!0),t.removeEventListener("scroll",d,!0),t.removeEventListener("resize",d)}}function ma(t,e,{title:n,placeholder:o,tabs:s,data:a,onPick:i}){const l=t.document;W(l),S(l),e.setAttribute("data-open","");const c=l.createElement("div");c.id=At,c.setAttribute("data-sve-data-menu",""),l.body.appendChild(c),c._sveApp=z(as,c,{title:n,placeholder:o,emptyText:m(t,"data_vars_empty"),noSectionText:m(t,"data_vars_empty"),loopText:"",tabs:s,data:a,onPick:(d,f)=>{W(l),i(d,f)}}),Ht(t,e,c),yu(t,e,c)}function yu(t,e,n){const o=t.document,s=()=>Ht(t,e,n),a=l=>{!n.contains(l.target)&&!e.contains(l.target)&&W(o)},i=l=>{l.key==="Escape"&&W(o)};o.addEventListener("pointerdown",a,!0),o.addEventListener("keydown",i,!0),t.addEventListener("scroll",s,!0),t.addEventListener("resize",s),xe=()=>{o.removeEventListener("pointerdown",a,!0),o.removeEventListener("keydown",i,!0),t.removeEventListener("scroll",s,!0),t.removeEventListener("resize",s)}}const bu='<svg width="21" height="11" viewBox="0 0 150 77" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M69.999 55.827a13.8 13.8 0 0 0-.812-3.799 15.4 15.4 0 0 0-1.687-3.55 18.16 18.16 0 0 0-5.686-5.418 37.7 37.7 0 0 0 3.936-6.228 18.6 18.6 0 0 0 1.812-6.228 9.88 9.88 0 0 0-1.248-5.57 9.9 9.9 0 0 0-4.125-3.959 10.46 10.46 0 0 0-10.684 1.183 13.8 13.8 0 0 0-4.061 5.107 39 39 0 0 0-1.812 4.92 49.5 49.5 0 0 1-5.436-6.227 16.9 16.9 0 0 1-2.562-5.606 28.7 28.7 0 0 1-.624-6.85c.003-2-.357-3.983-1.063-5.855a10.66 10.66 0 0 0-4.56-5.231 13.9 13.9 0 0 0-10.684-1.37 10.13 10.13 0 0 0-4.94 2.755 10.1 10.1 0 0 0-2.683 4.967 24.4 24.4 0 0 0 0 10.214 22.4 22.4 0 0 0 3.374 7.35h-1.062a23 23 0 0 1-4.124 0 19.2 19.2 0 0 0-6.248 0 6.74 6.74 0 0 0-3.374 2.74 9.45 9.45 0 0 0-.75 9.341 11.23 11.23 0 0 0 5.811 6.228 25.1 25.1 0 0 0 10.622 1.495 17.9 17.9 0 0 0 9.809-3.425 104 104 0 0 1 10.496 7.162 22.4 22.4 0 0 1 5.249 6.54 15.5 15.5 0 0 1 1.437 5.106 35 35 0 0 0 1.437 6.789 13.2 13.2 0 0 0 4.373 5.73 15.6 15.6 0 0 0 10.372 2.802 9.9 9.9 0 0 0 5.429-1.987 9.84 9.84 0 0 0 3.38-4.677A61.6 61.6 0 0 0 70 55.827m-5.061 12.456a5.05 5.05 0 0 1-1.971 2.157 5.07 5.07 0 0 1-2.84.708 9.45 9.45 0 0 1-6.248-2.367 6.6 6.6 0 0 1-2.124-2.989 50 50 0 0 1-1.625-6.788 18.7 18.7 0 0 0-2.249-5.73 28.7 28.7 0 0 0-7.435-7.35A129 129 0 0 0 27.95 38.95c-.812-.498-2.686 0-2.749 0a14.03 14.03 0 0 1-7.872 1.62 19.5 19.5 0 0 1-7.935-2.056 4.86 4.86 0 0 1-2.375-2.49 3.35 3.35 0 0 1 0-2.99 1.18 1.18 0 0 1 .875-.748c1.25 0 2.687 0 3.936-.435a33 33 0 0 0 4.749-1.122 17.6 17.6 0 0 0 4.498-2.18 1.68 1.68 0 0 0 .838-1.68 1.7 1.7 0 0 0-.213-.624 2.2 2.2 0 0 0-.937-.747 18.65 18.65 0 0 1-2.812-7.35 19.5 19.5 0 0 1 .938-7.97 4.55 4.55 0 0 1 1.326-1.834 4.57 4.57 0 0 1 2.048-.97 7.52 7.52 0 0 1 5.498.997 5.12 5.12 0 0 1 2.499 3.488 87 87 0 0 0 1.874 10.587 22.4 22.4 0 0 0 4.436 6.789 78 78 0 0 0 8.372 7.286 1.8 1.8 0 0 0 1.188 1.246 2.005 2.005 0 0 0 2.499-1.308 33.4 33.4 0 0 1 3.249-6.54 8.8 8.8 0 0 1 2.811-2.677 4.63 4.63 0 0 1 4.561 0 4 4 0 0 1 1.612 1.494c.387.638.586 1.372.575 2.118a14.7 14.7 0 0 1-.75 5.792 36.6 36.6 0 0 1-2.561 6.228v.311a2.05 2.05 0 0 0 .5 2.74 13.6 13.6 0 0 1 3.248 4.92c.375.873.563 1.745.875 2.617s.937 2.678 1.312 4.048c1.625 5.916 2.5 7.536.875 10.961zM148.848 29.42a6.6 6.6 0 0 0-3.062-2.74 16.7 16.7 0 0 0-6.248 0c-1.227.09-2.459.09-3.686 0h-.937a24.2 24.2 0 0 0 3.186-7.536c.659-3.31.659-6.716 0-10.027a9.95 9.95 0 0 0-2.072-5.336 10 10 0 0 0-4.676-3.32 12.53 12.53 0 0 0-10.184 1.556 10.78 10.78 0 0 0-4.498 5.668 16.8 16.8 0 0 0-.875 5.667 32.7 32.7 0 0 1 0 6.602 17.2 17.2 0 0 1-2.499 5.543 52 52 0 0 1-4.748 5.792 32 32 0 0 0-1.5-4.547 14.4 14.4 0 0 0-3.811-5.231 9.522 9.522 0 0 0-10.56-.996 10.16 10.16 0 0 0-3.64 4.024 10.1 10.1 0 0 0-1.045 5.317c.21 2.156.78 4.26 1.687 6.228a38.3 38.3 0 0 0 3.748 6.228 17.5 17.5 0 0 0-5.435 5.668 15 15 0 0 0-1.562 3.55 18.3 18.3 0 0 0-.75 3.674v10.09c.068 1.417.32 2.82.75 4.172a9.46 9.46 0 0 0 3.062 4.609 9.5 9.5 0 0 0 5.123 2.118 14.1 14.1 0 0 0 9.871-2.927 12.76 12.76 0 0 0 4.124-5.792 34 34 0 0 0 1.562-6.727 17.6 17.6 0 0 1 1.375-5.107 21.1 21.1 0 0 1 4.623-6.228 83 83 0 0 1 8.935-7.349 16.34 16.34 0 0 0 8.997 3.301 22.24 22.24 0 0 0 9.746-1.557 10.777 10.777 0 0 0 5.499-6.228 9.88 9.88 0 0 0-.5-8.158m-5.623 6.229a4.43 4.43 0 0 1-2.062 2.553 16.16 16.16 0 0 1-7.06 2.18 11.7 11.7 0 0 1-7.123-1.869s-1.999-.81-2.812 0a123 123 0 0 0-11.558 7.038 26.9 26.9 0 0 0-6.811 7.224 79 79 0 0 0-3.623 12.456 6.23 6.23 0 0 1-2 3.052 7.88 7.88 0 0 1-5.373 2.305 4.63 4.63 0 0 1-2.523-.809 4.6 4.6 0 0 1-1.663-2.056 9.8 9.8 0 0 1-.812-3.488c.25-2.711.881-5.373 1.874-7.91.375-1.37.75-2.678 1.187-4.048s.438-1.806.812-2.616a13.26 13.26 0 0 1 2.937-5.044 2.054 2.054 0 0 0 .375-2.74 44 44 0 0 1-2.25-6.228 17.3 17.3 0 0 1-.687-5.792 4.22 4.22 0 0 1 1.937-3.675 3.57 3.57 0 0 1 3.811 0 8.3 8.3 0 0 1 2.625 2.678 40.5 40.5 0 0 1 3.061 6.228 1.93 1.93 0 0 0 1.664 1.441c.26.029.522.005.773-.07a1.82 1.82 0 0 0 1.187-1.309 80 80 0 0 0 7.872-7.411 22.5 22.5 0 0 0 3.999-6.664 75.4 75.4 0 0 0 1.749-10.525 5.17 5.17 0 0 1 1.937-3.176 5.76 5.76 0 0 1 4.749-.935 4.11 4.11 0 0 1 3.186 2.927c.751 2.609.985 5.338.687 8.035a19 19 0 0 1-2.561 7.473s-.625 0-.75.56a1.68 1.68 0 0 0 .5 2.367c1.27.908 2.657 1.641 4.123 2.18 1.468.49 2.972.865 4.499 1.121 1.125 0 2.374 0 3.561.436s.438.311.625.623c.235.52.351 1.087.341 1.657a3.9 3.9 0 0 1-.403 1.644z"/></svg>',xu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 9 5 12 1.8-5.2L21 14Z"/><path d="M7.2 2.2 8 5.1"/><path d="m5.1 8-2.9-.8"/><path d="M14 4.1 12 6"/><path d="m6 12-1.9 2"/></svg>';function ga(t,e,n,o,s){const a=t.document.createElement("button");return a.type="button",a.setAttribute(n,""),a.title=s,a.setAttribute("aria-label",s),a.innerHTML=`<span>${o}</span>`,a.addEventListener("mousedown",i=>i.preventDefault()),e.replaceChildren(a),a}function ku(t){return String(t||"").replace(/\|/g,"").split(`
`)[0].trim()}function _u(t,e){const n=e.querySelector("[data-sve-data-vars]");!n||n._sveBound||(n._sveBound=!0,n.addEventListener("mousedown",o=>o.preventDefault()),n.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),t.document.getElementById(At)){W(t.document);return}S(t.document),pa(t,n)}))}function Su(t,e){const n=e.querySelector("[data-sve-antlers-tools]");if(!n||n._sveBound)return;n._sveBound=!0;const o=ga(t,n,"data-sve-antlers-btn",bu,m(t,"code_dock_antlers"));o.addEventListener("click",s=>{if(s.preventDefault(),s.stopPropagation(),o.hasAttribute("data-open")){W(t.document);return}const a={};for(const i of ro)a[i.id]=Yr.filter(l=>l.group===i.id).map(l=>({id:l.id,var:l.label,value:l.inline?"":ku(l.snippet)}));ma(t,o,{title:m(t,"code_dock_antlers"),placeholder:m(t,"code_dock_antlers_search"),tabs:ro.map(i=>({id:i.id,label:m(t,i.lang)})),data:a,onPick:i=>wu(i.id)})})}function wu(t){const e=Jr(t),n=g.html;if(!e||!n||n.state.readOnly)return;const o=n.state.selection.main.head;if(e.inline){const c=e.snippet,d=n.state.selection.main;n.dispatch({changes:{from:d.from,to:d.to,insert:c},selection:{anchor:d.from+c.length}}),I();return}const s=n.state.doc.lineAt(o),a=s.text.trim()?it(s.text):He(n,s)||it(s.text),{text:i,cursor:l}=pe(e.snippet);Vt(_n(i,a),l),I()}function $u(t,e){const n=e.querySelector("[data-sve-visual-edit-tools]");if(!n||n._sveBound)return;n._sveBound=!0;const o=ga(t,n,"data-sve-visual-edit-btn",xu,m(t,"code_dock_visual_edit"));o.addEventListener("click",s=>{if(s.preventDefault(),s.stopPropagation(),o.hasAttribute("data-open")){W(t.document);return}const a={};for(const i of fo)a[i.id]=_s.filter(l=>l.group===i.id).map(l=>({id:l.id,var:l.label,value:l.attr?l.attr.replace(/\|/g,""):""}));ma(t,o,{title:m(t,"code_dock_visual_edit"),placeholder:m(t,"code_dock_visual_edit_search"),tabs:fo.map(i=>({id:i.id,label:m(t,i.lang)})),data:a,onPick:i=>Tu(i.id)})})}function Cu(t,e,n,o){if($i(n.inner,o.attr)){t.focus();return}const{text:s,cursor:a}=pe(o.attr);let i=n.closeIdx;for(;i>n.openIdx+2&&/\s/.test(e[i-1]);)i--;t.dispatch({changes:{from:i,to:n.closeIdx,insert:` ${s} `},selection:{anchor:i+1+a}}),I()}function Tu(t){const e=Si(t),n=g.html;if(!e||!n||n.state.readOnly)return;const o=n.state.doc.toString(),s=te();if(s?.open){const h=wi(o,s.open.from,s.open.to,ie);if(h){e.attr?Cu(n,o,h,e):(n.dispatch({selection:{anchor:h.openIdx+2+ie.length}}),n.focus());return}const p=s.open.from+1+s.name.length,y=e.standalone||`{{ ${ie} ${e.attr} }}`,{text:v,cursor:E}=pe(y);n.dispatch({changes:{from:p,to:p,insert:` ${v}`},selection:{anchor:p+1+E}}),I();return}const a=n.state.selection.main.head,i=n.state.doc.lineAt(a),l=i.text.trim()?it(i.text):He(n,i)||it(i.text),c=e.standalone||`{{ ${ie} ${e.attr} }}`,{text:d,cursor:f}=pe(c);Vt(_n(d,l),f),I()}function Au(t){return t==="css"?ja():t==="js"?Ha():za({autoCloseTags:!0})}function jo(t){if(t._sveShield)return;t._sveShield=!0;const e=n=>n.stopPropagation();for(const n of["keydown","keypress","keyup","pointerdown","pointerup","mousedown","mouseup","click","focusin"])t.addEventListener(n,e)}function Mu(t){try{return new URLSearchParams(t.defaultView?.location?.search||"").has("sve-panel")}catch{return!1}}function Eu(t){const e=parseInt(X(t,Na)??"",10);return Number.isFinite(e)&&e>=Ga?e:Gu}function Lu(t,e){N(t,Na,String(e))}function va(t){try{const e=JSON.parse(X(t,qa)||"null");if(e&&typeof e=="object")return{html:e.html!==!1,css:e.css!==!1,js:e.js===!0,alpine:e.alpine===!0}}catch{}return{html:!0,css:!0,js:!1,alpine:!1}}function Bu(t,e){N(t,qa,JSON.stringify(e))}function ya(t){try{const e=JSON.parse(X(t,Va)||"null");if(e&&typeof e=="object"){const n=s=>Number.isFinite(s)&&s>0?s:1,o={};for(const s of St)o[s]=n(e[s]);return o}}catch{}return Object.fromEntries(St.map(e=>[e,1]))}function Fu(t,e){N(t,Va,JSON.stringify(e))}function Iu(t){$r(t,Ku,`
@keyframes sve-cm-wait { to { transform: rotate(360deg); } }
#${u} {
  /* The tree's seven families, for the marks and the toolbar below. */
  ${Cr("dark")}
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
  ${oo("ns")}
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
#${At} {
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
  ${oo("ew")}
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
#${re} {
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
#${re} [data-sve-partial-choice] {
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
#${re} [data-sve-partial-choice]:hover {
  background: rgba(255,255,255,.1);
}
#${re} [data-sve-partial-empty] {
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
`)}function Ou(t){const e=t.querySelector(".live-preview-editor");if(!e)return 0;const n=e.getBoundingClientRect();return n.width<40||n.right<40?0:Math.round(n.right)}function Pu(t){let e=0;for(const n of["__sve-section-picker","__sve-outline-panel","__sve-html-tree-panel","__sve-listview-panel","__sve-right-dock","__sve-chrome-designs","__sve-global-section-panel","__sve-ai-panel"]){const o=t.getElementById(n);if(!o||o.hasAttribute("data-sve-chrome-hidden")||o.hasAttribute("data-sve-right-closed")||o.style.display==="none")continue;const s=o.getBoundingClientRect();s.width>40&&s.right>t.documentElement.clientWidth-8&&(e=Math.max(e,Math.round(s.width)))}return e}function Kn(t){const e=t.document;if(r.layoutWin=t,typeof t.ResizeObserver!="function")return;r.layoutObserver||(r.layoutObserver=new t.ResizeObserver(()=>{r.layoutWin&&nu(r.layoutWin)}));const n=e.querySelector(".live-preview-editor"),o=e.getElementById("__sve-right-dock");n!==r.observedEditor&&(r.observedEditor&&r.layoutObserver.unobserve(r.observedEditor),r.observedEditor=n,n&&r.layoutObserver.observe(n)),o!==r.observedRight&&(r.observedRight&&r.layoutObserver.unobserve(r.observedRight),r.observedRight=o,o&&r.layoutObserver.observe(o))}function Du(){r.layoutObserver?.disconnect(),r.layoutObserver=null,r.layoutWin=null,r.observedEditor=null,r.observedRight=null}function zu(t){r.layoutWatchBound||(r.layoutWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>Kn(t)))}function Gn(t,e){const n=t.querySelector(".live-preview-contents");n&&(n.style.paddingBottom=e?`${e}px`:"")}function Xn(t){if(!t)return;const e=t.clientHeight,n=t.querySelector("[data-sve-code-bar]"),o=t.querySelector("[data-sve-code-lock-banner]"),s=o&&ju(t)?.getComputedStyle(o).display!=="none"?o.offsetHeight:0,a=Math.max(64,e-(n?.offsetHeight||0)-s),i=t.querySelector("[data-sve-code-panes]");i&&(i.style.height=`${a}px`,i.style.minHeight="0",i.style.overflow="hidden"),t.querySelectorAll("[data-sve-code-host]").forEach(l=>{const c=l.closest("[data-sve-code-pane]");if(!c||c.style.display==="none")return;let d=0;for(const h of c.children)h!==l&&(d+=h.offsetHeight);const f=Math.max(64,a-d);l.style.height=`${f}px`,l.style.maxHeight=`${f}px`,l.style.minHeight="0",l.style.overflow="auto",Hu(l)})}function ju(t){return t.ownerDocument?.defaultView||r.lastWin}function Hu(t){t._sveWheelBound||(t._sveWheelBound=!0,t.addEventListener("wheel",e=>{const n=t.scrollHeight-t.clientHeight,o=t.scrollWidth-t.clientWidth;let s=!1;if(e.deltaY&&n>0){const a=Math.min(n,Math.max(0,t.scrollTop+e.deltaY));a!==t.scrollTop&&(t.scrollTop=a,s=!0)}if(e.deltaX&&o>0){const a=Math.min(o,Math.max(0,t.scrollLeft+e.deltaX));a!==t.scrollLeft&&(t.scrollLeft=a,s=!0)}s&&(e.preventDefault(),e.stopPropagation())},{passive:!1}))}function ba(){const t=(r.layoutWin||r.lastWin)?.document?.getElementById(u);t&&Xn(t);for(const e of nt)g[e]?.requestMeasure()}function xa(t,e){const n=va(t),o={};for(const s of St){const a=e.querySelector(`[data-sve-code-pane-btn="${s}"]`);o[s]=a?a.getAttribute("aria-pressed")==="true":n[s]}return o}function ka(t,e){for(const o of St){const s=t.querySelector(`[data-sve-code-pane-btn="${o}"]`),a=t.querySelector(`[data-sve-code-pane="${o}"]`);s&&s.setAttribute("aria-pressed",e[o]?"true":"false"),a&&(a.style.display=e[o]?"flex":"none")}const n=St.filter(o=>e[o]);t.querySelectorAll("[data-sve-code-split]").forEach(o=>{const s=o.getAttribute("data-sve-code-split-after"),a=n.indexOf(s);o.style.display=a>=0&&a<n.length-1?"block":"none"}),_a(t.ownerDocument.defaultView,t),Xn(t)}function _a(t,e){const n=ya(t);for(const o of St){const s=e.querySelector(`[data-sve-code-pane="${o}"]`);s&&(s.style.flex=`${n[o]} 1 0`)}}function Gt(t,e){if(r.dragging)return;const n=t.document;en(n,e);const o=Eu(t),s=Ou(n),a=Pu(n);e.style.left=`${s}px`,e.style.right=`${a}px`,e.style.bottom="0",e.style.height=`${o}px`,Gn(n,o),Xn(e)}function Sa(t,e,n,o){r.dragging=!0,Tr(t,e,n,()=>{r.dragging=!1,o?.()},"data-sve-code-drag-shield")}function Ru(t,e){if(e._sveResizeBound)return;e._sveResizeBound=!0;const n=o=>{if(o.button!==0||o.target.closest('button, a, input, select, textarea, label, [role="button"], [contenteditable], .cm-editor'))return;o.preventDefault();const s=o.clientY,a=e.getBoundingClientRect().height;let i=a;Sa(t,"ns-resize",l=>{i=Math.min(Math.max(Ga,a+(s-l.clientY)),Math.round(t.innerHeight*.7)),e.style.height=`${i}px`,Gn(t.document,i),ba()},()=>{Lu(t,i),Gt(t,e),t.dispatchEvent(new Event("resize"))})};e.querySelector("[data-sve-code-bar]")?.addEventListener("mousedown",n),e.querySelector("[data-sve-code-grip]")?.addEventListener("mousedown",n)}function Wu(t,e){e._sveSplitBound||(e._sveSplitBound=!0,e.querySelectorAll("[data-sve-code-split]").forEach(n=>{n.addEventListener("mousedown",o=>{if(o.button!==0)return;o.preventDefault(),o.stopPropagation();const s=n.getAttribute("data-sve-code-split-after"),a=St.filter(E=>xa(t,e)[E]),i=a.indexOf(s),l=a[i],c=a[i+1];if(!l||!c)return;const d=e.querySelector(`[data-sve-code-pane="${l}"]`),f=e.querySelector(`[data-sve-code-pane="${c}"]`),h=o.clientX,p=d.getBoundingClientRect().width,y=f.getBoundingClientRect().width,v=p+y;n.setAttribute("data-active",""),Sa(t,"col-resize",E=>{const Ot=E.clientX-h;let Ve=Math.max(tn,Math.min(v-tn,p+Ot)),Yn=v-Ve;v<tn*2&&(Ve=p,Yn=y);const Ue=ya(t);Ue[l]=Ve,Ue[c]=Yn,Fu(t,Ue),_a(t,e),ba()},()=>{n.removeAttribute("data-active")})})}))}function Nu(t,e){e._svePaneBound||(e._svePaneBound=!0,e.querySelectorAll("[data-sve-code-pane-btn]").forEach(n=>{n.addEventListener("click",o=>{o.stopPropagation();const s=n.getAttribute("data-sve-code-pane-btn"),a=xa(t,e),i={...a,[s]:!a[s]};!i.html&&!i.css&&!i.js&&(i[s]=!0),Bu(t,i),ka(e,i)})}))}function O(t,e){const n=t.getElementById(u)?.querySelector("[data-sve-code-status]");n&&(n.textContent=e||"")}function wa(t,e){const n=t.getElementById(u)?.querySelector("[data-sve-code-path]");n&&(n.textContent=e||"",n.title=e||"")}function Xt(t){const e=t?.document?.getElementById(u)?.querySelector("[data-sve-code-back]");e&&(e.hidden=r.typeStack.length===0,e.title=m(t,"code_dock_back"),e.setAttribute("aria-label",e.title),e.innerHTML=Ju)}function Ho(t,e){const n=e.querySelector("[data-sve-code-back]");!n||n._sveBound||(n._sveBound=!0,n.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),zs(t)}))}let P,fn,$a,Ca,Ta,yt,ke,gt,It,vt,lt,Aa,Ma,Ea,La,Ba,Fa,Ia,Oa,Pa,Da,_e,za,ja,Ha,Ra,hn,pn,Wa,qu,Dt=null,C=null;function Vu(){return Dt||(Dt=er().then(t=>{C=t,P=C.view.EditorView,fn=C.view.keymap,$a=C.view.lineNumbers,Ca=C.view.highlightActiveLine,Ta=C.view.highlightActiveLineGutter,yt=C.state.Compartment,ke=C.state.EditorState,gt=C.state.StateField,It=C.state.StateEffect,vt=C.state.RangeSetBuilder,lt=C.view.Decoration,Aa=C.commands.defaultKeymap,Ma=C.commands.indentWithTab,Ea=C.commands.historyKeymap,La=C.commands.history,Ba=C.autocomplete.autocompletion,Fa=C.autocomplete.closeBrackets,Ia=C.autocomplete.closeBracketsKeymap,Oa=C.autocomplete.closeCompletion,Pa=C.autocomplete.completionKeymap,Da=C.view.hoverTooltip,_e=C.langHtml.htmlLanguage,za=C.langHtml.html,ja=C.langCss.css,Ha=C.langJs.javascript,C.language.HighlightStyle,C.language.syntaxHighlighting,Ra=C.language.codeFolding,hn=C.language.foldEffect,pn=C.language.unfoldEffect,Wa=C.language.foldedRanges,qu=C.highlight.tags,Rt.html=new yt,Rt.css=new yt,Rt.js=new yt,Wt.html=new yt,Wt.css=new yt,Wt.js=new yt}).catch(t=>{throw Dt=null,t}),Dt)}const Uu="{{ _class }}",u=Qa,Ku="__sve-code-dock-style",K="__sve-code-dock-unlock",Na="sve-code-dock-height",qa="sve-code-dock-panes",Va="sve-code-dock-widths",qe="sve-html-scope-v2",Ua="sve-code-dock-autosave",Ka="sve-code-dock-style-mode",Zn="sve-code-dock-values",Gu=280,Ga=120,tn=140,Xu=250,nt=["html","css","js"],St=["html","css","alpine","js"],Zu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',Yu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-1"/></svg>',Ju='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',Xa='<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1c0 .966.784 1.75 1.75 1.75h.418A1.74 1.74 0 0 0 4 7.25v1.5c0 .49.201.932.525 1.25c-.324.318-.525.76-.525 1.25v1c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 14 12.25v-1c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1.5c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1A1.75 1.75 0 0 0 12.25 2zm8.5 7.5H8v-3h4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75M7 6.5v3H5.75A.75.75 0 0 1 5 8.75v-1.5a.75.75 0 0 1 .75-.75zm1 4h4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75H8zm-1 0V13H5.75a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-1-5V3h6.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75zm-1 0H3.75A.75.75 0 0 1 3 4.75v-1A.75.75 0 0 1 3.75 3H5z"/></svg>',Qu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/><path d="M4.5 11.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/></svg>',tf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 16.3A8.5 8.5 0 1 1 18.3 6.3"/><path d="M21 3.2v5.4h-5.4"/></svg>',ef='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',nf='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',x="__sve-css-menu",Za=["h1","h2","h3","h4","h5","h6"],mn=[{id:"section",title:"section",tag:"section"},{id:"div",title:"div",tag:"div"},{id:"heading",title:"heading",menu:"heading"},{id:"text",title:"text",menu:"text"},{id:"a",title:"link",tag:"a"},{id:"img",title:"image",snippet:'<img src="" alt="">',caret:10},{id:"video",title:"video",snippet:'<video src="" controls playsinline></video>',caret:12},{id:"ul",title:"list",tag:"ul"},{id:"li",title:"list item",tag:"li"},{id:"component",title:"component",menu:"component"},{id:"loop",title:"loop",snippet:`{{ items }}

{{ /items }}
`,caret:3,select:5},{id:"if",title:"if",snippet:`{{ if true }}

{{ /if }}
`,caret:6,select:4}],of=["--size-100","--size-200","--size-300","--size-400","--size-500","--size-600","--size-700","--size-800","--size-900","--gutter"],sf={"tw-text":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 13 5 3l3.5 10M2.7 10h4.6"/><path d="M12.5 3.5v9M11 5l1.5-1.5L14 5M11 11l1.5 1.5L14 11"/></svg>',"tw-leading":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h8.5M6 8h8.5M6 12.5h8.5"/><path d="M2.5 4.5v7M1.4 5.6 2.5 4.5l1.1 1.1M1.4 10.4l1.1 1.1 1.1-1.1"/></svg>',"tw-font":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.2V3h10v1.2M8 3v10M6 13h4"/></svg>',"tw-radius":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 13.5v-6a5 5 0 0 1 5-5h6"/><path d="M13.5 6.5v7h-7" stroke-dasharray="2 2"/></svg>',"tw-gap":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"tw-align":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3.5h12M2 8h8M2 12.5h10"/></svg>',"tw-w":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3.5v9M14 3.5v9"/><path d="M4.5 8h7"/><path d="M6 6.2 4.2 8 6 9.8M10 6.2 11.8 8 10 9.8"/></svg>',"tw-h":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 2h9M3.5 14h9"/><path d="M8 4.5v7"/><path d="M6.2 6 8 4.2 9.8 6M6.2 10 8 11.8 9.8 10"/></svg>',"tw-maxw":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3v10M14.5 3v10"/><path d="M5 8h6"/><path d="M6.6 6.2 4.8 8l1.8 1.8M9.4 6.2 11.2 8l-1.8 1.8"/></svg>',"tw-overflow":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="1.8" y="4.5" width="8.6" height="9.7" rx="1.2"/><path d="M6.5 1.8h7.7v7.7" stroke-linecap="round"/></svg>',"tw-border":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6"/><rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" stroke-width="1" opacity=".45"/></svg>'},af='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="10" width="18" height="11" rx="2"/><rect x="6" y="3" width="9" height="4" rx="1.4" fill="currentColor" stroke="none"/></svg>',rf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.1 12a8.9 8.9 0 1 0 2.8-6.5L3 8"/><path d="M3 3.4V8h4.6"/><path d="M12 7.4V12l3 1.8"/></svg>',lf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>',cf='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></svg>',df='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/><path d="M3 17c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/></svg>',Ya=[["--gray-50","#fafafa"],["--gray-100","#f5f5f5"],["--gray-200","#e5e5e5"],["--gray-300","#d4d4d4"],["--gray-400","#a3a3a3"],["--gray-500","#737373"],["--gray-600","#525252"],["--gray-700","#404040"],["--gray-800","#262626"],["--gray-900","#171717"],["--gray-950","#0a0a0a"]],Ro=t=>[{id:`${t}-all`,icon:"box-all",title:"All sides",css:t,tw:t,menu:"spacing"},{id:`${t}-block`,icon:"box-block",title:"Top and bottom",css:`${t}-block`,tw:`${t}-block`,menu:"spacing",sep:!0},{id:`${t}-block-start`,icon:"box-block-start",title:"Top",css:`${t}-block-start`,tw:`${t}-top`,menu:"spacing"},{id:`${t}-block-end`,icon:"box-block-end",title:"Bottom",css:`${t}-block-end`,tw:`${t}-bottom`,menu:"spacing"},{id:`${t}-inline`,icon:"box-inline",title:"Left and right",css:`${t}-inline`,tw:`${t}-inline`,menu:"spacing",sep:!0},{id:`${t}-inline-start`,icon:"box-inline-start",title:"Left",css:`${t}-inline-start`,tw:`${t}-left`,menu:"spacing"},{id:`${t}-inline-end`,icon:"box-inline-end",title:"Right",css:`${t}-inline-end`,tw:`${t}-right`,menu:"spacing"}],uf=[{id:"display-flex",twClass:"flex",icon:"display-flex",title:"Flex",kind:"display",value:"flex",css:"display"},{id:"flex-row",twClass:"flex-row",icon:"flex-row",title:"Direction: row",kind:"flexDir",value:"row",css:"flex-direction",sep:!0},{id:"flex-col",twClass:"flex-col",icon:"flex-col",title:"Direction: column",kind:"flexDir",value:"column",css:"flex-direction"},{id:"justify-start",twClass:"justify-start",icon:"justify-start",title:"Justify: start",css:"justify-content",value:"flex-start",when:"flex",sep:!0},{id:"justify-center",twClass:"justify-center",icon:"justify-center",title:"Justify: center",css:"justify-content",value:"center",when:"flex"},{id:"justify-end",twClass:"justify-end",icon:"justify-end",title:"Justify: end",css:"justify-content",value:"flex-end",when:"flex"},{id:"justify-between",twClass:"justify-between",icon:"justify-between",title:"Justify: between",css:"justify-content",value:"space-between",when:"flex"},{id:"justify-around",twClass:"justify-around",icon:"justify-around",title:"Justify: around",css:"justify-content",value:"space-around",when:"flex"},{id:"align-start",twClass:"items-start",icon:"align-start",title:"Align: start",css:"align-items",value:"flex-start",when:"flex",sep:!0},{id:"align-center",twClass:"items-center",icon:"align-center",title:"Align: center",css:"align-items",value:"center",when:"flex"},{id:"align-end",twClass:"items-end",icon:"align-end",title:"Align: end",css:"align-items",value:"flex-end",when:"flex"},{id:"align-stretch",twClass:"items-stretch",icon:"align-stretch",title:"Align: stretch",css:"align-items",value:"stretch",when:"flex"}],ff=[{id:"gap-all",icon:"gap-all",title:"Both",css:"gap",tw:"gap",menu:"spacing"},{id:"gap-row",icon:"gap-row",title:"Between rows",css:"row-gap",tw:"row-gap",menu:"spacing",sep:!0},{id:"gap-col",icon:"gap-col",title:"Between columns",css:"column-gap",tw:"column-gap",menu:"spacing"}],hf=[{id:"bd-all",icon:"bd-all",title:"All sides",css:"border-color",tw:"border-color",menu:"colors"},{id:"bd-block",icon:"bd-block",title:"Top and bottom",css:"border-block-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-top",icon:"bd-top",title:"Top",css:"border-block-start-color",tw:"border-top-color",menu:"colors"},{id:"bd-bottom",icon:"bd-bottom",title:"Bottom",css:"border-block-end-color",tw:"border-bottom-color",menu:"colors"},{id:"bd-inline",icon:"bd-inline",title:"Left and right",css:"border-inline-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-left",icon:"bd-left",title:"Left",css:"border-inline-start-color",tw:"border-left-color",menu:"colors"},{id:"bd-right",icon:"bd-right",title:"Right",css:"border-inline-end-color",tw:"border-right-color",menu:"colors"}],pf=[{id:"rd-all",icon:"rd-all",title:"All corners",css:"border-radius",tw:"border-radius",menu:"values"},{id:"rd-tl",icon:"rd-tl",title:"Top left",css:"border-start-start-radius",tw:"border-top-left-radius",menu:"values",sep:!0},{id:"rd-tr",icon:"rd-tr",title:"Top right",css:"border-start-end-radius",tw:"border-top-right-radius",menu:"values"},{id:"rd-br",icon:"rd-br",title:"Bottom right",css:"border-end-end-radius",tw:"border-bottom-right-radius",menu:"values"},{id:"rd-bl",icon:"rd-bl",title:"Bottom left",css:"border-end-start-radius",tw:"border-bottom-left-radius",menu:"values"}],Ja=[{id:"display",title:"Display",css:"display",tw:"display",kids:uf},{id:"absolute",title:"Position",css:"position",tw:"position",value:"absolute"},{id:"color",title:"Text color",css:"color",tw:"color",menu:"colors"},{id:"bg",title:"Background color",css:"background-color",tw:"background-color",menu:"colors"},{id:"padding",title:"Padding",css:"padding",tw:"padding",kids:Ro("padding")},{id:"margin",title:"Margin",css:"margin",tw:"margin",kids:Ro("margin")},{id:"tw-text",title:"Font size",css:"font-size",tw:"font-size",menu:"values"},{id:"tw-leading",title:"Line height",css:"line-height",tw:"line-height",menu:"values"},{id:"tw-font",title:"Font family",css:"font-family",tw:"font-family",menu:"values"},{id:"tw-align",title:"Text align",css:"text-align",tw:"text-align",menu:"choices",choices:["left","center","right","justify"]},{id:"tw-border",title:"Border color",css:"border-color",tw:"border-color",kids:hf},{id:"tw-radius",title:"Radius",css:"border-radius",tw:"border-radius",kids:pf},{id:"tw-gap",title:"Gap",css:"gap",tw:"gap",kids:ff},{id:"tw-w",title:"Width",css:"width",tw:"width",menu:"sizes"},{id:"tw-h",title:"Height",css:"height",tw:"height",menu:"sizes"},{id:"tw-maxw",title:"Max width",css:"max-width",tw:"max-width",menu:"sizes"},{id:"tw-overflow",title:"Overflow",css:"overflow",tw:"overflow",menu:"choices",choices:["visible","hidden","clip","auto","scroll"]}],mf=["100%","auto","fit-content","min-content","max-content","100vw","100dvh","0"],Se=new Map;for(const t of Ja){Se.set(t.id,{tool:t,kid:null});for(const e of t.kids||[])Se.set(e.id,{tool:t,kid:e})}const Wo={display:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2.5" width="13" height="11" rx="1.2"/><path d="M5 6.5h6M5 9.5h4"/></svg>',"display-flex":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="3.4" height="9" rx=".4"/><rect x="6.3" y="3.5" width="3.4" height="9" rx=".4"/><rect x="10.6" y="3.5" width="3.4" height="9" rx=".4"/></svg>',"flex-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12"/><path d="M4.2 5.8 2 8l2.2 2.2"/><path d="M11.8 5.8 14 8l-2.2 2.2"/></svg>',"flex-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v12"/><path d="M5.8 4.2 8 2l2.2 2.2"/><path d="M5.8 11.8 8 14l2.2-2.2"/></svg>',"justify-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="5.4" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4.6" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="8.2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-between":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-around":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"align-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="5.4" width="9" height="2.4" rx=".4"/></svg>',"align-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="4.6" width="9" height="2.4" rx=".4"/><rect x="3.5" y="9" width="9" height="2.4" rx=".4"/></svg>',"align-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="8.2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="11.6" width="9" height="2.4" rx=".4"/></svg>',"align-stretch":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx=".5"/><rect x="9" y="2" width="4" height="12" rx=".5"/></svg>',absolute:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>',color:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.4 11.2 7.4 2.4l4 8.8"/><path d="M4.7 8.4h5.4"/><rect x="1.6" y="12.8" width="12.8" height="2.2" rx=".6" fill="currentColor" stroke="none"/></svg>',bg:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 1.9a6.1 6.1 0 1 0 0 12.2c.85 0 1.35-.55 1.35-1.25 0-.38-.18-.66-.4-.88a1.2 1.2 0 0 1 .85-2.05h1.3A3.5 3.5 0 0 0 14.1 6.1C14.1 3.75 11.4 1.9 8 1.9Z"/><circle cx="4.9" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="8" cy="4.8" r=".95" fill="currentColor" stroke="none"/><circle cx="11.1" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="4.7" cy="9.9" r=".95" fill="currentColor" stroke="none"/></svg>',padding:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/></svg>',margin:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/><path d="M2 2.5h12M2 13.5h12M2.5 2v12M13.5 2v12" stroke-dasharray="1.4 1.2"/></svg>',"box-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".4" fill="currentColor" stroke="none"/></svg>',"box-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"gap-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"gap-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="3" y="1.6" width="10" height="4.2" rx=".6"/><rect x="3" y="10.2" width="10" height="4.2" rx=".6"/><path d="M4.5 8h7"/></svg>',"gap-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"bd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4"/></svg>',"bd-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-top":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-bottom":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-left":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-right":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"rd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="3.4"/></svg>',"rd-tl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6H6a3.4 3.4 0 0 0-3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M2.6 9V6A3.4 3.4 0 0 1 6 2.6h3" stroke-width="2.2"/></svg>',"rd-tr":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6h7.4a3.4 3.4 0 0 1 3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M7 2.6h3A3.4 3.4 0 0 1 13.4 6v3" stroke-width="2.2"/></svg>',"rd-br":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6v7.4a3.4 3.4 0 0 1-3.4 3.4H2.6" stroke-width="1" opacity=".35"/><path d="M13.4 7v3a3.4 3.4 0 0 1-3.4 3.4H7" stroke-width="2.2"/></svg>',"rd-bl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6v7.4a3.4 3.4 0 0 0 3.4 3.4h7.4" stroke-width="1" opacity=".35"/><path d="M2.6 7v3A3.4 3.4 0 0 0 6 13.4h3" stroke-width="2.2"/></svg>'},g={html:null,css:null,js:null},Rt={html:null,css:null,js:null},Wt={html:null,css:null,js:null};export{zf as ARMED_KEY,tf as AUTOSAVE_ICON,Ua as AUTOSAVE_KEY,Ju as BACK_ICON,nf as CSS_ADD_ICON,Ya as CSS_GRAYS,mf as CSS_LENGTHS,x as CSS_MENU_ID,lf as CSS_MODE_ICON,qn as CSS_SIZE_KEY,of as CSS_SPACING,Vn as CSS_STATES,un as CSS_STATE_KEY,Ja as CSS_TOOLS,Wo as CSS_TOOL_ICONS,Se as CSS_TOOL_INDEX,Qu as DATA_ICON,At as DATA_MENU_ID,Gu as DEFAULT_HEIGHT,u as DOCK_ID,lt as Decoration,ke as EditorState,P as EditorView,nt as HANDLES,Na as HEIGHT_KEY,rf as HISTORY_ICON,Za as HTML_HEADINGS,mn as HTML_TOOLS,cf as ID_MODE_ICON,Zu as LOCK_CLOSED_ICON,Yu as LOCK_OPEN_ICON,Ga as MIN_HEIGHT,tn as MIN_PANE,St as PANES,qa as PANES_KEY,vt as RangeSetBuilder,ef as SAVE_ICON,Xu as SAVE_MS,Uu as SCOPE_CLASS,Xa as SCOPE_ICON,qe as SCOPE_KEY,af as STRIP_ICON,Ku as STYLE_ID,Ka as STYLE_MODE_KEY,It as StateEffect,gt as StateField,df as TW_MODE_ICON,sf as TW_TOOL_ICONS,K as UNLOCK_ID,Zn as VALUES_MODE_KEY,Va as WIDTHS_KEY,oe as applyCssFolds,Qt as applyCssScope,Tc as applyDisplay,Cc as applyFlexDirection,Ks as applyHtmlTag,G as applyRuleDecls,da as applyStyleMode,Ba as autocompletion,Fn as autosaveEnabled,Su as bindAntlersSnippets,bo as bindAutosave,Ho as bindBack,xc as bindCssAddClass,Gd as bindCssTools,_u as bindDataVars,Rd as bindHistory,xo as bindHtmlScope,Zd as bindHtmlTidy,Yd as bindHtmlTools,zu as bindLayoutWatch,yo as bindLock,Nu as bindPaneToggles,Ru as bindResize,Wu as bindSplitters,Hd as bindStrip,Kd as bindStyleMode,$u as bindVisualEditSnippets,De as clearHtmlScopeRange,Fa as closeBrackets,Ia as closeBracketsKeymap,ha as closeCodeDock,Ff as closeCodeDockPopups,Oa as closeCompletion,S as closeCssMenu,W as closeDataMenu,C as cm,If as codeDockStyleMode,Ra as codeFolding,Ne as collectionViewType,Pa as completionKeymap,ja as css,Gs as cssEditorText,je as cssRuleAtCursor,ra as cssSizeRow,pt as cssSizeRows,We as cssStateSuffix,Z as currentFlexDecls,Lt as currentFullHtml,Ps as currentSectionValues,mt as currentTemplateType,Aa as defaultKeymap,bt as dispatchHtmlChanges,Wt as editableOf,g as editors,Iu as ensureStyle,Fs as ensureTwCss,ca as enterValuesRule,I as finishHtmlEdit,ac as flushBracketSync,ct as flushCssScope,rc as flushCssToHtml,q as flushSave,hn as foldEffect,Wa as foldedRanges,zs as goBackTemplate,Ca as highlightActiveLine,Ta as highlightActiveLineGutter,La as history,Ea as historyKeymap,Da as hoverTooltip,za as html,Rs as htmlEditorText,te as htmlElementAtCursor,Be as htmlFocusOk,_e as htmlLanguage,Jt as htmlScopeEnabled,wt as htmlTargetFromCursor,gu as inDynamicAttribute,He as indentFromPrevious,Ma as indentWithTab,Qd as insertAiSnippet,Vs as insertHtmlElement,Vt as insertHtmlSnippet,Bs as isChromeTemplateType,br as isCodeDockArmed,ht as isCodeDockLocked,fa as isCodeDockOpen,Mu as isPanelFrame,Ha as javascript,fn as keymap,Au as languageOf,xt as leadingCssIndent,it as lineIndentOf,$a as lineNumbers,Vu as loadCm,Ft as loadTemplate,Ed as mountEditor,ia as newSizeBlockSpot,dn as newSizeQuery,F as normalizeFlexValue,Kn as observeDockLayout,J as onEditorInput,Lc as openCssChoiceMenu,Ec as openCssColorMenu,Bc as openCssSpacingMenu,Ao as openCssValueMenu,pa as openDataVarsMenu,yc as openHtmlComponentMenu,wo as openHtmlTagMenu,Ds as openNestedTemplate,ma as openPickerMenu,lc as openRenameClassMenu,Re as paintAlpine,rt as paintAutosave,Xt as paintBack,_t as paintCssHead,Rn as paintCssIdMark,B as paintCssToolState,Ld as paintHostWait,U as paintHtmlScope,ze as paintHtmlToolState,Tt as paintLock,ka as paintPaneButtons,Kt as paintStrip,Nn as paintStyleMode,Wn as paintValuesMode,D as placeCssMenu,Gt as placeDock,Gn as previewBottomPad,oc as primeTailwindCompile,Rt as readOnlyOf,zn as readParts,eu as refreshCodeDockFromDisk,ye as refreshPreview,nu as relayoutCodeDock,Ie as rememberBracketNames,Bt as rememberCssSelectors,nc as resetTailwindCompile,jn as sameParts,jf as setCodeDockArmed,wa as setPath,O as setStatus,Nd as setValuesMode,jo as shieldDock,Dn as showHtmlFull,Pn as showHtmlScope,Du as stopObservingDockLayout,va as storedPanes,Of as syncCodeDock,on as syncHtmlTree,Fe as syncScopedHtml,se as syncTwTarget,qu as tags,yr as templateDockAllowed,Us as tidyHtmlPane,pn as unfoldEffect,Oe as writeHandleEditor,Pe as writeHtmlEditor,ee as writeParts};
