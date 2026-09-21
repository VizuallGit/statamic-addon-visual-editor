const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-CV7No16T.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{o as x,a as k,b as g,t as A,F as D,d as U,k as ut,c as jt,l as En,p as Je,w as Bn,q as Bt,s as I,v as Ln,g as j,x as Ir,y as St,z as Fn,A as $e,f as In,r as po,u as T,B as Ve,_ as On,n as Or,D as tt,E as K,h as m,j as Pr,C as Dr,i as Pn,G as zr,H as Vo,I as Hr,J as G,K as pt,L as Uo,M as Rr,m as q,O as mo,P as Dn,Q as jr,R as Nr,S as zn,T as go,U as Wr,V as $t,W as vo,X as qr,Y as Vr,Z as Ur,$ as Kr,a0 as Gr,a1 as Xr,a2 as Zr,a3 as Yr,a4 as Ko,a5 as Ue,a6 as Kt,a7 as Jr,a8 as Qr,a9 as ta,aa as Qe,ab as ea,ac as oa,ad as na,ae as sa,af as E,ag as ra,ah as aa,ai as Go,aj as ia,ak as la}from"./addon-DVvKiw7p.js";import{al as mf,am as gf}from"./addon-DVvKiw7p.js";import{v as ca,l as da}from"./codemirror-DEdF4BqV.js";import{p as Ce,f as Hn,h as ua,t as Rn,c as fa,a as jn,b as ha,d as pa,e as ma,g as ga,i as Xo,j as va,k as ya,l as Nn,m as ba,n as xa,o as ka,q as Sa,s as wa,r as Wn,u as _a,v as to,w as $a,H as qn,x as Ca,y as Ta,z as Vn,A as Aa,B as Ma,C as Zo,P as de}from"./tw-classes-BrzNni6o.js";import{t as Ea}from"./tw-candidates-wYTeDvRv.js";import{h as Ba,a as La,e as Fa,A as Ia,b as Oa,c as Pa,d as ve,i as yo}from"./html-tag-sync-D4MA50-d.js";import{M as Un,S as Kn}from"./protocol-D3FYhCm9.js";import"./ai-text-icon-B7uCWIwa.js";import"./index-Dpuj8sxX.js";import"./index-B5fiB6ig.js";import"./index-QkwZ_wP2.js";import"./index-CY0AOW5Y.js";import"./index-gYg9gdv3.js";import"./index-lzvKgifK.js";import"./index-BBw1nzv2.js";import"./index-DqbOpr3Y.js";import"./index-C_pm8ee_.js";import"./index-B8kpdD8S.js";const Gn=/^\.[a-zA-Z_][\w-]*$/;function bo(t){const e=String(t||""),o=/(^|\s)\[/g;let n;for(;n=o.exec(e);){const s=n.index+n[1].length,r=/\](?=\s|$)/g;r.lastIndex=s+1;const i=r.exec(e);if(i)return{from:s,to:i.index+1,innerFrom:s+1,innerTo:i.index}}return null}function Xn(t){const e=String(t||""),o=bo(e);return o?e.slice(o.innerFrom,o.innerTo).replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).filter(n=>/^[a-zA-Z_][\w-]*$/.test(n)):[]}function Zn(t){const e=String(t||"").match(/\sclass\s*=\s*(["'])([^"']*)\1/i);return e?Xn(e[2]):[]}function Da(t){return Zn(t)[0]||""}function Te(t){const e=String(t||""),o=[],n=/\sclass\s*=\s*(["'])/gi;let s;for(;s=n.exec(e);){const r=s[1],i=s.index+s[0].length,l=e.indexOf(r,i);if(l===-1)break;const c=e.slice(i,l),d=bo(c);if(d){const h=c.slice(d.innerFrom,d.innerTo),f=i+d.innerFrom,p=h.replace(/\{\{[\s\S]*?\}\}/g,B=>" ".repeat(B.length)),y=/[a-zA-Z_][\w-]*/g;let b;for(;b=y.exec(p);)o.push({name:b[0],from:f+b.index,to:f+b.index+b[0].length})}n.lastIndex=l+1}return o}function Yo(t,e){return Te(t).find(o=>e>=o.from&&e<=o.to)||null}function Jo(t,e){const o=String(t||""),n=Te(o);let s=o;for(let r=n.length-1;r>=0;r-=1){const i=n[r],l=e(i.name);if(l!==i.name){if(!l){let c=i.from,d=i.to;s[d]===" "?d+=1:c>0&&s[c-1]===" "&&(c-=1),s=s.slice(0,c)+s.slice(d);continue}s=s.slice(0,i.from)+l+s.slice(i.to)}}return s}function Yn(t){const e=[],o=/(^|[^\w-])\.([a-zA-Z_][\w-]*)\s*\{/g;let n;for(;n=o.exec(String(t||""));)e.push(n[2]);return e}function Jn(t,e){const o=[],n=[],s=[];let r=0,i=0;for(;r<t.length&&i<e.length;){if(t[r]===e[i]){r+=1,i+=1;continue}const l=e.indexOf(t[r],i),c=t.indexOf(e[i],r);l===-1&&c===-1?(o.push({from:t[r],to:e[i]}),r+=1,i+=1):l===-1?(s.push(t[r]),r+=1):c===-1||l<=c?(n.push(e[i]),i+=1):(s.push(t[r]),r+=1)}for(;r<t.length;)s.push(t[r]),r+=1;for(;i<e.length;)n.push(e[i]),i+=1;return{renamed:o,added:n,removed:s}}function wt(t){let e=String(t||"").trim().replace(/^\.+/,"").replace(/\s+/g,"-").replace(/[^a-zA-Z0-9_-]/g,"");return/^[a-zA-Z_]/.test(e)||(e=e.replace(/^[^a-zA-Z_]+/,"")),Gn.test(`.${e}`)?e:""}function za(t,e){const o=String(t||""),n=wt(e);if(!o||!n)return o;const s=o.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(s){const r=s[1];let i=s[2];const l=bo(i);if(l){const c=i.slice(l.innerFrom,l.innerTo).trim(),h=Xn(i).includes(n)?c:`${c} ${n}`.trim();i=`${i.slice(0,l.from)}[ ${h} ]${i.slice(l.to)}`}else i=`[ ${n} ] ${i}`.trim();return o.slice(0,s.index)+` class=${r}${i}${r}`+o.slice(s.index+s[0].length)}return/\/\s*>$/.test(o)?o.replace(/(\s*)(\/\s*>)$/,` class="[ ${n} ]"$1$2`):o.replace(/(\s*)>$/,` class="[ ${n} ]"$1>`)}function Ha(t,e){const o=String(t).indexOf(">",e.from);return o===-1?"":t.slice(e.from,o+1)}function Qn(t,e){const o=[];for(const n of e){const s=Zn(Ha(t,n)),r=Qn(t,n.children||[]);if(s.length){o.push({className:s[0],children:r});for(const i of s.slice(1))o.push({className:i,children:[]})}else o.push(...r)}return o}function Ae(t){return Qn(t,Ce(t))}function ye(t){return String(t).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function xo(t,e){if(t.startsWith("/*",e)){const o=t.indexOf("*/",e+2);return o===-1?t.length:o+2}return e}function Pt(t,e){let o=0;for(let n=e;n<t.length;n+=1){if(t.startsWith("/*",n)){n=xo(t,n)-1;continue}if(t[n]==="{")o+=1;else if(t[n]==="}"&&(o-=1,o===0))return n}return-1}function Y(t,e){const o=String(t||""),n=new RegExp(`(^|[^\\w-])\\.${ye(e)}\\s*\\{`,"g");let s;for(;s=n.exec(o);){const r=s.index+s[1].length,i=o.indexOf("{",r);if(i===-1)continue;const l=Pt(o,i);if(l!==-1)return{from:r,brace:i,close:l,to:l+1,name:e}}return null}function Ra(t){const e=String(t||""),o=[],n={},s=[];let r=0,i="";const l=()=>{const c=i.trim();c&&o.push(c),i=""};for(;r<e.length;){if(e.startsWith("/*",r)){const c=xo(e,r);i+=e.slice(r,c),r=c;continue}if(e[r]==="{"){const c=i.trim(),d=Pt(e,r);if(d===-1)break;const h=e.slice(r+1,d);i="",Gn.test(c)?n[c.slice(1)]=h:c&&s.push(`${c} {${h}}`),r=d+1;continue}i+=e[r],r+=1}return l(),{decls:o.join(`
`),classes:n,other:s}}function Qo(t,e){const o="    ".repeat(e);return String(t||"").split(`
`).map(n=>n.trim()?o+n.trim():"").filter((n,s,r)=>n||s>0&&s<r.length-1).join(`
`)}function ja(t,e){const o=Y(t,e);return o?String(t).slice(o.brace+1,o.close):""}function ts(t,e,o){const n=Ra(ja(e,t.className)),s="    ".repeat(o),r=[];n.decls&&r.push(Qo(n.decls.replace(/;+\s*$/,";"),o+1));for(const l of n.other)r.push(Qo(l,o+1));for(const l of t.children)r.push(ts(l,e,o+1));const i=r.filter(Boolean).join(`
`);return i?`${s}.${t.className} {
${i}
${s}}`:`${s}.${t.className} {
${s}}`}function ko(t,e){return e?.length?e.map(o=>ts(o,t,0)).join(`

`)+`
`:""}function es(t){const e=String(t||"").match(/^\s*\.([a-zA-Z_][\w-]*)\s*\{/);return e?e[1]:""}function Na(t){const e=[],o=/\.([a-zA-Z_][\w-]*)\s*\{/g;let n,s=!0;for(;n=o.exec(String(t||""));){if(s){s=!1;continue}e.push(n[1])}return e}function Wa(t,e){const o=String(t).lastIndexOf(`
`,e-1)+1,n=t.slice(o,e);return/^\s*$/.test(n)?n:""}function qa(t,e){return e?t.split(`
`).map((o,n)=>n===0||!o?o:e+o).join(`
`):t}function Va(t,e){let o=0;for(let n=0;n<e.from;n+=1){if(t.startsWith("/*",n)){n=xo(t,n)-1;continue}t[n]==="{"?o+=1:t[n]==="}"&&(o-=1)}return o===0}function So(t,e,o){const n=es(e)||o;if(!n)return String(t||"");let s=String(e||"").trim();s?new RegExp(`^\\.${ye(n)}\\s*\\{`).test(s)||(s=`.${n} {
${s}
}`):s=`.${n} {
}`;let r=String(t||"");const i=Y(r,n),l=Na(s);if(i){const d=Wa(r,i.from);r=r.slice(0,i.from)+qa(s,d)+r.slice(i.to)}else r=`${r.trimEnd()}${r.trim()?`
`:""}${s}
`;const c=Y(r,n);if(!c)return r;for(const d of[...new Set(l)].reverse()){const h=new RegExp(`(^|[^\\w-])\\.${ye(d)}\\s*\\{`,"g"),f=[];let p;for(;p=h.exec(r);){const y=p.index+p[1].length,b=r.indexOf("{",y),B=Pt(r,b);B!==-1&&f.push({from:y,to:B+1})}for(const y of f.reverse()){if(y.from>=c.from&&y.to<=c.to||!Va(r,y))continue;let b=y.from;const B=r.lastIndexOf(`
`,b-1)+1;/^\s*$/.test(r.slice(B,b))&&(b=B);let vt=y.to;r[vt]===`
`&&(vt+=1),r=r.slice(0,b)+r.slice(vt)}}return r}function Ke(t,e){const o=String(t||"");return`${o.trimEnd()}${o.trim()?`
`:""}.${e} {
}
`}function Ua(t,e,o){const n=wt(o);return!e||!n||e===n?String(t||""):Y(t,n)?os(t,e):String(t||"").replace(new RegExp(`(^|[^\\w-])\\.${ye(e)}(\\s*\\{)`,"g"),`$1.${n}$2`)}function os(t,e){let o=String(t||"");for(;;){const n=Y(o,e);if(!n)break;let s=n.from;const r=o.lastIndexOf(`
`,s-1)+1;/^\s*$/.test(o.slice(r,s))&&(s=r);let i=n.to;o[i]===`
`&&(i+=1),o=o.slice(0,s)+o.slice(i)}return o}function Ka(t,e,o){const n=Array.isArray(e)?e:[],s=Array.isArray(o)?o:[],{renamed:r,added:i}=Jn(n,s),l=new Set(s);let c=String(t||"");for(const d of r){const h=wt(d.to);if(h){if(l.has(d.from)){Y(c,h)||(c=Ke(c,h));continue}Y(c,d.from)?c=Ua(c,d.from,h):Y(c,h)||(c=Ke(c,h))}}for(const d of i){const h=wt(d);!h||Y(c,h)||(c=Ke(c,h))}return c}function Ga(t,e,o){const n=new Set(Array.isArray(e)?e:[]),s=new Set(Array.isArray(o)?o:[]);let r=String(t||"");for(const i of s)n.has(i)||(r=os(r,i));return r}const st="__sve-css-rename-chip",Xa='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';function Za(t){const e=t.Decoration.mark({class:"sve-cm-css-token"}),o=t.StateEffect.define();return{extensions:[t.StateField.define({create(){return t.Decoration.none},update(s,r){let i;for(const c of r.effects)c.is(o)&&(i=c.value);if(i===void 0)return r.docChanged?t.Decoration.none:s;if(!i)return t.Decoration.none;const l=new t.RangeSetBuilder;return l.add(i.from,i.to,e),l.finish()},provide:s=>t.EditorView.decorations.from(s)})],setHover(s,r){s&&s.dispatch({effects:o.of(r)})}}}function rt(t){t?.getElementById(st)?.remove()}function Ya(t,e,o,n){e.style.left=`${Math.max(6,Math.min(o,t.innerWidth-28))}px`,e.style.top=`${Math.max(6,n)}px`}function Ja(t,e,o,{onRename:n,title:s}){const r=t.document,i=e.coordsAtPos(o.to);if(!i)return;rt(r);const l=r.createElement("button");l.id=st,l.type="button",l.innerHTML=Xa,l.title=s,l.setAttribute("aria-label",s),l.addEventListener("mousedown",c=>{c.preventDefault(),c.stopPropagation(),rt(r),n?.(o)}),l.addEventListener("mouseleave",()=>{t.setTimeout(()=>{e.dom.matches(":hover")||l.matches(":hover")||rt(r)},120)}),r.body.appendChild(l),Ya(t,l,i.right+2,i.top-1)}function Qa(t,e,{onRename:o,isLocked:n,setHover:s,title:r}){if(!e?.dom||e.dom._sveClassTokenBound)return;e.dom._sveClassTokenBound=!0;let i=null,l="";const c=()=>!!n?.(),d=()=>{t.clearTimeout(i),i=null,l="",s?.(e,null),rt(t.document)},h=f=>{if(c()){d();return}d(),o?.(f)};e.dom.addEventListener("mousemove",f=>{if(c()){d();return}if(f.target?.closest?.(`#${st}`))return;const p=e.posAtCoords({x:f.clientX,y:f.clientY});if(p==null)return;const y=Yo(e.state.doc.toString(),p);if(!y){t.clearTimeout(i),i=null,l="",s?.(e,null);return}const b=`${y.from}:${y.to}:${y.name}`;s?.(e,{from:y.from,to:y.to}),!(l===b&&(i||t.document.getElementById(st)))&&(t.clearTimeout(i),l=b,i=t.setTimeout(()=>{i=null,Ja(t,e,y,{onRename:h,title:r||"Rename class"})},160))}),e.dom.addEventListener("mouseleave",f=>{f.relatedTarget?.closest?.(`#${st}`)||t.setTimeout(()=>{t.document.getElementById(st)?.matches(":hover")||d()},160)}),e.dom.addEventListener("dblclick",f=>{if(c())return;const p=e.posAtCoords({x:f.clientX,y:f.clientY});if(p==null)return;const y=Yo(e.state.doc.toString(),p);y&&(f.preventDefault(),f.stopPropagation(),h(y))},!0),e.scrollDOM?.addEventListener("scroll",d),t.document._sveClassTokenDismiss||(t.document._sveClassTokenDismiss=!0,t.document.addEventListener("mousedown",f=>{f.target.closest(`#${st}`)||rt(t.document)}))}const a={cssColorsPromise:null,lastUid:null,lastType:null,typeStack:[],lastParts:{html:"",css:"",js:""},lastProps:[],propsDirty:!1,lastLocked:!1,lockReady:!1,lastWin:null,loadGen:0,saveTimer:null,lastBracketNames:null,lastCssSelectorNames:null,saveInFlight:null,loadInFlight:null,dragging:!1,applying:!1,htmlScopePref:!0,htmlScopeActive:!1,styleMode:"css",cssToolRow:null,cssOpenTool:"",cssOpenMenu:"",cssValues:!1,twCss:null,twKey:"",twBusy:!1,twDirty:!1,htmlFocus:null,htmlFull:"",cssFull:"",cssPane:"full",cssScopeSnapshot:"",layoutObserver:null,layoutWin:null,observedEditor:null,observedRight:null,layoutWatchBound:!1,cssSize:"",cssState:"",cssOwnFolds:new Set,cssFoldSig:"",htmlPartialUi:null,htmlAntlersUi:null,htmlClassTokenUi:null,htmlLintUi:null,cssGhostUi:null},ti=["aria-label"],ei={value:""},oi=["label"],ni=["value"],ns={__name:"CodeDockAntlersSelect",props:{label:{type:String,required:!0},groups:{type:Array,required:!0},onPick:{type:Function,required:!0}},setup(t){const e=t;function o(n){const s=n.target.value;n.target.value="",s&&e.onPick(s)}return(n,s)=>(x(),k("select",{"data-sve-antlers-select":"","aria-label":t.label,onChange:o},[g("option",ei,A(t.label),1),(x(!0),k(D,null,U(t.groups,r=>(x(),k("optgroup",{key:r.id,label:r.label},[(x(!0),k(D,null,U(r.items,i=>(x(),k("option",{key:i.id,value:i.id},A(i.label),9,ni))),128))],8,oi))),128))],40,ti))}},si={"data-sve-data-search":""},ri=["placeholder","aria-label","onKeydown"],ai={"data-sve-data-tabs":""},ii=["data-active","onClick"],li={key:0,"data-sve-data-empty":""},ci={key:0,"data-sve-data-group":""},di=["data-cursor","title","onMouseenter","onClick"],ui={"data-sve-data-name":""},fi={key:0,"data-sve-data-parent":""},hi={key:1,"data-sve-data-loop":""},pi={key:2,"data-sve-data-value":""},mi={__name:"CodeDockDataVars",props:{title:{type:String,default:""},placeholder:{type:String,default:""},emptyText:{type:String,default:""},noSectionText:{type:String,default:""},loopText:{type:String,default:""},tabs:{type:Array,required:!0},data:{type:Object,required:!0},onPick:{type:Function,required:!0}},setup(t){const e=t,o=ut(""),n=ut(null),s=ut(e.tabs[0]?.id||"section"),r=ut(null),i=ut(-1),l=ut(!1),c=jt(()=>o.value.trim().toLowerCase()),d=jt(()=>{const _=e.data[s.value]||[];return Array.isArray(_)&&_.length&&_[0]?.items?_:[{handle:s.value,label:"",items:_,bare:!0}]}),h=jt(()=>{const _=c.value;return d.value.map(S=>({...S,items:(S.items||[]).filter(M=>!_||M.var.toLowerCase().includes(_)||String(M.label||"").toLowerCase().includes(_)||String(M.parent||"").toLowerCase().includes(_))})).filter(S=>S.items.length)}),f=jt(()=>h.value.flatMap(_=>_.items.map(S=>({row:S,group:_})))),p=jt(()=>!f.value.length);En(()=>Je(()=>n.value?.focus()));function y(_){l.value=!0;const S=f.value.length;if(!S){i.value=-1;return}const M=i.value+_;i.value=M<0?-1:Math.min(M,S-1),Je(()=>b())}function b(){const _=r.value?.querySelector("[data-cursor]");if(!_)return;let S=_.parentElement;for(;S&&S.scrollHeight<=S.clientHeight;)S=S.parentElement;if(!S)return;const M=_.offsetTop,H=M+_.offsetHeight;M<S.scrollTop?S.scrollTop=M:H>S.scrollTop+S.clientHeight&&(S.scrollTop=H-S.clientHeight)}function B(_){return f.value.findIndex(S=>S.row===_)}function vt(_){l.value||(i.value=B(_))}function Rt(){const _=i.value>=0?f.value[i.value]:null;_&&e.onPick(_.row,_.group)}function ce(_){s.value=_,i.value=-1}return(_,S)=>(x(),k(D,null,[g("div",si,[S[6]||(S[6]=g("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[g("circle",{cx:"11",cy:"11",r:"7"}),g("path",{d:"m20 20-3.5-3.5"})],-1)),Bn(g("input",{ref_key:"input",ref:n,"data-sve-data-input":"","onUpdate:modelValue":S[0]||(S[0]=M=>o.value=M),type:"text",placeholder:t.placeholder,"aria-label":t.title,onInput:S[1]||(S[1]=M=>i.value=-1),onKeydown:[S[2]||(S[2]=Bt(I(M=>y(1),["prevent"]),["down"])),S[3]||(S[3]=Bt(I(M=>y(-1),["prevent"]),["up"])),Bt(I(Rt,["prevent"]),["enter"]),S[4]||(S[4]=Bt(I(()=>{},["stop"]),["escape"]))]},null,40,ri),[[Ln,o.value]])]),g("div",ai,[(x(!0),k(D,null,U(t.tabs,M=>(x(),k("button",{key:M.id,type:"button","data-sve-data-tab":"","data-active":s.value===M.id?"":void 0,onClick:I(H=>ce(M.id),["prevent","stop"])},A(M.label),9,ii))),128))]),p.value?(x(),k("div",li,A(s.value==="section"&&!(t.data.section||[]).length?t.noSectionText:t.emptyText),1)):j("",!0),g("div",{ref_key:"rowsEl",ref:r,onMousemove:S[5]||(S[5]=M=>l.value=!1)},[(x(!0),k(D,null,U(h.value,M=>(x(),k(D,{key:M.handle},[M.bare?j("",!0):(x(),k("div",ci,A(M.label),1)),(x(!0),k(D,null,U(M.items,H=>(x(),k("button",{key:M.handle+"::"+H.var+"::"+(H.parent||""),type:"button","data-sve-data-option":"","data-cursor":B(H)===i.value?"":void 0,title:H.label,onMouseenter:Fr=>vt(H),onClick:I(Fr=>t.onPick(H,M),["prevent","stop"])},[g("span",ui,A(H.var),1),H.parent?(x(),k("span",fi,A(H.parent),1)):j("",!0),H.loop?(x(),k("span",hi,A(t.loopText),1)):H.value?(x(),k("span",pi,A(H.value),1)):j("",!0)],40,di))),128))],64))),128))],544)],64))}},Lt=new Map,tn={scope:null,section:[],page:[],site:[]};function ss(t){const e=t?.location?.pathname?.match(/\/collections\/([^/]+)\//);return e?e[1]:""}function rs(t){const e=String(t||"").trim();return!e||/^(header|footer)\//.test(e)?"":e}function gi(t){return(Array.isArray(t)?t:[]).filter(e=>e?.handle).map(e=>`${e.kind==="collection"?"collection":"field"}:${e.handle}`).join("|")}function wo({collection:t,set:e,view:o,scope:n}){return`${t}::${e}::${o||""}::${n||""}`}function as(t){return Lt.get(t)||null}function is(t,{collection:e,set:o,view:n,scope:s}){const r=wo({collection:e,set:o,view:n,scope:s}),i=Lt.get(r);if(i)return Promise.resolve(i);const l=new URLSearchParams;return e&&l.set("collection",e),o&&l.set("set",o),n&&l.set("view",n),s&&l.set("scope",s),t.fetch(`/!/sve/data-vars?${l.toString()}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(c=>c.ok?c.json():null).then(c=>{const d=c&&typeof c=="object"?c:tn;return Lt.set(r,d),d}).catch(()=>tn)}function vi(t){if(!t){Lt.clear();return}const e=`::${t}::`;for(const o of[...Lt.keys()])o.includes(e)&&Lt.delete(o)}function yi(t){if(t==null||t==="")return"";if(typeof t=="boolean")return t?"true":"false";if(Array.isArray(t))return t.length?`${t.length} ×`:"";if(typeof t=="object"){const o=Object.keys(t).length;return o?`${o} ×`:""}const e=String(t).replace(/\s+/g," ").trim();return e.length>60?`${e.slice(0,60)}…`:e}function bi(t,e){return e.split(".").reduce((o,n)=>o&&typeof o=="object"?o[n]:void 0,t)}function ls(t,e){return!Array.isArray(t)||!e||typeof e!="object"?t||[]:t.map(o=>{if(o.parent||o.value!=null||o.var.includes(":"))return o;const n=yi(bi(e,o.var));return n?{...o,value:n}:o})}function xi(t,e){return Array.isArray(t)?t.map(o=>({...o,items:ls(o.items,e)})):[]}function ki(t,e){const o=String(t?.var||"").trim();if(!o)return null;if(t.loop)return{text:`{{ ${o} }}
  
{{ /${o} }}`,cursor:`{{ ${o} }}
  `.length};if(e?.loop&&!t.parent){const n=e.loop;return{text:`{{ ${n} }}
  {{ ${o} }}
{{ /${n} }}`,cursor:`{{ ${n} }}
  {{ ${o} }}`.length}}return{text:`{{ ${o} }}`,cursor:`{{ ${o} }}`.length}}const ue="visual_edit",Si=[{id:"base",lang:"code_dock_visual_edit_base"},{id:"field",lang:"code_dock_visual_edit_field"}],cs=[{id:"tag",group:"base",label:"{{ visual_edit }}",standalone:"{{ visual_edit| }}"},{id:"ve_popup",group:"base",label:"popup",attr:'popup="true"'},{id:"ve_orderable",group:"base",label:"orderable",attr:'orderable="true"'},{id:"ve_section_orderable",group:"base",label:"section_orderable",attr:'section_orderable="true"'},{id:"ve_outline_inside",group:"base",label:"outline_inside",attr:'outline_inside="true"'},{id:"ve_field",group:"field",label:"field",attr:'field="|"'},{id:"ve_inline_edit",group:"field",label:"inline_edit",attr:'inline_edit="true"'},{id:"ve_insertable",group:"field",label:"insertable",attr:'insertable="true"'},{id:"ve_toolbar",group:"field",label:"toolbar",attr:'toolbar="true"'},{id:"ve_scope",group:"field",label:"scope",attr:'scope="|"'},{id:"ve_controls",group:"field",label:"controls",attr:'controls="|"'}];function wi(t){return cs.find(e=>e.id===t)||null}function _i(t,e,o,n){let s=e;for(;s<o;){const r=t.indexOf("{{",s);if(r===-1||r>=o)return null;const i=t.indexOf("}}",r+2);if(i===-1||i+2>o)return null;const l=t.slice(r+2,i);if((l.trim().split(/\s+/)[0]||"")===n)return{openIdx:r,closeIdx:i,inner:l};s=i+2}return null}function $i(t,e){const o=String(e).split("=")[0].trim();return new RegExp(`(^|\\s)${o}(=|\\s|$)`).test(t)}const Ci={class:"sve-code-dock"},Ti={"data-sve-code-bar":""},Ai={type:"button","data-sve-code-pane-btn":"html"},Mi={type:"button","data-sve-code-pane-btn":"css"},Ei={type:"button","data-sve-code-pane-btn":"alpine"},Bi={type:"button","data-sve-code-pane-btn":"js"},Li={type:"button","data-sve-html-scope":"","aria-pressed":"true"},Fi=["innerHTML"],Ii={"data-sve-code-panes":""},Oi={"data-sve-code-pane":"html"},Pi={"data-sve-code-pane-label":""},Di=["title","aria-label"],zi=["innerHTML"],Hi={"data-sve-code-pane":"css"},Ri={"data-sve-css-chrome":"subrow-2"},ji={"data-sve-code-pane-label":""},Ni={"data-sve-css-label":""},Wi={"data-sve-code-pane":"alpine"},qi={"data-sve-code-pane-label":""},Vi={"data-sve-code-pane":"js"},Ui={"data-sve-code-pane-label":""},Ki={__name:"CodeDockChrome",props:{htmlLabel:{type:String,required:!0},cssLabel:{type:String,required:!0},jsLabel:{type:String,required:!0},alpineLabel:{type:String,required:!0},treeIcon:{type:String,required:!0},dataIcon:{type:String,required:!0},dataLabel:{type:String,required:!0}},setup(t){return(e,o)=>(x(),k("div",Ci,[o[20]||(o[20]=g("div",{"data-sve-code-grip":"","aria-hidden":"true"},null,-1)),g("div",Ti,[g("button",Ai,A(t.htmlLabel),1),g("button",Mi,A(t.cssLabel),1),g("button",Ei,A(t.alpineLabel),1),g("button",Bi,A(t.jsLabel),1),o[0]||(o[0]=Ir('<button type="button" data-sve-code-back hidden></button><span data-sve-code-path></span><span data-sve-code-status></span><button type="button" data-sve-code-strip></button><button type="button" data-sve-code-history></button><button type="button" data-sve-style-mode></button><button type="button" data-sve-values-mode></button>',7)),g("button",Li,[g("span",{innerHTML:t.treeIcon},null,8,Fi)]),o[1]||(o[1]=g("button",{type:"button","data-sve-code-autosave":"","aria-pressed":"true"},null,-1)),o[2]||(o[2]=g("button",{type:"button","data-sve-code-save":"",hidden:""},null,-1)),o[3]||(o[3]=g("button",{type:"button","data-sve-code-lock":"",hidden:""},null,-1))]),o[21]||(o[21]=g("div",{"data-sve-code-lock-banner":""},null,-1)),g("div",Ii,[g("div",Oi,[g("div",Pi,[g("span",null,A(t.htmlLabel),1),o[4]||(o[4]=g("div",{"data-sve-html-tools":""},null,-1)),o[5]||(o[5]=g("button",{type:"button","data-sve-html-tidy":""},null,-1)),g("button",{type:"button","data-sve-data-vars":"",title:t.dataLabel,"aria-label":t.dataLabel},[g("span",{innerHTML:t.dataIcon},null,8,zi)],8,Di),o[6]||(o[6]=g("div",{"data-sve-visual-edit-tools":""},null,-1)),o[7]||(o[7]=g("div",{"data-sve-antlers-tools":""},null,-1))]),o[8]||(o[8]=g("div",{"data-sve-html-problems":"",hidden:""},null,-1)),o[9]||(o[9]=g("div",{"data-sve-code-host":""},null,-1))]),o[17]||(o[17]=g("div",{"data-sve-code-split":"","data-sve-code-split-after":"html"},null,-1)),g("div",Hi,[g("div",Ri,[g("div",ji,[g("span",Ni,A(t.cssLabel),1),o[10]||(o[10]=g("button",{type:"button","data-sve-css-add-class":""},null,-1)),o[11]||(o[11]=g("div",{"data-sve-css-tools":""},null,-1))])]),o[12]||(o[12]=g("div",{"data-sve-css-head":""},null,-1)),o[13]||(o[13]=g("div",{"data-sve-code-host":""},null,-1)),o[14]||(o[14]=g("div",{"data-sve-tw-host":""},null,-1))]),o[18]||(o[18]=g("div",{"data-sve-code-split":"","data-sve-code-split-after":"css"},null,-1)),g("div",Wi,[g("div",qi,[g("span",null,A(t.alpineLabel),1)]),o[15]||(o[15]=g("div",{"data-sve-alpine-host":""},null,-1))]),o[19]||(o[19]=g("div",{"data-sve-code-split":"","data-sve-code-split-after":"alpine"},null,-1)),g("div",Vi,[g("div",Ui,[g("span",null,A(t.jsLabel),1)]),o[16]||(o[16]=g("div",{"data-sve-code-host":""},null,-1))])])]))}},en="view:",on="partials/";function ds(t){const e=String(t||"");if(!e.startsWith(en))return null;const o=e.slice(en.length);return o.startsWith(on)?o.slice(on.length):o}function Gi(t){const e=String(t||"").match(/\sclass\s*=\s*(["'])([\s\S]*?)\1/i);return e?e[2].replace(/\{\{[\s\S]*?\}\}/g,"\0").split(/[\s[\]]+/).filter(o=>o&&!o.includes("\0")&&/^[A-Za-z_][\w:./%!#-]*$/.test(o)):[]}const Xi=t=>globalThis.CSS?.escape?globalThis.CSS.escape(t):t.replace(/([^\w-])/g,"\\$1");function us(t){const e=Ce(t)[0];if(!e)return null;const o=Gi(String(t).slice(e.from,e.openTo));return!o.length&&!/^(header|footer|main|nav|aside|figure|form|table)$/.test(e.tag)?null:e.tag+o.map(n=>`.${Xi(n)}`).join("")}const qt=new Map;let Nt=null,nn=0,sn=0,rn=!1;async function Zi(t,e){if(qt.has(e))return qt.get(e);const o=`view:partials/${e}`;let n=null;try{const s=await t.fetch(`/!/sve/section-template?type=${encodeURIComponent(o)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}});if(s.ok){const r=await s.json();n=typeof r.html=="string"?us(r.html):null}}catch{}return qt.set(e,n),n}function Yi(t){t?qt.delete(t):qt.clear()}function fs(t){const e=ds(St("dock:current-type")),o=e?St("dock:html"):"",n=e&&typeof o=="string"?us(o):null;Fn({source:Kn,type:Un.SVE_COMPONENT_FOCUS,on:!!n,name:e?String(e).split("/").pop():"",selector:n||""},t)}async function _o(t){const e=++sn,o=St("dock:html"),n=[...new Set((typeof o=="string"?Hn(o):[]).map(r=>r.src).filter(r=>r&&!ua(r)))],s=await Promise.all(n.map(r=>Zi(t,r)));e===sn&&Fn({source:Kn,type:Un.SVE_COMPONENT_MAP,items:n.map((r,i)=>({src:r,name:r.split("/").pop(),selector:s[i]})).filter(r=>r.selector)},t)}function Ji(t){Nt=t,!rn&&(rn=!0,$e("dock:html-changed",()=>{Nt&&(Yi(ds(St("dock:current-type"))),Nt.clearTimeout(nn),nn=Nt.setTimeout(()=>{_o(Nt)},400))}))}const Qi=["data-sve-html-tool","data-tip","aria-label","data-letter","onClick","onContextmenu"],tl=["innerHTML"],el={__name:"CodeDockHtmlTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(t){return(e,o)=>(x(!0),k(D,null,U(t.tools,n=>(x(),k("button",{key:n.id,type:"button","data-sve-html-tool":n.id,"data-tip":n.title,"aria-label":n.title,"data-letter":n.letter?"":void 0,onClick:I(s=>t.onTool(n.id),["prevent","stop"]),onContextmenu:I(s=>t.onTool(n.id),["prevent"])},[n.letter?(x(),k(D,{key:0},[In(A(n.letter),1)],64)):(x(),k("span",{key:1,innerHTML:n.icon},null,8,tl))],40,Qi))),128))}},ft=po({tools:[],onTool:null,onKid:null}),ol=["data-sve-css-item"],nl=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],sl={key:0,"data-sve-css-kids":""},rl={key:0,"data-sve-css-sep":"","aria-hidden":"true"},al=["data-sve-css-kid","data-sve-css-box-side","data-tip","aria-label","innerHTML","onClick","onContextmenu"],il={__name:"CodeDockCssTools",setup(t){return(e,o)=>(x(!0),k(D,null,U(T(ft).tools,n=>(x(),k("li",Ve({key:n.id,"data-sve-css-item":n.id},{ref_for:!0},n.open?{"data-sve-css-open":""}:{}),[g("button",Ve({type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title},{ref_for:!0},{...n.active?{"data-active":""}:{},...n.open?{"data-open":""}:{}},{innerHTML:n.icon,onClick:I(s=>T(ft).onTool?.(n.id),["prevent","stop"]),onContextmenu:I(s=>T(ft).onTool?.(n.id),["prevent"])}),null,16,nl),n.open&&n.kids.length?(x(),k("div",sl,[(x(!0),k(D,null,U(n.kids,s=>(x(),k(D,{key:s.id},[s.sep?(x(),k("span",rl)):j("",!0),g("button",Ve({type:"button","data-sve-css-kid":s.id,"data-sve-css-box-side":s.id,"data-tip":s.title,"aria-label":s.title},{ref_for:!0},s.active?{"data-active":""}:{},{innerHTML:s.icon,onClick:I(r=>T(ft).onKid?.(n.id,s.id),["prevent","stop"]),onContextmenu:I(r=>T(ft).onKid?.(n.id,s.id),["prevent"])}),null,16,al)],64))),128))])):j("",!0)],16,ol))),128))}},ll=1.5,cl=16;function me(t,e){const o=parseFloat(t);return Number.isFinite(o)?e==="em"||e==="rem"?o*cl:o:null}function dl(t){const e=String(t||"").toLowerCase();if(/\bmin-width\b|\bwidth\s*>=?/.test(e))return null;let o=e.match(/\bmax-width\s*:\s*([\d.]+)(px|em|rem)/);return o||(o=e.match(/\bwidth\s*<=?\s*([\d.]+)(px|em|rem)/),o)?me(o[1],o[2]):(o=e.match(/([\d.]+)(px|em|rem)\s*>=?\s*width\b/),o?me(o[1],o[2]):null)}function ht(t,e){const o=dl(t);if(o===null)return"";for(const n of e||[]){if(n.base)continue;const s=me(String(n.max||"").replace(/[a-z]+$/i,""),(String(n.max||"").match(/[a-z]+$/i)||[""])[0]);if(s!==null&&Math.abs(s-o)<=ll)return n.handle}return""}function Me(t){let e="",o=0;for(;o<t.length;){const n=Ee(t,o);if(n!==o){e+=" ".repeat(n-o),o=n;continue}e+=t[o],o+=1}return e}function Ee(t,e){if(t.startsWith("/*",e)){const o=t.indexOf("*/",e+2);return o===-1?t.length:o+2}if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?t.length:o+2}if(t[e]==='"'||t[e]==="'"){const o=t[e];for(let n=e+1;n<t.length;n+=1)if(t[n]==="\\")n+=1;else if(t[n]===o)return n+1;return t.length}return e}function Be(t){const e=String(t||""),o=[],n=(s,r,i=0)=>{let l=s,c=l;for(;l<r;){const d=Ee(e,l);if(d!==l){l=d;continue}if(e[l]===";"){l+=1,c=l;continue}if(e[l]==="}")return;if(e[l]!=="{"){l+=1;continue}const h=Me(e.slice(c,l)),f=h.trim(),p=hs(e,l,r);if(p===-1)return;/^@media\b/i.test(f)?o.push({query:f.replace(/^@media\s*/i,"").trim(),from:c+h.search(/\S/),to:p+1,bodyFrom:l+1,bodyTo:p,depth:i}):/^@(?:import|charset|use)\b/i.test(f)||n(l+1,p,i+1),l=p+1,c=l}};return n(0,e.length,0),o}function hs(t,e,o){let n=0;for(let s=e;s<o;s+=1){const r=Ee(t,s);if(r!==s){s=r-1;continue}if(t[s]==="{")n+=1;else if(t[s]==="}"&&(n-=1,n===0))return s}return-1}function Dt(t){const e=String(t||""),o=(n,s)=>{const r=[];let i=n,l=i;for(;i<s;){const c=Ee(e,i);if(c!==i){i=c;continue}if(e[i]===";"){i+=1,l=i;continue}if(e[i]==="}")return r;if(e[i]!=="{"){i+=1;continue}const d=Me(e.slice(l,i)),h=d.trim(),f=hs(e,i,s);if(f===-1)return r;r.push({prelude:h,media:/^@media\b/i.test(h),query:h.replace(/^@media\s*/i,"").trim(),from:l+d.search(/\S/),to:f+1,bodyFrom:i+1,bodyTo:f,children:/^@(?:import|charset|use)\b/i.test(h)?[]:o(i+1,f)}),i=f+1,l=i}return r};return o(0,e.length)}function ul(t,e,o){const n=String(t||"");if(!o)return[];const s=(e||[]).find(d=>d.base),r=Dt(n),i=[],l=d=>d.media?ht(d.query,e)===o:d.children.some(l);if(s&&o===s.handle){const d=h=>{for(const f of h){if(f.media&&ht(f.query,e)){i.push({from:f.from,to:f.to});continue}d(f.children)}};return d(r),i}const c=(d,h,f)=>{const p=[];for(const b of d){if(b.media&&ht(b.query,e)===o){p.push({from:b.from,to:b.to,into:null});continue}l(b)&&p.push({from:b.from,to:b.to,into:b})}if(!p.length){f>h&&i.push({from:h,to:f});return}let y=h;for(const b of p)b.from>y&&i.push({from:y,to:b.from}),b.into&&c(b.into.children,b.into.bodyFrom,b.into.bodyTo),y=b.to;f>y&&i.push({from:y,to:f})};return c(r,0,n.length),i.filter(d=>n.slice(d.from,d.to).trim()!=="")}function fl(t,e){const o=String(t||""),n=[],s=i=>{for(const l of i){if((l.media&&ht(l.query,e)||/^#id-/.test(l.prelude))&&Me(o.slice(l.bodyFrom,l.bodyTo)).trim()===""){n.push(l);continue}s(l.children)}};if(s(Dt(o)),!n.length)return o;let r=o;for(const i of n.sort((l,c)=>c.from-l.from)){let l=i.from,c=i.to;const d=r.lastIndexOf(`
`,l-1)+1;for(r.slice(d,l).trim()===""&&(l=d);r[c]===" "||r[c]==="	";)c+=1;r[c]===`
`&&(c+=1),r=r.slice(0,l)+r.slice(c)}return r}function hl(t,e){const o=String(t||""),n=[],s=i=>Me(o.slice(i.bodyFrom,i.bodyTo)).trim()==="",r=i=>{for(const l of i){if((l.media&&ht(l.query,e)||/^#id-/.test(l.prelude))&&s(l)){n.push({from:l.from,to:l.to});continue}r(l.children)}};return r(Dt(o)),n}function be(t,e,o){const n=e||[],s=n.find(d=>d.base),r=[],i=d=>/^#id-/.test(d.prelude)||/^#\s*$/.test(d.prelude),l=(d,h)=>{for(const f of d){if(!f.media){l(f.children,h);continue}const p=ht(f.query,n)||h;if(o===p){r.push(f);continue}l(f.children,p)}},c=(d,h)=>{for(const f of d){if(f.media){c(f.children,ht(f.query,n)||h);continue}if(i(f)){const p=h||(s?s.handle:"");!o||o===p?r.push(f):l(f.children,p);continue}c(f.children,h)}};return c(Dt(String(t||"")),""),r.sort((d,h)=>d.from-h.from)}function $o(t,e,o){return Be(t).filter(n=>ht(n.query,e)===o)}const F=po({tag:"",scope:"",onTag:null,sizes:[],onSize:null,state:"",stateLabel:"",onState:null,canEdit:!1,note:""}),pl={class:"sve-css-head"},ml=["disabled"],gl={key:1,class:"sve-css-scope"},vl=["title","data-active","disabled","onClick"],yl=["data-active","disabled"],bl={key:2,class:"sve-css-note"},xl={__name:"CodeDockCssHead",setup(t){return(e,o)=>(x(),k("div",pl,[T(F).tag?(x(),k("button",{key:0,type:"button",class:"sve-css-tag",disabled:!T(F).canEdit,onClick:o[0]||(o[0]=I(()=>{},["prevent","stop"])),onDblclick:o[1]||(o[1]=I(n=>T(F).onTag?.(n),["prevent","stop"]))},"<"+A(T(F).tag)+">",41,ml)):j("",!0),T(F).scope?(x(),k("span",gl,A(T(F).scope),1)):j("",!0),(x(!0),k(D,null,U(T(F).sizes,n=>(x(),k("button",{key:n.key,type:"button","data-sve-css-size":"",title:n.title,"data-active":n.active?"":void 0,disabled:!T(F).canEdit,onClick:I(s=>T(F).onSize?.(n.key),["prevent","stop"])},A(n.label),9,vl))),128)),g("button",{type:"button","data-sve-css-state":"","data-active":T(F).state?"":void 0,disabled:!T(F).canEdit,onClick:o[2]||(o[2]=I(n=>T(F).onState?.(n),["prevent","stop"]))},[In(A(T(F).stateLabel)+" ",1),o[3]||(o[3]=g("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[g("path",{d:"m6 9 6 6 6-6"})],-1))],8,yl),o[4]||(o[4]=g("span",{class:"sve-css-gap"},null,-1)),T(F).note?(x(),k("span",bl,A(T(F).note),1)):j("",!0)]))}},kl=On(xl,[["__scopeId","data-v-43bc76ce"]]),Sl={key:0,"data-sve-css-swatches":""},wl=["data-sve-css-token","title","data-active","onClick"],_l={key:0,"data-sve-css-head-row":""},$l={key:1,"data-sve-css-note-row":""},Cl=["data-sve-css-token","data-active","onClick"],Tl={"data-sve-css-choice-label":""},Al={key:0,"data-sve-css-choice-hint":""},ot={__name:"CodeDockMenu",props:{kind:{type:String,required:!0},swatches:{type:Array,default:()=>[]},choices:{type:Array,default:()=>[]},onClear:{type:Function,default:null},onPick:{type:Function,required:!0}},setup(t){return(e,o)=>t.kind==="colors"?(x(),k("div",Sl,[g("button",{type:"button","data-sve-css-clear":"",title:"Clear",onClick:o[0]||(o[0]=I((...n)=>t.onClear&&t.onClear(...n),["prevent","stop"]))},[...o[1]||(o[1]=[g("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none",stroke:"currentColor","stroke-width":"1.5"},[g("path",{d:"M2 2l6 6M8 2L2 8"})],-1)])]),(x(!0),k(D,null,U(t.swatches,n=>(x(),k("button",{key:n.name,type:"button","data-sve-css-swatch":"","data-sve-css-token":n.name,title:n.name,"data-active":n.active?"":void 0,style:Or({background:n.hex||"transparent"}),onClick:I(s=>t.onPick(n.name),["prevent","stop"])},null,12,wl))),128))])):(x(!0),k(D,{key:1},U(t.choices,n=>(x(),k(D,{key:n.value},[n.heading?(x(),k("span",_l,A(n.label),1)):n.note?(x(),k("span",$l,A(n.label),1)):(x(),k("button",{key:2,type:"button","data-sve-css-choice":"","data-sve-css-token":n.token||void 0,"data-active":n.active?"":void 0,onClick:I(s=>t.onPick(n.value),["prevent","stop"])},[g("span",Tl,A(n.label),1),n.hint?(x(),k("span",Al,A(n.hint),1)):j("",!0)],8,Cl))],64))),128))}},Ml=/^\.[a-zA-Z_][\w-]*$/;function El(t,e,o){return String(e||"").includes(o)?xe(t).length===1:!1}function xe(t){return Dt(t).filter(e=>/^@scope\b/i.test(e.prelude))}function Bl(t){const e=String(t||"");return Dt(e).filter(o=>Ml.test(o.prelude)?!e.slice(o.from,o.bodyFrom-1).includes("{{"):!1).map(o=>({from:o.from,to:o.to,name:o.prelude.slice(1)}))}function Ll(t,e,o){const n=String(t||"");if(!El(n,e,o))return n;const s=Bl(n);if(!s.length)return n;const r=xe(n)[0],i=Ol(n,r),l=s.map(p=>Pl(n.slice(p.from,p.to),n,p.from,i)).join(`

`);let c=n;for(const p of[...s].sort((y,b)=>b.from-y.from))c=Il(c,p.from,p.to);const d=Fl(c,o);if(d===-1)return n;const h=(c.slice(0,d).match(/\n([^\S\n]*)$/)||[null,null])[1],f=h===null?d:d-h.length;return`${c.slice(0,f)}
${l}
${h??""}${c.slice(d)}`}function Fl(t,e){const o=xe(t).find(n=>n.prelude.includes(e));return o?o.bodyTo:xe(t)[0]?.bodyTo??-1}function Il(t,e,o){let n=e,s=o;const r=t.lastIndexOf(`
`,n-1)+1;for(t.slice(r,n).trim()===""&&(n=r);t[s]===" "||t[s]==="	";)s+=1;return t[s]===`
`&&(s+=1),t.slice(0,n)+t.slice(s)}function Ol(t,e){const o=t.slice(e.bodyFrom,e.bodyTo).match(/\n([^\S\n]+)\S/);return o?o[1]:`${(t.slice(0,e.from).match(/\n([^\S\n]*)$/)||[null,""])[1]}    `}function Pl(t,e,o,n){const s=(e.slice(0,o).match(/\n([^\S\n]*)$/)||[null,""])[1];return t.split(`
`).map((r,i)=>i===0?n+r.trim():r.startsWith(s)?n+r.slice(s.length):n+r.trimStart()).join(`
`)}const Dl={"data-sve-css-add-label":""},zl=["placeholder","onKeydown"],Co={__name:"CodeDockAddClass",props:{label:{type:String,required:!0},placeholder:{type:String,default:""},initial:{type:String,default:""},onAdd:{type:Function,required:!0}},setup(t){const e=t,o=ut(e.initial||""),n=ut(null);En(()=>Je(()=>{n.value?.focus(),n.value?.select()}));function s(){const r=o.value.trim();if(!r){n.value?.focus();return}e.onAdd(r)}return(r,i)=>(x(),k(D,null,[g("label",Dl,A(t.label),1),Bn(g("input",{ref_key:"input",ref:n,"data-sve-css-add-input":"","onUpdate:modelValue":i[0]||(i[0]=l=>o.value=l),type:"text",placeholder:t.placeholder,onKeydown:[Bt(I(s,["prevent"]),["enter"]),i[1]||(i[1]=Bt(I(()=>{},["stop"]),["escape"]))]},null,40,zl),[[Ln,o.value]])],64))}};function an(t,e){e._sveLockBound||(e._sveLockBound=!0,e.querySelector("[data-sve-code-lock]")?.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),!(!a.lockReady||!a.lastType)){if(a.lastLocked){Rl(t);return}ps(t,!0)}}))}function To(t){return t?tt(t,Cr)!=="0":!0}function Hl(){const t=v.html;return!t||t.state.readOnly||!a.lastType?!1:!Fo(Lo(),a.lastParts)}function lt(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-code-autosave]"),n=e?.querySelector("[data-sve-code-save]");if(!o||!n)return;const s=To(t),r=Hl();o.setAttribute("aria-pressed",s?"true":"false"),o.title=m(t,s?"code_dock_autosave_on":"code_dock_autosave_off"),o.setAttribute("aria-label",o.title),o.innerHTML=Bu,n.hidden=s,n.title=m(t,"code_dock_save"),n.setAttribute("aria-label",n.title),n.innerHTML=Lu,r?n.setAttribute("data-dirty",""):n.removeAttribute("data-dirty")}function ln(t,e){e._sveAutosaveBound||(e._sveAutosaveBound=!0,e.querySelector("[data-sve-code-autosave]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=!To(t);K(t,Cr,n?"1":"0"),n?J(t.document):a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null),lt(t)}),e.querySelector("[data-sve-code-save]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),J(t.document)}))}function Rl(t){t.document.getElementById(Z)?.remove();const e=Pr(t.document,Dr,{title:m(t,"code_dock_unlock_title"),body:m(t,"code_dock_unlock_body"),buttons:[{value:"cancel",label:m(t,"cancel"),variant:"ghost"},{value:"ok",label:m(t,"code_dock_unlock_confirm"),variant:"primary"}],onPick:o=>{e.dismiss(),o==="ok"&&ps(t,!1)}});e.host.id=Z}function ps(t,e){const o=a.lastType;if(!o)return;const n=()=>{a.lastType===o&&t.fetch("/!/sve/section-template/lock",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Pn(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:o,locked:e})}).then(async s=>{if(!s.ok)throw new Error(String(s.status));a.lastType===o&&(a.lastLocked=e,It(t),oe(a.lastParts,e),X(t),R(t.document,e?m(t,"code_dock_locked"):""))}).catch(()=>{R(t.document,m(t,"code_dock_error"))})};if(e&&(J(t.document),a.saveInFlight)){a.saveInFlight.finally(n);return}n()}function jl(t,e){const o=String(e||"");if(/^(header|footer)\//.test(o))return!0;const n=t?.Statamic?.$config?.get?.("sveChromeTemplates")||{};return Object.values(n).some(s=>s&&s.type===o)}function ke(t){const e=a.lastType;if(!a.lastUid||!e||String(e).startsWith("view:")||jl(t,e)){Vo(t);return}const o=Hr(a.lastUid,t.document);Vo(t,o.length?{sectionUids:o}:void 0)}function Nl(t,e,o){return a.saveInFlight=t.fetch("/!/sve/section-template",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Pn(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:e,html:o.html,css:o.css,js:o.js,...typeof o.tw=="string"?{tw:o.tw}:{},...fa(t)?{props:a.lastProps}:{}})}).then(async n=>{if(n.status===423){a.lastLocked=!0,a.lockReady=!0,It(t),oe(a.lastParts,!0),X(t),R(t.document,m(t,"code_dock_locked"));return}const s=await n.json().catch(()=>({}));if(!n.ok)throw new Error(s?.error==="not_writable"?"not_writable":String(n.status));if(a.lastType===e){if(a.lastParts=o,s?.tw_written===!1){a.twDirty=!0,R(t.document,m(t,"code_dock_tw_not_writable")),lt(t),ke(t);return}R(t.document,m(t,"code_dock_saved")),lt(t),t.setTimeout(()=>{const r=t.document.getElementById(u)?.querySelector("[data-sve-code-status]");r&&r.textContent===m(t,"code_dock_saved")&&(r.textContent="")},1800)}ke(t),t.document.getElementById("__sve-section-picker")?.dispatchEvent(new t.CustomEvent("sve-library-stale"))}).catch(n=>{R(t.document,m(t,n?.message==="not_writable"?"code_dock_not_writable":"code_dock_error"))}).finally(()=>{a.saveInFlight=null}),a.saveInFlight}function J(t){a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null);const e=a.lastType,o=a.lastWin,n=v.html;if(!n||n.state.readOnly||!e||!o||!a.lockReady)return;const s=Lo(),r=a.twCss!==null&&Rn(o)&&Ao(s.html)===a.twKey;Fo(s,a.lastParts)&&!(r&&a.twDirty)&&!a.propsDirty||(a.propsDirty=!1,r&&(s.tw=a.twCss,a.twDirty=!1),R(t,m(o,"code_dock_saving")),Nl(o,e,s))}function Ao(t){return Ea(t).sort().join(" ")}function Wl(){a.twCss=null,a.twKey="",a.twDirty=!1}function ql(t,e){a.twCss=e,a.twKey=Ao(t),a.twDirty=!1}function ms(t,e){if(!t||!Rn(t))return;const o=Ao(e);o===a.twKey||a.twBusy||(a.twBusy=!0,zr(()=>import("./tw-compile-CV7No16T.js"),__vite__mapDeps([0,1]),import.meta.url).then(n=>n.compileTailwind(t,e)).then(n=>{a.twBusy=!1,a.twCss=n,a.twKey=o,a.twDirty=!0,gs(t,t.document)}).catch(n=>{a.twBusy=!1,console.error("[sve] tailwind compile",n)}))}function gs(t,e){a.saveTimer&&clearTimeout(a.saveTimer),a.saveTimer=t.setTimeout(()=>{a.saveTimer=null,J(e)},Cu)}function nt(t){if(a.applying)return;const e=Lo();if(Fo(e,a.lastParts)){lt(t);return}if(lt(t),ms(t,e.html),!To(t)){R(t.document,m(t,"code_dock_unsaved"));return}R(t.document,m(t,"code_dock_saving")),gs(t,t.document)}function vs(t,e){let o=0;const n=Math.min(t.length,e.length);for(;o<n&&t[o]===e[o];)o+=1;let s=t.length,r=e.length;for(;s>o&&r>o&&t[s-1]===e[r-1];)s-=1,r-=1;return[o,s,e.slice(o,r)]}function ys(t){const e=a.lastUid,o=typeof G=="function"?G(t.document):[];for(const n of o){const s=pt(n.values)||n.values;if(!(!s||typeof s!="object")&&e&&typeof Uo=="function"){const r=Uo(s,e);if(r){const i=r.split("."),l=Rr(s,i.slice(0,2).join("."));if(l&&typeof l=="object")return l}}}for(const n of o){const s=pt(n.values)||n.values;if(s&&typeof s=="object")return s}return null}function bs(t,e){!e||e===a.lastType||(J(t.document),We(t,e,"push"))}function xs(t){const e=a.typeStack.pop();if(!e){Jt(t);return}J(t.document),We(t,e,"keep")}function It(t){const e=t.document.getElementById(u),o=e?.querySelector("[data-sve-code-lock]"),n=e?.querySelector("[data-sve-code-lock-banner]");if(!e||!o)return;const s=a.lastLocked;e.toggleAttribute("data-sve-code-locked",s),s&&(jn(t.document),rt(t.document),a.htmlPartialUi&&(a.htmlPartialUi.setHover(v.html,null),a.htmlPartialUi.setHover(v.css,null)),a.htmlClassTokenUi?.setHover(v.html,null)),o.hidden=!a.lockReady,o.setAttribute("aria-pressed",a.lastLocked?"true":"false"),o.title=m(t,a.lastLocked?"code_dock_unlock":"code_dock_lock"),o.setAttribute("aria-label",o.title),o.innerHTML=a.lastLocked?Tu:Au,n&&(n.textContent=m(t,"code_dock_locked_banner"))}function Qt(t){return t?tt(t,qe)!=="0":a.htmlScopePref}function Le(t,e,o){return t!=null&&e!=null&&t>=0&&e>t&&e<=o}function at(){const t=globalThis.document?.getElementById(u);t&&(t.__sveHtmlScope=a.htmlScopeActive&&a.htmlFocus?{full:a.htmlFull,from:a.htmlFocus.from,to:a.htmlFocus.to,css:a.cssFull}:null)}function Fe(){const t=v.html?.state.doc.toString()??"";if(!a.htmlScopeActive||!a.htmlFocus){a.htmlFull=t,at();return}if(a.htmlFocus.from<0||a.htmlFocus.from>a.htmlFull.length||a.htmlFocus.to<a.htmlFocus.from){a.htmlScopeActive=!1,a.htmlFull=t,a.htmlFocus=null,at();return}a.htmlFull=a.htmlFull.slice(0,a.htmlFocus.from)+t+a.htmlFull.slice(a.htmlFocus.to),a.htmlFocus={from:a.htmlFocus.from,to:a.htmlFocus.from+t.length},at()}function zt(){return Fe(),a.htmlScopeActive?a.htmlFull:v.html?.state.doc.toString()??a.lastParts.html??""}function Ie(){a.lastBracketNames=Te(zt()).map(t=>t.name)}function Ht(){a.lastCssSelectorNames=Yn(v.css?.state.doc.toString()??a.cssFull)}function ks(t,e){return Array.isArray(t)&&Array.isArray(e)&&t.length===e.length&&t.every((o,n)=>o===e[n])}function Vl(){const t=a.htmlScopeActive?Mo():zt(),e=Ae(t);e.length&&(a.cssFull=So(a.cssFull,ko(a.cssFull,e),e[0].className))}function Ss(t,e){a.cssFull=Ka(a.cssFull,t,e),Vl(),a.cssFull=Ga(a.cssFull,e,t)}function Ul(t){if(a.applying||a.lastLocked||a.lastBracketNames==null)return;const e=Te(zt()).map(o=>o.name);ks(a.lastBracketNames,e)||(Ss(a.lastBracketNames,e),a.lastBracketNames=e,te(),Ht())}function Kl(){if(a.applying||a.lastLocked||a.lastCssSelectorNames==null||a.lastBracketNames==null||a.cssPane==="empty")return;const t=v.html,e=Yn(v.css?.state.doc.toString()??"");if(!t||ks(a.lastCssSelectorNames,e))return;const o=new Set(a.lastBracketNames),{renamed:n,removed:s}=Jn(a.lastCssSelectorNames,e);let r=t.state.doc.toString();const i=r;for(const l of n){const c=wt(l.to);!o.has(l.from)||!c||(r=Jo(r,d=>d===l.from?c:d))}for(const l of s)!o.has(l)||e.includes(l)||(r=Jo(r,c=>c===l?"":c));if(r!==i){a.applying=!0;try{Pe(r)}finally{a.applying=!1}}Ie(),a.lastCssSelectorNames=e}function Gl(t,e){const o=wt(e),n=v.html;if(!o||!n||n.state.readOnly||o===t.name)return;a.applying=!0;try{n.dispatch({changes:{from:t.from,to:t.to,insert:o}})}finally{a.applying=!1}const s=a.lastBracketNames==null?[]:a.lastBracketNames.slice();Ie(),Ss(s,a.lastBracketNames),te(),Ht(),a.lastWin&&(nt(a.lastWin),P(a.lastWin))}function Xl(t,e){const o=t.document,s=v.html?.coordsAtPos(e.from);w(o),rt(o);const r=o.createElement("div"),i={getBoundingClientRect:()=>({left:s?.left??12,right:s?.right??12,top:s?.top??12,bottom:s?.bottom??12,width:0,height:0})};r.id=$,o.body.appendChild(r),W(t,i,r),r._sveApp=q(Co,r,{label:m(t,"code_dock_css_rename_class"),placeholder:m(t,"code_dock_css_class_placeholder"),initial:e.name,onAdd:l=>{Gl(e,l),w(o)}})}function ws(){return a.htmlScopePref&&Le(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)?(a.htmlScopeActive=!0,at(),a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to)):(a.htmlScopeActive=!1,at(),a.htmlFull)}function Oe(t,e,o){const n=v[t];if(!n)return;const s=n.state.doc.toString();a.applying=!0;try{if(s!==e){const[r,i,l]=vs(s,e);n.dispatch({changes:{from:r,to:i,insert:l},...o?{selection:o,scrollIntoView:!0}:{}})}else o&&n.dispatch({selection:o,scrollIntoView:!0})}finally{a.applying=!1}}function Pe(t,e){Oe("html",t,e)}function Mo(){return a.htmlScopeActive?v.html?.state.doc.toString()??"":Le(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)?a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to):""}function dt(){const t=v.css?.state.doc.toString()??"";if(a.cssPane==="tree"){if(t===a.cssScopeSnapshot)return;const e=Ae(Mo())[0]?.className||es(t);a.cssFull=So(a.cssFull,t,e),a.cssScopeSnapshot=t}else a.cssPane==="full"&&(a.cssFull=t)}function _s(t,e){for(const o of e||[])if(!Y(t,o.className)||_s(t,o.children))return!0;return!1}function te(){let t=a.cssFull,e=[],o=!1;a.cssValues||!a.htmlScopePref||!a.htmlScopeActive?(a.cssPane="full",t=a.cssFull):(e=Ae(Mo()),e.length?(a.cssPane="tree",t=ko(a.cssFull,e),_s(a.cssFull,e)&&(a.cssFull=So(a.cssFull,t,e[0].className),o=!0)):(a.cssPane="empty",t="")),a.cssScopeSnapshot=t,Oe("css",t),Ht(),a.lastWin&&(se(a.lastWin,!0),P(a.lastWin),o&&nt(a.lastWin))}function Eo(t){const e=v.html;if(!e||!a.htmlFocus)return;a.htmlScopeActive||(a.htmlFull=e.state.doc.toString());const o=a.htmlFull.length,n=Math.max(0,Math.min(a.htmlFocus.from,o)),s=Math.max(n,Math.min(a.htmlFocus.to,o));if(s<=n)return;a.htmlFocus={from:n,to:s},a.htmlScopeActive=!0,at();const r=t==null?0:Math.max(0,Math.min(t-n,s-n));Pe(a.htmlFull.slice(n,s),{anchor:r,head:r}),te(),e.focus()}function Bo(t=!0,e=null){const o=v.html;if(!o)return;dt(),Fe(),a.htmlScopeActive=!1,at();const n=a.htmlFull||o.state.doc.toString(),s=e!=null?{anchor:Math.max(0,Math.min(e,n.length))}:t&&Le(a.htmlFocus?.from,a.htmlFocus?.to,n.length)?{anchor:a.htmlFocus.from,head:a.htmlFocus.to}:null;a.htmlFull=n,Pe(n,s),a.cssPane="full",a.cssScopeSnapshot=a.cssFull,Oe("css",a.cssFull),Ht()}function De(){a.htmlFocus=null,a.htmlScopeActive=!1,a.htmlFull="",a.cssFull="",a.cssPane="full",a.cssScopeSnapshot="",a.lastBracketNames=null,a.lastCssSelectorNames=null,at()}let Gt=!1;function Ft(t){return!!t?.document.getElementById(zn)}function eo(t,e){if(!(!t||mo(t,"html_tree")===!1)){if(!e){Ft(t)&&Dn(t);return}Ft(t)||(Gt=!0,jr("html_tree").then(()=>{Ft(t)||Nr(t)}).catch(()=>{}).finally(()=>{Gt=!1,X(t)}))}}function X(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-html-scope]");if(!e)return;a.htmlScopePref=Qt(t);const o=mo(t,"html_tree")===!1?a.htmlScopePref:Ft(t)||Gt;e.setAttribute("aria-pressed",o?"true":"false"),e.title=m(t,o?"code_dock_html_scope_off":"code_dock_html_scope"),e.setAttribute("aria-label",e.title),e.innerHTML=Mr,t.document.getElementById(u)?.toggleAttribute("data-sve-html-scoped",a.htmlScopeActive),at()}function cn(t,e){e._sveHtmlScopeBound||(e._sveHtmlScopeBound=!0,a.htmlScopePref=Qt(t),Zl(t,e),eo(t,a.htmlScopePref),e.querySelector("[data-sve-html-scope]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=Ft(t)||Gt;a.htmlScopePref=!n,K(t,qe,a.htmlScopePref?"1":"0"),a.htmlScopePref?a.htmlFocus&&(dt(),Eo()):a.htmlScopeActive&&Bo(),eo(t,a.htmlScopePref),X(t)}))}function Zl(t,e){e._sveTreeWatchBound||(e._sveTreeWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>{if(Gt||mo(t,"html_tree")===!1||!t.document.getElementById(u))return;const o=Ft(t);o!==Qt(t)&&(a.htmlScopePref=o,K(t,qe,o?"1":"0"),o?a.htmlFocus&&(dt(),Eo()):a.htmlScopeActive&&Bo(),X(t))}))}const Yl=new Set(["pre","textarea","script","style"]),Jl=/^(<\/|\{\{\s*\/)/;function Ql(t){let e=0;for(const o of t.split(`
`)){if(!o.trim())continue;const n=o.length-o.trimStart().length;n>0&&(e===0||n<e)&&(e=n)}return" ".repeat(e===2||e===3?e:4)}function tc(t){const e=String(t||"");if(!e.trim())return e;const o=[],n=l=>{for(const c of l||[])o.push(c),n(c.children)};n(ha(e));const s=Ql(e),r=[];let i=0;for(const l of e.split(`
`)){const c=i,d=l.trim();if(i+=l.length+1,!d){r.push("");continue}const h=c+(l.length-l.trimStart().length),f=o.filter(y=>y.from<h&&h<y.to);if(f.some(y=>Yl.has(y.tag))){r.push(l);continue}const p=f.length-(Jl.test(d)?1:0);r.push(s.repeat(Math.max(p,0))+d)}return r.join(`
`)}function $s(t,e){if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?t.length:o+2}if(t.startsWith("<!--",e)){const o=t.indexOf("-->",e+4);return o===-1?t.length:o+3}return e}function oo(t,e){if(t[e]!=="<")return null;const o=t.indexOf(">",e+1);if(o===-1)return null;const n=t.slice(e,o+1),s=n.match(/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/);if(s)return{kind:"close",name:s[1].toLowerCase(),from:e,to:o+1};const r=n.match(/^<([A-Za-z][A-Za-z0-9:-]*)/);if(!r)return{kind:"other",from:e,to:o+1};const i=r[1].toLowerCase();return{kind:/\/\s*>$/.test(n)||["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"].includes(i)?"void":"open",name:i,from:e,to:o+1}}function dn(t,e,o){let n=1,s=o;for(;s<t.length;){const r=$s(t,s);if(r!==s){s=r;continue}if(t[s]!=="<"){s+=1;continue}const i=oo(t,s);if(!i)break;if(i.kind==="open"&&i.name===e)n+=1;else if(i.kind==="close"&&i.name===e&&(n-=1,n===0))return i;s=i.to}return null}function ee(){const t=v.html;if(!t)return null;const e=t.state.selection.main.head,o=t.state.doc.toString(),n=[];let s=0;for(;s<e;){const c=$s(o,s);if(c!==s){s=c;continue}if(o[s]!=="<"){s+=1;continue}const d=oo(o,s);if(!d||d.from>=e)break;if(d.kind==="open")n.push(d);else if(d.kind==="close"){for(let h=n.length-1;h>=0;h-=1)if(n[h].name===d.name){n.splice(h);break}}s=d.to}const r=o.lastIndexOf("<",Math.max(0,e-1));if(r!==-1&&o.indexOf(">",r)>=e){const c=oo(o,r);if(c?.kind==="open"||c?.kind==="void"){const d=c.kind==="void"?null:dn(o,c.name,c.to);return d?{name:c.name,open:c,close:d}:{name:c.name,open:c,close:null}}}const i=n[n.length-1];if(!i)return null;const l=dn(o,i.name,i.to);return{name:i.name,open:i,close:l}}function no(t){return Er.includes(t)}function V(){v.html?.focus(),a.lastWin&&(nt(a.lastWin),ze(a.lastWin))}function bt(t,e,o){const n=[...e].sort((s,r)=>r.from-s.from||r.to-s.to);t.dispatch({changes:n,selection:o})}function Ot(t,e,o){const n=v.html;if(!n||n.state.readOnly)return;const s=n.state.selection.main.head,r=n.state.doc.lineAt(s),i=r.text.slice(0,s-r.from),l=r.text.trim()?ct(r.text):Re(n,r)||ct(r.text);let c=t,d=0;if(i.trim()!=="")c=`
${l}${t}`,d=1+l.length;else if(!r.text.trim()){c=`${l}${t}`,d=l.length,n.dispatch({changes:{from:r.from,to:r.to,insert:c},selection:un(r.from+d+e,o)});return}n.dispatch({changes:{from:s,to:n.state.selection.main.to,insert:c},selection:un(s+d+e,o)})}function un(t,e){return e?{anchor:t,head:t+e}:{anchor:t}}const ec=new Set(["section","article","header","footer","main","nav","aside"]);function fn(t){if(t!=="section")return`<${t}>`;const e=a.lastWin?.Statamic?.$config?.get?.("sveSectionTag");return typeof e=="string"&&e.trim()?`<${t} ${e.trim()}>`:`<${t}>`}function Cs(){const t=v.html;if(!t||t.state.readOnly)return;const e=t.state.doc.toString(),o=(e.match(/^[ \t]*/)||[""])[0],n=tc(e).split(`
`).map(s=>s&&o+s).join(`
`);n!==e&&(bt(t,[{from:0,to:e.length,insert:n}],{anchor:0}),V())}function Ts(t){const e=v.html;if(!e||e.state.readOnly)return;const o=e.state.selection.main,n=e.state.doc.toString();if(!o.empty){const l=n.slice(o.from,o.to),c=l.match(new RegExp(`^<${t}(\\s[^>]*)?>([\\s\\S]*)</${t}>$`,"i"));if(c){bt(e,[{from:o.from,to:o.to,insert:c[2]}],{anchor:o.from,head:o.from+c[2].length}),V();return}const d=fn(t);let h=`${d}${l}</${t}>`,f=o.from+d.length;t==="ul"&&(h=`<ul>
  <li>${l}</li>
</ul>`,f=o.from+11),bt(e,[{from:o.from,to:o.to,insert:h}],{anchor:f,head:f+l.length}),V();return}const s=ee();if(s?.open&&s.close){if(s.name===t){bt(e,[{from:s.close.from,to:s.close.to,insert:""},{from:s.open.from,to:s.open.to,insert:""}],{anchor:s.open.from}),V();return}if(no(s.name)&&no(t)){const l=n.slice(s.open.from,s.open.to).replace(new RegExp(`^<${s.name}`,"i"),`<${t}`);bt(e,[{from:s.close.from,to:s.close.to,insert:`</${t}>`},{from:s.open.from,to:s.open.to,insert:l}],{anchor:s.open.from+t.length+1}),V();return}}const i=(e.state.doc.lineAt(o.head).text.match(/^\s*/)||[""])[0];if(t==="ul"){const l=`<ul>
${i}  <li></li>
${i}</ul>`;Ot(l,`<ul>
${i}  <li>`.length)}else{const l=fn(t),c=`${l}</${t}>`;Ot(c,ec.has(t)?l.length:c.length)}V()}function ze(t){try{oc(t)}catch{}}function oc(t){const e=t?.document?.getElementById(u),n=ee()?.name||"";if(e)for(const s of ho){const r=e.querySelector(`[data-sve-html-tool="${s.id}"]`);if(!r)continue;(s.id==="heading"?no(n):n===s.tag)?r.setAttribute("data-active",""):r.removeAttribute("data-active")}}function hn(t,e,o){const n=t.document,s=ee()?.name||"";w(n),e.setAttribute("data-open","");const r=n.createElement("div");r.id=$,n.body.appendChild(r),W(t,e,r),r._sveApp=q(ot,r,{kind:"choices",choices:o.map(i=>({value:i,label:i.toUpperCase(),active:s===i})),onPick:i=>{Ts(i),w(n)}})}function nc(t,e){const o=t.document;w(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=$,o.body.appendChild(n),W(t,e,n);const s=r=>{o.getElementById($)&&(n._sveApp?.unmount(),n._sveApp=q(ot,n,{kind:"choices",choices:r,onPick:i=>{i&&(Ot(i,i.length),V()),w(o)}}),W(t,e,n))};s([{value:"",label:m(t,"code_dock_loading")}]),t.fetch("/!/sve/components",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(r=>r.ok?r.json():{items:[]}).then(r=>{const i=Array.isArray(r.items)?r.items:[];s(i.length?i.map(l=>({value:l.tag,label:l.name})):[{value:"",label:m(t,"component_none")}])}).catch(()=>s([{value:"",label:m(t,"component_none")}]))}function sc(t){const e=wt(t),o=v.html,n=v.css;if(!e||o?.state.readOnly||n?.state.readOnly)return;const s=ee();if(s?.open&&o){const r=o.state.doc.sliceString(s.open.from,s.open.to),i=za(r,e);i!==r&&o.dispatch({changes:{from:s.open.from,to:s.open.to,insert:i}})}dt(),Y(a.cssFull,e)||(a.cssFull=`${String(a.cssFull||"").trimEnd()}${a.cssFull?.trim()?`
`:""}.${e} {
}
`),te(),Ie(),Ht(),a.lastWin&&(nt(a.lastWin),ze(a.lastWin),P(a.lastWin))}function rc(t,e){const o=t.document;if(e.hasAttribute("data-open")){w(o);return}w(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=$,o.body.appendChild(n),W(t,e,n),n._sveApp=q(Co,n,{label:m(t,"code_dock_css_class_name"),placeholder:m(t,"code_dock_css_class_placeholder"),onAdd:s=>{sc(s),w(o)}})}function ac(t,e){const o=e.querySelector("[data-sve-css-add-class]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=Fu,o.title=m(t,"code_dock_css_add_class"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),a.styleMode==="tw"){w(t.document),pa(t,o);return}rc(t,o)}))}function Lo(){const t={html:"",css:"",js:""};Fe(),dt();for(const e of it)e==="html"?t.html=a.htmlScopeActive?a.htmlFull:v.html?.state.doc.toString()??"":e==="css"?(t.css=a.lastWin?fl(a.cssFull,gt(a.lastWin)):a.cssFull,t.css=Ll(t.css,t.html,wu)):t[e]=v[e]?.state.doc.toString()??"";return t}function As(){if(a.cssValues||!(a.htmlScopePref&&Le(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)))return a.cssPane="full",a.cssScopeSnapshot=a.cssFull,a.cssFull;const t=Ae(a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to));if(!t.length)return a.cssPane="empty",a.cssScopeSnapshot="","";a.cssPane="tree";const e=ko(a.cssFull,t);return a.cssScopeSnapshot=e,e}function oe(t,e){a.applying=!0;try{a.lastWin&&(a.htmlScopePref=Qt(a.lastWin)),a.htmlFull=t.html??"",a.cssFull=t.css??"";for(const o of it){const n=v[o];let s=t[o]??"";try{s=o==="html"?ws():o==="css"?As():s}catch{s=o==="html"?a.htmlFull||t.html||"":o==="css"?a.cssFull||t.css||"":s}if(!n)continue;const r=n.state.doc.toString(),i=[Vt[o].reconfigure(we.readOnly.of(!!e)),Ut[o].reconfigure(N.editable.of(!e))];r!==s?n.dispatch({changes:{from:0,to:r.length,insert:s},effects:i}):n.dispatch({effects:i})}}finally{a.applying=!1}Ie(),Ht(),go("dock:html-changed"),a.lastWin&&(P(a.lastWin),ze(a.lastWin),X(a.lastWin),ae(a.lastWin))}function Fo(t,e){return t.html===e.html&&t.css===e.css&&t.js===e.js}function Ms(t){return String(t||"").replace(/\/\*[\s\S]*?\*\//g,"").trim().replace(/\s*:\s*/g,": ").replace(/\s*;\s*/g,";").replace(/\s+/g," ").replace(/;+$/,";")}function Es(t){const e=Ms(t).match(/^([a-z-]+)\s*:/i);return e?e[1].toLowerCase():""}function Bs(t){const e=Ms(t),o=e.indexOf(":");return o===-1?"":e.slice(o+1).replace(/;$/,"").trim().toLowerCase()}function z(t){const e=String(t||"").trim().toLowerCase();return e==="start"||e==="flex-start"||e==="left"||e==="top"?"flex-start":e==="end"||e==="flex-end"||e==="right"||e==="bottom"?"flex-end":e==="row-reverse"?"row-reverse":e==="column-reverse"?"column-reverse":e}function Xt(t){const e=z(t);return e==="flex"||e==="inline-flex"}function He(){const t=v.css;if(!t)return null;const e=t.state.selection.main.head,o=t.state.doc.toString(),n=[],s=[];for(let i=0;i<o.length;i+=1){if(o[i]==="{"&&o[i+1]==="{"){const l=o.indexOf("}}",i+2);if(l===-1)break;i=l+1;continue}if(o[i]==="{")n.push(i);else if(o[i]==="}"){const l=n.pop();l!=null&&s.push({from:l+1,to:i,text:o.slice(l+1,i),open:l})}}let r=null;for(const i of s)e<i.open||e>i.to||(!r||i.to-i.open<r.to-r.open)&&(r=i);return r}function ic(t){const e=String(t||"");let o="",n=0;for(let s=0;s<e.length;s+=1){if(e[s]==="{"&&e[s+1]==="{"){const r=e.indexOf("}}",s+2);if(r===-1)break;n===0&&(o+=e.slice(s,r+2)),s=r+1;continue}if(e[s]==="{"){n+=1;continue}if(e[s]==="}"){n=Math.max(0,n-1);continue}n===0&&(o+=e[s])}return o}function pn(t){const e={};for(const o of ic(t).split(";")){const n=Es(o);n&&(e[n]=Bs(`${o};`))}return e}function lc(t,e,o){if(!e||e.from>=e.to)return null;let n=t.state.doc.lineAt(e.from),s=0;for(;n.from<=e.to;){const r=Math.max(n.from,e.from),i=Math.min(n.to,e.to),l=t.state.doc.sliceString(r,i);if(s===0&&Es(l)===o)return{from:r,to:i,text:l};if(s+=cc(l),n.to>=t.state.doc.length||n.to>=e.to)break;n=t.state.doc.lineAt(n.to+1)}return null}function cc(t){let e=0;const o=String(t);for(let n=0;n<o.length;n+=1){if(o[n]==="{"&&o[n+1]==="{"){const s=o.indexOf("}}",n+2);n=s===-1?o.length:s+1;continue}o[n]==="{"?e+=1:o[n]==="}"&&(e-=1)}return e}function ct(t){return(String(t).match(/^\s*/)||[""])[0]}function Re(t,e,o){for(let n=e.number-1;n>=1;n-=1){const s=t.state.doc.line(n),r=s.text.trim();if(!r)continue;const i=ct(s.text);if(o&&(r==="{"||r.endsWith("{")))return`${i}  `;if(!(r==="}"||r.startsWith("}")))return i}return""}function dc(t,e){const o=t.state.doc.lineAt(e);if(o.text.trim())return ct(o.text);const n=Re(t,o,!0);if(n)return n;const s=He();return s?Ls(t,s):"  "}function Ls(t,e){const o=t.state.doc.lineAt(e.from),n=t.state.doc.lineAt(Math.max(e.from,e.to));for(let r=n.number;r>=o.number;r-=1){const i=t.state.doc.line(r),l=Math.max(i.from,e.from),c=Math.min(i.to,e.to),d=t.state.doc.sliceString(l,c);if(d.trim())return(d.match(/^\s*/)||[""])[0]||"  "}return`${(t.state.doc.lineAt(Math.max(0,e.from-1)).text.match(/^\s*/)||[""])[0]}  `}function mn(){v.css?.focus(),a.lastWin&&(nt(a.lastWin),P(a.lastWin))}function Fs(t,e){if(!e)return"";const o=t.state.doc.toString();let n=0;for(let s=e.open-1;s>=0;s-=1)if(o[s]==="}"||o[s]==="{"||o[s]===";"){n=s+1;break}return o.slice(n,e.open).replace(/\/\*[\s\S]*?\*\//g,"").trim()}function uc(t,e){if(!a.cssState||!e)return e;const o=Is(t,e);if(o)return o;const n=Fs(t,e);if(!n||n.startsWith("@"))return e;const s=t.state.doc.toString(),r=xt(s,e.open),i=xt(s,e.to)||`${r}    `,l=(t.state.doc.sliceString(e.from,e.to).match(/\n([^\S\n]*)$/)||[null,null])[1],c=l===null?e.to:e.to-l.length,d=`
${i}&${Ne()} {
${i}}
${l??r}`;t.dispatch({changes:{from:c,to:e.to,insert:d}});const h=t.state.doc.toString(),f=h.indexOf("{",c+d.indexOf("&")),p=f===-1?-1:Pt(h,f);return p===-1?e:{from:f+1,to:p,text:h.slice(f+1,p),open:f}}function xt(t,e){const o=t.lastIndexOf(`
`,e-1)+1;return(t.slice(o,e).match(/^\s*/)||[""])[0]}function Q(t){const e=v.css;if(!e||e.state.readOnly||!t.length)return;const o=He(),n=t.some(l=>l.value!=null)?uc(e,o):o;if(!n){const l=t.filter(c=>c.value!=null).map(c=>`${c.property}: ${c.value};`).join(`
`);l&&pc(l),mn();return}const s=[],r=[],i=Ls(e,n);for(const l of t){const c=lc(e,n,l.property);if(l.value==null){if(!c)continue;let d=c.from,h=c.to;e.state.doc.sliceString(h,h+1)===`
`&&(h+=1),d=Math.max(d,n.from),h=Math.min(h,n.to),s.push({from:d,to:h});continue}if(!(c&&z(Bs(c.text))===z(l.value)))if(c){const d=(c.text.match(/^\s*/)||[""])[0];s.push({from:c.from,to:c.to,insert:`${d}${l.property}: ${l.value};`})}else r.push(`${i}${l.property}: ${l.value};`)}if(r.length){const l=!n.text.includes(`
`)||!/\n\s*$/.test(n.text)?`
`:"",c=(n.text.match(/\n([^\S\n]*)$/)||[null,null])[1],d=c===null?n.to:n.to-c.length,h=c===null?"":c;s.push({from:d,to:n.to,insert:`${l}${r.join(`
`)}
${h}`})}s.length&&(s.sort((l,c)=>c.from-l.from||c.to-l.to),e.dispatch({changes:s})),mn()}function et(){const t=v.css,e=He();if(!e)return{};if(a.cssState&&t){const o=Is(t,e);return o?pn(o.text):{}}return pn(e.text)}function Is(t,e){const o=Fs(t,e),n=Ne();if(!o||o.startsWith("@"))return null;if(o.endsWith(n))return e;const s=t.state.doc.toString(),r=i=>{const l=Pt(s,i);return l===-1?null:{from:i+1,to:l,text:s.slice(i+1,l),open:i}};for(const i of[`&${n}`,`${o}${n}`]){const l=new RegExp(`(^|[^\\w-])${i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\s*\\{`,"g");let c;for(;c=l.exec(s);){const d=s.indexOf("{",c.index);if(i.startsWith("&")&&(d<e.from||d>e.to))continue;const h=r(d);if(h)return h}}return null}function fc(t){const e=et(),o=Xt(e.display),n=z(e["flex-direction"])||(o?"row":"");if(o&&n===t){const s=[];e["flex-direction"]&&s.push({property:"flex-direction",value:null}),Xt(e.display)&&s.push({property:"display",value:null}),Q(s);return}Q([{property:"display",value:"flex"},{property:"flex-direction",value:t}])}function hc(t){const e=et();if(t==="flex"&&Xt(e.display)){Q([{property:"justify-content",value:null},{property:"align-items",value:null},{property:"flex-direction",value:null},{property:"display",value:null}]);return}Q([{property:"display",value:t}])}function pc(t){const e=v.css;if(!e||e.state.readOnly)return;const o=e.state.selection.main.head,n=e.state.doc.lineAt(o),s=n.text.slice(0,o-n.from),r=n.text.slice(o-n.from),i=dc(e,o),l=t.replace(/;?$/,";");if(s.trim()===""&&r.trim()===""){const d=`${i}${l}
${i}`;e.dispatch({changes:{from:n.from,to:n.to,insert:d},selection:{anchor:n.from+d.length}});return}const c=`
${i}${l}
${i}`;e.dispatch({changes:{from:o,to:e.state.selection.main.to,insert:c},selection:{anchor:o+c.length}})}function P(t){try{mc(t),re(t)}catch{}}function mc(t){const e=a.styleMode==="tw",o=e?{}:et(),n=Xt(e?Xo("display"):o.display),s=z(o["flex-direction"])||(n?"row":""),r=i=>e?va()&&!!i.tw&&!!Xo(i.tw):!!i.css&&i.css in o;ft.tools=Lr.map(i=>{const l=(i.kids||[]).filter(c=>c.when!=="flex"||n).map(c=>({id:c.id,title:c.title,icon:Mn[c.icon]||"",sep:!!c.sep,open:a.cssOpenMenu===c.id,active:e?r(c):c.kind==="display"?n:c.kind==="flexDir"?n&&s===c.value:c.value?z(o[c.css])===z(c.value):r(c)}));return{id:i.id,title:i.title,icon:Mn[i.id]||Ou[i.id]||"",open:a.cssOpenTool===i.id||a.cssOpenMenu===i.id,kids:l,active:i.value?!e&&z(o[i.css])===z(i.value):r(i)||l.some(c=>c.active)}})}function w(t){const e=t?.getElementById($);a.cssOpenMenu="",e?._sveApp?.unmount(),e?.remove(),t?.querySelectorAll("[data-sve-css-tool][data-open], [data-sve-html-tool][data-open], [data-sve-css-add-class][data-open], [data-sve-code-history][data-open]").forEach(o=>o.removeAttribute("data-open"))}function df(t){w(t),kt(t),rt(t);for(const e of it)v[e]&&mr?.(v[e])}function Os(t){if(a.cssColorsPromise)return a.cssColorsPromise;const e=t.Statamic?.$config?.get?.("cpUrl")||`/${t.Statamic?.$config?.get?.("cpRoute")||"cp"}`;return a.cssColorsPromise=t.fetch(`${e}/color-scheme/swatches`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async o=>{if(!o.ok)return[];const n=await o.json().catch(()=>[]);return Array.isArray(n)?n:[]}).catch(()=>[]).then(o=>{const n=new Set,s=[];for(const r of o){const i=r.var||r.value||r.handle,l=String(i||"").trim().replace(/^var\((.+)\)$/,"$1");!l||n.has(l)||(n.add(l),s.push({name:l,hex:r.hex||r.color||""}))}for(const[r,i]of Br)n.has(r)||(n.add(r),s.push({name:r,hex:i}));return s}),a.cssColorsPromise}function Ps(t,e){const o=et()[e]||"",n=String(o).match(/^var\(\s*([^)]+?)\s*\)$/i),s=n?n[1].trim():"";for(const r of t.querySelectorAll("[data-sve-css-token]"))s&&r.getAttribute("data-sve-css-token")===s?r.setAttribute("data-active",""):r.removeAttribute("data-active")}function W(t,e,o){const n=e.getBoundingClientRect(),s=8;o.style.left=`${Math.max(s,Math.min(n.left,t.innerWidth-220))}px`,o.style.top=`${Math.max(s,n.bottom+4)}px`}function gc(t,e,o){const n=t.document;w(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=$,n.body.appendChild(s),W(t,e,s);const r=i=>{s._sveApp?.unmount(),s._sveApp=q(ot,s,{kind:"colors",swatches:i,onClear:()=>{Q([{property:o,value:null}]),w(n)},onPick:l=>{Q([{property:o,value:`var(${l})`}]),w(n)}}),Ps(s,o)};r(Br.map(([i,l])=>({name:i,hex:l}))),Os(t).then(i=>{n.getElementById($)&&r(i.map(l=>({name:l.name,hex:l.hex})))})}function vc(t,e,o,n){const s=t.document;w(s),e.setAttribute("data-open","");const r=s.createElement("div"),i=et()[o]||"";r.id=$,s.body.appendChild(r),W(t,e,r),r._sveApp=q(ot,r,{kind:"choices",choices:(n||[]).map(l=>({value:l,label:l,active:z(l)===z(i)})),onPick:l=>{const c=z(l)===z(et()[o]||"");Q([{property:o,value:c?null:l}]),w(s)}})}function gn(t,e,o,n=[]){const s=t.document;w(s),e.setAttribute("data-open",""),ma(t);const r=s.createElement("div");r.id=$,s.body.appendChild(r),W(t,e,r);const i=()=>{const l=[...n.map(d=>({value:d,label:d})),...ga(t,o).map(d=>({value:d.value,label:d.value}))],c=et()[o]||"";r._sveApp?.unmount(),r._sveApp=q(ot,r,{kind:"choices",choices:l.map(d=>({...d,active:z(d.value)===z(c)})),onPick:d=>{Q([{property:o,value:d||null}]),w(s)}})};i(),Os(t).then(()=>{s.getElementById($)===r&&i()})}function yc(t,e,o){const n=t.document;w(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=$,n.body.appendChild(s),W(t,e,s),s._sveApp=q(ot,s,{kind:"choices",choices:Iu.map(r=>({value:r,token:r,label:r})),onPick:r=>{Q([{property:o,value:`var(${r})`}]),w(n)}}),Ps(s,o)}const vn=/\{\{#[\s\S]*?#\}\}|\{\{[\s\S]*?\}\}/g,yn=/<!--[\s\S]*?-->/g,bn=/<(\/?)([A-Za-z][A-Za-z0-9-]*)/g,Ds=/^\{\{\s*(?:\/|endif\b|endunless\b)/,bc=/^\{\{\s*(?:\/\s*(?:if|unless)\b|endif\b|endunless\b)/,xc=/^\{\{\s*\/\s*partial\b/;function Ge(t,e,o){return t.some(n=>e<n.to&&o>n.from)}function kc(t){const e=new Map;for(const o of ya(t)){const n=o.kind==="loop"?"loop":"if";e.set(o.from,n);const s=t.lastIndexOf("{{",o.to-2);s>=o.openTo&&Ds.test(t.slice(s,o.to))&&e.set(s,n)}for(const o of Hn(t))e.set(o.from,"component");return e}function Sc(t){const e=String(t||""),o=[],n=[];yn.lastIndex=0;let s;for(;s=yn.exec(e);)o.push({from:s.index,to:s.index+s[0].length});const r=kc(e),i=[];for(vn.lastIndex=0;s=vn.exec(e);){const l=s.index,c=l+s[0].length,d=s[0];if(Ge(o,l,c))continue;if(i.push({from:l,to:c}),d.startsWith("{{#")){n.push({from:l,to:c,cls:"comment"});continue}const h=Ds.test(d),f=r.get(l)||(h&&bc.test(d)?"if":"")||(h&&xc.test(d)?"component":"");n.push({from:l,to:c,cls:(f?`fam-${f}`:"antlers")+(h?"-close":"")})}for(bn.lastIndex=0;s=bn.exec(e);){const l=s.index+1+s[1].length,c=l+s[2].length;Ge(o,l,c)||Ge(i,l,c)||n.push({from:l,to:c,cls:`fam-${Wr(s[2])}`})}return n.sort((l,c)=>l.from-c.from),n}function xn(t,e,o){const n=new e.RangeSetBuilder;let s=0;for(const r of Sc(t.doc.toString()))r.from<s||(n.add(r.from,r.to,o(r.cls)),s=r.to);return n.finish()}function wc(t){const e=new Map,o=r=>r==="comment"?"sve-cm-antlers-comment":r==="antlers"?"sve-cm-antlers":r==="antlers-close"?"sve-cm-antlers sve-cm-antlers-close":r.endsWith("-close")?`sve-cm-${r.slice(0,-6)} sve-cm-antlers-close`:`sve-cm-${r}`,n=r=>(e.has(r)||e.set(r,t.Decoration.mark({class:o(r)})),e.get(r));return{extensions:[t.StateField.define({create(r){return xn(r,t,n)},update(r,i){return i.docChanged?xn(i.state,t,n):r},provide:r=>t.EditorView.decorations.from(r)})]}}const L=po({tag:"",emptyText:"",addLabel:"",dropTitle:"",chips:[],states:[],canEdit:!1,onAdd:null,onChip:null,onDrop:null}),_c={class:"sve-al"},$c={class:"sve-al-head"},Cc={key:0,class:"sve-al-tag"},Tc=["title","disabled"],Ac={key:0,class:"sve-al-empty"},Mc={class:"sve-al-chips"},Ec=["data-sve-al-chip","title","disabled","onClick"],Bc={class:"sve-al-name"},Lc={key:0,class:"sve-al-value"},Fc=["title","onClick"],Ic={__name:"AlpinePanel",setup(t){return(e,o)=>(x(),k("div",_c,[g("div",$c,[T(L).tag?(x(),k("span",Cc,"<"+A(T(L).tag)+">",1)):j("",!0),(x(!0),k(D,null,U(T(L).states,n=>(x(),k("span",{key:n,class:"sve-al-state"},A(n),1))),128)),o[1]||(o[1]=g("span",{class:"sve-al-gap"},null,-1)),g("button",{type:"button","data-sve-al-add":"",title:T(L).addLabel,disabled:!T(L).canEdit,onClick:o[0]||(o[0]=I(n=>T(L).onAdd?.(n),["prevent","stop"]))},"+",8,Tc)]),T(L).chips.length?j("",!0):(x(),k("div",Ac,A(T(L).emptyText),1)),g("div",Mc,[(x(!0),k(D,null,U(T(L).chips,n=>(x(),k("span",{key:n.id,class:"sve-al-chip-wrap"},[g("button",{type:"button","data-sve-al-chip":n.id,title:n.title,disabled:!T(L).canEdit,onClick:I(s=>T(L).onChip?.(s,n.id),["prevent","stop"])},[g("span",Bc,A(n.name),1),n.value?(x(),k("span",Lc,A(n.value),1)):j("",!0)],8,Ec),T(L).canEdit?(x(),k("button",{key:0,type:"button",class:"sve-al-drop",title:T(L).dropTitle,onClick:I(s=>T(L).onDrop?.(n.id),["prevent","stop"])},"−",8,Fc)):j("",!0)]))),128))])]))}},Oc=On(Ic,[["__scopeId","data-v-15add965"]]),Pc=[{id:"state",lang:"alpine_group_state"},{id:"act",lang:"alpine_group_act"},{id:"react",lang:"alpine_group_react"}],kn=[{id:"state",group:"state",label:"alpine_state",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: false }"}]},{id:"state_text",group:"state",label:"alpine_state_text",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: '|' }"}]},{id:"toggle",group:"act",label:"alpine_toggle",icon:"toggle",needsName:!0,attrs:[{name:"@click",value:":name = !:name"}]},{id:"open",group:"act",label:"alpine_open",icon:"open",needsName:!0,attrs:[{name:"@click",value:":name = true"}]},{id:"close",group:"act",label:"alpine_close",icon:"close",needsName:!0,attrs:[{name:"@click",value:":name = false"}]},{id:"open_hover",group:"act",label:"alpine_open_hover",icon:"open",needsName:!0,attrs:[{name:"@mouseenter",value:":name = true"}]},{id:"close_leave",group:"act",label:"alpine_close_leave",icon:"close",needsName:!0,attrs:[{name:"@mouseleave",value:":name = false"}]},{id:"open_focus",group:"act",label:"alpine_open_focus",icon:"open",needsName:!0,attrs:[{name:"@focusin",value:":name = true"}]},{id:"close_blur",group:"act",label:"alpine_close_blur",icon:"close",needsName:!0,attrs:[{name:"@focusout",value:":name = false"}]},{id:"close_outside",group:"act",label:"alpine_close_outside",icon:"outside",needsName:!0,attrs:[{name:"@click.outside",value:":name = false"}]},{id:"close_escape",group:"act",label:"alpine_close_escape",icon:"escape",needsName:!0,attrs:[{name:"@keydown.escape.window",value:":name = false"}]},{id:"show",group:"react",label:"alpine_show",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"}]},{id:"show_smooth",group:"react",label:"alpine_show_smooth",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"},{name:"x-transition",value:""}]},{id:"hide_until_ready",group:"react",label:"alpine_hide_until_ready",icon:"cloak",attrs:[{name:"x-cloak",value:""}]},{id:"class_when",group:"react",label:"alpine_class_when",icon:"klass",needsName:!0,attrs:[{name:":class",value:":name ? '|' : ''"}]},{id:"text",group:"react",label:"alpine_text",icon:"text",needsName:!0,attrs:[{name:"x-text",value:":name"}]}];function Dc(t){return(t?.attrs||[]).map(e=>e.name).join(" ")}const zc=/^(x-[\w:.-]+|@[\w:.-]+|:[\w-]+)$/;function Hc(t){return zc.test(String(t||""))}function ne(t){const e=String(t||""),o=[],n=/([@:a-zA-Z_][\w:.@-]*)(\s*=\s*(["'])([\s\S]*?)\3)?/g;let s,r=!0;for(;s=n.exec(e);){if(r){r=!1;continue}s[0].trim()&&o.push({name:s[1],value:s[4]??"",from:s.index,to:s.index+s[0].length,alpine:Hc(s[1])})}return o}function zs(t){const e=String(t||"").trim().replace(/^\{|\}$/g,""),o=[],n=/(^|,)\s*([a-zA-Z_$][\w$]*)\s*:/g;let s;for(;s=n.exec(e);)o.push(s[2]);return o}function Rc(t,e){return t.map(o=>({name:o.name,value:String(o.value).replaceAll(":name:",`${e}:`).replaceAll(":name",e)}))}function Io(t,e,o){const n=v.html,s=Ct();if(!n||n.state.readOnly||!s)return;const r=a.htmlScopeActive&&!!a.htmlFocus,i=r?a.htmlFocus.from:0,c=(r?a.htmlFull:n.state.doc.toString()).slice(s.from,s.openTo),d=o===""?e:`${e}="${o}"`,h=ne(c).find(p=>p.name===e);let f;if(h)f=c.slice(0,h.from)+d+c.slice(h.to);else{const p=c.search(/\s|\/?>$/);f=p===-1?c:`${c.slice(0,p)} ${d}${c.slice(p)}`}f!==c&&(bt(n,[{from:s.from-i,to:s.openTo-i,insert:f}],null),je(t))}function jc(t,e){const o=v.html,n=Ct();if(!o||o.state.readOnly||!n)return;const s=a.htmlScopeActive&&!!a.htmlFocus,r=s?a.htmlFocus.from:0,l=(s?a.htmlFull:o.state.doc.toString()).slice(n.from,n.openTo),c=ne(l).find(f=>f.name===e);if(!c)return;let d=c.from;for(;d>0&&/\s/.test(l[d-1]);)d-=1;const h=l.slice(0,d)+l.slice(c.to);bt(o,[{from:n.from-r,to:n.openTo-r,insert:h}],null),je(t)}function so(t){const e=v.html;if(!e)return[];const n=a.htmlScopeActive&&!!a.htmlFocus?a.htmlFull:e.state.doc.toString(),s=Ct(),r=[],i=Nn(Ce(n),new Set);for(const l of i){if(!s||l.from>s.from||l.to<s.to)continue;const c=ne(n.slice(l.from,l.openTo)).find(d=>d.name==="x-data");c&&r.push(...zs(c.value))}return[...new Set(r)]}function Nc(t){const e=v.html,o=Ct();if(!e||!o)return[];const s=a.htmlScopeActive&&!!a.htmlFocus?a.htmlFull:e.state.doc.toString(),r=ne(s.slice(o.from,o.openTo)).find(i=>i.name==="x-data");return r?zs(r.value):[]}function Wc(t,e){const o=t.document;w(o),e.setAttribute("data-open","");const n=so(),s=o.createElement("div");s.id=$,o.body.appendChild(s),W(t,e,s);const r=!n.length,i=!r&&!Nc().length,c=Pc.filter(d=>d.id==="state"?!i:!r).flatMap(d=>{const h=kn.filter(f=>f.group===d.id);return h.length?[{value:`\0${d.id}`,label:m(t,r&&d.id==="state"?"alpine_group_state_first":d.lang),heading:!0},...h.map(f=>({value:f.id,label:m(t,f.label),hint:Dc(f)}))]:[]});r&&c.push({value:"\0note",label:m(t,"alpine_needs_state"),note:!0}),s._sveApp=q(ot,s,{kind:"choices",choices:c,onPick:d=>{const h=kn.find(f=>f.id===d);if(w(o),!!h){if(!h.needsName){for(const f of h.attrs)Io(t,f.name,f.value);return}qc(t,e,h,n)}}})}function qc(t,e,o,n){const s=t.document,r=l=>{const c=String(l||"").trim().replace(/[^\w$]/g,"");if(w(s),!!c)for(const d of Rc(o.attrs,c))Io(t,d.name,d.value.replace("|",""))};if(!n.length){ro(t,e,r);return}const i=s.createElement("div");i.id=$,s.body.appendChild(i),W(t,e,i),i._sveApp=q(ot,i,{kind:"choices",choices:[{value:"\0head",label:m(t,"alpine_name"),heading:!0},...n.map(l=>({value:l,label:l})),{value:"\0new",label:m(t,"alpine_new_name")}],onPick:l=>{if(l==="\0new"){ro(t,e,r);return}r(l)}})}function ro(t,e,o){const n=t.document;w(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=$,n.body.appendChild(s),W(t,e,s),s._sveApp=q(Co,s,{label:m(t,"alpine_name"),placeholder:m(t,"alpine_name_placeholder"),onAdd:r=>o(r)})}function je(t){const o=t?.document.getElementById(u)?.querySelector("[data-sve-alpine-host]");if(!o)return;const n=Ct(),s=v.html,r=a.htmlScopeActive&&!!a.htmlFocus,i=s?r?a.htmlFull:s.state.doc.toString():"",l=n?ne(i.slice(n.from,n.openTo)):[];L.tag=n?.tag||"",L.canEdit=!a.lastLocked&&!!n,L.emptyText=m(t,n?so().length?"alpine_none_ready":"alpine_none":"alpine_pick"),L.addLabel=m(t,"alpine_add"),L.dropTitle=m(t,"alpine_remove"),L.states=so(),L.chips=l.filter(c=>c.alpine).map(c=>({id:c.name,name:c.name,value:c.value,title:c.value?`${c.name}="${c.value}"`:c.name})),L.onAdd=c=>Wc(t,c.currentTarget),L.onDrop=c=>jc(t,c),L.onChip=(c,d)=>{L.chips.find(f=>f.id===d)&&ro(t,c.currentTarget,f=>Io(t,d,f))},o._sveMounted||(o._sveMounted=!0,$t(o,Oc))}const Vc=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]),Uc=new Set(["html","head","body"]),Sn=new Set(["if","unless","style_push","script_push","sve_defaults","once","noparse","foreach","forelse","loop","cache","nocache","scope","collection","nav","structure","taxonomy","users","search:results","form:create","form:errors"]),Kc=new Set(["collection:count"]);function wn(t){return Kc.has(t)?!1:Sn.has(t)||Sn.has(t.split(":")[0])}const Gc=new Set(["CloseTag","MismatchedCloseTag","IncompleteCloseTag"]),Xc=/^\s*(\/?)\s*([A-Za-z_][A-Za-z0-9_.:-]*)([\s\S]*)$/,Zc=/^\{\{\s*\/?\s*([A-Za-z_][A-Za-z0-9_.:-]*)/,Yc=3e5;function Jc(t){const e=String(t||""),o=[],n=[];let s=0;for(;s<e.length;){const r=e.indexOf("{{",s);if(r===-1)break;if(e.startsWith("{{#",r)){const d=e.indexOf("#}}",r+3);if(d===-1){n.push(r);break}o.push({from:r,to:d+3,comment:!0,body:""}),s=d+3;continue}let i=0,l=r,c=-1;for(;l<e.length;){if(e.startsWith("{{",l)){i+=1,l+=2;continue}if(e.startsWith("}}",l)){if(i-=1,l+=2,i===0){c=l;break}continue}l+=1}if(c===-1){n.push(r),s=r+2;continue}o.push({from:r,to:c,comment:!1,body:e.slice(r+2,c-2)}),s=c}return{tags:o,unclosed:n}}function Qc(t,e){let o=t;for(const n of e)o=o.slice(0,n.from)+" ".repeat(n.to-n.from)+o.slice(n.to);return o}function td(t,e){return t===e||t.startsWith(`${e}:`)}function fe(t,e){return(t.slice(e,e+80).match(/^<\/?([A-Za-z][A-Za-z0-9:-]*)/)?.[1]||"").toLowerCase()}function ed(t,e,o,n,s){const r=c=>s.has(c.name)&&!/\||\?\?/.test(c.rest);for(const c of o){const d=t.slice(c,c+80).match(Zc)?.[1]||"…";n.push({from:c,to:c+2,key:"code_dock_problem_antlers_unclosed",args:{name:d}})}const i=[],l=[];for(const c of e){if(c.comment)continue;const d=c.body.match(Xc);if(!d)continue;const h=!!d[1],f=d[2].toLowerCase(),p=d[3];if(!h&&(f==="elseif"||f==="else")){let y=-1;for(let b=i.length-1;b>=0;b-=1)if(i[b].name==="if"||i[b].name==="unless"){y=b;break}if(y===-1){n.push({from:c.from,to:c.to,key:"code_dock_problem_branch_stray",args:{name:f}});continue}l.push({from:i[y].to,to:c.from}),i[y]={...i[y],to:c.to},i.length=y+1;continue}if(h||f==="endif"||f==="endunless"){const y=f==="endif"?"if":f==="endunless"?"unless":f;let b=-1;for(let B=i.length-1;B>=0;B-=1)if(td(i[B].name,y)){b=B;break}if(b===-1){n.push({from:c.from,to:c.to,key:"code_dock_problem_pair_stray",args:{name:y}});continue}for(const B of i.slice(b+1))wn(B.name)&&n.push({from:B.from,to:B.to,key:"code_dock_problem_pair_unclosed",args:{name:B.name}});(y==="if"||y==="unless")&&l.push({from:i[b].to,to:c.from}),i.length=b;continue}p.trim().startsWith("=")||i.push({name:f,rest:p,from:c.from,to:c.to})}for(const c of i)wn(c.name)?n.push({from:c.from,to:c.to,key:"code_dock_problem_pair_unclosed",args:{name:c.name}}):r(c)&&n.push({from:c.from,to:c.to,key:"code_dock_problem_list_unclosed",args:{name:c.name}});return l}function od(t,e,o,n){const s=e.parse(t),r=new Set,i=[];s.iterate({enter(l){if(l.name==="MismatchedCloseTag"){i.push({from:l.from,to:l.to,key:"code_dock_problem_tag_stray",args:{tag:fe(t,l.from)}});return}if(l.name==="IncompleteCloseTag"){i.push({from:l.from,to:l.to,key:"code_dock_problem_tag_unfinished",args:{tag:fe(t,l.from)}});return}if(l.type.isError){const f=l.node.parent;f&&(f.name==="OpenTag"||f.name==="CloseTag")&&(r.add(f.from),i.push({from:f.from,to:Math.max(f.from+1,l.from),key:"code_dock_problem_tag_unfinished",args:{tag:fe(t,f.from)}}));return}if(l.name!=="Element")return;let c=null,d=!1;for(let f=l.node.firstChild;f;f=f.nextSibling)f.name==="OpenTag"&&(c=f),Gc.has(f.name)&&(d=!0);if(!c||d)return;const h=fe(t,c.from);!h||Vc.has(h)||Uc.has(h)||o.some(f=>c.from>=f.from&&c.from<f.to&&l.to>f.to)||i.push({from:c.from,to:c.to,key:"code_dock_problem_tag_unclosed",args:{tag:h}})}});for(const l of i)l.key==="code_dock_problem_tag_unclosed"&&r.has(l.from)||l.args.tag&&n.push(l)}function nd(t,e,o={}){const n=String(t||"");if(!n.trim()||n.length>Yc)return[];const s=[];try{const{tags:i,unclosed:l}=Jc(n),c=ed(n,i,l,s,new Set(o.lists||[]));e&&od(Qc(n,i),e,c,s)}catch{return[]}const r=new Set;return s.sort((i,l)=>i.from-l.from||i.to-l.to).filter(i=>{const l=`${i.from}:${i.key}`;return r.has(l)?!1:(r.add(l),!0)})}function sd(t,e,o=()=>({})){const n=t.Decoration.mark({class:"sve-cm-problem"}),s=t.StateEffect.define(),r=l=>{const c=nd(l.doc.toString(),e,o()),d=new t.RangeSetBuilder;let h=0;for(const f of c)f.from<h||f.to<=f.from||(d.add(f.from,f.to,n),h=f.to);return{problems:c,decorations:d.finish()}},i=t.StateField.define({create(l){return r(l)},update(l,c){return c.docChanged||c.effects.some(d=>d.is(s))?r(c.state):l},provide:l=>t.EditorView.decorations.from(l,c=>c.decorations)});return{field:i,relint:s,extensions:[i]}}const rd=new Set(["replicator","grid","list","array","table"]);let ge=new Set,Xe=null;function Hs(t){return t.document.getElementById(u)?.querySelector("[data-sve-html-problems]")||null}function ad(t,e,o){const n=Hs(t);if(!n)return;const s=e.state.doc,r=o.map(c=>({from:c.from,line:s.lineAt(Math.min(c.from,s.length)).number,text:m(t,c.key,c.args)})),i=r.map(c=>`${c.line}:${c.text}`).join(`
`);if(n.dataset.sveSignature===i||(n.dataset.sveSignature=i,n.hidden=r.length===0,n.replaceChildren(),!r.length))return;const l=t.document.createElement("span");l.setAttribute("data-sve-problems-title",""),l.textContent=m(t,"code_dock_problems_title"),n.appendChild(l);for(const c of r){const d=t.document.createElement("button"),h=t.document.createElement("b");d.type="button",d.dataset.sveProblemAt=String(c.from),h.textContent=m(t,"code_dock_problem_line",{line:c.line}),d.append(h,t.document.createTextNode(` ${c.text}`)),n.appendChild(d)}}function id(t){const e=Hs(t);!e||e._sveBound||(e._sveBound=!0,e.addEventListener("mousedown",o=>o.preventDefault()),e.addEventListener("click",o=>{const n=o.target.closest("[data-sve-problem-at]"),s=v.html;if(!n||!s)return;o.preventDefault(),o.stopPropagation();const r=Math.min(Number(n.dataset.sveProblemAt)||0,s.state.doc.length);s.dispatch({selection:{anchor:r},effects:N.scrollIntoView(r,{y:"center"})}),s.focus()}))}function ld(t){const e=[],o=n=>{for(const s of n||[])s?.loop&&rd.has(s.type)&&s.var&&!s.parent&&e.push(s.var)};o(t?.section);for(const n of t?.page||[])o(n?.items);return e}function cd(t,e,o){const n={collection:ss(t),set:rs(a.lastType),view:"",scope:""},s=n.set?wo(n):"";if(s===Xe)return;Xe=s;const r=l=>{if(Xe!==s)return;const c=new Set(ld(l)),d=c.size===ge.size&&[...c].every(h=>ge.has(h));ge=c,!d&&v.html===e&&t.queueMicrotask(()=>{v.html===e&&e.dispatch({effects:o.of(null)})})};if(!s){r(null);return}const i=as(s);if(i){r(i);return}is(t,n).then(r)}function dd(t){if(!a.htmlLintUi){const{field:e,relint:o}=sd({Decoration:Et,StateField:At,StateEffect:le,RangeSetBuilder:Mt,EditorView:N},Wo.parser,()=>({lists:ge})),n=N.updateListener.of(s=>{const r=s.transactions.some(i=>i.effects.some(l=>l.is(o)));!s.docChanged&&!r||(s.docChanged&&cd(t,s.view,o),ad(t,s.view,s.state.field(e).problems))});a.htmlLintUi={extensions:[e,n]}}return id(t),a.htmlLintUi}function ud(){if(a.cssGhostUi)return a.cssGhostUi;const t=Et.mark({class:"sve-css-ghost"}),e=o=>{const n=new Mt;if(!a.lastWin)return n.finish();try{for(const s of hl(o.doc.toString(),gt(a.lastWin)))n.add(s.from,s.to,t)}catch{}return n.finish()};return a.cssGhostUi=At.define({create:o=>e(o),update:(o,n)=>n.docChanged?e(n.state):o,provide:o=>N.decorations.from(o)}),a.cssGhostUi}let he=null,Se=null;function fd(){if(he)return he;Se=le.define();const t=Et.line({class:"sve-css-id"}),e=o=>{const n=new Mt;if(!a.lastWin||!a.cssValues)return n.finish();try{const s=o.doc;for(const r of be(s.toString(),gt(a.lastWin),a.cssSize)){const i=s.lineAt(Math.min(r.from,s.length)).number,l=s.lineAt(Math.min(Math.max(r.to-1,r.from),s.length)).number;for(let c=i;c<=l;c+=1)n.add(s.line(c).from,s.line(c).from,t)}}catch{}return n.finish()};return he=At.define({create:o=>e(o),update:(o,n)=>n.docChanged||n.effects.some(s=>s.is(Se))?e(n.state):o,provide:o=>N.decorations.from(o)}),he}function Oo(){Se&&v.css&&v.css.dispatch({effects:Se.of(null)})}function hd(){return a.htmlPartialUi||(a.htmlPartialUi=ka({Decoration:Et,StateField:At,StateEffect:le,RangeSetBuilder:Mt,EditorView:N})),a.htmlPartialUi}function pd(){return a.htmlAntlersUi||(a.htmlAntlersUi=wc({Decoration:Et,StateField:At,RangeSetBuilder:Mt,EditorView:N})),a.htmlAntlersUi}function md(){return a.htmlClassTokenUi||(a.htmlClassTokenUi=Za({Decoration:Et,StateField:At,StateEffect:le,RangeSetBuilder:Mt,EditorView:N})),a.htmlClassTokenUi}function gd(t,e,o){v[e]?.destroy();const n=co.of([{key:"Mod-s",run:()=>(J(t.document),!0)}]);v[e]=new N({state:we.create({doc:"",extensions:[rr(),ar(),ir(),ur(),ru(e),hr(),fr({tooltipClass:()=>"sve-tw-complete"}),...e==="html"?[Wo.data.of({autocomplete:ba(t)}),xa(vr,t)]:[],...e==="html"?[...Ba(),La()]:[],...e==="css"?[kr(),ud(),fd()]:[],co.of([...lr,...e==="html"?[{key:"Tab",run:Fa}]:[],cr,...dr,...gr,...pr]),n,N.lineWrapping,...e==="html"||e==="css"?hd().extensions:[],...e==="html"?pd().extensions:[],...e==="html"?dd(t).extensions:[],...e==="html"?md().extensions:[],Vt[e].of(we.readOnly.of(!!a.lastLocked)),Ut[e].of(N.editable.of(!a.lastLocked)),N.updateListener.of(s=>{e==="html"&&s.docChanged&&!a.applying&&(Ul(),go("dock:html-changed")),e==="css"&&s.docChanged&&!a.applying&&Kl(),s.docChanged&&nt(t),e==="css"&&(s.docChanged||s.selectionSet)&&P(t),e==="css"&&s.docChanged&&!a.applying&&se(t),e==="html"&&(s.docChanged||s.selectionSet)&&(ze(t),je(t),a.applying||ae(t))}),...ca(C,{height:"auto",background:"#1E1E21",scroller:{overflow:"visible",height:"auto",minHeight:0},extraTags:s=>[{tag:s.tagName,color:"#4ec9b0"},{tag:s.attributeName,color:"#9cdcfe"},{tag:s.attributeValue,color:"#ce9178"},{tag:s.angleBracket,color:"#808080"}]})]}),parent:o})}function vd(t){if(!t||t.querySelector(".cm-editor"))return;t.replaceChildren();const e=t.ownerDocument.createElement("span");e.style.cssText="width:16px;height:16px;margin:12px;border:2px solid #858585;border-right-color:transparent;border-radius:50%;display:block;animation:sve-cm-wait .6s linear infinite",t.appendChild(e)}function gt(t){return vo(t).map(e=>({handle:e.handle,base:e.base,max:e.max,media:e.media,media_px:e.media_px,label:e.label}))}function Rs(t,e){return gt(t).find(o=>o.handle===e)||null}function Ne(t=a.cssState){return t?t==="before"||t==="after"?`::${t}`:`:${t}`:""}function se(t,e=!1){const o=v.css;if(!o||!uo||!fo)return;const n=o.state.doc.toString(),s=`${a.cssValues?"1":"0"}|${a.cssSize}|${Be(n).map(h=>`${h.from}-${h.to}`).join(",")}`;if(!e&&s===a.cssFoldSig)return;a.cssFoldSig=s;const r=gt(t),i=new Map,l=[...ul(n,r,a.cssSize),...a.cssValues?[]:be(n,r,a.cssSize).map(h=>({from:h.from,to:h.to}))];for(const h of l)h.to>h.from&&i.set(`${h.from}:${h.to}`,{from:h.from,to:h.to});const c=[],d=new Set;Sr(o.state).between(0,n.length,(h,f)=>{const p=`${h}:${f}`;d.add(p),!i.has(p)&&a.cssOwnFolds.has(p)&&c.push(fo.of({from:h,to:f}))});for(const[h,f]of i)d.has(h)||c.push(uo.of(f));a.cssOwnFolds=new Set(i.keys()),c.length&&o.dispatch({effects:c})}function ao(t,e){const o=a.cssFull||e;return/max-width/i.test(o)&&!/width\s*</i.test(o)&&t.media_px||t.media}function yd(t,e){const o=v.css;if(!o||o.state.readOnly)return;const n=gt(t),s=Rs(t,e),r=o.state.doc.toString();if(!s||s.base){const h=o.state.selection.main.head,f=Be(r).find(p=>h>=p.from&&h<=p.to);f&&o.dispatch({selection:{anchor:f.from},scrollIntoView:!0});return}const i=$o(r,n,e);if(i.length){const h=i[0],f=Math.min(h.bodyTo,h.bodyFrom+(r.slice(h.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);o.dispatch({selection:{anchor:f},scrollIntoView:!0});return}const l=ao(s,r),c=js(o,r),d=`

${c.indent}@media ${l} {
${c.indent}    
${c.indent}}${c.suffix}`;o.dispatch({changes:{from:c.at,to:c.at,insert:d},selection:{anchor:c.at+d.lastIndexOf("    ")+4},scrollIntoView:!0})}function js(t,e){const o=Be(e);if(o.length){const i=o[o.length-1];return{at:i.to,indent:xt(e,i.from),suffix:""}}const n=i=>({at:i.to,indent:xt(e,i.to)||`${xt(e,i.open)}    `,suffix:`
${xt(e,i.open)}`}),s=He();if(s)return n(s);const r=bd(e);return r?n(r):{at:e.length,indent:"",suffix:""}}function bd(t){const e=String(t||"");let o=null,n=0,s=0;for(;n<e.length;){if(e[n]==="}"||e[n]===";"){n+=1,s=n;continue}if(e[n]!=="{"){n+=1;continue}const r=Pt(e,n);if(r===-1||o||(o=e.slice(s,n).trim().startsWith("@")?null:{from:s,open:n,to:r},!o))return null;n=r+1,s=n}return o}function xd(t,e){const o=e===a.cssSize?"":e;a.cssSize=o,K(t,zo,o),St("lp:set-device",{win:t,key:o?qr(o,t):"Responsive"}),o&&yd(t,o),a.cssValues&&Ws(t),se(t,!0),Oo(),re(t),P(t)}function kd(t,e){a.cssState=Ho.includes(e)?e:"",K(t,io,a.cssState),w(t.document),re(t),P(t)}function Sd(t,e){const o=t.document;w(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=$,o.body.appendChild(n),W(t,e,n),n._sveApp=q(ot,n,{kind:"choices",choices:[{value:"",label:m(t,"css_state_none"),active:!a.cssState},...Ho.map(s=>({value:s,label:Ne(s),active:s===a.cssState}))],onPick:s=>kd(t,s)})}function re(t){const o=t?.document.getElementById(u)?.querySelector("[data-sve-css-head]");if(!o)return;const n=Ct(),s=gt(t),r=v.css?.state.doc.toString()??"";F.tag=n?.tag||"",F.scope=Da(n?zt().slice(n.from,n.openTo):"")||"",F.canEdit=!a.lastLocked,F.onTag=i=>Sa(t,i.currentTarget,n),F.state=a.cssState,F.stateLabel=a.cssState?Ne(a.cssState):m(t,"css_state"),F.onState=i=>Sd(t,i.currentTarget),F.onSize=i=>xd(t,i),F.sizes=[{key:"",label:m(t,"tw_size_all"),title:m(t,"css_size_all_title"),active:!a.cssSize},...s.map(i=>{const l=i.base||$o(r,s,i.handle).length>0;return{key:i.handle,label:i.label,title:i.base?m(t,"css_size_base_title"):`@media ${i.media}${l?"":`  ·  ${m(t,"css_size_new")}`}`,active:a.cssSize===i.handle}})],o._sveMounted||(o._sveMounted=!0,$t(o,kl))}$e("lp:device",t=>{const e=a.lastWin;if(!e||!Us(e.document))return;const o=vo(e).find(n=>n.device===t)?.handle||"";o!==a.cssSize&&(a.cssSize=o,K(e,zo,o),se(e,!0),Oo(),re(e),P(e))});function wd(t){const e=Math.max(0,Math.round(Date.now()/1e3-t)),o=new Date(t*1e3).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});let n=o;try{const s=new Intl.RelativeTimeFormat(void 0,{numeric:"auto"});e<90?n=s.format(-e,"second"):e<5400?n=s.format(-Math.round(e/60),"minute"):e<86400?n=s.format(-Math.round(e/3600),"hour"):n=s.format(-Math.round(e/86400),"day")}catch{}return`${n} · ${o}`}function Ns(t,e){return t.fetch(e,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}})}async function _d(t,e){const o=t.document,n=Tt();if(w(o),!n)return;let s=[];try{const i=await Ns(t,`/!/sve/section-template/history?type=${encodeURIComponent(n)}`);i.ok&&(s=(await i.json())?.entries||[])}catch{s=[]}if(!o.getElementById(u)||!o.contains(e))return;e.setAttribute("data-open","");const r=o.createElement("div");r.id=$,o.body.appendChild(r),W(t,e,r),r._sveApp=q(ot,r,{kind:"choices",choices:s.length?s.map(i=>({value:i.id,label:wd(i.at)})):[{value:"",label:m(t,"code_dock_history_empty")}],onPick:i=>{w(o),i&&$d(t,n,i)}})}async function $d(t,e,o){if(mt())return;let n=null;try{const s=await Ns(t,`/!/sve/section-template/history/entry?type=${encodeURIComponent(e)}&id=${encodeURIComponent(o)}`);s.ok&&(n=await s.json())}catch{n=null}!n||mt()||(oe({html:n.html??"",css:n.css??"",js:n.js??""},a.lastLocked),nt(t),ae(t))}function Zt(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-code-strip]");if(!e)return;e.hidden=a.styleMode!=="tw";const o=Wn(t);e.innerHTML=Pu,e.title=m(t,o?"tw_strip_on":"tw_strip_off"),e.setAttribute("aria-label",e.title),e.setAttribute("aria-pressed",o?"true":"false")}function Cd(t,e){const o=e.querySelector("[data-sve-code-strip]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),wa(t,!Wn(t)),Zt(t),_a(t)}),Zt(t))}function Td(t,e){const o=e.querySelector("[data-sve-code-history]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=Du,o.title=m(t,"code_dock_history"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),o.hasAttribute("data-open")){w(t.document);return}_d(t,o)}))}function uf(){return a.styleMode}function Ad(t){return a.styleMode==="tw"?Ct():null}function Ct(t){const e=v.html;if(!e)return null;const o=a.htmlScopeActive&&!!a.htmlFocus,n=o?a.htmlFull:e.state.doc.toString(),r=(o?a.htmlFocus.from:0)+e.state.selection.main.from,i=Nn(Ce(n),new Set);let l=null;for(const c of i)c.from<=r&&r<c.to&&(l=c);return l}function ae(t){a.styleMode==="tw"&&$a(t,Ad())}function Po(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-values-mode]");if(!e||!o)return;e.setAttribute("data-sve-values",a.cssValues?"on":"off");const n=t.document.createElement("span");n.textContent=m(t,"code_dock_values"),o.innerHTML=Hu,o.appendChild(n),o.title=m(t,a.cssValues?"code_dock_values_off":"code_dock_values_on"),o.setAttribute("aria-label",o.title),o.setAttribute("aria-pressed",a.cssValues?"true":"false")}function Ws(t){const e=v.css;if(!e||e.state.readOnly)return;const o=gt(t),n=e.state.doc.toString(),s=be(n,o,a.cssSize);if(e.focus(),s.length){const p=s[0],y=Math.min(p.bodyTo,p.bodyFrom+(n.slice(p.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);e.dispatch({selection:{anchor:y},scrollIntoView:!0});return}const r=Rs(t,a.cssSize);if(!r||r.base){const p=`#id-{{ id }} {
    `;e.dispatch({changes:{from:0,to:0,insert:`${p}
}

`},selection:{anchor:p.length},scrollIntoView:!0});return}const i=$o(n,o,a.cssSize)[0];if(i){const p=`${xt(n,i.from)}    `,y=`
${p}#id-{{ id }} {
${p}    `;e.dispatch({changes:{from:i.bodyFrom,to:i.bodyFrom,insert:`${y}
${p}}
`},selection:{anchor:i.bodyFrom+y.length},scrollIntoView:!0});return}const l=js(e,n),c=`${l.indent}    `,d=be(n,o,"").some(p=>l.at>p.bodyFrom&&l.at<=p.bodyTo),h=d?`

${l.indent}@media ${ao(r,n)} {
${c}`:`

${l.indent}@media ${ao(r,n)} {
${c}#id-{{ id }} {
${c}    `,f=d?`
${l.indent}}${l.suffix}`:`
${c}}
${l.indent}}${l.suffix}`;e.dispatch({changes:{from:l.at,to:l.at,insert:`${h}${f}`},selection:{anchor:l.at+h.length},scrollIntoView:!0})}function Md(t,e){a.cssValues=!!e,K(t,qo,a.cssValues?"1":"0"),w(t.document),a.cssOpenTool="",Po(t),dt(),te(),a.cssValues&&Ws(t),se(t,!0),Oo(),re(t),P(t)}function Do(t){const e=t?.document.getElementById(u);if(!e)return;const o=a.styleMode==="tw";e.setAttribute("data-sve-style",a.styleMode);const n=e.querySelector("[data-sve-css-label]");n&&(n.textContent=o?m(t,"code_dock_style_tw"):m(t,"code_dock_css"));const s=e.querySelector("[data-sve-style-mode]");if(!s)return;const r=t.document.createElement("span");r.textContent=o?m(t,"code_dock_style_tw"):m(t,"code_dock_css"),s.innerHTML=o?Ru:zu,s.appendChild(r),s.title=m(t,o?"code_dock_style_to_css":"code_dock_style_to_tw"),s.setAttribute("aria-label",s.title),s.setAttribute("aria-pressed",o?"true":"false")}function qs(t){t?.document.getElementById(u),w(t.document),to(t),a.cssOpenTool="",a.cssOpenMenu="",a.styleMode==="tw"&&a.cssValues&&(a.cssValues=!1,K(t,qo,"0")),Do(t),Po(t),Zt(t),a.cssToolRow?.(),a.styleMode==="tw"&&(a.htmlScopePref=!0,K(t,qe,"1"),eo(t,!0)),ae(t),je(t),P(t)}const zo="sve-css-size",io="sve-css-state",Ho=["hover","focus","focus-visible","active","disabled","before","after"];function Ed(t,e){a.styleMode=e==="tw"?"tw":"css",K(t,Tr,a.styleMode),qs(t)}function Bd(t,e){if(e._sveStyleModeBound)return;e._sveStyleModeBound=!0,a.styleMode=tt(t,Tr)==="tw"?"tw":"css";const o=tt(t,zo)||"";a.cssSize=vo(t).some(n=>n.handle===o)?o:"",a.cssState=Ho.includes(tt(t,io))?tt(t,io):"",a.cssValues=tt(t,qo)==="1",e.querySelector("[data-sve-style-mode]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Ed(t,a.styleMode==="tw"?"css":"tw")}),e.querySelector("[data-sve-values-mode]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Md(t,!a.cssValues)}),qs(t),Po(t)}function Ld(t,e){const o=e.querySelector("[data-sve-css-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=r=>e.querySelector(`[data-sve-css-tool="${r}"], [data-sve-css-kid="${r}"]`),s=r=>{const i=n(r.id),l=a.cssOpenMenu===r.id;if(w(t.document),l){to(t),P(t);return}if(!i)return;const c=a.styleMode==="tw"?!r.twClass&&!!r.tw:!r.kind&&!r.value&&!(r.css in et())&&!!r.menu,d=()=>{c&&(a.cssOpenMenu=r.id)};if(a.styleMode==="tw"){to(t),r.twClass?(Ca(t,r.twClass),P(t)):r.tw&&(Ta(t,i,r.tw,()=>P(t)),d(),P(t));return}if(r.kind==="flexDir"){fc(r.value);return}if(r.kind==="display"){hc(r.value);return}if(r.value){const h=z(et()[r.css])===z(r.value);Q([{property:r.css,value:h?null:r.value}]);return}if(r.css in et()){Q([{property:r.css,value:null}]),P(t);return}r.menu==="colors"?gc(t,i,r.css):r.menu==="spacing"?yc(t,i,r.css):r.menu==="sizes"?gn(t,i,r.css,Vu):r.menu==="choices"?vc(t,i,r.css,r.choices):r.menu==="values"&&gn(t,i,r.css),d(),P(t)};ft.onTool=r=>{const i=_e.get(r)?.tool;if(i){if(i.kids?.length){a.cssOpenTool=a.cssOpenTool===i.id?"":i.id,w(t.document),P(t);return}s(i)}},ft.onKid=(r,i)=>{const l=_e.get(i);l?.kid&&s(l.kid)},a.cssToolRow=()=>{$t(o,il),P(t)},a.cssToolRow(),t.document.addEventListener("mousedown",r=>{r.target.closest(`#${$}, [data-sve-css-tools], [data-sve-html-tools], [data-sve-css-add-class]`)||w(t.document)},!0)}function Fd(t,e){const o=e.querySelector("[data-sve-html-tidy]");o&&(o.innerHTML=qn.tidy,o.title=m(t,"code_dock_html_tidy"),o.setAttribute("aria-label",o.title),o.setAttribute("data-tip",o.title))}function Id(t,e){const o=e.querySelector("[data-sve-html-tidy]");Fd(t,e),!(!o||o._sveBound)&&(o._sveBound=!0,o.addEventListener("mousedown",n=>n.preventDefault()),o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Cs()}))}function Od(t,e){const o=e.querySelector("[data-sve-html-tools]");!o||o._sveBound||(o._sveBound=!0,$t(o,el,{tools:ho.map(n=>({...n,icon:qn[n.id]||""})),onTool:n=>{const s=ho.find(i=>i.id===n),r=o.querySelector(`[data-sve-html-tool="${n}"]`);if(s){if(s.menu==="heading"){hn(t,r,Er);return}if(s.menu==="text"){hn(t,r,Vr);return}if(s.tidy){Cs();return}if(s.menu==="component"){nc(t,r);return}if(w(t.document),s.snippet){Ot(s.snippet,s.caret??s.snippet.length,s.select),V();return}Ts(s.tag)}}}),tu(t,e),ou(t,e),Qd(t,e))}E("dock:save-now",()=>(J(a.lastWin?.document),!0));let pe=null;async function Pd(t){const e=t.document;uu(e);let o=e.getElementById(u);if(o&&!(o.querySelector('[data-sve-css-chrome="subrow-2"]')&&o.querySelector("[data-sve-css-add-class]")&&o.querySelector("[data-sve-html-tools]")&&o.querySelector("[data-sve-html-tidy]")&&o.querySelector("[data-sve-data-vars]")&&o.querySelector("[data-sve-visual-edit-tools]")&&o.querySelector("[data-sve-html-scope]")&&o.querySelector("[data-sve-code-lock]")&&o.querySelector("[data-sve-code-back]")&&o.querySelector("[data-sve-code-autosave]")&&o.querySelector("[data-sve-code-save]")&&o.getAttribute("data-sve-code-chrome")==="scope-9")){for(const s of it)v[s]?.destroy(),v[s]=null;o.remove(),o=null}if(!o){o=e.createElement("div"),o.id=u,o.setAttribute("data-sve-code-chrome","scope-9"),Qr(o,ta(t)),$t(o,Ki,{htmlLabel:m(t,"code_dock_html"),cssLabel:m(t,"code_dock_css"),jsLabel:m(t,"code_dock_js"),alpineLabel:m(t,"code_dock_alpine"),treeIcon:Mr,dataIcon:Eu,dataLabel:m(t,"data_vars_title")}),Qe(e,o),Cn(o),er(o,Ys(t)),yu(t,o),xu(t,o),bu(t,o),Ld(t,o),ac(t,o),Bd(t,o),Td(t,o),Cd(t,o),ea(t,o),Od(t,o),cn(t,o),an(t,o),Tn(t,o),ln(t,o);for(const n of it){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);vd(s)}oa(t)}if(Qe(e,o),Cn(o),Id(t,o),cn(t,o),an(t,o),Tn(t,o),ln(t,o),mu(t),Ro(t),It(t),X(t),Jt(t),lt(t),Do(t),Zt(t),await Su(),!v.html){for(const n of it){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);s?.replaceChildren(),gd(t,n,s)}for(const n of["html","css"])v[n]&&Aa(t,v[n],{onOpen:s=>bs(t,s),emptyLabel:m(t,"code_dock_partials_empty"),openLabel:s=>m(t,"component_open_named",{name:s}),sectionValues:()=>ys(t),isLocked:()=>mt(),setHover:(s,r)=>a.htmlPartialUi?.setHover(s,r)});Qa(t,v.html,{onRename:n=>Xl(t,n),isLocked:()=>mt(),setHover:(n,s)=>a.htmlClassTokenUi?.setHover(n,s),title:m(t,"code_dock_css_rename_class")})}return o}function Vs(t){return pe||(pe=Pd(t).finally(()=>{pe=null})),pe}async function _n(t,e){const o=await Vs(t);a.lastType=e,a.lastLocked=!0,a.lockReady=!0,a.lastParts={html:"",css:"",js:""},De(),It(t),oe(a.lastParts,!0),sr(t.document,e),R(t.document,m(t,"code_dock_missing")),X(t),Jt(t),lt(t),Yt(t,o)}async function We(t,e,o="replace"){o==="replace"?a.typeStack=[]:o==="push"&&a.lastType&&a.lastType!==e&&a.typeStack.push(a.lastType);const n=++a.loadGen;a.lastType=e,a.lockReady=!1,De(),R(t.document,m(t,"code_dock_loading"));let s=()=>{};a.loadInFlight=new Promise(i=>{s=i});const r=await Vs(t);It(t),X(t),Jt(t),lt(t),Do(t),Zt(t),Yt(t,r),t.fetch(`/!/sve/section-template?type=${encodeURIComponent(e)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async i=>{if(n!==a.loadGen)return;if(i.status===404){_n(t,e);return}if(!i.ok)throw new Error(String(i.status));const l=await i.json();n===a.loadGen&&(a.lastParts={html:typeof l.html=="string"?l.html:"",css:typeof l.css=="string"?l.css:"",js:typeof l.js=="string"?l.js:""},a.lastProps=Array.isArray(l.props)?l.props:[],a.propsDirty=!1,a.lastType=e,a.lastLocked=!!l.locked,a.lockReady=!0,Wl(),typeof l.tw=="string"&&l.tw!==""&&ql(a.lastParts.html,l.tw),It(t),oe(a.lastParts,a.lastLocked),Vn(t),a.lastLocked||ms(t,a.lastParts.html),sr(t.document,l.path||e),R(t.document,a.lastLocked?m(t,"code_dock_locked"):""),l.writable?.template===!1?R(t.document,m(t,"code_dock_not_writable")):l.writable?.tw===!1&&R(t.document,m(t,"code_dock_tw_not_writable")),fs(t),Ji(t),_o(t),X(t),Jt(t),lt(t),Yt(t,r))}).catch(()=>{n===a.loadGen&&(_n(t,e),R(t.document,m(t,"code_dock_error")))}).finally(()=>{n===a.loadGen&&(a.loadInFlight=null),s()})}function Tt(){return a.lastType||""}function Us(t){return!!t?.getElementById(u)}function mt(){return a.lastLocked}function Dd(t,e){const o=typeof e?.html=="string"?e.html.trim():"",n=typeof e?.css=="string"?e.css.trim():"",s=typeof e?.js=="string"?e.js.trim():"";if(!o&&!n&&!s||!t?.document?.getElementById(u))return!1;let r=!1;return o&&(r=zd("html",o)||r),n&&(r=$n("css",n)||r),s&&(r=$n("js",s)||r),r&&nt(t),r}function zd(t,e){const o=v[t];if(!o||o.state.readOnly)return!1;const n=o.state.selection.main,s=n.from>0?o.state.doc.sliceString(n.from-1,n.from):`
`,r=n.to<o.state.doc.length?o.state.doc.sliceString(n.to,n.to+1):`
`,c=`${s===`
`?"":`
`}${e}${r===`
`?"":`
`}`;return o.dispatch({changes:{from:n.from,to:n.to,insert:c},selection:{anchor:n.from+c.length}}),!0}function $n(t,e){const o=v[t];if(!o||o.state.readOnly)return!1;const n=o.state.doc.length,r=`${n>0&&o.state.doc.sliceString(Math.max(0,n-1),n)!==`
`?`

`:n?`
`:""}${e}
`;return o.dispatch({changes:{from:n,insert:r},selection:{anchor:n+r.length}}),!0}function Hd(t){if(ke(t),!a.lastType||!t.document.getElementById(u))return;const e=a.lastType;a.lastType=null,We(t,e,"keep")}function Ks(t){kt(t),a.loadGen+=1,J(t),a.lastUid=null,a.lastType=null,a.typeStack=[],a.lastParts={html:"",css:"",js:""},a.lastLocked=!1,a.lockReady=!1,a.lastBracketNames=null,a.lastCssSelectorNames=null,De(),a.lastWin=t?.defaultView||a.lastWin,w(t),jn(t),rt(t),t?.getElementById(Z)?.remove();for(const o of it)v[o]?.destroy(),v[o]=null;t?.getElementById(u)?.remove(),pu(),t&&jo(t,0);const e=t?.defaultView||a.lastWin;e?.document.getElementById(zn)&&Dn(e),e&&(fs(e),_o(e),Vn(e))}function Rd(t){if(a.dragging)return;const e=t.document.getElementById(u);e&&(Ro(t),Yt(t,e))}function jd(t,e,o){if(o){const r=Ko(o,e)||Ko(o,t.document)||o;return String(typeof Ue=="function"&&(Ue(r,e)||Ue(r,t.document))||"").trim()}const n=typeof Kt=="function"?Kt(t):"page_sections",s=typeof G=="function"?G(t.document):[];for(const r of s){const l=(pt(r.values)||r.values)?.[n];if(Array.isArray(l))for(const c of l){const d=typeof c?.type=="string"?c.type.trim():"";if(d)return d}}return""}function Gs(t){if((t.Statamic?.$config?.get?.("sveFeatures")||{}).collection_templates!==!0)return"";const o=t.Statamic?.$config?.get?.("sveCollectionTemplatesCollection")||"templates";if(!(t.location?.pathname||"").includes(`/collections/${o}/entries/`))return"";const s=typeof G=="function"?G(t.document):[];for(const r of s){const i=pt(r.values)||r.values,l=typeof i?.view=="string"?i.view.trim():"";if(!l||l.includes(".."))continue;const c=l.replace(/\.(antlers\.html|blade\.php)$/i,"").replace(/^\/+|\/+$/g,"");if(c)return`view:${c}`}return""}function Xs(t,e,o){const n=t.Statamic?.$config?.get?.("sveChromeTemplates")||{},s=n[e]&&typeof n[e].type=="string"?n[e]:null,r=t.Statamic?.$config?.get?.("sveChromeStyles")||{},i=`${e}/${typeof r[e]=="string"&&r[e]!==""?r[e]:"style_1"}`,l=s?.type||i,c=o?.[`${e}_style`];return(!s||s.styled)&&typeof c=="string"&&c!==""?`${e}/${c}`:l}function Nd(t,e){const o=na||sa;return o!=="header"&&o!=="footer"||!Gr(e)&&!Xr(e)?"":Xs(t,o,pt(Zr()?.values)||{})}function Wd(t){const e=typeof Kt=="function"?Kt(t):"page_sections",o=typeof G=="function"?G(t.document):[];for(const n of o){const r=(pt(n.values)||n.values)?.[e];if(Array.isArray(r)&&r.length)return!0}return!1}function qd(t){const e=Jr(t);if(!e)return"";const o=["header","footer"].find(n=>e.querySelector(`[data-sve-chrome="${n}"]`));return o?Xs(t,o,null):""}function Vd(t){const e=Yr(t)||t.getElementById("__sve-global-section-host");return e&&e.querySelector("[data-replicator-set][data-type]")?.getAttribute("data-type")||""}function ff(t,e,o){if(a.dragging)return;if(!t||!e||au(e)||!Ur(t)||!Kr(t)){e&&Ks(e);return}const n=Nd(t,e)||Vd(e)||jd(t,e,o)||Gs(t)||(o?"":a.lastType),s=!n&&!o&&!Wd(t)?qd(t):"",r=n||s,i=!!(o&&o!==a.lastUid);if(a.onEmptyPage=!!s,a.lastWin=t,o&&(a.lastUid=o),!!r&&!(r===a.lastType&&e.getElementById(u))){if(a.typeStack.length&&a.lastType&&a.lastType!==r){const l=a.typeStack[0];if(r===l&&!i)return;a.typeStack=[]}J(e),We(t,r,"replace")}}$e("tw:changed",()=>{a.lastWin&&a.styleMode==="tw"&&P(a.lastWin)});E("dock:is-open",t=>Us(t));E("dock:is-locked",()=>mt());E("dock:html",()=>zt());E("dock:reveal-html",({from:t,to:e,caret:o}={})=>{const n=v.html;if(!n||t==null)return;a.htmlScopePref=Qt(a.lastWin),Fe(),dt();const s=a.htmlFull.length,r=Math.max(0,Math.min(t,s)),i=Math.max(r,Math.min(e??t,s));a.htmlFocus=i>r?{from:r,to:i}:null;const l=o==null?null:Math.max(0,Math.min(o,s));if(a.htmlScopePref&&a.htmlFocus){Eo(l),X(a.lastWin);return}if(a.htmlScopeActive){Bo(!0,l),X(a.lastWin);return}n.dispatch({selection:l==null?{anchor:r,head:i}:{anchor:l},scrollIntoView:!0}),n.focus()});E("dock:insert-snippet",({win:t,parts:e})=>Dd(t,e));E("dock:refresh",t=>Hd(t));E("dock:tw-follow",()=>{a.lastWin&&ae(a.lastWin)});E("dock:css",()=>(dt(),a.cssFull));E("dock:set-css",t=>typeof t!="string"||mt()||!v.css||!a.lastWin?!1:(dt(),a.cssFull=t,Oe("css",As()),nt(a.lastWin),!0));E("dock:data-menu",({anchor:t,onPick:e,at:o}={})=>!t||!a.lastWin?!1:(kt(a.lastWin.document),w(a.lastWin.document),Zs(a.lastWin,t,e,o),!0));E("dock:props",()=>a.lastProps.map(t=>({...t})));E("dock:set-props",({win:t,props:e}={})=>!Array.isArray(e)||mt()?!1:(a.lastProps=e,a.propsDirty=!0,Ma(ie(Tt())),J((t||a.lastWin)?.document),!0));function ie(t){const e=/^view:partials\/(components\/[A-Za-z0-9_-]+)$/.exec(String(t||""));return e?e[1]:""}E("dock:component-src",()=>ie(Tt()));E("dock:type-stack",()=>a.typeStack.map(t=>({type:t,src:ie(t)})));E("dock:component-exit-state",()=>{const t=ie(Tt());return{open:!!t,name:t?t.split("/").pop():"",back:a.typeStack.length>0}});E("dock:exit-component",(t=1)=>{if(!a.lastWin||!ie(Tt()))return!1;if(a.typeStack.length){for(let e=Number(t)||1;e>1&&a.typeStack.length>1;e-=1)a.typeStack.pop();xs(a.lastWin)}else Ks(a.lastWin.document);return!0});E("dock:current-type",()=>Tt());E("dock:on-empty-page",()=>!!a.onEmptyPage);E("dock:current-uid",()=>a.lastUid);E("dock:save-settled",()=>a.saveInFlight||null);E("dock:load-settled",()=>a.loadInFlight||null);E("dock:reset-data-vars",t=>(vi(typeof t=="string"&&t?t:void 0),!0));E("dock:refresh-preview",()=>a.lastWin?(ke(a.lastWin),!0):!1);E("dock:open-template",t=>typeof t!="string"||!t||!a.lastWin?!1:(bs(a.lastWin,t),!0));E("dock:set-html",t=>{if(typeof t!="string"||mt())return!1;const e=v.html;if(!e||!a.lastWin)return!1;if(t===""){a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null),a.twDirty=!1,a.twCss=null,a.twKey="",a.lastType=null,a.lastUid=null,a.lastParts={html:"",css:"",js:""},a.cssFull="",a.htmlFull="",a.applying=!0;try{De();for(const s of it){const r=v[s];if(!r)continue;const i=r.state.doc.toString();i!==""&&r.dispatch({changes:{from:0,to:i.length,insert:""}})}}finally{a.applying=!1}return!0}const o=a.htmlFull;if(a.htmlFull=t,a.htmlScopeActive)return a.htmlFocus=Ud(a.htmlFocus,o,t),Pe(ws()),nt(a.lastWin),go("dock:html-changed"),!0;const n=e.state.doc.toString();if(n!==t){const[s,r,i]=vs(n,t);e.dispatch({changes:{from:s,to:r,insert:i}})}return!0});E("dock:show-empty",()=>St("dock:set-html",""));$e("row:removed",({parentPath:t,remaining:e,win:o})=>{e===0&&t===Kt(o)&&St("dock:show-empty")});function Ud(t,e,o){const n=o.length-e.length;if(!t||!n)return t;let s=0;for(;s<e.length&&s<o.length&&e[s]===o[s];)s+=1;return s>=t.to?t:s<t.from?{from:Math.max(0,t.from+n),to:Math.max(0,t.to+n)}:{from:t.from,to:Math.max(t.from,t.to+n)}}const O="__sve-data-menu";let lo=null;function kt(t){const e=t?.getElementById(O);lo?.(),lo=null,e?._sveApp?.unmount(),e?.remove(),t?.querySelector("[data-sve-data-vars][data-open]")?.removeAttribute("data-open")}function Kd(t){if(!Gs(t))return{view:"",kind:""};const e=typeof G=="function"?G(t.document):[];for(const o of e){const n=pt(o.values)||o.values,s=typeof n?.source_collection=="string"?n.source_collection.trim():"";if(s)return{view:s,kind:String(n?.kind||"").trim()}}return{view:"",kind:""}}function Gd(t,e){const o=zt();if(Number.isFinite(e))return Zo(o,e);const n=v.html;if(!n)return[];const s=a.htmlScopeActive&&a.htmlFocus?a.htmlFocus.from:0;return Zo(o,s+n.state.selection.main.from)}function Xd(t,e){const{view:o,kind:n}=Kd(t);return{collection:ss(t)||"",set:rs(Tt()),view:o,kind:n,scope:gi(Gd(t,e))}}function Zd(t){const e=typeof G=="function"?G(t.document):[];for(const o of e){const n=pt(o.values)||o.values;if(n&&typeof n=="object")return n}return null}function Yd(t,e){return{scope:e?.scope?.groups||[],section:ls(e?.section||[],ys(t)),page:xi(e?.page||[],Zd(t)),site:e?.site||[]}}function Jd(t,e){const o=ki(t,e),n=v.html;if(!o||!n||n.state.readOnly)return;const s=n.state.selection.main,r=n.state.doc.lineAt(s.from),i=ct(r.text),l=yo(o.text,i);n.dispatch({changes:{from:s.from,to:s.to,insert:l},selection:{anchor:s.from+o.cursor+(o.text.includes(`
`)?i.length:0)}}),V()}function Ze(t,e,o){const n=e.getBoundingClientRect(),s=8,r=o.offsetWidth||368,i=o.offsetHeight||240,l=t.innerHeight-n.bottom-s,c=n.top-s,d=l>=i||l>=c?n.bottom+4:n.top-i-4;o.style.left=`${Math.max(s,Math.min(n.left,t.innerWidth-r-s))}px`,o.style.top=`${Math.max(s,Math.min(d,t.innerHeight-i-s))}px`}function Zs(t,e,o,n){const s=t.document;kt(s),e.setAttribute("data-open","");const r=s.createElement("div");r.id=O,s.body.appendChild(r);const i=Xd(t,n),l=p=>[p?.scope?.groups?.length?{id:"scope",label:p.scope.label||m(t,"data_vars_tab_loop")}:null,{id:"section",label:m(t,"data_vars_tab_section")},{id:"page",label:m(t,"data_vars_tab_page")},{id:"site",label:m(t,"data_vars_tab_site")}].filter(Boolean),c=p=>{s.getElementById(O)&&(r._sveApp?.unmount(),r._sveApp=q(mi,r,{title:m(t,"data_vars_title"),placeholder:m(t,"data_vars_placeholder"),emptyText:m(t,"data_vars_empty"),noSectionText:m(t,"data_vars_no_section"),loopText:m(t,"data_vars_loop"),tabs:l(p),data:Yd(t,p),onPick:(y,b)=>o?o(y,b):Jd(y,b)}),Ze(t,e,r))};c(as(wo(i))||{scope:null,section:[],page:[],site:[]}),is(t,i).then(c),Ze(t,e,r);const d=()=>Ze(t,e,r),h=p=>{!r.contains(p.target)&&!e.contains(p.target)&&kt(s)},f=p=>{p.key==="Escape"&&kt(s)};s.addEventListener("pointerdown",h,!0),s.addEventListener("keydown",f,!0),t.addEventListener("scroll",d,!0),t.addEventListener("resize",d),lo=()=>{s.removeEventListener("pointerdown",h,!0),s.removeEventListener("keydown",f,!0),t.removeEventListener("scroll",d,!0),t.removeEventListener("resize",d)}}function Qd(t,e){const o=e.querySelector("[data-sve-data-vars]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("mousedown",n=>n.preventDefault()),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),t.document.getElementById(O)){kt(t.document);return}w(t.document),Zs(t,o)}))}function tu(t,e){const o=e.querySelector("[data-sve-antlers-tools]");!o||o._sveBound||(o._sveBound=!0,$t(o,ns,{label:m(t,"code_dock_antlers"),groups:Ia.map(n=>({id:n.id,label:m(t,n.lang),items:Oa.filter(s=>s.group===n.id).map(s=>({id:s.id,label:s.label}))})),onPick:n=>eu(n)}))}function eu(t){const e=Pa(t),o=v.html;if(!e||!o||o.state.readOnly)return;const n=o.state.selection.main.head,s=o.state.doc.lineAt(n),r=s.text.trim()?ct(s.text):Re(o,s)||ct(s.text),{text:i,cursor:l}=ve(e.snippet);Ot(yo(i,r),l),V()}function ou(t,e){const o=e.querySelector("[data-sve-visual-edit-tools]");!o||o._sveBound||(o._sveBound=!0,$t(o,ns,{label:m(t,"code_dock_visual_edit"),groups:Si.map(n=>({id:n.id,label:m(t,n.lang),items:cs.filter(s=>s.group===n.id).map(s=>({id:s.id,label:s.label}))})),onPick:n=>su(n)}))}function nu(t,e,o,n){if($i(o.inner,n.attr)){t.focus();return}const{text:s,cursor:r}=ve(n.attr);let i=o.closeIdx;for(;i>o.openIdx+2&&/\s/.test(e[i-1]);)i--;t.dispatch({changes:{from:i,to:o.closeIdx,insert:` ${s} `},selection:{anchor:i+1+r}}),V()}function su(t){const e=wi(t),o=v.html;if(!e||!o||o.state.readOnly)return;const n=o.state.doc.toString(),s=ee();if(s?.open){const f=_i(n,s.open.from,s.open.to,ue);if(f){e.attr?nu(o,n,f,e):(o.dispatch({selection:{anchor:f.openIdx+2+ue.length}}),o.focus());return}const p=s.open.from+1+s.name.length,y=e.standalone||`{{ ${ue} ${e.attr} }}`,{text:b,cursor:B}=ve(y);o.dispatch({changes:{from:p,to:p,insert:` ${b}`},selection:{anchor:p+1+B}}),V();return}const r=o.state.selection.main.head,i=o.state.doc.lineAt(r),l=i.text.trim()?ct(i.text):Re(o,i)||ct(i.text),c=e.standalone||`{{ ${ue} ${e.attr} }}`,{text:d,cursor:h}=ve(c);Ot(yo(d,l),h),V()}function ru(t){return t==="css"?br():t==="js"?xr():yr({autoCloseTags:!0})}function Cn(t){if(t._sveShield)return;t._sveShield=!0;const e=o=>o.stopPropagation();for(const o of["keydown","keypress","keyup","pointerdown","pointerup","mousedown","mouseup","click","focusin"])t.addEventListener(o,e)}function au(t){try{return new URLSearchParams(t.defaultView?.location?.search||"").has("sve-panel")}catch{return!1}}function iu(t){const e=parseInt(tt(t,wr)??"",10);return Number.isFinite(e)&&e>=Ar?e:$u}function lu(t,e){K(t,wr,String(e))}function Ys(t){try{const e=JSON.parse(tt(t,_r)||"null");if(e&&typeof e=="object")return{html:e.html!==!1,css:e.css!==!1,js:e.js===!0,alpine:e.alpine===!0}}catch{}return{html:!0,css:!0,js:!1,alpine:!1}}function cu(t,e){K(t,_r,JSON.stringify(e))}function Js(t){try{const e=JSON.parse(tt(t,$r)||"null");if(e&&typeof e=="object"){const o=s=>Number.isFinite(s)&&s>0?s:1,n={};for(const s of _t)n[s]=o(e[s]);return n}}catch{}return Object.fromEntries(_t.map(e=>[e,1]))}function du(t,e){K(t,$r,JSON.stringify(e))}function uu(t){ra(t,_u,`
@keyframes sve-cm-wait { to { transform: rotate(360deg); } }
#${u} {
  /* The tree's seven families, for the marks and the toolbar below. */
  ${aa("dark")}
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
  opacity: .55;
}
#${u} [data-sve-code-lock]:hover {
  opacity: 1;
  background: rgba(255,255,255,.1);
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
  opacity: .55;
}
#${u} [data-sve-html-scope]:hover {
  opacity: 1;
  background: rgba(255,255,255,.1);
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
  opacity: .55;
}
#${u} [data-sve-code-strip]:hover,
#${u} [data-sve-code-history]:hover,
#${u} [data-sve-code-history][data-open] {
  opacity: 1;
  background: rgba(255,255,255,.1);
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
  opacity: .6;
  font-size: 11px;
  white-space: nowrap;
}
#${u} [data-sve-values-mode]:hover,
#${u} [data-sve-style-mode]:hover {
  opacity: 1;
  background: rgba(255,255,255,.1);
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
  opacity: .55;
}
#${u} [data-sve-code-autosave]:hover,
#${u} [data-sve-code-save]:hover {
  opacity: 1;
  background: rgba(255,255,255,.1);
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
#${u}[data-sve-code-locked] [data-sve-html-scope],
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
#${Z} {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,.5);
}
#${Z} [data-sve-unlock-card] {
  width: min(420px, calc(100vw - 32px));
  padding: 20px;
  border-radius: 12px;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 16px 40px rgba(0,0,0,.45);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${Z} [data-sve-unlock-title] {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
}
#${Z} [data-sve-unlock-body] {
  font-size: 13px;
  line-height: 1.45;
  opacity: .75;
  margin-bottom: 18px;
}
#${Z} [data-sve-unlock-actions] {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
#${Z} [data-sve-unlock-actions] button {
  all: unset;
  cursor: pointer;
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}
#${Z} [data-sve-unlock-cancel] {
  background: rgba(255,255,255,.1);
  color: #d4d4d4;
}
#${Z} [data-sve-unlock-confirm] {
  background: #b45309;
  color: #fff;
}
#${u} [data-sve-code-grip] {
  flex: 0 0 16px;
  height: 16px;
  width: 100%;
  cursor: ns-resize;
  z-index: 3;
  ${Go("ns")}
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
#${u} [data-sve-antlers-select] {
  box-sizing: border-box;
  max-width: 148px;
  height: auto;
  padding: 0 8px 0 10px;
  border: 0;
  border-left: 1px solid rgba(255,255,255,.06);
  border-radius: 0;
  background: transparent;
  color: #d4d4d4;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
  cursor: pointer;
  color-scheme: dark;
}
#${u} [data-sve-antlers-select]:hover,
#${u} [data-sve-antlers-select]:focus-visible {
  background: transparent;
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
#${$} {
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
#${O} {
  position: fixed;
  z-index: 60;
  box-sizing: border-box;
  width: 23rem;
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
#${O} [data-sve-data-search] {
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
#${O} [data-sve-data-search]:focus-within {
  border-color: rgba(147,197,253,.7);
}
#${O} [data-sve-data-search] svg {
  flex: 0 0 auto;
  opacity: .5;
}
#${O} [data-sve-data-input] {
  all: unset;
  flex: 1 1 auto;
  min-width: 0;
  color: inherit;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.75rem;
}
#${O} [data-sve-data-tabs] {
  display: flex;
  gap: 0.2rem;
  margin-bottom: 0.45rem;
  padding: 0.15rem;
  border-radius: 0.45em;
  background: rgba(0,0,0,.28);
}
#${O} [data-sve-data-tab] {
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
#${O} [data-sve-data-tab]:hover { opacity: 1; }
#${O} [data-sve-data-tab][data-active] {
  opacity: 1;
  background: rgba(255,255,255,.14);
}
#${O} [data-sve-data-group] {
  padding: 0.6em 0.5em 0.25em;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  opacity: .45;
}
#${O} [data-sve-data-option] {
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
#${O} [data-sve-data-option]:hover,
#${O} [data-sve-data-option][data-cursor] {
  background: rgba(255,255,255,.1);
}
#${O} [data-sve-data-name] {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
#${O} [data-sve-data-parent] {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.625rem;
  opacity: .4;
}
#${O} [data-sve-data-value] {
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
#${O} [data-sve-data-loop] {
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
#${O} [data-sve-data-empty] {
  padding: 0.5em;
  opacity: .55;
}
#${u} [data-sve-data-vars],
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
#${u} [data-sve-html-tidy] svg {
  display: flex;
  line-height: 1;
}
#${u} [data-sve-data-vars]:hover,
#${u} [data-sve-data-vars][data-open],
#${u} [data-sve-html-tidy]:hover {
  background: rgba(255,255,255,.16);
  opacity: 1;
}
#${$} [data-sve-css-swatches] {
  display: grid;
  grid-template-columns: repeat(8, 16px);
  gap: 4px;
}
#${$} [data-sve-css-swatch] {
  all: unset;
  cursor: pointer;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  box-sizing: border-box;
  border: 1px solid rgba(255,255,255,.2);
}
#${$} [data-sve-css-swatch]:hover,
#${$} [data-sve-css-clear]:hover {
  outline: 1px solid #fff;
  outline-offset: 1px;
}
#${$} [data-sve-css-clear] {
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
#${$} [data-sve-css-choice] {
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
#${$} [data-sve-css-choice-label] {
  flex: 1 1 auto;
  min-width: 0;
}
/* What the row actually writes, in the corner of the row that writes it. Dim,
   because it is the answer to a second question, not the first. */
