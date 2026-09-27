const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-AWaJHJyk.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{_ as Ne,I as q,J as an,K as Ee,o as f,k as v,l as L,G as S,m as P,F as R,L as pe,n as V,b2 as sn,x as $,O as vt,b3 as rn,a as T,t as h,A as ke,C as ln,z as Et,b4 as Xt,b5 as Yt,b6 as dn,b7 as cn,b8 as un,b9 as hn,ba as ot,D as ce,at as pn,bb as o,u as l,w as fn,v as mn,M as le,bc as vn,B as gn,bd as X,be as yn,bf as kn,H as He,j as Te,bg as bn,bh as _n,bi as Wt,N as Tn,Q as xn,s as Ht,au as gt,aq as Sn,aO as bo,aP as _o,i as wn,al as Zt,a1 as qe,X as Cn,aN as $n,ar as Ln,as as Pn,bj as En,bk as Jt,bl as To,a0 as xo,bm as Hn,E as So,a9 as je,T as nt,U as at,ay as st,az as Re,S as It,bn as In,bo as An,bp as Mn,bq as Rn,aR as Dn,aS as On,ax as Fn,br as Bn,a_ as Nn,ak as At,aK as jn,aF as Vn}from"./addon-CJD_Um9s.js";import{M as Q,S as ee}from"./protocol-Brvy2KuB.js";import{canEditFields as Kn,currentSetHandle as qn,openFieldsetOverlay as wo,openGlobalFieldsOverlay as Gn}from"./section-fields-DQH7cAkp.js";import{H as Ge,ac as zn}from"./ai-text-icon-B7vA1keB.js";import{F as Y,G as Un,I as Mt,J as Xn,t as Yn,K as Rt,x as Wn,B as Zn,d as rt,m as Qt,L as Co,s as Jn,M as $o,H as Se,N as Qn,O as Dt,c as ea,Q as Lo,R as Po,S as ta,h as oa,a as na,T as aa,U as sa,V as ra,W as ia,X as la,Y as da,Z as ca,$ as ua,a0 as ha,a1 as pa}from"./tw-classes-BBX9zrPA.js";import{b as fa}from"./html-pick-align-CLq5l-p4.js";import"./FieldsetOverlay-CBjjyARs.js";const ma={class:"sve-dialog__title"},va={for:"sve-new-section-group"},ga={class:"sve-dialog__row"},ya=["disabled"],ka=["value"],ba=["title","aria-label"],_a={key:0,class:"sve-dialog__add-group"},Ta={for:"sve-new-section-group-name"},xa={class:"sve-dialog__row"},Sa=["placeholder","disabled"],wa=["disabled"],Ca=["disabled"],$a={for:"sve-new-section-name"},La=["placeholder"],Pa={key:1,class:"sve-dialog__toggle"},Ea={key:2,class:"sve-dialog__note"},Ha={class:"sve-dialog__actions"},Ia=["disabled"],Aa=["disabled"],Ma={__name:"NewSectionPrompt",props:{heading:{type:String,required:!0},groupLabel:{type:String,required:!0},nameLabel:{type:String,required:!0},placeholder:{type:String,default:""},note:{type:String,default:""},groups:{type:Array,required:!0},toggleLabel:{type:String,default:""},toggleOn:{type:Boolean,default:!0},cancelLabel:{type:String,required:!0},saveLabel:{type:String,required:!0},onOk:{type:Function,required:!0},onClose:{type:Function,required:!0},addGroupLabel:{type:String,default:""},addGroupNameLabel:{type:String,default:""},addGroupPlaceholder:{type:String,default:""},onAddGroup:{type:Function,default:null}},setup(e){const t=e,a=q(""),n=q([...t.groups]),s=q(t.groups[0]?.key??""),i=q(!1),r=q(""),d=q(null),p=q(!1);function y(){i.value=!0,r.value="",Ee(()=>d.value?.focus())}function g(){i.value=!1,r.value="",Ee(()=>x.value?.focus())}async function c(){const E=r.value.trim();if(!E||p.value||!t.onAddGroup){d.value?.focus();return}p.value=!0;const A=await t.onAddGroup(E);if(p.value=!1,!A?.key){d.value?.focus();return}n.value.some(D=>D.key===A.key)||n.value.push(A),s.value=A.key,i.value=!1,r.value="",Ee(()=>x.value?.focus())}function b(E){E.key==="Enter"?(E.preventDefault(),c()):E.key==="Escape"&&(E.stopPropagation(),g())}const k=q(t.toggleOn),x=q(null),_=q(!1);an(()=>Ee(()=>x.value?.focus()));function m(){const E=a.value.trim();if(!E||n.value.length&&!s.value||_.value){x.value?.focus();return}_.value=!0,t.onOk(E,s.value,k.value)}function C(E){E.target===E.currentTarget&&t.onClose()}function B(E){E.key==="Enter"?m():E.key==="Escape"&&t.onClose()}return(E,A)=>(f(),v("div",{class:"sve-dialog-overlay",onClick:C},[L("div",{class:"sve-dialog",onClick:A[5]||(A[5]=S(()=>{},["stop"]))},[L("div",ma,P(e.heading),1),n.value.length?(f(),v(R,{key:0},[L("label",va,P(e.groupLabel),1),L("div",ga,[pe(L("select",{id:"sve-new-section-group","onUpdate:modelValue":A[0]||(A[0]=D=>s.value=D),disabled:i.value,onKeydown:B},[(f(!0),v(R,null,V(n.value,D=>(f(),v("option",{key:D.key,value:D.key},P(D.display),9,ka))),128))],40,ya),[[sn,s.value]]),e.onAddGroup&&!i.value?(f(),v("button",{key:0,type:"button",class:"is-add",title:e.addGroupLabel,"aria-label":e.addGroupLabel,"data-sve-new-group":"",onClick:y},[...A[6]||(A[6]=[L("span",{"aria-hidden":"true"},"+",-1)])],8,ba)):$("",!0)]),i.value?(f(),v("div",_a,[L("label",Ta,P(e.addGroupNameLabel||e.addGroupLabel),1),L("div",xa,[pe(L("input",{id:"sve-new-section-group-name",ref_key:"groupInput",ref:d,"onUpdate:modelValue":A[1]||(A[1]=D=>r.value=D),type:"text",placeholder:e.addGroupPlaceholder,disabled:p.value,"data-sve-new-group-name":"",onKeydown:b},null,40,Sa),[[vt,r.value]]),L("button",{type:"button",class:"is-primary is-small",disabled:p.value,"data-sve-new-group-create":"",onClick:c},P(e.saveLabel),9,wa),L("button",{type:"button",class:"is-cancel is-small",disabled:p.value,onClick:g},P(e.cancelLabel),9,Ca)])])):$("",!0)],64)):$("",!0),L("label",$a,P(e.nameLabel),1),pe(L("input",{id:"sve-new-section-name",ref_key:"input",ref:x,"onUpdate:modelValue":A[2]||(A[2]=D=>a.value=D),type:"text",placeholder:e.placeholder,onKeydown:B},null,40,La),[[vt,a.value]]),e.toggleLabel?(f(),v("label",Pa,[pe(L("input",{"onUpdate:modelValue":A[3]||(A[3]=D=>k.value=D),type:"checkbox",onKeydown:B},null,544),[[rn,k.value]]),L("span",null,P(e.toggleLabel),1)])):$("",!0),e.note?(f(),v("p",Ea,P(e.note),1)):$("",!0),L("div",Ha,[L("button",{type:"button",class:"is-cancel",disabled:_.value,onClick:A[4]||(A[4]=(...D)=>e.onClose&&e.onClose(...D))},P(e.cancelLabel),9,Ia),L("button",{type:"button",class:"is-primary",disabled:_.value,onClick:m},P(e.saveLabel),9,Aa)])])]))}},Eo=Ne(Ma,[["__scopeId","data-v-6501522a"]]),Ot="/!/sve/section-types",eo="static_sections";async function Ra(e){const t=await e.fetch(Ot,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!t.ok)throw new Error(`section-types ${t.status}`);const a=await t.json();if(Array.isArray(a.groups)&&a.groups.length)return a.groups.filter(s=>s&&s.handle&&s.handle!==eo).map(s=>({key:s.handle,display:s.display||s.handle}));const n=new Map;for(const s of a.types||[])s?.group&&s.group!==eo&&!n.has(s.group)&&n.set(s.group,s.group_display||s.group);return[...n].map(([s,i])=>({key:s,display:i}))}async function Da(e,t){const a=await e.fetch(`${Ot}/groups`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Et(e),"X-Requested-With":"XMLHttpRequest",Accept:"application/json"},body:JSON.stringify({display:t})}),n=await a.json().catch(()=>({}));if(!a.ok||!n.group?.handle)throw new Error(n?.error==="bad_name"?"bad_name":`section-types/groups ${a.status}`);return e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale")),{key:n.group.handle,display:n.group.display||n.group.handle}}const De=new Map;function Oa(e){e?.handle&&De.set(e.handle,{static:!!e.static,hidden:!!e.hidden})}function Fa(e,t){return t?De.has(t)?De.get(t).static:e.Statamic?.$config?.get?.("sveSetMeta")?.[t]?.static===!0:!1}function Ba(e,t){if(!t)return!1;if(De.has(t))return De.get(t).hidden;const a=e.Statamic?.$config?.get?.("sveSectionTypes");return Array.isArray(a)&&a.some(n=>n?.handle===t&&n.hidden===!0)}async function Ho(e,t,a){const n=await e.fetch(Ot,{method:t,headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Et(e),Accept:"application/json"},credentials:"same-origin",body:JSON.stringify(a)}),s=await n.json().catch(()=>({}));if(!n.ok){const i=new Error(s.error||`section-types ${n.status}`);throw i.reason=s.error,i}return Oa(s.section),s}function Na(e,{display:t,group:a="",static:n=!1,hidden:s=!1}){return Ho(e,"POST",{display:t,group:a,static:n,hidden:s})}function to(e,{handle:t,hidden:a,fields:n=!1}){const s={handle:t,fields:n};return typeof a=="boolean"&&(s.hidden=a),Ho(e,"PATCH",s)}async function ja(e,t,a=null,n=null){if(!t||typeof Xt!="function"||typeof Yt!="function")return null;const s=await Xt(e,t);if(!s)return null;n&&Array.isArray(s.definitions)&&dn(t,{display:n.display||t,icon:n.icon||null,hide:n.hidden===!0,fields:s.definitions,group_display:n.group_display||n.group||""},n.group||"");const i=cn(),r=un(e,"page",{handle:t},s?.defaults,i),d=hn(r,s?.new||{},s?.defaults);return Yt(e,e.document,a,r,d)?r:null}const oo=700,Va=17;function Ka(e,t){const a=(t||[]).filter(Boolean);if(!a.length)return;let n=0;const s=()=>{n+=1;const i=ot(e),r=i?a.some(d=>i.querySelector(`[data-sid="${CSS.escape(d)}"]`)):!0;r&&ce({source:ee,type:Q.SVE_ACTIVATE,ids:a},e),(r?!i&&n<6:n<Va)&&e.setTimeout(s,oo)};e.setTimeout(s,oo)}function Io(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function qa(e){return new Promise(t=>{let a=!1;const n=i=>{a||(a=!0,s.dismiss(),t(i==="static"||i==="fields"?i:null))},s=ke(e.document,ln,{title:h(e,"section_new_kind"),body:h(e,"section_new_kind_note"),buttons:[{value:"cancel",label:h(e,"cancel"),variant:"ghost"},{value:"static",label:h(e,"section_new_static"),variant:"primary"},{value:"fields",label:h(e,"section_new_with_fields"),variant:"primary"}],onPick:n,onClose:()=>n(null)})})}const Ga=`<section class="[ ] py-800">
    
