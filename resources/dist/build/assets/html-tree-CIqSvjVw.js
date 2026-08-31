import{_ as Q,o as p,c as f,a as H,t as _,b as ce,r as ue,m as z,u as c,d as w,F as he,e as pe,w as L,f as u,g as fe,v as ve,i as ee,s as V,h as v,j as me,k as te,l as K,n as m,p as ge,q as ke,x as g,R as xe,y as Te,z as ye,A as be,B as we,C as He}from"./addon-CJcFGwZG.js";import{a as _e}from"./html-pick-align-gkRPeJkt.js";const Pe={class:"sve-html-tree"},Ce={class:"sve-pane-bar","data-sve-pane-bar":""},Ee={"data-sve-right-title":""},Ie={class:"sve-pane-hint"},Me={__name:"HtmlTreePane",props:{title:{type:String,default:""},hint:{type:String,required:!0}},setup(e){return(t,r)=>(p(),f("div",Pe,[H("div",Ce,[H("div",Ee,_(e.title),1),r[0]||(r[0]=ce('<div data-sve-right-actions data-v-d8a25374><button type="button" data-sve-right-pin aria-pressed="false" data-v-d8a25374></button><button type="button" data-sve-close aria-label="Close" data-v-d8a25374><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-d8a25374><path d="M18 6 6 18" data-v-d8a25374></path><path d="m6 6 12 12" data-v-d8a25374></path></svg></button></div>',1))]),H("div",Ie,_(e.hint),1),r[1]||(r[1]=H("div",{"data-sve-html-tree-list":""},null,-1))]))}},ne=Q(Me,[["__scopeId","data-v-d8a25374"]]),n=ue({emptyText:"",rows:[],editingId:null,draft:"",renameTitle:"",hideTitle:"",showTitle:"",duplicateTitle:"",deleteTitle:"",canEdit:!1,dragging:!1,dropId:null,dropPlace:null,onSelect:null,onTwist:null,onRename:null,onRenameCommit:null,onRenameCancel:null,onHide:null,onDuplicate:null,onDelete:null,onPointerDown:null}),De={key:0,class:"sve-ht-empty"},Le=["title","onClick","onDblclick","onKeydown","onPointerdown"],Se=["onClick"],Re={key:1,"data-sve-ht-letter":""},$e=["innerHTML"],Be=["title"],je={"data-sve-ht-tag":""},Ae={key:1,"data-sve-ht-name":""},Fe={key:3,"data-sve-ht-actions":""},Ne=["title","innerHTML","onClick"],ze=["title","onClick"],Oe=["title","onClick"],Ye='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',qe='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Ve='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',Ke='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',Ue='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',We={__name:"HtmlTreeList",setup(e){function t(s){return s.name?`${s.tag} ${s.name}`:s.tag}function r(s){const o={"data-sve-ht-id":s.id};return s.current&&(o["data-sve-ht-current"]=""),s.hidden&&(o["data-sve-ht-hidden"]=""),n.dropId===s.id&&n.dropPlace&&(o["data-sve-ht-drop"]=n.dropPlace),o}function i(s){return!s.hidden||s.wrapFrom!=null}return(s,o)=>(p(),f("div",z({class:"sve-ht-root"},c(n).dragging?{"data-sve-ht-dragging":""}:{}),[c(n).rows.length?w("",!0):(p(),f("div",De,_(c(n).emptyText),1)),(p(!0),f(he,null,pe(c(n).rows,l=>(p(),f("div",z({key:l.id,"data-sve-ht-row":""},{ref_for:!0},r(l),{role:"button",tabindex:"0",title:t(l),style:{marginLeft:l.depth*12+"px"},onClick:a=>c(n).onSelect?.(l.id),onDblclick:u(a=>c(n).onRename?.(l.id),["prevent"]),onKeydown:[L(u(a=>c(n).onSelect?.(l.id),["prevent"]),["enter"]),L(u(a=>c(n).onSelect?.(l.id),["prevent"]),["space"])],onPointerdown:a=>c(n).onPointerDown?.(a,l.id)}),[l.hasChildren?(p(),f("button",z({key:0,type:"button","data-sve-ht-twist":""},{ref_for:!0},l.shut?{"data-sve-ht-shut":""}:{},{innerHTML:Ye,onClick:u(a=>c(n).onTwist?.(l.id),["stop","prevent"]),onPointerdown:o[0]||(o[0]=u(()=>{},["stop"])),onDblclick:o[1]||(o[1]=u(()=>{},["stop"]))}),null,16,Se)):w("",!0),l.letter?(p(),f("span",Re,_(l.letter),1)):(p(),f("span",{key:2,"data-sve-ht-icon":"",innerHTML:l.svg},null,8,$e)),H("span",{"data-sve-ht-text":"",title:c(n).renameTitle},[H("span",je,_(l.tag),1),c(n).editingId===l.id?fe((p(),f("input",{key:0,"data-sve-ht-rename":"","onUpdate:modelValue":o[2]||(o[2]=a=>c(n).draft=a),onMousedown:o[3]||(o[3]=u(()=>{},["stop"])),onPointerdown:o[4]||(o[4]=u(()=>{},["stop"])),onClick:o[5]||(o[5]=u(()=>{},["stop"])),onDblclick:o[6]||(o[6]=u(()=>{},["stop"])),onKeydown:[o[7]||(o[7]=u(()=>{},["stop"])),o[8]||(o[8]=L(u(a=>c(n).onRenameCommit?.(),["prevent"]),["enter"])),o[9]||(o[9]=L(u(a=>c(n).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:o[10]||(o[10]=a=>c(n).onRenameCommit?.())},null,544)),[[ve,c(n).draft]]):(p(),f("span",Ae,_(l.name),1))],8,Be),c(n).canEdit?(p(),f("span",Fe,[c(n).canEdit&&i(l)?(p(),f("button",{key:0,type:"button","data-sve-ht-eye":"",title:l.hidden?c(n).showTitle:c(n).hideTitle,innerHTML:l.hidden?Ve:qe,onClick:u(a=>c(n).onHide?.(l.id),["stop","prevent"]),onPointerdown:o[11]||(o[11]=u(()=>{},["stop"])),onDblclick:o[12]||(o[12]=u(()=>{},["stop"]))},null,40,Ne)):w("",!0),c(n).canEdit?(p(),f("button",{key:1,type:"button","data-sve-ht-dup":"",title:c(n).duplicateTitle,innerHTML:Ke,onClick:u(a=>c(n).onDuplicate?.(l.id),["stop","prevent"]),onPointerdown:o[13]||(o[13]=u(()=>{},["stop"])),onDblclick:o[14]||(o[14]=u(()=>{},["stop"]))},null,40,ze)):w("",!0),c(n).canEdit?(p(),f("button",{key:2,type:"button","data-sve-ht-del":"",title:c(n).deleteTitle,innerHTML:Ue,onClick:u(a=>c(n).onDelete?.(l.id),["stop","prevent"]),onPointerdown:o[15]||(o[15]=u(()=>{},["stop"])),onDblclick:o[16]||(o[16]=u(()=>{},["stop"]))},null,40,Oe)):w("",!0)])):w("",!0)],16,Le))),128))],16))}},Xe=Q(We,[["__scopeId","data-v-a292d01e"]]);function Y(e,t){for(const r of e||[]){if(r.id===t)return r;const i=Y(r.children,t);if(i)return i}return null}function re(e,t){return(e.children||[]).some(r=>r.id===t||re(r,t))}function I(e,t){let r=t.wrapFrom??t.from,i=t.wrapTo??t.to;return r>0&&e[r-1]===`
`&&(r-=1),{from:r,to:i}}function Ge(e,t){const r=e.slice(t.from,t.to),i=`</${t.tag}`,s=r.toLowerCase().lastIndexOf(i);return s===-1?t.to:t.from+s}function O(e,t,r){return e>=t+r?e-r:e>t?t:e}function Je(e,t,r,i,s){const o=Y(t,r),l=Y(t,i);if(!e||!o||!l||r===i||re(o,i))return e;let a=s;a==="inside"&&(ee(l.tag)||l.wrapFrom!=null)&&(a="after");const h=I(e,o),d=e.slice(h.from,h.to);if(!d)return e;const k=e.slice(0,h.from)+e.slice(h.to),N=h.to-h.from;let x;a==="before"?x=O(I(e,l).from,h.from,N):a==="inside"?x=O(Ge(e,l),h.from,N):x=O(I(e,l).to,h.from,N),x=Math.max(0,Math.min(x,k.length));let D=d;return x>0&&k[x-1]!==`
`&&D[0]!==`
`&&(D=`
${D}`),k.slice(0,x)+D+k.slice(x)}function Ze(e,t){if(!e||!t)return e;if(t.wrapFrom!=null&&t.wrapTo!=null){const r=e.slice(t.wrapFrom+4,t.wrapTo-3);return e.slice(0,t.wrapFrom)+r+e.slice(t.wrapTo)}return t.hidden?e:`${e.slice(0,t.from)}<!--${e.slice(t.from,t.to)}-->${e.slice(t.to)}`}function Qe(e,t,r){const i=e/Math.max(t,1);return r&&i>.32&&i<.68?"inside":i<.5?"before":"after"}function et(e,t){if(!e||!t)return e;const{from:r,to:i}=I(e,t);let s=e.slice(r,i);return s?(s.startsWith(`
`)||(s=`
${s}`),e.slice(0,i)+s+e.slice(i)):e}function tt(e,t){if(!e||!t)return e;const{from:r,to:i}=I(e,t);return e.slice(0,r)+e.slice(i)}const oe="sve-html-tree-labels";function ie(){try{const e=globalThis.localStorage?.getItem(oe);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function nt(e){try{globalThis.localStorage?.setItem(oe,JSON.stringify(e))}catch{}}function se(e){return String(e||"_")}function rt(e){const t=ie()[se(e)];return t&&typeof t=="object"?{...t}:{}}function ot(e,t,r){const i=r?.[t];return typeof i=="string"&&i.trim()?i.replace(/\s+/g," ").trim():String(e||"").trim()}function it(e,t,r,i){if(!t)return;const s=se(e),o=ie(),l={...o[s]||{}},a=String(r||"").replace(/\s+/g," ").trim(),h=String(i||"").trim();!a||a===h?delete l[t]:l[t]=a,Object.keys(l).length?o[s]=l:delete o[s],nt(o)}const y={div:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="3.5" width="11" height="9" rx="1.2"/></svg>',section:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2.5" width="12" height="11" rx="1.2"/><path d="M2 6.5h12"/></svg>',ul:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="4" r="1"/><circle cx="3.2" cy="8" r="1"/><circle cx="3.2" cy="12" r="1"/><rect x="5.5" y="3.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="7.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="11.2" width="8" height="1.5" rx=".4"/></svg>',li:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="8" r="1.1"/><rect x="5.5" y="7.2" width="8" height="1.6" rx=".4"/></svg>',a:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M6.2 8.8 4.8 10.2a2.2 2.2 0 0 0 3.1 3.1l1.8-1.8"/><path d="M9.8 7.2l1.4-1.4a2.2 2.2 0 0 0-3.1-3.1L6.3 4.5"/></svg>',img:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="3" width="12" height="10" rx="1.2"/><circle cx="5.5" cy="6.2" r="1.1"/><path d="M2.8 12.2 6.2 9l2.2 2.2 2-1.8 2.8 2.8"/></svg>',other:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M5.2 3.5 2.8 8l2.4 4.5"/><path d="M10.8 3.5 13.2 8l-2.4 4.5"/></svg>'};function st(e){return/^h[1-6]$/.test(e)?{letter:"H"}:e==="p"?{letter:"P"}:e==="div"?{svg:y.div}:e==="section"||e==="article"||e==="header"||e==="footer"||e==="main"||e==="nav"||e==="aside"?{svg:y.section}:e==="ul"||e==="ol"?{svg:y.ul}:e==="li"?{svg:y.li}:e==="a"?{svg:y.a}:e==="img"||e==="picture"||e==="svg"?{svg:y.img}:{svg:y.other}}const C="__sve-html-tree-panel",J="__sve-html-tree-style",E=new Set;let F=null,S=null,R=0,U=[],P=null,M=null,$=null,B=null,q=null,j=!1;function T(e){return e.getElementById(C)}function lt(e){let t=e.getElementById(J);t||(t=e.createElement("style"),t.id=J,e.head.appendChild(t)),t.textContent=`
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
      flex: none;
      opacity: .55;
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
    #${C} .sve-pane-hint {
      font-size: 12px !important;
      line-height: 1.35;
      opacity: .55;
    }
  `}function W(){const e=g("dock:html");return typeof e=="string"?e:""}function at(e){return!!g("dock:is-open",e)}function le(e){return g("dock:set-html",e)===!0}function b(e){const t=e.document,i=T(t)?.querySelector("[data-sve-html-tree-list]");if(!i)return;lt(t);const s=W(),o=ge(s);U=o;const l=ke(o,E),a=g("dock:current-type")||"",h=rt(a);!s.trim()&&!at(t)?n.emptyText=m(e,"html_tree_need_dock"):n.emptyText=m(e,"html_tree_empty"),n.renameTitle=m(e,"html_tree_rename"),n.hideTitle=m(e,"html_tree_hide"),n.showTitle=m(e,"html_tree_show"),n.duplicateTitle=m(e,"html_tree_duplicate"),n.deleteTitle=m(e,"html_tree_delete"),n.canEdit=!g("dock:is-locked"),n.onSelect=d=>ae(e,d,l),n.onTwist=d=>{E.has(d)?E.delete(d):E.add(d),b(e)},n.onRename=d=>ut(e,d),n.onRenameCommit=()=>Z(e,!0),n.onRenameCancel=()=>Z(e,!1),n.onHide=d=>ht(e,d),n.onDuplicate=d=>pt(e,d),n.onDelete=d=>ft(e,d),n.onPointerDown=(d,k)=>vt(e,d,k),n.rows=l.map(d=>{const k=st(d.tag);return{...d,name:ot(d.klass,d.path,h),current:d.id===F,letter:k.letter||"",svg:k.svg||""}}),K(i,Xe),dt(e,o)}function dt(e,t){if(!T(e.document))return;const r=t[0];V({source:"statamic-visual-editor",type:"sve-html-pick",on:!0,uid:g("dock:current-uid")||"",tag:r?.tag||"",klass:r?.klass||"",nodes:_e(t)},e)}function ct(e){if(!e)return;const t=[],r=String(e).split("/");for(let s=0;s<r.length;s+=1)t.push(r.slice(0,s+1).join("/"));const i=s=>{for(const o of s||[])t.includes(o.path)&&E.delete(o.id),i(o.children)};i(U)}function ut(e,t){if(j)return;const r=n.rows.find(i=>i.id===t);r&&(F=t,n.rows.forEach(i=>{i.current=i.id===t}),n.editingId=t,n.draft=r.name,e.setTimeout(()=>{const i=T(e.document)?.querySelector("[data-sve-ht-rename]");i?.focus(),i?.select()},0))}function Z(e,t){const r=n.editingId;if(!r)return;const i=n.rows.find(s=>s.id===r);n.editingId=null,t&&i&&it(g("dock:current-type")||"",i.path,n.draft,i.klass),n.draft="",b(e)}function ht(e,t){X(e,t,Ze)}function pt(e,t){X(e,t,et)}function ft(e,t){X(e,t,tt)}function X(e,t,r){if(g("dock:is-locked"))return;const i=W(),s=n.rows.find(l=>l.id===t);if(!s)return;const o=r(i,s);o!==i&&le(o)}function vt(e,t,r){if(t.button!==0||g("dock:is-locked")||n.editingId||t.target?.closest?.("button, input"))return;G(),P=r,M={x:t.clientX,y:t.clientY},$=t.currentTarget,B=t.pointerId;const i=o=>mt(e,o),s=o=>gt(e,o);q=()=>{e.document.removeEventListener("pointermove",i,!0),e.document.removeEventListener("pointerup",s,!0),e.document.removeEventListener("pointercancel",s,!0),q=null},e.document.addEventListener("pointermove",i,!0),e.document.addEventListener("pointerup",s,!0),e.document.addEventListener("pointercancel",s,!0)}function mt(e,t){if(!P||!M)return;const r=t.clientX-M.x,i=t.clientY-M.y;if(!n.dragging&&r*r+i*i<25)return;if(!n.dragging){n.dragging=!0;try{$?.setPointerCapture?.(B)}catch{}}t.preventDefault();const s=e.document.elementFromPoint(t.clientX,t.clientY)?.closest?.("[data-sve-ht-row]"),o=s?.getAttribute("data-sve-ht-id");if(!o||o===P){n.dropId=null,n.dropPlace=null;return}const l=n.rows.find(d=>d.id===o),a=n.rows.find(d=>d.id===P);if(!l||a&&l.path.startsWith(`${a.path}/`)){n.dropId=null,n.dropPlace=null;return}const h=s.getBoundingClientRect();n.dropId=o,n.dropPlace=Qe(t.clientY-h.top,h.height,!ee(l.tag))}function gt(e,t){const r=P,i=n.dropId,s=n.dropPlace||"after",o=n.dragging;if(G(),o&&(j=!0,e.setTimeout(()=>{j=!1},0)),!o||g("dock:is-locked")||!r||!i||r===i)return;t?.preventDefault?.();const l=W(),a=Je(l,U,r,i,s);a!==l&&le(a)}function G(){try{$?.releasePointerCapture?.(B)}catch{}q?.(),P=null,M=null,$=null,B=null,n.dragging=!1,n.dropId=null,n.dropPlace=null}function ae(e,t,r){if(j)return;const i=(r||n.rows).find(s=>s.id===t);i&&(F=t,n.rows.forEach(s=>{s.current=s.id===t}),g("dock:reveal-html",{from:i.from,to:i.to}),V({source:"statamic-visual-editor",type:"sve-html-pick-focus",path:i.path},e))}function kt(e,t){if(!t||!T(e.document))return;ct(t),b(e);const r=n.rows.find(i=>i.path===t);r&&ae(e,r.id,n.rows)}function de(e){if(S)return;S=ye("dock:html-changed",()=>{n.editingId||n.dragging||(e.clearTimeout(R),R=e.setTimeout(()=>{T(e.document)&&b(e)},80))})}function xt(e){S?.(),S=null,e?.clearTimeout?.(R),R=0}function A(e){const t=T(e.document);if(V({source:"statamic-visual-editor",type:"sve-html-pick",on:!1},e),xt(e),G(),F=null,n.editingId=null,n.draft="",!t){v.syncPreviewInset(e);return}t.remove(),be.headerTab==="html_tree"&&we(e,null),me(e),v.persistDockedPanel(e),te(e),v.syncPreviewInset(e)}function Tt(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=C,K(t,ne,{title:m(e,"html_tree"),hint:m(e,"html_tree_hint")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>A(e)))}function yt(e){de(e),b(e)}function bt(e){const t=e.document;if(!v.featureOn(e,"html_tree"))return;if(T(t)){A(e);return}v.closeRightPanels(e,[C]);const r=t.createElement("div");r.id=C,r.style.cssText=xe,K(r,ne,{title:m(e,"html_tree"),hint:m(e,"html_tree_hint")}),r.querySelector("[data-sve-close]")?.addEventListener("click",()=>A(e)),Te(e,r),v.persistDockedPanel(e),te(e),v.syncPreviewInset(e),de(e),b(e)}He("html-tree:from-preview",({path:e}={})=>{kt(window,e)});v.HTML_TREE_PANEL_ID=C;v.htmlTreePanel=T;v.closeHtmlTreePanel=A;v.fillHtmlTreePane=Tt;v.showHtmlTreePane=yt;v.toggleHtmlTreePanel=bt;v.renderHtmlTree=b;export{C as HTML_TREE_PANEL_ID,J as HTML_TREE_STYLE_ID,A as closeHtmlTreePanel,lt as ensureHtmlTreeStyles,Tt as fillHtmlTreePane,F as htmlTreeActiveId,E as htmlTreeCollapsed,T as htmlTreePanel,R as htmlTreeTimer,S as htmlTreeUnhook,b as renderHtmlTree,yt as showHtmlTreePane,xt as stopWatchHtmlTreeDock,bt as toggleHtmlTreePanel,de as watchHtmlTreeDock};
