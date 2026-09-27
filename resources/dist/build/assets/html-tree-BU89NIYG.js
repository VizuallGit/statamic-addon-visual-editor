const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-AWaJHJyk.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{_ as Be,I as q,J as nn,K as Le,o as f,k as v,l as C,G as S,m as P,F as M,L as pe,n as V,b2 as sn,x as L,O as mt,b3 as an,a as T,t as u,A as ke,C as rn,z as Pt,b4 as zt,b5 as Ut,b6 as ln,b7 as dn,b8 as cn,b9 as un,ba as tt,D as ce,at as hn,bb as o,u as l,w as pn,v as fn,M as le,bc as mn,B as vn,bd as X,be as gn,bf as yn,H as Pe,j as Te,bg as kn,bh as bn,bi as Xt,N as _n,Q as Tn,s as Et,au as vt,aq as xn,aO as yo,aP as ko,i as Sn,al as Yt,a1 as Ke,X as wn,aN as Cn,ar as $n,as as Ln,bj as Pn,bk as Wt,bl as bo,a0 as _o,bm as En,E as To,a9 as Ne,T as ot,U as nt,ay as st,az as Ae,S as Ht,bn as Hn,bo as In,bp as An,bq as Mn,aR as Rn,aS as Dn,ax as On,br as Fn,a_ as Bn,ak as It,aK as Nn,aF as jn}from"./addon-1ShCMxU3.js";import{M as Q,S as ee}from"./protocol-Brvy2KuB.js";import{canEditFields as Vn,currentSetHandle as Kn,openFieldsetOverlay as xo,openGlobalFieldsOverlay as qn}from"./section-fields-B1Rr4uGY.js";import{H as qe,ac as Gn}from"./ai-text-icon-B7vA1keB.js";import{D as Y,E as zn,F as At,G as Un,t as Xn,I as Mt,v as Yn,z as Wn,b as at,l as Zt,J as So,q as Zn,K as wo,H as Me,L as Jn,M as Rt,N as Co,O as $o,Q as Qn,h as es,c as ts,R as os,S as ns,T as ss,U as as,V as rs,W as is,X as ls,Y as ds,Z as cs,$ as us}from"./tw-classes-BsTvfwOz.js";import{b as hs}from"./html-pick-align-CLq5l-p4.js";import"./FieldsetOverlay-BD2T6PUb.js";const ps={class:"sve-dialog__title"},fs={for:"sve-new-section-group"},ms={class:"sve-dialog__row"},vs=["disabled"],gs=["value"],ys=["title","aria-label"],ks={key:0,class:"sve-dialog__add-group"},bs={for:"sve-new-section-group-name"},_s={class:"sve-dialog__row"},Ts=["placeholder","disabled"],xs=["disabled"],Ss=["disabled"],ws={for:"sve-new-section-name"},Cs=["placeholder"],$s={key:1,class:"sve-dialog__toggle"},Ls={key:2,class:"sve-dialog__note"},Ps={class:"sve-dialog__actions"},Es=["disabled"],Hs=["disabled"],Is={__name:"NewSectionPrompt",props:{heading:{type:String,required:!0},groupLabel:{type:String,required:!0},nameLabel:{type:String,required:!0},placeholder:{type:String,default:""},note:{type:String,default:""},groups:{type:Array,required:!0},toggleLabel:{type:String,default:""},toggleOn:{type:Boolean,default:!0},cancelLabel:{type:String,required:!0},saveLabel:{type:String,required:!0},onOk:{type:Function,required:!0},onClose:{type:Function,required:!0},addGroupLabel:{type:String,default:""},addGroupNameLabel:{type:String,default:""},addGroupPlaceholder:{type:String,default:""},onAddGroup:{type:Function,default:null}},setup(e){const t=e,s=q(""),n=q([...t.groups]),a=q(t.groups[0]?.key??""),i=q(!1),r=q(""),d=q(null),p=q(!1);function y(){i.value=!0,r.value="",Le(()=>d.value?.focus())}function g(){i.value=!1,r.value="",Le(()=>x.value?.focus())}async function c(){const H=r.value.trim();if(!H||p.value||!t.onAddGroup){d.value?.focus();return}p.value=!0;const A=await t.onAddGroup(H);if(p.value=!1,!A?.key){d.value?.focus();return}n.value.some(D=>D.key===A.key)||n.value.push(A),a.value=A.key,i.value=!1,r.value="",Le(()=>x.value?.focus())}function b(H){H.key==="Enter"?(H.preventDefault(),c()):H.key==="Escape"&&(H.stopPropagation(),g())}const k=q(t.toggleOn),x=q(null),_=q(!1);nn(()=>Le(()=>x.value?.focus()));function m(){const H=s.value.trim();if(!H||n.value.length&&!a.value||_.value){x.value?.focus();return}_.value=!0,t.onOk(H,a.value,k.value)}function $(H){H.target===H.currentTarget&&t.onClose()}function B(H){H.key==="Enter"?m():H.key==="Escape"&&t.onClose()}return(H,A)=>(f(),v("div",{class:"sve-dialog-overlay",onClick:$},[C("div",{class:"sve-dialog",onClick:A[5]||(A[5]=S(()=>{},["stop"]))},[C("div",ps,P(e.heading),1),n.value.length?(f(),v(M,{key:0},[C("label",fs,P(e.groupLabel),1),C("div",ms,[pe(C("select",{id:"sve-new-section-group","onUpdate:modelValue":A[0]||(A[0]=D=>a.value=D),disabled:i.value,onKeydown:B},[(f(!0),v(M,null,V(n.value,D=>(f(),v("option",{key:D.key,value:D.key},P(D.display),9,gs))),128))],40,vs),[[sn,a.value]]),e.onAddGroup&&!i.value?(f(),v("button",{key:0,type:"button",class:"is-add",title:e.addGroupLabel,"aria-label":e.addGroupLabel,"data-sve-new-group":"",onClick:y},[...A[6]||(A[6]=[C("span",{"aria-hidden":"true"},"+",-1)])],8,ys)):L("",!0)]),i.value?(f(),v("div",ks,[C("label",bs,P(e.addGroupNameLabel||e.addGroupLabel),1),C("div",_s,[pe(C("input",{id:"sve-new-section-group-name",ref_key:"groupInput",ref:d,"onUpdate:modelValue":A[1]||(A[1]=D=>r.value=D),type:"text",placeholder:e.addGroupPlaceholder,disabled:p.value,"data-sve-new-group-name":"",onKeydown:b},null,40,Ts),[[mt,r.value]]),C("button",{type:"button",class:"is-primary is-small",disabled:p.value,"data-sve-new-group-create":"",onClick:c},P(e.saveLabel),9,xs),C("button",{type:"button",class:"is-cancel is-small",disabled:p.value,onClick:g},P(e.cancelLabel),9,Ss)])])):L("",!0)],64)):L("",!0),C("label",ws,P(e.nameLabel),1),pe(C("input",{id:"sve-new-section-name",ref_key:"input",ref:x,"onUpdate:modelValue":A[2]||(A[2]=D=>s.value=D),type:"text",placeholder:e.placeholder,onKeydown:B},null,40,Cs),[[mt,s.value]]),e.toggleLabel?(f(),v("label",$s,[pe(C("input",{"onUpdate:modelValue":A[3]||(A[3]=D=>k.value=D),type:"checkbox",onKeydown:B},null,544),[[an,k.value]]),C("span",null,P(e.toggleLabel),1)])):L("",!0),e.note?(f(),v("p",Ls,P(e.note),1)):L("",!0),C("div",Ps,[C("button",{type:"button",class:"is-cancel",disabled:_.value,onClick:A[4]||(A[4]=(...D)=>e.onClose&&e.onClose(...D))},P(e.cancelLabel),9,Es),C("button",{type:"button",class:"is-primary",disabled:_.value,onClick:m},P(e.saveLabel),9,Hs)])])]))}},Lo=Be(Is,[["__scopeId","data-v-6501522a"]]),Dt="/!/sve/section-types",Jt="static_sections";async function As(e){const t=await e.fetch(Dt,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!t.ok)throw new Error(`section-types ${t.status}`);const s=await t.json();if(Array.isArray(s.groups)&&s.groups.length)return s.groups.filter(a=>a&&a.handle&&a.handle!==Jt).map(a=>({key:a.handle,display:a.display||a.handle}));const n=new Map;for(const a of s.types||[])a?.group&&a.group!==Jt&&!n.has(a.group)&&n.set(a.group,a.group_display||a.group);return[...n].map(([a,i])=>({key:a,display:i}))}async function Ms(e,t){const s=await e.fetch(`${Dt}/groups`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Pt(e),"X-Requested-With":"XMLHttpRequest",Accept:"application/json"},body:JSON.stringify({display:t})}),n=await s.json().catch(()=>({}));if(!s.ok||!n.group?.handle)throw new Error(n?.error==="bad_name"?"bad_name":`section-types/groups ${s.status}`);return e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale")),{key:n.group.handle,display:n.group.display||n.group.handle}}const Re=new Map;function Rs(e){e?.handle&&Re.set(e.handle,{static:!!e.static,hidden:!!e.hidden})}function Ds(e,t){return t?Re.has(t)?Re.get(t).static:e.Statamic?.$config?.get?.("sveSetMeta")?.[t]?.static===!0:!1}function Os(e,t){if(!t)return!1;if(Re.has(t))return Re.get(t).hidden;const s=e.Statamic?.$config?.get?.("sveSectionTypes");return Array.isArray(s)&&s.some(n=>n?.handle===t&&n.hidden===!0)}async function Po(e,t,s){const n=await e.fetch(Dt,{method:t,headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Pt(e),Accept:"application/json"},credentials:"same-origin",body:JSON.stringify(s)}),a=await n.json().catch(()=>({}));if(!n.ok){const i=new Error(a.error||`section-types ${n.status}`);throw i.reason=a.error,i}return Rs(a.section),a}function Fs(e,{display:t,group:s="",static:n=!1,hidden:a=!1}){return Po(e,"POST",{display:t,group:s,static:n,hidden:a})}function Qt(e,{handle:t,hidden:s,fields:n=!1}){const a={handle:t,fields:n};return typeof s=="boolean"&&(a.hidden=s),Po(e,"PATCH",a)}async function Bs(e,t,s=null,n=null){if(!t||typeof zt!="function"||typeof Ut!="function")return null;const a=await zt(e,t);if(!a)return null;n&&Array.isArray(a.definitions)&&ln(t,{display:n.display||t,icon:n.icon||null,hide:n.hidden===!0,fields:a.definitions,group_display:n.group_display||n.group||""},n.group||"");const i=dn(),r=cn(e,"page",{handle:t},a?.defaults,i),d=un(r,a?.new||{},a?.defaults);return Ut(e,e.document,s,r,d)?r:null}const eo=700,Ns=17;function js(e,t){const s=(t||[]).filter(Boolean);if(!s.length)return;let n=0;const a=()=>{n+=1;const i=tt(e),r=i?s.some(d=>i.querySelector(`[data-sid="${CSS.escape(d)}"]`)):!0;r&&ce({source:ee,type:Q.SVE_ACTIVATE,ids:s},e),(r?!i&&n<6:n<Ns)&&e.setTimeout(a,eo)};e.setTimeout(a,eo)}function Eo(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function Vs(e){return new Promise(t=>{let s=!1;const n=i=>{s||(s=!0,a.dismiss(),t(i==="static"||i==="fields"?i:null))},a=ke(e.document,rn,{title:u(e,"section_new_kind"),body:u(e,"section_new_kind_note"),buttons:[{value:"cancel",label:u(e,"cancel"),variant:"ghost"},{value:"static",label:u(e,"section_new_static"),variant:"primary"},{value:"fields",label:u(e,"section_new_with_fields"),variant:"primary"}],onPick:n,onClose:()=>n(null)})})}const Ks=`<section class="[ ] py-800">
    
