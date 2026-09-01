import{_ as Z,o as p,c as g,a as H,t as _,b as de,r as ce,m as O,u as c,d as w,F as ue,e as he,w as S,f as u,g as fe,v as pe,i as Q,s as v,h as ge,j as ee,k as V,l as m,p as ve,n as me,q as x,R as xe,x as ke,y as X,z as Te,A as ye}from"./addon-DOuQhDZU.js";const be={class:"sve-html-tree"},we={class:"sve-pane-bar","data-sve-pane-bar":""},He={"data-sve-right-title":""},_e={class:"sve-pane-hint"},Pe={__name:"HtmlTreePane",props:{title:{type:String,default:""},hint:{type:String,required:!0}},setup(e){return(t,r)=>(p(),g("div",be,[H("div",we,[H("div",He,_(e.title),1),r[0]||(r[0]=de('<div data-sve-right-actions data-v-d8a25374><button type="button" data-sve-right-pin aria-pressed="false" data-v-d8a25374></button><button type="button" data-sve-close aria-label="Close" data-v-d8a25374><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-d8a25374><path d="M18 6 6 18" data-v-d8a25374></path><path d="m6 6 12 12" data-v-d8a25374></path></svg></button></div>',1))]),H("div",_e,_(e.hint),1),r[1]||(r[1]=H("div",{"data-sve-html-tree-list":""},null,-1))]))}},te=Z(Pe,[["__scopeId","data-v-d8a25374"]]),n=ce({emptyText:"",rows:[],editingId:null,draft:"",renameTitle:"",hideTitle:"",showTitle:"",duplicateTitle:"",deleteTitle:"",canEdit:!1,dragging:!1,dropId:null,dropPlace:null,onSelect:null,onTwist:null,onRename:null,onRenameCommit:null,onRenameCancel:null,onHide:null,onDuplicate:null,onDelete:null,onPointerDown:null}),Ee={key:0,class:"sve-ht-empty"},Ce=["title","onClick","onDblclick","onKeydown","onPointerdown"],Ie=["onClick"],Me={key:1,"data-sve-ht-letter":""},De=["innerHTML"],Le=["title"],Se={"data-sve-ht-tag":""},Re={key:1,"data-sve-ht-name":""},$e={key:3,"data-sve-ht-actions":""},Be=["title","innerHTML","onClick"],je=["title","onClick"],Ae=["title","onClick"],Fe='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',Ne='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Oe='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',ze='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',Ye='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',qe={__name:"HtmlTreeList",setup(e){function t(l){return l.name?`${l.tag} ${l.name}`:l.tag}function r(l){const o={"data-sve-ht-id":l.id};return l.current&&(o["data-sve-ht-current"]=""),l.hidden&&(o["data-sve-ht-hidden"]=""),n.dropId===l.id&&n.dropPlace&&(o["data-sve-ht-drop"]=n.dropPlace),o}function i(l){return!l.hidden||l.wrapFrom!=null}return(l,o)=>(p(),g("div",O({class:"sve-ht-root"},c(n).dragging?{"data-sve-ht-dragging":""}:{}),[c(n).rows.length?w("",!0):(p(),g("div",Ee,_(c(n).emptyText),1)),(p(!0),g(ue,null,he(c(n).rows,s=>(p(),g("div",O({key:s.id,"data-sve-ht-row":""},{ref_for:!0},r(s),{role:"button",tabindex:"0",title:t(s),style:{marginLeft:s.depth*12+"px"},onClick:a=>c(n).onSelect?.(s.id),onDblclick:u(a=>c(n).onRename?.(s.id),["prevent"]),onKeydown:[S(u(a=>c(n).onSelect?.(s.id),["prevent"]),["enter"]),S(u(a=>c(n).onSelect?.(s.id),["prevent"]),["space"])],onPointerdown:a=>c(n).onPointerDown?.(a,s.id)}),[s.hasChildren?(p(),g("button",O({key:0,type:"button","data-sve-ht-twist":""},{ref_for:!0},s.shut?{"data-sve-ht-shut":""}:{},{innerHTML:Fe,onClick:u(a=>c(n).onTwist?.(s.id),["stop","prevent"]),onPointerdown:o[0]||(o[0]=u(()=>{},["stop"])),onDblclick:o[1]||(o[1]=u(()=>{},["stop"]))}),null,16,Ie)):w("",!0),s.letter?(p(),g("span",Me,_(s.letter),1)):(p(),g("span",{key:2,"data-sve-ht-icon":"",innerHTML:s.svg},null,8,De)),H("span",{"data-sve-ht-text":"",title:c(n).renameTitle},[H("span",Se,_(s.tag),1),c(n).editingId===s.id?fe((p(),g("input",{key:0,"data-sve-ht-rename":"","onUpdate:modelValue":o[2]||(o[2]=a=>c(n).draft=a),onMousedown:o[3]||(o[3]=u(()=>{},["stop"])),onPointerdown:o[4]||(o[4]=u(()=>{},["stop"])),onClick:o[5]||(o[5]=u(()=>{},["stop"])),onDblclick:o[6]||(o[6]=u(()=>{},["stop"])),onKeydown:[o[7]||(o[7]=u(()=>{},["stop"])),o[8]||(o[8]=S(u(a=>c(n).onRenameCommit?.(),["prevent"]),["enter"])),o[9]||(o[9]=S(u(a=>c(n).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:o[10]||(o[10]=a=>c(n).onRenameCommit?.())},null,544)),[[pe,c(n).draft]]):(p(),g("span",Re,_(s.name),1))],8,Le),c(n).canEdit?(p(),g("span",$e,[c(n).canEdit&&i(s)?(p(),g("button",{key:0,type:"button","data-sve-ht-eye":"",title:s.hidden?c(n).showTitle:c(n).hideTitle,innerHTML:s.hidden?Oe:Ne,onClick:u(a=>c(n).onHide?.(s.id),["stop","prevent"]),onPointerdown:o[11]||(o[11]=u(()=>{},["stop"])),onDblclick:o[12]||(o[12]=u(()=>{},["stop"]))},null,40,Be)):w("",!0),c(n).canEdit?(p(),g("button",{key:1,type:"button","data-sve-ht-dup":"",title:c(n).duplicateTitle,innerHTML:ze,onClick:u(a=>c(n).onDuplicate?.(s.id),["stop","prevent"]),onPointerdown:o[13]||(o[13]=u(()=>{},["stop"])),onDblclick:o[14]||(o[14]=u(()=>{},["stop"]))},null,40,je)):w("",!0),c(n).canEdit?(p(),g("button",{key:2,type:"button","data-sve-ht-del":"",title:c(n).deleteTitle,innerHTML:Ye,onClick:u(a=>c(n).onDelete?.(s.id),["stop","prevent"]),onPointerdown:o[15]||(o[15]=u(()=>{},["stop"])),onDblclick:o[16]||(o[16]=u(()=>{},["stop"]))},null,40,Ae)):w("",!0)])):w("",!0)],16,Ce))),128))],16))}},Ve=Z(qe,[["__scopeId","data-v-a292d01e"]]);function Y(e,t){for(const r of e||[]){if(r.id===t)return r;const i=Y(r.children,t);if(i)return i}return null}function ne(e,t){return(e.children||[]).some(r=>r.id===t||ne(r,t))}function M(e,t){let r=t.wrapFrom??t.from,i=t.wrapTo??t.to;return r>0&&e[r-1]===`
`&&(r-=1),{from:r,to:i}}function Ke(e,t){const r=e.slice(t.from,t.to),i=`</${t.tag}`,l=r.toLowerCase().lastIndexOf(i);return l===-1?t.to:t.from+l}function z(e,t,r){return e>=t+r?e-r:e>t?t:e}function Ue(e,t,r,i,l){const o=Y(t,r),s=Y(t,i);if(!e||!o||!s||r===i||ne(o,i))return e;let a=l;a==="inside"&&(Q(s.tag)||s.wrapFrom!=null)&&(a="after");const h=M(e,o),T=e.slice(h.from,h.to);if(!T)return e;const d=e.slice(0,h.from)+e.slice(h.to),f=h.to-h.from;let k;a==="before"?k=z(M(e,s).from,h.from,f):a==="inside"?k=z(Ke(e,s),h.from,f):k=z(M(e,s).to,h.from,f),k=Math.max(0,Math.min(k,d.length));let L=T;return k>0&&d[k-1]!==`
`&&L[0]!==`
`&&(L=`
${L}`),d.slice(0,k)+L+d.slice(k)}function We(e,t){if(!e||!t)return e;if(t.wrapFrom!=null&&t.wrapTo!=null){const r=e.slice(t.wrapFrom+4,t.wrapTo-3);return e.slice(0,t.wrapFrom)+r+e.slice(t.wrapTo)}return t.hidden?e:`${e.slice(0,t.from)}<!--${e.slice(t.from,t.to)}-->${e.slice(t.to)}`}function Xe(e,t,r){const i=e/Math.max(t,1);return r&&i>.32&&i<.68?"inside":i<.5?"before":"after"}function Ge(e,t){if(!e||!t)return e;const{from:r,to:i}=M(e,t);let l=e.slice(r,i);return l?(l.startsWith(`
`)||(l=`
${l}`),e.slice(0,i)+l+e.slice(i)):e}function Je(e,t){if(!e||!t)return e;const{from:r,to:i}=M(e,t);return e.slice(0,r)+e.slice(i)}const re="sve-html-tree-labels";function oe(){try{const e=globalThis.localStorage?.getItem(re);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function Ze(e){try{globalThis.localStorage?.setItem(re,JSON.stringify(e))}catch{}}function ie(e){return String(e||"_")}function Qe(e){const t=oe()[ie(e)];return t&&typeof t=="object"?{...t}:{}}function et(e,t,r){const i=r?.[t];return typeof i=="string"&&i.trim()?i.replace(/\s+/g," ").trim():String(e||"").trim()}function tt(e,t,r,i){if(!t)return;const l=ie(e),o=oe(),s={...o[l]||{}},a=String(r||"").replace(/\s+/g," ").trim(),h=String(i||"").trim();!a||a===h?delete s[t]:s[t]=a,Object.keys(s).length?o[l]=s:delete o[l],Ze(o)}const b={div:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="3.5" width="11" height="9" rx="1.2"/></svg>',section:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2.5" width="12" height="11" rx="1.2"/><path d="M2 6.5h12"/></svg>',ul:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="4" r="1"/><circle cx="3.2" cy="8" r="1"/><circle cx="3.2" cy="12" r="1"/><rect x="5.5" y="3.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="7.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="11.2" width="8" height="1.5" rx=".4"/></svg>',li:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="8" r="1.1"/><rect x="5.5" y="7.2" width="8" height="1.6" rx=".4"/></svg>',a:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M6.2 8.8 4.8 10.2a2.2 2.2 0 0 0 3.1 3.1l1.8-1.8"/><path d="M9.8 7.2l1.4-1.4a2.2 2.2 0 0 0-3.1-3.1L6.3 4.5"/></svg>',img:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="3" width="12" height="10" rx="1.2"/><circle cx="5.5" cy="6.2" r="1.1"/><path d="M2.8 12.2 6.2 9l2.2 2.2 2-1.8 2.8 2.8"/></svg>',other:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M5.2 3.5 2.8 8l2.4 4.5"/><path d="M10.8 3.5 13.2 8l-2.4 4.5"/></svg>'};function nt(e){return/^h[1-6]$/.test(e)?{letter:"H"}:e==="p"?{letter:"P"}:e==="div"?{svg:b.div}:e==="section"||e==="article"||e==="header"||e==="footer"||e==="main"||e==="nav"||e==="aside"?{svg:b.section}:e==="ul"||e==="ol"?{svg:b.ul}:e==="li"?{svg:b.li}:e==="a"?{svg:b.a}:e==="img"||e==="picture"||e==="svg"?{svg:b.img}:{svg:b.other}}const E="__sve-html-tree-panel",G="__sve-html-tree-style",R=new Set;let y=null,$=null,B=0,le=[],P=null,D=null,j=null,A=null,q=null,F=!1;function C(e){return e.getElementById(E)}function rt(e){let t=e.getElementById(G);t||(t=e.createElement("style"),t.id=G,e.head.appendChild(t)),t.textContent=`
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
    #${E} .sve-pane-hint {
      font-size: 12px !important;
      line-height: 1.35;
      opacity: .55;
    }
  `}function K(){const e=x("dock:html");return typeof e=="string"?e:""}function ot(e){return!!x("dock:is-open",e)}function se(e){return x("dock:set-html",e)===!0}function I(e){const t=e.document,i=C(t)?.querySelector("[data-sve-html-tree-list]");if(!i)return;rt(t);const l=K(),o=ve(l);le=o;const s=me(o,R),a=x("html-tag:current");if(a){const d=s.find(f=>f.from===a.from&&f.to===a.to)||(a.field?s.find(f=>f.field===a.field&&(!a.tag||f.tag===a.tag)):null);d&&(y=d.id)}else y=null;const h=x("dock:current-type")||"",T=Qe(h);!l.trim()&&!ot(t)?n.emptyText=m(e,"html_tree_need_dock"):n.emptyText=m(e,"html_tree_empty"),n.renameTitle=m(e,"html_tree_rename"),n.hideTitle=m(e,"html_tree_hide"),n.showTitle=m(e,"html_tree_show"),n.duplicateTitle=m(e,"html_tree_duplicate"),n.deleteTitle=m(e,"html_tree_delete"),n.canEdit=!x("dock:is-locked"),n.onSelect=d=>ht(e,d,s),n.onTwist=d=>{R.has(d)?R.delete(d):R.add(d),I(e)},n.onRename=d=>it(e,d),n.onRenameCommit=()=>J(e,!0),n.onRenameCancel=()=>J(e,!1),n.onHide=d=>lt(e,d),n.onDuplicate=d=>st(e,d),n.onDelete=d=>at(e,d),n.onPointerDown=(d,f)=>dt(e,d,f),n.rows=s.map(d=>{const f=nt(d.tag);return{...d,name:et(d.klass,d.path,T),current:d.id===y,letter:f.letter||"",svg:f.svg||""}}),V(i,Ve)}function it(e,t){if(F)return;const r=n.rows.find(i=>i.id===t);r&&(y=t,n.rows.forEach(i=>{i.current=i.id===t}),n.editingId=t,n.draft=r.name,e.setTimeout(()=>{const i=C(e.document)?.querySelector("[data-sve-ht-rename]");i?.focus(),i?.select()},0))}function J(e,t){const r=n.editingId;if(!r)return;const i=n.rows.find(l=>l.id===r);n.editingId=null,t&&i&&tt(x("dock:current-type")||"",i.path,n.draft,i.klass),n.draft="",I(e)}function lt(e,t){U(e,t,We)}function st(e,t){U(e,t,Ge)}function at(e,t){U(e,t,Je)}function U(e,t,r){if(x("dock:is-locked"))return;const i=K(),l=n.rows.find(s=>s.id===t);if(!l)return;const o=r(i,l);o!==i&&se(o)}function dt(e,t,r){if(t.button!==0||x("dock:is-locked")||n.editingId||t.target?.closest?.("button, input"))return;W(),P=r,D={x:t.clientX,y:t.clientY},j=t.currentTarget,A=t.pointerId;const i=o=>ct(e,o),l=o=>ut(e,o);q=()=>{e.document.removeEventListener("pointermove",i,!0),e.document.removeEventListener("pointerup",l,!0),e.document.removeEventListener("pointercancel",l,!0),q=null},e.document.addEventListener("pointermove",i,!0),e.document.addEventListener("pointerup",l,!0),e.document.addEventListener("pointercancel",l,!0)}function ct(e,t){if(!P||!D)return;const r=t.clientX-D.x,i=t.clientY-D.y;if(!n.dragging&&r*r+i*i<25)return;if(!n.dragging){n.dragging=!0;try{j?.setPointerCapture?.(A)}catch{}}t.preventDefault();const l=e.document.elementFromPoint(t.clientX,t.clientY)?.closest?.("[data-sve-ht-row]"),o=l?.getAttribute("data-sve-ht-id");if(!o||o===P){n.dropId=null,n.dropPlace=null;return}const s=n.rows.find(T=>T.id===o),a=n.rows.find(T=>T.id===P);if(!s||a&&s.path.startsWith(`${a.path}/`)){n.dropId=null,n.dropPlace=null;return}const h=l.getBoundingClientRect();n.dropId=o,n.dropPlace=Xe(t.clientY-h.top,h.height,!Q(s.tag))}function ut(e,t){const r=P,i=n.dropId,l=n.dropPlace||"after",o=n.dragging;if(W(),o&&(F=!0,e.setTimeout(()=>{F=!1},0)),!o||x("dock:is-locked")||!r||!i||r===i)return;t?.preventDefault?.();const s=K(),a=Ue(s,le,r,i,l);a!==s&&se(a)}function W(){try{j?.releasePointerCapture?.(A)}catch{}q?.(),P=null,D=null,j=null,A=null,n.dragging=!1,n.dropId=null,n.dropPlace=null}function ht(e,t,r){if(F)return;const i=(r||n.rows).find(l=>l.id===t);i&&(y=t,n.rows.forEach(l=>{l.current=l.id===t}),x("html-tag:select",{from:i.from,to:i.to,field:i.field,tag:i.tag,source:"tree"}))}function ft(e){if(!e){y=null,n.rows.forEach(r=>{r.current=!1});return}const t=n.rows.find(r=>r.from===e.from&&r.to===e.to)||(e.field?n.rows.find(r=>r.field===e.field&&(!e.tag||r.tag===e.tag)):null);t&&(y=t.id,n.rows.forEach(r=>{r.current=r.id===t.id}))}function ae(e){if($)return;const r=X("dock:html-changed",()=>{n.editingId||n.dragging||(e.clearTimeout(B),B=e.setTimeout(()=>{C(e.document)&&I(e)},80))}),i=X("html-tag:selected",l=>{ft(l)});$=()=>{r(),i()}}function pt(e){$?.(),$=null,e?.clearTimeout?.(B),B=0}function N(e){const t=C(e.document);if(pt(e),W(),y=null,n.editingId=null,n.draft="",!t){v.syncPreviewInset(e);return}t.remove(),Te.headerTab==="html_tree"&&ye(e,null),ge(e),v.persistDockedPanel(e),ee(e),v.syncPreviewInset(e)}function gt(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=E,V(t,te,{title:m(e,"html_tree"),hint:m(e,"html_tree_hint")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>N(e)))}function vt(e){ae(e),I(e)}function mt(e){const t=e.document;if(!v.featureOn(e,"html_tree"))return;if(C(t)){N(e);return}v.closeRightPanels(e,[E]);const r=t.createElement("div");r.id=E,r.style.cssText=xe,V(r,te,{title:m(e,"html_tree"),hint:m(e,"html_tree_hint")}),r.querySelector("[data-sve-close]")?.addEventListener("click",()=>N(e)),ke(e,r),v.persistDockedPanel(e),ee(e),v.syncPreviewInset(e),ae(e),I(e)}v.HTML_TREE_PANEL_ID=E;v.htmlTreePanel=C;v.closeHtmlTreePanel=N;v.fillHtmlTreePane=gt;v.showHtmlTreePane=vt;v.toggleHtmlTreePanel=mt;v.renderHtmlTree=I;export{E as HTML_TREE_PANEL_ID,G as HTML_TREE_STYLE_ID,N as closeHtmlTreePanel,rt as ensureHtmlTreeStyles,gt as fillHtmlTreePane,y as htmlTreeActiveId,R as htmlTreeCollapsed,C as htmlTreePanel,B as htmlTreeTimer,$ as htmlTreeUnhook,I as renderHtmlTree,vt as showHtmlTreePane,pt as stopWatchHtmlTreeDock,mt as toggleHtmlTreePanel,ae as watchHtmlTreeDock};
