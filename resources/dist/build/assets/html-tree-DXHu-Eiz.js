const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-AWaJHJyk.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{_ as Ke,I as V,J as pn,K as Ae,o as p,k as v,l as L,G as C,m as P,F as O,L as fe,n as N,b3 as fn,x as $,O as xt,b4 as mn,a as T,t as u,A as be,C as vn,b5 as gn,b6 as Co,z as Dt,b7 as no,b8 as ao,b9 as yn,ba as kn,bb as bn,bc as _n,bd as it,D as de,au as Tn,be as o,u as i,w as xn,v as Sn,M as ie,bf as wn,B as Cn,bg as X,bh as $n,bi as Ln,H as Me,j as he,bj as Pn,bk as En,bl as so,N as Hn,Q as In,s as Ft,av as St,ar as An,aP as $o,aQ as Lo,i as Mn,am as ro,a1 as Re,X as Rn,aO as On,as as Dn,at as Fn,ad as Bn,bm as Po,bn as Nn,bo as io,bp as Eo,a0 as Ho,bq as jn,E as Io,a9 as lt,T as Bt,U as Nt,az as dt,aA as Be,S as jt,br as Vn,bs as Kn,bt as Ao,bu as qn,bv as Gn,bw as Un,bx as zn,by as Xn,aS as Yn,aT as Wn,ay as Zn,bz as Jn,a$ as Qn,al as Vt,aL as ea,aG as ta}from"./addon-t0pWEUPt.js";import{M as ee,S as te}from"./protocol-Brvy2KuB.js";import{canEditFields as oa,currentSetHandle as na,openFieldsetOverlay as Mo,openGlobalFieldsOverlay as aa}from"./section-fields-B2J7X-6T.js";import{H as Xe,ad as sa}from"./ai-text-icon-CaHMo9Tt.js";import{F as Y,G as ra,I as Kt,J as ia,t as la,K as qt,x as da,B as ca,d as ct,m as lo,L as Ro,s as ua,M as Oo,H as Se,N as ha,O as Gt,c as pa,Q as Do,R as Fo,S as fa,h as ma,a as va,T as ga,U as ya,V as ka,W as ba,X as _a,Y as Ta,Z as xa,$ as Sa,a0 as wa,a1 as Ca}from"./tw-classes-dOaeoLLG.js";import{b as $a}from"./html-pick-align-CLq5l-p4.js";import"./FieldsetOverlay-4-ROeHsX.js";const La={class:"sve-dialog__title"},Pa={for:"sve-new-section-group"},Ea={class:"sve-dialog__row"},Ha=["disabled"],Ia=["value"],Aa=["title","aria-label"],Ma={key:0,class:"sve-dialog__add-group"},Ra={for:"sve-new-section-group-name"},Oa={class:"sve-dialog__row"},Da=["placeholder","disabled"],Fa=["disabled"],Ba=["disabled"],Na={for:"sve-new-section-name"},ja=["placeholder"],Va={key:1,class:"sve-dialog__toggle"},Ka={key:2,class:"sve-dialog__note"},qa={class:"sve-dialog__actions"},Ga=["disabled"],Ua=["disabled"],za={__name:"NewSectionPrompt",props:{heading:{type:String,required:!0},groupLabel:{type:String,required:!0},nameLabel:{type:String,required:!0},placeholder:{type:String,default:""},note:{type:String,default:""},groups:{type:Array,required:!0},toggleLabel:{type:String,default:""},toggleOn:{type:Boolean,default:!0},cancelLabel:{type:String,required:!0},saveLabel:{type:String,required:!0},onOk:{type:Function,required:!0},onClose:{type:Function,required:!0},addGroupLabel:{type:String,default:""},addGroupNameLabel:{type:String,default:""},addGroupPlaceholder:{type:String,default:""},onAddGroup:{type:Function,default:null}},setup(e){const t=e,a=V(""),n=V([...t.groups]),s=V(t.groups[0]?.key??""),l=V(!1),r=V(""),d=V(null),f=V(!1);function k(){l.value=!0,r.value="",Ae(()=>d.value?.focus())}function g(){l.value=!1,r.value="",Ae(()=>b.value?.focus())}async function h(){const E=r.value.trim();if(!E||f.value||!t.onAddGroup){d.value?.focus();return}f.value=!0;const M=await t.onAddGroup(E);if(f.value=!1,!M?.key){d.value?.focus();return}n.value.some(D=>D.key===M.key)||n.value.push(M),s.value=M.key,l.value=!1,r.value="",Ae(()=>b.value?.focus())}function y(E){E.key==="Enter"?(E.preventDefault(),h()):E.key==="Escape"&&(E.stopPropagation(),g())}const x=V(t.toggleOn),b=V(null),R=V(!1);pn(()=>Ae(()=>b.value?.focus()));function _(){const E=a.value.trim();if(!E||n.value.length&&!s.value||R.value){b.value?.focus();return}R.value=!0,t.onOk(E,s.value,x.value)}function m(E){E.target===E.currentTarget&&t.onClose()}function S(E){E.key==="Enter"?_():E.key==="Escape"&&t.onClose()}return(E,M)=>(p(),v("div",{class:"sve-dialog-overlay",onClick:m},[L("div",{class:"sve-dialog",onClick:M[5]||(M[5]=C(()=>{},["stop"]))},[L("div",La,P(e.heading),1),n.value.length?(p(),v(O,{key:0},[L("label",Pa,P(e.groupLabel),1),L("div",Ea,[fe(L("select",{id:"sve-new-section-group","onUpdate:modelValue":M[0]||(M[0]=D=>s.value=D),disabled:l.value,onKeydown:S},[(p(!0),v(O,null,N(n.value,D=>(p(),v("option",{key:D.key,value:D.key},P(D.display),9,Ia))),128))],40,Ha),[[fn,s.value]]),e.onAddGroup&&!l.value?(p(),v("button",{key:0,type:"button",class:"is-add",title:e.addGroupLabel,"aria-label":e.addGroupLabel,"data-sve-new-group":"",onClick:k},[...M[6]||(M[6]=[L("span",{"aria-hidden":"true"},"+",-1)])],8,Aa)):$("",!0)]),l.value?(p(),v("div",Ma,[L("label",Ra,P(e.addGroupNameLabel||e.addGroupLabel),1),L("div",Oa,[fe(L("input",{id:"sve-new-section-group-name",ref_key:"groupInput",ref:d,"onUpdate:modelValue":M[1]||(M[1]=D=>r.value=D),type:"text",placeholder:e.addGroupPlaceholder,disabled:f.value,"data-sve-new-group-name":"",onKeydown:y},null,40,Da),[[xt,r.value]]),L("button",{type:"button",class:"is-primary is-small",disabled:f.value,"data-sve-new-group-create":"",onClick:h},P(e.saveLabel),9,Fa),L("button",{type:"button",class:"is-cancel is-small",disabled:f.value,onClick:g},P(e.cancelLabel),9,Ba)])])):$("",!0)],64)):$("",!0),L("label",Na,P(e.nameLabel),1),fe(L("input",{id:"sve-new-section-name",ref_key:"input",ref:b,"onUpdate:modelValue":M[2]||(M[2]=D=>a.value=D),type:"text",placeholder:e.placeholder,onKeydown:S},null,40,ja),[[xt,a.value]]),e.toggleLabel?(p(),v("label",Va,[fe(L("input",{"onUpdate:modelValue":M[3]||(M[3]=D=>x.value=D),type:"checkbox",onKeydown:S},null,544),[[mn,x.value]]),L("span",null,P(e.toggleLabel),1)])):$("",!0),e.note?(p(),v("p",Ka,P(e.note),1)):$("",!0),L("div",qa,[L("button",{type:"button",class:"is-cancel",disabled:R.value,onClick:M[4]||(M[4]=(...D)=>e.onClose&&e.onClose(...D))},P(e.cancelLabel),9,Ga),L("button",{type:"button",class:"is-primary",disabled:R.value,onClick:_},P(e.saveLabel),9,Ua)])])]))}},Bo=Ke(za,[["__scopeId","data-v-6501522a"]]),Ut="/!/sve/section-types",co="static_sections";async function Xa(e){const t=await e.fetch(`${Ut}?${gn(e)}`,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!t.ok)throw new Error(`section-types ${t.status}`);const a=await t.json();if(Array.isArray(a.groups)&&a.groups.length)return a.groups.filter(s=>s&&s.handle&&s.handle!==co).map(s=>({key:s.handle,display:s.display||s.handle}));const n=new Map;for(const s of a.types||[])s?.group&&s.group!==co&&!n.has(s.group)&&n.set(s.group,s.group_display||s.group);return[...n].map(([s,l])=>({key:s,display:l}))}async function Ya(e,t){const a=await e.fetch(`${Ut}/groups`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Dt(e),"X-Requested-With":"XMLHttpRequest",Accept:"application/json"},body:JSON.stringify({display:t,...Co(e)})}),n=await a.json().catch(()=>({}));if(!a.ok||!n.group?.handle)throw new Error(n?.error==="bad_name"?"bad_name":`section-types/groups ${a.status}`);return e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale")),{key:n.group.handle,display:n.group.display||n.group.handle}}const Ne=new Map;function Wa(e){e?.handle&&Ne.set(e.handle,{static:!!e.static,hidden:!!e.hidden})}function Za(e,t){return t?Ne.has(t)?Ne.get(t).static:e.Statamic?.$config?.get?.("sveSetMeta")?.[t]?.static===!0:!1}function Ja(e,t){if(!t)return!1;if(Ne.has(t))return Ne.get(t).hidden;const a=e.Statamic?.$config?.get?.("sveSectionTypes");return Array.isArray(a)&&a.some(n=>n?.handle===t&&n.hidden===!0)}async function No(e,t,a){const n=await e.fetch(Ut,{method:t,headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Dt(e),Accept:"application/json"},credentials:"same-origin",body:JSON.stringify({...a,...Co(e)})}),s=await n.json().catch(()=>({}));if(!n.ok){const l=new Error(s.error||`section-types ${n.status}`);throw l.reason=s.error,l}return Wa(s.section),s}function Qa(e,{display:t,group:a="",static:n=!1,hidden:s=!1}){return No(e,"POST",{display:t,group:a,static:n,hidden:s})}function uo(e,{handle:t,hidden:a,fields:n=!1}){const s={handle:t,fields:n};return typeof a=="boolean"&&(s.hidden=a),No(e,"PATCH",s)}async function es(e,t,a=null,n=null){if(!t||typeof no!="function"||typeof ao!="function")return null;const s=await no(e,t);if(!s)return null;n&&Array.isArray(s.definitions)&&yn(t,{display:n.display||t,icon:n.icon||null,hide:n.hidden===!0,fields:s.definitions,group_display:n.group_display||n.group||""},n.group||"");const l=kn(),r=bn(e,"page",{handle:t},s?.defaults,l),d=_n(r,s?.new||{},s?.defaults);return ao(e,e.document,a,r,d)?r:null}const ho=700,ts=17;function os(e,t){const a=(t||[]).filter(Boolean);if(!a.length)return;let n=0;const s=()=>{n+=1;const l=it(e),r=l?a.some(d=>l.querySelector(`[data-sid="${CSS.escape(d)}"]`)):!0;r&&de({source:te,type:ee.SVE_ACTIVATE,ids:a},e),(r?!l&&n<6:n<ts)&&e.setTimeout(s,ho)};e.setTimeout(s,ho)}function jo(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function ns(e){return new Promise(t=>{let a=!1;const n=l=>{a||(a=!0,s.dismiss(),t(l==="static"||l==="fields"?l:null))},s=be(e.document,vn,{title:u(e,"section_new_kind"),body:u(e,"section_new_kind_note"),buttons:[{value:"cancel",label:u(e,"cancel"),variant:"ghost"},{value:"static",label:u(e,"section_new_static"),variant:"primary"},{value:"fields",label:u(e,"section_new_with_fields"),variant:"primary"}],onPick:n,onClose:()=>n(null)})})}const as=`<section class="[ ] py-800">
    
