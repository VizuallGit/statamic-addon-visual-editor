const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-AWaJHJyk.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{_ as Fe,I as V,J as tn,K as $e,o as f,k as v,l as C,G as S,m as P,F as R,L as he,n as N,b2 as on,x as L,O as ft,b3 as nn,a as T,t as u,A as ye,C as sn,z as Lt,b4 as Kt,b5 as Gt,b6 as an,b7 as rn,b8 as ln,b9 as dn,ba as Qe,D as le,at as cn,bb as o,u as l,w as un,v as hn,M as re,bc as pn,B as fn,bd as X,be as mn,bf as vn,H as Le,j as _e,bg as gn,bh as yn,bi as zt,N as kn,Q as bn,s as Pt,au as mt,aq as _n,aO as vo,aP as go,i as Tn,al as Ut,a1 as je,X as xn,aN as Sn,ar as wn,as as Cn,bj as $n,bk as Xt,bl as yo,a0 as ko,bm as Ln,E as bo,a9 as Be,T as et,U as tt,ay as ot,az as Ie,S as Et,bn as Pn,bo as En,bp as Hn,bq as In,aR as An,aS as Mn,ax as Rn,br as Dn,a_ as On,ak as Ht,aK as Fn,aF as Bn}from"./addon-CCpQkekP.js";import{M as Q,S as ee}from"./protocol-Brvy2KuB.js";import{canEditFields as Nn,currentSetHandle as jn,openFieldsetOverlay as _o,openGlobalFieldsOverlay as Vn}from"./section-fields-CIOM30LI.js";import{H as Ve,ac as qn}from"./ai-text-icon-B7vA1keB.js";import{D as Y,E as Kn,F as It,G as Gn,t as zn,I as At,v as Un,z as Xn,b as nt,l as Yt,J as To,q as Yn,K as xo,H as Ae,L as Wn,M as Mt,N as So,O as wo,Q as Zn,h as Jn,c as Qn,R as es,S as ts,T as os,U as ns,V as ss,W as as,X as rs,Y as is,Z as ls,$ as ds}from"./tw-classes-lm6MwL7c.js";import{b as cs}from"./html-pick-align-CLq5l-p4.js";import"./FieldsetOverlay-DPXeZdj-.js";const us={class:"sve-dialog__title"},hs={for:"sve-new-section-group"},ps={class:"sve-dialog__row"},fs=["disabled"],ms=["value"],vs=["title","aria-label"],gs={key:0,class:"sve-dialog__add-group"},ys={for:"sve-new-section-group-name"},ks={class:"sve-dialog__row"},bs=["placeholder","disabled"],_s=["disabled"],Ts=["disabled"],xs={for:"sve-new-section-name"},Ss=["placeholder"],ws={key:1,class:"sve-dialog__toggle"},Cs={key:2,class:"sve-dialog__note"},$s={class:"sve-dialog__actions"},Ls=["disabled"],Ps=["disabled"],Es={__name:"NewSectionPrompt",props:{heading:{type:String,required:!0},groupLabel:{type:String,required:!0},nameLabel:{type:String,required:!0},placeholder:{type:String,default:""},note:{type:String,default:""},groups:{type:Array,required:!0},toggleLabel:{type:String,default:""},toggleOn:{type:Boolean,default:!0},cancelLabel:{type:String,required:!0},saveLabel:{type:String,required:!0},onOk:{type:Function,required:!0},onClose:{type:Function,required:!0},addGroupLabel:{type:String,default:""},addGroupNameLabel:{type:String,default:""},addGroupPlaceholder:{type:String,default:""},onAddGroup:{type:Function,default:null}},setup(e){const t=e,s=V(""),n=V([...t.groups]),a=V(t.groups[0]?.key??""),i=V(!1),r=V(""),d=V(null),p=V(!1);function g(){i.value=!0,r.value="",$e(()=>d.value?.focus())}function b(){i.value=!1,r.value="",$e(()=>x.value?.focus())}async function c(){const H=r.value.trim();if(!H||p.value||!t.onAddGroup){d.value?.focus();return}p.value=!0;const M=await t.onAddGroup(H);if(p.value=!1,!M?.key){d.value?.focus();return}n.value.some(I=>I.key===M.key)||n.value.push(M),a.value=M.key,i.value=!1,r.value="",$e(()=>x.value?.focus())}function k(H){H.key==="Enter"?(H.preventDefault(),c()):H.key==="Escape"&&(H.stopPropagation(),b())}const y=V(t.toggleOn),x=V(null),_=V(!1);tn(()=>$e(()=>x.value?.focus()));function m(){const H=s.value.trim();if(!H||n.value.length&&!a.value||_.value){x.value?.focus();return}_.value=!0,t.onOk(H,a.value,y.value)}function $(H){H.target===H.currentTarget&&t.onClose()}function F(H){H.key==="Enter"?m():H.key==="Escape"&&t.onClose()}return(H,M)=>(f(),v("div",{class:"sve-dialog-overlay",onClick:$},[C("div",{class:"sve-dialog",onClick:M[5]||(M[5]=S(()=>{},["stop"]))},[C("div",us,P(e.heading),1),n.value.length?(f(),v(R,{key:0},[C("label",hs,P(e.groupLabel),1),C("div",ps,[he(C("select",{id:"sve-new-section-group","onUpdate:modelValue":M[0]||(M[0]=I=>a.value=I),disabled:i.value,onKeydown:F},[(f(!0),v(R,null,N(n.value,I=>(f(),v("option",{key:I.key,value:I.key},P(I.display),9,ms))),128))],40,fs),[[on,a.value]]),e.onAddGroup&&!i.value?(f(),v("button",{key:0,type:"button",class:"is-add",title:e.addGroupLabel,"aria-label":e.addGroupLabel,"data-sve-new-group":"",onClick:g},[...M[6]||(M[6]=[C("span",{"aria-hidden":"true"},"+",-1)])],8,vs)):L("",!0)]),i.value?(f(),v("div",gs,[C("label",ys,P(e.addGroupNameLabel||e.addGroupLabel),1),C("div",ks,[he(C("input",{id:"sve-new-section-group-name",ref_key:"groupInput",ref:d,"onUpdate:modelValue":M[1]||(M[1]=I=>r.value=I),type:"text",placeholder:e.addGroupPlaceholder,disabled:p.value,"data-sve-new-group-name":"",onKeydown:k},null,40,bs),[[ft,r.value]]),C("button",{type:"button",class:"is-primary is-small",disabled:p.value,"data-sve-new-group-create":"",onClick:c},P(e.saveLabel),9,_s),C("button",{type:"button",class:"is-cancel is-small",disabled:p.value,onClick:b},P(e.cancelLabel),9,Ts)])])):L("",!0)],64)):L("",!0),C("label",xs,P(e.nameLabel),1),he(C("input",{id:"sve-new-section-name",ref_key:"input",ref:x,"onUpdate:modelValue":M[2]||(M[2]=I=>s.value=I),type:"text",placeholder:e.placeholder,onKeydown:F},null,40,Ss),[[ft,s.value]]),e.toggleLabel?(f(),v("label",ws,[he(C("input",{"onUpdate:modelValue":M[3]||(M[3]=I=>y.value=I),type:"checkbox",onKeydown:F},null,544),[[nn,y.value]]),C("span",null,P(e.toggleLabel),1)])):L("",!0),e.note?(f(),v("p",Cs,P(e.note),1)):L("",!0),C("div",$s,[C("button",{type:"button",class:"is-cancel",disabled:_.value,onClick:M[4]||(M[4]=(...I)=>e.onClose&&e.onClose(...I))},P(e.cancelLabel),9,Ls),C("button",{type:"button",class:"is-primary",disabled:_.value,onClick:m},P(e.saveLabel),9,Ps)])])]))}},Co=Fe(Es,[["__scopeId","data-v-6501522a"]]),Rt="/!/sve/section-types",Wt="static_sections";async function Hs(e){const t=await e.fetch(Rt,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!t.ok)throw new Error(`section-types ${t.status}`);const s=await t.json();if(Array.isArray(s.groups)&&s.groups.length)return s.groups.filter(a=>a&&a.handle&&a.handle!==Wt).map(a=>({key:a.handle,display:a.display||a.handle}));const n=new Map;for(const a of s.types||[])a?.group&&a.group!==Wt&&!n.has(a.group)&&n.set(a.group,a.group_display||a.group);return[...n].map(([a,i])=>({key:a,display:i}))}async function Is(e,t){const s=await e.fetch(`${Rt}/groups`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Lt(e),"X-Requested-With":"XMLHttpRequest",Accept:"application/json"},body:JSON.stringify({display:t})}),n=await s.json().catch(()=>({}));if(!s.ok||!n.group?.handle)throw new Error(n?.error==="bad_name"?"bad_name":`section-types/groups ${s.status}`);return e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale")),{key:n.group.handle,display:n.group.display||n.group.handle}}const Me=new Map;function As(e){e?.handle&&Me.set(e.handle,{static:!!e.static,hidden:!!e.hidden})}function Ms(e,t){return t?Me.has(t)?Me.get(t).static:e.Statamic?.$config?.get?.("sveSetMeta")?.[t]?.static===!0:!1}function Rs(e,t){if(!t)return!1;if(Me.has(t))return Me.get(t).hidden;const s=e.Statamic?.$config?.get?.("sveSectionTypes");return Array.isArray(s)&&s.some(n=>n?.handle===t&&n.hidden===!0)}async function $o(e,t,s){const n=await e.fetch(Rt,{method:t,headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Lt(e),Accept:"application/json"},credentials:"same-origin",body:JSON.stringify(s)}),a=await n.json().catch(()=>({}));if(!n.ok){const i=new Error(a.error||`section-types ${n.status}`);throw i.reason=a.error,i}return As(a.section),a}function Ds(e,{display:t,group:s="",static:n=!1,hidden:a=!1}){return $o(e,"POST",{display:t,group:s,static:n,hidden:a})}function Zt(e,{handle:t,hidden:s,fields:n=!1}){const a={handle:t,fields:n};return typeof s=="boolean"&&(a.hidden=s),$o(e,"PATCH",a)}async function Os(e,t,s=null,n=null){if(!t||typeof Kt!="function"||typeof Gt!="function")return null;const a=await Kt(e,t);if(!a)return null;n&&Array.isArray(a.definitions)&&an(t,{display:n.display||t,icon:n.icon||null,hide:n.hidden===!0,fields:a.definitions,group_display:n.group_display||n.group||""},n.group||"");const i=rn(),r=ln(e,"page",{handle:t},a?.defaults,i),d=dn(r,a?.new||{},a?.defaults);return Gt(e,e.document,s,r,d)?r:null}const Jt=700,Fs=17;function Bs(e,t){const s=(t||[]).filter(Boolean);if(!s.length)return;let n=0;const a=()=>{n+=1;const i=Qe(e),r=i?s.some(d=>i.querySelector(`[data-sid="${CSS.escape(d)}"]`)):!0;r&&le({source:ee,type:Q.SVE_ACTIVATE,ids:s},e),(r?!i&&n<6:n<Fs)&&e.setTimeout(a,Jt)};e.setTimeout(a,Jt)}function Lo(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function Ns(e){return new Promise(t=>{let s=!1;const n=i=>{s||(s=!0,a.dismiss(),t(i==="static"||i==="fields"?i:null))},a=ye(e.document,sn,{title:u(e,"section_new_kind"),body:u(e,"section_new_kind_note"),buttons:[{value:"cancel",label:u(e,"cancel"),variant:"ghost"},{value:"static",label:u(e,"section_new_static"),variant:"primary"},{value:"fields",label:u(e,"section_new_with_fields"),variant:"primary"}],onPick:n,onClose:()=>n(null)})})}const js=`<section class="[ ] py-800">
    
</section>
`;function Vs(e){if(T("dock:is-locked")===!0)return e.Statamic?.$toast?.error(u(e,"code_dock_locked")),!1;const s=`${String(T("dock:html")||"").replace(/\s+$/,"")}

