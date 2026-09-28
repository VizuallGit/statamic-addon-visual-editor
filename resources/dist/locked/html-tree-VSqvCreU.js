const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-AWaJHJyk.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{_ as je,I as j,J as un,K as Ie,o as f,k as g,l as L,G as C,m as P,F as D,L as fe,n as N,b3 as hn,x as $,O as bt,b4 as pn,a as x,t as u,A as be,C as fn,b5 as mn,b6 as Co,z as Mt,b7 as eo,b8 as to,b9 as vn,ba as gn,bb as yn,bc as kn,bd as it,D as de,au as bn,be as o,u as l,w as Tn,v as _n,M as ie,bf as xn,B as Sn,bg as X,bh as wn,bi as Cn,H as Ae,j as he,bj as $n,bk as Ln,bl as oo,N as Pn,Q as En,s as Rt,av as Tt,ar as Hn,aP as $o,aQ as Lo,i as In,am as no,a1 as Ue,X as An,aO as Mn,as as Rn,at as Dn,a9 as Fn,bm as On,bn as ao,bo as Po,a0 as Eo,bp as Bn,E as Ho,aa as lt,T as Dt,U as Ft,az as dt,aA as Fe,S as Ot,bq as Nn,br as Vn,bs as jn,bt as Kn,aS as qn,aT as Gn,ay as zn,bu as Un,a$ as Xn,al as Bt,aL as Yn,aG as Wn}from"./addon-X4Khb7xh.js";import{M as ee,S as te}from"./protocol-Brvy2KuB.js";import{canEditFields as Zn,currentSetHandle as Jn,openFieldsetOverlay as Io,openGlobalFieldsOverlay as Qn}from"./section-fields-C6a3uvE2.js";import{H as Xe,ad as ea}from"./ai-text-icon-CaHMo9Tt.js";import{F as Y,G as ta,I as Nt,J as oa,t as na,K as Vt,x as aa,B as sa,d as ct,m as so,L as Ao,s as ra,M as Mo,H as Se,N as ia,O as jt,c as la,Q as Ro,R as Do,S as da,h as ca,a as ua,T as ha,U as pa,V as fa,W as ma,X as va,Y as ga,Z as ya,$ as ka,a0 as ba,a1 as Ta}from"./tw-classes-BrZiZcLx.js";import{b as _a}from"./html-pick-align-CLq5l-p4.js";import"./FieldsetOverlay-a-3DlsnB.js";const xa={class:"sve-dialog__title"},Sa={for:"sve-new-section-group"},wa={class:"sve-dialog__row"},Ca=["disabled"],$a=["value"],La=["title","aria-label"],Pa={key:0,class:"sve-dialog__add-group"},Ea={for:"sve-new-section-group-name"},Ha={class:"sve-dialog__row"},Ia=["placeholder","disabled"],Aa=["disabled"],Ma=["disabled"],Ra={for:"sve-new-section-name"},Da=["placeholder"],Fa={key:1,class:"sve-dialog__toggle"},Oa={key:2,class:"sve-dialog__note"},Ba={class:"sve-dialog__actions"},Na=["disabled"],Va=["disabled"],ja={__name:"NewSectionPrompt",props:{heading:{type:String,required:!0},groupLabel:{type:String,required:!0},nameLabel:{type:String,required:!0},placeholder:{type:String,default:""},note:{type:String,default:""},groups:{type:Array,required:!0},toggleLabel:{type:String,default:""},toggleOn:{type:Boolean,default:!0},cancelLabel:{type:String,required:!0},saveLabel:{type:String,required:!0},onOk:{type:Function,required:!0},onClose:{type:Function,required:!0},addGroupLabel:{type:String,default:""},addGroupNameLabel:{type:String,default:""},addGroupPlaceholder:{type:String,default:""},onAddGroup:{type:Function,default:null}},setup(e){const t=e,a=j(""),n=j([...t.groups]),s=j(t.groups[0]?.key??""),i=j(!1),r=j(""),d=j(null),p=j(!1);function k(){i.value=!0,r.value="",Ie(()=>d.value?.focus())}function v(){i.value=!1,r.value="",Ie(()=>b.value?.focus())}async function h(){const E=r.value.trim();if(!E||p.value||!t.onAddGroup){d.value?.focus();return}p.value=!0;const M=await t.onAddGroup(E);if(p.value=!1,!M?.key){d.value?.focus();return}n.value.some(F=>F.key===M.key)||n.value.push(M),s.value=M.key,i.value=!1,r.value="",Ie(()=>b.value?.focus())}function y(E){E.key==="Enter"?(E.preventDefault(),h()):E.key==="Escape"&&(E.stopPropagation(),v())}const _=j(t.toggleOn),b=j(null),R=j(!1);un(()=>Ie(()=>b.value?.focus()));function T(){const E=a.value.trim();if(!E||n.value.length&&!s.value||R.value){b.value?.focus();return}R.value=!0,t.onOk(E,s.value,_.value)}function m(E){E.target===E.currentTarget&&t.onClose()}function S(E){E.key==="Enter"?T():E.key==="Escape"&&t.onClose()}return(E,M)=>(f(),g("div",{class:"sve-dialog-overlay",onClick:m},[L("div",{class:"sve-dialog",onClick:M[5]||(M[5]=C(()=>{},["stop"]))},[L("div",xa,P(e.heading),1),n.value.length?(f(),g(D,{key:0},[L("label",Sa,P(e.groupLabel),1),L("div",wa,[fe(L("select",{id:"sve-new-section-group","onUpdate:modelValue":M[0]||(M[0]=F=>s.value=F),disabled:i.value,onKeydown:S},[(f(!0),g(D,null,N(n.value,F=>(f(),g("option",{key:F.key,value:F.key},P(F.display),9,$a))),128))],40,Ca),[[hn,s.value]]),e.onAddGroup&&!i.value?(f(),g("button",{key:0,type:"button",class:"is-add",title:e.addGroupLabel,"aria-label":e.addGroupLabel,"data-sve-new-group":"",onClick:k},[...M[6]||(M[6]=[L("span",{"aria-hidden":"true"},"+",-1)])],8,La)):$("",!0)]),i.value?(f(),g("div",Pa,[L("label",Ea,P(e.addGroupNameLabel||e.addGroupLabel),1),L("div",Ha,[fe(L("input",{id:"sve-new-section-group-name",ref_key:"groupInput",ref:d,"onUpdate:modelValue":M[1]||(M[1]=F=>r.value=F),type:"text",placeholder:e.addGroupPlaceholder,disabled:p.value,"data-sve-new-group-name":"",onKeydown:y},null,40,Ia),[[bt,r.value]]),L("button",{type:"button",class:"is-primary is-small",disabled:p.value,"data-sve-new-group-create":"",onClick:h},P(e.saveLabel),9,Aa),L("button",{type:"button",class:"is-cancel is-small",disabled:p.value,onClick:v},P(e.cancelLabel),9,Ma)])])):$("",!0)],64)):$("",!0),L("label",Ra,P(e.nameLabel),1),fe(L("input",{id:"sve-new-section-name",ref_key:"input",ref:b,"onUpdate:modelValue":M[2]||(M[2]=F=>a.value=F),type:"text",placeholder:e.placeholder,onKeydown:S},null,40,Da),[[bt,a.value]]),e.toggleLabel?(f(),g("label",Fa,[fe(L("input",{"onUpdate:modelValue":M[3]||(M[3]=F=>_.value=F),type:"checkbox",onKeydown:S},null,544),[[pn,_.value]]),L("span",null,P(e.toggleLabel),1)])):$("",!0),e.note?(f(),g("p",Oa,P(e.note),1)):$("",!0),L("div",Ba,[L("button",{type:"button",class:"is-cancel",disabled:R.value,onClick:M[4]||(M[4]=(...F)=>e.onClose&&e.onClose(...F))},P(e.cancelLabel),9,Na),L("button",{type:"button",class:"is-primary",disabled:R.value,onClick:T},P(e.saveLabel),9,Va)])])]))}},Fo=je(ja,[["__scopeId","data-v-6501522a"]]),Kt="/!/sve/section-types",ro="static_sections";async function Ka(e){const t=await e.fetch(`${Kt}?${mn(e)}`,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!t.ok)throw new Error(`section-types ${t.status}`);const a=await t.json();if(Array.isArray(a.groups)&&a.groups.length)return a.groups.filter(s=>s&&s.handle&&s.handle!==ro).map(s=>({key:s.handle,display:s.display||s.handle}));const n=new Map;for(const s of a.types||[])s?.group&&s.group!==ro&&!n.has(s.group)&&n.set(s.group,s.group_display||s.group);return[...n].map(([s,i])=>({key:s,display:i}))}async function qa(e,t){const a=await e.fetch(`${Kt}/groups`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Mt(e),"X-Requested-With":"XMLHttpRequest",Accept:"application/json"},body:JSON.stringify({display:t,...Co(e)})}),n=await a.json().catch(()=>({}));if(!a.ok||!n.group?.handle)throw new Error(n?.error==="bad_name"?"bad_name":`section-types/groups ${a.status}`);return e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale")),{key:n.group.handle,display:n.group.display||n.group.handle}}const Oe=new Map;function Ga(e){e?.handle&&Oe.set(e.handle,{static:!!e.static,hidden:!!e.hidden})}function za(e,t){return t?Oe.has(t)?Oe.get(t).static:e.Statamic?.$config?.get?.("sveSetMeta")?.[t]?.static===!0:!1}function Ua(e,t){if(!t)return!1;if(Oe.has(t))return Oe.get(t).hidden;const a=e.Statamic?.$config?.get?.("sveSectionTypes");return Array.isArray(a)&&a.some(n=>n?.handle===t&&n.hidden===!0)}async function Oo(e,t,a){const n=await e.fetch(Kt,{method:t,headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Mt(e),Accept:"application/json"},credentials:"same-origin",body:JSON.stringify({...a,...Co(e)})}),s=await n.json().catch(()=>({}));if(!n.ok){const i=new Error(s.error||`section-types ${n.status}`);throw i.reason=s.error,i}return Ga(s.section),s}function Xa(e,{display:t,group:a="",static:n=!1,hidden:s=!1}){return Oo(e,"POST",{display:t,group:a,static:n,hidden:s})}function io(e,{handle:t,hidden:a,fields:n=!1}){const s={handle:t,fields:n};return typeof a=="boolean"&&(s.hidden=a),Oo(e,"PATCH",s)}async function Ya(e,t,a=null,n=null){if(!t||typeof eo!="function"||typeof to!="function")return null;const s=await eo(e,t);if(!s)return null;n&&Array.isArray(s.definitions)&&vn(t,{display:n.display||t,icon:n.icon||null,hide:n.hidden===!0,fields:s.definitions,group_display:n.group_display||n.group||""},n.group||"");const i=gn(),r=yn(e,"page",{handle:t},s?.defaults,i),d=kn(r,s?.new||{},s?.defaults);return to(e,e.document,a,r,d)?r:null}const lo=700,Wa=17;function Za(e,t){const a=(t||[]).filter(Boolean);if(!a.length)return;let n=0;const s=()=>{n+=1;const i=it(e),r=i?a.some(d=>i.querySelector(`[data-sid="${CSS.escape(d)}"]`)):!0;r&&de({source:te,type:ee.SVE_ACTIVATE,ids:a},e),(r?!i&&n<6:n<Wa)&&e.setTimeout(s,lo)};e.setTimeout(s,lo)}function Bo(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function Ja(e){return new Promise(t=>{let a=!1;const n=i=>{a||(a=!0,s.dismiss(),t(i==="static"||i==="fields"?i:null))},s=be(e.document,fn,{title:u(e,"section_new_kind"),body:u(e,"section_new_kind_note"),buttons:[{value:"cancel",label:u(e,"cancel"),variant:"ghost"},{value:"static",label:u(e,"section_new_static"),variant:"primary"},{value:"fields",label:u(e,"section_new_with_fields"),variant:"primary"}],onPick:n,onClose:()=>n(null)})})}const Qa=`<section class="[ ] py-800">
    
</section>
`;function es(e){if(x("dock:is-locked")===!0)return e.Statamic?.$toast?.error(u(e,"code_dock_locked")),!1;const a=`${String(x("dock:html")||"").replace(/\s+$/,"")}

