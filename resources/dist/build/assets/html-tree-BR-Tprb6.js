import{_ as B,o as c,c as h,a as f,t as g,b as O,r as K,u as l,d as F,F as V,e as U,m as L,w as b,f as u,g as G,v as J,s as a,h as W,i as D,j as P,k as p,p as Y,l as Q,n as _,R as X,q as Z,x as ee,y as te,z as ne}from"./addon-DThd9oFr.js";const re={class:"sve-html-tree"},se={class:"sve-pane-bar","data-sve-pane-bar":""},oe={"data-sve-right-title":""},ie={class:"sve-pane-hint"},le={__name:"HtmlTreePane",props:{title:{type:String,default:""},hint:{type:String,required:!0}},setup(e){return(t,o)=>(c(),h("div",re,[f("div",se,[f("div",oe,g(e.title),1),o[0]||(o[0]=O('<div data-sve-right-actions data-v-d8a25374><button type="button" data-sve-right-pin aria-pressed="false" data-v-d8a25374></button><button type="button" data-sve-close aria-label="Close" data-v-d8a25374><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-d8a25374><path d="M18 6 6 18" data-v-d8a25374></path><path d="m6 6 12 12" data-v-d8a25374></path></svg></button></div>',1))]),f("div",ie,g(e.hint),1),o[1]||(o[1]=f("div",{"data-sve-html-tree-list":""},null,-1))]))}},N=B(le,[["__scopeId","data-v-d8a25374"]]),r=K({emptyText:"",rows:[],editingId:null,draft:"",renameTitle:"",onSelect:null,onTwist:null,onRename:null,onRenameCommit:null,onRenameCancel:null}),ae={class:"sve-ht-root"},de={key:0,class:"sve-ht-empty"},ce=["title","onClick","onKeydown"],he=["onClick"],ue={key:1,"data-sve-ht-twist-gap":""},me={key:2,"data-sve-ht-letter":""},ve=["innerHTML"],pe=["title","onDblclick"],fe={"data-sve-ht-tag":""},ge={key:1,"data-sve-ht-name":""},xe='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',ye={__name:"HtmlTreeList",setup(e){function t(o){return o.name?`${o.tag} ${o.name}`:o.tag}return(o,n)=>(c(),h("div",ae,[l(r).rows.length?F("",!0):(c(),h("div",de,g(l(r).emptyText),1)),(c(!0),h(V,null,U(l(r).rows,s=>(c(),h("div",L({key:s.id,"data-sve-ht-row":""},{ref_for:!0},s.current?{"data-sve-ht-current":""}:{},{role:"button",tabindex:"0",title:t(s),style:{marginLeft:s.depth*12+"px"},onClick:i=>l(r).onSelect?.(s.id),onKeydown:[b(u(i=>l(r).onSelect?.(s.id),["prevent"]),["enter"]),b(u(i=>l(r).onSelect?.(s.id),["prevent"]),["space"])]}),[s.hasChildren?(c(),h("button",L({key:0,type:"button","data-sve-ht-twist":""},{ref_for:!0},s.shut?{"data-sve-ht-shut":""}:{},{innerHTML:xe,onClick:u(i=>l(r).onTwist?.(s.id),["stop","prevent"])}),null,16,he)):(c(),h("span",ue)),s.letter?(c(),h("span",me,g(s.letter),1)):(c(),h("span",{key:3,"data-sve-ht-icon":"",innerHTML:s.svg},null,8,ve)),f("span",{"data-sve-ht-text":"",title:l(r).renameTitle,onDblclick:u(i=>l(r).onRename?.(s.id),["stop","prevent"])},[f("span",fe,g(s.tag),1),l(r).editingId===s.id?G((c(),h("input",{key:0,"data-sve-ht-rename":"","onUpdate:modelValue":n[0]||(n[0]=i=>l(r).draft=i),onMousedown:n[1]||(n[1]=u(()=>{},["stop"])),onClick:n[2]||(n[2]=u(()=>{},["stop"])),onDblclick:n[3]||(n[3]=u(()=>{},["stop"])),onKeydown:[n[4]||(n[4]=u(()=>{},["stop"])),n[5]||(n[5]=b(u(i=>l(r).onRenameCommit?.(),["prevent"]),["enter"])),n[6]||(n[6]=b(u(i=>l(r).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:n[7]||(n[7]=i=>l(r).onRenameCommit?.())},null,544)),[[J,l(r).draft]]):(c(),h("span",ge,g(s.name),1))],40,pe)],16,ce))),128))]))}},Te=B(ye,[["__scopeId","data-v-c018cf5d"]]),j="sve-html-tree-labels";function z(){try{const e=globalThis.localStorage?.getItem(j);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function ke(e){try{globalThis.localStorage?.setItem(j,JSON.stringify(e))}catch{}}function q(e){return String(e||"_")}function _e(e){const t=z()[q(e)];return t&&typeof t=="object"?{...t}:{}}function be(e,t,o){const n=o?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function we(e,t,o,n){if(!t)return;const s=q(e),i=z(),m={...i[s]||{}},k=String(o||"").replace(/\s+/g," ").trim(),E=String(n||"").trim();!k||k===E?delete m[t]:m[t]=k,Object.keys(m).length?i[s]=m:delete i[s],ke(i)}const v={div:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="3.5" width="11" height="9" rx="1.2"/></svg>',section:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2.5" width="12" height="11" rx="1.2"/><path d="M2 6.5h12"/></svg>',ul:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="4" r="1"/><circle cx="3.2" cy="8" r="1"/><circle cx="3.2" cy="12" r="1"/><rect x="5.5" y="3.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="7.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="11.2" width="8" height="1.5" rx=".4"/></svg>',li:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="8" r="1.1"/><rect x="5.5" y="7.2" width="8" height="1.6" rx=".4"/></svg>',a:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M6.2 8.8 4.8 10.2a2.2 2.2 0 0 0 3.1 3.1l1.8-1.8"/><path d="M9.8 7.2l1.4-1.4a2.2 2.2 0 0 0-3.1-3.1L6.3 4.5"/></svg>',img:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="3" width="12" height="10" rx="1.2"/><circle cx="5.5" cy="6.2" r="1.1"/><path d="M2.8 12.2 6.2 9l2.2 2.2 2-1.8 2.8 2.8"/></svg>',other:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M5.2 3.5 2.8 8l2.4 4.5"/><path d="M10.8 3.5 13.2 8l-2.4 4.5"/></svg>'};function He(e){return/^h[1-6]$/.test(e)?{letter:"H"}:e==="p"?{letter:"P"}:e==="div"?{svg:v.div}:e==="section"||e==="article"||e==="header"||e==="footer"||e==="main"||e==="nav"||e==="aside"?{svg:v.section}:e==="ul"||e==="ol"?{svg:v.ul}:e==="li"?{svg:v.li}:e==="a"?{svg:v.a}:e==="img"||e==="picture"||e==="svg"?{svg:v.img}:{svg:v.other}}const x="__sve-html-tree-panel",M="__sve-html-tree-style",w=new Set;let I=null,H=null,S=0;function y(e){return e.getElementById(x)}function Se(e){let t=e.getElementById(M);t||(t=e.createElement("style"),t.id=M,e.head.appendChild(t)),t.textContent=`
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
      cursor: pointer;
      user-select: none;
    }
    [data-sve-ht-row]:hover { background: rgba(128,128,128,.26); }
    [data-sve-ht-row]:focus-visible { outline: 2px solid #3858e9; outline-offset: -2px; }
    [data-sve-ht-row][data-sve-ht-current] { background: #3858e9; color: #fff; }
    [data-sve-ht-row][data-sve-ht-current]:hover { background: #4a68ee; }
    [data-sve-ht-twist],
    [data-sve-ht-twist-gap] {
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
      opacity: .72;
    }
    [data-sve-ht-row][data-sve-ht-current] [data-sve-ht-tag] { opacity: .88; }
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
    #${x} .sve-pane-hint {
      font-size: 12px !important;
      line-height: 1.35;
      opacity: .55;
    }
  `}function Ce(){const e=_("dock:html");return typeof e=="string"?e:""}function Ie(e){return!!_("dock:is-open",e)}function T(e){const t=e.document,n=y(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;Se(t);const s=Ce(),i=Y(s),m=Q(i,w),k=_("dock:current-type")||"",E=_e(k);!s.trim()&&!Ie(t)?r.emptyText=p(e,"html_tree_need_dock"):r.emptyText=p(e,"html_tree_empty"),r.renameTitle=p(e,"html_tree_rename"),r.onSelect=d=>Pe(e,d,m),r.onTwist=d=>{w.has(d)?w.delete(d):w.add(d),T(e)},r.onRename=d=>Ee(e,d),r.onRenameCommit=()=>$(e,!0),r.onRenameCancel=()=>$(e,!1),r.rows=m.map(d=>{const R=He(d.tag);return{...d,name:be(d.klass,d.path,E),current:d.id===I,letter:R.letter||"",svg:R.svg||""}}),P(n,Te)}function Ee(e,t){const o=r.rows.find(n=>n.id===t);o&&(I=t,r.rows.forEach(n=>{n.current=n.id===t}),r.editingId=t,r.draft=o.name,e.setTimeout(()=>{const n=y(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function $(e,t){const o=r.editingId;if(!o)return;const n=r.rows.find(s=>s.id===o);r.editingId=null,t&&n&&we(_("dock:current-type")||"",n.path,r.draft,n.klass),r.draft="",T(e)}function Pe(e,t,o){const n=(o||r.rows).find(s=>s.id===t);n&&(I=t,r.rows.forEach(s=>{s.current=s.id===t}),_("dock:reveal-html",{from:n.from,to:n.to}))}function A(e){if(H)return;H=ee("dock:html-changed",()=>{r.editingId||(e.clearTimeout(S),S=e.setTimeout(()=>{y(e.document)&&T(e)},80))})}function Re(e){H?.(),H=null,e?.clearTimeout?.(S),S=0}function C(e){const t=y(e.document);if(Re(e),I=null,r.editingId=null,r.draft="",!t){a.syncPreviewInset(e);return}t.remove(),te.headerTab==="html_tree"&&ne(e,null),W(e),a.persistDockedPanel(e),D(e),a.syncPreviewInset(e)}function Le(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=x,P(t,N,{title:p(e,"html_tree"),hint:p(e,"html_tree_hint")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>C(e)))}function Me(e){A(e),T(e)}function $e(e){const t=e.document;if(!a.featureOn(e,"html_tree"))return;if(y(t)){C(e);return}a.closeRightPanels(e,[x]);const o=t.createElement("div");o.id=x,o.style.cssText=X,P(o,N,{title:p(e,"html_tree"),hint:p(e,"html_tree_hint")}),o.querySelector("[data-sve-close]")?.addEventListener("click",()=>C(e)),Z(e,o),a.persistDockedPanel(e),D(e),a.syncPreviewInset(e),A(e),T(e)}a.HTML_TREE_PANEL_ID=x;a.htmlTreePanel=y;a.closeHtmlTreePanel=C;a.fillHtmlTreePane=Le;a.showHtmlTreePane=Me;a.toggleHtmlTreePanel=$e;a.renderHtmlTree=T;export{x as HTML_TREE_PANEL_ID,M as HTML_TREE_STYLE_ID,C as closeHtmlTreePanel,Se as ensureHtmlTreeStyles,Le as fillHtmlTreePane,I as htmlTreeActiveId,w as htmlTreeCollapsed,y as htmlTreePanel,S as htmlTreeTimer,H as htmlTreeUnhook,T as renderHtmlTree,Me as showHtmlTreePane,Re as stopWatchHtmlTreeDock,$e as toggleHtmlTreePanel,A as watchHtmlTreeDock};
