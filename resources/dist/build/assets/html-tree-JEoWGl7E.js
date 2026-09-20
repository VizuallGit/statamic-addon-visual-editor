const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-D8Xdoe3O.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{_ as be,k as z,l as bn,p as Pt,o as v,a as g,b as T,s as b,t as S,F as H,w as Te,d as K,b4 as _n,g as $,v as Lt,b5 as xn,y,h as p,j as ne,C as Tn,i as Et,b6 as dt,b7 as ut,b8 as Sn,b9 as Cn,ba as wn,bb as Ht,z as re,ap as $n,bc as o,u as d,f as Pn,e as Ln,q as W,x as En,bd as Se,be as Hn,B as pe,c as he,N as In,G as An,aN as et,aq as Ne,am as Mn,aP as It,aQ as At,af as Rn,ag as ht,S as Ce,V as we,O as Dn,aO as On,an as Bn,ao as Fn,bf as pt,bg as jn,U as Mt,A as Rt,a8 as tt,J as Dt,K as Ot,ax as Bt,ay as ze,I as qn,bh as Kn,aS as Vn,aT as Nn,aw as zn,bi as Un,b0 as Xn,ae as Ft,aK as Wn,aF as Yn}from"./addon-HeaZlomH.js";import{M as ie,S as le}from"./protocol-D3FYhCm9.js";import{canEditFields as Gn,currentSetHandle as Zn,openFieldsetOverlay as jt}from"./section-fields-p8lPavW8.js";import{D as F,E as Jn,F as nt,G as Qn,t as eo,I as ot,v as to,z as no,b as Re,l as ft,J as qt,q as oo,K as Kt,L as so,H as ao,M as st,N as Vt,O as ro,h as io,c as lo,Q as co,R as uo,S as ho,T as po,U as fo,V as mo,W as vo,X as go,Y as ko,Z as yo}from"./tw-classes-Cbz6G8OJ.js";import{a as bo}from"./html-pick-align-CK-9iH9_.js";import"./ai-text-icon-B7uCWIwa.js";import"./FieldsetOverlay-C76TZsNS.js";const _o={class:"sve-dialog__title"},xo={for:"sve-new-section-group"},To=["value"],So={for:"sve-new-section-name"},Co=["placeholder"],wo={key:1,class:"sve-dialog__toggle"},$o={key:2,class:"sve-dialog__note"},Po={class:"sve-dialog__actions"},Lo=["disabled"],Eo=["disabled"],Ho={__name:"NewSectionPrompt",props:{heading:{type:String,required:!0},groupLabel:{type:String,required:!0},nameLabel:{type:String,required:!0},placeholder:{type:String,default:""},note:{type:String,default:""},groups:{type:Array,required:!0},toggleLabel:{type:String,default:""},toggleOn:{type:Boolean,default:!0},cancelLabel:{type:String,required:!0},saveLabel:{type:String,required:!0},onOk:{type:Function,required:!0},onClose:{type:Function,required:!0}},setup(e){const t=e,s=z(""),n=z(t.groups[0]?.key??""),a=z(t.toggleOn),i=z(null),r=z(!1);bn(()=>Pt(()=>i.value?.focus()));function c(){const u=s.value.trim();if(!u||t.groups.length&&!n.value||r.value){i.value?.focus();return}r.value=!0,t.onOk(u,n.value,a.value)}function k(u){u.target===u.currentTarget&&t.onClose()}function m(u){u.key==="Enter"?c():u.key==="Escape"&&t.onClose()}return(u,l)=>(v(),g("div",{class:"sve-dialog-overlay",onClick:k},[T("div",{class:"sve-dialog",onClick:l[4]||(l[4]=b(()=>{},["stop"]))},[T("div",_o,S(e.heading),1),e.groups.length?(v(),g(H,{key:0},[T("label",xo,S(e.groupLabel),1),Te(T("select",{id:"sve-new-section-group","onUpdate:modelValue":l[0]||(l[0]=h=>n.value=h),onKeydown:m},[(v(!0),g(H,null,K(e.groups,h=>(v(),g("option",{key:h.key,value:h.key},S(h.display),9,To))),128))],544),[[_n,n.value]])],64)):$("",!0),T("label",So,S(e.nameLabel),1),Te(T("input",{id:"sve-new-section-name",ref_key:"input",ref:i,"onUpdate:modelValue":l[1]||(l[1]=h=>s.value=h),type:"text",placeholder:e.placeholder,onKeydown:m},null,40,Co),[[Lt,s.value]]),e.toggleLabel?(v(),g("label",wo,[Te(T("input",{"onUpdate:modelValue":l[2]||(l[2]=h=>a.value=h),type:"checkbox",onKeydown:m},null,544),[[xn,a.value]]),T("span",null,S(e.toggleLabel),1)])):$("",!0),e.note?(v(),g("p",$o,S(e.note),1)):$("",!0),T("div",Po,[T("button",{type:"button",class:"is-cancel",disabled:r.value,onClick:l[3]||(l[3]=(...h)=>e.onClose&&e.onClose(...h))},S(e.cancelLabel),9,Lo),T("button",{type:"button",class:"is-primary",disabled:r.value,onClick:c},S(e.saveLabel),9,Eo)])])]))}},Nt=be(Ho,[["__scopeId","data-v-3ef3bbc9"]]),zt="/!/sve/section-types",Io="static_sections";async function Ao(e){const t=await e.fetch(zt,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!t.ok)throw new Error(`section-types ${t.status}`);const s=await t.json(),n=new Map;for(const a of s.types||[])a?.group&&a.group!==Io&&!n.has(a.group)&&n.set(a.group,a.group_display||a.group);return[...n].map(([a,i])=>({key:a,display:i}))}const ve=new Map;function Mo(e){e?.handle&&ve.set(e.handle,{static:!!e.static,hidden:!!e.hidden})}function Ro(e,t){return t?ve.has(t)?ve.get(t).static:e.Statamic?.$config?.get?.("sveSetMeta")?.[t]?.static===!0:!1}function Do(e,t){if(!t)return!1;if(ve.has(t))return ve.get(t).hidden;const s=e.Statamic?.$config?.get?.("sveSectionTypes");return Array.isArray(s)&&s.some(n=>n?.handle===t&&n.hidden===!0)}async function Ut(e,t,s){const n=await e.fetch(zt,{method:t,headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Et(e),Accept:"application/json"},credentials:"same-origin",body:JSON.stringify(s)}),a=await n.json().catch(()=>({}));if(!n.ok){const i=new Error(a.error||`section-types ${n.status}`);throw i.reason=a.error,i}return Mo(a.section),a}function Oo(e,{display:t,group:s="",static:n=!1,hidden:a=!1}){return Ut(e,"POST",{display:t,group:s,static:n,hidden:a})}function mt(e,{handle:t,hidden:s,fields:n=!1}){const a={handle:t,fields:n};return typeof s=="boolean"&&(a.hidden=s),Ut(e,"PATCH",a)}async function Bo(e,t,s=null){if(!t||typeof dt!="function"||typeof ut!="function")return null;const n=await dt(e,t);if(!n)return null;const a=Sn(),i=Cn(e,"page",{handle:t},n?.defaults,a),r=wn(i,n?.new||{},n?.defaults);return ut(e,e.document,s,i,r)?i:null}const vt=700,Fo=17;function jo(e,t){const s=(t||[]).filter(Boolean);if(!s.length)return;let n=0;const a=()=>{n+=1;const i=Ht(e),r=i?s.some(c=>i.querySelector(`[data-sid="${CSS.escape(c)}"]`)):!0;r&&re({source:le,type:ie.SVE_ACTIVATE,ids:s},e),(r?!i&&n<6:n<Fo)&&e.setTimeout(a,vt)};e.setTimeout(a,vt)}function Xt(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function qo(e){return new Promise(t=>{let s=!1;const n=i=>{s||(s=!0,a.dismiss(),t(i==="static"||i==="fields"?i:null))},a=ne(e.document,Tn,{title:p(e,"section_new_kind"),body:p(e,"section_new_kind_note"),buttons:[{value:"cancel",label:p(e,"cancel"),variant:"ghost"},{value:"static",label:p(e,"section_new_static"),variant:"primary"},{value:"fields",label:p(e,"section_new_with_fields"),variant:"primary"}],onPick:n,onClose:()=>n(null)})})}const Ko=`<section class="[ ] py-800">
    
</section>
`;function Vo(e){if(y("dock:is-locked")===!0)return e.Statamic?.$toast?.error(p(e,"code_dock_locked")),!1;const s=`${String(y("dock:html")||"").replace(/\s+$/,"")}

${Ko}`;return y("dock:set-html",s)!==!0?(e.Statamic?.$toast?.error(p(e,"section_new_failed")),!1):(y("dock:save-now"),e.Statamic?.$toast?.success(p(e,"section_new_template_done")),!0)}async function Wt(e,t,s,{afterUid:n,onDone:a,onError:i}){try{const r=await Oo(e,s);t.dismiss(),e.Statamic?.$toast?.success(p(e,"section_created",{name:r.section?.display||s.display})),Ue(e);const c=await Bo(e,r.section?.handle,n);!c&&r.section?.handle&&y("dock:open-template",r.section.handle),a?.({...r,uid:c?._visual_id||""})}catch(r){t.dismiss(),e.Statamic?.$toast?.error(p(e,r.reason==="bad_name"?"section_new_bad_name":"section_new_failed")),i?.(r)}}function Ue(e){e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"))}function No(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){const i=ne(e.document,Nt,{heading:p(e,"static_section_new"),groupLabel:"",nameLabel:p(e,"section_new_name"),placeholder:p(e,"section_new_placeholder"),note:p(e,"static_section_note"),groups:[],toggleLabel:p(e,"static_section_insertable"),cancelLabel:p(e,"cancel"),saveLabel:p(e,"section_new_create"),onClose:a,onOk:(r,c,k)=>{Wt(e,i,{display:r,static:!0,hidden:!k},{afterUid:t,onDone:s,onError:n})}})}function zo(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){(async()=>{let i=[];try{i=await Ao(e)}catch(c){n?.(c),e.Statamic?.$toast?.error(p(e,"section_new_failed"));return}if(!i.length){n?.(new Error("no groups")),e.Statamic?.$toast?.error(p(e,"section_new_failed"));return}const r=ne(e.document,Nt,{heading:p(e,"section_new"),groupLabel:p(e,"section_new_group"),nameLabel:p(e,"section_new_name"),placeholder:p(e,"section_new_placeholder"),note:p(e,"section_new_note"),groups:i,cancelLabel:p(e,"cancel"),saveLabel:p(e,"section_new_create"),onClose:a,onOk:(c,k)=>{Wt(e,r,{display:c,group:k},{afterUid:t,onDone:s,onError:n})}})})()}const Uo={key:0,class:"sve-ht-inspect"},Xo={class:"sve-ht-inspect__head"},Wo={key:0,class:"sve-ht-inspect__note"},Yo={key:2,class:"sve-ht-inspect__props"},Go={class:"sve-ht-inspect__proplabel"},Zo={key:0},Jo=["value","disabled","onChange"],Qo={value:""},es=["value"],ts=["value"],ns=["value","placeholder","onChange"],os=["title","disabled","onClick"],ss=["title","disabled","onClick"],as={key:0,class:"sve-ht-inspect__seg"},rs=["data-active","disabled","onClick"],is=["value","disabled"],ls={key:0,value:""},cs=["value"],ds={key:2,class:"sve-ht-inspect__box"},us=["value","placeholder","disabled","onKeydown"],hs=["title","disabled"],ps={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},fs=["value","disabled"],ms=["value"],vs={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},gs=["value","placeholder","disabled"],ks=["title","disabled"],ys={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},bs=["value","placeholder","disabled"],_s={key:4,class:"sve-ht-inspect__add"},xs=["disabled","onClick"],Oe='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',Ts='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',Ss={__name:"HtmlTreeInspector",setup(e){const t=z(null);$n(t,m=>o.onPropHost?.(m||null));const s=z(null),n=z(null);function a(m){o.onInspectCommit?.(m.target.value)}function i(m,u,l){!m||!u||(m.value=u,m.focus(),m.setSelectionRange(u.length,u.length),l(u))}function r(m,u){o.onInspectData?.(m.currentTarget,l=>o.onPropValue?.(u.handle,l,!0))}function c(m){o.onInspectData?.(m.currentTarget,u=>i(s.value,u,l=>o.onInspectCommit?.(l)))}function k(m){o.onInspectData?.(m.currentTarget,u=>i(n.value,u,l=>o.onLoopSortField?.(l)))}return(m,u)=>d(o).inspect?(v(),g("div",Uo,[T("div",Xo,S(d(o).inspect.title),1),d(o).inspect.mode==="note"?(v(),g("div",Wo,S(d(o).inspect.note),1)):d(o).inspect.mode==="statamic"?(v(),g("div",{key:1,ref_key:"propHost",ref:t,class:"sve-ht-inspect__form"},null,512)):d(o).inspect.mode==="props"?(v(),g("div",Yo,[(v(!0),g(H,null,K(d(o).inspect.rows,l=>(v(),g("label",{key:l.handle,class:"sve-ht-inspect__prop"},[T("span",Go,[Pn(S(l.label)+" ",1),l.bound?(v(),g("em",Zo,":")):$("",!0)]),T("span",{class:Ln(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":l.type==="select"||l.type==="link"}])},[l.type==="select"&&!l.bound?(v(),g("select",{key:0,value:l.value,disabled:!d(o).canEdit,onChange:h=>d(o).onPropValue?.(l.handle,h.target.value,!1)},[T("option",Qo,S(l.placeholder||d(o).inspect.inheritLabel),1),l.value&&!l.options.includes(l.value)?(v(),g("option",{key:0,value:l.value},S(l.value),9,es)):$("",!0),(v(!0),g(H,null,K(l.options,h=>(v(),g("option",{key:h,value:h},S(h),9,ts))),128))],40,Jo)):(v(),g("input",{key:1,type:"text",value:l.value,placeholder:l.placeholder||d(o).inspect.inheritLabel,onChange:h=>d(o).onPropValue?.(l.handle,h.target.value,l.bound)},null,40,ns)),l.type==="link"?(v(),g("button",{key:2,type:"button","data-sve-ht-data":"",title:d(o).pageTitle,disabled:!d(o).canEdit,onClick:h=>d(o).onPropPage?.(h.currentTarget,l.handle),innerHTML:Ts},null,8,os)):$("",!0),T("button",{type:"button","data-sve-ht-data":"",title:d(o).dataTitle,disabled:!d(o).canEdit,onClick:h=>r(h,l),innerHTML:Oe},null,8,ss)],2)]))),128))])):(v(),g(H,{key:3},[d(o).inspect.mode==="loop"?(v(),g("div",as,[(v(!0),g(H,null,K(d(o).inspect.kinds,l=>(v(),g("button",{key:l.id,type:"button","data-active":l.id===d(o).inspect.loopKind?"":void 0,disabled:!d(o).canEdit,onClick:h=>d(o).onLoopKind?.(l.id)},S(l.label),9,rs))),128))])):$("",!0),d(o).inspect.mode==="loop"&&d(o).inspect.loopKind==="collection"?(v(),g("select",{key:d(o).inspect.key+":"+d(o).inspect.value,value:d(o).inspect.value,disabled:!d(o).canEdit,onChange:a},[d(o).inspect.value?$("",!0):(v(),g("option",ls,S(d(o).inspect.placeholder),1)),(v(!0),g(H,null,K(d(o).inspect.collections,l=>(v(),g("option",{key:l.handle,value:l.handle},S(l.title),9,cs))),128))],40,is)):(v(),g("div",ds,[(v(),g("input",{ref_key:"field",ref:s,key:d(o).inspect.key,type:"text",value:d(o).inspect.value,placeholder:d(o).inspect.placeholder,disabled:!d(o).canEdit,spellcheck:"false",onKeydown:[u[0]||(u[0]=b(()=>{},["stop"])),W(b(a,["prevent"]),["enter"])],onBlur:a},null,40,us)),T("button",{type:"button","data-sve-ht-data":"",title:d(o).dataTitle,disabled:!d(o).canEdit,innerHTML:Oe,onMousedown:u[1]||(u[1]=b(()=>{},["prevent"])),onClick:b(c,["stop","prevent"])},null,40,hs)])),d(o).inspect.sort?(v(),g(H,{key:3},[T("div",ps,S(d(o).inspect.sort.title),1),(v(),g("select",{key:d(o).inspect.key+":dir:"+d(o).inspect.sort.dir,value:d(o).inspect.sort.dir,disabled:!d(o).canEdit,onChange:u[2]||(u[2]=l=>d(o).onLoopSortDir?.(l.target.value))},[(v(!0),g(H,null,K(d(o).inspect.sort.dirs,l=>(v(),g("option",{key:l.id,value:l.id},S(l.label),9,ms))),128))],40,fs)),d(o).inspect.sort.needsField?(v(),g("div",vs,[(v(),g("input",{ref_key:"sortField",ref:n,key:d(o).inspect.key+":field",type:"text",value:d(o).inspect.sort.field,placeholder:d(o).inspect.sort.placeholder,disabled:!d(o).canEdit,spellcheck:"false",onKeydown:[u[3]||(u[3]=b(()=>{},["stop"])),u[4]||(u[4]=W(b(l=>d(o).onLoopSortField?.(l.target.value),["prevent"]),["enter"]))],onBlur:u[5]||(u[5]=l=>d(o).onLoopSortField?.(l.target.value))},null,40,gs)),d(o).inspect.sort.pickable?(v(),g("button",{key:0,type:"button","data-sve-ht-data":"",title:d(o).dataTitle,disabled:!d(o).canEdit,innerHTML:Oe,onMousedown:u[6]||(u[6]=b(()=>{},["prevent"])),onClick:b(k,["stop","prevent"])},null,40,ks)):$("",!0)])):$("",!0),T("div",ys,S(d(o).inspect.limit.title),1),(v(),g("input",{key:d(o).inspect.key+":limit",type:"number",min:"1",value:d(o).inspect.limit.value,placeholder:d(o).inspect.limit.placeholder,disabled:!d(o).canEdit,onKeydown:[u[7]||(u[7]=b(()=>{},["stop"])),u[8]||(u[8]=W(b(l=>d(o).onLoopLimit?.(l.target.value),["prevent"]),["enter"]))],onBlur:u[9]||(u[9]=l=>d(o).onLoopLimit?.(l.target.value))},null,40,bs))],64)):$("",!0),d(o).inspect.branches?.length?(v(),g("div",_s,[(v(!0),g(H,null,K(d(o).inspect.branches,l=>(v(),g("button",{key:l.id,type:"button",disabled:!d(o).canEdit,onClick:h=>d(o).onAddBranch?.(l.id)},S(l.label),9,xs))),128))])):$("",!0)],64))])):$("",!0)}},Cs=be(Ss,[["__scopeId","data-v-26254b75"]]),ws={class:"sve-html-tree"},$s={class:"sve-pane-bar","data-sve-pane-bar":""},Ps={"data-sve-right-title":""},Ls={class:"sve-ht-tools"},Es=["title"],Hs=["placeholder","aria-label","value"],Is=["aria-label"],As=["title","aria-label"],Ms={key:1,class:"sve-tree-exit"},Rs=["title"],Ds=["title"],Os='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',Bs='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',Fs='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',js={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const t=p(window,"html_tree_search"),s=Xt(window),n=p(window,"section_new"),a=z(!1);function i(){a.value=!1}async function r(m){if(m)for(let u=0;u<20;u+=1){await Pt(),o.onRefresh?.();const l=o.sections.find(h=>h.uid===m);if(l){o.onSection?.(m),jo(window,l.ids);return}await new Promise(h=>setTimeout(h,50))}}function c(){a.value||(a.value=!0,(async()=>{if(!(o.sections.length||o.pageBuilder)){Vo(window),i();return}const m=await qo(window);if(!m){i();return}const u=o.sections.length?o.sections[o.sections.length-1].uid:null,l=h=>{i(),r(h?.uid)};if(m==="static"){No(window,{afterUid:u,onDone:l,onError:i,onClose:i});return}zo(window,{afterUid:u,onDone:l,onError:i,onClose:i})})())}function k(m){const u=!!o.query;o.query=m,u!==!!m&&o.onQuery?.()}return(m,u)=>(v(),g("div",ws,[T("div",$s,[T("div",Ps,S(e.title),1),u[5]||(u[5]=En('<div data-sve-right-actions data-v-76fd5289><button type="button" data-sve-right-pin aria-pressed="false" data-v-76fd5289></button><button type="button" data-sve-close aria-label="Close" data-v-76fd5289><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-76fd5289><path d="M18 6 6 18" data-v-76fd5289></path><path d="m6 6 12 12" data-v-76fd5289></path></svg></button></div>',1))]),T("div",Ls,[T("label",{class:"sve-ht-search",title:d(t)},[T("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:Bs}),T("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:d(t),"aria-label":d(t),value:d(o).query,autocomplete:"off",spellcheck:"false",onInput:u[0]||(u[0]=l=>k(l.target.value)),onKeydown:[u[1]||(u[1]=b(()=>{},["stop"])),u[2]||(u[2]=W(b(l=>k(""),["prevent"]),["escape"]))]},null,40,Hs),d(o).query?(v(),g("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":d(t),innerHTML:Fs,onClick:u[3]||(u[3]=l=>k(""))},null,8,Is)):$("",!0)],8,Es),d(s)&&(d(o).sections.length||d(o).pageBuilder||d(o).rows.length)?(v(),g("button",{key:0,type:"button",class:"sve-ht-new",title:d(n),"aria-label":d(n),innerHTML:Os,onClick:c},null,8,As)):$("",!0)]),d(F).inSidebar?$("",!0):(v(),Se(Jn,{key:0})),u[6]||(u[6]=T("div",{"data-sve-html-tree-list":""},null,-1)),Hn(Cs),d(o).exitOpen&&!d(F).inSidebar?(v(),g("div",Ms,[T("span",{class:"sve-tree-exit__name",title:d(o).exitName},S(d(o).exitName),9,Rs),T("button",{type:"button",class:"sve-tree-exit__go",title:d(o).exitTitle,onClick:u[4]||(u[4]=l=>d(o).onExit?.())},S(d(o).exitLabel),9,Ds)])):$("",!0)]))}},Yt=be(js,[["__scopeId","data-v-76fd5289"]]);function Gt(e){return String(e||"").trim().toLowerCase()}function Zt(e,t){return t?[e.name,e.tag,e.klass,e.label,e.src].filter(s=>typeof s=="string"&&s).join(" ").toLowerCase().includes(t):!0}function qs(e,t){const s=Gt(t);if(!s)return{rows:e,hits:new Set};const n=new Set;for(const r of e)Zt(r,s)&&n.add(r.path);const a=[...n];return{rows:e.filter(r=>n.has(r.path)||a.some(c=>c.startsWith(`${r.path}/`))),hits:n}}const Ks=["title"],Vs={"data-sve-ht-indent":"","aria-hidden":"true"},Ns=["data-sve-ht-cat"],zs={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},Us={key:2,"data-sve-ht-letter":""},Xs=["innerHTML"],Ws=["title"],Ys=["title"],Gs={key:1,"data-sve-ht-kind":""},Zs={key:3,"data-sve-ht-name":""},Js={key:4,"data-sve-ht-actions":""},Qs=["disabled","title","innerHTML"],ea=["disabled","title"],ta=["disabled","title"],na=["disabled","title"],oa=["data-sve-ht-id"],sa='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',aa='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',ra='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',ia='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',la='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',ca='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',da={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const t=Gn(window),s=p(window,"section_fields");function n(){const u=Zn();if(!u){window.Statamic?.$toast?.error(p(window,"section_fields_none"));return}jt(window,u)}function a(u){return u.kind==="component"?u.src?`partial:${u.src}`:u.tag:u.name?`${u.tag} ${u.name}`:u.tag}function i(u){return!!u.section}function r(u){return!!u.context}function c(u){if(i(u)){o.onSection?.(u.section);return}if(r(u)){o.onContextRow?.(u.id);return}o.onSelect?.(u.id)}function k(u,l){const h={"data-sve-ht-id":u.id};return u.current&&(h["data-sve-ht-current"]=""),u.hidden&&(h["data-sve-ht-hidden"]=""),h["data-sve-ht-cat"]=u.cat||"other",h["data-sve-ht-depth"]=String(u.depth),l&&(h["data-sve-ht-dim"]=""),r(u)&&(h["data-sve-ht-context"]=u.context),i(u)&&(h["data-sve-ht-sec"]=""),!i(u)&&o.dropId===u.id&&o.dropPlace&&(h["data-sve-ht-drop"]=o.dropPlace),h}function m(u){return!u.hidden||u.wrapFrom!=null}return(u,l)=>(v(),g(H,null,[T("div",pe({"data-sve-ht-row":""},k(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:l[26]||(l[26]=h=>c(e.row)),onDblclick:l[27]||(l[27]=b(h=>i(e.row)||r(e.row)?null:d(o).onRename?.(e.row.id),["prevent"])),onKeydown:[l[28]||(l[28]=W(b(h=>c(e.row),["prevent"]),["enter"])),l[29]||(l[29]=W(b(h=>c(e.row),["prevent"]),["space"]))],onPointerdown:l[30]||(l[30]=h=>i(e.row)||r(e.row)?null:d(o).onPointerDown?.(h,e.row.id)),onContextmenu:l[31]||(l[31]=b(h=>i(e.row)||r(e.row)?null:d(o).onContext?.(h,e.row.id),["prevent","stop"]))}),[T("span",Vs,[(v(!0),g(H,null,K(e.row.guides||[],(h,P)=>(v(),g("i",{key:P,"data-sve-ht-cat":h},null,8,Ns))),128))]),e.row.hasChildren||e.row.emptyBlock?(v(),g("button",pe({key:0,type:"button","data-sve-ht-twist":""},e.row.shut?{"data-sve-ht-shut":""}:{},{innerHTML:aa,onClick:l[0]||(l[0]=b(h=>i(e.row)?d(o).onSection?.(e.row.section):d(o).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:l[1]||(l[1]=b(()=>{},["stop"])),onDblclick:l[2]||(l[2]=b(()=>{},["stop"]))}),null,16)):(v(),g("span",zs)),e.row.letter?(v(),g("span",Us,S(e.row.letter),1)):(v(),g("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Xs)),T("span",{"data-sve-ht-text":"",title:d(o).renameTitle},[!e.row.kind&&!i(e.row)&&!r(e.row)?(v(),g("button",{key:0,type:"button","data-sve-ht-tag":"",title:d(o).tagTitle,onClick:l[3]||(l[3]=b(()=>{},["stop","prevent"])),onPointerdown:l[4]||(l[4]=b(()=>{},["stop"])),onDblclick:l[5]||(l[5]=b(h=>d(o).onTagChange?.(h,e.row.id),["stop","prevent"]))},S(e.row.tag),41,Ys)):(v(),g("span",Gs,S(e.row.tag),1)),d(o).editingId===e.row.id&&!i(e.row)?Te((v(),g("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":l[6]||(l[6]=h=>d(o).draft=h),onMousedown:l[7]||(l[7]=b(()=>{},["stop"])),onPointerdown:l[8]||(l[8]=b(()=>{},["stop"])),onClick:l[9]||(l[9]=b(()=>{},["stop"])),onDblclick:l[10]||(l[10]=b(()=>{},["stop"])),onKeydown:[l[11]||(l[11]=b(()=>{},["stop"])),l[12]||(l[12]=W(b(h=>d(o).onRenameCommit?.(),["prevent"]),["enter"])),l[13]||(l[13]=W(b(h=>d(o).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:l[14]||(l[14]=h=>d(o).onRenameCommit?.())},null,544)),[[Lt,d(o).draft]]):(v(),g("span",Zs,S(e.row.name),1))],8,Ws),!i(e.row)&&!r(e.row)?(v(),g("span",Js,[m(e.row)?(v(),g("button",{key:0,type:"button","data-sve-ht-eye":"",disabled:!d(o).canEdit,title:d(o).canEdit?e.row.hidden?d(o).showTitle:d(o).hideTitle:d(o).lockedTitle,innerHTML:e.row.hidden?ia:ra,onClick:l[15]||(l[15]=b(h=>d(o).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:l[16]||(l[16]=b(()=>{},["stop"])),onDblclick:l[17]||(l[17]=b(()=>{},["stop"]))},null,40,Qs)):$("",!0),d(t)&&e.row.fieldsIcon?(v(),g("button",{key:1,type:"button","data-sve-ht-fields":"",disabled:!d(o).canEdit,title:d(o).canEdit?d(s):d(o).lockedTitle,innerHTML:sa,onClick:b(n,["stop","prevent"]),onPointerdown:l[18]||(l[18]=b(()=>{},["stop"])),onDblclick:l[19]||(l[19]=b(()=>{},["stop"]))},null,40,ea)):$("",!0),T("button",{type:"button","data-sve-ht-dup":"",disabled:!d(o).canEdit,title:d(o).canEdit?d(o).duplicateTitle:d(o).lockedTitle,innerHTML:la,onClick:l[20]||(l[20]=b(h=>d(o).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:l[21]||(l[21]=b(()=>{},["stop"])),onDblclick:l[22]||(l[22]=b(()=>{},["stop"]))},null,40,ta),T("button",{type:"button","data-sve-ht-del":"",disabled:!d(o).canEdit,title:d(o).canEdit?d(o).deleteTitle:d(o).lockedTitle,innerHTML:ca,onClick:l[23]||(l[23]=b(h=>d(o).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:l[24]||(l[24]=b(()=>{},["stop"])),onDblclick:l[25]||(l[25]=b(()=>{},["stop"]))},null,40,na)])):$("",!0)],16,Ks),e.row.emptyBlock&&!e.row.shut?(v(),g("div",pe({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},d(o).dropId===e.row.id&&d(o).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),S(d(o).slotText),17,oa)):$("",!0)],64))}},Be=be(da,[["__scopeId","data-v-e9e0092a"]]),ua=["data-sve-ht-look"],ha={key:0,class:"sve-ht-empty"},pa={key:1,class:"sve-ht-empty"},fa={key:0,class:"sve-ht-empty"},ma={__name:"HtmlTreeList",setup(e){const t=he(()=>Gt(o.query)),s=he(()=>qs(o.rows,t.value)),n=he(()=>s.value.rows),a=he(()=>t.value?o.sections.filter(c=>Zt(c.row,t.value)||c.current&&c.ready&&n.value.length>0):o.sections),i=he(()=>!!t.value&&!a.value.length&&!n.value.length);function r(c){return!!t.value&&!s.value.hits.has(c.path)}return(c,k)=>(v(),g("div",pe({class:"sve-ht-root","data-sve-ht-look":d(o).look,style:d(o).familyStyle},d(o).dragging?{"data-sve-ht-dragging":""}:{}),[!d(o).rows.length&&!d(o).sections.length?(v(),g("div",ha,S(d(o).emptyText),1)):i.value?(v(),g("div",pa,S(d(o).searchEmpty),1)):$("",!0),d(o).sections.length?(v(!0),g(H,{key:2},K(a.value,m=>(v(),g("div",pe({key:m.uid},{ref_for:!0},m.current?{"data-sve-ht-branch":""}:{}),[m.ready?(v(),g(H,{key:0},[(v(!0),g(H,null,K(n.value,u=>(v(),Se(Be,{key:u.id,row:u,dim:r(u)},null,8,["row","dim"]))),128)),d(o).rows.length?$("",!0):(v(),g("div",fa,S(d(o).emptyText),1))],64)):(v(),Se(Be,{key:1,row:m.row,dim:d(o).inComponent},null,8,["row","dim"]))],16))),128)):d(o).rows.length?(v(!0),g(H,{key:3},K(n.value,m=>(v(),Se(Be,{key:m.id,row:m,dim:r(m)},null,8,["row","dim"]))),128)):$("",!0)],16,ua))}},gt=be(ma,[["__scopeId","data-v-c8612f67"]]);let Fe=null;function va(e){return Fe||(Fe=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{pages:[]}).then(t=>Array.isArray(t.pages)?t.pages:[]).catch(()=>[])),Fe}let $e=null;function je(){$e?.dismiss(),$e=null}function ga(e,t,s){je();const n=t?.getBoundingClientRect?.(),a={x:n?n.left:0,y:n?n.bottom+4:0};va(e).then(i=>{const r=i.length?i.map(c=>({label:c.title||c.url,onPick:()=>{je(),s(c.url)}})):[{label:p(e,"component_props_pages_none"),onPick:null}];je(),$e=ne(e.document,nt,{items:r,x:a.x,y:a.y,onClose:()=>{$e=null}})})}const Jt="sve-html-tree-labels";function Qt(){try{const e=globalThis.localStorage?.getItem(Jt);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function ka(e){try{globalThis.localStorage?.setItem(Jt,JSON.stringify(e))}catch{}}function en(e){return String(e||"_")}function tn(e){const t=Qt()[en(e)];return t&&typeof t=="object"?{...t}:{}}function ya(e,t,s){const n=s?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function ba(e,t,s,n){if(!t)return;const a=en(e),i=Qt(),r={...i[a]||{}},c=String(s||"").replace(/\s+/g," ").trim(),k=String(n||"").trim();!c||c===k?delete r[t]:r[t]=c,Object.keys(r).length?i[a]=r:delete i[a],ka(i)}const _a=/^@(media|supports|container|layer|scope)\b/i;function xa(e){const t=String(e||""),s=[];let n=0,a=0;for(;n<t.length;){if(t[n]==="{"&&t[n+1]==="{"){const c=t.indexOf("}}",n+2);n=c===-1?t.length:c+2;continue}if(t[n]==="/"&&t[n+1]==="*"){const c=t.indexOf("*/",n+2);n=c===-1?t.length:c+2;continue}if(t[n]==='"'||t[n]==="'"){const c=t[n];for(n+=1;n<t.length&&t[n]!==c;)n+=t[n]==="\\"?2:1;n+=1;continue}if(t[n]!=="{"){n+=1;continue}let i=1,r=n+1;for(;r<t.length&&i>0;){if(t[r]==="{"&&t[r+1]==="{"){const c=t.indexOf("}}",r+2);r=c===-1?t.length:c+2;continue}if(t[r]==="/"&&t[r+1]==="*"){const c=t.indexOf("*/",r+2);r=c===-1?t.length:c+2;continue}if(t[r]==='"'||t[r]==="'"){const c=t[r];for(r+=1;r<t.length&&t[r]!==c;)r+=t[r]==="\\"?2:1;r+=1;continue}t[r]==="{"?i+=1:t[r]==="}"&&(i-=1),r+=1}s.push({selector:t.slice(a,n).trim(),body:t.slice(n+1,r-1),from:a,to:r,text:t.slice(a,r).trim()}),n=r,a=r}return s}function kt(e){const t=String(e||""),s=new Set,n=new Set,a=new Set;for(const i of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const r of i[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))r&&(s.add(r),s.add(r.replace(/([:./%!#()[\],])/g,"\\$1")));for(const i of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))i[2].trim()&&n.add(i[2].trim());for(const i of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))a.add(i[1].toLowerCase());return{classes:s,ids:n,tags:a}}function yt(e,t){const s=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),n=[...s.matchAll(/\.((?:\\.|[\w-])+)/g)].map(r=>r[1]),a=[...s.matchAll(/#((?:\\.|[\w-])+)/g)].map(r=>r[1]);if(n.length||a.length){const r=c=>c.replace(/\\(.)/g,"$1");return n.every(c=>t.classes.has(c)||t.classes.has(r(c)))&&a.every(c=>t.ids.has(r(c)))}const i=[...s.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(r=>r[2].toLowerCase());return i.length>0&&i.every(r=>t.tags.has(r))}function Ta(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function Sa(e,t,s){const n=Ta(e);if(!n.length)return"keep";const a=n.filter(r=>yt(r,t));return a.length?a.length===n.length&&!n.some(r=>yt(r,s))?"move":"copy":"keep"}function nn(e,t,s){const n=String(e||""),a=kt(t),i=kt(s),r=[],c=[];let k=0;for(const m of xa(n)){const u=n.slice(m.from,m.to),l=u.match(/^\s*/)[0];if(k=m.to,_a.test(m.selector)){const P=nn(m.body,t,s);P.move.trim()&&r.push(`${m.selector} {
${P.move.trim()}
}`),P.keep.trim()&&c.push(`${l}${m.selector} {
${P.keep.trim()}
}`);continue}const h=m.selector.startsWith("@")?"keep":Sa(m.selector,a,i);if(h==="move"){r.push(m.text);continue}h==="copy"&&r.push(m.text),c.push(u)}return c.push(n.slice(k)),{move:r.join(`

`).trim(),keep:c.join("").replace(/\n{3,}/g,`

`).trim()}}const Ca="/!/sve/component";function wa(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let s=null;for(const n of t){if(!n.trim())continue;const a=n.match(/^[ \t]*/)[0].length;s=s===null?a:Math.min(s,a)}return s?t.map(n=>n.slice(s)).join(`
`):t.join(`
`)}function $a(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function Pa(e,t){if(!eo(e))return"";try{return await(await An(()=>import("./tw-compile-D8Xdoe3O.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(s){return console.error("[sve] component tailwind compile",s),""}}async function La(e,t){const s=await e.fetch(Ca,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":Et(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!s.ok){const n=new Error(String(s.status));throw n.status=s.status,n}return s.json()}function bt(e,t){const{from:s,to:n}=Qn(e,t),a=e.slice(s,n);if(!a.trim())return null;const i=e.slice(0,s)+e.slice(n),r=y("dock:css"),c=nn(typeof r=="string"?r:"",a,i);return{html:wa(a),css:c.move,keepCss:c.keep,lead:$a(a),from:s,to:n}}function Ea(e,t,{onDone:s,onError:n}={}){if(y("dock:is-locked")===!0)return;const a=y("dock:html");if(typeof a!="string"||!t)return;const i=bt(a,t);if(!i)return;const r=ne(e.document,In,{heading:p(e,"component_new"),nameLabel:p(e,"component_name"),placeholder:p(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:p(e,"cancel"),saveLabel:p(e,"component_create"),onOk:c=>{r.dismiss(),(async()=>{try{const k=await Pa(e,i.html),m=y("dock:html"),u=typeof m=="string"&&m===a?i:bt(m,t);if(!u)return;const l=await La(e,{name:c,html:u.html,css:u.css,js:"",tw:k}),h=y("dock:html"),P=h.slice(0,u.from)+u.lead+l.tag+h.slice(u.to);y("dock:set-html",P),u.css.trim()&&y("dock:set-css",u.keepCss),s?.(l)}catch(k){n?.(k)}})()}})}function Ha(e,t,s){const n=String(e||"");if(!t||t.kind!=="antlers")return n;const a=String(s||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?Ra(n,t,a):t.tag==="else"||!a?n:n.slice(0,t.from)+`{{ ${t.tag} ${a} }}`+n.slice(t.openTo)}function Xe(e,t,s,n){return fe(e,t,{kind:s,name:n})}function fe(e,t,s={}){const n=String(e||"");if(!t||t.antlers!=="loop")return n;const a=t.loopKind==="collection"?"collection":"field",i=s.kind??a,r=String(s.name??t.expr??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(r))return n;const c=s.sortDir??t.sortDir??"",k=String(s.sortField??t.sortField??"").trim(),m=String(s.limit??t.limit??"").trim(),u=on(n,t);if(!u)return n;const l=i===a?t.params:"",h=i==="collection"?Ia(r,k,c,m,l):Aa(r,k,c,m,l),P=i==="collection"?"collection":r;return n.slice(0,t.from)+h+n.slice(t.openTo,u.from)+`{{ /${P} }}`+n.slice(u.to)}function Ia(e,t,s,n,a){const i=Ma(a).replace(/\bsort\s*=\s*["'][^"']*["']/g,"").replace(/\blimit\s*=\s*["']?\d+["']?/g,"").replace(/\s+/g," ").trim(),r=[`collection from="${e}"`];return s==="random"?r.push('sort="random"'):t&&r.push(`sort="${t}${s==="desc"?":desc":":asc"}"`),n&&r.push(`limit="${n}"`),i&&r.push(i),`{{ ${r.join(" ")} }}`}function Aa(e,t,s,n,a){const i=String(a||"").split("|").map(c=>c.trim()).filter(c=>c&&!/^from\s*=/.test(c)&&!/^sort\s*:/.test(c)&&!/^reverse$/.test(c)&&!/^shuffle$/.test(c)&&!/^limit\s*:/.test(c)),r=[e,...i];return s==="random"?r.push("shuffle"):t&&(r.push(`sort:${t}`),s==="desc"&&r.push("reverse")),n&&r.push(`limit:${n}`),`{{ ${r.join(" | ")} }}`}function Ma(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function on(e,t){const n=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return n?{from:t.from+n.index,to:t.from+n.index+n[0].length}:null}function Ra(e,t,s){return fe(e,t,{name:s})}function Da(e,t,s){const n=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return n;const a=on(n,t);if(!a)return n;const r=(n.slice(0,a.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],c=s==="else"?"{{ else }}":"{{ elseif true }}";return`${n.slice(0,a.from)}${c}
${r}${n.slice(a.from)}`}const R=so("sve-call-values"),ge=new Set;let _t=null;const Oa="__sve-html-tree-style",D=new Set;let We="",se=!1,qe=null,_e=!0,V="",ke=0,sn="";const Y=new Map,ae=new Set;let B="",an=!1,I=null,Pe=null,Le=0,Ye=null,ye=[],J=null,me=null,Ee=null,He=null,Ge=null,Ie=!1,Q=null,Z=null;function j(e){return e.getElementById(Ce)}function Ba(e){Rn(e,Oa,`
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
    /* Inside a component: the section's other rows stay, faded — the
       component's own rows are the lit ones, and the row it unfolds from
       carries the component's colour to say where you are. */
    [data-sve-ht-row][data-sve-ht-context="dim"] { opacity: .38; }
    [data-sve-ht-row][data-sve-ht-context="dim"]:hover { opacity: .6; }
    [data-sve-ht-row][data-sve-ht-context="host"] { box-shadow: inset 2px 0 0 var(--sve-fam-component, #5eead4); }
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
      ${ht("light")}
      --sve-ht-pick: rgba(56,88,233,.14);
      --sve-ht-pick-hover: rgba(56,88,233,.22);
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${ht("dark")}
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

    /* Flat rows, stepped in by their depth: the row's own box — its hover,
       its pick, its bar — begins where its level begins, and the guides are
       drawn in the margin to its left. A picked row that ran the full width
       over the guides read as belonging to every level at once. */
    [data-sve-ht-look="tags"] [data-sve-ht-row] {
      margin: 0 0 0 calc(var(--sve-ht-depth, 0) * 14px);
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

    /* One guide per level, drawn in the row's left margin: 14px per level
       with the line 7px in, so each sits under the twist of the row it
       descends from — in that row's family colour, well held back. Out of
       the flow, so the row's box and everything in it start at the level. */
    [data-sve-ht-look="tags"] [data-sve-ht-indent] {
      display: flex;
      position: absolute;
      top: 0;
      bottom: 0;
      left: calc(-1 * var(--sve-ht-depth, 0) * 14px);
      width: calc(var(--sve-ht-depth, 0) * 14px);
      pointer-events: none;
    }
    [data-sve-ht-look="tags"] [data-sve-ht-indent] i {
      display: block;
      flex: none;
      width: 14px;
      background: linear-gradient(to right, transparent 7px, var(--sve-ht-c) 7px, var(--sve-ht-c) 8px, transparent 8px);
      opacity: .3;
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
      margin-left: calc(var(--sve-ht-depth, 0) * 14px);
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
  `)}function O(){const e=y("dock:html");return typeof e=="string"?e:""}function rn(e){return!!y("dock:is-open",e)}function ce(e,{save:t=!1}={}){return rt()||y("dock:set-html",e)!==!0?!1:(t&&y("dock:save-now"),!0)}function xt(e){const t=y("dock:component-exit-state")||{};if(o.exitOpen=!!t.open,!t.open){o.onExit=null;return}o.exitName=t.name||"",o.exitLabel=p(e,"component_exit"),o.exitTitle=p(e,t.back?"component_exit_back":"component_exit_close"),o.onExit=()=>{y("dock:exit-component"),w(e)}}function Fa(e,t){const s=Vn(e);if(!s||t.type!==s)return"";const n=Nn(t[s]);return n&&zn(e,n)?.section_type||""}const te=[];let Ke=!1,Ze=!1;function Ve(e,t){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(t,{timeout:2e3});return}e.setTimeout(t,200)}function ja(e,t){for(const s of t){const n=s.type;!n||Y.has(n)||ae.has(n)||te.includes(n)||te.push(n)}et.htmlTreePrefetchArmed&&at(e)}function Cr(e){et.htmlTreePrefetchArmed=!0,at(e)}function at(e){if(Ke||!te.length)return;Ke=!0;const t=()=>{const s=te.shift();if(!s){Ke=!1;return}if(Y.has(s)||ae.has(s)){Ve(e,t);return}ae.add(s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(s)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{typeof n?.html=="string"&&(Y.set(s,n.html),Ze&&(Ze=!1,w(e)))}).catch(()=>{}).finally(()=>{ae.delete(s),Ve(e,t)})};Ve(e,t)}function rt(){return!!B}function qa(e){const t=new Map,s=Ht(e);if(!s)return t;for(const n of s.querySelectorAll("[data-sid]")){const a=n.getAttribute("data-sid");a&&!t.has(a)&&t.set(a,n.tagName.toLowerCase())}return t}function Ka(e,t){const s=tt(e)||"page_sections";for(const n of Dt(t)||[]){const a=Ot(n.values),i=a&&typeof a=="object"?a[s]:null;if(Array.isArray(i))return!0}return!1}function ln(e,t){const s=tt(e)||"page_sections",n=qa(e),a=[];for(const i of Dt(t)||[]){const r=Ot(i.values),c=r&&typeof r=="object"?r[s]:null;if(Array.isArray(c)){c.forEach(k=>{if(!k||typeof k!="object"||Array.isArray(k)||typeof k.type!="string")return;const m=[k._visual_id,k.id,k._id].filter(C=>typeof C=="string"&&C!=="");if(!m.length)return;const u=Fa(e,k)||k.type,l=typeof k._sve_label=="string"?k._sve_label.trim():"",h=m.map(C=>n.get(C)).find(Boolean)||"section",P=tn(k.type)[`0:${h}`];a.push({uid:m[0],ids:m,type:k.type,tag:h,label:(typeof P=="string"&&P.trim()?P.trim():"")||l||Bt(e,u)?.display||ze(u)||u,svg:Kt(h,"",null).svg||ao.section,cat:Mt(h),enabled:k.enabled!==!1,static:Ro(e,u)})});break}}return a}function Va(e,t,s){if(!s.length)return"";const n=y("dock:current-type")||"",a=y("dock:current-uid"),i=!!y("dock:component-exit-state")?.open;if(a){const r=qn(a,t),c=s.find(k=>k.ids.some(m=>r.includes(m)));if(c&&(i||c.type===n))return c.uid}return s.find(r=>r.type===n)?.uid||""}function Na(e,t,s,n){const a=t.find(C=>C.uid===s),i=y("dock:component-src"),r=y("dock:type-stack")||[];if(!a||!i||!r.length)return null;const c=r.map(C=>C.type).filter(C=>!Y.get(C));if(c.length)return za(e,c),null;const k=[],m=new Set,u=new Set;let l=C=>k.push(...C),h=null,P=0;for(let C=0;C<r.length;C+=1){const de=C+1<r.length?r[C+1].src:i,oe=A=>({...A,id:`ctx${C}:${A.id}`,path:`ctx${C}/${A.path}`,ctxLevel:C,children:A.children.map(oe)}),q=Re(Y.get(r[C].type)).map(oe),L=[],xe=(A,M)=>{for(const E of A){if(E.kind==="component"&&E.src===de)return L.push(...M,E),E;const f=xe(E.children,[...M,E]);if(f)return f}return null};if(h=de?xe(q,[]):null,!h)return null;const N=new Set(L.map(A=>A.id)),ue=(A,M)=>{for(const E of A)E.children.length&&(N.has(E.id)?D.has(E.path):un(E,M))&&m.add(E.id),ue(E.children,M+1)};ue(q,P),l(q),u.add(h.id),P+=L.length,l=(A=>M=>{A.children=M})(h)}for(const C of hn(n))m.add(C);return D.has(h.path)&&m.add(h.id),h.children=n,{tree:k,folds:m,hostId:h.id,hostIds:u,levels:r.length,rootId:k.find(C=>!C.kind)?.id||"",label:a.label,svg:a.svg,cat:a.cat}}function za(e,t){for(const s of t)!te.includes(s)&&!ae.has(s)&&te.push(s);Ze=!0,at(e)}function Ua(e,t,s){const n=y("dock:component-exit-state");if(n?.open)return ze(n.name)||n.name||"";if(s)return t.find(i=>i.uid===s)?.label||"";const a=y("dock:current-type")||"";return Bt(e,a)?.display||ze(a)||""}function cn(e,t,s,n,a){const i=s.find(c=>c.uid===n);if(!i||n===a)return;D.clear(),I=null,_e=!1,G(),De(),V=n,sn=O(),B=Y.get(i.type)||"",B&&(I=Ae(Re(B))||null),an=(y("dock:current-type")||"")===i.type,e.clearTimeout(ke),ke=e.setTimeout(()=>{V="",se=!1,w(e)},4e3),w(e);const r=()=>Wn(i.uid,t,e,{clampToSection:!0});Kn(i.uid,t,e,r),re({source:le,type:ie.SVE_ACTIVATE,ids:i.ids},e),e.setTimeout(()=>w(e),0)}function dn(e,t){if(!t)return!1;for(const s of e||[])if(s.id===t||dn(s.children,t))return!0;return!1}function Ae(e){for(const t of e||[]){if(!t.kind)return t.id;const s=Ae(t.children);if(s)return s}return""}function un(e,t){return D.has(e.path)?t===0:t>0}function hn(e){const t=new Set,s=(n,a)=>{for(const i of n)i.children.length&&un(i,a)&&t.add(i.id),s(i.children,a+1)};return s(e,0),t}function w(e){const t=e.document,n=j(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;Ba(t),no(e);const a=O();B&&B===a&&(B="");const i=B||a,r=Re(i);ye=r;const c=y("dock:current-type")||"",k=tn(c),m=Ka(e,t),l=!!(y("dock:component-exit-state")||{}).open,h=ln(e,t);c&&a&&!B&&Y.set(c,a),ja(e,h);const P=Va(e,t,h);if(m&&!h.length){ye=[],o.rows=[],o.sections=[],o.pageBuilder=!0,o.emptyText=p(e,"html_tree_empty"),o.canEdit=!y("dock:is-locked"),o.look=pt(e),o.onRefresh=()=>w(e),o.onSection=null,xt(e),we(n,gt),Tt(e,[]);return}o.pageBuilder=m;const C=`${c}|${P}`;let de=!1;C!==We&&(We=C,D.clear(),qe!==null&&i!==qe?de=!0:se=i),(de||se!==!1&&i!==se)&&(se=!1,D.clear(),I=Ae(r)||null),qe=i,V&&(V===P||!h.length)&&(an||i!==sn)&&(e.clearTimeout(ke),V="",se=!1,dn(r,I)||(D.clear(),I=Ae(r)||null));const oe=h.some(f=>f.uid===V)?V:"",q=_e?"":oe||P,L=l?Na(e,h,q,r):null,xe=!!(oe||P),N=L?ft(L.tree,o.query?new Set:L.folds):ft(r,o.query?new Set:hn(r));!i.trim()&&!rn(t)?o.emptyText=p(e,"html_tree_need_dock"):o.emptyText=p(e,"html_tree_empty"),o.slotText=p(e,"antlers_drop_here"),o.dataTitle=p(e,"data_vars_title"),o.pageTitle=p(e,"component_props_page"),o.renameTitle=p(e,"html_tree_rename"),o.tagTitle=p(e,"tw_tag"),o.hideTitle=p(e,"html_tree_hide"),o.showTitle=p(e,"html_tree_show"),o.duplicateTitle=p(e,"html_tree_duplicate"),o.deleteTitle=p(e,"html_tree_delete"),o.lockedTitle=p(e,"html_tree_locked"),o.searchEmpty=p(e,"html_tree_search_empty"),o.canEdit=!y("dock:is-locked"),o.look=pt(e),jn(e),o.onQuery=()=>w(e),xt(e),o.inComponent=l,o.onContextRow=f=>{if(!L||f===L.hostId)return;const _=N.find(x=>x.id===f)?.ctxLevel??L.levels-1;y("dock:exit-component",L.levels-_),w(e)},o.onSelect=f=>{const _=N.find(x=>x.id===f);_&&qt(e,_.path)||lt(e,f,N)},o.onTwist=f=>{const _=N.find(x=>x.id===f)?.path;_&&(D.has(_)?D.delete(_):D.add(_),w(e))},o.onTagChange=(f,_)=>{const x=o.rows.find(U=>U.id===_);x&&!rt()&&oo(e,f.currentTarget,x)},o.onRename=f=>Wa(e,f),o.onRenameCommit=()=>St(e,!0),o.onRenameCancel=()=>St(e,!1),o.onHide=f=>Ya(e,f),o.onDuplicate=f=>Ga(e,f),o.onDelete=f=>Ja(e,f),o.onPointerDown=(f,_)=>sr(e,f,_),o.onContext=(f,_)=>nr(e,f,_),o.onInspectCommit=f=>dr(e,f),o.onPropValue=(f,_,x)=>$t(e,f,_,x),o.onPropPage=(f,_)=>ga(e,f,x=>$t(e,_,x,!1)),o.onLoopKind=f=>ur(e,f),o.onAddBranch=f=>hr(e,f),o.onLoopSortField=f=>{const _=Me(),x=String(f||"").trim();if(!_)return;const U=Z?.id===_.id?Z.dir:"",X=_.sortDir||U||"asc";Z=null,ee(e,(kn,yn)=>fe(kn,yn,{sortField:x,sortDir:X}))},o.onLoopSortDir=f=>{const _=Me(),x=String(f||"");if(_){if((x==="asc"||x==="desc")&&!_.sortField){Z={id:_.id,dir:x},Je(e,_);return}Z=null,ee(e,(U,X)=>fe(U,X,{sortDir:x,sortField:x==="asc"||x==="desc"?X.sortField:""}))}},o.onLoopLimit=f=>ee(e,(_,x)=>fe(_,x,{limit:String(f||"").replace(/\D/g,"")})),o.onPropHost=f=>f?R.mount(f):R.unmount(),o.onInspectData=(f,_)=>{y("dock:data-menu",{anchor:f,at:N.find(x=>x.id===I)?.from,onPick:x=>_(String(x?.var||"").trim())})};const ue=N.find(f=>!f.kind)?.id,A=l?"":Ua(e,h,q),M=q&&!l?h.find(f=>f.uid===q):null;o.rows=N.map(f=>{const _=Kt(f.tag,f.kind,f.antlers),x=!!L&&f.id===L.rootId,U=f.id===ue&&A?A:x?L.label:f.klass,X=f.id===ue;return{...f,base:U,name:ya(U,f.path,k),current:f.id===I,letter:x?"":_.letter||"",svg:X&&M?M.svg:x?L.svg:_.svg||"",cat:x?L.cat:Mt(f.tag,f.kind,f.antlers),context:L?L.hostIds.has(f.id)?"host":f.id.startsWith("ctx")?"dim":"":"",sectionRoot:X&&M?M.uid:"",fieldsIcon:!!(X&&M&&!M.static)}});const E=[];for(const f of o.rows)E.length=f.depth,f.guides=E.slice(),E[f.depth]=f.cat;o.sections=xe?h.map(f=>{const _=!!q&&f.uid===q;return{...f,current:_,ready:_&&(!oe||!!B),row:{id:`sec:${f.uid}`,section:f.uid,tag:f.tag,name:f.label,kind:"",svg:f.svg,cat:f.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:_,hidden:!f.enabled}}}):[],o.onSection=f=>cn(e,t,h,f,q),o.onRefresh=()=>w(e),Je(e,o.rows.find(f=>f.id===I)),we(n,gt),Tt(e,r)}function Tt(e,t){j(e.document)&&pn(e,t)}function pn(e,t){const s=t[0],n=!!y("dock:component-src"),a=n?"":y("dock:current-uid")||"";re({source:le,type:ie.SVE_HTML_PICK,on:!0,uid:a,all:n,tag:s?.tag||"",klass:s?.klass||"",nodes:bo(t)},e)}function Xa(e){if(!e)return;const t=(s,n)=>{for(const a of s||[]){if(a.path===e)return!0;if(t(a.children,n+1))return n===0?D.delete(a.path):D.add(a.path),!0}return!1};t(ye,0)}function Wa(e,t){if(Ie)return;const s=o.rows.find(n=>n.id===t);!s||s.kind||(I=t,o.rows.forEach(n=>{n.current=n.id===t}),o.editingId=t,o.draft=s.name,e.setTimeout(()=>{const n=j(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function St(e,t){const s=o.editingId;if(!s)return;const n=o.rows.find(a=>a.id===s);o.editingId=null,t&&n&&ba(y("dock:current-type")||"",n.path,o.draft,n.base||n.klass),o.draft="",w(e)}function Ya(e,t){it(e,t,go)}function Ga(e,t){it(e,t,ko)}function fn(e,t){Un(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const s=e.document;Yn({uid:t},s,e)})}function Za(e,t,s){V===s&&(e.clearTimeout(ke),V="",B=""),I=null,_e=!1,We="";const n=ln(e,t),a=n.find(i=>i.uid!==s)||n[0];a?cn(e,t,n,a.uid,""):(B="",o.rows=[],o.sections=[],o.pageBuilder=!0,w(e)),e.setTimeout(()=>{j(e.document)&&w(e)},0)}Rt("row:removed",({uid:e,parentPath:t,doc:s,win:n})=>{t!==tt(n)||!j(n.document)||Za(n,s,e)});function Ja(e,t){const s=o.sections?.find(a=>a.row?.id===t),n=s?s.row?.section||s.uid:o.rows.find(a=>a.id===t)?.sectionRoot;if(n){fn(e,n);return}it(e,t,yo)}function it(e,t,s){if(y("dock:is-locked"))return;const n=O(),a=o.rows.find(r=>r.id===t);if(!a)return;const i=s(n,a);i!==n&&ce(i)}function G(){Q?.dismiss(),Q=null}const Qa='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',er='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>';function mn(e,t){const s=o.sections?.find(c=>c.uid===t),n=s?.type||"";if(!n||!s.static||!Xt(e))return[];const a=s.label||n,i=Do(e,n),r=()=>e.Statamic?.$toast?.error(p(e,"section_update_failed"));return[{label:p(e,"static_section_insertable"),icon:i?er:Qa,onPick:()=>{G(),mt(e,{handle:n,hidden:!i}).then(()=>{e.Statamic?.$toast?.success(p(e,i?"section_shown_to_editors":"section_hidden_from_editors",{name:a})),Ue(e)}).catch(r)}},{label:p(e,"section_add_fields"),onPick:()=>{G(),mt(e,{handle:n,fields:!0}).then(()=>{e.Statamic?.$toast?.success(p(e,"section_fields_added",{name:a})),Ue(e),w(e),jt(e,n)}).catch(r)}}]}function tr(e,t,s){const n=s.row?.section||s.uid;n&&(Q=ne(e.document,nt,{items:[...mn(e,n),{label:p(e,"html_tree_remove_section"),danger:!0,onPick:()=>{G(),fn(e,n)}}],x:t.clientX,y:t.clientY,onClose:()=>{Q=null}}))}function nr(e,t,s){G();const n=o.sections?.find(c=>c.row?.id===s);if(n){tr(e,t,n);return}const a=o.rows.find(c=>c.id===s);if(!a)return;lt(e,s,o.rows);const i={x:t.clientX,y:t.clientY},r=c=>{c.length&&(Q?.dismiss(),Q=ne(e.document,nt,{items:c,x:i.x,y:i.y,onClose:()=>{Q=null}}))};if(a.kind==="component"){or(e,a,r);return}o.canEdit&&r([...a.sectionRoot?mn(e,a.sectionRoot):[],{label:p(e,"component_make"),onPick:()=>{G(),Ea(e,a,{onDone:()=>w(e),onError:c=>{e.alert(c?.status===409?p(e,"component_exists"):p(e,"component_failed"))}})}}])}const Ct=(e,t)=>{G(),y("dock:open-template",t)};function or(e,t,s){if(!io(t.src)){s([{label:p(e,"component_open_named",{name:t.name||t.src}),onPick:()=>Ct(e,`view:partials/${t.src}`)}]);return}s([{label:p(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const a=Array.isArray(n.items)?n.items:[];s(a.length?a.map(i=>({label:p(e,"component_open_named",{name:i.label}),onPick:()=>Ct(e,i.type)})):[{label:p(e,"component_none"),onPick:null}])}).catch(()=>s([{label:p(e,"component_none"),onPick:null}]))}function sr(e,t,s){if(t.button!==0||y("dock:is-locked")||o.editingId||t.target?.closest?.("button, input"))return;De(),J=s,me={x:t.clientX,y:t.clientY},Ee=t.currentTarget,He=t.pointerId;const n=i=>ar(e,i),a=i=>rr(e,i);Ge=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),Ge=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function ar(e,t){if(!J||!me)return;const s=t.clientX-me.x,n=t.clientY-me.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{Ee?.setPointerCapture?.(He)}catch{}}t.preventDefault();const a=e.document.elementFromPoint(t.clientX,t.clientY),i=a?.closest?.("[data-sve-ht-slot]");if(i){const l=i.getAttribute("data-sve-ht-id");if(l&&l!==J){o.dropId=l,o.dropPlace="inside";return}}const r=a?.closest?.("[data-sve-ht-row]"),c=r?.getAttribute("data-sve-ht-id");if(!c||c===J){o.dropId=null,o.dropPlace=null;return}const k=o.rows.find(l=>l.id===c),m=o.rows.find(l=>l.id===J);if(!k||k.context||m&&k.path.startsWith(`${m.path}/`)){o.dropId=null,o.dropPlace=null;return}const u=r.getBoundingClientRect();o.dropId=c,o.dropPlace=mo(t.clientY-u.top,u.height,!Vt(k.tag)&&k.kind!=="component")}function rr(e,t){const s=J,n=o.dropId,a=o.dropPlace||"after",i=o.dragging;if(De(),i&&(Ie=!0,e.setTimeout(()=>{Ie=!1},0)),!i||y("dock:is-locked")||!s||!n||s===n)return;t?.preventDefault?.();const r=O(),c=vo(r,ye,s,n,a);c!==r&&ce(c)}function De(){try{Ee?.releasePointerCapture?.(He)}catch{}Ge?.(),J=null,me=null,Ee=null,He=null,o.dragging=!1,o.dropId=null,o.dropPlace=null}function vn(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function Je(e,t){if(t?.kind==="component"){ir(e,t);return}if(F.callOpen&&(F.callOpen=!1,F.callStore=null,R.forget(),ot(e)),t?.kind!=="antlers"){o.inspect=null;return}const s=t.id;if(t.tag==="else"){o.inspect={key:s,title:p(e,"antlers_condition"),mode:"note",note:p(e,"antlers_else_note")};return}if(t.antlers==="loop"){const n=t.loopKind==="collection",a=Z?.id===t.id?Z.dir:"",i=t.sortDir||a;o.inspect={key:s,title:p(e,"antlers_loop"),mode:"loop",loopKind:n?"collection":"field",kinds:[{id:"field",label:p(e,"antlers_loop_field")},{id:"collection",label:p(e,"antlers_loop_collection")}],collections:vn(e),value:t.expr||"",placeholder:p(e,n?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:p(e,"antlers_sort"),dir:i,needsField:i==="asc"||i==="desc",field:t.sortField||"",pickable:!n,placeholder:p(e,n?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:p(e,"antlers_sort_none")},{id:"asc",label:p(e,"antlers_sort_asc")},{id:"desc",label:p(e,"antlers_sort_desc")},{id:"random",label:p(e,"antlers_sort_random")}]},limit:{title:p(e,"antlers_limit"),value:t.limit||"",placeholder:p(e,"antlers_limit_placeholder")},branches:[]};return}o.inspect={key:s,title:p(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:p(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:p(e,"antlers_add_elseif")},{id:"else",label:p(e,"antlers_add_else")}]}}function ir(e,t){if(!lo(e)){o.inspect=null;return}if(!t.src)return;const s=t.id;if(o.inspect={key:s,title:p(e,"component_props_values"),mode:"note",note:p(e,"code_dock_loading")},co()){const n={},a={},i=new Map;for(const[r,c]of uo(O().slice(t.from,t.to))){const k=ho(r);k&&(r!==k||!i.has(k))&&i.set(k,c)}for(const[r,c]of i)c.bound?a[r]=c.value:n[r]=c.value;_t!==s&&(_t=s,ge.clear());for(const r of ge)r in a||(a[r]="");o.inspect=null,F.callOpen=!0,F.title=F.title||p(e,"component_props"),F.callTitle=t.klass||t.name||t.src,F.callStore=R.ui,R.ui.canBind=!0,R.ui.dataTitle=p(e,"data_vars_title"),R.ui.exprPlaceholder=p(e,"component_props_expr"),R.ui.onToggleBind=(r,c)=>cr(e,r,c),R.ui.onExpr=(r,c)=>wt(e,r,c),R.ui.onPickData=(r,c)=>y("dock:data-menu",{anchor:c,at:t.from,onPick:k=>wt(e,r,String(k?.var||"").trim())}),R.load(e,{key:`${t.src}::${s}`,src:t.src,params:n,bindings:a,readOnly:y("dock:is-locked")===!0}),R.watch(e,{src:t.src,write:r=>lr(e,r,a)}),ot(e);return}po(e,t.src).then(n=>{if(o.inspect?.key===s){if(!n.length){o.inspect={key:s,title:p(e,"component_props_values"),mode:"note",note:p(e,"component_props_values_none")};return}o.inspect={key:s,title:p(e,"component_props_values"),mode:"props",inheritLabel:p(e,"component_props_inherit"),rows:fo(n,O().slice(t.from,t.to))}}})}function lr(e,t,s={}){const n=o.rows.find(r=>r.id===I);if(n?.kind!=="component"||y("dock:is-locked"))return;let a=O(),i=n.to;for(const[r,c]of Object.entries(t||{})){if(r in s)continue;const k=a.length,m=st(a,{from:n.from,to:i},r,c);m!==a&&(i+=m.length-k,a=m)}a!==O()&&(ce(a,{save:!0}),w(e))}function cr(e,t,s){s?ge.add(t):ge.delete(t),gn(e,t,"",s),w(e)}function wt(e,t,s){ge.add(t),gn(e,t,s,!0),w(e)}function gn(e,t,s,n){const a=o.rows.find(c=>c.id===I);if(a?.kind!=="component"||y("dock:is-locked"))return;const i=O(),r=st(i,a,t,s,{bound:n});r!==i&&ce(r,{save:!0})}function Me(){const e=o.rows.find(t=>t.id===I);return e?.kind==="antlers"&&!y("dock:is-locked")?e:null}function ee(e,t){const s=Me();if(!s)return;const n=O(),a=t(n,s);a!==n&&(ce(a),w(e))}function $t(e,t,s,n){const a=o.rows.find(c=>c.id===I);if(a?.kind!=="component"||y("dock:is-locked"))return;const i=O(),r=st(i,a,t,s,{bound:n});r!==i&&(ce(r,{save:!0}),w(e))}function dr(e,t){ee(e,(s,n)=>n.antlers==="loop"?Xe(s,n,n.loopKind==="collection"?"collection":"field",t):Ha(s,n,t))}function ur(e,t){const s=Me();if(!s||s.antlers!=="loop")return;const n=s.loopKind==="collection"?"collection":"field";if(t!==n){if(t==="collection"){const a=vn(e)[0]?.handle;if(!a)return;ee(e,(i,r)=>Xe(i,r,"collection",a));return}ee(e,(a,i)=>Xe(a,i,"field",i.handle||"items"))}}function hr(e,t){ee(e,(s,n)=>Da(s,n,t))}function pr(e,t){if(!e||!t||t.kind==="component"||Vt(t.tag))return null;const s=ro(e,t);if(s<t.openTo)return null;const n=e.lastIndexOf(`
`,s-1)+1;return e.slice(n,s).trim()===""&&n>t.openTo?n-1:s}function lt(e,t,s){if(Ie)return;const n=(s||o.rows).find(a=>a.id===t);n&&(I=t,o.rows.forEach(a=>{a.current=a.id===t}),Je(e,n),!rt()&&(y("dock:reveal-html",{from:n.from,to:n.to,caret:pr(O(),n)}),y("dock:tw-follow"),re({source:le,type:ie.SVE_HTML_PICK_FOCUS,path:n.path},e)))}function fr(e,t){if(!t)return"";const s=[],n=(a,i)=>{for(const r of a||[]){const c=i||r.path===e;r.kind==="component"&&r.src===t&&s.push({path:r.path,inside:c}),n(r.children,c)}};return n(ye,!1),(s.find(a=>a.inside)||s[0])?.path||""}function mr(e,t){if(!t||!j(e.document))return;_e=!1,Xa(t),w(e);const s=o.rows.find(n=>n.path===t);s&&(lt(e,s.id,o.rows),e.setTimeout(()=>{j(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function Qe(e){if(Pe)return;const t=()=>{o.editingId||o.dragging||(e.clearTimeout(Le),Le=e.setTimeout(()=>{j(e.document)&&w(e)},80))},s=()=>t();Pe=Rt("dock:html-changed",t),e.document.addEventListener("sve-page-structure",s),Ye=()=>{e.document.removeEventListener("sve-page-structure",s)}}function vr(e){Pe?.(),Pe=null,Ye?.(),Ye=null,e?.clearTimeout?.(Le),Le=0}function ct(e){const t=j(e.document);if(re({source:le,type:ie.SVE_HTML_PICK,on:!1},e),vr(e),R.forget(),F.callOpen=!1,F.callStore=null,ot(e),De(),G(),to(e),I=null,o.inspect=null,o.editingId=null,o.draft="",o.sections=[],o.pageBuilder=!1,V="",e?.clearTimeout?.(ke),!t){Ne(e);return}t.remove(),et.headerTab==="html_tree"&&Xn(e,null),Mn(e),It(e),At(e),Ne(e)}function wr(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=Ce,we(t,Yt,{title:p(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>ct(e)))}function $r(e){Qe(e),w(e)}function gr(e){const t=e.document;if(!Dn(e,"html_tree"))return;if(j(t)){Qe(e),w(e);return}if(!rn(t))return;_e=!0,D.clear(),On(e,[Ce]);const s=t.createElement("div");s.id=Ce,s.style.cssText=Bn,we(s,Yt,{title:p(e,"html_tree")}),s.querySelector("[data-sve-close]")?.addEventListener("click",()=>ct(e)),Fn(e,s),It(e),At(e),Ne(e),Qe(e),w(e)}function Pr(e){if(j(e.document)){ct(e);return}gr(e)}Ft("html-tree:from-preview",({path:e,src:t}={})=>{qt(window,e)||mr(window,fr(e,t)||e)});Ft("html-tree:arm-pick",e=>{const t=window;return e?(pn(t,Re(O())),!0):(j(t.document)||re({source:le,type:ie.SVE_HTML_PICK,on:!1},t),!0)});function Lr(){Y.clear(),ae.clear(),te.length=0}export{Oa as HTML_TREE_STYLE_ID,Cr as armHtmlTreePrefetch,Lr as clearHtmlTreeTemplates,G as closeHtmlTreeMenu,ct as closeHtmlTreePanel,Ba as ensureHtmlTreeStyles,wr as fillHtmlTreePane,I as htmlTreeActiveId,j as htmlTreePanel,Le as htmlTreeTimer,Pe as htmlTreeUnhook,gr as openHtmlTreePanel,w as renderHtmlTree,$r as showHtmlTreePane,vr as stopWatchHtmlTreeDock,Pr as toggleHtmlTreePanel,Qe as watchHtmlTreeDock};
