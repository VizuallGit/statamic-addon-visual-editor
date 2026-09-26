const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-CV-GJ9BW.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{_ as Fe,H as j,I as en,J as $e,o as p,j as y,k as w,E as x,l as L,F as M,K as he,m as B,b1 as tn,w as $,M as ft,b2 as on,a as T,t as u,z as ye,C as nn,y as Lt,b3 as Kt,b4 as Gt,b5 as sn,b6 as an,b7 as rn,b8 as ln,b9 as Qe,B as le,as as dn,ba as o,u as l,v as cn,q as un,L as re,bb as hn,A as pn,bc as U,bd as fn,be as mn,G as Le,h as _e,bf as vn,bg as gn,bh as zt,N as yn,P as kn,s as Et,at as mt,ap as bn,aN as vo,aO as go,i as _n,ak as Ut,a0 as je,W as Tn,aM as xn,aq as Sn,ar as wn,bi as Cn,bj as Xt,bk as yo,$ as ko,bl as $n,D as bo,a8 as Be,S as et,T as tt,ax as ot,ay as Ie,R as Pt,bm as Ln,bn as En,bo as Pn,bp as Hn,aQ as In,aR as An,aw as Mn,bq as Rn,aZ as Dn,aj as Ht,aJ as On,aE as Fn}from"./addon-CcOobjIZ.js";import{M as Q,S as ee}from"./protocol-Brvy2KuB.js";import{canEditFields as Bn,currentSetHandle as Nn,openFieldsetOverlay as _o,openGlobalFieldsOverlay as jn}from"./section-fields-EI0UwQqr.js";import{H as Ve,a6 as Vn}from"./ai-text-icon-BLblG_5e.js";import{D as X,E as qn,F as It,G as Kn,t as Gn,I as At,v as zn,z as Un,b as nt,l as Yt,J as To,q as Xn,K as xo,H as Ae,L as Yn,M as Mt,N as So,O as Wn,h as Zn,c as Jn,Q as Qn,R as es,S as ts,T as os,U as ns,V as ss,W as as,X as rs,Y as is,Z as ls}from"./tw-classes-BPiXIIl-.js";import{b as ds}from"./html-pick-align-CLq5l-p4.js";import"./FieldsetOverlay-4-iJ2H8S.js";const cs={class:"sve-dialog__title"},us={for:"sve-new-section-group"},hs={class:"sve-dialog__row"},ps=["disabled"],fs=["value"],ms=["title","aria-label"],vs={key:0,class:"sve-dialog__add-group"},gs={for:"sve-new-section-group-name"},ys={class:"sve-dialog__row"},ks=["placeholder","disabled"],bs=["disabled"],_s=["disabled"],Ts={for:"sve-new-section-name"},xs=["placeholder"],Ss={key:1,class:"sve-dialog__toggle"},ws={key:2,class:"sve-dialog__note"},Cs={class:"sve-dialog__actions"},$s=["disabled"],Ls=["disabled"],Es={__name:"NewSectionPrompt",props:{heading:{type:String,required:!0},groupLabel:{type:String,required:!0},nameLabel:{type:String,required:!0},placeholder:{type:String,default:""},note:{type:String,default:""},groups:{type:Array,required:!0},toggleLabel:{type:String,default:""},toggleOn:{type:Boolean,default:!0},cancelLabel:{type:String,required:!0},saveLabel:{type:String,required:!0},onOk:{type:Function,required:!0},onClose:{type:Function,required:!0},addGroupLabel:{type:String,default:""},addGroupNameLabel:{type:String,default:""},addGroupPlaceholder:{type:String,default:""},onAddGroup:{type:Function,default:null}},setup(e){const t=e,s=j(""),n=j([...t.groups]),a=j(t.groups[0]?.key??""),i=j(!1),r=j(""),d=j(null),v=j(!1);function g(){i.value=!0,r.value="",$e(()=>d.value?.focus())}function _(){i.value=!1,r.value="",$e(()=>m.value?.focus())}async function c(){const P=r.value.trim();if(!P||v.value||!t.onAddGroup){d.value?.focus();return}v.value=!0;const A=await t.onAddGroup(P);if(v.value=!1,!A?.key){d.value?.focus();return}n.value.some(H=>H.key===A.key)||n.value.push(A),a.value=A.key,i.value=!1,r.value="",$e(()=>m.value?.focus())}function b(P){P.key==="Enter"?(P.preventDefault(),c()):P.key==="Escape"&&(P.stopPropagation(),_())}const k=j(t.toggleOn),m=j(null),f=j(!1);en(()=>$e(()=>m.value?.focus()));function C(){const P=s.value.trim();if(!P||n.value.length&&!a.value||f.value){m.value?.focus();return}f.value=!0,t.onOk(P,a.value,k.value)}function W(P){P.target===P.currentTarget&&t.onClose()}function F(P){P.key==="Enter"?C():P.key==="Escape"&&t.onClose()}return(P,A)=>(p(),y("div",{class:"sve-dialog-overlay",onClick:W},[w("div",{class:"sve-dialog",onClick:A[5]||(A[5]=x(()=>{},["stop"]))},[w("div",cs,L(e.heading),1),n.value.length?(p(),y(M,{key:0},[w("label",us,L(e.groupLabel),1),w("div",hs,[he(w("select",{id:"sve-new-section-group","onUpdate:modelValue":A[0]||(A[0]=H=>a.value=H),disabled:i.value,onKeydown:F},[(p(!0),y(M,null,B(n.value,H=>(p(),y("option",{key:H.key,value:H.key},L(H.display),9,fs))),128))],40,ps),[[tn,a.value]]),e.onAddGroup&&!i.value?(p(),y("button",{key:0,type:"button",class:"is-add",title:e.addGroupLabel,"aria-label":e.addGroupLabel,"data-sve-new-group":"",onClick:g},[...A[6]||(A[6]=[w("span",{"aria-hidden":"true"},"+",-1)])],8,ms)):$("",!0)]),i.value?(p(),y("div",vs,[w("label",gs,L(e.addGroupNameLabel||e.addGroupLabel),1),w("div",ys,[he(w("input",{id:"sve-new-section-group-name",ref_key:"groupInput",ref:d,"onUpdate:modelValue":A[1]||(A[1]=H=>r.value=H),type:"text",placeholder:e.addGroupPlaceholder,disabled:v.value,"data-sve-new-group-name":"",onKeydown:b},null,40,ks),[[ft,r.value]]),w("button",{type:"button",class:"is-primary is-small",disabled:v.value,"data-sve-new-group-create":"",onClick:c},L(e.saveLabel),9,bs),w("button",{type:"button",class:"is-cancel is-small",disabled:v.value,onClick:_},L(e.cancelLabel),9,_s)])])):$("",!0)],64)):$("",!0),w("label",Ts,L(e.nameLabel),1),he(w("input",{id:"sve-new-section-name",ref_key:"input",ref:m,"onUpdate:modelValue":A[2]||(A[2]=H=>s.value=H),type:"text",placeholder:e.placeholder,onKeydown:F},null,40,xs),[[ft,s.value]]),e.toggleLabel?(p(),y("label",Ss,[he(w("input",{"onUpdate:modelValue":A[3]||(A[3]=H=>k.value=H),type:"checkbox",onKeydown:F},null,544),[[on,k.value]]),w("span",null,L(e.toggleLabel),1)])):$("",!0),e.note?(p(),y("p",ws,L(e.note),1)):$("",!0),w("div",Cs,[w("button",{type:"button",class:"is-cancel",disabled:f.value,onClick:A[4]||(A[4]=(...H)=>e.onClose&&e.onClose(...H))},L(e.cancelLabel),9,$s),w("button",{type:"button",class:"is-primary",disabled:f.value,onClick:C},L(e.saveLabel),9,Ls)])])]))}},wo=Fe(Es,[["__scopeId","data-v-6501522a"]]),Rt="/!/sve/section-types",Wt="static_sections";async function Ps(e){const t=await e.fetch(Rt,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!t.ok)throw new Error(`section-types ${t.status}`);const s=await t.json();if(Array.isArray(s.groups)&&s.groups.length)return s.groups.filter(a=>a&&a.handle&&a.handle!==Wt).map(a=>({key:a.handle,display:a.display||a.handle}));const n=new Map;for(const a of s.types||[])a?.group&&a.group!==Wt&&!n.has(a.group)&&n.set(a.group,a.group_display||a.group);return[...n].map(([a,i])=>({key:a,display:i}))}async function Hs(e,t){const s=await e.fetch(`${Rt}/groups`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Lt(e),"X-Requested-With":"XMLHttpRequest",Accept:"application/json"},body:JSON.stringify({display:t})}),n=await s.json().catch(()=>({}));if(!s.ok||!n.group?.handle)throw new Error(n?.error==="bad_name"?"bad_name":`section-types/groups ${s.status}`);return e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale")),{key:n.group.handle,display:n.group.display||n.group.handle}}const Me=new Map;function Is(e){e?.handle&&Me.set(e.handle,{static:!!e.static,hidden:!!e.hidden})}function As(e,t){return t?Me.has(t)?Me.get(t).static:e.Statamic?.$config?.get?.("sveSetMeta")?.[t]?.static===!0:!1}function Ms(e,t){if(!t)return!1;if(Me.has(t))return Me.get(t).hidden;const s=e.Statamic?.$config?.get?.("sveSectionTypes");return Array.isArray(s)&&s.some(n=>n?.handle===t&&n.hidden===!0)}async function Co(e,t,s){const n=await e.fetch(Rt,{method:t,headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Lt(e),Accept:"application/json"},credentials:"same-origin",body:JSON.stringify(s)}),a=await n.json().catch(()=>({}));if(!n.ok){const i=new Error(a.error||`section-types ${n.status}`);throw i.reason=a.error,i}return Is(a.section),a}function Rs(e,{display:t,group:s="",static:n=!1,hidden:a=!1}){return Co(e,"POST",{display:t,group:s,static:n,hidden:a})}function Zt(e,{handle:t,hidden:s,fields:n=!1}){const a={handle:t,fields:n};return typeof s=="boolean"&&(a.hidden=s),Co(e,"PATCH",a)}async function Ds(e,t,s=null,n=null){if(!t||typeof Kt!="function"||typeof Gt!="function")return null;const a=await Kt(e,t);if(!a)return null;n&&Array.isArray(a.definitions)&&sn(t,{display:n.display||t,icon:n.icon||null,hide:n.hidden===!0,fields:a.definitions,group_display:n.group_display||n.group||""},n.group||"");const i=an(),r=rn(e,"page",{handle:t},a?.defaults,i),d=ln(r,a?.new||{},a?.defaults);return Gt(e,e.document,s,r,d)?r:null}const Jt=700,Os=17;function Fs(e,t){const s=(t||[]).filter(Boolean);if(!s.length)return;let n=0;const a=()=>{n+=1;const i=Qe(e),r=i?s.some(d=>i.querySelector(`[data-sid="${CSS.escape(d)}"]`)):!0;r&&le({source:ee,type:Q.SVE_ACTIVATE,ids:s},e),(r?!i&&n<6:n<Os)&&e.setTimeout(a,Jt)};e.setTimeout(a,Jt)}function $o(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function Bs(e){return new Promise(t=>{let s=!1;const n=i=>{s||(s=!0,a.dismiss(),t(i==="static"||i==="fields"?i:null))},a=ye(e.document,nn,{title:u(e,"section_new_kind"),body:u(e,"section_new_kind_note"),buttons:[{value:"cancel",label:u(e,"cancel"),variant:"ghost"},{value:"static",label:u(e,"section_new_static"),variant:"primary"},{value:"fields",label:u(e,"section_new_with_fields"),variant:"primary"}],onPick:n,onClose:()=>n(null)})})}const Ns=`<section class="[ ] py-800">
    
