const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-AWaJHJyk.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{_ as qe,I as q,J as gn,K as Me,o as p,k as g,l as L,G as w,m as P,F as M,L as me,n as V,b4 as yn,x as C,O as St,b5 as kn,a as x,t as u,A as _e,C as bn,b6 as _n,b7 as Lo,z as Ft,b8 as so,b9 as ao,ba as Tn,bb as xn,bc as Sn,bd as wn,be as lt,D as ce,av as Cn,bf as o,u as l,w as $n,v as Ln,M as le,bg as Pn,B as En,bh as X,bi as Hn,bj as In,H as Re,j as pe,bk as An,bl as Mn,bm as ro,N as Rn,Q as On,s as Bt,aw as wt,as as Dn,aQ as Po,aR as Eo,i as Fn,an as io,a1 as Oe,X as Bn,aP as Nn,at as jn,au as Vn,a2 as Ho,ae as Kn,bn as Io,bo as qn,bp as lo,bq as Ao,a0 as Mo,br as Gn,E as Ro,aa as dt,T as Nt,U as jt,aA as ct,aB as Ne,S as Vt,bs as Un,bt as zn,bu as Oo,bv as Xn,bw as Yn,bx as Wn,by as Zn,bz as Jn,aT as Qn,aU as es,az as ts,bA as os,b0 as ns,am as Kt,aM as ss,aH as as}from"./addon-BZgjl-L-.js";import{M as Q,S as ee}from"./protocol-Brvy2KuB.js";import{canEditFields as rs,currentSetHandle as is,openFieldsetOverlay as Do,openGlobalFieldsOverlay as ls}from"./section-fields-BnIo2wkC.js";import{H as Ye,ad as ds}from"./ai-text-icon-CaHMo9Tt.js";import{I as Y,J as cs,K as qt,L as us,t as hs,M as Gt,z as ps,D as fs,d as ut,N as ms,m as co,O as Fo,v as vs,Q as Bo,H as we,R as gs,S as Ut,c as ys,T as No,U as jo,V as ks,h as bs,a as _s,W as Ts,X as xs,Y as Ss,Z as ws,$ as Cs,a0 as $s,a1 as Ls,a2 as Ps,a3 as Es,a4 as Hs}from"./locked-tags-DK8eCgIn.js";import{b as Is}from"./html-pick-align-CLq5l-p4.js";import"./FieldsetOverlay-TLIAlZA5.js";const As={class:"sve-dialog__title"},Ms={for:"sve-new-section-group"},Rs={class:"sve-dialog__row"},Os=["disabled"],Ds=["value"],Fs=["title","aria-label"],Bs={key:0,class:"sve-dialog__add-group"},Ns={for:"sve-new-section-group-name"},js={class:"sve-dialog__row"},Vs=["placeholder","disabled"],Ks=["disabled"],qs=["disabled"],Gs={for:"sve-new-section-name"},Us=["placeholder"],zs={key:1,class:"sve-dialog__toggle"},Xs={key:2,class:"sve-dialog__note"},Ys={class:"sve-dialog__actions"},Ws=["disabled"],Zs=["disabled"],Js={__name:"NewSectionPrompt",props:{heading:{type:String,required:!0},groupLabel:{type:String,required:!0},nameLabel:{type:String,required:!0},placeholder:{type:String,default:""},note:{type:String,default:""},groups:{type:Array,required:!0},toggleLabel:{type:String,default:""},toggleOn:{type:Boolean,default:!0},cancelLabel:{type:String,required:!0},saveLabel:{type:String,required:!0},onOk:{type:Function,required:!0},onClose:{type:Function,required:!0},addGroupLabel:{type:String,default:""},addGroupNameLabel:{type:String,default:""},addGroupPlaceholder:{type:String,default:""},onAddGroup:{type:Function,default:null}},setup(e){const t=e,s=q(""),n=q([...t.groups]),a=q(t.groups[0]?.key??""),i=q(!1),r=q(""),d=q(null),h=q(!1);function k(){i.value=!0,r.value="",Me(()=>d.value?.focus())}function m(){i.value=!1,r.value="",Me(()=>_.value?.focus())}async function f(){const I=r.value.trim();if(!I||h.value||!t.onAddGroup){d.value?.focus();return}h.value=!0;const E=await t.onAddGroup(I);if(h.value=!1,!E?.key){d.value?.focus();return}n.value.some(R=>R.key===E.key)||n.value.push(E),a.value=E.key,i.value=!1,r.value="",Me(()=>_.value?.focus())}function y(I){I.key==="Enter"?(I.preventDefault(),f()):I.key==="Escape"&&(I.stopPropagation(),m())}const b=q(t.toggleOn),_=q(null),O=q(!1);gn(()=>Me(()=>_.value?.focus()));function T(){const I=s.value.trim();if(!I||n.value.length&&!a.value||O.value){_.value?.focus();return}O.value=!0,t.onOk(I,a.value,b.value)}function v(I){I.target===I.currentTarget&&t.onClose()}function $(I){I.key==="Enter"?T():I.key==="Escape"&&t.onClose()}return(I,E)=>(p(),g("div",{class:"sve-dialog-overlay",onClick:v},[L("div",{class:"sve-dialog",onClick:E[5]||(E[5]=w(()=>{},["stop"]))},[L("div",As,P(e.heading),1),n.value.length?(p(),g(M,{key:0},[L("label",Ms,P(e.groupLabel),1),L("div",Rs,[me(L("select",{id:"sve-new-section-group","onUpdate:modelValue":E[0]||(E[0]=R=>a.value=R),disabled:i.value,onKeydown:$},[(p(!0),g(M,null,V(n.value,R=>(p(),g("option",{key:R.key,value:R.key},P(R.display),9,Ds))),128))],40,Os),[[yn,a.value]]),e.onAddGroup&&!i.value?(p(),g("button",{key:0,type:"button",class:"is-add",title:e.addGroupLabel,"aria-label":e.addGroupLabel,"data-sve-new-group":"",onClick:k},[...E[6]||(E[6]=[L("span",{"aria-hidden":"true"},"+",-1)])],8,Fs)):C("",!0)]),i.value?(p(),g("div",Bs,[L("label",Ns,P(e.addGroupNameLabel||e.addGroupLabel),1),L("div",js,[me(L("input",{id:"sve-new-section-group-name",ref_key:"groupInput",ref:d,"onUpdate:modelValue":E[1]||(E[1]=R=>r.value=R),type:"text",placeholder:e.addGroupPlaceholder,disabled:h.value,"data-sve-new-group-name":"",onKeydown:y},null,40,Vs),[[St,r.value]]),L("button",{type:"button",class:"is-primary is-small",disabled:h.value,"data-sve-new-group-create":"",onClick:f},P(e.saveLabel),9,Ks),L("button",{type:"button",class:"is-cancel is-small",disabled:h.value,onClick:m},P(e.cancelLabel),9,qs)])])):C("",!0)],64)):C("",!0),L("label",Gs,P(e.nameLabel),1),me(L("input",{id:"sve-new-section-name",ref_key:"input",ref:_,"onUpdate:modelValue":E[2]||(E[2]=R=>s.value=R),type:"text",placeholder:e.placeholder,onKeydown:$},null,40,Us),[[St,s.value]]),e.toggleLabel?(p(),g("label",zs,[me(L("input",{"onUpdate:modelValue":E[3]||(E[3]=R=>b.value=R),type:"checkbox",onKeydown:$},null,544),[[kn,b.value]]),L("span",null,P(e.toggleLabel),1)])):C("",!0),e.note?(p(),g("p",Xs,P(e.note),1)):C("",!0),L("div",Ys,[L("button",{type:"button",class:"is-cancel",disabled:O.value,onClick:E[4]||(E[4]=(...R)=>e.onClose&&e.onClose(...R))},P(e.cancelLabel),9,Ws),L("button",{type:"button",class:"is-primary",disabled:O.value,onClick:T},P(e.saveLabel),9,Zs)])])]))}},Vo=qe(Js,[["__scopeId","data-v-6501522a"]]),zt="/!/sve/section-types",uo="static_sections";async function Qs(e){const t=await e.fetch(`${zt}?${_n(e)}`,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!t.ok)throw new Error(`section-types ${t.status}`);const s=await t.json();if(Array.isArray(s.groups)&&s.groups.length)return s.groups.filter(a=>a&&a.handle&&a.handle!==uo).map(a=>({key:a.handle,display:a.display||a.handle}));const n=new Map;for(const a of s.types||[])a?.group&&a.group!==uo&&!n.has(a.group)&&n.set(a.group,a.group_display||a.group);return[...n].map(([a,i])=>({key:a,display:i}))}async function ea(e,t){const s=await e.fetch(`${zt}/groups`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Ft(e),"X-Requested-With":"XMLHttpRequest",Accept:"application/json"},body:JSON.stringify({display:t,...Lo(e)})}),n=await s.json().catch(()=>({}));if(!s.ok||!n.group?.handle)throw new Error(n?.error==="bad_name"?"bad_name":`section-types/groups ${s.status}`);return e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale")),{key:n.group.handle,display:n.group.display||n.group.handle}}const je=new Map;function ta(e){e?.handle&&je.set(e.handle,{static:!!e.static,hidden:!!e.hidden})}function oa(e,t){return t?je.has(t)?je.get(t).static:e.Statamic?.$config?.get?.("sveSetMeta")?.[t]?.static===!0:!1}function na(e,t){if(!t)return!1;if(je.has(t))return je.get(t).hidden;const s=e.Statamic?.$config?.get?.("sveSectionTypes");return Array.isArray(s)&&s.some(n=>n?.handle===t&&n.hidden===!0)}async function Ko(e,t,s){const n=await e.fetch(zt,{method:t,headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Ft(e),Accept:"application/json"},credentials:"same-origin",body:JSON.stringify({...s,...Lo(e)})}),a=await n.json().catch(()=>({}));if(!n.ok){const i=new Error(a.error||`section-types ${n.status}`);throw i.reason=a.error,i}return ta(a.section),a}function sa(e,{display:t,group:s="",static:n=!1,hidden:a=!1}){return Ko(e,"POST",{display:t,group:s,static:n,hidden:a})}function ho(e,{handle:t,hidden:s,fields:n=!1}){const a={handle:t,fields:n};return typeof s=="boolean"&&(a.hidden=s),Ko(e,"PATCH",a)}async function aa(e,t,s=null,n=null){if(!t||typeof so!="function"||typeof ao!="function")return null;const a=await so(e,t);if(!a)return null;n&&Array.isArray(a.definitions)&&Tn(t,{display:n.display||t,icon:n.icon||null,hide:n.hidden===!0,fields:a.definitions,group_display:n.group_display||n.group||""},n.group||"");const i=xn(),r=Sn(e,"page",{handle:t},a?.defaults,i),d=wn(r,a?.new||{},a?.defaults);return ao(e,e.document,s,r,d)?r:null}const po=700,ra=17;function ia(e,t){const s=(t||[]).filter(Boolean);if(!s.length)return;let n=0;const a=()=>{n+=1;const i=lt(e),r=i?s.some(d=>i.querySelector(`[data-sid="${CSS.escape(d)}"]`)):!0;r&&ce({source:ee,type:Q.SVE_ACTIVATE,ids:s},e),(r?!i&&n<6:n<ra)&&e.setTimeout(a,po)};e.setTimeout(a,po)}function qo(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function la(e){return new Promise(t=>{let s=!1;const n=i=>{s||(s=!0,a.dismiss(),t(i==="static"||i==="fields"?i:null))},a=_e(e.document,bn,{title:u(e,"section_new_kind"),body:u(e,"section_new_kind_note"),buttons:[{value:"cancel",label:u(e,"cancel"),variant:"ghost"},{value:"static",label:u(e,"section_new_static"),variant:"primary"},{value:"fields",label:u(e,"section_new_with_fields"),variant:"primary"}],onPick:n,onClose:()=>n(null)})})}const da=`<section class="[ ] py-800">
    