</section>
`;function ss(e){if(T("dock:is-locked")===!0)return e.Statamic?.$toast?.error(u(e,"code_dock_locked")),!1;const a=`${String(T("dock:html")||"").replace(/\s+$/,"")}

${as}`;return T("dock:set-html",a)!==!0?(e.Statamic?.$toast?.error(u(e,"section_new_failed")),!1):(T("dock:save-now"),e.Statamic?.$toast?.success(u(e,"section_new_template_done")),!0)}async function Vo(e,t,a,{afterUid:n,onDone:s,onError:l}){try{const r=await Qa(e,a);t.dismiss(),e.Statamic?.$toast?.success(u(e,"section_created",{name:r.section?.display||a.display})),wt(e);const d=r.section?.handle?{...r.section,group_display:(r.section_types||[]).find(k=>k?.handle===r.section.handle)?.group_display||""}:null,f=await es(e,r.section?.handle,n,d);!f&&r.section?.handle&&T("dock:open-template",r.section.handle),s?.({...r,uid:f?._visual_id||""})}catch(r){t.dismiss(),e.Statamic?.$toast?.error(u(e,r.reason==="bad_name"?"section_new_bad_name":"section_new_failed")),l?.(r)}}function wt(e){e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"))}function rs(e,{afterUid:t=null,onDone:a,onError:n,onClose:s}={}){const l=be(e.document,Bo,{heading:u(e,"static_section_new"),groupLabel:"",nameLabel:u(e,"section_new_name"),placeholder:u(e,"section_new_placeholder"),note:u(e,"static_section_note"),groups:[],toggleLabel:u(e,"static_section_insertable"),cancelLabel:u(e,"cancel"),saveLabel:u(e,"section_new_create"),onClose:s,onOk:(r,d,f)=>{Vo(e,l,{display:r,static:!0,hidden:!f},{afterUid:t,onDone:a,onError:n})}})}function is(e,{afterUid:t=null,onDone:a,onError:n,onClose:s}={}){(async()=>{let l=[];try{l=await Xa(e)}catch(d){n?.(d),e.Statamic?.$toast?.error(u(e,"section_new_failed"));return}if(!l.length){n?.(new Error("no groups")),e.Statamic?.$toast?.error(u(e,"section_new_failed"));return}const r=be(e.document,Bo,{heading:u(e,"section_new"),groupLabel:u(e,"section_new_group"),nameLabel:u(e,"section_new_name"),placeholder:u(e,"section_new_placeholder"),note:u(e,"section_new_note"),groups:l,addGroupLabel:u(e,"section_new_group_add"),addGroupNameLabel:u(e,"section_new_group_name"),addGroupPlaceholder:u(e,"section_new_group_placeholder"),onAddGroup:async d=>{try{const f=await Ya(e,d);return e.Statamic?.$toast?.success(u(e,"section_group_created",{name:f.display})),f}catch(f){return e.Statamic?.$toast?.error(u(e,f?.message==="bad_name"?"section_new_bad_name":"section_group_failed")),null}},cancelLabel:u(e,"cancel"),saveLabel:u(e,"section_new_create"),onClose:s,onOk:(d,f)=>{Vo(e,r,{display:d,group:f},{afterUid:t,onDone:a,onError:n})}})})()}const ls={key:0,class:"sve-ht-inspect"},ds={class:"sve-ht-inspect__head"},cs={key:0,class:"sve-ht-inspect__note"},us={key:2,class:"sve-ht-inspect__props"},hs={class:"sve-ht-inspect__proplabel"},ps={key:0},fs=["value","disabled","onChange"],ms={value:""},vs=["value"],gs=["value"],ys=["value","placeholder","onChange"],ks=["title","disabled","onClick"],bs=["title","disabled","onClick"],_s={key:0,class:"sve-ht-inspect__seg"},Ts=["data-active","disabled","onClick"],xs=["value","disabled"],Ss={key:0,value:""},ws=["value"],Cs={key:2,class:"sve-ht-inspect__box"},$s=["value","placeholder","disabled","onKeydown"],Ls=["title","disabled"],Ps={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Es=["value","disabled"],Hs=["value"],Is={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},As=["value","placeholder","disabled"],Ms=["title","disabled"],Rs={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Os=["value","placeholder","disabled"],Ds={key:4,class:"sve-ht-inspect__add"},Fs=["disabled","onClick"],ft='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',Bs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',Ns={__name:"HtmlTreeInspector",setup(e){const t=V(null);Tn(t,k=>o.onPropHost?.(k||null));const a=V(null),n=V(null);function s(k){o.onInspectCommit?.(k.target.value)}function l(k,g,h){!k||!g||(k.value=g,k.focus(),k.setSelectionRange(g.length,g.length),h(g))}function r(k,g){o.onInspectData?.(k.currentTarget,h=>o.onPropValue?.(g.handle,h,!0))}function d(k){o.onInspectData?.(k.currentTarget,g=>l(a.value,g,h=>o.onInspectCommit?.(h)))}function f(k){o.onInspectData?.(k.currentTarget,g=>l(n.value,g,h=>o.onLoopSortField?.(h)))}return(k,g)=>i(o).inspect?(p(),v("div",ls,[L("div",ds,P(i(o).inspect.title),1),i(o).inspect.mode==="note"?(p(),v("div",cs,P(i(o).inspect.note),1)):i(o).inspect.mode==="statamic"?(p(),v("div",{key:1,ref_key:"propHost",ref:t,class:"sve-ht-inspect__form"},null,512)):i(o).inspect.mode==="props"?(p(),v("div",us,[(p(!0),v(O,null,N(i(o).inspect.rows,h=>(p(),v("label",{key:h.handle,class:"sve-ht-inspect__prop"},[L("span",hs,[xn(P(h.label)+" ",1),h.bound?(p(),v("em",ps,":")):$("",!0)]),L("span",{class:Sn(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":h.type==="select"||h.type==="link"}])},[h.type==="select"&&!h.bound?(p(),v("select",{key:0,value:h.value,disabled:!i(o).canEdit,onChange:y=>i(o).onPropValue?.(h.handle,y.target.value,!1)},[L("option",ms,P(h.placeholder||i(o).inspect.inheritLabel),1),h.value&&!h.options.includes(h.value)?(p(),v("option",{key:0,value:h.value},P(h.value),9,vs)):$("",!0),(p(!0),v(O,null,N(h.options,y=>(p(),v("option",{key:y,value:y},P(y),9,gs))),128))],40,fs)):(p(),v("input",{key:1,type:"text",value:h.value,placeholder:h.placeholder||i(o).inspect.inheritLabel,onChange:y=>i(o).onPropValue?.(h.handle,y.target.value,h.bound)},null,40,ys)),h.type==="link"?(p(),v("button",{key:2,type:"button","data-sve-ht-data":"",title:i(o).pageTitle,disabled:!i(o).canEdit,onClick:y=>i(o).onPropPage?.(y.currentTarget,h.handle),innerHTML:Bs},null,8,ks)):$("",!0),L("button",{type:"button","data-sve-ht-data":"",title:i(o).dataTitle,disabled:!i(o).canEdit,onClick:y=>r(y,h),innerHTML:ft},null,8,bs)],2)]))),128))])):(p(),v(O,{key:3},[i(o).inspect.mode==="loop"?(p(),v("div",_s,[(p(!0),v(O,null,N(i(o).inspect.kinds,h=>(p(),v("button",{key:h.id,type:"button","data-active":h.id===i(o).inspect.loopKind?"":void 0,disabled:!i(o).canEdit,onClick:y=>i(o).onLoopKind?.(h.id)},P(h.label),9,Ts))),128))])):$("",!0),i(o).inspect.mode==="loop"&&i(o).inspect.loopKind==="collection"?(p(),v("select",{key:i(o).inspect.key+":"+i(o).inspect.value,value:i(o).inspect.value,disabled:!i(o).canEdit,onChange:s},[i(o).inspect.value?$("",!0):(p(),v("option",Ss,P(i(o).inspect.placeholder),1)),(p(!0),v(O,null,N(i(o).inspect.collections,h=>(p(),v("option",{key:h.handle,value:h.handle},P(h.title),9,ws))),128))],40,xs)):(p(),v("div",Cs,[(p(),v("input",{ref_key:"field",ref:a,key:i(o).inspect.key,type:"text",value:i(o).inspect.value,placeholder:i(o).inspect.placeholder,disabled:!i(o).canEdit,spellcheck:"false",onKeydown:[g[0]||(g[0]=C(()=>{},["stop"])),ie(C(s,["prevent"]),["enter"])],onBlur:s},null,40,$s)),L("button",{type:"button","data-sve-ht-data":"",title:i(o).dataTitle,disabled:!i(o).canEdit,innerHTML:ft,onMousedown:g[1]||(g[1]=C(()=>{},["prevent"])),onClick:C(d,["stop","prevent"])},null,40,Ls)])),i(o).inspect.sort?(p(),v(O,{key:3},[L("div",Ps,P(i(o).inspect.sort.title),1),(p(),v("select",{key:i(o).inspect.key+":dir:"+i(o).inspect.sort.dir,value:i(o).inspect.sort.dir,disabled:!i(o).canEdit,onChange:g[2]||(g[2]=h=>i(o).onLoopSortDir?.(h.target.value))},[(p(!0),v(O,null,N(i(o).inspect.sort.dirs,h=>(p(),v("option",{key:h.id,value:h.id},P(h.label),9,Hs))),128))],40,Es)),i(o).inspect.sort.needsField?(p(),v("div",Is,[(p(),v("input",{ref_key:"sortField",ref:n,key:i(o).inspect.key+":field",type:"text",value:i(o).inspect.sort.field,placeholder:i(o).inspect.sort.placeholder,disabled:!i(o).canEdit,spellcheck:"false",onKeydown:[g[3]||(g[3]=C(()=>{},["stop"])),g[4]||(g[4]=ie(C(h=>i(o).onLoopSortField?.(h.target.value),["prevent"]),["enter"]))],onBlur:g[5]||(g[5]=h=>i(o).onLoopSortField?.(h.target.value))},null,40,As)),i(o).inspect.sort.pickable?(p(),v("button",{key:0,type:"button","data-sve-ht-data":"",title:i(o).dataTitle,disabled:!i(o).canEdit,innerHTML:ft,onMousedown:g[6]||(g[6]=C(()=>{},["prevent"])),onClick:C(f,["stop","prevent"])},null,40,Ms)):$("",!0)])):$("",!0),L("div",Rs,P(i(o).inspect.limit.title),1),(p(),v("input",{key:i(o).inspect.key+":limit",type:"number",min:"1",value:i(o).inspect.limit.value,placeholder:i(o).inspect.limit.placeholder,disabled:!i(o).canEdit,onKeydown:[g[7]||(g[7]=C(()=>{},["stop"])),g[8]||(g[8]=ie(C(h=>i(o).onLoopLimit?.(h.target.value),["prevent"]),["enter"]))],onBlur:g[9]||(g[9]=h=>i(o).onLoopLimit?.(h.target.value))},null,40,Os))],64)):$("",!0),i(o).inspect.branches?.length?(p(),v("div",Ds,[(p(!0),v(O,null,N(i(o).inspect.branches,h=>(p(),v("button",{key:h.id,type:"button",disabled:!i(o).canEdit,onClick:y=>i(o).onAddBranch?.(h.id)},P(h.label),9,Fs))),128))])):$("",!0)],64))])):$("",!0)}},js=Ke(Ns,[["__scopeId","data-v-26254b75"]]),Vs={class:"sve-html-tree"},Ks={class:"sve-pane-bar","data-sve-pane-bar":""},qs={"data-sve-right-title":""},Gs={"data-sve-right-actions":""},Us=["aria-pressed","title","aria-label"],zs={class:"sve-ht-tools"},Xs=["title"],Ys=["placeholder","aria-label","value"],Ws=["aria-label"],Zs=["title","aria-label"],Js=["title"],Qs={class:"sve-ht-used-by__label"},er={class:"sve-ht-used-by__text"},tr={key:2,class:"sve-tree-exit"},or=["title"],nr=["title"],ar='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',sr='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',rr='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',ir='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',lr={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const t=u(window,"html_tree_search");o.layers=wn(window);const a=u(window,"html_tree_layers_on"),n=u(window,"html_tree_layers_off");function s(){Ln(window,!o.layers)}const l=jo(window),r=u(window,"section_new"),d=V(!1);function f(){d.value=!1}async function k(y){if(!y)return;await Ae(),o.onRefresh?.();const x=T("html-tree:open-section",y);x&&os(window,x.ids)}function g(){d.value||(d.value=!0,(async()=>{if(!(o.sections.length||o.pageBuilder)){ss(window),f();return}const y=await ns(window);if(!y){f();return}const x=o.sections.length?o.sections[o.sections.length-1].uid:null,b=R=>{f(),k(R?.uid)};if(y==="static"){rs(window,{afterUid:x,onDone:b,onError:f,onClose:f});return}is(window,{afterUid:x,onDone:b,onError:f,onClose:f})})())}function h(y){const x=!!o.query;o.query=y,x!==!!y&&o.onQuery?.()}return(y,x)=>(p(),v("div",Vs,[L("div",Ks,[L("div",qs,P(e.title),1),L("div",Gs,[L("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":i(o).layers?"true":"false",title:i(o).layers?i(n):i(a),"aria-label":i(o).layers?i(n):i(a),innerHTML:ar,onClick:s},null,8,Us),x[5]||(x[5]=Cn('<button type="button" data-sve-right-pin aria-pressed="false" data-v-331de34d></button><button type="button" data-sve-close aria-label="Close" data-v-331de34d><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-331de34d><path d="M18 6 6 18" data-v-331de34d></path><path d="m6 6 12 12" data-v-331de34d></path></svg></button>',2))])]),L("div",zs,[L("label",{class:"sve-ht-search",title:i(t)},[L("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:rr}),L("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:i(t),"aria-label":i(t),value:i(o).query,autocomplete:"off",spellcheck:"false",onInput:x[0]||(x[0]=b=>h(b.target.value)),onKeydown:[x[1]||(x[1]=C(()=>{},["stop"])),x[2]||(x[2]=ie(C(b=>h(""),["prevent"]),["escape"]))]},null,40,Ys),i(o).query?(p(),v("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":i(t),innerHTML:ir,onClick:x[3]||(x[3]=b=>h(""))},null,8,Ws)):$("",!0)],8,Xs),i(l)&&(i(o).sections.length||i(o).pageBuilder||i(o).rows.length&&!i(o).layoutFile)?(p(),v("button",{key:0,type:"button",class:"sve-ht-new",title:i(r),"aria-label":i(r),innerHTML:sr,onClick:g},null,8,Zs)):$("",!0)]),i(o).usedBy?(p(),v("div",{key:0,class:"sve-ht-used-by",title:`${i(o).usedBy.label}: ${i(o).usedBy.text}`},[L("span",Qs,P(i(o).usedBy.label)+":",1),L("span",er,P(i(o).usedBy.text),1)],8,Js)):$("",!0),i(Y).inSidebar?$("",!0):(p(),X(ra,{key:1})),x[6]||(x[6]=L("div",{"data-sve-html-tree-list":""},null,-1)),$n(js),i(o).exitOpen&&!i(Y).inSidebar?(p(),v("div",tr,[L("span",{class:"sve-tree-exit__name",title:i(o).exitName},P(i(o).exitName),9,or),L("button",{type:"button",class:"sve-tree-exit__go",title:i(o).exitTitle,onClick:x[4]||(x[4]=b=>i(o).onExit?.())},P(i(o).exitLabel),9,nr)])):$("",!0)]))}},Ko=Ke(lr,[["__scopeId","data-v-331de34d"]]);function qo(e){return String(e||"").trim().toLowerCase()}function Ct(e,t){return t?[e.name,e.tag,e.klass,e.label,e.src].filter(a=>typeof a=="string"&&a).join(" ").toLowerCase().includes(t):!0}function dr(e,t){const a=qo(t);if(!a)return{rows:e,hits:new Set};const n=new Set;for(const r of e)Ct(r,a)&&n.add(r.path);const s=[...n];return{rows:e.filter(r=>n.has(r.path)||s.some(d=>d.startsWith(`${r.path}/`))),hits:n}}const cr=["title"],ur={"data-sve-ht-indent":"","aria-hidden":"true"},hr=["data-sve-ht-cat"],pr={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},fr={key:2,"data-sve-ht-letter":""},mr=["innerHTML"],vr=["title"],gr=["title"],yr={key:1,"data-sve-ht-kind":""},kr={key:3,"data-sve-ht-name":""},br={key:4,"data-sve-ht-actions":""},_r=["title"],Tr={key:5,"data-sve-ht-actions":""},xr=["data-on","title","innerHTML"],Sr=["disabled","title","innerHTML"],wr=["disabled","title"],Cr=["disabled","title"],$r=["disabled","title"],Lr=["data-sve-ht-id"],po='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',Pr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',Er='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Hr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',Ir='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',Ar='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',Mr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',Rr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',Or={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const t=oa(window),a=u(window,"section_fields");function n(){const _=na();if(!_){window.Statamic?.$toast?.error(u(window,"section_fields_none"));return}Mo(window,_)}function s(_){return _.synthetic?_.frame==="main"?o.frameMainTitle:_.frame==="template"?o.frameTemplateTitle:o.frameOpenTitle:_.kind==="component"?_.src?`partial:${_.src}`:_.tag:_.name?`${_.tag} ${_.name}`:_.tag}function l(_){return!!_.section}function r(_){return!!_.frame}function d(_){return _.kind==="slot"}function f(_){return!!_.context}function k(_,m){f(m)||r(m)||d(m)||(l(m)?o.onSectionPointerDown?.(_,m.section):m.sectionRoot?o.onSectionPointerDown?.(_,m.sectionRoot):o.onPointerDown?.(_,m.id))}function g(_){if(_.synthetic){o.onFrame?.(_.frame);return}if(l(_)){o.onSection?.(_.section);return}if(f(_)){o.onContextRow?.(_.id);return}o.onSelect?.(_.id)}function h(_,m){const S={"data-sve-ht-id":_.id};return _.current&&(S["data-sve-ht-current"]=""),_.hidden&&(S["data-sve-ht-hidden"]=""),S["data-sve-ht-cat"]=_.cat||"other",S["data-sve-ht-depth"]=String(_.depth),m&&(S["data-sve-ht-dim"]=""),f(_)&&(S["data-sve-ht-context"]=_.context),l(_)&&(S["data-sve-ht-sec"]=""),r(_)&&(S["data-sve-ht-frame"]=_.frame),!l(_)&&o.dropId===_.id&&o.dropPlace&&(S["data-sve-ht-drop"]=o.dropPlace),S}function y(_){return!!_.fixed}function x(_){return!y(_)&&(!_.hidden||_.wrapFrom!=null)}function b(_){return!!_.sectionRoot||!!_.section}function R(_){return o.canEdit||b(_)}return(_,m)=>(p(),v(O,null,[L("div",Me({"data-sve-ht-row":""},h(e.row,e.dim),{role:"button",tabindex:"0",title:s(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:m[32]||(m[32]=S=>g(e.row)),onDblclick:m[33]||(m[33]=C(S=>e.row.synthetic?i(o).onFrameEnter?.(e.row.frame):r(e.row)||d(e.row)||l(e.row)||f(e.row)?null:i(o).onRename?.(e.row.id),["prevent"])),onKeydown:[m[34]||(m[34]=ie(C(S=>g(e.row),["prevent"]),["enter"])),m[35]||(m[35]=ie(C(S=>g(e.row),["prevent"]),["space"]))],onPointerdown:m[36]||(m[36]=S=>k(S,e.row)),onContextmenu:m[37]||(m[37]=C(S=>r(e.row)||d(e.row)||l(e.row)||f(e.row)?null:i(o).onContext?.(S,e.row.id),["prevent","stop"]))}),[L("span",ur,[(p(!0),v(O,null,N(e.row.guides||[],(S,E)=>(p(),v("i",{key:E,"data-sve-ht-cat":S},null,8,hr))),128))]),e.row.hasChildren||e.row.emptyBlock?(p(),v("button",Me({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?i(o).mainShut:e.row.shut)?{"data-sve-ht-shut":""}:{},{innerHTML:Pr,onClick:m[0]||(m[0]=C(S=>e.row.synthetic?i(o).onFrameTwist?.():l(e.row)?i(o).onSection?.(e.row.section):i(o).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:m[1]||(m[1]=C(()=>{},["stop"])),onDblclick:m[2]||(m[2]=C(()=>{},["stop"]))}),null,16)):(p(),v("span",pr)),e.row.letter?(p(),v("span",fr,P(e.row.letter),1)):(p(),v("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,mr)),L("span",{"data-sve-ht-text":"",title:i(o).renameTitle},[!e.row.kind&&!l(e.row)&&!f(e.row)&&!r(e.row)?(p(),v("button",{key:0,type:"button","data-sve-ht-tag":"",title:i(o).tagTitle,onClick:m[3]||(m[3]=C(()=>{},["stop","prevent"])),onPointerdown:m[4]||(m[4]=C(()=>{},["stop"])),onDblclick:m[5]||(m[5]=C(S=>i(o).onTagChange?.(S,e.row.id),["stop","prevent"]))},P(e.row.tag),41,gr)):(p(),v("span",yr,P(e.row.tag),1)),i(o).editingId===e.row.id&&!l(e.row)?fe((p(),v("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":m[6]||(m[6]=S=>i(o).draft=S),onMousedown:m[7]||(m[7]=C(()=>{},["stop"])),onPointerdown:m[8]||(m[8]=C(()=>{},["stop"])),onClick:m[9]||(m[9]=C(()=>{},["stop"])),onDblclick:m[10]||(m[10]=C(()=>{},["stop"])),onKeydown:[m[11]||(m[11]=C(()=>{},["stop"])),m[12]||(m[12]=ie(C(S=>i(o).onRenameCommit?.(),["prevent"]),["enter"])),m[13]||(m[13]=ie(C(S=>i(o).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:m[14]||(m[14]=S=>i(o).onRenameCommit?.())},null,544)),[[xt,i(o).draft]]):(p(),v("span",kr,P(e.row.name),1))],8,vr),r(e.row)?(p(),v("span",br,[e.row.frame!=="main"&&i(t)?(p(),v("button",{key:0,type:"button","data-sve-ht-fields":"",title:i(o).frameFieldsTitle,innerHTML:po,onClick:m[15]||(m[15]=C(S=>i(o).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:m[16]||(m[16]=C(()=>{},["stop"])),onDblclick:m[17]||(m[17]=C(()=>{},["stop"]))},null,40,_r)):$("",!0)])):!l(e.row)&&!f(e.row)&&!d(e.row)?(p(),v("span",Tr,[e.row.videoNth>=0?(p(),v("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?i(o).videoPlayTitle:i(o).videoHoldTitle,innerHTML:e.row.videoHeld?Mr:Ar,onClick:m[18]||(m[18]=C(S=>i(o).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:m[19]||(m[19]=C(()=>{},["stop"])),onDblclick:m[20]||(m[20]=C(()=>{},["stop"]))},null,40,xr)):$("",!0),x(e.row)?(p(),v("button",{key:1,type:"button","data-sve-ht-eye":"",disabled:!i(o).canEdit,title:i(o).canEdit?e.row.hidden?i(o).showTitle:i(o).hideTitle:i(o).lockedTitle,innerHTML:e.row.hidden?Hr:Er,onClick:m[21]||(m[21]=C(S=>i(o).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:m[22]||(m[22]=C(()=>{},["stop"])),onDblclick:m[23]||(m[23]=C(()=>{},["stop"]))},null,40,Sr)):$("",!0),i(t)&&e.row.fieldsIcon?(p(),v("button",{key:2,type:"button","data-sve-ht-fields":"",disabled:!i(o).canEdit,title:i(o).canEdit?i(a):i(o).lockedTitle,innerHTML:po,onClick:C(n,["stop","prevent"]),onPointerdown:m[24]||(m[24]=C(()=>{},["stop"])),onDblclick:m[25]||(m[25]=C(()=>{},["stop"]))},null,40,wr)):$("",!0),y(e.row)?$("",!0):(p(),v("button",{key:3,type:"button","data-sve-ht-dup":"",disabled:!R(e.row),title:R(e.row)?i(o).duplicateTitle:i(o).lockedTitle,innerHTML:Ir,onClick:m[26]||(m[26]=C(S=>i(o).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:m[27]||(m[27]=C(()=>{},["stop"])),onDblclick:m[28]||(m[28]=C(()=>{},["stop"]))},null,40,Cr)),y(e.row)?$("",!0):(p(),v("button",{key:4,type:"button","data-sve-ht-del":"",disabled:!R(e.row),title:R(e.row)?i(o).deleteTitle:i(o).lockedTitle,innerHTML:Rr,onClick:m[29]||(m[29]=C(S=>i(o).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:m[30]||(m[30]=C(()=>{},["stop"])),onDblclick:m[31]||(m[31]=C(()=>{},["stop"]))},null,40,$r))])):$("",!0)],16,cr),e.row.emptyBlock&&!e.row.shut?(p(),v("div",Me({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},i(o).dropId===e.row.id&&i(o).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),P(i(o).slotText),17,Lr)):$("",!0)],64))}},J=Ke(Or,[["__scopeId","data-v-6c7b7132"]]),Dr=["data-sve-ht-look","data-sve-ht-layers"],Fr={key:0,class:"sve-ht-page-template"},Br={key:0,class:"sve-ht-page-template__text"},Nr={class:"sve-ht-page-template__note"},jr={key:1,class:"sve-ht-empty"},Vr={key:2,class:"sve-ht-empty"},Kr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},qr={key:0,class:"sve-ht-empty"},Gr={key:0,class:"sve-ht-empty"},Ur=["data-sve-ht-under-main"],zr={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},Xr={key:0,class:"sve-ht-empty"},Yr=["data-sve-ht-under-main"],Wr=["data-dim"],Zr={key:0,class:"sve-ht-empty"},Jr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},Qr={key:0,class:"sve-ht-empty"},ei={__name:"HtmlTreeList",setup(e){const t=he(()=>qo(o.query)),a=he(()=>dr(o.rows,t.value)),n=he(()=>a.value.rows),s=he(()=>t.value?o.sections.filter(y=>Ct(y.row,t.value)||y.current&&y.ready&&n.value.length>0):o.sections);function l(y){return!!y&&(!t.value||Ct(y,t.value))}function r(y){const x=o.frame?.kind;return o.inComponent||(x==="header"||x==="footer")&&x!==y}const d=he(()=>!!o.frame&&["header","main","footer"].some(y=>l(o.frame[y]))),f=he(()=>!!o.frame&&(o.frame.kind==="main"||l(o.frame.main))),k=he(()=>!!t.value&&!s.value.length&&!n.value.length&&!d.value);function g(y){return!!t.value&&!a.value.hits.has(y.path)}function h(y){const x={"data-sve-ht-sec-uid":y.uid};return y.current&&(x["data-sve-ht-branch"]="",x["data-sve-ht-cat"]=y.row?.cat||"layout"),o.sectionDrop&&o.sectionDrop.uid===y.uid&&(x["data-sve-ht-drop"]=o.sectionDrop.place),x}return(y,x)=>(p(),v("div",Me({class:"sve-ht-root","data-sve-ht-look":i(o).layers?"tags":i(o).look,"data-sve-ht-layers":i(o).layers?"":null,style:i(o).familyStyle},i(o).dragging?{"data-sve-ht-dragging":""}:{}),[i(o).pageTemplate?(p(),v("div",Fr,[i(o).pageTemplate.text?(p(),v("p",Br,P(i(o).pageTemplate.text),1)):$("",!0),L("p",Nr,P(i(o).pageTemplate.note),1),i(o).pageTemplate.canOpen?(p(),v("button",{key:1,type:"button",class:"sve-ht-page-template__open",onClick:x[0]||(x[0]=b=>i(o).pageTemplate.onOpen(b.currentTarget))},P(i(o).pageTemplate.openLabel),1)):$("",!0)])):!i(o).rows.length&&!i(o).sections.length&&!i(o).frame?(p(),v("div",jr,P(i(o).emptyText),1)):k.value?(p(),v("div",Vr,P(i(o).searchEmpty),1)):$("",!0),i(o).frame||i(o).sections.length?(p(),v(O,{key:3},[i(o).frame?(p(),v(O,{key:0},[i(o).frame.kind==="header"?(p(),v("div",Kr,[(p(!0),v(O,null,N(n.value,b=>(p(),X(J,{key:b.id,row:b,dim:g(b)},null,8,["row","dim"]))),128)),i(o).rows.length?$("",!0):(p(),v("div",qr,P(i(o).emptyText),1))])):l(i(o).frame.header)?(p(),X(J,{key:1,row:i(o).frame.header,dim:r("header")},null,8,["row","dim"])):$("",!0)],64)):$("",!0),L("div",Pn(En(i(o).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[i(o).frame?.kind==="main"?(p(),v(O,{key:0},[(p(!0),v(O,null,N(n.value,b=>(p(),X(J,{key:b.id,row:b,dim:g(b)},null,8,["row","dim"]))),128)),i(o).rows.length?$("",!0):(p(),v("div",Gr,P(i(o).emptyText),1))],64)):i(o).frame&&l(i(o).frame.main)?(p(),X(J,{key:1,row:i(o).frame.main,dim:r("main")},null,8,["row","dim"])):$("",!0),i(o).frame?.kind==="template"?fe((p(),v("div",{key:2,"data-sve-ht-frame-body":"","data-sve-ht-under-main":f.value?"":null},[L("div",zr,[(p(!0),v(O,null,N(n.value,b=>(p(),X(J,{key:b.id,row:b,dim:g(b)},null,8,["row","dim"]))),128)),i(o).rows.length?$("",!0):(p(),v("div",Xr,P(i(o).emptyText),1))])],8,Ur)),[[so,!i(o).mainShut]]):$("",!0),i(o).sections.length||i(o).frame?fe((p(),v("div",{key:3,"data-sve-ht-frame-body":"","data-sve-ht-under-main":f.value?"":null},[i(o).frame?.template&&l(i(o).frame.template)?(p(),X(J,{key:0,row:i(o).frame.template,dim:r("template")},null,8,["row","dim"])):$("",!0),i(o).frame&&!i(o).frame.template&&!i(o).sections.length&&!t.value?(p(),v("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":r("")?"":void 0},P(i(o).frameEmptyText),9,Wr)):$("",!0),(p(!0),v(O,null,N(s.value,b=>(p(),v("div",Me({key:b.uid},{ref_for:!0},h(b)),[b.ready?(p(),v(O,{key:0},[(p(!0),v(O,null,N(n.value,R=>(p(),X(J,{key:R.id,row:R,dim:g(R)},null,8,["row","dim"]))),128)),i(o).rows.length?$("",!0):(p(),v("div",Zr,P(i(o).emptyText),1))],64)):(p(),X(J,{key:1,row:b.row,dim:r("")},null,8,["row","dim"]))],16))),128))],8,Yr)),[[so,!i(o).frame||!i(o).mainShut]]):$("",!0)],16),i(o).frame?(p(),v(O,{key:1},[i(o).frame.kind==="footer"?(p(),v("div",Jr,[(p(!0),v(O,null,N(n.value,b=>(p(),X(J,{key:b.id,row:b,dim:g(b)},null,8,["row","dim"]))),128)),i(o).rows.length?$("",!0):(p(),v("div",Qr,P(i(o).emptyText),1))])):l(i(o).frame.footer)?(p(),X(J,{key:1,row:i(o).frame.footer,dim:r("footer")},null,8,["row","dim"])):$("",!0)],64)):$("",!0)],64)):i(o).rows.length?(p(!0),v(O,{key:4},N(n.value,b=>(p(),X(J,{key:b.id,row:b,dim:g(b)},null,8,["row","dim"]))),128)):$("",!0)],16,Dr))}},mt=Ke(ei,[["__scopeId","data-v-eecd9f12"]]);let vt=null;function ti(e){return vt||(vt=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{pages:[]}).then(t=>Array.isArray(t.pages)?t.pages:[]).catch(()=>[])),vt}let Ye=null;function gt(){Ye?.dismiss(),Ye=null}function oi(e,t,a){gt();const n=t?.getBoundingClientRect?.(),s={x:n?n.left:0,y:n?n.bottom+4:0};ti(e).then(l=>{const r=l.length?l.map(d=>({label:d.title||d.url,onPick:()=>{gt(),a(d.url)}})):[{label:u(e,"component_props_pages_none"),onPick:null}];gt(),Ye=be(e.document,Kt,{items:r,x:s.x,y:s.y,onClose:()=>{Ye=null}})})}const Go="sve-html-tree-labels";function Uo(){try{const e=globalThis.localStorage?.getItem(Go);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function ni(e){try{globalThis.localStorage?.setItem(Go,JSON.stringify(e))}catch{}}function zo(e){return String(e||"_")}function Xo(e){const t=Uo()[zo(e)];return t&&typeof t=="object"?{...t}:{}}function ai(e,t,a){const n=a?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function si(e,t,a,n){if(!t)return;const s=zo(e),l=Uo(),r={...l[s]||{}},d=String(a||"").replace(/\s+/g," ").trim(),f=String(n||"").trim();!d||d===f?delete r[t]:r[t]=d,Object.keys(r).length?l[s]=r:delete l[s],ni(l)}const ri=/^@(media|supports|container|layer|scope)\b/i;function ii(e){const t=String(e||""),a=[];let n=0,s=0;for(;n<t.length;){if(t[n]==="{"&&t[n+1]==="{"){const d=t.indexOf("}}",n+2);n=d===-1?t.length:d+2;continue}if(t[n]==="/"&&t[n+1]==="*"){const d=t.indexOf("*/",n+2);n=d===-1?t.length:d+2;continue}if(t[n]==='"'||t[n]==="'"){const d=t[n];for(n+=1;n<t.length&&t[n]!==d;)n+=t[n]==="\\"?2:1;n+=1;continue}if(t[n]!=="{"){n+=1;continue}let l=1,r=n+1;for(;r<t.length&&l>0;){if(t[r]==="{"&&t[r+1]==="{"){const d=t.indexOf("}}",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==="/"&&t[r+1]==="*"){const d=t.indexOf("*/",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==='"'||t[r]==="'"){const d=t[r];for(r+=1;r<t.length&&t[r]!==d;)r+=t[r]==="\\"?2:1;r+=1;continue}t[r]==="{"?l+=1:t[r]==="}"&&(l-=1),r+=1}a.push({selector:t.slice(s,n).trim(),body:t.slice(n+1,r-1),from:s,to:r,text:t.slice(s,r).trim()}),n=r,s=r}return a}function fo(e){const t=String(e||""),a=new Set,n=new Set,s=new Set;for(const l of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const r of l[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))r&&(a.add(r),a.add(r.replace(/([:./%!#()[\],])/g,"\\$1")));for(const l of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))l[2].trim()&&n.add(l[2].trim());for(const l of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))s.add(l[1].toLowerCase());return{classes:a,ids:n,tags:s}}function mo(e,t){const a=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),n=[...a.matchAll(/\.((?:\\.|[\w-])+)/g)].map(r=>r[1]),s=[...a.matchAll(/#((?:\\.|[\w-])+)/g)].map(r=>r[1]);if(n.length||s.length){const r=d=>d.replace(/\\(.)/g,"$1");return n.every(d=>t.classes.has(d)||t.classes.has(r(d)))&&s.every(d=>t.ids.has(r(d)))}const l=[...a.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(r=>r[2].toLowerCase());return l.length>0&&l.every(r=>t.tags.has(r))}function li(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function di(e,t,a){const n=li(e);if(!n.length)return"keep";const s=n.filter(r=>mo(r,t));return s.length?s.length===n.length&&!n.some(r=>mo(r,a))?"move":"copy":"keep"}function Yo(e,t,a){const n=String(e||""),s=fo(t),l=fo(a),r=[],d=[];let f=0;for(const k of ii(n)){const g=n.slice(k.from,k.to),h=g.match(/^\s*/)[0];if(f=k.to,ri.test(k.selector)){const x=Yo(k.body,t,a);x.move.trim()&&r.push(`${k.selector} {
${x.move.trim()}
}`),x.keep.trim()&&d.push(`${h}${k.selector} {
${x.keep.trim()}
}`);continue}const y=k.selector.startsWith("@")?"keep":di(k.selector,s,l);if(y==="move"){r.push(k.text);continue}y==="copy"&&r.push(k.text),d.push(g)}return d.push(n.slice(f)),{move:r.join(`