</section>
`;function js(e){if(T("dock:is-locked")===!0)return e.Statamic?.$toast?.error(u(e,"code_dock_locked")),!1;const s=`${String(T("dock:html")||"").replace(/\s+$/,"")}

${Ns}`;return T("dock:set-html",s)!==!0?(e.Statamic?.$toast?.error(u(e,"section_new_failed")),!1):(T("dock:save-now"),e.Statamic?.$toast?.success(u(e,"section_new_template_done")),!0)}async function Lo(e,t,s,{afterUid:n,onDone:a,onError:i}){try{const r=await Rs(e,s);t.dismiss(),e.Statamic?.$toast?.success(u(e,"section_created",{name:r.section?.display||s.display})),vt(e);const d=r.section?.handle?{...r.section,group_display:(r.section_types||[]).find(g=>g?.handle===r.section.handle)?.group_display||""}:null,v=await Ds(e,r.section?.handle,n,d);!v&&r.section?.handle&&T("dock:open-template",r.section.handle),a?.({...r,uid:v?._visual_id||""})}catch(r){t.dismiss(),e.Statamic?.$toast?.error(u(e,r.reason==="bad_name"?"section_new_bad_name":"section_new_failed")),i?.(r)}}function vt(e){e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"))}function Vs(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){const i=ye(e.document,wo,{heading:u(e,"static_section_new"),groupLabel:"",nameLabel:u(e,"section_new_name"),placeholder:u(e,"section_new_placeholder"),note:u(e,"static_section_note"),groups:[],toggleLabel:u(e,"static_section_insertable"),cancelLabel:u(e,"cancel"),saveLabel:u(e,"section_new_create"),onClose:a,onOk:(r,d,v)=>{Lo(e,i,{display:r,static:!0,hidden:!v},{afterUid:t,onDone:s,onError:n})}})}function qs(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){(async()=>{let i=[];try{i=await Ps(e)}catch(d){n?.(d),e.Statamic?.$toast?.error(u(e,"section_new_failed"));return}if(!i.length){n?.(new Error("no groups")),e.Statamic?.$toast?.error(u(e,"section_new_failed"));return}const r=ye(e.document,wo,{heading:u(e,"section_new"),groupLabel:u(e,"section_new_group"),nameLabel:u(e,"section_new_name"),placeholder:u(e,"section_new_placeholder"),note:u(e,"section_new_note"),groups:i,addGroupLabel:u(e,"section_new_group_add"),addGroupNameLabel:u(e,"section_new_group_name"),addGroupPlaceholder:u(e,"section_new_group_placeholder"),onAddGroup:async d=>{try{const v=await Hs(e,d);return e.Statamic?.$toast?.success(u(e,"section_group_created",{name:v.display})),v}catch(v){return e.Statamic?.$toast?.error(u(e,v?.message==="bad_name"?"section_new_bad_name":"section_group_failed")),null}},cancelLabel:u(e,"cancel"),saveLabel:u(e,"section_new_create"),onClose:a,onOk:(d,v)=>{Lo(e,r,{display:d,group:v},{afterUid:t,onDone:s,onError:n})}})})()}const Ks={key:0,class:"sve-ht-inspect"},Gs={class:"sve-ht-inspect__head"},zs={key:0,class:"sve-ht-inspect__note"},Us={key:2,class:"sve-ht-inspect__props"},Xs={class:"sve-ht-inspect__proplabel"},Ys={key:0},Ws=["value","disabled","onChange"],Zs={value:""},Js=["value"],Qs=["value"],ea=["value","placeholder","onChange"],ta=["title","disabled","onClick"],oa=["title","disabled","onClick"],na={key:0,class:"sve-ht-inspect__seg"},sa=["data-active","disabled","onClick"],aa=["value","disabled"],ra={key:0,value:""},ia=["value"],la={key:2,class:"sve-ht-inspect__box"},da=["value","placeholder","disabled","onKeydown"],ca=["title","disabled"],ua={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},ha=["value","disabled"],pa=["value"],fa={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},ma=["value","placeholder","disabled"],va=["title","disabled"],ga={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},ya=["value","placeholder","disabled"],ka={key:4,class:"sve-ht-inspect__add"},ba=["disabled","onClick"],it='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',_a='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',Ta={__name:"HtmlTreeInspector",setup(e){const t=j(null);dn(t,g=>o.onPropHost?.(g||null));const s=j(null),n=j(null);function a(g){o.onInspectCommit?.(g.target.value)}function i(g,_,c){!g||!_||(g.value=_,g.focus(),g.setSelectionRange(_.length,_.length),c(_))}function r(g,_){o.onInspectData?.(g.currentTarget,c=>o.onPropValue?.(_.handle,c,!0))}function d(g){o.onInspectData?.(g.currentTarget,_=>i(s.value,_,c=>o.onInspectCommit?.(c)))}function v(g){o.onInspectData?.(g.currentTarget,_=>i(n.value,_,c=>o.onLoopSortField?.(c)))}return(g,_)=>l(o).inspect?(p(),y("div",Ks,[w("div",Gs,L(l(o).inspect.title),1),l(o).inspect.mode==="note"?(p(),y("div",zs,L(l(o).inspect.note),1)):l(o).inspect.mode==="statamic"?(p(),y("div",{key:1,ref_key:"propHost",ref:t,class:"sve-ht-inspect__form"},null,512)):l(o).inspect.mode==="props"?(p(),y("div",Us,[(p(!0),y(M,null,B(l(o).inspect.rows,c=>(p(),y("label",{key:c.handle,class:"sve-ht-inspect__prop"},[w("span",Xs,[cn(L(c.label)+" ",1),c.bound?(p(),y("em",Ys,":")):$("",!0)]),w("span",{class:un(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":c.type==="select"||c.type==="link"}])},[c.type==="select"&&!c.bound?(p(),y("select",{key:0,value:c.value,disabled:!l(o).canEdit,onChange:b=>l(o).onPropValue?.(c.handle,b.target.value,!1)},[w("option",Zs,L(c.placeholder||l(o).inspect.inheritLabel),1),c.value&&!c.options.includes(c.value)?(p(),y("option",{key:0,value:c.value},L(c.value),9,Js)):$("",!0),(p(!0),y(M,null,B(c.options,b=>(p(),y("option",{key:b,value:b},L(b),9,Qs))),128))],40,Ws)):(p(),y("input",{key:1,type:"text",value:c.value,placeholder:c.placeholder||l(o).inspect.inheritLabel,onChange:b=>l(o).onPropValue?.(c.handle,b.target.value,c.bound)},null,40,ea)),c.type==="link"?(p(),y("button",{key:2,type:"button","data-sve-ht-data":"",title:l(o).pageTitle,disabled:!l(o).canEdit,onClick:b=>l(o).onPropPage?.(b.currentTarget,c.handle),innerHTML:_a},null,8,ta)):$("",!0),w("button",{type:"button","data-sve-ht-data":"",title:l(o).dataTitle,disabled:!l(o).canEdit,onClick:b=>r(b,c),innerHTML:it},null,8,oa)],2)]))),128))])):(p(),y(M,{key:3},[l(o).inspect.mode==="loop"?(p(),y("div",na,[(p(!0),y(M,null,B(l(o).inspect.kinds,c=>(p(),y("button",{key:c.id,type:"button","data-active":c.id===l(o).inspect.loopKind?"":void 0,disabled:!l(o).canEdit,onClick:b=>l(o).onLoopKind?.(c.id)},L(c.label),9,sa))),128))])):$("",!0),l(o).inspect.mode==="loop"&&l(o).inspect.loopKind==="collection"?(p(),y("select",{key:l(o).inspect.key+":"+l(o).inspect.value,value:l(o).inspect.value,disabled:!l(o).canEdit,onChange:a},[l(o).inspect.value?$("",!0):(p(),y("option",ra,L(l(o).inspect.placeholder),1)),(p(!0),y(M,null,B(l(o).inspect.collections,c=>(p(),y("option",{key:c.handle,value:c.handle},L(c.title),9,ia))),128))],40,aa)):(p(),y("div",la,[(p(),y("input",{ref_key:"field",ref:s,key:l(o).inspect.key,type:"text",value:l(o).inspect.value,placeholder:l(o).inspect.placeholder,disabled:!l(o).canEdit,spellcheck:"false",onKeydown:[_[0]||(_[0]=x(()=>{},["stop"])),re(x(a,["prevent"]),["enter"])],onBlur:a},null,40,da)),w("button",{type:"button","data-sve-ht-data":"",title:l(o).dataTitle,disabled:!l(o).canEdit,innerHTML:it,onMousedown:_[1]||(_[1]=x(()=>{},["prevent"])),onClick:x(d,["stop","prevent"])},null,40,ca)])),l(o).inspect.sort?(p(),y(M,{key:3},[w("div",ua,L(l(o).inspect.sort.title),1),(p(),y("select",{key:l(o).inspect.key+":dir:"+l(o).inspect.sort.dir,value:l(o).inspect.sort.dir,disabled:!l(o).canEdit,onChange:_[2]||(_[2]=c=>l(o).onLoopSortDir?.(c.target.value))},[(p(!0),y(M,null,B(l(o).inspect.sort.dirs,c=>(p(),y("option",{key:c.id,value:c.id},L(c.label),9,pa))),128))],40,ha)),l(o).inspect.sort.needsField?(p(),y("div",fa,[(p(),y("input",{ref_key:"sortField",ref:n,key:l(o).inspect.key+":field",type:"text",value:l(o).inspect.sort.field,placeholder:l(o).inspect.sort.placeholder,disabled:!l(o).canEdit,spellcheck:"false",onKeydown:[_[3]||(_[3]=x(()=>{},["stop"])),_[4]||(_[4]=re(x(c=>l(o).onLoopSortField?.(c.target.value),["prevent"]),["enter"]))],onBlur:_[5]||(_[5]=c=>l(o).onLoopSortField?.(c.target.value))},null,40,ma)),l(o).inspect.sort.pickable?(p(),y("button",{key:0,type:"button","data-sve-ht-data":"",title:l(o).dataTitle,disabled:!l(o).canEdit,innerHTML:it,onMousedown:_[6]||(_[6]=x(()=>{},["prevent"])),onClick:x(v,["stop","prevent"])},null,40,va)):$("",!0)])):$("",!0),w("div",ga,L(l(o).inspect.limit.title),1),(p(),y("input",{key:l(o).inspect.key+":limit",type:"number",min:"1",value:l(o).inspect.limit.value,placeholder:l(o).inspect.limit.placeholder,disabled:!l(o).canEdit,onKeydown:[_[7]||(_[7]=x(()=>{},["stop"])),_[8]||(_[8]=re(x(c=>l(o).onLoopLimit?.(c.target.value),["prevent"]),["enter"]))],onBlur:_[9]||(_[9]=c=>l(o).onLoopLimit?.(c.target.value))},null,40,ya))],64)):$("",!0),l(o).inspect.branches?.length?(p(),y("div",ka,[(p(!0),y(M,null,B(l(o).inspect.branches,c=>(p(),y("button",{key:c.id,type:"button",disabled:!l(o).canEdit,onClick:b=>l(o).onAddBranch?.(c.id)},L(c.label),9,ba))),128))])):$("",!0)],64))])):$("",!0)}},xa=Fe(Ta,[["__scopeId","data-v-26254b75"]]),Sa={class:"sve-html-tree"},wa={class:"sve-pane-bar","data-sve-pane-bar":""},Ca={"data-sve-right-title":""},$a={"data-sve-right-actions":""},La=["aria-pressed","title","aria-label"],Ea={class:"sve-ht-tools"},Pa=["title"],Ha=["placeholder","aria-label","value"],Ia=["aria-label"],Aa=["title","aria-label"],Ma={key:1,class:"sve-tree-exit"},Ra=["title"],Da=["title"],Oa='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',Fa='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',Ba='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',Na='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',ja={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const t=u(window,"html_tree_search");o.layers=hn(window);const s=u(window,"html_tree_layers_on"),n=u(window,"html_tree_layers_off");function a(){mn(window,!o.layers)}const i=$o(window),r=u(window,"section_new"),d=j(!1);function v(){d.value=!1}async function g(b){if(!b)return;await $e(),o.onRefresh?.();const k=T("html-tree:open-section",b);k&&Fs(window,k.ids)}function _(){d.value||(d.value=!0,(async()=>{if(!(o.sections.length||o.pageBuilder)){js(window),v();return}const b=await Bs(window);if(!b){v();return}const k=o.sections.length?o.sections[o.sections.length-1].uid:null,m=f=>{v(),g(f?.uid)};if(b==="static"){Vs(window,{afterUid:k,onDone:m,onError:v,onClose:v});return}qs(window,{afterUid:k,onDone:m,onError:v,onClose:v})})())}function c(b){const k=!!o.query;o.query=b,k!==!!b&&o.onQuery?.()}return(b,k)=>(p(),y("div",Sa,[w("div",wa,[w("div",Ca,L(e.title),1),w("div",$a,[w("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":l(o).layers?"true":"false",title:l(o).layers?l(n):l(s),"aria-label":l(o).layers?l(n):l(s),innerHTML:Oa,onClick:a},null,8,La),k[5]||(k[5]=pn('<button type="button" data-sve-right-pin aria-pressed="false" data-v-b2e9ab8b></button><button type="button" data-sve-close aria-label="Close" data-v-b2e9ab8b><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-b2e9ab8b><path d="M18 6 6 18" data-v-b2e9ab8b></path><path d="m6 6 12 12" data-v-b2e9ab8b></path></svg></button>',2))])]),w("div",Ea,[w("label",{class:"sve-ht-search",title:l(t)},[w("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:Ba}),w("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:l(t),"aria-label":l(t),value:l(o).query,autocomplete:"off",spellcheck:"false",onInput:k[0]||(k[0]=m=>c(m.target.value)),onKeydown:[k[1]||(k[1]=x(()=>{},["stop"])),k[2]||(k[2]=re(x(m=>c(""),["prevent"]),["escape"]))]},null,40,Ha),l(o).query?(p(),y("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":l(t),innerHTML:Na,onClick:k[3]||(k[3]=m=>c(""))},null,8,Ia)):$("",!0)],8,Pa),l(i)&&(l(o).sections.length||l(o).pageBuilder||l(o).rows.length)?(p(),y("button",{key:0,type:"button",class:"sve-ht-new",title:l(r),"aria-label":l(r),innerHTML:Fa,onClick:_},null,8,Aa)):$("",!0)]),l(X).inSidebar?$("",!0):(p(),U(qn,{key:0})),k[6]||(k[6]=w("div",{"data-sve-html-tree-list":""},null,-1)),fn(xa),l(o).exitOpen&&!l(X).inSidebar?(p(),y("div",Ma,[w("span",{class:"sve-tree-exit__name",title:l(o).exitName},L(l(o).exitName),9,Ra),w("button",{type:"button",class:"sve-tree-exit__go",title:l(o).exitTitle,onClick:k[4]||(k[4]=m=>l(o).onExit?.())},L(l(o).exitLabel),9,Da)])):$("",!0)]))}},Eo=Fe(ja,[["__scopeId","data-v-b2e9ab8b"]]);function Po(e){return String(e||"").trim().toLowerCase()}function gt(e,t){return t?[e.name,e.tag,e.klass,e.label,e.src].filter(s=>typeof s=="string"&&s).join(" ").toLowerCase().includes(t):!0}function Va(e,t){const s=Po(t);if(!s)return{rows:e,hits:new Set};const n=new Set;for(const r of e)gt(r,s)&&n.add(r.path);const a=[...n];return{rows:e.filter(r=>n.has(r.path)||a.some(d=>d.startsWith(`${r.path}/`))),hits:n}}const qa=["title"],Ka={"data-sve-ht-indent":"","aria-hidden":"true"},Ga=["data-sve-ht-cat"],za={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},Ua={key:2,"data-sve-ht-letter":""},Xa=["innerHTML"],Ya=["title"],Wa=["title"],Za={key:1,"data-sve-ht-kind":""},Ja={key:3,"data-sve-ht-name":""},Qa={key:4,"data-sve-ht-actions":""},er=["title"],tr={key:5,"data-sve-ht-actions":""},or=["data-on","title","innerHTML"],nr=["disabled","title","innerHTML"],sr=["disabled","title"],ar=["disabled","title"],rr=["disabled","title"],ir=["data-sve-ht-id"],Qt='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',lr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',dr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',cr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',ur='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',hr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',pr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',fr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',mr={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const t=Bn(window),s=u(window,"section_fields");function n(){const m=Nn();if(!m){window.Statamic?.$toast?.error(u(window,"section_fields_none"));return}_o(window,m)}function a(m){return m.synthetic?m.frame==="main"?o.frameMainTitle:m.frame==="template"?o.frameTemplateTitle:o.frameOpenTitle:m.kind==="component"?m.src?`partial:${m.src}`:m.tag:m.name?`${m.tag} ${m.name}`:m.tag}function i(m){return!!m.section}function r(m){return!!m.frame}function d(m){return!!m.context}function v(m,f){d(f)||r(f)||(i(f)?o.onSectionPointerDown?.(m,f.section):f.sectionRoot?o.onSectionPointerDown?.(m,f.sectionRoot):o.onPointerDown?.(m,f.id))}function g(m){if(m.synthetic){o.onFrame?.(m.frame);return}if(i(m)){o.onSection?.(m.section);return}if(d(m)){o.onContextRow?.(m.id);return}o.onSelect?.(m.id)}function _(m,f){const C={"data-sve-ht-id":m.id};return m.current&&(C["data-sve-ht-current"]=""),m.hidden&&(C["data-sve-ht-hidden"]=""),C["data-sve-ht-cat"]=m.cat||"other",C["data-sve-ht-depth"]=String(m.depth),f&&(C["data-sve-ht-dim"]=""),d(m)&&(C["data-sve-ht-context"]=m.context),i(m)&&(C["data-sve-ht-sec"]=""),r(m)&&(C["data-sve-ht-frame"]=m.frame),!i(m)&&o.dropId===m.id&&o.dropPlace&&(C["data-sve-ht-drop"]=o.dropPlace),C}function c(m){return!m.hidden||m.wrapFrom!=null}function b(m){return!!m.sectionRoot||!!m.section}function k(m){return o.canEdit||b(m)}return(m,f)=>(p(),y(M,null,[w("div",Le({"data-sve-ht-row":""},_(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:f[32]||(f[32]=C=>g(e.row)),onDblclick:f[33]||(f[33]=x(C=>e.row.synthetic?l(o).onFrameEnter?.(e.row.frame):r(e.row)||i(e.row)||d(e.row)?null:l(o).onRename?.(e.row.id),["prevent"])),onKeydown:[f[34]||(f[34]=re(x(C=>g(e.row),["prevent"]),["enter"])),f[35]||(f[35]=re(x(C=>g(e.row),["prevent"]),["space"]))],onPointerdown:f[36]||(f[36]=C=>v(C,e.row)),onContextmenu:f[37]||(f[37]=x(C=>r(e.row)||i(e.row)||d(e.row)?null:l(o).onContext?.(C,e.row.id),["prevent","stop"]))}),[w("span",Ka,[(p(!0),y(M,null,B(e.row.guides||[],(C,W)=>(p(),y("i",{key:W,"data-sve-ht-cat":C},null,8,Ga))),128))]),e.row.hasChildren||e.row.emptyBlock?(p(),y("button",Le({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?l(o).mainShut:e.row.shut)?{"data-sve-ht-shut":""}:{},{innerHTML:lr,onClick:f[0]||(f[0]=x(C=>e.row.synthetic?l(o).onFrameTwist?.():i(e.row)?l(o).onSection?.(e.row.section):l(o).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:f[1]||(f[1]=x(()=>{},["stop"])),onDblclick:f[2]||(f[2]=x(()=>{},["stop"]))}),null,16)):(p(),y("span",za)),e.row.letter?(p(),y("span",Ua,L(e.row.letter),1)):(p(),y("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Xa)),w("span",{"data-sve-ht-text":"",title:l(o).renameTitle},[!e.row.kind&&!i(e.row)&&!d(e.row)&&!r(e.row)?(p(),y("button",{key:0,type:"button","data-sve-ht-tag":"",title:l(o).tagTitle,onClick:f[3]||(f[3]=x(()=>{},["stop","prevent"])),onPointerdown:f[4]||(f[4]=x(()=>{},["stop"])),onDblclick:f[5]||(f[5]=x(C=>l(o).onTagChange?.(C,e.row.id),["stop","prevent"]))},L(e.row.tag),41,Wa)):(p(),y("span",Za,L(e.row.tag),1)),l(o).editingId===e.row.id&&!i(e.row)?he((p(),y("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":f[6]||(f[6]=C=>l(o).draft=C),onMousedown:f[7]||(f[7]=x(()=>{},["stop"])),onPointerdown:f[8]||(f[8]=x(()=>{},["stop"])),onClick:f[9]||(f[9]=x(()=>{},["stop"])),onDblclick:f[10]||(f[10]=x(()=>{},["stop"])),onKeydown:[f[11]||(f[11]=x(()=>{},["stop"])),f[12]||(f[12]=re(x(C=>l(o).onRenameCommit?.(),["prevent"]),["enter"])),f[13]||(f[13]=re(x(C=>l(o).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:f[14]||(f[14]=C=>l(o).onRenameCommit?.())},null,544)),[[ft,l(o).draft]]):(p(),y("span",Ja,L(e.row.name),1))],8,Ya),r(e.row)?(p(),y("span",Qa,[e.row.frame!=="main"&&l(t)?(p(),y("button",{key:0,type:"button","data-sve-ht-fields":"",title:l(o).frameFieldsTitle,innerHTML:Qt,onClick:f[15]||(f[15]=x(C=>l(o).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:f[16]||(f[16]=x(()=>{},["stop"])),onDblclick:f[17]||(f[17]=x(()=>{},["stop"]))},null,40,er)):$("",!0)])):!i(e.row)&&!d(e.row)?(p(),y("span",tr,[e.row.videoNth>=0?(p(),y("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?l(o).videoPlayTitle:l(o).videoHoldTitle,innerHTML:e.row.videoHeld?pr:hr,onClick:f[18]||(f[18]=x(C=>l(o).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:f[19]||(f[19]=x(()=>{},["stop"])),onDblclick:f[20]||(f[20]=x(()=>{},["stop"]))},null,40,or)):$("",!0),c(e.row)?(p(),y("button",{key:1,type:"button","data-sve-ht-eye":"",disabled:!l(o).canEdit,title:l(o).canEdit?e.row.hidden?l(o).showTitle:l(o).hideTitle:l(o).lockedTitle,innerHTML:e.row.hidden?cr:dr,onClick:f[21]||(f[21]=x(C=>l(o).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:f[22]||(f[22]=x(()=>{},["stop"])),onDblclick:f[23]||(f[23]=x(()=>{},["stop"]))},null,40,nr)):$("",!0),l(t)&&e.row.fieldsIcon?(p(),y("button",{key:2,type:"button","data-sve-ht-fields":"",disabled:!l(o).canEdit,title:l(o).canEdit?l(s):l(o).lockedTitle,innerHTML:Qt,onClick:x(n,["stop","prevent"]),onPointerdown:f[24]||(f[24]=x(()=>{},["stop"])),onDblclick:f[25]||(f[25]=x(()=>{},["stop"]))},null,40,sr)):$("",!0),w("button",{type:"button","data-sve-ht-dup":"",disabled:!k(e.row),title:k(e.row)?l(o).duplicateTitle:l(o).lockedTitle,innerHTML:ur,onClick:f[26]||(f[26]=x(C=>l(o).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:f[27]||(f[27]=x(()=>{},["stop"])),onDblclick:f[28]||(f[28]=x(()=>{},["stop"]))},null,40,ar),w("button",{type:"button","data-sve-ht-del":"",disabled:!k(e.row),title:k(e.row)?l(o).deleteTitle:l(o).lockedTitle,innerHTML:fr,onClick:f[29]||(f[29]=x(C=>l(o).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:f[30]||(f[30]=x(()=>{},["stop"])),onDblclick:f[31]||(f[31]=x(()=>{},["stop"]))},null,40,rr)])):$("",!0)],16,qa),e.row.emptyBlock&&!e.row.shut?(p(),y("div",Le({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},l(o).dropId===e.row.id&&l(o).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),L(l(o).slotText),17,ir)):$("",!0)],64))}},Z=Fe(mr,[["__scopeId","data-v-7a8d5dc8"]]),vr=["data-sve-ht-look","data-sve-ht-layers"],gr={key:0,class:"sve-ht-empty"},yr={key:1,class:"sve-ht-empty"},kr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},br={key:0,class:"sve-ht-empty"},_r={key:0,class:"sve-ht-empty"},Tr={key:2,"data-sve-ht-frame-body":""},xr={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},Sr={key:0,class:"sve-ht-empty"},wr={key:3,"data-sve-ht-frame-body":""},Cr=["data-dim"],$r={key:0,class:"sve-ht-empty"},Lr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},Er={key:0,class:"sve-ht-empty"},Pr={__name:"HtmlTreeList",setup(e){const t=_e(()=>Po(o.query)),s=_e(()=>Va(o.rows,t.value)),n=_e(()=>s.value.rows),a=_e(()=>t.value?o.sections.filter(c=>gt(c.row,t.value)||c.current&&c.ready&&n.value.length>0):o.sections);function i(c){return!!c&&(!t.value||gt(c,t.value))}function r(c){const b=o.frame?.kind;return o.inComponent||(b==="header"||b==="footer")&&b!==c}const d=_e(()=>!!o.frame&&["header","main","footer"].some(c=>i(o.frame[c]))),v=_e(()=>!!t.value&&!a.value.length&&!n.value.length&&!d.value);function g(c){return!!t.value&&!s.value.hits.has(c.path)}function _(c){const b={"data-sve-ht-sec-uid":c.uid};return c.current&&(b["data-sve-ht-branch"]="",b["data-sve-ht-cat"]=c.row?.cat||"layout"),o.sectionDrop&&o.sectionDrop.uid===c.uid&&(b["data-sve-ht-drop"]=o.sectionDrop.place),b}return(c,b)=>(p(),y("div",Le({class:"sve-ht-root","data-sve-ht-look":l(o).layers?"tags":l(o).look,"data-sve-ht-layers":l(o).layers?"":null,style:l(o).familyStyle},l(o).dragging?{"data-sve-ht-dragging":""}:{}),[!l(o).rows.length&&!l(o).sections.length&&!l(o).frame?(p(),y("div",gr,L(l(o).emptyText),1)):v.value?(p(),y("div",yr,L(l(o).searchEmpty),1)):$("",!0),l(o).frame||l(o).sections.length?(p(),y(M,{key:2},[l(o).frame?(p(),y(M,{key:0},[l(o).frame.kind==="header"?(p(),y("div",kr,[(p(!0),y(M,null,B(n.value,k=>(p(),U(Z,{key:k.id,row:k,dim:g(k)},null,8,["row","dim"]))),128)),l(o).rows.length?$("",!0):(p(),y("div",br,L(l(o).emptyText),1))])):i(l(o).frame.header)?(p(),U(Z,{key:1,row:l(o).frame.header,dim:r("header")},null,8,["row","dim"])):$("",!0)],64)):$("",!0),w("div",vn(gn(l(o).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[l(o).frame?.kind==="main"?(p(),y(M,{key:0},[(p(!0),y(M,null,B(n.value,k=>(p(),U(Z,{key:k.id,row:k,dim:g(k)},null,8,["row","dim"]))),128)),l(o).rows.length?$("",!0):(p(),y("div",_r,L(l(o).emptyText),1))],64)):l(o).frame&&i(l(o).frame.main)?(p(),U(Z,{key:1,row:l(o).frame.main,dim:r("main")},null,8,["row","dim"])):$("",!0),l(o).frame?.kind==="template"?he((p(),y("div",Tr,[w("div",xr,[(p(!0),y(M,null,B(n.value,k=>(p(),U(Z,{key:k.id,row:k,dim:g(k)},null,8,["row","dim"]))),128)),l(o).rows.length?$("",!0):(p(),y("div",Sr,L(l(o).emptyText),1))])],512)),[[zt,!l(o).mainShut]]):$("",!0),l(o).sections.length||l(o).frame?he((p(),y("div",wr,[l(o).frame?.template&&i(l(o).frame.template)?(p(),U(Z,{key:0,row:l(o).frame.template,dim:r("template")},null,8,["row","dim"])):$("",!0),l(o).frame&&!l(o).frame.template&&!l(o).sections.length&&!t.value?(p(),y("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":r("")?"":void 0},L(l(o).frameEmptyText),9,Cr)):$("",!0),(p(!0),y(M,null,B(a.value,k=>(p(),y("div",Le({key:k.uid},{ref_for:!0},_(k)),[k.ready?(p(),y(M,{key:0},[(p(!0),y(M,null,B(n.value,m=>(p(),U(Z,{key:m.id,row:m,dim:g(m)},null,8,["row","dim"]))),128)),l(o).rows.length?$("",!0):(p(),y("div",$r,L(l(o).emptyText),1))],64)):(p(),U(Z,{key:1,row:k.row,dim:r("")},null,8,["row","dim"]))],16))),128))],512)),[[zt,!l(o).frame||!l(o).mainShut]]):$("",!0)],16),l(o).frame?(p(),y(M,{key:1},[l(o).frame.kind==="footer"?(p(),y("div",Lr,[(p(!0),y(M,null,B(n.value,k=>(p(),U(Z,{key:k.id,row:k,dim:g(k)},null,8,["row","dim"]))),128)),l(o).rows.length?$("",!0):(p(),y("div",Er,L(l(o).emptyText),1))])):i(l(o).frame.footer)?(p(),U(Z,{key:1,row:l(o).frame.footer,dim:r("footer")},null,8,["row","dim"])):$("",!0)],64)):$("",!0)],64)):l(o).rows.length?(p(!0),y(M,{key:3},B(n.value,k=>(p(),U(Z,{key:k.id,row:k,dim:g(k)},null,8,["row","dim"]))),128)):$("",!0)],16,vr))}},eo=Fe(Pr,[["__scopeId","data-v-1efba2e6"]]);let lt=null;function Hr(e){return lt||(lt=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{pages:[]}).then(t=>Array.isArray(t.pages)?t.pages:[]).catch(()=>[])),lt}let qe=null;function dt(){qe?.dismiss(),qe=null}function Ir(e,t,s){dt();const n=t?.getBoundingClientRect?.(),a={x:n?n.left:0,y:n?n.bottom+4:0};Hr(e).then(i=>{const r=i.length?i.map(d=>({label:d.title||d.url,onPick:()=>{dt(),s(d.url)}})):[{label:u(e,"component_props_pages_none"),onPick:null}];dt(),qe=ye(e.document,It,{items:r,x:a.x,y:a.y,onClose:()=>{qe=null}})})}const Ho="sve-html-tree-labels";function Io(){try{const e=globalThis.localStorage?.getItem(Ho);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function Ar(e){try{globalThis.localStorage?.setItem(Ho,JSON.stringify(e))}catch{}}function Ao(e){return String(e||"_")}function Mo(e){const t=Io()[Ao(e)];return t&&typeof t=="object"?{...t}:{}}function Mr(e,t,s){const n=s?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function Rr(e,t,s,n){if(!t)return;const a=Ao(e),i=Io(),r={...i[a]||{}},d=String(s||"").replace(/\s+/g," ").trim(),v=String(n||"").trim();!d||d===v?delete r[t]:r[t]=d,Object.keys(r).length?i[a]=r:delete i[a],Ar(i)}const Dr=/^@(media|supports|container|layer|scope)\b/i;function Or(e){const t=String(e||""),s=[];let n=0,a=0;for(;n<t.length;){if(t[n]==="{"&&t[n+1]==="{"){const d=t.indexOf("}}",n+2);n=d===-1?t.length:d+2;continue}if(t[n]==="/"&&t[n+1]==="*"){const d=t.indexOf("*/",n+2);n=d===-1?t.length:d+2;continue}if(t[n]==='"'||t[n]==="'"){const d=t[n];for(n+=1;n<t.length&&t[n]!==d;)n+=t[n]==="\\"?2:1;n+=1;continue}if(t[n]!=="{"){n+=1;continue}let i=1,r=n+1;for(;r<t.length&&i>0;){if(t[r]==="{"&&t[r+1]==="{"){const d=t.indexOf("}}",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==="/"&&t[r+1]==="*"){const d=t.indexOf("*/",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==='"'||t[r]==="'"){const d=t[r];for(r+=1;r<t.length&&t[r]!==d;)r+=t[r]==="\\"?2:1;r+=1;continue}t[r]==="{"?i+=1:t[r]==="}"&&(i-=1),r+=1}s.push({selector:t.slice(a,n).trim(),body:t.slice(n+1,r-1),from:a,to:r,text:t.slice(a,r).trim()}),n=r,a=r}return s}function to(e){const t=String(e||""),s=new Set,n=new Set,a=new Set;for(const i of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const r of i[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))r&&(s.add(r),s.add(r.replace(/([:./%!#()[\],])/g,"\\$1")));for(const i of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))i[2].trim()&&n.add(i[2].trim());for(const i of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))a.add(i[1].toLowerCase());return{classes:s,ids:n,tags:a}}function oo(e,t){const s=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),n=[...s.matchAll(/\.((?:\\.|[\w-])+)/g)].map(r=>r[1]),a=[...s.matchAll(/#((?:\\.|[\w-])+)/g)].map(r=>r[1]);if(n.length||a.length){const r=d=>d.replace(/\\(.)/g,"$1");return n.every(d=>t.classes.has(d)||t.classes.has(r(d)))&&a.every(d=>t.ids.has(r(d)))}const i=[...s.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(r=>r[2].toLowerCase());return i.length>0&&i.every(r=>t.tags.has(r))}function Fr(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function Br(e,t,s){const n=Fr(e);if(!n.length)return"keep";const a=n.filter(r=>oo(r,t));return a.length?a.length===n.length&&!n.some(r=>oo(r,s))?"move":"copy":"keep"}function Ro(e,t,s){const n=String(e||""),a=to(t),i=to(s),r=[],d=[];let v=0;for(const g of Or(n)){const _=n.slice(g.from,g.to),c=_.match(/^\s*/)[0];if(v=g.to,Dr.test(g.selector)){const k=Ro(g.body,t,s);k.move.trim()&&r.push(`${g.selector} {
${k.move.trim()}
}`),k.keep.trim()&&d.push(`${c}${g.selector} {
${k.keep.trim()}
}`);continue}const b=g.selector.startsWith("@")?"keep":Br(g.selector,a,i);if(b==="move"){r.push(g.text);continue}b==="copy"&&r.push(g.text),d.push(_)}return d.push(n.slice(v)),{move:r.join(`