</section>
`;function qs(e){if(T("dock:is-locked")===!0)return e.Statamic?.$toast?.error(u(e,"code_dock_locked")),!1;const s=`${String(T("dock:html")||"").replace(/\s+$/,"")}

${Ks}`;return T("dock:set-html",s)!==!0?(e.Statamic?.$toast?.error(u(e,"section_new_failed")),!1):(T("dock:save-now"),e.Statamic?.$toast?.success(u(e,"section_new_template_done")),!0)}async function Ho(e,t,s,{afterUid:n,onDone:a,onError:i}){try{const r=await Fs(e,s);t.dismiss(),e.Statamic?.$toast?.success(u(e,"section_created",{name:r.section?.display||s.display})),gt(e);const d=r.section?.handle?{...r.section,group_display:(r.section_types||[]).find(y=>y?.handle===r.section.handle)?.group_display||""}:null,p=await Bs(e,r.section?.handle,n,d);!p&&r.section?.handle&&T("dock:open-template",r.section.handle),a?.({...r,uid:p?._visual_id||""})}catch(r){t.dismiss(),e.Statamic?.$toast?.error(u(e,r.reason==="bad_name"?"section_new_bad_name":"section_new_failed")),i?.(r)}}function gt(e){e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"))}function Gs(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){const i=ke(e.document,Lo,{heading:u(e,"static_section_new"),groupLabel:"",nameLabel:u(e,"section_new_name"),placeholder:u(e,"section_new_placeholder"),note:u(e,"static_section_note"),groups:[],toggleLabel:u(e,"static_section_insertable"),cancelLabel:u(e,"cancel"),saveLabel:u(e,"section_new_create"),onClose:a,onOk:(r,d,p)=>{Ho(e,i,{display:r,static:!0,hidden:!p},{afterUid:t,onDone:s,onError:n})}})}function zs(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){(async()=>{let i=[];try{i=await As(e)}catch(d){n?.(d),e.Statamic?.$toast?.error(u(e,"section_new_failed"));return}if(!i.length){n?.(new Error("no groups")),e.Statamic?.$toast?.error(u(e,"section_new_failed"));return}const r=ke(e.document,Lo,{heading:u(e,"section_new"),groupLabel:u(e,"section_new_group"),nameLabel:u(e,"section_new_name"),placeholder:u(e,"section_new_placeholder"),note:u(e,"section_new_note"),groups:i,addGroupLabel:u(e,"section_new_group_add"),addGroupNameLabel:u(e,"section_new_group_name"),addGroupPlaceholder:u(e,"section_new_group_placeholder"),onAddGroup:async d=>{try{const p=await Ms(e,d);return e.Statamic?.$toast?.success(u(e,"section_group_created",{name:p.display})),p}catch(p){return e.Statamic?.$toast?.error(u(e,p?.message==="bad_name"?"section_new_bad_name":"section_group_failed")),null}},cancelLabel:u(e,"cancel"),saveLabel:u(e,"section_new_create"),onClose:a,onOk:(d,p)=>{Ho(e,r,{display:d,group:p},{afterUid:t,onDone:s,onError:n})}})})()}const Us={key:0,class:"sve-ht-inspect"},Xs={class:"sve-ht-inspect__head"},Ys={key:0,class:"sve-ht-inspect__note"},Ws={key:2,class:"sve-ht-inspect__props"},Zs={class:"sve-ht-inspect__proplabel"},Js={key:0},Qs=["value","disabled","onChange"],ea={value:""},ta=["value"],oa=["value"],na=["value","placeholder","onChange"],sa=["title","disabled","onClick"],aa=["title","disabled","onClick"],ra={key:0,class:"sve-ht-inspect__seg"},ia=["data-active","disabled","onClick"],la=["value","disabled"],da={key:0,value:""},ca=["value"],ua={key:2,class:"sve-ht-inspect__box"},ha=["value","placeholder","disabled","onKeydown"],pa=["title","disabled"],fa={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},ma=["value","disabled"],va=["value"],ga={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},ya=["value","placeholder","disabled"],ka=["title","disabled"],ba={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},_a=["value","placeholder","disabled"],Ta={key:4,class:"sve-ht-inspect__add"},xa=["disabled","onClick"],dt='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',Sa='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',wa={__name:"HtmlTreeInspector",setup(e){const t=q(null);hn(t,y=>o.onPropHost?.(y||null));const s=q(null),n=q(null);function a(y){o.onInspectCommit?.(y.target.value)}function i(y,g,c){!y||!g||(y.value=g,y.focus(),y.setSelectionRange(g.length,g.length),c(g))}function r(y,g){o.onInspectData?.(y.currentTarget,c=>o.onPropValue?.(g.handle,c,!0))}function d(y){o.onInspectData?.(y.currentTarget,g=>i(s.value,g,c=>o.onInspectCommit?.(c)))}function p(y){o.onInspectData?.(y.currentTarget,g=>i(n.value,g,c=>o.onLoopSortField?.(c)))}return(y,g)=>l(o).inspect?(f(),v("div",Us,[C("div",Xs,P(l(o).inspect.title),1),l(o).inspect.mode==="note"?(f(),v("div",Ys,P(l(o).inspect.note),1)):l(o).inspect.mode==="statamic"?(f(),v("div",{key:1,ref_key:"propHost",ref:t,class:"sve-ht-inspect__form"},null,512)):l(o).inspect.mode==="props"?(f(),v("div",Ws,[(f(!0),v(M,null,V(l(o).inspect.rows,c=>(f(),v("label",{key:c.handle,class:"sve-ht-inspect__prop"},[C("span",Zs,[pn(P(c.label)+" ",1),c.bound?(f(),v("em",Js,":")):L("",!0)]),C("span",{class:fn(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":c.type==="select"||c.type==="link"}])},[c.type==="select"&&!c.bound?(f(),v("select",{key:0,value:c.value,disabled:!l(o).canEdit,onChange:b=>l(o).onPropValue?.(c.handle,b.target.value,!1)},[C("option",ea,P(c.placeholder||l(o).inspect.inheritLabel),1),c.value&&!c.options.includes(c.value)?(f(),v("option",{key:0,value:c.value},P(c.value),9,ta)):L("",!0),(f(!0),v(M,null,V(c.options,b=>(f(),v("option",{key:b,value:b},P(b),9,oa))),128))],40,Qs)):(f(),v("input",{key:1,type:"text",value:c.value,placeholder:c.placeholder||l(o).inspect.inheritLabel,onChange:b=>l(o).onPropValue?.(c.handle,b.target.value,c.bound)},null,40,na)),c.type==="link"?(f(),v("button",{key:2,type:"button","data-sve-ht-data":"",title:l(o).pageTitle,disabled:!l(o).canEdit,onClick:b=>l(o).onPropPage?.(b.currentTarget,c.handle),innerHTML:Sa},null,8,sa)):L("",!0),C("button",{type:"button","data-sve-ht-data":"",title:l(o).dataTitle,disabled:!l(o).canEdit,onClick:b=>r(b,c),innerHTML:dt},null,8,aa)],2)]))),128))])):(f(),v(M,{key:3},[l(o).inspect.mode==="loop"?(f(),v("div",ra,[(f(!0),v(M,null,V(l(o).inspect.kinds,c=>(f(),v("button",{key:c.id,type:"button","data-active":c.id===l(o).inspect.loopKind?"":void 0,disabled:!l(o).canEdit,onClick:b=>l(o).onLoopKind?.(c.id)},P(c.label),9,ia))),128))])):L("",!0),l(o).inspect.mode==="loop"&&l(o).inspect.loopKind==="collection"?(f(),v("select",{key:l(o).inspect.key+":"+l(o).inspect.value,value:l(o).inspect.value,disabled:!l(o).canEdit,onChange:a},[l(o).inspect.value?L("",!0):(f(),v("option",da,P(l(o).inspect.placeholder),1)),(f(!0),v(M,null,V(l(o).inspect.collections,c=>(f(),v("option",{key:c.handle,value:c.handle},P(c.title),9,ca))),128))],40,la)):(f(),v("div",ua,[(f(),v("input",{ref_key:"field",ref:s,key:l(o).inspect.key,type:"text",value:l(o).inspect.value,placeholder:l(o).inspect.placeholder,disabled:!l(o).canEdit,spellcheck:"false",onKeydown:[g[0]||(g[0]=S(()=>{},["stop"])),le(S(a,["prevent"]),["enter"])],onBlur:a},null,40,ha)),C("button",{type:"button","data-sve-ht-data":"",title:l(o).dataTitle,disabled:!l(o).canEdit,innerHTML:dt,onMousedown:g[1]||(g[1]=S(()=>{},["prevent"])),onClick:S(d,["stop","prevent"])},null,40,pa)])),l(o).inspect.sort?(f(),v(M,{key:3},[C("div",fa,P(l(o).inspect.sort.title),1),(f(),v("select",{key:l(o).inspect.key+":dir:"+l(o).inspect.sort.dir,value:l(o).inspect.sort.dir,disabled:!l(o).canEdit,onChange:g[2]||(g[2]=c=>l(o).onLoopSortDir?.(c.target.value))},[(f(!0),v(M,null,V(l(o).inspect.sort.dirs,c=>(f(),v("option",{key:c.id,value:c.id},P(c.label),9,va))),128))],40,ma)),l(o).inspect.sort.needsField?(f(),v("div",ga,[(f(),v("input",{ref_key:"sortField",ref:n,key:l(o).inspect.key+":field",type:"text",value:l(o).inspect.sort.field,placeholder:l(o).inspect.sort.placeholder,disabled:!l(o).canEdit,spellcheck:"false",onKeydown:[g[3]||(g[3]=S(()=>{},["stop"])),g[4]||(g[4]=le(S(c=>l(o).onLoopSortField?.(c.target.value),["prevent"]),["enter"]))],onBlur:g[5]||(g[5]=c=>l(o).onLoopSortField?.(c.target.value))},null,40,ya)),l(o).inspect.sort.pickable?(f(),v("button",{key:0,type:"button","data-sve-ht-data":"",title:l(o).dataTitle,disabled:!l(o).canEdit,innerHTML:dt,onMousedown:g[6]||(g[6]=S(()=>{},["prevent"])),onClick:S(p,["stop","prevent"])},null,40,ka)):L("",!0)])):L("",!0),C("div",ba,P(l(o).inspect.limit.title),1),(f(),v("input",{key:l(o).inspect.key+":limit",type:"number",min:"1",value:l(o).inspect.limit.value,placeholder:l(o).inspect.limit.placeholder,disabled:!l(o).canEdit,onKeydown:[g[7]||(g[7]=S(()=>{},["stop"])),g[8]||(g[8]=le(S(c=>l(o).onLoopLimit?.(c.target.value),["prevent"]),["enter"]))],onBlur:g[9]||(g[9]=c=>l(o).onLoopLimit?.(c.target.value))},null,40,_a))],64)):L("",!0),l(o).inspect.branches?.length?(f(),v("div",Ta,[(f(!0),v(M,null,V(l(o).inspect.branches,c=>(f(),v("button",{key:c.id,type:"button",disabled:!l(o).canEdit,onClick:b=>l(o).onAddBranch?.(c.id)},P(c.label),9,xa))),128))])):L("",!0)],64))])):L("",!0)}},Ca=Be(wa,[["__scopeId","data-v-26254b75"]]),$a={class:"sve-html-tree"},La={class:"sve-pane-bar","data-sve-pane-bar":""},Pa={"data-sve-right-title":""},Ea={"data-sve-right-actions":""},Ha=["aria-pressed","title","aria-label"],Ia={class:"sve-ht-tools"},Aa=["title"],Ma=["placeholder","aria-label","value"],Ra=["aria-label"],Da=["title","aria-label"],Oa={key:1,class:"sve-tree-exit"},Fa=["title"],Ba=["title"],Na='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',ja='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',Va='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',Ka='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',qa={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const t=u(window,"html_tree_search");o.layers=mn(window);const s=u(window,"html_tree_layers_on"),n=u(window,"html_tree_layers_off");function a(){yn(window,!o.layers)}const i=Eo(window),r=u(window,"section_new"),d=q(!1);function p(){d.value=!1}async function y(b){if(!b)return;await Le(),o.onRefresh?.();const k=T("html-tree:open-section",b);k&&js(window,k.ids)}function g(){d.value||(d.value=!0,(async()=>{if(!(o.sections.length||o.pageBuilder)){qs(window),p();return}const b=await Vs(window);if(!b){p();return}const k=o.sections.length?o.sections[o.sections.length-1].uid:null,x=_=>{p(),y(_?.uid)};if(b==="static"){Gs(window,{afterUid:k,onDone:x,onError:p,onClose:p});return}zs(window,{afterUid:k,onDone:x,onError:p,onClose:p})})())}function c(b){const k=!!o.query;o.query=b,k!==!!b&&o.onQuery?.()}return(b,k)=>(f(),v("div",$a,[C("div",La,[C("div",Pa,P(e.title),1),C("div",Ea,[C("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":l(o).layers?"true":"false",title:l(o).layers?l(n):l(s),"aria-label":l(o).layers?l(n):l(s),innerHTML:Na,onClick:a},null,8,Ha),k[5]||(k[5]=vn('<button type="button" data-sve-right-pin aria-pressed="false" data-v-b2e9ab8b></button><button type="button" data-sve-close aria-label="Close" data-v-b2e9ab8b><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-b2e9ab8b><path d="M18 6 6 18" data-v-b2e9ab8b></path><path d="m6 6 12 12" data-v-b2e9ab8b></path></svg></button>',2))])]),C("div",Ia,[C("label",{class:"sve-ht-search",title:l(t)},[C("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:Va}),C("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:l(t),"aria-label":l(t),value:l(o).query,autocomplete:"off",spellcheck:"false",onInput:k[0]||(k[0]=x=>c(x.target.value)),onKeydown:[k[1]||(k[1]=S(()=>{},["stop"])),k[2]||(k[2]=le(S(x=>c(""),["prevent"]),["escape"]))]},null,40,Ma),l(o).query?(f(),v("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":l(t),innerHTML:Ka,onClick:k[3]||(k[3]=x=>c(""))},null,8,Ra)):L("",!0)],8,Aa),l(i)&&(l(o).sections.length||l(o).pageBuilder||l(o).rows.length)?(f(),v("button",{key:0,type:"button",class:"sve-ht-new",title:l(r),"aria-label":l(r),innerHTML:ja,onClick:g},null,8,Da)):L("",!0)]),l(Y).inSidebar?L("",!0):(f(),X(zn,{key:0})),k[6]||(k[6]=C("div",{"data-sve-html-tree-list":""},null,-1)),gn(Ca),l(o).exitOpen&&!l(Y).inSidebar?(f(),v("div",Oa,[C("span",{class:"sve-tree-exit__name",title:l(o).exitName},P(l(o).exitName),9,Fa),C("button",{type:"button",class:"sve-tree-exit__go",title:l(o).exitTitle,onClick:k[4]||(k[4]=x=>l(o).onExit?.())},P(l(o).exitLabel),9,Ba)])):L("",!0)]))}},Io=Be(qa,[["__scopeId","data-v-b2e9ab8b"]]);function Ao(e){return String(e||"").trim().toLowerCase()}function yt(e,t){return t?[e.name,e.tag,e.klass,e.label,e.src].filter(s=>typeof s=="string"&&s).join(" ").toLowerCase().includes(t):!0}function Ga(e,t){const s=Ao(t);if(!s)return{rows:e,hits:new Set};const n=new Set;for(const r of e)yt(r,s)&&n.add(r.path);const a=[...n];return{rows:e.filter(r=>n.has(r.path)||a.some(d=>d.startsWith(`${r.path}/`))),hits:n}}const za=["title"],Ua={"data-sve-ht-indent":"","aria-hidden":"true"},Xa=["data-sve-ht-cat"],Ya={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},Wa={key:2,"data-sve-ht-letter":""},Za=["innerHTML"],Ja=["title"],Qa=["title"],er={key:1,"data-sve-ht-kind":""},tr={key:3,"data-sve-ht-name":""},or={key:4,"data-sve-ht-actions":""},nr=["title"],sr={key:5,"data-sve-ht-actions":""},ar=["data-on","title","innerHTML"],rr=["disabled","title","innerHTML"],ir=["disabled","title"],lr=["disabled","title"],dr=["disabled","title"],cr=["data-sve-ht-id"],to='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',ur='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',hr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',pr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',fr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',mr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',vr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',gr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',yr={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const t=Vn(window),s=u(window,"section_fields");function n(){const _=Kn();if(!_){window.Statamic?.$toast?.error(u(window,"section_fields_none"));return}xo(window,_)}function a(_){return _.synthetic?_.frame==="main"?o.frameMainTitle:_.frame==="template"?o.frameTemplateTitle:o.frameOpenTitle:_.kind==="component"?_.src?`partial:${_.src}`:_.tag:_.name?`${_.tag} ${_.name}`:_.tag}function i(_){return!!_.section}function r(_){return!!_.frame}function d(_){return _.kind==="slot"}function p(_){return!!_.context}function y(_,m){p(m)||r(m)||d(m)||(i(m)?o.onSectionPointerDown?.(_,m.section):m.sectionRoot?o.onSectionPointerDown?.(_,m.sectionRoot):o.onPointerDown?.(_,m.id))}function g(_){if(_.synthetic){o.onFrame?.(_.frame);return}if(i(_)){o.onSection?.(_.section);return}if(p(_)){o.onContextRow?.(_.id);return}o.onSelect?.(_.id)}function c(_,m){const $={"data-sve-ht-id":_.id};return _.current&&($["data-sve-ht-current"]=""),_.hidden&&($["data-sve-ht-hidden"]=""),$["data-sve-ht-cat"]=_.cat||"other",$["data-sve-ht-depth"]=String(_.depth),m&&($["data-sve-ht-dim"]=""),p(_)&&($["data-sve-ht-context"]=_.context),i(_)&&($["data-sve-ht-sec"]=""),r(_)&&($["data-sve-ht-frame"]=_.frame),!i(_)&&o.dropId===_.id&&o.dropPlace&&($["data-sve-ht-drop"]=o.dropPlace),$}function b(_){return!_.hidden||_.wrapFrom!=null}function k(_){return!!_.sectionRoot||!!_.section}function x(_){return o.canEdit||k(_)}return(_,m)=>(f(),v(M,null,[C("div",Pe({"data-sve-ht-row":""},c(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:m[32]||(m[32]=$=>g(e.row)),onDblclick:m[33]||(m[33]=S($=>e.row.synthetic?l(o).onFrameEnter?.(e.row.frame):r(e.row)||d(e.row)||i(e.row)||p(e.row)?null:l(o).onRename?.(e.row.id),["prevent"])),onKeydown:[m[34]||(m[34]=le(S($=>g(e.row),["prevent"]),["enter"])),m[35]||(m[35]=le(S($=>g(e.row),["prevent"]),["space"]))],onPointerdown:m[36]||(m[36]=$=>y($,e.row)),onContextmenu:m[37]||(m[37]=S($=>r(e.row)||d(e.row)||i(e.row)||p(e.row)?null:l(o).onContext?.($,e.row.id),["prevent","stop"]))}),[C("span",Ua,[(f(!0),v(M,null,V(e.row.guides||[],($,B)=>(f(),v("i",{key:B,"data-sve-ht-cat":$},null,8,Xa))),128))]),e.row.hasChildren||e.row.emptyBlock?(f(),v("button",Pe({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?l(o).mainShut:e.row.shut)?{"data-sve-ht-shut":""}:{},{innerHTML:ur,onClick:m[0]||(m[0]=S($=>e.row.synthetic?l(o).onFrameTwist?.():i(e.row)?l(o).onSection?.(e.row.section):l(o).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:m[1]||(m[1]=S(()=>{},["stop"])),onDblclick:m[2]||(m[2]=S(()=>{},["stop"]))}),null,16)):(f(),v("span",Ya)),e.row.letter?(f(),v("span",Wa,P(e.row.letter),1)):(f(),v("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Za)),C("span",{"data-sve-ht-text":"",title:l(o).renameTitle},[!e.row.kind&&!i(e.row)&&!p(e.row)&&!r(e.row)?(f(),v("button",{key:0,type:"button","data-sve-ht-tag":"",title:l(o).tagTitle,onClick:m[3]||(m[3]=S(()=>{},["stop","prevent"])),onPointerdown:m[4]||(m[4]=S(()=>{},["stop"])),onDblclick:m[5]||(m[5]=S($=>l(o).onTagChange?.($,e.row.id),["stop","prevent"]))},P(e.row.tag),41,Qa)):(f(),v("span",er,P(e.row.tag),1)),l(o).editingId===e.row.id&&!i(e.row)?pe((f(),v("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":m[6]||(m[6]=$=>l(o).draft=$),onMousedown:m[7]||(m[7]=S(()=>{},["stop"])),onPointerdown:m[8]||(m[8]=S(()=>{},["stop"])),onClick:m[9]||(m[9]=S(()=>{},["stop"])),onDblclick:m[10]||(m[10]=S(()=>{},["stop"])),onKeydown:[m[11]||(m[11]=S(()=>{},["stop"])),m[12]||(m[12]=le(S($=>l(o).onRenameCommit?.(),["prevent"]),["enter"])),m[13]||(m[13]=le(S($=>l(o).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:m[14]||(m[14]=$=>l(o).onRenameCommit?.())},null,544)),[[mt,l(o).draft]]):(f(),v("span",tr,P(e.row.name),1))],8,Ja),r(e.row)?(f(),v("span",or,[e.row.frame!=="main"&&l(t)?(f(),v("button",{key:0,type:"button","data-sve-ht-fields":"",title:l(o).frameFieldsTitle,innerHTML:to,onClick:m[15]||(m[15]=S($=>l(o).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:m[16]||(m[16]=S(()=>{},["stop"])),onDblclick:m[17]||(m[17]=S(()=>{},["stop"]))},null,40,nr)):L("",!0)])):!i(e.row)&&!p(e.row)&&!d(e.row)?(f(),v("span",sr,[e.row.videoNth>=0?(f(),v("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?l(o).videoPlayTitle:l(o).videoHoldTitle,innerHTML:e.row.videoHeld?vr:mr,onClick:m[18]||(m[18]=S($=>l(o).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:m[19]||(m[19]=S(()=>{},["stop"])),onDblclick:m[20]||(m[20]=S(()=>{},["stop"]))},null,40,ar)):L("",!0),b(e.row)?(f(),v("button",{key:1,type:"button","data-sve-ht-eye":"",disabled:!l(o).canEdit,title:l(o).canEdit?e.row.hidden?l(o).showTitle:l(o).hideTitle:l(o).lockedTitle,innerHTML:e.row.hidden?pr:hr,onClick:m[21]||(m[21]=S($=>l(o).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:m[22]||(m[22]=S(()=>{},["stop"])),onDblclick:m[23]||(m[23]=S(()=>{},["stop"]))},null,40,rr)):L("",!0),l(t)&&e.row.fieldsIcon?(f(),v("button",{key:2,type:"button","data-sve-ht-fields":"",disabled:!l(o).canEdit,title:l(o).canEdit?l(s):l(o).lockedTitle,innerHTML:to,onClick:S(n,["stop","prevent"]),onPointerdown:m[24]||(m[24]=S(()=>{},["stop"])),onDblclick:m[25]||(m[25]=S(()=>{},["stop"]))},null,40,ir)):L("",!0),C("button",{type:"button","data-sve-ht-dup":"",disabled:!x(e.row),title:x(e.row)?l(o).duplicateTitle:l(o).lockedTitle,innerHTML:fr,onClick:m[26]||(m[26]=S($=>l(o).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:m[27]||(m[27]=S(()=>{},["stop"])),onDblclick:m[28]||(m[28]=S(()=>{},["stop"]))},null,40,lr),C("button",{type:"button","data-sve-ht-del":"",disabled:!x(e.row),title:x(e.row)?l(o).deleteTitle:l(o).lockedTitle,innerHTML:gr,onClick:m[29]||(m[29]=S($=>l(o).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:m[30]||(m[30]=S(()=>{},["stop"])),onDblclick:m[31]||(m[31]=S(()=>{},["stop"]))},null,40,dr)])):L("",!0)],16,za),e.row.emptyBlock&&!e.row.shut?(f(),v("div",Pe({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},l(o).dropId===e.row.id&&l(o).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),P(l(o).slotText),17,cr)):L("",!0)],64))}},Z=Be(yr,[["__scopeId","data-v-67d89fc6"]]),kr=["data-sve-ht-look","data-sve-ht-layers"],br={key:0,class:"sve-ht-empty"},_r={key:1,class:"sve-ht-empty"},Tr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},xr={key:0,class:"sve-ht-empty"},Sr={key:0,class:"sve-ht-empty"},wr={key:2,"data-sve-ht-frame-body":""},Cr={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},$r={key:0,class:"sve-ht-empty"},Lr={key:3,"data-sve-ht-frame-body":""},Pr=["data-dim"],Er={key:0,class:"sve-ht-empty"},Hr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},Ir={key:0,class:"sve-ht-empty"},Ar={__name:"HtmlTreeList",setup(e){const t=Te(()=>Ao(o.query)),s=Te(()=>Ga(o.rows,t.value)),n=Te(()=>s.value.rows),a=Te(()=>t.value?o.sections.filter(c=>yt(c.row,t.value)||c.current&&c.ready&&n.value.length>0):o.sections);function i(c){return!!c&&(!t.value||yt(c,t.value))}function r(c){const b=o.frame?.kind;return o.inComponent||(b==="header"||b==="footer")&&b!==c}const d=Te(()=>!!o.frame&&["header","main","footer"].some(c=>i(o.frame[c]))),p=Te(()=>!!t.value&&!a.value.length&&!n.value.length&&!d.value);function y(c){return!!t.value&&!s.value.hits.has(c.path)}function g(c){const b={"data-sve-ht-sec-uid":c.uid};return c.current&&(b["data-sve-ht-branch"]="",b["data-sve-ht-cat"]=c.row?.cat||"layout"),o.sectionDrop&&o.sectionDrop.uid===c.uid&&(b["data-sve-ht-drop"]=o.sectionDrop.place),b}return(c,b)=>(f(),v("div",Pe({class:"sve-ht-root","data-sve-ht-look":l(o).layers?"tags":l(o).look,"data-sve-ht-layers":l(o).layers?"":null,style:l(o).familyStyle},l(o).dragging?{"data-sve-ht-dragging":""}:{}),[!l(o).rows.length&&!l(o).sections.length&&!l(o).frame?(f(),v("div",br,P(l(o).emptyText),1)):p.value?(f(),v("div",_r,P(l(o).searchEmpty),1)):L("",!0),l(o).frame||l(o).sections.length?(f(),v(M,{key:2},[l(o).frame?(f(),v(M,{key:0},[l(o).frame.kind==="header"?(f(),v("div",Tr,[(f(!0),v(M,null,V(n.value,k=>(f(),X(Z,{key:k.id,row:k,dim:y(k)},null,8,["row","dim"]))),128)),l(o).rows.length?L("",!0):(f(),v("div",xr,P(l(o).emptyText),1))])):i(l(o).frame.header)?(f(),X(Z,{key:1,row:l(o).frame.header,dim:r("header")},null,8,["row","dim"])):L("",!0)],64)):L("",!0),C("div",kn(bn(l(o).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[l(o).frame?.kind==="main"?(f(),v(M,{key:0},[(f(!0),v(M,null,V(n.value,k=>(f(),X(Z,{key:k.id,row:k,dim:y(k)},null,8,["row","dim"]))),128)),l(o).rows.length?L("",!0):(f(),v("div",Sr,P(l(o).emptyText),1))],64)):l(o).frame&&i(l(o).frame.main)?(f(),X(Z,{key:1,row:l(o).frame.main,dim:r("main")},null,8,["row","dim"])):L("",!0),l(o).frame?.kind==="template"?pe((f(),v("div",wr,[C("div",Cr,[(f(!0),v(M,null,V(n.value,k=>(f(),X(Z,{key:k.id,row:k,dim:y(k)},null,8,["row","dim"]))),128)),l(o).rows.length?L("",!0):(f(),v("div",$r,P(l(o).emptyText),1))])],512)),[[Xt,!l(o).mainShut]]):L("",!0),l(o).sections.length||l(o).frame?pe((f(),v("div",Lr,[l(o).frame?.template&&i(l(o).frame.template)?(f(),X(Z,{key:0,row:l(o).frame.template,dim:r("template")},null,8,["row","dim"])):L("",!0),l(o).frame&&!l(o).frame.template&&!l(o).sections.length&&!t.value?(f(),v("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":r("")?"":void 0},P(l(o).frameEmptyText),9,Pr)):L("",!0),(f(!0),v(M,null,V(a.value,k=>(f(),v("div",Pe({key:k.uid},{ref_for:!0},g(k)),[k.ready?(f(),v(M,{key:0},[(f(!0),v(M,null,V(n.value,x=>(f(),X(Z,{key:x.id,row:x,dim:y(x)},null,8,["row","dim"]))),128)),l(o).rows.length?L("",!0):(f(),v("div",Er,P(l(o).emptyText),1))],64)):(f(),X(Z,{key:1,row:k.row,dim:r("")},null,8,["row","dim"]))],16))),128))],512)),[[Xt,!l(o).frame||!l(o).mainShut]]):L("",!0)],16),l(o).frame?(f(),v(M,{key:1},[l(o).frame.kind==="footer"?(f(),v("div",Hr,[(f(!0),v(M,null,V(n.value,k=>(f(),X(Z,{key:k.id,row:k,dim:y(k)},null,8,["row","dim"]))),128)),l(o).rows.length?L("",!0):(f(),v("div",Ir,P(l(o).emptyText),1))])):i(l(o).frame.footer)?(f(),X(Z,{key:1,row:l(o).frame.footer,dim:r("footer")},null,8,["row","dim"])):L("",!0)],64)):L("",!0)],64)):l(o).rows.length?(f(!0),v(M,{key:3},V(n.value,k=>(f(),X(Z,{key:k.id,row:k,dim:y(k)},null,8,["row","dim"]))),128)):L("",!0)],16,kr))}},oo=Be(Ar,[["__scopeId","data-v-1efba2e6"]]);let ct=null;function Mr(e){return ct||(ct=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{pages:[]}).then(t=>Array.isArray(t.pages)?t.pages:[]).catch(()=>[])),ct}let Ge=null;function ut(){Ge?.dismiss(),Ge=null}function Rr(e,t,s){ut();const n=t?.getBoundingClientRect?.(),a={x:n?n.left:0,y:n?n.bottom+4:0};Mr(e).then(i=>{const r=i.length?i.map(d=>({label:d.title||d.url,onPick:()=>{ut(),s(d.url)}})):[{label:u(e,"component_props_pages_none"),onPick:null}];ut(),Ge=ke(e.document,At,{items:r,x:a.x,y:a.y,onClose:()=>{Ge=null}})})}const Mo="sve-html-tree-labels";function Ro(){try{const e=globalThis.localStorage?.getItem(Mo);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function Dr(e){try{globalThis.localStorage?.setItem(Mo,JSON.stringify(e))}catch{}}function Do(e){return String(e||"_")}function Oo(e){const t=Ro()[Do(e)];return t&&typeof t=="object"?{...t}:{}}function Or(e,t,s){const n=s?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function Fr(e,t,s,n){if(!t)return;const a=Do(e),i=Ro(),r={...i[a]||{}},d=String(s||"").replace(/\s+/g," ").trim(),p=String(n||"").trim();!d||d===p?delete r[t]:r[t]=d,Object.keys(r).length?i[a]=r:delete i[a],Dr(i)}const Br=/^@(media|supports|container|layer|scope)\b/i;function Nr(e){const t=String(e||""),s=[];let n=0,a=0;for(;n<t.length;){if(t[n]==="{"&&t[n+1]==="{"){const d=t.indexOf("}}",n+2);n=d===-1?t.length:d+2;continue}if(t[n]==="/"&&t[n+1]==="*"){const d=t.indexOf("*/",n+2);n=d===-1?t.length:d+2;continue}if(t[n]==='"'||t[n]==="'"){const d=t[n];for(n+=1;n<t.length&&t[n]!==d;)n+=t[n]==="\\"?2:1;n+=1;continue}if(t[n]!=="{"){n+=1;continue}let i=1,r=n+1;for(;r<t.length&&i>0;){if(t[r]==="{"&&t[r+1]==="{"){const d=t.indexOf("}}",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==="/"&&t[r+1]==="*"){const d=t.indexOf("*/",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==='"'||t[r]==="'"){const d=t[r];for(r+=1;r<t.length&&t[r]!==d;)r+=t[r]==="\\"?2:1;r+=1;continue}t[r]==="{"?i+=1:t[r]==="}"&&(i-=1),r+=1}s.push({selector:t.slice(a,n).trim(),body:t.slice(n+1,r-1),from:a,to:r,text:t.slice(a,r).trim()}),n=r,a=r}return s}function no(e){const t=String(e||""),s=new Set,n=new Set,a=new Set;for(const i of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const r of i[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))r&&(s.add(r),s.add(r.replace(/([:./%!#()[\],])/g,"\\$1")));for(const i of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))i[2].trim()&&n.add(i[2].trim());for(const i of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))a.add(i[1].toLowerCase());return{classes:s,ids:n,tags:a}}function so(e,t){const s=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),n=[...s.matchAll(/\.((?:\\.|[\w-])+)/g)].map(r=>r[1]),a=[...s.matchAll(/#((?:\\.|[\w-])+)/g)].map(r=>r[1]);if(n.length||a.length){const r=d=>d.replace(/\\(.)/g,"$1");return n.every(d=>t.classes.has(d)||t.classes.has(r(d)))&&a.every(d=>t.ids.has(r(d)))}const i=[...s.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(r=>r[2].toLowerCase());return i.length>0&&i.every(r=>t.tags.has(r))}function jr(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function Vr(e,t,s){const n=jr(e);if(!n.length)return"keep";const a=n.filter(r=>so(r,t));return a.length?a.length===n.length&&!n.some(r=>so(r,s))?"move":"copy":"keep"}function Fo(e,t,s){const n=String(e||""),a=no(t),i=no(s),r=[],d=[];let p=0;for(const y of Nr(n)){const g=n.slice(y.from,y.to),c=g.match(/^\s*/)[0];if(p=y.to,Br.test(y.selector)){const k=Fo(y.body,t,s);k.move.trim()&&r.push(`${y.selector} {
${k.move.trim()}
}`),k.keep.trim()&&d.push(`${c}${y.selector} {
${k.keep.trim()}
}`);continue}const b=y.selector.startsWith("@")?"keep":Vr(y.selector,a,i);if(b==="move"){r.push(y.text);continue}b==="copy"&&r.push(y.text),d.push(g)}return d.push(n.slice(p)),{move:r.join(`

