const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-B9daJWrZ.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{r as Ee,_ as V,u as d,o as u,c as p,a as I,t as x,F as P,e as A,d as C,f as m,w as S,b as Me,K as Se,m as Y,L as Le,M as Ie,N as le,O as Ae,P as De,n as Re,Q as v,S as he,j as f,T as Be,J as je,x as ee,s as y,h as ze,B as me,i as te,R as Oe,C as Ke,U as Ne,E as Ze,G as qe,V as Fe}from"./addon-DbCiN9AL.js";import{i as ge,t as Ve,c as Ue,p as Xe,f as Ye,a as We}from"./tw-overlay-DoYf6-BS.js";import{a as Je}from"./html-pick-align-BQgDq65Q.js";const s=Ee({emptyText:"",rows:[],editingId:null,draft:"",renameTitle:"",hideTitle:"",showTitle:"",duplicateTitle:"",deleteTitle:"",canEdit:!1,dragging:!1,dropId:null,dropPlace:null,onSelect:null,onTwist:null,tagTitle:"",onTagChange:null,onRename:null,onRenameCommit:null,onRenameCancel:null,onHide:null,onDuplicate:null,onDelete:null,onPointerDown:null,onContext:null,inspect:null,onInspectCommit:null,onLoopKind:null,onAddBranch:null}),Ge={key:0,class:"sve-ht-inspect"},Qe={class:"sve-ht-inspect__head"},et={key:0,class:"sve-ht-inspect__note"},tt={key:0,class:"sve-ht-inspect__seg"},nt=["data-active","disabled","onClick"],ot=["value","disabled"],rt={key:0,value:""},it=["value"],st=["value","placeholder","disabled","onKeydown"],lt={key:3,class:"sve-ht-inspect__add"},at=["disabled","onClick"],ct={__name:"HtmlTreeInspector",setup(e){function t(o){s.onInspectCommit?.(o.target.value)}return(o,n)=>d(s).inspect?(u(),p("div",Ge,[I("div",Qe,x(d(s).inspect.title),1),d(s).inspect.mode==="note"?(u(),p("div",et,x(d(s).inspect.note),1)):(u(),p(P,{key:1},[d(s).inspect.mode==="loop"?(u(),p("div",tt,[(u(!0),p(P,null,A(d(s).inspect.kinds,r=>(u(),p("button",{key:r.id,type:"button","data-active":r.id===d(s).inspect.loopKind?"":void 0,disabled:!d(s).canEdit,onClick:l=>d(s).onLoopKind?.(r.id)},x(r.label),9,nt))),128))])):C("",!0),d(s).inspect.mode==="loop"&&d(s).inspect.loopKind==="collection"?(u(),p("select",{key:d(s).inspect.key+":select",value:d(s).inspect.value,disabled:!d(s).canEdit,onChange:t},[d(s).inspect.value?C("",!0):(u(),p("option",rt,x(d(s).inspect.placeholder),1)),(u(!0),p(P,null,A(d(s).inspect.collections,r=>(u(),p("option",{key:r.handle,value:r.handle},x(r.title),9,it))),128))],40,ot)):(u(),p("input",{key:d(s).inspect.key,type:"text",value:d(s).inspect.value,placeholder:d(s).inspect.placeholder,disabled:!d(s).canEdit,spellcheck:"false",onKeydown:[n[0]||(n[0]=m(()=>{},["stop"])),S(m(t,["prevent"]),["enter"])],onBlur:t},null,40,st)),d(s).inspect.branches?.length?(u(),p("div",lt,[(u(!0),p(P,null,A(d(s).inspect.branches,r=>(u(),p("button",{key:r.id,type:"button",disabled:!d(s).canEdit,onClick:l=>d(s).onAddBranch?.(r.id)},x(r.label),9,at))),128))])):C("",!0)],64))])):C("",!0)}},dt=V(ct,[["__scopeId","data-v-2e1b20d6"]]),ut={class:"sve-html-tree"},pt={class:"sve-pane-bar","data-sve-pane-bar":""},ft={"data-sve-right-title":""},ht={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){return(t,o)=>(u(),p("div",ut,[I("div",pt,[I("div",ft,x(e.title),1),o[0]||(o[0]=Me('<div data-sve-right-actions data-v-0bfee450><button type="button" data-sve-right-pin aria-pressed="false" data-v-0bfee450></button><button type="button" data-sve-close aria-label="Close" data-v-0bfee450><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-0bfee450><path d="M18 6 6 18" data-v-0bfee450></path><path d="m6 6 12 12" data-v-0bfee450></path></svg></button></div>',1))]),o[1]||(o[1]=I("div",{"data-sve-html-tree-list":""},null,-1)),Se(dt)]))}},ve=V(ht,[["__scopeId","data-v-0bfee450"]]),mt={key:0,class:"sve-ht-empty"},gt=["title","onClick","onDblclick","onKeydown","onPointerdown","onContextmenu"],vt=["onClick"],kt={key:1,"data-sve-ht-letter":""},yt=["innerHTML"],xt=["title"],bt=["title","onClick"],_t={key:1,"data-sve-ht-kind":""},Tt={key:3,"data-sve-ht-name":""},Ct={key:3,"data-sve-ht-actions":""},$t=["title","innerHTML","onClick"],Ht=["title","onClick"],Pt=["title","onClick"],wt='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',Et='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Mt='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',St='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',Lt='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',It={__name:"HtmlTreeList",setup(e){function t(r){return r.kind==="component"?r.src?`partial:${r.src}`:r.tag:r.name?`${r.tag} ${r.name}`:r.tag}function o(r){const l={"data-sve-ht-id":r.id};return r.current&&(l["data-sve-ht-current"]=""),r.hidden&&(l["data-sve-ht-hidden"]=""),s.dropId===r.id&&s.dropPlace&&(l["data-sve-ht-drop"]=s.dropPlace),l}function n(r){return!r.hidden||r.wrapFrom!=null}return(r,l)=>(u(),p("div",Y({class:"sve-ht-root"},d(s).dragging?{"data-sve-ht-dragging":""}:{}),[d(s).rows.length?C("",!0):(u(),p("div",mt,x(d(s).emptyText),1)),(u(!0),p(P,null,A(d(s).rows,i=>(u(),p("div",Y({key:i.id,"data-sve-ht-row":""},{ref_for:!0},o(i),{role:"button",tabindex:"0",title:t(i),style:{marginLeft:i.depth*12+"px"},onClick:a=>d(s).onSelect?.(i.id),onDblclick:m(a=>d(s).onRename?.(i.id),["prevent"]),onKeydown:[S(m(a=>d(s).onSelect?.(i.id),["prevent"]),["enter"]),S(m(a=>d(s).onSelect?.(i.id),["prevent"]),["space"])],onPointerdown:a=>d(s).onPointerDown?.(a,i.id),onContextmenu:m(a=>d(s).onContext?.(a,i.id),["prevent","stop"])}),[i.hasChildren?(u(),p("button",Y({key:0,type:"button","data-sve-ht-twist":""},{ref_for:!0},i.shut?{"data-sve-ht-shut":""}:{},{innerHTML:wt,onClick:m(a=>d(s).onTwist?.(i.id),["stop","prevent"]),onPointerdown:l[0]||(l[0]=m(()=>{},["stop"])),onDblclick:l[1]||(l[1]=m(()=>{},["stop"]))}),null,16,vt)):C("",!0),i.letter?(u(),p("span",kt,x(i.letter),1)):(u(),p("span",{key:2,"data-sve-ht-icon":"",innerHTML:i.svg},null,8,yt)),I("span",{"data-sve-ht-text":"",title:d(s).renameTitle},[i.kind!=="component"?(u(),p("button",{key:0,type:"button","data-sve-ht-tag":"",title:d(s).tagTitle,onClick:m(a=>d(s).onTagChange?.(a,i.id),["stop","prevent"]),onPointerdown:l[2]||(l[2]=m(()=>{},["stop"])),onDblclick:l[3]||(l[3]=m(()=>{},["stop"]))},x(i.tag),41,bt)):(u(),p("span",_t,x(i.tag),1)),d(s).editingId===i.id?Le((u(),p("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":l[4]||(l[4]=a=>d(s).draft=a),onMousedown:l[5]||(l[5]=m(()=>{},["stop"])),onPointerdown:l[6]||(l[6]=m(()=>{},["stop"])),onClick:l[7]||(l[7]=m(()=>{},["stop"])),onDblclick:l[8]||(l[8]=m(()=>{},["stop"])),onKeydown:[l[9]||(l[9]=m(()=>{},["stop"])),l[10]||(l[10]=S(m(a=>d(s).onRenameCommit?.(),["prevent"]),["enter"])),l[11]||(l[11]=S(m(a=>d(s).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:l[12]||(l[12]=a=>d(s).onRenameCommit?.())},null,544)),[[Ie,d(s).draft]]):(u(),p("span",Tt,x(i.name),1))],8,xt),d(s).canEdit?(u(),p("span",Ct,[d(s).canEdit&&n(i)?(u(),p("button",{key:0,type:"button","data-sve-ht-eye":"",title:i.hidden?d(s).showTitle:d(s).hideTitle,innerHTML:i.hidden?Mt:Et,onClick:m(a=>d(s).onHide?.(i.id),["stop","prevent"]),onPointerdown:l[13]||(l[13]=m(()=>{},["stop"])),onDblclick:l[14]||(l[14]=m(()=>{},["stop"]))},null,40,$t)):C("",!0),d(s).canEdit?(u(),p("button",{key:1,type:"button","data-sve-ht-dup":"",title:d(s).duplicateTitle,innerHTML:St,onClick:m(a=>d(s).onDuplicate?.(i.id),["stop","prevent"]),onPointerdown:l[15]||(l[15]=m(()=>{},["stop"])),onDblclick:l[16]||(l[16]=m(()=>{},["stop"]))},null,40,Ht)):C("",!0),d(s).canEdit?(u(),p("button",{key:2,type:"button","data-sve-ht-del":"",title:d(s).deleteTitle,innerHTML:Lt,onClick:m(a=>d(s).onDelete?.(i.id),["stop","prevent"]),onPointerdown:l[17]||(l[17]=m(()=>{},["stop"])),onDblclick:l[18]||(l[18]=m(()=>{},["stop"]))},null,40,Pt)):C("",!0)])):C("",!0)],16,gt))),128))],16))}},At=V(It,[["__scopeId","data-v-e030b125"]]);function J(e,t){for(const o of e||[]){if(o.id===t)return o;const n=J(o.children,t);if(n)return n}return null}function ke(e,t){return(e.children||[]).some(o=>o.id===t||ke(o,t))}function w(e,t){let o=t.wrapFrom??t.from,n=t.wrapTo??t.to;return o>0&&e[o-1]===`
`&&(o-=1),{from:o,to:n}}function Dt(e,t){const o=e.slice(t.from,t.to);if(t.kind==="antlers"){const l=o.match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return l?t.from+l.index:t.to}const n=`</${t.tag}`,r=o.toLowerCase().lastIndexOf(n);return r===-1?t.to:t.from+r}function W(e,t,o){return e>=t+o?e-o:e>t?t:e}function Rt(e,t,o,n,r){const l=J(t,o),i=J(t,n);if(!e||!l||!i||o===n||ke(l,n))return e;let a=r;a==="inside"&&(ge(i.tag)||i.wrapFrom!=null)&&(a="after");const h=w(e,l),c=e.slice(h.from,h.to);if(!c)return e;const g=e.slice(0,h.from)+e.slice(h.to),b=h.to-h.from;let k;a==="before"?k=W(w(e,i).from,h.from,b):a==="inside"?k=W(Dt(e,i),h.from,b):k=W(w(e,i).to,h.from,b),k=Math.max(0,Math.min(k,g.length));let _=c;return k>0&&g[k-1]!==`
`&&_[0]!==`
`&&(_=`
${_}`),g.slice(0,k)+_+g.slice(k)}function Bt(e,t){if(!e||!t)return e;if(t.wrapFrom!=null&&t.wrapTo!=null){const o=e.slice(t.wrapFrom+4,t.wrapTo-3);return e.slice(0,t.wrapFrom)+o+e.slice(t.wrapTo)}return t.hidden?e:`${e.slice(0,t.from)}<!--${e.slice(t.from,t.to)}-->${e.slice(t.to)}`}function jt(e,t,o){const n=e/Math.max(t,1);return o&&n>.32&&n<.68?"inside":n<.5?"before":"after"}function zt(e,t){if(!e||!t)return e;const{from:o,to:n}=w(e,t);let r=e.slice(o,n);return r?(r.startsWith(`
`)||(r=`
${r}`),e.slice(0,n)+r+e.slice(n)):e}function Ot(e,t){if(!e||!t)return e;const{from:o,to:n}=w(e,t);return e.slice(0,o)+e.slice(n)}const ye="sve-html-tree-labels";function xe(){try{const e=globalThis.localStorage?.getItem(ye);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function Kt(e){try{globalThis.localStorage?.setItem(ye,JSON.stringify(e))}catch{}}function be(e){return String(e||"_")}function Nt(e){const t=xe()[be(e)];return t&&typeof t=="object"?{...t}:{}}function Zt(e,t,o){const n=o?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function qt(e,t,o,n){if(!t)return;const r=be(e),l=xe(),i={...l[r]||{}},a=String(o||"").replace(/\s+/g," ").trim(),h=String(n||"").trim();!a||a===h?delete i[t]:i[t]=a,Object.keys(i).length?l[r]=i:delete l[r],Kt(l)}const T={div:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><rect x="2.5" y="3.5" width="11" height="9" rx="1.2" stroke-dasharray="2.6 2"/></svg>',section:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="2" y="2.5" width="12" height="11" rx="1.4"/><path d="M2 6.2h12" stroke-width="2.2"/></svg>',ul:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="4" r="1"/><circle cx="3.2" cy="8" r="1"/><circle cx="3.2" cy="12" r="1"/><rect x="5.5" y="3.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="7.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="11.2" width="8" height="1.5" rx=".4"/></svg>',li:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="8" r="1.1"/><rect x="5.5" y="7.2" width="8" height="1.6" rx=".4"/></svg>',a:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M6.2 8.8 4.8 10.2a2.2 2.2 0 0 0 3.1 3.1l1.8-1.8"/><path d="M9.8 7.2l1.4-1.4a2.2 2.2 0 0 0-3.1-3.1L6.3 4.5"/></svg>',img:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="3" width="12" height="10" rx="1.2"/><circle cx="5.5" cy="6.2" r="1.1"/><path d="M2.8 12.2 6.2 9l2.2 2.2 2-1.8 2.8 2.8"/></svg>',if:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4.6 2.8v10.4"/><path d="M2.4 11l2.2 2.2L6.8 11"/><path d="M11.4 13.2V2.8"/><path d="M9.2 5 11.4 2.8 13.6 5"/></svg>',loop:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M8 8s-1.3-2.4-3-2.4a2.4 2.4 0 0 0 0 4.8C6.7 10.4 8 8 8 8Z"/><path d="M8 8s1.3 2.4 3 2.4a2.4 2.4 0 0 0 0-4.8C9.3 5.6 8 8 8 8Z"/></svg>',component:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M8 1.6 13.4 4.8v6.4L8 14.4 2.6 11.2V4.8Z"/><path d="M2.6 4.8 8 8l5.4-3.2M8 8v6.4"/></svg>',other:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M5.2 3.5 2.8 8l2.4 4.5"/><path d="M10.8 3.5 13.2 8l-2.4 4.5"/></svg>'};function Ft(e,t,o){return t==="component"?{svg:T.component}:t==="antlers"?{svg:o==="loop"?T.loop:T.if}:/^h[1-6]$/.test(e)?{letter:"H"}:e==="p"?{letter:"P"}:e==="div"?{svg:T.div}:e==="section"||e==="article"||e==="header"||e==="footer"||e==="main"||e==="nav"||e==="aside"?{svg:T.section}:e==="ul"||e==="ol"?{svg:T.ul}:e==="li"?{svg:T.li}:e==="a"?{svg:T.a}:e==="img"||e==="picture"||e==="svg"?{svg:T.img}:{svg:T.other}}const Vt=["disabled","onClick"],Ut={__name:"HtmlTreeMenu",props:{items:{type:Array,required:!0},x:{type:Number,required:!0},y:{type:Number,required:!0},onClose:{type:Function,required:!0}},setup(e){const t=e,o=le(null),n=le({left:`${t.x}px`,top:`${t.y}px`});function r(i){o.value?.contains(i.target)||t.onClose()}function l(i){i.key==="Escape"&&t.onClose()}return Ae(()=>{const i=o.value?.getBoundingClientRect();if(i){const a=Math.min(t.x,window.innerWidth-i.width-8),h=Math.min(t.y,window.innerHeight-i.height-8);n.value={left:`${Math.max(8,a)}px`,top:`${Math.max(8,h)}px`}}document.addEventListener("pointerdown",r,!0),document.addEventListener("keydown",l,!0),window.addEventListener("scroll",t.onClose,!0)}),De(()=>{document.removeEventListener("pointerdown",r,!0),document.removeEventListener("keydown",l,!0),window.removeEventListener("scroll",t.onClose,!0)}),(i,a)=>(u(),p("div",{ref_key:"menu",ref:o,class:"sve-ht-menu",style:Re(n.value)},[(u(!0),p(P,null,A(e.items,h=>(u(),p("button",{key:h.label,type:"button",disabled:!h.onPick,onClick:c=>h.onPick?.()},x(h.label),9,Vt))),128))],4))}},Xt=V(Ut,[["__scopeId","data-v-7e205566"]]),Yt=/^@(media|supports|container|layer|scope)\b/i;function Wt(e){const t=String(e||""),o=[];let n=0,r=0;for(;n<t.length;){if(t[n]==="{"&&t[n+1]==="{"){const a=t.indexOf("}}",n+2);n=a===-1?t.length:a+2;continue}if(t[n]==="/"&&t[n+1]==="*"){const a=t.indexOf("*/",n+2);n=a===-1?t.length:a+2;continue}if(t[n]==='"'||t[n]==="'"){const a=t[n];for(n+=1;n<t.length&&t[n]!==a;)n+=t[n]==="\\"?2:1;n+=1;continue}if(t[n]!=="{"){n+=1;continue}let l=1,i=n+1;for(;i<t.length&&l>0;){if(t[i]==="{"&&t[i+1]==="{"){const a=t.indexOf("}}",i+2);i=a===-1?t.length:a+2;continue}if(t[i]==="/"&&t[i+1]==="*"){const a=t.indexOf("*/",i+2);i=a===-1?t.length:a+2;continue}if(t[i]==='"'||t[i]==="'"){const a=t[i];for(i+=1;i<t.length&&t[i]!==a;)i+=t[i]==="\\"?2:1;i+=1;continue}t[i]==="{"?l+=1:t[i]==="}"&&(l-=1),i+=1}o.push({selector:t.slice(r,n).trim(),body:t.slice(n+1,i-1),from:r,to:i,text:t.slice(r,i).trim()}),n=i,r=i}return o}function ae(e){const t=String(e||""),o=new Set,n=new Set,r=new Set;for(const l of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const i of l[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))i&&(o.add(i),o.add(i.replace(/([:./%!#()[\],])/g,"\\$1")));for(const l of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))l[2].trim()&&n.add(l[2].trim());for(const l of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))r.add(l[1].toLowerCase());return{classes:o,ids:n,tags:r}}function ce(e,t){const o=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),n=[...o.matchAll(/\.((?:\\.|[\w-])+)/g)].map(i=>i[1]),r=[...o.matchAll(/#((?:\\.|[\w-])+)/g)].map(i=>i[1]);if(n.length||r.length){const i=a=>a.replace(/\\(.)/g,"$1");return n.every(a=>t.classes.has(a)||t.classes.has(i(a)))&&r.every(a=>t.ids.has(i(a)))}const l=[...o.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(i=>i[2].toLowerCase());return l.length>0&&l.every(i=>t.tags.has(i))}function Jt(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function Gt(e,t,o){const n=Jt(e);if(!n.length)return"keep";const r=n.filter(i=>ce(i,t));return r.length?r.length===n.length&&!n.some(i=>ce(i,o))?"move":"copy":"keep"}function _e(e,t,o){const n=String(e||""),r=ae(t),l=ae(o),i=[],a=[];let h=0;for(const c of Wt(n)){const g=n.slice(c.from,c.to),b=g.match(/^\s*/)[0];if(h=c.to,Yt.test(c.selector)){const _=_e(c.body,t,o);_.move.trim()&&i.push(`${c.selector} {
${_.move.trim()}
}`),_.keep.trim()&&a.push(`${b}${c.selector} {
${_.keep.trim()}
}`);continue}const k=c.selector.startsWith("@")?"keep":Gt(c.selector,r,l);if(k==="move"){i.push(c.text);continue}k==="copy"&&i.push(c.text),a.push(g)}return a.push(n.slice(h)),{move:i.join(`