</section>
`;function za(e){if(T("dock:is-locked")===!0)return e.Statamic?.$toast?.error(h(e,"code_dock_locked")),!1;const a=`${String(T("dock:html")||"").replace(/\s+$/,"")}

${Ga}`;return T("dock:set-html",a)!==!0?(e.Statamic?.$toast?.error(h(e,"section_new_failed")),!1):(T("dock:save-now"),e.Statamic?.$toast?.success(h(e,"section_new_template_done")),!0)}async function Ao(e,t,a,{afterUid:n,onDone:s,onError:i}){try{const r=await Na(e,a);t.dismiss(),e.Statamic?.$toast?.success(h(e,"section_created",{name:r.section?.display||a.display})),yt(e);const d=r.section?.handle?{...r.section,group_display:(r.section_types||[]).find(y=>y?.handle===r.section.handle)?.group_display||""}:null,p=await ja(e,r.section?.handle,n,d);!p&&r.section?.handle&&T("dock:open-template",r.section.handle),s?.({...r,uid:p?._visual_id||""})}catch(r){t.dismiss(),e.Statamic?.$toast?.error(h(e,r.reason==="bad_name"?"section_new_bad_name":"section_new_failed")),i?.(r)}}function yt(e){e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"))}function Ua(e,{afterUid:t=null,onDone:a,onError:n,onClose:s}={}){const i=ke(e.document,Eo,{heading:h(e,"static_section_new"),groupLabel:"",nameLabel:h(e,"section_new_name"),placeholder:h(e,"section_new_placeholder"),note:h(e,"static_section_note"),groups:[],toggleLabel:h(e,"static_section_insertable"),cancelLabel:h(e,"cancel"),saveLabel:h(e,"section_new_create"),onClose:s,onOk:(r,d,p)=>{Ao(e,i,{display:r,static:!0,hidden:!p},{afterUid:t,onDone:a,onError:n})}})}function Xa(e,{afterUid:t=null,onDone:a,onError:n,onClose:s}={}){(async()=>{let i=[];try{i=await Ra(e)}catch(d){n?.(d),e.Statamic?.$toast?.error(h(e,"section_new_failed"));return}if(!i.length){n?.(new Error("no groups")),e.Statamic?.$toast?.error(h(e,"section_new_failed"));return}const r=ke(e.document,Eo,{heading:h(e,"section_new"),groupLabel:h(e,"section_new_group"),nameLabel:h(e,"section_new_name"),placeholder:h(e,"section_new_placeholder"),note:h(e,"section_new_note"),groups:i,addGroupLabel:h(e,"section_new_group_add"),addGroupNameLabel:h(e,"section_new_group_name"),addGroupPlaceholder:h(e,"section_new_group_placeholder"),onAddGroup:async d=>{try{const p=await Da(e,d);return e.Statamic?.$toast?.success(h(e,"section_group_created",{name:p.display})),p}catch(p){return e.Statamic?.$toast?.error(h(e,p?.message==="bad_name"?"section_new_bad_name":"section_group_failed")),null}},cancelLabel:h(e,"cancel"),saveLabel:h(e,"section_new_create"),onClose:s,onOk:(d,p)=>{Ao(e,r,{display:d,group:p},{afterUid:t,onDone:a,onError:n})}})})()}const Ya={key:0,class:"sve-ht-inspect"},Wa={class:"sve-ht-inspect__head"},Za={key:0,class:"sve-ht-inspect__note"},Ja={key:2,class:"sve-ht-inspect__props"},Qa={class:"sve-ht-inspect__proplabel"},es={key:0},ts=["value","disabled","onChange"],os={value:""},ns=["value"],as=["value"],ss=["value","placeholder","onChange"],rs=["title","disabled","onClick"],is=["title","disabled","onClick"],ls={key:0,class:"sve-ht-inspect__seg"},ds=["data-active","disabled","onClick"],cs=["value","disabled"],us={key:0,value:""},hs=["value"],ps={key:2,class:"sve-ht-inspect__box"},fs=["value","placeholder","disabled","onKeydown"],ms=["title","disabled"],vs={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},gs=["value","disabled"],ys=["value"],ks={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},bs=["value","placeholder","disabled"],_s=["title","disabled"],Ts={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},xs=["value","placeholder","disabled"],Ss={key:4,class:"sve-ht-inspect__add"},ws=["disabled","onClick"],ct='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',Cs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',$s={__name:"HtmlTreeInspector",setup(e){const t=q(null);pn(t,y=>o.onPropHost?.(y||null));const a=q(null),n=q(null);function s(y){o.onInspectCommit?.(y.target.value)}function i(y,g,c){!y||!g||(y.value=g,y.focus(),y.setSelectionRange(g.length,g.length),c(g))}function r(y,g){o.onInspectData?.(y.currentTarget,c=>o.onPropValue?.(g.handle,c,!0))}function d(y){o.onInspectData?.(y.currentTarget,g=>i(a.value,g,c=>o.onInspectCommit?.(c)))}function p(y){o.onInspectData?.(y.currentTarget,g=>i(n.value,g,c=>o.onLoopSortField?.(c)))}return(y,g)=>l(o).inspect?(f(),v("div",Ya,[L("div",Wa,P(l(o).inspect.title),1),l(o).inspect.mode==="note"?(f(),v("div",Za,P(l(o).inspect.note),1)):l(o).inspect.mode==="statamic"?(f(),v("div",{key:1,ref_key:"propHost",ref:t,class:"sve-ht-inspect__form"},null,512)):l(o).inspect.mode==="props"?(f(),v("div",Ja,[(f(!0),v(R,null,V(l(o).inspect.rows,c=>(f(),v("label",{key:c.handle,class:"sve-ht-inspect__prop"},[L("span",Qa,[fn(P(c.label)+" ",1),c.bound?(f(),v("em",es,":")):$("",!0)]),L("span",{class:mn(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":c.type==="select"||c.type==="link"}])},[c.type==="select"&&!c.bound?(f(),v("select",{key:0,value:c.value,disabled:!l(o).canEdit,onChange:b=>l(o).onPropValue?.(c.handle,b.target.value,!1)},[L("option",os,P(c.placeholder||l(o).inspect.inheritLabel),1),c.value&&!c.options.includes(c.value)?(f(),v("option",{key:0,value:c.value},P(c.value),9,ns)):$("",!0),(f(!0),v(R,null,V(c.options,b=>(f(),v("option",{key:b,value:b},P(b),9,as))),128))],40,ts)):(f(),v("input",{key:1,type:"text",value:c.value,placeholder:c.placeholder||l(o).inspect.inheritLabel,onChange:b=>l(o).onPropValue?.(c.handle,b.target.value,c.bound)},null,40,ss)),c.type==="link"?(f(),v("button",{key:2,type:"button","data-sve-ht-data":"",title:l(o).pageTitle,disabled:!l(o).canEdit,onClick:b=>l(o).onPropPage?.(b.currentTarget,c.handle),innerHTML:Cs},null,8,rs)):$("",!0),L("button",{type:"button","data-sve-ht-data":"",title:l(o).dataTitle,disabled:!l(o).canEdit,onClick:b=>r(b,c),innerHTML:ct},null,8,is)],2)]))),128))])):(f(),v(R,{key:3},[l(o).inspect.mode==="loop"?(f(),v("div",ls,[(f(!0),v(R,null,V(l(o).inspect.kinds,c=>(f(),v("button",{key:c.id,type:"button","data-active":c.id===l(o).inspect.loopKind?"":void 0,disabled:!l(o).canEdit,onClick:b=>l(o).onLoopKind?.(c.id)},P(c.label),9,ds))),128))])):$("",!0),l(o).inspect.mode==="loop"&&l(o).inspect.loopKind==="collection"?(f(),v("select",{key:l(o).inspect.key+":"+l(o).inspect.value,value:l(o).inspect.value,disabled:!l(o).canEdit,onChange:s},[l(o).inspect.value?$("",!0):(f(),v("option",us,P(l(o).inspect.placeholder),1)),(f(!0),v(R,null,V(l(o).inspect.collections,c=>(f(),v("option",{key:c.handle,value:c.handle},P(c.title),9,hs))),128))],40,cs)):(f(),v("div",ps,[(f(),v("input",{ref_key:"field",ref:a,key:l(o).inspect.key,type:"text",value:l(o).inspect.value,placeholder:l(o).inspect.placeholder,disabled:!l(o).canEdit,spellcheck:"false",onKeydown:[g[0]||(g[0]=S(()=>{},["stop"])),le(S(s,["prevent"]),["enter"])],onBlur:s},null,40,fs)),L("button",{type:"button","data-sve-ht-data":"",title:l(o).dataTitle,disabled:!l(o).canEdit,innerHTML:ct,onMousedown:g[1]||(g[1]=S(()=>{},["prevent"])),onClick:S(d,["stop","prevent"])},null,40,ms)])),l(o).inspect.sort?(f(),v(R,{key:3},[L("div",vs,P(l(o).inspect.sort.title),1),(f(),v("select",{key:l(o).inspect.key+":dir:"+l(o).inspect.sort.dir,value:l(o).inspect.sort.dir,disabled:!l(o).canEdit,onChange:g[2]||(g[2]=c=>l(o).onLoopSortDir?.(c.target.value))},[(f(!0),v(R,null,V(l(o).inspect.sort.dirs,c=>(f(),v("option",{key:c.id,value:c.id},P(c.label),9,ys))),128))],40,gs)),l(o).inspect.sort.needsField?(f(),v("div",ks,[(f(),v("input",{ref_key:"sortField",ref:n,key:l(o).inspect.key+":field",type:"text",value:l(o).inspect.sort.field,placeholder:l(o).inspect.sort.placeholder,disabled:!l(o).canEdit,spellcheck:"false",onKeydown:[g[3]||(g[3]=S(()=>{},["stop"])),g[4]||(g[4]=le(S(c=>l(o).onLoopSortField?.(c.target.value),["prevent"]),["enter"]))],onBlur:g[5]||(g[5]=c=>l(o).onLoopSortField?.(c.target.value))},null,40,bs)),l(o).inspect.sort.pickable?(f(),v("button",{key:0,type:"button","data-sve-ht-data":"",title:l(o).dataTitle,disabled:!l(o).canEdit,innerHTML:ct,onMousedown:g[6]||(g[6]=S(()=>{},["prevent"])),onClick:S(p,["stop","prevent"])},null,40,_s)):$("",!0)])):$("",!0),L("div",Ts,P(l(o).inspect.limit.title),1),(f(),v("input",{key:l(o).inspect.key+":limit",type:"number",min:"1",value:l(o).inspect.limit.value,placeholder:l(o).inspect.limit.placeholder,disabled:!l(o).canEdit,onKeydown:[g[7]||(g[7]=S(()=>{},["stop"])),g[8]||(g[8]=le(S(c=>l(o).onLoopLimit?.(c.target.value),["prevent"]),["enter"]))],onBlur:g[9]||(g[9]=c=>l(o).onLoopLimit?.(c.target.value))},null,40,xs))],64)):$("",!0),l(o).inspect.branches?.length?(f(),v("div",Ss,[(f(!0),v(R,null,V(l(o).inspect.branches,c=>(f(),v("button",{key:c.id,type:"button",disabled:!l(o).canEdit,onClick:b=>l(o).onAddBranch?.(c.id)},P(c.label),9,ws))),128))])):$("",!0)],64))])):$("",!0)}},Ls=Ne($s,[["__scopeId","data-v-26254b75"]]),Ps={class:"sve-html-tree"},Es={class:"sve-pane-bar","data-sve-pane-bar":""},Hs={"data-sve-right-title":""},Is={"data-sve-right-actions":""},As=["aria-pressed","title","aria-label"],Ms={class:"sve-ht-tools"},Rs=["title"],Ds=["placeholder","aria-label","value"],Os=["aria-label"],Fs=["title","aria-label"],Bs={key:1,class:"sve-tree-exit"},Ns=["title"],js=["title"],Vs='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',Ks='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',qs='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',Gs='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',zs={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const t=h(window,"html_tree_search");o.layers=vn(window);const a=h(window,"html_tree_layers_on"),n=h(window,"html_tree_layers_off");function s(){kn(window,!o.layers)}const i=Io(window),r=h(window,"section_new"),d=q(!1);function p(){d.value=!1}async function y(b){if(!b)return;await Ee(),o.onRefresh?.();const k=T("html-tree:open-section",b);k&&Ka(window,k.ids)}function g(){d.value||(d.value=!0,(async()=>{if(!(o.sections.length||o.pageBuilder)){za(window),p();return}const b=await qa(window);if(!b){p();return}const k=o.sections.length?o.sections[o.sections.length-1].uid:null,x=_=>{p(),y(_?.uid)};if(b==="static"){Ua(window,{afterUid:k,onDone:x,onError:p,onClose:p});return}Xa(window,{afterUid:k,onDone:x,onError:p,onClose:p})})())}function c(b){const k=!!o.query;o.query=b,k!==!!b&&o.onQuery?.()}return(b,k)=>(f(),v("div",Ps,[L("div",Es,[L("div",Hs,P(e.title),1),L("div",Is,[L("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":l(o).layers?"true":"false",title:l(o).layers?l(n):l(a),"aria-label":l(o).layers?l(n):l(a),innerHTML:Vs,onClick:s},null,8,As),k[5]||(k[5]=gn('<button type="button" data-sve-right-pin aria-pressed="false" data-v-2640030d></button><button type="button" data-sve-close aria-label="Close" data-v-2640030d><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-2640030d><path d="M18 6 6 18" data-v-2640030d></path><path d="m6 6 12 12" data-v-2640030d></path></svg></button>',2))])]),L("div",Ms,[L("label",{class:"sve-ht-search",title:l(t)},[L("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:qs}),L("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:l(t),"aria-label":l(t),value:l(o).query,autocomplete:"off",spellcheck:"false",onInput:k[0]||(k[0]=x=>c(x.target.value)),onKeydown:[k[1]||(k[1]=S(()=>{},["stop"])),k[2]||(k[2]=le(S(x=>c(""),["prevent"]),["escape"]))]},null,40,Ds),l(o).query?(f(),v("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":l(t),innerHTML:Gs,onClick:k[3]||(k[3]=x=>c(""))},null,8,Os)):$("",!0)],8,Rs),l(i)&&(l(o).sections.length||l(o).pageBuilder||l(o).rows.length&&!l(o).layoutFile)?(f(),v("button",{key:0,type:"button",class:"sve-ht-new",title:l(r),"aria-label":l(r),innerHTML:Ks,onClick:g},null,8,Fs)):$("",!0)]),l(Y).inSidebar?$("",!0):(f(),X(Un,{key:0})),k[6]||(k[6]=L("div",{"data-sve-html-tree-list":""},null,-1)),yn(Ls),l(o).exitOpen&&!l(Y).inSidebar?(f(),v("div",Bs,[L("span",{class:"sve-tree-exit__name",title:l(o).exitName},P(l(o).exitName),9,Ns),L("button",{type:"button",class:"sve-tree-exit__go",title:l(o).exitTitle,onClick:k[4]||(k[4]=x=>l(o).onExit?.())},P(l(o).exitLabel),9,js)])):$("",!0)]))}},Mo=Ne(zs,[["__scopeId","data-v-2640030d"]]);function Ro(e){return String(e||"").trim().toLowerCase()}function kt(e,t){return t?[e.name,e.tag,e.klass,e.label,e.src].filter(a=>typeof a=="string"&&a).join(" ").toLowerCase().includes(t):!0}function Us(e,t){const a=Ro(t);if(!a)return{rows:e,hits:new Set};const n=new Set;for(const r of e)kt(r,a)&&n.add(r.path);const s=[...n];return{rows:e.filter(r=>n.has(r.path)||s.some(d=>d.startsWith(`${r.path}/`))),hits:n}}const Xs=["title"],Ys={"data-sve-ht-indent":"","aria-hidden":"true"},Ws=["data-sve-ht-cat"],Zs={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},Js={key:2,"data-sve-ht-letter":""},Qs=["innerHTML"],er=["title"],tr=["title"],or={key:1,"data-sve-ht-kind":""},nr={key:3,"data-sve-ht-name":""},ar={key:4,"data-sve-ht-actions":""},sr=["title"],rr={key:5,"data-sve-ht-actions":""},ir=["data-on","title","innerHTML"],lr=["disabled","title","innerHTML"],dr=["disabled","title"],cr=["disabled","title"],ur=["disabled","title"],hr=["data-sve-ht-id"],no='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',pr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',fr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',mr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',vr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',gr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',yr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',kr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',br={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const t=Kn(window),a=h(window,"section_fields");function n(){const _=qn();if(!_){window.Statamic?.$toast?.error(h(window,"section_fields_none"));return}wo(window,_)}function s(_){return _.synthetic?_.frame==="main"?o.frameMainTitle:_.frame==="template"?o.frameTemplateTitle:o.frameOpenTitle:_.kind==="component"?_.src?`partial:${_.src}`:_.tag:_.name?`${_.tag} ${_.name}`:_.tag}function i(_){return!!_.section}function r(_){return!!_.frame}function d(_){return _.kind==="slot"}function p(_){return!!_.context}function y(_,m){p(m)||r(m)||d(m)||(i(m)?o.onSectionPointerDown?.(_,m.section):m.sectionRoot?o.onSectionPointerDown?.(_,m.sectionRoot):o.onPointerDown?.(_,m.id))}function g(_){if(_.synthetic){o.onFrame?.(_.frame);return}if(i(_)){o.onSection?.(_.section);return}if(p(_)){o.onContextRow?.(_.id);return}o.onSelect?.(_.id)}function c(_,m){const C={"data-sve-ht-id":_.id};return _.current&&(C["data-sve-ht-current"]=""),_.hidden&&(C["data-sve-ht-hidden"]=""),C["data-sve-ht-cat"]=_.cat||"other",C["data-sve-ht-depth"]=String(_.depth),m&&(C["data-sve-ht-dim"]=""),p(_)&&(C["data-sve-ht-context"]=_.context),i(_)&&(C["data-sve-ht-sec"]=""),r(_)&&(C["data-sve-ht-frame"]=_.frame),!i(_)&&o.dropId===_.id&&o.dropPlace&&(C["data-sve-ht-drop"]=o.dropPlace),C}function b(_){return!_.hidden||_.wrapFrom!=null}function k(_){return!!_.sectionRoot||!!_.section}function x(_){return o.canEdit||k(_)}return(_,m)=>(f(),v(R,null,[L("div",He({"data-sve-ht-row":""},c(e.row,e.dim),{role:"button",tabindex:"0",title:s(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:m[32]||(m[32]=C=>g(e.row)),onDblclick:m[33]||(m[33]=S(C=>e.row.synthetic?l(o).onFrameEnter?.(e.row.frame):r(e.row)||d(e.row)||i(e.row)||p(e.row)?null:l(o).onRename?.(e.row.id),["prevent"])),onKeydown:[m[34]||(m[34]=le(S(C=>g(e.row),["prevent"]),["enter"])),m[35]||(m[35]=le(S(C=>g(e.row),["prevent"]),["space"]))],onPointerdown:m[36]||(m[36]=C=>y(C,e.row)),onContextmenu:m[37]||(m[37]=S(C=>r(e.row)||d(e.row)||i(e.row)||p(e.row)?null:l(o).onContext?.(C,e.row.id),["prevent","stop"]))}),[L("span",Ys,[(f(!0),v(R,null,V(e.row.guides||[],(C,B)=>(f(),v("i",{key:B,"data-sve-ht-cat":C},null,8,Ws))),128))]),e.row.hasChildren||e.row.emptyBlock?(f(),v("button",He({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?l(o).mainShut:e.row.shut)?{"data-sve-ht-shut":""}:{},{innerHTML:pr,onClick:m[0]||(m[0]=S(C=>e.row.synthetic?l(o).onFrameTwist?.():i(e.row)?l(o).onSection?.(e.row.section):l(o).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:m[1]||(m[1]=S(()=>{},["stop"])),onDblclick:m[2]||(m[2]=S(()=>{},["stop"]))}),null,16)):(f(),v("span",Zs)),e.row.letter?(f(),v("span",Js,P(e.row.letter),1)):(f(),v("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Qs)),L("span",{"data-sve-ht-text":"",title:l(o).renameTitle},[!e.row.kind&&!i(e.row)&&!p(e.row)&&!r(e.row)?(f(),v("button",{key:0,type:"button","data-sve-ht-tag":"",title:l(o).tagTitle,onClick:m[3]||(m[3]=S(()=>{},["stop","prevent"])),onPointerdown:m[4]||(m[4]=S(()=>{},["stop"])),onDblclick:m[5]||(m[5]=S(C=>l(o).onTagChange?.(C,e.row.id),["stop","prevent"]))},P(e.row.tag),41,tr)):(f(),v("span",or,P(e.row.tag),1)),l(o).editingId===e.row.id&&!i(e.row)?pe((f(),v("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":m[6]||(m[6]=C=>l(o).draft=C),onMousedown:m[7]||(m[7]=S(()=>{},["stop"])),onPointerdown:m[8]||(m[8]=S(()=>{},["stop"])),onClick:m[9]||(m[9]=S(()=>{},["stop"])),onDblclick:m[10]||(m[10]=S(()=>{},["stop"])),onKeydown:[m[11]||(m[11]=S(()=>{},["stop"])),m[12]||(m[12]=le(S(C=>l(o).onRenameCommit?.(),["prevent"]),["enter"])),m[13]||(m[13]=le(S(C=>l(o).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:m[14]||(m[14]=C=>l(o).onRenameCommit?.())},null,544)),[[vt,l(o).draft]]):(f(),v("span",nr,P(e.row.name),1))],8,er),r(e.row)?(f(),v("span",ar,[e.row.frame!=="main"&&l(t)?(f(),v("button",{key:0,type:"button","data-sve-ht-fields":"",title:l(o).frameFieldsTitle,innerHTML:no,onClick:m[15]||(m[15]=S(C=>l(o).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:m[16]||(m[16]=S(()=>{},["stop"])),onDblclick:m[17]||(m[17]=S(()=>{},["stop"]))},null,40,sr)):$("",!0)])):!i(e.row)&&!p(e.row)&&!d(e.row)?(f(),v("span",rr,[e.row.videoNth>=0?(f(),v("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?l(o).videoPlayTitle:l(o).videoHoldTitle,innerHTML:e.row.videoHeld?yr:gr,onClick:m[18]||(m[18]=S(C=>l(o).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:m[19]||(m[19]=S(()=>{},["stop"])),onDblclick:m[20]||(m[20]=S(()=>{},["stop"]))},null,40,ir)):$("",!0),b(e.row)?(f(),v("button",{key:1,type:"button","data-sve-ht-eye":"",disabled:!l(o).canEdit,title:l(o).canEdit?e.row.hidden?l(o).showTitle:l(o).hideTitle:l(o).lockedTitle,innerHTML:e.row.hidden?mr:fr,onClick:m[21]||(m[21]=S(C=>l(o).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:m[22]||(m[22]=S(()=>{},["stop"])),onDblclick:m[23]||(m[23]=S(()=>{},["stop"]))},null,40,lr)):$("",!0),l(t)&&e.row.fieldsIcon?(f(),v("button",{key:2,type:"button","data-sve-ht-fields":"",disabled:!l(o).canEdit,title:l(o).canEdit?l(a):l(o).lockedTitle,innerHTML:no,onClick:S(n,["stop","prevent"]),onPointerdown:m[24]||(m[24]=S(()=>{},["stop"])),onDblclick:m[25]||(m[25]=S(()=>{},["stop"]))},null,40,dr)):$("",!0),e.row.frameCall?$("",!0):(f(),v("button",{key:3,type:"button","data-sve-ht-dup":"",disabled:!x(e.row),title:x(e.row)?l(o).duplicateTitle:l(o).lockedTitle,innerHTML:vr,onClick:m[26]||(m[26]=S(C=>l(o).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:m[27]||(m[27]=S(()=>{},["stop"])),onDblclick:m[28]||(m[28]=S(()=>{},["stop"]))},null,40,cr)),e.row.frameCall?$("",!0):(f(),v("button",{key:4,type:"button","data-sve-ht-del":"",disabled:!x(e.row),title:x(e.row)?l(o).deleteTitle:l(o).lockedTitle,innerHTML:kr,onClick:m[29]||(m[29]=S(C=>l(o).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:m[30]||(m[30]=S(()=>{},["stop"])),onDblclick:m[31]||(m[31]=S(()=>{},["stop"]))},null,40,ur))])):$("",!0)],16,Xs),e.row.emptyBlock&&!e.row.shut?(f(),v("div",He({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},l(o).dropId===e.row.id&&l(o).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),P(l(o).slotText),17,hr)):$("",!0)],64))}},Z=Ne(br,[["__scopeId","data-v-2b5fef31"]]),_r=["data-sve-ht-look","data-sve-ht-layers"],Tr={key:0,class:"sve-ht-empty"},xr={key:1,class:"sve-ht-empty"},Sr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},wr={key:0,class:"sve-ht-empty"},Cr={key:0,class:"sve-ht-empty"},$r={key:2,"data-sve-ht-frame-body":""},Lr={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},Pr={key:0,class:"sve-ht-empty"},Er={key:3,"data-sve-ht-frame-body":""},Hr=["data-dim"],Ir={key:0,class:"sve-ht-empty"},Ar={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},Mr={key:0,class:"sve-ht-empty"},Rr={__name:"HtmlTreeList",setup(e){const t=Te(()=>Ro(o.query)),a=Te(()=>Us(o.rows,t.value)),n=Te(()=>a.value.rows),s=Te(()=>t.value?o.sections.filter(c=>kt(c.row,t.value)||c.current&&c.ready&&n.value.length>0):o.sections);function i(c){return!!c&&(!t.value||kt(c,t.value))}function r(c){const b=o.frame?.kind;return o.inComponent||(b==="header"||b==="footer")&&b!==c}const d=Te(()=>!!o.frame&&["header","main","footer"].some(c=>i(o.frame[c]))),p=Te(()=>!!t.value&&!s.value.length&&!n.value.length&&!d.value);function y(c){return!!t.value&&!a.value.hits.has(c.path)}function g(c){const b={"data-sve-ht-sec-uid":c.uid};return c.current&&(b["data-sve-ht-branch"]="",b["data-sve-ht-cat"]=c.row?.cat||"layout"),o.sectionDrop&&o.sectionDrop.uid===c.uid&&(b["data-sve-ht-drop"]=o.sectionDrop.place),b}return(c,b)=>(f(),v("div",He({class:"sve-ht-root","data-sve-ht-look":l(o).layers?"tags":l(o).look,"data-sve-ht-layers":l(o).layers?"":null,style:l(o).familyStyle},l(o).dragging?{"data-sve-ht-dragging":""}:{}),[!l(o).rows.length&&!l(o).sections.length&&!l(o).frame?(f(),v("div",Tr,P(l(o).emptyText),1)):p.value?(f(),v("div",xr,P(l(o).searchEmpty),1)):$("",!0),l(o).frame||l(o).sections.length?(f(),v(R,{key:2},[l(o).frame?(f(),v(R,{key:0},[l(o).frame.kind==="header"?(f(),v("div",Sr,[(f(!0),v(R,null,V(n.value,k=>(f(),X(Z,{key:k.id,row:k,dim:y(k)},null,8,["row","dim"]))),128)),l(o).rows.length?$("",!0):(f(),v("div",wr,P(l(o).emptyText),1))])):i(l(o).frame.header)?(f(),X(Z,{key:1,row:l(o).frame.header,dim:r("header")},null,8,["row","dim"])):$("",!0)],64)):$("",!0),L("div",bn(_n(l(o).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[l(o).frame?.kind==="main"?(f(),v(R,{key:0},[(f(!0),v(R,null,V(n.value,k=>(f(),X(Z,{key:k.id,row:k,dim:y(k)},null,8,["row","dim"]))),128)),l(o).rows.length?$("",!0):(f(),v("div",Cr,P(l(o).emptyText),1))],64)):l(o).frame&&i(l(o).frame.main)?(f(),X(Z,{key:1,row:l(o).frame.main,dim:r("main")},null,8,["row","dim"])):$("",!0),l(o).frame?.kind==="template"?pe((f(),v("div",$r,[L("div",Lr,[(f(!0),v(R,null,V(n.value,k=>(f(),X(Z,{key:k.id,row:k,dim:y(k)},null,8,["row","dim"]))),128)),l(o).rows.length?$("",!0):(f(),v("div",Pr,P(l(o).emptyText),1))])],512)),[[Wt,!l(o).mainShut]]):$("",!0),l(o).sections.length||l(o).frame?pe((f(),v("div",Er,[l(o).frame?.template&&i(l(o).frame.template)?(f(),X(Z,{key:0,row:l(o).frame.template,dim:r("template")},null,8,["row","dim"])):$("",!0),l(o).frame&&!l(o).frame.template&&!l(o).sections.length&&!t.value?(f(),v("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":r("")?"":void 0},P(l(o).frameEmptyText),9,Hr)):$("",!0),(f(!0),v(R,null,V(s.value,k=>(f(),v("div",He({key:k.uid},{ref_for:!0},g(k)),[k.ready?(f(),v(R,{key:0},[(f(!0),v(R,null,V(n.value,x=>(f(),X(Z,{key:x.id,row:x,dim:y(x)},null,8,["row","dim"]))),128)),l(o).rows.length?$("",!0):(f(),v("div",Ir,P(l(o).emptyText),1))],64)):(f(),X(Z,{key:1,row:k.row,dim:r("")},null,8,["row","dim"]))],16))),128))],512)),[[Wt,!l(o).frame||!l(o).mainShut]]):$("",!0)],16),l(o).frame?(f(),v(R,{key:1},[l(o).frame.kind==="footer"?(f(),v("div",Ar,[(f(!0),v(R,null,V(n.value,k=>(f(),X(Z,{key:k.id,row:k,dim:y(k)},null,8,["row","dim"]))),128)),l(o).rows.length?$("",!0):(f(),v("div",Mr,P(l(o).emptyText),1))])):i(l(o).frame.footer)?(f(),X(Z,{key:1,row:l(o).frame.footer,dim:r("footer")},null,8,["row","dim"])):$("",!0)],64)):$("",!0)],64)):l(o).rows.length?(f(!0),v(R,{key:3},V(n.value,k=>(f(),X(Z,{key:k.id,row:k,dim:y(k)},null,8,["row","dim"]))),128)):$("",!0)],16,_r))}},ao=Ne(Rr,[["__scopeId","data-v-1efba2e6"]]);let ut=null;function Dr(e){return ut||(ut=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{pages:[]}).then(t=>Array.isArray(t.pages)?t.pages:[]).catch(()=>[])),ut}let ze=null;function ht(){ze?.dismiss(),ze=null}function Or(e,t,a){ht();const n=t?.getBoundingClientRect?.(),s={x:n?n.left:0,y:n?n.bottom+4:0};Dr(e).then(i=>{const r=i.length?i.map(d=>({label:d.title||d.url,onPick:()=>{ht(),a(d.url)}})):[{label:h(e,"component_props_pages_none"),onPick:null}];ht(),ze=ke(e.document,Mt,{items:r,x:s.x,y:s.y,onClose:()=>{ze=null}})})}const Do="sve-html-tree-labels";function Oo(){try{const e=globalThis.localStorage?.getItem(Do);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function Fr(e){try{globalThis.localStorage?.setItem(Do,JSON.stringify(e))}catch{}}function Fo(e){return String(e||"_")}function Bo(e){const t=Oo()[Fo(e)];return t&&typeof t=="object"?{...t}:{}}function Br(e,t,a){const n=a?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function Nr(e,t,a,n){if(!t)return;const s=Fo(e),i=Oo(),r={...i[s]||{}},d=String(a||"").replace(/\s+/g," ").trim(),p=String(n||"").trim();!d||d===p?delete r[t]:r[t]=d,Object.keys(r).length?i[s]=r:delete i[s],Fr(i)}const jr=/^@(media|supports|container|layer|scope)\b/i;function Vr(e){const t=String(e||""),a=[];let n=0,s=0;for(;n<t.length;){if(t[n]==="{"&&t[n+1]==="{"){const d=t.indexOf("}}",n+2);n=d===-1?t.length:d+2;continue}if(t[n]==="/"&&t[n+1]==="*"){const d=t.indexOf("*/",n+2);n=d===-1?t.length:d+2;continue}if(t[n]==='"'||t[n]==="'"){const d=t[n];for(n+=1;n<t.length&&t[n]!==d;)n+=t[n]==="\\"?2:1;n+=1;continue}if(t[n]!=="{"){n+=1;continue}let i=1,r=n+1;for(;r<t.length&&i>0;){if(t[r]==="{"&&t[r+1]==="{"){const d=t.indexOf("}}",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==="/"&&t[r+1]==="*"){const d=t.indexOf("*/",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==='"'||t[r]==="'"){const d=t[r];for(r+=1;r<t.length&&t[r]!==d;)r+=t[r]==="\\"?2:1;r+=1;continue}t[r]==="{"?i+=1:t[r]==="}"&&(i-=1),r+=1}a.push({selector:t.slice(s,n).trim(),body:t.slice(n+1,r-1),from:s,to:r,text:t.slice(s,r).trim()}),n=r,s=r}return a}function so(e){const t=String(e||""),a=new Set,n=new Set,s=new Set;for(const i of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const r of i[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))r&&(a.add(r),a.add(r.replace(/([:./%!#()[\],])/g,"\\$1")));for(const i of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))i[2].trim()&&n.add(i[2].trim());for(const i of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))s.add(i[1].toLowerCase());return{classes:a,ids:n,tags:s}}function ro(e,t){const a=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),n=[...a.matchAll(/\.((?:\\.|[\w-])+)/g)].map(r=>r[1]),s=[...a.matchAll(/#((?:\\.|[\w-])+)/g)].map(r=>r[1]);if(n.length||s.length){const r=d=>d.replace(/\\(.)/g,"$1");return n.every(d=>t.classes.has(d)||t.classes.has(r(d)))&&s.every(d=>t.ids.has(r(d)))}const i=[...a.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(r=>r[2].toLowerCase());return i.length>0&&i.every(r=>t.tags.has(r))}function Kr(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function qr(e,t,a){const n=Kr(e);if(!n.length)return"keep";const s=n.filter(r=>ro(r,t));return s.length?s.length===n.length&&!n.some(r=>ro(r,a))?"move":"copy":"keep"}function No(e,t,a){const n=String(e||""),s=so(t),i=so(a),r=[],d=[];let p=0;for(const y of Vr(n)){const g=n.slice(y.from,y.to),c=g.match(/^\s*/)[0];if(p=y.to,jr.test(y.selector)){const k=No(y.body,t,a);k.move.trim()&&r.push(`${y.selector} {
${k.move.trim()}
}`),k.keep.trim()&&d.push(`${c}${y.selector} {
${k.keep.trim()}
}`);continue}const b=y.selector.startsWith("@")?"keep":qr(y.selector,s,i);if(b==="move"){r.push(y.text);continue}b==="copy"&&r.push(y.text),d.push(g)}return d.push(n.slice(p)),{move:r.join(`

