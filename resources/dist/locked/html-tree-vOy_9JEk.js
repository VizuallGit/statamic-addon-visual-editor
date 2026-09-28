const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-AWaJHJyk.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{_ as Ke,I as G,J as yo,K as Me,o as f,k as v,l as E,G as $,m as P,F as R,L as ve,n as j,b3 as ko,x as L,O as wt,b4 as bo,A as ce,t as c,C as _o,a as T,b5 as To,b6 as Cn,z as Bt,b7 as on,b8 as sn,b9 as xo,ba as So,bb as wo,bc as $o,bd as lt,D as ue,au as Co,be as n,u as l,w as Ln,v as Lo,M as le,bf as Eo,B as Po,bg as Y,bh as Ho,bi as Ao,bj as Mo,H as Ie,j as fe,bk as Io,bl as Ro,bm as an,N as Fo,Q as Oo,s as Nt,av as $t,ar as Do,aP as En,aQ as Pn,i as Bo,am as rn,a1 as Re,X as No,aO as jo,as as Vo,at as Ko,ad as qo,bn as Hn,bo as Go,bp as ln,bq as An,a0 as Mn,br as Uo,E as In,bs as zo,a9 as dt,T as jt,U as Vt,az as ct,aA as Be,S as Kt,bt as Xo,bu as Yo,bv as Rn,bw as Wo,bx as Zo,by as Jo,bz as Fn,bA as Qo,bB as es,aS as ts,aT as ns,ay as os,a$ as ss,al as qt,aL as as,aG as rs}from"./addon-CKI_CHp-.js";import{M as ee,S as te}from"./protocol-Brvy2KuB.js";import{canEditFields as is,currentSetHandle as ls,openFieldsetOverlay as On,openGlobalFieldsOverlay as ds}from"./section-fields-KUWyMkqI.js";import{H as Xe,ad as cs}from"./ai-text-icon-CaHMo9Tt.js";import{F as W,G as us,I as ut,J as hs,t as ps,K as Gt,x as fs,B as ms,d as ht,m as dn,L as Dn,s as vs,M as Bn,H as we,N as gs,O as Ut,c as ys,Q as Nn,R as jn,S as ks,h as bs,a as _s,T as Ts,U as xs,V as Ss,W as ws,X as $s,Y as Cs,Z as Ls,$ as Es,a0 as Ps,a1 as cn}from"./tw-classes-DG-DUkN_.js";import{b as Hs}from"./html-pick-align-CLq5l-p4.js";import"./FieldsetOverlay-DCRy6inp.js";const As={class:"sve-dialog__title"},Ms={for:"sve-new-section-group"},Is={class:"sve-dialog__row"},Rs=["disabled"],Fs=["value"],Os=["title","aria-label"],Ds={key:0,class:"sve-dialog__add-group"},Bs={for:"sve-new-section-group-name"},Ns={class:"sve-dialog__row"},js=["placeholder","disabled"],Vs=["disabled"],Ks=["disabled"],qs={for:"sve-new-section-name"},Gs=["placeholder"],Us={key:1,class:"sve-dialog__toggle"},zs={key:2,class:"sve-dialog__note"},Xs={class:"sve-dialog__actions"},Ys=["disabled"],Ws=["disabled"],Zs={__name:"NewSectionPrompt",props:{heading:{type:String,required:!0},groupLabel:{type:String,required:!0},nameLabel:{type:String,required:!0},placeholder:{type:String,default:""},note:{type:String,default:""},groups:{type:Array,required:!0},toggleLabel:{type:String,default:""},toggleOn:{type:Boolean,default:!0},cancelLabel:{type:String,required:!0},saveLabel:{type:String,required:!0},onOk:{type:Function,required:!0},onClose:{type:Function,required:!0},addGroupLabel:{type:String,default:""},addGroupNameLabel:{type:String,default:""},addGroupPlaceholder:{type:String,default:""},onAddGroup:{type:Function,default:null}},setup(e){const t=e,s=G(""),o=G([...t.groups]),a=G(t.groups[0]?.key??""),i=G(!1),r=G(""),d=G(null),m=G(!1);function b(){i.value=!0,r.value="",Me(()=>d.value?.focus())}function y(){i.value=!1,r.value="",Me(()=>x.value?.focus())}async function p(){const g=r.value.trim();if(!g||m.value||!t.onAddGroup){d.value?.focus();return}m.value=!0;const w=await t.onAddGroup(g);if(m.value=!1,!w?.key){d.value?.focus();return}o.value.some(M=>M.key===w.key)||o.value.push(w),a.value=w.key,i.value=!1,r.value="",Me(()=>x.value?.focus())}function k(g){g.key==="Enter"?(g.preventDefault(),p()):g.key==="Escape"&&(g.stopPropagation(),y())}const C=G(t.toggleOn),x=G(null),O=G(!1);yo(()=>Me(()=>x.value?.focus()));function V(){const g=s.value.trim();if(!g||o.value.length&&!a.value||O.value){x.value?.focus();return}O.value=!0,t.onOk(g,a.value,C.value)}function _(g){g.target===g.currentTarget&&t.onClose()}function h(g){g.key==="Enter"?V():g.key==="Escape"&&t.onClose()}return(g,w)=>(f(),v("div",{class:"sve-dialog-overlay",onClick:_},[E("div",{class:"sve-dialog",onClick:w[5]||(w[5]=$(()=>{},["stop"]))},[E("div",As,P(e.heading),1),o.value.length?(f(),v(R,{key:0},[E("label",Ms,P(e.groupLabel),1),E("div",Is,[ve(E("select",{id:"sve-new-section-group","onUpdate:modelValue":w[0]||(w[0]=M=>a.value=M),disabled:i.value,onKeydown:h},[(f(!0),v(R,null,j(o.value,M=>(f(),v("option",{key:M.key,value:M.key},P(M.display),9,Fs))),128))],40,Rs),[[ko,a.value]]),e.onAddGroup&&!i.value?(f(),v("button",{key:0,type:"button",class:"is-add",title:e.addGroupLabel,"aria-label":e.addGroupLabel,"data-sve-new-group":"",onClick:b},[...w[6]||(w[6]=[E("span",{"aria-hidden":"true"},"+",-1)])],8,Os)):L("",!0)]),i.value?(f(),v("div",Ds,[E("label",Bs,P(e.addGroupNameLabel||e.addGroupLabel),1),E("div",Ns,[ve(E("input",{id:"sve-new-section-group-name",ref_key:"groupInput",ref:d,"onUpdate:modelValue":w[1]||(w[1]=M=>r.value=M),type:"text",placeholder:e.addGroupPlaceholder,disabled:m.value,"data-sve-new-group-name":"",onKeydown:k},null,40,js),[[wt,r.value]]),E("button",{type:"button",class:"is-primary is-small",disabled:m.value,"data-sve-new-group-create":"",onClick:p},P(e.saveLabel),9,Vs),E("button",{type:"button",class:"is-cancel is-small",disabled:m.value,onClick:y},P(e.cancelLabel),9,Ks)])])):L("",!0)],64)):L("",!0),E("label",qs,P(e.nameLabel),1),ve(E("input",{id:"sve-new-section-name",ref_key:"input",ref:x,"onUpdate:modelValue":w[2]||(w[2]=M=>s.value=M),type:"text",placeholder:e.placeholder,onKeydown:h},null,40,Gs),[[wt,s.value]]),e.toggleLabel?(f(),v("label",Us,[ve(E("input",{"onUpdate:modelValue":w[3]||(w[3]=M=>C.value=M),type:"checkbox",onKeydown:h},null,544),[[bo,C.value]]),E("span",null,P(e.toggleLabel),1)])):L("",!0),e.note?(f(),v("p",zs,P(e.note),1)):L("",!0),E("div",Xs,[E("button",{type:"button",class:"is-cancel",disabled:O.value,onClick:w[4]||(w[4]=(...M)=>e.onClose&&e.onClose(...M))},P(e.cancelLabel),9,Ys),E("button",{type:"button",class:"is-primary",disabled:O.value,onClick:V},P(e.saveLabel),9,Ws)])])]))}},Vn=Ke(Zs,[["__scopeId","data-v-6501522a"]]),Kn=["section","div","article","aside","nav","header","footer"];function Js(e){return[`{{ ${e} }}`,"    {{ _class = type | replace('/', '-') | replace('_', '-') }}",'    {{ partial src="partials/page_sections/{ type }" id="{{ id }}" :class="_class" :_class="_class" }}',`{{ /${e} }}`].join(`
`)}function Qs(e){const t=/^sections:([A-Za-z_][A-Za-z0-9_]*)$/.exec(String(e||""));return t?t[1]:""}function ea(e){const t=Qs(e);if(t)return Js(t);const s=Kn.includes(e)?e:"div";return`<${s} class="${s==="section"?"[ ] py-800":"[ ]"}">
    
</${s}>`}function ta(e,t,s=null){const o=String(e||""),a=ea(t),i=s?s.wrapFrom??s.from:NaN,r=s?s.wrapTo??s.to:NaN;if(!Number.isInteger(i)||!Number.isInteger(r)||i<0||r>o.length||i>r){const p=`${o.replace(/\s+$/,"")}${o.trim()?`

`:""}`;return{html:`${p}${a}
`,at:p.length}}const d=o.lastIndexOf(`
`,i-1)+1,m=o.slice(d,i),b=/^[ \t]*$/.test(m)?m:"",y=a.split(`
`).map(p=>p&&b+p).join(`
`);return{html:`${o.slice(0,r)}
${y}${o.slice(r)}`,at:r+1+b.length}}const zt="/!/sve/section-types",un="static_sections";async function na(e){const t=await e.fetch(`${zt}?${To(e)}`,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!t.ok)throw new Error(`section-types ${t.status}`);const s=await t.json();if(Array.isArray(s.groups)&&s.groups.length)return s.groups.filter(a=>a&&a.handle&&a.handle!==un).map(a=>({key:a.handle,display:a.display||a.handle}));const o=new Map;for(const a of s.types||[])a?.group&&a.group!==un&&!o.has(a.group)&&o.set(a.group,a.group_display||a.group);return[...o].map(([a,i])=>({key:a,display:i}))}async function oa(e,t){const s=await e.fetch(`${zt}/groups`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Bt(e),"X-Requested-With":"XMLHttpRequest",Accept:"application/json"},body:JSON.stringify({display:t,...Cn(e)})}),o=await s.json().catch(()=>({}));if(!s.ok||!o.group?.handle)throw new Error(o?.error==="bad_name"?"bad_name":`section-types/groups ${s.status}`);return e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale")),{key:o.group.handle,display:o.group.display||o.group.handle}}const Ne=new Map;function sa(e){e?.handle&&Ne.set(e.handle,{static:!!e.static,hidden:!!e.hidden})}function aa(e,t){return t?Ne.has(t)?Ne.get(t).static:e.Statamic?.$config?.get?.("sveSetMeta")?.[t]?.static===!0:!1}function ra(e,t){if(!t)return!1;if(Ne.has(t))return Ne.get(t).hidden;const s=e.Statamic?.$config?.get?.("sveSectionTypes");return Array.isArray(s)&&s.some(o=>o?.handle===t&&o.hidden===!0)}async function qn(e,t,s){const o=await e.fetch(zt,{method:t,headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Bt(e),Accept:"application/json"},credentials:"same-origin",body:JSON.stringify({...s,...Cn(e)})}),a=await o.json().catch(()=>({}));if(!o.ok){const i=new Error(a.error||`section-types ${o.status}`);throw i.reason=a.error,i}return sa(a.section),a}function ia(e,{display:t,group:s="",static:o=!1,hidden:a=!1}){return qn(e,"POST",{display:t,group:s,static:o,hidden:a})}function hn(e,{handle:t,hidden:s,fields:o=!1}){const a={handle:t,fields:o};return typeof s=="boolean"&&(a.hidden=s),qn(e,"PATCH",a)}async function la(e,t,s=null,o=null){if(!t||typeof on!="function"||typeof sn!="function")return null;const a=await on(e,t);if(!a)return null;o&&Array.isArray(a.definitions)&&xo(t,{display:o.display||t,icon:o.icon||null,hide:o.hidden===!0,fields:a.definitions,group_display:o.group_display||o.group||""},o.group||"");const i=So(),r=wo(e,"page",{handle:t},a?.defaults,i),d=$o(r,a?.new||{},a?.defaults);return sn(e,e.document,s,r,d)?r:null}const pn=700,da=17;function ca(e,t){const s=(t||[]).filter(Boolean);if(!s.length)return;let o=0;const a=()=>{o+=1;const i=lt(e),r=i?s.some(d=>i.querySelector(`[data-sid="${CSS.escape(d)}"]`)):!0;r&&ue({source:te,type:ee.SVE_ACTIVATE,ids:s},e),(r?!i&&o<6:o<da)&&e.setTimeout(a,pn)};e.setTimeout(a,pn)}function Gn(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function ua(e){return new Promise(t=>{let s=!1;const o=i=>{s||(s=!0,a.dismiss(),t(i==="static"||i==="fields"?i:null))},a=ce(e.document,_o,{title:c(e,"section_new_kind"),body:c(e,"section_new_kind_note"),buttons:[{value:"cancel",label:c(e,"cancel"),variant:"ghost"},{value:"static",label:c(e,"section_new_static"),variant:"primary"},{value:"fields",label:c(e,"section_new_with_fields"),variant:"primary"}],onPick:o,onClose:()=>o(null)})})}function ha(e,t,s=null,o=`<${t}>`){if(T("dock:is-locked")===!0)return e.Statamic?.$toast?.error(c(e,"code_dock_locked")),null;const{html:a,at:i}=ta(String(T("dock:html")||""),t,s);return T("dock:set-html",a)!==!0?(e.Statamic?.$toast?.error(c(e,"section_new_failed")),null):(T("dock:save-now"),e.Statamic?.$toast?.success(c(e,"html_tree_element_added",{name:o})),i)}async function Un(e,t,s,{afterUid:o,onDone:a,onError:i}){try{const r=await ia(e,s);t.dismiss(),e.Statamic?.$toast?.success(c(e,"section_created",{name:r.section?.display||s.display})),Ct(e);const d=r.section?.handle?{...r.section,group_display:(r.section_types||[]).find(b=>b?.handle===r.section.handle)?.group_display||""}:null,m=await la(e,r.section?.handle,o,d);!m&&r.section?.handle&&T("dock:open-template",r.section.handle),a?.({...r,uid:m?._visual_id||""})}catch(r){t.dismiss(),e.Statamic?.$toast?.error(c(e,r.reason==="bad_name"?"section_new_bad_name":"section_new_failed")),i?.(r)}}function Ct(e){e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"))}function pa(e,{afterUid:t=null,onDone:s,onError:o,onClose:a}={}){const i=ce(e.document,Vn,{heading:c(e,"static_section_new"),groupLabel:"",nameLabel:c(e,"section_new_name"),placeholder:c(e,"section_new_placeholder"),note:c(e,"static_section_note"),groups:[],toggleLabel:c(e,"static_section_insertable"),cancelLabel:c(e,"cancel"),saveLabel:c(e,"section_new_create"),onClose:a,onOk:(r,d,m)=>{Un(e,i,{display:r,static:!0,hidden:!m},{afterUid:t,onDone:s,onError:o})}})}function fa(e,{afterUid:t=null,onDone:s,onError:o,onClose:a}={}){(async()=>{let i=[];try{i=await na(e)}catch(d){o?.(d),e.Statamic?.$toast?.error(c(e,"section_new_failed"));return}if(!i.length){o?.(new Error("no groups")),e.Statamic?.$toast?.error(c(e,"section_new_failed"));return}const r=ce(e.document,Vn,{heading:c(e,"section_new"),groupLabel:c(e,"section_new_group"),nameLabel:c(e,"section_new_name"),placeholder:c(e,"section_new_placeholder"),note:c(e,"section_new_note"),groups:i,addGroupLabel:c(e,"section_new_group_add"),addGroupNameLabel:c(e,"section_new_group_name"),addGroupPlaceholder:c(e,"section_new_group_placeholder"),onAddGroup:async d=>{try{const m=await oa(e,d);return e.Statamic?.$toast?.success(c(e,"section_group_created",{name:m.display})),m}catch(m){return e.Statamic?.$toast?.error(c(e,m?.message==="bad_name"?"section_new_bad_name":"section_group_failed")),null}},cancelLabel:c(e,"cancel"),saveLabel:c(e,"section_new_create"),onClose:a,onOk:(d,m)=>{Un(e,r,{display:d,group:m},{afterUid:t,onDone:s,onError:o})}})})()}const ma={key:0,class:"sve-ht-inspect"},va={class:"sve-ht-inspect__head"},ga={key:0,class:"sve-ht-inspect__note"},ya={key:2,class:"sve-ht-inspect__props"},ka={class:"sve-ht-inspect__proplabel"},ba={key:0},_a=["value","disabled","onChange"],Ta={value:""},xa=["value"],Sa=["value"],wa=["value","placeholder","onChange"],$a=["title","disabled","onClick"],Ca=["title","disabled","onClick"],La={key:0,class:"sve-ht-inspect__seg"},Ea=["data-active","disabled","onClick"],Pa=["value","disabled"],Ha={key:0,value:""},Aa=["value"],Ma={key:2,class:"sve-ht-inspect__box"},Ia=["value","placeholder","disabled","onKeydown"],Ra=["title","disabled"],Fa={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Oa=["value","disabled"],Da=["value"],Ba={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},Na=["value","placeholder","disabled"],ja=["title","disabled"],Va={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Ka=["value","placeholder","disabled"],qa={key:4,class:"sve-ht-inspect__add"},Ga=["disabled","onClick"],vt='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',Ua='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',za={__name:"HtmlTreeInspector",setup(e){const t=G(null);Co(t,b=>n.onPropHost?.(b||null));const s=G(null),o=G(null);function a(b){n.onInspectCommit?.(b.target.value)}function i(b,y,p){!b||!y||(b.value=y,b.focus(),b.setSelectionRange(y.length,y.length),p(y))}function r(b,y){n.onInspectData?.(b.currentTarget,p=>n.onPropValue?.(y.handle,p,!0))}function d(b){n.onInspectData?.(b.currentTarget,y=>i(s.value,y,p=>n.onInspectCommit?.(p)))}function m(b){n.onInspectData?.(b.currentTarget,y=>i(o.value,y,p=>n.onLoopSortField?.(p)))}return(b,y)=>l(n).inspect?(f(),v("div",ma,[E("div",va,P(l(n).inspect.title),1),l(n).inspect.mode==="note"?(f(),v("div",ga,P(l(n).inspect.note),1)):l(n).inspect.mode==="statamic"?(f(),v("div",{key:1,ref_key:"propHost",ref:t,class:"sve-ht-inspect__form"},null,512)):l(n).inspect.mode==="props"?(f(),v("div",ya,[(f(!0),v(R,null,j(l(n).inspect.rows,p=>(f(),v("label",{key:p.handle,class:"sve-ht-inspect__prop"},[E("span",ka,[Ln(P(p.label)+" ",1),p.bound?(f(),v("em",ba,":")):L("",!0)]),E("span",{class:Lo(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":p.type==="select"||p.type==="link"}])},[p.type==="select"&&!p.bound?(f(),v("select",{key:0,value:p.value,disabled:!l(n).canEdit,onChange:k=>l(n).onPropValue?.(p.handle,k.target.value,!1)},[E("option",Ta,P(p.placeholder||l(n).inspect.inheritLabel),1),p.value&&!p.options.includes(p.value)?(f(),v("option",{key:0,value:p.value},P(p.value),9,xa)):L("",!0),(f(!0),v(R,null,j(p.options,k=>(f(),v("option",{key:k,value:k},P(k),9,Sa))),128))],40,_a)):(f(),v("input",{key:1,type:"text",value:p.value,placeholder:p.placeholder||l(n).inspect.inheritLabel,onChange:k=>l(n).onPropValue?.(p.handle,k.target.value,p.bound)},null,40,wa)),p.type==="link"?(f(),v("button",{key:2,type:"button","data-sve-ht-data":"",title:l(n).pageTitle,disabled:!l(n).canEdit,onClick:k=>l(n).onPropPage?.(k.currentTarget,p.handle),innerHTML:Ua},null,8,$a)):L("",!0),E("button",{type:"button","data-sve-ht-data":"",title:l(n).dataTitle,disabled:!l(n).canEdit,onClick:k=>r(k,p),innerHTML:vt},null,8,Ca)],2)]))),128))])):(f(),v(R,{key:3},[l(n).inspect.mode==="loop"?(f(),v("div",La,[(f(!0),v(R,null,j(l(n).inspect.kinds,p=>(f(),v("button",{key:p.id,type:"button","data-active":p.id===l(n).inspect.loopKind?"":void 0,disabled:!l(n).canEdit,onClick:k=>l(n).onLoopKind?.(p.id)},P(p.label),9,Ea))),128))])):L("",!0),l(n).inspect.mode==="loop"&&l(n).inspect.loopKind==="collection"?(f(),v("select",{key:l(n).inspect.key+":"+l(n).inspect.value,value:l(n).inspect.value,disabled:!l(n).canEdit,onChange:a},[l(n).inspect.value?L("",!0):(f(),v("option",Ha,P(l(n).inspect.placeholder),1)),(f(!0),v(R,null,j(l(n).inspect.collections,p=>(f(),v("option",{key:p.handle,value:p.handle},P(p.title),9,Aa))),128))],40,Pa)):(f(),v("div",Ma,[(f(),v("input",{ref_key:"field",ref:s,key:l(n).inspect.key,type:"text",value:l(n).inspect.value,placeholder:l(n).inspect.placeholder,disabled:!l(n).canEdit,spellcheck:"false",onKeydown:[y[0]||(y[0]=$(()=>{},["stop"])),le($(a,["prevent"]),["enter"])],onBlur:a},null,40,Ia)),E("button",{type:"button","data-sve-ht-data":"",title:l(n).dataTitle,disabled:!l(n).canEdit,innerHTML:vt,onMousedown:y[1]||(y[1]=$(()=>{},["prevent"])),onClick:$(d,["stop","prevent"])},null,40,Ra)])),l(n).inspect.sort?(f(),v(R,{key:3},[E("div",Fa,P(l(n).inspect.sort.title),1),(f(),v("select",{key:l(n).inspect.key+":dir:"+l(n).inspect.sort.dir,value:l(n).inspect.sort.dir,disabled:!l(n).canEdit,onChange:y[2]||(y[2]=p=>l(n).onLoopSortDir?.(p.target.value))},[(f(!0),v(R,null,j(l(n).inspect.sort.dirs,p=>(f(),v("option",{key:p.id,value:p.id},P(p.label),9,Da))),128))],40,Oa)),l(n).inspect.sort.needsField?(f(),v("div",Ba,[(f(),v("input",{ref_key:"sortField",ref:o,key:l(n).inspect.key+":field",type:"text",value:l(n).inspect.sort.field,placeholder:l(n).inspect.sort.placeholder,disabled:!l(n).canEdit,spellcheck:"false",onKeydown:[y[3]||(y[3]=$(()=>{},["stop"])),y[4]||(y[4]=le($(p=>l(n).onLoopSortField?.(p.target.value),["prevent"]),["enter"]))],onBlur:y[5]||(y[5]=p=>l(n).onLoopSortField?.(p.target.value))},null,40,Na)),l(n).inspect.sort.pickable?(f(),v("button",{key:0,type:"button","data-sve-ht-data":"",title:l(n).dataTitle,disabled:!l(n).canEdit,innerHTML:vt,onMousedown:y[6]||(y[6]=$(()=>{},["prevent"])),onClick:$(m,["stop","prevent"])},null,40,ja)):L("",!0)])):L("",!0),E("div",Va,P(l(n).inspect.limit.title),1),(f(),v("input",{key:l(n).inspect.key+":limit",type:"number",min:"1",value:l(n).inspect.limit.value,placeholder:l(n).inspect.limit.placeholder,disabled:!l(n).canEdit,onKeydown:[y[7]||(y[7]=$(()=>{},["stop"])),y[8]||(y[8]=le($(p=>l(n).onLoopLimit?.(p.target.value),["prevent"]),["enter"]))],onBlur:y[9]||(y[9]=p=>l(n).onLoopLimit?.(p.target.value))},null,40,Ka))],64)):L("",!0),l(n).inspect.branches?.length?(f(),v("div",qa,[(f(!0),v(R,null,j(l(n).inspect.branches,p=>(f(),v("button",{key:p.id,type:"button",disabled:!l(n).canEdit,onClick:k=>l(n).onAddBranch?.(p.id)},P(p.label),9,Ga))),128))])):L("",!0)],64))])):L("",!0)}},Xa=Ke(za,[["__scopeId","data-v-26254b75"]]),Ya={class:"sve-html-tree"},Wa={class:"sve-pane-bar","data-sve-pane-bar":""},Za={"data-sve-right-title":""},Ja={"data-sve-right-actions":""},Qa=["aria-pressed","title","aria-label"],er=["title"],tr={class:"sve-ht-used-by__label"},nr={class:"sve-ht-used-by__chips"},or={key:0,class:"sve-ht-used-by__empty"},sr={class:"sve-ht-tools"},ar=["title"],rr=["placeholder","aria-label","value"],ir=["aria-label"],lr=["title","aria-label"],dr={key:2,class:"sve-tree-exit"},cr=["title"],ur=["title"],hr='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',pr='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',fr='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',mr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/></svg>',vr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',gr={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const t=c(window,"html_tree_search");n.layers=Eo(window);const s=c(window,"html_tree_layers_on"),o=c(window,"html_tree_layers_off");function a(){Ao(window,!n.layers)}const i=Gn(window),r=c(window,"section_new"),d=c(window,"html_tree_add_element"),m=c(window,"html_tree_sections_slot"),b=c(window,"html_tree_sections_no_field");function y(){const h=n.templateSections.length?n.templateSections:[Mo(window)],g=new Set(n.rows.filter(w=>w.kind==="sections").map(w=>w.tag));return h.filter(w=>!g.has(w)).map(w=>({tag:`sections:${w}`,label:h.length>1?`${m} · ${w}`:m,noField:!n.templateSections.length}))}const p=G(!1);function k(){p.value=!1}async function C(h){if(!h)return;await Me(),n.onRefresh?.();const g=T("html-tree:open-section",h);g&&ca(window,g.ids)}function x(){return n.rows.find(h=>h.current&&!h.context&&!h.synthetic)||null}function O(h){const g=h.getBoundingClientRect(),w=x();let M=null;const B=(F,A,K="")=>()=>{M?.dismiss(),M=null,k();const oe=ha(window,F,w,A);oe!==null&&(n.selectFrom={at:oe,left:4},K&&window.Statamic?.$toast?.info?.(K))};M=ce(document,ut,{items:[...Kn.map(F=>({label:F,onPick:B(F,`<${F}>`)})),...y().map(F=>({label:F.label,onPick:B(F.tag,F.label,F.noField?b:"")}))],x:Math.round(g.left),y:Math.round(g.bottom+4),onClose:()=>{M=null,k()}})}function V(h){if(!p.value){if(p.value=!0,!(n.sections.length||n.pageBuilder)){O(h.currentTarget);return}(async()=>{const g=await ua(window);if(!g){k();return}const w=n.sections.length?n.sections[n.sections.length-1].uid:null,M=B=>{k(),C(B?.uid)};if(g==="static"){pa(window,{afterUid:w,onDone:M,onError:k,onClose:k});return}fa(window,{afterUid:w,onDone:M,onError:k,onClose:k})})()}}function _(h){const g=!!n.query;n.query=h,g!==!!h&&n.onQuery?.()}return(h,g)=>(f(),v("div",Ya,[E("div",Wa,[E("div",Za,P(e.title),1),E("div",Ja,[E("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":l(n).layers?"true":"false",title:l(n).layers?l(o):l(s),"aria-label":l(n).layers?l(o):l(s),innerHTML:hr,onClick:a},null,8,Qa),g[5]||(g[5]=Po('<button type="button" data-sve-right-pin aria-pressed="false" data-v-f0ab88ad></button><button type="button" data-sve-close aria-label="Close" data-v-f0ab88ad><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-f0ab88ad><path d="M18 6 6 18" data-v-f0ab88ad></path><path d="m6 6 12 12" data-v-f0ab88ad></path></svg></button>',2))])]),l(n).usedBy?(f(),v("div",{key:0,class:"sve-ht-used-by",title:l(n).usedBy.hint||null},[E("span",tr,[E("span",{class:"sve-ht-used-by__icon","aria-hidden":"true",innerHTML:mr}),Ln(" "+P(l(n).usedBy.label),1)]),E("span",nr,[(f(!0),v(R,null,j(l(n).usedBy.items,w=>(f(),v("span",{key:w,class:"sve-ht-used-by__chip"},P(w),1))),128)),l(n).usedBy.empty?(f(),v("span",or,P(l(n).usedBy.empty),1)):L("",!0)])],8,er)):L("",!0),E("div",sr,[E("label",{class:"sve-ht-search",title:l(t)},[E("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:fr}),E("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:l(t),"aria-label":l(t),value:l(n).query,autocomplete:"off",spellcheck:"false",onInput:g[0]||(g[0]=w=>_(w.target.value)),onKeydown:[g[1]||(g[1]=$(()=>{},["stop"])),g[2]||(g[2]=le($(w=>_(""),["prevent"]),["escape"]))]},null,40,rr),l(n).query?(f(),v("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":l(t),innerHTML:vr,onClick:g[3]||(g[3]=w=>_(""))},null,8,ir)):L("",!0)],8,ar),l(i)&&(l(n).sections.length||l(n).pageBuilder||l(n).rows.length&&!l(n).layoutFile)?(f(),v("button",{key:0,type:"button",class:"sve-ht-new",title:l(n).sections.length||l(n).pageBuilder?l(r):l(d),"aria-label":l(n).sections.length||l(n).pageBuilder?l(r):l(d),innerHTML:pr,onClick:V},null,8,lr)):L("",!0)]),l(W).inSidebar?L("",!0):(f(),Y(us,{key:1})),g[6]||(g[6]=E("div",{"data-sve-html-tree-list":""},null,-1)),Ho(Xa),l(n).exitOpen&&!l(W).inSidebar?(f(),v("div",dr,[E("span",{class:"sve-tree-exit__name",title:l(n).exitName},P(l(n).exitName),9,cr),E("button",{type:"button",class:"sve-tree-exit__go",title:l(n).exitTitle,onClick:g[4]||(g[4]=w=>l(n).onExit?.())},P(l(n).exitLabel),9,ur)])):L("",!0)]))}},zn=Ke(gr,[["__scopeId","data-v-f0ab88ad"]]);function Xn(e){return String(e||"").trim().toLowerCase()}function Lt(e,t){return t?[e.name,e.tag,e.klass,e.label,e.src].filter(s=>typeof s=="string"&&s).join(" ").toLowerCase().includes(t):!0}function yr(e,t){const s=Xn(t);if(!s)return{rows:e,hits:new Set};const o=new Set;for(const r of e)Lt(r,s)&&o.add(r.path);const a=[...o];return{rows:e.filter(r=>o.has(r.path)||a.some(d=>d.startsWith(`${r.path}/`))),hits:o}}const kr=["title"],br={"data-sve-ht-indent":"","aria-hidden":"true"},_r=["data-sve-ht-cat"],Tr={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},xr={key:2,"data-sve-ht-letter":""},Sr=["innerHTML"],wr=["title"],$r=["title"],Cr={key:1,"data-sve-ht-kind":""},Lr={key:3,"data-sve-ht-name":""},Er={key:4,"data-sve-ht-actions":""},Pr=["title"],Hr={key:5,"data-sve-ht-actions":""},Ar=["data-on","title","innerHTML"],Mr=["disabled","title","innerHTML"],Ir=["disabled","title"],Rr=["disabled","title"],Fr=["disabled","title"],Or=["data-sve-ht-id"],fn='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',Dr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',Br='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Nr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',jr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',Vr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',Kr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',qr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',Gr={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const t=is(window),s=c(window,"section_fields");function o(){const _=ls();if(!_){window.Statamic?.$toast?.error(c(window,"section_fields_none"));return}On(window,_)}function a(_){return _.synthetic?_.frame==="main"?n.frameMainTitle:_.frame==="template"?n.frameTemplateTitle:n.frameOpenTitle:_.kind==="component"?_.src?`partial:${_.src}`:_.tag:_.name?`${_.tag} ${_.name}`:_.tag}function i(_){return!!_.section}function r(_){return!!_.frame}function d(_){return _.kind==="slot"}function m(_){return!!_.context}function b(_,h){m(h)||r(h)||d(h)||(i(h)?n.onSectionPointerDown?.(_,h.section):h.sectionRoot?n.onSectionPointerDown?.(_,h.sectionRoot):n.onPointerDown?.(_,h.id))}function y(_){if(_.synthetic){n.onFrame?.(_.frame);return}if(i(_)){n.onSection?.(_.section);return}if(m(_)){n.onContextRow?.(_.id);return}n.onSelect?.(_.id)}function p(_,h){const g={"data-sve-ht-id":_.id};return _.current&&(g["data-sve-ht-current"]=""),_.hidden&&(g["data-sve-ht-hidden"]=""),g["data-sve-ht-cat"]=_.cat||"other",g["data-sve-ht-depth"]=String(_.depth),h&&(g["data-sve-ht-dim"]=""),m(_)&&(g["data-sve-ht-context"]=_.context),i(_)&&(g["data-sve-ht-sec"]=""),r(_)&&(g["data-sve-ht-frame"]=_.frame),!i(_)&&n.dropId===_.id&&n.dropPlace&&(g["data-sve-ht-drop"]=n.dropPlace),g}function k(_){return!!_.fixed}function C(_){return _.kind==="sections"}function x(_){return!k(_)&&!C(_)&&(!_.hidden||_.wrapFrom!=null)}function O(_){return!!_.sectionRoot||!!_.section}function V(_){return n.canEdit||O(_)}return(_,h)=>(f(),v(R,null,[E("div",Ie({"data-sve-ht-row":""},p(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:h[32]||(h[32]=g=>y(e.row)),onDblclick:h[33]||(h[33]=$(g=>e.row.synthetic?l(n).onFrameEnter?.(e.row.frame):r(e.row)||d(e.row)||i(e.row)||m(e.row)?null:l(n).onRename?.(e.row.id),["prevent"])),onKeydown:[h[34]||(h[34]=le($(g=>y(e.row),["prevent"]),["enter"])),h[35]||(h[35]=le($(g=>y(e.row),["prevent"]),["space"]))],onPointerdown:h[36]||(h[36]=g=>b(g,e.row)),onContextmenu:h[37]||(h[37]=$(g=>r(e.row)||d(e.row)||i(e.row)||m(e.row)?null:l(n).onContext?.(g,e.row.id),["prevent","stop"]))}),[E("span",br,[(f(!0),v(R,null,j(e.row.guides||[],(g,w)=>(f(),v("i",{key:w,"data-sve-ht-cat":g},null,8,_r))),128))]),e.row.hasChildren||e.row.emptyBlock?(f(),v("button",Ie({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?l(n).mainShut:e.row.shut)?{"data-sve-ht-shut":""}:{},{innerHTML:Dr,onClick:h[0]||(h[0]=$(g=>e.row.synthetic?l(n).onFrameTwist?.():i(e.row)?l(n).onSection?.(e.row.section):l(n).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:h[1]||(h[1]=$(()=>{},["stop"])),onDblclick:h[2]||(h[2]=$(()=>{},["stop"]))}),null,16)):(f(),v("span",Tr)),e.row.letter?(f(),v("span",xr,P(e.row.letter),1)):(f(),v("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Sr)),E("span",{"data-sve-ht-text":"",title:l(n).renameTitle},[!e.row.kind&&!i(e.row)&&!m(e.row)&&!r(e.row)?(f(),v("button",{key:0,type:"button","data-sve-ht-tag":"",title:l(n).tagTitle,onClick:h[3]||(h[3]=$(()=>{},["stop","prevent"])),onPointerdown:h[4]||(h[4]=$(()=>{},["stop"])),onDblclick:h[5]||(h[5]=$(g=>l(n).onTagChange?.(g,e.row.id),["stop","prevent"]))},P(e.row.tag),41,$r)):(f(),v("span",Cr,P(e.row.tag),1)),l(n).editingId===e.row.id&&!i(e.row)?ve((f(),v("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":h[6]||(h[6]=g=>l(n).draft=g),onMousedown:h[7]||(h[7]=$(()=>{},["stop"])),onPointerdown:h[8]||(h[8]=$(()=>{},["stop"])),onClick:h[9]||(h[9]=$(()=>{},["stop"])),onDblclick:h[10]||(h[10]=$(()=>{},["stop"])),onKeydown:[h[11]||(h[11]=$(()=>{},["stop"])),h[12]||(h[12]=le($(g=>l(n).onRenameCommit?.(),["prevent"]),["enter"])),h[13]||(h[13]=le($(g=>l(n).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:h[14]||(h[14]=g=>l(n).onRenameCommit?.())},null,544)),[[wt,l(n).draft]]):(f(),v("span",Lr,P(e.row.name),1))],8,wr),r(e.row)?(f(),v("span",Er,[e.row.frame!=="main"&&l(t)?(f(),v("button",{key:0,type:"button","data-sve-ht-fields":"",title:l(n).frameFieldsTitle,innerHTML:fn,onClick:h[15]||(h[15]=$(g=>l(n).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:h[16]||(h[16]=$(()=>{},["stop"])),onDblclick:h[17]||(h[17]=$(()=>{},["stop"]))},null,40,Pr)):L("",!0)])):!i(e.row)&&!m(e.row)&&!d(e.row)?(f(),v("span",Hr,[e.row.videoNth>=0?(f(),v("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?l(n).videoPlayTitle:l(n).videoHoldTitle,innerHTML:e.row.videoHeld?Kr:Vr,onClick:h[18]||(h[18]=$(g=>l(n).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:h[19]||(h[19]=$(()=>{},["stop"])),onDblclick:h[20]||(h[20]=$(()=>{},["stop"]))},null,40,Ar)):L("",!0),x(e.row)?(f(),v("button",{key:1,type:"button","data-sve-ht-eye":"",disabled:!l(n).canEdit,title:l(n).canEdit?e.row.hidden?l(n).showTitle:l(n).hideTitle:l(n).lockedTitle,innerHTML:e.row.hidden?Nr:Br,onClick:h[21]||(h[21]=$(g=>l(n).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:h[22]||(h[22]=$(()=>{},["stop"])),onDblclick:h[23]||(h[23]=$(()=>{},["stop"]))},null,40,Mr)):L("",!0),l(t)&&e.row.fieldsIcon?(f(),v("button",{key:2,type:"button","data-sve-ht-fields":"",disabled:!l(n).canEdit,title:l(n).canEdit?l(s):l(n).lockedTitle,innerHTML:fn,onClick:$(o,["stop","prevent"]),onPointerdown:h[24]||(h[24]=$(()=>{},["stop"])),onDblclick:h[25]||(h[25]=$(()=>{},["stop"]))},null,40,Ir)):L("",!0),!k(e.row)&&!C(e.row)?(f(),v("button",{key:3,type:"button","data-sve-ht-dup":"",disabled:!V(e.row),title:V(e.row)?l(n).duplicateTitle:l(n).lockedTitle,innerHTML:jr,onClick:h[26]||(h[26]=$(g=>l(n).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:h[27]||(h[27]=$(()=>{},["stop"])),onDblclick:h[28]||(h[28]=$(()=>{},["stop"]))},null,40,Rr)):L("",!0),k(e.row)?L("",!0):(f(),v("button",{key:4,type:"button","data-sve-ht-del":"",disabled:!V(e.row),title:V(e.row)?l(n).deleteTitle:l(n).lockedTitle,innerHTML:qr,onClick:h[29]||(h[29]=$(g=>l(n).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:h[30]||(h[30]=$(()=>{},["stop"])),onDblclick:h[31]||(h[31]=$(()=>{},["stop"]))},null,40,Fr))])):L("",!0)],16,kr),e.row.emptyBlock&&!e.row.shut?(f(),v("div",Ie({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},l(n).dropId===e.row.id&&l(n).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),P(l(n).slotText),17,Or)):L("",!0)],64))}},J=Ke(Gr,[["__scopeId","data-v-221c8b88"]]),Ur=["data-sve-ht-look","data-sve-ht-layers"],zr={key:0,class:"sve-ht-page-template"},Xr={key:0,class:"sve-ht-page-template__text"},Yr={class:"sve-ht-page-template__note"},Wr={key:1,class:"sve-ht-empty"},Zr={key:2,class:"sve-ht-empty"},Jr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},Qr={key:0,class:"sve-ht-empty"},ei={key:0,class:"sve-ht-empty"},ti=["data-sve-ht-under-main"],ni={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},oi={key:0,class:"sve-ht-empty"},si=["data-sve-ht-under-main"],ai=["data-dim"],ri={key:0,class:"sve-ht-empty"},ii={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},li={key:0,class:"sve-ht-empty"},di={__name:"HtmlTreeList",setup(e){const t=fe(()=>Xn(n.query)),s=fe(()=>yr(n.rows,t.value)),o=fe(()=>s.value.rows),a=fe(()=>t.value?n.sections.filter(k=>Lt(k.row,t.value)||k.current&&k.ready&&o.value.length>0):n.sections);function i(k){return!!k&&(!t.value||Lt(k,t.value))}function r(k){const C=n.frame?.kind;return n.inComponent||(C==="header"||C==="footer")&&C!==k}const d=fe(()=>!!n.frame&&["header","main","footer"].some(k=>i(n.frame[k]))),m=fe(()=>!!n.frame&&(n.frame.kind==="main"||i(n.frame.main))),b=fe(()=>!!t.value&&!a.value.length&&!o.value.length&&!d.value);function y(k){return!!t.value&&!s.value.hits.has(k.path)}function p(k){const C={"data-sve-ht-sec-uid":k.uid};return k.current&&(C["data-sve-ht-branch"]="",C["data-sve-ht-cat"]=k.row?.cat||"layout"),n.sectionDrop&&n.sectionDrop.uid===k.uid&&(C["data-sve-ht-drop"]=n.sectionDrop.place),C}return(k,C)=>(f(),v("div",Ie({class:"sve-ht-root","data-sve-ht-look":l(n).layers?"tags":l(n).look,"data-sve-ht-layers":l(n).layers?"":null,style:l(n).familyStyle},l(n).dragging?{"data-sve-ht-dragging":""}:{}),[l(n).pageTemplate?(f(),v("div",zr,[l(n).pageTemplate.text?(f(),v("p",Xr,P(l(n).pageTemplate.text),1)):L("",!0),E("p",Yr,P(l(n).pageTemplate.note),1),l(n).pageTemplate.canOpen?(f(),v("button",{key:1,type:"button",class:"sve-ht-page-template__open",onClick:C[0]||(C[0]=x=>l(n).pageTemplate.onOpen(x.currentTarget))},P(l(n).pageTemplate.openLabel),1)):L("",!0)])):!l(n).rows.length&&!l(n).sections.length&&!l(n).frame?(f(),v("div",Wr,P(l(n).emptyText),1)):b.value?(f(),v("div",Zr,P(l(n).searchEmpty),1)):L("",!0),l(n).frame||l(n).sections.length?(f(),v(R,{key:3},[l(n).frame?(f(),v(R,{key:0},[l(n).frame.kind==="header"?(f(),v("div",Jr,[(f(!0),v(R,null,j(o.value,x=>(f(),Y(J,{key:x.id,row:x,dim:y(x)},null,8,["row","dim"]))),128)),l(n).rows.length?L("",!0):(f(),v("div",Qr,P(l(n).emptyText),1))])):i(l(n).frame.header)?(f(),Y(J,{key:1,row:l(n).frame.header,dim:r("header")},null,8,["row","dim"])):L("",!0)],64)):L("",!0),E("div",Io(Ro(l(n).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[l(n).frame?.kind==="main"?(f(),v(R,{key:0},[(f(!0),v(R,null,j(o.value,x=>(f(),Y(J,{key:x.id,row:x,dim:y(x)},null,8,["row","dim"]))),128)),l(n).rows.length?L("",!0):(f(),v("div",ei,P(l(n).emptyText),1))],64)):l(n).frame&&i(l(n).frame.main)?(f(),Y(J,{key:1,row:l(n).frame.main,dim:r("main")},null,8,["row","dim"])):L("",!0),l(n).frame?.kind==="template"?ve((f(),v("div",{key:2,"data-sve-ht-frame-body":"","data-sve-ht-under-main":m.value?"":null},[E("div",ni,[(f(!0),v(R,null,j(o.value,x=>(f(),Y(J,{key:x.id,row:x,dim:y(x)},null,8,["row","dim"]))),128)),l(n).rows.length?L("",!0):(f(),v("div",oi,P(l(n).emptyText),1))])],8,ti)),[[an,!l(n).mainShut]]):L("",!0),l(n).sections.length||l(n).frame?ve((f(),v("div",{key:3,"data-sve-ht-frame-body":"","data-sve-ht-under-main":m.value?"":null},[l(n).frame?.template&&i(l(n).frame.template)?(f(),Y(J,{key:0,row:l(n).frame.template,dim:r("template")},null,8,["row","dim"])):L("",!0),l(n).frame&&!l(n).frame.template&&!l(n).sections.length&&!t.value?(f(),v("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":r("")?"":void 0},P(l(n).frameEmptyText),9,ai)):L("",!0),(f(!0),v(R,null,j(a.value,x=>(f(),v("div",Ie({key:x.uid},{ref_for:!0},p(x)),[x.ready?(f(),v(R,{key:0},[(f(!0),v(R,null,j(o.value,O=>(f(),Y(J,{key:O.id,row:O,dim:y(O)},null,8,["row","dim"]))),128)),l(n).rows.length?L("",!0):(f(),v("div",ri,P(l(n).emptyText),1))],64)):(f(),Y(J,{key:1,row:x.row,dim:r("")},null,8,["row","dim"]))],16))),128))],8,si)),[[an,!l(n).frame||!l(n).mainShut]]):L("",!0)],16),l(n).frame?(f(),v(R,{key:1},[l(n).frame.kind==="footer"?(f(),v("div",ii,[(f(!0),v(R,null,j(o.value,x=>(f(),Y(J,{key:x.id,row:x,dim:y(x)},null,8,["row","dim"]))),128)),l(n).rows.length?L("",!0):(f(),v("div",li,P(l(n).emptyText),1))])):i(l(n).frame.footer)?(f(),Y(J,{key:1,row:l(n).frame.footer,dim:r("footer")},null,8,["row","dim"])):L("",!0)],64)):L("",!0)],64)):l(n).rows.length?(f(!0),v(R,{key:4},j(o.value,x=>(f(),Y(J,{key:x.id,row:x,dim:y(x)},null,8,["row","dim"]))),128)):L("",!0)],16,Ur))}},gt=Ke(di,[["__scopeId","data-v-eecd9f12"]]);let yt=null;function ci(e){return yt||(yt=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{pages:[]}).then(t=>Array.isArray(t.pages)?t.pages:[]).catch(()=>[])),yt}let Ye=null;function kt(){Ye?.dismiss(),Ye=null}function ui(e,t,s){kt();const o=t?.getBoundingClientRect?.(),a={x:o?o.left:0,y:o?o.bottom+4:0};ci(e).then(i=>{const r=i.length?i.map(d=>({label:d.title||d.url,onPick:()=>{kt(),s(d.url)}})):[{label:c(e,"component_props_pages_none"),onPick:null}];kt(),Ye=ce(e.document,ut,{items:r,x:a.x,y:a.y,onClose:()=>{Ye=null}})})}const Yn="sve-html-tree-labels";function Wn(){try{const e=globalThis.localStorage?.getItem(Yn);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function hi(e){try{globalThis.localStorage?.setItem(Yn,JSON.stringify(e))}catch{}}function Zn(e){return String(e||"_")}function Jn(e){const t=Wn()[Zn(e)];return t&&typeof t=="object"?{...t}:{}}function pi(e,t,s){const o=s?.[t];return typeof o=="string"&&o.trim()?o.replace(/\s+/g," ").trim():String(e||"").trim()}function fi(e,t,s,o){if(!t)return;const a=Zn(e),i=Wn(),r={...i[a]||{}},d=String(s||"").replace(/\s+/g," ").trim(),m=String(o||"").trim();!d||d===m?delete r[t]:r[t]=d,Object.keys(r).length?i[a]=r:delete i[a],hi(i)}const mi=/^@(media|supports|container|layer|scope)\b/i;function vi(e){const t=String(e||""),s=[];let o=0,a=0;for(;o<t.length;){if(t[o]==="{"&&t[o+1]==="{"){const d=t.indexOf("}}",o+2);o=d===-1?t.length:d+2;continue}if(t[o]==="/"&&t[o+1]==="*"){const d=t.indexOf("*/",o+2);o=d===-1?t.length:d+2;continue}if(t[o]==='"'||t[o]==="'"){const d=t[o];for(o+=1;o<t.length&&t[o]!==d;)o+=t[o]==="\\"?2:1;o+=1;continue}if(t[o]!=="{"){o+=1;continue}let i=1,r=o+1;for(;r<t.length&&i>0;){if(t[r]==="{"&&t[r+1]==="{"){const d=t.indexOf("}}",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==="/"&&t[r+1]==="*"){const d=t.indexOf("*/",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==='"'||t[r]==="'"){const d=t[r];for(r+=1;r<t.length&&t[r]!==d;)r+=t[r]==="\\"?2:1;r+=1;continue}t[r]==="{"?i+=1:t[r]==="}"&&(i-=1),r+=1}s.push({selector:t.slice(a,o).trim(),body:t.slice(o+1,r-1),from:a,to:r,text:t.slice(a,r).trim()}),o=r,a=r}return s}function mn(e){const t=String(e||""),s=new Set,o=new Set,a=new Set;for(const i of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const r of i[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))r&&(s.add(r),s.add(r.replace(/([:./%!#()[\],])/g,"\\$1")));for(const i of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))i[2].trim()&&o.add(i[2].trim());for(const i of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))a.add(i[1].toLowerCase());return{classes:s,ids:o,tags:a}}function vn(e,t){const s=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),o=[...s.matchAll(/\.((?:\\.|[\w-])+)/g)].map(r=>r[1]),a=[...s.matchAll(/#((?:\\.|[\w-])+)/g)].map(r=>r[1]);if(o.length||a.length){const r=d=>d.replace(/\\(.)/g,"$1");return o.every(d=>t.classes.has(d)||t.classes.has(r(d)))&&a.every(d=>t.ids.has(r(d)))}const i=[...s.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(r=>r[2].toLowerCase());return i.length>0&&i.every(r=>t.tags.has(r))}function gi(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function yi(e,t,s){const o=gi(e);if(!o.length)return"keep";const a=o.filter(r=>vn(r,t));return a.length?a.length===o.length&&!o.some(r=>vn(r,s))?"move":"copy":"keep"}function Qn(e,t,s){const o=String(e||""),a=mn(t),i=mn(s),r=[],d=[];let m=0;for(const b of vi(o)){const y=o.slice(b.from,b.to),p=y.match(/^\s*/)[0];if(m=b.to,mi.test(b.selector)){const C=Qn(b.body,t,s);C.move.trim()&&r.push(`${b.selector} {
${C.move.trim()}
}`),C.keep.trim()&&d.push(`${p}${b.selector} {
${C.keep.trim()}
}`);continue}const k=b.selector.startsWith("@")?"keep":yi(b.selector,a,i);if(k==="move"){r.push(b.text);continue}k==="copy"&&r.push(b.text),d.push(y)}return d.push(o.slice(m)),{move:r.join(`

`).trim(),keep:d.join("").replace(/\n{3,}/g,`

`).trim()}}const ki="/!/sve/component";function bi(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let s=null;for(const o of t){if(!o.trim())continue;const a=o.match(/^[ \t]*/)[0].length;s=s===null?a:Math.min(s,a)}return s?t.map(o=>o.slice(s)).join(`
`):t.join(`
`)}function _i(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function Ti(e,t){if(!ps(e))return"";try{return await(await Oo(()=>import("./tw-compile-AWaJHJyk.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(s){return console.error("[sve] component tailwind compile",s),""}}async function xi(e,t){const s=await e.fetch(ki,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":Bt(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!s.ok){const o=new Error(String(s.status));throw o.status=s.status,o}return s.json()}function gn(e,t){const{from:s,to:o}=hs(e,t),a=e.slice(s,o);if(!a.trim())return null;const i=e.slice(0,s)+e.slice(o),r=T("dock:css"),d=Qn(typeof r=="string"?r:"",a,i);return{html:bi(a),css:d.move,keepCss:d.keep,lead:_i(a),from:s,to:o}}function Si(e,t,{onDone:s,onError:o}={}){if(T("dock:is-locked")===!0)return;const a=T("dock:html");if(typeof a!="string"||!t)return;const i=gn(a,t);if(!i)return;const r=ce(e.document,Fo,{heading:c(e,"component_new"),nameLabel:c(e,"component_name"),placeholder:c(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:c(e,"cancel"),saveLabel:c(e,"component_create"),onOk:d=>{r.dismiss(),(async()=>{try{const m=await Ti(e,i.html),b=T("dock:html"),y=typeof b=="string"&&b===a?i:gn(b,t);if(!y)return;const p=await xi(e,{name:d,html:y.html,css:y.css,js:"",tw:m}),k=T("dock:html"),C=k.slice(0,y.from)+y.lead+p.tag+k.slice(y.to);T("dock:set-html",C),y.css.trim()&&T("dock:set-css",y.keepCss),s?.(p)}catch(m){o?.(m)}})()}})}function wi(e,t,s){const o=String(e||"");if(!t||t.kind!=="antlers")return o;const a=String(s||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?Ei(o,t,a):t.tag==="else"||!a?o:o.slice(0,t.from)+`{{ ${t.tag} ${a} }}`+o.slice(t.openTo)}function Et(e,t,s,o){return Fe(e,t,{kind:s,name:o})}function Fe(e,t,s={}){const o=String(e||"");if(!t||t.antlers!=="loop")return o;const a=t.loopKind==="collection"?"collection":"field",i=s.kind??a,r=String(s.name??t.expr??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(r))return o;const d=s.sortDir??t.sortDir??"",m=String(s.sortField??t.sortField??"").trim(),b=String(s.limit??t.limit??"").trim(),y=eo(o,t);if(!y)return o;const p=i===a?t.params:"",k=i==="collection"?$i(r,m,d,b,p):Ci(r,m,d,b,p),C=i==="collection"?"collection":r;return o.slice(0,t.from)+k+o.slice(t.openTo,y.from)+`{{ /${C} }}`+o.slice(y.to)}function $i(e,t,s,o,a){const i=Li(a).replace(/\bsort\s*=\s*["'][^"']*["']/g,"").replace(/\blimit\s*=\s*["']?\d+["']?/g,"").replace(/\s+/g," ").trim(),r=[`collection from="${e}"`];return s==="random"?r.push('sort="random"'):t&&r.push(`sort="${t}${s==="desc"?":desc":":asc"}"`),o&&r.push(`limit="${o}"`),i&&r.push(i),`{{ ${r.join(" ")} }}`}function Ci(e,t,s,o,a){const i=String(a||"").split("|").map(d=>d.trim()).filter(d=>d&&!/^from\s*=/.test(d)&&!/^sort\s*:/.test(d)&&!/^reverse$/.test(d)&&!/^shuffle$/.test(d)&&!/^limit\s*:/.test(d)),r=[e,...i];return s==="random"?r.push("shuffle"):t&&(r.push(`sort:${t}`),s==="desc"&&r.push("reverse")),o&&r.push(`limit:${o}`),`{{ ${r.join(" | ")} }}`}function Li(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function eo(e,t){const o=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return o?{from:t.from+o.index,to:t.from+o.index+o[0].length}:null}function Ei(e,t,s){return Fe(e,t,{name:s})}function Pi(e,t,s){const o=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return o;const a=eo(o,t);if(!a)return o;const r=(o.slice(0,a.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],d=s==="else"?"{{ else }}":"{{ elseif true }}";return`${o.slice(0,a.from)}${d}
${r}${o.slice(a.from)}`}const z=gs("sve-call-values"),je=new Set;let yn=null;const Hi="__sve-html-tree-style";function Ai(e,t,s){if(t||s)return!1;const o=String(T("dock:chrome-kind")||"");if(o==="header"||o==="footer")return!1;const a=Hn(e);return!!a&&a!=="create"&&Xo(e)!==Yo(e)}function to(e){return{sectionLoops:zo(e),sectionsLabel:c(e,"html_tree_sections_slot")}}function Mi(e,t){const s={entry:t,text:"",note:c(e,"html_tree_page_template_note"),openLabel:c(e,"html_tree_open_template"),canOpen:!1,onOpen:null};return Rn(e,{entry:t}).then(o=>{!o||n.pageTemplate?.entry!==t||(n.pageTemplate={...n.pageTemplate,text:c(e,"html_tree_page_template",{name:o.name}),canOpen:!!o.open,onOpen:o.open?a=>Wo(e,a,o.open):null})}),s}function Ii(e,t){const s=t.replace(/^view:/,"");if(!s||T("dock:current-type")!==t){n.usedBy=null,n.templateSections=[];return}n.usedBy?.view!==s&&(n.usedBy=null,Rn(e,{view:s}).then(o=>{if(!o||T("dock:current-type")!==t)return;const a=o.everything?[c(e,"html_tree_used_by_everything")]:o.used_by;n.templateSections=Array.isArray(o.sections_fields)?o.sections_fields:[],n.usedBy={view:s,label:c(e,"html_tree_used_by"),items:a,empty:a.length?"":c(e,"html_tree_used_by_nobody"),hint:a.length?c(e,"html_tree_used_by_hint",{list:a.join(", ")}):""}}))}const q=new Set;let Pt="",Se=!1,bt=null,Ee=!0,Q="",Le=0,no="";const de=new Map,$e=new Set;let U="",oo=!1,D=null,We=null,Ue="",Ze="",Je=0,Ht=null,Ce=[],ge=null,Oe=null,Qe=null,et=null,At=null,be=!1,ye=null,Ve=null,De=null,tt=null,nt=null,Mt=null,me=null;function Z(e){return e.getElementById(Xe)}function Ri(e){Bo(e,Hi,`
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
      ${rn("light")}
      /* How much of a row's own colour its pick takes: a wash, not a fill.
         The row mixes it in below — a mix written up here would read
         --sve-ht-c on the list, where no family is set. */
      --sve-ht-pick-mix: 11%;
      --sve-ht-pick-hover-mix: 18%;
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${rn("dark")}
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
  `)}function X(){const e=T("dock:html");return typeof e=="string"?e:""}function so(e){return!!T("dock:is-open",e)}function Pe(e,{save:t=!1}={}){return Yt()||T("dock:set-html",e)!==!0?!1:(t&&T("dock:save-now"),!0)}function _t(e){const t=T("dock:component-exit-state")||{};if(n.exitOpen=!!t.open,!t.open){n.onExit=null;return}n.exitName=t.name||"",n.exitLabel=c(e,"component_exit"),n.exitTitle=c(e,t.back?"component_exit_back":"component_exit_close"),n.onExit=()=>{T("dock:exit-component"),I(e)}}function ao(e,t){const s=ts(e);if(!s||t.type!==s)return"";const o=ns(t[s]);return o&&os(e,o)?.section_type||""}const _e=[];let Tt=!1,It=!1;function xt(e,t){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(t,{timeout:2e3});return}e.setTimeout(t,200)}function Fi(e,t){for(const s of t){const o=s.type;!o||de.has(o)||$e.has(o)||_e.includes(o)||_e.push(o)}Nt.htmlTreePrefetchArmed&&Xt(e)}function El(e){Nt.htmlTreePrefetchArmed=!0,Xt(e)}function Xt(e){if(Tt||!_e.length)return;Tt=!0;const t=()=>{const s=_e.shift();if(!s){Tt=!1;return}if(de.has(s)||$e.has(s)){xt(e,t);return}$e.add(s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(s)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(o=>o.ok?o.json():null).then(o=>{typeof o?.html=="string"&&(de.set(s,o.html),It&&(It=!1,I(e)))}).catch(()=>{}).finally(()=>{$e.delete(s),xt(e,t)})};xt(e,t)}function Yt(){return!!U}function Oi(e){const t=new Map,s=lt(e);if(!s)return t;for(const o of s.querySelectorAll("[data-sid]")){const a=o.getAttribute("data-sid");a&&!t.has(a)&&t.set(a,o.tagName.toLowerCase())}return t}function pt(e,t){const s=dt(e)||"page_sections",o=Oi(e),a=[];for(const i of jt(t)||[]){const r=Vt(i.values),d=r&&typeof r=="object"?r[s]:null;if(Array.isArray(d)){d.forEach(m=>{if(!m||typeof m!="object"||Array.isArray(m)||typeof m.type!="string")return;const b=[m._visual_id,m.id,m._id].filter(x=>typeof x=="string"&&x!=="");if(!b.length)return;const y=ao(e,m)||m.type,p=typeof m._sve_label=="string"?m._sve_label.trim():"",k=b.map(x=>o.get(x)).find(Boolean)||"section",C=Jn(m.type)[`0:${k}`];a.push({uid:b[0],ids:b,type:m.type,tag:k,label:p||(typeof C=="string"&&C.trim()?C.trim():"")||ct(e,y)?.display||Be(y)||y,svg:Bn(k,"",null).svg||we.section,cat:Mn(k),enabled:m.enabled!==!1,static:aa(e,y)})});break}}return a}function Di(e,t,s){if(!s.length)return"";const o=T("dock:current-type")||"",a=T("dock:current-uid"),i=!!T("dock:component-exit-state")?.open;if(a){const r=Kt(a,t),d=s.find(m=>m.ids.some(b=>r.includes(b)));if(d&&(i||d.type===o))return d.uid}return s.find(r=>r.type===o)?.uid||""}function Bi(e,t,s,o){const a=t.find(x=>x.uid===s),i=T("dock:component-src"),r=T("dock:type-stack")||[];if(!a||!i||!r.length)return null;const d=r.map(x=>x.type).filter(x=>!de.get(x));if(d.length)return Ni(e,d),null;const m=[],b=new Set,y=new Set;let p=x=>m.push(...x),k=null,C=0;for(let x=0;x<r.length;x+=1){const O=x+1<r.length?r[x+1].src:i,V=B=>({...B,id:`ctx${x}:${B.id}`,path:`ctx${x}/${B.path}`,ctxLevel:x,children:B.children.map(V)}),_=ht(de.get(r[x].type)).map(V),h=[],g=(B,F)=>{for(const A of B){if(A.kind==="component"&&A.src===O)return h.push(...F,A),A;const K=g(A.children,[...F,A]);if(K)return K}return null};if(k=O?g(_,[]):null,!k)return null;const w=new Set(h.map(B=>B.id)),M=(B,F)=>{for(const A of B)A.children.length&&(w.has(A.id)?q.has(A.path):ro(A,F))&&b.add(A.id),M(A.children,F+1)};M(_,C),p(_),y.add(k.id),C+=h.length,p=(B=>F=>{B.children=F})(k)}for(const x of io(o))b.add(x);return q.has(k.path)&&b.add(k.id),k.children=o,{tree:m,folds:b,hostId:k.id,hostIds:y,levels:r.length,rootId:m.find(x=>!x.kind)?.id||"",label:a.label,svg:a.svg,cat:a.cat}}function Ni(e,t){for(const s of t)!_e.includes(s)&&!$e.has(s)&&_e.push(s);It=!0,Xt(e)}function ji(e,t,s){const o=T("dock:component-exit-state");if(o?.open)return Be(o.name)||o.name||"";if(s)return t.find(i=>i.uid===s)?.label||"";const a=T("dock:current-type")||"";return String(a).startsWith("view:")?"":ct(e,a)?.display||Be(a)||""}function ft(e,t,s,o,a){const i=s.find(d=>d.uid===o);if(!i||o===a)return;q.clear(),D=null,Ee=!1,ne(),qe(),Q=o,no=X(),U=de.get(i.type)||"",U&&(D=ot(ht(U))||null),oo=(T("dock:current-type")||"")===i.type,e.clearTimeout(Le),Le=e.setTimeout(()=>{Q="",Se=!1,I(e)},4e3),I(e);const r=()=>as(i.uid,t,e,{clampToSection:!0});es(i.uid,t,e,r),ue({source:te,type:ee.SVE_ACTIVATE,ids:i.ids},e),e.setTimeout(()=>I(e),0)}function Rt(e,t){if(!t)return!1;for(const s of e||[])if(s.id===t||Rt(s.children,t))return!0;return!1}function ot(e){for(const t of e||[]){if(!t.kind)return t.id;const s=ot(t.children);if(s)return s}return""}function ro(e,t){const s=t===0||e.path===Ze;return q.has(e.path)?s:!s}function io(e){const t=new Set,s=(o,a)=>{for(const i of o)i.children.length&&ro(i,a)&&t.add(i.id),s(i.children,a+1)};return s(e,0),t}function I(e){const t=e.document,o=Z(t)?.querySelector("[data-sve-html-tree-list]");if(!o)return;Ri(t),ms(e);const a=X();U&&U===a&&(U=""),T("dock:chrome-kind")&&(U="");const i=U||a,r=ht(i,to(e));Ce=r,Ze="";const d=T("dock:current-type")||"",m=Jn(d),b=qo(e,t),p=!!(T("dock:component-exit-state")||{}).open,k=pt(e,t);d&&a&&!U&&de.set(d,a),Fi(e,k);const C=Di(e,t,k);if(Ai(e,b,p)){const u=Hn(e);Ce=[],n.rows=[],n.sections=[],n.frame=null,n.pageBuilder=!1,n.layoutFile=!1,n.usedBy=null,n.emptyText="",n.pageTemplate?.entry!==u&&(n.pageTemplate=Mi(e,u)),n.onRefresh=()=>I(e),n.onSection=null,_t(e),Re(o,gt),St(e,[]);return}n.pageTemplate=null,Ii(e,String(T("dock:collection-view")||""));const x=String(T("dock:chrome-kind")||"");if(Go(e),b&&!k.length&&!x){Ce=[],n.rows=[],n.sections=[],n.frame=bn(e,[],!1,!1,"",!0),n.frameEmptyText=c(e,"html_tree_frame_no_sections"),n.pageBuilder=!0,n.layoutFile=!1,n.emptyText=c(e,"html_tree_empty"),n.canEdit=!T("dock:is-locked"),n.look=ln(e),n.onRefresh=()=>I(e),n.onSection=null,kn(e,""),_t(e),Re(o,gt),St(e,[]);return}n.pageBuilder=b;const O=`${d}|${C}`;let V=!1;O!==Pt&&(Pt=O,q.clear(),bt!==null&&i!==bt?V=!0:Se=i),(V||Se!==!1&&i!==Se)&&(Se=!1,q.clear(),D=ot(r)||null),bt=i,Q&&(Q===C||!k.length)&&(oo||i!==no)&&(e.clearTimeout(Le),Q="",Se=!1,Rt(r,D)||(q.clear(),D=ot(r)||null));const _=k.some(u=>u.uid===Q)?Q:"",h=Ee?"":_||C,g=p?Bi(e,k,h,r):null,w=!!(_||C),M=w||p?"":String(T("dock:chrome-kind")||""),F=b&&(!d&&!w||M==="main"&&T("dock:on-empty-page")===!0),A=F||M==="template"?"":M;n.layoutFile=A==="main",A!=="main"&&(Ue="");const K=A==="main"?_n(r,"main"):null,oe=K?st(r,u=>u.tag==="body"&&Rt(u.children,K.id)):null;Ze=oe?oe.path:"",K&&(ze((oe||K).path),Ue!==O&&(ze(K.path),q.add(K.path)));const He=A==="header"||A==="footer"?st(r,u=>i.slice(u.from,u.openTo).includes(`data-sve-chrome="${A}"`))||_n(r,A):null;He&&ze(He.path);const N=F||!(A==="main"?!!K:A==="header"||A==="footer"?!!He:!0)?[]:g?dn(g.tree,n.query?new Set:g.folds):dn(r,n.query?new Set:io(r));!i.trim()&&!so(t)?n.emptyText=c(e,"html_tree_need_dock"):n.emptyText=c(e,"html_tree_empty"),n.slotText=c(e,"antlers_drop_here"),n.dataTitle=c(e,"data_vars_title"),n.pageTitle=c(e,"component_props_page"),n.renameTitle=c(e,"html_tree_rename"),n.tagTitle=c(e,"tw_tag"),n.hideTitle=c(e,"html_tree_hide"),n.showTitle=c(e,"html_tree_show"),n.duplicateTitle=c(e,"html_tree_duplicate"),n.deleteTitle=c(e,"html_tree_delete"),n.videoHoldTitle=c(e,"html_tree_video_hold"),n.videoPlayTitle=c(e,"html_tree_video_play"),n.lockedTitle=c(e,"html_tree_locked"),n.searchEmpty=c(e,"html_tree_search_empty"),n.canEdit=!T("dock:is-locked"),n.look=ln(e),n.onQuery=()=>I(e),_t(e),n.inComponent=p,n.onContextRow=u=>{if(!g||u===g.hostId)return;const S=N.find(H=>H.id===u)?.ctxLevel??g.levels-1;T("dock:exit-component",g.levels-S),I(e)},n.onSelect=u=>{const S=N.find(H=>H.id===u);S&&Dn(e,S.path)||it(e,u,N)},n.onTwist=u=>{const S=N.find(H=>H.id===u)?.path;S&&(q.has(S)?q.delete(S):q.add(S),I(e))},n.onTagChange=(u,S)=>{const H=n.rows.find(re=>re.id===S);H&&!Yt()&&vs(e,u.currentTarget,H)},n.onRename=u=>Ui(e,u),n.onRenameCommit=()=>xn(e,!0),n.onRenameCancel=()=>xn(e,!1),n.onHide=u=>Yi(e,u),n.onVideoHold=u=>Xi(e,u),n.onDuplicate=u=>Wi(e,u),n.onDelete=u=>Ji(e,u),n.onPointerDown=(u,S)=>sl(e,u,S),n.onSectionPointerDown=(u,S)=>il(e,u,S),n.onContext=(u,S)=>nl(e,u,S),n.onInspectCommit=u=>fl(e,u),n.onPropValue=(u,S,H)=>$n(e,u,S,H),n.onPropPage=(u,S)=>ui(e,u,H=>$n(e,S,H,!1)),n.onLoopKind=u=>ml(e,u),n.onAddBranch=u=>vl(e,u),n.onLoopSortField=u=>{const S=rt(),H=String(u||"").trim();if(!S)return;const re=me?.id===S.id?me.dir:"",ie=S.sortDir||re||"asc";me=null,ke(e,(xe,Ae)=>Fe(xe,Ae,{sortField:H,sortDir:ie}))},n.onLoopSortDir=u=>{const S=rt(),H=String(u||"");if(S){if((H==="asc"||H==="desc")&&!S.sortField){me={id:S.id,dir:H},Ot(e,S);return}me=null,ke(e,(re,ie)=>Fe(re,ie,{sortDir:H,sortField:H==="asc"||H==="desc"?ie.sortField:""}))}},n.onLoopLimit=u=>ke(e,(S,H)=>Fe(S,H,{limit:String(u||"").replace(/\D/g,"")})),n.onPropHost=u=>u?z.mount(u):z.unmount(),n.onInspectData=(u,S)=>{T("dock:data-menu",{anchor:u,at:N.find(H=>H.id===D)?.from,onPick:H=>S(String(H?.var||"").trim())})};const Jt=N.find(u=>!u.kind)?.id,Qt=p?"":ji(e,k,h),he=h&&!p?k.find(u=>u.uid===h):null,vo=An(e,String(T("dock:current-type")||""));let go=0;const se=A==="header"||A==="footer"?A:"",Te=He?He.id:"",pe=K&&N.find(u=>u.id===K.id)||null,en=oe&&N.find(u=>u.id===oe.id)||null,ae=en||pe||Te&&N.find(u=>u.id===Te)||null,tn=ae?Ki(N,ae):-1;if(ae&&!N.slice(N.indexOf(ae),tn).some(u=>u.id===D)&&(D=ae.id),n.selectFrom){const u=N.find(S=>S.from===n.selectFrom.at&&(!S.kind||S.kind==="sections"));u?(D=u.id,n.selectFrom=null):--n.selectFrom.left<=0&&(n.selectFrom=null)}const nn=n.layoutFile?Vi(e):null;n.rows=N.map(u=>{const S=nn&&u.kind==="component"&&nn.get(u.src)||"",H=u.tag==="body"&&!u.kind,re=S?{svg:we[S]}:Bn(u.tag,u.kind,u.antlers),ie=u.tag==="video"&&!u.kind?go++:-1,xe=!!g&&u.id===g.rootId,Ae=u.id===Jt&&Qt?Qt:xe?g.label:u.klass,Ge=u.id===Jt;return{...u,tag:S||u.tag,frameCall:S,fixed:!!S||H,base:Ae,name:se&&u.id===Te?c(e,`html_tree_frame_${se}`):u===pe?c(e,"html_tree_frame_main"):Ge&&he?Ae:pi(Ae,u.path,m),current:u.id===D,letter:xe?"":re.letter||"",svg:se&&u.id===Te?we[se]:u===pe?we.main:Ge&&he?he.svg:xe?g.svg:re.svg||"",frame:se&&u.id===Te?se:u===pe?"main":"",cat:se&&u.id===Te?se:u===pe||H?"main":xe?g.cat:S||Mn(u.tag,u.kind,u.antlers),context:g?g.hostIds.has(u.id)?"host":u.id.startsWith("ctx")?"dim":"":"",sectionRoot:Ge&&he?he.uid:"",fieldsIcon:!!(Ge&&he&&!he.static),videoNth:ie,videoHeld:ie>=0&&vo.has(ie)}}),Uo(e);const mt=[];for(const u of n.rows)mt.length=u.depth,u.guides=mt.slice(),mt[u.depth]=u.cat;if(ae){const u=N.indexOf(ae),S=ae.depth;n.rows=n.rows.slice(u,tn).map(H=>({...H,depth:H.depth-S,guides:H.guides.slice(S)})),pe&&Ue!==O&&(Ue=O,e.setTimeout(()=>it(e,pe.id,N),0))}n.sections=b&&(w||A||F)?k.map(u=>{const S=!!h&&u.uid===h;return{...u,current:S,ready:S&&(!_||!!U),row:{id:`sec:${u.uid}`,section:u.uid,tag:u.tag,name:u.label,kind:"",svg:u.svg,cat:u.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:S,hidden:!u.enabled}}}):[],n.frame=bn(e,k,w,p,A,!1,!!en),n.frameEmptyText=c(e,"html_tree_frame_no_sections"),kn(e,A),n.onSection=u=>{be||(Ft(e),ft(e,t,k,u,h))},n.onRefresh=()=>I(e),Ot(e,n.rows.find(u=>u.id===D)),Re(o,gt),St(e,r)}function kn(e,t){n.frameOpenTitle=c(e,"html_tree_frame_open"),n.frameMainTitle=c(e,"html_tree_frame_main_open"),n.frameTemplateTitle=c(e,"html_tree_frame_template_open"),n.frameFieldsTitle=c(e,"html_tree_frame_fields"),n.onFrame=s=>{t===s?qi(e,s):Tn(e,s)},n.onFrameEnter=s=>Tn(e,s),n.onFrameFields=s=>ds(e,Zo(e,s),c(e,`html_tree_frame_${s}`)),n.onFrameTwist=()=>{n.mainShut=!n.mainShut}}function bn(e,t,s,o,a,i=!1,r=!1){if(!a&&!i||r)return null;const d=y=>({id:`frame:${y}`,frame:y,synthetic:!0,tag:y,name:c(e,`html_tree_frame_${y}`),kind:"",svg:we[y]||"",cat:y,letter:"",depth:0,hasChildren:y==="main"&&(t.length>0||a==="template"),shut:y!=="main",current:!1,hidden:!1}),m={kind:a,header:d("header"),main:d("main"),footer:d("footer"),template:null},b=a&&a!=="template"?String(T("dock:collection-view")||""):"";return b&&(m.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:ct(e,b)?.display||Be(b.replace(/^view:/,"")),kind:"",svg:we.section,cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),m}function _n(e,t){return st(e,s=>s.tag===t)}function st(e,t){for(const s of e||[]){if(!s.kind&&t(s))return s;const o=st(s.children,t);if(o)return o}return null}function Vi(e){const t=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},s=new Map;for(const o of["header","footer"]){const a=ys(t[o]?.type);a&&s.set(a,o)}return s}function Ki(e,t){let s=e.indexOf(t)+1;for(;s<e.length&&e[s].depth>t.depth;)s+=1;return s}function qi(e,t){const s=lt(e);(t==="main"||t==="template"?s?.querySelector("main"):s?.querySelector(`[data-sve-chrome="${t}"]`))?.scrollIntoView({behavior:"smooth",block:"start"})}function Ft(e){const t=String(T("dock:chrome-open",e.document)||"");return t!=="header"&&t!=="footer"?!1:(Qo(e),ue({source:te,type:ee.SVE_FORCE_EXIT_CHROME},e),!0)}function Gi(e){e.clearTimeout(Le),Q="",U="",q.clear(),D=null,Ee=!1,ne(),qe()}function Tn(e,t){if(e.document,String(T("dock:chrome-kind")||"")===t)return;if(Gi(e),t==="main"){Ft(e),T("dock:open-file",cs);return}if(t==="template"){const i=String(T("dock:collection-view")||"");i&&(Ft(e),T("dock:open-file",i));return}if(t!=="header"&&t!=="footer")return;const s=lt(e)?.querySelector(`[data-sve-chrome="${t}"]`);s?(s.scrollIntoView({block:"nearest"}),s.dispatchEvent(new s.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:te,type:ee.OPEN_CHROME,kind:t},e.location.origin);const o=Date.now(),a=async()=>{if(String(T("dock:chrome-kind")||"")!==t){Date.now()-o<3e4&&e.setTimeout(a,250);return}await(T("dock:load-settled")||null),mo(e)};e.setTimeout(a,250)}function St(e,t){Z(e.document)&&lo(e,t)}function lo(e,t){const s=t[0],o=!!T("dock:component-src"),a=o?"":T("dock:current-uid")||"";ue({source:te,type:ee.SVE_HTML_PICK,on:!0,uid:a,uids:a?Kt(a,e.document):[],all:o,tag:s?.tag||"",klass:s?.klass||"",nodes:Hs(t)},e)}function ze(e){if(!e)return;const t=(s,o)=>{for(const a of s||[]){if(a.path===e)return!0;if(t(a.children,o+1))return o===0||a.path===Ze?q.delete(a.path):q.add(a.path),!0}return!1};t(Ce,0)}function Ui(e,t){if(be)return;const s=n.rows.find(o=>o.id===t);!s||s.kind||(D=t,n.rows.forEach(o=>{o.current=o.id===t}),n.editingId=t,n.draft=s.name,e.setTimeout(()=>{const o=Z(e.document)?.querySelector("[data-sve-ht-rename]");o?.focus(),o?.select()},0))}function xn(e,t){const s=n.editingId;if(!s)return;const o=n.rows.find(a=>a.id===s);n.editingId=null,t&&o&&(o.sectionRoot?zi(e,o.sectionRoot,n.draft):fi(T("dock:current-type")||"",o.path,n.draft,o.base||o.klass)),n.draft="",I(e)}function zi(e,t,s){const o=dt(e)||"page_sections",a=String(s||"").replace(/\s+/g," ").trim();for(const i of jt(e.document)||[]){const r=Vt(i.values),d=r&&typeof r=="object"?r[o]:null;if(!Array.isArray(d))continue;const m=d.findIndex(k=>k&&typeof k=="object"&&[k._visual_id,k.id,k._id].includes(t));if(m===-1)continue;const b=ao(e,d[m])||d[m].type,y=ct(e,b)?.display||Be(b)||b,p=JSON.parse(JSON.stringify(d));return p[m]={...p[m]},!a||a===y?delete p[m]._sve_label:p[m]._sve_label=a,i.setFieldValue(o,p),!0}return!1}function Xi(e,t){const s=n.rows.find(d=>d.id===t);if(!s||!(s.videoNth>=0))return;const o=String(T("dock:current-type")||""),a=An(e,o),i=!a.has(s.videoNth);i?a.add(s.videoNth):a.delete(s.videoNth);const r=String(T("dock:current-uid")||"");Jo(e,o,a),ue({source:te,type:ee.SVE_VIDEO_HOLD,uid:r,uids:r?Kt(r,e.document):[],nth:s.videoNth,on:i},e),I(e)}function Wt(e){return!!n.rows.find(t=>t.id===e)?.fixed}function Yi(e,t){Wt(t)||at(e,t,Es)}function Wi(e,t){if(Wt(t))return;const s=n.rows.find(o=>o.id===t)?.sectionRoot;if(s){e.postMessage({source:te,type:ee.DUPLICATE_ROW,uid:s},e.location.origin);return}at(e,t,Ps)}function co(e,t){Fn(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const s=e.document;rs({uid:t},s,e)})}function Zi(e,t,s){Q===s&&(e.clearTimeout(Le),Q="",U=""),D=null,Ee=!1,Pt="";const o=pt(e,t),a=o.find(i=>i.uid!==s)||o[0];a?ft(e,t,o,a.uid,""):(U="",n.rows=[],n.sections=[],n.frame=null,n.pageBuilder=!0,I(e)),e.setTimeout(()=>{Z(e.document)&&I(e)},0)}In("row:removed",({uid:e,parentPath:t,doc:s,win:o})=>{t!==dt(o)||!Z(o.document)||Zi(o,s,e)});function Ji(e,t){if(Wt(t))return;const s=n.sections?.find(a=>a.row?.id===t),o=s?s.row?.section||s.uid:n.rows.find(a=>a.id===t)?.sectionRoot;if(o){co(e,o);return}if(n.rows.find(a=>a.id===t)?.kind==="sections"){Fn(e,{titleKey:"html_tree_sections_remove_title",bodyKey:"html_tree_sections_remove_body",confirmKey:"html_tree_sections_remove_confirm"},()=>at(e,t,cn));return}at(e,t,cn)}function at(e,t,s){if(T("dock:is-locked"))return;const o=X(),a=n.rows.find(r=>r.id===t);if(!a)return;const i=s(o,a);i!==o&&Pe(i)}function ne(){ye?.dismiss(),ye=null}const Qi='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',el='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>';function uo(e,t){const s=n.sections?.find(m=>m.uid===t),o=s?.type||"";if(!o||!Gn(e))return[];const a=s.label||o,i=ra(e,o),r=()=>e.Statamic?.$toast?.error(c(e,"section_update_failed")),d=[{label:c(e,"static_section_insertable"),icon:i?el:Qi,onPick:()=>{ne(),hn(e,{handle:o,hidden:!i}).then(()=>{e.Statamic?.$toast?.success(c(e,i?"section_shown_to_editors":"section_hidden_from_editors",{name:a})),Ct(e)}).catch(r)}}];return s.static&&d.push({label:c(e,"section_add_fields"),onPick:()=>{ne(),hn(e,{handle:o,fields:!0}).then(()=>{e.Statamic?.$toast?.success(c(e,"section_fields_added",{name:a})),Ct(e),I(e),On(e,o)}).catch(r)}}),d}function tl(e,t,s){const o=s.row?.section||s.uid;o&&(ye=ce(e.document,ut,{items:[...uo(e,o),{label:c(e,"html_tree_remove_section"),danger:!0,onPick:()=>{ne(),co(e,o)}}],x:t.clientX,y:t.clientY,onClose:()=>{ye=null}}))}function nl(e,t,s){ne();const o=n.sections?.find(d=>d.row?.id===s);if(o){tl(e,t,o);return}const a=n.rows.find(d=>d.id===s);if(!a)return;it(e,s,n.rows);const i={x:t.clientX,y:t.clientY},r=d=>{d.length&&(ye?.dismiss(),ye=ce(e.document,ut,{items:d,x:i.x,y:i.y,onClose:()=>{ye=null}}))};if(a.kind==="component"){ol(e,a,r);return}a.kind==="slot"||a.kind==="sections"||n.canEdit&&r([...a.sectionRoot?uo(e,a.sectionRoot):[],{label:c(e,"component_make"),onPick:()=>{ne(),Si(e,a,{onDone:()=>I(e),onError:d=>{e.alert(d?.status===409?c(e,"component_exists"):c(e,"component_failed"))}})}}])}const Sn=(e,t)=>{ne(),T("dock:open-template",t)};function ol(e,t,s){if(!bs(t.src)){s([{label:c(e,"component_open_named",{name:t.name||t.src}),onPick:()=>Sn(e,`view:partials/${t.src}`)}]);return}s([{label:c(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(o=>o.ok?o.json():{items:[]}).then(o=>{const a=Array.isArray(o.items)?o.items:[];s(a.length?a.map(i=>({label:c(e,"component_open_named",{name:i.label}),onPick:()=>Sn(e,i.type)})):[{label:c(e,"component_none"),onPick:null}])}).catch(()=>s([{label:c(e,"component_none"),onPick:null}]))}function sl(e,t,s){if(t.button!==0||T("dock:is-locked")||n.editingId||t.target?.closest?.("button, input"))return;qe(),ge=s,Oe={x:t.clientX,y:t.clientY},Qe=t.currentTarget,et=t.pointerId;const o=i=>al(e,i),a=i=>rl(e,i);At=()=>{e.document.removeEventListener("pointermove",o,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),At=null},e.document.addEventListener("pointermove",o,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function al(e,t){if(!ge||!Oe)return;const s=t.clientX-Oe.x,o=t.clientY-Oe.y;if(!n.dragging&&s*s+o*o<25)return;if(!n.dragging){n.dragging=!0;try{Qe?.setPointerCapture?.(et)}catch{}}t.preventDefault();const a=e.document.elementFromPoint(t.clientX,t.clientY),i=a?.closest?.("[data-sve-ht-slot]");if(i){const p=i.getAttribute("data-sve-ht-id");if(p&&p!==ge){n.dropId=p,n.dropPlace="inside";return}}const r=a?.closest?.("[data-sve-ht-row]"),d=r?.getAttribute("data-sve-ht-id");if(!d||d===ge){n.dropId=null,n.dropPlace=null;return}const m=n.rows.find(p=>p.id===d),b=n.rows.find(p=>p.id===ge);if(!m||m.context||b&&m.path.startsWith(`${b.path}/`)){n.dropId=null,n.dropPlace=null;return}const y=r.getBoundingClientRect();n.dropId=d,n.dropPlace=Cs(t.clientY-y.top,y.height,!jn(m.tag)&&!Nn(m))}function rl(e,t){const s=ge,o=n.dropId,a=n.dropPlace||"after",i=n.dragging;if(qe(),i&&(be=!0,e.setTimeout(()=>{be=!1},0)),!i||T("dock:is-locked")||!s||!o||s===o)return;t?.preventDefault?.();const r=X(),d=Ls(r,Ce,s,o,a);d!==r&&Pe(d)}function qe(){try{Qe?.releasePointerCapture?.(et)}catch{}At?.(),ge=null,Oe=null,Qe=null,et=null,n.dragging=!1,n.dropId=null,n.dropPlace=null}function il(e,t,s){if(t.button!==0||!s||n.editingId||t.target?.closest?.("button, input"))return;ho(),Ve=s,De={x:t.clientX,y:t.clientY},tt=t.currentTarget,nt=t.pointerId;const o=i=>ll(e,i),a=i=>dl(e,i);Mt=()=>{e.document.removeEventListener("pointermove",o,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),Mt=null},e.document.addEventListener("pointermove",o,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function ll(e,t){if(!Ve||!De)return;const s=t.clientX-De.x,o=t.clientY-De.y;if(!n.dragging&&s*s+o*o<25)return;if(!n.dragging){n.dragging=!0;try{tt?.setPointerCapture?.(nt)}catch{}}t.preventDefault();const i=e.document.elementFromPoint(t.clientX,t.clientY)?.closest?.("[data-sve-ht-sec-uid]"),r=i?.getAttribute("data-sve-ht-sec-uid")||"";if(!r||r===Ve){n.sectionDrop=null;return}const d=i.getBoundingClientRect();n.sectionDrop={uid:r,place:t.clientY-d.top<d.height/2?"before":"after"}}function dl(e,t){const s=Ve,o=n.sectionDrop,a=n.dragging;ho(),a&&(be=!0,e.setTimeout(()=>{be=!1},0)),!(!a||!s||!o?.uid||o.uid===s)&&(t?.preventDefault?.(),cl(e,s,o.uid,o.place))}function ho(){try{tt?.releasePointerCapture?.(nt)}catch{}Mt?.(),Ve=null,De=null,tt=null,nt=null,n.dragging=!1,n.sectionDrop=null}function cl(e,t,s,o){const a=dt(e)||"page_sections";for(const i of jt(e.document)||[]){const r=Vt(i.values),d=r&&typeof r=="object"?r[a]:null;if(!Array.isArray(d))continue;const m=k=>d.findIndex(C=>C&&typeof C=="object"&&[C._visual_id,C.id,C._id].includes(k)),b=m(t),y=m(s);if(b===-1||y===-1||b===y)return!1;let p=o==="before"?y:y+1;return b<p&&(p-=1),p===b?!1:(e.postMessage({source:te,type:ee.MOVE,uid:t,toIndex:p},e.location.origin),e.setTimeout(()=>I(e),60),!0)}return!1}function po(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function Ot(e,t){if(t?.kind==="component"){ul(e,t);return}if(W.callOpen&&(W.callOpen=!1,W.callStore=null,z.forget(),Gt(e)),t?.kind!=="antlers"){n.inspect=null;return}const s=t.id;if(t.tag==="else"){n.inspect={key:s,title:c(e,"antlers_condition"),mode:"note",note:c(e,"antlers_else_note")};return}if(t.antlers==="loop"){const o=t.loopKind==="collection",a=me?.id===t.id?me.dir:"",i=t.sortDir||a;n.inspect={key:s,title:c(e,"antlers_loop"),mode:"loop",loopKind:o?"collection":"field",kinds:[{id:"field",label:c(e,"antlers_loop_field")},{id:"collection",label:c(e,"antlers_loop_collection")}],collections:po(e),value:t.expr||"",placeholder:c(e,o?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:c(e,"antlers_sort"),dir:i,needsField:i==="asc"||i==="desc",field:t.sortField||"",pickable:!o,placeholder:c(e,o?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:c(e,"antlers_sort_none")},{id:"asc",label:c(e,"antlers_sort_asc")},{id:"desc",label:c(e,"antlers_sort_desc")},{id:"random",label:c(e,"antlers_sort_random")}]},limit:{title:c(e,"antlers_limit"),value:t.limit||"",placeholder:c(e,"antlers_limit_placeholder")},branches:[]};return}n.inspect={key:s,title:c(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:c(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:c(e,"antlers_add_elseif")},{id:"else",label:c(e,"antlers_add_else")}]}}function ul(e,t){if(!_s(e)){n.inspect=null;return}if(!t.src)return;const s=t.id;if(n.inspect={key:s,title:c(e,"component_props_values"),mode:"note",note:c(e,"code_dock_loading")},Ts()){const o={},a={},i=new Map;for(const[r,d]of xs(X().slice(t.from,t.to))){const m=Ss(r);m&&(r!==m||!i.has(m))&&i.set(m,d)}for(const[r,d]of i)d.bound?a[r]=d.value:o[r]=d.value;yn!==s&&(yn=s,je.clear());for(const r of je)r in a||(a[r]="");n.inspect=null,W.callOpen=!0,W.title=W.title||c(e,"component_props"),W.callTitle=t.klass||t.name||t.src,W.callStore=z.ui,z.ui.canBind=!0,z.ui.dataTitle=c(e,"data_vars_title"),z.ui.exprPlaceholder=c(e,"component_props_expr"),z.ui.onToggleBind=(r,d)=>pl(e,r,d),z.ui.onExpr=(r,d)=>wn(e,r,d),z.ui.onPickData=(r,d)=>T("dock:data-menu",{anchor:d,at:t.from,onPick:m=>wn(e,r,String(m?.var||"").trim())}),z.load(e,{key:`${t.src}::${s}`,src:t.src,params:o,bindings:a,readOnly:T("dock:is-locked")===!0}),z.watch(e,{src:t.src,write:r=>hl(e,r,a)}),Gt(e);return}ws(e,t.src).then(o=>{if(n.inspect?.key===s){if(!o.length){n.inspect={key:s,title:c(e,"component_props_values"),mode:"note",note:c(e,"component_props_values_none")};return}n.inspect={key:s,title:c(e,"component_props_values"),mode:"props",inheritLabel:c(e,"component_props_inherit"),rows:$s(o,X().slice(t.from,t.to))}}})}function hl(e,t,s={}){const o=n.rows.find(r=>r.id===D);if(o?.kind!=="component"||T("dock:is-locked"))return;let a=X(),i=o.to;for(const[r,d]of Object.entries(t||{})){if(r in s)continue;const m=a.length,b=Ut(a,{from:o.from,to:i},r,d);b!==a&&(i+=b.length-m,a=b)}a!==X()&&(Pe(a,{save:!0}),I(e))}function pl(e,t,s){s?je.add(t):je.delete(t),fo(e,t,"",s),I(e)}function wn(e,t,s){je.add(t),fo(e,t,s,!0),I(e)}function fo(e,t,s,o){const a=n.rows.find(d=>d.id===D);if(a?.kind!=="component"||T("dock:is-locked"))return;const i=X(),r=Ut(i,a,t,s,{bound:o});r!==i&&Pe(r,{save:!0})}function rt(){const e=n.rows.find(t=>t.id===D);return e?.kind==="antlers"&&!T("dock:is-locked")?e:null}function ke(e,t){const s=rt();if(!s)return;const o=X(),a=t(o,s);a!==o&&(Pe(a),I(e))}function $n(e,t,s,o){const a=n.rows.find(d=>d.id===D);if(a?.kind!=="component"||T("dock:is-locked"))return;const i=X(),r=Ut(i,a,t,s,{bound:o});r!==i&&(Pe(r,{save:!0}),I(e))}function fl(e,t){ke(e,(s,o)=>o.antlers==="loop"?Et(s,o,o.loopKind==="collection"?"collection":"field",t):wi(s,o,t))}function ml(e,t){const s=rt();if(!s||s.antlers!=="loop")return;const o=s.loopKind==="collection"?"collection":"field";if(t!==o){if(t==="collection"){const a=po(e)[0]?.handle;if(!a)return;ke(e,(i,r)=>Et(i,r,"collection",a));return}ke(e,(a,i)=>Et(a,i,"field",i.handle||"items"))}}function vl(e,t){ke(e,(s,o)=>Pi(s,o,t))}function gl(e,t){if(!e||!t||Nn(t)||jn(t.tag))return null;const s=ks(e,t);if(s<t.openTo)return null;const o=e.lastIndexOf(`
`,s-1)+1;return e.slice(o,s).trim()===""&&o>t.openTo?o-1:s}function it(e,t,s){if(be)return;const o=(s||n.rows).find(a=>a.id===t);o&&(D=t,n.rows.forEach(a=>{a.current=a.id===t}),Ot(e,o),!Yt()&&(T("dock:reveal-html",{from:o.from,to:o.to,caret:gl(X(),o)}),T("dock:tw-follow"),ue({source:te,type:ee.SVE_HTML_PICK_FOCUS,path:o.path},e)))}function yl(e,t){if(!t)return"";const s=[],o=(a,i)=>{for(const r of a||[]){const d=i||r.path===e;r.kind==="component"&&r.src===t&&s.push({path:r.path,inside:d}),o(r.children,d)}};return o(Ce,!1),(s.find(a=>a.inside)||s[0])?.path||""}function kl(e,t){if(!t||!Z(e.document))return;Ee=!1,ze(t),I(e);const s=n.rows.find(o=>o.path===t);s&&(it(e,s.id,n.rows),e.setTimeout(()=>{Z(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function Dt(e){if(We)return;const t=()=>{n.editingId||n.dragging||(e.clearTimeout(Je),Je=e.setTimeout(()=>{Z(e.document)&&I(e)},80))},s=()=>{if(t(),T("dock:on-empty-page")===!0){const o=pt(e,e.document);o[0]&&ft(e,e.document,o,o[0].uid,"")}};We=In("dock:html-changed",t),e.document.addEventListener("sve-page-structure",s),Ht=()=>{e.document.removeEventListener("sve-page-structure",s)}}function bl(e){We?.(),We=null,Ht?.(),Ht=null,e?.clearTimeout?.(Je),Je=0}function Zt(e){const t=Z(e.document);if(ue({source:te,type:ee.SVE_HTML_PICK,on:!1},e),bl(e),z.forget(),W.callOpen=!1,W.callStore=null,Gt(e),qe(),ne(),fs(e),D=null,n.inspect=null,n.editingId=null,n.draft="",n.sections=[],n.pageBuilder=!1,n.layoutFile=!1,Q="",e?.clearTimeout?.(Le),!t){$t(e);return}t.remove(),Nt.headerTab==="html_tree"&&ss(e,null),Do(e),En(e),Pn(e),$t(e)}function Pl(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=Xe,Re(t,zn,{title:c(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>Zt(e)))}function Hl(e){Dt(e),I(e)}function mo(e){const t=e.document;if(!No(e,"html_tree"))return;if(Z(t)){Dt(e),I(e);return}if(!so(t))return;Ee=!0,q.clear(),jo(e,[Xe]);const s=t.createElement("div");s.id=Xe,s.style.cssText=Vo,Re(s,zn,{title:c(e,"html_tree")}),s.querySelector("[data-sve-close]")?.addEventListener("click",()=>Zt(e)),Ko(e,s),En(e),Pn(e),$t(e),Dt(e),I(e)}function Al(e){if(Z(e.document)){Zt(e);return}mo(e)}qt("html-tree:open-section",e=>{const t=window,s=t.document,o=pt(t,s),a=o.find(i=>i.uid===e||i.ids.includes(e));return a?(ft(t,s,o,a.uid,""),{uid:a.uid,ids:a.ids}):null});qt("html-tree:from-preview",({path:e,src:t}={})=>{Dn(window,e)||kl(window,yl(e,t)||e)});qt("html-tree:arm-pick",e=>{const t=window;return e?(lo(t,ht(X(),to(t))),!0):(Z(t.document)||ue({source:te,type:ee.SVE_HTML_PICK,on:!1},t),!0)});function Ml(){de.clear(),$e.clear(),_e.length=0}export{Hi as HTML_TREE_STYLE_ID,El as armHtmlTreePrefetch,Ml as clearHtmlTreeTemplates,ne as closeHtmlTreeMenu,Zt as closeHtmlTreePanel,Ri as ensureHtmlTreeStyles,Pl as fillHtmlTreePane,D as htmlTreeActiveId,Z as htmlTreePanel,Je as htmlTreeTimer,We as htmlTreeUnhook,mo as openHtmlTreePanel,I as renderHtmlTree,Hl as showHtmlTreePane,bl as stopWatchHtmlTreeDock,Al as toggleHtmlTreePanel,Dt as watchHtmlTreeDock};