${js}`;return T("dock:set-html",s)!==!0?(e.Statamic?.$toast?.error(u(e,"section_new_failed")),!1):(T("dock:save-now"),e.Statamic?.$toast?.success(u(e,"section_new_template_done")),!0)}async function Po(e,t,s,{afterUid:n,onDone:a,onError:i}){try{const r=await Ds(e,s);t.dismiss(),e.Statamic?.$toast?.success(u(e,"section_created",{name:r.section?.display||s.display})),vt(e);const d=r.section?.handle?{...r.section,group_display:(r.section_types||[]).find(g=>g?.handle===r.section.handle)?.group_display||""}:null,p=await Os(e,r.section?.handle,n,d);!p&&r.section?.handle&&T("dock:open-template",r.section.handle),a?.({...r,uid:p?._visual_id||""})}catch(r){t.dismiss(),e.Statamic?.$toast?.error(u(e,r.reason==="bad_name"?"section_new_bad_name":"section_new_failed")),i?.(r)}}function vt(e){e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"))}function qs(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){const i=ye(e.document,Co,{heading:u(e,"static_section_new"),groupLabel:"",nameLabel:u(e,"section_new_name"),placeholder:u(e,"section_new_placeholder"),note:u(e,"static_section_note"),groups:[],toggleLabel:u(e,"static_section_insertable"),cancelLabel:u(e,"cancel"),saveLabel:u(e,"section_new_create"),onClose:a,onOk:(r,d,p)=>{Po(e,i,{display:r,static:!0,hidden:!p},{afterUid:t,onDone:s,onError:n})}})}function Ks(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){(async()=>{let i=[];try{i=await Hs(e)}catch(d){n?.(d),e.Statamic?.$toast?.error(u(e,"section_new_failed"));return}if(!i.length){n?.(new Error("no groups")),e.Statamic?.$toast?.error(u(e,"section_new_failed"));return}const r=ye(e.document,Co,{heading:u(e,"section_new"),groupLabel:u(e,"section_new_group"),nameLabel:u(e,"section_new_name"),placeholder:u(e,"section_new_placeholder"),note:u(e,"section_new_note"),groups:i,addGroupLabel:u(e,"section_new_group_add"),addGroupNameLabel:u(e,"section_new_group_name"),addGroupPlaceholder:u(e,"section_new_group_placeholder"),onAddGroup:async d=>{try{const p=await Is(e,d);return e.Statamic?.$toast?.success(u(e,"section_group_created",{name:p.display})),p}catch(p){return e.Statamic?.$toast?.error(u(e,p?.message==="bad_name"?"section_new_bad_name":"section_group_failed")),null}},cancelLabel:u(e,"cancel"),saveLabel:u(e,"section_new_create"),onClose:a,onOk:(d,p)=>{Po(e,r,{display:d,group:p},{afterUid:t,onDone:s,onError:n})}})})()}const Gs={key:0,class:"sve-ht-inspect"},zs={class:"sve-ht-inspect__head"},Us={key:0,class:"sve-ht-inspect__note"},Xs={key:2,class:"sve-ht-inspect__props"},Ys={class:"sve-ht-inspect__proplabel"},Ws={key:0},Zs=["value","disabled","onChange"],Js={value:""},Qs=["value"],ea=["value"],ta=["value","placeholder","onChange"],oa=["title","disabled","onClick"],na=["title","disabled","onClick"],sa={key:0,class:"sve-ht-inspect__seg"},aa=["data-active","disabled","onClick"],ra=["value","disabled"],ia={key:0,value:""},la=["value"],da={key:2,class:"sve-ht-inspect__box"},ca=["value","placeholder","disabled","onKeydown"],ua=["title","disabled"],ha={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},pa=["value","disabled"],fa=["value"],ma={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},va=["value","placeholder","disabled"],ga=["title","disabled"],ya={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},ka=["value","placeholder","disabled"],ba={key:4,class:"sve-ht-inspect__add"},_a=["disabled","onClick"],it='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',Ta='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',xa={__name:"HtmlTreeInspector",setup(e){const t=V(null);cn(t,g=>o.onPropHost?.(g||null));const s=V(null),n=V(null);function a(g){o.onInspectCommit?.(g.target.value)}function i(g,b,c){!g||!b||(g.value=b,g.focus(),g.setSelectionRange(b.length,b.length),c(b))}function r(g,b){o.onInspectData?.(g.currentTarget,c=>o.onPropValue?.(b.handle,c,!0))}function d(g){o.onInspectData?.(g.currentTarget,b=>i(s.value,b,c=>o.onInspectCommit?.(c)))}function p(g){o.onInspectData?.(g.currentTarget,b=>i(n.value,b,c=>o.onLoopSortField?.(c)))}return(g,b)=>l(o).inspect?(f(),v("div",Gs,[C("div",zs,P(l(o).inspect.title),1),l(o).inspect.mode==="note"?(f(),v("div",Us,P(l(o).inspect.note),1)):l(o).inspect.mode==="statamic"?(f(),v("div",{key:1,ref_key:"propHost",ref:t,class:"sve-ht-inspect__form"},null,512)):l(o).inspect.mode==="props"?(f(),v("div",Xs,[(f(!0),v(R,null,N(l(o).inspect.rows,c=>(f(),v("label",{key:c.handle,class:"sve-ht-inspect__prop"},[C("span",Ys,[un(P(c.label)+" ",1),c.bound?(f(),v("em",Ws,":")):L("",!0)]),C("span",{class:hn(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":c.type==="select"||c.type==="link"}])},[c.type==="select"&&!c.bound?(f(),v("select",{key:0,value:c.value,disabled:!l(o).canEdit,onChange:k=>l(o).onPropValue?.(c.handle,k.target.value,!1)},[C("option",Js,P(c.placeholder||l(o).inspect.inheritLabel),1),c.value&&!c.options.includes(c.value)?(f(),v("option",{key:0,value:c.value},P(c.value),9,Qs)):L("",!0),(f(!0),v(R,null,N(c.options,k=>(f(),v("option",{key:k,value:k},P(k),9,ea))),128))],40,Zs)):(f(),v("input",{key:1,type:"text",value:c.value,placeholder:c.placeholder||l(o).inspect.inheritLabel,onChange:k=>l(o).onPropValue?.(c.handle,k.target.value,c.bound)},null,40,ta)),c.type==="link"?(f(),v("button",{key:2,type:"button","data-sve-ht-data":"",title:l(o).pageTitle,disabled:!l(o).canEdit,onClick:k=>l(o).onPropPage?.(k.currentTarget,c.handle),innerHTML:Ta},null,8,oa)):L("",!0),C("button",{type:"button","data-sve-ht-data":"",title:l(o).dataTitle,disabled:!l(o).canEdit,onClick:k=>r(k,c),innerHTML:it},null,8,na)],2)]))),128))])):(f(),v(R,{key:3},[l(o).inspect.mode==="loop"?(f(),v("div",sa,[(f(!0),v(R,null,N(l(o).inspect.kinds,c=>(f(),v("button",{key:c.id,type:"button","data-active":c.id===l(o).inspect.loopKind?"":void 0,disabled:!l(o).canEdit,onClick:k=>l(o).onLoopKind?.(c.id)},P(c.label),9,aa))),128))])):L("",!0),l(o).inspect.mode==="loop"&&l(o).inspect.loopKind==="collection"?(f(),v("select",{key:l(o).inspect.key+":"+l(o).inspect.value,value:l(o).inspect.value,disabled:!l(o).canEdit,onChange:a},[l(o).inspect.value?L("",!0):(f(),v("option",ia,P(l(o).inspect.placeholder),1)),(f(!0),v(R,null,N(l(o).inspect.collections,c=>(f(),v("option",{key:c.handle,value:c.handle},P(c.title),9,la))),128))],40,ra)):(f(),v("div",da,[(f(),v("input",{ref_key:"field",ref:s,key:l(o).inspect.key,type:"text",value:l(o).inspect.value,placeholder:l(o).inspect.placeholder,disabled:!l(o).canEdit,spellcheck:"false",onKeydown:[b[0]||(b[0]=S(()=>{},["stop"])),re(S(a,["prevent"]),["enter"])],onBlur:a},null,40,ca)),C("button",{type:"button","data-sve-ht-data":"",title:l(o).dataTitle,disabled:!l(o).canEdit,innerHTML:it,onMousedown:b[1]||(b[1]=S(()=>{},["prevent"])),onClick:S(d,["stop","prevent"])},null,40,ua)])),l(o).inspect.sort?(f(),v(R,{key:3},[C("div",ha,P(l(o).inspect.sort.title),1),(f(),v("select",{key:l(o).inspect.key+":dir:"+l(o).inspect.sort.dir,value:l(o).inspect.sort.dir,disabled:!l(o).canEdit,onChange:b[2]||(b[2]=c=>l(o).onLoopSortDir?.(c.target.value))},[(f(!0),v(R,null,N(l(o).inspect.sort.dirs,c=>(f(),v("option",{key:c.id,value:c.id},P(c.label),9,fa))),128))],40,pa)),l(o).inspect.sort.needsField?(f(),v("div",ma,[(f(),v("input",{ref_key:"sortField",ref:n,key:l(o).inspect.key+":field",type:"text",value:l(o).inspect.sort.field,placeholder:l(o).inspect.sort.placeholder,disabled:!l(o).canEdit,spellcheck:"false",onKeydown:[b[3]||(b[3]=S(()=>{},["stop"])),b[4]||(b[4]=re(S(c=>l(o).onLoopSortField?.(c.target.value),["prevent"]),["enter"]))],onBlur:b[5]||(b[5]=c=>l(o).onLoopSortField?.(c.target.value))},null,40,va)),l(o).inspect.sort.pickable?(f(),v("button",{key:0,type:"button","data-sve-ht-data":"",title:l(o).dataTitle,disabled:!l(o).canEdit,innerHTML:it,onMousedown:b[6]||(b[6]=S(()=>{},["prevent"])),onClick:S(p,["stop","prevent"])},null,40,ga)):L("",!0)])):L("",!0),C("div",ya,P(l(o).inspect.limit.title),1),(f(),v("input",{key:l(o).inspect.key+":limit",type:"number",min:"1",value:l(o).inspect.limit.value,placeholder:l(o).inspect.limit.placeholder,disabled:!l(o).canEdit,onKeydown:[b[7]||(b[7]=S(()=>{},["stop"])),b[8]||(b[8]=re(S(c=>l(o).onLoopLimit?.(c.target.value),["prevent"]),["enter"]))],onBlur:b[9]||(b[9]=c=>l(o).onLoopLimit?.(c.target.value))},null,40,ka))],64)):L("",!0),l(o).inspect.branches?.length?(f(),v("div",ba,[(f(!0),v(R,null,N(l(o).inspect.branches,c=>(f(),v("button",{key:c.id,type:"button",disabled:!l(o).canEdit,onClick:k=>l(o).onAddBranch?.(c.id)},P(c.label),9,_a))),128))])):L("",!0)],64))])):L("",!0)}},Sa=Fe(xa,[["__scopeId","data-v-26254b75"]]),wa={class:"sve-html-tree"},Ca={class:"sve-pane-bar","data-sve-pane-bar":""},$a={"data-sve-right-title":""},La={"data-sve-right-actions":""},Pa=["aria-pressed","title","aria-label"],Ea={class:"sve-ht-tools"},Ha=["title"],Ia=["placeholder","aria-label","value"],Aa=["aria-label"],Ma=["title","aria-label"],Ra={key:1,class:"sve-tree-exit"},Da=["title"],Oa=["title"],Fa='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',Ba='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',Na='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',ja='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',Va={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const t=u(window,"html_tree_search");o.layers=pn(window);const s=u(window,"html_tree_layers_on"),n=u(window,"html_tree_layers_off");function a(){vn(window,!o.layers)}const i=Lo(window),r=u(window,"section_new"),d=V(!1);function p(){d.value=!1}async function g(k){if(!k)return;await $e(),o.onRefresh?.();const y=T("html-tree:open-section",k);y&&Bs(window,y.ids)}function b(){d.value||(d.value=!0,(async()=>{if(!(o.sections.length||o.pageBuilder)){Vs(window),p();return}const k=await Ns(window);if(!k){p();return}const y=o.sections.length?o.sections[o.sections.length-1].uid:null,x=_=>{p(),g(_?.uid)};if(k==="static"){qs(window,{afterUid:y,onDone:x,onError:p,onClose:p});return}Ks(window,{afterUid:y,onDone:x,onError:p,onClose:p})})())}function c(k){const y=!!o.query;o.query=k,y!==!!k&&o.onQuery?.()}return(k,y)=>(f(),v("div",wa,[C("div",Ca,[C("div",$a,P(e.title),1),C("div",La,[C("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":l(o).layers?"true":"false",title:l(o).layers?l(n):l(s),"aria-label":l(o).layers?l(n):l(s),innerHTML:Fa,onClick:a},null,8,Pa),y[5]||(y[5]=fn('<button type="button" data-sve-right-pin aria-pressed="false" data-v-b2e9ab8b></button><button type="button" data-sve-close aria-label="Close" data-v-b2e9ab8b><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-b2e9ab8b><path d="M18 6 6 18" data-v-b2e9ab8b></path><path d="m6 6 12 12" data-v-b2e9ab8b></path></svg></button>',2))])]),C("div",Ea,[C("label",{class:"sve-ht-search",title:l(t)},[C("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:Na}),C("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:l(t),"aria-label":l(t),value:l(o).query,autocomplete:"off",spellcheck:"false",onInput:y[0]||(y[0]=x=>c(x.target.value)),onKeydown:[y[1]||(y[1]=S(()=>{},["stop"])),y[2]||(y[2]=re(S(x=>c(""),["prevent"]),["escape"]))]},null,40,Ia),l(o).query?(f(),v("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":l(t),innerHTML:ja,onClick:y[3]||(y[3]=x=>c(""))},null,8,Aa)):L("",!0)],8,Ha),l(i)&&(l(o).sections.length||l(o).pageBuilder||l(o).rows.length)?(f(),v("button",{key:0,type:"button",class:"sve-ht-new",title:l(r),"aria-label":l(r),innerHTML:Ba,onClick:b},null,8,Ma)):L("",!0)]),l(Y).inSidebar?L("",!0):(f(),X(Kn,{key:0})),y[6]||(y[6]=C("div",{"data-sve-html-tree-list":""},null,-1)),mn(Sa),l(o).exitOpen&&!l(Y).inSidebar?(f(),v("div",Ra,[C("span",{class:"sve-tree-exit__name",title:l(o).exitName},P(l(o).exitName),9,Da),C("button",{type:"button",class:"sve-tree-exit__go",title:l(o).exitTitle,onClick:y[4]||(y[4]=x=>l(o).onExit?.())},P(l(o).exitLabel),9,Oa)])):L("",!0)]))}},Eo=Fe(Va,[["__scopeId","data-v-b2e9ab8b"]]);function Ho(e){return String(e||"").trim().toLowerCase()}function gt(e,t){return t?[e.name,e.tag,e.klass,e.label,e.src].filter(s=>typeof s=="string"&&s).join(" ").toLowerCase().includes(t):!0}function qa(e,t){const s=Ho(t);if(!s)return{rows:e,hits:new Set};const n=new Set;for(const r of e)gt(r,s)&&n.add(r.path);const a=[...n];return{rows:e.filter(r=>n.has(r.path)||a.some(d=>d.startsWith(`${r.path}/`))),hits:n}}const Ka=["title"],Ga={"data-sve-ht-indent":"","aria-hidden":"true"},za=["data-sve-ht-cat"],Ua={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},Xa={key:2,"data-sve-ht-letter":""},Ya=["innerHTML"],Wa=["title"],Za=["title"],Ja={key:1,"data-sve-ht-kind":""},Qa={key:3,"data-sve-ht-name":""},er={key:4,"data-sve-ht-actions":""},tr=["title"],or={key:5,"data-sve-ht-actions":""},nr=["data-on","title","innerHTML"],sr=["disabled","title","innerHTML"],ar=["disabled","title"],rr=["disabled","title"],ir=["disabled","title"],lr=["data-sve-ht-id"],Qt='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',dr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',cr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',ur='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',hr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',pr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',fr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',mr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',vr={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const t=Nn(window),s=u(window,"section_fields");function n(){const _=jn();if(!_){window.Statamic?.$toast?.error(u(window,"section_fields_none"));return}_o(window,_)}function a(_){return _.synthetic?_.frame==="main"?o.frameMainTitle:_.frame==="template"?o.frameTemplateTitle:o.frameOpenTitle:_.kind==="component"?_.src?`partial:${_.src}`:_.tag:_.name?`${_.tag} ${_.name}`:_.tag}function i(_){return!!_.section}function r(_){return!!_.frame}function d(_){return _.kind==="slot"}function p(_){return!!_.context}function g(_,m){p(m)||r(m)||d(m)||(i(m)?o.onSectionPointerDown?.(_,m.section):m.sectionRoot?o.onSectionPointerDown?.(_,m.sectionRoot):o.onPointerDown?.(_,m.id))}function b(_){if(_.synthetic){o.onFrame?.(_.frame);return}if(i(_)){o.onSection?.(_.section);return}if(p(_)){o.onContextRow?.(_.id);return}o.onSelect?.(_.id)}function c(_,m){const $={"data-sve-ht-id":_.id};return _.current&&($["data-sve-ht-current"]=""),_.hidden&&($["data-sve-ht-hidden"]=""),$["data-sve-ht-cat"]=_.cat||"other",$["data-sve-ht-depth"]=String(_.depth),m&&($["data-sve-ht-dim"]=""),p(_)&&($["data-sve-ht-context"]=_.context),i(_)&&($["data-sve-ht-sec"]=""),r(_)&&($["data-sve-ht-frame"]=_.frame),!i(_)&&o.dropId===_.id&&o.dropPlace&&($["data-sve-ht-drop"]=o.dropPlace),$}function k(_){return!_.hidden||_.wrapFrom!=null}function y(_){return!!_.sectionRoot||!!_.section}function x(_){return o.canEdit||y(_)}return(_,m)=>(f(),v(R,null,[C("div",Le({"data-sve-ht-row":""},c(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:m[32]||(m[32]=$=>b(e.row)),onDblclick:m[33]||(m[33]=S($=>e.row.synthetic?l(o).onFrameEnter?.(e.row.frame):r(e.row)||d(e.row)||i(e.row)||p(e.row)?null:l(o).onRename?.(e.row.id),["prevent"])),onKeydown:[m[34]||(m[34]=re(S($=>b(e.row),["prevent"]),["enter"])),m[35]||(m[35]=re(S($=>b(e.row),["prevent"]),["space"]))],onPointerdown:m[36]||(m[36]=$=>g($,e.row)),onContextmenu:m[37]||(m[37]=S($=>r(e.row)||d(e.row)||i(e.row)||p(e.row)?null:l(o).onContext?.($,e.row.id),["prevent","stop"]))}),[C("span",Ga,[(f(!0),v(R,null,N(e.row.guides||[],($,F)=>(f(),v("i",{key:F,"data-sve-ht-cat":$},null,8,za))),128))]),e.row.hasChildren||e.row.emptyBlock?(f(),v("button",Le({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?l(o).mainShut:e.row.shut)?{"data-sve-ht-shut":""}:{},{innerHTML:dr,onClick:m[0]||(m[0]=S($=>e.row.synthetic?l(o).onFrameTwist?.():i(e.row)?l(o).onSection?.(e.row.section):l(o).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:m[1]||(m[1]=S(()=>{},["stop"])),onDblclick:m[2]||(m[2]=S(()=>{},["stop"]))}),null,16)):(f(),v("span",Ua)),e.row.letter?(f(),v("span",Xa,P(e.row.letter),1)):(f(),v("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Ya)),C("span",{"data-sve-ht-text":"",title:l(o).renameTitle},[!e.row.kind&&!i(e.row)&&!p(e.row)&&!r(e.row)?(f(),v("button",{key:0,type:"button","data-sve-ht-tag":"",title:l(o).tagTitle,onClick:m[3]||(m[3]=S(()=>{},["stop","prevent"])),onPointerdown:m[4]||(m[4]=S(()=>{},["stop"])),onDblclick:m[5]||(m[5]=S($=>l(o).onTagChange?.($,e.row.id),["stop","prevent"]))},P(e.row.tag),41,Za)):(f(),v("span",Ja,P(e.row.tag),1)),l(o).editingId===e.row.id&&!i(e.row)?he((f(),v("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":m[6]||(m[6]=$=>l(o).draft=$),onMousedown:m[7]||(m[7]=S(()=>{},["stop"])),onPointerdown:m[8]||(m[8]=S(()=>{},["stop"])),onClick:m[9]||(m[9]=S(()=>{},["stop"])),onDblclick:m[10]||(m[10]=S(()=>{},["stop"])),onKeydown:[m[11]||(m[11]=S(()=>{},["stop"])),m[12]||(m[12]=re(S($=>l(o).onRenameCommit?.(),["prevent"]),["enter"])),m[13]||(m[13]=re(S($=>l(o).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:m[14]||(m[14]=$=>l(o).onRenameCommit?.())},null,544)),[[ft,l(o).draft]]):(f(),v("span",Qa,P(e.row.name),1))],8,Wa),r(e.row)?(f(),v("span",er,[e.row.frame!=="main"&&l(t)?(f(),v("button",{key:0,type:"button","data-sve-ht-fields":"",title:l(o).frameFieldsTitle,innerHTML:Qt,onClick:m[15]||(m[15]=S($=>l(o).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:m[16]||(m[16]=S(()=>{},["stop"])),onDblclick:m[17]||(m[17]=S(()=>{},["stop"]))},null,40,tr)):L("",!0)])):!i(e.row)&&!p(e.row)&&!d(e.row)?(f(),v("span",or,[e.row.videoNth>=0?(f(),v("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?l(o).videoPlayTitle:l(o).videoHoldTitle,innerHTML:e.row.videoHeld?fr:pr,onClick:m[18]||(m[18]=S($=>l(o).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:m[19]||(m[19]=S(()=>{},["stop"])),onDblclick:m[20]||(m[20]=S(()=>{},["stop"]))},null,40,nr)):L("",!0),k(e.row)?(f(),v("button",{key:1,type:"button","data-sve-ht-eye":"",disabled:!l(o).canEdit,title:l(o).canEdit?e.row.hidden?l(o).showTitle:l(o).hideTitle:l(o).lockedTitle,innerHTML:e.row.hidden?ur:cr,onClick:m[21]||(m[21]=S($=>l(o).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:m[22]||(m[22]=S(()=>{},["stop"])),onDblclick:m[23]||(m[23]=S(()=>{},["stop"]))},null,40,sr)):L("",!0),l(t)&&e.row.fieldsIcon?(f(),v("button",{key:2,type:"button","data-sve-ht-fields":"",disabled:!l(o).canEdit,title:l(o).canEdit?l(s):l(o).lockedTitle,innerHTML:Qt,onClick:S(n,["stop","prevent"]),onPointerdown:m[24]||(m[24]=S(()=>{},["stop"])),onDblclick:m[25]||(m[25]=S(()=>{},["stop"]))},null,40,ar)):L("",!0),C("button",{type:"button","data-sve-ht-dup":"",disabled:!x(e.row),title:x(e.row)?l(o).duplicateTitle:l(o).lockedTitle,innerHTML:hr,onClick:m[26]||(m[26]=S($=>l(o).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:m[27]||(m[27]=S(()=>{},["stop"])),onDblclick:m[28]||(m[28]=S(()=>{},["stop"]))},null,40,rr),C("button",{type:"button","data-sve-ht-del":"",disabled:!x(e.row),title:x(e.row)?l(o).deleteTitle:l(o).lockedTitle,innerHTML:mr,onClick:m[29]||(m[29]=S($=>l(o).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:m[30]||(m[30]=S(()=>{},["stop"])),onDblclick:m[31]||(m[31]=S(()=>{},["stop"]))},null,40,ir)])):L("",!0)],16,Ka),e.row.emptyBlock&&!e.row.shut?(f(),v("div",Le({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},l(o).dropId===e.row.id&&l(o).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),P(l(o).slotText),17,lr)):L("",!0)],64))}},Z=Fe(vr,[["__scopeId","data-v-67d89fc6"]]),gr=["data-sve-ht-look","data-sve-ht-layers"],yr={key:0,class:"sve-ht-empty"},kr={key:1,class:"sve-ht-empty"},br={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},_r={key:0,class:"sve-ht-empty"},Tr={key:0,class:"sve-ht-empty"},xr={key:2,"data-sve-ht-frame-body":""},Sr={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},wr={key:0,class:"sve-ht-empty"},Cr={key:3,"data-sve-ht-frame-body":""},$r=["data-dim"],Lr={key:0,class:"sve-ht-empty"},Pr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},Er={key:0,class:"sve-ht-empty"},Hr={__name:"HtmlTreeList",setup(e){const t=_e(()=>Ho(o.query)),s=_e(()=>qa(o.rows,t.value)),n=_e(()=>s.value.rows),a=_e(()=>t.value?o.sections.filter(c=>gt(c.row,t.value)||c.current&&c.ready&&n.value.length>0):o.sections);function i(c){return!!c&&(!t.value||gt(c,t.value))}function r(c){const k=o.frame?.kind;return o.inComponent||(k==="header"||k==="footer")&&k!==c}const d=_e(()=>!!o.frame&&["header","main","footer"].some(c=>i(o.frame[c]))),p=_e(()=>!!t.value&&!a.value.length&&!n.value.length&&!d.value);function g(c){return!!t.value&&!s.value.hits.has(c.path)}function b(c){const k={"data-sve-ht-sec-uid":c.uid};return c.current&&(k["data-sve-ht-branch"]="",k["data-sve-ht-cat"]=c.row?.cat||"layout"),o.sectionDrop&&o.sectionDrop.uid===c.uid&&(k["data-sve-ht-drop"]=o.sectionDrop.place),k}return(c,k)=>(f(),v("div",Le({class:"sve-ht-root","data-sve-ht-look":l(o).layers?"tags":l(o).look,"data-sve-ht-layers":l(o).layers?"":null,style:l(o).familyStyle},l(o).dragging?{"data-sve-ht-dragging":""}:{}),[!l(o).rows.length&&!l(o).sections.length&&!l(o).frame?(f(),v("div",yr,P(l(o).emptyText),1)):p.value?(f(),v("div",kr,P(l(o).searchEmpty),1)):L("",!0),l(o).frame||l(o).sections.length?(f(),v(R,{key:2},[l(o).frame?(f(),v(R,{key:0},[l(o).frame.kind==="header"?(f(),v("div",br,[(f(!0),v(R,null,N(n.value,y=>(f(),X(Z,{key:y.id,row:y,dim:g(y)},null,8,["row","dim"]))),128)),l(o).rows.length?L("",!0):(f(),v("div",_r,P(l(o).emptyText),1))])):i(l(o).frame.header)?(f(),X(Z,{key:1,row:l(o).frame.header,dim:r("header")},null,8,["row","dim"])):L("",!0)],64)):L("",!0),C("div",gn(yn(l(o).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[l(o).frame?.kind==="main"?(f(),v(R,{key:0},[(f(!0),v(R,null,N(n.value,y=>(f(),X(Z,{key:y.id,row:y,dim:g(y)},null,8,["row","dim"]))),128)),l(o).rows.length?L("",!0):(f(),v("div",Tr,P(l(o).emptyText),1))],64)):l(o).frame&&i(l(o).frame.main)?(f(),X(Z,{key:1,row:l(o).frame.main,dim:r("main")},null,8,["row","dim"])):L("",!0),l(o).frame?.kind==="template"?he((f(),v("div",xr,[C("div",Sr,[(f(!0),v(R,null,N(n.value,y=>(f(),X(Z,{key:y.id,row:y,dim:g(y)},null,8,["row","dim"]))),128)),l(o).rows.length?L("",!0):(f(),v("div",wr,P(l(o).emptyText),1))])],512)),[[zt,!l(o).mainShut]]):L("",!0),l(o).sections.length||l(o).frame?he((f(),v("div",Cr,[l(o).frame?.template&&i(l(o).frame.template)?(f(),X(Z,{key:0,row:l(o).frame.template,dim:r("template")},null,8,["row","dim"])):L("",!0),l(o).frame&&!l(o).frame.template&&!l(o).sections.length&&!t.value?(f(),v("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":r("")?"":void 0},P(l(o).frameEmptyText),9,$r)):L("",!0),(f(!0),v(R,null,N(a.value,y=>(f(),v("div",Le({key:y.uid},{ref_for:!0},b(y)),[y.ready?(f(),v(R,{key:0},[(f(!0),v(R,null,N(n.value,x=>(f(),X(Z,{key:x.id,row:x,dim:g(x)},null,8,["row","dim"]))),128)),l(o).rows.length?L("",!0):(f(),v("div",Lr,P(l(o).emptyText),1))],64)):(f(),X(Z,{key:1,row:y.row,dim:r("")},null,8,["row","dim"]))],16))),128))],512)),[[zt,!l(o).frame||!l(o).mainShut]]):L("",!0)],16),l(o).frame?(f(),v(R,{key:1},[l(o).frame.kind==="footer"?(f(),v("div",Pr,[(f(!0),v(R,null,N(n.value,y=>(f(),X(Z,{key:y.id,row:y,dim:g(y)},null,8,["row","dim"]))),128)),l(o).rows.length?L("",!0):(f(),v("div",Er,P(l(o).emptyText),1))])):i(l(o).frame.footer)?(f(),X(Z,{key:1,row:l(o).frame.footer,dim:r("footer")},null,8,["row","dim"])):L("",!0)],64)):L("",!0)],64)):l(o).rows.length?(f(!0),v(R,{key:3},N(n.value,y=>(f(),X(Z,{key:y.id,row:y,dim:g(y)},null,8,["row","dim"]))),128)):L("",!0)],16,gr))}},eo=Fe(Hr,[["__scopeId","data-v-1efba2e6"]]);let lt=null;function Ir(e){return lt||(lt=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{pages:[]}).then(t=>Array.isArray(t.pages)?t.pages:[]).catch(()=>[])),lt}let qe=null;function dt(){qe?.dismiss(),qe=null}function Ar(e,t,s){dt();const n=t?.getBoundingClientRect?.(),a={x:n?n.left:0,y:n?n.bottom+4:0};Ir(e).then(i=>{const r=i.length?i.map(d=>({label:d.title||d.url,onPick:()=>{dt(),s(d.url)}})):[{label:u(e,"component_props_pages_none"),onPick:null}];dt(),qe=ye(e.document,It,{items:r,x:a.x,y:a.y,onClose:()=>{qe=null}})})}const Io="sve-html-tree-labels";function Ao(){try{const e=globalThis.localStorage?.getItem(Io);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function Mr(e){try{globalThis.localStorage?.setItem(Io,JSON.stringify(e))}catch{}}function Mo(e){return String(e||"_")}function Ro(e){const t=Ao()[Mo(e)];return t&&typeof t=="object"?{...t}:{}}function Rr(e,t,s){const n=s?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function Dr(e,t,s,n){if(!t)return;const a=Mo(e),i=Ao(),r={...i[a]||{}},d=String(s||"").replace(/\s+/g," ").trim(),p=String(n||"").trim();!d||d===p?delete r[t]:r[t]=d,Object.keys(r).length?i[a]=r:delete i[a],Mr(i)}const Or=/^@(media|supports|container|layer|scope)\b/i;function Fr(e){const t=String(e||""),s=[];let n=0,a=0;for(;n<t.length;){if(t[n]==="{"&&t[n+1]==="{"){const d=t.indexOf("}}",n+2);n=d===-1?t.length:d+2;continue}if(t[n]==="/"&&t[n+1]==="*"){const d=t.indexOf("*/",n+2);n=d===-1?t.length:d+2;continue}if(t[n]==='"'||t[n]==="'"){const d=t[n];for(n+=1;n<t.length&&t[n]!==d;)n+=t[n]==="\\"?2:1;n+=1;continue}if(t[n]!=="{"){n+=1;continue}let i=1,r=n+1;for(;r<t.length&&i>0;){if(t[r]==="{"&&t[r+1]==="{"){const d=t.indexOf("}}",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==="/"&&t[r+1]==="*"){const d=t.indexOf("*/",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==='"'||t[r]==="'"){const d=t[r];for(r+=1;r<t.length&&t[r]!==d;)r+=t[r]==="\\"?2:1;r+=1;continue}t[r]==="{"?i+=1:t[r]==="}"&&(i-=1),r+=1}s.push({selector:t.slice(a,n).trim(),body:t.slice(n+1,r-1),from:a,to:r,text:t.slice(a,r).trim()}),n=r,a=r}return s}function to(e){const t=String(e||""),s=new Set,n=new Set,a=new Set;for(const i of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const r of i[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))r&&(s.add(r),s.add(r.replace(/([:./%!#()[\],])/g,"\\$1")));for(const i of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))i[2].trim()&&n.add(i[2].trim());for(const i of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))a.add(i[1].toLowerCase());return{classes:s,ids:n,tags:a}}function oo(e,t){const s=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),n=[...s.matchAll(/\.((?:\\.|[\w-])+)/g)].map(r=>r[1]),a=[...s.matchAll(/#((?:\\.|[\w-])+)/g)].map(r=>r[1]);if(n.length||a.length){const r=d=>d.replace(/\\(.)/g,"$1");return n.every(d=>t.classes.has(d)||t.classes.has(r(d)))&&a.every(d=>t.ids.has(r(d)))}const i=[...s.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(r=>r[2].toLowerCase());return i.length>0&&i.every(r=>t.tags.has(r))}function Br(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function Nr(e,t,s){const n=Br(e);if(!n.length)return"keep";const a=n.filter(r=>oo(r,t));return a.length?a.length===n.length&&!n.some(r=>oo(r,s))?"move":"copy":"keep"}function Do(e,t,s){const n=String(e||""),a=to(t),i=to(s),r=[],d=[];let p=0;for(const g of Fr(n)){const b=n.slice(g.from,g.to),c=b.match(/^\s*/)[0];if(p=g.to,Or.test(g.selector)){const y=Do(g.body,t,s);y.move.trim()&&r.push(`${g.selector} {
${y.move.trim()}
}`),y.keep.trim()&&d.push(`${c}${g.selector} {
${y.keep.trim()}
}`);continue}const k=g.selector.startsWith("@")?"keep":Nr(g.selector,a,i);if(k==="move"){r.push(g.text);continue}k==="copy"&&r.push(g.text),d.push(b)}return d.push(n.slice(p)),{move:r.join(`