`).trim(),keep:d.join("").replace(/\n{3,}/g,`

`).trim()}}const Nr="/!/sve/component";function jr(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let s=null;for(const n of t){if(!n.trim())continue;const a=n.match(/^[ \t]*/)[0].length;s=s===null?a:Math.min(s,a)}return s?t.map(n=>n.slice(s)).join(`
`):t.join(`
`)}function Vr(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function qr(e,t){if(!Gn(e))return"";try{return await(await kn(()=>import("./tw-compile-CV-GJ9BW.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(s){return console.error("[sve] component tailwind compile",s),""}}async function Kr(e,t){const s=await e.fetch(Nr,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":Lt(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!s.ok){const n=new Error(String(s.status));throw n.status=s.status,n}return s.json()}function no(e,t){const{from:s,to:n}=Kn(e,t),a=e.slice(s,n);if(!a.trim())return null;const i=e.slice(0,s)+e.slice(n),r=T("dock:css"),d=Ro(typeof r=="string"?r:"",a,i);return{html:jr(a),css:d.move,keepCss:d.keep,lead:Vr(a),from:s,to:n}}function Gr(e,t,{onDone:s,onError:n}={}){if(T("dock:is-locked")===!0)return;const a=T("dock:html");if(typeof a!="string"||!t)return;const i=no(a,t);if(!i)return;const r=ye(e.document,yn,{heading:u(e,"component_new"),nameLabel:u(e,"component_name"),placeholder:u(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:u(e,"cancel"),saveLabel:u(e,"component_create"),onOk:d=>{r.dismiss(),(async()=>{try{const v=await qr(e,i.html),g=T("dock:html"),_=typeof g=="string"&&g===a?i:no(g,t);if(!_)return;const c=await Kr(e,{name:d,html:_.html,css:_.css,js:"",tw:v}),b=T("dock:html"),k=b.slice(0,_.from)+_.lead+c.tag+b.slice(_.to);T("dock:set-html",k),_.css.trim()&&T("dock:set-css",_.keepCss),s?.(c)}catch(v){n?.(v)}})()}})}function zr(e,t,s){const n=String(e||"");if(!t||t.kind!=="antlers")return n;const a=String(s||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?Wr(n,t,a):t.tag==="else"||!a?n:n.slice(0,t.from)+`{{ ${t.tag} ${a} }}`+n.slice(t.openTo)}function yt(e,t,s,n){return Ee(e,t,{kind:s,name:n})}function Ee(e,t,s={}){const n=String(e||"");if(!t||t.antlers!=="loop")return n;const a=t.loopKind==="collection"?"collection":"field",i=s.kind??a,r=String(s.name??t.expr??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(r))return n;const d=s.sortDir??t.sortDir??"",v=String(s.sortField??t.sortField??"").trim(),g=String(s.limit??t.limit??"").trim(),_=Do(n,t);if(!_)return n;const c=i===a?t.params:"",b=i==="collection"?Ur(r,v,d,g,c):Xr(r,v,d,g,c),k=i==="collection"?"collection":r;return n.slice(0,t.from)+b+n.slice(t.openTo,_.from)+`{{ /${k} }}`+n.slice(_.to)}function Ur(e,t,s,n,a){const i=Yr(a).replace(/\bsort\s*=\s*["'][^"']*["']/g,"").replace(/\blimit\s*=\s*["']?\d+["']?/g,"").replace(/\s+/g," ").trim(),r=[`collection from="${e}"`];return s==="random"?r.push('sort="random"'):t&&r.push(`sort="${t}${s==="desc"?":desc":":asc"}"`),n&&r.push(`limit="${n}"`),i&&r.push(i),`{{ ${r.join(" ")} }}`}function Xr(e,t,s,n,a){const i=String(a||"").split("|").map(d=>d.trim()).filter(d=>d&&!/^from\s*=/.test(d)&&!/^sort\s*:/.test(d)&&!/^reverse$/.test(d)&&!/^shuffle$/.test(d)&&!/^limit\s*:/.test(d)),r=[e,...i];return s==="random"?r.push("shuffle"):t&&(r.push(`sort:${t}`),s==="desc"&&r.push("reverse")),n&&r.push(`limit:${n}`),`{{ ${r.join(" | ")} }}`}function Yr(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function Do(e,t){const n=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return n?{from:t.from+n.index,to:t.from+n.index+n[0].length}:null}function Wr(e,t,s){return Ee(e,t,{name:s})}function Zr(e,t,s){const n=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return n;const a=Do(n,t);if(!a)return n;const r=(n.slice(0,a.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],d=s==="else"?"{{ else }}":"{{ elseif true }}";return`${n.slice(0,a.from)}${d}
${r}${n.slice(a.from)}`}const G=Yn("sve-call-values"),Re=new Set;let so=null;const Jr="__sve-html-tree-style",q=new Set;let kt="",Te=!1,ct=null,we=!0,J="",Se=0,Oo="";const ie=new Map,xe=new Set;let V="",Fo=!1,R=null,Ke=null,ut="",Ge=0,bt=null,De=[],pe=null,Pe=null,ze=null,Ue=null,_t=null,ve=!1,fe=null,Oe=null,He=null,Xe=null,Ye=null,Tt=null,ue=null;function Y(e){return e.getElementById(Ve)}function Qr(e){_n(e,Jr,`
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
  `)}function z(){const e=T("dock:html");return typeof e=="string"?e:""}function Bo(e){return!!T("dock:is-open",e)}function Ce(e,{save:t=!1}={}){return Ot()||T("dock:set-html",e)!==!0?!1:(t&&T("dock:save-now"),!0)}function ao(e){const t=T("dock:component-exit-state")||{};if(o.exitOpen=!!t.open,!t.open){o.onExit=null;return}o.exitName=t.name||"",o.exitLabel=u(e,"component_exit"),o.exitTitle=u(e,t.back?"component_exit_back":"component_exit_close"),o.onExit=()=>{T("dock:exit-component"),I(e)}}function No(e,t){const s=In(e);if(!s||t.type!==s)return"";const n=An(t[s]);return n&&Mn(e,n)?.section_type||""}const ge=[];let ht=!1,xt=!1;function pt(e,t){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(t,{timeout:2e3});return}e.setTimeout(t,200)}function ei(e,t){for(const s of t){const n=s.type;!n||ie.has(n)||xe.has(n)||ge.includes(n)||ge.push(n)}Et.htmlTreePrefetchArmed&&Dt(e)}function zi(e){Et.htmlTreePrefetchArmed=!0,Dt(e)}function Dt(e){if(ht||!ge.length)return;ht=!0;const t=()=>{const s=ge.shift();if(!s){ht=!1;return}if(ie.has(s)||xe.has(s)){pt(e,t);return}xe.add(s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(s)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{typeof n?.html=="string"&&(ie.set(s,n.html),xt&&(xt=!1,I(e)))}).catch(()=>{}).finally(()=>{xe.delete(s),pt(e,t)})};pt(e,t)}function Ot(){return!!V}function ti(e){const t=new Map,s=Qe(e);if(!s)return t;for(const n of s.querySelectorAll("[data-sid]")){const a=n.getAttribute("data-sid");a&&!t.has(a)&&t.set(a,n.tagName.toLowerCase())}return t}function oi(e,t){const s=Be(e)||"page_sections";for(const n of et(t)||[]){const a=tt(n.values),i=a&&typeof a=="object"?a[s]:null;if(Array.isArray(i))return!0}return!1}function st(e,t){const s=Be(e)||"page_sections",n=ti(e),a=[];for(const i of et(t)||[]){const r=tt(i.values),d=r&&typeof r=="object"?r[s]:null;if(Array.isArray(d)){d.forEach(v=>{if(!v||typeof v!="object"||Array.isArray(v)||typeof v.type!="string")return;const g=[v._visual_id,v.id,v._id].filter(m=>typeof m=="string"&&m!=="");if(!g.length)return;const _=No(e,v)||v.type,c=typeof v._sve_label=="string"?v._sve_label.trim():"",b=g.map(m=>n.get(m)).find(Boolean)||"section",k=Mo(v.type)[`0:${b}`];a.push({uid:g[0],ids:g,type:v.type,tag:b,label:c||(typeof k=="string"&&k.trim()?k.trim():"")||ot(e,_)?.display||Ie(_)||_,svg:xo(b,"",null).svg||Ae.section,cat:ko(b),enabled:v.enabled!==!1,static:As(e,_)})});break}}return a}function ni(e,t,s){if(!s.length)return"";const n=T("dock:current-type")||"",a=T("dock:current-uid"),i=!!T("dock:component-exit-state")?.open;if(a){const r=Pt(a,t),d=s.find(v=>v.ids.some(g=>r.includes(g)));if(d&&(i||d.type===n))return d.uid}return s.find(r=>r.type===n)?.uid||""}function si(e,t,s,n){const a=t.find(m=>m.uid===s),i=T("dock:component-src"),r=T("dock:type-stack")||[];if(!a||!i||!r.length)return null;const d=r.map(m=>m.type).filter(m=>!ie.get(m));if(d.length)return ai(e,d),null;const v=[],g=new Set,_=new Set;let c=m=>v.push(...m),b=null,k=0;for(let m=0;m<r.length;m+=1){const f=m+1<r.length?r[m+1].src:i,C=D=>({...D,id:`ctx${m}:${D.id}`,path:`ctx${m}/${D.path}`,ctxLevel:m,children:D.children.map(C)}),W=nt(ie.get(r[m].type)).map(C),F=[],P=(D,K)=>{for(const N of D){if(N.kind==="component"&&N.src===f)return F.push(...K,N),N;const O=P(N.children,[...K,N]);if(O)return O}return null};if(b=f?P(W,[]):null,!b)return null;const A=new Set(F.map(D=>D.id)),H=(D,K)=>{for(const N of D)N.children.length&&(A.has(N.id)?q.has(N.path):Vo(N,K))&&g.add(N.id),H(N.children,K+1)};H(W,k),c(W),_.add(b.id),k+=F.length,c=(D=>K=>{D.children=K})(b)}for(const m of qo(n))g.add(m);return q.has(b.path)&&g.add(b.id),b.children=n,{tree:v,folds:g,hostId:b.id,hostIds:_,levels:r.length,rootId:v.find(m=>!m.kind)?.id||"",label:a.label,svg:a.svg,cat:a.cat}}function ai(e,t){for(const s of t)!ge.includes(s)&&!xe.has(s)&&ge.push(s);xt=!0,Dt(e)}function ri(e,t,s){const n=T("dock:component-exit-state");if(n?.open)return Ie(n.name)||n.name||"";if(s)return t.find(i=>i.uid===s)?.label||"";const a=T("dock:current-type")||"";return ot(e,a)?.display||Ie(a)||""}function at(e,t,s,n,a){const i=s.find(d=>d.uid===n);if(!i||n===a)return;q.clear(),R=null,we=!1,oe(),Ne(),J=n,Oo=z(),V=ie.get(i.type)||"",V&&(R=We(nt(V))||null),Fo=(T("dock:current-type")||"")===i.type,e.clearTimeout(Se),Se=e.setTimeout(()=>{J="",Te=!1,I(e)},4e3),I(e);const r=()=>On(i.uid,t,e,{clampToSection:!0});Hn(i.uid,t,e,r),le({source:ee,type:Q.SVE_ACTIVATE,ids:i.ids},e),e.setTimeout(()=>I(e),0)}function jo(e,t){if(!t)return!1;for(const s of e||[])if(s.id===t||jo(s.children,t))return!0;return!1}function We(e){for(const t of e||[]){if(!t.kind)return t.id;const s=We(t.children);if(s)return s}return""}function Vo(e,t){return q.has(e.path)?t===0:t>0}function qo(e){const t=new Set,s=(n,a)=>{for(const i of n)i.children.length&&Vo(i,a)&&t.add(i.id),s(i.children,a+1)};return s(e,0),t}function I(e){const t=e.document,n=Y(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;Qr(t),Un(e);const a=z();V&&V===a&&(V=""),T("dock:chrome-kind")&&(V="");const i=V||a,r=nt(i);De=r;const d=T("dock:current-type")||"",v=Mo(d),g=oi(e,t),c=!!(T("dock:component-exit-state")||{}).open,b=st(e,t);d&&a&&!V&&ie.set(d,a),ei(e,b);const k=ni(e,t,b),m=String(T("dock:chrome-kind")||"");if(Cn(e),g&&!b.length&&!m){De=[],o.rows=[],o.sections=[],o.frame=io(e,[],!1,!1,"",!0),o.frameEmptyText=u(e,"html_tree_frame_no_sections"),o.pageBuilder=!0,o.emptyText=u(e,"html_tree_empty"),o.canEdit=!T("dock:is-locked"),o.look=Xt(e),o.onRefresh=()=>I(e),o.onSection=null,ro(e,""),ao(e),je(n,eo),uo(e,[]);return}o.pageBuilder=g;const f=`${d}|${k}`;let C=!1;f!==kt&&(kt=f,q.clear(),ct!==null&&i!==ct?C=!0:Te=i),(C||Te!==!1&&i!==Te)&&(Te=!1,q.clear(),R=We(r)||null),ct=i,J&&(J===k||!b.length)&&(Fo||i!==Oo)&&(e.clearTimeout(Se),J="",Te=!1,jo(r,R)||(q.clear(),R=We(r)||null));const W=b.some(h=>h.uid===J)?J:"",F=we?"":W||k,P=c?si(e,b,F,r):null,A=!!(W||k),H=A||c?"":String(T("dock:chrome-kind")||"");H!=="main"&&(ut="");const D=H==="main"?lo(r,"main"):null;D&&wt(D.path);const K=H==="header"||H==="footer"?Ft(r,h=>i.slice(h.from,h.openTo).includes(`data-sve-chrome="${H}"`))||lo(r,H):null;K&&wt(K.path);const O=(H==="main"?!!D:H==="header"||H==="footer"?!!K:!0)?P?Yt(P.tree,o.query?new Set:P.folds):Yt(r,o.query?new Set:qo(r)):[];!i.trim()&&!Bo(t)?o.emptyText=u(e,"html_tree_need_dock"):o.emptyText=u(e,"html_tree_empty"),o.slotText=u(e,"antlers_drop_here"),o.dataTitle=u(e,"data_vars_title"),o.pageTitle=u(e,"component_props_page"),o.renameTitle=u(e,"html_tree_rename"),o.tagTitle=u(e,"tw_tag"),o.hideTitle=u(e,"html_tree_hide"),o.showTitle=u(e,"html_tree_show"),o.duplicateTitle=u(e,"html_tree_duplicate"),o.deleteTitle=u(e,"html_tree_delete"),o.videoHoldTitle=u(e,"html_tree_video_hold"),o.videoPlayTitle=u(e,"html_tree_video_play"),o.lockedTitle=u(e,"html_tree_locked"),o.searchEmpty=u(e,"html_tree_search_empty"),o.canEdit=!T("dock:is-locked"),o.look=Xt(e),o.onQuery=()=>I(e),ao(e),o.inComponent=c,o.onContextRow=h=>{if(!P||h===P.hostId)return;const S=O.find(E=>E.id===h)?.ctxLevel??P.levels-1;T("dock:exit-component",P.levels-S),I(e)},o.onSelect=h=>{const S=O.find(E=>E.id===h);S&&To(e,S.path)||Je(e,h,O)},o.onTwist=h=>{const S=O.find(E=>E.id===h)?.path;S&&(q.has(S)?q.delete(S):q.add(S),I(e))},o.onTagChange=(h,S)=>{const E=o.rows.find(te=>te.id===S);E&&!Ot()&&Xn(e,h.currentTarget,E)},o.onRename=h=>ci(e,h),o.onRenameCommit=()=>ho(e,!0),o.onRenameCancel=()=>ho(e,!1),o.onHide=h=>pi(e,h),o.onVideoHold=h=>hi(e,h),o.onDuplicate=h=>fi(e,h),o.onDelete=h=>vi(e,h),o.onPointerDown=(h,S)=>Ti(e,h,S),o.onSectionPointerDown=(h,S)=>wi(e,h,S),o.onContext=(h,S)=>bi(e,h,S),o.onInspectCommit=h=>Ii(e,h),o.onPropValue=(h,S,E)=>mo(e,h,S,E),o.onPropPage=(h,S)=>Ir(e,h,E=>mo(e,S,E,!1)),o.onLoopKind=h=>Ai(e,h),o.onAddBranch=h=>Mi(e,h),o.onLoopSortField=h=>{const S=Ze(),E=String(h||"").trim();if(!S)return;const te=ue?.id===S.id?ue.dir:"",ae=S.sortDir||te||"asc";ue=null,me(e,(be,Qo)=>Ee(be,Qo,{sortField:E,sortDir:ae}))},o.onLoopSortDir=h=>{const S=Ze(),E=String(h||"");if(S){if((E==="asc"||E==="desc")&&!S.sortField){ue={id:S.id,dir:E},Ct(e,S);return}ue=null,me(e,(te,ae)=>Ee(te,ae,{sortDir:E,sortField:E==="asc"||E==="desc"?ae.sortField:""}))}},o.onLoopLimit=h=>me(e,(S,E)=>Ee(S,E,{limit:String(h||"").replace(/\D/g,"")})),o.onPropHost=h=>h?G.mount(h):G.unmount(),o.onInspectData=(h,S)=>{T("dock:data-menu",{anchor:h,at:O.find(E=>E.id===R)?.from,onPick:E=>S(String(E?.var||"").trim())})};const jt=O.find(h=>!h.kind)?.id,Vt=c?"":ri(e,b,F),de=F&&!c?b.find(h=>h.uid===F):null,Zo=yo(e,String(T("dock:current-type")||""));let Jo=0;const ne=H==="header"||H==="footer"?H:"",ke=K?K.id:"",ce=D&&O.find(h=>h.id===D.id)||null,se=ce||ke&&O.find(h=>h.id===ke)||null,qt=se?ii(O,se):-1;se&&!O.slice(O.indexOf(se),qt).some(h=>h.id===R)&&(R=se.id),o.rows=O.map(h=>{const S=xo(h.tag,h.kind,h.antlers),E=h.tag==="video"&&!h.kind?Jo++:-1,te=!!P&&h.id===P.rootId,ae=h.id===jt&&Vt?Vt:te?P.label:h.klass,be=h.id===jt;return{...h,base:ae,name:ne&&h.id===ke?u(e,`html_tree_frame_${ne}`):h===ce?u(e,"html_tree_frame_main"):be&&de?ae:Mr(ae,h.path,v),current:h.id===R,letter:te?"":S.letter||"",svg:ne&&h.id===ke?Ae[ne]:h===ce?Ae.main:be&&de?de.svg:te?P.svg:S.svg||"",frame:ne&&h.id===ke?ne:h===ce?"main":"",cat:ne&&h.id===ke?ne:h===ce?"main":te?P.cat:ko(h.tag,h.kind,h.antlers),context:P?P.hostIds.has(h.id)?"host":h.id.startsWith("ctx")?"dim":"":"",sectionRoot:be&&de?de.uid:"",fieldsIcon:!!(be&&de&&!de.static),videoNth:E,videoHeld:E>=0&&Zo.has(E)}}),$n(e);const rt=[];for(const h of o.rows)rt.length=h.depth,h.guides=rt.slice(),rt[h.depth]=h.cat;if(se){const h=O.indexOf(se),S=se.depth;o.rows=o.rows.slice(h,qt).map(E=>({...E,depth:E.depth-S,guides:E.guides.slice(S)})),ce&&ut!==f&&(ut=f,e.setTimeout(()=>Je(e,ce.id,O),0))}o.sections=A||H?b.map(h=>{const S=!!F&&h.uid===F;return{...h,current:S,ready:S&&(!W||!!V),row:{id:`sec:${h.uid}`,section:h.uid,tag:h.tag,name:h.label,kind:"",svg:h.svg,cat:h.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:S,hidden:!h.enabled}}}):[],o.frame=io(e,b,A,c,H),o.frameEmptyText=u(e,"html_tree_frame_no_sections"),ro(e,H),o.onSection=h=>{ve||(St(e),at(e,t,b,h,F))},o.onRefresh=()=>I(e),Ct(e,o.rows.find(h=>h.id===R)),je(n,eo),uo(e,r)}function ro(e,t){o.frameOpenTitle=u(e,"html_tree_frame_open"),o.frameMainTitle=u(e,"html_tree_frame_main_open"),o.frameTemplateTitle=u(e,"html_tree_frame_template_open"),o.frameFieldsTitle=u(e,"html_tree_frame_fields"),o.onFrame=s=>{t===s?li(e,s):co(e,s)},o.onFrameEnter=s=>co(e,s),o.onFrameFields=s=>jn(e,Ln(e,s),u(e,`html_tree_frame_${s}`)),o.onFrameTwist=()=>{o.mainShut=!o.mainShut}}function io(e,t,s,n,a,i=!1){if(!s&&!a&&!i)return null;const r=g=>({id:`frame:${g}`,frame:g,synthetic:!0,tag:g,name:u(e,`html_tree_frame_${g}`),kind:"",svg:Ae[g]||"",cat:g,letter:"",depth:0,hasChildren:g==="main"&&(t.length>0||a==="template"),shut:g!=="main",current:!1,hidden:!1}),d={kind:a,header:r("header"),main:r("main"),footer:r("footer"),template:null},v=a&&a!=="template"?String(T("dock:collection-view")||""):"";return v&&(d.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:ot(e,v)?.display||Ie(v.replace(/^view:/,"")),kind:"",svg:Ae.section,cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),d}function lo(e,t){return Ft(e,s=>s.tag===t)}function Ft(e,t){for(const s of e||[]){if(!s.kind&&t(s))return s;const n=Ft(s.children,t);if(n)return n}return null}function ii(e,t){let s=e.indexOf(t)+1;for(;s<e.length&&e[s].depth>t.depth;)s+=1;return s}function li(e,t){const s=Qe(e);(t==="main"||t==="template"?s?.querySelector("main"):s?.querySelector(`[data-sve-chrome="${t}"]`))?.scrollIntoView({behavior:"smooth",block:"start"})}function St(e){const t=String(T("dock:chrome-open",e.document)||"");return t!=="header"&&t!=="footer"?!1:(Pn(e),le({source:ee,type:Q.SVE_FORCE_EXIT_CHROME},e),!0)}function di(e){e.clearTimeout(Se),J="",V="",q.clear(),R=null,we=!1,oe(),Ne()}function co(e,t){if(e.document,String(T("dock:chrome-kind")||"")===t)return;if(di(e),t==="main"){St(e),T("dock:open-file",Vn);return}if(t==="template"){const i=String(T("dock:collection-view")||"");i&&(St(e),T("dock:open-file",i));return}if(t!=="header"&&t!=="footer")return;const s=Qe(e)?.querySelector(`[data-sve-chrome="${t}"]`);s?(s.scrollIntoView({block:"nearest"}),s.dispatchEvent(new s.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:ee,type:Q.OPEN_CHROME,kind:t},e.location.origin);const n=Date.now(),a=async()=>{if(String(T("dock:chrome-kind")||"")!==t){Date.now()-n<3e4&&e.setTimeout(a,250);return}await(T("dock:load-settled")||null),Wo(e)};e.setTimeout(a,250)}function uo(e,t){Y(e.document)&&Ko(e,t)}function Ko(e,t){const s=t[0],n=!!T("dock:component-src"),a=n?"":T("dock:current-uid")||"";le({source:ee,type:Q.SVE_HTML_PICK,on:!0,uid:a,uids:a?Pt(a,e.document):[],all:n,tag:s?.tag||"",klass:s?.klass||"",nodes:ds(t)},e)}function wt(e){if(!e)return;const t=(s,n)=>{for(const a of s||[]){if(a.path===e)return!0;if(t(a.children,n+1))return n===0?q.delete(a.path):q.add(a.path),!0}return!1};t(De,0)}function ci(e,t){if(ve)return;const s=o.rows.find(n=>n.id===t);!s||s.kind||(R=t,o.rows.forEach(n=>{n.current=n.id===t}),o.editingId=t,o.draft=s.name,e.setTimeout(()=>{const n=Y(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function ho(e,t){const s=o.editingId;if(!s)return;const n=o.rows.find(a=>a.id===s);o.editingId=null,t&&n&&(n.sectionRoot?ui(e,n.sectionRoot,o.draft):Rr(T("dock:current-type")||"",n.path,o.draft,n.base||n.klass)),o.draft="",I(e)}function ui(e,t,s){const n=Be(e)||"page_sections",a=String(s||"").replace(/\s+/g," ").trim();for(const i of et(e.document)||[]){const r=tt(i.values),d=r&&typeof r=="object"?r[n]:null;if(!Array.isArray(d))continue;const v=d.findIndex(b=>b&&typeof b=="object"&&[b._visual_id,b.id,b._id].includes(t));if(v===-1)continue;const g=No(e,d[v])||d[v].type,_=ot(e,g)?.display||Ie(g)||g,c=JSON.parse(JSON.stringify(d));return c[v]={...c[v]},!a||a===_?delete c[v]._sve_label:c[v]._sve_label=a,i.setFieldValue(n,c),!0}return!1}function hi(e,t){const s=o.rows.find(d=>d.id===t);if(!s||!(s.videoNth>=0))return;const n=String(T("dock:current-type")||""),a=yo(e,n),i=!a.has(s.videoNth);i?a.add(s.videoNth):a.delete(s.videoNth);const r=String(T("dock:current-uid")||"");En(e,n,a),le({source:ee,type:Q.SVE_VIDEO_HOLD,uid:r,uids:r?Pt(r,e.document):[],nth:s.videoNth,on:i},e),I(e)}function pi(e,t){Bt(e,t,rs)}function fi(e,t){const s=o.rows.find(n=>n.id===t)?.sectionRoot;if(s){e.postMessage({source:ee,type:Q.DUPLICATE_ROW,uid:s},e.location.origin);return}Bt(e,t,is)}function Go(e,t){Rn(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const s=e.document;Fn({uid:t},s,e)})}function mi(e,t,s){J===s&&(e.clearTimeout(Se),J="",V=""),R=null,we=!1,kt="";const n=st(e,t),a=n.find(i=>i.uid!==s)||n[0];a?at(e,t,n,a.uid,""):(V="",o.rows=[],o.sections=[],o.frame=null,o.pageBuilder=!0,I(e)),e.setTimeout(()=>{Y(e.document)&&I(e)},0)}bo("row:removed",({uid:e,parentPath:t,doc:s,win:n})=>{t!==Be(n)||!Y(n.document)||mi(n,s,e)});function vi(e,t){const s=o.sections?.find(a=>a.row?.id===t),n=s?s.row?.section||s.uid:o.rows.find(a=>a.id===t)?.sectionRoot;if(n){Go(e,n);return}Bt(e,t,ls)}function Bt(e,t,s){if(T("dock:is-locked"))return;const n=z(),a=o.rows.find(r=>r.id===t);if(!a)return;const i=s(n,a);i!==n&&Ce(i)}function oe(){fe?.dismiss(),fe=null}const gi='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',yi='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>';function zo(e,t){const s=o.sections?.find(v=>v.uid===t),n=s?.type||"";if(!n||!$o(e))return[];const a=s.label||n,i=Ms(e,n),r=()=>e.Statamic?.$toast?.error(u(e,"section_update_failed")),d=[{label:u(e,"static_section_insertable"),icon:i?yi:gi,onPick:()=>{oe(),Zt(e,{handle:n,hidden:!i}).then(()=>{e.Statamic?.$toast?.success(u(e,i?"section_shown_to_editors":"section_hidden_from_editors",{name:a})),vt(e)}).catch(r)}}];return s.static&&d.push({label:u(e,"section_add_fields"),onPick:()=>{oe(),Zt(e,{handle:n,fields:!0}).then(()=>{e.Statamic?.$toast?.success(u(e,"section_fields_added",{name:a})),vt(e),I(e),_o(e,n)}).catch(r)}}),d}function ki(e,t,s){const n=s.row?.section||s.uid;n&&(fe=ye(e.document,It,{items:[...zo(e,n),{label:u(e,"html_tree_remove_section"),danger:!0,onPick:()=>{oe(),Go(e,n)}}],x:t.clientX,y:t.clientY,onClose:()=>{fe=null}}))}function bi(e,t,s){oe();const n=o.sections?.find(d=>d.row?.id===s);if(n){ki(e,t,n);return}const a=o.rows.find(d=>d.id===s);if(!a)return;Je(e,s,o.rows);const i={x:t.clientX,y:t.clientY},r=d=>{d.length&&(fe?.dismiss(),fe=ye(e.document,It,{items:d,x:i.x,y:i.y,onClose:()=>{fe=null}}))};if(a.kind==="component"){_i(e,a,r);return}o.canEdit&&r([...a.sectionRoot?zo(e,a.sectionRoot):[],{label:u(e,"component_make"),onPick:()=>{oe(),Gr(e,a,{onDone:()=>I(e),onError:d=>{e.alert(d?.status===409?u(e,"component_exists"):u(e,"component_failed"))}})}}])}const po=(e,t)=>{oe(),T("dock:open-template",t)};function _i(e,t,s){if(!Zn(t.src)){s([{label:u(e,"component_open_named",{name:t.name||t.src}),onPick:()=>po(e,`view:partials/${t.src}`)}]);return}s([{label:u(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const a=Array.isArray(n.items)?n.items:[];s(a.length?a.map(i=>({label:u(e,"component_open_named",{name:i.label}),onPick:()=>po(e,i.type)})):[{label:u(e,"component_none"),onPick:null}])}).catch(()=>s([{label:u(e,"component_none"),onPick:null}]))}function Ti(e,t,s){if(t.button!==0||T("dock:is-locked")||o.editingId||t.target?.closest?.("button, input"))return;Ne(),pe=s,Pe={x:t.clientX,y:t.clientY},ze=t.currentTarget,Ue=t.pointerId;const n=i=>xi(e,i),a=i=>Si(e,i);_t=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),_t=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function xi(e,t){if(!pe||!Pe)return;const s=t.clientX-Pe.x,n=t.clientY-Pe.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{ze?.setPointerCapture?.(Ue)}catch{}}t.preventDefault();const a=e.document.elementFromPoint(t.clientX,t.clientY),i=a?.closest?.("[data-sve-ht-slot]");if(i){const c=i.getAttribute("data-sve-ht-id");if(c&&c!==pe){o.dropId=c,o.dropPlace="inside";return}}const r=a?.closest?.("[data-sve-ht-row]"),d=r?.getAttribute("data-sve-ht-id");if(!d||d===pe){o.dropId=null,o.dropPlace=null;return}const v=o.rows.find(c=>c.id===d),g=o.rows.find(c=>c.id===pe);if(!v||v.context||g&&v.path.startsWith(`${g.path}/`)){o.dropId=null,o.dropPlace=null;return}const _=r.getBoundingClientRect();o.dropId=d,o.dropPlace=ss(t.clientY-_.top,_.height,!So(v.tag)&&v.kind!=="component")}function Si(e,t){const s=pe,n=o.dropId,a=o.dropPlace||"after",i=o.dragging;if(Ne(),i&&(ve=!0,e.setTimeout(()=>{ve=!1},0)),!i||T("dock:is-locked")||!s||!n||s===n)return;t?.preventDefault?.();const r=z(),d=as(r,De,s,n,a);d!==r&&Ce(d)}function Ne(){try{ze?.releasePointerCapture?.(Ue)}catch{}_t?.(),pe=null,Pe=null,ze=null,Ue=null,o.dragging=!1,o.dropId=null,o.dropPlace=null}function wi(e,t,s){if(t.button!==0||!s||o.editingId||t.target?.closest?.("button, input"))return;Uo(),Oe=s,He={x:t.clientX,y:t.clientY},Xe=t.currentTarget,Ye=t.pointerId;const n=i=>Ci(e,i),a=i=>$i(e,i);Tt=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),Tt=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function Ci(e,t){if(!Oe||!He)return;const s=t.clientX-He.x,n=t.clientY-He.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{Xe?.setPointerCapture?.(Ye)}catch{}}t.preventDefault();const i=e.document.elementFromPoint(t.clientX,t.clientY)?.closest?.("[data-sve-ht-sec-uid]"),r=i?.getAttribute("data-sve-ht-sec-uid")||"";if(!r||r===Oe){o.sectionDrop=null;return}const d=i.getBoundingClientRect();o.sectionDrop={uid:r,place:t.clientY-d.top<d.height/2?"before":"after"}}function $i(e,t){const s=Oe,n=o.sectionDrop,a=o.dragging;Uo(),a&&(ve=!0,e.setTimeout(()=>{ve=!1},0)),!(!a||!s||!n?.uid||n.uid===s)&&(t?.preventDefault?.(),Li(e,s,n.uid,n.place))}function Uo(){try{Xe?.releasePointerCapture?.(Ye)}catch{}Tt?.(),Oe=null,He=null,Xe=null,Ye=null,o.dragging=!1,o.sectionDrop=null}function Li(e,t,s,n){const a=Be(e)||"page_sections";for(const i of et(e.document)||[]){const r=tt(i.values),d=r&&typeof r=="object"?r[a]:null;if(!Array.isArray(d))continue;const v=b=>d.findIndex(k=>k&&typeof k=="object"&&[k._visual_id,k.id,k._id].includes(b)),g=v(t),_=v(s);if(g===-1||_===-1||g===_)return!1;let c=n==="before"?_:_+1;return g<c&&(c-=1),c===g?!1:(e.postMessage({source:ee,type:Q.MOVE,uid:t,toIndex:c},e.location.origin),e.setTimeout(()=>I(e),60),!0)}return!1}function Xo(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function Ct(e,t){if(t?.kind==="component"){Ei(e,t);return}if(X.callOpen&&(X.callOpen=!1,X.callStore=null,G.forget(),At(e)),t?.kind!=="antlers"){o.inspect=null;return}const s=t.id;if(t.tag==="else"){o.inspect={key:s,title:u(e,"antlers_condition"),mode:"note",note:u(e,"antlers_else_note")};return}if(t.antlers==="loop"){const n=t.loopKind==="collection",a=ue?.id===t.id?ue.dir:"",i=t.sortDir||a;o.inspect={key:s,title:u(e,"antlers_loop"),mode:"loop",loopKind:n?"collection":"field",kinds:[{id:"field",label:u(e,"antlers_loop_field")},{id:"collection",label:u(e,"antlers_loop_collection")}],collections:Xo(e),value:t.expr||"",placeholder:u(e,n?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:u(e,"antlers_sort"),dir:i,needsField:i==="asc"||i==="desc",field:t.sortField||"",pickable:!n,placeholder:u(e,n?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:u(e,"antlers_sort_none")},{id:"asc",label:u(e,"antlers_sort_asc")},{id:"desc",label:u(e,"antlers_sort_desc")},{id:"random",label:u(e,"antlers_sort_random")}]},limit:{title:u(e,"antlers_limit"),value:t.limit||"",placeholder:u(e,"antlers_limit_placeholder")},branches:[]};return}o.inspect={key:s,title:u(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:u(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:u(e,"antlers_add_elseif")},{id:"else",label:u(e,"antlers_add_else")}]}}function Ei(e,t){if(!Jn(e)){o.inspect=null;return}if(!t.src)return;const s=t.id;if(o.inspect={key:s,title:u(e,"component_props_values"),mode:"note",note:u(e,"code_dock_loading")},Qn()){const n={},a={},i=new Map;for(const[r,d]of es(z().slice(t.from,t.to))){const v=ts(r);v&&(r!==v||!i.has(v))&&i.set(v,d)}for(const[r,d]of i)d.bound?a[r]=d.value:n[r]=d.value;so!==s&&(so=s,Re.clear());for(const r of Re)r in a||(a[r]="");o.inspect=null,X.callOpen=!0,X.title=X.title||u(e,"component_props"),X.callTitle=t.klass||t.name||t.src,X.callStore=G.ui,G.ui.canBind=!0,G.ui.dataTitle=u(e,"data_vars_title"),G.ui.exprPlaceholder=u(e,"component_props_expr"),G.ui.onToggleBind=(r,d)=>Hi(e,r,d),G.ui.onExpr=(r,d)=>fo(e,r,d),G.ui.onPickData=(r,d)=>T("dock:data-menu",{anchor:d,at:t.from,onPick:v=>fo(e,r,String(v?.var||"").trim())}),G.load(e,{key:`${t.src}::${s}`,src:t.src,params:n,bindings:a,readOnly:T("dock:is-locked")===!0}),G.watch(e,{src:t.src,write:r=>Pi(e,r,a)}),At(e);return}os(e,t.src).then(n=>{if(o.inspect?.key===s){if(!n.length){o.inspect={key:s,title:u(e,"component_props_values"),mode:"note",note:u(e,"component_props_values_none")};return}o.inspect={key:s,title:u(e,"component_props_values"),mode:"props",inheritLabel:u(e,"component_props_inherit"),rows:ns(n,z().slice(t.from,t.to))}}})}function Pi(e,t,s={}){const n=o.rows.find(r=>r.id===R);if(n?.kind!=="component"||T("dock:is-locked"))return;let a=z(),i=n.to;for(const[r,d]of Object.entries(t||{})){if(r in s)continue;const v=a.length,g=Mt(a,{from:n.from,to:i},r,d);g!==a&&(i+=g.length-v,a=g)}a!==z()&&(Ce(a,{save:!0}),I(e))}function Hi(e,t,s){s?Re.add(t):Re.delete(t),Yo(e,t,"",s),I(e)}function fo(e,t,s){Re.add(t),Yo(e,t,s,!0),I(e)}function Yo(e,t,s,n){const a=o.rows.find(d=>d.id===R);if(a?.kind!=="component"||T("dock:is-locked"))return;const i=z(),r=Mt(i,a,t,s,{bound:n});r!==i&&Ce(r,{save:!0})}function Ze(){const e=o.rows.find(t=>t.id===R);return e?.kind==="antlers"&&!T("dock:is-locked")?e:null}function me(e,t){const s=Ze();if(!s)return;const n=z(),a=t(n,s);a!==n&&(Ce(a),I(e))}function mo(e,t,s,n){const a=o.rows.find(d=>d.id===R);if(a?.kind!=="component"||T("dock:is-locked"))return;const i=z(),r=Mt(i,a,t,s,{bound:n});r!==i&&(Ce(r,{save:!0}),I(e))}function Ii(e,t){me(e,(s,n)=>n.antlers==="loop"?yt(s,n,n.loopKind==="collection"?"collection":"field",t):zr(s,n,t))}function Ai(e,t){const s=Ze();if(!s||s.antlers!=="loop")return;const n=s.loopKind==="collection"?"collection":"field";if(t!==n){if(t==="collection"){const a=Xo(e)[0]?.handle;if(!a)return;me(e,(i,r)=>yt(i,r,"collection",a));return}me(e,(a,i)=>yt(a,i,"field",i.handle||"items"))}}function Mi(e,t){me(e,(s,n)=>Zr(s,n,t))}function Ri(e,t){if(!e||!t||t.kind==="component"||So(t.tag))return null;const s=Wn(e,t);if(s<t.openTo)return null;const n=e.lastIndexOf(`
