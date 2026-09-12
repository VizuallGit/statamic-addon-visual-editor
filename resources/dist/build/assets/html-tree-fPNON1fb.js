const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-B9daJWrZ.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{r as we,_ as U,u as d,o as p,c as f,a as w,t as _,F as H,e as A,d as T,f as g,w as L,b as Me,K as Se,m as j,L as Le,M as Ie,N as le,O as Ae,P as De,n as Re,Q as v,S as he,j as h,T as Be,J as je,x as ee,s as x,h as ze,B as me,i as te,R as Oe,C as Ke,U as Ne,E as Ze,G as qe,V as Fe}from"./addon-BPuCuoC6.js";import{i as ge,t as Ve,c as Ue,p as Xe,f as Ye,a as We}from"./tw-overlay-DllTdlx2.js";import{a as Je}from"./html-pick-align-BQgDq65Q.js";const r=we({emptyText:"",rows:[],editingId:null,draft:"",renameTitle:"",hideTitle:"",showTitle:"",duplicateTitle:"",deleteTitle:"",canEdit:!1,dragging:!1,dropId:null,dropPlace:null,onSelect:null,onTwist:null,tagTitle:"",onTagChange:null,onRename:null,onRenameCommit:null,onRenameCancel:null,onHide:null,onDuplicate:null,onDelete:null,onPointerDown:null,onContext:null,slotText:"",inspect:null,onInspectCommit:null,onLoopKind:null,onAddBranch:null}),Ge={key:0,class:"sve-ht-inspect"},Qe={class:"sve-ht-inspect__head"},et={key:0,class:"sve-ht-inspect__note"},tt={key:0,class:"sve-ht-inspect__seg"},nt=["data-active","disabled","onClick"],ot=["value","disabled"],rt={key:0,value:""},it=["value"],st=["value","placeholder","disabled","onKeydown"],lt={key:3,class:"sve-ht-inspect__add"},at=["disabled","onClick"],ct={__name:"HtmlTreeInspector",setup(e){function t(o){r.onInspectCommit?.(o.target.value)}return(o,n)=>d(r).inspect?(p(),f("div",Ge,[w("div",Qe,_(d(r).inspect.title),1),d(r).inspect.mode==="note"?(p(),f("div",et,_(d(r).inspect.note),1)):(p(),f(H,{key:1},[d(r).inspect.mode==="loop"?(p(),f("div",tt,[(p(!0),f(H,null,A(d(r).inspect.kinds,i=>(p(),f("button",{key:i.id,type:"button","data-active":i.id===d(r).inspect.loopKind?"":void 0,disabled:!d(r).canEdit,onClick:l=>d(r).onLoopKind?.(i.id)},_(i.label),9,nt))),128))])):T("",!0),d(r).inspect.mode==="loop"&&d(r).inspect.loopKind==="collection"?(p(),f("select",{key:d(r).inspect.key+":select",value:d(r).inspect.value,disabled:!d(r).canEdit,onChange:t},[d(r).inspect.value?T("",!0):(p(),f("option",rt,_(d(r).inspect.placeholder),1)),(p(!0),f(H,null,A(d(r).inspect.collections,i=>(p(),f("option",{key:i.handle,value:i.handle},_(i.title),9,it))),128))],40,ot)):(p(),f("input",{key:d(r).inspect.key,type:"text",value:d(r).inspect.value,placeholder:d(r).inspect.placeholder,disabled:!d(r).canEdit,spellcheck:"false",onKeydown:[n[0]||(n[0]=g(()=>{},["stop"])),L(g(t,["prevent"]),["enter"])],onBlur:t},null,40,st)),d(r).inspect.branches?.length?(p(),f("div",lt,[(p(!0),f(H,null,A(d(r).inspect.branches,i=>(p(),f("button",{key:i.id,type:"button",disabled:!d(r).canEdit,onClick:l=>d(r).onAddBranch?.(i.id)},_(i.label),9,at))),128))])):T("",!0)],64))])):T("",!0)}},dt=U(ct,[["__scopeId","data-v-2e1b20d6"]]),ut={class:"sve-html-tree"},pt={class:"sve-pane-bar","data-sve-pane-bar":""},ft={"data-sve-right-title":""},ht={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){return(t,o)=>(p(),f("div",ut,[w("div",pt,[w("div",ft,_(e.title),1),o[0]||(o[0]=Me('<div data-sve-right-actions data-v-0bfee450><button type="button" data-sve-right-pin aria-pressed="false" data-v-0bfee450></button><button type="button" data-sve-close aria-label="Close" data-v-0bfee450><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-0bfee450><path d="M18 6 6 18" data-v-0bfee450></path><path d="m6 6 12 12" data-v-0bfee450></path></svg></button></div>',1))]),o[1]||(o[1]=w("div",{"data-sve-html-tree-list":""},null,-1)),Se(dt)]))}},ve=U(ht,[["__scopeId","data-v-0bfee450"]]),mt={key:0,class:"sve-ht-empty"},gt=["title","onClick","onDblclick","onKeydown","onPointerdown","onContextmenu"],vt=["onClick"],kt={key:1,"data-sve-ht-letter":""},yt=["innerHTML"],xt=["title"],_t=["title","onClick"],bt={key:1,"data-sve-ht-kind":""},Tt={key:3,"data-sve-ht-name":""},Ct={key:3,"data-sve-ht-actions":""},Pt=["title","innerHTML","onClick"],$t=["title","onClick"],Ht=["title","onClick"],Et=["data-sve-ht-id"],wt='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',Mt='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',St='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',Lt='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',It='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',At={__name:"HtmlTreeList",setup(e){function t(i){return i.kind==="component"?i.src?`partial:${i.src}`:i.tag:i.name?`${i.tag} ${i.name}`:i.tag}function o(i){const l={"data-sve-ht-id":i.id};return i.current&&(l["data-sve-ht-current"]=""),i.hidden&&(l["data-sve-ht-hidden"]=""),r.dropId===i.id&&r.dropPlace&&(l["data-sve-ht-drop"]=r.dropPlace),l}function n(i){return!i.hidden||i.wrapFrom!=null}return(i,l)=>(p(),f("div",j({class:"sve-ht-root"},d(r).dragging?{"data-sve-ht-dragging":""}:{}),[d(r).rows.length?T("",!0):(p(),f("div",mt,_(d(r).emptyText),1)),(p(!0),f(H,null,A(d(r).rows,s=>(p(),f(H,{key:s.id},[w("div",j({"data-sve-ht-row":""},{ref_for:!0},o(s),{role:"button",tabindex:"0",title:t(s),style:{marginLeft:s.depth*12+"px"},onClick:a=>d(r).onSelect?.(s.id),onDblclick:g(a=>d(r).onRename?.(s.id),["prevent"]),onKeydown:[L(g(a=>d(r).onSelect?.(s.id),["prevent"]),["enter"]),L(g(a=>d(r).onSelect?.(s.id),["prevent"]),["space"])],onPointerdown:a=>d(r).onPointerDown?.(a,s.id),onContextmenu:g(a=>d(r).onContext?.(a,s.id),["prevent","stop"])}),[s.hasChildren||s.emptyBlock?(p(),f("button",j({key:0,type:"button","data-sve-ht-twist":""},{ref_for:!0},s.shut?{"data-sve-ht-shut":""}:{},{innerHTML:wt,onClick:g(a=>d(r).onTwist?.(s.id),["stop","prevent"]),onPointerdown:l[0]||(l[0]=g(()=>{},["stop"])),onDblclick:l[1]||(l[1]=g(()=>{},["stop"]))}),null,16,vt)):T("",!0),s.letter?(p(),f("span",kt,_(s.letter),1)):(p(),f("span",{key:2,"data-sve-ht-icon":"",innerHTML:s.svg},null,8,yt)),w("span",{"data-sve-ht-text":"",title:d(r).renameTitle},[s.kind!=="component"?(p(),f("button",{key:0,type:"button","data-sve-ht-tag":"",title:d(r).tagTitle,onClick:g(a=>d(r).onTagChange?.(a,s.id),["stop","prevent"]),onPointerdown:l[2]||(l[2]=g(()=>{},["stop"])),onDblclick:l[3]||(l[3]=g(()=>{},["stop"]))},_(s.tag),41,_t)):(p(),f("span",bt,_(s.tag),1)),d(r).editingId===s.id?Le((p(),f("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":l[4]||(l[4]=a=>d(r).draft=a),onMousedown:l[5]||(l[5]=g(()=>{},["stop"])),onPointerdown:l[6]||(l[6]=g(()=>{},["stop"])),onClick:l[7]||(l[7]=g(()=>{},["stop"])),onDblclick:l[8]||(l[8]=g(()=>{},["stop"])),onKeydown:[l[9]||(l[9]=g(()=>{},["stop"])),l[10]||(l[10]=L(g(a=>d(r).onRenameCommit?.(),["prevent"]),["enter"])),l[11]||(l[11]=L(g(a=>d(r).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:l[12]||(l[12]=a=>d(r).onRenameCommit?.())},null,544)),[[Ie,d(r).draft]]):(p(),f("span",Tt,_(s.name),1))],8,xt),d(r).canEdit?(p(),f("span",Ct,[d(r).canEdit&&n(s)?(p(),f("button",{key:0,type:"button","data-sve-ht-eye":"",title:s.hidden?d(r).showTitle:d(r).hideTitle,innerHTML:s.hidden?St:Mt,onClick:g(a=>d(r).onHide?.(s.id),["stop","prevent"]),onPointerdown:l[13]||(l[13]=g(()=>{},["stop"])),onDblclick:l[14]||(l[14]=g(()=>{},["stop"]))},null,40,Pt)):T("",!0),d(r).canEdit?(p(),f("button",{key:1,type:"button","data-sve-ht-dup":"",title:d(r).duplicateTitle,innerHTML:Lt,onClick:g(a=>d(r).onDuplicate?.(s.id),["stop","prevent"]),onPointerdown:l[15]||(l[15]=g(()=>{},["stop"])),onDblclick:l[16]||(l[16]=g(()=>{},["stop"]))},null,40,$t)):T("",!0),d(r).canEdit?(p(),f("button",{key:2,type:"button","data-sve-ht-del":"",title:d(r).deleteTitle,innerHTML:It,onClick:g(a=>d(r).onDelete?.(s.id),["stop","prevent"]),onPointerdown:l[17]||(l[17]=g(()=>{},["stop"])),onDblclick:l[18]||(l[18]=g(()=>{},["stop"]))},null,40,Ht)):T("",!0)])):T("",!0)],16,gt),s.emptyBlock&&!s.shut?(p(),f("div",j({key:0,"data-sve-ht-slot":"","data-sve-ht-id":s.id},{ref_for:!0},d(r).dropId===s.id&&d(r).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{marginLeft:(s.depth+1)*12+"px"}}),_(d(r).slotText),17,Et)):T("",!0)],64))),128))],16))}},Dt=U(At,[["__scopeId","data-v-4543c8d2"]]);function J(e,t){for(const o of e||[]){if(o.id===t)return o;const n=J(o.children,t);if(n)return n}return null}function ke(e,t){return(e.children||[]).some(o=>o.id===t||ke(o,t))}function M(e,t){let o=t.wrapFrom??t.from,n=t.wrapTo??t.to;return o>0&&e[o-1]===`
`&&(o-=1),{from:o,to:n}}function Rt(e,t){const o=e.slice(t.from,t.to);if(t.kind==="antlers"){const l=o.match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return l?t.from+l.index:t.to}const n=`</${t.tag}`,i=o.toLowerCase().lastIndexOf(n);return i===-1?t.to:t.from+i}function W(e,t,o){return e>=t+o?e-o:e>t?t:e}function Bt(e,t,o,n,i){const l=J(t,o),s=J(t,n);if(!e||!l||!s||o===n||ke(l,n))return e;let a=i;a==="inside"&&(ge(s.tag)||s.wrapFrom!=null)&&(a="after");const u=M(e,l),c=e.slice(u.from,u.to);if(!c)return e;const m=e.slice(0,u.from)+e.slice(u.to),k=u.to-u.from;let y;a==="before"?y=W(M(e,s).from,u.from,k):a==="inside"?y=W(Rt(e,s),u.from,k):y=W(M(e,s).to,u.from,k),y=Math.max(0,Math.min(y,m.length));let b=c;return y>0&&m[y-1]!==`
`&&b[0]!==`
`&&(b=`
${b}`),m.slice(0,y)+b+m.slice(y)}function jt(e,t){if(!e||!t)return e;if(t.wrapFrom!=null&&t.wrapTo!=null){const o=e.slice(t.wrapFrom+4,t.wrapTo-3);return e.slice(0,t.wrapFrom)+o+e.slice(t.wrapTo)}return t.hidden?e:`${e.slice(0,t.from)}<!--${e.slice(t.from,t.to)}-->${e.slice(t.to)}`}function zt(e,t,o){const n=e/Math.max(t,1);return o&&n>.32&&n<.68?"inside":n<.5?"before":"after"}function Ot(e,t){if(!e||!t)return e;const{from:o,to:n}=M(e,t);let i=e.slice(o,n);return i?(i.startsWith(`
`)||(i=`
${i}`),e.slice(0,n)+i+e.slice(n)):e}function Kt(e,t){if(!e||!t)return e;const{from:o,to:n}=M(e,t);return e.slice(0,o)+e.slice(n)}const ye="sve-html-tree-labels";function xe(){try{const e=globalThis.localStorage?.getItem(ye);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function Nt(e){try{globalThis.localStorage?.setItem(ye,JSON.stringify(e))}catch{}}function _e(e){return String(e||"_")}function Zt(e){const t=xe()[_e(e)];return t&&typeof t=="object"?{...t}:{}}function qt(e,t,o){const n=o?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function Ft(e,t,o,n){if(!t)return;const i=_e(e),l=xe(),s={...l[i]||{}},a=String(o||"").replace(/\s+/g," ").trim(),u=String(n||"").trim();!a||a===u?delete s[t]:s[t]=a,Object.keys(s).length?l[i]=s:delete l[i],Nt(l)}const C={div:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><rect x="2.5" y="3.5" width="11" height="9" rx="1.2" stroke-dasharray="2.6 2"/></svg>',section:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="2" y="2.5" width="12" height="11" rx="1.4"/><path d="M2 6.2h12" stroke-width="2.2"/></svg>',ul:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="4" r="1"/><circle cx="3.2" cy="8" r="1"/><circle cx="3.2" cy="12" r="1"/><rect x="5.5" y="3.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="7.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="11.2" width="8" height="1.5" rx=".4"/></svg>',li:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="8" r="1.1"/><rect x="5.5" y="7.2" width="8" height="1.6" rx=".4"/></svg>',a:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M6.2 8.8 4.8 10.2a2.2 2.2 0 0 0 3.1 3.1l1.8-1.8"/><path d="M9.8 7.2l1.4-1.4a2.2 2.2 0 0 0-3.1-3.1L6.3 4.5"/></svg>',img:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="3" width="12" height="10" rx="1.2"/><circle cx="5.5" cy="6.2" r="1.1"/><path d="M2.8 12.2 6.2 9l2.2 2.2 2-1.8 2.8 2.8"/></svg>',if:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4.6 2.8v10.4"/><path d="M2.4 11l2.2 2.2L6.8 11"/><path d="M11.4 13.2V2.8"/><path d="M9.2 5 11.4 2.8 13.6 5"/></svg>',loop:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M8 8s-1.3-2.4-3-2.4a2.4 2.4 0 0 0 0 4.8C6.7 10.4 8 8 8 8Z"/><path d="M8 8s1.3 2.4 3 2.4a2.4 2.4 0 0 0 0-4.8C9.3 5.6 8 8 8 8Z"/></svg>',component:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M8 1.6 13.4 4.8v6.4L8 14.4 2.6 11.2V4.8Z"/><path d="M2.6 4.8 8 8l5.4-3.2M8 8v6.4"/></svg>',other:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M5.2 3.5 2.8 8l2.4 4.5"/><path d="M10.8 3.5 13.2 8l-2.4 4.5"/></svg>'};function Vt(e,t,o){return t==="component"?{svg:C.component}:t==="antlers"?{svg:o==="loop"?C.loop:C.if}:/^h[1-6]$/.test(e)?{letter:"H"}:e==="p"?{letter:"P"}:e==="div"?{svg:C.div}:e==="section"||e==="article"||e==="header"||e==="footer"||e==="main"||e==="nav"||e==="aside"?{svg:C.section}:e==="ul"||e==="ol"?{svg:C.ul}:e==="li"?{svg:C.li}:e==="a"?{svg:C.a}:e==="img"||e==="picture"||e==="svg"?{svg:C.img}:{svg:C.other}}const Ut=["disabled","onClick"],Xt={__name:"HtmlTreeMenu",props:{items:{type:Array,required:!0},x:{type:Number,required:!0},y:{type:Number,required:!0},onClose:{type:Function,required:!0}},setup(e){const t=e,o=le(null),n=le({left:`${t.x}px`,top:`${t.y}px`});function i(s){o.value?.contains(s.target)||t.onClose()}function l(s){s.key==="Escape"&&t.onClose()}return Ae(()=>{const s=o.value?.getBoundingClientRect();if(s){const a=Math.min(t.x,window.innerWidth-s.width-8),u=Math.min(t.y,window.innerHeight-s.height-8);n.value={left:`${Math.max(8,a)}px`,top:`${Math.max(8,u)}px`}}document.addEventListener("pointerdown",i,!0),document.addEventListener("keydown",l,!0),window.addEventListener("scroll",t.onClose,!0)}),De(()=>{document.removeEventListener("pointerdown",i,!0),document.removeEventListener("keydown",l,!0),window.removeEventListener("scroll",t.onClose,!0)}),(s,a)=>(p(),f("div",{ref_key:"menu",ref:o,class:"sve-ht-menu",style:Re(n.value)},[(p(!0),f(H,null,A(e.items,u=>(p(),f("button",{key:u.label,type:"button",disabled:!u.onPick,onClick:c=>u.onPick?.()},_(u.label),9,Ut))),128))],4))}},Yt=U(Xt,[["__scopeId","data-v-7e205566"]]),Wt=/^@(media|supports|container|layer|scope)\b/i;function Jt(e){const t=String(e||""),o=[];let n=0,i=0;for(;n<t.length;){if(t[n]==="{"&&t[n+1]==="{"){const a=t.indexOf("}}",n+2);n=a===-1?t.length:a+2;continue}if(t[n]==="/"&&t[n+1]==="*"){const a=t.indexOf("*/",n+2);n=a===-1?t.length:a+2;continue}if(t[n]==='"'||t[n]==="'"){const a=t[n];for(n+=1;n<t.length&&t[n]!==a;)n+=t[n]==="\\"?2:1;n+=1;continue}if(t[n]!=="{"){n+=1;continue}let l=1,s=n+1;for(;s<t.length&&l>0;){if(t[s]==="{"&&t[s+1]==="{"){const a=t.indexOf("}}",s+2);s=a===-1?t.length:a+2;continue}if(t[s]==="/"&&t[s+1]==="*"){const a=t.indexOf("*/",s+2);s=a===-1?t.length:a+2;continue}if(t[s]==='"'||t[s]==="'"){const a=t[s];for(s+=1;s<t.length&&t[s]!==a;)s+=t[s]==="\\"?2:1;s+=1;continue}t[s]==="{"?l+=1:t[s]==="}"&&(l-=1),s+=1}o.push({selector:t.slice(i,n).trim(),body:t.slice(n+1,s-1),from:i,to:s,text:t.slice(i,s).trim()}),n=s,i=s}return o}function ae(e){const t=String(e||""),o=new Set,n=new Set,i=new Set;for(const l of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const s of l[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))s&&(o.add(s),o.add(s.replace(/([:./%!#()[\],])/g,"\\$1")));for(const l of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))l[2].trim()&&n.add(l[2].trim());for(const l of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))i.add(l[1].toLowerCase());return{classes:o,ids:n,tags:i}}function ce(e,t){const o=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),n=[...o.matchAll(/\.((?:\\.|[\w-])+)/g)].map(s=>s[1]),i=[...o.matchAll(/#((?:\\.|[\w-])+)/g)].map(s=>s[1]);if(n.length||i.length){const s=a=>a.replace(/\\(.)/g,"$1");return n.every(a=>t.classes.has(a)||t.classes.has(s(a)))&&i.every(a=>t.ids.has(s(a)))}const l=[...o.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(s=>s[2].toLowerCase());return l.length>0&&l.every(s=>t.tags.has(s))}function Gt(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function Qt(e,t,o){const n=Gt(e);if(!n.length)return"keep";const i=n.filter(s=>ce(s,t));return i.length?i.length===n.length&&!n.some(s=>ce(s,o))?"move":"copy":"keep"}function be(e,t,o){const n=String(e||""),i=ae(t),l=ae(o),s=[],a=[];let u=0;for(const c of Jt(n)){const m=n.slice(c.from,c.to),k=m.match(/^\s*/)[0];if(u=c.to,Wt.test(c.selector)){const b=be(c.body,t,o);b.move.trim()&&s.push(`${c.selector} {
${b.move.trim()}
}`),b.keep.trim()&&a.push(`${k}${c.selector} {
${b.keep.trim()}
}`);continue}const y=c.selector.startsWith("@")?"keep":Qt(c.selector,i,l);if(y==="move"){s.push(c.text);continue}y==="copy"&&s.push(c.text),a.push(m)}return a.push(n.slice(u)),{move:s.join(`

`).trim(),keep:a.join("").replace(/\n{3,}/g,`

`).trim()}}const en="/!/sve/component";function tn(e){return e.document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")||e.Statamic?.$config?.get?.("csrfToken")||e.Statamic?.$config?.get?.("csrf_token")||""}function nn(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let o=null;for(const n of t){if(!n.trim())continue;const i=n.match(/^[ \t]*/)[0].length;o=o===null?i:Math.min(o,i)}return o?t.map(n=>n.slice(o)).join(`
`):t.join(`
`)}function on(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function rn(e,t){if(!Ve(e))return"";try{return await(await je(()=>import("./tw-compile-B9daJWrZ.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(o){return console.error("[sve] component tailwind compile",o),""}}async function sn(e,t){const o=await e.fetch(en,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":tn(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!o.ok){const n=new Error(String(o.status));throw n.status=o.status,n}return o.json()}function de(e,t){const{from:o,to:n}=M(e,t),i=e.slice(o,n);if(!i.trim())return null;const l=e.slice(0,o)+e.slice(n),s=v("dock:css"),a=be(typeof s=="string"?s:"",i,l);return{html:nn(i),css:a.move,keepCss:a.keep,lead:on(i),from:o,to:n}}function ln(e,t,{onDone:o,onError:n}={}){if(v("dock:is-locked")===!0)return;const i=v("dock:html");if(typeof i!="string"||!t)return;const l=de(i,t);if(!l)return;const s=he(e.document,Be,{heading:h(e,"component_new"),nameLabel:h(e,"component_name"),placeholder:h(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:h(e,"cancel"),saveLabel:h(e,"component_create"),onOk:a=>{s.dismiss(),(async()=>{try{const u=await rn(e,l.html),c=v("dock:html"),m=typeof c=="string"&&c===i?l:de(c,t);if(!m)return;const k=await sn(e,{name:a,html:m.html,css:m.css,js:"",tw:u}),y=v("dock:html"),b=y.slice(0,m.from)+m.lead+k.tag+y.slice(m.to);v("dock:set-html",b),m.css.trim()&&v("dock:set-css",m.keepCss),o?.(k)}catch(u){n?.(u)}})()}})}function an(e,t,o){const n=String(e||"");if(!t||t.kind!=="antlers")return n;const i=String(o||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?dn(n,t,i):t.tag==="else"||!i?n:n.slice(0,t.from)+`{{ ${t.tag} ${i} }}`+n.slice(t.openTo)}function z(e,t,o,n){const i=String(e||"");if(!t||t.antlers!=="loop")return i;const l=String(n||"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(l))return i;const s=o==="collection"?`collection:${l}`:l,a=o==="collection"?cn(t.params):"",u=o==="collection"?"collection":l,c=Te(i,t);return c?i.slice(0,t.from)+`{{ ${s}${a?` ${a}`:""} }}`+i.slice(t.openTo,c.from)+`{{ /${u} }}`+i.slice(c.to):i}function cn(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function Te(e,t){const n=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return n?{from:t.from+n.index,to:t.from+n.index+n[0].length}:null}function dn(e,t,o){return z(e,t,t.loopKind==="collection"?"collection":"field",o)}function un(e,t,o){const n=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return n;const i=Te(n,t);if(!i)return n;const s=(n.slice(0,i.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],a=o==="else"?"{{ else }}":"{{ elseif  }}";return`${n.slice(0,i.from)}${a}
${s}${n.slice(i.from)}`}const B="__sve-html-tree-panel",ue="__sve-html-tree-style",I=new Set;let S=null,O=null,K=0,ne=[],E=null,D=null,N=null,Z=null,G=null,q=!1,R=null;function $(e){return e.getElementById(B)}function pn(e){let t=e.getElementById(ue);t||(t=e.createElement("style"),t.id=ue,e.head.appendChild(t)),t.textContent=`
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
  `}function X(){const e=v("dock:html");return typeof e=="string"?e:""}function Ce(e){return!!v("dock:is-open",e)}function oe(e){return v("dock:set-html",e)===!0}function P(e){const t=e.document,n=$(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;pn(t);const i=X(),l=Xe(i);ne=l;const s=Ye(l,I),a=v("dock:current-type")||"",u=Zt(a);!i.trim()&&!Ce(t)?r.emptyText=h(e,"html_tree_need_dock"):r.emptyText=h(e,"html_tree_empty"),r.slotText=h(e,"antlers_drop_here"),r.renameTitle=h(e,"html_tree_rename"),r.tagTitle=h(e,"tw_tag"),r.hideTitle=h(e,"html_tree_hide"),r.showTitle=h(e,"html_tree_show"),r.duplicateTitle=h(e,"html_tree_duplicate"),r.deleteTitle=h(e,"html_tree_delete"),r.canEdit=!v("dock:is-locked"),r.onSelect=c=>se(e,c,s),r.onTwist=c=>{I.has(c)?I.delete(c):I.add(c),P(e)},r.onTagChange=(c,m)=>{const k=r.rows.find(y=>y.id===m);k&&We(e,c.currentTarget,k)},r.onRename=c=>mn(e,c),r.onRenameCommit=()=>pe(e,!0),r.onRenameCancel=()=>pe(e,!1),r.onHide=c=>gn(e,c),r.onDuplicate=c=>vn(e,c),r.onDelete=c=>kn(e,c),r.onPointerDown=(c,m)=>_n(e,c,m),r.onContext=(c,m)=>yn(e,c,m),r.onInspectCommit=c=>Cn(e,c),r.onLoopKind=c=>Pn(e,c),r.onAddBranch=c=>$n(e,c),r.rows=s.map(c=>{const m=Vt(c.tag,c.kind,c.antlers);return{...c,name:qt(c.klass,c.path,u),current:c.id===S,letter:m.letter||"",svg:m.svg||""}}),$e(e,r.rows.find(c=>c.id===S)),te(n,Dt),fn(e,l)}function fn(e,t){if(!$(e.document))return;const o=t[0];ee({source:"statamic-visual-editor",type:"sve-html-pick",on:!0,uid:v("dock:current-uid")||"",tag:o?.tag||"",klass:o?.klass||"",nodes:Je(t)},e)}function hn(e){if(!e)return;const t=[],o=String(e).split("/");for(let i=0;i<o.length;i+=1)t.push(o.slice(0,i+1).join("/"));const n=i=>{for(const l of i||[])t.includes(l.path)&&I.delete(l.id),n(l.children)};n(ne)}function mn(e,t){if(q)return;const o=r.rows.find(n=>n.id===t);!o||o.kind||(S=t,r.rows.forEach(n=>{n.current=n.id===t}),r.editingId=t,r.draft=o.name,e.setTimeout(()=>{const n=$(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function pe(e,t){const o=r.editingId;if(!o)return;const n=r.rows.find(i=>i.id===o);r.editingId=null,t&&n&&Ft(v("dock:current-type")||"",n.path,r.draft,n.klass),r.draft="",P(e)}function gn(e,t){re(e,t,jt)}function vn(e,t){re(e,t,Ot)}function kn(e,t){re(e,t,Kt)}function re(e,t,o){if(v("dock:is-locked"))return;const n=X(),i=r.rows.find(s=>s.id===t);if(!i)return;const l=o(n,i);l!==n&&oe(l)}function F(){R?.dismiss(),R=null}function yn(e,t,o){F();const n=r.rows.find(s=>s.id===o);if(!n)return;se(e,o,r.rows);const i={x:t.clientX,y:t.clientY},l=s=>{s.length&&(R?.dismiss(),R=he(e.document,Yt,{items:s,x:i.x,y:i.y,onClose:()=>{R=null}}))};if(n.kind==="component"){xn(e,n,l);return}r.canEdit&&l([{label:h(e,"component_make"),onPick:()=>{F(),ln(e,n,{onDone:()=>P(e),onError:s=>{e.alert(s?.status===409?h(e,"component_exists"):h(e,"component_failed"))}})}}])}const fe=(e,t)=>{F(),v("dock:open-template",t)};function xn(e,t,o){if(!/\{[A-Za-z_][A-Za-z0-9_]*\}/.test(t.src)){o([{label:h(e,"component_open_named",{name:t.name||t.src}),onPick:()=>fe(e,`view:partials/${t.src}`)}]);return}o([{label:h(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const i=Array.isArray(n.items)?n.items:[];o(i.length?i.map(l=>({label:h(e,"component_open_named",{name:l.label}),onPick:()=>fe(e,l.type)})):[{label:h(e,"component_none"),onPick:null}])}).catch(()=>o([{label:h(e,"component_none"),onPick:null}]))}function _n(e,t,o){if(t.button!==0||v("dock:is-locked")||r.editingId||t.target?.closest?.("button, input"))return;ie(),E=o,D={x:t.clientX,y:t.clientY},N=t.currentTarget,Z=t.pointerId;const n=l=>bn(e,l),i=l=>Tn(e,l);G=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",i,!0),e.document.removeEventListener("pointercancel",i,!0),G=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",i,!0),e.document.addEventListener("pointercancel",i,!0)}function bn(e,t){if(!E||!D)return;const o=t.clientX-D.x,n=t.clientY-D.y;if(!r.dragging&&o*o+n*n<25)return;if(!r.dragging){r.dragging=!0;try{N?.setPointerCapture?.(Z)}catch{}}t.preventDefault();const i=e.document.elementFromPoint(t.clientX,t.clientY),l=i?.closest?.("[data-sve-ht-slot]");if(l){const k=l.getAttribute("data-sve-ht-id");if(k&&k!==E){r.dropId=k,r.dropPlace="inside";return}}const s=i?.closest?.("[data-sve-ht-row]"),a=s?.getAttribute("data-sve-ht-id");if(!a||a===E){r.dropId=null,r.dropPlace=null;return}const u=r.rows.find(k=>k.id===a),c=r.rows.find(k=>k.id===E);if(!u||c&&u.path.startsWith(`${c.path}/`)){r.dropId=null,r.dropPlace=null;return}const m=s.getBoundingClientRect();r.dropId=a,r.dropPlace=zt(t.clientY-m.top,m.height,!ge(u.tag)&&u.kind!=="component")}function Tn(e,t){const o=E,n=r.dropId,i=r.dropPlace||"after",l=r.dragging;if(ie(),l&&(q=!0,e.setTimeout(()=>{q=!1},0)),!l||v("dock:is-locked")||!o||!n||o===n)return;t?.preventDefault?.();const s=X(),a=Bt(s,ne,o,n,i);a!==s&&oe(a)}function ie(){try{N?.releasePointerCapture?.(Z)}catch{}G?.(),E=null,D=null,N=null,Z=null,r.dragging=!1,r.dropId=null,r.dropPlace=null}function Pe(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function $e(e,t){if(t?.kind!=="antlers"){r.inspect=null;return}const o=`${t.id}:${t.expr}:${t.loopKind}`;if(t.tag==="else"){r.inspect={key:o,title:h(e,"antlers_condition"),mode:"note",note:h(e,"antlers_else_note")};return}if(t.antlers==="loop"){const n=t.loopKind==="collection";r.inspect={key:o,title:h(e,"antlers_loop"),mode:"loop",loopKind:n?"collection":"field",kinds:[{id:"field",label:h(e,"antlers_loop_field")},{id:"collection",label:h(e,"antlers_loop_collection")}],collections:Pe(e),value:t.expr||"",placeholder:h(e,n?"antlers_pick_collection":"antlers_loop_placeholder"),branches:[]};return}r.inspect={key:o,title:h(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:h(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:h(e,"antlers_add_elseif")},{id:"else",label:h(e,"antlers_add_else")}]}}function He(){const e=r.rows.find(t=>t.id===S);return e?.kind==="antlers"&&!v("dock:is-locked")?e:null}function V(e,t){const o=He();if(!o)return;const n=X(),i=t(n,o);i!==n&&(oe(i),P(e))}function Cn(e,t){V(e,(o,n)=>n.antlers==="loop"?z(o,n,n.loopKind==="collection"?"collection":"field",t):an(o,n,t))}function Pn(e,t){const o=He();if(!o||o.antlers!=="loop")return;const n=o.loopKind==="collection"?"collection":"field";if(t!==n){if(t==="collection"){const i=Pe(e)[0]?.handle;if(!i)return;V(e,(l,s)=>z(l,s,"collection",i));return}V(e,(i,l)=>z(i,l,"field",l.handle||"items"))}}function $n(e,t){V(e,(o,n)=>un(o,n,t))}function se(e,t,o){if(q)return;const n=(o||r.rows).find(i=>i.id===t);n&&(S=t,r.rows.forEach(i=>{i.current=i.id===t}),$e(e,n),v("dock:reveal-html",{from:n.from,to:n.to}),v("dock:tw-follow"),ee({source:"statamic-visual-editor",type:"sve-html-pick-focus",path:n.path},e))}function Hn(e,t){if(!t||!$(e.document))return;hn(t),P(e);const o=r.rows.find(n=>n.path===t);o&&se(e,o.id,r.rows)}function Q(e){if(O)return;O=Ne("dock:html-changed",()=>{r.editingId||r.dragging||(e.clearTimeout(K),K=e.setTimeout(()=>{$(e.document)&&P(e)},80))})}function En(e){O?.(),O=null,e?.clearTimeout?.(K),K=0}function Y(e){const t=$(e.document);if(ee({source:"statamic-visual-editor",type:"sve-html-pick",on:!1},e),En(e),ie(),F(),Ue(e),S=null,r.inspect=null,r.editingId=null,r.draft="",!t){x.syncPreviewInset(e);return}t.remove(),Ze.headerTab==="html_tree"&&qe(e,null),ze(e),x.persistDockedPanel(e),me(e),x.syncPreviewInset(e)}function wn(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=B,te(t,ve,{title:h(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>Y(e)))}function Mn(e){Q(e),P(e)}function Ee(e){const t=e.document;if(!x.featureOn(e,"html_tree"))return;if($(t)){Q(e),P(e);return}if(!Ce(t))return;x.closeRightPanels(e,[B]);const o=t.createElement("div");o.id=B,o.style.cssText=Oe,te(o,ve,{title:h(e,"html_tree")}),o.querySelector("[data-sve-close]")?.addEventListener("click",()=>Y(e)),Ke(e,o),x.persistDockedPanel(e),me(e),x.syncPreviewInset(e),Q(e),P(e)}function Sn(e){if($(e.document)){Y(e);return}Ee(e)}Fe("html-tree:from-preview",({path:e}={})=>{Hn(window,e)});x.HTML_TREE_PANEL_ID=B;x.htmlTreePanel=$;x.closeHtmlTreePanel=Y;x.fillHtmlTreePane=wn;x.showHtmlTreePane=Mn;x.openHtmlTreePanel=Ee;x.toggleHtmlTreePanel=Sn;x.renderHtmlTree=P;export{B as HTML_TREE_PANEL_ID,ue as HTML_TREE_STYLE_ID,F as closeHtmlTreeMenu,Y as closeHtmlTreePanel,pn as ensureHtmlTreeStyles,wn as fillHtmlTreePane,S as htmlTreeActiveId,I as htmlTreeCollapsed,$ as htmlTreePanel,K as htmlTreeTimer,O as htmlTreeUnhook,Ee as openHtmlTreePanel,P as renderHtmlTree,Mn as showHtmlTreePane,En as stopWatchHtmlTreeDock,Sn as toggleHtmlTreePanel,Q as watchHtmlTreeDock};
