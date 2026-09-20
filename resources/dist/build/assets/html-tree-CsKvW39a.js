const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-CV7No16T.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{_ as Te,k as X,l as Ln,p as Dt,o as g,a as k,b as S,s as _,t as C,F as H,w as Le,d as K,b4 as $n,g as $,v as Ot,b5 as En,y as b,h as p,j as oe,C as wn,i as Bt,b6 as kt,b7 as yt,b8 as Hn,b9 as In,ba as An,bb as Mn,bc as Ft,z as ce,ap as Rn,bd as o,u,f as Dn,e as On,q as Y,x as Bn,be as $e,bf as Fn,B as fe,c as pe,N as jn,G as qn,aN as lt,aq as Je,am as Kn,aP as jt,aQ as qt,af as Vn,ag as bt,S as Ee,V as we,O as Nn,aO as zn,an as Un,ao as Xn,bg as _t,bh as Yn,U as Kt,A as Vt,a8 as Se,J as qe,K as Ke,ax as ct,ay as He,I as Wn,bi as Gn,aS as Zn,aT as Jn,aw as Qn,bj as eo,b0 as to,ae as Nt,aK as no,aF as oo}from"./addon-bU3h08te.js";import{M as se,S as ae}from"./protocol-D3FYhCm9.js";import{canEditFields as so,currentSetHandle as ao,openFieldsetOverlay as zt}from"./section-fields-D7Tl1rn7.js";import{D as F,E as io,F as dt,G as ro,t as lo,I as ut,v as co,z as uo,b as Ve,l as xt,J as Ut,q as ho,K as Xt,L as po,H as fo,M as ht,N as Yt,O as mo,h as vo,c as go,Q as ko,R as yo,S as bo,T as _o,U as xo,V as To,W as So,X as Co,Y as Po,Z as Lo}from"./tw-classes-CkAbjkYh.js";import{a as $o}from"./html-pick-align-CK-9iH9_.js";import"./ai-text-icon-B7uCWIwa.js";import"./FieldsetOverlay-BlMx_GRH.js";const Eo={class:"sve-dialog__title"},wo={for:"sve-new-section-group"},Ho=["value"],Io={for:"sve-new-section-name"},Ao=["placeholder"],Mo={key:1,class:"sve-dialog__toggle"},Ro={key:2,class:"sve-dialog__note"},Do={class:"sve-dialog__actions"},Oo=["disabled"],Bo=["disabled"],Fo={__name:"NewSectionPrompt",props:{heading:{type:String,required:!0},groupLabel:{type:String,required:!0},nameLabel:{type:String,required:!0},placeholder:{type:String,default:""},note:{type:String,default:""},groups:{type:Array,required:!0},toggleLabel:{type:String,default:""},toggleOn:{type:Boolean,default:!0},cancelLabel:{type:String,required:!0},saveLabel:{type:String,required:!0},onOk:{type:Function,required:!0},onClose:{type:Function,required:!0}},setup(e){const t=e,s=X(""),n=X(t.groups[0]?.key??""),a=X(t.toggleOn),r=X(null),i=X(!1);Ln(()=>Dt(()=>r.value?.focus()));function c(){const h=s.value.trim();if(!h||t.groups.length&&!n.value||i.value){r.value?.focus();return}i.value=!0,t.onOk(h,n.value,a.value)}function f(h){h.target===h.currentTarget&&t.onClose()}function m(h){h.key==="Enter"?c():h.key==="Escape"&&t.onClose()}return(h,l)=>(g(),k("div",{class:"sve-dialog-overlay",onClick:f},[S("div",{class:"sve-dialog",onClick:l[4]||(l[4]=_(()=>{},["stop"]))},[S("div",Eo,C(e.heading),1),e.groups.length?(g(),k(H,{key:0},[S("label",wo,C(e.groupLabel),1),Le(S("select",{id:"sve-new-section-group","onUpdate:modelValue":l[0]||(l[0]=d=>n.value=d),onKeydown:m},[(g(!0),k(H,null,K(e.groups,d=>(g(),k("option",{key:d.key,value:d.key},C(d.display),9,Ho))),128))],544),[[$n,n.value]])],64)):$("",!0),S("label",Io,C(e.nameLabel),1),Le(S("input",{id:"sve-new-section-name",ref_key:"input",ref:r,"onUpdate:modelValue":l[1]||(l[1]=d=>s.value=d),type:"text",placeholder:e.placeholder,onKeydown:m},null,40,Ao),[[Ot,s.value]]),e.toggleLabel?(g(),k("label",Mo,[Le(S("input",{"onUpdate:modelValue":l[2]||(l[2]=d=>a.value=d),type:"checkbox",onKeydown:m},null,544),[[En,a.value]]),S("span",null,C(e.toggleLabel),1)])):$("",!0),e.note?(g(),k("p",Ro,C(e.note),1)):$("",!0),S("div",Do,[S("button",{type:"button",class:"is-cancel",disabled:i.value,onClick:l[3]||(l[3]=(...d)=>e.onClose&&e.onClose(...d))},C(e.cancelLabel),9,Oo),S("button",{type:"button",class:"is-primary",disabled:i.value,onClick:c},C(e.saveLabel),9,Bo)])])]))}},Wt=Te(Fo,[["__scopeId","data-v-3ef3bbc9"]]),Gt="/!/sve/section-types",jo="static_sections";async function qo(e){const t=await e.fetch(Gt,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!t.ok)throw new Error(`section-types ${t.status}`);const s=await t.json(),n=new Map;for(const a of s.types||[])a?.group&&a.group!==jo&&!n.has(a.group)&&n.set(a.group,a.group_display||a.group);return[...n].map(([a,r])=>({key:a,display:r}))}const ke=new Map;function Ko(e){e?.handle&&ke.set(e.handle,{static:!!e.static,hidden:!!e.hidden})}function Vo(e,t){return t?ke.has(t)?ke.get(t).static:e.Statamic?.$config?.get?.("sveSetMeta")?.[t]?.static===!0:!1}function No(e,t){if(!t)return!1;if(ke.has(t))return ke.get(t).hidden;const s=e.Statamic?.$config?.get?.("sveSectionTypes");return Array.isArray(s)&&s.some(n=>n?.handle===t&&n.hidden===!0)}async function Zt(e,t,s){const n=await e.fetch(Gt,{method:t,headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Bt(e),Accept:"application/json"},credentials:"same-origin",body:JSON.stringify(s)}),a=await n.json().catch(()=>({}));if(!n.ok){const r=new Error(a.error||`section-types ${n.status}`);throw r.reason=a.error,r}return Ko(a.section),a}function zo(e,{display:t,group:s="",static:n=!1,hidden:a=!1}){return Zt(e,"POST",{display:t,group:s,static:n,hidden:a})}function Tt(e,{handle:t,hidden:s,fields:n=!1}){const a={handle:t,fields:n};return typeof s=="boolean"&&(a.hidden=s),Zt(e,"PATCH",a)}async function Uo(e,t,s=null,n=null){if(!t||typeof kt!="function"||typeof yt!="function")return null;const a=await kt(e,t);if(!a)return null;n&&Array.isArray(a.definitions)&&Hn(t,{display:n.display||t,icon:n.icon||null,hide:n.hidden===!0,fields:a.definitions,group_display:n.group_display||n.group||""},n.group||"");const r=In(),i=An(e,"page",{handle:t},a?.defaults,r),c=Mn(i,a?.new||{},a?.defaults);return yt(e,e.document,s,i,c)?i:null}const St=700,Xo=17;function Yo(e,t){const s=(t||[]).filter(Boolean);if(!s.length)return;let n=0;const a=()=>{n+=1;const r=Ft(e),i=r?s.some(c=>r.querySelector(`[data-sid="${CSS.escape(c)}"]`)):!0;i&&ce({source:ae,type:se.SVE_ACTIVATE,ids:s},e),(i?!r&&n<6:n<Xo)&&e.setTimeout(a,St)};e.setTimeout(a,St)}function Jt(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function Wo(e){return new Promise(t=>{let s=!1;const n=r=>{s||(s=!0,a.dismiss(),t(r==="static"||r==="fields"?r:null))},a=oe(e.document,wn,{title:p(e,"section_new_kind"),body:p(e,"section_new_kind_note"),buttons:[{value:"cancel",label:p(e,"cancel"),variant:"ghost"},{value:"static",label:p(e,"section_new_static"),variant:"primary"},{value:"fields",label:p(e,"section_new_with_fields"),variant:"primary"}],onPick:n,onClose:()=>n(null)})})}const Go=`<section class="[ ] py-800">
    
</section>
`;function Zo(e){if(b("dock:is-locked")===!0)return e.Statamic?.$toast?.error(p(e,"code_dock_locked")),!1;const s=`${String(b("dock:html")||"").replace(/\s+$/,"")}

${Go}`;return b("dock:set-html",s)!==!0?(e.Statamic?.$toast?.error(p(e,"section_new_failed")),!1):(b("dock:save-now"),e.Statamic?.$toast?.success(p(e,"section_new_template_done")),!0)}async function Qt(e,t,s,{afterUid:n,onDone:a,onError:r}){try{const i=await zo(e,s);t.dismiss(),e.Statamic?.$toast?.success(p(e,"section_created",{name:i.section?.display||s.display})),Qe(e);const c=i.section?.handle?{...i.section,group_display:(i.section_types||[]).find(m=>m?.handle===i.section.handle)?.group_display||""}:null,f=await Uo(e,i.section?.handle,n,c);!f&&i.section?.handle&&b("dock:open-template",i.section.handle),a?.({...i,uid:f?._visual_id||""})}catch(i){t.dismiss(),e.Statamic?.$toast?.error(p(e,i.reason==="bad_name"?"section_new_bad_name":"section_new_failed")),r?.(i)}}function Qe(e){e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"))}function Jo(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){const r=oe(e.document,Wt,{heading:p(e,"static_section_new"),groupLabel:"",nameLabel:p(e,"section_new_name"),placeholder:p(e,"section_new_placeholder"),note:p(e,"static_section_note"),groups:[],toggleLabel:p(e,"static_section_insertable"),cancelLabel:p(e,"cancel"),saveLabel:p(e,"section_new_create"),onClose:a,onOk:(i,c,f)=>{Qt(e,r,{display:i,static:!0,hidden:!f},{afterUid:t,onDone:s,onError:n})}})}function Qo(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){(async()=>{let r=[];try{r=await qo(e)}catch(c){n?.(c),e.Statamic?.$toast?.error(p(e,"section_new_failed"));return}if(!r.length){n?.(new Error("no groups")),e.Statamic?.$toast?.error(p(e,"section_new_failed"));return}const i=oe(e.document,Wt,{heading:p(e,"section_new"),groupLabel:p(e,"section_new_group"),nameLabel:p(e,"section_new_name"),placeholder:p(e,"section_new_placeholder"),note:p(e,"section_new_note"),groups:r,cancelLabel:p(e,"cancel"),saveLabel:p(e,"section_new_create"),onClose:a,onOk:(c,f)=>{Qt(e,i,{display:c,group:f},{afterUid:t,onDone:s,onError:n})}})})()}const es={key:0,class:"sve-ht-inspect"},ts={class:"sve-ht-inspect__head"},ns={key:0,class:"sve-ht-inspect__note"},os={key:2,class:"sve-ht-inspect__props"},ss={class:"sve-ht-inspect__proplabel"},as={key:0},is=["value","disabled","onChange"],rs={value:""},ls=["value"],cs=["value"],ds=["value","placeholder","onChange"],us=["title","disabled","onClick"],hs=["title","disabled","onClick"],ps={key:0,class:"sve-ht-inspect__seg"},fs=["data-active","disabled","onClick"],ms=["value","disabled"],vs={key:0,value:""},gs=["value"],ks={key:2,class:"sve-ht-inspect__box"},ys=["value","placeholder","disabled","onKeydown"],bs=["title","disabled"],_s={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},xs=["value","disabled"],Ts=["value"],Ss={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},Cs=["value","placeholder","disabled"],Ps=["title","disabled"],Ls={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},$s=["value","placeholder","disabled"],Es={key:4,class:"sve-ht-inspect__add"},ws=["disabled","onClick"],ze='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',Hs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',Is={__name:"HtmlTreeInspector",setup(e){const t=X(null);Rn(t,m=>o.onPropHost?.(m||null));const s=X(null),n=X(null);function a(m){o.onInspectCommit?.(m.target.value)}function r(m,h,l){!m||!h||(m.value=h,m.focus(),m.setSelectionRange(h.length,h.length),l(h))}function i(m,h){o.onInspectData?.(m.currentTarget,l=>o.onPropValue?.(h.handle,l,!0))}function c(m){o.onInspectData?.(m.currentTarget,h=>r(s.value,h,l=>o.onInspectCommit?.(l)))}function f(m){o.onInspectData?.(m.currentTarget,h=>r(n.value,h,l=>o.onLoopSortField?.(l)))}return(m,h)=>u(o).inspect?(g(),k("div",es,[S("div",ts,C(u(o).inspect.title),1),u(o).inspect.mode==="note"?(g(),k("div",ns,C(u(o).inspect.note),1)):u(o).inspect.mode==="statamic"?(g(),k("div",{key:1,ref_key:"propHost",ref:t,class:"sve-ht-inspect__form"},null,512)):u(o).inspect.mode==="props"?(g(),k("div",os,[(g(!0),k(H,null,K(u(o).inspect.rows,l=>(g(),k("label",{key:l.handle,class:"sve-ht-inspect__prop"},[S("span",ss,[Dn(C(l.label)+" ",1),l.bound?(g(),k("em",as,":")):$("",!0)]),S("span",{class:On(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":l.type==="select"||l.type==="link"}])},[l.type==="select"&&!l.bound?(g(),k("select",{key:0,value:l.value,disabled:!u(o).canEdit,onChange:d=>u(o).onPropValue?.(l.handle,d.target.value,!1)},[S("option",rs,C(l.placeholder||u(o).inspect.inheritLabel),1),l.value&&!l.options.includes(l.value)?(g(),k("option",{key:0,value:l.value},C(l.value),9,ls)):$("",!0),(g(!0),k(H,null,K(l.options,d=>(g(),k("option",{key:d,value:d},C(d),9,cs))),128))],40,is)):(g(),k("input",{key:1,type:"text",value:l.value,placeholder:l.placeholder||u(o).inspect.inheritLabel,onChange:d=>u(o).onPropValue?.(l.handle,d.target.value,l.bound)},null,40,ds)),l.type==="link"?(g(),k("button",{key:2,type:"button","data-sve-ht-data":"",title:u(o).pageTitle,disabled:!u(o).canEdit,onClick:d=>u(o).onPropPage?.(d.currentTarget,l.handle),innerHTML:Hs},null,8,us)):$("",!0),S("button",{type:"button","data-sve-ht-data":"",title:u(o).dataTitle,disabled:!u(o).canEdit,onClick:d=>i(d,l),innerHTML:ze},null,8,hs)],2)]))),128))])):(g(),k(H,{key:3},[u(o).inspect.mode==="loop"?(g(),k("div",ps,[(g(!0),k(H,null,K(u(o).inspect.kinds,l=>(g(),k("button",{key:l.id,type:"button","data-active":l.id===u(o).inspect.loopKind?"":void 0,disabled:!u(o).canEdit,onClick:d=>u(o).onLoopKind?.(l.id)},C(l.label),9,fs))),128))])):$("",!0),u(o).inspect.mode==="loop"&&u(o).inspect.loopKind==="collection"?(g(),k("select",{key:u(o).inspect.key+":"+u(o).inspect.value,value:u(o).inspect.value,disabled:!u(o).canEdit,onChange:a},[u(o).inspect.value?$("",!0):(g(),k("option",vs,C(u(o).inspect.placeholder),1)),(g(!0),k(H,null,K(u(o).inspect.collections,l=>(g(),k("option",{key:l.handle,value:l.handle},C(l.title),9,gs))),128))],40,ms)):(g(),k("div",ks,[(g(),k("input",{ref_key:"field",ref:s,key:u(o).inspect.key,type:"text",value:u(o).inspect.value,placeholder:u(o).inspect.placeholder,disabled:!u(o).canEdit,spellcheck:"false",onKeydown:[h[0]||(h[0]=_(()=>{},["stop"])),Y(_(a,["prevent"]),["enter"])],onBlur:a},null,40,ys)),S("button",{type:"button","data-sve-ht-data":"",title:u(o).dataTitle,disabled:!u(o).canEdit,innerHTML:ze,onMousedown:h[1]||(h[1]=_(()=>{},["prevent"])),onClick:_(c,["stop","prevent"])},null,40,bs)])),u(o).inspect.sort?(g(),k(H,{key:3},[S("div",_s,C(u(o).inspect.sort.title),1),(g(),k("select",{key:u(o).inspect.key+":dir:"+u(o).inspect.sort.dir,value:u(o).inspect.sort.dir,disabled:!u(o).canEdit,onChange:h[2]||(h[2]=l=>u(o).onLoopSortDir?.(l.target.value))},[(g(!0),k(H,null,K(u(o).inspect.sort.dirs,l=>(g(),k("option",{key:l.id,value:l.id},C(l.label),9,Ts))),128))],40,xs)),u(o).inspect.sort.needsField?(g(),k("div",Ss,[(g(),k("input",{ref_key:"sortField",ref:n,key:u(o).inspect.key+":field",type:"text",value:u(o).inspect.sort.field,placeholder:u(o).inspect.sort.placeholder,disabled:!u(o).canEdit,spellcheck:"false",onKeydown:[h[3]||(h[3]=_(()=>{},["stop"])),h[4]||(h[4]=Y(_(l=>u(o).onLoopSortField?.(l.target.value),["prevent"]),["enter"]))],onBlur:h[5]||(h[5]=l=>u(o).onLoopSortField?.(l.target.value))},null,40,Cs)),u(o).inspect.sort.pickable?(g(),k("button",{key:0,type:"button","data-sve-ht-data":"",title:u(o).dataTitle,disabled:!u(o).canEdit,innerHTML:ze,onMousedown:h[6]||(h[6]=_(()=>{},["prevent"])),onClick:_(f,["stop","prevent"])},null,40,Ps)):$("",!0)])):$("",!0),S("div",Ls,C(u(o).inspect.limit.title),1),(g(),k("input",{key:u(o).inspect.key+":limit",type:"number",min:"1",value:u(o).inspect.limit.value,placeholder:u(o).inspect.limit.placeholder,disabled:!u(o).canEdit,onKeydown:[h[7]||(h[7]=_(()=>{},["stop"])),h[8]||(h[8]=Y(_(l=>u(o).onLoopLimit?.(l.target.value),["prevent"]),["enter"]))],onBlur:h[9]||(h[9]=l=>u(o).onLoopLimit?.(l.target.value))},null,40,$s))],64)):$("",!0),u(o).inspect.branches?.length?(g(),k("div",Es,[(g(!0),k(H,null,K(u(o).inspect.branches,l=>(g(),k("button",{key:l.id,type:"button",disabled:!u(o).canEdit,onClick:d=>u(o).onAddBranch?.(l.id)},C(l.label),9,ws))),128))])):$("",!0)],64))])):$("",!0)}},As=Te(Is,[["__scopeId","data-v-26254b75"]]),Ms={class:"sve-html-tree"},Rs={class:"sve-pane-bar","data-sve-pane-bar":""},Ds={"data-sve-right-title":""},Os={class:"sve-ht-tools"},Bs=["title"],Fs=["placeholder","aria-label","value"],js=["aria-label"],qs=["title","aria-label"],Ks={key:1,class:"sve-tree-exit"},Vs=["title"],Ns=["title"],zs='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',Us='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',Xs='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',Ys={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const t=p(window,"html_tree_search"),s=Jt(window),n=p(window,"section_new"),a=X(!1);function r(){a.value=!1}async function i(m){if(m)for(let h=0;h<20;h+=1){await Dt(),o.onRefresh?.();const l=o.sections.find(d=>d.uid===m);if(l){o.onSection?.(m),Yo(window,l.ids);return}await new Promise(d=>setTimeout(d,50))}}function c(){a.value||(a.value=!0,(async()=>{if(!(o.sections.length||o.pageBuilder)){Zo(window),r();return}const m=await Wo(window);if(!m){r();return}const h=o.sections.length?o.sections[o.sections.length-1].uid:null,l=d=>{r(),i(d?.uid)};if(m==="static"){Jo(window,{afterUid:h,onDone:l,onError:r,onClose:r});return}Qo(window,{afterUid:h,onDone:l,onError:r,onClose:r})})())}function f(m){const h=!!o.query;o.query=m,h!==!!m&&o.onQuery?.()}return(m,h)=>(g(),k("div",Ms,[S("div",Rs,[S("div",Ds,C(e.title),1),h[5]||(h[5]=Bn('<div data-sve-right-actions data-v-76fd5289><button type="button" data-sve-right-pin aria-pressed="false" data-v-76fd5289></button><button type="button" data-sve-close aria-label="Close" data-v-76fd5289><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-76fd5289><path d="M18 6 6 18" data-v-76fd5289></path><path d="m6 6 12 12" data-v-76fd5289></path></svg></button></div>',1))]),S("div",Os,[S("label",{class:"sve-ht-search",title:u(t)},[S("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:Us}),S("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:u(t),"aria-label":u(t),value:u(o).query,autocomplete:"off",spellcheck:"false",onInput:h[0]||(h[0]=l=>f(l.target.value)),onKeydown:[h[1]||(h[1]=_(()=>{},["stop"])),h[2]||(h[2]=Y(_(l=>f(""),["prevent"]),["escape"]))]},null,40,Fs),u(o).query?(g(),k("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":u(t),innerHTML:Xs,onClick:h[3]||(h[3]=l=>f(""))},null,8,js)):$("",!0)],8,Bs),u(s)&&(u(o).sections.length||u(o).pageBuilder||u(o).rows.length)?(g(),k("button",{key:0,type:"button",class:"sve-ht-new",title:u(n),"aria-label":u(n),innerHTML:zs,onClick:c},null,8,qs)):$("",!0)]),u(F).inSidebar?$("",!0):(g(),$e(io,{key:0})),h[6]||(h[6]=S("div",{"data-sve-html-tree-list":""},null,-1)),Fn(As),u(o).exitOpen&&!u(F).inSidebar?(g(),k("div",Ks,[S("span",{class:"sve-tree-exit__name",title:u(o).exitName},C(u(o).exitName),9,Vs),S("button",{type:"button",class:"sve-tree-exit__go",title:u(o).exitTitle,onClick:h[4]||(h[4]=l=>u(o).onExit?.())},C(u(o).exitLabel),9,Ns)])):$("",!0)]))}},en=Te(Ys,[["__scopeId","data-v-76fd5289"]]);function tn(e){return String(e||"").trim().toLowerCase()}function nn(e,t){return t?[e.name,e.tag,e.klass,e.label,e.src].filter(s=>typeof s=="string"&&s).join(" ").toLowerCase().includes(t):!0}function Ws(e,t){const s=tn(t);if(!s)return{rows:e,hits:new Set};const n=new Set;for(const i of e)nn(i,s)&&n.add(i.path);const a=[...n];return{rows:e.filter(i=>n.has(i.path)||a.some(c=>c.startsWith(`${i.path}/`))),hits:n}}const Gs=["title"],Zs={"data-sve-ht-indent":"","aria-hidden":"true"},Js=["data-sve-ht-cat"],Qs={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},ea={key:2,"data-sve-ht-letter":""},ta=["innerHTML"],na=["title"],oa=["title"],sa={key:1,"data-sve-ht-kind":""},aa={key:3,"data-sve-ht-name":""},ia={key:4,"data-sve-ht-actions":""},ra=["disabled","title","innerHTML"],la=["disabled","title"],ca=["disabled","title"],da=["disabled","title"],ua=["data-sve-ht-id"],ha='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',pa='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',fa='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',ma='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',va='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',ga='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',ka={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const t=so(window),s=p(window,"section_fields");function n(){const l=ao();if(!l){window.Statamic?.$toast?.error(p(window,"section_fields_none"));return}zt(window,l)}function a(l){return l.kind==="component"?l.src?`partial:${l.src}`:l.tag:l.name?`${l.tag} ${l.name}`:l.tag}function r(l){return!!l.section}function i(l){return!!l.context}function c(l,d){i(d)||(r(d)?o.onSectionPointerDown?.(l,d.section):d.sectionRoot?o.onSectionPointerDown?.(l,d.sectionRoot):o.onPointerDown?.(l,d.id))}function f(l){if(r(l)){o.onSection?.(l.section);return}if(i(l)){o.onContextRow?.(l.id);return}o.onSelect?.(l.id)}function m(l,d){const y={"data-sve-ht-id":l.id};return l.current&&(y["data-sve-ht-current"]=""),l.hidden&&(y["data-sve-ht-hidden"]=""),y["data-sve-ht-cat"]=l.cat||"other",y["data-sve-ht-depth"]=String(l.depth),d&&(y["data-sve-ht-dim"]=""),i(l)&&(y["data-sve-ht-context"]=l.context),r(l)&&(y["data-sve-ht-sec"]=""),!r(l)&&o.dropId===l.id&&o.dropPlace&&(y["data-sve-ht-drop"]=o.dropPlace),y}function h(l){return!l.hidden||l.wrapFrom!=null}return(l,d)=>(g(),k(H,null,[S("div",fe({"data-sve-ht-row":""},m(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:d[26]||(d[26]=y=>f(e.row)),onDblclick:d[27]||(d[27]=_(y=>r(e.row)||i(e.row)?null:u(o).onRename?.(e.row.id),["prevent"])),onKeydown:[d[28]||(d[28]=Y(_(y=>f(e.row),["prevent"]),["enter"])),d[29]||(d[29]=Y(_(y=>f(e.row),["prevent"]),["space"]))],onPointerdown:d[30]||(d[30]=y=>c(y,e.row)),onContextmenu:d[31]||(d[31]=_(y=>r(e.row)||i(e.row)?null:u(o).onContext?.(y,e.row.id),["prevent","stop"]))}),[S("span",Zs,[(g(!0),k(H,null,K(e.row.guides||[],(y,P)=>(g(),k("i",{key:P,"data-sve-ht-cat":y},null,8,Js))),128))]),e.row.hasChildren||e.row.emptyBlock?(g(),k("button",fe({key:0,type:"button","data-sve-ht-twist":""},e.row.shut?{"data-sve-ht-shut":""}:{},{innerHTML:pa,onClick:d[0]||(d[0]=_(y=>r(e.row)?u(o).onSection?.(e.row.section):u(o).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:d[1]||(d[1]=_(()=>{},["stop"])),onDblclick:d[2]||(d[2]=_(()=>{},["stop"]))}),null,16)):(g(),k("span",Qs)),e.row.letter?(g(),k("span",ea,C(e.row.letter),1)):(g(),k("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,ta)),S("span",{"data-sve-ht-text":"",title:u(o).renameTitle},[!e.row.kind&&!r(e.row)&&!i(e.row)?(g(),k("button",{key:0,type:"button","data-sve-ht-tag":"",title:u(o).tagTitle,onClick:d[3]||(d[3]=_(()=>{},["stop","prevent"])),onPointerdown:d[4]||(d[4]=_(()=>{},["stop"])),onDblclick:d[5]||(d[5]=_(y=>u(o).onTagChange?.(y,e.row.id),["stop","prevent"]))},C(e.row.tag),41,oa)):(g(),k("span",sa,C(e.row.tag),1)),u(o).editingId===e.row.id&&!r(e.row)?Le((g(),k("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":d[6]||(d[6]=y=>u(o).draft=y),onMousedown:d[7]||(d[7]=_(()=>{},["stop"])),onPointerdown:d[8]||(d[8]=_(()=>{},["stop"])),onClick:d[9]||(d[9]=_(()=>{},["stop"])),onDblclick:d[10]||(d[10]=_(()=>{},["stop"])),onKeydown:[d[11]||(d[11]=_(()=>{},["stop"])),d[12]||(d[12]=Y(_(y=>u(o).onRenameCommit?.(),["prevent"]),["enter"])),d[13]||(d[13]=Y(_(y=>u(o).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:d[14]||(d[14]=y=>u(o).onRenameCommit?.())},null,544)),[[Ot,u(o).draft]]):(g(),k("span",aa,C(e.row.name),1))],8,na),!r(e.row)&&!i(e.row)?(g(),k("span",ia,[h(e.row)?(g(),k("button",{key:0,type:"button","data-sve-ht-eye":"",disabled:!u(o).canEdit,title:u(o).canEdit?e.row.hidden?u(o).showTitle:u(o).hideTitle:u(o).lockedTitle,innerHTML:e.row.hidden?ma:fa,onClick:d[15]||(d[15]=_(y=>u(o).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:d[16]||(d[16]=_(()=>{},["stop"])),onDblclick:d[17]||(d[17]=_(()=>{},["stop"]))},null,40,ra)):$("",!0),u(t)&&e.row.fieldsIcon?(g(),k("button",{key:1,type:"button","data-sve-ht-fields":"",disabled:!u(o).canEdit,title:u(o).canEdit?u(s):u(o).lockedTitle,innerHTML:ha,onClick:_(n,["stop","prevent"]),onPointerdown:d[18]||(d[18]=_(()=>{},["stop"])),onDblclick:d[19]||(d[19]=_(()=>{},["stop"]))},null,40,la)):$("",!0),S("button",{type:"button","data-sve-ht-dup":"",disabled:!u(o).canEdit,title:u(o).canEdit?u(o).duplicateTitle:u(o).lockedTitle,innerHTML:va,onClick:d[20]||(d[20]=_(y=>u(o).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:d[21]||(d[21]=_(()=>{},["stop"])),onDblclick:d[22]||(d[22]=_(()=>{},["stop"]))},null,40,ca),S("button",{type:"button","data-sve-ht-del":"",disabled:!u(o).canEdit,title:u(o).canEdit?u(o).deleteTitle:u(o).lockedTitle,innerHTML:ga,onClick:d[23]||(d[23]=_(y=>u(o).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:d[24]||(d[24]=_(()=>{},["stop"])),onDblclick:d[25]||(d[25]=_(()=>{},["stop"]))},null,40,da)])):$("",!0)],16,Gs),e.row.emptyBlock&&!e.row.shut?(g(),k("div",fe({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},u(o).dropId===e.row.id&&u(o).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),C(u(o).slotText),17,ua)):$("",!0)],64))}},Ue=Te(ka,[["__scopeId","data-v-1d5af908"]]),ya=["data-sve-ht-look"],ba={key:0,class:"sve-ht-empty"},_a={key:1,class:"sve-ht-empty"},xa={key:0,class:"sve-ht-empty"},Ta={__name:"HtmlTreeList",setup(e){const t=pe(()=>tn(o.query)),s=pe(()=>Ws(o.rows,t.value)),n=pe(()=>s.value.rows),a=pe(()=>t.value?o.sections.filter(f=>nn(f.row,t.value)||f.current&&f.ready&&n.value.length>0):o.sections),r=pe(()=>!!t.value&&!a.value.length&&!n.value.length);function i(f){return!!t.value&&!s.value.hits.has(f.path)}function c(f){const m={"data-sve-ht-sec-uid":f.uid};return f.current&&(m["data-sve-ht-branch"]=""),o.sectionDrop&&o.sectionDrop.uid===f.uid&&(m["data-sve-ht-drop"]=o.sectionDrop.place),m}return(f,m)=>(g(),k("div",fe({class:"sve-ht-root","data-sve-ht-look":u(o).look,style:u(o).familyStyle},u(o).dragging?{"data-sve-ht-dragging":""}:{}),[!u(o).rows.length&&!u(o).sections.length?(g(),k("div",ba,C(u(o).emptyText),1)):r.value?(g(),k("div",_a,C(u(o).searchEmpty),1)):$("",!0),u(o).sections.length?(g(!0),k(H,{key:2},K(a.value,h=>(g(),k("div",fe({key:h.uid},{ref_for:!0},c(h)),[h.ready?(g(),k(H,{key:0},[(g(!0),k(H,null,K(n.value,l=>(g(),$e(Ue,{key:l.id,row:l,dim:i(l)},null,8,["row","dim"]))),128)),u(o).rows.length?$("",!0):(g(),k("div",xa,C(u(o).emptyText),1))],64)):(g(),$e(Ue,{key:1,row:h.row,dim:u(o).inComponent},null,8,["row","dim"]))],16))),128)):u(o).rows.length?(g(!0),k(H,{key:3},K(n.value,h=>(g(),$e(Ue,{key:h.id,row:h,dim:i(h)},null,8,["row","dim"]))),128)):$("",!0)],16,ya))}},Ct=Te(Ta,[["__scopeId","data-v-2e2ef58b"]]);let Xe=null;function Sa(e){return Xe||(Xe=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{pages:[]}).then(t=>Array.isArray(t.pages)?t.pages:[]).catch(()=>[])),Xe}let Ie=null;function Ye(){Ie?.dismiss(),Ie=null}function Ca(e,t,s){Ye();const n=t?.getBoundingClientRect?.(),a={x:n?n.left:0,y:n?n.bottom+4:0};Sa(e).then(r=>{const i=r.length?r.map(c=>({label:c.title||c.url,onPick:()=>{Ye(),s(c.url)}})):[{label:p(e,"component_props_pages_none"),onPick:null}];Ye(),Ie=oe(e.document,dt,{items:i,x:a.x,y:a.y,onClose:()=>{Ie=null}})})}const on="sve-html-tree-labels";function sn(){try{const e=globalThis.localStorage?.getItem(on);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function Pa(e){try{globalThis.localStorage?.setItem(on,JSON.stringify(e))}catch{}}function an(e){return String(e||"_")}function rn(e){const t=sn()[an(e)];return t&&typeof t=="object"?{...t}:{}}function La(e,t,s){const n=s?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function $a(e,t,s,n){if(!t)return;const a=an(e),r=sn(),i={...r[a]||{}},c=String(s||"").replace(/\s+/g," ").trim(),f=String(n||"").trim();!c||c===f?delete i[t]:i[t]=c,Object.keys(i).length?r[a]=i:delete r[a],Pa(r)}const Ea=/^@(media|supports|container|layer|scope)\b/i;function wa(e){const t=String(e||""),s=[];let n=0,a=0;for(;n<t.length;){if(t[n]==="{"&&t[n+1]==="{"){const c=t.indexOf("}}",n+2);n=c===-1?t.length:c+2;continue}if(t[n]==="/"&&t[n+1]==="*"){const c=t.indexOf("*/",n+2);n=c===-1?t.length:c+2;continue}if(t[n]==='"'||t[n]==="'"){const c=t[n];for(n+=1;n<t.length&&t[n]!==c;)n+=t[n]==="\\"?2:1;n+=1;continue}if(t[n]!=="{"){n+=1;continue}let r=1,i=n+1;for(;i<t.length&&r>0;){if(t[i]==="{"&&t[i+1]==="{"){const c=t.indexOf("}}",i+2);i=c===-1?t.length:c+2;continue}if(t[i]==="/"&&t[i+1]==="*"){const c=t.indexOf("*/",i+2);i=c===-1?t.length:c+2;continue}if(t[i]==='"'||t[i]==="'"){const c=t[i];for(i+=1;i<t.length&&t[i]!==c;)i+=t[i]==="\\"?2:1;i+=1;continue}t[i]==="{"?r+=1:t[i]==="}"&&(r-=1),i+=1}s.push({selector:t.slice(a,n).trim(),body:t.slice(n+1,i-1),from:a,to:i,text:t.slice(a,i).trim()}),n=i,a=i}return s}function Pt(e){const t=String(e||""),s=new Set,n=new Set,a=new Set;for(const r of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const i of r[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))i&&(s.add(i),s.add(i.replace(/([:./%!#()[\],])/g,"\\$1")));for(const r of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))r[2].trim()&&n.add(r[2].trim());for(const r of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))a.add(r[1].toLowerCase());return{classes:s,ids:n,tags:a}}function Lt(e,t){const s=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),n=[...s.matchAll(/\.((?:\\.|[\w-])+)/g)].map(i=>i[1]),a=[...s.matchAll(/#((?:\\.|[\w-])+)/g)].map(i=>i[1]);if(n.length||a.length){const i=c=>c.replace(/\\(.)/g,"$1");return n.every(c=>t.classes.has(c)||t.classes.has(i(c)))&&a.every(c=>t.ids.has(i(c)))}const r=[...s.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(i=>i[2].toLowerCase());return r.length>0&&r.every(i=>t.tags.has(i))}function Ha(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function Ia(e,t,s){const n=Ha(e);if(!n.length)return"keep";const a=n.filter(i=>Lt(i,t));return a.length?a.length===n.length&&!n.some(i=>Lt(i,s))?"move":"copy":"keep"}function ln(e,t,s){const n=String(e||""),a=Pt(t),r=Pt(s),i=[],c=[];let f=0;for(const m of wa(n)){const h=n.slice(m.from,m.to),l=h.match(/^\s*/)[0];if(f=m.to,Ea.test(m.selector)){const y=ln(m.body,t,s);y.move.trim()&&i.push(`${m.selector} {
${y.move.trim()}
}`),y.keep.trim()&&c.push(`${l}${m.selector} {
${y.keep.trim()}
}`);continue}const d=m.selector.startsWith("@")?"keep":Ia(m.selector,a,r);if(d==="move"){i.push(m.text);continue}d==="copy"&&i.push(m.text),c.push(h)}return c.push(n.slice(f)),{move:i.join(`

`).trim(),keep:c.join("").replace(/\n{3,}/g,`

`).trim()}}const Aa="/!/sve/component";function Ma(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let s=null;for(const n of t){if(!n.trim())continue;const a=n.match(/^[ \t]*/)[0].length;s=s===null?a:Math.min(s,a)}return s?t.map(n=>n.slice(s)).join(`
`):t.join(`
`)}function Ra(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function Da(e,t){if(!lo(e))return"";try{return await(await qn(()=>import("./tw-compile-CV7No16T.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(s){return console.error("[sve] component tailwind compile",s),""}}async function Oa(e,t){const s=await e.fetch(Aa,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":Bt(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!s.ok){const n=new Error(String(s.status));throw n.status=s.status,n}return s.json()}function $t(e,t){const{from:s,to:n}=ro(e,t),a=e.slice(s,n);if(!a.trim())return null;const r=e.slice(0,s)+e.slice(n),i=b("dock:css"),c=ln(typeof i=="string"?i:"",a,r);return{html:Ma(a),css:c.move,keepCss:c.keep,lead:Ra(a),from:s,to:n}}function Ba(e,t,{onDone:s,onError:n}={}){if(b("dock:is-locked")===!0)return;const a=b("dock:html");if(typeof a!="string"||!t)return;const r=$t(a,t);if(!r)return;const i=oe(e.document,jn,{heading:p(e,"component_new"),nameLabel:p(e,"component_name"),placeholder:p(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:p(e,"cancel"),saveLabel:p(e,"component_create"),onOk:c=>{i.dismiss(),(async()=>{try{const f=await Da(e,r.html),m=b("dock:html"),h=typeof m=="string"&&m===a?r:$t(m,t);if(!h)return;const l=await Oa(e,{name:c,html:h.html,css:h.css,js:"",tw:f}),d=b("dock:html"),y=d.slice(0,h.from)+h.lead+l.tag+d.slice(h.to);b("dock:set-html",y),h.css.trim()&&b("dock:set-css",h.keepCss),s?.(l)}catch(f){n?.(f)}})()}})}function Fa(e,t,s){const n=String(e||"");if(!t||t.kind!=="antlers")return n;const a=String(s||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?Va(n,t,a):t.tag==="else"||!a?n:n.slice(0,t.from)+`{{ ${t.tag} ${a} }}`+n.slice(t.openTo)}function et(e,t,s,n){return me(e,t,{kind:s,name:n})}function me(e,t,s={}){const n=String(e||"");if(!t||t.antlers!=="loop")return n;const a=t.loopKind==="collection"?"collection":"field",r=s.kind??a,i=String(s.name??t.expr??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(i))return n;const c=s.sortDir??t.sortDir??"",f=String(s.sortField??t.sortField??"").trim(),m=String(s.limit??t.limit??"").trim(),h=cn(n,t);if(!h)return n;const l=r===a?t.params:"",d=r==="collection"?ja(i,f,c,m,l):qa(i,f,c,m,l),y=r==="collection"?"collection":i;return n.slice(0,t.from)+d+n.slice(t.openTo,h.from)+`{{ /${y} }}`+n.slice(h.to)}function ja(e,t,s,n,a){const r=Ka(a).replace(/\bsort\s*=\s*["'][^"']*["']/g,"").replace(/\blimit\s*=\s*["']?\d+["']?/g,"").replace(/\s+/g," ").trim(),i=[`collection from="${e}"`];return s==="random"?i.push('sort="random"'):t&&i.push(`sort="${t}${s==="desc"?":desc":":asc"}"`),n&&i.push(`limit="${n}"`),r&&i.push(r),`{{ ${i.join(" ")} }}`}function qa(e,t,s,n,a){const r=String(a||"").split("|").map(c=>c.trim()).filter(c=>c&&!/^from\s*=/.test(c)&&!/^sort\s*:/.test(c)&&!/^reverse$/.test(c)&&!/^shuffle$/.test(c)&&!/^limit\s*:/.test(c)),i=[e,...r];return s==="random"?i.push("shuffle"):t&&(i.push(`sort:${t}`),s==="desc"&&i.push("reverse")),n&&i.push(`limit:${n}`),`{{ ${i.join(" | ")} }}`}function Ka(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function cn(e,t){const n=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return n?{from:t.from+n.index,to:t.from+n.index+n[0].length}:null}function Va(e,t,s){return me(e,t,{name:s})}function Na(e,t,s){const n=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return n;const a=cn(n,t);if(!a)return n;const i=(n.slice(0,a.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],c=s==="else"?"{{ else }}":"{{ elseif true }}";return`${n.slice(0,a.from)}${c}
${i}${n.slice(a.from)}`}const R=po("sve-call-values"),ye=new Set;let Et=null;const za="__sve-html-tree-style",D=new Set;let tt="",re=!1,We=null,Ce=!0,V="",be=0,dn="";const W=new Map,le=new Set;let B="",un=!1,I=null,Ae=null,Me=0,nt=null,_e=[],J=null,ve=null,Re=null,De=null,ot=null,te=!1,Q=null,xe=null,ge=null,Oe=null,Be=null,st=null,Z=null;function j(e){return e.getElementById(Ee)}function Ua(e){Vn(e,za,`
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
      ${bt("light")}
      --sve-ht-pick: rgba(56,88,233,.14);
      --sve-ht-pick-hover: rgba(56,88,233,.22);
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${bt("dark")}
      --sve-ht-pick: rgba(56,88,233,.3);
      --sve-ht-pick-hover: rgba(56,88,233,.4);
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
    /* The picked row: our blue as a wash and a bar at the edge, not a solid
       fill — the chip's colour has to stay readable on it. */
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-current] {
      background: var(--sve-ht-pick);
      color: inherit;
      box-shadow: inset 2px 0 0 #3858e9;
    }
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-current]:hover { background: var(--sve-ht-pick-hover); }
    /* A shut section is one row in the page's list; a little air between them. */
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-sec] { margin-bottom: 2px; }
    /* The open section's box, quieter: it says where you are, the bar says
       what you picked. */
    [data-sve-ht-look="tags"] [data-sve-ht-branch] {
      border: 1px solid rgba(56,88,233,.45);
      border-radius: 7px;
      padding: 3px;
      margin: 0 0 6px;
      background: rgba(56,88,233,.04);
    }

    /* One guide per level, drawn in the row's left margin: 14px per level
       with the line 7px in, so each sits under the twist of the row it
       descends from — in that row's family colour, well held back. Out of
       the flow, so the row's box and everything in it start at the level. */
    [data-sve-ht-look="tags"] [data-sve-ht-indent] {
      display: flex;
      position: absolute;
      top: 0;
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
      opacity: .3;
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
  `)}function O(){const e=b("dock:html");return typeof e=="string"?e:""}function hn(e){return!!b("dock:is-open",e)}function de(e,{save:t=!1}={}){return ft()||b("dock:set-html",e)!==!0?!1:(t&&b("dock:save-now"),!0)}function wt(e){const t=b("dock:component-exit-state")||{};if(o.exitOpen=!!t.open,!t.open){o.onExit=null;return}o.exitName=t.name||"",o.exitLabel=p(e,"component_exit"),o.exitTitle=p(e,t.back?"component_exit_back":"component_exit_close"),o.onExit=()=>{b("dock:exit-component"),L(e)}}function pn(e,t){const s=Zn(e);if(!s||t.type!==s)return"";const n=Jn(t[s]);return n&&Qn(e,n)?.section_type||""}const ne=[];let Ge=!1,at=!1;function Ze(e,t){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(t,{timeout:2e3});return}e.setTimeout(t,200)}function Xa(e,t){for(const s of t){const n=s.type;!n||W.has(n)||le.has(n)||ne.includes(n)||ne.push(n)}lt.htmlTreePrefetchArmed&&pt(e)}function Oi(e){lt.htmlTreePrefetchArmed=!0,pt(e)}function pt(e){if(Ge||!ne.length)return;Ge=!0;const t=()=>{const s=ne.shift();if(!s){Ge=!1;return}if(W.has(s)||le.has(s)){Ze(e,t);return}le.add(s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(s)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{typeof n?.html=="string"&&(W.set(s,n.html),at&&(at=!1,L(e)))}).catch(()=>{}).finally(()=>{le.delete(s),Ze(e,t)})};Ze(e,t)}function ft(){return!!B}function Ya(e){const t=new Map,s=Ft(e);if(!s)return t;for(const n of s.querySelectorAll("[data-sid]")){const a=n.getAttribute("data-sid");a&&!t.has(a)&&t.set(a,n.tagName.toLowerCase())}return t}function Wa(e,t){const s=Se(e)||"page_sections";for(const n of qe(t)||[]){const a=Ke(n.values),r=a&&typeof a=="object"?a[s]:null;if(Array.isArray(r))return!0}return!1}function fn(e,t){const s=Se(e)||"page_sections",n=Ya(e),a=[];for(const r of qe(t)||[]){const i=Ke(r.values),c=i&&typeof i=="object"?i[s]:null;if(Array.isArray(c)){c.forEach(f=>{if(!f||typeof f!="object"||Array.isArray(f)||typeof f.type!="string")return;const m=[f._visual_id,f.id,f._id].filter(P=>typeof P=="string"&&P!=="");if(!m.length)return;const h=pn(e,f)||f.type,l=typeof f._sve_label=="string"?f._sve_label.trim():"",d=m.map(P=>n.get(P)).find(Boolean)||"section",y=rn(f.type)[`0:${d}`];a.push({uid:m[0],ids:m,type:f.type,tag:d,label:l||(typeof y=="string"&&y.trim()?y.trim():"")||ct(e,h)?.display||He(h)||h,svg:Xt(d,"",null).svg||fo.section,cat:Kt(d),enabled:f.enabled!==!1,static:Vo(e,h)})});break}}return a}function Ga(e,t,s){if(!s.length)return"";const n=b("dock:current-type")||"",a=b("dock:current-uid"),r=!!b("dock:component-exit-state")?.open;if(a){const i=Wn(a,t),c=s.find(f=>f.ids.some(m=>i.includes(m)));if(c&&(r||c.type===n))return c.uid}return s.find(i=>i.type===n)?.uid||""}function Za(e,t,s,n){const a=t.find(P=>P.uid===s),r=b("dock:component-src"),i=b("dock:type-stack")||[];if(!a||!r||!i.length)return null;const c=i.map(P=>P.type).filter(P=>!W.get(P));if(c.length)return Ja(e,c),null;const f=[],m=new Set,h=new Set;let l=P=>f.push(...P),d=null,y=0;for(let P=0;P<i.length;P+=1){const ue=P+1<i.length?i[P+1].src:r,ie=A=>({...A,id:`ctx${P}:${A.id}`,path:`ctx${P}/${A.path}`,ctxLevel:P,children:A.children.map(ie)}),q=Ve(W.get(i[P].type)).map(ie),E=[],Pe=(A,M)=>{for(const w of A){if(w.kind==="component"&&w.src===ue)return E.push(...M,w),w;const v=Pe(w.children,[...M,w]);if(v)return v}return null};if(d=ue?Pe(q,[]):null,!d)return null;const N=new Set(E.map(A=>A.id)),he=(A,M)=>{for(const w of A)w.children.length&&(N.has(w.id)?D.has(w.path):gn(w,M))&&m.add(w.id),he(w.children,M+1)};he(q,y),l(q),h.add(d.id),y+=E.length,l=(A=>M=>{A.children=M})(d)}for(const P of kn(n))m.add(P);return D.has(d.path)&&m.add(d.id),d.children=n,{tree:f,folds:m,hostId:d.id,hostIds:h,levels:i.length,rootId:f.find(P=>!P.kind)?.id||"",label:a.label,svg:a.svg,cat:a.cat}}function Ja(e,t){for(const s of t)!ne.includes(s)&&!le.has(s)&&ne.push(s);at=!0,pt(e)}function Qa(e,t,s){const n=b("dock:component-exit-state");if(n?.open)return He(n.name)||n.name||"";if(s)return t.find(r=>r.uid===s)?.label||"";const a=b("dock:current-type")||"";return ct(e,a)?.display||He(a)||""}function mn(e,t,s,n,a){const r=s.find(c=>c.uid===n);if(!r||n===a)return;D.clear(),I=null,Ce=!1,G(),Ne(),V=n,dn=O(),B=W.get(r.type)||"",B&&(I=Fe(Ve(B))||null),un=(b("dock:current-type")||"")===r.type,e.clearTimeout(be),be=e.setTimeout(()=>{V="",re=!1,L(e)},4e3),L(e);const i=()=>no(r.uid,t,e,{clampToSection:!0});Gn(r.uid,t,e,i),ce({source:ae,type:se.SVE_ACTIVATE,ids:r.ids},e),e.setTimeout(()=>L(e),0)}function vn(e,t){if(!t)return!1;for(const s of e||[])if(s.id===t||vn(s.children,t))return!0;return!1}function Fe(e){for(const t of e||[]){if(!t.kind)return t.id;const s=Fe(t.children);if(s)return s}return""}function gn(e,t){return D.has(e.path)?t===0:t>0}function kn(e){const t=new Set,s=(n,a)=>{for(const r of n)r.children.length&&gn(r,a)&&t.add(r.id),s(r.children,a+1)};return s(e,0),t}function L(e){const t=e.document,n=j(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;Ua(t),uo(e);const a=O();B&&B===a&&(B="");const r=B||a,i=Ve(r);_e=i;const c=b("dock:current-type")||"",f=rn(c),m=Wa(e,t),l=!!(b("dock:component-exit-state")||{}).open,d=fn(e,t);c&&a&&!B&&W.set(c,a),Xa(e,d);const y=Ga(e,t,d);if(m&&!d.length){_e=[],o.rows=[],o.sections=[],o.pageBuilder=!0,o.emptyText=p(e,"html_tree_empty"),o.canEdit=!b("dock:is-locked"),o.look=_t(e),o.onRefresh=()=>L(e),o.onSection=null,wt(e),we(n,Ct),Ht(e,[]);return}o.pageBuilder=m;const P=`${c}|${y}`;let ue=!1;P!==tt&&(tt=P,D.clear(),We!==null&&r!==We?ue=!0:re=r),(ue||re!==!1&&r!==re)&&(re=!1,D.clear(),I=Fe(i)||null),We=r,V&&(V===y||!d.length)&&(un||r!==dn)&&(e.clearTimeout(be),V="",re=!1,vn(i,I)||(D.clear(),I=Fe(i)||null));const ie=d.some(v=>v.uid===V)?V:"",q=Ce?"":ie||y,E=l?Za(e,d,q,i):null,Pe=!!(ie||y),N=E?xt(E.tree,o.query?new Set:E.folds):xt(i,o.query?new Set:kn(i));!r.trim()&&!hn(t)?o.emptyText=p(e,"html_tree_need_dock"):o.emptyText=p(e,"html_tree_empty"),o.slotText=p(e,"antlers_drop_here"),o.dataTitle=p(e,"data_vars_title"),o.pageTitle=p(e,"component_props_page"),o.renameTitle=p(e,"html_tree_rename"),o.tagTitle=p(e,"tw_tag"),o.hideTitle=p(e,"html_tree_hide"),o.showTitle=p(e,"html_tree_show"),o.duplicateTitle=p(e,"html_tree_duplicate"),o.deleteTitle=p(e,"html_tree_delete"),o.lockedTitle=p(e,"html_tree_locked"),o.searchEmpty=p(e,"html_tree_search_empty"),o.canEdit=!b("dock:is-locked"),o.look=_t(e),Yn(e),o.onQuery=()=>L(e),wt(e),o.inComponent=l,o.onContextRow=v=>{if(!E||v===E.hostId)return;const x=N.find(T=>T.id===v)?.ctxLevel??E.levels-1;b("dock:exit-component",E.levels-x),L(e)},o.onSelect=v=>{const x=N.find(T=>T.id===v);x&&Ut(e,x.path)||vt(e,v,N)},o.onTwist=v=>{const x=N.find(T=>T.id===v)?.path;x&&(D.has(x)?D.delete(x):D.add(x),L(e))},o.onTagChange=(v,x)=>{const T=o.rows.find(z=>z.id===x);T&&!ft()&&ho(e,v.currentTarget,T)},o.onRename=v=>ti(e,v),o.onRenameCommit=()=>It(e,!0),o.onRenameCancel=()=>It(e,!1),o.onHide=v=>oi(e,v),o.onDuplicate=v=>si(e,v),o.onDelete=v=>ii(e,v),o.onPointerDown=(v,x)=>hi(e,v,x),o.onSectionPointerDown=(v,x)=>mi(e,v,x),o.onContext=(v,x)=>di(e,v,x),o.onInspectCommit=v=>xi(e,v),o.onPropValue=(v,x,T)=>Rt(e,v,x,T),o.onPropPage=(v,x)=>Ca(e,v,T=>Rt(e,x,T,!1)),o.onLoopKind=v=>Ti(e,v),o.onAddBranch=v=>Si(e,v),o.onLoopSortField=v=>{const x=je(),T=String(v||"").trim();if(!x)return;const z=Z?.id===x.id?Z.dir:"",U=x.sortDir||z||"asc";Z=null,ee(e,(Cn,Pn)=>me(Cn,Pn,{sortField:T,sortDir:U}))},o.onLoopSortDir=v=>{const x=je(),T=String(v||"");if(x){if((T==="asc"||T==="desc")&&!x.sortField){Z={id:x.id,dir:T},it(e,x);return}Z=null,ee(e,(z,U)=>me(z,U,{sortDir:T,sortField:T==="asc"||T==="desc"?U.sortField:""}))}},o.onLoopLimit=v=>ee(e,(x,T)=>me(x,T,{limit:String(v||"").replace(/\D/g,"")})),o.onPropHost=v=>v?R.mount(v):R.unmount(),o.onInspectData=(v,x)=>{b("dock:data-menu",{anchor:v,at:N.find(T=>T.id===I)?.from,onPick:T=>x(String(T?.var||"").trim())})};const he=N.find(v=>!v.kind)?.id,A=l?"":Qa(e,d,q),M=q&&!l?d.find(v=>v.uid===q):null;o.rows=N.map(v=>{const x=Xt(v.tag,v.kind,v.antlers),T=!!E&&v.id===E.rootId,z=v.id===he&&A?A:T?E.label:v.klass,U=v.id===he;return{...v,base:z,name:U&&M?z:La(z,v.path,f),current:v.id===I,letter:T?"":x.letter||"",svg:U&&M?M.svg:T?E.svg:x.svg||"",cat:T?E.cat:Kt(v.tag,v.kind,v.antlers),context:E?E.hostIds.has(v.id)?"host":v.id.startsWith("ctx")?"dim":"":"",sectionRoot:U&&M?M.uid:"",fieldsIcon:!!(U&&M&&!M.static)}});const w=[];for(const v of o.rows)w.length=v.depth,v.guides=w.slice(),w[v.depth]=v.cat;o.sections=Pe?d.map(v=>{const x=!!q&&v.uid===q;return{...v,current:x,ready:x&&(!ie||!!B),row:{id:`sec:${v.uid}`,section:v.uid,tag:v.tag,name:v.label,kind:"",svg:v.svg,cat:v.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:x,hidden:!v.enabled}}}):[],o.onSection=v=>{te||mn(e,t,d,v,q)},o.onRefresh=()=>L(e),it(e,o.rows.find(v=>v.id===I)),we(n,Ct),Ht(e,i)}function Ht(e,t){j(e.document)&&yn(e,t)}function yn(e,t){const s=t[0],n=!!b("dock:component-src"),a=n?"":b("dock:current-uid")||"";ce({source:ae,type:se.SVE_HTML_PICK,on:!0,uid:a,all:n,tag:s?.tag||"",klass:s?.klass||"",nodes:$o(t)},e)}function ei(e){if(!e)return;const t=(s,n)=>{for(const a of s||[]){if(a.path===e)return!0;if(t(a.children,n+1))return n===0?D.delete(a.path):D.add(a.path),!0}return!1};t(_e,0)}function ti(e,t){if(te)return;const s=o.rows.find(n=>n.id===t);!s||s.kind||(I=t,o.rows.forEach(n=>{n.current=n.id===t}),o.editingId=t,o.draft=s.name,e.setTimeout(()=>{const n=j(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function It(e,t){const s=o.editingId;if(!s)return;const n=o.rows.find(a=>a.id===s);o.editingId=null,t&&n&&(n.sectionRoot?ni(e,n.sectionRoot,o.draft):$a(b("dock:current-type")||"",n.path,o.draft,n.base||n.klass)),o.draft="",L(e)}function ni(e,t,s){const n=Se(e)||"page_sections",a=String(s||"").replace(/\s+/g," ").trim();for(const r of qe(e.document)||[]){const i=Ke(r.values),c=i&&typeof i=="object"?i[n]:null;if(!Array.isArray(c))continue;const f=c.findIndex(d=>d&&typeof d=="object"&&[d._visual_id,d.id,d._id].includes(t));if(f===-1)continue;const m=pn(e,c[f])||c[f].type,h=ct(e,m)?.display||He(m)||m,l=JSON.parse(JSON.stringify(c));return l[f]={...l[f]},!a||a===h?delete l[f]._sve_label:l[f]._sve_label=a,r.setFieldValue(n,l),!0}return!1}function oi(e,t){mt(e,t,Co)}function si(e,t){mt(e,t,Po)}function bn(e,t){eo(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const s=e.document;oo({uid:t},s,e)})}function ai(e,t,s){V===s&&(e.clearTimeout(be),V="",B=""),I=null,Ce=!1,tt="";const n=fn(e,t),a=n.find(r=>r.uid!==s)||n[0];a?mn(e,t,n,a.uid,""):(B="",o.rows=[],o.sections=[],o.pageBuilder=!0,L(e)),e.setTimeout(()=>{j(e.document)&&L(e)},0)}Vt("row:removed",({uid:e,parentPath:t,doc:s,win:n})=>{t!==Se(n)||!j(n.document)||ai(n,s,e)});function ii(e,t){const s=o.sections?.find(a=>a.row?.id===t),n=s?s.row?.section||s.uid:o.rows.find(a=>a.id===t)?.sectionRoot;if(n){bn(e,n);return}mt(e,t,Lo)}function mt(e,t,s){if(b("dock:is-locked"))return;const n=O(),a=o.rows.find(i=>i.id===t);if(!a)return;const r=s(n,a);r!==n&&de(r)}function G(){Q?.dismiss(),Q=null}const ri='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',li='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>';function _n(e,t){const s=o.sections?.find(f=>f.uid===t),n=s?.type||"";if(!n||!Jt(e))return[];const a=s.label||n,r=No(e,n),i=()=>e.Statamic?.$toast?.error(p(e,"section_update_failed")),c=[{label:p(e,"static_section_insertable"),icon:r?li:ri,onPick:()=>{G(),Tt(e,{handle:n,hidden:!r}).then(()=>{e.Statamic?.$toast?.success(p(e,r?"section_shown_to_editors":"section_hidden_from_editors",{name:a})),Qe(e)}).catch(i)}}];return s.static&&c.push({label:p(e,"section_add_fields"),onPick:()=>{G(),Tt(e,{handle:n,fields:!0}).then(()=>{e.Statamic?.$toast?.success(p(e,"section_fields_added",{name:a})),Qe(e),L(e),zt(e,n)}).catch(i)}}),c}function ci(e,t,s){const n=s.row?.section||s.uid;n&&(Q=oe(e.document,dt,{items:[..._n(e,n),{label:p(e,"html_tree_remove_section"),danger:!0,onPick:()=>{G(),bn(e,n)}}],x:t.clientX,y:t.clientY,onClose:()=>{Q=null}}))}function di(e,t,s){G();const n=o.sections?.find(c=>c.row?.id===s);if(n){ci(e,t,n);return}const a=o.rows.find(c=>c.id===s);if(!a)return;vt(e,s,o.rows);const r={x:t.clientX,y:t.clientY},i=c=>{c.length&&(Q?.dismiss(),Q=oe(e.document,dt,{items:c,x:r.x,y:r.y,onClose:()=>{Q=null}}))};if(a.kind==="component"){ui(e,a,i);return}o.canEdit&&i([...a.sectionRoot?_n(e,a.sectionRoot):[],{label:p(e,"component_make"),onPick:()=>{G(),Ba(e,a,{onDone:()=>L(e),onError:c=>{e.alert(c?.status===409?p(e,"component_exists"):p(e,"component_failed"))}})}}])}const At=(e,t)=>{G(),b("dock:open-template",t)};function ui(e,t,s){if(!vo(t.src)){s([{label:p(e,"component_open_named",{name:t.name||t.src}),onPick:()=>At(e,`view:partials/${t.src}`)}]);return}s([{label:p(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const a=Array.isArray(n.items)?n.items:[];s(a.length?a.map(r=>({label:p(e,"component_open_named",{name:r.label}),onPick:()=>At(e,r.type)})):[{label:p(e,"component_none"),onPick:null}])}).catch(()=>s([{label:p(e,"component_none"),onPick:null}]))}function hi(e,t,s){if(t.button!==0||b("dock:is-locked")||o.editingId||t.target?.closest?.("button, input"))return;Ne(),J=s,ve={x:t.clientX,y:t.clientY},Re=t.currentTarget,De=t.pointerId;const n=r=>pi(e,r),a=r=>fi(e,r);ot=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),ot=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function pi(e,t){if(!J||!ve)return;const s=t.clientX-ve.x,n=t.clientY-ve.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{Re?.setPointerCapture?.(De)}catch{}}t.preventDefault();const a=e.document.elementFromPoint(t.clientX,t.clientY),r=a?.closest?.("[data-sve-ht-slot]");if(r){const l=r.getAttribute("data-sve-ht-id");if(l&&l!==J){o.dropId=l,o.dropPlace="inside";return}}const i=a?.closest?.("[data-sve-ht-row]"),c=i?.getAttribute("data-sve-ht-id");if(!c||c===J){o.dropId=null,o.dropPlace=null;return}const f=o.rows.find(l=>l.id===c),m=o.rows.find(l=>l.id===J);if(!f||f.context||m&&f.path.startsWith(`${m.path}/`)){o.dropId=null,o.dropPlace=null;return}const h=i.getBoundingClientRect();o.dropId=c,o.dropPlace=To(t.clientY-h.top,h.height,!Yt(f.tag)&&f.kind!=="component")}function fi(e,t){const s=J,n=o.dropId,a=o.dropPlace||"after",r=o.dragging;if(Ne(),r&&(te=!0,e.setTimeout(()=>{te=!1},0)),!r||b("dock:is-locked")||!s||!n||s===n)return;t?.preventDefault?.();const i=O(),c=So(i,_e,s,n,a);c!==i&&de(c)}function Ne(){try{Re?.releasePointerCapture?.(De)}catch{}ot?.(),J=null,ve=null,Re=null,De=null,o.dragging=!1,o.dropId=null,o.dropPlace=null}function mi(e,t,s){if(t.button!==0||!s||o.editingId||t.target?.closest?.("button, input"))return;xn(),xe=s,ge={x:t.clientX,y:t.clientY},Oe=t.currentTarget,Be=t.pointerId;const n=r=>vi(e,r),a=r=>gi(e,r);st=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),st=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function vi(e,t){if(!xe||!ge)return;const s=t.clientX-ge.x,n=t.clientY-ge.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{Oe?.setPointerCapture?.(Be)}catch{}}t.preventDefault();const r=e.document.elementFromPoint(t.clientX,t.clientY)?.closest?.("[data-sve-ht-sec-uid]"),i=r?.getAttribute("data-sve-ht-sec-uid")||"";if(!i||i===xe){o.sectionDrop=null;return}const c=r.getBoundingClientRect();o.sectionDrop={uid:i,place:t.clientY-c.top<c.height/2?"before":"after"}}function gi(e,t){const s=xe,n=o.sectionDrop,a=o.dragging;xn(),a&&(te=!0,e.setTimeout(()=>{te=!1},0)),!(!a||!s||!n?.uid||n.uid===s)&&(t?.preventDefault?.(),ki(e,s,n.uid,n.place))}function xn(){try{Oe?.releasePointerCapture?.(Be)}catch{}st?.(),xe=null,ge=null,Oe=null,Be=null,o.dragging=!1,o.sectionDrop=null}function ki(e,t,s,n){const a=Se(e)||"page_sections";for(const r of qe(e.document)||[]){const i=Ke(r.values),c=i&&typeof i=="object"?i[a]:null;if(!Array.isArray(c))continue;const f=d=>c.findIndex(y=>y&&typeof y=="object"&&[y._visual_id,y.id,y._id].includes(d)),m=f(t),h=f(s);if(m===-1||h===-1||m===h)return!1;let l=n==="before"?h:h+1;return m<l&&(l-=1),l===m?!1:(e.postMessage({source:ae,type:se.MOVE,uid:t,toIndex:l},e.location.origin),e.setTimeout(()=>L(e),60),!0)}return!1}function Tn(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function it(e,t){if(t?.kind==="component"){yi(e,t);return}if(F.callOpen&&(F.callOpen=!1,F.callStore=null,R.forget(),ut(e)),t?.kind!=="antlers"){o.inspect=null;return}const s=t.id;if(t.tag==="else"){o.inspect={key:s,title:p(e,"antlers_condition"),mode:"note",note:p(e,"antlers_else_note")};return}if(t.antlers==="loop"){const n=t.loopKind==="collection",a=Z?.id===t.id?Z.dir:"",r=t.sortDir||a;o.inspect={key:s,title:p(e,"antlers_loop"),mode:"loop",loopKind:n?"collection":"field",kinds:[{id:"field",label:p(e,"antlers_loop_field")},{id:"collection",label:p(e,"antlers_loop_collection")}],collections:Tn(e),value:t.expr||"",placeholder:p(e,n?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:p(e,"antlers_sort"),dir:r,needsField:r==="asc"||r==="desc",field:t.sortField||"",pickable:!n,placeholder:p(e,n?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:p(e,"antlers_sort_none")},{id:"asc",label:p(e,"antlers_sort_asc")},{id:"desc",label:p(e,"antlers_sort_desc")},{id:"random",label:p(e,"antlers_sort_random")}]},limit:{title:p(e,"antlers_limit"),value:t.limit||"",placeholder:p(e,"antlers_limit_placeholder")},branches:[]};return}o.inspect={key:s,title:p(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:p(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:p(e,"antlers_add_elseif")},{id:"else",label:p(e,"antlers_add_else")}]}}function yi(e,t){if(!go(e)){o.inspect=null;return}if(!t.src)return;const s=t.id;if(o.inspect={key:s,title:p(e,"component_props_values"),mode:"note",note:p(e,"code_dock_loading")},ko()){const n={},a={},r=new Map;for(const[i,c]of yo(O().slice(t.from,t.to))){const f=bo(i);f&&(i!==f||!r.has(f))&&r.set(f,c)}for(const[i,c]of r)c.bound?a[i]=c.value:n[i]=c.value;Et!==s&&(Et=s,ye.clear());for(const i of ye)i in a||(a[i]="");o.inspect=null,F.callOpen=!0,F.title=F.title||p(e,"component_props"),F.callTitle=t.klass||t.name||t.src,F.callStore=R.ui,R.ui.canBind=!0,R.ui.dataTitle=p(e,"data_vars_title"),R.ui.exprPlaceholder=p(e,"component_props_expr"),R.ui.onToggleBind=(i,c)=>_i(e,i,c),R.ui.onExpr=(i,c)=>Mt(e,i,c),R.ui.onPickData=(i,c)=>b("dock:data-menu",{anchor:c,at:t.from,onPick:f=>Mt(e,i,String(f?.var||"").trim())}),R.load(e,{key:`${t.src}::${s}`,src:t.src,params:n,bindings:a,readOnly:b("dock:is-locked")===!0}),R.watch(e,{src:t.src,write:i=>bi(e,i,a)}),ut(e);return}_o(e,t.src).then(n=>{if(o.inspect?.key===s){if(!n.length){o.inspect={key:s,title:p(e,"component_props_values"),mode:"note",note:p(e,"component_props_values_none")};return}o.inspect={key:s,title:p(e,"component_props_values"),mode:"props",inheritLabel:p(e,"component_props_inherit"),rows:xo(n,O().slice(t.from,t.to))}}})}function bi(e,t,s={}){const n=o.rows.find(i=>i.id===I);if(n?.kind!=="component"||b("dock:is-locked"))return;let a=O(),r=n.to;for(const[i,c]of Object.entries(t||{})){if(i in s)continue;const f=a.length,m=ht(a,{from:n.from,to:r},i,c);m!==a&&(r+=m.length-f,a=m)}a!==O()&&(de(a,{save:!0}),L(e))}function _i(e,t,s){s?ye.add(t):ye.delete(t),Sn(e,t,"",s),L(e)}function Mt(e,t,s){ye.add(t),Sn(e,t,s,!0),L(e)}function Sn(e,t,s,n){const a=o.rows.find(c=>c.id===I);if(a?.kind!=="component"||b("dock:is-locked"))return;const r=O(),i=ht(r,a,t,s,{bound:n});i!==r&&de(i,{save:!0})}function je(){const e=o.rows.find(t=>t.id===I);return e?.kind==="antlers"&&!b("dock:is-locked")?e:null}function ee(e,t){const s=je();if(!s)return;const n=O(),a=t(n,s);a!==n&&(de(a),L(e))}function Rt(e,t,s,n){const a=o.rows.find(c=>c.id===I);if(a?.kind!=="component"||b("dock:is-locked"))return;const r=O(),i=ht(r,a,t,s,{bound:n});i!==r&&(de(i,{save:!0}),L(e))}function xi(e,t){ee(e,(s,n)=>n.antlers==="loop"?et(s,n,n.loopKind==="collection"?"collection":"field",t):Fa(s,n,t))}function Ti(e,t){const s=je();if(!s||s.antlers!=="loop")return;const n=s.loopKind==="collection"?"collection":"field";if(t!==n){if(t==="collection"){const a=Tn(e)[0]?.handle;if(!a)return;ee(e,(r,i)=>et(r,i,"collection",a));return}ee(e,(a,r)=>et(a,r,"field",r.handle||"items"))}}function Si(e,t){ee(e,(s,n)=>Na(s,n,t))}function Ci(e,t){if(!e||!t||t.kind==="component"||Yt(t.tag))return null;const s=mo(e,t);if(s<t.openTo)return null;const n=e.lastIndexOf(`
`,s-1)+1;return e.slice(n,s).trim()===""&&n>t.openTo?n-1:s}function vt(e,t,s){if(te)return;const n=(s||o.rows).find(a=>a.id===t);n&&(I=t,o.rows.forEach(a=>{a.current=a.id===t}),it(e,n),!ft()&&(b("dock:reveal-html",{from:n.from,to:n.to,caret:Ci(O(),n)}),b("dock:tw-follow"),ce({source:ae,type:se.SVE_HTML_PICK_FOCUS,path:n.path},e)))}function Pi(e,t){if(!t)return"";const s=[],n=(a,r)=>{for(const i of a||[]){const c=r||i.path===e;i.kind==="component"&&i.src===t&&s.push({path:i.path,inside:c}),n(i.children,c)}};return n(_e,!1),(s.find(a=>a.inside)||s[0])?.path||""}function Li(e,t){if(!t||!j(e.document))return;Ce=!1,ei(t),L(e);const s=o.rows.find(n=>n.path===t);s&&(vt(e,s.id,o.rows),e.setTimeout(()=>{j(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function rt(e){if(Ae)return;const t=()=>{o.editingId||o.dragging||(e.clearTimeout(Me),Me=e.setTimeout(()=>{j(e.document)&&L(e)},80))},s=()=>t();Ae=Vt("dock:html-changed",t),e.document.addEventListener("sve-page-structure",s),nt=()=>{e.document.removeEventListener("sve-page-structure",s)}}function $i(e){Ae?.(),Ae=null,nt?.(),nt=null,e?.clearTimeout?.(Me),Me=0}function gt(e){const t=j(e.document);if(ce({source:ae,type:se.SVE_HTML_PICK,on:!1},e),$i(e),R.forget(),F.callOpen=!1,F.callStore=null,ut(e),Ne(),G(),co(e),I=null,o.inspect=null,o.editingId=null,o.draft="",o.sections=[],o.pageBuilder=!1,V="",e?.clearTimeout?.(be),!t){Je(e);return}t.remove(),lt.headerTab==="html_tree"&&to(e,null),Kn(e),jt(e),qt(e),Je(e)}function Bi(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=Ee,we(t,en,{title:p(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>gt(e)))}function Fi(e){rt(e),L(e)}function Ei(e){const t=e.document;if(!Nn(e,"html_tree"))return;if(j(t)){rt(e),L(e);return}if(!hn(t))return;Ce=!0,D.clear(),zn(e,[Ee]);const s=t.createElement("div");s.id=Ee,s.style.cssText=Un,we(s,en,{title:p(e,"html_tree")}),s.querySelector("[data-sve-close]")?.addEventListener("click",()=>gt(e)),Xn(e,s),jt(e),qt(e),Je(e),rt(e),L(e)}function ji(e){if(j(e.document)){gt(e);return}Ei(e)}Nt("html-tree:from-preview",({path:e,src:t}={})=>{Ut(window,e)||Li(window,Pi(e,t)||e)});Nt("html-tree:arm-pick",e=>{const t=window;return e?(yn(t,Ve(O())),!0):(j(t.document)||ce({source:ae,type:se.SVE_HTML_PICK,on:!1},t),!0)});function qi(){W.clear(),le.clear(),ne.length=0}export{za as HTML_TREE_STYLE_ID,Oi as armHtmlTreePrefetch,qi as clearHtmlTreeTemplates,G as closeHtmlTreeMenu,gt as closeHtmlTreePanel,Ua as ensureHtmlTreeStyles,Bi as fillHtmlTreePane,I as htmlTreeActiveId,j as htmlTreePanel,Me as htmlTreeTimer,Ae as htmlTreeUnhook,Ei as openHtmlTreePanel,L as renderHtmlTree,Fi as showHtmlTreePane,$i as stopWatchHtmlTreeDock,ji as toggleHtmlTreePanel,rt as watchHtmlTreeDock};