</section>
`;function ca(e){if(x("dock:is-locked")===!0)return e.Statamic?.$toast?.error(u(e,"code_dock_locked")),!1;const s=`${String(x("dock:html")||"").replace(/\s+$/,"")}

${da}`;return x("dock:set-html",s)!==!0?(e.Statamic?.$toast?.error(u(e,"section_new_failed")),!1):(x("dock:save-now"),e.Statamic?.$toast?.success(u(e,"section_new_template_done")),!0)}async function Go(e,t,s,{afterUid:n,onDone:a,onError:i}){try{const r=await sa(e,s);t.dismiss(),e.Statamic?.$toast?.success(u(e,"section_created",{name:r.section?.display||s.display})),Ct(e);const d=r.section?.handle?{...r.section,group_display:(r.section_types||[]).find(k=>k?.handle===r.section.handle)?.group_display||""}:null,h=await aa(e,r.section?.handle,n,d);!h&&r.section?.handle&&x("dock:open-template",r.section.handle),a?.({...r,uid:h?._visual_id||""})}catch(r){t.dismiss(),e.Statamic?.$toast?.error(u(e,r.reason==="bad_name"?"section_new_bad_name":"section_new_failed")),i?.(r)}}function Ct(e){e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"))}function ua(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){const i=_e(e.document,Vo,{heading:u(e,"static_section_new"),groupLabel:"",nameLabel:u(e,"section_new_name"),placeholder:u(e,"section_new_placeholder"),note:u(e,"static_section_note"),groups:[],toggleLabel:u(e,"static_section_insertable"),cancelLabel:u(e,"cancel"),saveLabel:u(e,"section_new_create"),onClose:a,onOk:(r,d,h)=>{Go(e,i,{display:r,static:!0,hidden:!h},{afterUid:t,onDone:s,onError:n})}})}function ha(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){(async()=>{let i=[];try{i=await Qs(e)}catch(d){n?.(d),e.Statamic?.$toast?.error(u(e,"section_new_failed"));return}if(!i.length){n?.(new Error("no groups")),e.Statamic?.$toast?.error(u(e,"section_new_failed"));return}const r=_e(e.document,Vo,{heading:u(e,"section_new"),groupLabel:u(e,"section_new_group"),nameLabel:u(e,"section_new_name"),placeholder:u(e,"section_new_placeholder"),note:u(e,"section_new_note"),groups:i,addGroupLabel:u(e,"section_new_group_add"),addGroupNameLabel:u(e,"section_new_group_name"),addGroupPlaceholder:u(e,"section_new_group_placeholder"),onAddGroup:async d=>{try{const h=await ea(e,d);return e.Statamic?.$toast?.success(u(e,"section_group_created",{name:h.display})),h}catch(h){return e.Statamic?.$toast?.error(u(e,h?.message==="bad_name"?"section_new_bad_name":"section_group_failed")),null}},cancelLabel:u(e,"cancel"),saveLabel:u(e,"section_new_create"),onClose:a,onOk:(d,h)=>{Go(e,r,{display:d,group:h},{afterUid:t,onDone:s,onError:n})}})})()}const pa={key:0,class:"sve-ht-inspect"},fa={class:"sve-ht-inspect__head"},ma={key:0,class:"sve-ht-inspect__note"},va={key:2,class:"sve-ht-inspect__props"},ga={class:"sve-ht-inspect__proplabel"},ya={key:0},ka=["value","disabled","onChange"],ba={value:""},_a=["value"],Ta=["value"],xa=["value","placeholder","onChange"],Sa=["title","disabled","onClick"],wa=["title","disabled","onClick"],Ca={key:0,class:"sve-ht-inspect__seg"},$a=["data-active","disabled","onClick"],La=["value","disabled"],Pa={key:0,value:""},Ea=["value"],Ha={key:2,class:"sve-ht-inspect__box"},Ia=["value","placeholder","disabled","onKeydown"],Aa=["title","disabled"],Ma={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Ra=["value","disabled"],Oa=["value"],Da={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},Fa=["value","placeholder","disabled"],Ba=["title","disabled"],Na={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},ja=["value","placeholder","disabled"],Va={key:4,class:"sve-ht-inspect__add"},Ka=["disabled","onClick"],mt='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',qa='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',Ga={__name:"HtmlTreeInspector",setup(e){const t=q(null);Cn(t,k=>o.onPropHost?.(k||null));const s=q(null),n=q(null);function a(k){o.onInspectCommit?.(k.target.value)}function i(k,m,f){!k||!m||(k.value=m,k.focus(),k.setSelectionRange(m.length,m.length),f(m))}function r(k,m){o.onInspectData?.(k.currentTarget,f=>o.onPropValue?.(m.handle,f,!0))}function d(k){o.onInspectData?.(k.currentTarget,m=>i(s.value,m,f=>o.onInspectCommit?.(f)))}function h(k){o.onInspectData?.(k.currentTarget,m=>i(n.value,m,f=>o.onLoopSortField?.(f)))}return(k,m)=>l(o).inspect?(p(),g("div",pa,[L("div",fa,P(l(o).inspect.title),1),l(o).inspect.mode==="note"?(p(),g("div",ma,P(l(o).inspect.note),1)):l(o).inspect.mode==="statamic"?(p(),g("div",{key:1,ref_key:"propHost",ref:t,class:"sve-ht-inspect__form"},null,512)):l(o).inspect.mode==="props"?(p(),g("div",va,[(p(!0),g(M,null,V(l(o).inspect.rows,f=>(p(),g("label",{key:f.handle,class:"sve-ht-inspect__prop"},[L("span",ga,[$n(P(f.label)+" ",1),f.bound?(p(),g("em",ya,":")):C("",!0)]),L("span",{class:Ln(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":f.type==="select"||f.type==="link"}])},[f.type==="select"&&!f.bound?(p(),g("select",{key:0,value:f.value,disabled:!l(o).canEdit,onChange:y=>l(o).onPropValue?.(f.handle,y.target.value,!1)},[L("option",ba,P(f.placeholder||l(o).inspect.inheritLabel),1),f.value&&!f.options.includes(f.value)?(p(),g("option",{key:0,value:f.value},P(f.value),9,_a)):C("",!0),(p(!0),g(M,null,V(f.options,y=>(p(),g("option",{key:y,value:y},P(y),9,Ta))),128))],40,ka)):(p(),g("input",{key:1,type:"text",value:f.value,placeholder:f.placeholder||l(o).inspect.inheritLabel,onChange:y=>l(o).onPropValue?.(f.handle,y.target.value,f.bound)},null,40,xa)),f.type==="link"?(p(),g("button",{key:2,type:"button","data-sve-ht-data":"",title:l(o).pageTitle,disabled:!l(o).canEdit,onClick:y=>l(o).onPropPage?.(y.currentTarget,f.handle),innerHTML:qa},null,8,Sa)):C("",!0),L("button",{type:"button","data-sve-ht-data":"",title:l(o).dataTitle,disabled:!l(o).canEdit,onClick:y=>r(y,f),innerHTML:mt},null,8,wa)],2)]))),128))])):(p(),g(M,{key:3},[l(o).inspect.mode==="loop"?(p(),g("div",Ca,[(p(!0),g(M,null,V(l(o).inspect.kinds,f=>(p(),g("button",{key:f.id,type:"button","data-active":f.id===l(o).inspect.loopKind?"":void 0,disabled:!l(o).canEdit,onClick:y=>l(o).onLoopKind?.(f.id)},P(f.label),9,$a))),128))])):C("",!0),l(o).inspect.mode==="loop"&&l(o).inspect.loopKind==="collection"?(p(),g("select",{key:l(o).inspect.key+":"+l(o).inspect.value,value:l(o).inspect.value,disabled:!l(o).canEdit,onChange:a},[l(o).inspect.value?C("",!0):(p(),g("option",Pa,P(l(o).inspect.placeholder),1)),(p(!0),g(M,null,V(l(o).inspect.collections,f=>(p(),g("option",{key:f.handle,value:f.handle},P(f.title),9,Ea))),128))],40,La)):(p(),g("div",Ha,[(p(),g("input",{ref_key:"field",ref:s,key:l(o).inspect.key,type:"text",value:l(o).inspect.value,placeholder:l(o).inspect.placeholder,disabled:!l(o).canEdit,spellcheck:"false",onKeydown:[m[0]||(m[0]=w(()=>{},["stop"])),le(w(a,["prevent"]),["enter"])],onBlur:a},null,40,Ia)),L("button",{type:"button","data-sve-ht-data":"",title:l(o).dataTitle,disabled:!l(o).canEdit,innerHTML:mt,onMousedown:m[1]||(m[1]=w(()=>{},["prevent"])),onClick:w(d,["stop","prevent"])},null,40,Aa)])),l(o).inspect.sort?(p(),g(M,{key:3},[L("div",Ma,P(l(o).inspect.sort.title),1),(p(),g("select",{key:l(o).inspect.key+":dir:"+l(o).inspect.sort.dir,value:l(o).inspect.sort.dir,disabled:!l(o).canEdit,onChange:m[2]||(m[2]=f=>l(o).onLoopSortDir?.(f.target.value))},[(p(!0),g(M,null,V(l(o).inspect.sort.dirs,f=>(p(),g("option",{key:f.id,value:f.id},P(f.label),9,Oa))),128))],40,Ra)),l(o).inspect.sort.needsField?(p(),g("div",Da,[(p(),g("input",{ref_key:"sortField",ref:n,key:l(o).inspect.key+":field",type:"text",value:l(o).inspect.sort.field,placeholder:l(o).inspect.sort.placeholder,disabled:!l(o).canEdit,spellcheck:"false",onKeydown:[m[3]||(m[3]=w(()=>{},["stop"])),m[4]||(m[4]=le(w(f=>l(o).onLoopSortField?.(f.target.value),["prevent"]),["enter"]))],onBlur:m[5]||(m[5]=f=>l(o).onLoopSortField?.(f.target.value))},null,40,Fa)),l(o).inspect.sort.pickable?(p(),g("button",{key:0,type:"button","data-sve-ht-data":"",title:l(o).dataTitle,disabled:!l(o).canEdit,innerHTML:mt,onMousedown:m[6]||(m[6]=w(()=>{},["prevent"])),onClick:w(h,["stop","prevent"])},null,40,Ba)):C("",!0)])):C("",!0),L("div",Na,P(l(o).inspect.limit.title),1),(p(),g("input",{key:l(o).inspect.key+":limit",type:"number",min:"1",value:l(o).inspect.limit.value,placeholder:l(o).inspect.limit.placeholder,disabled:!l(o).canEdit,onKeydown:[m[7]||(m[7]=w(()=>{},["stop"])),m[8]||(m[8]=le(w(f=>l(o).onLoopLimit?.(f.target.value),["prevent"]),["enter"]))],onBlur:m[9]||(m[9]=f=>l(o).onLoopLimit?.(f.target.value))},null,40,ja))],64)):C("",!0),l(o).inspect.branches?.length?(p(),g("div",Va,[(p(!0),g(M,null,V(l(o).inspect.branches,f=>(p(),g("button",{key:f.id,type:"button",disabled:!l(o).canEdit,onClick:y=>l(o).onAddBranch?.(f.id)},P(f.label),9,Ka))),128))])):C("",!0)],64))])):C("",!0)}},Ua=qe(Ga,[["__scopeId","data-v-26254b75"]]),za={class:"sve-html-tree"},Xa={class:"sve-pane-bar","data-sve-pane-bar":""},Ya={"data-sve-right-title":""},Wa={"data-sve-right-actions":""},Za=["aria-pressed","title","aria-label"],Ja={class:"sve-ht-tools"},Qa=["title"],er=["placeholder","aria-label","value"],tr=["aria-label"],or=["title","aria-label"],nr=["title"],sr={class:"sve-ht-used-by__label"},ar={class:"sve-ht-used-by__text"},rr={key:2,class:"sve-tree-exit"},ir=["title"],lr=["title"],dr='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',cr='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',ur='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',hr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',pr={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const t=u(window,"html_tree_search");o.layers=Pn(window);const s=u(window,"html_tree_layers_on"),n=u(window,"html_tree_layers_off");function a(){In(window,!o.layers)}const i=qo(window),r=u(window,"section_new"),d=q(!1);function h(){d.value=!1}async function k(y){if(!y)return;await Me(),o.onRefresh?.();const b=x("html-tree:open-section",y);b&&ia(window,b.ids)}function m(){d.value||(d.value=!0,(async()=>{if(!(o.sections.length||o.pageBuilder)){ca(window),h();return}const y=await la(window);if(!y){h();return}const b=o.sections.length?o.sections[o.sections.length-1].uid:null,_=O=>{h(),k(O?.uid)};if(y==="static"){ua(window,{afterUid:b,onDone:_,onError:h,onClose:h});return}ha(window,{afterUid:b,onDone:_,onError:h,onClose:h})})())}function f(y){const b=!!o.query;o.query=y,b!==!!y&&o.onQuery?.()}return(y,b)=>(p(),g("div",za,[L("div",Xa,[L("div",Ya,P(e.title),1),L("div",Wa,[L("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":l(o).layers?"true":"false",title:l(o).layers?l(n):l(s),"aria-label":l(o).layers?l(n):l(s),innerHTML:dr,onClick:a},null,8,Za),b[5]||(b[5]=En('<button type="button" data-sve-right-pin aria-pressed="false" data-v-331de34d></button><button type="button" data-sve-close aria-label="Close" data-v-331de34d><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-331de34d><path d="M18 6 6 18" data-v-331de34d></path><path d="m6 6 12 12" data-v-331de34d></path></svg></button>',2))])]),L("div",Ja,[L("label",{class:"sve-ht-search",title:l(t)},[L("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:ur}),L("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:l(t),"aria-label":l(t),value:l(o).query,autocomplete:"off",spellcheck:"false",onInput:b[0]||(b[0]=_=>f(_.target.value)),onKeydown:[b[1]||(b[1]=w(()=>{},["stop"])),b[2]||(b[2]=le(w(_=>f(""),["prevent"]),["escape"]))]},null,40,er),l(o).query?(p(),g("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":l(t),innerHTML:hr,onClick:b[3]||(b[3]=_=>f(""))},null,8,tr)):C("",!0)],8,Qa),l(i)&&(l(o).sections.length||l(o).pageBuilder||l(o).rows.length&&!l(o).layoutFile)?(p(),g("button",{key:0,type:"button",class:"sve-ht-new",title:l(r),"aria-label":l(r),innerHTML:cr,onClick:m},null,8,or)):C("",!0)]),l(o).usedBy?(p(),g("div",{key:0,class:"sve-ht-used-by",title:`${l(o).usedBy.label}: ${l(o).usedBy.text}`},[L("span",sr,P(l(o).usedBy.label)+":",1),L("span",ar,P(l(o).usedBy.text),1)],8,nr)):C("",!0),l(Y).inSidebar?C("",!0):(p(),X(cs,{key:1})),b[6]||(b[6]=L("div",{"data-sve-html-tree-list":""},null,-1)),Hn(Ua),l(o).exitOpen&&!l(Y).inSidebar?(p(),g("div",rr,[L("span",{class:"sve-tree-exit__name",title:l(o).exitName},P(l(o).exitName),9,ir),L("button",{type:"button",class:"sve-tree-exit__go",title:l(o).exitTitle,onClick:b[4]||(b[4]=_=>l(o).onExit?.())},P(l(o).exitLabel),9,lr)])):C("",!0)]))}},Uo=qe(pr,[["__scopeId","data-v-331de34d"]]);function zo(e){return String(e||"").trim().toLowerCase()}function $t(e,t){return t?[e.name,e.tag,e.klass,e.label,e.src].filter(s=>typeof s=="string"&&s).join(" ").toLowerCase().includes(t):!0}function fr(e,t){const s=zo(t);if(!s)return{rows:e,hits:new Set};const n=new Set;for(const r of e)$t(r,s)&&n.add(r.path);const a=[...n];return{rows:e.filter(r=>n.has(r.path)||a.some(d=>d.startsWith(`${r.path}/`))),hits:n}}const mr=["title"],vr={"data-sve-ht-indent":"","aria-hidden":"true"},gr=["data-sve-ht-cat"],yr={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},kr={key:2,"data-sve-ht-letter":""},br=["innerHTML"],_r=["title"],Tr=["title"],xr={key:1,"data-sve-ht-kind":""},Sr={key:3,"data-sve-ht-name":""},wr={key:4,"data-sve-ht-actions":""},Cr=["title"],$r={key:5,"data-sve-ht-actions":""},Lr=["data-on","title","innerHTML"],Pr=["disabled","title","innerHTML"],Er=["disabled","title"],Hr=["disabled","title"],Ir=["disabled","title"],Ar=["data-sve-ht-id"],fo='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',Mr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',Rr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Or='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',Dr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',Fr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',Br='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',Nr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',jr={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const t=rs(window),s=u(window,"section_fields");function n(){const T=is();if(!T){window.Statamic?.$toast?.error(u(window,"section_fields_none"));return}Do(window,T)}function a(T){return T.synthetic?T.frame==="main"?o.frameMainTitle:T.frame==="template"?o.frameTemplateTitle:o.frameOpenTitle:T.kind==="component"?T.src?`partial:${T.src}`:T.tag:T.name?`${T.tag} ${T.name}`:T.tag}function i(T){return!!T.section}function r(T){return!!T.frame}function d(T){return T.kind==="slot"}function h(T){return!!T.context}function k(T,v){h(v)||r(v)||d(v)||(i(v)?o.onSectionPointerDown?.(T,v.section):v.sectionRoot?o.onSectionPointerDown?.(T,v.sectionRoot):o.onPointerDown?.(T,v.id))}function m(T){if(T.synthetic){o.onFrame?.(T.frame);return}if(i(T)){o.onSection?.(T.section);return}if(h(T)){o.onContextRow?.(T.id);return}o.onSelect?.(T.id)}function f(T,v){const $={"data-sve-ht-id":T.id};return T.current&&($["data-sve-ht-current"]=""),T.hidden&&($["data-sve-ht-hidden"]=""),$["data-sve-ht-cat"]=T.cat||"other",$["data-sve-ht-depth"]=String(T.depth),v&&($["data-sve-ht-dim"]=""),h(T)&&($["data-sve-ht-context"]=T.context),i(T)&&($["data-sve-ht-sec"]=""),r(T)&&($["data-sve-ht-frame"]=T.frame),!i(T)&&o.dropId===T.id&&o.dropPlace&&($["data-sve-ht-drop"]=o.dropPlace),$}function y(T){return!!T.fixed}function b(T){return!y(T)&&(!T.hidden||T.wrapFrom!=null)}function _(T){return!!T.sectionRoot||!!T.section}function O(T){return o.canEdit||_(T)}return(T,v)=>(p(),g(M,null,[L("div",Re({"data-sve-ht-row":""},f(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:v[32]||(v[32]=$=>m(e.row)),onDblclick:v[33]||(v[33]=w($=>e.row.synthetic?l(o).onFrameEnter?.(e.row.frame):r(e.row)||d(e.row)||i(e.row)||h(e.row)?null:l(o).onRename?.(e.row.id),["prevent"])),onKeydown:[v[34]||(v[34]=le(w($=>m(e.row),["prevent"]),["enter"])),v[35]||(v[35]=le(w($=>m(e.row),["prevent"]),["space"]))],onPointerdown:v[36]||(v[36]=$=>k($,e.row)),onContextmenu:v[37]||(v[37]=w($=>r(e.row)||d(e.row)||i(e.row)||h(e.row)?null:l(o).onContext?.($,e.row.id),["prevent","stop"]))}),[L("span",vr,[(p(!0),g(M,null,V(e.row.guides||[],($,I)=>(p(),g("i",{key:I,"data-sve-ht-cat":$},null,8,gr))),128))]),e.row.hasChildren||e.row.emptyBlock?(p(),g("button",Re({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?l(o).mainShut:e.row.shut)?{"data-sve-ht-shut":""}:{},{innerHTML:Mr,onClick:v[0]||(v[0]=w($=>e.row.synthetic?l(o).onFrameTwist?.():i(e.row)?l(o).onSection?.(e.row.section):l(o).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:v[1]||(v[1]=w(()=>{},["stop"])),onDblclick:v[2]||(v[2]=w(()=>{},["stop"]))}),null,16)):(p(),g("span",yr)),e.row.letter?(p(),g("span",kr,P(e.row.letter),1)):(p(),g("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,br)),L("span",{"data-sve-ht-text":"",title:l(o).renameTitle},[!e.row.kind&&!i(e.row)&&!h(e.row)&&!r(e.row)?(p(),g("button",{key:0,type:"button","data-sve-ht-tag":"",title:l(o).tagTitle,onClick:v[3]||(v[3]=w(()=>{},["stop","prevent"])),onPointerdown:v[4]||(v[4]=w(()=>{},["stop"])),onDblclick:v[5]||(v[5]=w($=>l(o).onTagChange?.($,e.row.id),["stop","prevent"]))},P(e.row.tag),41,Tr)):(p(),g("span",xr,P(e.row.tag),1)),l(o).editingId===e.row.id&&!i(e.row)?me((p(),g("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":v[6]||(v[6]=$=>l(o).draft=$),onMousedown:v[7]||(v[7]=w(()=>{},["stop"])),onPointerdown:v[8]||(v[8]=w(()=>{},["stop"])),onClick:v[9]||(v[9]=w(()=>{},["stop"])),onDblclick:v[10]||(v[10]=w(()=>{},["stop"])),onKeydown:[v[11]||(v[11]=w(()=>{},["stop"])),v[12]||(v[12]=le(w($=>l(o).onRenameCommit?.(),["prevent"]),["enter"])),v[13]||(v[13]=le(w($=>l(o).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:v[14]||(v[14]=$=>l(o).onRenameCommit?.())},null,544)),[[St,l(o).draft]]):(p(),g("span",Sr,P(e.row.name),1))],8,_r),r(e.row)?(p(),g("span",wr,[e.row.frame!=="main"&&l(t)?(p(),g("button",{key:0,type:"button","data-sve-ht-fields":"",title:l(o).frameFieldsTitle,innerHTML:fo,onClick:v[15]||(v[15]=w($=>l(o).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:v[16]||(v[16]=w(()=>{},["stop"])),onDblclick:v[17]||(v[17]=w(()=>{},["stop"]))},null,40,Cr)):C("",!0)])):!i(e.row)&&!h(e.row)&&!d(e.row)?(p(),g("span",$r,[e.row.videoNth>=0?(p(),g("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?l(o).videoPlayTitle:l(o).videoHoldTitle,innerHTML:e.row.videoHeld?Br:Fr,onClick:v[18]||(v[18]=w($=>l(o).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:v[19]||(v[19]=w(()=>{},["stop"])),onDblclick:v[20]||(v[20]=w(()=>{},["stop"]))},null,40,Lr)):C("",!0),b(e.row)?(p(),g("button",{key:1,type:"button","data-sve-ht-eye":"",disabled:!l(o).canEdit,title:l(o).canEdit?e.row.hidden?l(o).showTitle:l(o).hideTitle:l(o).lockedTitle,innerHTML:e.row.hidden?Or:Rr,onClick:v[21]||(v[21]=w($=>l(o).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:v[22]||(v[22]=w(()=>{},["stop"])),onDblclick:v[23]||(v[23]=w(()=>{},["stop"]))},null,40,Pr)):C("",!0),l(t)&&e.row.fieldsIcon?(p(),g("button",{key:2,type:"button","data-sve-ht-fields":"",disabled:!l(o).canEdit,title:l(o).canEdit?l(s):l(o).lockedTitle,innerHTML:fo,onClick:w(n,["stop","prevent"]),onPointerdown:v[24]||(v[24]=w(()=>{},["stop"])),onDblclick:v[25]||(v[25]=w(()=>{},["stop"]))},null,40,Er)):C("",!0),y(e.row)?C("",!0):(p(),g("button",{key:3,type:"button","data-sve-ht-dup":"",disabled:!O(e.row),title:O(e.row)?l(o).duplicateTitle:l(o).lockedTitle,innerHTML:Dr,onClick:v[26]||(v[26]=w($=>l(o).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:v[27]||(v[27]=w(()=>{},["stop"])),onDblclick:v[28]||(v[28]=w(()=>{},["stop"]))},null,40,Hr)),y(e.row)?C("",!0):(p(),g("button",{key:4,type:"button","data-sve-ht-del":"",disabled:!O(e.row),title:O(e.row)?l(o).deleteTitle:l(o).lockedTitle,innerHTML:Nr,onClick:v[29]||(v[29]=w($=>l(o).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:v[30]||(v[30]=w(()=>{},["stop"])),onDblclick:v[31]||(v[31]=w(()=>{},["stop"]))},null,40,Ir))])):C("",!0)],16,mr),e.row.emptyBlock&&!e.row.shut?(p(),g("div",Re({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},l(o).dropId===e.row.id&&l(o).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),P(l(o).slotText),17,Ar)):C("",!0)],64))}},Z=qe(jr,[["__scopeId","data-v-6c7b7132"]]),Vr=["data-sve-ht-look","data-sve-ht-layers"],Kr={key:0,class:"sve-ht-page-template"},qr={key:0,class:"sve-ht-page-template__text"},Gr={class:"sve-ht-page-template__note"},Ur={key:1,class:"sve-ht-empty"},zr={key:2,class:"sve-ht-empty"},Xr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},Yr={key:0,class:"sve-ht-empty"},Wr={key:0,class:"sve-ht-empty"},Zr=["data-sve-ht-under-main"],Jr={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},Qr={key:0,class:"sve-ht-empty"},ei=["data-sve-ht-under-main"],ti=["data-dim"],oi={key:0,class:"sve-ht-empty"},ni={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},si={key:0,class:"sve-ht-empty"},ai={__name:"HtmlTreeList",setup(e){const t=pe(()=>zo(o.query)),s=pe(()=>fr(o.rows,t.value)),n=pe(()=>s.value.rows),a=pe(()=>t.value?o.sections.filter(y=>$t(y.row,t.value)||y.current&&y.ready&&n.value.length>0):o.sections);function i(y){return!!y&&(!t.value||$t(y,t.value))}function r(y){const b=o.frame?.kind;return o.inComponent||(b==="header"||b==="footer")&&b!==y}const d=pe(()=>!!o.frame&&["header","main","footer"].some(y=>i(o.frame[y]))),h=pe(()=>!!o.frame&&(o.frame.kind==="main"||i(o.frame.main))),k=pe(()=>!!t.value&&!a.value.length&&!n.value.length&&!d.value);function m(y){return!!t.value&&!s.value.hits.has(y.path)}function f(y){const b={"data-sve-ht-sec-uid":y.uid};return y.current&&(b["data-sve-ht-branch"]="",b["data-sve-ht-cat"]=y.row?.cat||"layout"),o.sectionDrop&&o.sectionDrop.uid===y.uid&&(b["data-sve-ht-drop"]=o.sectionDrop.place),b}return(y,b)=>(p(),g("div",Re({class:"sve-ht-root","data-sve-ht-look":l(o).layers?"tags":l(o).look,"data-sve-ht-layers":l(o).layers?"":null,style:l(o).familyStyle},l(o).dragging?{"data-sve-ht-dragging":""}:{}),[l(o).pageTemplate?(p(),g("div",Kr,[l(o).pageTemplate.text?(p(),g("p",qr,P(l(o).pageTemplate.text),1)):C("",!0),L("p",Gr,P(l(o).pageTemplate.note),1),l(o).pageTemplate.canOpen?(p(),g("button",{key:1,type:"button",class:"sve-ht-page-template__open",onClick:b[0]||(b[0]=_=>l(o).pageTemplate.onOpen(_.currentTarget))},P(l(o).pageTemplate.openLabel),1)):C("",!0)])):!l(o).rows.length&&!l(o).sections.length&&!l(o).frame?(p(),g("div",Ur,P(l(o).emptyText),1)):k.value?(p(),g("div",zr,P(l(o).searchEmpty),1)):C("",!0),l(o).frame||l(o).sections.length?(p(),g(M,{key:3},[l(o).frame?(p(),g(M,{key:0},[l(o).frame.kind==="header"?(p(),g("div",Xr,[(p(!0),g(M,null,V(n.value,_=>(p(),X(Z,{key:_.id,row:_,dim:m(_)},null,8,["row","dim"]))),128)),l(o).rows.length?C("",!0):(p(),g("div",Yr,P(l(o).emptyText),1))])):i(l(o).frame.header)?(p(),X(Z,{key:1,row:l(o).frame.header,dim:r("header")},null,8,["row","dim"])):C("",!0)],64)):C("",!0),L("div",An(Mn(l(o).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[l(o).frame?.kind==="main"?(p(),g(M,{key:0},[(p(!0),g(M,null,V(n.value,_=>(p(),X(Z,{key:_.id,row:_,dim:m(_)},null,8,["row","dim"]))),128)),l(o).rows.length?C("",!0):(p(),g("div",Wr,P(l(o).emptyText),1))],64)):l(o).frame&&i(l(o).frame.main)?(p(),X(Z,{key:1,row:l(o).frame.main,dim:r("main")},null,8,["row","dim"])):C("",!0),l(o).frame?.kind==="template"?me((p(),g("div",{key:2,"data-sve-ht-frame-body":"","data-sve-ht-under-main":h.value?"":null},[L("div",Jr,[(p(!0),g(M,null,V(n.value,_=>(p(),X(Z,{key:_.id,row:_,dim:m(_)},null,8,["row","dim"]))),128)),l(o).rows.length?C("",!0):(p(),g("div",Qr,P(l(o).emptyText),1))])],8,Zr)),[[ro,!l(o).mainShut]]):C("",!0),l(o).sections.length||l(o).frame?me((p(),g("div",{key:3,"data-sve-ht-frame-body":"","data-sve-ht-under-main":h.value?"":null},[l(o).frame?.template&&i(l(o).frame.template)?(p(),X(Z,{key:0,row:l(o).frame.template,dim:r("template")},null,8,["row","dim"])):C("",!0),l(o).frame&&!l(o).frame.template&&!l(o).sections.length&&!t.value?(p(),g("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":r("")?"":void 0},P(l(o).frameEmptyText),9,ti)):C("",!0),(p(!0),g(M,null,V(a.value,_=>(p(),g("div",Re({key:_.uid},{ref_for:!0},f(_)),[_.ready?(p(),g(M,{key:0},[(p(!0),g(M,null,V(n.value,O=>(p(),X(Z,{key:O.id,row:O,dim:m(O)},null,8,["row","dim"]))),128)),l(o).rows.length?C("",!0):(p(),g("div",oi,P(l(o).emptyText),1))],64)):(p(),X(Z,{key:1,row:_.row,dim:r("")},null,8,["row","dim"]))],16))),128))],8,ei)),[[ro,!l(o).frame||!l(o).mainShut]]):C("",!0)],16),l(o).frame?(p(),g(M,{key:1},[l(o).frame.kind==="footer"?(p(),g("div",ni,[(p(!0),g(M,null,V(n.value,_=>(p(),X(Z,{key:_.id,row:_,dim:m(_)},null,8,["row","dim"]))),128)),l(o).rows.length?C("",!0):(p(),g("div",si,P(l(o).emptyText),1))])):i(l(o).frame.footer)?(p(),X(Z,{key:1,row:l(o).frame.footer,dim:r("footer")},null,8,["row","dim"])):C("",!0)],64)):C("",!0)],64)):l(o).rows.length?(p(!0),g(M,{key:4},V(n.value,_=>(p(),X(Z,{key:_.id,row:_,dim:m(_)},null,8,["row","dim"]))),128)):C("",!0)],16,Vr))}},vt=qe(ai,[["__scopeId","data-v-eecd9f12"]]);let gt=null;function ri(e){return gt||(gt=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{pages:[]}).then(t=>Array.isArray(t.pages)?t.pages:[]).catch(()=>[])),gt}let We=null;function yt(){We?.dismiss(),We=null}function ii(e,t,s){yt();const n=t?.getBoundingClientRect?.(),a={x:n?n.left:0,y:n?n.bottom+4:0};ri(e).then(i=>{const r=i.length?i.map(d=>({label:d.title||d.url,onPick:()=>{yt(),s(d.url)}})):[{label:u(e,"component_props_pages_none"),onPick:null}];yt(),We=_e(e.document,qt,{items:r,x:a.x,y:a.y,onClose:()=>{We=null}})})}const Xo="sve-html-tree-labels";function Yo(){try{const e=globalThis.localStorage?.getItem(Xo);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function li(e){try{globalThis.localStorage?.setItem(Xo,JSON.stringify(e))}catch{}}function Wo(e){return String(e||"_")}function Zo(e){const t=Yo()[Wo(e)];return t&&typeof t=="object"?{...t}:{}}function di(e,t,s){const n=s?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function ci(e,t,s,n){if(!t)return;const a=Wo(e),i=Yo(),r={...i[a]||{}},d=String(s||"").replace(/\s+/g," ").trim(),h=String(n||"").trim();!d||d===h?delete r[t]:r[t]=d,Object.keys(r).length?i[a]=r:delete i[a],li(i)}const ui=/^@(media|supports|container|layer|scope)\b/i;function hi(e){const t=String(e||""),s=[];let n=0,a=0;for(;n<t.length;){if(t[n]==="{"&&t[n+1]==="{"){const d=t.indexOf("}}",n+2);n=d===-1?t.length:d+2;continue}if(t[n]==="/"&&t[n+1]==="*"){const d=t.indexOf("*/",n+2);n=d===-1?t.length:d+2;continue}if(t[n]==='"'||t[n]==="'"){const d=t[n];for(n+=1;n<t.length&&t[n]!==d;)n+=t[n]==="\\"?2:1;n+=1;continue}if(t[n]!=="{"){n+=1;continue}let i=1,r=n+1;for(;r<t.length&&i>0;){if(t[r]==="{"&&t[r+1]==="{"){const d=t.indexOf("}}",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==="/"&&t[r+1]==="*"){const d=t.indexOf("*/",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==='"'||t[r]==="'"){const d=t[r];for(r+=1;r<t.length&&t[r]!==d;)r+=t[r]==="\\"?2:1;r+=1;continue}t[r]==="{"?i+=1:t[r]==="}"&&(i-=1),r+=1}s.push({selector:t.slice(a,n).trim(),body:t.slice(n+1,r-1),from:a,to:r,text:t.slice(a,r).trim()}),n=r,a=r}return s}function mo(e){const t=String(e||""),s=new Set,n=new Set,a=new Set;for(const i of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const r of i[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))r&&(s.add(r),s.add(r.replace(/([:./%!#()[\],])/g,"\\$1")));for(const i of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))i[2].trim()&&n.add(i[2].trim());for(const i of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))a.add(i[1].toLowerCase());return{classes:s,ids:n,tags:a}}function vo(e,t){const s=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),n=[...s.matchAll(/\.((?:\\.|[\w-])+)/g)].map(r=>r[1]),a=[...s.matchAll(/#((?:\\.|[\w-])+)/g)].map(r=>r[1]);if(n.length||a.length){const r=d=>d.replace(/\\(.)/g,"$1");return n.every(d=>t.classes.has(d)||t.classes.has(r(d)))&&a.every(d=>t.ids.has(r(d)))}const i=[...s.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(r=>r[2].toLowerCase());return i.length>0&&i.every(r=>t.tags.has(r))}function pi(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function fi(e,t,s){const n=pi(e);if(!n.length)return"keep";const a=n.filter(r=>vo(r,t));return a.length?a.length===n.length&&!n.some(r=>vo(r,s))?"move":"copy":"keep"}function Jo(e,t,s){const n=String(e||""),a=mo(t),i=mo(s),r=[],d=[];let h=0;for(const k of hi(n)){const m=n.slice(k.from,k.to),f=m.match(/^\s*/)[0];if(h=k.to,ui.test(k.selector)){const b=Jo(k.body,t,s);b.move.trim()&&r.push(`${k.selector} {
${b.move.trim()}
}`),b.keep.trim()&&d.push(`${f}${k.selector} {
${b.keep.trim()}
}`);continue}const y=k.selector.startsWith("@")?"keep":fi(k.selector,a,i);if(y==="move"){r.push(k.text);continue}y==="copy"&&r.push(k.text),d.push(m)}return d.push(n.slice(h)),{move:r.join(`