`).trim(),keep:d.join("").replace(/\n{3,}/g,`

`).trim()}}const jr="/!/sve/component";function Vr(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let s=null;for(const n of t){if(!n.trim())continue;const a=n.match(/^[ \t]*/)[0].length;s=s===null?a:Math.min(s,a)}return s?t.map(n=>n.slice(s)).join(`
`):t.join(`
`)}function qr(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function Kr(e,t){if(!zn(e))return"";try{return await(await bn(()=>import("./tw-compile-AWaJHJyk.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(s){return console.error("[sve] component tailwind compile",s),""}}async function Gr(e,t){const s=await e.fetch(jr,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":Lt(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!s.ok){const n=new Error(String(s.status));throw n.status=s.status,n}return s.json()}function no(e,t){const{from:s,to:n}=Gn(e,t),a=e.slice(s,n);if(!a.trim())return null;const i=e.slice(0,s)+e.slice(n),r=T("dock:css"),d=Do(typeof r=="string"?r:"",a,i);return{html:Vr(a),css:d.move,keepCss:d.keep,lead:qr(a),from:s,to:n}}function zr(e,t,{onDone:s,onError:n}={}){if(T("dock:is-locked")===!0)return;const a=T("dock:html");if(typeof a!="string"||!t)return;const i=no(a,t);if(!i)return;const r=ye(e.document,kn,{heading:u(e,"component_new"),nameLabel:u(e,"component_name"),placeholder:u(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:u(e,"cancel"),saveLabel:u(e,"component_create"),onOk:d=>{r.dismiss(),(async()=>{try{const p=await Kr(e,i.html),g=T("dock:html"),b=typeof g=="string"&&g===a?i:no(g,t);if(!b)return;const c=await Gr(e,{name:d,html:b.html,css:b.css,js:"",tw:p}),k=T("dock:html"),y=k.slice(0,b.from)+b.lead+c.tag+k.slice(b.to);T("dock:set-html",y),b.css.trim()&&T("dock:set-css",b.keepCss),s?.(c)}catch(p){n?.(p)}})()}})}function Ur(e,t,s){const n=String(e||"");if(!t||t.kind!=="antlers")return n;const a=String(s||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?Zr(n,t,a):t.tag==="else"||!a?n:n.slice(0,t.from)+`{{ ${t.tag} ${a} }}`+n.slice(t.openTo)}function yt(e,t,s,n){return Pe(e,t,{kind:s,name:n})}function Pe(e,t,s={}){const n=String(e||"");if(!t||t.antlers!=="loop")return n;const a=t.loopKind==="collection"?"collection":"field",i=s.kind??a,r=String(s.name??t.expr??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(r))return n;const d=s.sortDir??t.sortDir??"",p=String(s.sortField??t.sortField??"").trim(),g=String(s.limit??t.limit??"").trim(),b=Oo(n,t);if(!b)return n;const c=i===a?t.params:"",k=i==="collection"?Xr(r,p,d,g,c):Yr(r,p,d,g,c),y=i==="collection"?"collection":r;return n.slice(0,t.from)+k+n.slice(t.openTo,b.from)+`{{ /${y} }}`+n.slice(b.to)}function Xr(e,t,s,n,a){const i=Wr(a).replace(/\bsort\s*=\s*["'][^"']*["']/g,"").replace(/\blimit\s*=\s*["']?\d+["']?/g,"").replace(/\s+/g," ").trim(),r=[`collection from="${e}"`];return s==="random"?r.push('sort="random"'):t&&r.push(`sort="${t}${s==="desc"?":desc":":asc"}"`),n&&r.push(`limit="${n}"`),i&&r.push(i),`{{ ${r.join(" ")} }}`}function Yr(e,t,s,n,a){const i=String(a||"").split("|").map(d=>d.trim()).filter(d=>d&&!/^from\s*=/.test(d)&&!/^sort\s*:/.test(d)&&!/^reverse$/.test(d)&&!/^shuffle$/.test(d)&&!/^limit\s*:/.test(d)),r=[e,...i];return s==="random"?r.push("shuffle"):t&&(r.push(`sort:${t}`),s==="desc"&&r.push("reverse")),n&&r.push(`limit:${n}`),`{{ ${r.join(" | ")} }}`}function Wr(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function Oo(e,t){const n=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return n?{from:t.from+n.index,to:t.from+n.index+n[0].length}:null}function Zr(e,t,s){return Pe(e,t,{name:s})}function Jr(e,t,s){const n=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return n;const a=Oo(n,t);if(!a)return n;const r=(n.slice(0,a.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],d=s==="else"?"{{ else }}":"{{ elseif true }}";return`${n.slice(0,a.from)}${d}
${r}${n.slice(a.from)}`}const z=Wn("sve-call-values"),Re=new Set;let so=null;const Qr="__sve-html-tree-style",K=new Set;let kt="",Te=!1,ct=null,we=!0,J="",Se=0,Fo="";const ie=new Map,xe=new Set;let q="",Bo=!1,D=null,Ke=null,ut="",Ge=0,bt=null,De=[],pe=null,Ee=null,ze=null,Ue=null,_t=null,ve=!1,fe=null,Oe=null,He=null,Xe=null,Ye=null,Tt=null,ue=null;function W(e){return e.getElementById(Ve)}function ei(e){Tn(e,Qr,`
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
    /* The page's frame: header, main and footer around the sections. The
       sections step in one level under main, as rows step in under a parent. */
    [data-sve-ht-frame-body] { margin-left: 12px; }
    [data-sve-ht-look="tags"] [data-sve-ht-frame-body] {
      margin: 2px 0 2px 7px;
      padding-left: 7px;
      box-shadow: inset 1px 0 0 color-mix(in srgb, var(--sve-fam-main) 22%, transparent);
    }
    /* Main names the space between, not a thing to edit: a shade quieter. */
    [data-sve-ht-row][data-sve-ht-frame="main"] [data-sve-ht-name] { opacity: .65; font-weight: 500; }
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
    /* A section dragged between sections: the line sits above or below the
       whole section — every row of an open one, the one row of a shut one. */
    [data-sve-ht-sec-uid] { position: relative; }
    [data-sve-ht-sec-uid][data-sve-ht-drop="before"]::before,
    [data-sve-ht-sec-uid][data-sve-ht-drop="after"]::after {
      content: '';
      position: absolute;
      left: 8px;
      right: 8px;
      height: 2px;
      background: #93c5fd;
      pointer-events: none;
      z-index: 2;
    }
    [data-sve-ht-sec-uid][data-sve-ht-drop="before"]::before { top: -2px; }
    [data-sve-ht-sec-uid][data-sve-ht-drop="after"]::after { bottom: -2px; }
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
    [data-sve-ht-video],
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
    /* Held: lit like a hovered icon, in the row's own text colour — not an accent. */
    [data-sve-ht-video][data-on] { opacity: 1; background: rgba(255,255,255,.14); }
    [data-sve-ht-video]:hover,
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
      ${Ut("light")}
      /* How much of a row's own colour its pick takes: a wash, not a fill.
         The row mixes it in below — a mix written up here would read
         --sve-ht-c on the list, where no family is set. */
      --sve-ht-pick-mix: 11%;
      --sve-ht-pick-hover-mix: 18%;
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${Ut("dark")}
      --sve-ht-pick-mix: 24%;
      --sve-ht-pick-hover-mix: 32%;
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
    [data-sve-ht-look="tags"] [data-sve-ht-cat="header"] { --sve-ht-c: var(--sve-fam-header); }
    [data-sve-ht-look="tags"] [data-sve-ht-cat="main"] { --sve-ht-c: var(--sve-fam-main); }
    [data-sve-ht-look="tags"] [data-sve-ht-cat="footer"] { --sve-ht-c: var(--sve-fam-footer); }

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
    /* The picked row: its own family colour as a wash and a bar at the
       edge, not a solid fill — the name, the chip and the mark have to
       stay readable on it. */
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-current] {
      background: color-mix(in srgb, var(--sve-ht-c) var(--sve-ht-pick-mix), transparent);
      color: inherit;
      box-shadow: inset 2px 0 0 var(--sve-ht-c);
    }
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-current]:hover {
      background: color-mix(in srgb, var(--sve-ht-c) var(--sve-ht-pick-hover-mix), transparent);
    }
    /* Focus: rows are reached with Tab, so a focused row that is not the
       picked one gets a thin ring in its own colour. The picked row already
       says where you are with its wash and bar — the ring on top of that
       looked like a second, blue selection after every click. */
    [data-sve-ht-look="tags"] [data-sve-ht-row]:focus-visible {
      outline: 1px solid color-mix(in srgb, var(--sve-ht-c) 55%, transparent);
      outline-offset: -1px;
    }
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-current]:focus-visible { outline: none; }
    /* A shut section is one row in the page's list; a little air between them. */
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-sec] { margin-bottom: 2px; }
    /* The open section's box, quieter: it says where you are, the bar says
       what you picked. In the section's own family colour — the wrapper
       carries the section row's family (HtmlTreeList.vue) so the box can
       read it; layout if it somehow does not. Enough padding that a picked
       row's wash — the section's own, or a child's — stops short of the
       border instead of sitting on it. */
    [data-sve-ht-look="tags"] [data-sve-ht-branch] {
      border: 1px solid color-mix(in srgb, var(--sve-ht-c, var(--sve-fam-layout)) 45%, transparent);
      border-radius: 7px;
      padding: 4px;
      margin: 0 0 6px;
      background: color-mix(in srgb, var(--sve-ht-c, var(--sve-fam-layout)) 4%, transparent);
    }
    /* A hair of air between the rows under a section, so the eye can tell
       them apart; a shut section already keeps its own distance (above). The
       guide reaches up across that gap so the line under a parent stays one
       line. */
    [data-sve-ht-look="tags"] [data-sve-ht-row] + [data-sve-ht-row] { margin-top: 2px; }

    /* One guide per level, drawn in the row's left margin: 14px per level
       with the line 7px in, so each sits under the twist of the row it
       descends from — in that row's family colour, well held back. Out of
       the flow, so the row's box and everything in it start at the level. */
    [data-sve-ht-look="tags"] [data-sve-ht-indent] {
      display: flex;
      position: absolute;
      top: -2px;
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
      opacity: .2;
    }
    /* The first row under an open parent: its innermost guide — the parent's
       own line — starts a little below the parent's box instead of on it, so
       a picked parent's wash and the line under it do not touch. The outer
       guides pass through unbroken; they belong to rows further up. */
    [data-sve-ht-look="tags"] [data-sve-ht-row]:has(> [data-sve-ht-twist]:not([data-sve-ht-shut])) + [data-sve-ht-row] [data-sve-ht-indent] i:last-child {
      margin-top: 5px;
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
    [data-sve-ht-look="tags"] [data-sve-ht-video]:hover,
    [data-sve-ht-look="tags"] [data-sve-ht-eye]:hover,
    [data-sve-ht-look="tags"] [data-sve-ht-fields]:hover,
    [data-sve-ht-look="tags"] [data-sve-ht-dup]:hover,
    [data-sve-ht-look="tags"] [data-sve-ht-del]:hover { background: rgba(128,128,128,.25); }

    /* ===== The layers look, on trial =======================================
       The tags look above with six things changed, so the two can be put
       side by side before one of them goes. The switch in the tree's top
       bar (HTML_TREE_LAYERS_KEY) puts data-sve-ht-layers on the list, and
       every rule here hangs off it: switched off, not one of them applies.
       1. No box around the open section; the picked row says where you are.
       2. No guide lines; the indent alone says what belongs to what.
       3. No bar at the picked row's edge.
       4. The picked row wears the neutral grey of a hovered one.
       5. Every row runs the full width of the list, and only what is in it
          steps in with its depth, so a hover or a pick is one band.
       6. The icons a size smaller.
       The frame body stepped the sections in with its own margin; here it
       hands that level on as --sve-ht-base instead, and a row adds it to its
       depth, so a section's rows still start one level in under main. */
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-branch] {
      border: 0;
      border-radius: 0;
      padding: 0;
      margin: 0;
      background: none;
    }
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-frame-body] {
      --sve-ht-base: 1;
      margin: 0;
      padding: 0;
      box-shadow: none;
    }
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-indent] { display: none; }
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-row] {
      margin-left: 0;
      padding-left: calc(0.25rem + (var(--sve-ht-depth, 0) + var(--sve-ht-base, 0)) * 0.875rem);
    }
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-row][data-sve-ht-current],
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-row][data-sve-ht-current]:hover {
      background: rgba(128,128,128,.14);
      box-shadow: none;
    }
    /* A drop line starts where the row's content starts, so a drag still
       shows the level it lands on now that the row itself spans them all. */
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-row][data-sve-ht-drop="before"]::before,
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-row][data-sve-ht-drop="after"]::after {
      left: calc(0.5rem + (var(--sve-ht-depth, 0) + var(--sve-ht-base, 0)) * 0.875rem);
    }
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-sec-uid][data-sve-ht-drop="before"]::before,
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-sec-uid][data-sve-ht-drop="after"]::after {
      left: calc(0.5rem + var(--sve-ht-base, 0) * 0.875rem);
    }
    /* The empty slots keep their place: a block's one level under it, and
       main's where the frame body's margin used to put it. */
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-slot][data-sve-ht-id] {
      margin-left: calc((var(--sve-ht-depth, 0) + var(--sve-ht-base, 0)) * 0.875rem);
    }
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-frame-slot] {
      margin-left: calc(var(--sve-ht-base, 0) * 0.875rem + 0.75rem);
    }
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-icon] svg { width: 0.75rem; height: 0.75rem; }
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-twist] svg { width: 0.5625rem; height: 0.5625rem; }
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-eye] svg,
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-fields] svg,
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-dup] svg,
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-del] svg { width: 0.625rem; height: 0.625rem; }
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-video] svg { width: 0.75rem; height: 0.75rem; }
  `)}function U(){const e=T("dock:html");return typeof e=="string"?e:""}function No(e){return!!T("dock:is-open",e)}function Ce(e,{save:t=!1}={}){return Ot()||T("dock:set-html",e)!==!0?!1:(t&&T("dock:save-now"),!0)}function ao(e){const t=T("dock:component-exit-state")||{};if(o.exitOpen=!!t.open,!t.open){o.onExit=null;return}o.exitName=t.name||"",o.exitLabel=u(e,"component_exit"),o.exitTitle=u(e,t.back?"component_exit_back":"component_exit_close"),o.onExit=()=>{T("dock:exit-component"),A(e)}}function jo(e,t){const s=An(e);if(!s||t.type!==s)return"";const n=Mn(t[s]);return n&&Rn(e,n)?.section_type||""}const ge=[];let ht=!1,xt=!1;function pt(e,t){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(t,{timeout:2e3});return}e.setTimeout(t,200)}function ti(e,t){for(const s of t){const n=s.type;!n||ie.has(n)||xe.has(n)||ge.includes(n)||ge.push(n)}Pt.htmlTreePrefetchArmed&&Dt(e)}function Ui(e){Pt.htmlTreePrefetchArmed=!0,Dt(e)}function Dt(e){if(ht||!ge.length)return;ht=!0;const t=()=>{const s=ge.shift();if(!s){ht=!1;return}if(ie.has(s)||xe.has(s)){pt(e,t);return}xe.add(s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(s)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{typeof n?.html=="string"&&(ie.set(s,n.html),xt&&(xt=!1,A(e)))}).catch(()=>{}).finally(()=>{xe.delete(s),pt(e,t)})};pt(e,t)}function Ot(){return!!q}function oi(e){const t=new Map,s=Qe(e);if(!s)return t;for(const n of s.querySelectorAll("[data-sid]")){const a=n.getAttribute("data-sid");a&&!t.has(a)&&t.set(a,n.tagName.toLowerCase())}return t}function ni(e,t){const s=Be(e)||"page_sections";for(const n of et(t)||[]){const a=tt(n.values),i=a&&typeof a=="object"?a[s]:null;if(Array.isArray(i))return!0}return!1}function st(e,t){const s=Be(e)||"page_sections",n=oi(e),a=[];for(const i of et(t)||[]){const r=tt(i.values),d=r&&typeof r=="object"?r[s]:null;if(Array.isArray(d)){d.forEach(p=>{if(!p||typeof p!="object"||Array.isArray(p)||typeof p.type!="string")return;const g=[p._visual_id,p.id,p._id].filter(x=>typeof x=="string"&&x!=="");if(!g.length)return;const b=jo(e,p)||p.type,c=typeof p._sve_label=="string"?p._sve_label.trim():"",k=g.map(x=>n.get(x)).find(Boolean)||"section",y=Ro(p.type)[`0:${k}`];a.push({uid:g[0],ids:g,type:p.type,tag:k,label:c||(typeof y=="string"&&y.trim()?y.trim():"")||ot(e,b)?.display||Ie(b)||b,svg:xo(k,"",null).svg||Ae.section,cat:ko(k),enabled:p.enabled!==!1,static:Ms(e,b)})});break}}return a}function si(e,t,s){if(!s.length)return"";const n=T("dock:current-type")||"",a=T("dock:current-uid"),i=!!T("dock:component-exit-state")?.open;if(a){const r=Et(a,t),d=s.find(p=>p.ids.some(g=>r.includes(g)));if(d&&(i||d.type===n))return d.uid}return s.find(r=>r.type===n)?.uid||""}function ai(e,t,s,n){const a=t.find(x=>x.uid===s),i=T("dock:component-src"),r=T("dock:type-stack")||[];if(!a||!i||!r.length)return null;const d=r.map(x=>x.type).filter(x=>!ie.get(x));if(d.length)return ri(e,d),null;const p=[],g=new Set,b=new Set;let c=x=>p.push(...x),k=null,y=0;for(let x=0;x<r.length;x+=1){const _=x+1<r.length?r[x+1].src:i,m=O=>({...O,id:`ctx${x}:${O.id}`,path:`ctx${x}/${O.path}`,ctxLevel:x,children:O.children.map(m)}),$=nt(ie.get(r[x].type)).map(m),F=[],H=(O,G)=>{for(const j of O){if(j.kind==="component"&&j.src===_)return F.push(...G,j),j;const B=H(j.children,[...G,j]);if(B)return B}return null};if(k=_?H($,[]):null,!k)return null;const M=new Set(F.map(O=>O.id)),I=(O,G)=>{for(const j of O)j.children.length&&(M.has(j.id)?K.has(j.path):qo(j,G))&&g.add(j.id),I(j.children,G+1)};I($,y),c($),b.add(k.id),y+=F.length,c=(O=>G=>{O.children=G})(k)}for(const x of Ko(n))g.add(x);return K.has(k.path)&&g.add(k.id),k.children=n,{tree:p,folds:g,hostId:k.id,hostIds:b,levels:r.length,rootId:p.find(x=>!x.kind)?.id||"",label:a.label,svg:a.svg,cat:a.cat}}function ri(e,t){for(const s of t)!ge.includes(s)&&!xe.has(s)&&ge.push(s);xt=!0,Dt(e)}function ii(e,t,s){const n=T("dock:component-exit-state");if(n?.open)return Ie(n.name)||n.name||"";if(s)return t.find(i=>i.uid===s)?.label||"";const a=T("dock:current-type")||"";return ot(e,a)?.display||Ie(a)||""}function at(e,t,s,n,a){const i=s.find(d=>d.uid===n);if(!i||n===a)return;K.clear(),D=null,we=!1,oe(),Ne(),J=n,Fo=U(),q=ie.get(i.type)||"",q&&(D=We(nt(q))||null),Bo=(T("dock:current-type")||"")===i.type,e.clearTimeout(Se),Se=e.setTimeout(()=>{J="",Te=!1,A(e)},4e3),A(e);const r=()=>Fn(i.uid,t,e,{clampToSection:!0});In(i.uid,t,e,r),le({source:ee,type:Q.SVE_ACTIVATE,ids:i.ids},e),e.setTimeout(()=>A(e),0)}function Vo(e,t){if(!t)return!1;for(const s of e||[])if(s.id===t||Vo(s.children,t))return!0;return!1}function We(e){for(const t of e||[]){if(!t.kind)return t.id;const s=We(t.children);if(s)return s}return""}function qo(e,t){return K.has(e.path)?t===0:t>0}function Ko(e){const t=new Set,s=(n,a)=>{for(const i of n)i.children.length&&qo(i,a)&&t.add(i.id),s(i.children,a+1)};return s(e,0),t}function A(e){const t=e.document,n=W(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;ei(t),Xn(e);const a=U();q&&q===a&&(q=""),T("dock:chrome-kind")&&(q="");const i=q||a,r=nt(i);De=r;const d=T("dock:current-type")||"",p=Ro(d),g=ni(e,t),c=!!(T("dock:component-exit-state")||{}).open,k=st(e,t);d&&a&&!q&&ie.set(d,a),ti(e,k);const y=si(e,t,k),x=String(T("dock:chrome-kind")||"");if($n(e),g&&!k.length&&!x){De=[],o.rows=[],o.sections=[],o.frame=io(e,[],!1,!1,"",!0),o.frameEmptyText=u(e,"html_tree_frame_no_sections"),o.pageBuilder=!0,o.emptyText=u(e,"html_tree_empty"),o.canEdit=!T("dock:is-locked"),o.look=Xt(e),o.onRefresh=()=>A(e),o.onSection=null,ro(e,""),ao(e),je(n,eo),uo(e,[]);return}o.pageBuilder=g;const _=`${d}|${y}`;let m=!1;_!==kt&&(kt=_,K.clear(),ct!==null&&i!==ct?m=!0:Te=i),(m||Te!==!1&&i!==Te)&&(Te=!1,K.clear(),D=We(r)||null),ct=i,J&&(J===y||!k.length)&&(Bo||i!==Fo)&&(e.clearTimeout(Se),J="",Te=!1,Vo(r,D)||(K.clear(),D=We(r)||null));const $=k.some(h=>h.uid===J)?J:"",F=we?"":$||y,H=c?ai(e,k,F,r):null,M=!!($||y),I=M||c?"":String(T("dock:chrome-kind")||"");I!=="main"&&(ut="");const O=I==="main"?lo(r,"main"):null;O&&wt(O.path);const G=I==="header"||I==="footer"?Ft(r,h=>i.slice(h.from,h.openTo).includes(`data-sve-chrome="${I}"`))||lo(r,I):null;G&&wt(G.path);const B=(I==="main"?!!O:I==="header"||I==="footer"?!!G:!0)?H?Yt(H.tree,o.query?new Set:H.folds):Yt(r,o.query?new Set:Ko(r)):[];!i.trim()&&!No(t)?o.emptyText=u(e,"html_tree_need_dock"):o.emptyText=u(e,"html_tree_empty"),o.slotText=u(e,"antlers_drop_here"),o.dataTitle=u(e,"data_vars_title"),o.pageTitle=u(e,"component_props_page"),o.renameTitle=u(e,"html_tree_rename"),o.tagTitle=u(e,"tw_tag"),o.hideTitle=u(e,"html_tree_hide"),o.showTitle=u(e,"html_tree_show"),o.duplicateTitle=u(e,"html_tree_duplicate"),o.deleteTitle=u(e,"html_tree_delete"),o.videoHoldTitle=u(e,"html_tree_video_hold"),o.videoPlayTitle=u(e,"html_tree_video_play"),o.lockedTitle=u(e,"html_tree_locked"),o.searchEmpty=u(e,"html_tree_search_empty"),o.canEdit=!T("dock:is-locked"),o.look=Xt(e),o.onQuery=()=>A(e),ao(e),o.inComponent=c,o.onContextRow=h=>{if(!H||h===H.hostId)return;const w=B.find(E=>E.id===h)?.ctxLevel??H.levels-1;T("dock:exit-component",H.levels-w),A(e)},o.onSelect=h=>{const w=B.find(E=>E.id===h);w&&To(e,w.path)||Je(e,h,B)},o.onTwist=h=>{const w=B.find(E=>E.id===h)?.path;w&&(K.has(w)?K.delete(w):K.add(w),A(e))},o.onTagChange=(h,w)=>{const E=o.rows.find(te=>te.id===w);E&&!Ot()&&Yn(e,h.currentTarget,E)},o.onRename=h=>ui(e,h),o.onRenameCommit=()=>ho(e,!0),o.onRenameCancel=()=>ho(e,!1),o.onHide=h=>fi(e,h),o.onVideoHold=h=>pi(e,h),o.onDuplicate=h=>mi(e,h),o.onDelete=h=>gi(e,h),o.onPointerDown=(h,w)=>xi(e,h,w),o.onSectionPointerDown=(h,w)=>Ci(e,h,w),o.onContext=(h,w)=>_i(e,h,w),o.onInspectCommit=h=>Ai(e,h),o.onPropValue=(h,w,E)=>mo(e,h,w,E),o.onPropPage=(h,w)=>Ar(e,h,E=>mo(e,w,E,!1)),o.onLoopKind=h=>Mi(e,h),o.onAddBranch=h=>Ri(e,h),o.onLoopSortField=h=>{const w=Ze(),E=String(h||"").trim();if(!w)return;const te=ue?.id===w.id?ue.dir:"",ae=w.sortDir||te||"asc";ue=null,me(e,(be,en)=>Pe(be,en,{sortField:E,sortDir:ae}))},o.onLoopSortDir=h=>{const w=Ze(),E=String(h||"");if(w){if((E==="asc"||E==="desc")&&!w.sortField){ue={id:w.id,dir:E},Ct(e,w);return}ue=null,me(e,(te,ae)=>Pe(te,ae,{sortDir:E,sortField:E==="asc"||E==="desc"?ae.sortField:""}))}},o.onLoopLimit=h=>me(e,(w,E)=>Pe(w,E,{limit:String(h||"").replace(/\D/g,"")})),o.onPropHost=h=>h?z.mount(h):z.unmount(),o.onInspectData=(h,w)=>{T("dock:data-menu",{anchor:h,at:B.find(E=>E.id===D)?.from,onPick:E=>w(String(E?.var||"").trim())})};const jt=B.find(h=>!h.kind)?.id,Vt=c?"":ii(e,k,F),de=F&&!c?k.find(h=>h.uid===F):null,Jo=yo(e,String(T("dock:current-type")||""));let Qo=0;const ne=I==="header"||I==="footer"?I:"",ke=G?G.id:"",ce=O&&B.find(h=>h.id===O.id)||null,se=ce||ke&&B.find(h=>h.id===ke)||null,qt=se?li(B,se):-1;se&&!B.slice(B.indexOf(se),qt).some(h=>h.id===D)&&(D=se.id),o.rows=B.map(h=>{const w=xo(h.tag,h.kind,h.antlers),E=h.tag==="video"&&!h.kind?Qo++:-1,te=!!H&&h.id===H.rootId,ae=h.id===jt&&Vt?Vt:te?H.label:h.klass,be=h.id===jt;return{...h,base:ae,name:ne&&h.id===ke?u(e,`html_tree_frame_${ne}`):h===ce?u(e,"html_tree_frame_main"):be&&de?ae:Rr(ae,h.path,p),current:h.id===D,letter:te?"":w.letter||"",svg:ne&&h.id===ke?Ae[ne]:h===ce?Ae.main:be&&de?de.svg:te?H.svg:w.svg||"",frame:ne&&h.id===ke?ne:h===ce?"main":"",cat:ne&&h.id===ke?ne:h===ce?"main":te?H.cat:ko(h.tag,h.kind,h.antlers),context:H?H.hostIds.has(h.id)?"host":h.id.startsWith("ctx")?"dim":"":"",sectionRoot:be&&de?de.uid:"",fieldsIcon:!!(be&&de&&!de.static),videoNth:E,videoHeld:E>=0&&Jo.has(E)}}),Ln(e);const rt=[];for(const h of o.rows)rt.length=h.depth,h.guides=rt.slice(),rt[h.depth]=h.cat;if(se){const h=B.indexOf(se),w=se.depth;o.rows=o.rows.slice(h,qt).map(E=>({...E,depth:E.depth-w,guides:E.guides.slice(w)})),ce&&ut!==_&&(ut=_,e.setTimeout(()=>Je(e,ce.id,B),0))}o.sections=M||I?k.map(h=>{const w=!!F&&h.uid===F;return{...h,current:w,ready:w&&(!$||!!q),row:{id:`sec:${h.uid}`,section:h.uid,tag:h.tag,name:h.label,kind:"",svg:h.svg,cat:h.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:w,hidden:!h.enabled}}}):[],o.frame=io(e,k,M,c,I),o.frameEmptyText=u(e,"html_tree_frame_no_sections"),ro(e,I),o.onSection=h=>{ve||(St(e),at(e,t,k,h,F))},o.onRefresh=()=>A(e),Ct(e,o.rows.find(h=>h.id===D)),je(n,eo),uo(e,r)}function ro(e,t){o.frameOpenTitle=u(e,"html_tree_frame_open"),o.frameMainTitle=u(e,"html_tree_frame_main_open"),o.frameTemplateTitle=u(e,"html_tree_frame_template_open"),o.frameFieldsTitle=u(e,"html_tree_frame_fields"),o.onFrame=s=>{t===s?di(e,s):co(e,s)},o.onFrameEnter=s=>co(e,s),o.onFrameFields=s=>Vn(e,Pn(e,s),u(e,`html_tree_frame_${s}`)),o.onFrameTwist=()=>{o.mainShut=!o.mainShut}}function io(e,t,s,n,a,i=!1){if(!s&&!a&&!i)return null;const r=g=>({id:`frame:${g}`,frame:g,synthetic:!0,tag:g,name:u(e,`html_tree_frame_${g}`),kind:"",svg:Ae[g]||"",cat:g,letter:"",depth:0,hasChildren:g==="main"&&(t.length>0||a==="template"),shut:g!=="main",current:!1,hidden:!1}),d={kind:a,header:r("header"),main:r("main"),footer:r("footer"),template:null},p=a&&a!=="template"?String(T("dock:collection-view")||""):"";return p&&(d.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:ot(e,p)?.display||Ie(p.replace(/^view:/,"")),kind:"",svg:Ae.section,cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),d}function lo(e,t){return Ft(e,s=>s.tag===t)}function Ft(e,t){for(const s of e||[]){if(!s.kind&&t(s))return s;const n=Ft(s.children,t);if(n)return n}return null}function li(e,t){let s=e.indexOf(t)+1;for(;s<e.length&&e[s].depth>t.depth;)s+=1;return s}function di(e,t){const s=Qe(e);(t==="main"||t==="template"?s?.querySelector("main"):s?.querySelector(`[data-sve-chrome="${t}"]`))?.scrollIntoView({behavior:"smooth",block:"start"})}function St(e){const t=String(T("dock:chrome-open",e.document)||"");return t!=="header"&&t!=="footer"?!1:(Hn(e),le({source:ee,type:Q.SVE_FORCE_EXIT_CHROME},e),!0)}function ci(e){e.clearTimeout(Se),J="",q="",K.clear(),D=null,we=!1,oe(),Ne()}function co(e,t){if(e.document,String(T("dock:chrome-kind")||"")===t)return;if(ci(e),t==="main"){St(e),T("dock:open-file",qn);return}if(t==="template"){const i=String(T("dock:collection-view")||"");i&&(St(e),T("dock:open-file",i));return}if(t!=="header"&&t!=="footer")return;const s=Qe(e)?.querySelector(`[data-sve-chrome="${t}"]`);s?(s.scrollIntoView({block:"nearest"}),s.dispatchEvent(new s.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:ee,type:Q.OPEN_CHROME,kind:t},e.location.origin);const n=Date.now(),a=async()=>{if(String(T("dock:chrome-kind")||"")!==t){Date.now()-n<3e4&&e.setTimeout(a,250);return}await(T("dock:load-settled")||null),Zo(e)};e.setTimeout(a,250)}function uo(e,t){W(e.document)&&Go(e,t)}function Go(e,t){const s=t[0],n=!!T("dock:component-src"),a=n?"":T("dock:current-uid")||"";le({source:ee,type:Q.SVE_HTML_PICK,on:!0,uid:a,uids:a?Et(a,e.document):[],all:n,tag:s?.tag||"",klass:s?.klass||"",nodes:cs(t)},e)}function wt(e){if(!e)return;const t=(s,n)=>{for(const a of s||[]){if(a.path===e)return!0;if(t(a.children,n+1))return n===0?K.delete(a.path):K.add(a.path),!0}return!1};t(De,0)}function ui(e,t){if(ve)return;const s=o.rows.find(n=>n.id===t);!s||s.kind||(D=t,o.rows.forEach(n=>{n.current=n.id===t}),o.editingId=t,o.draft=s.name,e.setTimeout(()=>{const n=W(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function ho(e,t){const s=o.editingId;if(!s)return;const n=o.rows.find(a=>a.id===s);o.editingId=null,t&&n&&(n.sectionRoot?hi(e,n.sectionRoot,o.draft):Dr(T("dock:current-type")||"",n.path,o.draft,n.base||n.klass)),o.draft="",A(e)}function hi(e,t,s){const n=Be(e)||"page_sections",a=String(s||"").replace(/\s+/g," ").trim();for(const i of et(e.document)||[]){const r=tt(i.values),d=r&&typeof r=="object"?r[n]:null;if(!Array.isArray(d))continue;const p=d.findIndex(k=>k&&typeof k=="object"&&[k._visual_id,k.id,k._id].includes(t));if(p===-1)continue;const g=jo(e,d[p])||d[p].type,b=ot(e,g)?.display||Ie(g)||g,c=JSON.parse(JSON.stringify(d));return c[p]={...c[p]},!a||a===b?delete c[p]._sve_label:c[p]._sve_label=a,i.setFieldValue(n,c),!0}return!1}function pi(e,t){const s=o.rows.find(d=>d.id===t);if(!s||!(s.videoNth>=0))return;const n=String(T("dock:current-type")||""),a=yo(e,n),i=!a.has(s.videoNth);i?a.add(s.videoNth):a.delete(s.videoNth);const r=String(T("dock:current-uid")||"");En(e,n,a),le({source:ee,type:Q.SVE_VIDEO_HOLD,uid:r,uids:r?Et(r,e.document):[],nth:s.videoNth,on:i},e),A(e)}function fi(e,t){Bt(e,t,is)}function mi(e,t){const s=o.rows.find(n=>n.id===t)?.sectionRoot;if(s){e.postMessage({source:ee,type:Q.DUPLICATE_ROW,uid:s},e.location.origin);return}Bt(e,t,ls)}function zo(e,t){Dn(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const s=e.document;Bn({uid:t},s,e)})}function vi(e,t,s){J===s&&(e.clearTimeout(Se),J="",q=""),D=null,we=!1,kt="";const n=st(e,t),a=n.find(i=>i.uid!==s)||n[0];a?at(e,t,n,a.uid,""):(q="",o.rows=[],o.sections=[],o.frame=null,o.pageBuilder=!0,A(e)),e.setTimeout(()=>{W(e.document)&&A(e)},0)}bo("row:removed",({uid:e,parentPath:t,doc:s,win:n})=>{t!==Be(n)||!W(n.document)||vi(n,s,e)});function gi(e,t){const s=o.sections?.find(a=>a.row?.id===t),n=s?s.row?.section||s.uid:o.rows.find(a=>a.id===t)?.sectionRoot;if(n){zo(e,n);return}Bt(e,t,ds)}function Bt(e,t,s){if(T("dock:is-locked"))return;const n=U(),a=o.rows.find(r=>r.id===t);if(!a)return;const i=s(n,a);i!==n&&Ce(i)}function oe(){fe?.dismiss(),fe=null}const yi='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',ki='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>';function Uo(e,t){const s=o.sections?.find(p=>p.uid===t),n=s?.type||"";if(!n||!Lo(e))return[];const a=s.label||n,i=Rs(e,n),r=()=>e.Statamic?.$toast?.error(u(e,"section_update_failed")),d=[{label:u(e,"static_section_insertable"),icon:i?ki:yi,onPick:()=>{oe(),Zt(e,{handle:n,hidden:!i}).then(()=>{e.Statamic?.$toast?.success(u(e,i?"section_shown_to_editors":"section_hidden_from_editors",{name:a})),vt(e)}).catch(r)}}];return s.static&&d.push({label:u(e,"section_add_fields"),onPick:()=>{oe(),Zt(e,{handle:n,fields:!0}).then(()=>{e.Statamic?.$toast?.success(u(e,"section_fields_added",{name:a})),vt(e),A(e),_o(e,n)}).catch(r)}}),d}function bi(e,t,s){const n=s.row?.section||s.uid;n&&(fe=ye(e.document,It,{items:[...Uo(e,n),{label:u(e,"html_tree_remove_section"),danger:!0,onPick:()=>{oe(),zo(e,n)}}],x:t.clientX,y:t.clientY,onClose:()=>{fe=null}}))}function _i(e,t,s){oe();const n=o.sections?.find(d=>d.row?.id===s);if(n){bi(e,t,n);return}const a=o.rows.find(d=>d.id===s);if(!a)return;Je(e,s,o.rows);const i={x:t.clientX,y:t.clientY},r=d=>{d.length&&(fe?.dismiss(),fe=ye(e.document,It,{items:d,x:i.x,y:i.y,onClose:()=>{fe=null}}))};if(a.kind==="component"){Ti(e,a,r);return}a.kind!=="slot"&&o.canEdit&&r([...a.sectionRoot?Uo(e,a.sectionRoot):[],{label:u(e,"component_make"),onPick:()=>{oe(),zr(e,a,{onDone:()=>A(e),onError:d=>{e.alert(d?.status===409?u(e,"component_exists"):u(e,"component_failed"))}})}}])}const po=(e,t)=>{oe(),T("dock:open-template",t)};function Ti(e,t,s){if(!Jn(t.src)){s([{label:u(e,"component_open_named",{name:t.name||t.src}),onPick:()=>po(e,`view:partials/${t.src}`)}]);return}s([{label:u(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const a=Array.isArray(n.items)?n.items:[];s(a.length?a.map(i=>({label:u(e,"component_open_named",{name:i.label}),onPick:()=>po(e,i.type)})):[{label:u(e,"component_none"),onPick:null}])}).catch(()=>s([{label:u(e,"component_none"),onPick:null}]))}function xi(e,t,s){if(t.button!==0||T("dock:is-locked")||o.editingId||t.target?.closest?.("button, input"))return;Ne(),pe=s,Ee={x:t.clientX,y:t.clientY},ze=t.currentTarget,Ue=t.pointerId;const n=i=>Si(e,i),a=i=>wi(e,i);_t=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),_t=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function Si(e,t){if(!pe||!Ee)return;const s=t.clientX-Ee.x,n=t.clientY-Ee.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{ze?.setPointerCapture?.(Ue)}catch{}}t.preventDefault();const a=e.document.elementFromPoint(t.clientX,t.clientY),i=a?.closest?.("[data-sve-ht-slot]");if(i){const c=i.getAttribute("data-sve-ht-id");if(c&&c!==pe){o.dropId=c,o.dropPlace="inside";return}}const r=a?.closest?.("[data-sve-ht-row]"),d=r?.getAttribute("data-sve-ht-id");if(!d||d===pe){o.dropId=null,o.dropPlace=null;return}const p=o.rows.find(c=>c.id===d),g=o.rows.find(c=>c.id===pe);if(!p||p.context||g&&p.path.startsWith(`${g.path}/`)){o.dropId=null,o.dropPlace=null;return}const b=r.getBoundingClientRect();o.dropId=d,o.dropPlace=as(t.clientY-b.top,b.height,!wo(p.tag)&&!So(p))}function wi(e,t){const s=pe,n=o.dropId,a=o.dropPlace||"after",i=o.dragging;if(Ne(),i&&(ve=!0,e.setTimeout(()=>{ve=!1},0)),!i||T("dock:is-locked")||!s||!n||s===n)return;t?.preventDefault?.();const r=U(),d=rs(r,De,s,n,a);d!==r&&Ce(d)}function Ne(){try{ze?.releasePointerCapture?.(Ue)}catch{}_t?.(),pe=null,Ee=null,ze=null,Ue=null,o.dragging=!1,o.dropId=null,o.dropPlace=null}function Ci(e,t,s){if(t.button!==0||!s||o.editingId||t.target?.closest?.("button, input"))return;Xo(),Oe=s,He={x:t.clientX,y:t.clientY},Xe=t.currentTarget,Ye=t.pointerId;const n=i=>$i(e,i),a=i=>Li(e,i);Tt=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),Tt=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function $i(e,t){if(!Oe||!He)return;const s=t.clientX-He.x,n=t.clientY-He.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{Xe?.setPointerCapture?.(Ye)}catch{}}t.preventDefault();const i=e.document.elementFromPoint(t.clientX,t.clientY)?.closest?.("[data-sve-ht-sec-uid]"),r=i?.getAttribute("data-sve-ht-sec-uid")||"";if(!r||r===Oe){o.sectionDrop=null;return}const d=i.getBoundingClientRect();o.sectionDrop={uid:r,place:t.clientY-d.top<d.height/2?"before":"after"}}function Li(e,t){const s=Oe,n=o.sectionDrop,a=o.dragging;Xo(),a&&(ve=!0,e.setTimeout(()=>{ve=!1},0)),!(!a||!s||!n?.uid||n.uid===s)&&(t?.preventDefault?.(),Pi(e,s,n.uid,n.place))}function Xo(){try{Xe?.releasePointerCapture?.(Ye)}catch{}Tt?.(),Oe=null,He=null,Xe=null,Ye=null,o.dragging=!1,o.sectionDrop=null}function Pi(e,t,s,n){const a=Be(e)||"page_sections";for(const i of et(e.document)||[]){const r=tt(i.values),d=r&&typeof r=="object"?r[a]:null;if(!Array.isArray(d))continue;const p=k=>d.findIndex(y=>y&&typeof y=="object"&&[y._visual_id,y.id,y._id].includes(k)),g=p(t),b=p(s);if(g===-1||b===-1||g===b)return!1;let c=n==="before"?b:b+1;return g<c&&(c-=1),c===g?!1:(e.postMessage({source:ee,type:Q.MOVE,uid:t,toIndex:c},e.location.origin),e.setTimeout(()=>A(e),60),!0)}return!1}function Yo(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function Ct(e,t){if(t?.kind==="component"){Ei(e,t);return}if(Y.callOpen&&(Y.callOpen=!1,Y.callStore=null,z.forget(),At(e)),t?.kind!=="antlers"){o.inspect=null;return}const s=t.id;if(t.tag==="else"){o.inspect={key:s,title:u(e,"antlers_condition"),mode:"note",note:u(e,"antlers_else_note")};return}if(t.antlers==="loop"){const n=t.loopKind==="collection",a=ue?.id===t.id?ue.dir:"",i=t.sortDir||a;o.inspect={key:s,title:u(e,"antlers_loop"),mode:"loop",loopKind:n?"collection":"field",kinds:[{id:"field",label:u(e,"antlers_loop_field")},{id:"collection",label:u(e,"antlers_loop_collection")}],collections:Yo(e),value:t.expr||"",placeholder:u(e,n?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:u(e,"antlers_sort"),dir:i,needsField:i==="asc"||i==="desc",field:t.sortField||"",pickable:!n,placeholder:u(e,n?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:u(e,"antlers_sort_none")},{id:"asc",label:u(e,"antlers_sort_asc")},{id:"desc",label:u(e,"antlers_sort_desc")},{id:"random",label:u(e,"antlers_sort_random")}]},limit:{title:u(e,"antlers_limit"),value:t.limit||"",placeholder:u(e,"antlers_limit_placeholder")},branches:[]};return}o.inspect={key:s,title:u(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:u(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:u(e,"antlers_add_elseif")},{id:"else",label:u(e,"antlers_add_else")}]}}function Ei(e,t){if(!Qn(e)){o.inspect=null;return}if(!t.src)return;const s=t.id;if(o.inspect={key:s,title:u(e,"component_props_values"),mode:"note",note:u(e,"code_dock_loading")},es()){const n={},a={},i=new Map;for(const[r,d]of ts(U().slice(t.from,t.to))){const p=os(r);p&&(r!==p||!i.has(p))&&i.set(p,d)}for(const[r,d]of i)d.bound?a[r]=d.value:n[r]=d.value;so!==s&&(so=s,Re.clear());for(const r of Re)r in a||(a[r]="");o.inspect=null,Y.callOpen=!0,Y.title=Y.title||u(e,"component_props"),Y.callTitle=t.klass||t.name||t.src,Y.callStore=z.ui,z.ui.canBind=!0,z.ui.dataTitle=u(e,"data_vars_title"),z.ui.exprPlaceholder=u(e,"component_props_expr"),z.ui.onToggleBind=(r,d)=>Ii(e,r,d),z.ui.onExpr=(r,d)=>fo(e,r,d),z.ui.onPickData=(r,d)=>T("dock:data-menu",{anchor:d,at:t.from,onPick:p=>fo(e,r,String(p?.var||"").trim())}),z.load(e,{key:`${t.src}::${s}`,src:t.src,params:n,bindings:a,readOnly:T("dock:is-locked")===!0}),z.watch(e,{src:t.src,write:r=>Hi(e,r,a)}),At(e);return}ns(e,t.src).then(n=>{if(o.inspect?.key===s){if(!n.length){o.inspect={key:s,title:u(e,"component_props_values"),mode:"note",note:u(e,"component_props_values_none")};return}o.inspect={key:s,title:u(e,"component_props_values"),mode:"props",inheritLabel:u(e,"component_props_inherit"),rows:ss(n,U().slice(t.from,t.to))}}})}function Hi(e,t,s={}){const n=o.rows.find(r=>r.id===D);if(n?.kind!=="component"||T("dock:is-locked"))return;let a=U(),i=n.to;for(const[r,d]of Object.entries(t||{})){if(r in s)continue;const p=a.length,g=Mt(a,{from:n.from,to:i},r,d);g!==a&&(i+=g.length-p,a=g)}a!==U()&&(Ce(a,{save:!0}),A(e))}function Ii(e,t,s){s?Re.add(t):Re.delete(t),Wo(e,t,"",s),A(e)}function fo(e,t,s){Re.add(t),Wo(e,t,s,!0),A(e)}function Wo(e,t,s,n){const a=o.rows.find(d=>d.id===D);if(a?.kind!=="component"||T("dock:is-locked"))return;const i=U(),r=Mt(i,a,t,s,{bound:n});r!==i&&Ce(r,{save:!0})}function Ze(){const e=o.rows.find(t=>t.id===D);return e?.kind==="antlers"&&!T("dock:is-locked")?e:null}function me(e,t){const s=Ze();if(!s)return;const n=U(),a=t(n,s);a!==n&&(Ce(a),A(e))}function mo(e,t,s,n){const a=o.rows.find(d=>d.id===D);if(a?.kind!=="component"||T("dock:is-locked"))return;const i=U(),r=Mt(i,a,t,s,{bound:n});r!==i&&(Ce(r,{save:!0}),A(e))}function Ai(e,t){me(e,(s,n)=>n.antlers==="loop"?yt(s,n,n.loopKind==="collection"?"collection":"field",t):Ur(s,n,t))}function Mi(e,t){const s=Ze();if(!s||s.antlers!=="loop")return;const n=s.loopKind==="collection"?"collection":"field";if(t!==n){if(t==="collection"){const a=Yo(e)[0]?.handle;if(!a)return;me(e,(i,r)=>yt(i,r,"collection",a));return}me(e,(a,i)=>yt(a,i,"field",i.handle||"items"))}}function Ri(e,t){me(e,(s,n)=>Jr(s,n,t))}function Di(e,t){if(!e||!t||So(t)||wo(t.tag))return null;const s=Zn(e,t);if(s<t.openTo)return null;const n=e.lastIndexOf(`