`).trim(),keep:d.join("").replace(/\n{3,}/g,`

`).trim()}}const Gr="/!/sve/component";function zr(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let a=null;for(const n of t){if(!n.trim())continue;const s=n.match(/^[ \t]*/)[0].length;a=a===null?s:Math.min(a,s)}return a?t.map(n=>n.slice(a)).join(`
`):t.join(`
`)}function Ur(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function Xr(e,t){if(!Yn(e))return"";try{return await(await xn(()=>import("./tw-compile-AWaJHJyk.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(a){return console.error("[sve] component tailwind compile",a),""}}async function Yr(e,t){const a=await e.fetch(Gr,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":Et(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!a.ok){const n=new Error(String(a.status));throw n.status=a.status,n}return a.json()}function io(e,t){const{from:a,to:n}=Xn(e,t),s=e.slice(a,n);if(!s.trim())return null;const i=e.slice(0,a)+e.slice(n),r=T("dock:css"),d=No(typeof r=="string"?r:"",s,i);return{html:zr(s),css:d.move,keepCss:d.keep,lead:Ur(s),from:a,to:n}}function Wr(e,t,{onDone:a,onError:n}={}){if(T("dock:is-locked")===!0)return;const s=T("dock:html");if(typeof s!="string"||!t)return;const i=io(s,t);if(!i)return;const r=ke(e.document,Tn,{heading:h(e,"component_new"),nameLabel:h(e,"component_name"),placeholder:h(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:h(e,"cancel"),saveLabel:h(e,"component_create"),onOk:d=>{r.dismiss(),(async()=>{try{const p=await Xr(e,i.html),y=T("dock:html"),g=typeof y=="string"&&y===s?i:io(y,t);if(!g)return;const c=await Yr(e,{name:d,html:g.html,css:g.css,js:"",tw:p}),b=T("dock:html"),k=b.slice(0,g.from)+g.lead+c.tag+b.slice(g.to);T("dock:set-html",k),g.css.trim()&&T("dock:set-css",g.keepCss),a?.(c)}catch(p){n?.(p)}})()}})}function Zr(e,t,a){const n=String(e||"");if(!t||t.kind!=="antlers")return n;const s=String(a||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?ti(n,t,s):t.tag==="else"||!s?n:n.slice(0,t.from)+`{{ ${t.tag} ${s} }}`+n.slice(t.openTo)}function bt(e,t,a,n){return Ie(e,t,{kind:a,name:n})}function Ie(e,t,a={}){const n=String(e||"");if(!t||t.antlers!=="loop")return n;const s=t.loopKind==="collection"?"collection":"field",i=a.kind??s,r=String(a.name??t.expr??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(r))return n;const d=a.sortDir??t.sortDir??"",p=String(a.sortField??t.sortField??"").trim(),y=String(a.limit??t.limit??"").trim(),g=jo(n,t);if(!g)return n;const c=i===s?t.params:"",b=i==="collection"?Jr(r,p,d,y,c):Qr(r,p,d,y,c),k=i==="collection"?"collection":r;return n.slice(0,t.from)+b+n.slice(t.openTo,g.from)+`{{ /${k} }}`+n.slice(g.to)}function Jr(e,t,a,n,s){const i=ei(s).replace(/\bsort\s*=\s*["'][^"']*["']/g,"").replace(/\blimit\s*=\s*["']?\d+["']?/g,"").replace(/\s+/g," ").trim(),r=[`collection from="${e}"`];return a==="random"?r.push('sort="random"'):t&&r.push(`sort="${t}${a==="desc"?":desc":":asc"}"`),n&&r.push(`limit="${n}"`),i&&r.push(i),`{{ ${r.join(" ")} }}`}function Qr(e,t,a,n,s){const i=String(s||"").split("|").map(d=>d.trim()).filter(d=>d&&!/^from\s*=/.test(d)&&!/^sort\s*:/.test(d)&&!/^reverse$/.test(d)&&!/^shuffle$/.test(d)&&!/^limit\s*:/.test(d)),r=[e,...i];return a==="random"?r.push("shuffle"):t&&(r.push(`sort:${t}`),a==="desc"&&r.push("reverse")),n&&r.push(`limit:${n}`),`{{ ${r.join(" | ")} }}`}function ei(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function jo(e,t){const n=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return n?{from:t.from+n.index,to:t.from+n.index+n[0].length}:null}function ti(e,t,a){return Ie(e,t,{name:a})}function oi(e,t,a){const n=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return n;const s=jo(n,t);if(!s)return n;const r=(n.slice(0,s.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],d=a==="else"?"{{ else }}":"{{ elseif true }}";return`${n.slice(0,s.from)}${d}
${r}${n.slice(s.from)}`}const z=Qn("sve-call-values"),Oe=new Set;let lo=null;const ni="__sve-html-tree-style",K=new Set;let _t="",xe=!1,pt=null,$e=!0,J="",Ce=0,Vo="";const de=new Map,we=new Set;let G="",Ko=!1,F=null,Ue=null,Ke="",Xe=0,Tt=null,Fe=[],fe=null,Ae=null,Ye=null,We=null,xt=null,ge=!1,me=null,Be=null,Me=null,Ze=null,Je=null,St=null,he=null;function W(e){return e.getElementById(Ge)}function ai(e){wn(e,ni,`
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
      ${Zt("light")}
      /* How much of a row's own colour its pick takes: a wash, not a fill.
         The row mixes it in below — a mix written up here would read
         --sve-ht-c on the list, where no family is set. */
      --sve-ht-pick-mix: 11%;
      --sve-ht-pick-hover-mix: 18%;
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${Zt("dark")}
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
  `)}function U(){const e=T("dock:html");return typeof e=="string"?e:""}function qo(e){return!!T("dock:is-open",e)}function Le(e,{save:t=!1}={}){return Bt()||T("dock:set-html",e)!==!0?!1:(t&&T("dock:save-now"),!0)}function co(e){const t=T("dock:component-exit-state")||{};if(o.exitOpen=!!t.open,!t.open){o.onExit=null;return}o.exitName=t.name||"",o.exitLabel=h(e,"component_exit"),o.exitTitle=h(e,t.back?"component_exit_back":"component_exit_close"),o.onExit=()=>{T("dock:exit-component"),I(e)}}function Go(e,t){const a=Dn(e);if(!a||t.type!==a)return"";const n=On(t[a]);return n&&Fn(e,n)?.section_type||""}const ye=[];let ft=!1,wt=!1;function mt(e,t){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(t,{timeout:2e3});return}e.setTimeout(t,200)}function si(e,t){for(const a of t){const n=a.type;!n||de.has(n)||we.has(n)||ye.includes(n)||ye.push(n)}Ht.htmlTreePrefetchArmed&&Ft(e)}function Qi(e){Ht.htmlTreePrefetchArmed=!0,Ft(e)}function Ft(e){if(ft||!ye.length)return;ft=!0;const t=()=>{const a=ye.shift();if(!a){ft=!1;return}if(de.has(a)||we.has(a)){mt(e,t);return}we.add(a),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(a)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{typeof n?.html=="string"&&(de.set(a,n.html),wt&&(wt=!1,I(e)))}).catch(()=>{}).finally(()=>{we.delete(a),mt(e,t)})};mt(e,t)}function Bt(){return!!G}function ri(e){const t=new Map,a=ot(e);if(!a)return t;for(const n of a.querySelectorAll("[data-sid]")){const s=n.getAttribute("data-sid");s&&!t.has(s)&&t.set(s,n.tagName.toLowerCase())}return t}function ii(e,t){const a=je(e)||"page_sections";for(const n of nt(t)||[]){const s=at(n.values),i=s&&typeof s=="object"?s[a]:null;if(Array.isArray(i))return!0}return!1}function it(e,t){const a=je(e)||"page_sections",n=ri(e),s=[];for(const i of nt(t)||[]){const r=at(i.values),d=r&&typeof r=="object"?r[a]:null;if(Array.isArray(d)){d.forEach(p=>{if(!p||typeof p!="object"||Array.isArray(p)||typeof p.type!="string")return;const y=[p._visual_id,p.id,p._id].filter(x=>typeof x=="string"&&x!=="");if(!y.length)return;const g=Go(e,p)||p.type,c=typeof p._sve_label=="string"?p._sve_label.trim():"",b=y.map(x=>n.get(x)).find(Boolean)||"section",k=Bo(p.type)[`0:${b}`];s.push({uid:y[0],ids:y,type:p.type,tag:b,label:c||(typeof k=="string"&&k.trim()?k.trim():"")||st(e,g)?.display||Re(g)||g,svg:$o(b,"",null).svg||Se.section,cat:xo(b),enabled:p.enabled!==!1,static:Fa(e,g)})});break}}return s}function li(e,t,a){if(!a.length)return"";const n=T("dock:current-type")||"",s=T("dock:current-uid"),i=!!T("dock:component-exit-state")?.open;if(s){const r=It(s,t),d=a.find(p=>p.ids.some(y=>r.includes(y)));if(d&&(i||d.type===n))return d.uid}return a.find(r=>r.type===n)?.uid||""}function di(e,t,a,n){const s=t.find(x=>x.uid===a),i=T("dock:component-src"),r=T("dock:type-stack")||[];if(!s||!i||!r.length)return null;const d=r.map(x=>x.type).filter(x=>!de.get(x));if(d.length)return ci(e,d),null;const p=[],y=new Set,g=new Set;let c=x=>p.push(...x),b=null,k=0;for(let x=0;x<r.length;x+=1){const _=x+1<r.length?r[x+1].src:i,m=N=>({...N,id:`ctx${x}:${N.id}`,path:`ctx${x}/${N.path}`,ctxLevel:x,children:N.children.map(m)}),C=rt(de.get(r[x].type)).map(m),B=[],E=(N,M)=>{for(const O of N){if(O.kind==="component"&&O.src===_)return B.push(...M,O),O;const se=E(O.children,[...M,O]);if(se)return se}return null};if(b=_?E(C,[]):null,!b)return null;const A=new Set(B.map(N=>N.id)),D=(N,M)=>{for(const O of N)O.children.length&&(A.has(O.id)?K.has(O.path):Uo(O,M))&&y.add(O.id),D(O.children,M+1)};D(C,k),c(C),g.add(b.id),k+=B.length,c=(N=>M=>{N.children=M})(b)}for(const x of Xo(n))y.add(x);return K.has(b.path)&&y.add(b.id),b.children=n,{tree:p,folds:y,hostId:b.id,hostIds:g,levels:r.length,rootId:p.find(x=>!x.kind)?.id||"",label:s.label,svg:s.svg,cat:s.cat}}function ci(e,t){for(const a of t)!ye.includes(a)&&!we.has(a)&&ye.push(a);wt=!0,Ft(e)}function ui(e,t,a){const n=T("dock:component-exit-state");if(n?.open)return Re(n.name)||n.name||"";if(a)return t.find(i=>i.uid===a)?.label||"";const s=T("dock:current-type")||"";return st(e,s)?.display||Re(s)||""}function lt(e,t,a,n,s){const i=a.find(d=>d.uid===n);if(!i||n===s)return;K.clear(),F=null,$e=!1,ae(),Ve(),J=n,Vo=U(),G=de.get(i.type)||"",G&&(F=Qe(rt(G))||null),Ko=(T("dock:current-type")||"")===i.type,e.clearTimeout(Ce),Ce=e.setTimeout(()=>{J="",xe=!1,I(e)},4e3),I(e);const r=()=>jn(i.uid,t,e,{clampToSection:!0});Rn(i.uid,t,e,r),ce({source:ee,type:Q.SVE_ACTIVATE,ids:i.ids},e),e.setTimeout(()=>I(e),0)}function zo(e,t){if(!t)return!1;for(const a of e||[])if(a.id===t||zo(a.children,t))return!0;return!1}function Qe(e){for(const t of e||[]){if(!t.kind)return t.id;const a=Qe(t.children);if(a)return a}return""}function Uo(e,t){return K.has(e.path)?t===0:t>0}function Xo(e){const t=new Set,a=(n,s)=>{for(const i of n)i.children.length&&Uo(i,s)&&t.add(i.id),a(i.children,s+1)};return a(e,0),t}function I(e){const t=e.document,n=W(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;ai(t),Zn(e);const s=U();G&&G===s&&(G=""),T("dock:chrome-kind")&&(G="");const i=G||s,r=rt(i);Fe=r;const d=T("dock:current-type")||"",p=Bo(d),y=ii(e,t),c=!!(T("dock:component-exit-state")||{}).open,b=it(e,t);d&&s&&!G&&de.set(d,s),si(e,b);const k=li(e,t,b),x=String(T("dock:chrome-kind")||"");if(En(e),y&&!b.length&&!x){Fe=[],o.rows=[],o.sections=[],o.frame=ho(e,[],!1,!1,"",!0),o.frameEmptyText=h(e,"html_tree_frame_no_sections"),o.pageBuilder=!0,o.layoutFile=!1,o.emptyText=h(e,"html_tree_empty"),o.canEdit=!T("dock:is-locked"),o.look=Jt(e),o.onRefresh=()=>I(e),o.onSection=null,uo(e,""),co(e),qe(n,ao),mo(e,[]);return}o.pageBuilder=y;const _=`${d}|${k}`;let m=!1;_!==_t&&(_t=_,K.clear(),pt!==null&&i!==pt?m=!0:xe=i),(m||xe!==!1&&i!==xe)&&(xe=!1,K.clear(),F=Qe(r)||null),pt=i,J&&(J===k||!b.length)&&(Ko||i!==Vo)&&(e.clearTimeout(Ce),J="",xe=!1,zo(r,F)||(K.clear(),F=Qe(r)||null));const C=b.some(u=>u.uid===J)?J:"",B=$e?"":C||k,E=c?di(e,b,B,r):null,A=!!(C||k),D=A||c?"":String(T("dock:chrome-kind")||""),N=y&&D==="main"&&T("dock:on-empty-page")===!0,M=N||D==="template"?"":D;o.layoutFile=M==="main",M!=="main"&&(Ke="");const O=M==="main"?po(r,"main"):null;O&&($t(O.path),Ke!==_&&K.add(O.path));const se=M==="header"||M==="footer"?Nt(r,u=>i.slice(u.from,u.openTo).includes(`data-sve-chrome="${M}"`))||po(r,M):null;se&&$t(se.path);const j=N||!(M==="main"?!!O:M==="header"||M==="footer"?!!se:!0)?[]:E?Qt(E.tree,o.query?new Set:E.folds):Qt(r,o.query?new Set:Xo(r));!i.trim()&&!qo(t)?o.emptyText=h(e,"html_tree_need_dock"):o.emptyText=h(e,"html_tree_empty"),o.slotText=h(e,"antlers_drop_here"),o.dataTitle=h(e,"data_vars_title"),o.pageTitle=h(e,"component_props_page"),o.renameTitle=h(e,"html_tree_rename"),o.tagTitle=h(e,"tw_tag"),o.hideTitle=h(e,"html_tree_hide"),o.showTitle=h(e,"html_tree_show"),o.duplicateTitle=h(e,"html_tree_duplicate"),o.deleteTitle=h(e,"html_tree_delete"),o.videoHoldTitle=h(e,"html_tree_video_hold"),o.videoPlayTitle=h(e,"html_tree_video_play"),o.lockedTitle=h(e,"html_tree_locked"),o.searchEmpty=h(e,"html_tree_search_empty"),o.canEdit=!T("dock:is-locked"),o.look=Jt(e),o.onQuery=()=>I(e),co(e),o.inComponent=c,o.onContextRow=u=>{if(!E||u===E.hostId)return;const w=j.find(H=>H.id===u)?.ctxLevel??E.levels-1;T("dock:exit-component",E.levels-w),I(e)},o.onSelect=u=>{const w=j.find(H=>H.id===u);w&&Co(e,w.path)||tt(e,u,j)},o.onTwist=u=>{const w=j.find(H=>H.id===u)?.path;w&&(K.has(w)?K.delete(w):K.add(w),I(e))},o.onTagChange=(u,w)=>{const H=o.rows.find(oe=>oe.id===w);H&&!Bt()&&Jn(e,u.currentTarget,H)},o.onRename=u=>vi(e,u),o.onRenameCommit=()=>vo(e,!0),o.onRenameCancel=()=>vo(e,!1),o.onHide=u=>ki(e,u),o.onVideoHold=u=>yi(e,u),o.onDuplicate=u=>bi(e,u),o.onDelete=u=>Ti(e,u),o.onPointerDown=(u,w)=>Li(e,u,w),o.onSectionPointerDown=(u,w)=>Hi(e,u,w),o.onContext=(u,w)=>Ci(e,u,w),o.onInspectCommit=u=>Fi(e,u),o.onPropValue=(u,w,H)=>ko(e,u,w,H),o.onPropPage=(u,w)=>Or(e,u,H=>ko(e,w,H,!1)),o.onLoopKind=u=>Bi(e,u),o.onAddBranch=u=>Ni(e,u),o.onLoopSortField=u=>{const w=et(),H=String(u||"").trim();if(!w)return;const oe=he?.id===w.id?he.dir:"",ne=w.sortDir||oe||"asc";he=null,ve(e,(Pe,_e)=>Ie(Pe,_e,{sortField:H,sortDir:ne}))},o.onLoopSortDir=u=>{const w=et(),H=String(u||"");if(w){if((H==="asc"||H==="desc")&&!w.sortField){he={id:w.id,dir:H},Lt(e,w);return}he=null,ve(e,(oe,ne)=>Ie(oe,ne,{sortDir:H,sortField:H==="asc"||H==="desc"?ne.sortField:""}))}},o.onLoopLimit=u=>ve(e,(w,H)=>Ie(w,H,{limit:String(u||"").replace(/\D/g,"")})),o.onPropHost=u=>u?z.mount(u):z.unmount(),o.onInspectData=(u,w)=>{T("dock:data-menu",{anchor:u,at:j.find(H=>H.id===F)?.from,onPick:H=>w(String(H?.var||"").trim())})};const Kt=j.find(u=>!u.kind)?.id,qt=c?"":ui(e,b,B),ue=B&&!c?b.find(u=>u.uid===B):null,on=To(e,String(T("dock:current-type")||""));let nn=0;const re=M==="header"||M==="footer"?M:"",be=se?se.id:"",te=O&&j.find(u=>u.id===O.id)||null,Gt=te&&j.find(u=>u.tag==="body"&&u.depth<te.depth)||null,ie=Gt||te||be&&j.find(u=>u.id===be)||null,zt=ie?pi(j,ie):-1;ie&&!j.slice(j.indexOf(ie),zt).some(u=>u.id===F)&&(F=ie.id);const Ut=o.layoutFile?hi(e):null;o.rows=j.map(u=>{const w=Ut&&u.kind==="component"&&Ut.get(u.src)||"",H=w?{svg:Se[w]}:$o(u.tag,u.kind,u.antlers),oe=u.tag==="video"&&!u.kind?nn++:-1,ne=!!E&&u.id===E.rootId,Pe=u.id===Kt&&qt?qt:ne?E.label:u.klass,_e=u.id===Kt;return{...u,tag:w||u.tag,frameCall:w,base:Pe,name:re&&u.id===be?h(e,`html_tree_frame_${re}`):u===te?h(e,"html_tree_frame_main"):_e&&ue?Pe:Br(Pe,u.path,p),current:u.id===F,letter:ne?"":H.letter||"",svg:re&&u.id===be?Se[re]:u===te?Se.main:_e&&ue?ue.svg:ne?E.svg:H.svg||"",frame:re&&u.id===be?re:u===te?"main":"",cat:re&&u.id===be?re:u===te?"main":ne?E.cat:w||xo(u.tag,u.kind,u.antlers),context:E?E.hostIds.has(u.id)?"host":u.id.startsWith("ctx")?"dim":"":"",sectionRoot:_e&&ue?ue.uid:"",fieldsIcon:!!(_e&&ue&&!ue.static),videoNth:oe,videoHeld:oe>=0&&on.has(oe)}}),Hn(e);const dt=[];for(const u of o.rows)dt.length=u.depth,u.guides=dt.slice(),dt[u.depth]=u.cat;if(ie){const u=j.indexOf(ie),w=ie.depth;o.rows=o.rows.slice(u,zt).map(H=>({...H,depth:H.depth-w,guides:H.guides.slice(w)})),te&&Ke!==_&&(Ke=_,e.setTimeout(()=>tt(e,te.id,j),0))}o.sections=y&&(A||M||N)?b.map(u=>{const w=!!B&&u.uid===B;return{...u,current:w,ready:w&&(!C||!!G),row:{id:`sec:${u.uid}`,section:u.uid,tag:u.tag,name:u.label,kind:"",svg:u.svg,cat:u.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:w,hidden:!u.enabled}}}):[],o.frame=ho(e,b,A,c,M,!1,!!Gt),o.frameEmptyText=h(e,"html_tree_frame_no_sections"),uo(e,M),o.onSection=u=>{ge||(Ct(e),lt(e,t,b,u,B))},o.onRefresh=()=>I(e),Lt(e,o.rows.find(u=>u.id===F)),qe(n,ao),mo(e,r)}function uo(e,t){o.frameOpenTitle=h(e,"html_tree_frame_open"),o.frameMainTitle=h(e,"html_tree_frame_main_open"),o.frameTemplateTitle=h(e,"html_tree_frame_template_open"),o.frameFieldsTitle=h(e,"html_tree_frame_fields"),o.onFrame=a=>{t===a?fi(e,a):fo(e,a)},o.onFrameEnter=a=>fo(e,a),o.onFrameFields=a=>Gn(e,In(e,a),h(e,`html_tree_frame_${a}`)),o.onFrameTwist=()=>{o.mainShut=!o.mainShut}}function ho(e,t,a,n,s,i=!1,r=!1){if(!s&&!i||r)return null;const d=g=>({id:`frame:${g}`,frame:g,synthetic:!0,tag:g,name:h(e,`html_tree_frame_${g}`),kind:"",svg:Se[g]||"",cat:g,letter:"",depth:0,hasChildren:g==="main"&&(t.length>0||s==="template"),shut:g!=="main",current:!1,hidden:!1}),p={kind:s,header:d("header"),main:d("main"),footer:d("footer"),template:null},y=s&&s!=="template"?String(T("dock:collection-view")||""):"";return y&&(p.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:st(e,y)?.display||Re(y.replace(/^view:/,"")),kind:"",svg:Se.section,cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),p}function po(e,t){return Nt(e,a=>a.tag===t)}function Nt(e,t){for(const a of e||[]){if(!a.kind&&t(a))return a;const n=Nt(a.children,t);if(n)return n}return null}function hi(e){const t=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},a=new Map;for(const n of["header","footer"]){const s=ea(t[n]?.type);s&&a.set(s,n)}return a}function pi(e,t){let a=e.indexOf(t)+1;for(;a<e.length&&e[a].depth>t.depth;)a+=1;return a}function fi(e,t){const a=ot(e);(t==="main"||t==="template"?a?.querySelector("main"):a?.querySelector(`[data-sve-chrome="${t}"]`))?.scrollIntoView({behavior:"smooth",block:"start"})}function Ct(e){const t=String(T("dock:chrome-open",e.document)||"");return t!=="header"&&t!=="footer"?!1:(Mn(e),ce({source:ee,type:Q.SVE_FORCE_EXIT_CHROME},e),!0)}function mi(e){e.clearTimeout(Ce),J="",G="",K.clear(),F=null,$e=!1,ae(),Ve()}function fo(e,t){if(e.document,String(T("dock:chrome-kind")||"")===t)return;if(mi(e),t==="main"){Ct(e),T("dock:open-file",zn);return}if(t==="template"){const i=String(T("dock:collection-view")||"");i&&(Ct(e),T("dock:open-file",i));return}if(t!=="header"&&t!=="footer")return;const a=ot(e)?.querySelector(`[data-sve-chrome="${t}"]`);a?(a.scrollIntoView({block:"nearest"}),a.dispatchEvent(new a.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:ee,type:Q.OPEN_CHROME,kind:t},e.location.origin);const n=Date.now(),s=async()=>{if(String(T("dock:chrome-kind")||"")!==t){Date.now()-n<3e4&&e.setTimeout(s,250);return}await(T("dock:load-settled")||null),tn(e)};e.setTimeout(s,250)}function mo(e,t){W(e.document)&&Yo(e,t)}function Yo(e,t){const a=t[0],n=!!T("dock:component-src"),s=n?"":T("dock:current-uid")||"";ce({source:ee,type:Q.SVE_HTML_PICK,on:!0,uid:s,uids:s?It(s,e.document):[],all:n,tag:a?.tag||"",klass:a?.klass||"",nodes:fa(t)},e)}function $t(e){if(!e)return;const t=(a,n)=>{for(const s of a||[]){if(s.path===e)return!0;if(t(s.children,n+1))return n===0?K.delete(s.path):K.add(s.path),!0}return!1};t(Fe,0)}function vi(e,t){if(ge)return;const a=o.rows.find(n=>n.id===t);!a||a.kind||(F=t,o.rows.forEach(n=>{n.current=n.id===t}),o.editingId=t,o.draft=a.name,e.setTimeout(()=>{const n=W(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function vo(e,t){const a=o.editingId;if(!a)return;const n=o.rows.find(s=>s.id===a);o.editingId=null,t&&n&&(n.sectionRoot?gi(e,n.sectionRoot,o.draft):Nr(T("dock:current-type")||"",n.path,o.draft,n.base||n.klass)),o.draft="",I(e)}function gi(e,t,a){const n=je(e)||"page_sections",s=String(a||"").replace(/\s+/g," ").trim();for(const i of nt(e.document)||[]){const r=at(i.values),d=r&&typeof r=="object"?r[n]:null;if(!Array.isArray(d))continue;const p=d.findIndex(b=>b&&typeof b=="object"&&[b._visual_id,b.id,b._id].includes(t));if(p===-1)continue;const y=Go(e,d[p])||d[p].type,g=st(e,y)?.display||Re(y)||y,c=JSON.parse(JSON.stringify(d));return c[p]={...c[p]},!s||s===g?delete c[p]._sve_label:c[p]._sve_label=s,i.setFieldValue(n,c),!0}return!1}function yi(e,t){const a=o.rows.find(d=>d.id===t);if(!a||!(a.videoNth>=0))return;const n=String(T("dock:current-type")||""),s=To(e,n),i=!s.has(a.videoNth);i?s.add(a.videoNth):s.delete(a.videoNth);const r=String(T("dock:current-uid")||"");An(e,n,s),ce({source:ee,type:Q.SVE_VIDEO_HOLD,uid:r,uids:r?It(r,e.document):[],nth:a.videoNth,on:i},e),I(e)}function ki(e,t){jt(e,t,ua)}function bi(e,t){const a=o.rows.find(n=>n.id===t)?.sectionRoot;if(a){e.postMessage({source:ee,type:Q.DUPLICATE_ROW,uid:a},e.location.origin);return}jt(e,t,ha)}function Wo(e,t){Bn(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const a=e.document;Vn({uid:t},a,e)})}function _i(e,t,a){J===a&&(e.clearTimeout(Ce),J="",G=""),F=null,$e=!1,_t="";const n=it(e,t),s=n.find(i=>i.uid!==a)||n[0];s?lt(e,t,n,s.uid,""):(G="",o.rows=[],o.sections=[],o.frame=null,o.pageBuilder=!0,I(e)),e.setTimeout(()=>{W(e.document)&&I(e)},0)}So("row:removed",({uid:e,parentPath:t,doc:a,win:n})=>{t!==je(n)||!W(n.document)||_i(n,a,e)});function Ti(e,t){const a=o.sections?.find(s=>s.row?.id===t),n=a?a.row?.section||a.uid:o.rows.find(s=>s.id===t)?.sectionRoot;if(n){Wo(e,n);return}o.rows.find(s=>s.id===t)?.frameCall||jt(e,t,pa)}function jt(e,t,a){if(T("dock:is-locked"))return;const n=U(),s=o.rows.find(r=>r.id===t);if(!s)return;const i=a(n,s);i!==n&&Le(i)}function ae(){me?.dismiss(),me=null}const xi='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',Si='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>';function Zo(e,t){const a=o.sections?.find(p=>p.uid===t),n=a?.type||"";if(!n||!Io(e))return[];const s=a.label||n,i=Ba(e,n),r=()=>e.Statamic?.$toast?.error(h(e,"section_update_failed")),d=[{label:h(e,"static_section_insertable"),icon:i?Si:xi,onPick:()=>{ae(),to(e,{handle:n,hidden:!i}).then(()=>{e.Statamic?.$toast?.success(h(e,i?"section_shown_to_editors":"section_hidden_from_editors",{name:s})),yt(e)}).catch(r)}}];return a.static&&d.push({label:h(e,"section_add_fields"),onPick:()=>{ae(),to(e,{handle:n,fields:!0}).then(()=>{e.Statamic?.$toast?.success(h(e,"section_fields_added",{name:s})),yt(e),I(e),wo(e,n)}).catch(r)}}),d}function wi(e,t,a){const n=a.row?.section||a.uid;n&&(me=ke(e.document,Mt,{items:[...Zo(e,n),{label:h(e,"html_tree_remove_section"),danger:!0,onPick:()=>{ae(),Wo(e,n)}}],x:t.clientX,y:t.clientY,onClose:()=>{me=null}}))}function Ci(e,t,a){ae();const n=o.sections?.find(d=>d.row?.id===a);if(n){wi(e,t,n);return}const s=o.rows.find(d=>d.id===a);if(!s)return;tt(e,a,o.rows);const i={x:t.clientX,y:t.clientY},r=d=>{d.length&&(me?.dismiss(),me=ke(e.document,Mt,{items:d,x:i.x,y:i.y,onClose:()=>{me=null}}))};if(s.kind==="component"){$i(e,s,r);return}s.kind!=="slot"&&o.canEdit&&r([...s.sectionRoot?Zo(e,s.sectionRoot):[],{label:h(e,"component_make"),onPick:()=>{ae(),Wr(e,s,{onDone:()=>I(e),onError:d=>{e.alert(d?.status===409?h(e,"component_exists"):h(e,"component_failed"))}})}}])}const go=(e,t)=>{ae(),T("dock:open-template",t)};function $i(e,t,a){if(!oa(t.src)){a([{label:h(e,"component_open_named",{name:t.name||t.src}),onPick:()=>go(e,`view:partials/${t.src}`)}]);return}a([{label:h(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const s=Array.isArray(n.items)?n.items:[];a(s.length?s.map(i=>({label:h(e,"component_open_named",{name:i.label}),onPick:()=>go(e,i.type)})):[{label:h(e,"component_none"),onPick:null}])}).catch(()=>a([{label:h(e,"component_none"),onPick:null}]))}function Li(e,t,a){if(t.button!==0||T("dock:is-locked")||o.editingId||t.target?.closest?.("button, input"))return;Ve(),fe=a,Ae={x:t.clientX,y:t.clientY},Ye=t.currentTarget,We=t.pointerId;const n=i=>Pi(e,i),s=i=>Ei(e,i);xt=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",s,!0),e.document.removeEventListener("pointercancel",s,!0),xt=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",s,!0),e.document.addEventListener("pointercancel",s,!0)}function Pi(e,t){if(!fe||!Ae)return;const a=t.clientX-Ae.x,n=t.clientY-Ae.y;if(!o.dragging&&a*a+n*n<25)return;if(!o.dragging){o.dragging=!0;try{Ye?.setPointerCapture?.(We)}catch{}}t.preventDefault();const s=e.document.elementFromPoint(t.clientX,t.clientY),i=s?.closest?.("[data-sve-ht-slot]");if(i){const c=i.getAttribute("data-sve-ht-id");if(c&&c!==fe){o.dropId=c,o.dropPlace="inside";return}}const r=s?.closest?.("[data-sve-ht-row]"),d=r?.getAttribute("data-sve-ht-id");if(!d||d===fe){o.dropId=null,o.dropPlace=null;return}const p=o.rows.find(c=>c.id===d),y=o.rows.find(c=>c.id===fe);if(!p||p.context||y&&p.path.startsWith(`${y.path}/`)){o.dropId=null,o.dropPlace=null;return}const g=r.getBoundingClientRect();o.dropId=d,o.dropPlace=da(t.clientY-g.top,g.height,!Po(p.tag)&&!Lo(p))}function Ei(e,t){const a=fe,n=o.dropId,s=o.dropPlace||"after",i=o.dragging;if(Ve(),i&&(ge=!0,e.setTimeout(()=>{ge=!1},0)),!i||T("dock:is-locked")||!a||!n||a===n)return;t?.preventDefault?.();const r=U(),d=ca(r,Fe,a,n,s);d!==r&&Le(d)}function Ve(){try{Ye?.releasePointerCapture?.(We)}catch{}xt?.(),fe=null,Ae=null,Ye=null,We=null,o.dragging=!1,o.dropId=null,o.dropPlace=null}function Hi(e,t,a){if(t.button!==0||!a||o.editingId||t.target?.closest?.("button, input"))return;Jo(),Be=a,Me={x:t.clientX,y:t.clientY},Ze=t.currentTarget,Je=t.pointerId;const n=i=>Ii(e,i),s=i=>Ai(e,i);St=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",s,!0),e.document.removeEventListener("pointercancel",s,!0),St=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",s,!0),e.document.addEventListener("pointercancel",s,!0)}function Ii(e,t){if(!Be||!Me)return;const a=t.clientX-Me.x,n=t.clientY-Me.y;if(!o.dragging&&a*a+n*n<25)return;if(!o.dragging){o.dragging=!0;try{Ze?.setPointerCapture?.(Je)}catch{}}t.preventDefault();const i=e.document.elementFromPoint(t.clientX,t.clientY)?.closest?.("[data-sve-ht-sec-uid]"),r=i?.getAttribute("data-sve-ht-sec-uid")||"";if(!r||r===Be){o.sectionDrop=null;return}const d=i.getBoundingClientRect();o.sectionDrop={uid:r,place:t.clientY-d.top<d.height/2?"before":"after"}}function Ai(e,t){const a=Be,n=o.sectionDrop,s=o.dragging;Jo(),s&&(ge=!0,e.setTimeout(()=>{ge=!1},0)),!(!s||!a||!n?.uid||n.uid===a)&&(t?.preventDefault?.(),Mi(e,a,n.uid,n.place))}function Jo(){try{Ze?.releasePointerCapture?.(Je)}catch{}St?.(),Be=null,Me=null,Ze=null,Je=null,o.dragging=!1,o.sectionDrop=null}function Mi(e,t,a,n){const s=je(e)||"page_sections";for(const i of nt(e.document)||[]){const r=at(i.values),d=r&&typeof r=="object"?r[s]:null;if(!Array.isArray(d))continue;const p=b=>d.findIndex(k=>k&&typeof k=="object"&&[k._visual_id,k.id,k._id].includes(b)),y=p(t),g=p(a);if(y===-1||g===-1||y===g)return!1;let c=n==="before"?g:g+1;return y<c&&(c-=1),c===y?!1:(e.postMessage({source:ee,type:Q.MOVE,uid:t,toIndex:c},e.location.origin),e.setTimeout(()=>I(e),60),!0)}return!1}function Qo(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function Lt(e,t){if(t?.kind==="component"){Ri(e,t);return}if(Y.callOpen&&(Y.callOpen=!1,Y.callStore=null,z.forget(),Rt(e)),t?.kind!=="antlers"){o.inspect=null;return}const a=t.id;if(t.tag==="else"){o.inspect={key:a,title:h(e,"antlers_condition"),mode:"note",note:h(e,"antlers_else_note")};return}if(t.antlers==="loop"){const n=t.loopKind==="collection",s=he?.id===t.id?he.dir:"",i=t.sortDir||s;o.inspect={key:a,title:h(e,"antlers_loop"),mode:"loop",loopKind:n?"collection":"field",kinds:[{id:"field",label:h(e,"antlers_loop_field")},{id:"collection",label:h(e,"antlers_loop_collection")}],collections:Qo(e),value:t.expr||"",placeholder:h(e,n?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:h(e,"antlers_sort"),dir:i,needsField:i==="asc"||i==="desc",field:t.sortField||"",pickable:!n,placeholder:h(e,n?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:h(e,"antlers_sort_none")},{id:"asc",label:h(e,"antlers_sort_asc")},{id:"desc",label:h(e,"antlers_sort_desc")},{id:"random",label:h(e,"antlers_sort_random")}]},limit:{title:h(e,"antlers_limit"),value:t.limit||"",placeholder:h(e,"antlers_limit_placeholder")},branches:[]};return}o.inspect={key:a,title:h(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:h(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:h(e,"antlers_add_elseif")},{id:"else",label:h(e,"antlers_add_else")}]}}function Ri(e,t){if(!na(e)){o.inspect=null;return}if(!t.src)return;const a=t.id;if(o.inspect={key:a,title:h(e,"component_props_values"),mode:"note",note:h(e,"code_dock_loading")},aa()){const n={},s={},i=new Map;for(const[r,d]of sa(U().slice(t.from,t.to))){const p=ra(r);p&&(r!==p||!i.has(p))&&i.set(p,d)}for(const[r,d]of i)d.bound?s[r]=d.value:n[r]=d.value;lo!==a&&(lo=a,Oe.clear());for(const r of Oe)r in s||(s[r]="");o.inspect=null,Y.callOpen=!0,Y.title=Y.title||h(e,"component_props"),Y.callTitle=t.klass||t.name||t.src,Y.callStore=z.ui,z.ui.canBind=!0,z.ui.dataTitle=h(e,"data_vars_title"),z.ui.exprPlaceholder=h(e,"component_props_expr"),z.ui.onToggleBind=(r,d)=>Oi(e,r,d),z.ui.onExpr=(r,d)=>yo(e,r,d),z.ui.onPickData=(r,d)=>T("dock:data-menu",{anchor:d,at:t.from,onPick:p=>yo(e,r,String(p?.var||"").trim())}),z.load(e,{key:`${t.src}::${a}`,src:t.src,params:n,bindings:s,readOnly:T("dock:is-locked")===!0}),z.watch(e,{src:t.src,write:r=>Di(e,r,s)}),Rt(e);return}ia(e,t.src).then(n=>{if(o.inspect?.key===a){if(!n.length){o.inspect={key:a,title:h(e,"component_props_values"),mode:"note",note:h(e,"component_props_values_none")};return}o.inspect={key:a,title:h(e,"component_props_values"),mode:"props",inheritLabel:h(e,"component_props_inherit"),rows:la(n,U().slice(t.from,t.to))}}})}function Di(e,t,a={}){const n=o.rows.find(r=>r.id===F);if(n?.kind!=="component"||T("dock:is-locked"))return;let s=U(),i=n.to;for(const[r,d]of Object.entries(t||{})){if(r in a)continue;const p=s.length,y=Dt(s,{from:n.from,to:i},r,d);y!==s&&(i+=y.length-p,s=y)}s!==U()&&(Le(s,{save:!0}),I(e))}function Oi(e,t,a){a?Oe.add(t):Oe.delete(t),en(e,t,"",a),I(e)}function yo(e,t,a){Oe.add(t),en(e,t,a,!0),I(e)}function en(e,t,a,n){const s=o.rows.find(d=>d.id===F);if(s?.kind!=="component"||T("dock:is-locked"))return;const i=U(),r=Dt(i,s,t,a,{bound:n});r!==i&&Le(r,{save:!0})}function et(){const e=o.rows.find(t=>t.id===F);return e?.kind==="antlers"&&!T("dock:is-locked")?e:null}function ve(e,t){const a=et();if(!a)return;const n=U(),s=t(n,a);s!==n&&(Le(s),I(e))}function ko(e,t,a,n){const s=o.rows.find(d=>d.id===F);if(s?.kind!=="component"||T("dock:is-locked"))return;const i=U(),r=Dt(i,s,t,a,{bound:n});r!==i&&(Le(r,{save:!0}),I(e))}function Fi(e,t){ve(e,(a,n)=>n.antlers==="loop"?bt(a,n,n.loopKind==="collection"?"collection":"field",t):Zr(a,n,t))}function Bi(e,t){const a=et();if(!a||a.antlers!=="loop")return;const n=a.loopKind==="collection"?"collection":"field";if(t!==n){if(t==="collection"){const s=Qo(e)[0]?.handle;if(!s)return;ve(e,(i,r)=>bt(i,r,"collection",s));return}ve(e,(s,i)=>bt(s,i,"field",i.handle||"items"))}}function Ni(e,t){ve(e,(a,n)=>oi(a,n,t))}function ji(e,t){if(!e||!t||Lo(t)||Po(t.tag))return null;const a=ta(e,t);if(a<t.openTo)return null;const n=e.lastIndexOf(`