`).trim(),keep:d.join("").replace(/\n{3,}/g,`

`).trim()}}const mi="/!/sve/component";function vi(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let s=null;for(const n of t){if(!n.trim())continue;const a=n.match(/^[ \t]*/)[0].length;s=s===null?a:Math.min(s,a)}return s?t.map(n=>n.slice(s)).join(`
`):t.join(`
`)}function gi(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function yi(e,t){if(!hs(e))return"";try{return await(await On(()=>import("./tw-compile-AWaJHJyk.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(s){return console.error("[sve] component tailwind compile",s),""}}async function ki(e,t){const s=await e.fetch(mi,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":Ft(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!s.ok){const n=new Error(String(s.status));throw n.status=s.status,n}return s.json()}function go(e,t){const{from:s,to:n}=us(e,t),a=e.slice(s,n);if(!a.trim())return null;const i=e.slice(0,s)+e.slice(n),r=x("dock:css"),d=Jo(typeof r=="string"?r:"",a,i);return{html:vi(a),css:d.move,keepCss:d.keep,lead:gi(a),from:s,to:n}}function bi(e,t,{onDone:s,onError:n}={}){if(x("dock:is-locked")===!0)return;const a=x("dock:html");if(typeof a!="string"||!t)return;const i=go(a,t);if(!i)return;const r=_e(e.document,Rn,{heading:u(e,"component_new"),nameLabel:u(e,"component_name"),placeholder:u(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:u(e,"cancel"),saveLabel:u(e,"component_create"),onOk:d=>{r.dismiss(),(async()=>{try{const h=await yi(e,i.html),k=x("dock:html"),m=typeof k=="string"&&k===a?i:go(k,t);if(!m)return;const f=await ki(e,{name:d,html:m.html,css:m.css,js:"",tw:h}),y=x("dock:html"),b=y.slice(0,m.from)+m.lead+f.tag+y.slice(m.to);x("dock:set-html",b),m.css.trim()&&x("dock:set-css",m.keepCss),s?.(f)}catch(h){n?.(h)}})()}})}function _i(e,t,s){const n=String(e||"");if(!t||t.kind!=="antlers")return n;const a=String(s||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?wi(n,t,a):t.tag==="else"||!a?n:n.slice(0,t.from)+`{{ ${t.tag} ${a} }}`+n.slice(t.openTo)}function Lt(e,t,s,n){return De(e,t,{kind:s,name:n})}function De(e,t,s={}){const n=String(e||"");if(!t||t.antlers!=="loop")return n;const a=t.loopKind==="collection"?"collection":"field",i=s.kind??a,r=String(s.name??t.expr??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(r))return n;const d=s.sortDir??t.sortDir??"",h=String(s.sortField??t.sortField??"").trim(),k=String(s.limit??t.limit??"").trim(),m=Qo(n,t);if(!m)return n;const f=i===a?t.params:"",y=i==="collection"?Ti(r,h,d,k,f):xi(r,h,d,k,f),b=i==="collection"?"collection":r;return n.slice(0,t.from)+y+n.slice(t.openTo,m.from)+`{{ /${b} }}`+n.slice(m.to)}function Ti(e,t,s,n,a){const i=Si(a).replace(/\bsort\s*=\s*["'][^"']*["']/g,"").replace(/\blimit\s*=\s*["']?\d+["']?/g,"").replace(/\s+/g," ").trim(),r=[`collection from="${e}"`];return s==="random"?r.push('sort="random"'):t&&r.push(`sort="${t}${s==="desc"?":desc":":asc"}"`),n&&r.push(`limit="${n}"`),i&&r.push(i),`{{ ${r.join(" ")} }}`}function xi(e,t,s,n,a){const i=String(a||"").split("|").map(d=>d.trim()).filter(d=>d&&!/^from\s*=/.test(d)&&!/^sort\s*:/.test(d)&&!/^reverse$/.test(d)&&!/^shuffle$/.test(d)&&!/^limit\s*:/.test(d)),r=[e,...i];return s==="random"?r.push("shuffle"):t&&(r.push(`sort:${t}`),s==="desc"&&r.push("reverse")),n&&r.push(`limit:${n}`),`{{ ${r.join(" | ")} }}`}function Si(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function Qo(e,t){const n=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return n?{from:t.from+n.index,to:t.from+n.index+n[0].length}:null}function wi(e,t,s){return De(e,t,{name:s})}function Ci(e,t,s){const n=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return n;const a=Qo(n,t);if(!a)return n;const r=(n.slice(0,a.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],d=s==="else"?"{{ else }}":"{{ elseif true }}";return`${n.slice(0,a.from)}${d}
${r}${n.slice(a.from)}`}const U=gs("sve-call-values"),Ve=new Set;let yo=null;const $i="__sve-html-tree-style";function Li(e,t,s){if(t||s)return!1;const n=String(x("dock:chrome-kind")||"");if(n==="header"||n==="footer")return!1;const a=Io(e);return!!a&&a!=="create"&&Un(e)!==zn(e)}function en(e){return{sectionLoops:Ho(e),sectionsLabel:u(e,"html_tree_sections_slot")}}function ko(e,t){if(e.kind==="slot")return!1;for(let s=0;s<t.length;s+=2)if(e.from<=t[s]&&e.to>=t[s+1])return!0;return!1}function Pi(e,t){const s={entry:t,text:"",note:u(e,"html_tree_page_template_note"),openLabel:u(e,"html_tree_open_template"),canOpen:!1,onOpen:null};return Oo(e,{entry:t}).then(n=>{!n||o.pageTemplate?.entry!==t||(o.pageTemplate={...o.pageTemplate,text:u(e,"html_tree_page_template",{name:n.name}),canOpen:!!n.open,onOpen:n.open?a=>Xn(e,a,n.open):null})}),s}function Ei(e,t){const s=t.replace(/^view:/,"");if(!s||x("dock:current-type")!==t){o.usedBy=null;return}o.usedBy?.view!==s&&(o.usedBy=null,Oo(e,{view:s}).then(n=>{if(!n||x("dock:current-type")!==t)return;const a=n.everything?u(e,"html_tree_used_by_everything"):n.used_by.length?n.used_by.join(", "):u(e,"html_tree_used_by_nobody");o.usedBy={view:s,label:u(e,"html_tree_used_by"),text:a}}))}const K=new Set;let Pt="",Se=!1,kt=null,Pe=!0,J="",Le=0,tn="";const de=new Map,Ce=new Set;let G="",on=!1,F=null,Ze=null,ze="",Je="",Qe=0,Et=null,$e=[],ve=null,Fe=null,et=null,tt=null,Ht=null,ke=!1,ge=null,Ke=null,Be=null,ot=null,nt=null,It=null,fe=null;function W(e){return e.getElementById(Ye)}function Hi(e){Fn(e,$i,`
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
      ${io("light")}
      /* How much of a row's own colour its pick takes: a wash, not a fill.
         The row mixes it in below — a mix written up here would read
         --sve-ht-c on the list, where no family is set. */
      --sve-ht-pick-mix: 11%;
      --sve-ht-pick-hover-mix: 18%;
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${io("dark")}
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
  `)}function z(){const e=x("dock:html");return typeof e=="string"?e:""}function nn(e){return!!x("dock:is-open",e)}function Ee(e,{save:t=!1}={}){return Yt()||x("dock:set-html",e)!==!0?!1:(t&&x("dock:save-now"),!0)}function bt(e){const t=x("dock:component-exit-state")||{};if(o.exitOpen=!!t.open,!t.open){o.onExit=null;return}o.exitName=t.name||"",o.exitLabel=u(e,"component_exit"),o.exitTitle=u(e,t.back?"component_exit_back":"component_exit_close"),o.onExit=()=>{x("dock:exit-component"),A(e)}}function sn(e,t){const s=Qn(e);if(!s||t.type!==s)return"";const n=es(t[s]);return n&&ts(e,n)?.section_type||""}const be=[];let _t=!1,At=!1;function Tt(e,t){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(t,{timeout:2e3});return}e.setTimeout(t,200)}function Ii(e,t){for(const s of t){const n=s.type;!n||de.has(n)||Ce.has(n)||be.includes(n)||be.push(n)}Bt.htmlTreePrefetchArmed&&Xt(e)}function wl(e){Bt.htmlTreePrefetchArmed=!0,Xt(e)}function Xt(e){if(_t||!be.length)return;_t=!0;const t=()=>{const s=be.shift();if(!s){_t=!1;return}if(de.has(s)||Ce.has(s)){Tt(e,t);return}Ce.add(s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(s)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{typeof n?.html=="string"&&(de.set(s,n.html),At&&(At=!1,A(e)))}).catch(()=>{}).finally(()=>{Ce.delete(s),Tt(e,t)})};Tt(e,t)}function Yt(){return!!G}function Ai(e){const t=new Map,s=lt(e);if(!s)return t;for(const n of s.querySelectorAll("[data-sid]")){const a=n.getAttribute("data-sid");a&&!t.has(a)&&t.set(a,n.tagName.toLowerCase())}return t}function ht(e,t){const s=dt(e)||"page_sections",n=Ai(e),a=[];for(const i of Nt(t)||[]){const r=jt(i.values),d=r&&typeof r=="object"?r[s]:null;if(Array.isArray(d)){d.forEach(h=>{if(!h||typeof h!="object"||Array.isArray(h)||typeof h.type!="string")return;const k=[h._visual_id,h.id,h._id].filter(_=>typeof _=="string"&&_!=="");if(!k.length)return;const m=sn(e,h)||h.type,f=typeof h._sve_label=="string"?h._sve_label.trim():"",y=k.map(_=>n.get(_)).find(Boolean)||"section",b=Zo(h.type)[`0:${y}`];a.push({uid:k[0],ids:k,type:h.type,tag:y,label:f||(typeof b=="string"&&b.trim()?b.trim():"")||ct(e,m)?.display||Ne(m)||m,svg:Bo(y,"",null).svg||we.section,cat:Mo(y),enabled:h.enabled!==!1,static:oa(e,m)})});break}}return a}function Mi(e,t,s){if(!s.length)return"";const n=x("dock:current-type")||"",a=x("dock:current-uid"),i=!!x("dock:component-exit-state")?.open;if(a){const r=Vt(a,t),d=s.find(h=>h.ids.some(k=>r.includes(k)));if(d&&(i||d.type===n))return d.uid}return s.find(r=>r.type===n)?.uid||""}function Ri(e,t,s,n){const a=t.find(_=>_.uid===s),i=x("dock:component-src"),r=x("dock:type-stack")||[];if(!a||!i||!r.length)return null;const d=r.map(_=>_.type).filter(_=>!de.get(_));if(d.length)return Oi(e,d),null;const h=[],k=new Set,m=new Set;let f=_=>h.push(..._),y=null,b=0;for(let _=0;_<r.length;_+=1){const O=_+1<r.length?r[_+1].src:i,T=N=>({...N,id:`ctx${_}:${N.id}`,path:`ctx${_}/${N.path}`,ctxLevel:_,children:N.children.map(T)}),v=ut(de.get(r[_].type)).map(T),$=[],I=(N,ne)=>{for(const B of N){if(B.kind==="component"&&B.src===O)return $.push(...ne,B),B;const D=I(B.children,[...ne,B]);if(D)return D}return null};if(y=O?I(v,[]):null,!y)return null;const E=new Set($.map(N=>N.id)),R=(N,ne)=>{for(const B of N)B.children.length&&(E.has(B.id)?K.has(B.path):an(B,ne))&&k.add(B.id),R(B.children,ne+1)};R(v,b),f(v),m.add(y.id),b+=$.length,f=(N=>ne=>{N.children=ne})(y)}for(const _ of rn(n))k.add(_);return K.has(y.path)&&k.add(y.id),y.children=n,{tree:h,folds:k,hostId:y.id,hostIds:m,levels:r.length,rootId:h.find(_=>!_.kind)?.id||"",label:a.label,svg:a.svg,cat:a.cat}}function Oi(e,t){for(const s of t)!be.includes(s)&&!Ce.has(s)&&be.push(s);At=!0,Xt(e)}function Di(e,t,s){const n=x("dock:component-exit-state");if(n?.open)return Ne(n.name)||n.name||"";if(s)return t.find(i=>i.uid===s)?.label||"";const a=x("dock:current-type")||"";return ct(e,a)?.display||Ne(a)||""}function pt(e,t,s,n,a){const i=s.find(d=>d.uid===n);if(!i||n===a)return;K.clear(),F=null,Pe=!1,oe(),Ge(),J=n,tn=z(),G=de.get(i.type)||"",G&&(F=st(ut(G))||null),on=(x("dock:current-type")||"")===i.type,e.clearTimeout(Le),Le=e.setTimeout(()=>{J="",Se=!1,A(e)},4e3),A(e);const r=()=>ss(i.uid,t,e,{clampToSection:!0});Jn(i.uid,t,e,r),ce({source:ee,type:Q.SVE_ACTIVATE,ids:i.ids},e),e.setTimeout(()=>A(e),0)}function Mt(e,t){if(!t)return!1;for(const s of e||[])if(s.id===t||Mt(s.children,t))return!0;return!1}function st(e){for(const t of e||[]){if(!t.kind)return t.id;const s=st(t.children);if(s)return s}return""}function an(e,t){const s=t===0||e.path===Je;return K.has(e.path)?s:!s}function rn(e){const t=new Set,s=(n,a)=>{for(const i of n)i.children.length&&an(i,a)&&t.add(i.id),s(i.children,a+1)};return s(e,0),t}function A(e){const t=e.document,n=W(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;Hi(t),fs(e);const a=z();G&&G===a&&(G=""),x("dock:chrome-kind")&&(G="");const i=G||a,r=ut(i,en(e)),d=ms(i,Ho(e));$e=r,Je="";const h=x("dock:current-type")||"",k=Zo(h),m=Kn(e,t),y=!!(x("dock:component-exit-state")||{}).open,b=ht(e,t);h&&a&&!G&&de.set(h,a),Ii(e,b);const _=Mi(e,t,b);if(Li(e,m,y)){const c=Io(e);$e=[],o.rows=[],o.sections=[],o.frame=null,o.pageBuilder=!1,o.layoutFile=!1,o.usedBy=null,o.emptyText="",o.pageTemplate?.entry!==c&&(o.pageTemplate=Pi(e,c)),o.onRefresh=()=>A(e),o.onSection=null,bt(e),Oe(n,vt),xt(e,[]);return}o.pageTemplate=null,Ei(e,String(x("dock:collection-view")||""));const O=String(x("dock:chrome-kind")||"");if(qn(e),m&&!b.length&&!O){$e=[],o.rows=[],o.sections=[],o.frame=_o(e,[],!1,!1,"",!0),o.frameEmptyText=u(e,"html_tree_frame_no_sections"),o.pageBuilder=!0,o.layoutFile=!1,o.emptyText=u(e,"html_tree_empty"),o.canEdit=!x("dock:is-locked"),o.look=lo(e),o.onRefresh=()=>A(e),o.onSection=null,bo(e,""),bt(e),Oe(n,vt),xt(e,[]);return}o.pageBuilder=m;const T=`${h}|${_}`;let v=!1;T!==Pt&&(Pt=T,K.clear(),kt!==null&&i!==kt?v=!0:Se=i),(v||Se!==!1&&i!==Se)&&(Se=!1,K.clear(),F=st(r)||null),kt=i,J&&(J===_||!b.length)&&(on||i!==tn)&&(e.clearTimeout(Le),J="",Se=!1,Mt(r,F)||(K.clear(),F=st(r)||null));const $=b.some(c=>c.uid===J)?J:"",I=Pe?"":$||_,E=y?Ri(e,b,I,r):null,R=!!($||_),N=R||y?"":String(x("dock:chrome-kind")||""),B=m&&(!h&&!R||N==="main"&&x("dock:on-empty-page")===!0),D=B||N==="template"?"":N;o.layoutFile=D==="main",D!=="main"&&(ze="");const te=D==="main"?To(r,"main"):null,He=te?at(r,c=>c.tag==="body"&&Mt(c.children,te.id)):null;Je=He?He.path:"",te&&(Xe((He||te).path),ze!==T&&(Xe(te.path),K.add(te.path)));const Ie=D==="header"||D==="footer"?at(r,c=>i.slice(c.from,c.openTo).includes(`data-sve-chrome="${D}"`))||To(r,D):null;Ie&&Xe(Ie.path);const j=B||!(D==="main"?!!te:D==="header"||D==="footer"?!!Ie:!0)?[]:E?co(E.tree,o.query?new Set:E.folds):co(r,o.query?new Set:rn(r));!i.trim()&&!nn(t)?o.emptyText=u(e,"html_tree_need_dock"):o.emptyText=u(e,"html_tree_empty"),o.slotText=u(e,"antlers_drop_here"),o.dataTitle=u(e,"data_vars_title"),o.pageTitle=u(e,"component_props_page"),o.renameTitle=u(e,"html_tree_rename"),o.tagTitle=u(e,"tw_tag"),o.hideTitle=u(e,"html_tree_hide"),o.showTitle=u(e,"html_tree_show"),o.duplicateTitle=u(e,"html_tree_duplicate"),o.deleteTitle=u(e,"html_tree_delete"),o.videoHoldTitle=u(e,"html_tree_video_hold"),o.videoPlayTitle=u(e,"html_tree_video_play"),o.lockedTitle=u(e,"html_tree_locked"),o.searchEmpty=u(e,"html_tree_search_empty"),o.canEdit=!x("dock:is-locked"),o.look=lo(e),o.onQuery=()=>A(e),bt(e),o.inComponent=y,o.onContextRow=c=>{if(!E||c===E.hostId)return;const S=j.find(H=>H.id===c)?.ctxLevel??E.levels-1;x("dock:exit-component",E.levels-S),A(e)},o.onSelect=c=>{const S=j.find(H=>H.id===c);S&&Fo(e,S.path)||it(e,c,j)},o.onTwist=c=>{const S=j.find(H=>H.id===c)?.path;S&&(K.has(S)?K.delete(S):K.add(S),A(e))},o.onTagChange=(c,S)=>{const H=o.rows.find(re=>re.id===S);H&&!Yt()&&vs(e,c.currentTarget,H)},o.onRename=c=>Vi(e,c),o.onRenameCommit=()=>So(e,!0),o.onRenameCancel=()=>So(e,!1),o.onHide=c=>Gi(e,c),o.onVideoHold=c=>qi(e,c),o.onDuplicate=c=>Ui(e,c),o.onDelete=c=>Xi(e,c),o.onPointerDown=(c,S)=>el(e,c,S),o.onSectionPointerDown=(c,S)=>nl(e,c,S),o.onContext=(c,S)=>Ji(e,c,S),o.onInspectCommit=c=>cl(e,c),o.onPropValue=(c,S,H)=>$o(e,c,S,H),o.onPropPage=(c,S)=>ii(e,c,H=>$o(e,S,H,!1)),o.onLoopKind=c=>ul(e,c),o.onAddBranch=c=>hl(e,c),o.onLoopSortField=c=>{const S=rt(),H=String(c||"").trim();if(!S)return;const re=fe?.id===S.id?fe.dir:"",ie=S.sortDir||re||"asc";fe=null,ye(e,(xe,Ae)=>De(xe,Ae,{sortField:H,sortDir:ie}))},o.onLoopSortDir=c=>{const S=rt(),H=String(c||"");if(S){if((H==="asc"||H==="desc")&&!S.sortField){fe={id:S.id,dir:H},Ot(e,S);return}fe=null,ye(e,(re,ie)=>De(re,ie,{sortDir:H,sortField:H==="asc"||H==="desc"?ie.sortField:""}))}},o.onLoopLimit=c=>ye(e,(S,H)=>De(S,H,{limit:String(c||"").replace(/\D/g,"")})),o.onPropHost=c=>c?U.mount(c):U.unmount(),o.onInspectData=(c,S)=>{x("dock:data-menu",{anchor:c,at:j.find(H=>H.id===F)?.from,onPick:H=>S(String(H?.var||"").trim())})};const Qt=j.find(c=>!c.kind)?.id,eo=y?"":Di(e,b,I),ue=I&&!y?b.find(c=>c.uid===I):null,mn=Ao(e,String(x("dock:current-type")||""));let vn=0;const se=D==="header"||D==="footer"?D:"",Te=Ie?Ie.id:"",he=te&&j.find(c=>c.id===te.id)||null,to=He&&j.find(c=>c.id===He.id)||null,ae=to||he||Te&&j.find(c=>c.id===Te)||null,oo=ae?Bi(j,ae):-1;ae&&!j.slice(j.indexOf(ae),oo).some(c=>c.id===F)&&(F=ae.id);const no=o.layoutFile?Fi(e):null;o.rows=j.map(c=>{const S=no&&c.kind==="component"&&no.get(c.src)||"",H=c.tag==="body"&&!c.kind,re=S?{svg:we[S]}:Bo(c.tag,c.kind,c.antlers),ie=c.tag==="video"&&!c.kind?vn++:-1,xe=!!E&&c.id===E.rootId,Ae=c.id===Qt&&eo?eo:xe?E.label:c.klass,Ue=c.id===Qt;return{...c,tag:S||c.tag,frameCall:S,fixed:!!S||H||ko(c,d),holdsSections:ko(c,d),base:Ae,name:se&&c.id===Te?u(e,`html_tree_frame_${se}`):c===he?u(e,"html_tree_frame_main"):Ue&&ue?Ae:di(Ae,c.path,k),current:c.id===F,letter:xe?"":re.letter||"",svg:se&&c.id===Te?we[se]:c===he?we.main:Ue&&ue?ue.svg:xe?E.svg:re.svg||"",frame:se&&c.id===Te?se:c===he?"main":"",cat:se&&c.id===Te?se:c===he||H?"main":xe?E.cat:S||Mo(c.tag,c.kind,c.antlers),context:E?E.hostIds.has(c.id)?"host":c.id.startsWith("ctx")?"dim":"":"",sectionRoot:Ue&&ue?ue.uid:"",fieldsIcon:!!(Ue&&ue&&!ue.static),videoNth:ie,videoHeld:ie>=0&&mn.has(ie)}}),Gn(e);const ft=[];for(const c of o.rows)ft.length=c.depth,c.guides=ft.slice(),ft[c.depth]=c.cat;if(ae){const c=j.indexOf(ae),S=ae.depth;o.rows=o.rows.slice(c,oo).map(H=>({...H,depth:H.depth-S,guides:H.guides.slice(S)})),he&&ze!==T&&(ze=T,e.setTimeout(()=>it(e,he.id,j),0))}o.sections=m&&(R||D||B)?b.map(c=>{const S=!!I&&c.uid===I;return{...c,current:S,ready:S&&(!$||!!G),row:{id:`sec:${c.uid}`,section:c.uid,tag:c.tag,name:c.label,kind:"",svg:c.svg,cat:c.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:S,hidden:!c.enabled}}}):[],o.frame=_o(e,b,R,y,D,!1,!!to),o.frameEmptyText=u(e,"html_tree_frame_no_sections"),bo(e,D),o.onSection=c=>{ke||(Rt(e),pt(e,t,b,c,I))},o.onRefresh=()=>A(e),Ot(e,o.rows.find(c=>c.id===F)),Oe(n,vt),xt(e,r)}function bo(e,t){o.frameOpenTitle=u(e,"html_tree_frame_open"),o.frameMainTitle=u(e,"html_tree_frame_main_open"),o.frameTemplateTitle=u(e,"html_tree_frame_template_open"),o.frameFieldsTitle=u(e,"html_tree_frame_fields"),o.onFrame=s=>{t===s?Ni(e,s):xo(e,s)},o.onFrameEnter=s=>xo(e,s),o.onFrameFields=s=>ls(e,Yn(e,s),u(e,`html_tree_frame_${s}`)),o.onFrameTwist=()=>{o.mainShut=!o.mainShut}}function _o(e,t,s,n,a,i=!1,r=!1){if(!a&&!i||r)return null;const d=m=>({id:`frame:${m}`,frame:m,synthetic:!0,tag:m,name:u(e,`html_tree_frame_${m}`),kind:"",svg:we[m]||"",cat:m,letter:"",depth:0,hasChildren:m==="main"&&(t.length>0||a==="template"),shut:m!=="main",current:!1,hidden:!1}),h={kind:a,header:d("header"),main:d("main"),footer:d("footer"),template:null},k=a&&a!=="template"?String(x("dock:collection-view")||""):"";return k&&(h.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:ct(e,k)?.display||Ne(k.replace(/^view:/,"")),kind:"",svg:we.section,cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),h}function To(e,t){return at(e,s=>s.tag===t)}function at(e,t){for(const s of e||[]){if(!s.kind&&t(s))return s;const n=at(s.children,t);if(n)return n}return null}function Fi(e){const t=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},s=new Map;for(const n of["header","footer"]){const a=ys(t[n]?.type);a&&s.set(a,n)}return s}function Bi(e,t){let s=e.indexOf(t)+1;for(;s<e.length&&e[s].depth>t.depth;)s+=1;return s}function Ni(e,t){const s=lt(e);(t==="main"||t==="template"?s?.querySelector("main"):s?.querySelector(`[data-sve-chrome="${t}"]`))?.scrollIntoView({behavior:"smooth",block:"start"})}function Rt(e){const t=String(x("dock:chrome-open",e.document)||"");return t!=="header"&&t!=="footer"?!1:(Zn(e),ce({source:ee,type:Q.SVE_FORCE_EXIT_CHROME},e),!0)}function ji(e){e.clearTimeout(Le),J="",G="",K.clear(),F=null,Pe=!1,oe(),Ge()}function xo(e,t){if(e.document,String(x("dock:chrome-kind")||"")===t)return;if(ji(e),t==="main"){Rt(e),x("dock:open-file",ds);return}if(t==="template"){const i=String(x("dock:collection-view")||"");i&&(Rt(e),x("dock:open-file",i));return}if(t!=="header"&&t!=="footer")return;const s=lt(e)?.querySelector(`[data-sve-chrome="${t}"]`);s?(s.scrollIntoView({block:"nearest"}),s.dispatchEvent(new s.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:ee,type:Q.OPEN_CHROME,kind:t},e.location.origin);const n=Date.now(),a=async()=>{if(String(x("dock:chrome-kind")||"")!==t){Date.now()-n<3e4&&e.setTimeout(a,250);return}await(x("dock:load-settled")||null),fn(e)};e.setTimeout(a,250)}function xt(e,t){W(e.document)&&ln(e,t)}function ln(e,t){const s=t[0],n=!!x("dock:component-src"),a=n?"":x("dock:current-uid")||"";ce({source:ee,type:Q.SVE_HTML_PICK,on:!0,uid:a,uids:a?Vt(a,e.document):[],all:n,tag:s?.tag||"",klass:s?.klass||"",nodes:Is(t)},e)}function Xe(e){if(!e)return;const t=(s,n)=>{for(const a of s||[]){if(a.path===e)return!0;if(t(a.children,n+1))return n===0||a.path===Je?K.delete(a.path):K.add(a.path),!0}return!1};t($e,0)}function Vi(e,t){if(ke)return;const s=o.rows.find(n=>n.id===t);!s||s.kind||(F=t,o.rows.forEach(n=>{n.current=n.id===t}),o.editingId=t,o.draft=s.name,e.setTimeout(()=>{const n=W(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function So(e,t){const s=o.editingId;if(!s)return;const n=o.rows.find(a=>a.id===s);o.editingId=null,t&&n&&(n.sectionRoot?Ki(e,n.sectionRoot,o.draft):ci(x("dock:current-type")||"",n.path,o.draft,n.base||n.klass)),o.draft="",A(e)}function Ki(e,t,s){const n=dt(e)||"page_sections",a=String(s||"").replace(/\s+/g," ").trim();for(const i of Nt(e.document)||[]){const r=jt(i.values),d=r&&typeof r=="object"?r[n]:null;if(!Array.isArray(d))continue;const h=d.findIndex(y=>y&&typeof y=="object"&&[y._visual_id,y.id,y._id].includes(t));if(h===-1)continue;const k=sn(e,d[h])||d[h].type,m=ct(e,k)?.display||Ne(k)||k,f=JSON.parse(JSON.stringify(d));return f[h]={...f[h]},!a||a===m?delete f[h]._sve_label:f[h]._sve_label=a,i.setFieldValue(n,f),!0}return!1}function qi(e,t){const s=o.rows.find(d=>d.id===t);if(!s||!(s.videoNth>=0))return;const n=String(x("dock:current-type")||""),a=Ao(e,n),i=!a.has(s.videoNth);i?a.add(s.videoNth):a.delete(s.videoNth);const r=String(x("dock:current-uid")||"");Wn(e,n,a),ce({source:ee,type:Q.SVE_VIDEO_HOLD,uid:r,uids:r?Vt(r,e.document):[],nth:s.videoNth,on:i},e),A(e)}function Wt(e){return!!o.rows.find(t=>t.id===e)?.fixed}function Gi(e,t){Wt(t)||Zt(e,t,Ps)}function Ui(e,t){if(Wt(t))return;const s=o.rows.find(n=>n.id===t)?.sectionRoot;if(s){e.postMessage({source:ee,type:Q.DUPLICATE_ROW,uid:s},e.location.origin);return}Zt(e,t,Es)}function dn(e,t){os(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const s=e.document;as({uid:t},s,e)})}function zi(e,t,s){J===s&&(e.clearTimeout(Le),J="",G=""),F=null,Pe=!1,Pt="";const n=ht(e,t),a=n.find(i=>i.uid!==s)||n[0];a?pt(e,t,n,a.uid,""):(G="",o.rows=[],o.sections=[],o.frame=null,o.pageBuilder=!0,A(e)),e.setTimeout(()=>{W(e.document)&&A(e)},0)}Ro("row:removed",({uid:e,parentPath:t,doc:s,win:n})=>{t!==dt(n)||!W(n.document)||zi(n,s,e)});function Xi(e,t){if(Wt(t))return;const s=o.sections?.find(a=>a.row?.id===t),n=s?s.row?.section||s.uid:o.rows.find(a=>a.id===t)?.sectionRoot;if(n){dn(e,n);return}Zt(e,t,Hs)}function Zt(e,t,s){if(x("dock:is-locked"))return;const n=z(),a=o.rows.find(r=>r.id===t);if(!a)return;const i=s(n,a);i!==n&&Ee(i)}function oe(){ge?.dismiss(),ge=null}const Yi='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',Wi='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>';function cn(e,t){const s=o.sections?.find(h=>h.uid===t),n=s?.type||"";if(!n||!qo(e))return[];const a=s.label||n,i=na(e,n),r=()=>e.Statamic?.$toast?.error(u(e,"section_update_failed")),d=[{label:u(e,"static_section_insertable"),icon:i?Wi:Yi,onPick:()=>{oe(),ho(e,{handle:n,hidden:!i}).then(()=>{e.Statamic?.$toast?.success(u(e,i?"section_shown_to_editors":"section_hidden_from_editors",{name:a})),Ct(e)}).catch(r)}}];return s.static&&d.push({label:u(e,"section_add_fields"),onPick:()=>{oe(),ho(e,{handle:n,fields:!0}).then(()=>{e.Statamic?.$toast?.success(u(e,"section_fields_added",{name:a})),Ct(e),A(e),Do(e,n)}).catch(r)}}),d}function Zi(e,t,s){const n=s.row?.section||s.uid;n&&(ge=_e(e.document,qt,{items:[...cn(e,n),{label:u(e,"html_tree_remove_section"),danger:!0,onPick:()=>{oe(),dn(e,n)}}],x:t.clientX,y:t.clientY,onClose:()=>{ge=null}}))}function Ji(e,t,s){oe();const n=o.sections?.find(d=>d.row?.id===s);if(n){Zi(e,t,n);return}const a=o.rows.find(d=>d.id===s);if(!a)return;it(e,s,o.rows);const i={x:t.clientX,y:t.clientY},r=d=>{d.length&&(ge?.dismiss(),ge=_e(e.document,qt,{items:d,x:i.x,y:i.y,onClose:()=>{ge=null}}))};if(a.kind==="component"){Qi(e,a,r);return}a.kind==="slot"||a.holdsSections||o.canEdit&&r([...a.sectionRoot?cn(e,a.sectionRoot):[],{label:u(e,"component_make"),onPick:()=>{oe(),bi(e,a,{onDone:()=>A(e),onError:d=>{e.alert(d?.status===409?u(e,"component_exists"):u(e,"component_failed"))}})}}])}const wo=(e,t)=>{oe(),x("dock:open-template",t)};function Qi(e,t,s){if(!bs(t.src)){s([{label:u(e,"component_open_named",{name:t.name||t.src}),onPick:()=>wo(e,`view:partials/${t.src}`)}]);return}s([{label:u(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const a=Array.isArray(n.items)?n.items:[];s(a.length?a.map(i=>({label:u(e,"component_open_named",{name:i.label}),onPick:()=>wo(e,i.type)})):[{label:u(e,"component_none"),onPick:null}])}).catch(()=>s([{label:u(e,"component_none"),onPick:null}]))}function el(e,t,s){if(t.button!==0||x("dock:is-locked")||o.editingId||t.target?.closest?.("button, input"))return;Ge(),ve=s,Fe={x:t.clientX,y:t.clientY},et=t.currentTarget,tt=t.pointerId;const n=i=>tl(e,i),a=i=>ol(e,i);Ht=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),Ht=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function tl(e,t){if(!ve||!Fe)return;const s=t.clientX-Fe.x,n=t.clientY-Fe.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{et?.setPointerCapture?.(tt)}catch{}}t.preventDefault();const a=e.document.elementFromPoint(t.clientX,t.clientY),i=a?.closest?.("[data-sve-ht-slot]");if(i){const f=i.getAttribute("data-sve-ht-id");if(f&&f!==ve){o.dropId=f,o.dropPlace="inside";return}}const r=a?.closest?.("[data-sve-ht-row]"),d=r?.getAttribute("data-sve-ht-id");if(!d||d===ve){o.dropId=null,o.dropPlace=null;return}const h=o.rows.find(f=>f.id===d),k=o.rows.find(f=>f.id===ve);if(!h||h.context||k&&h.path.startsWith(`${k.path}/`)){o.dropId=null,o.dropPlace=null;return}const m=r.getBoundingClientRect();o.dropId=d,o.dropPlace=$s(t.clientY-m.top,m.height,!jo(h.tag)&&!No(h))}function ol(e,t){const s=ve,n=o.dropId,a=o.dropPlace||"after",i=o.dragging;if(Ge(),i&&(ke=!0,e.setTimeout(()=>{ke=!1},0)),!i||x("dock:is-locked")||!s||!n||s===n)return;t?.preventDefault?.();const r=z(),d=Ls(r,$e,s,n,a);d!==r&&Ee(d)}function Ge(){try{et?.releasePointerCapture?.(tt)}catch{}Ht?.(),ve=null,Fe=null,et=null,tt=null,o.dragging=!1,o.dropId=null,o.dropPlace=null}function nl(e,t,s){if(t.button!==0||!s||o.editingId||t.target?.closest?.("button, input"))return;un(),Ke=s,Be={x:t.clientX,y:t.clientY},ot=t.currentTarget,nt=t.pointerId;const n=i=>sl(e,i),a=i=>al(e,i);It=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),It=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function sl(e,t){if(!Ke||!Be)return;const s=t.clientX-Be.x,n=t.clientY-Be.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{ot?.setPointerCapture?.(nt)}catch{}}t.preventDefault();const i=e.document.elementFromPoint(t.clientX,t.clientY)?.closest?.("[data-sve-ht-sec-uid]"),r=i?.getAttribute("data-sve-ht-sec-uid")||"";if(!r||r===Ke){o.sectionDrop=null;return}const d=i.getBoundingClientRect();o.sectionDrop={uid:r,place:t.clientY-d.top<d.height/2?"before":"after"}}function al(e,t){const s=Ke,n=o.sectionDrop,a=o.dragging;un(),a&&(ke=!0,e.setTimeout(()=>{ke=!1},0)),!(!a||!s||!n?.uid||n.uid===s)&&(t?.preventDefault?.(),rl(e,s,n.uid,n.place))}function un(){try{ot?.releasePointerCapture?.(nt)}catch{}It?.(),Ke=null,Be=null,ot=null,nt=null,o.dragging=!1,o.sectionDrop=null}function rl(e,t,s,n){const a=dt(e)||"page_sections";for(const i of Nt(e.document)||[]){const r=jt(i.values),d=r&&typeof r=="object"?r[a]:null;if(!Array.isArray(d))continue;const h=y=>d.findIndex(b=>b&&typeof b=="object"&&[b._visual_id,b.id,b._id].includes(y)),k=h(t),m=h(s);if(k===-1||m===-1||k===m)return!1;let f=n==="before"?m:m+1;return k<f&&(f-=1),f===k?!1:(e.postMessage({source:ee,type:Q.MOVE,uid:t,toIndex:f},e.location.origin),e.setTimeout(()=>A(e),60),!0)}return!1}function hn(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function Ot(e,t){if(t?.kind==="component"){il(e,t);return}if(Y.callOpen&&(Y.callOpen=!1,Y.callStore=null,U.forget(),Gt(e)),t?.kind!=="antlers"){o.inspect=null;return}const s=t.id;if(t.tag==="else"){o.inspect={key:s,title:u(e,"antlers_condition"),mode:"note",note:u(e,"antlers_else_note")};return}if(t.antlers==="loop"){const n=t.loopKind==="collection",a=fe?.id===t.id?fe.dir:"",i=t.sortDir||a;o.inspect={key:s,title:u(e,"antlers_loop"),mode:"loop",loopKind:n?"collection":"field",kinds:[{id:"field",label:u(e,"antlers_loop_field")},{id:"collection",label:u(e,"antlers_loop_collection")}],collections:hn(e),value:t.expr||"",placeholder:u(e,n?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:u(e,"antlers_sort"),dir:i,needsField:i==="asc"||i==="desc",field:t.sortField||"",pickable:!n,placeholder:u(e,n?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:u(e,"antlers_sort_none")},{id:"asc",label:u(e,"antlers_sort_asc")},{id:"desc",label:u(e,"antlers_sort_desc")},{id:"random",label:u(e,"antlers_sort_random")}]},limit:{title:u(e,"antlers_limit"),value:t.limit||"",placeholder:u(e,"antlers_limit_placeholder")},branches:[]};return}o.inspect={key:s,title:u(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:u(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:u(e,"antlers_add_elseif")},{id:"else",label:u(e,"antlers_add_else")}]}}function il(e,t){if(!_s(e)){o.inspect=null;return}if(!t.src)return;const s=t.id;if(o.inspect={key:s,title:u(e,"component_props_values"),mode:"note",note:u(e,"code_dock_loading")},Ts()){const n={},a={},i=new Map;for(const[r,d]of xs(z().slice(t.from,t.to))){const h=Ss(r);h&&(r!==h||!i.has(h))&&i.set(h,d)}for(const[r,d]of i)d.bound?a[r]=d.value:n[r]=d.value;yo!==s&&(yo=s,Ve.clear());for(const r of Ve)r in a||(a[r]="");o.inspect=null,Y.callOpen=!0,Y.title=Y.title||u(e,"component_props"),Y.callTitle=t.klass||t.name||t.src,Y.callStore=U.ui,U.ui.canBind=!0,U.ui.dataTitle=u(e,"data_vars_title"),U.ui.exprPlaceholder=u(e,"component_props_expr"),U.ui.onToggleBind=(r,d)=>dl(e,r,d),U.ui.onExpr=(r,d)=>Co(e,r,d),U.ui.onPickData=(r,d)=>x("dock:data-menu",{anchor:d,at:t.from,onPick:h=>Co(e,r,String(h?.var||"").trim())}),U.load(e,{key:`${t.src}::${s}`,src:t.src,params:n,bindings:a,readOnly:x("dock:is-locked")===!0}),U.watch(e,{src:t.src,write:r=>ll(e,r,a)}),Gt(e);return}ws(e,t.src).then(n=>{if(o.inspect?.key===s){if(!n.length){o.inspect={key:s,title:u(e,"component_props_values"),mode:"note",note:u(e,"component_props_values_none")};return}o.inspect={key:s,title:u(e,"component_props_values"),mode:"props",inheritLabel:u(e,"component_props_inherit"),rows:Cs(n,z().slice(t.from,t.to))}}})}function ll(e,t,s={}){const n=o.rows.find(r=>r.id===F);if(n?.kind!=="component"||x("dock:is-locked"))return;let a=z(),i=n.to;for(const[r,d]of Object.entries(t||{})){if(r in s)continue;const h=a.length,k=Ut(a,{from:n.from,to:i},r,d);k!==a&&(i+=k.length-h,a=k)}a!==z()&&(Ee(a,{save:!0}),A(e))}function dl(e,t,s){s?Ve.add(t):Ve.delete(t),pn(e,t,"",s),A(e)}function Co(e,t,s){Ve.add(t),pn(e,t,s,!0),A(e)}function pn(e,t,s,n){const a=o.rows.find(d=>d.id===F);if(a?.kind!=="component"||x("dock:is-locked"))return;const i=z(),r=Ut(i,a,t,s,{bound:n});r!==i&&Ee(r,{save:!0})}function rt(){const e=o.rows.find(t=>t.id===F);return e?.kind==="antlers"&&!x("dock:is-locked")?e:null}function ye(e,t){const s=rt();if(!s)return;const n=z(),a=t(n,s);a!==n&&(Ee(a),A(e))}function $o(e,t,s,n){const a=o.rows.find(d=>d.id===F);if(a?.kind!=="component"||x("dock:is-locked"))return;const i=z(),r=Ut(i,a,t,s,{bound:n});r!==i&&(Ee(r,{save:!0}),A(e))}function cl(e,t){ye(e,(s,n)=>n.antlers==="loop"?Lt(s,n,n.loopKind==="collection"?"collection":"field",t):_i(s,n,t))}function ul(e,t){const s=rt();if(!s||s.antlers!=="loop")return;const n=s.loopKind==="collection"?"collection":"field";if(t!==n){if(t==="collection"){const a=hn(e)[0]?.handle;if(!a)return;ye(e,(i,r)=>Lt(i,r,"collection",a));return}ye(e,(a,i)=>Lt(a,i,"field",i.handle||"items"))}}function hl(e,t){ye(e,(s,n)=>Ci(s,n,t))}function pl(e,t){if(!e||!t||No(t)||jo(t.tag))return null;const s=ks(e,t);if(s<t.openTo)return null;const n=e.lastIndexOf(`
