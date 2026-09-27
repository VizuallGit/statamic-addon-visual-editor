const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-AWaJHJyk.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{_ as je,I as j,J as cn,K as Ie,o as f,k as v,l as L,G as w,m as P,F as R,L as pe,n as N,b3 as un,x as $,O as bt,b4 as hn,a as T,t as h,A as ke,C as pn,z as Mt,b5 as eo,b6 as to,b7 as fn,b8 as mn,b9 as vn,ba as gn,bb as it,D as de,au as yn,bc as o,u as l,w as kn,v as bn,M as ie,bd as _n,B as Tn,be as X,bf as xn,bg as Sn,H as Ae,j as Te,bh as wn,bi as Cn,bj as oo,N as $n,Q as Ln,s as Rt,av as _t,ar as Pn,aP as Co,aQ as $o,i as En,am as no,a1 as Ue,X as Hn,aO as In,as as An,at as Mn,a9 as Rn,bk as Dn,bl as so,bm as Lo,a0 as Po,bn as Fn,E as Eo,aa as lt,T as Dt,U as Ft,az as dt,aA as Fe,S as Ot,bo as On,bp as Bn,bq as Nn,br as Vn,aS as jn,aT as Kn,ay as qn,bs as Gn,a$ as zn,al as Bt,aL as Un,aG as Xn}from"./addon-DRczUUKv.js";import{M as ee,S as te}from"./protocol-Brvy2KuB.js";import{canEditFields as Yn,currentSetHandle as Wn,openFieldsetOverlay as Ho,openGlobalFieldsOverlay as Zn}from"./section-fields-CQ16al83.js";import{H as Xe,ac as Jn}from"./ai-text-icon-B7vA1keB.js";import{F as Y,G as Qn,I as Nt,J as es,t as ts,K as Vt,x as os,B as ns,d as ct,m as ao,L as Io,s as ss,M as Ao,H as Se,N as as,O as jt,c as rs,Q as Mo,R as Ro,S as is,h as ls,a as ds,T as cs,U as us,V as hs,W as ps,X as fs,Y as ms,Z as vs,$ as gs,a0 as ys,a1 as ks}from"./tw-classes-BjW9KPpn.js";import{b as bs}from"./html-pick-align-CLq5l-p4.js";import"./FieldsetOverlay-TcAYGcj9.js";const _s={class:"sve-dialog__title"},Ts={for:"sve-new-section-group"},xs={class:"sve-dialog__row"},Ss=["disabled"],ws=["value"],Cs=["title","aria-label"],$s={key:0,class:"sve-dialog__add-group"},Ls={for:"sve-new-section-group-name"},Ps={class:"sve-dialog__row"},Es=["placeholder","disabled"],Hs=["disabled"],Is=["disabled"],As={for:"sve-new-section-name"},Ms=["placeholder"],Rs={key:1,class:"sve-dialog__toggle"},Ds={key:2,class:"sve-dialog__note"},Fs={class:"sve-dialog__actions"},Os=["disabled"],Bs=["disabled"],Ns={__name:"NewSectionPrompt",props:{heading:{type:String,required:!0},groupLabel:{type:String,required:!0},nameLabel:{type:String,required:!0},placeholder:{type:String,default:""},note:{type:String,default:""},groups:{type:Array,required:!0},toggleLabel:{type:String,default:""},toggleOn:{type:Boolean,default:!0},cancelLabel:{type:String,required:!0},saveLabel:{type:String,required:!0},onOk:{type:Function,required:!0},onClose:{type:Function,required:!0},addGroupLabel:{type:String,default:""},addGroupNameLabel:{type:String,default:""},addGroupPlaceholder:{type:String,default:""},onAddGroup:{type:Function,default:null}},setup(e){const t=e,s=j(""),n=j([...t.groups]),a=j(t.groups[0]?.key??""),i=j(!1),r=j(""),d=j(null),p=j(!1);function y(){i.value=!0,r.value="",Ie(()=>d.value?.focus())}function g(){i.value=!1,r.value="",Ie(()=>C.value?.focus())}async function c(){const E=r.value.trim();if(!E||p.value||!t.onAddGroup){d.value?.focus();return}p.value=!0;const M=await t.onAddGroup(E);if(p.value=!1,!M?.key){d.value?.focus();return}n.value.some(D=>D.key===M.key)||n.value.push(M),a.value=M.key,i.value=!1,r.value="",Ie(()=>C.value?.focus())}function k(E){E.key==="Enter"?(E.preventDefault(),c()):E.key==="Escape"&&(E.stopPropagation(),g())}const b=j(t.toggleOn),C=j(null),F=j(!1);cn(()=>Ie(()=>C.value?.focus()));function _(){const E=s.value.trim();if(!E||n.value.length&&!a.value||F.value){C.value?.focus();return}F.value=!0,t.onOk(E,a.value,b.value)}function m(E){E.target===E.currentTarget&&t.onClose()}function x(E){E.key==="Enter"?_():E.key==="Escape"&&t.onClose()}return(E,M)=>(f(),v("div",{class:"sve-dialog-overlay",onClick:m},[L("div",{class:"sve-dialog",onClick:M[5]||(M[5]=w(()=>{},["stop"]))},[L("div",_s,P(e.heading),1),n.value.length?(f(),v(R,{key:0},[L("label",Ts,P(e.groupLabel),1),L("div",xs,[pe(L("select",{id:"sve-new-section-group","onUpdate:modelValue":M[0]||(M[0]=D=>a.value=D),disabled:i.value,onKeydown:x},[(f(!0),v(R,null,N(n.value,D=>(f(),v("option",{key:D.key,value:D.key},P(D.display),9,ws))),128))],40,Ss),[[un,a.value]]),e.onAddGroup&&!i.value?(f(),v("button",{key:0,type:"button",class:"is-add",title:e.addGroupLabel,"aria-label":e.addGroupLabel,"data-sve-new-group":"",onClick:y},[...M[6]||(M[6]=[L("span",{"aria-hidden":"true"},"+",-1)])],8,Cs)):$("",!0)]),i.value?(f(),v("div",$s,[L("label",Ls,P(e.addGroupNameLabel||e.addGroupLabel),1),L("div",Ps,[pe(L("input",{id:"sve-new-section-group-name",ref_key:"groupInput",ref:d,"onUpdate:modelValue":M[1]||(M[1]=D=>r.value=D),type:"text",placeholder:e.addGroupPlaceholder,disabled:p.value,"data-sve-new-group-name":"",onKeydown:k},null,40,Es),[[bt,r.value]]),L("button",{type:"button",class:"is-primary is-small",disabled:p.value,"data-sve-new-group-create":"",onClick:c},P(e.saveLabel),9,Hs),L("button",{type:"button",class:"is-cancel is-small",disabled:p.value,onClick:g},P(e.cancelLabel),9,Is)])])):$("",!0)],64)):$("",!0),L("label",As,P(e.nameLabel),1),pe(L("input",{id:"sve-new-section-name",ref_key:"input",ref:C,"onUpdate:modelValue":M[2]||(M[2]=D=>s.value=D),type:"text",placeholder:e.placeholder,onKeydown:x},null,40,Ms),[[bt,s.value]]),e.toggleLabel?(f(),v("label",Rs,[pe(L("input",{"onUpdate:modelValue":M[3]||(M[3]=D=>b.value=D),type:"checkbox",onKeydown:x},null,544),[[hn,b.value]]),L("span",null,P(e.toggleLabel),1)])):$("",!0),e.note?(f(),v("p",Ds,P(e.note),1)):$("",!0),L("div",Fs,[L("button",{type:"button",class:"is-cancel",disabled:F.value,onClick:M[4]||(M[4]=(...D)=>e.onClose&&e.onClose(...D))},P(e.cancelLabel),9,Os),L("button",{type:"button",class:"is-primary",disabled:F.value,onClick:_},P(e.saveLabel),9,Bs)])])]))}},Do=je(Ns,[["__scopeId","data-v-6501522a"]]),Kt="/!/sve/section-types",ro="static_sections";async function Vs(e){const t=await e.fetch(Kt,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!t.ok)throw new Error(`section-types ${t.status}`);const s=await t.json();if(Array.isArray(s.groups)&&s.groups.length)return s.groups.filter(a=>a&&a.handle&&a.handle!==ro).map(a=>({key:a.handle,display:a.display||a.handle}));const n=new Map;for(const a of s.types||[])a?.group&&a.group!==ro&&!n.has(a.group)&&n.set(a.group,a.group_display||a.group);return[...n].map(([a,i])=>({key:a,display:i}))}async function js(e,t){const s=await e.fetch(`${Kt}/groups`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Mt(e),"X-Requested-With":"XMLHttpRequest",Accept:"application/json"},body:JSON.stringify({display:t})}),n=await s.json().catch(()=>({}));if(!s.ok||!n.group?.handle)throw new Error(n?.error==="bad_name"?"bad_name":`section-types/groups ${s.status}`);return e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale")),{key:n.group.handle,display:n.group.display||n.group.handle}}const Oe=new Map;function Ks(e){e?.handle&&Oe.set(e.handle,{static:!!e.static,hidden:!!e.hidden})}function qs(e,t){return t?Oe.has(t)?Oe.get(t).static:e.Statamic?.$config?.get?.("sveSetMeta")?.[t]?.static===!0:!1}function Gs(e,t){if(!t)return!1;if(Oe.has(t))return Oe.get(t).hidden;const s=e.Statamic?.$config?.get?.("sveSectionTypes");return Array.isArray(s)&&s.some(n=>n?.handle===t&&n.hidden===!0)}async function Fo(e,t,s){const n=await e.fetch(Kt,{method:t,headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Mt(e),Accept:"application/json"},credentials:"same-origin",body:JSON.stringify(s)}),a=await n.json().catch(()=>({}));if(!n.ok){const i=new Error(a.error||`section-types ${n.status}`);throw i.reason=a.error,i}return Ks(a.section),a}function zs(e,{display:t,group:s="",static:n=!1,hidden:a=!1}){return Fo(e,"POST",{display:t,group:s,static:n,hidden:a})}function io(e,{handle:t,hidden:s,fields:n=!1}){const a={handle:t,fields:n};return typeof s=="boolean"&&(a.hidden=s),Fo(e,"PATCH",a)}async function Us(e,t,s=null,n=null){if(!t||typeof eo!="function"||typeof to!="function")return null;const a=await eo(e,t);if(!a)return null;n&&Array.isArray(a.definitions)&&fn(t,{display:n.display||t,icon:n.icon||null,hide:n.hidden===!0,fields:a.definitions,group_display:n.group_display||n.group||""},n.group||"");const i=mn(),r=vn(e,"page",{handle:t},a?.defaults,i),d=gn(r,a?.new||{},a?.defaults);return to(e,e.document,s,r,d)?r:null}const lo=700,Xs=17;function Ys(e,t){const s=(t||[]).filter(Boolean);if(!s.length)return;let n=0;const a=()=>{n+=1;const i=it(e),r=i?s.some(d=>i.querySelector(`[data-sid="${CSS.escape(d)}"]`)):!0;r&&de({source:te,type:ee.SVE_ACTIVATE,ids:s},e),(r?!i&&n<6:n<Xs)&&e.setTimeout(a,lo)};e.setTimeout(a,lo)}function Oo(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function Ws(e){return new Promise(t=>{let s=!1;const n=i=>{s||(s=!0,a.dismiss(),t(i==="static"||i==="fields"?i:null))},a=ke(e.document,pn,{title:h(e,"section_new_kind"),body:h(e,"section_new_kind_note"),buttons:[{value:"cancel",label:h(e,"cancel"),variant:"ghost"},{value:"static",label:h(e,"section_new_static"),variant:"primary"},{value:"fields",label:h(e,"section_new_with_fields"),variant:"primary"}],onPick:n,onClose:()=>n(null)})})}const Zs=`<section class="[ ] py-800">
    