`,a-1)+1;return e.slice(n,a).trim()===""&&n>t.openTo?n-1:a}function tt(e,t,a){if(ge)return;const n=(a||o.rows).find(s=>s.id===t);n&&(F=t,o.rows.forEach(s=>{s.current=s.id===t}),Lt(e,n),!Bt()&&(T("dock:reveal-html",{from:n.from,to:n.to,caret:ji(U(),n)}),T("dock:tw-follow"),ce({source:ee,type:Q.SVE_HTML_PICK_FOCUS,path:n.path},e)))}function Vi(e,t){if(!t)return"";const a=[],n=(s,i)=>{for(const r of s||[]){const d=i||r.path===e;r.kind==="component"&&r.src===t&&a.push({path:r.path,inside:d}),n(r.children,d)}};return n(Fe,!1),(a.find(s=>s.inside)||a[0])?.path||""}function Ki(e,t){if(!t||!W(e.document))return;$e=!1,$t(t),I(e);const a=o.rows.find(n=>n.path===t);a&&(tt(e,a.id,o.rows),e.setTimeout(()=>{W(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function Pt(e){if(Ue)return;const t=()=>{o.editingId||o.dragging||(e.clearTimeout(Xe),Xe=e.setTimeout(()=>{W(e.document)&&I(e)},80))},a=()=>{if(t(),T("dock:on-empty-page")===!0){const n=it(e,e.document);n[0]&&lt(e,e.document,n,n[0].uid,"")}};Ue=So("dock:html-changed",t),e.document.addEventListener("sve-page-structure",a),Tt=()=>{e.document.removeEventListener("sve-page-structure",a)}}function qi(e){Ue?.(),Ue=null,Tt?.(),Tt=null,e?.clearTimeout?.(Xe),Xe=0}function Vt(e){const t=W(e.document);if(ce({source:ee,type:Q.SVE_HTML_PICK,on:!1},e),qi(e),z.forget(),Y.callOpen=!1,Y.callStore=null,Rt(e),Ve(),ae(),Wn(e),F=null,o.inspect=null,o.editingId=null,o.draft="",o.sections=[],o.pageBuilder=!1,o.layoutFile=!1,J="",e?.clearTimeout?.(Ce),!t){gt(e);return}t.remove(),Ht.headerTab==="html_tree"&&Nn(e,null),Sn(e),bo(e),_o(e),gt(e)}function el(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=Ge,qe(t,Mo,{title:h(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>Vt(e)))}function tl(e){Pt(e),I(e)}function tn(e){const t=e.document;if(!Cn(e,"html_tree"))return;if(W(t)){Pt(e),I(e);return}if(!qo(t))return;$e=!0,K.clear(),$n(e,[Ge]);const a=t.createElement("div");a.id=Ge,a.style.cssText=Ln,qe(a,Mo,{title:h(e,"html_tree")}),a.querySelector("[data-sve-close]")?.addEventListener("click",()=>Vt(e)),Pn(e,a),bo(e),_o(e),gt(e),Pt(e),I(e)}function ol(e){if(W(e.document)){Vt(e);return}tn(e)}At("html-tree:open-section",e=>{const t=window,a=t.document,n=it(t,a),s=n.find(i=>i.uid===e||i.ids.includes(e));return s?(lt(t,a,n,s.uid,""),{uid:s.uid,ids:s.ids}):null});At("html-tree:from-preview",({path:e,src:t}={})=>{Co(window,e)||Ki(window,Vi(e,t)||e)});At("html-tree:arm-pick",e=>{const t=window;return e?(Yo(t,rt(U())),!0):(W(t.document)||ce({source:ee,type:Q.SVE_HTML_PICK,on:!1},t),!0)});function nl(){de.clear(),we.clear(),ye.length=0}export{ni as HTML_TREE_STYLE_ID,Qi as armHtmlTreePrefetch,nl as clearHtmlTreeTemplates,ae as closeHtmlTreeMenu,Vt as closeHtmlTreePanel,ai as ensureHtmlTreeStyles,el as fillHtmlTreePane,F as htmlTreeActiveId,W as htmlTreePanel,Xe as htmlTreeTimer,Ue as htmlTreeUnhook,tn as openHtmlTreePanel,I as renderHtmlTree,tl as showHtmlTreePane,qi as stopWatchHtmlTreeDock,ol as toggleHtmlTreePanel,Pt as watchHtmlTreeDock};
