const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-B9daJWrZ.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{r as we,_ as q,u as d,o as m,c as g,a as I,t as _,f as p,w as $,d as P,b as Ce,K as Pe,m as K,F as de,e as ue,L as He,M as Ee,N as oe,O as Me,P as $e,n as Se,Q as v,S as pe,j as f,T as Ie,J as Le,x as W,s as y,h as De,B as fe,i as J,R as Ae,C as Re,U as Be,E as je,G as Oe,V as ze}from"./addon-CDw4TaaS.js";import{i as he,t as Ne,c as qe,p as Fe,f as Ze,a as Ke}from"./tw-overlay-D4w1EFfg.js";import{a as Ve}from"./html-pick-align-BQgDq65Q.js";const i=we({emptyText:"",rows:[],editingId:null,draft:"",renameTitle:"",hideTitle:"",showTitle:"",duplicateTitle:"",deleteTitle:"",canEdit:!1,dragging:!1,dropId:null,dropPlace:null,onSelect:null,onTwist:null,tagTitle:"",onTagChange:null,onRename:null,onRenameCommit:null,onRenameCancel:null,onHide:null,onDuplicate:null,onDelete:null,onPointerDown:null,onContext:null,inspect:null,onInspectCommit:null}),Ue={key:0,class:"sve-ht-inspect"},Xe={class:"sve-ht-inspect__head"},Ye=["value","placeholder","disabled","onKeydown"],We={key:1,class:"sve-ht-inspect__note"},Je={__name:"HtmlTreeInspector",setup(e){function t(o){i.onInspectCommit?.(o.target.value)}return(o,n)=>d(i).inspect?(m(),g("div",Ue,[I("div",Xe,_(d(i).inspect.title),1),d(i).inspect.editable?(m(),g("input",{key:d(i).inspect.key,type:"text",value:d(i).inspect.value,placeholder:d(i).inspect.placeholder,disabled:!d(i).canEdit,spellcheck:"false",onKeydown:[n[0]||(n[0]=p(()=>{},["stop"])),$(p(t,["prevent"]),["enter"])],onBlur:t},null,40,Ye)):(m(),g("div",We,_(d(i).inspect.note),1))])):P("",!0)}},Ge=q(Je,[["__scopeId","data-v-32eb168d"]]),Qe={class:"sve-html-tree"},et={class:"sve-pane-bar","data-sve-pane-bar":""},tt={"data-sve-right-title":""},nt={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){return(t,o)=>(m(),g("div",Qe,[I("div",et,[I("div",tt,_(e.title),1),o[0]||(o[0]=Ce('<div data-sve-right-actions data-v-0bfee450><button type="button" data-sve-right-pin aria-pressed="false" data-v-0bfee450></button><button type="button" data-sve-close aria-label="Close" data-v-0bfee450><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-0bfee450><path d="M18 6 6 18" data-v-0bfee450></path><path d="m6 6 12 12" data-v-0bfee450></path></svg></button></div>',1))]),o[1]||(o[1]=I("div",{"data-sve-html-tree-list":""},null,-1)),Pe(Ge)]))}},me=q(nt,[["__scopeId","data-v-0bfee450"]]),ot={key:0,class:"sve-ht-empty"},rt=["title","onClick","onDblclick","onKeydown","onPointerdown","onContextmenu"],st=["onClick"],it={key:1,"data-sve-ht-letter":""},lt=["innerHTML"],at=["title"],ct=["title","onClick"],dt={key:1,"data-sve-ht-kind":""},ut={key:3,"data-sve-ht-name":""},pt={key:3,"data-sve-ht-actions":""},ft=["title","innerHTML","onClick"],ht=["title","onClick"],mt=["title","onClick"],gt='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',vt='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',kt='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',yt='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',xt='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',Tt={__name:"HtmlTreeList",setup(e){function t(l){return l.kind==="component"?l.src?`partial:${l.src}`:l.tag:l.name?`${l.tag} ${l.name}`:l.tag}function o(l){const s={"data-sve-ht-id":l.id};return l.current&&(s["data-sve-ht-current"]=""),l.hidden&&(s["data-sve-ht-hidden"]=""),i.dropId===l.id&&i.dropPlace&&(s["data-sve-ht-drop"]=i.dropPlace),s}function n(l){return!l.hidden||l.wrapFrom!=null}return(l,s)=>(m(),g("div",K({class:"sve-ht-root"},d(i).dragging?{"data-sve-ht-dragging":""}:{}),[d(i).rows.length?P("",!0):(m(),g("div",ot,_(d(i).emptyText),1)),(m(!0),g(de,null,ue(d(i).rows,r=>(m(),g("div",K({key:r.id,"data-sve-ht-row":""},{ref_for:!0},o(r),{role:"button",tabindex:"0",title:t(r),style:{marginLeft:r.depth*12+"px"},onClick:a=>d(i).onSelect?.(r.id),onDblclick:p(a=>d(i).onRename?.(r.id),["prevent"]),onKeydown:[$(p(a=>d(i).onSelect?.(r.id),["prevent"]),["enter"]),$(p(a=>d(i).onSelect?.(r.id),["prevent"]),["space"])],onPointerdown:a=>d(i).onPointerDown?.(a,r.id),onContextmenu:p(a=>d(i).onContext?.(a,r.id),["prevent","stop"])}),[r.hasChildren?(m(),g("button",K({key:0,type:"button","data-sve-ht-twist":""},{ref_for:!0},r.shut?{"data-sve-ht-shut":""}:{},{innerHTML:gt,onClick:p(a=>d(i).onTwist?.(r.id),["stop","prevent"]),onPointerdown:s[0]||(s[0]=p(()=>{},["stop"])),onDblclick:s[1]||(s[1]=p(()=>{},["stop"]))}),null,16,st)):P("",!0),r.letter?(m(),g("span",it,_(r.letter),1)):(m(),g("span",{key:2,"data-sve-ht-icon":"",innerHTML:r.svg},null,8,lt)),I("span",{"data-sve-ht-text":"",title:d(i).renameTitle},[r.kind!=="component"?(m(),g("button",{key:0,type:"button","data-sve-ht-tag":"",title:d(i).tagTitle,onClick:p(a=>d(i).onTagChange?.(a,r.id),["stop","prevent"]),onPointerdown:s[2]||(s[2]=p(()=>{},["stop"])),onDblclick:s[3]||(s[3]=p(()=>{},["stop"]))},_(r.tag),41,ct)):(m(),g("span",dt,_(r.tag),1)),d(i).editingId===r.id?He((m(),g("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":s[4]||(s[4]=a=>d(i).draft=a),onMousedown:s[5]||(s[5]=p(()=>{},["stop"])),onPointerdown:s[6]||(s[6]=p(()=>{},["stop"])),onClick:s[7]||(s[7]=p(()=>{},["stop"])),onDblclick:s[8]||(s[8]=p(()=>{},["stop"])),onKeydown:[s[9]||(s[9]=p(()=>{},["stop"])),s[10]||(s[10]=$(p(a=>d(i).onRenameCommit?.(),["prevent"]),["enter"])),s[11]||(s[11]=$(p(a=>d(i).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:s[12]||(s[12]=a=>d(i).onRenameCommit?.())},null,544)),[[Ee,d(i).draft]]):(m(),g("span",ut,_(r.name),1))],8,at),d(i).canEdit?(m(),g("span",pt,[d(i).canEdit&&n(r)?(m(),g("button",{key:0,type:"button","data-sve-ht-eye":"",title:r.hidden?d(i).showTitle:d(i).hideTitle,innerHTML:r.hidden?kt:vt,onClick:p(a=>d(i).onHide?.(r.id),["stop","prevent"]),onPointerdown:s[13]||(s[13]=p(()=>{},["stop"])),onDblclick:s[14]||(s[14]=p(()=>{},["stop"]))},null,40,ft)):P("",!0),d(i).canEdit?(m(),g("button",{key:1,type:"button","data-sve-ht-dup":"",title:d(i).duplicateTitle,innerHTML:yt,onClick:p(a=>d(i).onDuplicate?.(r.id),["stop","prevent"]),onPointerdown:s[15]||(s[15]=p(()=>{},["stop"])),onDblclick:s[16]||(s[16]=p(()=>{},["stop"]))},null,40,ht)):P("",!0),d(i).canEdit?(m(),g("button",{key:2,type:"button","data-sve-ht-del":"",title:d(i).deleteTitle,innerHTML:xt,onClick:p(a=>d(i).onDelete?.(r.id),["stop","prevent"]),onPointerdown:s[17]||(s[17]=p(()=>{},["stop"])),onDblclick:s[18]||(s[18]=p(()=>{},["stop"]))},null,40,mt)):P("",!0)])):P("",!0)],16,rt))),128))],16))}},bt=q(Tt,[["__scopeId","data-v-e030b125"]]);function U(e,t){for(const o of e||[]){if(o.id===t)return o;const n=U(o.children,t);if(n)return n}return null}function ge(e,t){return(e.children||[]).some(o=>o.id===t||ge(o,t))}function H(e,t){let o=t.wrapFrom??t.from,n=t.wrapTo??t.to;return o>0&&e[o-1]===`
`&&(o-=1),{from:o,to:n}}function _t(e,t){const o=e.slice(t.from,t.to);if(t.kind==="antlers"){const s=o.match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return s?t.from+s.index:t.to}const n=`</${t.tag}`,l=o.toLowerCase().lastIndexOf(n);return l===-1?t.to:t.from+l}function V(e,t,o){return e>=t+o?e-o:e>t?t:e}function wt(e,t,o,n,l){const s=U(t,o),r=U(t,n);if(!e||!s||!r||o===n||ge(s,n))return e;let a=l;a==="inside"&&(he(r.tag)||r.wrapFrom!=null)&&(a="after");const u=H(e,s),c=e.slice(u.from,u.to);if(!c)return e;const h=e.slice(0,u.from)+e.slice(u.to),x=u.to-u.from;let k;a==="before"?k=V(H(e,r).from,u.from,x):a==="inside"?k=V(_t(e,r),u.from,x):k=V(H(e,r).to,u.from,x),k=Math.max(0,Math.min(k,h.length));let T=c;return k>0&&h[k-1]!==`
`&&T[0]!==`
`&&(T=`
${T}`),h.slice(0,k)+T+h.slice(k)}function Ct(e,t){if(!e||!t)return e;if(t.wrapFrom!=null&&t.wrapTo!=null){const o=e.slice(t.wrapFrom+4,t.wrapTo-3);return e.slice(0,t.wrapFrom)+o+e.slice(t.wrapTo)}return t.hidden?e:`${e.slice(0,t.from)}<!--${e.slice(t.from,t.to)}-->${e.slice(t.to)}`}function Pt(e,t,o){const n=e/Math.max(t,1);return o&&n>.32&&n<.68?"inside":n<.5?"before":"after"}function Ht(e,t){if(!e||!t)return e;const{from:o,to:n}=H(e,t);let l=e.slice(o,n);return l?(l.startsWith(`
`)||(l=`
${l}`),e.slice(0,n)+l+e.slice(n)):e}function Et(e,t){if(!e||!t)return e;const{from:o,to:n}=H(e,t);return e.slice(0,o)+e.slice(n)}const ve="sve-html-tree-labels";function ke(){try{const e=globalThis.localStorage?.getItem(ve);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function Mt(e){try{globalThis.localStorage?.setItem(ve,JSON.stringify(e))}catch{}}function ye(e){return String(e||"_")}function $t(e){const t=ke()[ye(e)];return t&&typeof t=="object"?{...t}:{}}function St(e,t,o){const n=o?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function It(e,t,o,n){if(!t)return;const l=ye(e),s=ke(),r={...s[l]||{}},a=String(o||"").replace(/\s+/g," ").trim(),u=String(n||"").trim();!a||a===u?delete r[t]:r[t]=a,Object.keys(r).length?s[l]=r:delete s[l],Mt(s)}const b={div:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><rect x="2.5" y="3.5" width="11" height="9" rx="1.2" stroke-dasharray="2.6 2"/></svg>',section:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="2" y="2.5" width="12" height="11" rx="1.4"/><path d="M2 6.2h12" stroke-width="2.2"/></svg>',ul:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="4" r="1"/><circle cx="3.2" cy="8" r="1"/><circle cx="3.2" cy="12" r="1"/><rect x="5.5" y="3.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="7.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="11.2" width="8" height="1.5" rx=".4"/></svg>',li:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="8" r="1.1"/><rect x="5.5" y="7.2" width="8" height="1.6" rx=".4"/></svg>',a:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M6.2 8.8 4.8 10.2a2.2 2.2 0 0 0 3.1 3.1l1.8-1.8"/><path d="M9.8 7.2l1.4-1.4a2.2 2.2 0 0 0-3.1-3.1L6.3 4.5"/></svg>',img:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="3" width="12" height="10" rx="1.2"/><circle cx="5.5" cy="6.2" r="1.1"/><path d="M2.8 12.2 6.2 9l2.2 2.2 2-1.8 2.8 2.8"/></svg>',if:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2.5v3.2a2 2 0 0 0 2 2h6"/><path d="M10 5.4 12.6 7.7 10 10"/><path d="M4 13.5v-2"/></svg>',loop:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.2 6.4A2.4 2.4 0 0 1 6.8 5l2.6 2.6a2.4 2.4 0 0 0 3.4-3.4"/><path d="M12.8 9.6A2.4 2.4 0 0 1 9.2 11L6.6 8.4a2.4 2.4 0 0 0-3.4 3.4"/></svg>',component:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M8 1.6 13.4 4.8v6.4L8 14.4 2.6 11.2V4.8Z"/><path d="M2.6 4.8 8 8l5.4-3.2M8 8v6.4"/></svg>',other:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M5.2 3.5 2.8 8l2.4 4.5"/><path d="M10.8 3.5 13.2 8l-2.4 4.5"/></svg>'};function Lt(e,t,o){return t==="component"?{svg:b.component}:t==="antlers"?{svg:o==="loop"?b.loop:b.if}:/^h[1-6]$/.test(e)?{letter:"H"}:e==="p"?{letter:"P"}:e==="div"?{svg:b.div}:e==="section"||e==="article"||e==="header"||e==="footer"||e==="main"||e==="nav"||e==="aside"?{svg:b.section}:e==="ul"||e==="ol"?{svg:b.ul}:e==="li"?{svg:b.li}:e==="a"?{svg:b.a}:e==="img"||e==="picture"||e==="svg"?{svg:b.img}:{svg:b.other}}const Dt=["disabled","onClick"],At={__name:"HtmlTreeMenu",props:{items:{type:Array,required:!0},x:{type:Number,required:!0},y:{type:Number,required:!0},onClose:{type:Function,required:!0}},setup(e){const t=e,o=oe(null),n=oe({left:`${t.x}px`,top:`${t.y}px`});function l(r){o.value?.contains(r.target)||t.onClose()}function s(r){r.key==="Escape"&&t.onClose()}return Me(()=>{const r=o.value?.getBoundingClientRect();if(r){const a=Math.min(t.x,window.innerWidth-r.width-8),u=Math.min(t.y,window.innerHeight-r.height-8);n.value={left:`${Math.max(8,a)}px`,top:`${Math.max(8,u)}px`}}document.addEventListener("pointerdown",l,!0),document.addEventListener("keydown",s,!0),window.addEventListener("scroll",t.onClose,!0)}),$e(()=>{document.removeEventListener("pointerdown",l,!0),document.removeEventListener("keydown",s,!0),window.removeEventListener("scroll",t.onClose,!0)}),(r,a)=>(m(),g("div",{ref_key:"menu",ref:o,class:"sve-ht-menu",style:Se(n.value)},[(m(!0),g(de,null,ue(e.items,u=>(m(),g("button",{key:u.label,type:"button",disabled:!u.onPick,onClick:c=>u.onPick?.()},_(u.label),9,Dt))),128))],4))}},Rt=q(At,[["__scopeId","data-v-7e205566"]]),Bt=/^@(media|supports|container|layer|scope)\b/i;function jt(e){const t=String(e||""),o=[];let n=0,l=0;for(;n<t.length;){if(t[n]==="{"&&t[n+1]==="{"){const a=t.indexOf("}}",n+2);n=a===-1?t.length:a+2;continue}if(t[n]==="/"&&t[n+1]==="*"){const a=t.indexOf("*/",n+2);n=a===-1?t.length:a+2;continue}if(t[n]==='"'||t[n]==="'"){const a=t[n];for(n+=1;n<t.length&&t[n]!==a;)n+=t[n]==="\\"?2:1;n+=1;continue}if(t[n]!=="{"){n+=1;continue}let s=1,r=n+1;for(;r<t.length&&s>0;){if(t[r]==="{"&&t[r+1]==="{"){const a=t.indexOf("}}",r+2);r=a===-1?t.length:a+2;continue}if(t[r]==="/"&&t[r+1]==="*"){const a=t.indexOf("*/",r+2);r=a===-1?t.length:a+2;continue}if(t[r]==='"'||t[r]==="'"){const a=t[r];for(r+=1;r<t.length&&t[r]!==a;)r+=t[r]==="\\"?2:1;r+=1;continue}t[r]==="{"?s+=1:t[r]==="}"&&(s-=1),r+=1}o.push({selector:t.slice(l,n).trim(),body:t.slice(n+1,r-1),from:l,to:r,text:t.slice(l,r).trim()}),n=r,l=r}return o}function re(e){const t=String(e||""),o=new Set,n=new Set,l=new Set;for(const s of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const r of s[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))r&&(o.add(r),o.add(r.replace(/([:./%!#()[\],])/g,"\\$1")));for(const s of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))s[2].trim()&&n.add(s[2].trim());for(const s of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))l.add(s[1].toLowerCase());return{classes:o,ids:n,tags:l}}function se(e,t){const o=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),n=[...o.matchAll(/\.((?:\\.|[\w-])+)/g)].map(r=>r[1]),l=[...o.matchAll(/#((?:\\.|[\w-])+)/g)].map(r=>r[1]);if(n.length||l.length){const r=a=>a.replace(/\\(.)/g,"$1");return n.every(a=>t.classes.has(a)||t.classes.has(r(a)))&&l.every(a=>t.ids.has(r(a)))}const s=[...o.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(r=>r[2].toLowerCase());return s.length>0&&s.every(r=>t.tags.has(r))}function Ot(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function zt(e,t,o){const n=Ot(e);if(!n.length)return"keep";const l=n.filter(r=>se(r,t));return l.length?l.length===n.length&&!n.some(r=>se(r,o))?"move":"copy":"keep"}function xe(e,t,o){const n=String(e||""),l=re(t),s=re(o),r=[],a=[];let u=0;for(const c of jt(n)){const h=n.slice(c.from,c.to),x=h.match(/^\s*/)[0];if(u=c.to,Bt.test(c.selector)){const T=xe(c.body,t,o);T.move.trim()&&r.push(`${c.selector} {
${T.move.trim()}
}`),T.keep.trim()&&a.push(`${x}${c.selector} {
${T.keep.trim()}
}`);continue}const k=c.selector.startsWith("@")?"keep":zt(c.selector,l,s);if(k==="move"){r.push(c.text);continue}k==="copy"&&r.push(c.text),a.push(h)}return a.push(n.slice(u)),{move:r.join(`

`).trim(),keep:a.join("").replace(/\n{3,}/g,`

`).trim()}}const Nt="/!/sve/component";function qt(e){return e.document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")||e.Statamic?.$config?.get?.("csrfToken")||e.Statamic?.$config?.get?.("csrf_token")||""}function Ft(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let o=null;for(const n of t){if(!n.trim())continue;const l=n.match(/^[ \t]*/)[0].length;o=o===null?l:Math.min(o,l)}return o?t.map(n=>n.slice(o)).join(`
`):t.join(`
`)}function Zt(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function Kt(e,t){if(!Ne(e))return"";try{return await(await Le(()=>import("./tw-compile-B9daJWrZ.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(o){return console.error("[sve] component tailwind compile",o),""}}async function Vt(e,t){const o=await e.fetch(Nt,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":qt(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!o.ok){const n=new Error(String(o.status));throw n.status=o.status,n}return o.json()}function ie(e,t){const{from:o,to:n}=H(e,t),l=e.slice(o,n);if(!l.trim())return null;const s=e.slice(0,o)+e.slice(n),r=v("dock:css"),a=xe(typeof r=="string"?r:"",l,s);return{html:Ft(l),css:a.move,keepCss:a.keep,lead:Zt(l),from:o,to:n}}function Ut(e,t,{onDone:o,onError:n}={}){if(v("dock:is-locked")===!0)return;const l=v("dock:html");if(typeof l!="string"||!t)return;const s=ie(l,t);if(!s)return;const r=pe(e.document,Ie,{heading:f(e,"component_new"),nameLabel:f(e,"component_name"),placeholder:f(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:f(e,"cancel"),saveLabel:f(e,"component_create"),onOk:a=>{r.dismiss(),(async()=>{try{const u=await Kt(e,s.html),c=v("dock:html"),h=typeof c=="string"&&c===l?s:ie(c,t);if(!h)return;const x=await Vt(e,{name:a,html:h.html,css:h.css,js:"",tw:u}),k=v("dock:html"),T=k.slice(0,h.from)+h.lead+x.tag+k.slice(h.to);v("dock:set-html",T),h.css.trim()&&v("dock:set-css",h.keepCss),o?.(x)}catch(u){n?.(u)}})()}})}function Xt(e,t,o){const n=String(e||"");if(!t||t.kind!=="antlers")return n;const l=String(o||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?Yt(n,t,l):t.tag==="else"||!l?n:n.slice(0,t.from)+`{{ ${t.tag} ${l} }}`+n.slice(t.openTo)}function Yt(e,t,o){if(!/^[A-Za-z_][A-Za-z0-9_.:-]*$/.test(o)||o===t.tag)return e;const n=e.slice(t.from,t.to).lastIndexOf(`{{ /${t.tag}`);if(n===-1)return e;const l=t.from+n,s=e.indexOf("}}",l);return s===-1||s+2>t.to?e:e.slice(0,t.from)+`{{ ${o} }}`+e.slice(t.openTo,l)+`{{ /${o} }}`+e.slice(s+2)}const A="__sve-html-tree-panel",le="__sve-html-tree-style",S=new Set;let M=null,R=null,B=0,G=[],E=null,L=null,j=null,O=null,X=null,z=!1,D=null;function C(e){return e.getElementById(A)}function Wt(e){let t=e.getElementById(le);t||(t=e.createElement("style"),t.id=le,e.head.appendChild(t)),t.textContent=`
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
  `}function F(){const e=v("dock:html");return typeof e=="string"?e:""}function Te(e){return!!v("dock:is-open",e)}function Q(e){return v("dock:set-html",e)===!0}function w(e){const t=e.document,n=C(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;Wt(t);const l=F(),s=Fe(l);G=s;const r=Ze(s,S),a=v("dock:current-type")||"",u=$t(a);!l.trim()&&!Te(t)?i.emptyText=f(e,"html_tree_need_dock"):i.emptyText=f(e,"html_tree_empty"),i.renameTitle=f(e,"html_tree_rename"),i.tagTitle=f(e,"tw_tag"),i.hideTitle=f(e,"html_tree_hide"),i.showTitle=f(e,"html_tree_show"),i.duplicateTitle=f(e,"html_tree_duplicate"),i.deleteTitle=f(e,"html_tree_delete"),i.canEdit=!v("dock:is-locked"),i.onSelect=c=>ne(e,c,r),i.onTwist=c=>{S.has(c)?S.delete(c):S.add(c),w(e)},i.onTagChange=(c,h)=>{const x=i.rows.find(k=>k.id===h);x&&Ke(e,c.currentTarget,x)},i.onRename=c=>Qt(e,c),i.onRenameCommit=()=>ae(e,!0),i.onRenameCancel=()=>ae(e,!1),i.onHide=c=>en(e,c),i.onDuplicate=c=>tn(e,c),i.onDelete=c=>nn(e,c),i.onPointerDown=(c,h)=>sn(e,c,h),i.onContext=(c,h)=>on(e,c,h),i.onInspectCommit=c=>cn(e,c),i.rows=r.map(c=>{const h=Lt(c.tag,c.kind,c.antlers);return{...c,name:St(c.klass,c.path,u),current:c.id===M,letter:h.letter||"",svg:h.svg||""}}),be(e,i.rows.find(c=>c.id===M)),J(n,bt),Jt(e,s)}function Jt(e,t){if(!C(e.document))return;const o=t[0];W({source:"statamic-visual-editor",type:"sve-html-pick",on:!0,uid:v("dock:current-uid")||"",tag:o?.tag||"",klass:o?.klass||"",nodes:Ve(t)},e)}function Gt(e){if(!e)return;const t=[],o=String(e).split("/");for(let l=0;l<o.length;l+=1)t.push(o.slice(0,l+1).join("/"));const n=l=>{for(const s of l||[])t.includes(s.path)&&S.delete(s.id),n(s.children)};n(G)}function Qt(e,t){if(z)return;const o=i.rows.find(n=>n.id===t);!o||o.kind||(M=t,i.rows.forEach(n=>{n.current=n.id===t}),i.editingId=t,i.draft=o.name,e.setTimeout(()=>{const n=C(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function ae(e,t){const o=i.editingId;if(!o)return;const n=i.rows.find(l=>l.id===o);i.editingId=null,t&&n&&It(v("dock:current-type")||"",n.path,i.draft,n.klass),i.draft="",w(e)}function en(e,t){ee(e,t,Ct)}function tn(e,t){ee(e,t,Ht)}function nn(e,t){ee(e,t,Et)}function ee(e,t,o){if(v("dock:is-locked"))return;const n=F(),l=i.rows.find(r=>r.id===t);if(!l)return;const s=o(n,l);s!==n&&Q(s)}function N(){D?.dismiss(),D=null}function on(e,t,o){N();const n=i.rows.find(r=>r.id===o);if(!n)return;ne(e,o,i.rows);const l={x:t.clientX,y:t.clientY},s=r=>{r.length&&(D?.dismiss(),D=pe(e.document,Rt,{items:r,x:l.x,y:l.y,onClose:()=>{D=null}}))};if(n.kind==="component"){rn(e,n,s);return}i.canEdit&&s([{label:f(e,"component_make"),onPick:()=>{N(),Ut(e,n,{onDone:()=>w(e),onError:r=>{e.alert(r?.status===409?f(e,"component_exists"):f(e,"component_failed"))}})}}])}const ce=(e,t)=>{N(),v("dock:open-template",t)};function rn(e,t,o){if(!/\{[A-Za-z_][A-Za-z0-9_]*\}/.test(t.src)){o([{label:f(e,"component_open_named",{name:t.name||t.src}),onPick:()=>ce(e,`view:partials/${t.src}`)}]);return}o([{label:f(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const l=Array.isArray(n.items)?n.items:[];o(l.length?l.map(s=>({label:f(e,"component_open_named",{name:s.label}),onPick:()=>ce(e,s.type)})):[{label:f(e,"component_none"),onPick:null}])}).catch(()=>o([{label:f(e,"component_none"),onPick:null}]))}function sn(e,t,o){if(t.button!==0||v("dock:is-locked")||i.editingId||t.target?.closest?.("button, input"))return;te(),E=o,L={x:t.clientX,y:t.clientY},j=t.currentTarget,O=t.pointerId;const n=s=>ln(e,s),l=s=>an(e,s);X=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",l,!0),e.document.removeEventListener("pointercancel",l,!0),X=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",l,!0),e.document.addEventListener("pointercancel",l,!0)}function ln(e,t){if(!E||!L)return;const o=t.clientX-L.x,n=t.clientY-L.y;if(!i.dragging&&o*o+n*n<25)return;if(!i.dragging){i.dragging=!0;try{j?.setPointerCapture?.(O)}catch{}}t.preventDefault();const l=e.document.elementFromPoint(t.clientX,t.clientY)?.closest?.("[data-sve-ht-row]"),s=l?.getAttribute("data-sve-ht-id");if(!s||s===E){i.dropId=null,i.dropPlace=null;return}const r=i.rows.find(c=>c.id===s),a=i.rows.find(c=>c.id===E);if(!r||a&&r.path.startsWith(`${a.path}/`)){i.dropId=null,i.dropPlace=null;return}const u=l.getBoundingClientRect();i.dropId=s,i.dropPlace=Pt(t.clientY-u.top,u.height,!he(r.tag)&&r.kind!=="component")}function an(e,t){const o=E,n=i.dropId,l=i.dropPlace||"after",s=i.dragging;if(te(),s&&(z=!0,e.setTimeout(()=>{z=!1},0)),!s||v("dock:is-locked")||!o||!n||o===n)return;t?.preventDefault?.();const r=F(),a=wt(r,G,o,n,l);a!==r&&Q(a)}function te(){try{j?.releasePointerCapture?.(O)}catch{}X?.(),E=null,L=null,j=null,O=null,i.dragging=!1,i.dropId=null,i.dropPlace=null}function be(e,t){if(t?.kind!=="antlers"){i.inspect=null;return}const o=t.antlers==="loop";i.inspect={key:`${t.id}:${t.expr}`,title:f(e,o?"antlers_loop":"antlers_condition"),editable:t.tag!=="else",note:f(e,"antlers_else_note"),placeholder:f(e,o?"antlers_loop_placeholder":"antlers_condition_placeholder"),value:t.expr||""}}function cn(e,t){const o=i.rows.find(s=>s.id===M);if(!o||o.kind!=="antlers"||v("dock:is-locked"))return;const n=F(),l=Xt(n,o,t);l!==n&&Q(l)}function ne(e,t,o){if(z)return;const n=(o||i.rows).find(l=>l.id===t);n&&(M=t,i.rows.forEach(l=>{l.current=l.id===t}),be(e,n),v("dock:reveal-html",{from:n.from,to:n.to}),v("dock:tw-follow"),W({source:"statamic-visual-editor",type:"sve-html-pick-focus",path:n.path},e))}function dn(e,t){if(!t||!C(e.document))return;Gt(t),w(e);const o=i.rows.find(n=>n.path===t);o&&ne(e,o.id,i.rows)}function Y(e){if(R)return;R=Be("dock:html-changed",()=>{i.editingId||i.dragging||(e.clearTimeout(B),B=e.setTimeout(()=>{C(e.document)&&w(e)},80))})}function un(e){R?.(),R=null,e?.clearTimeout?.(B),B=0}function Z(e){const t=C(e.document);if(W({source:"statamic-visual-editor",type:"sve-html-pick",on:!1},e),un(e),te(),N(),qe(e),M=null,i.inspect=null,i.editingId=null,i.draft="",!t){y.syncPreviewInset(e);return}t.remove(),je.headerTab==="html_tree"&&Oe(e,null),De(e),y.persistDockedPanel(e),fe(e),y.syncPreviewInset(e)}function pn(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=A,J(t,me,{title:f(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>Z(e)))}function fn(e){Y(e),w(e)}function _e(e){const t=e.document;if(!y.featureOn(e,"html_tree"))return;if(C(t)){Y(e),w(e);return}if(!Te(t))return;y.closeRightPanels(e,[A]);const o=t.createElement("div");o.id=A,o.style.cssText=Ae,J(o,me,{title:f(e,"html_tree")}),o.querySelector("[data-sve-close]")?.addEventListener("click",()=>Z(e)),Re(e,o),y.persistDockedPanel(e),fe(e),y.syncPreviewInset(e),Y(e),w(e)}function hn(e){if(C(e.document)){Z(e);return}_e(e)}ze("html-tree:from-preview",({path:e}={})=>{dn(window,e)});y.HTML_TREE_PANEL_ID=A;y.htmlTreePanel=C;y.closeHtmlTreePanel=Z;y.fillHtmlTreePane=pn;y.showHtmlTreePane=fn;y.openHtmlTreePanel=_e;y.toggleHtmlTreePanel=hn;y.renderHtmlTree=w;export{A as HTML_TREE_PANEL_ID,le as HTML_TREE_STYLE_ID,N as closeHtmlTreeMenu,Z as closeHtmlTreePanel,Wt as ensureHtmlTreeStyles,pn as fillHtmlTreePane,M as htmlTreeActiveId,S as htmlTreeCollapsed,C as htmlTreePanel,B as htmlTreeTimer,R as htmlTreeUnhook,_e as openHtmlTreePanel,w as renderHtmlTree,fn as showHtmlTreePane,un as stopWatchHtmlTreeDock,hn as toggleHtmlTreePanel,Y as watchHtmlTreeDock};