`).trim(),keep:d.join("").replace(/\n{3,}/g,`

`).trim()}}const Kr="/!/sve/component";function qr(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let s=null;for(const n of t){if(!n.trim())continue;const a=n.match(/^[ \t]*/)[0].length;s=s===null?a:Math.min(s,a)}return s?t.map(n=>n.slice(s)).join(`
`):t.join(`
`)}function Gr(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function zr(e,t){if(!Xn(e))return"";try{return await(await Tn(()=>import("./tw-compile-AWaJHJyk.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(s){return console.error("[sve] component tailwind compile",s),""}}async function Ur(e,t){const s=await e.fetch(Kr,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":Pt(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!s.ok){const n=new Error(String(s.status));throw n.status=s.status,n}return s.json()}function ao(e,t){const{from:s,to:n}=Un(e,t),a=e.slice(s,n);if(!a.trim())return null;const i=e.slice(0,s)+e.slice(n),r=T("dock:css"),d=Fo(typeof r=="string"?r:"",a,i);return{html:qr(a),css:d.move,keepCss:d.keep,lead:Gr(a),from:s,to:n}}function Xr(e,t,{onDone:s,onError:n}={}){if(T("dock:is-locked")===!0)return;const a=T("dock:html");if(typeof a!="string"||!t)return;const i=ao(a,t);if(!i)return;const r=ke(e.document,_n,{heading:u(e,"component_new"),nameLabel:u(e,"component_name"),placeholder:u(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:u(e,"cancel"),saveLabel:u(e,"component_create"),onOk:d=>{r.dismiss(),(async()=>{try{const p=await zr(e,i.html),y=T("dock:html"),g=typeof y=="string"&&y===a?i:ao(y,t);if(!g)return;const c=await Ur(e,{name:d,html:g.html,css:g.css,js:"",tw:p}),b=T("dock:html"),k=b.slice(0,g.from)+g.lead+c.tag+b.slice(g.to);T("dock:set-html",k),g.css.trim()&&T("dock:set-css",g.keepCss),s?.(c)}catch(p){n?.(p)}})()}})}function Yr(e,t,s){const n=String(e||"");if(!t||t.kind!=="antlers")return n;const a=String(s||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?Qr(n,t,a):t.tag==="else"||!a?n:n.slice(0,t.from)+`{{ ${t.tag} ${a} }}`+n.slice(t.openTo)}function kt(e,t,s,n){return Ee(e,t,{kind:s,name:n})}function Ee(e,t,s={}){const n=String(e||"");if(!t||t.antlers!=="loop")return n;const a=t.loopKind==="collection"?"collection":"field",i=s.kind??a,r=String(s.name??t.expr??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(r))return n;const d=s.sortDir??t.sortDir??"",p=String(s.sortField??t.sortField??"").trim(),y=String(s.limit??t.limit??"").trim(),g=Bo(n,t);if(!g)return n;const c=i===a?t.params:"",b=i==="collection"?Wr(r,p,d,y,c):Zr(r,p,d,y,c),k=i==="collection"?"collection":r;return n.slice(0,t.from)+b+n.slice(t.openTo,g.from)+`{{ /${k} }}`+n.slice(g.to)}function Wr(e,t,s,n,a){const i=Jr(a).replace(/\bsort\s*=\s*["'][^"']*["']/g,"").replace(/\blimit\s*=\s*["']?\d+["']?/g,"").replace(/\s+/g," ").trim(),r=[`collection from="${e}"`];return s==="random"?r.push('sort="random"'):t&&r.push(`sort="${t}${s==="desc"?":desc":":asc"}"`),n&&r.push(`limit="${n}"`),i&&r.push(i),`{{ ${r.join(" ")} }}`}function Zr(e,t,s,n,a){const i=String(a||"").split("|").map(d=>d.trim()).filter(d=>d&&!/^from\s*=/.test(d)&&!/^sort\s*:/.test(d)&&!/^reverse$/.test(d)&&!/^shuffle$/.test(d)&&!/^limit\s*:/.test(d)),r=[e,...i];return s==="random"?r.push("shuffle"):t&&(r.push(`sort:${t}`),s==="desc"&&r.push("reverse")),n&&r.push(`limit:${n}`),`{{ ${r.join(" | ")} }}`}function Jr(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function Bo(e,t){const n=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return n?{from:t.from+n.index,to:t.from+n.index+n[0].length}:null}function Qr(e,t,s){return Ee(e,t,{name:s})}function ei(e,t,s){const n=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return n;const a=Bo(n,t);if(!a)return n;const r=(n.slice(0,a.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],d=s==="else"?"{{ else }}":"{{ elseif true }}";return`${n.slice(0,a.from)}${d}
${r}${n.slice(a.from)}`}const z=Jn("sve-call-values"),De=new Set;let ro=null;const ti="__sve-html-tree-style",K=new Set;let bt="",xe=!1,ht=null,Ce=!0,J="",we=0,No="";const de=new Map,Se=new Set;let G="",jo=!1,F=null,ze=null,Ve="",Ue=0,_t=null,Oe=[],fe=null,He=null,Xe=null,Ye=null,Tt=null,ge=!1,me=null,Fe=null,Ie=null,We=null,Ze=null,xt=null,he=null;function W(e){return e.getElementById(qe)}function oi(e){Sn(e,ti,`
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
      ${Yt("light")}
      /* How much of a row's own colour its pick takes: a wash, not a fill.
         The row mixes it in below — a mix written up here would read
         --sve-ht-c on the list, where no family is set. */
      --sve-ht-pick-mix: 11%;
      --sve-ht-pick-hover-mix: 18%;
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${Yt("dark")}
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
  `)}function U(){const e=T("dock:html");return typeof e=="string"?e:""}function Vo(e){return!!T("dock:is-open",e)}function $e(e,{save:t=!1}={}){return Ft()||T("dock:set-html",e)!==!0?!1:(t&&T("dock:save-now"),!0)}function io(e){const t=T("dock:component-exit-state")||{};if(o.exitOpen=!!t.open,!t.open){o.onExit=null;return}o.exitName=t.name||"",o.exitLabel=u(e,"component_exit"),o.exitTitle=u(e,t.back?"component_exit_back":"component_exit_close"),o.onExit=()=>{T("dock:exit-component"),I(e)}}function Ko(e,t){const s=Rn(e);if(!s||t.type!==s)return"";const n=Dn(t[s]);return n&&On(e,n)?.section_type||""}const ye=[];let pt=!1,St=!1;function ft(e,t){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(t,{timeout:2e3});return}e.setTimeout(t,200)}function ni(e,t){for(const s of t){const n=s.type;!n||de.has(n)||Se.has(n)||ye.includes(n)||ye.push(n)}Et.htmlTreePrefetchArmed&&Ot(e)}function Wi(e){Et.htmlTreePrefetchArmed=!0,Ot(e)}function Ot(e){if(pt||!ye.length)return;pt=!0;const t=()=>{const s=ye.shift();if(!s){pt=!1;return}if(de.has(s)||Se.has(s)){ft(e,t);return}Se.add(s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(s)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{typeof n?.html=="string"&&(de.set(s,n.html),St&&(St=!1,I(e)))}).catch(()=>{}).finally(()=>{Se.delete(s),ft(e,t)})};ft(e,t)}function Ft(){return!!G}function si(e){const t=new Map,s=tt(e);if(!s)return t;for(const n of s.querySelectorAll("[data-sid]")){const a=n.getAttribute("data-sid");a&&!t.has(a)&&t.set(a,n.tagName.toLowerCase())}return t}function ai(e,t){const s=Ne(e)||"page_sections";for(const n of ot(t)||[]){const a=nt(n.values),i=a&&typeof a=="object"?a[s]:null;if(Array.isArray(i))return!0}return!1}function rt(e,t){const s=Ne(e)||"page_sections",n=si(e),a=[];for(const i of ot(t)||[]){const r=nt(i.values),d=r&&typeof r=="object"?r[s]:null;if(Array.isArray(d)){d.forEach(p=>{if(!p||typeof p!="object"||Array.isArray(p)||typeof p.type!="string")return;const y=[p._visual_id,p.id,p._id].filter(x=>typeof x=="string"&&x!=="");if(!y.length)return;const g=Ko(e,p)||p.type,c=typeof p._sve_label=="string"?p._sve_label.trim():"",b=y.map(x=>n.get(x)).find(Boolean)||"section",k=Oo(p.type)[`0:${b}`];a.push({uid:y[0],ids:y,type:p.type,tag:b,label:c||(typeof k=="string"&&k.trim()?k.trim():"")||st(e,g)?.display||Ae(g)||g,svg:wo(b,"",null).svg||Me.section,cat:_o(b),enabled:p.enabled!==!1,static:Ds(e,g)})});break}}return a}function ri(e,t,s){if(!s.length)return"";const n=T("dock:current-type")||"",a=T("dock:current-uid"),i=!!T("dock:component-exit-state")?.open;if(a){const r=Ht(a,t),d=s.find(p=>p.ids.some(y=>r.includes(y)));if(d&&(i||d.type===n))return d.uid}return s.find(r=>r.type===n)?.uid||""}function ii(e,t,s,n){const a=t.find(x=>x.uid===s),i=T("dock:component-src"),r=T("dock:type-stack")||[];if(!a||!i||!r.length)return null;const d=r.map(x=>x.type).filter(x=>!de.get(x));if(d.length)return li(e,d),null;const p=[],y=new Set,g=new Set;let c=x=>p.push(...x),b=null,k=0;for(let x=0;x<r.length;x+=1){const _=x+1<r.length?r[x+1].src:i,m=N=>({...N,id:`ctx${x}:${N.id}`,path:`ctx${x}/${N.path}`,ctxLevel:x,children:N.children.map(m)}),$=at(de.get(r[x].type)).map(m),B=[],H=(N,R)=>{for(const O of N){if(O.kind==="component"&&O.src===_)return B.push(...R,O),O;const se=H(O.children,[...R,O]);if(se)return se}return null};if(b=_?H($,[]):null,!b)return null;const A=new Set(B.map(N=>N.id)),D=(N,R)=>{for(const O of N)O.children.length&&(A.has(O.id)?K.has(O.path):Go(O,R))&&y.add(O.id),D(O.children,R+1)};D($,k),c($),g.add(b.id),k+=B.length,c=(N=>R=>{N.children=R})(b)}for(const x of zo(n))y.add(x);return K.has(b.path)&&y.add(b.id),b.children=n,{tree:p,folds:y,hostId:b.id,hostIds:g,levels:r.length,rootId:p.find(x=>!x.kind)?.id||"",label:a.label,svg:a.svg,cat:a.cat}}function li(e,t){for(const s of t)!ye.includes(s)&&!Se.has(s)&&ye.push(s);St=!0,Ot(e)}function di(e,t,s){const n=T("dock:component-exit-state");if(n?.open)return Ae(n.name)||n.name||"";if(s)return t.find(i=>i.uid===s)?.label||"";const a=T("dock:current-type")||"";return st(e,a)?.display||Ae(a)||""}function it(e,t,s,n,a){const i=s.find(d=>d.uid===n);if(!i||n===a)return;K.clear(),F=null,Ce=!1,ne(),je(),J=n,No=U(),G=de.get(i.type)||"",G&&(F=Je(at(G))||null),jo=(T("dock:current-type")||"")===i.type,e.clearTimeout(we),we=e.setTimeout(()=>{J="",xe=!1,I(e)},4e3),I(e);const r=()=>Nn(i.uid,t,e,{clampToSection:!0});Mn(i.uid,t,e,r),ce({source:ee,type:Q.SVE_ACTIVATE,ids:i.ids},e),e.setTimeout(()=>I(e),0)}function qo(e,t){if(!t)return!1;for(const s of e||[])if(s.id===t||qo(s.children,t))return!0;return!1}function Je(e){for(const t of e||[]){if(!t.kind)return t.id;const s=Je(t.children);if(s)return s}return""}function Go(e,t){return K.has(e.path)?t===0:t>0}function zo(e){const t=new Set,s=(n,a)=>{for(const i of n)i.children.length&&Go(i,a)&&t.add(i.id),s(i.children,a+1)};return s(e,0),t}function I(e){const t=e.document,n=W(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;oi(t),Wn(e);const a=U();G&&G===a&&(G=""),T("dock:chrome-kind")&&(G="");const i=G||a,r=at(i);Oe=r;const d=T("dock:current-type")||"",p=Oo(d),y=ai(e,t),c=!!(T("dock:component-exit-state")||{}).open,b=rt(e,t);d&&a&&!G&&de.set(d,a),ni(e,b);const k=ri(e,t,b),x=String(T("dock:chrome-kind")||"");if(Pn(e),y&&!b.length&&!x){Oe=[],o.rows=[],o.sections=[],o.frame=co(e,[],!1,!1,"",!0),o.frameEmptyText=u(e,"html_tree_frame_no_sections"),o.pageBuilder=!0,o.emptyText=u(e,"html_tree_empty"),o.canEdit=!T("dock:is-locked"),o.look=Wt(e),o.onRefresh=()=>I(e),o.onSection=null,lo(e,""),io(e),Ke(n,oo),po(e,[]);return}o.pageBuilder=y;const _=`${d}|${k}`;let m=!1;_!==bt&&(bt=_,K.clear(),ht!==null&&i!==ht?m=!0:xe=i),(m||xe!==!1&&i!==xe)&&(xe=!1,K.clear(),F=Je(r)||null),ht=i,J&&(J===k||!b.length)&&(jo||i!==No)&&(e.clearTimeout(we),J="",xe=!1,qo(r,F)||(K.clear(),F=Je(r)||null));const $=b.some(h=>h.uid===J)?J:"",B=Ce?"":$||k,H=c?ii(e,b,B,r):null,A=!!($||k),D=A||c?"":String(T("dock:chrome-kind")||""),N=y&&D==="main"&&T("dock:on-empty-page")===!0,R=N||D==="template"?"":D;R!=="main"&&(Ve="");const O=R==="main"?uo(r,"main"):null;O&&(Ct(O.path),Ve!==_&&K.add(O.path));const se=R==="header"||R==="footer"?Bt(r,h=>i.slice(h.from,h.openTo).includes(`data-sve-chrome="${R}"`))||uo(r,R):null;se&&Ct(se.path);const j=N||!(R==="main"?!!O:R==="header"||R==="footer"?!!se:!0)?[]:H?Zt(H.tree,o.query?new Set:H.folds):Zt(r,o.query?new Set:zo(r));!i.trim()&&!Vo(t)?o.emptyText=u(e,"html_tree_need_dock"):o.emptyText=u(e,"html_tree_empty"),o.slotText=u(e,"antlers_drop_here"),o.dataTitle=u(e,"data_vars_title"),o.pageTitle=u(e,"component_props_page"),o.renameTitle=u(e,"html_tree_rename"),o.tagTitle=u(e,"tw_tag"),o.hideTitle=u(e,"html_tree_hide"),o.showTitle=u(e,"html_tree_show"),o.duplicateTitle=u(e,"html_tree_duplicate"),o.deleteTitle=u(e,"html_tree_delete"),o.videoHoldTitle=u(e,"html_tree_video_hold"),o.videoPlayTitle=u(e,"html_tree_video_play"),o.lockedTitle=u(e,"html_tree_locked"),o.searchEmpty=u(e,"html_tree_search_empty"),o.canEdit=!T("dock:is-locked"),o.look=Wt(e),o.onQuery=()=>I(e),io(e),o.inComponent=c,o.onContextRow=h=>{if(!H||h===H.hostId)return;const w=j.find(E=>E.id===h)?.ctxLevel??H.levels-1;T("dock:exit-component",H.levels-w),I(e)},o.onSelect=h=>{const w=j.find(E=>E.id===h);w&&So(e,w.path)||et(e,h,j)},o.onTwist=h=>{const w=j.find(E=>E.id===h)?.path;w&&(K.has(w)?K.delete(w):K.add(w),I(e))},o.onTagChange=(h,w)=>{const E=o.rows.find(te=>te.id===w);E&&!Ft()&&Zn(e,h.currentTarget,E)},o.onRename=h=>pi(e,h),o.onRenameCommit=()=>fo(e,!0),o.onRenameCancel=()=>fo(e,!1),o.onHide=h=>vi(e,h),o.onVideoHold=h=>mi(e,h),o.onDuplicate=h=>gi(e,h),o.onDelete=h=>ki(e,h),o.onPointerDown=(h,w)=>wi(e,h,w),o.onSectionPointerDown=(h,w)=>Li(e,h,w),o.onContext=(h,w)=>xi(e,h,w),o.onInspectCommit=h=>Ri(e,h),o.onPropValue=(h,w,E)=>go(e,h,w,E),o.onPropPage=(h,w)=>Rr(e,h,E=>go(e,w,E,!1)),o.onLoopKind=h=>Di(e,h),o.onAddBranch=h=>Oi(e,h),o.onLoopSortField=h=>{const w=Qe(),E=String(h||"").trim();if(!w)return;const te=he?.id===w.id?he.dir:"",ie=w.sortDir||te||"asc";he=null,ve(e,(_e,on)=>Ee(_e,on,{sortField:E,sortDir:ie}))},o.onLoopSortDir=h=>{const w=Qe(),E=String(h||"");if(w){if((E==="asc"||E==="desc")&&!w.sortField){he={id:w.id,dir:E},$t(e,w);return}he=null,ve(e,(te,ie)=>Ee(te,ie,{sortDir:E,sortField:E==="asc"||E==="desc"?ie.sortField:""}))}},o.onLoopLimit=h=>ve(e,(w,E)=>Ee(w,E,{limit:String(h||"").replace(/\D/g,"")})),o.onPropHost=h=>h?z.mount(h):z.unmount(),o.onInspectData=(h,w)=>{T("dock:data-menu",{anchor:h,at:j.find(E=>E.id===F)?.from,onPick:E=>w(String(E?.var||"").trim())})};const Vt=j.find(h=>!h.kind)?.id,Kt=c?"":di(e,b,B),ue=B&&!c?b.find(h=>h.uid===B):null,en=bo(e,String(T("dock:current-type")||""));let tn=0;const ae=R==="header"||R==="footer"?R:"",be=se?se.id:"",oe=O&&j.find(h=>h.id===O.id)||null,qt=oe&&j.find(h=>h.tag==="body"&&h.depth<oe.depth)||null,re=qt||oe||be&&j.find(h=>h.id===be)||null,Gt=re?ci(j,re):-1;re&&!j.slice(j.indexOf(re),Gt).some(h=>h.id===F)&&(F=re.id),o.rows=j.map(h=>{const w=wo(h.tag,h.kind,h.antlers),E=h.tag==="video"&&!h.kind?tn++:-1,te=!!H&&h.id===H.rootId,ie=h.id===Vt&&Kt?Kt:te?H.label:h.klass,_e=h.id===Vt;return{...h,base:ie,name:ae&&h.id===be?u(e,`html_tree_frame_${ae}`):h===oe?u(e,"html_tree_frame_main"):_e&&ue?ie:Or(ie,h.path,p),current:h.id===F,letter:te?"":w.letter||"",svg:ae&&h.id===be?Me[ae]:h===oe?Me.main:_e&&ue?ue.svg:te?H.svg:w.svg||"",frame:ae&&h.id===be?ae:h===oe?"main":"",cat:ae&&h.id===be?ae:h===oe?"main":te?H.cat:_o(h.tag,h.kind,h.antlers),context:H?H.hostIds.has(h.id)?"host":h.id.startsWith("ctx")?"dim":"":"",sectionRoot:_e&&ue?ue.uid:"",fieldsIcon:!!(_e&&ue&&!ue.static),videoNth:E,videoHeld:E>=0&&en.has(E)}}),En(e);const lt=[];for(const h of o.rows)lt.length=h.depth,h.guides=lt.slice(),lt[h.depth]=h.cat;if(re){const h=j.indexOf(re),w=re.depth;o.rows=o.rows.slice(h,Gt).map(E=>({...E,depth:E.depth-w,guides:E.guides.slice(w)})),oe&&Ve!==_&&(Ve=_,e.setTimeout(()=>et(e,oe.id,j),0))}o.sections=y&&(A||R||N)?b.map(h=>{const w=!!B&&h.uid===B;return{...h,current:w,ready:w&&(!$||!!G),row:{id:`sec:${h.uid}`,section:h.uid,tag:h.tag,name:h.label,kind:"",svg:h.svg,cat:h.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:w,hidden:!h.enabled}}}):[],o.frame=co(e,b,A,c,R,!1,!!qt),o.frameEmptyText=u(e,"html_tree_frame_no_sections"),lo(e,R),o.onSection=h=>{ge||(wt(e),it(e,t,b,h,B))},o.onRefresh=()=>I(e),$t(e,o.rows.find(h=>h.id===F)),Ke(n,oo),po(e,r)}function lo(e,t){o.frameOpenTitle=u(e,"html_tree_frame_open"),o.frameMainTitle=u(e,"html_tree_frame_main_open"),o.frameTemplateTitle=u(e,"html_tree_frame_template_open"),o.frameFieldsTitle=u(e,"html_tree_frame_fields"),o.onFrame=s=>{t===s?ui(e,s):ho(e,s)},o.onFrameEnter=s=>ho(e,s),o.onFrameFields=s=>qn(e,Hn(e,s),u(e,`html_tree_frame_${s}`)),o.onFrameTwist=()=>{o.mainShut=!o.mainShut}}function co(e,t,s,n,a,i=!1,r=!1){if(!a&&!i||r)return null;const d=g=>({id:`frame:${g}`,frame:g,synthetic:!0,tag:g,name:u(e,`html_tree_frame_${g}`),kind:"",svg:Me[g]||"",cat:g,letter:"",depth:0,hasChildren:g==="main"&&(t.length>0||a==="template"),shut:g!=="main",current:!1,hidden:!1}),p={kind:a,header:d("header"),main:d("main"),footer:d("footer"),template:null},y=a&&a!=="template"?String(T("dock:collection-view")||""):"";return y&&(p.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:st(e,y)?.display||Ae(y.replace(/^view:/,"")),kind:"",svg:Me.section,cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),p}function uo(e,t){return Bt(e,s=>s.tag===t)}function Bt(e,t){for(const s of e||[]){if(!s.kind&&t(s))return s;const n=Bt(s.children,t);if(n)return n}return null}function ci(e,t){let s=e.indexOf(t)+1;for(;s<e.length&&e[s].depth>t.depth;)s+=1;return s}function ui(e,t){const s=tt(e);(t==="main"||t==="template"?s?.querySelector("main"):s?.querySelector(`[data-sve-chrome="${t}"]`))?.scrollIntoView({behavior:"smooth",block:"start"})}function wt(e){const t=String(T("dock:chrome-open",e.document)||"");return t!=="header"&&t!=="footer"?!1:(An(e),ce({source:ee,type:Q.SVE_FORCE_EXIT_CHROME},e),!0)}function hi(e){e.clearTimeout(we),J="",G="",K.clear(),F=null,Ce=!1,ne(),je()}function ho(e,t){if(e.document,String(T("dock:chrome-kind")||"")===t)return;if(hi(e),t==="main"){wt(e),T("dock:open-file",Gn);return}if(t==="template"){const i=String(T("dock:collection-view")||"");i&&(wt(e),T("dock:open-file",i));return}if(t!=="header"&&t!=="footer")return;const s=tt(e)?.querySelector(`[data-sve-chrome="${t}"]`);s?(s.scrollIntoView({block:"nearest"}),s.dispatchEvent(new s.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:ee,type:Q.OPEN_CHROME,kind:t},e.location.origin);const n=Date.now(),a=async()=>{if(String(T("dock:chrome-kind")||"")!==t){Date.now()-n<3e4&&e.setTimeout(a,250);return}await(T("dock:load-settled")||null),Qo(e)};e.setTimeout(a,250)}function po(e,t){W(e.document)&&Uo(e,t)}function Uo(e,t){const s=t[0],n=!!T("dock:component-src"),a=n?"":T("dock:current-uid")||"";ce({source:ee,type:Q.SVE_HTML_PICK,on:!0,uid:a,uids:a?Ht(a,e.document):[],all:n,tag:s?.tag||"",klass:s?.klass||"",nodes:hs(t)},e)}function Ct(e){if(!e)return;const t=(s,n)=>{for(const a of s||[]){if(a.path===e)return!0;if(t(a.children,n+1))return n===0?K.delete(a.path):K.add(a.path),!0}return!1};t(Oe,0)}function pi(e,t){if(ge)return;const s=o.rows.find(n=>n.id===t);!s||s.kind||(F=t,o.rows.forEach(n=>{n.current=n.id===t}),o.editingId=t,o.draft=s.name,e.setTimeout(()=>{const n=W(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function fo(e,t){const s=o.editingId;if(!s)return;const n=o.rows.find(a=>a.id===s);o.editingId=null,t&&n&&(n.sectionRoot?fi(e,n.sectionRoot,o.draft):Fr(T("dock:current-type")||"",n.path,o.draft,n.base||n.klass)),o.draft="",I(e)}function fi(e,t,s){const n=Ne(e)||"page_sections",a=String(s||"").replace(/\s+/g," ").trim();for(const i of ot(e.document)||[]){const r=nt(i.values),d=r&&typeof r=="object"?r[n]:null;if(!Array.isArray(d))continue;const p=d.findIndex(b=>b&&typeof b=="object"&&[b._visual_id,b.id,b._id].includes(t));if(p===-1)continue;const y=Ko(e,d[p])||d[p].type,g=st(e,y)?.display||Ae(y)||y,c=JSON.parse(JSON.stringify(d));return c[p]={...c[p]},!a||a===g?delete c[p]._sve_label:c[p]._sve_label=a,i.setFieldValue(n,c),!0}return!1}function mi(e,t){const s=o.rows.find(d=>d.id===t);if(!s||!(s.videoNth>=0))return;const n=String(T("dock:current-type")||""),a=bo(e,n),i=!a.has(s.videoNth);i?a.add(s.videoNth):a.delete(s.videoNth);const r=String(T("dock:current-uid")||"");In(e,n,a),ce({source:ee,type:Q.SVE_VIDEO_HOLD,uid:r,uids:r?Ht(r,e.document):[],nth:s.videoNth,on:i},e),I(e)}function vi(e,t){Nt(e,t,ds)}function gi(e,t){const s=o.rows.find(n=>n.id===t)?.sectionRoot;if(s){e.postMessage({source:ee,type:Q.DUPLICATE_ROW,uid:s},e.location.origin);return}Nt(e,t,cs)}function Xo(e,t){Fn(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const s=e.document;jn({uid:t},s,e)})}function yi(e,t,s){J===s&&(e.clearTimeout(we),J="",G=""),F=null,Ce=!1,bt="";const n=rt(e,t),a=n.find(i=>i.uid!==s)||n[0];a?it(e,t,n,a.uid,""):(G="",o.rows=[],o.sections=[],o.frame=null,o.pageBuilder=!0,I(e)),e.setTimeout(()=>{W(e.document)&&I(e)},0)}To("row:removed",({uid:e,parentPath:t,doc:s,win:n})=>{t!==Ne(n)||!W(n.document)||yi(n,s,e)});function ki(e,t){const s=o.sections?.find(a=>a.row?.id===t),n=s?s.row?.section||s.uid:o.rows.find(a=>a.id===t)?.sectionRoot;if(n){Xo(e,n);return}Nt(e,t,us)}function Nt(e,t,s){if(T("dock:is-locked"))return;const n=U(),a=o.rows.find(r=>r.id===t);if(!a)return;const i=s(n,a);i!==n&&$e(i)}function ne(){me?.dismiss(),me=null}const bi='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',_i='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>';function Yo(e,t){const s=o.sections?.find(p=>p.uid===t),n=s?.type||"";if(!n||!Eo(e))return[];const a=s.label||n,i=Os(e,n),r=()=>e.Statamic?.$toast?.error(u(e,"section_update_failed")),d=[{label:u(e,"static_section_insertable"),icon:i?_i:bi,onPick:()=>{ne(),Qt(e,{handle:n,hidden:!i}).then(()=>{e.Statamic?.$toast?.success(u(e,i?"section_shown_to_editors":"section_hidden_from_editors",{name:a})),gt(e)}).catch(r)}}];return s.static&&d.push({label:u(e,"section_add_fields"),onPick:()=>{ne(),Qt(e,{handle:n,fields:!0}).then(()=>{e.Statamic?.$toast?.success(u(e,"section_fields_added",{name:a})),gt(e),I(e),xo(e,n)}).catch(r)}}),d}function Ti(e,t,s){const n=s.row?.section||s.uid;n&&(me=ke(e.document,At,{items:[...Yo(e,n),{label:u(e,"html_tree_remove_section"),danger:!0,onPick:()=>{ne(),Xo(e,n)}}],x:t.clientX,y:t.clientY,onClose:()=>{me=null}}))}function xi(e,t,s){ne();const n=o.sections?.find(d=>d.row?.id===s);if(n){Ti(e,t,n);return}const a=o.rows.find(d=>d.id===s);if(!a)return;et(e,s,o.rows);const i={x:t.clientX,y:t.clientY},r=d=>{d.length&&(me?.dismiss(),me=ke(e.document,At,{items:d,x:i.x,y:i.y,onClose:()=>{me=null}}))};if(a.kind==="component"){Si(e,a,r);return}a.kind!=="slot"&&o.canEdit&&r([...a.sectionRoot?Yo(e,a.sectionRoot):[],{label:u(e,"component_make"),onPick:()=>{ne(),Xr(e,a,{onDone:()=>I(e),onError:d=>{e.alert(d?.status===409?u(e,"component_exists"):u(e,"component_failed"))}})}}])}const mo=(e,t)=>{ne(),T("dock:open-template",t)};function Si(e,t,s){if(!es(t.src)){s([{label:u(e,"component_open_named",{name:t.name||t.src}),onPick:()=>mo(e,`view:partials/${t.src}`)}]);return}s([{label:u(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const a=Array.isArray(n.items)?n.items:[];s(a.length?a.map(i=>({label:u(e,"component_open_named",{name:i.label}),onPick:()=>mo(e,i.type)})):[{label:u(e,"component_none"),onPick:null}])}).catch(()=>s([{label:u(e,"component_none"),onPick:null}]))}function wi(e,t,s){if(t.button!==0||T("dock:is-locked")||o.editingId||t.target?.closest?.("button, input"))return;je(),fe=s,He={x:t.clientX,y:t.clientY},Xe=t.currentTarget,Ye=t.pointerId;const n=i=>Ci(e,i),a=i=>$i(e,i);Tt=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),Tt=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function Ci(e,t){if(!fe||!He)return;const s=t.clientX-He.x,n=t.clientY-He.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{Xe?.setPointerCapture?.(Ye)}catch{}}t.preventDefault();const a=e.document.elementFromPoint(t.clientX,t.clientY),i=a?.closest?.("[data-sve-ht-slot]");if(i){const c=i.getAttribute("data-sve-ht-id");if(c&&c!==fe){o.dropId=c,o.dropPlace="inside";return}}const r=a?.closest?.("[data-sve-ht-row]"),d=r?.getAttribute("data-sve-ht-id");if(!d||d===fe){o.dropId=null,o.dropPlace=null;return}const p=o.rows.find(c=>c.id===d),y=o.rows.find(c=>c.id===fe);if(!p||p.context||y&&p.path.startsWith(`${y.path}/`)){o.dropId=null,o.dropPlace=null;return}const g=r.getBoundingClientRect();o.dropId=d,o.dropPlace=is(t.clientY-g.top,g.height,!$o(p.tag)&&!Co(p))}function $i(e,t){const s=fe,n=o.dropId,a=o.dropPlace||"after",i=o.dragging;if(je(),i&&(ge=!0,e.setTimeout(()=>{ge=!1},0)),!i||T("dock:is-locked")||!s||!n||s===n)return;t?.preventDefault?.();const r=U(),d=ls(r,Oe,s,n,a);d!==r&&$e(d)}function je(){try{Xe?.releasePointerCapture?.(Ye)}catch{}Tt?.(),fe=null,He=null,Xe=null,Ye=null,o.dragging=!1,o.dropId=null,o.dropPlace=null}function Li(e,t,s){if(t.button!==0||!s||o.editingId||t.target?.closest?.("button, input"))return;Wo(),Fe=s,Ie={x:t.clientX,y:t.clientY},We=t.currentTarget,Ze=t.pointerId;const n=i=>Pi(e,i),a=i=>Ei(e,i);xt=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),xt=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function Pi(e,t){if(!Fe||!Ie)return;const s=t.clientX-Ie.x,n=t.clientY-Ie.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{We?.setPointerCapture?.(Ze)}catch{}}t.preventDefault();const i=e.document.elementFromPoint(t.clientX,t.clientY)?.closest?.("[data-sve-ht-sec-uid]"),r=i?.getAttribute("data-sve-ht-sec-uid")||"";if(!r||r===Fe){o.sectionDrop=null;return}const d=i.getBoundingClientRect();o.sectionDrop={uid:r,place:t.clientY-d.top<d.height/2?"before":"after"}}function Ei(e,t){const s=Fe,n=o.sectionDrop,a=o.dragging;Wo(),a&&(ge=!0,e.setTimeout(()=>{ge=!1},0)),!(!a||!s||!n?.uid||n.uid===s)&&(t?.preventDefault?.(),Hi(e,s,n.uid,n.place))}function Wo(){try{We?.releasePointerCapture?.(Ze)}catch{}xt?.(),Fe=null,Ie=null,We=null,Ze=null,o.dragging=!1,o.sectionDrop=null}function Hi(e,t,s,n){const a=Ne(e)||"page_sections";for(const i of ot(e.document)||[]){const r=nt(i.values),d=r&&typeof r=="object"?r[a]:null;if(!Array.isArray(d))continue;const p=b=>d.findIndex(k=>k&&typeof k=="object"&&[k._visual_id,k.id,k._id].includes(b)),y=p(t),g=p(s);if(y===-1||g===-1||y===g)return!1;let c=n==="before"?g:g+1;return y<c&&(c-=1),c===y?!1:(e.postMessage({source:ee,type:Q.MOVE,uid:t,toIndex:c},e.location.origin),e.setTimeout(()=>I(e),60),!0)}return!1}function Zo(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function $t(e,t){if(t?.kind==="component"){Ii(e,t);return}if(Y.callOpen&&(Y.callOpen=!1,Y.callStore=null,z.forget(),Mt(e)),t?.kind!=="antlers"){o.inspect=null;return}const s=t.id;if(t.tag==="else"){o.inspect={key:s,title:u(e,"antlers_condition"),mode:"note",note:u(e,"antlers_else_note")};return}if(t.antlers==="loop"){const n=t.loopKind==="collection",a=he?.id===t.id?he.dir:"",i=t.sortDir||a;o.inspect={key:s,title:u(e,"antlers_loop"),mode:"loop",loopKind:n?"collection":"field",kinds:[{id:"field",label:u(e,"antlers_loop_field")},{id:"collection",label:u(e,"antlers_loop_collection")}],collections:Zo(e),value:t.expr||"",placeholder:u(e,n?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:u(e,"antlers_sort"),dir:i,needsField:i==="asc"||i==="desc",field:t.sortField||"",pickable:!n,placeholder:u(e,n?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:u(e,"antlers_sort_none")},{id:"asc",label:u(e,"antlers_sort_asc")},{id:"desc",label:u(e,"antlers_sort_desc")},{id:"random",label:u(e,"antlers_sort_random")}]},limit:{title:u(e,"antlers_limit"),value:t.limit||"",placeholder:u(e,"antlers_limit_placeholder")},branches:[]};return}o.inspect={key:s,title:u(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:u(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:u(e,"antlers_add_elseif")},{id:"else",label:u(e,"antlers_add_else")}]}}function Ii(e,t){if(!ts(e)){o.inspect=null;return}if(!t.src)return;const s=t.id;if(o.inspect={key:s,title:u(e,"component_props_values"),mode:"note",note:u(e,"code_dock_loading")},os()){const n={},a={},i=new Map;for(const[r,d]of ns(U().slice(t.from,t.to))){const p=ss(r);p&&(r!==p||!i.has(p))&&i.set(p,d)}for(const[r,d]of i)d.bound?a[r]=d.value:n[r]=d.value;ro!==s&&(ro=s,De.clear());for(const r of De)r in a||(a[r]="");o.inspect=null,Y.callOpen=!0,Y.title=Y.title||u(e,"component_props"),Y.callTitle=t.klass||t.name||t.src,Y.callStore=z.ui,z.ui.canBind=!0,z.ui.dataTitle=u(e,"data_vars_title"),z.ui.exprPlaceholder=u(e,"component_props_expr"),z.ui.onToggleBind=(r,d)=>Mi(e,r,d),z.ui.onExpr=(r,d)=>vo(e,r,d),z.ui.onPickData=(r,d)=>T("dock:data-menu",{anchor:d,at:t.from,onPick:p=>vo(e,r,String(p?.var||"").trim())}),z.load(e,{key:`${t.src}::${s}`,src:t.src,params:n,bindings:a,readOnly:T("dock:is-locked")===!0}),z.watch(e,{src:t.src,write:r=>Ai(e,r,a)}),Mt(e);return}as(e,t.src).then(n=>{if(o.inspect?.key===s){if(!n.length){o.inspect={key:s,title:u(e,"component_props_values"),mode:"note",note:u(e,"component_props_values_none")};return}o.inspect={key:s,title:u(e,"component_props_values"),mode:"props",inheritLabel:u(e,"component_props_inherit"),rows:rs(n,U().slice(t.from,t.to))}}})}function Ai(e,t,s={}){const n=o.rows.find(r=>r.id===F);if(n?.kind!=="component"||T("dock:is-locked"))return;let a=U(),i=n.to;for(const[r,d]of Object.entries(t||{})){if(r in s)continue;const p=a.length,y=Rt(a,{from:n.from,to:i},r,d);y!==a&&(i+=y.length-p,a=y)}a!==U()&&($e(a,{save:!0}),I(e))}function Mi(e,t,s){s?De.add(t):De.delete(t),Jo(e,t,"",s),I(e)}function vo(e,t,s){De.add(t),Jo(e,t,s,!0),I(e)}function Jo(e,t,s,n){const a=o.rows.find(d=>d.id===F);if(a?.kind!=="component"||T("dock:is-locked"))return;const i=U(),r=Rt(i,a,t,s,{bound:n});r!==i&&$e(r,{save:!0})}function Qe(){const e=o.rows.find(t=>t.id===F);return e?.kind==="antlers"&&!T("dock:is-locked")?e:null}function ve(e,t){const s=Qe();if(!s)return;const n=U(),a=t(n,s);a!==n&&($e(a),I(e))}function go(e,t,s,n){const a=o.rows.find(d=>d.id===F);if(a?.kind!=="component"||T("dock:is-locked"))return;const i=U(),r=Rt(i,a,t,s,{bound:n});r!==i&&($e(r,{save:!0}),I(e))}function Ri(e,t){ve(e,(s,n)=>n.antlers==="loop"?kt(s,n,n.loopKind==="collection"?"collection":"field",t):Yr(s,n,t))}function Di(e,t){const s=Qe();if(!s||s.antlers!=="loop")return;const n=s.loopKind==="collection"?"collection":"field";if(t!==n){if(t==="collection"){const a=Zo(e)[0]?.handle;if(!a)return;ve(e,(i,r)=>kt(i,r,"collection",a));return}ve(e,(a,i)=>kt(a,i,"field",i.handle||"items"))}}function Oi(e,t){ve(e,(s,n)=>ei(s,n,t))}function Fi(e,t){if(!e||!t||Co(t)||$o(t.tag))return null;const s=Qn(e,t);if(s<t.openTo)return null;const n=e.lastIndexOf(`
