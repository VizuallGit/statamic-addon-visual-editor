const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-D8Xdoe3O.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{o as y,a as b,b as v,t as A,F as P,d as V,k as dt,c as Rt,l as Sn,p as Ke,w as wn,q as Tt,s as L,v as _n,g as j,x as Sr,y as xt,z as $n,A as xe,f as Cn,r as co,u as T,B as je,_ as Tn,n as wr,D as Q,E as U,h as m,j as _r,C as $r,i as An,G as Cr,H as Ho,I as Tr,J as et,K as kt,L as Ro,M as Ar,m as W,O as uo,P as Mn,Q as Mr,R as Er,S as En,T as fo,U as Br,V as _t,W as ho,X as Fr,Y as Lr,Z as Ir,$ as Or,a0 as Pr,a1 as Dr,a2 as zr,a3 as Hr,a4 as Rr,a5 as jr,a6 as jo,a7 as Ne,a8 as Ge,a9 as Nr,aa as Wr,ab as Xe,ac as qr,ad as Vr,ae as E,af as Ur,ag as Kr,ah as No,ai as Gr,aj as Xr}from"./addon-BRXzxCsD.js";import{ak as zu,al as Hu}from"./addon-BRXzxCsD.js";import{v as Yr,l as Zr}from"./codemirror-B3v8SaIp.js";import{p as ke,f as Bn,h as Jr,t as Fn,c as Qr,a as Ln,b as ta,d as ea,e as oa,g as na,i as Wo,j as sa,k as ra,l as In,m as aa,n as ia,o as la,q as ca,s as da,r as On,u as ua,v as Ye,w as fa,H as Pn,x as ha,y as pa,z as Dn,A as ma,B as va,C as qo,P as ie}from"./tw-classes-D66FAKgV.js";import{t as ga}from"./tw-candidates-wYTeDvRv.js";import{h as ya,a as ba,e as xa,A as ka,b as Sa,c as wa,d as fe,i as po}from"./html-tag-sync-D4MA50-d.js";import{M as zn,S as Hn}from"./protocol-D3FYhCm9.js";import"./ai-text-icon-B7uCWIwa.js";import"./index-Dpuj8sxX.js";import"./index-B5fiB6ig.js";import"./index-QkwZ_wP2.js";import"./index-CY0AOW5Y.js";import"./index-gYg9gdv3.js";import"./index-lzvKgifK.js";import"./index-BBw1nzv2.js";import"./index-DqbOpr3Y.js";import"./index-C_pm8ee_.js";import"./index-B8kpdD8S.js";const Rn=/^\.[a-zA-Z_][\w-]*$/;function mo(t){const e=String(t||""),o=/(^|\s)\[/g;let n;for(;n=o.exec(e);){const s=n.index+n[1].length,r=/\](?=\s|$)/g;r.lastIndex=s+1;const i=r.exec(e);if(i)return{from:s,to:i.index+1,innerFrom:s+1,innerTo:i.index}}return null}function jn(t){const e=String(t||""),o=mo(e);return o?e.slice(o.innerFrom,o.innerTo).replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).filter(n=>/^[a-zA-Z_][\w-]*$/.test(n)):[]}function Nn(t){const e=String(t||"").match(/\sclass\s*=\s*(["'])([^"']*)\1/i);return e?jn(e[2]):[]}function _a(t){return Nn(t)[0]||""}function Se(t){const e=String(t||""),o=[],n=/\sclass\s*=\s*(["'])/gi;let s;for(;s=n.exec(e);){const r=s[1],i=s.index+s[0].length,l=e.indexOf(r,i);if(l===-1)break;const c=e.slice(i,l),d=mo(c);if(d){const f=c.slice(d.innerFrom,d.innerTo),h=i+d.innerFrom,p=f.replace(/\{\{[\s\S]*?\}\}/g,z=>" ".repeat(z.length)),x=/[a-zA-Z_][\w-]*/g;let k;for(;k=x.exec(p);)o.push({name:k[0],from:h+k.index,to:h+k.index+k[0].length})}n.lastIndex=l+1}return o}function Vo(t,e){return Se(t).find(o=>e>=o.from&&e<=o.to)||null}function Uo(t,e){const o=String(t||""),n=Se(o);let s=o;for(let r=n.length-1;r>=0;r-=1){const i=n[r],l=e(i.name);if(l!==i.name){if(!l){let c=i.from,d=i.to;s[d]===" "?d+=1:c>0&&s[c-1]===" "&&(c-=1),s=s.slice(0,c)+s.slice(d);continue}s=s.slice(0,i.from)+l+s.slice(i.to)}}return s}function Wn(t){const e=[],o=/(^|[^\w-])\.([a-zA-Z_][\w-]*)\s*\{/g;let n;for(;n=o.exec(String(t||""));)e.push(n[2]);return e}function qn(t,e){const o=[],n=[],s=[];let r=0,i=0;for(;r<t.length&&i<e.length;){if(t[r]===e[i]){r+=1,i+=1;continue}const l=e.indexOf(t[r],i),c=t.indexOf(e[i],r);l===-1&&c===-1?(o.push({from:t[r],to:e[i]}),r+=1,i+=1):l===-1?(s.push(t[r]),r+=1):c===-1||l<=c?(n.push(e[i]),i+=1):(s.push(t[r]),r+=1)}for(;r<t.length;)s.push(t[r]),r+=1;for(;i<e.length;)n.push(e[i]),i+=1;return{renamed:o,added:n,removed:s}}function St(t){let e=String(t||"").trim().replace(/^\.+/,"").replace(/\s+/g,"-").replace(/[^a-zA-Z0-9_-]/g,"");return/^[a-zA-Z_]/.test(e)||(e=e.replace(/^[^a-zA-Z_]+/,"")),Rn.test(`.${e}`)?e:""}function $a(t,e){const o=String(t||""),n=St(e);if(!o||!n)return o;const s=o.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(s){const r=s[1];let i=s[2];const l=mo(i);if(l){const c=i.slice(l.innerFrom,l.innerTo).trim(),f=jn(i).includes(n)?c:`${c} ${n}`.trim();i=`${i.slice(0,l.from)}[ ${f} ]${i.slice(l.to)}`}else i=`[ ${n} ] ${i}`.trim();return o.slice(0,s.index)+` class=${r}${i}${r}`+o.slice(s.index+s[0].length)}return/\/\s*>$/.test(o)?o.replace(/(\s*)(\/\s*>)$/,` class="[ ${n} ]"$1$2`):o.replace(/(\s*)>$/,` class="[ ${n} ]"$1>`)}function Ca(t,e){const o=String(t).indexOf(">",e.from);return o===-1?"":t.slice(e.from,o+1)}function Vn(t,e){const o=[];for(const n of e){const s=Nn(Ca(t,n)),r=Vn(t,n.children||[]);if(s.length){o.push({className:s[0],children:r});for(const i of s.slice(1))o.push({className:i,children:[]})}else o.push(...r)}return o}function we(t){return Vn(t,ke(t))}function he(t){return String(t).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function vo(t,e){if(t.startsWith("/*",e)){const o=t.indexOf("*/",e+2);return o===-1?t.length:o+2}return e}function Ft(t,e){let o=0;for(let n=e;n<t.length;n+=1){if(t.startsWith("/*",n)){n=vo(t,n)-1;continue}if(t[n]==="{")o+=1;else if(t[n]==="}"&&(o-=1,o===0))return n}return-1}function X(t,e){const o=String(t||""),n=new RegExp(`(^|[^\\w-])\\.${he(e)}\\s*\\{`,"g");let s;for(;s=n.exec(o);){const r=s.index+s[1].length,i=o.indexOf("{",r);if(i===-1)continue;const l=Ft(o,i);if(l!==-1)return{from:r,brace:i,close:l,to:l+1,name:e}}return null}function Ta(t){const e=String(t||""),o=[],n={},s=[];let r=0,i="";const l=()=>{const c=i.trim();c&&o.push(c),i=""};for(;r<e.length;){if(e.startsWith("/*",r)){const c=vo(e,r);i+=e.slice(r,c),r=c;continue}if(e[r]==="{"){const c=i.trim(),d=Ft(e,r);if(d===-1)break;const f=e.slice(r+1,d);i="",Rn.test(c)?n[c.slice(1)]=f:c&&s.push(`${c} {${f}}`),r=d+1;continue}i+=e[r],r+=1}return l(),{decls:o.join(`
`),classes:n,other:s}}function Ko(t,e){const o="    ".repeat(e);return String(t||"").split(`
`).map(n=>n.trim()?o+n.trim():"").filter((n,s,r)=>n||s>0&&s<r.length-1).join(`
`)}function Aa(t,e){const o=X(t,e);return o?String(t).slice(o.brace+1,o.close):""}function Un(t,e,o){const n=Ta(Aa(e,t.className)),s="    ".repeat(o),r=[];n.decls&&r.push(Ko(n.decls.replace(/;+\s*$/,";"),o+1));for(const l of n.other)r.push(Ko(l,o+1));for(const l of t.children)r.push(Un(l,e,o+1));const i=r.filter(Boolean).join(`
`);return i?`${s}.${t.className} {
${i}
${s}}`:`${s}.${t.className} {
${s}}`}function go(t,e){return e?.length?e.map(o=>Un(o,t,0)).join(`

`)+`
`:""}function Kn(t){const e=String(t||"").match(/^\s*\.([a-zA-Z_][\w-]*)\s*\{/);return e?e[1]:""}function Ma(t){const e=[],o=/\.([a-zA-Z_][\w-]*)\s*\{/g;let n,s=!0;for(;n=o.exec(String(t||""));){if(s){s=!1;continue}e.push(n[1])}return e}function Ea(t,e){const o=String(t).lastIndexOf(`
`,e-1)+1,n=t.slice(o,e);return/^\s*$/.test(n)?n:""}function Ba(t,e){return e?t.split(`
`).map((o,n)=>n===0||!o?o:e+o).join(`
`):t}function Fa(t,e){let o=0;for(let n=0;n<e.from;n+=1){if(t.startsWith("/*",n)){n=vo(t,n)-1;continue}t[n]==="{"?o+=1:t[n]==="}"&&(o-=1)}return o===0}function yo(t,e,o){const n=Kn(e)||o;if(!n)return String(t||"");let s=String(e||"").trim();s?new RegExp(`^\\.${he(n)}\\s*\\{`).test(s)||(s=`.${n} {
${s}
}`):s=`.${n} {
}`;let r=String(t||"");const i=X(r,n),l=Ma(s);if(i){const d=Ea(r,i.from);r=r.slice(0,i.from)+Ba(s,d)+r.slice(i.to)}else r=`${r.trimEnd()}${r.trim()?`
`:""}${s}
`;const c=X(r,n);if(!c)return r;for(const d of[...new Set(l)].reverse()){const f=new RegExp(`(^|[^\\w-])\\.${he(d)}\\s*\\{`,"g"),h=[];let p;for(;p=f.exec(r);){const x=p.index+p[1].length,k=r.indexOf("{",x),z=Ft(r,k);z!==-1&&h.push({from:x,to:z+1})}for(const x of h.reverse()){if(x.from>=c.from&&x.to<=c.to||!Fa(r,x))continue;let k=x.from;const z=r.lastIndexOf(`
`,k-1)+1;/^\s*$/.test(r.slice(z,k))&&(k=z);let mt=x.to;r[mt]===`
`&&(mt+=1),r=r.slice(0,k)+r.slice(mt)}}return r}function We(t,e){const o=String(t||"");return`${o.trimEnd()}${o.trim()?`
`:""}.${e} {
}
`}function La(t,e,o){const n=St(o);return!e||!n||e===n?String(t||""):X(t,n)?Gn(t,e):String(t||"").replace(new RegExp(`(^|[^\\w-])\\.${he(e)}(\\s*\\{)`,"g"),`$1.${n}$2`)}function Gn(t,e){let o=String(t||"");for(;;){const n=X(o,e);if(!n)break;let s=n.from;const r=o.lastIndexOf(`
`,s-1)+1;/^\s*$/.test(o.slice(r,s))&&(s=r);let i=n.to;o[i]===`
`&&(i+=1),o=o.slice(0,s)+o.slice(i)}return o}function Ia(t,e,o){const n=Array.isArray(e)?e:[],s=Array.isArray(o)?o:[],{renamed:r,added:i}=qn(n,s),l=new Set(s);let c=String(t||"");for(const d of r){const f=St(d.to);if(f){if(l.has(d.from)){X(c,f)||(c=We(c,f));continue}X(c,d.from)?c=La(c,d.from,f):X(c,f)||(c=We(c,f))}}for(const d of i){const f=St(d);!f||X(c,f)||(c=We(c,f))}return c}function Oa(t,e,o){const n=new Set(Array.isArray(e)?e:[]),s=new Set(Array.isArray(o)?o:[]);let r=String(t||"");for(const i of s)n.has(i)||(r=Gn(r,i));return r}const st="__sve-css-rename-chip",Pa='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';function Da(t){const e=t.Decoration.mark({class:"sve-cm-css-token"}),o=t.StateEffect.define();return{extensions:[t.StateField.define({create(){return t.Decoration.none},update(s,r){let i;for(const c of r.effects)c.is(o)&&(i=c.value);if(i===void 0)return r.docChanged?t.Decoration.none:s;if(!i)return t.Decoration.none;const l=new t.RangeSetBuilder;return l.add(i.from,i.to,e),l.finish()},provide:s=>t.EditorView.decorations.from(s)})],setHover(s,r){s&&s.dispatch({effects:o.of(r)})}}}function rt(t){t?.getElementById(st)?.remove()}function za(t,e,o,n){e.style.left=`${Math.max(6,Math.min(o,t.innerWidth-28))}px`,e.style.top=`${Math.max(6,n)}px`}function Ha(t,e,o,{onRename:n,title:s}){const r=t.document,i=e.coordsAtPos(o.to);if(!i)return;rt(r);const l=r.createElement("button");l.id=st,l.type="button",l.innerHTML=Pa,l.title=s,l.setAttribute("aria-label",s),l.addEventListener("mousedown",c=>{c.preventDefault(),c.stopPropagation(),rt(r),n?.(o)}),l.addEventListener("mouseleave",()=>{t.setTimeout(()=>{e.dom.matches(":hover")||l.matches(":hover")||rt(r)},120)}),r.body.appendChild(l),za(t,l,i.right+2,i.top-1)}function Ra(t,e,{onRename:o,isLocked:n,setHover:s,title:r}){if(!e?.dom||e.dom._sveClassTokenBound)return;e.dom._sveClassTokenBound=!0;let i=null,l="";const c=()=>!!n?.(),d=()=>{t.clearTimeout(i),i=null,l="",s?.(e,null),rt(t.document)},f=h=>{if(c()){d();return}d(),o?.(h)};e.dom.addEventListener("mousemove",h=>{if(c()){d();return}if(h.target?.closest?.(`#${st}`))return;const p=e.posAtCoords({x:h.clientX,y:h.clientY});if(p==null)return;const x=Vo(e.state.doc.toString(),p);if(!x){t.clearTimeout(i),i=null,l="",s?.(e,null);return}const k=`${x.from}:${x.to}:${x.name}`;s?.(e,{from:x.from,to:x.to}),!(l===k&&(i||t.document.getElementById(st)))&&(t.clearTimeout(i),l=k,i=t.setTimeout(()=>{i=null,Ha(t,e,x,{onRename:f,title:r||"Rename class"})},160))}),e.dom.addEventListener("mouseleave",h=>{h.relatedTarget?.closest?.(`#${st}`)||t.setTimeout(()=>{t.document.getElementById(st)?.matches(":hover")||d()},160)}),e.dom.addEventListener("dblclick",h=>{if(c())return;const p=e.posAtCoords({x:h.clientX,y:h.clientY});if(p==null)return;const x=Vo(e.state.doc.toString(),p);x&&(h.preventDefault(),h.stopPropagation(),f(x))},!0),e.scrollDOM?.addEventListener("scroll",d),t.document._sveClassTokenDismiss||(t.document._sveClassTokenDismiss=!0,t.document.addEventListener("mousedown",h=>{h.target.closest(`#${st}`)||rt(t.document)}))}const a={cssColorsPromise:null,lastUid:null,lastType:null,typeStack:[],lastParts:{html:"",css:"",js:""},lastProps:[],propsDirty:!1,lastLocked:!1,lockReady:!1,lastWin:null,loadGen:0,saveTimer:null,lastBracketNames:null,lastCssSelectorNames:null,saveInFlight:null,loadInFlight:null,dragging:!1,applying:!1,htmlScopePref:!0,htmlScopeActive:!1,styleMode:"css",cssToolRow:null,cssOpenTool:"",cssOpenMenu:"",cssValues:!1,twCss:null,twKey:"",twBusy:!1,twDirty:!1,htmlFocus:null,htmlFull:"",cssFull:"",cssPane:"full",cssScopeSnapshot:"",layoutObserver:null,layoutWin:null,observedEditor:null,observedRight:null,layoutWatchBound:!1,cssSize:"",cssState:"",cssOwnFolds:new Set,cssFoldSig:"",htmlPartialUi:null,htmlAntlersUi:null,htmlClassTokenUi:null,cssGhostUi:null},ja=["aria-label"],Na={value:""},Wa=["label"],qa=["value"],Xn={__name:"CodeDockAntlersSelect",props:{label:{type:String,required:!0},groups:{type:Array,required:!0},onPick:{type:Function,required:!0}},setup(t){const e=t;function o(n){const s=n.target.value;n.target.value="",s&&e.onPick(s)}return(n,s)=>(y(),b("select",{"data-sve-antlers-select":"","aria-label":t.label,onChange:o},[v("option",Na,A(t.label),1),(y(!0),b(P,null,V(t.groups,r=>(y(),b("optgroup",{key:r.id,label:r.label},[(y(!0),b(P,null,V(r.items,i=>(y(),b("option",{key:i.id,value:i.id},A(i.label),9,qa))),128))],8,Wa))),128))],40,ja))}},Va={"data-sve-data-search":""},Ua=["placeholder","aria-label","onKeydown"],Ka={"data-sve-data-tabs":""},Ga=["data-active","onClick"],Xa={key:0,"data-sve-data-empty":""},Ya={key:0,"data-sve-data-group":""},Za=["data-cursor","title","onMouseenter","onClick"],Ja={"data-sve-data-name":""},Qa={key:0,"data-sve-data-parent":""},ti={key:1,"data-sve-data-loop":""},ei={key:2,"data-sve-data-value":""},oi={__name:"CodeDockDataVars",props:{title:{type:String,default:""},placeholder:{type:String,default:""},emptyText:{type:String,default:""},noSectionText:{type:String,default:""},loopText:{type:String,default:""},tabs:{type:Array,required:!0},data:{type:Object,required:!0},onPick:{type:Function,required:!0}},setup(t){const e=t,o=dt(""),n=dt(null),s=dt(e.tabs[0]?.id||"section"),r=dt(null),i=dt(-1),l=dt(!1),c=Rt(()=>o.value.trim().toLowerCase()),d=Rt(()=>{const _=e.data[s.value]||[];return Array.isArray(_)&&_.length&&_[0]?.items?_:[{handle:s.value,label:"",items:_,bare:!0}]}),f=Rt(()=>{const _=c.value;return d.value.map(S=>({...S,items:(S.items||[]).filter(M=>!_||M.var.toLowerCase().includes(_)||String(M.label||"").toLowerCase().includes(_)||String(M.parent||"").toLowerCase().includes(_))})).filter(S=>S.items.length)}),h=Rt(()=>f.value.flatMap(_=>_.items.map(S=>({row:S,group:_})))),p=Rt(()=>!h.value.length);Sn(()=>Ke(()=>n.value?.focus()));function x(_){l.value=!0;const S=h.value.length;if(!S){i.value=-1;return}const M=i.value+_;i.value=M<0?-1:Math.min(M,S-1),Ke(()=>k())}function k(){const _=r.value?.querySelector("[data-cursor]");if(!_)return;let S=_.parentElement;for(;S&&S.scrollHeight<=S.clientHeight;)S=S.parentElement;if(!S)return;const M=_.offsetTop,H=M+_.offsetHeight;M<S.scrollTop?S.scrollTop=M:H>S.scrollTop+S.clientHeight&&(S.scrollTop=H-S.clientHeight)}function z(_){return h.value.findIndex(S=>S.row===_)}function mt(_){l.value||(i.value=z(_))}function Ht(){const _=i.value>=0?h.value[i.value]:null;_&&e.onPick(_.row,_.group)}function ae(_){s.value=_,i.value=-1}return(_,S)=>(y(),b(P,null,[v("div",Va,[S[6]||(S[6]=v("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[v("circle",{cx:"11",cy:"11",r:"7"}),v("path",{d:"m20 20-3.5-3.5"})],-1)),wn(v("input",{ref_key:"input",ref:n,"data-sve-data-input":"","onUpdate:modelValue":S[0]||(S[0]=M=>o.value=M),type:"text",placeholder:t.placeholder,"aria-label":t.title,onInput:S[1]||(S[1]=M=>i.value=-1),onKeydown:[S[2]||(S[2]=Tt(L(M=>x(1),["prevent"]),["down"])),S[3]||(S[3]=Tt(L(M=>x(-1),["prevent"]),["up"])),Tt(L(Ht,["prevent"]),["enter"]),S[4]||(S[4]=Tt(L(()=>{},["stop"]),["escape"]))]},null,40,Ua),[[_n,o.value]])]),v("div",Ka,[(y(!0),b(P,null,V(t.tabs,M=>(y(),b("button",{key:M.id,type:"button","data-sve-data-tab":"","data-active":s.value===M.id?"":void 0,onClick:L(H=>ae(M.id),["prevent","stop"])},A(M.label),9,Ga))),128))]),p.value?(y(),b("div",Xa,A(s.value==="section"&&!(t.data.section||[]).length?t.noSectionText:t.emptyText),1)):j("",!0),v("div",{ref_key:"rowsEl",ref:r,onMousemove:S[5]||(S[5]=M=>l.value=!1)},[(y(!0),b(P,null,V(f.value,M=>(y(),b(P,{key:M.handle},[M.bare?j("",!0):(y(),b("div",Ya,A(M.label),1)),(y(!0),b(P,null,V(M.items,H=>(y(),b("button",{key:M.handle+"::"+H.var+"::"+(H.parent||""),type:"button","data-sve-data-option":"","data-cursor":z(H)===i.value?"":void 0,title:H.label,onMouseenter:kr=>mt(H),onClick:L(kr=>t.onPick(H,M),["prevent","stop"])},[v("span",Ja,A(H.var),1),H.parent?(y(),b("span",Qa,A(H.parent),1)):j("",!0),H.loop?(y(),b("span",ti,A(t.loopText),1)):H.value?(y(),b("span",ei,A(H.value),1)):j("",!0)],40,Za))),128))],64))),128))],544)],64))}},At=new Map,Go={scope:null,section:[],page:[],site:[]};function ni(t){const e=t?.location?.pathname?.match(/\/collections\/([^/]+)\//);return e?e[1]:""}function si(t){const e=String(t||"").trim();return!e||/^(header|footer)\//.test(e)?"":e}function ri(t){return(Array.isArray(t)?t:[]).filter(e=>e?.handle).map(e=>`${e.kind==="collection"?"collection":"field"}:${e.handle}`).join("|")}function Yn({collection:t,set:e,view:o,scope:n}){return`${t}::${e}::${o||""}::${n||""}`}function ai(t){return At.get(t)||null}function ii(t,{collection:e,set:o,view:n,scope:s}){const r=Yn({collection:e,set:o,view:n,scope:s}),i=At.get(r);if(i)return Promise.resolve(i);const l=new URLSearchParams;return e&&l.set("collection",e),o&&l.set("set",o),n&&l.set("view",n),s&&l.set("scope",s),t.fetch(`/!/sve/data-vars?${l.toString()}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(c=>c.ok?c.json():null).then(c=>{const d=c&&typeof c=="object"?c:Go;return At.set(r,d),d}).catch(()=>Go)}function li(t){if(!t){At.clear();return}const e=`::${t}::`;for(const o of[...At.keys()])o.includes(e)&&At.delete(o)}function ci(t){if(t==null||t==="")return"";if(typeof t=="boolean")return t?"true":"false";if(Array.isArray(t))return t.length?`${t.length} ×`:"";if(typeof t=="object"){const o=Object.keys(t).length;return o?`${o} ×`:""}const e=String(t).replace(/\s+/g," ").trim();return e.length>60?`${e.slice(0,60)}…`:e}function di(t,e){return e.split(".").reduce((o,n)=>o&&typeof o=="object"?o[n]:void 0,t)}function Zn(t,e){return!Array.isArray(t)||!e||typeof e!="object"?t||[]:t.map(o=>{if(o.parent||o.value!=null||o.var.includes(":"))return o;const n=ci(di(e,o.var));return n?{...o,value:n}:o})}function ui(t,e){return Array.isArray(t)?t.map(o=>({...o,items:Zn(o.items,e)})):[]}function fi(t,e){const o=String(t?.var||"").trim();if(!o)return null;if(t.loop)return{text:`{{ ${o} }}
  
{{ /${o} }}`,cursor:`{{ ${o} }}
  `.length};if(e?.loop&&!t.parent){const n=e.loop;return{text:`{{ ${n} }}
  {{ ${o} }}
{{ /${n} }}`,cursor:`{{ ${n} }}
  {{ ${o} }}`.length}}return{text:`{{ ${o} }}`,cursor:`{{ ${o} }}`.length}}const le="visual_edit",hi=[{id:"base",lang:"code_dock_visual_edit_base"},{id:"field",lang:"code_dock_visual_edit_field"}],Jn=[{id:"tag",group:"base",label:"{{ visual_edit }}",standalone:"{{ visual_edit| }}"},{id:"ve_popup",group:"base",label:"popup",attr:'popup="true"'},{id:"ve_orderable",group:"base",label:"orderable",attr:'orderable="true"'},{id:"ve_section_orderable",group:"base",label:"section_orderable",attr:'section_orderable="true"'},{id:"ve_outline_inside",group:"base",label:"outline_inside",attr:'outline_inside="true"'},{id:"ve_field",group:"field",label:"field",attr:'field="|"'},{id:"ve_inline_edit",group:"field",label:"inline_edit",attr:'inline_edit="true"'},{id:"ve_insertable",group:"field",label:"insertable",attr:'insertable="true"'},{id:"ve_toolbar",group:"field",label:"toolbar",attr:'toolbar="true"'},{id:"ve_scope",group:"field",label:"scope",attr:'scope="|"'},{id:"ve_controls",group:"field",label:"controls",attr:'controls="|"'}];function pi(t){return Jn.find(e=>e.id===t)||null}function mi(t,e,o,n){let s=e;for(;s<o;){const r=t.indexOf("{{",s);if(r===-1||r>=o)return null;const i=t.indexOf("}}",r+2);if(i===-1||i+2>o)return null;const l=t.slice(r+2,i);if((l.trim().split(/\s+/)[0]||"")===n)return{openIdx:r,closeIdx:i,inner:l};s=i+2}return null}function vi(t,e){const o=String(e).split("=")[0].trim();return new RegExp(`(^|\\s)${o}(=|\\s|$)`).test(t)}const gi={class:"sve-code-dock"},yi={"data-sve-code-bar":""},bi={type:"button","data-sve-code-pane-btn":"html"},xi={type:"button","data-sve-code-pane-btn":"css"},ki={type:"button","data-sve-code-pane-btn":"alpine"},Si={type:"button","data-sve-code-pane-btn":"js"},wi={type:"button","data-sve-html-scope":"","aria-pressed":"true"},_i=["innerHTML"],$i={"data-sve-code-panes":""},Ci={"data-sve-code-pane":"html"},Ti={"data-sve-code-pane-label":""},Ai=["title","aria-label"],Mi=["innerHTML"],Ei={"data-sve-code-pane":"css"},Bi={"data-sve-css-chrome":"subrow-2"},Fi={"data-sve-code-pane-label":""},Li={"data-sve-css-label":""},Ii={"data-sve-code-pane":"alpine"},Oi={"data-sve-code-pane-label":""},Pi={"data-sve-code-pane":"js"},Di={"data-sve-code-pane-label":""},zi={__name:"CodeDockChrome",props:{htmlLabel:{type:String,required:!0},cssLabel:{type:String,required:!0},jsLabel:{type:String,required:!0},alpineLabel:{type:String,required:!0},treeIcon:{type:String,required:!0},dataIcon:{type:String,required:!0},dataLabel:{type:String,required:!0}},setup(t){return(e,o)=>(y(),b("div",gi,[o[19]||(o[19]=v("div",{"data-sve-code-grip":"","aria-hidden":"true"},null,-1)),v("div",yi,[v("button",bi,A(t.htmlLabel),1),v("button",xi,A(t.cssLabel),1),v("button",ki,A(t.alpineLabel),1),v("button",Si,A(t.jsLabel),1),o[0]||(o[0]=Sr('<button type="button" data-sve-code-back hidden></button><span data-sve-code-path></span><span data-sve-code-status></span><button type="button" data-sve-code-strip></button><button type="button" data-sve-code-history></button><button type="button" data-sve-style-mode></button><button type="button" data-sve-values-mode></button>',7)),v("button",wi,[v("span",{innerHTML:t.treeIcon},null,8,_i)]),o[1]||(o[1]=v("button",{type:"button","data-sve-code-autosave":"","aria-pressed":"true"},null,-1)),o[2]||(o[2]=v("button",{type:"button","data-sve-code-save":"",hidden:""},null,-1)),o[3]||(o[3]=v("button",{type:"button","data-sve-code-lock":"",hidden:""},null,-1))]),o[20]||(o[20]=v("div",{"data-sve-code-lock-banner":""},null,-1)),v("div",$i,[v("div",Ci,[v("div",Ti,[v("span",null,A(t.htmlLabel),1),o[4]||(o[4]=v("div",{"data-sve-html-tools":""},null,-1)),o[5]||(o[5]=v("button",{type:"button","data-sve-html-tidy":""},null,-1)),v("button",{type:"button","data-sve-data-vars":"",title:t.dataLabel,"aria-label":t.dataLabel},[v("span",{innerHTML:t.dataIcon},null,8,Mi)],8,Ai),o[6]||(o[6]=v("div",{"data-sve-visual-edit-tools":""},null,-1)),o[7]||(o[7]=v("div",{"data-sve-antlers-tools":""},null,-1))]),o[8]||(o[8]=v("div",{"data-sve-code-host":""},null,-1))]),o[16]||(o[16]=v("div",{"data-sve-code-split":"","data-sve-code-split-after":"html"},null,-1)),v("div",Ei,[v("div",Bi,[v("div",Fi,[v("span",Li,A(t.cssLabel),1),o[9]||(o[9]=v("button",{type:"button","data-sve-css-add-class":""},null,-1)),o[10]||(o[10]=v("div",{"data-sve-css-tools":""},null,-1))])]),o[11]||(o[11]=v("div",{"data-sve-css-head":""},null,-1)),o[12]||(o[12]=v("div",{"data-sve-code-host":""},null,-1)),o[13]||(o[13]=v("div",{"data-sve-tw-host":""},null,-1))]),o[17]||(o[17]=v("div",{"data-sve-code-split":"","data-sve-code-split-after":"css"},null,-1)),v("div",Ii,[v("div",Oi,[v("span",null,A(t.alpineLabel),1)]),o[14]||(o[14]=v("div",{"data-sve-alpine-host":""},null,-1))]),o[18]||(o[18]=v("div",{"data-sve-code-split":"","data-sve-code-split-after":"alpine"},null,-1)),v("div",Pi,[v("div",Di,[v("span",null,A(t.jsLabel),1)]),o[15]||(o[15]=v("div",{"data-sve-code-host":""},null,-1))])])]))}},Xo="view:",Yo="partials/",Hi="partials/static/";function Qn(t){const e=String(t||"");if(!e.startsWith(Xo))return null;const o=e.slice(Xo.length);return o.startsWith(Hi)?null:o.startsWith(Yo)?o.slice(Yo.length):o}function Ri(t){const e=String(t||"").match(/\sclass\s*=\s*(["'])([\s\S]*?)\1/i);return e?e[2].replace(/\{\{[\s\S]*?\}\}/g,"\0").split(/[\s[\]]+/).filter(o=>o&&!o.includes("\0")&&/^[A-Za-z_][\w:./%!#-]*$/.test(o)):[]}const ji=t=>globalThis.CSS?.escape?globalThis.CSS.escape(t):t.replace(/([^\w-])/g,"\\$1");function ts(t){const e=ke(t)[0];if(!e)return null;const o=Ri(String(t).slice(e.from,e.openTo));return!o.length&&!/^(header|footer|main|nav|aside|figure|form|table)$/.test(e.tag)?null:e.tag+o.map(n=>`.${ji(n)}`).join("")}const Wt=new Map;let jt=null,Zo=0,Jo=0,Qo=!1;async function Ni(t,e){if(Wt.has(e))return Wt.get(e);const o=`view:partials/${e}`;let n=null;try{const s=await t.fetch(`/!/sve/section-template?type=${encodeURIComponent(o)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}});if(s.ok){const r=await s.json();n=typeof r.html=="string"?ts(r.html):null}}catch{}return Wt.set(e,n),n}function Wi(t){t?Wt.delete(t):Wt.clear()}function es(t){const e=Qn(xt("dock:current-type")),o=e?xt("dock:html"):"",n=e&&typeof o=="string"?ts(o):null;$n({source:Hn,type:zn.SVE_COMPONENT_FOCUS,on:!!n,name:e?String(e).split("/").pop():"",selector:n||""},t)}async function bo(t){const e=++Jo,o=xt("dock:html"),n=[...new Set((typeof o=="string"?Bn(o):[]).map(r=>r.src).filter(r=>r&&!Jr(r)))],s=await Promise.all(n.map(r=>Ni(t,r)));e===Jo&&$n({source:Hn,type:zn.SVE_COMPONENT_MAP,items:n.map((r,i)=>({src:r,name:r.split("/").pop(),selector:s[i]})).filter(r=>r.selector)},t)}function qi(t){jt=t,!Qo&&(Qo=!0,xe("dock:html-changed",()=>{jt&&(Wi(Qn(xt("dock:current-type"))),jt.clearTimeout(Zo),Zo=jt.setTimeout(()=>{bo(jt)},400))}))}const Vi=["data-sve-html-tool","data-tip","aria-label","data-letter","onClick","onContextmenu"],Ui=["innerHTML"],Ki={__name:"CodeDockHtmlTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(t){return(e,o)=>(y(!0),b(P,null,V(t.tools,n=>(y(),b("button",{key:n.id,type:"button","data-sve-html-tool":n.id,"data-tip":n.title,"aria-label":n.title,"data-letter":n.letter?"":void 0,onClick:L(s=>t.onTool(n.id),["prevent","stop"]),onContextmenu:L(s=>t.onTool(n.id),["prevent"])},[n.letter?(y(),b(P,{key:0},[Cn(A(n.letter),1)],64)):(y(),b("span",{key:1,innerHTML:n.icon},null,8,Ui))],40,Vi))),128))}},ut=co({tools:[],onTool:null,onKid:null}),Gi=["data-sve-css-item"],Xi=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],Yi={key:0,"data-sve-css-kids":""},Zi={key:0,"data-sve-css-sep":"","aria-hidden":"true"},Ji=["data-sve-css-kid","data-sve-css-box-side","data-tip","aria-label","innerHTML","onClick","onContextmenu"],Qi={__name:"CodeDockCssTools",setup(t){return(e,o)=>(y(!0),b(P,null,V(T(ut).tools,n=>(y(),b("li",je({key:n.id,"data-sve-css-item":n.id},{ref_for:!0},n.open?{"data-sve-css-open":""}:{}),[v("button",je({type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title},{ref_for:!0},{...n.active?{"data-active":""}:{},...n.open?{"data-open":""}:{}},{innerHTML:n.icon,onClick:L(s=>T(ut).onTool?.(n.id),["prevent","stop"]),onContextmenu:L(s=>T(ut).onTool?.(n.id),["prevent"])}),null,16,Xi),n.open&&n.kids.length?(y(),b("div",Yi,[(y(!0),b(P,null,V(n.kids,s=>(y(),b(P,{key:s.id},[s.sep?(y(),b("span",Zi)):j("",!0),v("button",je({type:"button","data-sve-css-kid":s.id,"data-sve-css-box-side":s.id,"data-tip":s.title,"aria-label":s.title},{ref_for:!0},s.active?{"data-active":""}:{},{innerHTML:s.icon,onClick:L(r=>T(ut).onKid?.(n.id,s.id),["prevent","stop"]),onContextmenu:L(r=>T(ut).onKid?.(n.id,s.id),["prevent"])}),null,16,Ji)],64))),128))])):j("",!0)],16,Gi))),128))}},tl=1.5,el=16;function ue(t,e){const o=parseFloat(t);return Number.isFinite(o)?e==="em"||e==="rem"?o*el:o:null}function ol(t){const e=String(t||"").toLowerCase();if(/\bmin-width\b|\bwidth\s*>=?/.test(e))return null;let o=e.match(/\bmax-width\s*:\s*([\d.]+)(px|em|rem)/);return o||(o=e.match(/\bwidth\s*<=?\s*([\d.]+)(px|em|rem)/),o)?ue(o[1],o[2]):(o=e.match(/([\d.]+)(px|em|rem)\s*>=?\s*width\b/),o?ue(o[1],o[2]):null)}function ft(t,e){const o=ol(t);if(o===null)return"";for(const n of e||[]){if(n.base)continue;const s=ue(String(n.max||"").replace(/[a-z]+$/i,""),(String(n.max||"").match(/[a-z]+$/i)||[""])[0]);if(s!==null&&Math.abs(s-o)<=tl)return n.handle}return""}function _e(t){let e="",o=0;for(;o<t.length;){const n=$e(t,o);if(n!==o){e+=" ".repeat(n-o),o=n;continue}e+=t[o],o+=1}return e}function $e(t,e){if(t.startsWith("/*",e)){const o=t.indexOf("*/",e+2);return o===-1?t.length:o+2}if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?t.length:o+2}if(t[e]==='"'||t[e]==="'"){const o=t[e];for(let n=e+1;n<t.length;n+=1)if(t[n]==="\\")n+=1;else if(t[n]===o)return n+1;return t.length}return e}function Ce(t){const e=String(t||""),o=[],n=(s,r,i=0)=>{let l=s,c=l;for(;l<r;){const d=$e(e,l);if(d!==l){l=d;continue}if(e[l]===";"){l+=1,c=l;continue}if(e[l]==="}")return;if(e[l]!=="{"){l+=1;continue}const f=_e(e.slice(c,l)),h=f.trim(),p=os(e,l,r);if(p===-1)return;/^@media\b/i.test(h)?o.push({query:h.replace(/^@media\s*/i,"").trim(),from:c+f.search(/\S/),to:p+1,bodyFrom:l+1,bodyTo:p,depth:i}):/^@(?:import|charset|use)\b/i.test(h)||n(l+1,p,i+1),l=p+1,c=l}};return n(0,e.length,0),o}function os(t,e,o){let n=0;for(let s=e;s<o;s+=1){const r=$e(t,s);if(r!==s){s=r-1;continue}if(t[s]==="{")n+=1;else if(t[s]==="}"&&(n-=1,n===0))return s}return-1}function Lt(t){const e=String(t||""),o=(n,s)=>{const r=[];let i=n,l=i;for(;i<s;){const c=$e(e,i);if(c!==i){i=c;continue}if(e[i]===";"){i+=1,l=i;continue}if(e[i]==="}")return r;if(e[i]!=="{"){i+=1;continue}const d=_e(e.slice(l,i)),f=d.trim(),h=os(e,i,s);if(h===-1)return r;r.push({prelude:f,media:/^@media\b/i.test(f),query:f.replace(/^@media\s*/i,"").trim(),from:l+d.search(/\S/),to:h+1,bodyFrom:i+1,bodyTo:h,children:/^@(?:import|charset|use)\b/i.test(f)?[]:o(i+1,h)}),i=h+1,l=i}return r};return o(0,e.length)}function nl(t,e,o){const n=String(t||"");if(!o)return[];const s=(e||[]).find(d=>d.base),r=Lt(n),i=[],l=d=>d.media?ft(d.query,e)===o:d.children.some(l);if(s&&o===s.handle){const d=f=>{for(const h of f){if(h.media&&ft(h.query,e)){i.push({from:h.from,to:h.to});continue}d(h.children)}};return d(r),i}const c=(d,f,h)=>{const p=[];for(const k of d){if(k.media&&ft(k.query,e)===o){p.push({from:k.from,to:k.to,into:null});continue}l(k)&&p.push({from:k.from,to:k.to,into:k})}if(!p.length){h>f&&i.push({from:f,to:h});return}let x=f;for(const k of p)k.from>x&&i.push({from:x,to:k.from}),k.into&&c(k.into.children,k.into.bodyFrom,k.into.bodyTo),x=k.to;h>x&&i.push({from:x,to:h})};return c(r,0,n.length),i.filter(d=>n.slice(d.from,d.to).trim()!=="")}function sl(t,e){const o=String(t||""),n=[],s=i=>{for(const l of i){if((l.media&&ft(l.query,e)||/^#id-/.test(l.prelude))&&_e(o.slice(l.bodyFrom,l.bodyTo)).trim()===""){n.push(l);continue}s(l.children)}};if(s(Lt(o)),!n.length)return o;let r=o;for(const i of n.sort((l,c)=>c.from-l.from)){let l=i.from,c=i.to;const d=r.lastIndexOf(`
`,l-1)+1;for(r.slice(d,l).trim()===""&&(l=d);r[c]===" "||r[c]==="	";)c+=1;r[c]===`
`&&(c+=1),r=r.slice(0,l)+r.slice(c)}return r}function rl(t,e){const o=String(t||""),n=[],s=i=>_e(o.slice(i.bodyFrom,i.bodyTo)).trim()==="",r=i=>{for(const l of i){if((l.media&&ft(l.query,e)||/^#id-/.test(l.prelude))&&s(l)){n.push({from:l.from,to:l.to});continue}r(l.children)}};return r(Lt(o)),n}function pe(t,e,o){const n=e||[],s=n.find(d=>d.base),r=[],i=d=>/^#id-/.test(d.prelude)||/^#\s*$/.test(d.prelude),l=(d,f)=>{for(const h of d){if(!h.media){l(h.children,f);continue}const p=ft(h.query,n)||f;if(o===p){r.push(h);continue}l(h.children,p)}},c=(d,f)=>{for(const h of d){if(h.media){c(h.children,ft(h.query,n)||f);continue}if(i(h)){const p=f||(s?s.handle:"");!o||o===p?r.push(h):l(h.children,p);continue}c(h.children,f)}};return c(Lt(String(t||"")),""),r.sort((d,f)=>d.from-f.from)}function xo(t,e,o){return Ce(t).filter(n=>ft(n.query,e)===o)}const F=co({tag:"",scope:"",onTag:null,sizes:[],onSize:null,state:"",stateLabel:"",onState:null,canEdit:!1,note:""}),al={class:"sve-css-head"},il=["disabled"],ll={key:1,class:"sve-css-scope"},cl=["title","data-active","disabled","onClick"],dl=["data-active","disabled"],ul={key:2,class:"sve-css-note"},fl={__name:"CodeDockCssHead",setup(t){return(e,o)=>(y(),b("div",al,[T(F).tag?(y(),b("button",{key:0,type:"button",class:"sve-css-tag",disabled:!T(F).canEdit,onClick:o[0]||(o[0]=L(()=>{},["prevent","stop"])),onDblclick:o[1]||(o[1]=L(n=>T(F).onTag?.(n),["prevent","stop"]))},"<"+A(T(F).tag)+">",41,il)):j("",!0),T(F).scope?(y(),b("span",ll,A(T(F).scope),1)):j("",!0),(y(!0),b(P,null,V(T(F).sizes,n=>(y(),b("button",{key:n.key,type:"button","data-sve-css-size":"",title:n.title,"data-active":n.active?"":void 0,disabled:!T(F).canEdit,onClick:L(s=>T(F).onSize?.(n.key),["prevent","stop"])},A(n.label),9,cl))),128)),v("button",{type:"button","data-sve-css-state":"","data-active":T(F).state?"":void 0,disabled:!T(F).canEdit,onClick:o[2]||(o[2]=L(n=>T(F).onState?.(n),["prevent","stop"]))},[Cn(A(T(F).stateLabel)+" ",1),o[3]||(o[3]=v("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[v("path",{d:"m6 9 6 6 6-6"})],-1))],8,dl),o[4]||(o[4]=v("span",{class:"sve-css-gap"},null,-1)),T(F).note?(y(),b("span",ul,A(T(F).note),1)):j("",!0)]))}},hl=Tn(fl,[["__scopeId","data-v-43bc76ce"]]),pl={key:0,"data-sve-css-swatches":""},ml=["data-sve-css-token","title","data-active","onClick"],vl={key:0,"data-sve-css-head-row":""},gl={key:1,"data-sve-css-note-row":""},yl=["data-sve-css-token","data-active","onClick"],bl={"data-sve-css-choice-label":""},xl={key:0,"data-sve-css-choice-hint":""},ot={__name:"CodeDockMenu",props:{kind:{type:String,required:!0},swatches:{type:Array,default:()=>[]},choices:{type:Array,default:()=>[]},onClear:{type:Function,default:null},onPick:{type:Function,required:!0}},setup(t){return(e,o)=>t.kind==="colors"?(y(),b("div",pl,[v("button",{type:"button","data-sve-css-clear":"",title:"Clear",onClick:o[0]||(o[0]=L((...n)=>t.onClear&&t.onClear(...n),["prevent","stop"]))},[...o[1]||(o[1]=[v("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none",stroke:"currentColor","stroke-width":"1.5"},[v("path",{d:"M2 2l6 6M8 2L2 8"})],-1)])]),(y(!0),b(P,null,V(t.swatches,n=>(y(),b("button",{key:n.name,type:"button","data-sve-css-swatch":"","data-sve-css-token":n.name,title:n.name,"data-active":n.active?"":void 0,style:wr({background:n.hex||"transparent"}),onClick:L(s=>t.onPick(n.name),["prevent","stop"])},null,12,ml))),128))])):(y(!0),b(P,{key:1},V(t.choices,n=>(y(),b(P,{key:n.value},[n.heading?(y(),b("span",vl,A(n.label),1)):n.note?(y(),b("span",gl,A(n.label),1)):(y(),b("button",{key:2,type:"button","data-sve-css-choice":"","data-sve-css-token":n.token||void 0,"data-active":n.active?"":void 0,onClick:L(s=>t.onPick(n.value),["prevent","stop"])},[v("span",bl,A(n.label),1),n.hint?(y(),b("span",xl,A(n.hint),1)):j("",!0)],8,yl))],64))),128))}},kl=/^\.[a-zA-Z_][\w-]*$/;function Sl(t,e,o){return String(e||"").includes(o)?me(t).length===1:!1}function me(t){return Lt(t).filter(e=>/^@scope\b/i.test(e.prelude))}function wl(t){const e=String(t||"");return Lt(e).filter(o=>kl.test(o.prelude)?!e.slice(o.from,o.bodyFrom-1).includes("{{"):!1).map(o=>({from:o.from,to:o.to,name:o.prelude.slice(1)}))}function _l(t,e,o){const n=String(t||"");if(!Sl(n,e,o))return n;const s=wl(n);if(!s.length)return n;const r=me(n)[0],i=Tl(n,r),l=s.map(p=>Al(n.slice(p.from,p.to),n,p.from,i)).join(`

`);let c=n;for(const p of[...s].sort((x,k)=>k.from-x.from))c=Cl(c,p.from,p.to);const d=$l(c,o);if(d===-1)return n;const f=(c.slice(0,d).match(/\n([^\S\n]*)$/)||[null,null])[1],h=f===null?d:d-f.length;return`${c.slice(0,h)}
${l}
${f??""}${c.slice(d)}`}function $l(t,e){const o=me(t).find(n=>n.prelude.includes(e));return o?o.bodyTo:me(t)[0]?.bodyTo??-1}function Cl(t,e,o){let n=e,s=o;const r=t.lastIndexOf(`
`,n-1)+1;for(t.slice(r,n).trim()===""&&(n=r);t[s]===" "||t[s]==="	";)s+=1;return t[s]===`
`&&(s+=1),t.slice(0,n)+t.slice(s)}function Tl(t,e){const o=t.slice(e.bodyFrom,e.bodyTo).match(/\n([^\S\n]+)\S/);return o?o[1]:`${(t.slice(0,e.from).match(/\n([^\S\n]*)$/)||[null,""])[1]}    `}function Al(t,e,o,n){const s=(e.slice(0,o).match(/\n([^\S\n]*)$/)||[null,""])[1];return t.split(`
`).map((r,i)=>i===0?n+r.trim():r.startsWith(s)?n+r.slice(s.length):n+r.trimStart()).join(`
`)}const Ml={"data-sve-css-add-label":""},El=["placeholder","onKeydown"],ko={__name:"CodeDockAddClass",props:{label:{type:String,required:!0},placeholder:{type:String,default:""},initial:{type:String,default:""},onAdd:{type:Function,required:!0}},setup(t){const e=t,o=dt(e.initial||""),n=dt(null);Sn(()=>Ke(()=>{n.value?.focus(),n.value?.select()}));function s(){const r=o.value.trim();if(!r){n.value?.focus();return}e.onAdd(r)}return(r,i)=>(y(),b(P,null,[v("label",Ml,A(t.label),1),wn(v("input",{ref_key:"input",ref:n,"data-sve-css-add-input":"","onUpdate:modelValue":i[0]||(i[0]=l=>o.value=l),type:"text",placeholder:t.placeholder,onKeydown:[Tt(L(s,["prevent"]),["enter"]),i[1]||(i[1]=Tt(L(()=>{},["stop"]),["escape"]))]},null,40,El),[[_n,o.value]])],64))}};function tn(t,e){e._sveLockBound||(e._sveLockBound=!0,e.querySelector("[data-sve-code-lock]")?.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),!(!a.lockReady||!a.lastType)){if(a.lastLocked){Fl(t);return}ns(t,!0)}}))}function So(t){return t?Q(t,pr)!=="0":!0}function Bl(){const t=g.html;return!t||t.state.readOnly||!a.lastType?!1:!Ao(To(),a.lastParts)}function it(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-code-autosave]"),n=e?.querySelector("[data-sve-code-save]");if(!o||!n)return;const s=So(t),r=Bl();o.setAttribute("aria-pressed",s?"true":"false"),o.title=m(t,s?"code_dock_autosave_on":"code_dock_autosave_off"),o.setAttribute("aria-label",o.title),o.innerHTML=eu,n.hidden=s,n.title=m(t,"code_dock_save"),n.setAttribute("aria-label",n.title),n.innerHTML=ou,r?n.setAttribute("data-dirty",""):n.removeAttribute("data-dirty")}function en(t,e){e._sveAutosaveBound||(e._sveAutosaveBound=!0,e.querySelector("[data-sve-code-autosave]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=!So(t);U(t,pr,n?"1":"0"),n?Z(t.document):a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null),it(t)}),e.querySelector("[data-sve-code-save]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),Z(t.document)}))}function Fl(t){t.document.getElementById(G)?.remove();const e=_r(t.document,$r,{title:m(t,"code_dock_unlock_title"),body:m(t,"code_dock_unlock_body"),buttons:[{value:"cancel",label:m(t,"cancel"),variant:"ghost"},{value:"ok",label:m(t,"code_dock_unlock_confirm"),variant:"primary"}],onPick:o=>{e.dismiss(),o==="ok"&&ns(t,!1)}});e.host.id=G}function ns(t,e){const o=a.lastType;if(!o)return;const n=()=>{a.lastType===o&&t.fetch("/!/sve/section-template/lock",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":An(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:o,locked:e})}).then(async s=>{if(!s.ok)throw new Error(String(s.status));a.lastType===o&&(a.lastLocked=e,Et(t),te(a.lastParts,e),K(t),R(t.document,e?m(t,"code_dock_locked"):""))}).catch(()=>{R(t.document,m(t,"code_dock_error"))})};if(e&&(Z(t.document),a.saveInFlight)){a.saveInFlight.finally(n);return}n()}function ve(t){if(!a.lastUid||!a.lastType||String(a.lastType).startsWith("view:")){Ho(t);return}const e=Tr(a.lastUid,t.document);Ho(t,e.length?{sectionUids:e}:void 0)}function Ll(t,e,o){return a.saveInFlight=t.fetch("/!/sve/section-template",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":An(t),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:e,html:o.html,css:o.css,js:o.js,...typeof o.tw=="string"?{tw:o.tw}:{},...Qr(t)?{props:a.lastProps}:{}})}).then(async n=>{if(n.status===423){a.lastLocked=!0,a.lockReady=!0,Et(t),te(a.lastParts,!0),K(t),R(t.document,m(t,"code_dock_locked"));return}const s=await n.json().catch(()=>({}));if(!n.ok)throw new Error(s?.error==="not_writable"?"not_writable":String(n.status));if(a.lastType===e){if(a.lastParts=o,s?.tw_written===!1){a.twDirty=!0,R(t.document,m(t,"code_dock_tw_not_writable")),it(t),ve(t);return}R(t.document,m(t,"code_dock_saved")),it(t),t.setTimeout(()=>{const r=t.document.getElementById(u)?.querySelector("[data-sve-code-status]");r&&r.textContent===m(t,"code_dock_saved")&&(r.textContent="")},1800)}ve(t),t.document.getElementById("__sve-section-picker")?.dispatchEvent(new t.CustomEvent("sve-library-stale"))}).catch(n=>{R(t.document,m(t,n?.message==="not_writable"?"code_dock_not_writable":"code_dock_error"))}).finally(()=>{a.saveInFlight=null}),a.saveInFlight}function Z(t){a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null);const e=a.lastType,o=a.lastWin,n=g.html;if(!n||n.state.readOnly||!e||!o||!a.lockReady)return;const s=To(),r=a.twCss!==null&&Fn(o)&&wo(s.html)===a.twKey;Ao(s,a.lastParts)&&!(r&&a.twDirty)&&!a.propsDirty||(a.propsDirty=!1,r&&(s.tw=a.twCss,a.twDirty=!1),R(t,m(o,"code_dock_saving")),Ll(o,e,s))}function wo(t){return ga(t).sort().join(" ")}function Il(){a.twCss=null,a.twKey="",a.twDirty=!1}function Ol(t,e){a.twCss=e,a.twKey=wo(t),a.twDirty=!1}function ss(t,e){if(!t||!Fn(t))return;const o=wo(e);o===a.twKey||a.twBusy||(a.twBusy=!0,Cr(()=>import("./tw-compile-D8Xdoe3O.js"),__vite__mapDeps([0,1]),import.meta.url).then(n=>n.compileTailwind(t,e)).then(n=>{a.twBusy=!1,a.twCss=n,a.twKey=o,a.twDirty=!0,rs(t,t.document)}).catch(n=>{a.twBusy=!1,console.error("[sve] tailwind compile",n)}))}function rs(t,e){a.saveTimer&&clearTimeout(a.saveTimer),a.saveTimer=t.setTimeout(()=>{a.saveTimer=null,Z(e)},Yd)}function nt(t){if(a.applying)return;const e=To();if(Ao(e,a.lastParts)){it(t);return}if(it(t),ss(t,e.html),!So(t)){R(t.document,m(t,"code_dock_unsaved"));return}R(t.document,m(t,"code_dock_saving")),rs(t,t.document)}function as(t,e){let o=0;const n=Math.min(t.length,e.length);for(;o<n&&t[o]===e[o];)o+=1;let s=t.length,r=e.length;for(;s>o&&r>o&&t[s-1]===e[r-1];)s-=1,r-=1;return[o,s,e.slice(o,r)]}function is(t){const e=a.lastUid,o=typeof et=="function"?et(t.document):[];for(const n of o){const s=kt(n.values)||n.values;if(!(!s||typeof s!="object")&&e&&typeof Ro=="function"){const r=Ro(s,e);if(r){const i=r.split("."),l=Ar(s,i.slice(0,2).join("."));if(l&&typeof l=="object")return l}}}for(const n of o){const s=kt(n.values)||n.values;if(s&&typeof s=="object")return s}return null}function ls(t,e){!e||e===a.lastType||(Z(t.document),ze(t,e,"push"))}function cs(t){const e=a.typeStack.pop();if(!e){Yt(t);return}Z(t.document),ze(t,e,"keep")}function Et(t){const e=t.document.getElementById(u),o=e?.querySelector("[data-sve-code-lock]"),n=e?.querySelector("[data-sve-code-lock-banner]");if(!e||!o)return;const s=a.lastLocked;e.toggleAttribute("data-sve-code-locked",s),s&&(Ln(t.document),rt(t.document),a.htmlPartialUi&&(a.htmlPartialUi.setHover(g.html,null),a.htmlPartialUi.setHover(g.css,null)),a.htmlClassTokenUi?.setHover(g.html,null)),o.hidden=!a.lockReady,o.setAttribute("aria-pressed",a.lastLocked?"true":"false"),o.title=m(t,a.lastLocked?"code_dock_unlock":"code_dock_lock"),o.setAttribute("aria-label",o.title),o.innerHTML=a.lastLocked?Zd:Jd,n&&(n.textContent=m(t,"code_dock_locked_banner"))}function Zt(t){return t?Q(t,Re)!=="0":a.htmlScopePref}function Te(t,e,o){return t!=null&&e!=null&&t>=0&&e>t&&e<=o}function Ae(){const t=g.html?.state.doc.toString()??"";if(!a.htmlScopeActive||!a.htmlFocus){a.htmlFull=t;return}if(a.htmlFocus.from<0||a.htmlFocus.from>a.htmlFull.length||a.htmlFocus.to<a.htmlFocus.from){a.htmlScopeActive=!1,a.htmlFull=t,a.htmlFocus=null;return}a.htmlFull=a.htmlFull.slice(0,a.htmlFocus.from)+t+a.htmlFull.slice(a.htmlFocus.to),a.htmlFocus={from:a.htmlFocus.from,to:a.htmlFocus.from+t.length}}function It(){return Ae(),a.htmlScopeActive?a.htmlFull:g.html?.state.doc.toString()??a.lastParts.html??""}function Me(){a.lastBracketNames=Se(It()).map(t=>t.name)}function Ot(){a.lastCssSelectorNames=Wn(g.css?.state.doc.toString()??a.cssFull)}function ds(t,e){return Array.isArray(t)&&Array.isArray(e)&&t.length===e.length&&t.every((o,n)=>o===e[n])}function Pl(){const t=a.htmlScopeActive?_o():It(),e=we(t);e.length&&(a.cssFull=yo(a.cssFull,go(a.cssFull,e),e[0].className))}function us(t,e){a.cssFull=Ia(a.cssFull,t,e),Pl(),a.cssFull=Oa(a.cssFull,e,t)}function Dl(t){if(a.applying||a.lastLocked||a.lastBracketNames==null)return;const e=Se(It()).map(o=>o.name);ds(a.lastBracketNames,e)||(us(a.lastBracketNames,e),a.lastBracketNames=e,Jt(),Ot())}function zl(){if(a.applying||a.lastLocked||a.lastCssSelectorNames==null||a.lastBracketNames==null||a.cssPane==="empty")return;const t=g.html,e=Wn(g.css?.state.doc.toString()??"");if(!t||ds(a.lastCssSelectorNames,e))return;const o=new Set(a.lastBracketNames),{renamed:n,removed:s}=qn(a.lastCssSelectorNames,e);let r=t.state.doc.toString();const i=r;for(const l of n){const c=St(l.to);!o.has(l.from)||!c||(r=Uo(r,d=>d===l.from?c:d))}for(const l of s)!o.has(l)||e.includes(l)||(r=Uo(r,c=>c===l?"":c));if(r!==i){a.applying=!0;try{Be(r)}finally{a.applying=!1}}Me(),a.lastCssSelectorNames=e}function Hl(t,e){const o=St(e),n=g.html;if(!o||!n||n.state.readOnly||o===t.name)return;a.applying=!0;try{n.dispatch({changes:{from:t.from,to:t.to,insert:o}})}finally{a.applying=!1}const s=a.lastBracketNames==null?[]:a.lastBracketNames.slice();Me(),us(s,a.lastBracketNames),Jt(),Ot(),a.lastWin&&(nt(a.lastWin),O(a.lastWin))}function Rl(t,e){const o=t.document,s=g.html?.coordsAtPos(e.from);w(o),rt(o);const r=o.createElement("div"),i={getBoundingClientRect:()=>({left:s?.left??12,right:s?.right??12,top:s?.top??12,bottom:s?.bottom??12,width:0,height:0})};r.id=$,o.body.appendChild(r),N(t,i,r),r._sveApp=W(ko,r,{label:m(t,"code_dock_css_rename_class"),placeholder:m(t,"code_dock_css_class_placeholder"),initial:e.name,onAdd:l=>{Hl(e,l),w(o)}})}function fs(){return a.htmlScopePref&&Te(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)?(a.htmlScopeActive=!0,a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to)):(a.htmlScopeActive=!1,a.htmlFull)}function Ee(t,e,o){const n=g[t];if(!n)return;const s=n.state.doc.toString();a.applying=!0;try{if(s!==e){const[r,i,l]=as(s,e);n.dispatch({changes:{from:r,to:i,insert:l},...o?{selection:o,scrollIntoView:!0}:{}})}else o&&n.dispatch({selection:o,scrollIntoView:!0})}finally{a.applying=!1}}function Be(t,e){Ee("html",t,e)}function _o(){return a.htmlScopeActive?g.html?.state.doc.toString()??"":Te(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)?a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to):""}function ct(){const t=g.css?.state.doc.toString()??"";if(a.cssPane==="tree"){if(t===a.cssScopeSnapshot)return;const e=we(_o())[0]?.className||Kn(t);a.cssFull=yo(a.cssFull,t,e),a.cssScopeSnapshot=t}else a.cssPane==="full"&&(a.cssFull=t)}function hs(t,e){for(const o of e||[])if(!X(t,o.className)||hs(t,o.children))return!0;return!1}function Jt(){let t=a.cssFull,e=[],o=!1;a.cssValues||!a.htmlScopePref||!a.htmlScopeActive?(a.cssPane="full",t=a.cssFull):(e=we(_o()),e.length?(a.cssPane="tree",t=go(a.cssFull,e),hs(a.cssFull,e)&&(a.cssFull=yo(a.cssFull,t,e[0].className),o=!0)):(a.cssPane="empty",t="")),a.cssScopeSnapshot=t,Ee("css",t),Ot(),a.lastWin&&(oe(a.lastWin,!0),O(a.lastWin),o&&nt(a.lastWin))}function $o(t){const e=g.html;if(!e||!a.htmlFocus)return;a.htmlScopeActive||(a.htmlFull=e.state.doc.toString());const o=a.htmlFull.length,n=Math.max(0,Math.min(a.htmlFocus.from,o)),s=Math.max(n,Math.min(a.htmlFocus.to,o));if(s<=n)return;a.htmlFocus={from:n,to:s},a.htmlScopeActive=!0;const r=t==null?0:Math.max(0,Math.min(t-n,s-n));Be(a.htmlFull.slice(n,s),{anchor:r,head:r}),Jt(),e.focus()}function Co(t=!0,e=null){const o=g.html;if(!o)return;ct(),Ae(),a.htmlScopeActive=!1;const n=a.htmlFull||o.state.doc.toString(),s=e!=null?{anchor:Math.max(0,Math.min(e,n.length))}:t&&Te(a.htmlFocus?.from,a.htmlFocus?.to,n.length)?{anchor:a.htmlFocus.from,head:a.htmlFocus.to}:null;a.htmlFull=n,Be(n,s),a.cssPane="full",a.cssScopeSnapshot=a.cssFull,Ee("css",a.cssFull),Ot()}function Fe(){a.htmlFocus=null,a.htmlScopeActive=!1,a.htmlFull="",a.cssFull="",a.cssPane="full",a.cssScopeSnapshot="",a.lastBracketNames=null,a.lastCssSelectorNames=null}let Ut=!1;function Mt(t){return!!t?.document.getElementById(En)}function Ze(t,e){if(!(!t||uo(t,"html_tree")===!1)){if(!e){Mt(t)&&Mn(t);return}Mt(t)||(Ut=!0,Mr("html_tree").then(()=>{Mt(t)||Er(t)}).catch(()=>{}).finally(()=>{Ut=!1,K(t)}))}}function K(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-html-scope]");if(!e)return;a.htmlScopePref=Zt(t);const o=uo(t,"html_tree")===!1?a.htmlScopePref:Mt(t)||Ut;e.setAttribute("aria-pressed",o?"true":"false"),e.title=m(t,o?"code_dock_html_scope_off":"code_dock_html_scope"),e.setAttribute("aria-label",e.title),e.innerHTML=gr,t.document.getElementById(u)?.toggleAttribute("data-sve-html-scoped",a.htmlScopeActive)}function on(t,e){e._sveHtmlScopeBound||(e._sveHtmlScopeBound=!0,a.htmlScopePref=Zt(t),jl(t,e),Ze(t,a.htmlScopePref),e.querySelector("[data-sve-html-scope]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=Mt(t)||Ut;a.htmlScopePref=!n,U(t,Re,a.htmlScopePref?"1":"0"),a.htmlScopePref?a.htmlFocus&&(ct(),$o()):a.htmlScopeActive&&Co(),Ze(t,a.htmlScopePref),K(t)}))}function jl(t,e){e._sveTreeWatchBound||(e._sveTreeWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>{if(Ut||uo(t,"html_tree")===!1||!t.document.getElementById(u))return;const o=Mt(t);o!==Zt(t)&&(a.htmlScopePref=o,U(t,Re,o?"1":"0"),o?a.htmlFocus&&(ct(),$o()):a.htmlScopeActive&&Co(),K(t))}))}const Nl=new Set(["pre","textarea","script","style"]),Wl=/^(<\/|\{\{\s*\/)/;function ql(t){let e=0;for(const o of t.split(`
`)){if(!o.trim())continue;const n=o.length-o.trimStart().length;n>0&&(e===0||n<e)&&(e=n)}return" ".repeat(e===2||e===3?e:4)}function Vl(t){const e=String(t||"");if(!e.trim())return e;const o=[],n=l=>{for(const c of l||[])o.push(c),n(c.children)};n(ta(e));const s=ql(e),r=[];let i=0;for(const l of e.split(`
`)){const c=i,d=l.trim();if(i+=l.length+1,!d){r.push("");continue}const f=c+(l.length-l.trimStart().length),h=o.filter(x=>x.from<f&&f<x.to);if(h.some(x=>Nl.has(x.tag))){r.push(l);continue}const p=h.length-(Wl.test(d)?1:0);r.push(s.repeat(Math.max(p,0))+d)}return r.join(`
`)}function ps(t,e){if(t.startsWith("{{",e)){const o=t.indexOf("}}",e+2);return o===-1?t.length:o+2}if(t.startsWith("<!--",e)){const o=t.indexOf("-->",e+4);return o===-1?t.length:o+3}return e}function Je(t,e){if(t[e]!=="<")return null;const o=t.indexOf(">",e+1);if(o===-1)return null;const n=t.slice(e,o+1),s=n.match(/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/);if(s)return{kind:"close",name:s[1].toLowerCase(),from:e,to:o+1};const r=n.match(/^<([A-Za-z][A-Za-z0-9:-]*)/);if(!r)return{kind:"other",from:e,to:o+1};const i=r[1].toLowerCase();return{kind:/\/\s*>$/.test(n)||["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"].includes(i)?"void":"open",name:i,from:e,to:o+1}}function nn(t,e,o){let n=1,s=o;for(;s<t.length;){const r=ps(t,s);if(r!==s){s=r;continue}if(t[s]!=="<"){s+=1;continue}const i=Je(t,s);if(!i)break;if(i.kind==="open"&&i.name===e)n+=1;else if(i.kind==="close"&&i.name===e&&(n-=1,n===0))return i;s=i.to}return null}function Qt(){const t=g.html;if(!t)return null;const e=t.state.selection.main.head,o=t.state.doc.toString(),n=[];let s=0;for(;s<e;){const c=ps(o,s);if(c!==s){s=c;continue}if(o[s]!=="<"){s+=1;continue}const d=Je(o,s);if(!d||d.from>=e)break;if(d.kind==="open")n.push(d);else if(d.kind==="close"){for(let f=n.length-1;f>=0;f-=1)if(n[f].name===d.name){n.splice(f);break}}s=d.to}const r=o.lastIndexOf("<",Math.max(0,e-1));if(r!==-1&&o.indexOf(">",r)>=e){const c=Je(o,r);if(c?.kind==="open"||c?.kind==="void"){const d=c.kind==="void"?null:nn(o,c.name,c.to);return d?{name:c.name,open:c,close:d}:{name:c.name,open:c,close:null}}}const i=n[n.length-1];if(!i)return null;const l=nn(o,i.name,i.to);return{name:i.name,open:i,close:l}}function Qe(t){return yr.includes(t)}function q(){g.html?.focus(),a.lastWin&&(nt(a.lastWin),Le(a.lastWin))}function gt(t,e,o){const n=[...e].sort((s,r)=>r.from-s.from||r.to-s.to);t.dispatch({changes:n,selection:o})}function Bt(t,e,o){const n=g.html;if(!n||n.state.readOnly)return;const s=n.state.selection.main.head,r=n.state.doc.lineAt(s),i=r.text.slice(0,s-r.from),l=r.text.trim()?lt(r.text):Oe(n,r)||lt(r.text);let c=t,d=0;if(i.trim()!=="")c=`
${l}${t}`,d=1+l.length;else if(!r.text.trim()){c=`${l}${t}`,d=l.length,n.dispatch({changes:{from:r.from,to:r.to,insert:c},selection:sn(r.from+d+e,o)});return}n.dispatch({changes:{from:s,to:n.state.selection.main.to,insert:c},selection:sn(s+d+e,o)})}function sn(t,e){return e?{anchor:t,head:t+e}:{anchor:t}}const Ul=new Set(["section","article","header","footer","main","nav","aside"]);function rn(t){if(t!=="section")return`<${t}>`;const e=a.lastWin?.Statamic?.$config?.get?.("sveSectionTag");return typeof e=="string"&&e.trim()?`<${t} ${e.trim()}>`:`<${t}>`}function ms(){const t=g.html;if(!t||t.state.readOnly)return;const e=t.state.doc.toString(),o=(e.match(/^[ \t]*/)||[""])[0],n=Vl(e).split(`
`).map(s=>s&&o+s).join(`
`);n!==e&&(gt(t,[{from:0,to:e.length,insert:n}],{anchor:0}),q())}function vs(t){const e=g.html;if(!e||e.state.readOnly)return;const o=e.state.selection.main,n=e.state.doc.toString();if(!o.empty){const l=n.slice(o.from,o.to),c=l.match(new RegExp(`^<${t}(\\s[^>]*)?>([\\s\\S]*)</${t}>$`,"i"));if(c){gt(e,[{from:o.from,to:o.to,insert:c[2]}],{anchor:o.from,head:o.from+c[2].length}),q();return}const d=rn(t);let f=`${d}${l}</${t}>`,h=o.from+d.length;t==="ul"&&(f=`<ul>
  <li>${l}</li>
</ul>`,h=o.from+11),gt(e,[{from:o.from,to:o.to,insert:f}],{anchor:h,head:h+l.length}),q();return}const s=Qt();if(s?.open&&s.close){if(s.name===t){gt(e,[{from:s.close.from,to:s.close.to,insert:""},{from:s.open.from,to:s.open.to,insert:""}],{anchor:s.open.from}),q();return}if(Qe(s.name)&&Qe(t)){const l=n.slice(s.open.from,s.open.to).replace(new RegExp(`^<${s.name}`,"i"),`<${t}`);gt(e,[{from:s.close.from,to:s.close.to,insert:`</${t}>`},{from:s.open.from,to:s.open.to,insert:l}],{anchor:s.open.from+t.length+1}),q();return}}const i=(e.state.doc.lineAt(o.head).text.match(/^\s*/)||[""])[0];if(t==="ul"){const l=`<ul>
${i}  <li></li>
${i}</ul>`;Bt(l,`<ul>
${i}  <li>`.length)}else{const l=rn(t),c=`${l}</${t}>`;Bt(c,Ul.has(t)?l.length:c.length)}q()}function Le(t){try{Kl(t)}catch{}}function Kl(t){const e=t?.document?.getElementById(u),n=Qt()?.name||"";if(e)for(const s of lo){const r=e.querySelector(`[data-sve-html-tool="${s.id}"]`);if(!r)continue;(s.id==="heading"?Qe(n):n===s.tag)?r.setAttribute("data-active",""):r.removeAttribute("data-active")}}function an(t,e,o){const n=t.document,s=Qt()?.name||"";w(n),e.setAttribute("data-open","");const r=n.createElement("div");r.id=$,n.body.appendChild(r),N(t,e,r),r._sveApp=W(ot,r,{kind:"choices",choices:o.map(i=>({value:i,label:i.toUpperCase(),active:s===i})),onPick:i=>{vs(i),w(n)}})}function Gl(t,e){const o=t.document;w(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=$,o.body.appendChild(n),N(t,e,n);const s=r=>{o.getElementById($)&&(n._sveApp?.unmount(),n._sveApp=W(ot,n,{kind:"choices",choices:r,onPick:i=>{i&&(Bt(i,i.length),q()),w(o)}}),N(t,e,n))};s([{value:"",label:m(t,"code_dock_loading")}]),t.fetch("/!/sve/components",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(r=>r.ok?r.json():{items:[]}).then(r=>{const i=Array.isArray(r.items)?r.items:[];s(i.length?i.map(l=>({value:l.tag,label:l.name})):[{value:"",label:m(t,"component_none")}])}).catch(()=>s([{value:"",label:m(t,"component_none")}]))}function Xl(t){const e=St(t),o=g.html,n=g.css;if(!e||o?.state.readOnly||n?.state.readOnly)return;const s=Qt();if(s?.open&&o){const r=o.state.doc.sliceString(s.open.from,s.open.to),i=$a(r,e);i!==r&&o.dispatch({changes:{from:s.open.from,to:s.open.to,insert:i}})}ct(),X(a.cssFull,e)||(a.cssFull=`${String(a.cssFull||"").trimEnd()}${a.cssFull?.trim()?`
`:""}.${e} {
}
`),Jt(),Me(),Ot(),a.lastWin&&(nt(a.lastWin),Le(a.lastWin),O(a.lastWin))}function Yl(t,e){const o=t.document;if(e.hasAttribute("data-open")){w(o);return}w(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=$,o.body.appendChild(n),N(t,e,n),n._sveApp=W(ko,n,{label:m(t,"code_dock_css_class_name"),placeholder:m(t,"code_dock_css_class_placeholder"),onAdd:s=>{Xl(s),w(o)}})}function Zl(t,e){const o=e.querySelector("[data-sve-css-add-class]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=nu,o.title=m(t,"code_dock_css_add_class"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),a.styleMode==="tw"){w(t.document),ea(t,o);return}Yl(t,o)}))}function To(){const t={html:"",css:"",js:""};Ae(),ct();for(const e of at)e==="html"?t.html=a.htmlScopeActive?a.htmlFull:g.html?.state.doc.toString()??"":e==="css"?(t.css=a.lastWin?sl(a.cssFull,pt(a.lastWin)):a.cssFull,t.css=_l(t.css,t.html,Kd)):t[e]=g[e]?.state.doc.toString()??"";return t}function gs(){if(a.cssValues||!(a.htmlScopePref&&Te(a.htmlFocus?.from,a.htmlFocus?.to,a.htmlFull.length)))return a.cssPane="full",a.cssScopeSnapshot=a.cssFull,a.cssFull;const t=we(a.htmlFull.slice(a.htmlFocus.from,a.htmlFocus.to));if(!t.length)return a.cssPane="empty",a.cssScopeSnapshot="","";a.cssPane="tree";const e=go(a.cssFull,t);return a.cssScopeSnapshot=e,e}function te(t,e){a.applying=!0;try{a.lastWin&&(a.htmlScopePref=Zt(a.lastWin)),a.htmlFull=t.html??"",a.cssFull=t.css??"";for(const o of at){const n=g[o];let s=t[o]??"";try{s=o==="html"?fs():o==="css"?gs():s}catch{s=o==="html"?a.htmlFull||t.html||"":o==="css"?a.cssFull||t.css||"":s}if(!n)continue;const r=n.state.doc.toString(),i=[qt[o].reconfigure(ye.readOnly.of(!!e)),Vt[o].reconfigure(Y.editable.of(!e))];r!==s?n.dispatch({changes:{from:0,to:r.length,insert:s},effects:i}):n.dispatch({effects:i})}}finally{a.applying=!1}Me(),Ot(),fo("dock:html-changed"),a.lastWin&&(O(a.lastWin),Le(a.lastWin),K(a.lastWin),se(a.lastWin))}function Ao(t,e){return t.html===e.html&&t.css===e.css&&t.js===e.js}function ys(t){return String(t||"").replace(/\/\*[\s\S]*?\*\//g,"").trim().replace(/\s*:\s*/g,": ").replace(/\s*;\s*/g,";").replace(/\s+/g," ").replace(/;+$/,";")}function bs(t){const e=ys(t).match(/^([a-z-]+)\s*:/i);return e?e[1].toLowerCase():""}function xs(t){const e=ys(t),o=e.indexOf(":");return o===-1?"":e.slice(o+1).replace(/;$/,"").trim().toLowerCase()}function D(t){const e=String(t||"").trim().toLowerCase();return e==="start"||e==="flex-start"||e==="left"||e==="top"?"flex-start":e==="end"||e==="flex-end"||e==="right"||e==="bottom"?"flex-end":e==="row-reverse"?"row-reverse":e==="column-reverse"?"column-reverse":e}function Kt(t){const e=D(t);return e==="flex"||e==="inline-flex"}function Ie(){const t=g.css;if(!t)return null;const e=t.state.selection.main.head,o=t.state.doc.toString(),n=[],s=[];for(let i=0;i<o.length;i+=1){if(o[i]==="{"&&o[i+1]==="{"){const l=o.indexOf("}}",i+2);if(l===-1)break;i=l+1;continue}if(o[i]==="{")n.push(i);else if(o[i]==="}"){const l=n.pop();l!=null&&s.push({from:l+1,to:i,text:o.slice(l+1,i),open:l})}}let r=null;for(const i of s)e<i.open||e>i.to||(!r||i.to-i.open<r.to-r.open)&&(r=i);return r}function Jl(t){const e=String(t||"");let o="",n=0;for(let s=0;s<e.length;s+=1){if(e[s]==="{"&&e[s+1]==="{"){const r=e.indexOf("}}",s+2);if(r===-1)break;n===0&&(o+=e.slice(s,r+2)),s=r+1;continue}if(e[s]==="{"){n+=1;continue}if(e[s]==="}"){n=Math.max(0,n-1);continue}n===0&&(o+=e[s])}return o}function ln(t){const e={};for(const o of Jl(t).split(";")){const n=bs(o);n&&(e[n]=xs(`${o};`))}return e}function Ql(t,e,o){if(!e||e.from>=e.to)return null;let n=t.state.doc.lineAt(e.from),s=0;for(;n.from<=e.to;){const r=Math.max(n.from,e.from),i=Math.min(n.to,e.to),l=t.state.doc.sliceString(r,i);if(s===0&&bs(l)===o)return{from:r,to:i,text:l};if(s+=tc(l),n.to>=t.state.doc.length||n.to>=e.to)break;n=t.state.doc.lineAt(n.to+1)}return null}function tc(t){let e=0;const o=String(t);for(let n=0;n<o.length;n+=1){if(o[n]==="{"&&o[n+1]==="{"){const s=o.indexOf("}}",n+2);n=s===-1?o.length:s+1;continue}o[n]==="{"?e+=1:o[n]==="}"&&(e-=1)}return e}function lt(t){return(String(t).match(/^\s*/)||[""])[0]}function Oe(t,e,o){for(let n=e.number-1;n>=1;n-=1){const s=t.state.doc.line(n),r=s.text.trim();if(!r)continue;const i=lt(s.text);if(o&&(r==="{"||r.endsWith("{")))return`${i}  `;if(!(r==="}"||r.startsWith("}")))return i}return""}function ec(t,e){const o=t.state.doc.lineAt(e);if(o.text.trim())return lt(o.text);const n=Oe(t,o,!0);if(n)return n;const s=Ie();return s?ks(t,s):"  "}function ks(t,e){const o=t.state.doc.lineAt(e.from),n=t.state.doc.lineAt(Math.max(e.from,e.to));for(let r=n.number;r>=o.number;r-=1){const i=t.state.doc.line(r),l=Math.max(i.from,e.from),c=Math.min(i.to,e.to),d=t.state.doc.sliceString(l,c);if(d.trim())return(d.match(/^\s*/)||[""])[0]||"  "}return`${(t.state.doc.lineAt(Math.max(0,e.from-1)).text.match(/^\s*/)||[""])[0]}  `}function cn(){g.css?.focus(),a.lastWin&&(nt(a.lastWin),O(a.lastWin))}function Ss(t,e){if(!e)return"";const o=t.state.doc.toString();let n=0;for(let s=e.open-1;s>=0;s-=1)if(o[s]==="}"||o[s]==="{"||o[s]===";"){n=s+1;break}return o.slice(n,e.open).replace(/\/\*[\s\S]*?\*\//g,"").trim()}function oc(t,e){if(!a.cssState||!e)return e;const o=ws(t,e);if(o)return o;const n=Ss(t,e);if(!n||n.startsWith("@"))return e;const s=t.state.doc.toString(),r=yt(s,e.open),i=yt(s,e.to)||`${r}    `,l=(t.state.doc.sliceString(e.from,e.to).match(/\n([^\S\n]*)$/)||[null,null])[1],c=l===null?e.to:e.to-l.length,d=`
${i}&${De()} {
${i}}
${l??r}`;t.dispatch({changes:{from:c,to:e.to,insert:d}});const f=t.state.doc.toString(),h=f.indexOf("{",c+d.indexOf("&")),p=h===-1?-1:Ft(f,h);return p===-1?e:{from:h+1,to:p,text:f.slice(h+1,p),open:h}}function yt(t,e){const o=t.lastIndexOf(`
`,e-1)+1;return(t.slice(o,e).match(/^\s*/)||[""])[0]}function J(t){const e=g.css;if(!e||e.state.readOnly||!t.length)return;const o=Ie(),n=t.some(l=>l.value!=null)?oc(e,o):o;if(!n){const l=t.filter(c=>c.value!=null).map(c=>`${c.property}: ${c.value};`).join(`
`);l&&rc(l),cn();return}const s=[],r=[],i=ks(e,n);for(const l of t){const c=Ql(e,n,l.property);if(l.value==null){if(!c)continue;let d=c.from,f=c.to;e.state.doc.sliceString(f,f+1)===`
`&&(f+=1),d=Math.max(d,n.from),f=Math.min(f,n.to),s.push({from:d,to:f});continue}if(!(c&&D(xs(c.text))===D(l.value)))if(c){const d=(c.text.match(/^\s*/)||[""])[0];s.push({from:c.from,to:c.to,insert:`${d}${l.property}: ${l.value};`})}else r.push(`${i}${l.property}: ${l.value};`)}if(r.length){const l=!n.text.includes(`
`)||!/\n\s*$/.test(n.text)?`
`:"",c=(n.text.match(/\n([^\S\n]*)$/)||[null,null])[1],d=c===null?n.to:n.to-c.length,f=c===null?"":c;s.push({from:d,to:n.to,insert:`${l}${r.join(`
`)}
${f}`})}s.length&&(s.sort((l,c)=>c.from-l.from||c.to-l.to),e.dispatch({changes:s})),cn()}function tt(){const t=g.css,e=Ie();if(!e)return{};if(a.cssState&&t){const o=ws(t,e);return o?ln(o.text):{}}return ln(e.text)}function ws(t,e){const o=Ss(t,e),n=De();if(!o||o.startsWith("@"))return null;if(o.endsWith(n))return e;const s=t.state.doc.toString(),r=i=>{const l=Ft(s,i);return l===-1?null:{from:i+1,to:l,text:s.slice(i+1,l),open:i}};for(const i of[`&${n}`,`${o}${n}`]){const l=new RegExp(`(^|[^\\w-])${i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\s*\\{`,"g");let c;for(;c=l.exec(s);){const d=s.indexOf("{",c.index);if(i.startsWith("&")&&(d<e.from||d>e.to))continue;const f=r(d);if(f)return f}}return null}function nc(t){const e=tt(),o=Kt(e.display),n=D(e["flex-direction"])||(o?"row":"");if(o&&n===t){const s=[];e["flex-direction"]&&s.push({property:"flex-direction",value:null}),Kt(e.display)&&s.push({property:"display",value:null}),J(s);return}J([{property:"display",value:"flex"},{property:"flex-direction",value:t}])}function sc(t){const e=tt();if(t==="flex"&&Kt(e.display)){J([{property:"justify-content",value:null},{property:"align-items",value:null},{property:"flex-direction",value:null},{property:"display",value:null}]);return}J([{property:"display",value:t}])}function rc(t){const e=g.css;if(!e||e.state.readOnly)return;const o=e.state.selection.main.head,n=e.state.doc.lineAt(o),s=n.text.slice(0,o-n.from),r=n.text.slice(o-n.from),i=ec(e,o),l=t.replace(/;?$/,";");if(s.trim()===""&&r.trim()===""){const d=`${i}${l}
${i}`;e.dispatch({changes:{from:n.from,to:n.to,insert:d},selection:{anchor:n.from+d.length}});return}const c=`
${i}${l}
${i}`;e.dispatch({changes:{from:o,to:e.state.selection.main.to,insert:c},selection:{anchor:o+c.length}})}function O(t){try{ac(t),ne(t)}catch{}}function ac(t){const e=a.styleMode==="tw",o=e?{}:tt(),n=Kt(e?Wo("display"):o.display),s=D(o["flex-direction"])||(n?"row":""),r=i=>e?sa()&&!!i.tw&&!!Wo(i.tw):!!i.css&&i.css in o;ut.tools=xr.map(i=>{const l=(i.kids||[]).filter(c=>c.when!=="flex"||n).map(c=>({id:c.id,title:c.title,icon:kn[c.icon]||"",sep:!!c.sep,open:a.cssOpenMenu===c.id,active:e?r(c):c.kind==="display"?n:c.kind==="flexDir"?n&&s===c.value:c.value?D(o[c.css])===D(c.value):r(c)}));return{id:i.id,title:i.title,icon:kn[i.id]||ru[i.id]||"",open:a.cssOpenTool===i.id||a.cssOpenMenu===i.id,kids:l,active:i.value?!e&&D(o[i.css])===D(i.value):r(i)||l.some(c=>c.active)}})}function w(t){const e=t?.getElementById($);a.cssOpenMenu="",e?._sveApp?.unmount(),e?.remove(),t?.querySelectorAll("[data-sve-css-tool][data-open], [data-sve-html-tool][data-open], [data-sve-css-add-class][data-open], [data-sve-code-history][data-open]").forEach(o=>o.removeAttribute("data-open"))}function Lu(t){w(t),bt(t),rt(t);for(const e of at)g[e]&&or?.(g[e])}function _s(t){if(a.cssColorsPromise)return a.cssColorsPromise;const e=t.Statamic?.$config?.get?.("cpUrl")||`/${t.Statamic?.$config?.get?.("cpRoute")||"cp"}`;return a.cssColorsPromise=t.fetch(`${e}/color-scheme/swatches`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async o=>{if(!o.ok)return[];const n=await o.json().catch(()=>[]);return Array.isArray(n)?n:[]}).catch(()=>[]).then(o=>{const n=new Set,s=[];for(const r of o){const i=r.var||r.value||r.handle,l=String(i||"").trim().replace(/^var\((.+)\)$/,"$1");!l||n.has(l)||(n.add(l),s.push({name:l,hex:r.hex||r.color||""}))}for(const[r,i]of br)n.has(r)||(n.add(r),s.push({name:r,hex:i}));return s}),a.cssColorsPromise}function $s(t,e){const o=tt()[e]||"",n=String(o).match(/^var\(\s*([^)]+?)\s*\)$/i),s=n?n[1].trim():"";for(const r of t.querySelectorAll("[data-sve-css-token]"))s&&r.getAttribute("data-sve-css-token")===s?r.setAttribute("data-active",""):r.removeAttribute("data-active")}function N(t,e,o){const n=e.getBoundingClientRect(),s=8;o.style.left=`${Math.max(s,Math.min(n.left,t.innerWidth-220))}px`,o.style.top=`${Math.max(s,n.bottom+4)}px`}function ic(t,e,o){const n=t.document;w(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=$,n.body.appendChild(s),N(t,e,s);const r=i=>{s._sveApp?.unmount(),s._sveApp=W(ot,s,{kind:"colors",swatches:i,onClear:()=>{J([{property:o,value:null}]),w(n)},onPick:l=>{J([{property:o,value:`var(${l})`}]),w(n)}}),$s(s,o)};r(br.map(([i,l])=>({name:i,hex:l}))),_s(t).then(i=>{n.getElementById($)&&r(i.map(l=>({name:l.name,hex:l.hex})))})}function lc(t,e,o,n){const s=t.document;w(s),e.setAttribute("data-open","");const r=s.createElement("div"),i=tt()[o]||"";r.id=$,s.body.appendChild(r),N(t,e,r),r._sveApp=W(ot,r,{kind:"choices",choices:(n||[]).map(l=>({value:l,label:l,active:D(l)===D(i)})),onPick:l=>{const c=D(l)===D(tt()[o]||"");J([{property:o,value:c?null:l}]),w(s)}})}function dn(t,e,o,n=[]){const s=t.document;w(s),e.setAttribute("data-open",""),oa(t);const r=s.createElement("div");r.id=$,s.body.appendChild(r),N(t,e,r);const i=()=>{const l=[...n.map(d=>({value:d,label:d})),...na(t,o).map(d=>({value:d.value,label:d.value}))],c=tt()[o]||"";r._sveApp?.unmount(),r._sveApp=W(ot,r,{kind:"choices",choices:l.map(d=>({...d,active:D(d.value)===D(c)})),onPick:d=>{J([{property:o,value:d||null}]),w(s)}})};i(),_s(t).then(()=>{s.getElementById($)===r&&i()})}function cc(t,e,o){const n=t.document;w(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=$,n.body.appendChild(s),N(t,e,s),s._sveApp=W(ot,s,{kind:"choices",choices:su.map(r=>({value:r,token:r,label:r})),onPick:r=>{J([{property:o,value:`var(${r})`}]),w(n)}}),$s(s,o)}const un=/\{\{#[\s\S]*?#\}\}|\{\{[\s\S]*?\}\}/g,fn=/<!--[\s\S]*?-->/g,hn=/<(\/?)([A-Za-z][A-Za-z0-9-]*)/g,Cs=/^\{\{\s*(?:\/|endif\b|endunless\b)/,dc=/^\{\{\s*(?:\/\s*(?:if|unless)\b|endif\b|endunless\b)/,uc=/^\{\{\s*\/\s*partial\b/;function qe(t,e,o){return t.some(n=>e<n.to&&o>n.from)}function fc(t){const e=new Map;for(const o of ra(t)){const n=o.kind==="loop"?"loop":"if";e.set(o.from,n);const s=t.lastIndexOf("{{",o.to-2);s>=o.openTo&&Cs.test(t.slice(s,o.to))&&e.set(s,n)}for(const o of Bn(t))e.set(o.from,"component");return e}function hc(t){const e=String(t||""),o=[],n=[];fn.lastIndex=0;let s;for(;s=fn.exec(e);)o.push({from:s.index,to:s.index+s[0].length});const r=fc(e),i=[];for(un.lastIndex=0;s=un.exec(e);){const l=s.index,c=l+s[0].length,d=s[0];if(qe(o,l,c))continue;if(i.push({from:l,to:c}),d.startsWith("{{#")){n.push({from:l,to:c,cls:"comment"});continue}const f=Cs.test(d),h=r.get(l)||(f&&dc.test(d)?"if":"")||(f&&uc.test(d)?"component":"");n.push({from:l,to:c,cls:(h?`fam-${h}`:"antlers")+(f?"-close":"")})}for(hn.lastIndex=0;s=hn.exec(e);){const l=s.index+1+s[1].length,c=l+s[2].length;qe(o,l,c)||qe(i,l,c)||n.push({from:l,to:c,cls:`fam-${Br(s[2])}`})}return n.sort((l,c)=>l.from-c.from),n}function pn(t,e,o){const n=new e.RangeSetBuilder;let s=0;for(const r of hc(t.doc.toString()))r.from<s||(n.add(r.from,r.to,o(r.cls)),s=r.to);return n.finish()}function pc(t){const e=new Map,o=r=>r==="comment"?"sve-cm-antlers-comment":r==="antlers"?"sve-cm-antlers":r==="antlers-close"?"sve-cm-antlers sve-cm-antlers-close":r.endsWith("-close")?`sve-cm-${r.slice(0,-6)} sve-cm-antlers-close`:`sve-cm-${r}`,n=r=>(e.has(r)||e.set(r,t.Decoration.mark({class:o(r)})),e.get(r));return{extensions:[t.StateField.define({create(r){return pn(r,t,n)},update(r,i){return i.docChanged?pn(i.state,t,n):r},provide:r=>t.EditorView.decorations.from(r)})]}}const B=co({tag:"",emptyText:"",addLabel:"",dropTitle:"",chips:[],states:[],canEdit:!1,onAdd:null,onChip:null,onDrop:null}),mc={class:"sve-al"},vc={class:"sve-al-head"},gc={key:0,class:"sve-al-tag"},yc=["title","disabled"],bc={key:0,class:"sve-al-empty"},xc={class:"sve-al-chips"},kc=["data-sve-al-chip","title","disabled","onClick"],Sc={class:"sve-al-name"},wc={key:0,class:"sve-al-value"},_c=["title","onClick"],$c={__name:"AlpinePanel",setup(t){return(e,o)=>(y(),b("div",mc,[v("div",vc,[T(B).tag?(y(),b("span",gc,"<"+A(T(B).tag)+">",1)):j("",!0),(y(!0),b(P,null,V(T(B).states,n=>(y(),b("span",{key:n,class:"sve-al-state"},A(n),1))),128)),o[1]||(o[1]=v("span",{class:"sve-al-gap"},null,-1)),v("button",{type:"button","data-sve-al-add":"",title:T(B).addLabel,disabled:!T(B).canEdit,onClick:o[0]||(o[0]=L(n=>T(B).onAdd?.(n),["prevent","stop"]))},"+",8,yc)]),T(B).chips.length?j("",!0):(y(),b("div",bc,A(T(B).emptyText),1)),v("div",xc,[(y(!0),b(P,null,V(T(B).chips,n=>(y(),b("span",{key:n.id,class:"sve-al-chip-wrap"},[v("button",{type:"button","data-sve-al-chip":n.id,title:n.title,disabled:!T(B).canEdit,onClick:L(s=>T(B).onChip?.(s,n.id),["prevent","stop"])},[v("span",Sc,A(n.name),1),n.value?(y(),b("span",wc,A(n.value),1)):j("",!0)],8,kc),T(B).canEdit?(y(),b("button",{key:0,type:"button",class:"sve-al-drop",title:T(B).dropTitle,onClick:L(s=>T(B).onDrop?.(n.id),["prevent","stop"])},"−",8,_c)):j("",!0)]))),128))])]))}},Cc=Tn($c,[["__scopeId","data-v-15add965"]]),Tc=[{id:"state",lang:"alpine_group_state"},{id:"act",lang:"alpine_group_act"},{id:"react",lang:"alpine_group_react"}],mn=[{id:"state",group:"state",label:"alpine_state",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: false }"}]},{id:"state_text",group:"state",label:"alpine_state_text",icon:"state",needsName:!0,attrs:[{name:"x-data",value:"{ :name: '|' }"}]},{id:"toggle",group:"act",label:"alpine_toggle",icon:"toggle",needsName:!0,attrs:[{name:"@click",value:":name = !:name"}]},{id:"open",group:"act",label:"alpine_open",icon:"open",needsName:!0,attrs:[{name:"@click",value:":name = true"}]},{id:"close",group:"act",label:"alpine_close",icon:"close",needsName:!0,attrs:[{name:"@click",value:":name = false"}]},{id:"open_hover",group:"act",label:"alpine_open_hover",icon:"open",needsName:!0,attrs:[{name:"@mouseenter",value:":name = true"}]},{id:"close_leave",group:"act",label:"alpine_close_leave",icon:"close",needsName:!0,attrs:[{name:"@mouseleave",value:":name = false"}]},{id:"open_focus",group:"act",label:"alpine_open_focus",icon:"open",needsName:!0,attrs:[{name:"@focusin",value:":name = true"}]},{id:"close_blur",group:"act",label:"alpine_close_blur",icon:"close",needsName:!0,attrs:[{name:"@focusout",value:":name = false"}]},{id:"close_outside",group:"act",label:"alpine_close_outside",icon:"outside",needsName:!0,attrs:[{name:"@click.outside",value:":name = false"}]},{id:"close_escape",group:"act",label:"alpine_close_escape",icon:"escape",needsName:!0,attrs:[{name:"@keydown.escape.window",value:":name = false"}]},{id:"show",group:"react",label:"alpine_show",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"}]},{id:"show_smooth",group:"react",label:"alpine_show_smooth",icon:"show",needsName:!0,attrs:[{name:"x-show",value:":name"},{name:"x-transition",value:""}]},{id:"hide_until_ready",group:"react",label:"alpine_hide_until_ready",icon:"cloak",attrs:[{name:"x-cloak",value:""}]},{id:"class_when",group:"react",label:"alpine_class_when",icon:"klass",needsName:!0,attrs:[{name:":class",value:":name ? '|' : ''"}]},{id:"text",group:"react",label:"alpine_text",icon:"text",needsName:!0,attrs:[{name:"x-text",value:":name"}]}];function Ac(t){return(t?.attrs||[]).map(e=>e.name).join(" ")}const Mc=/^(x-[\w:.-]+|@[\w:.-]+|:[\w-]+)$/;function Ec(t){return Mc.test(String(t||""))}function ee(t){const e=String(t||""),o=[],n=/([@:a-zA-Z_][\w:.@-]*)(\s*=\s*(["'])([\s\S]*?)\3)?/g;let s,r=!0;for(;s=n.exec(e);){if(r){r=!1;continue}s[0].trim()&&o.push({name:s[1],value:s[4]??"",from:s.index,to:s.index+s[0].length,alpine:Ec(s[1])})}return o}function Ts(t){const e=String(t||"").trim().replace(/^\{|\}$/g,""),o=[],n=/(^|,)\s*([a-zA-Z_$][\w$]*)\s*:/g;let s;for(;s=n.exec(e);)o.push(s[2]);return o}function Bc(t,e){return t.map(o=>({name:o.name,value:String(o.value).replaceAll(":name:",`${e}:`).replaceAll(":name",e)}))}function Mo(t,e,o){const n=g.html,s=$t();if(!n||n.state.readOnly||!s)return;const r=a.htmlScopeActive&&!!a.htmlFocus,i=r?a.htmlFocus.from:0,c=(r?a.htmlFull:n.state.doc.toString()).slice(s.from,s.openTo),d=o===""?e:`${e}="${o}"`,f=ee(c).find(p=>p.name===e);let h;if(f)h=c.slice(0,f.from)+d+c.slice(f.to);else{const p=c.search(/\s|\/?>$/);h=p===-1?c:`${c.slice(0,p)} ${d}${c.slice(p)}`}h!==c&&(gt(n,[{from:s.from-i,to:s.openTo-i,insert:h}],null),Pe(t))}function Fc(t,e){const o=g.html,n=$t();if(!o||o.state.readOnly||!n)return;const s=a.htmlScopeActive&&!!a.htmlFocus,r=s?a.htmlFocus.from:0,l=(s?a.htmlFull:o.state.doc.toString()).slice(n.from,n.openTo),c=ee(l).find(h=>h.name===e);if(!c)return;let d=c.from;for(;d>0&&/\s/.test(l[d-1]);)d-=1;const f=l.slice(0,d)+l.slice(c.to);gt(o,[{from:n.from-r,to:n.openTo-r,insert:f}],null),Pe(t)}function to(t){const e=g.html;if(!e)return[];const n=a.htmlScopeActive&&!!a.htmlFocus?a.htmlFull:e.state.doc.toString(),s=$t(),r=[],i=In(ke(n),new Set);for(const l of i){if(!s||l.from>s.from||l.to<s.to)continue;const c=ee(n.slice(l.from,l.openTo)).find(d=>d.name==="x-data");c&&r.push(...Ts(c.value))}return[...new Set(r)]}function Lc(t){const e=g.html,o=$t();if(!e||!o)return[];const s=a.htmlScopeActive&&!!a.htmlFocus?a.htmlFull:e.state.doc.toString(),r=ee(s.slice(o.from,o.openTo)).find(i=>i.name==="x-data");return r?Ts(r.value):[]}function Ic(t,e){const o=t.document;w(o),e.setAttribute("data-open","");const n=to(),s=o.createElement("div");s.id=$,o.body.appendChild(s),N(t,e,s);const r=!n.length,i=!r&&!Lc().length,c=Tc.filter(d=>d.id==="state"?!i:!r).flatMap(d=>{const f=mn.filter(h=>h.group===d.id);return f.length?[{value:`\0${d.id}`,label:m(t,r&&d.id==="state"?"alpine_group_state_first":d.lang),heading:!0},...f.map(h=>({value:h.id,label:m(t,h.label),hint:Ac(h)}))]:[]});r&&c.push({value:"\0note",label:m(t,"alpine_needs_state"),note:!0}),s._sveApp=W(ot,s,{kind:"choices",choices:c,onPick:d=>{const f=mn.find(h=>h.id===d);if(w(o),!!f){if(!f.needsName){for(const h of f.attrs)Mo(t,h.name,h.value);return}Oc(t,e,f,n)}}})}function Oc(t,e,o,n){const s=t.document,r=l=>{const c=String(l||"").trim().replace(/[^\w$]/g,"");if(w(s),!!c)for(const d of Bc(o.attrs,c))Mo(t,d.name,d.value.replace("|",""))};if(!n.length){eo(t,e,r);return}const i=s.createElement("div");i.id=$,s.body.appendChild(i),N(t,e,i),i._sveApp=W(ot,i,{kind:"choices",choices:[{value:"\0head",label:m(t,"alpine_name"),heading:!0},...n.map(l=>({value:l,label:l})),{value:"\0new",label:m(t,"alpine_new_name")}],onPick:l=>{if(l==="\0new"){eo(t,e,r);return}r(l)}})}function eo(t,e,o){const n=t.document;w(n),e.setAttribute("data-open","");const s=n.createElement("div");s.id=$,n.body.appendChild(s),N(t,e,s),s._sveApp=W(ko,s,{label:m(t,"alpine_name"),placeholder:m(t,"alpine_name_placeholder"),onAdd:r=>o(r)})}function Pe(t){const o=t?.document.getElementById(u)?.querySelector("[data-sve-alpine-host]");if(!o)return;const n=$t(),s=g.html,r=a.htmlScopeActive&&!!a.htmlFocus,i=s?r?a.htmlFull:s.state.doc.toString():"",l=n?ee(i.slice(n.from,n.openTo)):[];B.tag=n?.tag||"",B.canEdit=!a.lastLocked&&!!n,B.emptyText=m(t,n?to().length?"alpine_none_ready":"alpine_none":"alpine_pick"),B.addLabel=m(t,"alpine_add"),B.dropTitle=m(t,"alpine_remove"),B.states=to(),B.chips=l.filter(c=>c.alpine).map(c=>({id:c.name,name:c.name,value:c.value,title:c.value?`${c.name}="${c.value}"`:c.name})),B.onAdd=c=>Ic(t,c.currentTarget),B.onDrop=c=>Fc(t,c),B.onChip=(c,d)=>{B.chips.find(h=>h.id===d)&&eo(t,c.currentTarget,h=>Mo(t,d,h))},o._sveMounted||(o._sveMounted=!0,_t(o,Cc))}function Pc(){if(a.cssGhostUi)return a.cssGhostUi;const t=zt.mark({class:"sve-css-ghost"}),e=o=>{const n=new Dt;if(!a.lastWin)return n.finish();try{for(const s of rl(o.doc.toString(),pt(a.lastWin)))n.add(s.from,s.to,t)}catch{}return n.finish()};return a.cssGhostUi=Pt.define({create:o=>e(o),update:(o,n)=>n.docChanged?e(n.state):o,provide:o=>Y.decorations.from(o)}),a.cssGhostUi}let ce=null,ge=null;function Dc(){if(ce)return ce;ge=He.define();const t=zt.line({class:"sve-css-id"}),e=o=>{const n=new Dt;if(!a.lastWin||!a.cssValues)return n.finish();try{const s=o.doc;for(const r of pe(s.toString(),pt(a.lastWin),a.cssSize)){const i=s.lineAt(Math.min(r.from,s.length)).number,l=s.lineAt(Math.min(Math.max(r.to-1,r.from),s.length)).number;for(let c=i;c<=l;c+=1)n.add(s.line(c).from,s.line(c).from,t)}}catch{}return n.finish()};return ce=Pt.define({create:o=>e(o),update:(o,n)=>n.docChanged||n.effects.some(s=>s.is(ge))?e(n.state):o,provide:o=>Y.decorations.from(o)}),ce}function Eo(){ge&&g.css&&g.css.dispatch({effects:ge.of(null)})}function zc(){return a.htmlPartialUi||(a.htmlPartialUi=la({Decoration:zt,StateField:Pt,StateEffect:He,RangeSetBuilder:Dt,EditorView:Y})),a.htmlPartialUi}function Hc(){return a.htmlAntlersUi||(a.htmlAntlersUi=pc({Decoration:zt,StateField:Pt,RangeSetBuilder:Dt,EditorView:Y})),a.htmlAntlersUi}function Rc(){return a.htmlClassTokenUi||(a.htmlClassTokenUi=Da({Decoration:zt,StateField:Pt,StateEffect:He,RangeSetBuilder:Dt,EditorView:Y})),a.htmlClassTokenUi}function jc(t,e,o){g[e]?.destroy();const n=ro.of([{key:"Mod-s",run:()=>(Z(t.document),!0)}]);g[e]=new Y({state:ye.create({doc:"",extensions:[Us(),Ks(),Gs(),Js(),Md(e),tr(),Qs({tooltipClass:()=>"sve-tw-complete"}),...e==="html"?[rr.data.of({autocomplete:aa(t)}),ia(sr,t)]:[],...e==="html"?[...ya(),ba()]:[],...e==="css"?[cr(),Pc(),Dc()]:[],ro.of([...Xs,...e==="html"?[{key:"Tab",run:xa}]:[],Ys,...Zs,...nr,...er]),n,Y.lineWrapping,...e==="html"||e==="css"?zc().extensions:[],...e==="html"?Hc().extensions:[],...e==="html"?Rc().extensions:[],qt[e].of(ye.readOnly.of(!!a.lastLocked)),Vt[e].of(Y.editable.of(!a.lastLocked)),Y.updateListener.of(s=>{e==="html"&&s.docChanged&&!a.applying&&(Dl(),fo("dock:html-changed")),e==="css"&&s.docChanged&&!a.applying&&zl(),s.docChanged&&nt(t),e==="css"&&(s.docChanged||s.selectionSet)&&O(t),e==="css"&&s.docChanged&&!a.applying&&oe(t),e==="html"&&(s.docChanged||s.selectionSet)&&(Le(t),Pe(t),a.applying||se(t))}),...Yr(C,{height:"auto",background:"#1E1E21",scroller:{overflow:"visible",height:"auto",minHeight:0},extraTags:s=>[{tag:s.tagName,color:"#4ec9b0"},{tag:s.attributeName,color:"#9cdcfe"},{tag:s.attributeValue,color:"#ce9178"},{tag:s.angleBracket,color:"#808080"}]})]}),parent:o})}function Nc(t){if(!t||t.querySelector(".cm-editor"))return;t.replaceChildren();const e=t.ownerDocument.createElement("span");e.style.cssText="width:16px;height:16px;margin:12px;border:2px solid #858585;border-right-color:transparent;border-radius:50%;display:block;animation:sve-cm-wait .6s linear infinite",t.appendChild(e)}function pt(t){return ho(t).map(e=>({handle:e.handle,base:e.base,max:e.max,media:e.media,media_px:e.media_px,label:e.label}))}function As(t,e){return pt(t).find(o=>o.handle===e)||null}function De(t=a.cssState){return t?t==="before"||t==="after"?`::${t}`:`:${t}`:""}function oe(t,e=!1){const o=g.css;if(!o||!ao||!io)return;const n=o.state.doc.toString(),s=`${a.cssValues?"1":"0"}|${a.cssSize}|${Ce(n).map(f=>`${f.from}-${f.to}`).join(",")}`;if(!e&&s===a.cssFoldSig)return;a.cssFoldSig=s;const r=pt(t),i=new Map,l=[...nl(n,r,a.cssSize),...a.cssValues?[]:pe(n,r,a.cssSize).map(f=>({from:f.from,to:f.to}))];for(const f of l)f.to>f.from&&i.set(`${f.from}:${f.to}`,{from:f.from,to:f.to});const c=[],d=new Set;dr(o.state).between(0,n.length,(f,h)=>{const p=`${f}:${h}`;d.add(p),!i.has(p)&&a.cssOwnFolds.has(p)&&c.push(io.of({from:f,to:h}))});for(const[f,h]of i)d.has(f)||c.push(ao.of(h));a.cssOwnFolds=new Set(i.keys()),c.length&&o.dispatch({effects:c})}function oo(t,e){const o=a.cssFull||e;return/max-width/i.test(o)&&!/width\s*</i.test(o)&&t.media_px||t.media}function Wc(t,e){const o=g.css;if(!o||o.state.readOnly)return;const n=pt(t),s=As(t,e),r=o.state.doc.toString();if(!s||s.base){const f=o.state.selection.main.head,h=Ce(r).find(p=>f>=p.from&&f<=p.to);h&&o.dispatch({selection:{anchor:h.from},scrollIntoView:!0});return}const i=xo(r,n,e);if(i.length){const f=i[0],h=Math.min(f.bodyTo,f.bodyFrom+(r.slice(f.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);o.dispatch({selection:{anchor:h},scrollIntoView:!0});return}const l=oo(s,r),c=Ms(o,r),d=`

${c.indent}@media ${l} {
${c.indent}    
${c.indent}}${c.suffix}`;o.dispatch({changes:{from:c.at,to:c.at,insert:d},selection:{anchor:c.at+d.lastIndexOf("    ")+4},scrollIntoView:!0})}function Ms(t,e){const o=Ce(e);if(o.length){const i=o[o.length-1];return{at:i.to,indent:yt(e,i.from),suffix:""}}const n=i=>({at:i.to,indent:yt(e,i.to)||`${yt(e,i.open)}    `,suffix:`
${yt(e,i.open)}`}),s=Ie();if(s)return n(s);const r=qc(e);return r?n(r):{at:e.length,indent:"",suffix:""}}function qc(t){const e=String(t||"");let o=null,n=0,s=0;for(;n<e.length;){if(e[n]==="}"||e[n]===";"){n+=1,s=n;continue}if(e[n]!=="{"){n+=1;continue}const r=Ft(e,n);if(r===-1||o||(o=e.slice(s,n).trim().startsWith("@")?null:{from:s,open:n,to:r},!o))return null;n=r+1,s=n}return o}function Vc(t,e){const o=e===a.cssSize?"":e;a.cssSize=o,U(t,Lo,o),xt("lp:set-device",{win:t,key:o?Fr(o,t):"Responsive"}),o&&Wc(t,o),a.cssValues&&Bs(t),oe(t,!0),Eo(),ne(t),O(t)}function Uc(t,e){a.cssState=Io.includes(e)?e:"",U(t,no,a.cssState),w(t.document),ne(t),O(t)}function Kc(t,e){const o=t.document;w(o),e.setAttribute("data-open","");const n=o.createElement("div");n.id=$,o.body.appendChild(n),N(t,e,n),n._sveApp=W(ot,n,{kind:"choices",choices:[{value:"",label:m(t,"css_state_none"),active:!a.cssState},...Io.map(s=>({value:s,label:De(s),active:s===a.cssState}))],onPick:s=>Uc(t,s)})}function ne(t){const o=t?.document.getElementById(u)?.querySelector("[data-sve-css-head]");if(!o)return;const n=$t(),s=pt(t),r=g.css?.state.doc.toString()??"";F.tag=n?.tag||"",F.scope=_a(n?It().slice(n.from,n.openTo):"")||"",F.canEdit=!a.lastLocked,F.onTag=i=>ca(t,i.currentTarget,n),F.state=a.cssState,F.stateLabel=a.cssState?De(a.cssState):m(t,"css_state"),F.onState=i=>Kc(t,i.currentTarget),F.onSize=i=>Vc(t,i),F.sizes=[{key:"",label:m(t,"tw_size_all"),title:m(t,"css_size_all_title"),active:!a.cssSize},...s.map(i=>{const l=i.base||xo(r,s,i.handle).length>0;return{key:i.handle,label:i.label,title:i.base?m(t,"css_size_base_title"):`@media ${i.media}${l?"":`  ·  ${m(t,"css_size_new")}`}`,active:a.cssSize===i.handle}})],o._sveMounted||(o._sveMounted=!0,_t(o,hl))}xe("lp:device",t=>{const e=a.lastWin;if(!e||!Is(e.document))return;const o=ho(e).find(n=>n.device===t)?.handle||"";o!==a.cssSize&&(a.cssSize=o,U(e,Lo,o),oe(e,!0),Eo(),ne(e),O(e))});function Gc(t){const e=Math.max(0,Math.round(Date.now()/1e3-t)),o=new Date(t*1e3).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});let n=o;try{const s=new Intl.RelativeTimeFormat(void 0,{numeric:"auto"});e<90?n=s.format(-e,"second"):e<5400?n=s.format(-Math.round(e/60),"minute"):e<86400?n=s.format(-Math.round(e/3600),"hour"):n=s.format(-Math.round(e/86400),"day")}catch{}return`${n} · ${o}`}function Es(t,e){return t.fetch(e,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}})}async function Xc(t,e){const o=t.document,n=Ct();if(w(o),!n)return;let s=[];try{const i=await Es(t,`/!/sve/section-template/history?type=${encodeURIComponent(n)}`);i.ok&&(s=(await i.json())?.entries||[])}catch{s=[]}if(!o.getElementById(u)||!o.contains(e))return;e.setAttribute("data-open","");const r=o.createElement("div");r.id=$,o.body.appendChild(r),N(t,e,r),r._sveApp=W(ot,r,{kind:"choices",choices:s.length?s.map(i=>({value:i.id,label:Gc(i.at)})):[{value:"",label:m(t,"code_dock_history_empty")}],onPick:i=>{w(o),i&&Yc(t,n,i)}})}async function Yc(t,e,o){if(ht())return;let n=null;try{const s=await Es(t,`/!/sve/section-template/history/entry?type=${encodeURIComponent(e)}&id=${encodeURIComponent(o)}`);s.ok&&(n=await s.json())}catch{n=null}!n||ht()||(te({html:n.html??"",css:n.css??"",js:n.js??""},a.lastLocked),nt(t),se(t))}function Gt(t){const e=t?.document.getElementById(u)?.querySelector("[data-sve-code-strip]");if(!e)return;e.hidden=a.styleMode!=="tw";const o=On(t);e.innerHTML=au,e.title=m(t,o?"tw_strip_on":"tw_strip_off"),e.setAttribute("aria-label",e.title),e.setAttribute("aria-pressed",o?"true":"false")}function Zc(t,e){const o=e.querySelector("[data-sve-code-strip]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),da(t,!On(t)),Gt(t),ua(t)}),Gt(t))}function Jc(t,e){const o=e.querySelector("[data-sve-code-history]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=iu,o.title=m(t,"code_dock_history"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),o.hasAttribute("data-open")){w(t.document);return}Xc(t,o)}))}function Iu(){return a.styleMode}function Qc(t){return a.styleMode==="tw"?$t():null}function $t(t){const e=g.html;if(!e)return null;const o=a.htmlScopeActive&&!!a.htmlFocus,n=o?a.htmlFull:e.state.doc.toString(),r=(o?a.htmlFocus.from:0)+e.state.selection.main.from,i=In(ke(n),new Set);let l=null;for(const c of i)c.from<=r&&r<c.to&&(l=c);return l}function se(t){a.styleMode==="tw"&&fa(t,Qc())}function Bo(t){const e=t?.document.getElementById(u),o=e?.querySelector("[data-sve-values-mode]");if(!e||!o)return;e.setAttribute("data-sve-values",a.cssValues?"on":"off");const n=t.document.createElement("span");n.textContent=m(t,"code_dock_values"),o.innerHTML=cu,o.appendChild(n),o.title=m(t,a.cssValues?"code_dock_values_off":"code_dock_values_on"),o.setAttribute("aria-label",o.title),o.setAttribute("aria-pressed",a.cssValues?"true":"false")}function Bs(t){const e=g.css;if(!e||e.state.readOnly)return;const o=pt(t),n=e.state.doc.toString(),s=pe(n,o,a.cssSize);if(e.focus(),s.length){const p=s[0],x=Math.min(p.bodyTo,p.bodyFrom+(n.slice(p.bodyFrom).match(/^[^\S\n]*\n?/)||[""])[0].length);e.dispatch({selection:{anchor:x},scrollIntoView:!0});return}const r=As(t,a.cssSize);if(!r||r.base){const p=`#id-{{ id }} {
    `;e.dispatch({changes:{from:0,to:0,insert:`${p}
}

`},selection:{anchor:p.length},scrollIntoView:!0});return}const i=xo(n,o,a.cssSize)[0];if(i){const p=`${yt(n,i.from)}    `,x=`
${p}#id-{{ id }} {
${p}    `;e.dispatch({changes:{from:i.bodyFrom,to:i.bodyFrom,insert:`${x}
${p}}
`},selection:{anchor:i.bodyFrom+x.length},scrollIntoView:!0});return}const l=Ms(e,n),c=`${l.indent}    `,d=pe(n,o,"").some(p=>l.at>p.bodyFrom&&l.at<=p.bodyTo),f=d?`

${l.indent}@media ${oo(r,n)} {
${c}`:`

${l.indent}@media ${oo(r,n)} {
${c}#id-{{ id }} {
${c}    `,h=d?`
${l.indent}}${l.suffix}`:`
${c}}
${l.indent}}${l.suffix}`;e.dispatch({changes:{from:l.at,to:l.at,insert:`${f}${h}`},selection:{anchor:l.at+f.length},scrollIntoView:!0})}function td(t,e){a.cssValues=!!e,U(t,zo,a.cssValues?"1":"0"),w(t.document),a.cssOpenTool="",Bo(t),ct(),Jt(),a.cssValues&&Bs(t),oe(t,!0),Eo(),ne(t),O(t)}function Fo(t){const e=t?.document.getElementById(u);if(!e)return;const o=a.styleMode==="tw";e.setAttribute("data-sve-style",a.styleMode);const n=e.querySelector("[data-sve-css-label]");n&&(n.textContent=o?m(t,"code_dock_style_tw"):m(t,"code_dock_css"));const s=e.querySelector("[data-sve-style-mode]");if(!s)return;const r=t.document.createElement("span");r.textContent=o?m(t,"code_dock_style_tw"):m(t,"code_dock_css"),s.innerHTML=o?du:lu,s.appendChild(r),s.title=m(t,o?"code_dock_style_to_css":"code_dock_style_to_tw"),s.setAttribute("aria-label",s.title),s.setAttribute("aria-pressed",o?"true":"false")}function Fs(t){t?.document.getElementById(u),w(t.document),Ye(t),a.cssOpenTool="",a.cssOpenMenu="",a.styleMode==="tw"&&a.cssValues&&(a.cssValues=!1,U(t,zo,"0")),Fo(t),Bo(t),Gt(t),a.cssToolRow?.(),a.styleMode==="tw"&&(a.htmlScopePref=!0,U(t,Re,"1"),Ze(t,!0)),se(t),Pe(t),O(t)}const Lo="sve-css-size",no="sve-css-state",Io=["hover","focus","focus-visible","active","disabled","before","after"];function ed(t,e){a.styleMode=e==="tw"?"tw":"css",U(t,mr,a.styleMode),Fs(t)}function od(t,e){if(e._sveStyleModeBound)return;e._sveStyleModeBound=!0,a.styleMode=Q(t,mr)==="tw"?"tw":"css";const o=Q(t,Lo)||"";a.cssSize=ho(t).some(n=>n.handle===o)?o:"",a.cssState=Io.includes(Q(t,no))?Q(t,no):"",a.cssValues=Q(t,zo)==="1",e.querySelector("[data-sve-style-mode]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),ed(t,a.styleMode==="tw"?"css":"tw")}),e.querySelector("[data-sve-values-mode]")?.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),td(t,!a.cssValues)}),Fs(t),Bo(t)}function nd(t,e){const o=e.querySelector("[data-sve-css-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=r=>e.querySelector(`[data-sve-css-tool="${r}"], [data-sve-css-kid="${r}"]`),s=r=>{const i=n(r.id),l=a.cssOpenMenu===r.id;if(w(t.document),l){Ye(t),O(t);return}if(!i)return;const c=a.styleMode==="tw"?!r.twClass&&!!r.tw:!r.kind&&!r.value&&!(r.css in tt())&&!!r.menu,d=()=>{c&&(a.cssOpenMenu=r.id)};if(a.styleMode==="tw"){Ye(t),r.twClass?(ha(t,r.twClass),O(t)):r.tw&&(pa(t,i,r.tw,()=>O(t)),d(),O(t));return}if(r.kind==="flexDir"){nc(r.value);return}if(r.kind==="display"){sc(r.value);return}if(r.value){const f=D(tt()[r.css])===D(r.value);J([{property:r.css,value:f?null:r.value}]);return}if(r.css in tt()){J([{property:r.css,value:null}]),O(t);return}r.menu==="colors"?ic(t,i,r.css):r.menu==="spacing"?cc(t,i,r.css):r.menu==="sizes"?dn(t,i,r.css,mu):r.menu==="choices"?lc(t,i,r.css,r.choices):r.menu==="values"&&dn(t,i,r.css),d(),O(t)};ut.onTool=r=>{const i=be.get(r)?.tool;if(i){if(i.kids?.length){a.cssOpenTool=a.cssOpenTool===i.id?"":i.id,w(t.document),O(t);return}s(i)}},ut.onKid=(r,i)=>{const l=be.get(i);l?.kid&&s(l.kid)},a.cssToolRow=()=>{_t(o,Qi),O(t)},a.cssToolRow(),t.document.addEventListener("mousedown",r=>{r.target.closest(`#${$}, [data-sve-css-tools], [data-sve-html-tools], [data-sve-css-add-class]`)||w(t.document)},!0)}function sd(t,e){const o=e.querySelector("[data-sve-html-tidy]");o&&(o.innerHTML=Pn.tidy,o.title=m(t,"code_dock_html_tidy"),o.setAttribute("aria-label",o.title),o.setAttribute("data-tip",o.title))}function rd(t,e){const o=e.querySelector("[data-sve-html-tidy]");sd(t,e),!(!o||o._sveBound)&&(o._sveBound=!0,o.addEventListener("mousedown",n=>n.preventDefault()),o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),ms()}))}function ad(t,e){const o=e.querySelector("[data-sve-html-tools]");!o||o._sveBound||(o._sveBound=!0,_t(o,Ki,{tools:lo.map(n=>({...n,icon:Pn[n.id]||""})),onTool:n=>{const s=lo.find(i=>i.id===n),r=o.querySelector(`[data-sve-html-tool="${n}"]`);if(s){if(s.menu==="heading"){an(t,r,yr);return}if(s.menu==="text"){an(t,r,Lr);return}if(s.tidy){ms();return}if(s.menu==="component"){Gl(t,r);return}if(w(t.document),s.snippet){Bt(s.snippet,s.caret??s.snippet.length,s.select),q();return}vs(s.tag)}}}),_d(t,e),Cd(t,e),wd(t,e))}E("dock:save-now",()=>(Z(a.lastWin?.document),!0));let de=null;async function id(t){const e=t.document;Od(e);let o=e.getElementById(u);if(o&&!(o.querySelector('[data-sve-css-chrome="subrow-2"]')&&o.querySelector("[data-sve-css-add-class]")&&o.querySelector("[data-sve-html-tools]")&&o.querySelector("[data-sve-html-tidy]")&&o.querySelector("[data-sve-data-vars]")&&o.querySelector("[data-sve-visual-edit-tools]")&&o.querySelector("[data-sve-html-scope]")&&o.querySelector("[data-sve-code-lock]")&&o.querySelector("[data-sve-code-back]")&&o.querySelector("[data-sve-code-autosave]")&&o.querySelector("[data-sve-code-save]")&&o.getAttribute("data-sve-code-chrome")==="scope-9")){for(const s of at)g[s]?.destroy(),g[s]=null;o.remove(),o=null}if(!o){o=e.createElement("div"),o.id=u,o.setAttribute("data-sve-code-chrome","scope-9"),Nr(o,Wr(t)),_t(o,zi,{htmlLabel:m(t,"code_dock_html"),cssLabel:m(t,"code_dock_css"),jsLabel:m(t,"code_dock_js"),alpineLabel:m(t,"code_dock_alpine"),treeIcon:gr,dataIcon:tu,dataLabel:m(t,"data_vars_title")}),Xe(e,o),yn(o),Ns(o,zs(t)),Nd(t,o),qd(t,o),Wd(t,o),nd(t,o),Zl(t,o),od(t,o),Jc(t,o),Zc(t,o),qr(t,o),ad(t,o),on(t,o),tn(t,o),bn(t,o),en(t,o);for(const n of at){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);Nc(s)}Vr(t)}if(Xe(e,o),yn(o),rd(t,o),on(t,o),tn(t,o),bn(t,o),en(t,o),Hd(t),Oo(t),Et(t),K(t),Yt(t),it(t),Fo(t),Gt(t),await Ud(),!g.html){for(const n of at){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);s?.replaceChildren(),jc(t,n,s)}for(const n of["html","css"])g[n]&&ma(t,g[n],{onOpen:s=>ls(t,s),emptyLabel:m(t,"code_dock_partials_empty"),openLabel:s=>m(t,"component_open_named",{name:s}),sectionValues:()=>is(t),isLocked:()=>ht(),setHover:(s,r)=>a.htmlPartialUi?.setHover(s,r)});Ra(t,g.html,{onRename:n=>Rl(t,n),isLocked:()=>ht(),setHover:(n,s)=>a.htmlClassTokenUi?.setHover(n,s),title:m(t,"code_dock_css_rename_class")})}return o}function Ls(t){return de||(de=id(t).finally(()=>{de=null})),de}async function vn(t,e){const o=await Ls(t);a.lastType=e,a.lastLocked=!0,a.lockReady=!0,a.lastParts={html:"",css:"",js:""},Fe(),Et(t),te(a.lastParts,!0),Vs(t.document,e),R(t.document,m(t,"code_dock_missing")),K(t),Yt(t),it(t),Xt(t,o)}async function ze(t,e,o="replace"){o==="replace"?a.typeStack=[]:o==="push"&&a.lastType&&a.lastType!==e&&a.typeStack.push(a.lastType);const n=++a.loadGen;a.lastType=e,a.lockReady=!1,Fe(),R(t.document,m(t,"code_dock_loading"));let s=()=>{};a.loadInFlight=new Promise(i=>{s=i});const r=await Ls(t);Et(t),K(t),Yt(t),it(t),Fo(t),Gt(t),Xt(t,r),t.fetch(`/!/sve/section-template?type=${encodeURIComponent(e)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async i=>{if(n!==a.loadGen)return;if(i.status===404){vn(t,e);return}if(!i.ok)throw new Error(String(i.status));const l=await i.json();n===a.loadGen&&(a.lastParts={html:typeof l.html=="string"?l.html:"",css:typeof l.css=="string"?l.css:"",js:typeof l.js=="string"?l.js:""},a.lastProps=Array.isArray(l.props)?l.props:[],a.propsDirty=!1,a.lastType=e,a.lastLocked=!!l.locked,a.lockReady=!0,Il(),typeof l.tw=="string"&&l.tw!==""&&Ol(a.lastParts.html,l.tw),Et(t),te(a.lastParts,a.lastLocked),Dn(t),a.lastLocked||ss(t,a.lastParts.html),Vs(t.document,l.path||e),R(t.document,a.lastLocked?m(t,"code_dock_locked"):""),l.writable?.template===!1?R(t.document,m(t,"code_dock_not_writable")):l.writable?.tw===!1&&R(t.document,m(t,"code_dock_tw_not_writable")),es(t),qi(t),bo(t),K(t),Yt(t),it(t),Xt(t,r))}).catch(()=>{n===a.loadGen&&(vn(t,e),R(t.document,m(t,"code_dock_error")))}).finally(()=>{n===a.loadGen&&(a.loadInFlight=null),s()})}function Ct(){return a.lastType||""}function Is(t){return!!t?.getElementById(u)}function ht(){return a.lastLocked}function ld(t,e){const o=typeof e?.html=="string"?e.html.trim():"",n=typeof e?.css=="string"?e.css.trim():"",s=typeof e?.js=="string"?e.js.trim():"";if(!o&&!n&&!s||!t?.document?.getElementById(u))return!1;let r=!1;return o&&(r=cd("html",o)||r),n&&(r=gn("css",n)||r),s&&(r=gn("js",s)||r),r&&nt(t),r}function cd(t,e){const o=g[t];if(!o||o.state.readOnly)return!1;const n=o.state.selection.main,s=n.from>0?o.state.doc.sliceString(n.from-1,n.from):`
`,r=n.to<o.state.doc.length?o.state.doc.sliceString(n.to,n.to+1):`
`,c=`${s===`
`?"":`
`}${e}${r===`
`?"":`
`}`;return o.dispatch({changes:{from:n.from,to:n.to,insert:c},selection:{anchor:n.from+c.length}}),!0}function gn(t,e){const o=g[t];if(!o||o.state.readOnly)return!1;const n=o.state.doc.length,r=`${n>0&&o.state.doc.sliceString(Math.max(0,n-1),n)!==`
`?`

`:n?`
`:""}${e}
`;return o.dispatch({changes:{from:n,insert:r},selection:{anchor:n+r.length}}),!0}function dd(t){if(ve(t),!a.lastType||!t.document.getElementById(u))return;const e=a.lastType;a.lastType=null,ze(t,e,"keep")}function Os(t){bt(t),a.loadGen+=1,Z(t),a.lastUid=null,a.lastType=null,a.typeStack=[],a.lastParts={html:"",css:"",js:""},a.lastLocked=!1,a.lockReady=!1,a.lastBracketNames=null,a.lastCssSelectorNames=null,Fe(),a.lastWin=t?.defaultView||a.lastWin,w(t),Ln(t),rt(t),t?.getElementById(G)?.remove();for(const o of at)g[o]?.destroy(),g[o]=null;t?.getElementById(u)?.remove(),zd(),t&&Po(t,0);const e=t?.defaultView||a.lastWin;e?.document.getElementById(En)&&Mn(e),e&&(es(e),bo(e),Dn(e))}function ud(t){if(a.dragging)return;const e=t.document.getElementById(u);e&&(Oo(t),Xt(t,e))}function fd(t,e,o){if(o){const r=jo(o,e)||jo(o,t.document)||o;return String(typeof Ne=="function"&&(Ne(r,e)||Ne(r,t.document))||"").trim()}const n=typeof Ge=="function"?Ge(t):"page_sections",s=typeof et=="function"?et(t.document):[];for(const r of s){const l=(kt(r.values)||r.values)?.[n];if(Array.isArray(l))for(const c of l){const d=typeof c?.type=="string"?c.type.trim():"";if(d)return d}}return""}function hd(t){const e=/^static-([A-Za-z0-9_-]+)$/.exec(String(t||""));return e?`view:partials/static/${e[1]}`:""}function Ps(t){if((t.Statamic?.$config?.get?.("sveFeatures")||{}).collection_templates!==!0)return"";const o=t.Statamic?.$config?.get?.("sveCollectionTemplatesCollection")||"templates";if(!(t.location?.pathname||"").includes(`/collections/${o}/entries/`))return"";const s=typeof et=="function"?et(t.document):[];for(const r of s){const i=kt(r.values)||r.values,l=typeof i?.view=="string"?i.view.trim():"";if(!l||l.includes(".."))continue;const c=l.replace(/\.(antlers\.html|blade\.php)$/i,"").replace(/^\/+|\/+$/g,"");if(c)return`view:${c}`}return""}function pd(t,e){const o=Hr||Rr;if(o!=="header"&&o!=="footer"||!Pr(e)&&!Dr(e))return"";const s=(kt(zr()?.values)||{})[o==="footer"?"footer_style":"header_style"]||"style_1";return`${o}/${s}`}function md(t){const e=jr(t)||t.getElementById("__sve-global-section-host");return e&&e.querySelector("[data-replicator-set][data-type]")?.getAttribute("data-type")||""}function Ou(t,e,o){if(a.dragging)return;if(!t||!e||Ed(e)||!Ir(t)||!Or(t)){e&&Os(e);return}const n=pd(t,e)||md(e)||fd(t,e,o)||hd(o)||Ps(t)||(o?"":a.lastType),s=!!(o&&o!==a.lastUid);if(a.lastWin=t,o&&(a.lastUid=o),!!n&&!(n===a.lastType&&e.getElementById(u))){if(a.typeStack.length&&a.lastType&&a.lastType!==n){const r=a.typeStack[0];if(n===r&&!s)return;a.typeStack=[]}Z(e),ze(t,n,"replace")}}xe("tw:changed",()=>{a.lastWin&&a.styleMode==="tw"&&O(a.lastWin)});E("dock:is-open",t=>Is(t));E("dock:is-locked",()=>ht());E("dock:html",()=>It());E("dock:reveal-html",({from:t,to:e,caret:o}={})=>{const n=g.html;if(!n||t==null)return;a.htmlScopePref=Zt(a.lastWin),Ae(),ct();const s=a.htmlFull.length,r=Math.max(0,Math.min(t,s)),i=Math.max(r,Math.min(e??t,s));a.htmlFocus=i>r?{from:r,to:i}:null;const l=o==null?null:Math.max(0,Math.min(o,s));if(a.htmlScopePref&&a.htmlFocus){$o(l),K(a.lastWin);return}if(a.htmlScopeActive){Co(!0,l),K(a.lastWin);return}n.dispatch({selection:l==null?{anchor:r,head:i}:{anchor:l},scrollIntoView:!0}),n.focus()});E("dock:insert-snippet",({win:t,parts:e})=>ld(t,e));E("dock:refresh",t=>dd(t));E("dock:tw-follow",()=>{a.lastWin&&se(a.lastWin)});E("dock:css",()=>(ct(),a.cssFull));E("dock:set-css",t=>typeof t!="string"||ht()||!g.css||!a.lastWin?!1:(ct(),a.cssFull=t,Ee("css",gs()),nt(a.lastWin),!0));E("dock:data-menu",({anchor:t,onPick:e,at:o}={})=>!t||!a.lastWin?!1:(bt(a.lastWin.document),w(a.lastWin.document),Ds(a.lastWin,t,e,o),!0));E("dock:props",()=>a.lastProps.map(t=>({...t})));E("dock:set-props",({win:t,props:e}={})=>!Array.isArray(e)||ht()?!1:(a.lastProps=e,a.propsDirty=!0,va(re(Ct())),Z((t||a.lastWin)?.document),!0));function re(t){const e=/^view:partials\/(components\/[A-Za-z0-9_-]+)$/.exec(String(t||""));return e?e[1]:""}E("dock:component-src",()=>re(Ct()));E("dock:type-stack",()=>a.typeStack.map(t=>({type:t,src:re(t)})));E("dock:component-exit-state",()=>{const t=re(Ct());return{open:!!t,name:t?t.split("/").pop():"",back:a.typeStack.length>0}});E("dock:exit-component",(t=1)=>{if(!a.lastWin||!re(Ct()))return!1;if(a.typeStack.length){for(let e=Number(t)||1;e>1&&a.typeStack.length>1;e-=1)a.typeStack.pop();cs(a.lastWin)}else Os(a.lastWin.document);return!0});E("dock:current-type",()=>Ct());E("dock:current-uid",()=>a.lastUid);E("dock:save-settled",()=>a.saveInFlight||null);E("dock:load-settled",()=>a.loadInFlight||null);E("dock:reset-data-vars",t=>(li(typeof t=="string"&&t?t:void 0),!0));E("dock:refresh-preview",()=>a.lastWin?(ve(a.lastWin),!0):!1);E("dock:open-template",t=>typeof t!="string"||!t||!a.lastWin?!1:(ls(a.lastWin,t),!0));E("dock:set-html",t=>{if(typeof t!="string"||ht())return!1;const e=g.html;if(!e||!a.lastWin)return!1;if(t===""){a.saveTimer&&(clearTimeout(a.saveTimer),a.saveTimer=null),a.twDirty=!1,a.twCss=null,a.twKey="",a.lastType=null,a.lastUid=null,a.lastParts={html:"",css:"",js:""},a.cssFull="",a.htmlFull="",a.applying=!0;try{Fe();for(const s of at){const r=g[s];if(!r)continue;const i=r.state.doc.toString();i!==""&&r.dispatch({changes:{from:0,to:i.length,insert:""}})}}finally{a.applying=!1}return!0}const o=a.htmlFull;if(a.htmlFull=t,a.htmlScopeActive)return a.htmlFocus=vd(a.htmlFocus,o,t),Be(fs()),nt(a.lastWin),fo("dock:html-changed"),!0;const n=e.state.doc.toString();if(n!==t){const[s,r,i]=as(n,t);e.dispatch({changes:{from:s,to:r,insert:i}})}return!0});E("dock:show-empty",()=>xt("dock:set-html",""));xe("row:removed",({parentPath:t,remaining:e,win:o})=>{e===0&&t===Ge(o)&&xt("dock:show-empty")});function vd(t,e,o){const n=o.length-e.length;if(!t||!n)return t;let s=0;for(;s<e.length&&s<o.length&&e[s]===o[s];)s+=1;return s>=t.to?t:s<t.from?{from:Math.max(0,t.from+n),to:Math.max(0,t.to+n)}:{from:t.from,to:Math.max(t.from,t.to+n)}}const I="__sve-data-menu";let so=null;function bt(t){const e=t?.getElementById(I);so?.(),so=null,e?._sveApp?.unmount(),e?.remove(),t?.querySelector("[data-sve-data-vars][data-open]")?.removeAttribute("data-open")}function gd(t){if(!Ps(t))return{view:"",kind:""};const e=typeof et=="function"?et(t.document):[];for(const o of e){const n=kt(o.values)||o.values,s=typeof n?.source_collection=="string"?n.source_collection.trim():"";if(s)return{view:s,kind:String(n?.kind||"").trim()}}return{view:"",kind:""}}function yd(t,e){const o=It();if(Number.isFinite(e))return qo(o,e);const n=g.html;if(!n)return[];const s=a.htmlScopeActive&&a.htmlFocus?a.htmlFocus.from:0;return qo(o,s+n.state.selection.main.from)}function bd(t,e){const{view:o,kind:n}=gd(t);return{collection:ni(t)||"",set:si(Ct()),view:o,kind:n,scope:ri(yd(t,e))}}function xd(t){const e=typeof et=="function"?et(t.document):[];for(const o of e){const n=kt(o.values)||o.values;if(n&&typeof n=="object")return n}return null}function kd(t,e){return{scope:e?.scope?.groups||[],section:Zn(e?.section||[],is(t)),page:ui(e?.page||[],xd(t)),site:e?.site||[]}}function Sd(t,e){const o=fi(t,e),n=g.html;if(!o||!n||n.state.readOnly)return;const s=n.state.selection.main,r=n.state.doc.lineAt(s.from),i=lt(r.text),l=po(o.text,i);n.dispatch({changes:{from:s.from,to:s.to,insert:l},selection:{anchor:s.from+o.cursor+(o.text.includes(`
`)?i.length:0)}}),q()}function Ve(t,e,o){const n=e.getBoundingClientRect(),s=8,r=o.offsetWidth||368,i=o.offsetHeight||240,l=t.innerHeight-n.bottom-s,c=n.top-s,d=l>=i||l>=c?n.bottom+4:n.top-i-4;o.style.left=`${Math.max(s,Math.min(n.left,t.innerWidth-r-s))}px`,o.style.top=`${Math.max(s,Math.min(d,t.innerHeight-i-s))}px`}function Ds(t,e,o,n){const s=t.document;bt(s),e.setAttribute("data-open","");const r=s.createElement("div");r.id=I,s.body.appendChild(r);const i=bd(t,n),l=p=>[p?.scope?.groups?.length?{id:"scope",label:p.scope.label||m(t,"data_vars_tab_loop")}:null,{id:"section",label:m(t,"data_vars_tab_section")},{id:"page",label:m(t,"data_vars_tab_page")},{id:"site",label:m(t,"data_vars_tab_site")}].filter(Boolean),c=p=>{s.getElementById(I)&&(r._sveApp?.unmount(),r._sveApp=W(oi,r,{title:m(t,"data_vars_title"),placeholder:m(t,"data_vars_placeholder"),emptyText:m(t,"data_vars_empty"),noSectionText:m(t,"data_vars_no_section"),loopText:m(t,"data_vars_loop"),tabs:l(p),data:kd(t,p),onPick:(x,k)=>o?o(x,k):Sd(x,k)}),Ve(t,e,r))};c(ai(Yn(i))||{scope:null,section:[],page:[],site:[]}),ii(t,i).then(c),Ve(t,e,r);const d=()=>Ve(t,e,r),f=p=>{!r.contains(p.target)&&!e.contains(p.target)&&bt(s)},h=p=>{p.key==="Escape"&&bt(s)};s.addEventListener("pointerdown",f,!0),s.addEventListener("keydown",h,!0),t.addEventListener("scroll",d,!0),t.addEventListener("resize",d),so=()=>{s.removeEventListener("pointerdown",f,!0),s.removeEventListener("keydown",h,!0),t.removeEventListener("scroll",d,!0),t.removeEventListener("resize",d)}}function wd(t,e){const o=e.querySelector("[data-sve-data-vars]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("mousedown",n=>n.preventDefault()),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),t.document.getElementById(I)){bt(t.document);return}w(t.document),Ds(t,o)}))}function _d(t,e){const o=e.querySelector("[data-sve-antlers-tools]");!o||o._sveBound||(o._sveBound=!0,_t(o,Xn,{label:m(t,"code_dock_antlers"),groups:ka.map(n=>({id:n.id,label:m(t,n.lang),items:Sa.filter(s=>s.group===n.id).map(s=>({id:s.id,label:s.label}))})),onPick:n=>$d(n)}))}function $d(t){const e=wa(t),o=g.html;if(!e||!o||o.state.readOnly)return;const n=o.state.selection.main.head,s=o.state.doc.lineAt(n),r=s.text.trim()?lt(s.text):Oe(o,s)||lt(s.text),{text:i,cursor:l}=fe(e.snippet);Bt(po(i,r),l),q()}function Cd(t,e){const o=e.querySelector("[data-sve-visual-edit-tools]");!o||o._sveBound||(o._sveBound=!0,_t(o,Xn,{label:m(t,"code_dock_visual_edit"),groups:hi.map(n=>({id:n.id,label:m(t,n.lang),items:Jn.filter(s=>s.group===n.id).map(s=>({id:s.id,label:s.label}))})),onPick:n=>Ad(n)}))}function Td(t,e,o,n){if(vi(o.inner,n.attr)){t.focus();return}const{text:s,cursor:r}=fe(n.attr);let i=o.closeIdx;for(;i>o.openIdx+2&&/\s/.test(e[i-1]);)i--;t.dispatch({changes:{from:i,to:o.closeIdx,insert:` ${s} `},selection:{anchor:i+1+r}}),q()}function Ad(t){const e=pi(t),o=g.html;if(!e||!o||o.state.readOnly)return;const n=o.state.doc.toString(),s=Qt();if(s?.open){const h=mi(n,s.open.from,s.open.to,le);if(h){e.attr?Td(o,n,h,e):(o.dispatch({selection:{anchor:h.openIdx+2+le.length}}),o.focus());return}const p=s.open.from+1+s.name.length,x=e.standalone||`{{ ${le} ${e.attr} }}`,{text:k,cursor:z}=fe(x);o.dispatch({changes:{from:p,to:p,insert:` ${k}`},selection:{anchor:p+1+z}}),q();return}const r=o.state.selection.main.head,i=o.state.doc.lineAt(r),l=i.text.trim()?lt(i.text):Oe(o,i)||lt(i.text),c=e.standalone||`{{ ${le} ${e.attr} }}`,{text:d,cursor:f}=fe(c);Bt(po(d,l),f),q()}function Md(t){return t==="css"?ir():t==="js"?lr():ar({autoCloseTags:!0})}function yn(t){if(t._sveShield)return;t._sveShield=!0;const e=o=>o.stopPropagation();for(const o of["keydown","keypress","keyup","pointerdown","pointerup","mousedown","mouseup","click","focusin"])t.addEventListener(o,e)}function Ed(t){try{return new URLSearchParams(t.defaultView?.location?.search||"").has("sve-panel")}catch{return!1}}function Bd(t){const e=parseInt(Q(t,ur)??"",10);return Number.isFinite(e)&&e>=vr?e:Xd}function Fd(t,e){U(t,ur,String(e))}function zs(t){try{const e=JSON.parse(Q(t,fr)||"null");if(e&&typeof e=="object")return{html:e.html!==!1,css:e.css!==!1,js:e.js===!0,alpine:e.alpine===!0}}catch{}return{html:!0,css:!0,js:!1,alpine:!1}}function Ld(t,e){U(t,fr,JSON.stringify(e))}function Hs(t){try{const e=JSON.parse(Q(t,hr)||"null");if(e&&typeof e=="object"){const o=s=>Number.isFinite(s)&&s>0?s:1,n={};for(const s of wt)n[s]=o(e[s]);return n}}catch{}return Object.fromEntries(wt.map(e=>[e,1]))}function Id(t,e){U(t,hr,JSON.stringify(e))}function Od(t){Ur(t,Gd,`
@keyframes sve-cm-wait { to { transform: rotate(360deg); } }
#${u} {
  /* The tree's seven families, for the marks and the toolbar below. */
  ${Kr("dark")}
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
  ${No("ns")}
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
  ${No("ew")}
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
`)}function Pd(t){const e=t.querySelector(".live-preview-editor");if(!e)return 0;const o=e.getBoundingClientRect();return o.width<40||o.right<40?0:Math.round(o.right)}function Dd(t){let e=0;for(const o of["__sve-section-picker","__sve-outline-panel","__sve-html-tree-panel","__sve-listview-panel","__sve-right-dock","__sve-chrome-designs","__sve-global-section-panel","__sve-ai-panel"]){const n=t.getElementById(o);if(!n||n.hasAttribute("data-sve-chrome-hidden")||n.hasAttribute("data-sve-right-closed")||n.style.display==="none")continue;const s=n.getBoundingClientRect();s.width>40&&s.right>t.documentElement.clientWidth-8&&(e=Math.max(e,Math.round(s.width)))}return e}function Oo(t){const e=t.document;if(a.layoutWin=t,typeof t.ResizeObserver!="function")return;a.layoutObserver||(a.layoutObserver=new t.ResizeObserver(()=>{a.layoutWin&&ud(a.layoutWin)}));const o=e.querySelector(".live-preview-editor"),n=e.getElementById("__sve-right-dock");o!==a.observedEditor&&(a.observedEditor&&a.layoutObserver.unobserve(a.observedEditor),a.observedEditor=o,o&&a.layoutObserver.observe(o)),n!==a.observedRight&&(a.observedRight&&a.layoutObserver.unobserve(a.observedRight),a.observedRight=n,n&&a.layoutObserver.observe(n))}function zd(){a.layoutObserver?.disconnect(),a.layoutObserver=null,a.layoutWin=null,a.observedEditor=null,a.observedRight=null}function Hd(t){a.layoutWatchBound||(a.layoutWatchBound=!0,t.addEventListener("sve-right-dock-change",()=>Oo(t)))}function Po(t,e){const o=t.querySelector(".live-preview-contents");o&&(o.style.paddingBottom=e?`${e}px`:"")}function Do(t){if(!t)return;const e=t.clientHeight,o=t.querySelector("[data-sve-code-bar]"),n=t.querySelector("[data-sve-code-lock-banner]"),s=n&&Rd(t)?.getComputedStyle(n).display!=="none"?n.offsetHeight:0,r=Math.max(64,e-(o?.offsetHeight||0)-s),i=t.querySelector("[data-sve-code-panes]");i&&(i.style.height=`${r}px`,i.style.minHeight="0",i.style.overflow="hidden"),t.querySelectorAll("[data-sve-code-host]").forEach(l=>{const c=l.closest("[data-sve-code-pane]");if(!c||c.style.display==="none")return;let d=0;for(const h of c.children)h!==l&&(d+=h.offsetHeight);const f=Math.max(64,r-d);l.style.height=`${f}px`,l.style.maxHeight=`${f}px`,l.style.minHeight="0",l.style.overflow="auto",jd(l)})}function Rd(t){return t.ownerDocument?.defaultView||a.lastWin}function jd(t){t._sveWheelBound||(t._sveWheelBound=!0,t.addEventListener("wheel",e=>{const o=t.scrollHeight-t.clientHeight,n=t.scrollWidth-t.clientWidth;let s=!1;if(e.deltaY&&o>0){const r=Math.min(o,Math.max(0,t.scrollTop+e.deltaY));r!==t.scrollTop&&(t.scrollTop=r,s=!0)}if(e.deltaX&&n>0){const r=Math.min(n,Math.max(0,t.scrollLeft+e.deltaX));r!==t.scrollLeft&&(t.scrollLeft=r,s=!0)}s&&(e.preventDefault(),e.stopPropagation())},{passive:!1}))}function Rs(){const t=(a.layoutWin||a.lastWin)?.document?.getElementById(u);t&&Do(t);for(const e of at)g[e]?.requestMeasure()}function js(t,e){const o=zs(t),n={};for(const s of wt){const r=e.querySelector(`[data-sve-code-pane-btn="${s}"]`);n[s]=r?r.getAttribute("aria-pressed")==="true":o[s]}return n}function Ns(t,e){for(const n of wt){const s=t.querySelector(`[data-sve-code-pane-btn="${n}"]`),r=t.querySelector(`[data-sve-code-pane="${n}"]`);s&&s.setAttribute("aria-pressed",e[n]?"true":"false"),r&&(r.style.display=e[n]?"flex":"none")}const o=wt.filter(n=>e[n]);t.querySelectorAll("[data-sve-code-split]").forEach(n=>{const s=n.getAttribute("data-sve-code-split-after"),r=o.indexOf(s);n.style.display=r>=0&&r<o.length-1?"block":"none"}),Ws(t.ownerDocument.defaultView,t),Do(t)}function Ws(t,e){const o=Hs(t);for(const n of wt){const s=e.querySelector(`[data-sve-code-pane="${n}"]`);s&&(s.style.flex=`${o[n]} 1 0`)}}function Xt(t,e){if(a.dragging)return;const o=t.document;Xe(o,e);const n=Bd(t),s=Pd(o),r=Dd(o);e.style.left=`${s}px`,e.style.right=`${r}px`,e.style.bottom="0",e.style.height=`${n}px`,Po(o,n),Do(e)}function qs(t,e,o,n){a.dragging=!0,Gr(t,e,o,()=>{a.dragging=!1,n?.()},"data-sve-code-drag-shield")}function Nd(t,e){if(e._sveResizeBound)return;e._sveResizeBound=!0;const o=n=>{if(n.button!==0||n.target.closest('button, a, input, select, textarea, label, [role="button"], [contenteditable], .cm-editor'))return;n.preventDefault();const s=n.clientY,r=e.getBoundingClientRect().height;let i=r;qs(t,"ns-resize",l=>{i=Math.min(Math.max(vr,r+(s-l.clientY)),Math.round(t.innerHeight*.7)),e.style.height=`${i}px`,Po(t.document,i),Rs()},()=>{Fd(t,i),Xt(t,e),t.dispatchEvent(new Event("resize"))})};e.querySelector("[data-sve-code-bar]")?.addEventListener("mousedown",o),e.querySelector("[data-sve-code-grip]")?.addEventListener("mousedown",o)}function Wd(t,e){e._sveSplitBound||(e._sveSplitBound=!0,e.querySelectorAll("[data-sve-code-split]").forEach(o=>{o.addEventListener("mousedown",n=>{if(n.button!==0)return;n.preventDefault(),n.stopPropagation();const s=o.getAttribute("data-sve-code-split-after"),r=wt.filter(z=>js(t,e)[z]),i=r.indexOf(s),l=r[i],c=r[i+1];if(!l||!c)return;const d=e.querySelector(`[data-sve-code-pane="${l}"]`),f=e.querySelector(`[data-sve-code-pane="${c}"]`),h=n.clientX,p=d.getBoundingClientRect().width,x=f.getBoundingClientRect().width,k=p+x;o.setAttribute("data-active",""),qs(t,"col-resize",z=>{const mt=z.clientX-h;let Ht=Math.max(Ue,Math.min(k-Ue,p+mt)),ae=k-Ht;k<Ue*2&&(Ht=p,ae=x);const _=Hs(t);_[l]=Ht,_[c]=ae,Id(t,_),Ws(t,e),Rs()},()=>{o.removeAttribute("data-active")})})}))}function qd(t,e){e._svePaneBound||(e._svePaneBound=!0,e.querySelectorAll("[data-sve-code-pane-btn]").forEach(o=>{o.addEventListener("click",n=>{n.stopPropagation();const s=o.getAttribute("data-sve-code-pane-btn"),r=js(t,e),i={...r,[s]:!r[s]};!i.html&&!i.css&&!i.js&&(i[s]=!0),Ld(t,i),Ns(e,i)})}))}function R(t,e){const o=t.getElementById(u)?.querySelector("[data-sve-code-status]");o&&(o.textContent=e||"")}function Vs(t,e){const o=t.getElementById(u)?.querySelector("[data-sve-code-path]");o&&(o.textContent=e||"",o.title=e||"")}function Yt(t){const e=t?.document?.getElementById(u)?.querySelector("[data-sve-code-back]");e&&(e.hidden=a.typeStack.length===0,e.title=m(t,"code_dock_back"),e.setAttribute("aria-label",e.title),e.innerHTML=Qd)}function bn(t,e){const o=e.querySelector("[data-sve-code-back]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),cs(t)}))}let Y,ro,Us,Ks,Gs,vt,ye,Pt,He,Dt,zt,Xs,Ys,Zs,Js,Qs,tr,er,or,nr,sr,rr,ar,ir,lr,cr,ao,io,dr,Vd,Nt=null,C=null;function Ud(){return Nt||(Nt=Zr().then(t=>{C=t,Y=C.view.EditorView,ro=C.view.keymap,Us=C.view.lineNumbers,Ks=C.view.highlightActiveLine,Gs=C.view.highlightActiveLineGutter,vt=C.state.Compartment,ye=C.state.EditorState,Pt=C.state.StateField,He=C.state.StateEffect,Dt=C.state.RangeSetBuilder,zt=C.view.Decoration,Xs=C.commands.defaultKeymap,Ys=C.commands.indentWithTab,Zs=C.commands.historyKeymap,Js=C.commands.history,Qs=C.autocomplete.autocompletion,tr=C.autocomplete.closeBrackets,er=C.autocomplete.closeBracketsKeymap,or=C.autocomplete.closeCompletion,nr=C.autocomplete.completionKeymap,sr=C.view.hoverTooltip,rr=C.langHtml.htmlLanguage,ar=C.langHtml.html,ir=C.langCss.css,lr=C.langJs.javascript,C.language.HighlightStyle,C.language.syntaxHighlighting,cr=C.language.codeFolding,ao=C.language.foldEffect,io=C.language.unfoldEffect,dr=C.language.foldedRanges,Vd=C.highlight.tags,qt.html=new vt,qt.css=new vt,qt.js=new vt,Vt.html=new vt,Vt.css=new vt,Vt.js=new vt}).catch(t=>{throw Nt=null,t}),Nt)}const Kd="{{ _class }}",u=Xr,Gd="__sve-code-dock-style",G="__sve-code-dock-unlock",ur="sve-code-dock-height",fr="sve-code-dock-panes",hr="sve-code-dock-widths",Re="sve-html-scope-v2",pr="sve-code-dock-autosave",mr="sve-code-dock-style-mode",zo="sve-code-dock-values",Xd=280,vr=120,Ue=140,Yd=250,at=["html","css","js"],wt=["html","css","alpine","js"],Zd='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',Jd='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-1"/></svg>',Qd='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',gr='<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1c0 .966.784 1.75 1.75 1.75h.418A1.74 1.74 0 0 0 4 7.25v1.5c0 .49.201.932.525 1.25c-.324.318-.525.76-.525 1.25v1c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 14 12.25v-1c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1.5c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1A1.75 1.75 0 0 0 12.25 2zm8.5 7.5H8v-3h4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75M7 6.5v3H5.75A.75.75 0 0 1 5 8.75v-1.5a.75.75 0 0 1 .75-.75zm1 4h4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75H8zm-1 0V13H5.75a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-1-5V3h6.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75zm-1 0H3.75A.75.75 0 0 1 3 4.75v-1A.75.75 0 0 1 3.75 3H5z"/></svg>',tu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/><path d="M4.5 11.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/></svg>',eu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 16.3A8.5 8.5 0 1 1 18.3 6.3"/><path d="M21 3.2v5.4h-5.4"/></svg>',ou='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',nu='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',$="__sve-css-menu",yr=["h1","h2","h3","h4","h5","h6"],lo=[{id:"section",title:"section",tag:"section"},{id:"div",title:"div",tag:"div"},{id:"heading",title:"heading",menu:"heading"},{id:"text",title:"text",menu:"text"},{id:"a",title:"link",tag:"a"},{id:"img",title:"image",snippet:'<img src="" alt="">',caret:10},{id:"svg",title:"svg",tag:"svg"},{id:"ul",title:"list",tag:"ul"},{id:"li",title:"list item",tag:"li"},{id:"component",title:"component",menu:"component"},{id:"loop",title:"loop",snippet:`{{ items }}

{{ /items }}
`,caret:3,select:5},{id:"if",title:"if",snippet:`{{ if true }}

{{ /if }}
`,caret:6,select:4}],su=["--size-100","--size-200","--size-300","--size-400","--size-500","--size-600","--size-700","--size-800","--size-900","--gutter"],ru={"tw-text":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 13 5 3l3.5 10M2.7 10h4.6"/><path d="M12.5 3.5v9M11 5l1.5-1.5L14 5M11 11l1.5 1.5L14 11"/></svg>',"tw-leading":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h8.5M6 8h8.5M6 12.5h8.5"/><path d="M2.5 4.5v7M1.4 5.6 2.5 4.5l1.1 1.1M1.4 10.4l1.1 1.1 1.1-1.1"/></svg>',"tw-font":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.2V3h10v1.2M8 3v10M6 13h4"/></svg>',"tw-radius":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 13.5v-6a5 5 0 0 1 5-5h6"/><path d="M13.5 6.5v7h-7" stroke-dasharray="2 2"/></svg>',"tw-gap":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"tw-align":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3.5h12M2 8h8M2 12.5h10"/></svg>',"tw-w":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3.5v9M14 3.5v9"/><path d="M4.5 8h7"/><path d="M6 6.2 4.2 8 6 9.8M10 6.2 11.8 8 10 9.8"/></svg>',"tw-h":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 2h9M3.5 14h9"/><path d="M8 4.5v7"/><path d="M6.2 6 8 4.2 9.8 6M6.2 10 8 11.8 9.8 10"/></svg>',"tw-maxw":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3v10M14.5 3v10"/><path d="M5 8h6"/><path d="M6.6 6.2 4.8 8l1.8 1.8M9.4 6.2 11.2 8l-1.8 1.8"/></svg>',"tw-overflow":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="1.8" y="4.5" width="8.6" height="9.7" rx="1.2"/><path d="M6.5 1.8h7.7v7.7" stroke-linecap="round"/></svg>',"tw-border":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6"/><rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" stroke-width="1" opacity=".45"/></svg>'},au='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="10" width="18" height="11" rx="2"/><rect x="6" y="3" width="9" height="4" rx="1.4" fill="currentColor" stroke="none"/></svg>',iu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.1 12a8.9 8.9 0 1 0 2.8-6.5L3 8"/><path d="M3 3.4V8h4.6"/><path d="M12 7.4V12l3 1.8"/></svg>',lu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>',cu='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></svg>',du='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/><path d="M3 17c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/></svg>',br=[["--gray-50","#fafafa"],["--gray-100","#f5f5f5"],["--gray-200","#e5e5e5"],["--gray-300","#d4d4d4"],["--gray-400","#a3a3a3"],["--gray-500","#737373"],["--gray-600","#525252"],["--gray-700","#404040"],["--gray-800","#262626"],["--gray-900","#171717"],["--gray-950","#0a0a0a"]],xn=t=>[{id:`${t}-all`,icon:"box-all",title:"All sides",css:t,tw:t},{id:`${t}-block`,icon:"box-block",title:"Top and bottom",css:`${t}-block`,tw:`${t}-block`,sep:!0},{id:`${t}-block-start`,icon:"box-block-start",title:"Top",css:`${t}-block-start`,tw:`${t}-top`},{id:`${t}-block-end`,icon:"box-block-end",title:"Bottom",css:`${t}-block-end`,tw:`${t}-bottom`},{id:`${t}-inline`,icon:"box-inline",title:"Left and right",css:`${t}-inline`,tw:`${t}-inline`,sep:!0},{id:`${t}-inline-start`,icon:"box-inline-start",title:"Left",css:`${t}-inline-start`,tw:`${t}-left`},{id:`${t}-inline-end`,icon:"box-inline-end",title:"Right",css:`${t}-inline-end`,tw:`${t}-right`}],uu=[{id:"display-flex",twClass:"flex",icon:"display-flex",title:"Flex",kind:"display",value:"flex",css:"display"},{id:"flex-row",twClass:"flex-row",icon:"flex-row",title:"Direction: row",kind:"flexDir",value:"row",css:"flex-direction",sep:!0},{id:"flex-col",twClass:"flex-col",icon:"flex-col",title:"Direction: column",kind:"flexDir",value:"column",css:"flex-direction"},{id:"justify-start",twClass:"justify-start",icon:"justify-start",title:"Justify: start",css:"justify-content",value:"flex-start",when:"flex",sep:!0},{id:"justify-center",twClass:"justify-center",icon:"justify-center",title:"Justify: center",css:"justify-content",value:"center",when:"flex"},{id:"justify-end",twClass:"justify-end",icon:"justify-end",title:"Justify: end",css:"justify-content",value:"flex-end",when:"flex"},{id:"justify-between",twClass:"justify-between",icon:"justify-between",title:"Justify: between",css:"justify-content",value:"space-between",when:"flex"},{id:"justify-around",twClass:"justify-around",icon:"justify-around",title:"Justify: around",css:"justify-content",value:"space-around",when:"flex"},{id:"align-start",twClass:"items-start",icon:"align-start",title:"Align: start",css:"align-items",value:"flex-start",when:"flex",sep:!0},{id:"align-center",twClass:"items-center",icon:"align-center",title:"Align: center",css:"align-items",value:"center",when:"flex"},{id:"align-end",twClass:"items-end",icon:"align-end",title:"Align: end",css:"align-items",value:"flex-end",when:"flex"},{id:"align-stretch",twClass:"items-stretch",icon:"align-stretch",title:"Align: stretch",css:"align-items",value:"stretch",when:"flex"}],fu=[{id:"gap-all",icon:"gap-all",title:"Both",css:"gap",tw:"gap",menu:"spacing"},{id:"gap-row",icon:"gap-row",title:"Between rows",css:"row-gap",tw:"row-gap",menu:"spacing",sep:!0},{id:"gap-col",icon:"gap-col",title:"Between columns",css:"column-gap",tw:"column-gap",menu:"spacing"}],hu=[{id:"bd-all",icon:"bd-all",title:"All sides",css:"border-color",tw:"border-color",menu:"colors"},{id:"bd-block",icon:"bd-block",title:"Top and bottom",css:"border-block-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-top",icon:"bd-top",title:"Top",css:"border-block-start-color",tw:"border-top-color",menu:"colors"},{id:"bd-bottom",icon:"bd-bottom",title:"Bottom",css:"border-block-end-color",tw:"border-bottom-color",menu:"colors"},{id:"bd-inline",icon:"bd-inline",title:"Left and right",css:"border-inline-color",tw:"border-color",menu:"colors",sep:!0},{id:"bd-left",icon:"bd-left",title:"Left",css:"border-inline-start-color",tw:"border-left-color",menu:"colors"},{id:"bd-right",icon:"bd-right",title:"Right",css:"border-inline-end-color",tw:"border-right-color",menu:"colors"}],pu=[{id:"rd-all",icon:"rd-all",title:"All corners",css:"border-radius",tw:"border-radius",menu:"values"},{id:"rd-tl",icon:"rd-tl",title:"Top left",css:"border-start-start-radius",tw:"border-top-left-radius",menu:"values",sep:!0},{id:"rd-tr",icon:"rd-tr",title:"Top right",css:"border-start-end-radius",tw:"border-top-right-radius",menu:"values"},{id:"rd-br",icon:"rd-br",title:"Bottom right",css:"border-end-end-radius",tw:"border-bottom-right-radius",menu:"values"},{id:"rd-bl",icon:"rd-bl",title:"Bottom left",css:"border-end-start-radius",tw:"border-bottom-left-radius",menu:"values"}],xr=[{id:"display",title:"Display",css:"display",tw:"display",kids:uu},{id:"absolute",title:"Position",css:"position",tw:"position",value:"absolute"},{id:"color",title:"Text color",css:"color",tw:"color",menu:"colors"},{id:"bg",title:"Background color",css:"background-color",tw:"background-color",menu:"colors"},{id:"padding",title:"Padding",css:"padding",tw:"padding",kids:xn("padding")},{id:"margin",title:"Margin",css:"margin",tw:"margin",kids:xn("margin")},{id:"tw-text",title:"Font size",css:"font-size",tw:"font-size",menu:"values"},{id:"tw-leading",title:"Line height",css:"line-height",tw:"line-height",menu:"values"},{id:"tw-font",title:"Font family",css:"font-family",tw:"font-family",menu:"values"},{id:"tw-align",title:"Text align",css:"text-align",tw:"text-align",menu:"choices",choices:["left","center","right","justify"]},{id:"tw-border",title:"Border color",css:"border-color",tw:"border-color",kids:hu},{id:"tw-radius",title:"Radius",css:"border-radius",tw:"border-radius",kids:pu},{id:"tw-gap",title:"Gap",css:"gap",tw:"gap",kids:fu},{id:"tw-w",title:"Width",css:"width",tw:"width",menu:"sizes"},{id:"tw-h",title:"Height",css:"height",tw:"height",menu:"sizes"},{id:"tw-maxw",title:"Max width",css:"max-width",tw:"max-width",menu:"sizes"},{id:"tw-overflow",title:"Overflow",css:"overflow",tw:"overflow",menu:"choices",choices:["visible","hidden","clip","auto","scroll"]}],mu=["100%","auto","fit-content","min-content","max-content","100vw","100dvh","0"],be=new Map;for(const t of xr){be.set(t.id,{tool:t,kid:null});for(const e of t.kids||[])be.set(e.id,{tool:t,kid:e})}const kn={display:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2.5" width="13" height="11" rx="1.2"/><path d="M5 6.5h6M5 9.5h4"/></svg>',"display-flex":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="3.4" height="9" rx=".4"/><rect x="6.3" y="3.5" width="3.4" height="9" rx=".4"/><rect x="10.6" y="3.5" width="3.4" height="9" rx=".4"/></svg>',"flex-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12"/><path d="M4.2 5.8 2 8l2.2 2.2"/><path d="M11.8 5.8 14 8l-2.2 2.2"/></svg>',"flex-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v12"/><path d="M5.8 4.2 8 2l2.2 2.2"/><path d="M5.8 11.8 8 14l2.2-2.2"/></svg>',"justify-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="5.4" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4.6" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="8.2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-between":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-around":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"align-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="5.4" width="9" height="2.4" rx=".4"/></svg>',"align-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="4.6" width="9" height="2.4" rx=".4"/><rect x="3.5" y="9" width="9" height="2.4" rx=".4"/></svg>',"align-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="8.2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="11.6" width="9" height="2.4" rx=".4"/></svg>',"align-stretch":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx=".5"/><rect x="9" y="2" width="4" height="12" rx=".5"/></svg>',absolute:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>',color:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.4 11.2 7.4 2.4l4 8.8"/><path d="M4.7 8.4h5.4"/><rect x="1.6" y="12.8" width="12.8" height="2.2" rx=".6" fill="currentColor" stroke="none"/></svg>',bg:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 1.9a6.1 6.1 0 1 0 0 12.2c.85 0 1.35-.55 1.35-1.25 0-.38-.18-.66-.4-.88a1.2 1.2 0 0 1 .85-2.05h1.3A3.5 3.5 0 0 0 14.1 6.1C14.1 3.75 11.4 1.9 8 1.9Z"/><circle cx="4.9" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="8" cy="4.8" r=".95" fill="currentColor" stroke="none"/><circle cx="11.1" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="4.7" cy="9.9" r=".95" fill="currentColor" stroke="none"/></svg>',padding:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/></svg>',margin:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/><path d="M2 2.5h12M2 13.5h12M2.5 2v12M13.5 2v12" stroke-dasharray="1.4 1.2"/></svg>',"box-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".4" fill="currentColor" stroke="none"/></svg>',"box-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"gap-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"gap-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="3" y="1.6" width="10" height="4.2" rx=".6"/><rect x="3" y="10.2" width="10" height="4.2" rx=".6"/><path d="M4.5 8h7"/></svg>',"gap-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"bd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4"/></svg>',"bd-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-top":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-bottom":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-left":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"bd-right":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',"rd-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="3.4"/></svg>',"rd-tl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6H6a3.4 3.4 0 0 0-3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M2.6 9V6A3.4 3.4 0 0 1 6 2.6h3" stroke-width="2.2"/></svg>',"rd-tr":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6h7.4a3.4 3.4 0 0 1 3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M7 2.6h3A3.4 3.4 0 0 1 13.4 6v3" stroke-width="2.2"/></svg>',"rd-br":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6v7.4a3.4 3.4 0 0 1-3.4 3.4H2.6" stroke-width="1" opacity=".35"/><path d="M13.4 7v3a3.4 3.4 0 0 1-3.4 3.4H7" stroke-width="2.2"/></svg>',"rd-bl":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6v7.4a3.4 3.4 0 0 0 3.4 3.4h7.4" stroke-width="1" opacity=".35"/><path d="M2.6 7v3A3.4 3.4 0 0 0 6 13.4h3" stroke-width="2.2"/></svg>'},g={html:null,css:null,js:null},qt={html:null,css:null,js:null},Vt={html:null,css:null,js:null};export{zu as ARMED_KEY,eu as AUTOSAVE_ICON,pr as AUTOSAVE_KEY,Qd as BACK_ICON,nu as CSS_ADD_ICON,br as CSS_GRAYS,mu as CSS_LENGTHS,$ as CSS_MENU_ID,lu as CSS_MODE_ICON,Lo as CSS_SIZE_KEY,su as CSS_SPACING,Io as CSS_STATES,no as CSS_STATE_KEY,xr as CSS_TOOLS,kn as CSS_TOOL_ICONS,be as CSS_TOOL_INDEX,tu as DATA_ICON,I as DATA_MENU_ID,Xd as DEFAULT_HEIGHT,u as DOCK_ID,zt as Decoration,ye as EditorState,Y as EditorView,at as HANDLES,ur as HEIGHT_KEY,iu as HISTORY_ICON,yr as HTML_HEADINGS,lo as HTML_TOOLS,cu as ID_MODE_ICON,Zd as LOCK_CLOSED_ICON,Jd as LOCK_OPEN_ICON,vr as MIN_HEIGHT,Ue as MIN_PANE,wt as PANES,fr as PANES_KEY,Dt as RangeSetBuilder,ou as SAVE_ICON,Yd as SAVE_MS,Kd as SCOPE_CLASS,gr as SCOPE_ICON,Re as SCOPE_KEY,au as STRIP_ICON,Gd as STYLE_ID,mr as STYLE_MODE_KEY,He as StateEffect,Pt as StateField,du as TW_MODE_ICON,ru as TW_TOOL_ICONS,G as UNLOCK_ID,zo as VALUES_MODE_KEY,hr as WIDTHS_KEY,oe as applyCssFolds,Jt as applyCssScope,sc as applyDisplay,nc as applyFlexDirection,vs as applyHtmlTag,J as applyRuleDecls,Fs as applyStyleMode,Qs as autocompletion,So as autosaveEnabled,_d as bindAntlersSnippets,en as bindAutosave,bn as bindBack,Zl as bindCssAddClass,nd as bindCssTools,wd as bindDataVars,Jc as bindHistory,on as bindHtmlScope,rd as bindHtmlTidy,ad as bindHtmlTools,Hd as bindLayoutWatch,tn as bindLock,qd as bindPaneToggles,Nd as bindResize,Wd as bindSplitters,Zc as bindStrip,od as bindStyleMode,Cd as bindVisualEditSnippets,Fe as clearHtmlScopeRange,tr as closeBrackets,er as closeBracketsKeymap,Os as closeCodeDock,Lu as closeCodeDockPopups,or as closeCompletion,w as closeCssMenu,bt as closeDataMenu,C as cm,Iu as codeDockStyleMode,cr as codeFolding,Ps as collectionViewType,nr as completionKeymap,ir as css,gs as cssEditorText,Ie as cssRuleAtCursor,As as cssSizeRow,pt as cssSizeRows,De as cssStateSuffix,tt as currentFlexDecls,It as currentFullHtml,is as currentSectionValues,Ct as currentTemplateType,Xs as defaultKeymap,gt as dispatchHtmlChanges,Vt as editableOf,g as editors,Od as ensureStyle,ss as ensureTwCss,Bs as enterValuesRule,q as finishHtmlEdit,Dl as flushBracketSync,ct as flushCssScope,zl as flushCssToHtml,Z as flushSave,ao as foldEffect,dr as foldedRanges,cs as goBackTemplate,Ks as highlightActiveLine,Gs as highlightActiveLineGutter,Js as history,Zs as historyKeymap,sr as hoverTooltip,ar as html,fs as htmlEditorText,Qt as htmlElementAtCursor,Te as htmlFocusOk,rr as htmlLanguage,Zt as htmlScopeEnabled,$t as htmlTargetFromCursor,Oe as indentFromPrevious,Ys as indentWithTab,ld as insertAiSnippet,Bt as insertHtmlSnippet,Or as isCodeDockArmed,ht as isCodeDockLocked,Is as isCodeDockOpen,Ed as isPanelFrame,lr as javascript,ro as keymap,Md as languageOf,yt as leadingCssIndent,lt as lineIndentOf,Us as lineNumbers,Ud as loadCm,ze as loadTemplate,jc as mountEditor,Ms as newSizeBlockSpot,oo as newSizeQuery,D as normalizeFlexValue,Oo as observeDockLayout,nt as onEditorInput,lc as openCssChoiceMenu,ic as openCssColorMenu,cc as openCssSpacingMenu,dn as openCssValueMenu,Ds as openDataVarsMenu,Gl as openHtmlComponentMenu,an as openHtmlTagMenu,ls as openNestedTemplate,Rl as openRenameClassMenu,Pe as paintAlpine,it as paintAutosave,Yt as paintBack,ne as paintCssHead,Eo as paintCssIdMark,O as paintCssToolState,Nc as paintHostWait,K as paintHtmlScope,Le as paintHtmlToolState,Et as paintLock,Ns as paintPaneButtons,Gt as paintStrip,Fo as paintStyleMode,Bo as paintValuesMode,N as placeCssMenu,Xt as placeDock,Po as previewBottomPad,Ol as primeTailwindCompile,qt as readOnlyOf,To as readParts,dd as refreshCodeDockFromDisk,ve as refreshPreview,ud as relayoutCodeDock,Me as rememberBracketNames,Ot as rememberCssSelectors,Il as resetTailwindCompile,Ao as sameParts,Hu as setCodeDockArmed,Vs as setPath,R as setStatus,td as setValuesMode,yn as shieldDock,Co as showHtmlFull,$o as showHtmlScope,zd as stopObservingDockLayout,zs as storedPanes,Ou as syncCodeDock,Ze as syncHtmlTree,Ae as syncScopedHtml,se as syncTwTarget,Vd as tags,Ir as templateDockAllowed,ms as tidyHtmlPane,io as unfoldEffect,Ee as writeHandleEditor,Be as writeHtmlEditor,te as writeParts};