${Qa}`;return x("dock:set-html",a)!==!0?(e.Statamic?.$toast?.error(u(e,"section_new_failed")),!1):(x("dock:save-now"),e.Statamic?.$toast?.success(u(e,"section_new_template_done")),!0)}async function No(e,t,a,{afterUid:n,onDone:s,onError:i}){try{const r=await Xa(e,a);t.dismiss(),e.Statamic?.$toast?.success(u(e,"section_created",{name:r.section?.display||a.display})),_t(e);const d=r.section?.handle?{...r.section,group_display:(r.section_types||[]).find(k=>k?.handle===r.section.handle)?.group_display||""}:null,p=await Ya(e,r.section?.handle,n,d);!p&&r.section?.handle&&x("dock:open-template",r.section.handle),s?.({...r,uid:p?._visual_id||""})}catch(r){t.dismiss(),e.Statamic?.$toast?.error(u(e,r.reason==="bad_name"?"section_new_bad_name":"section_new_failed")),i?.(r)}}function _t(e){e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"))}function ts(e,{afterUid:t=null,onDone:a,onError:n,onClose:s}={}){const i=be(e.document,Fo,{heading:u(e,"static_section_new"),groupLabel:"",nameLabel:u(e,"section_new_name"),placeholder:u(e,"section_new_placeholder"),note:u(e,"static_section_note"),groups:[],toggleLabel:u(e,"static_section_insertable"),cancelLabel:u(e,"cancel"),saveLabel:u(e,"section_new_create"),onClose:s,onOk:(r,d,p)=>{No(e,i,{display:r,static:!0,hidden:!p},{afterUid:t,onDone:a,onError:n})}})}function os(e,{afterUid:t=null,onDone:a,onError:n,onClose:s}={}){(async()=>{let i=[];try{i=await Ka(e)}catch(d){n?.(d),e.Statamic?.$toast?.error(u(e,"section_new_failed"));return}if(!i.length){n?.(new Error("no groups")),e.Statamic?.$toast?.error(u(e,"section_new_failed"));return}const r=be(e.document,Fo,{heading:u(e,"section_new"),groupLabel:u(e,"section_new_group"),nameLabel:u(e,"section_new_name"),placeholder:u(e,"section_new_placeholder"),note:u(e,"section_new_note"),groups:i,addGroupLabel:u(e,"section_new_group_add"),addGroupNameLabel:u(e,"section_new_group_name"),addGroupPlaceholder:u(e,"section_new_group_placeholder"),onAddGroup:async d=>{try{const p=await qa(e,d);return e.Statamic?.$toast?.success(u(e,"section_group_created",{name:p.display})),p}catch(p){return e.Statamic?.$toast?.error(u(e,p?.message==="bad_name"?"section_new_bad_name":"section_group_failed")),null}},cancelLabel:u(e,"cancel"),saveLabel:u(e,"section_new_create"),onClose:s,onOk:(d,p)=>{No(e,r,{display:d,group:p},{afterUid:t,onDone:a,onError:n})}})})()}const ns={key:0,class:"sve-ht-inspect"},as={class:"sve-ht-inspect__head"},ss={key:0,class:"sve-ht-inspect__note"},rs={key:2,class:"sve-ht-inspect__props"},is={class:"sve-ht-inspect__proplabel"},ls={key:0},ds=["value","disabled","onChange"],cs={value:""},us=["value"],hs=["value"],ps=["value","placeholder","onChange"],fs=["title","disabled","onClick"],ms=["title","disabled","onClick"],vs={key:0,class:"sve-ht-inspect__seg"},gs=["data-active","disabled","onClick"],ys=["value","disabled"],ks={key:0,value:""},bs=["value"],Ts={key:2,class:"sve-ht-inspect__box"},_s=["value","placeholder","disabled","onKeydown"],xs=["title","disabled"],Ss={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},ws=["value","disabled"],Cs=["value"],$s={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},Ls=["value","placeholder","disabled"],Ps=["title","disabled"],Es={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Hs=["value","placeholder","disabled"],Is={key:4,class:"sve-ht-inspect__add"},As=["disabled","onClick"],ft='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',Ms='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',Rs={__name:"HtmlTreeInspector",setup(e){const t=j(null);bn(t,k=>o.onPropHost?.(k||null));const a=j(null),n=j(null);function s(k){o.onInspectCommit?.(k.target.value)}function i(k,v,h){!k||!v||(k.value=v,k.focus(),k.setSelectionRange(v.length,v.length),h(v))}function r(k,v){o.onInspectData?.(k.currentTarget,h=>o.onPropValue?.(v.handle,h,!0))}function d(k){o.onInspectData?.(k.currentTarget,v=>i(a.value,v,h=>o.onInspectCommit?.(h)))}function p(k){o.onInspectData?.(k.currentTarget,v=>i(n.value,v,h=>o.onLoopSortField?.(h)))}return(k,v)=>l(o).inspect?(f(),g("div",ns,[L("div",as,P(l(o).inspect.title),1),l(o).inspect.mode==="note"?(f(),g("div",ss,P(l(o).inspect.note),1)):l(o).inspect.mode==="statamic"?(f(),g("div",{key:1,ref_key:"propHost",ref:t,class:"sve-ht-inspect__form"},null,512)):l(o).inspect.mode==="props"?(f(),g("div",rs,[(f(!0),g(D,null,N(l(o).inspect.rows,h=>(f(),g("label",{key:h.handle,class:"sve-ht-inspect__prop"},[L("span",is,[Tn(P(h.label)+" ",1),h.bound?(f(),g("em",ls,":")):$("",!0)]),L("span",{class:_n(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":h.type==="select"||h.type==="link"}])},[h.type==="select"&&!h.bound?(f(),g("select",{key:0,value:h.value,disabled:!l(o).canEdit,onChange:y=>l(o).onPropValue?.(h.handle,y.target.value,!1)},[L("option",cs,P(h.placeholder||l(o).inspect.inheritLabel),1),h.value&&!h.options.includes(h.value)?(f(),g("option",{key:0,value:h.value},P(h.value),9,us)):$("",!0),(f(!0),g(D,null,N(h.options,y=>(f(),g("option",{key:y,value:y},P(y),9,hs))),128))],40,ds)):(f(),g("input",{key:1,type:"text",value:h.value,placeholder:h.placeholder||l(o).inspect.inheritLabel,onChange:y=>l(o).onPropValue?.(h.handle,y.target.value,h.bound)},null,40,ps)),h.type==="link"?(f(),g("button",{key:2,type:"button","data-sve-ht-data":"",title:l(o).pageTitle,disabled:!l(o).canEdit,onClick:y=>l(o).onPropPage?.(y.currentTarget,h.handle),innerHTML:Ms},null,8,fs)):$("",!0),L("button",{type:"button","data-sve-ht-data":"",title:l(o).dataTitle,disabled:!l(o).canEdit,onClick:y=>r(y,h),innerHTML:ft},null,8,ms)],2)]))),128))])):(f(),g(D,{key:3},[l(o).inspect.mode==="loop"?(f(),g("div",vs,[(f(!0),g(D,null,N(l(o).inspect.kinds,h=>(f(),g("button",{key:h.id,type:"button","data-active":h.id===l(o).inspect.loopKind?"":void 0,disabled:!l(o).canEdit,onClick:y=>l(o).onLoopKind?.(h.id)},P(h.label),9,gs))),128))])):$("",!0),l(o).inspect.mode==="loop"&&l(o).inspect.loopKind==="collection"?(f(),g("select",{key:l(o).inspect.key+":"+l(o).inspect.value,value:l(o).inspect.value,disabled:!l(o).canEdit,onChange:s},[l(o).inspect.value?$("",!0):(f(),g("option",ks,P(l(o).inspect.placeholder),1)),(f(!0),g(D,null,N(l(o).inspect.collections,h=>(f(),g("option",{key:h.handle,value:h.handle},P(h.title),9,bs))),128))],40,ys)):(f(),g("div",Ts,[(f(),g("input",{ref_key:"field",ref:a,key:l(o).inspect.key,type:"text",value:l(o).inspect.value,placeholder:l(o).inspect.placeholder,disabled:!l(o).canEdit,spellcheck:"false",onKeydown:[v[0]||(v[0]=C(()=>{},["stop"])),ie(C(s,["prevent"]),["enter"])],onBlur:s},null,40,_s)),L("button",{type:"button","data-sve-ht-data":"",title:l(o).dataTitle,disabled:!l(o).canEdit,innerHTML:ft,onMousedown:v[1]||(v[1]=C(()=>{},["prevent"])),onClick:C(d,["stop","prevent"])},null,40,xs)])),l(o).inspect.sort?(f(),g(D,{key:3},[L("div",Ss,P(l(o).inspect.sort.title),1),(f(),g("select",{key:l(o).inspect.key+":dir:"+l(o).inspect.sort.dir,value:l(o).inspect.sort.dir,disabled:!l(o).canEdit,onChange:v[2]||(v[2]=h=>l(o).onLoopSortDir?.(h.target.value))},[(f(!0),g(D,null,N(l(o).inspect.sort.dirs,h=>(f(),g("option",{key:h.id,value:h.id},P(h.label),9,Cs))),128))],40,ws)),l(o).inspect.sort.needsField?(f(),g("div",$s,[(f(),g("input",{ref_key:"sortField",ref:n,key:l(o).inspect.key+":field",type:"text",value:l(o).inspect.sort.field,placeholder:l(o).inspect.sort.placeholder,disabled:!l(o).canEdit,spellcheck:"false",onKeydown:[v[3]||(v[3]=C(()=>{},["stop"])),v[4]||(v[4]=ie(C(h=>l(o).onLoopSortField?.(h.target.value),["prevent"]),["enter"]))],onBlur:v[5]||(v[5]=h=>l(o).onLoopSortField?.(h.target.value))},null,40,Ls)),l(o).inspect.sort.pickable?(f(),g("button",{key:0,type:"button","data-sve-ht-data":"",title:l(o).dataTitle,disabled:!l(o).canEdit,innerHTML:ft,onMousedown:v[6]||(v[6]=C(()=>{},["prevent"])),onClick:C(p,["stop","prevent"])},null,40,Ps)):$("",!0)])):$("",!0),L("div",Es,P(l(o).inspect.limit.title),1),(f(),g("input",{key:l(o).inspect.key+":limit",type:"number",min:"1",value:l(o).inspect.limit.value,placeholder:l(o).inspect.limit.placeholder,disabled:!l(o).canEdit,onKeydown:[v[7]||(v[7]=C(()=>{},["stop"])),v[8]||(v[8]=ie(C(h=>l(o).onLoopLimit?.(h.target.value),["prevent"]),["enter"]))],onBlur:v[9]||(v[9]=h=>l(o).onLoopLimit?.(h.target.value))},null,40,Hs))],64)):$("",!0),l(o).inspect.branches?.length?(f(),g("div",Is,[(f(!0),g(D,null,N(l(o).inspect.branches,h=>(f(),g("button",{key:h.id,type:"button",disabled:!l(o).canEdit,onClick:y=>l(o).onAddBranch?.(h.id)},P(h.label),9,As))),128))])):$("",!0)],64))])):$("",!0)}},Ds=je(Rs,[["__scopeId","data-v-26254b75"]]),Fs={class:"sve-html-tree"},Os={class:"sve-pane-bar","data-sve-pane-bar":""},Bs={"data-sve-right-title":""},Ns={"data-sve-right-actions":""},Vs=["aria-pressed","title","aria-label"],js={class:"sve-ht-tools"},Ks=["title"],qs=["placeholder","aria-label","value"],Gs=["aria-label"],zs=["title","aria-label"],Us={key:1,class:"sve-tree-exit"},Xs=["title"],Ys=["title"],Ws='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',Zs='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',Js='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',Qs='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',er={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const t=u(window,"html_tree_search");o.layers=xn(window);const a=u(window,"html_tree_layers_on"),n=u(window,"html_tree_layers_off");function s(){Cn(window,!o.layers)}const i=Bo(window),r=u(window,"section_new"),d=j(!1);function p(){d.value=!1}async function k(y){if(!y)return;await Ie(),o.onRefresh?.();const _=x("html-tree:open-section",y);_&&Za(window,_.ids)}function v(){d.value||(d.value=!0,(async()=>{if(!(o.sections.length||o.pageBuilder)){es(window),p();return}const y=await Ja(window);if(!y){p();return}const _=o.sections.length?o.sections[o.sections.length-1].uid:null,b=R=>{p(),k(R?.uid)};if(y==="static"){ts(window,{afterUid:_,onDone:b,onError:p,onClose:p});return}os(window,{afterUid:_,onDone:b,onError:p,onClose:p})})())}function h(y){const _=!!o.query;o.query=y,_!==!!y&&o.onQuery?.()}return(y,_)=>(f(),g("div",Fs,[L("div",Os,[L("div",Bs,P(e.title),1),L("div",Ns,[L("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":l(o).layers?"true":"false",title:l(o).layers?l(n):l(a),"aria-label":l(o).layers?l(n):l(a),innerHTML:Ws,onClick:s},null,8,Vs),_[5]||(_[5]=Sn('<button type="button" data-sve-right-pin aria-pressed="false" data-v-2640030d></button><button type="button" data-sve-close aria-label="Close" data-v-2640030d><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-2640030d><path d="M18 6 6 18" data-v-2640030d></path><path d="m6 6 12 12" data-v-2640030d></path></svg></button>',2))])]),L("div",js,[L("label",{class:"sve-ht-search",title:l(t)},[L("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:Js}),L("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:l(t),"aria-label":l(t),value:l(o).query,autocomplete:"off",spellcheck:"false",onInput:_[0]||(_[0]=b=>h(b.target.value)),onKeydown:[_[1]||(_[1]=C(()=>{},["stop"])),_[2]||(_[2]=ie(C(b=>h(""),["prevent"]),["escape"]))]},null,40,qs),l(o).query?(f(),g("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":l(t),innerHTML:Qs,onClick:_[3]||(_[3]=b=>h(""))},null,8,Gs)):$("",!0)],8,Ks),l(i)&&(l(o).sections.length||l(o).pageBuilder||l(o).rows.length&&!l(o).layoutFile)?(f(),g("button",{key:0,type:"button",class:"sve-ht-new",title:l(r),"aria-label":l(r),innerHTML:Zs,onClick:v},null,8,zs)):$("",!0)]),l(Y).inSidebar?$("",!0):(f(),X(ta,{key:0})),_[6]||(_[6]=L("div",{"data-sve-html-tree-list":""},null,-1)),wn(Ds),l(o).exitOpen&&!l(Y).inSidebar?(f(),g("div",Us,[L("span",{class:"sve-tree-exit__name",title:l(o).exitName},P(l(o).exitName),9,Xs),L("button",{type:"button",class:"sve-tree-exit__go",title:l(o).exitTitle,onClick:_[4]||(_[4]=b=>l(o).onExit?.())},P(l(o).exitLabel),9,Ys)])):$("",!0)]))}},Vo=je(er,[["__scopeId","data-v-2640030d"]]);function jo(e){return String(e||"").trim().toLowerCase()}function xt(e,t){return t?[e.name,e.tag,e.klass,e.label,e.src].filter(a=>typeof a=="string"&&a).join(" ").toLowerCase().includes(t):!0}function tr(e,t){const a=jo(t);if(!a)return{rows:e,hits:new Set};const n=new Set;for(const r of e)xt(r,a)&&n.add(r.path);const s=[...n];return{rows:e.filter(r=>n.has(r.path)||s.some(d=>d.startsWith(`${r.path}/`))),hits:n}}const or=["title"],nr={"data-sve-ht-indent":"","aria-hidden":"true"},ar=["data-sve-ht-cat"],sr={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},rr={key:2,"data-sve-ht-letter":""},ir=["innerHTML"],lr=["title"],dr=["title"],cr={key:1,"data-sve-ht-kind":""},ur={key:3,"data-sve-ht-name":""},hr={key:4,"data-sve-ht-actions":""},pr=["title"],fr={key:5,"data-sve-ht-actions":""},mr=["data-on","title","innerHTML"],vr=["disabled","title","innerHTML"],gr=["disabled","title"],yr=["disabled","title"],kr=["disabled","title"],br=["data-sve-ht-id"],co='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',Tr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',_r='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',xr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',Sr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',wr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',Cr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',$r='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',Lr={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const t=Zn(window),a=u(window,"section_fields");function n(){const T=Jn();if(!T){window.Statamic?.$toast?.error(u(window,"section_fields_none"));return}Io(window,T)}function s(T){return T.synthetic?T.frame==="main"?o.frameMainTitle:T.frame==="template"?o.frameTemplateTitle:o.frameOpenTitle:T.kind==="component"?T.src?`partial:${T.src}`:T.tag:T.name?`${T.tag} ${T.name}`:T.tag}function i(T){return!!T.section}function r(T){return!!T.frame}function d(T){return T.kind==="slot"}function p(T){return!!T.context}function k(T,m){p(m)||r(m)||d(m)||(i(m)?o.onSectionPointerDown?.(T,m.section):m.sectionRoot?o.onSectionPointerDown?.(T,m.sectionRoot):o.onPointerDown?.(T,m.id))}function v(T){if(T.synthetic){o.onFrame?.(T.frame);return}if(i(T)){o.onSection?.(T.section);return}if(p(T)){o.onContextRow?.(T.id);return}o.onSelect?.(T.id)}function h(T,m){const S={"data-sve-ht-id":T.id};return T.current&&(S["data-sve-ht-current"]=""),T.hidden&&(S["data-sve-ht-hidden"]=""),S["data-sve-ht-cat"]=T.cat||"other",S["data-sve-ht-depth"]=String(T.depth),m&&(S["data-sve-ht-dim"]=""),p(T)&&(S["data-sve-ht-context"]=T.context),i(T)&&(S["data-sve-ht-sec"]=""),r(T)&&(S["data-sve-ht-frame"]=T.frame),!i(T)&&o.dropId===T.id&&o.dropPlace&&(S["data-sve-ht-drop"]=o.dropPlace),S}function y(T){return!!T.fixed}function _(T){return!y(T)&&(!T.hidden||T.wrapFrom!=null)}function b(T){return!!T.sectionRoot||!!T.section}function R(T){return o.canEdit||b(T)}return(T,m)=>(f(),g(D,null,[L("div",Ae({"data-sve-ht-row":""},h(e.row,e.dim),{role:"button",tabindex:"0",title:s(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:m[32]||(m[32]=S=>v(e.row)),onDblclick:m[33]||(m[33]=C(S=>e.row.synthetic?l(o).onFrameEnter?.(e.row.frame):r(e.row)||d(e.row)||i(e.row)||p(e.row)?null:l(o).onRename?.(e.row.id),["prevent"])),onKeydown:[m[34]||(m[34]=ie(C(S=>v(e.row),["prevent"]),["enter"])),m[35]||(m[35]=ie(C(S=>v(e.row),["prevent"]),["space"]))],onPointerdown:m[36]||(m[36]=S=>k(S,e.row)),onContextmenu:m[37]||(m[37]=C(S=>r(e.row)||d(e.row)||i(e.row)||p(e.row)?null:l(o).onContext?.(S,e.row.id),["prevent","stop"]))}),[L("span",nr,[(f(!0),g(D,null,N(e.row.guides||[],(S,E)=>(f(),g("i",{key:E,"data-sve-ht-cat":S},null,8,ar))),128))]),e.row.hasChildren||e.row.emptyBlock?(f(),g("button",Ae({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?l(o).mainShut:e.row.shut)?{"data-sve-ht-shut":""}:{},{innerHTML:Tr,onClick:m[0]||(m[0]=C(S=>e.row.synthetic?l(o).onFrameTwist?.():i(e.row)?l(o).onSection?.(e.row.section):l(o).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:m[1]||(m[1]=C(()=>{},["stop"])),onDblclick:m[2]||(m[2]=C(()=>{},["stop"]))}),null,16)):(f(),g("span",sr)),e.row.letter?(f(),g("span",rr,P(e.row.letter),1)):(f(),g("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,ir)),L("span",{"data-sve-ht-text":"",title:l(o).renameTitle},[!e.row.kind&&!i(e.row)&&!p(e.row)&&!r(e.row)?(f(),g("button",{key:0,type:"button","data-sve-ht-tag":"",title:l(o).tagTitle,onClick:m[3]||(m[3]=C(()=>{},["stop","prevent"])),onPointerdown:m[4]||(m[4]=C(()=>{},["stop"])),onDblclick:m[5]||(m[5]=C(S=>l(o).onTagChange?.(S,e.row.id),["stop","prevent"]))},P(e.row.tag),41,dr)):(f(),g("span",cr,P(e.row.tag),1)),l(o).editingId===e.row.id&&!i(e.row)?fe((f(),g("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":m[6]||(m[6]=S=>l(o).draft=S),onMousedown:m[7]||(m[7]=C(()=>{},["stop"])),onPointerdown:m[8]||(m[8]=C(()=>{},["stop"])),onClick:m[9]||(m[9]=C(()=>{},["stop"])),onDblclick:m[10]||(m[10]=C(()=>{},["stop"])),onKeydown:[m[11]||(m[11]=C(()=>{},["stop"])),m[12]||(m[12]=ie(C(S=>l(o).onRenameCommit?.(),["prevent"]),["enter"])),m[13]||(m[13]=ie(C(S=>l(o).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:m[14]||(m[14]=S=>l(o).onRenameCommit?.())},null,544)),[[bt,l(o).draft]]):(f(),g("span",ur,P(e.row.name),1))],8,lr),r(e.row)?(f(),g("span",hr,[e.row.frame!=="main"&&l(t)?(f(),g("button",{key:0,type:"button","data-sve-ht-fields":"",title:l(o).frameFieldsTitle,innerHTML:co,onClick:m[15]||(m[15]=C(S=>l(o).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:m[16]||(m[16]=C(()=>{},["stop"])),onDblclick:m[17]||(m[17]=C(()=>{},["stop"]))},null,40,pr)):$("",!0)])):!i(e.row)&&!p(e.row)&&!d(e.row)?(f(),g("span",fr,[e.row.videoNth>=0?(f(),g("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?l(o).videoPlayTitle:l(o).videoHoldTitle,innerHTML:e.row.videoHeld?Cr:wr,onClick:m[18]||(m[18]=C(S=>l(o).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:m[19]||(m[19]=C(()=>{},["stop"])),onDblclick:m[20]||(m[20]=C(()=>{},["stop"]))},null,40,mr)):$("",!0),_(e.row)?(f(),g("button",{key:1,type:"button","data-sve-ht-eye":"",disabled:!l(o).canEdit,title:l(o).canEdit?e.row.hidden?l(o).showTitle:l(o).hideTitle:l(o).lockedTitle,innerHTML:e.row.hidden?xr:_r,onClick:m[21]||(m[21]=C(S=>l(o).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:m[22]||(m[22]=C(()=>{},["stop"])),onDblclick:m[23]||(m[23]=C(()=>{},["stop"]))},null,40,vr)):$("",!0),l(t)&&e.row.fieldsIcon?(f(),g("button",{key:2,type:"button","data-sve-ht-fields":"",disabled:!l(o).canEdit,title:l(o).canEdit?l(a):l(o).lockedTitle,innerHTML:co,onClick:C(n,["stop","prevent"]),onPointerdown:m[24]||(m[24]=C(()=>{},["stop"])),onDblclick:m[25]||(m[25]=C(()=>{},["stop"]))},null,40,gr)):$("",!0),y(e.row)?$("",!0):(f(),g("button",{key:3,type:"button","data-sve-ht-dup":"",disabled:!R(e.row),title:R(e.row)?l(o).duplicateTitle:l(o).lockedTitle,innerHTML:Sr,onClick:m[26]||(m[26]=C(S=>l(o).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:m[27]||(m[27]=C(()=>{},["stop"])),onDblclick:m[28]||(m[28]=C(()=>{},["stop"]))},null,40,yr)),y(e.row)?$("",!0):(f(),g("button",{key:4,type:"button","data-sve-ht-del":"",disabled:!R(e.row),title:R(e.row)?l(o).deleteTitle:l(o).lockedTitle,innerHTML:$r,onClick:m[29]||(m[29]=C(S=>l(o).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:m[30]||(m[30]=C(()=>{},["stop"])),onDblclick:m[31]||(m[31]=C(()=>{},["stop"]))},null,40,kr))])):$("",!0)],16,or),e.row.emptyBlock&&!e.row.shut?(f(),g("div",Ae({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},l(o).dropId===e.row.id&&l(o).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),P(l(o).slotText),17,br)):$("",!0)],64))}},J=je(Lr,[["__scopeId","data-v-6c7b7132"]]),Pr=["data-sve-ht-look","data-sve-ht-layers"],Er={key:0,class:"sve-ht-empty"},Hr={key:1,class:"sve-ht-empty"},Ir={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},Ar={key:0,class:"sve-ht-empty"},Mr={key:0,class:"sve-ht-empty"},Rr=["data-sve-ht-under-main"],Dr={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},Fr={key:0,class:"sve-ht-empty"},Or=["data-sve-ht-under-main"],Br=["data-dim"],Nr={key:0,class:"sve-ht-empty"},Vr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},jr={key:0,class:"sve-ht-empty"},Kr={__name:"HtmlTreeList",setup(e){const t=he(()=>jo(o.query)),a=he(()=>tr(o.rows,t.value)),n=he(()=>a.value.rows),s=he(()=>t.value?o.sections.filter(y=>xt(y.row,t.value)||y.current&&y.ready&&n.value.length>0):o.sections);function i(y){return!!y&&(!t.value||xt(y,t.value))}function r(y){const _=o.frame?.kind;return o.inComponent||(_==="header"||_==="footer")&&_!==y}const d=he(()=>!!o.frame&&["header","main","footer"].some(y=>i(o.frame[y]))),p=he(()=>!!o.frame&&(o.frame.kind==="main"||i(o.frame.main))),k=he(()=>!!t.value&&!s.value.length&&!n.value.length&&!d.value);function v(y){return!!t.value&&!a.value.hits.has(y.path)}function h(y){const _={"data-sve-ht-sec-uid":y.uid};return y.current&&(_["data-sve-ht-branch"]="",_["data-sve-ht-cat"]=y.row?.cat||"layout"),o.sectionDrop&&o.sectionDrop.uid===y.uid&&(_["data-sve-ht-drop"]=o.sectionDrop.place),_}return(y,_)=>(f(),g("div",Ae({class:"sve-ht-root","data-sve-ht-look":l(o).layers?"tags":l(o).look,"data-sve-ht-layers":l(o).layers?"":null,style:l(o).familyStyle},l(o).dragging?{"data-sve-ht-dragging":""}:{}),[!l(o).rows.length&&!l(o).sections.length&&!l(o).frame?(f(),g("div",Er,P(l(o).emptyText),1)):k.value?(f(),g("div",Hr,P(l(o).searchEmpty),1)):$("",!0),l(o).frame||l(o).sections.length?(f(),g(D,{key:2},[l(o).frame?(f(),g(D,{key:0},[l(o).frame.kind==="header"?(f(),g("div",Ir,[(f(!0),g(D,null,N(n.value,b=>(f(),X(J,{key:b.id,row:b,dim:v(b)},null,8,["row","dim"]))),128)),l(o).rows.length?$("",!0):(f(),g("div",Ar,P(l(o).emptyText),1))])):i(l(o).frame.header)?(f(),X(J,{key:1,row:l(o).frame.header,dim:r("header")},null,8,["row","dim"])):$("",!0)],64)):$("",!0),L("div",$n(Ln(l(o).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[l(o).frame?.kind==="main"?(f(),g(D,{key:0},[(f(!0),g(D,null,N(n.value,b=>(f(),X(J,{key:b.id,row:b,dim:v(b)},null,8,["row","dim"]))),128)),l(o).rows.length?$("",!0):(f(),g("div",Mr,P(l(o).emptyText),1))],64)):l(o).frame&&i(l(o).frame.main)?(f(),X(J,{key:1,row:l(o).frame.main,dim:r("main")},null,8,["row","dim"])):$("",!0),l(o).frame?.kind==="template"?fe((f(),g("div",{key:2,"data-sve-ht-frame-body":"","data-sve-ht-under-main":p.value?"":null},[L("div",Dr,[(f(!0),g(D,null,N(n.value,b=>(f(),X(J,{key:b.id,row:b,dim:v(b)},null,8,["row","dim"]))),128)),l(o).rows.length?$("",!0):(f(),g("div",Fr,P(l(o).emptyText),1))])],8,Rr)),[[oo,!l(o).mainShut]]):$("",!0),l(o).sections.length||l(o).frame?fe((f(),g("div",{key:3,"data-sve-ht-frame-body":"","data-sve-ht-under-main":p.value?"":null},[l(o).frame?.template&&i(l(o).frame.template)?(f(),X(J,{key:0,row:l(o).frame.template,dim:r("template")},null,8,["row","dim"])):$("",!0),l(o).frame&&!l(o).frame.template&&!l(o).sections.length&&!t.value?(f(),g("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":r("")?"":void 0},P(l(o).frameEmptyText),9,Br)):$("",!0),(f(!0),g(D,null,N(s.value,b=>(f(),g("div",Ae({key:b.uid},{ref_for:!0},h(b)),[b.ready?(f(),g(D,{key:0},[(f(!0),g(D,null,N(n.value,R=>(f(),X(J,{key:R.id,row:R,dim:v(R)},null,8,["row","dim"]))),128)),l(o).rows.length?$("",!0):(f(),g("div",Nr,P(l(o).emptyText),1))],64)):(f(),X(J,{key:1,row:b.row,dim:r("")},null,8,["row","dim"]))],16))),128))],8,Or)),[[oo,!l(o).frame||!l(o).mainShut]]):$("",!0)],16),l(o).frame?(f(),g(D,{key:1},[l(o).frame.kind==="footer"?(f(),g("div",Vr,[(f(!0),g(D,null,N(n.value,b=>(f(),X(J,{key:b.id,row:b,dim:v(b)},null,8,["row","dim"]))),128)),l(o).rows.length?$("",!0):(f(),g("div",jr,P(l(o).emptyText),1))])):i(l(o).frame.footer)?(f(),X(J,{key:1,row:l(o).frame.footer,dim:r("footer")},null,8,["row","dim"])):$("",!0)],64)):$("",!0)],64)):l(o).rows.length?(f(!0),g(D,{key:3},N(n.value,b=>(f(),X(J,{key:b.id,row:b,dim:v(b)},null,8,["row","dim"]))),128)):$("",!0)],16,Pr))}},uo=je(Kr,[["__scopeId","data-v-f9d22300"]]);let mt=null;function qr(e){return mt||(mt=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{pages:[]}).then(t=>Array.isArray(t.pages)?t.pages:[]).catch(()=>[])),mt}let Ye=null;function vt(){Ye?.dismiss(),Ye=null}function Gr(e,t,a){vt();const n=t?.getBoundingClientRect?.(),s={x:n?n.left:0,y:n?n.bottom+4:0};qr(e).then(i=>{const r=i.length?i.map(d=>({label:d.title||d.url,onPick:()=>{vt(),a(d.url)}})):[{label:u(e,"component_props_pages_none"),onPick:null}];vt(),Ye=be(e.document,Nt,{items:r,x:s.x,y:s.y,onClose:()=>{Ye=null}})})}const Ko="sve-html-tree-labels";function qo(){try{const e=globalThis.localStorage?.getItem(Ko);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function zr(e){try{globalThis.localStorage?.setItem(Ko,JSON.stringify(e))}catch{}}function Go(e){return String(e||"_")}function zo(e){const t=qo()[Go(e)];return t&&typeof t=="object"?{...t}:{}}function Ur(e,t,a){const n=a?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function Xr(e,t,a,n){if(!t)return;const s=Go(e),i=qo(),r={...i[s]||{}},d=String(a||"").replace(/\s+/g," ").trim(),p=String(n||"").trim();!d||d===p?delete r[t]:r[t]=d,Object.keys(r).length?i[s]=r:delete i[s],zr(i)}const Yr=/^@(media|supports|container|layer|scope)\b/i;function Wr(e){const t=String(e||""),a=[];let n=0,s=0;for(;n<t.length;){if(t[n]==="{"&&t[n+1]==="{"){const d=t.indexOf("}}",n+2);n=d===-1?t.length:d+2;continue}if(t[n]==="/"&&t[n+1]==="*"){const d=t.indexOf("*/",n+2);n=d===-1?t.length:d+2;continue}if(t[n]==='"'||t[n]==="'"){const d=t[n];for(n+=1;n<t.length&&t[n]!==d;)n+=t[n]==="\\"?2:1;n+=1;continue}if(t[n]!=="{"){n+=1;continue}let i=1,r=n+1;for(;r<t.length&&i>0;){if(t[r]==="{"&&t[r+1]==="{"){const d=t.indexOf("}}",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==="/"&&t[r+1]==="*"){const d=t.indexOf("*/",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==='"'||t[r]==="'"){const d=t[r];for(r+=1;r<t.length&&t[r]!==d;)r+=t[r]==="\\"?2:1;r+=1;continue}t[r]==="{"?i+=1:t[r]==="}"&&(i-=1),r+=1}a.push({selector:t.slice(s,n).trim(),body:t.slice(n+1,r-1),from:s,to:r,text:t.slice(s,r).trim()}),n=r,s=r}return a}function ho(e){const t=String(e||""),a=new Set,n=new Set,s=new Set;for(const i of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const r of i[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))r&&(a.add(r),a.add(r.replace(/([:./%!#()[\],])/g,"\\$1")));for(const i of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))i[2].trim()&&n.add(i[2].trim());for(const i of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))s.add(i[1].toLowerCase());return{classes:a,ids:n,tags:s}}function po(e,t){const a=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),n=[...a.matchAll(/\.((?:\\.|[\w-])+)/g)].map(r=>r[1]),s=[...a.matchAll(/#((?:\\.|[\w-])+)/g)].map(r=>r[1]);if(n.length||s.length){const r=d=>d.replace(/\\(.)/g,"$1");return n.every(d=>t.classes.has(d)||t.classes.has(r(d)))&&s.every(d=>t.ids.has(r(d)))}const i=[...a.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(r=>r[2].toLowerCase());return i.length>0&&i.every(r=>t.tags.has(r))}function Zr(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function Jr(e,t,a){const n=Zr(e);if(!n.length)return"keep";const s=n.filter(r=>po(r,t));return s.length?s.length===n.length&&!n.some(r=>po(r,a))?"move":"copy":"keep"}function Uo(e,t,a){const n=String(e||""),s=ho(t),i=ho(a),r=[],d=[];let p=0;for(const k of Wr(n)){const v=n.slice(k.from,k.to),h=v.match(/^\s*/)[0];if(p=k.to,Yr.test(k.selector)){const _=Uo(k.body,t,a);_.move.trim()&&r.push(`${k.selector} {
${_.move.trim()}
}`),_.keep.trim()&&d.push(`${h}${k.selector} {
${_.keep.trim()}
}`);continue}const y=k.selector.startsWith("@")?"keep":Jr(k.selector,s,i);if(y==="move"){r.push(k.text);continue}y==="copy"&&r.push(k.text),d.push(v)}return d.push(n.slice(p)),{move:r.join(`

