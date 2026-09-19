const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-D8Xdoe3O.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{_ as de,k as j,ap as on,b4 as o,u as c,o as m,a as v,b as x,t as _,F as L,d as R,f as sn,g as C,e as an,s as k,q,l as rn,p as kt,w as Re,b5 as ln,v as yt,h as f,j as ue,y,i as bt,b6 as nt,b7 as ot,b8 as cn,b9 as dn,ba as un,bb as Tt,z as G,x as hn,bc as me,bd as pn,B as ne,c as te,N as fn,G as mn,aM as Ne,aq as De,am as vn,aO as _t,aP as xt,af as gn,ag as st,S as ve,V as ge,O as kn,aN as yn,an as bn,ao as Tn,be as at,bf as _n,U as St,A as Ct,a8 as ze,J as wt,K as Pt,ax as $t,ay as Be,I as xn,bg as Sn,aR as Cn,aS as wn,aw as Pn,bh as $n,b0 as Ln,ae as Lt,aG as En,aJ as Hn}from"./addon-BoP0iqEj.js";import{M as J,S as Q}from"./protocol-D3FYhCm9.js";import{D as M,E as In,F as Ue,G as Mn,t as An,I as Xe,v as Rn,z as Dn,b as Ye,l as Bn,J as Et,q as On,K as Ht,L as Fn,H as jn,M as We,N as It,O as qn,h as Kn,c as Vn,Q as Nn,R as zn,S as Un,T as Xn,U as Yn,V as Wn,W as Zn,X as Gn,Y as Jn,Z as Qn}from"./tw-classes-B-zc_KvH.js";import{canEditFields as eo,currentSetHandle as to,openFieldsetOverlay as no}from"./section-fields-BfboDsAC.js";import{a as oo}from"./html-pick-align-CK-9iH9_.js";import"./ai-text-icon-B7uCWIwa.js";const so={key:0,class:"sve-ht-inspect"},ao={class:"sve-ht-inspect__head"},ro={key:0,class:"sve-ht-inspect__note"},io={key:2,class:"sve-ht-inspect__props"},lo={class:"sve-ht-inspect__proplabel"},co={key:0},uo=["value","disabled","onChange"],ho={value:""},po=["value"],fo=["value"],mo=["value","placeholder","onChange"],vo=["title","disabled","onClick"],go=["title","disabled","onClick"],ko={key:0,class:"sve-ht-inspect__seg"},yo=["data-active","disabled","onClick"],bo=["value","disabled"],To={key:0,value:""},_o=["value"],xo={key:2,class:"sve-ht-inspect__box"},So=["value","placeholder","disabled","onKeydown"],Co=["title","disabled"],wo={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Po=["value","disabled"],$o=["value"],Lo={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},Eo=["value","placeholder","disabled"],Ho=["title","disabled"],Io={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Mo=["value","placeholder","disabled"],Ao={key:4,class:"sve-ht-inspect__add"},Ro=["disabled","onClick"],$e='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',Do='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',Bo={__name:"HtmlTreeInspector",setup(e){const t=j(null);on(t,h=>o.onPropHost?.(h||null));const s=j(null),n=j(null);function a(h){o.onInspectCommit?.(h.target.value)}function l(h,i,u){!h||!i||(h.value=i,h.focus(),h.setSelectionRange(i.length,i.length),u(i))}function r(h,i){o.onInspectData?.(h.currentTarget,u=>o.onPropValue?.(i.handle,u,!0))}function d(h){o.onInspectData?.(h.currentTarget,i=>l(s.value,i,u=>o.onInspectCommit?.(u)))}function g(h){o.onInspectData?.(h.currentTarget,i=>l(n.value,i,u=>o.onLoopSortField?.(u)))}return(h,i)=>c(o).inspect?(m(),v("div",so,[x("div",ao,_(c(o).inspect.title),1),c(o).inspect.mode==="note"?(m(),v("div",ro,_(c(o).inspect.note),1)):c(o).inspect.mode==="statamic"?(m(),v("div",{key:1,ref_key:"propHost",ref:t,class:"sve-ht-inspect__form"},null,512)):c(o).inspect.mode==="props"?(m(),v("div",io,[(m(!0),v(L,null,R(c(o).inspect.rows,u=>(m(),v("label",{key:u.handle,class:"sve-ht-inspect__prop"},[x("span",lo,[sn(_(u.label)+" ",1),u.bound?(m(),v("em",co,":")):C("",!0)]),x("span",{class:an(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":u.type==="select"||u.type==="link"}])},[u.type==="select"&&!u.bound?(m(),v("select",{key:0,value:u.value,disabled:!c(o).canEdit,onChange:T=>c(o).onPropValue?.(u.handle,T.target.value,!1)},[x("option",ho,_(u.placeholder||c(o).inspect.inheritLabel),1),u.value&&!u.options.includes(u.value)?(m(),v("option",{key:0,value:u.value},_(u.value),9,po)):C("",!0),(m(!0),v(L,null,R(u.options,T=>(m(),v("option",{key:T,value:T},_(T),9,fo))),128))],40,uo)):(m(),v("input",{key:1,type:"text",value:u.value,placeholder:u.placeholder||c(o).inspect.inheritLabel,onChange:T=>c(o).onPropValue?.(u.handle,T.target.value,u.bound)},null,40,mo)),u.type==="link"?(m(),v("button",{key:2,type:"button","data-sve-ht-data":"",title:c(o).pageTitle,disabled:!c(o).canEdit,onClick:T=>c(o).onPropPage?.(T.currentTarget,u.handle),innerHTML:Do},null,8,vo)):C("",!0),x("button",{type:"button","data-sve-ht-data":"",title:c(o).dataTitle,disabled:!c(o).canEdit,onClick:T=>r(T,u),innerHTML:$e},null,8,go)],2)]))),128))])):(m(),v(L,{key:3},[c(o).inspect.mode==="loop"?(m(),v("div",ko,[(m(!0),v(L,null,R(c(o).inspect.kinds,u=>(m(),v("button",{key:u.id,type:"button","data-active":u.id===c(o).inspect.loopKind?"":void 0,disabled:!c(o).canEdit,onClick:T=>c(o).onLoopKind?.(u.id)},_(u.label),9,yo))),128))])):C("",!0),c(o).inspect.mode==="loop"&&c(o).inspect.loopKind==="collection"?(m(),v("select",{key:c(o).inspect.key+":"+c(o).inspect.value,value:c(o).inspect.value,disabled:!c(o).canEdit,onChange:a},[c(o).inspect.value?C("",!0):(m(),v("option",To,_(c(o).inspect.placeholder),1)),(m(!0),v(L,null,R(c(o).inspect.collections,u=>(m(),v("option",{key:u.handle,value:u.handle},_(u.title),9,_o))),128))],40,bo)):(m(),v("div",xo,[(m(),v("input",{ref_key:"field",ref:s,key:c(o).inspect.key,type:"text",value:c(o).inspect.value,placeholder:c(o).inspect.placeholder,disabled:!c(o).canEdit,spellcheck:"false",onKeydown:[i[0]||(i[0]=k(()=>{},["stop"])),q(k(a,["prevent"]),["enter"])],onBlur:a},null,40,So)),x("button",{type:"button","data-sve-ht-data":"",title:c(o).dataTitle,disabled:!c(o).canEdit,innerHTML:$e,onMousedown:i[1]||(i[1]=k(()=>{},["prevent"])),onClick:k(d,["stop","prevent"])},null,40,Co)])),c(o).inspect.sort?(m(),v(L,{key:3},[x("div",wo,_(c(o).inspect.sort.title),1),(m(),v("select",{key:c(o).inspect.key+":dir:"+c(o).inspect.sort.dir,value:c(o).inspect.sort.dir,disabled:!c(o).canEdit,onChange:i[2]||(i[2]=u=>c(o).onLoopSortDir?.(u.target.value))},[(m(!0),v(L,null,R(c(o).inspect.sort.dirs,u=>(m(),v("option",{key:u.id,value:u.id},_(u.label),9,$o))),128))],40,Po)),c(o).inspect.sort.needsField?(m(),v("div",Lo,[(m(),v("input",{ref_key:"sortField",ref:n,key:c(o).inspect.key+":field",type:"text",value:c(o).inspect.sort.field,placeholder:c(o).inspect.sort.placeholder,disabled:!c(o).canEdit,spellcheck:"false",onKeydown:[i[3]||(i[3]=k(()=>{},["stop"])),i[4]||(i[4]=q(k(u=>c(o).onLoopSortField?.(u.target.value),["prevent"]),["enter"]))],onBlur:i[5]||(i[5]=u=>c(o).onLoopSortField?.(u.target.value))},null,40,Eo)),c(o).inspect.sort.pickable?(m(),v("button",{key:0,type:"button","data-sve-ht-data":"",title:c(o).dataTitle,disabled:!c(o).canEdit,innerHTML:$e,onMousedown:i[6]||(i[6]=k(()=>{},["prevent"])),onClick:k(g,["stop","prevent"])},null,40,Ho)):C("",!0)])):C("",!0),x("div",Io,_(c(o).inspect.limit.title),1),(m(),v("input",{key:c(o).inspect.key+":limit",type:"number",min:"1",value:c(o).inspect.limit.value,placeholder:c(o).inspect.limit.placeholder,disabled:!c(o).canEdit,onKeydown:[i[7]||(i[7]=k(()=>{},["stop"])),i[8]||(i[8]=q(k(u=>c(o).onLoopLimit?.(u.target.value),["prevent"]),["enter"]))],onBlur:i[9]||(i[9]=u=>c(o).onLoopLimit?.(u.target.value))},null,40,Mo))],64)):C("",!0),c(o).inspect.branches?.length?(m(),v("div",Ao,[(m(!0),v(L,null,R(c(o).inspect.branches,u=>(m(),v("button",{key:u.id,type:"button",disabled:!c(o).canEdit,onClick:T=>c(o).onAddBranch?.(u.id)},_(u.label),9,Ro))),128))])):C("",!0)],64))])):C("",!0)}},Oo=de(Bo,[["__scopeId","data-v-26254b75"]]),Fo={class:"sve-dialog__title"},jo={for:"sve-new-section-group"},qo=["value"],Ko={for:"sve-new-section-name"},Vo=["placeholder"],No={key:0,class:"sve-dialog__note"},zo={class:"sve-dialog__actions"},Uo=["disabled"],Xo=["disabled"],Yo={__name:"NewSectionPrompt",props:{heading:{type:String,required:!0},groupLabel:{type:String,required:!0},nameLabel:{type:String,required:!0},placeholder:{type:String,default:""},note:{type:String,default:""},groups:{type:Array,required:!0},cancelLabel:{type:String,required:!0},saveLabel:{type:String,required:!0},onOk:{type:Function,required:!0},onClose:{type:Function,required:!0}},setup(e){const t=e,s=j(""),n=j(t.groups[0]?.key??""),a=j(null),l=j(!1);rn(()=>kt(()=>a.value?.focus()));function r(){const h=s.value.trim();if(!h||!n.value||l.value){a.value?.focus();return}l.value=!0,t.onOk(h,n.value)}function d(h){h.target===h.currentTarget&&t.onClose()}function g(h){h.key==="Enter"?r():h.key==="Escape"&&t.onClose()}return(h,i)=>(m(),v("div",{class:"sve-dialog-overlay",onClick:d},[x("div",{class:"sve-dialog",onClick:i[3]||(i[3]=k(()=>{},["stop"]))},[x("div",Fo,_(e.heading),1),x("label",jo,_(e.groupLabel),1),Re(x("select",{id:"sve-new-section-group","onUpdate:modelValue":i[0]||(i[0]=u=>n.value=u),onKeydown:g},[(m(!0),v(L,null,R(e.groups,u=>(m(),v("option",{key:u.key,value:u.key},_(u.display),9,qo))),128))],544),[[ln,n.value]]),x("label",Ko,_(e.nameLabel),1),Re(x("input",{id:"sve-new-section-name",ref_key:"input",ref:a,"onUpdate:modelValue":i[1]||(i[1]=u=>s.value=u),type:"text",placeholder:e.placeholder,onKeydown:g},null,40,Vo),[[yt,s.value]]),e.note?(m(),v("p",No,_(e.note),1)):C("",!0),x("div",zo,[x("button",{type:"button",class:"is-cancel",disabled:l.value,onClick:i[2]||(i[2]=(...u)=>e.onClose&&e.onClose(...u))},_(e.cancelLabel),9,Uo),x("button",{type:"button",class:"is-primary",disabled:l.value,onClick:r},_(e.saveLabel),9,Xo)])])]))}},Wo=de(Yo,[["__scopeId","data-v-d21be545"]]),Mt="/!/sve/section-types";async function Zo(e){const t=await e.fetch(Mt,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!t.ok)throw new Error(`section-types ${t.status}`);const s=await t.json(),n=new Map;for(const a of s.types||[])a?.group&&!n.has(a.group)&&n.set(a.group,a.group_display||a.group);return[...n].map(([a,l])=>({key:a,display:l}))}async function Go(e,{display:t,group:s}){const n=await e.fetch(Mt,{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":bt(e),Accept:"application/json"},credentials:"same-origin",body:JSON.stringify({display:t,group:s})}),a=await n.json().catch(()=>({}));if(!n.ok){const l=new Error(a.error||`section-types ${n.status}`);throw l.reason=a.error,l}return a}async function Jo(e,t,s=null){if(!t||typeof nt!="function"||typeof ot!="function")return null;const n=await nt(e,t);if(!n)return null;const a=cn(),l=dn(e,"page",{handle:t},n?.defaults,a),r=un(l,n?.new||{},n?.defaults);return ot(e,e.document,s,l,r)?l:null}const rt=700,Qo=17;function es(e,t){const s=(t||[]).filter(Boolean);if(!s.length)return;let n=0;const a=()=>{n+=1;const l=Tt(e),r=l?s.some(d=>l.querySelector(`[data-sid="${CSS.escape(d)}"]`)):!0;r&&G({source:Q,type:J.SVE_ACTIVATE,ids:s},e),(r?!l&&n<6:n<Qo)&&e.setTimeout(a,rt)};e.setTimeout(a,rt)}function ts(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function ns(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){(async()=>{let l=[];try{l=await Zo(e)}catch(d){n?.(d),e.Statamic?.$toast?.error(f(e,"section_new_failed"));return}if(!l.length){n?.(new Error("no groups")),e.Statamic?.$toast?.error(f(e,"section_new_failed"));return}const r=ue(e.document,Wo,{heading:f(e,"section_new"),groupLabel:f(e,"section_new_group"),nameLabel:f(e,"section_new_name"),placeholder:f(e,"section_new_placeholder"),note:f(e,"section_new_note"),groups:l,cancelLabel:f(e,"cancel"),saveLabel:f(e,"section_new_create"),onClose:a,onOk:(d,g)=>{(async()=>{try{const h=await Go(e,{display:d,group:g});r.dismiss(),e.Statamic?.$toast?.success(f(e,"section_created",{name:h.section?.display||d})),e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"));const i=await Jo(e,h.section?.handle,t);!i&&h.section?.handle&&y("dock:open-template",h.section.handle),s?.({...h,uid:i?._visual_id||""})}catch(h){r.dismiss(),e.Statamic?.$toast?.error(f(e,h.reason==="bad_name"?"section_new_bad_name":"section_new_failed")),n?.(h)}})()}})})()}const os={class:"sve-html-tree"},ss={class:"sve-pane-bar","data-sve-pane-bar":""},as={"data-sve-right-title":""},rs={class:"sve-ht-tools"},is=["title"],ls=["placeholder","aria-label","value"],cs=["aria-label"],ds=["title","aria-label"],us={key:1,class:"sve-tree-exit"},hs=["title"],ps=["title"],fs='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',ms='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',vs='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',gs={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const t=f(window,"html_tree_search"),s=ts(window),n=f(window,"section_new"),a=j(!1);function l(){a.value=!1}async function r(h){if(h)for(let i=0;i<20;i+=1){await kt(),o.onRefresh?.();const u=o.sections.find(T=>T.uid===h);if(u){o.onSection?.(h),es(window,u.ids);return}await new Promise(T=>setTimeout(T,50))}}function d(){a.value||(a.value=!0,ns(window,{afterUid:o.sections.length?o.sections[o.sections.length-1].uid:null,onDone:h=>{l(),r(h?.uid)},onError:l,onClose:l}))}function g(h){const i=!!o.query;o.query=h,i!==!!h&&o.onQuery?.()}return(h,i)=>(m(),v("div",os,[x("div",ss,[x("div",as,_(e.title),1),i[5]||(i[5]=hn('<div data-sve-right-actions data-v-fb9a0208><button type="button" data-sve-right-pin aria-pressed="false" data-v-fb9a0208></button><button type="button" data-sve-close aria-label="Close" data-v-fb9a0208><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-fb9a0208><path d="M18 6 6 18" data-v-fb9a0208></path><path d="m6 6 12 12" data-v-fb9a0208></path></svg></button></div>',1))]),x("div",rs,[x("label",{class:"sve-ht-search",title:c(t)},[x("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:ms}),x("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:c(t),"aria-label":c(t),value:c(o).query,autocomplete:"off",spellcheck:"false",onInput:i[0]||(i[0]=u=>g(u.target.value)),onKeydown:[i[1]||(i[1]=k(()=>{},["stop"])),i[2]||(i[2]=q(k(u=>g(""),["prevent"]),["escape"]))]},null,40,ls),c(o).query?(m(),v("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":c(t),innerHTML:vs,onClick:i[3]||(i[3]=u=>g(""))},null,8,cs)):C("",!0)],8,is),c(s)&&(c(o).sections.length||c(o).pageBuilder)?(m(),v("button",{key:0,type:"button",class:"sve-ht-new",title:c(n),"aria-label":c(n),innerHTML:fs,onClick:d},null,8,ds)):C("",!0)]),c(M).inSidebar?C("",!0):(m(),me(In,{key:0})),i[6]||(i[6]=x("div",{"data-sve-html-tree-list":""},null,-1)),pn(Oo),c(o).exitOpen&&!c(M).inSidebar?(m(),v("div",us,[x("span",{class:"sve-tree-exit__name",title:c(o).exitName},_(c(o).exitName),9,hs),x("button",{type:"button",class:"sve-tree-exit__go",title:c(o).exitTitle,onClick:i[4]||(i[4]=u=>c(o).onExit?.())},_(c(o).exitLabel),9,ps)])):C("",!0)]))}},At=de(gs,[["__scopeId","data-v-fb9a0208"]]);function Rt(e){return String(e||"").trim().toLowerCase()}function Dt(e,t){return t?[e.name,e.tag,e.klass,e.label,e.src].filter(s=>typeof s=="string"&&s).join(" ").toLowerCase().includes(t):!0}function ks(e,t){const s=Rt(t);if(!s)return{rows:e,hits:new Set};const n=new Set;for(const r of e)Dt(r,s)&&n.add(r.path);const a=[...n];return{rows:e.filter(r=>n.has(r.path)||a.some(d=>d.startsWith(`${r.path}/`))),hits:n}}const ys=["title"],bs={"data-sve-ht-indent":"","aria-hidden":"true"},Ts=["data-sve-ht-cat"],_s={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},xs={key:2,"data-sve-ht-letter":""},Ss=["innerHTML"],Cs=["title"],ws=["title"],Ps={key:1,"data-sve-ht-kind":""},$s={key:3,"data-sve-ht-name":""},Ls={key:4,"data-sve-ht-actions":""},Es=["disabled","title","innerHTML"],Hs=["disabled","title"],Is=["disabled","title"],Ms=["disabled","title"],As=["data-sve-ht-id"],Rs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',Ds='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',Bs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Os='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',Fs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',js='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',qs={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const t=eo(window),s=f(window,"section_fields");function n(){const h=to();if(!h){window.Statamic?.$toast?.error(f(window,"section_fields_none"));return}no(window,h)}function a(h){return h.kind==="component"?h.src?`partial:${h.src}`:h.tag:h.name?`${h.tag} ${h.name}`:h.tag}function l(h){return!!h.section}function r(h){if(l(h)){o.onSection?.(h.section);return}o.onSelect?.(h.id)}function d(h,i){const u={"data-sve-ht-id":h.id};return h.current&&(u["data-sve-ht-current"]=""),h.hidden&&(u["data-sve-ht-hidden"]=""),u["data-sve-ht-cat"]=h.cat||"other",u["data-sve-ht-depth"]=String(h.depth),i&&(u["data-sve-ht-dim"]=""),l(h)&&(u["data-sve-ht-sec"]=""),!l(h)&&o.dropId===h.id&&o.dropPlace&&(u["data-sve-ht-drop"]=o.dropPlace),u}function g(h){return!h.hidden||h.wrapFrom!=null}return(h,i)=>(m(),v(L,null,[x("div",ne({"data-sve-ht-row":""},d(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:i[26]||(i[26]=u=>r(e.row)),onDblclick:i[27]||(i[27]=k(u=>l(e.row)?null:c(o).onRename?.(e.row.id),["prevent"])),onKeydown:[i[28]||(i[28]=q(k(u=>r(e.row),["prevent"]),["enter"])),i[29]||(i[29]=q(k(u=>r(e.row),["prevent"]),["space"]))],onPointerdown:i[30]||(i[30]=u=>l(e.row)?null:c(o).onPointerDown?.(u,e.row.id)),onContextmenu:i[31]||(i[31]=k(u=>l(e.row)?null:c(o).onContext?.(u,e.row.id),["prevent","stop"]))}),[x("span",bs,[(m(!0),v(L,null,R(e.row.guides||[],(u,T)=>(m(),v("i",{key:T,"data-sve-ht-cat":u},null,8,Ts))),128))]),e.row.hasChildren||e.row.emptyBlock?(m(),v("button",ne({key:0,type:"button","data-sve-ht-twist":""},e.row.shut?{"data-sve-ht-shut":""}:{},{innerHTML:Ds,onClick:i[0]||(i[0]=k(u=>l(e.row)?c(o).onSection?.(e.row.section):c(o).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:i[1]||(i[1]=k(()=>{},["stop"])),onDblclick:i[2]||(i[2]=k(()=>{},["stop"]))}),null,16)):(m(),v("span",_s)),e.row.letter?(m(),v("span",xs,_(e.row.letter),1)):(m(),v("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Ss)),x("span",{"data-sve-ht-text":"",title:c(o).renameTitle},[!e.row.kind&&!l(e.row)?(m(),v("button",{key:0,type:"button","data-sve-ht-tag":"",title:c(o).tagTitle,onClick:i[3]||(i[3]=k(()=>{},["stop","prevent"])),onPointerdown:i[4]||(i[4]=k(()=>{},["stop"])),onDblclick:i[5]||(i[5]=k(u=>c(o).onTagChange?.(u,e.row.id),["stop","prevent"]))},_(e.row.tag),41,ws)):(m(),v("span",Ps,_(e.row.tag),1)),c(o).editingId===e.row.id&&!l(e.row)?Re((m(),v("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":i[6]||(i[6]=u=>c(o).draft=u),onMousedown:i[7]||(i[7]=k(()=>{},["stop"])),onPointerdown:i[8]||(i[8]=k(()=>{},["stop"])),onClick:i[9]||(i[9]=k(()=>{},["stop"])),onDblclick:i[10]||(i[10]=k(()=>{},["stop"])),onKeydown:[i[11]||(i[11]=k(()=>{},["stop"])),i[12]||(i[12]=q(k(u=>c(o).onRenameCommit?.(),["prevent"]),["enter"])),i[13]||(i[13]=q(k(u=>c(o).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:i[14]||(i[14]=u=>c(o).onRenameCommit?.())},null,544)),[[yt,c(o).draft]]):(m(),v("span",$s,_(e.row.name),1))],8,Cs),l(e.row)?C("",!0):(m(),v("span",Ls,[g(e.row)?(m(),v("button",{key:0,type:"button","data-sve-ht-eye":"",disabled:!c(o).canEdit,title:c(o).canEdit?e.row.hidden?c(o).showTitle:c(o).hideTitle:c(o).lockedTitle,innerHTML:e.row.hidden?Os:Bs,onClick:i[15]||(i[15]=k(u=>c(o).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:i[16]||(i[16]=k(()=>{},["stop"])),onDblclick:i[17]||(i[17]=k(()=>{},["stop"]))},null,40,Es)):C("",!0),c(t)&&e.row.depth===0?(m(),v("button",{key:1,type:"button","data-sve-ht-fields":"",disabled:!c(o).canEdit,title:c(o).canEdit?c(s):c(o).lockedTitle,innerHTML:Rs,onClick:k(n,["stop","prevent"]),onPointerdown:i[18]||(i[18]=k(()=>{},["stop"])),onDblclick:i[19]||(i[19]=k(()=>{},["stop"]))},null,40,Hs)):C("",!0),x("button",{type:"button","data-sve-ht-dup":"",disabled:!c(o).canEdit,title:c(o).canEdit?c(o).duplicateTitle:c(o).lockedTitle,innerHTML:Fs,onClick:i[20]||(i[20]=k(u=>c(o).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:i[21]||(i[21]=k(()=>{},["stop"])),onDblclick:i[22]||(i[22]=k(()=>{},["stop"]))},null,40,Is),x("button",{type:"button","data-sve-ht-del":"",disabled:!c(o).canEdit,title:c(o).canEdit?c(o).deleteTitle:c(o).lockedTitle,innerHTML:js,onClick:i[23]||(i[23]=k(u=>c(o).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:i[24]||(i[24]=k(()=>{},["stop"])),onDblclick:i[25]||(i[25]=k(()=>{},["stop"]))},null,40,Ms)]))],16,ys),e.row.emptyBlock&&!e.row.shut?(m(),v("div",ne({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},c(o).dropId===e.row.id&&c(o).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),_(c(o).slotText),17,As)):C("",!0)],64))}},Le=de(qs,[["__scopeId","data-v-60e221c4"]]),Ks=["data-sve-ht-look"],Vs={key:0,class:"sve-ht-empty"},Ns={key:1,class:"sve-ht-empty"},zs={key:0,class:"sve-ht-empty"},Us={__name:"HtmlTreeList",setup(e){const t=te(()=>Rt(o.query)),s=te(()=>ks(o.rows,t.value)),n=te(()=>s.value.rows),a=te(()=>t.value?o.sections.filter(d=>Dt(d.row,t.value)||d.current&&d.ready&&n.value.length>0):o.sections),l=te(()=>!!t.value&&!a.value.length&&!n.value.length);function r(d){return!!t.value&&!s.value.hits.has(d.path)}return(d,g)=>(m(),v("div",ne({class:"sve-ht-root","data-sve-ht-look":c(o).look,style:c(o).familyStyle},c(o).dragging?{"data-sve-ht-dragging":""}:{}),[!c(o).rows.length&&!c(o).sections.length?(m(),v("div",Vs,_(c(o).emptyText),1)):l.value?(m(),v("div",Ns,_(c(o).searchEmpty),1)):C("",!0),c(o).sections.length?(m(!0),v(L,{key:2},R(a.value,h=>(m(),v("div",ne({key:h.uid},{ref_for:!0},h.current?{"data-sve-ht-branch":""}:{}),[h.ready?(m(),v(L,{key:0},[(m(!0),v(L,null,R(n.value,i=>(m(),me(Le,{key:i.id,row:i,dim:r(i)},null,8,["row","dim"]))),128)),c(o).rows.length?C("",!0):(m(),v("div",zs,_(c(o).emptyText),1))],64)):(m(),me(Le,{key:1,row:h.row},null,8,["row"]))],16))),128)):c(o).rows.length?(m(!0),v(L,{key:3},R(n.value,h=>(m(),me(Le,{key:h.id,row:h,dim:r(h)},null,8,["row","dim"]))),128)):C("",!0)],16,Ks))}},it=de(Us,[["__scopeId","data-v-dc041b26"]]);let Ee=null;function Xs(e){return Ee||(Ee=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{pages:[]}).then(t=>Array.isArray(t.pages)?t.pages:[]).catch(()=>[])),Ee}let ke=null;function He(){ke?.dismiss(),ke=null}function Ys(e,t,s){He();const n=t?.getBoundingClientRect?.(),a={x:n?n.left:0,y:n?n.bottom+4:0};Xs(e).then(l=>{const r=l.length?l.map(d=>({label:d.title||d.url,onPick:()=>{He(),s(d.url)}})):[{label:f(e,"component_props_pages_none"),onPick:null}];He(),ke=ue(e.document,Ue,{items:r,x:a.x,y:a.y,onClose:()=>{ke=null}})})}const Bt="sve-html-tree-labels";function Ot(){try{const e=globalThis.localStorage?.getItem(Bt);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function Ws(e){try{globalThis.localStorage?.setItem(Bt,JSON.stringify(e))}catch{}}function Ft(e){return String(e||"_")}function jt(e){const t=Ot()[Ft(e)];return t&&typeof t=="object"?{...t}:{}}function Zs(e,t,s){const n=s?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function Gs(e,t,s,n){if(!t)return;const a=Ft(e),l=Ot(),r={...l[a]||{}},d=String(s||"").replace(/\s+/g," ").trim(),g=String(n||"").trim();!d||d===g?delete r[t]:r[t]=d,Object.keys(r).length?l[a]=r:delete l[a],Ws(l)}const Js=/^@(media|supports|container|layer|scope)\b/i;function Qs(e){const t=String(e||""),s=[];let n=0,a=0;for(;n<t.length;){if(t[n]==="{"&&t[n+1]==="{"){const d=t.indexOf("}}",n+2);n=d===-1?t.length:d+2;continue}if(t[n]==="/"&&t[n+1]==="*"){const d=t.indexOf("*/",n+2);n=d===-1?t.length:d+2;continue}if(t[n]==='"'||t[n]==="'"){const d=t[n];for(n+=1;n<t.length&&t[n]!==d;)n+=t[n]==="\\"?2:1;n+=1;continue}if(t[n]!=="{"){n+=1;continue}let l=1,r=n+1;for(;r<t.length&&l>0;){if(t[r]==="{"&&t[r+1]==="{"){const d=t.indexOf("}}",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==="/"&&t[r+1]==="*"){const d=t.indexOf("*/",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==='"'||t[r]==="'"){const d=t[r];for(r+=1;r<t.length&&t[r]!==d;)r+=t[r]==="\\"?2:1;r+=1;continue}t[r]==="{"?l+=1:t[r]==="}"&&(l-=1),r+=1}s.push({selector:t.slice(a,n).trim(),body:t.slice(n+1,r-1),from:a,to:r,text:t.slice(a,r).trim()}),n=r,a=r}return s}function lt(e){const t=String(e||""),s=new Set,n=new Set,a=new Set;for(const l of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const r of l[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))r&&(s.add(r),s.add(r.replace(/([:./%!#()[\],])/g,"\\$1")));for(const l of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))l[2].trim()&&n.add(l[2].trim());for(const l of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))a.add(l[1].toLowerCase());return{classes:s,ids:n,tags:a}}function ct(e,t){const s=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),n=[...s.matchAll(/\.((?:\\.|[\w-])+)/g)].map(r=>r[1]),a=[...s.matchAll(/#((?:\\.|[\w-])+)/g)].map(r=>r[1]);if(n.length||a.length){const r=d=>d.replace(/\\(.)/g,"$1");return n.every(d=>t.classes.has(d)||t.classes.has(r(d)))&&a.every(d=>t.ids.has(r(d)))}const l=[...s.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(r=>r[2].toLowerCase());return l.length>0&&l.every(r=>t.tags.has(r))}function ea(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function ta(e,t,s){const n=ea(e);if(!n.length)return"keep";const a=n.filter(r=>ct(r,t));return a.length?a.length===n.length&&!n.some(r=>ct(r,s))?"move":"copy":"keep"}function qt(e,t,s){const n=String(e||""),a=lt(t),l=lt(s),r=[],d=[];let g=0;for(const h of Qs(n)){const i=n.slice(h.from,h.to),u=i.match(/^\s*/)[0];if(g=h.to,Js.test(h.selector)){const $=qt(h.body,t,s);$.move.trim()&&r.push(`${h.selector} {
${$.move.trim()}
}`),$.keep.trim()&&d.push(`${u}${h.selector} {
${$.keep.trim()}
}`);continue}const T=h.selector.startsWith("@")?"keep":ta(h.selector,a,l);if(T==="move"){r.push(h.text);continue}T==="copy"&&r.push(h.text),d.push(i)}return d.push(n.slice(g)),{move:r.join(`

`).trim(),keep:d.join("").replace(/\n{3,}/g,`

`).trim()}}const na="/!/sve/component";function oa(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let s=null;for(const n of t){if(!n.trim())continue;const a=n.match(/^[ \t]*/)[0].length;s=s===null?a:Math.min(s,a)}return s?t.map(n=>n.slice(s)).join(`
`):t.join(`
`)}function sa(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function aa(e,t){if(!An(e))return"";try{return await(await mn(()=>import("./tw-compile-D8Xdoe3O.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(s){return console.error("[sve] component tailwind compile",s),""}}async function ra(e,t){const s=await e.fetch(na,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":bt(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!s.ok){const n=new Error(String(s.status));throw n.status=s.status,n}return s.json()}function dt(e,t){const{from:s,to:n}=Mn(e,t),a=e.slice(s,n);if(!a.trim())return null;const l=e.slice(0,s)+e.slice(n),r=y("dock:css"),d=qt(typeof r=="string"?r:"",a,l);return{html:oa(a),css:d.move,keepCss:d.keep,lead:sa(a),from:s,to:n}}function ia(e,t,{onDone:s,onError:n}={}){if(y("dock:is-locked")===!0)return;const a=y("dock:html");if(typeof a!="string"||!t)return;const l=dt(a,t);if(!l)return;const r=ue(e.document,fn,{heading:f(e,"component_new"),nameLabel:f(e,"component_name"),placeholder:f(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:f(e,"cancel"),saveLabel:f(e,"component_create"),onOk:d=>{r.dismiss(),(async()=>{try{const g=await aa(e,l.html),h=y("dock:html"),i=typeof h=="string"&&h===a?l:dt(h,t);if(!i)return;const u=await ra(e,{name:d,html:i.html,css:i.css,js:"",tw:g}),T=y("dock:html"),$=T.slice(0,i.from)+i.lead+u.tag+T.slice(i.to);y("dock:set-html",$),i.css.trim()&&y("dock:set-css",i.keepCss),s?.(u)}catch(g){n?.(g)}})()}})}function la(e,t,s){const n=String(e||"");if(!t||t.kind!=="antlers")return n;const a=String(s||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?ha(n,t,a):t.tag==="else"||!a?n:n.slice(0,t.from)+`{{ ${t.tag} ${a} }}`+n.slice(t.openTo)}function Oe(e,t,s,n){return oe(e,t,{kind:s,name:n})}function oe(e,t,s={}){const n=String(e||"");if(!t||t.antlers!=="loop")return n;const a=t.loopKind==="collection"?"collection":"field",l=s.kind??a,r=String(s.name??t.expr??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(r))return n;const d=s.sortDir??t.sortDir??"",g=String(s.sortField??t.sortField??"").trim(),h=String(s.limit??t.limit??"").trim(),i=Kt(n,t);if(!i)return n;const u=l===a?t.params:"",T=l==="collection"?ca(r,g,d,h,u):da(r,g,d,h,u),$=l==="collection"?"collection":r;return n.slice(0,t.from)+T+n.slice(t.openTo,i.from)+`{{ /${$} }}`+n.slice(i.to)}function ca(e,t,s,n,a){const l=ua(a).replace(/\bsort\s*=\s*["'][^"']*["']/g,"").replace(/\blimit\s*=\s*["']?\d+["']?/g,"").replace(/\s+/g," ").trim(),r=[`collection from="${e}"`];return s==="random"?r.push('sort="random"'):t&&r.push(`sort="${t}${s==="desc"?":desc":":asc"}"`),n&&r.push(`limit="${n}"`),l&&r.push(l),`{{ ${r.join(" ")} }}`}function da(e,t,s,n,a){const l=String(a||"").split("|").map(d=>d.trim()).filter(d=>d&&!/^from\s*=/.test(d)&&!/^sort\s*:/.test(d)&&!/^reverse$/.test(d)&&!/^shuffle$/.test(d)&&!/^limit\s*:/.test(d)),r=[e,...l];return s==="random"?r.push("shuffle"):t&&(r.push(`sort:${t}`),s==="desc"&&r.push("reverse")),n&&r.push(`limit:${n}`),`{{ ${r.join(" | ")} }}`}function ua(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function Kt(e,t){const n=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return n?{from:t.from+n.index,to:t.from+n.index+n[0].length}:null}function ha(e,t,s){return oe(e,t,{name:s})}function pa(e,t,s){const n=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return n;const a=Kt(n,t);if(!a)return n;const r=(n.slice(0,a.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],d=s==="else"?"{{ else }}":"{{ elseif true }}";return`${n.slice(0,a.from)}${d}
${r}${n.slice(a.from)}`}const E=Fn("sve-call-values"),re=new Set;let ut=null;const fa="__sve-html-tree-style",D=new Set;let Fe="",Y=!1,Ie=null,he=!0,B="",ie=0,Vt="";const W=new Map,se=new Set;let I="",Nt=!1,P=null,ye=null,be=0,je=null,le=[],V=null,ae=null,Te=null,_e=null,qe=null,xe=!1,N=null,K=null;function A(e){return e.getElementById(ve)}function ma(e){gn(e,fa,`
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
       colour per family of tag on the icon and the chip. The colours are the
       one table in lib/tag-families.js — the HTML pane paints a tag name, an
       Antlers block and a partial call from the same seven, so the tree and
       the pane say the same thing about the same line.
       Everything above is the classic look, untouched. The switch in Live
       Preview settings (HTML_TREE_LOOK_KEY) decides which value the list
       wears as data-sve-ht-look, and every rule here hangs off that. */
    [data-sve-ht-look="tags"] {
      ${st("light")}
      --sve-ht-pick: rgba(56,88,233,.14);
      --sve-ht-pick-hover: rgba(56,88,233,.22);
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${st("dark")}
      --sve-ht-pick: rgba(56,88,233,.3);
      --sve-ht-pick-hover: rgba(56,88,233,.4);
    }
    /* The family's colour, on a row and on the guide an ancestor of that
       family leaves under itself. */
    [data-sve-ht-look="tags"] [data-sve-ht-row],
    [data-sve-ht-look="tags"] [data-sve-ht-cat="other"] { --sve-ht-c: var(--sve-fam-other); }
    [data-sve-ht-look="tags"] [data-sve-ht-cat="layout"] { --sve-ht-c: var(--sve-fam-layout); }
    [data-sve-ht-look="tags"] [data-sve-ht-cat="text"] { --sve-ht-c: var(--sve-fam-text); }
    [data-sve-ht-look="tags"] [data-sve-ht-cat="media"] { --sve-ht-c: var(--sve-fam-media); }
    [data-sve-ht-look="tags"] [data-sve-ht-cat="loop"] { --sve-ht-c: var(--sve-fam-loop); }
    [data-sve-ht-look="tags"] [data-sve-ht-cat="if"] { --sve-ht-c: var(--sve-fam-if); }
    [data-sve-ht-look="tags"] [data-sve-ht-cat="component"] { --sve-ht-c: var(--sve-fam-component); }

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

    /* One guide per level, drawn on the spacer: 14px per level with the line
       7px in, so each sits under the twist of the row it descends from — in
       that row's family colour, held back. The negative margin cancels the
       row gap, so a depth-0 row starts flush. */
    [data-sve-ht-look="tags"] [data-sve-ht-indent] {
      display: flex;
      flex: none;
      align-self: stretch;
      width: calc(var(--sve-ht-depth, 0) * 14px);
      margin-right: -5px;
      pointer-events: none;
    }
    [data-sve-ht-look="tags"] [data-sve-ht-indent] i {
      display: block;
      flex: none;
      width: 14px;
      background: linear-gradient(to right, transparent 7px, var(--sve-ht-c) 7px, var(--sve-ht-c) 8px, transparent 8px);
      opacity: .5;
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
  `)}function H(){const e=y("dock:html");return typeof e=="string"?e:""}function zt(e){return!!y("dock:is-open",e)}function ee(e){return Ze()?!1:y("dock:set-html",e)===!0}function ht(e){const t=y("dock:component-exit-state")||{};if(o.exitOpen=!!t.open,!t.open){o.onExit=null;return}o.exitName=t.name||"",o.exitLabel=f(e,"component_exit"),o.exitTitle=f(e,t.back?"component_exit_back":"component_exit_close"),o.onExit=()=>{y("dock:exit-component"),w(e)}}function va(e,t){const s=Cn(e);if(!s||t.type!==s)return"";const n=wn(t[s]);return n&&Pn(e,n)?.section_type||""}const ce=[];let Me=!1;function Ae(e,t){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(t,{timeout:2e3});return}e.setTimeout(t,200)}function ga(e,t){for(const s of t){const n=s.type;!n||W.has(n)||se.has(n)||ce.includes(n)||ce.push(n)}Ne.htmlTreePrefetchArmed&&Ut(e)}function Qa(e){Ne.htmlTreePrefetchArmed=!0,Ut(e)}function Ut(e){if(Me||!ce.length)return;Me=!0;const t=()=>{const s=ce.shift();if(!s){Me=!1;return}if(W.has(s)||se.has(s)){Ae(e,t);return}se.add(s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(s)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{typeof n?.html=="string"&&W.set(s,n.html)}).catch(()=>{}).finally(()=>{se.delete(s),Ae(e,t)})};Ae(e,t)}function Ze(){return!!I}function ka(e){const t=new Map,s=Tt(e);if(!s)return t;for(const n of s.querySelectorAll("[data-sid]")){const a=n.getAttribute("data-sid");a&&!t.has(a)&&t.set(a,n.tagName.toLowerCase())}return t}function ya(e,t){const s=ze(e)||"page_sections";for(const n of wt(t)||[]){const a=Pt(n.values),l=a&&typeof a=="object"?a[s]:null;if(Array.isArray(l))return!0}return!1}function Xt(e,t){const s=ze(e)||"page_sections",n=ka(e),a=[];for(const l of wt(t)||[]){const r=Pt(l.values),d=r&&typeof r=="object"?r[s]:null;if(Array.isArray(d)){d.forEach(g=>{if(!g||typeof g!="object"||Array.isArray(g)||typeof g.type!="string")return;const h=[g._visual_id,g.id,g._id].filter(O=>typeof O=="string"&&O!=="");if(!h.length)return;const i=va(e,g)||g.type,u=typeof g._sve_label=="string"?g._sve_label.trim():"",T=h.map(O=>n.get(O)).find(Boolean)||"section",$=jt(g.type)[`0:${T}`];a.push({uid:h[0],ids:h,type:g.type,tag:T,label:(typeof $=="string"&&$.trim()?$.trim():"")||u||$t(e,i)?.display||Be(i)||i,svg:Ht(T,"",null).svg||jn.section,cat:St(T),enabled:g.enabled!==!1})});break}}return a}function ba(e,t,s){if(!s.length)return"";const n=y("dock:current-type")||"",a=y("dock:current-uid"),l=!!y("dock:component-exit-state")?.open;if(a){const r=xn(a,t),d=s.find(g=>g.ids.some(h=>r.includes(h)));if(d&&(l||d.type===n))return d.uid}return s.find(r=>r.type===n)?.uid||""}function Ta(e,t,s){const n=y("dock:component-exit-state");if(n?.open)return Be(n.name)||n.name||"";if(s)return t.find(l=>l.uid===s)?.label||"";const a=y("dock:current-type")||"";return $t(e,a)?.display||Be(a)||""}function Yt(e,t,s,n,a){const l=s.find(d=>d.uid===n);if(!l||n===a)return;D.clear(),P=null,he=!1,Z(),we(),B=n,Vt=H(),I=W.get(l.type)||"",I&&(P=Se(Ye(I))||null),Nt=(y("dock:current-type")||"")===l.type,e.clearTimeout(ie),ie=e.setTimeout(()=>{B="",Y=!1,w(e)},4e3),w(e);const r=()=>En(l.uid,t,e,{clampToSection:!0});Sn(l.uid,t,e,r),G({source:Q,type:J.SVE_ACTIVATE,ids:l.ids},e),e.setTimeout(()=>w(e),0)}function Wt(e,t){if(!t)return!1;for(const s of e||[])if(s.id===t||Wt(s.children,t))return!0;return!1}function Se(e){for(const t of e||[]){if(!t.kind)return t.id;const s=Se(t.children);if(s)return s}return""}function _a(e,t){return D.has(e.path)?t===0:t>0}function xa(e){const t=new Set,s=(n,a)=>{for(const l of n)l.children.length&&_a(l,a)&&t.add(l.id),s(l.children,a+1)};return s(e,0),t}function w(e){const t=e.document,n=A(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;ma(t),Dn(e);const a=H();I&&I===a&&(I="");const l=I||a,r=Ye(l);le=r;const d=y("dock:current-type")||"",g=jt(d),h=Xt(e,t),i=ya(e,t);d&&a&&!I&&W.set(d,a),ga(e,h);const u=ba(e,t,h);if(i&&!h.length){le=[],o.rows=[],o.sections=[],o.pageBuilder=!0,o.emptyText=f(e,"html_tree_empty"),o.canEdit=!y("dock:is-locked"),o.look=at(e),o.onRefresh=()=>w(e),o.onSection=null,ht(e),ge(n,it),pt(e,[]);return}o.pageBuilder=i;const T=`${d}|${u}`;let $=!1;T!==Fe&&(Fe=T,D.clear(),Ie!==null&&l!==Ie?$=!0:Y=l),($||Y!==!1&&l!==Y)&&(Y=!1,D.clear(),P=Se(r)||null),Ie=l,B&&(B===u||!h.length)&&(Nt||l!==Vt)&&(e.clearTimeout(ie),B="",Y=!1,Wt(r,P)||(D.clear(),P=Se(r)||null));const O=h.some(p=>p.uid===B)?B:"",U=he?"":O||u,en=!!(O||u),X=Bn(r,o.query?new Set:xa(r));!l.trim()&&!zt(t)?o.emptyText=f(e,"html_tree_need_dock"):o.emptyText=f(e,"html_tree_empty"),o.slotText=f(e,"antlers_drop_here"),o.dataTitle=f(e,"data_vars_title"),o.pageTitle=f(e,"component_props_page"),o.renameTitle=f(e,"html_tree_rename"),o.tagTitle=f(e,"tw_tag"),o.hideTitle=f(e,"html_tree_hide"),o.showTitle=f(e,"html_tree_show"),o.duplicateTitle=f(e,"html_tree_duplicate"),o.deleteTitle=f(e,"html_tree_delete"),o.lockedTitle=f(e,"html_tree_locked"),o.searchEmpty=f(e,"html_tree_search_empty"),o.canEdit=!y("dock:is-locked"),o.look=at(e),_n(e),o.onQuery=()=>w(e),ht(e),o.onSelect=p=>{const b=X.find(S=>S.id===p);b&&Et(e,b.path)||Je(e,p,X)},o.onTwist=p=>{const b=X.find(S=>S.id===p)?.path;b&&(D.has(b)?D.delete(b):D.add(b),w(e))},o.onTagChange=(p,b)=>{const S=o.rows.find(F=>F.id===b);S&&!Ze()&&On(e,p.currentTarget,S)},o.onRename=p=>Ca(e,p),o.onRenameCommit=()=>ft(e,!0),o.onRenameCancel=()=>ft(e,!1),o.onHide=p=>wa(e,p),o.onDuplicate=p=>Pa(e,p),o.onDelete=p=>La(e,p),o.onPointerDown=(p,b)=>Ma(e,p,b),o.onContext=(p,b)=>Ha(e,p,b),o.onInspectCommit=p=>Fa(e,p),o.onPropValue=(p,b,S)=>gt(e,p,b,S),o.onPropPage=(p,b)=>Ys(e,p,S=>gt(e,b,S,!1)),o.onLoopKind=p=>ja(e,p),o.onAddBranch=p=>qa(e,p),o.onLoopSortField=p=>{const b=Ce(),S=String(p||"").trim();if(!b)return;const F=K?.id===b.id?K.dir:"",fe=b.sortDir||F||"asc";K=null,z(e,(tn,nn)=>oe(tn,nn,{sortField:S,sortDir:fe}))},o.onLoopSortDir=p=>{const b=Ce(),S=String(p||"");if(b){if((S==="asc"||S==="desc")&&!b.sortField){K={id:b.id,dir:S},Ke(e,b);return}K=null,z(e,(F,fe)=>oe(F,fe,{sortDir:S,sortField:S==="asc"||S==="desc"?fe.sortField:""}))}},o.onLoopLimit=p=>z(e,(b,S)=>oe(b,S,{limit:String(p||"").replace(/\D/g,"")})),o.onPropHost=p=>p?E.mount(p):E.unmount(),o.onInspectData=(p,b)=>{y("dock:data-menu",{anchor:p,at:X.find(S=>S.id===P)?.from,onPick:S=>b(String(S?.var||"").trim())})};const et=X.find(p=>!p.kind)?.id,tt=Ta(e,h,U),pe=U?h.find(p=>p.uid===U):null;o.rows=X.map(p=>{const b=Ht(p.tag,p.kind,p.antlers),S=p.id===et&&tt?tt:p.klass,F=p.id===et;return{...p,base:S,name:Zs(S,p.path,g),current:p.id===P,letter:b.letter||"",svg:F&&pe?pe.svg:b.svg||"",cat:St(p.tag,p.kind,p.antlers),sectionRoot:F&&pe?pe.uid:""}});const Pe=[];for(const p of o.rows)Pe.length=p.depth,p.guides=Pe.slice(),Pe[p.depth]=p.cat;o.sections=en?h.map(p=>{const b=!!U&&p.uid===U;return{...p,current:b,ready:b&&(!O||!!I),row:{id:`sec:${p.uid}`,section:p.uid,tag:p.tag,name:p.label,kind:"",svg:p.svg,cat:p.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:b,hidden:!p.enabled}}}):[],o.onSection=p=>Yt(e,t,h,p,U),o.onRefresh=()=>w(e),Ke(e,o.rows.find(p=>p.id===P)),ge(n,it),pt(e,r)}function pt(e,t){A(e.document)&&Zt(e,t)}function Zt(e,t){const s=t[0],n=!!y("dock:component-src"),a=n?"":y("dock:current-uid")||"";G({source:Q,type:J.SVE_HTML_PICK,on:!0,uid:a,all:n,tag:s?.tag||"",klass:s?.klass||"",nodes:oo(t)},e)}function Sa(e){if(!e)return;const t=(s,n)=>{for(const a of s||[]){if(a.path===e)return!0;if(t(a.children,n+1))return n===0?D.delete(a.path):D.add(a.path),!0}return!1};t(le,0)}function Ca(e,t){if(xe)return;const s=o.rows.find(n=>n.id===t);!s||s.kind||(P=t,o.rows.forEach(n=>{n.current=n.id===t}),o.editingId=t,o.draft=s.name,e.setTimeout(()=>{const n=A(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function ft(e,t){const s=o.editingId;if(!s)return;const n=o.rows.find(a=>a.id===s);o.editingId=null,t&&n&&Gs(y("dock:current-type")||"",n.path,o.draft,n.base||n.klass),o.draft="",w(e)}function wa(e,t){Ge(e,t,Gn)}function Pa(e,t){Ge(e,t,Jn)}function Gt(e,t){$n(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const s=e.document;Hn({uid:t},s,e)})}function $a(e,t,s){B===s&&(e.clearTimeout(ie),B="",I=""),P=null,he=!1,Fe="";const n=Xt(e,t),a=n.find(l=>l.uid!==s)||n[0];a?Yt(e,t,n,a.uid,""):(I="",o.rows=[],o.sections=[],o.pageBuilder=!0,w(e)),e.setTimeout(()=>{A(e.document)&&w(e)},0)}Ct("row:removed",({uid:e,parentPath:t,doc:s,win:n})=>{t!==ze(n)||!A(n.document)||$a(n,s,e)});function La(e,t){const s=o.sections?.find(a=>a.row?.id===t),n=s?s.row?.section||s.uid:o.rows.find(a=>a.id===t)?.sectionRoot;if(n){Gt(e,n);return}Ge(e,t,Qn)}function Ge(e,t,s){if(y("dock:is-locked"))return;const n=H(),a=o.rows.find(r=>r.id===t);if(!a)return;const l=s(n,a);l!==n&&ee(l)}function Z(){N?.dismiss(),N=null}function Ea(e,t,s){const n=s.row?.section||s.uid;n&&(N=ue(e.document,Ue,{items:[{label:f(e,"html_tree_remove_section"),danger:!0,onPick:()=>{Z(),Gt(e,n)}}],x:t.clientX,y:t.clientY,onClose:()=>{N=null}}))}function Ha(e,t,s){Z();const n=o.sections?.find(d=>d.row?.id===s);if(n){Ea(e,t,n);return}const a=o.rows.find(d=>d.id===s);if(!a)return;Je(e,s,o.rows);const l={x:t.clientX,y:t.clientY},r=d=>{d.length&&(N?.dismiss(),N=ue(e.document,Ue,{items:d,x:l.x,y:l.y,onClose:()=>{N=null}}))};if(a.kind==="component"){Ia(e,a,r);return}o.canEdit&&r([{label:f(e,"component_make"),onPick:()=>{Z(),ia(e,a,{onDone:()=>w(e),onError:d=>{e.alert(d?.status===409?f(e,"component_exists"):f(e,"component_failed"))}})}}])}const mt=(e,t)=>{Z(),y("dock:open-template",t)};function Ia(e,t,s){if(!Kn(t.src)){s([{label:f(e,"component_open_named",{name:t.name||t.src}),onPick:()=>mt(e,`view:partials/${t.src}`)}]);return}s([{label:f(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const a=Array.isArray(n.items)?n.items:[];s(a.length?a.map(l=>({label:f(e,"component_open_named",{name:l.label}),onPick:()=>mt(e,l.type)})):[{label:f(e,"component_none"),onPick:null}])}).catch(()=>s([{label:f(e,"component_none"),onPick:null}]))}function Ma(e,t,s){if(t.button!==0||y("dock:is-locked")||o.editingId||t.target?.closest?.("button, input"))return;we(),V=s,ae={x:t.clientX,y:t.clientY},Te=t.currentTarget,_e=t.pointerId;const n=l=>Aa(e,l),a=l=>Ra(e,l);qe=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),qe=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function Aa(e,t){if(!V||!ae)return;const s=t.clientX-ae.x,n=t.clientY-ae.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{Te?.setPointerCapture?.(_e)}catch{}}t.preventDefault();const a=e.document.elementFromPoint(t.clientX,t.clientY),l=a?.closest?.("[data-sve-ht-slot]");if(l){const u=l.getAttribute("data-sve-ht-id");if(u&&u!==V){o.dropId=u,o.dropPlace="inside";return}}const r=a?.closest?.("[data-sve-ht-row]"),d=r?.getAttribute("data-sve-ht-id");if(!d||d===V){o.dropId=null,o.dropPlace=null;return}const g=o.rows.find(u=>u.id===d),h=o.rows.find(u=>u.id===V);if(!g||h&&g.path.startsWith(`${h.path}/`)){o.dropId=null,o.dropPlace=null;return}const i=r.getBoundingClientRect();o.dropId=d,o.dropPlace=Wn(t.clientY-i.top,i.height,!It(g.tag)&&g.kind!=="component")}function Ra(e,t){const s=V,n=o.dropId,a=o.dropPlace||"after",l=o.dragging;if(we(),l&&(xe=!0,e.setTimeout(()=>{xe=!1},0)),!l||y("dock:is-locked")||!s||!n||s===n)return;t?.preventDefault?.();const r=H(),d=Zn(r,le,s,n,a);d!==r&&ee(d)}function we(){try{Te?.releasePointerCapture?.(_e)}catch{}qe?.(),V=null,ae=null,Te=null,_e=null,o.dragging=!1,o.dropId=null,o.dropPlace=null}function Jt(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function Ke(e,t){if(t?.kind==="component"){Da(e,t);return}if(M.callOpen&&(M.callOpen=!1,M.callStore=null,E.forget(),Xe(e)),t?.kind!=="antlers"){o.inspect=null;return}const s=t.id;if(t.tag==="else"){o.inspect={key:s,title:f(e,"antlers_condition"),mode:"note",note:f(e,"antlers_else_note")};return}if(t.antlers==="loop"){const n=t.loopKind==="collection",a=K?.id===t.id?K.dir:"",l=t.sortDir||a;o.inspect={key:s,title:f(e,"antlers_loop"),mode:"loop",loopKind:n?"collection":"field",kinds:[{id:"field",label:f(e,"antlers_loop_field")},{id:"collection",label:f(e,"antlers_loop_collection")}],collections:Jt(e),value:t.expr||"",placeholder:f(e,n?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:f(e,"antlers_sort"),dir:l,needsField:l==="asc"||l==="desc",field:t.sortField||"",pickable:!n,placeholder:f(e,n?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:f(e,"antlers_sort_none")},{id:"asc",label:f(e,"antlers_sort_asc")},{id:"desc",label:f(e,"antlers_sort_desc")},{id:"random",label:f(e,"antlers_sort_random")}]},limit:{title:f(e,"antlers_limit"),value:t.limit||"",placeholder:f(e,"antlers_limit_placeholder")},branches:[]};return}o.inspect={key:s,title:f(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:f(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:f(e,"antlers_add_elseif")},{id:"else",label:f(e,"antlers_add_else")}]}}function Da(e,t){if(!Vn(e)){o.inspect=null;return}if(!t.src)return;const s=t.id;if(o.inspect={key:s,title:f(e,"component_props_values"),mode:"note",note:f(e,"code_dock_loading")},Nn()){const n={},a={},l=new Map;for(const[r,d]of zn(H().slice(t.from,t.to))){const g=Un(r);g&&(r!==g||!l.has(g))&&l.set(g,d)}for(const[r,d]of l)d.bound?a[r]=d.value:n[r]=d.value;ut!==s&&(ut=s,re.clear());for(const r of re)r in a||(a[r]="");o.inspect=null,M.callOpen=!0,M.title=M.title||f(e,"component_props"),M.callTitle=t.klass||t.name||t.src,M.callStore=E.ui,E.ui.canBind=!0,E.ui.dataTitle=f(e,"data_vars_title"),E.ui.exprPlaceholder=f(e,"component_props_expr"),E.ui.onToggleBind=(r,d)=>Oa(e,r,d),E.ui.onExpr=(r,d)=>vt(e,r,d),E.ui.onPickData=(r,d)=>y("dock:data-menu",{anchor:d,at:t.from,onPick:g=>vt(e,r,String(g?.var||"").trim())}),E.load(e,{key:`${t.src}::${s}`,src:t.src,params:n,bindings:a,readOnly:y("dock:is-locked")===!0}),E.watch(e,{src:t.src,write:r=>Ba(e,r,a)}),Xe(e);return}Xn(e,t.src).then(n=>{if(o.inspect?.key===s){if(!n.length){o.inspect={key:s,title:f(e,"component_props_values"),mode:"note",note:f(e,"component_props_values_none")};return}o.inspect={key:s,title:f(e,"component_props_values"),mode:"props",inheritLabel:f(e,"component_props_inherit"),rows:Yn(n,H().slice(t.from,t.to))}}})}function Ba(e,t,s={}){const n=o.rows.find(r=>r.id===P);if(n?.kind!=="component"||y("dock:is-locked"))return;let a=H(),l=n.to;for(const[r,d]of Object.entries(t||{})){if(r in s)continue;const g=a.length,h=We(a,{from:n.from,to:l},r,d);h!==a&&(l+=h.length-g,a=h)}a!==H()&&(ee(a),w(e))}function Oa(e,t,s){s?re.add(t):re.delete(t),Qt(e,t,"",s),w(e)}function vt(e,t,s){re.add(t),Qt(e,t,s,!0),w(e)}function Qt(e,t,s,n){const a=o.rows.find(d=>d.id===P);if(a?.kind!=="component"||y("dock:is-locked"))return;const l=H(),r=We(l,a,t,s,{bound:n});r!==l&&ee(r)}function Ce(){const e=o.rows.find(t=>t.id===P);return e?.kind==="antlers"&&!y("dock:is-locked")?e:null}function z(e,t){const s=Ce();if(!s)return;const n=H(),a=t(n,s);a!==n&&(ee(a),w(e))}function gt(e,t,s,n){const a=o.rows.find(d=>d.id===P);if(a?.kind!=="component"||y("dock:is-locked"))return;const l=H(),r=We(l,a,t,s,{bound:n});r!==l&&(ee(r),w(e))}function Fa(e,t){z(e,(s,n)=>n.antlers==="loop"?Oe(s,n,n.loopKind==="collection"?"collection":"field",t):la(s,n,t))}function ja(e,t){const s=Ce();if(!s||s.antlers!=="loop")return;const n=s.loopKind==="collection"?"collection":"field";if(t!==n){if(t==="collection"){const a=Jt(e)[0]?.handle;if(!a)return;z(e,(l,r)=>Oe(l,r,"collection",a));return}z(e,(a,l)=>Oe(a,l,"field",l.handle||"items"))}}function qa(e,t){z(e,(s,n)=>pa(s,n,t))}function Ka(e,t){if(!e||!t||t.kind==="component"||It(t.tag))return null;const s=qn(e,t);if(s<t.openTo)return null;const n=e.lastIndexOf(`
`,s-1)+1;return e.slice(n,s).trim()===""&&n>t.openTo?n-1:s}function Je(e,t,s){if(xe)return;const n=(s||o.rows).find(a=>a.id===t);n&&(P=t,o.rows.forEach(a=>{a.current=a.id===t}),Ke(e,n),!Ze()&&(y("dock:reveal-html",{from:n.from,to:n.to,caret:Ka(H(),n)}),y("dock:tw-follow"),G({source:Q,type:J.SVE_HTML_PICK_FOCUS,path:n.path},e)))}function Va(e,t){if(!t)return"";const s=[],n=(a,l)=>{for(const r of a||[]){const d=l||r.path===e;r.kind==="component"&&r.src===t&&s.push({path:r.path,inside:d}),n(r.children,d)}};return n(le,!1),(s.find(a=>a.inside)||s[0])?.path||""}function Na(e,t){if(!t||!A(e.document))return;he=!1,Sa(t),w(e);const s=o.rows.find(n=>n.path===t);s&&(Je(e,s.id,o.rows),e.setTimeout(()=>{A(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function Ve(e){if(ye)return;const t=()=>{o.editingId||o.dragging||(e.clearTimeout(be),be=e.setTimeout(()=>{A(e.document)&&w(e)},80))},s=()=>t();ye=Ct("dock:html-changed",t),e.document.addEventListener("sve-page-structure",s),je=()=>{e.document.removeEventListener("sve-page-structure",s)}}function za(e){ye?.(),ye=null,je?.(),je=null,e?.clearTimeout?.(be),be=0}function Qe(e){const t=A(e.document);if(G({source:Q,type:J.SVE_HTML_PICK,on:!1},e),za(e),E.forget(),M.callOpen=!1,M.callStore=null,Xe(e),we(),Z(),Rn(e),P=null,o.inspect=null,o.editingId=null,o.draft="",o.sections=[],o.pageBuilder=!1,B="",e?.clearTimeout?.(ie),!t){De(e);return}t.remove(),Ne.headerTab==="html_tree"&&Ln(e,null),vn(e),_t(e),xt(e),De(e)}function er(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=ve,ge(t,At,{title:f(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>Qe(e)))}function tr(e){Ve(e),w(e)}function Ua(e){const t=e.document;if(!kn(e,"html_tree"))return;if(A(t)){Ve(e),w(e);return}if(!zt(t))return;he=!0,D.clear(),yn(e,[ve]);const s=t.createElement("div");s.id=ve,s.style.cssText=bn,ge(s,At,{title:f(e,"html_tree")}),s.querySelector("[data-sve-close]")?.addEventListener("click",()=>Qe(e)),Tn(e,s),_t(e),xt(e),De(e),Ve(e),w(e)}function nr(e){if(A(e.document)){Qe(e);return}Ua(e)}Lt("html-tree:from-preview",({path:e,src:t}={})=>{Et(window,e)||Na(window,Va(e,t)||e)});Lt("html-tree:arm-pick",e=>{const t=window;return e?(Zt(t,Ye(H())),!0):(A(t.document)||G({source:Q,type:J.SVE_HTML_PICK,on:!1},t),!0)});function or(){W.clear(),se.clear(),ce.length=0}export{fa as HTML_TREE_STYLE_ID,Qa as armHtmlTreePrefetch,or as clearHtmlTreeTemplates,Z as closeHtmlTreeMenu,Qe as closeHtmlTreePanel,ma as ensureHtmlTreeStyles,er as fillHtmlTreePane,P as htmlTreeActiveId,A as htmlTreePanel,be as htmlTreeTimer,ye as htmlTreeUnhook,Ua as openHtmlTreePanel,w as renderHtmlTree,tr as showHtmlTreePane,za as stopWatchHtmlTreeDock,nr as toggleHtmlTreePanel,Ve as watchHtmlTreeDock};
