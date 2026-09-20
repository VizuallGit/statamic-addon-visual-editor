const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-CV7No16T.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{o as b,a as x,b as g,t as A,F as P,d as U,k as dt,c as Rt,l as $n,p as Ge,w as Cn,q as Et,s as F,v as Tn,g as j,x as $r,y as xt,z as An,A as ke,f as Mn,r as uo,u as T,B as Ne,_ as En,n as Cr,D as Q,E as K,h as m,j as Tr,C as Ar,i as Bn,G as Mr,H as jo,I as Er,J as et,K as kt,L as No,M as Br,m as q,O as fo,P as Ln,Q as Lr,R as Fr,S as Fn,T as ho,U as Ir,V as _t,W as po,X as Or,Y as Pr,Z as Dr,$ as zr,a0 as Hr,a1 as Rr,a2 as jr,a3 as Nr,a4 as Wr,a5 as qr,a6 as Wo,a7 as We,a8 as Xe,a9 as Vr,aa as Ur,ab as Ze,ac as Kr,ad as Gr,ae as E,af as Xr,ag as Zr,ah as qo,ai as Yr,aj as Jr}from"./addon-CHWfqh6_.js";import{ak as ef,al as of}from"./addon-CHWfqh6_.js";import{v as Qr,l as ta}from"./codemirror-qSprycbE.js";import{p as Se,f as In,h as ea,t as On,c as oa,a as Pn,b as na,d as sa,e as ra,g as aa,i as Vo,j as ia,k as la,l as Dn,m as ca,n as da,o as ua,q as fa,s as ha,r as zn,u as pa,v as Ye,w as ma,H as Hn,x as ga,y as va,z as Rn,A as ya,B as ba,C as Uo,P as ie}from"./tw-classes-vFPvTWEW.js";import{t as xa}from"./tw-candidates-wYTeDvRv.js";import{h as ka,a as Sa,e as wa,A as _a,b as $a,c as Ca,d as he,i as mo}from"./html-tag-sync-D4MA50-d.js";import{M as jn,S as Nn}from"./protocol-D3FYhCm9.js";import"./ai-text-icon-B7uCWIwa.js";import"./index-Dpuj8sxX.js";import"./index-B5fiB6ig.js";import"./index-QkwZ_wP2.js";import"./index-CY0AOW5Y.js";import"./index-gYg9gdv3.js";import"./index-lzvKgifK.js";import"./index-BBw1nzv2.js";import"./index-DqbOpr3Y.js";import"./index-C_pm8ee_.js";import"./index-B8kpdD8S.js";const Wn=/^\.[a-zA-Z_][\w-]*$/;function go(t){const e=String(t||""),o=/(^|\s)\[/g;let n;for(;n=o.exec(e);){const s=n.index+n[1].length,r=/\](?=\s|$)/g;r.lastIndex=s+1;const i=r.exec(e);if(i)return{from:s,to:i.index+1,innerFrom:s+1,innerTo:i.index}}return null}function qn(t){const e=String(t||""),o=go(e);return o?e.slice(o.innerFrom,o.innerTo).replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).filter(n=>/^[a-zA-Z_][\w-]*$/.test(n)):[]}function Vn(t){const e=String(t||"").match(/\sclass\s*=\s*(["'])([^"']*)\1/i);return e?qn(e[2]):[]}function Ta(t){return Vn(t)[0]||""}function we(t){const e=String(t||""),o=[],n=/\sclass\s*=\s*(["'])/gi;let s;for(;s=n.exec(e);){const r=s[1],i=s.index+s[0].length,l=e.indexOf(r,i);if(l===-1)break;const c=e.slice(i,l),d=go(c);if(d){const h=c.slice(d.innerFrom,d.innerTo),f=i+d.innerFrom,p=h.replace(/\{\{[\s\S]*?\}\}/g,z=>" ".repeat(z.length)),y=/[a-zA-Z_][\w-]*/g;let k;for(;k=y.exec(p);)o.push({name:k[0],from:f+k.index,to:f+k.index+k[0].length})}n.lastIndex=l+1}return o}function Ko(t,e){return we(t).find(o=>e>=o.from&&e<=o.to)||null}function Go(t,e){const o=String(t||""),n=we(o);let s=o;for(let r=n.length-1;r>=0;r-=1){const i=n[r],l=e(i.name);if(l!==i.name){if(!l){let c=i.from,d=i.to;s[d]===" "?d+=1:c>0&&s[c-1]===" "&&(c-=1),s=s.slice(0,c)+s.slice(d);continue}s=s.slice(0,i.from)+l+s.slice(i.to)}}return s}function Un(t){const e=[],o=/(^|[^\w-])\.([a-zA-Z_][\w-]*)\s*\{/g;let n;for(;n=o.exec(String(t||""));)e.push(n[2]);return e}function Kn(t,e){const o=[],n=[],s=[];let r=0,i=0;for(;r<t.length&&i<e.length;){if(t[r]===e[i]){r+=1,i+=1;continue}const l=e.indexOf(t[r],i),c=t.indexOf(e[i],r);l===-1&&c===-1?(o.push({from:t[r],to:e[i]}),r+=1,i+=1):l===-1?(s.push(t[r]),r+=1):c===-1||l<=c?(n.push(e[i]),i+=1):(s.push(t[r]),r+=1)}for(;r<t.length;)s.push(t[r]),r+=1;for(;i<e.length;)n.push(e[i]),i+=1;return{renamed:o,added:n,removed:s}}function St(t){let e=String(t||"").trim().replace(/^\.+/,"").replace(/\s+/g,"-").replace(/[^a-zA-Z0-9_-]/g,"");return/^[a-zA-Z_]/.test(e)||(e=e.replace(/^[^a-zA-Z_]+/,"")),Wn.test(`.${e}`)?e:""}function Aa(t,e){const o=String(t||""),n=St(e);if(!o||!n)return o;const s=o.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(s){const r=s[1];let i=s[2];const l=go(i);if(l){const c=i.slice(l.innerFrom,l.innerTo).trim(),h=qn(i).includes(n)?c:`${c} ${n}`.trim();i=`${i.slice(0,l.from)}[ ${h} ]${i.slice(l.to)}`}else i=`[ ${n} ] ${i}`.trim();return o.slice(0,s.index)+` class=${r}${i}${r}`+o.slice(s.index+s[0].length)}return/\/\s*>$/.test(o)?o.replace(/(\s*)(\/\s*>)$/,` class="[ ${n} ]"$1$2`):o.replace(/(\s*)>$/,` class="[ ${n} ]"$1>`)}function Ma(t,e){const o=String(t).indexOf(">",e.from);return o===-1?"":t.slice(e.from,o+1)}function Gn(t,e){const o=[];for(const n of e){const s=Vn(Ma(t,n)),r=Gn(t,n.children||[]);if(s.length){o.push({className:s[0],children:r});for(const i of s.slice(1))o.push({className:i,children:[]})}else o.push(...r)}return o}function _e(t){return Gn(t,Se(t))}function pe(t){return String(t).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function vo(t,e){if(t.startsWith("/*",e)){const o=t.indexOf("*/",e+2);return o===-1?t.length:o+2}return e}function Ot(t,e){let o=0;for(let n=e;n<t.length;n+=1){if(t.startsWith("/*",n)){n=vo(t,n)-1;continue}if(t[n]==="{")o+=1;else if(t[n]==="}"&&(o-=1,o===0))return n}return-1}function Z(t,e){const o=String(t||""),n=new RegExp(`(^|[^\\w-])\\.${pe(e)}\\s*\\{`,"g");let s;for(;s=n.exec(o);){const r=s.index+s[1].length,i=o.indexOf("{",r);if(i===-1)continue;const l=Ot(o,i);if(l!==-1)return{from:r,brace:i,close:l,to:l+1,name:e}}return null}function Ea(t){const e=String(t||""),o=[],n={},s=[];let r=0,i="";const l=()=>{const c=i.trim();c&&o.push(c),i=""};for(;r<e.length;){if(e.startsWith("/*",r)){const c=vo(e,r);i+=e.slice(r,c),r=c;continue}if(e[r]==="{"){const c=i.trim(),d=Ot(e,r);if(d===-1)break;const h=e.slice(r+1,d);i="",Wn.test(c)?n[c.slice(1)]=h:c&&s.push(`${c} {${h}}`),r=d+1;continue}i+=e[r],r+=1}return l(),{decls:o.join(`
`),classes:n,other:s}}function Xo(t,e){const o="    ".repeat(e);return String(t||"").split(`
`).map(n=>n.trim()?o+n.trim():"").filter((n,s,r)=>n||s>0&&s<r.length-1).join(`
`)}function Ba(t,e){const o=Z(t,e);return o?String(t).slice(o.brace+1,o.close):""}function Xn(t,e,o){const n=Ea(Ba(e,t.className)),s="    ".repeat(o),r=[];n.decls&&r.push(Xo(n.decls.replace(/;+\s*$/,";"),o+1));for(const l of n.other)r.push(Xo(l,o+1));for(const l of t.children)r.push(Xn(l,e,o+1));const i=r.filter(Boolean).join(`
`);return i?`${s}.${t.className} {
${i}
${s}}`:`${s}.${t.className} {
${s}}`}function yo(t,e){return e?.length?e.map(o=>Xn(o,t,0)).join(`

`)+`
`:""}function Zn(t){const e=String(t||"").match(/^\s*\.([a-zA-Z_][\w-]*)\s*\{/);return e?e[1]:""}function La(t){const e=[],o=/\.([a-zA-Z_][\w-]*)\s*\{/g;let n,s=!0;for(;n=o.exec(String(t||""));){if(s){s=!1;continue}e.push(n[1])}return e}function Fa(t,e){const o=String(t).lastIndexOf(`
`,e-1)+1,n=t.slice(o,e);return/^\s*$/.test(n)?n:""}function Ia(t,e){return e?t.split(`
`).map((o,n)=>n===0||!o?o:e+o).join(`
`):t}function Oa(t,e){let o=0;for(let n=0;n<e.from;n+=1){if(t.startsWith("/*",n)){n=vo(t,n)-1;continue}t[n]==="{"?o+=1:t[n]==="}"&&(o-=1)}return o===0}function bo(t,e,o){const n=Zn(e)||o;if(!n)return String(t||"");let s=String(e||"").trim();s?new RegExp(`^\\.${pe(n)}\\s*\\{`).test(s)||(s=`.${n} {
${s}
}`):s=`.${n} {
}`;let r=String(t||"");const i=Z(r,n),l=La(s);if(i){const d=Fa(r,i.from);r=r.slice(0,i.from)+Ia(s,d)+r.slice(i.to)}else r=`${r.trimEnd()}${r.trim()?`
`:""}${s}
`;const c=Z(r,n);if(!c)return r;for(const d of[...new Set(l)].reverse()){const h=new RegExp(`(^|[^\\w-])\\.${pe(d)}\\s*\\{`,"g"),f=[];let p;for(;p=h.exec(r);){const y=p.index+p[1].length,k=r.indexOf("{",y),z=Ot(r,k);z!==-1&&f.push({from:y,to:z+1})}for(const y of f.reverse()){if(y.from>=c.from&&y.to<=c.to||!Oa(r,y))continue;let k=y.from;const z=r.lastIndexOf(`
`,k-1)+1;/^\s*$/.test(r.slice(z,k))&&(k=z);let mt=y.to;r[mt]===`
`&&(mt+=1),r=r.slice(0,k)+r.slice(mt)}}return r}function qe(t,e){const o=String(t||"");return`${o.trimEnd()}${o.trim()?`
`:""}.${e} {
}
`}function Pa(t,e,o){const n=St(o);return!e||!n||e===n?String(t||""):Z(t,n)?Yn(t,e):String(t||"").replace(new RegExp(`(^|[^\\w-])\\.${pe(e)}(\\s*\\{)`,"g"),`$1.${n}$2`)}function Yn(t,e){let o=String(t||"");for(;;){const n=Z(o,e);if(!n)break;let s=n.from;const r=o.lastIndexOf(`
`,s-1)+1;/^\s*$/.test(o.slice(r,s))&&(s=r);let i=n.to;o[i]===`
`&&(i+=1),o=o.slice(0,s)+o.slice(i)}return o}function Da(t,e,o){const n=Array.isArray(e)?e:[],s=Array.isArray(o)?o:[],{renamed:r,added:i}=Kn(n,s),l=new Set(s);let c=String(t||"");for(const d of r){const h=St(d.to);if(h){if(l.has(d.from)){Z(c,h)||(c=qe(c,h));continue}Z(c,d.from)?c=Pa(c,d.from,h):Z(c,h)||(c=qe(c,h))}}for(const d of i){const h=St(d);!h||Z(c,h)||(c=qe(c,h))}return c}function za(t,e,o){const n=new Set(Array.isArray(e)?e:[]),s=new Set(Array.isArray(o)?o:[]);let r=String(t||"");for(const i of s)n.has(i)||(r=Yn(r,i));return r}const st="__sve-css-rename-chip",Ha='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';function Ra(t){const e=t.Decoration.mark({class:"sve-cm-css-token"}),o=t.StateEffect.define();return{extensions:[t.StateField.define({create(){return t.Decoration.none},update(s,r){let i;for(const c of r.effects)c.is(o)&&(i=c.value);if(i===void 0)return r.docChanged?t.Decoration.none:s;if(!i)return t.Decoration.none;const l=new t.RangeSetBuilder;return l.add(i.from,i.to,e),l.finish()},provide:s=>t.EditorView.decorations.from(s)})],setHover(s,r){s&&s.dispatch({effects:o.of(r)})}}}function rt(t){t?.getElementById(st)?.remove()}function ja(t,e,o,n){e.style.left=`${Math.max(6,Math.min(o,t.innerWidth-28))}px`,e.style.top=`${Math.max(6,n)}px`}function Na(t,e,o,{onRename:n,title:s}){const r=t.document,i=e.coordsAtPos(o.to);if(!i)return;rt(r);const l=r.createElement("button");l.id=st,l.type="button",l.innerHTML=Ha,l.title=s,l.setAttribute("aria-label",s),l.addEventListener("mousedown",c=>{c.preventDefault(),c.stopPropagation(),rt(r),n?.(o)}),l.addEventListener("mouseleave",()=>{t.setTimeout(()=>{e.dom.matches(":hover")||l.matches(":hover")||rt(r)},120)}),r.body.appendChild(l),ja(t,l,i.right+2,i.top-1)}function Wa(t,e,{onRename:o,isLocked:n,setHover:s,title:r}){if(!e?.dom||e.dom._sveClassTokenBound)return;e.dom._sveClassTokenBound=!0;let i=null,l="";const c=()=>!!n?.(),d=()=>{t.clearTimeout(i),i=null,l="",s?.(e,null),rt(t.document)},h=f=>{if(c()){d();return}d(),o?.(f)};e.dom.addEventListener("mousemove",f=>{if(c()){d();return}if(f.target?.closest?.(`#${st}`))return;const p=e.posAtCoords({x:f.clientX,y:f.clientY});if(p==null)return;const y=Ko(e.state.doc.toString(),p);if(!y){t.clearTimeout(i),i=null,l="",s?.(e,null);return}const k=`${y.from}:${y.to}:${y.name}`;s?.(e,{from:y.from,to:y.to}),!(l===k&&(i||t.document.getElementById(st)))&&(t.clearTimeout(i),l=k,i=t.setTimeout(()=>{i=null,Na(t,e,y,{onRename:h,title:r||"Rename class"})},160))}),e.dom.addEventListener("mouseleave",f=>{f.relatedTarget?.closest?.(`#${st}`)||t.setTimeout(()=>{t.document.getElementById(st)?.matches(":hover")||d()},160)}),e.dom.addEventListener("dblclick",f=>{if(c())return;const p=e.posAtCoords({x:f.clientX,y:f.clientY});if(p==null)return;const y=Ko(e.state.doc.toString(),p);y&&(f.preventDefault(),f.stopPropagation(),h(y))},!0),e.scrollDOM?.addEventListener("scroll",d),t.document._sveClassTokenDismiss||(t.document._sveClassTokenDismiss=!0,t.document.addEventListener("mousedown",f=>{f.target.closest(`#${st}`)||rt(t.document)}))}const a={cssColorsPromise:null,lastUid:null,lastType:null,typeStack:[],lastParts:{html:"",css:"",js:""},lastProps:[],propsDirty:!1,lastLocked:!1,lockReady:!1,lastWin:null,loadGen:0,saveTimer:null,lastBracketNames:null,lastCssSelectorNames:null,saveInFlight:null,loadInFlight:null,dragging:!1,applying:!1,htmlScopePref:!0,htmlScopeActive:!1,styleMode:"css",cssToolRow:null,cssOpenTool:"",cssOpenMenu:"",cssValues:!1,twCss:null,twKey:"",twBusy:!1,twDirty:!1,htmlFocus:null,htmlFull:"",cssFull:"",cssPane:"full",cssScopeSnapshot:"",layoutObserver:null,layoutWin:null,observedEditor:null,observedRight:null,layoutWatchBound:!1,cssSize:"",cssState:"",cssOwnFolds:new Set,cssFoldSig:"",htmlPartialUi:null,htmlAntlersUi:null,htmlClassTokenUi:null,htmlLintUi:null,cssGhostUi:null},qa=["aria-label"],Va={value:""},Ua=["label"],Ka=["value"],Jn={__name:"CodeDockAntlersSelect",props:{label:{type:String,required:!0},groups:{type:Array,required:!0},onPick:{type:Function,required:!0}},setup(t){const e=t;function o(n){const s=n.target.value;n.target.value="",s&&e.onPick(s)}return(n,s)=>(b(),x("select",{"data-sve-antlers-select":"","aria-label":t.label,onChange:o},[g("option",Va,A(t.label),1),(b(!0),x(P,null,U(t.groups,r=>(b(),x("optgroup",{key:r.id,label:r.label},[(b(!0),x(P,null,U(r.items,i=>(b(),x("option",{key:i.id,value:i.id},A(i.label),9,Ka))),128))],8,Ua))),128))],40,qa))}},Ga={"data-sve-data-search":""},Xa=["placeholder","aria-label","onKeydown"],Za={"data-sve-data-tabs":""},Ya=["data-active","onClick"],Ja={key:0,"data-sve-data-empty":""},Qa={key:0,"data-sve-data-group":""},ti=["data-cursor","title","onMouseenter","onClick"],ei={"data-sve-data-name":""},oi={key:0,"data-sve-data-parent":""},ni={key:1,"data-sve-data-loop":""},si={key:2,"data-sve-data-value":""},ri={__name:"CodeDockDataVars",props:{title:{type:String,default:""},placeholder:{type:String,default:""},emptyText:{type:String,default:""},noSectionText:{type:String,default:""},loopText:{type:String,default:""},tabs:{type:Array,required:!0},data:{type:Object,required:!0},onPick:{type:Function,required:!0}},setup(t){const e=t,o=dt(""),n=dt(null),s=dt(e.tabs[0]?.id||"section"),r=dt(null),i=dt(-1),l=dt(!1),c=Rt(()=>o.value.trim().toLowerCase()),d=Rt(()=>{const _=e.data[s.value]||[];return Array.isArray(_)&&_.length&&_[0]?.items?_:[{handle:s.value,label:"",items:_,bare:!0}]}),h=Rt(()=>{const _=c.value;return d.value.map(S=>({...S,items:(S.items||[]).filter(M=>!_||M.var.toLowerCase().includes(_)||String(M.label||"").toLowerCase().includes(_)||String(M.parent||"").toLowerCase().includes(_))})).filter(S=>S.items.length)}),f=Rt(()=>h.value.flatMap(_=>_.items.map(S=>({row:S,group:_})))),p=Rt(()=>!f.value.length);$n(()=>Ge(()=>n.value?.focus()));function y(_){l.value=!0;const S=f.value.length;if(!S){i.value=-1;return}const M=i.value+_;i.value=M<0?-1:Math.min(M,S-1),Ge(()=>k())}function k(){const _=r.value?.querySelector("[data-cursor]");if(!_)return;let S=_.parentElement;for(;S&&S.scrollHeight<=S.clientHeight;)S=S.parentElement;if(!S)return;const M=_.offsetTop,H=M+_.offsetHeight;M<S.scrollTop?S.scrollTop=M:H>S.scrollTop+S.clientHeight&&(S.scrollTop=H-S.clientHeight)}function z(_){return f.value.findIndex(S=>S.row===_)}function mt(_){l.value||(i.value=z(_))}function Ht(){const _=i.value>=0?f.value[i.value]:null;_&&e.onPick(_.row,_.group)}function ae(_){s.value=_,i.value=-1}return(_,S)=>(b(),x(P,null,[g("div",Ga,[S[6]||(S[6]=g("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[g("circle",{cx:"11",cy:"11",r:"7"}),g("path",{d:"m20 20-3.5-3.5"})],-1)),Cn(g("input",{ref_key:"input",ref:n,"data-sve-data-input":"","onUpdate:modelValue":S[0]||(S[0]=M=>o.value=M),type:"text",placeholder:t.placeholder,"aria-label":t.title,onInput:S[1]||(S[1]=M=>i.value=-1),onKeydown:[S[2]||(S[2]=Et(F(M=>y(1),["prevent"]),["down"])),S[3]||(S[3]=Et(F(M=>y(-1),["prevent"]),["up"])),Et(F(Ht,["prevent"]),["enter"]),S[4]||(S[4]=Et(F(()=>{},["stop"]),["escape"]))]},null,40,Xa),[[Tn,o.value]])]),g("div",Za,[(b(!0),x(P,null,U(t.tabs,M=>(b(),x("button",{key:M.id,type:"button","data-sve-data-tab":"","data-active":s.value===M.id?"":void 0,onClick:F(H=>ae(M.id),["prevent","stop"])},A(M.label),9,Ya))),128))]),p.value?(b(),x("div",Ja,A(s.value==="section"&&!(t.data.section||[]).length?t.noSectionText:t.emptyText),1)):j("",!0),g("div",{ref_key:"rowsEl",ref:r,onMousemove:S[5]||(S[5]=M=>l.value=!1)},[(b(!0),x(P,null,U(h.value,M=>(b(),x(P,{key:M.handle},[M.bare?j("",!0):(b(),x("div",Qa,A(M.label),1)),(b(!0),x(P,null,U(M.items,H=>(b(),x("button",{key:M.handle+"::"+H.var+"::"+(H.parent||""),type:"button","data-sve-data-option":"","data-cursor":z(H)===i.value?"":void 0,title:H.label,onMouseenter:_r=>mt(H),onClick:F(_r=>t.onPick(H,M),["prevent","stop"])},[g("span",ei,A(H.var),1),H.parent?(b(),x("span",oi,A(H.parent),1)):j("",!0),H.loop?(b(),x("span",ni,A(t.loopText),1)):H.value?(b(),x("span",si,A(H.value),1)):j("",!0)],40,ti))),128))],64))),128))],544)],64))}},Bt=new Map,Zo={scope:null,section:[],page:[],site:[]};function ai(t){const e=t?.location?.pathname?.match(/\/collections\/([^/]+)\//);return e?e[1]:""}function ii(t){const e=String(t||"").trim();return!e||/^(header|footer)\//.test(e)?"":e}function li(t){return(Array.isArray(t)?t:[]).filter(e=>e?.handle).map(e=>`${e.kind==="collection"?"collection":"field"}:${e.handle}`).join("|")}function Qn({collection:t,set:e,view:o,scope:n}){return`${t}::${e}::${o||""}::${n||""}`}function ci(t){return Bt.get(t)||null}function di(t,{collection:e,set:o,view:n,scope:s}){const r=Qn({collection:e,set:o,view:n,scope:s}),i=Bt.get(r);if(i)return Promise.resolve(i);const l=new URLSearchParams;return e&&l.set("collection",e),o&&l.set("set",o),n&&l.set("view",n),s&&l.set("scope",s),t.fetch(`/!/sve/data-vars?${l.toString()}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(c=>c.ok?c.json():null).then(c=>{const d=c&&typeof c=="object"?c:Zo;return Bt.set(r,d),d}).catch(()=>Zo)}function ui(t){if(!t){Bt.clear();return}const e=`::${t}::`;for(const o of[...Bt.keys()])o.includes(e)&&Bt.delete(o)}function fi(t){if(t==null||t==="")return"";if(typeof t=="boolean")return t?"true":"false";if(Array.isArray(t))return t.length?`${t.length} ×`:"";if(typeof t=="object"){const o=Object.keys(t).length;return o?`${o} ×`:""}const e=String(t).replace(/\s+/g," ").trim();return e.length>60?`${e.slice(0,60)}…`:e}function hi(t,e){return e.split(".").reduce((o,n)=>o&&typeof o=="object"?o[n]:void 0,t)}function ts(t,e){return!Array.isArray(t)||!e||typeof e!="object"?t||[]:t.map(o=>{if(o.parent||o.value!=null||o.var.includes(":"))return o;const n=fi(hi(e,o.var));return n?{...o,value:n}:o})}function pi(t,e){return Array.isArray(t)?t.map(o=>({...o,items:ts(o.items,e)})):[]}function mi(t,e){const o=String(t?.var||"").trim();if(!o)return null;if(t.loop)return{text:`{{ ${o} }}
  
{{ /${o} }}`,cursor:`{{ ${o} }}
  `.length};if(e?.loop&&!t.parent){const n=e.loop;return{text:`{{ ${n} }}
  {{ ${o} }}
{{ /${n} }}`,cursor:`{{ ${n} }}
  {{ ${o} }}`.length}}return{text:`{{ ${o} }}`,cursor:`{{ ${o} }}`.length}}const le="visual_edit",gi=[{id:"base",lang:"code_dock_visual_edit_base"},{id:"field",lang:"code_dock_visual_edit_field"}],es=[{id:"tag",group:"base",label:"{{ visual_edit }}",standalone:"{{ visual_edit| }}"},{id:"ve_popup",group:"base",label:"popup",attr:'popup="true"'},{id:"ve_orderable",group:"base",label:"orderable",attr:'orderable="true"'},{id:"ve_section_orderable",group:"base",label:"section_orderable",attr:'section_orderable="true"'},{id:"ve_outline_inside",group:"base",label:"outline_inside",attr:'outline_inside="true"'},{id:"ve_field",group:"field",label:"field",attr:'field="|"'},{id:"ve_inline_edit",group:"field",label:"inline_edit",attr:'inline_edit="true"'},{id:"ve_insertable",group:"field",label:"insertable",attr:'insertable="true"'},{id:"ve_toolbar",group:"field",label:"toolbar",attr:'toolbar="true"'},{id:"ve_scope",group:"field",label:"scope",attr:'scope="|"'},{id:"ve_controls",group:"field",label:"controls",attr:'controls="|"'}];function vi(t){return es.find(e=>e.id===t)||null}function yi(t,e,o,n){let s=e;for(;s<o;){const r=t.indexOf("{{",s);if(r===-1||r>=o)return null;const i=t.indexOf("}}",r+2);if(i===-1||i+2>o)return null;const l=t.slice(r+2,i);if((l.trim().split(/\s+/)[0]||"")===n)return{openIdx:r,closeIdx:i,inner:l};s=i+2}return null}function bi(t,e){const o=String(e).split("=")[0].trim();return new RegExp(`(^|\\s)${o}(=|\\s|$)`).test(t)}const xi={class:"sve-code-dock"},ki={"data-sve-code-bar":""},Si={type:"button","data-sve-code-pane-btn":"html"},wi={type:"button","data-sve-code-pane-btn":"css"},_i={type:"button","data-sve-code-pane-btn":"alpine"},$i={type:"button","data-sve-code-pane-btn":"js"},Ci={type:"button","data-sve-html-scope":"","aria-pressed":"true"},Ti=["innerHTML"],Ai={"data-sve-code-panes":""},Mi={"data-sve-code-pane":"html"},Ei={"data-sve-code-pane-label":""},Bi=["title","aria-label"],Li=["innerHTML"],Fi={"data-sve-code-pane":"css"},Ii={"data-sve-css-chrome":"subrow-2"},Oi={"data-sve-code-pane-label":""},Pi={"data-sve-css-label":""},Di={"data-sve-code-pane":"alpine"},zi={"data-sve-code-pane-label":""},Hi={"data-sve-code-pane":"js"},Ri={"data-sve-code-pane-label":""},ji={__name:"CodeDockChrome",props:{htmlLabel:{type:String,required:!0},cssLabel:{type:String,required:!0},jsLabel:{type:String,required:!0},alpineLabel:{type:String,required:!0},treeIcon:{type:String,required:!0},dataIcon:{type:String,required:!0},dataLabel:{type:String,required:!0}},setup(t){return(e,o)=>(b(),x("div",xi,[o[20]||(o[20]=g("div",{"data-sve-code-grip":"","aria-hidden":"true"},null,-1)),g("div",ki,[g("button",Si,A(t.htmlLabel),1),g("button",wi,A(t.cssLabel),1),g("button",_i,A(t.alpineLabel),1),g("button",$i,A(t.jsLabel),1),o[0]||(o[0]=$r('<button type="button" data-sve-code-back hidden></button><span data-sve-code-path></span><span data-sve-code-status></span><button type="button" data-sve-code-strip></button><button type="button" data-sve-code-history></button><button type="button" data-sve-style-mode></button><button type="button" data-sve-values-mode></button>',7)),g("button",Ci,[g("span",{innerHTML:t.treeIcon},null,8,Ti)]),o[1]||(o[1]=g("button",{type:"button","data-sve-code-autosave":"","aria-pressed":"true"},null,-1)),o[2]||(o[2]=g("button",{type:"button","data-sve-code-save":"",hidden:""},null,-1)),o[3]||(o[3]=g("button",{type:"button","data-sve-code-lock":"",hidden:""},null,-1))]),o[21]||(o[21]=g("div",{"data-sve-code-lock-banner":""},null,-1)),g("div",Ai,[g("div",Mi,[g("div",Ei,[g("span",null,A(t.htmlLabel),1),o[4]||(o[4]=g("div",{"data-sve-html-tools":""},null,-1)),o[5]||(o[5]=g("button",{type:"button","data-sve-html-tidy":""},null,-1)),g("button",{type:"button","data-sve-data-vars":"",title:t.dataLabel,"aria-label":t.dataLabel},[g("span",{innerHTML:t.dataIcon},null,8,Li)],8,Bi),o[6]||(o[6]=g("div",{"data-sve-visual-edit-tools":""},null,-1)),o[7]||(o[7]=g("div",{"data-sve-antlers-tools":""},null,-1))]),o[8]||(o[8]=g("div",{"data-sve-html-problems":"",hidden:""},null,-1)),o[9]||(o[9]=g("div",{"data-sve-code-host":""},null,-1))]),o[17]||(o[17]=g("div",{"data-sve-code-split":"","data-sve-code-split-after":"html"},null,-1)),g("div",Fi,[g("div",Ii,[g("div",Oi,[g("span",Pi,A(t.cssLabel),1),o[10]||(o[10]=g("button",{type:"button","data-sve-css-add-class":""},null,-1)),o[11]||(o[11]=g("div",{"data-sve-css-tools":""},null,-1))])]),o[12]||(o[12]=g("div",{"data-sve-css-head":""},null,-1)),o[13]||(o[13]=g("div",{"data-sve-code-host":""},null,-1)),o[14]||(o[14]=g("div",{"data-sve-tw-host":""},null,-1))]),o[18]||(o[18]=g("div",{"data-sve-code-split":"","data-sve-code-split-after":"css"},null,-1)),g("div",Di,[g("div",zi,[g("span",null,A(t.alpineLabel),1)]),o[15]||(o[15]=g("div",{"data-sve-alpine-host":""},null,-1))]),o[19]||(o[19]=g("div",{"data-sve-code-split":"","data-sve-code-split-after":"alpine"},null,-1)),g("div",Hi,[g("div",Ri,[g("span",null,A(t.jsLabel),1)]),o[16]||(o[16]=g("div",{"data-sve-code-host":""},null,-1))])])]))}},Yo="view:",Jo="partials/";function os(t){const e=String(t||"");if(!e.startsWith(Yo))return null;const o=e.slice(Yo.length);return o.startsWith(Jo)?o.slice(Jo.length):o}function Ni(t){const e=String(t||"").match(/\sclass\s*=\s*(["'])([\s\S]*?)\1/i);return e?e[2].replace(/\{\{[\s\S]*?\}\}/g,"\0").split(/[\s[\]]+/).filter(o=>o&&!o.includes("\0")&&/^[A-Za-z_][\w:./%!#-]*$/.test(o)):[]}const Wi=t=>globalThis.CSS?.escape?globalThis.CSS.escape(t):t.replace(/([^\w-])/g,"\\$1");function ns(t){const e=Se(t)[0];if(!e)return null;const o=Ni(String(t).slice(e.from,e.openTo));return!o.length&&!/^(header|footer|main|nav|aside|figure|form|table)$/.test(e.tag)?null:e.tag+o.map(n=>`.${Wi(n)}`).join("")}const Wt=new Map;let jt=null,Qo=0,tn=0,en=!1;async function qi(t,e){if(Wt.has(e))return Wt.get(e);const o=`view:partials/${e}`;let n=null;try{const s=await t.fetch(`/!/sve/section-template?type=${encodeURIComponent(o)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}});if(s.ok){const r=await s.json();n=typeof r.html=="string"?ns(r.html):null}}catch{}return Wt.set(e,n),n}function Vi(t){t?Wt.delete(t):Wt.clear()}function ss(t){const e=os(xt("dock:current-type")),o=e?xt("dock:html"):"",n=e&&typeof o=="string"?ns(o):null;An({source:Nn,type:jn.SVE_COMPONENT_FOCUS,on:!!n,name:e?String(e).split("/").pop():"",selector:n||""},t)}async function xo(t){const e=++tn,o=xt("dock:html"),n=[...new Set((typeof o=="string"?In(o):[]).map(r=>r.src).filter(r=>r&&!ea(r)))],s=await Promise.all(n.map(r=>qi(t,r)));e===tn&&An({source:Nn,type:jn.SVE_COMPONENT_MAP,items:n.map((r,i)=>({src:r,name:r.split("/").pop(),selector:s[i]})).filter(r=>r.selector)},t)}function Ui(t){jt=t,!en&&(en=!0,ke("dock:html-changed",()=>{jt&&(Vi(os(xt("dock:current-type"))),jt.clearTimeout(Qo),Qo=jt.setTimeout(()=>{xo(jt)},400))}))}const Ki=["data-sve-html-tool","data-tip","aria-label","data-letter","onClick","onContextmenu"],Gi=["innerHTML"],Xi={__name:"CodeDockHtmlTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(t){return(e,o)=>(b(!0),x(P,null,U(t.tools,n=>(b(),x("button",{key:n.id,type:"button","data-sve-html-tool":n.id,"data-tip":n.title,"aria-label":n.title,"data-letter":n.letter?"":void 0,onClick:F(s=>t.onTool(n.id),["prevent","stop"]),onContextmenu:F(s=>t.onTool(n.id),["prevent"])},[n.letter?(b(),x(P,{key:0},[Mn(A(n.letter),1)],64)):(b(),x("span",{key:1,innerHTML:n.icon},null,8,Gi))],40,Ki))),128))}},ut=uo({tools:[],onTool:null,onKid:null}),Zi=["data-sve-css-item"],Yi=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],Ji={key:0,"data-sve-css-kids":""},Qi={key:0,"data-sve-css-sep":"","aria-hidden":"true"},tl=["data-sve-css-kid","data-sve-css-box-side","data-tip","aria-label","innerHTML","onClick","onContextmenu"],el={__name:"CodeDockCssTools",setup(t){return(e,o)=>(b(!0),x(P,null,U(T(ut).tools,n=>(b(),x("li",Ne({key:n.id,"data-sve-css-item":n.id},{ref_for:!0},n.open?{"data-sve-css-open":""}:{}),[g("button",Ne({type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title},{ref_for:!0},{...n.active?{"data-active":""}:{},...n.open?{"data-open":""}:{}},{innerHTML:n.icon,onClick:F(s=>T(ut).onTool?.(n.id),["prevent","stop"]),onContextmenu:F(s=>T(ut).onTool?.(n.id),["prevent"])}),null,16,Yi),n.open&&n.kids.length?(b(),x("div",Ji,[(b(!0),x(P,null,U(n.kids,s=>(b(),x(P,{key:s.id},[s.sep?(b(),x("span",Qi)):j("",!0),g("button",Ne({type:"button","data-sve-css-kid":s.id,"data-sve-css-box-side":s.id,"data-tip":s.title,"aria-label":s.title},{ref_for:!0},s.active?{"data-active":""}:{},{innerHTML:s.icon,onClick:F(r=>T(ut).onKid?.(n.id,s.id),["prevent","stop"]),onContextmenu:F(r=>T(ut).onKid?.(n.id,s.id),["prevent"])}),null,16,tl)],64))),128))])):j("",!0)],16,Zi))),128))}},ol=1.5,nl=16;function fe(t,e){const o=parseFloat(t);return Number.isFinite(o)?e==="em"||e==="rem"?o*nl:o:null}function sl(t){const e=String(t||"").toLowerCase();if(/\bmin-width\b|\bwidth\s*>=?/.test(e))return null;let o=e.match(/\bmax-width\s*:\s*([\d.]+)(px|em|rem)/);return o||(o=e.match(/\bwidth\s*<=?\s*([\d.]+)(px|em|rem)/),o)?fe(o[1],o[2]):(o=e.match(/([\d.]+)(px|em|rem)\s*>=?\s*width\b/),o?fe(o[1],o[2]):null)}function ft(t,e){const o=sl(t);if(o===null)return"";for(const n of e||[]){if(n.base)continue;const s=fe(String(n.max||"").replace(/[a-z]+$/i,""),(String(n.max||"").match(/[a-z]+$/i)||[""])[0]);if(s!==null&&Math.abs(s-o)<=ol)return n.handle}return""}function $e(t){let e="",o=0;for(;o<t.length;){const n=Ce(t,o);if(n!==o){e+=" ".repeat(n-o),o=n;continue}e+=t[o],o+=1}return e}function Ce(t,e){if(t.startsWith("/*",e)){const o=t.indexOf("*/",e+2);return o===-1?t.length:o+2}if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?t.length:o+2}if(t[e]==='"'||t[e]==="'"){const o=t[e];for(let n=e+1;n<t.length;n+=1)if(t[n]==="\\")n+=1;else if(t[n]===o)return n+1;return t.length}return e}function Te(t){const e=String(t||""),o=[],n=(s,r,i=0)=>{let l=s,c=l;for(;l<r;){const d=Ce(e,l);if(d!==l){l=d;continue}if(e[l]===";"){l+=1,c=l;continue}if(e[l]==="}")return;if(e[l]!=="{"){l+=1;continue}const h=$e(e.slice(c,l)),f=h.trim(),p=rs(e,l,r);if(p===-1)return;/^@media\b/i.test(f)?o.push({query:f.replace(/^@media\s*/i,"").trim(),from:c+h.search(/\S/),to:p+1,bodyFrom:l+1,bodyTo:p,depth:i}):/^@(?:import|charset|use)\b/i.test(f)||n(l+1,p,i+1),l=p+1,c=l}};return n(0,e.length,0),o}function rs(t,e,o){let n=0;for(let s=e;s<o;s+=1){const r=Ce(t,s);if(r!==s){s=r-1;continue}if(t[s]==="{")n+=1;else if(t[s]==="}"&&(n-=1,n===0))return s}return-1}function Pt(t){const e=String(t||""),o=(n,s)=>{const r=[];let i=n,l=i;for(;i<s;){const c=Ce(e,i);if(c!==i){i=c;continue}if(e[i]===";"){i+=1,l=i;continue}if(e[i]==="}")return r;if(e[i]!=="{"){i+=1;continue}const d=$e(e.slice(l,i)),h=d.trim(),f=rs(e,i,s);if(f===-1)return r;r.push({prelude:h,media:/^@media\b/i.test(h),query:h.replace(/^@media\s*/i,"").trim(),from:l+d.search(/\S/),to:f+1,bodyFrom:i+1,bodyTo:f,children:/^@(?:import|charset|use)\b/i.test(h)?[]:o(i+1,f)}),i=f+1,l=i}return r};return o(0,e.length)}function rl(t,e,o){const n=String(t||"");if(!o)return[];const s=(e||[]).find(d=>d.base),r=Pt(n),i=[],l=d=>d.media?ft(d.query,e)===o:d.children.some(l);if(s&&o===s.handle){const d=h=>{for(const f of h){if(f.media&&ft(f.query,e)){i.push({from:f.from,to:f.to});continue}d(f.children)}};return d(r),i}const c=(d,h,f)=>{const p=[];for(const k of d){if(k.media&&ft(k.query,e)===o){p.push({from:k.from,to:k.to,into:null});continue}l(k)&&p.push({from:k.from,to:k.to,into:k})}if(!p.length){f>h&&i.push({from:h,to:f});return}let y=h;for(const k of p)k.from>y&&i.push({from:y,to:k.from}),k.into&&c(k.into.children,k.into.bodyFrom,k.into.bodyTo),y=k.to;f>y&&i.push({from:y,to:f})};return c(r,0,n.length),i.filter(d=>n.slice(d.from,d.to).trim()!=="")}function al(t,e){const o=String(t||""),n=[],s=i=>{for(const l of i){if((l.media&&ft(l.query,e)||/^#id-/.test(l.prelude))&&$e(o.slice(l.bodyFrom,l.bodyTo)).trim()===""){n.push(l);continue}s(l.children)}};if(s(Pt(o)),!n.length)return o;let r=o;for(const i of n.sort((l,c)=>c.from-l.from)){let l=i.from,c=i.to;const d=r.lastIndexOf(`
`,l-1)+1;for(r.slice(d,l).trim()===""&&(l=d);r[c]===" "||r[c]==="	";)c+=1;r[c]===`
`&&(c+=1),r=r.slice(0,l)+r.slice(c)}return r}function il(t,e){const o=String(t||""),n=[],s=i=>$e(o.slice(i.bodyFrom,i.bodyTo)).trim()==="",r=i=>{for(const l of i){if((l.media&&ft(l.query,e)||/^#id-/.test(l.prelude))&&s(l)){n.push({from:l.from,to:l.to});continue}r(l.children)}};return r(Pt(o)),n}function me(t,e,o){const n=e||[],s=n.find(d=>d.base),r=[],i=d=>/^#id-/.test(d.prelude)||/^#\s*$/.test(d.prelude),l=(d,h)=>{for(const f of d){if(!f.media){l(f.children,h);continue}const p=ft(f.query,n)||h;if(o===p){r.push(f);continue}l(f.children,p)}},c=(d,h)=>{for(const f of d){if(f.media){c(f.children,ft(f.query,n)||h);continue}if(i(f)){const p=h||(s?s.handle:"");!o||o===p?r.push(f):l(f.children,p);continue}c(f.children,h)}};return c(Pt(String(t||"")),""),r.sort((d,h)=>d.from-h.from)}function ko(t,e,o){return Te(t).filter(n=>ft(n.query,e)===o)}const L=uo({tag:"",scope:"",onTag:null,sizes:[],onSize:null,state:"",stateLabel:"",onState:null,canEdit:!1,note:""}),ll={class:"sve-css-head"},cl=["disabled"],dl={key:1,class:"sve-css-scope"},ul=["title","data-active","disabled","onClick"],fl=["data-active","disabled"],hl={key:2,class:"sve-css-note"},pl={__name:"CodeDockCssHead",setup(t){return(e,o)=>(b(),x("div",ll,[T(L).tag?(b(),x("button",{key:0,type:"button",class:"sve-css-tag",disabled:!T(L).canEdit,onClick:o[0]||(o[0]=F(()=>{},["prevent","stop"])),onDblclick:o[1]||(o[1]=F(n=>T(L).onTag?.(n),["prevent","stop"]))},"<"+A(T(L).tag)+">",41,cl)):j("",!0),T(L).scope?(b(),x("span",dl,A(T(L).scope),1)):j("",!0),(b(!0),x(P,null,U(T(L).sizes,n=>(b(),x("button",{key:n.key,type:"button","data-sve-css-size":"",title:n.title,"data-active":n.active?"":void 0,disabled:!T(L).canEdit,onClick:F(s=>T(L).onSize?.(n.key),["prevent","stop"])},A(n.label),9,ul))),128)),g("button",{type:"button","data-sve-css-state":"","data-active":T(L).state?"":void 0,disabled:!T(L).canEdit,onClick:o[2]||(o[2]=F(n=>T(L).onState?.(n),["prevent","stop"]))},[Mn(A(T(L).stateLabel)+" ",1),o[3]||(o[3]=g("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[g("path",{d:"m6 9 6 6 6-6"})],-1))],8,fl),o[4]||(o[4]=g("span",{class:"sve-css-gap"},null,-1)),T(L).note?(b(),x("span",hl,A(T(L).note),1)):j("",!0)]))}},ml=En(pl,[["__scopeId","data-v-43bc76ce"]]),gl={key:0,"data-sve-css-swatches":""},vl=["data-sve-css-token","title","data-active","onClick"],yl={key:0,"data-sve-css-head-row":""},bl={key:1,"data-sve-css-note-row":""},xl=["data-sve-css-token","data-active","onClick"],kl={"data-sve-css-choice-label":""},Sl={key:0,"data-sve-css-choice-hint":""},ot={__name:"CodeDockMenu",props:{kind:{type:String,required:!0},swatches:{type:Array,default:()=>[]},choices:{type:Array,default:()=>[]},onClear:{type:Function,default:null},onPick:{type:Function,required:!0}},setup(t){return(e,o)=>t.kind==="colors"?(b(),x("div",gl,[g("button",{type:"button","data-sve-css-clear":"",title:"Clear",onClick:o[0]||(o[0]=F((...n)=>t.onClear&&t.onClear(...n),["prevent","stop"]))},[...o[1]||(o[1]=[g("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none",stroke:"currentColor","stroke-width":"1.5"},[g("path",{d:"M2 2l6 6M8 2L2 8"})],-1)])]),(b(!0),x(P,null,U(t.swatches,n=>(b(),x("button",{key:n.name,type:"button","data-sve-css-swatch":"","data-sve-css-token":n.name,title:n.name,"data-active":n.active?"":void 0,style:Cr({background:n.hex||"transparent"}),onClick:F(s=>t.onPick(n.name),["prevent","stop"])},null,12,vl))),128))])):(b(!0),x(P,{key:1},U(t.choices,n=>(b(),x(P,{key:n.value},[n.heading?(b(),x("span",yl,A(n.label),1)):n.note?(b(),x("span",bl,A(n.label),1)):(b(),x("button",{key:2,type:"button","data-sve-css-choice":"","data-sve-css-token":n.token||void 0,"data-active":n.active?"":void 0,onClick:F(s=>t.onPick(n.value),["prevent","stop"])},[g("span",kl,A(n.label),1),n.hint?(b(),x("span",Sl,A(n.hint),1)):j("",!0)],8,xl))],64))),128))}},wl=/^\.[a-zA-Z_][\w-]*$/;function _l(t,e,o){return String(e||"").includes(o)?ge(t).length===1:!1}function ge(t){return Pt(t).filter(e=>/^@scope\b/i.test(e.prelude))}function $l(t){const e=String(t||"");return Pt(e).filter(o=>wl.test(o.prelude)?!e.slice(o.from,o.bodyFrom-1).includes("{{"):!1).map(o=>({from:o.from,to:o.to,name:o.prelude.slice(1)}))}function Cl(t,e,o){const n=String(t||"");if(!_l(n,e,o))return n;const s=$l(n);if(!s.length)return n;const r=ge(n)[0],i=Ml(n,r),l=s.map(p=>El(n.slice(p.from,p.to),n,p.from,i)).join(`

`);let c=n;for(const p of[...s].sort((y,k)=>k.from-y.from))c=Al(c,p.from,p.to);const d=Tl(c,o);if(d===-1)return n;const h=(c.slice(0,d).match(/\n([^\S\n]*)$/)||[null,null])[1],f=h===null?d:d-h.length;return`${c.slice(0,f)}
${l}
${h??""}${c.slice(d)}`}function Tl(t,e){const o=ge(t).find(n=>n.prelude.includes(e));return o?o.bodyTo:ge(t)[0]?.bodyTo??-1}function Al(t,e,o){let n=e,s=o;const r=t.lastIndexOf(`
`,n-1)+1;for(t.slice(r,n).trim()===""&&(n=r);t[s]===" "||t[s]==="	";)s+=1;return t[s]===`
`&&(s+=1),t.slice(0,n)+t.slice(s)}function Ml(t,e){const o=t.slice(e.bodyFrom,e.bodyTo).match(/\n([^\S\n]+)\S/);return o?o[1]:`${(t.slice(0,e.from).match(/\n([^\S\n]*)$/)||[null,""])[1]}    `}function El(t,e,o,n){const s=(e.slice(0,o).match(/\n([^\S\n]*)$/)||[null,""])[1];return t.split(`
`).map((r,i)=>i===0?n+r.trim():r.startsWith(s)?n+r.slice(s.length):n+r.trimStart()).join(`
`)}const Bl={"data-sve-css-add-label":""},Ll=["placeholder","onKeydown"],So={__name:"CodeDockAddClass",props:{label:{type:String,required:!0},placeholder:{type:String,default:""},initial:{type:String,default:""},onAdd:{type:Function,required:!0}},setup(t){const e=t,o=dt(e.initial||""),n=dt(null);$n(()=>Ge(()=>{n.value?.focus(),n.value?.select()}));function s(){const r=o.value.trim();if(!r){n.value?.focus();return}e.onAdd(r)}return(r,i)=>(b(),x(P,null,[g("label",Bl,A(t.label),1),Cn(g("input",{ref_key:"input",ref:n,"data-sve-css-add-input":"","onUpdate:modelValue":i[0]||(i[0]=l=>o.value=l),type:"text",placeholder:t.placeholder,onKeydown:[Et(F(s,["prevent"]),["enter"]),i[1]||(i[1]=Et(F(()=>{},["stop"]),["escape"]))]},null,40,Ll),[[Tn,o.value]])],64))}};function on(t,e){e._sveLockBound||(e._sveLockBound=!0,e.querySelector("[data-sve-code-lock]")?.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),!(!a.lockReady||!a.lastType)){if(a.lastLocked){Il(t);return}as(t,!0)}}))}function wo(t){return t?Q(t,vr)!=="0":!0}function Fl(){const t=v.html;return!t||t.state.readOnly||!a.lastType?!1:!Mo(Ao(),a.lastParts)}function it(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-code-autosave]"),n=e?.querySelector("[data-sve-code-save]");if(!o||!n)return;const s=wo(t),r=Fl();o.setAttribute("aria-pressed",s?"true":"false"),o.title=m(t,s?"code_dock_autosave_on":"code_dock_autosave_off"),o.setAttribute("aria-label",o.title),o.innerHTML=yu,n.hidden=s,n.title=m(t,"code_dock_save"),n.setAttribute("aria-label",n.title),n.innerHTML=bu,r?n.setAttribute("data-dirty",""):n.removeAttribute("data-dirty")}function nn(t,e){e._sveAutosaveBound||(e._sveAutosaveBound=!0,e.querySelector("[data-sve-code-autosave]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=!wo(t);K(t,vr,n?"1":"0"),n?Y(t.document):a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null),it(t)}),e.querySelector("[data-sve-code-save]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),Y(t.document)}))}function Il(t){t.document.getElementById(X)?.remove();const e=Tr(t.document,Ar,{title:m(t,"code_dock_unlock_title"),body:m(t,"code_dock_unlock_body"),buttons:[{value:"cancel",label:m(t,"cancel"),variant:"ghost"},{value:"ok",label:m(t,"code_dock_unlock_confirm"),variant:"primary"}],onPick:o=>{e.dismiss(),o==="ok"&&as(t,!1)}});e.host.id=X}function as(t,e){const o=a.lastType;if(!o)return;const n=()=>{a.lastType===o&&t.fetch("/!/sve/section-template/lock",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Bn(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:o,locked:e})}).then(async s=>{if(!s.ok)throw new Error(String(s.status));a.lastType===o&&(a.lastLocked=e,Ft(t),te(a.lastParts,e),G(t),R(t.document,e?m(t,"code_dock_locked"):""))}).catch(()=>{R(t.document,m(t,"code_dock_error"))})};if(e&&(Y(t.document),a.saveInFlight)){a.saveInFlight.finally(n);return}n()}function ve(t){if(!a.lastUid||!a.lastType||String(a.lastType).startsWith("view:")){jo(t);return}const e=Er(a.lastUid,t.document);jo(t,e.length?{sectionUids:e}:void 0)}function Ol(t,e,o){return a.saveInFlight=t.fetch("/!/sve/section-template",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Bn(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:e,html:o.html,css:o.css,js:o.js,...typeof o.tw=="string"?{tw:o.tw}:{},...oa(t)?{props:a.lastProps}:{}})}).then(async n=>{if(n.status===423){a.lastLocked=!0,a.lockReady=!0,Ft(t),te(a.lastParts,!0),G(t),R(t.document,m(t,"code_dock_locked"));return}const s=await n.json().catch(()=>({}));if(!n.ok)throw new Error(s?.error==="not_writable"?"not_writable":String(n.status));if(a.lastType===e){if(a.lastParts=o,s?.tw_written===!1){a.twDirty=!0,R(t.document,m(t,"code_dock_tw_not_writable")),it(t),ve(t);return}R(t.document,m(t,"code_dock_saved")),it(t),t.setTimeout(()=>{const r=t.document.getElementById(u)?.querySelector("[data-sve-code-status]");r&&r.textContent===m(t,"code_dock_saved")&&(r.textContent="")},1800)}ve(t),t.document.getElementById("__sve-section-picker")?.dispatchEvent(new t.CustomEvent("sve-library-stale"))}).catch(n=>{R(t.document,m(t,n?.message==="not_writable"?"code_dock_not_writable":"code_dock_error"))}).finally(()=>{a.saveInFlight=null}),a.saveInFlight}function Y(t){a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null);const e=a.lastType,o=a.lastWin,n=v.html;if(!n||n.state.readOnly||!e||!o||!a.lockReady)return;const s=Ao(),r=a.twCss!==null&&On(o)&&_o(s.html)===a.twKey;Mo(s,a.lastParts)&&!(r&&a.twDirty)&&!a.propsDirty||(a.propsDirty=!1,r&&(s.tw=a.twCss,a.twDirty=!1),R(t,m(o,"code_dock_saving")),Ol(o,e,s))}function _o(t){return xa(t).sort().join(" ")}function Pl(){a.twCss=null,a.twKey="",a.twDirty=!1}function Dl(t,e){a.twCss=e,a.twKey=_o(t),a.twDirty=!1}function is(t,e){if(!t||!On(t))return;const o=_o(e);o===a.twKey||a.twBusy||(a.twBusy=!0,Mr(()=>import("./tw-compile-CV7No16T.js"),__vite__mapDeps([0,1]),import.meta.url).then(n=>n.compileTailwind(t,e)).then(n=>{a.twBusy=!1,a.twCss=n,a.twKey=o,a.twDirty=!0,ls(t,t.document)}).catch(n=>{a.twBusy=!1,console.error("[sve] tailwind compile",n)}))}function ls(t,e){a.saveTimer&&clearTimeout(a.saveTimer),a.saveTimer=t.setTimeout(()=>{a.saveTimer=null,Y(e)},hu)}function nt(t){if(a.applying)return;const e=Ao();if(Mo(e,a.lastParts)){it(t);return}if(it(t),is(t,e.html),!wo(t)){R(t.document,m(t,"code_dock_unsaved"));return}R(t.document,m(t,"code_dock_saving")),ls(t,t.document)}function cs(t,e){let o=0;const n=Math.min(t.length,e.length);for(;o<n&&t[o]===e[o];)o+=1;let s=t.length,r=e.length;for(;s>o&&r>o&&t[s-1]===e[r-1];)s-=1,r-=1;return[o,s,e.slice(o,r)]}function ds(t){const e=a.lastUid,o=typeof et=="function"?et(t.document):[];for(const n of o){const s=kt(n.values)||n.values;if(!(!s||typeof s!="object")&&e&&typeof No=="function"){const r=No(s,e);if(r){const i=r.split("."),l=Br(s,i.slice(0,2).join("."));if(l&&typeof l=="object")return l}}}for(const n of o){const s=kt(n.values)||n.values;if(s&&typeof s=="object")return s}return null}function us(t,e){!e||e===a.lastType||(Y(t.document),He(t,e,"push"))}function fs(t){const e=a.typeStack.pop();if(!e){Zt(t);return}Y(t.document),He(t,e,"keep")}function Ft(t){const e=t.document.getElementById(u),o=e?.querySelector("[data-sve-code-lock]"),n=e?.querySelector("[data-sve-code-lock-banner]");if(!e||!o)return;const s=a.lastLocked;e.toggleAttribute("data-sve-code-locked",s),s&&(Pn(t.document),rt(t.document),a.htmlPartialUi&&(a.htmlPartialUi.setHover(v.html,null),a.htmlPartialUi.setHover(v.css,null)),a.htmlClassTokenUi?.setHover(v.html,null)),o.hidden=!a.lockReady,o.setAttribute("aria-pressed",a.lastLocked?"true":"false"),o.title=m(t,a.lastLocked?"code_dock_unlock":"code_dock_lock"),o.setAttribute("aria-label",o.title),o.innerHTML=a.lastLocked?pu:mu,n&&(n.textContent=m(t,"code_dock_locked_banner"))}function Yt(t){return t?Q(t,je)!=="0":a.htmlScopePref}function Ae(t,e,o){return t!=null&&e!=null&&t>=0&&e>t&&e<=o}function Me(){const t=v.html?.state.doc.toString()??"";if(!a.htmlScopeActive||!a.htmlFocus){a.htmlFull=t;return}if(a.htmlFocus.from<0||a.htmlFocus.from>a.htmlFull.length||a.htmlFocus.to<a.htmlFocus.from){a.htmlScopeActive=!1,a.htmlFull=t,a.htmlFocus=null;return}a.htmlFull=a.htmlFull.slice(0,a.htmlFocus.from)+t+a.htmlFull.slice(a.htmlFocus.to),a.htmlFocus={from:a.htmlFocus.from,to:a.htmlFocus.from+t.length}}function Dt(){return Me(),a.htmlScopeActive?a.htmlFull:v.html?.state.doc.toString()??a.lastParts.html??""}function Ee(){a.lastBracketNames=we(Dt()).map(t=>t.name)}function zt(){a.lastCssSelectorNames=Un(v.css?.state.doc.toString()??a.cssFull)}function hs(t,e){return Array.isArray(t)&&Array.isArray(e)&&t.length===e.length&&t.every((o,n)=>o===e[n])}function zl(){const t=a.htmlScopeActive?$o():Dt(),e=_e(t);e.length&&(a.cssFull=bo(a.cssFull,yo(a.cssFull,e),e[0].className))}function ps(t,e){a.cssFull=Da(a.cssFull,t,e),zl(),a.cssFull=za(a.cssFull,e,t)}function Hl(t){if(a.applying||a.lastLocked||a.lastBracketNames==null)return;const e=we(Dt()).map(o=>o.name);hs(a.lastBracketNames,e)||(ps(a.lastBracketNames,e),a.lastBracketNames=e,Jt(),zt())}function Rl(){if(a.applying||a.lastLocked||a.lastCssSelectorNames==null||a.lastBracketNames==null||a.cssPane==="empty")return;const t=v.html,e=Un(v.css?.state.doc.toString()??"");if(!t||hs(a.lastCssSelectorNames,e))return;const o=new Set(a.lastBracketNames),{renamed:n,removed:s}=Kn(a.lastCssSelectorNames,e);let r=t.state.doc.toString();const i=r;for(const l of n){const c=St(l.to);!o.has(l.from)||!c||(r=Go(r,d=>d===l.from?c:d))}for(const l of s)!o.has(l)||e.includes(l)||(r=Go(r,c=>c===l?"":c));if(r!==i){a.applying=!0;try{Le(r)}finally{a.applying=!1}}Ee(),a.lastCssSelectorNames=e}function jl(t,e){const o=St(e),n=v.html;if(!o||!n||n.state.readOnly||o===t.name)return;a.applying=!0;try{n.dispatch({changes:{from:t.from,to:t.to,insert:o}})}finally{a.applying=!1}const s=a.lastBracketNames==null?[]:a.lastBracketNames.slice();Ee(),ps(s,a.lastBracketNames),Jt(),zt(),a.lastWin&&(nt(a.lastWin),O(a.lastWin))}function Nl(t,e){const o=t.document,s=v.html?.coordsAtPos(e.from);w(o),rt(o);const r=o.createElement("div"),i={getBoundingClientRect:()=>({left:s?.left??12,right:s?.right??12,top:s?.top??12,bottom:s?.bottom??12,width:0,height:0})};r.id=$,o.body.appendChild(r),W(t,i,r),r._sveApp=q(So,r,{label:m(t,"code_dock_css_rename_class"),placeholder:m(t,"code_dock_css_class_placeholder"),initial:e.name,onAdd:l=>{jl(e,l),w(o)}})}function ms(){return a.htmlScopePref&&Ae(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)?(a.htmlScopeActive=!0,a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to)):(a.htmlScopeActive=!1,a.htmlFull)}function Be(t,e,o){const n=v[t];if(!n)return;const s=n.state.doc.toString();a.applying=!0;try{if(s!==e){const[r,i,l]=cs(s,e);n.dispatch({changes:{from:r,to:i,insert:l},...o?{selection:o,scrollIntoView:!0}:{}})}else o&&n.dispatch({selection:o,scrollIntoView:!0})}finally{a.applying=!1}}function Le(t,e){Be("html",t,e)}function $o(){return a.htmlScopeActive?v.html?.state.doc.toString()??"":Ae(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)?a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to):""}function ct(){const t=v.css?.state.doc.toString()??"";if(a.cssPane==="tree"){if(t===a.cssScopeSnapshot)return;const e=_e($o())[0]?.className||Zn(t);a.cssFull=bo(a.cssFull,t,e),a.cssScopeSnapshot=t}else a.cssPane==="full"&&(a.cssFull=t)}function gs(t,e){for(const o of e||[])if(!Z(t,o.className)||gs(t,o.children))return!0;return!1}function Jt(){let t=a.cssFull,e=[],o=!1;a.cssValues||!a.htmlScopePref||!a.htmlScopeActive?(a.cssPane="full",t=a.cssFull):(e=_e($o()),e.length?(a.cssPane="tree",t=yo(a.cssFull,e),gs(a.cssFull,e)&&(a.cssFull=bo(a.cssFull,t,e[0].className),o=!0)):(a.cssPane="empty",t="")),a.cssScopeSnapshot=t,Be("css",t),zt(),a.lastWin&&(oe(a.lastWin,!0),O(a.lastWin),o&&nt(a.lastWin))}function Co(t){const e=v.html;if(!e||!a.htmlFocus)return;a.htmlScopeActive||(a.htmlFull=e.state.doc.toString());const o=a.htmlFull.length,n=Math.max(0,Math.min(a.htmlFocus.from,o)),s=Math.max(n,Math.min(a.htmlFocus.to,o));if(s<=n)return;a.htmlFocus={from:n,to:s},a.htmlScopeActive=!0;const r=t==null?0:Math.max(0,Math.min(t-n,s-n));Le(a.htmlFull.slice(n,s),{anchor:r,head:r}),Jt(),e.focus()}function To(t=!0,e=null){const o=v.html;if(!o)return;ct(),Me(),a.htmlScopeActive=!1;const n=a.htmlFull||o.state.doc.toString(),s=e!=null?{anchor:Math.max(0,Math.min(e,n.length))}:t&&Ae(a.htmlFocus?.from,a.htmlFocus?.to,n.length)?{anchor:a.htmlFocus.from,head:a.htmlFocus.to}:null;a.htmlFull=n,Le(n,s),a.cssPane="full",a.cssScopeSnapshot=a.cssFull,Be("css",a.cssFull),zt()}function Fe(){a.htmlFocus=null,a.htmlScopeActive=!1,a.htmlFull="",a.cssFull="",a.cssPane="full",a.cssScopeSnapshot="",a.lastBracketNames=null,a.lastCssSelectorNames=null}let Ut=!1;function Lt(t){return!!t?.document.getElementById(Fn)}function Je(t,e){if(!(!t||fo(t,"html_tree")===!1)){if(!e){Lt(t)&&Ln(t);return}Lt(t)||(Ut=!0,Lr("html_tree").then(()=>{Lt(t)||Fr(t)}).catch(()=>{}).finally(()=>{Ut=!1,G(t)}))}}function G(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-html-scope]");if(!e)return;a.htmlScopePref=Yt(t);const o=fo(t,"html_tree")===!1?a.htmlScopePref:Lt(t)||Ut;e.setAttribute("aria-pressed",o?"true":"false"),e.title=m(t,o?"code_dock_html_scope_off":"code_dock_html_scope"),e.setAttribute("aria-label",e.title),e.innerHTML=xr,t.document.getElementById(u)?.toggleAttribute("data-sve-html-scoped",a.htmlScopeActive)}function sn(t,e){e._sveHtmlScopeBound||(e._sveHtmlScopeBound=!0,a.htmlScopePref=Yt(t),Wl(t,e),Je(t,a.htmlScopePref),e.querySelector("[data-sve-html-scope]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=Lt(t)||Ut;a.htmlScopePref=!n,K(t,je,a.htmlScopePref?"1":"0"),a.htmlScopePref?a.htmlFocus&&(ct(),Co()):a.htmlScopeActive&&To(),Je(t,a.htmlScopePref),G(t)}))}function Wl(t,e){e._sveTreeWatchBound||(e._sveTreeWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>{if(Ut||fo(t,"html_tree")===!1||!t.document.getElementById(u))return;const o=Lt(t);o!==Yt(t)&&(a.htmlScopePref=o,K(t,je,o?"1":"0"),o?a.htmlFocus&&(ct(),Co()):a.htmlScopeActive&&To(),G(t))}))}const ql=new Set(["pre","textarea","script","style"]),Vl=/^(<\/|\{\{\s*\/)/;function Ul(t){let e=0;for(const o of t.split(`
`)){if(!o.trim())continue;const n=o.length-o.trimStart().length;n>0&&(e===0||n<e)&&(e=n)}return" ".repeat(e===2||e===3?e:4)}function Kl(t){const e=String(t||"");if(!e.trim())return e;const o=[],n=l=>{for(const c of l||[])o.push(c),n(c.children)};n(na(e));const s=Ul(e),r=[];let i=0;for(const l of e.split(`
`)){const c=i,d=l.trim();if(i+=l.length+1,!d){r.push("");continue}const h=c+(l.length-l.trimStart().length),f=o.filter(y=>y.from<h&&h<y.to);if(f.some(y=>ql.has(y.tag))){r.push(l);continue}const p=f.length-(Vl.test(d)?1:0);r.push(s.repeat(Math.max(p,0))+d)}return r.join(`
`)}function vs(t,e){if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?t.length:o+2}if(t.startsWith("<!--",e)){const o=t.indexOf("-->",e+4);return o===-1?t.length:o+3}return e}function Qe(t,e){if(t[e]!=="<")return null;const o=t.indexOf(">",e+1);if(o===-1)return null;const n=t.slice(e,o+1),s=n.match(/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/);if(s)return{kind:"close",name:s[1].toLowerCase(),from:e,to:o+1};const r=n.match(/^<([A-Za-z][A-Za-z0-9:-]*)/);if(!r)return{kind:"other",from:e,to:o+1};const i=r[1].toLowerCase();return{kind:/\/\s*>$/.test(n)||["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"].includes(i)?"void":"open",name:i,from:e,to:o+1}}function rn(t,e,o){let n=1,s=o;for(;s<t.length;){const r=vs(t,s);if(r!==s){s=r;continue}if(t[s]!=="<"){s+=1;continue}const i=Qe(t,s);if(!i)break;if(i.kind==="open"&&i.name===e)n+=1;else if(i.kind==="close"&&i.name===e&&(n-=1,n===0))return i;s=i.to}return null}function Qt(){const t=v.html;if(!t)return null;const e=t.state.selection.main.head,o=t.state.doc.toString(),n=[];let s=0;for(;s<e;){const c=vs(o,s);if(c!==s){s=c;continue}if(o[s]!=="<"){s+=1;continue}const d=Qe(o,s);if(!d||d.from>=e)break;if(d.kind==="open")n.push(d);else if(d.kind==="close"){for(let h=n.length-1;h>=0;h-=1)if(n[h].name===d.name){n.splice(h);break}}s=d.to}const r=o.lastIndexOf("<",Math.max(0,e-1));if(r!==-1&&o.indexOf(">",r)>=e){const c=Qe(o,r);if(c?.kind==="open"||c?.kind==="void"){const d=c.kind==="void"?null:rn(o,c.name,c.to);return d?{name:c.name,open:c,close:d}:{name:c.name,open:c,close:null}}}const i=n[n.length-1];if(!i)return null;const l=rn(o,i.name,i.to);return{name:i.name,open:i,close:l}}function to(t){return kr.includes(t)}function V(){v.html?.focus(),a.lastWin&&(nt(a.lastWin),Ie(a.lastWin))}function vt(t,e,o){const n=[...e].sort((s,r)=>r.from-s.from||r.to-s.to);t.dispatch({changes:n,selection:o})}function It(t,e,o){const n=v.html;if(!n||n.state.readOnly)return;const s=n.state.selection.main.head,r=n.state.doc.lineAt(s),i=r.text.slice(0,s-r.from),l=r.text.trim()?lt(r.text):Pe(n,r)||lt(r.text);let c=t,d=0;if(i.trim()!=="")c=`
${l}${t}`,d=1+l.length;else if(!r.text.trim()){c=`${l}${t}`,d=l.length,n.dispatch({changes:{from:r.from,to:r.to,insert:c},selection:an(r.from+d+e,o)});return}n.dispatch({changes:{from:s,to:n.state.selection.main.to,insert:c},selection:an(s+d+e,o)})}function an(t,e){return e?{anchor:t,head:t+e}:{anchor:t}}const Gl=new Set(["section","article","header","footer","main","nav","aside"]);function ln(t){if(t!=="section")return`<${t}>`;const e=a.lastWin?.Statamic?.$config?.get?.("sveSectionTag");return typeof e=="string"&&e.trim()?`<${t} ${e.trim()}>`:`<${t}>`}function ys(){const t=v.html;if(!t||t.state.readOnly)return;const e=t.state.doc.toString(),o=(e.match(/^[ \t]*/)||[""])[0],n=Kl(e).split(`
`).map(s=>s&&o+s).join(`
`);n!==e&&(vt(t,[{from:0,to:e.length,insert:n}],{anchor:0}),V())}function bs(t){const e=v.html;if(!e||e.state.readOnly)return;const o=e.state.selection.main,n=e.state.doc.toString();if(!o.empty){const l=n.slice(o.from,o.to),c=l.match(new RegExp(`^<${t}(\\s[^>]*)?>([\\s\\S]*)</${t}>$`,"i"));if(c){vt(e,[{from:o.from,to:o.to,insert:c[2]}],{anchor:o.from,head:o.from+c[2].length}),V();return}const d=ln(t);let h=`${d}${l}</${t}>`,f=o.from+d.length;t==="ul"&&(h=`<ul>
  <li>${l}</li>
</ul>`,f=o.from+11),vt(e,[{from:o.from,to:o.to,insert:h}],{anchor:f,head:f+l.length}),V();return}const s=Qt();if(s?.open&&s.close){if(s.name===t){vt(e,[{from:s.close.from,to:s.close.to,insert:""},{from:s.open.from,to:s.open.to,insert:""}],{anchor:s.open.from}),V();return}if(to(s.name)&&to(t)){const l=n.slice(s.open.from,s.open.to).replace(new RegExp(`^<${s.name}`,"i"),`<${t}`);vt(e,[{from:s.close.from,to:s.close.to,insert:`</${t}>`},{from:s.open.from,to:s.open.to,insert:l}],{anchor:s.open.from+t.length+1}),V();return}}const i=(e.state.doc.lineAt(o.head).text.match(/^\s*/)||[""])[0];if(t==="ul"){const l=`<ul>
${i}  <li></li>
${i}</ul>`;It(l,`<ul>
${i}  <li>`.length)}else{const l=ln(t),c=`${l}</${t}>`;It(c,Gl.has(t)?l.length:c.length)}V()}function Ie(t){try{Xl(t)}catch{}}function Xl(t){const e=t?.document?.getElementById(u),n=Qt()?.name||"";if(e)for(const s of co){const r=e.querySelector(`[data-sve-html-tool="${s.id}"]`);if(!r)continue;(s.id==="heading"?to(n):n===s.tag)?r.setAttribute("data-active",""):r.removeAttribute("data-active")}}function cn(t,e,o){const n=t.document,s=Qt()?.name||"";w(n),e.setAttribute("data-open","");const r=n.createElement("div");r.id=$,n.body.appendChild(r),W(t,e,r),r._sveApp=q(ot,r,{kind:"choices",choices:o.map(i=>({value:i,label:i.toUpperCase(),active:s===i})),onPick:i=>{bs(i),w(n)}})}function Zl(t,e){const o=t.document;w(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=$,o.body.appendChild(n),W(t,e,n);const s=r=>{o.getElementById($)&&(n._sveApp?.unmount(),n._sveApp=q(ot,n,{kind:"choices",choices:r,onPick:i=>{i&&(It(i,i.length),V()),w(o)}}),W(t,e,n))};s([{value:"",label:m(t,"code_dock_loading")}]),t.fetch("/!/sve/components",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(r=>r.ok?r.json():{items:[]}).then(r=>{const i=Array.isArray(r.items)?r.items:[];s(i.length?i.map(l=>({value:l.tag,label:l.name})):[{value:"",label:m(t,"component_none")}])}).catch(()=>s([{value:"",label:m(t,"component_none")}]))}function Yl(t){const e=St(t),o=v.html,n=v.css;if(!e||o?.state.readOnly||n?.state.readOnly)return;const s=Qt();if(s?.open&&o){const r=o.state.doc.sliceString(s.open.from,s.open.to),i=Aa(r,e);i!==r&&o.dispatch({changes:{from:s.open.from,to:s.open.to,insert:i}})}ct(),Z(a.cssFull,e)||(a.cssFull=`${String(a.cssFull||"").trimEnd()}${a.cssFull?.trim()?`
`:""}.${e} {
}
`),Jt(),Ee(),zt(),a.lastWin&&(nt(a.lastWin),Ie(a.lastWin),O(a.lastWin))}function Jl(t,e){const o=t.document;if(e.hasAttribute("data-open")){w(o);return}w(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=$,o.body.appendChild(n),W(t,e,n),n._sveApp=q(So,n,{label:m(t,"code_dock_css_class_name"),placeholder:m(t,"code_dock_css_class_placeholder"),onAdd:s=>{Yl(s),w(o)}})}function Ql(t,e){const o=e.querySelector("[data-sve-css-add-class]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=xu,o.title=m(t,"code_dock_css_add_class"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),a.styleMode==="tw"){w(t.document),sa(t,o);return}Jl(t,o)}))}function Ao(){const t={html:"",css:"",js:""};Me(),ct();for(const e of at)e==="html"?t.html=a.htmlScopeActive?a.htmlFull:v.html?.state.doc.toString()??"":e==="css"?(t.css=a.lastWin?al(a.cssFull,pt(a.lastWin)):a.cssFull,t.css=Cl(t.css,t.html,du)):t[e]=v[e]?.state.doc.toString()??"";return t}function xs(){if(a.cssValues||!(a.htmlScopePref&&Ae(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)))return a.cssPane="full",a.cssScopeSnapshot=a.cssFull,a.cssFull;const t=_e(a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to));if(!t.length)return a.cssPane="empty",a.cssScopeSnapshot="","";a.cssPane="tree";const e=yo(a.cssFull,t);return a.cssScopeSnapshot=e,e}function te(t,e){a.applying=!0;try{a.lastWin&&(a.htmlScopePref=Yt(a.lastWin)),a.htmlFull=t.html??"",a.cssFull=t.css??"";for(const o of at){const n=v[o];let s=t[o]??"";try{s=o==="html"?ms():o==="css"?xs():s}catch{s=o==="html"?a.htmlFull||t.html||"":o==="css"?a.cssFull||t.css||"":s}if(!n)continue;const r=n.state.doc.toString(),i=[qt[o].reconfigure(be.readOnly.of(!!e)),Vt[o].reconfigure(N.editable.of(!e))];r!==s?n.dispatch({changes:{from:0,to:r.length,insert:s},effects:i}):n.dispatch({effects:i})}}finally{a.applying=!1}Ee(),zt(),ho("dock:html-changed"),a.lastWin&&(O(a.lastWin),Ie(a.lastWin),G(a.lastWin),se(a.lastWin))}function Mo(t,e){return t.html===e.html&&t.css===e.css&&t.js===e.js}function ks(t){return String(t||"").replace(/\/\*[\s\S]*?\*\//g,"").trim().replace(/\s*:\s*/g,": ").replace(/\s*;\s*/g,";").replace(/\s+/g," ").replace(/;+$/,";")}function Ss(t){const e=ks(t).match(/^([a-z-]+)\s*:/i);return e?e[1].toLowerCase():""}function ws(t){const e=ks(t),o=e.indexOf(":");return o===-1?"":e.slice(o+1).replace(/;$/,"").trim().toLowerCase()}function D(t){const e=String(t||"").trim().toLowerCase();return e==="start"||e==="flex-start"||e==="left"||e==="top"?"flex-start":e==="end"||e==="flex-end"||e==="right"||e==="bottom"?"flex-end":e==="row-reverse"?"row-reverse":e==="column-reverse"?"column-reverse":e}function Kt(t){const e=D(t);return e==="flex"||e==="inline-flex"}function Oe(){const t=v.css;if(!t)return null;const e=t.state.selection.main.head,o=t.state.doc.toString(),n=[],s=[];for(let i=0;i<o.length;i+=1){if(o[i]==="{"&&o[i+1]==="{"){const l=o.indexOf("}}",i+2);if(l===-1)break;i=l+1;continue}if(o[i]==="{")n.push(i);else if(o[i]==="}"){const l=n.pop();l!=null&&s.push({from:l+1,to:i,text:o.slice(l+1,i),open:l})}}let r=null;for(const i of s)e<i.open||e>i.to||(!r||i.to-i.open<r.to-r.open)&&(r=i);return r}function tc(t){const e=String(t||"");let o="",n=0;for(let s=0;s<e.length;s+=1){if(e[s]==="{"&&e[s+1]==="{"){const r=e.indexOf("}}",s+2);if(r===-1)break;n===0&&(o+=e.slice(s,r+2)),s=r+1;continue}if(e[s]==="{"){n+=1;continue}if(e[s]==="}"){n=Math.max(0,n-1);continue}n===0&&(o+=e[s])}return o}function dn(t){const e={};for(const o of tc(t).split(";")){const n=Ss(o);n&&(e[n]=ws(`${o};`))}return e}function ec(t,e,o){if(!e||e.from>=e.to)return null;let n=t.state.doc.lineAt(e.from),s=0;for(;n.from<=e.to;){const r=Math.max(n.from,e.from),i=Math.min(n.to,e.to),l=t.state.doc.sliceString(r,i);if(s===0&&Ss(l)===o)return{from:r,to:i,text:l};if(s+=oc(l),n.to>=t.state.doc.length||n.to>=e.to)break;n=t.state.doc.lineAt(n.to+1)}return null}function oc(t){let e=0;const o=String(t);for(let n=0;n<o.length;n+=1){if(o[n]==="{"&&o[n+1]==="{"){const s=o.indexOf("}}",n+2);n=s===-1?o.length:s+1;continue}o[n]==="{"?e+=1:o[n]==="}"&&(e-=1)}return e}function lt(t){return(String(t).match(/^\s*/)||[""])[0]}function Pe(t,e,o){for(let n=e.number-1;n>=1;n-=1){const s=t.state.doc.line(n),r=s.text.trim();if(!r)continue;const i=lt(s.text);if(o&&(r==="{"||r.endsWith("{")))return`${i}  `;if(!(r==="}"||r.startsWith("}")))return i}return""}function nc(t,e){const o=t.state.doc.lineAt(e);if(o.text.trim())return lt(o.text);const n=Pe(t,o,!0);if(n)return n;const s=Oe();return s?_s(t,s):"  "}function _s(t,e){const o=t.state.doc.lineAt(e.from),n=t.state.doc.lineAt(Math.max(e.from,e.to));for(let r=n.number;r>=o.number;r-=1){const i=t.state.doc.line(r),l=Math.max(i.from,e.from),c=Math.min(i.to,e.to),d=t.state.doc.sliceString(l,c);if(d.trim())return(d.match(/^\s*/)||[""])[0]||"  "}return`${(t.state.doc.lineAt(Math.max(0,e.from-1)).text.match(/^\s*/)||[""])[0]}  `}function un(){v.css?.focus(),a.lastWin&&(nt(a.lastWin),O(a.lastWin))}function $s(t,e){if(!e)return"";const o=t.state.doc.toString();let n=0;for(let s=e.open-1;s>=0;s-=1)if(o[s]==="}"||o[s]==="{"||o[s]===";"){n=s+1;break}return o.slice(n,e.open).replace(/\/\*[\s\S]*?\*\//g,"").trim()}function sc(t,e){if(!a.cssState||!e)return e;const o=Cs(t,e);if(o)return o;const n=$s(t,e);if(!n||n.startsWith("@"))return e;const s=t.state.doc.toString(),r=yt(s,e.open),i=yt(s,e.to)||`${r}    `,l=(t.state.doc.sliceString(e.from,e.to).match(/\n([^\S\n]*)$/)||[null,null])[1],c=l===null?e.to:e.to-l.length,d=`
${i}&${ze()} {
${i}}
${l??r}`;t.dispatch({changes:{from:c,to:e.to,insert:d}});const h=t.state.doc.toString(),f=h.indexOf("{",c+d.indexOf("&")),p=f===-1?-1:Ot(h,f);return p===-1?e:{from:f+1,to:p,text:h.slice(f+1,p),open:f}}function yt(t,e){const o=t.lastIndexOf(`
`,e-1)+1;return(t.slice(o,e).match(/^\s*/)||[""])[0]}function J(t){const e=v.css;if(!e||e.state.readOnly||!t.length)return;const o=Oe(),n=t.some(l=>l.value!=null)?sc(e,o):o;if(!n){const l=t.filter(c=>c.value!=null).map(c=>`${c.property}: ${c.value};`).join(`
`);l&&ic(l),un();return}const s=[],r=[],i=_s(e,n);for(const l of t){const c=ec(e,n,l.property);if(l.value==null){if(!c)continue;let d=c.from,h=c.to;e.state.doc.sliceString(h,h+1)===`
`&&(h+=1),d=Math.max(d,n.from),h=Math.min(h,n.to),s.push({from:d,to:h});continue}if(!(c&&D(ws(c.text))===D(l.value)))if(c){const d=(c.text.match(/^\s*/)||[""])[0];s.push({from:c.from,to:c.to,insert:`${d}${l.property}: ${l.value};`})}else r.push(`${i}${l.property}: ${l.value};`)}if(r.length){const l=!n.text.includes(`
`)||!/\n\s*$/.test(n.text)?`
`:"",c=(n.text.match(/\n([^\S\n]*)$/)||[null,null])[1],d=c===null?n.to:n.to-c.length,h=c===null?"":c;s.push({from:d,to:n.to,insert:`${l}${r.join(`
`)}
${h}`})}s.length&&(s.sort((l,c)=>c.from-l.from||c.to-l.to),e.dispatch({changes:s})),un()}function tt(){const t=v.css,e=Oe();if(!e)return{};if(a.cssState&&t){const o=Cs(t,e);return o?dn(o.text):{}}return dn(e.text)}function Cs(t,e){const o=$s(t,e),n=ze();if(!o||o.startsWith("@"))return null;if(o.endsWith(n))return e;const s=t.state.doc.toString(),r=i=>{const l=Ot(s,i);return l===-1?null:{from:i+1,to:l,text:s.slice(i+1,l),open:i}};for(const i of[`&${n}`,`${o}${n}`]){const l=new RegExp(`(^|[^\\w-])${i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\s*\\{`,"g");let c;for(;c=l.exec(s);){const d=s.indexOf("{",c.index);if(i.startsWith("&")&&(d<e.from||d>e.to))continue;const h=r(d);if(h)return h}}return null}function rc(t){const e=tt(),o=Kt(e.display),n=D(e["flex-direction"])||(o?"row":"");if(o&&n===t){const s=[];e["flex-direction"]&&s.push({property:"flex-direction",value:null}),Kt(e.display)&&s.push({property:"display",value:null}),J(s);return}J([{property:"display",value:"flex"},{property:"flex-direction",value:t}])}function ac(t){const e=tt();if(t==="flex"&&Kt(e.display)){J([{property:"justify-content",value:null},{property:"align-items",value:null},{property:"flex-direction",value:null},{property:"display",value:null}]);return}J([{property:"display",value:t}])}function ic(t){const e=v.css;if(!e||e.state.readOnly)return;const o=e.state.selection.main.head,n=e.state.doc.lineAt(o),s=n.text.slice(0,o-n.from),r=n.text.slice(o-n.from),i=nc(e,o),l=t.replace(/;?$/,";");if(s.trim()===""&&r.trim()===""){const d=`${i}${l}
${i}`;e.dispatch({changes:{from:n.from,to:n.to,insert:d},selection:{anchor:n.from+d.length}});return}const c=`
${i}${l}
${i}`;e.dispatch({changes:{from:o,to:e.state.selection.main.to,insert:c},selection:{anchor:o+c.length}})}function O(t){try{lc(t),ne(t)}catch{}}function lc(t){const e=a.styleMode==="tw",o=e?{}:tt(),n=Kt(e?Vo("display"):o.display),s=D(o["flex-direction"])||(n?"row":""),r=i=>e?ia()&&!!i.tw&&!!Vo(i.tw):!!i.css&&i.css in o;ut.tools=wr.map(i=>{const l=(i.kids||[]).filter(c=>c.when!=="flex"||n).map(c=>({id:c.id,title:c.title,icon:_n[c.icon]||"",sep:!!c.sep,open:a.cssOpenMenu===c.id,active:e?r(c):c.kind==="display"?n:c.kind==="flexDir"?n&&s===c.value:c.value?D(o[c.css])===D(c.value):r(c)}));return{id:i.id,title:i.title,icon:_n[i.id]||Su[i.id]||"",open:a.cssOpenTool===i.id||a.cssOpenMenu===i.id,kids:l,active:i.value?!e&&D(o[i.css])===D(i.value):r(i)||l.some(c=>c.active)}})}function w(t){const e=t?.getElementById($);a.cssOpenMenu="",e?._sveApp?.unmount(),e?.remove(),t?.querySelectorAll("[data-sve-css-tool][data-open], [data-sve-html-tool][data-open], [data-sve-css-add-class][data-open], [data-sve-code-history][data-open]").forEach(o=>o.removeAttribute("data-open"))}function Zu(t){w(t),bt(t),rt(t);for(const e of at)v[e]&&ar?.(v[e])}function Ts(t){if(a.cssColorsPromise)return a.cssColorsPromise;const e=t.Statamic?.$config?.get?.("cpUrl")||`/${t.Statamic?.$config?.get?.("cpRoute")||"cp"}`;return a.cssColorsPromise=t.fetch(`${e}/color-scheme/swatches`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async o=>{if(!o.ok)return[];const n=await o.json().catch(()=>[]);return Array.isArray(n)?n:[]}).catch(()=>[]).then(o=>{const n=new Set,s=[];for(const r of o){const i=r.var||r.value||r.handle,l=String(i||"").trim().replace(/^var\((.+)\)$/,"$1");!l||n.has(l)||(n.add(l),s.push({name:l,hex:r.hex||r.color||""}))}for(const[r,i]of Sr)n.has(r)||(n.add(r),s.push({name:r,hex:i}));return s}),a.cssColorsPromise}function As(t,e){const o=tt()[e]||"",n=String(o).match(/^var\(\s*([^)]+?)\s*\)$/i),s=n?n[1].trim():"";for(const r of t.querySelectorAll("[data-sve-css-token]"))s&&r.getAttribute("data-sve-css-token")===s?r.setAttribute("data-active",""):r.removeAttribute("data-active")}function W(t,e,o){const n=e.getBoundingClientRect(),s=8;o.style.left=`${Math.max(s,Math.min(n.left,t.innerWidth-220))}px`,o.style.top=`${Math.max(s,n.bottom+4)}px`}function cc(t,e,o){const n=t.document;w(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=$,n.body.appendChild(s),W(t,e,s);const r=i=>{s._sveApp?.unmount(),s._sveApp=q(ot,s,{kind:"colors",swatches:i,onClear:()=>{J([{property:o,value:null}]),w(n)},onPick:l=>{J([{property:o,value:`var(${l})`}]),w(n)}}),As(s,o)};r(Sr.map(([i,l])=>({name:i,hex:l}))),Ts(t).then(i=>{n.getElementById($)&&r(i.map(l=>({name:l.name,hex:l.hex})))})}function dc(t,e,o,n){const s=t.document;w(s),e.setAttribute("data-open","");const r=s.createElement("div"),i=tt()[o]||"";r.id=$,s.body.appendChild(r),W(t,e,r),r._sveApp=q(ot,r,{kind:"choices",choices:(n||[]).map(l=>({value:l,label:l,active:D(l)===D(i)})),onPick:l=>{const c=D(l)===D(tt()[o]||"");J([{property:o,value:c?null:l}]),w(s)}})}function fn(t,e,o,n=[]){const s=t.document;w(s),e.setAttribute("data-open",""),ra(t);const r=s.createElement("div");r.id=$,s.body.appendChild(r),W(t,e,r);const i=()=>{const l=[...n.map(d=>({value:d,label:d})),...aa(t,o).map(d=>({value:d.value,label:d.value}))],c=tt()[o]||"";r._sveApp?.unmount(),r._sveApp=q(ot,r,{kind:"choices",choices:l.map(d=>({...d,active:D(d.value)===D(c)})),onPick:d=>{J([{property:o,value:d||null}]),w(s)}})};i(),Ts(t).then(()=>{s.getElementById($)===r&&i()})}function uc(t,e,o){const n=t.document;w(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=$,n.body.appendChild(s),W(t,e,s),s._sveApp=q(ot,s,{kind:"choices",choices:ku.map(r=>({value:r,token:r,label:r})),onPick:r=>{J([{property:o,value:`var(${r})`}]),w(n)}}),As(s,o)}const hn=/\{\{#[\s\S]*?#\}\}|\{\{[\s\S]*?\}\}/g,pn=/<!--[\s\S]*?-->/g,mn=/<(\/?)([A-Za-z][A-Za-z0-9-]*)/g,Ms=/^\{\{\s*(?:\/|endif\b|endunless\b)/,fc=/^\{\{\s*(?:\/\s*(?:if|unless)\b|endif\b|endunless\b)/,hc=/^\{\{\s*\/\s*partial\b/;function Ve(t,e,o){return t.some(n=>e<n.to&&o>n.from)}function pc(t){const e=new Map;for(const o of la(t)){const n=o.kind==="loop"?"loop":"if";e.set(o.from,n);const s=t.lastIndexOf("{{",o.to-2);s>=o.openTo&&Ms.test(t.slice(s,o.to))&&e.set(s,n)}for(const o of In(t))e.set(o.from,"component");return e}function mc(t){const e=String(t||""),o=[],n=[];pn.lastIndex=0;let s;for(;s=pn.exec(e);)o.push({from:s.index,to:s.index+s[0].length});const r=pc(e),i=[];for(hn.lastIndex=0;s=hn.exec(e);){const l=s.index,c=l+s[0].length,d=s[0];if(Ve(o,l,c))continue;if(i.push({from:l,to:c}),d.startsWith("{{#")){n.push({from:l,to:c,cls:"comment"});continue}const h=Ms.test(d),f=r.get(l)||(h&&fc.test(d)?"if":"")||(h&&hc.test(d)?"component":"");n.push({from:l,to:c,cls:(f?`fam-${f}`:"antlers")+(h?"-close":"")})}for(mn.lastIndex=0;s=mn.exec(e);){const l=s.index+1+s[1].length,c=l+s[2].length;Ve(o,l,c)||Ve(i,l,c)||n.push({from:l,to:c,cls:`fam-${Ir(s[2])}`})}return n.sort((l,c)=>l.from-c.from),n}function gn(t,e,o){const n=new e.RangeSetBuilder;let s=0;for(const r of mc(t.doc.toString()))r.from<s||(n.add(r.from,r.to,o(r.cls)),s=r.to);return n.finish()}function gc(t){const e=new Map,o=r=>r==="comment"?"sve-cm-antlers-comment":r==="antlers"?"sve-cm-antlers":r==="antlers-close"?"sve-cm-antlers sve-cm-antlers-close":r.endsWith("-close")?`sve-cm-${r.slice(0,-6)} sve-cm-antlers-close`:`sve-cm-${r}`,n=r=>(e.has(r)||e.set(r,t.Decoration.mark({class:o(r)})),e.get(r));return{extensions:[t.StateField.define({create(r){return gn(r,t,n)},update(r,i){return i.docChanged?gn(i.state,t,n):r},provide:r=>t.EditorView.decorations.from(r)})]}}const B=uo({tag:"",emptyText:"",addLabel:"",dropTitle:"",chips:[],states:[],canEdit:!1,onAdd:null,onChip:null,onDrop:null}),vc={class:"sve-al"},yc={class:"sve-al-head"},bc={key:0,class:"sve-al-tag"},xc=["title","disabled"],kc={key:0,class:"sve-al-empty"},Sc={class:"sve-al-chips"},wc=["data-sve-al-chip","title","disabled","onClick"],_c={class:"sve-al-name"},$c={key:0,class:"sve-al-value"},Cc=["title","onClick"],Tc={__name:"AlpinePanel",setup(t){return(e,o)=>(b(),x("div",vc,[g("div",yc,[T(B).tag?(b(),x("span",bc,"<"+A(T(B).tag)+">",1)):j("",!0),(b(!0),x(P,null,U(T(B).states,n=>(b(),x("span",{key:n,class:"sve-al-state"},A(n),1))),128)),o[1]||(o[1]=g("span",{class:"sve-al-gap"},null,-1)),g("button",{type:"button","data-sve-al-add":"",title:T(B).addLabel,disabled:!T(B).canEdit,onClick:o[0]||(o[0]=F(n=>T(B).onAdd?.(n),["prevent","stop"]))},"+",8,xc)]),T(B).chips.length?j("",!0):(b(),x("div",kc,A(T(B).emptyText),1)),g("div",Sc,[(b(!0),x(P,null,U(T(B).chips,n=>(b(),x("span",{key:n.id,class:"sve-al-chip-wrap"},[g("button",{type:"button","data-sve-al-chip":n.id,title:n.title,disabled:!T(B).canEdit,onClick:F(s=>T(B).onChip?.(s,n.id),["prevent","stop"])},[g("span",_c,A(n.name),1),n.value?(b(),x("span",$c,A(n.value),1)):j("",!0)],8,wc),T(B).canEdit?(b(),x("button",{key:0,type:"button",class:"sve-al-drop",title:T(B).dropTitle,onClick:F(s=>T(B).onDrop?.(n.id),["prevent","stop"])},"−",8,Cc)):j("",!0)]))),128))])]))}},Ac=En(Tc,[["__scopeId","data-v-15add965"]]),Mc=[{id:"state",lang:"alpine_group_state"},{id:"act",lang:"alpine_group_act"},{id:"react",lang:"alpine_group_react"}],vn=[{id:"state",group:"state",label:"alpine_state",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: false }"}]},{id:"state_text",group:"state",label:"alpine_state_text",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: '|' }"}]},{id:"toggle",group:"act",label:"alpine_toggle",icon:"toggle",needsName:!0,attrs:[{name:"@click",value:":name = !:name"}]},{id:"open",group:"act",label:"alpine_open",icon:"open",needsName:!0,attrs:[{name:"@click",value:":name = true"}]},{id:"close",group:"act",label:"alpine_close",icon:"close",needsName:!0,attrs:[{name:"@click",value:":name = false"}]},{id:"open_hover",group:"act",label:"alpine_open_hover",icon:"open",needsName:!0,attrs:[{name:"@mouseenter",value:":name = true"}]},{id:"close_leave",group:"act",label:"alpine_close_leave",icon:"close",needsName:!0,attrs:[{name:"@mouseleave",value:":name = false"}]},{id:"open_focus",group:"act",label:"alpine_open_focus",icon:"open",needsName:!0,attrs:[{name:"@focusin",value:":name = true"}]},{id:"close_blur",group:"act",label:"alpine_close_blur",icon:"close",needsName:!0,attrs:[{name:"@focusout",value:":name = false"}]},{id:"close_outside",group:"act",label:"alpine_close_outside",icon:"outside",needsName:!0,attrs:[{name:"@click.outside",value:":name = false"}]},{id:"close_escape",group:"act",label:"alpine_close_escape",icon:"escape",needsName:!0,attrs:[{name:"@keydown.escape.window",value:":name = false"}]},{id:"show",group:"react",label:"alpine_show",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"}]},{id:"show_smooth",group:"react",label:"alpine_show_smooth",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"},{name:"x-transition",value:""}]},{id:"hide_until_ready",group:"react",label:"alpine_hide_until_ready",icon:"cloak",attrs:[{name:"x-cloak",value:""}]},{id:"class_when",group:"react",label:"alpine_class_when",icon:"klass",needsName:!0,attrs:[{name:":class",value:":name ? '|' : ''"}]},{id:"text",group:"react",label:"alpine_text",icon:"text",needsName:!0,attrs:[{name:"x-text",value:":name"}]}];function Ec(t){return(t?.attrs||[]).map(e=>e.name).join(" ")}const Bc=/^(x-[\w:.-]+|@[\w:.-]+|:[\w-]+)$/;function Lc(t){return Bc.test(String(t||""))}function ee(t){const e=String(t||""),o=[],n=/([@:a-zA-Z_][\w:.@-]*)(\s*=\s*(["'])([\s\S]*?)\3)?/g;let s,r=!0;for(;s=n.exec(e);){if(r){r=!1;continue}s[0].trim()&&o.push({name:s[1],value:s[4]??"",from:s.index,to:s.index+s[0].length,alpine:Lc(s[1])})}return o}function Es(t){const e=String(t||"").trim().replace(/^\{|\}$/g,""),o=[],n=/(^|,)\s*([a-zA-Z_$][\w$]*)\s*:/g;let s;for(;s=n.exec(e);)o.push(s[2]);return o}function Fc(t,e){return t.map(o=>({name:o.name,value:String(o.value).replaceAll(":name:",`${e}:`).replaceAll(":name",e)}))}function Eo(t,e,o){const n=v.html,s=$t();if(!n||n.state.readOnly||!s)return;const r=a.htmlScopeActive&&!!a.htmlFocus,i=r?a.htmlFocus.from:0,c=(r?a.htmlFull:n.state.doc.toString()).slice(s.from,s.openTo),d=o===""?e:`${e}="${o}"`,h=ee(c).find(p=>p.name===e);let f;if(h)f=c.slice(0,h.from)+d+c.slice(h.to);else{const p=c.search(/\s|\/?>$/);f=p===-1?c:`${c.slice(0,p)} ${d}${c.slice(p)}`}f!==c&&(vt(n,[{from:s.from-i,to:s.openTo-i,insert:f}],null),De(t))}function Ic(t,e){const o=v.html,n=$t();if(!o||o.state.readOnly||!n)return;const s=a.htmlScopeActive&&!!a.htmlFocus,r=s?a.htmlFocus.from:0,l=(s?a.htmlFull:o.state.doc.toString()).slice(n.from,n.openTo),c=ee(l).find(f=>f.name===e);if(!c)return;let d=c.from;for(;d>0&&/\s/.test(l[d-1]);)d-=1;const h=l.slice(0,d)+l.slice(c.to);vt(o,[{from:n.from-r,to:n.openTo-r,insert:h}],null),De(t)}function eo(t){const e=v.html;if(!e)return[];const n=a.htmlScopeActive&&!!a.htmlFocus?a.htmlFull:e.state.doc.toString(),s=$t(),r=[],i=Dn(Se(n),new Set);for(const l of i){if(!s||l.from>s.from||l.to<s.to)continue;const c=ee(n.slice(l.from,l.openTo)).find(d=>d.name==="x-data");c&&r.push(...Es(c.value))}return[...new Set(r)]}function Oc(t){const e=v.html,o=$t();if(!e||!o)return[];const s=a.htmlScopeActive&&!!a.htmlFocus?a.htmlFull:e.state.doc.toString(),r=ee(s.slice(o.from,o.openTo)).find(i=>i.name==="x-data");return r?Es(r.value):[]}function Pc(t,e){const o=t.document;w(o),e.setAttribute("data-open","");const n=eo(),s=o.createElement("div");s.id=$,o.body.appendChild(s),W(t,e,s);const r=!n.length,i=!r&&!Oc().length,c=Mc.filter(d=>d.id==="state"?!i:!r).flatMap(d=>{const h=vn.filter(f=>f.group===d.id);return h.length?[{value:`\0${d.id}`,label:m(t,r&&d.id==="state"?"alpine_group_state_first":d.lang),heading:!0},...h.map(f=>({value:f.id,label:m(t,f.label),hint:Ec(f)}))]:[]});r&&c.push({value:"\0note",label:m(t,"alpine_needs_state"),note:!0}),s._sveApp=q(ot,s,{kind:"choices",choices:c,onPick:d=>{const h=vn.find(f=>f.id===d);if(w(o),!!h){if(!h.needsName){for(const f of h.attrs)Eo(t,f.name,f.value);return}Dc(t,e,h,n)}}})}function Dc(t,e,o,n){const s=t.document,r=l=>{const c=String(l||"").trim().replace(/[^\w$]/g,"");if(w(s),!!c)for(const d of Fc(o.attrs,c))Eo(t,d.name,d.value.replace("|",""))};if(!n.length){oo(t,e,r);return}const i=s.createElement("div");i.id=$,s.body.appendChild(i),W(t,e,i),i._sveApp=q(ot,i,{kind:"choices",choices:[{value:"\0head",label:m(t,"alpine_name"),heading:!0},...n.map(l=>({value:l,label:l})),{value:"\0new",label:m(t,"alpine_new_name")}],onPick:l=>{if(l==="\0new"){oo(t,e,r);return}r(l)}})}function oo(t,e,o){const n=t.document;w(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=$,n.body.appendChild(s),W(t,e,s),s._sveApp=q(So,s,{label:m(t,"alpine_name"),placeholder:m(t,"alpine_name_placeholder"),onAdd:r=>o(r)})}function De(t){const o=t?.document.getElementById(u)?.querySelector("[data-sve-alpine-host]");if(!o)return;const n=$t(),s=v.html,r=a.htmlScopeActive&&!!a.htmlFocus,i=s?r?a.htmlFull:s.state.doc.toString():"",l=n?ee(i.slice(n.from,n.openTo)):[];B.tag=n?.tag||"",B.canEdit=!a.lastLocked&&!!n,B.emptyText=m(t,n?eo().length?"alpine_none_ready":"alpine_none":"alpine_pick"),B.addLabel=m(t,"alpine_add"),B.dropTitle=m(t,"alpine_remove"),B.states=eo(),B.chips=l.filter(c=>c.alpine).map(c=>({id:c.name,name:c.name,value:c.value,title:c.value?`${c.name}="${c.value}"`:c.name})),B.onAdd=c=>Pc(t,c.currentTarget),B.onDrop=c=>Ic(t,c),B.onChip=(c,d)=>{B.chips.find(f=>f.id===d)&&oo(t,c.currentTarget,f=>Eo(t,d,f))},o._sveMounted||(o._sveMounted=!0,_t(o,Ac))}const zc=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]),Hc=new Set(["html","head","body"]),yn=new Set(["if","unless","style_push","script_push","sve_defaults","once","noparse","foreach","forelse"]),Rc=new Set(["CloseTag","MismatchedCloseTag","IncompleteCloseTag"]),jc=/^\s*(\/?)\s*([A-Za-z_][A-Za-z0-9_.:-]*)([\s\S]*)$/,Nc=/^\{\{\s*\/?\s*([A-Za-z_][A-Za-z0-9_.:-]*)/,Wc=3e5;function qc(t){const e=String(t||""),o=[],n=[];let s=0;for(;s<e.length;){const r=e.indexOf("{{",s);if(r===-1)break;if(e.startsWith("{{#",r)){const d=e.indexOf("#}}",r+3);if(d===-1){n.push(r);break}o.push({from:r,to:d+3,comment:!0,body:""}),s=d+3;continue}let i=0,l=r,c=-1;for(;l<e.length;){if(e.startsWith("{{",l)){i+=1,l+=2;continue}if(e.startsWith("}}",l)){if(i-=1,l+=2,i===0){c=l;break}continue}l+=1}if(c===-1){n.push(r),s=r+2;continue}o.push({from:r,to:c,comment:!1,body:e.slice(r+2,c-2)}),s=c}return{tags:o,unclosed:n}}function Vc(t,e){let o=t;for(const n of e)o=o.slice(0,n.from)+" ".repeat(n.to-n.from)+o.slice(n.to);return o}function Uc(t,e){return t===e||t.startsWith(`${e}:`)}function ce(t,e){return(t.slice(e,e+80).match(/^<\/?([A-Za-z][A-Za-z0-9:-]*)/)?.[1]||"").toLowerCase()}function Kc(t,e,o,n){for(const i of o){const l=t.slice(i,i+80).match(Nc)?.[1]||"…";n.push({from:i,to:i+2,key:"code_dock_problem_antlers_unclosed",args:{name:l}})}const s=[],r=[];for(const i of e){if(i.comment)continue;const l=i.body.match(jc);if(!l)continue;const c=!!l[1],d=l[2].toLowerCase(),h=l[3];if(!c&&(d==="elseif"||d==="else")){let f=-1;for(let p=s.length-1;p>=0;p-=1)if(s[p].name==="if"||s[p].name==="unless"){f=p;break}if(f===-1){n.push({from:i.from,to:i.to,key:"code_dock_problem_branch_stray",args:{name:d}});continue}r.push({from:s[f].to,to:i.from}),s[f]={...s[f],to:i.to},s.length=f+1;continue}if(c||d==="endif"||d==="endunless"){const f=d==="endif"?"if":d==="endunless"?"unless":d;let p=-1;for(let y=s.length-1;y>=0;y-=1)if(Uc(s[y].name,f)){p=y;break}if(p===-1){n.push({from:i.from,to:i.to,key:"code_dock_problem_pair_stray",args:{name:f}});continue}for(const y of s.slice(p+1))yn.has(y.name)&&n.push({from:y.from,to:y.to,key:"code_dock_problem_pair_unclosed",args:{name:y.name}});(f==="if"||f==="unless")&&r.push({from:s[p].to,to:i.from}),s.length=p;continue}h.trim().startsWith("=")||s.push({name:d,from:i.from,to:i.to})}for(const i of s)yn.has(i.name)&&n.push({from:i.from,to:i.to,key:"code_dock_problem_pair_unclosed",args:{name:i.name}});return r}function Gc(t,e,o,n){const s=e.parse(t),r=new Set,i=[];s.iterate({enter(l){if(l.name==="MismatchedCloseTag"){i.push({from:l.from,to:l.to,key:"code_dock_problem_tag_stray",args:{tag:ce(t,l.from)}});return}if(l.name==="IncompleteCloseTag"){i.push({from:l.from,to:l.to,key:"code_dock_problem_tag_unfinished",args:{tag:ce(t,l.from)}});return}if(l.type.isError){const f=l.node.parent;f&&(f.name==="OpenTag"||f.name==="CloseTag")&&(r.add(f.from),i.push({from:f.from,to:Math.max(f.from+1,l.from),key:"code_dock_problem_tag_unfinished",args:{tag:ce(t,f.from)}}));return}if(l.name!=="Element")return;let c=null,d=!1;for(let f=l.node.firstChild;f;f=f.nextSibling)f.name==="OpenTag"&&(c=f),Rc.has(f.name)&&(d=!0);if(!c||d)return;const h=ce(t,c.from);!h||zc.has(h)||Hc.has(h)||o.some(f=>c.from>=f.from&&c.from<f.to&&l.to>f.to)||i.push({from:c.from,to:c.to,key:"code_dock_problem_tag_unclosed",args:{tag:h}})}});for(const l of i)l.key==="code_dock_problem_tag_unclosed"&&r.has(l.from)||l.args.tag&&n.push(l)}function Xc(t,e){const o=String(t||"");if(!o.trim()||o.length>Wc)return[];const n=[];try{const{tags:r,unclosed:i}=qc(o),l=Kc(o,r,i,n);e&&Gc(Vc(o,r),e,l,n)}catch{return[]}const s=new Set;return n.sort((r,i)=>r.from-i.from||r.to-i.to).filter(r=>{const i=`${r.from}:${r.key}`;return s.has(i)?!1:(s.add(i),!0)})}function Zc(t,e){const o=t.Decoration.mark({class:"sve-cm-problem"}),n=r=>{const i=Xc(r.doc.toString(),e),l=new t.RangeSetBuilder;let c=0;for(const d of i)d.from<c||d.to<=d.from||(l.add(d.from,d.to,o),c=d.to);return{problems:i,decorations:l.finish()}},s=t.StateField.define({create(r){return n(r)},update(r,i){return i.docChanged?n(i.state):r},provide:r=>t.EditorView.decorations.from(r,i=>i.decorations)});return{field:s,extensions:[s]}}function Bs(t){return t.document.getElementById(u)?.querySelector("[data-sve-html-problems]")||null}function Yc(t,e,o){const n=Bs(t);if(!n)return;const s=e.state.doc,r=o.map(c=>({from:c.from,line:s.lineAt(Math.min(c.from,s.length)).number,text:m(t,c.key,c.args)})),i=r.map(c=>`${c.line}:${c.text}`).join(`
`);if(n.dataset.sveSignature===i||(n.dataset.sveSignature=i,n.hidden=r.length===0,n.replaceChildren(),!r.length))return;const l=t.document.createElement("span");l.setAttribute("data-sve-problems-title",""),l.textContent=m(t,"code_dock_problems_title"),n.appendChild(l);for(const c of r){const d=t.document.createElement("button"),h=t.document.createElement("b");d.type="button",d.dataset.sveProblemAt=String(c.from),h.textContent=m(t,"code_dock_problem_line",{line:c.line}),d.append(h,t.document.createTextNode(` ${c.text}`)),n.appendChild(d)}}function Jc(t){const e=Bs(t);!e||e._sveBound||(e._sveBound=!0,e.addEventListener("mousedown",o=>o.preventDefault()),e.addEventListener("click",o=>{const n=o.target.closest("[data-sve-problem-at]"),s=v.html;if(!n||!s)return;o.preventDefault(),o.stopPropagation();const r=Math.min(Number(n.dataset.sveProblemAt)||0,s.state.doc.length);s.dispatch({selection:{anchor:r},effects:N.scrollIntoView(r,{y:"center"})}),s.focus()}))}function Qc(t){if(!a.htmlLintUi){const{field:e}=Zc({Decoration:Mt,StateField:Tt,RangeSetBuilder:At,EditorView:N},Ho.parser),o=N.updateListener.of(n=>{n.docChanged&&Yc(t,n.view,n.state.field(e).problems)});a.htmlLintUi={extensions:[e,o]}}return Jc(t),a.htmlLintUi}function td(){if(a.cssGhostUi)return a.cssGhostUi;const t=Mt.mark({class:"sve-css-ghost"}),e=o=>{const n=new At;if(!a.lastWin)return n.finish();try{for(const s of il(o.doc.toString(),pt(a.lastWin)))n.add(s.from,s.to,t)}catch{}return n.finish()};return a.cssGhostUi=Tt.define({create:o=>e(o),update:(o,n)=>n.docChanged?e(n.state):o,provide:o=>N.decorations.from(o)}),a.cssGhostUi}let de=null,ye=null;function ed(){if(de)return de;ye=Re.define();const t=Mt.line({class:"sve-css-id"}),e=o=>{const n=new At;if(!a.lastWin||!a.cssValues)return n.finish();try{const s=o.doc;for(const r of me(s.toString(),pt(a.lastWin),a.cssSize)){const i=s.lineAt(Math.min(r.from,s.length)).number,l=s.lineAt(Math.min(Math.max(r.to-1,r.from),s.length)).number;for(let c=i;c<=l;c+=1)n.add(s.line(c).from,s.line(c).from,t)}}catch{}return n.finish()};return de=Tt.define({create:o=>e(o),update:(o,n)=>n.docChanged||n.effects.some(s=>s.is(ye))?e(n.state):o,provide:o=>N.decorations.from(o)}),de}function Bo(){ye&&v.css&&v.css.dispatch({effects:ye.of(null)})}function od(){return a.htmlPartialUi||(a.htmlPartialUi=ua({Decoration:Mt,StateField:Tt,StateEffect:Re,RangeSetBuilder:At,EditorView:N})),a.htmlPartialUi}function nd(){return a.htmlAntlersUi||(a.htmlAntlersUi=gc({Decoration:Mt,StateField:Tt,RangeSetBuilder:At,EditorView:N})),a.htmlAntlersUi}function sd(){return a.htmlClassTokenUi||(a.htmlClassTokenUi=Ra({Decoration:Mt,StateField:Tt,StateEffect:Re,RangeSetBuilder:At,EditorView:N})),a.htmlClassTokenUi}function rd(t,e,o){v[e]?.destroy();const n=ao.of([{key:"Mod-s",run:()=>(Y(t.document),!0)}]);v[e]=new N({state:be.create({doc:"",extensions:[Zs(),Ys(),Js(),or(),Ud(e),sr(),nr({tooltipClass:()=>"sve-tw-complete"}),...e==="html"?[Ho.data.of({autocomplete:ca(t)}),da(lr,t)]:[],...e==="html"?[...ka(),Sa()]:[],...e==="css"?[fr(),td(),ed()]:[],ao.of([...Qs,...e==="html"?[{key:"Tab",run:wa}]:[],tr,...er,...ir,...rr]),n,N.lineWrapping,...e==="html"||e==="css"?od().extensions:[],...e==="html"?nd().extensions:[],...e==="html"?Qc(t).extensions:[],...e==="html"?sd().extensions:[],qt[e].of(be.readOnly.of(!!a.lastLocked)),Vt[e].of(N.editable.of(!a.lastLocked)),N.updateListener.of(s=>{e==="html"&&s.docChanged&&!a.applying&&(Hl(),ho("dock:html-changed")),e==="css"&&s.docChanged&&!a.applying&&Rl(),s.docChanged&&nt(t),e==="css"&&(s.docChanged||s.selectionSet)&&O(t),e==="css"&&s.docChanged&&!a.applying&&oe(t),e==="html"&&(s.docChanged||s.selectionSet)&&(Ie(t),De(t),a.applying||se(t))}),...Qr(C,{height:"auto",background:"#1E1E21",scroller:{overflow:"visible",height:"auto",minHeight:0},extraTags:s=>[{tag:s.tagName,color:"#4ec9b0"},{tag:s.attributeName,color:"#9cdcfe"},{tag:s.attributeValue,color:"#ce9178"},{tag:s.angleBracket,color:"#808080"}]})]}),parent:o})}function ad(t){if(!t||t.querySelector(".cm-editor"))return;t.replaceChildren();const e=t.ownerDocument.createElement("span");e.style.cssText="width:16px;height:16px;margin:12px;border:2px solid #858585;border-right-color:transparent;border-radius:50%;display:block;animation:sve-cm-wait .6s linear infinite",t.appendChild(e)}function pt(t){return po(t).map(e=>({handle:e.handle,base:e.base,max:e.max,media:e.media,media_px:e.media_px,label:e.label}))}function Ls(t,e){return pt(t).find(o=>o.handle===e)||null}function ze(t=a.cssState){return t?t==="before"||t==="after"?`::${t}`:`:${t}`:""}function oe(t,e=!1){const o=v.css;if(!o||!io||!lo)return;const n=o.state.doc.toString(),s=`${a.cssValues?"1":"0"}|${a.cssSize}|${Te(n).map(h=>`${h.from}-${h.to}`).join(",")}`;if(!e&&s===a.cssFoldSig)return;a.cssFoldSig=s;const r=pt(t),i=new Map,l=[...rl(n,r,a.cssSize),...a.cssValues?[]:me(n,r,a.cssSize).map(h=>({from:h.from,to:h.to}))];for(const h of l)h.to>h.from&&i.set(`${h.from}:${h.to}`,{from:h.from,to:h.to});const c=[],d=new Set;hr(o.state).between(0,n.length,(h,f)=>{const p=`${h}:${f}`;d.add(p),!i.has(p)&&a.cssOwnFolds.has(p)&&c.push(lo.of({from:h,to:f}))});for(const[h,f]of i)d.has(h)||c.push(io.of(f));a.cssOwnFolds=new Set(i.keys()),c.length&&o.dispatch({effects:c})}function no(t,e){const o=a.cssFull||e;return/max-width/i.test(o)&&!/width\s*</i.test(o)&&t.media_px||t.media}function id(t,e){const o=v.css;if(!o||o.state.readOnly)return;const n=pt(t),s=Ls(t,e),r=o.state.doc.toString();if(!s||s.base){const h=o.state.selection.main.head,f=Te(r).find(p=>h>=p.from&&h<=p.to);f&&o.dispatch({selection:{anchor:f.from},scrollIntoView:!0});return}const i=ko(r,n,e);if(i.length){const h=i[0],f=Math.min(h.bodyTo,h.bodyFrom+(r.slice(h.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);o.dispatch({selection:{anchor:f},scrollIntoView:!0});return}const l=no(s,r),c=Fs(o,r),d=`

${c.indent}@media ${l} {
${c.indent}    
${c.indent}}${c.suffix}`;o.dispatch({changes:{from:c.at,to:c.at,insert:d},selection:{anchor:c.at+d.lastIndexOf("    ")+4},scrollIntoView:!0})}function Fs(t,e){const o=Te(e);if(o.length){const i=o[o.length-1];return{at:i.to,indent:yt(e,i.from),suffix:""}}const n=i=>({at:i.to,indent:yt(e,i.to)||`${yt(e,i.open)}    `,suffix:`
${yt(e,i.open)}`}),s=Oe();if(s)return n(s);const r=ld(e);return r?n(r):{at:e.length,indent:"",suffix:""}}function ld(t){const e=String(t||"");let o=null,n=0,s=0;for(;n<e.length;){if(e[n]==="}"||e[n]===";"){n+=1,s=n;continue}if(e[n]!=="{"){n+=1;continue}const r=Ot(e,n);if(r===-1||o||(o=e.slice(s,n).trim().startsWith("@")?null:{from:s,open:n,to:r},!o))return null;n=r+1,s=n}return o}function cd(t,e){const o=e===a.cssSize?"":e;a.cssSize=o,K(t,Io,o),xt("lp:set-device",{win:t,key:o?Or(o,t):"Responsive"}),o&&id(t,o),a.cssValues&&Os(t),oe(t,!0),Bo(),ne(t),O(t)}function dd(t,e){a.cssState=Oo.includes(e)?e:"",K(t,so,a.cssState),w(t.document),ne(t),O(t)}function ud(t,e){const o=t.document;w(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=$,o.body.appendChild(n),W(t,e,n),n._sveApp=q(ot,n,{kind:"choices",choices:[{value:"",label:m(t,"css_state_none"),active:!a.cssState},...Oo.map(s=>({value:s,label:ze(s),active:s===a.cssState}))],onPick:s=>dd(t,s)})}function ne(t){const o=t?.document.getElementById(u)?.querySelector("[data-sve-css-head]");if(!o)return;const n=$t(),s=pt(t),r=v.css?.state.doc.toString()??"";L.tag=n?.tag||"",L.scope=Ta(n?Dt().slice(n.from,n.openTo):"")||"",L.canEdit=!a.lastLocked,L.onTag=i=>fa(t,i.currentTarget,n),L.state=a.cssState,L.stateLabel=a.cssState?ze(a.cssState):m(t,"css_state"),L.onState=i=>ud(t,i.currentTarget),L.onSize=i=>cd(t,i),L.sizes=[{key:"",label:m(t,"tw_size_all"),title:m(t,"css_size_all_title"),active:!a.cssSize},...s.map(i=>{const l=i.base||ko(r,s,i.handle).length>0;return{key:i.handle,label:i.label,title:i.base?m(t,"css_size_base_title"):`@media ${i.media}${l?"":`  ·  ${m(t,"css_size_new")}`}`,active:a.cssSize===i.handle}})],o._sveMounted||(o._sveMounted=!0,_t(o,ml))}ke("lp:device",t=>{const e=a.lastWin;if(!e||!zs(e.document))return;const o=po(e).find(n=>n.device===t)?.handle||"";o!==a.cssSize&&(a.cssSize=o,K(e,Io,o),oe(e,!0),Bo(),ne(e),O(e))});function fd(t){const e=Math.max(0,Math.round(Date.now()/1e3-t)),o=new Date(t*1e3).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});let n=o;try{const s=new Intl.RelativeTimeFormat(void 0,{numeric:"auto"});e<90?n=s.format(-e,"second"):e<5400?n=s.format(-Math.round(e/60),"minute"):e<86400?n=s.format(-Math.round(e/3600),"hour"):n=s.format(-Math.round(e/86400),"day")}catch{}return`${n} · ${o}`}function Is(t,e){return t.fetch(e,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}})}async function hd(t,e){const o=t.document,n=Ct();if(w(o),!n)return;let s=[];try{const i=await Is(t,`/!/sve/section-template/history?type=${encodeURIComponent(n)}`);i.ok&&(s=(await i.json())?.entries||[])}catch{s=[]}if(!o.getElementById(u)||!o.contains(e))return;e.setAttribute("data-open","");const r=o.createElement("div");r.id=$,o.body.appendChild(r),W(t,e,r),r._sveApp=q(ot,r,{kind:"choices",choices:s.length?s.map(i=>({value:i.id,label:fd(i.at)})):[{value:"",label:m(t,"code_dock_history_empty")}],onPick:i=>{w(o),i&&pd(t,n,i)}})}async function pd(t,e,o){if(ht())return;let n=null;try{const s=await Is(t,`/!/sve/section-template/history/entry?type=${encodeURIComponent(e)}&id=${encodeURIComponent(o)}`);s.ok&&(n=await s.json())}catch{n=null}!n||ht()||(te({html:n.html??"",css:n.css??"",js:n.js??""},a.lastLocked),nt(t),se(t))}function Gt(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-code-strip]");if(!e)return;e.hidden=a.styleMode!=="tw";const o=zn(t);e.innerHTML=wu,e.title=m(t,o?"tw_strip_on":"tw_strip_off"),e.setAttribute("aria-label",e.title),e.setAttribute("aria-pressed",o?"true":"false")}function md(t,e){const o=e.querySelector("[data-sve-code-strip]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),ha(t,!zn(t)),Gt(t),pa(t)}),Gt(t))}function gd(t,e){const o=e.querySelector("[data-sve-code-history]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=_u,o.title=m(t,"code_dock_history"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),o.hasAttribute("data-open")){w(t.document);return}hd(t,o)}))}function Yu(){return a.styleMode}function vd(t){return a.styleMode==="tw"?$t():null}function $t(t){const e=v.html;if(!e)return null;const o=a.htmlScopeActive&&!!a.htmlFocus,n=o?a.htmlFull:e.state.doc.toString(),r=(o?a.htmlFocus.from:0)+e.state.selection.main.from,i=Dn(Se(n),new Set);let l=null;for(const c of i)c.from<=r&&r<c.to&&(l=c);return l}function se(t){a.styleMode==="tw"&&ma(t,vd())}function Lo(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-values-mode]");if(!e||!o)return;e.setAttribute("data-sve-values",a.cssValues?"on":"off");const n=t.document.createElement("span");n.textContent=m(t,"code_dock_values"),o.innerHTML=Cu,o.appendChild(n),o.title=m(t,a.cssValues?"code_dock_values_off":"code_dock_values_on"),o.setAttribute("aria-label",o.title),o.setAttribute("aria-pressed",a.cssValues?"true":"false")}function Os(t){const e=v.css;if(!e||e.state.readOnly)return;const o=pt(t),n=e.state.doc.toString(),s=me(n,o,a.cssSize);if(e.focus(),s.length){const p=s[0],y=Math.min(p.bodyTo,p.bodyFrom+(n.slice(p.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);e.dispatch({selection:{anchor:y},scrollIntoView:!0});return}const r=Ls(t,a.cssSize);if(!r||r.base){const p=`#id-{{ id }} {
    `;e.dispatch({changes:{from:0,to:0,insert:`${p}
}

`},selection:{anchor:p.length},scrollIntoView:!0});return}const i=ko(n,o,a.cssSize)[0];if(i){const p=`${yt(n,i.from)}    `,y=`
${p}#id-{{ id }} {
${p}    `;e.dispatch({changes:{from:i.bodyFrom,to:i.bodyFrom,insert:`${y}
${p}}
`},selection:{anchor:i.bodyFrom+y.length},scrollIntoView:!0});return}const l=Fs(e,n),c=`${l.indent}    `,d=me(n,o,"").some(p=>l.at>p.bodyFrom&&l.at<=p.bodyTo),h=d?`

${l.indent}@media ${no(r,n)} {
${c}`:`

${l.indent}@media ${no(r,n)} {
${c}#id-{{ id }} {
${c}    `,f=d?`
${l.indent}}${l.suffix}`:`
${c}}
${l.indent}}${l.suffix}`;e.dispatch({changes:{from:l.at,to:l.at,insert:`${h}${f}`},selection:{anchor:l.at+h.length},scrollIntoView:!0})}function yd(t,e){a.cssValues=!!e,K(t,Ro,a.cssValues?"1":"0"),w(t.document),a.cssOpenTool="",Lo(t),ct(),Jt(),a.cssValues&&Os(t),oe(t,!0),Bo(),ne(t),O(t)}function Fo(t){const e=t?.document.getElementById(u);if(!e)return;const o=a.styleMode==="tw";e.setAttribute("data-sve-style",a.styleMode);const n=e.querySelector("[data-sve-css-label]");n&&(n.textContent=o?m(t,"code_dock_style_tw"):m(t,"code_dock_css"));const s=e.querySelector("[data-sve-style-mode]");if(!s)return;const r=t.document.createElement("span");r.textContent=o?m(t,"code_dock_style_tw"):m(t,"code_dock_css"),s.innerHTML=o?Tu:$u,s.appendChild(r),s.title=m(t,o?"code_dock_style_to_css":"code_dock_style_to_tw"),s.setAttribute("aria-label",s.title),s.setAttribute("aria-pressed",o?"true":"false")}function Ps(t){t?.document.getElementById(u),w(t.document),Ye(t),a.cssOpenTool="",a.cssOpenMenu="",a.styleMode==="tw"&&a.cssValues&&(a.cssValues=!1,K(t,Ro,"0")),Fo(t),Lo(t),Gt(t),a.cssToolRow?.(),a.styleMode==="tw"&&(a.htmlScopePref=!0,K(t,je,"1"),Je(t,!0)),se(t),De(t),O(t)}const Io="sve-css-size",so="sve-css-state",Oo=["hover","focus","focus-visible","active","disabled","before","after"];function bd(t,e){a.styleMode=e==="tw"?"tw":"css",K(t,yr,a.styleMode),Ps(t)}function xd(t,e){if(e._sveStyleModeBound)return;e._sveStyleModeBound=!0,a.styleMode=Q(t,yr)==="tw"?"tw":"css";const o=Q(t,Io)||"";a.cssSize=po(t).some(n=>n.handle===o)?o:"",a.cssState=Oo.includes(Q(t,so))?Q(t,so):"",a.cssValues=Q(t,Ro)==="1",e.querySelector("[data-sve-style-mode]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),bd(t,a.styleMode==="tw"?"css":"tw")}),e.querySelector("[data-sve-values-mode]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),yd(t,!a.cssValues)}),Ps(t),Lo(t)}function kd(t,e){const o=e.querySelector("[data-sve-css-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=r=>e.querySelector(`[data-sve-css-tool="${r}"], [data-sve-css-kid="${r}"]`),s=r=>{const i=n(r.id),l=a.cssOpenMenu===r.id;if(w(t.document),l){Ye(t),O(t);return}if(!i)return;const c=a.styleMode==="tw"?!r.twClass&&!!r.tw:!r.kind&&!r.value&&!(r.css in tt())&&!!r.menu,d=()=>{c&&(a.cssOpenMenu=r.id)};if(a.styleMode==="tw"){Ye(t),r.twClass?(ga(t,r.twClass),O(t)):r.tw&&(va(t,i,r.tw,()=>O(t)),d(),O(t));return}if(r.kind==="flexDir"){rc(r.value);return}if(r.kind==="display"){ac(r.value);return}if(r.value){const h=D(tt()[r.css])===D(r.value);J([{property:r.css,value:h?null:r.value}]);return}if(r.css in tt()){J([{property:r.css,value:null}]),O(t);return}r.menu==="colors"?cc(t,i,r.css):r.menu==="spacing"?uc(t,i,r.css):r.menu==="sizes"?fn(t,i,r.css,Lu):r.menu==="choices"?dc(t,i,r.css,r.choices):r.menu==="values"&&fn(t,i,r.css),d(),O(t)};ut.onTool=r=>{const i=xe.get(r)?.tool;if(i){if(i.kids?.length){a.cssOpenTool=a.cssOpenTool===i.id?"":i.id,w(t.document),O(t);return}s(i)}},ut.onKid=(r,i)=>{const l=xe.get(i);l?.kid&&s(l.kid)},a.cssToolRow=()=>{_t(o,el),O(t)},a.cssToolRow(),t.document.addEventListener("mousedown",r=>{r.target.closest(`#${$}, [data-sve-css-tools], [data-sve-html-tools], [data-sve-css-add-class]`)||w(t.document)},!0)}function Sd(t,e){const o=e.querySelector("[data-sve-html-tidy]");o&&(o.innerHTML=Hn.tidy,o.title=m(t,"code_dock_html_tidy"),o.setAttribute("aria-label",o.title),o.setAttribute("data-tip",o.title))}function wd(t,e){const o=e.querySelector("[data-sve-html-tidy]");Sd(t,e),!(!o||o._sveBound)&&(o._sveBound=!0,o.addEventListener("mousedown",n=>n.preventDefault()),o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),ys()}))}function _d(t,e){const o=e.querySelector("[data-sve-html-tools]");!o||o._sveBound||(o._sveBound=!0,_t(o,Xi,{tools:co.map(n=>({...n,icon:Hn[n.id]||""})),onTool:n=>{const s=co.find(i=>i.id===n),r=o.querySelector(`[data-sve-html-tool="${n}"]`);if(s){if(s.menu==="heading"){cn(t,r,kr);return}if(s.menu==="text"){cn(t,r,Pr);return}if(s.tidy){ys();return}if(s.menu==="component"){Zl(t,r);return}if(w(t.document),s.snippet){It(s.snippet,s.caret??s.snippet.length,s.select),V();return}bs(s.tag)}}}),jd(t,e),Wd(t,e),Rd(t,e))}E("dock:save-now",()=>(Y(a.lastWin?.document),!0));let ue=null;async function $d(t){const e=t.document;Jd(e);let o=e.getElementById(u);if(o&&!(o.querySelector('[data-sve-css-chrome="subrow-2"]')&&o.querySelector("[data-sve-css-add-class]")&&o.querySelector("[data-sve-html-tools]")&&o.querySelector("[data-sve-html-tidy]")&&o.querySelector("[data-sve-data-vars]")&&o.querySelector("[data-sve-visual-edit-tools]")&&o.querySelector("[data-sve-html-scope]")&&o.querySelector("[data-sve-code-lock]")&&o.querySelector("[data-sve-code-back]")&&o.querySelector("[data-sve-code-autosave]")&&o.querySelector("[data-sve-code-save]")&&o.getAttribute("data-sve-code-chrome")==="scope-9")){for(const s of at)v[s]?.destroy(),v[s]=null;o.remove(),o=null}if(!o){o=e.createElement("div"),o.id=u,o.setAttribute("data-sve-code-chrome","scope-9"),Vr(o,Ur(t)),_t(o,ji,{htmlLabel:m(t,"code_dock_html"),cssLabel:m(t,"code_dock_css"),jsLabel:m(t,"code_dock_js"),alpineLabel:m(t,"code_dock_alpine"),treeIcon:xr,dataIcon:vu,dataLabel:m(t,"data_vars_title")}),Ze(e,o),kn(o),Us(o,Ns(t)),ru(t,o),iu(t,o),au(t,o),kd(t,o),Ql(t,o),xd(t,o),gd(t,o),md(t,o),Kr(t,o),_d(t,o),sn(t,o),on(t,o),Sn(t,o),nn(t,o);for(const n of at){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);ad(s)}Gr(t)}if(Ze(e,o),kn(o),wd(t,o),sn(t,o),on(t,o),Sn(t,o),nn(t,o),ou(t),Po(t),Ft(t),G(t),Zt(t),it(t),Fo(t),Gt(t),await cu(),!v.html){for(const n of at){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);s?.replaceChildren(),rd(t,n,s)}for(const n of["html","css"])v[n]&&ya(t,v[n],{onOpen:s=>us(t,s),emptyLabel:m(t,"code_dock_partials_empty"),openLabel:s=>m(t,"component_open_named",{name:s}),sectionValues:()=>ds(t),isLocked:()=>ht(),setHover:(s,r)=>a.htmlPartialUi?.setHover(s,r)});Wa(t,v.html,{onRename:n=>Nl(t,n),isLocked:()=>ht(),setHover:(n,s)=>a.htmlClassTokenUi?.setHover(n,s),title:m(t,"code_dock_css_rename_class")})}return o}function Ds(t){return ue||(ue=$d(t).finally(()=>{ue=null})),ue}async function bn(t,e){const o=await Ds(t);a.lastType=e,a.lastLocked=!0,a.lockReady=!0,a.lastParts={html:"",css:"",js:""},Fe(),Ft(t),te(a.lastParts,!0),Xs(t.document,e),R(t.document,m(t,"code_dock_missing")),G(t),Zt(t),it(t),Xt(t,o)}async function He(t,e,o="replace"){o==="replace"?a.typeStack=[]:o==="push"&&a.lastType&&a.lastType!==e&&a.typeStack.push(a.lastType);const n=++a.loadGen;a.lastType=e,a.lockReady=!1,Fe(),R(t.document,m(t,"code_dock_loading"));let s=()=>{};a.loadInFlight=new Promise(i=>{s=i});const r=await Ds(t);Ft(t),G(t),Zt(t),it(t),Fo(t),Gt(t),Xt(t,r),t.fetch(`/!/sve/section-template?type=${encodeURIComponent(e)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async i=>{if(n!==a.loadGen)return;if(i.status===404){bn(t,e);return}if(!i.ok)throw new Error(String(i.status));const l=await i.json();n===a.loadGen&&(a.lastParts={html:typeof l.html=="string"?l.html:"",css:typeof l.css=="string"?l.css:"",js:typeof l.js=="string"?l.js:""},a.lastProps=Array.isArray(l.props)?l.props:[],a.propsDirty=!1,a.lastType=e,a.lastLocked=!!l.locked,a.lockReady=!0,Pl(),typeof l.tw=="string"&&l.tw!==""&&Dl(a.lastParts.html,l.tw),Ft(t),te(a.lastParts,a.lastLocked),Rn(t),a.lastLocked||is(t,a.lastParts.html),Xs(t.document,l.path||e),R(t.document,a.lastLocked?m(t,"code_dock_locked"):""),l.writable?.template===!1?R(t.document,m(t,"code_dock_not_writable")):l.writable?.tw===!1&&R(t.document,m(t,"code_dock_tw_not_writable")),ss(t),Ui(t),xo(t),G(t),Zt(t),it(t),Xt(t,r))}).catch(()=>{n===a.loadGen&&(bn(t,e),R(t.document,m(t,"code_dock_error")))}).finally(()=>{n===a.loadGen&&(a.loadInFlight=null),s()})}function Ct(){return a.lastType||""}function zs(t){return!!t?.getElementById(u)}function ht(){return a.lastLocked}function Cd(t,e){const o=typeof e?.html=="string"?e.html.trim():"",n=typeof e?.css=="string"?e.css.trim():"",s=typeof e?.js=="string"?e.js.trim():"";if(!o&&!n&&!s||!t?.document?.getElementById(u))return!1;let r=!1;return o&&(r=Td("html",o)||r),n&&(r=xn("css",n)||r),s&&(r=xn("js",s)||r),r&&nt(t),r}function Td(t,e){const o=v[t];if(!o||o.state.readOnly)return!1;const n=o.state.selection.main,s=n.from>0?o.state.doc.sliceString(n.from-1,n.from):`
`,r=n.to<o.state.doc.length?o.state.doc.sliceString(n.to,n.to+1):`
`,c=`${s===`
`?"":`
`}${e}${r===`
`?"":`
`}`;return o.dispatch({changes:{from:n.from,to:n.to,insert:c},selection:{anchor:n.from+c.length}}),!0}function xn(t,e){const o=v[t];if(!o||o.state.readOnly)return!1;const n=o.state.doc.length,r=`${n>0&&o.state.doc.sliceString(Math.max(0,n-1),n)!==`
`?`

`:n?`
`:""}${e}
`;return o.dispatch({changes:{from:n,insert:r},selection:{anchor:n+r.length}}),!0}function Ad(t){if(ve(t),!a.lastType||!t.document.getElementById(u))return;const e=a.lastType;a.lastType=null,He(t,e,"keep")}function Hs(t){bt(t),a.loadGen+=1,Y(t),a.lastUid=null,a.lastType=null,a.typeStack=[],a.lastParts={html:"",css:"",js:""},a.lastLocked=!1,a.lockReady=!1,a.lastBracketNames=null,a.lastCssSelectorNames=null,Fe(),a.lastWin=t?.defaultView||a.lastWin,w(t),Pn(t),rt(t),t?.getElementById(X)?.remove();for(const o of at)v[o]?.destroy(),v[o]=null;t?.getElementById(u)?.remove(),eu(),t&&Do(t,0);const e=t?.defaultView||a.lastWin;e?.document.getElementById(Fn)&&Ln(e),e&&(ss(e),xo(e),Rn(e))}function Md(t){if(a.dragging)return;const e=t.document.getElementById(u);e&&(Po(t),Xt(t,e))}function Ed(t,e,o){if(o){const r=Wo(o,e)||Wo(o,t.document)||o;return String(typeof We=="function"&&(We(r,e)||We(r,t.document))||"").trim()}const n=typeof Xe=="function"?Xe(t):"page_sections",s=typeof et=="function"?et(t.document):[];for(const r of s){const l=(kt(r.values)||r.values)?.[n];if(Array.isArray(l))for(const c of l){const d=typeof c?.type=="string"?c.type.trim():"";if(d)return d}}return""}function Rs(t){if((t.Statamic?.$config?.get?.("sveFeatures")||{}).collection_templates!==!0)return"";const o=t.Statamic?.$config?.get?.("sveCollectionTemplatesCollection")||"templates";if(!(t.location?.pathname||"").includes(`/collections/${o}/entries/`))return"";const s=typeof et=="function"?et(t.document):[];for(const r of s){const i=kt(r.values)||r.values,l=typeof i?.view=="string"?i.view.trim():"";if(!l||l.includes(".."))continue;const c=l.replace(/\.(antlers\.html|blade\.php)$/i,"").replace(/^\/+|\/+$/g,"");if(c)return`view:${c}`}return""}function Bd(t,e){const o=Nr||Wr;if(o!=="header"&&o!=="footer"||!Hr(e)&&!Rr(e))return"";const s=(kt(jr()?.values)||{})[o==="footer"?"footer_style":"header_style"]||"style_1";return`${o}/${s}`}function Ld(t){const e=qr(t)||t.getElementById("__sve-global-section-host");return e&&e.querySelector("[data-replicator-set][data-type]")?.getAttribute("data-type")||""}function Ju(t,e,o){if(a.dragging)return;if(!t||!e||Kd(e)||!Dr(t)||!zr(t)){e&&Hs(e);return}const n=Bd(t,e)||Ld(e)||Ed(t,e,o)||Rs(t)||(o?"":a.lastType),s=!!(o&&o!==a.lastUid);if(a.lastWin=t,o&&(a.lastUid=o),!!n&&!(n===a.lastType&&e.getElementById(u))){if(a.typeStack.length&&a.lastType&&a.lastType!==n){const r=a.typeStack[0];if(n===r&&!s)return;a.typeStack=[]}Y(e),He(t,n,"replace")}}ke("tw:changed",()=>{a.lastWin&&a.styleMode==="tw"&&O(a.lastWin)});E("dock:is-open",t=>zs(t));E("dock:is-locked",()=>ht());E("dock:html",()=>Dt());E("dock:reveal-html",({from:t,to:e,caret:o}={})=>{const n=v.html;if(!n||t==null)return;a.htmlScopePref=Yt(a.lastWin),Me(),ct();const s=a.htmlFull.length,r=Math.max(0,Math.min(t,s)),i=Math.max(r,Math.min(e??t,s));a.htmlFocus=i>r?{from:r,to:i}:null;const l=o==null?null:Math.max(0,Math.min(o,s));if(a.htmlScopePref&&a.htmlFocus){Co(l),G(a.lastWin);return}if(a.htmlScopeActive){To(!0,l),G(a.lastWin);return}n.dispatch({selection:l==null?{anchor:r,head:i}:{anchor:l},scrollIntoView:!0}),n.focus()});E("dock:insert-snippet",({win:t,parts:e})=>Cd(t,e));E("dock:refresh",t=>Ad(t));E("dock:tw-follow",()=>{a.lastWin&&se(a.lastWin)});E("dock:css",()=>(ct(),a.cssFull));E("dock:set-css",t=>typeof t!="string"||ht()||!v.css||!a.lastWin?!1:(ct(),a.cssFull=t,Be("css",xs()),nt(a.lastWin),!0));E("dock:data-menu",({anchor:t,onPick:e,at:o}={})=>!t||!a.lastWin?!1:(bt(a.lastWin.document),w(a.lastWin.document),js(a.lastWin,t,e,o),!0));E("dock:props",()=>a.lastProps.map(t=>({...t})));E("dock:set-props",({win:t,props:e}={})=>!Array.isArray(e)||ht()?!1:(a.lastProps=e,a.propsDirty=!0,ba(re(Ct())),Y((t||a.lastWin)?.document),!0));function re(t){const e=/^view:partials\/(components\/[A-Za-z0-9_-]+)$/.exec(String(t||""));return e?e[1]:""}E("dock:component-src",()=>re(Ct()));E("dock:type-stack",()=>a.typeStack.map(t=>({type:t,src:re(t)})));E("dock:component-exit-state",()=>{const t=re(Ct());return{open:!!t,name:t?t.split("/").pop():"",back:a.typeStack.length>0}});E("dock:exit-component",(t=1)=>{if(!a.lastWin||!re(Ct()))return!1;if(a.typeStack.length){for(let e=Number(t)||1;e>1&&a.typeStack.length>1;e-=1)a.typeStack.pop();fs(a.lastWin)}else Hs(a.lastWin.document);return!0});E("dock:current-type",()=>Ct());E("dock:current-uid",()=>a.lastUid);E("dock:save-settled",()=>a.saveInFlight||null);E("dock:load-settled",()=>a.loadInFlight||null);E("dock:reset-data-vars",t=>(ui(typeof t=="string"&&t?t:void 0),!0));E("dock:refresh-preview",()=>a.lastWin?(ve(a.lastWin),!0):!1);E("dock:open-template",t=>typeof t!="string"||!t||!a.lastWin?!1:(us(a.lastWin,t),!0));E("dock:set-html",t=>{if(typeof t!="string"||ht())return!1;const e=v.html;if(!e||!a.lastWin)return!1;if(t===""){a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null),a.twDirty=!1,a.twCss=null,a.twKey="",a.lastType=null,a.lastUid=null,a.lastParts={html:"",css:"",js:""},a.cssFull="",a.htmlFull="",a.applying=!0;try{Fe();for(const s of at){const r=v[s];if(!r)continue;const i=r.state.doc.toString();i!==""&&r.dispatch({changes:{from:0,to:i.length,insert:""}})}}finally{a.applying=!1}return!0}const o=a.htmlFull;if(a.htmlFull=t,a.htmlScopeActive)return a.htmlFocus=Fd(a.htmlFocus,o,t),Le(ms()),nt(a.lastWin),ho("dock:html-changed"),!0;const n=e.state.doc.toString();if(n!==t){const[s,r,i]=cs(n,t);e.dispatch({changes:{from:s,to:r,insert:i}})}return!0});E("dock:show-empty",()=>xt("dock:set-html",""));ke("row:removed",({parentPath:t,remaining:e,win:o})=>{e===0&&t===Xe(o)&&xt("dock:show-empty")});function Fd(t,e,o){const n=o.length-e.length;if(!t||!n)return t;let s=0;for(;s<e.length&&s<o.length&&e[s]===o[s];)s+=1;return s>=t.to?t:s<t.from?{from:Math.max(0,t.from+n),to:Math.max(0,t.to+n)}:{from:t.from,to:Math.max(t.from,t.to+n)}}const I="__sve-data-menu";let ro=null;function bt(t){const e=t?.getElementById(I);ro?.(),ro=null,e?._sveApp?.unmount(),e?.remove(),t?.querySelector("[data-sve-data-vars][data-open]")?.removeAttribute("data-open")}function Id(t){if(!Rs(t))return{view:"",kind:""};const e=typeof et=="function"?et(t.document):[];for(const o of e){const n=kt(o.values)||o.values,s=typeof n?.source_collection=="string"?n.source_collection.trim():"";if(s)return{view:s,kind:String(n?.kind||"").trim()}}return{view:"",kind:""}}function Od(t,e){const o=Dt();if(Number.isFinite(e))return Uo(o,e);const n=v.html;if(!n)return[];const s=a.htmlScopeActive&&a.htmlFocus?a.htmlFocus.from:0;return Uo(o,s+n.state.selection.main.from)}function Pd(t,e){const{view:o,kind:n}=Id(t);return{collection:ai(t)||"",set:ii(Ct()),view:o,kind:n,scope:li(Od(t,e))}}function Dd(t){const e=typeof et=="function"?et(t.document):[];for(const o of e){const n=kt(o.values)||o.values;if(n&&typeof n=="object")return n}return null}function zd(t,e){return{scope:e?.scope?.groups||[],section:ts(e?.section||[],ds(t)),page:pi(e?.page||[],Dd(t)),site:e?.site||[]}}function Hd(t,e){const o=mi(t,e),n=v.html;if(!o||!n||n.state.readOnly)return;const s=n.state.selection.main,r=n.state.doc.lineAt(s.from),i=lt(r.text),l=mo(o.text,i);n.dispatch({changes:{from:s.from,to:s.to,insert:l},selection:{anchor:s.from+o.cursor+(o.text.includes(`
`)?i.length:0)}}),V()}function Ue(t,e,o){const n=e.getBoundingClientRect(),s=8,r=o.offsetWidth||368,i=o.offsetHeight||240,l=t.innerHeight-n.bottom-s,c=n.top-s,d=l>=i||l>=c?n.bottom+4:n.top-i-4;o.style.left=`${Math.max(s,Math.min(n.left,t.innerWidth-r-s))}px`,o.style.top=`${Math.max(s,Math.min(d,t.innerHeight-i-s))}px`}function js(t,e,o,n){const s=t.document;bt(s),e.setAttribute("data-open","");const r=s.createElement("div");r.id=I,s.body.appendChild(r);const i=Pd(t,n),l=p=>[p?.scope?.groups?.length?{id:"scope",label:p.scope.label||m(t,"data_vars_tab_loop")}:null,{id:"section",label:m(t,"data_vars_tab_section")},{id:"page",label:m(t,"data_vars_tab_page")},{id:"site",label:m(t,"data_vars_tab_site")}].filter(Boolean),c=p=>{s.getElementById(I)&&(r._sveApp?.unmount(),r._sveApp=q(ri,r,{title:m(t,"data_vars_title"),placeholder:m(t,"data_vars_placeholder"),emptyText:m(t,"data_vars_empty"),noSectionText:m(t,"data_vars_no_section"),loopText:m(t,"data_vars_loop"),tabs:l(p),data:zd(t,p),onPick:(y,k)=>o?o(y,k):Hd(y,k)}),Ue(t,e,r))};c(ci(Qn(i))||{scope:null,section:[],page:[],site:[]}),di(t,i).then(c),Ue(t,e,r);const d=()=>Ue(t,e,r),h=p=>{!r.contains(p.target)&&!e.contains(p.target)&&bt(s)},f=p=>{p.key==="Escape"&&bt(s)};s.addEventListener("pointerdown",h,!0),s.addEventListener("keydown",f,!0),t.addEventListener("scroll",d,!0),t.addEventListener("resize",d),ro=()=>{s.removeEventListener("pointerdown",h,!0),s.removeEventListener("keydown",f,!0),t.removeEventListener("scroll",d,!0),t.removeEventListener("resize",d)}}function Rd(t,e){const o=e.querySelector("[data-sve-data-vars]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("mousedown",n=>n.preventDefault()),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),t.document.getElementById(I)){bt(t.document);return}w(t.document),js(t,o)}))}function jd(t,e){const o=e.querySelector("[data-sve-antlers-tools]");!o||o._sveBound||(o._sveBound=!0,_t(o,Jn,{label:m(t,"code_dock_antlers"),groups:_a.map(n=>({id:n.id,label:m(t,n.lang),items:$a.filter(s=>s.group===n.id).map(s=>({id:s.id,label:s.label}))})),onPick:n=>Nd(n)}))}function Nd(t){const e=Ca(t),o=v.html;if(!e||!o||o.state.readOnly)return;const n=o.state.selection.main.head,s=o.state.doc.lineAt(n),r=s.text.trim()?lt(s.text):Pe(o,s)||lt(s.text),{text:i,cursor:l}=he(e.snippet);It(mo(i,r),l),V()}function Wd(t,e){const o=e.querySelector("[data-sve-visual-edit-tools]");!o||o._sveBound||(o._sveBound=!0,_t(o,Jn,{label:m(t,"code_dock_visual_edit"),groups:gi.map(n=>({id:n.id,label:m(t,n.lang),items:es.filter(s=>s.group===n.id).map(s=>({id:s.id,label:s.label}))})),onPick:n=>Vd(n)}))}function qd(t,e,o,n){if(bi(o.inner,n.attr)){t.focus();return}const{text:s,cursor:r}=he(n.attr);let i=o.closeIdx;for(;i>o.openIdx+2&&/\s/.test(e[i-1]);)i--;t.dispatch({changes:{from:i,to:o.closeIdx,insert:` ${s} `},selection:{anchor:i+1+r}}),V()}function Vd(t){const e=vi(t),o=v.html;if(!e||!o||o.state.readOnly)return;const n=o.state.doc.toString(),s=Qt();if(s?.open){const f=yi(n,s.open.from,s.open.to,le);if(f){e.attr?qd(o,n,f,e):(o.dispatch({selection:{anchor:f.openIdx+2+le.length}}),o.focus());return}const p=s.open.from+1+s.name.length,y=e.standalone||`{{ ${le} ${e.attr} }}`,{text:k,cursor:z}=he(y);o.dispatch({changes:{from:p,to:p,insert:` ${k}`},selection:{anchor:p+1+z}}),V();return}const r=o.state.selection.main.head,i=o.state.doc.lineAt(r),l=i.text.trim()?lt(i.text):Pe(o,i)||lt(i.text),c=e.standalone||`{{ ${le} ${e.attr} }}`,{text:d,cursor:h}=he(c);It(mo(d,l),h),V()}function Ud(t){return t==="css"?dr():t==="js"?ur():cr({autoCloseTags:!0})}function kn(t){if(t._sveShield)return;t._sveShield=!0;const e=o=>o.stopPropagation();for(const o of["keydown","keypress","keyup","pointerdown","pointerup","mousedown","mouseup","click","focusin"])t.addEventListener(o,e)}function Kd(t){try{return new URLSearchParams(t.defaultView?.location?.search||"").has("sve-panel")}catch{return!1}}function Gd(t){const e=parseInt(Q(t,pr)??"",10);return Number.isFinite(e)&&e>=br?e:fu}function Xd(t,e){K(t,pr,String(e))}function Ns(t){try{const e=JSON.parse(Q(t,mr)||"null");if(e&&typeof e=="object")return{html:e.html!==!1,css:e.css!==!1,js:e.js===!0,alpine:e.alpine===!0}}catch{}return{html:!0,css:!0,js:!1,alpine:!1}}function Zd(t,e){K(t,mr,JSON.stringify(e))}function Ws(t){try{const e=JSON.parse(Q(t,gr)||"null");if(e&&typeof e=="object"){const o=s=>Number.isFinite(s)&&s>0?s:1,n={};for(const s of wt)n[s]=o(e[s]);return n}}catch{}return Object.fromEntries(wt.map(e=>[e,1]))}function Yd(t,e){K(t,gr,JSON.stringify(e))}function Jd(t){Xr(t,uu,`
@keyframes sve-cm-wait { to { transform: rotate(360deg); } }
#${u} {
  /* The tree's seven families, for the marks and the toolbar below. */
  ${Zr("dark")}
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
#${X} {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,.5);
}
#${X} [data-sve-unlock-card] {
  width: min(420px, calc(100vw - 32px));
  padding: 20px;
  border-radius: 12px;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 16px 40px rgba(0,0,0,.45);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${X} [data-sve-unlock-title] {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
}
#${X} [data-sve-unlock-body] {
  font-size: 13px;
  line-height: 1.45;
  opacity: .75;
  margin-bottom: 18px;
}
#${X} [data-sve-unlock-actions] {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
#${X} [data-sve-unlock-actions] button {
  all: unset;
  cursor: pointer;
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}
#${X} [data-sve-unlock-cancel] {
  background: rgba(255,255,255,.1);
  color: #d4d4d4;
}
#${X} [data-sve-unlock-confirm] {
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
#${I} {
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
#${I} [data-sve-data-search] {
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
#${I} [data-sve-data-search]:focus-within {
  border-color: rgba(147,197,253,.7);
}
#${I} [data-sve-data-search] svg {
  flex: 0 0 auto;
  opacity: .5;
}
#${I} [data-sve-data-input] {
  all: unset;
  flex: 1 1 auto;
  min-width: 0;
  color: inherit;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.75rem;
}
#${I} [data-sve-data-tabs] {
  display: flex;
  gap: 0.2rem;
  margin-bottom: 0.45rem;
  padding: 0.15rem;
  border-radius: 0.45em;
  background: rgba(0,0,0,.28);
}
#${I} [data-sve-data-tab] {
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
#${I} [data-sve-data-tab]:hover { opacity: 1; }
#${I} [data-sve-data-tab][data-active] {
  opacity: 1;
  background: rgba(255,255,255,.14);
}
#${I} [data-sve-data-group] {
  padding: 0.6em 0.5em 0.25em;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  opacity: .45;
}
#${I} [data-sve-data-option] {
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
#${I} [data-sve-data-option]:hover,
#${I} [data-sve-data-option][data-cursor] {
  background: rgba(255,255,255,.1);
}
#${I} [data-sve-data-name] {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
#${I} [data-sve-data-parent] {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.625rem;
  opacity: .4;
}
#${I} [data-sve-data-value] {
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
#${I} [data-sve-data-loop] {
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
#${I} [data-sve-data-empty] {
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
#${ie} {
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
#${ie} [data-sve-partial-choice] {
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
#${ie} [data-sve-partial-choice]:hover {
  background: rgba(255,255,255,.1);
}
#${ie} [data-sve-partial-empty] {
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
`)}function Qd(t){const e=t.querySelector(".live-preview-editor");if(!e)return 0;const o=e.getBoundingClientRect();return o.width<40||o.right<40?0:Math.round(o.right)}function tu(t){let e=0;for(const o of["__sve-section-picker","__sve-outline-panel","__sve-html-tree-panel","__sve-listview-panel","__sve-right-dock","__sve-chrome-designs","__sve-global-section-panel","__sve-ai-panel"]){const n=t.getElementById(o);if(!n||n.hasAttribute("data-sve-chrome-hidden")||n.hasAttribute("data-sve-right-closed")||n.style.display==="none")continue;const s=n.getBoundingClientRect();s.width>40&&s.right>t.documentElement.clientWidth-8&&(e=Math.max(e,Math.round(s.width)))}return e}function Po(t){const e=t.document;if(a.layoutWin=t,typeof t.ResizeObserver!="function")return;a.layoutObserver||(a.layoutObserver=new t.ResizeObserver(()=>{a.layoutWin&&Md(a.layoutWin)}));const o=e.querySelector(".live-preview-editor"),n=e.getElementById("__sve-right-dock");o!==a.observedEditor&&(a.observedEditor&&a.layoutObserver.unobserve(a.observedEditor),a.observedEditor=o,o&&a.layoutObserver.observe(o)),n!==a.observedRight&&(a.observedRight&&a.layoutObserver.unobserve(a.observedRight),a.observedRight=n,n&&a.layoutObserver.observe(n))}function eu(){a.layoutObserver?.disconnect(),a.layoutObserver=null,a.layoutWin=null,a.observedEditor=null,a.observedRight=null}function ou(t){a.layoutWatchBound||(a.layoutWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>Po(t)))}function Do(t,e){const o=t.querySelector(".live-preview-contents");o&&(o.style.paddingBottom=e?`${e}px`:"")}function zo(t){if(!t)return;const e=t.clientHeight,o=t.querySelector("[data-sve-code-bar]"),n=t.querySelector("[data-sve-code-lock-banner]"),s=n&&nu(t)?.getComputedStyle(n).display!=="none"?n.offsetHeight:0,r=Math.max(64,e-(o?.offsetHeight||0)-s),i=t.querySelector("[data-sve-code-panes]");i&&(i.style.height=`${r}px`,i.style.minHeight="0",i.style.overflow="hidden"),t.querySelectorAll("[data-sve-code-host]").forEach(l=>{const c=l.closest("[data-sve-code-pane]");if(!c||c.style.display==="none")return;let d=0;for(const f of c.children)f!==l&&(d+=f.offsetHeight);const h=Math.max(64,r-d);l.style.height=`${h}px`,l.style.maxHeight=`${h}px`,l.style.minHeight="0",l.style.overflow="auto",su(l)})}function nu(t){return t.ownerDocument?.defaultView||a.lastWin}function su(t){t._sveWheelBound||(t._sveWheelBound=!0,t.addEventListener("wheel",e=>{const o=t.scrollHeight-t.clientHeight,n=t.scrollWidth-t.clientWidth;let s=!1;if(e.deltaY&&o>0){const r=Math.min(o,Math.max(0,t.scrollTop+e.deltaY));r!==t.scrollTop&&(t.scrollTop=r,s=!0)}if(e.deltaX&&n>0){const r=Math.min(n,Math.max(0,t.scrollLeft+e.deltaX));r!==t.scrollLeft&&(t.scrollLeft=r,s=!0)}s&&(e.preventDefault(),e.stopPropagation())},{passive:!1}))}function qs(){const t=(a.layoutWin||a.lastWin)?.document?.getElementById(u);t&&zo(t);for(const e of at)v[e]?.requestMeasure()}function Vs(t,e){const o=Ns(t),n={};for(const s of wt){const r=e.querySelector(`[data-sve-code-pane-btn="${s}"]`);n[s]=r?r.getAttribute("aria-pressed")==="true":o[s]}return n}function Us(t,e){for(const n of wt){const s=t.querySelector(`[data-sve-code-pane-btn="${n}"]`),r=t.querySelector(`[data-sve-code-pane="${n}"]`);s&&s.setAttribute("aria-pressed",e[n]?"true":"false"),r&&(r.style.display=e[n]?"flex":"none")}const o=wt.filter(n=>e[n]);t.querySelectorAll("[data-sve-code-split]").forEach(n=>{const s=n.getAttribute("data-sve-code-split-after"),r=o.indexOf(s);n.style.display=r>=0&&r<o.length-1?"block":"none"}),Ks(t.ownerDocument.defaultView,t),zo(t)}function Ks(t,e){const o=Ws(t);for(const n of wt){const s=e.querySelector(`[data-sve-code-pane="${n}"]`);s&&(s.style.flex=`${o[n]} 1 0`)}}function Xt(t,e){if(a.dragging)return;const o=t.document;Ze(o,e);const n=Gd(t),s=Qd(o),r=tu(o);e.style.left=`${s}px`,e.style.right=`${r}px`,e.style.bottom="0",e.style.height=`${n}px`,Do(o,n),zo(e)}function Gs(t,e,o,n){a.dragging=!0,Yr(t,e,o,()=>{a.dragging=!1,n?.()},"data-sve-code-drag-shield")}function ru(t,e){if(e._sveResizeBound)return;e._sveResizeBound=!0;const o=n=>{if(n.button!==0||n.target.closest('button, a, input, select, textarea, label, [role="button"], [contenteditable], .cm-editor'))return;n.preventDefault();const s=n.clientY,r=e.getBoundingClientRect().height;let i=r;Gs(t,"ns-resize",l=>{i=Math.min(Math.max(br,r+(s-l.clientY)),Math.round(t.innerHeight*.7)),e.style.height=`${i}px`,Do(t.document,i),qs()},()=>{Xd(t,i),Xt(t,e),t.dispatchEvent(new Event("resize"))})};e.querySelector("[data-sve-code-bar]")?.addEventListener("mousedown",o),e.querySelector("[data-sve-code-grip]")?.addEventListener("mousedown",o)}function au(t,e){e._sveSplitBound||(e._sveSplitBound=!0,e.querySelectorAll("[data-sve-code-split]").forEach(o=>{o.addEventListener("mousedown",n=>{if(n.button!==0)return;n.preventDefault(),n.stopPropagation();const s=o.getAttribute("data-sve-code-split-after"),r=wt.filter(z=>Vs(t,e)[z]),i=r.indexOf(s),l=r[i],c=r[i+1];if(!l||!c)return;const d=e.querySelector(`[data-sve-code-pane="${l}"]`),h=e.querySelector(`[data-sve-code-pane="${c}"]`),f=n.clientX,p=d.getBoundingClientRect().width,y=h.getBoundingClientRect().width,k=p+y;o.setAttribute("data-active",""),Gs(t,"col-resize",z=>{const mt=z.clientX-f;let Ht=Math.max(Ke,Math.min(k-Ke,p+mt)),ae=k-Ht;k<Ke*2&&(Ht=p,ae=y);const _=Ws(t);_[l]=Ht,_[c]=ae,Yd(t,_),Ks(t,e),qs()},()=>{o.removeAttribute("data-active")})})}))}function iu(t,e){e._svePaneBound||(e._svePaneBound=!0,e.querySelectorAll("[data-sve-code-pane-btn]").forEach(o=>{o.addEventListener("click",n=>{n.stopPropagation();const s=o.getAttribute("data-sve-code-pane-btn"),r=Vs(t,e),i={...r,[s]:!r[s]};!i.html&&!i.css&&!i.js&&(i[s]=!0),Zd(t,i),Us(e,i)})}))}function R(t,e){const o=t.getElementById(u)?.querySelector("[data-sve-code-status]");o&&(o.textContent=e||"")}function Xs(t,e){const o=t.getElementById(u)?.querySelector("[data-sve-code-path]");o&&(o.textContent=e||"",o.title=e||"")}function Zt(t){const e=t?.document?.getElementById(u)?.querySelector("[data-sve-code-back]");e&&(e.hidden=a.typeStack.length===0,e.title=m(t,"code_dock_back"),e.setAttribute("aria-label",e.title),e.innerHTML=gu)}function Sn(t,e){const o=e.querySelector("[data-sve-code-back]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),fs(t)}))}let N,ao,Zs,Ys,Js,gt,be,Tt,Re,At,Mt,Qs,tr,er,or,nr,sr,rr,ar,ir,lr,Ho,cr,dr,ur,fr,io,lo,hr,lu,Nt=null,C=null;function cu(){return Nt||(Nt=ta().then(t=>{C=t,N=C.view.EditorView,ao=C.view.keymap,Zs=C.view.lineNumbers,Ys=C.view.highlightActiveLine,Js=C.view.highlightActiveLineGutter,gt=C.state.Compartment,be=C.state.EditorState,Tt=C.state.StateField,Re=C.state.StateEffect,At=C.state.RangeSetBuilder,Mt=C.view.Decoration,Qs=C.commands.defaultKeymap,tr=C.commands.indentWithTab,er=C.commands.historyKeymap,or=C.commands.history,nr=C.autocomplete.autocompletion,sr=C.autocomplete.closeBrackets,rr=C.autocomplete.closeBracketsKeymap,ar=C.autocomplete.closeCompletion,ir=C.autocomplete.completionKeymap,lr=C.view.hoverTooltip,Ho=C.langHtml.htmlLanguage,cr=C.langHtml.html,dr=C.langCss.css,ur=C.langJs.javascript,C.language.HighlightStyle,C.language.syntaxHighlighting,fr=C.language.codeFolding,io=C.language.foldEffect,lo=C.language.unfoldEffect,hr=C.language.foldedRanges,lu=C.highlight.tags,qt.html=new gt,qt.css=new gt,qt.js=new gt,Vt.html=new gt,Vt.css=new gt,Vt.js=new gt}).catch(t=>{throw Nt=null,t}),Nt)}const du="{{ _class }}",u=Jr,uu="__sve-code-dock-style",X="__sve-code-dock-unlock",pr="sve-code-dock-height",mr="sve-code-dock-panes",gr="sve-code-dock-widths",je="sve-html-scope-v2",vr="sve-code-dock-autosave",yr="sve-code-dock-style-mode",Ro="sve-code-dock-values",fu=280,br=120,Ke=140,hu=250,at=["html","css","js"],wt=["html","css","alpine","js"],pu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',mu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-1"/></svg>',gu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',xr='<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1c0 .966.784 1.75 1.75 1.75h.418A1.74 1.74 0 0 0 4 7.25v1.5c0 .49.201.932.525 1.25c-.324.318-.525.76-.525 1.25v1c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 14 12.25v-1c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1.5c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1A1.75 1.75 0 0 0 12.25 2zm8.5 7.5H8v-3h4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75M7 6.5v3H5.75A.75.75 0 0 1 5 8.75v-1.5a.75.75 0 0 1 .75-.75zm1 4h4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75H8zm-1 0V13H5.75a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-1-5V3h6.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75zm-1 0H3.75A.75.75 0 0 1 3 4.75v-1A.75.75 0 0 1 3.75 3H5z"/></svg>',vu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/><path d="M4.5 11.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/></svg>',yu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 16.3A8.5 8.5 0 1 1 18.3 6.3"/><path d="M21 3.2v5.4h-5.4"/></svg>',bu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',xu='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',$="__sve-css-menu",kr=["h1","h2","h3","h4","h5","h6"],co=[{id:"section",title:"section",tag:"section"},{id:"div",title:"div",tag:"div"},{id:"heading",title:"heading",menu:"heading"},{id:"text",title:"text",menu:"text"},{id:"a",title:"link",tag:"a"},{id:"img",title:"image",snippet:'<img src="" alt="">',caret:10},{id:"svg",title:"svg",tag:"svg"},{id:"ul",title:"list",tag:"ul"},{id:"li",title:"list item",tag:"li"},{id:"component",title:"component",menu:"component"},{id:"loop",title:"loop",snippet:`{{ items }}