`).trim(),keep:a.join("").replace(/\n{3,}/g,`

`).trim()}}const Qt="/!/sve/component";function en(e){return e.document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")||e.Statamic?.$config?.get?.("csrfToken")||e.Statamic?.$config?.get?.("csrf_token")||""}function tn(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let o=null;for(const n of t){if(!n.trim())continue;const r=n.match(/^[ \t]*/)[0].length;o=o===null?r:Math.min(o,r)}return o?t.map(n=>n.slice(o)).join(`
`):t.join(`
`)}function nn(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function on(e,t){if(!Ve(e))return"";try{return await(await je(()=>import("./tw-compile-B9daJWrZ.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(o){return console.error("[sve] component tailwind compile",o),""}}async function rn(e,t){const o=await e.fetch(Qt,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":en(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!o.ok){const n=new Error(String(o.status));throw n.status=o.status,n}return o.json()}function de(e,t){const{from:o,to:n}=w(e,t),r=e.slice(o,n);if(!r.trim())return null;const l=e.slice(0,o)+e.slice(n),i=v("dock:css"),a=_e(typeof i=="string"?i:"",r,l);return{html:tn(r),css:a.move,keepCss:a.keep,lead:nn(r),from:o,to:n}}function sn(e,t,{onDone:o,onError:n}={}){if(v("dock:is-locked")===!0)return;const r=v("dock:html");if(typeof r!="string"||!t)return;const l=de(r,t);if(!l)return;const i=he(e.document,Be,{heading:f(e,"component_new"),nameLabel:f(e,"component_name"),placeholder:f(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:f(e,"cancel"),saveLabel:f(e,"component_create"),onOk:a=>{i.dismiss(),(async()=>{try{const h=await on(e,l.html),c=v("dock:html"),g=typeof c=="string"&&c===r?l:de(c,t);if(!g)return;const b=await rn(e,{name:a,html:g.html,css:g.css,js:"",tw:h}),k=v("dock:html"),_=k.slice(0,g.from)+g.lead+b.tag+k.slice(g.to);v("dock:set-html",_),g.css.trim()&&v("dock:set-css",g.keepCss),o?.(b)}catch(h){n?.(h)}})()}})}function ln(e,t,o){const n=String(e||"");if(!t||t.kind!=="antlers")return n;const r=String(o||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?cn(n,t,r):t.tag==="else"||!r?n:n.slice(0,t.from)+`{{ ${t.tag} ${r} }}`+n.slice(t.openTo)}function j(e,t,o,n){const r=String(e||"");if(!t||t.antlers!=="loop")return r;const l=String(n||"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(l))return r;const i=o==="collection"?`collection:${l}`:l,a=o==="collection"?an(t.params):"",h=o==="collection"?"collection":l,c=Te(r,t);return c?r.slice(0,t.from)+`{{ ${i}${a?` ${a}`:""} }}`+r.slice(t.openTo,c.from)+`{{ /${h} }}`+r.slice(c.to):r}function an(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function Te(e,t){const n=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return n?{from:t.from+n.index,to:t.from+n.index+n[0].length}:null}function cn(e,t,o){return j(e,t,t.loopKind==="collection"?"collection":"field",o)}function dn(e,t,o){const n=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return n;const r=Te(n,t);if(!r)return n;const i=(n.slice(0,r.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],a=o==="else"?"{{ else }}":"{{ elseif  }}";return`${n.slice(0,r.from)}${a}
${i}${n.slice(r.from)}`}const B="__sve-html-tree-panel",ue="__sve-html-tree-style",L=new Set;let M=null,z=null,O=0,ne=[],E=null,D=null,K=null,N=null,G=null,Z=!1,R=null;function H(e){return e.getElementById(B)}function un(e){let t=e.getElementById(ue);t||(t=e.createElement("style"),t.id=ue,e.head.appendChild(t)),t.textContent=`
    [data-sve-ht-row] {
      all: unset;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 5px 8px;
      min-height: 28px;
      margin-bottom: 3px;
      background: rgba(128,128,128,.16);
      border-radius: 6px;
      font-size: 11px;
      line-height: 1.3;
      cursor: pointer;
      user-select: none;
      position: relative;
      touch-action: none;
    }
    [data-sve-ht-dragging],
    [data-sve-ht-dragging] * {
      cursor: grabbing !important;
    }
    [data-sve-ht-row]:hover { background: rgba(128,128,128,.26); }
    [data-sve-ht-row]:focus-visible { outline: 2px solid #3858e9; outline-offset: -2px; }
    [data-sve-ht-row][data-sve-ht-current] { background: #3858e9; color: #fff; }
    [data-sve-ht-row][data-sve-ht-current]:hover { background: #4a68ee; }
    [data-sve-ht-row][data-sve-ht-hidden] { opacity: .5; }
    [data-sve-ht-row][data-sve-ht-drop="before"]::before,
    [data-sve-ht-row][data-sve-ht-drop="after"]::after {
      content: '';
      position: absolute;
      left: 8px;
      right: 8px;
      height: 2px;
      background: #93c5fd;
      pointer-events: none;
    }
    [data-sve-ht-row][data-sve-ht-drop="before"]::before { top: -2px; }
    [data-sve-ht-row][data-sve-ht-drop="after"]::after { bottom: -2px; }
    [data-sve-ht-row][data-sve-ht-drop="inside"] {
      outline: 2px solid #93c5fd;
      outline-offset: -2px;
    }
    [data-sve-ht-twist] {
      all: unset;
      box-sizing: border-box;
      width: 14px;
      height: 14px;
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: .7;
    }
    [data-sve-ht-twist][data-sve-ht-shut] { transform: rotate(-90deg); }
    [data-sve-ht-actions] {
      margin-left: auto;
      flex: none;
      display: none;
      align-items: center;
      gap: 4px;
    }
    [data-sve-ht-row]:hover [data-sve-ht-actions],
    [data-sve-ht-row][data-sve-ht-current] [data-sve-ht-actions],
    [data-sve-ht-row][data-sve-ht-hidden] [data-sve-ht-actions] {
      display: inline-flex;
    }
    [data-sve-ht-eye],
    [data-sve-ht-dup],
    [data-sve-ht-del] {
      all: unset;
      box-sizing: border-box;
      width: 18px;
      height: 18px;
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: .7;
      border-radius: 4px;
    }
    [data-sve-ht-eye]:hover,
    [data-sve-ht-dup]:hover,
    [data-sve-ht-del]:hover { opacity: 1; background: rgba(255,255,255,.12); }
    [data-sve-ht-icon] {
      flex: none;
      width: 14px;
      height: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    [data-sve-ht-icon] svg { display: block; }
    [data-sve-ht-letter] {
      flex: none;
      width: 14px;
      height: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
      line-height: 1;
    }
    [data-sve-ht-text] {
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 6px;
      overflow: hidden;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
    }
    [data-sve-ht-tag] {
      all: unset;
      box-sizing: border-box;
      flex: none;
      padding: 0 3px;
      border-radius: 3px;
      cursor: pointer;
      opacity: .55;
    }
    [data-sve-ht-kind] {
      flex: none;
      padding: 0 3px;
      border-radius: 3px;
      opacity: .55;
    }
    [data-sve-ht-tag]:hover {
      opacity: 1;
      background: rgba(255,255,255,.18);
    }
    [data-sve-ht-tag]:focus-visible {
      outline: 2px solid #3858e9;
      outline-offset: -2px;
    }
    [data-sve-ht-row][data-sve-ht-current] [data-sve-ht-tag] { opacity: .72; }
    [data-sve-ht-name] {
      min-width: 2em;
      min-height: 1em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    [data-sve-ht-rename] {
      all: unset;
      box-sizing: border-box;
      min-width: 48px;
      max-width: 100%;
      padding: 0 4px;
      border-radius: 3px;
      background: rgba(0,0,0,.22);
      font: inherit;
      color: inherit;
    }
  `}function U(){const e=v("dock:html");return typeof e=="string"?e:""}function Ce(e){return!!v("dock:is-open",e)}function oe(e){return v("dock:set-html",e)===!0}function $(e){const t=e.document,n=H(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;un(t);const r=U(),l=Xe(r);ne=l;const i=Ye(l,L),a=v("dock:current-type")||"",h=Nt(a);!r.trim()&&!Ce(t)?s.emptyText=f(e,"html_tree_need_dock"):s.emptyText=f(e,"html_tree_empty"),s.renameTitle=f(e,"html_tree_rename"),s.tagTitle=f(e,"tw_tag"),s.hideTitle=f(e,"html_tree_hide"),s.showTitle=f(e,"html_tree_show"),s.duplicateTitle=f(e,"html_tree_duplicate"),s.deleteTitle=f(e,"html_tree_delete"),s.canEdit=!v("dock:is-locked"),s.onSelect=c=>se(e,c,i),s.onTwist=c=>{L.has(c)?L.delete(c):L.add(c),$(e)},s.onTagChange=(c,g)=>{const b=s.rows.find(k=>k.id===g);b&&We(e,c.currentTarget,b)},s.onRename=c=>hn(e,c),s.onRenameCommit=()=>pe(e,!0),s.onRenameCancel=()=>pe(e,!1),s.onHide=c=>mn(e,c),s.onDuplicate=c=>gn(e,c),s.onDelete=c=>vn(e,c),s.onPointerDown=(c,g)=>xn(e,c,g),s.onContext=(c,g)=>kn(e,c,g),s.onInspectCommit=c=>Tn(e,c),s.onLoopKind=c=>Cn(e,c),s.onAddBranch=c=>$n(e,c),s.rows=i.map(c=>{const g=Ft(c.tag,c.kind,c.antlers);return{...c,name:Zt(c.klass,c.path,h),current:c.id===M,letter:g.letter||"",svg:g.svg||""}}),He(e,s.rows.find(c=>c.id===M)),te(n,At),pn(e,l)}function pn(e,t){if(!H(e.document))return;const o=t[0];ee({source:"statamic-visual-editor",type:"sve-html-pick",on:!0,uid:v("dock:current-uid")||"",tag:o?.tag||"",klass:o?.klass||"",nodes:Je(t)},e)}function fn(e){if(!e)return;const t=[],o=String(e).split("/");for(let r=0;r<o.length;r+=1)t.push(o.slice(0,r+1).join("/"));const n=r=>{for(const l of r||[])t.includes(l.path)&&L.delete(l.id),n(l.children)};n(ne)}function hn(e,t){if(Z)return;const o=s.rows.find(n=>n.id===t);!o||o.kind||(M=t,s.rows.forEach(n=>{n.current=n.id===t}),s.editingId=t,s.draft=o.name,e.setTimeout(()=>{const n=H(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function pe(e,t){const o=s.editingId;if(!o)return;const n=s.rows.find(r=>r.id===o);s.editingId=null,t&&n&&qt(v("dock:current-type")||"",n.path,s.draft,n.klass),s.draft="",$(e)}function mn(e,t){re(e,t,Bt)}function gn(e,t){re(e,t,zt)}function vn(e,t){re(e,t,Ot)}function re(e,t,o){if(v("dock:is-locked"))return;const n=U(),r=s.rows.find(i=>i.id===t);if(!r)return;const l=o(n,r);l!==n&&oe(l)}function q(){R?.dismiss(),R=null}function kn(e,t,o){q();const n=s.rows.find(i=>i.id===o);if(!n)return;se(e,o,s.rows);const r={x:t.clientX,y:t.clientY},l=i=>{i.length&&(R?.dismiss(),R=he(e.document,Xt,{items:i,x:r.x,y:r.y,onClose:()=>{R=null}}))};if(n.kind==="component"){yn(e,n,l);return}s.canEdit&&l([{label:f(e,"component_make"),onPick:()=>{q(),sn(e,n,{onDone:()=>$(e),onError:i=>{e.alert(i?.status===409?f(e,"component_exists"):f(e,"component_failed"))}})}}])}const fe=(e,t)=>{q(),v("dock:open-template",t)};function yn(e,t,o){if(!/\{[A-Za-z_][A-Za-z0-9_]*\}/.test(t.src)){o([{label:f(e,"component_open_named",{name:t.name||t.src}),onPick:()=>fe(e,`view:partials/${t.src}`)}]);return}o([{label:f(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const r=Array.isArray(n.items)?n.items:[];o(r.length?r.map(l=>({label:f(e,"component_open_named",{name:l.label}),onPick:()=>fe(e,l.type)})):[{label:f(e,"component_none"),onPick:null}])}).catch(()=>o([{label:f(e,"component_none"),onPick:null}]))}function xn(e,t,o){if(t.button!==0||v("dock:is-locked")||s.editingId||t.target?.closest?.("button, input"))return;ie(),E=o,D={x:t.clientX,y:t.clientY},K=t.currentTarget,N=t.pointerId;const n=l=>bn(e,l),r=l=>_n(e,l);G=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",r,!0),e.document.removeEventListener("pointercancel",r,!0),G=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",r,!0),e.document.addEventListener("pointercancel",r,!0)}function bn(e,t){if(!E||!D)return;const o=t.clientX-D.x,n=t.clientY-D.y;if(!s.dragging&&o*o+n*n<25)return;if(!s.dragging){s.dragging=!0;try{K?.setPointerCapture?.(N)}catch{}}t.preventDefault();const r=e.document.elementFromPoint(t.clientX,t.clientY)?.closest?.("[data-sve-ht-row]"),l=r?.getAttribute("data-sve-ht-id");if(!l||l===E){s.dropId=null,s.dropPlace=null;return}const i=s.rows.find(c=>c.id===l),a=s.rows.find(c=>c.id===E);if(!i||a&&i.path.startsWith(`${a.path}/`)){s.dropId=null,s.dropPlace=null;return}const h=r.getBoundingClientRect();s.dropId=l,s.dropPlace=jt(t.clientY-h.top,h.height,!ge(i.tag)&&i.kind!=="component")}function _n(e,t){const o=E,n=s.dropId,r=s.dropPlace||"after",l=s.dragging;if(ie(),l&&(Z=!0,e.setTimeout(()=>{Z=!1},0)),!l||v("dock:is-locked")||!o||!n||o===n)return;t?.preventDefault?.();const i=U(),a=Rt(i,ne,o,n,r);a!==i&&oe(a)}function ie(){try{K?.releasePointerCapture?.(N)}catch{}G?.(),E=null,D=null,K=null,N=null,s.dragging=!1,s.dropId=null,s.dropPlace=null}function $e(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function He(e,t){if(t?.kind!=="antlers"){s.inspect=null;return}const o=`${t.id}:${t.expr}:${t.loopKind}`;if(t.tag==="else"){s.inspect={key:o,title:f(e,"antlers_condition"),mode:"note",note:f(e,"antlers_else_note")};return}if(t.antlers==="loop"){const n=t.loopKind==="collection";s.inspect={key:o,title:f(e,"antlers_loop"),mode:"loop",loopKind:n?"collection":"field",kinds:[{id:"field",label:f(e,"antlers_loop_field")},{id:"collection",label:f(e,"antlers_loop_collection")}],collections:$e(e),value:t.expr||"",placeholder:f(e,n?"antlers_pick_collection":"antlers_loop_placeholder"),branches:[]};return}s.inspect={key:o,title:f(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:f(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:f(e,"antlers_add_elseif")},{id:"else",label:f(e,"antlers_add_else")}]}}function Pe(){const e=s.rows.find(t=>t.id===M);return e?.kind==="antlers"&&!v("dock:is-locked")?e:null}function F(e,t){const o=Pe();if(!o)return;const n=U(),r=t(n,o);r!==n&&(oe(r),$(e))}function Tn(e,t){F(e,(o,n)=>n.antlers==="loop"?j(o,n,n.loopKind==="collection"?"collection":"field",t):ln(o,n,t))}function Cn(e,t){const o=Pe();if(!o||o.antlers!=="loop")return;const n=o.loopKind==="collection"?"collection":"field";if(t!==n){if(t==="collection"){const r=$e(e)[0]?.handle;if(!r)return;F(e,(l,i)=>j(l,i,"collection",r));return}F(e,(r,l)=>j(r,l,"field",l.handle||"items"))}}function $n(e,t){F(e,(o,n)=>dn(o,n,t))}function se(e,t,o){if(Z)return;const n=(o||s.rows).find(r=>r.id===t);n&&(M=t,s.rows.forEach(r=>{r.current=r.id===t}),He(e,n),v("dock:reveal-html",{from:n.from,to:n.to}),v("dock:tw-follow"),ee({source:"statamic-visual-editor",type:"sve-html-pick-focus",path:n.path},e))}function Hn(e,t){if(!t||!H(e.document))return;fn(t),$(e);const o=s.rows.find(n=>n.path===t);o&&se(e,o.id,s.rows)}function Q(e){if(z)return;z=Ne("dock:html-changed",()=>{s.editingId||s.dragging||(e.clearTimeout(O),O=e.setTimeout(()=>{H(e.document)&&$(e)},80))})}function Pn(e){z?.(),z=null,e?.clearTimeout?.(O),O=0}function X(e){const t=H(e.document);if(ee({source:"statamic-visual-editor",type:"sve-html-pick",on:!1},e),Pn(e),ie(),q(),Ue(e),M=null,s.inspect=null,s.editingId=null,s.draft="",!t){y.syncPreviewInset(e);return}t.remove(),Ze.headerTab==="html_tree"&&qe(e,null),ze(e),y.persistDockedPanel(e),me(e),y.syncPreviewInset(e)}function wn(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=B,te(t,ve,{title:f(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>X(e)))}function En(e){Q(e),$(e)}function we(e){const t=e.document;if(!y.featureOn(e,"html_tree"))return;if(H(t)){Q(e),$(e);return}if(!Ce(t))return;y.closeRightPanels(e,[B]);const o=t.createElement("div");o.id=B,o.style.cssText=Oe,te(o,ve,{title:f(e,"html_tree")}),o.querySelector("[data-sve-close]")?.addEventListener("click",()=>X(e)),Ke(e,o),y.persistDockedPanel(e),me(e),y.syncPreviewInset(e),Q(e),$(e)}function Mn(e){if(H(e.document)){X(e);return}we(e)}Fe("html-tree:from-preview",({path:e}={})=>{Hn(window,e)});y.HTML_TREE_PANEL_ID=B;y.htmlTreePanel=H;y.closeHtmlTreePanel=X;y.fillHtmlTreePane=wn;y.showHtmlTreePane=En;y.openHtmlTreePanel=we;y.toggleHtmlTreePanel=Mn;y.renderHtmlTree=$;export{B as HTML_TREE_PANEL_ID,ue as HTML_TREE_STYLE_ID,q as closeHtmlTreeMenu,X as closeHtmlTreePanel,un as ensureHtmlTreeStyles,wn as fillHtmlTreePane,M as htmlTreeActiveId,L as htmlTreeCollapsed,H as htmlTreePanel,O as htmlTreeTimer,z as htmlTreeUnhook,we as openHtmlTreePanel,$ as renderHtmlTree,En as showHtmlTreePane,Pn as stopWatchHtmlTreeDock,Mn as toggleHtmlTreePanel,Q as watchHtmlTreeDock};
