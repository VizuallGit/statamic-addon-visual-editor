import{_ as K,o as v,c as m,a as k,t as b,b as ne,r as re,u as c,d as $,F as oe,e as ie,m as F,w as u,f as E,g as se,v as ae,i as V,s as h,h as le,j as Y,k as A,l as y,p as de,n as ce,q as g,R as ue,x as he,y as fe,z as pe,A as ve}from"./addon-Cl1tIrHy.js";const me={class:"sve-html-tree"},ge={class:"sve-pane-bar","data-sve-pane-bar":""},xe={"data-sve-right-title":""},ye={class:"sve-pane-hint"},Te={__name:"HtmlTreePane",props:{title:{type:String,default:""},hint:{type:String,required:!0}},setup(e){return(t,r)=>(v(),m("div",me,[k("div",ge,[k("div",xe,b(e.title),1),r[0]||(r[0]=ne('<div data-sve-right-actions data-v-d8a25374><button type="button" data-sve-right-pin aria-pressed="false" data-v-d8a25374></button><button type="button" data-sve-close aria-label="Close" data-v-d8a25374><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-d8a25374><path d="M18 6 6 18" data-v-d8a25374></path><path d="m6 6 12 12" data-v-d8a25374></path></svg></button></div>',1))]),k("div",ye,b(e.hint),1),r[1]||(r[1]=k("div",{"data-sve-html-tree-list":""},null,-1))]))}},U=K(Te,[["__scopeId","data-v-d8a25374"]]),n=re({emptyText:"",rows:[],editingId:null,draft:"",renameTitle:"",hideTitle:"",showTitle:"",canEdit:!1,dropId:null,dropPlace:null,onSelect:null,onTwist:null,onRename:null,onRenameCommit:null,onRenameCancel:null,onHide:null,onDragStart:null,onDragOver:null,onDragLeave:null,onDrop:null,onDragEnd:null}),ke={class:"sve-ht-root"},be={key:0,class:"sve-ht-empty"},we=["draggable","title","onClick","onKeydown","onDragstart","onDragover","onDragleave","onDrop"],_e=["onClick"],He={key:1,"data-sve-ht-letter":""},De=["innerHTML"],Ie=["title","onDblclick"],Ee={"data-sve-ht-tag":""},Ce={key:1,"data-sve-ht-name":""},Se=["title","innerHTML","onClick"],Pe='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',Me='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Re='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',Le={__name:"HtmlTreeList",setup(e){function t(a){return a.name?`${a.tag} ${a.name}`:a.tag}function r(a){const i={};return a.current&&(i["data-sve-ht-current"]=""),a.hidden&&(i["data-sve-ht-hidden"]=""),n.dropId===a.id&&n.dropPlace&&(i["data-sve-ht-drop"]=n.dropPlace),i}function o(a){return!a.hidden||a.wrapFrom!=null}return(a,i)=>(v(),m("div",ke,[c(n).rows.length?$("",!0):(v(),m("div",be,b(c(n).emptyText),1)),(v(!0),m(oe,null,ie(c(n).rows,s=>(v(),m("div",F({key:s.id,"data-sve-ht-row":""},{ref_for:!0},r(s),{role:"button",tabindex:"0",draggable:c(n).canEdit&&c(n).editingId!==s.id,title:t(s),style:{marginLeft:s.depth*12+"px"},onClick:l=>c(n).onSelect?.(s.id),onKeydown:[E(u(l=>c(n).onSelect?.(s.id),["prevent"]),["enter"]),E(u(l=>c(n).onSelect?.(s.id),["prevent"]),["space"])],onDragstart:l=>c(n).onDragStart?.(l,s.id),onDragover:u(l=>c(n).onDragOver?.(l,s.id),["prevent"]),onDragleave:l=>c(n).onDragLeave?.(s.id),onDrop:u(l=>c(n).onDrop?.(l,s.id),["prevent"]),onDragend:i[10]||(i[10]=l=>c(n).onDragEnd?.())}),[s.hasChildren?(v(),m("button",F({key:0,type:"button","data-sve-ht-twist":""},{ref_for:!0},s.shut?{"data-sve-ht-shut":""}:{},{innerHTML:Pe,onClick:u(l=>c(n).onTwist?.(s.id),["stop","prevent"]),onMousedown:i[0]||(i[0]=u(()=>{},["stop"]))}),null,16,_e)):$("",!0),s.letter?(v(),m("span",He,b(s.letter),1)):(v(),m("span",{key:2,"data-sve-ht-icon":"",innerHTML:s.svg},null,8,De)),k("span",{"data-sve-ht-text":"",title:c(n).renameTitle,onDblclick:u(l=>c(n).onRename?.(s.id),["stop","prevent"])},[k("span",Ee,b(s.tag),1),c(n).editingId===s.id?se((v(),m("input",{key:0,"data-sve-ht-rename":"","onUpdate:modelValue":i[1]||(i[1]=l=>c(n).draft=l),onMousedown:i[2]||(i[2]=u(()=>{},["stop"])),onClick:i[3]||(i[3]=u(()=>{},["stop"])),onDblclick:i[4]||(i[4]=u(()=>{},["stop"])),onKeydown:[i[5]||(i[5]=u(()=>{},["stop"])),i[6]||(i[6]=E(u(l=>c(n).onRenameCommit?.(),["prevent"]),["enter"])),i[7]||(i[7]=E(u(l=>c(n).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:i[8]||(i[8]=l=>c(n).onRenameCommit?.())},null,544)),[[ae,c(n).draft]]):(v(),m("span",Ce,b(s.name),1))],40,Ie),c(n).canEdit&&o(s)?(v(),m("button",{key:3,type:"button","data-sve-ht-eye":"",title:s.hidden?c(n).showTitle:c(n).hideTitle,innerHTML:s.hidden?Re:Me,onClick:u(l=>c(n).onHide?.(s.id),["stop","prevent"]),onMousedown:i[9]||(i[9]=u(()=>{},["stop"]))},null,40,Se)):$("",!0)],16,we))),128))]))}},$e=K(Le,[["__scopeId","data-v-1d557e57"]]);function O(e,t){for(const r of e||[]){if(r.id===t)return r;const o=O(r.children,t);if(o)return o}return null}function W(e,t){return(e.children||[]).some(r=>r.id===t||W(r,t))}function B(e,t){let r=t.wrapFrom??t.from,o=t.wrapTo??t.to;return r>0&&e[r-1]===`
`&&(r-=1),{from:r,to:o}}function Be(e,t){const r=e.slice(t.from,t.to),o=`</${t.tag}`,a=r.toLowerCase().lastIndexOf(o);return a===-1?t.to:t.from+a}function j(e,t,r){return e>=t+r?e-r:e>t?t:e}function je(e,t,r,o,a){const i=O(t,r),s=O(t,o);if(!e||!i||!s||r===o||W(i,o))return e;let l=a;l==="inside"&&(V(s.tag)||s.wrapFrom!=null)&&(l="after");const f=B(e,i),d=e.slice(f.from,f.to);if(!d)return e;const p=e.slice(0,f.from)+e.slice(f.to),L=f.to-f.from;let x;l==="before"?x=j(B(e,s).from,f.from,L):l==="inside"?x=j(Be(e,s),f.from,L):x=j(B(e,s).to,f.from,L),x=Math.max(0,Math.min(x,p.length));let I=d;return x>0&&p[x-1]!==`
`&&I[0]!==`
`&&(I=`
${I}`),p.slice(0,x)+I+p.slice(x)}function Oe(e,t){if(!e||!t)return e;if(t.wrapFrom!=null&&t.wrapTo!=null){const r=e.slice(t.wrapFrom+4,t.wrapTo-3);return e.slice(0,t.wrapFrom)+r+e.slice(t.wrapTo)}return t.hidden?e:`${e.slice(0,t.from)}<!--${e.slice(t.from,t.to)}-->${e.slice(t.to)}`}function Ae(e,t,r){const o=e/Math.max(t,1);return r&&o>.32&&o<.68?"inside":o<.5?"before":"after"}const G="sve-html-tree-labels";function J(){try{const e=globalThis.localStorage?.getItem(G);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function Ne(e){try{globalThis.localStorage?.setItem(G,JSON.stringify(e))}catch{}}function Z(e){return String(e||"_")}function Fe(e){const t=J()[Z(e)];return t&&typeof t=="object"?{...t}:{}}function ze(e,t,r){const o=r?.[t];return typeof o=="string"&&o.trim()?o.replace(/\s+/g," ").trim():String(e||"").trim()}function qe(e,t,r,o){if(!t)return;const a=Z(e),i=J(),s={...i[a]||{}},l=String(r||"").replace(/\s+/g," ").trim(),f=String(o||"").trim();!l||l===f?delete s[t]:s[t]=l,Object.keys(s).length?i[a]=s:delete i[a],Ne(i)}const T={div:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="3.5" width="11" height="9" rx="1.2"/></svg>',section:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2.5" width="12" height="11" rx="1.2"/><path d="M2 6.5h12"/></svg>',ul:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="4" r="1"/><circle cx="3.2" cy="8" r="1"/><circle cx="3.2" cy="12" r="1"/><rect x="5.5" y="3.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="7.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="11.2" width="8" height="1.5" rx=".4"/></svg>',li:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="8" r="1.1"/><rect x="5.5" y="7.2" width="8" height="1.6" rx=".4"/></svg>',a:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M6.2 8.8 4.8 10.2a2.2 2.2 0 0 0 3.1 3.1l1.8-1.8"/><path d="M9.8 7.2l1.4-1.4a2.2 2.2 0 0 0-3.1-3.1L6.3 4.5"/></svg>',img:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="3" width="12" height="10" rx="1.2"/><circle cx="5.5" cy="6.2" r="1.1"/><path d="M2.8 12.2 6.2 9l2.2 2.2 2-1.8 2.8 2.8"/></svg>',other:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M5.2 3.5 2.8 8l2.4 4.5"/><path d="M10.8 3.5 13.2 8l-2.4 4.5"/></svg>'};function Ke(e){return/^h[1-6]$/.test(e)?{letter:"H"}:e==="p"?{letter:"P"}:e==="div"?{svg:T.div}:e==="section"||e==="article"||e==="header"||e==="footer"||e==="main"||e==="nav"||e==="aside"?{svg:T.section}:e==="ul"||e==="ol"?{svg:T.ul}:e==="li"?{svg:T.li}:e==="a"?{svg:T.a}:e==="img"||e==="picture"||e==="svg"?{svg:T.img}:{svg:T.other}}const _="__sve-html-tree-panel",z="__sve-html-tree-style",C=new Set;let R=null,S=null,P=0,Q=[],w=null;function H(e){return e.getElementById(_)}function Ve(e){let t=e.getElementById(z);t||(t=e.createElement("style"),t.id=z,e.head.appendChild(t)),t.textContent=`
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
    [data-sve-ht-eye] {
      all: unset;
      box-sizing: border-box;
      margin-left: auto;
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
    [data-sve-ht-row]:hover [data-sve-ht-eye],
    [data-sve-ht-row][data-sve-ht-hidden] [data-sve-ht-eye] {
      display: inline-flex;
    }
    [data-sve-ht-eye]:hover { opacity: 1; background: rgba(255,255,255,.12); }
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
  `}function N(){const e=g("dock:html");return typeof e=="string"?e:""}function Ye(e){return!!g("dock:is-open",e)}function X(e){return g("dock:set-html",e)===!0}function D(e){const t=e.document,o=H(t)?.querySelector("[data-sve-html-tree-list]");if(!o)return;Ve(t);const a=N(),i=de(a);Q=i;const s=ce(i,C),l=g("dock:current-type")||"",f=Fe(l);!a.trim()&&!Ye(t)?n.emptyText=y(e,"html_tree_need_dock"):n.emptyText=y(e,"html_tree_empty"),n.renameTitle=y(e,"html_tree_rename"),n.hideTitle=y(e,"html_tree_hide"),n.showTitle=y(e,"html_tree_show"),n.canEdit=!g("dock:is-locked"),n.onSelect=d=>Qe(e,d,s),n.onTwist=d=>{C.has(d)?C.delete(d):C.add(d),D(e)},n.onRename=d=>Ue(e,d),n.onRenameCommit=()=>q(e,!0),n.onRenameCancel=()=>q(e,!1),n.onHide=d=>We(e,d),n.onDragStart=(d,p)=>Ge(d,p),n.onDragOver=(d,p)=>Je(d,p),n.onDragLeave=d=>{n.dropId===d&&(n.dropId=null,n.dropPlace=null)},n.onDrop=(d,p)=>Ze(e,d,p),n.onDragEnd=()=>ee(),n.rows=s.map(d=>{const p=Ke(d.tag);return{...d,name:ze(d.klass,d.path,f),current:d.id===R,letter:p.letter||"",svg:p.svg||""}}),A(o,$e)}function Ue(e,t){const r=n.rows.find(o=>o.id===t);r&&(R=t,n.rows.forEach(o=>{o.current=o.id===t}),n.editingId=t,n.draft=r.name,e.setTimeout(()=>{const o=H(e.document)?.querySelector("[data-sve-ht-rename]");o?.focus(),o?.select()},0))}function q(e,t){const r=n.editingId;if(!r)return;const o=n.rows.find(a=>a.id===r);n.editingId=null,t&&o&&qe(g("dock:current-type")||"",o.path,n.draft,o.klass),n.draft="",D(e)}function We(e,t){if(g("dock:is-locked"))return;const r=N(),o=n.rows.find(i=>i.id===t);if(!o)return;const a=Oe(r,o);a!==r&&X(a)}function Ge(e,t){if(g("dock:is-locked")||n.editingId){e.preventDefault();return}w=t,e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t)}function Je(e,t){if(!w||w===t)return;const r=n.rows.find(l=>l.id===t),o=n.rows.find(l=>l.id===w);if(!r||o&&r.path.startsWith(`${o.path}/`)){n.dropId=null,n.dropPlace=null;return}const a=e.currentTarget?.getBoundingClientRect?.(),i=a?e.clientY-a.top:0,s=!V(r.tag);n.dropId=t,n.dropPlace=Ae(i,a?.height||26,s)}function Ze(e,t,r){const o=w||t.dataTransfer?.getData("text/plain"),a=n.dropPlace||"after";if(ee(),g("dock:is-locked")||!o||o===r)return;const i=N(),s=je(i,Q,o,r,a);s!==i&&X(s)}function ee(){w=null,n.dropId=null,n.dropPlace=null}function Qe(e,t,r){const o=(r||n.rows).find(a=>a.id===t);o&&(R=t,n.rows.forEach(a=>{a.current=a.id===t}),g("dock:reveal-html",{from:o.from,to:o.to}))}function te(e){if(S)return;S=fe("dock:html-changed",()=>{n.editingId||(e.clearTimeout(P),P=e.setTimeout(()=>{H(e.document)&&D(e)},80))})}function Xe(e){S?.(),S=null,e?.clearTimeout?.(P),P=0}function M(e){const t=H(e.document);if(Xe(e),R=null,n.editingId=null,n.draft="",!t){h.syncPreviewInset(e);return}t.remove(),pe.headerTab==="html_tree"&&ve(e,null),le(e),h.persistDockedPanel(e),Y(e),h.syncPreviewInset(e)}function et(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=_,A(t,U,{title:y(e,"html_tree"),hint:y(e,"html_tree_hint")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>M(e)))}function tt(e){te(e),D(e)}function nt(e){const t=e.document;if(!h.featureOn(e,"html_tree"))return;if(H(t)){M(e);return}h.closeRightPanels(e,[_]);const r=t.createElement("div");r.id=_,r.style.cssText=ue,A(r,U,{title:y(e,"html_tree"),hint:y(e,"html_tree_hint")}),r.querySelector("[data-sve-close]")?.addEventListener("click",()=>M(e)),he(e,r),h.persistDockedPanel(e),Y(e),h.syncPreviewInset(e),te(e),D(e)}h.HTML_TREE_PANEL_ID=_;h.htmlTreePanel=H;h.closeHtmlTreePanel=M;h.fillHtmlTreePane=et;h.showHtmlTreePane=tt;h.toggleHtmlTreePanel=nt;h.renderHtmlTree=D;export{_ as HTML_TREE_PANEL_ID,z as HTML_TREE_STYLE_ID,M as closeHtmlTreePanel,Ve as ensureHtmlTreeStyles,et as fillHtmlTreePane,R as htmlTreeActiveId,C as htmlTreeCollapsed,H as htmlTreePanel,P as htmlTreeTimer,S as htmlTreeUnhook,D as renderHtmlTree,tt as showHtmlTreePane,Xe as stopWatchHtmlTreeDock,nt as toggleHtmlTreePanel,te as watchHtmlTreeDock};
