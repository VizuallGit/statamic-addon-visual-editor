const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-D8Xdoe3O.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{_ as G,k as M,aj as sn,a_ as o,u as d,o as v,a as g,b as T,t as C,F as I,d as B,f as bt,g as w,e as _t,s as b,q as N,x as an,a$ as me,b0 as rn,l as Tt,b1 as ln,n as cn,b2 as dn,y as _,h as f,j as J,Q as un,J as ge,b3 as nt,b4 as De,a1 as $e,M as hn,K as Ue,b5 as xt,b6 as pn,b7 as fn,B as se,w as Fe,v as St,p as Ct,b8 as vn,i as wt,b9 as ot,ba as mn,bb as gn,bc as Pt,z as Q,N as kn,G as yn,aD as We,ak as Oe,aP as bn,ag as _n,aN as $t,aO as Et,ab as Tn,S as ke,U as ye,O as xn,aM as Sn,ah as Cn,ai as wn,bd as st,A as Lt,ar as It,as as Be,I as Pn,be as $n,aR as En,aS as Ln,aq as In,bf as Hn,aa as Ht,aJ as Mn,az as An}from"./addon-D5tTnrf2.js";import{M as ee,S as te}from"./protocol-D3FYhCm9.js";import{C as D,D as Rn,E as Xe,F as Dn,t as Fn,G as Ye,u as On,y as Bn,b as Ze,k as jn,I as Mt,o as Kn,J as At,K as Rt,L as Vn,H as qn,M as Ge,N as Dt,O as Nn,h as zn,c as Un,Q as Wn,R as Xn,S as Yn,U as Zn,V as Gn,W as Jn,X as Qn,Y as eo,Z as to,_ as no}from"./tw-classes-DeKwUYZI.js";import{a as oo}from"./html-pick-align-CK-9iH9_.js";import"./ai-text-icon-B7uCWIwa.js";const so={key:0,class:"sve-ht-inspect"},ao={class:"sve-ht-inspect__head"},ro={key:0,class:"sve-ht-inspect__note"},io={key:2,class:"sve-ht-inspect__props"},lo={class:"sve-ht-inspect__proplabel"},co={key:0},uo=["value","disabled","onChange"],ho={value:""},po=["value"],fo=["value"],vo=["value","placeholder","onChange"],mo=["title","disabled","onClick"],go=["title","disabled","onClick"],ko={key:0,class:"sve-ht-inspect__seg"},yo=["data-active","disabled","onClick"],bo=["value","disabled"],_o={key:0,value:""},To=["value"],xo={key:2,class:"sve-ht-inspect__box"},So=["value","placeholder","disabled","onKeydown"],Co=["title","disabled"],wo={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Po=["value","disabled"],$o=["value"],Eo={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},Lo=["value","placeholder","disabled"],Io=["title","disabled"],Ho={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Mo=["value","placeholder","disabled"],Ao={key:4,class:"sve-ht-inspect__add"},Ro=["disabled","onClick"],Le='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',Do='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',Fo={__name:"HtmlTreeInspector",setup(e){const t=M(null);sn(t,u=>o.onPropHost?.(u||null));const s=M(null),n=M(null);function a(u){o.onInspectCommit?.(u.target.value)}function i(u,l,h){!u||!l||(u.value=l,u.focus(),u.setSelectionRange(l.length,l.length),h(l))}function r(u,l){o.onInspectData?.(u.currentTarget,h=>o.onPropValue?.(l.handle,h,!0))}function c(u){o.onInspectData?.(u.currentTarget,l=>i(s.value,l,h=>o.onInspectCommit?.(h)))}function m(u){o.onInspectData?.(u.currentTarget,l=>i(n.value,l,h=>o.onLoopSortField?.(h)))}return(u,l)=>d(o).inspect?(v(),g("div",so,[T("div",ao,C(d(o).inspect.title),1),d(o).inspect.mode==="note"?(v(),g("div",ro,C(d(o).inspect.note),1)):d(o).inspect.mode==="statamic"?(v(),g("div",{key:1,ref_key:"propHost",ref:t,class:"sve-ht-inspect__form"},null,512)):d(o).inspect.mode==="props"?(v(),g("div",io,[(v(!0),g(I,null,B(d(o).inspect.rows,h=>(v(),g("label",{key:h.handle,class:"sve-ht-inspect__prop"},[T("span",lo,[bt(C(h.label)+" ",1),h.bound?(v(),g("em",co,":")):w("",!0)]),T("span",{class:_t(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":h.type==="select"||h.type==="link"}])},[h.type==="select"&&!h.bound?(v(),g("select",{key:0,value:h.value,disabled:!d(o).canEdit,onChange:x=>d(o).onPropValue?.(h.handle,x.target.value,!1)},[T("option",ho,C(h.placeholder||d(o).inspect.inheritLabel),1),h.value&&!h.options.includes(h.value)?(v(),g("option",{key:0,value:h.value},C(h.value),9,po)):w("",!0),(v(!0),g(I,null,B(h.options,x=>(v(),g("option",{key:x,value:x},C(x),9,fo))),128))],40,uo)):(v(),g("input",{key:1,type:"text",value:h.value,placeholder:h.placeholder||d(o).inspect.inheritLabel,onChange:x=>d(o).onPropValue?.(h.handle,x.target.value,h.bound)},null,40,vo)),h.type==="link"?(v(),g("button",{key:2,type:"button","data-sve-ht-data":"",title:d(o).pageTitle,disabled:!d(o).canEdit,onClick:x=>d(o).onPropPage?.(x.currentTarget,h.handle),innerHTML:Do},null,8,mo)):w("",!0),T("button",{type:"button","data-sve-ht-data":"",title:d(o).dataTitle,disabled:!d(o).canEdit,onClick:x=>r(x,h),innerHTML:Le},null,8,go)],2)]))),128))])):(v(),g(I,{key:3},[d(o).inspect.mode==="loop"?(v(),g("div",ko,[(v(!0),g(I,null,B(d(o).inspect.kinds,h=>(v(),g("button",{key:h.id,type:"button","data-active":h.id===d(o).inspect.loopKind?"":void 0,disabled:!d(o).canEdit,onClick:x=>d(o).onLoopKind?.(h.id)},C(h.label),9,yo))),128))])):w("",!0),d(o).inspect.mode==="loop"&&d(o).inspect.loopKind==="collection"?(v(),g("select",{key:d(o).inspect.key+":"+d(o).inspect.value,value:d(o).inspect.value,disabled:!d(o).canEdit,onChange:a},[d(o).inspect.value?w("",!0):(v(),g("option",_o,C(d(o).inspect.placeholder),1)),(v(!0),g(I,null,B(d(o).inspect.collections,h=>(v(),g("option",{key:h.handle,value:h.handle},C(h.title),9,To))),128))],40,bo)):(v(),g("div",xo,[(v(),g("input",{ref_key:"field",ref:s,key:d(o).inspect.key,type:"text",value:d(o).inspect.value,placeholder:d(o).inspect.placeholder,disabled:!d(o).canEdit,spellcheck:"false",onKeydown:[l[0]||(l[0]=b(()=>{},["stop"])),N(b(a,["prevent"]),["enter"])],onBlur:a},null,40,So)),T("button",{type:"button","data-sve-ht-data":"",title:d(o).dataTitle,disabled:!d(o).canEdit,innerHTML:Le,onMousedown:l[1]||(l[1]=b(()=>{},["prevent"])),onClick:b(c,["stop","prevent"])},null,40,Co)])),d(o).inspect.sort?(v(),g(I,{key:3},[T("div",wo,C(d(o).inspect.sort.title),1),(v(),g("select",{key:d(o).inspect.key+":dir:"+d(o).inspect.sort.dir,value:d(o).inspect.sort.dir,disabled:!d(o).canEdit,onChange:l[2]||(l[2]=h=>d(o).onLoopSortDir?.(h.target.value))},[(v(!0),g(I,null,B(d(o).inspect.sort.dirs,h=>(v(),g("option",{key:h.id,value:h.id},C(h.label),9,$o))),128))],40,Po)),d(o).inspect.sort.needsField?(v(),g("div",Eo,[(v(),g("input",{ref_key:"sortField",ref:n,key:d(o).inspect.key+":field",type:"text",value:d(o).inspect.sort.field,placeholder:d(o).inspect.sort.placeholder,disabled:!d(o).canEdit,spellcheck:"false",onKeydown:[l[3]||(l[3]=b(()=>{},["stop"])),l[4]||(l[4]=N(b(h=>d(o).onLoopSortField?.(h.target.value),["prevent"]),["enter"]))],onBlur:l[5]||(l[5]=h=>d(o).onLoopSortField?.(h.target.value))},null,40,Lo)),d(o).inspect.sort.pickable?(v(),g("button",{key:0,type:"button","data-sve-ht-data":"",title:d(o).dataTitle,disabled:!d(o).canEdit,innerHTML:Le,onMousedown:l[6]||(l[6]=b(()=>{},["prevent"])),onClick:b(m,["stop","prevent"])},null,40,Io)):w("",!0)])):w("",!0),T("div",Ho,C(d(o).inspect.limit.title),1),(v(),g("input",{key:d(o).inspect.key+":limit",type:"number",min:"1",value:d(o).inspect.limit.value,placeholder:d(o).inspect.limit.placeholder,disabled:!d(o).canEdit,onKeydown:[l[7]||(l[7]=b(()=>{},["stop"])),l[8]||(l[8]=N(b(h=>d(o).onLoopLimit?.(h.target.value),["prevent"]),["enter"]))],onBlur:l[9]||(l[9]=h=>d(o).onLoopLimit?.(h.target.value))},null,40,Mo))],64)):w("",!0),d(o).inspect.branches?.length?(v(),g("div",Ao,[(v(!0),g(I,null,B(d(o).inspect.branches,h=>(v(),g("button",{key:h.id,type:"button",disabled:!d(o).canEdit,onClick:x=>d(o).onAddBranch?.(h.id)},C(h.label),9,Ro))),128))])):w("",!0)],64))])):w("",!0)}},Oo=G(Fo,[["__scopeId","data-v-26254b75"]]),Bo={class:"sve-html-tree"},jo={class:"sve-pane-bar","data-sve-pane-bar":""},Ko={"data-sve-right-title":""},Vo={key:1,class:"sve-tree-exit"},qo=["title"],No=["title"],zo={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){return(t,s)=>(v(),g("div",Bo,[T("div",jo,[T("div",Ko,C(e.title),1),s[1]||(s[1]=an('<div data-sve-right-actions data-v-d5442e66><button type="button" data-sve-right-pin aria-pressed="false" data-v-d5442e66></button><button type="button" data-sve-close aria-label="Close" data-v-d5442e66><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-d5442e66><path d="M18 6 6 18" data-v-d5442e66></path><path d="m6 6 12 12" data-v-d5442e66></path></svg></button></div>',1))]),d(D).inSidebar?w("",!0):(v(),me(Rn,{key:0})),s[2]||(s[2]=T("div",{"data-sve-html-tree-list":""},null,-1)),rn(Oo),d(o).exitOpen&&!d(D).inSidebar?(v(),g("div",Vo,[T("span",{class:"sve-tree-exit__name",title:d(o).exitName},C(d(o).exitName),9,qo),T("button",{type:"button",class:"sve-tree-exit__go",title:d(o).exitTitle,onClick:s[0]||(s[0]=n=>d(o).onExit?.())},C(d(o).exitLabel),9,No)])):w("",!0)]))}},Ft=G(zo,[["__scopeId","data-v-d5442e66"]]),Uo={class:"sve-fs__bar"},Wo={class:"sve-fs__title"},Xo={key:0,class:"sve-fs__sub"},Yo=["aria-label","title"],Zo={class:"sve-fs__body"},Go={key:0,class:"sve-fs__loading"},Jo=["src","title"],at="sve-fieldset-drawer-width",rt=380,Qo={__name:"FieldsetOverlay",props:{heading:{type:String,required:!0},subtitle:{type:String,default:""},src:{type:String,required:!0},closeLabel:{type:String,required:!0},onClose:{type:Function,required:!0},onSaved:{type:Function,default:null}},setup(e){const t=e,s=M(!0),n=M(null),a=M(!1);function i(){return Math.max(rt,window.innerWidth-220)}function r(y){return Math.min(Math.max(Math.round(y),rt),i())}function c(){try{const y=Number(window.localStorage.getItem(at));if(y>0)return r(y)}catch{}return r(Math.min(992,window.innerWidth*.55))}const m=M(c()),u=M(!1);function l(y){m.value=r(window.innerWidth-y.clientX)}function h(y){u.value=!1,y.target?.releasePointerCapture?.(y.pointerId),window.removeEventListener("pointermove",l),window.removeEventListener("pointerup",h);try{window.localStorage.setItem(at,String(m.value))}catch{}}function x(y){y.preventDefault(),u.value=!0,y.target?.setPointerCapture?.(y.pointerId),window.addEventListener("pointermove",l),window.addEventListener("pointerup",h)}function P(){s.value=!1;try{const y=n.value?.contentDocument;if(!y||y.getElementById("sve-fs-trim"))return;const p=y.createElement("style");p.id="sve-fs-trim",p.textContent=`
      nav.nav-main { display: none !important; }
      header:has(+ main) { display: none !important; }
      main { top: 0 !important; min-height: 100vh !important; }
      /* Our own AI launcher rides along on every Control Panel page. In a panel
         about fields it is one floating button too many, and it covers the
         Save. */
      #__sve-ai-launcher { display: none !important; }
    `,y.head.appendChild(p)}catch{}}function L(y){const p=String(y?.config?.method||"").toUpperCase(),k=String(y?.config?.url||""),S=Number(y?.status||0);return(p==="PATCH"||p==="PUT")&&S>=200&&S<300&&/\/fields\/fieldsets\//.test(k)&&!/\/edit(?:\?|$)/.test(k)}function pe(y){const p=y?.Statamic?.$axios||y?.axios;return!p?.interceptors?.response||y.__sveFsSaveWatch?!!y?.__sveFsSaveWatch:(y.__sveFsSaveWatch=!0,p.interceptors.response.use(k=>(L(k)&&t.onSaved?.(),k)),!0)}function K(){P();const y=n.value?.contentWindow;pe(y)||y?.setTimeout?.(()=>pe(y),0)}function oe(y){y.key==="Escape"&&t.onClose()}Tt(()=>{document.addEventListener("keydown",oe),requestAnimationFrame(()=>{a.value=!0})}),ln(()=>document.removeEventListener("keydown",oe));function fe(y){y.target===y.currentTarget&&t.onClose()}return(y,p)=>(v(),g("div",{class:"sve-fs-overlay",onClick:fe},[T("div",{class:_t(["sve-fs",{"is-shown":a.value,"is-dragging":u.value}]),style:cn({width:m.value+"px","--sve-fs-grip":d(dn)}),onClick:p[1]||(p[1]=b(()=>{},["stop"]))},[T("div",{class:"sve-fs__grip",role:"separator","aria-orientation":"vertical",onPointerdown:x},null,32),T("div",Uo,[T("div",Wo,[bt(C(e.heading)+" ",1),e.subtitle?(v(),g("span",Xo,C(e.subtitle),1)):w("",!0)]),T("button",{type:"button","aria-label":e.closeLabel,title:e.closeLabel,onClick:p[0]||(p[0]=(...k)=>e.onClose&&e.onClose(...k))},[...p[2]||(p[2]=[T("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round"},[T("path",{d:"M18 6 6 18"}),T("path",{d:"m6 6 12 12"})],-1)])],8,Yo)]),T("div",Zo,[s.value?(v(),g("div",Go,"…")):w("",!0),T("iframe",{ref_key:"frame",ref:n,src:e.src,title:e.heading,onLoad:K},null,40,Jo)])],6)]))}},es=G(Qo,[["__scopeId","data-v-9b80a022"]]),ts="/!/sve/section-types";function ns(e){return String(e.Statamic?.$config?.get?.("cpRoot")||"/cp").replace(/\/+$/,"")}function os(){const e=_("dock:current-type");return typeof e!="string"||!e||e.startsWith("view:")?null:e}async function ss(e,t){const s=await e.fetch(ts,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!s.ok)throw new Error(`section-types ${s.status}`);const a=((await s.json()).types||[]).find(i=>i?.handle===t);return a?{fieldset:a.fieldset||null,display:a.display||t}:null}function as(e,t){const s=String(e);let n=s;try{n=decodeURIComponent(s)}catch{}return n===t||n.includes(`set=${t}`)||n.endsWith(`::${t}`)||n.includes(`::${t}::`)}function rs(e,t){if(e){if(typeof e.keys=="function"&&typeof e.delete=="function"){for(const s of[...e.keys()])as(s,t)&&e.delete(s);return}e.delete?.(t)}}function is(e,t){rs(fn,t),_("dock:reset-data-vars",t)}async function it(e,t){if(await un("sections"),!e.sve?.fetchSetMeta||!ge||!nt)return 0;is(e,t);const n=await De(e,t);if(!n)return 0;const a=$e(e),i=n.defaults&&typeof n.defaults=="object"?n.defaults:{};let r=0;for(const c of ge(e.document)){const m=hn(Ue(c.values),a);if(!Array.isArray(m))continue;let u=!1;const l=m.map(h=>{if(h?.type!==t)return h;const x={};for(const[P,L]of Object.entries(i))P in h||(x[P]=L);return Object.keys(x).length?(u=!0,{...h,...x}):h});u&&c.setFieldValue(a,l);for(const h of u?l:m)h?.type!==t||!h._id||(nt(c,a,h,xt(h,n.new||{},n.defaults)),r++)}return Array.isArray(n.definitions)&&pn(t,n.definitions),r}function ls(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function cs(e,t,{onClose:s}={}){(async()=>{let n=null;try{n=await ss(e,t)}catch{e.Statamic?.$toast?.error(f(e,"section_fields_failed"));return}if(!n?.fieldset){e.Statamic?.$toast?.error(f(e,"section_fields_none"));return}let a=Promise.resolve(),i=!1;return J(e.document,es,{heading:f(e,"section_fields"),subtitle:n.display,src:`${ns(e)}/fields/fieldsets/${encodeURIComponent(n.fieldset)}/edit`,closeLabel:f(e,"close"),onSaved:()=>{a=it(e,t).then(()=>{i=!0}).catch(()=>{})},onClose:()=>{(async()=>{if(await a,!i)try{await it(e,t)}catch{}_("dock:refresh-preview"),s?.()})()}})})()}const ds=["title"],us={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},hs={key:2,"data-sve-ht-letter":""},ps=["innerHTML"],fs=["title"],vs=["title"],ms={key:1,"data-sve-ht-kind":""},gs={key:3,"data-sve-ht-name":""},ks={key:4,"data-sve-ht-actions":""},ys=["disabled","title","innerHTML"],bs=["disabled","title"],_s=["disabled","title"],Ts=["disabled","title"],xs=["data-sve-ht-id"],Ss='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',Cs='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',ws='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Ps='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',$s='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',Es='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',Ls={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0}},setup(e){const t=ls(window),s=f(window,"section_fields");function n(){const u=os();if(!u){window.Statamic?.$toast?.error(f(window,"section_fields_none"));return}cs(window,u)}function a(u){return u.kind==="component"?u.src?`partial:${u.src}`:u.tag:u.name?`${u.tag} ${u.name}`:u.tag}function i(u){return!!u.section}function r(u){if(i(u)){o.onSection?.(u.section);return}o.onSelect?.(u.id)}function c(u){const l={"data-sve-ht-id":u.id};return u.current&&(l["data-sve-ht-current"]=""),u.hidden&&(l["data-sve-ht-hidden"]=""),l["data-sve-ht-cat"]=u.cat||"other",l["data-sve-ht-depth"]=String(u.depth),i(u)&&(l["data-sve-ht-sec"]=""),!i(u)&&o.dropId===u.id&&o.dropPlace&&(l["data-sve-ht-drop"]=o.dropPlace),l}function m(u){return!u.hidden||u.wrapFrom!=null}return(u,l)=>(v(),g(I,null,[T("div",se({"data-sve-ht-row":""},c(e.row),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:l[26]||(l[26]=h=>r(e.row)),onDblclick:l[27]||(l[27]=b(h=>i(e.row)?null:d(o).onRename?.(e.row.id),["prevent"])),onKeydown:[l[28]||(l[28]=N(b(h=>r(e.row),["prevent"]),["enter"])),l[29]||(l[29]=N(b(h=>r(e.row),["prevent"]),["space"]))],onPointerdown:l[30]||(l[30]=h=>i(e.row)?null:d(o).onPointerDown?.(h,e.row.id)),onContextmenu:l[31]||(l[31]=b(h=>i(e.row)?null:d(o).onContext?.(h,e.row.id),["prevent","stop"]))}),[l[32]||(l[32]=T("span",{"data-sve-ht-indent":"","aria-hidden":"true"},null,-1)),e.row.hasChildren||e.row.emptyBlock?(v(),g("button",se({key:0,type:"button","data-sve-ht-twist":""},e.row.shut?{"data-sve-ht-shut":""}:{},{innerHTML:Cs,onClick:l[0]||(l[0]=b(h=>i(e.row)?d(o).onSection?.(e.row.section):d(o).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:l[1]||(l[1]=b(()=>{},["stop"])),onDblclick:l[2]||(l[2]=b(()=>{},["stop"]))}),null,16)):(v(),g("span",us)),e.row.letter?(v(),g("span",hs,C(e.row.letter),1)):(v(),g("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,ps)),T("span",{"data-sve-ht-text":"",title:d(o).renameTitle},[!e.row.kind&&!i(e.row)?(v(),g("button",{key:0,type:"button","data-sve-ht-tag":"",title:d(o).tagTitle,onClick:l[3]||(l[3]=b(()=>{},["stop","prevent"])),onPointerdown:l[4]||(l[4]=b(()=>{},["stop"])),onDblclick:l[5]||(l[5]=b(h=>d(o).onTagChange?.(h,e.row.id),["stop","prevent"]))},C(e.row.tag),41,vs)):(v(),g("span",ms,C(e.row.tag),1)),d(o).editingId===e.row.id&&!i(e.row)?Fe((v(),g("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":l[6]||(l[6]=h=>d(o).draft=h),onMousedown:l[7]||(l[7]=b(()=>{},["stop"])),onPointerdown:l[8]||(l[8]=b(()=>{},["stop"])),onClick:l[9]||(l[9]=b(()=>{},["stop"])),onDblclick:l[10]||(l[10]=b(()=>{},["stop"])),onKeydown:[l[11]||(l[11]=b(()=>{},["stop"])),l[12]||(l[12]=N(b(h=>d(o).onRenameCommit?.(),["prevent"]),["enter"])),l[13]||(l[13]=N(b(h=>d(o).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:l[14]||(l[14]=h=>d(o).onRenameCommit?.())},null,544)),[[St,d(o).draft]]):(v(),g("span",gs,C(e.row.name),1))],8,fs),i(e.row)?w("",!0):(v(),g("span",ks,[m(e.row)?(v(),g("button",{key:0,type:"button","data-sve-ht-eye":"",disabled:!d(o).canEdit,title:d(o).canEdit?e.row.hidden?d(o).showTitle:d(o).hideTitle:d(o).lockedTitle,innerHTML:e.row.hidden?Ps:ws,onClick:l[15]||(l[15]=b(h=>d(o).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:l[16]||(l[16]=b(()=>{},["stop"])),onDblclick:l[17]||(l[17]=b(()=>{},["stop"]))},null,40,ys)):w("",!0),d(t)&&e.row.depth===0?(v(),g("button",{key:1,type:"button","data-sve-ht-fields":"",disabled:!d(o).canEdit,title:d(o).canEdit?d(s):d(o).lockedTitle,innerHTML:Ss,onClick:b(n,["stop","prevent"]),onPointerdown:l[18]||(l[18]=b(()=>{},["stop"])),onDblclick:l[19]||(l[19]=b(()=>{},["stop"]))},null,40,bs)):w("",!0),T("button",{type:"button","data-sve-ht-dup":"",disabled:!d(o).canEdit,title:d(o).canEdit?d(o).duplicateTitle:d(o).lockedTitle,innerHTML:$s,onClick:l[20]||(l[20]=b(h=>d(o).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:l[21]||(l[21]=b(()=>{},["stop"])),onDblclick:l[22]||(l[22]=b(()=>{},["stop"]))},null,40,_s),T("button",{type:"button","data-sve-ht-del":"",disabled:!d(o).canEdit,title:d(o).canEdit?d(o).deleteTitle:d(o).lockedTitle,innerHTML:Es,onClick:l[23]||(l[23]=b(h=>d(o).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:l[24]||(l[24]=b(()=>{},["stop"])),onDblclick:l[25]||(l[25]=b(()=>{},["stop"]))},null,40,Ts)]))],16,ds),e.row.emptyBlock&&!e.row.shut?(v(),g("div",se({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},d(o).dropId===e.row.id&&d(o).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),C(d(o).slotText),17,xs)):w("",!0)],64))}},Ie=G(Ls,[["__scopeId","data-v-fd5ec8eb"]]),Is={class:"sve-dialog__title"},Hs={for:"sve-new-section-group"},Ms=["value"],As={for:"sve-new-section-name"},Rs=["placeholder"],Ds={key:0,class:"sve-dialog__note"},Fs={class:"sve-dialog__actions"},Os=["disabled"],Bs=["disabled"],js={__name:"NewSectionPrompt",props:{heading:{type:String,required:!0},groupLabel:{type:String,required:!0},nameLabel:{type:String,required:!0},placeholder:{type:String,default:""},note:{type:String,default:""},groups:{type:Array,required:!0},cancelLabel:{type:String,required:!0},saveLabel:{type:String,required:!0},onOk:{type:Function,required:!0},onClose:{type:Function,required:!0}},setup(e){const t=e,s=M(""),n=M(t.groups[0]?.key??""),a=M(null),i=M(!1);Tt(()=>Ct(()=>a.value?.focus()));function r(){const u=s.value.trim();if(!u||!n.value||i.value){a.value?.focus();return}i.value=!0,t.onOk(u,n.value)}function c(u){u.target===u.currentTarget&&t.onClose()}function m(u){u.key==="Enter"?r():u.key==="Escape"&&t.onClose()}return(u,l)=>(v(),g("div",{class:"sve-dialog-overlay",onClick:c},[T("div",{class:"sve-dialog",onClick:l[3]||(l[3]=b(()=>{},["stop"]))},[T("div",Is,C(e.heading),1),T("label",Hs,C(e.groupLabel),1),Fe(T("select",{id:"sve-new-section-group","onUpdate:modelValue":l[0]||(l[0]=h=>n.value=h),onKeydown:m},[(v(!0),g(I,null,B(e.groups,h=>(v(),g("option",{key:h.key,value:h.key},C(h.display),9,Ms))),128))],544),[[vn,n.value]]),T("label",As,C(e.nameLabel),1),Fe(T("input",{id:"sve-new-section-name",ref_key:"input",ref:a,"onUpdate:modelValue":l[1]||(l[1]=h=>s.value=h),type:"text",placeholder:e.placeholder,onKeydown:m},null,40,Rs),[[St,s.value]]),e.note?(v(),g("p",Ds,C(e.note),1)):w("",!0),T("div",Fs,[T("button",{type:"button",class:"is-cancel",disabled:i.value,onClick:l[2]||(l[2]=(...h)=>e.onClose&&e.onClose(...h))},C(e.cancelLabel),9,Os),T("button",{type:"button",class:"is-primary",disabled:i.value,onClick:r},C(e.saveLabel),9,Bs)])])]))}},Ks=G(js,[["__scopeId","data-v-d21be545"]]),Ot="/!/sve/section-types";async function Vs(e){const t=await e.fetch(Ot,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!t.ok)throw new Error(`section-types ${t.status}`);const s=await t.json(),n=new Map;for(const a of s.types||[])a?.group&&!n.has(a.group)&&n.set(a.group,a.group_display||a.group);return[...n].map(([a,i])=>({key:a,display:i}))}async function qs(e,{display:t,group:s}){const n=await e.fetch(Ot,{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":wt(e),Accept:"application/json"},credentials:"same-origin",body:JSON.stringify({display:t,group:s})}),a=await n.json().catch(()=>({}));if(!n.ok){const i=new Error(a.error||`section-types ${n.status}`);throw i.reason=a.error,i}return a}async function Ns(e,t,s=null){if(!t||typeof De!="function"||typeof ot!="function")return null;const n=await De(e,t);if(!n)return null;const a=mn(),i=gn(e,"page",{handle:t},n?.defaults,a),r=xt(i,n?.new||{},n?.defaults);return ot(e,e.document,s,i,r)?i:null}const lt=700,zs=17;function Us(e,t){const s=(t||[]).filter(Boolean);if(!s.length)return;let n=0;const a=()=>{n+=1;const i=Pt(e),r=i?s.some(c=>i.querySelector(`[data-sid="${CSS.escape(c)}"]`)):!0;r&&Q({source:te,type:ee.SVE_ACTIVATE,ids:s},e),(r?!i&&n<6:n<zs)&&e.setTimeout(a,lt)};e.setTimeout(a,lt)}function Ws(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function Xs(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){(async()=>{let i=[];try{i=await Vs(e)}catch(c){n?.(c),e.Statamic?.$toast?.error(f(e,"section_new_failed"));return}if(!i.length){n?.(new Error("no groups")),e.Statamic?.$toast?.error(f(e,"section_new_failed"));return}const r=J(e.document,Ks,{heading:f(e,"section_new"),groupLabel:f(e,"section_new_group"),nameLabel:f(e,"section_new_name"),placeholder:f(e,"section_new_placeholder"),note:f(e,"section_new_note"),groups:i,cancelLabel:f(e,"cancel"),saveLabel:f(e,"section_new_create"),onClose:a,onOk:(c,m)=>{(async()=>{try{const u=await qs(e,{display:c,group:m});r.dismiss(),e.Statamic?.$toast?.success(f(e,"section_created",{name:u.section?.display||c})),e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"));const l=await Ns(e,u.section?.handle,t);!l&&u.section?.handle&&_("dock:open-template",u.section.handle),s?.({...u,uid:l?._visual_id||""})}catch(u){r.dismiss(),e.Statamic?.$toast?.error(f(e,u.reason==="bad_name"?"section_new_bad_name":"section_new_failed")),n?.(u)}})()}})})()}const Ys=["data-sve-ht-look"],Zs={key:0,class:"sve-ht-empty"},Gs={key:0,class:"sve-ht-empty"},Js=["title","aria-label"],Qs={__name:"HtmlTreeList",setup(e){const t=Ws(window),s=f(window,"section_new"),n=M(!1);function a(){n.value=!1}async function i(c){if(c)for(let m=0;m<20;m+=1){await Ct(),o.onRefresh?.();const u=o.sections.find(l=>l.uid===c);if(u){o.onSection?.(c),Us(window,u.ids);return}await new Promise(l=>setTimeout(l,50))}}function r(){n.value||(n.value=!0,Xs(window,{afterUid:o.sections.length?o.sections[o.sections.length-1].uid:null,onDone:c=>{a(),i(c?.uid)},onError:a,onClose:a}))}return(c,m)=>(v(),g("div",se({class:"sve-ht-root","data-sve-ht-look":d(o).look},d(o).dragging?{"data-sve-ht-dragging":""}:{}),[!d(o).rows.length&&!d(o).sections.length?(v(),g("div",Zs,C(d(o).emptyText),1)):w("",!0),d(o).sections.length?(v(!0),g(I,{key:1},B(d(o).sections,u=>(v(),g("div",se({key:u.uid},{ref_for:!0},u.current?{"data-sve-ht-branch":""}:{}),[u.ready?(v(),g(I,{key:0},[(v(!0),g(I,null,B(d(o).rows,l=>(v(),me(Ie,{key:l.id,row:l},null,8,["row"]))),128)),d(o).rows.length?w("",!0):(v(),g("div",Gs,C(d(o).emptyText),1))],64)):(v(),me(Ie,{key:1,row:u.row},null,8,["row"]))],16))),128)):d(o).rows.length?(v(!0),g(I,{key:2},B(d(o).rows,u=>(v(),me(Ie,{key:u.id,row:u},null,8,["row"]))),128)):w("",!0),d(t)&&(d(o).sections.length||d(o).pageBuilder)?(v(),g("button",{key:3,type:"button",class:"sve-ht-new",title:d(s),"aria-label":d(s),onClick:r},[...m[0]||(m[0]=[T("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round"},[T("path",{d:"M12 5v14"}),T("path",{d:"M5 12h14"})],-1)])],8,Js)):w("",!0)],16,Ys))}},ct=G(Qs,[["__scopeId","data-v-6f05ff4a"]]);let He=null;function ea(e){return He||(He=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{pages:[]}).then(t=>Array.isArray(t.pages)?t.pages:[]).catch(()=>[])),He}let be=null;function Me(){be?.dismiss(),be=null}function ta(e,t,s){Me();const n=t?.getBoundingClientRect?.(),a={x:n?n.left:0,y:n?n.bottom+4:0};ea(e).then(i=>{const r=i.length?i.map(c=>({label:c.title||c.url,onPick:()=>{Me(),s(c.url)}})):[{label:f(e,"component_props_pages_none"),onPick:null}];Me(),be=J(e.document,Xe,{items:r,x:a.x,y:a.y,onClose:()=>{be=null}})})}const Bt="sve-html-tree-labels";function jt(){try{const e=globalThis.localStorage?.getItem(Bt);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function na(e){try{globalThis.localStorage?.setItem(Bt,JSON.stringify(e))}catch{}}function Kt(e){return String(e||"_")}function Vt(e){const t=jt()[Kt(e)];return t&&typeof t=="object"?{...t}:{}}function oa(e,t,s){const n=s?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function sa(e,t,s,n){if(!t)return;const a=Kt(e),i=jt(),r={...i[a]||{}},c=String(s||"").replace(/\s+/g," ").trim(),m=String(n||"").trim();!c||c===m?delete r[t]:r[t]=c,Object.keys(r).length?i[a]=r:delete i[a],na(i)}const aa=/^@(media|supports|container|layer|scope)\b/i;function ra(e){const t=String(e||""),s=[];let n=0,a=0;for(;n<t.length;){if(t[n]==="{"&&t[n+1]==="{"){const c=t.indexOf("}}",n+2);n=c===-1?t.length:c+2;continue}if(t[n]==="/"&&t[n+1]==="*"){const c=t.indexOf("*/",n+2);n=c===-1?t.length:c+2;continue}if(t[n]==='"'||t[n]==="'"){const c=t[n];for(n+=1;n<t.length&&t[n]!==c;)n+=t[n]==="\\"?2:1;n+=1;continue}if(t[n]!=="{"){n+=1;continue}let i=1,r=n+1;for(;r<t.length&&i>0;){if(t[r]==="{"&&t[r+1]==="{"){const c=t.indexOf("}}",r+2);r=c===-1?t.length:c+2;continue}if(t[r]==="/"&&t[r+1]==="*"){const c=t.indexOf("*/",r+2);r=c===-1?t.length:c+2;continue}if(t[r]==='"'||t[r]==="'"){const c=t[r];for(r+=1;r<t.length&&t[r]!==c;)r+=t[r]==="\\"?2:1;r+=1;continue}t[r]==="{"?i+=1:t[r]==="}"&&(i-=1),r+=1}s.push({selector:t.slice(a,n).trim(),body:t.slice(n+1,r-1),from:a,to:r,text:t.slice(a,r).trim()}),n=r,a=r}return s}function dt(e){const t=String(e||""),s=new Set,n=new Set,a=new Set;for(const i of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const r of i[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))r&&(s.add(r),s.add(r.replace(/([:./%!#()[\],])/g,"\\$1")));for(const i of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))i[2].trim()&&n.add(i[2].trim());for(const i of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))a.add(i[1].toLowerCase());return{classes:s,ids:n,tags:a}}function ut(e,t){const s=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),n=[...s.matchAll(/\.((?:\\.|[\w-])+)/g)].map(r=>r[1]),a=[...s.matchAll(/#((?:\\.|[\w-])+)/g)].map(r=>r[1]);if(n.length||a.length){const r=c=>c.replace(/\\(.)/g,"$1");return n.every(c=>t.classes.has(c)||t.classes.has(r(c)))&&a.every(c=>t.ids.has(r(c)))}const i=[...s.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(r=>r[2].toLowerCase());return i.length>0&&i.every(r=>t.tags.has(r))}function ia(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function la(e,t,s){const n=ia(e);if(!n.length)return"keep";const a=n.filter(r=>ut(r,t));return a.length?a.length===n.length&&!n.some(r=>ut(r,s))?"move":"copy":"keep"}function qt(e,t,s){const n=String(e||""),a=dt(t),i=dt(s),r=[],c=[];let m=0;for(const u of ra(n)){const l=n.slice(u.from,u.to),h=l.match(/^\s*/)[0];if(m=u.to,aa.test(u.selector)){const P=qt(u.body,t,s);P.move.trim()&&r.push(`${u.selector} {
${P.move.trim()}
}`),P.keep.trim()&&c.push(`${h}${u.selector} {
${P.keep.trim()}
}`);continue}const x=u.selector.startsWith("@")?"keep":la(u.selector,a,i);if(x==="move"){r.push(u.text);continue}x==="copy"&&r.push(u.text),c.push(l)}return c.push(n.slice(m)),{move:r.join(`

`).trim(),keep:c.join("").replace(/\n{3,}/g,`

`).trim()}}const ca="/!/sve/component";function da(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let s=null;for(const n of t){if(!n.trim())continue;const a=n.match(/^[ \t]*/)[0].length;s=s===null?a:Math.min(s,a)}return s?t.map(n=>n.slice(s)).join(`
`):t.join(`
`)}function ua(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function ha(e,t){if(!Fn(e))return"";try{return await(await yn(()=>import("./tw-compile-D8Xdoe3O.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(s){return console.error("[sve] component tailwind compile",s),""}}async function pa(e,t){const s=await e.fetch(ca,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":wt(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!s.ok){const n=new Error(String(s.status));throw n.status=s.status,n}return s.json()}function ht(e,t){const{from:s,to:n}=Dn(e,t),a=e.slice(s,n);if(!a.trim())return null;const i=e.slice(0,s)+e.slice(n),r=_("dock:css"),c=qt(typeof r=="string"?r:"",a,i);return{html:da(a),css:c.move,keepCss:c.keep,lead:ua(a),from:s,to:n}}function fa(e,t,{onDone:s,onError:n}={}){if(_("dock:is-locked")===!0)return;const a=_("dock:html");if(typeof a!="string"||!t)return;const i=ht(a,t);if(!i)return;const r=J(e.document,kn,{heading:f(e,"component_new"),nameLabel:f(e,"component_name"),placeholder:f(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:f(e,"cancel"),saveLabel:f(e,"component_create"),onOk:c=>{r.dismiss(),(async()=>{try{const m=await ha(e,i.html),u=_("dock:html"),l=typeof u=="string"&&u===a?i:ht(u,t);if(!l)return;const h=await pa(e,{name:c,html:l.html,css:l.css,js:"",tw:m}),x=_("dock:html"),P=x.slice(0,l.from)+l.lead+h.tag+x.slice(l.to);_("dock:set-html",P),l.css.trim()&&_("dock:set-css",l.keepCss),s?.(h)}catch(m){n?.(m)}})()}})}function va(e,t,s){const n=String(e||"");if(!t||t.kind!=="antlers")return n;const a=String(s||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?ya(n,t,a):t.tag==="else"||!a?n:n.slice(0,t.from)+`{{ ${t.tag} ${a} }}`+n.slice(t.openTo)}function je(e,t,s,n){return ae(e,t,{kind:s,name:n})}function ae(e,t,s={}){const n=String(e||"");if(!t||t.antlers!=="loop")return n;const a=t.loopKind==="collection"?"collection":"field",i=s.kind??a,r=String(s.name??t.expr??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(r))return n;const c=s.sortDir??t.sortDir??"",m=String(s.sortField??t.sortField??"").trim(),u=String(s.limit??t.limit??"").trim(),l=Nt(n,t);if(!l)return n;const h=i===a?t.params:"",x=i==="collection"?ma(r,m,c,u,h):ga(r,m,c,u,h),P=i==="collection"?"collection":r;return n.slice(0,t.from)+x+n.slice(t.openTo,l.from)+`{{ /${P} }}`+n.slice(l.to)}function ma(e,t,s,n,a){const i=ka(a).replace(/\bsort\s*=\s*["'][^"']*["']/g,"").replace(/\blimit\s*=\s*["']?\d+["']?/g,"").replace(/\s+/g," ").trim(),r=[`collection from="${e}"`];return s==="random"?r.push('sort="random"'):t&&r.push(`sort="${t}${s==="desc"?":desc":":asc"}"`),n&&r.push(`limit="${n}"`),i&&r.push(i),`{{ ${r.join(" ")} }}`}function ga(e,t,s,n,a){const i=String(a||"").split("|").map(c=>c.trim()).filter(c=>c&&!/^from\s*=/.test(c)&&!/^sort\s*:/.test(c)&&!/^reverse$/.test(c)&&!/^shuffle$/.test(c)&&!/^limit\s*:/.test(c)),r=[e,...i];return s==="random"?r.push("shuffle"):t&&(r.push(`sort:${t}`),s==="desc"&&r.push("reverse")),n&&r.push(`limit:${n}`),`{{ ${r.join(" | ")} }}`}function ka(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function Nt(e,t){const n=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return n?{from:t.from+n.index,to:t.from+n.index+n[0].length}:null}function ya(e,t,s){return ae(e,t,{name:s})}function ba(e,t,s){const n=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return n;const a=Nt(n,t);if(!a)return n;const r=(n.slice(0,a.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],c=s==="else"?"{{ else }}":"{{ elseif true }}";return`${n.slice(0,a.from)}${c}
${r}${n.slice(a.from)}`}const H=Vn("sve-call-values"),le=new Set;let pt=null;const _a="__sve-html-tree-style",O=new Set;let Ke="",X=!1,he=!0,j="",ce=0,zt="";const Y=new Map,re=new Set;let R="",Ut=!1,E=null,_e=null,Te=0,Ve=null,de=[],z=null,ie=null,xe=null,Se=null,qe=null,Ce=!1,U=null,q=null;function F(e){return e.getElementById(ke)}function Ta(e){Tn(e,_a,`
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
  `)}function A(){const e=_("dock:html");return typeof e=="string"?e:""}function Wt(e){return!!_("dock:is-open",e)}function ne(e){return Je()?!1:_("dock:set-html",e)===!0}function ft(e){const t=_("dock:component-exit-state")||{};if(o.exitOpen=!!t.open,!t.open){o.onExit=null;return}o.exitName=t.name||"",o.exitLabel=f(e,"component_exit"),o.exitTitle=f(e,t.back?"component_exit_back":"component_exit_close"),o.onExit=()=>{_("dock:exit-component"),$(e)}}function xa(e,t){const s=En(e);if(!s||t.type!==s)return"";const n=Ln(t[s]);return n&&In(e,n)?.section_type||""}const ue=[];let Ae=!1;function Re(e,t){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(t,{timeout:2e3});return}e.setTimeout(t,200)}function Sa(e,t){for(const s of t){const n=s.type;!n||Y.has(n)||re.has(n)||ue.includes(n)||ue.push(n)}We.htmlTreePrefetchArmed&&Xt(e)}function ar(e){We.htmlTreePrefetchArmed=!0,Xt(e)}function Xt(e){if(Ae||!ue.length)return;Ae=!0;const t=()=>{const s=ue.shift();if(!s){Ae=!1;return}if(Y.has(s)||re.has(s)){Re(e,t);return}re.add(s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(s)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{typeof n?.html=="string"&&Y.set(s,n.html)}).catch(()=>{}).finally(()=>{re.delete(s),Re(e,t)})};Re(e,t)}function Je(){return!!R}function Ca(e){const t=new Map,s=Pt(e);if(!s)return t;for(const n of s.querySelectorAll("[data-sid]")){const a=n.getAttribute("data-sid");a&&!t.has(a)&&t.set(a,n.tagName.toLowerCase())}return t}function wa(e,t){const s=$e(e);for(const n of ge(t)||[]){const a=Ue(n.values),i=a&&typeof a=="object"?a[s]:null;if(Array.isArray(i))return!0}return!1}function Yt(e,t){const s=$e(e),n=Ca(e),a=[];for(const i of ge(t)||[]){const r=Ue(i.values),c=r&&typeof r=="object"?r[s]:null;if(Array.isArray(c)){c.forEach(m=>{if(!m||typeof m!="object"||Array.isArray(m)||typeof m.type!="string")return;const u=[m._visual_id,m.id,m._id].filter(L=>typeof L=="string"&&L!=="");if(!u.length)return;const l=xa(e,m)||m.type,h=typeof m._sve_label=="string"?m._sve_label.trim():"",x=u.map(L=>n.get(L)).find(Boolean)||"section",P=Vt(m.type)[`0:${x}`];a.push({uid:u[0],ids:u,type:m.type,tag:x,label:(typeof P=="string"&&P.trim()?P.trim():"")||h||It(e,l)?.display||Be(l)||l,svg:At(x,"",null).svg||qn.section,cat:Rt(x,"",""),enabled:m.enabled!==!1})});break}}return a}function Pa(e,t,s){if(!s.length)return"";const n=_("dock:current-type")||"",a=_("dock:current-uid"),i=!!_("dock:component-exit-state")?.open;if(a){const r=Pn(a,t),c=s.find(m=>m.ids.some(u=>r.includes(u)));if(c&&(i||c.type===n))return c.uid}return s.find(r=>r.type===n)?.uid||""}function $a(e,t,s){const n=_("dock:component-exit-state");if(n?.open)return Be(n.name)||n.name||"";if(s)return t.find(i=>i.uid===s)?.label||"";const a=_("dock:current-type")||"";return It(e,a)?.display||Be(a)||""}function Zt(e,t,s,n,a){const i=s.find(c=>c.uid===n);if(!i||n===a)return;O.clear(),E=null,he=!1,Z(),Ee(),j=n,zt=A(),R=Y.get(i.type)||"",R&&(E=we(Ze(R))||null),Ut=(_("dock:current-type")||"")===i.type,e.clearTimeout(ce),ce=e.setTimeout(()=>{j="",X=!1,$(e)},4e3),$(e);const r=()=>Mn(i.uid,t,e,{clampToSection:!0});$n(i.uid,t,e,r),Q({source:te,type:ee.SVE_ACTIVATE,ids:i.ids},e),e.setTimeout(()=>$(e),0)}function Gt(e,t){if(!t)return!1;for(const s of e||[])if(s.id===t||Gt(s.children,t))return!0;return!1}function we(e){for(const t of e||[]){if(!t.kind)return t.id;const s=we(t.children);if(s)return s}return""}function Ea(e,t){return O.has(e.path)?t===0:t>0}function La(e){const t=new Set,s=(n,a)=>{for(const i of n)i.children.length&&Ea(i,a)&&t.add(i.id),s(i.children,a+1)};return s(e,0),t}function $(e){const t=e.document,n=F(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;Ta(t),Bn(e);const a=A();R&&R===a&&(R="");const i=R||a,r=Ze(i);de=r;const c=_("dock:current-type")||"",m=Vt(c),u=Yt(e,t),l=wa(e,t);c&&a&&!R&&Y.set(c,a),Sa(e,u);const h=Pa(e,t,u);if(l&&!u.length){de=[],o.rows=[],o.sections=[],o.pageBuilder=!0,o.emptyText=f(e,"html_tree_empty"),o.canEdit=!_("dock:is-locked"),o.look=st(e),o.onRefresh=()=>$(e),o.onSection=null,ft(e),ye(n,ct),vt(e,[]);return}o.pageBuilder=l;const x=`${c}|${h}`;x!==Ke&&(Ke=x,O.clear(),X=i),X!==!1&&i!==X&&(X=!1,O.clear(),E=we(r)||null),j&&(j===h||!u.length)&&(Ut||i!==zt)&&(e.clearTimeout(ce),j="",X=!1,Gt(r,E)||(O.clear(),E=we(r)||null));const P=u.some(p=>p.uid===j)?j:"",L=he?"":P||h,pe=!!(P||h),K=jn(r,La(r));!i.trim()&&!Wt(t)?o.emptyText=f(e,"html_tree_need_dock"):o.emptyText=f(e,"html_tree_empty"),o.slotText=f(e,"antlers_drop_here"),o.dataTitle=f(e,"data_vars_title"),o.pageTitle=f(e,"component_props_page"),o.renameTitle=f(e,"html_tree_rename"),o.tagTitle=f(e,"tw_tag"),o.hideTitle=f(e,"html_tree_hide"),o.showTitle=f(e,"html_tree_show"),o.duplicateTitle=f(e,"html_tree_duplicate"),o.deleteTitle=f(e,"html_tree_delete"),o.lockedTitle=f(e,"html_tree_locked"),o.canEdit=!_("dock:is-locked"),o.look=st(e),ft(e),o.onSelect=p=>{const k=K.find(S=>S.id===p);k&&Mt(e,k.path)||et(e,p,K)},o.onTwist=p=>{const k=K.find(S=>S.id===p)?.path;k&&(O.has(k)?O.delete(k):O.add(k),$(e))},o.onTagChange=(p,k)=>{const S=o.rows.find(V=>V.id===k);S&&!Je()&&Kn(e,p.currentTarget,S)},o.onRename=p=>Ha(e,p),o.onRenameCommit=()=>mt(e,!0),o.onRenameCancel=()=>mt(e,!1),o.onHide=p=>Ma(e,p),o.onDuplicate=p=>Aa(e,p),o.onDelete=p=>Da(e,p),o.onPointerDown=(p,k)=>ja(e,p,k),o.onContext=(p,k)=>Oa(e,p,k),o.onInspectCommit=p=>Ua(e,p),o.onPropValue=(p,k,S)=>yt(e,p,k,S),o.onPropPage=(p,k)=>ta(e,p,S=>yt(e,k,S,!1)),o.onLoopKind=p=>Wa(e,p),o.onAddBranch=p=>Xa(e,p),o.onLoopSortField=p=>{const k=Pe(),S=String(p||"").trim();if(!k)return;const V=q?.id===k.id?q.dir:"",ve=k.sortDir||V||"asc";q=null,W(e,(nn,on)=>ae(nn,on,{sortField:S,sortDir:ve}))},o.onLoopSortDir=p=>{const k=Pe(),S=String(p||"");if(k){if((S==="asc"||S==="desc")&&!k.sortField){q={id:k.id,dir:S},Ne(e,k);return}q=null,W(e,(V,ve)=>ae(V,ve,{sortDir:S,sortField:S==="asc"||S==="desc"?ve.sortField:""}))}},o.onLoopLimit=p=>W(e,(k,S)=>ae(k,S,{limit:String(p||"").replace(/\D/g,"")})),o.onPropHost=p=>p?H.mount(p):H.unmount(),o.onInspectData=(p,k)=>{_("dock:data-menu",{anchor:p,at:K.find(S=>S.id===E)?.from,onPick:S=>k(String(S?.var||"").trim())})};const oe=K.find(p=>!p.kind)?.id,fe=$a(e,u,L),y=L?u.find(p=>p.uid===L):null;o.rows=K.map(p=>{const k=At(p.tag,p.kind,p.antlers),S=p.id===oe&&fe?fe:p.klass,V=p.id===oe;return{...p,base:S,name:oa(S,p.path,m),current:p.id===E,letter:k.letter||"",svg:V&&y?y.svg:k.svg||"",cat:Rt(p.tag,p.kind,p.antlers),sectionRoot:V&&y?y.uid:""}}),o.sections=pe?u.map(p=>{const k=!!L&&p.uid===L;return{...p,current:k,ready:k&&(!P||!!R),row:{id:`sec:${p.uid}`,section:p.uid,tag:p.tag,name:p.label,kind:"",svg:p.svg,cat:p.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:k,hidden:!p.enabled}}}):[],o.onSection=p=>Zt(e,t,u,p,L),o.onRefresh=()=>$(e),Ne(e,o.rows.find(p=>p.id===E)),ye(n,ct),vt(e,r)}function vt(e,t){F(e.document)&&Jt(e,t)}function Jt(e,t){const s=t[0],n=!!_("dock:component-src"),a=n?"":_("dock:current-uid")||"";Q({source:te,type:ee.SVE_HTML_PICK,on:!0,uid:a,all:n,tag:s?.tag||"",klass:s?.klass||"",nodes:oo(t)},e)}function Ia(e){if(!e)return;const t=(s,n)=>{for(const a of s||[]){if(a.path===e)return!0;if(t(a.children,n+1))return n===0?O.delete(a.path):O.add(a.path),!0}return!1};t(de,0)}function Ha(e,t){if(Ce)return;const s=o.rows.find(n=>n.id===t);!s||s.kind||(E=t,o.rows.forEach(n=>{n.current=n.id===t}),o.editingId=t,o.draft=s.name,e.setTimeout(()=>{const n=F(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function mt(e,t){const s=o.editingId;if(!s)return;const n=o.rows.find(a=>a.id===s);o.editingId=null,t&&n&&sa(_("dock:current-type")||"",n.path,o.draft,n.base||n.klass),o.draft="",$(e)}function Ma(e,t){Qe(e,t,eo)}function Aa(e,t){Qe(e,t,to)}function Qt(e,t){Hn(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const s=e.document;An({uid:t},s,e)})}function Ra(e,t,s){j===s&&(e.clearTimeout(ce),j="",R=""),E=null,he=!1,Ke="";const n=Yt(e,t),a=n.find(i=>i.uid!==s)||n[0];a?Zt(e,t,n,a.uid,""):(R="",o.rows=[],o.sections=[],o.pageBuilder=!0,$(e)),e.setTimeout(()=>{F(e.document)&&$(e)},0)}Lt("row:removed",({uid:e,parentPath:t,doc:s,win:n})=>{t!==$e(n)||!F(n.document)||Ra(n,s,e)});function Da(e,t){const s=o.sections?.find(a=>a.row?.id===t),n=s?s.row?.section||s.uid:o.rows.find(a=>a.id===t)?.sectionRoot;if(n){Qt(e,n);return}Qe(e,t,no)}function Qe(e,t,s){if(_("dock:is-locked"))return;const n=A(),a=o.rows.find(r=>r.id===t);if(!a)return;const i=s(n,a);i!==n&&ne(i)}function Z(){U?.dismiss(),U=null}function Fa(e,t,s){const n=s.row?.section||s.uid;n&&(U=J(e.document,Xe,{items:[{label:f(e,"html_tree_remove_section"),danger:!0,onPick:()=>{Z(),Qt(e,n)}}],x:t.clientX,y:t.clientY,onClose:()=>{U=null}}))}function Oa(e,t,s){Z();const n=o.sections?.find(c=>c.row?.id===s);if(n){Fa(e,t,n);return}const a=o.rows.find(c=>c.id===s);if(!a)return;et(e,s,o.rows);const i={x:t.clientX,y:t.clientY},r=c=>{c.length&&(U?.dismiss(),U=J(e.document,Xe,{items:c,x:i.x,y:i.y,onClose:()=>{U=null}}))};if(a.kind==="component"){Ba(e,a,r);return}o.canEdit&&r([{label:f(e,"component_make"),onPick:()=>{Z(),fa(e,a,{onDone:()=>$(e),onError:c=>{e.alert(c?.status===409?f(e,"component_exists"):f(e,"component_failed"))}})}}])}const gt=(e,t)=>{Z(),_("dock:open-template",t)};function Ba(e,t,s){if(!zn(t.src)){s([{label:f(e,"component_open_named",{name:t.name||t.src}),onPick:()=>gt(e,`view:partials/${t.src}`)}]);return}s([{label:f(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const a=Array.isArray(n.items)?n.items:[];s(a.length?a.map(i=>({label:f(e,"component_open_named",{name:i.label}),onPick:()=>gt(e,i.type)})):[{label:f(e,"component_none"),onPick:null}])}).catch(()=>s([{label:f(e,"component_none"),onPick:null}]))}function ja(e,t,s){if(t.button!==0||_("dock:is-locked")||o.editingId||t.target?.closest?.("button, input"))return;Ee(),z=s,ie={x:t.clientX,y:t.clientY},xe=t.currentTarget,Se=t.pointerId;const n=i=>Ka(e,i),a=i=>Va(e,i);qe=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),qe=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function Ka(e,t){if(!z||!ie)return;const s=t.clientX-ie.x,n=t.clientY-ie.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{xe?.setPointerCapture?.(Se)}catch{}}t.preventDefault();const a=e.document.elementFromPoint(t.clientX,t.clientY),i=a?.closest?.("[data-sve-ht-slot]");if(i){const h=i.getAttribute("data-sve-ht-id");if(h&&h!==z){o.dropId=h,o.dropPlace="inside";return}}const r=a?.closest?.("[data-sve-ht-row]"),c=r?.getAttribute("data-sve-ht-id");if(!c||c===z){o.dropId=null,o.dropPlace=null;return}const m=o.rows.find(h=>h.id===c),u=o.rows.find(h=>h.id===z);if(!m||u&&m.path.startsWith(`${u.path}/`)){o.dropId=null,o.dropPlace=null;return}const l=r.getBoundingClientRect();o.dropId=c,o.dropPlace=Jn(t.clientY-l.top,l.height,!Dt(m.tag)&&m.kind!=="component")}function Va(e,t){const s=z,n=o.dropId,a=o.dropPlace||"after",i=o.dragging;if(Ee(),i&&(Ce=!0,e.setTimeout(()=>{Ce=!1},0)),!i||_("dock:is-locked")||!s||!n||s===n)return;t?.preventDefault?.();const r=A(),c=Qn(r,de,s,n,a);c!==r&&ne(c)}function Ee(){try{xe?.releasePointerCapture?.(Se)}catch{}qe?.(),z=null,ie=null,xe=null,Se=null,o.dragging=!1,o.dropId=null,o.dropPlace=null}function en(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function Ne(e,t){if(t?.kind==="component"){qa(e,t);return}if(D.callOpen&&(D.callOpen=!1,D.callStore=null,H.forget(),Ye(e)),t?.kind!=="antlers"){o.inspect=null;return}const s=t.id;if(t.tag==="else"){o.inspect={key:s,title:f(e,"antlers_condition"),mode:"note",note:f(e,"antlers_else_note")};return}if(t.antlers==="loop"){const n=t.loopKind==="collection",a=q?.id===t.id?q.dir:"",i=t.sortDir||a;o.inspect={key:s,title:f(e,"antlers_loop"),mode:"loop",loopKind:n?"collection":"field",kinds:[{id:"field",label:f(e,"antlers_loop_field")},{id:"collection",label:f(e,"antlers_loop_collection")}],collections:en(e),value:t.expr||"",placeholder:f(e,n?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:f(e,"antlers_sort"),dir:i,needsField:i==="asc"||i==="desc",field:t.sortField||"",pickable:!n,placeholder:f(e,n?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:f(e,"antlers_sort_none")},{id:"asc",label:f(e,"antlers_sort_asc")},{id:"desc",label:f(e,"antlers_sort_desc")},{id:"random",label:f(e,"antlers_sort_random")}]},limit:{title:f(e,"antlers_limit"),value:t.limit||"",placeholder:f(e,"antlers_limit_placeholder")},branches:[]};return}o.inspect={key:s,title:f(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:f(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:f(e,"antlers_add_elseif")},{id:"else",label:f(e,"antlers_add_else")}]}}function qa(e,t){if(!Un(e)){o.inspect=null;return}if(!t.src)return;const s=t.id;if(o.inspect={key:s,title:f(e,"component_props_values"),mode:"note",note:f(e,"code_dock_loading")},Wn()){const n={},a={},i=new Map;for(const[r,c]of Xn(A().slice(t.from,t.to))){const m=Yn(r);m&&(r!==m||!i.has(m))&&i.set(m,c)}for(const[r,c]of i)c.bound?a[r]=c.value:n[r]=c.value;pt!==s&&(pt=s,le.clear());for(const r of le)r in a||(a[r]="");o.inspect=null,D.callOpen=!0,D.title=D.title||f(e,"component_props"),D.callTitle=t.klass||t.name||t.src,D.callStore=H.ui,H.ui.canBind=!0,H.ui.dataTitle=f(e,"data_vars_title"),H.ui.exprPlaceholder=f(e,"component_props_expr"),H.ui.onToggleBind=(r,c)=>za(e,r,c),H.ui.onExpr=(r,c)=>kt(e,r,c),H.ui.onPickData=(r,c)=>_("dock:data-menu",{anchor:c,at:t.from,onPick:m=>kt(e,r,String(m?.var||"").trim())}),H.load(e,{key:`${t.src}::${s}`,src:t.src,params:n,bindings:a,readOnly:_("dock:is-locked")===!0}),H.watch(e,{src:t.src,write:r=>Na(e,r,a)}),Ye(e);return}Zn(e,t.src).then(n=>{if(o.inspect?.key===s){if(!n.length){o.inspect={key:s,title:f(e,"component_props_values"),mode:"note",note:f(e,"component_props_values_none")};return}o.inspect={key:s,title:f(e,"component_props_values"),mode:"props",inheritLabel:f(e,"component_props_inherit"),rows:Gn(n,A().slice(t.from,t.to))}}})}function Na(e,t,s={}){const n=o.rows.find(r=>r.id===E);if(n?.kind!=="component"||_("dock:is-locked"))return;let a=A(),i=n.to;for(const[r,c]of Object.entries(t||{})){if(r in s)continue;const m=a.length,u=Ge(a,{from:n.from,to:i},r,c);u!==a&&(i+=u.length-m,a=u)}a!==A()&&(ne(a),$(e))}function za(e,t,s){s?le.add(t):le.delete(t),tn(e,t,"",s),$(e)}function kt(e,t,s){le.add(t),tn(e,t,s,!0),$(e)}function tn(e,t,s,n){const a=o.rows.find(c=>c.id===E);if(a?.kind!=="component"||_("dock:is-locked"))return;const i=A(),r=Ge(i,a,t,s,{bound:n});r!==i&&ne(r)}function Pe(){const e=o.rows.find(t=>t.id===E);return e?.kind==="antlers"&&!_("dock:is-locked")?e:null}function W(e,t){const s=Pe();if(!s)return;const n=A(),a=t(n,s);a!==n&&(ne(a),$(e))}function yt(e,t,s,n){const a=o.rows.find(c=>c.id===E);if(a?.kind!=="component"||_("dock:is-locked"))return;const i=A(),r=Ge(i,a,t,s,{bound:n});r!==i&&(ne(r),$(e))}function Ua(e,t){W(e,(s,n)=>n.antlers==="loop"?je(s,n,n.loopKind==="collection"?"collection":"field",t):va(s,n,t))}function Wa(e,t){const s=Pe();if(!s||s.antlers!=="loop")return;const n=s.loopKind==="collection"?"collection":"field";if(t!==n){if(t==="collection"){const a=en(e)[0]?.handle;if(!a)return;W(e,(i,r)=>je(i,r,"collection",a));return}W(e,(a,i)=>je(a,i,"field",i.handle||"items"))}}function Xa(e,t){W(e,(s,n)=>ba(s,n,t))}function Ya(e,t){if(!e||!t||t.kind==="component"||Dt(t.tag))return null;const s=Nn(e,t);if(s<t.openTo)return null;const n=e.lastIndexOf(`
`,s-1)+1;return e.slice(n,s).trim()===""&&n>t.openTo?n-1:s}function et(e,t,s){if(Ce)return;const n=(s||o.rows).find(a=>a.id===t);n&&(E=t,o.rows.forEach(a=>{a.current=a.id===t}),Ne(e,n),!Je()&&(_("dock:reveal-html",{from:n.from,to:n.to,caret:Ya(A(),n)}),_("dock:tw-follow"),Q({source:te,type:ee.SVE_HTML_PICK_FOCUS,path:n.path},e)))}function Za(e,t){if(!t)return"";const s=[],n=(a,i)=>{for(const r of a||[]){const c=i||r.path===e;r.kind==="component"&&r.src===t&&s.push({path:r.path,inside:c}),n(r.children,c)}};return n(de,!1),(s.find(a=>a.inside)||s[0])?.path||""}function Ga(e,t){if(!t||!F(e.document))return;he=!1,Ia(t),$(e);const s=o.rows.find(n=>n.path===t);s&&(et(e,s.id,o.rows),e.setTimeout(()=>{F(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function ze(e){if(_e)return;const t=()=>{o.editingId||o.dragging||(e.clearTimeout(Te),Te=e.setTimeout(()=>{F(e.document)&&$(e)},80))},s=()=>t();_e=Lt("dock:html-changed",t),e.document.addEventListener("sve-page-structure",s),Ve=()=>{e.document.removeEventListener("sve-page-structure",s)}}function Ja(e){_e?.(),_e=null,Ve?.(),Ve=null,e?.clearTimeout?.(Te),Te=0}function tt(e){const t=F(e.document);if(Q({source:te,type:ee.SVE_HTML_PICK,on:!1},e),Ja(e),H.forget(),D.callOpen=!1,D.callStore=null,Ye(e),Ee(),Z(),On(e),E=null,o.inspect=null,o.editingId=null,o.draft="",o.sections=[],o.pageBuilder=!1,j="",e?.clearTimeout?.(ce),!t){Oe(e);return}t.remove(),We.headerTab==="html_tree"&&bn(e,null),_n(e),$t(e),Et(e),Oe(e)}function rr(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=ke,ye(t,Ft,{title:f(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>tt(e)))}function ir(e){ze(e),$(e)}function Qa(e){const t=e.document;if(!xn(e,"html_tree"))return;if(F(t)){ze(e),$(e);return}if(!Wt(t))return;he=!0,O.clear(),Sn(e,[ke]);const s=t.createElement("div");s.id=ke,s.style.cssText=Cn,ye(s,Ft,{title:f(e,"html_tree")}),s.querySelector("[data-sve-close]")?.addEventListener("click",()=>tt(e)),wn(e,s),$t(e),Et(e),Oe(e),ze(e),$(e)}function lr(e){if(F(e.document)){tt(e);return}Qa(e)}Ht("html-tree:from-preview",({path:e,src:t}={})=>{Mt(window,e)||Ga(window,Za(e,t)||e)});Ht("html-tree:arm-pick",e=>{const t=window;return e?(Jt(t,Ze(A())),!0):(F(t.document)||Q({source:te,type:ee.SVE_HTML_PICK,on:!1},t),!0)});function cr(){Y.clear(),re.clear(),ue.length=0}export{_a as HTML_TREE_STYLE_ID,ar as armHtmlTreePrefetch,cr as clearHtmlTreeTemplates,Z as closeHtmlTreeMenu,tt as closeHtmlTreePanel,Ta as ensureHtmlTreeStyles,rr as fillHtmlTreePane,E as htmlTreeActiveId,F as htmlTreePanel,Te as htmlTreeTimer,_e as htmlTreeUnhook,Qa as openHtmlTreePanel,$ as renderHtmlTree,ir as showHtmlTreePane,Ja as stopWatchHtmlTreeDock,lr as toggleHtmlTreePanel,ze as watchHtmlTreeDock};