`).trim(),keep:d.join("").replace(/\n{3,}/g,`

`).trim()}}const ci="/!/sve/component";function ui(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let a=null;for(const n of t){if(!n.trim())continue;const s=n.match(/^[ \t]*/)[0].length;a=a===null?s:Math.min(a,s)}return a?t.map(n=>n.slice(a)).join(`
`):t.join(`
`)}function hi(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function pi(e,t){if(!la(e))return"";try{return await(await In(()=>import("./tw-compile-AWaJHJyk.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(a){return console.error("[sve] component tailwind compile",a),""}}async function fi(e,t){const a=await e.fetch(ci,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":Dt(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!a.ok){const n=new Error(String(a.status));throw n.status=a.status,n}return a.json()}function vo(e,t){const{from:a,to:n}=ia(e,t),s=e.slice(a,n);if(!s.trim())return null;const l=e.slice(0,a)+e.slice(n),r=T("dock:css"),d=Yo(typeof r=="string"?r:"",s,l);return{html:ui(s),css:d.move,keepCss:d.keep,lead:hi(s),from:a,to:n}}function mi(e,t,{onDone:a,onError:n}={}){if(T("dock:is-locked")===!0)return;const s=T("dock:html");if(typeof s!="string"||!t)return;const l=vo(s,t);if(!l)return;const r=be(e.document,Hn,{heading:u(e,"component_new"),nameLabel:u(e,"component_name"),placeholder:u(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:u(e,"cancel"),saveLabel:u(e,"component_create"),onOk:d=>{r.dismiss(),(async()=>{try{const f=await pi(e,l.html),k=T("dock:html"),g=typeof k=="string"&&k===s?l:vo(k,t);if(!g)return;const h=await fi(e,{name:d,html:g.html,css:g.css,js:"",tw:f}),y=T("dock:html"),x=y.slice(0,g.from)+g.lead+h.tag+y.slice(g.to);T("dock:set-html",x),g.css.trim()&&T("dock:set-css",g.keepCss),a?.(h)}catch(f){n?.(f)}})()}})}function vi(e,t,a){const n=String(e||"");if(!t||t.kind!=="antlers")return n;const s=String(a||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?bi(n,t,s):t.tag==="else"||!s?n:n.slice(0,t.from)+`{{ ${t.tag} ${s} }}`+n.slice(t.openTo)}function $t(e,t,a,n){return Oe(e,t,{kind:a,name:n})}function Oe(e,t,a={}){const n=String(e||"");if(!t||t.antlers!=="loop")return n;const s=t.loopKind==="collection"?"collection":"field",l=a.kind??s,r=String(a.name??t.expr??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(r))return n;const d=a.sortDir??t.sortDir??"",f=String(a.sortField??t.sortField??"").trim(),k=String(a.limit??t.limit??"").trim(),g=Wo(n,t);if(!g)return n;const h=l===s?t.params:"",y=l==="collection"?gi(r,f,d,k,h):yi(r,f,d,k,h),x=l==="collection"?"collection":r;return n.slice(0,t.from)+y+n.slice(t.openTo,g.from)+`{{ /${x} }}`+n.slice(g.to)}function gi(e,t,a,n,s){const l=ki(s).replace(/\bsort\s*=\s*["'][^"']*["']/g,"").replace(/\blimit\s*=\s*["']?\d+["']?/g,"").replace(/\s+/g," ").trim(),r=[`collection from="${e}"`];return a==="random"?r.push('sort="random"'):t&&r.push(`sort="${t}${a==="desc"?":desc":":asc"}"`),n&&r.push(`limit="${n}"`),l&&r.push(l),`{{ ${r.join(" ")} }}`}function yi(e,t,a,n,s){const l=String(s||"").split("|").map(d=>d.trim()).filter(d=>d&&!/^from\s*=/.test(d)&&!/^sort\s*:/.test(d)&&!/^reverse$/.test(d)&&!/^shuffle$/.test(d)&&!/^limit\s*:/.test(d)),r=[e,...l];return a==="random"?r.push("shuffle"):t&&(r.push(`sort:${t}`),a==="desc"&&r.push("reverse")),n&&r.push(`limit:${n}`),`{{ ${r.join(" | ")} }}`}function ki(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function Wo(e,t){const n=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return n?{from:t.from+n.index,to:t.from+n.index+n[0].length}:null}function bi(e,t,a){return Oe(e,t,{name:a})}function _i(e,t,a){const n=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return n;const s=Wo(n,t);if(!s)return n;const r=(n.slice(0,s.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],d=a==="else"?"{{ else }}":"{{ elseif true }}";return`${n.slice(0,s.from)}${d}
${r}${n.slice(s.from)}`}const G=ha("sve-call-values"),je=new Set;let go=null;const Ti="__sve-html-tree-style";function xi(e,t,a){if(t||a)return!1;const n=String(T("dock:chrome-kind")||"");if(n==="header"||n==="footer")return!1;const s=Po(e);return!!s&&s!=="create"&&Vn(e)!==Kn(e)}function Si(e,t){const a={entry:t,text:"",note:u(e,"html_tree_page_template_note"),openLabel:u(e,"html_tree_open_template"),canOpen:!1,onOpen:null};return Ao(e,{entry:t}).then(n=>{!n||o.pageTemplate?.entry!==t||(o.pageTemplate={...o.pageTemplate,text:u(e,"html_tree_page_template",{name:n.name}),canOpen:!!n.open,onOpen:n.open?s=>qn(e,s,n.open):null})}),a}function wi(e,t){const a=t.replace(/^view:/,"");if(!a||T("dock:current-type")!==t){o.usedBy=null;return}o.usedBy?.view!==a&&(o.usedBy=null,Ao(e,{view:a}).then(n=>{if(!n||T("dock:current-type")!==t)return;const s=n.everything?u(e,"html_tree_used_by_everything"):n.used_by.length?n.used_by.join(", "):u(e,"html_tree_used_by_nobody");o.usedBy={view:a,label:u(e,"html_tree_used_by"),text:s}}))}const j=new Set;let Lt="",xe=!1,yt=null,Le=!0,Q="",$e=0,Zo="";const le=new Map,we=new Set;let K="",Jo=!1,F=null,We=null,Ue="",Ze="",Je=0,Pt=null,Ce=[],me=null,De=null,Qe=null,et=null,Et=null,ye=!1,ve=null,Ve=null,Fe=null,tt=null,ot=null,Ht=null,pe=null;function W(e){return e.getElementById(Xe)}function Ci(e){Mn(e,Ti,`
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
      ${ro("light")}
      /* How much of a row's own colour its pick takes: a wash, not a fill.
         The row mixes it in below — a mix written up here would read
         --sve-ht-c on the list, where no family is set. */
      --sve-ht-pick-mix: 11%;
      --sve-ht-pick-hover-mix: 18%;
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${ro("dark")}
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
  `)}function U(){const e=T("dock:html");return typeof e=="string"?e:""}function Qo(e){return!!T("dock:is-open",e)}function Pe(e,{save:t=!1}={}){return Xt()||T("dock:set-html",e)!==!0?!1:(t&&T("dock:save-now"),!0)}function kt(e){const t=T("dock:component-exit-state")||{};if(o.exitOpen=!!t.open,!t.open){o.onExit=null;return}o.exitName=t.name||"",o.exitLabel=u(e,"component_exit"),o.exitTitle=u(e,t.back?"component_exit_back":"component_exit_close"),o.onExit=()=>{T("dock:exit-component"),A(e)}}function en(e,t){const a=Yn(e);if(!a||t.type!==a)return"";const n=Wn(t[a]);return n&&Zn(e,n)?.section_type||""}const ke=[];let bt=!1,It=!1;function _t(e,t){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(t,{timeout:2e3});return}e.setTimeout(t,200)}function $i(e,t){for(const a of t){const n=a.type;!n||le.has(n)||we.has(n)||ke.includes(n)||ke.push(n)}Ft.htmlTreePrefetchArmed&&zt(e)}function bl(e){Ft.htmlTreePrefetchArmed=!0,zt(e)}function zt(e){if(bt||!ke.length)return;bt=!0;const t=()=>{const a=ke.shift();if(!a){bt=!1;return}if(le.has(a)||we.has(a)){_t(e,t);return}we.add(a),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(a)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{typeof n?.html=="string"&&(le.set(a,n.html),It&&(It=!1,A(e)))}).catch(()=>{}).finally(()=>{we.delete(a),_t(e,t)})};_t(e,t)}function Xt(){return!!K}function Li(e){const t=new Map,a=it(e);if(!a)return t;for(const n of a.querySelectorAll("[data-sid]")){const s=n.getAttribute("data-sid");s&&!t.has(s)&&t.set(s,n.tagName.toLowerCase())}return t}function ut(e,t){const a=lt(e)||"page_sections",n=Li(e),s=[];for(const l of Bt(t)||[]){const r=Nt(l.values),d=r&&typeof r=="object"?r[a]:null;if(Array.isArray(d)){d.forEach(f=>{if(!f||typeof f!="object"||Array.isArray(f)||typeof f.type!="string")return;const k=[f._visual_id,f.id,f._id].filter(b=>typeof b=="string"&&b!=="");if(!k.length)return;const g=en(e,f)||f.type,h=typeof f._sve_label=="string"?f._sve_label.trim():"",y=k.map(b=>n.get(b)).find(Boolean)||"section",x=Xo(f.type)[`0:${y}`];s.push({uid:k[0],ids:k,type:f.type,tag:y,label:h||(typeof x=="string"&&x.trim()?x.trim():"")||dt(e,g)?.display||Be(g)||g,svg:Oo(y,"",null).svg||Se.section,cat:Ho(y),enabled:f.enabled!==!1,static:Za(e,g)})});break}}return s}function Pi(e,t,a){if(!a.length)return"";const n=T("dock:current-type")||"",s=T("dock:current-uid"),l=!!T("dock:component-exit-state")?.open;if(s){const r=jt(s,t),d=a.find(f=>f.ids.some(k=>r.includes(k)));if(d&&(l||d.type===n))return d.uid}return a.find(r=>r.type===n)?.uid||""}function Ei(e,t,a,n){const s=t.find(b=>b.uid===a),l=T("dock:component-src"),r=T("dock:type-stack")||[];if(!s||!l||!r.length)return null;const d=r.map(b=>b.type).filter(b=>!le.get(b));if(d.length)return Hi(e,d),null;const f=[],k=new Set,g=new Set;let h=b=>f.push(...b),y=null,x=0;for(let b=0;b<r.length;b+=1){const R=b+1<r.length?r[b+1].src:l,_=q=>({...q,id:`ctx${b}:${q.id}`,path:`ctx${b}/${q.path}`,ctxLevel:b,children:q.children.map(_)}),m=ct(le.get(r[b].type)).map(_),S=[],E=(q,Z)=>{for(const I of q){if(I.kind==="component"&&I.src===R)return S.push(...Z,I),I;const z=E(I.children,[...Z,I]);if(z)return z}return null};if(y=R?E(m,[]):null,!y)return null;const M=new Set(S.map(q=>q.id)),D=(q,Z)=>{for(const I of q)I.children.length&&(M.has(I.id)?j.has(I.path):tn(I,Z))&&k.add(I.id),D(I.children,Z+1)};D(m,x),h(m),g.add(y.id),x+=S.length,h=(q=>Z=>{q.children=Z})(y)}for(const b of on(n))k.add(b);return j.has(y.path)&&k.add(y.id),y.children=n,{tree:f,folds:k,hostId:y.id,hostIds:g,levels:r.length,rootId:f.find(b=>!b.kind)?.id||"",label:s.label,svg:s.svg,cat:s.cat}}function Hi(e,t){for(const a of t)!ke.includes(a)&&!we.has(a)&&ke.push(a);It=!0,zt(e)}function Ii(e,t,a){const n=T("dock:component-exit-state");if(n?.open)return Be(n.name)||n.name||"";if(a)return t.find(l=>l.uid===a)?.label||"";const s=T("dock:current-type")||"";return dt(e,s)?.display||Be(s)||""}function ht(e,t,a,n,s){const l=a.find(d=>d.uid===n);if(!l||n===s)return;j.clear(),F=null,Le=!1,oe(),qe(),Q=n,Zo=U(),K=le.get(l.type)||"",K&&(F=nt(ct(K))||null),Jo=(T("dock:current-type")||"")===l.type,e.clearTimeout($e),$e=e.setTimeout(()=>{Q="",xe=!1,A(e)},4e3),A(e);const r=()=>ea(l.uid,t,e,{clampToSection:!0});Xn(l.uid,t,e,r),de({source:te,type:ee.SVE_ACTIVATE,ids:l.ids},e),e.setTimeout(()=>A(e),0)}function At(e,t){if(!t)return!1;for(const a of e||[])if(a.id===t||At(a.children,t))return!0;return!1}function nt(e){for(const t of e||[]){if(!t.kind)return t.id;const a=nt(t.children);if(a)return a}return""}function tn(e,t){const a=t===0||e.path===Ze;return j.has(e.path)?a:!a}function on(e){const t=new Set,a=(n,s)=>{for(const l of n)l.children.length&&tn(l,s)&&t.add(l.id),a(l.children,s+1)};return a(e,0),t}function A(e){const t=e.document,n=W(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;Ci(t),ca(e);const s=U();K&&K===s&&(K=""),T("dock:chrome-kind")&&(K="");const l=K||s,r=ct(l);Ce=r,Ze="";const d=T("dock:current-type")||"",f=Xo(d),k=Bn(e,t),h=!!(T("dock:component-exit-state")||{}).open,y=ut(e,t);d&&s&&!K&&le.set(d,s),$i(e,y);const x=Pi(e,t,y);if(xi(e,k,h)){const c=Po(e);Ce=[],o.rows=[],o.sections=[],o.frame=null,o.pageBuilder=!1,o.layoutFile=!1,o.usedBy=null,o.emptyText="",o.pageTemplate?.entry!==c&&(o.pageTemplate=Si(e,c)),o.onRefresh=()=>A(e),o.onSection=null,kt(e),Re(n,mt),Tt(e,[]);return}o.pageTemplate=null,wi(e,String(T("dock:collection-view")||""));const b=String(T("dock:chrome-kind")||"");if(Nn(e),k&&!y.length&&!b){Ce=[],o.rows=[],o.sections=[],o.frame=ko(e,[],!1,!1,"",!0),o.frameEmptyText=u(e,"html_tree_frame_no_sections"),o.pageBuilder=!0,o.layoutFile=!1,o.emptyText=u(e,"html_tree_empty"),o.canEdit=!T("dock:is-locked"),o.look=io(e),o.onRefresh=()=>A(e),o.onSection=null,yo(e,""),kt(e),Re(n,mt),Tt(e,[]);return}o.pageBuilder=k;const R=`${d}|${x}`;let _=!1;R!==Lt&&(Lt=R,j.clear(),yt!==null&&l!==yt?_=!0:xe=l),(_||xe!==!1&&l!==xe)&&(xe=!1,j.clear(),F=nt(r)||null),yt=l,Q&&(Q===x||!y.length)&&(Jo||l!==Zo)&&(e.clearTimeout($e),Q="",xe=!1,At(r,F)||(j.clear(),F=nt(r)||null));const m=y.some(c=>c.uid===Q)?Q:"",S=Le?"":m||x,E=h?Ei(e,y,S,r):null,M=!!(m||x),D=M||h?"":String(T("dock:chrome-kind")||""),Z=k&&(!d&&!M||D==="main"&&T("dock:on-empty-page")===!0),I=Z||D==="template"?"":D;o.layoutFile=I==="main",I!=="main"&&(Ue="");const z=I==="main"?bo(r,"main"):null,Ee=z?at(r,c=>c.tag==="body"&&At(c.children,z.id)):null;Ze=Ee?Ee.path:"",z&&(ze((Ee||z).path),Ue!==R&&(ze(z.path),j.add(z.path)));const He=I==="header"||I==="footer"?at(r,c=>l.slice(c.from,c.openTo).includes(`data-sve-chrome="${I}"`))||bo(r,I):null;He&&ze(He.path);const B=Z||!(I==="main"?!!z:I==="header"||I==="footer"?!!He:!0)?[]:E?lo(E.tree,o.query?new Set:E.folds):lo(r,o.query?new Set:on(r));!l.trim()&&!Qo(t)?o.emptyText=u(e,"html_tree_need_dock"):o.emptyText=u(e,"html_tree_empty"),o.slotText=u(e,"antlers_drop_here"),o.dataTitle=u(e,"data_vars_title"),o.pageTitle=u(e,"component_props_page"),o.renameTitle=u(e,"html_tree_rename"),o.tagTitle=u(e,"tw_tag"),o.hideTitle=u(e,"html_tree_hide"),o.showTitle=u(e,"html_tree_show"),o.duplicateTitle=u(e,"html_tree_duplicate"),o.deleteTitle=u(e,"html_tree_delete"),o.videoHoldTitle=u(e,"html_tree_video_hold"),o.videoPlayTitle=u(e,"html_tree_video_play"),o.lockedTitle=u(e,"html_tree_locked"),o.searchEmpty=u(e,"html_tree_search_empty"),o.canEdit=!T("dock:is-locked"),o.look=io(e),o.onQuery=()=>A(e),kt(e),o.inComponent=h,o.onContextRow=c=>{if(!E||c===E.hostId)return;const w=B.find(H=>H.id===c)?.ctxLevel??E.levels-1;T("dock:exit-component",E.levels-w),A(e)},o.onSelect=c=>{const w=B.find(H=>H.id===c);w&&Ro(e,w.path)||rt(e,c,B)},o.onTwist=c=>{const w=B.find(H=>H.id===c)?.path;w&&(j.has(w)?j.delete(w):j.add(w),A(e))},o.onTagChange=(c,w)=>{const H=o.rows.find(se=>se.id===w);H&&!Xt()&&ua(e,c.currentTarget,H)},o.onRename=c=>Di(e,c),o.onRenameCommit=()=>To(e,!0),o.onRenameCancel=()=>To(e,!1),o.onHide=c=>Ni(e,c),o.onVideoHold=c=>Bi(e,c),o.onDuplicate=c=>ji(e,c),o.onDelete=c=>Ki(e,c),o.onPointerDown=(c,w)=>Yi(e,c,w),o.onSectionPointerDown=(c,w)=>Ji(e,c,w),o.onContext=(c,w)=>zi(e,c,w),o.onInspectCommit=c=>sl(e,c),o.onPropValue=(c,w,H)=>wo(e,c,w,H),o.onPropPage=(c,w)=>oi(e,c,H=>wo(e,w,H,!1)),o.onLoopKind=c=>rl(e,c),o.onAddBranch=c=>il(e,c),o.onLoopSortField=c=>{const w=st(),H=String(c||"").trim();if(!w)return;const se=pe?.id===w.id?pe.dir:"",re=w.sortDir||se||"asc";pe=null,ge(e,(Te,Ie)=>Oe(Te,Ie,{sortField:H,sortDir:re}))},o.onLoopSortDir=c=>{const w=st(),H=String(c||"");if(w){if((H==="asc"||H==="desc")&&!w.sortField){pe={id:w.id,dir:H},Rt(e,w);return}pe=null,ge(e,(se,re)=>Oe(se,re,{sortDir:H,sortField:H==="asc"||H==="desc"?re.sortField:""}))}},o.onLoopLimit=c=>ge(e,(w,H)=>Oe(w,H,{limit:String(c||"").replace(/\D/g,"")})),o.onPropHost=c=>c?G.mount(c):G.unmount(),o.onInspectData=(c,w)=>{T("dock:data-menu",{anchor:c,at:B.find(H=>H.id===F)?.from,onPick:H=>w(String(H?.var||"").trim())})};const Jt=B.find(c=>!c.kind)?.id,Qt=h?"":Ii(e,y,S),ce=S&&!h?y.find(c=>c.uid===S):null,un=Eo(e,String(T("dock:current-type")||""));let hn=0;const ne=I==="header"||I==="footer"?I:"",_e=He?He.id:"",ue=z&&B.find(c=>c.id===z.id)||null,eo=Ee&&B.find(c=>c.id===Ee.id)||null,ae=eo||ue||_e&&B.find(c=>c.id===_e)||null,to=ae?Mi(B,ae):-1;ae&&!B.slice(B.indexOf(ae),to).some(c=>c.id===F)&&(F=ae.id);const oo=o.layoutFile?Ai(e):null;o.rows=B.map(c=>{const w=oo&&c.kind==="component"&&oo.get(c.src)||"",H=c.tag==="body"&&!c.kind,se=w?{svg:Se[w]}:Oo(c.tag,c.kind,c.antlers),re=c.tag==="video"&&!c.kind?hn++:-1,Te=!!E&&c.id===E.rootId,Ie=c.id===Jt&&Qt?Qt:Te?E.label:c.klass,Ge=c.id===Jt;return{...c,tag:w||c.tag,frameCall:w,fixed:!!w||H,base:Ie,name:ne&&c.id===_e?u(e,`html_tree_frame_${ne}`):c===ue?u(e,"html_tree_frame_main"):Ge&&ce?Ie:ai(Ie,c.path,f),current:c.id===F,letter:Te?"":se.letter||"",svg:ne&&c.id===_e?Se[ne]:c===ue?Se.main:Ge&&ce?ce.svg:Te?E.svg:se.svg||"",frame:ne&&c.id===_e?ne:c===ue?"main":"",cat:ne&&c.id===_e?ne:c===ue||H?"main":Te?E.cat:w||Ho(c.tag,c.kind,c.antlers),context:E?E.hostIds.has(c.id)?"host":c.id.startsWith("ctx")?"dim":"":"",sectionRoot:Ge&&ce?ce.uid:"",fieldsIcon:!!(Ge&&ce&&!ce.static),videoNth:re,videoHeld:re>=0&&un.has(re)}}),jn(e);const pt=[];for(const c of o.rows)pt.length=c.depth,c.guides=pt.slice(),pt[c.depth]=c.cat;if(ae){const c=B.indexOf(ae),w=ae.depth;o.rows=o.rows.slice(c,to).map(H=>({...H,depth:H.depth-w,guides:H.guides.slice(w)})),ue&&Ue!==R&&(Ue=R,e.setTimeout(()=>rt(e,ue.id,B),0))}o.sections=k&&(M||I||Z)?y.map(c=>{const w=!!S&&c.uid===S;return{...c,current:w,ready:w&&(!m||!!K),row:{id:`sec:${c.uid}`,section:c.uid,tag:c.tag,name:c.label,kind:"",svg:c.svg,cat:c.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:w,hidden:!c.enabled}}}):[],o.frame=ko(e,y,M,h,I,!1,!!eo),o.frameEmptyText=u(e,"html_tree_frame_no_sections"),yo(e,I),o.onSection=c=>{ye||(Mt(e),ht(e,t,y,c,S))},o.onRefresh=()=>A(e),Rt(e,o.rows.find(c=>c.id===F)),Re(n,mt),Tt(e,r)}function yo(e,t){o.frameOpenTitle=u(e,"html_tree_frame_open"),o.frameMainTitle=u(e,"html_tree_frame_main_open"),o.frameTemplateTitle=u(e,"html_tree_frame_template_open"),o.frameFieldsTitle=u(e,"html_tree_frame_fields"),o.onFrame=a=>{t===a?Ri(e,a):_o(e,a)},o.onFrameEnter=a=>_o(e,a),o.onFrameFields=a=>aa(e,Gn(e,a),u(e,`html_tree_frame_${a}`)),o.onFrameTwist=()=>{o.mainShut=!o.mainShut}}function ko(e,t,a,n,s,l=!1,r=!1){if(!s&&!l||r)return null;const d=g=>({id:`frame:${g}`,frame:g,synthetic:!0,tag:g,name:u(e,`html_tree_frame_${g}`),kind:"",svg:Se[g]||"",cat:g,letter:"",depth:0,hasChildren:g==="main"&&(t.length>0||s==="template"),shut:g!=="main",current:!1,hidden:!1}),f={kind:s,header:d("header"),main:d("main"),footer:d("footer"),template:null},k=s&&s!=="template"?String(T("dock:collection-view")||""):"";return k&&(f.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:dt(e,k)?.display||Be(k.replace(/^view:/,"")),kind:"",svg:Se.section,cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),f}function bo(e,t){return at(e,a=>a.tag===t)}function at(e,t){for(const a of e||[]){if(!a.kind&&t(a))return a;const n=at(a.children,t);if(n)return n}return null}function Ai(e){const t=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},a=new Map;for(const n of["header","footer"]){const s=pa(t[n]?.type);s&&a.set(s,n)}return a}function Mi(e,t){let a=e.indexOf(t)+1;for(;a<e.length&&e[a].depth>t.depth;)a+=1;return a}function Ri(e,t){const a=it(e);(t==="main"||t==="template"?a?.querySelector("main"):a?.querySelector(`[data-sve-chrome="${t}"]`))?.scrollIntoView({behavior:"smooth",block:"start"})}function Mt(e){const t=String(T("dock:chrome-open",e.document)||"");return t!=="header"&&t!=="footer"?!1:(zn(e),de({source:te,type:ee.SVE_FORCE_EXIT_CHROME},e),!0)}function Oi(e){e.clearTimeout($e),Q="",K="",j.clear(),F=null,Le=!1,oe(),qe()}function _o(e,t){if(e.document,String(T("dock:chrome-kind")||"")===t)return;if(Oi(e),t==="main"){Mt(e),T("dock:open-file",sa);return}if(t==="template"){const l=String(T("dock:collection-view")||"");l&&(Mt(e),T("dock:open-file",l));return}if(t!=="header"&&t!=="footer")return;const a=it(e)?.querySelector(`[data-sve-chrome="${t}"]`);a?(a.scrollIntoView({block:"nearest"}),a.dispatchEvent(new a.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:te,type:ee.OPEN_CHROME,kind:t},e.location.origin);const n=Date.now(),s=async()=>{if(String(T("dock:chrome-kind")||"")!==t){Date.now()-n<3e4&&e.setTimeout(s,250);return}await(T("dock:load-settled")||null),cn(e)};e.setTimeout(s,250)}function Tt(e,t){W(e.document)&&nn(e,t)}function nn(e,t){const a=t[0],n=!!T("dock:component-src"),s=n?"":T("dock:current-uid")||"";de({source:te,type:ee.SVE_HTML_PICK,on:!0,uid:s,uids:s?jt(s,e.document):[],all:n,tag:a?.tag||"",klass:a?.klass||"",nodes:$a(t)},e)}function ze(e){if(!e)return;const t=(a,n)=>{for(const s of a||[]){if(s.path===e)return!0;if(t(s.children,n+1))return n===0||s.path===Ze?j.delete(s.path):j.add(s.path),!0}return!1};t(Ce,0)}function Di(e,t){if(ye)return;const a=o.rows.find(n=>n.id===t);!a||a.kind||(F=t,o.rows.forEach(n=>{n.current=n.id===t}),o.editingId=t,o.draft=a.name,e.setTimeout(()=>{const n=W(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function To(e,t){const a=o.editingId;if(!a)return;const n=o.rows.find(s=>s.id===a);o.editingId=null,t&&n&&(n.sectionRoot?Fi(e,n.sectionRoot,o.draft):si(T("dock:current-type")||"",n.path,o.draft,n.base||n.klass)),o.draft="",A(e)}function Fi(e,t,a){const n=lt(e)||"page_sections",s=String(a||"").replace(/\s+/g," ").trim();for(const l of Bt(e.document)||[]){const r=Nt(l.values),d=r&&typeof r=="object"?r[n]:null;if(!Array.isArray(d))continue;const f=d.findIndex(y=>y&&typeof y=="object"&&[y._visual_id,y.id,y._id].includes(t));if(f===-1)continue;const k=en(e,d[f])||d[f].type,g=dt(e,k)?.display||Be(k)||k,h=JSON.parse(JSON.stringify(d));return h[f]={...h[f]},!s||s===g?delete h[f]._sve_label:h[f]._sve_label=s,l.setFieldValue(n,h),!0}return!1}function Bi(e,t){const a=o.rows.find(d=>d.id===t);if(!a||!(a.videoNth>=0))return;const n=String(T("dock:current-type")||""),s=Eo(e,n),l=!s.has(a.videoNth);l?s.add(a.videoNth):s.delete(a.videoNth);const r=String(T("dock:current-uid")||"");Un(e,n,s),de({source:te,type:ee.SVE_VIDEO_HOLD,uid:r,uids:r?jt(r,e.document):[],nth:a.videoNth,on:l},e),A(e)}function Yt(e){return!!o.rows.find(t=>t.id===e)?.fixed}function Ni(e,t){Yt(t)||Wt(e,t,Sa)}function ji(e,t){if(Yt(t))return;const a=o.rows.find(n=>n.id===t)?.sectionRoot;if(a){e.postMessage({source:te,type:ee.DUPLICATE_ROW,uid:a},e.location.origin);return}Wt(e,t,wa)}function an(e,t){Jn(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const a=e.document;ta({uid:t},a,e)})}function Vi(e,t,a){Q===a&&(e.clearTimeout($e),Q="",K=""),F=null,Le=!1,Lt="";const n=ut(e,t),s=n.find(l=>l.uid!==a)||n[0];s?ht(e,t,n,s.uid,""):(K="",o.rows=[],o.sections=[],o.frame=null,o.pageBuilder=!0,A(e)),e.setTimeout(()=>{W(e.document)&&A(e)},0)}Io("row:removed",({uid:e,parentPath:t,doc:a,win:n})=>{t!==lt(n)||!W(n.document)||Vi(n,a,e)});function Ki(e,t){if(Yt(t))return;const a=o.sections?.find(s=>s.row?.id===t),n=a?a.row?.section||a.uid:o.rows.find(s=>s.id===t)?.sectionRoot;if(n){an(e,n);return}Wt(e,t,Ca)}function Wt(e,t,a){if(T("dock:is-locked"))return;const n=U(),s=o.rows.find(r=>r.id===t);if(!s)return;const l=a(n,s);l!==n&&Pe(l)}function oe(){ve?.dismiss(),ve=null}const qi='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',Gi='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>';function sn(e,t){const a=o.sections?.find(f=>f.uid===t),n=a?.type||"";if(!n||!jo(e))return[];const s=a.label||n,l=Ja(e,n),r=()=>e.Statamic?.$toast?.error(u(e,"section_update_failed")),d=[{label:u(e,"static_section_insertable"),icon:l?Gi:qi,onPick:()=>{oe(),uo(e,{handle:n,hidden:!l}).then(()=>{e.Statamic?.$toast?.success(u(e,l?"section_shown_to_editors":"section_hidden_from_editors",{name:s})),wt(e)}).catch(r)}}];return a.static&&d.push({label:u(e,"section_add_fields"),onPick:()=>{oe(),uo(e,{handle:n,fields:!0}).then(()=>{e.Statamic?.$toast?.success(u(e,"section_fields_added",{name:s})),wt(e),A(e),Mo(e,n)}).catch(r)}}),d}function Ui(e,t,a){const n=a.row?.section||a.uid;n&&(ve=be(e.document,Kt,{items:[...sn(e,n),{label:u(e,"html_tree_remove_section"),danger:!0,onPick:()=>{oe(),an(e,n)}}],x:t.clientX,y:t.clientY,onClose:()=>{ve=null}}))}function zi(e,t,a){oe();const n=o.sections?.find(d=>d.row?.id===a);if(n){Ui(e,t,n);return}const s=o.rows.find(d=>d.id===a);if(!s)return;rt(e,a,o.rows);const l={x:t.clientX,y:t.clientY},r=d=>{d.length&&(ve?.dismiss(),ve=be(e.document,Kt,{items:d,x:l.x,y:l.y,onClose:()=>{ve=null}}))};if(s.kind==="component"){Xi(e,s,r);return}s.kind!=="slot"&&o.canEdit&&r([...s.sectionRoot?sn(e,s.sectionRoot):[],{label:u(e,"component_make"),onPick:()=>{oe(),mi(e,s,{onDone:()=>A(e),onError:d=>{e.alert(d?.status===409?u(e,"component_exists"):u(e,"component_failed"))}})}}])}const xo=(e,t)=>{oe(),T("dock:open-template",t)};function Xi(e,t,a){if(!ma(t.src)){a([{label:u(e,"component_open_named",{name:t.name||t.src}),onPick:()=>xo(e,`view:partials/${t.src}`)}]);return}a([{label:u(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const s=Array.isArray(n.items)?n.items:[];a(s.length?s.map(l=>({label:u(e,"component_open_named",{name:l.label}),onPick:()=>xo(e,l.type)})):[{label:u(e,"component_none"),onPick:null}])}).catch(()=>a([{label:u(e,"component_none"),onPick:null}]))}function Yi(e,t,a){if(t.button!==0||T("dock:is-locked")||o.editingId||t.target?.closest?.("button, input"))return;qe(),me=a,De={x:t.clientX,y:t.clientY},Qe=t.currentTarget,et=t.pointerId;const n=l=>Wi(e,l),s=l=>Zi(e,l);Et=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",s,!0),e.document.removeEventListener("pointercancel",s,!0),Et=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",s,!0),e.document.addEventListener("pointercancel",s,!0)}function Wi(e,t){if(!me||!De)return;const a=t.clientX-De.x,n=t.clientY-De.y;if(!o.dragging&&a*a+n*n<25)return;if(!o.dragging){o.dragging=!0;try{Qe?.setPointerCapture?.(et)}catch{}}t.preventDefault();const s=e.document.elementFromPoint(t.clientX,t.clientY),l=s?.closest?.("[data-sve-ht-slot]");if(l){const h=l.getAttribute("data-sve-ht-id");if(h&&h!==me){o.dropId=h,o.dropPlace="inside";return}}const r=s?.closest?.("[data-sve-ht-row]"),d=r?.getAttribute("data-sve-ht-id");if(!d||d===me){o.dropId=null,o.dropPlace=null;return}const f=o.rows.find(h=>h.id===d),k=o.rows.find(h=>h.id===me);if(!f||f.context||k&&f.path.startsWith(`${k.path}/`)){o.dropId=null,o.dropPlace=null;return}const g=r.getBoundingClientRect();o.dropId=d,o.dropPlace=Ta(t.clientY-g.top,g.height,!Fo(f.tag)&&!Do(f))}function Zi(e,t){const a=me,n=o.dropId,s=o.dropPlace||"after",l=o.dragging;if(qe(),l&&(ye=!0,e.setTimeout(()=>{ye=!1},0)),!l||T("dock:is-locked")||!a||!n||a===n)return;t?.preventDefault?.();const r=U(),d=xa(r,Ce,a,n,s);d!==r&&Pe(d)}function qe(){try{Qe?.releasePointerCapture?.(et)}catch{}Et?.(),me=null,De=null,Qe=null,et=null,o.dragging=!1,o.dropId=null,o.dropPlace=null}function Ji(e,t,a){if(t.button!==0||!a||o.editingId||t.target?.closest?.("button, input"))return;rn(),Ve=a,Fe={x:t.clientX,y:t.clientY},tt=t.currentTarget,ot=t.pointerId;const n=l=>Qi(e,l),s=l=>el(e,l);Ht=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",s,!0),e.document.removeEventListener("pointercancel",s,!0),Ht=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",s,!0),e.document.addEventListener("pointercancel",s,!0)}function Qi(e,t){if(!Ve||!Fe)return;const a=t.clientX-Fe.x,n=t.clientY-Fe.y;if(!o.dragging&&a*a+n*n<25)return;if(!o.dragging){o.dragging=!0;try{tt?.setPointerCapture?.(ot)}catch{}}t.preventDefault();const l=e.document.elementFromPoint(t.clientX,t.clientY)?.closest?.("[data-sve-ht-sec-uid]"),r=l?.getAttribute("data-sve-ht-sec-uid")||"";if(!r||r===Ve){o.sectionDrop=null;return}const d=l.getBoundingClientRect();o.sectionDrop={uid:r,place:t.clientY-d.top<d.height/2?"before":"after"}}function el(e,t){const a=Ve,n=o.sectionDrop,s=o.dragging;rn(),s&&(ye=!0,e.setTimeout(()=>{ye=!1},0)),!(!s||!a||!n?.uid||n.uid===a)&&(t?.preventDefault?.(),tl(e,a,n.uid,n.place))}function rn(){try{tt?.releasePointerCapture?.(ot)}catch{}Ht?.(),Ve=null,Fe=null,tt=null,ot=null,o.dragging=!1,o.sectionDrop=null}function tl(e,t,a,n){const s=lt(e)||"page_sections";for(const l of Bt(e.document)||[]){const r=Nt(l.values),d=r&&typeof r=="object"?r[s]:null;if(!Array.isArray(d))continue;const f=y=>d.findIndex(x=>x&&typeof x=="object"&&[x._visual_id,x.id,x._id].includes(y)),k=f(t),g=f(a);if(k===-1||g===-1||k===g)return!1;let h=n==="before"?g:g+1;return k<h&&(h-=1),h===k?!1:(e.postMessage({source:te,type:ee.MOVE,uid:t,toIndex:h},e.location.origin),e.setTimeout(()=>A(e),60),!0)}return!1}function ln(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function Rt(e,t){if(t?.kind==="component"){ol(e,t);return}if(Y.callOpen&&(Y.callOpen=!1,Y.callStore=null,G.forget(),qt(e)),t?.kind!=="antlers"){o.inspect=null;return}const a=t.id;if(t.tag==="else"){o.inspect={key:a,title:u(e,"antlers_condition"),mode:"note",note:u(e,"antlers_else_note")};return}if(t.antlers==="loop"){const n=t.loopKind==="collection",s=pe?.id===t.id?pe.dir:"",l=t.sortDir||s;o.inspect={key:a,title:u(e,"antlers_loop"),mode:"loop",loopKind:n?"collection":"field",kinds:[{id:"field",label:u(e,"antlers_loop_field")},{id:"collection",label:u(e,"antlers_loop_collection")}],collections:ln(e),value:t.expr||"",placeholder:u(e,n?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:u(e,"antlers_sort"),dir:l,needsField:l==="asc"||l==="desc",field:t.sortField||"",pickable:!n,placeholder:u(e,n?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:u(e,"antlers_sort_none")},{id:"asc",label:u(e,"antlers_sort_asc")},{id:"desc",label:u(e,"antlers_sort_desc")},{id:"random",label:u(e,"antlers_sort_random")}]},limit:{title:u(e,"antlers_limit"),value:t.limit||"",placeholder:u(e,"antlers_limit_placeholder")},branches:[]};return}o.inspect={key:a,title:u(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:u(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:u(e,"antlers_add_elseif")},{id:"else",label:u(e,"antlers_add_else")}]}}function ol(e,t){if(!va(e)){o.inspect=null;return}if(!t.src)return;const a=t.id;if(o.inspect={key:a,title:u(e,"component_props_values"),mode:"note",note:u(e,"code_dock_loading")},ga()){const n={},s={},l=new Map;for(const[r,d]of ya(U().slice(t.from,t.to))){const f=ka(r);f&&(r!==f||!l.has(f))&&l.set(f,d)}for(const[r,d]of l)d.bound?s[r]=d.value:n[r]=d.value;go!==a&&(go=a,je.clear());for(const r of je)r in s||(s[r]="");o.inspect=null,Y.callOpen=!0,Y.title=Y.title||u(e,"component_props"),Y.callTitle=t.klass||t.name||t.src,Y.callStore=G.ui,G.ui.canBind=!0,G.ui.dataTitle=u(e,"data_vars_title"),G.ui.exprPlaceholder=u(e,"component_props_expr"),G.ui.onToggleBind=(r,d)=>al(e,r,d),G.ui.onExpr=(r,d)=>So(e,r,d),G.ui.onPickData=(r,d)=>T("dock:data-menu",{anchor:d,at:t.from,onPick:f=>So(e,r,String(f?.var||"").trim())}),G.load(e,{key:`${t.src}::${a}`,src:t.src,params:n,bindings:s,readOnly:T("dock:is-locked")===!0}),G.watch(e,{src:t.src,write:r=>nl(e,r,s)}),qt(e);return}ba(e,t.src).then(n=>{if(o.inspect?.key===a){if(!n.length){o.inspect={key:a,title:u(e,"component_props_values"),mode:"note",note:u(e,"component_props_values_none")};return}o.inspect={key:a,title:u(e,"component_props_values"),mode:"props",inheritLabel:u(e,"component_props_inherit"),rows:_a(n,U().slice(t.from,t.to))}}})}function nl(e,t,a={}){const n=o.rows.find(r=>r.id===F);if(n?.kind!=="component"||T("dock:is-locked"))return;let s=U(),l=n.to;for(const[r,d]of Object.entries(t||{})){if(r in a)continue;const f=s.length,k=Gt(s,{from:n.from,to:l},r,d);k!==s&&(l+=k.length-f,s=k)}s!==U()&&(Pe(s,{save:!0}),A(e))}function al(e,t,a){a?je.add(t):je.delete(t),dn(e,t,"",a),A(e)}function So(e,t,a){je.add(t),dn(e,t,a,!0),A(e)}function dn(e,t,a,n){const s=o.rows.find(d=>d.id===F);if(s?.kind!=="component"||T("dock:is-locked"))return;const l=U(),r=Gt(l,s,t,a,{bound:n});r!==l&&Pe(r,{save:!0})}function st(){const e=o.rows.find(t=>t.id===F);return e?.kind==="antlers"&&!T("dock:is-locked")?e:null}function ge(e,t){const a=st();if(!a)return;const n=U(),s=t(n,a);s!==n&&(Pe(s),A(e))}function wo(e,t,a,n){const s=o.rows.find(d=>d.id===F);if(s?.kind!=="component"||T("dock:is-locked"))return;const l=U(),r=Gt(l,s,t,a,{bound:n});r!==l&&(Pe(r,{save:!0}),A(e))}function sl(e,t){ge(e,(a,n)=>n.antlers==="loop"?$t(a,n,n.loopKind==="collection"?"collection":"field",t):vi(a,n,t))}function rl(e,t){const a=st();if(!a||a.antlers!=="loop")return;const n=a.loopKind==="collection"?"collection":"field";if(t!==n){if(t==="collection"){const s=ln(e)[0]?.handle;if(!s)return;ge(e,(l,r)=>$t(l,r,"collection",s));return}ge(e,(s,l)=>$t(s,l,"field",l.handle||"items"))}}function il(e,t){ge(e,(a,n)=>_i(a,n,t))}function ll(e,t){if(!e||!t||Do(t)||Fo(t.tag))return null;const a=fa(e,t);if(a<t.openTo)return null;const n=e.lastIndexOf(`