`,s-1)+1;return e.slice(n,s).trim()===""&&n>t.openTo?n-1:s}function Je(e,t,s){if(ve)return;const n=(s||o.rows).find(a=>a.id===t);n&&(D=t,o.rows.forEach(a=>{a.current=a.id===t}),Ct(e,n),!Ot()&&(T("dock:reveal-html",{from:n.from,to:n.to,caret:Di(U(),n)}),T("dock:tw-follow"),le({source:ee,type:Q.SVE_HTML_PICK_FOCUS,path:n.path},e)))}function Oi(e,t){if(!t)return"";const s=[],n=(a,i)=>{for(const r of a||[]){const d=i||r.path===e;r.kind==="component"&&r.src===t&&s.push({path:r.path,inside:d}),n(r.children,d)}};return n(De,!1),(s.find(a=>a.inside)||s[0])?.path||""}function Fi(e,t){if(!t||!W(e.document))return;we=!1,wt(t),A(e);const s=o.rows.find(n=>n.path===t);s&&(Je(e,s.id,o.rows),e.setTimeout(()=>{W(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function $t(e){if(Ke)return;const t=()=>{o.editingId||o.dragging||(e.clearTimeout(Ge),Ge=e.setTimeout(()=>{W(e.document)&&A(e)},80))},s=()=>{if(t(),T("dock:on-empty-page")===!0){const n=st(e,e.document);n[0]&&at(e,e.document,n,n[0].uid,"")}};Ke=bo("dock:html-changed",t),e.document.addEventListener("sve-page-structure",s),bt=()=>{e.document.removeEventListener("sve-page-structure",s)}}function Bi(e){Ke?.(),Ke=null,bt?.(),bt=null,e?.clearTimeout?.(Ge),Ge=0}function Nt(e){const t=W(e.document);if(le({source:ee,type:Q.SVE_HTML_PICK,on:!1},e),Bi(e),z.forget(),Y.callOpen=!1,Y.callStore=null,At(e),Ne(),oe(),Un(e),D=null,o.inspect=null,o.editingId=null,o.draft="",o.sections=[],o.pageBuilder=!1,J="",e?.clearTimeout?.(Se),!t){mt(e);return}t.remove(),Pt.headerTab==="html_tree"&&On(e,null),_n(e),vo(e),go(e),mt(e)}function Xi(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=Ve,je(t,Eo,{title:u(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>Nt(e)))}function Yi(e){$t(e),A(e)}function Zo(e){const t=e.document;if(!xn(e,"html_tree"))return;if(W(t)){$t(e),A(e);return}if(!No(t))return;we=!0,K.clear(),Sn(e,[Ve]);const s=t.createElement("div");s.id=Ve,s.style.cssText=wn,je(s,Eo,{title:u(e,"html_tree")}),s.querySelector("[data-sve-close]")?.addEventListener("click",()=>Nt(e)),Cn(e,s),vo(e),go(e),mt(e),$t(e),A(e)}function Wi(e){if(W(e.document)){Nt(e);return}Zo(e)}Ht("html-tree:open-section",e=>{const t=window,s=t.document,n=st(t,s),a=n.find(i=>i.uid===e||i.ids.includes(e));return a?(at(t,s,n,a.uid,""),{uid:a.uid,ids:a.ids}):null});Ht("html-tree:from-preview",({path:e,src:t}={})=>{To(window,e)||Fi(window,Oi(e,t)||e)});Ht("html-tree:arm-pick",e=>{const t=window;return e?(Go(t,nt(U())),!0):(W(t.document)||le({source:ee,type:Q.SVE_HTML_PICK,on:!1},t),!0)});function Zi(){ie.clear(),xe.clear(),ge.length=0}export{Qr as HTML_TREE_STYLE_ID,Ui as armHtmlTreePrefetch,Zi as clearHtmlTreeTemplates,oe as closeHtmlTreeMenu,Nt as closeHtmlTreePanel,ei as ensureHtmlTreeStyles,Xi as fillHtmlTreePane,D as htmlTreeActiveId,W as htmlTreePanel,Ge as htmlTreeTimer,Ke as htmlTreeUnhook,Zo as openHtmlTreePanel,A as renderHtmlTree,Yi as showHtmlTreePane,Bi as stopWatchHtmlTreeDock,Wi as toggleHtmlTreePanel,$t as watchHtmlTreeDock};