`,s-1)+1;return e.slice(n,s).trim()===""&&n>t.openTo?n-1:s}function et(e,t,s){if(ge)return;const n=(s||o.rows).find(a=>a.id===t);n&&(F=t,o.rows.forEach(a=>{a.current=a.id===t}),$t(e,n),!Ft()&&(T("dock:reveal-html",{from:n.from,to:n.to,caret:Fi(U(),n)}),T("dock:tw-follow"),ce({source:ee,type:Q.SVE_HTML_PICK_FOCUS,path:n.path},e)))}function Bi(e,t){if(!t)return"";const s=[],n=(a,i)=>{for(const r of a||[]){const d=i||r.path===e;r.kind==="component"&&r.src===t&&s.push({path:r.path,inside:d}),n(r.children,d)}};return n(Oe,!1),(s.find(a=>a.inside)||s[0])?.path||""}function Ni(e,t){if(!t||!W(e.document))return;Ce=!1,Ct(t),I(e);const s=o.rows.find(n=>n.path===t);s&&(et(e,s.id,o.rows),e.setTimeout(()=>{W(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function Lt(e){if(ze)return;const t=()=>{o.editingId||o.dragging||(e.clearTimeout(Ue),Ue=e.setTimeout(()=>{W(e.document)&&I(e)},80))},s=()=>{if(t(),T("dock:on-empty-page")===!0){const n=rt(e,e.document);n[0]&&it(e,e.document,n,n[0].uid,"")}};ze=To("dock:html-changed",t),e.document.addEventListener("sve-page-structure",s),_t=()=>{e.document.removeEventListener("sve-page-structure",s)}}function ji(e){ze?.(),ze=null,_t?.(),_t=null,e?.clearTimeout?.(Ue),Ue=0}function jt(e){const t=W(e.document);if(ce({source:ee,type:Q.SVE_HTML_PICK,on:!1},e),ji(e),z.forget(),Y.callOpen=!1,Y.callStore=null,Mt(e),je(),ne(),Yn(e),F=null,o.inspect=null,o.editingId=null,o.draft="",o.sections=[],o.pageBuilder=!1,J="",e?.clearTimeout?.(we),!t){vt(e);return}t.remove(),Et.headerTab==="html_tree"&&Bn(e,null),xn(e),yo(e),ko(e),vt(e)}function Zi(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=qe,Ke(t,Io,{title:u(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>jt(e)))}function Ji(e){Lt(e),I(e)}function Qo(e){const t=e.document;if(!wn(e,"html_tree"))return;if(W(t)){Lt(e),I(e);return}if(!Vo(t))return;Ce=!0,K.clear(),Cn(e,[qe]);const s=t.createElement("div");s.id=qe,s.style.cssText=$n,Ke(s,Io,{title:u(e,"html_tree")}),s.querySelector("[data-sve-close]")?.addEventListener("click",()=>jt(e)),Ln(e,s),yo(e),ko(e),vt(e),Lt(e),I(e)}function Qi(e){if(W(e.document)){jt(e);return}Qo(e)}It("html-tree:open-section",e=>{const t=window,s=t.document,n=rt(t,s),a=n.find(i=>i.uid===e||i.ids.includes(e));return a?(it(t,s,n,a.uid,""),{uid:a.uid,ids:a.ids}):null});It("html-tree:from-preview",({path:e,src:t}={})=>{So(window,e)||Ni(window,Bi(e,t)||e)});It("html-tree:arm-pick",e=>{const t=window;return e?(Uo(t,at(U())),!0):(W(t.document)||ce({source:ee,type:Q.SVE_HTML_PICK,on:!1},t),!0)});function el(){de.clear(),Se.clear(),ye.length=0}export{ti as HTML_TREE_STYLE_ID,Wi as armHtmlTreePrefetch,el as clearHtmlTreeTemplates,ne as closeHtmlTreeMenu,jt as closeHtmlTreePanel,oi as ensureHtmlTreeStyles,Zi as fillHtmlTreePane,F as htmlTreeActiveId,W as htmlTreePanel,Ue as htmlTreeTimer,ze as htmlTreeUnhook,Qo as openHtmlTreePanel,I as renderHtmlTree,Ji as showHtmlTreePane,ji as stopWatchHtmlTreeDock,Qi as toggleHtmlTreePanel,Lt as watchHtmlTreeDock};