`,a-1)+1;return e.slice(n,a).trim()===""&&n>t.openTo?n-1:a}function rt(e,t,a){if(ye)return;const n=(a||o.rows).find(s=>s.id===t);n&&(F=t,o.rows.forEach(s=>{s.current=s.id===t}),Rt(e,n),!Xt()&&(T("dock:reveal-html",{from:n.from,to:n.to,caret:ll(U(),n)}),T("dock:tw-follow"),de({source:te,type:ee.SVE_HTML_PICK_FOCUS,path:n.path},e)))}function dl(e,t){if(!t)return"";const a=[],n=(s,l)=>{for(const r of s||[]){const d=l||r.path===e;r.kind==="component"&&r.src===t&&a.push({path:r.path,inside:d}),n(r.children,d)}};return n(Ce,!1),(a.find(s=>s.inside)||a[0])?.path||""}function cl(e,t){if(!t||!W(e.document))return;Le=!1,ze(t),A(e);const a=o.rows.find(n=>n.path===t);a&&(rt(e,a.id,o.rows),e.setTimeout(()=>{W(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function Ot(e){if(We)return;const t=()=>{o.editingId||o.dragging||(e.clearTimeout(Je),Je=e.setTimeout(()=>{W(e.document)&&A(e)},80))},a=()=>{if(t(),T("dock:on-empty-page")===!0){const n=ut(e,e.document);n[0]&&ht(e,e.document,n,n[0].uid,"")}};We=Io("dock:html-changed",t),e.document.addEventListener("sve-page-structure",a),Pt=()=>{e.document.removeEventListener("sve-page-structure",a)}}function ul(e){We?.(),We=null,Pt?.(),Pt=null,e?.clearTimeout?.(Je),Je=0}function Zt(e){const t=W(e.document);if(de({source:te,type:ee.SVE_HTML_PICK,on:!1},e),ul(e),G.forget(),Y.callOpen=!1,Y.callStore=null,qt(e),qe(),oe(),da(e),F=null,o.inspect=null,o.editingId=null,o.draft="",o.sections=[],o.pageBuilder=!1,o.layoutFile=!1,Q="",e?.clearTimeout?.($e),!t){St(e);return}t.remove(),Ft.headerTab==="html_tree"&&Qn(e,null),An(e),$o(e),Lo(e),St(e)}function _l(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=Xe,Re(t,Ko,{title:u(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>Zt(e)))}function Tl(e){Ot(e),A(e)}function cn(e){const t=e.document;if(!Rn(e,"html_tree"))return;if(W(t)){Ot(e),A(e);return}if(!Qo(t))return;Le=!0,j.clear(),On(e,[Xe]);const a=t.createElement("div");a.id=Xe,a.style.cssText=Dn,Re(a,Ko,{title:u(e,"html_tree")}),a.querySelector("[data-sve-close]")?.addEventListener("click",()=>Zt(e)),Fn(e,a),$o(e),Lo(e),St(e),Ot(e),A(e)}function xl(e){if(W(e.document)){Zt(e);return}cn(e)}Vt("html-tree:open-section",e=>{const t=window,a=t.document,n=ut(t,a),s=n.find(l=>l.uid===e||l.ids.includes(e));return s?(ht(t,a,n,s.uid,""),{uid:s.uid,ids:s.ids}):null});Vt("html-tree:from-preview",({path:e,src:t}={})=>{Ro(window,e)||cl(window,dl(e,t)||e)});Vt("html-tree:arm-pick",e=>{const t=window;return e?(nn(t,ct(U())),!0):(W(t.document)||de({source:te,type:ee.SVE_HTML_PICK,on:!1},t),!0)});function Sl(){le.clear(),we.clear(),ke.length=0}export{Ti as HTML_TREE_STYLE_ID,bl as armHtmlTreePrefetch,Sl as clearHtmlTreeTemplates,oe as closeHtmlTreeMenu,Zt as closeHtmlTreePanel,Ci as ensureHtmlTreeStyles,_l as fillHtmlTreePane,F as htmlTreeActiveId,W as htmlTreePanel,Je as htmlTreeTimer,We as htmlTreeUnhook,cn as openHtmlTreePanel,A as renderHtmlTree,Tl as showHtmlTreePane,ul as stopWatchHtmlTreeDock,xl as toggleHtmlTreePanel,Ot as watchHtmlTreeDock};
