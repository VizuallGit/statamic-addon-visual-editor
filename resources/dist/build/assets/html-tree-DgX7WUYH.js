import{_ as X,o as f,c as v,a as T,t as b,b as se,r as le,m as A,u as c,d as C,F as ae,e as de,w as L,f as u,g as ce,v as ue,i as G,s as p,h as he,j as J,k as Y,l as m,p as pe,n as fe,q as g,R as ve,x as me,y as ge,z as xe,A as ke}from"./addon-vS7MeqDy.js";const ye={class:"sve-html-tree"},Te={class:"sve-pane-bar","data-sve-pane-bar":""},be={"data-sve-right-title":""},we={class:"sve-pane-hint"},_e={__name:"HtmlTreePane",props:{title:{type:String,default:""},hint:{type:String,required:!0}},setup(e){return(t,r)=>(f(),v("div",ye,[T("div",Te,[T("div",be,b(e.title),1),r[0]||(r[0]=se('<div data-sve-right-actions data-v-d8a25374><button type="button" data-sve-right-pin aria-pressed="false" data-v-d8a25374></button><button type="button" data-sve-close aria-label="Close" data-v-d8a25374><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-d8a25374><path d="M18 6 6 18" data-v-d8a25374></path><path d="m6 6 12 12" data-v-d8a25374></path></svg></button></div>',1))]),T("div",we,b(e.hint),1),r[1]||(r[1]=T("div",{"data-sve-html-tree-list":""},null,-1))]))}},Z=X(_e,[["__scopeId","data-v-d8a25374"]]),n=le({emptyText:"",rows:[],editingId:null,draft:"",renameTitle:"",hideTitle:"",showTitle:"",duplicateTitle:"",deleteTitle:"",canEdit:!1,dragging:!1,dropId:null,dropPlace:null,onSelect:null,onTwist:null,onRename:null,onRenameCommit:null,onRenameCancel:null,onHide:null,onDuplicate:null,onDelete:null,onPointerDown:null}),He={key:0,class:"sve-ht-empty"},Pe=["title","onClick","onKeydown","onPointerdown"],Ce=["onClick"],Ee={key:1,"data-sve-ht-letter":""},Ie=["innerHTML"],Me=["title","onDblclick"],Le={"data-sve-ht-tag":""},Se={key:1,"data-sve-ht-name":""},De=["title","innerHTML","onClick"],Re=["title","onClick"],$e=["title","onClick"],Be='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',je='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Ae='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',Fe='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',Ne='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',Oe={__name:"HtmlTreeList",setup(e){function t(s){return s.name?`${s.tag} ${s.name}`:s.tag}function r(s){const i={"data-sve-ht-id":s.id};return s.current&&(i["data-sve-ht-current"]=""),s.hidden&&(i["data-sve-ht-hidden"]=""),n.dropId===s.id&&n.dropPlace&&(i["data-sve-ht-drop"]=n.dropPlace),i}function o(s){return!s.hidden||s.wrapFrom!=null}return(s,i)=>(f(),v("div",A({class:"sve-ht-root"},c(n).dragging?{"data-sve-ht-dragging":""}:{}),[c(n).rows.length?C("",!0):(f(),v("div",He,b(c(n).emptyText),1)),(f(!0),v(ae,null,de(c(n).rows,l=>(f(),v("div",A({key:l.id,"data-sve-ht-row":""},{ref_for:!0},r(l),{role:"button",tabindex:"0",title:t(l),style:{marginLeft:l.depth*12+"px"},onClick:a=>c(n).onSelect?.(l.id),onKeydown:[L(u(a=>c(n).onSelect?.(l.id),["prevent"]),["enter"]),L(u(a=>c(n).onSelect?.(l.id),["prevent"]),["space"])],onPointerdown:a=>c(n).onPointerDown?.(a,l.id)}),[l.hasChildren?(f(),v("button",A({key:0,type:"button","data-sve-ht-twist":""},{ref_for:!0},l.shut?{"data-sve-ht-shut":""}:{},{innerHTML:Be,onClick:u(a=>c(n).onTwist?.(l.id),["stop","prevent"]),onPointerdown:i[0]||(i[0]=u(()=>{},["stop"]))}),null,16,Ce)):C("",!0),l.letter?(f(),v("span",Ee,b(l.letter),1)):(f(),v("span",{key:2,"data-sve-ht-icon":"",innerHTML:l.svg},null,8,Ie)),T("span",{"data-sve-ht-text":"",title:c(n).renameTitle,onDblclick:u(a=>c(n).onRename?.(l.id),["stop","prevent"])},[T("span",Le,b(l.tag),1),c(n).editingId===l.id?ce((f(),v("input",{key:0,"data-sve-ht-rename":"","onUpdate:modelValue":i[1]||(i[1]=a=>c(n).draft=a),onMousedown:i[2]||(i[2]=u(()=>{},["stop"])),onPointerdown:i[3]||(i[3]=u(()=>{},["stop"])),onClick:i[4]||(i[4]=u(()=>{},["stop"])),onDblclick:i[5]||(i[5]=u(()=>{},["stop"])),onKeydown:[i[6]||(i[6]=u(()=>{},["stop"])),i[7]||(i[7]=L(u(a=>c(n).onRenameCommit?.(),["prevent"]),["enter"])),i[8]||(i[8]=L(u(a=>c(n).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:i[9]||(i[9]=a=>c(n).onRenameCommit?.())},null,544)),[[ue,c(n).draft]]):(f(),v("span",Se,b(l.name),1))],40,Me),c(n).canEdit&&o(l)?(f(),v("button",{key:3,type:"button","data-sve-ht-eye":"",title:l.hidden?c(n).showTitle:c(n).hideTitle,innerHTML:l.hidden?Ae:je,onClick:u(a=>c(n).onHide?.(l.id),["stop","prevent"]),onPointerdown:i[10]||(i[10]=u(()=>{},["stop"]))},null,40,De)):C("",!0),c(n).canEdit?(f(),v("button",{key:4,type:"button","data-sve-ht-dup":"",title:c(n).duplicateTitle,innerHTML:Fe,onClick:u(a=>c(n).onDuplicate?.(l.id),["stop","prevent"]),onPointerdown:i[11]||(i[11]=u(()=>{},["stop"]))},null,40,Re)):C("",!0),c(n).canEdit?(f(),v("button",{key:5,type:"button","data-sve-ht-del":"",title:c(n).deleteTitle,innerHTML:Ne,onClick:u(a=>c(n).onDelete?.(l.id),["stop","prevent"]),onPointerdown:i[12]||(i[12]=u(()=>{},["stop"]))},null,40,$e)):C("",!0)],16,Pe))),128))],16))}},ze=X(Oe,[["__scopeId","data-v-b196fc5c"]]);function N(e,t){for(const r of e||[]){if(r.id===t)return r;const o=N(r.children,t);if(o)return o}return null}function Q(e,t){return(e.children||[]).some(r=>r.id===t||Q(r,t))}function E(e,t){let r=t.wrapFrom??t.from,o=t.wrapTo??t.to;return r>0&&e[r-1]===`
`&&(r-=1),{from:r,to:o}}function Ye(e,t){const r=e.slice(t.from,t.to),o=`</${t.tag}`,s=r.toLowerCase().lastIndexOf(o);return s===-1?t.to:t.from+s}function F(e,t,r){return e>=t+r?e-r:e>t?t:e}function qe(e,t,r,o,s){const i=N(t,r),l=N(t,o);if(!e||!i||!l||r===o||Q(i,o))return e;let a=s;a==="inside"&&(G(l.tag)||l.wrapFrom!=null)&&(a="after");const h=E(e,i),d=e.slice(h.from,h.to);if(!d)return e;const x=e.slice(0,h.from)+e.slice(h.to),j=h.to-h.from;let k;a==="before"?k=F(E(e,l).from,h.from,j):a==="inside"?k=F(Ye(e,l),h.from,j):k=F(E(e,l).to,h.from,j),k=Math.max(0,Math.min(k,x.length));let M=d;return k>0&&x[k-1]!==`
`&&M[0]!==`
`&&(M=`
${M}`),x.slice(0,k)+M+x.slice(k)}function Ve(e,t){if(!e||!t)return e;if(t.wrapFrom!=null&&t.wrapTo!=null){const r=e.slice(t.wrapFrom+4,t.wrapTo-3);return e.slice(0,t.wrapFrom)+r+e.slice(t.wrapTo)}return t.hidden?e:`${e.slice(0,t.from)}<!--${e.slice(t.from,t.to)}-->${e.slice(t.to)}`}function Ke(e,t,r){const o=e/Math.max(t,1);return r&&o>.32&&o<.68?"inside":o<.5?"before":"after"}function Ue(e,t){if(!e||!t)return e;const{from:r,to:o}=E(e,t);let s=e.slice(r,o);return s?(s.startsWith(`
`)||(s=`
${s}`),e.slice(0,o)+s+e.slice(o)):e}function We(e,t){if(!e||!t)return e;const{from:r,to:o}=E(e,t);return e.slice(0,r)+e.slice(o)}const ee="sve-html-tree-labels";function te(){try{const e=globalThis.localStorage?.getItem(ee);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function Xe(e){try{globalThis.localStorage?.setItem(ee,JSON.stringify(e))}catch{}}function ne(e){return String(e||"_")}function Ge(e){const t=te()[ne(e)];return t&&typeof t=="object"?{...t}:{}}function Je(e,t,r){const o=r?.[t];return typeof o=="string"&&o.trim()?o.replace(/\s+/g," ").trim():String(e||"").trim()}function Ze(e,t,r,o){if(!t)return;const s=ne(e),i=te(),l={...i[s]||{}},a=String(r||"").replace(/\s+/g," ").trim(),h=String(o||"").trim();!a||a===h?delete l[t]:l[t]=a,Object.keys(l).length?i[s]=l:delete i[s],Xe(i)}const y={div:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="3.5" width="11" height="9" rx="1.2"/></svg>',section:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2.5" width="12" height="11" rx="1.2"/><path d="M2 6.5h12"/></svg>',ul:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="4" r="1"/><circle cx="3.2" cy="8" r="1"/><circle cx="3.2" cy="12" r="1"/><rect x="5.5" y="3.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="7.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="11.2" width="8" height="1.5" rx=".4"/></svg>',li:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="8" r="1.1"/><rect x="5.5" y="7.2" width="8" height="1.6" rx=".4"/></svg>',a:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M6.2 8.8 4.8 10.2a2.2 2.2 0 0 0 3.1 3.1l1.8-1.8"/><path d="M9.8 7.2l1.4-1.4a2.2 2.2 0 0 0-3.1-3.1L6.3 4.5"/></svg>',img:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="3" width="12" height="10" rx="1.2"/><circle cx="5.5" cy="6.2" r="1.1"/><path d="M2.8 12.2 6.2 9l2.2 2.2 2-1.8 2.8 2.8"/></svg>',other:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M5.2 3.5 2.8 8l2.4 4.5"/><path d="M10.8 3.5 13.2 8l-2.4 4.5"/></svg>'};function Qe(e){return/^h[1-6]$/.test(e)?{letter:"H"}:e==="p"?{letter:"P"}:e==="div"?{svg:y.div}:e==="section"||e==="article"||e==="header"||e==="footer"||e==="main"||e==="nav"||e==="aside"?{svg:y.section}:e==="ul"||e==="ol"?{svg:y.ul}:e==="li"?{svg:y.li}:e==="a"?{svg:y.a}:e==="img"||e==="picture"||e==="svg"?{svg:y.img}:{svg:y.other}}const _="__sve-html-tree-panel",U="__sve-html-tree-style",S=new Set;let B=null,D=null,R=0,re=[],w=null,I=null,O=null,z=!1;function H(e){return e.getElementById(_)}function et(e){let t=e.getElementById(U);t||(t=e.createElement("style"),t.id=U,e.head.appendChild(t)),t.textContent=`
    [data-sve-ht-row] {
      all: unset;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 3px 8px;
      min-height: 26px;
      margin-bottom: 3px;
      background: rgba(128,128,128,.16);
      border-radius: 6px;
      font-size: 11px;
      line-height: 1.3;
      cursor: grab;
      user-select: none;
      position: relative;
      touch-action: none;
    }
    [data-sve-ht-row]:active { cursor: grabbing; }
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
    [data-sve-ht-eye],
    [data-sve-ht-dup],
    [data-sve-ht-del] {
      all: unset;
      box-sizing: border-box;
      width: 18px;
      height: 18px;
      flex: none;
      display: none;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: .7;
      border-radius: 4px;
    }
    [data-sve-ht-eye] { margin-left: auto; }
    [data-sve-ht-row]:hover [data-sve-ht-eye],
    [data-sve-ht-row]:hover [data-sve-ht-dup],
    [data-sve-ht-row]:hover [data-sve-ht-del],
    [data-sve-ht-row][data-sve-ht-hidden] [data-sve-ht-eye],
    [data-sve-ht-row][data-sve-ht-hidden] [data-sve-ht-dup],
    [data-sve-ht-row][data-sve-ht-hidden] [data-sve-ht-del] {
      display: inline-flex;
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
      min-width: 1.2em;
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
  `}function q(){const e=g("dock:html");return typeof e=="string"?e:""}function tt(e){return!!g("dock:is-open",e)}function oe(e){return g("dock:set-html",e)===!0}function P(e){const t=e.document,o=H(t)?.querySelector("[data-sve-html-tree-list]");if(!o)return;et(t);const s=q(),i=pe(s);re=i;const l=fe(i,S),a=g("dock:current-type")||"",h=Ge(a);!s.trim()&&!tt(t)?n.emptyText=m(e,"html_tree_need_dock"):n.emptyText=m(e,"html_tree_empty"),n.renameTitle=m(e,"html_tree_rename"),n.hideTitle=m(e,"html_tree_hide"),n.showTitle=m(e,"html_tree_show"),n.duplicateTitle=m(e,"html_tree_duplicate"),n.deleteTitle=m(e,"html_tree_delete"),n.canEdit=!g("dock:is-locked"),n.onSelect=d=>dt(e,d,l),n.onTwist=d=>{S.has(d)?S.delete(d):S.add(d),P(e)},n.onRename=d=>nt(e,d),n.onRenameCommit=()=>W(e,!0),n.onRenameCancel=()=>W(e,!1),n.onHide=d=>rt(e,d),n.onDuplicate=d=>ot(e,d),n.onDelete=d=>it(e,d),n.onPointerDown=(d,x)=>st(e,d,x),n.rows=l.map(d=>{const x=Qe(d.tag);return{...d,name:Je(d.klass,d.path,h),current:d.id===B,letter:x.letter||"",svg:x.svg||""}}),Y(o,ze)}function nt(e,t){const r=n.rows.find(o=>o.id===t);r&&(B=t,n.rows.forEach(o=>{o.current=o.id===t}),n.editingId=t,n.draft=r.name,e.setTimeout(()=>{const o=H(e.document)?.querySelector("[data-sve-ht-rename]");o?.focus(),o?.select()},0))}function W(e,t){const r=n.editingId;if(!r)return;const o=n.rows.find(s=>s.id===r);n.editingId=null,t&&o&&Ze(g("dock:current-type")||"",o.path,n.draft,o.klass),n.draft="",P(e)}function rt(e,t){V(e,t,Ve)}function ot(e,t){V(e,t,Ue)}function it(e,t){V(e,t,We)}function V(e,t,r){if(g("dock:is-locked"))return;const o=q(),s=n.rows.find(l=>l.id===t);if(!s)return;const i=r(o,s);i!==o&&oe(i)}function st(e,t,r){if(t.button!==0||g("dock:is-locked")||n.editingId||t.target?.closest?.("button, input"))return;K(),w=r,I={x:t.clientX,y:t.clientY};try{t.currentTarget?.setPointerCapture?.(t.pointerId)}catch{}const o=i=>lt(e,i),s=i=>at(e,i);O=()=>{e.document.removeEventListener("pointermove",o,!0),e.document.removeEventListener("pointerup",s,!0),e.document.removeEventListener("pointercancel",s,!0),O=null},e.document.addEventListener("pointermove",o,!0),e.document.addEventListener("pointerup",s,!0),e.document.addEventListener("pointercancel",s,!0)}function lt(e,t){if(!w||!I)return;const r=t.clientX-I.x,o=t.clientY-I.y;if(!n.dragging&&r*r+o*o<25)return;t.preventDefault(),n.dragging=!0;const s=e.document.elementFromPoint(t.clientX,t.clientY)?.closest?.("[data-sve-ht-row]"),i=s?.getAttribute("data-sve-ht-id");if(!i||i===w){n.dropId=null,n.dropPlace=null;return}const l=n.rows.find(d=>d.id===i),a=n.rows.find(d=>d.id===w);if(!l||a&&l.path.startsWith(`${a.path}/`)){n.dropId=null,n.dropPlace=null;return}const h=s.getBoundingClientRect();n.dropId=i,n.dropPlace=Ke(t.clientY-h.top,h.height,!G(l.tag))}function at(e,t){const r=w,o=n.dropId,s=n.dropPlace||"after",i=n.dragging;if(K(),i&&(z=!0,e.setTimeout(()=>{z=!1},0)),!i||g("dock:is-locked")||!r||!o||r===o)return;t?.preventDefault?.();const l=q(),a=qe(l,re,r,o,s);a!==l&&oe(a)}function K(){O?.(),w=null,I=null,n.dragging=!1,n.dropId=null,n.dropPlace=null}function dt(e,t,r){if(z)return;const o=(r||n.rows).find(s=>s.id===t);o&&(B=t,n.rows.forEach(s=>{s.current=s.id===t}),g("dock:reveal-html",{from:o.from,to:o.to}))}function ie(e){if(D)return;D=ge("dock:html-changed",()=>{n.editingId||n.dragging||(e.clearTimeout(R),R=e.setTimeout(()=>{H(e.document)&&P(e)},80))})}function ct(e){D?.(),D=null,e?.clearTimeout?.(R),R=0}function $(e){const t=H(e.document);if(ct(e),K(),B=null,n.editingId=null,n.draft="",!t){p.syncPreviewInset(e);return}t.remove(),xe.headerTab==="html_tree"&&ke(e,null),he(e),p.persistDockedPanel(e),J(e),p.syncPreviewInset(e)}function ut(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=_,Y(t,Z,{title:m(e,"html_tree"),hint:m(e,"html_tree_hint")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>$(e)))}function ht(e){ie(e),P(e)}function pt(e){const t=e.document;if(!p.featureOn(e,"html_tree"))return;if(H(t)){$(e);return}p.closeRightPanels(e,[_]);const r=t.createElement("div");r.id=_,r.style.cssText=ve,Y(r,Z,{title:m(e,"html_tree"),hint:m(e,"html_tree_hint")}),r.querySelector("[data-sve-close]")?.addEventListener("click",()=>$(e)),me(e,r),p.persistDockedPanel(e),J(e),p.syncPreviewInset(e),ie(e),P(e)}p.HTML_TREE_PANEL_ID=_;p.htmlTreePanel=H;p.closeHtmlTreePanel=$;p.fillHtmlTreePane=ut;p.showHtmlTreePane=ht;p.toggleHtmlTreePanel=pt;p.renderHtmlTree=P;export{_ as HTML_TREE_PANEL_ID,U as HTML_TREE_STYLE_ID,$ as closeHtmlTreePanel,et as ensureHtmlTreeStyles,ut as fillHtmlTreePane,B as htmlTreeActiveId,S as htmlTreeCollapsed,H as htmlTreePanel,R as htmlTreeTimer,D as htmlTreeUnhook,P as renderHtmlTree,ht as showHtmlTreePane,ct as stopWatchHtmlTreeDock,pt as toggleHtmlTreePanel,ie as watchHtmlTreeDock};
