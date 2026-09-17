const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-DjrKc54-.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{v as pr,l as mr}from"./codemirror-BtqsHwkm.js";import{o as y,c as b,a as v,t as A,F as O,e as q,al as ct,ae as Rt,ap as yn,aB as Ve,az as bn,w as Ct,f as L,aA as xn,d as R,b as vr,as as Mt,W as kn,aK as ao,af as Sn,r as io,u as T,m as He,_ as wn,n as gr,a$ as J,Z as V,p as m,at as yr,a_ as br,aD as _n,ak as xr,b0 as Do,aL as kr,A as tt,B as xt,aY as zo,ax as Sr,G as W,aj as lo,b1 as $n,au as wr,b2 as _r,aJ as Cn,b3 as co,k as wt,b4 as uo,b5 as $r,b6 as Cr,b7 as Tr,b8 as Ar,b9 as Mr,ba as Er,bb as Br,bc as Lr,bd as Fr,be as Ho,bf as Re,z as Ro,bg as Ue,bh as Ir,bi as Pr,aN as I,aa as Or,j as Dr,bj as jo,bk as zr}from"./addon-BTqGI6BH.js";import{bl as yu,bm as bu}from"./addon-BTqGI6BH.js";import{B as ye,D as Hr,t as Tn,m as Rr,E as An,p as jr,F as Wr,G as Nr,I as qr,J as Wo,K as Vr,f as Mn,L as Ur,M as Kr,N as Gr,g as Xr,O as Yr,P as En,Q as Zr,a as Ke,R as Jr,j as Bn,S as Qr,T as ta,U as ea,d as Ln,V as oa,W as na,X as No,Y as ae}from"./tw-classes-DHrNGHyg.js";import{t as sa}from"./tw-candidates-wYTeDvRv.js";import{h as ra,a as aa,e as ia,A as la,b as ca,i as fo,c as da,d as ue}from"./html-tag-sync-D4MA50-d.js";import"./ai-text-icon-B7uCWIwa.js";import"./html-pick-align-CK-9iH9_.js";import"./index-Dpuj8sxX.js";import"./index-B5fiB6ig.js";import"./index-QkwZ_wP2.js";import"./index-CY0AOW5Y.js";import"./index-gYg9gdv3.js";import"./index-lzvKgifK.js";import"./index-BBw1nzv2.js";import"./index-DqbOpr3Y.js";import"./index-C_pm8ee_.js";import"./index-B8kpdD8S.js";const Fn=/^\.[a-zA-Z_][\w-]*$/;function ho(t){const e=String(t||""),o=/(^|\s)\[/g;let n;for(;n=o.exec(e);){const s=n.index+n[1].length,r=/\](?=\s|$)/g;r.lastIndex=s+1;const a=r.exec(e);if(a)return{from:s,to:a.index+1,innerFrom:s+1,innerTo:a.index}}return null}function In(t){const e=String(t||""),o=ho(e);return o?e.slice(o.innerFrom,o.innerTo).replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).filter(n=>/^[a-zA-Z_][\w-]*$/.test(n)):[]}function Pn(t){const e=String(t||"").match(/\sclass\s*=\s*(["'])([^"']*)\1/i);return e?In(e[2]):[]}function ua(t){return Pn(t)[0]||""}function be(t){const e=String(t||""),o=[],n=/\sclass\s*=\s*(["'])/gi;let s;for(;s=n.exec(e);){const r=s[1],a=s.index+s[0].length,l=e.indexOf(r,a);if(l===-1)break;const c=e.slice(a,l),d=ho(c);if(d){const f=c.slice(d.innerFrom,d.innerTo),h=a+d.innerFrom,p=f.replace(/\{\{[\s\S]*?\}\}/g,z=>" ".repeat(z.length)),x=/[a-zA-Z_][\w-]*/g;let k;for(;k=x.exec(p);)o.push({name:k[0],from:h+k.index,to:h+k.index+k[0].length})}n.lastIndex=l+1}return o}function qo(t,e){return be(t).find(o=>e>=o.from&&e<=o.to)||null}function Vo(t,e){const o=String(t||""),n=be(o);let s=o;for(let r=n.length-1;r>=0;r-=1){const a=n[r],l=e(a.name);if(l!==a.name){if(!l){let c=a.from,d=a.to;s[d]===" "?d+=1:c>0&&s[c-1]===" "&&(c-=1),s=s.slice(0,c)+s.slice(d);continue}s=s.slice(0,a.from)+l+s.slice(a.to)}}return s}function On(t){const e=[],o=/(^|[^\w-])\.([a-zA-Z_][\w-]*)\s*\{/g;let n;for(;n=o.exec(String(t||""));)e.push(n[2]);return e}function Dn(t,e){const o=[],n=[],s=[];let r=0,a=0;for(;r<t.length&&a<e.length;){if(t[r]===e[a]){r+=1,a+=1;continue}const l=e.indexOf(t[r],a),c=t.indexOf(e[a],r);l===-1&&c===-1?(o.push({from:t[r],to:e[a]}),r+=1,a+=1):l===-1?(s.push(t[r]),r+=1):c===-1||l<=c?(n.push(e[a]),a+=1):(s.push(t[r]),r+=1)}for(;r<t.length;)s.push(t[r]),r+=1;for(;a<e.length;)n.push(e[a]),a+=1;return{renamed:o,added:n,removed:s}}function kt(t){let e=String(t||"").trim().replace(/^\.+/,"").replace(/\s+/g,"-").replace(/[^a-zA-Z0-9_-]/g,"");return/^[a-zA-Z_]/.test(e)||(e=e.replace(/^[^a-zA-Z_]+/,"")),Fn.test(`.${e}`)?e:""}function fa(t,e){const o=String(t||""),n=kt(e);if(!o||!n)return o;const s=o.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(s){const r=s[1];let a=s[2];const l=ho(a);if(l){const c=a.slice(l.innerFrom,l.innerTo).trim(),f=In(a).includes(n)?c:`${c} ${n}`.trim();a=`${a.slice(0,l.from)}[ ${f} ]${a.slice(l.to)}`}else a=`[ ${n} ] ${a}`.trim();return o.slice(0,s.index)+` class=${r}${a}${r}`+o.slice(s.index+s[0].length)}return/\/\s*>$/.test(o)?o.replace(/(\s*)(\/\s*>)$/,` class="[ ${n} ]"$1$2`):o.replace(/(\s*)>$/,` class="[ ${n} ]"$1>`)}function ha(t,e){const o=String(t).indexOf(">",e.from);return o===-1?"":t.slice(e.from,o+1)}function zn(t,e){const o=[];for(const n of e){const s=Pn(ha(t,n)),r=zn(t,n.children||[]);if(s.length){o.push({className:s[0],children:r});for(const a of s.slice(1))o.push({className:a,children:[]})}else o.push(...r)}return o}function xe(t){return zn(t,ye(t))}function fe(t){return String(t).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function po(t,e){if(t.startsWith("/*",e)){const o=t.indexOf("*/",e+2);return o===-1?t.length:o+2}return e}function Lt(t,e){let o=0;for(let n=e;n<t.length;n+=1){if(t.startsWith("/*",n)){n=po(t,n)-1;continue}if(t[n]==="{")o+=1;else if(t[n]==="}"&&(o-=1,o===0))return n}return-1}function X(t,e){const o=String(t||""),n=new RegExp(`(^|[^\\w-])\\.${fe(e)}\\s*\\{`,"g");let s;for(;s=n.exec(o);){const r=s.index+s[1].length,a=o.indexOf("{",r);if(a===-1)continue;const l=Lt(o,a);if(l!==-1)return{from:r,brace:a,close:l,to:l+1,name:e}}return null}function pa(t){const e=String(t||""),o=[],n={},s=[];let r=0,a="";const l=()=>{const c=a.trim();c&&o.push(c),a=""};for(;r<e.length;){if(e.startsWith("/*",r)){const c=po(e,r);a+=e.slice(r,c),r=c;continue}if(e[r]==="{"){const c=a.trim(),d=Lt(e,r);if(d===-1)break;const f=e.slice(r+1,d);a="",Fn.test(c)?n[c.slice(1)]=f:c&&s.push(`${c} {${f}}`),r=d+1;continue}a+=e[r],r+=1}return l(),{decls:o.join(`
`),classes:n,other:s}}function Uo(t,e){const o="    ".repeat(e);return String(t||"").split(`
`).map(n=>n.trim()?o+n.trim():"").filter((n,s,r)=>n||s>0&&s<r.length-1).join(`
`)}function ma(t,e){const o=X(t,e);return o?String(t).slice(o.brace+1,o.close):""}function Hn(t,e,o){const n=pa(ma(e,t.className)),s="    ".repeat(o),r=[];n.decls&&r.push(Uo(n.decls.replace(/;+\s*$/,";"),o+1));for(const l of n.other)r.push(Uo(l,o+1));for(const l of t.children)r.push(Hn(l,e,o+1));const a=r.filter(Boolean).join(`
`);return a?`${s}.${t.className} {
${a}
${s}}`:`${s}.${t.className} {
${s}}`}function mo(t,e){return e?.length?e.map(o=>Hn(o,t,0)).join(`

`)+`
`:""}function Rn(t){const e=String(t||"").match(/^\s*\.([a-zA-Z_][\w-]*)\s*\{/);return e?e[1]:""}function va(t){const e=[],o=/\.([a-zA-Z_][\w-]*)\s*\{/g;let n,s=!0;for(;n=o.exec(String(t||""));){if(s){s=!1;continue}e.push(n[1])}return e}function ga(t,e){const o=String(t).lastIndexOf(`
`,e-1)+1,n=t.slice(o,e);return/^\s*$/.test(n)?n:""}function ya(t,e){return e?t.split(`
`).map((o,n)=>n===0||!o?o:e+o).join(`
`):t}function ba(t,e){let o=0;for(let n=0;n<e.from;n+=1){if(t.startsWith("/*",n)){n=po(t,n)-1;continue}t[n]==="{"?o+=1:t[n]==="}"&&(o-=1)}return o===0}function vo(t,e,o){const n=Rn(e)||o;if(!n)return String(t||"");let s=String(e||"").trim();s?new RegExp(`^\\.${fe(n)}\\s*\\{`).test(s)||(s=`.${n} {
${s}
}`):s=`.${n} {
}`;let r=String(t||"");const a=X(r,n),l=va(s);if(a){const d=ga(r,a.from);r=r.slice(0,a.from)+ya(s,d)+r.slice(a.to)}else r=`${r.trimEnd()}${r.trim()?`
`:""}${s}
`;const c=X(r,n);if(!c)return r;for(const d of[...new Set(l)].reverse()){const f=new RegExp(`(^|[^\\w-])\\.${fe(d)}\\s*\\{`,"g"),h=[];let p;for(;p=f.exec(r);){const x=p.index+p[1].length,k=r.indexOf("{",x),z=Lt(r,k);z!==-1&&h.push({from:x,to:z+1})}for(const x of h.reverse()){if(x.from>=c.from&&x.to<=c.to||!ba(r,x))continue;let k=x.from;const z=r.lastIndexOf(`
`,k-1)+1;/^\s*$/.test(r.slice(z,k))&&(k=z);let mt=x.to;r[mt]===`
`&&(mt+=1),r=r.slice(0,k)+r.slice(mt)}}return r}function je(t,e){const o=String(t||"");return`${o.trimEnd()}${o.trim()?`
`:""}.${e} {
}
`}function xa(t,e,o){const n=kt(o);return!e||!n||e===n?String(t||""):X(t,n)?jn(t,e):String(t||"").replace(new RegExp(`(^|[^\\w-])\\.${fe(e)}(\\s*\\{)`,"g"),`$1.${n}$2`)}function jn(t,e){let o=String(t||"");for(;;){const n=X(o,e);if(!n)break;let s=n.from;const r=o.lastIndexOf(`
`,s-1)+1;/^\s*$/.test(o.slice(r,s))&&(s=r);let a=n.to;o[a]===`
`&&(a+=1),o=o.slice(0,s)+o.slice(a)}return o}function ka(t,e,o){const n=Array.isArray(e)?e:[],s=Array.isArray(o)?o:[],{renamed:r,added:a}=Dn(n,s),l=new Set(s);let c=String(t||"");for(const d of r){const f=kt(d.to);if(f){if(l.has(d.from)){X(c,f)||(c=je(c,f));continue}X(c,d.from)?c=xa(c,d.from,f):X(c,f)||(c=je(c,f))}}for(const d of a){const f=kt(d);!f||X(c,f)||(c=je(c,f))}return c}function Sa(t,e,o){const n=new Set(Array.isArray(e)?e:[]),s=new Set(Array.isArray(o)?o:[]);let r=String(t||"");for(const a of s)n.has(a)||(r=jn(r,a));return r}const st="__sve-css-rename-chip",wa='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';function _a(t){const e=t.Decoration.mark({class:"sve-cm-css-token"}),o=t.StateEffect.define();return{extensions:[t.StateField.define({create(){return t.Decoration.none},update(s,r){let a;for(const c of r.effects)c.is(o)&&(a=c.value);if(a===void 0)return r.docChanged?t.Decoration.none:s;if(!a)return t.Decoration.none;const l=new t.RangeSetBuilder;return l.add(a.from,a.to,e),l.finish()},provide:s=>t.EditorView.decorations.from(s)})],setHover(s,r){s&&s.dispatch({effects:o.of(r)})}}}function rt(t){t?.getElementById(st)?.remove()}function $a(t,e,o,n){e.style.left=`${Math.max(6,Math.min(o,t.innerWidth-28))}px`,e.style.top=`${Math.max(6,n)}px`}function Ca(t,e,o,{onRename:n,title:s}){const r=t.document,a=e.coordsAtPos(o.to);if(!a)return;rt(r);const l=r.createElement("button");l.id=st,l.type="button",l.innerHTML=wa,l.title=s,l.setAttribute("aria-label",s),l.addEventListener("mousedown",c=>{c.preventDefault(),c.stopPropagation(),rt(r),n?.(o)}),l.addEventListener("mouseleave",()=>{t.setTimeout(()=>{e.dom.matches(":hover")||l.matches(":hover")||rt(r)},120)}),r.body.appendChild(l),$a(t,l,a.right+2,a.top-1)}function Ta(t,e,{onRename:o,isLocked:n,setHover:s,title:r}){if(!e?.dom||e.dom._sveClassTokenBound)return;e.dom._sveClassTokenBound=!0;let a=null,l="";const c=()=>!!n?.(),d=()=>{t.clearTimeout(a),a=null,l="",s?.(e,null),rt(t.document)},f=h=>{if(c()){d();return}d(),o?.(h)};e.dom.addEventListener("mousemove",h=>{if(c()){d();return}if(h.target?.closest?.(`#${st}`))return;const p=e.posAtCoords({x:h.clientX,y:h.clientY});if(p==null)return;const x=qo(e.state.doc.toString(),p);if(!x){t.clearTimeout(a),a=null,l="",s?.(e,null);return}const k=`${x.from}:${x.to}:${x.name}`;s?.(e,{from:x.from,to:x.to}),!(l===k&&(a||t.document.getElementById(st)))&&(t.clearTimeout(a),l=k,a=t.setTimeout(()=>{a=null,Ca(t,e,x,{onRename:f,title:r||"Rename class"})},160))}),e.dom.addEventListener("mouseleave",h=>{h.relatedTarget?.closest?.(`#${st}`)||t.setTimeout(()=>{t.document.getElementById(st)?.matches(":hover")||d()},160)}),e.dom.addEventListener("dblclick",h=>{if(c())return;const p=e.posAtCoords({x:h.clientX,y:h.clientY});if(p==null)return;const x=qo(e.state.doc.toString(),p);x&&(h.preventDefault(),h.stopPropagation(),f(x))},!0),e.scrollDOM?.addEventListener("scroll",d),t.document._sveClassTokenDismiss||(t.document._sveClassTokenDismiss=!0,t.document.addEventListener("mousedown",h=>{h.target.closest(`#${st}`)||rt(t.document)}))}const i={cssColorsPromise:null,lastUid:null,lastType:null,typeStack:[],lastParts:{html:"",css:"",js:""},lastProps:[],propsDirty:!1,lastLocked:!1,lockReady:!1,lastWin:null,loadGen:0,saveTimer:null,lastBracketNames:null,lastCssSelectorNames:null,saveInFlight:null,dragging:!1,applying:!1,htmlScopePref:!0,htmlScopeActive:!1,styleMode:"css",cssToolRow:null,cssOpenTool:"",cssOpenMenu:"",cssValues:!1,twCss:null,twKey:"",twBusy:!1,twDirty:!1,htmlFocus:null,htmlFull:"",cssFull:"",cssPane:"full",cssScopeSnapshot:"",layoutObserver:null,layoutWin:null,observedEditor:null,observedRight:null,layoutWatchBound:!1,cssSize:"",cssState:"",cssOwnFolds:new Set,cssFoldSig:"",htmlPartialUi:null,htmlAntlersUi:null,htmlClassTokenUi:null,cssGhostUi:null},Aa=["aria-label"],Ma={value:""},Ea=["label"],Ba=["value"],Wn={__name:"CodeDockAntlersSelect",props:{label:{type:String,required:!0},groups:{type:Array,required:!0},onPick:{type:Function,required:!0}},setup(t){const e=t;function o(n){const s=n.target.value;n.target.value="",s&&e.onPick(s)}return(n,s)=>(y(),b("select",{"data-sve-antlers-select":"","aria-label":t.label,onChange:o},[v("option",Ma,A(t.label),1),(y(!0),b(O,null,q(t.groups,r=>(y(),b("optgroup",{key:r.id,label:r.label},[(y(!0),b(O,null,q(r.items,a=>(y(),b("option",{key:a.id,value:a.id},A(a.label),9,Ba))),128))],8,Ea))),128))],40,Aa))}},La={"data-sve-data-search":""},Fa=["placeholder","aria-label","onKeydown"],Ia={"data-sve-data-tabs":""},Pa=["data-active","onClick"],Oa={key:0,"data-sve-data-empty":""},Da={key:0,"data-sve-data-group":""},za=["data-cursor","title","onMouseenter","onClick"],Ha={"data-sve-data-name":""},Ra={key:0,"data-sve-data-parent":""},ja={key:1,"data-sve-data-loop":""},Wa={key:2,"data-sve-data-value":""},Na={__name:"CodeDockDataVars",props:{title:{type:String,default:""},placeholder:{type:String,default:""},emptyText:{type:String,default:""},noSectionText:{type:String,default:""},loopText:{type:String,default:""},tabs:{type:Array,required:!0},data:{type:Object,required:!0},onPick:{type:Function,required:!0}},setup(t){const e=t,o=ct(""),n=ct(null),s=ct(e.tabs[0]?.id||"section"),r=ct(null),a=ct(-1),l=ct(!1),c=Rt(()=>o.value.trim().toLowerCase()),d=Rt(()=>{const _=e.data[s.value]||[];return Array.isArray(_)&&_.length&&_[0]?.items?_:[{handle:s.value,label:"",items:_,bare:!0}]}),f=Rt(()=>{const _=c.value;return d.value.map(S=>({...S,items:(S.items||[]).filter(M=>!_||M.var.toLowerCase().includes(_)||String(M.label||"").toLowerCase().includes(_)||String(M.parent||"").toLowerCase().includes(_))})).filter(S=>S.items.length)}),h=Rt(()=>f.value.flatMap(_=>_.items.map(S=>({row:S,group:_})))),p=Rt(()=>!h.value.length);yn(()=>Ve(()=>n.value?.focus()));function x(_){l.value=!0;const S=h.value.length;if(!S){a.value=-1;return}const M=a.value+_;a.value=M<0?-1:Math.min(M,S-1),Ve(()=>k())}function k(){const _=r.value?.querySelector("[data-cursor]");if(!_)return;let S=_.parentElement;for(;S&&S.scrollHeight<=S.clientHeight;)S=S.parentElement;if(!S)return;const M=_.offsetTop,H=M+_.offsetHeight;M<S.scrollTop?S.scrollTop=M:H>S.scrollTop+S.clientHeight&&(S.scrollTop=H-S.clientHeight)}function z(_){return h.value.findIndex(S=>S.row===_)}function mt(_){l.value||(a.value=z(_))}function Ht(){const _=a.value>=0?h.value[a.value]:null;_&&e.onPick(_.row,_.group)}function re(_){s.value=_,a.value=-1}return(_,S)=>(y(),b(O,null,[v("div",La,[S[6]||(S[6]=v("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[v("circle",{cx:"11",cy:"11",r:"7"}),v("path",{d:"m20 20-3.5-3.5"})],-1)),bn(v("input",{ref_key:"input",ref:n,"data-sve-data-input":"","onUpdate:modelValue":S[0]||(S[0]=M=>o.value=M),type:"text",placeholder:t.placeholder,"aria-label":t.title,onInput:S[1]||(S[1]=M=>a.value=-1),onKeydown:[S[2]||(S[2]=Ct(L(M=>x(1),["prevent"]),["down"])),S[3]||(S[3]=Ct(L(M=>x(-1),["prevent"]),["up"])),Ct(L(Ht,["prevent"]),["enter"]),S[4]||(S[4]=Ct(L(()=>{},["stop"]),["escape"]))]},null,40,Fa),[[xn,o.value]])]),v("div",Ia,[(y(!0),b(O,null,q(t.tabs,M=>(y(),b("button",{key:M.id,type:"button","data-sve-data-tab":"","data-active":s.value===M.id?"":void 0,onClick:L(H=>re(M.id),["prevent","stop"])},A(M.label),9,Pa))),128))]),p.value?(y(),b("div",Oa,A(s.value==="section"&&!(t.data.section||[]).length?t.noSectionText:t.emptyText),1)):R("",!0),v("div",{ref_key:"rowsEl",ref:r,onMousemove:S[5]||(S[5]=M=>l.value=!1)},[(y(!0),b(O,null,q(f.value,M=>(y(),b(O,{key:M.handle},[M.bare?R("",!0):(y(),b("div",Da,A(M.label),1)),(y(!0),b(O,null,q(M.items,H=>(y(),b("button",{key:M.handle+"::"+H.var+"::"+(H.parent||""),type:"button","data-sve-data-option":"","data-cursor":z(H)===a.value?"":void 0,title:H.label,onMouseenter:hr=>mt(H),onClick:L(hr=>t.onPick(H,M),["prevent","stop"])},[v("span",Ha,A(H.var),1),H.parent?(y(),b("span",Ra,A(H.parent),1)):R("",!0),H.loop?(y(),b("span",ja,A(t.loopText),1)):H.value?(y(),b("span",Wa,A(H.value),1)):R("",!0)],40,za))),128))],64))),128))],544)],64))}},Tt=new Map,Ko={scope:null,section:[],page:[],site:[]};function qa(t){const e=t?.location?.pathname?.match(/\/collections\/([^/]+)\//);return e?e[1]:""}function Va(t){const e=String(t||"").trim();return!e||/^(header|footer)\//.test(e)?"":e}function Ua(t){return(Array.isArray(t)?t:[]).filter(e=>e?.handle).map(e=>`${e.kind==="collection"?"collection":"field"}:${e.handle}`).join("|")}function Nn({collection:t,set:e,view:o,scope:n}){return`${t}::${e}::${o||""}::${n||""}`}function Ka(t){return Tt.get(t)||null}function Ga(t,{collection:e,set:o,view:n,scope:s}){const r=Nn({collection:e,set:o,view:n,scope:s}),a=Tt.get(r);if(a)return Promise.resolve(a);const l=new URLSearchParams;return e&&l.set("collection",e),o&&l.set("set",o),n&&l.set("view",n),s&&l.set("scope",s),t.fetch(`/!/sve/data-vars?${l.toString()}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(c=>c.ok?c.json():null).then(c=>{const d=c&&typeof c=="object"?c:Ko;return Tt.set(r,d),d}).catch(()=>Ko)}function Xa(t){if(!t){Tt.clear();return}const e=`::${t}::`;for(const o of[...Tt.keys()])o.includes(e)&&Tt.delete(o)}function Ya(t){if(t==null||t==="")return"";if(typeof t=="boolean")return t?"true":"false";if(Array.isArray(t))return t.length?`${t.length} ×`:"";if(typeof t=="object"){const o=Object.keys(t).length;return o?`${o} ×`:""}const e=String(t).replace(/\s+/g," ").trim();return e.length>60?`${e.slice(0,60)}…`:e}function Za(t,e){return e.split(".").reduce((o,n)=>o&&typeof o=="object"?o[n]:void 0,t)}function qn(t,e){return!Array.isArray(t)||!e||typeof e!="object"?t||[]:t.map(o=>{if(o.parent||o.value!=null||o.var.includes(":"))return o;const n=Ya(Za(e,o.var));return n?{...o,value:n}:o})}function Ja(t,e){return Array.isArray(t)?t.map(o=>({...o,items:qn(o.items,e)})):[]}function Qa(t,e){const o=String(t?.var||"").trim();if(!o)return null;if(t.loop)return{text:`{{ ${o} }}
  
{{ /${o} }}`,cursor:`{{ ${o} }}
  `.length};if(e?.loop&&!t.parent){const n=e.loop;return{text:`{{ ${n} }}
  {{ ${o} }}
{{ /${n} }}`,cursor:`{{ ${n} }}
  {{ ${o} }}`.length}}return{text:`{{ ${o} }}`,cursor:`{{ ${o} }}`.length}}const ie="visual_edit",ti=[{id:"base",lang:"code_dock_visual_edit_base"},{id:"field",lang:"code_dock_visual_edit_field"}],Vn=[{id:"tag",group:"base",label:"{{ visual_edit }}",standalone:"{{ visual_edit| }}"},{id:"ve_popup",group:"base",label:"popup",attr:'popup="true"'},{id:"ve_orderable",group:"base",label:"orderable",attr:'orderable="true"'},{id:"ve_section_orderable",group:"base",label:"section_orderable",attr:'section_orderable="true"'},{id:"ve_outline_inside",group:"base",label:"outline_inside",attr:'outline_inside="true"'},{id:"ve_field",group:"field",label:"field",attr:'field="|"'},{id:"ve_inline_edit",group:"field",label:"inline_edit",attr:'inline_edit="true"'},{id:"ve_insertable",group:"field",label:"insertable",attr:'insertable="true"'},{id:"ve_toolbar",group:"field",label:"toolbar",attr:'toolbar="true"'},{id:"ve_scope",group:"field",label:"scope",attr:'scope="|"'},{id:"ve_controls",group:"field",label:"controls",attr:'controls="|"'}];function ei(t){return Vn.find(e=>e.id===t)||null}function oi(t,e,o,n){let s=e;for(;s<o;){const r=t.indexOf("{{",s);if(r===-1||r>=o)return null;const a=t.indexOf("}}",r+2);if(a===-1||a+2>o)return null;const l=t.slice(r+2,a);if((l.trim().split(/\s+/)[0]||"")===n)return{openIdx:r,closeIdx:a,inner:l};s=a+2}return null}function ni(t,e){const o=String(e).split("=")[0].trim();return new RegExp(`(^|\\s)${o}(=|\\s|$)`).test(t)}const si={class:"sve-code-dock"},ri={"data-sve-code-bar":""},ai={type:"button","data-sve-code-pane-btn":"html"},ii={type:"button","data-sve-code-pane-btn":"css"},li={type:"button","data-sve-code-pane-btn":"alpine"},ci={type:"button","data-sve-code-pane-btn":"js"},di={type:"button","data-sve-html-scope":"","aria-pressed":"true"},ui=["innerHTML"],fi={"data-sve-code-panes":""},hi={"data-sve-code-pane":"html"},pi={"data-sve-code-pane-label":""},mi=["title","aria-label"],vi=["innerHTML"],gi={"data-sve-code-pane":"css"},yi={"data-sve-css-chrome":"subrow-2"},bi={"data-sve-code-pane-label":""},xi={"data-sve-css-label":""},ki={"data-sve-code-pane":"alpine"},Si={"data-sve-code-pane-label":""},wi={"data-sve-code-pane":"js"},_i={"data-sve-code-pane-label":""},$i={__name:"CodeDockChrome",props:{htmlLabel:{type:String,required:!0},cssLabel:{type:String,required:!0},jsLabel:{type:String,required:!0},alpineLabel:{type:String,required:!0},treeIcon:{type:String,required:!0},dataIcon:{type:String,required:!0},dataLabel:{type:String,required:!0}},setup(t){return(e,o)=>(y(),b("div",si,[o[19]||(o[19]=v("div",{"data-sve-code-grip":"","aria-hidden":"true"},null,-1)),v("div",ri,[v("button",ai,A(t.htmlLabel),1),v("button",ii,A(t.cssLabel),1),v("button",li,A(t.alpineLabel),1),v("button",ci,A(t.jsLabel),1),o[0]||(o[0]=vr('<button type="button" data-sve-code-back hidden></button><span data-sve-code-path></span><span data-sve-code-status></span><button type="button" data-sve-code-strip></button><button type="button" data-sve-code-history></button><button type="button" data-sve-style-mode></button><button type="button" data-sve-values-mode></button>',7)),v("button",di,[v("span",{innerHTML:t.treeIcon},null,8,ui)]),o[1]||(o[1]=v("button",{type:"button","data-sve-code-autosave":"","aria-pressed":"true"},null,-1)),o[2]||(o[2]=v("button",{type:"button","data-sve-code-save":"",hidden:""},null,-1)),o[3]||(o[3]=v("button",{type:"button","data-sve-code-lock":"",hidden:""},null,-1))]),o[20]||(o[20]=v("div",{"data-sve-code-lock-banner":""},null,-1)),v("div",fi,[v("div",hi,[v("div",pi,[v("span",null,A(t.htmlLabel),1),o[4]||(o[4]=v("div",{"data-sve-html-tools":""},null,-1)),o[5]||(o[5]=v("button",{type:"button","data-sve-html-tidy":""},null,-1)),v("button",{type:"button","data-sve-data-vars":"",title:t.dataLabel,"aria-label":t.dataLabel},[v("span",{innerHTML:t.dataIcon},null,8,vi)],8,mi),o[6]||(o[6]=v("div",{"data-sve-visual-edit-tools":""},null,-1)),o[7]||(o[7]=v("div",{"data-sve-antlers-tools":""},null,-1))]),o[8]||(o[8]=v("div",{"data-sve-code-host":""},null,-1))]),o[16]||(o[16]=v("div",{"data-sve-code-split":"","data-sve-code-split-after":"html"},null,-1)),v("div",gi,[v("div",yi,[v("div",bi,[v("span",xi,A(t.cssLabel),1),o[9]||(o[9]=v("button",{type:"button","data-sve-css-add-class":""},null,-1)),o[10]||(o[10]=v("div",{"data-sve-css-tools":""},null,-1))])]),o[11]||(o[11]=v("div",{"data-sve-css-head":""},null,-1)),o[12]||(o[12]=v("div",{"data-sve-code-host":""},null,-1)),o[13]||(o[13]=v("div",{"data-sve-tw-host":""},null,-1))]),o[17]||(o[17]=v("div",{"data-sve-code-split":"","data-sve-code-split-after":"css"},null,-1)),v("div",ki,[v("div",Si,[v("span",null,A(t.alpineLabel),1)]),o[14]||(o[14]=v("div",{"data-sve-alpine-host":""},null,-1))]),o[18]||(o[18]=v("div",{"data-sve-code-split":"","data-sve-code-split-after":"alpine"},null,-1)),v("div",wi,[v("div",_i,[v("span",null,A(t.jsLabel),1)]),o[15]||(o[15]=v("div",{"data-sve-code-host":""},null,-1))])])]))}},Go="view:",Xo="partials/";function Un(t){const e=String(t||"");if(!e.startsWith(Go))return null;const o=e.slice(Go.length);return o.startsWith(Xo)?o.slice(Xo.length):o}function Ci(t){const e=String(t||"").match(/\sclass\s*=\s*(["'])([\s\S]*?)\1/i);return e?e[2].replace(/\{\{[\s\S]*?\}\}/g,"\0").split(/[\s[\]]+/).filter(o=>o&&!o.includes("\0")&&/^[A-Za-z_][\w:./%!#-]*$/.test(o)):[]}const Ti=t=>globalThis.CSS?.escape?globalThis.CSS.escape(t):t.replace(/([^\w-])/g,"\\$1");function Kn(t){const e=ye(t)[0];if(!e)return null;const o=Ci(String(t).slice(e.from,e.openTo));return!o.length&&!/^(header|footer|main|nav|aside|figure|form|table)$/.test(e.tag)?null:e.tag+o.map(n=>`.${Ti(n)}`).join("")}const Nt=new Map;let jt=null,Yo=0,Zo=0,Jo=!1;async function Ai(t,e){if(Nt.has(e))return Nt.get(e);const o=`view:partials/${e}`;let n=null;try{const s=await t.fetch(`/!/sve/section-template?type=${encodeURIComponent(o)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}});if(s.ok){const r=await s.json();n=typeof r.html=="string"?Kn(r.html):null}}catch{}return Nt.set(e,n),n}function Mi(t){t?Nt.delete(t):Nt.clear()}function Gn(t){const e=Un(Mt("dock:current-type")),o=e?Mt("dock:html"):"",n=e&&typeof o=="string"?Kn(o):null;kn({source:"statamic-visual-editor",type:"sve-component-focus",on:!!n,name:e?String(e).split("/").pop():"",selector:n||""},t)}async function go(t){const e=++Zo,o=Mt("dock:html"),n=[...new Set((typeof o=="string"?Hr(o):[]).map(r=>r.src).filter(Boolean))],s=await Promise.all(n.map(r=>Ai(t,r)));e===Zo&&kn({source:"statamic-visual-editor",type:"sve-component-map",items:n.map((r,a)=>({src:r,name:r.split("/").pop(),selector:s[a]})).filter(r=>r.selector)},t)}function Ei(t){jt=t,!Jo&&(Jo=!0,ao("dock:html-changed",()=>{jt&&(Mi(Un(Mt("dock:current-type"))),jt.clearTimeout(Yo),Yo=jt.setTimeout(()=>{go(jt)},400))}))}const Bi=["data-sve-html-tool","data-tip","aria-label","data-letter","onClick","onContextmenu"],Li=["innerHTML"],Fi={__name:"CodeDockHtmlTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(t){return(e,o)=>(y(!0),b(O,null,q(t.tools,n=>(y(),b("button",{key:n.id,type:"button","data-sve-html-tool":n.id,"data-tip":n.title,"aria-label":n.title,"data-letter":n.letter?"":void 0,onClick:L(s=>t.onTool(n.id),["prevent","stop"]),onContextmenu:L(s=>t.onTool(n.id),["prevent"])},[n.letter?(y(),b(O,{key:0},[Sn(A(n.letter),1)],64)):(y(),b("span",{key:1,innerHTML:n.icon},null,8,Li))],40,Bi))),128))}},dt=io({tools:[],onTool:null,onKid:null}),Ii=["data-sve-css-item"],Pi=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],Oi={key:0,"data-sve-css-kids":""},Di={key:0,"data-sve-css-sep":"","aria-hidden":"true"},zi=["data-sve-css-kid","data-sve-css-box-side","data-tip","aria-label","innerHTML","onClick","onContextmenu"],Hi={__name:"CodeDockCssTools",setup(t){return(e,o)=>(y(!0),b(O,null,q(T(dt).tools,n=>(y(),b("li",He({key:n.id,"data-sve-css-item":n.id},{ref_for:!0},n.open?{"data-sve-css-open":""}:{}),[v("button",He({type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title},{ref_for:!0},{...n.active?{"data-active":""}:{},...n.open?{"data-open":""}:{}},{innerHTML:n.icon,onClick:L(s=>T(dt).onTool?.(n.id),["prevent","stop"]),onContextmenu:L(s=>T(dt).onTool?.(n.id),["prevent"])}),null,16,Pi),n.open&&n.kids.length?(y(),b("div",Oi,[(y(!0),b(O,null,q(n.kids,s=>(y(),b(O,{key:s.id},[s.sep?(y(),b("span",Di)):R("",!0),v("button",He({type:"button","data-sve-css-kid":s.id,"data-sve-css-box-side":s.id,"data-tip":s.title,"aria-label":s.title},{ref_for:!0},s.active?{"data-active":""}:{},{innerHTML:s.icon,onClick:L(r=>T(dt).onKid?.(n.id,s.id),["prevent","stop"]),onContextmenu:L(r=>T(dt).onKid?.(n.id,s.id),["prevent"])}),null,16,zi)],64))),128))])):R("",!0)],16,Ii))),128))}},Ri=1.5,ji=16;function de(t,e){const o=parseFloat(t);return Number.isFinite(o)?e==="em"||e==="rem"?o*ji:o:null}function Wi(t){const e=String(t||"").toLowerCase();if(/\bmin-width\b|\bwidth\s*>=?/.test(e))return null;let o=e.match(/\bmax-width\s*:\s*([\d.]+)(px|em|rem)/);return o||(o=e.match(/\bwidth\s*<=?\s*([\d.]+)(px|em|rem)/),o)?de(o[1],o[2]):(o=e.match(/([\d.]+)(px|em|rem)\s*>=?\s*width\b/),o?de(o[1],o[2]):null)}function ut(t,e){const o=Wi(t);if(o===null)return"";for(const n of e||[]){if(n.base)continue;const s=de(String(n.max||"").replace(/[a-z]+$/i,""),(String(n.max||"").match(/[a-z]+$/i)||[""])[0]);if(s!==null&&Math.abs(s-o)<=Ri)return n.handle}return""}function ke(t){let e="",o=0;for(;o<t.length;){const n=Se(t,o);if(n!==o){e+=" ".repeat(n-o),o=n;continue}e+=t[o],o+=1}return e}function Se(t,e){if(t.startsWith("/*",e)){const o=t.indexOf("*/",e+2);return o===-1?t.length:o+2}if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?t.length:o+2}if(t[e]==='"'||t[e]==="'"){const o=t[e];for(let n=e+1;n<t.length;n+=1)if(t[n]==="\\")n+=1;else if(t[n]===o)return n+1;return t.length}return e}function we(t){const e=String(t||""),o=[],n=(s,r,a=0)=>{let l=s,c=l;for(;l<r;){const d=Se(e,l);if(d!==l){l=d;continue}if(e[l]===";"){l+=1,c=l;continue}if(e[l]==="}")return;if(e[l]!=="{"){l+=1;continue}const f=ke(e.slice(c,l)),h=f.trim(),p=Xn(e,l,r);if(p===-1)return;/^@media\b/i.test(h)?o.push({query:h.replace(/^@media\s*/i,"").trim(),from:c+f.search(/\S/),to:p+1,bodyFrom:l+1,bodyTo:p,depth:a}):/^@(?:import|charset|use)\b/i.test(h)||n(l+1,p,a+1),l=p+1,c=l}};return n(0,e.length,0),o}function Xn(t,e,o){let n=0;for(let s=e;s<o;s+=1){const r=Se(t,s);if(r!==s){s=r-1;continue}if(t[s]==="{")n+=1;else if(t[s]==="}"&&(n-=1,n===0))return s}return-1}function Ft(t){const e=String(t||""),o=(n,s)=>{const r=[];let a=n,l=a;for(;a<s;){const c=Se(e,a);if(c!==a){a=c;continue}if(e[a]===";"){a+=1,l=a;continue}if(e[a]==="}")return r;if(e[a]!=="{"){a+=1;continue}const d=ke(e.slice(l,a)),f=d.trim(),h=Xn(e,a,s);if(h===-1)return r;r.push({prelude:f,media:/^@media\b/i.test(f),query:f.replace(/^@media\s*/i,"").trim(),from:l+d.search(/\S/),to:h+1,bodyFrom:a+1,bodyTo:h,children:/^@(?:import|charset|use)\b/i.test(f)?[]:o(a+1,h)}),a=h+1,l=a}return r};return o(0,e.length)}function Ni(t,e,o){const n=String(t||"");if(!o)return[];const s=(e||[]).find(d=>d.base),r=Ft(n),a=[],l=d=>d.media?ut(d.query,e)===o:d.children.some(l);if(s&&o===s.handle){const d=f=>{for(const h of f){if(h.media&&ut(h.query,e)){a.push({from:h.from,to:h.to});continue}d(h.children)}};return d(r),a}const c=(d,f,h)=>{const p=[];for(const k of d){if(k.media&&ut(k.query,e)===o){p.push({from:k.from,to:k.to,into:null});continue}l(k)&&p.push({from:k.from,to:k.to,into:k})}if(!p.length){h>f&&a.push({from:f,to:h});return}let x=f;for(const k of p)k.from>x&&a.push({from:x,to:k.from}),k.into&&c(k.into.children,k.into.bodyFrom,k.into.bodyTo),x=k.to;h>x&&a.push({from:x,to:h})};return c(r,0,n.length),a.filter(d=>n.slice(d.from,d.to).trim()!=="")}function qi(t,e){const o=String(t||""),n=[],s=a=>{for(const l of a){if((l.media&&ut(l.query,e)||/^#id-/.test(l.prelude))&&ke(o.slice(l.bodyFrom,l.bodyTo)).trim()===""){n.push(l);continue}s(l.children)}};if(s(Ft(o)),!n.length)return o;let r=o;for(const a of n.sort((l,c)=>c.from-l.from)){let l=a.from,c=a.to;const d=r.lastIndexOf(`
`,l-1)+1;for(r.slice(d,l).trim()===""&&(l=d);r[c]===" "||r[c]==="	";)c+=1;r[c]===`
`&&(c+=1),r=r.slice(0,l)+r.slice(c)}return r}function Vi(t,e){const o=String(t||""),n=[],s=a=>ke(o.slice(a.bodyFrom,a.bodyTo)).trim()==="",r=a=>{for(const l of a){if((l.media&&ut(l.query,e)||/^#id-/.test(l.prelude))&&s(l)){n.push({from:l.from,to:l.to});continue}r(l.children)}};return r(Ft(o)),n}function he(t,e,o){const n=e||[],s=n.find(d=>d.base),r=[],a=d=>/^#id-/.test(d.prelude)||/^#\s*$/.test(d.prelude),l=(d,f)=>{for(const h of d){if(!h.media){l(h.children,f);continue}const p=ut(h.query,n)||f;if(o===p){r.push(h);continue}l(h.children,p)}},c=(d,f)=>{for(const h of d){if(h.media){c(h.children,ut(h.query,n)||f);continue}if(a(h)){const p=f||(s?s.handle:"");!o||o===p?r.push(h):l(h.children,p);continue}c(h.children,f)}};return c(Ft(String(t||"")),""),r.sort((d,f)=>d.from-f.from)}function yo(t,e,o){return we(t).filter(n=>ut(n.query,e)===o)}const B=io({tag:"",scope:"",onTag:null,sizes:[],onSize:null,state:"",stateLabel:"",onState:null,canEdit:!1,note:""}),Ui={class:"sve-css-head"},Ki=["disabled"],Gi={key:1,class:"sve-css-scope"},Xi=["title","data-active","disabled","onClick"],Yi=["data-active","disabled"],Zi={key:2,class:"sve-css-note"},Ji={__name:"CodeDockCssHead",setup(t){return(e,o)=>(y(),b("div",Ui,[T(B).tag?(y(),b("button",{key:0,type:"button",class:"sve-css-tag",disabled:!T(B).canEdit,onClick:o[0]||(o[0]=L(()=>{},["prevent","stop"])),onDblclick:o[1]||(o[1]=L(n=>T(B).onTag?.(n),["prevent","stop"]))},"<"+A(T(B).tag)+">",41,Ki)):R("",!0),T(B).scope?(y(),b("span",Gi,A(T(B).scope),1)):R("",!0),(y(!0),b(O,null,q(T(B).sizes,n=>(y(),b("button",{key:n.key,type:"button","data-sve-css-size":"",title:n.title,"data-active":n.active?"":void 0,disabled:!T(B).canEdit,onClick:L(s=>T(B).onSize?.(n.key),["prevent","stop"])},A(n.label),9,Xi))),128)),v("button",{type:"button","data-sve-css-state":"","data-active":T(B).state?"":void 0,disabled:!T(B).canEdit,onClick:o[2]||(o[2]=L(n=>T(B).onState?.(n),["prevent","stop"]))},[Sn(A(T(B).stateLabel)+" ",1),o[3]||(o[3]=v("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[v("path",{d:"m6 9 6 6 6-6"})],-1))],8,Yi),o[4]||(o[4]=v("span",{class:"sve-css-gap"},null,-1)),T(B).note?(y(),b("span",Zi,A(T(B).note),1)):R("",!0)]))}},Qi=wn(Ji,[["__scopeId","data-v-43bc76ce"]]),tl={key:0,"data-sve-css-swatches":""},el=["data-sve-css-token","title","data-active","onClick"],ol={key:0,"data-sve-css-head-row":""},nl={key:1,"data-sve-css-note-row":""},sl=["data-sve-css-token","data-active","onClick"],rl={"data-sve-css-choice-label":""},al={key:0,"data-sve-css-choice-hint":""},ot={__name:"CodeDockMenu",props:{kind:{type:String,required:!0},swatches:{type:Array,default:()=>[]},choices:{type:Array,default:()=>[]},onClear:{type:Function,default:null},onPick:{type:Function,required:!0}},setup(t){return(e,o)=>t.kind==="colors"?(y(),b("div",tl,[v("button",{type:"button","data-sve-css-clear":"",title:"Clear",onClick:o[0]||(o[0]=L((...n)=>t.onClear&&t.onClear(...n),["prevent","stop"]))},[...o[1]||(o[1]=[v("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none",stroke:"currentColor","stroke-width":"1.5"},[v("path",{d:"M2 2l6 6M8 2L2 8"})],-1)])]),(y(!0),b(O,null,q(t.swatches,n=>(y(),b("button",{key:n.name,type:"button","data-sve-css-swatch":"","data-sve-css-token":n.name,title:n.name,"data-active":n.active?"":void 0,style:gr({background:n.hex||"transparent"}),onClick:L(s=>t.onPick(n.name),["prevent","stop"])},null,12,el))),128))])):(y(!0),b(O,{key:1},q(t.choices,n=>(y(),b(O,{key:n.value},[n.heading?(y(),b("span",ol,A(n.label),1)):n.note?(y(),b("span",nl,A(n.label),1)):(y(),b("button",{key:2,type:"button","data-sve-css-choice":"","data-sve-css-token":n.token||void 0,"data-active":n.active?"":void 0,onClick:L(s=>t.onPick(n.value),["prevent","stop"])},[v("span",rl,A(n.label),1),n.hint?(y(),b("span",al,A(n.hint),1)):R("",!0)],8,sl))],64))),128))}},il=/^\.[a-zA-Z_][\w-]*$/;function ll(t,e,o){return String(e||"").includes(o)?pe(t).length===1:!1}function pe(t){return Ft(t).filter(e=>/^@scope\b/i.test(e.prelude))}function cl(t){const e=String(t||"");return Ft(e).filter(o=>il.test(o.prelude)?!e.slice(o.from,o.bodyFrom-1).includes("{{"):!1).map(o=>({from:o.from,to:o.to,name:o.prelude.slice(1)}))}function dl(t,e,o){const n=String(t||"");if(!ll(n,e,o))return n;const s=cl(n);if(!s.length)return n;const r=pe(n)[0],a=hl(n,r),l=s.map(p=>pl(n.slice(p.from,p.to),n,p.from,a)).join(`

`);let c=n;for(const p of[...s].sort((x,k)=>k.from-x.from))c=fl(c,p.from,p.to);const d=ul(c,o);if(d===-1)return n;const f=(c.slice(0,d).match(/\n([^\S\n]*)$/)||[null,null])[1],h=f===null?d:d-f.length;return`${c.slice(0,h)}
${l}
${f??""}${c.slice(d)}`}function ul(t,e){const o=pe(t).find(n=>n.prelude.includes(e));return o?o.bodyTo:pe(t)[0]?.bodyTo??-1}function fl(t,e,o){let n=e,s=o;const r=t.lastIndexOf(`
`,n-1)+1;for(t.slice(r,n).trim()===""&&(n=r);t[s]===" "||t[s]==="	";)s+=1;return t[s]===`
`&&(s+=1),t.slice(0,n)+t.slice(s)}function hl(t,e){const o=t.slice(e.bodyFrom,e.bodyTo).match(/\n([^\S\n]+)\S/);return o?o[1]:`${(t.slice(0,e.from).match(/\n([^\S\n]*)$/)||[null,""])[1]}    `}function pl(t,e,o,n){const s=(e.slice(0,o).match(/\n([^\S\n]*)$/)||[null,""])[1];return t.split(`
`).map((r,a)=>a===0?n+r.trim():r.startsWith(s)?n+r.slice(s.length):n+r.trimStart()).join(`
`)}const ml={"data-sve-css-add-label":""},vl=["placeholder","onKeydown"],bo={__name:"CodeDockAddClass",props:{label:{type:String,required:!0},placeholder:{type:String,default:""},initial:{type:String,default:""},onAdd:{type:Function,required:!0}},setup(t){const e=t,o=ct(e.initial||""),n=ct(null);yn(()=>Ve(()=>{n.value?.focus(),n.value?.select()}));function s(){const r=o.value.trim();if(!r){n.value?.focus();return}e.onAdd(r)}return(r,a)=>(y(),b(O,null,[v("label",ml,A(t.label),1),bn(v("input",{ref_key:"input",ref:n,"data-sve-css-add-input":"","onUpdate:modelValue":a[0]||(a[0]=l=>o.value=l),type:"text",placeholder:t.placeholder,onKeydown:[Ct(L(s,["prevent"]),["enter"]),a[1]||(a[1]=Ct(L(()=>{},["stop"]),["escape"]))]},null,40,vl),[[xn,o.value]])],64))}};function Qo(t,e){e._sveLockBound||(e._sveLockBound=!0,e.querySelector("[data-sve-code-lock]")?.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),!(!e.lockReady||!e.lastType)){if(e.lastLocked){yl(t);return}Yn(t,!0)}}))}function xo(t){return t?J(t,ar)!=="0":!0}function gl(){const t=g.html;return!t||t.state.readOnly||!i.lastType?!1:!Co($o(),i.lastParts)}function ft(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-code-autosave]"),n=e?.querySelector("[data-sve-code-save]");if(!o||!n)return;const s=xo(t),r=gl();o.setAttribute("aria-pressed",s?"true":"false"),o.title=m(t,s?"code_dock_autosave_on":"code_dock_autosave_off"),o.setAttribute("aria-label",o.title),o.innerHTML=Od,n.hidden=s,n.title=m(t,"code_dock_save"),n.setAttribute("aria-label",n.title),n.innerHTML=Dd,r?n.setAttribute("data-dirty",""):n.removeAttribute("data-dirty")}function tn(t,e){e._sveAutosaveBound||(e._sveAutosaveBound=!0,e.querySelector("[data-sve-code-autosave]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=!xo(t);V(t,ar,n?"1":"0"),n?et(t.document):e.saveTimer&&(clearTimeout(e.saveTimer),e.saveTimer=null),ft(t)}),e.querySelector("[data-sve-code-save]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),et(t.document)}))}function yl(t){t.document.getElementById(G)?.remove();const e=yr(t.document,br,{title:m(t,"code_dock_unlock_title"),body:m(t,"code_dock_unlock_body"),buttons:[{value:"cancel",label:m(t,"cancel"),variant:"ghost"},{value:"ok",label:m(t,"code_dock_unlock_confirm"),variant:"primary"}],onPick:o=>{e.dismiss(),o==="ok"&&Yn(t,!1)}});e.host.id=G}function Yn(t,e){const o=i.lastType;if(!o)return;const n=()=>{i.lastType===o&&t.fetch("/!/sve/section-template/lock",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":_n(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:o,locked:e})}).then(async s=>{if(!s.ok)throw new Error(String(s.status));i.lastType===o&&(i.lastLocked=e,Et(t),te(i.lastParts,e),K(t),U(t.document,e?m(t,"code_dock_locked"):""))}).catch(()=>{U(t.document,m(t,"code_dock_error"))})};if(e&&(et(t.document),i.saveInFlight)){i.saveInFlight.finally(n);return}n()}function ko(t){if(!i.lastUid||!i.lastType||String(i.lastType).startsWith("view:")){Do(t);return}const e=kr(i.lastUid,t.document);Do(t,e.length?{sectionUids:e}:void 0)}function bl(t,e,o){return i.saveInFlight=t.fetch("/!/sve/section-template",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":_n(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:e,html:o.html,css:o.css,js:o.js,...typeof o.tw=="string"?{tw:o.tw}:{},...Rr(t)?{props:i.lastProps}:{}})}).then(async n=>{if(n.status===423){i.lastLocked=!0,i.lockReady=!0,Et(t),te(i.lastParts,!0),K(t),U(t.document,m(t,"code_dock_locked"));return}if(!n.ok)throw new Error(String(n.status));i.lastType===e&&(i.lastParts=o,U(t.document,m(t,"code_dock_saved")),ft(t),t.setTimeout(()=>{const s=t.document.getElementById(u)?.querySelector("[data-sve-code-status]");s&&s.textContent===m(t,"code_dock_saved")&&(s.textContent="")},1800)),ko(t),t.document.getElementById("__sve-section-picker")?.dispatchEvent(new t.CustomEvent("sve-library-stale"))}).catch(()=>{U(t.document,m(t,"code_dock_error"))}).finally(()=>{i.saveInFlight=null}),i.saveInFlight}function et(t){i.saveTimer&&(clearTimeout(i.saveTimer),i.saveTimer=null);const e=i.lastType,o=i.lastWin,n=g.html;if(!n||n.state.readOnly||!e||!o)return;const s=$o(),r=i.twCss!==null&&Tn(o)&&Zn(s.html)===i.twKey;Co(s,i.lastParts)&&!(r&&i.twDirty)&&!i.propsDirty||(i.propsDirty=!1,r&&(s.tw=i.twCss,i.twDirty=!1),U(t,m(o,"code_dock_saving")),bl(o,e,s))}function Zn(t){return sa(t).sort().join(" ")}function xl(){i.twCss=null,i.twKey="",i.twDirty=!1}function Jn(t,e){if(!t||!Tn(t))return;const o=Zn(e);o===i.twKey||i.twBusy||(i.twBusy=!0,xr(()=>import("./tw-compile-DjrKc54-.js"),__vite__mapDeps([0,1]),import.meta.url).then(n=>n.compileTailwind(t,e)).then(n=>{i.twBusy=!1,i.twCss=n,i.twKey=o,i.twDirty=!0,Qn(t,t.document)}).catch(n=>{i.twBusy=!1,console.error("[sve] tailwind compile",n)}))}function Qn(t,e){i.saveTimer&&clearTimeout(i.saveTimer),i.saveTimer=t.setTimeout(()=>{i.saveTimer=null,et(e)},Bd)}function nt(t){if(i.applying)return;const e=$o();if(Co(e,i.lastParts)){ft(t);return}if(ft(t),Jn(t,e.html),!xo(t)){U(t.document,m(t,"code_dock_unsaved"));return}U(t.document,m(t,"code_dock_saving")),Qn(t,t.document)}function ts(t){const e=i.lastUid,o=typeof tt=="function"?tt(t.document):[];for(const n of o){const s=xt(n.values)||n.values;if(!(!s||typeof s!="object")&&e&&typeof zo=="function"){const r=zo(s,e);if(r){const a=r.split("."),l=Sr(s,a.slice(0,2).join("."));if(l&&typeof l=="object")return l}}}for(const n of o){const s=xt(n.values)||n.values;if(s&&typeof s=="object")return s}return null}function es(t,e){!e||e===i.lastType||(et(t.document),Pe(t,e,"push"))}function os(t){const e=i.typeStack.pop();if(!e){Yt(t);return}et(t.document),Pe(t,e,"keep")}function Et(t){const e=t.document.getElementById(u),o=e?.querySelector("[data-sve-code-lock]"),n=e?.querySelector("[data-sve-code-lock-banner]");if(!e||!o)return;const s=e.lastLocked;e.toggleAttribute("data-sve-code-locked",s),s&&(An(t.document),rt(t.document),e.htmlPartialUi&&(e.htmlPartialUi.setHover(g.html,null),e.htmlPartialUi.setHover(g.css,null)),e.htmlClassTokenUi?.setHover(g.html,null)),o.hidden=!e.lockReady,o.setAttribute("aria-pressed",e.lastLocked?"true":"false"),o.title=m(t,e.lastLocked?"code_dock_unlock":"code_dock_lock"),o.setAttribute("aria-label",o.title),o.innerHTML=e.lastLocked?Ld:Fd,n&&(n.textContent=m(t,"code_dock_locked_banner"))}function Zt(t){return t?J(t,ze)!=="0":i.htmlScopePref}function _e(t,e,o){return t!=null&&e!=null&&t>=0&&e>t&&e<=o}function $e(){const t=g.html?.state.doc.toString()??"";if(!i.htmlScopeActive||!i.htmlFocus){i.htmlFull=t;return}if(i.htmlFocus.from<0||i.htmlFocus.from>i.htmlFull.length||i.htmlFocus.to<i.htmlFocus.from){i.htmlScopeActive=!1,i.htmlFull=t,i.htmlFocus=null;return}i.htmlFull=i.htmlFull.slice(0,i.htmlFocus.from)+t+i.htmlFull.slice(i.htmlFocus.to),i.htmlFocus={from:i.htmlFocus.from,to:i.htmlFocus.from+t.length}}function It(){return $e(),i.htmlScopeActive?i.htmlFull:g.html?.state.doc.toString()??i.lastParts.html??""}function Ce(){i.lastBracketNames=be(It()).map(t=>t.name)}function Pt(){i.lastCssSelectorNames=On(g.css?.state.doc.toString()??i.cssFull)}function ns(t,e){return Array.isArray(t)&&Array.isArray(e)&&t.length===e.length&&t.every((o,n)=>o===e[n])}function kl(){const t=i.htmlScopeActive?So():It(),e=xe(t);e.length&&(i.cssFull=vo(i.cssFull,mo(i.cssFull,e),e[0].className))}function ss(t,e){i.cssFull=ka(i.cssFull,t,e),kl(),i.cssFull=Sa(i.cssFull,e,t)}function Sl(t){if(i.applying||i.lastLocked||i.lastBracketNames==null)return;const e=be(It()).map(o=>o.name);ns(i.lastBracketNames,e)||(ss(i.lastBracketNames,e),i.lastBracketNames=e,Jt(),Pt())}function wl(){if(i.applying||i.lastLocked||i.lastCssSelectorNames==null||i.lastBracketNames==null||i.cssPane==="empty")return;const t=g.html,e=On(g.css?.state.doc.toString()??"");if(!t||ns(i.lastCssSelectorNames,e))return;const o=new Set(i.lastBracketNames),{renamed:n,removed:s}=Dn(i.lastCssSelectorNames,e);let r=t.state.doc.toString();const a=r;for(const l of n){const c=kt(l.to);!o.has(l.from)||!c||(r=Vo(r,d=>d===l.from?c:d))}for(const l of s)!o.has(l)||e.includes(l)||(r=Vo(r,c=>c===l?"":c));if(r!==a){i.applying=!0;try{Ae(r)}finally{i.applying=!1}}Ce(),i.lastCssSelectorNames=e}function _l(t,e){const o=kt(e),n=g.html;if(!o||!n||n.state.readOnly||o===t.name)return;i.applying=!0;try{n.dispatch({changes:{from:t.from,to:t.to,insert:o}})}finally{i.applying=!1}const s=i.lastBracketNames==null?[]:i.lastBracketNames.slice();Ce(),ss(s,i.lastBracketNames),Jt(),Pt(),i.lastWin&&(nt(i.lastWin),P(i.lastWin))}function $l(t,e){const o=t.document,s=g.html?.coordsAtPos(e.from);w(o),rt(o);const r=o.createElement("div"),a={getBoundingClientRect:()=>({left:s?.left??12,right:s?.right??12,top:s?.top??12,bottom:s?.bottom??12,width:0,height:0})};r.id=$,o.body.appendChild(r),j(t,a,r),r._sveApp=W(bo,r,{label:m(t,"code_dock_css_rename_class"),placeholder:m(t,"code_dock_css_class_placeholder"),initial:e.name,onAdd:l=>{_l(e,l),w(o)}})}function rs(){return i.htmlScopePref&&_e(i.htmlFocus?.from,i.htmlFocus?.to,i.htmlFull.length)?(i.htmlScopeActive=!0,i.htmlFull.slice(i.htmlFocus.from,i.htmlFocus.to)):(i.htmlScopeActive=!1,i.htmlFull)}function Te(t,e,o){const n=g[t];if(!n)return;const s=n.state.doc.toString();i.applying=!0;try{s!==e?n.dispatch({changes:{from:0,to:s.length,insert:e},...o?{selection:o,scrollIntoView:!0}:{}}):o&&n.dispatch({selection:o,scrollIntoView:!0})}finally{i.applying=!1}}function Ae(t,e){Te("html",t,e)}function So(){return i.htmlScopeActive?g.html?.state.doc.toString()??"":_e(i.htmlFocus?.from,i.htmlFocus?.to,i.htmlFull.length)?i.htmlFull.slice(i.htmlFocus.from,i.htmlFocus.to):""}function lt(){const t=g.css?.state.doc.toString()??"";if(i.cssPane==="tree"){if(t===i.cssScopeSnapshot)return;const e=xe(So())[0]?.className||Rn(t);i.cssFull=vo(i.cssFull,t,e),i.cssScopeSnapshot=t}else i.cssPane==="full"&&(i.cssFull=t)}function as(t,e){for(const o of e||[])if(!X(t,o.className)||as(t,o.children))return!0;return!1}function Jt(){let t=i.cssFull,e=[],o=!1;i.cssValues||!i.htmlScopePref||!i.htmlScopeActive?(i.cssPane="full",t=i.cssFull):(e=xe(So()),e.length?(i.cssPane="tree",t=mo(i.cssFull,e),as(i.cssFull,e)&&(i.cssFull=vo(i.cssFull,t,e[0].className),o=!0)):(i.cssPane="empty",t="")),i.cssScopeSnapshot=t,Te("css",t),Pt(),i.lastWin&&(oe(i.lastWin,!0),P(i.lastWin),o&&nt(i.lastWin))}function wo(t){const e=g.html;if(!e||!i.htmlFocus)return;i.htmlScopeActive||(i.htmlFull=e.state.doc.toString());const o=i.htmlFull.length,n=Math.max(0,Math.min(i.htmlFocus.from,o)),s=Math.max(n,Math.min(i.htmlFocus.to,o));if(s<=n)return;i.htmlFocus={from:n,to:s},i.htmlScopeActive=!0;const r=t==null?0:Math.max(0,Math.min(t-n,s-n));Ae(i.htmlFull.slice(n,s),{anchor:r,head:r}),Jt(),e.focus()}function _o(t=!0,e=null){const o=g.html;if(!o)return;lt(),$e(),i.htmlScopeActive=!1;const n=i.htmlFull||o.state.doc.toString(),s=e!=null?{anchor:Math.max(0,Math.min(e,n.length))}:t&&_e(i.htmlFocus?.from,i.htmlFocus?.to,n.length)?{anchor:i.htmlFocus.from,head:i.htmlFocus.to}:null;i.htmlFull=n,Ae(n,s),i.cssPane="full",i.cssScopeSnapshot=i.cssFull,Te("css",i.cssFull),Pt()}function Me(){i.htmlFocus=null,i.htmlScopeActive=!1,i.htmlFull="",i.cssFull="",i.cssPane="full",i.cssScopeSnapshot="",i.lastBracketNames=null,i.lastCssSelectorNames=null}let Ut=!1;function At(t){return!!t?.document.getElementById(Cn)}function Ge(t,e){if(!(!t||lo(t,"html_tree")===!1)){if(!e){At(t)&&$n(t);return}At(t)||(Ut=!0,wr("html_tree").then(()=>{At(t)||_r(t)}).catch(()=>{}).finally(()=>{Ut=!1,K(t)}))}}function K(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-html-scope]");if(!e)return;i.htmlScopePref=Zt(t);const o=lo(t,"html_tree")===!1?i.htmlScopePref:At(t)||Ut;e.setAttribute("aria-pressed",o?"true":"false"),e.title=m(t,o?"code_dock_html_scope_off":"code_dock_html_scope"),e.setAttribute("aria-label",e.title),e.innerHTML=cr,t.document.getElementById(u)?.toggleAttribute("data-sve-html-scoped",i.htmlScopeActive)}function en(t,e){e._sveHtmlScopeBound||(e._sveHtmlScopeBound=!0,e.htmlScopePref=Zt(t),Cl(t,e),Ge(t,e.htmlScopePref),e.querySelector("[data-sve-html-scope]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=At(t)||Ut;e.htmlScopePref=!n,V(t,ze,e.htmlScopePref?"1":"0"),e.htmlScopePref?e.htmlFocus&&(lt(),wo()):e.htmlScopeActive&&_o(),Ge(t,e.htmlScopePref),K(t)}))}function Cl(t,e){e._sveTreeWatchBound||(e._sveTreeWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>{if(Ut||lo(t,"html_tree")===!1||!t.document.getElementById(u))return;const o=At(t);o!==Zt(t)&&(e.htmlScopePref=o,V(t,ze,o?"1":"0"),o?e.htmlFocus&&(lt(),wo()):e.htmlScopeActive&&_o(),K(t))}))}const Tl=new Set(["pre","textarea","script","style"]),Al=/^(<\/|\{\{\s*\/)/;function Ml(t){let e=0;for(const o of t.split(`
`)){if(!o.trim())continue;const n=o.length-o.trimStart().length;n>0&&(e===0||n<e)&&(e=n)}return" ".repeat(e===2||e===3?e:4)}function El(t){const e=String(t||"");if(!e.trim())return e;const o=[],n=l=>{for(const c of l||[])o.push(c),n(c.children)};n(jr(e));const s=Ml(e),r=[];let a=0;for(const l of e.split(`
`)){const c=a,d=l.trim();if(a+=l.length+1,!d){r.push("");continue}const f=c+(l.length-l.trimStart().length),h=o.filter(x=>x.from<f&&f<x.to);if(h.some(x=>Tl.has(x.tag))){r.push(l);continue}const p=h.length-(Al.test(d)?1:0);r.push(s.repeat(Math.max(p,0))+d)}return r.join(`
`)}function is(t,e){if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?t.length:o+2}if(t.startsWith("<!--",e)){const o=t.indexOf("-->",e+4);return o===-1?t.length:o+3}return e}function Xe(t,e){if(t[e]!=="<")return null;const o=t.indexOf(">",e+1);if(o===-1)return null;const n=t.slice(e,o+1),s=n.match(/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/);if(s)return{kind:"close",name:s[1].toLowerCase(),from:e,to:o+1};const r=n.match(/^<([A-Za-z][A-Za-z0-9:-]*)/);if(!r)return{kind:"other",from:e,to:o+1};const a=r[1].toLowerCase();return{kind:/\/\s*>$/.test(n)||["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"].includes(a)?"void":"open",name:a,from:e,to:o+1}}function on(t,e,o){let n=1,s=o;for(;s<t.length;){const r=is(t,s);if(r!==s){s=r;continue}if(t[s]!=="<"){s+=1;continue}const a=Xe(t,s);if(!a)break;if(a.kind==="open"&&a.name===e)n+=1;else if(a.kind==="close"&&a.name===e&&(n-=1,n===0))return a;s=a.to}return null}function Qt(){const t=g.html;if(!t)return null;const e=t.state.selection.main.head,o=t.state.doc.toString(),n=[];let s=0;for(;s<e;){const c=is(o,s);if(c!==s){s=c;continue}if(o[s]!=="<"){s+=1;continue}const d=Xe(o,s);if(!d||d.from>=e)break;if(d.kind==="open")n.push(d);else if(d.kind==="close"){for(let f=n.length-1;f>=0;f-=1)if(n[f].name===d.name){n.splice(f);break}}s=d.to}const r=o.lastIndexOf("<",Math.max(0,e-1));if(r!==-1&&o.indexOf(">",r)>=e){const c=Xe(o,r);if(c?.kind==="open"||c?.kind==="void"){const d=c.kind==="void"?null:on(o,c.name,c.to);return d?{name:c.name,open:c,close:d}:{name:c.name,open:c,close:null}}}const a=n[n.length-1];if(!a)return null;const l=on(o,a.name,a.to);return{name:a.name,open:a,close:l}}function Ye(t){return dr.includes(t)}function N(){g.html?.focus(),i.lastWin&&(nt(i.lastWin),Ee(i.lastWin))}function gt(t,e,o){const n=[...e].sort((s,r)=>r.from-s.from||r.to-s.to);t.dispatch({changes:n,selection:o})}function Bt(t,e,o){const n=g.html;if(!n||n.state.readOnly)return;const s=n.state.selection.main.head,r=n.state.doc.lineAt(s),a=r.text.slice(0,s-r.from),l=r.text.trim()?it(r.text):Le(n,r)||it(r.text);let c=t,d=0;if(a.trim()!=="")c=`
${l}${t}`,d=1+l.length;else if(!r.text.trim()){c=`${l}${t}`,d=l.length,n.dispatch({changes:{from:r.from,to:r.to,insert:c},selection:nn(r.from+d+e,o)});return}n.dispatch({changes:{from:s,to:n.state.selection.main.to,insert:c},selection:nn(s+d+e,o)})}function nn(t,e){return e?{anchor:t,head:t+e}:{anchor:t}}const Bl=new Set(["section","article","header","footer","main","nav","aside"]);function sn(t){if(t!=="section")return`<${t}>`;const e=i.lastWin?.Statamic?.$config?.get?.("sveSectionTag");return typeof e=="string"&&e.trim()?`<${t} ${e.trim()}>`:`<${t}>`}function ls(){const t=g.html;if(!t||t.state.readOnly)return;const e=t.state.doc.toString(),o=(e.match(/^[ \t]*/)||[""])[0],n=El(e).split(`
`).map(s=>s&&o+s).join(`
`);n!==e&&(gt(t,[{from:0,to:e.length,insert:n}],{anchor:0}),N())}function cs(t){const e=g.html;if(!e||e.state.readOnly)return;const o=e.state.selection.main,n=e.state.doc.toString();if(!o.empty){const l=n.slice(o.from,o.to),c=l.match(new RegExp(`^<${t}(\\s[^>]*)?>([\\s\\S]*)</${t}>$`,"i"));if(c){gt(e,[{from:o.from,to:o.to,insert:c[2]}],{anchor:o.from,head:o.from+c[2].length}),N();return}const d=sn(t);let f=`${d}${l}</${t}>`,h=o.from+d.length;t==="ul"&&(f=`<ul>
  <li>${l}</li>
</ul>`,h=o.from+11),gt(e,[{from:o.from,to:o.to,insert:f}],{anchor:h,head:h+l.length}),N();return}const s=Qt();if(s?.open&&s.close){if(s.name===t){gt(e,[{from:s.close.from,to:s.close.to,insert:""},{from:s.open.from,to:s.open.to,insert:""}],{anchor:s.open.from}),N();return}if(Ye(s.name)&&Ye(t)){const l=n.slice(s.open.from,s.open.to).replace(new RegExp(`^<${s.name}`,"i"),`<${t}`);gt(e,[{from:s.close.from,to:s.close.to,insert:`</${t}>`},{from:s.open.from,to:s.open.to,insert:l}],{anchor:s.open.from+t.length+1}),N();return}}const a=(e.state.doc.lineAt(o.head).text.match(/^\s*/)||[""])[0];if(t==="ul"){const l=`<ul>
${a}  <li></li>
${a}</ul>`;Bt(l,`<ul>
${a}  <li>`.length)}else{const l=sn(t),c=`${l}</${t}>`;Bt(c,Bl.has(t)?l.length:c.length)}N()}function Ee(t){try{Ll(t)}catch{}}function Ll(t){const e=t?.document?.getElementById(u),n=Qt()?.name||"";if(e)for(const s of ro){const r=e.querySelector(`[data-sve-html-tool="${s.id}"]`);if(!r)continue;(s.id==="heading"?Ye(n):n===s.tag)?r.setAttribute("data-active",""):r.removeAttribute("data-active")}}function rn(t,e,o){const n=t.document,s=Qt()?.name||"";w(n),e.setAttribute("data-open","");const r=n.createElement("div");r.id=$,n.body.appendChild(r),j(t,e,r),r._sveApp=W(ot,r,{kind:"choices",choices:o.map(a=>({value:a,label:a.toUpperCase(),active:s===a})),onPick:a=>{cs(a),w(n)}})}function Fl(t,e){const o=t.document;w(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=$,o.body.appendChild(n),j(t,e,n);const s=r=>{o.getElementById($)&&(n._sveApp?.unmount(),n._sveApp=W(ot,n,{kind:"choices",choices:r,onPick:a=>{a&&(Bt(a,a.length),N()),w(o)}}),j(t,e,n))};s([{value:"",label:m(t,"code_dock_loading")}]),t.fetch("/!/sve/components",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(r=>r.ok?r.json():{items:[]}).then(r=>{const a=Array.isArray(r.items)?r.items:[];s(a.length?a.map(l=>({value:l.tag,label:l.name})):[{value:"",label:m(t,"component_none")}])}).catch(()=>s([{value:"",label:m(t,"component_none")}]))}function Il(t){const e=kt(t),o=g.html,n=g.css;if(!e||o?.state.readOnly||n?.state.readOnly)return;const s=Qt();if(s?.open&&o){const r=o.state.doc.sliceString(s.open.from,s.open.to),a=fa(r,e);a!==r&&o.dispatch({changes:{from:s.open.from,to:s.open.to,insert:a}})}lt(),X(i.cssFull,e)||(i.cssFull=`${String(i.cssFull||"").trimEnd()}${i.cssFull?.trim()?`
`:""}.${e} {
}
`),Jt(),Ce(),Pt(),i.lastWin&&(nt(i.lastWin),Ee(i.lastWin),P(i.lastWin))}function Pl(t,e){const o=t.document;if(e.hasAttribute("data-open")){w(o);return}w(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=$,o.body.appendChild(n),j(t,e,n),n._sveApp=W(bo,n,{label:m(t,"code_dock_css_class_name"),placeholder:m(t,"code_dock_css_class_placeholder"),onAdd:s=>{Il(s),w(o)}})}function Ol(t,e){const o=e.querySelector("[data-sve-css-add-class]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=zd,o.title=m(t,"code_dock_css_add_class"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),e.styleMode==="tw"){w(t.document),Wr(t,o);return}Pl(t,o)}))}function $o(){const t={html:"",css:"",js:""};$e(),lt();for(const e of at)e==="html"?t.html=i.htmlScopeActive?i.htmlFull:g.html?.state.doc.toString()??"":e==="css"?(t.css=i.lastWin?qi(i.cssFull,pt(i.lastWin)):i.cssFull,t.css=dl(t.css,t.html,Ad)):t[e]=g[e]?.state.doc.toString()??"";return t}function ds(){if(i.cssValues||!(i.htmlScopePref&&_e(i.htmlFocus?.from,i.htmlFocus?.to,i.htmlFull.length)))return i.cssPane="full",i.cssScopeSnapshot=i.cssFull,i.cssFull;const t=xe(i.htmlFull.slice(i.htmlFocus.from,i.htmlFocus.to));if(!t.length)return i.cssPane="empty",i.cssScopeSnapshot="","";i.cssPane="tree";const e=mo(i.cssFull,t);return i.cssScopeSnapshot=e,e}function te(t,e){i.applying=!0;try{i.lastWin&&(i.htmlScopePref=Zt(i.lastWin)),i.htmlFull=t.html??"",i.cssFull=t.css??"";for(const o of at){const n=g[o];let s=t[o]??"";try{s=o==="html"?rs():o==="css"?ds():s}catch{s=o==="html"?i.htmlFull||t.html||"":o==="css"?i.cssFull||t.css||"":s}if(!n)continue;const r=n.state.doc.toString(),a=[qt[o].reconfigure(ve.readOnly.of(!!e)),Vt[o].reconfigure(Y.editable.of(!e))];r!==s?n.dispatch({changes:{from:0,to:r.length,insert:s},effects:a}):n.dispatch({effects:a})}}finally{i.applying=!1}Ce(),Pt(),co("dock:html-changed"),i.lastWin&&(P(i.lastWin),Ee(i.lastWin),K(i.lastWin),se(i.lastWin))}function Co(t,e){return t.html===e.html&&t.css===e.css&&t.js===e.js}function us(t){return String(t||"").replace(/\/\*[\s\S]*?\*\//g,"").trim().replace(/\s*:\s*/g,": ").replace(/\s*;\s*/g,";").replace(/\s+/g," ").replace(/;+$/,";")}function fs(t){const e=us(t).match(/^([a-z-]+)\s*:/i);return e?e[1].toLowerCase():""}function hs(t){const e=us(t),o=e.indexOf(":");return o===-1?"":e.slice(o+1).replace(/;$/,"").trim().toLowerCase()}function D(t){const e=String(t||"").trim().toLowerCase();return e==="start"||e==="flex-start"||e==="left"||e==="top"?"flex-start":e==="end"||e==="flex-end"||e==="right"||e==="bottom"?"flex-end":e==="row-reverse"?"row-reverse":e==="column-reverse"?"column-reverse":e}function Kt(t){const e=D(t);return e==="flex"||e==="inline-flex"}function Be(){const t=g.css;if(!t)return null;const e=t.state.selection.main.head,o=t.state.doc.toString(),n=[],s=[];for(let a=0;a<o.length;a+=1){if(o[a]==="{"&&o[a+1]==="{"){const l=o.indexOf("}}",a+2);if(l===-1)break;a=l+1;continue}if(o[a]==="{")n.push(a);else if(o[a]==="}"){const l=n.pop();l!=null&&s.push({from:l+1,to:a,text:o.slice(l+1,a),open:l})}}let r=null;for(const a of s)e<a.open||e>a.to||(!r||a.to-a.open<r.to-r.open)&&(r=a);return r}function Dl(t){const e=String(t||"");let o="",n=0;for(let s=0;s<e.length;s+=1){if(e[s]==="{"&&e[s+1]==="{"){const r=e.indexOf("}}",s+2);if(r===-1)break;n===0&&(o+=e.slice(s,r+2)),s=r+1;continue}if(e[s]==="{"){n+=1;continue}if(e[s]==="}"){n=Math.max(0,n-1);continue}n===0&&(o+=e[s])}return o}function an(t){const e={};for(const o of Dl(t).split(";")){const n=fs(o);n&&(e[n]=hs(`${o};`))}return e}function zl(t,e,o){if(!e||e.from>=e.to)return null;let n=t.state.doc.lineAt(e.from),s=0;for(;n.from<=e.to;){const r=Math.max(n.from,e.from),a=Math.min(n.to,e.to),l=t.state.doc.sliceString(r,a);if(s===0&&fs(l)===o)return{from:r,to:a,text:l};if(s+=Hl(l),n.to>=t.state.doc.length||n.to>=e.to)break;n=t.state.doc.lineAt(n.to+1)}return null}function Hl(t){let e=0;const o=String(t);for(let n=0;n<o.length;n+=1){if(o[n]==="{"&&o[n+1]==="{"){const s=o.indexOf("}}",n+2);n=s===-1?o.length:s+1;continue}o[n]==="{"?e+=1:o[n]==="}"&&(e-=1)}return e}function it(t){return(String(t).match(/^\s*/)||[""])[0]}function Le(t,e,o){for(let n=e.number-1;n>=1;n-=1){const s=t.state.doc.line(n),r=s.text.trim();if(!r)continue;const a=it(s.text);if(o&&(r==="{"||r.endsWith("{")))return`${a}  `;if(!(r==="}"||r.startsWith("}")))return a}return""}function Rl(t,e){const o=t.state.doc.lineAt(e);if(o.text.trim())return it(o.text);const n=Le(t,o,!0);if(n)return n;const s=Be();return s?ps(t,s):"  "}function ps(t,e){const o=t.state.doc.lineAt(e.from),n=t.state.doc.lineAt(Math.max(e.from,e.to));for(let r=n.number;r>=o.number;r-=1){const a=t.state.doc.line(r),l=Math.max(a.from,e.from),c=Math.min(a.to,e.to),d=t.state.doc.sliceString(l,c);if(d.trim())return(d.match(/^\s*/)||[""])[0]||"  "}return`${(t.state.doc.lineAt(Math.max(0,e.from-1)).text.match(/^\s*/)||[""])[0]}  `}function ln(){g.css?.focus(),i.lastWin&&(nt(i.lastWin),P(i.lastWin))}function ms(t,e){if(!e)return"";const o=t.state.doc.toString();let n=0;for(let s=e.open-1;s>=0;s-=1)if(o[s]==="}"||o[s]==="{"||o[s]===";"){n=s+1;break}return o.slice(n,e.open).replace(/\/\*[\s\S]*?\*\//g,"").trim()}function jl(t,e){if(!i.cssState||!e)return e;const o=vs(t,e);if(o)return o;const n=ms(t,e);if(!n||n.startsWith("@"))return e;const s=t.state.doc.toString(),r=yt(s,e.open),a=yt(s,e.to)||`${r}    `,l=(t.state.doc.sliceString(e.from,e.to).match(/\n([^\S\n]*)$/)||[null,null])[1],c=l===null?e.to:e.to-l.length,d=`
${a}&${Ie()} {
${a}}
${l??r}`;t.dispatch({changes:{from:c,to:e.to,insert:d}});const f=t.state.doc.toString(),h=f.indexOf("{",c+d.indexOf("&")),p=h===-1?-1:Lt(f,h);return p===-1?e:{from:h+1,to:p,text:f.slice(h+1,p),open:h}}function yt(t,e){const o=t.lastIndexOf(`
`,e-1)+1;return(t.slice(o,e).match(/^\s*/)||[""])[0]}function Z(t){const e=g.css;if(!e||e.state.readOnly||!t.length)return;const o=Be(),n=t.some(l=>l.value!=null)?jl(e,o):o;if(!n){const l=t.filter(c=>c.value!=null).map(c=>`${c.property}: ${c.value};`).join(`
`);l&&ql(l),ln();return}const s=[],r=[],a=ps(e,n);for(const l of t){const c=zl(e,n,l.property);if(l.value==null){if(!c)continue;let d=c.from,f=c.to;e.state.doc.sliceString(f,f+1)===`
`&&(f+=1),d=Math.max(d,n.from),f=Math.min(f,n.to),s.push({from:d,to:f});continue}if(!(c&&D(hs(c.text))===D(l.value)))if(c){const d=(c.text.match(/^\s*/)||[""])[0];s.push({from:c.from,to:c.to,insert:`${d}${l.property}: ${l.value};`})}else r.push(`${a}${l.property}: ${l.value};`)}if(r.length){const l=!n.text.includes(`
`)||!/\n\s*$/.test(n.text)?`
`:"",c=(n.text.match(/\n([^\S\n]*)$/)||[null,null])[1],d=c===null?n.to:n.to-c.length,f=c===null?"":c;s.push({from:d,to:n.to,insert:`${l}${r.join(`
`)}
${f}`})}s.length&&(s.sort((l,c)=>c.from-l.from||c.to-l.to),e.dispatch({changes:s})),ln()}function Q(){const t=g.css,e=Be();if(!e)return{};if(i.cssState&&t){const o=vs(t,e);return o?an(o.text):{}}return an(e.text)}function vs(t,e){const o=ms(t,e),n=Ie();if(!o||o.startsWith("@"))return null;if(o.endsWith(n))return e;const s=t.state.doc.toString(),r=a=>{const l=Lt(s,a);return l===-1?null:{from:a+1,to:l,text:s.slice(a+1,l),open:a}};for(const a of[`&${n}`,`${o}${n}`]){const l=new RegExp(`(^|[^\\w-])${a.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\s*\\{`,"g");let c;for(;c=l.exec(s);){const d=s.indexOf("{",c.index);if(a.startsWith("&")&&(d<e.from||d>e.to))continue;const f=r(d);if(f)return f}}return null}function Wl(t){const e=Q(),o=Kt(e.display),n=D(e["flex-direction"])||(o?"row":"");if(o&&n===t){const s=[];e["flex-direction"]&&s.push({property:"flex-direction",value:null}),Kt(e.display)&&s.push({property:"display",value:null}),Z(s);return}Z([{property:"display",value:"flex"},{property:"flex-direction",value:t}])}function Nl(t){const e=Q();if(t==="flex"&&Kt(e.display)){Z([{property:"justify-content",value:null},{property:"align-items",value:null},{property:"flex-direction",value:null},{property:"display",value:null}]);return}Z([{property:"display",value:t}])}function ql(t){const e=g.css;if(!e||e.state.readOnly)return;const o=e.state.selection.main.head,n=e.state.doc.lineAt(o),s=n.text.slice(0,o-n.from),r=n.text.slice(o-n.from),a=Rl(e,o),l=t.replace(/;?$/,";");if(s.trim()===""&&r.trim()===""){const d=`${a}${l}
${a}`;e.dispatch({changes:{from:n.from,to:n.to,insert:d},selection:{anchor:n.from+d.length}});return}const c=`
${a}${l}
${a}`;e.dispatch({changes:{from:o,to:e.state.selection.main.to,insert:c},selection:{anchor:o+c.length}})}function P(t){try{Vl(t),ne(t)}catch{}}function Vl(t){const e=i.styleMode==="tw",o=e?{}:Q(),n=Kt(e?Wo("display"):o.display),s=D(o["flex-direction"])||(n?"row":""),r=a=>e?Vr()&&!!a.tw&&!!Wo(a.tw):!!a.css&&a.css in o;dt.tools=fr.map(a=>{const l=(a.kids||[]).filter(c=>c.when!=="flex"||n).map(c=>({id:c.id,title:c.title,icon:gn[c.icon]||"",sep:!!c.sep,open:i.cssOpenMenu===c.id,active:e?r(c):c.kind==="display"?n:c.kind==="flexDir"?n&&s===c.value:c.value?D(o[c.css])===D(c.value):r(c)}));return{id:a.id,title:a.title,icon:gn[a.id]||Rd[a.id]||"",open:i.cssOpenTool===a.id||i.cssOpenMenu===a.id,kids:l,active:a.value?!e&&D(o[a.css])===D(a.value):r(a)||l.some(c=>c.active)}})}function w(t){const e=t?.getElementById($);i.cssOpenMenu="",e?._sveApp?.unmount(),e?.remove(),t?.querySelectorAll("[data-sve-css-tool][data-open], [data-sve-html-tool][data-open], [data-sve-css-add-class][data-open], [data-sve-code-history][data-open]").forEach(o=>o.removeAttribute("data-open"))}function pu(t){w(t),bt(t),rt(t);for(const e of at)g[e]&&Gs?.(g[e])}function gs(t){if(i.cssColorsPromise)return i.cssColorsPromise;const e=t.Statamic?.$config?.get?.("cpUrl")||`/${t.Statamic?.$config?.get?.("cpRoute")||"cp"}`;return i.cssColorsPromise=t.fetch(`${e}/color-scheme/swatches`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async o=>{if(!o.ok)return[];const n=await o.json().catch(()=>[]);return Array.isArray(n)?n:[]}).catch(()=>[]).then(o=>{const n=new Set,s=[];for(const r of o){const a=r.var||r.value||r.handle,l=String(a||"").trim().replace(/^var\((.+)\)$/,"$1");!l||n.has(l)||(n.add(l),s.push({name:l,hex:r.hex||r.color||""}))}for(const[r,a]of ur)n.has(r)||(n.add(r),s.push({name:r,hex:a}));return s}),i.cssColorsPromise}function ys(t,e){const o=Q()[e]||"",n=String(o).match(/^var\(\s*([^)]+?)\s*\)$/i),s=n?n[1].trim():"";for(const r of t.querySelectorAll("[data-sve-css-token]"))s&&r.getAttribute("data-sve-css-token")===s?r.setAttribute("data-active",""):r.removeAttribute("data-active")}function j(t,e,o){const n=e.getBoundingClientRect(),s=8;o.style.left=`${Math.max(s,Math.min(n.left,t.innerWidth-220))}px`,o.style.top=`${Math.max(s,n.bottom+4)}px`}function Ul(t,e,o){const n=t.document;w(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=$,n.body.appendChild(s),j(t,e,s);const r=a=>{s._sveApp?.unmount(),s._sveApp=W(ot,s,{kind:"colors",swatches:a,onClear:()=>{Z([{property:o,value:null}]),w(n)},onPick:l=>{Z([{property:o,value:`var(${l})`}]),w(n)}}),ys(s,o)};r(ur.map(([a,l])=>({name:a,hex:l}))),gs(t).then(a=>{n.getElementById($)&&r(a.map(l=>({name:l.name,hex:l.hex})))})}function Kl(t,e,o,n){const s=t.document;w(s),e.setAttribute("data-open","");const r=s.createElement("div"),a=Q()[o]||"";r.id=$,s.body.appendChild(r),j(t,e,r),r._sveApp=W(ot,r,{kind:"choices",choices:(n||[]).map(l=>({value:l,label:l,active:D(l)===D(a)})),onPick:l=>{const c=D(l)===D(Q()[o]||"");Z([{property:o,value:c?null:l}]),w(s)}})}function cn(t,e,o,n=[]){const s=t.document;w(s),e.setAttribute("data-open",""),Nr(t);const r=s.createElement("div");r.id=$,s.body.appendChild(r),j(t,e,r);const a=()=>{const l=[...n.map(d=>({value:d,label:d})),...qr(t,o).map(d=>({value:d.value,label:d.value}))],c=Q()[o]||"";r._sveApp?.unmount(),r._sveApp=W(ot,r,{kind:"choices",choices:l.map(d=>({...d,active:D(d.value)===D(c)})),onPick:d=>{Z([{property:o,value:d||null}]),w(s)}})};a(),gs(t).then(()=>{s.getElementById($)===r&&a()})}function Gl(t,e,o){const n=t.document;w(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=$,n.body.appendChild(s),j(t,e,s),s._sveApp=W(ot,s,{kind:"choices",choices:Hd.map(r=>({value:r,token:r,label:r})),onPick:r=>{Z([{property:o,value:`var(${r})`}]),w(n)}}),ys(s,o)}const We=/\{\{#[\s\S]*?#\}\}|\{\{[\s\S]*?\}\}/g;function dn(t,e,o){const n=new e.RangeSetBuilder,s=t.doc.toString();We.lastIndex=0;let r=We.exec(s);for(;r;){const a=r.index,l=a+r[0].length,c=r[0];n.add(a,l,c.startsWith("{{#")?o.comment:/^\{\{\s*\//.test(c)?o.close:o.tag),r=We.exec(s)}return n.finish()}function Xl(t){const e={tag:t.Decoration.mark({class:"sve-cm-antlers"}),close:t.Decoration.mark({class:"sve-cm-antlers sve-cm-antlers-close"}),comment:t.Decoration.mark({class:"sve-cm-antlers-comment"})};return{extensions:[t.StateField.define({create(n){return dn(n,t,e)},update(n,s){return s.docChanged?dn(s.state,t,e):n},provide:n=>t.EditorView.decorations.from(n)})]}}const E=io({tag:"",emptyText:"",addLabel:"",dropTitle:"",chips:[],states:[],canEdit:!1,onAdd:null,onChip:null,onDrop:null}),Yl={class:"sve-al"},Zl={class:"sve-al-head"},Jl={key:0,class:"sve-al-tag"},Ql=["title","disabled"],tc={key:0,class:"sve-al-empty"},ec={class:"sve-al-chips"},oc=["data-sve-al-chip","title","disabled","onClick"],nc={class:"sve-al-name"},sc={key:0,class:"sve-al-value"},rc=["title","onClick"],ac={__name:"AlpinePanel",setup(t){return(e,o)=>(y(),b("div",Yl,[v("div",Zl,[T(E).tag?(y(),b("span",Jl,"<"+A(T(E).tag)+">",1)):R("",!0),(y(!0),b(O,null,q(T(E).states,n=>(y(),b("span",{key:n,class:"sve-al-state"},A(n),1))),128)),o[1]||(o[1]=v("span",{class:"sve-al-gap"},null,-1)),v("button",{type:"button","data-sve-al-add":"",title:T(E).addLabel,disabled:!T(E).canEdit,onClick:o[0]||(o[0]=L(n=>T(E).onAdd?.(n),["prevent","stop"]))},"+",8,Ql)]),T(E).chips.length?R("",!0):(y(),b("div",tc,A(T(E).emptyText),1)),v("div",ec,[(y(!0),b(O,null,q(T(E).chips,n=>(y(),b("span",{key:n.id,class:"sve-al-chip-wrap"},[v("button",{type:"button","data-sve-al-chip":n.id,title:n.title,disabled:!T(E).canEdit,onClick:L(s=>T(E).onChip?.(s,n.id),["prevent","stop"])},[v("span",nc,A(n.name),1),n.value?(y(),b("span",sc,A(n.value),1)):R("",!0)],8,oc),T(E).canEdit?(y(),b("button",{key:0,type:"button",class:"sve-al-drop",title:T(E).dropTitle,onClick:L(s=>T(E).onDrop?.(n.id),["prevent","stop"])},"−",8,rc)):R("",!0)]))),128))])]))}},ic=wn(ac,[["__scopeId","data-v-15add965"]]),lc=[{id:"state",lang:"alpine_group_state"},{id:"act",lang:"alpine_group_act"},{id:"react",lang:"alpine_group_react"}],un=[{id:"state",group:"state",label:"alpine_state",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: false }"}]},{id:"state_text",group:"state",label:"alpine_state_text",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: '|' }"}]},{id:"toggle",group:"act",label:"alpine_toggle",icon:"toggle",needsName:!0,attrs:[{name:"@click",value:":name = !:name"}]},{id:"open",group:"act",label:"alpine_open",icon:"open",needsName:!0,attrs:[{name:"@click",value:":name = true"}]},{id:"close",group:"act",label:"alpine_close",icon:"close",needsName:!0,attrs:[{name:"@click",value:":name = false"}]},{id:"open_hover",group:"act",label:"alpine_open_hover",icon:"open",needsName:!0,attrs:[{name:"@mouseenter",value:":name = true"}]},{id:"close_leave",group:"act",label:"alpine_close_leave",icon:"close",needsName:!0,attrs:[{name:"@mouseleave",value:":name = false"}]},{id:"open_focus",group:"act",label:"alpine_open_focus",icon:"open",needsName:!0,attrs:[{name:"@focusin",value:":name = true"}]},{id:"close_blur",group:"act",label:"alpine_close_blur",icon:"close",needsName:!0,attrs:[{name:"@focusout",value:":name = false"}]},{id:"close_outside",group:"act",label:"alpine_close_outside",icon:"outside",needsName:!0,attrs:[{name:"@click.outside",value:":name = false"}]},{id:"close_escape",group:"act",label:"alpine_close_escape",icon:"escape",needsName:!0,attrs:[{name:"@keydown.escape.window",value:":name = false"}]},{id:"show",group:"react",label:"alpine_show",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"}]},{id:"show_smooth",group:"react",label:"alpine_show_smooth",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"},{name:"x-transition",value:""}]},{id:"hide_until_ready",group:"react",label:"alpine_hide_until_ready",icon:"cloak",attrs:[{name:"x-cloak",value:""}]},{id:"class_when",group:"react",label:"alpine_class_when",icon:"klass",needsName:!0,attrs:[{name:":class",value:":name ? '|' : ''"}]},{id:"text",group:"react",label:"alpine_text",icon:"text",needsName:!0,attrs:[{name:"x-text",value:":name"}]}];function cc(t){return(t?.attrs||[]).map(e=>e.name).join(" ")}const dc=/^(x-[\w:.-]+|@[\w:.-]+|:[\w-]+)$/;function uc(t){return dc.test(String(t||""))}function ee(t){const e=String(t||""),o=[],n=/([@:a-zA-Z_][\w:.@-]*)(\s*=\s*(["'])([\s\S]*?)\3)?/g;let s,r=!0;for(;s=n.exec(e);){if(r){r=!1;continue}s[0].trim()&&o.push({name:s[1],value:s[4]??"",from:s.index,to:s.index+s[0].length,alpine:uc(s[1])})}return o}function bs(t){const e=String(t||"").trim().replace(/^\{|\}$/g,""),o=[],n=/(^|,)\s*([a-zA-Z_$][\w$]*)\s*:/g;let s;for(;s=n.exec(e);)o.push(s[2]);return o}function fc(t,e){return t.map(o=>({name:o.name,value:String(o.value).replaceAll(":name:",`${e}:`).replaceAll(":name",e)}))}function To(t,e,o){const n=g.html,s=_t();if(!n||n.state.readOnly||!s)return;const r=i.htmlScopeActive&&!!i.htmlFocus,a=r?i.htmlFocus.from:0,c=(r?i.htmlFull:n.state.doc.toString()).slice(s.from,s.openTo),d=o===""?e:`${e}="${o}"`,f=ee(c).find(p=>p.name===e);let h;if(f)h=c.slice(0,f.from)+d+c.slice(f.to);else{const p=c.search(/\s|\/?>$/);h=p===-1?c:`${c.slice(0,p)} ${d}${c.slice(p)}`}h!==c&&(gt(n,[{from:s.from-a,to:s.openTo-a,insert:h}],null),Fe(t))}function hc(t,e){const o=g.html,n=_t();if(!o||o.state.readOnly||!n)return;const s=i.htmlScopeActive&&!!i.htmlFocus,r=s?i.htmlFocus.from:0,l=(s?i.htmlFull:o.state.doc.toString()).slice(n.from,n.openTo),c=ee(l).find(h=>h.name===e);if(!c)return;let d=c.from;for(;d>0&&/\s/.test(l[d-1]);)d-=1;const f=l.slice(0,d)+l.slice(c.to);gt(o,[{from:n.from-r,to:n.openTo-r,insert:f}],null),Fe(t)}function Ze(t){const e=g.html;if(!e)return[];const n=i.htmlScopeActive&&!!i.htmlFocus?i.htmlFull:e.state.doc.toString(),s=_t(),r=[],a=Mn(ye(n),new Set);for(const l of a){if(!s||l.from>s.from||l.to<s.to)continue;const c=ee(n.slice(l.from,l.openTo)).find(d=>d.name==="x-data");c&&r.push(...bs(c.value))}return[...new Set(r)]}function pc(t){const e=g.html,o=_t();if(!e||!o)return[];const s=i.htmlScopeActive&&!!i.htmlFocus?i.htmlFull:e.state.doc.toString(),r=ee(s.slice(o.from,o.openTo)).find(a=>a.name==="x-data");return r?bs(r.value):[]}function mc(t,e){const o=t.document;w(o),e.setAttribute("data-open","");const n=Ze(),s=o.createElement("div");s.id=$,o.body.appendChild(s),j(t,e,s);const r=!n.length,a=!r&&!pc().length,c=lc.filter(d=>d.id==="state"?!a:!r).flatMap(d=>{const f=un.filter(h=>h.group===d.id);return f.length?[{value:`\0${d.id}`,label:m(t,r&&d.id==="state"?"alpine_group_state_first":d.lang),heading:!0},...f.map(h=>({value:h.id,label:m(t,h.label),hint:cc(h)}))]:[]});r&&c.push({value:"\0note",label:m(t,"alpine_needs_state"),note:!0}),s._sveApp=W(ot,s,{kind:"choices",choices:c,onPick:d=>{const f=un.find(h=>h.id===d);if(w(o),!!f){if(!f.needsName){for(const h of f.attrs)To(t,h.name,h.value);return}vc(t,e,f,n)}}})}function vc(t,e,o,n){const s=t.document,r=l=>{const c=String(l||"").trim().replace(/[^\w$]/g,"");if(w(s),!!c)for(const d of fc(o.attrs,c))To(t,d.name,d.value.replace("|",""))};if(!n.length){Je(t,e,r);return}const a=s.createElement("div");a.id=$,s.body.appendChild(a),j(t,e,a),a._sveApp=W(ot,a,{kind:"choices",choices:[{value:"\0head",label:m(t,"alpine_name"),heading:!0},...n.map(l=>({value:l,label:l})),{value:"\0new",label:m(t,"alpine_new_name")}],onPick:l=>{if(l==="\0new"){Je(t,e,r);return}r(l)}})}function Je(t,e,o){const n=t.document;w(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=$,n.body.appendChild(s),j(t,e,s),s._sveApp=W(bo,s,{label:m(t,"alpine_name"),placeholder:m(t,"alpine_name_placeholder"),onAdd:r=>o(r)})}function Fe(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-alpine-host]");if(!o)return;const n=_t(),s=g.html,r=e.htmlScopeActive&&!!e.htmlFocus,a=s?r?e.htmlFull:s.state.doc.toString():"",l=n?ee(a.slice(n.from,n.openTo)):[];E.tag=n?.tag||"",E.canEdit=!e.lastLocked&&!!n,E.emptyText=m(t,n?Ze().length?"alpine_none_ready":"alpine_none":"alpine_pick"),E.addLabel=m(t,"alpine_add"),E.dropTitle=m(t,"alpine_remove"),E.states=Ze(),E.chips=l.filter(c=>c.alpine).map(c=>({id:c.name,name:c.name,value:c.value,title:c.value?`${c.name}="${c.value}"`:c.name})),E.onAdd=c=>mc(t,c.currentTarget),E.onDrop=c=>hc(t,c),E.onChip=(c,d)=>{E.chips.find(h=>h.id===d)&&Je(t,c.currentTarget,h=>To(t,d,h))},o._sveMounted||(o._sveMounted=!0,wt(o,ic))}function gc(){if(i.cssGhostUi)return i.cssGhostUi;const t=zt.mark({class:"sve-css-ghost"}),e=o=>{const n=new Dt;if(!i.lastWin)return n.finish();try{for(const s of Vi(o.doc.toString(),pt(i.lastWin)))n.add(s.from,s.to,t)}catch{}return n.finish()};return i.cssGhostUi=Ot.define({create:o=>e(o),update:(o,n)=>n.docChanged?e(n.state):o,provide:o=>Y.decorations.from(o)}),i.cssGhostUi}let le=null,me=null;function yc(){if(le)return le;me=De.define();const t=zt.line({class:"sve-css-id"}),e=o=>{const n=new Dt;if(!i.lastWin||!i.cssValues)return n.finish();try{const s=o.doc;for(const r of he(s.toString(),pt(i.lastWin),i.cssSize)){const a=s.lineAt(Math.min(r.from,s.length)).number,l=s.lineAt(Math.min(Math.max(r.to-1,r.from),s.length)).number;for(let c=a;c<=l;c+=1)n.add(s.line(c).from,s.line(c).from,t)}}catch{}return n.finish()};return le=Ot.define({create:o=>e(o),update:(o,n)=>n.docChanged||n.effects.some(s=>s.is(me))?e(n.state):o,provide:o=>Y.decorations.from(o)}),le}function Ao(){me&&g.css&&g.css.dispatch({effects:me.of(null)})}function bc(){return i.htmlPartialUi||(i.htmlPartialUi=Gr({Decoration:zt,StateField:Ot,StateEffect:De,RangeSetBuilder:Dt,EditorView:Y})),i.htmlPartialUi}function xc(){return i.htmlAntlersUi||(i.htmlAntlersUi=Xl({Decoration:zt,StateField:Ot,RangeSetBuilder:Dt,EditorView:Y})),i.htmlAntlersUi}function kc(){return i.htmlClassTokenUi||(i.htmlClassTokenUi=_a({Decoration:zt,StateField:Ot,StateEffect:De,RangeSetBuilder:Dt,EditorView:Y})),i.htmlClassTokenUi}function Sc(t,e,o){g[e]?.destroy();const n=oo.of([{key:"Mod-s",run:()=>(et(t.document),!0)}]);g[e]=new Y({state:ve.create({doc:"",extensions:[zs(),Hs(),Rs(),qs(),dd(e),Us(),Vs({tooltipClass:()=>"sve-tw-complete"}),...e==="html"?[Zs.data.of({autocomplete:Ur(t)}),Kr(Ys,t)]:[],...e==="html"?[...ra(),aa()]:[],...e==="css"?[er(),gc(),yc()]:[],oo.of([...js,...e==="html"?[{key:"Tab",run:ia}]:[],Ws,...Ns,...Xs,...Ks]),n,Y.lineWrapping,...e==="html"||e==="css"?bc().extensions:[],...e==="html"?xc().extensions:[],...e==="html"?kc().extensions:[],qt[e].of(ve.readOnly.of(!!i.lastLocked)),Vt[e].of(Y.editable.of(!i.lastLocked)),Y.updateListener.of(s=>{e==="html"&&s.docChanged&&!i.applying&&(Sl(),co("dock:html-changed")),e==="css"&&s.docChanged&&!i.applying&&wl(),s.docChanged&&nt(t),e==="css"&&(s.docChanged||s.selectionSet)&&P(t),e==="css"&&s.docChanged&&!i.applying&&oe(t),e==="html"&&(s.docChanged||s.selectionSet)&&(Ee(t),Fe(t),i.applying||se(t))}),...pr(C,{height:"auto",background:"#1E1E21",scroller:{overflow:"visible",height:"auto",minHeight:0},extraTags:s=>[{tag:s.tagName,color:"#4ec9b0"},{tag:s.attributeName,color:"#9cdcfe"},{tag:s.attributeValue,color:"#ce9178"},{tag:s.angleBracket,color:"#808080"}]})]}),parent:o})}function wc(t){if(!t||t.querySelector(".cm-editor"))return;t.replaceChildren();const e=t.ownerDocument.createElement("span");e.style.cssText="width:16px;height:16px;margin:12px;border:2px solid #858585;border-right-color:transparent;border-radius:50%;display:block;animation:sve-cm-wait .6s linear infinite",t.appendChild(e)}function pt(t){return uo(t).map(e=>({handle:e.handle,base:e.base,max:e.max,media:e.media,media_px:e.media_px,label:e.label}))}function xs(t,e){return pt(t).find(o=>o.handle===e)||null}function Ie(t=i.cssState){return t?t==="before"||t==="after"?`::${t}`:`:${t}`:""}function oe(t,e=!1){const o=g.css;if(!o||!no||!so)return;const n=o.state.doc.toString(),s=`${i.cssValues?"1":"0"}|${i.cssSize}|${we(n).map(f=>`${f.from}-${f.to}`).join(",")}`;if(!e&&s===i.cssFoldSig)return;i.cssFoldSig=s;const r=pt(t),a=new Map,l=[...Ni(n,r,i.cssSize),...i.cssValues?[]:he(n,r,i.cssSize).map(f=>({from:f.from,to:f.to}))];for(const f of l)f.to>f.from&&a.set(`${f.from}:${f.to}`,{from:f.from,to:f.to});const c=[],d=new Set;or(o.state).between(0,n.length,(f,h)=>{const p=`${f}:${h}`;d.add(p),!a.has(p)&&i.cssOwnFolds.has(p)&&c.push(so.of({from:f,to:h}))});for(const[f,h]of a)d.has(f)||c.push(no.of(h));i.cssOwnFolds=new Set(a.keys()),c.length&&o.dispatch({effects:c})}function Qe(t,e){const o=i.cssFull||e;return/max-width/i.test(o)&&!/width\s*</i.test(o)&&t.media_px||t.media}function _c(t,e){const o=g.css;if(!o||o.state.readOnly)return;const n=pt(t),s=xs(t,e),r=o.state.doc.toString();if(!s||s.base){const f=o.state.selection.main.head,h=we(r).find(p=>f>=p.from&&f<=p.to);h&&o.dispatch({selection:{anchor:h.from},scrollIntoView:!0});return}const a=yo(r,n,e);if(a.length){const f=a[0],h=Math.min(f.bodyTo,f.bodyFrom+(r.slice(f.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);o.dispatch({selection:{anchor:h},scrollIntoView:!0});return}const l=Qe(s,r),c=ks(o,r),d=`

${c.indent}@media ${l} {
${c.indent}    
${c.indent}}${c.suffix}`;o.dispatch({changes:{from:c.at,to:c.at,insert:d},selection:{anchor:c.at+d.lastIndexOf("    ")+4},scrollIntoView:!0})}function ks(t,e){const o=we(e);if(o.length){const a=o[o.length-1];return{at:a.to,indent:yt(e,a.from),suffix:""}}const n=a=>({at:a.to,indent:yt(e,a.to)||`${yt(e,a.open)}    `,suffix:`
${yt(e,a.open)}`}),s=Be();if(s)return n(s);const r=$c(e);return r?n(r):{at:e.length,indent:"",suffix:""}}function $c(t){const e=String(t||"");let o=null,n=0,s=0;for(;n<e.length;){if(e[n]==="}"||e[n]===";"){n+=1,s=n;continue}if(e[n]!=="{"){n+=1;continue}const r=Lt(e,n);if(r===-1||o||(o=e.slice(s,n).trim().startsWith("@")?null:{from:s,open:n,to:r},!o))return null;n=r+1,s=n}return o}function Cc(t,e){const o=e===i.cssSize?"":e;i.cssSize=o,V(t,Bo,o),Mt("lp:set-device",{win:t,key:o?$r(o,t):"Responsive"}),o&&_c(t,o),i.cssValues&&ws(t),oe(t,!0),Ao(),ne(t),P(t)}function Tc(t,e){i.cssState=Lo.includes(e)?e:"",V(t,to,i.cssState),w(t.document),ne(t),P(t)}function Ac(t,e){const o=t.document;w(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=$,o.body.appendChild(n),j(t,e,n),n._sveApp=W(ot,n,{kind:"choices",choices:[{value:"",label:m(t,"css_state_none"),active:!i.cssState},...Lo.map(s=>({value:s,label:Ie(s),active:s===i.cssState}))],onPick:s=>Tc(t,s)})}function ne(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-css-head]");if(!o)return;const n=_t(),s=pt(t),r=g.css?.state.doc.toString()??"";B.tag=n?.tag||"",B.scope=ua(n?It().slice(n.from,n.openTo):"")||"",B.canEdit=!e.lastLocked,B.onTag=a=>Xr(t,a.currentTarget,n),B.state=e.cssState,B.stateLabel=e.cssState?Ie(e.cssState):m(t,"css_state"),B.onState=a=>Ac(t,a.currentTarget),B.onSize=a=>Cc(t,a),B.sizes=[{key:"",label:m(t,"tw_size_all"),title:m(t,"css_size_all_title"),active:!e.cssSize},...s.map(a=>{const l=a.base||yo(r,s,a.handle).length>0;return{key:a.handle,label:a.label,title:a.base?m(t,"css_size_base_title"):`@media ${a.media}${l?"":`  ·  ${m(t,"css_size_new")}`}`,active:e.cssSize===a.handle}})],o._sveMounted||(o._sveMounted=!0,wt(o,Qi))}ao("lp:device",t=>{const e=i.lastWin;if(!e||!Cs(e.document))return;const o=uo(e).find(n=>n.device===t)?.handle||"";o!==i.cssSize&&(i.cssSize=o,V(e,Bo,o),oe(e,!0),Ao(),ne(e),P(e))});function Mc(t){const e=Math.max(0,Math.round(Date.now()/1e3-t)),o=new Date(t*1e3).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});let n=o;try{const s=new Intl.RelativeTimeFormat(void 0,{numeric:"auto"});e<90?n=s.format(-e,"second"):e<5400?n=s.format(-Math.round(e/60),"minute"):e<86400?n=s.format(-Math.round(e/3600),"hour"):n=s.format(-Math.round(e/86400),"day")}catch{}return`${n} · ${o}`}function Ss(t,e){return t.fetch(e,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}})}async function Ec(t,e){const o=t.document,n=$t();if(w(o),!n)return;let s=[];try{const a=await Ss(t,`/!/sve/section-template/history?type=${encodeURIComponent(n)}`);a.ok&&(s=(await a.json())?.entries||[])}catch{s=[]}if(!o.getElementById(u)||!o.contains(e))return;e.setAttribute("data-open","");const r=o.createElement("div");r.id=$,o.body.appendChild(r),j(t,e,r),r._sveApp=W(ot,r,{kind:"choices",choices:s.length?s.map(a=>({value:a.id,label:Mc(a.at)})):[{value:"",label:m(t,"code_dock_history_empty")}],onPick:a=>{w(o),a&&Bc(t,n,a)}})}async function Bc(t,e,o){if(ht())return;let n=null;try{const s=await Ss(t,`/!/sve/section-template/history/entry?type=${encodeURIComponent(e)}&id=${encodeURIComponent(o)}`);s.ok&&(n=await s.json())}catch{n=null}!n||ht()||(te({html:n.html??"",css:n.css??"",js:n.js??""},i.lastLocked),nt(t),se(t))}function Gt(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-code-strip]");if(!e)return;e.hidden=i.styleMode!=="tw";const o=En(t);e.innerHTML=jd,e.title=m(t,o?"tw_strip_on":"tw_strip_off"),e.setAttribute("aria-label",e.title),e.setAttribute("aria-pressed",o?"true":"false")}function Lc(t,e){const o=e.querySelector("[data-sve-code-strip]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Yr(t,!En(t)),Gt(t),Zr(t)}),Gt(t))}function Fc(t,e){const o=e.querySelector("[data-sve-code-history]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=Wd,o.title=m(t,"code_dock_history"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),o.hasAttribute("data-open")){w(t.document);return}Ec(t,o)}))}function mu(){return i.styleMode}function Ic(t){return i.styleMode==="tw"?_t():null}function _t(t){const e=g.html;if(!e)return null;const o=i.htmlScopeActive&&!!i.htmlFocus,n=o?i.htmlFull:e.state.doc.toString(),r=(o?i.htmlFocus.from:0)+e.state.selection.main.from,a=Mn(ye(n),new Set);let l=null;for(const c of a)c.from<=r&&r<c.to&&(l=c);return l}function se(t){i.styleMode==="tw"&&Jr(t,Ic())}function Mo(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-values-mode]");if(!e||!o)return;e.setAttribute("data-sve-values",e.cssValues?"on":"off");const n=t.document.createElement("span");n.textContent=m(t,"code_dock_values"),o.innerHTML=qd,o.appendChild(n),o.title=m(t,e.cssValues?"code_dock_values_off":"code_dock_values_on"),o.setAttribute("aria-label",o.title),o.setAttribute("aria-pressed",e.cssValues?"true":"false")}function ws(t){const e=g.css;if(!e||e.state.readOnly)return;const o=pt(t),n=e.state.doc.toString(),s=he(n,o,i.cssSize);if(e.focus(),s.length){const p=s[0],x=Math.min(p.bodyTo,p.bodyFrom+(n.slice(p.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);e.dispatch({selection:{anchor:x},scrollIntoView:!0});return}const r=xs(t,i.cssSize);if(!r||r.base){const p=`#id-{{ id }} {
    `;e.dispatch({changes:{from:0,to:0,insert:`${p}
}

`},selection:{anchor:p.length},scrollIntoView:!0});return}const a=yo(n,o,i.cssSize)[0];if(a){const p=`${yt(n,a.from)}    `,x=`
${p}#id-{{ id }} {
${p}    `;e.dispatch({changes:{from:a.bodyFrom,to:a.bodyFrom,insert:`${x}
${p}}
`},selection:{anchor:a.bodyFrom+x.length},scrollIntoView:!0});return}const l=ks(e,n),c=`${l.indent}    `,d=he(n,o,"").some(p=>l.at>p.bodyFrom&&l.at<=p.bodyTo),f=d?`

${l.indent}@media ${Qe(r,n)} {
${c}`:`

${l.indent}@media ${Qe(r,n)} {
${c}#id-{{ id }} {
${c}    `,h=d?`
${l.indent}}${l.suffix}`:`
${c}}
${l.indent}}${l.suffix}`;e.dispatch({changes:{from:l.at,to:l.at,insert:`${f}${h}`},selection:{anchor:l.at+f.length},scrollIntoView:!0})}function Pc(t,e){i.cssValues=!!e,V(t,Oo,i.cssValues?"1":"0"),w(t.document),i.cssOpenTool="",Mo(t),lt(),Jt(),i.cssValues&&ws(t),oe(t,!0),Ao(),ne(t),P(t)}function Eo(t){const e=t?.document.getElementById(u);if(!e)return;const o=e.styleMode==="tw";e.setAttribute("data-sve-style",e.styleMode);const n=e.querySelector("[data-sve-css-label]");n&&(n.textContent=o?m(t,"code_dock_style_tw"):m(t,"code_dock_css"));const s=e.querySelector("[data-sve-style-mode]");if(!s)return;const r=t.document.createElement("span");r.textContent=o?m(t,"code_dock_style_tw"):m(t,"code_dock_css"),s.innerHTML=o?Vd:Nd,s.appendChild(r),s.title=m(t,o?"code_dock_style_to_css":"code_dock_style_to_tw"),s.setAttribute("aria-label",s.title),s.setAttribute("aria-pressed",o?"true":"false")}function _s(t){const e=t?.document.getElementById(u);w(t.document),Ke(t),e.cssOpenTool="",e.cssOpenMenu="",e.styleMode==="tw"&&e.cssValues&&(e.cssValues=!1,V(t,Oo,"0")),Eo(t),Mo(t),Gt(t),e.cssToolRow?.(),e.styleMode==="tw"&&(e.htmlScopePref=!0,V(t,ze,"1"),Ge(t,!0)),se(t),Fe(t),P(t)}const Bo="sve-css-size",to="sve-css-state",Lo=["hover","focus","focus-visible","active","disabled","before","after"];function Oc(t,e){i.styleMode=e==="tw"?"tw":"css",V(t,ir,i.styleMode),_s(t)}function Dc(t,e){if(e._sveStyleModeBound)return;e._sveStyleModeBound=!0,e.styleMode=J(t,ir)==="tw"?"tw":"css";const o=J(t,Bo)||"";e.cssSize=uo(t).some(n=>n.handle===o)?o:"",e.cssState=Lo.includes(J(t,to))?J(t,to):"",e.cssValues=J(t,Oo)==="1",e.querySelector("[data-sve-style-mode]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Oc(t,e.styleMode==="tw"?"css":"tw")}),e.querySelector("[data-sve-values-mode]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Pc(t,!e.cssValues)}),_s(t),Mo(t)}function zc(t,e){const o=e.querySelector("[data-sve-css-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=r=>e.querySelector(`[data-sve-css-tool="${r}"], [data-sve-css-kid="${r}"]`),s=r=>{const a=n(r.id),l=e.cssOpenMenu===r.id;if(w(t.document),l){Ke(t),P(t);return}if(!a)return;const c=e.styleMode==="tw"?!r.twClass&&!!r.tw:!r.kind&&!r.value&&!(r.css in Q())&&!!r.menu,d=()=>{c&&(e.cssOpenMenu=r.id)};if(e.styleMode==="tw"){Ke(t),r.twClass?(Qr(t,r.twClass),P(t)):r.tw&&(ta(t,a,r.tw,()=>P(t)),d(),P(t));return}if(r.kind==="flexDir"){Wl(r.value);return}if(r.kind==="display"){Nl(r.value);return}if(r.value){const f=D(Q()[r.css])===D(r.value);Z([{property:r.css,value:f?null:r.value}]);return}if(r.css in Q()){Z([{property:r.css,value:null}]),P(t);return}r.menu==="colors"?Ul(t,a,r.css):r.menu==="spacing"?Gl(t,a,r.css):r.menu==="sizes"?cn(t,a,r.css,Yd):r.menu==="choices"?Kl(t,a,r.css,r.choices):r.menu==="values"&&cn(t,a,r.css),d(),P(t)};dt.onTool=r=>{const a=ge.get(r)?.tool;if(a){if(a.kids?.length){e.cssOpenTool=e.cssOpenTool===a.id?"":a.id,w(t.document),P(t);return}s(a)}},dt.onKid=(r,a)=>{const l=ge.get(a);l?.kid&&s(l.kid)},e.cssToolRow=()=>{wt(o,Hi),P(t)},e.cssToolRow(),t.document.addEventListener("mousedown",r=>{r.target.closest(`#${$}, [data-sve-css-tools], [data-sve-html-tools], [data-sve-css-add-class]`)||w(t.document)},!0)}function Hc(t,e){const o=e.querySelector("[data-sve-html-tidy]");o&&(o.innerHTML=Bn.tidy,o.title=m(t,"code_dock_html_tidy"),o.setAttribute("aria-label",o.title),o.setAttribute("data-tip",o.title))}function Rc(t,e){const o=e.querySelector("[data-sve-html-tidy]");Hc(t,e),!(!o||o._sveBound)&&(o._sveBound=!0,o.addEventListener("mousedown",n=>n.preventDefault()),o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),ls()}))}function jc(t,e){const o=e.querySelector("[data-sve-html-tools]");!o||o._sveBound||(o._sveBound=!0,wt(o,Fi,{tools:ro.map(n=>({...n,icon:Bn[n.id]||""})),onTool:n=>{const s=ro.find(a=>a.id===n),r=o.querySelector(`[data-sve-html-tool="${n}"]`);if(s){if(s.menu==="heading"){rn(t,r,dr);return}if(s.menu==="text"){rn(t,r,ea);return}if(s.tidy){ls();return}if(s.menu==="component"){Fl(t,r);return}if(w(t.document),s.snippet){Bt(s.snippet,s.caret??s.snippet.length,s.select),N();return}cs(s.tag)}}}),rd(t,e),id(t,e),sd(t,e))}let ce=null;async function Wc(t){const e=t.document;vd(e);let o=e.getElementById(u);if(o&&!(o.querySelector('[data-sve-css-chrome="subrow-2"]')&&o.querySelector("[data-sve-css-add-class]")&&o.querySelector("[data-sve-html-tools]")&&o.querySelector("[data-sve-html-tidy]")&&o.querySelector("[data-sve-data-vars]")&&o.querySelector("[data-sve-visual-edit-tools]")&&o.querySelector("[data-sve-html-scope]")&&o.querySelector("[data-sve-code-lock]")&&o.querySelector("[data-sve-code-back]")&&o.querySelector("[data-sve-code-autosave]")&&o.querySelector("[data-sve-code-save]")&&o.getAttribute("data-sve-code-chrome")==="scope-9")){for(const s of at)g[s]?.destroy(),g[s]=null;o.remove(),o=null}if(!o){o=e.createElement("div"),o.id=u,o.setAttribute("data-sve-code-chrome","scope-9"),wt(o,$i,{htmlLabel:m(t,"code_dock_html"),cssLabel:m(t,"code_dock_css"),jsLabel:m(t,"code_dock_js"),alpineLabel:m(t,"code_dock_alpine"),treeIcon:cr,dataIcon:Pd,dataLabel:m(t,"data_vars_title")}),Ue(e,o),pn(o),Is(o,Es(t)),wd(t,o),$d(t,o),_d(t,o),zc(t,o),Ol(t,o),Dc(t,o),Fc(t,o),Lc(t,o),Ir(t,o),jc(t,o),en(t,o),Qo(t,o),mn(t,o),tn(t,o);for(const n of at){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);wc(s)}Pr(t)}if(Ue(e,o),pn(o),Rc(t,o),en(t,o),Qo(t,o),mn(t,o),tn(t,o),xd(t),Fo(t),Et(t),K(t),Yt(t),ft(t),Eo(t),Gt(t),await Td(),!g.html){for(const n of at){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);s?.replaceChildren(),Sc(t,n,s)}for(const n of["html","css"])g[n]&&oa(t,g[n],{onOpen:s=>es(t,s),emptyLabel:m(t,"code_dock_partials_empty"),openLabel:s=>m(t,"component_open_named",{name:s}),sectionValues:()=>ts(t),isLocked:()=>ht(),setHover:(s,r)=>o.htmlPartialUi?.setHover(s,r)});Ta(t,g.html,{onRename:n=>$l(t,n),isLocked:()=>ht(),setHover:(n,s)=>o.htmlClassTokenUi?.setHover(n,s),title:m(t,"code_dock_css_rename_class")})}return o}function $s(t){return ce||(ce=Wc(t).finally(()=>{ce=null})),ce}async function fn(t,e){const o=await $s(t);o.lastType=e,o.lastLocked=!0,o.lockReady=!0,o.lastParts={html:"",css:"",js:""},Me(),Et(t),te(o.lastParts,!0),Ds(t.document,e),U(t.document,m(t,"code_dock_missing")),K(t),Yt(t),ft(t),Xt(t,o)}async function Pe(t,e,o="replace"){o==="replace"?s.typeStack=[]:o==="push"&&s.lastType&&s.lastType!==e&&s.typeStack.push(s.lastType);const n=++s.loadGen;s.lastType=e,s.lockReady=!1,Me(),U(t.document,m(t,"code_dock_loading"));const s=await $s(t);Et(t),K(t),Yt(t),ft(t),Eo(t),Gt(t),Xt(t,s),t.fetch(`/!/sve/section-template?type=${encodeURIComponent(e)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async r=>{if(n!==s.loadGen)return;if(r.status===404){fn(t,e);return}if(!r.ok)throw new Error(String(r.status));const a=await r.json();n===s.loadGen&&(s.lastParts={html:typeof a.html=="string"?a.html:"",css:typeof a.css=="string"?a.css:"",js:typeof a.js=="string"?a.js:""},s.lastProps=Array.isArray(a.props)?a.props:[],s.propsDirty=!1,s.lastType=e,s.lastLocked=!!a.locked,s.lockReady=!0,xl(),Et(t),te(s.lastParts,s.lastLocked),Ln(t),s.lastLocked||Jn(t,s.lastParts.html),Ds(t.document,a.path||e),U(t.document,s.lastLocked?m(t,"code_dock_locked"):""),Gn(t),Ei(t),go(t),K(t),Yt(t),ft(t),Xt(t,s))}).catch(()=>{n===s.loadGen&&(fn(t,e),U(t.document,m(t,"code_dock_error")))})}function $t(){return i.lastType||""}function Cs(t){return!!t?.getElementById(u)}function ht(){return i.lastLocked}function Nc(t,e){const o=typeof e?.html=="string"?e.html.trim():"",n=typeof e?.css=="string"?e.css.trim():"",s=typeof e?.js=="string"?e.js.trim():"";if(!o&&!n&&!s||!t?.document?.getElementById(u))return!1;let r=!1;return o&&(r=qc("html",o)||r),n&&(r=hn("css",n)||r),s&&(r=hn("js",s)||r),r&&nt(t),r}function qc(t,e){const o=g[t];if(!o||o.state.readOnly)return!1;const n=o.state.selection.main,s=n.from>0?o.state.doc.sliceString(n.from-1,n.from):`
`,r=n.to<o.state.doc.length?o.state.doc.sliceString(n.to,n.to+1):`
`,c=`${s===`
`?"":`
`}${e}${r===`
`?"":`
`}`;return o.dispatch({changes:{from:n.from,to:n.to,insert:c},selection:{anchor:n.from+c.length}}),!0}function hn(t,e){const o=g[t];if(!o||o.state.readOnly)return!1;const n=o.state.doc.length,r=`${n>0&&o.state.doc.sliceString(Math.max(0,n-1),n)!==`
`?`

`:n?`
`:""}${e}
`;return o.dispatch({changes:{from:n,insert:r},selection:{anchor:n+r.length}}),!0}function Vc(t){if(ko(t),!i.lastType||!t.document.getElementById(u))return;const e=i.lastType;i.lastType=null,Pe(t,e,"keep")}function Ts(t){bt(t),i.loadGen+=1,et(t),i.lastUid=null,i.lastType=null,i.typeStack=[],i.lastParts={html:"",css:"",js:""},i.lastLocked=!1,i.lockReady=!1,i.lastBracketNames=null,i.lastCssSelectorNames=null,Me(),i.lastWin=t?.defaultView||i.lastWin,w(t),An(t),rt(t),t?.getElementById(G)?.remove();for(const o of at)g[o]?.destroy(),g[o]=null;t?.getElementById(u)?.remove(),bd(),t&&Io(t,0);const e=t?.defaultView||i.lastWin;e?.document.getElementById(Cn)&&$n(e),e&&(Gn(e),go(e),Ln(e))}function Uc(t){if(e.dragging)return;const e=t.document.getElementById(u);e&&(Fo(t),Xt(t,e))}function Kc(t,e,o){if(o){const r=Ho(o,e)||Ho(o,t.document)||o;return String(typeof Re=="function"&&(Re(r,e)||Re(r,t.document))||"").trim()}const n=typeof Ro=="function"?Ro(t):"page_sections",s=typeof tt=="function"?tt(t.document):[];for(const r of s){const l=(xt(r.values)||r.values)?.[n];if(Array.isArray(l))for(const c of l){const d=typeof c?.type=="string"?c.type.trim():"";if(d)return d}}return""}function As(t){if((t.Statamic?.$config?.get?.("sveFeatures")||{}).collection_templates!==!0)return"";const o=t.Statamic?.$config?.get?.("sveCollectionTemplatesCollection")||"templates";if(!(t.location?.pathname||"").includes(`/collections/${o}/entries/`))return"";const s=typeof tt=="function"?tt(t.document):[];for(const r of s){const a=xt(r.values)||r.values,l=typeof a?.view=="string"?a.view.trim():"";if(!l||l.includes(".."))continue;const c=l.replace(/\.(antlers\.html|blade\.php)$/i,"").replace(/^\/+|\/+$/g,"");if(c)return`view:${c}`}return""}function Gc(t,e){const o=Br||Lr;if(o!=="header"&&o!=="footer"||!Ar(e)&&!Mr(e))return"";const s=(xt(Er()?.values)||{})[o==="footer"?"footer_style":"header_style"]||"style_1";return`${o}/${s}`}function Xc(t){const e=Fr(t)||t.getElementById("__sve-global-section-host");return e&&e.querySelector("[data-replicator-set][data-type]")?.getAttribute("data-type")||""}function Yc(t,e,o){if(i.dragging)return;if(!t||!e||ud(e)||!Cr(t)||!Tr(t)){e&&Ts(e);return}const n=Gc(t,e)||Xc(e)||Kc(t,e,o)||As(t)||(o?"":i.lastType),s=!!(o&&o!==i.lastUid);if(i.lastWin=t,o&&(i.lastUid=o),!!n&&!(n===i.lastType&&e.getElementById(u))){if(i.typeStack.length&&i.lastType&&i.lastType!==n){const r=i.typeStack[0];if(n===r&&!s)return;i.typeStack=[]}et(e),Pe(t,n,"replace")}}ao("tw:changed",()=>{i.lastWin&&i.styleMode==="tw"&&P(i.lastWin)});I("dock:is-open",t=>Cs(t));I("dock:is-locked",()=>ht());I("dock:html",()=>It());I("dock:reveal-html",({from:t,to:e,caret:o}={})=>{const n=g.html;if(!n||t==null)return;i.htmlScopePref=Zt(i.lastWin),$e(),lt();const s=i.htmlFull.length,r=Math.max(0,Math.min(t,s)),a=Math.max(r,Math.min(e??t,s));i.htmlFocus=a>r?{from:r,to:a}:null;const l=o==null?null:Math.max(0,Math.min(o,s));if(i.htmlScopePref&&i.htmlFocus){wo(l),K(i.lastWin);return}if(i.htmlScopeActive){_o(!0,l),K(i.lastWin);return}n.dispatch({selection:l==null?{anchor:r,head:a}:{anchor:l},scrollIntoView:!0}),n.focus()});I("dock:insert-snippet",({win:t,parts:e})=>Nc(t,e));I("dock:refresh",t=>Vc(t));I("dock:tw-follow",()=>{i.lastWin&&se(i.lastWin)});I("dock:css",()=>(lt(),i.cssFull));I("dock:set-css",t=>typeof t!="string"||ht()||!g.css||!i.lastWin?!1:(lt(),i.cssFull=t,Te("css",ds()),nt(i.lastWin),!0));I("dock:data-menu",({anchor:t,onPick:e,at:o}={})=>!t||!i.lastWin?!1:(bt(i.lastWin.document),w(i.lastWin.document),Ms(i.lastWin,t,e,o),!0));I("dock:props",()=>i.lastProps.map(t=>({...t})));I("dock:set-props",({win:t,props:e}={})=>!Array.isArray(e)||ht()?!1:(i.lastProps=e,i.propsDirty=!0,na(Oe($t())),et((t||i.lastWin)?.document),!0));function Oe(t){const e=/^view:partials\/(components\/[A-Za-z0-9_-]+)$/.exec(String(t||""));return e?e[1]:""}I("dock:component-src",()=>Oe($t()));I("dock:component-exit-state",()=>{const t=Oe($t());return{open:!!t,name:t?t.split("/").pop():"",back:i.typeStack.length>0}});I("dock:exit-component",()=>!i.lastWin||!Oe($t())?!1:(i.typeStack.length?os(i.lastWin):Ts(i.lastWin.document),!0));I("dock:current-type",()=>$t());I("dock:current-uid",()=>i.lastUid);I("dock:reset-data-vars",t=>(Xa(typeof t=="string"&&t?t:void 0),!0));I("dock:refresh-preview",()=>i.lastWin?(ko(i.lastWin),!0):!1);I("dock:open-template",t=>typeof t!="string"||!t||!i.lastWin?!1:(es(i.lastWin,t),!0));I("dock:set-html",t=>{if(typeof t!="string"||ht())return!1;const e=g.html;if(!e||!i.lastWin)return!1;if(t===""){i.saveTimer&&(clearTimeout(i.saveTimer),i.saveTimer=null),i.twDirty=!1,i.twCss=null,i.twKey="",i.lastType=null,i.lastUid=null,i.lastParts={html:"",css:"",js:""},i.cssFull="",i.htmlFull="",i.applying=!0;try{Me();for(const s of at){const r=g[s];if(!r)continue;const a=r.state.doc.toString();a!==""&&r.dispatch({changes:{from:0,to:a.length,insert:""}})}}finally{i.applying=!1}return!0}const o=i.htmlFull;if(i.htmlFull=t,i.htmlScopeActive)return i.htmlFocus=Zc(i.htmlFocus,o,t),Ae(rs()),nt(i.lastWin),co("dock:html-changed"),!0;const n=e.state.doc.toString();return n!==t&&e.dispatch({changes:{from:0,to:n.length,insert:t}}),!0});I("dock:show-empty",()=>Mt("dock:set-html",""));function Zc(t,e,o){const n=o.length-e.length;if(!t||!n)return t;let s=0;for(;s<e.length&&s<o.length&&e[s]===o[s];)s+=1;return s>=t.to?t:s<t.from?{from:Math.max(0,t.from+n),to:Math.max(0,t.to+n)}:{from:t.from,to:Math.max(t.from,t.to+n)}}Or.syncCodeDock=Yc;const F="__sve-data-menu";let eo=null;function bt(t){const e=t?.getElementById(F);eo?.(),eo=null,e?._sveApp?.unmount(),e?.remove(),t?.querySelector("[data-sve-data-vars][data-open]")?.removeAttribute("data-open")}function Jc(t){if(!As(t))return{view:"",kind:""};const e=typeof tt=="function"?tt(t.document):[];for(const o of e){const n=xt(o.values)||o.values,s=typeof n?.source_collection=="string"?n.source_collection.trim():"";if(s)return{view:s,kind:String(n?.kind||"").trim()}}return{view:"",kind:""}}function Qc(t,e){const o=It();if(Number.isFinite(e))return No(o,e);const n=g.html;if(!n)return[];const s=i.htmlScopeActive&&i.htmlFocus?i.htmlFocus.from:0;return No(o,s+n.state.selection.main.from)}function td(t,e){const{view:o,kind:n}=Jc(t);return{collection:qa(t)||"",set:Va($t()),view:o,kind:n,scope:Ua(Qc(t,e))}}function ed(t){const e=typeof tt=="function"?tt(t.document):[];for(const o of e){const n=xt(o.values)||o.values;if(n&&typeof n=="object")return n}return null}function od(t,e){return{scope:e?.scope?.groups||[],section:qn(e?.section||[],ts(t)),page:Ja(e?.page||[],ed(t)),site:e?.site||[]}}function nd(t,e){const o=Qa(t,e),n=g.html;if(!o||!n||n.state.readOnly)return;const s=n.state.selection.main,r=n.state.doc.lineAt(s.from),a=it(r.text),l=fo(o.text,a);n.dispatch({changes:{from:s.from,to:s.to,insert:l},selection:{anchor:s.from+o.cursor+(o.text.includes(`
`)?a.length:0)}}),N()}function Ne(t,e,o){const n=e.getBoundingClientRect(),s=8,r=o.offsetWidth||368,a=o.offsetHeight||240,l=t.innerHeight-n.bottom-s,c=n.top-s,d=l>=a||l>=c?n.bottom+4:n.top-a-4;o.style.left=`${Math.max(s,Math.min(n.left,t.innerWidth-r-s))}px`,o.style.top=`${Math.max(s,Math.min(d,t.innerHeight-a-s))}px`}function Ms(t,e,o,n){const s=t.document;bt(s),e.setAttribute("data-open","");const r=s.createElement("div");r.id=F,s.body.appendChild(r);const a=td(t,n),l=p=>[p?.scope?.groups?.length?{id:"scope",label:p.scope.label||m(t,"data_vars_tab_loop")}:null,{id:"section",label:m(t,"data_vars_tab_section")},{id:"page",label:m(t,"data_vars_tab_page")},{id:"site",label:m(t,"data_vars_tab_site")}].filter(Boolean),c=p=>{s.getElementById(F)&&(r._sveApp?.unmount(),r._sveApp=W(Na,r,{title:m(t,"data_vars_title"),placeholder:m(t,"data_vars_placeholder"),emptyText:m(t,"data_vars_empty"),noSectionText:m(t,"data_vars_no_section"),loopText:m(t,"data_vars_loop"),tabs:l(p),data:od(t,p),onPick:(x,k)=>o?o(x,k):nd(x,k)}),Ne(t,e,r))};c(Ka(Nn(a))||{scope:null,section:[],page:[],site:[]}),Ga(t,a).then(c),Ne(t,e,r);const d=()=>Ne(t,e,r),f=p=>{!r.contains(p.target)&&!e.contains(p.target)&&bt(s)},h=p=>{p.key==="Escape"&&bt(s)};s.addEventListener("pointerdown",f,!0),s.addEventListener("keydown",h,!0),t.addEventListener("scroll",d,!0),t.addEventListener("resize",d),eo=()=>{s.removeEventListener("pointerdown",f,!0),s.removeEventListener("keydown",h,!0),t.removeEventListener("scroll",d,!0),t.removeEventListener("resize",d)}}function sd(t,e){const o=e.querySelector("[data-sve-data-vars]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("mousedown",n=>n.preventDefault()),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),t.document.getElementById(F)){bt(t.document);return}w(t.document),Ms(t,o)}))}function rd(t,e){const o=e.querySelector("[data-sve-antlers-tools]");!o||o._sveBound||(o._sveBound=!0,wt(o,Wn,{label:m(t,"code_dock_antlers"),groups:la.map(n=>({id:n.id,label:m(t,n.lang),items:ca.filter(s=>s.group===n.id).map(s=>({id:s.id,label:s.label}))})),onPick:n=>ad(n)}))}function ad(t){const e=da(t),o=g.html;if(!e||!o||o.state.readOnly)return;const n=o.state.selection.main.head,s=o.state.doc.lineAt(n),r=s.text.trim()?it(s.text):Le(o,s)||it(s.text),{text:a,cursor:l}=ue(e.snippet);Bt(fo(a,r),l),N()}function id(t,e){const o=e.querySelector("[data-sve-visual-edit-tools]");!o||o._sveBound||(o._sveBound=!0,wt(o,Wn,{label:m(t,"code_dock_visual_edit"),groups:ti.map(n=>({id:n.id,label:m(t,n.lang),items:Vn.filter(s=>s.group===n.id).map(s=>({id:s.id,label:s.label}))})),onPick:n=>cd(n)}))}function ld(t,e,o,n){if(ni(o.inner,n.attr)){t.focus();return}const{text:s,cursor:r}=ue(n.attr);let a=o.closeIdx;for(;a>o.openIdx+2&&/\s/.test(e[a-1]);)a--;t.dispatch({changes:{from:a,to:o.closeIdx,insert:` ${s} `},selection:{anchor:a+1+r}}),N()}function cd(t){const e=ei(t),o=g.html;if(!e||!o||o.state.readOnly)return;const n=o.state.doc.toString(),s=Qt();if(s?.open){const h=oi(n,s.open.from,s.open.to,ie);if(h){e.attr?ld(o,n,h,e):(o.dispatch({selection:{anchor:h.openIdx+2+ie.length}}),o.focus());return}const p=s.open.from+1+s.name.length,x=e.standalone||`{{ ${ie} ${e.attr} }}`,{text:k,cursor:z}=ue(x);o.dispatch({changes:{from:p,to:p,insert:` ${k}`},selection:{anchor:p+1+z}}),N();return}const r=o.state.selection.main.head,a=o.state.doc.lineAt(r),l=a.text.trim()?it(a.text):Le(o,a)||it(a.text),c=e.standalone||`{{ ${ie} ${e.attr} }}`,{text:d,cursor:f}=ue(c);Bt(fo(d,l),f),N()}function dd(t){return t==="css"?Qs():t==="js"?tr():Js({autoCloseTags:!0})}function pn(t){if(t._sveShield)return;t._sveShield=!0;const e=o=>o.stopPropagation();for(const o of["keydown","keypress","keyup","pointerdown","pointerup","mousedown","mouseup","click","focusin"])t.addEventListener(o,e)}function ud(t){try{return new URLSearchParams(t.defaultView?.location?.search||"").has("sve-panel")}catch{return!1}}function fd(t){const e=parseInt(J(t,nr)??"",10);return Number.isFinite(e)&&e>=lr?e:Ed}function hd(t,e){V(t,nr,String(e))}function Es(t){try{const e=JSON.parse(J(t,sr)||"null");if(e&&typeof e=="object")return{html:e.html!==!1,css:e.css!==!1,js:e.js===!0,alpine:e.alpine===!0}}catch{}return{html:!0,css:!0,js:!1,alpine:!1}}function pd(t,e){V(t,sr,JSON.stringify(e))}function Bs(t){try{const e=JSON.parse(J(t,rr)||"null");if(e&&typeof e=="object"){const o=s=>Number.isFinite(s)&&s>0?s:1,n={};for(const s of St)n[s]=o(e[s]);return n}}catch{}return Object.fromEntries(St.map(e=>[e,1]))}function md(t,e){V(t,rr,JSON.stringify(e))}function vd(t){Dr(t,Md,`
@keyframes sve-cm-wait { to { transform: rotate(360deg); } }
#${u} {
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
#${G} {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,.5);
}
#${G} [data-sve-unlock-card] {
  width: min(420px, calc(100vw - 32px));
  padding: 20px;
  border-radius: 12px;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 16px 40px rgba(0,0,0,.45);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${G} [data-sve-unlock-title] {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
}
#${G} [data-sve-unlock-body] {
  font-size: 13px;
  line-height: 1.45;
  opacity: .75;
  margin-bottom: 18px;
}
#${G} [data-sve-unlock-actions] {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
#${G} [data-sve-unlock-actions] button {
  all: unset;
  cursor: pointer;
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}
#${G} [data-sve-unlock-cancel] {
  background: rgba(255,255,255,.1);
  color: #d4d4d4;
}
#${G} [data-sve-unlock-confirm] {
  background: #b45309;
  color: #fff;
}
#${u} [data-sve-code-grip] {
  flex: 0 0 16px;
  height: 16px;
  width: 100%;
  cursor: ns-resize;
  z-index: 3;
  ${jo("ns")}
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
  color: #5eead4;
  background: rgba(45,212,191,.13);
  opacity: 1;
}
#${u} [data-sve-html-tool="component"]:hover,
#${u} [data-sve-html-tool="component"][data-open] {
  background: rgba(45,212,191,.26);
}
#${u} [data-sve-html-tool="loop"] {
  color: #a5b4fc;
  background: rgba(129,140,248,.15);
  opacity: 1;
}
#${u} [data-sve-html-tool="loop"]:hover,
#${u} [data-sve-html-tool="loop"][data-open] {
  background: rgba(129,140,248,.28);
}
#${u} [data-sve-html-tool="if"] {
  color: #e8c468;
  background: rgba(234,179,8,.13);
  opacity: 1;
}
#${u} [data-sve-html-tool="if"]:hover,
#${u} [data-sve-html-tool="if"][data-open] {
  background: rgba(234,179,8,.26);
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
#${F} {
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
#${F} [data-sve-data-search] {
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
#${F} [data-sve-data-search]:focus-within {
  border-color: rgba(147,197,253,.7);
}
#${F} [data-sve-data-search] svg {
  flex: 0 0 auto;
  opacity: .5;
}
#${F} [data-sve-data-input] {
  all: unset;
  flex: 1 1 auto;
  min-width: 0;
  color: inherit;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.75rem;
}
#${F} [data-sve-data-tabs] {
  display: flex;
  gap: 0.2rem;
  margin-bottom: 0.45rem;
  padding: 0.15rem;
  border-radius: 0.45em;
  background: rgba(0,0,0,.28);
}
#${F} [data-sve-data-tab] {
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
#${F} [data-sve-data-tab]:hover { opacity: 1; }
#${F} [data-sve-data-tab][data-active] {
  opacity: 1;
  background: rgba(255,255,255,.14);
}
#${F} [data-sve-data-group] {
  padding: 0.6em 0.5em 0.25em;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  opacity: .45;
}
#${F} [data-sve-data-option] {
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
#${F} [data-sve-data-option]:hover,
#${F} [data-sve-data-option][data-cursor] {
  background: rgba(255,255,255,.1);
}
#${F} [data-sve-data-name] {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
#${F} [data-sve-data-parent] {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.625rem;
  opacity: .4;
}
#${F} [data-sve-data-value] {
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
#${F} [data-sve-data-loop] {
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
#${F} [data-sve-data-empty] {
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
  ${jo("ew")}
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
/* Antlers. The partial call keeps its own amber; everything else that decides
   what renders is one colour, and what closes a block is that colour held back,
   so an opening line and its closing line do not read as the same thing. */