`).trim(),keep:d.join("").replace(/\n{3,}/g,`

`).trim()}}const Qr="/!/sve/component";function ei(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let a=null;for(const n of t){if(!n.trim())continue;const s=n.match(/^[ \t]*/)[0].length;a=a===null?s:Math.min(a,s)}return a?t.map(n=>n.slice(a)).join(`
`):t.join(`
`)}function ti(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function oi(e,t){if(!na(e))return"";try{return await(await En(()=>import("./tw-compile-AWaJHJyk.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(a){return console.error("[sve] component tailwind compile",a),""}}async function ni(e,t){const a=await e.fetch(Qr,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":Mt(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!a.ok){const n=new Error(String(a.status));throw n.status=a.status,n}return a.json()}function fo(e,t){const{from:a,to:n}=oa(e,t),s=e.slice(a,n);if(!s.trim())return null;const i=e.slice(0,a)+e.slice(n),r=x("dock:css"),d=Uo(typeof r=="string"?r:"",s,i);return{html:ei(s),css:d.move,keepCss:d.keep,lead:ti(s),from:a,to:n}}function ai(e,t,{onDone:a,onError:n}={}){if(x("dock:is-locked")===!0)return;const s=x("dock:html");if(typeof s!="string"||!t)return;const i=fo(s,t);if(!i)return;const r=be(e.document,Pn,{heading:u(e,"component_new"),nameLabel:u(e,"component_name"),placeholder:u(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:u(e,"cancel"),saveLabel:u(e,"component_create"),onOk:d=>{r.dismiss(),(async()=>{try{const p=await oi(e,i.html),k=x("dock:html"),v=typeof k=="string"&&k===s?i:fo(k,t);if(!v)return;const h=await ni(e,{name:d,html:v.html,css:v.css,js:"",tw:p}),y=x("dock:html"),_=y.slice(0,v.from)+v.lead+h.tag+y.slice(v.to);x("dock:set-html",_),v.css.trim()&&x("dock:set-css",v.keepCss),a?.(h)}catch(p){n?.(p)}})()}})}function si(e,t,a){const n=String(e||"");if(!t||t.kind!=="antlers")return n;const s=String(a||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?di(n,t,s):t.tag==="else"||!s?n:n.slice(0,t.from)+`{{ ${t.tag} ${s} }}`+n.slice(t.openTo)}function St(e,t,a,n){return Me(e,t,{kind:a,name:n})}function Me(e,t,a={}){const n=String(e||"");if(!t||t.antlers!=="loop")return n;const s=t.loopKind==="collection"?"collection":"field",i=a.kind??s,r=String(a.name??t.expr??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(r))return n;const d=a.sortDir??t.sortDir??"",p=String(a.sortField??t.sortField??"").trim(),k=String(a.limit??t.limit??"").trim(),v=Xo(n,t);if(!v)return n;const h=i===s?t.params:"",y=i==="collection"?ri(r,p,d,k,h):ii(r,p,d,k,h),_=i==="collection"?"collection":r;return n.slice(0,t.from)+y+n.slice(t.openTo,v.from)+`{{ /${_} }}`+n.slice(v.to)}function ri(e,t,a,n,s){const i=li(s).replace(/\bsort\s*=\s*["'][^"']*["']/g,"").replace(/\blimit\s*=\s*["']?\d+["']?/g,"").replace(/\s+/g," ").trim(),r=[`collection from="${e}"`];return a==="random"?r.push('sort="random"'):t&&r.push(`sort="${t}${a==="desc"?":desc":":asc"}"`),n&&r.push(`limit="${n}"`),i&&r.push(i),`{{ ${r.join(" ")} }}`}function ii(e,t,a,n,s){const i=String(s||"").split("|").map(d=>d.trim()).filter(d=>d&&!/^from\s*=/.test(d)&&!/^sort\s*:/.test(d)&&!/^reverse$/.test(d)&&!/^shuffle$/.test(d)&&!/^limit\s*:/.test(d)),r=[e,...i];return a==="random"?r.push("shuffle"):t&&(r.push(`sort:${t}`),a==="desc"&&r.push("reverse")),n&&r.push(`limit:${n}`),`{{ ${r.join(" | ")} }}`}function li(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function Xo(e,t){const n=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return n?{from:t.from+n.index,to:t.from+n.index+n[0].length}:null}function di(e,t,a){return Me(e,t,{name:a})}function ci(e,t,a){const n=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return n;const s=Xo(n,t);if(!s)return n;const r=(n.slice(0,s.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],d=a==="else"?"{{ else }}":"{{ elseif true }}";return`${n.slice(0,s.from)}${d}
${r}${n.slice(s.from)}`}const G=ia("sve-call-values"),Be=new Set;let mo=null;const ui="__sve-html-tree-style",V=new Set;let wt="",xe=!1,gt=null,$e=!0,Q="",Ce=0,Yo="";const le=new Map,we=new Set;let K="",Wo=!1,O=null,We=null,Ge="",Ze="",Je=0,Ct=null,Ne=[],me=null,Re=null,Qe=null,et=null,$t=null,ye=!1,ve=null,Ve=null,De=null,tt=null,ot=null,Lt=null,pe=null;function W(e){return e.getElementById(Xe)}function hi(e){In(e,ui,`
    /* Where a row's content starts, in from the row's own edge: a small
       0.375rem, so the twist sits near the edge rather than behind a gutter.
       The open section's box takes its own border and padding back out of it
       (below), so a row inside the box starts where the same row outside it
       does — the inset is said once, not once per box it sits in. */
    [data-sve-ht-look] { --sve-ht-inset: 0.375rem; }
    [data-sve-ht-row] {
      all: unset;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0.375rem 0.5rem 0.375rem var(--sve-ht-inset);
      min-height: 1.875rem;
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
      /* The panel's inset less this box's padding and border. */
      --sve-ht-inset: calc(0.375rem - 0.3125rem - 1px);
    }
    [data-sve-ht-branch] > [data-sve-ht-row]:last-child { margin-bottom: 0; }
    /* The page's frame: header, main and footer around the sections. The
       sections step in one level under main, as rows step in under a parent —
       only when a main row stands above them (HtmlTreeList: underMain). */
    [data-sve-ht-frame-body][data-sve-ht-under-main] { margin-left: 12px; }
    [data-sve-ht-look="tags"] [data-sve-ht-frame-body][data-sve-ht-under-main] {
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
    /* The arrow, centred in its box. The box keeps its width, so a bigger
       arrow moves neither the row's content nor its centre — the guides
       stay where they stand against it. */
    [data-sve-ht-twist] svg { width: 0.75rem; height: 0.75rem; }
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
      ${no("light")}
      /* How much of a row's own colour its pick takes: a wash, not a fill.
         The row mixes it in below — a mix written up here would read
         --sve-ht-c on the list, where no family is set. */
      --sve-ht-pick-mix: 11%;
      --sve-ht-pick-hover-mix: 18%;
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${no("dark")}
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
       over the guides read as belonging to every level at once. The content
       starts at the panel's inset (--sve-ht-inset, above); the box keeps a
       hair of air above and below it. */
    [data-sve-ht-look="tags"] [data-sve-ht-row] {
      margin: 0 0 0 calc(var(--sve-ht-depth, 0) * 14px);
      padding: 0.0625rem 0.375rem 0.0625rem var(--sve-ht-inset);
      min-height: 1.75rem;
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
       border instead of sitting on it. The rows inside take that padding and
       border back out of their inset, so the open section's twists stand
       under the shut sections' twists, and its children one level in. */
    [data-sve-ht-look="tags"] [data-sve-ht-branch] {
      border: 1px solid color-mix(in srgb, var(--sve-ht-c, var(--sve-fam-layout)) 45%, transparent);
      border-radius: 7px;
      padding: 0.25rem;
      margin: 0 0 6px;
      background: color-mix(in srgb, var(--sve-ht-c, var(--sve-fam-layout)) 4%, transparent);
      --sve-ht-inset: calc(0.375rem - 0.25rem - 1px);
    }
    /* A hair of air between the rows under a section, so the eye can tell
       them apart; a shut section already keeps its own distance (above). The
       guide reaches up across that gap so the line under a parent stays one
       line. */
    [data-sve-ht-look="tags"] [data-sve-ht-row] + [data-sve-ht-row] { margin-top: 2px; }

    /* One guide per level, drawn in the row's left margin: 14px per level
       with the line 7px in, so each sits under the twist of the row it
       descends from — in that row's family colour, well held back. Out of
       the flow, so the row's box and everything in it start at the level.
       Moved in with the row's inset (past the 0.25rem it was drawn for), so
       a line stands where it always stood against the twist, in a box or out
       of one. */
    [data-sve-ht-look="tags"] [data-sve-ht-indent] {
      display: flex;
      position: absolute;
      top: -2px;
      bottom: 0;
      left: calc(var(--sve-ht-inset) - 0.25rem - var(--sve-ht-depth, 0) * 14px);
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
      /* No box, so nothing to take back out of the inset. */
      --sve-ht-inset: 0.375rem;
    }
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-frame-body] {
      margin: 0;
      padding: 0;
      box-shadow: none;
    }
    /* The level under main — only with a main row above to be under. */
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-frame-body][data-sve-ht-under-main] {
      --sve-ht-base: 1;
    }
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-indent] { display: none; }
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-row] {
      margin-left: 0;
      padding-left: calc(var(--sve-ht-inset) + (var(--sve-ht-depth, 0) + var(--sve-ht-base, 0)) * 0.875rem);
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
      left: calc(var(--sve-ht-inset) + 0.25rem + (var(--sve-ht-depth, 0) + var(--sve-ht-base, 0)) * 0.875rem);
    }
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-sec-uid][data-sve-ht-drop="before"]::before,
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-sec-uid][data-sve-ht-drop="after"]::after {
      left: calc(var(--sve-ht-inset) + 0.25rem + var(--sve-ht-base, 0) * 0.875rem);
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
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-twist] svg { width: 0.625rem; height: 0.625rem; }
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-eye] svg,
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-fields] svg,
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-dup] svg,
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-del] svg { width: 0.625rem; height: 0.625rem; }
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-video] svg { width: 0.75rem; height: 0.75rem; }
  `)}function z(){const e=x("dock:html");return typeof e=="string"?e:""}function Zo(e){return!!x("dock:is-open",e)}function Le(e,{save:t=!1}={}){return Gt()||x("dock:set-html",e)!==!0?!1:(t&&x("dock:save-now"),!0)}function vo(e){const t=x("dock:component-exit-state")||{};if(o.exitOpen=!!t.open,!t.open){o.onExit=null;return}o.exitName=t.name||"",o.exitLabel=u(e,"component_exit"),o.exitTitle=u(e,t.back?"component_exit_back":"component_exit_close"),o.onExit=()=>{x("dock:exit-component"),A(e)}}function Jo(e,t){const a=qn(e);if(!a||t.type!==a)return"";const n=Gn(t[a]);return n&&zn(e,n)?.section_type||""}const ke=[];let yt=!1,Pt=!1;function kt(e,t){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(t,{timeout:2e3});return}e.setTimeout(t,200)}function pi(e,t){for(const a of t){const n=a.type;!n||le.has(n)||we.has(n)||ke.includes(n)||ke.push(n)}Rt.htmlTreePrefetchArmed&&qt(e)}function rl(e){Rt.htmlTreePrefetchArmed=!0,qt(e)}function qt(e){if(yt||!ke.length)return;yt=!0;const t=()=>{const a=ke.shift();if(!a){yt=!1;return}if(le.has(a)||we.has(a)){kt(e,t);return}we.add(a),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(a)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{typeof n?.html=="string"&&(le.set(a,n.html),Pt&&(Pt=!1,A(e)))}).catch(()=>{}).finally(()=>{we.delete(a),kt(e,t)})};kt(e,t)}function Gt(){return!!K}function fi(e){const t=new Map,a=it(e);if(!a)return t;for(const n of a.querySelectorAll("[data-sid]")){const s=n.getAttribute("data-sid");s&&!t.has(s)&&t.set(s,n.tagName.toLowerCase())}return t}function ut(e,t){const a=lt(e)||"page_sections",n=fi(e),s=[];for(const i of Dt(t)||[]){const r=Ft(i.values),d=r&&typeof r=="object"?r[a]:null;if(Array.isArray(d)){d.forEach(p=>{if(!p||typeof p!="object"||Array.isArray(p)||typeof p.type!="string")return;const k=[p._visual_id,p.id,p._id].filter(b=>typeof b=="string"&&b!=="");if(!k.length)return;const v=Jo(e,p)||p.type,h=typeof p._sve_label=="string"?p._sve_label.trim():"",y=k.map(b=>n.get(b)).find(Boolean)||"section",_=zo(p.type)[`0:${y}`];s.push({uid:k[0],ids:k,type:p.type,tag:y,label:h||(typeof _=="string"&&_.trim()?_.trim():"")||dt(e,v)?.display||Fe(v)||v,svg:Mo(y,"",null).svg||Se.section,cat:Eo(y),enabled:p.enabled!==!1,static:za(e,v)})});break}}return s}function mi(e,t,a){if(!a.length)return"";const n=x("dock:current-type")||"",s=x("dock:current-uid"),i=!!x("dock:component-exit-state")?.open;if(s){const r=Ot(s,t),d=a.find(p=>p.ids.some(k=>r.includes(k)));if(d&&(i||d.type===n))return d.uid}return a.find(r=>r.type===n)?.uid||""}function vi(e,t,a,n){const s=t.find(b=>b.uid===a),i=x("dock:component-src"),r=x("dock:type-stack")||[];if(!s||!i||!r.length)return null;const d=r.map(b=>b.type).filter(b=>!le.get(b));if(d.length)return gi(e,d),null;const p=[],k=new Set,v=new Set;let h=b=>p.push(...b),y=null,_=0;for(let b=0;b<r.length;b+=1){const R=b+1<r.length?r[b+1].src:i,T=q=>({...q,id:`ctx${b}:${q.id}`,path:`ctx${b}/${q.path}`,ctxLevel:b,children:q.children.map(T)}),m=ct(le.get(r[b].type)).map(T),S=[],E=(q,Z)=>{for(const I of q){if(I.kind==="component"&&I.src===R)return S.push(...Z,I),I;const U=E(I.children,[...Z,I]);if(U)return U}return null};if(y=R?E(m,[]):null,!y)return null;const M=new Set(S.map(q=>q.id)),F=(q,Z)=>{for(const I of q)I.children.length&&(M.has(I.id)?V.has(I.path):Qo(I,Z))&&k.add(I.id),F(I.children,Z+1)};F(m,_),h(m),v.add(y.id),_+=S.length,h=(q=>Z=>{q.children=Z})(y)}for(const b of en(n))k.add(b);return V.has(y.path)&&k.add(y.id),y.children=n,{tree:p,folds:k,hostId:y.id,hostIds:v,levels:r.length,rootId:p.find(b=>!b.kind)?.id||"",label:s.label,svg:s.svg,cat:s.cat}}function gi(e,t){for(const a of t)!ke.includes(a)&&!we.has(a)&&ke.push(a);Pt=!0,qt(e)}function yi(e,t,a){const n=x("dock:component-exit-state");if(n?.open)return Fe(n.name)||n.name||"";if(a)return t.find(i=>i.uid===a)?.label||"";const s=x("dock:current-type")||"";return dt(e,s)?.display||Fe(s)||""}function ht(e,t,a,n,s){const i=a.find(d=>d.uid===n);if(!i||n===s)return;V.clear(),O=null,$e=!1,oe(),Ke(),Q=n,Yo=z(),K=le.get(i.type)||"",K&&(O=nt(ct(K))||null),Wo=(x("dock:current-type")||"")===i.type,e.clearTimeout(Ce),Ce=e.setTimeout(()=>{Q="",xe=!1,A(e)},4e3),A(e);const r=()=>Yn(i.uid,t,e,{clampToSection:!0});Kn(i.uid,t,e,r),de({source:te,type:ee.SVE_ACTIVATE,ids:i.ids},e),e.setTimeout(()=>A(e),0)}function Et(e,t){if(!t)return!1;for(const a of e||[])if(a.id===t||Et(a.children,t))return!0;return!1}function nt(e){for(const t of e||[]){if(!t.kind)return t.id;const a=nt(t.children);if(a)return a}return""}function Qo(e,t){const a=t===0||e.path===Ze;return V.has(e.path)?a:!a}function en(e){const t=new Set,a=(n,s)=>{for(const i of n)i.children.length&&Qo(i,s)&&t.add(i.id),a(i.children,s+1)};return a(e,0),t}function A(e){const t=e.document,n=W(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;hi(t),sa(e);const s=z();K&&K===s&&(K=""),x("dock:chrome-kind")&&(K="");const i=K||s,r=ct(i);Ne=r,Ze="";const d=x("dock:current-type")||"",p=zo(d),k=Fn(e,t),h=!!(x("dock:component-exit-state")||{}).open,y=ut(e,t);d&&s&&!K&&le.set(d,s),pi(e,y);const _=mi(e,t,y),b=String(x("dock:chrome-kind")||"");if(On(e),k&&!y.length&&!b){Ne=[],o.rows=[],o.sections=[],o.frame=yo(e,[],!1,!1,"",!0),o.frameEmptyText=u(e,"html_tree_frame_no_sections"),o.pageBuilder=!0,o.layoutFile=!1,o.emptyText=u(e,"html_tree_empty"),o.canEdit=!x("dock:is-locked"),o.look=ao(e),o.onRefresh=()=>A(e),o.onSection=null,go(e,""),vo(e),Ue(n,uo),To(e,[]);return}o.pageBuilder=k;const R=`${d}|${_}`;let T=!1;R!==wt&&(wt=R,V.clear(),gt!==null&&i!==gt?T=!0:xe=i),(T||xe!==!1&&i!==xe)&&(xe=!1,V.clear(),O=nt(r)||null),gt=i,Q&&(Q===_||!y.length)&&(Wo||i!==Yo)&&(e.clearTimeout(Ce),Q="",xe=!1,Et(r,O)||(V.clear(),O=nt(r)||null));const m=y.some(c=>c.uid===Q)?Q:"",S=$e?"":m||_,E=h?vi(e,y,S,r):null,M=!!(m||_),F=M||h?"":String(x("dock:chrome-kind")||""),Z=k&&(!d&&!M||F==="main"&&x("dock:on-empty-page")===!0),I=Z||F==="template"?"":F;o.layoutFile=I==="main",I!=="main"&&(Ge="");const U=I==="main"?ko(r,"main"):null,Pe=U?at(r,c=>c.tag==="body"&&Et(c.children,U.id)):null;Ze=Pe?Pe.path:"",U&&(ze((Pe||U).path),Ge!==R&&(ze(U.path),V.add(U.path)));const Ee=I==="header"||I==="footer"?at(r,c=>i.slice(c.from,c.openTo).includes(`data-sve-chrome="${I}"`))||ko(r,I):null;Ee&&ze(Ee.path);const B=Z||!(I==="main"?!!U:I==="header"||I==="footer"?!!Ee:!0)?[]:E?so(E.tree,o.query?new Set:E.folds):so(r,o.query?new Set:en(r));!i.trim()&&!Zo(t)?o.emptyText=u(e,"html_tree_need_dock"):o.emptyText=u(e,"html_tree_empty"),o.slotText=u(e,"antlers_drop_here"),o.dataTitle=u(e,"data_vars_title"),o.pageTitle=u(e,"component_props_page"),o.renameTitle=u(e,"html_tree_rename"),o.tagTitle=u(e,"tw_tag"),o.hideTitle=u(e,"html_tree_hide"),o.showTitle=u(e,"html_tree_show"),o.duplicateTitle=u(e,"html_tree_duplicate"),o.deleteTitle=u(e,"html_tree_delete"),o.videoHoldTitle=u(e,"html_tree_video_hold"),o.videoPlayTitle=u(e,"html_tree_video_play"),o.lockedTitle=u(e,"html_tree_locked"),o.searchEmpty=u(e,"html_tree_search_empty"),o.canEdit=!x("dock:is-locked"),o.look=ao(e),o.onQuery=()=>A(e),vo(e),o.inComponent=h,o.onContextRow=c=>{if(!E||c===E.hostId)return;const w=B.find(H=>H.id===c)?.ctxLevel??E.levels-1;x("dock:exit-component",E.levels-w),A(e)},o.onSelect=c=>{const w=B.find(H=>H.id===c);w&&Ao(e,w.path)||rt(e,c,B)},o.onTwist=c=>{const w=B.find(H=>H.id===c)?.path;w&&(V.has(w)?V.delete(w):V.add(w),A(e))},o.onTagChange=(c,w)=>{const H=o.rows.find(se=>se.id===w);H&&!Gt()&&ra(e,c.currentTarget,H)},o.onRename=c=>xi(e,c),o.onRenameCommit=()=>_o(e,!0),o.onRenameCancel=()=>_o(e,!1),o.onHide=c=>Ci(e,c),o.onVideoHold=c=>wi(e,c),o.onDuplicate=c=>$i(e,c),o.onDelete=c=>Pi(e,c),o.onPointerDown=(c,w)=>Ri(e,c,w),o.onSectionPointerDown=(c,w)=>Oi(e,c,w),o.onContext=(c,w)=>Ai(e,c,w),o.onInspectCommit=c=>Gi(e,c),o.onPropValue=(c,w,H)=>wo(e,c,w,H),o.onPropPage=(c,w)=>Gr(e,c,H=>wo(e,w,H,!1)),o.onLoopKind=c=>zi(e,c),o.onAddBranch=c=>Ui(e,c),o.onLoopSortField=c=>{const w=st(),H=String(c||"").trim();if(!w)return;const se=pe?.id===w.id?pe.dir:"",re=w.sortDir||se||"asc";pe=null,ge(e,(_e,He)=>Me(_e,He,{sortField:H,sortDir:re}))},o.onLoopSortDir=c=>{const w=st(),H=String(c||"");if(w){if((H==="asc"||H==="desc")&&!w.sortField){pe={id:w.id,dir:H},It(e,w);return}pe=null,ge(e,(se,re)=>Me(se,re,{sortDir:H,sortField:H==="asc"||H==="desc"?re.sortField:""}))}},o.onLoopLimit=c=>ge(e,(w,H)=>Me(w,H,{limit:String(c||"").replace(/\D/g,"")})),o.onPropHost=c=>c?G.mount(c):G.unmount(),o.onInspectData=(c,w)=>{x("dock:data-menu",{anchor:c,at:B.find(H=>H.id===O)?.from,onPick:H=>w(String(H?.var||"").trim())})};const Yt=B.find(c=>!c.kind)?.id,Wt=h?"":yi(e,y,S),ce=S&&!h?y.find(c=>c.uid===S):null,dn=Po(e,String(x("dock:current-type")||""));let cn=0;const ne=I==="header"||I==="footer"?I:"",Te=Ee?Ee.id:"",ue=U&&B.find(c=>c.id===U.id)||null,Zt=Pe&&B.find(c=>c.id===Pe.id)||null,ae=Zt||ue||Te&&B.find(c=>c.id===Te)||null,Jt=ae?bi(B,ae):-1;ae&&!B.slice(B.indexOf(ae),Jt).some(c=>c.id===O)&&(O=ae.id);const Qt=o.layoutFile?ki(e):null;o.rows=B.map(c=>{const w=Qt&&c.kind==="component"&&Qt.get(c.src)||"",H=c.tag==="body"&&!c.kind,se=w?{svg:Se[w]}:Mo(c.tag,c.kind,c.antlers),re=c.tag==="video"&&!c.kind?cn++:-1,_e=!!E&&c.id===E.rootId,He=c.id===Yt&&Wt?Wt:_e?E.label:c.klass,qe=c.id===Yt;return{...c,tag:w||c.tag,frameCall:w,fixed:!!w||H,base:He,name:ne&&c.id===Te?u(e,`html_tree_frame_${ne}`):c===ue?u(e,"html_tree_frame_main"):qe&&ce?He:Ur(He,c.path,p),current:c.id===O,letter:_e?"":se.letter||"",svg:ne&&c.id===Te?Se[ne]:c===ue?Se.main:qe&&ce?ce.svg:_e?E.svg:se.svg||"",frame:ne&&c.id===Te?ne:c===ue?"main":"",cat:ne&&c.id===Te?ne:c===ue||H?"main":_e?E.cat:w||Eo(c.tag,c.kind,c.antlers),context:E?E.hostIds.has(c.id)?"host":c.id.startsWith("ctx")?"dim":"":"",sectionRoot:qe&&ce?ce.uid:"",fieldsIcon:!!(qe&&ce&&!ce.static),videoNth:re,videoHeld:re>=0&&dn.has(re)}}),Bn(e);const pt=[];for(const c of o.rows)pt.length=c.depth,c.guides=pt.slice(),pt[c.depth]=c.cat;if(ae){const c=B.indexOf(ae),w=ae.depth;o.rows=o.rows.slice(c,Jt).map(H=>({...H,depth:H.depth-w,guides:H.guides.slice(w)})),ue&&Ge!==R&&(Ge=R,e.setTimeout(()=>rt(e,ue.id,B),0))}o.sections=k&&(M||I||Z)?y.map(c=>{const w=!!S&&c.uid===S;return{...c,current:w,ready:w&&(!m||!!K),row:{id:`sec:${c.uid}`,section:c.uid,tag:c.tag,name:c.label,kind:"",svg:c.svg,cat:c.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:w,hidden:!c.enabled}}}):[],o.frame=yo(e,y,M,h,I,!1,!!Zt),o.frameEmptyText=u(e,"html_tree_frame_no_sections"),go(e,I),o.onSection=c=>{ye||(Ht(e),ht(e,t,y,c,S))},o.onRefresh=()=>A(e),It(e,o.rows.find(c=>c.id===O)),Ue(n,uo),To(e,r)}function go(e,t){o.frameOpenTitle=u(e,"html_tree_frame_open"),o.frameMainTitle=u(e,"html_tree_frame_main_open"),o.frameTemplateTitle=u(e,"html_tree_frame_template_open"),o.frameFieldsTitle=u(e,"html_tree_frame_fields"),o.onFrame=a=>{t===a?Ti(e,a):bo(e,a)},o.onFrameEnter=a=>bo(e,a),o.onFrameFields=a=>Qn(e,Nn(e,a),u(e,`html_tree_frame_${a}`)),o.onFrameTwist=()=>{o.mainShut=!o.mainShut}}function yo(e,t,a,n,s,i=!1,r=!1){if(!s&&!i||r)return null;const d=v=>({id:`frame:${v}`,frame:v,synthetic:!0,tag:v,name:u(e,`html_tree_frame_${v}`),kind:"",svg:Se[v]||"",cat:v,letter:"",depth:0,hasChildren:v==="main"&&(t.length>0||s==="template"),shut:v!=="main",current:!1,hidden:!1}),p={kind:s,header:d("header"),main:d("main"),footer:d("footer"),template:null},k=s&&s!=="template"?String(x("dock:collection-view")||""):"";return k&&(p.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:dt(e,k)?.display||Fe(k.replace(/^view:/,"")),kind:"",svg:Se.section,cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),p}function ko(e,t){return at(e,a=>a.tag===t)}function at(e,t){for(const a of e||[]){if(!a.kind&&t(a))return a;const n=at(a.children,t);if(n)return n}return null}function ki(e){const t=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},a=new Map;for(const n of["header","footer"]){const s=la(t[n]?.type);s&&a.set(s,n)}return a}function bi(e,t){let a=e.indexOf(t)+1;for(;a<e.length&&e[a].depth>t.depth;)a+=1;return a}function Ti(e,t){const a=it(e);(t==="main"||t==="template"?a?.querySelector("main"):a?.querySelector(`[data-sve-chrome="${t}"]`))?.scrollIntoView({behavior:"smooth",block:"start"})}function Ht(e){const t=String(x("dock:chrome-open",e.document)||"");return t!=="header"&&t!=="footer"?!1:(jn(e),de({source:te,type:ee.SVE_FORCE_EXIT_CHROME},e),!0)}function _i(e){e.clearTimeout(Ce),Q="",K="",V.clear(),O=null,$e=!1,oe(),Ke()}function bo(e,t){if(e.document,String(x("dock:chrome-kind")||"")===t)return;if(_i(e),t==="main"){Ht(e),x("dock:open-file",ea);return}if(t==="template"){const i=String(x("dock:collection-view")||"");i&&(Ht(e),x("dock:open-file",i));return}if(t!=="header"&&t!=="footer")return;const a=it(e)?.querySelector(`[data-sve-chrome="${t}"]`);a?(a.scrollIntoView({block:"nearest"}),a.dispatchEvent(new a.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:te,type:ee.OPEN_CHROME,kind:t},e.location.origin);const n=Date.now(),s=async()=>{if(String(x("dock:chrome-kind")||"")!==t){Date.now()-n<3e4&&e.setTimeout(s,250);return}await(x("dock:load-settled")||null),ln(e)};e.setTimeout(s,250)}function To(e,t){W(e.document)&&tn(e,t)}function tn(e,t){const a=t[0],n=!!x("dock:component-src"),s=n?"":x("dock:current-uid")||"";de({source:te,type:ee.SVE_HTML_PICK,on:!0,uid:s,uids:s?Ot(s,e.document):[],all:n,tag:a?.tag||"",klass:a?.klass||"",nodes:_a(t)},e)}function ze(e){if(!e)return;const t=(a,n)=>{for(const s of a||[]){if(s.path===e)return!0;if(t(s.children,n+1))return n===0||s.path===Ze?V.delete(s.path):V.add(s.path),!0}return!1};t(Ne,0)}function xi(e,t){if(ye)return;const a=o.rows.find(n=>n.id===t);!a||a.kind||(O=t,o.rows.forEach(n=>{n.current=n.id===t}),o.editingId=t,o.draft=a.name,e.setTimeout(()=>{const n=W(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function _o(e,t){const a=o.editingId;if(!a)return;const n=o.rows.find(s=>s.id===a);o.editingId=null,t&&n&&(n.sectionRoot?Si(e,n.sectionRoot,o.draft):Xr(x("dock:current-type")||"",n.path,o.draft,n.base||n.klass)),o.draft="",A(e)}function Si(e,t,a){const n=lt(e)||"page_sections",s=String(a||"").replace(/\s+/g," ").trim();for(const i of Dt(e.document)||[]){const r=Ft(i.values),d=r&&typeof r=="object"?r[n]:null;if(!Array.isArray(d))continue;const p=d.findIndex(y=>y&&typeof y=="object"&&[y._visual_id,y.id,y._id].includes(t));if(p===-1)continue;const k=Jo(e,d[p])||d[p].type,v=dt(e,k)?.display||Fe(k)||k,h=JSON.parse(JSON.stringify(d));return h[p]={...h[p]},!s||s===v?delete h[p]._sve_label:h[p]._sve_label=s,i.setFieldValue(n,h),!0}return!1}function wi(e,t){const a=o.rows.find(d=>d.id===t);if(!a||!(a.videoNth>=0))return;const n=String(x("dock:current-type")||""),s=Po(e,n),i=!s.has(a.videoNth);i?s.add(a.videoNth):s.delete(a.videoNth);const r=String(x("dock:current-uid")||"");Vn(e,n,s),de({source:te,type:ee.SVE_VIDEO_HOLD,uid:r,uids:r?Ot(r,e.document):[],nth:a.videoNth,on:i},e),A(e)}function zt(e){return!!o.rows.find(t=>t.id===e)?.fixed}function Ci(e,t){zt(t)||Ut(e,t,ka)}function $i(e,t){if(zt(t))return;const a=o.rows.find(n=>n.id===t)?.sectionRoot;if(a){e.postMessage({source:te,type:ee.DUPLICATE_ROW,uid:a},e.location.origin);return}Ut(e,t,ba)}function on(e,t){Un(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const a=e.document;Wn({uid:t},a,e)})}function Li(e,t,a){Q===a&&(e.clearTimeout(Ce),Q="",K=""),O=null,$e=!1,wt="";const n=ut(e,t),s=n.find(i=>i.uid!==a)||n[0];s?ht(e,t,n,s.uid,""):(K="",o.rows=[],o.sections=[],o.frame=null,o.pageBuilder=!0,A(e)),e.setTimeout(()=>{W(e.document)&&A(e)},0)}Ho("row:removed",({uid:e,parentPath:t,doc:a,win:n})=>{t!==lt(n)||!W(n.document)||Li(n,a,e)});function Pi(e,t){if(zt(t))return;const a=o.sections?.find(s=>s.row?.id===t),n=a?a.row?.section||a.uid:o.rows.find(s=>s.id===t)?.sectionRoot;if(n){on(e,n);return}Ut(e,t,Ta)}function Ut(e,t,a){if(x("dock:is-locked"))return;const n=z(),s=o.rows.find(r=>r.id===t);if(!s)return;const i=a(n,s);i!==n&&Le(i)}function oe(){ve?.dismiss(),ve=null}const Ei='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',Hi='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>';function nn(e,t){const a=o.sections?.find(p=>p.uid===t),n=a?.type||"";if(!n||!Bo(e))return[];const s=a.label||n,i=Ua(e,n),r=()=>e.Statamic?.$toast?.error(u(e,"section_update_failed")),d=[{label:u(e,"static_section_insertable"),icon:i?Hi:Ei,onPick:()=>{oe(),io(e,{handle:n,hidden:!i}).then(()=>{e.Statamic?.$toast?.success(u(e,i?"section_shown_to_editors":"section_hidden_from_editors",{name:s})),_t(e)}).catch(r)}}];return a.static&&d.push({label:u(e,"section_add_fields"),onPick:()=>{oe(),io(e,{handle:n,fields:!0}).then(()=>{e.Statamic?.$toast?.success(u(e,"section_fields_added",{name:s})),_t(e),A(e),Io(e,n)}).catch(r)}}),d}function Ii(e,t,a){const n=a.row?.section||a.uid;n&&(ve=be(e.document,Nt,{items:[...nn(e,n),{label:u(e,"html_tree_remove_section"),danger:!0,onPick:()=>{oe(),on(e,n)}}],x:t.clientX,y:t.clientY,onClose:()=>{ve=null}}))}function Ai(e,t,a){oe();const n=o.sections?.find(d=>d.row?.id===a);if(n){Ii(e,t,n);return}const s=o.rows.find(d=>d.id===a);if(!s)return;rt(e,a,o.rows);const i={x:t.clientX,y:t.clientY},r=d=>{d.length&&(ve?.dismiss(),ve=be(e.document,Nt,{items:d,x:i.x,y:i.y,onClose:()=>{ve=null}}))};if(s.kind==="component"){Mi(e,s,r);return}s.kind!=="slot"&&o.canEdit&&r([...s.sectionRoot?nn(e,s.sectionRoot):[],{label:u(e,"component_make"),onPick:()=>{oe(),ai(e,s,{onDone:()=>A(e),onError:d=>{e.alert(d?.status===409?u(e,"component_exists"):u(e,"component_failed"))}})}}])}const xo=(e,t)=>{oe(),x("dock:open-template",t)};function Mi(e,t,a){if(!ca(t.src)){a([{label:u(e,"component_open_named",{name:t.name||t.src}),onPick:()=>xo(e,`view:partials/${t.src}`)}]);return}a([{label:u(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const s=Array.isArray(n.items)?n.items:[];a(s.length?s.map(i=>({label:u(e,"component_open_named",{name:i.label}),onPick:()=>xo(e,i.type)})):[{label:u(e,"component_none"),onPick:null}])}).catch(()=>a([{label:u(e,"component_none"),onPick:null}]))}function Ri(e,t,a){if(t.button!==0||x("dock:is-locked")||o.editingId||t.target?.closest?.("button, input"))return;Ke(),me=a,Re={x:t.clientX,y:t.clientY},Qe=t.currentTarget,et=t.pointerId;const n=i=>Di(e,i),s=i=>Fi(e,i);$t=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",s,!0),e.document.removeEventListener("pointercancel",s,!0),$t=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",s,!0),e.document.addEventListener("pointercancel",s,!0)}function Di(e,t){if(!me||!Re)return;const a=t.clientX-Re.x,n=t.clientY-Re.y;if(!o.dragging&&a*a+n*n<25)return;if(!o.dragging){o.dragging=!0;try{Qe?.setPointerCapture?.(et)}catch{}}t.preventDefault();const s=e.document.elementFromPoint(t.clientX,t.clientY),i=s?.closest?.("[data-sve-ht-slot]");if(i){const h=i.getAttribute("data-sve-ht-id");if(h&&h!==me){o.dropId=h,o.dropPlace="inside";return}}const r=s?.closest?.("[data-sve-ht-row]"),d=r?.getAttribute("data-sve-ht-id");if(!d||d===me){o.dropId=null,o.dropPlace=null;return}const p=o.rows.find(h=>h.id===d),k=o.rows.find(h=>h.id===me);if(!p||p.context||k&&p.path.startsWith(`${k.path}/`)){o.dropId=null,o.dropPlace=null;return}const v=r.getBoundingClientRect();o.dropId=d,o.dropPlace=ga(t.clientY-v.top,v.height,!Do(p.tag)&&!Ro(p))}function Fi(e,t){const a=me,n=o.dropId,s=o.dropPlace||"after",i=o.dragging;if(Ke(),i&&(ye=!0,e.setTimeout(()=>{ye=!1},0)),!i||x("dock:is-locked")||!a||!n||a===n)return;t?.preventDefault?.();const r=z(),d=ya(r,Ne,a,n,s);d!==r&&Le(d)}function Ke(){try{Qe?.releasePointerCapture?.(et)}catch{}$t?.(),me=null,Re=null,Qe=null,et=null,o.dragging=!1,o.dropId=null,o.dropPlace=null}function Oi(e,t,a){if(t.button!==0||!a||o.editingId||t.target?.closest?.("button, input"))return;an(),Ve=a,De={x:t.clientX,y:t.clientY},tt=t.currentTarget,ot=t.pointerId;const n=i=>Bi(e,i),s=i=>Ni(e,i);Lt=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",s,!0),e.document.removeEventListener("pointercancel",s,!0),Lt=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",s,!0),e.document.addEventListener("pointercancel",s,!0)}function Bi(e,t){if(!Ve||!De)return;const a=t.clientX-De.x,n=t.clientY-De.y;if(!o.dragging&&a*a+n*n<25)return;if(!o.dragging){o.dragging=!0;try{tt?.setPointerCapture?.(ot)}catch{}}t.preventDefault();const i=e.document.elementFromPoint(t.clientX,t.clientY)?.closest?.("[data-sve-ht-sec-uid]"),r=i?.getAttribute("data-sve-ht-sec-uid")||"";if(!r||r===Ve){o.sectionDrop=null;return}const d=i.getBoundingClientRect();o.sectionDrop={uid:r,place:t.clientY-d.top<d.height/2?"before":"after"}}function Ni(e,t){const a=Ve,n=o.sectionDrop,s=o.dragging;an(),s&&(ye=!0,e.setTimeout(()=>{ye=!1},0)),!(!s||!a||!n?.uid||n.uid===a)&&(t?.preventDefault?.(),Vi(e,a,n.uid,n.place))}function an(){try{tt?.releasePointerCapture?.(ot)}catch{}Lt?.(),Ve=null,De=null,tt=null,ot=null,o.dragging=!1,o.sectionDrop=null}function Vi(e,t,a,n){const s=lt(e)||"page_sections";for(const i of Dt(e.document)||[]){const r=Ft(i.values),d=r&&typeof r=="object"?r[s]:null;if(!Array.isArray(d))continue;const p=y=>d.findIndex(_=>_&&typeof _=="object"&&[_._visual_id,_.id,_._id].includes(y)),k=p(t),v=p(a);if(k===-1||v===-1||k===v)return!1;let h=n==="before"?v:v+1;return k<h&&(h-=1),h===k?!1:(e.postMessage({source:te,type:ee.MOVE,uid:t,toIndex:h},e.location.origin),e.setTimeout(()=>A(e),60),!0)}return!1}function sn(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function It(e,t){if(t?.kind==="component"){ji(e,t);return}if(Y.callOpen&&(Y.callOpen=!1,Y.callStore=null,G.forget(),Vt(e)),t?.kind!=="antlers"){o.inspect=null;return}const a=t.id;if(t.tag==="else"){o.inspect={key:a,title:u(e,"antlers_condition"),mode:"note",note:u(e,"antlers_else_note")};return}if(t.antlers==="loop"){const n=t.loopKind==="collection",s=pe?.id===t.id?pe.dir:"",i=t.sortDir||s;o.inspect={key:a,title:u(e,"antlers_loop"),mode:"loop",loopKind:n?"collection":"field",kinds:[{id:"field",label:u(e,"antlers_loop_field")},{id:"collection",label:u(e,"antlers_loop_collection")}],collections:sn(e),value:t.expr||"",placeholder:u(e,n?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:u(e,"antlers_sort"),dir:i,needsField:i==="asc"||i==="desc",field:t.sortField||"",pickable:!n,placeholder:u(e,n?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:u(e,"antlers_sort_none")},{id:"asc",label:u(e,"antlers_sort_asc")},{id:"desc",label:u(e,"antlers_sort_desc")},{id:"random",label:u(e,"antlers_sort_random")}]},limit:{title:u(e,"antlers_limit"),value:t.limit||"",placeholder:u(e,"antlers_limit_placeholder")},branches:[]};return}o.inspect={key:a,title:u(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:u(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:u(e,"antlers_add_elseif")},{id:"else",label:u(e,"antlers_add_else")}]}}function ji(e,t){if(!ua(e)){o.inspect=null;return}if(!t.src)return;const a=t.id;if(o.inspect={key:a,title:u(e,"component_props_values"),mode:"note",note:u(e,"code_dock_loading")},ha()){const n={},s={},i=new Map;for(const[r,d]of pa(z().slice(t.from,t.to))){const p=fa(r);p&&(r!==p||!i.has(p))&&i.set(p,d)}for(const[r,d]of i)d.bound?s[r]=d.value:n[r]=d.value;mo!==a&&(mo=a,Be.clear());for(const r of Be)r in s||(s[r]="");o.inspect=null,Y.callOpen=!0,Y.title=Y.title||u(e,"component_props"),Y.callTitle=t.klass||t.name||t.src,Y.callStore=G.ui,G.ui.canBind=!0,G.ui.dataTitle=u(e,"data_vars_title"),G.ui.exprPlaceholder=u(e,"component_props_expr"),G.ui.onToggleBind=(r,d)=>qi(e,r,d),G.ui.onExpr=(r,d)=>So(e,r,d),G.ui.onPickData=(r,d)=>x("dock:data-menu",{anchor:d,at:t.from,onPick:p=>So(e,r,String(p?.var||"").trim())}),G.load(e,{key:`${t.src}::${a}`,src:t.src,params:n,bindings:s,readOnly:x("dock:is-locked")===!0}),G.watch(e,{src:t.src,write:r=>Ki(e,r,s)}),Vt(e);return}ma(e,t.src).then(n=>{if(o.inspect?.key===a){if(!n.length){o.inspect={key:a,title:u(e,"component_props_values"),mode:"note",note:u(e,"component_props_values_none")};return}o.inspect={key:a,title:u(e,"component_props_values"),mode:"props",inheritLabel:u(e,"component_props_inherit"),rows:va(n,z().slice(t.from,t.to))}}})}function Ki(e,t,a={}){const n=o.rows.find(r=>r.id===O);if(n?.kind!=="component"||x("dock:is-locked"))return;let s=z(),i=n.to;for(const[r,d]of Object.entries(t||{})){if(r in a)continue;const p=s.length,k=jt(s,{from:n.from,to:i},r,d);k!==s&&(i+=k.length-p,s=k)}s!==z()&&(Le(s,{save:!0}),A(e))}function qi(e,t,a){a?Be.add(t):Be.delete(t),rn(e,t,"",a),A(e)}function So(e,t,a){Be.add(t),rn(e,t,a,!0),A(e)}function rn(e,t,a,n){const s=o.rows.find(d=>d.id===O);if(s?.kind!=="component"||x("dock:is-locked"))return;const i=z(),r=jt(i,s,t,a,{bound:n});r!==i&&Le(r,{save:!0})}function st(){const e=o.rows.find(t=>t.id===O);return e?.kind==="antlers"&&!x("dock:is-locked")?e:null}function ge(e,t){const a=st();if(!a)return;const n=z(),s=t(n,a);s!==n&&(Le(s),A(e))}function wo(e,t,a,n){const s=o.rows.find(d=>d.id===O);if(s?.kind!=="component"||x("dock:is-locked"))return;const i=z(),r=jt(i,s,t,a,{bound:n});r!==i&&(Le(r,{save:!0}),A(e))}function Gi(e,t){ge(e,(a,n)=>n.antlers==="loop"?St(a,n,n.loopKind==="collection"?"collection":"field",t):si(a,n,t))}function zi(e,t){const a=st();if(!a||a.antlers!=="loop")return;const n=a.loopKind==="collection"?"collection":"field";if(t!==n){if(t==="collection"){const s=sn(e)[0]?.handle;if(!s)return;ge(e,(i,r)=>St(i,r,"collection",s));return}ge(e,(s,i)=>St(s,i,"field",i.handle||"items"))}}function Ui(e,t){ge(e,(a,n)=>ci(a,n,t))}function Xi(e,t){if(!e||!t||Ro(t)||Do(t.tag))return null;const a=da(e,t);if(a<t.openTo)return null;const n=e.lastIndexOf(`