#${$} [data-sve-css-choice-hint] {
  flex: 0 0 auto;
  opacity: .45;
  font-size: 10px;
}
#${$} [data-sve-css-head-row] {
  display: block;
  padding: 8px 8px 3px;
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  opacity: .55;
}
#${$} [data-sve-css-head-row]:first-child {
  padding-top: 2px;
}
#${$} [data-sve-css-note-row] {
  display: block;
  padding: 6px 8px 2px;
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 10px;
  line-height: 1.45;
  opacity: .5;
}
#${$} [data-sve-css-choice]:hover,
#${$} [data-sve-css-swatch][data-active],
#${$} [data-sve-css-choice][data-active] {
  outline: 1px solid #fff;
  outline-offset: 1px;
  background: rgba(255,255,255,.1);
}
#${$} [data-sve-css-add-label] {
  display: block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  opacity: .55;
  margin-bottom: 6px;
}
#${$} [data-sve-css-add-input] {
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
  ${Go("ew")}
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
#${st} {
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
#${st}:hover {
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
#${de} {
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
#${de} [data-sve-partial-choice] {
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
#${de} [data-sve-partial-choice]:hover {
  background: rgba(255,255,255,.1);
}
#${de} [data-sve-partial-empty] {
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
`)}function fu(t){const e=t.querySelector(".live-preview-editor");if(!e)return 0;const o=e.getBoundingClientRect();return o.width<40||o.right<40?0:Math.round(o.right)}function hu(t){let e=0;for(const o of["__sve-section-picker","__sve-outline-panel","__sve-html-tree-panel","__sve-listview-panel","__sve-right-dock","__sve-chrome-designs","__sve-global-section-panel","__sve-ai-panel"]){const n=t.getElementById(o);if(!n||n.hasAttribute("data-sve-chrome-hidden")||n.hasAttribute("data-sve-right-closed")||n.style.display==="none")continue;const s=n.getBoundingClientRect();s.width>40&&s.right>t.documentElement.clientWidth-8&&(e=Math.max(e,Math.round(s.width)))}return e}function Ro(t){const e=t.document;if(a.layoutWin=t,typeof t.ResizeObserver!="function")return;a.layoutObserver||(a.layoutObserver=new t.ResizeObserver(()=>{a.layoutWin&&Rd(a.layoutWin)}));const o=e.querySelector(".live-preview-editor"),n=e.getElementById("__sve-right-dock");o!==a.observedEditor&&(a.observedEditor&&a.layoutObserver.unobserve(a.observedEditor),a.observedEditor=o,o&&a.layoutObserver.observe(o)),n!==a.observedRight&&(a.observedRight&&a.layoutObserver.unobserve(a.observedRight),a.observedRight=n,n&&a.layoutObserver.observe(n))}function pu(){a.layoutObserver?.disconnect(),a.layoutObserver=null,a.layoutWin=null,a.observedEditor=null,a.observedRight=null}function mu(t){a.layoutWatchBound||(a.layoutWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>Ro(t)))}function jo(t,e){const o=t.querySelector(".live-preview-contents");o&&(o.style.paddingBottom=e?`${e}px`:"")}function No(t){if(!t)return;const e=t.clientHeight,o=t.querySelector("[data-sve-code-bar]"),n=t.querySelector("[data-sve-code-lock-banner]"),s=n&&gu(t)?.getComputedStyle(n).display!=="none"?n.offsetHeight:0,r=Math.max(64,e-(o?.offsetHeight||0)-s),i=t.querySelector("[data-sve-code-panes]");i&&(i.style.height=`${r}px`,i.style.minHeight="0",i.style.overflow="hidden"),t.querySelectorAll("[data-sve-code-host]").forEach(l=>{const c=l.closest("[data-sve-code-pane]");if(!c||c.style.display==="none")return;let d=0;for(const f of c.children)f!==l&&(d+=f.offsetHeight);const h=Math.max(64,r-d);l.style.height=`${h}px`,l.style.maxHeight=`${h}px`,l.style.minHeight="0",l.style.overflow="auto",vu(l)})}function gu(t){return t.ownerDocument?.defaultView||a.lastWin}function vu(t){t._sveWheelBound||(t._sveWheelBound=!0,t.addEventListener("wheel",e=>{const o=t.scrollHeight-t.clientHeight,n=t.scrollWidth-t.clientWidth;let s=!1;if(e.deltaY&&o>0){const r=Math.min(o,Math.max(0,t.scrollTop+e.deltaY));r!==t.scrollTop&&(t.scrollTop=r,s=!0)}if(e.deltaX&&n>0){const r=Math.min(n,Math.max(0,t.scrollLeft+e.deltaX));r!==t.scrollLeft&&(t.scrollLeft=r,s=!0)}s&&(e.preventDefault(),e.stopPropagation())},{passive:!1}))}function Qs(){const t=(a.layoutWin||a.lastWin)?.document?.getElementById(u);t&&No(t);for(const e of it)v[e]?.requestMeasure()}function tr(t,e){const o=Ys(t),n={};for(const s of _t){const r=e.querySelector(`[data-sve-code-pane-btn="${s}"]`);n[s]=r?r.getAttribute("aria-pressed")==="true":o[s]}return n}function er(t,e){for(const n of _t){const s=t.querySelector(`[data-sve-code-pane-btn="${n}"]`),r=t.querySelector(`[data-sve-code-pane="${n}"]`);s&&s.setAttribute("aria-pressed",e[n]?"true":"false"),r&&(r.style.display=e[n]?"flex":"none")}const o=_t.filter(n=>e[n]);t.querySelectorAll("[data-sve-code-split]").forEach(n=>{const s=n.getAttribute("data-sve-code-split-after"),r=o.indexOf(s);n.style.display=r>=0&&r<o.length-1?"block":"none"}),or(t.ownerDocument.defaultView,t),No(t)}function or(t,e){const o=Js(t);for(const n of _t){const s=e.querySelector(`[data-sve-code-pane="${n}"]`);s&&(s.style.flex=`${o[n]} 1 0`)}}function Yt(t,e){if(a.dragging)return;const o=t.document;Qe(o,e);const n=iu(t),s=fu(o),r=hu(o);e.style.left=`${s}px`,e.style.right=`${r}px`,e.style.bottom="0",e.style.height=`${n}px`,jo(o,n),No(e)}function nr(t,e,o,n){a.dragging=!0,ia(t,e,o,()=>{a.dragging=!1,n?.()},"data-sve-code-drag-shield")}function yu(t,e){if(e._sveResizeBound)return;e._sveResizeBound=!0;const o=n=>{if(n.button!==0||n.target.closest('button, a, input, select, textarea, label, [role="button"], [contenteditable], .cm-editor'))return;n.preventDefault();const s=n.clientY,r=e.getBoundingClientRect().height;let i=r;nr(t,"ns-resize",l=>{i=Math.min(Math.max(Ar,r+(s-l.clientY)),Math.round(t.innerHeight*.7)),e.style.height=`${i}px`,jo(t.document,i),Qs()},()=>{lu(t,i),Yt(t,e),t.dispatchEvent(new Event("resize"))})};e.querySelector("[data-sve-code-bar]")?.addEventListener("mousedown",o),e.querySelector("[data-sve-code-grip]")?.addEventListener("mousedown",o)}function bu(t,e){e._sveSplitBound||(e._sveSplitBound=!0,e.querySelectorAll("[data-sve-code-split]").forEach(o=>{o.addEventListener("mousedown",n=>{if(n.button!==0)return;n.preventDefault(),n.stopPropagation();const s=o.getAttribute("data-sve-code-split-after"),r=_t.filter(B=>tr(t,e)[B]),i=r.indexOf(s),l=r[i],c=r[i+1];if(!l||!c)return;const d=e.querySelector(`[data-sve-code-pane="${l}"]`),h=e.querySelector(`[data-sve-code-pane="${c}"]`),f=n.clientX,p=d.getBoundingClientRect().width,y=h.getBoundingClientRect().width,b=p+y;o.setAttribute("data-active",""),nr(t,"col-resize",B=>{const vt=B.clientX-f;let Rt=Math.max(Ye,Math.min(b-Ye,p+vt)),ce=b-Rt;b<Ye*2&&(Rt=p,ce=y);const _=Js(t);_[l]=Rt,_[c]=ce,du(t,_),or(t,e),Qs()},()=>{o.removeAttribute("data-active")})})}))}function xu(t,e){e._svePaneBound||(e._svePaneBound=!0,e.querySelectorAll("[data-sve-code-pane-btn]").forEach(o=>{o.addEventListener("click",n=>{n.stopPropagation();const s=o.getAttribute("data-sve-code-pane-btn"),r=tr(t,e),i={...r,[s]:!r[s]};!i.html&&!i.css&&!i.js&&(i[s]=!0),cu(t,i),er(e,i)})}))}function R(t,e){const o=t.getElementById(u)?.querySelector("[data-sve-code-status]");o&&(o.textContent=e||"")}function sr(t,e){const o=t.getElementById(u)?.querySelector("[data-sve-code-path]");o&&(o.textContent=e||"",o.title=e||"")}function Jt(t){const e=t?.document?.getElementById(u)?.querySelector("[data-sve-code-back]");e&&(e.hidden=a.typeStack.length===0,e.title=m(t,"code_dock_back"),e.setAttribute("aria-label",e.title),e.innerHTML=Mu)}function Tn(t,e){const o=e.querySelector("[data-sve-code-back]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),xs(t)}))}let N,co,rr,ar,ir,yt,we,At,le,Mt,Et,lr,cr,dr,ur,fr,hr,pr,mr,gr,vr,Wo,yr,br,xr,kr,uo,fo,Sr,ku,Wt=null,C=null;function Su(){return Wt||(Wt=da().then(t=>{C=t,N=C.view.EditorView,co=C.view.keymap,rr=C.view.lineNumbers,ar=C.view.highlightActiveLine,ir=C.view.highlightActiveLineGutter,yt=C.state.Compartment,we=C.state.EditorState,At=C.state.StateField,le=C.state.StateEffect,Mt=C.state.RangeSetBuilder,Et=C.view.Decoration,lr=C.commands.defaultKeymap,cr=C.commands.indentWithTab,dr=C.commands.historyKeymap,ur=C.commands.history,fr=C.autocomplete.autocompletion,hr=C.autocomplete.closeBrackets,pr=C.autocomplete.closeBracketsKeymap,mr=C.autocomplete.closeCompletion,gr=C.autocomplete.completionKeymap,vr=C.view.hoverTooltip,Wo=C.langHtml.htmlLanguage,yr=C.langHtml.html,br=C.langCss.css,xr=C.langJs.javascript,C.language.HighlightStyle,C.language.syntaxHighlighting,kr=C.language.codeFolding,uo=C.language.foldEffect,fo=C.language.unfoldEffect,Sr=C.language.foldedRanges,ku=C.highlight.tags,Vt.html=new yt,Vt.css=new yt,Vt.js=new yt,Ut.html=new yt,Ut.css=new yt,Ut.js=new yt}).catch(t=>{throw Wt=null,t}),Wt)}const wu="{{ _class }}",u=la,_u="__sve-code-dock-style",Z="__sve-code-dock-unlock",wr="sve-code-dock-height",_r="sve-code-dock-panes",$r="sve-code-dock-widths",qe="sve-html-scope-v2",Cr="sve-code-dock-autosave",Tr="sve-code-dock-style-mode",qo="sve-code-dock-values",$u=280,Ar=120,Ye=140,Cu=250,it=["html","css","js"],_t=["html","css","alpine","js"],Tu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',Au='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-1"/></svg>',Mu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',Mr='<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1c0 .966.784 1.75 1.75 1.75h.418A1.74 1.74 0 0 0 4 7.25v1.5c0 .49.201.932.525 1.25c-.324.318-.525.76-.525 1.25v1c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 14 12.25v-1c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1.5c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1A1.75 1.75 0 0 0 12.25 2zm8.5 7.5H8v-3h4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75M7 6.5v3H5.75A.75.75 0 0 1 5 8.75v-1.5a.75.75 0 0 1 .75-.75zm1 4h4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75H8zm-1 0V13H5.75a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-1-5V3h6.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75zm-1 0H3.75A.75.75 0 0 1 3 4.75v-1A.75.75 0 0 1 3.75 3H5z"/></svg>',Eu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/><path d="M4.5 11.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/></svg>',Bu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 16.3A8.5 8.5 0 1 1 18.3 6.3"/><path d="M21 3.2v5.4h-5.4"/></svg>',Lu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',Fu='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',$="__sve-css-menu",Er=["h1","h2","h3","h4","h5","h6"],ho=[{id:"section",title:"section",tag:"section"},{id:"div",title:"div",tag:"div"},{id:"heading",title:"heading",menu:"heading"},{id:"text",title:"text",menu:"text"},{id:"a",title:"link",tag:"a"},{id:"img",title:"image",snippet:'<img src="" alt="">',caret:10},{id:"svg",title:"svg",tag:"svg"},{id:"ul",title:"list",tag:"ul"},{id:"li",title:"list item",tag:"li"},{id:"component",title:"component",menu:"component"},{id:"loop",title:"loop",snippet:`{{ items }}

