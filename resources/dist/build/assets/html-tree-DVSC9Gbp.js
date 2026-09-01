import{_ as J,o as p,c as f,a as b,t as w,b as ae,r as de,m as O,u as c,d as y,F as ce,e as ue,w as D,f as u,g as he,v as pe,i as Z,s as v,h as fe,j as Q,k as V,l as m,p as ve,n as me,q as g,R as ge,x as xe,y as ke,z as Te,A as ye}from"./addon-C9XUMh-X.js";const be={class:"sve-html-tree"},we={class:"sve-pane-bar","data-sve-pane-bar":""},He={"data-sve-right-title":""},_e={class:"sve-pane-hint"},Pe={__name:"HtmlTreePane",props:{title:{type:String,default:""},hint:{type:String,required:!0}},setup(e){return(t,o)=>(p(),f("div",be,[b("div",we,[b("div",He,w(e.title),1),o[0]||(o[0]=ae('<div data-sve-right-actions data-v-d8a25374><button type="button" data-sve-right-pin aria-pressed="false" data-v-d8a25374></button><button type="button" data-sve-close aria-label="Close" data-v-d8a25374><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-d8a25374><path d="M18 6 6 18" data-v-d8a25374></path><path d="m6 6 12 12" data-v-d8a25374></path></svg></button></div>',1))]),b("div",_e,w(e.hint),1),o[1]||(o[1]=b("div",{"data-sve-html-tree-list":""},null,-1))]))}},ee=J(Pe,[["__scopeId","data-v-d8a25374"]]),n=de({emptyText:"",rows:[],editingId:null,draft:"",renameTitle:"",hideTitle:"",showTitle:"",duplicateTitle:"",deleteTitle:"",canEdit:!1,dragging:!1,dropId:null,dropPlace:null,onSelect:null,onTwist:null,onRename:null,onRenameCommit:null,onRenameCancel:null,onHide:null,onDuplicate:null,onDelete:null,onPointerDown:null}),Ce={key:0,class:"sve-ht-empty"},Ee=["title","onClick","onDblclick","onKeydown","onPointerdown"],Ie=["onClick"],Me={key:1,"data-sve-ht-letter":""},De=["innerHTML"],Le=["title"],Se={"data-sve-ht-tag":""},Re={key:1,"data-sve-ht-name":""},$e={key:3,"data-sve-ht-actions":""},Be=["title","innerHTML","onClick"],je=["title","onClick"],Ae=["title","onClick"],Fe='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',Ne='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Oe='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',ze='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',Ye='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',qe={__name:"HtmlTreeList",setup(e){function t(s){return s.name?`${s.tag} ${s.name}`:s.tag}function o(s){const r={"data-sve-ht-id":s.id};return s.current&&(r["data-sve-ht-current"]=""),s.hidden&&(r["data-sve-ht-hidden"]=""),n.dropId===s.id&&n.dropPlace&&(r["data-sve-ht-drop"]=n.dropPlace),r}function i(s){return!s.hidden||s.wrapFrom!=null}return(s,r)=>(p(),f("div",O({class:"sve-ht-root"},c(n).dragging?{"data-sve-ht-dragging":""}:{}),[c(n).rows.length?y("",!0):(p(),f("div",Ce,w(c(n).emptyText),1)),(p(!0),f(ce,null,ue(c(n).rows,l=>(p(),f("div",O({key:l.id,"data-sve-ht-row":""},{ref_for:!0},o(l),{role:"button",tabindex:"0",title:t(l),style:{marginLeft:l.depth*12+"px"},onClick:a=>c(n).onSelect?.(l.id),onDblclick:u(a=>c(n).onRename?.(l.id),["prevent"]),onKeydown:[D(u(a=>c(n).onSelect?.(l.id),["prevent"]),["enter"]),D(u(a=>c(n).onSelect?.(l.id),["prevent"]),["space"])],onPointerdown:a=>c(n).onPointerDown?.(a,l.id)}),[l.hasChildren?(p(),f("button",O({key:0,type:"button","data-sve-ht-twist":""},{ref_for:!0},l.shut?{"data-sve-ht-shut":""}:{},{innerHTML:Fe,onClick:u(a=>c(n).onTwist?.(l.id),["stop","prevent"]),onPointerdown:r[0]||(r[0]=u(()=>{},["stop"])),onDblclick:r[1]||(r[1]=u(()=>{},["stop"]))}),null,16,Ie)):y("",!0),l.letter?(p(),f("span",Me,w(l.letter),1)):(p(),f("span",{key:2,"data-sve-ht-icon":"",innerHTML:l.svg},null,8,De)),b("span",{"data-sve-ht-text":"",title:c(n).renameTitle},[b("span",Se,w(l.tag),1),c(n).editingId===l.id?he((p(),f("input",{key:0,"data-sve-ht-rename":"","onUpdate:modelValue":r[2]||(r[2]=a=>c(n).draft=a),onMousedown:r[3]||(r[3]=u(()=>{},["stop"])),onPointerdown:r[4]||(r[4]=u(()=>{},["stop"])),onClick:r[5]||(r[5]=u(()=>{},["stop"])),onDblclick:r[6]||(r[6]=u(()=>{},["stop"])),onKeydown:[r[7]||(r[7]=u(()=>{},["stop"])),r[8]||(r[8]=D(u(a=>c(n).onRenameCommit?.(),["prevent"]),["enter"])),r[9]||(r[9]=D(u(a=>c(n).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:r[10]||(r[10]=a=>c(n).onRenameCommit?.())},null,544)),[[pe,c(n).draft]]):(p(),f("span",Re,w(l.name),1))],8,Le),c(n).canEdit?(p(),f("span",$e,[c(n).canEdit&&i(l)?(p(),f("button",{key:0,type:"button","data-sve-ht-eye":"",title:l.hidden?c(n).showTitle:c(n).hideTitle,innerHTML:l.hidden?Oe:Ne,onClick:u(a=>c(n).onHide?.(l.id),["stop","prevent"]),onPointerdown:r[11]||(r[11]=u(()=>{},["stop"])),onDblclick:r[12]||(r[12]=u(()=>{},["stop"]))},null,40,Be)):y("",!0),c(n).canEdit?(p(),f("button",{key:1,type:"button","data-sve-ht-dup":"",title:c(n).duplicateTitle,innerHTML:ze,onClick:u(a=>c(n).onDuplicate?.(l.id),["stop","prevent"]),onPointerdown:r[13]||(r[13]=u(()=>{},["stop"])),onDblclick:r[14]||(r[14]=u(()=>{},["stop"]))},null,40,je)):y("",!0),c(n).canEdit?(p(),f("button",{key:2,type:"button","data-sve-ht-del":"",title:c(n).deleteTitle,innerHTML:Ye,onClick:u(a=>c(n).onDelete?.(l.id),["stop","prevent"]),onPointerdown:r[15]||(r[15]=u(()=>{},["stop"])),onDblclick:r[16]||(r[16]=u(()=>{},["stop"]))},null,40,Ae)):y("",!0)])):y("",!0)],16,Ee))),128))],16))}},Ve=J(qe,[["__scopeId","data-v-a292d01e"]]);function Y(e,t){for(const o of e||[]){if(o.id===t)return o;const i=Y(o.children,t);if(i)return i}return null}function te(e,t){return(e.children||[]).some(o=>o.id===t||te(o,t))}function E(e,t){let o=t.wrapFrom??t.from,i=t.wrapTo??t.to;return o>0&&e[o-1]===`
`&&(o-=1),{from:o,to:i}}function Ke(e,t){const o=e.slice(t.from,t.to),i=`</${t.tag}`,s=o.toLowerCase().lastIndexOf(i);return s===-1?t.to:t.from+s}function z(e,t,o){return e>=t+o?e-o:e>t?t:e}function Ue(e,t,o,i,s){const r=Y(t,o),l=Y(t,i);if(!e||!r||!l||o===i||te(r,i))return e;let a=s;a==="inside"&&(Z(l.tag)||l.wrapFrom!=null)&&(a="after");const h=E(e,r),d=e.slice(h.from,h.to);if(!d)return e;const x=e.slice(0,h.from)+e.slice(h.to),N=h.to-h.from;let k;a==="before"?k=z(E(e,l).from,h.from,N):a==="inside"?k=z(Ke(e,l),h.from,N):k=z(E(e,l).to,h.from,N),k=Math.max(0,Math.min(k,x.length));let M=d;return k>0&&x[k-1]!==`
`&&M[0]!==`
`&&(M=`
${M}`),x.slice(0,k)+M+x.slice(k)}function We(e,t){if(!e||!t)return e;if(t.wrapFrom!=null&&t.wrapTo!=null){const o=e.slice(t.wrapFrom+4,t.wrapTo-3);return e.slice(0,t.wrapFrom)+o+e.slice(t.wrapTo)}return t.hidden?e:`${e.slice(0,t.from)}<!--${e.slice(t.from,t.to)}-->${e.slice(t.to)}`}function Xe(e,t,o){const i=e/Math.max(t,1);return o&&i>.32&&i<.68?"inside":i<.5?"before":"after"}function Ge(e,t){if(!e||!t)return e;const{from:o,to:i}=E(e,t);let s=e.slice(o,i);return s?(s.startsWith(`
`)||(s=`
${s}`),e.slice(0,i)+s+e.slice(i)):e}function Je(e,t){if(!e||!t)return e;const{from:o,to:i}=E(e,t);return e.slice(0,o)+e.slice(i)}const ne="sve-html-tree-labels";function re(){try{const e=globalThis.localStorage?.getItem(ne);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function Ze(e){try{globalThis.localStorage?.setItem(ne,JSON.stringify(e))}catch{}}function oe(e){return String(e||"_")}function Qe(e){const t=re()[oe(e)];return t&&typeof t=="object"?{...t}:{}}function et(e,t,o){const i=o?.[t];return typeof i=="string"&&i.trim()?i.replace(/\s+/g," ").trim():String(e||"").trim()}function tt(e,t,o,i){if(!t)return;const s=oe(e),r=re(),l={...r[s]||{}},a=String(o||"").replace(/\s+/g," ").trim(),h=String(i||"").trim();!a||a===h?delete l[t]:l[t]=a,Object.keys(l).length?r[s]=l:delete r[s],Ze(r)}const T={div:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="3.5" width="11" height="9" rx="1.2"/></svg>',section:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2.5" width="12" height="11" rx="1.2"/><path d="M2 6.5h12"/></svg>',ul:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="4" r="1"/><circle cx="3.2" cy="8" r="1"/><circle cx="3.2" cy="12" r="1"/><rect x="5.5" y="3.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="7.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="11.2" width="8" height="1.5" rx=".4"/></svg>',li:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="8" r="1.1"/><rect x="5.5" y="7.2" width="8" height="1.6" rx=".4"/></svg>',a:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M6.2 8.8 4.8 10.2a2.2 2.2 0 0 0 3.1 3.1l1.8-1.8"/><path d="M9.8 7.2l1.4-1.4a2.2 2.2 0 0 0-3.1-3.1L6.3 4.5"/></svg>',img:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="3" width="12" height="10" rx="1.2"/><circle cx="5.5" cy="6.2" r="1.1"/><path d="M2.8 12.2 6.2 9l2.2 2.2 2-1.8 2.8 2.8"/></svg>',other:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M5.2 3.5 2.8 8l2.4 4.5"/><path d="M10.8 3.5 13.2 8l-2.4 4.5"/></svg>'};function nt(e){return/^h[1-6]$/.test(e)?{letter:"H"}:e==="p"?{letter:"P"}:e==="div"?{svg:T.div}:e==="section"||e==="article"||e==="header"||e==="footer"||e==="main"||e==="nav"||e==="aside"?{svg:T.section}:e==="ul"||e==="ol"?{svg:T.ul}:e==="li"?{svg:T.li}:e==="a"?{svg:T.a}:e==="img"||e==="picture"||e==="svg"?{svg:T.img}:{svg:T.other}}const _="__sve-html-tree-panel",X="__sve-html-tree-style",L=new Set;let F=null,S=null,R=0,ie=[],H=null,I=null,$=null,B=null,q=null,j=!1;function P(e){return e.getElementById(_)}function rt(e){let t=e.getElementById(X);t||(t=e.createElement("style"),t.id=X,e.head.appendChild(t)),t.textContent=`
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
    #${_} .sve-pane-hint {
      font-size: 12px !important;
      line-height: 1.35;
      opacity: .55;
    }
  `}function K(){const e=g("dock:html");return typeof e=="string"?e:""}function ot(e){return!!g("dock:is-open",e)}function se(e){return g("dock:set-html",e)===!0}function C(e){const t=e.document,i=P(t)?.querySelector("[data-sve-html-tree-list]");if(!i)return;rt(t);const s=K(),r=ve(s);ie=r;const l=me(r,L),a=g("dock:current-type")||"",h=Qe(a);!s.trim()&&!ot(t)?n.emptyText=m(e,"html_tree_need_dock"):n.emptyText=m(e,"html_tree_empty"),n.renameTitle=m(e,"html_tree_rename"),n.hideTitle=m(e,"html_tree_hide"),n.showTitle=m(e,"html_tree_show"),n.duplicateTitle=m(e,"html_tree_duplicate"),n.deleteTitle=m(e,"html_tree_delete"),n.canEdit=!g("dock:is-locked"),n.onSelect=d=>ht(e,d,l),n.onTwist=d=>{L.has(d)?L.delete(d):L.add(d),C(e)},n.onRename=d=>it(e,d),n.onRenameCommit=()=>G(e,!0),n.onRenameCancel=()=>G(e,!1),n.onHide=d=>st(e,d),n.onDuplicate=d=>lt(e,d),n.onDelete=d=>at(e,d),n.onPointerDown=(d,x)=>dt(e,d,x),n.rows=l.map(d=>{const x=nt(d.tag);return{...d,name:et(d.klass,d.path,h),current:d.id===F,letter:x.letter||"",svg:x.svg||""}}),V(i,Ve)}function it(e,t){if(j)return;const o=n.rows.find(i=>i.id===t);o&&(F=t,n.rows.forEach(i=>{i.current=i.id===t}),n.editingId=t,n.draft=o.name,e.setTimeout(()=>{const i=P(e.document)?.querySelector("[data-sve-ht-rename]");i?.focus(),i?.select()},0))}function G(e,t){const o=n.editingId;if(!o)return;const i=n.rows.find(s=>s.id===o);n.editingId=null,t&&i&&tt(g("dock:current-type")||"",i.path,n.draft,i.klass),n.draft="",C(e)}function st(e,t){U(e,t,We)}function lt(e,t){U(e,t,Ge)}function at(e,t){U(e,t,Je)}function U(e,t,o){if(g("dock:is-locked"))return;const i=K(),s=n.rows.find(l=>l.id===t);if(!s)return;const r=o(i,s);r!==i&&se(r)}function dt(e,t,o){if(t.button!==0||g("dock:is-locked")||n.editingId||t.target?.closest?.("button, input"))return;W(),H=o,I={x:t.clientX,y:t.clientY},$=t.currentTarget,B=t.pointerId;const i=r=>ct(e,r),s=r=>ut(e,r);q=()=>{e.document.removeEventListener("pointermove",i,!0),e.document.removeEventListener("pointerup",s,!0),e.document.removeEventListener("pointercancel",s,!0),q=null},e.document.addEventListener("pointermove",i,!0),e.document.addEventListener("pointerup",s,!0),e.document.addEventListener("pointercancel",s,!0)}function ct(e,t){if(!H||!I)return;const o=t.clientX-I.x,i=t.clientY-I.y;if(!n.dragging&&o*o+i*i<25)return;if(!n.dragging){n.dragging=!0;try{$?.setPointerCapture?.(B)}catch{}}t.preventDefault();const s=e.document.elementFromPoint(t.clientX,t.clientY)?.closest?.("[data-sve-ht-row]"),r=s?.getAttribute("data-sve-ht-id");if(!r||r===H){n.dropId=null,n.dropPlace=null;return}const l=n.rows.find(d=>d.id===r),a=n.rows.find(d=>d.id===H);if(!l||a&&l.path.startsWith(`${a.path}/`)){n.dropId=null,n.dropPlace=null;return}const h=s.getBoundingClientRect();n.dropId=r,n.dropPlace=Xe(t.clientY-h.top,h.height,!Z(l.tag))}function ut(e,t){const o=H,i=n.dropId,s=n.dropPlace||"after",r=n.dragging;if(W(),r&&(j=!0,e.setTimeout(()=>{j=!1},0)),!r||g("dock:is-locked")||!o||!i||o===i)return;t?.preventDefault?.();const l=K(),a=Ue(l,ie,o,i,s);a!==l&&se(a)}function W(){try{$?.releasePointerCapture?.(B)}catch{}q?.(),H=null,I=null,$=null,B=null,n.dragging=!1,n.dropId=null,n.dropPlace=null}function ht(e,t,o){if(j)return;const i=(o||n.rows).find(s=>s.id===t);i&&(F=t,n.rows.forEach(s=>{s.current=s.id===t}),g("dock:reveal-html",{from:i.from,to:i.to}))}function le(e){if(S)return;S=ke("dock:html-changed",()=>{n.editingId||n.dragging||(e.clearTimeout(R),R=e.setTimeout(()=>{P(e.document)&&C(e)},80))})}function pt(e){S?.(),S=null,e?.clearTimeout?.(R),R=0}function A(e){const t=P(e.document);if(pt(e),W(),F=null,n.editingId=null,n.draft="",!t){v.syncPreviewInset(e);return}t.remove(),Te.headerTab==="html_tree"&&ye(e,null),fe(e),v.persistDockedPanel(e),Q(e),v.syncPreviewInset(e)}function ft(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=_,V(t,ee,{title:m(e,"html_tree"),hint:m(e,"html_tree_hint")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>A(e)))}function vt(e){le(e),C(e)}function mt(e){const t=e.document;if(!v.featureOn(e,"html_tree"))return;if(P(t)){A(e);return}v.closeRightPanels(e,[_]);const o=t.createElement("div");o.id=_,o.style.cssText=ge,V(o,ee,{title:m(e,"html_tree"),hint:m(e,"html_tree_hint")}),o.querySelector("[data-sve-close]")?.addEventListener("click",()=>A(e)),xe(e,o),v.persistDockedPanel(e),Q(e),v.syncPreviewInset(e),le(e),C(e)}v.HTML_TREE_PANEL_ID=_;v.htmlTreePanel=P;v.closeHtmlTreePanel=A;v.fillHtmlTreePane=ft;v.showHtmlTreePane=vt;v.toggleHtmlTreePanel=mt;v.renderHtmlTree=C;export{_ as HTML_TREE_PANEL_ID,X as HTML_TREE_STYLE_ID,A as closeHtmlTreePanel,rt as ensureHtmlTreeStyles,ft as fillHtmlTreePane,F as htmlTreeActiveId,L as htmlTreeCollapsed,P as htmlTreePanel,R as htmlTreeTimer,S as htmlTreeUnhook,C as renderHtmlTree,vt as showHtmlTreePane,pt as stopWatchHtmlTreeDock,mt as toggleHtmlTreePanel,le as watchHtmlTreeDock};