`,a-1)+1;return e.slice(n,a).trim()===""&&n>t.openTo?n-1:a}function rt(e,t,a){if(ye)return;const n=(a||o.rows).find(s=>s.id===t);n&&(O=t,o.rows.forEach(s=>{s.current=s.id===t}),It(e,n),!Gt()&&(x("dock:reveal-html",{from:n.from,to:n.to,caret:Xi(z(),n)}),x("dock:tw-follow"),de({source:te,type:ee.SVE_HTML_PICK_FOCUS,path:n.path},e)))}function Yi(e,t){if(!t)return"";const a=[],n=(s,i)=>{for(const r of s||[]){const d=i||r.path===e;r.kind==="component"&&r.src===t&&a.push({path:r.path,inside:d}),n(r.children,d)}};return n(Ne,!1),(a.find(s=>s.inside)||a[0])?.path||""}function Wi(e,t){if(!t||!W(e.document))return;$e=!1,ze(t),A(e);const a=o.rows.find(n=>n.path===t);a&&(rt(e,a.id,o.rows),e.setTimeout(()=>{W(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function At(e){if(We)return;const t=()=>{o.editingId||o.dragging||(e.clearTimeout(Je),Je=e.setTimeout(()=>{W(e.document)&&A(e)},80))},a=()=>{if(t(),x("dock:on-empty-page")===!0){const n=ut(e,e.document);n[0]&&ht(e,e.document,n,n[0].uid,"")}};We=Ho("dock:html-changed",t),e.document.addEventListener("sve-page-structure",a),Ct=()=>{e.document.removeEventListener("sve-page-structure",a)}}function Zi(e){We?.(),We=null,Ct?.(),Ct=null,e?.clearTimeout?.(Je),Je=0}function Xt(e){const t=W(e.document);if(de({source:te,type:ee.SVE_HTML_PICK,on:!1},e),Zi(e),G.forget(),Y.callOpen=!1,Y.callStore=null,Vt(e),Ke(),oe(),aa(e),O=null,o.inspect=null,o.editingId=null,o.draft="",o.sections=[],o.pageBuilder=!1,o.layoutFile=!1,Q="",e?.clearTimeout?.(Ce),!t){Tt(e);return}t.remove(),Rt.headerTab==="html_tree"&&Xn(e,null),Hn(e),$o(e),Lo(e),Tt(e)}function il(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=Xe,Ue(t,Vo,{title:u(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>Xt(e)))}function ll(e){At(e),A(e)}function ln(e){const t=e.document;if(!An(e,"html_tree"))return;if(W(t)){At(e),A(e);return}if(!Zo(t))return;$e=!0,V.clear(),Mn(e,[Xe]);const a=t.createElement("div");a.id=Xe,a.style.cssText=Rn,Ue(a,Vo,{title:u(e,"html_tree")}),a.querySelector("[data-sve-close]")?.addEventListener("click",()=>Xt(e)),Dn(e,a),$o(e),Lo(e),Tt(e),At(e),A(e)}function dl(e){if(W(e.document)){Xt(e);return}ln(e)}Bt("html-tree:open-section",e=>{const t=window,a=t.document,n=ut(t,a),s=n.find(i=>i.uid===e||i.ids.includes(e));return s?(ht(t,a,n,s.uid,""),{uid:s.uid,ids:s.ids}):null});Bt("html-tree:from-preview",({path:e,src:t}={})=>{Ao(window,e)||Wi(window,Yi(e,t)||e)});Bt("html-tree:arm-pick",e=>{const t=window;return e?(tn(t,ct(z())),!0):(W(t.document)||de({source:te,type:ee.SVE_HTML_PICK,on:!1},t),!0)});function cl(){le.clear(),we.clear(),ke.length=0}export{ui as HTML_TREE_STYLE_ID,rl as armHtmlTreePrefetch,cl as clearHtmlTreeTemplates,oe as closeHtmlTreeMenu,Xt as closeHtmlTreePanel,hi as ensureHtmlTreeStyles,il as fillHtmlTreePane,O as htmlTreeActiveId,W as htmlTreePanel,Je as htmlTreeTimer,We as htmlTreeUnhook,ln as openHtmlTreePanel,A as renderHtmlTree,ll as showHtmlTreePane,Zi as stopWatchHtmlTreeDock,dl as toggleHtmlTreePanel,At as watchHtmlTreeDock};