{{ /items }}
`,caret:3,select:5},{id:"if",title:"if",snippet:`{{ if true }}

{{ /if }}
`,caret:6,select:4}],Iu=["--size-100","--size-200","--size-300","--size-400","--size-500","--size-600","--size-700","--size-800","--size-900","--gutter"],Ou={"tw-text":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 13 5 3l3.5 10M2.7 10h4.6"/><path d="M12.5 3.5v9M11 5l1.5-1.5L14 5M11 11l1.5 1.5L14 11"/></svg>',"tw-leading":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h8.5M6 8h8.5M6 12.5h8.5"/><path d="M2.5 4.5v7M1.4 5.6 2.5 4.5l1.1 1.1M1.4 10.4l1.1 1.1 1.1-1.1"/></svg>',"tw-font":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.2V3h10v1.2M8 3v10M6 13h4"/></svg>',"tw-radius":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 13.5v-6a5 5 0 0 1 5-5h6"/><path d="M13.5 6.5v7h-7" stroke-dasharray="2 2"/></svg>',"tw-gap":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"tw-align":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3.5h12M2 8h8M2 12.5h10"/></svg>',"tw-w":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3.5v9M14 3.5v9"/><path d="M4.5 8h7"/><path d="M6 6.2 4.2 8 6 9.8M10 6.2 11.8 8 10 9.8"/></svg>',"tw-h":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 2h9M3.5 14h9"/><path d="M8 4.5v7"/><path d="M6.2 6 8 4.2 9.8 6M6.2 10 8 11.8 9.8 10"/></svg>',"tw-maxw":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3v10M14.5 3v10"/><path d="M5 8h6"/><path d="M6.6 6.2 4.8 8l1.8 1.8M9.4 6.2 11.2 8l-1.8 1.8"/></svg>',"tw-overflow":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="1.8" y="4.5" width="8.6" height="9.7" rx="1.2"/><path d="M6.5 1.8h7.7v7.7" stroke-linecap="round"/></svg>',"tw-border":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6"/><rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" stroke-width="1" opacity=".45"/></svg>'},Pu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="10" width="18" height="11" rx="2"/><rect x="6" y="3" width="9" height="4" rx="1.4" fill="currentColor" stroke="none"/></svg>',Du='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.1 12a8.9 8.9 0 1 0 2.8-6.5L3 8"/><path d="M3 3.4V8h4.6"/><path d="M12 7.4V12l3 1.8"/></svg>',zu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>',Hu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></svg>',Ru='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/><path d="M3 17c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/></svg>',Br=[["--gray-50","#fafafa"],["--gray-100","#f5f5f5"],["--gray-200","#e5e5e5"],["--gray-300","#d4d4d4"],["--gray-400","#a3a3a3"],["--gray-500","#737373"],["--gray-600","#525252"],["--gray-700","#404040"],["--gray-800","#262626"],["--gray-900","#171717"],["--gray-950","#0a0a0a"]],An=t=>[{id:`${t}-all`,icon:"box-all",title:"All sides",css:t,tw:t},{id:`${t}-block`,icon:"box-block",title:"Top and bottom",css:`${t}-block`,tw:`${t}-block`,sep:!0},{id:`${t}-block-start`,icon:"box-block-start",title:"Top",css:`${t}-block-start`,tw:`${t}-top`},{id:`${t}-block-end`,icon:"box-block-end",title:"Bottom",css:`${t}-block-end`,tw:`${t}-bottom`},{id:`${t}-inline`,icon:"box-inline",title:"Left and right",css:`${t}-inline`,tw:`${t}-inline`,sep:!0},{id:`${t}-inline-start`,icon:"box-inline-start",title:"Left",css:`${t}-inline-start`,tw:`${t}-left`},{id:`${t}-inline-end`,icon:"box-inline-end",title:"Right",css:`${t}-inline-end`,tw:`${t}-right`}],ju=[{id:"display-flex",twClass:"flex",icon:"display-flex",title:"Flex",kind:"display",value:"flex",css:"display"},{id:"flex-row",twClass:"flex-row",icon:"flex-row",title:"Direction: row",kind:"flexDir",value:"row",css:"flex-direction",sep:!0},{id:"flex-col",twClass:"flex-col",icon:"flex-col",title:"Direction: column",kind:"flexDir",value:"column",css:"flex-direction"},{id:"justify-start",twClass:"justify-start",icon:"justify-start",title:"Justify: start",css:"justify-content",value:"flex-start",when:"flex",sep:!0},{id:"justify-center",twClass:"justify-center",icon:"justify-center",title:"Justify: center",css:"justify-content",value:"center",when:"flex"},{id:"justify-end",twClass:"justify-end",icon:"justify-end",title:"Justify: end",css:"justify-content",value:"flex-end",when:"flex"},{id:"justify-between",twClass:"justify-between",icon:"justify-between",title:"Justify: between",css:"justify-content",value:"space-between",when:"flex"},{id:"justify-around",twClass:"justify-around",icon:"justify-around",title:"Justify: around",css:"justify-content",value:"space-around",when:"flex"},{id:"align-start",twClass:"items-start",icon:"align-start",title:"Align: start",css:"align-items",value:"flex-start",when:"flex",sep:!0},{id:"align-center",twClass:"items-center",icon:"align-center",title:"Align: center",css:"align-items",value:"center",when:"flex"},{id:"align-end",twClass:"items-end",icon:"align-end",title:"Align: end",css:"align-items",value:"flex-end",when:"flex"},{id:"align-stretch",twClass:"items-stretch",icon:"align-stretch",title:"Align: stretch",css:"align-items",value:"stretch",when:"flex"}],Nu=[{id:"gap-all",icon:"gap-all",title:"Both",css:"gap",tw:"gap",menu:"spacing"},{id:"gap-row",icon:"gap-row",title:"Between rows",css:"row-gap",tw:"row-gap",menu:"spacing",sep:!0},{id:"gap-col",icon:"gap-col",title:"Between columns",css:"column-gap",tw:"column-gap",menu:"spacing"}],Wu=[{id:"bd-all",icon:"bd-all",title:"All sides",css:"border-color",tw:"border-color",menu:"colors"},{id:"bd-block",icon:"bd-block",title:"Top and bottom",css:"border-block-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-top",icon:"bd-top",title:"Top",css:"border-block-start-color",tw:"border-top-color",menu:"colors"},{id:"bd-bottom",icon:"bd-bottom",title:"Bottom",css:"border-block-end-color",tw:"border-bottom-color",menu:"colors"},{id:"bd-inline",icon:"bd-inline",title:"Left and right",css:"border-inline-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-left",icon:"bd-left",title:"Left",css:"border-inline-start-color",tw:"border-left-color",menu:"colors"},{id:"bd-right",icon:"bd-right",title:"Right",css:"border-inline-end-color",tw:"border-right-color",menu:"colors"}],qu=[{id:"rd-all",icon:"rd-all",title:"All corners",css:"border-radius",tw:"border-radius",menu:"values"},{id:"rd-tl",icon:"rd-tl",title:"Top left",css:"border-start-start-radius",tw:"border-top-left-radius",menu:"values",sep:!0},{id:"rd-tr",icon:"rd-tr",title:"Top right",css:"border-start-end-radius",tw:"border-top-right-radius",menu:"values"},{id:"rd-br",icon:"rd-br",title:"Bottom right",css:"border-end-end-radius",tw:"border-bottom-right-radius",menu:"values"},{id:"rd-bl",icon:"rd-bl",title:"Bottom left",css:"border-end-start-radius",tw:"border-bottom-left-radius",menu:"values"}],Lr=[{id:"display",title:"Display",css:"display",tw:"display",kids:ju},{id:"absolute",title:"Position",css:"position",tw:"position",value:"absolute"},{id:"color",title:"Text color",css:"color",tw:"color",menu:"colors"},{id:"bg",title:"Background color",css:"background-color",tw:"background-color",menu:"colors"},{id:"padding",title:"Padding",css:"padding",tw:"padding",kids:An("padding")},{id:"margin",title:"Margin",css:"margin",tw:"margin",kids:An("margin")},{id:"tw-text",title:"Font size",css:"font-size",tw:"font-size",menu:"values"},{id:"tw-leading",title:"Line height",css:"line-height",tw:"line-height",menu:"values"},{id:"tw-font",title:"Font family",css:"font-family",tw:"font-family",menu:"values"},{id:"tw-align",title:"Text align",css:"text-align",tw:"text-align",menu:"choices",choices:["left","center","right","justify"]},{id:"tw-border",title:"Border color",css:"border-color",tw:"border-color",kids:Wu},{id:"tw-radius",title:"Radius",css:"border-radius",tw:"border-radius",kids:qu},{id:"tw-gap",title:"Gap",css:"gap",tw:"gap",kids:Nu},{id:"tw-w",title:"Width",css:"width",tw:"width",menu:"sizes"},{id:"tw-h",title:"Height",css:"height",tw:"height",menu:"sizes"},{id:"tw-maxw",title:"Max width",css:"max-width",tw:"max-width",menu:"sizes"},{id:"tw-overflow",title:"Overflow",css:"overflow",tw:"overflow",menu:"choices",choices:["visible","hidden","clip","auto","scroll"]}],Vu=["100%","auto","fit-content","min-content","max-content","100vw","100dvh","0"],_e=new Map;for(const t of Lr){_e.set(t.id,{tool:t,kid:null});for(const e of t.kids||[])_e.set(e.id,{tool:t,kid:e})}const Mn={display:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2.5" width="13" height="11" rx="1.2"/><path d="M5 6.5h6M5 9.5h4"/></svg>',"display-flex":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="3.4" height="9" rx=".4"/><rect x="6.3" y="3.5" width="3.4" height="9" rx=".4"/><rect x="10.6" y="3.5" width="3.4" height="9" rx=".4"/></svg>',"flex-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12"/><path d="M4.2 5.8 2 8l2.2 2.2"/><path d="M11.8 5.8 14 8l-2.2 2.2"/></svg>',"flex-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v12"/><path d="M5.8 4.2 8 2l2.2 2.2"/><path d="M5.8 11.8 8 14l2.2-2.2"/></svg>',"justify-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="5.4" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4.6" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="8.2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-between":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-around":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"align-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="5.4" width="9" height="2.4" rx=".4"/></svg>',"align-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="4.6" width="9" height="2.4" rx=".4"/><rect x="3.5" y="9" width="9" height="2.4" rx=".4"/></svg>',"align-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="8.2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="11.6" width="9" height="2.4" rx=".4"/></svg>',"align-stretch":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx=".5"/><rect x="9" y="2" width="4" height="12" rx=".5"/></svg>',absolute:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>',color:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.4 11.2 7.4 2.4l4 8.8"/><path d="M4.7 8.4h5.4"/><rect x="1.6" y="12.8" width="12.8" height="2.2" rx=".6" fill="currentColor" stroke="none"/></svg>',bg:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 1.9a6.1 6.1 0 1 0 0 12.2c.85 0 1.35-.55 1.35-1.25 0-.38-.18-.66-.4-.88a1.2 1.2 0 0 1 .85-2.05h1.3A3.5 3.5 0 0 0 14.1 6.1C14.1 3.75 11.4 1.9 8 1.9Z"/><circle cx="4.9" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="8" cy="4.8" r=".95" fill="currentColor" stroke="none"/><circle cx="11.1" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="4.7" cy="9.9" r=".95" fill="currentColor" stroke="none"/></svg>',padding:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/></svg>',margin:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/><path d="M2 2.5h12M2 13.5h12M2.5 2v12M13.5 2v12" stroke-dasharray="1.4 1.2"/></svg>',"box-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".4" fill="currentColor" stroke="none"/></svg>',"box-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"gap-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"gap-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="3" y="1.6" width="10" height="4.2" rx=".6"/><rect x="3" y="10.2" width="10" height="4.2" rx=".6"/><path d="M4.5 8h7"/></svg>',"gap-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"bd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4"/></svg>',"bd-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-top":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-bottom":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-left":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-right":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"rd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="3.4"/></svg>',"rd-tl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6H6a3.4 3.4 0 0 0-3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M2.6 9V6A3.4 3.4 0 0 1 6 2.6h3" stroke-width="2.2"/></svg>',"rd-tr":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6h7.4a3.4 3.4 0 0 1 3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M7 2.6h3A3.4 3.4 0 0 1 13.4 6v3" stroke-width="2.2"/></svg>',"rd-br":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6v7.4a3.4 3.4 0 0 1-3.4 3.4H2.6" stroke-width="1" opacity=".35"/><path d="M13.4 7v3a3.4 3.4 0 0 1-3.4 3.4H7" stroke-width="2.2"/></svg>',"rd-bl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6v7.4a3.4 3.4 0 0 0 3.4 3.4h7.4" stroke-width="1" opacity=".35"/><path d="M2.6 7v3A3.4 3.4 0 0 0 6 13.4h3" stroke-width="2.2"/></svg>'},v={html:null,css:null,js:null},Vt={html:null,css:null,js:null},Ut={html:null,css:null,js:null};export{mf as ARMED_KEY,Bu as AUTOSAVE_ICON,Cr as AUTOSAVE_KEY,Mu as BACK_ICON,Fu as CSS_ADD_ICON,Br as CSS_GRAYS,Vu as CSS_LENGTHS,$ as CSS_MENU_ID,zu as CSS_MODE_ICON,zo as CSS_SIZE_KEY,Iu as CSS_SPACING,Ho as CSS_STATES,io as CSS_STATE_KEY,Lr as CSS_TOOLS,Mn as CSS_TOOL_ICONS,_e as CSS_TOOL_INDEX,Eu as DATA_ICON,O as DATA_MENU_ID,$u as DEFAULT_HEIGHT,u as DOCK_ID,Et as Decoration,we as EditorState,N as EditorView,it as HANDLES,wr as HEIGHT_KEY,Du as HISTORY_ICON,Er as HTML_HEADINGS,ho as HTML_TOOLS,Hu as ID_MODE_ICON,Tu as LOCK_CLOSED_ICON,Au as LOCK_OPEN_ICON,Ar as MIN_HEIGHT,Ye as MIN_PANE,_t as PANES,_r as PANES_KEY,Mt as RangeSetBuilder,Lu as SAVE_ICON,Cu as SAVE_MS,wu as SCOPE_CLASS,Mr as SCOPE_ICON,qe as SCOPE_KEY,Pu as STRIP_ICON,_u as STYLE_ID,Tr as STYLE_MODE_KEY,le as StateEffect,At as StateField,Ru as TW_MODE_ICON,Ou as TW_TOOL_ICONS,Z as UNLOCK_ID,qo as VALUES_MODE_KEY,$r as WIDTHS_KEY,se as applyCssFolds,te as applyCssScope,hc as applyDisplay,fc as applyFlexDirection,Ts as applyHtmlTag,Q as applyRuleDecls,qs as applyStyleMode,fr as autocompletion,To as autosaveEnabled,tu as bindAntlersSnippets,ln as bindAutosave,Tn as bindBack,ac as bindCssAddClass,Ld as bindCssTools,Qd as bindDataVars,Td as bindHistory,cn as bindHtmlScope,Id as bindHtmlTidy,Od as bindHtmlTools,mu as bindLayoutWatch,an as bindLock,xu as bindPaneToggles,yu as bindResize,bu as bindSplitters,Cd as bindStrip,Bd as bindStyleMode,ou as bindVisualEditSnippets,De as clearHtmlScopeRange,hr as closeBrackets,pr as closeBracketsKeymap,Ks as closeCodeDock,df as closeCodeDockPopups,mr as closeCompletion,w as closeCssMenu,kt as closeDataMenu,C as cm,uf as codeDockStyleMode,kr as codeFolding,Gs as collectionViewType,gr as completionKeymap,br as css,As as cssEditorText,He as cssRuleAtCursor,Rs as cssSizeRow,gt as cssSizeRows,Ne as cssStateSuffix,et as currentFlexDecls,zt as currentFullHtml,ys as currentSectionValues,Tt as currentTemplateType,lr as defaultKeymap,bt as dispatchHtmlChanges,Ut as editableOf,v as editors,uu as ensureStyle,ms as ensureTwCss,Ws as enterValuesRule,V as finishHtmlEdit,Ul as flushBracketSync,dt as flushCssScope,Kl as flushCssToHtml,J as flushSave,uo as foldEffect,Sr as foldedRanges,xs as goBackTemplate,ar as highlightActiveLine,ir as highlightActiveLineGutter,ur as history,dr as historyKeymap,vr as hoverTooltip,yr as html,ws as htmlEditorText,ee as htmlElementAtCursor,Le as htmlFocusOk,Wo as htmlLanguage,Qt as htmlScopeEnabled,Ct as htmlTargetFromCursor,Re as indentFromPrevious,cr as indentWithTab,Dd as insertAiSnippet,Ot as insertHtmlSnippet,jl as isChromeTemplateType,Kr as isCodeDockArmed,mt as isCodeDockLocked,Us as isCodeDockOpen,au as isPanelFrame,xr as javascript,co as keymap,ru as languageOf,xt as leadingCssIndent,ct as lineIndentOf,rr as lineNumbers,Su as loadCm,We as loadTemplate,gd as mountEditor,js as newSizeBlockSpot,ao as newSizeQuery,z as normalizeFlexValue,Ro as observeDockLayout,nt as onEditorInput,vc as openCssChoiceMenu,gc as openCssColorMenu,yc as openCssSpacingMenu,gn as openCssValueMenu,Zs as openDataVarsMenu,nc as openHtmlComponentMenu,hn as openHtmlTagMenu,bs as openNestedTemplate,Xl as openRenameClassMenu,je as paintAlpine,lt as paintAutosave,Jt as paintBack,re as paintCssHead,Oo as paintCssIdMark,P as paintCssToolState,vd as paintHostWait,X as paintHtmlScope,ze as paintHtmlToolState,It as paintLock,er as paintPaneButtons,Zt as paintStrip,Do as paintStyleMode,Po as paintValuesMode,W as placeCssMenu,Yt as placeDock,jo as previewBottomPad,ql as primeTailwindCompile,Vt as readOnlyOf,Lo as readParts,Hd as refreshCodeDockFromDisk,ke as refreshPreview,Rd as relayoutCodeDock,Ie as rememberBracketNames,Ht as rememberCssSelectors,Wl as resetTailwindCompile,Fo as sameParts,gf as setCodeDockArmed,sr as setPath,R as setStatus,Md as setValuesMode,Cn as shieldDock,Bo as showHtmlFull,Eo as showHtmlScope,pu as stopObservingDockLayout,Ys as storedPanes,ff as syncCodeDock,eo as syncHtmlTree,Fe as syncScopedHtml,ae as syncTwTarget,ku as tags,Ur as templateDockAllowed,Cs as tidyHtmlPane,fo as unfoldEffect,Oe as writeHandleEditor,Pe as writeHtmlEditor,oe as writeParts};
