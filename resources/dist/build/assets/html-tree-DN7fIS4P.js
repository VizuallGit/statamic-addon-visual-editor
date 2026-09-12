const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-B9daJWrZ.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{_ as W,o as m,c as g,a as $,t as C,b as be,r as we,m as q,u as d,d as P,F as ae,e as ce,f as p,w as I,K as _e,L as Ce,M as ne,N as Pe,O as He,n as Ee,P as h,Q as de,j as v,S as Me,J as Se,x as X,s as x,h as Le,B as ue,i as Z,R as Ie,C as $e,T as De,E as Re,G as Be,U as Ae}from"./addon-1HDb-ect.js";import{i as pe,t as je,c as Oe,p as Ne,f as ze,a as Fe}from"./tw-overlay-Dv3RnZ1d.js";import{a as qe}from"./html-pick-align-Cjtvi4Nz.js";const Ke={class:"sve-html-tree"},Ve={class:"sve-pane-bar","data-sve-pane-bar":""},Ye={"data-sve-right-title":""},Ue={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){return(t,r)=>(m(),g("div",Ke,[$("div",Ve,[$("div",Ye,C(e.title),1),r[0]||(r[0]=be('<div data-sve-right-actions data-v-b4ff8e88><button type="button" data-sve-right-pin aria-pressed="false" data-v-b4ff8e88></button><button type="button" data-sve-close aria-label="Close" data-v-b4ff8e88><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-b4ff8e88><path d="M18 6 6 18" data-v-b4ff8e88></path><path d="m6 6 12 12" data-v-b4ff8e88></path></svg></button></div>',1))]),r[1]||(r[1]=$("div",{"data-sve-html-tree-list":""},null,-1))]))}},fe=W(Ue,[["__scopeId","data-v-b4ff8e88"]]),l=we({emptyText:"",rows:[],editingId:null,draft:"",renameTitle:"",hideTitle:"",showTitle:"",duplicateTitle:"",deleteTitle:"",canEdit:!1,dragging:!1,dropId:null,dropPlace:null,onSelect:null,onTwist:null,tagTitle:"",onTagChange:null,onRename:null,onRenameCommit:null,onRenameCancel:null,onHide:null,onDuplicate:null,onDelete:null,onPointerDown:null,onContext:null}),We={key:0,class:"sve-ht-empty"},Xe=["title","onClick","onDblclick","onKeydown","onPointerdown","onContextmenu"],Ze=["onClick"],Je={key:1,"data-sve-ht-letter":""},Ge=["innerHTML"],Qe=["title"],et=["title","onClick"],tt={key:1,"data-sve-ht-kind":""},nt={key:3,"data-sve-ht-name":""},ot={key:3,"data-sve-ht-actions":""},rt=["title","innerHTML","onClick"],it=["title","onClick"],st=["title","onClick"],lt='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',at='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',ct='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',dt='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',ut='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',pt={__name:"HtmlTreeList",setup(e){function t(s){return s.kind==="component"?s.src?`partial:${s.src}`:s.tag:s.name?`${s.tag} ${s.name}`:s.tag}function r(s){const i={"data-sve-ht-id":s.id};return s.current&&(i["data-sve-ht-current"]=""),s.hidden&&(i["data-sve-ht-hidden"]=""),l.dropId===s.id&&l.dropPlace&&(i["data-sve-ht-drop"]=l.dropPlace),i}function n(s){return!s.hidden||s.wrapFrom!=null}return(s,i)=>(m(),g("div",q({class:"sve-ht-root"},d(l).dragging?{"data-sve-ht-dragging":""}:{}),[d(l).rows.length?P("",!0):(m(),g("div",We,C(d(l).emptyText),1)),(m(!0),g(ae,null,ce(d(l).rows,o=>(m(),g("div",q({key:o.id,"data-sve-ht-row":""},{ref_for:!0},r(o),{role:"button",tabindex:"0",title:t(o),style:{marginLeft:o.depth*12+"px"},onClick:a=>d(l).onSelect?.(o.id),onDblclick:p(a=>d(l).onRename?.(o.id),["prevent"]),onKeydown:[I(p(a=>d(l).onSelect?.(o.id),["prevent"]),["enter"]),I(p(a=>d(l).onSelect?.(o.id),["prevent"]),["space"])],onPointerdown:a=>d(l).onPointerDown?.(a,o.id),onContextmenu:p(a=>d(l).onContext?.(a,o.id),["prevent","stop"])}),[o.hasChildren?(m(),g("button",q({key:0,type:"button","data-sve-ht-twist":""},{ref_for:!0},o.shut?{"data-sve-ht-shut":""}:{},{innerHTML:lt,onClick:p(a=>d(l).onTwist?.(o.id),["stop","prevent"]),onPointerdown:i[0]||(i[0]=p(()=>{},["stop"])),onDblclick:i[1]||(i[1]=p(()=>{},["stop"]))}),null,16,Ze)):P("",!0),o.letter?(m(),g("span",Je,C(o.letter),1)):(m(),g("span",{key:2,"data-sve-ht-icon":"",innerHTML:o.svg},null,8,Ge)),$("span",{"data-sve-ht-text":"",title:d(l).renameTitle},[o.kind!=="component"?(m(),g("button",{key:0,type:"button","data-sve-ht-tag":"",title:d(l).tagTitle,onClick:p(a=>d(l).onTagChange?.(a,o.id),["stop","prevent"]),onPointerdown:i[2]||(i[2]=p(()=>{},["stop"])),onDblclick:i[3]||(i[3]=p(()=>{},["stop"]))},C(o.tag),41,et)):(m(),g("span",tt,C(o.tag),1)),d(l).editingId===o.id?_e((m(),g("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":i[4]||(i[4]=a=>d(l).draft=a),onMousedown:i[5]||(i[5]=p(()=>{},["stop"])),onPointerdown:i[6]||(i[6]=p(()=>{},["stop"])),onClick:i[7]||(i[7]=p(()=>{},["stop"])),onDblclick:i[8]||(i[8]=p(()=>{},["stop"])),onKeydown:[i[9]||(i[9]=p(()=>{},["stop"])),i[10]||(i[10]=I(p(a=>d(l).onRenameCommit?.(),["prevent"]),["enter"])),i[11]||(i[11]=I(p(a=>d(l).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:i[12]||(i[12]=a=>d(l).onRenameCommit?.())},null,544)),[[Ce,d(l).draft]]):(m(),g("span",nt,C(o.name),1))],8,Qe),d(l).canEdit?(m(),g("span",ot,[d(l).canEdit&&n(o)?(m(),g("button",{key:0,type:"button","data-sve-ht-eye":"",title:o.hidden?d(l).showTitle:d(l).hideTitle,innerHTML:o.hidden?ct:at,onClick:p(a=>d(l).onHide?.(o.id),["stop","prevent"]),onPointerdown:i[13]||(i[13]=p(()=>{},["stop"])),onDblclick:i[14]||(i[14]=p(()=>{},["stop"]))},null,40,rt)):P("",!0),d(l).canEdit?(m(),g("button",{key:1,type:"button","data-sve-ht-dup":"",title:d(l).duplicateTitle,innerHTML:dt,onClick:p(a=>d(l).onDuplicate?.(o.id),["stop","prevent"]),onPointerdown:i[15]||(i[15]=p(()=>{},["stop"])),onDblclick:i[16]||(i[16]=p(()=>{},["stop"]))},null,40,it)):P("",!0),d(l).canEdit?(m(),g("button",{key:2,type:"button","data-sve-ht-del":"",title:d(l).deleteTitle,innerHTML:ut,onClick:p(a=>d(l).onDelete?.(o.id),["stop","prevent"]),onPointerdown:i[17]||(i[17]=p(()=>{},["stop"])),onDblclick:i[18]||(i[18]=p(()=>{},["stop"]))},null,40,st)):P("",!0)])):P("",!0)],16,Xe))),128))],16))}},ft=W(pt,[["__scopeId","data-v-e030b125"]]);function V(e,t){for(const r of e||[]){if(r.id===t)return r;const n=V(r.children,t);if(n)return n}return null}function he(e,t){return(e.children||[]).some(r=>r.id===t||he(r,t))}function H(e,t){let r=t.wrapFrom??t.from,n=t.wrapTo??t.to;return r>0&&e[r-1]===`
`&&(r-=1),{from:r,to:n}}function ht(e,t){const r=e.slice(t.from,t.to),n=`</${t.tag}`,s=r.toLowerCase().lastIndexOf(n);return s===-1?t.to:t.from+s}function K(e,t,r){return e>=t+r?e-r:e>t?t:e}function mt(e,t,r,n,s){const i=V(t,r),o=V(t,n);if(!e||!i||!o||r===n||he(i,n))return e;let a=s;a==="inside"&&(pe(o.tag)||o.wrapFrom!=null)&&(a="after");const u=H(e,i),c=e.slice(u.from,u.to);if(!c)return e;const f=e.slice(0,u.from)+e.slice(u.to),y=u.to-u.from;let k;a==="before"?k=K(H(e,o).from,u.from,y):a==="inside"?k=K(ht(e,o),u.from,y):k=K(H(e,o).to,u.from,y),k=Math.max(0,Math.min(k,f.length));let T=c;return k>0&&f[k-1]!==`
`&&T[0]!==`
`&&(T=`
${T}`),f.slice(0,k)+T+f.slice(k)}function gt(e,t){if(!e||!t)return e;if(t.wrapFrom!=null&&t.wrapTo!=null){const r=e.slice(t.wrapFrom+4,t.wrapTo-3);return e.slice(0,t.wrapFrom)+r+e.slice(t.wrapTo)}return t.hidden?e:`${e.slice(0,t.from)}<!--${e.slice(t.from,t.to)}-->${e.slice(t.to)}`}function vt(e,t,r){const n=e/Math.max(t,1);return r&&n>.32&&n<.68?"inside":n<.5?"before":"after"}function kt(e,t){if(!e||!t)return e;const{from:r,to:n}=H(e,t);let s=e.slice(r,n);return s?(s.startsWith(`
`)||(s=`
${s}`),e.slice(0,n)+s+e.slice(n)):e}function xt(e,t){if(!e||!t)return e;const{from:r,to:n}=H(e,t);return e.slice(0,r)+e.slice(n)}const me="sve-html-tree-labels";function ge(){try{const e=globalThis.localStorage?.getItem(me);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function yt(e){try{globalThis.localStorage?.setItem(me,JSON.stringify(e))}catch{}}function ve(e){return String(e||"_")}function Tt(e){const t=ge()[ve(e)];return t&&typeof t=="object"?{...t}:{}}function bt(e,t,r){const n=r?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function wt(e,t,r,n){if(!t)return;const s=ve(e),i=ge(),o={...i[s]||{}},a=String(r||"").replace(/\s+/g," ").trim(),u=String(n||"").trim();!a||a===u?delete o[t]:o[t]=a,Object.keys(o).length?i[s]=o:delete i[s],yt(i)}const _={div:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="3.5" width="11" height="9" rx="1.2"/></svg>',section:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2.5" width="12" height="11" rx="1.2"/><path d="M2 6.5h12"/></svg>',ul:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="4" r="1"/><circle cx="3.2" cy="8" r="1"/><circle cx="3.2" cy="12" r="1"/><rect x="5.5" y="3.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="7.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="11.2" width="8" height="1.5" rx=".4"/></svg>',li:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="8" r="1.1"/><rect x="5.5" y="7.2" width="8" height="1.6" rx=".4"/></svg>',a:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M6.2 8.8 4.8 10.2a2.2 2.2 0 0 0 3.1 3.1l1.8-1.8"/><path d="M9.8 7.2l1.4-1.4a2.2 2.2 0 0 0-3.1-3.1L6.3 4.5"/></svg>',img:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="3" width="12" height="10" rx="1.2"/><circle cx="5.5" cy="6.2" r="1.1"/><path d="M2.8 12.2 6.2 9l2.2 2.2 2-1.8 2.8 2.8"/></svg>',component:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M8 1.6 13.4 4.8v6.4L8 14.4 2.6 11.2V4.8Z"/><path d="M2.6 4.8 8 8l5.4-3.2M8 8v6.4"/></svg>',other:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M5.2 3.5 2.8 8l2.4 4.5"/><path d="M10.8 3.5 13.2 8l-2.4 4.5"/></svg>'};function _t(e,t){return t==="component"?{svg:_.component}:/^h[1-6]$/.test(e)?{letter:"H"}:e==="p"?{letter:"P"}:e==="div"?{svg:_.div}:e==="section"||e==="article"||e==="header"||e==="footer"||e==="main"||e==="nav"||e==="aside"?{svg:_.section}:e==="ul"||e==="ol"?{svg:_.ul}:e==="li"?{svg:_.li}:e==="a"?{svg:_.a}:e==="img"||e==="picture"||e==="svg"?{svg:_.img}:{svg:_.other}}const Ct=["onClick"],Pt={__name:"HtmlTreeMenu",props:{items:{type:Array,required:!0},x:{type:Number,required:!0},y:{type:Number,required:!0},onClose:{type:Function,required:!0}},setup(e){const t=e,r=ne(null),n=ne({left:`${t.x}px`,top:`${t.y}px`});function s(o){r.value?.contains(o.target)||t.onClose()}function i(o){o.key==="Escape"&&t.onClose()}return Pe(()=>{const o=r.value?.getBoundingClientRect();if(o){const a=Math.min(t.x,window.innerWidth-o.width-8),u=Math.min(t.y,window.innerHeight-o.height-8);n.value={left:`${Math.max(8,a)}px`,top:`${Math.max(8,u)}px`}}document.addEventListener("pointerdown",s,!0),document.addEventListener("keydown",i,!0),window.addEventListener("scroll",t.onClose,!0)}),He(()=>{document.removeEventListener("pointerdown",s,!0),document.removeEventListener("keydown",i,!0),window.removeEventListener("scroll",t.onClose,!0)}),(o,a)=>(m(),g("div",{ref_key:"menu",ref:r,class:"sve-ht-menu",style:Ee(n.value)},[(m(!0),g(ae,null,ce(e.items,u=>(m(),g("button",{key:u.label,type:"button",onClick:c=>u.onPick?.()},C(u.label),9,Ct))),128))],4))}},Ht=W(Pt,[["__scopeId","data-v-9476f703"]]),Et=/^@(media|supports|container|layer|scope)\b/i;function Mt(e){const t=String(e||""),r=[];let n=0,s=0;for(;n<t.length;){if(t[n]==="{"&&t[n+1]==="{"){const a=t.indexOf("}}",n+2);n=a===-1?t.length:a+2;continue}if(t[n]==="/"&&t[n+1]==="*"){const a=t.indexOf("*/",n+2);n=a===-1?t.length:a+2;continue}if(t[n]==='"'||t[n]==="'"){const a=t[n];for(n+=1;n<t.length&&t[n]!==a;)n+=t[n]==="\\"?2:1;n+=1;continue}if(t[n]!=="{"){n+=1;continue}let i=1,o=n+1;for(;o<t.length&&i>0;){if(t[o]==="{"&&t[o+1]==="{"){const a=t.indexOf("}}",o+2);o=a===-1?t.length:a+2;continue}if(t[o]==="/"&&t[o+1]==="*"){const a=t.indexOf("*/",o+2);o=a===-1?t.length:a+2;continue}if(t[o]==='"'||t[o]==="'"){const a=t[o];for(o+=1;o<t.length&&t[o]!==a;)o+=t[o]==="\\"?2:1;o+=1;continue}t[o]==="{"?i+=1:t[o]==="}"&&(i-=1),o+=1}r.push({selector:t.slice(s,n).trim(),body:t.slice(n+1,o-1),from:s,to:o,text:t.slice(s,o).trim()}),n=o,s=o}return r}function oe(e){const t=String(e||""),r=new Set,n=new Set,s=new Set;for(const i of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const o of i[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))o&&(r.add(o),r.add(o.replace(/([:./%!#()[\],])/g,"\\$1")));for(const i of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))i[2].trim()&&n.add(i[2].trim());for(const i of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))s.add(i[1].toLowerCase());return{classes:r,ids:n,tags:s}}function re(e,t){const r=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),n=[...r.matchAll(/\.((?:\\.|[\w-])+)/g)].map(o=>o[1]),s=[...r.matchAll(/#((?:\\.|[\w-])+)/g)].map(o=>o[1]);if(n.length||s.length){const o=a=>a.replace(/\\(.)/g,"$1");return n.every(a=>t.classes.has(a)||t.classes.has(o(a)))&&s.every(a=>t.ids.has(o(a)))}const i=[...r.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(o=>o[2].toLowerCase());return i.length>0&&i.every(o=>t.tags.has(o))}function St(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function Lt(e,t,r){const n=St(e);if(!n.length)return"keep";const s=n.filter(o=>re(o,t));return s.length?s.length===n.length&&!n.some(o=>re(o,r))?"move":"copy":"keep"}function ke(e,t,r){const n=String(e||""),s=oe(t),i=oe(r),o=[],a=[];let u=0;for(const c of Mt(n)){const f=n.slice(c.from,c.to),y=f.match(/^\s*/)[0];if(u=c.to,Et.test(c.selector)){const T=ke(c.body,t,r);T.move.trim()&&o.push(`${c.selector} {
${T.move.trim()}
}`),T.keep.trim()&&a.push(`${y}${c.selector} {
${T.keep.trim()}
}`);continue}const k=c.selector.startsWith("@")?"keep":Lt(c.selector,s,i);if(k==="move"){o.push(c.text);continue}k==="copy"&&o.push(c.text),a.push(f)}return a.push(n.slice(u)),{move:o.join(`

`).trim(),keep:a.join("").replace(/\n{3,}/g,`

`).trim()}}const It="/!/sve/component";function $t(e){return e.document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")||e.Statamic?.$config?.get?.("csrfToken")||e.Statamic?.$config?.get?.("csrf_token")||""}function Dt(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let r=null;for(const n of t){if(!n.trim())continue;const s=n.match(/^[ \t]*/)[0].length;r=r===null?s:Math.min(r,s)}return r?t.map(n=>n.slice(r)).join(`
`):t.join(`
`)}function Rt(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function Bt(e,t){if(!je(e))return"";try{return await(await Se(()=>import("./tw-compile-B9daJWrZ.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(r){return console.error("[sve] component tailwind compile",r),""}}async function At(e,t){const r=await e.fetch(It,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":$t(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!r.ok){const n=new Error(String(r.status));throw n.status=r.status,n}return r.json()}function ie(e,t){const{from:r,to:n}=H(e,t),s=e.slice(r,n);if(!s.trim())return null;const i=e.slice(0,r)+e.slice(n),o=h("dock:css"),a=ke(typeof o=="string"?o:"",s,i);return{html:Dt(s),css:a.move,keepCss:a.keep,lead:Rt(s),from:r,to:n}}function jt(e,t,{onDone:r,onError:n}={}){if(h("dock:is-locked")===!0)return;const s=h("dock:html");if(typeof s!="string"||!t)return;const i=ie(s,t);if(!i)return;const o=de(e.document,Me,{heading:v(e,"component_new"),nameLabel:v(e,"component_name"),placeholder:v(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:v(e,"cancel"),saveLabel:v(e,"component_create"),onOk:a=>{o.dismiss(),(async()=>{try{const u=await Bt(e,i.html),c=h("dock:html"),f=typeof c=="string"&&c===s?i:ie(c,t);if(!f)return;const y=await At(e,{name:a,html:f.html,css:f.css,js:"",tw:u}),k=h("dock:html"),T=k.slice(0,f.from)+f.lead+y.tag+k.slice(f.to);h("dock:set-html",T),f.css.trim()&&h("dock:set-css",f.keepCss),r?.(y)}catch(u){n?.(u)}})()}})}const L="__sve-html-tree-panel",se="__sve-html-tree-style",M=new Set;let z=null,R=null,B=0,J=[],E=null,S=null,A=null,j=null,Y=null,O=!1,N=null;function w(e){return e.getElementById(L)}function Ot(e){let t=e.getElementById(se);t||(t=e.createElement("style"),t.id=se,e.head.appendChild(t)),t.textContent=`
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
  `}function G(){const e=h("dock:html");return typeof e=="string"?e:""}function xe(e){return!!h("dock:is-open",e)}function ye(e){return h("dock:set-html",e)===!0}function b(e){const t=e.document,n=w(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;Ot(t);const s=G(),i=Ne(s);J=i;const o=ze(i,M),a=h("dock:current-type")||"",u=Tt(a);!s.trim()&&!xe(t)?l.emptyText=v(e,"html_tree_need_dock"):l.emptyText=v(e,"html_tree_empty"),l.renameTitle=v(e,"html_tree_rename"),l.tagTitle=v(e,"tw_tag"),l.hideTitle=v(e,"html_tree_hide"),l.showTitle=v(e,"html_tree_show"),l.duplicateTitle=v(e,"html_tree_duplicate"),l.deleteTitle=v(e,"html_tree_delete"),l.canEdit=!h("dock:is-locked"),l.onSelect=c=>te(e,c,o),l.onTwist=c=>{M.has(c)?M.delete(c):M.add(c),b(e)},l.onTagChange=(c,f)=>{const y=l.rows.find(k=>k.id===f);y&&Fe(e,c.currentTarget,y)},l.onRename=c=>Ft(e,c),l.onRenameCommit=()=>le(e,!0),l.onRenameCancel=()=>le(e,!1),l.onHide=c=>qt(e,c),l.onDuplicate=c=>Kt(e,c),l.onDelete=c=>Vt(e,c),l.onPointerDown=(c,f)=>Ut(e,c,f),l.onContext=(c,f)=>Yt(e,c,f),l.rows=o.map(c=>{const f=_t(c.tag,c.kind);return{...c,name:bt(c.klass,c.path,u),current:c.id===z,letter:f.letter||"",svg:f.svg||""}}),Z(n,ft),Nt(e,i)}function Nt(e,t){if(!w(e.document))return;const r=t[0];X({source:"statamic-visual-editor",type:"sve-html-pick",on:!0,uid:h("dock:current-uid")||"",tag:r?.tag||"",klass:r?.klass||"",nodes:qe(t)},e)}function zt(e){if(!e)return;const t=[],r=String(e).split("/");for(let s=0;s<r.length;s+=1)t.push(r.slice(0,s+1).join("/"));const n=s=>{for(const i of s||[])t.includes(i.path)&&M.delete(i.id),n(i.children)};n(J)}function Ft(e,t){if(O)return;const r=l.rows.find(n=>n.id===t);r&&(z=t,l.rows.forEach(n=>{n.current=n.id===t}),l.editingId=t,l.draft=r.name,e.setTimeout(()=>{const n=w(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function le(e,t){const r=l.editingId;if(!r)return;const n=l.rows.find(s=>s.id===r);l.editingId=null,t&&n&&wt(h("dock:current-type")||"",n.path,l.draft,n.klass),l.draft="",b(e)}function qt(e,t){Q(e,t,gt)}function Kt(e,t){Q(e,t,kt)}function Vt(e,t){Q(e,t,xt)}function Q(e,t,r){if(h("dock:is-locked"))return;const n=G(),s=l.rows.find(o=>o.id===t);if(!s)return;const i=r(n,s);i!==n&&ye(i)}function D(){N?.dismiss(),N=null}function Yt(e,t,r){D();const n=l.rows.find(i=>i.id===r);if(!n)return;te(e,r,l.rows);const s=[];n.kind==="component"?s.push({label:v(e,"component_open"),onPick:()=>{D(),h("dock:open-template",`view:partials/${n.src}`)}}):l.canEdit&&s.push({label:v(e,"component_make"),onPick:()=>{D(),jt(e,n,{onDone:()=>b(e),onError:i=>{e.alert(i?.status===409?v(e,"component_exists"):v(e,"component_failed"))}})}}),s.length&&(N=de(e.document,Ht,{items:s,x:t.clientX,y:t.clientY,onClose:()=>{N=null}}))}function Ut(e,t,r){if(t.button!==0||h("dock:is-locked")||l.editingId||t.target?.closest?.("button, input"))return;ee(),E=r,S={x:t.clientX,y:t.clientY},A=t.currentTarget,j=t.pointerId;const n=i=>Wt(e,i),s=i=>Xt(e,i);Y=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",s,!0),e.document.removeEventListener("pointercancel",s,!0),Y=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",s,!0),e.document.addEventListener("pointercancel",s,!0)}function Wt(e,t){if(!E||!S)return;const r=t.clientX-S.x,n=t.clientY-S.y;if(!l.dragging&&r*r+n*n<25)return;if(!l.dragging){l.dragging=!0;try{A?.setPointerCapture?.(j)}catch{}}t.preventDefault();const s=e.document.elementFromPoint(t.clientX,t.clientY)?.closest?.("[data-sve-ht-row]"),i=s?.getAttribute("data-sve-ht-id");if(!i||i===E){l.dropId=null,l.dropPlace=null;return}const o=l.rows.find(c=>c.id===i),a=l.rows.find(c=>c.id===E);if(!o||a&&o.path.startsWith(`${a.path}/`)){l.dropId=null,l.dropPlace=null;return}const u=s.getBoundingClientRect();l.dropId=i,l.dropPlace=vt(t.clientY-u.top,u.height,!pe(o.tag)&&o.kind!=="component")}function Xt(e,t){const r=E,n=l.dropId,s=l.dropPlace||"after",i=l.dragging;if(ee(),i&&(O=!0,e.setTimeout(()=>{O=!1},0)),!i||h("dock:is-locked")||!r||!n||r===n)return;t?.preventDefault?.();const o=G(),a=mt(o,J,r,n,s);a!==o&&ye(a)}function ee(){try{A?.releasePointerCapture?.(j)}catch{}Y?.(),E=null,S=null,A=null,j=null,l.dragging=!1,l.dropId=null,l.dropPlace=null}function te(e,t,r){if(O)return;const n=(r||l.rows).find(s=>s.id===t);n&&(z=t,l.rows.forEach(s=>{s.current=s.id===t}),h("dock:reveal-html",{from:n.from,to:n.to}),h("dock:tw-follow"),X({source:"statamic-visual-editor",type:"sve-html-pick-focus",path:n.path},e))}function Zt(e,t){if(!t||!w(e.document))return;zt(t),b(e);const r=l.rows.find(n=>n.path===t);r&&te(e,r.id,l.rows)}function U(e){if(R)return;R=De("dock:html-changed",()=>{l.editingId||l.dragging||(e.clearTimeout(B),B=e.setTimeout(()=>{w(e.document)&&b(e)},80))})}function Jt(e){R?.(),R=null,e?.clearTimeout?.(B),B=0}function F(e){const t=w(e.document);if(X({source:"statamic-visual-editor",type:"sve-html-pick",on:!1},e),Jt(e),ee(),D(),Oe(e),z=null,l.editingId=null,l.draft="",!t){x.syncPreviewInset(e);return}t.remove(),Re.headerTab==="html_tree"&&Be(e,null),Le(e),x.persistDockedPanel(e),ue(e),x.syncPreviewInset(e)}function Gt(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=L,Z(t,fe,{title:v(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>F(e)))}function Qt(e){U(e),b(e)}function Te(e){const t=e.document;if(!x.featureOn(e,"html_tree"))return;if(w(t)){U(e),b(e);return}if(!xe(t))return;x.closeRightPanels(e,[L]);const r=t.createElement("div");r.id=L,r.style.cssText=Ie,Z(r,fe,{title:v(e,"html_tree")}),r.querySelector("[data-sve-close]")?.addEventListener("click",()=>F(e)),$e(e,r),x.persistDockedPanel(e),ue(e),x.syncPreviewInset(e),U(e),b(e)}function en(e){if(w(e.document)){F(e);return}Te(e)}Ae("html-tree:from-preview",({path:e}={})=>{Zt(window,e)});x.HTML_TREE_PANEL_ID=L;x.htmlTreePanel=w;x.closeHtmlTreePanel=F;x.fillHtmlTreePane=Gt;x.showHtmlTreePane=Qt;x.openHtmlTreePanel=Te;x.toggleHtmlTreePanel=en;x.renderHtmlTree=b;export{L as HTML_TREE_PANEL_ID,se as HTML_TREE_STYLE_ID,D as closeHtmlTreeMenu,F as closeHtmlTreePanel,Ot as ensureHtmlTreeStyles,Gt as fillHtmlTreePane,z as htmlTreeActiveId,M as htmlTreeCollapsed,w as htmlTreePanel,B as htmlTreeTimer,R as htmlTreeUnhook,Te as openHtmlTreePanel,b as renderHtmlTree,Qt as showHtmlTreePane,Jt as stopWatchHtmlTreeDock,en as toggleHtmlTreePanel,U as watchHtmlTreeDock};
