import{_ as ee,o as p,c as m,a as C,t as P,b as he,r as fe,m as O,u as c,d as w,F as pe,e as me,w as L,f as u,g as ve,v as ge,i as te,s as K,h as f,j as ke,k as ne,l as U,n as x,R as xe,p as Te,q as ye,x as be,y as v,z as we,A as He,B as Pe,C as _e}from"./addon-B7SUZ-V7.js";import{a as Ce}from"./html-pick-align-gkRPeJkt.js";const Ee={class:"sve-html-tree"},Ie={class:"sve-pane-bar","data-sve-pane-bar":""},Me={"data-sve-right-title":""},De={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){return(t,r)=>(p(),m("div",Ee,[C("div",Ie,[C("div",Me,P(e.title),1),r[0]||(r[0]=he('<div data-sve-right-actions data-v-b4ff8e88><button type="button" data-sve-right-pin aria-pressed="false" data-v-b4ff8e88></button><button type="button" data-sve-close aria-label="Close" data-v-b4ff8e88><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-b4ff8e88><path d="M18 6 6 18" data-v-b4ff8e88></path><path d="m6 6 12 12" data-v-b4ff8e88></path></svg></button></div>',1))]),r[1]||(r[1]=C("div",{"data-sve-html-tree-list":""},null,-1))]))}},re=ee(De,[["__scopeId","data-v-b4ff8e88"]]),n=fe({emptyText:"",rows:[],editingId:null,draft:"",renameTitle:"",hideTitle:"",showTitle:"",duplicateTitle:"",deleteTitle:"",canEdit:!1,dragging:!1,dropId:null,dropPlace:null,onSelect:null,onTwist:null,onRename:null,onRenameCommit:null,onRenameCancel:null,onHide:null,onDuplicate:null,onDelete:null,onPointerDown:null}),Le={key:0,class:"sve-ht-empty"},Se=["title","onClick","onDblclick","onKeydown","onPointerdown"],Re=["onClick"],$e={key:1,"data-sve-ht-letter":""},Be=["innerHTML"],je=["title"],Ae={"data-sve-ht-tag":""},Fe={key:1,"data-sve-ht-name":""},Ne={key:3,"data-sve-ht-actions":""},Oe=["title","innerHTML","onClick"],ze=["title","onClick"],Ye=["title","onClick"],Ve='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',qe='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Ke='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',Ue='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',We='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',Xe={__name:"HtmlTreeList",setup(e){function t(s){return s.name?`${s.tag} ${s.name}`:s.tag}function r(s){const o={"data-sve-ht-id":s.id};return s.current&&(o["data-sve-ht-current"]=""),s.hidden&&(o["data-sve-ht-hidden"]=""),n.dropId===s.id&&n.dropPlace&&(o["data-sve-ht-drop"]=n.dropPlace),o}function i(s){return!s.hidden||s.wrapFrom!=null}return(s,o)=>(p(),m("div",O({class:"sve-ht-root"},c(n).dragging?{"data-sve-ht-dragging":""}:{}),[c(n).rows.length?w("",!0):(p(),m("div",Le,P(c(n).emptyText),1)),(p(!0),m(pe,null,me(c(n).rows,l=>(p(),m("div",O({key:l.id,"data-sve-ht-row":""},{ref_for:!0},r(l),{role:"button",tabindex:"0",title:t(l),style:{marginLeft:l.depth*12+"px"},onClick:a=>c(n).onSelect?.(l.id),onDblclick:u(a=>c(n).onRename?.(l.id),["prevent"]),onKeydown:[L(u(a=>c(n).onSelect?.(l.id),["prevent"]),["enter"]),L(u(a=>c(n).onSelect?.(l.id),["prevent"]),["space"])],onPointerdown:a=>c(n).onPointerDown?.(a,l.id)}),[l.hasChildren?(p(),m("button",O({key:0,type:"button","data-sve-ht-twist":""},{ref_for:!0},l.shut?{"data-sve-ht-shut":""}:{},{innerHTML:Ve,onClick:u(a=>c(n).onTwist?.(l.id),["stop","prevent"]),onPointerdown:o[0]||(o[0]=u(()=>{},["stop"])),onDblclick:o[1]||(o[1]=u(()=>{},["stop"]))}),null,16,Re)):w("",!0),l.letter?(p(),m("span",$e,P(l.letter),1)):(p(),m("span",{key:2,"data-sve-ht-icon":"",innerHTML:l.svg},null,8,Be)),C("span",{"data-sve-ht-text":"",title:c(n).renameTitle},[C("span",Ae,P(l.tag),1),c(n).editingId===l.id?ve((p(),m("input",{key:0,"data-sve-ht-rename":"","onUpdate:modelValue":o[2]||(o[2]=a=>c(n).draft=a),onMousedown:o[3]||(o[3]=u(()=>{},["stop"])),onPointerdown:o[4]||(o[4]=u(()=>{},["stop"])),onClick:o[5]||(o[5]=u(()=>{},["stop"])),onDblclick:o[6]||(o[6]=u(()=>{},["stop"])),onKeydown:[o[7]||(o[7]=u(()=>{},["stop"])),o[8]||(o[8]=L(u(a=>c(n).onRenameCommit?.(),["prevent"]),["enter"])),o[9]||(o[9]=L(u(a=>c(n).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:o[10]||(o[10]=a=>c(n).onRenameCommit?.())},null,544)),[[ge,c(n).draft]]):(p(),m("span",Fe,P(l.name),1))],8,je),c(n).canEdit?(p(),m("span",Ne,[c(n).canEdit&&i(l)?(p(),m("button",{key:0,type:"button","data-sve-ht-eye":"",title:l.hidden?c(n).showTitle:c(n).hideTitle,innerHTML:l.hidden?Ke:qe,onClick:u(a=>c(n).onHide?.(l.id),["stop","prevent"]),onPointerdown:o[11]||(o[11]=u(()=>{},["stop"])),onDblclick:o[12]||(o[12]=u(()=>{},["stop"]))},null,40,Oe)):w("",!0),c(n).canEdit?(p(),m("button",{key:1,type:"button","data-sve-ht-dup":"",title:c(n).duplicateTitle,innerHTML:Ue,onClick:u(a=>c(n).onDuplicate?.(l.id),["stop","prevent"]),onPointerdown:o[13]||(o[13]=u(()=>{},["stop"])),onDblclick:o[14]||(o[14]=u(()=>{},["stop"]))},null,40,ze)):w("",!0),c(n).canEdit?(p(),m("button",{key:2,type:"button","data-sve-ht-del":"",title:c(n).deleteTitle,innerHTML:We,onClick:u(a=>c(n).onDelete?.(l.id),["stop","prevent"]),onPointerdown:o[15]||(o[15]=u(()=>{},["stop"])),onDblclick:o[16]||(o[16]=u(()=>{},["stop"]))},null,40,Ye)):w("",!0)])):w("",!0)],16,Se))),128))],16))}},Ge=ee(Xe,[["__scopeId","data-v-a292d01e"]]);function Y(e,t){for(const r of e||[]){if(r.id===t)return r;const i=Y(r.children,t);if(i)return i}return null}function oe(e,t){return(e.children||[]).some(r=>r.id===t||oe(r,t))}function E(e,t){let r=t.wrapFrom??t.from,i=t.wrapTo??t.to;return r>0&&e[r-1]===`
`&&(r-=1),{from:r,to:i}}function Je(e,t){const r=e.slice(t.from,t.to),i=`</${t.tag}`,s=r.toLowerCase().lastIndexOf(i);return s===-1?t.to:t.from+s}function z(e,t,r){return e>=t+r?e-r:e>t?t:e}function Ze(e,t,r,i,s){const o=Y(t,r),l=Y(t,i);if(!e||!o||!l||r===i||oe(o,i))return e;let a=s;a==="inside"&&(te(l.tag)||l.wrapFrom!=null)&&(a="after");const h=E(e,o),d=e.slice(h.from,h.to);if(!d)return e;const g=e.slice(0,h.from)+e.slice(h.to),N=h.to-h.from;let k;a==="before"?k=z(E(e,l).from,h.from,N):a==="inside"?k=z(Je(e,l),h.from,N):k=z(E(e,l).to,h.from,N),k=Math.max(0,Math.min(k,g.length));let D=d;return k>0&&g[k-1]!==`
`&&D[0]!==`
`&&(D=`
${D}`),g.slice(0,k)+D+g.slice(k)}function Qe(e,t){if(!e||!t)return e;if(t.wrapFrom!=null&&t.wrapTo!=null){const r=e.slice(t.wrapFrom+4,t.wrapTo-3);return e.slice(0,t.wrapFrom)+r+e.slice(t.wrapTo)}return t.hidden?e:`${e.slice(0,t.from)}<!--${e.slice(t.from,t.to)}-->${e.slice(t.to)}`}function et(e,t,r){const i=e/Math.max(t,1);return r&&i>.32&&i<.68?"inside":i<.5?"before":"after"}function tt(e,t){if(!e||!t)return e;const{from:r,to:i}=E(e,t);let s=e.slice(r,i);return s?(s.startsWith(`
`)||(s=`
${s}`),e.slice(0,i)+s+e.slice(i)):e}function nt(e,t){if(!e||!t)return e;const{from:r,to:i}=E(e,t);return e.slice(0,r)+e.slice(i)}const ie="sve-html-tree-labels";function se(){try{const e=globalThis.localStorage?.getItem(ie);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function rt(e){try{globalThis.localStorage?.setItem(ie,JSON.stringify(e))}catch{}}function le(e){return String(e||"_")}function ot(e){const t=se()[le(e)];return t&&typeof t=="object"?{...t}:{}}function it(e,t,r){const i=r?.[t];return typeof i=="string"&&i.trim()?i.replace(/\s+/g," ").trim():String(e||"").trim()}function st(e,t,r,i){if(!t)return;const s=le(e),o=se(),l={...o[s]||{}},a=String(r||"").replace(/\s+/g," ").trim(),h=String(i||"").trim();!a||a===h?delete l[t]:l[t]=a,Object.keys(l).length?o[s]=l:delete o[s],rt(o)}const b={div:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="3.5" width="11" height="9" rx="1.2"/></svg>',section:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2.5" width="12" height="11" rx="1.2"/><path d="M2 6.5h12"/></svg>',ul:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="4" r="1"/><circle cx="3.2" cy="8" r="1"/><circle cx="3.2" cy="12" r="1"/><rect x="5.5" y="3.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="7.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="11.2" width="8" height="1.5" rx=".4"/></svg>',li:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="8" r="1.1"/><rect x="5.5" y="7.2" width="8" height="1.6" rx=".4"/></svg>',a:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M6.2 8.8 4.8 10.2a2.2 2.2 0 0 0 3.1 3.1l1.8-1.8"/><path d="M9.8 7.2l1.4-1.4a2.2 2.2 0 0 0-3.1-3.1L6.3 4.5"/></svg>',img:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="3" width="12" height="10" rx="1.2"/><circle cx="5.5" cy="6.2" r="1.1"/><path d="M2.8 12.2 6.2 9l2.2 2.2 2-1.8 2.8 2.8"/></svg>',other:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M5.2 3.5 2.8 8l2.4 4.5"/><path d="M10.8 3.5 13.2 8l-2.4 4.5"/></svg>'};function lt(e){return/^h[1-6]$/.test(e)?{letter:"H"}:e==="p"?{letter:"P"}:e==="div"?{svg:b.div}:e==="section"||e==="article"||e==="header"||e==="footer"||e==="main"||e==="nav"||e==="aside"?{svg:b.section}:e==="ul"||e==="ol"?{svg:b.ul}:e==="li"?{svg:b.li}:e==="a"?{svg:b.a}:e==="img"||e==="picture"||e==="svg"?{svg:b.img}:{svg:b.other}}const M="__sve-html-tree-panel",Z="__sve-html-tree-style",_=new Set;let A=null,S=null,R=0,W=[],H=null,I=null,$=null,B=null,V=null,j=!1;function T(e){return e.getElementById(M)}function at(e){let t=e.getElementById(Z);t||(t=e.createElement("style"),t.id=Z,e.head.appendChild(t)),t.textContent=`
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
  `}function X(){const e=v("dock:html");return typeof e=="string"?e:""}function ae(e){return!!v("dock:is-open",e)}function de(e){return v("dock:set-html",e)===!0}function y(e){const t=e.document,i=T(t)?.querySelector("[data-sve-html-tree-list]");if(!i)return;at(t);const s=X(),o=ye(s);W=o;const l=be(o,_),a=v("dock:current-type")||"",h=ot(a);!s.trim()&&!ae(t)?n.emptyText=x(e,"html_tree_need_dock"):n.emptyText=x(e,"html_tree_empty"),n.renameTitle=x(e,"html_tree_rename"),n.hideTitle=x(e,"html_tree_hide"),n.showTitle=x(e,"html_tree_show"),n.duplicateTitle=x(e,"html_tree_duplicate"),n.deleteTitle=x(e,"html_tree_delete"),n.canEdit=!v("dock:is-locked"),n.onSelect=d=>ce(e,d,l),n.onTwist=d=>{_.has(d)?_.delete(d):_.add(d),y(e)},n.onRename=d=>ut(e,d),n.onRenameCommit=()=>Q(e,!0),n.onRenameCancel=()=>Q(e,!1),n.onHide=d=>ht(e,d),n.onDuplicate=d=>ft(e,d),n.onDelete=d=>pt(e,d),n.onPointerDown=(d,g)=>mt(e,d,g),n.rows=l.map(d=>{const g=lt(d.tag);return{...d,name:it(d.klass,d.path,h),current:d.id===A,letter:g.letter||"",svg:g.svg||""}}),U(i,Ge),dt(e,o)}function dt(e,t){if(!T(e.document))return;const r=t[0];K({source:"statamic-visual-editor",type:"sve-html-pick",on:!0,uid:v("dock:current-uid")||"",tag:r?.tag||"",klass:r?.klass||"",nodes:Ce(t)},e)}function ct(e){if(!e)return;const t=[],r=String(e).split("/");for(let s=0;s<r.length;s+=1)t.push(r.slice(0,s+1).join("/"));const i=s=>{for(const o of s||[])t.includes(o.path)&&_.delete(o.id),i(o.children)};i(W)}function ut(e,t){if(j)return;const r=n.rows.find(i=>i.id===t);r&&(A=t,n.rows.forEach(i=>{i.current=i.id===t}),n.editingId=t,n.draft=r.name,e.setTimeout(()=>{const i=T(e.document)?.querySelector("[data-sve-ht-rename]");i?.focus(),i?.select()},0))}function Q(e,t){const r=n.editingId;if(!r)return;const i=n.rows.find(s=>s.id===r);n.editingId=null,t&&i&&st(v("dock:current-type")||"",i.path,n.draft,i.klass),n.draft="",y(e)}function ht(e,t){G(e,t,Qe)}function ft(e,t){G(e,t,tt)}function pt(e,t){G(e,t,nt)}function G(e,t,r){if(v("dock:is-locked"))return;const i=X(),s=n.rows.find(l=>l.id===t);if(!s)return;const o=r(i,s);o!==i&&de(o)}function mt(e,t,r){if(t.button!==0||v("dock:is-locked")||n.editingId||t.target?.closest?.("button, input"))return;J(),H=r,I={x:t.clientX,y:t.clientY},$=t.currentTarget,B=t.pointerId;const i=o=>vt(e,o),s=o=>gt(e,o);V=()=>{e.document.removeEventListener("pointermove",i,!0),e.document.removeEventListener("pointerup",s,!0),e.document.removeEventListener("pointercancel",s,!0),V=null},e.document.addEventListener("pointermove",i,!0),e.document.addEventListener("pointerup",s,!0),e.document.addEventListener("pointercancel",s,!0)}function vt(e,t){if(!H||!I)return;const r=t.clientX-I.x,i=t.clientY-I.y;if(!n.dragging&&r*r+i*i<25)return;if(!n.dragging){n.dragging=!0;try{$?.setPointerCapture?.(B)}catch{}}t.preventDefault();const s=e.document.elementFromPoint(t.clientX,t.clientY)?.closest?.("[data-sve-ht-row]"),o=s?.getAttribute("data-sve-ht-id");if(!o||o===H){n.dropId=null,n.dropPlace=null;return}const l=n.rows.find(d=>d.id===o),a=n.rows.find(d=>d.id===H);if(!l||a&&l.path.startsWith(`${a.path}/`)){n.dropId=null,n.dropPlace=null;return}const h=s.getBoundingClientRect();n.dropId=o,n.dropPlace=et(t.clientY-h.top,h.height,!te(l.tag))}function gt(e,t){const r=H,i=n.dropId,s=n.dropPlace||"after",o=n.dragging;if(J(),o&&(j=!0,e.setTimeout(()=>{j=!1},0)),!o||v("dock:is-locked")||!r||!i||r===i)return;t?.preventDefault?.();const l=X(),a=Ze(l,W,r,i,s);a!==l&&de(a)}function J(){try{$?.releasePointerCapture?.(B)}catch{}V?.(),H=null,I=null,$=null,B=null,n.dragging=!1,n.dropId=null,n.dropPlace=null}function ce(e,t,r){if(j)return;const i=(r||n.rows).find(s=>s.id===t);i&&(A=t,n.rows.forEach(s=>{s.current=s.id===t}),v("dock:reveal-html",{from:i.from,to:i.to}),K({source:"statamic-visual-editor",type:"sve-html-pick-focus",path:i.path},e))}function kt(e,t){if(!t||!T(e.document))return;ct(t),y(e);const r=n.rows.find(i=>i.path===t);r&&ce(e,r.id,n.rows)}function q(e){if(S)return;S=we("dock:html-changed",()=>{n.editingId||n.dragging||(e.clearTimeout(R),R=e.setTimeout(()=>{T(e.document)&&y(e)},80))})}function xt(e){S?.(),S=null,e?.clearTimeout?.(R),R=0}function F(e){const t=T(e.document);if(K({source:"statamic-visual-editor",type:"sve-html-pick",on:!1},e),xt(e),J(),A=null,n.editingId=null,n.draft="",!t){f.syncPreviewInset(e);return}t.remove(),He.headerTab==="html_tree"&&Pe(e,null),ke(e),f.persistDockedPanel(e),ne(e),f.syncPreviewInset(e)}function Tt(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=M,U(t,re,{title:x(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>F(e)))}function yt(e){q(e),y(e)}function ue(e){const t=e.document;if(!f.featureOn(e,"html_tree"))return;if(T(t)){q(e),y(e);return}if(!ae(t))return;f.closeRightPanels(e,[M]);const r=t.createElement("div");r.id=M,r.style.cssText=xe,U(r,re,{title:x(e,"html_tree")}),r.querySelector("[data-sve-close]")?.addEventListener("click",()=>F(e)),Te(e,r),f.persistDockedPanel(e),ne(e),f.syncPreviewInset(e),q(e),y(e)}function bt(e){if(T(e.document)){F(e);return}ue(e)}_e("html-tree:from-preview",({path:e}={})=>{kt(window,e)});f.HTML_TREE_PANEL_ID=M;f.htmlTreePanel=T;f.closeHtmlTreePanel=F;f.fillHtmlTreePane=Tt;f.showHtmlTreePane=yt;f.openHtmlTreePanel=ue;f.toggleHtmlTreePanel=bt;f.renderHtmlTree=y;export{M as HTML_TREE_PANEL_ID,Z as HTML_TREE_STYLE_ID,F as closeHtmlTreePanel,at as ensureHtmlTreeStyles,Tt as fillHtmlTreePane,A as htmlTreeActiveId,_ as htmlTreeCollapsed,T as htmlTreePanel,R as htmlTreeTimer,S as htmlTreeUnhook,ue as openHtmlTreePanel,y as renderHtmlTree,yt as showHtmlTreePane,xt as stopWatchHtmlTreeDock,bt as toggleHtmlTreePanel,q as watchHtmlTreeDock};