</section>
`;function Js(e){if(T("dock:is-locked")===!0)return e.Statamic?.$toast?.error(h(e,"code_dock_locked")),!1;const s=`${String(T("dock:html")||"").replace(/\s+$/,"")}

${Zs}`;return T("dock:set-html",s)!==!0?(e.Statamic?.$toast?.error(h(e,"section_new_failed")),!1):(T("dock:save-now"),e.Statamic?.$toast?.success(h(e,"section_new_template_done")),!0)}async function Bo(e,t,s,{afterUid:n,onDone:a,onError:i}){try{const r=await zs(e,s);t.dismiss(),e.Statamic?.$toast?.success(h(e,"section_created",{name:r.section?.display||s.display})),Tt(e);const d=r.section?.handle?{...r.section,group_display:(r.section_types||[]).find(y=>y?.handle===r.section.handle)?.group_display||""}:null,p=await Us(e,r.section?.handle,n,d);!p&&r.section?.handle&&T("dock:open-template",r.section.handle),a?.({...r,uid:p?._visual_id||""})}catch(r){t.dismiss(),e.Statamic?.$toast?.error(h(e,r.reason==="bad_name"?"section_new_bad_name":"section_new_failed")),i?.(r)}}function Tt(e){e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"))}function Qs(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){const i=ke(e.document,Do,{heading:h(e,"static_section_new"),groupLabel:"",nameLabel:h(e,"section_new_name"),placeholder:h(e,"section_new_placeholder"),note:h(e,"static_section_note"),groups:[],toggleLabel:h(e,"static_section_insertable"),cancelLabel:h(e,"cancel"),saveLabel:h(e,"section_new_create"),onClose:a,onOk:(r,d,p)=>{Bo(e,i,{display:r,static:!0,hidden:!p},{afterUid:t,onDone:s,onError:n})}})}function ea(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){(async()=>{let i=[];try{i=await Vs(e)}catch(d){n?.(d),e.Statamic?.$toast?.error(h(e,"section_new_failed"));return}if(!i.length){n?.(new Error("no groups")),e.Statamic?.$toast?.error(h(e,"section_new_failed"));return}const r=ke(e.document,Do,{heading:h(e,"section_new"),groupLabel:h(e,"section_new_group"),nameLabel:h(e,"section_new_name"),placeholder:h(e,"section_new_placeholder"),note:h(e,"section_new_note"),groups:i,addGroupLabel:h(e,"section_new_group_add"),addGroupNameLabel:h(e,"section_new_group_name"),addGroupPlaceholder:h(e,"section_new_group_placeholder"),onAddGroup:async d=>{try{const p=await js(e,d);return e.Statamic?.$toast?.success(h(e,"section_group_created",{name:p.display})),p}catch(p){return e.Statamic?.$toast?.error(h(e,p?.message==="bad_name"?"section_new_bad_name":"section_group_failed")),null}},cancelLabel:h(e,"cancel"),saveLabel:h(e,"section_new_create"),onClose:a,onOk:(d,p)=>{Bo(e,r,{display:d,group:p},{afterUid:t,onDone:s,onError:n})}})})()}const ta={key:0,class:"sve-ht-inspect"},oa={class:"sve-ht-inspect__head"},na={key:0,class:"sve-ht-inspect__note"},sa={key:2,class:"sve-ht-inspect__props"},aa={class:"sve-ht-inspect__proplabel"},ra={key:0},ia=["value","disabled","onChange"],la={value:""},da=["value"],ca=["value"],ua=["value","placeholder","onChange"],ha=["title","disabled","onClick"],pa=["title","disabled","onClick"],fa={key:0,class:"sve-ht-inspect__seg"},ma=["data-active","disabled","onClick"],va=["value","disabled"],ga={key:0,value:""},ya=["value"],ka={key:2,class:"sve-ht-inspect__box"},ba=["value","placeholder","disabled","onKeydown"],_a=["title","disabled"],Ta={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},xa=["value","disabled"],Sa=["value"],wa={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},Ca=["value","placeholder","disabled"],$a=["title","disabled"],La={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Pa=["value","placeholder","disabled"],Ea={key:4,class:"sve-ht-inspect__add"},Ha=["disabled","onClick"],ft='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',Ia='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',Aa={__name:"HtmlTreeInspector",setup(e){const t=j(null);yn(t,y=>o.onPropHost?.(y||null));const s=j(null),n=j(null);function a(y){o.onInspectCommit?.(y.target.value)}function i(y,g,c){!y||!g||(y.value=g,y.focus(),y.setSelectionRange(g.length,g.length),c(g))}function r(y,g){o.onInspectData?.(y.currentTarget,c=>o.onPropValue?.(g.handle,c,!0))}function d(y){o.onInspectData?.(y.currentTarget,g=>i(s.value,g,c=>o.onInspectCommit?.(c)))}function p(y){o.onInspectData?.(y.currentTarget,g=>i(n.value,g,c=>o.onLoopSortField?.(c)))}return(y,g)=>l(o).inspect?(f(),v("div",ta,[L("div",oa,P(l(o).inspect.title),1),l(o).inspect.mode==="note"?(f(),v("div",na,P(l(o).inspect.note),1)):l(o).inspect.mode==="statamic"?(f(),v("div",{key:1,ref_key:"propHost",ref:t,class:"sve-ht-inspect__form"},null,512)):l(o).inspect.mode==="props"?(f(),v("div",sa,[(f(!0),v(R,null,N(l(o).inspect.rows,c=>(f(),v("label",{key:c.handle,class:"sve-ht-inspect__prop"},[L("span",aa,[kn(P(c.label)+" ",1),c.bound?(f(),v("em",ra,":")):$("",!0)]),L("span",{class:bn(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":c.type==="select"||c.type==="link"}])},[c.type==="select"&&!c.bound?(f(),v("select",{key:0,value:c.value,disabled:!l(o).canEdit,onChange:k=>l(o).onPropValue?.(c.handle,k.target.value,!1)},[L("option",la,P(c.placeholder||l(o).inspect.inheritLabel),1),c.value&&!c.options.includes(c.value)?(f(),v("option",{key:0,value:c.value},P(c.value),9,da)):$("",!0),(f(!0),v(R,null,N(c.options,k=>(f(),v("option",{key:k,value:k},P(k),9,ca))),128))],40,ia)):(f(),v("input",{key:1,type:"text",value:c.value,placeholder:c.placeholder||l(o).inspect.inheritLabel,onChange:k=>l(o).onPropValue?.(c.handle,k.target.value,c.bound)},null,40,ua)),c.type==="link"?(f(),v("button",{key:2,type:"button","data-sve-ht-data":"",title:l(o).pageTitle,disabled:!l(o).canEdit,onClick:k=>l(o).onPropPage?.(k.currentTarget,c.handle),innerHTML:Ia},null,8,ha)):$("",!0),L("button",{type:"button","data-sve-ht-data":"",title:l(o).dataTitle,disabled:!l(o).canEdit,onClick:k=>r(k,c),innerHTML:ft},null,8,pa)],2)]))),128))])):(f(),v(R,{key:3},[l(o).inspect.mode==="loop"?(f(),v("div",fa,[(f(!0),v(R,null,N(l(o).inspect.kinds,c=>(f(),v("button",{key:c.id,type:"button","data-active":c.id===l(o).inspect.loopKind?"":void 0,disabled:!l(o).canEdit,onClick:k=>l(o).onLoopKind?.(c.id)},P(c.label),9,ma))),128))])):$("",!0),l(o).inspect.mode==="loop"&&l(o).inspect.loopKind==="collection"?(f(),v("select",{key:l(o).inspect.key+":"+l(o).inspect.value,value:l(o).inspect.value,disabled:!l(o).canEdit,onChange:a},[l(o).inspect.value?$("",!0):(f(),v("option",ga,P(l(o).inspect.placeholder),1)),(f(!0),v(R,null,N(l(o).inspect.collections,c=>(f(),v("option",{key:c.handle,value:c.handle},P(c.title),9,ya))),128))],40,va)):(f(),v("div",ka,[(f(),v("input",{ref_key:"field",ref:s,key:l(o).inspect.key,type:"text",value:l(o).inspect.value,placeholder:l(o).inspect.placeholder,disabled:!l(o).canEdit,spellcheck:"false",onKeydown:[g[0]||(g[0]=w(()=>{},["stop"])),ie(w(a,["prevent"]),["enter"])],onBlur:a},null,40,ba)),L("button",{type:"button","data-sve-ht-data":"",title:l(o).dataTitle,disabled:!l(o).canEdit,innerHTML:ft,onMousedown:g[1]||(g[1]=w(()=>{},["prevent"])),onClick:w(d,["stop","prevent"])},null,40,_a)])),l(o).inspect.sort?(f(),v(R,{key:3},[L("div",Ta,P(l(o).inspect.sort.title),1),(f(),v("select",{key:l(o).inspect.key+":dir:"+l(o).inspect.sort.dir,value:l(o).inspect.sort.dir,disabled:!l(o).canEdit,onChange:g[2]||(g[2]=c=>l(o).onLoopSortDir?.(c.target.value))},[(f(!0),v(R,null,N(l(o).inspect.sort.dirs,c=>(f(),v("option",{key:c.id,value:c.id},P(c.label),9,Sa))),128))],40,xa)),l(o).inspect.sort.needsField?(f(),v("div",wa,[(f(),v("input",{ref_key:"sortField",ref:n,key:l(o).inspect.key+":field",type:"text",value:l(o).inspect.sort.field,placeholder:l(o).inspect.sort.placeholder,disabled:!l(o).canEdit,spellcheck:"false",onKeydown:[g[3]||(g[3]=w(()=>{},["stop"])),g[4]||(g[4]=ie(w(c=>l(o).onLoopSortField?.(c.target.value),["prevent"]),["enter"]))],onBlur:g[5]||(g[5]=c=>l(o).onLoopSortField?.(c.target.value))},null,40,Ca)),l(o).inspect.sort.pickable?(f(),v("button",{key:0,type:"button","data-sve-ht-data":"",title:l(o).dataTitle,disabled:!l(o).canEdit,innerHTML:ft,onMousedown:g[6]||(g[6]=w(()=>{},["prevent"])),onClick:w(p,["stop","prevent"])},null,40,$a)):$("",!0)])):$("",!0),L("div",La,P(l(o).inspect.limit.title),1),(f(),v("input",{key:l(o).inspect.key+":limit",type:"number",min:"1",value:l(o).inspect.limit.value,placeholder:l(o).inspect.limit.placeholder,disabled:!l(o).canEdit,onKeydown:[g[7]||(g[7]=w(()=>{},["stop"])),g[8]||(g[8]=ie(w(c=>l(o).onLoopLimit?.(c.target.value),["prevent"]),["enter"]))],onBlur:g[9]||(g[9]=c=>l(o).onLoopLimit?.(c.target.value))},null,40,Pa))],64)):$("",!0),l(o).inspect.branches?.length?(f(),v("div",Ea,[(f(!0),v(R,null,N(l(o).inspect.branches,c=>(f(),v("button",{key:c.id,type:"button",disabled:!l(o).canEdit,onClick:k=>l(o).onAddBranch?.(c.id)},P(c.label),9,Ha))),128))])):$("",!0)],64))])):$("",!0)}},Ma=je(Aa,[["__scopeId","data-v-26254b75"]]),Ra={class:"sve-html-tree"},Da={class:"sve-pane-bar","data-sve-pane-bar":""},Fa={"data-sve-right-title":""},Oa={"data-sve-right-actions":""},Ba=["aria-pressed","title","aria-label"],Na={class:"sve-ht-tools"},Va=["title"],ja=["placeholder","aria-label","value"],Ka=["aria-label"],qa=["title","aria-label"],Ga={key:1,class:"sve-tree-exit"},za=["title"],Ua=["title"],Xa='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',Ya='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',Wa='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',Za='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',Ja={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const t=h(window,"html_tree_search");o.layers=_n(window);const s=h(window,"html_tree_layers_on"),n=h(window,"html_tree_layers_off");function a(){Sn(window,!o.layers)}const i=Oo(window),r=h(window,"section_new"),d=j(!1);function p(){d.value=!1}async function y(k){if(!k)return;await Ie(),o.onRefresh?.();const b=T("html-tree:open-section",k);b&&Ys(window,b.ids)}function g(){d.value||(d.value=!0,(async()=>{if(!(o.sections.length||o.pageBuilder)){Js(window),p();return}const k=await Ws(window);if(!k){p();return}const b=o.sections.length?o.sections[o.sections.length-1].uid:null,C=F=>{p(),y(F?.uid)};if(k==="static"){Qs(window,{afterUid:b,onDone:C,onError:p,onClose:p});return}ea(window,{afterUid:b,onDone:C,onError:p,onClose:p})})())}function c(k){const b=!!o.query;o.query=k,b!==!!k&&o.onQuery?.()}return(k,b)=>(f(),v("div",Ra,[L("div",Da,[L("div",Fa,P(e.title),1),L("div",Oa,[L("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":l(o).layers?"true":"false",title:l(o).layers?l(n):l(s),"aria-label":l(o).layers?l(n):l(s),innerHTML:Xa,onClick:a},null,8,Ba),b[5]||(b[5]=Tn('<button type="button" data-sve-right-pin aria-pressed="false" data-v-2640030d></button><button type="button" data-sve-close aria-label="Close" data-v-2640030d><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-2640030d><path d="M18 6 6 18" data-v-2640030d></path><path d="m6 6 12 12" data-v-2640030d></path></svg></button>',2))])]),L("div",Na,[L("label",{class:"sve-ht-search",title:l(t)},[L("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:Wa}),L("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:l(t),"aria-label":l(t),value:l(o).query,autocomplete:"off",spellcheck:"false",onInput:b[0]||(b[0]=C=>c(C.target.value)),onKeydown:[b[1]||(b[1]=w(()=>{},["stop"])),b[2]||(b[2]=ie(w(C=>c(""),["prevent"]),["escape"]))]},null,40,ja),l(o).query?(f(),v("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":l(t),innerHTML:Za,onClick:b[3]||(b[3]=C=>c(""))},null,8,Ka)):$("",!0)],8,Va),l(i)&&(l(o).sections.length||l(o).pageBuilder||l(o).rows.length&&!l(o).layoutFile)?(f(),v("button",{key:0,type:"button",class:"sve-ht-new",title:l(r),"aria-label":l(r),innerHTML:Ya,onClick:g},null,8,qa)):$("",!0)]),l(Y).inSidebar?$("",!0):(f(),X(Qn,{key:0})),b[6]||(b[6]=L("div",{"data-sve-html-tree-list":""},null,-1)),xn(Ma),l(o).exitOpen&&!l(Y).inSidebar?(f(),v("div",Ga,[L("span",{class:"sve-tree-exit__name",title:l(o).exitName},P(l(o).exitName),9,za),L("button",{type:"button",class:"sve-tree-exit__go",title:l(o).exitTitle,onClick:b[4]||(b[4]=C=>l(o).onExit?.())},P(l(o).exitLabel),9,Ua)])):$("",!0)]))}},No=je(Ja,[["__scopeId","data-v-2640030d"]]);function Vo(e){return String(e||"").trim().toLowerCase()}function xt(e,t){return t?[e.name,e.tag,e.klass,e.label,e.src].filter(s=>typeof s=="string"&&s).join(" ").toLowerCase().includes(t):!0}function Qa(e,t){const s=Vo(t);if(!s)return{rows:e,hits:new Set};const n=new Set;for(const r of e)xt(r,s)&&n.add(r.path);const a=[...n];return{rows:e.filter(r=>n.has(r.path)||a.some(d=>d.startsWith(`${r.path}/`))),hits:n}}const er=["title"],tr={"data-sve-ht-indent":"","aria-hidden":"true"},or=["data-sve-ht-cat"],nr={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},sr={key:2,"data-sve-ht-letter":""},ar=["innerHTML"],rr=["title"],ir=["title"],lr={key:1,"data-sve-ht-kind":""},dr={key:3,"data-sve-ht-name":""},cr={key:4,"data-sve-ht-actions":""},ur=["title"],hr={key:5,"data-sve-ht-actions":""},pr=["data-on","title","innerHTML"],fr=["disabled","title","innerHTML"],mr=["disabled","title"],vr=["disabled","title"],gr=["disabled","title"],yr=["data-sve-ht-id"],co='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',kr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',br='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',_r='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',Tr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',xr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',Sr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',wr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',Cr={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const t=Yn(window),s=h(window,"section_fields");function n(){const _=Wn();if(!_){window.Statamic?.$toast?.error(h(window,"section_fields_none"));return}Ho(window,_)}function a(_){return _.synthetic?_.frame==="main"?o.frameMainTitle:_.frame==="template"?o.frameTemplateTitle:o.frameOpenTitle:_.kind==="component"?_.src?`partial:${_.src}`:_.tag:_.name?`${_.tag} ${_.name}`:_.tag}function i(_){return!!_.section}function r(_){return!!_.frame}function d(_){return _.kind==="slot"}function p(_){return!!_.context}function y(_,m){p(m)||r(m)||d(m)||(i(m)?o.onSectionPointerDown?.(_,m.section):m.sectionRoot?o.onSectionPointerDown?.(_,m.sectionRoot):o.onPointerDown?.(_,m.id))}function g(_){if(_.synthetic){o.onFrame?.(_.frame);return}if(i(_)){o.onSection?.(_.section);return}if(p(_)){o.onContextRow?.(_.id);return}o.onSelect?.(_.id)}function c(_,m){const x={"data-sve-ht-id":_.id};return _.current&&(x["data-sve-ht-current"]=""),_.hidden&&(x["data-sve-ht-hidden"]=""),x["data-sve-ht-cat"]=_.cat||"other",x["data-sve-ht-depth"]=String(_.depth),m&&(x["data-sve-ht-dim"]=""),p(_)&&(x["data-sve-ht-context"]=_.context),i(_)&&(x["data-sve-ht-sec"]=""),r(_)&&(x["data-sve-ht-frame"]=_.frame),!i(_)&&o.dropId===_.id&&o.dropPlace&&(x["data-sve-ht-drop"]=o.dropPlace),x}function k(_){return!!_.fixed}function b(_){return!k(_)&&(!_.hidden||_.wrapFrom!=null)}function C(_){return!!_.sectionRoot||!!_.section}function F(_){return o.canEdit||C(_)}return(_,m)=>(f(),v(R,null,[L("div",Ae({"data-sve-ht-row":""},c(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:m[32]||(m[32]=x=>g(e.row)),onDblclick:m[33]||(m[33]=w(x=>e.row.synthetic?l(o).onFrameEnter?.(e.row.frame):r(e.row)||d(e.row)||i(e.row)||p(e.row)?null:l(o).onRename?.(e.row.id),["prevent"])),onKeydown:[m[34]||(m[34]=ie(w(x=>g(e.row),["prevent"]),["enter"])),m[35]||(m[35]=ie(w(x=>g(e.row),["prevent"]),["space"]))],onPointerdown:m[36]||(m[36]=x=>y(x,e.row)),onContextmenu:m[37]||(m[37]=w(x=>r(e.row)||d(e.row)||i(e.row)||p(e.row)?null:l(o).onContext?.(x,e.row.id),["prevent","stop"]))}),[L("span",tr,[(f(!0),v(R,null,N(e.row.guides||[],(x,E)=>(f(),v("i",{key:E,"data-sve-ht-cat":x},null,8,or))),128))]),e.row.hasChildren||e.row.emptyBlock?(f(),v("button",Ae({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?l(o).mainShut:e.row.shut)?{"data-sve-ht-shut":""}:{},{innerHTML:kr,onClick:m[0]||(m[0]=w(x=>e.row.synthetic?l(o).onFrameTwist?.():i(e.row)?l(o).onSection?.(e.row.section):l(o).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:m[1]||(m[1]=w(()=>{},["stop"])),onDblclick:m[2]||(m[2]=w(()=>{},["stop"]))}),null,16)):(f(),v("span",nr)),e.row.letter?(f(),v("span",sr,P(e.row.letter),1)):(f(),v("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,ar)),L("span",{"data-sve-ht-text":"",title:l(o).renameTitle},[!e.row.kind&&!i(e.row)&&!p(e.row)&&!r(e.row)?(f(),v("button",{key:0,type:"button","data-sve-ht-tag":"",title:l(o).tagTitle,onClick:m[3]||(m[3]=w(()=>{},["stop","prevent"])),onPointerdown:m[4]||(m[4]=w(()=>{},["stop"])),onDblclick:m[5]||(m[5]=w(x=>l(o).onTagChange?.(x,e.row.id),["stop","prevent"]))},P(e.row.tag),41,ir)):(f(),v("span",lr,P(e.row.tag),1)),l(o).editingId===e.row.id&&!i(e.row)?pe((f(),v("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":m[6]||(m[6]=x=>l(o).draft=x),onMousedown:m[7]||(m[7]=w(()=>{},["stop"])),onPointerdown:m[8]||(m[8]=w(()=>{},["stop"])),onClick:m[9]||(m[9]=w(()=>{},["stop"])),onDblclick:m[10]||(m[10]=w(()=>{},["stop"])),onKeydown:[m[11]||(m[11]=w(()=>{},["stop"])),m[12]||(m[12]=ie(w(x=>l(o).onRenameCommit?.(),["prevent"]),["enter"])),m[13]||(m[13]=ie(w(x=>l(o).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:m[14]||(m[14]=x=>l(o).onRenameCommit?.())},null,544)),[[bt,l(o).draft]]):(f(),v("span",dr,P(e.row.name),1))],8,rr),r(e.row)?(f(),v("span",cr,[e.row.frame!=="main"&&l(t)?(f(),v("button",{key:0,type:"button","data-sve-ht-fields":"",title:l(o).frameFieldsTitle,innerHTML:co,onClick:m[15]||(m[15]=w(x=>l(o).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:m[16]||(m[16]=w(()=>{},["stop"])),onDblclick:m[17]||(m[17]=w(()=>{},["stop"]))},null,40,ur)):$("",!0)])):!i(e.row)&&!p(e.row)&&!d(e.row)?(f(),v("span",hr,[e.row.videoNth>=0?(f(),v("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?l(o).videoPlayTitle:l(o).videoHoldTitle,innerHTML:e.row.videoHeld?Sr:xr,onClick:m[18]||(m[18]=w(x=>l(o).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:m[19]||(m[19]=w(()=>{},["stop"])),onDblclick:m[20]||(m[20]=w(()=>{},["stop"]))},null,40,pr)):$("",!0),b(e.row)?(f(),v("button",{key:1,type:"button","data-sve-ht-eye":"",disabled:!l(o).canEdit,title:l(o).canEdit?e.row.hidden?l(o).showTitle:l(o).hideTitle:l(o).lockedTitle,innerHTML:e.row.hidden?_r:br,onClick:m[21]||(m[21]=w(x=>l(o).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:m[22]||(m[22]=w(()=>{},["stop"])),onDblclick:m[23]||(m[23]=w(()=>{},["stop"]))},null,40,fr)):$("",!0),l(t)&&e.row.fieldsIcon?(f(),v("button",{key:2,type:"button","data-sve-ht-fields":"",disabled:!l(o).canEdit,title:l(o).canEdit?l(s):l(o).lockedTitle,innerHTML:co,onClick:w(n,["stop","prevent"]),onPointerdown:m[24]||(m[24]=w(()=>{},["stop"])),onDblclick:m[25]||(m[25]=w(()=>{},["stop"]))},null,40,mr)):$("",!0),k(e.row)?$("",!0):(f(),v("button",{key:3,type:"button","data-sve-ht-dup":"",disabled:!F(e.row),title:F(e.row)?l(o).duplicateTitle:l(o).lockedTitle,innerHTML:Tr,onClick:m[26]||(m[26]=w(x=>l(o).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:m[27]||(m[27]=w(()=>{},["stop"])),onDblclick:m[28]||(m[28]=w(()=>{},["stop"]))},null,40,vr)),k(e.row)?$("",!0):(f(),v("button",{key:4,type:"button","data-sve-ht-del":"",disabled:!F(e.row),title:F(e.row)?l(o).deleteTitle:l(o).lockedTitle,innerHTML:wr,onClick:m[29]||(m[29]=w(x=>l(o).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:m[30]||(m[30]=w(()=>{},["stop"])),onDblclick:m[31]||(m[31]=w(()=>{},["stop"]))},null,40,gr))])):$("",!0)],16,er),e.row.emptyBlock&&!e.row.shut?(f(),v("div",Ae({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},l(o).dropId===e.row.id&&l(o).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),P(l(o).slotText),17,yr)):$("",!0)],64))}},J=je(Cr,[["__scopeId","data-v-6c7b7132"]]),$r=["data-sve-ht-look","data-sve-ht-layers"],Lr={key:0,class:"sve-ht-empty"},Pr={key:1,class:"sve-ht-empty"},Er={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},Hr={key:0,class:"sve-ht-empty"},Ir={key:0,class:"sve-ht-empty"},Ar={key:2,"data-sve-ht-frame-body":""},Mr={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},Rr={key:0,class:"sve-ht-empty"},Dr={key:3,"data-sve-ht-frame-body":""},Fr=["data-dim"],Or={key:0,class:"sve-ht-empty"},Br={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},Nr={key:0,class:"sve-ht-empty"},Vr={__name:"HtmlTreeList",setup(e){const t=Te(()=>Vo(o.query)),s=Te(()=>Qa(o.rows,t.value)),n=Te(()=>s.value.rows),a=Te(()=>t.value?o.sections.filter(c=>xt(c.row,t.value)||c.current&&c.ready&&n.value.length>0):o.sections);function i(c){return!!c&&(!t.value||xt(c,t.value))}function r(c){const k=o.frame?.kind;return o.inComponent||(k==="header"||k==="footer")&&k!==c}const d=Te(()=>!!o.frame&&["header","main","footer"].some(c=>i(o.frame[c]))),p=Te(()=>!!t.value&&!a.value.length&&!n.value.length&&!d.value);function y(c){return!!t.value&&!s.value.hits.has(c.path)}function g(c){const k={"data-sve-ht-sec-uid":c.uid};return c.current&&(k["data-sve-ht-branch"]="",k["data-sve-ht-cat"]=c.row?.cat||"layout"),o.sectionDrop&&o.sectionDrop.uid===c.uid&&(k["data-sve-ht-drop"]=o.sectionDrop.place),k}return(c,k)=>(f(),v("div",Ae({class:"sve-ht-root","data-sve-ht-look":l(o).layers?"tags":l(o).look,"data-sve-ht-layers":l(o).layers?"":null,style:l(o).familyStyle},l(o).dragging?{"data-sve-ht-dragging":""}:{}),[!l(o).rows.length&&!l(o).sections.length&&!l(o).frame?(f(),v("div",Lr,P(l(o).emptyText),1)):p.value?(f(),v("div",Pr,P(l(o).searchEmpty),1)):$("",!0),l(o).frame||l(o).sections.length?(f(),v(R,{key:2},[l(o).frame?(f(),v(R,{key:0},[l(o).frame.kind==="header"?(f(),v("div",Er,[(f(!0),v(R,null,N(n.value,b=>(f(),X(J,{key:b.id,row:b,dim:y(b)},null,8,["row","dim"]))),128)),l(o).rows.length?$("",!0):(f(),v("div",Hr,P(l(o).emptyText),1))])):i(l(o).frame.header)?(f(),X(J,{key:1,row:l(o).frame.header,dim:r("header")},null,8,["row","dim"])):$("",!0)],64)):$("",!0),L("div",wn(Cn(l(o).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[l(o).frame?.kind==="main"?(f(),v(R,{key:0},[(f(!0),v(R,null,N(n.value,b=>(f(),X(J,{key:b.id,row:b,dim:y(b)},null,8,["row","dim"]))),128)),l(o).rows.length?$("",!0):(f(),v("div",Ir,P(l(o).emptyText),1))],64)):l(o).frame&&i(l(o).frame.main)?(f(),X(J,{key:1,row:l(o).frame.main,dim:r("main")},null,8,["row","dim"])):$("",!0),l(o).frame?.kind==="template"?pe((f(),v("div",Ar,[L("div",Mr,[(f(!0),v(R,null,N(n.value,b=>(f(),X(J,{key:b.id,row:b,dim:y(b)},null,8,["row","dim"]))),128)),l(o).rows.length?$("",!0):(f(),v("div",Rr,P(l(o).emptyText),1))])],512)),[[oo,!l(o).mainShut]]):$("",!0),l(o).sections.length||l(o).frame?pe((f(),v("div",Dr,[l(o).frame?.template&&i(l(o).frame.template)?(f(),X(J,{key:0,row:l(o).frame.template,dim:r("template")},null,8,["row","dim"])):$("",!0),l(o).frame&&!l(o).frame.template&&!l(o).sections.length&&!t.value?(f(),v("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":r("")?"":void 0},P(l(o).frameEmptyText),9,Fr)):$("",!0),(f(!0),v(R,null,N(a.value,b=>(f(),v("div",Ae({key:b.uid},{ref_for:!0},g(b)),[b.ready?(f(),v(R,{key:0},[(f(!0),v(R,null,N(n.value,C=>(f(),X(J,{key:C.id,row:C,dim:y(C)},null,8,["row","dim"]))),128)),l(o).rows.length?$("",!0):(f(),v("div",Or,P(l(o).emptyText),1))],64)):(f(),X(J,{key:1,row:b.row,dim:r("")},null,8,["row","dim"]))],16))),128))],512)),[[oo,!l(o).frame||!l(o).mainShut]]):$("",!0)],16),l(o).frame?(f(),v(R,{key:1},[l(o).frame.kind==="footer"?(f(),v("div",Br,[(f(!0),v(R,null,N(n.value,b=>(f(),X(J,{key:b.id,row:b,dim:y(b)},null,8,["row","dim"]))),128)),l(o).rows.length?$("",!0):(f(),v("div",Nr,P(l(o).emptyText),1))])):i(l(o).frame.footer)?(f(),X(J,{key:1,row:l(o).frame.footer,dim:r("footer")},null,8,["row","dim"])):$("",!0)],64)):$("",!0)],64)):l(o).rows.length?(f(!0),v(R,{key:3},N(n.value,b=>(f(),X(J,{key:b.id,row:b,dim:y(b)},null,8,["row","dim"]))),128)):$("",!0)],16,$r))}},uo=je(Vr,[["__scopeId","data-v-1efba2e6"]]);let mt=null;function jr(e){return mt||(mt=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{pages:[]}).then(t=>Array.isArray(t.pages)?t.pages:[]).catch(()=>[])),mt}let Ye=null;function vt(){Ye?.dismiss(),Ye=null}function Kr(e,t,s){vt();const n=t?.getBoundingClientRect?.(),a={x:n?n.left:0,y:n?n.bottom+4:0};jr(e).then(i=>{const r=i.length?i.map(d=>({label:d.title||d.url,onPick:()=>{vt(),s(d.url)}})):[{label:h(e,"component_props_pages_none"),onPick:null}];vt(),Ye=ke(e.document,Nt,{items:r,x:a.x,y:a.y,onClose:()=>{Ye=null}})})}const jo="sve-html-tree-labels";function Ko(){try{const e=globalThis.localStorage?.getItem(jo);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function qr(e){try{globalThis.localStorage?.setItem(jo,JSON.stringify(e))}catch{}}function qo(e){return String(e||"_")}function Go(e){const t=Ko()[qo(e)];return t&&typeof t=="object"?{...t}:{}}function Gr(e,t,s){const n=s?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function zr(e,t,s,n){if(!t)return;const a=qo(e),i=Ko(),r={...i[a]||{}},d=String(s||"").replace(/\s+/g," ").trim(),p=String(n||"").trim();!d||d===p?delete r[t]:r[t]=d,Object.keys(r).length?i[a]=r:delete i[a],qr(i)}const Ur=/^@(media|supports|container|layer|scope)\b/i;function Xr(e){const t=String(e||""),s=[];let n=0,a=0;for(;n<t.length;){if(t[n]==="{"&&t[n+1]==="{"){const d=t.indexOf("}}",n+2);n=d===-1?t.length:d+2;continue}if(t[n]==="/"&&t[n+1]==="*"){const d=t.indexOf("*/",n+2);n=d===-1?t.length:d+2;continue}if(t[n]==='"'||t[n]==="'"){const d=t[n];for(n+=1;n<t.length&&t[n]!==d;)n+=t[n]==="\\"?2:1;n+=1;continue}if(t[n]!=="{"){n+=1;continue}let i=1,r=n+1;for(;r<t.length&&i>0;){if(t[r]==="{"&&t[r+1]==="{"){const d=t.indexOf("}}",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==="/"&&t[r+1]==="*"){const d=t.indexOf("*/",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==='"'||t[r]==="'"){const d=t[r];for(r+=1;r<t.length&&t[r]!==d;)r+=t[r]==="\\"?2:1;r+=1;continue}t[r]==="{"?i+=1:t[r]==="}"&&(i-=1),r+=1}s.push({selector:t.slice(a,n).trim(),body:t.slice(n+1,r-1),from:a,to:r,text:t.slice(a,r).trim()}),n=r,a=r}return s}function ho(e){const t=String(e||""),s=new Set,n=new Set,a=new Set;for(const i of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const r of i[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))r&&(s.add(r),s.add(r.replace(/([:./%!#()[\],])/g,"\\$1")));for(const i of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))i[2].trim()&&n.add(i[2].trim());for(const i of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))a.add(i[1].toLowerCase());return{classes:s,ids:n,tags:a}}function po(e,t){const s=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),n=[...s.matchAll(/\.((?:\\.|[\w-])+)/g)].map(r=>r[1]),a=[...s.matchAll(/#((?:\\.|[\w-])+)/g)].map(r=>r[1]);if(n.length||a.length){const r=d=>d.replace(/\\(.)/g,"$1");return n.every(d=>t.classes.has(d)||t.classes.has(r(d)))&&a.every(d=>t.ids.has(r(d)))}const i=[...s.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(r=>r[2].toLowerCase());return i.length>0&&i.every(r=>t.tags.has(r))}function Yr(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function Wr(e,t,s){const n=Yr(e);if(!n.length)return"keep";const a=n.filter(r=>po(r,t));return a.length?a.length===n.length&&!n.some(r=>po(r,s))?"move":"copy":"keep"}function zo(e,t,s){const n=String(e||""),a=ho(t),i=ho(s),r=[],d=[];let p=0;for(const y of Xr(n)){const g=n.slice(y.from,y.to),c=g.match(/^\s*/)[0];if(p=y.to,Ur.test(y.selector)){const b=zo(y.body,t,s);b.move.trim()&&r.push(`${y.selector} {
${b.move.trim()}
}`),b.keep.trim()&&d.push(`${c}${y.selector} {
${b.keep.trim()}
}`);continue}const k=y.selector.startsWith("@")?"keep":Wr(y.selector,a,i);if(k==="move"){r.push(y.text);continue}k==="copy"&&r.push(y.text),d.push(g)}return d.push(n.slice(p)),{move:r.join(`

