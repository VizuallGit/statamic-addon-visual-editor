const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-AWaJHJyk.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{_ as qe,I as q,J as ko,K as Ae,o as h,k as g,l as L,G as $,m as E,F as R,L as ve,n as V,b4 as bo,x as C,O as wt,b5 as _o,A as ce,t as u,C as To,a as T,b6 as xo,b7 as Ln,z as Bt,b8 as sn,b9 as an,ba as So,bb as wo,bc as $o,bd as Co,be as lt,D as ue,av as Lo,bf as n,u as i,w as En,v as Eo,M as le,bg as Po,B as Ho,bh as X,bi as Mo,bj as Io,H as Re,j as fe,bk as Ao,bl as Ro,bm as rn,N as Fo,Q as Oo,s as Nt,aw as $t,as as Do,aQ as Pn,aR as Hn,i as Bo,an as ln,a1 as Fe,X as No,aP as jo,at as Vo,au as Ko,a2 as Mn,ae as qo,bn as In,bo as Go,bp as dn,bq as An,a0 as Rn,br as Uo,E as Fn,aa as dt,T as jt,U as Vt,aA as ct,aB as Ne,S as Kt,bs as zo,bt as Xo,bu as On,bv as Yo,bw as Wo,bx as Zo,by as Jo,bz as Qo,aT as es,aU as ts,az as ns,bA as os,b0 as ss,am as qt,aM as as,aH as rs}from"./addon-BNY-fcdV.js";import{M as Q,S as ee}from"./protocol-Brvy2KuB.js";import{canEditFields as is,currentSetHandle as ls,openFieldsetOverlay as Dn,openGlobalFieldsOverlay as ds}from"./section-fields-DvCLJjAz.js";import{H as Ye,ad as cs}from"./ai-text-icon-CaHMo9Tt.js";import{I as Y,J as us,K as ut,L as hs,t as ps,M as Gt,z as fs,D as ms,d as ht,N as vs,m as cn,O as Bn,v as gs,Q as Nn,H as we,R as ys,S as Ut,c as ks,T as jn,U as Vn,V as bs,h as _s,a as Ts,W as xs,X as Ss,Y as ws,Z as $s,$ as Cs,a0 as Ls,a1 as Es,a2 as Ps,a3 as Hs,a4 as Ms}from"./locked-tags-DOPX8_Dd.js";import{b as Is}from"./html-pick-align-CLq5l-p4.js";import"./FieldsetOverlay-DRh-deBy.js";const As={class:"sve-dialog__title"},Rs={for:"sve-new-section-group"},Fs={class:"sve-dialog__row"},Os=["disabled"],Ds=["value"],Bs=["title","aria-label"],Ns={key:0,class:"sve-dialog__add-group"},js={for:"sve-new-section-group-name"},Vs={class:"sve-dialog__row"},Ks=["placeholder","disabled"],qs=["disabled"],Gs=["disabled"],Us={for:"sve-new-section-name"},zs=["placeholder"],Xs={key:1,class:"sve-dialog__toggle"},Ys={key:2,class:"sve-dialog__note"},Ws={class:"sve-dialog__actions"},Zs=["disabled"],Js=["disabled"],Qs={__name:"NewSectionPrompt",props:{heading:{type:String,required:!0},groupLabel:{type:String,required:!0},nameLabel:{type:String,required:!0},placeholder:{type:String,default:""},note:{type:String,default:""},groups:{type:Array,required:!0},toggleLabel:{type:String,default:""},toggleOn:{type:Boolean,default:!0},cancelLabel:{type:String,required:!0},saveLabel:{type:String,required:!0},onOk:{type:Function,required:!0},onClose:{type:Function,required:!0},addGroupLabel:{type:String,default:""},addGroupNameLabel:{type:String,default:""},addGroupPlaceholder:{type:String,default:""},onAddGroup:{type:Function,default:null}},setup(e){const t=e,s=q(""),o=q([...t.groups]),a=q(t.groups[0]?.key??""),l=q(!1),r=q(""),d=q(null),f=q(!1);function k(){l.value=!0,r.value="",Ae(()=>d.value?.focus())}function v(){l.value=!1,r.value="",Ae(()=>_.value?.focus())}async function m(){const H=r.value.trim();if(!H||f.value||!t.onAddGroup){d.value?.focus();return}f.value=!0;const P=await t.onAddGroup(H);if(f.value=!1,!P?.key){d.value?.focus();return}o.value.some(F=>F.key===P.key)||o.value.push(P),a.value=P.key,l.value=!1,r.value="",Ae(()=>_.value?.focus())}function b(H){H.key==="Enter"?(H.preventDefault(),m()):H.key==="Escape"&&(H.stopPropagation(),v())}const x=q(t.toggleOn),_=q(null),I=q(!1);ko(()=>Ae(()=>_.value?.focus()));function y(){const H=s.value.trim();if(!H||o.value.length&&!a.value||I.value){_.value?.focus();return}I.value=!0,t.onOk(H,a.value,x.value)}function p(H){H.target===H.currentTarget&&t.onClose()}function S(H){H.key==="Enter"?y():H.key==="Escape"&&t.onClose()}return(H,P)=>(h(),g("div",{class:"sve-dialog-overlay",onClick:p},[L("div",{class:"sve-dialog",onClick:P[5]||(P[5]=$(()=>{},["stop"]))},[L("div",As,E(e.heading),1),o.value.length?(h(),g(R,{key:0},[L("label",Rs,E(e.groupLabel),1),L("div",Fs,[ve(L("select",{id:"sve-new-section-group","onUpdate:modelValue":P[0]||(P[0]=F=>a.value=F),disabled:l.value,onKeydown:S},[(h(!0),g(R,null,V(o.value,F=>(h(),g("option",{key:F.key,value:F.key},E(F.display),9,Ds))),128))],40,Os),[[bo,a.value]]),e.onAddGroup&&!l.value?(h(),g("button",{key:0,type:"button",class:"is-add",title:e.addGroupLabel,"aria-label":e.addGroupLabel,"data-sve-new-group":"",onClick:k},[...P[6]||(P[6]=[L("span",{"aria-hidden":"true"},"+",-1)])],8,Bs)):C("",!0)]),l.value?(h(),g("div",Ns,[L("label",js,E(e.addGroupNameLabel||e.addGroupLabel),1),L("div",Vs,[ve(L("input",{id:"sve-new-section-group-name",ref_key:"groupInput",ref:d,"onUpdate:modelValue":P[1]||(P[1]=F=>r.value=F),type:"text",placeholder:e.addGroupPlaceholder,disabled:f.value,"data-sve-new-group-name":"",onKeydown:b},null,40,Ks),[[wt,r.value]]),L("button",{type:"button",class:"is-primary is-small",disabled:f.value,"data-sve-new-group-create":"",onClick:m},E(e.saveLabel),9,qs),L("button",{type:"button",class:"is-cancel is-small",disabled:f.value,onClick:v},E(e.cancelLabel),9,Gs)])])):C("",!0)],64)):C("",!0),L("label",Us,E(e.nameLabel),1),ve(L("input",{id:"sve-new-section-name",ref_key:"input",ref:_,"onUpdate:modelValue":P[2]||(P[2]=F=>s.value=F),type:"text",placeholder:e.placeholder,onKeydown:S},null,40,zs),[[wt,s.value]]),e.toggleLabel?(h(),g("label",Xs,[ve(L("input",{"onUpdate:modelValue":P[3]||(P[3]=F=>x.value=F),type:"checkbox",onKeydown:S},null,544),[[_o,x.value]]),L("span",null,E(e.toggleLabel),1)])):C("",!0),e.note?(h(),g("p",Ys,E(e.note),1)):C("",!0),L("div",Ws,[L("button",{type:"button",class:"is-cancel",disabled:I.value,onClick:P[4]||(P[4]=(...F)=>e.onClose&&e.onClose(...F))},E(e.cancelLabel),9,Zs),L("button",{type:"button",class:"is-primary",disabled:I.value,onClick:y},E(e.saveLabel),9,Js)])])]))}},Kn=qe(Qs,[["__scopeId","data-v-6501522a"]]),qn=["section","div","article","aside","nav","header","footer"];function ea(e){const t=qn.includes(e)?e:"div";return`<${t} class="${t==="section"?"[ ] py-800":"[ ]"}">
    
</${t}>`}function ta(e,t,s=null){const o=String(e||""),a=ea(t),l=s?s.wrapFrom??s.from:NaN,r=s?s.wrapTo??s.to:NaN;if(!Number.isInteger(l)||!Number.isInteger(r)||l<0||r>o.length||l>r){const m=`${o.replace(/\s+$/,"")}${o.trim()?`

`:""}`;return{html:`${m}${a}
`,at:m.length}}const d=o.lastIndexOf(`
`,l-1)+1,f=o.slice(d,l),k=/^[ \t]*$/.test(f)?f:"",v=a.split(`
`).map(m=>m&&k+m).join(`
`);return{html:`${o.slice(0,r)}
${v}${o.slice(r)}`,at:r+1+k.length}}const zt="/!/sve/section-types",un="static_sections";async function na(e){const t=await e.fetch(`${zt}?${xo(e)}`,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!t.ok)throw new Error(`section-types ${t.status}`);const s=await t.json();if(Array.isArray(s.groups)&&s.groups.length)return s.groups.filter(a=>a&&a.handle&&a.handle!==un).map(a=>({key:a.handle,display:a.display||a.handle}));const o=new Map;for(const a of s.types||[])a?.group&&a.group!==un&&!o.has(a.group)&&o.set(a.group,a.group_display||a.group);return[...o].map(([a,l])=>({key:a,display:l}))}async function oa(e,t){const s=await e.fetch(`${zt}/groups`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Bt(e),"X-Requested-With":"XMLHttpRequest",Accept:"application/json"},body:JSON.stringify({display:t,...Ln(e)})}),o=await s.json().catch(()=>({}));if(!s.ok||!o.group?.handle)throw new Error(o?.error==="bad_name"?"bad_name":`section-types/groups ${s.status}`);return e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale")),{key:o.group.handle,display:o.group.display||o.group.handle}}const je=new Map;function sa(e){e?.handle&&je.set(e.handle,{static:!!e.static,hidden:!!e.hidden})}function aa(e,t){return t?je.has(t)?je.get(t).static:e.Statamic?.$config?.get?.("sveSetMeta")?.[t]?.static===!0:!1}function ra(e,t){if(!t)return!1;if(je.has(t))return je.get(t).hidden;const s=e.Statamic?.$config?.get?.("sveSectionTypes");return Array.isArray(s)&&s.some(o=>o?.handle===t&&o.hidden===!0)}async function Gn(e,t,s){const o=await e.fetch(zt,{method:t,headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Bt(e),Accept:"application/json"},credentials:"same-origin",body:JSON.stringify({...s,...Ln(e)})}),a=await o.json().catch(()=>({}));if(!o.ok){const l=new Error(a.error||`section-types ${o.status}`);throw l.reason=a.error,l}return sa(a.section),a}function ia(e,{display:t,group:s="",static:o=!1,hidden:a=!1}){return Gn(e,"POST",{display:t,group:s,static:o,hidden:a})}function hn(e,{handle:t,hidden:s,fields:o=!1}){const a={handle:t,fields:o};return typeof s=="boolean"&&(a.hidden=s),Gn(e,"PATCH",a)}async function la(e,t,s=null,o=null){if(!t||typeof sn!="function"||typeof an!="function")return null;const a=await sn(e,t);if(!a)return null;o&&Array.isArray(a.definitions)&&So(t,{display:o.display||t,icon:o.icon||null,hide:o.hidden===!0,fields:a.definitions,group_display:o.group_display||o.group||""},o.group||"");const l=wo(),r=$o(e,"page",{handle:t},a?.defaults,l),d=Co(r,a?.new||{},a?.defaults);return an(e,e.document,s,r,d)?r:null}const pn=700,da=17;function ca(e,t){const s=(t||[]).filter(Boolean);if(!s.length)return;let o=0;const a=()=>{o+=1;const l=lt(e),r=l?s.some(d=>l.querySelector(`[data-sid="${CSS.escape(d)}"]`)):!0;r&&ue({source:ee,type:Q.SVE_ACTIVATE,ids:s},e),(r?!l&&o<6:o<da)&&e.setTimeout(a,pn)};e.setTimeout(a,pn)}function Un(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function ua(e){return new Promise(t=>{let s=!1;const o=l=>{s||(s=!0,a.dismiss(),t(l==="static"||l==="fields"?l:null))},a=ce(e.document,To,{title:u(e,"section_new_kind"),body:u(e,"section_new_kind_note"),buttons:[{value:"cancel",label:u(e,"cancel"),variant:"ghost"},{value:"static",label:u(e,"section_new_static"),variant:"primary"},{value:"fields",label:u(e,"section_new_with_fields"),variant:"primary"}],onPick:o,onClose:()=>o(null)})})}function ha(e,t,s=null){if(T("dock:is-locked")===!0)return e.Statamic?.$toast?.error(u(e,"code_dock_locked")),null;const{html:o,at:a}=ta(String(T("dock:html")||""),t,s);return T("dock:set-html",o)!==!0?(e.Statamic?.$toast?.error(u(e,"section_new_failed")),null):(T("dock:save-now"),e.Statamic?.$toast?.success(u(e,"html_tree_element_added",{tag:t})),a)}async function zn(e,t,s,{afterUid:o,onDone:a,onError:l}){try{const r=await ia(e,s);t.dismiss(),e.Statamic?.$toast?.success(u(e,"section_created",{name:r.section?.display||s.display})),Ct(e);const d=r.section?.handle?{...r.section,group_display:(r.section_types||[]).find(k=>k?.handle===r.section.handle)?.group_display||""}:null,f=await la(e,r.section?.handle,o,d);!f&&r.section?.handle&&T("dock:open-template",r.section.handle),a?.({...r,uid:f?._visual_id||""})}catch(r){t.dismiss(),e.Statamic?.$toast?.error(u(e,r.reason==="bad_name"?"section_new_bad_name":"section_new_failed")),l?.(r)}}function Ct(e){e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"))}function pa(e,{afterUid:t=null,onDone:s,onError:o,onClose:a}={}){const l=ce(e.document,Kn,{heading:u(e,"static_section_new"),groupLabel:"",nameLabel:u(e,"section_new_name"),placeholder:u(e,"section_new_placeholder"),note:u(e,"static_section_note"),groups:[],toggleLabel:u(e,"static_section_insertable"),cancelLabel:u(e,"cancel"),saveLabel:u(e,"section_new_create"),onClose:a,onOk:(r,d,f)=>{zn(e,l,{display:r,static:!0,hidden:!f},{afterUid:t,onDone:s,onError:o})}})}function fa(e,{afterUid:t=null,onDone:s,onError:o,onClose:a}={}){(async()=>{let l=[];try{l=await na(e)}catch(d){o?.(d),e.Statamic?.$toast?.error(u(e,"section_new_failed"));return}if(!l.length){o?.(new Error("no groups")),e.Statamic?.$toast?.error(u(e,"section_new_failed"));return}const r=ce(e.document,Kn,{heading:u(e,"section_new"),groupLabel:u(e,"section_new_group"),nameLabel:u(e,"section_new_name"),placeholder:u(e,"section_new_placeholder"),note:u(e,"section_new_note"),groups:l,addGroupLabel:u(e,"section_new_group_add"),addGroupNameLabel:u(e,"section_new_group_name"),addGroupPlaceholder:u(e,"section_new_group_placeholder"),onAddGroup:async d=>{try{const f=await oa(e,d);return e.Statamic?.$toast?.success(u(e,"section_group_created",{name:f.display})),f}catch(f){return e.Statamic?.$toast?.error(u(e,f?.message==="bad_name"?"section_new_bad_name":"section_group_failed")),null}},cancelLabel:u(e,"cancel"),saveLabel:u(e,"section_new_create"),onClose:a,onOk:(d,f)=>{zn(e,r,{display:d,group:f},{afterUid:t,onDone:s,onError:o})}})})()}const ma={key:0,class:"sve-ht-inspect"},va={class:"sve-ht-inspect__head"},ga={key:0,class:"sve-ht-inspect__note"},ya={key:2,class:"sve-ht-inspect__props"},ka={class:"sve-ht-inspect__proplabel"},ba={key:0},_a=["value","disabled","onChange"],Ta={value:""},xa=["value"],Sa=["value"],wa=["value","placeholder","onChange"],$a=["title","disabled","onClick"],Ca=["title","disabled","onClick"],La={key:0,class:"sve-ht-inspect__seg"},Ea=["data-active","disabled","onClick"],Pa=["value","disabled"],Ha={key:0,value:""},Ma=["value"],Ia={key:2,class:"sve-ht-inspect__box"},Aa=["value","placeholder","disabled","onKeydown"],Ra=["title","disabled"],Fa={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Oa=["value","disabled"],Da=["value"],Ba={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},Na=["value","placeholder","disabled"],ja=["title","disabled"],Va={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Ka=["value","placeholder","disabled"],qa={key:4,class:"sve-ht-inspect__add"},Ga=["disabled","onClick"],vt='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',Ua='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',za={__name:"HtmlTreeInspector",setup(e){const t=q(null);Lo(t,k=>n.onPropHost?.(k||null));const s=q(null),o=q(null);function a(k){n.onInspectCommit?.(k.target.value)}function l(k,v,m){!k||!v||(k.value=v,k.focus(),k.setSelectionRange(v.length,v.length),m(v))}function r(k,v){n.onInspectData?.(k.currentTarget,m=>n.onPropValue?.(v.handle,m,!0))}function d(k){n.onInspectData?.(k.currentTarget,v=>l(s.value,v,m=>n.onInspectCommit?.(m)))}function f(k){n.onInspectData?.(k.currentTarget,v=>l(o.value,v,m=>n.onLoopSortField?.(m)))}return(k,v)=>i(n).inspect?(h(),g("div",ma,[L("div",va,E(i(n).inspect.title),1),i(n).inspect.mode==="note"?(h(),g("div",ga,E(i(n).inspect.note),1)):i(n).inspect.mode==="statamic"?(h(),g("div",{key:1,ref_key:"propHost",ref:t,class:"sve-ht-inspect__form"},null,512)):i(n).inspect.mode==="props"?(h(),g("div",ya,[(h(!0),g(R,null,V(i(n).inspect.rows,m=>(h(),g("label",{key:m.handle,class:"sve-ht-inspect__prop"},[L("span",ka,[En(E(m.label)+" ",1),m.bound?(h(),g("em",ba,":")):C("",!0)]),L("span",{class:Eo(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":m.type==="select"||m.type==="link"}])},[m.type==="select"&&!m.bound?(h(),g("select",{key:0,value:m.value,disabled:!i(n).canEdit,onChange:b=>i(n).onPropValue?.(m.handle,b.target.value,!1)},[L("option",Ta,E(m.placeholder||i(n).inspect.inheritLabel),1),m.value&&!m.options.includes(m.value)?(h(),g("option",{key:0,value:m.value},E(m.value),9,xa)):C("",!0),(h(!0),g(R,null,V(m.options,b=>(h(),g("option",{key:b,value:b},E(b),9,Sa))),128))],40,_a)):(h(),g("input",{key:1,type:"text",value:m.value,placeholder:m.placeholder||i(n).inspect.inheritLabel,onChange:b=>i(n).onPropValue?.(m.handle,b.target.value,m.bound)},null,40,wa)),m.type==="link"?(h(),g("button",{key:2,type:"button","data-sve-ht-data":"",title:i(n).pageTitle,disabled:!i(n).canEdit,onClick:b=>i(n).onPropPage?.(b.currentTarget,m.handle),innerHTML:Ua},null,8,$a)):C("",!0),L("button",{type:"button","data-sve-ht-data":"",title:i(n).dataTitle,disabled:!i(n).canEdit,onClick:b=>r(b,m),innerHTML:vt},null,8,Ca)],2)]))),128))])):(h(),g(R,{key:3},[i(n).inspect.mode==="loop"?(h(),g("div",La,[(h(!0),g(R,null,V(i(n).inspect.kinds,m=>(h(),g("button",{key:m.id,type:"button","data-active":m.id===i(n).inspect.loopKind?"":void 0,disabled:!i(n).canEdit,onClick:b=>i(n).onLoopKind?.(m.id)},E(m.label),9,Ea))),128))])):C("",!0),i(n).inspect.mode==="loop"&&i(n).inspect.loopKind==="collection"?(h(),g("select",{key:i(n).inspect.key+":"+i(n).inspect.value,value:i(n).inspect.value,disabled:!i(n).canEdit,onChange:a},[i(n).inspect.value?C("",!0):(h(),g("option",Ha,E(i(n).inspect.placeholder),1)),(h(!0),g(R,null,V(i(n).inspect.collections,m=>(h(),g("option",{key:m.handle,value:m.handle},E(m.title),9,Ma))),128))],40,Pa)):(h(),g("div",Ia,[(h(),g("input",{ref_key:"field",ref:s,key:i(n).inspect.key,type:"text",value:i(n).inspect.value,placeholder:i(n).inspect.placeholder,disabled:!i(n).canEdit,spellcheck:"false",onKeydown:[v[0]||(v[0]=$(()=>{},["stop"])),le($(a,["prevent"]),["enter"])],onBlur:a},null,40,Aa)),L("button",{type:"button","data-sve-ht-data":"",title:i(n).dataTitle,disabled:!i(n).canEdit,innerHTML:vt,onMousedown:v[1]||(v[1]=$(()=>{},["prevent"])),onClick:$(d,["stop","prevent"])},null,40,Ra)])),i(n).inspect.sort?(h(),g(R,{key:3},[L("div",Fa,E(i(n).inspect.sort.title),1),(h(),g("select",{key:i(n).inspect.key+":dir:"+i(n).inspect.sort.dir,value:i(n).inspect.sort.dir,disabled:!i(n).canEdit,onChange:v[2]||(v[2]=m=>i(n).onLoopSortDir?.(m.target.value))},[(h(!0),g(R,null,V(i(n).inspect.sort.dirs,m=>(h(),g("option",{key:m.id,value:m.id},E(m.label),9,Da))),128))],40,Oa)),i(n).inspect.sort.needsField?(h(),g("div",Ba,[(h(),g("input",{ref_key:"sortField",ref:o,key:i(n).inspect.key+":field",type:"text",value:i(n).inspect.sort.field,placeholder:i(n).inspect.sort.placeholder,disabled:!i(n).canEdit,spellcheck:"false",onKeydown:[v[3]||(v[3]=$(()=>{},["stop"])),v[4]||(v[4]=le($(m=>i(n).onLoopSortField?.(m.target.value),["prevent"]),["enter"]))],onBlur:v[5]||(v[5]=m=>i(n).onLoopSortField?.(m.target.value))},null,40,Na)),i(n).inspect.sort.pickable?(h(),g("button",{key:0,type:"button","data-sve-ht-data":"",title:i(n).dataTitle,disabled:!i(n).canEdit,innerHTML:vt,onMousedown:v[6]||(v[6]=$(()=>{},["prevent"])),onClick:$(f,["stop","prevent"])},null,40,ja)):C("",!0)])):C("",!0),L("div",Va,E(i(n).inspect.limit.title),1),(h(),g("input",{key:i(n).inspect.key+":limit",type:"number",min:"1",value:i(n).inspect.limit.value,placeholder:i(n).inspect.limit.placeholder,disabled:!i(n).canEdit,onKeydown:[v[7]||(v[7]=$(()=>{},["stop"])),v[8]||(v[8]=le($(m=>i(n).onLoopLimit?.(m.target.value),["prevent"]),["enter"]))],onBlur:v[9]||(v[9]=m=>i(n).onLoopLimit?.(m.target.value))},null,40,Ka))],64)):C("",!0),i(n).inspect.branches?.length?(h(),g("div",qa,[(h(!0),g(R,null,V(i(n).inspect.branches,m=>(h(),g("button",{key:m.id,type:"button",disabled:!i(n).canEdit,onClick:b=>i(n).onAddBranch?.(m.id)},E(m.label),9,Ga))),128))])):C("",!0)],64))])):C("",!0)}},Xa=qe(za,[["__scopeId","data-v-26254b75"]]),Ya={class:"sve-html-tree"},Wa={class:"sve-pane-bar","data-sve-pane-bar":""},Za={"data-sve-right-title":""},Ja={"data-sve-right-actions":""},Qa=["aria-pressed","title","aria-label"],er=["title"],tr={class:"sve-ht-used-by__label"},nr={class:"sve-ht-used-by__chips"},or={key:0,class:"sve-ht-used-by__empty"},sr={class:"sve-ht-tools"},ar=["title"],rr=["placeholder","aria-label","value"],ir=["aria-label"],lr=["title","aria-label"],dr={key:2,class:"sve-tree-exit"},cr=["title"],ur=["title"],hr='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',pr='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',fr='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',mr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/></svg>',vr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',gr={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const t=u(window,"html_tree_search");n.layers=Po(window);const s=u(window,"html_tree_layers_on"),o=u(window,"html_tree_layers_off");function a(){Io(window,!n.layers)}const l=Un(window),r=u(window,"section_new"),d=u(window,"html_tree_add_element"),f=q(!1);function k(){f.value=!1}async function v(I){if(!I)return;await Ae(),n.onRefresh?.();const y=T("html-tree:open-section",I);y&&ca(window,y.ids)}function m(){return n.rows.find(I=>I.current&&!I.context&&!I.synthetic)||null}function b(I){const y=I.getBoundingClientRect(),p=m();let S=null;S=ce(document,ut,{items:qn.map(H=>({label:H,onPick:()=>{S?.dismiss(),S=null,k();const P=ha(window,H,p);P!==null&&(n.selectFrom={at:P,left:4})}})),x:Math.round(y.left),y:Math.round(y.bottom+4),onClose:()=>{S=null,k()}})}function x(I){if(!f.value){if(f.value=!0,!(n.sections.length||n.pageBuilder)){b(I.currentTarget);return}(async()=>{const y=await ua(window);if(!y){k();return}const p=n.sections.length?n.sections[n.sections.length-1].uid:null,S=H=>{k(),v(H?.uid)};if(y==="static"){pa(window,{afterUid:p,onDone:S,onError:k,onClose:k});return}fa(window,{afterUid:p,onDone:S,onError:k,onClose:k})})()}}function _(I){const y=!!n.query;n.query=I,y!==!!I&&n.onQuery?.()}return(I,y)=>(h(),g("div",Ya,[L("div",Wa,[L("div",Za,E(e.title),1),L("div",Ja,[L("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":i(n).layers?"true":"false",title:i(n).layers?i(o):i(s),"aria-label":i(n).layers?i(o):i(s),innerHTML:hr,onClick:a},null,8,Qa),y[5]||(y[5]=Ho('<button type="button" data-sve-right-pin aria-pressed="false" data-v-175320ba></button><button type="button" data-sve-close aria-label="Close" data-v-175320ba><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-175320ba><path d="M18 6 6 18" data-v-175320ba></path><path d="m6 6 12 12" data-v-175320ba></path></svg></button>',2))])]),i(n).usedBy?(h(),g("div",{key:0,class:"sve-ht-used-by",title:i(n).usedBy.hint||null},[L("span",tr,[L("span",{class:"sve-ht-used-by__icon","aria-hidden":"true",innerHTML:mr}),En(" "+E(i(n).usedBy.label),1)]),L("span",nr,[(h(!0),g(R,null,V(i(n).usedBy.items,p=>(h(),g("span",{key:p,class:"sve-ht-used-by__chip"},E(p),1))),128)),i(n).usedBy.empty?(h(),g("span",or,E(i(n).usedBy.empty),1)):C("",!0)])],8,er)):C("",!0),L("div",sr,[L("label",{class:"sve-ht-search",title:i(t)},[L("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:fr}),L("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:i(t),"aria-label":i(t),value:i(n).query,autocomplete:"off",spellcheck:"false",onInput:y[0]||(y[0]=p=>_(p.target.value)),onKeydown:[y[1]||(y[1]=$(()=>{},["stop"])),y[2]||(y[2]=le($(p=>_(""),["prevent"]),["escape"]))]},null,40,rr),i(n).query?(h(),g("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":i(t),innerHTML:vr,onClick:y[3]||(y[3]=p=>_(""))},null,8,ir)):C("",!0)],8,ar),i(l)&&(i(n).sections.length||i(n).pageBuilder||i(n).rows.length&&!i(n).layoutFile)?(h(),g("button",{key:0,type:"button",class:"sve-ht-new",title:i(n).sections.length||i(n).pageBuilder?i(r):i(d),"aria-label":i(n).sections.length||i(n).pageBuilder?i(r):i(d),innerHTML:pr,onClick:x},null,8,lr)):C("",!0)]),i(Y).inSidebar?C("",!0):(h(),X(us,{key:1})),y[6]||(y[6]=L("div",{"data-sve-html-tree-list":""},null,-1)),Mo(Xa),i(n).exitOpen&&!i(Y).inSidebar?(h(),g("div",dr,[L("span",{class:"sve-tree-exit__name",title:i(n).exitName},E(i(n).exitName),9,cr),L("button",{type:"button",class:"sve-tree-exit__go",title:i(n).exitTitle,onClick:y[4]||(y[4]=p=>i(n).onExit?.())},E(i(n).exitLabel),9,ur)])):C("",!0)]))}},Xn=qe(gr,[["__scopeId","data-v-175320ba"]]);function Yn(e){return String(e||"").trim().toLowerCase()}function Lt(e,t){return t?[e.name,e.tag,e.klass,e.label,e.src].filter(s=>typeof s=="string"&&s).join(" ").toLowerCase().includes(t):!0}function yr(e,t){const s=Yn(t);if(!s)return{rows:e,hits:new Set};const o=new Set;for(const r of e)Lt(r,s)&&o.add(r.path);const a=[...o];return{rows:e.filter(r=>o.has(r.path)||a.some(d=>d.startsWith(`${r.path}/`))),hits:o}}const kr=["title"],br={"data-sve-ht-indent":"","aria-hidden":"true"},_r=["data-sve-ht-cat"],Tr={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},xr={key:2,"data-sve-ht-letter":""},Sr=["innerHTML"],wr=["title"],$r=["title"],Cr={key:1,"data-sve-ht-kind":""},Lr={key:3,"data-sve-ht-name":""},Er={key:4,"data-sve-ht-actions":""},Pr=["title"],Hr={key:5,"data-sve-ht-actions":""},Mr=["data-on","title","innerHTML"],Ir=["disabled","title","innerHTML"],Ar=["disabled","title"],Rr=["disabled","title"],Fr=["disabled","title"],Or=["data-sve-ht-id"],fn='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',Dr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',Br='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Nr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',jr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',Vr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',Kr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',qr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',Gr={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const t=is(window),s=u(window,"section_fields");function o(){const y=ls();if(!y){window.Statamic?.$toast?.error(u(window,"section_fields_none"));return}Dn(window,y)}function a(y){return y.synthetic?y.frame==="main"?n.frameMainTitle:y.frame==="template"?n.frameTemplateTitle:n.frameOpenTitle:y.kind==="component"?y.src?`partial:${y.src}`:y.tag:y.name?`${y.tag} ${y.name}`:y.tag}function l(y){return!!y.section}function r(y){return!!y.frame}function d(y){return y.kind==="slot"}function f(y){return!!y.context}function k(y,p){f(p)||r(p)||d(p)||(l(p)?n.onSectionPointerDown?.(y,p.section):p.sectionRoot?n.onSectionPointerDown?.(y,p.sectionRoot):n.onPointerDown?.(y,p.id))}function v(y){if(y.synthetic){n.onFrame?.(y.frame);return}if(l(y)){n.onSection?.(y.section);return}if(f(y)){n.onContextRow?.(y.id);return}n.onSelect?.(y.id)}function m(y,p){const S={"data-sve-ht-id":y.id};return y.current&&(S["data-sve-ht-current"]=""),y.hidden&&(S["data-sve-ht-hidden"]=""),S["data-sve-ht-cat"]=y.cat||"other",S["data-sve-ht-depth"]=String(y.depth),p&&(S["data-sve-ht-dim"]=""),f(y)&&(S["data-sve-ht-context"]=y.context),l(y)&&(S["data-sve-ht-sec"]=""),r(y)&&(S["data-sve-ht-frame"]=y.frame),!l(y)&&n.dropId===y.id&&n.dropPlace&&(S["data-sve-ht-drop"]=n.dropPlace),S}function b(y){return!!y.fixed}function x(y){return!b(y)&&(!y.hidden||y.wrapFrom!=null)}function _(y){return!!y.sectionRoot||!!y.section}function I(y){return n.canEdit||_(y)}return(y,p)=>(h(),g(R,null,[L("div",Re({"data-sve-ht-row":""},m(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:p[32]||(p[32]=S=>v(e.row)),onDblclick:p[33]||(p[33]=$(S=>e.row.synthetic?i(n).onFrameEnter?.(e.row.frame):r(e.row)||d(e.row)||l(e.row)||f(e.row)?null:i(n).onRename?.(e.row.id),["prevent"])),onKeydown:[p[34]||(p[34]=le($(S=>v(e.row),["prevent"]),["enter"])),p[35]||(p[35]=le($(S=>v(e.row),["prevent"]),["space"]))],onPointerdown:p[36]||(p[36]=S=>k(S,e.row)),onContextmenu:p[37]||(p[37]=$(S=>r(e.row)||d(e.row)||l(e.row)||f(e.row)?null:i(n).onContext?.(S,e.row.id),["prevent","stop"]))}),[L("span",br,[(h(!0),g(R,null,V(e.row.guides||[],(S,H)=>(h(),g("i",{key:H,"data-sve-ht-cat":S},null,8,_r))),128))]),e.row.hasChildren||e.row.emptyBlock?(h(),g("button",Re({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?i(n).mainShut:e.row.shut)?{"data-sve-ht-shut":""}:{},{innerHTML:Dr,onClick:p[0]||(p[0]=$(S=>e.row.synthetic?i(n).onFrameTwist?.():l(e.row)?i(n).onSection?.(e.row.section):i(n).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:p[1]||(p[1]=$(()=>{},["stop"])),onDblclick:p[2]||(p[2]=$(()=>{},["stop"]))}),null,16)):(h(),g("span",Tr)),e.row.letter?(h(),g("span",xr,E(e.row.letter),1)):(h(),g("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Sr)),L("span",{"data-sve-ht-text":"",title:i(n).renameTitle},[!e.row.kind&&!l(e.row)&&!f(e.row)&&!r(e.row)?(h(),g("button",{key:0,type:"button","data-sve-ht-tag":"",title:i(n).tagTitle,onClick:p[3]||(p[3]=$(()=>{},["stop","prevent"])),onPointerdown:p[4]||(p[4]=$(()=>{},["stop"])),onDblclick:p[5]||(p[5]=$(S=>i(n).onTagChange?.(S,e.row.id),["stop","prevent"]))},E(e.row.tag),41,$r)):(h(),g("span",Cr,E(e.row.tag),1)),i(n).editingId===e.row.id&&!l(e.row)?ve((h(),g("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":p[6]||(p[6]=S=>i(n).draft=S),onMousedown:p[7]||(p[7]=$(()=>{},["stop"])),onPointerdown:p[8]||(p[8]=$(()=>{},["stop"])),onClick:p[9]||(p[9]=$(()=>{},["stop"])),onDblclick:p[10]||(p[10]=$(()=>{},["stop"])),onKeydown:[p[11]||(p[11]=$(()=>{},["stop"])),p[12]||(p[12]=le($(S=>i(n).onRenameCommit?.(),["prevent"]),["enter"])),p[13]||(p[13]=le($(S=>i(n).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:p[14]||(p[14]=S=>i(n).onRenameCommit?.())},null,544)),[[wt,i(n).draft]]):(h(),g("span",Lr,E(e.row.name),1))],8,wr),r(e.row)?(h(),g("span",Er,[e.row.frame!=="main"&&i(t)?(h(),g("button",{key:0,type:"button","data-sve-ht-fields":"",title:i(n).frameFieldsTitle,innerHTML:fn,onClick:p[15]||(p[15]=$(S=>i(n).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:p[16]||(p[16]=$(()=>{},["stop"])),onDblclick:p[17]||(p[17]=$(()=>{},["stop"]))},null,40,Pr)):C("",!0)])):!l(e.row)&&!f(e.row)&&!d(e.row)?(h(),g("span",Hr,[e.row.videoNth>=0?(h(),g("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?i(n).videoPlayTitle:i(n).videoHoldTitle,innerHTML:e.row.videoHeld?Kr:Vr,onClick:p[18]||(p[18]=$(S=>i(n).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:p[19]||(p[19]=$(()=>{},["stop"])),onDblclick:p[20]||(p[20]=$(()=>{},["stop"]))},null,40,Mr)):C("",!0),x(e.row)?(h(),g("button",{key:1,type:"button","data-sve-ht-eye":"",disabled:!i(n).canEdit,title:i(n).canEdit?e.row.hidden?i(n).showTitle:i(n).hideTitle:i(n).lockedTitle,innerHTML:e.row.hidden?Nr:Br,onClick:p[21]||(p[21]=$(S=>i(n).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:p[22]||(p[22]=$(()=>{},["stop"])),onDblclick:p[23]||(p[23]=$(()=>{},["stop"]))},null,40,Ir)):C("",!0),i(t)&&e.row.fieldsIcon?(h(),g("button",{key:2,type:"button","data-sve-ht-fields":"",disabled:!i(n).canEdit,title:i(n).canEdit?i(s):i(n).lockedTitle,innerHTML:fn,onClick:$(o,["stop","prevent"]),onPointerdown:p[24]||(p[24]=$(()=>{},["stop"])),onDblclick:p[25]||(p[25]=$(()=>{},["stop"]))},null,40,Ar)):C("",!0),b(e.row)?C("",!0):(h(),g("button",{key:3,type:"button","data-sve-ht-dup":"",disabled:!I(e.row),title:I(e.row)?i(n).duplicateTitle:i(n).lockedTitle,innerHTML:jr,onClick:p[26]||(p[26]=$(S=>i(n).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:p[27]||(p[27]=$(()=>{},["stop"])),onDblclick:p[28]||(p[28]=$(()=>{},["stop"]))},null,40,Rr)),b(e.row)?C("",!0):(h(),g("button",{key:4,type:"button","data-sve-ht-del":"",disabled:!I(e.row),title:I(e.row)?i(n).deleteTitle:i(n).lockedTitle,innerHTML:qr,onClick:p[29]||(p[29]=$(S=>i(n).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:p[30]||(p[30]=$(()=>{},["stop"])),onDblclick:p[31]||(p[31]=$(()=>{},["stop"]))},null,40,Fr))])):C("",!0)],16,kr),e.row.emptyBlock&&!e.row.shut?(h(),g("div",Re({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},i(n).dropId===e.row.id&&i(n).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),E(i(n).slotText),17,Or)):C("",!0)],64))}},Z=qe(Gr,[["__scopeId","data-v-6c7b7132"]]),Ur=["data-sve-ht-look","data-sve-ht-layers"],zr={key:0,class:"sve-ht-page-template"},Xr={key:0,class:"sve-ht-page-template__text"},Yr={class:"sve-ht-page-template__note"},Wr={key:1,class:"sve-ht-empty"},Zr={key:2,class:"sve-ht-empty"},Jr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},Qr={key:0,class:"sve-ht-empty"},ei={key:0,class:"sve-ht-empty"},ti=["data-sve-ht-under-main"],ni={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},oi={key:0,class:"sve-ht-empty"},si=["data-sve-ht-under-main"],ai=["data-dim"],ri={key:0,class:"sve-ht-empty"},ii={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},li={key:0,class:"sve-ht-empty"},di={__name:"HtmlTreeList",setup(e){const t=fe(()=>Yn(n.query)),s=fe(()=>yr(n.rows,t.value)),o=fe(()=>s.value.rows),a=fe(()=>t.value?n.sections.filter(b=>Lt(b.row,t.value)||b.current&&b.ready&&o.value.length>0):n.sections);function l(b){return!!b&&(!t.value||Lt(b,t.value))}function r(b){const x=n.frame?.kind;return n.inComponent||(x==="header"||x==="footer")&&x!==b}const d=fe(()=>!!n.frame&&["header","main","footer"].some(b=>l(n.frame[b]))),f=fe(()=>!!n.frame&&(n.frame.kind==="main"||l(n.frame.main))),k=fe(()=>!!t.value&&!a.value.length&&!o.value.length&&!d.value);function v(b){return!!t.value&&!s.value.hits.has(b.path)}function m(b){const x={"data-sve-ht-sec-uid":b.uid};return b.current&&(x["data-sve-ht-branch"]="",x["data-sve-ht-cat"]=b.row?.cat||"layout"),n.sectionDrop&&n.sectionDrop.uid===b.uid&&(x["data-sve-ht-drop"]=n.sectionDrop.place),x}return(b,x)=>(h(),g("div",Re({class:"sve-ht-root","data-sve-ht-look":i(n).layers?"tags":i(n).look,"data-sve-ht-layers":i(n).layers?"":null,style:i(n).familyStyle},i(n).dragging?{"data-sve-ht-dragging":""}:{}),[i(n).pageTemplate?(h(),g("div",zr,[i(n).pageTemplate.text?(h(),g("p",Xr,E(i(n).pageTemplate.text),1)):C("",!0),L("p",Yr,E(i(n).pageTemplate.note),1),i(n).pageTemplate.canOpen?(h(),g("button",{key:1,type:"button",class:"sve-ht-page-template__open",onClick:x[0]||(x[0]=_=>i(n).pageTemplate.onOpen(_.currentTarget))},E(i(n).pageTemplate.openLabel),1)):C("",!0)])):!i(n).rows.length&&!i(n).sections.length&&!i(n).frame?(h(),g("div",Wr,E(i(n).emptyText),1)):k.value?(h(),g("div",Zr,E(i(n).searchEmpty),1)):C("",!0),i(n).frame||i(n).sections.length?(h(),g(R,{key:3},[i(n).frame?(h(),g(R,{key:0},[i(n).frame.kind==="header"?(h(),g("div",Jr,[(h(!0),g(R,null,V(o.value,_=>(h(),X(Z,{key:_.id,row:_,dim:v(_)},null,8,["row","dim"]))),128)),i(n).rows.length?C("",!0):(h(),g("div",Qr,E(i(n).emptyText),1))])):l(i(n).frame.header)?(h(),X(Z,{key:1,row:i(n).frame.header,dim:r("header")},null,8,["row","dim"])):C("",!0)],64)):C("",!0),L("div",Ao(Ro(i(n).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[i(n).frame?.kind==="main"?(h(),g(R,{key:0},[(h(!0),g(R,null,V(o.value,_=>(h(),X(Z,{key:_.id,row:_,dim:v(_)},null,8,["row","dim"]))),128)),i(n).rows.length?C("",!0):(h(),g("div",ei,E(i(n).emptyText),1))],64)):i(n).frame&&l(i(n).frame.main)?(h(),X(Z,{key:1,row:i(n).frame.main,dim:r("main")},null,8,["row","dim"])):C("",!0),i(n).frame?.kind==="template"?ve((h(),g("div",{key:2,"data-sve-ht-frame-body":"","data-sve-ht-under-main":f.value?"":null},[L("div",ni,[(h(!0),g(R,null,V(o.value,_=>(h(),X(Z,{key:_.id,row:_,dim:v(_)},null,8,["row","dim"]))),128)),i(n).rows.length?C("",!0):(h(),g("div",oi,E(i(n).emptyText),1))])],8,ti)),[[rn,!i(n).mainShut]]):C("",!0),i(n).sections.length||i(n).frame?ve((h(),g("div",{key:3,"data-sve-ht-frame-body":"","data-sve-ht-under-main":f.value?"":null},[i(n).frame?.template&&l(i(n).frame.template)?(h(),X(Z,{key:0,row:i(n).frame.template,dim:r("template")},null,8,["row","dim"])):C("",!0),i(n).frame&&!i(n).frame.template&&!i(n).sections.length&&!t.value?(h(),g("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":r("")?"":void 0},E(i(n).frameEmptyText),9,ai)):C("",!0),(h(!0),g(R,null,V(a.value,_=>(h(),g("div",Re({key:_.uid},{ref_for:!0},m(_)),[_.ready?(h(),g(R,{key:0},[(h(!0),g(R,null,V(o.value,I=>(h(),X(Z,{key:I.id,row:I,dim:v(I)},null,8,["row","dim"]))),128)),i(n).rows.length?C("",!0):(h(),g("div",ri,E(i(n).emptyText),1))],64)):(h(),X(Z,{key:1,row:_.row,dim:r("")},null,8,["row","dim"]))],16))),128))],8,si)),[[rn,!i(n).frame||!i(n).mainShut]]):C("",!0)],16),i(n).frame?(h(),g(R,{key:1},[i(n).frame.kind==="footer"?(h(),g("div",ii,[(h(!0),g(R,null,V(o.value,_=>(h(),X(Z,{key:_.id,row:_,dim:v(_)},null,8,["row","dim"]))),128)),i(n).rows.length?C("",!0):(h(),g("div",li,E(i(n).emptyText),1))])):l(i(n).frame.footer)?(h(),X(Z,{key:1,row:i(n).frame.footer,dim:r("footer")},null,8,["row","dim"])):C("",!0)],64)):C("",!0)],64)):i(n).rows.length?(h(!0),g(R,{key:4},V(o.value,_=>(h(),X(Z,{key:_.id,row:_,dim:v(_)},null,8,["row","dim"]))),128)):C("",!0)],16,Ur))}},gt=qe(di,[["__scopeId","data-v-eecd9f12"]]);let yt=null;function ci(e){return yt||(yt=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{pages:[]}).then(t=>Array.isArray(t.pages)?t.pages:[]).catch(()=>[])),yt}let We=null;function kt(){We?.dismiss(),We=null}function ui(e,t,s){kt();const o=t?.getBoundingClientRect?.(),a={x:o?o.left:0,y:o?o.bottom+4:0};ci(e).then(l=>{const r=l.length?l.map(d=>({label:d.title||d.url,onPick:()=>{kt(),s(d.url)}})):[{label:u(e,"component_props_pages_none"),onPick:null}];kt(),We=ce(e.document,ut,{items:r,x:a.x,y:a.y,onClose:()=>{We=null}})})}const Wn="sve-html-tree-labels";function Zn(){try{const e=globalThis.localStorage?.getItem(Wn);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function hi(e){try{globalThis.localStorage?.setItem(Wn,JSON.stringify(e))}catch{}}function Jn(e){return String(e||"_")}function Qn(e){const t=Zn()[Jn(e)];return t&&typeof t=="object"?{...t}:{}}function pi(e,t,s){const o=s?.[t];return typeof o=="string"&&o.trim()?o.replace(/\s+/g," ").trim():String(e||"").trim()}function fi(e,t,s,o){if(!t)return;const a=Jn(e),l=Zn(),r={...l[a]||{}},d=String(s||"").replace(/\s+/g," ").trim(),f=String(o||"").trim();!d||d===f?delete r[t]:r[t]=d,Object.keys(r).length?l[a]=r:delete l[a],hi(l)}const mi=/^@(media|supports|container|layer|scope)\b/i;function vi(e){const t=String(e||""),s=[];let o=0,a=0;for(;o<t.length;){if(t[o]==="{"&&t[o+1]==="{"){const d=t.indexOf("}}",o+2);o=d===-1?t.length:d+2;continue}if(t[o]==="/"&&t[o+1]==="*"){const d=t.indexOf("*/",o+2);o=d===-1?t.length:d+2;continue}if(t[o]==='"'||t[o]==="'"){const d=t[o];for(o+=1;o<t.length&&t[o]!==d;)o+=t[o]==="\\"?2:1;o+=1;continue}if(t[o]!=="{"){o+=1;continue}let l=1,r=o+1;for(;r<t.length&&l>0;){if(t[r]==="{"&&t[r+1]==="{"){const d=t.indexOf("}}",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==="/"&&t[r+1]==="*"){const d=t.indexOf("*/",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==='"'||t[r]==="'"){const d=t[r];for(r+=1;r<t.length&&t[r]!==d;)r+=t[r]==="\\"?2:1;r+=1;continue}t[r]==="{"?l+=1:t[r]==="}"&&(l-=1),r+=1}s.push({selector:t.slice(a,o).trim(),body:t.slice(o+1,r-1),from:a,to:r,text:t.slice(a,r).trim()}),o=r,a=r}return s}function mn(e){const t=String(e||""),s=new Set,o=new Set,a=new Set;for(const l of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const r of l[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))r&&(s.add(r),s.add(r.replace(/([:./%!#()[\],])/g,"\\$1")));for(const l of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))l[2].trim()&&o.add(l[2].trim());for(const l of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))a.add(l[1].toLowerCase());return{classes:s,ids:o,tags:a}}function vn(e,t){const s=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),o=[...s.matchAll(/\.((?:\\.|[\w-])+)/g)].map(r=>r[1]),a=[...s.matchAll(/#((?:\\.|[\w-])+)/g)].map(r=>r[1]);if(o.length||a.length){const r=d=>d.replace(/\\(.)/g,"$1");return o.every(d=>t.classes.has(d)||t.classes.has(r(d)))&&a.every(d=>t.ids.has(r(d)))}const l=[...s.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(r=>r[2].toLowerCase());return l.length>0&&l.every(r=>t.tags.has(r))}function gi(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function yi(e,t,s){const o=gi(e);if(!o.length)return"keep";const a=o.filter(r=>vn(r,t));return a.length?a.length===o.length&&!o.some(r=>vn(r,s))?"move":"copy":"keep"}function eo(e,t,s){const o=String(e||""),a=mn(t),l=mn(s),r=[],d=[];let f=0;for(const k of vi(o)){const v=o.slice(k.from,k.to),m=v.match(/^\s*/)[0];if(f=k.to,mi.test(k.selector)){const x=eo(k.body,t,s);x.move.trim()&&r.push(`${k.selector} {
${x.move.trim()}
}`),x.keep.trim()&&d.push(`${m}${k.selector} {
${x.keep.trim()}
}`);continue}const b=k.selector.startsWith("@")?"keep":yi(k.selector,a,l);if(b==="move"){r.push(k.text);continue}b==="copy"&&r.push(k.text),d.push(v)}return d.push(o.slice(f)),{move:r.join(`

`).trim(),keep:d.join("").replace(/\n{3,}/g,`

`).trim()}}const ki="/!/sve/component";function bi(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let s=null;for(const o of t){if(!o.trim())continue;const a=o.match(/^[ \t]*/)[0].length;s=s===null?a:Math.min(s,a)}return s?t.map(o=>o.slice(s)).join(`
`):t.join(`
`)}function _i(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function Ti(e,t){if(!ps(e))return"";try{return await(await Oo(()=>import("./tw-compile-AWaJHJyk.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(s){return console.error("[sve] component tailwind compile",s),""}}async function xi(e,t){const s=await e.fetch(ki,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":Bt(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!s.ok){const o=new Error(String(s.status));throw o.status=s.status,o}return s.json()}function gn(e,t){const{from:s,to:o}=hs(e,t),a=e.slice(s,o);if(!a.trim())return null;const l=e.slice(0,s)+e.slice(o),r=T("dock:css"),d=eo(typeof r=="string"?r:"",a,l);return{html:bi(a),css:d.move,keepCss:d.keep,lead:_i(a),from:s,to:o}}function Si(e,t,{onDone:s,onError:o}={}){if(T("dock:is-locked")===!0)return;const a=T("dock:html");if(typeof a!="string"||!t)return;const l=gn(a,t);if(!l)return;const r=ce(e.document,Fo,{heading:u(e,"component_new"),nameLabel:u(e,"component_name"),placeholder:u(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:u(e,"cancel"),saveLabel:u(e,"component_create"),onOk:d=>{r.dismiss(),(async()=>{try{const f=await Ti(e,l.html),k=T("dock:html"),v=typeof k=="string"&&k===a?l:gn(k,t);if(!v)return;const m=await xi(e,{name:d,html:v.html,css:v.css,js:"",tw:f}),b=T("dock:html"),x=b.slice(0,v.from)+v.lead+m.tag+b.slice(v.to);T("dock:set-html",x),v.css.trim()&&T("dock:set-css",v.keepCss),s?.(m)}catch(f){o?.(f)}})()}})}function wi(e,t,s){const o=String(e||"");if(!t||t.kind!=="antlers")return o;const a=String(s||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?Ei(o,t,a):t.tag==="else"||!a?o:o.slice(0,t.from)+`{{ ${t.tag} ${a} }}`+o.slice(t.openTo)}function Et(e,t,s,o){return Oe(e,t,{kind:s,name:o})}function Oe(e,t,s={}){const o=String(e||"");if(!t||t.antlers!=="loop")return o;const a=t.loopKind==="collection"?"collection":"field",l=s.kind??a,r=String(s.name??t.expr??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(r))return o;const d=s.sortDir??t.sortDir??"",f=String(s.sortField??t.sortField??"").trim(),k=String(s.limit??t.limit??"").trim(),v=to(o,t);if(!v)return o;const m=l===a?t.params:"",b=l==="collection"?$i(r,f,d,k,m):Ci(r,f,d,k,m),x=l==="collection"?"collection":r;return o.slice(0,t.from)+b+o.slice(t.openTo,v.from)+`{{ /${x} }}`+o.slice(v.to)}function $i(e,t,s,o,a){const l=Li(a).replace(/\bsort\s*=\s*["'][^"']*["']/g,"").replace(/\blimit\s*=\s*["']?\d+["']?/g,"").replace(/\s+/g," ").trim(),r=[`collection from="${e}"`];return s==="random"?r.push('sort="random"'):t&&r.push(`sort="${t}${s==="desc"?":desc":":asc"}"`),o&&r.push(`limit="${o}"`),l&&r.push(l),`{{ ${r.join(" ")} }}`}function Ci(e,t,s,o,a){const l=String(a||"").split("|").map(d=>d.trim()).filter(d=>d&&!/^from\s*=/.test(d)&&!/^sort\s*:/.test(d)&&!/^reverse$/.test(d)&&!/^shuffle$/.test(d)&&!/^limit\s*:/.test(d)),r=[e,...l];return s==="random"?r.push("shuffle"):t&&(r.push(`sort:${t}`),s==="desc"&&r.push("reverse")),o&&r.push(`limit:${o}`),`{{ ${r.join(" | ")} }}`}function Li(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function to(e,t){const o=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return o?{from:t.from+o.index,to:t.from+o.index+o[0].length}:null}function Ei(e,t,s){return Oe(e,t,{name:s})}function Pi(e,t,s){const o=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return o;const a=to(o,t);if(!a)return o;const r=(o.slice(0,a.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],d=s==="else"?"{{ else }}":"{{ elseif true }}";return`${o.slice(0,a.from)}${d}
${r}${o.slice(a.from)}`}const U=ys("sve-call-values"),Ve=new Set;let yn=null;const Hi="__sve-html-tree-style";function Mi(e,t,s){if(t||s)return!1;const o=String(T("dock:chrome-kind")||"");if(o==="header"||o==="footer")return!1;const a=In(e);return!!a&&a!=="create"&&zo(e)!==Xo(e)}function no(e){return{sectionLoops:Mn(e),sectionsLabel:u(e,"html_tree_sections_slot")}}function kn(e,t){if(e.kind==="slot")return!1;for(let s=0;s<t.length;s+=2)if(e.from<=t[s]&&e.to>=t[s+1])return!0;return!1}function Ii(e,t){const s={entry:t,text:"",note:u(e,"html_tree_page_template_note"),openLabel:u(e,"html_tree_open_template"),canOpen:!1,onOpen:null};return On(e,{entry:t}).then(o=>{!o||n.pageTemplate?.entry!==t||(n.pageTemplate={...n.pageTemplate,text:u(e,"html_tree_page_template",{name:o.name}),canOpen:!!o.open,onOpen:o.open?a=>Yo(e,a,o.open):null})}),s}function Ai(e,t){const s=t.replace(/^view:/,"");if(!s||T("dock:current-type")!==t){n.usedBy=null;return}n.usedBy?.view!==s&&(n.usedBy=null,On(e,{view:s}).then(o=>{if(!o||T("dock:current-type")!==t)return;const a=o.everything?[u(e,"html_tree_used_by_everything")]:o.used_by;n.usedBy={view:s,label:u(e,"html_tree_used_by"),items:a,empty:a.length?"":u(e,"html_tree_used_by_nobody"),hint:a.length?u(e,"html_tree_used_by_hint",{list:a.join(", ")}):""}}))}const K=new Set;let Pt="",Se=!1,bt=null,Ee=!0,J="",Le=0,oo="";const de=new Map,$e=new Set;let G="",so=!1,O=null,Ze=null,ze="",Je="",Qe=0,Ht=null,Ce=[],ge=null,De=null,et=null,tt=null,Mt=null,be=!1,ye=null,Ke=null,Be=null,nt=null,ot=null,It=null,me=null;function W(e){return e.getElementById(Ye)}function Ri(e){Bo(e,Hi,`
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
  `)}function z(){const e=T("dock:html");return typeof e=="string"?e:""}function ao(e){return!!T("dock:is-open",e)}function Pe(e,{save:t=!1}={}){return Yt()||T("dock:set-html",e)!==!0?!1:(t&&T("dock:save-now"),!0)}function _t(e){const t=T("dock:component-exit-state")||{};if(n.exitOpen=!!t.open,!t.open){n.onExit=null;return}n.exitName=t.name||"",n.exitLabel=u(e,"component_exit"),n.exitTitle=u(e,t.back?"component_exit_back":"component_exit_close"),n.onExit=()=>{T("dock:exit-component"),A(e)}}function ro(e,t){const s=es(e);if(!s||t.type!==s)return"";const o=ts(t[s]);return o&&ns(e,o)?.section_type||""}const _e=[];let Tt=!1,At=!1;function xt(e,t){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(t,{timeout:2e3});return}e.setTimeout(t,200)}function Fi(e,t){for(const s of t){const o=s.type;!o||de.has(o)||$e.has(o)||_e.includes(o)||_e.push(o)}Nt.htmlTreePrefetchArmed&&Xt(e)}function El(e){Nt.htmlTreePrefetchArmed=!0,Xt(e)}function Xt(e){if(Tt||!_e.length)return;Tt=!0;const t=()=>{const s=_e.shift();if(!s){Tt=!1;return}if(de.has(s)||$e.has(s)){xt(e,t);return}$e.add(s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(s)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(o=>o.ok?o.json():null).then(o=>{typeof o?.html=="string"&&(de.set(s,o.html),At&&(At=!1,A(e)))}).catch(()=>{}).finally(()=>{$e.delete(s),xt(e,t)})};xt(e,t)}function Yt(){return!!G}function Oi(e){const t=new Map,s=lt(e);if(!s)return t;for(const o of s.querySelectorAll("[data-sid]")){const a=o.getAttribute("data-sid");a&&!t.has(a)&&t.set(a,o.tagName.toLowerCase())}return t}function pt(e,t){const s=dt(e)||"page_sections",o=Oi(e),a=[];for(const l of jt(t)||[]){const r=Vt(l.values),d=r&&typeof r=="object"?r[s]:null;if(Array.isArray(d)){d.forEach(f=>{if(!f||typeof f!="object"||Array.isArray(f)||typeof f.type!="string")return;const k=[f._visual_id,f.id,f._id].filter(_=>typeof _=="string"&&_!=="");if(!k.length)return;const v=ro(e,f)||f.type,m=typeof f._sve_label=="string"?f._sve_label.trim():"",b=k.map(_=>o.get(_)).find(Boolean)||"section",x=Qn(f.type)[`0:${b}`];a.push({uid:k[0],ids:k,type:f.type,tag:b,label:m||(typeof x=="string"&&x.trim()?x.trim():"")||ct(e,v)?.display||Ne(v)||v,svg:Nn(b,"",null).svg||we.section,cat:Rn(b),enabled:f.enabled!==!1,static:aa(e,v)})});break}}return a}function Di(e,t,s){if(!s.length)return"";const o=T("dock:current-type")||"",a=T("dock:current-uid"),l=!!T("dock:component-exit-state")?.open;if(a){const r=Kt(a,t),d=s.find(f=>f.ids.some(k=>r.includes(k)));if(d&&(l||d.type===o))return d.uid}return s.find(r=>r.type===o)?.uid||""}function Bi(e,t,s,o){const a=t.find(_=>_.uid===s),l=T("dock:component-src"),r=T("dock:type-stack")||[];if(!a||!l||!r.length)return null;const d=r.map(_=>_.type).filter(_=>!de.get(_));if(d.length)return Ni(e,d),null;const f=[],k=new Set,v=new Set;let m=_=>f.push(..._),b=null,x=0;for(let _=0;_<r.length;_+=1){const I=_+1<r.length?r[_+1].src:l,y=N=>({...N,id:`ctx${_}:${N.id}`,path:`ctx${_}/${N.path}`,ctxLevel:_,children:N.children.map(y)}),p=ht(de.get(r[_].type)).map(y),S=[],H=(N,oe)=>{for(const B of N){if(B.kind==="component"&&B.src===I)return S.push(...oe,B),B;const D=H(B.children,[...oe,B]);if(D)return D}return null};if(b=I?H(p,[]):null,!b)return null;const P=new Set(S.map(N=>N.id)),F=(N,oe)=>{for(const B of N)B.children.length&&(P.has(B.id)?K.has(B.path):io(B,oe))&&k.add(B.id),F(B.children,oe+1)};F(p,x),m(p),v.add(b.id),x+=S.length,m=(N=>oe=>{N.children=oe})(b)}for(const _ of lo(o))k.add(_);return K.has(b.path)&&k.add(b.id),b.children=o,{tree:f,folds:k,hostId:b.id,hostIds:v,levels:r.length,rootId:f.find(_=>!_.kind)?.id||"",label:a.label,svg:a.svg,cat:a.cat}}function Ni(e,t){for(const s of t)!_e.includes(s)&&!$e.has(s)&&_e.push(s);At=!0,Xt(e)}function ji(e,t,s){const o=T("dock:component-exit-state");if(o?.open)return Ne(o.name)||o.name||"";if(s)return t.find(l=>l.uid===s)?.label||"";const a=T("dock:current-type")||"";return String(a).startsWith("view:")?"":ct(e,a)?.display||Ne(a)||""}function ft(e,t,s,o,a){const l=s.find(d=>d.uid===o);if(!l||o===a)return;K.clear(),O=null,Ee=!1,ne(),Ge(),J=o,oo=z(),G=de.get(l.type)||"",G&&(O=st(ht(G))||null),so=(T("dock:current-type")||"")===l.type,e.clearTimeout(Le),Le=e.setTimeout(()=>{J="",Se=!1,A(e)},4e3),A(e);const r=()=>as(l.uid,t,e,{clampToSection:!0});Qo(l.uid,t,e,r),ue({source:ee,type:Q.SVE_ACTIVATE,ids:l.ids},e),e.setTimeout(()=>A(e),0)}function Rt(e,t){if(!t)return!1;for(const s of e||[])if(s.id===t||Rt(s.children,t))return!0;return!1}function st(e){for(const t of e||[]){if(!t.kind)return t.id;const s=st(t.children);if(s)return s}return""}function io(e,t){const s=t===0||e.path===Je;return K.has(e.path)?s:!s}function lo(e){const t=new Set,s=(o,a)=>{for(const l of o)l.children.length&&io(l,a)&&t.add(l.id),s(l.children,a+1)};return s(e,0),t}function A(e){const t=e.document,o=W(t)?.querySelector("[data-sve-html-tree-list]");if(!o)return;Ri(t),ms(e);const a=z();G&&G===a&&(G=""),T("dock:chrome-kind")&&(G="");const l=G||a,r=ht(l,no(e)),d=vs(l,Mn(e));Ce=r,Je="";const f=T("dock:current-type")||"",k=Qn(f),v=qo(e,t),b=!!(T("dock:component-exit-state")||{}).open,x=pt(e,t);f&&a&&!G&&de.set(f,a),Fi(e,x);const _=Di(e,t,x);if(Mi(e,v,b)){const c=In(e);Ce=[],n.rows=[],n.sections=[],n.frame=null,n.pageBuilder=!1,n.layoutFile=!1,n.usedBy=null,n.emptyText="",n.pageTemplate?.entry!==c&&(n.pageTemplate=Ii(e,c)),n.onRefresh=()=>A(e),n.onSection=null,_t(e),Fe(o,gt),St(e,[]);return}n.pageTemplate=null,Ai(e,String(T("dock:collection-view")||""));const I=String(T("dock:chrome-kind")||"");if(Go(e),v&&!x.length&&!I){Ce=[],n.rows=[],n.sections=[],n.frame=_n(e,[],!1,!1,"",!0),n.frameEmptyText=u(e,"html_tree_frame_no_sections"),n.pageBuilder=!0,n.layoutFile=!1,n.emptyText=u(e,"html_tree_empty"),n.canEdit=!T("dock:is-locked"),n.look=dn(e),n.onRefresh=()=>A(e),n.onSection=null,bn(e,""),_t(e),Fe(o,gt),St(e,[]);return}n.pageBuilder=v;const y=`${f}|${_}`;let p=!1;y!==Pt&&(Pt=y,K.clear(),bt!==null&&l!==bt?p=!0:Se=l),(p||Se!==!1&&l!==Se)&&(Se=!1,K.clear(),O=st(r)||null),bt=l,J&&(J===_||!x.length)&&(so||l!==oo)&&(e.clearTimeout(Le),J="",Se=!1,Rt(r,O)||(K.clear(),O=st(r)||null));const S=x.some(c=>c.uid===J)?J:"",H=Ee?"":S||_,P=b?Bi(e,x,H,r):null,F=!!(S||_),N=F||b?"":String(T("dock:chrome-kind")||""),B=v&&(!f&&!F||N==="main"&&T("dock:on-empty-page")===!0),D=B||N==="template"?"":N;n.layoutFile=D==="main",D!=="main"&&(ze="");const te=D==="main"?Tn(r,"main"):null,He=te?at(r,c=>c.tag==="body"&&Rt(c.children,te.id)):null;Je=He?He.path:"",te&&(Xe((He||te).path),ze!==y&&(Xe(te.path),K.add(te.path)));const Me=D==="header"||D==="footer"?at(r,c=>l.slice(c.from,c.openTo).includes(`data-sve-chrome="${D}"`))||Tn(r,D):null;Me&&Xe(Me.path);const j=B||!(D==="main"?!!te:D==="header"||D==="footer"?!!Me:!0)?[]:P?cn(P.tree,n.query?new Set:P.folds):cn(r,n.query?new Set:lo(r));!l.trim()&&!ao(t)?n.emptyText=u(e,"html_tree_need_dock"):n.emptyText=u(e,"html_tree_empty"),n.slotText=u(e,"antlers_drop_here"),n.dataTitle=u(e,"data_vars_title"),n.pageTitle=u(e,"component_props_page"),n.renameTitle=u(e,"html_tree_rename"),n.tagTitle=u(e,"tw_tag"),n.hideTitle=u(e,"html_tree_hide"),n.showTitle=u(e,"html_tree_show"),n.duplicateTitle=u(e,"html_tree_duplicate"),n.deleteTitle=u(e,"html_tree_delete"),n.videoHoldTitle=u(e,"html_tree_video_hold"),n.videoPlayTitle=u(e,"html_tree_video_play"),n.lockedTitle=u(e,"html_tree_locked"),n.searchEmpty=u(e,"html_tree_search_empty"),n.canEdit=!T("dock:is-locked"),n.look=dn(e),n.onQuery=()=>A(e),_t(e),n.inComponent=b,n.onContextRow=c=>{if(!P||c===P.hostId)return;const w=j.find(M=>M.id===c)?.ctxLevel??P.levels-1;T("dock:exit-component",P.levels-w),A(e)},n.onSelect=c=>{const w=j.find(M=>M.id===c);w&&Bn(e,w.path)||it(e,c,j)},n.onTwist=c=>{const w=j.find(M=>M.id===c)?.path;w&&(K.has(w)?K.delete(w):K.add(w),A(e))},n.onTagChange=(c,w)=>{const M=n.rows.find(re=>re.id===w);M&&!Yt()&&gs(e,c.currentTarget,M)},n.onRename=c=>Ui(e,c),n.onRenameCommit=()=>Sn(e,!0),n.onRenameCancel=()=>Sn(e,!1),n.onHide=c=>Yi(e,c),n.onVideoHold=c=>Xi(e,c),n.onDuplicate=c=>Wi(e,c),n.onDelete=c=>Ji(e,c),n.onPointerDown=(c,w)=>sl(e,c,w),n.onSectionPointerDown=(c,w)=>il(e,c,w),n.onContext=(c,w)=>nl(e,c,w),n.onInspectCommit=c=>fl(e,c),n.onPropValue=(c,w,M)=>Cn(e,c,w,M),n.onPropPage=(c,w)=>ui(e,c,M=>Cn(e,w,M,!1)),n.onLoopKind=c=>ml(e,c),n.onAddBranch=c=>vl(e,c),n.onLoopSortField=c=>{const w=rt(),M=String(c||"").trim();if(!w)return;const re=me?.id===w.id?me.dir:"",ie=w.sortDir||re||"asc";me=null,ke(e,(xe,Ie)=>Oe(xe,Ie,{sortField:M,sortDir:ie}))},n.onLoopSortDir=c=>{const w=rt(),M=String(c||"");if(w){if((M==="asc"||M==="desc")&&!w.sortField){me={id:w.id,dir:M},Ot(e,w);return}me=null,ke(e,(re,ie)=>Oe(re,ie,{sortDir:M,sortField:M==="asc"||M==="desc"?ie.sortField:""}))}},n.onLoopLimit=c=>ke(e,(w,M)=>Oe(w,M,{limit:String(c||"").replace(/\D/g,"")})),n.onPropHost=c=>c?U.mount(c):U.unmount(),n.onInspectData=(c,w)=>{T("dock:data-menu",{anchor:c,at:j.find(M=>M.id===O)?.from,onPick:M=>w(String(M?.var||"").trim())})};const Qt=j.find(c=>!c.kind)?.id,en=b?"":ji(e,x,H),he=H&&!b?x.find(c=>c.uid===H):null,go=An(e,String(T("dock:current-type")||""));let yo=0;const se=D==="header"||D==="footer"?D:"",Te=Me?Me.id:"",pe=te&&j.find(c=>c.id===te.id)||null,tn=He&&j.find(c=>c.id===He.id)||null,ae=tn||pe||Te&&j.find(c=>c.id===Te)||null,nn=ae?Ki(j,ae):-1;if(ae&&!j.slice(j.indexOf(ae),nn).some(c=>c.id===O)&&(O=ae.id),n.selectFrom){const c=j.find(w=>w.from===n.selectFrom.at&&!w.kind);c?(O=c.id,n.selectFrom=null):--n.selectFrom.left<=0&&(n.selectFrom=null)}const on=n.layoutFile?Vi(e):null;n.rows=j.map(c=>{const w=on&&c.kind==="component"&&on.get(c.src)||"",M=c.tag==="body"&&!c.kind,re=w?{svg:we[w]}:Nn(c.tag,c.kind,c.antlers),ie=c.tag==="video"&&!c.kind?yo++:-1,xe=!!P&&c.id===P.rootId,Ie=c.id===Qt&&en?en:xe?P.label:c.klass,Ue=c.id===Qt;return{...c,tag:w||c.tag,frameCall:w,fixed:!!w||M||kn(c,d),holdsSections:kn(c,d),base:Ie,name:se&&c.id===Te?u(e,`html_tree_frame_${se}`):c===pe?u(e,"html_tree_frame_main"):Ue&&he?Ie:pi(Ie,c.path,k),current:c.id===O,letter:xe?"":re.letter||"",svg:se&&c.id===Te?we[se]:c===pe?we.main:Ue&&he?he.svg:xe?P.svg:re.svg||"",frame:se&&c.id===Te?se:c===pe?"main":"",cat:se&&c.id===Te?se:c===pe||M?"main":xe?P.cat:w||Rn(c.tag,c.kind,c.antlers),context:P?P.hostIds.has(c.id)?"host":c.id.startsWith("ctx")?"dim":"":"",sectionRoot:Ue&&he?he.uid:"",fieldsIcon:!!(Ue&&he&&!he.static),videoNth:ie,videoHeld:ie>=0&&go.has(ie)}}),Uo(e);const mt=[];for(const c of n.rows)mt.length=c.depth,c.guides=mt.slice(),mt[c.depth]=c.cat;if(ae){const c=j.indexOf(ae),w=ae.depth;n.rows=n.rows.slice(c,nn).map(M=>({...M,depth:M.depth-w,guides:M.guides.slice(w)})),pe&&ze!==y&&(ze=y,e.setTimeout(()=>it(e,pe.id,j),0))}n.sections=v&&(F||D||B)?x.map(c=>{const w=!!H&&c.uid===H;return{...c,current:w,ready:w&&(!S||!!G),row:{id:`sec:${c.uid}`,section:c.uid,tag:c.tag,name:c.label,kind:"",svg:c.svg,cat:c.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:w,hidden:!c.enabled}}}):[],n.frame=_n(e,x,F,b,D,!1,!!tn),n.frameEmptyText=u(e,"html_tree_frame_no_sections"),bn(e,D),n.onSection=c=>{be||(Ft(e),ft(e,t,x,c,H))},n.onRefresh=()=>A(e),Ot(e,n.rows.find(c=>c.id===O)),Fe(o,gt),St(e,r)}function bn(e,t){n.frameOpenTitle=u(e,"html_tree_frame_open"),n.frameMainTitle=u(e,"html_tree_frame_main_open"),n.frameTemplateTitle=u(e,"html_tree_frame_template_open"),n.frameFieldsTitle=u(e,"html_tree_frame_fields"),n.onFrame=s=>{t===s?qi(e,s):xn(e,s)},n.onFrameEnter=s=>xn(e,s),n.onFrameFields=s=>ds(e,Wo(e,s),u(e,`html_tree_frame_${s}`)),n.onFrameTwist=()=>{n.mainShut=!n.mainShut}}function _n(e,t,s,o,a,l=!1,r=!1){if(!a&&!l||r)return null;const d=v=>({id:`frame:${v}`,frame:v,synthetic:!0,tag:v,name:u(e,`html_tree_frame_${v}`),kind:"",svg:we[v]||"",cat:v,letter:"",depth:0,hasChildren:v==="main"&&(t.length>0||a==="template"),shut:v!=="main",current:!1,hidden:!1}),f={kind:a,header:d("header"),main:d("main"),footer:d("footer"),template:null},k=a&&a!=="template"?String(T("dock:collection-view")||""):"";return k&&(f.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:ct(e,k)?.display||Ne(k.replace(/^view:/,"")),kind:"",svg:we.section,cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),f}function Tn(e,t){return at(e,s=>s.tag===t)}function at(e,t){for(const s of e||[]){if(!s.kind&&t(s))return s;const o=at(s.children,t);if(o)return o}return null}function Vi(e){const t=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},s=new Map;for(const o of["header","footer"]){const a=ks(t[o]?.type);a&&s.set(a,o)}return s}function Ki(e,t){let s=e.indexOf(t)+1;for(;s<e.length&&e[s].depth>t.depth;)s+=1;return s}function qi(e,t){const s=lt(e);(t==="main"||t==="template"?s?.querySelector("main"):s?.querySelector(`[data-sve-chrome="${t}"]`))?.scrollIntoView({behavior:"smooth",block:"start"})}function Ft(e){const t=String(T("dock:chrome-open",e.document)||"");return t!=="header"&&t!=="footer"?!1:(Jo(e),ue({source:ee,type:Q.SVE_FORCE_EXIT_CHROME},e),!0)}function Gi(e){e.clearTimeout(Le),J="",G="",K.clear(),O=null,Ee=!1,ne(),Ge()}function xn(e,t){if(e.document,String(T("dock:chrome-kind")||"")===t)return;if(Gi(e),t==="main"){Ft(e),T("dock:open-file",cs);return}if(t==="template"){const l=String(T("dock:collection-view")||"");l&&(Ft(e),T("dock:open-file",l));return}if(t!=="header"&&t!=="footer")return;const s=lt(e)?.querySelector(`[data-sve-chrome="${t}"]`);s?(s.scrollIntoView({block:"nearest"}),s.dispatchEvent(new s.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:ee,type:Q.OPEN_CHROME,kind:t},e.location.origin);const o=Date.now(),a=async()=>{if(String(T("dock:chrome-kind")||"")!==t){Date.now()-o<3e4&&e.setTimeout(a,250);return}await(T("dock:load-settled")||null),vo(e)};e.setTimeout(a,250)}function St(e,t){W(e.document)&&co(e,t)}function co(e,t){const s=t[0],o=!!T("dock:component-src"),a=o?"":T("dock:current-uid")||"";ue({source:ee,type:Q.SVE_HTML_PICK,on:!0,uid:a,uids:a?Kt(a,e.document):[],all:o,tag:s?.tag||"",klass:s?.klass||"",nodes:Is(t)},e)}function Xe(e){if(!e)return;const t=(s,o)=>{for(const a of s||[]){if(a.path===e)return!0;if(t(a.children,o+1))return o===0||a.path===Je?K.delete(a.path):K.add(a.path),!0}return!1};t(Ce,0)}function Ui(e,t){if(be)return;const s=n.rows.find(o=>o.id===t);!s||s.kind||(O=t,n.rows.forEach(o=>{o.current=o.id===t}),n.editingId=t,n.draft=s.name,e.setTimeout(()=>{const o=W(e.document)?.querySelector("[data-sve-ht-rename]");o?.focus(),o?.select()},0))}function Sn(e,t){const s=n.editingId;if(!s)return;const o=n.rows.find(a=>a.id===s);n.editingId=null,t&&o&&(o.sectionRoot?zi(e,o.sectionRoot,n.draft):fi(T("dock:current-type")||"",o.path,n.draft,o.base||o.klass)),n.draft="",A(e)}function zi(e,t,s){const o=dt(e)||"page_sections",a=String(s||"").replace(/\s+/g," ").trim();for(const l of jt(e.document)||[]){const r=Vt(l.values),d=r&&typeof r=="object"?r[o]:null;if(!Array.isArray(d))continue;const f=d.findIndex(b=>b&&typeof b=="object"&&[b._visual_id,b.id,b._id].includes(t));if(f===-1)continue;const k=ro(e,d[f])||d[f].type,v=ct(e,k)?.display||Ne(k)||k,m=JSON.parse(JSON.stringify(d));return m[f]={...m[f]},!a||a===v?delete m[f]._sve_label:m[f]._sve_label=a,l.setFieldValue(o,m),!0}return!1}function Xi(e,t){const s=n.rows.find(d=>d.id===t);if(!s||!(s.videoNth>=0))return;const o=String(T("dock:current-type")||""),a=An(e,o),l=!a.has(s.videoNth);l?a.add(s.videoNth):a.delete(s.videoNth);const r=String(T("dock:current-uid")||"");Zo(e,o,a),ue({source:ee,type:Q.SVE_VIDEO_HOLD,uid:r,uids:r?Kt(r,e.document):[],nth:s.videoNth,on:l},e),A(e)}function Wt(e){return!!n.rows.find(t=>t.id===e)?.fixed}function Yi(e,t){Wt(t)||Zt(e,t,Ps)}function Wi(e,t){if(Wt(t))return;const s=n.rows.find(o=>o.id===t)?.sectionRoot;if(s){e.postMessage({source:ee,type:Q.DUPLICATE_ROW,uid:s},e.location.origin);return}Zt(e,t,Hs)}function uo(e,t){os(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const s=e.document;rs({uid:t},s,e)})}function Zi(e,t,s){J===s&&(e.clearTimeout(Le),J="",G=""),O=null,Ee=!1,Pt="";const o=pt(e,t),a=o.find(l=>l.uid!==s)||o[0];a?ft(e,t,o,a.uid,""):(G="",n.rows=[],n.sections=[],n.frame=null,n.pageBuilder=!0,A(e)),e.setTimeout(()=>{W(e.document)&&A(e)},0)}Fn("row:removed",({uid:e,parentPath:t,doc:s,win:o})=>{t!==dt(o)||!W(o.document)||Zi(o,s,e)});function Ji(e,t){if(Wt(t))return;const s=n.sections?.find(a=>a.row?.id===t),o=s?s.row?.section||s.uid:n.rows.find(a=>a.id===t)?.sectionRoot;if(o){uo(e,o);return}Zt(e,t,Ms)}function Zt(e,t,s){if(T("dock:is-locked"))return;const o=z(),a=n.rows.find(r=>r.id===t);if(!a)return;const l=s(o,a);l!==o&&Pe(l)}function ne(){ye?.dismiss(),ye=null}const Qi='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',el='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>';function ho(e,t){const s=n.sections?.find(f=>f.uid===t),o=s?.type||"";if(!o||!Un(e))return[];const a=s.label||o,l=ra(e,o),r=()=>e.Statamic?.$toast?.error(u(e,"section_update_failed")),d=[{label:u(e,"static_section_insertable"),icon:l?el:Qi,onPick:()=>{ne(),hn(e,{handle:o,hidden:!l}).then(()=>{e.Statamic?.$toast?.success(u(e,l?"section_shown_to_editors":"section_hidden_from_editors",{name:a})),Ct(e)}).catch(r)}}];return s.static&&d.push({label:u(e,"section_add_fields"),onPick:()=>{ne(),hn(e,{handle:o,fields:!0}).then(()=>{e.Statamic?.$toast?.success(u(e,"section_fields_added",{name:a})),Ct(e),A(e),Dn(e,o)}).catch(r)}}),d}function tl(e,t,s){const o=s.row?.section||s.uid;o&&(ye=ce(e.document,ut,{items:[...ho(e,o),{label:u(e,"html_tree_remove_section"),danger:!0,onPick:()=>{ne(),uo(e,o)}}],x:t.clientX,y:t.clientY,onClose:()=>{ye=null}}))}function nl(e,t,s){ne();const o=n.sections?.find(d=>d.row?.id===s);if(o){tl(e,t,o);return}const a=n.rows.find(d=>d.id===s);if(!a)return;it(e,s,n.rows);const l={x:t.clientX,y:t.clientY},r=d=>{d.length&&(ye?.dismiss(),ye=ce(e.document,ut,{items:d,x:l.x,y:l.y,onClose:()=>{ye=null}}))};if(a.kind==="component"){ol(e,a,r);return}a.kind==="slot"||a.holdsSections||n.canEdit&&r([...a.sectionRoot?ho(e,a.sectionRoot):[],{label:u(e,"component_make"),onPick:()=>{ne(),Si(e,a,{onDone:()=>A(e),onError:d=>{e.alert(d?.status===409?u(e,"component_exists"):u(e,"component_failed"))}})}}])}const wn=(e,t)=>{ne(),T("dock:open-template",t)};function ol(e,t,s){if(!_s(t.src)){s([{label:u(e,"component_open_named",{name:t.name||t.src}),onPick:()=>wn(e,`view:partials/${t.src}`)}]);return}s([{label:u(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(o=>o.ok?o.json():{items:[]}).then(o=>{const a=Array.isArray(o.items)?o.items:[];s(a.length?a.map(l=>({label:u(e,"component_open_named",{name:l.label}),onPick:()=>wn(e,l.type)})):[{label:u(e,"component_none"),onPick:null}])}).catch(()=>s([{label:u(e,"component_none"),onPick:null}]))}function sl(e,t,s){if(t.button!==0||T("dock:is-locked")||n.editingId||t.target?.closest?.("button, input"))return;Ge(),ge=s,De={x:t.clientX,y:t.clientY},et=t.currentTarget,tt=t.pointerId;const o=l=>al(e,l),a=l=>rl(e,l);Mt=()=>{e.document.removeEventListener("pointermove",o,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),Mt=null},e.document.addEventListener("pointermove",o,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function al(e,t){if(!ge||!De)return;const s=t.clientX-De.x,o=t.clientY-De.y;if(!n.dragging&&s*s+o*o<25)return;if(!n.dragging){n.dragging=!0;try{et?.setPointerCapture?.(tt)}catch{}}t.preventDefault();const a=e.document.elementFromPoint(t.clientX,t.clientY),l=a?.closest?.("[data-sve-ht-slot]");if(l){const m=l.getAttribute("data-sve-ht-id");if(m&&m!==ge){n.dropId=m,n.dropPlace="inside";return}}const r=a?.closest?.("[data-sve-ht-row]"),d=r?.getAttribute("data-sve-ht-id");if(!d||d===ge){n.dropId=null,n.dropPlace=null;return}const f=n.rows.find(m=>m.id===d),k=n.rows.find(m=>m.id===ge);if(!f||f.context||k&&f.path.startsWith(`${k.path}/`)){n.dropId=null,n.dropPlace=null;return}const v=r.getBoundingClientRect();n.dropId=d,n.dropPlace=Ls(t.clientY-v.top,v.height,!Vn(f.tag)&&!jn(f))}function rl(e,t){const s=ge,o=n.dropId,a=n.dropPlace||"after",l=n.dragging;if(Ge(),l&&(be=!0,e.setTimeout(()=>{be=!1},0)),!l||T("dock:is-locked")||!s||!o||s===o)return;t?.preventDefault?.();const r=z(),d=Es(r,Ce,s,o,a);d!==r&&Pe(d)}function Ge(){try{et?.releasePointerCapture?.(tt)}catch{}Mt?.(),ge=null,De=null,et=null,tt=null,n.dragging=!1,n.dropId=null,n.dropPlace=null}function il(e,t,s){if(t.button!==0||!s||n.editingId||t.target?.closest?.("button, input"))return;po(),Ke=s,Be={x:t.clientX,y:t.clientY},nt=t.currentTarget,ot=t.pointerId;const o=l=>ll(e,l),a=l=>dl(e,l);It=()=>{e.document.removeEventListener("pointermove",o,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),It=null},e.document.addEventListener("pointermove",o,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function ll(e,t){if(!Ke||!Be)return;const s=t.clientX-Be.x,o=t.clientY-Be.y;if(!n.dragging&&s*s+o*o<25)return;if(!n.dragging){n.dragging=!0;try{nt?.setPointerCapture?.(ot)}catch{}}t.preventDefault();const l=e.document.elementFromPoint(t.clientX,t.clientY)?.closest?.("[data-sve-ht-sec-uid]"),r=l?.getAttribute("data-sve-ht-sec-uid")||"";if(!r||r===Ke){n.sectionDrop=null;return}const d=l.getBoundingClientRect();n.sectionDrop={uid:r,place:t.clientY-d.top<d.height/2?"before":"after"}}function dl(e,t){const s=Ke,o=n.sectionDrop,a=n.dragging;po(),a&&(be=!0,e.setTimeout(()=>{be=!1},0)),!(!a||!s||!o?.uid||o.uid===s)&&(t?.preventDefault?.(),cl(e,s,o.uid,o.place))}function po(){try{nt?.releasePointerCapture?.(ot)}catch{}It?.(),Ke=null,Be=null,nt=null,ot=null,n.dragging=!1,n.sectionDrop=null}function cl(e,t,s,o){const a=dt(e)||"page_sections";for(const l of jt(e.document)||[]){const r=Vt(l.values),d=r&&typeof r=="object"?r[a]:null;if(!Array.isArray(d))continue;const f=b=>d.findIndex(x=>x&&typeof x=="object"&&[x._visual_id,x.id,x._id].includes(b)),k=f(t),v=f(s);if(k===-1||v===-1||k===v)return!1;let m=o==="before"?v:v+1;return k<m&&(m-=1),m===k?!1:(e.postMessage({source:ee,type:Q.MOVE,uid:t,toIndex:m},e.location.origin),e.setTimeout(()=>A(e),60),!0)}return!1}function fo(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function Ot(e,t){if(t?.kind==="component"){ul(e,t);return}if(Y.callOpen&&(Y.callOpen=!1,Y.callStore=null,U.forget(),Gt(e)),t?.kind!=="antlers"){n.inspect=null;return}const s=t.id;if(t.tag==="else"){n.inspect={key:s,title:u(e,"antlers_condition"),mode:"note",note:u(e,"antlers_else_note")};return}if(t.antlers==="loop"){const o=t.loopKind==="collection",a=me?.id===t.id?me.dir:"",l=t.sortDir||a;n.inspect={key:s,title:u(e,"antlers_loop"),mode:"loop",loopKind:o?"collection":"field",kinds:[{id:"field",label:u(e,"antlers_loop_field")},{id:"collection",label:u(e,"antlers_loop_collection")}],collections:fo(e),value:t.expr||"",placeholder:u(e,o?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:u(e,"antlers_sort"),dir:l,needsField:l==="asc"||l==="desc",field:t.sortField||"",pickable:!o,placeholder:u(e,o?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:u(e,"antlers_sort_none")},{id:"asc",label:u(e,"antlers_sort_asc")},{id:"desc",label:u(e,"antlers_sort_desc")},{id:"random",label:u(e,"antlers_sort_random")}]},limit:{title:u(e,"antlers_limit"),value:t.limit||"",placeholder:u(e,"antlers_limit_placeholder")},branches:[]};return}n.inspect={key:s,title:u(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:u(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:u(e,"antlers_add_elseif")},{id:"else",label:u(e,"antlers_add_else")}]}}function ul(e,t){if(!Ts(e)){n.inspect=null;return}if(!t.src)return;const s=t.id;if(n.inspect={key:s,title:u(e,"component_props_values"),mode:"note",note:u(e,"code_dock_loading")},xs()){const o={},a={},l=new Map;for(const[r,d]of Ss(z().slice(t.from,t.to))){const f=ws(r);f&&(r!==f||!l.has(f))&&l.set(f,d)}for(const[r,d]of l)d.bound?a[r]=d.value:o[r]=d.value;yn!==s&&(yn=s,Ve.clear());for(const r of Ve)r in a||(a[r]="");n.inspect=null,Y.callOpen=!0,Y.title=Y.title||u(e,"component_props"),Y.callTitle=t.klass||t.name||t.src,Y.callStore=U.ui,U.ui.canBind=!0,U.ui.dataTitle=u(e,"data_vars_title"),U.ui.exprPlaceholder=u(e,"component_props_expr"),U.ui.onToggleBind=(r,d)=>pl(e,r,d),U.ui.onExpr=(r,d)=>$n(e,r,d),U.ui.onPickData=(r,d)=>T("dock:data-menu",{anchor:d,at:t.from,onPick:f=>$n(e,r,String(f?.var||"").trim())}),U.load(e,{key:`${t.src}::${s}`,src:t.src,params:o,bindings:a,readOnly:T("dock:is-locked")===!0}),U.watch(e,{src:t.src,write:r=>hl(e,r,a)}),Gt(e);return}$s(e,t.src).then(o=>{if(n.inspect?.key===s){if(!o.length){n.inspect={key:s,title:u(e,"component_props_values"),mode:"note",note:u(e,"component_props_values_none")};return}n.inspect={key:s,title:u(e,"component_props_values"),mode:"props",inheritLabel:u(e,"component_props_inherit"),rows:Cs(o,z().slice(t.from,t.to))}}})}function hl(e,t,s={}){const o=n.rows.find(r=>r.id===O);if(o?.kind!=="component"||T("dock:is-locked"))return;let a=z(),l=o.to;for(const[r,d]of Object.entries(t||{})){if(r in s)continue;const f=a.length,k=Ut(a,{from:o.from,to:l},r,d);k!==a&&(l+=k.length-f,a=k)}a!==z()&&(Pe(a,{save:!0}),A(e))}function pl(e,t,s){s?Ve.add(t):Ve.delete(t),mo(e,t,"",s),A(e)}function $n(e,t,s){Ve.add(t),mo(e,t,s,!0),A(e)}function mo(e,t,s,o){const a=n.rows.find(d=>d.id===O);if(a?.kind!=="component"||T("dock:is-locked"))return;const l=z(),r=Ut(l,a,t,s,{bound:o});r!==l&&Pe(r,{save:!0})}function rt(){const e=n.rows.find(t=>t.id===O);return e?.kind==="antlers"&&!T("dock:is-locked")?e:null}function ke(e,t){const s=rt();if(!s)return;const o=z(),a=t(o,s);a!==o&&(Pe(a),A(e))}function Cn(e,t,s,o){const a=n.rows.find(d=>d.id===O);if(a?.kind!=="component"||T("dock:is-locked"))return;const l=z(),r=Ut(l,a,t,s,{bound:o});r!==l&&(Pe(r,{save:!0}),A(e))}function fl(e,t){ke(e,(s,o)=>o.antlers==="loop"?Et(s,o,o.loopKind==="collection"?"collection":"field",t):wi(s,o,t))}function ml(e,t){const s=rt();if(!s||s.antlers!=="loop")return;const o=s.loopKind==="collection"?"collection":"field";if(t!==o){if(t==="collection"){const a=fo(e)[0]?.handle;if(!a)return;ke(e,(l,r)=>Et(l,r,"collection",a));return}ke(e,(a,l)=>Et(a,l,"field",l.handle||"items"))}}function vl(e,t){ke(e,(s,o)=>Pi(s,o,t))}function gl(e,t){if(!e||!t||jn(t)||Vn(t.tag))return null;const s=bs(e,t);if(s<t.openTo)return null;const o=e.lastIndexOf(`
`,s-1)+1;return e.slice(o,s).trim()===""&&o>t.openTo?o-1:s}function it(e,t,s){if(be)return;const o=(s||n.rows).find(a=>a.id===t);o&&(O=t,n.rows.forEach(a=>{a.current=a.id===t}),Ot(e,o),!Yt()&&(T("dock:reveal-html",{from:o.from,to:o.to,caret:gl(z(),o)}),T("dock:tw-follow"),ue({source:ee,type:Q.SVE_HTML_PICK_FOCUS,path:o.path},e)))}function yl(e,t){if(!t)return"";const s=[],o=(a,l)=>{for(const r of a||[]){const d=l||r.path===e;r.kind==="component"&&r.src===t&&s.push({path:r.path,inside:d}),o(r.children,d)}};return o(Ce,!1),(s.find(a=>a.inside)||s[0])?.path||""}function kl(e,t){if(!t||!W(e.document))return;Ee=!1,Xe(t),A(e);const s=n.rows.find(o=>o.path===t);s&&(it(e,s.id,n.rows),e.setTimeout(()=>{W(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function Dt(e){if(Ze)return;const t=()=>{n.editingId||n.dragging||(e.clearTimeout(Qe),Qe=e.setTimeout(()=>{W(e.document)&&A(e)},80))},s=()=>{if(t(),T("dock:on-empty-page")===!0){const o=pt(e,e.document);o[0]&&ft(e,e.document,o,o[0].uid,"")}};Ze=Fn("dock:html-changed",t),e.document.addEventListener("sve-page-structure",s),Ht=()=>{e.document.removeEventListener("sve-page-structure",s)}}function bl(e){Ze?.(),Ze=null,Ht?.(),Ht=null,e?.clearTimeout?.(Qe),Qe=0}function Jt(e){const t=W(e.document);if(ue({source:ee,type:Q.SVE_HTML_PICK,on:!1},e),bl(e),U.forget(),Y.callOpen=!1,Y.callStore=null,Gt(e),Ge(),ne(),fs(e),O=null,n.inspect=null,n.editingId=null,n.draft="",n.sections=[],n.pageBuilder=!1,n.layoutFile=!1,J="",e?.clearTimeout?.(Le),!t){$t(e);return}t.remove(),Nt.headerTab==="html_tree"&&ss(e,null),Do(e),Pn(e),Hn(e),$t(e)}function Pl(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=Ye,Fe(t,Xn,{title:u(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>Jt(e)))}function Hl(e){Dt(e),A(e)}function vo(e){const t=e.document;if(!No(e,"html_tree"))return;if(W(t)){Dt(e),A(e);return}if(!ao(t))return;Ee=!0,K.clear(),jo(e,[Ye]);const s=t.createElement("div");s.id=Ye,s.style.cssText=Vo,Fe(s,Xn,{title:u(e,"html_tree")}),s.querySelector("[data-sve-close]")?.addEventListener("click",()=>Jt(e)),Ko(e,s),Pn(e),Hn(e),$t(e),Dt(e),A(e)}function Ml(e){if(W(e.document)){Jt(e);return}vo(e)}qt("html-tree:open-section",e=>{const t=window,s=t.document,o=pt(t,s),a=o.find(l=>l.uid===e||l.ids.includes(e));return a?(ft(t,s,o,a.uid,""),{uid:a.uid,ids:a.ids}):null});qt("html-tree:from-preview",({path:e,src:t}={})=>{Bn(window,e)||kl(window,yl(e,t)||e)});qt("html-tree:arm-pick",e=>{const t=window;return e?(co(t,ht(z(),no(t))),!0):(W(t.document)||ue({source:ee,type:Q.SVE_HTML_PICK,on:!1},t),!0)});function Il(){de.clear(),$e.clear(),_e.length=0}export{Hi as HTML_TREE_STYLE_ID,El as armHtmlTreePrefetch,Il as clearHtmlTreeTemplates,ne as closeHtmlTreeMenu,Jt as closeHtmlTreePanel,Ri as ensureHtmlTreeStyles,Pl as fillHtmlTreePane,O as htmlTreeActiveId,W as htmlTreePanel,Qe as htmlTreeTimer,Ze as htmlTreeUnhook,vo as openHtmlTreePanel,A as renderHtmlTree,Hl as showHtmlTreePane,bl as stopWatchHtmlTreeDock,Ml as toggleHtmlTreePanel,Dt as watchHtmlTreeDock};
