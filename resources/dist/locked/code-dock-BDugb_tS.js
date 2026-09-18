const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-DjrKc54-.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{v as vr,l as gr}from"./codemirror-lDYhtWoa.js";import{o as y,a as b,b as v,t as A,F as P,d as V,k as dt,c as Rt,l as bn,p as Ke,w as xn,q as Tt,s as L,v as kn,g as j,x as yr,y as xt,z as Sn,A as be,f as wn,r as co,u as T,B as je,_ as _n,n as br,D as J,E as U,h as m,j as xr,C as kr,i as $n,G as Sr,H as zo,I as wr,J as tt,K as kt,L as Ro,M as _r,m as N,O as uo,P as Cn,Q as $r,R as Cr,S as Tn,T as fo,U as _t,V as ho,W as Tr,X as Ar,Y as Mr,Z as Er,$ as jo,a0 as We,a1 as Ge,a2 as Xe,a3 as Br,a4 as Lr,a5 as Fr,a6 as Ir,a7 as Or,a8 as Pr,a9 as Dr,aa as I,ab as Hr,ac as Wo,ad as zr}from"./addon-guaojx3J.js";import{ae as ku,af as Su}from"./addon-guaojx3J.js";import{p as xe,f as Rr,t as An,c as jr,a as Mn,b as Wr,d as Nr,e as qr,g as Vr,h as No,i as Ur,j as En,k as Kr,l as Gr,m as Xr,n as Yr,s as Zr,o as Bn,q as Jr,r as Ye,u as Qr,H as Ln,v as ta,w as ea,T as oa,x as Fn,y as na,z as sa,A as qo,P as ae}from"./tw-classes-BbK_xLuX.js";import{t as ra}from"./tw-candidates-wYTeDvRv.js";import{h as aa,a as ia,e as la,A as ca,b as da,i as po,c as ua,d as ue}from"./html-tag-sync-D4MA50-d.js";import{M as In,S as On}from"./protocol-DII9whUt.js";import"./ai-text-icon-B7uCWIwa.js";import"./html-pick-align-CK-9iH9_.js";import"./index-Dpuj8sxX.js";import"./index-B5fiB6ig.js";import"./index-QkwZ_wP2.js";import"./index-CY0AOW5Y.js";import"./index-gYg9gdv3.js";import"./index-lzvKgifK.js";import"./index-BBw1nzv2.js";import"./index-DqbOpr3Y.js";import"./index-C_pm8ee_.js";import"./index-B8kpdD8S.js";const Pn=/^\.[a-zA-Z_][\w-]*$/;function mo(t){const e=String(t||""),o=/(^|\s)\[/g;let n;for(;n=o.exec(e);){const s=n.index+n[1].length,a=/\](?=\s|$)/g;a.lastIndex=s+1;const i=a.exec(e);if(i)return{from:s,to:i.index+1,innerFrom:s+1,innerTo:i.index}}return null}function Dn(t){const e=String(t||""),o=mo(e);return o?e.slice(o.innerFrom,o.innerTo).replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).filter(n=>/^[a-zA-Z_][\w-]*$/.test(n)):[]}function Hn(t){const e=String(t||"").match(/\sclass\s*=\s*(["'])([^"']*)\1/i);return e?Dn(e[2]):[]}function fa(t){return Hn(t)[0]||""}function ke(t){const e=String(t||""),o=[],n=/\sclass\s*=\s*(["'])/gi;let s;for(;s=n.exec(e);){const a=s[1],i=s.index+s[0].length,l=e.indexOf(a,i);if(l===-1)break;const c=e.slice(i,l),d=mo(c);if(d){const f=c.slice(d.innerFrom,d.innerTo),h=i+d.innerFrom,p=f.replace(/\{\{[\s\S]*?\}\}/g,H=>" ".repeat(H.length)),x=/[a-zA-Z_][\w-]*/g;let k;for(;k=x.exec(p);)o.push({name:k[0],from:h+k.index,to:h+k.index+k[0].length})}n.lastIndex=l+1}return o}function Vo(t,e){return ke(t).find(o=>e>=o.from&&e<=o.to)||null}function Uo(t,e){const o=String(t||""),n=ke(o);let s=o;for(let a=n.length-1;a>=0;a-=1){const i=n[a],l=e(i.name);if(l!==i.name){if(!l){let c=i.from,d=i.to;s[d]===" "?d+=1:c>0&&s[c-1]===" "&&(c-=1),s=s.slice(0,c)+s.slice(d);continue}s=s.slice(0,i.from)+l+s.slice(i.to)}}return s}function zn(t){const e=[],o=/(^|[^\w-])\.([a-zA-Z_][\w-]*)\s*\{/g;let n;for(;n=o.exec(String(t||""));)e.push(n[2]);return e}function Rn(t,e){const o=[],n=[],s=[];let a=0,i=0;for(;a<t.length&&i<e.length;){if(t[a]===e[i]){a+=1,i+=1;continue}const l=e.indexOf(t[a],i),c=t.indexOf(e[i],a);l===-1&&c===-1?(o.push({from:t[a],to:e[i]}),a+=1,i+=1):l===-1?(s.push(t[a]),a+=1):c===-1||l<=c?(n.push(e[i]),i+=1):(s.push(t[a]),a+=1)}for(;a<t.length;)s.push(t[a]),a+=1;for(;i<e.length;)n.push(e[i]),i+=1;return{renamed:o,added:n,removed:s}}function St(t){let e=String(t||"").trim().replace(/^\.+/,"").replace(/\s+/g,"-").replace(/[^a-zA-Z0-9_-]/g,"");return/^[a-zA-Z_]/.test(e)||(e=e.replace(/^[^a-zA-Z_]+/,"")),Pn.test(`.${e}`)?e:""}function ha(t,e){const o=String(t||""),n=St(e);if(!o||!n)return o;const s=o.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(s){const a=s[1];let i=s[2];const l=mo(i);if(l){const c=i.slice(l.innerFrom,l.innerTo).trim(),f=Dn(i).includes(n)?c:`${c} ${n}`.trim();i=`${i.slice(0,l.from)}[ ${f} ]${i.slice(l.to)}`}else i=`[ ${n} ] ${i}`.trim();return o.slice(0,s.index)+` class=${a}${i}${a}`+o.slice(s.index+s[0].length)}return/\/\s*>$/.test(o)?o.replace(/(\s*)(\/\s*>)$/,` class="[ ${n} ]"$1$2`):o.replace(/(\s*)>$/,` class="[ ${n} ]"$1>`)}function pa(t,e){const o=String(t).indexOf(">",e.from);return o===-1?"":t.slice(e.from,o+1)}function jn(t,e){const o=[];for(const n of e){const s=Hn(pa(t,n)),a=jn(t,n.children||[]);if(s.length){o.push({className:s[0],children:a});for(const i of s.slice(1))o.push({className:i,children:[]})}else o.push(...a)}return o}function Se(t){return jn(t,xe(t))}function fe(t){return String(t).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function vo(t,e){if(t.startsWith("/*",e)){const o=t.indexOf("*/",e+2);return o===-1?t.length:o+2}return e}function Lt(t,e){let o=0;for(let n=e;n<t.length;n+=1){if(t.startsWith("/*",n)){n=vo(t,n)-1;continue}if(t[n]==="{")o+=1;else if(t[n]==="}"&&(o-=1,o===0))return n}return-1}function X(t,e){const o=String(t||""),n=new RegExp(`(^|[^\\w-])\\.${fe(e)}\\s*\\{`,"g");let s;for(;s=n.exec(o);){const a=s.index+s[1].length,i=o.indexOf("{",a);if(i===-1)continue;const l=Lt(o,i);if(l!==-1)return{from:a,brace:i,close:l,to:l+1,name:e}}return null}function ma(t){const e=String(t||""),o=[],n={},s=[];let a=0,i="";const l=()=>{const c=i.trim();c&&o.push(c),i=""};for(;a<e.length;){if(e.startsWith("/*",a)){const c=vo(e,a);i+=e.slice(a,c),a=c;continue}if(e[a]==="{"){const c=i.trim(),d=Lt(e,a);if(d===-1)break;const f=e.slice(a+1,d);i="",Pn.test(c)?n[c.slice(1)]=f:c&&s.push(`${c} {${f}}`),a=d+1;continue}i+=e[a],a+=1}return l(),{decls:o.join(`
`),classes:n,other:s}}function Ko(t,e){const o="    ".repeat(e);return String(t||"").split(`
`).map(n=>n.trim()?o+n.trim():"").filter((n,s,a)=>n||s>0&&s<a.length-1).join(`
`)}function va(t,e){const o=X(t,e);return o?String(t).slice(o.brace+1,o.close):""}function Wn(t,e,o){const n=ma(va(e,t.className)),s="    ".repeat(o),a=[];n.decls&&a.push(Ko(n.decls.replace(/;+\s*$/,";"),o+1));for(const l of n.other)a.push(Ko(l,o+1));for(const l of t.children)a.push(Wn(l,e,o+1));const i=a.filter(Boolean).join(`
`);return i?`${s}.${t.className} {
${i}
${s}}`:`${s}.${t.className} {
${s}}`}function go(t,e){return e?.length?e.map(o=>Wn(o,t,0)).join(`

`)+`
`:""}function Nn(t){const e=String(t||"").match(/^\s*\.([a-zA-Z_][\w-]*)\s*\{/);return e?e[1]:""}function ga(t){const e=[],o=/\.([a-zA-Z_][\w-]*)\s*\{/g;let n,s=!0;for(;n=o.exec(String(t||""));){if(s){s=!1;continue}e.push(n[1])}return e}function ya(t,e){const o=String(t).lastIndexOf(`
`,e-1)+1,n=t.slice(o,e);return/^\s*$/.test(n)?n:""}function ba(t,e){return e?t.split(`
`).map((o,n)=>n===0||!o?o:e+o).join(`
`):t}function xa(t,e){let o=0;for(let n=0;n<e.from;n+=1){if(t.startsWith("/*",n)){n=vo(t,n)-1;continue}t[n]==="{"?o+=1:t[n]==="}"&&(o-=1)}return o===0}function yo(t,e,o){const n=Nn(e)||o;if(!n)return String(t||"");let s=String(e||"").trim();s?new RegExp(`^\\.${fe(n)}\\s*\\{`).test(s)||(s=`.${n} {
${s}
}`):s=`.${n} {
}`;let a=String(t||"");const i=X(a,n),l=ga(s);if(i){const d=ya(a,i.from);a=a.slice(0,i.from)+ba(s,d)+a.slice(i.to)}else a=`${a.trimEnd()}${a.trim()?`
`:""}${s}
`;const c=X(a,n);if(!c)return a;for(const d of[...new Set(l)].reverse()){const f=new RegExp(`(^|[^\\w-])\\.${fe(d)}\\s*\\{`,"g"),h=[];let p;for(;p=f.exec(a);){const x=p.index+p[1].length,k=a.indexOf("{",x),H=Lt(a,k);H!==-1&&h.push({from:x,to:H+1})}for(const x of h.reverse()){if(x.from>=c.from&&x.to<=c.to||!xa(a,x))continue;let k=x.from;const H=a.lastIndexOf(`
`,k-1)+1;/^\s*$/.test(a.slice(H,k))&&(k=H);let mt=x.to;a[mt]===`
`&&(mt+=1),a=a.slice(0,k)+a.slice(mt)}}return a}function Ne(t,e){const o=String(t||"");return`${o.trimEnd()}${o.trim()?`
`:""}.${e} {
}
`}function ka(t,e,o){const n=St(o);return!e||!n||e===n?String(t||""):X(t,n)?qn(t,e):String(t||"").replace(new RegExp(`(^|[^\\w-])\\.${fe(e)}(\\s*\\{)`,"g"),`$1.${n}$2`)}function qn(t,e){let o=String(t||"");for(;;){const n=X(o,e);if(!n)break;let s=n.from;const a=o.lastIndexOf(`
`,s-1)+1;/^\s*$/.test(o.slice(a,s))&&(s=a);let i=n.to;o[i]===`
`&&(i+=1),o=o.slice(0,s)+o.slice(i)}return o}function Sa(t,e,o){const n=Array.isArray(e)?e:[],s=Array.isArray(o)?o:[],{renamed:a,added:i}=Rn(n,s),l=new Set(s);let c=String(t||"");for(const d of a){const f=St(d.to);if(f){if(l.has(d.from)){X(c,f)||(c=Ne(c,f));continue}X(c,d.from)?c=ka(c,d.from,f):X(c,f)||(c=Ne(c,f))}}for(const d of i){const f=St(d);!f||X(c,f)||(c=Ne(c,f))}return c}function wa(t,e,o){const n=new Set(Array.isArray(e)?e:[]),s=new Set(Array.isArray(o)?o:[]);let a=String(t||"");for(const i of s)n.has(i)||(a=qn(a,i));return a}const st="__sve-css-rename-chip",_a='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';function $a(t){const e=t.Decoration.mark({class:"sve-cm-css-token"}),o=t.StateEffect.define();return{extensions:[t.StateField.define({create(){return t.Decoration.none},update(s,a){let i;for(const c of a.effects)c.is(o)&&(i=c.value);if(i===void 0)return a.docChanged?t.Decoration.none:s;if(!i)return t.Decoration.none;const l=new t.RangeSetBuilder;return l.add(i.from,i.to,e),l.finish()},provide:s=>t.EditorView.decorations.from(s)})],setHover(s,a){s&&s.dispatch({effects:o.of(a)})}}}function rt(t){t?.getElementById(st)?.remove()}function Ca(t,e,o,n){e.style.left=`${Math.max(6,Math.min(o,t.innerWidth-28))}px`,e.style.top=`${Math.max(6,n)}px`}function Ta(t,e,o,{onRename:n,title:s}){const a=t.document,i=e.coordsAtPos(o.to);if(!i)return;rt(a);const l=a.createElement("button");l.id=st,l.type="button",l.innerHTML=_a,l.title=s,l.setAttribute("aria-label",s),l.addEventListener("mousedown",c=>{c.preventDefault(),c.stopPropagation(),rt(a),n?.(o)}),l.addEventListener("mouseleave",()=>{t.setTimeout(()=>{e.dom.matches(":hover")||l.matches(":hover")||rt(a)},120)}),a.body.appendChild(l),Ca(t,l,i.right+2,i.top-1)}function Aa(t,e,{onRename:o,isLocked:n,setHover:s,title:a}){if(!e?.dom||e.dom._sveClassTokenBound)return;e.dom._sveClassTokenBound=!0;let i=null,l="";const c=()=>!!n?.(),d=()=>{t.clearTimeout(i),i=null,l="",s?.(e,null),rt(t.document)},f=h=>{if(c()){d();return}d(),o?.(h)};e.dom.addEventListener("mousemove",h=>{if(c()){d();return}if(h.target?.closest?.(`#${st}`))return;const p=e.posAtCoords({x:h.clientX,y:h.clientY});if(p==null)return;const x=Vo(e.state.doc.toString(),p);if(!x){t.clearTimeout(i),i=null,l="",s?.(e,null);return}const k=`${x.from}:${x.to}:${x.name}`;s?.(e,{from:x.from,to:x.to}),!(l===k&&(i||t.document.getElementById(st)))&&(t.clearTimeout(i),l=k,i=t.setTimeout(()=>{i=null,Ta(t,e,x,{onRename:f,title:a||"Rename class"})},160))}),e.dom.addEventListener("mouseleave",h=>{h.relatedTarget?.closest?.(`#${st}`)||t.setTimeout(()=>{t.document.getElementById(st)?.matches(":hover")||d()},160)}),e.dom.addEventListener("dblclick",h=>{if(c())return;const p=e.posAtCoords({x:h.clientX,y:h.clientY});if(p==null)return;const x=Vo(e.state.doc.toString(),p);x&&(h.preventDefault(),h.stopPropagation(),f(x))},!0),e.scrollDOM?.addEventListener("scroll",d),t.document._sveClassTokenDismiss||(t.document._sveClassTokenDismiss=!0,t.document.addEventListener("mousedown",h=>{h.target.closest(`#${st}`)||rt(t.document)}))}const r={cssColorsPromise:null,lastUid:null,lastType:null,typeStack:[],lastParts:{html:"",css:"",js:""},lastProps:[],propsDirty:!1,lastLocked:!1,lockReady:!1,lastWin:null,loadGen:0,saveTimer:null,lastBracketNames:null,lastCssSelectorNames:null,saveInFlight:null,dragging:!1,applying:!1,htmlScopePref:!0,htmlScopeActive:!1,styleMode:"css",cssToolRow:null,cssOpenTool:"",cssOpenMenu:"",cssValues:!1,twCss:null,twKey:"",twBusy:!1,twDirty:!1,htmlFocus:null,htmlFull:"",cssFull:"",cssPane:"full",cssScopeSnapshot:"",layoutObserver:null,layoutWin:null,observedEditor:null,observedRight:null,layoutWatchBound:!1,cssSize:"",cssState:"",cssOwnFolds:new Set,cssFoldSig:"",htmlPartialUi:null,htmlAntlersUi:null,htmlClassTokenUi:null,cssGhostUi:null},Ma=["aria-label"],Ea={value:""},Ba=["label"],La=["value"],Vn={__name:"CodeDockAntlersSelect",props:{label:{type:String,required:!0},groups:{type:Array,required:!0},onPick:{type:Function,required:!0}},setup(t){const e=t;function o(n){const s=n.target.value;n.target.value="",s&&e.onPick(s)}return(n,s)=>(y(),b("select",{"data-sve-antlers-select":"","aria-label":t.label,onChange:o},[v("option",Ea,A(t.label),1),(y(!0),b(P,null,V(t.groups,a=>(y(),b("optgroup",{key:a.id,label:a.label},[(y(!0),b(P,null,V(a.items,i=>(y(),b("option",{key:i.id,value:i.id},A(i.label),9,La))),128))],8,Ba))),128))],40,Ma))}},Fa={"data-sve-data-search":""},Ia=["placeholder","aria-label","onKeydown"],Oa={"data-sve-data-tabs":""},Pa=["data-active","onClick"],Da={key:0,"data-sve-data-empty":""},Ha={key:0,"data-sve-data-group":""},za=["data-cursor","title","onMouseenter","onClick"],Ra={"data-sve-data-name":""},ja={key:0,"data-sve-data-parent":""},Wa={key:1,"data-sve-data-loop":""},Na={key:2,"data-sve-data-value":""},qa={__name:"CodeDockDataVars",props:{title:{type:String,default:""},placeholder:{type:String,default:""},emptyText:{type:String,default:""},noSectionText:{type:String,default:""},loopText:{type:String,default:""},tabs:{type:Array,required:!0},data:{type:Object,required:!0},onPick:{type:Function,required:!0}},setup(t){const e=t,o=dt(""),n=dt(null),s=dt(e.tabs[0]?.id||"section"),a=dt(null),i=dt(-1),l=dt(!1),c=Rt(()=>o.value.trim().toLowerCase()),d=Rt(()=>{const _=e.data[s.value]||[];return Array.isArray(_)&&_.length&&_[0]?.items?_:[{handle:s.value,label:"",items:_,bare:!0}]}),f=Rt(()=>{const _=c.value;return d.value.map(S=>({...S,items:(S.items||[]).filter(M=>!_||M.var.toLowerCase().includes(_)||String(M.label||"").toLowerCase().includes(_)||String(M.parent||"").toLowerCase().includes(_))})).filter(S=>S.items.length)}),h=Rt(()=>f.value.flatMap(_=>_.items.map(S=>({row:S,group:_})))),p=Rt(()=>!h.value.length);bn(()=>Ke(()=>n.value?.focus()));function x(_){l.value=!0;const S=h.value.length;if(!S){i.value=-1;return}const M=i.value+_;i.value=M<0?-1:Math.min(M,S-1),Ke(()=>k())}function k(){const _=a.value?.querySelector("[data-cursor]");if(!_)return;let S=_.parentElement;for(;S&&S.scrollHeight<=S.clientHeight;)S=S.parentElement;if(!S)return;const M=_.offsetTop,z=M+_.offsetHeight;M<S.scrollTop?S.scrollTop=M:z>S.scrollTop+S.clientHeight&&(S.scrollTop=z-S.clientHeight)}function H(_){return h.value.findIndex(S=>S.row===_)}function mt(_){l.value||(i.value=H(_))}function zt(){const _=i.value>=0?h.value[i.value]:null;_&&e.onPick(_.row,_.group)}function re(_){s.value=_,i.value=-1}return(_,S)=>(y(),b(P,null,[v("div",Fa,[S[6]||(S[6]=v("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[v("circle",{cx:"11",cy:"11",r:"7"}),v("path",{d:"m20 20-3.5-3.5"})],-1)),xn(v("input",{ref_key:"input",ref:n,"data-sve-data-input":"","onUpdate:modelValue":S[0]||(S[0]=M=>o.value=M),type:"text",placeholder:t.placeholder,"aria-label":t.title,onInput:S[1]||(S[1]=M=>i.value=-1),onKeydown:[S[2]||(S[2]=Tt(L(M=>x(1),["prevent"]),["down"])),S[3]||(S[3]=Tt(L(M=>x(-1),["prevent"]),["up"])),Tt(L(zt,["prevent"]),["enter"]),S[4]||(S[4]=Tt(L(()=>{},["stop"]),["escape"]))]},null,40,Ia),[[kn,o.value]])]),v("div",Oa,[(y(!0),b(P,null,V(t.tabs,M=>(y(),b("button",{key:M.id,type:"button","data-sve-data-tab":"","data-active":s.value===M.id?"":void 0,onClick:L(z=>re(M.id),["prevent","stop"])},A(M.label),9,Pa))),128))]),p.value?(y(),b("div",Da,A(s.value==="section"&&!(t.data.section||[]).length?t.noSectionText:t.emptyText),1)):j("",!0),v("div",{ref_key:"rowsEl",ref:a,onMousemove:S[5]||(S[5]=M=>l.value=!1)},[(y(!0),b(P,null,V(f.value,M=>(y(),b(P,{key:M.handle},[M.bare?j("",!0):(y(),b("div",Ha,A(M.label),1)),(y(!0),b(P,null,V(M.items,z=>(y(),b("button",{key:M.handle+"::"+z.var+"::"+(z.parent||""),type:"button","data-sve-data-option":"","data-cursor":H(z)===i.value?"":void 0,title:z.label,onMouseenter:mr=>mt(z),onClick:L(mr=>t.onPick(z,M),["prevent","stop"])},[v("span",Ra,A(z.var),1),z.parent?(y(),b("span",ja,A(z.parent),1)):j("",!0),z.loop?(y(),b("span",Wa,A(t.loopText),1)):z.value?(y(),b("span",Na,A(z.value),1)):j("",!0)],40,za))),128))],64))),128))],544)],64))}},At=new Map,Go={scope:null,section:[],page:[],site:[]};function Va(t){const e=t?.location?.pathname?.match(/\/collections\/([^/]+)\//);return e?e[1]:""}function Ua(t){const e=String(t||"").trim();return!e||/^(header|footer)\//.test(e)?"":e}function Ka(t){return(Array.isArray(t)?t:[]).filter(e=>e?.handle).map(e=>`${e.kind==="collection"?"collection":"field"}:${e.handle}`).join("|")}function Un({collection:t,set:e,view:o,scope:n}){return`${t}::${e}::${o||""}::${n||""}`}function Ga(t){return At.get(t)||null}function Xa(t,{collection:e,set:o,view:n,scope:s}){const a=Un({collection:e,set:o,view:n,scope:s}),i=At.get(a);if(i)return Promise.resolve(i);const l=new URLSearchParams;return e&&l.set("collection",e),o&&l.set("set",o),n&&l.set("view",n),s&&l.set("scope",s),t.fetch(`/!/sve/data-vars?${l.toString()}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(c=>c.ok?c.json():null).then(c=>{const d=c&&typeof c=="object"?c:Go;return At.set(a,d),d}).catch(()=>Go)}function Ya(t){if(!t){At.clear();return}const e=`::${t}::`;for(const o of[...At.keys()])o.includes(e)&&At.delete(o)}function Za(t){if(t==null||t==="")return"";if(typeof t=="boolean")return t?"true":"false";if(Array.isArray(t))return t.length?`${t.length} ×`:"";if(typeof t=="object"){const o=Object.keys(t).length;return o?`${o} ×`:""}const e=String(t).replace(/\s+/g," ").trim();return e.length>60?`${e.slice(0,60)}…`:e}function Ja(t,e){return e.split(".").reduce((o,n)=>o&&typeof o=="object"?o[n]:void 0,t)}function Kn(t,e){return!Array.isArray(t)||!e||typeof e!="object"?t||[]:t.map(o=>{if(o.parent||o.value!=null||o.var.includes(":"))return o;const n=Za(Ja(e,o.var));return n?{...o,value:n}:o})}function Qa(t,e){return Array.isArray(t)?t.map(o=>({...o,items:Kn(o.items,e)})):[]}function ti(t,e){const o=String(t?.var||"").trim();if(!o)return null;if(t.loop)return{text:`{{ ${o} }}
  
{{ /${o} }}`,cursor:`{{ ${o} }}
  `.length};if(e?.loop&&!t.parent){const n=e.loop;return{text:`{{ ${n} }}
  {{ ${o} }}
{{ /${n} }}`,cursor:`{{ ${n} }}
  {{ ${o} }}`.length}}return{text:`{{ ${o} }}`,cursor:`{{ ${o} }}`.length}}const ie="visual_edit",ei=[{id:"base",lang:"code_dock_visual_edit_base"},{id:"field",lang:"code_dock_visual_edit_field"}],Gn=[{id:"tag",group:"base",label:"{{ visual_edit }}",standalone:"{{ visual_edit| }}"},{id:"ve_popup",group:"base",label:"popup",attr:'popup="true"'},{id:"ve_orderable",group:"base",label:"orderable",attr:'orderable="true"'},{id:"ve_section_orderable",group:"base",label:"section_orderable",attr:'section_orderable="true"'},{id:"ve_outline_inside",group:"base",label:"outline_inside",attr:'outline_inside="true"'},{id:"ve_field",group:"field",label:"field",attr:'field="|"'},{id:"ve_inline_edit",group:"field",label:"inline_edit",attr:'inline_edit="true"'},{id:"ve_insertable",group:"field",label:"insertable",attr:'insertable="true"'},{id:"ve_toolbar",group:"field",label:"toolbar",attr:'toolbar="true"'},{id:"ve_scope",group:"field",label:"scope",attr:'scope="|"'},{id:"ve_controls",group:"field",label:"controls",attr:'controls="|"'}];function oi(t){return Gn.find(e=>e.id===t)||null}function ni(t,e,o,n){let s=e;for(;s<o;){const a=t.indexOf("{{",s);if(a===-1||a>=o)return null;const i=t.indexOf("}}",a+2);if(i===-1||i+2>o)return null;const l=t.slice(a+2,i);if((l.trim().split(/\s+/)[0]||"")===n)return{openIdx:a,closeIdx:i,inner:l};s=i+2}return null}function si(t,e){const o=String(e).split("=")[0].trim();return new RegExp(`(^|\\s)${o}(=|\\s|$)`).test(t)}const ri={class:"sve-code-dock"},ai={"data-sve-code-bar":""},ii={type:"button","data-sve-code-pane-btn":"html"},li={type:"button","data-sve-code-pane-btn":"css"},ci={type:"button","data-sve-code-pane-btn":"alpine"},di={type:"button","data-sve-code-pane-btn":"js"},ui={type:"button","data-sve-html-scope":"","aria-pressed":"true"},fi=["innerHTML"],hi={"data-sve-code-panes":""},pi={"data-sve-code-pane":"html"},mi={"data-sve-code-pane-label":""},vi=["title","aria-label"],gi=["innerHTML"],yi={"data-sve-code-pane":"css"},bi={"data-sve-css-chrome":"subrow-2"},xi={"data-sve-code-pane-label":""},ki={"data-sve-css-label":""},Si={"data-sve-code-pane":"alpine"},wi={"data-sve-code-pane-label":""},_i={"data-sve-code-pane":"js"},$i={"data-sve-code-pane-label":""},Ci={__name:"CodeDockChrome",props:{htmlLabel:{type:String,required:!0},cssLabel:{type:String,required:!0},jsLabel:{type:String,required:!0},alpineLabel:{type:String,required:!0},treeIcon:{type:String,required:!0},dataIcon:{type:String,required:!0},dataLabel:{type:String,required:!0}},setup(t){return(e,o)=>(y(),b("div",ri,[o[19]||(o[19]=v("div",{"data-sve-code-grip":"","aria-hidden":"true"},null,-1)),v("div",ai,[v("button",ii,A(t.htmlLabel),1),v("button",li,A(t.cssLabel),1),v("button",ci,A(t.alpineLabel),1),v("button",di,A(t.jsLabel),1),o[0]||(o[0]=yr('<button type="button" data-sve-code-back hidden></button><span data-sve-code-path></span><span data-sve-code-status></span><button type="button" data-sve-code-strip></button><button type="button" data-sve-code-history></button><button type="button" data-sve-style-mode></button><button type="button" data-sve-values-mode></button>',7)),v("button",ui,[v("span",{innerHTML:t.treeIcon},null,8,fi)]),o[1]||(o[1]=v("button",{type:"button","data-sve-code-autosave":"","aria-pressed":"true"},null,-1)),o[2]||(o[2]=v("button",{type:"button","data-sve-code-save":"",hidden:""},null,-1)),o[3]||(o[3]=v("button",{type:"button","data-sve-code-lock":"",hidden:""},null,-1))]),o[20]||(o[20]=v("div",{"data-sve-code-lock-banner":""},null,-1)),v("div",hi,[v("div",pi,[v("div",mi,[v("span",null,A(t.htmlLabel),1),o[4]||(o[4]=v("div",{"data-sve-html-tools":""},null,-1)),o[5]||(o[5]=v("button",{type:"button","data-sve-html-tidy":""},null,-1)),v("button",{type:"button","data-sve-data-vars":"",title:t.dataLabel,"aria-label":t.dataLabel},[v("span",{innerHTML:t.dataIcon},null,8,gi)],8,vi),o[6]||(o[6]=v("div",{"data-sve-visual-edit-tools":""},null,-1)),o[7]||(o[7]=v("div",{"data-sve-antlers-tools":""},null,-1))]),o[8]||(o[8]=v("div",{"data-sve-code-host":""},null,-1))]),o[16]||(o[16]=v("div",{"data-sve-code-split":"","data-sve-code-split-after":"html"},null,-1)),v("div",yi,[v("div",bi,[v("div",xi,[v("span",ki,A(t.cssLabel),1),o[9]||(o[9]=v("button",{type:"button","data-sve-css-add-class":""},null,-1)),o[10]||(o[10]=v("div",{"data-sve-css-tools":""},null,-1))])]),o[11]||(o[11]=v("div",{"data-sve-css-head":""},null,-1)),o[12]||(o[12]=v("div",{"data-sve-code-host":""},null,-1)),o[13]||(o[13]=v("div",{"data-sve-tw-host":""},null,-1))]),o[17]||(o[17]=v("div",{"data-sve-code-split":"","data-sve-code-split-after":"css"},null,-1)),v("div",Si,[v("div",wi,[v("span",null,A(t.alpineLabel),1)]),o[14]||(o[14]=v("div",{"data-sve-alpine-host":""},null,-1))]),o[18]||(o[18]=v("div",{"data-sve-code-split":"","data-sve-code-split-after":"alpine"},null,-1)),v("div",_i,[v("div",$i,[v("span",null,A(t.jsLabel),1)]),o[15]||(o[15]=v("div",{"data-sve-code-host":""},null,-1))])])]))}},Xo="view:",Yo="partials/";function Xn(t){const e=String(t||"");if(!e.startsWith(Xo))return null;const o=e.slice(Xo.length);return o.startsWith(Yo)?o.slice(Yo.length):o}function Ti(t){const e=String(t||"").match(/\sclass\s*=\s*(["'])([\s\S]*?)\1/i);return e?e[2].replace(/\{\{[\s\S]*?\}\}/g,"\0").split(/[\s[\]]+/).filter(o=>o&&!o.includes("\0")&&/^[A-Za-z_][\w:./%!#-]*$/.test(o)):[]}const Ai=t=>globalThis.CSS?.escape?globalThis.CSS.escape(t):t.replace(/([^\w-])/g,"\\$1");function Yn(t){const e=xe(t)[0];if(!e)return null;const o=Ti(String(t).slice(e.from,e.openTo));return!o.length&&!/^(header|footer|main|nav|aside|figure|form|table)$/.test(e.tag)?null:e.tag+o.map(n=>`.${Ai(n)}`).join("")}const Nt=new Map;let jt=null,Zo=0,Jo=0,Qo=!1;async function Mi(t,e){if(Nt.has(e))return Nt.get(e);const o=`view:partials/${e}`;let n=null;try{const s=await t.fetch(`/!/sve/section-template?type=${encodeURIComponent(o)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}});if(s.ok){const a=await s.json();n=typeof a.html=="string"?Yn(a.html):null}}catch{}return Nt.set(e,n),n}function Ei(t){t?Nt.delete(t):Nt.clear()}function Zn(t){const e=Xn(xt("dock:current-type")),o=e?xt("dock:html"):"",n=e&&typeof o=="string"?Yn(o):null;Sn({source:On,type:In.SVE_COMPONENT_FOCUS,on:!!n,name:e?String(e).split("/").pop():"",selector:n||""},t)}async function bo(t){const e=++Jo,o=xt("dock:html"),n=[...new Set((typeof o=="string"?Rr(o):[]).map(a=>a.src).filter(Boolean))],s=await Promise.all(n.map(a=>Mi(t,a)));e===Jo&&Sn({source:On,type:In.SVE_COMPONENT_MAP,items:n.map((a,i)=>({src:a,name:a.split("/").pop(),selector:s[i]})).filter(a=>a.selector)},t)}function Bi(t){jt=t,!Qo&&(Qo=!0,be("dock:html-changed",()=>{jt&&(Ei(Xn(xt("dock:current-type"))),jt.clearTimeout(Zo),Zo=jt.setTimeout(()=>{bo(jt)},400))}))}const Li=["data-sve-html-tool","data-tip","aria-label","data-letter","onClick","onContextmenu"],Fi=["innerHTML"],Ii={__name:"CodeDockHtmlTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(t){return(e,o)=>(y(!0),b(P,null,V(t.tools,n=>(y(),b("button",{key:n.id,type:"button","data-sve-html-tool":n.id,"data-tip":n.title,"aria-label":n.title,"data-letter":n.letter?"":void 0,onClick:L(s=>t.onTool(n.id),["prevent","stop"]),onContextmenu:L(s=>t.onTool(n.id),["prevent"])},[n.letter?(y(),b(P,{key:0},[wn(A(n.letter),1)],64)):(y(),b("span",{key:1,innerHTML:n.icon},null,8,Fi))],40,Li))),128))}},ut=co({tools:[],onTool:null,onKid:null}),Oi=["data-sve-css-item"],Pi=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],Di={key:0,"data-sve-css-kids":""},Hi={key:0,"data-sve-css-sep":"","aria-hidden":"true"},zi=["data-sve-css-kid","data-sve-css-box-side","data-tip","aria-label","innerHTML","onClick","onContextmenu"],Ri={__name:"CodeDockCssTools",setup(t){return(e,o)=>(y(!0),b(P,null,V(T(ut).tools,n=>(y(),b("li",je({key:n.id,"data-sve-css-item":n.id},{ref_for:!0},n.open?{"data-sve-css-open":""}:{}),[v("button",je({type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title},{ref_for:!0},{...n.active?{"data-active":""}:{},...n.open?{"data-open":""}:{}},{innerHTML:n.icon,onClick:L(s=>T(ut).onTool?.(n.id),["prevent","stop"]),onContextmenu:L(s=>T(ut).onTool?.(n.id),["prevent"])}),null,16,Pi),n.open&&n.kids.length?(y(),b("div",Di,[(y(!0),b(P,null,V(n.kids,s=>(y(),b(P,{key:s.id},[s.sep?(y(),b("span",Hi)):j("",!0),v("button",je({type:"button","data-sve-css-kid":s.id,"data-sve-css-box-side":s.id,"data-tip":s.title,"aria-label":s.title},{ref_for:!0},s.active?{"data-active":""}:{},{innerHTML:s.icon,onClick:L(a=>T(ut).onKid?.(n.id,s.id),["prevent","stop"]),onContextmenu:L(a=>T(ut).onKid?.(n.id,s.id),["prevent"])}),null,16,zi)],64))),128))])):j("",!0)],16,Oi))),128))}},ji=1.5,Wi=16;function de(t,e){const o=parseFloat(t);return Number.isFinite(o)?e==="em"||e==="rem"?o*Wi:o:null}function Ni(t){const e=String(t||"").toLowerCase();if(/\bmin-width\b|\bwidth\s*>=?/.test(e))return null;let o=e.match(/\bmax-width\s*:\s*([\d.]+)(px|em|rem)/);return o||(o=e.match(/\bwidth\s*<=?\s*([\d.]+)(px|em|rem)/),o)?de(o[1],o[2]):(o=e.match(/([\d.]+)(px|em|rem)\s*>=?\s*width\b/),o?de(o[1],o[2]):null)}function ft(t,e){const o=Ni(t);if(o===null)return"";for(const n of e||[]){if(n.base)continue;const s=de(String(n.max||"").replace(/[a-z]+$/i,""),(String(n.max||"").match(/[a-z]+$/i)||[""])[0]);if(s!==null&&Math.abs(s-o)<=ji)return n.handle}return""}function we(t){let e="",o=0;for(;o<t.length;){const n=_e(t,o);if(n!==o){e+=" ".repeat(n-o),o=n;continue}e+=t[o],o+=1}return e}function _e(t,e){if(t.startsWith("/*",e)){const o=t.indexOf("*/",e+2);return o===-1?t.length:o+2}if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?t.length:o+2}if(t[e]==='"'||t[e]==="'"){const o=t[e];for(let n=e+1;n<t.length;n+=1)if(t[n]==="\\")n+=1;else if(t[n]===o)return n+1;return t.length}return e}function $e(t){const e=String(t||""),o=[],n=(s,a,i=0)=>{let l=s,c=l;for(;l<a;){const d=_e(e,l);if(d!==l){l=d;continue}if(e[l]===";"){l+=1,c=l;continue}if(e[l]==="}")return;if(e[l]!=="{"){l+=1;continue}const f=we(e.slice(c,l)),h=f.trim(),p=Jn(e,l,a);if(p===-1)return;/^@media\b/i.test(h)?o.push({query:h.replace(/^@media\s*/i,"").trim(),from:c+f.search(/\S/),to:p+1,bodyFrom:l+1,bodyTo:p,depth:i}):/^@(?:import|charset|use)\b/i.test(h)||n(l+1,p,i+1),l=p+1,c=l}};return n(0,e.length,0),o}function Jn(t,e,o){let n=0;for(let s=e;s<o;s+=1){const a=_e(t,s);if(a!==s){s=a-1;continue}if(t[s]==="{")n+=1;else if(t[s]==="}"&&(n-=1,n===0))return s}return-1}function Ft(t){const e=String(t||""),o=(n,s)=>{const a=[];let i=n,l=i;for(;i<s;){const c=_e(e,i);if(c!==i){i=c;continue}if(e[i]===";"){i+=1,l=i;continue}if(e[i]==="}")return a;if(e[i]!=="{"){i+=1;continue}const d=we(e.slice(l,i)),f=d.trim(),h=Jn(e,i,s);if(h===-1)return a;a.push({prelude:f,media:/^@media\b/i.test(f),query:f.replace(/^@media\s*/i,"").trim(),from:l+d.search(/\S/),to:h+1,bodyFrom:i+1,bodyTo:h,children:/^@(?:import|charset|use)\b/i.test(f)?[]:o(i+1,h)}),i=h+1,l=i}return a};return o(0,e.length)}function qi(t,e,o){const n=String(t||"");if(!o)return[];const s=(e||[]).find(d=>d.base),a=Ft(n),i=[],l=d=>d.media?ft(d.query,e)===o:d.children.some(l);if(s&&o===s.handle){const d=f=>{for(const h of f){if(h.media&&ft(h.query,e)){i.push({from:h.from,to:h.to});continue}d(h.children)}};return d(a),i}const c=(d,f,h)=>{const p=[];for(const k of d){if(k.media&&ft(k.query,e)===o){p.push({from:k.from,to:k.to,into:null});continue}l(k)&&p.push({from:k.from,to:k.to,into:k})}if(!p.length){h>f&&i.push({from:f,to:h});return}let x=f;for(const k of p)k.from>x&&i.push({from:x,to:k.from}),k.into&&c(k.into.children,k.into.bodyFrom,k.into.bodyTo),x=k.to;h>x&&i.push({from:x,to:h})};return c(a,0,n.length),i.filter(d=>n.slice(d.from,d.to).trim()!=="")}function Vi(t,e){const o=String(t||""),n=[],s=i=>{for(const l of i){if((l.media&&ft(l.query,e)||/^#id-/.test(l.prelude))&&we(o.slice(l.bodyFrom,l.bodyTo)).trim()===""){n.push(l);continue}s(l.children)}};if(s(Ft(o)),!n.length)return o;let a=o;for(const i of n.sort((l,c)=>c.from-l.from)){let l=i.from,c=i.to;const d=a.lastIndexOf(`
`,l-1)+1;for(a.slice(d,l).trim()===""&&(l=d);a[c]===" "||a[c]==="	";)c+=1;a[c]===`
`&&(c+=1),a=a.slice(0,l)+a.slice(c)}return a}function Ui(t,e){const o=String(t||""),n=[],s=i=>we(o.slice(i.bodyFrom,i.bodyTo)).trim()==="",a=i=>{for(const l of i){if((l.media&&ft(l.query,e)||/^#id-/.test(l.prelude))&&s(l)){n.push({from:l.from,to:l.to});continue}a(l.children)}};return a(Ft(o)),n}function he(t,e,o){const n=e||[],s=n.find(d=>d.base),a=[],i=d=>/^#id-/.test(d.prelude)||/^#\s*$/.test(d.prelude),l=(d,f)=>{for(const h of d){if(!h.media){l(h.children,f);continue}const p=ft(h.query,n)||f;if(o===p){a.push(h);continue}l(h.children,p)}},c=(d,f)=>{for(const h of d){if(h.media){c(h.children,ft(h.query,n)||f);continue}if(i(h)){const p=f||(s?s.handle:"");!o||o===p?a.push(h):l(h.children,p);continue}c(h.children,f)}};return c(Ft(String(t||"")),""),a.sort((d,f)=>d.from-f.from)}function xo(t,e,o){return $e(t).filter(n=>ft(n.query,e)===o)}const B=co({tag:"",scope:"",onTag:null,sizes:[],onSize:null,state:"",stateLabel:"",onState:null,canEdit:!1,note:""}),Ki={class:"sve-css-head"},Gi=["disabled"],Xi={key:1,class:"sve-css-scope"},Yi=["title","data-active","disabled","onClick"],Zi=["data-active","disabled"],Ji={key:2,class:"sve-css-note"},Qi={__name:"CodeDockCssHead",setup(t){return(e,o)=>(y(),b("div",Ki,[T(B).tag?(y(),b("button",{key:0,type:"button",class:"sve-css-tag",disabled:!T(B).canEdit,onClick:o[0]||(o[0]=L(()=>{},["prevent","stop"])),onDblclick:o[1]||(o[1]=L(n=>T(B).onTag?.(n),["prevent","stop"]))},"<"+A(T(B).tag)+">",41,Gi)):j("",!0),T(B).scope?(y(),b("span",Xi,A(T(B).scope),1)):j("",!0),(y(!0),b(P,null,V(T(B).sizes,n=>(y(),b("button",{key:n.key,type:"button","data-sve-css-size":"",title:n.title,"data-active":n.active?"":void 0,disabled:!T(B).canEdit,onClick:L(s=>T(B).onSize?.(n.key),["prevent","stop"])},A(n.label),9,Yi))),128)),v("button",{type:"button","data-sve-css-state":"","data-active":T(B).state?"":void 0,disabled:!T(B).canEdit,onClick:o[2]||(o[2]=L(n=>T(B).onState?.(n),["prevent","stop"]))},[wn(A(T(B).stateLabel)+" ",1),o[3]||(o[3]=v("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[v("path",{d:"m6 9 6 6 6-6"})],-1))],8,Zi),o[4]||(o[4]=v("span",{class:"sve-css-gap"},null,-1)),T(B).note?(y(),b("span",Ji,A(T(B).note),1)):j("",!0)]))}},tl=_n(Qi,[["__scopeId","data-v-43bc76ce"]]),el={key:0,"data-sve-css-swatches":""},ol=["data-sve-css-token","title","data-active","onClick"],nl={key:0,"data-sve-css-head-row":""},sl={key:1,"data-sve-css-note-row":""},rl=["data-sve-css-token","data-active","onClick"],al={"data-sve-css-choice-label":""},il={key:0,"data-sve-css-choice-hint":""},ot={__name:"CodeDockMenu",props:{kind:{type:String,required:!0},swatches:{type:Array,default:()=>[]},choices:{type:Array,default:()=>[]},onClear:{type:Function,default:null},onPick:{type:Function,required:!0}},setup(t){return(e,o)=>t.kind==="colors"?(y(),b("div",el,[v("button",{type:"button","data-sve-css-clear":"",title:"Clear",onClick:o[0]||(o[0]=L((...n)=>t.onClear&&t.onClear(...n),["prevent","stop"]))},[...o[1]||(o[1]=[v("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none",stroke:"currentColor","stroke-width":"1.5"},[v("path",{d:"M2 2l6 6M8 2L2 8"})],-1)])]),(y(!0),b(P,null,V(t.swatches,n=>(y(),b("button",{key:n.name,type:"button","data-sve-css-swatch":"","data-sve-css-token":n.name,title:n.name,"data-active":n.active?"":void 0,style:br({background:n.hex||"transparent"}),onClick:L(s=>t.onPick(n.name),["prevent","stop"])},null,12,ol))),128))])):(y(!0),b(P,{key:1},V(t.choices,n=>(y(),b(P,{key:n.value},[n.heading?(y(),b("span",nl,A(n.label),1)):n.note?(y(),b("span",sl,A(n.label),1)):(y(),b("button",{key:2,type:"button","data-sve-css-choice":"","data-sve-css-token":n.token||void 0,"data-active":n.active?"":void 0,onClick:L(s=>t.onPick(n.value),["prevent","stop"])},[v("span",al,A(n.label),1),n.hint?(y(),b("span",il,A(n.hint),1)):j("",!0)],8,rl))],64))),128))}},ll=/^\.[a-zA-Z_][\w-]*$/;function cl(t,e,o){return String(e||"").includes(o)?pe(t).length===1:!1}function pe(t){return Ft(t).filter(e=>/^@scope\b/i.test(e.prelude))}function dl(t){const e=String(t||"");return Ft(e).filter(o=>ll.test(o.prelude)?!e.slice(o.from,o.bodyFrom-1).includes("{{"):!1).map(o=>({from:o.from,to:o.to,name:o.prelude.slice(1)}))}function ul(t,e,o){const n=String(t||"");if(!cl(n,e,o))return n;const s=dl(n);if(!s.length)return n;const a=pe(n)[0],i=pl(n,a),l=s.map(p=>ml(n.slice(p.from,p.to),n,p.from,i)).join(`

`);let c=n;for(const p of[...s].sort((x,k)=>k.from-x.from))c=hl(c,p.from,p.to);const d=fl(c,o);if(d===-1)return n;const f=(c.slice(0,d).match(/\n([^\S\n]*)$/)||[null,null])[1],h=f===null?d:d-f.length;return`${c.slice(0,h)}
${l}
${f??""}${c.slice(d)}`}function fl(t,e){const o=pe(t).find(n=>n.prelude.includes(e));return o?o.bodyTo:pe(t)[0]?.bodyTo??-1}function hl(t,e,o){let n=e,s=o;const a=t.lastIndexOf(`
`,n-1)+1;for(t.slice(a,n).trim()===""&&(n=a);t[s]===" "||t[s]==="	";)s+=1;return t[s]===`
`&&(s+=1),t.slice(0,n)+t.slice(s)}function pl(t,e){const o=t.slice(e.bodyFrom,e.bodyTo).match(/\n([^\S\n]+)\S/);return o?o[1]:`${(t.slice(0,e.from).match(/\n([^\S\n]*)$/)||[null,""])[1]}    `}function ml(t,e,o,n){const s=(e.slice(0,o).match(/\n([^\S\n]*)$/)||[null,""])[1];return t.split(`
`).map((a,i)=>i===0?n+a.trim():a.startsWith(s)?n+a.slice(s.length):n+a.trimStart()).join(`
`)}const vl={"data-sve-css-add-label":""},gl=["placeholder","onKeydown"],ko={__name:"CodeDockAddClass",props:{label:{type:String,required:!0},placeholder:{type:String,default:""},initial:{type:String,default:""},onAdd:{type:Function,required:!0}},setup(t){const e=t,o=dt(e.initial||""),n=dt(null);bn(()=>Ke(()=>{n.value?.focus(),n.value?.select()}));function s(){const a=o.value.trim();if(!a){n.value?.focus();return}e.onAdd(a)}return(a,i)=>(y(),b(P,null,[v("label",vl,A(t.label),1),xn(v("input",{ref_key:"input",ref:n,"data-sve-css-add-input":"","onUpdate:modelValue":i[0]||(i[0]=l=>o.value=l),type:"text",placeholder:t.placeholder,onKeydown:[Tt(L(s,["prevent"]),["enter"]),i[1]||(i[1]=Tt(L(()=>{},["stop"]),["escape"]))]},null,40,gl),[[kn,o.value]])],64))}};function tn(t,e){e._sveLockBound||(e._sveLockBound=!0,e.querySelector("[data-sve-code-lock]")?.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),!(!r.lockReady||!r.lastType)){if(r.lastLocked){bl(t);return}Qn(t,!0)}}))}function So(t){return t?J(t,lr)!=="0":!0}function yl(){const t=g.html;return!t||t.state.readOnly||!r.lastType?!1:!Ao(To(),r.lastParts)}function it(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-code-autosave]"),n=e?.querySelector("[data-sve-code-save]");if(!o||!n)return;const s=So(t),a=yl();o.setAttribute("aria-pressed",s?"true":"false"),o.title=m(t,s?"code_dock_autosave_on":"code_dock_autosave_off"),o.setAttribute("aria-label",o.title),o.innerHTML=Dd,n.hidden=s,n.title=m(t,"code_dock_save"),n.setAttribute("aria-label",n.title),n.innerHTML=Hd,a?n.setAttribute("data-dirty",""):n.removeAttribute("data-dirty")}function en(t,e){e._sveAutosaveBound||(e._sveAutosaveBound=!0,e.querySelector("[data-sve-code-autosave]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=!So(t);U(t,lr,n?"1":"0"),n?et(t.document):r.saveTimer&&(clearTimeout(r.saveTimer),r.saveTimer=null),it(t)}),e.querySelector("[data-sve-code-save]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),et(t.document)}))}function bl(t){t.document.getElementById(G)?.remove();const e=xr(t.document,kr,{title:m(t,"code_dock_unlock_title"),body:m(t,"code_dock_unlock_body"),buttons:[{value:"cancel",label:m(t,"cancel"),variant:"ghost"},{value:"ok",label:m(t,"code_dock_unlock_confirm"),variant:"primary"}],onPick:o=>{e.dismiss(),o==="ok"&&Qn(t,!1)}});e.host.id=G}function Qn(t,e){const o=r.lastType;if(!o)return;const n=()=>{r.lastType===o&&t.fetch("/!/sve/section-template/lock",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":$n(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:o,locked:e})}).then(async s=>{if(!s.ok)throw new Error(String(s.status));r.lastType===o&&(r.lastLocked=e,Et(t),te(r.lastParts,e),K(t),R(t.document,e?m(t,"code_dock_locked"):""))}).catch(()=>{R(t.document,m(t,"code_dock_error"))})};if(e&&(et(t.document),r.saveInFlight)){r.saveInFlight.finally(n);return}n()}function me(t){if(!r.lastUid||!r.lastType||String(r.lastType).startsWith("view:")){zo(t);return}const e=wr(r.lastUid,t.document);zo(t,e.length?{sectionUids:e}:void 0)}function xl(t,e,o){return r.saveInFlight=t.fetch("/!/sve/section-template",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":$n(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:e,html:o.html,css:o.css,js:o.js,...typeof o.tw=="string"?{tw:o.tw}:{},...jr(t)?{props:r.lastProps}:{}})}).then(async n=>{if(n.status===423){r.lastLocked=!0,r.lockReady=!0,Et(t),te(r.lastParts,!0),K(t),R(t.document,m(t,"code_dock_locked"));return}const s=await n.json().catch(()=>({}));if(!n.ok)throw new Error(s?.error==="not_writable"?"not_writable":String(n.status));if(r.lastType===e){if(r.lastParts=o,s?.tw_written===!1){r.twDirty=!0,R(t.document,m(t,"code_dock_tw_not_writable")),it(t),me(t);return}R(t.document,m(t,"code_dock_saved")),it(t),t.setTimeout(()=>{const a=t.document.getElementById(u)?.querySelector("[data-sve-code-status]");a&&a.textContent===m(t,"code_dock_saved")&&(a.textContent="")},1800)}me(t),t.document.getElementById("__sve-section-picker")?.dispatchEvent(new t.CustomEvent("sve-library-stale"))}).catch(n=>{R(t.document,m(t,n?.message==="not_writable"?"code_dock_not_writable":"code_dock_error"))}).finally(()=>{r.saveInFlight=null}),r.saveInFlight}function et(t){r.saveTimer&&(clearTimeout(r.saveTimer),r.saveTimer=null);const e=r.lastType,o=r.lastWin,n=g.html;if(!n||n.state.readOnly||!e||!o)return;const s=To(),a=r.twCss!==null&&An(o)&&wo(s.html)===r.twKey;Ao(s,r.lastParts)&&!(a&&r.twDirty)&&!r.propsDirty||(r.propsDirty=!1,a&&(s.tw=r.twCss,r.twDirty=!1),R(t,m(o,"code_dock_saving")),xl(o,e,s))}function wo(t){return ra(t).sort().join(" ")}function kl(){r.twCss=null,r.twKey="",r.twDirty=!1}function Sl(t,e){r.twCss=e,r.twKey=wo(t),r.twDirty=!1}function ts(t,e){if(!t||!An(t))return;const o=wo(e);o===r.twKey||r.twBusy||(r.twBusy=!0,Sr(()=>import("./tw-compile-DjrKc54-.js"),__vite__mapDeps([0,1]),import.meta.url).then(n=>n.compileTailwind(t,e)).then(n=>{r.twBusy=!1,r.twCss=n,r.twKey=o,r.twDirty=!0,es(t,t.document)}).catch(n=>{r.twBusy=!1,console.error("[sve] tailwind compile",n)}))}function es(t,e){r.saveTimer&&clearTimeout(r.saveTimer),r.saveTimer=t.setTimeout(()=>{r.saveTimer=null,et(e)},Ld)}function nt(t){if(r.applying)return;const e=To();if(Ao(e,r.lastParts)){it(t);return}if(it(t),ts(t,e.html),!So(t)){R(t.document,m(t,"code_dock_unsaved"));return}R(t.document,m(t,"code_dock_saving")),es(t,t.document)}function os(t){const e=r.lastUid,o=typeof tt=="function"?tt(t.document):[];for(const n of o){const s=kt(n.values)||n.values;if(!(!s||typeof s!="object")&&e&&typeof Ro=="function"){const a=Ro(s,e);if(a){const i=a.split("."),l=_r(s,i.slice(0,2).join("."));if(l&&typeof l=="object")return l}}}for(const n of o){const s=kt(n.values)||n.values;if(s&&typeof s=="object")return s}return null}function ns(t,e){!e||e===r.lastType||(et(t.document),De(t,e,"push"))}function ss(t){const e=r.typeStack.pop();if(!e){Yt(t);return}et(t.document),De(t,e,"keep")}function Et(t){const e=t.document.getElementById(u),o=e?.querySelector("[data-sve-code-lock]"),n=e?.querySelector("[data-sve-code-lock-banner]");if(!e||!o)return;const s=r.lastLocked;e.toggleAttribute("data-sve-code-locked",s),s&&(Mn(t.document),rt(t.document),r.htmlPartialUi&&(r.htmlPartialUi.setHover(g.html,null),r.htmlPartialUi.setHover(g.css,null)),r.htmlClassTokenUi?.setHover(g.html,null)),o.hidden=!r.lockReady,o.setAttribute("aria-pressed",r.lastLocked?"true":"false"),o.title=m(t,r.lastLocked?"code_dock_unlock":"code_dock_lock"),o.setAttribute("aria-label",o.title),o.innerHTML=r.lastLocked?Fd:Id,n&&(n.textContent=m(t,"code_dock_locked_banner"))}function Zt(t){return t?J(t,Re)!=="0":r.htmlScopePref}function Ce(t,e,o){return t!=null&&e!=null&&t>=0&&e>t&&e<=o}function Te(){const t=g.html?.state.doc.toString()??"";if(!r.htmlScopeActive||!r.htmlFocus){r.htmlFull=t;return}if(r.htmlFocus.from<0||r.htmlFocus.from>r.htmlFull.length||r.htmlFocus.to<r.htmlFocus.from){r.htmlScopeActive=!1,r.htmlFull=t,r.htmlFocus=null;return}r.htmlFull=r.htmlFull.slice(0,r.htmlFocus.from)+t+r.htmlFull.slice(r.htmlFocus.to),r.htmlFocus={from:r.htmlFocus.from,to:r.htmlFocus.from+t.length}}function It(){return Te(),r.htmlScopeActive?r.htmlFull:g.html?.state.doc.toString()??r.lastParts.html??""}function Ae(){r.lastBracketNames=ke(It()).map(t=>t.name)}function Ot(){r.lastCssSelectorNames=zn(g.css?.state.doc.toString()??r.cssFull)}function rs(t,e){return Array.isArray(t)&&Array.isArray(e)&&t.length===e.length&&t.every((o,n)=>o===e[n])}function wl(){const t=r.htmlScopeActive?_o():It(),e=Se(t);e.length&&(r.cssFull=yo(r.cssFull,go(r.cssFull,e),e[0].className))}function as(t,e){r.cssFull=Sa(r.cssFull,t,e),wl(),r.cssFull=wa(r.cssFull,e,t)}function _l(t){if(r.applying||r.lastLocked||r.lastBracketNames==null)return;const e=ke(It()).map(o=>o.name);rs(r.lastBracketNames,e)||(as(r.lastBracketNames,e),r.lastBracketNames=e,Jt(),Ot())}function $l(){if(r.applying||r.lastLocked||r.lastCssSelectorNames==null||r.lastBracketNames==null||r.cssPane==="empty")return;const t=g.html,e=zn(g.css?.state.doc.toString()??"");if(!t||rs(r.lastCssSelectorNames,e))return;const o=new Set(r.lastBracketNames),{renamed:n,removed:s}=Rn(r.lastCssSelectorNames,e);let a=t.state.doc.toString();const i=a;for(const l of n){const c=St(l.to);!o.has(l.from)||!c||(a=Uo(a,d=>d===l.from?c:d))}for(const l of s)!o.has(l)||e.includes(l)||(a=Uo(a,c=>c===l?"":c));if(a!==i){r.applying=!0;try{Ee(a)}finally{r.applying=!1}}Ae(),r.lastCssSelectorNames=e}function Cl(t,e){const o=St(e),n=g.html;if(!o||!n||n.state.readOnly||o===t.name)return;r.applying=!0;try{n.dispatch({changes:{from:t.from,to:t.to,insert:o}})}finally{r.applying=!1}const s=r.lastBracketNames==null?[]:r.lastBracketNames.slice();Ae(),as(s,r.lastBracketNames),Jt(),Ot(),r.lastWin&&(nt(r.lastWin),O(r.lastWin))}function Tl(t,e){const o=t.document,s=g.html?.coordsAtPos(e.from);w(o),rt(o);const a=o.createElement("div"),i={getBoundingClientRect:()=>({left:s?.left??12,right:s?.right??12,top:s?.top??12,bottom:s?.bottom??12,width:0,height:0})};a.id=$,o.body.appendChild(a),W(t,i,a),a._sveApp=N(ko,a,{label:m(t,"code_dock_css_rename_class"),placeholder:m(t,"code_dock_css_class_placeholder"),initial:e.name,onAdd:l=>{Cl(e,l),w(o)}})}function is(){return r.htmlScopePref&&Ce(r.htmlFocus?.from,r.htmlFocus?.to,r.htmlFull.length)?(r.htmlScopeActive=!0,r.htmlFull.slice(r.htmlFocus.from,r.htmlFocus.to)):(r.htmlScopeActive=!1,r.htmlFull)}function Me(t,e,o){const n=g[t];if(!n)return;const s=n.state.doc.toString();r.applying=!0;try{s!==e?n.dispatch({changes:{from:0,to:s.length,insert:e},...o?{selection:o,scrollIntoView:!0}:{}}):o&&n.dispatch({selection:o,scrollIntoView:!0})}finally{r.applying=!1}}function Ee(t,e){Me("html",t,e)}function _o(){return r.htmlScopeActive?g.html?.state.doc.toString()??"":Ce(r.htmlFocus?.from,r.htmlFocus?.to,r.htmlFull.length)?r.htmlFull.slice(r.htmlFocus.from,r.htmlFocus.to):""}function ct(){const t=g.css?.state.doc.toString()??"";if(r.cssPane==="tree"){if(t===r.cssScopeSnapshot)return;const e=Se(_o())[0]?.className||Nn(t);r.cssFull=yo(r.cssFull,t,e),r.cssScopeSnapshot=t}else r.cssPane==="full"&&(r.cssFull=t)}function ls(t,e){for(const o of e||[])if(!X(t,o.className)||ls(t,o.children))return!0;return!1}function Jt(){let t=r.cssFull,e=[],o=!1;r.cssValues||!r.htmlScopePref||!r.htmlScopeActive?(r.cssPane="full",t=r.cssFull):(e=Se(_o()),e.length?(r.cssPane="tree",t=go(r.cssFull,e),ls(r.cssFull,e)&&(r.cssFull=yo(r.cssFull,t,e[0].className),o=!0)):(r.cssPane="empty",t="")),r.cssScopeSnapshot=t,Me("css",t),Ot(),r.lastWin&&(oe(r.lastWin,!0),O(r.lastWin),o&&nt(r.lastWin))}function $o(t){const e=g.html;if(!e||!r.htmlFocus)return;r.htmlScopeActive||(r.htmlFull=e.state.doc.toString());const o=r.htmlFull.length,n=Math.max(0,Math.min(r.htmlFocus.from,o)),s=Math.max(n,Math.min(r.htmlFocus.to,o));if(s<=n)return;r.htmlFocus={from:n,to:s},r.htmlScopeActive=!0;const a=t==null?0:Math.max(0,Math.min(t-n,s-n));Ee(r.htmlFull.slice(n,s),{anchor:a,head:a}),Jt(),e.focus()}function Co(t=!0,e=null){const o=g.html;if(!o)return;ct(),Te(),r.htmlScopeActive=!1;const n=r.htmlFull||o.state.doc.toString(),s=e!=null?{anchor:Math.max(0,Math.min(e,n.length))}:t&&Ce(r.htmlFocus?.from,r.htmlFocus?.to,n.length)?{anchor:r.htmlFocus.from,head:r.htmlFocus.to}:null;r.htmlFull=n,Ee(n,s),r.cssPane="full",r.cssScopeSnapshot=r.cssFull,Me("css",r.cssFull),Ot()}function Be(){r.htmlFocus=null,r.htmlScopeActive=!1,r.htmlFull="",r.cssFull="",r.cssPane="full",r.cssScopeSnapshot="",r.lastBracketNames=null,r.lastCssSelectorNames=null}let Ut=!1;function Mt(t){return!!t?.document.getElementById(Tn)}function Ze(t,e){if(!(!t||uo(t,"html_tree")===!1)){if(!e){Mt(t)&&Cn(t);return}Mt(t)||(Ut=!0,$r("html_tree").then(()=>{Mt(t)||Cr(t)}).catch(()=>{}).finally(()=>{Ut=!1,K(t)}))}}function K(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-html-scope]");if(!e)return;r.htmlScopePref=Zt(t);const o=uo(t,"html_tree")===!1?r.htmlScopePref:Mt(t)||Ut;e.setAttribute("aria-pressed",o?"true":"false"),e.title=m(t,o?"code_dock_html_scope_off":"code_dock_html_scope"),e.setAttribute("aria-label",e.title),e.innerHTML=ur,t.document.getElementById(u)?.toggleAttribute("data-sve-html-scoped",r.htmlScopeActive)}function on(t,e){e._sveHtmlScopeBound||(e._sveHtmlScopeBound=!0,r.htmlScopePref=Zt(t),Al(t,e),Ze(t,r.htmlScopePref),e.querySelector("[data-sve-html-scope]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=Mt(t)||Ut;r.htmlScopePref=!n,U(t,Re,r.htmlScopePref?"1":"0"),r.htmlScopePref?r.htmlFocus&&(ct(),$o()):r.htmlScopeActive&&Co(),Ze(t,r.htmlScopePref),K(t)}))}function Al(t,e){e._sveTreeWatchBound||(e._sveTreeWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>{if(Ut||uo(t,"html_tree")===!1||!t.document.getElementById(u))return;const o=Mt(t);o!==Zt(t)&&(r.htmlScopePref=o,U(t,Re,o?"1":"0"),o?r.htmlFocus&&(ct(),$o()):r.htmlScopeActive&&Co(),K(t))}))}const Ml=new Set(["pre","textarea","script","style"]),El=/^(<\/|\{\{\s*\/)/;function Bl(t){let e=0;for(const o of t.split(`
`)){if(!o.trim())continue;const n=o.length-o.trimStart().length;n>0&&(e===0||n<e)&&(e=n)}return" ".repeat(e===2||e===3?e:4)}function Ll(t){const e=String(t||"");if(!e.trim())return e;const o=[],n=l=>{for(const c of l||[])o.push(c),n(c.children)};n(Wr(e));const s=Bl(e),a=[];let i=0;for(const l of e.split(`
`)){const c=i,d=l.trim();if(i+=l.length+1,!d){a.push("");continue}const f=c+(l.length-l.trimStart().length),h=o.filter(x=>x.from<f&&f<x.to);if(h.some(x=>Ml.has(x.tag))){a.push(l);continue}const p=h.length-(El.test(d)?1:0);a.push(s.repeat(Math.max(p,0))+d)}return a.join(`
`)}function cs(t,e){if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?t.length:o+2}if(t.startsWith("<!--",e)){const o=t.indexOf("-->",e+4);return o===-1?t.length:o+3}return e}function Je(t,e){if(t[e]!=="<")return null;const o=t.indexOf(">",e+1);if(o===-1)return null;const n=t.slice(e,o+1),s=n.match(/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/);if(s)return{kind:"close",name:s[1].toLowerCase(),from:e,to:o+1};const a=n.match(/^<([A-Za-z][A-Za-z0-9:-]*)/);if(!a)return{kind:"other",from:e,to:o+1};const i=a[1].toLowerCase();return{kind:/\/\s*>$/.test(n)||["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"].includes(i)?"void":"open",name:i,from:e,to:o+1}}function nn(t,e,o){let n=1,s=o;for(;s<t.length;){const a=cs(t,s);if(a!==s){s=a;continue}if(t[s]!=="<"){s+=1;continue}const i=Je(t,s);if(!i)break;if(i.kind==="open"&&i.name===e)n+=1;else if(i.kind==="close"&&i.name===e&&(n-=1,n===0))return i;s=i.to}return null}function Qt(){const t=g.html;if(!t)return null;const e=t.state.selection.main.head,o=t.state.doc.toString(),n=[];let s=0;for(;s<e;){const c=cs(o,s);if(c!==s){s=c;continue}if(o[s]!=="<"){s+=1;continue}const d=Je(o,s);if(!d||d.from>=e)break;if(d.kind==="open")n.push(d);else if(d.kind==="close"){for(let f=n.length-1;f>=0;f-=1)if(n[f].name===d.name){n.splice(f);break}}s=d.to}const a=o.lastIndexOf("<",Math.max(0,e-1));if(a!==-1&&o.indexOf(">",a)>=e){const c=Je(o,a);if(c?.kind==="open"||c?.kind==="void"){const d=c.kind==="void"?null:nn(o,c.name,c.to);return d?{name:c.name,open:c,close:d}:{name:c.name,open:c,close:null}}}const i=n[n.length-1];if(!i)return null;const l=nn(o,i.name,i.to);return{name:i.name,open:i,close:l}}function Qe(t){return fr.includes(t)}function q(){g.html?.focus(),r.lastWin&&(nt(r.lastWin),Le(r.lastWin))}function gt(t,e,o){const n=[...e].sort((s,a)=>a.from-s.from||a.to-s.to);t.dispatch({changes:n,selection:o})}function Bt(t,e,o){const n=g.html;if(!n||n.state.readOnly)return;const s=n.state.selection.main.head,a=n.state.doc.lineAt(s),i=a.text.slice(0,s-a.from),l=a.text.trim()?lt(a.text):Ie(n,a)||lt(a.text);let c=t,d=0;if(i.trim()!=="")c=`
${l}${t}`,d=1+l.length;else if(!a.text.trim()){c=`${l}${t}`,d=l.length,n.dispatch({changes:{from:a.from,to:a.to,insert:c},selection:sn(a.from+d+e,o)});return}n.dispatch({changes:{from:s,to:n.state.selection.main.to,insert:c},selection:sn(s+d+e,o)})}function sn(t,e){return e?{anchor:t,head:t+e}:{anchor:t}}const Fl=new Set(["section","article","header","footer","main","nav","aside"]);function rn(t){if(t!=="section")return`<${t}>`;const e=r.lastWin?.Statamic?.$config?.get?.("sveSectionTag");return typeof e=="string"&&e.trim()?`<${t} ${e.trim()}>`:`<${t}>`}function ds(){const t=g.html;if(!t||t.state.readOnly)return;const e=t.state.doc.toString(),o=(e.match(/^[ \t]*/)||[""])[0],n=Ll(e).split(`
`).map(s=>s&&o+s).join(`
`);n!==e&&(gt(t,[{from:0,to:e.length,insert:n}],{anchor:0}),q())}function us(t){const e=g.html;if(!e||e.state.readOnly)return;const o=e.state.selection.main,n=e.state.doc.toString();if(!o.empty){const l=n.slice(o.from,o.to),c=l.match(new RegExp(`^<${t}(\\s[^>]*)?>([\\s\\S]*)</${t}>$`,"i"));if(c){gt(e,[{from:o.from,to:o.to,insert:c[2]}],{anchor:o.from,head:o.from+c[2].length}),q();return}const d=rn(t);let f=`${d}${l}</${t}>`,h=o.from+d.length;t==="ul"&&(f=`<ul>
  <li>${l}</li>
</ul>`,h=o.from+11),gt(e,[{from:o.from,to:o.to,insert:f}],{anchor:h,head:h+l.length}),q();return}const s=Qt();if(s?.open&&s.close){if(s.name===t){gt(e,[{from:s.close.from,to:s.close.to,insert:""},{from:s.open.from,to:s.open.to,insert:""}],{anchor:s.open.from}),q();return}if(Qe(s.name)&&Qe(t)){const l=n.slice(s.open.from,s.open.to).replace(new RegExp(`^<${s.name}`,"i"),`<${t}`);gt(e,[{from:s.close.from,to:s.close.to,insert:`</${t}>`},{from:s.open.from,to:s.open.to,insert:l}],{anchor:s.open.from+t.length+1}),q();return}}const i=(e.state.doc.lineAt(o.head).text.match(/^\s*/)||[""])[0];if(t==="ul"){const l=`<ul>
${i}  <li></li>
${i}</ul>`;Bt(l,`<ul>
${i}  <li>`.length)}else{const l=rn(t),c=`${l}</${t}>`;Bt(c,Fl.has(t)?l.length:c.length)}q()}function Le(t){try{Il(t)}catch{}}function Il(t){const e=t?.document?.getElementById(u),n=Qt()?.name||"";if(e)for(const s of lo){const a=e.querySelector(`[data-sve-html-tool="${s.id}"]`);if(!a)continue;(s.id==="heading"?Qe(n):n===s.tag)?a.setAttribute("data-active",""):a.removeAttribute("data-active")}}function an(t,e,o){const n=t.document,s=Qt()?.name||"";w(n),e.setAttribute("data-open","");const a=n.createElement("div");a.id=$,n.body.appendChild(a),W(t,e,a),a._sveApp=N(ot,a,{kind:"choices",choices:o.map(i=>({value:i,label:i.toUpperCase(),active:s===i})),onPick:i=>{us(i),w(n)}})}function Ol(t,e){const o=t.document;w(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=$,o.body.appendChild(n),W(t,e,n);const s=a=>{o.getElementById($)&&(n._sveApp?.unmount(),n._sveApp=N(ot,n,{kind:"choices",choices:a,onPick:i=>{i&&(Bt(i,i.length),q()),w(o)}}),W(t,e,n))};s([{value:"",label:m(t,"code_dock_loading")}]),t.fetch("/!/sve/components",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(a=>a.ok?a.json():{items:[]}).then(a=>{const i=Array.isArray(a.items)?a.items:[];s(i.length?i.map(l=>({value:l.tag,label:l.name})):[{value:"",label:m(t,"component_none")}])}).catch(()=>s([{value:"",label:m(t,"component_none")}]))}function Pl(t){const e=St(t),o=g.html,n=g.css;if(!e||o?.state.readOnly||n?.state.readOnly)return;const s=Qt();if(s?.open&&o){const a=o.state.doc.sliceString(s.open.from,s.open.to),i=ha(a,e);i!==a&&o.dispatch({changes:{from:s.open.from,to:s.open.to,insert:i}})}ct(),X(r.cssFull,e)||(r.cssFull=`${String(r.cssFull||"").trimEnd()}${r.cssFull?.trim()?`
`:""}.${e} {
}
`),Jt(),Ae(),Ot(),r.lastWin&&(nt(r.lastWin),Le(r.lastWin),O(r.lastWin))}function Dl(t,e){const o=t.document;if(e.hasAttribute("data-open")){w(o);return}w(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=$,o.body.appendChild(n),W(t,e,n),n._sveApp=N(ko,n,{label:m(t,"code_dock_css_class_name"),placeholder:m(t,"code_dock_css_class_placeholder"),onAdd:s=>{Pl(s),w(o)}})}function Hl(t,e){const o=e.querySelector("[data-sve-css-add-class]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=zd,o.title=m(t,"code_dock_css_add_class"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),r.styleMode==="tw"){w(t.document),Nr(t,o);return}Dl(t,o)}))}function To(){const t={html:"",css:"",js:""};Te(),ct();for(const e of at)e==="html"?t.html=r.htmlScopeActive?r.htmlFull:g.html?.state.doc.toString()??"":e==="css"?(t.css=r.lastWin?Vi(r.cssFull,pt(r.lastWin)):r.cssFull,t.css=ul(t.css,t.html,Md)):t[e]=g[e]?.state.doc.toString()??"";return t}function fs(){if(r.cssValues||!(r.htmlScopePref&&Ce(r.htmlFocus?.from,r.htmlFocus?.to,r.htmlFull.length)))return r.cssPane="full",r.cssScopeSnapshot=r.cssFull,r.cssFull;const t=Se(r.htmlFull.slice(r.htmlFocus.from,r.htmlFocus.to));if(!t.length)return r.cssPane="empty",r.cssScopeSnapshot="","";r.cssPane="tree";const e=go(r.cssFull,t);return r.cssScopeSnapshot=e,e}function te(t,e){r.applying=!0;try{r.lastWin&&(r.htmlScopePref=Zt(r.lastWin)),r.htmlFull=t.html??"",r.cssFull=t.css??"";for(const o of at){const n=g[o];let s=t[o]??"";try{s=o==="html"?is():o==="css"?fs():s}catch{s=o==="html"?r.htmlFull||t.html||"":o==="css"?r.cssFull||t.css||"":s}if(!n)continue;const a=n.state.doc.toString(),i=[qt[o].reconfigure(ge.readOnly.of(!!e)),Vt[o].reconfigure(Y.editable.of(!e))];a!==s?n.dispatch({changes:{from:0,to:a.length,insert:s},effects:i}):n.dispatch({effects:i})}}finally{r.applying=!1}Ae(),Ot(),fo("dock:html-changed"),r.lastWin&&(O(r.lastWin),Le(r.lastWin),K(r.lastWin),se(r.lastWin))}function Ao(t,e){return t.html===e.html&&t.css===e.css&&t.js===e.js}function hs(t){return String(t||"").replace(/\/\*[\s\S]*?\*\//g,"").trim().replace(/\s*:\s*/g,": ").replace(/\s*;\s*/g,";").replace(/\s+/g," ").replace(/;+$/,";")}function ps(t){const e=hs(t).match(/^([a-z-]+)\s*:/i);return e?e[1].toLowerCase():""}function ms(t){const e=hs(t),o=e.indexOf(":");return o===-1?"":e.slice(o+1).replace(/;$/,"").trim().toLowerCase()}function D(t){const e=String(t||"").trim().toLowerCase();return e==="start"||e==="flex-start"||e==="left"||e==="top"?"flex-start":e==="end"||e==="flex-end"||e==="right"||e==="bottom"?"flex-end":e==="row-reverse"?"row-reverse":e==="column-reverse"?"column-reverse":e}function Kt(t){const e=D(t);return e==="flex"||e==="inline-flex"}function Fe(){const t=g.css;if(!t)return null;const e=t.state.selection.main.head,o=t.state.doc.toString(),n=[],s=[];for(let i=0;i<o.length;i+=1){if(o[i]==="{"&&o[i+1]==="{"){const l=o.indexOf("}}",i+2);if(l===-1)break;i=l+1;continue}if(o[i]==="{")n.push(i);else if(o[i]==="}"){const l=n.pop();l!=null&&s.push({from:l+1,to:i,text:o.slice(l+1,i),open:l})}}let a=null;for(const i of s)e<i.open||e>i.to||(!a||i.to-i.open<a.to-a.open)&&(a=i);return a}function zl(t){const e=String(t||"");let o="",n=0;for(let s=0;s<e.length;s+=1){if(e[s]==="{"&&e[s+1]==="{"){const a=e.indexOf("}}",s+2);if(a===-1)break;n===0&&(o+=e.slice(s,a+2)),s=a+1;continue}if(e[s]==="{"){n+=1;continue}if(e[s]==="}"){n=Math.max(0,n-1);continue}n===0&&(o+=e[s])}return o}function ln(t){const e={};for(const o of zl(t).split(";")){const n=ps(o);n&&(e[n]=ms(`${o};`))}return e}function Rl(t,e,o){if(!e||e.from>=e.to)return null;let n=t.state.doc.lineAt(e.from),s=0;for(;n.from<=e.to;){const a=Math.max(n.from,e.from),i=Math.min(n.to,e.to),l=t.state.doc.sliceString(a,i);if(s===0&&ps(l)===o)return{from:a,to:i,text:l};if(s+=jl(l),n.to>=t.state.doc.length||n.to>=e.to)break;n=t.state.doc.lineAt(n.to+1)}return null}function jl(t){let e=0;const o=String(t);for(let n=0;n<o.length;n+=1){if(o[n]==="{"&&o[n+1]==="{"){const s=o.indexOf("}}",n+2);n=s===-1?o.length:s+1;continue}o[n]==="{"?e+=1:o[n]==="}"&&(e-=1)}return e}function lt(t){return(String(t).match(/^\s*/)||[""])[0]}function Ie(t,e,o){for(let n=e.number-1;n>=1;n-=1){const s=t.state.doc.line(n),a=s.text.trim();if(!a)continue;const i=lt(s.text);if(o&&(a==="{"||a.endsWith("{")))return`${i}  `;if(!(a==="}"||a.startsWith("}")))return i}return""}function Wl(t,e){const o=t.state.doc.lineAt(e);if(o.text.trim())return lt(o.text);const n=Ie(t,o,!0);if(n)return n;const s=Fe();return s?vs(t,s):"  "}function vs(t,e){const o=t.state.doc.lineAt(e.from),n=t.state.doc.lineAt(Math.max(e.from,e.to));for(let a=n.number;a>=o.number;a-=1){const i=t.state.doc.line(a),l=Math.max(i.from,e.from),c=Math.min(i.to,e.to),d=t.state.doc.sliceString(l,c);if(d.trim())return(d.match(/^\s*/)||[""])[0]||"  "}return`${(t.state.doc.lineAt(Math.max(0,e.from-1)).text.match(/^\s*/)||[""])[0]}  `}function cn(){g.css?.focus(),r.lastWin&&(nt(r.lastWin),O(r.lastWin))}function gs(t,e){if(!e)return"";const o=t.state.doc.toString();let n=0;for(let s=e.open-1;s>=0;s-=1)if(o[s]==="}"||o[s]==="{"||o[s]===";"){n=s+1;break}return o.slice(n,e.open).replace(/\/\*[\s\S]*?\*\//g,"").trim()}function Nl(t,e){if(!r.cssState||!e)return e;const o=ys(t,e);if(o)return o;const n=gs(t,e);if(!n||n.startsWith("@"))return e;const s=t.state.doc.toString(),a=yt(s,e.open),i=yt(s,e.to)||`${a}    `,l=(t.state.doc.sliceString(e.from,e.to).match(/\n([^\S\n]*)$/)||[null,null])[1],c=l===null?e.to:e.to-l.length,d=`
${i}&${Pe()} {
${i}}
${l??a}`;t.dispatch({changes:{from:c,to:e.to,insert:d}});const f=t.state.doc.toString(),h=f.indexOf("{",c+d.indexOf("&")),p=h===-1?-1:Lt(f,h);return p===-1?e:{from:h+1,to:p,text:f.slice(h+1,p),open:h}}function yt(t,e){const o=t.lastIndexOf(`
`,e-1)+1;return(t.slice(o,e).match(/^\s*/)||[""])[0]}function Z(t){const e=g.css;if(!e||e.state.readOnly||!t.length)return;const o=Fe(),n=t.some(l=>l.value!=null)?Nl(e,o):o;if(!n){const l=t.filter(c=>c.value!=null).map(c=>`${c.property}: ${c.value};`).join(`
`);l&&Ul(l),cn();return}const s=[],a=[],i=vs(e,n);for(const l of t){const c=Rl(e,n,l.property);if(l.value==null){if(!c)continue;let d=c.from,f=c.to;e.state.doc.sliceString(f,f+1)===`
`&&(f+=1),d=Math.max(d,n.from),f=Math.min(f,n.to),s.push({from:d,to:f});continue}if(!(c&&D(ms(c.text))===D(l.value)))if(c){const d=(c.text.match(/^\s*/)||[""])[0];s.push({from:c.from,to:c.to,insert:`${d}${l.property}: ${l.value};`})}else a.push(`${i}${l.property}: ${l.value};`)}if(a.length){const l=!n.text.includes(`
`)||!/\n\s*$/.test(n.text)?`
`:"",c=(n.text.match(/\n([^\S\n]*)$/)||[null,null])[1],d=c===null?n.to:n.to-c.length,f=c===null?"":c;s.push({from:d,to:n.to,insert:`${l}${a.join(`
`)}
${f}`})}s.length&&(s.sort((l,c)=>c.from-l.from||c.to-l.to),e.dispatch({changes:s})),cn()}function Q(){const t=g.css,e=Fe();if(!e)return{};if(r.cssState&&t){const o=ys(t,e);return o?ln(o.text):{}}return ln(e.text)}function ys(t,e){const o=gs(t,e),n=Pe();if(!o||o.startsWith("@"))return null;if(o.endsWith(n))return e;const s=t.state.doc.toString(),a=i=>{const l=Lt(s,i);return l===-1?null:{from:i+1,to:l,text:s.slice(i+1,l),open:i}};for(const i of[`&${n}`,`${o}${n}`]){const l=new RegExp(`(^|[^\\w-])${i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\s*\\{`,"g");let c;for(;c=l.exec(s);){const d=s.indexOf("{",c.index);if(i.startsWith("&")&&(d<e.from||d>e.to))continue;const f=a(d);if(f)return f}}return null}function ql(t){const e=Q(),o=Kt(e.display),n=D(e["flex-direction"])||(o?"row":"");if(o&&n===t){const s=[];e["flex-direction"]&&s.push({property:"flex-direction",value:null}),Kt(e.display)&&s.push({property:"display",value:null}),Z(s);return}Z([{property:"display",value:"flex"},{property:"flex-direction",value:t}])}function Vl(t){const e=Q();if(t==="flex"&&Kt(e.display)){Z([{property:"justify-content",value:null},{property:"align-items",value:null},{property:"flex-direction",value:null},{property:"display",value:null}]);return}Z([{property:"display",value:t}])}function Ul(t){const e=g.css;if(!e||e.state.readOnly)return;const o=e.state.selection.main.head,n=e.state.doc.lineAt(o),s=n.text.slice(0,o-n.from),a=n.text.slice(o-n.from),i=Wl(e,o),l=t.replace(/;?$/,";");if(s.trim()===""&&a.trim()===""){const d=`${i}${l}
${i}`;e.dispatch({changes:{from:n.from,to:n.to,insert:d},selection:{anchor:n.from+d.length}});return}const c=`
${i}${l}
${i}`;e.dispatch({changes:{from:o,to:e.state.selection.main.to,insert:c},selection:{anchor:o+c.length}})}function O(t){try{Kl(t),ne(t)}catch{}}function Kl(t){const e=r.styleMode==="tw",o=e?{}:Q(),n=Kt(e?No("display"):o.display),s=D(o["flex-direction"])||(n?"row":""),a=i=>e?Ur()&&!!i.tw&&!!No(i.tw):!!i.css&&i.css in o;ut.tools=pr.map(i=>{const l=(i.kids||[]).filter(c=>c.when!=="flex"||n).map(c=>({id:c.id,title:c.title,icon:yn[c.icon]||"",sep:!!c.sep,open:r.cssOpenMenu===c.id,active:e?a(c):c.kind==="display"?n:c.kind==="flexDir"?n&&s===c.value:c.value?D(o[c.css])===D(c.value):a(c)}));return{id:i.id,title:i.title,icon:yn[i.id]||jd[i.id]||"",open:r.cssOpenTool===i.id||r.cssOpenMenu===i.id,kids:l,active:i.value?!e&&D(o[i.css])===D(i.value):a(i)||l.some(c=>c.active)}})}function w(t){const e=t?.getElementById($);r.cssOpenMenu="",e?._sveApp?.unmount(),e?.remove(),t?.querySelectorAll("[data-sve-css-tool][data-open], [data-sve-html-tool][data-open], [data-sve-css-add-class][data-open], [data-sve-code-history][data-open]").forEach(o=>o.removeAttribute("data-open"))}function vu(t){w(t),bt(t),rt(t);for(const e of at)g[e]&&Ys?.(g[e])}function bs(t){if(r.cssColorsPromise)return r.cssColorsPromise;const e=t.Statamic?.$config?.get?.("cpUrl")||`/${t.Statamic?.$config?.get?.("cpRoute")||"cp"}`;return r.cssColorsPromise=t.fetch(`${e}/color-scheme/swatches`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async o=>{if(!o.ok)return[];const n=await o.json().catch(()=>[]);return Array.isArray(n)?n:[]}).catch(()=>[]).then(o=>{const n=new Set,s=[];for(const a of o){const i=a.var||a.value||a.handle,l=String(i||"").trim().replace(/^var\((.+)\)$/,"$1");!l||n.has(l)||(n.add(l),s.push({name:l,hex:a.hex||a.color||""}))}for(const[a,i]of hr)n.has(a)||(n.add(a),s.push({name:a,hex:i}));return s}),r.cssColorsPromise}function xs(t,e){const o=Q()[e]||"",n=String(o).match(/^var\(\s*([^)]+?)\s*\)$/i),s=n?n[1].trim():"";for(const a of t.querySelectorAll("[data-sve-css-token]"))s&&a.getAttribute("data-sve-css-token")===s?a.setAttribute("data-active",""):a.removeAttribute("data-active")}function W(t,e,o){const n=e.getBoundingClientRect(),s=8;o.style.left=`${Math.max(s,Math.min(n.left,t.innerWidth-220))}px`,o.style.top=`${Math.max(s,n.bottom+4)}px`}function Gl(t,e,o){const n=t.document;w(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=$,n.body.appendChild(s),W(t,e,s);const a=i=>{s._sveApp?.unmount(),s._sveApp=N(ot,s,{kind:"colors",swatches:i,onClear:()=>{Z([{property:o,value:null}]),w(n)},onPick:l=>{Z([{property:o,value:`var(${l})`}]),w(n)}}),xs(s,o)};a(hr.map(([i,l])=>({name:i,hex:l}))),bs(t).then(i=>{n.getElementById($)&&a(i.map(l=>({name:l.name,hex:l.hex})))})}function Xl(t,e,o,n){const s=t.document;w(s),e.setAttribute("data-open","");const a=s.createElement("div"),i=Q()[o]||"";a.id=$,s.body.appendChild(a),W(t,e,a),a._sveApp=N(ot,a,{kind:"choices",choices:(n||[]).map(l=>({value:l,label:l,active:D(l)===D(i)})),onPick:l=>{const c=D(l)===D(Q()[o]||"");Z([{property:o,value:c?null:l}]),w(s)}})}function dn(t,e,o,n=[]){const s=t.document;w(s),e.setAttribute("data-open",""),qr(t);const a=s.createElement("div");a.id=$,s.body.appendChild(a),W(t,e,a);const i=()=>{const l=[...n.map(d=>({value:d,label:d})),...Vr(t,o).map(d=>({value:d.value,label:d.value}))],c=Q()[o]||"";a._sveApp?.unmount(),a._sveApp=N(ot,a,{kind:"choices",choices:l.map(d=>({...d,active:D(d.value)===D(c)})),onPick:d=>{Z([{property:o,value:d||null}]),w(s)}})};i(),bs(t).then(()=>{s.getElementById($)===a&&i()})}function Yl(t,e,o){const n=t.document;w(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=$,n.body.appendChild(s),W(t,e,s),s._sveApp=N(ot,s,{kind:"choices",choices:Rd.map(a=>({value:a,token:a,label:a})),onPick:a=>{Z([{property:o,value:`var(${a})`}]),w(n)}}),xs(s,o)}const qe=/\{\{#[\s\S]*?#\}\}|\{\{[\s\S]*?\}\}/g;function un(t,e,o){const n=new e.RangeSetBuilder,s=t.doc.toString();qe.lastIndex=0;let a=qe.exec(s);for(;a;){const i=a.index,l=i+a[0].length,c=a[0];n.add(i,l,c.startsWith("{{#")?o.comment:/^\{\{\s*\//.test(c)?o.close:o.tag),a=qe.exec(s)}return n.finish()}function Zl(t){const e={tag:t.Decoration.mark({class:"sve-cm-antlers"}),close:t.Decoration.mark({class:"sve-cm-antlers sve-cm-antlers-close"}),comment:t.Decoration.mark({class:"sve-cm-antlers-comment"})};return{extensions:[t.StateField.define({create(n){return un(n,t,e)},update(n,s){return s.docChanged?un(s.state,t,e):n},provide:n=>t.EditorView.decorations.from(n)})]}}const E=co({tag:"",emptyText:"",addLabel:"",dropTitle:"",chips:[],states:[],canEdit:!1,onAdd:null,onChip:null,onDrop:null}),Jl={class:"sve-al"},Ql={class:"sve-al-head"},tc={key:0,class:"sve-al-tag"},ec=["title","disabled"],oc={key:0,class:"sve-al-empty"},nc={class:"sve-al-chips"},sc=["data-sve-al-chip","title","disabled","onClick"],rc={class:"sve-al-name"},ac={key:0,class:"sve-al-value"},ic=["title","onClick"],lc={__name:"AlpinePanel",setup(t){return(e,o)=>(y(),b("div",Jl,[v("div",Ql,[T(E).tag?(y(),b("span",tc,"<"+A(T(E).tag)+">",1)):j("",!0),(y(!0),b(P,null,V(T(E).states,n=>(y(),b("span",{key:n,class:"sve-al-state"},A(n),1))),128)),o[1]||(o[1]=v("span",{class:"sve-al-gap"},null,-1)),v("button",{type:"button","data-sve-al-add":"",title:T(E).addLabel,disabled:!T(E).canEdit,onClick:o[0]||(o[0]=L(n=>T(E).onAdd?.(n),["prevent","stop"]))},"+",8,ec)]),T(E).chips.length?j("",!0):(y(),b("div",oc,A(T(E).emptyText),1)),v("div",nc,[(y(!0),b(P,null,V(T(E).chips,n=>(y(),b("span",{key:n.id,class:"sve-al-chip-wrap"},[v("button",{type:"button","data-sve-al-chip":n.id,title:n.title,disabled:!T(E).canEdit,onClick:L(s=>T(E).onChip?.(s,n.id),["prevent","stop"])},[v("span",rc,A(n.name),1),n.value?(y(),b("span",ac,A(n.value),1)):j("",!0)],8,sc),T(E).canEdit?(y(),b("button",{key:0,type:"button",class:"sve-al-drop",title:T(E).dropTitle,onClick:L(s=>T(E).onDrop?.(n.id),["prevent","stop"])},"−",8,ic)):j("",!0)]))),128))])]))}},cc=_n(lc,[["__scopeId","data-v-15add965"]]),dc=[{id:"state",lang:"alpine_group_state"},{id:"act",lang:"alpine_group_act"},{id:"react",lang:"alpine_group_react"}],fn=[{id:"state",group:"state",label:"alpine_state",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: false }"}]},{id:"state_text",group:"state",label:"alpine_state_text",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: '|' }"}]},{id:"toggle",group:"act",label:"alpine_toggle",icon:"toggle",needsName:!0,attrs:[{name:"@click",value:":name = !:name"}]},{id:"open",group:"act",label:"alpine_open",icon:"open",needsName:!0,attrs:[{name:"@click",value:":name = true"}]},{id:"close",group:"act",label:"alpine_close",icon:"close",needsName:!0,attrs:[{name:"@click",value:":name = false"}]},{id:"open_hover",group:"act",label:"alpine_open_hover",icon:"open",needsName:!0,attrs:[{name:"@mouseenter",value:":name = true"}]},{id:"close_leave",group:"act",label:"alpine_close_leave",icon:"close",needsName:!0,attrs:[{name:"@mouseleave",value:":name = false"}]},{id:"open_focus",group:"act",label:"alpine_open_focus",icon:"open",needsName:!0,attrs:[{name:"@focusin",value:":name = true"}]},{id:"close_blur",group:"act",label:"alpine_close_blur",icon:"close",needsName:!0,attrs:[{name:"@focusout",value:":name = false"}]},{id:"close_outside",group:"act",label:"alpine_close_outside",icon:"outside",needsName:!0,attrs:[{name:"@click.outside",value:":name = false"}]},{id:"close_escape",group:"act",label:"alpine_close_escape",icon:"escape",needsName:!0,attrs:[{name:"@keydown.escape.window",value:":name = false"}]},{id:"show",group:"react",label:"alpine_show",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"}]},{id:"show_smooth",group:"react",label:"alpine_show_smooth",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"},{name:"x-transition",value:""}]},{id:"hide_until_ready",group:"react",label:"alpine_hide_until_ready",icon:"cloak",attrs:[{name:"x-cloak",value:""}]},{id:"class_when",group:"react",label:"alpine_class_when",icon:"klass",needsName:!0,attrs:[{name:":class",value:":name ? '|' : ''"}]},{id:"text",group:"react",label:"alpine_text",icon:"text",needsName:!0,attrs:[{name:"x-text",value:":name"}]}];function uc(t){return(t?.attrs||[]).map(e=>e.name).join(" ")}const fc=/^(x-[\w:.-]+|@[\w:.-]+|:[\w-]+)$/;function hc(t){return fc.test(String(t||""))}function ee(t){const e=String(t||""),o=[],n=/([@:a-zA-Z_][\w:.@-]*)(\s*=\s*(["'])([\s\S]*?)\3)?/g;let s,a=!0;for(;s=n.exec(e);){if(a){a=!1;continue}s[0].trim()&&o.push({name:s[1],value:s[4]??"",from:s.index,to:s.index+s[0].length,alpine:hc(s[1])})}return o}function ks(t){const e=String(t||"").trim().replace(/^\{|\}$/g,""),o=[],n=/(^|,)\s*([a-zA-Z_$][\w$]*)\s*:/g;let s;for(;s=n.exec(e);)o.push(s[2]);return o}function pc(t,e){return t.map(o=>({name:o.name,value:String(o.value).replaceAll(":name:",`${e}:`).replaceAll(":name",e)}))}function Mo(t,e,o){const n=g.html,s=$t();if(!n||n.state.readOnly||!s)return;const a=r.htmlScopeActive&&!!r.htmlFocus,i=a?r.htmlFocus.from:0,c=(a?r.htmlFull:n.state.doc.toString()).slice(s.from,s.openTo),d=o===""?e:`${e}="${o}"`,f=ee(c).find(p=>p.name===e);let h;if(f)h=c.slice(0,f.from)+d+c.slice(f.to);else{const p=c.search(/\s|\/?>$/);h=p===-1?c:`${c.slice(0,p)} ${d}${c.slice(p)}`}h!==c&&(gt(n,[{from:s.from-i,to:s.openTo-i,insert:h}],null),Oe(t))}function mc(t,e){const o=g.html,n=$t();if(!o||o.state.readOnly||!n)return;const s=r.htmlScopeActive&&!!r.htmlFocus,a=s?r.htmlFocus.from:0,l=(s?r.htmlFull:o.state.doc.toString()).slice(n.from,n.openTo),c=ee(l).find(h=>h.name===e);if(!c)return;let d=c.from;for(;d>0&&/\s/.test(l[d-1]);)d-=1;const f=l.slice(0,d)+l.slice(c.to);gt(o,[{from:n.from-a,to:n.openTo-a,insert:f}],null),Oe(t)}function to(t){const e=g.html;if(!e)return[];const n=r.htmlScopeActive&&!!r.htmlFocus?r.htmlFull:e.state.doc.toString(),s=$t(),a=[],i=En(xe(n),new Set);for(const l of i){if(!s||l.from>s.from||l.to<s.to)continue;const c=ee(n.slice(l.from,l.openTo)).find(d=>d.name==="x-data");c&&a.push(...ks(c.value))}return[...new Set(a)]}function vc(t){const e=g.html,o=$t();if(!e||!o)return[];const s=r.htmlScopeActive&&!!r.htmlFocus?r.htmlFull:e.state.doc.toString(),a=ee(s.slice(o.from,o.openTo)).find(i=>i.name==="x-data");return a?ks(a.value):[]}function gc(t,e){const o=t.document;w(o),e.setAttribute("data-open","");const n=to(),s=o.createElement("div");s.id=$,o.body.appendChild(s),W(t,e,s);const a=!n.length,i=!a&&!vc().length,c=dc.filter(d=>d.id==="state"?!i:!a).flatMap(d=>{const f=fn.filter(h=>h.group===d.id);return f.length?[{value:`\0${d.id}`,label:m(t,a&&d.id==="state"?"alpine_group_state_first":d.lang),heading:!0},...f.map(h=>({value:h.id,label:m(t,h.label),hint:uc(h)}))]:[]});a&&c.push({value:"\0note",label:m(t,"alpine_needs_state"),note:!0}),s._sveApp=N(ot,s,{kind:"choices",choices:c,onPick:d=>{const f=fn.find(h=>h.id===d);if(w(o),!!f){if(!f.needsName){for(const h of f.attrs)Mo(t,h.name,h.value);return}yc(t,e,f,n)}}})}function yc(t,e,o,n){const s=t.document,a=l=>{const c=String(l||"").trim().replace(/[^\w$]/g,"");if(w(s),!!c)for(const d of pc(o.attrs,c))Mo(t,d.name,d.value.replace("|",""))};if(!n.length){eo(t,e,a);return}const i=s.createElement("div");i.id=$,s.body.appendChild(i),W(t,e,i),i._sveApp=N(ot,i,{kind:"choices",choices:[{value:"\0head",label:m(t,"alpine_name"),heading:!0},...n.map(l=>({value:l,label:l})),{value:"\0new",label:m(t,"alpine_new_name")}],onPick:l=>{if(l==="\0new"){eo(t,e,a);return}a(l)}})}function eo(t,e,o){const n=t.document;w(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=$,n.body.appendChild(s),W(t,e,s),s._sveApp=N(ko,s,{label:m(t,"alpine_name"),placeholder:m(t,"alpine_name_placeholder"),onAdd:a=>o(a)})}function Oe(t){const o=t?.document.getElementById(u)?.querySelector("[data-sve-alpine-host]");if(!o)return;const n=$t(),s=g.html,a=r.htmlScopeActive&&!!r.htmlFocus,i=s?a?r.htmlFull:s.state.doc.toString():"",l=n?ee(i.slice(n.from,n.openTo)):[];E.tag=n?.tag||"",E.canEdit=!r.lastLocked&&!!n,E.emptyText=m(t,n?to().length?"alpine_none_ready":"alpine_none":"alpine_pick"),E.addLabel=m(t,"alpine_add"),E.dropTitle=m(t,"alpine_remove"),E.states=to(),E.chips=l.filter(c=>c.alpine).map(c=>({id:c.name,name:c.name,value:c.value,title:c.value?`${c.name}="${c.value}"`:c.name})),E.onAdd=c=>gc(t,c.currentTarget),E.onDrop=c=>mc(t,c),E.onChip=(c,d)=>{E.chips.find(h=>h.id===d)&&eo(t,c.currentTarget,h=>Mo(t,d,h))},o._sveMounted||(o._sveMounted=!0,_t(o,cc))}function bc(){if(r.cssGhostUi)return r.cssGhostUi;const t=Ht.mark({class:"sve-css-ghost"}),e=o=>{const n=new Dt;if(!r.lastWin)return n.finish();try{for(const s of Ui(o.doc.toString(),pt(r.lastWin)))n.add(s.from,s.to,t)}catch{}return n.finish()};return r.cssGhostUi=Pt.define({create:o=>e(o),update:(o,n)=>n.docChanged?e(n.state):o,provide:o=>Y.decorations.from(o)}),r.cssGhostUi}let le=null,ve=null;function xc(){if(le)return le;ve=ze.define();const t=Ht.line({class:"sve-css-id"}),e=o=>{const n=new Dt;if(!r.lastWin||!r.cssValues)return n.finish();try{const s=o.doc;for(const a of he(s.toString(),pt(r.lastWin),r.cssSize)){const i=s.lineAt(Math.min(a.from,s.length)).number,l=s.lineAt(Math.min(Math.max(a.to-1,a.from),s.length)).number;for(let c=i;c<=l;c+=1)n.add(s.line(c).from,s.line(c).from,t)}}catch{}return n.finish()};return le=Pt.define({create:o=>e(o),update:(o,n)=>n.docChanged||n.effects.some(s=>s.is(ve))?e(n.state):o,provide:o=>Y.decorations.from(o)}),le}function Eo(){ve&&g.css&&g.css.dispatch({effects:ve.of(null)})}function kc(){return r.htmlPartialUi||(r.htmlPartialUi=Xr({Decoration:Ht,StateField:Pt,StateEffect:ze,RangeSetBuilder:Dt,EditorView:Y})),r.htmlPartialUi}function Sc(){return r.htmlAntlersUi||(r.htmlAntlersUi=Zl({Decoration:Ht,StateField:Pt,RangeSetBuilder:Dt,EditorView:Y})),r.htmlAntlersUi}function wc(){return r.htmlClassTokenUi||(r.htmlClassTokenUi=$a({Decoration:Ht,StateField:Pt,StateEffect:ze,RangeSetBuilder:Dt,EditorView:Y})),r.htmlClassTokenUi}function _c(t,e,o){g[e]?.destroy();const n=ro.of([{key:"Mod-s",run:()=>(et(t.document),!0)}]);g[e]=new Y({state:ge.create({doc:"",extensions:[Rs(),js(),Ws(),Us(),ud(e),Gs(),Ks({tooltipClass:()=>"sve-tw-complete"}),...e==="html"?[Qs.data.of({autocomplete:Kr(t)}),Gr(Js,t)]:[],...e==="html"?[...aa(),ia()]:[],...e==="css"?[nr(),bc(),xc()]:[],ro.of([...Ns,...e==="html"?[{key:"Tab",run:la}]:[],qs,...Vs,...Zs,...Xs]),n,Y.lineWrapping,...e==="html"||e==="css"?kc().extensions:[],...e==="html"?Sc().extensions:[],...e==="html"?wc().extensions:[],qt[e].of(ge.readOnly.of(!!r.lastLocked)),Vt[e].of(Y.editable.of(!r.lastLocked)),Y.updateListener.of(s=>{e==="html"&&s.docChanged&&!r.applying&&(_l(),fo("dock:html-changed")),e==="css"&&s.docChanged&&!r.applying&&$l(),s.docChanged&&nt(t),e==="css"&&(s.docChanged||s.selectionSet)&&O(t),e==="css"&&s.docChanged&&!r.applying&&oe(t),e==="html"&&(s.docChanged||s.selectionSet)&&(Le(t),Oe(t),r.applying||se(t))}),...vr(C,{height:"auto",background:"#1E1E21",scroller:{overflow:"visible",height:"auto",minHeight:0},extraTags:s=>[{tag:s.tagName,color:"#4ec9b0"},{tag:s.attributeName,color:"#9cdcfe"},{tag:s.attributeValue,color:"#ce9178"},{tag:s.angleBracket,color:"#808080"}]})]}),parent:o})}function $c(t){if(!t||t.querySelector(".cm-editor"))return;t.replaceChildren();const e=t.ownerDocument.createElement("span");e.style.cssText="width:16px;height:16px;margin:12px;border:2px solid #858585;border-right-color:transparent;border-radius:50%;display:block;animation:sve-cm-wait .6s linear infinite",t.appendChild(e)}function pt(t){return ho(t).map(e=>({handle:e.handle,base:e.base,max:e.max,media:e.media,media_px:e.media_px,label:e.label}))}function Ss(t,e){return pt(t).find(o=>o.handle===e)||null}function Pe(t=r.cssState){return t?t==="before"||t==="after"?`::${t}`:`:${t}`:""}function oe(t,e=!1){const o=g.css;if(!o||!ao||!io)return;const n=o.state.doc.toString(),s=`${r.cssValues?"1":"0"}|${r.cssSize}|${$e(n).map(f=>`${f.from}-${f.to}`).join(",")}`;if(!e&&s===r.cssFoldSig)return;r.cssFoldSig=s;const a=pt(t),i=new Map,l=[...qi(n,a,r.cssSize),...r.cssValues?[]:he(n,a,r.cssSize).map(f=>({from:f.from,to:f.to}))];for(const f of l)f.to>f.from&&i.set(`${f.from}:${f.to}`,{from:f.from,to:f.to});const c=[],d=new Set;sr(o.state).between(0,n.length,(f,h)=>{const p=`${f}:${h}`;d.add(p),!i.has(p)&&r.cssOwnFolds.has(p)&&c.push(io.of({from:f,to:h}))});for(const[f,h]of i)d.has(f)||c.push(ao.of(h));r.cssOwnFolds=new Set(i.keys()),c.length&&o.dispatch({effects:c})}function oo(t,e){const o=r.cssFull||e;return/max-width/i.test(o)&&!/width\s*</i.test(o)&&t.media_px||t.media}function Cc(t,e){const o=g.css;if(!o||o.state.readOnly)return;const n=pt(t),s=Ss(t,e),a=o.state.doc.toString();if(!s||s.base){const f=o.state.selection.main.head,h=$e(a).find(p=>f>=p.from&&f<=p.to);h&&o.dispatch({selection:{anchor:h.from},scrollIntoView:!0});return}const i=xo(a,n,e);if(i.length){const f=i[0],h=Math.min(f.bodyTo,f.bodyFrom+(a.slice(f.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);o.dispatch({selection:{anchor:h},scrollIntoView:!0});return}const l=oo(s,a),c=ws(o,a),d=`

${c.indent}@media ${l} {
${c.indent}    
${c.indent}}${c.suffix}`;o.dispatch({changes:{from:c.at,to:c.at,insert:d},selection:{anchor:c.at+d.lastIndexOf("    ")+4},scrollIntoView:!0})}function ws(t,e){const o=$e(e);if(o.length){const i=o[o.length-1];return{at:i.to,indent:yt(e,i.from),suffix:""}}const n=i=>({at:i.to,indent:yt(e,i.to)||`${yt(e,i.open)}    `,suffix:`
${yt(e,i.open)}`}),s=Fe();if(s)return n(s);const a=Tc(e);return a?n(a):{at:e.length,indent:"",suffix:""}}function Tc(t){const e=String(t||"");let o=null,n=0,s=0;for(;n<e.length;){if(e[n]==="}"||e[n]===";"){n+=1,s=n;continue}if(e[n]!=="{"){n+=1;continue}const a=Lt(e,n);if(a===-1||o||(o=e.slice(s,n).trim().startsWith("@")?null:{from:s,open:n,to:a},!o))return null;n=a+1,s=n}return o}function Ac(t,e){const o=e===r.cssSize?"":e;r.cssSize=o,U(t,Fo,o),xt("lp:set-device",{win:t,key:o?Tr(o,t):"Responsive"}),o&&Cc(t,o),r.cssValues&&$s(t),oe(t,!0),Eo(),ne(t),O(t)}function Mc(t,e){r.cssState=Io.includes(e)?e:"",U(t,no,r.cssState),w(t.document),ne(t),O(t)}function Ec(t,e){const o=t.document;w(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=$,o.body.appendChild(n),W(t,e,n),n._sveApp=N(ot,n,{kind:"choices",choices:[{value:"",label:m(t,"css_state_none"),active:!r.cssState},...Io.map(s=>({value:s,label:Pe(s),active:s===r.cssState}))],onPick:s=>Mc(t,s)})}function ne(t){const o=t?.document.getElementById(u)?.querySelector("[data-sve-css-head]");if(!o)return;const n=$t(),s=pt(t),a=g.css?.state.doc.toString()??"";B.tag=n?.tag||"",B.scope=fa(n?It().slice(n.from,n.openTo):"")||"",B.canEdit=!r.lastLocked,B.onTag=i=>Yr(t,i.currentTarget,n),B.state=r.cssState,B.stateLabel=r.cssState?Pe(r.cssState):m(t,"css_state"),B.onState=i=>Ec(t,i.currentTarget),B.onSize=i=>Ac(t,i),B.sizes=[{key:"",label:m(t,"tw_size_all"),title:m(t,"css_size_all_title"),active:!r.cssSize},...s.map(i=>{const l=i.base||xo(a,s,i.handle).length>0;return{key:i.handle,label:i.label,title:i.base?m(t,"css_size_base_title"):`@media ${i.media}${l?"":`  ·  ${m(t,"css_size_new")}`}`,active:r.cssSize===i.handle}})],o._sveMounted||(o._sveMounted=!0,_t(o,tl))}be("lp:device",t=>{const e=r.lastWin;if(!e||!As(e.document))return;const o=ho(e).find(n=>n.device===t)?.handle||"";o!==r.cssSize&&(r.cssSize=o,U(e,Fo,o),oe(e,!0),Eo(),ne(e),O(e))});function Bc(t){const e=Math.max(0,Math.round(Date.now()/1e3-t)),o=new Date(t*1e3).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});let n=o;try{const s=new Intl.RelativeTimeFormat(void 0,{numeric:"auto"});e<90?n=s.format(-e,"second"):e<5400?n=s.format(-Math.round(e/60),"minute"):e<86400?n=s.format(-Math.round(e/3600),"hour"):n=s.format(-Math.round(e/86400),"day")}catch{}return`${n} · ${o}`}function _s(t,e){return t.fetch(e,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}})}async function Lc(t,e){const o=t.document,n=Ct();if(w(o),!n)return;let s=[];try{const i=await _s(t,`/!/sve/section-template/history?type=${encodeURIComponent(n)}`);i.ok&&(s=(await i.json())?.entries||[])}catch{s=[]}if(!o.getElementById(u)||!o.contains(e))return;e.setAttribute("data-open","");const a=o.createElement("div");a.id=$,o.body.appendChild(a),W(t,e,a),a._sveApp=N(ot,a,{kind:"choices",choices:s.length?s.map(i=>({value:i.id,label:Bc(i.at)})):[{value:"",label:m(t,"code_dock_history_empty")}],onPick:i=>{w(o),i&&Fc(t,n,i)}})}async function Fc(t,e,o){if(ht())return;let n=null;try{const s=await _s(t,`/!/sve/section-template/history/entry?type=${encodeURIComponent(e)}&id=${encodeURIComponent(o)}`);s.ok&&(n=await s.json())}catch{n=null}!n||ht()||(te({html:n.html??"",css:n.css??"",js:n.js??""},r.lastLocked),nt(t),se(t))}function Gt(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-code-strip]");if(!e)return;e.hidden=r.styleMode!=="tw";const o=Bn(t);e.innerHTML=Wd,e.title=m(t,o?"tw_strip_on":"tw_strip_off"),e.setAttribute("aria-label",e.title),e.setAttribute("aria-pressed",o?"true":"false")}function Ic(t,e){const o=e.querySelector("[data-sve-code-strip]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Zr(t,!Bn(t)),Gt(t),Jr(t)}),Gt(t))}function Oc(t,e){const o=e.querySelector("[data-sve-code-history]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=Nd,o.title=m(t,"code_dock_history"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),o.hasAttribute("data-open")){w(t.document);return}Lc(t,o)}))}function gu(){return r.styleMode}function Pc(t){return r.styleMode==="tw"?$t():null}function $t(t){const e=g.html;if(!e)return null;const o=r.htmlScopeActive&&!!r.htmlFocus,n=o?r.htmlFull:e.state.doc.toString(),a=(o?r.htmlFocus.from:0)+e.state.selection.main.from,i=En(xe(n),new Set);let l=null;for(const c of i)c.from<=a&&a<c.to&&(l=c);return l}function se(t){r.styleMode==="tw"&&Qr(t,Pc())}function Bo(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-values-mode]");if(!e||!o)return;e.setAttribute("data-sve-values",r.cssValues?"on":"off");const n=t.document.createElement("span");n.textContent=m(t,"code_dock_values"),o.innerHTML=Vd,o.appendChild(n),o.title=m(t,r.cssValues?"code_dock_values_off":"code_dock_values_on"),o.setAttribute("aria-label",o.title),o.setAttribute("aria-pressed",r.cssValues?"true":"false")}function $s(t){const e=g.css;if(!e||e.state.readOnly)return;const o=pt(t),n=e.state.doc.toString(),s=he(n,o,r.cssSize);if(e.focus(),s.length){const p=s[0],x=Math.min(p.bodyTo,p.bodyFrom+(n.slice(p.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);e.dispatch({selection:{anchor:x},scrollIntoView:!0});return}const a=Ss(t,r.cssSize);if(!a||a.base){const p=`#id-{{ id }} {
    `;e.dispatch({changes:{from:0,to:0,insert:`${p}
}

`},selection:{anchor:p.length},scrollIntoView:!0});return}const i=xo(n,o,r.cssSize)[0];if(i){const p=`${yt(n,i.from)}    `,x=`
${p}#id-{{ id }} {
${p}    `;e.dispatch({changes:{from:i.bodyFrom,to:i.bodyFrom,insert:`${x}
${p}}
`},selection:{anchor:i.bodyFrom+x.length},scrollIntoView:!0});return}const l=ws(e,n),c=`${l.indent}    `,d=he(n,o,"").some(p=>l.at>p.bodyFrom&&l.at<=p.bodyTo),f=d?`

${l.indent}@media ${oo(a,n)} {
${c}`:`

${l.indent}@media ${oo(a,n)} {
${c}#id-{{ id }} {
${c}    `,h=d?`
${l.indent}}${l.suffix}`:`
${c}}
${l.indent}}${l.suffix}`;e.dispatch({changes:{from:l.at,to:l.at,insert:`${f}${h}`},selection:{anchor:l.at+f.length},scrollIntoView:!0})}function Dc(t,e){r.cssValues=!!e,U(t,Ho,r.cssValues?"1":"0"),w(t.document),r.cssOpenTool="",Bo(t),ct(),Jt(),r.cssValues&&$s(t),oe(t,!0),Eo(),ne(t),O(t)}function Lo(t){const e=t?.document.getElementById(u);if(!e)return;const o=r.styleMode==="tw";e.setAttribute("data-sve-style",r.styleMode);const n=e.querySelector("[data-sve-css-label]");n&&(n.textContent=o?m(t,"code_dock_style_tw"):m(t,"code_dock_css"));const s=e.querySelector("[data-sve-style-mode]");if(!s)return;const a=t.document.createElement("span");a.textContent=o?m(t,"code_dock_style_tw"):m(t,"code_dock_css"),s.innerHTML=o?Ud:qd,s.appendChild(a),s.title=m(t,o?"code_dock_style_to_css":"code_dock_style_to_tw"),s.setAttribute("aria-label",s.title),s.setAttribute("aria-pressed",o?"true":"false")}function Cs(t){t?.document.getElementById(u),w(t.document),Ye(t),r.cssOpenTool="",r.cssOpenMenu="",r.styleMode==="tw"&&r.cssValues&&(r.cssValues=!1,U(t,Ho,"0")),Lo(t),Bo(t),Gt(t),r.cssToolRow?.(),r.styleMode==="tw"&&(r.htmlScopePref=!0,U(t,Re,"1"),Ze(t,!0)),se(t),Oe(t),O(t)}const Fo="sve-css-size",no="sve-css-state",Io=["hover","focus","focus-visible","active","disabled","before","after"];function Hc(t,e){r.styleMode=e==="tw"?"tw":"css",U(t,cr,r.styleMode),Cs(t)}function zc(t,e){if(e._sveStyleModeBound)return;e._sveStyleModeBound=!0,r.styleMode=J(t,cr)==="tw"?"tw":"css";const o=J(t,Fo)||"";r.cssSize=ho(t).some(n=>n.handle===o)?o:"",r.cssState=Io.includes(J(t,no))?J(t,no):"",r.cssValues=J(t,Ho)==="1",e.querySelector("[data-sve-style-mode]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Hc(t,r.styleMode==="tw"?"css":"tw")}),e.querySelector("[data-sve-values-mode]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Dc(t,!r.cssValues)}),Cs(t),Bo(t)}function Rc(t,e){const o=e.querySelector("[data-sve-css-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=a=>e.querySelector(`[data-sve-css-tool="${a}"], [data-sve-css-kid="${a}"]`),s=a=>{const i=n(a.id),l=r.cssOpenMenu===a.id;if(w(t.document),l){Ye(t),O(t);return}if(!i)return;const c=r.styleMode==="tw"?!a.twClass&&!!a.tw:!a.kind&&!a.value&&!(a.css in Q())&&!!a.menu,d=()=>{c&&(r.cssOpenMenu=a.id)};if(r.styleMode==="tw"){Ye(t),a.twClass?(ta(t,a.twClass),O(t)):a.tw&&(ea(t,i,a.tw,()=>O(t)),d(),O(t));return}if(a.kind==="flexDir"){ql(a.value);return}if(a.kind==="display"){Vl(a.value);return}if(a.value){const f=D(Q()[a.css])===D(a.value);Z([{property:a.css,value:f?null:a.value}]);return}if(a.css in Q()){Z([{property:a.css,value:null}]),O(t);return}a.menu==="colors"?Gl(t,i,a.css):a.menu==="spacing"?Yl(t,i,a.css):a.menu==="sizes"?dn(t,i,a.css,Zd):a.menu==="choices"?Xl(t,i,a.css,a.choices):a.menu==="values"&&dn(t,i,a.css),d(),O(t)};ut.onTool=a=>{const i=ye.get(a)?.tool;if(i){if(i.kids?.length){r.cssOpenTool=r.cssOpenTool===i.id?"":i.id,w(t.document),O(t);return}s(i)}},ut.onKid=(a,i)=>{const l=ye.get(i);l?.kid&&s(l.kid)},r.cssToolRow=()=>{_t(o,Ri),O(t)},r.cssToolRow(),t.document.addEventListener("mousedown",a=>{a.target.closest(`#${$}, [data-sve-css-tools], [data-sve-html-tools], [data-sve-css-add-class]`)||w(t.document)},!0)}function jc(t,e){const o=e.querySelector("[data-sve-html-tidy]");o&&(o.innerHTML=Ln.tidy,o.title=m(t,"code_dock_html_tidy"),o.setAttribute("aria-label",o.title),o.setAttribute("data-tip",o.title))}function Wc(t,e){const o=e.querySelector("[data-sve-html-tidy]");jc(t,e),!(!o||o._sveBound)&&(o._sveBound=!0,o.addEventListener("mousedown",n=>n.preventDefault()),o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),ds()}))}function Nc(t,e){const o=e.querySelector("[data-sve-html-tools]");!o||o._sveBound||(o._sveBound=!0,_t(o,Ii,{tools:lo.map(n=>({...n,icon:Ln[n.id]||""})),onTool:n=>{const s=lo.find(i=>i.id===n),a=o.querySelector(`[data-sve-html-tool="${n}"]`);if(s){if(s.menu==="heading"){an(t,a,fr);return}if(s.menu==="text"){an(t,a,oa);return}if(s.tidy){ds();return}if(s.menu==="component"){Ol(t,a);return}if(w(t.document),s.snippet){Bt(s.snippet,s.caret??s.snippet.length,s.select),q();return}us(s.tag)}}}),ad(t,e),ld(t,e),rd(t,e))}let ce=null;async function qc(t){const e=t.document;gd(e);let o=e.getElementById(u);if(o&&!(o.querySelector('[data-sve-css-chrome="subrow-2"]')&&o.querySelector("[data-sve-css-add-class]")&&o.querySelector("[data-sve-html-tools]")&&o.querySelector("[data-sve-html-tidy]")&&o.querySelector("[data-sve-data-vars]")&&o.querySelector("[data-sve-visual-edit-tools]")&&o.querySelector("[data-sve-html-scope]")&&o.querySelector("[data-sve-code-lock]")&&o.querySelector("[data-sve-code-back]")&&o.querySelector("[data-sve-code-autosave]")&&o.querySelector("[data-sve-code-save]")&&o.getAttribute("data-sve-code-chrome")==="scope-9")){for(const s of at)g[s]?.destroy(),g[s]=null;o.remove(),o=null}if(!o){o=e.createElement("div"),o.id=u,o.setAttribute("data-sve-code-chrome","scope-9"),_t(o,Ci,{htmlLabel:m(t,"code_dock_html"),cssLabel:m(t,"code_dock_css"),jsLabel:m(t,"code_dock_js"),alpineLabel:m(t,"code_dock_alpine"),treeIcon:ur,dataIcon:Pd,dataLabel:m(t,"data_vars_title")}),Xe(e,o),mn(o),Ps(o,Ls(t)),_d(t,o),Cd(t,o),$d(t,o),Rc(t,o),Hl(t,o),zc(t,o),Oc(t,o),Ic(t,o),Br(t,o),Nc(t,o),on(t,o),tn(t,o),vn(t,o),en(t,o);for(const n of at){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);$c(s)}Lr(t)}if(Xe(e,o),mn(o),Wc(t,o),on(t,o),tn(t,o),vn(t,o),en(t,o),kd(t),Oo(t),Et(t),K(t),Yt(t),it(t),Lo(t),Gt(t),await Ad(),!g.html){for(const n of at){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);s?.replaceChildren(),_c(t,n,s)}for(const n of["html","css"])g[n]&&na(t,g[n],{onOpen:s=>ns(t,s),emptyLabel:m(t,"code_dock_partials_empty"),openLabel:s=>m(t,"component_open_named",{name:s}),sectionValues:()=>os(t),isLocked:()=>ht(),setHover:(s,a)=>r.htmlPartialUi?.setHover(s,a)});Aa(t,g.html,{onRename:n=>Tl(t,n),isLocked:()=>ht(),setHover:(n,s)=>r.htmlClassTokenUi?.setHover(n,s),title:m(t,"code_dock_css_rename_class")})}return o}function Ts(t){return ce||(ce=qc(t).finally(()=>{ce=null})),ce}async function hn(t,e){const o=await Ts(t);r.lastType=e,r.lastLocked=!0,r.lockReady=!0,r.lastParts={html:"",css:"",js:""},Be(),Et(t),te(r.lastParts,!0),zs(t.document,e),R(t.document,m(t,"code_dock_missing")),K(t),Yt(t),it(t),Xt(t,o)}async function De(t,e,o="replace"){o==="replace"?r.typeStack=[]:o==="push"&&r.lastType&&r.lastType!==e&&r.typeStack.push(r.lastType);const n=++r.loadGen;r.lastType=e,r.lockReady=!1,Be(),R(t.document,m(t,"code_dock_loading"));const s=await Ts(t);Et(t),K(t),Yt(t),it(t),Lo(t),Gt(t),Xt(t,s),t.fetch(`/!/sve/section-template?type=${encodeURIComponent(e)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async a=>{if(n!==r.loadGen)return;if(a.status===404){hn(t,e);return}if(!a.ok)throw new Error(String(a.status));const i=await a.json();n===r.loadGen&&(r.lastParts={html:typeof i.html=="string"?i.html:"",css:typeof i.css=="string"?i.css:"",js:typeof i.js=="string"?i.js:""},r.lastProps=Array.isArray(i.props)?i.props:[],r.propsDirty=!1,r.lastType=e,r.lastLocked=!!i.locked,r.lockReady=!0,kl(),typeof i.tw=="string"&&i.tw!==""&&Sl(r.lastParts.html,i.tw),Et(t),te(r.lastParts,r.lastLocked),Fn(t),r.lastLocked||ts(t,r.lastParts.html),zs(t.document,i.path||e),R(t.document,r.lastLocked?m(t,"code_dock_locked"):""),i.writable?.template===!1?R(t.document,m(t,"code_dock_not_writable")):i.writable?.tw===!1&&R(t.document,m(t,"code_dock_tw_not_writable")),Zn(t),Bi(t),bo(t),K(t),Yt(t),it(t),Xt(t,s))}).catch(()=>{n===r.loadGen&&(hn(t,e),R(t.document,m(t,"code_dock_error")))})}function Ct(){return r.lastType||""}function As(t){return!!t?.getElementById(u)}function ht(){return r.lastLocked}function Vc(t,e){const o=typeof e?.html=="string"?e.html.trim():"",n=typeof e?.css=="string"?e.css.trim():"",s=typeof e?.js=="string"?e.js.trim():"";if(!o&&!n&&!s||!t?.document?.getElementById(u))return!1;let a=!1;return o&&(a=Uc("html",o)||a),n&&(a=pn("css",n)||a),s&&(a=pn("js",s)||a),a&&nt(t),a}function Uc(t,e){const o=g[t];if(!o||o.state.readOnly)return!1;const n=o.state.selection.main,s=n.from>0?o.state.doc.sliceString(n.from-1,n.from):`
`,a=n.to<o.state.doc.length?o.state.doc.sliceString(n.to,n.to+1):`
`,c=`${s===`
`?"":`
`}${e}${a===`
`?"":`
`}`;return o.dispatch({changes:{from:n.from,to:n.to,insert:c},selection:{anchor:n.from+c.length}}),!0}function pn(t,e){const o=g[t];if(!o||o.state.readOnly)return!1;const n=o.state.doc.length,a=`${n>0&&o.state.doc.sliceString(Math.max(0,n-1),n)!==`
`?`

`:n?`
`:""}${e}
`;return o.dispatch({changes:{from:n,insert:a},selection:{anchor:n+a.length}}),!0}function Kc(t){if(me(t),!r.lastType||!t.document.getElementById(u))return;const e=r.lastType;r.lastType=null,De(t,e,"keep")}function Ms(t){bt(t),r.loadGen+=1,et(t),r.lastUid=null,r.lastType=null,r.typeStack=[],r.lastParts={html:"",css:"",js:""},r.lastLocked=!1,r.lockReady=!1,r.lastBracketNames=null,r.lastCssSelectorNames=null,Be(),r.lastWin=t?.defaultView||r.lastWin,w(t),Mn(t),rt(t),t?.getElementById(G)?.remove();for(const o of at)g[o]?.destroy(),g[o]=null;t?.getElementById(u)?.remove(),xd(),t&&Po(t,0);const e=t?.defaultView||r.lastWin;e?.document.getElementById(Tn)&&Cn(e),e&&(Zn(e),bo(e),Fn(e))}function Gc(t){if(r.dragging)return;const e=t.document.getElementById(u);e&&(Oo(t),Xt(t,e))}function Xc(t,e,o){if(o){const a=jo(o,e)||jo(o,t.document)||o;return String(typeof We=="function"&&(We(a,e)||We(a,t.document))||"").trim()}const n=typeof Ge=="function"?Ge(t):"page_sections",s=typeof tt=="function"?tt(t.document):[];for(const a of s){const l=(kt(a.values)||a.values)?.[n];if(Array.isArray(l))for(const c of l){const d=typeof c?.type=="string"?c.type.trim():"";if(d)return d}}return""}function Es(t){if((t.Statamic?.$config?.get?.("sveFeatures")||{}).collection_templates!==!0)return"";const o=t.Statamic?.$config?.get?.("sveCollectionTemplatesCollection")||"templates";if(!(t.location?.pathname||"").includes(`/collections/${o}/entries/`))return"";const s=typeof tt=="function"?tt(t.document):[];for(const a of s){const i=kt(a.values)||a.values,l=typeof i?.view=="string"?i.view.trim():"";if(!l||l.includes(".."))continue;const c=l.replace(/\.(antlers\.html|blade\.php)$/i,"").replace(/^\/+|\/+$/g,"");if(c)return`view:${c}`}return""}function Yc(t,e){const o=Pr||Dr;if(o!=="header"&&o!=="footer"||!Fr(e)&&!Ir(e))return"";const s=(kt(Or()?.values)||{})[o==="footer"?"footer_style":"header_style"]||"style_1";return`${o}/${s}`}function Zc(t){const e=Er(t)||t.getElementById("__sve-global-section-host");return e&&e.querySelector("[data-replicator-set][data-type]")?.getAttribute("data-type")||""}function yu(t,e,o){if(r.dragging)return;if(!t||!e||fd(e)||!Ar(t)||!Mr(t)){e&&Ms(e);return}const n=Yc(t,e)||Zc(e)||Xc(t,e,o)||Es(t)||(o?"":r.lastType),s=!!(o&&o!==r.lastUid);if(r.lastWin=t,o&&(r.lastUid=o),!!n&&!(n===r.lastType&&e.getElementById(u))){if(r.typeStack.length&&r.lastType&&r.lastType!==n){const a=r.typeStack[0];if(n===a&&!s)return;r.typeStack=[]}et(e),De(t,n,"replace")}}be("tw:changed",()=>{r.lastWin&&r.styleMode==="tw"&&O(r.lastWin)});I("dock:is-open",t=>As(t));I("dock:is-locked",()=>ht());I("dock:html",()=>It());I("dock:reveal-html",({from:t,to:e,caret:o}={})=>{const n=g.html;if(!n||t==null)return;r.htmlScopePref=Zt(r.lastWin),Te(),ct();const s=r.htmlFull.length,a=Math.max(0,Math.min(t,s)),i=Math.max(a,Math.min(e??t,s));r.htmlFocus=i>a?{from:a,to:i}:null;const l=o==null?null:Math.max(0,Math.min(o,s));if(r.htmlScopePref&&r.htmlFocus){$o(l),K(r.lastWin);return}if(r.htmlScopeActive){Co(!0,l),K(r.lastWin);return}n.dispatch({selection:l==null?{anchor:a,head:i}:{anchor:l},scrollIntoView:!0}),n.focus()});I("dock:insert-snippet",({win:t,parts:e})=>Vc(t,e));I("dock:refresh",t=>Kc(t));I("dock:tw-follow",()=>{r.lastWin&&se(r.lastWin)});I("dock:css",()=>(ct(),r.cssFull));I("dock:set-css",t=>typeof t!="string"||ht()||!g.css||!r.lastWin?!1:(ct(),r.cssFull=t,Me("css",fs()),nt(r.lastWin),!0));I("dock:data-menu",({anchor:t,onPick:e,at:o}={})=>!t||!r.lastWin?!1:(bt(r.lastWin.document),w(r.lastWin.document),Bs(r.lastWin,t,e,o),!0));I("dock:props",()=>r.lastProps.map(t=>({...t})));I("dock:set-props",({win:t,props:e}={})=>!Array.isArray(e)||ht()?!1:(r.lastProps=e,r.propsDirty=!0,sa(He(Ct())),et((t||r.lastWin)?.document),!0));function He(t){const e=/^view:partials\/(components\/[A-Za-z0-9_-]+)$/.exec(String(t||""));return e?e[1]:""}I("dock:component-src",()=>He(Ct()));I("dock:component-exit-state",()=>{const t=He(Ct());return{open:!!t,name:t?t.split("/").pop():"",back:r.typeStack.length>0}});I("dock:exit-component",()=>!r.lastWin||!He(Ct())?!1:(r.typeStack.length?ss(r.lastWin):Ms(r.lastWin.document),!0));I("dock:current-type",()=>Ct());I("dock:current-uid",()=>r.lastUid);I("dock:reset-data-vars",t=>(Ya(typeof t=="string"&&t?t:void 0),!0));I("dock:refresh-preview",()=>r.lastWin?(me(r.lastWin),!0):!1);I("dock:open-template",t=>typeof t!="string"||!t||!r.lastWin?!1:(ns(r.lastWin,t),!0));I("dock:set-html",t=>{if(typeof t!="string"||ht())return!1;const e=g.html;if(!e||!r.lastWin)return!1;if(t===""){r.saveTimer&&(clearTimeout(r.saveTimer),r.saveTimer=null),r.twDirty=!1,r.twCss=null,r.twKey="",r.lastType=null,r.lastUid=null,r.lastParts={html:"",css:"",js:""},r.cssFull="",r.htmlFull="",r.applying=!0;try{Be();for(const s of at){const a=g[s];if(!a)continue;const i=a.state.doc.toString();i!==""&&a.dispatch({changes:{from:0,to:i.length,insert:""}})}}finally{r.applying=!1}return!0}const o=r.htmlFull;if(r.htmlFull=t,r.htmlScopeActive)return r.htmlFocus=Jc(r.htmlFocus,o,t),Ee(is()),nt(r.lastWin),fo("dock:html-changed"),!0;const n=e.state.doc.toString();return n!==t&&e.dispatch({changes:{from:0,to:n.length,insert:t}}),!0});I("dock:show-empty",()=>xt("dock:set-html",""));be("row:removed",({parentPath:t,remaining:e,win:o})=>{e===0&&t===Ge(o)&&xt("dock:show-empty")});function Jc(t,e,o){const n=o.length-e.length;if(!t||!n)return t;let s=0;for(;s<e.length&&s<o.length&&e[s]===o[s];)s+=1;return s>=t.to?t:s<t.from?{from:Math.max(0,t.from+n),to:Math.max(0,t.to+n)}:{from:t.from,to:Math.max(t.from,t.to+n)}}const F="__sve-data-menu";let so=null;function bt(t){const e=t?.getElementById(F);so?.(),so=null,e?._sveApp?.unmount(),e?.remove(),t?.querySelector("[data-sve-data-vars][data-open]")?.removeAttribute("data-open")}function Qc(t){if(!Es(t))return{view:"",kind:""};const e=typeof tt=="function"?tt(t.document):[];for(const o of e){const n=kt(o.values)||o.values,s=typeof n?.source_collection=="string"?n.source_collection.trim():"";if(s)return{view:s,kind:String(n?.kind||"").trim()}}return{view:"",kind:""}}function td(t,e){const o=It();if(Number.isFinite(e))return qo(o,e);const n=g.html;if(!n)return[];const s=r.htmlScopeActive&&r.htmlFocus?r.htmlFocus.from:0;return qo(o,s+n.state.selection.main.from)}function ed(t,e){const{view:o,kind:n}=Qc(t);return{collection:Va(t)||"",set:Ua(Ct()),view:o,kind:n,scope:Ka(td(t,e))}}function od(t){const e=typeof tt=="function"?tt(t.document):[];for(const o of e){const n=kt(o.values)||o.values;if(n&&typeof n=="object")return n}return null}function nd(t,e){return{scope:e?.scope?.groups||[],section:Kn(e?.section||[],os(t)),page:Qa(e?.page||[],od(t)),site:e?.site||[]}}function sd(t,e){const o=ti(t,e),n=g.html;if(!o||!n||n.state.readOnly)return;const s=n.state.selection.main,a=n.state.doc.lineAt(s.from),i=lt(a.text),l=po(o.text,i);n.dispatch({changes:{from:s.from,to:s.to,insert:l},selection:{anchor:s.from+o.cursor+(o.text.includes(`
`)?i.length:0)}}),q()}function Ve(t,e,o){const n=e.getBoundingClientRect(),s=8,a=o.offsetWidth||368,i=o.offsetHeight||240,l=t.innerHeight-n.bottom-s,c=n.top-s,d=l>=i||l>=c?n.bottom+4:n.top-i-4;o.style.left=`${Math.max(s,Math.min(n.left,t.innerWidth-a-s))}px`,o.style.top=`${Math.max(s,Math.min(d,t.innerHeight-i-s))}px`}function Bs(t,e,o,n){const s=t.document;bt(s),e.setAttribute("data-open","");const a=s.createElement("div");a.id=F,s.body.appendChild(a);const i=ed(t,n),l=p=>[p?.scope?.groups?.length?{id:"scope",label:p.scope.label||m(t,"data_vars_tab_loop")}:null,{id:"section",label:m(t,"data_vars_tab_section")},{id:"page",label:m(t,"data_vars_tab_page")},{id:"site",label:m(t,"data_vars_tab_site")}].filter(Boolean),c=p=>{s.getElementById(F)&&(a._sveApp?.unmount(),a._sveApp=N(qa,a,{title:m(t,"data_vars_title"),placeholder:m(t,"data_vars_placeholder"),emptyText:m(t,"data_vars_empty"),noSectionText:m(t,"data_vars_no_section"),loopText:m(t,"data_vars_loop"),tabs:l(p),data:nd(t,p),onPick:(x,k)=>o?o(x,k):sd(x,k)}),Ve(t,e,a))};c(Ga(Un(i))||{scope:null,section:[],page:[],site:[]}),Xa(t,i).then(c),Ve(t,e,a);const d=()=>Ve(t,e,a),f=p=>{!a.contains(p.target)&&!e.contains(p.target)&&bt(s)},h=p=>{p.key==="Escape"&&bt(s)};s.addEventListener("pointerdown",f,!0),s.addEventListener("keydown",h,!0),t.addEventListener("scroll",d,!0),t.addEventListener("resize",d),so=()=>{s.removeEventListener("pointerdown",f,!0),s.removeEventListener("keydown",h,!0),t.removeEventListener("scroll",d,!0),t.removeEventListener("resize",d)}}function rd(t,e){const o=e.querySelector("[data-sve-data-vars]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("mousedown",n=>n.preventDefault()),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),t.document.getElementById(F)){bt(t.document);return}w(t.document),Bs(t,o)}))}function ad(t,e){const o=e.querySelector("[data-sve-antlers-tools]");!o||o._sveBound||(o._sveBound=!0,_t(o,Vn,{label:m(t,"code_dock_antlers"),groups:ca.map(n=>({id:n.id,label:m(t,n.lang),items:da.filter(s=>s.group===n.id).map(s=>({id:s.id,label:s.label}))})),onPick:n=>id(n)}))}function id(t){const e=ua(t),o=g.html;if(!e||!o||o.state.readOnly)return;const n=o.state.selection.main.head,s=o.state.doc.lineAt(n),a=s.text.trim()?lt(s.text):Ie(o,s)||lt(s.text),{text:i,cursor:l}=ue(e.snippet);Bt(po(i,a),l),q()}function ld(t,e){const o=e.querySelector("[data-sve-visual-edit-tools]");!o||o._sveBound||(o._sveBound=!0,_t(o,Vn,{label:m(t,"code_dock_visual_edit"),groups:ei.map(n=>({id:n.id,label:m(t,n.lang),items:Gn.filter(s=>s.group===n.id).map(s=>({id:s.id,label:s.label}))})),onPick:n=>dd(n)}))}function cd(t,e,o,n){if(si(o.inner,n.attr)){t.focus();return}const{text:s,cursor:a}=ue(n.attr);let i=o.closeIdx;for(;i>o.openIdx+2&&/\s/.test(e[i-1]);)i--;t.dispatch({changes:{from:i,to:o.closeIdx,insert:` ${s} `},selection:{anchor:i+1+a}}),q()}function dd(t){const e=oi(t),o=g.html;if(!e||!o||o.state.readOnly)return;const n=o.state.doc.toString(),s=Qt();if(s?.open){const h=ni(n,s.open.from,s.open.to,ie);if(h){e.attr?cd(o,n,h,e):(o.dispatch({selection:{anchor:h.openIdx+2+ie.length}}),o.focus());return}const p=s.open.from+1+s.name.length,x=e.standalone||`{{ ${ie} ${e.attr} }}`,{text:k,cursor:H}=ue(x);o.dispatch({changes:{from:p,to:p,insert:` ${k}`},selection:{anchor:p+1+H}}),q();return}const a=o.state.selection.main.head,i=o.state.doc.lineAt(a),l=i.text.trim()?lt(i.text):Ie(o,i)||lt(i.text),c=e.standalone||`{{ ${ie} ${e.attr} }}`,{text:d,cursor:f}=ue(c);Bt(po(d,l),f),q()}function ud(t){return t==="css"?er():t==="js"?or():tr({autoCloseTags:!0})}function mn(t){if(t._sveShield)return;t._sveShield=!0;const e=o=>o.stopPropagation();for(const o of["keydown","keypress","keyup","pointerdown","pointerup","mousedown","mouseup","click","focusin"])t.addEventListener(o,e)}function fd(t){try{return new URLSearchParams(t.defaultView?.location?.search||"").has("sve-panel")}catch{return!1}}function hd(t){const e=parseInt(J(t,rr)??"",10);return Number.isFinite(e)&&e>=dr?e:Bd}function pd(t,e){U(t,rr,String(e))}function Ls(t){try{const e=JSON.parse(J(t,ar)||"null");if(e&&typeof e=="object")return{html:e.html!==!1,css:e.css!==!1,js:e.js===!0,alpine:e.alpine===!0}}catch{}return{html:!0,css:!0,js:!1,alpine:!1}}function md(t,e){U(t,ar,JSON.stringify(e))}function Fs(t){try{const e=JSON.parse(J(t,ir)||"null");if(e&&typeof e=="object"){const o=s=>Number.isFinite(s)&&s>0?s:1,n={};for(const s of wt)n[s]=o(e[s]);return n}}catch{}return Object.fromEntries(wt.map(e=>[e,1]))}function vd(t,e){U(t,ir,JSON.stringify(e))}function gd(t){Hr(t,Ed,`
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
  ${Wo("ns")}
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
  ${Wo("ew")}
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
`)}function yd(t){const e=t.querySelector(".live-preview-editor");if(!e)return 0;const o=e.getBoundingClientRect();return o.width<40||o.right<40?0:Math.round(o.right)}function bd(t){let e=0;for(const o of["__sve-section-picker","__sve-outline-panel","__sve-html-tree-panel","__sve-listview-panel","__sve-right-dock","__sve-chrome-designs","__sve-global-section-panel","__sve-ai-panel"]){const n=t.getElementById(o);if(!n||n.hasAttribute("data-sve-chrome-hidden")||n.hasAttribute("data-sve-right-closed")||n.style.display==="none")continue;const s=n.getBoundingClientRect();s.width>40&&s.right>t.documentElement.clientWidth-8&&(e=Math.max(e,Math.round(s.width)))}return e}function Oo(t){const e=t.document;if(r.layoutWin=t,typeof t.ResizeObserver!="function")return;r.layoutObserver||(r.layoutObserver=new t.ResizeObserver(()=>{r.layoutWin&&Gc(r.layoutWin)}));const o=e.querySelector(".live-preview-editor"),n=e.getElementById("__sve-right-dock");o!==r.observedEditor&&(r.observedEditor&&r.layoutObserver.unobserve(r.observedEditor),r.observedEditor=o,o&&r.layoutObserver.observe(o)),n!==r.observedRight&&(r.observedRight&&r.layoutObserver.unobserve(r.observedRight),r.observedRight=n,n&&r.layoutObserver.observe(n))}function xd(){r.layoutObserver?.disconnect(),r.layoutObserver=null,r.layoutWin=null,r.observedEditor=null,r.observedRight=null}function kd(t){r.layoutWatchBound||(r.layoutWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>Oo(t)))}function Po(t,e){const o=t.querySelector(".live-preview-contents");o&&(o.style.paddingBottom=e?`${e}px`:"")}function Do(t){if(!t)return;const e=t.clientHeight,o=t.querySelector("[data-sve-code-bar]"),n=t.querySelector("[data-sve-code-lock-banner]"),s=n&&Sd(t)?.getComputedStyle(n).display!=="none"?n.offsetHeight:0,a=Math.max(64,e-(o?.offsetHeight||0)-s),i=t.querySelector("[data-sve-code-panes]");i&&(i.style.height=`${a}px`,i.style.minHeight="0",i.style.overflow="hidden"),t.querySelectorAll("[data-sve-code-host]").forEach(l=>{const c=l.closest("[data-sve-code-pane]");if(!c||c.style.display==="none")return;let d=0;for(const h of c.children)h!==l&&(d+=h.offsetHeight);const f=Math.max(64,a-d);l.style.height=`${f}px`,l.style.maxHeight=`${f}px`,l.style.minHeight="0",l.style.overflow="auto",wd(l)})}function Sd(t){return t.ownerDocument?.defaultView||r.lastWin}function wd(t){t._sveWheelBound||(t._sveWheelBound=!0,t.addEventListener("wheel",e=>{const o=t.scrollHeight-t.clientHeight,n=t.scrollWidth-t.clientWidth;let s=!1;if(e.deltaY&&o>0){const a=Math.min(o,Math.max(0,t.scrollTop+e.deltaY));a!==t.scrollTop&&(t.scrollTop=a,s=!0)}if(e.deltaX&&n>0){const a=Math.min(n,Math.max(0,t.scrollLeft+e.deltaX));a!==t.scrollLeft&&(t.scrollLeft=a,s=!0)}s&&(e.preventDefault(),e.stopPropagation())},{passive:!1}))}function Is(){const t=(r.layoutWin||r.lastWin)?.document?.getElementById(u);t&&Do(t);for(const e of at)g[e]?.requestMeasure()}function Os(t,e){const o=Ls(t),n={};for(const s of wt){const a=e.querySelector(`[data-sve-code-pane-btn="${s}"]`);n[s]=a?a.getAttribute("aria-pressed")==="true":o[s]}return n}function Ps(t,e){for(const n of wt){const s=t.querySelector(`[data-sve-code-pane-btn="${n}"]`),a=t.querySelector(`[data-sve-code-pane="${n}"]`);s&&s.setAttribute("aria-pressed",e[n]?"true":"false"),a&&(a.style.display=e[n]?"flex":"none")}const o=wt.filter(n=>e[n]);t.querySelectorAll("[data-sve-code-split]").forEach(n=>{const s=n.getAttribute("data-sve-code-split-after"),a=o.indexOf(s);n.style.display=a>=0&&a<o.length-1?"block":"none"}),Ds(t.ownerDocument.defaultView,t),Do(t)}function Ds(t,e){const o=Fs(t);for(const n of wt){const s=e.querySelector(`[data-sve-code-pane="${n}"]`);s&&(s.style.flex=`${o[n]} 1 0`)}}function Xt(t,e){if(r.dragging)return;const o=t.document;Xe(o,e);const n=hd(t),s=yd(o),a=bd(o);e.style.left=`${s}px`,e.style.right=`${a}px`,e.style.bottom="0",e.style.height=`${n}px`,Po(o,n),Do(e)}function Hs(t,e,o,n){r.dragging=!0,zr(t,e,o,()=>{r.dragging=!1,n?.()},"data-sve-code-drag-shield")}function _d(t,e){if(e._sveResizeBound)return;e._sveResizeBound=!0;const o=n=>{if(n.button!==0||n.target.closest('button, a, input, select, textarea, label, [role="button"], [contenteditable], .cm-editor'))return;n.preventDefault();const s=n.clientY,a=e.getBoundingClientRect().height;let i=a;Hs(t,"ns-resize",l=>{i=Math.min(Math.max(dr,a+(s-l.clientY)),Math.round(t.innerHeight*.7)),e.style.height=`${i}px`,Po(t.document,i),Is()},()=>{pd(t,i),Xt(t,e),t.dispatchEvent(new Event("resize"))})};e.querySelector("[data-sve-code-bar]")?.addEventListener("mousedown",o),e.querySelector("[data-sve-code-grip]")?.addEventListener("mousedown",o)}function $d(t,e){e._sveSplitBound||(e._sveSplitBound=!0,e.querySelectorAll("[data-sve-code-split]").forEach(o=>{o.addEventListener("mousedown",n=>{if(n.button!==0)return;n.preventDefault(),n.stopPropagation();const s=o.getAttribute("data-sve-code-split-after"),a=wt.filter(H=>Os(t,e)[H]),i=a.indexOf(s),l=a[i],c=a[i+1];if(!l||!c)return;const d=e.querySelector(`[data-sve-code-pane="${l}"]`),f=e.querySelector(`[data-sve-code-pane="${c}"]`),h=n.clientX,p=d.getBoundingClientRect().width,x=f.getBoundingClientRect().width,k=p+x;o.setAttribute("data-active",""),Hs(t,"col-resize",H=>{const mt=H.clientX-h;let zt=Math.max(Ue,Math.min(k-Ue,p+mt)),re=k-zt;k<Ue*2&&(zt=p,re=x);const _=Fs(t);_[l]=zt,_[c]=re,vd(t,_),Ds(t,e),Is()},()=>{o.removeAttribute("data-active")})})}))}function Cd(t,e){e._svePaneBound||(e._svePaneBound=!0,e.querySelectorAll("[data-sve-code-pane-btn]").forEach(o=>{o.addEventListener("click",n=>{n.stopPropagation();const s=o.getAttribute("data-sve-code-pane-btn"),a=Os(t,e),i={...a,[s]:!a[s]};!i.html&&!i.css&&!i.js&&(i[s]=!0),md(t,i),Ps(e,i)})}))}function R(t,e){const o=t.getElementById(u)?.querySelector("[data-sve-code-status]");o&&(o.textContent=e||"")}function zs(t,e){const o=t.getElementById(u)?.querySelector("[data-sve-code-path]");o&&(o.textContent=e||"",o.title=e||"")}function Yt(t){const e=t?.document?.getElementById(u)?.querySelector("[data-sve-code-back]");e&&(e.hidden=r.typeStack.length===0,e.title=m(t,"code_dock_back"),e.setAttribute("aria-label",e.title),e.innerHTML=Od)}function vn(t,e){const o=e.querySelector("[data-sve-code-back]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),ss(t)}))}let Y,ro,Rs,js,Ws,vt,ge,Pt,ze,Dt,Ht,Ns,qs,Vs,Us,Ks,Gs,Xs,Ys,Zs,Js,Qs,tr,er,or,nr,ao,io,sr,Td,Wt=null,C=null;function Ad(){return Wt||(Wt=gr().then(t=>{C=t,Y=C.view.EditorView,ro=C.view.keymap,Rs=C.view.lineNumbers,js=C.view.highlightActiveLine,Ws=C.view.highlightActiveLineGutter,vt=C.state.Compartment,ge=C.state.EditorState,Pt=C.state.StateField,ze=C.state.StateEffect,Dt=C.state.RangeSetBuilder,Ht=C.view.Decoration,Ns=C.commands.defaultKeymap,qs=C.commands.indentWithTab,Vs=C.commands.historyKeymap,Us=C.commands.history,Ks=C.autocomplete.autocompletion,Gs=C.autocomplete.closeBrackets,Xs=C.autocomplete.closeBracketsKeymap,Ys=C.autocomplete.closeCompletion,Zs=C.autocomplete.completionKeymap,Js=C.view.hoverTooltip,Qs=C.langHtml.htmlLanguage,tr=C.langHtml.html,er=C.langCss.css,or=C.langJs.javascript,C.language.HighlightStyle,C.language.syntaxHighlighting,nr=C.language.codeFolding,ao=C.language.foldEffect,io=C.language.unfoldEffect,sr=C.language.foldedRanges,Td=C.highlight.tags,qt.html=new vt,qt.css=new vt,qt.js=new vt,Vt.html=new vt,Vt.css=new vt,Vt.js=new vt}).catch(t=>{throw Wt=null,t}),Wt)}const Md="{{ _class }}",u="__sve-code-dock",Ed="__sve-code-dock-style",G="__sve-code-dock-unlock",rr="sve-code-dock-height",ar="sve-code-dock-panes",ir="sve-code-dock-widths",Re="sve-html-scope-v2",lr="sve-code-dock-autosave",cr="sve-code-dock-style-mode",Ho="sve-code-dock-values",Bd=280,dr=120,Ue=140,Ld=250,at=["html","css","js"],wt=["html","css","alpine","js"],Fd='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',Id='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-1"/></svg>',Od='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',ur='<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1c0 .966.784 1.75 1.75 1.75h.418A1.74 1.74 0 0 0 4 7.25v1.5c0 .49.201.932.525 1.25c-.324.318-.525.76-.525 1.25v1c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 14 12.25v-1c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1.5c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1A1.75 1.75 0 0 0 12.25 2zm8.5 7.5H8v-3h4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75M7 6.5v3H5.75A.75.75 0 0 1 5 8.75v-1.5a.75.75 0 0 1 .75-.75zm1 4h4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75H8zm-1 0V13H5.75a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-1-5V3h6.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75zm-1 0H3.75A.75.75 0 0 1 3 4.75v-1A.75.75 0 0 1 3.75 3H5z"/></svg>',Pd='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/><path d="M4.5 11.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/></svg>',Dd='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 16.3A8.5 8.5 0 1 1 18.3 6.3"/><path d="M21 3.2v5.4h-5.4"/></svg>',Hd='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',zd='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',$="__sve-css-menu",fr=["h1","h2","h3","h4","h5","h6"],lo=[{id:"section",title:"section",tag:"section"},{id:"div",title:"div",tag:"div"},{id:"heading",title:"heading",menu:"heading"},{id:"text",title:"text",menu:"text"},{id:"a",title:"link",tag:"a"},{id:"img",title:"image",snippet:'<img src="" alt="">',caret:10},{id:"svg",title:"svg",tag:"svg"},{id:"ul",title:"list",tag:"ul"},{id:"li",title:"list item",tag:"li"},{id:"component",title:"component",menu:"component"},{id:"loop",title:"loop",snippet:`{{ items }}

{{ /items }}
`,caret:3,select:5},{id:"if",title:"if",snippet:`{{ if true }}

{{ /if }}
`,caret:6,select:4}],Rd=["--size-100","--size-200","--size-300","--size-400","--size-500","--size-600","--size-700","--size-800","--size-900","--gutter"],jd={"tw-text":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 13 5 3l3.5 10M2.7 10h4.6"/><path d="M12.5 3.5v9M11 5l1.5-1.5L14 5M11 11l1.5 1.5L14 11"/></svg>',"tw-leading":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h8.5M6 8h8.5M6 12.5h8.5"/><path d="M2.5 4.5v7M1.4 5.6 2.5 4.5l1.1 1.1M1.4 10.4l1.1 1.1 1.1-1.1"/></svg>',"tw-font":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.2V3h10v1.2M8 3v10M6 13h4"/></svg>',"tw-radius":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 13.5v-6a5 5 0 0 1 5-5h6"/><path d="M13.5 6.5v7h-7" stroke-dasharray="2 2"/></svg>',"tw-gap":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"tw-align":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3.5h12M2 8h8M2 12.5h10"/></svg>',"tw-w":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3.5v9M14 3.5v9"/><path d="M4.5 8h7"/><path d="M6 6.2 4.2 8 6 9.8M10 6.2 11.8 8 10 9.8"/></svg>',"tw-h":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 2h9M3.5 14h9"/><path d="M8 4.5v7"/><path d="M6.2 6 8 4.2 9.8 6M6.2 10 8 11.8 9.8 10"/></svg>',"tw-maxw":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3v10M14.5 3v10"/><path d="M5 8h6"/><path d="M6.6 6.2 4.8 8l1.8 1.8M9.4 6.2 11.2 8l-1.8 1.8"/></svg>',"tw-overflow":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="1.8" y="4.5" width="8.6" height="9.7" rx="1.2"/><path d="M6.5 1.8h7.7v7.7" stroke-linecap="round"/></svg>',"tw-border":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6"/><rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" stroke-width="1" opacity=".45"/></svg>'},Wd='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="10" width="18" height="11" rx="2"/><rect x="6" y="3" width="9" height="4" rx="1.4" fill="currentColor" stroke="none"/></svg>',Nd='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.1 12a8.9 8.9 0 1 0 2.8-6.5L3 8"/><path d="M3 3.4V8h4.6"/><path d="M12 7.4V12l3 1.8"/></svg>',qd='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>',Vd='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></svg>',Ud='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/><path d="M3 17c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/></svg>',hr=[["--gray-50","#fafafa"],["--gray-100","#f5f5f5"],["--gray-200","#e5e5e5"],["--gray-300","#d4d4d4"],["--gray-400","#a3a3a3"],["--gray-500","#737373"],["--gray-600","#525252"],["--gray-700","#404040"],["--gray-800","#262626"],["--gray-900","#171717"],["--gray-950","#0a0a0a"]],gn=t=>[{id:`${t}-all`,icon:"box-all",title:"All sides",css:t,tw:t},{id:`${t}-block`,icon:"box-block",title:"Top and bottom",css:`${t}-block`,tw:`${t}-block`,sep:!0},{id:`${t}-block-start`,icon:"box-block-start",title:"Top",css:`${t}-block-start`,tw:`${t}-top`},{id:`${t}-block-end`,icon:"box-block-end",title:"Bottom",css:`${t}-block-end`,tw:`${t}-bottom`},{id:`${t}-inline`,icon:"box-inline",title:"Left and right",css:`${t}-inline`,tw:`${t}-inline`,sep:!0},{id:`${t}-inline-start`,icon:"box-inline-start",title:"Left",css:`${t}-inline-start`,tw:`${t}-left`},{id:`${t}-inline-end`,icon:"box-inline-end",title:"Right",css:`${t}-inline-end`,tw:`${t}-right`}],Kd=[{id:"display-flex",twClass:"flex",icon:"display-flex",title:"Flex",kind:"display",value:"flex",css:"display"},{id:"flex-row",twClass:"flex-row",icon:"flex-row",title:"Direction: row",kind:"flexDir",value:"row",css:"flex-direction",sep:!0},{id:"flex-col",twClass:"flex-col",icon:"flex-col",title:"Direction: column",kind:"flexDir",value:"column",css:"flex-direction"},{id:"justify-start",twClass:"justify-start",icon:"justify-start",title:"Justify: start",css:"justify-content",value:"flex-start",when:"flex",sep:!0},{id:"justify-center",twClass:"justify-center",icon:"justify-center",title:"Justify: center",css:"justify-content",value:"center",when:"flex"},{id:"justify-end",twClass:"justify-end",icon:"justify-end",title:"Justify: end",css:"justify-content",value:"flex-end",when:"flex"},{id:"justify-between",twClass:"justify-between",icon:"justify-between",title:"Justify: between",css:"justify-content",value:"space-between",when:"flex"},{id:"justify-around",twClass:"justify-around",icon:"justify-around",title:"Justify: around",css:"justify-content",value:"space-around",when:"flex"},{id:"align-start",twClass:"items-start",icon:"align-start",title:"Align: start",css:"align-items",value:"flex-start",when:"flex",sep:!0},{id:"align-center",twClass:"items-center",icon:"align-center",title:"Align: center",css:"align-items",value:"center",when:"flex"},{id:"align-end",twClass:"items-end",icon:"align-end",title:"Align: end",css:"align-items",value:"flex-end",when:"flex"},{id:"align-stretch",twClass:"items-stretch",icon:"align-stretch",title:"Align: stretch",css:"align-items",value:"stretch",when:"flex"}],Gd=[{id:"gap-all",icon:"gap-all",title:"Both",css:"gap",tw:"gap",menu:"spacing"},{id:"gap-row",icon:"gap-row",title:"Between rows",css:"row-gap",tw:"row-gap",menu:"spacing",sep:!0},{id:"gap-col",icon:"gap-col",title:"Between columns",css:"column-gap",tw:"column-gap",menu:"spacing"}],Xd=[{id:"bd-all",icon:"bd-all",title:"All sides",css:"border-color",tw:"border-color",menu:"colors"},{id:"bd-block",icon:"bd-block",title:"Top and bottom",css:"border-block-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-top",icon:"bd-top",title:"Top",css:"border-block-start-color",tw:"border-top-color",menu:"colors"},{id:"bd-bottom",icon:"bd-bottom",title:"Bottom",css:"border-block-end-color",tw:"border-bottom-color",menu:"colors"},{id:"bd-inline",icon:"bd-inline",title:"Left and right",css:"border-inline-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-left",icon:"bd-left",title:"Left",css:"border-inline-start-color",tw:"border-left-color",menu:"colors"},{id:"bd-right",icon:"bd-right",title:"Right",css:"border-inline-end-color",tw:"border-right-color",menu:"colors"}],Yd=[{id:"rd-all",icon:"rd-all",title:"All corners",css:"border-radius",tw:"border-radius",menu:"values"},{id:"rd-tl",icon:"rd-tl",title:"Top left",css:"border-start-start-radius",tw:"border-top-left-radius",menu:"values",sep:!0},{id:"rd-tr",icon:"rd-tr",title:"Top right",css:"border-start-end-radius",tw:"border-top-right-radius",menu:"values"},{id:"rd-br",icon:"rd-br",title:"Bottom right",css:"border-end-end-radius",tw:"border-bottom-right-radius",menu:"values"},{id:"rd-bl",icon:"rd-bl",title:"Bottom left",css:"border-end-start-radius",tw:"border-bottom-left-radius",menu:"values"}],pr=[{id:"display",title:"Display",css:"display",tw:"display",kids:Kd},{id:"absolute",title:"Position",css:"position",tw:"position",value:"absolute"},{id:"color",title:"Text color",css:"color",tw:"color",menu:"colors"},{id:"bg",title:"Background color",css:"background-color",tw:"background-color",menu:"colors"},{id:"padding",title:"Padding",css:"padding",tw:"padding",kids:gn("padding")},{id:"margin",title:"Margin",css:"margin",tw:"margin",kids:gn("margin")},{id:"tw-text",title:"Font size",css:"font-size",tw:"font-size",menu:"values"},{id:"tw-leading",title:"Line height",css:"line-height",tw:"line-height",menu:"values"},{id:"tw-font",title:"Font family",css:"font-family",tw:"font-family",menu:"values"},{id:"tw-align",title:"Text align",css:"text-align",tw:"text-align",menu:"choices",choices:["left","center","right","justify"]},{id:"tw-border",title:"Border color",css:"border-color",tw:"border-color",kids:Xd},{id:"tw-radius",title:"Radius",css:"border-radius",tw:"border-radius",kids:Yd},{id:"tw-gap",title:"Gap",css:"gap",tw:"gap",kids:Gd},{id:"tw-w",title:"Width",css:"width",tw:"width",menu:"sizes"},{id:"tw-h",title:"Height",css:"height",tw:"height",menu:"sizes"},{id:"tw-maxw",title:"Max width",css:"max-width",tw:"max-width",menu:"sizes"},{id:"tw-overflow",title:"Overflow",css:"overflow",tw:"overflow",menu:"choices",choices:["visible","hidden","clip","auto","scroll"]}],Zd=["100%","auto","fit-content","min-content","max-content","100vw","100dvh","0"],ye=new Map;for(const t of pr){ye.set(t.id,{tool:t,kid:null});for(const e of t.kids||[])ye.set(e.id,{tool:t,kid:e})}const yn={display:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2.5" width="13" height="11" rx="1.2"/><path d="M5 6.5h6M5 9.5h4"/></svg>',"display-flex":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="3.4" height="9" rx=".4"/><rect x="6.3" y="3.5" width="3.4" height="9" rx=".4"/><rect x="10.6" y="3.5" width="3.4" height="9" rx=".4"/></svg>',"flex-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12"/><path d="M4.2 5.8 2 8l2.2 2.2"/><path d="M11.8 5.8 14 8l-2.2 2.2"/></svg>',"flex-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v12"/><path d="M5.8 4.2 8 2l2.2 2.2"/><path d="M5.8 11.8 8 14l2.2-2.2"/></svg>',"justify-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="5.4" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4.6" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="8.2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-between":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-around":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"align-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="5.4" width="9" height="2.4" rx=".4"/></svg>',"align-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="4.6" width="9" height="2.4" rx=".4"/><rect x="3.5" y="9" width="9" height="2.4" rx=".4"/></svg>',"align-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="8.2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="11.6" width="9" height="2.4" rx=".4"/></svg>',"align-stretch":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx=".5"/><rect x="9" y="2" width="4" height="12" rx=".5"/></svg>',absolute:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>',color:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.4 11.2 7.4 2.4l4 8.8"/><path d="M4.7 8.4h5.4"/><rect x="1.6" y="12.8" width="12.8" height="2.2" rx=".6" fill="currentColor" stroke="none"/></svg>',bg:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 1.9a6.1 6.1 0 1 0 0 12.2c.85 0 1.35-.55 1.35-1.25 0-.38-.18-.66-.4-.88a1.2 1.2 0 0 1 .85-2.05h1.3A3.5 3.5 0 0 0 14.1 6.1C14.1 3.75 11.4 1.9 8 1.9Z"/><circle cx="4.9" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="8" cy="4.8" r=".95" fill="currentColor" stroke="none"/><circle cx="11.1" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="4.7" cy="9.9" r=".95" fill="currentColor" stroke="none"/></svg>',padding:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/></svg>',margin:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/><path d="M2 2.5h12M2 13.5h12M2.5 2v12M13.5 2v12" stroke-dasharray="1.4 1.2"/></svg>',"box-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".4" fill="currentColor" stroke="none"/></svg>',"box-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"gap-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"gap-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="3" y="1.6" width="10" height="4.2" rx=".6"/><rect x="3" y="10.2" width="10" height="4.2" rx=".6"/><path d="M4.5 8h7"/></svg>',"gap-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"bd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4"/></svg>',"bd-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-top":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-bottom":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-left":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-right":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"rd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="3.4"/></svg>',"rd-tl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6H6a3.4 3.4 0 0 0-3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M2.6 9V6A3.4 3.4 0 0 1 6 2.6h3" stroke-width="2.2"/></svg>',"rd-tr":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6h7.4a3.4 3.4 0 0 1 3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M7 2.6h3A3.4 3.4 0 0 1 13.4 6v3" stroke-width="2.2"/></svg>',"rd-br":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6v7.4a3.4 3.4 0 0 1-3.4 3.4H2.6" stroke-width="1" opacity=".35"/><path d="M13.4 7v3a3.4 3.4 0 0 1-3.4 3.4H7" stroke-width="2.2"/></svg>',"rd-bl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6v7.4a3.4 3.4 0 0 0 3.4 3.4h7.4" stroke-width="1" opacity=".35"/><path d="M2.6 7v3A3.4 3.4 0 0 0 6 13.4h3" stroke-width="2.2"/></svg>'},g={html:null,css:null,js:null},qt={html:null,css:null,js:null},Vt={html:null,css:null,js:null};export{ku as ARMED_KEY,Dd as AUTOSAVE_ICON,lr as AUTOSAVE_KEY,Od as BACK_ICON,zd as CSS_ADD_ICON,hr as CSS_GRAYS,Zd as CSS_LENGTHS,$ as CSS_MENU_ID,qd as CSS_MODE_ICON,Fo as CSS_SIZE_KEY,Rd as CSS_SPACING,Io as CSS_STATES,no as CSS_STATE_KEY,pr as CSS_TOOLS,yn as CSS_TOOL_ICONS,ye as CSS_TOOL_INDEX,Pd as DATA_ICON,F as DATA_MENU_ID,Bd as DEFAULT_HEIGHT,u as DOCK_ID,Ht as Decoration,ge as EditorState,Y as EditorView,at as HANDLES,rr as HEIGHT_KEY,Nd as HISTORY_ICON,fr as HTML_HEADINGS,lo as HTML_TOOLS,Vd as ID_MODE_ICON,Fd as LOCK_CLOSED_ICON,Id as LOCK_OPEN_ICON,dr as MIN_HEIGHT,Ue as MIN_PANE,wt as PANES,ar as PANES_KEY,Dt as RangeSetBuilder,Hd as SAVE_ICON,Ld as SAVE_MS,Md as SCOPE_CLASS,ur as SCOPE_ICON,Re as SCOPE_KEY,Wd as STRIP_ICON,Ed as STYLE_ID,cr as STYLE_MODE_KEY,ze as StateEffect,Pt as StateField,Ud as TW_MODE_ICON,jd as TW_TOOL_ICONS,G as UNLOCK_ID,Ho as VALUES_MODE_KEY,ir as WIDTHS_KEY,oe as applyCssFolds,Jt as applyCssScope,Vl as applyDisplay,ql as applyFlexDirection,us as applyHtmlTag,Z as applyRuleDecls,Cs as applyStyleMode,Ks as autocompletion,So as autosaveEnabled,ad as bindAntlersSnippets,en as bindAutosave,vn as bindBack,Hl as bindCssAddClass,Rc as bindCssTools,rd as bindDataVars,Oc as bindHistory,on as bindHtmlScope,Wc as bindHtmlTidy,Nc as bindHtmlTools,kd as bindLayoutWatch,tn as bindLock,Cd as bindPaneToggles,_d as bindResize,$d as bindSplitters,Ic as bindStrip,zc as bindStyleMode,ld as bindVisualEditSnippets,Be as clearHtmlScopeRange,Gs as closeBrackets,Xs as closeBracketsKeymap,Ms as closeCodeDock,vu as closeCodeDockPopups,Ys as closeCompletion,w as closeCssMenu,bt as closeDataMenu,C as cm,gu as codeDockStyleMode,nr as codeFolding,Es as collectionViewType,Zs as completionKeymap,er as css,fs as cssEditorText,Fe as cssRuleAtCursor,Ss as cssSizeRow,pt as cssSizeRows,Pe as cssStateSuffix,Q as currentFlexDecls,It as currentFullHtml,os as currentSectionValues,Ct as currentTemplateType,Ns as defaultKeymap,gt as dispatchHtmlChanges,Vt as editableOf,g as editors,gd as ensureStyle,ts as ensureTwCss,$s as enterValuesRule,q as finishHtmlEdit,_l as flushBracketSync,ct as flushCssScope,$l as flushCssToHtml,et as flushSave,ao as foldEffect,sr as foldedRanges,ss as goBackTemplate,js as highlightActiveLine,Ws as highlightActiveLineGutter,Us as history,Vs as historyKeymap,Js as hoverTooltip,tr as html,is as htmlEditorText,Qt as htmlElementAtCursor,Ce as htmlFocusOk,Qs as htmlLanguage,Zt as htmlScopeEnabled,$t as htmlTargetFromCursor,Ie as indentFromPrevious,qs as indentWithTab,Vc as insertAiSnippet,Bt as insertHtmlSnippet,Mr as isCodeDockArmed,ht as isCodeDockLocked,As as isCodeDockOpen,fd as isPanelFrame,or as javascript,ro as keymap,ud as languageOf,yt as leadingCssIndent,lt as lineIndentOf,Rs as lineNumbers,Ad as loadCm,De as loadTemplate,_c as mountEditor,ws as newSizeBlockSpot,oo as newSizeQuery,D as normalizeFlexValue,Oo as observeDockLayout,nt as onEditorInput,Xl as openCssChoiceMenu,Gl as openCssColorMenu,Yl as openCssSpacingMenu,dn as openCssValueMenu,Bs as openDataVarsMenu,Ol as openHtmlComponentMenu,an as openHtmlTagMenu,ns as openNestedTemplate,Tl as openRenameClassMenu,Oe as paintAlpine,it as paintAutosave,Yt as paintBack,ne as paintCssHead,Eo as paintCssIdMark,O as paintCssToolState,$c as paintHostWait,K as paintHtmlScope,Le as paintHtmlToolState,Et as paintLock,Ps as paintPaneButtons,Gt as paintStrip,Lo as paintStyleMode,Bo as paintValuesMode,W as placeCssMenu,Xt as placeDock,Po as previewBottomPad,Sl as primeTailwindCompile,qt as readOnlyOf,To as readParts,Kc as refreshCodeDockFromDisk,me as refreshPreview,Gc as relayoutCodeDock,Ae as rememberBracketNames,Ot as rememberCssSelectors,kl as resetTailwindCompile,Ao as sameParts,Su as setCodeDockArmed,zs as setPath,R as setStatus,Dc as setValuesMode,mn as shieldDock,Co as showHtmlFull,$o as showHtmlScope,xd as stopObservingDockLayout,Ls as storedPanes,yu as syncCodeDock,Ze as syncHtmlTree,Te as syncScopedHtml,se as syncTwTarget,Td as tags,Ar as templateDockAllowed,ds as tidyHtmlPane,io as unfoldEffect,Me as writeHandleEditor,Ee as writeHtmlEditor,te as writeParts};
