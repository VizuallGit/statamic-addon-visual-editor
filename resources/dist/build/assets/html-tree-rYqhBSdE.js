import{_ as I,o as a,c,a as v,t as p,b as D,r as N,u as d,d as j,F as q,e as z,m as S,w as C,f as k,s as o,g as A,h as M,i as b,j as u,p as F,k as K,R as O,l as V,n as U,q as w,v as W,x as G}from"./addon-ByNW6sCF.js";const Y={class:"sve-html-tree"},J={class:"sve-pane-bar","data-sve-pane-bar":""},Q={"data-sve-right-title":""},X={class:"sve-pane-hint"},Z={__name:"HtmlTreePane",props:{title:{type:String,default:""},hint:{type:String,required:!0}},setup(e){return(t,s)=>(a(),c("div",Y,[v("div",J,[v("div",Q,p(e.title),1),s[0]||(s[0]=D('<div data-sve-right-actions data-v-2c3c95d9><button type="button" data-sve-right-pin aria-pressed="false" data-v-2c3c95d9></button><button type="button" data-sve-close aria-label="Close" data-v-2c3c95d9><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-2c3c95d9><path d="M18 6 6 18" data-v-2c3c95d9></path><path d="m6 6 12 12" data-v-2c3c95d9></path></svg></button></div>',1))]),v("div",X,p(e.hint),1),s[1]||(s[1]=v("div",{"data-sve-html-tree-list":""},null,-1))]))}},B=I(Z,[["__scopeId","data-v-2c3c95d9"]]),n=N({emptyText:"",rows:[],onSelect:null,onTwist:null}),ee={class:"sve-ht-root"},te={key:0,class:"sve-ht-empty"},re=["title","onClick","onKeydown"],se=["onClick"],ne={key:1,"data-sve-ht-twist-gap":""},oe={key:2,"data-sve-ht-letter":""},le=["innerHTML"],ie={"data-sve-ht-text":""},ae='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',ce={__name:"HtmlTreeList",setup(e){return(t,s)=>(a(),c("div",ee,[d(n).rows.length?j("",!0):(a(),c("div",te,p(d(n).emptyText),1)),(a(!0),c(q,null,z(d(n).rows,r=>(a(),c("div",S({key:r.id,"data-sve-ht-row":""},{ref_for:!0},r.current?{"data-sve-ht-current":""}:{},{role:"button",tabindex:"0",title:r.label,style:{marginLeft:r.depth*12+"px"},onClick:l=>d(n).onSelect?.(r.id),onKeydown:[C(k(l=>d(n).onSelect?.(r.id),["prevent"]),["enter"]),C(k(l=>d(n).onSelect?.(r.id),["prevent"]),["space"])]}),[r.hasChildren?(a(),c("button",S({key:0,type:"button","data-sve-ht-twist":""},{ref_for:!0},r.shut?{"data-sve-ht-shut":""}:{},{innerHTML:ae,onClick:k(l=>d(n).onTwist?.(r.id),["stop","prevent"])}),null,16,se)):(a(),c("span",ne)),r.letter?(a(),c("span",oe,p(r.letter),1)):(a(),c("span",{key:3,"data-sve-ht-icon":"",innerHTML:r.svg},null,8,le)),v("span",ie,p(r.label),1)],16,re))),128))]))}},de=I(ce,[["__scopeId","data-v-dcd2d968"]]),h={div:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="3.5" width="11" height="9" rx="1.2"/></svg>',section:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2.5" width="12" height="11" rx="1.2"/><path d="M2 6.5h12"/></svg>',ul:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="4" r="1"/><circle cx="3.2" cy="8" r="1"/><circle cx="3.2" cy="12" r="1"/><rect x="5.5" y="3.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="7.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="11.2" width="8" height="1.5" rx=".4"/></svg>',li:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="8" r="1.1"/><rect x="5.5" y="7.2" width="8" height="1.6" rx=".4"/></svg>',a:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M6.2 8.8 4.8 10.2a2.2 2.2 0 0 0 3.1 3.1l1.8-1.8"/><path d="M9.8 7.2l1.4-1.4a2.2 2.2 0 0 0-3.1-3.1L6.3 4.5"/></svg>',img:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="3" width="12" height="10" rx="1.2"/><circle cx="5.5" cy="6.2" r="1.1"/><path d="M2.8 12.2 6.2 9l2.2 2.2 2-1.8 2.8 2.8"/></svg>',other:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M5.2 3.5 2.8 8l2.4 4.5"/><path d="M10.8 3.5 13.2 8l-2.4 4.5"/></svg>'};function he(e){return/^h[1-6]$/.test(e)?{letter:"H"}:e==="p"?{letter:"P"}:e==="div"?{svg:h.div}:e==="section"||e==="article"||e==="header"||e==="footer"||e==="main"||e==="nav"||e==="aside"?{svg:h.section}:e==="ul"||e==="ol"?{svg:h.ul}:e==="li"?{svg:h.li}:e==="a"?{svg:h.a}:e==="img"||e==="picture"||e==="svg"?{svg:h.img}:{svg:h.other}}const m="__sve-html-tree-panel",L="__sve-html-tree-style",x=new Set;let H=null,_=null,y=0;function f(e){return e.getElementById(m)}function ue(e){let t=e.getElementById(L);t||(t=e.createElement("style"),t.id=L,e.head.appendChild(t)),t.textContent=`
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
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
    }
  `}function ve(){const e=w("dock:html");return typeof e=="string"?e:""}function pe(e){return!!w("dock:is-open",e)}function g(e){const t=e.document,r=f(t)?.querySelector("[data-sve-html-tree-list]");if(!r)return;ue(t);const l=ve(),$=F(l),P=K($,x);!l.trim()&&!pe(t)?n.emptyText=u(e,"html_tree_need_dock"):n.emptyText=u(e,"html_tree_empty"),n.onSelect=i=>me(e,i,P),n.onTwist=i=>{x.has(i)?x.delete(i):x.add(i),g(e)},n.rows=P.map(i=>{const E=he(i.tag);return{...i,current:i.id===H,letter:E.letter||"",svg:E.svg||""}}),b(r,de)}function me(e,t,s){const r=(s||n.rows).find(l=>l.id===t);r&&(H=t,n.rows.forEach(l=>{l.current=l.id===t}),w("dock:reveal-html",{from:r.from,to:r.to}))}function R(e){if(_)return;_=U("dock:html-changed",()=>{e.clearTimeout(y),y=e.setTimeout(()=>{f(e.document)&&g(e)},80)})}function fe(e){_?.(),_=null,e?.clearTimeout?.(y),y=0}function T(e){const t=f(e.document);if(fe(e),H=null,!t){o.syncPreviewInset(e);return}t.remove(),W.headerTab==="html_tree"&&G(e,null),A(e),o.persistDockedPanel(e),M(e),o.syncPreviewInset(e)}function ge(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=m,b(t,B,{title:u(e,"html_tree"),hint:u(e,"html_tree_hint")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>T(e)))}function xe(e){R(e),g(e)}function _e(e){const t=e.document;if(!o.featureOn(e,"html_tree"))return;if(f(t)){T(e);return}o.closeRightPanels(e,[m]);const s=t.createElement("div");s.id=m,s.style.cssText=O,b(s,B,{title:u(e,"html_tree"),hint:u(e,"html_tree_hint")}),s.querySelector("[data-sve-close]")?.addEventListener("click",()=>T(e)),V(e,s),o.persistDockedPanel(e),M(e),o.syncPreviewInset(e),R(e),g(e)}o.HTML_TREE_PANEL_ID=m;o.htmlTreePanel=f;o.closeHtmlTreePanel=T;o.fillHtmlTreePane=ge;o.showHtmlTreePane=xe;o.toggleHtmlTreePanel=_e;o.renderHtmlTree=g;export{m as HTML_TREE_PANEL_ID,L as HTML_TREE_STYLE_ID,T as closeHtmlTreePanel,ue as ensureHtmlTreeStyles,ge as fillHtmlTreePane,H as htmlTreeActiveId,x as htmlTreeCollapsed,f as htmlTreePanel,y as htmlTreeTimer,_ as htmlTreeUnhook,g as renderHtmlTree,xe as showHtmlTreePane,fe as stopWatchHtmlTreeDock,_e as toggleHtmlTreePanel,R as watchHtmlTreeDock};
