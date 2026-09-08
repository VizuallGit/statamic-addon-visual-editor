import{_ as ee,o as p,c as v,a as E,t as _,b as fe,r as he,m as F,u as c,d as H,F as pe,e as ve,w as S,f as u,K as me,L as ge,x as U,s as h,h as ke,B as te,i as q,j as x,R as xe,C as Te,M as m,N as ye,E as be,G as we,O as He}from"./addon-DUtzgRpL.js";import{i as ne,c as Pe,p as _e,f as Ce,t as Ee}from"./tw-overlay-Muz5Nzyk.js";import{a as Me}from"./html-pick-align-gkRPeJkt.js";const Ie={class:"sve-html-tree"},De={class:"sve-pane-bar","data-sve-pane-bar":""},Le={"data-sve-right-title":""},Se={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){return(t,o)=>(p(),v("div",Ie,[E("div",De,[E("div",Le,_(e.title),1),o[0]||(o[0]=fe('<div data-sve-right-actions data-v-b4ff8e88><button type="button" data-sve-right-pin aria-pressed="false" data-v-b4ff8e88></button><button type="button" data-sve-close aria-label="Close" data-v-b4ff8e88><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-b4ff8e88><path d="M18 6 6 18" data-v-b4ff8e88></path><path d="m6 6 12 12" data-v-b4ff8e88></path></svg></button></div>',1))]),o[1]||(o[1]=E("div",{"data-sve-html-tree-list":""},null,-1))]))}},re=ee(Se,[["__scopeId","data-v-b4ff8e88"]]),n=he({emptyText:"",rows:[],editingId:null,draft:"",renameTitle:"",hideTitle:"",showTitle:"",duplicateTitle:"",deleteTitle:"",canEdit:!1,dragging:!1,dropId:null,dropPlace:null,onSelect:null,onTwist:null,tagTitle:"",onTagChange:null,onRename:null,onRenameCommit:null,onRenameCancel:null,onHide:null,onDuplicate:null,onDelete:null,onPointerDown:null}),Re={key:0,class:"sve-ht-empty"},$e=["title","onClick","onDblclick","onKeydown","onPointerdown"],Be=["onClick"],je={key:1,"data-sve-ht-letter":""},Ne=["innerHTML"],Oe=["title"],Ae=["title","onClick"],Fe={key:1,"data-sve-ht-name":""},ze={key:3,"data-sve-ht-actions":""},Ye=["title","innerHTML","onClick"],Ke=["title","onClick"],Ve=["title","onClick"],Ue='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',qe='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',We='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',Ge='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',Xe='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',Je={__name:"HtmlTreeList",setup(e){function t(s){return s.name?`${s.tag} ${s.name}`:s.tag}function o(s){const r={"data-sve-ht-id":s.id};return s.current&&(r["data-sve-ht-current"]=""),s.hidden&&(r["data-sve-ht-hidden"]=""),n.dropId===s.id&&n.dropPlace&&(r["data-sve-ht-drop"]=n.dropPlace),r}function i(s){return!s.hidden||s.wrapFrom!=null}return(s,r)=>(p(),v("div",F({class:"sve-ht-root"},c(n).dragging?{"data-sve-ht-dragging":""}:{}),[c(n).rows.length?H("",!0):(p(),v("div",Re,_(c(n).emptyText),1)),(p(!0),v(pe,null,ve(c(n).rows,l=>(p(),v("div",F({key:l.id,"data-sve-ht-row":""},{ref_for:!0},o(l),{role:"button",tabindex:"0",title:t(l),style:{marginLeft:l.depth*12+"px"},onClick:a=>c(n).onSelect?.(l.id),onDblclick:u(a=>c(n).onRename?.(l.id),["prevent"]),onKeydown:[S(u(a=>c(n).onSelect?.(l.id),["prevent"]),["enter"]),S(u(a=>c(n).onSelect?.(l.id),["prevent"]),["space"])],onPointerdown:a=>c(n).onPointerDown?.(a,l.id)}),[l.hasChildren?(p(),v("button",F({key:0,type:"button","data-sve-ht-twist":""},{ref_for:!0},l.shut?{"data-sve-ht-shut":""}:{},{innerHTML:Ue,onClick:u(a=>c(n).onTwist?.(l.id),["stop","prevent"]),onPointerdown:r[0]||(r[0]=u(()=>{},["stop"])),onDblclick:r[1]||(r[1]=u(()=>{},["stop"]))}),null,16,Be)):H("",!0),l.letter?(p(),v("span",je,_(l.letter),1)):(p(),v("span",{key:2,"data-sve-ht-icon":"",innerHTML:l.svg},null,8,Ne)),E("span",{"data-sve-ht-text":"",title:c(n).renameTitle},[E("button",{type:"button","data-sve-ht-tag":"",title:c(n).tagTitle,onClick:u(a=>c(n).onTagChange?.(a,l.id),["stop","prevent"]),onPointerdown:r[2]||(r[2]=u(()=>{},["stop"])),onDblclick:r[3]||(r[3]=u(()=>{},["stop"]))},_(l.tag),41,Ae),c(n).editingId===l.id?me((p(),v("input",{key:0,"data-sve-ht-rename":"","onUpdate:modelValue":r[4]||(r[4]=a=>c(n).draft=a),onMousedown:r[5]||(r[5]=u(()=>{},["stop"])),onPointerdown:r[6]||(r[6]=u(()=>{},["stop"])),onClick:r[7]||(r[7]=u(()=>{},["stop"])),onDblclick:r[8]||(r[8]=u(()=>{},["stop"])),onKeydown:[r[9]||(r[9]=u(()=>{},["stop"])),r[10]||(r[10]=S(u(a=>c(n).onRenameCommit?.(),["prevent"]),["enter"])),r[11]||(r[11]=S(u(a=>c(n).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:r[12]||(r[12]=a=>c(n).onRenameCommit?.())},null,544)),[[ge,c(n).draft]]):(p(),v("span",Fe,_(l.name),1))],8,Oe),c(n).canEdit?(p(),v("span",ze,[c(n).canEdit&&i(l)?(p(),v("button",{key:0,type:"button","data-sve-ht-eye":"",title:l.hidden?c(n).showTitle:c(n).hideTitle,innerHTML:l.hidden?We:qe,onClick:u(a=>c(n).onHide?.(l.id),["stop","prevent"]),onPointerdown:r[13]||(r[13]=u(()=>{},["stop"])),onDblclick:r[14]||(r[14]=u(()=>{},["stop"]))},null,40,Ye)):H("",!0),c(n).canEdit?(p(),v("button",{key:1,type:"button","data-sve-ht-dup":"",title:c(n).duplicateTitle,innerHTML:Ge,onClick:u(a=>c(n).onDuplicate?.(l.id),["stop","prevent"]),onPointerdown:r[15]||(r[15]=u(()=>{},["stop"])),onDblclick:r[16]||(r[16]=u(()=>{},["stop"]))},null,40,Ke)):H("",!0),c(n).canEdit?(p(),v("button",{key:2,type:"button","data-sve-ht-del":"",title:c(n).deleteTitle,innerHTML:Xe,onClick:u(a=>c(n).onDelete?.(l.id),["stop","prevent"]),onPointerdown:r[17]||(r[17]=u(()=>{},["stop"])),onDblclick:r[18]||(r[18]=u(()=>{},["stop"]))},null,40,Ve)):H("",!0)])):H("",!0)],16,$e))),128))],16))}},Ze=ee(Je,[["__scopeId","data-v-a1b7957a"]]);function Y(e,t){for(const o of e||[]){if(o.id===t)return o;const i=Y(o.children,t);if(i)return i}return null}function oe(e,t){return(e.children||[]).some(o=>o.id===t||oe(o,t))}function M(e,t){let o=t.wrapFrom??t.from,i=t.wrapTo??t.to;return o>0&&e[o-1]===`
`&&(o-=1),{from:o,to:i}}function Qe(e,t){const o=e.slice(t.from,t.to),i=`</${t.tag}`,s=o.toLowerCase().lastIndexOf(i);return s===-1?t.to:t.from+s}function z(e,t,o){return e>=t+o?e-o:e>t?t:e}function et(e,t,o,i,s){const r=Y(t,o),l=Y(t,i);if(!e||!r||!l||o===i||oe(r,i))return e;let a=s;a==="inside"&&(ne(l.tag)||l.wrapFrom!=null)&&(a="after");const f=M(e,r),d=e.slice(f.from,f.to);if(!d)return e;const g=e.slice(0,f.from)+e.slice(f.to),w=f.to-f.from;let k;a==="before"?k=z(M(e,l).from,f.from,w):a==="inside"?k=z(Qe(e,l),f.from,w):k=z(M(e,l).to,f.from,w),k=Math.max(0,Math.min(k,g.length));let L=d;return k>0&&g[k-1]!==`
`&&L[0]!==`
`&&(L=`
${L}`),g.slice(0,k)+L+g.slice(k)}function tt(e,t){if(!e||!t)return e;if(t.wrapFrom!=null&&t.wrapTo!=null){const o=e.slice(t.wrapFrom+4,t.wrapTo-3);return e.slice(0,t.wrapFrom)+o+e.slice(t.wrapTo)}return t.hidden?e:`${e.slice(0,t.from)}<!--${e.slice(t.from,t.to)}-->${e.slice(t.to)}`}function nt(e,t,o){const i=e/Math.max(t,1);return o&&i>.32&&i<.68?"inside":i<.5?"before":"after"}function rt(e,t){if(!e||!t)return e;const{from:o,to:i}=M(e,t);let s=e.slice(o,i);return s?(s.startsWith(`
`)||(s=`
${s}`),e.slice(0,i)+s+e.slice(i)):e}function ot(e,t){if(!e||!t)return e;const{from:o,to:i}=M(e,t);return e.slice(0,o)+e.slice(i)}const ie="sve-html-tree-labels";function se(){try{const e=globalThis.localStorage?.getItem(ie);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function it(e){try{globalThis.localStorage?.setItem(ie,JSON.stringify(e))}catch{}}function le(e){return String(e||"_")}function st(e){const t=se()[le(e)];return t&&typeof t=="object"?{...t}:{}}function lt(e,t,o){const i=o?.[t];return typeof i=="string"&&i.trim()?i.replace(/\s+/g," ").trim():String(e||"").trim()}function at(e,t,o,i){if(!t)return;const s=le(e),r=se(),l={...r[s]||{}},a=String(o||"").replace(/\s+/g," ").trim(),f=String(i||"").trim();!a||a===f?delete l[t]:l[t]=a,Object.keys(l).length?r[s]=l:delete r[s],it(r)}const b={div:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="3.5" width="11" height="9" rx="1.2"/></svg>',section:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2.5" width="12" height="11" rx="1.2"/><path d="M2 6.5h12"/></svg>',ul:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="4" r="1"/><circle cx="3.2" cy="8" r="1"/><circle cx="3.2" cy="12" r="1"/><rect x="5.5" y="3.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="7.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="11.2" width="8" height="1.5" rx=".4"/></svg>',li:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="8" r="1.1"/><rect x="5.5" y="7.2" width="8" height="1.6" rx=".4"/></svg>',a:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M6.2 8.8 4.8 10.2a2.2 2.2 0 0 0 3.1 3.1l1.8-1.8"/><path d="M9.8 7.2l1.4-1.4a2.2 2.2 0 0 0-3.1-3.1L6.3 4.5"/></svg>',img:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="3" width="12" height="10" rx="1.2"/><circle cx="5.5" cy="6.2" r="1.1"/><path d="M2.8 12.2 6.2 9l2.2 2.2 2-1.8 2.8 2.8"/></svg>',other:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M5.2 3.5 2.8 8l2.4 4.5"/><path d="M10.8 3.5 13.2 8l-2.4 4.5"/></svg>'};function dt(e){return/^h[1-6]$/.test(e)?{letter:"H"}:e==="p"?{letter:"P"}:e==="div"?{svg:b.div}:e==="section"||e==="article"||e==="header"||e==="footer"||e==="main"||e==="nav"||e==="aside"?{svg:b.section}:e==="ul"||e==="ol"?{svg:b.ul}:e==="li"?{svg:b.li}:e==="a"?{svg:b.a}:e==="img"||e==="picture"||e==="svg"?{svg:b.img}:{svg:b.other}}const D="__sve-html-tree-panel",Z="__sve-html-tree-style",C=new Set;let O=null,R=null,$=0,W=[],P=null,I=null,B=null,j=null,K=null,N=!1;function T(e){return e.getElementById(D)}function ct(e){let t=e.getElementById(Z);t||(t=e.createElement("style"),t.id=Z,e.head.appendChild(t)),t.textContent=`
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
  `}function G(){const e=m("dock:html");return typeof e=="string"?e:""}function ae(e){return!!m("dock:is-open",e)}function de(e){return m("dock:set-html",e)===!0}function y(e){const t=e.document,i=T(t)?.querySelector("[data-sve-html-tree-list]");if(!i)return;ct(t);const s=G(),r=_e(s);W=r;const l=Ce(r,C),a=m("dock:current-type")||"",f=st(a);!s.trim()&&!ae(t)?n.emptyText=x(e,"html_tree_need_dock"):n.emptyText=x(e,"html_tree_empty"),n.renameTitle=x(e,"html_tree_rename"),n.tagTitle=x(e,"tw_tag"),n.hideTitle=x(e,"html_tree_hide"),n.showTitle=x(e,"html_tree_show"),n.duplicateTitle=x(e,"html_tree_duplicate"),n.deleteTitle=x(e,"html_tree_delete"),n.canEdit=!m("dock:is-locked"),n.onSelect=d=>ce(e,d,l),n.onTwist=d=>{C.has(d)?C.delete(d):C.add(d),y(e)},n.onTagChange=(d,g)=>{const w=n.rows.find(k=>k.id===g);w&&Ee(e,d.currentTarget,w)},n.onRename=d=>ht(e,d),n.onRenameCommit=()=>Q(e,!0),n.onRenameCancel=()=>Q(e,!1),n.onHide=d=>pt(e,d),n.onDuplicate=d=>vt(e,d),n.onDelete=d=>mt(e,d),n.onPointerDown=(d,g)=>gt(e,d,g),n.rows=l.map(d=>{const g=dt(d.tag);return{...d,name:lt(d.klass,d.path,f),current:d.id===O,letter:g.letter||"",svg:g.svg||""}}),q(i,Ze),ut(e,r)}function ut(e,t){if(!T(e.document))return;const o=t[0];U({source:"statamic-visual-editor",type:"sve-html-pick",on:!0,uid:m("dock:current-uid")||"",tag:o?.tag||"",klass:o?.klass||"",nodes:Me(t)},e)}function ft(e){if(!e)return;const t=[],o=String(e).split("/");for(let s=0;s<o.length;s+=1)t.push(o.slice(0,s+1).join("/"));const i=s=>{for(const r of s||[])t.includes(r.path)&&C.delete(r.id),i(r.children)};i(W)}function ht(e,t){if(N)return;const o=n.rows.find(i=>i.id===t);o&&(O=t,n.rows.forEach(i=>{i.current=i.id===t}),n.editingId=t,n.draft=o.name,e.setTimeout(()=>{const i=T(e.document)?.querySelector("[data-sve-ht-rename]");i?.focus(),i?.select()},0))}function Q(e,t){const o=n.editingId;if(!o)return;const i=n.rows.find(s=>s.id===o);n.editingId=null,t&&i&&at(m("dock:current-type")||"",i.path,n.draft,i.klass),n.draft="",y(e)}function pt(e,t){X(e,t,tt)}function vt(e,t){X(e,t,rt)}function mt(e,t){X(e,t,ot)}function X(e,t,o){if(m("dock:is-locked"))return;const i=G(),s=n.rows.find(l=>l.id===t);if(!s)return;const r=o(i,s);r!==i&&de(r)}function gt(e,t,o){if(t.button!==0||m("dock:is-locked")||n.editingId||t.target?.closest?.("button, input"))return;J(),P=o,I={x:t.clientX,y:t.clientY},B=t.currentTarget,j=t.pointerId;const i=r=>kt(e,r),s=r=>xt(e,r);K=()=>{e.document.removeEventListener("pointermove",i,!0),e.document.removeEventListener("pointerup",s,!0),e.document.removeEventListener("pointercancel",s,!0),K=null},e.document.addEventListener("pointermove",i,!0),e.document.addEventListener("pointerup",s,!0),e.document.addEventListener("pointercancel",s,!0)}function kt(e,t){if(!P||!I)return;const o=t.clientX-I.x,i=t.clientY-I.y;if(!n.dragging&&o*o+i*i<25)return;if(!n.dragging){n.dragging=!0;try{B?.setPointerCapture?.(j)}catch{}}t.preventDefault();const s=e.document.elementFromPoint(t.clientX,t.clientY)?.closest?.("[data-sve-ht-row]"),r=s?.getAttribute("data-sve-ht-id");if(!r||r===P){n.dropId=null,n.dropPlace=null;return}const l=n.rows.find(d=>d.id===r),a=n.rows.find(d=>d.id===P);if(!l||a&&l.path.startsWith(`${a.path}/`)){n.dropId=null,n.dropPlace=null;return}const f=s.getBoundingClientRect();n.dropId=r,n.dropPlace=nt(t.clientY-f.top,f.height,!ne(l.tag))}function xt(e,t){const o=P,i=n.dropId,s=n.dropPlace||"after",r=n.dragging;if(J(),r&&(N=!0,e.setTimeout(()=>{N=!1},0)),!r||m("dock:is-locked")||!o||!i||o===i)return;t?.preventDefault?.();const l=G(),a=et(l,W,o,i,s);a!==l&&de(a)}function J(){try{B?.releasePointerCapture?.(j)}catch{}K?.(),P=null,I=null,B=null,j=null,n.dragging=!1,n.dropId=null,n.dropPlace=null}function ce(e,t,o){if(N)return;const i=(o||n.rows).find(s=>s.id===t);i&&(O=t,n.rows.forEach(s=>{s.current=s.id===t}),m("dock:reveal-html",{from:i.from,to:i.to}),m("dock:tw-follow"),U({source:"statamic-visual-editor",type:"sve-html-pick-focus",path:i.path},e))}function Tt(e,t){if(!t||!T(e.document))return;ft(t),y(e);const o=n.rows.find(i=>i.path===t);o&&ce(e,o.id,n.rows)}function V(e){if(R)return;R=ye("dock:html-changed",()=>{n.editingId||n.dragging||(e.clearTimeout($),$=e.setTimeout(()=>{T(e.document)&&y(e)},80))})}function yt(e){R?.(),R=null,e?.clearTimeout?.($),$=0}function A(e){const t=T(e.document);if(U({source:"statamic-visual-editor",type:"sve-html-pick",on:!1},e),yt(e),J(),Pe(e),O=null,n.editingId=null,n.draft="",!t){h.syncPreviewInset(e);return}t.remove(),be.headerTab==="html_tree"&&we(e,null),ke(e),h.persistDockedPanel(e),te(e),h.syncPreviewInset(e)}function bt(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=D,q(t,re,{title:x(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>A(e)))}function wt(e){V(e),y(e)}function ue(e){const t=e.document;if(!h.featureOn(e,"html_tree"))return;if(T(t)){V(e),y(e);return}if(!ae(t))return;h.closeRightPanels(e,[D]);const o=t.createElement("div");o.id=D,o.style.cssText=xe,q(o,re,{title:x(e,"html_tree")}),o.querySelector("[data-sve-close]")?.addEventListener("click",()=>A(e)),Te(e,o),h.persistDockedPanel(e),te(e),h.syncPreviewInset(e),V(e),y(e)}function Ht(e){if(T(e.document)){A(e);return}ue(e)}He("html-tree:from-preview",({path:e}={})=>{Tt(window,e)});h.HTML_TREE_PANEL_ID=D;h.htmlTreePanel=T;h.closeHtmlTreePanel=A;h.fillHtmlTreePane=bt;h.showHtmlTreePane=wt;h.openHtmlTreePanel=ue;h.toggleHtmlTreePanel=Ht;h.renderHtmlTree=y;export{D as HTML_TREE_PANEL_ID,Z as HTML_TREE_STYLE_ID,A as closeHtmlTreePanel,ct as ensureHtmlTreeStyles,bt as fillHtmlTreePane,O as htmlTreeActiveId,C as htmlTreeCollapsed,T as htmlTreePanel,$ as htmlTreeTimer,R as htmlTreeUnhook,ue as openHtmlTreePanel,y as renderHtmlTree,wt as showHtmlTreePane,yt as stopWatchHtmlTreeDock,Ht as toggleHtmlTreePanel,V as watchHtmlTreeDock};