`,s-1)+1;return e.slice(n,s).trim()===""&&n>t.openTo?n-1:s}function it(e,t,s){if(ke)return;const n=(s||o.rows).find(a=>a.id===t);n&&(F=t,o.rows.forEach(a=>{a.current=a.id===t}),Ot(e,n),!Yt()&&(x("dock:reveal-html",{from:n.from,to:n.to,caret:pl(z(),n)}),x("dock:tw-follow"),ce({source:ee,type:Q.SVE_HTML_PICK_FOCUS,path:n.path},e)))}function fl(e,t){if(!t)return"";const s=[],n=(a,i)=>{for(const r of a||[]){const d=i||r.path===e;r.kind==="component"&&r.src===t&&s.push({path:r.path,inside:d}),n(r.children,d)}};return n($e,!1),(s.find(a=>a.inside)||s[0])?.path||""}function ml(e,t){if(!t||!W(e.document))return;Pe=!1,Xe(t),A(e);const s=o.rows.find(n=>n.path===t);s&&(it(e,s.id,o.rows),e.setTimeout(()=>{W(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function Dt(e){if(Ze)return;const t=()=>{o.editingId||o.dragging||(e.clearTimeout(Qe),Qe=e.setTimeout(()=>{W(e.document)&&A(e)},80))},s=()=>{if(t(),x("dock:on-empty-page")===!0){const n=ht(e,e.document);n[0]&&pt(e,e.document,n,n[0].uid,"")}};Ze=Ro("dock:html-changed",t),e.document.addEventListener("sve-page-structure",s),Et=()=>{e.document.removeEventListener("sve-page-structure",s)}}function vl(e){Ze?.(),Ze=null,Et?.(),Et=null,e?.clearTimeout?.(Qe),Qe=0}function Jt(e){const t=W(e.document);if(ce({source:ee,type:Q.SVE_HTML_PICK,on:!1},e),vl(e),U.forget(),Y.callOpen=!1,Y.callStore=null,Gt(e),Ge(),oe(),ps(e),F=null,o.inspect=null,o.editingId=null,o.draft="",o.sections=[],o.pageBuilder=!1,o.layoutFile=!1,J="",e?.clearTimeout?.(Le),!t){wt(e);return}t.remove(),Bt.headerTab==="html_tree"&&ns(e,null),Dn(e),Po(e),Eo(e),wt(e)}function Cl(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=Ye,Oe(t,Uo,{title:u(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>Jt(e)))}function $l(e){Dt(e),A(e)}function fn(e){const t=e.document;if(!Bn(e,"html_tree"))return;if(W(t)){Dt(e),A(e);return}if(!nn(t))return;Pe=!0,K.clear(),Nn(e,[Ye]);const s=t.createElement("div");s.id=Ye,s.style.cssText=jn,Oe(s,Uo,{title:u(e,"html_tree")}),s.querySelector("[data-sve-close]")?.addEventListener("click",()=>Jt(e)),Vn(e,s),Po(e),Eo(e),wt(e),Dt(e),A(e)}function Ll(e){if(W(e.document)){Jt(e);return}fn(e)}Kt("html-tree:open-section",e=>{const t=window,s=t.document,n=ht(t,s),a=n.find(i=>i.uid===e||i.ids.includes(e));return a?(pt(t,s,n,a.uid,""),{uid:a.uid,ids:a.ids}):null});Kt("html-tree:from-preview",({path:e,src:t}={})=>{Fo(window,e)||ml(window,fl(e,t)||e)});Kt("html-tree:arm-pick",e=>{const t=window;return e?(ln(t,ut(z(),en(t))),!0):(W(t.document)||ce({source:ee,type:Q.SVE_HTML_PICK,on:!1},t),!0)});function Pl(){de.clear(),Ce.clear(),be.length=0}export{$i as HTML_TREE_STYLE_ID,wl as armHtmlTreePrefetch,Pl as clearHtmlTreeTemplates,oe as closeHtmlTreeMenu,Jt as closeHtmlTreePanel,Hi as ensureHtmlTreeStyles,Cl as fillHtmlTreePane,F as htmlTreeActiveId,W as htmlTreePanel,Qe as htmlTreeTimer,Ze as htmlTreeUnhook,fn as openHtmlTreePanel,A as renderHtmlTree,$l as showHtmlTreePane,vl as stopWatchHtmlTreeDock,Ll as toggleHtmlTreePanel,Dt as watchHtmlTreeDock};
