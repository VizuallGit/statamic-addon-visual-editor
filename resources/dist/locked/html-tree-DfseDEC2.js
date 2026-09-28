const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-AWaJHJyk.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{_ as qe,I as q,J as yo,K as Ae,o as p,k as y,l as L,G as $,m as E,F as R,L as ve,n as V,b4 as ko,x as C,O as wt,b5 as bo,A as ce,t as u,C as _o,a as T,b6 as To,b7 as Ln,z as Bt,b8 as sn,b9 as an,ba as xo,bb as So,bc as wo,bd as $o,be as lt,D as ue,av as Co,bf as n,u as l,w as Lo,v as Eo,M as le,bg as Po,B as Ho,bh as X,bi as Io,bj as Mo,H as Re,j as fe,bk as Ao,bl as Ro,bm as rn,N as Fo,Q as Oo,s as Nt,aw as $t,as as Do,aQ as En,aR as Pn,i as Bo,an as ln,a1 as Fe,X as No,aP as jo,at as Vo,au as Ko,a2 as Hn,ae as qo,bn as In,bo as Go,bp as dn,bq as Mn,a0 as An,br as Uo,E as Rn,aa as dt,T as jt,U as Vt,aA as ct,aB as Ne,S as Kt,bs as zo,bt as Xo,bu as Fn,bv as Yo,bw as Wo,bx as Zo,by as Jo,bz as Qo,aT as es,aU as ts,az as ns,bA as os,b0 as ss,am as qt,aM as as,aH as rs}from"./addon-DrGpMDsy.js";import{M as Q,S as ee}from"./protocol-Brvy2KuB.js";import{canEditFields as is,currentSetHandle as ls,openFieldsetOverlay as On,openGlobalFieldsOverlay as ds}from"./section-fields-CzMAfWLL.js";import{H as Ye,ad as cs}from"./ai-text-icon-CaHMo9Tt.js";import{I as Y,J as us,K as ut,L as hs,t as ps,M as Gt,z as fs,D as ms,d as ht,N as vs,m as cn,O as Dn,v as gs,Q as Bn,H as we,R as ys,S as Ut,c as ks,T as Nn,U as jn,V as bs,h as _s,a as Ts,W as xs,X as Ss,Y as ws,Z as $s,$ as Cs,a0 as Ls,a1 as Es,a2 as Ps,a3 as Hs,a4 as Is}from"./locked-tags-Cd_MU2HE.js";import{b as Ms}from"./html-pick-align-CLq5l-p4.js";import"./FieldsetOverlay-dKhfwKF2.js";const As={class:"sve-dialog__title"},Rs={for:"sve-new-section-group"},Fs={class:"sve-dialog__row"},Os=["disabled"],Ds=["value"],Bs=["title","aria-label"],Ns={key:0,class:"sve-dialog__add-group"},js={for:"sve-new-section-group-name"},Vs={class:"sve-dialog__row"},Ks=["placeholder","disabled"],qs=["disabled"],Gs=["disabled"],Us={for:"sve-new-section-name"},zs=["placeholder"],Xs={key:1,class:"sve-dialog__toggle"},Ys={key:2,class:"sve-dialog__note"},Ws={class:"sve-dialog__actions"},Zs=["disabled"],Js=["disabled"],Qs={__name:"NewSectionPrompt",props:{heading:{type:String,required:!0},groupLabel:{type:String,required:!0},nameLabel:{type:String,required:!0},placeholder:{type:String,default:""},note:{type:String,default:""},groups:{type:Array,required:!0},toggleLabel:{type:String,default:""},toggleOn:{type:Boolean,default:!0},cancelLabel:{type:String,required:!0},saveLabel:{type:String,required:!0},onOk:{type:Function,required:!0},onClose:{type:Function,required:!0},addGroupLabel:{type:String,default:""},addGroupNameLabel:{type:String,default:""},addGroupPlaceholder:{type:String,default:""},onAddGroup:{type:Function,default:null}},setup(e){const t=e,s=q(""),o=q([...t.groups]),a=q(t.groups[0]?.key??""),i=q(!1),r=q(""),d=q(null),h=q(!1);function k(){i.value=!0,r.value="",Ae(()=>d.value?.focus())}function v(){i.value=!1,r.value="",Ae(()=>_.value?.focus())}async function f(){const H=r.value.trim();if(!H||h.value||!t.onAddGroup){d.value?.focus();return}h.value=!0;const P=await t.onAddGroup(H);if(h.value=!1,!P?.key){d.value?.focus();return}o.value.some(F=>F.key===P.key)||o.value.push(P),a.value=P.key,i.value=!1,r.value="",Ae(()=>_.value?.focus())}function b(H){H.key==="Enter"?(H.preventDefault(),f()):H.key==="Escape"&&(H.stopPropagation(),v())}const x=q(t.toggleOn),_=q(null),M=q(!1);yo(()=>Ae(()=>_.value?.focus()));function g(){const H=s.value.trim();if(!H||o.value.length&&!a.value||M.value){_.value?.focus();return}M.value=!0,t.onOk(H,a.value,x.value)}function m(H){H.target===H.currentTarget&&t.onClose()}function S(H){H.key==="Enter"?g():H.key==="Escape"&&t.onClose()}return(H,P)=>(p(),y("div",{class:"sve-dialog-overlay",onClick:m},[L("div",{class:"sve-dialog",onClick:P[5]||(P[5]=$(()=>{},["stop"]))},[L("div",As,E(e.heading),1),o.value.length?(p(),y(R,{key:0},[L("label",Rs,E(e.groupLabel),1),L("div",Fs,[ve(L("select",{id:"sve-new-section-group","onUpdate:modelValue":P[0]||(P[0]=F=>a.value=F),disabled:i.value,onKeydown:S},[(p(!0),y(R,null,V(o.value,F=>(p(),y("option",{key:F.key,value:F.key},E(F.display),9,Ds))),128))],40,Os),[[ko,a.value]]),e.onAddGroup&&!i.value?(p(),y("button",{key:0,type:"button",class:"is-add",title:e.addGroupLabel,"aria-label":e.addGroupLabel,"data-sve-new-group":"",onClick:k},[...P[6]||(P[6]=[L("span",{"aria-hidden":"true"},"+",-1)])],8,Bs)):C("",!0)]),i.value?(p(),y("div",Ns,[L("label",js,E(e.addGroupNameLabel||e.addGroupLabel),1),L("div",Vs,[ve(L("input",{id:"sve-new-section-group-name",ref_key:"groupInput",ref:d,"onUpdate:modelValue":P[1]||(P[1]=F=>r.value=F),type:"text",placeholder:e.addGroupPlaceholder,disabled:h.value,"data-sve-new-group-name":"",onKeydown:b},null,40,Ks),[[wt,r.value]]),L("button",{type:"button",class:"is-primary is-small",disabled:h.value,"data-sve-new-group-create":"",onClick:f},E(e.saveLabel),9,qs),L("button",{type:"button",class:"is-cancel is-small",disabled:h.value,onClick:v},E(e.cancelLabel),9,Gs)])])):C("",!0)],64)):C("",!0),L("label",Us,E(e.nameLabel),1),ve(L("input",{id:"sve-new-section-name",ref_key:"input",ref:_,"onUpdate:modelValue":P[2]||(P[2]=F=>s.value=F),type:"text",placeholder:e.placeholder,onKeydown:S},null,40,zs),[[wt,s.value]]),e.toggleLabel?(p(),y("label",Xs,[ve(L("input",{"onUpdate:modelValue":P[3]||(P[3]=F=>x.value=F),type:"checkbox",onKeydown:S},null,544),[[bo,x.value]]),L("span",null,E(e.toggleLabel),1)])):C("",!0),e.note?(p(),y("p",Ys,E(e.note),1)):C("",!0),L("div",Ws,[L("button",{type:"button",class:"is-cancel",disabled:M.value,onClick:P[4]||(P[4]=(...F)=>e.onClose&&e.onClose(...F))},E(e.cancelLabel),9,Zs),L("button",{type:"button",class:"is-primary",disabled:M.value,onClick:g},E(e.saveLabel),9,Js)])])]))}},Vn=qe(Qs,[["__scopeId","data-v-6501522a"]]),Kn=["section","div","article","aside","nav","header","footer"];function ea(e){const t=Kn.includes(e)?e:"div";return`<${t} class="${t==="section"?"[ ] py-800":"[ ]"}">
    
</${t}>`}function ta(e,t,s=null){const o=String(e||""),a=ea(t),i=s?s.wrapFrom??s.from:NaN,r=s?s.wrapTo??s.to:NaN;if(!Number.isInteger(i)||!Number.isInteger(r)||i<0||r>o.length||i>r){const f=`${o.replace(/\s+$/,"")}${o.trim()?`

`:""}`;return{html:`${f}${a}
`,at:f.length}}const d=o.lastIndexOf(`
`,i-1)+1,h=o.slice(d,i),k=/^[ \t]*$/.test(h)?h:"",v=a.split(`
`).map(f=>f&&k+f).join(`
`);return{html:`${o.slice(0,r)}
${v}${o.slice(r)}`,at:r+1+k.length}}const zt="/!/sve/section-types",un="static_sections";async function na(e){const t=await e.fetch(`${zt}?${To(e)}`,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!t.ok)throw new Error(`section-types ${t.status}`);const s=await t.json();if(Array.isArray(s.groups)&&s.groups.length)return s.groups.filter(a=>a&&a.handle&&a.handle!==un).map(a=>({key:a.handle,display:a.display||a.handle}));const o=new Map;for(const a of s.types||[])a?.group&&a.group!==un&&!o.has(a.group)&&o.set(a.group,a.group_display||a.group);return[...o].map(([a,i])=>({key:a,display:i}))}async function oa(e,t){const s=await e.fetch(`${zt}/groups`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Bt(e),"X-Requested-With":"XMLHttpRequest",Accept:"application/json"},body:JSON.stringify({display:t,...Ln(e)})}),o=await s.json().catch(()=>({}));if(!s.ok||!o.group?.handle)throw new Error(o?.error==="bad_name"?"bad_name":`section-types/groups ${s.status}`);return e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale")),{key:o.group.handle,display:o.group.display||o.group.handle}}const je=new Map;function sa(e){e?.handle&&je.set(e.handle,{static:!!e.static,hidden:!!e.hidden})}function aa(e,t){return t?je.has(t)?je.get(t).static:e.Statamic?.$config?.get?.("sveSetMeta")?.[t]?.static===!0:!1}function ra(e,t){if(!t)return!1;if(je.has(t))return je.get(t).hidden;const s=e.Statamic?.$config?.get?.("sveSectionTypes");return Array.isArray(s)&&s.some(o=>o?.handle===t&&o.hidden===!0)}async function qn(e,t,s){const o=await e.fetch(zt,{method:t,headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Bt(e),Accept:"application/json"},credentials:"same-origin",body:JSON.stringify({...s,...Ln(e)})}),a=await o.json().catch(()=>({}));if(!o.ok){const i=new Error(a.error||`section-types ${o.status}`);throw i.reason=a.error,i}return sa(a.section),a}function ia(e,{display:t,group:s="",static:o=!1,hidden:a=!1}){return qn(e,"POST",{display:t,group:s,static:o,hidden:a})}function hn(e,{handle:t,hidden:s,fields:o=!1}){const a={handle:t,fields:o};return typeof s=="boolean"&&(a.hidden=s),qn(e,"PATCH",a)}async function la(e,t,s=null,o=null){if(!t||typeof sn!="function"||typeof an!="function")return null;const a=await sn(e,t);if(!a)return null;o&&Array.isArray(a.definitions)&&xo(t,{display:o.display||t,icon:o.icon||null,hide:o.hidden===!0,fields:a.definitions,group_display:o.group_display||o.group||""},o.group||"");const i=So(),r=wo(e,"page",{handle:t},a?.defaults,i),d=$o(r,a?.new||{},a?.defaults);return an(e,e.document,s,r,d)?r:null}const pn=700,da=17;function ca(e,t){const s=(t||[]).filter(Boolean);if(!s.length)return;let o=0;const a=()=>{o+=1;const i=lt(e),r=i?s.some(d=>i.querySelector(`[data-sid="${CSS.escape(d)}"]`)):!0;r&&ue({source:ee,type:Q.SVE_ACTIVATE,ids:s},e),(r?!i&&o<6:o<da)&&e.setTimeout(a,pn)};e.setTimeout(a,pn)}function Gn(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function ua(e){return new Promise(t=>{let s=!1;const o=i=>{s||(s=!0,a.dismiss(),t(i==="static"||i==="fields"?i:null))},a=ce(e.document,_o,{title:u(e,"section_new_kind"),body:u(e,"section_new_kind_note"),buttons:[{value:"cancel",label:u(e,"cancel"),variant:"ghost"},{value:"static",label:u(e,"section_new_static"),variant:"primary"},{value:"fields",label:u(e,"section_new_with_fields"),variant:"primary"}],onPick:o,onClose:()=>o(null)})})}function ha(e,t,s=null){if(T("dock:is-locked")===!0)return e.Statamic?.$toast?.error(u(e,"code_dock_locked")),null;const{html:o,at:a}=ta(String(T("dock:html")||""),t,s);return T("dock:set-html",o)!==!0?(e.Statamic?.$toast?.error(u(e,"section_new_failed")),null):(T("dock:save-now"),e.Statamic?.$toast?.success(u(e,"html_tree_element_added",{tag:t})),a)}async function Un(e,t,s,{afterUid:o,onDone:a,onError:i}){try{const r=await ia(e,s);t.dismiss(),e.Statamic?.$toast?.success(u(e,"section_created",{name:r.section?.display||s.display})),Ct(e);const d=r.section?.handle?{...r.section,group_display:(r.section_types||[]).find(k=>k?.handle===r.section.handle)?.group_display||""}:null,h=await la(e,r.section?.handle,o,d);!h&&r.section?.handle&&T("dock:open-template",r.section.handle),a?.({...r,uid:h?._visual_id||""})}catch(r){t.dismiss(),e.Statamic?.$toast?.error(u(e,r.reason==="bad_name"?"section_new_bad_name":"section_new_failed")),i?.(r)}}function Ct(e){e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"))}function pa(e,{afterUid:t=null,onDone:s,onError:o,onClose:a}={}){const i=ce(e.document,Vn,{heading:u(e,"static_section_new"),groupLabel:"",nameLabel:u(e,"section_new_name"),placeholder:u(e,"section_new_placeholder"),note:u(e,"static_section_note"),groups:[],toggleLabel:u(e,"static_section_insertable"),cancelLabel:u(e,"cancel"),saveLabel:u(e,"section_new_create"),onClose:a,onOk:(r,d,h)=>{Un(e,i,{display:r,static:!0,hidden:!h},{afterUid:t,onDone:s,onError:o})}})}function fa(e,{afterUid:t=null,onDone:s,onError:o,onClose:a}={}){(async()=>{let i=[];try{i=await na(e)}catch(d){o?.(d),e.Statamic?.$toast?.error(u(e,"section_new_failed"));return}if(!i.length){o?.(new Error("no groups")),e.Statamic?.$toast?.error(u(e,"section_new_failed"));return}const r=ce(e.document,Vn,{heading:u(e,"section_new"),groupLabel:u(e,"section_new_group"),nameLabel:u(e,"section_new_name"),placeholder:u(e,"section_new_placeholder"),note:u(e,"section_new_note"),groups:i,addGroupLabel:u(e,"section_new_group_add"),addGroupNameLabel:u(e,"section_new_group_name"),addGroupPlaceholder:u(e,"section_new_group_placeholder"),onAddGroup:async d=>{try{const h=await oa(e,d);return e.Statamic?.$toast?.success(u(e,"section_group_created",{name:h.display})),h}catch(h){return e.Statamic?.$toast?.error(u(e,h?.message==="bad_name"?"section_new_bad_name":"section_group_failed")),null}},cancelLabel:u(e,"cancel"),saveLabel:u(e,"section_new_create"),onClose:a,onOk:(d,h)=>{Un(e,r,{display:d,group:h},{afterUid:t,onDone:s,onError:o})}})})()}const ma={key:0,class:"sve-ht-inspect"},va={class:"sve-ht-inspect__head"},ga={key:0,class:"sve-ht-inspect__note"},ya={key:2,class:"sve-ht-inspect__props"},ka={class:"sve-ht-inspect__proplabel"},ba={key:0},_a=["value","disabled","onChange"],Ta={value:""},xa=["value"],Sa=["value"],wa=["value","placeholder","onChange"],$a=["title","disabled","onClick"],Ca=["title","disabled","onClick"],La={key:0,class:"sve-ht-inspect__seg"},Ea=["data-active","disabled","onClick"],Pa=["value","disabled"],Ha={key:0,value:""},Ia=["value"],Ma={key:2,class:"sve-ht-inspect__box"},Aa=["value","placeholder","disabled","onKeydown"],Ra=["title","disabled"],Fa={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Oa=["value","disabled"],Da=["value"],Ba={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},Na=["value","placeholder","disabled"],ja=["title","disabled"],Va={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Ka=["value","placeholder","disabled"],qa={key:4,class:"sve-ht-inspect__add"},Ga=["disabled","onClick"],vt='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',Ua='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',za={__name:"HtmlTreeInspector",setup(e){const t=q(null);Co(t,k=>n.onPropHost?.(k||null));const s=q(null),o=q(null);function a(k){n.onInspectCommit?.(k.target.value)}function i(k,v,f){!k||!v||(k.value=v,k.focus(),k.setSelectionRange(v.length,v.length),f(v))}function r(k,v){n.onInspectData?.(k.currentTarget,f=>n.onPropValue?.(v.handle,f,!0))}function d(k){n.onInspectData?.(k.currentTarget,v=>i(s.value,v,f=>n.onInspectCommit?.(f)))}function h(k){n.onInspectData?.(k.currentTarget,v=>i(o.value,v,f=>n.onLoopSortField?.(f)))}return(k,v)=>l(n).inspect?(p(),y("div",ma,[L("div",va,E(l(n).inspect.title),1),l(n).inspect.mode==="note"?(p(),y("div",ga,E(l(n).inspect.note),1)):l(n).inspect.mode==="statamic"?(p(),y("div",{key:1,ref_key:"propHost",ref:t,class:"sve-ht-inspect__form"},null,512)):l(n).inspect.mode==="props"?(p(),y("div",ya,[(p(!0),y(R,null,V(l(n).inspect.rows,f=>(p(),y("label",{key:f.handle,class:"sve-ht-inspect__prop"},[L("span",ka,[Lo(E(f.label)+" ",1),f.bound?(p(),y("em",ba,":")):C("",!0)]),L("span",{class:Eo(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":f.type==="select"||f.type==="link"}])},[f.type==="select"&&!f.bound?(p(),y("select",{key:0,value:f.value,disabled:!l(n).canEdit,onChange:b=>l(n).onPropValue?.(f.handle,b.target.value,!1)},[L("option",Ta,E(f.placeholder||l(n).inspect.inheritLabel),1),f.value&&!f.options.includes(f.value)?(p(),y("option",{key:0,value:f.value},E(f.value),9,xa)):C("",!0),(p(!0),y(R,null,V(f.options,b=>(p(),y("option",{key:b,value:b},E(b),9,Sa))),128))],40,_a)):(p(),y("input",{key:1,type:"text",value:f.value,placeholder:f.placeholder||l(n).inspect.inheritLabel,onChange:b=>l(n).onPropValue?.(f.handle,b.target.value,f.bound)},null,40,wa)),f.type==="link"?(p(),y("button",{key:2,type:"button","data-sve-ht-data":"",title:l(n).pageTitle,disabled:!l(n).canEdit,onClick:b=>l(n).onPropPage?.(b.currentTarget,f.handle),innerHTML:Ua},null,8,$a)):C("",!0),L("button",{type:"button","data-sve-ht-data":"",title:l(n).dataTitle,disabled:!l(n).canEdit,onClick:b=>r(b,f),innerHTML:vt},null,8,Ca)],2)]))),128))])):(p(),y(R,{key:3},[l(n).inspect.mode==="loop"?(p(),y("div",La,[(p(!0),y(R,null,V(l(n).inspect.kinds,f=>(p(),y("button",{key:f.id,type:"button","data-active":f.id===l(n).inspect.loopKind?"":void 0,disabled:!l(n).canEdit,onClick:b=>l(n).onLoopKind?.(f.id)},E(f.label),9,Ea))),128))])):C("",!0),l(n).inspect.mode==="loop"&&l(n).inspect.loopKind==="collection"?(p(),y("select",{key:l(n).inspect.key+":"+l(n).inspect.value,value:l(n).inspect.value,disabled:!l(n).canEdit,onChange:a},[l(n).inspect.value?C("",!0):(p(),y("option",Ha,E(l(n).inspect.placeholder),1)),(p(!0),y(R,null,V(l(n).inspect.collections,f=>(p(),y("option",{key:f.handle,value:f.handle},E(f.title),9,Ia))),128))],40,Pa)):(p(),y("div",Ma,[(p(),y("input",{ref_key:"field",ref:s,key:l(n).inspect.key,type:"text",value:l(n).inspect.value,placeholder:l(n).inspect.placeholder,disabled:!l(n).canEdit,spellcheck:"false",onKeydown:[v[0]||(v[0]=$(()=>{},["stop"])),le($(a,["prevent"]),["enter"])],onBlur:a},null,40,Aa)),L("button",{type:"button","data-sve-ht-data":"",title:l(n).dataTitle,disabled:!l(n).canEdit,innerHTML:vt,onMousedown:v[1]||(v[1]=$(()=>{},["prevent"])),onClick:$(d,["stop","prevent"])},null,40,Ra)])),l(n).inspect.sort?(p(),y(R,{key:3},[L("div",Fa,E(l(n).inspect.sort.title),1),(p(),y("select",{key:l(n).inspect.key+":dir:"+l(n).inspect.sort.dir,value:l(n).inspect.sort.dir,disabled:!l(n).canEdit,onChange:v[2]||(v[2]=f=>l(n).onLoopSortDir?.(f.target.value))},[(p(!0),y(R,null,V(l(n).inspect.sort.dirs,f=>(p(),y("option",{key:f.id,value:f.id},E(f.label),9,Da))),128))],40,Oa)),l(n).inspect.sort.needsField?(p(),y("div",Ba,[(p(),y("input",{ref_key:"sortField",ref:o,key:l(n).inspect.key+":field",type:"text",value:l(n).inspect.sort.field,placeholder:l(n).inspect.sort.placeholder,disabled:!l(n).canEdit,spellcheck:"false",onKeydown:[v[3]||(v[3]=$(()=>{},["stop"])),v[4]||(v[4]=le($(f=>l(n).onLoopSortField?.(f.target.value),["prevent"]),["enter"]))],onBlur:v[5]||(v[5]=f=>l(n).onLoopSortField?.(f.target.value))},null,40,Na)),l(n).inspect.sort.pickable?(p(),y("button",{key:0,type:"button","data-sve-ht-data":"",title:l(n).dataTitle,disabled:!l(n).canEdit,innerHTML:vt,onMousedown:v[6]||(v[6]=$(()=>{},["prevent"])),onClick:$(h,["stop","prevent"])},null,40,ja)):C("",!0)])):C("",!0),L("div",Va,E(l(n).inspect.limit.title),1),(p(),y("input",{key:l(n).inspect.key+":limit",type:"number",min:"1",value:l(n).inspect.limit.value,placeholder:l(n).inspect.limit.placeholder,disabled:!l(n).canEdit,onKeydown:[v[7]||(v[7]=$(()=>{},["stop"])),v[8]||(v[8]=le($(f=>l(n).onLoopLimit?.(f.target.value),["prevent"]),["enter"]))],onBlur:v[9]||(v[9]=f=>l(n).onLoopLimit?.(f.target.value))},null,40,Ka))],64)):C("",!0),l(n).inspect.branches?.length?(p(),y("div",qa,[(p(!0),y(R,null,V(l(n).inspect.branches,f=>(p(),y("button",{key:f.id,type:"button",disabled:!l(n).canEdit,onClick:b=>l(n).onAddBranch?.(f.id)},E(f.label),9,Ga))),128))])):C("",!0)],64))])):C("",!0)}},Xa=qe(za,[["__scopeId","data-v-26254b75"]]),Ya={class:"sve-html-tree"},Wa={class:"sve-pane-bar","data-sve-pane-bar":""},Za={"data-sve-right-title":""},Ja={"data-sve-right-actions":""},Qa=["aria-pressed","title","aria-label"],er={class:"sve-ht-tools"},tr=["title"],nr=["placeholder","aria-label","value"],or=["aria-label"],sr=["title","aria-label"],ar=["title"],rr={class:"sve-ht-used-by__label"},ir={class:"sve-ht-used-by__text"},lr={key:2,class:"sve-tree-exit"},dr=["title"],cr=["title"],ur='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',hr='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',pr='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',fr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',mr={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const t=u(window,"html_tree_search");n.layers=Po(window);const s=u(window,"html_tree_layers_on"),o=u(window,"html_tree_layers_off");function a(){Mo(window,!n.layers)}const i=Gn(window),r=u(window,"section_new"),d=u(window,"html_tree_add_element"),h=q(!1);function k(){h.value=!1}async function v(M){if(!M)return;await Ae(),n.onRefresh?.();const g=T("html-tree:open-section",M);g&&ca(window,g.ids)}function f(){return n.rows.find(M=>M.current&&!M.context&&!M.synthetic)||null}function b(M){const g=M.getBoundingClientRect(),m=f();let S=null;S=ce(document,ut,{items:Kn.map(H=>({label:H,onPick:()=>{S?.dismiss(),S=null,k();const P=ha(window,H,m);P!==null&&(n.selectFrom={at:P,left:4})}})),x:Math.round(g.left),y:Math.round(g.bottom+4),onClose:()=>{S=null,k()}})}function x(M){if(!h.value){if(h.value=!0,!(n.sections.length||n.pageBuilder)){b(M.currentTarget);return}(async()=>{const g=await ua(window);if(!g){k();return}const m=n.sections.length?n.sections[n.sections.length-1].uid:null,S=H=>{k(),v(H?.uid)};if(g==="static"){pa(window,{afterUid:m,onDone:S,onError:k,onClose:k});return}fa(window,{afterUid:m,onDone:S,onError:k,onClose:k})})()}}function _(M){const g=!!n.query;n.query=M,g!==!!M&&n.onQuery?.()}return(M,g)=>(p(),y("div",Ya,[L("div",Wa,[L("div",Za,E(e.title),1),L("div",Ja,[L("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":l(n).layers?"true":"false",title:l(n).layers?l(o):l(s),"aria-label":l(n).layers?l(o):l(s),innerHTML:ur,onClick:a},null,8,Qa),g[5]||(g[5]=Ho('<button type="button" data-sve-right-pin aria-pressed="false" data-v-44d70ae2></button><button type="button" data-sve-close aria-label="Close" data-v-44d70ae2><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-44d70ae2><path d="M18 6 6 18" data-v-44d70ae2></path><path d="m6 6 12 12" data-v-44d70ae2></path></svg></button>',2))])]),L("div",er,[L("label",{class:"sve-ht-search",title:l(t)},[L("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:pr}),L("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:l(t),"aria-label":l(t),value:l(n).query,autocomplete:"off",spellcheck:"false",onInput:g[0]||(g[0]=m=>_(m.target.value)),onKeydown:[g[1]||(g[1]=$(()=>{},["stop"])),g[2]||(g[2]=le($(m=>_(""),["prevent"]),["escape"]))]},null,40,nr),l(n).query?(p(),y("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":l(t),innerHTML:fr,onClick:g[3]||(g[3]=m=>_(""))},null,8,or)):C("",!0)],8,tr),l(i)&&(l(n).sections.length||l(n).pageBuilder||l(n).rows.length&&!l(n).layoutFile)?(p(),y("button",{key:0,type:"button",class:"sve-ht-new",title:l(n).sections.length||l(n).pageBuilder?l(r):l(d),"aria-label":l(n).sections.length||l(n).pageBuilder?l(r):l(d),innerHTML:hr,onClick:x},null,8,sr)):C("",!0)]),l(n).usedBy?(p(),y("div",{key:0,class:"sve-ht-used-by",title:`${l(n).usedBy.label}: ${l(n).usedBy.text}`},[L("span",rr,E(l(n).usedBy.label)+":",1),L("span",ir,E(l(n).usedBy.text),1)],8,ar)):C("",!0),l(Y).inSidebar?C("",!0):(p(),X(us,{key:1})),g[6]||(g[6]=L("div",{"data-sve-html-tree-list":""},null,-1)),Io(Xa),l(n).exitOpen&&!l(Y).inSidebar?(p(),y("div",lr,[L("span",{class:"sve-tree-exit__name",title:l(n).exitName},E(l(n).exitName),9,dr),L("button",{type:"button",class:"sve-tree-exit__go",title:l(n).exitTitle,onClick:g[4]||(g[4]=m=>l(n).onExit?.())},E(l(n).exitLabel),9,cr)])):C("",!0)]))}},zn=qe(mr,[["__scopeId","data-v-44d70ae2"]]);function Xn(e){return String(e||"").trim().toLowerCase()}function Lt(e,t){return t?[e.name,e.tag,e.klass,e.label,e.src].filter(s=>typeof s=="string"&&s).join(" ").toLowerCase().includes(t):!0}function vr(e,t){const s=Xn(t);if(!s)return{rows:e,hits:new Set};const o=new Set;for(const r of e)Lt(r,s)&&o.add(r.path);const a=[...o];return{rows:e.filter(r=>o.has(r.path)||a.some(d=>d.startsWith(`${r.path}/`))),hits:o}}const gr=["title"],yr={"data-sve-ht-indent":"","aria-hidden":"true"},kr=["data-sve-ht-cat"],br={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},_r={key:2,"data-sve-ht-letter":""},Tr=["innerHTML"],xr=["title"],Sr=["title"],wr={key:1,"data-sve-ht-kind":""},$r={key:3,"data-sve-ht-name":""},Cr={key:4,"data-sve-ht-actions":""},Lr=["title"],Er={key:5,"data-sve-ht-actions":""},Pr=["data-on","title","innerHTML"],Hr=["disabled","title","innerHTML"],Ir=["disabled","title"],Mr=["disabled","title"],Ar=["disabled","title"],Rr=["data-sve-ht-id"],fn='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',Fr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',Or='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Dr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',Br='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',Nr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',jr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',Vr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',Kr={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const t=is(window),s=u(window,"section_fields");function o(){const g=ls();if(!g){window.Statamic?.$toast?.error(u(window,"section_fields_none"));return}On(window,g)}function a(g){return g.synthetic?g.frame==="main"?n.frameMainTitle:g.frame==="template"?n.frameTemplateTitle:n.frameOpenTitle:g.kind==="component"?g.src?`partial:${g.src}`:g.tag:g.name?`${g.tag} ${g.name}`:g.tag}function i(g){return!!g.section}function r(g){return!!g.frame}function d(g){return g.kind==="slot"}function h(g){return!!g.context}function k(g,m){h(m)||r(m)||d(m)||(i(m)?n.onSectionPointerDown?.(g,m.section):m.sectionRoot?n.onSectionPointerDown?.(g,m.sectionRoot):n.onPointerDown?.(g,m.id))}function v(g){if(g.synthetic){n.onFrame?.(g.frame);return}if(i(g)){n.onSection?.(g.section);return}if(h(g)){n.onContextRow?.(g.id);return}n.onSelect?.(g.id)}function f(g,m){const S={"data-sve-ht-id":g.id};return g.current&&(S["data-sve-ht-current"]=""),g.hidden&&(S["data-sve-ht-hidden"]=""),S["data-sve-ht-cat"]=g.cat||"other",S["data-sve-ht-depth"]=String(g.depth),m&&(S["data-sve-ht-dim"]=""),h(g)&&(S["data-sve-ht-context"]=g.context),i(g)&&(S["data-sve-ht-sec"]=""),r(g)&&(S["data-sve-ht-frame"]=g.frame),!i(g)&&n.dropId===g.id&&n.dropPlace&&(S["data-sve-ht-drop"]=n.dropPlace),S}function b(g){return!!g.fixed}function x(g){return!b(g)&&(!g.hidden||g.wrapFrom!=null)}function _(g){return!!g.sectionRoot||!!g.section}function M(g){return n.canEdit||_(g)}return(g,m)=>(p(),y(R,null,[L("div",Re({"data-sve-ht-row":""},f(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:m[32]||(m[32]=S=>v(e.row)),onDblclick:m[33]||(m[33]=$(S=>e.row.synthetic?l(n).onFrameEnter?.(e.row.frame):r(e.row)||d(e.row)||i(e.row)||h(e.row)?null:l(n).onRename?.(e.row.id),["prevent"])),onKeydown:[m[34]||(m[34]=le($(S=>v(e.row),["prevent"]),["enter"])),m[35]||(m[35]=le($(S=>v(e.row),["prevent"]),["space"]))],onPointerdown:m[36]||(m[36]=S=>k(S,e.row)),onContextmenu:m[37]||(m[37]=$(S=>r(e.row)||d(e.row)||i(e.row)||h(e.row)?null:l(n).onContext?.(S,e.row.id),["prevent","stop"]))}),[L("span",yr,[(p(!0),y(R,null,V(e.row.guides||[],(S,H)=>(p(),y("i",{key:H,"data-sve-ht-cat":S},null,8,kr))),128))]),e.row.hasChildren||e.row.emptyBlock?(p(),y("button",Re({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?l(n).mainShut:e.row.shut)?{"data-sve-ht-shut":""}:{},{innerHTML:Fr,onClick:m[0]||(m[0]=$(S=>e.row.synthetic?l(n).onFrameTwist?.():i(e.row)?l(n).onSection?.(e.row.section):l(n).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:m[1]||(m[1]=$(()=>{},["stop"])),onDblclick:m[2]||(m[2]=$(()=>{},["stop"]))}),null,16)):(p(),y("span",br)),e.row.letter?(p(),y("span",_r,E(e.row.letter),1)):(p(),y("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Tr)),L("span",{"data-sve-ht-text":"",title:l(n).renameTitle},[!e.row.kind&&!i(e.row)&&!h(e.row)&&!r(e.row)?(p(),y("button",{key:0,type:"button","data-sve-ht-tag":"",title:l(n).tagTitle,onClick:m[3]||(m[3]=$(()=>{},["stop","prevent"])),onPointerdown:m[4]||(m[4]=$(()=>{},["stop"])),onDblclick:m[5]||(m[5]=$(S=>l(n).onTagChange?.(S,e.row.id),["stop","prevent"]))},E(e.row.tag),41,Sr)):(p(),y("span",wr,E(e.row.tag),1)),l(n).editingId===e.row.id&&!i(e.row)?ve((p(),y("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":m[6]||(m[6]=S=>l(n).draft=S),onMousedown:m[7]||(m[7]=$(()=>{},["stop"])),onPointerdown:m[8]||(m[8]=$(()=>{},["stop"])),onClick:m[9]||(m[9]=$(()=>{},["stop"])),onDblclick:m[10]||(m[10]=$(()=>{},["stop"])),onKeydown:[m[11]||(m[11]=$(()=>{},["stop"])),m[12]||(m[12]=le($(S=>l(n).onRenameCommit?.(),["prevent"]),["enter"])),m[13]||(m[13]=le($(S=>l(n).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:m[14]||(m[14]=S=>l(n).onRenameCommit?.())},null,544)),[[wt,l(n).draft]]):(p(),y("span",$r,E(e.row.name),1))],8,xr),r(e.row)?(p(),y("span",Cr,[e.row.frame!=="main"&&l(t)?(p(),y("button",{key:0,type:"button","data-sve-ht-fields":"",title:l(n).frameFieldsTitle,innerHTML:fn,onClick:m[15]||(m[15]=$(S=>l(n).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:m[16]||(m[16]=$(()=>{},["stop"])),onDblclick:m[17]||(m[17]=$(()=>{},["stop"]))},null,40,Lr)):C("",!0)])):!i(e.row)&&!h(e.row)&&!d(e.row)?(p(),y("span",Er,[e.row.videoNth>=0?(p(),y("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?l(n).videoPlayTitle:l(n).videoHoldTitle,innerHTML:e.row.videoHeld?jr:Nr,onClick:m[18]||(m[18]=$(S=>l(n).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:m[19]||(m[19]=$(()=>{},["stop"])),onDblclick:m[20]||(m[20]=$(()=>{},["stop"]))},null,40,Pr)):C("",!0),x(e.row)?(p(),y("button",{key:1,type:"button","data-sve-ht-eye":"",disabled:!l(n).canEdit,title:l(n).canEdit?e.row.hidden?l(n).showTitle:l(n).hideTitle:l(n).lockedTitle,innerHTML:e.row.hidden?Dr:Or,onClick:m[21]||(m[21]=$(S=>l(n).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:m[22]||(m[22]=$(()=>{},["stop"])),onDblclick:m[23]||(m[23]=$(()=>{},["stop"]))},null,40,Hr)):C("",!0),l(t)&&e.row.fieldsIcon?(p(),y("button",{key:2,type:"button","data-sve-ht-fields":"",disabled:!l(n).canEdit,title:l(n).canEdit?l(s):l(n).lockedTitle,innerHTML:fn,onClick:$(o,["stop","prevent"]),onPointerdown:m[24]||(m[24]=$(()=>{},["stop"])),onDblclick:m[25]||(m[25]=$(()=>{},["stop"]))},null,40,Ir)):C("",!0),b(e.row)?C("",!0):(p(),y("button",{key:3,type:"button","data-sve-ht-dup":"",disabled:!M(e.row),title:M(e.row)?l(n).duplicateTitle:l(n).lockedTitle,innerHTML:Br,onClick:m[26]||(m[26]=$(S=>l(n).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:m[27]||(m[27]=$(()=>{},["stop"])),onDblclick:m[28]||(m[28]=$(()=>{},["stop"]))},null,40,Mr)),b(e.row)?C("",!0):(p(),y("button",{key:4,type:"button","data-sve-ht-del":"",disabled:!M(e.row),title:M(e.row)?l(n).deleteTitle:l(n).lockedTitle,innerHTML:Vr,onClick:m[29]||(m[29]=$(S=>l(n).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:m[30]||(m[30]=$(()=>{},["stop"])),onDblclick:m[31]||(m[31]=$(()=>{},["stop"]))},null,40,Ar))])):C("",!0)],16,gr),e.row.emptyBlock&&!e.row.shut?(p(),y("div",Re({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},l(n).dropId===e.row.id&&l(n).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),E(l(n).slotText),17,Rr)):C("",!0)],64))}},Z=qe(Kr,[["__scopeId","data-v-6c7b7132"]]),qr=["data-sve-ht-look","data-sve-ht-layers"],Gr={key:0,class:"sve-ht-page-template"},Ur={key:0,class:"sve-ht-page-template__text"},zr={class:"sve-ht-page-template__note"},Xr={key:1,class:"sve-ht-empty"},Yr={key:2,class:"sve-ht-empty"},Wr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},Zr={key:0,class:"sve-ht-empty"},Jr={key:0,class:"sve-ht-empty"},Qr=["data-sve-ht-under-main"],ei={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},ti={key:0,class:"sve-ht-empty"},ni=["data-sve-ht-under-main"],oi=["data-dim"],si={key:0,class:"sve-ht-empty"},ai={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},ri={key:0,class:"sve-ht-empty"},ii={__name:"HtmlTreeList",setup(e){const t=fe(()=>Xn(n.query)),s=fe(()=>vr(n.rows,t.value)),o=fe(()=>s.value.rows),a=fe(()=>t.value?n.sections.filter(b=>Lt(b.row,t.value)||b.current&&b.ready&&o.value.length>0):n.sections);function i(b){return!!b&&(!t.value||Lt(b,t.value))}function r(b){const x=n.frame?.kind;return n.inComponent||(x==="header"||x==="footer")&&x!==b}const d=fe(()=>!!n.frame&&["header","main","footer"].some(b=>i(n.frame[b]))),h=fe(()=>!!n.frame&&(n.frame.kind==="main"||i(n.frame.main))),k=fe(()=>!!t.value&&!a.value.length&&!o.value.length&&!d.value);function v(b){return!!t.value&&!s.value.hits.has(b.path)}function f(b){const x={"data-sve-ht-sec-uid":b.uid};return b.current&&(x["data-sve-ht-branch"]="",x["data-sve-ht-cat"]=b.row?.cat||"layout"),n.sectionDrop&&n.sectionDrop.uid===b.uid&&(x["data-sve-ht-drop"]=n.sectionDrop.place),x}return(b,x)=>(p(),y("div",Re({class:"sve-ht-root","data-sve-ht-look":l(n).layers?"tags":l(n).look,"data-sve-ht-layers":l(n).layers?"":null,style:l(n).familyStyle},l(n).dragging?{"data-sve-ht-dragging":""}:{}),[l(n).pageTemplate?(p(),y("div",Gr,[l(n).pageTemplate.text?(p(),y("p",Ur,E(l(n).pageTemplate.text),1)):C("",!0),L("p",zr,E(l(n).pageTemplate.note),1),l(n).pageTemplate.canOpen?(p(),y("button",{key:1,type:"button",class:"sve-ht-page-template__open",onClick:x[0]||(x[0]=_=>l(n).pageTemplate.onOpen(_.currentTarget))},E(l(n).pageTemplate.openLabel),1)):C("",!0)])):!l(n).rows.length&&!l(n).sections.length&&!l(n).frame?(p(),y("div",Xr,E(l(n).emptyText),1)):k.value?(p(),y("div",Yr,E(l(n).searchEmpty),1)):C("",!0),l(n).frame||l(n).sections.length?(p(),y(R,{key:3},[l(n).frame?(p(),y(R,{key:0},[l(n).frame.kind==="header"?(p(),y("div",Wr,[(p(!0),y(R,null,V(o.value,_=>(p(),X(Z,{key:_.id,row:_,dim:v(_)},null,8,["row","dim"]))),128)),l(n).rows.length?C("",!0):(p(),y("div",Zr,E(l(n).emptyText),1))])):i(l(n).frame.header)?(p(),X(Z,{key:1,row:l(n).frame.header,dim:r("header")},null,8,["row","dim"])):C("",!0)],64)):C("",!0),L("div",Ao(Ro(l(n).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[l(n).frame?.kind==="main"?(p(),y(R,{key:0},[(p(!0),y(R,null,V(o.value,_=>(p(),X(Z,{key:_.id,row:_,dim:v(_)},null,8,["row","dim"]))),128)),l(n).rows.length?C("",!0):(p(),y("div",Jr,E(l(n).emptyText),1))],64)):l(n).frame&&i(l(n).frame.main)?(p(),X(Z,{key:1,row:l(n).frame.main,dim:r("main")},null,8,["row","dim"])):C("",!0),l(n).frame?.kind==="template"?ve((p(),y("div",{key:2,"data-sve-ht-frame-body":"","data-sve-ht-under-main":h.value?"":null},[L("div",ei,[(p(!0),y(R,null,V(o.value,_=>(p(),X(Z,{key:_.id,row:_,dim:v(_)},null,8,["row","dim"]))),128)),l(n).rows.length?C("",!0):(p(),y("div",ti,E(l(n).emptyText),1))])],8,Qr)),[[rn,!l(n).mainShut]]):C("",!0),l(n).sections.length||l(n).frame?ve((p(),y("div",{key:3,"data-sve-ht-frame-body":"","data-sve-ht-under-main":h.value?"":null},[l(n).frame?.template&&i(l(n).frame.template)?(p(),X(Z,{key:0,row:l(n).frame.template,dim:r("template")},null,8,["row","dim"])):C("",!0),l(n).frame&&!l(n).frame.template&&!l(n).sections.length&&!t.value?(p(),y("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":r("")?"":void 0},E(l(n).frameEmptyText),9,oi)):C("",!0),(p(!0),y(R,null,V(a.value,_=>(p(),y("div",Re({key:_.uid},{ref_for:!0},f(_)),[_.ready?(p(),y(R,{key:0},[(p(!0),y(R,null,V(o.value,M=>(p(),X(Z,{key:M.id,row:M,dim:v(M)},null,8,["row","dim"]))),128)),l(n).rows.length?C("",!0):(p(),y("div",si,E(l(n).emptyText),1))],64)):(p(),X(Z,{key:1,row:_.row,dim:r("")},null,8,["row","dim"]))],16))),128))],8,ni)),[[rn,!l(n).frame||!l(n).mainShut]]):C("",!0)],16),l(n).frame?(p(),y(R,{key:1},[l(n).frame.kind==="footer"?(p(),y("div",ai,[(p(!0),y(R,null,V(o.value,_=>(p(),X(Z,{key:_.id,row:_,dim:v(_)},null,8,["row","dim"]))),128)),l(n).rows.length?C("",!0):(p(),y("div",ri,E(l(n).emptyText),1))])):i(l(n).frame.footer)?(p(),X(Z,{key:1,row:l(n).frame.footer,dim:r("footer")},null,8,["row","dim"])):C("",!0)],64)):C("",!0)],64)):l(n).rows.length?(p(!0),y(R,{key:4},V(o.value,_=>(p(),X(Z,{key:_.id,row:_,dim:v(_)},null,8,["row","dim"]))),128)):C("",!0)],16,qr))}},gt=qe(ii,[["__scopeId","data-v-eecd9f12"]]);let yt=null;function li(e){return yt||(yt=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{pages:[]}).then(t=>Array.isArray(t.pages)?t.pages:[]).catch(()=>[])),yt}let We=null;function kt(){We?.dismiss(),We=null}function di(e,t,s){kt();const o=t?.getBoundingClientRect?.(),a={x:o?o.left:0,y:o?o.bottom+4:0};li(e).then(i=>{const r=i.length?i.map(d=>({label:d.title||d.url,onPick:()=>{kt(),s(d.url)}})):[{label:u(e,"component_props_pages_none"),onPick:null}];kt(),We=ce(e.document,ut,{items:r,x:a.x,y:a.y,onClose:()=>{We=null}})})}const Yn="sve-html-tree-labels";function Wn(){try{const e=globalThis.localStorage?.getItem(Yn);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function ci(e){try{globalThis.localStorage?.setItem(Yn,JSON.stringify(e))}catch{}}function Zn(e){return String(e||"_")}function Jn(e){const t=Wn()[Zn(e)];return t&&typeof t=="object"?{...t}:{}}function ui(e,t,s){const o=s?.[t];return typeof o=="string"&&o.trim()?o.replace(/\s+/g," ").trim():String(e||"").trim()}function hi(e,t,s,o){if(!t)return;const a=Zn(e),i=Wn(),r={...i[a]||{}},d=String(s||"").replace(/\s+/g," ").trim(),h=String(o||"").trim();!d||d===h?delete r[t]:r[t]=d,Object.keys(r).length?i[a]=r:delete i[a],ci(i)}const pi=/^@(media|supports|container|layer|scope)\b/i;function fi(e){const t=String(e||""),s=[];let o=0,a=0;for(;o<t.length;){if(t[o]==="{"&&t[o+1]==="{"){const d=t.indexOf("}}",o+2);o=d===-1?t.length:d+2;continue}if(t[o]==="/"&&t[o+1]==="*"){const d=t.indexOf("*/",o+2);o=d===-1?t.length:d+2;continue}if(t[o]==='"'||t[o]==="'"){const d=t[o];for(o+=1;o<t.length&&t[o]!==d;)o+=t[o]==="\\"?2:1;o+=1;continue}if(t[o]!=="{"){o+=1;continue}let i=1,r=o+1;for(;r<t.length&&i>0;){if(t[r]==="{"&&t[r+1]==="{"){const d=t.indexOf("}}",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==="/"&&t[r+1]==="*"){const d=t.indexOf("*/",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==='"'||t[r]==="'"){const d=t[r];for(r+=1;r<t.length&&t[r]!==d;)r+=t[r]==="\\"?2:1;r+=1;continue}t[r]==="{"?i+=1:t[r]==="}"&&(i-=1),r+=1}s.push({selector:t.slice(a,o).trim(),body:t.slice(o+1,r-1),from:a,to:r,text:t.slice(a,r).trim()}),o=r,a=r}return s}function mn(e){const t=String(e||""),s=new Set,o=new Set,a=new Set;for(const i of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const r of i[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))r&&(s.add(r),s.add(r.replace(/([:./%!#()[\],])/g,"\\$1")));for(const i of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))i[2].trim()&&o.add(i[2].trim());for(const i of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))a.add(i[1].toLowerCase());return{classes:s,ids:o,tags:a}}function vn(e,t){const s=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),o=[...s.matchAll(/\.((?:\\.|[\w-])+)/g)].map(r=>r[1]),a=[...s.matchAll(/#((?:\\.|[\w-])+)/g)].map(r=>r[1]);if(o.length||a.length){const r=d=>d.replace(/\\(.)/g,"$1");return o.every(d=>t.classes.has(d)||t.classes.has(r(d)))&&a.every(d=>t.ids.has(r(d)))}const i=[...s.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(r=>r[2].toLowerCase());return i.length>0&&i.every(r=>t.tags.has(r))}function mi(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function vi(e,t,s){const o=mi(e);if(!o.length)return"keep";const a=o.filter(r=>vn(r,t));return a.length?a.length===o.length&&!o.some(r=>vn(r,s))?"move":"copy":"keep"}function Qn(e,t,s){const o=String(e||""),a=mn(t),i=mn(s),r=[],d=[];let h=0;for(const k of fi(o)){const v=o.slice(k.from,k.to),f=v.match(/^\s*/)[0];if(h=k.to,pi.test(k.selector)){const x=Qn(k.body,t,s);x.move.trim()&&r.push(`${k.selector} {
${x.move.trim()}
}`),x.keep.trim()&&d.push(`${f}${k.selector} {
${x.keep.trim()}
}`);continue}const b=k.selector.startsWith("@")?"keep":vi(k.selector,a,i);if(b==="move"){r.push(k.text);continue}b==="copy"&&r.push(k.text),d.push(v)}return d.push(o.slice(h)),{move:r.join(`

`).trim(),keep:d.join("").replace(/\n{3,}/g,`

`).trim()}}const gi="/!/sve/component";function yi(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let s=null;for(const o of t){if(!o.trim())continue;const a=o.match(/^[ \t]*/)[0].length;s=s===null?a:Math.min(s,a)}return s?t.map(o=>o.slice(s)).join(`
`):t.join(`
`)}function ki(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function bi(e,t){if(!ps(e))return"";try{return await(await Oo(()=>import("./tw-compile-AWaJHJyk.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(s){return console.error("[sve] component tailwind compile",s),""}}async function _i(e,t){const s=await e.fetch(gi,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":Bt(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!s.ok){const o=new Error(String(s.status));throw o.status=s.status,o}return s.json()}function gn(e,t){const{from:s,to:o}=hs(e,t),a=e.slice(s,o);if(!a.trim())return null;const i=e.slice(0,s)+e.slice(o),r=T("dock:css"),d=Qn(typeof r=="string"?r:"",a,i);return{html:yi(a),css:d.move,keepCss:d.keep,lead:ki(a),from:s,to:o}}function Ti(e,t,{onDone:s,onError:o}={}){if(T("dock:is-locked")===!0)return;const a=T("dock:html");if(typeof a!="string"||!t)return;const i=gn(a,t);if(!i)return;const r=ce(e.document,Fo,{heading:u(e,"component_new"),nameLabel:u(e,"component_name"),placeholder:u(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:u(e,"cancel"),saveLabel:u(e,"component_create"),onOk:d=>{r.dismiss(),(async()=>{try{const h=await bi(e,i.html),k=T("dock:html"),v=typeof k=="string"&&k===a?i:gn(k,t);if(!v)return;const f=await _i(e,{name:d,html:v.html,css:v.css,js:"",tw:h}),b=T("dock:html"),x=b.slice(0,v.from)+v.lead+f.tag+b.slice(v.to);T("dock:set-html",x),v.css.trim()&&T("dock:set-css",v.keepCss),s?.(f)}catch(h){o?.(h)}})()}})}function xi(e,t,s){const o=String(e||"");if(!t||t.kind!=="antlers")return o;const a=String(s||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?Ci(o,t,a):t.tag==="else"||!a?o:o.slice(0,t.from)+`{{ ${t.tag} ${a} }}`+o.slice(t.openTo)}function Et(e,t,s,o){return Oe(e,t,{kind:s,name:o})}function Oe(e,t,s={}){const o=String(e||"");if(!t||t.antlers!=="loop")return o;const a=t.loopKind==="collection"?"collection":"field",i=s.kind??a,r=String(s.name??t.expr??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(r))return o;const d=s.sortDir??t.sortDir??"",h=String(s.sortField??t.sortField??"").trim(),k=String(s.limit??t.limit??"").trim(),v=eo(o,t);if(!v)return o;const f=i===a?t.params:"",b=i==="collection"?Si(r,h,d,k,f):wi(r,h,d,k,f),x=i==="collection"?"collection":r;return o.slice(0,t.from)+b+o.slice(t.openTo,v.from)+`{{ /${x} }}`+o.slice(v.to)}function Si(e,t,s,o,a){const i=$i(a).replace(/\bsort\s*=\s*["'][^"']*["']/g,"").replace(/\blimit\s*=\s*["']?\d+["']?/g,"").replace(/\s+/g," ").trim(),r=[`collection from="${e}"`];return s==="random"?r.push('sort="random"'):t&&r.push(`sort="${t}${s==="desc"?":desc":":asc"}"`),o&&r.push(`limit="${o}"`),i&&r.push(i),`{{ ${r.join(" ")} }}`}function wi(e,t,s,o,a){const i=String(a||"").split("|").map(d=>d.trim()).filter(d=>d&&!/^from\s*=/.test(d)&&!/^sort\s*:/.test(d)&&!/^reverse$/.test(d)&&!/^shuffle$/.test(d)&&!/^limit\s*:/.test(d)),r=[e,...i];return s==="random"?r.push("shuffle"):t&&(r.push(`sort:${t}`),s==="desc"&&r.push("reverse")),o&&r.push(`limit:${o}`),`{{ ${r.join(" | ")} }}`}function $i(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function eo(e,t){const o=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return o?{from:t.from+o.index,to:t.from+o.index+o[0].length}:null}function Ci(e,t,s){return Oe(e,t,{name:s})}function Li(e,t,s){const o=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return o;const a=eo(o,t);if(!a)return o;const r=(o.slice(0,a.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],d=s==="else"?"{{ else }}":"{{ elseif true }}";return`${o.slice(0,a.from)}${d}
${r}${o.slice(a.from)}`}const U=ys("sve-call-values"),Ve=new Set;let yn=null;const Ei="__sve-html-tree-style";function Pi(e,t,s){if(t||s)return!1;const o=String(T("dock:chrome-kind")||"");if(o==="header"||o==="footer")return!1;const a=In(e);return!!a&&a!=="create"&&zo(e)!==Xo(e)}function to(e){return{sectionLoops:Hn(e),sectionsLabel:u(e,"html_tree_sections_slot")}}function kn(e,t){if(e.kind==="slot")return!1;for(let s=0;s<t.length;s+=2)if(e.from<=t[s]&&e.to>=t[s+1])return!0;return!1}function Hi(e,t){const s={entry:t,text:"",note:u(e,"html_tree_page_template_note"),openLabel:u(e,"html_tree_open_template"),canOpen:!1,onOpen:null};return Fn(e,{entry:t}).then(o=>{!o||n.pageTemplate?.entry!==t||(n.pageTemplate={...n.pageTemplate,text:u(e,"html_tree_page_template",{name:o.name}),canOpen:!!o.open,onOpen:o.open?a=>Yo(e,a,o.open):null})}),s}function Ii(e,t){const s=t.replace(/^view:/,"");if(!s||T("dock:current-type")!==t){n.usedBy=null;return}n.usedBy?.view!==s&&(n.usedBy=null,Fn(e,{view:s}).then(o=>{if(!o||T("dock:current-type")!==t)return;const a=o.everything?u(e,"html_tree_used_by_everything"):o.used_by.length?o.used_by.join(", "):u(e,"html_tree_used_by_nobody");n.usedBy={view:s,label:u(e,"html_tree_used_by"),text:a}}))}const K=new Set;let Pt="",Se=!1,bt=null,Ee=!0,J="",Le=0,no="";const de=new Map,$e=new Set;let G="",oo=!1,O=null,Ze=null,ze="",Je="",Qe=0,Ht=null,Ce=[],ge=null,De=null,et=null,tt=null,It=null,be=!1,ye=null,Ke=null,Be=null,nt=null,ot=null,Mt=null,me=null;function W(e){return e.getElementById(Ye)}function Mi(e){Bo(e,Ei,`
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
      ${ln("light")}
      /* How much of a row's own colour its pick takes: a wash, not a fill.
         The row mixes it in below — a mix written up here would read
         --sve-ht-c on the list, where no family is set. */
      --sve-ht-pick-mix: 11%;
      --sve-ht-pick-hover-mix: 18%;
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${ln("dark")}
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
  `)}function z(){const e=T("dock:html");return typeof e=="string"?e:""}function so(e){return!!T("dock:is-open",e)}function Pe(e,{save:t=!1}={}){return Yt()||T("dock:set-html",e)!==!0?!1:(t&&T("dock:save-now"),!0)}function _t(e){const t=T("dock:component-exit-state")||{};if(n.exitOpen=!!t.open,!t.open){n.onExit=null;return}n.exitName=t.name||"",n.exitLabel=u(e,"component_exit"),n.exitTitle=u(e,t.back?"component_exit_back":"component_exit_close"),n.onExit=()=>{T("dock:exit-component"),A(e)}}function ao(e,t){const s=es(e);if(!s||t.type!==s)return"";const o=ts(t[s]);return o&&ns(e,o)?.section_type||""}const _e=[];let Tt=!1,At=!1;function xt(e,t){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(t,{timeout:2e3});return}e.setTimeout(t,200)}function Ai(e,t){for(const s of t){const o=s.type;!o||de.has(o)||$e.has(o)||_e.includes(o)||_e.push(o)}Nt.htmlTreePrefetchArmed&&Xt(e)}function Cl(e){Nt.htmlTreePrefetchArmed=!0,Xt(e)}function Xt(e){if(Tt||!_e.length)return;Tt=!0;const t=()=>{const s=_e.shift();if(!s){Tt=!1;return}if(de.has(s)||$e.has(s)){xt(e,t);return}$e.add(s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(s)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(o=>o.ok?o.json():null).then(o=>{typeof o?.html=="string"&&(de.set(s,o.html),At&&(At=!1,A(e)))}).catch(()=>{}).finally(()=>{$e.delete(s),xt(e,t)})};xt(e,t)}function Yt(){return!!G}function Ri(e){const t=new Map,s=lt(e);if(!s)return t;for(const o of s.querySelectorAll("[data-sid]")){const a=o.getAttribute("data-sid");a&&!t.has(a)&&t.set(a,o.tagName.toLowerCase())}return t}function pt(e,t){const s=dt(e)||"page_sections",o=Ri(e),a=[];for(const i of jt(t)||[]){const r=Vt(i.values),d=r&&typeof r=="object"?r[s]:null;if(Array.isArray(d)){d.forEach(h=>{if(!h||typeof h!="object"||Array.isArray(h)||typeof h.type!="string")return;const k=[h._visual_id,h.id,h._id].filter(_=>typeof _=="string"&&_!=="");if(!k.length)return;const v=ao(e,h)||h.type,f=typeof h._sve_label=="string"?h._sve_label.trim():"",b=k.map(_=>o.get(_)).find(Boolean)||"section",x=Jn(h.type)[`0:${b}`];a.push({uid:k[0],ids:k,type:h.type,tag:b,label:f||(typeof x=="string"&&x.trim()?x.trim():"")||ct(e,v)?.display||Ne(v)||v,svg:Bn(b,"",null).svg||we.section,cat:An(b),enabled:h.enabled!==!1,static:aa(e,v)})});break}}return a}function Fi(e,t,s){if(!s.length)return"";const o=T("dock:current-type")||"",a=T("dock:current-uid"),i=!!T("dock:component-exit-state")?.open;if(a){const r=Kt(a,t),d=s.find(h=>h.ids.some(k=>r.includes(k)));if(d&&(i||d.type===o))return d.uid}return s.find(r=>r.type===o)?.uid||""}function Oi(e,t,s,o){const a=t.find(_=>_.uid===s),i=T("dock:component-src"),r=T("dock:type-stack")||[];if(!a||!i||!r.length)return null;const d=r.map(_=>_.type).filter(_=>!de.get(_));if(d.length)return Di(e,d),null;const h=[],k=new Set,v=new Set;let f=_=>h.push(..._),b=null,x=0;for(let _=0;_<r.length;_+=1){const M=_+1<r.length?r[_+1].src:i,g=N=>({...N,id:`ctx${_}:${N.id}`,path:`ctx${_}/${N.path}`,ctxLevel:_,children:N.children.map(g)}),m=ht(de.get(r[_].type)).map(g),S=[],H=(N,oe)=>{for(const B of N){if(B.kind==="component"&&B.src===M)return S.push(...oe,B),B;const D=H(B.children,[...oe,B]);if(D)return D}return null};if(b=M?H(m,[]):null,!b)return null;const P=new Set(S.map(N=>N.id)),F=(N,oe)=>{for(const B of N)B.children.length&&(P.has(B.id)?K.has(B.path):ro(B,oe))&&k.add(B.id),F(B.children,oe+1)};F(m,x),f(m),v.add(b.id),x+=S.length,f=(N=>oe=>{N.children=oe})(b)}for(const _ of io(o))k.add(_);return K.has(b.path)&&k.add(b.id),b.children=o,{tree:h,folds:k,hostId:b.id,hostIds:v,levels:r.length,rootId:h.find(_=>!_.kind)?.id||"",label:a.label,svg:a.svg,cat:a.cat}}function Di(e,t){for(const s of t)!_e.includes(s)&&!$e.has(s)&&_e.push(s);At=!0,Xt(e)}function Bi(e,t,s){const o=T("dock:component-exit-state");if(o?.open)return Ne(o.name)||o.name||"";if(s)return t.find(i=>i.uid===s)?.label||"";const a=T("dock:current-type")||"";return ct(e,a)?.display||Ne(a)||""}function ft(e,t,s,o,a){const i=s.find(d=>d.uid===o);if(!i||o===a)return;K.clear(),O=null,Ee=!1,ne(),Ge(),J=o,no=z(),G=de.get(i.type)||"",G&&(O=st(ht(G))||null),oo=(T("dock:current-type")||"")===i.type,e.clearTimeout(Le),Le=e.setTimeout(()=>{J="",Se=!1,A(e)},4e3),A(e);const r=()=>as(i.uid,t,e,{clampToSection:!0});Qo(i.uid,t,e,r),ue({source:ee,type:Q.SVE_ACTIVATE,ids:i.ids},e),e.setTimeout(()=>A(e),0)}function Rt(e,t){if(!t)return!1;for(const s of e||[])if(s.id===t||Rt(s.children,t))return!0;return!1}function st(e){for(const t of e||[]){if(!t.kind)return t.id;const s=st(t.children);if(s)return s}return""}function ro(e,t){const s=t===0||e.path===Je;return K.has(e.path)?s:!s}function io(e){const t=new Set,s=(o,a)=>{for(const i of o)i.children.length&&ro(i,a)&&t.add(i.id),s(i.children,a+1)};return s(e,0),t}function A(e){const t=e.document,o=W(t)?.querySelector("[data-sve-html-tree-list]");if(!o)return;Mi(t),ms(e);const a=z();G&&G===a&&(G=""),T("dock:chrome-kind")&&(G="");const i=G||a,r=ht(i,to(e)),d=vs(i,Hn(e));Ce=r,Je="";const h=T("dock:current-type")||"",k=Jn(h),v=qo(e,t),b=!!(T("dock:component-exit-state")||{}).open,x=pt(e,t);h&&a&&!G&&de.set(h,a),Ai(e,x);const _=Fi(e,t,x);if(Pi(e,v,b)){const c=In(e);Ce=[],n.rows=[],n.sections=[],n.frame=null,n.pageBuilder=!1,n.layoutFile=!1,n.usedBy=null,n.emptyText="",n.pageTemplate?.entry!==c&&(n.pageTemplate=Hi(e,c)),n.onRefresh=()=>A(e),n.onSection=null,_t(e),Fe(o,gt),St(e,[]);return}n.pageTemplate=null,Ii(e,String(T("dock:collection-view")||""));const M=String(T("dock:chrome-kind")||"");if(Go(e),v&&!x.length&&!M){Ce=[],n.rows=[],n.sections=[],n.frame=_n(e,[],!1,!1,"",!0),n.frameEmptyText=u(e,"html_tree_frame_no_sections"),n.pageBuilder=!0,n.layoutFile=!1,n.emptyText=u(e,"html_tree_empty"),n.canEdit=!T("dock:is-locked"),n.look=dn(e),n.onRefresh=()=>A(e),n.onSection=null,bn(e,""),_t(e),Fe(o,gt),St(e,[]);return}n.pageBuilder=v;const g=`${h}|${_}`;let m=!1;g!==Pt&&(Pt=g,K.clear(),bt!==null&&i!==bt?m=!0:Se=i),(m||Se!==!1&&i!==Se)&&(Se=!1,K.clear(),O=st(r)||null),bt=i,J&&(J===_||!x.length)&&(oo||i!==no)&&(e.clearTimeout(Le),J="",Se=!1,Rt(r,O)||(K.clear(),O=st(r)||null));const S=x.some(c=>c.uid===J)?J:"",H=Ee?"":S||_,P=b?Oi(e,x,H,r):null,F=!!(S||_),N=F||b?"":String(T("dock:chrome-kind")||""),B=v&&(!h&&!F||N==="main"&&T("dock:on-empty-page")===!0),D=B||N==="template"?"":N;n.layoutFile=D==="main",D!=="main"&&(ze="");const te=D==="main"?Tn(r,"main"):null,He=te?at(r,c=>c.tag==="body"&&Rt(c.children,te.id)):null;Je=He?He.path:"",te&&(Xe((He||te).path),ze!==g&&(Xe(te.path),K.add(te.path)));const Ie=D==="header"||D==="footer"?at(r,c=>i.slice(c.from,c.openTo).includes(`data-sve-chrome="${D}"`))||Tn(r,D):null;Ie&&Xe(Ie.path);const j=B||!(D==="main"?!!te:D==="header"||D==="footer"?!!Ie:!0)?[]:P?cn(P.tree,n.query?new Set:P.folds):cn(r,n.query?new Set:io(r));!i.trim()&&!so(t)?n.emptyText=u(e,"html_tree_need_dock"):n.emptyText=u(e,"html_tree_empty"),n.slotText=u(e,"antlers_drop_here"),n.dataTitle=u(e,"data_vars_title"),n.pageTitle=u(e,"component_props_page"),n.renameTitle=u(e,"html_tree_rename"),n.tagTitle=u(e,"tw_tag"),n.hideTitle=u(e,"html_tree_hide"),n.showTitle=u(e,"html_tree_show"),n.duplicateTitle=u(e,"html_tree_duplicate"),n.deleteTitle=u(e,"html_tree_delete"),n.videoHoldTitle=u(e,"html_tree_video_hold"),n.videoPlayTitle=u(e,"html_tree_video_play"),n.lockedTitle=u(e,"html_tree_locked"),n.searchEmpty=u(e,"html_tree_search_empty"),n.canEdit=!T("dock:is-locked"),n.look=dn(e),n.onQuery=()=>A(e),_t(e),n.inComponent=b,n.onContextRow=c=>{if(!P||c===P.hostId)return;const w=j.find(I=>I.id===c)?.ctxLevel??P.levels-1;T("dock:exit-component",P.levels-w),A(e)},n.onSelect=c=>{const w=j.find(I=>I.id===c);w&&Dn(e,w.path)||it(e,c,j)},n.onTwist=c=>{const w=j.find(I=>I.id===c)?.path;w&&(K.has(w)?K.delete(w):K.add(w),A(e))},n.onTagChange=(c,w)=>{const I=n.rows.find(re=>re.id===w);I&&!Yt()&&gs(e,c.currentTarget,I)},n.onRename=c=>qi(e,c),n.onRenameCommit=()=>Sn(e,!0),n.onRenameCancel=()=>Sn(e,!1),n.onHide=c=>zi(e,c),n.onVideoHold=c=>Ui(e,c),n.onDuplicate=c=>Xi(e,c),n.onDelete=c=>Wi(e,c),n.onPointerDown=(c,w)=>nl(e,c,w),n.onSectionPointerDown=(c,w)=>al(e,c,w),n.onContext=(c,w)=>el(e,c,w),n.onInspectCommit=c=>hl(e,c),n.onPropValue=(c,w,I)=>Cn(e,c,w,I),n.onPropPage=(c,w)=>di(e,c,I=>Cn(e,w,I,!1)),n.onLoopKind=c=>pl(e,c),n.onAddBranch=c=>fl(e,c),n.onLoopSortField=c=>{const w=rt(),I=String(c||"").trim();if(!w)return;const re=me?.id===w.id?me.dir:"",ie=w.sortDir||re||"asc";me=null,ke(e,(xe,Me)=>Oe(xe,Me,{sortField:I,sortDir:ie}))},n.onLoopSortDir=c=>{const w=rt(),I=String(c||"");if(w){if((I==="asc"||I==="desc")&&!w.sortField){me={id:w.id,dir:I},Ot(e,w);return}me=null,ke(e,(re,ie)=>Oe(re,ie,{sortDir:I,sortField:I==="asc"||I==="desc"?ie.sortField:""}))}},n.onLoopLimit=c=>ke(e,(w,I)=>Oe(w,I,{limit:String(c||"").replace(/\D/g,"")})),n.onPropHost=c=>c?U.mount(c):U.unmount(),n.onInspectData=(c,w)=>{T("dock:data-menu",{anchor:c,at:j.find(I=>I.id===O)?.from,onPick:I=>w(String(I?.var||"").trim())})};const Qt=j.find(c=>!c.kind)?.id,en=b?"":Bi(e,x,H),he=H&&!b?x.find(c=>c.uid===H):null,vo=Mn(e,String(T("dock:current-type")||""));let go=0;const se=D==="header"||D==="footer"?D:"",Te=Ie?Ie.id:"",pe=te&&j.find(c=>c.id===te.id)||null,tn=He&&j.find(c=>c.id===He.id)||null,ae=tn||pe||Te&&j.find(c=>c.id===Te)||null,nn=ae?ji(j,ae):-1;if(ae&&!j.slice(j.indexOf(ae),nn).some(c=>c.id===O)&&(O=ae.id),n.selectFrom){const c=j.find(w=>w.from===n.selectFrom.at&&!w.kind);c?(O=c.id,n.selectFrom=null):--n.selectFrom.left<=0&&(n.selectFrom=null)}const on=n.layoutFile?Ni(e):null;n.rows=j.map(c=>{const w=on&&c.kind==="component"&&on.get(c.src)||"",I=c.tag==="body"&&!c.kind,re=w?{svg:we[w]}:Bn(c.tag,c.kind,c.antlers),ie=c.tag==="video"&&!c.kind?go++:-1,xe=!!P&&c.id===P.rootId,Me=c.id===Qt&&en?en:xe?P.label:c.klass,Ue=c.id===Qt;return{...c,tag:w||c.tag,frameCall:w,fixed:!!w||I||kn(c,d),holdsSections:kn(c,d),base:Me,name:se&&c.id===Te?u(e,`html_tree_frame_${se}`):c===pe?u(e,"html_tree_frame_main"):Ue&&he?Me:ui(Me,c.path,k),current:c.id===O,letter:xe?"":re.letter||"",svg:se&&c.id===Te?we[se]:c===pe?we.main:Ue&&he?he.svg:xe?P.svg:re.svg||"",frame:se&&c.id===Te?se:c===pe?"main":"",cat:se&&c.id===Te?se:c===pe||I?"main":xe?P.cat:w||An(c.tag,c.kind,c.antlers),context:P?P.hostIds.has(c.id)?"host":c.id.startsWith("ctx")?"dim":"":"",sectionRoot:Ue&&he?he.uid:"",fieldsIcon:!!(Ue&&he&&!he.static),videoNth:ie,videoHeld:ie>=0&&vo.has(ie)}}),Uo(e);const mt=[];for(const c of n.rows)mt.length=c.depth,c.guides=mt.slice(),mt[c.depth]=c.cat;if(ae){const c=j.indexOf(ae),w=ae.depth;n.rows=n.rows.slice(c,nn).map(I=>({...I,depth:I.depth-w,guides:I.guides.slice(w)})),pe&&ze!==g&&(ze=g,e.setTimeout(()=>it(e,pe.id,j),0))}n.sections=v&&(F||D||B)?x.map(c=>{const w=!!H&&c.uid===H;return{...c,current:w,ready:w&&(!S||!!G),row:{id:`sec:${c.uid}`,section:c.uid,tag:c.tag,name:c.label,kind:"",svg:c.svg,cat:c.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:w,hidden:!c.enabled}}}):[],n.frame=_n(e,x,F,b,D,!1,!!tn),n.frameEmptyText=u(e,"html_tree_frame_no_sections"),bn(e,D),n.onSection=c=>{be||(Ft(e),ft(e,t,x,c,H))},n.onRefresh=()=>A(e),Ot(e,n.rows.find(c=>c.id===O)),Fe(o,gt),St(e,r)}function bn(e,t){n.frameOpenTitle=u(e,"html_tree_frame_open"),n.frameMainTitle=u(e,"html_tree_frame_main_open"),n.frameTemplateTitle=u(e,"html_tree_frame_template_open"),n.frameFieldsTitle=u(e,"html_tree_frame_fields"),n.onFrame=s=>{t===s?Vi(e,s):xn(e,s)},n.onFrameEnter=s=>xn(e,s),n.onFrameFields=s=>ds(e,Wo(e,s),u(e,`html_tree_frame_${s}`)),n.onFrameTwist=()=>{n.mainShut=!n.mainShut}}function _n(e,t,s,o,a,i=!1,r=!1){if(!a&&!i||r)return null;const d=v=>({id:`frame:${v}`,frame:v,synthetic:!0,tag:v,name:u(e,`html_tree_frame_${v}`),kind:"",svg:we[v]||"",cat:v,letter:"",depth:0,hasChildren:v==="main"&&(t.length>0||a==="template"),shut:v!=="main",current:!1,hidden:!1}),h={kind:a,header:d("header"),main:d("main"),footer:d("footer"),template:null},k=a&&a!=="template"?String(T("dock:collection-view")||""):"";return k&&(h.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:ct(e,k)?.display||Ne(k.replace(/^view:/,"")),kind:"",svg:we.section,cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),h}function Tn(e,t){return at(e,s=>s.tag===t)}function at(e,t){for(const s of e||[]){if(!s.kind&&t(s))return s;const o=at(s.children,t);if(o)return o}return null}function Ni(e){const t=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},s=new Map;for(const o of["header","footer"]){const a=ks(t[o]?.type);a&&s.set(a,o)}return s}function ji(e,t){let s=e.indexOf(t)+1;for(;s<e.length&&e[s].depth>t.depth;)s+=1;return s}function Vi(e,t){const s=lt(e);(t==="main"||t==="template"?s?.querySelector("main"):s?.querySelector(`[data-sve-chrome="${t}"]`))?.scrollIntoView({behavior:"smooth",block:"start"})}function Ft(e){const t=String(T("dock:chrome-open",e.document)||"");return t!=="header"&&t!=="footer"?!1:(Jo(e),ue({source:ee,type:Q.SVE_FORCE_EXIT_CHROME},e),!0)}function Ki(e){e.clearTimeout(Le),J="",G="",K.clear(),O=null,Ee=!1,ne(),Ge()}function xn(e,t){if(e.document,String(T("dock:chrome-kind")||"")===t)return;if(Ki(e),t==="main"){Ft(e),T("dock:open-file",cs);return}if(t==="template"){const i=String(T("dock:collection-view")||"");i&&(Ft(e),T("dock:open-file",i));return}if(t!=="header"&&t!=="footer")return;const s=lt(e)?.querySelector(`[data-sve-chrome="${t}"]`);s?(s.scrollIntoView({block:"nearest"}),s.dispatchEvent(new s.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:ee,type:Q.OPEN_CHROME,kind:t},e.location.origin);const o=Date.now(),a=async()=>{if(String(T("dock:chrome-kind")||"")!==t){Date.now()-o<3e4&&e.setTimeout(a,250);return}await(T("dock:load-settled")||null),mo(e)};e.setTimeout(a,250)}function St(e,t){W(e.document)&&lo(e,t)}function lo(e,t){const s=t[0],o=!!T("dock:component-src"),a=o?"":T("dock:current-uid")||"";ue({source:ee,type:Q.SVE_HTML_PICK,on:!0,uid:a,uids:a?Kt(a,e.document):[],all:o,tag:s?.tag||"",klass:s?.klass||"",nodes:Ms(t)},e)}function Xe(e){if(!e)return;const t=(s,o)=>{for(const a of s||[]){if(a.path===e)return!0;if(t(a.children,o+1))return o===0||a.path===Je?K.delete(a.path):K.add(a.path),!0}return!1};t(Ce,0)}function qi(e,t){if(be)return;const s=n.rows.find(o=>o.id===t);!s||s.kind||(O=t,n.rows.forEach(o=>{o.current=o.id===t}),n.editingId=t,n.draft=s.name,e.setTimeout(()=>{const o=W(e.document)?.querySelector("[data-sve-ht-rename]");o?.focus(),o?.select()},0))}function Sn(e,t){const s=n.editingId;if(!s)return;const o=n.rows.find(a=>a.id===s);n.editingId=null,t&&o&&(o.sectionRoot?Gi(e,o.sectionRoot,n.draft):hi(T("dock:current-type")||"",o.path,n.draft,o.base||o.klass)),n.draft="",A(e)}function Gi(e,t,s){const o=dt(e)||"page_sections",a=String(s||"").replace(/\s+/g," ").trim();for(const i of jt(e.document)||[]){const r=Vt(i.values),d=r&&typeof r=="object"?r[o]:null;if(!Array.isArray(d))continue;const h=d.findIndex(b=>b&&typeof b=="object"&&[b._visual_id,b.id,b._id].includes(t));if(h===-1)continue;const k=ao(e,d[h])||d[h].type,v=ct(e,k)?.display||Ne(k)||k,f=JSON.parse(JSON.stringify(d));return f[h]={...f[h]},!a||a===v?delete f[h]._sve_label:f[h]._sve_label=a,i.setFieldValue(o,f),!0}return!1}function Ui(e,t){const s=n.rows.find(d=>d.id===t);if(!s||!(s.videoNth>=0))return;const o=String(T("dock:current-type")||""),a=Mn(e,o),i=!a.has(s.videoNth);i?a.add(s.videoNth):a.delete(s.videoNth);const r=String(T("dock:current-uid")||"");Zo(e,o,a),ue({source:ee,type:Q.SVE_VIDEO_HOLD,uid:r,uids:r?Kt(r,e.document):[],nth:s.videoNth,on:i},e),A(e)}function Wt(e){return!!n.rows.find(t=>t.id===e)?.fixed}function zi(e,t){Wt(t)||Zt(e,t,Ps)}function Xi(e,t){if(Wt(t))return;const s=n.rows.find(o=>o.id===t)?.sectionRoot;if(s){e.postMessage({source:ee,type:Q.DUPLICATE_ROW,uid:s},e.location.origin);return}Zt(e,t,Hs)}function co(e,t){os(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const s=e.document;rs({uid:t},s,e)})}function Yi(e,t,s){J===s&&(e.clearTimeout(Le),J="",G=""),O=null,Ee=!1,Pt="";const o=pt(e,t),a=o.find(i=>i.uid!==s)||o[0];a?ft(e,t,o,a.uid,""):(G="",n.rows=[],n.sections=[],n.frame=null,n.pageBuilder=!0,A(e)),e.setTimeout(()=>{W(e.document)&&A(e)},0)}Rn("row:removed",({uid:e,parentPath:t,doc:s,win:o})=>{t!==dt(o)||!W(o.document)||Yi(o,s,e)});function Wi(e,t){if(Wt(t))return;const s=n.sections?.find(a=>a.row?.id===t),o=s?s.row?.section||s.uid:n.rows.find(a=>a.id===t)?.sectionRoot;if(o){co(e,o);return}Zt(e,t,Is)}function Zt(e,t,s){if(T("dock:is-locked"))return;const o=z(),a=n.rows.find(r=>r.id===t);if(!a)return;const i=s(o,a);i!==o&&Pe(i)}function ne(){ye?.dismiss(),ye=null}const Zi='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',Ji='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>';function uo(e,t){const s=n.sections?.find(h=>h.uid===t),o=s?.type||"";if(!o||!Gn(e))return[];const a=s.label||o,i=ra(e,o),r=()=>e.Statamic?.$toast?.error(u(e,"section_update_failed")),d=[{label:u(e,"static_section_insertable"),icon:i?Ji:Zi,onPick:()=>{ne(),hn(e,{handle:o,hidden:!i}).then(()=>{e.Statamic?.$toast?.success(u(e,i?"section_shown_to_editors":"section_hidden_from_editors",{name:a})),Ct(e)}).catch(r)}}];return s.static&&d.push({label:u(e,"section_add_fields"),onPick:()=>{ne(),hn(e,{handle:o,fields:!0}).then(()=>{e.Statamic?.$toast?.success(u(e,"section_fields_added",{name:a})),Ct(e),A(e),On(e,o)}).catch(r)}}),d}function Qi(e,t,s){const o=s.row?.section||s.uid;o&&(ye=ce(e.document,ut,{items:[...uo(e,o),{label:u(e,"html_tree_remove_section"),danger:!0,onPick:()=>{ne(),co(e,o)}}],x:t.clientX,y:t.clientY,onClose:()=>{ye=null}}))}function el(e,t,s){ne();const o=n.sections?.find(d=>d.row?.id===s);if(o){Qi(e,t,o);return}const a=n.rows.find(d=>d.id===s);if(!a)return;it(e,s,n.rows);const i={x:t.clientX,y:t.clientY},r=d=>{d.length&&(ye?.dismiss(),ye=ce(e.document,ut,{items:d,x:i.x,y:i.y,onClose:()=>{ye=null}}))};if(a.kind==="component"){tl(e,a,r);return}a.kind==="slot"||a.holdsSections||n.canEdit&&r([...a.sectionRoot?uo(e,a.sectionRoot):[],{label:u(e,"component_make"),onPick:()=>{ne(),Ti(e,a,{onDone:()=>A(e),onError:d=>{e.alert(d?.status===409?u(e,"component_exists"):u(e,"component_failed"))}})}}])}const wn=(e,t)=>{ne(),T("dock:open-template",t)};function tl(e,t,s){if(!_s(t.src)){s([{label:u(e,"component_open_named",{name:t.name||t.src}),onPick:()=>wn(e,`view:partials/${t.src}`)}]);return}s([{label:u(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(o=>o.ok?o.json():{items:[]}).then(o=>{const a=Array.isArray(o.items)?o.items:[];s(a.length?a.map(i=>({label:u(e,"component_open_named",{name:i.label}),onPick:()=>wn(e,i.type)})):[{label:u(e,"component_none"),onPick:null}])}).catch(()=>s([{label:u(e,"component_none"),onPick:null}]))}function nl(e,t,s){if(t.button!==0||T("dock:is-locked")||n.editingId||t.target?.closest?.("button, input"))return;Ge(),ge=s,De={x:t.clientX,y:t.clientY},et=t.currentTarget,tt=t.pointerId;const o=i=>ol(e,i),a=i=>sl(e,i);It=()=>{e.document.removeEventListener("pointermove",o,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),It=null},e.document.addEventListener("pointermove",o,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function ol(e,t){if(!ge||!De)return;const s=t.clientX-De.x,o=t.clientY-De.y;if(!n.dragging&&s*s+o*o<25)return;if(!n.dragging){n.dragging=!0;try{et?.setPointerCapture?.(tt)}catch{}}t.preventDefault();const a=e.document.elementFromPoint(t.clientX,t.clientY),i=a?.closest?.("[data-sve-ht-slot]");if(i){const f=i.getAttribute("data-sve-ht-id");if(f&&f!==ge){n.dropId=f,n.dropPlace="inside";return}}const r=a?.closest?.("[data-sve-ht-row]"),d=r?.getAttribute("data-sve-ht-id");if(!d||d===ge){n.dropId=null,n.dropPlace=null;return}const h=n.rows.find(f=>f.id===d),k=n.rows.find(f=>f.id===ge);if(!h||h.context||k&&h.path.startsWith(`${k.path}/`)){n.dropId=null,n.dropPlace=null;return}const v=r.getBoundingClientRect();n.dropId=d,n.dropPlace=Ls(t.clientY-v.top,v.height,!jn(h.tag)&&!Nn(h))}function sl(e,t){const s=ge,o=n.dropId,a=n.dropPlace||"after",i=n.dragging;if(Ge(),i&&(be=!0,e.setTimeout(()=>{be=!1},0)),!i||T("dock:is-locked")||!s||!o||s===o)return;t?.preventDefault?.();const r=z(),d=Es(r,Ce,s,o,a);d!==r&&Pe(d)}function Ge(){try{et?.releasePointerCapture?.(tt)}catch{}It?.(),ge=null,De=null,et=null,tt=null,n.dragging=!1,n.dropId=null,n.dropPlace=null}function al(e,t,s){if(t.button!==0||!s||n.editingId||t.target?.closest?.("button, input"))return;ho(),Ke=s,Be={x:t.clientX,y:t.clientY},nt=t.currentTarget,ot=t.pointerId;const o=i=>rl(e,i),a=i=>il(e,i);Mt=()=>{e.document.removeEventListener("pointermove",o,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),Mt=null},e.document.addEventListener("pointermove",o,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function rl(e,t){if(!Ke||!Be)return;const s=t.clientX-Be.x,o=t.clientY-Be.y;if(!n.dragging&&s*s+o*o<25)return;if(!n.dragging){n.dragging=!0;try{nt?.setPointerCapture?.(ot)}catch{}}t.preventDefault();const i=e.document.elementFromPoint(t.clientX,t.clientY)?.closest?.("[data-sve-ht-sec-uid]"),r=i?.getAttribute("data-sve-ht-sec-uid")||"";if(!r||r===Ke){n.sectionDrop=null;return}const d=i.getBoundingClientRect();n.sectionDrop={uid:r,place:t.clientY-d.top<d.height/2?"before":"after"}}function il(e,t){const s=Ke,o=n.sectionDrop,a=n.dragging;ho(),a&&(be=!0,e.setTimeout(()=>{be=!1},0)),!(!a||!s||!o?.uid||o.uid===s)&&(t?.preventDefault?.(),ll(e,s,o.uid,o.place))}function ho(){try{nt?.releasePointerCapture?.(ot)}catch{}Mt?.(),Ke=null,Be=null,nt=null,ot=null,n.dragging=!1,n.sectionDrop=null}function ll(e,t,s,o){const a=dt(e)||"page_sections";for(const i of jt(e.document)||[]){const r=Vt(i.values),d=r&&typeof r=="object"?r[a]:null;if(!Array.isArray(d))continue;const h=b=>d.findIndex(x=>x&&typeof x=="object"&&[x._visual_id,x.id,x._id].includes(b)),k=h(t),v=h(s);if(k===-1||v===-1||k===v)return!1;let f=o==="before"?v:v+1;return k<f&&(f-=1),f===k?!1:(e.postMessage({source:ee,type:Q.MOVE,uid:t,toIndex:f},e.location.origin),e.setTimeout(()=>A(e),60),!0)}return!1}function po(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function Ot(e,t){if(t?.kind==="component"){dl(e,t);return}if(Y.callOpen&&(Y.callOpen=!1,Y.callStore=null,U.forget(),Gt(e)),t?.kind!=="antlers"){n.inspect=null;return}const s=t.id;if(t.tag==="else"){n.inspect={key:s,title:u(e,"antlers_condition"),mode:"note",note:u(e,"antlers_else_note")};return}if(t.antlers==="loop"){const o=t.loopKind==="collection",a=me?.id===t.id?me.dir:"",i=t.sortDir||a;n.inspect={key:s,title:u(e,"antlers_loop"),mode:"loop",loopKind:o?"collection":"field",kinds:[{id:"field",label:u(e,"antlers_loop_field")},{id:"collection",label:u(e,"antlers_loop_collection")}],collections:po(e),value:t.expr||"",placeholder:u(e,o?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:u(e,"antlers_sort"),dir:i,needsField:i==="asc"||i==="desc",field:t.sortField||"",pickable:!o,placeholder:u(e,o?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:u(e,"antlers_sort_none")},{id:"asc",label:u(e,"antlers_sort_asc")},{id:"desc",label:u(e,"antlers_sort_desc")},{id:"random",label:u(e,"antlers_sort_random")}]},limit:{title:u(e,"antlers_limit"),value:t.limit||"",placeholder:u(e,"antlers_limit_placeholder")},branches:[]};return}n.inspect={key:s,title:u(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:u(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:u(e,"antlers_add_elseif")},{id:"else",label:u(e,"antlers_add_else")}]}}function dl(e,t){if(!Ts(e)){n.inspect=null;return}if(!t.src)return;const s=t.id;if(n.inspect={key:s,title:u(e,"component_props_values"),mode:"note",note:u(e,"code_dock_loading")},xs()){const o={},a={},i=new Map;for(const[r,d]of Ss(z().slice(t.from,t.to))){const h=ws(r);h&&(r!==h||!i.has(h))&&i.set(h,d)}for(const[r,d]of i)d.bound?a[r]=d.value:o[r]=d.value;yn!==s&&(yn=s,Ve.clear());for(const r of Ve)r in a||(a[r]="");n.inspect=null,Y.callOpen=!0,Y.title=Y.title||u(e,"component_props"),Y.callTitle=t.klass||t.name||t.src,Y.callStore=U.ui,U.ui.canBind=!0,U.ui.dataTitle=u(e,"data_vars_title"),U.ui.exprPlaceholder=u(e,"component_props_expr"),U.ui.onToggleBind=(r,d)=>ul(e,r,d),U.ui.onExpr=(r,d)=>$n(e,r,d),U.ui.onPickData=(r,d)=>T("dock:data-menu",{anchor:d,at:t.from,onPick:h=>$n(e,r,String(h?.var||"").trim())}),U.load(e,{key:`${t.src}::${s}`,src:t.src,params:o,bindings:a,readOnly:T("dock:is-locked")===!0}),U.watch(e,{src:t.src,write:r=>cl(e,r,a)}),Gt(e);return}$s(e,t.src).then(o=>{if(n.inspect?.key===s){if(!o.length){n.inspect={key:s,title:u(e,"component_props_values"),mode:"note",note:u(e,"component_props_values_none")};return}n.inspect={key:s,title:u(e,"component_props_values"),mode:"props",inheritLabel:u(e,"component_props_inherit"),rows:Cs(o,z().slice(t.from,t.to))}}})}function cl(e,t,s={}){const o=n.rows.find(r=>r.id===O);if(o?.kind!=="component"||T("dock:is-locked"))return;let a=z(),i=o.to;for(const[r,d]of Object.entries(t||{})){if(r in s)continue;const h=a.length,k=Ut(a,{from:o.from,to:i},r,d);k!==a&&(i+=k.length-h,a=k)}a!==z()&&(Pe(a,{save:!0}),A(e))}function ul(e,t,s){s?Ve.add(t):Ve.delete(t),fo(e,t,"",s),A(e)}function $n(e,t,s){Ve.add(t),fo(e,t,s,!0),A(e)}function fo(e,t,s,o){const a=n.rows.find(d=>d.id===O);if(a?.kind!=="component"||T("dock:is-locked"))return;const i=z(),r=Ut(i,a,t,s,{bound:o});r!==i&&Pe(r,{save:!0})}function rt(){const e=n.rows.find(t=>t.id===O);return e?.kind==="antlers"&&!T("dock:is-locked")?e:null}function ke(e,t){const s=rt();if(!s)return;const o=z(),a=t(o,s);a!==o&&(Pe(a),A(e))}function Cn(e,t,s,o){const a=n.rows.find(d=>d.id===O);if(a?.kind!=="component"||T("dock:is-locked"))return;const i=z(),r=Ut(i,a,t,s,{bound:o});r!==i&&(Pe(r,{save:!0}),A(e))}function hl(e,t){ke(e,(s,o)=>o.antlers==="loop"?Et(s,o,o.loopKind==="collection"?"collection":"field",t):xi(s,o,t))}function pl(e,t){const s=rt();if(!s||s.antlers!=="loop")return;const o=s.loopKind==="collection"?"collection":"field";if(t!==o){if(t==="collection"){const a=po(e)[0]?.handle;if(!a)return;ke(e,(i,r)=>Et(i,r,"collection",a));return}ke(e,(a,i)=>Et(a,i,"field",i.handle||"items"))}}function fl(e,t){ke(e,(s,o)=>Li(s,o,t))}function ml(e,t){if(!e||!t||Nn(t)||jn(t.tag))return null;const s=bs(e,t);if(s<t.openTo)return null;const o=e.lastIndexOf(`
`,s-1)+1;return e.slice(o,s).trim()===""&&o>t.openTo?o-1:s}function it(e,t,s){if(be)return;const o=(s||n.rows).find(a=>a.id===t);o&&(O=t,n.rows.forEach(a=>{a.current=a.id===t}),Ot(e,o),!Yt()&&(T("dock:reveal-html",{from:o.from,to:o.to,caret:ml(z(),o)}),T("dock:tw-follow"),ue({source:ee,type:Q.SVE_HTML_PICK_FOCUS,path:o.path},e)))}function vl(e,t){if(!t)return"";const s=[],o=(a,i)=>{for(const r of a||[]){const d=i||r.path===e;r.kind==="component"&&r.src===t&&s.push({path:r.path,inside:d}),o(r.children,d)}};return o(Ce,!1),(s.find(a=>a.inside)||s[0])?.path||""}function gl(e,t){if(!t||!W(e.document))return;Ee=!1,Xe(t),A(e);const s=n.rows.find(o=>o.path===t);s&&(it(e,s.id,n.rows),e.setTimeout(()=>{W(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function Dt(e){if(Ze)return;const t=()=>{n.editingId||n.dragging||(e.clearTimeout(Qe),Qe=e.setTimeout(()=>{W(e.document)&&A(e)},80))},s=()=>{if(t(),T("dock:on-empty-page")===!0){const o=pt(e,e.document);o[0]&&ft(e,e.document,o,o[0].uid,"")}};Ze=Rn("dock:html-changed",t),e.document.addEventListener("sve-page-structure",s),Ht=()=>{e.document.removeEventListener("sve-page-structure",s)}}function yl(e){Ze?.(),Ze=null,Ht?.(),Ht=null,e?.clearTimeout?.(Qe),Qe=0}function Jt(e){const t=W(e.document);if(ue({source:ee,type:Q.SVE_HTML_PICK,on:!1},e),yl(e),U.forget(),Y.callOpen=!1,Y.callStore=null,Gt(e),Ge(),ne(),fs(e),O=null,n.inspect=null,n.editingId=null,n.draft="",n.sections=[],n.pageBuilder=!1,n.layoutFile=!1,J="",e?.clearTimeout?.(Le),!t){$t(e);return}t.remove(),Nt.headerTab==="html_tree"&&ss(e,null),Do(e),En(e),Pn(e),$t(e)}function Ll(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=Ye,Fe(t,zn,{title:u(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>Jt(e)))}function El(e){Dt(e),A(e)}function mo(e){const t=e.document;if(!No(e,"html_tree"))return;if(W(t)){Dt(e),A(e);return}if(!so(t))return;Ee=!0,K.clear(),jo(e,[Ye]);const s=t.createElement("div");s.id=Ye,s.style.cssText=Vo,Fe(s,zn,{title:u(e,"html_tree")}),s.querySelector("[data-sve-close]")?.addEventListener("click",()=>Jt(e)),Ko(e,s),En(e),Pn(e),$t(e),Dt(e),A(e)}function Pl(e){if(W(e.document)){Jt(e);return}mo(e)}qt("html-tree:open-section",e=>{const t=window,s=t.document,o=pt(t,s),a=o.find(i=>i.uid===e||i.ids.includes(e));return a?(ft(t,s,o,a.uid,""),{uid:a.uid,ids:a.ids}):null});qt("html-tree:from-preview",({path:e,src:t}={})=>{Dn(window,e)||gl(window,vl(e,t)||e)});qt("html-tree:arm-pick",e=>{const t=window;return e?(lo(t,ht(z(),to(t))),!0):(W(t.document)||ue({source:ee,type:Q.SVE_HTML_PICK,on:!1},t),!0)});function Hl(){de.clear(),$e.clear(),_e.length=0}export{Ei as HTML_TREE_STYLE_ID,Cl as armHtmlTreePrefetch,Hl as clearHtmlTreeTemplates,ne as closeHtmlTreeMenu,Jt as closeHtmlTreePanel,Mi as ensureHtmlTreeStyles,Ll as fillHtmlTreePane,O as htmlTreeActiveId,W as htmlTreePanel,Qe as htmlTreeTimer,Ze as htmlTreeUnhook,mo as openHtmlTreePanel,A as renderHtmlTree,El as showHtmlTreePane,yl as stopWatchHtmlTreeDock,Pl as toggleHtmlTreePanel,Dt as watchHtmlTreeDock};