{{ /items }}
`,caret:3,select:5},{id:"if",title:"if",snippet:`{{ if true }}

{{ /if }}
`,caret:6,select:4}],ku=["--size-100","--size-200","--size-300","--size-400","--size-500","--size-600","--size-700","--size-800","--size-900","--gutter"],Su={"tw-text":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 13 5 3l3.5 10M2.7 10h4.6"/><path d="M12.5 3.5v9M11 5l1.5-1.5L14 5M11 11l1.5 1.5L14 11"/></svg>',"tw-leading":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h8.5M6 8h8.5M6 12.5h8.5"/><path d="M2.5 4.5v7M1.4 5.6 2.5 4.5l1.1 1.1M1.4 10.4l1.1 1.1 1.1-1.1"/></svg>',"tw-font":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.2V3h10v1.2M8 3v10M6 13h4"/></svg>',"tw-radius":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 13.5v-6a5 5 0 0 1 5-5h6"/><path d="M13.5 6.5v7h-7" stroke-dasharray="2 2"/></svg>',"tw-gap":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"tw-align":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3.5h12M2 8h8M2 12.5h10"/></svg>',"tw-w":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3.5v9M14 3.5v9"/><path d="M4.5 8h7"/><path d="M6 6.2 4.2 8 6 9.8M10 6.2 11.8 8 10 9.8"/></svg>',"tw-h":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 2h9M3.5 14h9"/><path d="M8 4.5v7"/><path d="M6.2 6 8 4.2 9.8 6M6.2 10 8 11.8 9.8 10"/></svg>',"tw-maxw":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3v10M14.5 3v10"/><path d="M5 8h6"/><path d="M6.6 6.2 4.8 8l1.8 1.8M9.4 6.2 11.2 8l-1.8 1.8"/></svg>',"tw-overflow":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="1.8" y="4.5" width="8.6" height="9.7" rx="1.2"/><path d="M6.5 1.8h7.7v7.7" stroke-linecap="round"/></svg>',"tw-border":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6"/><rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" stroke-width="1" opacity=".45"/></svg>'},wu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="10" width="18" height="11" rx="2"/><rect x="6" y="3" width="9" height="4" rx="1.4" fill="currentColor" stroke="none"/></svg>',_u='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.1 12a8.9 8.9 0 1 0 2.8-6.5L3 8"/><path d="M3 3.4V8h4.6"/><path d="M12 7.4V12l3 1.8"/></svg>',$u='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>',Cu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></svg>',Tu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/><path d="M3 17c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/></svg>',Sr=[["--gray-50","#fafafa"],["--gray-100","#f5f5f5"],["--gray-200","#e5e5e5"],["--gray-300","#d4d4d4"],["--gray-400","#a3a3a3"],["--gray-500","#737373"],["--gray-600","#525252"],["--gray-700","#404040"],["--gray-800","#262626"],["--gray-900","#171717"],["--gray-950","#0a0a0a"]],wn=t=>[{id:`${t}-all`,icon:"box-all",title:"All sides",css:t,tw:t},{id:`${t}-block`,icon:"box-block",title:"Top and bottom",css:`${t}-block`,tw:`${t}-block`,sep:!0},{id:`${t}-block-start`,icon:"box-block-start",title:"Top",css:`${t}-block-start`,tw:`${t}-top`},{id:`${t}-block-end`,icon:"box-block-end",title:"Bottom",css:`${t}-block-end`,tw:`${t}-bottom`},{id:`${t}-inline`,icon:"box-inline",title:"Left and right",css:`${t}-inline`,tw:`${t}-inline`,sep:!0},{id:`${t}-inline-start`,icon:"box-inline-start",title:"Left",css:`${t}-inline-start`,tw:`${t}-left`},{id:`${t}-inline-end`,icon:"box-inline-end",title:"Right",css:`${t}-inline-end`,tw:`${t}-right`}],Au=[{id:"display-flex",twClass:"flex",icon:"display-flex",title:"Flex",kind:"display",value:"flex",css:"display"},{id:"flex-row",twClass:"flex-row",icon:"flex-row",title:"Direction: row",kind:"flexDir",value:"row",css:"flex-direction",sep:!0},{id:"flex-col",twClass:"flex-col",icon:"flex-col",title:"Direction: column",kind:"flexDir",value:"column",css:"flex-direction"},{id:"justify-start",twClass:"justify-start",icon:"justify-start",title:"Justify: start",css:"justify-content",value:"flex-start",when:"flex",sep:!0},{id:"justify-center",twClass:"justify-center",icon:"justify-center",title:"Justify: center",css:"justify-content",value:"center",when:"flex"},{id:"justify-end",twClass:"justify-end",icon:"justify-end",title:"Justify: end",css:"justify-content",value:"flex-end",when:"flex"},{id:"justify-between",twClass:"justify-between",icon:"justify-between",title:"Justify: between",css:"justify-content",value:"space-between",when:"flex"},{id:"justify-around",twClass:"justify-around",icon:"justify-around",title:"Justify: around",css:"justify-content",value:"space-around",when:"flex"},{id:"align-start",twClass:"items-start",icon:"align-start",title:"Align: start",css:"align-items",value:"flex-start",when:"flex",sep:!0},{id:"align-center",twClass:"items-center",icon:"align-center",title:"Align: center",css:"align-items",value:"center",when:"flex"},{id:"align-end",twClass:"items-end",icon:"align-end",title:"Align: end",css:"align-items",value:"flex-end",when:"flex"},{id:"align-stretch",twClass:"items-stretch",icon:"align-stretch",title:"Align: stretch",css:"align-items",value:"stretch",when:"flex"}],Mu=[{id:"gap-all",icon:"gap-all",title:"Both",css:"gap",tw:"gap",menu:"spacing"},{id:"gap-row",icon:"gap-row",title:"Between rows",css:"row-gap",tw:"row-gap",menu:"spacing",sep:!0},{id:"gap-col",icon:"gap-col",title:"Between columns",css:"column-gap",tw:"column-gap",menu:"spacing"}],Eu=[{id:"bd-all",icon:"bd-all",title:"All sides",css:"border-color",tw:"border-color",menu:"colors"},{id:"bd-block",icon:"bd-block",title:"Top and bottom",css:"border-block-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-top",icon:"bd-top",title:"Top",css:"border-block-start-color",tw:"border-top-color",menu:"colors"},{id:"bd-bottom",icon:"bd-bottom",title:"Bottom",css:"border-block-end-color",tw:"border-bottom-color",menu:"colors"},{id:"bd-inline",icon:"bd-inline",title:"Left and right",css:"border-inline-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-left",icon:"bd-left",title:"Left",css:"border-inline-start-color",tw:"border-left-color",menu:"colors"},{id:"bd-right",icon:"bd-right",title:"Right",css:"border-inline-end-color",tw:"border-right-color",menu:"colors"}],Bu=[{id:"rd-all",icon:"rd-all",title:"All corners",css:"border-radius",tw:"border-radius",menu:"values"},{id:"rd-tl",icon:"rd-tl",title:"Top left",css:"border-start-start-radius",tw:"border-top-left-radius",menu:"values",sep:!0},{id:"rd-tr",icon:"rd-tr",title:"Top right",css:"border-start-end-radius",tw:"border-top-right-radius",menu:"values"},{id:"rd-br",icon:"rd-br",title:"Bottom right",css:"border-end-end-radius",tw:"border-bottom-right-radius",menu:"values"},{id:"rd-bl",icon:"rd-bl",title:"Bottom left",css:"border-end-start-radius",tw:"border-bottom-left-radius",menu:"values"}],wr=[{id:"display",title:"Display",css:"display",tw:"display",kids:Au},{id:"absolute",title:"Position",css:"position",tw:"position",value:"absolute"},{id:"color",title:"Text color",css:"color",tw:"color",menu:"colors"},{id:"bg",title:"Background color",css:"background-color",tw:"background-color",menu:"colors"},{id:"padding",title:"Padding",css:"padding",tw:"padding",kids:wn("padding")},{id:"margin",title:"Margin",css:"margin",tw:"margin",kids:wn("margin")},{id:"tw-text",title:"Font size",css:"font-size",tw:"font-size",menu:"values"},{id:"tw-leading",title:"Line height",css:"line-height",tw:"line-height",menu:"values"},{id:"tw-font",title:"Font family",css:"font-family",tw:"font-family",menu:"values"},{id:"tw-align",title:"Text align",css:"text-align",tw:"text-align",menu:"choices",choices:["left","center","right","justify"]},{id:"tw-border",title:"Border color",css:"border-color",tw:"border-color",kids:Eu},{id:"tw-radius",title:"Radius",css:"border-radius",tw:"border-radius",kids:Bu},{id:"tw-gap",title:"Gap",css:"gap",tw:"gap",kids:Mu},{id:"tw-w",title:"Width",css:"width",tw:"width",menu:"sizes"},{id:"tw-h",title:"Height",css:"height",tw:"height",menu:"sizes"},{id:"tw-maxw",title:"Max width",css:"max-width",tw:"max-width",menu:"sizes"},{id:"tw-overflow",title:"Overflow",css:"overflow",tw:"overflow",menu:"choices",choices:["visible","hidden","clip","auto","scroll"]}],Lu=["100%","auto","fit-content","min-content","max-content","100vw","100dvh","0"],xe=new Map;for(const t of wr){xe.set(t.id,{tool:t,kid:null});for(const e of t.kids||[])xe.set(e.id,{tool:t,kid:e})}const _n={display:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2.5" width="13" height="11" rx="1.2"/><path d="M5 6.5h6M5 9.5h4"/></svg>',"display-flex":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="3.4" height="9" rx=".4"/><rect x="6.3" y="3.5" width="3.4" height="9" rx=".4"/><rect x="10.6" y="3.5" width="3.4" height="9" rx=".4"/></svg>',"flex-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12"/><path d="M4.2 5.8 2 8l2.2 2.2"/><path d="M11.8 5.8 14 8l-2.2 2.2"/></svg>',"flex-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v12"/><path d="M5.8 4.2 8 2l2.2 2.2"/><path d="M5.8 11.8 8 14l2.2-2.2"/></svg>',"justify-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="5.4" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4.6" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="8.2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-between":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-around":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"align-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="5.4" width="9" height="2.4" rx=".4"/></svg>',"align-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="4.6" width="9" height="2.4" rx=".4"/><rect x="3.5" y="9" width="9" height="2.4" rx=".4"/></svg>',"align-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="8.2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="11.6" width="9" height="2.4" rx=".4"/></svg>',"align-stretch":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx=".5"/><rect x="9" y="2" width="4" height="12" rx=".5"/></svg>',absolute:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>',color:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.4 11.2 7.4 2.4l4 8.8"/><path d="M4.7 8.4h5.4"/><rect x="1.6" y="12.8" width="12.8" height="2.2" rx=".6" fill="currentColor" stroke="none"/></svg>',bg:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 1.9a6.1 6.1 0 1 0 0 12.2c.85 0 1.35-.55 1.35-1.25 0-.38-.18-.66-.4-.88a1.2 1.2 0 0 1 .85-2.05h1.3A3.5 3.5 0 0 0 14.1 6.1C14.1 3.75 11.4 1.9 8 1.9Z"/><circle cx="4.9" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="8" cy="4.8" r=".95" fill="currentColor" stroke="none"/><circle cx="11.1" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="4.7" cy="9.9" r=".95" fill="currentColor" stroke="none"/></svg>',padding:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/></svg>',margin:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/><path d="M2 2.5h12M2 13.5h12M2.5 2v12M13.5 2v12" stroke-dasharray="1.4 1.2"/></svg>',"box-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".4" fill="currentColor" stroke="none"/></svg>',"box-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"gap-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"gap-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="3" y="1.6" width="10" height="4.2" rx=".6"/><rect x="3" y="10.2" width="10" height="4.2" rx=".6"/><path d="M4.5 8h7"/></svg>',"gap-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"bd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4"/></svg>',"bd-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-top":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-bottom":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-left":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-right":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"rd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="3.4"/></svg>',"rd-tl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6H6a3.4 3.4 0 0 0-3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M2.6 9V6A3.4 3.4 0 0 1 6 2.6h3" stroke-width="2.2"/></svg>',"rd-tr":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6h7.4a3.4 3.4 0 0 1 3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M7 2.6h3A3.4 3.4 0 0 1 13.4 6v3" stroke-width="2.2"/></svg>',"rd-br":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6v7.4a3.4 3.4 0 0 1-3.4 3.4H2.6" stroke-width="1" opacity=".35"/><path d="M13.4 7v3a3.4 3.4 0 0 1-3.4 3.4H7" stroke-width="2.2"/></svg>',"rd-bl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6v7.4a3.4 3.4 0 0 0 3.4 3.4h7.4" stroke-width="1" opacity=".35"/><path d="M2.6 7v3A3.4 3.4 0 0 0 6 13.4h3" stroke-width="2.2"/></svg>'},v={html:null,css:null,js:null},qt={html:null,css:null,js:null},Vt={html:null,css:null,js:null};export{ef as ARMED_KEY,yu as AUTOSAVE_ICON,vr as AUTOSAVE_KEY,gu as BACK_ICON,xu as CSS_ADD_ICON,Sr as CSS_GRAYS,Lu as CSS_LENGTHS,$ as CSS_MENU_ID,$u as CSS_MODE_ICON,Io as CSS_SIZE_KEY,ku as CSS_SPACING,Oo as CSS_STATES,so as CSS_STATE_KEY,wr as CSS_TOOLS,_n as CSS_TOOL_ICONS,xe as CSS_TOOL_INDEX,vu as DATA_ICON,I as DATA_MENU_ID,fu as DEFAULT_HEIGHT,u as DOCK_ID,Mt as Decoration,be as EditorState,N as EditorView,at as HANDLES,pr as HEIGHT_KEY,_u as HISTORY_ICON,kr as HTML_HEADINGS,co as HTML_TOOLS,Cu as ID_MODE_ICON,pu as LOCK_CLOSED_ICON,mu as LOCK_OPEN_ICON,br as MIN_HEIGHT,Ke as MIN_PANE,wt as PANES,mr as PANES_KEY,At as RangeSetBuilder,bu as SAVE_ICON,hu as SAVE_MS,du as SCOPE_CLASS,xr as SCOPE_ICON,je as SCOPE_KEY,wu as STRIP_ICON,uu as STYLE_ID,yr as STYLE_MODE_KEY,Re as StateEffect,Tt as StateField,Tu as TW_MODE_ICON,Su as TW_TOOL_ICONS,X as UNLOCK_ID,Ro as VALUES_MODE_KEY,gr as WIDTHS_KEY,oe as applyCssFolds,Jt as applyCssScope,ac as applyDisplay,rc as applyFlexDirection,bs as applyHtmlTag,J as applyRuleDecls,Ps as applyStyleMode,nr as autocompletion,wo as autosaveEnabled,jd as bindAntlersSnippets,nn as bindAutosave,Sn as bindBack,Ql as bindCssAddClass,kd as bindCssTools,Rd as bindDataVars,gd as bindHistory,sn as bindHtmlScope,wd as bindHtmlTidy,_d as bindHtmlTools,ou as bindLayoutWatch,on as bindLock,iu as bindPaneToggles,ru as bindResize,au as bindSplitters,md as bindStrip,xd as bindStyleMode,Wd as bindVisualEditSnippets,Fe as clearHtmlScopeRange,sr as closeBrackets,rr as closeBracketsKeymap,Hs as closeCodeDock,Zu as closeCodeDockPopups,ar as closeCompletion,w as closeCssMenu,bt as closeDataMenu,C as cm,Yu as codeDockStyleMode,fr as codeFolding,Rs as collectionViewType,ir as completionKeymap,dr as css,xs as cssEditorText,Oe as cssRuleAtCursor,Ls as cssSizeRow,pt as cssSizeRows,ze as cssStateSuffix,tt as currentFlexDecls,Dt as currentFullHtml,ds as currentSectionValues,Ct as currentTemplateType,Qs as defaultKeymap,vt as dispatchHtmlChanges,Vt as editableOf,v as editors,Jd as ensureStyle,is as ensureTwCss,Os as enterValuesRule,V as finishHtmlEdit,Hl as flushBracketSync,ct as flushCssScope,Rl as flushCssToHtml,Y as flushSave,io as foldEffect,hr as foldedRanges,fs as goBackTemplate,Ys as highlightActiveLine,Js as highlightActiveLineGutter,or as history,er as historyKeymap,lr as hoverTooltip,cr as html,ms as htmlEditorText,Qt as htmlElementAtCursor,Ae as htmlFocusOk,Ho as htmlLanguage,Yt as htmlScopeEnabled,$t as htmlTargetFromCursor,Pe as indentFromPrevious,tr as indentWithTab,Cd as insertAiSnippet,It as insertHtmlSnippet,zr as isCodeDockArmed,ht as isCodeDockLocked,zs as isCodeDockOpen,Kd as isPanelFrame,ur as javascript,ao as keymap,Ud as languageOf,yt as leadingCssIndent,lt as lineIndentOf,Zs as lineNumbers,cu as loadCm,He as loadTemplate,rd as mountEditor,Fs as newSizeBlockSpot,no as newSizeQuery,D as normalizeFlexValue,Po as observeDockLayout,nt as onEditorInput,dc as openCssChoiceMenu,cc as openCssColorMenu,uc as openCssSpacingMenu,fn as openCssValueMenu,js as openDataVarsMenu,Zl as openHtmlComponentMenu,cn as openHtmlTagMenu,us as openNestedTemplate,Nl as openRenameClassMenu,De as paintAlpine,it as paintAutosave,Zt as paintBack,ne as paintCssHead,Bo as paintCssIdMark,O as paintCssToolState,ad as paintHostWait,G as paintHtmlScope,Ie as paintHtmlToolState,Ft as paintLock,Us as paintPaneButtons,Gt as paintStrip,Fo as paintStyleMode,Lo as paintValuesMode,W as placeCssMenu,Xt as placeDock,Do as previewBottomPad,Dl as primeTailwindCompile,qt as readOnlyOf,Ao as readParts,Ad as refreshCodeDockFromDisk,ve as refreshPreview,Md as relayoutCodeDock,Ee as rememberBracketNames,zt as rememberCssSelectors,Pl as resetTailwindCompile,Mo as sameParts,of as setCodeDockArmed,Xs as setPath,R as setStatus,yd as setValuesMode,kn as shieldDock,To as showHtmlFull,Co as showHtmlScope,eu as stopObservingDockLayout,Ns as storedPanes,Ju as syncCodeDock,Je as syncHtmlTree,Me as syncScopedHtml,se as syncTwTarget,lu as tags,Dr as templateDockAllowed,ys as tidyHtmlPane,lo as unfoldEffect,Be as writeHandleEditor,Le as writeHtmlEditor,te as writeParts};