`,s-1)+1;return e.slice(n,s).trim()===""&&n>t.openTo?n-1:s}function Je(e,t,s){if(ve)return;const n=(s||o.rows).find(a=>a.id===t);n&&(R=t,o.rows.forEach(a=>{a.current=a.id===t}),Ct(e,n),!Ot()&&(T("dock:reveal-html",{from:n.from,to:n.to,caret:Ri(z(),n)}),T("dock:tw-follow"),le({source:ee,type:Q.SVE_HTML_PICK_FOCUS,path:n.path},e)))}function Di(e,t){if(!t)return"";const s=[],n=(a,i)=>{for(const r of a||[]){const d=i||r.path===e;r.kind==="component"&&r.src===t&&s.push({path:r.path,inside:d}),n(r.children,d)}};return n(De,!1),(s.find(a=>a.inside)||s[0])?.path||""}function Oi(e,t){if(!t||!Y(e.document))return;we=!1,wt(t),I(e);const s=o.rows.find(n=>n.path===t);s&&(Je(e,s.id,o.rows),e.setTimeout(()=>{Y(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function $t(e){if(Ke)return;const t=()=>{o.editingId||o.dragging||(e.clearTimeout(Ge),Ge=e.setTimeout(()=>{Y(e.document)&&I(e)},80))},s=()=>{if(t(),T("dock:on-empty-page")===!0){const n=st(e,e.document);n[0]&&at(e,e.document,n,n[0].uid,"")}};Ke=bo("dock:html-changed",t),e.document.addEventListener("sve-page-structure",s),bt=()=>{e.document.removeEventListener("sve-page-structure",s)}}function Fi(e){Ke?.(),Ke=null,bt?.(),bt=null,e?.clearTimeout?.(Ge),Ge=0}function Nt(e){const t=Y(e.document);if(le({source:ee,type:Q.SVE_HTML_PICK,on:!1},e),Fi(e),G.forget(),X.callOpen=!1,X.callStore=null,At(e),Ne(),oe(),zn(e),R=null,o.inspect=null,o.editingId=null,o.draft="",o.sections=[],o.pageBuilder=!1,J="",e?.clearTimeout?.(Se),!t){mt(e);return}t.remove(),Et.headerTab==="html_tree"&&Dn(e,null),bn(e),vo(e),go(e),mt(e)}function Ui(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=Ve,je(t,Eo,{title:u(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>Nt(e)))}function Xi(e){$t(e),I(e)}function Wo(e){const t=e.document;if(!Tn(e,"html_tree"))return;if(Y(t)){$t(e),I(e);return}if(!Bo(t))return;we=!0,q.clear(),xn(e,[Ve]);const s=t.createElement("div");s.id=Ve,s.style.cssText=Sn,je(s,Eo,{title:u(e,"html_tree")}),s.querySelector("[data-sve-close]")?.addEventListener("click",()=>Nt(e)),wn(e,s),vo(e),go(e),mt(e),$t(e),I(e)}function Yi(e){if(Y(e.document)){Nt(e);return}Wo(e)}Ht("html-tree:open-section",e=>{const t=window,s=t.document,n=st(t,s),a=n.find(i=>i.uid===e||i.ids.includes(e));return a?(at(t,s,n,a.uid,""),{uid:a.uid,ids:a.ids}):null});Ht("html-tree:from-preview",({path:e,src:t}={})=>{To(window,e)||Oi(window,Di(e,t)||e)});Ht("html-tree:arm-pick",e=>{const t=window;return e?(Ko(t,nt(z())),!0):(Y(t.document)||le({source:ee,type:Q.SVE_HTML_PICK,on:!1},t),!0)});function Wi(){ie.clear(),xe.clear(),ge.length=0}export{Jr as HTML_TREE_STYLE_ID,zi as armHtmlTreePrefetch,Wi as clearHtmlTreeTemplates,oe as closeHtmlTreeMenu,Nt as closeHtmlTreePanel,Qr as ensureHtmlTreeStyles,Ui as fillHtmlTreePane,R as htmlTreeActiveId,Y as htmlTreePanel,Ge as htmlTreeTimer,Ke as htmlTreeUnhook,Wo as openHtmlTreePanel,I as renderHtmlTree,Xi as showHtmlTreePane,Fi as stopWatchHtmlTreeDock,Yi as toggleHtmlTreePanel,$t as watchHtmlTreeDock};