`).trim(),keep:d.join("").replace(/\n{3,}/g,`

`).trim()}}const Zr="/!/sve/component";function Jr(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let s=null;for(const n of t){if(!n.trim())continue;const a=n.match(/^[ \t]*/)[0].length;s=s===null?a:Math.min(s,a)}return s?t.map(n=>n.slice(s)).join(`
`):t.join(`
`)}function Qr(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function ei(e,t){if(!ts(e))return"";try{return await(await Ln(()=>import("./tw-compile-AWaJHJyk.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(s){return console.error("[sve] component tailwind compile",s),""}}async function ti(e,t){const s=await e.fetch(Zr,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":Mt(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!s.ok){const n=new Error(String(s.status));throw n.status=s.status,n}return s.json()}function fo(e,t){const{from:s,to:n}=es(e,t),a=e.slice(s,n);if(!a.trim())return null;const i=e.slice(0,s)+e.slice(n),r=T("dock:css"),d=zo(typeof r=="string"?r:"",a,i);return{html:Jr(a),css:d.move,keepCss:d.keep,lead:Qr(a),from:s,to:n}}function oi(e,t,{onDone:s,onError:n}={}){if(T("dock:is-locked")===!0)return;const a=T("dock:html");if(typeof a!="string"||!t)return;const i=fo(a,t);if(!i)return;const r=ke(e.document,$n,{heading:h(e,"component_new"),nameLabel:h(e,"component_name"),placeholder:h(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:h(e,"cancel"),saveLabel:h(e,"component_create"),onOk:d=>{r.dismiss(),(async()=>{try{const p=await ei(e,i.html),y=T("dock:html"),g=typeof y=="string"&&y===a?i:fo(y,t);if(!g)return;const c=await ti(e,{name:d,html:g.html,css:g.css,js:"",tw:p}),k=T("dock:html"),b=k.slice(0,g.from)+g.lead+c.tag+k.slice(g.to);T("dock:set-html",b),g.css.trim()&&T("dock:set-css",g.keepCss),s?.(c)}catch(p){n?.(p)}})()}})}function ni(e,t,s){const n=String(e||"");if(!t||t.kind!=="antlers")return n;const a=String(s||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?ii(n,t,a):t.tag==="else"||!a?n:n.slice(0,t.from)+`{{ ${t.tag} ${a} }}`+n.slice(t.openTo)}function St(e,t,s,n){return Me(e,t,{kind:s,name:n})}function Me(e,t,s={}){const n=String(e||"");if(!t||t.antlers!=="loop")return n;const a=t.loopKind==="collection"?"collection":"field",i=s.kind??a,r=String(s.name??t.expr??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(r))return n;const d=s.sortDir??t.sortDir??"",p=String(s.sortField??t.sortField??"").trim(),y=String(s.limit??t.limit??"").trim(),g=Uo(n,t);if(!g)return n;const c=i===a?t.params:"",k=i==="collection"?si(r,p,d,y,c):ai(r,p,d,y,c),b=i==="collection"?"collection":r;return n.slice(0,t.from)+k+n.slice(t.openTo,g.from)+`{{ /${b} }}`+n.slice(g.to)}function si(e,t,s,n,a){const i=ri(a).replace(/\bsort\s*=\s*["'][^"']*["']/g,"").replace(/\blimit\s*=\s*["']?\d+["']?/g,"").replace(/\s+/g," ").trim(),r=[`collection from="${e}"`];return s==="random"?r.push('sort="random"'):t&&r.push(`sort="${t}${s==="desc"?":desc":":asc"}"`),n&&r.push(`limit="${n}"`),i&&r.push(i),`{{ ${r.join(" ")} }}`}function ai(e,t,s,n,a){const i=String(a||"").split("|").map(d=>d.trim()).filter(d=>d&&!/^from\s*=/.test(d)&&!/^sort\s*:/.test(d)&&!/^reverse$/.test(d)&&!/^shuffle$/.test(d)&&!/^limit\s*:/.test(d)),r=[e,...i];return s==="random"?r.push("shuffle"):t&&(r.push(`sort:${t}`),s==="desc"&&r.push("reverse")),n&&r.push(`limit:${n}`),`{{ ${r.join(" | ")} }}`}function ri(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function Uo(e,t){const n=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return n?{from:t.from+n.index,to:t.from+n.index+n[0].length}:null}function ii(e,t,s){return Me(e,t,{name:s})}function li(e,t,s){const n=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return n;const a=Uo(n,t);if(!a)return n;const r=(n.slice(0,a.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],d=s==="else"?"{{ else }}":"{{ elseif true }}";return`${n.slice(0,a.from)}${d}
${r}${n.slice(a.from)}`}const G=as("sve-call-values"),Be=new Set;let mo=null;const di="__sve-html-tree-style",V=new Set;let wt="",xe=!1,gt=null,$e=!0,Q="",Ce=0,Xo="";const le=new Map,we=new Set;let K="",Yo=!1,O=null,We=null,Ge="",Ze="",Je=0,Ct=null,Ne=[],fe=null,Re=null,Qe=null,et=null,$t=null,ge=!1,me=null,Ve=null,De=null,tt=null,ot=null,Lt=null,he=null;function W(e){return e.getElementById(Xe)}function ci(e){En(e,di,`
    /* The row's content starts 0.625rem in from its own edge — the inset the
       search field above gives its icon — so the twist lines up with the rest
       of the panel instead of hugging the gutter. */
    [data-sve-ht-row] {
      all: unset;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0.375rem 0.5rem 0.375rem 0.625rem;
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
       starts at the panel's inset (0.625rem, as the search field's icon);
       the box keeps a hair of air above and below it. */
    [data-sve-ht-look="tags"] [data-sve-ht-row] {
      margin: 0 0 0 calc(var(--sve-ht-depth, 0) * 14px);
      padding: 0.0625rem 0.375rem 0.0625rem 0.625rem;
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
       the flow, so the row's box and everything in it start at the level.
       Moved in by the 0.375rem the twist moved when the row's inset went
       from 0.25rem to 0.625rem, so a line stands where it stood against it. */
    [data-sve-ht-look="tags"] [data-sve-ht-indent] {
      display: flex;
      position: absolute;
      top: -2px;
      bottom: 0;
      left: calc(0.375rem - var(--sve-ht-depth, 0) * 14px);
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
      padding-left: calc(0.625rem + (var(--sve-ht-depth, 0) + var(--sve-ht-base, 0)) * 0.875rem);
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
      left: calc(0.875rem + (var(--sve-ht-depth, 0) + var(--sve-ht-base, 0)) * 0.875rem);
    }
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-sec-uid][data-sve-ht-drop="before"]::before,
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-sec-uid][data-sve-ht-drop="after"]::after {
      left: calc(0.875rem + var(--sve-ht-base, 0) * 0.875rem);
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
  `)}function z(){const e=T("dock:html");return typeof e=="string"?e:""}function Wo(e){return!!T("dock:is-open",e)}function Le(e,{save:t=!1}={}){return Gt()||T("dock:set-html",e)!==!0?!1:(t&&T("dock:save-now"),!0)}function vo(e){const t=T("dock:component-exit-state")||{};if(o.exitOpen=!!t.open,!t.open){o.onExit=null;return}o.exitName=t.name||"",o.exitLabel=h(e,"component_exit"),o.exitTitle=h(e,t.back?"component_exit_back":"component_exit_close"),o.onExit=()=>{T("dock:exit-component"),A(e)}}function Zo(e,t){const s=jn(e);if(!s||t.type!==s)return"";const n=Kn(t[s]);return n&&qn(e,n)?.section_type||""}const ye=[];let yt=!1,Pt=!1;function kt(e,t){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(t,{timeout:2e3});return}e.setTimeout(t,200)}function ui(e,t){for(const s of t){const n=s.type;!n||le.has(n)||we.has(n)||ye.includes(n)||ye.push(n)}Rt.htmlTreePrefetchArmed&&qt(e)}function sl(e){Rt.htmlTreePrefetchArmed=!0,qt(e)}function qt(e){if(yt||!ye.length)return;yt=!0;const t=()=>{const s=ye.shift();if(!s){yt=!1;return}if(le.has(s)||we.has(s)){kt(e,t);return}we.add(s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(s)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{typeof n?.html=="string"&&(le.set(s,n.html),Pt&&(Pt=!1,A(e)))}).catch(()=>{}).finally(()=>{we.delete(s),kt(e,t)})};kt(e,t)}function Gt(){return!!K}function hi(e){const t=new Map,s=it(e);if(!s)return t;for(const n of s.querySelectorAll("[data-sid]")){const a=n.getAttribute("data-sid");a&&!t.has(a)&&t.set(a,n.tagName.toLowerCase())}return t}function ut(e,t){const s=lt(e)||"page_sections",n=hi(e),a=[];for(const i of Dt(t)||[]){const r=Ft(i.values),d=r&&typeof r=="object"?r[s]:null;if(Array.isArray(d)){d.forEach(p=>{if(!p||typeof p!="object"||Array.isArray(p)||typeof p.type!="string")return;const y=[p._visual_id,p.id,p._id].filter(C=>typeof C=="string"&&C!=="");if(!y.length)return;const g=Zo(e,p)||p.type,c=typeof p._sve_label=="string"?p._sve_label.trim():"",k=y.map(C=>n.get(C)).find(Boolean)||"section",b=Go(p.type)[`0:${k}`];a.push({uid:y[0],ids:y,type:p.type,tag:k,label:c||(typeof b=="string"&&b.trim()?b.trim():"")||dt(e,g)?.display||Fe(g)||g,svg:Ao(k,"",null).svg||Se.section,cat:Po(k),enabled:p.enabled!==!1,static:qs(e,g)})});break}}return a}function pi(e,t,s){if(!s.length)return"";const n=T("dock:current-type")||"",a=T("dock:current-uid"),i=!!T("dock:component-exit-state")?.open;if(a){const r=Ot(a,t),d=s.find(p=>p.ids.some(y=>r.includes(y)));if(d&&(i||d.type===n))return d.uid}return s.find(r=>r.type===n)?.uid||""}function fi(e,t,s,n){const a=t.find(C=>C.uid===s),i=T("dock:component-src"),r=T("dock:type-stack")||[];if(!a||!i||!r.length)return null;const d=r.map(C=>C.type).filter(C=>!le.get(C));if(d.length)return mi(e,d),null;const p=[],y=new Set,g=new Set;let c=C=>p.push(...C),k=null,b=0;for(let C=0;C<r.length;C+=1){const F=C+1<r.length?r[C+1].src:i,_=q=>({...q,id:`ctx${C}:${q.id}`,path:`ctx${C}/${q.path}`,ctxLevel:C,children:q.children.map(_)}),m=ct(le.get(r[C].type)).map(_),x=[],E=(q,Z)=>{for(const I of q){if(I.kind==="component"&&I.src===F)return x.push(...Z,I),I;const U=E(I.children,[...Z,I]);if(U)return U}return null};if(k=F?E(m,[]):null,!k)return null;const M=new Set(x.map(q=>q.id)),D=(q,Z)=>{for(const I of q)I.children.length&&(M.has(I.id)?V.has(I.path):Jo(I,Z))&&y.add(I.id),D(I.children,Z+1)};D(m,b),c(m),g.add(k.id),b+=x.length,c=(q=>Z=>{q.children=Z})(k)}for(const C of Qo(n))y.add(C);return V.has(k.path)&&y.add(k.id),k.children=n,{tree:p,folds:y,hostId:k.id,hostIds:g,levels:r.length,rootId:p.find(C=>!C.kind)?.id||"",label:a.label,svg:a.svg,cat:a.cat}}function mi(e,t){for(const s of t)!ye.includes(s)&&!we.has(s)&&ye.push(s);Pt=!0,qt(e)}function vi(e,t,s){const n=T("dock:component-exit-state");if(n?.open)return Fe(n.name)||n.name||"";if(s)return t.find(i=>i.uid===s)?.label||"";const a=T("dock:current-type")||"";return dt(e,a)?.display||Fe(a)||""}function ht(e,t,s,n,a){const i=s.find(d=>d.uid===n);if(!i||n===a)return;V.clear(),O=null,$e=!1,oe(),Ke(),Q=n,Xo=z(),K=le.get(i.type)||"",K&&(O=nt(ct(K))||null),Yo=(T("dock:current-type")||"")===i.type,e.clearTimeout(Ce),Ce=e.setTimeout(()=>{Q="",xe=!1,A(e)},4e3),A(e);const r=()=>Un(i.uid,t,e,{clampToSection:!0});Vn(i.uid,t,e,r),de({source:te,type:ee.SVE_ACTIVATE,ids:i.ids},e),e.setTimeout(()=>A(e),0)}function Et(e,t){if(!t)return!1;for(const s of e||[])if(s.id===t||Et(s.children,t))return!0;return!1}function nt(e){for(const t of e||[]){if(!t.kind)return t.id;const s=nt(t.children);if(s)return s}return""}function Jo(e,t){const s=t===0||e.path===Ze;return V.has(e.path)?s:!s}function Qo(e){const t=new Set,s=(n,a)=>{for(const i of n)i.children.length&&Jo(i,a)&&t.add(i.id),s(i.children,a+1)};return s(e,0),t}function A(e){const t=e.document,n=W(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;ci(t),ns(e);const a=z();K&&K===a&&(K=""),T("dock:chrome-kind")&&(K="");const i=K||a,r=ct(i);Ne=r,Ze="";const d=T("dock:current-type")||"",p=Go(d),y=Rn(e,t),c=!!(T("dock:component-exit-state")||{}).open,k=ut(e,t);d&&a&&!K&&le.set(d,a),ui(e,k);const b=pi(e,t,k),C=String(T("dock:chrome-kind")||"");if(Dn(e),y&&!k.length&&!C){Ne=[],o.rows=[],o.sections=[],o.frame=yo(e,[],!1,!1,"",!0),o.frameEmptyText=h(e,"html_tree_frame_no_sections"),o.pageBuilder=!0,o.layoutFile=!1,o.emptyText=h(e,"html_tree_empty"),o.canEdit=!T("dock:is-locked"),o.look=so(e),o.onRefresh=()=>A(e),o.onSection=null,go(e,""),vo(e),Ue(n,uo),_o(e,[]);return}o.pageBuilder=y;const F=`${d}|${b}`;let _=!1;F!==wt&&(wt=F,V.clear(),gt!==null&&i!==gt?_=!0:xe=i),(_||xe!==!1&&i!==xe)&&(xe=!1,V.clear(),O=nt(r)||null),gt=i,Q&&(Q===b||!k.length)&&(Yo||i!==Xo)&&(e.clearTimeout(Ce),Q="",xe=!1,Et(r,O)||(V.clear(),O=nt(r)||null));const m=k.some(u=>u.uid===Q)?Q:"",x=$e?"":m||b,E=c?fi(e,k,x,r):null,M=!!(m||b),D=M||c?"":String(T("dock:chrome-kind")||""),Z=y&&(!d&&!M||D==="main"&&T("dock:on-empty-page")===!0),I=Z||D==="template"?"":D;o.layoutFile=I==="main",I!=="main"&&(Ge="");const U=I==="main"?ko(r,"main"):null,Pe=U?st(r,u=>u.tag==="body"&&Et(u.children,U.id)):null;Ze=Pe?Pe.path:"",U&&(ze((Pe||U).path),Ge!==F&&(ze(U.path),V.add(U.path)));const Ee=I==="header"||I==="footer"?st(r,u=>i.slice(u.from,u.openTo).includes(`data-sve-chrome="${I}"`))||ko(r,I):null;Ee&&ze(Ee.path);const B=Z||!(I==="main"?!!U:I==="header"||I==="footer"?!!Ee:!0)?[]:E?ao(E.tree,o.query?new Set:E.folds):ao(r,o.query?new Set:Qo(r));!i.trim()&&!Wo(t)?o.emptyText=h(e,"html_tree_need_dock"):o.emptyText=h(e,"html_tree_empty"),o.slotText=h(e,"antlers_drop_here"),o.dataTitle=h(e,"data_vars_title"),o.pageTitle=h(e,"component_props_page"),o.renameTitle=h(e,"html_tree_rename"),o.tagTitle=h(e,"tw_tag"),o.hideTitle=h(e,"html_tree_hide"),o.showTitle=h(e,"html_tree_show"),o.duplicateTitle=h(e,"html_tree_duplicate"),o.deleteTitle=h(e,"html_tree_delete"),o.videoHoldTitle=h(e,"html_tree_video_hold"),o.videoPlayTitle=h(e,"html_tree_video_play"),o.lockedTitle=h(e,"html_tree_locked"),o.searchEmpty=h(e,"html_tree_search_empty"),o.canEdit=!T("dock:is-locked"),o.look=so(e),o.onQuery=()=>A(e),vo(e),o.inComponent=c,o.onContextRow=u=>{if(!E||u===E.hostId)return;const S=B.find(H=>H.id===u)?.ctxLevel??E.levels-1;T("dock:exit-component",E.levels-S),A(e)},o.onSelect=u=>{const S=B.find(H=>H.id===u);S&&Io(e,S.path)||rt(e,u,B)},o.onTwist=u=>{const S=B.find(H=>H.id===u)?.path;S&&(V.has(S)?V.delete(S):V.add(S),A(e))},o.onTagChange=(u,S)=>{const H=o.rows.find(ae=>ae.id===S);H&&!Gt()&&ss(e,u.currentTarget,H)},o.onRename=u=>_i(e,u),o.onRenameCommit=()=>To(e,!0),o.onRenameCancel=()=>To(e,!1),o.onHide=u=>Si(e,u),o.onVideoHold=u=>xi(e,u),o.onDuplicate=u=>wi(e,u),o.onDelete=u=>$i(e,u),o.onPointerDown=(u,S)=>Ai(e,u,S),o.onSectionPointerDown=(u,S)=>Di(e,u,S),o.onContext=(u,S)=>Hi(e,u,S),o.onInspectCommit=u=>Ki(e,u),o.onPropValue=(u,S,H)=>wo(e,u,S,H),o.onPropPage=(u,S)=>Kr(e,u,H=>wo(e,S,H,!1)),o.onLoopKind=u=>qi(e,u),o.onAddBranch=u=>Gi(e,u),o.onLoopSortField=u=>{const S=at(),H=String(u||"").trim();if(!S)return;const ae=he?.id===S.id?he.dir:"",re=S.sortDir||ae||"asc";he=null,ve(e,(_e,He)=>Me(_e,He,{sortField:H,sortDir:re}))},o.onLoopSortDir=u=>{const S=at(),H=String(u||"");if(S){if((H==="asc"||H==="desc")&&!S.sortField){he={id:S.id,dir:H},It(e,S);return}he=null,ve(e,(ae,re)=>Me(ae,re,{sortDir:H,sortField:H==="asc"||H==="desc"?re.sortField:""}))}},o.onLoopLimit=u=>ve(e,(S,H)=>Me(S,H,{limit:String(u||"").replace(/\D/g,"")})),o.onPropHost=u=>u?G.mount(u):G.unmount(),o.onInspectData=(u,S)=>{T("dock:data-menu",{anchor:u,at:B.find(H=>H.id===O)?.from,onPick:H=>S(String(H?.var||"").trim())})};const Yt=B.find(u=>!u.kind)?.id,Wt=c?"":vi(e,k,x),ce=x&&!c?k.find(u=>u.uid===x):null,ln=Lo(e,String(T("dock:current-type")||""));let dn=0;const ne=I==="header"||I==="footer"?I:"",be=Ee?Ee.id:"",ue=U&&B.find(u=>u.id===U.id)||null,Zt=Pe&&B.find(u=>u.id===Pe.id)||null,se=Zt||ue||be&&B.find(u=>u.id===be)||null,Jt=se?yi(B,se):-1;se&&!B.slice(B.indexOf(se),Jt).some(u=>u.id===O)&&(O=se.id);const Qt=o.layoutFile?gi(e):null;o.rows=B.map(u=>{const S=Qt&&u.kind==="component"&&Qt.get(u.src)||"",H=u.tag==="body"&&!u.kind,ae=S?{svg:Se[S]}:Ao(u.tag,u.kind,u.antlers),re=u.tag==="video"&&!u.kind?dn++:-1,_e=!!E&&u.id===E.rootId,He=u.id===Yt&&Wt?Wt:_e?E.label:u.klass,qe=u.id===Yt;return{...u,tag:S||u.tag,frameCall:S,fixed:!!S||H,base:He,name:ne&&u.id===be?h(e,`html_tree_frame_${ne}`):u===ue?h(e,"html_tree_frame_main"):qe&&ce?He:Gr(He,u.path,p),current:u.id===O,letter:_e?"":ae.letter||"",svg:ne&&u.id===be?Se[ne]:u===ue?Se.main:qe&&ce?ce.svg:_e?E.svg:ae.svg||"",frame:ne&&u.id===be?ne:u===ue?"main":"",cat:ne&&u.id===be?ne:u===ue||H?"main":_e?E.cat:S||Po(u.tag,u.kind,u.antlers),context:E?E.hostIds.has(u.id)?"host":u.id.startsWith("ctx")?"dim":"":"",sectionRoot:qe&&ce?ce.uid:"",fieldsIcon:!!(qe&&ce&&!ce.static),videoNth:re,videoHeld:re>=0&&ln.has(re)}}),Fn(e);const pt=[];for(const u of o.rows)pt.length=u.depth,u.guides=pt.slice(),pt[u.depth]=u.cat;if(se){const u=B.indexOf(se),S=se.depth;o.rows=o.rows.slice(u,Jt).map(H=>({...H,depth:H.depth-S,guides:H.guides.slice(S)})),ue&&Ge!==F&&(Ge=F,e.setTimeout(()=>rt(e,ue.id,B),0))}o.sections=y&&(M||I||Z)?k.map(u=>{const S=!!x&&u.uid===x;return{...u,current:S,ready:S&&(!m||!!K),row:{id:`sec:${u.uid}`,section:u.uid,tag:u.tag,name:u.label,kind:"",svg:u.svg,cat:u.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:S,hidden:!u.enabled}}}):[],o.frame=yo(e,k,M,c,I,!1,!!Zt),o.frameEmptyText=h(e,"html_tree_frame_no_sections"),go(e,I),o.onSection=u=>{ge||(Ht(e),ht(e,t,k,u,x))},o.onRefresh=()=>A(e),It(e,o.rows.find(u=>u.id===O)),Ue(n,uo),_o(e,r)}function go(e,t){o.frameOpenTitle=h(e,"html_tree_frame_open"),o.frameMainTitle=h(e,"html_tree_frame_main_open"),o.frameTemplateTitle=h(e,"html_tree_frame_template_open"),o.frameFieldsTitle=h(e,"html_tree_frame_fields"),o.onFrame=s=>{t===s?ki(e,s):bo(e,s)},o.onFrameEnter=s=>bo(e,s),o.onFrameFields=s=>Zn(e,On(e,s),h(e,`html_tree_frame_${s}`)),o.onFrameTwist=()=>{o.mainShut=!o.mainShut}}function yo(e,t,s,n,a,i=!1,r=!1){if(!a&&!i||r)return null;const d=g=>({id:`frame:${g}`,frame:g,synthetic:!0,tag:g,name:h(e,`html_tree_frame_${g}`),kind:"",svg:Se[g]||"",cat:g,letter:"",depth:0,hasChildren:g==="main"&&(t.length>0||a==="template"),shut:g!=="main",current:!1,hidden:!1}),p={kind:a,header:d("header"),main:d("main"),footer:d("footer"),template:null},y=a&&a!=="template"?String(T("dock:collection-view")||""):"";return y&&(p.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:dt(e,y)?.display||Fe(y.replace(/^view:/,"")),kind:"",svg:Se.section,cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),p}function ko(e,t){return st(e,s=>s.tag===t)}function st(e,t){for(const s of e||[]){if(!s.kind&&t(s))return s;const n=st(s.children,t);if(n)return n}return null}function gi(e){const t=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},s=new Map;for(const n of["header","footer"]){const a=rs(t[n]?.type);a&&s.set(a,n)}return s}function yi(e,t){let s=e.indexOf(t)+1;for(;s<e.length&&e[s].depth>t.depth;)s+=1;return s}function ki(e,t){const s=it(e);(t==="main"||t==="template"?s?.querySelector("main"):s?.querySelector(`[data-sve-chrome="${t}"]`))?.scrollIntoView({behavior:"smooth",block:"start"})}function Ht(e){const t=String(T("dock:chrome-open",e.document)||"");return t!=="header"&&t!=="footer"?!1:(Nn(e),de({source:te,type:ee.SVE_FORCE_EXIT_CHROME},e),!0)}function bi(e){e.clearTimeout(Ce),Q="",K="",V.clear(),O=null,$e=!1,oe(),Ke()}function bo(e,t){if(e.document,String(T("dock:chrome-kind")||"")===t)return;if(bi(e),t==="main"){Ht(e),T("dock:open-file",Jn);return}if(t==="template"){const i=String(T("dock:collection-view")||"");i&&(Ht(e),T("dock:open-file",i));return}if(t!=="header"&&t!=="footer")return;const s=it(e)?.querySelector(`[data-sve-chrome="${t}"]`);s?(s.scrollIntoView({block:"nearest"}),s.dispatchEvent(new s.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:te,type:ee.OPEN_CHROME,kind:t},e.location.origin);const n=Date.now(),a=async()=>{if(String(T("dock:chrome-kind")||"")!==t){Date.now()-n<3e4&&e.setTimeout(a,250);return}await(T("dock:load-settled")||null),rn(e)};e.setTimeout(a,250)}function _o(e,t){W(e.document)&&en(e,t)}function en(e,t){const s=t[0],n=!!T("dock:component-src"),a=n?"":T("dock:current-uid")||"";de({source:te,type:ee.SVE_HTML_PICK,on:!0,uid:a,uids:a?Ot(a,e.document):[],all:n,tag:s?.tag||"",klass:s?.klass||"",nodes:bs(t)},e)}function ze(e){if(!e)return;const t=(s,n)=>{for(const a of s||[]){if(a.path===e)return!0;if(t(a.children,n+1))return n===0||a.path===Ze?V.delete(a.path):V.add(a.path),!0}return!1};t(Ne,0)}function _i(e,t){if(ge)return;const s=o.rows.find(n=>n.id===t);!s||s.kind||(O=t,o.rows.forEach(n=>{n.current=n.id===t}),o.editingId=t,o.draft=s.name,e.setTimeout(()=>{const n=W(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function To(e,t){const s=o.editingId;if(!s)return;const n=o.rows.find(a=>a.id===s);o.editingId=null,t&&n&&(n.sectionRoot?Ti(e,n.sectionRoot,o.draft):zr(T("dock:current-type")||"",n.path,o.draft,n.base||n.klass)),o.draft="",A(e)}function Ti(e,t,s){const n=lt(e)||"page_sections",a=String(s||"").replace(/\s+/g," ").trim();for(const i of Dt(e.document)||[]){const r=Ft(i.values),d=r&&typeof r=="object"?r[n]:null;if(!Array.isArray(d))continue;const p=d.findIndex(k=>k&&typeof k=="object"&&[k._visual_id,k.id,k._id].includes(t));if(p===-1)continue;const y=Zo(e,d[p])||d[p].type,g=dt(e,y)?.display||Fe(y)||y,c=JSON.parse(JSON.stringify(d));return c[p]={...c[p]},!a||a===g?delete c[p]._sve_label:c[p]._sve_label=a,i.setFieldValue(n,c),!0}return!1}function xi(e,t){const s=o.rows.find(d=>d.id===t);if(!s||!(s.videoNth>=0))return;const n=String(T("dock:current-type")||""),a=Lo(e,n),i=!a.has(s.videoNth);i?a.add(s.videoNth):a.delete(s.videoNth);const r=String(T("dock:current-uid")||"");Bn(e,n,a),de({source:te,type:ee.SVE_VIDEO_HOLD,uid:r,uids:r?Ot(r,e.document):[],nth:s.videoNth,on:i},e),A(e)}function zt(e){return!!o.rows.find(t=>t.id===e)?.fixed}function Si(e,t){zt(t)||Ut(e,t,gs)}function wi(e,t){if(zt(t))return;const s=o.rows.find(n=>n.id===t)?.sectionRoot;if(s){e.postMessage({source:te,type:ee.DUPLICATE_ROW,uid:s},e.location.origin);return}Ut(e,t,ys)}function tn(e,t){Gn(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const s=e.document;Xn({uid:t},s,e)})}function Ci(e,t,s){Q===s&&(e.clearTimeout(Ce),Q="",K=""),O=null,$e=!1,wt="";const n=ut(e,t),a=n.find(i=>i.uid!==s)||n[0];a?ht(e,t,n,a.uid,""):(K="",o.rows=[],o.sections=[],o.frame=null,o.pageBuilder=!0,A(e)),e.setTimeout(()=>{W(e.document)&&A(e)},0)}Eo("row:removed",({uid:e,parentPath:t,doc:s,win:n})=>{t!==lt(n)||!W(n.document)||Ci(n,s,e)});function $i(e,t){if(zt(t))return;const s=o.sections?.find(a=>a.row?.id===t),n=s?s.row?.section||s.uid:o.rows.find(a=>a.id===t)?.sectionRoot;if(n){tn(e,n);return}Ut(e,t,ks)}function Ut(e,t,s){if(T("dock:is-locked"))return;const n=z(),a=o.rows.find(r=>r.id===t);if(!a)return;const i=s(n,a);i!==n&&Le(i)}function oe(){me?.dismiss(),me=null}const Li='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',Pi='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>';function on(e,t){const s=o.sections?.find(p=>p.uid===t),n=s?.type||"";if(!n||!Oo(e))return[];const a=s.label||n,i=Gs(e,n),r=()=>e.Statamic?.$toast?.error(h(e,"section_update_failed")),d=[{label:h(e,"static_section_insertable"),icon:i?Pi:Li,onPick:()=>{oe(),io(e,{handle:n,hidden:!i}).then(()=>{e.Statamic?.$toast?.success(h(e,i?"section_shown_to_editors":"section_hidden_from_editors",{name:a})),Tt(e)}).catch(r)}}];return s.static&&d.push({label:h(e,"section_add_fields"),onPick:()=>{oe(),io(e,{handle:n,fields:!0}).then(()=>{e.Statamic?.$toast?.success(h(e,"section_fields_added",{name:a})),Tt(e),A(e),Ho(e,n)}).catch(r)}}),d}function Ei(e,t,s){const n=s.row?.section||s.uid;n&&(me=ke(e.document,Nt,{items:[...on(e,n),{label:h(e,"html_tree_remove_section"),danger:!0,onPick:()=>{oe(),tn(e,n)}}],x:t.clientX,y:t.clientY,onClose:()=>{me=null}}))}function Hi(e,t,s){oe();const n=o.sections?.find(d=>d.row?.id===s);if(n){Ei(e,t,n);return}const a=o.rows.find(d=>d.id===s);if(!a)return;rt(e,s,o.rows);const i={x:t.clientX,y:t.clientY},r=d=>{d.length&&(me?.dismiss(),me=ke(e.document,Nt,{items:d,x:i.x,y:i.y,onClose:()=>{me=null}}))};if(a.kind==="component"){Ii(e,a,r);return}a.kind!=="slot"&&o.canEdit&&r([...a.sectionRoot?on(e,a.sectionRoot):[],{label:h(e,"component_make"),onPick:()=>{oe(),oi(e,a,{onDone:()=>A(e),onError:d=>{e.alert(d?.status===409?h(e,"component_exists"):h(e,"component_failed"))}})}}])}const xo=(e,t)=>{oe(),T("dock:open-template",t)};function Ii(e,t,s){if(!ls(t.src)){s([{label:h(e,"component_open_named",{name:t.name||t.src}),onPick:()=>xo(e,`view:partials/${t.src}`)}]);return}s([{label:h(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const a=Array.isArray(n.items)?n.items:[];s(a.length?a.map(i=>({label:h(e,"component_open_named",{name:i.label}),onPick:()=>xo(e,i.type)})):[{label:h(e,"component_none"),onPick:null}])}).catch(()=>s([{label:h(e,"component_none"),onPick:null}]))}function Ai(e,t,s){if(t.button!==0||T("dock:is-locked")||o.editingId||t.target?.closest?.("button, input"))return;Ke(),fe=s,Re={x:t.clientX,y:t.clientY},Qe=t.currentTarget,et=t.pointerId;const n=i=>Mi(e,i),a=i=>Ri(e,i);$t=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),$t=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function Mi(e,t){if(!fe||!Re)return;const s=t.clientX-Re.x,n=t.clientY-Re.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{Qe?.setPointerCapture?.(et)}catch{}}t.preventDefault();const a=e.document.elementFromPoint(t.clientX,t.clientY),i=a?.closest?.("[data-sve-ht-slot]");if(i){const c=i.getAttribute("data-sve-ht-id");if(c&&c!==fe){o.dropId=c,o.dropPlace="inside";return}}const r=a?.closest?.("[data-sve-ht-row]"),d=r?.getAttribute("data-sve-ht-id");if(!d||d===fe){o.dropId=null,o.dropPlace=null;return}const p=o.rows.find(c=>c.id===d),y=o.rows.find(c=>c.id===fe);if(!p||p.context||y&&p.path.startsWith(`${y.path}/`)){o.dropId=null,o.dropPlace=null;return}const g=r.getBoundingClientRect();o.dropId=d,o.dropPlace=ms(t.clientY-g.top,g.height,!Ro(p.tag)&&!Mo(p))}function Ri(e,t){const s=fe,n=o.dropId,a=o.dropPlace||"after",i=o.dragging;if(Ke(),i&&(ge=!0,e.setTimeout(()=>{ge=!1},0)),!i||T("dock:is-locked")||!s||!n||s===n)return;t?.preventDefault?.();const r=z(),d=vs(r,Ne,s,n,a);d!==r&&Le(d)}function Ke(){try{Qe?.releasePointerCapture?.(et)}catch{}$t?.(),fe=null,Re=null,Qe=null,et=null,o.dragging=!1,o.dropId=null,o.dropPlace=null}function Di(e,t,s){if(t.button!==0||!s||o.editingId||t.target?.closest?.("button, input"))return;nn(),Ve=s,De={x:t.clientX,y:t.clientY},tt=t.currentTarget,ot=t.pointerId;const n=i=>Fi(e,i),a=i=>Oi(e,i);Lt=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),Lt=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function Fi(e,t){if(!Ve||!De)return;const s=t.clientX-De.x,n=t.clientY-De.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{tt?.setPointerCapture?.(ot)}catch{}}t.preventDefault();const i=e.document.elementFromPoint(t.clientX,t.clientY)?.closest?.("[data-sve-ht-sec-uid]"),r=i?.getAttribute("data-sve-ht-sec-uid")||"";if(!r||r===Ve){o.sectionDrop=null;return}const d=i.getBoundingClientRect();o.sectionDrop={uid:r,place:t.clientY-d.top<d.height/2?"before":"after"}}function Oi(e,t){const s=Ve,n=o.sectionDrop,a=o.dragging;nn(),a&&(ge=!0,e.setTimeout(()=>{ge=!1},0)),!(!a||!s||!n?.uid||n.uid===s)&&(t?.preventDefault?.(),Bi(e,s,n.uid,n.place))}function nn(){try{tt?.releasePointerCapture?.(ot)}catch{}Lt?.(),Ve=null,De=null,tt=null,ot=null,o.dragging=!1,o.sectionDrop=null}function Bi(e,t,s,n){const a=lt(e)||"page_sections";for(const i of Dt(e.document)||[]){const r=Ft(i.values),d=r&&typeof r=="object"?r[a]:null;if(!Array.isArray(d))continue;const p=k=>d.findIndex(b=>b&&typeof b=="object"&&[b._visual_id,b.id,b._id].includes(k)),y=p(t),g=p(s);if(y===-1||g===-1||y===g)return!1;let c=n==="before"?g:g+1;return y<c&&(c-=1),c===y?!1:(e.postMessage({source:te,type:ee.MOVE,uid:t,toIndex:c},e.location.origin),e.setTimeout(()=>A(e),60),!0)}return!1}function sn(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function It(e,t){if(t?.kind==="component"){Ni(e,t);return}if(Y.callOpen&&(Y.callOpen=!1,Y.callStore=null,G.forget(),Vt(e)),t?.kind!=="antlers"){o.inspect=null;return}const s=t.id;if(t.tag==="else"){o.inspect={key:s,title:h(e,"antlers_condition"),mode:"note",note:h(e,"antlers_else_note")};return}if(t.antlers==="loop"){const n=t.loopKind==="collection",a=he?.id===t.id?he.dir:"",i=t.sortDir||a;o.inspect={key:s,title:h(e,"antlers_loop"),mode:"loop",loopKind:n?"collection":"field",kinds:[{id:"field",label:h(e,"antlers_loop_field")},{id:"collection",label:h(e,"antlers_loop_collection")}],collections:sn(e),value:t.expr||"",placeholder:h(e,n?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:h(e,"antlers_sort"),dir:i,needsField:i==="asc"||i==="desc",field:t.sortField||"",pickable:!n,placeholder:h(e,n?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:h(e,"antlers_sort_none")},{id:"asc",label:h(e,"antlers_sort_asc")},{id:"desc",label:h(e,"antlers_sort_desc")},{id:"random",label:h(e,"antlers_sort_random")}]},limit:{title:h(e,"antlers_limit"),value:t.limit||"",placeholder:h(e,"antlers_limit_placeholder")},branches:[]};return}o.inspect={key:s,title:h(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:h(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:h(e,"antlers_add_elseif")},{id:"else",label:h(e,"antlers_add_else")}]}}function Ni(e,t){if(!ds(e)){o.inspect=null;return}if(!t.src)return;const s=t.id;if(o.inspect={key:s,title:h(e,"component_props_values"),mode:"note",note:h(e,"code_dock_loading")},cs()){const n={},a={},i=new Map;for(const[r,d]of us(z().slice(t.from,t.to))){const p=hs(r);p&&(r!==p||!i.has(p))&&i.set(p,d)}for(const[r,d]of i)d.bound?a[r]=d.value:n[r]=d.value;mo!==s&&(mo=s,Be.clear());for(const r of Be)r in a||(a[r]="");o.inspect=null,Y.callOpen=!0,Y.title=Y.title||h(e,"component_props"),Y.callTitle=t.klass||t.name||t.src,Y.callStore=G.ui,G.ui.canBind=!0,G.ui.dataTitle=h(e,"data_vars_title"),G.ui.exprPlaceholder=h(e,"component_props_expr"),G.ui.onToggleBind=(r,d)=>ji(e,r,d),G.ui.onExpr=(r,d)=>So(e,r,d),G.ui.onPickData=(r,d)=>T("dock:data-menu",{anchor:d,at:t.from,onPick:p=>So(e,r,String(p?.var||"").trim())}),G.load(e,{key:`${t.src}::${s}`,src:t.src,params:n,bindings:a,readOnly:T("dock:is-locked")===!0}),G.watch(e,{src:t.src,write:r=>Vi(e,r,a)}),Vt(e);return}ps(e,t.src).then(n=>{if(o.inspect?.key===s){if(!n.length){o.inspect={key:s,title:h(e,"component_props_values"),mode:"note",note:h(e,"component_props_values_none")};return}o.inspect={key:s,title:h(e,"component_props_values"),mode:"props",inheritLabel:h(e,"component_props_inherit"),rows:fs(n,z().slice(t.from,t.to))}}})}function Vi(e,t,s={}){const n=o.rows.find(r=>r.id===O);if(n?.kind!=="component"||T("dock:is-locked"))return;let a=z(),i=n.to;for(const[r,d]of Object.entries(t||{})){if(r in s)continue;const p=a.length,y=jt(a,{from:n.from,to:i},r,d);y!==a&&(i+=y.length-p,a=y)}a!==z()&&(Le(a,{save:!0}),A(e))}function ji(e,t,s){s?Be.add(t):Be.delete(t),an(e,t,"",s),A(e)}function So(e,t,s){Be.add(t),an(e,t,s,!0),A(e)}function an(e,t,s,n){const a=o.rows.find(d=>d.id===O);if(a?.kind!=="component"||T("dock:is-locked"))return;const i=z(),r=jt(i,a,t,s,{bound:n});r!==i&&Le(r,{save:!0})}function at(){const e=o.rows.find(t=>t.id===O);return e?.kind==="antlers"&&!T("dock:is-locked")?e:null}function ve(e,t){const s=at();if(!s)return;const n=z(),a=t(n,s);a!==n&&(Le(a),A(e))}function wo(e,t,s,n){const a=o.rows.find(d=>d.id===O);if(a?.kind!=="component"||T("dock:is-locked"))return;const i=z(),r=jt(i,a,t,s,{bound:n});r!==i&&(Le(r,{save:!0}),A(e))}function Ki(e,t){ve(e,(s,n)=>n.antlers==="loop"?St(s,n,n.loopKind==="collection"?"collection":"field",t):ni(s,n,t))}function qi(e,t){const s=at();if(!s||s.antlers!=="loop")return;const n=s.loopKind==="collection"?"collection":"field";if(t!==n){if(t==="collection"){const a=sn(e)[0]?.handle;if(!a)return;ve(e,(i,r)=>St(i,r,"collection",a));return}ve(e,(a,i)=>St(a,i,"field",i.handle||"items"))}}function Gi(e,t){ve(e,(s,n)=>li(s,n,t))}function zi(e,t){if(!e||!t||Mo(t)||Ro(t.tag))return null;const s=is(e,t);if(s<t.openTo)return null;const n=e.lastIndexOf(`
`,s-1)+1;return e.slice(n,s).trim()===""&&n>t.openTo?n-1:s}function rt(e,t,s){if(ge)return;const n=(s||o.rows).find(a=>a.id===t);n&&(O=t,o.rows.forEach(a=>{a.current=a.id===t}),It(e,n),!Gt()&&(T("dock:reveal-html",{from:n.from,to:n.to,caret:zi(z(),n)}),T("dock:tw-follow"),de({source:te,type:ee.SVE_HTML_PICK_FOCUS,path:n.path},e)))}function Ui(e,t){if(!t)return"";const s=[],n=(a,i)=>{for(const r of a||[]){const d=i||r.path===e;r.kind==="component"&&r.src===t&&s.push({path:r.path,inside:d}),n(r.children,d)}};return n(Ne,!1),(s.find(a=>a.inside)||s[0])?.path||""}function Xi(e,t){if(!t||!W(e.document))return;$e=!1,ze(t),A(e);const s=o.rows.find(n=>n.path===t);s&&(rt(e,s.id,o.rows),e.setTimeout(()=>{W(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function At(e){if(We)return;const t=()=>{o.editingId||o.dragging||(e.clearTimeout(Je),Je=e.setTimeout(()=>{W(e.document)&&A(e)},80))},s=()=>{if(t(),T("dock:on-empty-page")===!0){const n=ut(e,e.document);n[0]&&ht(e,e.document,n,n[0].uid,"")}};We=Eo("dock:html-changed",t),e.document.addEventListener("sve-page-structure",s),Ct=()=>{e.document.removeEventListener("sve-page-structure",s)}}function Yi(e){We?.(),We=null,Ct?.(),Ct=null,e?.clearTimeout?.(Je),Je=0}function Xt(e){const t=W(e.document);if(de({source:te,type:ee.SVE_HTML_PICK,on:!1},e),Yi(e),G.forget(),Y.callOpen=!1,Y.callStore=null,Vt(e),Ke(),oe(),os(e),O=null,o.inspect=null,o.editingId=null,o.draft="",o.sections=[],o.pageBuilder=!1,o.layoutFile=!1,Q="",e?.clearTimeout?.(Ce),!t){_t(e);return}t.remove(),Rt.headerTab==="html_tree"&&zn(e,null),Pn(e),Co(e),$o(e),_t(e)}function al(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=Xe,Ue(t,No,{title:h(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>Xt(e)))}function rl(e){At(e),A(e)}function rn(e){const t=e.document;if(!Hn(e,"html_tree"))return;if(W(t)){At(e),A(e);return}if(!Wo(t))return;$e=!0,V.clear(),In(e,[Xe]);const s=t.createElement("div");s.id=Xe,s.style.cssText=An,Ue(s,No,{title:h(e,"html_tree")}),s.querySelector("[data-sve-close]")?.addEventListener("click",()=>Xt(e)),Mn(e,s),Co(e),$o(e),_t(e),At(e),A(e)}function il(e){if(W(e.document)){Xt(e);return}rn(e)}Bt("html-tree:open-section",e=>{const t=window,s=t.document,n=ut(t,s),a=n.find(i=>i.uid===e||i.ids.includes(e));return a?(ht(t,s,n,a.uid,""),{uid:a.uid,ids:a.ids}):null});Bt("html-tree:from-preview",({path:e,src:t}={})=>{Io(window,e)||Xi(window,Ui(e,t)||e)});Bt("html-tree:arm-pick",e=>{const t=window;return e?(en(t,ct(z())),!0):(W(t.document)||de({source:te,type:ee.SVE_HTML_PICK,on:!1},t),!0)});function ll(){le.clear(),we.clear(),ye.length=0}export{di as HTML_TREE_STYLE_ID,sl as armHtmlTreePrefetch,ll as clearHtmlTreeTemplates,oe as closeHtmlTreeMenu,Xt as closeHtmlTreePanel,ci as ensureHtmlTreeStyles,al as fillHtmlTreePane,O as htmlTreeActiveId,W as htmlTreePanel,Je as htmlTreeTimer,We as htmlTreeUnhook,rn as openHtmlTreePanel,A as renderHtmlTree,rl as showHtmlTreePane,Yi as stopWatchHtmlTreeDock,il as toggleHtmlTreePanel,At as watchHtmlTreeDock};
