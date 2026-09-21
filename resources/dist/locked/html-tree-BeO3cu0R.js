const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-CV7No16T.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{_ as Ce,k as B,l as Pn,p as me,o as g,a as y,b as T,s as _,t as w,F as R,w as ve,d as z,b5 as $n,g as P,v as tt,b6 as En,y as b,h as f,j as ie,C as Hn,i as ht,b7 as wt,b8 as Ct,b9 as An,ba as In,bb as Rn,bc as Mn,a7 as Vt,z as he,aq as Dn,bd as o,u as d,f as On,e as Bn,q as J,x as Fn,be as $e,bf as jn,B as ge,c as fe,N as qn,G as Kn,aO as pt,ar as nt,an as Nn,aQ as Gt,aR as zt,ag as Vn,ah as Lt,S as Ee,V as He,O as Gn,aP as zn,ao as Un,ap as Xn,bg as Pt,bh as Yn,U as Ut,A as Xt,a6 as Le,J as Ke,K as Ne,ay as ft,az as Ae,I as Wn,bi as Zn,aT as Jn,aU as Qn,ax as eo,bj as to,b1 as no,af as mt,aL as oo,aG as so}from"./addon-7CU3TZZa.js";import{M as le,S as ce}from"./protocol-D3FYhCm9.js";import{canEditFields as ao,currentSetHandle as ro,openFieldsetOverlay as Yt}from"./section-fields-Cuz3Z2QZ.js";import{D as V,E as io,F as vt,G as lo,t as co,I as gt,v as uo,z as ho,b as Ve,l as $t,J as Wt,q as po,K as Zt,L as fo,H as mo,M as yt,N as Jt,O as vo,h as go,c as yo,Q as ko,R as bo,S as _o,T as xo,U as To,V as So,W as wo,X as Co,Y as Lo,Z as Po}from"./tw-classes-mYWZS_x-.js";import{a as $o}from"./html-pick-align-CK-9iH9_.js";import"./ai-text-icon-B7uCWIwa.js";import"./FieldsetOverlay-DzWKN7K-.js";const Eo={class:"sve-dialog__title"},Ho={for:"sve-new-section-group"},Ao={class:"sve-dialog__row"},Io=["disabled"],Ro=["value"],Mo=["title","aria-label"],Do={key:0,class:"sve-dialog__add-group"},Oo={for:"sve-new-section-group-name"},Bo={class:"sve-dialog__row"},Fo=["placeholder","disabled"],jo=["disabled"],qo=["disabled"],Ko={for:"sve-new-section-name"},No=["placeholder"],Vo={key:1,class:"sve-dialog__toggle"},Go={key:2,class:"sve-dialog__note"},zo={class:"sve-dialog__actions"},Uo=["disabled"],Xo=["disabled"],Yo={__name:"NewSectionPrompt",props:{heading:{type:String,required:!0},groupLabel:{type:String,required:!0},nameLabel:{type:String,required:!0},placeholder:{type:String,default:""},note:{type:String,default:""},groups:{type:Array,required:!0},toggleLabel:{type:String,default:""},toggleOn:{type:Boolean,default:!0},cancelLabel:{type:String,required:!0},saveLabel:{type:String,required:!0},onOk:{type:Function,required:!0},onClose:{type:Function,required:!0},addGroupLabel:{type:String,default:""},addGroupNameLabel:{type:String,default:""},addGroupPlaceholder:{type:String,default:""},onAddGroup:{type:Function,default:null}},setup(e){const t=e,s=B(""),n=B([...t.groups]),a=B(t.groups[0]?.key??""),i=B(!1),r=B(""),l=B(null),p=B(!1);function v(){i.value=!0,r.value="",me(()=>l.value?.focus())}function h(){i.value=!1,r.value="",me(()=>S.value?.focus())}async function c(){const H=r.value.trim();if(!H||p.value||!t.onAddGroup){l.value?.focus();return}p.value=!0;const L=await t.onAddGroup(H);if(p.value=!1,!L?.key){l.value?.focus();return}n.value.some(A=>A.key===L.key)||n.value.push(L),a.value=L.key,i.value=!1,r.value="",me(()=>S.value?.focus())}function u(H){H.key==="Enter"?(H.preventDefault(),c()):H.key==="Escape"&&(H.stopPropagation(),h())}const k=B(t.toggleOn),S=B(null),U=B(!1);Pn(()=>me(()=>S.value?.focus()));function Y(){const H=s.value.trim();if(!H||n.value.length&&!a.value||U.value){S.value?.focus();return}U.value=!0,t.onOk(H,a.value,k.value)}function F(H){H.target===H.currentTarget&&t.onClose()}function E(H){H.key==="Enter"?Y():H.key==="Escape"&&t.onClose()}return(H,L)=>(g(),y("div",{class:"sve-dialog-overlay",onClick:F},[T("div",{class:"sve-dialog",onClick:L[5]||(L[5]=_(()=>{},["stop"]))},[T("div",Eo,w(e.heading),1),n.value.length?(g(),y(R,{key:0},[T("label",Ho,w(e.groupLabel),1),T("div",Ao,[ve(T("select",{id:"sve-new-section-group","onUpdate:modelValue":L[0]||(L[0]=A=>a.value=A),disabled:i.value,onKeydown:E},[(g(!0),y(R,null,z(n.value,A=>(g(),y("option",{key:A.key,value:A.key},w(A.display),9,Ro))),128))],40,Io),[[$n,a.value]]),e.onAddGroup&&!i.value?(g(),y("button",{key:0,type:"button",class:"is-add",title:e.addGroupLabel,"aria-label":e.addGroupLabel,"data-sve-new-group":"",onClick:v},[...L[6]||(L[6]=[T("span",{"aria-hidden":"true"},"+",-1)])],8,Mo)):P("",!0)]),i.value?(g(),y("div",Do,[T("label",Oo,w(e.addGroupNameLabel||e.addGroupLabel),1),T("div",Bo,[ve(T("input",{id:"sve-new-section-group-name",ref_key:"groupInput",ref:l,"onUpdate:modelValue":L[1]||(L[1]=A=>r.value=A),type:"text",placeholder:e.addGroupPlaceholder,disabled:p.value,"data-sve-new-group-name":"",onKeydown:u},null,40,Fo),[[tt,r.value]]),T("button",{type:"button",class:"is-primary is-small",disabled:p.value,"data-sve-new-group-create":"",onClick:c},w(e.saveLabel),9,jo),T("button",{type:"button",class:"is-cancel is-small",disabled:p.value,onClick:h},w(e.cancelLabel),9,qo)])])):P("",!0)],64)):P("",!0),T("label",Ko,w(e.nameLabel),1),ve(T("input",{id:"sve-new-section-name",ref_key:"input",ref:S,"onUpdate:modelValue":L[2]||(L[2]=A=>s.value=A),type:"text",placeholder:e.placeholder,onKeydown:E},null,40,No),[[tt,s.value]]),e.toggleLabel?(g(),y("label",Vo,[ve(T("input",{"onUpdate:modelValue":L[3]||(L[3]=A=>k.value=A),type:"checkbox",onKeydown:E},null,544),[[En,k.value]]),T("span",null,w(e.toggleLabel),1)])):P("",!0),e.note?(g(),y("p",Go,w(e.note),1)):P("",!0),T("div",zo,[T("button",{type:"button",class:"is-cancel",disabled:U.value,onClick:L[4]||(L[4]=(...A)=>e.onClose&&e.onClose(...A))},w(e.cancelLabel),9,Uo),T("button",{type:"button",class:"is-primary",disabled:U.value,onClick:Y},w(e.saveLabel),9,Xo)])])]))}},Qt=Ce(Yo,[["__scopeId","data-v-6501522a"]]),kt="/!/sve/section-types",Et="static_sections";async function Wo(e){const t=await e.fetch(kt,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!t.ok)throw new Error(`section-types ${t.status}`);const s=await t.json();if(Array.isArray(s.groups)&&s.groups.length)return s.groups.filter(a=>a&&a.handle&&a.handle!==Et).map(a=>({key:a.handle,display:a.display||a.handle}));const n=new Map;for(const a of s.types||[])a?.group&&a.group!==Et&&!n.has(a.group)&&n.set(a.group,a.group_display||a.group);return[...n].map(([a,i])=>({key:a,display:i}))}async function Zo(e,t){const s=await e.fetch(`${kt}/groups`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":ht(e),"X-Requested-With":"XMLHttpRequest",Accept:"application/json"},body:JSON.stringify({display:t})}),n=await s.json().catch(()=>({}));if(!s.ok||!n.group?.handle)throw new Error(n?.error==="bad_name"?"bad_name":`section-types/groups ${s.status}`);return e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale")),{key:n.group.handle,display:n.group.display||n.group.handle}}const _e=new Map;function Jo(e){e?.handle&&_e.set(e.handle,{static:!!e.static,hidden:!!e.hidden})}function Qo(e,t){return t?_e.has(t)?_e.get(t).static:e.Statamic?.$config?.get?.("sveSetMeta")?.[t]?.static===!0:!1}function es(e,t){if(!t)return!1;if(_e.has(t))return _e.get(t).hidden;const s=e.Statamic?.$config?.get?.("sveSectionTypes");return Array.isArray(s)&&s.some(n=>n?.handle===t&&n.hidden===!0)}async function en(e,t,s){const n=await e.fetch(kt,{method:t,headers:{"Content-Type":"application/json","X-CSRF-TOKEN":ht(e),Accept:"application/json"},credentials:"same-origin",body:JSON.stringify(s)}),a=await n.json().catch(()=>({}));if(!n.ok){const i=new Error(a.error||`section-types ${n.status}`);throw i.reason=a.error,i}return Jo(a.section),a}function ts(e,{display:t,group:s="",static:n=!1,hidden:a=!1}){return en(e,"POST",{display:t,group:s,static:n,hidden:a})}function Ht(e,{handle:t,hidden:s,fields:n=!1}){const a={handle:t,fields:n};return typeof s=="boolean"&&(a.hidden=s),en(e,"PATCH",a)}async function ns(e,t,s=null,n=null){if(!t||typeof wt!="function"||typeof Ct!="function")return null;const a=await wt(e,t);if(!a)return null;n&&Array.isArray(a.definitions)&&An(t,{display:n.display||t,icon:n.icon||null,hide:n.hidden===!0,fields:a.definitions,group_display:n.group_display||n.group||""},n.group||"");const i=In(),r=Rn(e,"page",{handle:t},a?.defaults,i),l=Mn(r,a?.new||{},a?.defaults);return Ct(e,e.document,s,r,l)?r:null}const At=700,os=17;function ss(e,t){const s=(t||[]).filter(Boolean);if(!s.length)return;let n=0;const a=()=>{n+=1;const i=Vt(e),r=i?s.some(l=>i.querySelector(`[data-sid="${CSS.escape(l)}"]`)):!0;r&&he({source:ce,type:le.SVE_ACTIVATE,ids:s},e),(r?!i&&n<6:n<os)&&e.setTimeout(a,At)};e.setTimeout(a,At)}function tn(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function as(e){return new Promise(t=>{let s=!1;const n=i=>{s||(s=!0,a.dismiss(),t(i==="static"||i==="fields"?i:null))},a=ie(e.document,Hn,{title:f(e,"section_new_kind"),body:f(e,"section_new_kind_note"),buttons:[{value:"cancel",label:f(e,"cancel"),variant:"ghost"},{value:"static",label:f(e,"section_new_static"),variant:"primary"},{value:"fields",label:f(e,"section_new_with_fields"),variant:"primary"}],onPick:n,onClose:()=>n(null)})})}const rs=`<section class="[ ] py-800">
    
</section>
`;function is(e){if(b("dock:is-locked")===!0)return e.Statamic?.$toast?.error(f(e,"code_dock_locked")),!1;const s=`${String(b("dock:html")||"").replace(/\s+$/,"")}

${rs}`;return b("dock:set-html",s)!==!0?(e.Statamic?.$toast?.error(f(e,"section_new_failed")),!1):(b("dock:save-now"),e.Statamic?.$toast?.success(f(e,"section_new_template_done")),!0)}async function nn(e,t,s,{afterUid:n,onDone:a,onError:i}){try{const r=await ts(e,s);t.dismiss(),e.Statamic?.$toast?.success(f(e,"section_created",{name:r.section?.display||s.display})),ot(e);const l=r.section?.handle?{...r.section,group_display:(r.section_types||[]).find(v=>v?.handle===r.section.handle)?.group_display||""}:null,p=await ns(e,r.section?.handle,n,l);!p&&r.section?.handle&&b("dock:open-template",r.section.handle),a?.({...r,uid:p?._visual_id||""})}catch(r){t.dismiss(),e.Statamic?.$toast?.error(f(e,r.reason==="bad_name"?"section_new_bad_name":"section_new_failed")),i?.(r)}}function ot(e){e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"))}function ls(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){const i=ie(e.document,Qt,{heading:f(e,"static_section_new"),groupLabel:"",nameLabel:f(e,"section_new_name"),placeholder:f(e,"section_new_placeholder"),note:f(e,"static_section_note"),groups:[],toggleLabel:f(e,"static_section_insertable"),cancelLabel:f(e,"cancel"),saveLabel:f(e,"section_new_create"),onClose:a,onOk:(r,l,p)=>{nn(e,i,{display:r,static:!0,hidden:!p},{afterUid:t,onDone:s,onError:n})}})}function cs(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){(async()=>{let i=[];try{i=await Wo(e)}catch(l){n?.(l),e.Statamic?.$toast?.error(f(e,"section_new_failed"));return}if(!i.length){n?.(new Error("no groups")),e.Statamic?.$toast?.error(f(e,"section_new_failed"));return}const r=ie(e.document,Qt,{heading:f(e,"section_new"),groupLabel:f(e,"section_new_group"),nameLabel:f(e,"section_new_name"),placeholder:f(e,"section_new_placeholder"),note:f(e,"section_new_note"),groups:i,addGroupLabel:f(e,"section_new_group_add"),addGroupNameLabel:f(e,"section_new_group_name"),addGroupPlaceholder:f(e,"section_new_group_placeholder"),onAddGroup:async l=>{try{const p=await Zo(e,l);return e.Statamic?.$toast?.success(f(e,"section_group_created",{name:p.display})),p}catch(p){return e.Statamic?.$toast?.error(f(e,p?.message==="bad_name"?"section_new_bad_name":"section_group_failed")),null}},cancelLabel:f(e,"cancel"),saveLabel:f(e,"section_new_create"),onClose:a,onOk:(l,p)=>{nn(e,r,{display:l,group:p},{afterUid:t,onDone:s,onError:n})}})})()}const ds={key:0,class:"sve-ht-inspect"},us={class:"sve-ht-inspect__head"},hs={key:0,class:"sve-ht-inspect__note"},ps={key:2,class:"sve-ht-inspect__props"},fs={class:"sve-ht-inspect__proplabel"},ms={key:0},vs=["value","disabled","onChange"],gs={value:""},ys=["value"],ks=["value"],bs=["value","placeholder","onChange"],_s=["title","disabled","onClick"],xs=["title","disabled","onClick"],Ts={key:0,class:"sve-ht-inspect__seg"},Ss=["data-active","disabled","onClick"],ws=["value","disabled"],Cs={key:0,value:""},Ls=["value"],Ps={key:2,class:"sve-ht-inspect__box"},$s=["value","placeholder","disabled","onKeydown"],Es=["title","disabled"],Hs={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},As=["value","disabled"],Is=["value"],Rs={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},Ms=["value","placeholder","disabled"],Ds=["title","disabled"],Os={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Bs=["value","placeholder","disabled"],Fs={key:4,class:"sve-ht-inspect__add"},js=["disabled","onClick"],Xe='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',qs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',Ks={__name:"HtmlTreeInspector",setup(e){const t=B(null);Dn(t,v=>o.onPropHost?.(v||null));const s=B(null),n=B(null);function a(v){o.onInspectCommit?.(v.target.value)}function i(v,h,c){!v||!h||(v.value=h,v.focus(),v.setSelectionRange(h.length,h.length),c(h))}function r(v,h){o.onInspectData?.(v.currentTarget,c=>o.onPropValue?.(h.handle,c,!0))}function l(v){o.onInspectData?.(v.currentTarget,h=>i(s.value,h,c=>o.onInspectCommit?.(c)))}function p(v){o.onInspectData?.(v.currentTarget,h=>i(n.value,h,c=>o.onLoopSortField?.(c)))}return(v,h)=>d(o).inspect?(g(),y("div",ds,[T("div",us,w(d(o).inspect.title),1),d(o).inspect.mode==="note"?(g(),y("div",hs,w(d(o).inspect.note),1)):d(o).inspect.mode==="statamic"?(g(),y("div",{key:1,ref_key:"propHost",ref:t,class:"sve-ht-inspect__form"},null,512)):d(o).inspect.mode==="props"?(g(),y("div",ps,[(g(!0),y(R,null,z(d(o).inspect.rows,c=>(g(),y("label",{key:c.handle,class:"sve-ht-inspect__prop"},[T("span",fs,[On(w(c.label)+" ",1),c.bound?(g(),y("em",ms,":")):P("",!0)]),T("span",{class:Bn(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":c.type==="select"||c.type==="link"}])},[c.type==="select"&&!c.bound?(g(),y("select",{key:0,value:c.value,disabled:!d(o).canEdit,onChange:u=>d(o).onPropValue?.(c.handle,u.target.value,!1)},[T("option",gs,w(c.placeholder||d(o).inspect.inheritLabel),1),c.value&&!c.options.includes(c.value)?(g(),y("option",{key:0,value:c.value},w(c.value),9,ys)):P("",!0),(g(!0),y(R,null,z(c.options,u=>(g(),y("option",{key:u,value:u},w(u),9,ks))),128))],40,vs)):(g(),y("input",{key:1,type:"text",value:c.value,placeholder:c.placeholder||d(o).inspect.inheritLabel,onChange:u=>d(o).onPropValue?.(c.handle,u.target.value,c.bound)},null,40,bs)),c.type==="link"?(g(),y("button",{key:2,type:"button","data-sve-ht-data":"",title:d(o).pageTitle,disabled:!d(o).canEdit,onClick:u=>d(o).onPropPage?.(u.currentTarget,c.handle),innerHTML:qs},null,8,_s)):P("",!0),T("button",{type:"button","data-sve-ht-data":"",title:d(o).dataTitle,disabled:!d(o).canEdit,onClick:u=>r(u,c),innerHTML:Xe},null,8,xs)],2)]))),128))])):(g(),y(R,{key:3},[d(o).inspect.mode==="loop"?(g(),y("div",Ts,[(g(!0),y(R,null,z(d(o).inspect.kinds,c=>(g(),y("button",{key:c.id,type:"button","data-active":c.id===d(o).inspect.loopKind?"":void 0,disabled:!d(o).canEdit,onClick:u=>d(o).onLoopKind?.(c.id)},w(c.label),9,Ss))),128))])):P("",!0),d(o).inspect.mode==="loop"&&d(o).inspect.loopKind==="collection"?(g(),y("select",{key:d(o).inspect.key+":"+d(o).inspect.value,value:d(o).inspect.value,disabled:!d(o).canEdit,onChange:a},[d(o).inspect.value?P("",!0):(g(),y("option",Cs,w(d(o).inspect.placeholder),1)),(g(!0),y(R,null,z(d(o).inspect.collections,c=>(g(),y("option",{key:c.handle,value:c.handle},w(c.title),9,Ls))),128))],40,ws)):(g(),y("div",Ps,[(g(),y("input",{ref_key:"field",ref:s,key:d(o).inspect.key,type:"text",value:d(o).inspect.value,placeholder:d(o).inspect.placeholder,disabled:!d(o).canEdit,spellcheck:"false",onKeydown:[h[0]||(h[0]=_(()=>{},["stop"])),J(_(a,["prevent"]),["enter"])],onBlur:a},null,40,$s)),T("button",{type:"button","data-sve-ht-data":"",title:d(o).dataTitle,disabled:!d(o).canEdit,innerHTML:Xe,onMousedown:h[1]||(h[1]=_(()=>{},["prevent"])),onClick:_(l,["stop","prevent"])},null,40,Es)])),d(o).inspect.sort?(g(),y(R,{key:3},[T("div",Hs,w(d(o).inspect.sort.title),1),(g(),y("select",{key:d(o).inspect.key+":dir:"+d(o).inspect.sort.dir,value:d(o).inspect.sort.dir,disabled:!d(o).canEdit,onChange:h[2]||(h[2]=c=>d(o).onLoopSortDir?.(c.target.value))},[(g(!0),y(R,null,z(d(o).inspect.sort.dirs,c=>(g(),y("option",{key:c.id,value:c.id},w(c.label),9,Is))),128))],40,As)),d(o).inspect.sort.needsField?(g(),y("div",Rs,[(g(),y("input",{ref_key:"sortField",ref:n,key:d(o).inspect.key+":field",type:"text",value:d(o).inspect.sort.field,placeholder:d(o).inspect.sort.placeholder,disabled:!d(o).canEdit,spellcheck:"false",onKeydown:[h[3]||(h[3]=_(()=>{},["stop"])),h[4]||(h[4]=J(_(c=>d(o).onLoopSortField?.(c.target.value),["prevent"]),["enter"]))],onBlur:h[5]||(h[5]=c=>d(o).onLoopSortField?.(c.target.value))},null,40,Ms)),d(o).inspect.sort.pickable?(g(),y("button",{key:0,type:"button","data-sve-ht-data":"",title:d(o).dataTitle,disabled:!d(o).canEdit,innerHTML:Xe,onMousedown:h[6]||(h[6]=_(()=>{},["prevent"])),onClick:_(p,["stop","prevent"])},null,40,Ds)):P("",!0)])):P("",!0),T("div",Os,w(d(o).inspect.limit.title),1),(g(),y("input",{key:d(o).inspect.key+":limit",type:"number",min:"1",value:d(o).inspect.limit.value,placeholder:d(o).inspect.limit.placeholder,disabled:!d(o).canEdit,onKeydown:[h[7]||(h[7]=_(()=>{},["stop"])),h[8]||(h[8]=J(_(c=>d(o).onLoopLimit?.(c.target.value),["prevent"]),["enter"]))],onBlur:h[9]||(h[9]=c=>d(o).onLoopLimit?.(c.target.value))},null,40,Bs))],64)):P("",!0),d(o).inspect.branches?.length?(g(),y("div",Fs,[(g(!0),y(R,null,z(d(o).inspect.branches,c=>(g(),y("button",{key:c.id,type:"button",disabled:!d(o).canEdit,onClick:u=>d(o).onAddBranch?.(c.id)},w(c.label),9,js))),128))])):P("",!0)],64))])):P("",!0)}},Ns=Ce(Ks,[["__scopeId","data-v-26254b75"]]),Vs={class:"sve-html-tree"},Gs={class:"sve-pane-bar","data-sve-pane-bar":""},zs={"data-sve-right-title":""},Us={class:"sve-ht-tools"},Xs=["title"],Ys=["placeholder","aria-label","value"],Ws=["aria-label"],Zs=["title","aria-label"],Js={key:1,class:"sve-tree-exit"},Qs=["title"],ea=["title"],ta='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',na='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',oa='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',sa={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const t=f(window,"html_tree_search"),s=tn(window),n=f(window,"section_new"),a=B(!1);function i(){a.value=!1}async function r(v){if(!v)return;await me(),o.onRefresh?.();const h=b("html-tree:open-section",v);h&&ss(window,h.ids)}function l(){a.value||(a.value=!0,(async()=>{if(!(o.sections.length||o.pageBuilder)){is(window),i();return}const v=await as(window);if(!v){i();return}const h=o.sections.length?o.sections[o.sections.length-1].uid:null,c=u=>{i(),r(u?.uid)};if(v==="static"){ls(window,{afterUid:h,onDone:c,onError:i,onClose:i});return}cs(window,{afterUid:h,onDone:c,onError:i,onClose:i})})())}function p(v){const h=!!o.query;o.query=v,h!==!!v&&o.onQuery?.()}return(v,h)=>(g(),y("div",Vs,[T("div",Gs,[T("div",zs,w(e.title),1),h[5]||(h[5]=Fn('<div data-sve-right-actions data-v-95193941><button type="button" data-sve-right-pin aria-pressed="false" data-v-95193941></button><button type="button" data-sve-close aria-label="Close" data-v-95193941><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-95193941><path d="M18 6 6 18" data-v-95193941></path><path d="m6 6 12 12" data-v-95193941></path></svg></button></div>',1))]),T("div",Us,[T("label",{class:"sve-ht-search",title:d(t)},[T("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:na}),T("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:d(t),"aria-label":d(t),value:d(o).query,autocomplete:"off",spellcheck:"false",onInput:h[0]||(h[0]=c=>p(c.target.value)),onKeydown:[h[1]||(h[1]=_(()=>{},["stop"])),h[2]||(h[2]=J(_(c=>p(""),["prevent"]),["escape"]))]},null,40,Ys),d(o).query?(g(),y("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":d(t),innerHTML:oa,onClick:h[3]||(h[3]=c=>p(""))},null,8,Ws)):P("",!0)],8,Xs),d(s)&&(d(o).sections.length||d(o).pageBuilder||d(o).rows.length)?(g(),y("button",{key:0,type:"button",class:"sve-ht-new",title:d(n),"aria-label":d(n),innerHTML:ta,onClick:l},null,8,Zs)):P("",!0)]),d(V).inSidebar?P("",!0):(g(),$e(io,{key:0})),h[6]||(h[6]=T("div",{"data-sve-html-tree-list":""},null,-1)),jn(Ns),d(o).exitOpen&&!d(V).inSidebar?(g(),y("div",Js,[T("span",{class:"sve-tree-exit__name",title:d(o).exitName},w(d(o).exitName),9,Qs),T("button",{type:"button",class:"sve-tree-exit__go",title:d(o).exitTitle,onClick:h[4]||(h[4]=c=>d(o).onExit?.())},w(d(o).exitLabel),9,ea)])):P("",!0)]))}},on=Ce(sa,[["__scopeId","data-v-95193941"]]);function sn(e){return String(e||"").trim().toLowerCase()}function an(e,t){return t?[e.name,e.tag,e.klass,e.label,e.src].filter(s=>typeof s=="string"&&s).join(" ").toLowerCase().includes(t):!0}function aa(e,t){const s=sn(t);if(!s)return{rows:e,hits:new Set};const n=new Set;for(const r of e)an(r,s)&&n.add(r.path);const a=[...n];return{rows:e.filter(r=>n.has(r.path)||a.some(l=>l.startsWith(`${r.path}/`))),hits:n}}const ra=["title"],ia={"data-sve-ht-indent":"","aria-hidden":"true"},la=["data-sve-ht-cat"],ca={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},da={key:2,"data-sve-ht-letter":""},ua=["innerHTML"],ha=["title"],pa=["title"],fa={key:1,"data-sve-ht-kind":""},ma={key:3,"data-sve-ht-name":""},va={key:4,"data-sve-ht-actions":""},ga=["disabled","title","innerHTML"],ya=["disabled","title"],ka=["disabled","title"],ba=["disabled","title"],_a=["data-sve-ht-id"],xa='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',Ta='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',Sa='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',wa='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',Ca='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',La='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',Pa={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const t=ao(window),s=f(window,"section_fields");function n(){const c=ro();if(!c){window.Statamic?.$toast?.error(f(window,"section_fields_none"));return}Yt(window,c)}function a(c){return c.kind==="component"?c.src?`partial:${c.src}`:c.tag:c.name?`${c.tag} ${c.name}`:c.tag}function i(c){return!!c.section}function r(c){return!!c.context}function l(c,u){r(u)||(i(u)?o.onSectionPointerDown?.(c,u.section):u.sectionRoot?o.onSectionPointerDown?.(c,u.sectionRoot):o.onPointerDown?.(c,u.id))}function p(c){if(i(c)){o.onSection?.(c.section);return}if(r(c)){o.onContextRow?.(c.id);return}o.onSelect?.(c.id)}function v(c,u){const k={"data-sve-ht-id":c.id};return c.current&&(k["data-sve-ht-current"]=""),c.hidden&&(k["data-sve-ht-hidden"]=""),k["data-sve-ht-cat"]=c.cat||"other",k["data-sve-ht-depth"]=String(c.depth),u&&(k["data-sve-ht-dim"]=""),r(c)&&(k["data-sve-ht-context"]=c.context),i(c)&&(k["data-sve-ht-sec"]=""),!i(c)&&o.dropId===c.id&&o.dropPlace&&(k["data-sve-ht-drop"]=o.dropPlace),k}function h(c){return!c.hidden||c.wrapFrom!=null}return(c,u)=>(g(),y(R,null,[T("div",ge({"data-sve-ht-row":""},v(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:u[26]||(u[26]=k=>p(e.row)),onDblclick:u[27]||(u[27]=_(k=>i(e.row)||r(e.row)?null:d(o).onRename?.(e.row.id),["prevent"])),onKeydown:[u[28]||(u[28]=J(_(k=>p(e.row),["prevent"]),["enter"])),u[29]||(u[29]=J(_(k=>p(e.row),["prevent"]),["space"]))],onPointerdown:u[30]||(u[30]=k=>l(k,e.row)),onContextmenu:u[31]||(u[31]=_(k=>i(e.row)||r(e.row)?null:d(o).onContext?.(k,e.row.id),["prevent","stop"]))}),[T("span",ia,[(g(!0),y(R,null,z(e.row.guides||[],(k,S)=>(g(),y("i",{key:S,"data-sve-ht-cat":k},null,8,la))),128))]),e.row.hasChildren||e.row.emptyBlock?(g(),y("button",ge({key:0,type:"button","data-sve-ht-twist":""},e.row.shut?{"data-sve-ht-shut":""}:{},{innerHTML:Ta,onClick:u[0]||(u[0]=_(k=>i(e.row)?d(o).onSection?.(e.row.section):d(o).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:u[1]||(u[1]=_(()=>{},["stop"])),onDblclick:u[2]||(u[2]=_(()=>{},["stop"]))}),null,16)):(g(),y("span",ca)),e.row.letter?(g(),y("span",da,w(e.row.letter),1)):(g(),y("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,ua)),T("span",{"data-sve-ht-text":"",title:d(o).renameTitle},[!e.row.kind&&!i(e.row)&&!r(e.row)?(g(),y("button",{key:0,type:"button","data-sve-ht-tag":"",title:d(o).tagTitle,onClick:u[3]||(u[3]=_(()=>{},["stop","prevent"])),onPointerdown:u[4]||(u[4]=_(()=>{},["stop"])),onDblclick:u[5]||(u[5]=_(k=>d(o).onTagChange?.(k,e.row.id),["stop","prevent"]))},w(e.row.tag),41,pa)):(g(),y("span",fa,w(e.row.tag),1)),d(o).editingId===e.row.id&&!i(e.row)?ve((g(),y("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":u[6]||(u[6]=k=>d(o).draft=k),onMousedown:u[7]||(u[7]=_(()=>{},["stop"])),onPointerdown:u[8]||(u[8]=_(()=>{},["stop"])),onClick:u[9]||(u[9]=_(()=>{},["stop"])),onDblclick:u[10]||(u[10]=_(()=>{},["stop"])),onKeydown:[u[11]||(u[11]=_(()=>{},["stop"])),u[12]||(u[12]=J(_(k=>d(o).onRenameCommit?.(),["prevent"]),["enter"])),u[13]||(u[13]=J(_(k=>d(o).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:u[14]||(u[14]=k=>d(o).onRenameCommit?.())},null,544)),[[tt,d(o).draft]]):(g(),y("span",ma,w(e.row.name),1))],8,ha),!i(e.row)&&!r(e.row)?(g(),y("span",va,[h(e.row)?(g(),y("button",{key:0,type:"button","data-sve-ht-eye":"",disabled:!d(o).canEdit,title:d(o).canEdit?e.row.hidden?d(o).showTitle:d(o).hideTitle:d(o).lockedTitle,innerHTML:e.row.hidden?wa:Sa,onClick:u[15]||(u[15]=_(k=>d(o).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:u[16]||(u[16]=_(()=>{},["stop"])),onDblclick:u[17]||(u[17]=_(()=>{},["stop"]))},null,40,ga)):P("",!0),d(t)&&e.row.fieldsIcon?(g(),y("button",{key:1,type:"button","data-sve-ht-fields":"",disabled:!d(o).canEdit,title:d(o).canEdit?d(s):d(o).lockedTitle,innerHTML:xa,onClick:_(n,["stop","prevent"]),onPointerdown:u[18]||(u[18]=_(()=>{},["stop"])),onDblclick:u[19]||(u[19]=_(()=>{},["stop"]))},null,40,ya)):P("",!0),T("button",{type:"button","data-sve-ht-dup":"",disabled:!d(o).canEdit,title:d(o).canEdit?d(o).duplicateTitle:d(o).lockedTitle,innerHTML:Ca,onClick:u[20]||(u[20]=_(k=>d(o).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:u[21]||(u[21]=_(()=>{},["stop"])),onDblclick:u[22]||(u[22]=_(()=>{},["stop"]))},null,40,ka),T("button",{type:"button","data-sve-ht-del":"",disabled:!d(o).canEdit,title:d(o).canEdit?d(o).deleteTitle:d(o).lockedTitle,innerHTML:La,onClick:u[23]||(u[23]=_(k=>d(o).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:u[24]||(u[24]=_(()=>{},["stop"])),onDblclick:u[25]||(u[25]=_(()=>{},["stop"]))},null,40,ba)])):P("",!0)],16,ra),e.row.emptyBlock&&!e.row.shut?(g(),y("div",ge({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},d(o).dropId===e.row.id&&d(o).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),w(d(o).slotText),17,_a)):P("",!0)],64))}},Ye=Ce(Pa,[["__scopeId","data-v-1d5af908"]]),$a=["data-sve-ht-look"],Ea={key:0,class:"sve-ht-empty"},Ha={key:1,class:"sve-ht-empty"},Aa={key:0,class:"sve-ht-empty"},Ia={__name:"HtmlTreeList",setup(e){const t=fe(()=>sn(o.query)),s=fe(()=>aa(o.rows,t.value)),n=fe(()=>s.value.rows),a=fe(()=>t.value?o.sections.filter(p=>an(p.row,t.value)||p.current&&p.ready&&n.value.length>0):o.sections),i=fe(()=>!!t.value&&!a.value.length&&!n.value.length);function r(p){return!!t.value&&!s.value.hits.has(p.path)}function l(p){const v={"data-sve-ht-sec-uid":p.uid};return p.current&&(v["data-sve-ht-branch"]="",v["data-sve-ht-cat"]=p.row?.cat||"layout"),o.sectionDrop&&o.sectionDrop.uid===p.uid&&(v["data-sve-ht-drop"]=o.sectionDrop.place),v}return(p,v)=>(g(),y("div",ge({class:"sve-ht-root","data-sve-ht-look":d(o).look,style:d(o).familyStyle},d(o).dragging?{"data-sve-ht-dragging":""}:{}),[!d(o).rows.length&&!d(o).sections.length?(g(),y("div",Ea,w(d(o).emptyText),1)):i.value?(g(),y("div",Ha,w(d(o).searchEmpty),1)):P("",!0),d(o).sections.length?(g(!0),y(R,{key:2},z(a.value,h=>(g(),y("div",ge({key:h.uid},{ref_for:!0},l(h)),[h.ready?(g(),y(R,{key:0},[(g(!0),y(R,null,z(n.value,c=>(g(),$e(Ye,{key:c.id,row:c,dim:r(c)},null,8,["row","dim"]))),128)),d(o).rows.length?P("",!0):(g(),y("div",Aa,w(d(o).emptyText),1))],64)):(g(),$e(Ye,{key:1,row:h.row,dim:d(o).inComponent},null,8,["row","dim"]))],16))),128)):d(o).rows.length?(g(!0),y(R,{key:3},z(n.value,h=>(g(),$e(Ye,{key:h.id,row:h,dim:r(h)},null,8,["row","dim"]))),128)):P("",!0)],16,$a))}},It=Ce(Ia,[["__scopeId","data-v-601b6aa6"]]);let We=null;function Ra(e){return We||(We=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{pages:[]}).then(t=>Array.isArray(t.pages)?t.pages:[]).catch(()=>[])),We}let Ie=null;function Ze(){Ie?.dismiss(),Ie=null}function Ma(e,t,s){Ze();const n=t?.getBoundingClientRect?.(),a={x:n?n.left:0,y:n?n.bottom+4:0};Ra(e).then(i=>{const r=i.length?i.map(l=>({label:l.title||l.url,onPick:()=>{Ze(),s(l.url)}})):[{label:f(e,"component_props_pages_none"),onPick:null}];Ze(),Ie=ie(e.document,vt,{items:r,x:a.x,y:a.y,onClose:()=>{Ie=null}})})}const rn="sve-html-tree-labels";function ln(){try{const e=globalThis.localStorage?.getItem(rn);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function Da(e){try{globalThis.localStorage?.setItem(rn,JSON.stringify(e))}catch{}}function cn(e){return String(e||"_")}function dn(e){const t=ln()[cn(e)];return t&&typeof t=="object"?{...t}:{}}function Oa(e,t,s){const n=s?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function Ba(e,t,s,n){if(!t)return;const a=cn(e),i=ln(),r={...i[a]||{}},l=String(s||"").replace(/\s+/g," ").trim(),p=String(n||"").trim();!l||l===p?delete r[t]:r[t]=l,Object.keys(r).length?i[a]=r:delete i[a],Da(i)}const Fa=/^@(media|supports|container|layer|scope)\b/i;function ja(e){const t=String(e||""),s=[];let n=0,a=0;for(;n<t.length;){if(t[n]==="{"&&t[n+1]==="{"){const l=t.indexOf("}}",n+2);n=l===-1?t.length:l+2;continue}if(t[n]==="/"&&t[n+1]==="*"){const l=t.indexOf("*/",n+2);n=l===-1?t.length:l+2;continue}if(t[n]==='"'||t[n]==="'"){const l=t[n];for(n+=1;n<t.length&&t[n]!==l;)n+=t[n]==="\\"?2:1;n+=1;continue}if(t[n]!=="{"){n+=1;continue}let i=1,r=n+1;for(;r<t.length&&i>0;){if(t[r]==="{"&&t[r+1]==="{"){const l=t.indexOf("}}",r+2);r=l===-1?t.length:l+2;continue}if(t[r]==="/"&&t[r+1]==="*"){const l=t.indexOf("*/",r+2);r=l===-1?t.length:l+2;continue}if(t[r]==='"'||t[r]==="'"){const l=t[r];for(r+=1;r<t.length&&t[r]!==l;)r+=t[r]==="\\"?2:1;r+=1;continue}t[r]==="{"?i+=1:t[r]==="}"&&(i-=1),r+=1}s.push({selector:t.slice(a,n).trim(),body:t.slice(n+1,r-1),from:a,to:r,text:t.slice(a,r).trim()}),n=r,a=r}return s}function Rt(e){const t=String(e||""),s=new Set,n=new Set,a=new Set;for(const i of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const r of i[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))r&&(s.add(r),s.add(r.replace(/([:./%!#()[\],])/g,"\\$1")));for(const i of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))i[2].trim()&&n.add(i[2].trim());for(const i of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))a.add(i[1].toLowerCase());return{classes:s,ids:n,tags:a}}function Mt(e,t){const s=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),n=[...s.matchAll(/\.((?:\\.|[\w-])+)/g)].map(r=>r[1]),a=[...s.matchAll(/#((?:\\.|[\w-])+)/g)].map(r=>r[1]);if(n.length||a.length){const r=l=>l.replace(/\\(.)/g,"$1");return n.every(l=>t.classes.has(l)||t.classes.has(r(l)))&&a.every(l=>t.ids.has(r(l)))}const i=[...s.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(r=>r[2].toLowerCase());return i.length>0&&i.every(r=>t.tags.has(r))}function qa(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function Ka(e,t,s){const n=qa(e);if(!n.length)return"keep";const a=n.filter(r=>Mt(r,t));return a.length?a.length===n.length&&!n.some(r=>Mt(r,s))?"move":"copy":"keep"}function un(e,t,s){const n=String(e||""),a=Rt(t),i=Rt(s),r=[],l=[];let p=0;for(const v of ja(n)){const h=n.slice(v.from,v.to),c=h.match(/^\s*/)[0];if(p=v.to,Fa.test(v.selector)){const k=un(v.body,t,s);k.move.trim()&&r.push(`${v.selector} {
${k.move.trim()}
}`),k.keep.trim()&&l.push(`${c}${v.selector} {
${k.keep.trim()}
}`);continue}const u=v.selector.startsWith("@")?"keep":Ka(v.selector,a,i);if(u==="move"){r.push(v.text);continue}u==="copy"&&r.push(v.text),l.push(h)}return l.push(n.slice(p)),{move:r.join(`

`).trim(),keep:l.join("").replace(/\n{3,}/g,`

`).trim()}}const Na="/!/sve/component";function Va(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let s=null;for(const n of t){if(!n.trim())continue;const a=n.match(/^[ \t]*/)[0].length;s=s===null?a:Math.min(s,a)}return s?t.map(n=>n.slice(s)).join(`
`):t.join(`
`)}function Ga(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function za(e,t){if(!co(e))return"";try{return await(await Kn(()=>import("./tw-compile-CV7No16T.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(s){return console.error("[sve] component tailwind compile",s),""}}async function Ua(e,t){const s=await e.fetch(Na,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":ht(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!s.ok){const n=new Error(String(s.status));throw n.status=s.status,n}return s.json()}function Dt(e,t){const{from:s,to:n}=lo(e,t),a=e.slice(s,n);if(!a.trim())return null;const i=e.slice(0,s)+e.slice(n),r=b("dock:css"),l=un(typeof r=="string"?r:"",a,i);return{html:Va(a),css:l.move,keepCss:l.keep,lead:Ga(a),from:s,to:n}}function Xa(e,t,{onDone:s,onError:n}={}){if(b("dock:is-locked")===!0)return;const a=b("dock:html");if(typeof a!="string"||!t)return;const i=Dt(a,t);if(!i)return;const r=ie(e.document,qn,{heading:f(e,"component_new"),nameLabel:f(e,"component_name"),placeholder:f(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:f(e,"cancel"),saveLabel:f(e,"component_create"),onOk:l=>{r.dismiss(),(async()=>{try{const p=await za(e,i.html),v=b("dock:html"),h=typeof v=="string"&&v===a?i:Dt(v,t);if(!h)return;const c=await Ua(e,{name:l,html:h.html,css:h.css,js:"",tw:p}),u=b("dock:html"),k=u.slice(0,h.from)+h.lead+c.tag+u.slice(h.to);b("dock:set-html",k),h.css.trim()&&b("dock:set-css",h.keepCss),s?.(c)}catch(p){n?.(p)}})()}})}function Ya(e,t,s){const n=String(e||"");if(!t||t.kind!=="antlers")return n;const a=String(s||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?Qa(n,t,a):t.tag==="else"||!a?n:n.slice(0,t.from)+`{{ ${t.tag} ${a} }}`+n.slice(t.openTo)}function st(e,t,s,n){return ye(e,t,{kind:s,name:n})}function ye(e,t,s={}){const n=String(e||"");if(!t||t.antlers!=="loop")return n;const a=t.loopKind==="collection"?"collection":"field",i=s.kind??a,r=String(s.name??t.expr??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(r))return n;const l=s.sortDir??t.sortDir??"",p=String(s.sortField??t.sortField??"").trim(),v=String(s.limit??t.limit??"").trim(),h=hn(n,t);if(!h)return n;const c=i===a?t.params:"",u=i==="collection"?Wa(r,p,l,v,c):Za(r,p,l,v,c),k=i==="collection"?"collection":r;return n.slice(0,t.from)+u+n.slice(t.openTo,h.from)+`{{ /${k} }}`+n.slice(h.to)}function Wa(e,t,s,n,a){const i=Ja(a).replace(/\bsort\s*=\s*["'][^"']*["']/g,"").replace(/\blimit\s*=\s*["']?\d+["']?/g,"").replace(/\s+/g," ").trim(),r=[`collection from="${e}"`];return s==="random"?r.push('sort="random"'):t&&r.push(`sort="${t}${s==="desc"?":desc":":asc"}"`),n&&r.push(`limit="${n}"`),i&&r.push(i),`{{ ${r.join(" ")} }}`}function Za(e,t,s,n,a){const i=String(a||"").split("|").map(l=>l.trim()).filter(l=>l&&!/^from\s*=/.test(l)&&!/^sort\s*:/.test(l)&&!/^reverse$/.test(l)&&!/^shuffle$/.test(l)&&!/^limit\s*:/.test(l)),r=[e,...i];return s==="random"?r.push("shuffle"):t&&(r.push(`sort:${t}`),s==="desc"&&r.push("reverse")),n&&r.push(`limit:${n}`),`{{ ${r.join(" | ")} }}`}function Ja(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function hn(e,t){const n=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return n?{from:t.from+n.index,to:t.from+n.index+n[0].length}:null}function Qa(e,t,s){return ye(e,t,{name:s})}function er(e,t,s){const n=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return n;const a=hn(n,t);if(!a)return n;const r=(n.slice(0,a.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],l=s==="else"?"{{ else }}":"{{ elseif true }}";return`${n.slice(0,a.from)}${l}
${r}${n.slice(a.from)}`}const j=fo("sve-call-values"),xe=new Set;let Ot=null;const tr="__sve-html-tree-style",q=new Set;let at="",de=!1,Je=null,Pe=!0,X="",Te=0,pn="";const Q=new Map,ue=new Set;let N="",fn=!1,M=null,Re=null,Me=0,rt=null,Se=[],ne=null,ke=null,De=null,Oe=null,it=null,ae=!1,oe=null,we=null,be=null,Be=null,Fe=null,lt=null,te=null;function G(e){return e.getElementById(Ee)}function nr(e){Vn(e,tr,`
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
      ${Lt("light")}
      /* How much of a row's own colour its pick takes: a wash, not a fill.
         The row mixes it in below — a mix written up here would read
         --sve-ht-c on the list, where no family is set. */
      --sve-ht-pick-mix: 11%;
      --sve-ht-pick-hover-mix: 18%;
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${Lt("dark")}
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
    [data-sve-ht-look="tags"] [data-sve-ht-eye]:hover,
    [data-sve-ht-look="tags"] [data-sve-ht-fields]:hover,
    [data-sve-ht-look="tags"] [data-sve-ht-dup]:hover,
    [data-sve-ht-look="tags"] [data-sve-ht-del]:hover { background: rgba(128,128,128,.25); }
  `)}function K(){const e=b("dock:html");return typeof e=="string"?e:""}function mn(e){return!!b("dock:is-open",e)}function pe(e,{save:t=!1}={}){return _t()||b("dock:set-html",e)!==!0?!1:(t&&b("dock:save-now"),!0)}function Bt(e){const t=b("dock:component-exit-state")||{};if(o.exitOpen=!!t.open,!t.open){o.onExit=null;return}o.exitName=t.name||"",o.exitLabel=f(e,"component_exit"),o.exitTitle=f(e,t.back?"component_exit_back":"component_exit_close"),o.onExit=()=>{b("dock:exit-component"),$(e)}}function vn(e,t){const s=Jn(e);if(!s||t.type!==s)return"";const n=Qn(t[s]);return n&&eo(e,n)?.section_type||""}const re=[];let Qe=!1,ct=!1;function et(e,t){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(t,{timeout:2e3});return}e.setTimeout(t,200)}function or(e,t){for(const s of t){const n=s.type;!n||Q.has(n)||ue.has(n)||re.includes(n)||re.push(n)}pt.htmlTreePrefetchArmed&&bt(e)}function Ur(e){pt.htmlTreePrefetchArmed=!0,bt(e)}function bt(e){if(Qe||!re.length)return;Qe=!0;const t=()=>{const s=re.shift();if(!s){Qe=!1;return}if(Q.has(s)||ue.has(s)){et(e,t);return}ue.add(s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(s)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{typeof n?.html=="string"&&(Q.set(s,n.html),ct&&(ct=!1,$(e)))}).catch(()=>{}).finally(()=>{ue.delete(s),et(e,t)})};et(e,t)}function _t(){return!!N}function sr(e){const t=new Map,s=Vt(e);if(!s)return t;for(const n of s.querySelectorAll("[data-sid]")){const a=n.getAttribute("data-sid");a&&!t.has(a)&&t.set(a,n.tagName.toLowerCase())}return t}function ar(e,t){const s=Le(e)||"page_sections";for(const n of Ke(t)||[]){const a=Ne(n.values),i=a&&typeof a=="object"?a[s]:null;if(Array.isArray(i))return!0}return!1}function Ge(e,t){const s=Le(e)||"page_sections",n=sr(e),a=[];for(const i of Ke(t)||[]){const r=Ne(i.values),l=r&&typeof r=="object"?r[s]:null;if(Array.isArray(l)){l.forEach(p=>{if(!p||typeof p!="object"||Array.isArray(p)||typeof p.type!="string")return;const v=[p._visual_id,p.id,p._id].filter(S=>typeof S=="string"&&S!=="");if(!v.length)return;const h=vn(e,p)||p.type,c=typeof p._sve_label=="string"?p._sve_label.trim():"",u=v.map(S=>n.get(S)).find(Boolean)||"section",k=dn(p.type)[`0:${u}`];a.push({uid:v[0],ids:v,type:p.type,tag:u,label:c||(typeof k=="string"&&k.trim()?k.trim():"")||ft(e,h)?.display||Ae(h)||h,svg:Zt(u,"",null).svg||mo.section,cat:Ut(u),enabled:p.enabled!==!1,static:Qo(e,h)})});break}}return a}function rr(e,t,s){if(!s.length)return"";const n=b("dock:current-type")||"",a=b("dock:current-uid"),i=!!b("dock:component-exit-state")?.open;if(a){const r=Wn(a,t),l=s.find(p=>p.ids.some(v=>r.includes(v)));if(l&&(i||l.type===n))return l.uid}return s.find(r=>r.type===n)?.uid||""}function ir(e,t,s,n){const a=t.find(S=>S.uid===s),i=b("dock:component-src"),r=b("dock:type-stack")||[];if(!a||!i||!r.length)return null;const l=r.map(S=>S.type).filter(S=>!Q.get(S));if(l.length)return lr(e,l),null;const p=[],v=new Set,h=new Set;let c=S=>p.push(...S),u=null,k=0;for(let S=0;S<r.length;S+=1){const U=S+1<r.length?r[S+1].src:i,Y=D=>({...D,id:`ctx${S}:${D.id}`,path:`ctx${S}/${D.path}`,ctxLevel:S,children:D.children.map(Y)}),F=Ve(Q.get(r[S].type)).map(Y),E=[],H=(D,O)=>{for(const I of D){if(I.kind==="component"&&I.src===U)return E.push(...O,I),I;const m=H(I.children,[...O,I]);if(m)return m}return null};if(u=U?H(F,[]):null,!u)return null;const L=new Set(E.map(D=>D.id)),A=(D,O)=>{for(const I of D)I.children.length&&(L.has(I.id)?q.has(I.path):yn(I,O))&&v.add(I.id),A(I.children,O+1)};A(F,k),c(F),h.add(u.id),k+=E.length,c=(D=>O=>{D.children=O})(u)}for(const S of kn(n))v.add(S);return q.has(u.path)&&v.add(u.id),u.children=n,{tree:p,folds:v,hostId:u.id,hostIds:h,levels:r.length,rootId:p.find(S=>!S.kind)?.id||"",label:a.label,svg:a.svg,cat:a.cat}}function lr(e,t){for(const s of t)!re.includes(s)&&!ue.has(s)&&re.push(s);ct=!0,bt(e)}function cr(e,t,s){const n=b("dock:component-exit-state");if(n?.open)return Ae(n.name)||n.name||"";if(s)return t.find(i=>i.uid===s)?.label||"";const a=b("dock:current-type")||"";return ft(e,a)?.display||Ae(a)||""}function ze(e,t,s,n,a){const i=s.find(l=>l.uid===n);if(!i||n===a)return;q.clear(),M=null,Pe=!1,ee(),Ue(),X=n,pn=K(),N=Q.get(i.type)||"",N&&(M=je(Ve(N))||null),fn=(b("dock:current-type")||"")===i.type,e.clearTimeout(Te),Te=e.setTimeout(()=>{X="",de=!1,$(e)},4e3),$(e);const r=()=>oo(i.uid,t,e,{clampToSection:!0});Zn(i.uid,t,e,r),he({source:ce,type:le.SVE_ACTIVATE,ids:i.ids},e),e.setTimeout(()=>$(e),0)}function gn(e,t){if(!t)return!1;for(const s of e||[])if(s.id===t||gn(s.children,t))return!0;return!1}function je(e){for(const t of e||[]){if(!t.kind)return t.id;const s=je(t.children);if(s)return s}return""}function yn(e,t){return q.has(e.path)?t===0:t>0}function kn(e){const t=new Set,s=(n,a)=>{for(const i of n)i.children.length&&yn(i,a)&&t.add(i.id),s(i.children,a+1)};return s(e,0),t}function $(e){const t=e.document,n=G(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;nr(t),ho(e);const a=K();N&&N===a&&(N="");const i=N||a,r=Ve(i);Se=r;const l=b("dock:current-type")||"",p=dn(l),v=ar(e,t),c=!!(b("dock:component-exit-state")||{}).open,u=Ge(e,t);l&&a&&!N&&Q.set(l,a),or(e,u);const k=rr(e,t,u);if(v&&!u.length){Se=[],o.rows=[],o.sections=[],o.pageBuilder=!0,o.emptyText=f(e,"html_tree_empty"),o.canEdit=!b("dock:is-locked"),o.look=Pt(e),o.onRefresh=()=>$(e),o.onSection=null,Bt(e),He(n,It),Ft(e,[]);return}o.pageBuilder=v;const S=`${l}|${k}`;let U=!1;S!==at&&(at=S,q.clear(),Je!==null&&i!==Je?U=!0:de=i),(U||de!==!1&&i!==de)&&(de=!1,q.clear(),M=je(r)||null),Je=i,X&&(X===k||!u.length)&&(fn||i!==pn)&&(e.clearTimeout(Te),X="",de=!1,gn(r,M)||(q.clear(),M=je(r)||null));const Y=u.some(m=>m.uid===X)?X:"",F=Pe?"":Y||k,E=c?ir(e,u,F,r):null,H=!!(Y||k),L=E?$t(E.tree,o.query?new Set:E.folds):$t(r,o.query?new Set:kn(r));!i.trim()&&!mn(t)?o.emptyText=f(e,"html_tree_need_dock"):o.emptyText=f(e,"html_tree_empty"),o.slotText=f(e,"antlers_drop_here"),o.dataTitle=f(e,"data_vars_title"),o.pageTitle=f(e,"component_props_page"),o.renameTitle=f(e,"html_tree_rename"),o.tagTitle=f(e,"tw_tag"),o.hideTitle=f(e,"html_tree_hide"),o.showTitle=f(e,"html_tree_show"),o.duplicateTitle=f(e,"html_tree_duplicate"),o.deleteTitle=f(e,"html_tree_delete"),o.lockedTitle=f(e,"html_tree_locked"),o.searchEmpty=f(e,"html_tree_search_empty"),o.canEdit=!b("dock:is-locked"),o.look=Pt(e),Yn(e),o.onQuery=()=>$(e),Bt(e),o.inComponent=c,o.onContextRow=m=>{if(!E||m===E.hostId)return;const x=L.find(C=>C.id===m)?.ctxLevel??E.levels-1;b("dock:exit-component",E.levels-x),$(e)},o.onSelect=m=>{const x=L.find(C=>C.id===m);x&&Wt(e,x.path)||Tt(e,m,L)},o.onTwist=m=>{const x=L.find(C=>C.id===m)?.path;x&&(q.has(x)?q.delete(x):q.add(x),$(e))},o.onTagChange=(m,x)=>{const C=o.rows.find(W=>W.id===x);C&&!_t()&&po(e,m.currentTarget,C)},o.onRename=m=>ur(e,m),o.onRenameCommit=()=>jt(e,!0),o.onRenameCancel=()=>jt(e,!1),o.onHide=m=>pr(e,m),o.onDuplicate=m=>fr(e,m),o.onDelete=m=>vr(e,m),o.onPointerDown=(m,x)=>xr(e,m,x),o.onSectionPointerDown=(m,x)=>wr(e,m,x),o.onContext=(m,x)=>br(e,m,x),o.onInspectCommit=m=>Ar(e,m),o.onPropValue=(m,x,C)=>Nt(e,m,x,C),o.onPropPage=(m,x)=>Ma(e,m,C=>Nt(e,x,C,!1)),o.onLoopKind=m=>Ir(e,m),o.onAddBranch=m=>Rr(e,m),o.onLoopSortField=m=>{const x=qe(),C=String(m||"").trim();if(!x)return;const W=te?.id===x.id?te.dir:"",Z=x.sortDir||W||"asc";te=null,se(e,(Cn,Ln)=>ye(Cn,Ln,{sortField:C,sortDir:Z}))},o.onLoopSortDir=m=>{const x=qe(),C=String(m||"");if(x){if((C==="asc"||C==="desc")&&!x.sortField){te={id:x.id,dir:C},dt(e,x);return}te=null,se(e,(W,Z)=>ye(W,Z,{sortDir:C,sortField:C==="asc"||C==="desc"?Z.sortField:""}))}},o.onLoopLimit=m=>se(e,(x,C)=>ye(x,C,{limit:String(m||"").replace(/\D/g,"")})),o.onPropHost=m=>m?j.mount(m):j.unmount(),o.onInspectData=(m,x)=>{b("dock:data-menu",{anchor:m,at:L.find(C=>C.id===M)?.from,onPick:C=>x(String(C?.var||"").trim())})};const A=L.find(m=>!m.kind)?.id,D=c?"":cr(e,u,F),O=F&&!c?u.find(m=>m.uid===F):null;o.rows=L.map(m=>{const x=Zt(m.tag,m.kind,m.antlers),C=!!E&&m.id===E.rootId,W=m.id===A&&D?D:C?E.label:m.klass,Z=m.id===A;return{...m,base:W,name:Z&&O?W:Oa(W,m.path,p),current:m.id===M,letter:C?"":x.letter||"",svg:Z&&O?O.svg:C?E.svg:x.svg||"",cat:C?E.cat:Ut(m.tag,m.kind,m.antlers),context:E?E.hostIds.has(m.id)?"host":m.id.startsWith("ctx")?"dim":"":"",sectionRoot:Z&&O?O.uid:"",fieldsIcon:!!(Z&&O&&!O.static)}});const I=[];for(const m of o.rows)I.length=m.depth,m.guides=I.slice(),I[m.depth]=m.cat;o.sections=H?u.map(m=>{const x=!!F&&m.uid===F;return{...m,current:x,ready:x&&(!Y||!!N),row:{id:`sec:${m.uid}`,section:m.uid,tag:m.tag,name:m.label,kind:"",svg:m.svg,cat:m.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:x,hidden:!m.enabled}}}):[],o.onSection=m=>{ae||ze(e,t,u,m,F)},o.onRefresh=()=>$(e),dt(e,o.rows.find(m=>m.id===M)),He(n,It),Ft(e,r)}function Ft(e,t){G(e.document)&&bn(e,t)}function bn(e,t){const s=t[0],n=!!b("dock:component-src"),a=n?"":b("dock:current-uid")||"";he({source:ce,type:le.SVE_HTML_PICK,on:!0,uid:a,all:n,tag:s?.tag||"",klass:s?.klass||"",nodes:$o(t)},e)}function dr(e){if(!e)return;const t=(s,n)=>{for(const a of s||[]){if(a.path===e)return!0;if(t(a.children,n+1))return n===0?q.delete(a.path):q.add(a.path),!0}return!1};t(Se,0)}function ur(e,t){if(ae)return;const s=o.rows.find(n=>n.id===t);!s||s.kind||(M=t,o.rows.forEach(n=>{n.current=n.id===t}),o.editingId=t,o.draft=s.name,e.setTimeout(()=>{const n=G(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function jt(e,t){const s=o.editingId;if(!s)return;const n=o.rows.find(a=>a.id===s);o.editingId=null,t&&n&&(n.sectionRoot?hr(e,n.sectionRoot,o.draft):Ba(b("dock:current-type")||"",n.path,o.draft,n.base||n.klass)),o.draft="",$(e)}function hr(e,t,s){const n=Le(e)||"page_sections",a=String(s||"").replace(/\s+/g," ").trim();for(const i of Ke(e.document)||[]){const r=Ne(i.values),l=r&&typeof r=="object"?r[n]:null;if(!Array.isArray(l))continue;const p=l.findIndex(u=>u&&typeof u=="object"&&[u._visual_id,u.id,u._id].includes(t));if(p===-1)continue;const v=vn(e,l[p])||l[p].type,h=ft(e,v)?.display||Ae(v)||v,c=JSON.parse(JSON.stringify(l));return c[p]={...c[p]},!a||a===h?delete c[p]._sve_label:c[p]._sve_label=a,i.setFieldValue(n,c),!0}return!1}function pr(e,t){xt(e,t,Co)}function fr(e,t){xt(e,t,Lo)}function _n(e,t){to(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const s=e.document;so({uid:t},s,e)})}function mr(e,t,s){X===s&&(e.clearTimeout(Te),X="",N=""),M=null,Pe=!1,at="";const n=Ge(e,t),a=n.find(i=>i.uid!==s)||n[0];a?ze(e,t,n,a.uid,""):(N="",o.rows=[],o.sections=[],o.pageBuilder=!0,$(e)),e.setTimeout(()=>{G(e.document)&&$(e)},0)}Xt("row:removed",({uid:e,parentPath:t,doc:s,win:n})=>{t!==Le(n)||!G(n.document)||mr(n,s,e)});function vr(e,t){const s=o.sections?.find(a=>a.row?.id===t),n=s?s.row?.section||s.uid:o.rows.find(a=>a.id===t)?.sectionRoot;if(n){_n(e,n);return}xt(e,t,Po)}function xt(e,t,s){if(b("dock:is-locked"))return;const n=K(),a=o.rows.find(r=>r.id===t);if(!a)return;const i=s(n,a);i!==n&&pe(i)}function ee(){oe?.dismiss(),oe=null}const gr='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',yr='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>';function xn(e,t){const s=o.sections?.find(p=>p.uid===t),n=s?.type||"";if(!n||!tn(e))return[];const a=s.label||n,i=es(e,n),r=()=>e.Statamic?.$toast?.error(f(e,"section_update_failed")),l=[{label:f(e,"static_section_insertable"),icon:i?yr:gr,onPick:()=>{ee(),Ht(e,{handle:n,hidden:!i}).then(()=>{e.Statamic?.$toast?.success(f(e,i?"section_shown_to_editors":"section_hidden_from_editors",{name:a})),ot(e)}).catch(r)}}];return s.static&&l.push({label:f(e,"section_add_fields"),onPick:()=>{ee(),Ht(e,{handle:n,fields:!0}).then(()=>{e.Statamic?.$toast?.success(f(e,"section_fields_added",{name:a})),ot(e),$(e),Yt(e,n)}).catch(r)}}),l}function kr(e,t,s){const n=s.row?.section||s.uid;n&&(oe=ie(e.document,vt,{items:[...xn(e,n),{label:f(e,"html_tree_remove_section"),danger:!0,onPick:()=>{ee(),_n(e,n)}}],x:t.clientX,y:t.clientY,onClose:()=>{oe=null}}))}function br(e,t,s){ee();const n=o.sections?.find(l=>l.row?.id===s);if(n){kr(e,t,n);return}const a=o.rows.find(l=>l.id===s);if(!a)return;Tt(e,s,o.rows);const i={x:t.clientX,y:t.clientY},r=l=>{l.length&&(oe?.dismiss(),oe=ie(e.document,vt,{items:l,x:i.x,y:i.y,onClose:()=>{oe=null}}))};if(a.kind==="component"){_r(e,a,r);return}o.canEdit&&r([...a.sectionRoot?xn(e,a.sectionRoot):[],{label:f(e,"component_make"),onPick:()=>{ee(),Xa(e,a,{onDone:()=>$(e),onError:l=>{e.alert(l?.status===409?f(e,"component_exists"):f(e,"component_failed"))}})}}])}const qt=(e,t)=>{ee(),b("dock:open-template",t)};function _r(e,t,s){if(!go(t.src)){s([{label:f(e,"component_open_named",{name:t.name||t.src}),onPick:()=>qt(e,`view:partials/${t.src}`)}]);return}s([{label:f(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const a=Array.isArray(n.items)?n.items:[];s(a.length?a.map(i=>({label:f(e,"component_open_named",{name:i.label}),onPick:()=>qt(e,i.type)})):[{label:f(e,"component_none"),onPick:null}])}).catch(()=>s([{label:f(e,"component_none"),onPick:null}]))}function xr(e,t,s){if(t.button!==0||b("dock:is-locked")||o.editingId||t.target?.closest?.("button, input"))return;Ue(),ne=s,ke={x:t.clientX,y:t.clientY},De=t.currentTarget,Oe=t.pointerId;const n=i=>Tr(e,i),a=i=>Sr(e,i);it=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),it=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function Tr(e,t){if(!ne||!ke)return;const s=t.clientX-ke.x,n=t.clientY-ke.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{De?.setPointerCapture?.(Oe)}catch{}}t.preventDefault();const a=e.document.elementFromPoint(t.clientX,t.clientY),i=a?.closest?.("[data-sve-ht-slot]");if(i){const c=i.getAttribute("data-sve-ht-id");if(c&&c!==ne){o.dropId=c,o.dropPlace="inside";return}}const r=a?.closest?.("[data-sve-ht-row]"),l=r?.getAttribute("data-sve-ht-id");if(!l||l===ne){o.dropId=null,o.dropPlace=null;return}const p=o.rows.find(c=>c.id===l),v=o.rows.find(c=>c.id===ne);if(!p||p.context||v&&p.path.startsWith(`${v.path}/`)){o.dropId=null,o.dropPlace=null;return}const h=r.getBoundingClientRect();o.dropId=l,o.dropPlace=So(t.clientY-h.top,h.height,!Jt(p.tag)&&p.kind!=="component")}function Sr(e,t){const s=ne,n=o.dropId,a=o.dropPlace||"after",i=o.dragging;if(Ue(),i&&(ae=!0,e.setTimeout(()=>{ae=!1},0)),!i||b("dock:is-locked")||!s||!n||s===n)return;t?.preventDefault?.();const r=K(),l=wo(r,Se,s,n,a);l!==r&&pe(l)}function Ue(){try{De?.releasePointerCapture?.(Oe)}catch{}it?.(),ne=null,ke=null,De=null,Oe=null,o.dragging=!1,o.dropId=null,o.dropPlace=null}function wr(e,t,s){if(t.button!==0||!s||o.editingId||t.target?.closest?.("button, input"))return;Tn(),we=s,be={x:t.clientX,y:t.clientY},Be=t.currentTarget,Fe=t.pointerId;const n=i=>Cr(e,i),a=i=>Lr(e,i);lt=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),lt=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function Cr(e,t){if(!we||!be)return;const s=t.clientX-be.x,n=t.clientY-be.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{Be?.setPointerCapture?.(Fe)}catch{}}t.preventDefault();const i=e.document.elementFromPoint(t.clientX,t.clientY)?.closest?.("[data-sve-ht-sec-uid]"),r=i?.getAttribute("data-sve-ht-sec-uid")||"";if(!r||r===we){o.sectionDrop=null;return}const l=i.getBoundingClientRect();o.sectionDrop={uid:r,place:t.clientY-l.top<l.height/2?"before":"after"}}function Lr(e,t){const s=we,n=o.sectionDrop,a=o.dragging;Tn(),a&&(ae=!0,e.setTimeout(()=>{ae=!1},0)),!(!a||!s||!n?.uid||n.uid===s)&&(t?.preventDefault?.(),Pr(e,s,n.uid,n.place))}function Tn(){try{Be?.releasePointerCapture?.(Fe)}catch{}lt?.(),we=null,be=null,Be=null,Fe=null,o.dragging=!1,o.sectionDrop=null}function Pr(e,t,s,n){const a=Le(e)||"page_sections";for(const i of Ke(e.document)||[]){const r=Ne(i.values),l=r&&typeof r=="object"?r[a]:null;if(!Array.isArray(l))continue;const p=u=>l.findIndex(k=>k&&typeof k=="object"&&[k._visual_id,k.id,k._id].includes(u)),v=p(t),h=p(s);if(v===-1||h===-1||v===h)return!1;let c=n==="before"?h:h+1;return v<c&&(c-=1),c===v?!1:(e.postMessage({source:ce,type:le.MOVE,uid:t,toIndex:c},e.location.origin),e.setTimeout(()=>$(e),60),!0)}return!1}function Sn(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function dt(e,t){if(t?.kind==="component"){$r(e,t);return}if(V.callOpen&&(V.callOpen=!1,V.callStore=null,j.forget(),gt(e)),t?.kind!=="antlers"){o.inspect=null;return}const s=t.id;if(t.tag==="else"){o.inspect={key:s,title:f(e,"antlers_condition"),mode:"note",note:f(e,"antlers_else_note")};return}if(t.antlers==="loop"){const n=t.loopKind==="collection",a=te?.id===t.id?te.dir:"",i=t.sortDir||a;o.inspect={key:s,title:f(e,"antlers_loop"),mode:"loop",loopKind:n?"collection":"field",kinds:[{id:"field",label:f(e,"antlers_loop_field")},{id:"collection",label:f(e,"antlers_loop_collection")}],collections:Sn(e),value:t.expr||"",placeholder:f(e,n?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:f(e,"antlers_sort"),dir:i,needsField:i==="asc"||i==="desc",field:t.sortField||"",pickable:!n,placeholder:f(e,n?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:f(e,"antlers_sort_none")},{id:"asc",label:f(e,"antlers_sort_asc")},{id:"desc",label:f(e,"antlers_sort_desc")},{id:"random",label:f(e,"antlers_sort_random")}]},limit:{title:f(e,"antlers_limit"),value:t.limit||"",placeholder:f(e,"antlers_limit_placeholder")},branches:[]};return}o.inspect={key:s,title:f(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:f(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:f(e,"antlers_add_elseif")},{id:"else",label:f(e,"antlers_add_else")}]}}function $r(e,t){if(!yo(e)){o.inspect=null;return}if(!t.src)return;const s=t.id;if(o.inspect={key:s,title:f(e,"component_props_values"),mode:"note",note:f(e,"code_dock_loading")},ko()){const n={},a={},i=new Map;for(const[r,l]of bo(K().slice(t.from,t.to))){const p=_o(r);p&&(r!==p||!i.has(p))&&i.set(p,l)}for(const[r,l]of i)l.bound?a[r]=l.value:n[r]=l.value;Ot!==s&&(Ot=s,xe.clear());for(const r of xe)r in a||(a[r]="");o.inspect=null,V.callOpen=!0,V.title=V.title||f(e,"component_props"),V.callTitle=t.klass||t.name||t.src,V.callStore=j.ui,j.ui.canBind=!0,j.ui.dataTitle=f(e,"data_vars_title"),j.ui.exprPlaceholder=f(e,"component_props_expr"),j.ui.onToggleBind=(r,l)=>Hr(e,r,l),j.ui.onExpr=(r,l)=>Kt(e,r,l),j.ui.onPickData=(r,l)=>b("dock:data-menu",{anchor:l,at:t.from,onPick:p=>Kt(e,r,String(p?.var||"").trim())}),j.load(e,{key:`${t.src}::${s}`,src:t.src,params:n,bindings:a,readOnly:b("dock:is-locked")===!0}),j.watch(e,{src:t.src,write:r=>Er(e,r,a)}),gt(e);return}xo(e,t.src).then(n=>{if(o.inspect?.key===s){if(!n.length){o.inspect={key:s,title:f(e,"component_props_values"),mode:"note",note:f(e,"component_props_values_none")};return}o.inspect={key:s,title:f(e,"component_props_values"),mode:"props",inheritLabel:f(e,"component_props_inherit"),rows:To(n,K().slice(t.from,t.to))}}})}function Er(e,t,s={}){const n=o.rows.find(r=>r.id===M);if(n?.kind!=="component"||b("dock:is-locked"))return;let a=K(),i=n.to;for(const[r,l]of Object.entries(t||{})){if(r in s)continue;const p=a.length,v=yt(a,{from:n.from,to:i},r,l);v!==a&&(i+=v.length-p,a=v)}a!==K()&&(pe(a,{save:!0}),$(e))}function Hr(e,t,s){s?xe.add(t):xe.delete(t),wn(e,t,"",s),$(e)}function Kt(e,t,s){xe.add(t),wn(e,t,s,!0),$(e)}function wn(e,t,s,n){const a=o.rows.find(l=>l.id===M);if(a?.kind!=="component"||b("dock:is-locked"))return;const i=K(),r=yt(i,a,t,s,{bound:n});r!==i&&pe(r,{save:!0})}function qe(){const e=o.rows.find(t=>t.id===M);return e?.kind==="antlers"&&!b("dock:is-locked")?e:null}function se(e,t){const s=qe();if(!s)return;const n=K(),a=t(n,s);a!==n&&(pe(a),$(e))}function Nt(e,t,s,n){const a=o.rows.find(l=>l.id===M);if(a?.kind!=="component"||b("dock:is-locked"))return;const i=K(),r=yt(i,a,t,s,{bound:n});r!==i&&(pe(r,{save:!0}),$(e))}function Ar(e,t){se(e,(s,n)=>n.antlers==="loop"?st(s,n,n.loopKind==="collection"?"collection":"field",t):Ya(s,n,t))}function Ir(e,t){const s=qe();if(!s||s.antlers!=="loop")return;const n=s.loopKind==="collection"?"collection":"field";if(t!==n){if(t==="collection"){const a=Sn(e)[0]?.handle;if(!a)return;se(e,(i,r)=>st(i,r,"collection",a));return}se(e,(a,i)=>st(a,i,"field",i.handle||"items"))}}function Rr(e,t){se(e,(s,n)=>er(s,n,t))}function Mr(e,t){if(!e||!t||t.kind==="component"||Jt(t.tag))return null;const s=vo(e,t);if(s<t.openTo)return null;const n=e.lastIndexOf(`
`,s-1)+1;return e.slice(n,s).trim()===""&&n>t.openTo?n-1:s}function Tt(e,t,s){if(ae)return;const n=(s||o.rows).find(a=>a.id===t);n&&(M=t,o.rows.forEach(a=>{a.current=a.id===t}),dt(e,n),!_t()&&(b("dock:reveal-html",{from:n.from,to:n.to,caret:Mr(K(),n)}),b("dock:tw-follow"),he({source:ce,type:le.SVE_HTML_PICK_FOCUS,path:n.path},e)))}function Dr(e,t){if(!t)return"";const s=[],n=(a,i)=>{for(const r of a||[]){const l=i||r.path===e;r.kind==="component"&&r.src===t&&s.push({path:r.path,inside:l}),n(r.children,l)}};return n(Se,!1),(s.find(a=>a.inside)||s[0])?.path||""}function Or(e,t){if(!t||!G(e.document))return;Pe=!1,dr(t),$(e);const s=o.rows.find(n=>n.path===t);s&&(Tt(e,s.id,o.rows),e.setTimeout(()=>{G(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function ut(e){if(Re)return;const t=()=>{o.editingId||o.dragging||(e.clearTimeout(Me),Me=e.setTimeout(()=>{G(e.document)&&$(e)},80))},s=()=>{if(t(),b("dock:on-empty-page")===!0){const n=Ge(e,e.document);n[0]&&ze(e,e.document,n,n[0].uid,"")}};Re=Xt("dock:html-changed",t),e.document.addEventListener("sve-page-structure",s),rt=()=>{e.document.removeEventListener("sve-page-structure",s)}}function Br(e){Re?.(),Re=null,rt?.(),rt=null,e?.clearTimeout?.(Me),Me=0}function St(e){const t=G(e.document);if(he({source:ce,type:le.SVE_HTML_PICK,on:!1},e),Br(e),j.forget(),V.callOpen=!1,V.callStore=null,gt(e),Ue(),ee(),uo(e),M=null,o.inspect=null,o.editingId=null,o.draft="",o.sections=[],o.pageBuilder=!1,X="",e?.clearTimeout?.(Te),!t){nt(e);return}t.remove(),pt.headerTab==="html_tree"&&no(e,null),Nn(e),Gt(e),zt(e),nt(e)}function Xr(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=Ee,He(t,on,{title:f(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>St(e)))}function Yr(e){ut(e),$(e)}function Fr(e){const t=e.document;if(!Gn(e,"html_tree"))return;if(G(t)){ut(e),$(e);return}if(!mn(t))return;Pe=!0,q.clear(),zn(e,[Ee]);const s=t.createElement("div");s.id=Ee,s.style.cssText=Un,He(s,on,{title:f(e,"html_tree")}),s.querySelector("[data-sve-close]")?.addEventListener("click",()=>St(e)),Xn(e,s),Gt(e),zt(e),nt(e),ut(e),$(e)}function Wr(e){if(G(e.document)){St(e);return}Fr(e)}mt("html-tree:open-section",e=>{const t=window,s=t.document,n=Ge(t,s),a=n.find(i=>i.uid===e||i.ids.includes(e));return a?(ze(t,s,n,a.uid,""),{uid:a.uid,ids:a.ids}):null});mt("html-tree:from-preview",({path:e,src:t}={})=>{Wt(window,e)||Or(window,Dr(e,t)||e)});mt("html-tree:arm-pick",e=>{const t=window;return e?(bn(t,Ve(K())),!0):(G(t.document)||he({source:ce,type:le.SVE_HTML_PICK,on:!1},t),!0)});function Zr(){Q.clear(),ue.clear(),re.length=0}export{tr as HTML_TREE_STYLE_ID,Ur as armHtmlTreePrefetch,Zr as clearHtmlTreeTemplates,ee as closeHtmlTreeMenu,St as closeHtmlTreePanel,nr as ensureHtmlTreeStyles,Xr as fillHtmlTreePane,M as htmlTreeActiveId,G as htmlTreePanel,Me as htmlTreeTimer,Re as htmlTreeUnhook,Fr as openHtmlTreePanel,$ as renderHtmlTree,Yr as showHtmlTreePane,Br as stopWatchHtmlTreeDock,Wr as toggleHtmlTreePanel,ut as watchHtmlTreeDock};