#${u} .sve-cm-antlers {
  color: #b9a6ff;
}
#${u} .sve-cm-antlers-close {
  color: #8d7fc4;
}
#${u} .sve-cm-antlers-comment {
  color: #6b8f6b;
  font-style: italic;
}
#${u} .sve-cm-partial {
  text-decoration: underline dotted;
  text-underline-offset: 3px;
  background: rgba(251,191,36,.16);
  /* Text, because the left button writes here now. The underline still says
     there is a file behind it; the right button is what opens it. */
  cursor: text;
}
#${u} .sve-cm-partial-line {
  background: rgba(251,191,36,.12);
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
#${ae} {
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
#${ae} [data-sve-partial-choice] {
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
#${ae} [data-sve-partial-choice]:hover {
  background: rgba(255,255,255,.1);
}
#${ae} [data-sve-partial-empty] {
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
`)}function gd(t){const e=t.querySelector(".live-preview-editor");if(!e)return 0;const o=e.getBoundingClientRect();return o.width<40||o.right<40?0:Math.round(o.right)}function yd(t){let e=0;for(const o of["__sve-section-picker","__sve-outline-panel","__sve-html-tree-panel","__sve-listview-panel","__sve-right-dock","__sve-chrome-designs","__sve-global-section-panel","__sve-ai-panel"]){const n=t.getElementById(o);if(!n||n.hasAttribute("data-sve-chrome-hidden")||n.hasAttribute("data-sve-right-closed")||n.style.display==="none")continue;const s=n.getBoundingClientRect();s.width>40&&s.right>t.documentElement.clientWidth-8&&(e=Math.max(e,Math.round(s.width)))}return e}function Fo(t){const e=t.document;if(i.layoutWin=t,typeof t.ResizeObserver!="function")return;i.layoutObserver||(i.layoutObserver=new t.ResizeObserver(()=>{i.layoutWin&&Uc(i.layoutWin)}));const o=e.querySelector(".live-preview-editor"),n=e.getElementById("__sve-right-dock");o!==i.observedEditor&&(i.observedEditor&&i.layoutObserver.unobserve(i.observedEditor),i.observedEditor=o,o&&i.layoutObserver.observe(o)),n!==i.observedRight&&(i.observedRight&&i.layoutObserver.unobserve(i.observedRight),i.observedRight=n,n&&i.layoutObserver.observe(n))}function bd(){i.layoutObserver?.disconnect(),i.layoutObserver=null,i.layoutWin=null,i.observedEditor=null,i.observedRight=null}function xd(t){i.layoutWatchBound||(i.layoutWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>Fo(t)))}function Io(t,e){const o=t.querySelector(".live-preview-contents");o&&(o.style.paddingBottom=e?`${e}px`:"")}function Po(t){if(!t)return;const e=t.clientHeight,o=t.querySelector("[data-sve-code-bar]"),n=t.querySelector("[data-sve-code-lock-banner]"),s=n&&kd(t)?.getComputedStyle(n).display!=="none"?n.offsetHeight:0,r=Math.max(64,e-(o?.offsetHeight||0)-s),a=t.querySelector("[data-sve-code-panes]");a&&(a.style.height=`${r}px`,a.style.minHeight="0",a.style.overflow="hidden"),t.querySelectorAll("[data-sve-code-host]").forEach(l=>{const c=l.closest("[data-sve-code-pane]");if(!c||c.style.display==="none")return;let d=0;for(const h of c.children)h!==l&&(d+=h.offsetHeight);const f=Math.max(64,r-d);l.style.height=`${f}px`,l.style.maxHeight=`${f}px`,l.style.minHeight="0",l.style.overflow="auto",Sd(l)})}function kd(t){return t.ownerDocument?.defaultView||i.lastWin}function Sd(t){t._sveWheelBound||(t._sveWheelBound=!0,t.addEventListener("wheel",e=>{const o=t.scrollHeight-t.clientHeight,n=t.scrollWidth-t.clientWidth;let s=!1;if(e.deltaY&&o>0){const r=Math.min(o,Math.max(0,t.scrollTop+e.deltaY));r!==t.scrollTop&&(t.scrollTop=r,s=!0)}if(e.deltaX&&n>0){const r=Math.min(n,Math.max(0,t.scrollLeft+e.deltaX));r!==t.scrollLeft&&(t.scrollLeft=r,s=!0)}s&&(e.preventDefault(),e.stopPropagation())},{passive:!1}))}function Ls(){const t=(t.layoutWin||t.lastWin)?.document?.getElementById(u);t&&Po(t);for(const e of at)g[e]?.requestMeasure()}function Fs(t,e){const o=Es(t),n={};for(const s of St){const r=e.querySelector(`[data-sve-code-pane-btn="${s}"]`);n[s]=r?r.getAttribute("aria-pressed")==="true":o[s]}return n}function Is(t,e){for(const n of St){const s=t.querySelector(`[data-sve-code-pane-btn="${n}"]`),r=t.querySelector(`[data-sve-code-pane="${n}"]`);s&&s.setAttribute("aria-pressed",e[n]?"true":"false"),r&&(r.style.display=e[n]?"flex":"none")}const o=St.filter(n=>e[n]);t.querySelectorAll("[data-sve-code-split]").forEach(n=>{const s=n.getAttribute("data-sve-code-split-after"),r=o.indexOf(s);n.style.display=r>=0&&r<o.length-1?"block":"none"}),Ps(t.ownerDocument.defaultView,t),Po(t)}function Ps(t,e){const o=Bs(t);for(const n of St){const s=e.querySelector(`[data-sve-code-pane="${n}"]`);s&&(s.style.flex=`${o[n]} 1 0`)}}function Xt(t,e){if(e.dragging)return;const o=t.document;Ue(o,e);const n=fd(t),s=gd(o),r=yd(o);e.style.left=`${s}px`,e.style.right=`${r}px`,e.style.bottom="0",e.style.height=`${n}px`,Io(o,n),Po(e)}function Os(t,e,o,n){i.dragging=!0,zr(t,e,o,()=>{i.dragging=!1,n?.()},"data-sve-code-drag-shield")}function wd(t,e){if(e._sveResizeBound)return;e._sveResizeBound=!0;const o=n=>{if(n.button!==0||n.target.closest('button, a, input, select, textarea, label, [role="button"], [contenteditable], .cm-editor'))return;n.preventDefault();const s=n.clientY,r=e.getBoundingClientRect().height;let a=r;Os(t,"ns-resize",l=>{a=Math.min(Math.max(lr,r+(s-l.clientY)),Math.round(t.innerHeight*.7)),e.style.height=`${a}px`,Io(t.document,a),Ls()},()=>{hd(t,a),Xt(t,e),t.dispatchEvent(new Event("resize"))})};e.querySelector("[data-sve-code-bar]")?.addEventListener("mousedown",o),e.querySelector("[data-sve-code-grip]")?.addEventListener("mousedown",o)}function _d(t,e){e._sveSplitBound||(e._sveSplitBound=!0,e.querySelectorAll("[data-sve-code-split]").forEach(o=>{o.addEventListener("mousedown",n=>{if(n.button!==0)return;n.preventDefault(),n.stopPropagation();const s=o.getAttribute("data-sve-code-split-after"),r=St.filter(z=>Fs(t,e)[z]),a=r.indexOf(s),l=r[a],c=r[a+1];if(!l||!c)return;const d=e.querySelector(`[data-sve-code-pane="${l}"]`),f=e.querySelector(`[data-sve-code-pane="${c}"]`),h=n.clientX,p=d.getBoundingClientRect().width,x=f.getBoundingClientRect().width,k=p+x;o.setAttribute("data-active",""),Os(t,"col-resize",z=>{const mt=z.clientX-h;let Ht=Math.max(qe,Math.min(k-qe,p+mt)),re=k-Ht;k<qe*2&&(Ht=p,re=x);const _=Bs(t);_[l]=Ht,_[c]=re,md(t,_),Ps(t,e),Ls()},()=>{o.removeAttribute("data-active")})})}))}function $d(t,e){e._svePaneBound||(e._svePaneBound=!0,e.querySelectorAll("[data-sve-code-pane-btn]").forEach(o=>{o.addEventListener("click",n=>{n.stopPropagation();const s=o.getAttribute("data-sve-code-pane-btn"),r=Fs(t,e),a={...r,[s]:!r[s]};!a.html&&!a.css&&!a.js&&(a[s]=!0),pd(t,a),Is(e,a)})}))}function U(t,e){const o=t.getElementById(u)?.querySelector("[data-sve-code-status]");o&&(o.textContent=e||"")}function Ds(t,e){const o=t.getElementById(u)?.querySelector("[data-sve-code-path]");o&&(o.textContent=e||"",o.title=e||"")}function Yt(t){const e=t?.document?.getElementById(u)?.querySelector("[data-sve-code-back]");e&&(e.hidden=i.typeStack.length===0,e.title=m(t,"code_dock_back"),e.setAttribute("aria-label",e.title),e.innerHTML=Id)}function mn(t,e){const o=e.querySelector("[data-sve-code-back]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),os(t)}))}let Y,oo,zs,Hs,Rs,vt,ve,Ot,De,Dt,zt,js,Ws,Ns,qs,Vs,Us,Ks,Gs,Xs,Ys,Zs,Js,Qs,tr,er,no,so,or,Cd,Wt=null,C=null;function Td(){return Wt||(Wt=mr().then(t=>{C=t,Y=C.view.EditorView,oo=C.view.keymap,zs=C.view.lineNumbers,Hs=C.view.highlightActiveLine,Rs=C.view.highlightActiveLineGutter,vt=C.state.Compartment,ve=C.state.EditorState,Ot=C.state.StateField,De=C.state.StateEffect,Dt=C.state.RangeSetBuilder,zt=C.view.Decoration,js=C.commands.defaultKeymap,Ws=C.commands.indentWithTab,Ns=C.commands.historyKeymap,qs=C.commands.history,Vs=C.autocomplete.autocompletion,Us=C.autocomplete.closeBrackets,Ks=C.autocomplete.closeBracketsKeymap,Gs=C.autocomplete.closeCompletion,Xs=C.autocomplete.completionKeymap,Ys=C.view.hoverTooltip,Zs=C.langHtml.htmlLanguage,Js=C.langHtml.html,Qs=C.langCss.css,tr=C.langJs.javascript,C.language.HighlightStyle,C.language.syntaxHighlighting,er=C.language.codeFolding,no=C.language.foldEffect,so=C.language.unfoldEffect,or=C.language.foldedRanges,Cd=C.highlight.tags,qt.html=new vt,qt.css=new vt,qt.js=new vt,Vt.html=new vt,Vt.css=new vt,Vt.js=new vt}).catch(t=>{throw Wt=null,t}),Wt)}const Ad="{{ _class }}",u="__sve-code-dock",Md="__sve-code-dock-style",G="__sve-code-dock-unlock",nr="sve-code-dock-height",sr="sve-code-dock-panes",rr="sve-code-dock-widths",ze="sve-html-scope-v2",ar="sve-code-dock-autosave",ir="sve-code-dock-style-mode",Oo="sve-code-dock-values",Ed=280,lr=120,qe=140,Bd=250,at=["html","css","js"],St=["html","css","alpine","js"],Ld='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',Fd='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-1"/></svg>',Id='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',cr='<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1c0 .966.784 1.75 1.75 1.75h.418A1.74 1.74 0 0 0 4 7.25v1.5c0 .49.201.932.525 1.25c-.324.318-.525.76-.525 1.25v1c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 14 12.25v-1c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1.5c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1A1.75 1.75 0 0 0 12.25 2zm8.5 7.5H8v-3h4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75M7 6.5v3H5.75A.75.75 0 0 1 5 8.75v-1.5a.75.75 0 0 1 .75-.75zm1 4h4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75H8zm-1 0V13H5.75a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-1-5V3h6.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75zm-1 0H3.75A.75.75 0 0 1 3 4.75v-1A.75.75 0 0 1 3.75 3H5z"/></svg>',Pd='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/><path d="M4.5 11.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/></svg>',Od='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 16.3A8.5 8.5 0 1 1 18.3 6.3"/><path d="M21 3.2v5.4h-5.4"/></svg>',Dd='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',zd='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',$="__sve-css-menu",dr=["h1","h2","h3","h4","h5","h6"],ro=[{id:"section",title:"section",tag:"section"},{id:"div",title:"div",tag:"div"},{id:"heading",title:"heading",menu:"heading"},{id:"text",title:"text",menu:"text"},{id:"a",title:"link",tag:"a"},{id:"img",title:"image",snippet:'<img src="" alt="">',caret:10},{id:"svg",title:"svg",tag:"svg"},{id:"ul",title:"list",tag:"ul"},{id:"li",title:"list item",tag:"li"},{id:"component",title:"component",menu:"component"},{id:"loop",title:"loop",snippet:`{{ items }}

