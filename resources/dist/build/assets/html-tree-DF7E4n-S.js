const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-D8Xdoe3O.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{_ as J,k as R,aj as ln,a_ as o,u as d,o as v,a as m,b as _,t as w,F as M,d as q,f as _t,g as $,e as Tt,s as b,q as N,h as f,x as cn,a$ as ge,b0 as dn,l as xt,b1 as un,n as hn,b2 as pn,y as T,j as Q,Q as fn,J as ye,b3 as ot,b4 as Fe,a1 as Ee,M as vn,K as Ue,b5 as St,b6 as mn,b7 as gn,B as re,w as Oe,v as wt,p as Ct,b8 as yn,i as $t,b9 as st,ba as kn,bb as bn,bc as Pt,z as ee,c as ae,N as _n,G as Tn,aD as Xe,ak as Be,aP as xn,ag as Sn,aN as Et,aO as Lt,ab as wn,S as ke,U as be,O as Cn,aM as $n,ah as Pn,ai as En,bd as at,A as It,ar as Ht,as as je,I as Ln,be as In,aR as Hn,aS as Mn,aq as An,bf as Rn,aa as Mt,aJ as Dn,az as Fn}from"./addon-CKHhAlpX.js";import{M as te,S as ne}from"./protocol-D3FYhCm9.js";import{C as O,D as On,E as Ye,F as Bn,t as jn,G as Ze,u as qn,y as Kn,b as Ge,k as Vn,I as At,o as Nn,J as Rt,K as Dt,L as zn,H as Wn,M as Je,N as Ft,O as Un,h as Xn,c as Yn,Q as Zn,R as Gn,S as Jn,U as Qn,V as eo,W as to,X as no,Y as oo,Z as so,_ as ao}from"./tw-classes-BmP0aMj5.js";import{a as ro}from"./html-pick-align-CK-9iH9_.js";import"./ai-text-icon-B7uCWIwa.js";const io={key:0,class:"sve-ht-inspect"},lo={class:"sve-ht-inspect__head"},co={key:0,class:"sve-ht-inspect__note"},uo={key:2,class:"sve-ht-inspect__props"},ho={class:"sve-ht-inspect__proplabel"},po={key:0},fo=["value","disabled","onChange"],vo={value:""},mo=["value"],go=["value"],yo=["value","placeholder","onChange"],ko=["title","disabled","onClick"],bo=["title","disabled","onClick"],_o={key:0,class:"sve-ht-inspect__seg"},To=["data-active","disabled","onClick"],xo=["value","disabled"],So={key:0,value:""},wo=["value"],Co={key:2,class:"sve-ht-inspect__box"},$o=["value","placeholder","disabled","onKeydown"],Po=["title","disabled"],Eo={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Lo=["value","disabled"],Io=["value"],Ho={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},Mo=["value","placeholder","disabled"],Ao=["title","disabled"],Ro={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Do=["value","placeholder","disabled"],Fo={key:4,class:"sve-ht-inspect__add"},Oo=["disabled","onClick"],Ie='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',Bo='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',jo={__name:"HtmlTreeInspector",setup(e){const t=R(null);ln(t,h=>o.onPropHost?.(h||null));const s=R(null),n=R(null);function a(h){o.onInspectCommit?.(h.target.value)}function i(h,l,c){!h||!l||(h.value=l,h.focus(),h.setSelectionRange(l.length,l.length),c(l))}function r(h,l){o.onInspectData?.(h.currentTarget,c=>o.onPropValue?.(l.handle,c,!0))}function u(h){o.onInspectData?.(h.currentTarget,l=>i(s.value,l,c=>o.onInspectCommit?.(c)))}function g(h){o.onInspectData?.(h.currentTarget,l=>i(n.value,l,c=>o.onLoopSortField?.(c)))}return(h,l)=>d(o).inspect?(v(),m("div",io,[_("div",lo,w(d(o).inspect.title),1),d(o).inspect.mode==="note"?(v(),m("div",co,w(d(o).inspect.note),1)):d(o).inspect.mode==="statamic"?(v(),m("div",{key:1,ref_key:"propHost",ref:t,class:"sve-ht-inspect__form"},null,512)):d(o).inspect.mode==="props"?(v(),m("div",uo,[(v(!0),m(M,null,q(d(o).inspect.rows,c=>(v(),m("label",{key:c.handle,class:"sve-ht-inspect__prop"},[_("span",ho,[_t(w(c.label)+" ",1),c.bound?(v(),m("em",po,":")):$("",!0)]),_("span",{class:Tt(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":c.type==="select"||c.type==="link"}])},[c.type==="select"&&!c.bound?(v(),m("select",{key:0,value:c.value,disabled:!d(o).canEdit,onChange:x=>d(o).onPropValue?.(c.handle,x.target.value,!1)},[_("option",vo,w(c.placeholder||d(o).inspect.inheritLabel),1),c.value&&!c.options.includes(c.value)?(v(),m("option",{key:0,value:c.value},w(c.value),9,mo)):$("",!0),(v(!0),m(M,null,q(c.options,x=>(v(),m("option",{key:x,value:x},w(x),9,go))),128))],40,fo)):(v(),m("input",{key:1,type:"text",value:c.value,placeholder:c.placeholder||d(o).inspect.inheritLabel,onChange:x=>d(o).onPropValue?.(c.handle,x.target.value,c.bound)},null,40,yo)),c.type==="link"?(v(),m("button",{key:2,type:"button","data-sve-ht-data":"",title:d(o).pageTitle,disabled:!d(o).canEdit,onClick:x=>d(o).onPropPage?.(x.currentTarget,c.handle),innerHTML:Bo},null,8,ko)):$("",!0),_("button",{type:"button","data-sve-ht-data":"",title:d(o).dataTitle,disabled:!d(o).canEdit,onClick:x=>r(x,c),innerHTML:Ie},null,8,bo)],2)]))),128))])):(v(),m(M,{key:3},[d(o).inspect.mode==="loop"?(v(),m("div",_o,[(v(!0),m(M,null,q(d(o).inspect.kinds,c=>(v(),m("button",{key:c.id,type:"button","data-active":c.id===d(o).inspect.loopKind?"":void 0,disabled:!d(o).canEdit,onClick:x=>d(o).onLoopKind?.(c.id)},w(c.label),9,To))),128))])):$("",!0),d(o).inspect.mode==="loop"&&d(o).inspect.loopKind==="collection"?(v(),m("select",{key:d(o).inspect.key+":"+d(o).inspect.value,value:d(o).inspect.value,disabled:!d(o).canEdit,onChange:a},[d(o).inspect.value?$("",!0):(v(),m("option",So,w(d(o).inspect.placeholder),1)),(v(!0),m(M,null,q(d(o).inspect.collections,c=>(v(),m("option",{key:c.handle,value:c.handle},w(c.title),9,wo))),128))],40,xo)):(v(),m("div",Co,[(v(),m("input",{ref_key:"field",ref:s,key:d(o).inspect.key,type:"text",value:d(o).inspect.value,placeholder:d(o).inspect.placeholder,disabled:!d(o).canEdit,spellcheck:"false",onKeydown:[l[0]||(l[0]=b(()=>{},["stop"])),N(b(a,["prevent"]),["enter"])],onBlur:a},null,40,$o)),_("button",{type:"button","data-sve-ht-data":"",title:d(o).dataTitle,disabled:!d(o).canEdit,innerHTML:Ie,onMousedown:l[1]||(l[1]=b(()=>{},["prevent"])),onClick:b(u,["stop","prevent"])},null,40,Po)])),d(o).inspect.sort?(v(),m(M,{key:3},[_("div",Eo,w(d(o).inspect.sort.title),1),(v(),m("select",{key:d(o).inspect.key+":dir:"+d(o).inspect.sort.dir,value:d(o).inspect.sort.dir,disabled:!d(o).canEdit,onChange:l[2]||(l[2]=c=>d(o).onLoopSortDir?.(c.target.value))},[(v(!0),m(M,null,q(d(o).inspect.sort.dirs,c=>(v(),m("option",{key:c.id,value:c.id},w(c.label),9,Io))),128))],40,Lo)),d(o).inspect.sort.needsField?(v(),m("div",Ho,[(v(),m("input",{ref_key:"sortField",ref:n,key:d(o).inspect.key+":field",type:"text",value:d(o).inspect.sort.field,placeholder:d(o).inspect.sort.placeholder,disabled:!d(o).canEdit,spellcheck:"false",onKeydown:[l[3]||(l[3]=b(()=>{},["stop"])),l[4]||(l[4]=N(b(c=>d(o).onLoopSortField?.(c.target.value),["prevent"]),["enter"]))],onBlur:l[5]||(l[5]=c=>d(o).onLoopSortField?.(c.target.value))},null,40,Mo)),d(o).inspect.sort.pickable?(v(),m("button",{key:0,type:"button","data-sve-ht-data":"",title:d(o).dataTitle,disabled:!d(o).canEdit,innerHTML:Ie,onMousedown:l[6]||(l[6]=b(()=>{},["prevent"])),onClick:b(g,["stop","prevent"])},null,40,Ao)):$("",!0)])):$("",!0),_("div",Ro,w(d(o).inspect.limit.title),1),(v(),m("input",{key:d(o).inspect.key+":limit",type:"number",min:"1",value:d(o).inspect.limit.value,placeholder:d(o).inspect.limit.placeholder,disabled:!d(o).canEdit,onKeydown:[l[7]||(l[7]=b(()=>{},["stop"])),l[8]||(l[8]=N(b(c=>d(o).onLoopLimit?.(c.target.value),["prevent"]),["enter"]))],onBlur:l[9]||(l[9]=c=>d(o).onLoopLimit?.(c.target.value))},null,40,Do))],64)):$("",!0),d(o).inspect.branches?.length?(v(),m("div",Fo,[(v(!0),m(M,null,q(d(o).inspect.branches,c=>(v(),m("button",{key:c.id,type:"button",disabled:!d(o).canEdit,onClick:x=>d(o).onAddBranch?.(c.id)},w(c.label),9,Oo))),128))])):$("",!0)],64))])):$("",!0)}},qo=J(jo,[["__scopeId","data-v-26254b75"]]),Ko={class:"sve-html-tree"},Vo={class:"sve-pane-bar","data-sve-pane-bar":""},No={"data-sve-right-title":""},zo=["title"],Wo=["placeholder","aria-label","value"],Uo=["aria-label"],Xo={key:1,class:"sve-tree-exit"},Yo=["title"],Zo=["title"],Go='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',Jo='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',Qo={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const t=f(window,"html_tree_search");function s(n){const a=!!o.query;o.query=n,a!==!!n&&o.onQuery?.()}return(n,a)=>(v(),m("div",Ko,[_("div",Vo,[_("div",No,w(e.title),1),a[5]||(a[5]=cn('<div data-sve-right-actions data-v-045fa1f5><button type="button" data-sve-right-pin aria-pressed="false" data-v-045fa1f5></button><button type="button" data-sve-close aria-label="Close" data-v-045fa1f5><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-045fa1f5><path d="M18 6 6 18" data-v-045fa1f5></path><path d="m6 6 12 12" data-v-045fa1f5></path></svg></button></div>',1))]),_("label",{class:"sve-ht-search",title:d(t)},[_("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:Go}),_("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:d(t),"aria-label":d(t),value:d(o).query,autocomplete:"off",spellcheck:"false",onInput:a[0]||(a[0]=i=>s(i.target.value)),onKeydown:[a[1]||(a[1]=b(()=>{},["stop"])),a[2]||(a[2]=N(b(i=>s(""),["prevent"]),["escape"]))]},null,40,Wo),d(o).query?(v(),m("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":d(t),innerHTML:Jo,onClick:a[3]||(a[3]=i=>s(""))},null,8,Uo)):$("",!0)],8,zo),d(O).inSidebar?$("",!0):(v(),ge(On,{key:0})),a[6]||(a[6]=_("div",{"data-sve-html-tree-list":""},null,-1)),dn(qo),d(o).exitOpen&&!d(O).inSidebar?(v(),m("div",Xo,[_("span",{class:"sve-tree-exit__name",title:d(o).exitName},w(d(o).exitName),9,Yo),_("button",{type:"button",class:"sve-tree-exit__go",title:d(o).exitTitle,onClick:a[4]||(a[4]=i=>d(o).onExit?.())},w(d(o).exitLabel),9,Zo)])):$("",!0)]))}},Ot=J(Qo,[["__scopeId","data-v-045fa1f5"]]);function Bt(e){return String(e||"").trim().toLowerCase()}function jt(e,t){return t?[e.name,e.tag,e.klass,e.label,e.src].filter(s=>typeof s=="string"&&s).join(" ").toLowerCase().includes(t):!0}function es(e,t){const s=Bt(t);if(!s)return{rows:e,hits:new Set};const n=new Set;for(const r of e)jt(r,s)&&n.add(r.path);const a=[...n];return{rows:e.filter(r=>n.has(r.path)||a.some(u=>u.startsWith(`${r.path}/`))),hits:n}}const ts={class:"sve-fs__bar"},ns={class:"sve-fs__title"},os={key:0,class:"sve-fs__sub"},ss=["aria-label","title"],as={class:"sve-fs__body"},rs={key:0,class:"sve-fs__loading"},is=["src","title"],rt="sve-fieldset-drawer-width",it=380,ls={__name:"FieldsetOverlay",props:{heading:{type:String,required:!0},subtitle:{type:String,default:""},src:{type:String,required:!0},closeLabel:{type:String,required:!0},onClose:{type:Function,required:!0},onSaved:{type:Function,default:null}},setup(e){const t=e,s=R(!0),n=R(null),a=R(!1);function i(){return Math.max(it,window.innerWidth-220)}function r(k){return Math.min(Math.max(Math.round(k),it),i())}function u(){try{const k=Number(window.localStorage.getItem(rt));if(k>0)return r(k)}catch{}return r(Math.min(992,window.innerWidth*.55))}const g=R(u()),h=R(!1);function l(k){g.value=r(window.innerWidth-k.clientX)}function c(k){h.value=!1,k.target?.releasePointerCapture?.(k.pointerId),window.removeEventListener("pointermove",l),window.removeEventListener("pointerup",c);try{window.localStorage.setItem(rt,String(g.value))}catch{}}function x(k){k.preventDefault(),h.value=!0,k.target?.setPointerCapture?.(k.pointerId),window.addEventListener("pointermove",l),window.addEventListener("pointerup",c)}function S(){s.value=!1;try{const k=n.value?.contentDocument;if(!k||k.getElementById("sve-fs-trim"))return;const p=k.createElement("style");p.id="sve-fs-trim",p.textContent=`
      nav.nav-main { display: none !important; }
      header:has(+ main) { display: none !important; }
      main { top: 0 !important; min-height: 100vh !important; }
      /* Our own AI launcher rides along on every Control Panel page. In a panel
         about fields it is one floating button too many, and it covers the
         Save. */
      #__sve-ai-launcher { display: none !important; }
    `,k.head.appendChild(p)}catch{}}function E(k){const p=String(k?.config?.method||"").toUpperCase(),y=String(k?.config?.url||""),C=Number(k?.status||0);return(p==="PATCH"||p==="PUT")&&C>=200&&C<300&&/\/fields\/fieldsets\//.test(y)&&!/\/edit(?:\?|$)/.test(y)}function L(k){const p=k?.Statamic?.$axios||k?.axios;return!p?.interceptors?.response||k.__sveFsSaveWatch?!!k?.__sveFsSaveWatch:(k.__sveFsSaveWatch=!0,p.interceptors.response.use(y=>(E(y)&&t.onSaved?.(),y)),!0)}function I(){S();const k=n.value?.contentWindow;L(k)||k?.setTimeout?.(()=>L(k),0)}function se(k){k.key==="Escape"&&t.onClose()}xt(()=>{document.addEventListener("keydown",se),requestAnimationFrame(()=>{a.value=!0})}),un(()=>document.removeEventListener("keydown",se));function ve(k){k.target===k.currentTarget&&t.onClose()}return(k,p)=>(v(),m("div",{class:"sve-fs-overlay",onClick:ve},[_("div",{class:Tt(["sve-fs",{"is-shown":a.value,"is-dragging":h.value}]),style:hn({width:g.value+"px","--sve-fs-grip":d(pn)}),onClick:p[1]||(p[1]=b(()=>{},["stop"]))},[_("div",{class:"sve-fs__grip",role:"separator","aria-orientation":"vertical",onPointerdown:x},null,32),_("div",ts,[_("div",ns,[_t(w(e.heading)+" ",1),e.subtitle?(v(),m("span",os,w(e.subtitle),1)):$("",!0)]),_("button",{type:"button","aria-label":e.closeLabel,title:e.closeLabel,onClick:p[0]||(p[0]=(...y)=>e.onClose&&e.onClose(...y))},[...p[2]||(p[2]=[_("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round"},[_("path",{d:"M18 6 6 18"}),_("path",{d:"m6 6 12 12"})],-1)])],8,ss)]),_("div",as,[s.value?(v(),m("div",rs,"…")):$("",!0),_("iframe",{ref_key:"frame",ref:n,src:e.src,title:e.heading,onLoad:I},null,40,is)])],6)]))}},cs=J(ls,[["__scopeId","data-v-9b80a022"]]),ds="/!/sve/section-types";function us(e){return String(e.Statamic?.$config?.get?.("cpRoot")||"/cp").replace(/\/+$/,"")}function hs(){const e=T("dock:current-type");return typeof e!="string"||!e||e.startsWith("view:")?null:e}async function ps(e,t){const s=await e.fetch(ds,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!s.ok)throw new Error(`section-types ${s.status}`);const a=((await s.json()).types||[]).find(i=>i?.handle===t);return a?{fieldset:a.fieldset||null,display:a.display||t}:null}function fs(e,t){const s=String(e);let n=s;try{n=decodeURIComponent(s)}catch{}return n===t||n.includes(`set=${t}`)||n.endsWith(`::${t}`)||n.includes(`::${t}::`)}function vs(e,t){if(e){if(typeof e.keys=="function"&&typeof e.delete=="function"){for(const s of[...e.keys()])fs(s,t)&&e.delete(s);return}e.delete?.(t)}}function ms(e,t){vs(gn,t),T("dock:reset-data-vars",t)}async function lt(e,t){if(await fn("sections"),!e.sve?.fetchSetMeta||!ye||!ot)return 0;ms(e,t);const n=await Fe(e,t);if(!n)return 0;const a=Ee(e),i=n.defaults&&typeof n.defaults=="object"?n.defaults:{};let r=0;for(const u of ye(e.document)){const g=vn(Ue(u.values),a);if(!Array.isArray(g))continue;let h=!1;const l=g.map(c=>{if(c?.type!==t)return c;const x={};for(const[S,E]of Object.entries(i))S in c||(x[S]=E);return Object.keys(x).length?(h=!0,{...c,...x}):c});h&&u.setFieldValue(a,l);for(const c of h?l:g)c?.type!==t||!c._id||(ot(u,a,c,St(c,n.new||{},n.defaults)),r++)}return Array.isArray(n.definitions)&&mn(t,n.definitions),r}function gs(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function ys(e,t,{onClose:s}={}){(async()=>{let n=null;try{n=await ps(e,t)}catch{e.Statamic?.$toast?.error(f(e,"section_fields_failed"));return}if(!n?.fieldset){e.Statamic?.$toast?.error(f(e,"section_fields_none"));return}let a=Promise.resolve(),i=!1;return Q(e.document,cs,{heading:f(e,"section_fields"),subtitle:n.display,src:`${us(e)}/fields/fieldsets/${encodeURIComponent(n.fieldset)}/edit`,closeLabel:f(e,"close"),onSaved:()=>{a=lt(e,t).then(()=>{i=!0}).catch(()=>{})},onClose:()=>{(async()=>{if(await a,!i)try{await lt(e,t)}catch{}T("dock:refresh-preview"),s?.()})()}})})()}const ks=["title"],bs={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},_s={key:2,"data-sve-ht-letter":""},Ts=["innerHTML"],xs=["title"],Ss=["title"],ws={key:1,"data-sve-ht-kind":""},Cs={key:3,"data-sve-ht-name":""},$s={key:4,"data-sve-ht-actions":""},Ps=["disabled","title","innerHTML"],Es=["disabled","title"],Ls=["disabled","title"],Is=["disabled","title"],Hs=["data-sve-ht-id"],Ms='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',As='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',Rs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Ds='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',Fs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',Os='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',Bs={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const t=gs(window),s=f(window,"section_fields");function n(){const h=hs();if(!h){window.Statamic?.$toast?.error(f(window,"section_fields_none"));return}ys(window,h)}function a(h){return h.kind==="component"?h.src?`partial:${h.src}`:h.tag:h.name?`${h.tag} ${h.name}`:h.tag}function i(h){return!!h.section}function r(h){if(i(h)){o.onSection?.(h.section);return}o.onSelect?.(h.id)}function u(h,l){const c={"data-sve-ht-id":h.id};return h.current&&(c["data-sve-ht-current"]=""),h.hidden&&(c["data-sve-ht-hidden"]=""),c["data-sve-ht-cat"]=h.cat||"other",c["data-sve-ht-depth"]=String(h.depth),l&&(c["data-sve-ht-dim"]=""),i(h)&&(c["data-sve-ht-sec"]=""),!i(h)&&o.dropId===h.id&&o.dropPlace&&(c["data-sve-ht-drop"]=o.dropPlace),c}function g(h){return!h.hidden||h.wrapFrom!=null}return(h,l)=>(v(),m(M,null,[_("div",re({"data-sve-ht-row":""},u(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:l[26]||(l[26]=c=>r(e.row)),onDblclick:l[27]||(l[27]=b(c=>i(e.row)?null:d(o).onRename?.(e.row.id),["prevent"])),onKeydown:[l[28]||(l[28]=N(b(c=>r(e.row),["prevent"]),["enter"])),l[29]||(l[29]=N(b(c=>r(e.row),["prevent"]),["space"]))],onPointerdown:l[30]||(l[30]=c=>i(e.row)?null:d(o).onPointerDown?.(c,e.row.id)),onContextmenu:l[31]||(l[31]=b(c=>i(e.row)?null:d(o).onContext?.(c,e.row.id),["prevent","stop"]))}),[l[32]||(l[32]=_("span",{"data-sve-ht-indent":"","aria-hidden":"true"},null,-1)),e.row.hasChildren||e.row.emptyBlock?(v(),m("button",re({key:0,type:"button","data-sve-ht-twist":""},e.row.shut?{"data-sve-ht-shut":""}:{},{innerHTML:As,onClick:l[0]||(l[0]=b(c=>i(e.row)?d(o).onSection?.(e.row.section):d(o).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:l[1]||(l[1]=b(()=>{},["stop"])),onDblclick:l[2]||(l[2]=b(()=>{},["stop"]))}),null,16)):(v(),m("span",bs)),e.row.letter?(v(),m("span",_s,w(e.row.letter),1)):(v(),m("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Ts)),_("span",{"data-sve-ht-text":"",title:d(o).renameTitle},[!e.row.kind&&!i(e.row)?(v(),m("button",{key:0,type:"button","data-sve-ht-tag":"",title:d(o).tagTitle,onClick:l[3]||(l[3]=b(()=>{},["stop","prevent"])),onPointerdown:l[4]||(l[4]=b(()=>{},["stop"])),onDblclick:l[5]||(l[5]=b(c=>d(o).onTagChange?.(c,e.row.id),["stop","prevent"]))},w(e.row.tag),41,Ss)):(v(),m("span",ws,w(e.row.tag),1)),d(o).editingId===e.row.id&&!i(e.row)?Oe((v(),m("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":l[6]||(l[6]=c=>d(o).draft=c),onMousedown:l[7]||(l[7]=b(()=>{},["stop"])),onPointerdown:l[8]||(l[8]=b(()=>{},["stop"])),onClick:l[9]||(l[9]=b(()=>{},["stop"])),onDblclick:l[10]||(l[10]=b(()=>{},["stop"])),onKeydown:[l[11]||(l[11]=b(()=>{},["stop"])),l[12]||(l[12]=N(b(c=>d(o).onRenameCommit?.(),["prevent"]),["enter"])),l[13]||(l[13]=N(b(c=>d(o).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:l[14]||(l[14]=c=>d(o).onRenameCommit?.())},null,544)),[[wt,d(o).draft]]):(v(),m("span",Cs,w(e.row.name),1))],8,xs),i(e.row)?$("",!0):(v(),m("span",$s,[g(e.row)?(v(),m("button",{key:0,type:"button","data-sve-ht-eye":"",disabled:!d(o).canEdit,title:d(o).canEdit?e.row.hidden?d(o).showTitle:d(o).hideTitle:d(o).lockedTitle,innerHTML:e.row.hidden?Ds:Rs,onClick:l[15]||(l[15]=b(c=>d(o).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:l[16]||(l[16]=b(()=>{},["stop"])),onDblclick:l[17]||(l[17]=b(()=>{},["stop"]))},null,40,Ps)):$("",!0),d(t)&&e.row.depth===0?(v(),m("button",{key:1,type:"button","data-sve-ht-fields":"",disabled:!d(o).canEdit,title:d(o).canEdit?d(s):d(o).lockedTitle,innerHTML:Ms,onClick:b(n,["stop","prevent"]),onPointerdown:l[18]||(l[18]=b(()=>{},["stop"])),onDblclick:l[19]||(l[19]=b(()=>{},["stop"]))},null,40,Es)):$("",!0),_("button",{type:"button","data-sve-ht-dup":"",disabled:!d(o).canEdit,title:d(o).canEdit?d(o).duplicateTitle:d(o).lockedTitle,innerHTML:Fs,onClick:l[20]||(l[20]=b(c=>d(o).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:l[21]||(l[21]=b(()=>{},["stop"])),onDblclick:l[22]||(l[22]=b(()=>{},["stop"]))},null,40,Ls),_("button",{type:"button","data-sve-ht-del":"",disabled:!d(o).canEdit,title:d(o).canEdit?d(o).deleteTitle:d(o).lockedTitle,innerHTML:Os,onClick:l[23]||(l[23]=b(c=>d(o).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:l[24]||(l[24]=b(()=>{},["stop"])),onDblclick:l[25]||(l[25]=b(()=>{},["stop"]))},null,40,Is)]))],16,ks),e.row.emptyBlock&&!e.row.shut?(v(),m("div",re({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},d(o).dropId===e.row.id&&d(o).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),w(d(o).slotText),17,Hs)):$("",!0)],64))}},He=J(Bs,[["__scopeId","data-v-87018beb"]]),js={class:"sve-dialog__title"},qs={for:"sve-new-section-group"},Ks=["value"],Vs={for:"sve-new-section-name"},Ns=["placeholder"],zs={key:0,class:"sve-dialog__note"},Ws={class:"sve-dialog__actions"},Us=["disabled"],Xs=["disabled"],Ys={__name:"NewSectionPrompt",props:{heading:{type:String,required:!0},groupLabel:{type:String,required:!0},nameLabel:{type:String,required:!0},placeholder:{type:String,default:""},note:{type:String,default:""},groups:{type:Array,required:!0},cancelLabel:{type:String,required:!0},saveLabel:{type:String,required:!0},onOk:{type:Function,required:!0},onClose:{type:Function,required:!0}},setup(e){const t=e,s=R(""),n=R(t.groups[0]?.key??""),a=R(null),i=R(!1);xt(()=>Ct(()=>a.value?.focus()));function r(){const h=s.value.trim();if(!h||!n.value||i.value){a.value?.focus();return}i.value=!0,t.onOk(h,n.value)}function u(h){h.target===h.currentTarget&&t.onClose()}function g(h){h.key==="Enter"?r():h.key==="Escape"&&t.onClose()}return(h,l)=>(v(),m("div",{class:"sve-dialog-overlay",onClick:u},[_("div",{class:"sve-dialog",onClick:l[3]||(l[3]=b(()=>{},["stop"]))},[_("div",js,w(e.heading),1),_("label",qs,w(e.groupLabel),1),Oe(_("select",{id:"sve-new-section-group","onUpdate:modelValue":l[0]||(l[0]=c=>n.value=c),onKeydown:g},[(v(!0),m(M,null,q(e.groups,c=>(v(),m("option",{key:c.key,value:c.key},w(c.display),9,Ks))),128))],544),[[yn,n.value]]),_("label",Vs,w(e.nameLabel),1),Oe(_("input",{id:"sve-new-section-name",ref_key:"input",ref:a,"onUpdate:modelValue":l[1]||(l[1]=c=>s.value=c),type:"text",placeholder:e.placeholder,onKeydown:g},null,40,Ns),[[wt,s.value]]),e.note?(v(),m("p",zs,w(e.note),1)):$("",!0),_("div",Ws,[_("button",{type:"button",class:"is-cancel",disabled:i.value,onClick:l[2]||(l[2]=(...c)=>e.onClose&&e.onClose(...c))},w(e.cancelLabel),9,Us),_("button",{type:"button",class:"is-primary",disabled:i.value,onClick:r},w(e.saveLabel),9,Xs)])])]))}},Zs=J(Ys,[["__scopeId","data-v-d21be545"]]),qt="/!/sve/section-types";async function Gs(e){const t=await e.fetch(qt,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!t.ok)throw new Error(`section-types ${t.status}`);const s=await t.json(),n=new Map;for(const a of s.types||[])a?.group&&!n.has(a.group)&&n.set(a.group,a.group_display||a.group);return[...n].map(([a,i])=>({key:a,display:i}))}async function Js(e,{display:t,group:s}){const n=await e.fetch(qt,{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":$t(e),Accept:"application/json"},credentials:"same-origin",body:JSON.stringify({display:t,group:s})}),a=await n.json().catch(()=>({}));if(!n.ok){const i=new Error(a.error||`section-types ${n.status}`);throw i.reason=a.error,i}return a}async function Qs(e,t,s=null){if(!t||typeof Fe!="function"||typeof st!="function")return null;const n=await Fe(e,t);if(!n)return null;const a=kn(),i=bn(e,"page",{handle:t},n?.defaults,a),r=St(i,n?.new||{},n?.defaults);return st(e,e.document,s,i,r)?i:null}const ct=700,ea=17;function ta(e,t){const s=(t||[]).filter(Boolean);if(!s.length)return;let n=0;const a=()=>{n+=1;const i=Pt(e),r=i?s.some(u=>i.querySelector(`[data-sid="${CSS.escape(u)}"]`)):!0;r&&ee({source:ne,type:te.SVE_ACTIVATE,ids:s},e),(r?!i&&n<6:n<ea)&&e.setTimeout(a,ct)};e.setTimeout(a,ct)}function na(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function oa(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){(async()=>{let i=[];try{i=await Gs(e)}catch(u){n?.(u),e.Statamic?.$toast?.error(f(e,"section_new_failed"));return}if(!i.length){n?.(new Error("no groups")),e.Statamic?.$toast?.error(f(e,"section_new_failed"));return}const r=Q(e.document,Zs,{heading:f(e,"section_new"),groupLabel:f(e,"section_new_group"),nameLabel:f(e,"section_new_name"),placeholder:f(e,"section_new_placeholder"),note:f(e,"section_new_note"),groups:i,cancelLabel:f(e,"cancel"),saveLabel:f(e,"section_new_create"),onClose:a,onOk:(u,g)=>{(async()=>{try{const h=await Js(e,{display:u,group:g});r.dismiss(),e.Statamic?.$toast?.success(f(e,"section_created",{name:h.section?.display||u})),e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"));const l=await Qs(e,h.section?.handle,t);!l&&h.section?.handle&&T("dock:open-template",h.section.handle),s?.({...h,uid:l?._visual_id||""})}catch(h){r.dismiss(),e.Statamic?.$toast?.error(f(e,h.reason==="bad_name"?"section_new_bad_name":"section_new_failed")),n?.(h)}})()}})})()}const sa=["data-sve-ht-look"],aa={key:0,class:"sve-ht-empty"},ra={key:1,class:"sve-ht-empty"},ia={key:0,class:"sve-ht-empty"},la=["title","aria-label"],ca={__name:"HtmlTreeList",setup(e){const t=na(window),s=f(window,"section_new"),n=R(!1),a=ae(()=>Bt(o.query)),i=ae(()=>es(o.rows,a.value)),r=ae(()=>i.value.rows),u=ae(()=>a.value?o.sections.filter(S=>jt(S.row,a.value)||S.current&&S.ready&&r.value.length>0):o.sections),g=ae(()=>!!a.value&&!u.value.length&&!r.value.length);function h(S){return!!a.value&&!i.value.hits.has(S.path)}function l(){n.value=!1}async function c(S){if(S)for(let E=0;E<20;E+=1){await Ct(),o.onRefresh?.();const L=o.sections.find(I=>I.uid===S);if(L){o.onSection?.(S),ta(window,L.ids);return}await new Promise(I=>setTimeout(I,50))}}function x(){n.value||(n.value=!0,oa(window,{afterUid:o.sections.length?o.sections[o.sections.length-1].uid:null,onDone:S=>{l(),c(S?.uid)},onError:l,onClose:l}))}return(S,E)=>(v(),m("div",re({class:"sve-ht-root","data-sve-ht-look":d(o).look},d(o).dragging?{"data-sve-ht-dragging":""}:{}),[!d(o).rows.length&&!d(o).sections.length?(v(),m("div",aa,w(d(o).emptyText),1)):g.value?(v(),m("div",ra,w(d(o).searchEmpty),1)):$("",!0),d(o).sections.length?(v(!0),m(M,{key:2},q(u.value,L=>(v(),m("div",re({key:L.uid},{ref_for:!0},L.current?{"data-sve-ht-branch":""}:{}),[L.ready?(v(),m(M,{key:0},[(v(!0),m(M,null,q(r.value,I=>(v(),ge(He,{key:I.id,row:I,dim:h(I)},null,8,["row","dim"]))),128)),d(o).rows.length?$("",!0):(v(),m("div",ia,w(d(o).emptyText),1))],64)):(v(),ge(He,{key:1,row:L.row},null,8,["row"]))],16))),128)):d(o).rows.length?(v(!0),m(M,{key:3},q(r.value,L=>(v(),ge(He,{key:L.id,row:L,dim:h(L)},null,8,["row","dim"]))),128)):$("",!0),d(t)&&(d(o).sections.length||d(o).pageBuilder)?(v(),m("button",{key:4,type:"button",class:"sve-ht-new",title:d(s),"aria-label":d(s),onClick:x},[...E[0]||(E[0]=[_("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round"},[_("path",{d:"M12 5v14"}),_("path",{d:"M5 12h14"})],-1)])],8,la)):$("",!0)],16,sa))}},dt=J(ca,[["__scopeId","data-v-a8abcac2"]]);let Me=null;function da(e){return Me||(Me=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{pages:[]}).then(t=>Array.isArray(t.pages)?t.pages:[]).catch(()=>[])),Me}let _e=null;function Ae(){_e?.dismiss(),_e=null}function ua(e,t,s){Ae();const n=t?.getBoundingClientRect?.(),a={x:n?n.left:0,y:n?n.bottom+4:0};da(e).then(i=>{const r=i.length?i.map(u=>({label:u.title||u.url,onPick:()=>{Ae(),s(u.url)}})):[{label:f(e,"component_props_pages_none"),onPick:null}];Ae(),_e=Q(e.document,Ye,{items:r,x:a.x,y:a.y,onClose:()=>{_e=null}})})}const Kt="sve-html-tree-labels";function Vt(){try{const e=globalThis.localStorage?.getItem(Kt);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function ha(e){try{globalThis.localStorage?.setItem(Kt,JSON.stringify(e))}catch{}}function Nt(e){return String(e||"_")}function zt(e){const t=Vt()[Nt(e)];return t&&typeof t=="object"?{...t}:{}}function pa(e,t,s){const n=s?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function fa(e,t,s,n){if(!t)return;const a=Nt(e),i=Vt(),r={...i[a]||{}},u=String(s||"").replace(/\s+/g," ").trim(),g=String(n||"").trim();!u||u===g?delete r[t]:r[t]=u,Object.keys(r).length?i[a]=r:delete i[a],ha(i)}const va=/^@(media|supports|container|layer|scope)\b/i;function ma(e){const t=String(e||""),s=[];let n=0,a=0;for(;n<t.length;){if(t[n]==="{"&&t[n+1]==="{"){const u=t.indexOf("}}",n+2);n=u===-1?t.length:u+2;continue}if(t[n]==="/"&&t[n+1]==="*"){const u=t.indexOf("*/",n+2);n=u===-1?t.length:u+2;continue}if(t[n]==='"'||t[n]==="'"){const u=t[n];for(n+=1;n<t.length&&t[n]!==u;)n+=t[n]==="\\"?2:1;n+=1;continue}if(t[n]!=="{"){n+=1;continue}let i=1,r=n+1;for(;r<t.length&&i>0;){if(t[r]==="{"&&t[r+1]==="{"){const u=t.indexOf("}}",r+2);r=u===-1?t.length:u+2;continue}if(t[r]==="/"&&t[r+1]==="*"){const u=t.indexOf("*/",r+2);r=u===-1?t.length:u+2;continue}if(t[r]==='"'||t[r]==="'"){const u=t[r];for(r+=1;r<t.length&&t[r]!==u;)r+=t[r]==="\\"?2:1;r+=1;continue}t[r]==="{"?i+=1:t[r]==="}"&&(i-=1),r+=1}s.push({selector:t.slice(a,n).trim(),body:t.slice(n+1,r-1),from:a,to:r,text:t.slice(a,r).trim()}),n=r,a=r}return s}function ut(e){const t=String(e||""),s=new Set,n=new Set,a=new Set;for(const i of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const r of i[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))r&&(s.add(r),s.add(r.replace(/([:./%!#()[\],])/g,"\\$1")));for(const i of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))i[2].trim()&&n.add(i[2].trim());for(const i of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))a.add(i[1].toLowerCase());return{classes:s,ids:n,tags:a}}function ht(e,t){const s=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),n=[...s.matchAll(/\.((?:\\.|[\w-])+)/g)].map(r=>r[1]),a=[...s.matchAll(/#((?:\\.|[\w-])+)/g)].map(r=>r[1]);if(n.length||a.length){const r=u=>u.replace(/\\(.)/g,"$1");return n.every(u=>t.classes.has(u)||t.classes.has(r(u)))&&a.every(u=>t.ids.has(r(u)))}const i=[...s.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(r=>r[2].toLowerCase());return i.length>0&&i.every(r=>t.tags.has(r))}function ga(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function ya(e,t,s){const n=ga(e);if(!n.length)return"keep";const a=n.filter(r=>ht(r,t));return a.length?a.length===n.length&&!n.some(r=>ht(r,s))?"move":"copy":"keep"}function Wt(e,t,s){const n=String(e||""),a=ut(t),i=ut(s),r=[],u=[];let g=0;for(const h of ma(n)){const l=n.slice(h.from,h.to),c=l.match(/^\s*/)[0];if(g=h.to,va.test(h.selector)){const S=Wt(h.body,t,s);S.move.trim()&&r.push(`${h.selector} {
${S.move.trim()}
}`),S.keep.trim()&&u.push(`${c}${h.selector} {
${S.keep.trim()}
}`);continue}const x=h.selector.startsWith("@")?"keep":ya(h.selector,a,i);if(x==="move"){r.push(h.text);continue}x==="copy"&&r.push(h.text),u.push(l)}return u.push(n.slice(g)),{move:r.join(`

`).trim(),keep:u.join("").replace(/\n{3,}/g,`

`).trim()}}const ka="/!/sve/component";function ba(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let s=null;for(const n of t){if(!n.trim())continue;const a=n.match(/^[ \t]*/)[0].length;s=s===null?a:Math.min(s,a)}return s?t.map(n=>n.slice(s)).join(`
`):t.join(`
`)}function _a(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function Ta(e,t){if(!jn(e))return"";try{return await(await Tn(()=>import("./tw-compile-D8Xdoe3O.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(s){return console.error("[sve] component tailwind compile",s),""}}async function xa(e,t){const s=await e.fetch(ka,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":$t(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!s.ok){const n=new Error(String(s.status));throw n.status=s.status,n}return s.json()}function pt(e,t){const{from:s,to:n}=Bn(e,t),a=e.slice(s,n);if(!a.trim())return null;const i=e.slice(0,s)+e.slice(n),r=T("dock:css"),u=Wt(typeof r=="string"?r:"",a,i);return{html:ba(a),css:u.move,keepCss:u.keep,lead:_a(a),from:s,to:n}}function Sa(e,t,{onDone:s,onError:n}={}){if(T("dock:is-locked")===!0)return;const a=T("dock:html");if(typeof a!="string"||!t)return;const i=pt(a,t);if(!i)return;const r=Q(e.document,_n,{heading:f(e,"component_new"),nameLabel:f(e,"component_name"),placeholder:f(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:f(e,"cancel"),saveLabel:f(e,"component_create"),onOk:u=>{r.dismiss(),(async()=>{try{const g=await Ta(e,i.html),h=T("dock:html"),l=typeof h=="string"&&h===a?i:pt(h,t);if(!l)return;const c=await xa(e,{name:u,html:l.html,css:l.css,js:"",tw:g}),x=T("dock:html"),S=x.slice(0,l.from)+l.lead+c.tag+x.slice(l.to);T("dock:set-html",S),l.css.trim()&&T("dock:set-css",l.keepCss),s?.(c)}catch(g){n?.(g)}})()}})}function wa(e,t,s){const n=String(e||"");if(!t||t.kind!=="antlers")return n;const a=String(s||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?Ea(n,t,a):t.tag==="else"||!a?n:n.slice(0,t.from)+`{{ ${t.tag} ${a} }}`+n.slice(t.openTo)}function qe(e,t,s,n){return ie(e,t,{kind:s,name:n})}function ie(e,t,s={}){const n=String(e||"");if(!t||t.antlers!=="loop")return n;const a=t.loopKind==="collection"?"collection":"field",i=s.kind??a,r=String(s.name??t.expr??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(r))return n;const u=s.sortDir??t.sortDir??"",g=String(s.sortField??t.sortField??"").trim(),h=String(s.limit??t.limit??"").trim(),l=Ut(n,t);if(!l)return n;const c=i===a?t.params:"",x=i==="collection"?Ca(r,g,u,h,c):$a(r,g,u,h,c),S=i==="collection"?"collection":r;return n.slice(0,t.from)+x+n.slice(t.openTo,l.from)+`{{ /${S} }}`+n.slice(l.to)}function Ca(e,t,s,n,a){const i=Pa(a).replace(/\bsort\s*=\s*["'][^"']*["']/g,"").replace(/\blimit\s*=\s*["']?\d+["']?/g,"").replace(/\s+/g," ").trim(),r=[`collection from="${e}"`];return s==="random"?r.push('sort="random"'):t&&r.push(`sort="${t}${s==="desc"?":desc":":asc"}"`),n&&r.push(`limit="${n}"`),i&&r.push(i),`{{ ${r.join(" ")} }}`}function $a(e,t,s,n,a){const i=String(a||"").split("|").map(u=>u.trim()).filter(u=>u&&!/^from\s*=/.test(u)&&!/^sort\s*:/.test(u)&&!/^reverse$/.test(u)&&!/^shuffle$/.test(u)&&!/^limit\s*:/.test(u)),r=[e,...i];return s==="random"?r.push("shuffle"):t&&(r.push(`sort:${t}`),s==="desc"&&r.push("reverse")),n&&r.push(`limit:${n}`),`{{ ${r.join(" | ")} }}`}function Pa(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function Ut(e,t){const n=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return n?{from:t.from+n.index,to:t.from+n.index+n[0].length}:null}function Ea(e,t,s){return ie(e,t,{name:s})}function La(e,t,s){const n=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return n;const a=Ut(n,t);if(!a)return n;const r=(n.slice(0,a.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],u=s==="else"?"{{ else }}":"{{ elseif true }}";return`${n.slice(0,a.from)}${u}
${r}${n.slice(a.from)}`}const A=zn("sve-call-values"),de=new Set;let ft=null;const Ia="__sve-html-tree-style",j=new Set;let Ke="",Y=!1,fe=!0,K="",ue=0,Xt="";const Z=new Map,le=new Set;let F="",Yt=!1,H=null,Te=null,xe=0,Ve=null,he=[],W=null,ce=null,Se=null,we=null,Ne=null,Ce=!1,U=null,z=null;function B(e){return e.getElementById(ke)}function Ha(e){wn(e,Ia,`
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
      /* The row sets --sve-ht-depth; the classic look steps the whole card in. */
      margin-left: calc(var(--sve-ht-depth, 0) * 12px);
    }
    /* Only the tags look draws these two — see below. */
    [data-sve-ht-indent],
    [data-sve-ht-twist-gap] { display: none; }
    [data-sve-ht-dragging],
    [data-sve-ht-dragging] * {
      cursor: grabbing !important;
    }
    [data-sve-ht-row]:hover { background: rgba(128,128,128,.26); }
    [data-sve-ht-row]:focus-visible { outline: 2px solid #3858e9; outline-offset: -2px; }
    /* One rule, and a shut section is a row — so the section that was just
       clicked wears the same blue its first tag wears when the file lands, and
       the click stays one colour instead of changing hands. */
    [data-sve-ht-row][data-sve-ht-current] { background: #3858e9; color: #fff; }
    [data-sve-ht-row][data-sve-ht-current]:hover { background: #4a68ee; }
    [data-sve-ht-row][data-sve-ht-hidden] { opacity: .5; }
    /* A search: the row is only the way to a match further down. */
    [data-sve-ht-row][data-sve-ht-dim] { opacity: .45; }
    /* The box around the open section's tags — it says where you are working. */
    [data-sve-ht-branch] {
      box-sizing: border-box;
      border: 1px solid rgba(56,88,233,.6);
      border-radius: 0.5625rem;
      padding: 0.3125rem;
      margin-bottom: 0.3125rem;
    }
    [data-sve-ht-branch] > [data-sve-ht-row]:last-child { margin-bottom: 0; }
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
    [data-sve-ht-fields],
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
    [data-sve-ht-fields]:hover,
    [data-sve-ht-dup]:hover,
    [data-sve-ht-del]:hover { opacity: 1; background: rgba(255,255,255,.12); }
    /* Locked: still there, still readable, plainly not for pressing. */
    [data-sve-ht-eye][disabled],
    [data-sve-ht-fields][disabled],
    [data-sve-ht-dup][disabled],
    [data-sve-ht-del][disabled] { opacity: .3; cursor: default; }
    [data-sve-ht-eye][disabled]:hover,
    [data-sve-ht-fields][disabled]:hover,
    [data-sve-ht-dup][disabled]:hover,
    [data-sve-ht-del][disabled]:hover { opacity: .3; background: none; }
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
    /* The tag is a label on the row and the name is what the row is about, so
       the tag is the smaller of the two and carries the chip. */
    [data-sve-ht-tag],
    [data-sve-ht-kind] {
      all: unset;
      box-sizing: border-box;
      flex: none;
      padding: 1px 5px;
      border-radius: 4px;
      background: rgba(255,255,255,.08);
      font-size: 10px;
      opacity: .75;
    }
    [data-sve-ht-tag] {
      cursor: pointer;
    }
    [data-sve-ht-tag]:hover {
      opacity: 1;
      background: rgba(255,255,255,.22);
    }
    [data-sve-ht-tag]:focus-visible {
      outline: 2px solid #3858e9;
      outline-offset: -2px;
    }
    /* On the picked row the chip has a blue ground under it, so it lightens
       rather than darkens. */
    [data-sve-ht-row][data-sve-ht-current] [data-sve-ht-tag],
    [data-sve-ht-row][data-sve-ht-current] [data-sve-ht-kind] {
      background: rgba(255,255,255,.16);
      opacity: 1;
    }
    /* A shut section's tag is a span, not a button — there is no file open to
       rename it in. Same chip either way; only the hover tells them apart. */
    [data-sve-ht-row][data-sve-ht-sec] [data-sve-ht-kind] {
      background: rgba(255,255,255,.12);
      color: rgba(255,255,255,.7);
      opacity: 1;
    }
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

    /* ===== The tags look ===================================================
       The tree's own face, so it stops reading as a second block tree: flat
       rows instead of a card each, one thin guide per level of depth, and a
       colour per family of tag on the icon and the chip. The three Antlers
       families wear the dock toolbar's own colours — the component button's
       green, the loop button's indigo, the if button's amber (dock/layout.js)
       — so the tree and the pane say the same thing about the same line.
       Layout is blue, text is rose, media is orange: none of the seven sits
       next to another.
       Everything above is the classic look, untouched. The switch in Live
       Preview settings (HTML_TREE_LOOK_KEY) decides which value the list
       wears as data-sve-ht-look, and every rule here hangs off that. */
    [data-sve-ht-look="tags"] {
      --sve-ht-c-layout: #2563eb;
      --sve-ht-c-text: #be185d;
      --sve-ht-c-media: #c2410c;
      --sve-ht-c-loop: #4f46e5;
      --sve-ht-c-if: #b45309;
      --sve-ht-c-component: #0f766e;
      --sve-ht-c-other: #6b6b6b;
      --sve-ht-guide: rgba(128,128,128,.3);
      --sve-ht-pick: rgba(56,88,233,.14);
      --sve-ht-pick-hover: rgba(56,88,233,.22);
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      --sve-ht-c-layout: #60a5fa;
      --sve-ht-c-text: #f9a8d4;
      --sve-ht-c-media: #fb923c;
      --sve-ht-c-loop: #a5b4fc;
      --sve-ht-c-if: #e8c468;
      --sve-ht-c-component: #5eead4;
      --sve-ht-c-other: #9a9a9a;
      --sve-ht-guide: rgba(255,255,255,.13);
      --sve-ht-pick: rgba(56,88,233,.3);
      --sve-ht-pick-hover: rgba(56,88,233,.4);
    }
    [data-sve-ht-look="tags"] [data-sve-ht-row] { --sve-ht-c: var(--sve-ht-c-other); }
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-cat="layout"] { --sve-ht-c: var(--sve-ht-c-layout); }
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-cat="text"] { --sve-ht-c: var(--sve-ht-c-text); }
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-cat="media"] { --sve-ht-c: var(--sve-ht-c-media); }
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-cat="loop"] { --sve-ht-c: var(--sve-ht-c-loop); }
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-cat="if"] { --sve-ht-c: var(--sve-ht-c-if); }
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-cat="component"] { --sve-ht-c: var(--sve-ht-c-component); }

    /* Flat rows: no card, no indent margin — the spacer below does the
       stepping, so the hover and the pick run the full width of the panel. */
    [data-sve-ht-look="tags"] [data-sve-ht-row] {
      margin: 0;
      padding: 0 6px 0 4px;
      min-height: 26px;
      gap: 5px;
      background: none;
      border-radius: 5px;
    }
    [data-sve-ht-look="tags"] [data-sve-ht-row]:hover { background: rgba(128,128,128,.14); }
    /* The picked row: our blue as a wash and a bar at the edge, not a solid
       fill — the chip's colour has to stay readable on it. */
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-current] {
      background: var(--sve-ht-pick);
      color: inherit;
      box-shadow: inset 2px 0 0 #3858e9;
    }
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-current]:hover { background: var(--sve-ht-pick-hover); }
    /* A shut section is one row in the page's list; a little air between them. */
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-sec] { margin-bottom: 2px; }
    /* The open section's box, quieter: it says where you are, the bar says
       what you picked. */
    [data-sve-ht-look="tags"] [data-sve-ht-branch] {
      border: 1px solid rgba(56,88,233,.45);
      border-radius: 7px;
      padding: 3px;
      margin: 0 0 6px;
      background: rgba(56,88,233,.04);
    }

    /* One guide per level, drawn on the spacer: a line every 14px, the first
       7px in, so each sits under the twist of the row it descends from. The
       negative margin cancels the row gap, so a depth-0 row starts flush. */
    [data-sve-ht-look="tags"] [data-sve-ht-indent] {
      display: block;
      flex: none;
      align-self: stretch;
      width: calc(var(--sve-ht-depth, 0) * 14px);
      margin-right: -5px;
      background: linear-gradient(to right, var(--sve-ht-guide) 1px, transparent 1px) 7px 0 / 14px 100% repeat-x;
      pointer-events: none;
    }
    [data-sve-ht-look="tags"] [data-sve-ht-twist-gap] {
      display: inline-block;
      flex: none;
      width: 14px;
      height: 14px;
    }
    [data-sve-ht-look="tags"] [data-sve-ht-twist] { opacity: .55; }
    [data-sve-ht-look="tags"] [data-sve-ht-twist]:hover { opacity: 1; }
    [data-sve-ht-look="tags"] [data-sve-ht-slot][data-sve-ht-id] {
      margin-left: calc(4px + var(--sve-ht-depth, 0) * 14px);
    }

    /* The family's colour on the mark and on the chip; the name stays the
       panel's own text colour, so the colour is a label and not the row. */
    [data-sve-ht-look="tags"] [data-sve-ht-icon] { color: var(--sve-ht-c); }
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-cat] [data-sve-ht-tag],
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-cat] [data-sve-ht-kind] {
      color: var(--sve-ht-c);
      background: color-mix(in srgb, var(--sve-ht-c) 15%, transparent);
      opacity: 1;
      font-weight: 600;
      letter-spacing: .01em;
    }
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-cat] [data-sve-ht-tag]:hover {
      background: color-mix(in srgb, var(--sve-ht-c) 30%, transparent);
    }
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-current] [data-sve-ht-tag],
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-current] [data-sve-ht-kind] {
      background: color-mix(in srgb, var(--sve-ht-c) 24%, transparent);
    }
    [data-sve-ht-look="tags"] [data-sve-ht-name] { opacity: .82; }
    /* A root row — a section of the page, or the file's own root — names a
       place; the rows under it name what is in it. */
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-depth="0"] [data-sve-ht-name] {
      font-weight: 600;
      opacity: .95;
    }
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-current] [data-sve-ht-name] { opacity: 1; }
    [data-sve-ht-look="tags"] [data-sve-ht-eye]:hover,
    [data-sve-ht-look="tags"] [data-sve-ht-fields]:hover,
    [data-sve-ht-look="tags"] [data-sve-ht-dup]:hover,
    [data-sve-ht-look="tags"] [data-sve-ht-del]:hover { background: rgba(128,128,128,.25); }
  `)}function D(){const e=T("dock:html");return typeof e=="string"?e:""}function Zt(e){return!!T("dock:is-open",e)}function oe(e){return Qe()?!1:T("dock:set-html",e)===!0}function vt(e){const t=T("dock:component-exit-state")||{};if(o.exitOpen=!!t.open,!t.open){o.onExit=null;return}o.exitName=t.name||"",o.exitLabel=f(e,"component_exit"),o.exitTitle=f(e,t.back?"component_exit_back":"component_exit_close"),o.onExit=()=>{T("dock:exit-component"),P(e)}}function Ma(e,t){const s=Hn(e);if(!s||t.type!==s)return"";const n=Mn(t[s]);return n&&An(e,n)?.section_type||""}const pe=[];let Re=!1;function De(e,t){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(t,{timeout:2e3});return}e.setTimeout(t,200)}function Aa(e,t){for(const s of t){const n=s.type;!n||Z.has(n)||le.has(n)||pe.includes(n)||pe.push(n)}Xe.htmlTreePrefetchArmed&&Gt(e)}function vr(e){Xe.htmlTreePrefetchArmed=!0,Gt(e)}function Gt(e){if(Re||!pe.length)return;Re=!0;const t=()=>{const s=pe.shift();if(!s){Re=!1;return}if(Z.has(s)||le.has(s)){De(e,t);return}le.add(s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(s)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{typeof n?.html=="string"&&Z.set(s,n.html)}).catch(()=>{}).finally(()=>{le.delete(s),De(e,t)})};De(e,t)}function Qe(){return!!F}function Ra(e){const t=new Map,s=Pt(e);if(!s)return t;for(const n of s.querySelectorAll("[data-sid]")){const a=n.getAttribute("data-sid");a&&!t.has(a)&&t.set(a,n.tagName.toLowerCase())}return t}function Da(e,t){const s=Ee(e);for(const n of ye(t)||[]){const a=Ue(n.values),i=a&&typeof a=="object"?a[s]:null;if(Array.isArray(i))return!0}return!1}function Jt(e,t){const s=Ee(e),n=Ra(e),a=[];for(const i of ye(t)||[]){const r=Ue(i.values),u=r&&typeof r=="object"?r[s]:null;if(Array.isArray(u)){u.forEach(g=>{if(!g||typeof g!="object"||Array.isArray(g)||typeof g.type!="string")return;const h=[g._visual_id,g.id,g._id].filter(E=>typeof E=="string"&&E!=="");if(!h.length)return;const l=Ma(e,g)||g.type,c=typeof g._sve_label=="string"?g._sve_label.trim():"",x=h.map(E=>n.get(E)).find(Boolean)||"section",S=zt(g.type)[`0:${x}`];a.push({uid:h[0],ids:h,type:g.type,tag:x,label:(typeof S=="string"&&S.trim()?S.trim():"")||c||Ht(e,l)?.display||je(l)||l,svg:Rt(x,"",null).svg||Wn.section,cat:Dt(x,"",""),enabled:g.enabled!==!1})});break}}return a}function Fa(e,t,s){if(!s.length)return"";const n=T("dock:current-type")||"",a=T("dock:current-uid"),i=!!T("dock:component-exit-state")?.open;if(a){const r=Ln(a,t),u=s.find(g=>g.ids.some(h=>r.includes(h)));if(u&&(i||u.type===n))return u.uid}return s.find(r=>r.type===n)?.uid||""}function Oa(e,t,s){const n=T("dock:component-exit-state");if(n?.open)return je(n.name)||n.name||"";if(s)return t.find(i=>i.uid===s)?.label||"";const a=T("dock:current-type")||"";return Ht(e,a)?.display||je(a)||""}function Qt(e,t,s,n,a){const i=s.find(u=>u.uid===n);if(!i||n===a)return;j.clear(),H=null,fe=!1,G(),Le(),K=n,Xt=D(),F=Z.get(i.type)||"",F&&(H=$e(Ge(F))||null),Yt=(T("dock:current-type")||"")===i.type,e.clearTimeout(ue),ue=e.setTimeout(()=>{K="",Y=!1,P(e)},4e3),P(e);const r=()=>Dn(i.uid,t,e,{clampToSection:!0});In(i.uid,t,e,r),ee({source:ne,type:te.SVE_ACTIVATE,ids:i.ids},e),e.setTimeout(()=>P(e),0)}function en(e,t){if(!t)return!1;for(const s of e||[])if(s.id===t||en(s.children,t))return!0;return!1}function $e(e){for(const t of e||[]){if(!t.kind)return t.id;const s=$e(t.children);if(s)return s}return""}function Ba(e,t){return j.has(e.path)?t===0:t>0}function ja(e){const t=new Set,s=(n,a)=>{for(const i of n)i.children.length&&Ba(i,a)&&t.add(i.id),s(i.children,a+1)};return s(e,0),t}function P(e){const t=e.document,n=B(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;Ha(t),Kn(e);const a=D();F&&F===a&&(F="");const i=F||a,r=Ge(i);he=r;const u=T("dock:current-type")||"",g=zt(u),h=Jt(e,t),l=Da(e,t);u&&a&&!F&&Z.set(u,a),Aa(e,h);const c=Fa(e,t,h);if(l&&!h.length){he=[],o.rows=[],o.sections=[],o.pageBuilder=!0,o.emptyText=f(e,"html_tree_empty"),o.canEdit=!T("dock:is-locked"),o.look=at(e),o.onRefresh=()=>P(e),o.onSection=null,vt(e),be(n,dt),mt(e,[]);return}o.pageBuilder=l;const x=`${u}|${c}`;x!==Ke&&(Ke=x,j.clear(),Y=i),Y!==!1&&i!==Y&&(Y=!1,j.clear(),H=$e(r)||null),K&&(K===c||!h.length)&&(Yt||i!==Xt)&&(e.clearTimeout(ue),K="",Y=!1,en(r,H)||(j.clear(),H=$e(r)||null));const S=h.some(p=>p.uid===K)?K:"",E=fe?"":S||c,L=!!(S||c),I=Vn(r,o.query?new Set:ja(r));!i.trim()&&!Zt(t)?o.emptyText=f(e,"html_tree_need_dock"):o.emptyText=f(e,"html_tree_empty"),o.slotText=f(e,"antlers_drop_here"),o.dataTitle=f(e,"data_vars_title"),o.pageTitle=f(e,"component_props_page"),o.renameTitle=f(e,"html_tree_rename"),o.tagTitle=f(e,"tw_tag"),o.hideTitle=f(e,"html_tree_hide"),o.showTitle=f(e,"html_tree_show"),o.duplicateTitle=f(e,"html_tree_duplicate"),o.deleteTitle=f(e,"html_tree_delete"),o.lockedTitle=f(e,"html_tree_locked"),o.searchEmpty=f(e,"html_tree_search_empty"),o.canEdit=!T("dock:is-locked"),o.look=at(e),o.onQuery=()=>P(e),vt(e),o.onSelect=p=>{const y=I.find(C=>C.id===p);y&&At(e,y.path)||tt(e,p,I)},o.onTwist=p=>{const y=I.find(C=>C.id===p)?.path;y&&(j.has(y)?j.delete(y):j.add(y),P(e))},o.onTagChange=(p,y)=>{const C=o.rows.find(V=>V.id===y);C&&!Qe()&&Nn(e,p.currentTarget,C)},o.onRename=p=>Ka(e,p),o.onRenameCommit=()=>gt(e,!0),o.onRenameCancel=()=>gt(e,!1),o.onHide=p=>Va(e,p),o.onDuplicate=p=>Na(e,p),o.onDelete=p=>Wa(e,p),o.onPointerDown=(p,y)=>Za(e,p,y),o.onContext=(p,y)=>Xa(e,p,y),o.onInspectCommit=p=>nr(e,p),o.onPropValue=(p,y,C)=>bt(e,p,y,C),o.onPropPage=(p,y)=>ua(e,p,C=>bt(e,y,C,!1)),o.onLoopKind=p=>or(e,p),o.onAddBranch=p=>sr(e,p),o.onLoopSortField=p=>{const y=Pe(),C=String(p||"").trim();if(!y)return;const V=z?.id===y.id?z.dir:"",me=y.sortDir||V||"asc";z=null,X(e,(an,rn)=>ie(an,rn,{sortField:C,sortDir:me}))},o.onLoopSortDir=p=>{const y=Pe(),C=String(p||"");if(y){if((C==="asc"||C==="desc")&&!y.sortField){z={id:y.id,dir:C},ze(e,y);return}z=null,X(e,(V,me)=>ie(V,me,{sortDir:C,sortField:C==="asc"||C==="desc"?me.sortField:""}))}},o.onLoopLimit=p=>X(e,(y,C)=>ie(y,C,{limit:String(p||"").replace(/\D/g,"")})),o.onPropHost=p=>p?A.mount(p):A.unmount(),o.onInspectData=(p,y)=>{T("dock:data-menu",{anchor:p,at:I.find(C=>C.id===H)?.from,onPick:C=>y(String(C?.var||"").trim())})};const se=I.find(p=>!p.kind)?.id,ve=Oa(e,h,E),k=E?h.find(p=>p.uid===E):null;o.rows=I.map(p=>{const y=Rt(p.tag,p.kind,p.antlers),C=p.id===se&&ve?ve:p.klass,V=p.id===se;return{...p,base:C,name:pa(C,p.path,g),current:p.id===H,letter:y.letter||"",svg:V&&k?k.svg:y.svg||"",cat:Dt(p.tag,p.kind,p.antlers),sectionRoot:V&&k?k.uid:""}}),o.sections=L?h.map(p=>{const y=!!E&&p.uid===E;return{...p,current:y,ready:y&&(!S||!!F),row:{id:`sec:${p.uid}`,section:p.uid,tag:p.tag,name:p.label,kind:"",svg:p.svg,cat:p.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:y,hidden:!p.enabled}}}):[],o.onSection=p=>Qt(e,t,h,p,E),o.onRefresh=()=>P(e),ze(e,o.rows.find(p=>p.id===H)),be(n,dt),mt(e,r)}function mt(e,t){B(e.document)&&tn(e,t)}function tn(e,t){const s=t[0],n=!!T("dock:component-src"),a=n?"":T("dock:current-uid")||"";ee({source:ne,type:te.SVE_HTML_PICK,on:!0,uid:a,all:n,tag:s?.tag||"",klass:s?.klass||"",nodes:ro(t)},e)}function qa(e){if(!e)return;const t=(s,n)=>{for(const a of s||[]){if(a.path===e)return!0;if(t(a.children,n+1))return n===0?j.delete(a.path):j.add(a.path),!0}return!1};t(he,0)}function Ka(e,t){if(Ce)return;const s=o.rows.find(n=>n.id===t);!s||s.kind||(H=t,o.rows.forEach(n=>{n.current=n.id===t}),o.editingId=t,o.draft=s.name,e.setTimeout(()=>{const n=B(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function gt(e,t){const s=o.editingId;if(!s)return;const n=o.rows.find(a=>a.id===s);o.editingId=null,t&&n&&fa(T("dock:current-type")||"",n.path,o.draft,n.base||n.klass),o.draft="",P(e)}function Va(e,t){et(e,t,oo)}function Na(e,t){et(e,t,so)}function nn(e,t){Rn(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const s=e.document;Fn({uid:t},s,e)})}function za(e,t,s){K===s&&(e.clearTimeout(ue),K="",F=""),H=null,fe=!1,Ke="";const n=Jt(e,t),a=n.find(i=>i.uid!==s)||n[0];a?Qt(e,t,n,a.uid,""):(F="",o.rows=[],o.sections=[],o.pageBuilder=!0,P(e)),e.setTimeout(()=>{B(e.document)&&P(e)},0)}It("row:removed",({uid:e,parentPath:t,doc:s,win:n})=>{t!==Ee(n)||!B(n.document)||za(n,s,e)});function Wa(e,t){const s=o.sections?.find(a=>a.row?.id===t),n=s?s.row?.section||s.uid:o.rows.find(a=>a.id===t)?.sectionRoot;if(n){nn(e,n);return}et(e,t,ao)}function et(e,t,s){if(T("dock:is-locked"))return;const n=D(),a=o.rows.find(r=>r.id===t);if(!a)return;const i=s(n,a);i!==n&&oe(i)}function G(){U?.dismiss(),U=null}function Ua(e,t,s){const n=s.row?.section||s.uid;n&&(U=Q(e.document,Ye,{items:[{label:f(e,"html_tree_remove_section"),danger:!0,onPick:()=>{G(),nn(e,n)}}],x:t.clientX,y:t.clientY,onClose:()=>{U=null}}))}function Xa(e,t,s){G();const n=o.sections?.find(u=>u.row?.id===s);if(n){Ua(e,t,n);return}const a=o.rows.find(u=>u.id===s);if(!a)return;tt(e,s,o.rows);const i={x:t.clientX,y:t.clientY},r=u=>{u.length&&(U?.dismiss(),U=Q(e.document,Ye,{items:u,x:i.x,y:i.y,onClose:()=>{U=null}}))};if(a.kind==="component"){Ya(e,a,r);return}o.canEdit&&r([{label:f(e,"component_make"),onPick:()=>{G(),Sa(e,a,{onDone:()=>P(e),onError:u=>{e.alert(u?.status===409?f(e,"component_exists"):f(e,"component_failed"))}})}}])}const yt=(e,t)=>{G(),T("dock:open-template",t)};function Ya(e,t,s){if(!Xn(t.src)){s([{label:f(e,"component_open_named",{name:t.name||t.src}),onPick:()=>yt(e,`view:partials/${t.src}`)}]);return}s([{label:f(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const a=Array.isArray(n.items)?n.items:[];s(a.length?a.map(i=>({label:f(e,"component_open_named",{name:i.label}),onPick:()=>yt(e,i.type)})):[{label:f(e,"component_none"),onPick:null}])}).catch(()=>s([{label:f(e,"component_none"),onPick:null}]))}function Za(e,t,s){if(t.button!==0||T("dock:is-locked")||o.editingId||t.target?.closest?.("button, input"))return;Le(),W=s,ce={x:t.clientX,y:t.clientY},Se=t.currentTarget,we=t.pointerId;const n=i=>Ga(e,i),a=i=>Ja(e,i);Ne=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),Ne=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function Ga(e,t){if(!W||!ce)return;const s=t.clientX-ce.x,n=t.clientY-ce.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{Se?.setPointerCapture?.(we)}catch{}}t.preventDefault();const a=e.document.elementFromPoint(t.clientX,t.clientY),i=a?.closest?.("[data-sve-ht-slot]");if(i){const c=i.getAttribute("data-sve-ht-id");if(c&&c!==W){o.dropId=c,o.dropPlace="inside";return}}const r=a?.closest?.("[data-sve-ht-row]"),u=r?.getAttribute("data-sve-ht-id");if(!u||u===W){o.dropId=null,o.dropPlace=null;return}const g=o.rows.find(c=>c.id===u),h=o.rows.find(c=>c.id===W);if(!g||h&&g.path.startsWith(`${h.path}/`)){o.dropId=null,o.dropPlace=null;return}const l=r.getBoundingClientRect();o.dropId=u,o.dropPlace=to(t.clientY-l.top,l.height,!Ft(g.tag)&&g.kind!=="component")}function Ja(e,t){const s=W,n=o.dropId,a=o.dropPlace||"after",i=o.dragging;if(Le(),i&&(Ce=!0,e.setTimeout(()=>{Ce=!1},0)),!i||T("dock:is-locked")||!s||!n||s===n)return;t?.preventDefault?.();const r=D(),u=no(r,he,s,n,a);u!==r&&oe(u)}function Le(){try{Se?.releasePointerCapture?.(we)}catch{}Ne?.(),W=null,ce=null,Se=null,we=null,o.dragging=!1,o.dropId=null,o.dropPlace=null}function on(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function ze(e,t){if(t?.kind==="component"){Qa(e,t);return}if(O.callOpen&&(O.callOpen=!1,O.callStore=null,A.forget(),Ze(e)),t?.kind!=="antlers"){o.inspect=null;return}const s=t.id;if(t.tag==="else"){o.inspect={key:s,title:f(e,"antlers_condition"),mode:"note",note:f(e,"antlers_else_note")};return}if(t.antlers==="loop"){const n=t.loopKind==="collection",a=z?.id===t.id?z.dir:"",i=t.sortDir||a;o.inspect={key:s,title:f(e,"antlers_loop"),mode:"loop",loopKind:n?"collection":"field",kinds:[{id:"field",label:f(e,"antlers_loop_field")},{id:"collection",label:f(e,"antlers_loop_collection")}],collections:on(e),value:t.expr||"",placeholder:f(e,n?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:f(e,"antlers_sort"),dir:i,needsField:i==="asc"||i==="desc",field:t.sortField||"",pickable:!n,placeholder:f(e,n?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:f(e,"antlers_sort_none")},{id:"asc",label:f(e,"antlers_sort_asc")},{id:"desc",label:f(e,"antlers_sort_desc")},{id:"random",label:f(e,"antlers_sort_random")}]},limit:{title:f(e,"antlers_limit"),value:t.limit||"",placeholder:f(e,"antlers_limit_placeholder")},branches:[]};return}o.inspect={key:s,title:f(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:f(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:f(e,"antlers_add_elseif")},{id:"else",label:f(e,"antlers_add_else")}]}}function Qa(e,t){if(!Yn(e)){o.inspect=null;return}if(!t.src)return;const s=t.id;if(o.inspect={key:s,title:f(e,"component_props_values"),mode:"note",note:f(e,"code_dock_loading")},Zn()){const n={},a={},i=new Map;for(const[r,u]of Gn(D().slice(t.from,t.to))){const g=Jn(r);g&&(r!==g||!i.has(g))&&i.set(g,u)}for(const[r,u]of i)u.bound?a[r]=u.value:n[r]=u.value;ft!==s&&(ft=s,de.clear());for(const r of de)r in a||(a[r]="");o.inspect=null,O.callOpen=!0,O.title=O.title||f(e,"component_props"),O.callTitle=t.klass||t.name||t.src,O.callStore=A.ui,A.ui.canBind=!0,A.ui.dataTitle=f(e,"data_vars_title"),A.ui.exprPlaceholder=f(e,"component_props_expr"),A.ui.onToggleBind=(r,u)=>tr(e,r,u),A.ui.onExpr=(r,u)=>kt(e,r,u),A.ui.onPickData=(r,u)=>T("dock:data-menu",{anchor:u,at:t.from,onPick:g=>kt(e,r,String(g?.var||"").trim())}),A.load(e,{key:`${t.src}::${s}`,src:t.src,params:n,bindings:a,readOnly:T("dock:is-locked")===!0}),A.watch(e,{src:t.src,write:r=>er(e,r,a)}),Ze(e);return}Qn(e,t.src).then(n=>{if(o.inspect?.key===s){if(!n.length){o.inspect={key:s,title:f(e,"component_props_values"),mode:"note",note:f(e,"component_props_values_none")};return}o.inspect={key:s,title:f(e,"component_props_values"),mode:"props",inheritLabel:f(e,"component_props_inherit"),rows:eo(n,D().slice(t.from,t.to))}}})}function er(e,t,s={}){const n=o.rows.find(r=>r.id===H);if(n?.kind!=="component"||T("dock:is-locked"))return;let a=D(),i=n.to;for(const[r,u]of Object.entries(t||{})){if(r in s)continue;const g=a.length,h=Je(a,{from:n.from,to:i},r,u);h!==a&&(i+=h.length-g,a=h)}a!==D()&&(oe(a),P(e))}function tr(e,t,s){s?de.add(t):de.delete(t),sn(e,t,"",s),P(e)}function kt(e,t,s){de.add(t),sn(e,t,s,!0),P(e)}function sn(e,t,s,n){const a=o.rows.find(u=>u.id===H);if(a?.kind!=="component"||T("dock:is-locked"))return;const i=D(),r=Je(i,a,t,s,{bound:n});r!==i&&oe(r)}function Pe(){const e=o.rows.find(t=>t.id===H);return e?.kind==="antlers"&&!T("dock:is-locked")?e:null}function X(e,t){const s=Pe();if(!s)return;const n=D(),a=t(n,s);a!==n&&(oe(a),P(e))}function bt(e,t,s,n){const a=o.rows.find(u=>u.id===H);if(a?.kind!=="component"||T("dock:is-locked"))return;const i=D(),r=Je(i,a,t,s,{bound:n});r!==i&&(oe(r),P(e))}function nr(e,t){X(e,(s,n)=>n.antlers==="loop"?qe(s,n,n.loopKind==="collection"?"collection":"field",t):wa(s,n,t))}function or(e,t){const s=Pe();if(!s||s.antlers!=="loop")return;const n=s.loopKind==="collection"?"collection":"field";if(t!==n){if(t==="collection"){const a=on(e)[0]?.handle;if(!a)return;X(e,(i,r)=>qe(i,r,"collection",a));return}X(e,(a,i)=>qe(a,i,"field",i.handle||"items"))}}function sr(e,t){X(e,(s,n)=>La(s,n,t))}function ar(e,t){if(!e||!t||t.kind==="component"||Ft(t.tag))return null;const s=Un(e,t);if(s<t.openTo)return null;const n=e.lastIndexOf(`
`,s-1)+1;return e.slice(n,s).trim()===""&&n>t.openTo?n-1:s}function tt(e,t,s){if(Ce)return;const n=(s||o.rows).find(a=>a.id===t);n&&(H=t,o.rows.forEach(a=>{a.current=a.id===t}),ze(e,n),!Qe()&&(T("dock:reveal-html",{from:n.from,to:n.to,caret:ar(D(),n)}),T("dock:tw-follow"),ee({source:ne,type:te.SVE_HTML_PICK_FOCUS,path:n.path},e)))}function rr(e,t){if(!t)return"";const s=[],n=(a,i)=>{for(const r of a||[]){const u=i||r.path===e;r.kind==="component"&&r.src===t&&s.push({path:r.path,inside:u}),n(r.children,u)}};return n(he,!1),(s.find(a=>a.inside)||s[0])?.path||""}function ir(e,t){if(!t||!B(e.document))return;fe=!1,qa(t),P(e);const s=o.rows.find(n=>n.path===t);s&&(tt(e,s.id,o.rows),e.setTimeout(()=>{B(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function We(e){if(Te)return;const t=()=>{o.editingId||o.dragging||(e.clearTimeout(xe),xe=e.setTimeout(()=>{B(e.document)&&P(e)},80))},s=()=>t();Te=It("dock:html-changed",t),e.document.addEventListener("sve-page-structure",s),Ve=()=>{e.document.removeEventListener("sve-page-structure",s)}}function lr(e){Te?.(),Te=null,Ve?.(),Ve=null,e?.clearTimeout?.(xe),xe=0}function nt(e){const t=B(e.document);if(ee({source:ne,type:te.SVE_HTML_PICK,on:!1},e),lr(e),A.forget(),O.callOpen=!1,O.callStore=null,Ze(e),Le(),G(),qn(e),H=null,o.inspect=null,o.editingId=null,o.draft="",o.sections=[],o.pageBuilder=!1,K="",e?.clearTimeout?.(ue),!t){Be(e);return}t.remove(),Xe.headerTab==="html_tree"&&xn(e,null),Sn(e),Et(e),Lt(e),Be(e)}function mr(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=ke,be(t,Ot,{title:f(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>nt(e)))}function gr(e){We(e),P(e)}function cr(e){const t=e.document;if(!Cn(e,"html_tree"))return;if(B(t)){We(e),P(e);return}if(!Zt(t))return;fe=!0,j.clear(),$n(e,[ke]);const s=t.createElement("div");s.id=ke,s.style.cssText=Pn,be(s,Ot,{title:f(e,"html_tree")}),s.querySelector("[data-sve-close]")?.addEventListener("click",()=>nt(e)),En(e,s),Et(e),Lt(e),Be(e),We(e),P(e)}function yr(e){if(B(e.document)){nt(e);return}cr(e)}Mt("html-tree:from-preview",({path:e,src:t}={})=>{At(window,e)||ir(window,rr(e,t)||e)});Mt("html-tree:arm-pick",e=>{const t=window;return e?(tn(t,Ge(D())),!0):(B(t.document)||ee({source:ne,type:te.SVE_HTML_PICK,on:!1},t),!0)});function kr(){Z.clear(),le.clear(),pe.length=0}export{Ia as HTML_TREE_STYLE_ID,vr as armHtmlTreePrefetch,kr as clearHtmlTreeTemplates,G as closeHtmlTreeMenu,nt as closeHtmlTreePanel,Ha as ensureHtmlTreeStyles,mr as fillHtmlTreePane,H as htmlTreeActiveId,B as htmlTreePanel,xe as htmlTreeTimer,Te as htmlTreeUnhook,cr as openHtmlTreePanel,P as renderHtmlTree,gr as showHtmlTreePane,lr as stopWatchHtmlTreeDock,yr as toggleHtmlTreePanel,We as watchHtmlTreeDock};