{{ /items }}
`,caret:3,select:5},{id:"if",title:"if",snippet:`{{ if true }}

{{ /if }}
`,caret:6,select:4}],Hd=["--size-100","--size-200","--size-300","--size-400","--size-500","--size-600","--size-700","--size-800","--size-900","--gutter"],Rd={"tw-text":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 13 5 3l3.5 10M2.7 10h4.6"/><path d="M12.5 3.5v9M11 5l1.5-1.5L14 5M11 11l1.5 1.5L14 11"/></svg>',"tw-leading":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h8.5M6 8h8.5M6 12.5h8.5"/><path d="M2.5 4.5v7M1.4 5.6 2.5 4.5l1.1 1.1M1.4 10.4l1.1 1.1 1.1-1.1"/></svg>',"tw-font":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.2V3h10v1.2M8 3v10M6 13h4"/></svg>',"tw-radius":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 13.5v-6a5 5 0 0 1 5-5h6"/><path d="M13.5 6.5v7h-7" stroke-dasharray="2 2"/></svg>',"tw-gap":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"tw-align":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3.5h12M2 8h8M2 12.5h10"/></svg>',"tw-w":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3.5v9M14 3.5v9"/><path d="M4.5 8h7"/><path d="M6 6.2 4.2 8 6 9.8M10 6.2 11.8 8 10 9.8"/></svg>',"tw-h":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 2h9M3.5 14h9"/><path d="M8 4.5v7"/><path d="M6.2 6 8 4.2 9.8 6M6.2 10 8 11.8 9.8 10"/></svg>',"tw-maxw":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3v10M14.5 3v10"/><path d="M5 8h6"/><path d="M6.6 6.2 4.8 8l1.8 1.8M9.4 6.2 11.2 8l-1.8 1.8"/></svg>',"tw-overflow":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="1.8" y="4.5" width="8.6" height="9.7" rx="1.2"/><path d="M6.5 1.8h7.7v7.7" stroke-linecap="round"/></svg>',"tw-border":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6"/><rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" stroke-width="1" opacity=".45"/></svg>'},jd='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="10" width="18" height="11" rx="2"/><rect x="6" y="3" width="9" height="4" rx="1.4" fill="currentColor" stroke="none"/></svg>',Wd='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.1 12a8.9 8.9 0 1 0 2.8-6.5L3 8"/><path d="M3 3.4V8h4.6"/><path d="M12 7.4V12l3 1.8"/></svg>',Nd='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>',qd='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></svg>',Vd='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/><path d="M3 17c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/></svg>',ur=[["--gray-50","#fafafa"],["--gray-100","#f5f5f5"],["--gray-200","#e5e5e5"],["--gray-300","#d4d4d4"],["--gray-400","#a3a3a3"],["--gray-500","#737373"],["--gray-600","#525252"],["--gray-700","#404040"],["--gray-800","#262626"],["--gray-900","#171717"],["--gray-950","#0a0a0a"]],vn=t=>[{id:`${t}-all`,icon:"box-all",title:"All sides",css:t,tw:t},{id:`${t}-block`,icon:"box-block",title:"Top and bottom",css:`${t}-block`,tw:`${t}-block`,sep:!0},{id:`${t}-block-start`,icon:"box-block-start",title:"Top",css:`${t}-block-start`,tw:`${t}-top`},{id:`${t}-block-end`,icon:"box-block-end",title:"Bottom",css:`${t}-block-end`,tw:`${t}-bottom`},{id:`${t}-inline`,icon:"box-inline",title:"Left and right",css:`${t}-inline`,tw:`${t}-inline`,sep:!0},{id:`${t}-inline-start`,icon:"box-inline-start",title:"Left",css:`${t}-inline-start`,tw:`${t}-left`},{id:`${t}-inline-end`,icon:"box-inline-end",title:"Right",css:`${t}-inline-end`,tw:`${t}-right`}],Ud=[{id:"display-flex",twClass:"flex",icon:"display-flex",title:"Flex",kind:"display",value:"flex",css:"display"},{id:"flex-row",twClass:"flex-row",icon:"flex-row",title:"Direction: row",kind:"flexDir",value:"row",css:"flex-direction",sep:!0},{id:"flex-col",twClass:"flex-col",icon:"flex-col",title:"Direction: column",kind:"flexDir",value:"column",css:"flex-direction"},{id:"justify-start",twClass:"justify-start",icon:"justify-start",title:"Justify: start",css:"justify-content",value:"flex-start",when:"flex",sep:!0},{id:"justify-center",twClass:"justify-center",icon:"justify-center",title:"Justify: center",css:"justify-content",value:"center",when:"flex"},{id:"justify-end",twClass:"justify-end",icon:"justify-end",title:"Justify: end",css:"justify-content",value:"flex-end",when:"flex"},{id:"justify-between",twClass:"justify-between",icon:"justify-between",title:"Justify: between",css:"justify-content",value:"space-between",when:"flex"},{id:"justify-around",twClass:"justify-around",icon:"justify-around",title:"Justify: around",css:"justify-content",value:"space-around",when:"flex"},{id:"align-start",twClass:"items-start",icon:"align-start",title:"Align: start",css:"align-items",value:"flex-start",when:"flex",sep:!0},{id:"align-center",twClass:"items-center",icon:"align-center",title:"Align: center",css:"align-items",value:"center",when:"flex"},{id:"align-end",twClass:"items-end",icon:"align-end",title:"Align: end",css:"align-items",value:"flex-end",when:"flex"},{id:"align-stretch",twClass:"items-stretch",icon:"align-stretch",title:"Align: stretch",css:"align-items",value:"stretch",when:"flex"}],Kd=[{id:"gap-all",icon:"gap-all",title:"Both",css:"gap",tw:"gap",menu:"spacing"},{id:"gap-row",icon:"gap-row",title:"Between rows",css:"row-gap",tw:"row-gap",menu:"spacing",sep:!0},{id:"gap-col",icon:"gap-col",title:"Between columns",css:"column-gap",tw:"column-gap",menu:"spacing"}],Gd=[{id:"bd-all",icon:"bd-all",title:"All sides",css:"border-color",tw:"border-color",menu:"colors"},{id:"bd-block",icon:"bd-block",title:"Top and bottom",css:"border-block-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-top",icon:"bd-top",title:"Top",css:"border-block-start-color",tw:"border-top-color",menu:"colors"},{id:"bd-bottom",icon:"bd-bottom",title:"Bottom",css:"border-block-end-color",tw:"border-bottom-color",menu:"colors"},{id:"bd-inline",icon:"bd-inline",title:"Left and right",css:"border-inline-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-left",icon:"bd-left",title:"Left",css:"border-inline-start-color",tw:"border-left-color",menu:"colors"},{id:"bd-right",icon:"bd-right",title:"Right",css:"border-inline-end-color",tw:"border-right-color",menu:"colors"}],Xd=[{id:"rd-all",icon:"rd-all",title:"All corners",css:"border-radius",tw:"border-radius",menu:"values"},{id:"rd-tl",icon:"rd-tl",title:"Top left",css:"border-start-start-radius",tw:"border-top-left-radius",menu:"values",sep:!0},{id:"rd-tr",icon:"rd-tr",title:"Top right",css:"border-start-end-radius",tw:"border-top-right-radius",menu:"values"},{id:"rd-br",icon:"rd-br",title:"Bottom right",css:"border-end-end-radius",tw:"border-bottom-right-radius",menu:"values"},{id:"rd-bl",icon:"rd-bl",title:"Bottom left",css:"border-end-start-radius",tw:"border-bottom-left-radius",menu:"values"}],fr=[{id:"display",title:"Display",css:"display",tw:"display",kids:Ud},{id:"absolute",title:"Position",css:"position",tw:"position",value:"absolute"},{id:"color",title:"Text color",css:"color",tw:"color",menu:"colors"},{id:"bg",title:"Background color",css:"background-color",tw:"background-color",menu:"colors"},{id:"padding",title:"Padding",css:"padding",tw:"padding",kids:vn("padding")},{id:"margin",title:"Margin",css:"margin",tw:"margin",kids:vn("margin")},{id:"tw-text",title:"Font size",css:"font-size",tw:"font-size",menu:"values"},{id:"tw-leading",title:"Line height",css:"line-height",tw:"line-height",menu:"values"},{id:"tw-font",title:"Font family",css:"font-family",tw:"font-family",menu:"values"},{id:"tw-align",title:"Text align",css:"text-align",tw:"text-align",menu:"choices",choices:["left","center","right","justify"]},{id:"tw-border",title:"Border color",css:"border-color",tw:"border-color",kids:Gd},{id:"tw-radius",title:"Radius",css:"border-radius",tw:"border-radius",kids:Xd},{id:"tw-gap",title:"Gap",css:"gap",tw:"gap",kids:Kd},{id:"tw-w",title:"Width",css:"width",tw:"width",menu:"sizes"},{id:"tw-h",title:"Height",css:"height",tw:"height",menu:"sizes"},{id:"tw-maxw",title:"Max width",css:"max-width",tw:"max-width",menu:"sizes"},{id:"tw-overflow",title:"Overflow",css:"overflow",tw:"overflow",menu:"choices",choices:["visible","hidden","clip","auto","scroll"]}],Yd=["100%","auto","fit-content","min-content","max-content","100vw","100dvh","0"],ge=new Map;for(const t of fr){ge.set(t.id,{tool:t,kid:null});for(const e of t.kids||[])ge.set(e.id,{tool:t,kid:e})}const gn={display:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2.5" width="13" height="11" rx="1.2"/><path d="M5 6.5h6M5 9.5h4"/></svg>',"display-flex":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="3.4" height="9" rx=".4"/><rect x="6.3" y="3.5" width="3.4" height="9" rx=".4"/><rect x="10.6" y="3.5" width="3.4" height="9" rx=".4"/></svg>',"flex-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12"/><path d="M4.2 5.8 2 8l2.2 2.2"/><path d="M11.8 5.8 14 8l-2.2 2.2"/></svg>',"flex-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v12"/><path d="M5.8 4.2 8 2l2.2 2.2"/><path d="M5.8 11.8 8 14l2.2-2.2"/></svg>',"justify-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="5.4" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4.6" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="8.2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-between":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-around":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"align-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="5.4" width="9" height="2.4" rx=".4"/></svg>',"align-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="4.6" width="9" height="2.4" rx=".4"/><rect x="3.5" y="9" width="9" height="2.4" rx=".4"/></svg>',"align-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="8.2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="11.6" width="9" height="2.4" rx=".4"/></svg>',"align-stretch":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx=".5"/><rect x="9" y="2" width="4" height="12" rx=".5"/></svg>',absolute:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>',color:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.4 11.2 7.4 2.4l4 8.8"/><path d="M4.7 8.4h5.4"/><rect x="1.6" y="12.8" width="12.8" height="2.2" rx=".6" fill="currentColor" stroke="none"/></svg>',bg:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 1.9a6.1 6.1 0 1 0 0 12.2c.85 0 1.35-.55 1.35-1.25 0-.38-.18-.66-.4-.88a1.2 1.2 0 0 1 .85-2.05h1.3A3.5 3.5 0 0 0 14.1 6.1C14.1 3.75 11.4 1.9 8 1.9Z"/><circle cx="4.9" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="8" cy="4.8" r=".95" fill="currentColor" stroke="none"/><circle cx="11.1" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="4.7" cy="9.9" r=".95" fill="currentColor" stroke="none"/></svg>',padding:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/></svg>',margin:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/><path d="M2 2.5h12M2 13.5h12M2.5 2v12M13.5 2v12" stroke-dasharray="1.4 1.2"/></svg>',"box-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".4" fill="currentColor" stroke="none"/></svg>',"box-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"gap-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"gap-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="3" y="1.6" width="10" height="4.2" rx=".6"/><rect x="3" y="10.2" width="10" height="4.2" rx=".6"/><path d="M4.5 8h7"/></svg>',"gap-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"bd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4"/></svg>',"bd-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-top":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-bottom":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-left":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-right":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"rd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="3.4"/></svg>',"rd-tl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6H6a3.4 3.4 0 0 0-3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M2.6 9V6A3.4 3.4 0 0 1 6 2.6h3" stroke-width="2.2"/></svg>',"rd-tr":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6h7.4a3.4 3.4 0 0 1 3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M7 2.6h3A3.4 3.4 0 0 1 13.4 6v3" stroke-width="2.2"/></svg>',"rd-br":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6v7.4a3.4 3.4 0 0 1-3.4 3.4H2.6" stroke-width="1" opacity=".35"/><path d="M13.4 7v3a3.4 3.4 0 0 1-3.4 3.4H7" stroke-width="2.2"/></svg>',"rd-bl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6v7.4a3.4 3.4 0 0 0 3.4 3.4h7.4" stroke-width="1" opacity=".35"/><path d="M2.6 7v3A3.4 3.4 0 0 0 6 13.4h3" stroke-width="2.2"/></svg>'},g={html:null,css:null,js:null},qt={html:null,css:null,js:null},Vt={html:null,css:null,js:null};export{yu as ARMED_KEY,Od as AUTOSAVE_ICON,ar as AUTOSAVE_KEY,Id as BACK_ICON,zd as CSS_ADD_ICON,ur as CSS_GRAYS,Yd as CSS_LENGTHS,$ as CSS_MENU_ID,Nd as CSS_MODE_ICON,Bo as CSS_SIZE_KEY,Hd as CSS_SPACING,Lo as CSS_STATES,to as CSS_STATE_KEY,fr as CSS_TOOLS,gn as CSS_TOOL_ICONS,ge as CSS_TOOL_INDEX,Pd as DATA_ICON,F as DATA_MENU_ID,Ed as DEFAULT_HEIGHT,u as DOCK_ID,zt as Decoration,ve as EditorState,Y as EditorView,at as HANDLES,nr as HEIGHT_KEY,Wd as HISTORY_ICON,dr as HTML_HEADINGS,ro as HTML_TOOLS,qd as ID_MODE_ICON,Ld as LOCK_CLOSED_ICON,Fd as LOCK_OPEN_ICON,lr as MIN_HEIGHT,qe as MIN_PANE,St as PANES,sr as PANES_KEY,Dt as RangeSetBuilder,Dd as SAVE_ICON,Bd as SAVE_MS,Ad as SCOPE_CLASS,cr as SCOPE_ICON,ze as SCOPE_KEY,jd as STRIP_ICON,Md as STYLE_ID,ir as STYLE_MODE_KEY,De as StateEffect,Ot as StateField,Vd as TW_MODE_ICON,Rd as TW_TOOL_ICONS,G as UNLOCK_ID,Oo as VALUES_MODE_KEY,rr as WIDTHS_KEY,oe as applyCssFolds,Jt as applyCssScope,Nl as applyDisplay,Wl as applyFlexDirection,cs as applyHtmlTag,Z as applyRuleDecls,_s as applyStyleMode,Vs as autocompletion,xo as autosaveEnabled,rd as bindAntlersSnippets,tn as bindAutosave,mn as bindBack,Ol as bindCssAddClass,zc as bindCssTools,sd as bindDataVars,Fc as bindHistory,en as bindHtmlScope,Rc as bindHtmlTidy,jc as bindHtmlTools,xd as bindLayoutWatch,Qo as bindLock,$d as bindPaneToggles,wd as bindResize,_d as bindSplitters,Lc as bindStrip,Dc as bindStyleMode,id as bindVisualEditSnippets,Me as clearHtmlScopeRange,Us as closeBrackets,Ks as closeBracketsKeymap,Ts as closeCodeDock,pu as closeCodeDockPopups,Gs as closeCompletion,w as closeCssMenu,bt as closeDataMenu,C as cm,mu as codeDockStyleMode,er as codeFolding,As as collectionViewType,Xs as completionKeymap,Qs as css,ds as cssEditorText,Be as cssRuleAtCursor,xs as cssSizeRow,pt as cssSizeRows,Ie as cssStateSuffix,Q as currentFlexDecls,It as currentFullHtml,ts as currentSectionValues,$t as currentTemplateType,js as defaultKeymap,gt as dispatchHtmlChanges,Vt as editableOf,g as editors,vd as ensureStyle,Jn as ensureTwCss,ws as enterValuesRule,N as finishHtmlEdit,Sl as flushBracketSync,lt as flushCssScope,wl as flushCssToHtml,et as flushSave,no as foldEffect,or as foldedRanges,os as goBackTemplate,Hs as highlightActiveLine,Rs as highlightActiveLineGutter,qs as history,Ns as historyKeymap,Ys as hoverTooltip,Js as html,rs as htmlEditorText,Qt as htmlElementAtCursor,_e as htmlFocusOk,Zs as htmlLanguage,Zt as htmlScopeEnabled,_t as htmlTargetFromCursor,Le as indentFromPrevious,Ws as indentWithTab,Nc as insertAiSnippet,Bt as insertHtmlSnippet,Tr as isCodeDockArmed,ht as isCodeDockLocked,Cs as isCodeDockOpen,ud as isPanelFrame,tr as javascript,oo as keymap,dd as languageOf,yt as leadingCssIndent,it as lineIndentOf,zs as lineNumbers,Td as loadCm,Pe as loadTemplate,Sc as mountEditor,ks as newSizeBlockSpot,Qe as newSizeQuery,D as normalizeFlexValue,Fo as observeDockLayout,nt as onEditorInput,Kl as openCssChoiceMenu,Ul as openCssColorMenu,Gl as openCssSpacingMenu,cn as openCssValueMenu,Ms as openDataVarsMenu,Fl as openHtmlComponentMenu,rn as openHtmlTagMenu,es as openNestedTemplate,$l as openRenameClassMenu,Fe as paintAlpine,ft as paintAutosave,Yt as paintBack,ne as paintCssHead,Ao as paintCssIdMark,P as paintCssToolState,wc as paintHostWait,K as paintHtmlScope,Ee as paintHtmlToolState,Et as paintLock,Is as paintPaneButtons,Gt as paintStrip,Eo as paintStyleMode,Mo as paintValuesMode,j as placeCssMenu,Xt as placeDock,Io as previewBottomPad,qt as readOnlyOf,$o as readParts,Vc as refreshCodeDockFromDisk,ko as refreshPreview,Uc as relayoutCodeDock,Ce as rememberBracketNames,Pt as rememberCssSelectors,xl as resetTailwindCompile,Co as sameParts,bu as setCodeDockArmed,Ds as setPath,U as setStatus,Pc as setValuesMode,pn as shieldDock,_o as showHtmlFull,wo as showHtmlScope,bd as stopObservingDockLayout,Es as storedPanes,Yc as syncCodeDock,Ge as syncHtmlTree,$e as syncScopedHtml,se as syncTwTarget,Cd as tags,Cr as templateDockAllowed,ls as tidyHtmlPane,so as unfoldEffect,Te as writeHandleEditor,Ae as writeHtmlEditor,te as writeParts};
