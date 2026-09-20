const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-D8Xdoe3O.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{_ as Te,k as z,l as Pn,p as Rt,o as g,a as k,b as S,s as _,t as C,F as H,w as Pe,d as K,b4 as Ln,g as $,v as Dt,b5 as $n,y as b,h as p,j as oe,C as wn,i as Ot,b6 as gt,b7 as kt,b8 as En,b9 as Hn,ba as In,bb as An,bc as Bt,z as ce,ap as Mn,bd as o,u,f as Rn,e as Dn,q as Y,x as On,be as Le,bf as Bn,B as fe,c as pe,N as Fn,G as jn,aN as rt,aq as We,am as qn,aP as Ft,aQ as jt,af as Kn,ag as yt,S as $e,V as we,O as Vn,aO as Nn,an as zn,ao as Un,bg as bt,bh as Xn,U as qt,A as Kt,a8 as Fe,J as it,K as lt,ax as Vt,ay as Ge,I as Yn,bi as Wn,aS as Gn,aT as Zn,aw as Jn,bj as Qn,b0 as eo,ae as Nt,aK as to,aF as no}from"./addon-BuGH-5fS.js";import{M as se,S as ae}from"./protocol-D3FYhCm9.js";import{canEditFields as oo,currentSetHandle as so,openFieldsetOverlay as zt}from"./section-fields-DJe7gk1r.js";import{D as F,E as ao,F as ct,G as ro,t as io,I as dt,v as lo,z as co,b as je,l as _t,J as Ut,q as uo,K as Xt,L as ho,H as po,M as ut,N as Yt,O as fo,h as mo,c as vo,Q as go,R as ko,S as yo,T as bo,U as _o,V as xo,W as To,X as So,Y as Co,Z as Po}from"./tw-classes-BkfStZZy.js";import{a as Lo}from"./html-pick-align-CK-9iH9_.js";import"./ai-text-icon-B7uCWIwa.js";import"./FieldsetOverlay-CQ1xOmnz.js";const $o={class:"sve-dialog__title"},wo={for:"sve-new-section-group"},Eo=["value"],Ho={for:"sve-new-section-name"},Io=["placeholder"],Ao={key:1,class:"sve-dialog__toggle"},Mo={key:2,class:"sve-dialog__note"},Ro={class:"sve-dialog__actions"},Do=["disabled"],Oo=["disabled"],Bo={__name:"NewSectionPrompt",props:{heading:{type:String,required:!0},groupLabel:{type:String,required:!0},nameLabel:{type:String,required:!0},placeholder:{type:String,default:""},note:{type:String,default:""},groups:{type:Array,required:!0},toggleLabel:{type:String,default:""},toggleOn:{type:Boolean,default:!0},cancelLabel:{type:String,required:!0},saveLabel:{type:String,required:!0},onOk:{type:Function,required:!0},onClose:{type:Function,required:!0}},setup(e){const t=e,s=z(""),n=z(t.groups[0]?.key??""),a=z(t.toggleOn),i=z(null),r=z(!1);Pn(()=>Rt(()=>i.value?.focus()));function c(){const h=s.value.trim();if(!h||t.groups.length&&!n.value||r.value){i.value?.focus();return}r.value=!0,t.onOk(h,n.value,a.value)}function v(h){h.target===h.currentTarget&&t.onClose()}function m(h){h.key==="Enter"?c():h.key==="Escape"&&t.onClose()}return(h,l)=>(g(),k("div",{class:"sve-dialog-overlay",onClick:v},[S("div",{class:"sve-dialog",onClick:l[4]||(l[4]=_(()=>{},["stop"]))},[S("div",$o,C(e.heading),1),e.groups.length?(g(),k(H,{key:0},[S("label",wo,C(e.groupLabel),1),Pe(S("select",{id:"sve-new-section-group","onUpdate:modelValue":l[0]||(l[0]=d=>n.value=d),onKeydown:m},[(g(!0),k(H,null,K(e.groups,d=>(g(),k("option",{key:d.key,value:d.key},C(d.display),9,Eo))),128))],544),[[Ln,n.value]])],64)):$("",!0),S("label",Ho,C(e.nameLabel),1),Pe(S("input",{id:"sve-new-section-name",ref_key:"input",ref:i,"onUpdate:modelValue":l[1]||(l[1]=d=>s.value=d),type:"text",placeholder:e.placeholder,onKeydown:m},null,40,Io),[[Dt,s.value]]),e.toggleLabel?(g(),k("label",Ao,[Pe(S("input",{"onUpdate:modelValue":l[2]||(l[2]=d=>a.value=d),type:"checkbox",onKeydown:m},null,544),[[$n,a.value]]),S("span",null,C(e.toggleLabel),1)])):$("",!0),e.note?(g(),k("p",Mo,C(e.note),1)):$("",!0),S("div",Ro,[S("button",{type:"button",class:"is-cancel",disabled:r.value,onClick:l[3]||(l[3]=(...d)=>e.onClose&&e.onClose(...d))},C(e.cancelLabel),9,Do),S("button",{type:"button",class:"is-primary",disabled:r.value,onClick:c},C(e.saveLabel),9,Oo)])])]))}},Wt=Te(Bo,[["__scopeId","data-v-3ef3bbc9"]]),Gt="/!/sve/section-types",Fo="static_sections";async function jo(e){const t=await e.fetch(Gt,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!t.ok)throw new Error(`section-types ${t.status}`);const s=await t.json(),n=new Map;for(const a of s.types||[])a?.group&&a.group!==Fo&&!n.has(a.group)&&n.set(a.group,a.group_display||a.group);return[...n].map(([a,i])=>({key:a,display:i}))}const ke=new Map;function qo(e){e?.handle&&ke.set(e.handle,{static:!!e.static,hidden:!!e.hidden})}function Ko(e,t){return t?ke.has(t)?ke.get(t).static:e.Statamic?.$config?.get?.("sveSetMeta")?.[t]?.static===!0:!1}function Vo(e,t){if(!t)return!1;if(ke.has(t))return ke.get(t).hidden;const s=e.Statamic?.$config?.get?.("sveSectionTypes");return Array.isArray(s)&&s.some(n=>n?.handle===t&&n.hidden===!0)}async function Zt(e,t,s){const n=await e.fetch(Gt,{method:t,headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Ot(e),Accept:"application/json"},credentials:"same-origin",body:JSON.stringify(s)}),a=await n.json().catch(()=>({}));if(!n.ok){const i=new Error(a.error||`section-types ${n.status}`);throw i.reason=a.error,i}return qo(a.section),a}function No(e,{display:t,group:s="",static:n=!1,hidden:a=!1}){return Zt(e,"POST",{display:t,group:s,static:n,hidden:a})}function xt(e,{handle:t,hidden:s,fields:n=!1}){const a={handle:t,fields:n};return typeof s=="boolean"&&(a.hidden=s),Zt(e,"PATCH",a)}async function zo(e,t,s=null,n=null){if(!t||typeof gt!="function"||typeof kt!="function")return null;const a=await gt(e,t);if(!a)return null;n&&Array.isArray(a.definitions)&&En(t,{display:n.display||t,icon:n.icon||null,hide:n.hidden===!0,fields:a.definitions,group_display:n.group_display||n.group||""},n.group||"");const i=Hn(),r=In(e,"page",{handle:t},a?.defaults,i),c=An(r,a?.new||{},a?.defaults);return kt(e,e.document,s,r,c)?r:null}const Tt=700,Uo=17;function Xo(e,t){const s=(t||[]).filter(Boolean);if(!s.length)return;let n=0;const a=()=>{n+=1;const i=Bt(e),r=i?s.some(c=>i.querySelector(`[data-sid="${CSS.escape(c)}"]`)):!0;r&&ce({source:ae,type:se.SVE_ACTIVATE,ids:s},e),(r?!i&&n<6:n<Uo)&&e.setTimeout(a,Tt)};e.setTimeout(a,Tt)}function Jt(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function Yo(e){return new Promise(t=>{let s=!1;const n=i=>{s||(s=!0,a.dismiss(),t(i==="static"||i==="fields"?i:null))},a=oe(e.document,wn,{title:p(e,"section_new_kind"),body:p(e,"section_new_kind_note"),buttons:[{value:"cancel",label:p(e,"cancel"),variant:"ghost"},{value:"static",label:p(e,"section_new_static"),variant:"primary"},{value:"fields",label:p(e,"section_new_with_fields"),variant:"primary"}],onPick:n,onClose:()=>n(null)})})}const Wo=`<section class="[ ] py-800">
    
</section>
`;function Go(e){if(b("dock:is-locked")===!0)return e.Statamic?.$toast?.error(p(e,"code_dock_locked")),!1;const s=`${String(b("dock:html")||"").replace(/\s+$/,"")}

${Wo}`;return b("dock:set-html",s)!==!0?(e.Statamic?.$toast?.error(p(e,"section_new_failed")),!1):(b("dock:save-now"),e.Statamic?.$toast?.success(p(e,"section_new_template_done")),!0)}async function Qt(e,t,s,{afterUid:n,onDone:a,onError:i}){try{const r=await No(e,s);t.dismiss(),e.Statamic?.$toast?.success(p(e,"section_created",{name:r.section?.display||s.display})),Ze(e);const c=r.section?.handle?{...r.section,group_display:(r.section_types||[]).find(m=>m?.handle===r.section.handle)?.group_display||""}:null,v=await zo(e,r.section?.handle,n,c);!v&&r.section?.handle&&b("dock:open-template",r.section.handle),a?.({...r,uid:v?._visual_id||""})}catch(r){t.dismiss(),e.Statamic?.$toast?.error(p(e,r.reason==="bad_name"?"section_new_bad_name":"section_new_failed")),i?.(r)}}function Ze(e){e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"))}function Zo(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){const i=oe(e.document,Wt,{heading:p(e,"static_section_new"),groupLabel:"",nameLabel:p(e,"section_new_name"),placeholder:p(e,"section_new_placeholder"),note:p(e,"static_section_note"),groups:[],toggleLabel:p(e,"static_section_insertable"),cancelLabel:p(e,"cancel"),saveLabel:p(e,"section_new_create"),onClose:a,onOk:(r,c,v)=>{Qt(e,i,{display:r,static:!0,hidden:!v},{afterUid:t,onDone:s,onError:n})}})}function Jo(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){(async()=>{let i=[];try{i=await jo(e)}catch(c){n?.(c),e.Statamic?.$toast?.error(p(e,"section_new_failed"));return}if(!i.length){n?.(new Error("no groups")),e.Statamic?.$toast?.error(p(e,"section_new_failed"));return}const r=oe(e.document,Wt,{heading:p(e,"section_new"),groupLabel:p(e,"section_new_group"),nameLabel:p(e,"section_new_name"),placeholder:p(e,"section_new_placeholder"),note:p(e,"section_new_note"),groups:i,cancelLabel:p(e,"cancel"),saveLabel:p(e,"section_new_create"),onClose:a,onOk:(c,v)=>{Qt(e,r,{display:c,group:v},{afterUid:t,onDone:s,onError:n})}})})()}const Qo={key:0,class:"sve-ht-inspect"},es={class:"sve-ht-inspect__head"},ts={key:0,class:"sve-ht-inspect__note"},ns={key:2,class:"sve-ht-inspect__props"},os={class:"sve-ht-inspect__proplabel"},ss={key:0},as=["value","disabled","onChange"],rs={value:""},is=["value"],ls=["value"],cs=["value","placeholder","onChange"],ds=["title","disabled","onClick"],us=["title","disabled","onClick"],hs={key:0,class:"sve-ht-inspect__seg"},ps=["data-active","disabled","onClick"],fs=["value","disabled"],ms={key:0,value:""},vs=["value"],gs={key:2,class:"sve-ht-inspect__box"},ks=["value","placeholder","disabled","onKeydown"],ys=["title","disabled"],bs={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},_s=["value","disabled"],xs=["value"],Ts={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},Ss=["value","placeholder","disabled"],Cs=["title","disabled"],Ps={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Ls=["value","placeholder","disabled"],$s={key:4,class:"sve-ht-inspect__add"},ws=["disabled","onClick"],Ke='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',Es='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',Hs={__name:"HtmlTreeInspector",setup(e){const t=z(null);Mn(t,m=>o.onPropHost?.(m||null));const s=z(null),n=z(null);function a(m){o.onInspectCommit?.(m.target.value)}function i(m,h,l){!m||!h||(m.value=h,m.focus(),m.setSelectionRange(h.length,h.length),l(h))}function r(m,h){o.onInspectData?.(m.currentTarget,l=>o.onPropValue?.(h.handle,l,!0))}function c(m){o.onInspectData?.(m.currentTarget,h=>i(s.value,h,l=>o.onInspectCommit?.(l)))}function v(m){o.onInspectData?.(m.currentTarget,h=>i(n.value,h,l=>o.onLoopSortField?.(l)))}return(m,h)=>u(o).inspect?(g(),k("div",Qo,[S("div",es,C(u(o).inspect.title),1),u(o).inspect.mode==="note"?(g(),k("div",ts,C(u(o).inspect.note),1)):u(o).inspect.mode==="statamic"?(g(),k("div",{key:1,ref_key:"propHost",ref:t,class:"sve-ht-inspect__form"},null,512)):u(o).inspect.mode==="props"?(g(),k("div",ns,[(g(!0),k(H,null,K(u(o).inspect.rows,l=>(g(),k("label",{key:l.handle,class:"sve-ht-inspect__prop"},[S("span",os,[Rn(C(l.label)+" ",1),l.bound?(g(),k("em",ss,":")):$("",!0)]),S("span",{class:Dn(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":l.type==="select"||l.type==="link"}])},[l.type==="select"&&!l.bound?(g(),k("select",{key:0,value:l.value,disabled:!u(o).canEdit,onChange:d=>u(o).onPropValue?.(l.handle,d.target.value,!1)},[S("option",rs,C(l.placeholder||u(o).inspect.inheritLabel),1),l.value&&!l.options.includes(l.value)?(g(),k("option",{key:0,value:l.value},C(l.value),9,is)):$("",!0),(g(!0),k(H,null,K(l.options,d=>(g(),k("option",{key:d,value:d},C(d),9,ls))),128))],40,as)):(g(),k("input",{key:1,type:"text",value:l.value,placeholder:l.placeholder||u(o).inspect.inheritLabel,onChange:d=>u(o).onPropValue?.(l.handle,d.target.value,l.bound)},null,40,cs)),l.type==="link"?(g(),k("button",{key:2,type:"button","data-sve-ht-data":"",title:u(o).pageTitle,disabled:!u(o).canEdit,onClick:d=>u(o).onPropPage?.(d.currentTarget,l.handle),innerHTML:Es},null,8,ds)):$("",!0),S("button",{type:"button","data-sve-ht-data":"",title:u(o).dataTitle,disabled:!u(o).canEdit,onClick:d=>r(d,l),innerHTML:Ke},null,8,us)],2)]))),128))])):(g(),k(H,{key:3},[u(o).inspect.mode==="loop"?(g(),k("div",hs,[(g(!0),k(H,null,K(u(o).inspect.kinds,l=>(g(),k("button",{key:l.id,type:"button","data-active":l.id===u(o).inspect.loopKind?"":void 0,disabled:!u(o).canEdit,onClick:d=>u(o).onLoopKind?.(l.id)},C(l.label),9,ps))),128))])):$("",!0),u(o).inspect.mode==="loop"&&u(o).inspect.loopKind==="collection"?(g(),k("select",{key:u(o).inspect.key+":"+u(o).inspect.value,value:u(o).inspect.value,disabled:!u(o).canEdit,onChange:a},[u(o).inspect.value?$("",!0):(g(),k("option",ms,C(u(o).inspect.placeholder),1)),(g(!0),k(H,null,K(u(o).inspect.collections,l=>(g(),k("option",{key:l.handle,value:l.handle},C(l.title),9,vs))),128))],40,fs)):(g(),k("div",gs,[(g(),k("input",{ref_key:"field",ref:s,key:u(o).inspect.key,type:"text",value:u(o).inspect.value,placeholder:u(o).inspect.placeholder,disabled:!u(o).canEdit,spellcheck:"false",onKeydown:[h[0]||(h[0]=_(()=>{},["stop"])),Y(_(a,["prevent"]),["enter"])],onBlur:a},null,40,ks)),S("button",{type:"button","data-sve-ht-data":"",title:u(o).dataTitle,disabled:!u(o).canEdit,innerHTML:Ke,onMousedown:h[1]||(h[1]=_(()=>{},["prevent"])),onClick:_(c,["stop","prevent"])},null,40,ys)])),u(o).inspect.sort?(g(),k(H,{key:3},[S("div",bs,C(u(o).inspect.sort.title),1),(g(),k("select",{key:u(o).inspect.key+":dir:"+u(o).inspect.sort.dir,value:u(o).inspect.sort.dir,disabled:!u(o).canEdit,onChange:h[2]||(h[2]=l=>u(o).onLoopSortDir?.(l.target.value))},[(g(!0),k(H,null,K(u(o).inspect.sort.dirs,l=>(g(),k("option",{key:l.id,value:l.id},C(l.label),9,xs))),128))],40,_s)),u(o).inspect.sort.needsField?(g(),k("div",Ts,[(g(),k("input",{ref_key:"sortField",ref:n,key:u(o).inspect.key+":field",type:"text",value:u(o).inspect.sort.field,placeholder:u(o).inspect.sort.placeholder,disabled:!u(o).canEdit,spellcheck:"false",onKeydown:[h[3]||(h[3]=_(()=>{},["stop"])),h[4]||(h[4]=Y(_(l=>u(o).onLoopSortField?.(l.target.value),["prevent"]),["enter"]))],onBlur:h[5]||(h[5]=l=>u(o).onLoopSortField?.(l.target.value))},null,40,Ss)),u(o).inspect.sort.pickable?(g(),k("button",{key:0,type:"button","data-sve-ht-data":"",title:u(o).dataTitle,disabled:!u(o).canEdit,innerHTML:Ke,onMousedown:h[6]||(h[6]=_(()=>{},["prevent"])),onClick:_(v,["stop","prevent"])},null,40,Cs)):$("",!0)])):$("",!0),S("div",Ps,C(u(o).inspect.limit.title),1),(g(),k("input",{key:u(o).inspect.key+":limit",type:"number",min:"1",value:u(o).inspect.limit.value,placeholder:u(o).inspect.limit.placeholder,disabled:!u(o).canEdit,onKeydown:[h[7]||(h[7]=_(()=>{},["stop"])),h[8]||(h[8]=Y(_(l=>u(o).onLoopLimit?.(l.target.value),["prevent"]),["enter"]))],onBlur:h[9]||(h[9]=l=>u(o).onLoopLimit?.(l.target.value))},null,40,Ls))],64)):$("",!0),u(o).inspect.branches?.length?(g(),k("div",$s,[(g(!0),k(H,null,K(u(o).inspect.branches,l=>(g(),k("button",{key:l.id,type:"button",disabled:!u(o).canEdit,onClick:d=>u(o).onAddBranch?.(l.id)},C(l.label),9,ws))),128))])):$("",!0)],64))])):$("",!0)}},Is=Te(Hs,[["__scopeId","data-v-26254b75"]]),As={class:"sve-html-tree"},Ms={class:"sve-pane-bar","data-sve-pane-bar":""},Rs={"data-sve-right-title":""},Ds={class:"sve-ht-tools"},Os=["title"],Bs=["placeholder","aria-label","value"],Fs=["aria-label"],js=["title","aria-label"],qs={key:1,class:"sve-tree-exit"},Ks=["title"],Vs=["title"],Ns='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',zs='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',Us='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',Xs={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const t=p(window,"html_tree_search"),s=Jt(window),n=p(window,"section_new"),a=z(!1);function i(){a.value=!1}async function r(m){if(m)for(let h=0;h<20;h+=1){await Rt(),o.onRefresh?.();const l=o.sections.find(d=>d.uid===m);if(l){o.onSection?.(m),Xo(window,l.ids);return}await new Promise(d=>setTimeout(d,50))}}function c(){a.value||(a.value=!0,(async()=>{if(!(o.sections.length||o.pageBuilder)){Go(window),i();return}const m=await Yo(window);if(!m){i();return}const h=o.sections.length?o.sections[o.sections.length-1].uid:null,l=d=>{i(),r(d?.uid)};if(m==="static"){Zo(window,{afterUid:h,onDone:l,onError:i,onClose:i});return}Jo(window,{afterUid:h,onDone:l,onError:i,onClose:i})})())}function v(m){const h=!!o.query;o.query=m,h!==!!m&&o.onQuery?.()}return(m,h)=>(g(),k("div",As,[S("div",Ms,[S("div",Rs,C(e.title),1),h[5]||(h[5]=On('<div data-sve-right-actions data-v-76fd5289><button type="button" data-sve-right-pin aria-pressed="false" data-v-76fd5289></button><button type="button" data-sve-close aria-label="Close" data-v-76fd5289><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-76fd5289><path d="M18 6 6 18" data-v-76fd5289></path><path d="m6 6 12 12" data-v-76fd5289></path></svg></button></div>',1))]),S("div",Ds,[S("label",{class:"sve-ht-search",title:u(t)},[S("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:zs}),S("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:u(t),"aria-label":u(t),value:u(o).query,autocomplete:"off",spellcheck:"false",onInput:h[0]||(h[0]=l=>v(l.target.value)),onKeydown:[h[1]||(h[1]=_(()=>{},["stop"])),h[2]||(h[2]=Y(_(l=>v(""),["prevent"]),["escape"]))]},null,40,Bs),u(o).query?(g(),k("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":u(t),innerHTML:Us,onClick:h[3]||(h[3]=l=>v(""))},null,8,Fs)):$("",!0)],8,Os),u(s)&&(u(o).sections.length||u(o).pageBuilder||u(o).rows.length)?(g(),k("button",{key:0,type:"button",class:"sve-ht-new",title:u(n),"aria-label":u(n),innerHTML:Ns,onClick:c},null,8,js)):$("",!0)]),u(F).inSidebar?$("",!0):(g(),Le(ao,{key:0})),h[6]||(h[6]=S("div",{"data-sve-html-tree-list":""},null,-1)),Bn(Is),u(o).exitOpen&&!u(F).inSidebar?(g(),k("div",qs,[S("span",{class:"sve-tree-exit__name",title:u(o).exitName},C(u(o).exitName),9,Ks),S("button",{type:"button",class:"sve-tree-exit__go",title:u(o).exitTitle,onClick:h[4]||(h[4]=l=>u(o).onExit?.())},C(u(o).exitLabel),9,Vs)])):$("",!0)]))}},en=Te(Xs,[["__scopeId","data-v-76fd5289"]]);function tn(e){return String(e||"").trim().toLowerCase()}function nn(e,t){return t?[e.name,e.tag,e.klass,e.label,e.src].filter(s=>typeof s=="string"&&s).join(" ").toLowerCase().includes(t):!0}function Ys(e,t){const s=tn(t);if(!s)return{rows:e,hits:new Set};const n=new Set;for(const r of e)nn(r,s)&&n.add(r.path);const a=[...n];return{rows:e.filter(r=>n.has(r.path)||a.some(c=>c.startsWith(`${r.path}/`))),hits:n}}const Ws=["title"],Gs={"data-sve-ht-indent":"","aria-hidden":"true"},Zs=["data-sve-ht-cat"],Js={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},Qs={key:2,"data-sve-ht-letter":""},ea=["innerHTML"],ta=["title"],na=["title"],oa={key:1,"data-sve-ht-kind":""},sa={key:3,"data-sve-ht-name":""},aa={key:4,"data-sve-ht-actions":""},ra=["disabled","title","innerHTML"],ia=["disabled","title"],la=["disabled","title"],ca=["disabled","title"],da=["data-sve-ht-id"],ua='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',ha='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',pa='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',fa='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',ma='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',va='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',ga={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const t=oo(window),s=p(window,"section_fields");function n(){const l=so();if(!l){window.Statamic?.$toast?.error(p(window,"section_fields_none"));return}zt(window,l)}function a(l){return l.kind==="component"?l.src?`partial:${l.src}`:l.tag:l.name?`${l.tag} ${l.name}`:l.tag}function i(l){return!!l.section}function r(l){return!!l.context}function c(l,d){r(d)||(i(d)?o.onSectionPointerDown?.(l,d.section):d.sectionRoot?o.onSectionPointerDown?.(l,d.sectionRoot):o.onPointerDown?.(l,d.id))}function v(l){if(i(l)){o.onSection?.(l.section);return}if(r(l)){o.onContextRow?.(l.id);return}o.onSelect?.(l.id)}function m(l,d){const y={"data-sve-ht-id":l.id};return l.current&&(y["data-sve-ht-current"]=""),l.hidden&&(y["data-sve-ht-hidden"]=""),y["data-sve-ht-cat"]=l.cat||"other",y["data-sve-ht-depth"]=String(l.depth),d&&(y["data-sve-ht-dim"]=""),r(l)&&(y["data-sve-ht-context"]=l.context),i(l)&&(y["data-sve-ht-sec"]=""),!i(l)&&o.dropId===l.id&&o.dropPlace&&(y["data-sve-ht-drop"]=o.dropPlace),y}function h(l){return!l.hidden||l.wrapFrom!=null}return(l,d)=>(g(),k(H,null,[S("div",fe({"data-sve-ht-row":""},m(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:d[26]||(d[26]=y=>v(e.row)),onDblclick:d[27]||(d[27]=_(y=>i(e.row)||r(e.row)?null:u(o).onRename?.(e.row.id),["prevent"])),onKeydown:[d[28]||(d[28]=Y(_(y=>v(e.row),["prevent"]),["enter"])),d[29]||(d[29]=Y(_(y=>v(e.row),["prevent"]),["space"]))],onPointerdown:d[30]||(d[30]=y=>c(y,e.row)),onContextmenu:d[31]||(d[31]=_(y=>i(e.row)||r(e.row)?null:u(o).onContext?.(y,e.row.id),["prevent","stop"]))}),[S("span",Gs,[(g(!0),k(H,null,K(e.row.guides||[],(y,P)=>(g(),k("i",{key:P,"data-sve-ht-cat":y},null,8,Zs))),128))]),e.row.hasChildren||e.row.emptyBlock?(g(),k("button",fe({key:0,type:"button","data-sve-ht-twist":""},e.row.shut?{"data-sve-ht-shut":""}:{},{innerHTML:ha,onClick:d[0]||(d[0]=_(y=>i(e.row)?u(o).onSection?.(e.row.section):u(o).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:d[1]||(d[1]=_(()=>{},["stop"])),onDblclick:d[2]||(d[2]=_(()=>{},["stop"]))}),null,16)):(g(),k("span",Js)),e.row.letter?(g(),k("span",Qs,C(e.row.letter),1)):(g(),k("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,ea)),S("span",{"data-sve-ht-text":"",title:u(o).renameTitle},[!e.row.kind&&!i(e.row)&&!r(e.row)?(g(),k("button",{key:0,type:"button","data-sve-ht-tag":"",title:u(o).tagTitle,onClick:d[3]||(d[3]=_(()=>{},["stop","prevent"])),onPointerdown:d[4]||(d[4]=_(()=>{},["stop"])),onDblclick:d[5]||(d[5]=_(y=>u(o).onTagChange?.(y,e.row.id),["stop","prevent"]))},C(e.row.tag),41,na)):(g(),k("span",oa,C(e.row.tag),1)),u(o).editingId===e.row.id&&!i(e.row)?Pe((g(),k("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":d[6]||(d[6]=y=>u(o).draft=y),onMousedown:d[7]||(d[7]=_(()=>{},["stop"])),onPointerdown:d[8]||(d[8]=_(()=>{},["stop"])),onClick:d[9]||(d[9]=_(()=>{},["stop"])),onDblclick:d[10]||(d[10]=_(()=>{},["stop"])),onKeydown:[d[11]||(d[11]=_(()=>{},["stop"])),d[12]||(d[12]=Y(_(y=>u(o).onRenameCommit?.(),["prevent"]),["enter"])),d[13]||(d[13]=Y(_(y=>u(o).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:d[14]||(d[14]=y=>u(o).onRenameCommit?.())},null,544)),[[Dt,u(o).draft]]):(g(),k("span",sa,C(e.row.name),1))],8,ta),!i(e.row)&&!r(e.row)?(g(),k("span",aa,[h(e.row)?(g(),k("button",{key:0,type:"button","data-sve-ht-eye":"",disabled:!u(o).canEdit,title:u(o).canEdit?e.row.hidden?u(o).showTitle:u(o).hideTitle:u(o).lockedTitle,innerHTML:e.row.hidden?fa:pa,onClick:d[15]||(d[15]=_(y=>u(o).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:d[16]||(d[16]=_(()=>{},["stop"])),onDblclick:d[17]||(d[17]=_(()=>{},["stop"]))},null,40,ra)):$("",!0),u(t)&&e.row.fieldsIcon?(g(),k("button",{key:1,type:"button","data-sve-ht-fields":"",disabled:!u(o).canEdit,title:u(o).canEdit?u(s):u(o).lockedTitle,innerHTML:ua,onClick:_(n,["stop","prevent"]),onPointerdown:d[18]||(d[18]=_(()=>{},["stop"])),onDblclick:d[19]||(d[19]=_(()=>{},["stop"]))},null,40,ia)):$("",!0),S("button",{type:"button","data-sve-ht-dup":"",disabled:!u(o).canEdit,title:u(o).canEdit?u(o).duplicateTitle:u(o).lockedTitle,innerHTML:ma,onClick:d[20]||(d[20]=_(y=>u(o).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:d[21]||(d[21]=_(()=>{},["stop"])),onDblclick:d[22]||(d[22]=_(()=>{},["stop"]))},null,40,la),S("button",{type:"button","data-sve-ht-del":"",disabled:!u(o).canEdit,title:u(o).canEdit?u(o).deleteTitle:u(o).lockedTitle,innerHTML:va,onClick:d[23]||(d[23]=_(y=>u(o).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:d[24]||(d[24]=_(()=>{},["stop"])),onDblclick:d[25]||(d[25]=_(()=>{},["stop"]))},null,40,ca)])):$("",!0)],16,Ws),e.row.emptyBlock&&!e.row.shut?(g(),k("div",fe({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},u(o).dropId===e.row.id&&u(o).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),C(u(o).slotText),17,da)):$("",!0)],64))}},Ve=Te(ga,[["__scopeId","data-v-1d5af908"]]),ka=["data-sve-ht-look"],ya={key:0,class:"sve-ht-empty"},ba={key:1,class:"sve-ht-empty"},_a={key:0,class:"sve-ht-empty"},xa={__name:"HtmlTreeList",setup(e){const t=pe(()=>tn(o.query)),s=pe(()=>Ys(o.rows,t.value)),n=pe(()=>s.value.rows),a=pe(()=>t.value?o.sections.filter(v=>nn(v.row,t.value)||v.current&&v.ready&&n.value.length>0):o.sections),i=pe(()=>!!t.value&&!a.value.length&&!n.value.length);function r(v){return!!t.value&&!s.value.hits.has(v.path)}function c(v){const m={"data-sve-ht-sec-uid":v.uid};return v.current&&(m["data-sve-ht-branch"]=""),o.sectionDrop&&o.sectionDrop.uid===v.uid&&(m["data-sve-ht-drop"]=o.sectionDrop.place),m}return(v,m)=>(g(),k("div",fe({class:"sve-ht-root","data-sve-ht-look":u(o).look,style:u(o).familyStyle},u(o).dragging?{"data-sve-ht-dragging":""}:{}),[!u(o).rows.length&&!u(o).sections.length?(g(),k("div",ya,C(u(o).emptyText),1)):i.value?(g(),k("div",ba,C(u(o).searchEmpty),1)):$("",!0),u(o).sections.length?(g(!0),k(H,{key:2},K(a.value,h=>(g(),k("div",fe({key:h.uid},{ref_for:!0},c(h)),[h.ready?(g(),k(H,{key:0},[(g(!0),k(H,null,K(n.value,l=>(g(),Le(Ve,{key:l.id,row:l,dim:r(l)},null,8,["row","dim"]))),128)),u(o).rows.length?$("",!0):(g(),k("div",_a,C(u(o).emptyText),1))],64)):(g(),Le(Ve,{key:1,row:h.row,dim:u(o).inComponent},null,8,["row","dim"]))],16))),128)):u(o).rows.length?(g(!0),k(H,{key:3},K(n.value,h=>(g(),Le(Ve,{key:h.id,row:h,dim:r(h)},null,8,["row","dim"]))),128)):$("",!0)],16,ka))}},St=Te(xa,[["__scopeId","data-v-2e2ef58b"]]);let Ne=null;function Ta(e){return Ne||(Ne=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{pages:[]}).then(t=>Array.isArray(t.pages)?t.pages:[]).catch(()=>[])),Ne}let Ee=null;function ze(){Ee?.dismiss(),Ee=null}function Sa(e,t,s){ze();const n=t?.getBoundingClientRect?.(),a={x:n?n.left:0,y:n?n.bottom+4:0};Ta(e).then(i=>{const r=i.length?i.map(c=>({label:c.title||c.url,onPick:()=>{ze(),s(c.url)}})):[{label:p(e,"component_props_pages_none"),onPick:null}];ze(),Ee=oe(e.document,ct,{items:r,x:a.x,y:a.y,onClose:()=>{Ee=null}})})}const on="sve-html-tree-labels";function sn(){try{const e=globalThis.localStorage?.getItem(on);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function Ca(e){try{globalThis.localStorage?.setItem(on,JSON.stringify(e))}catch{}}function an(e){return String(e||"_")}function rn(e){const t=sn()[an(e)];return t&&typeof t=="object"?{...t}:{}}function Pa(e,t,s){const n=s?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function La(e,t,s,n){if(!t)return;const a=an(e),i=sn(),r={...i[a]||{}},c=String(s||"").replace(/\s+/g," ").trim(),v=String(n||"").trim();!c||c===v?delete r[t]:r[t]=c,Object.keys(r).length?i[a]=r:delete i[a],Ca(i)}const $a=/^@(media|supports|container|layer|scope)\b/i;function wa(e){const t=String(e||""),s=[];let n=0,a=0;for(;n<t.length;){if(t[n]==="{"&&t[n+1]==="{"){const c=t.indexOf("}}",n+2);n=c===-1?t.length:c+2;continue}if(t[n]==="/"&&t[n+1]==="*"){const c=t.indexOf("*/",n+2);n=c===-1?t.length:c+2;continue}if(t[n]==='"'||t[n]==="'"){const c=t[n];for(n+=1;n<t.length&&t[n]!==c;)n+=t[n]==="\\"?2:1;n+=1;continue}if(t[n]!=="{"){n+=1;continue}let i=1,r=n+1;for(;r<t.length&&i>0;){if(t[r]==="{"&&t[r+1]==="{"){const c=t.indexOf("}}",r+2);r=c===-1?t.length:c+2;continue}if(t[r]==="/"&&t[r+1]==="*"){const c=t.indexOf("*/",r+2);r=c===-1?t.length:c+2;continue}if(t[r]==='"'||t[r]==="'"){const c=t[r];for(r+=1;r<t.length&&t[r]!==c;)r+=t[r]==="\\"?2:1;r+=1;continue}t[r]==="{"?i+=1:t[r]==="}"&&(i-=1),r+=1}s.push({selector:t.slice(a,n).trim(),body:t.slice(n+1,r-1),from:a,to:r,text:t.slice(a,r).trim()}),n=r,a=r}return s}function Ct(e){const t=String(e||""),s=new Set,n=new Set,a=new Set;for(const i of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const r of i[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))r&&(s.add(r),s.add(r.replace(/([:./%!#()[\],])/g,"\\$1")));for(const i of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))i[2].trim()&&n.add(i[2].trim());for(const i of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))a.add(i[1].toLowerCase());return{classes:s,ids:n,tags:a}}function Pt(e,t){const s=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),n=[...s.matchAll(/\.((?:\\.|[\w-])+)/g)].map(r=>r[1]),a=[...s.matchAll(/#((?:\\.|[\w-])+)/g)].map(r=>r[1]);if(n.length||a.length){const r=c=>c.replace(/\\(.)/g,"$1");return n.every(c=>t.classes.has(c)||t.classes.has(r(c)))&&a.every(c=>t.ids.has(r(c)))}const i=[...s.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(r=>r[2].toLowerCase());return i.length>0&&i.every(r=>t.tags.has(r))}function Ea(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function Ha(e,t,s){const n=Ea(e);if(!n.length)return"keep";const a=n.filter(r=>Pt(r,t));return a.length?a.length===n.length&&!n.some(r=>Pt(r,s))?"move":"copy":"keep"}function ln(e,t,s){const n=String(e||""),a=Ct(t),i=Ct(s),r=[],c=[];let v=0;for(const m of wa(n)){const h=n.slice(m.from,m.to),l=h.match(/^\s*/)[0];if(v=m.to,$a.test(m.selector)){const y=ln(m.body,t,s);y.move.trim()&&r.push(`${m.selector} {
${y.move.trim()}
}`),y.keep.trim()&&c.push(`${l}${m.selector} {
${y.keep.trim()}
}`);continue}const d=m.selector.startsWith("@")?"keep":Ha(m.selector,a,i);if(d==="move"){r.push(m.text);continue}d==="copy"&&r.push(m.text),c.push(h)}return c.push(n.slice(v)),{move:r.join(`

`).trim(),keep:c.join("").replace(/\n{3,}/g,`

`).trim()}}const Ia="/!/sve/component";function Aa(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let s=null;for(const n of t){if(!n.trim())continue;const a=n.match(/^[ \t]*/)[0].length;s=s===null?a:Math.min(s,a)}return s?t.map(n=>n.slice(s)).join(`
`):t.join(`
`)}function Ma(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function Ra(e,t){if(!io(e))return"";try{return await(await jn(()=>import("./tw-compile-D8Xdoe3O.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(s){return console.error("[sve] component tailwind compile",s),""}}async function Da(e,t){const s=await e.fetch(Ia,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":Ot(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!s.ok){const n=new Error(String(s.status));throw n.status=s.status,n}return s.json()}function Lt(e,t){const{from:s,to:n}=ro(e,t),a=e.slice(s,n);if(!a.trim())return null;const i=e.slice(0,s)+e.slice(n),r=b("dock:css"),c=ln(typeof r=="string"?r:"",a,i);return{html:Aa(a),css:c.move,keepCss:c.keep,lead:Ma(a),from:s,to:n}}function Oa(e,t,{onDone:s,onError:n}={}){if(b("dock:is-locked")===!0)return;const a=b("dock:html");if(typeof a!="string"||!t)return;const i=Lt(a,t);if(!i)return;const r=oe(e.document,Fn,{heading:p(e,"component_new"),nameLabel:p(e,"component_name"),placeholder:p(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:p(e,"cancel"),saveLabel:p(e,"component_create"),onOk:c=>{r.dismiss(),(async()=>{try{const v=await Ra(e,i.html),m=b("dock:html"),h=typeof m=="string"&&m===a?i:Lt(m,t);if(!h)return;const l=await Da(e,{name:c,html:h.html,css:h.css,js:"",tw:v}),d=b("dock:html"),y=d.slice(0,h.from)+h.lead+l.tag+d.slice(h.to);b("dock:set-html",y),h.css.trim()&&b("dock:set-css",h.keepCss),s?.(l)}catch(v){n?.(v)}})()}})}function Ba(e,t,s){const n=String(e||"");if(!t||t.kind!=="antlers")return n;const a=String(s||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?Ka(n,t,a):t.tag==="else"||!a?n:n.slice(0,t.from)+`{{ ${t.tag} ${a} }}`+n.slice(t.openTo)}function Je(e,t,s,n){return me(e,t,{kind:s,name:n})}function me(e,t,s={}){const n=String(e||"");if(!t||t.antlers!=="loop")return n;const a=t.loopKind==="collection"?"collection":"field",i=s.kind??a,r=String(s.name??t.expr??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(r))return n;const c=s.sortDir??t.sortDir??"",v=String(s.sortField??t.sortField??"").trim(),m=String(s.limit??t.limit??"").trim(),h=cn(n,t);if(!h)return n;const l=i===a?t.params:"",d=i==="collection"?Fa(r,v,c,m,l):ja(r,v,c,m,l),y=i==="collection"?"collection":r;return n.slice(0,t.from)+d+n.slice(t.openTo,h.from)+`{{ /${y} }}`+n.slice(h.to)}function Fa(e,t,s,n,a){const i=qa(a).replace(/\bsort\s*=\s*["'][^"']*["']/g,"").replace(/\blimit\s*=\s*["']?\d+["']?/g,"").replace(/\s+/g," ").trim(),r=[`collection from="${e}"`];return s==="random"?r.push('sort="random"'):t&&r.push(`sort="${t}${s==="desc"?":desc":":asc"}"`),n&&r.push(`limit="${n}"`),i&&r.push(i),`{{ ${r.join(" ")} }}`}function ja(e,t,s,n,a){const i=String(a||"").split("|").map(c=>c.trim()).filter(c=>c&&!/^from\s*=/.test(c)&&!/^sort\s*:/.test(c)&&!/^reverse$/.test(c)&&!/^shuffle$/.test(c)&&!/^limit\s*:/.test(c)),r=[e,...i];return s==="random"?r.push("shuffle"):t&&(r.push(`sort:${t}`),s==="desc"&&r.push("reverse")),n&&r.push(`limit:${n}`),`{{ ${r.join(" | ")} }}`}function qa(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function cn(e,t){const n=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return n?{from:t.from+n.index,to:t.from+n.index+n[0].length}:null}function Ka(e,t,s){return me(e,t,{name:s})}function Va(e,t,s){const n=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return n;const a=cn(n,t);if(!a)return n;const r=(n.slice(0,a.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],c=s==="else"?"{{ else }}":"{{ elseif true }}";return`${n.slice(0,a.from)}${c}
${r}${n.slice(a.from)}`}const R=ho("sve-call-values"),ye=new Set;let $t=null;const Na="__sve-html-tree-style",D=new Set;let Qe="",ie=!1,Ue=null,Se=!0,V="",be=0,dn="";const W=new Map,le=new Set;let B="",un=!1,I=null,He=null,Ie=0,et=null,_e=[],J=null,ve=null,Ae=null,Me=null,tt=null,te=!1,Q=null,xe=null,ge=null,Re=null,De=null,nt=null,Z=null;function j(e){return e.getElementById($e)}function za(e){Kn(e,Na,`
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
      ${yt("light")}
      --sve-ht-pick: rgba(56,88,233,.14);
      --sve-ht-pick-hover: rgba(56,88,233,.22);
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${yt("dark")}
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
  `)}function O(){const e=b("dock:html");return typeof e=="string"?e:""}function hn(e){return!!b("dock:is-open",e)}function de(e,{save:t=!1}={}){return pt()||b("dock:set-html",e)!==!0?!1:(t&&b("dock:save-now"),!0)}function wt(e){const t=b("dock:component-exit-state")||{};if(o.exitOpen=!!t.open,!t.open){o.onExit=null;return}o.exitName=t.name||"",o.exitLabel=p(e,"component_exit"),o.exitTitle=p(e,t.back?"component_exit_back":"component_exit_close"),o.onExit=()=>{b("dock:exit-component"),L(e)}}function Ua(e,t){const s=Gn(e);if(!s||t.type!==s)return"";const n=Zn(t[s]);return n&&Jn(e,n)?.section_type||""}const ne=[];let Xe=!1,ot=!1;function Ye(e,t){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(t,{timeout:2e3});return}e.setTimeout(t,200)}function Xa(e,t){for(const s of t){const n=s.type;!n||W.has(n)||le.has(n)||ne.includes(n)||ne.push(n)}rt.htmlTreePrefetchArmed&&ht(e)}function Dr(e){rt.htmlTreePrefetchArmed=!0,ht(e)}function ht(e){if(Xe||!ne.length)return;Xe=!0;const t=()=>{const s=ne.shift();if(!s){Xe=!1;return}if(W.has(s)||le.has(s)){Ye(e,t);return}le.add(s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(s)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{typeof n?.html=="string"&&(W.set(s,n.html),ot&&(ot=!1,L(e)))}).catch(()=>{}).finally(()=>{le.delete(s),Ye(e,t)})};Ye(e,t)}function pt(){return!!B}function Ya(e){const t=new Map,s=Bt(e);if(!s)return t;for(const n of s.querySelectorAll("[data-sid]")){const a=n.getAttribute("data-sid");a&&!t.has(a)&&t.set(a,n.tagName.toLowerCase())}return t}function Wa(e,t){const s=Fe(e)||"page_sections";for(const n of it(t)||[]){const a=lt(n.values),i=a&&typeof a=="object"?a[s]:null;if(Array.isArray(i))return!0}return!1}function pn(e,t){const s=Fe(e)||"page_sections",n=Ya(e),a=[];for(const i of it(t)||[]){const r=lt(i.values),c=r&&typeof r=="object"?r[s]:null;if(Array.isArray(c)){c.forEach(v=>{if(!v||typeof v!="object"||Array.isArray(v)||typeof v.type!="string")return;const m=[v._visual_id,v.id,v._id].filter(P=>typeof P=="string"&&P!=="");if(!m.length)return;const h=Ua(e,v)||v.type,l=typeof v._sve_label=="string"?v._sve_label.trim():"",d=m.map(P=>n.get(P)).find(Boolean)||"section",y=rn(v.type)[`0:${d}`];a.push({uid:m[0],ids:m,type:v.type,tag:d,label:(typeof y=="string"&&y.trim()?y.trim():"")||l||Vt(e,h)?.display||Ge(h)||h,svg:Xt(d,"",null).svg||po.section,cat:qt(d),enabled:v.enabled!==!1,static:Ko(e,h)})});break}}return a}function Ga(e,t,s){if(!s.length)return"";const n=b("dock:current-type")||"",a=b("dock:current-uid"),i=!!b("dock:component-exit-state")?.open;if(a){const r=Yn(a,t),c=s.find(v=>v.ids.some(m=>r.includes(m)));if(c&&(i||c.type===n))return c.uid}return s.find(r=>r.type===n)?.uid||""}function Za(e,t,s,n){const a=t.find(P=>P.uid===s),i=b("dock:component-src"),r=b("dock:type-stack")||[];if(!a||!i||!r.length)return null;const c=r.map(P=>P.type).filter(P=>!W.get(P));if(c.length)return Ja(e,c),null;const v=[],m=new Set,h=new Set;let l=P=>v.push(...P),d=null,y=0;for(let P=0;P<r.length;P+=1){const ue=P+1<r.length?r[P+1].src:i,re=A=>({...A,id:`ctx${P}:${A.id}`,path:`ctx${P}/${A.path}`,ctxLevel:P,children:A.children.map(re)}),q=je(W.get(r[P].type)).map(re),w=[],Ce=(A,M)=>{for(const E of A){if(E.kind==="component"&&E.src===ue)return w.push(...M,E),E;const f=Ce(E.children,[...M,E]);if(f)return f}return null};if(d=ue?Ce(q,[]):null,!d)return null;const N=new Set(w.map(A=>A.id)),he=(A,M)=>{for(const E of A)E.children.length&&(N.has(E.id)?D.has(E.path):vn(E,M))&&m.add(E.id),he(E.children,M+1)};he(q,y),l(q),h.add(d.id),y+=w.length,l=(A=>M=>{A.children=M})(d)}for(const P of gn(n))m.add(P);return D.has(d.path)&&m.add(d.id),d.children=n,{tree:v,folds:m,hostId:d.id,hostIds:h,levels:r.length,rootId:v.find(P=>!P.kind)?.id||"",label:a.label,svg:a.svg,cat:a.cat}}function Ja(e,t){for(const s of t)!ne.includes(s)&&!le.has(s)&&ne.push(s);ot=!0,ht(e)}function Qa(e,t,s){const n=b("dock:component-exit-state");if(n?.open)return Ge(n.name)||n.name||"";if(s)return t.find(i=>i.uid===s)?.label||"";const a=b("dock:current-type")||"";return Vt(e,a)?.display||Ge(a)||""}function fn(e,t,s,n,a){const i=s.find(c=>c.uid===n);if(!i||n===a)return;D.clear(),I=null,Se=!1,G(),qe(),V=n,dn=O(),B=W.get(i.type)||"",B&&(I=Oe(je(B))||null),un=(b("dock:current-type")||"")===i.type,e.clearTimeout(be),be=e.setTimeout(()=>{V="",ie=!1,L(e)},4e3),L(e);const r=()=>to(i.uid,t,e,{clampToSection:!0});Wn(i.uid,t,e,r),ce({source:ae,type:se.SVE_ACTIVATE,ids:i.ids},e),e.setTimeout(()=>L(e),0)}function mn(e,t){if(!t)return!1;for(const s of e||[])if(s.id===t||mn(s.children,t))return!0;return!1}function Oe(e){for(const t of e||[]){if(!t.kind)return t.id;const s=Oe(t.children);if(s)return s}return""}function vn(e,t){return D.has(e.path)?t===0:t>0}function gn(e){const t=new Set,s=(n,a)=>{for(const i of n)i.children.length&&vn(i,a)&&t.add(i.id),s(i.children,a+1)};return s(e,0),t}function L(e){const t=e.document,n=j(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;za(t),co(e);const a=O();B&&B===a&&(B="");const i=B||a,r=je(i);_e=r;const c=b("dock:current-type")||"",v=rn(c),m=Wa(e,t),l=!!(b("dock:component-exit-state")||{}).open,d=pn(e,t);c&&a&&!B&&W.set(c,a),Xa(e,d);const y=Ga(e,t,d);if(m&&!d.length){_e=[],o.rows=[],o.sections=[],o.pageBuilder=!0,o.emptyText=p(e,"html_tree_empty"),o.canEdit=!b("dock:is-locked"),o.look=bt(e),o.onRefresh=()=>L(e),o.onSection=null,wt(e),we(n,St),Et(e,[]);return}o.pageBuilder=m;const P=`${c}|${y}`;let ue=!1;P!==Qe&&(Qe=P,D.clear(),Ue!==null&&i!==Ue?ue=!0:ie=i),(ue||ie!==!1&&i!==ie)&&(ie=!1,D.clear(),I=Oe(r)||null),Ue=i,V&&(V===y||!d.length)&&(un||i!==dn)&&(e.clearTimeout(be),V="",ie=!1,mn(r,I)||(D.clear(),I=Oe(r)||null));const re=d.some(f=>f.uid===V)?V:"",q=Se?"":re||y,w=l?Za(e,d,q,r):null,Ce=!!(re||y),N=w?_t(w.tree,o.query?new Set:w.folds):_t(r,o.query?new Set:gn(r));!i.trim()&&!hn(t)?o.emptyText=p(e,"html_tree_need_dock"):o.emptyText=p(e,"html_tree_empty"),o.slotText=p(e,"antlers_drop_here"),o.dataTitle=p(e,"data_vars_title"),o.pageTitle=p(e,"component_props_page"),o.renameTitle=p(e,"html_tree_rename"),o.tagTitle=p(e,"tw_tag"),o.hideTitle=p(e,"html_tree_hide"),o.showTitle=p(e,"html_tree_show"),o.duplicateTitle=p(e,"html_tree_duplicate"),o.deleteTitle=p(e,"html_tree_delete"),o.lockedTitle=p(e,"html_tree_locked"),o.searchEmpty=p(e,"html_tree_search_empty"),o.canEdit=!b("dock:is-locked"),o.look=bt(e),Xn(e),o.onQuery=()=>L(e),wt(e),o.inComponent=l,o.onContextRow=f=>{if(!w||f===w.hostId)return;const x=N.find(T=>T.id===f)?.ctxLevel??w.levels-1;b("dock:exit-component",w.levels-x),L(e)},o.onSelect=f=>{const x=N.find(T=>T.id===f);x&&Ut(e,x.path)||mt(e,f,N)},o.onTwist=f=>{const x=N.find(T=>T.id===f)?.path;x&&(D.has(x)?D.delete(x):D.add(x),L(e))},o.onTagChange=(f,x)=>{const T=o.rows.find(U=>U.id===x);T&&!pt()&&uo(e,f.currentTarget,T)},o.onRename=f=>tr(e,f),o.onRenameCommit=()=>Ht(e,!0),o.onRenameCancel=()=>Ht(e,!1),o.onHide=f=>nr(e,f),o.onDuplicate=f=>or(e,f),o.onDelete=f=>ar(e,f),o.onPointerDown=(f,x)=>ur(e,f,x),o.onSectionPointerDown=(f,x)=>fr(e,f,x),o.onContext=(f,x)=>cr(e,f,x),o.onInspectCommit=f=>_r(e,f),o.onPropValue=(f,x,T)=>Mt(e,f,x,T),o.onPropPage=(f,x)=>Sa(e,f,T=>Mt(e,x,T,!1)),o.onLoopKind=f=>xr(e,f),o.onAddBranch=f=>Tr(e,f),o.onLoopSortField=f=>{const x=Be(),T=String(f||"").trim();if(!x)return;const U=Z?.id===x.id?Z.dir:"",X=x.sortDir||U||"asc";Z=null,ee(e,(Sn,Cn)=>me(Sn,Cn,{sortField:T,sortDir:X}))},o.onLoopSortDir=f=>{const x=Be(),T=String(f||"");if(x){if((T==="asc"||T==="desc")&&!x.sortField){Z={id:x.id,dir:T},st(e,x);return}Z=null,ee(e,(U,X)=>me(U,X,{sortDir:T,sortField:T==="asc"||T==="desc"?X.sortField:""}))}},o.onLoopLimit=f=>ee(e,(x,T)=>me(x,T,{limit:String(f||"").replace(/\D/g,"")})),o.onPropHost=f=>f?R.mount(f):R.unmount(),o.onInspectData=(f,x)=>{b("dock:data-menu",{anchor:f,at:N.find(T=>T.id===I)?.from,onPick:T=>x(String(T?.var||"").trim())})};const he=N.find(f=>!f.kind)?.id,A=l?"":Qa(e,d,q),M=q&&!l?d.find(f=>f.uid===q):null;o.rows=N.map(f=>{const x=Xt(f.tag,f.kind,f.antlers),T=!!w&&f.id===w.rootId,U=f.id===he&&A?A:T?w.label:f.klass,X=f.id===he;return{...f,base:U,name:Pa(U,f.path,v),current:f.id===I,letter:T?"":x.letter||"",svg:X&&M?M.svg:T?w.svg:x.svg||"",cat:T?w.cat:qt(f.tag,f.kind,f.antlers),context:w?w.hostIds.has(f.id)?"host":f.id.startsWith("ctx")?"dim":"":"",sectionRoot:X&&M?M.uid:"",fieldsIcon:!!(X&&M&&!M.static)}});const E=[];for(const f of o.rows)E.length=f.depth,f.guides=E.slice(),E[f.depth]=f.cat;o.sections=Ce?d.map(f=>{const x=!!q&&f.uid===q;return{...f,current:x,ready:x&&(!re||!!B),row:{id:`sec:${f.uid}`,section:f.uid,tag:f.tag,name:f.label,kind:"",svg:f.svg,cat:f.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:x,hidden:!f.enabled}}}):[],o.onSection=f=>{te||fn(e,t,d,f,q)},o.onRefresh=()=>L(e),st(e,o.rows.find(f=>f.id===I)),we(n,St),Et(e,r)}function Et(e,t){j(e.document)&&kn(e,t)}function kn(e,t){const s=t[0],n=!!b("dock:component-src"),a=n?"":b("dock:current-uid")||"";ce({source:ae,type:se.SVE_HTML_PICK,on:!0,uid:a,all:n,tag:s?.tag||"",klass:s?.klass||"",nodes:Lo(t)},e)}function er(e){if(!e)return;const t=(s,n)=>{for(const a of s||[]){if(a.path===e)return!0;if(t(a.children,n+1))return n===0?D.delete(a.path):D.add(a.path),!0}return!1};t(_e,0)}function tr(e,t){if(te)return;const s=o.rows.find(n=>n.id===t);!s||s.kind||(I=t,o.rows.forEach(n=>{n.current=n.id===t}),o.editingId=t,o.draft=s.name,e.setTimeout(()=>{const n=j(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function Ht(e,t){const s=o.editingId;if(!s)return;const n=o.rows.find(a=>a.id===s);o.editingId=null,t&&n&&La(b("dock:current-type")||"",n.path,o.draft,n.base||n.klass),o.draft="",L(e)}function nr(e,t){ft(e,t,So)}function or(e,t){ft(e,t,Co)}function yn(e,t){Qn(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const s=e.document;no({uid:t},s,e)})}function sr(e,t,s){V===s&&(e.clearTimeout(be),V="",B=""),I=null,Se=!1,Qe="";const n=pn(e,t),a=n.find(i=>i.uid!==s)||n[0];a?fn(e,t,n,a.uid,""):(B="",o.rows=[],o.sections=[],o.pageBuilder=!0,L(e)),e.setTimeout(()=>{j(e.document)&&L(e)},0)}Kt("row:removed",({uid:e,parentPath:t,doc:s,win:n})=>{t!==Fe(n)||!j(n.document)||sr(n,s,e)});function ar(e,t){const s=o.sections?.find(a=>a.row?.id===t),n=s?s.row?.section||s.uid:o.rows.find(a=>a.id===t)?.sectionRoot;if(n){yn(e,n);return}ft(e,t,Po)}function ft(e,t,s){if(b("dock:is-locked"))return;const n=O(),a=o.rows.find(r=>r.id===t);if(!a)return;const i=s(n,a);i!==n&&de(i)}function G(){Q?.dismiss(),Q=null}const rr='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',ir='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>';function bn(e,t){const s=o.sections?.find(v=>v.uid===t),n=s?.type||"";if(!n||!Jt(e))return[];const a=s.label||n,i=Vo(e,n),r=()=>e.Statamic?.$toast?.error(p(e,"section_update_failed")),c=[{label:p(e,"static_section_insertable"),icon:i?ir:rr,onPick:()=>{G(),xt(e,{handle:n,hidden:!i}).then(()=>{e.Statamic?.$toast?.success(p(e,i?"section_shown_to_editors":"section_hidden_from_editors",{name:a})),Ze(e)}).catch(r)}}];return s.static&&c.push({label:p(e,"section_add_fields"),onPick:()=>{G(),xt(e,{handle:n,fields:!0}).then(()=>{e.Statamic?.$toast?.success(p(e,"section_fields_added",{name:a})),Ze(e),L(e),zt(e,n)}).catch(r)}}),c}function lr(e,t,s){const n=s.row?.section||s.uid;n&&(Q=oe(e.document,ct,{items:[...bn(e,n),{label:p(e,"html_tree_remove_section"),danger:!0,onPick:()=>{G(),yn(e,n)}}],x:t.clientX,y:t.clientY,onClose:()=>{Q=null}}))}function cr(e,t,s){G();const n=o.sections?.find(c=>c.row?.id===s);if(n){lr(e,t,n);return}const a=o.rows.find(c=>c.id===s);if(!a)return;mt(e,s,o.rows);const i={x:t.clientX,y:t.clientY},r=c=>{c.length&&(Q?.dismiss(),Q=oe(e.document,ct,{items:c,x:i.x,y:i.y,onClose:()=>{Q=null}}))};if(a.kind==="component"){dr(e,a,r);return}o.canEdit&&r([...a.sectionRoot?bn(e,a.sectionRoot):[],{label:p(e,"component_make"),onPick:()=>{G(),Oa(e,a,{onDone:()=>L(e),onError:c=>{e.alert(c?.status===409?p(e,"component_exists"):p(e,"component_failed"))}})}}])}const It=(e,t)=>{G(),b("dock:open-template",t)};function dr(e,t,s){if(!mo(t.src)){s([{label:p(e,"component_open_named",{name:t.name||t.src}),onPick:()=>It(e,`view:partials/${t.src}`)}]);return}s([{label:p(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const a=Array.isArray(n.items)?n.items:[];s(a.length?a.map(i=>({label:p(e,"component_open_named",{name:i.label}),onPick:()=>It(e,i.type)})):[{label:p(e,"component_none"),onPick:null}])}).catch(()=>s([{label:p(e,"component_none"),onPick:null}]))}function ur(e,t,s){if(t.button!==0||b("dock:is-locked")||o.editingId||t.target?.closest?.("button, input"))return;qe(),J=s,ve={x:t.clientX,y:t.clientY},Ae=t.currentTarget,Me=t.pointerId;const n=i=>hr(e,i),a=i=>pr(e,i);tt=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),tt=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function hr(e,t){if(!J||!ve)return;const s=t.clientX-ve.x,n=t.clientY-ve.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{Ae?.setPointerCapture?.(Me)}catch{}}t.preventDefault();const a=e.document.elementFromPoint(t.clientX,t.clientY),i=a?.closest?.("[data-sve-ht-slot]");if(i){const l=i.getAttribute("data-sve-ht-id");if(l&&l!==J){o.dropId=l,o.dropPlace="inside";return}}const r=a?.closest?.("[data-sve-ht-row]"),c=r?.getAttribute("data-sve-ht-id");if(!c||c===J){o.dropId=null,o.dropPlace=null;return}const v=o.rows.find(l=>l.id===c),m=o.rows.find(l=>l.id===J);if(!v||v.context||m&&v.path.startsWith(`${m.path}/`)){o.dropId=null,o.dropPlace=null;return}const h=r.getBoundingClientRect();o.dropId=c,o.dropPlace=xo(t.clientY-h.top,h.height,!Yt(v.tag)&&v.kind!=="component")}function pr(e,t){const s=J,n=o.dropId,a=o.dropPlace||"after",i=o.dragging;if(qe(),i&&(te=!0,e.setTimeout(()=>{te=!1},0)),!i||b("dock:is-locked")||!s||!n||s===n)return;t?.preventDefault?.();const r=O(),c=To(r,_e,s,n,a);c!==r&&de(c)}function qe(){try{Ae?.releasePointerCapture?.(Me)}catch{}tt?.(),J=null,ve=null,Ae=null,Me=null,o.dragging=!1,o.dropId=null,o.dropPlace=null}function fr(e,t,s){if(t.button!==0||!s||o.editingId||t.target?.closest?.("button, input"))return;_n(),xe=s,ge={x:t.clientX,y:t.clientY},Re=t.currentTarget,De=t.pointerId;const n=i=>mr(e,i),a=i=>vr(e,i);nt=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),nt=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function mr(e,t){if(!xe||!ge)return;const s=t.clientX-ge.x,n=t.clientY-ge.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{Re?.setPointerCapture?.(De)}catch{}}t.preventDefault();const i=e.document.elementFromPoint(t.clientX,t.clientY)?.closest?.("[data-sve-ht-sec-uid]"),r=i?.getAttribute("data-sve-ht-sec-uid")||"";if(!r||r===xe){o.sectionDrop=null;return}const c=i.getBoundingClientRect();o.sectionDrop={uid:r,place:t.clientY-c.top<c.height/2?"before":"after"}}function vr(e,t){const s=xe,n=o.sectionDrop,a=o.dragging;_n(),a&&(te=!0,e.setTimeout(()=>{te=!1},0)),!(!a||!s||!n?.uid||n.uid===s)&&(t?.preventDefault?.(),gr(e,s,n.uid,n.place))}function _n(){try{Re?.releasePointerCapture?.(De)}catch{}nt?.(),xe=null,ge=null,Re=null,De=null,o.dragging=!1,o.sectionDrop=null}function gr(e,t,s,n){const a=Fe(e)||"page_sections";for(const i of it(e.document)||[]){const r=lt(i.values),c=r&&typeof r=="object"?r[a]:null;if(!Array.isArray(c))continue;const v=d=>c.findIndex(y=>y&&typeof y=="object"&&[y._visual_id,y.id,y._id].includes(d)),m=v(t),h=v(s);if(m===-1||h===-1||m===h)return!1;let l=n==="before"?h:h+1;return m<l&&(l-=1),l===m?!1:(e.postMessage({source:ae,type:se.MOVE,uid:t,toIndex:l},e.location.origin),e.setTimeout(()=>L(e),60),!0)}return!1}function xn(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function st(e,t){if(t?.kind==="component"){kr(e,t);return}if(F.callOpen&&(F.callOpen=!1,F.callStore=null,R.forget(),dt(e)),t?.kind!=="antlers"){o.inspect=null;return}const s=t.id;if(t.tag==="else"){o.inspect={key:s,title:p(e,"antlers_condition"),mode:"note",note:p(e,"antlers_else_note")};return}if(t.antlers==="loop"){const n=t.loopKind==="collection",a=Z?.id===t.id?Z.dir:"",i=t.sortDir||a;o.inspect={key:s,title:p(e,"antlers_loop"),mode:"loop",loopKind:n?"collection":"field",kinds:[{id:"field",label:p(e,"antlers_loop_field")},{id:"collection",label:p(e,"antlers_loop_collection")}],collections:xn(e),value:t.expr||"",placeholder:p(e,n?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:p(e,"antlers_sort"),dir:i,needsField:i==="asc"||i==="desc",field:t.sortField||"",pickable:!n,placeholder:p(e,n?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:p(e,"antlers_sort_none")},{id:"asc",label:p(e,"antlers_sort_asc")},{id:"desc",label:p(e,"antlers_sort_desc")},{id:"random",label:p(e,"antlers_sort_random")}]},limit:{title:p(e,"antlers_limit"),value:t.limit||"",placeholder:p(e,"antlers_limit_placeholder")},branches:[]};return}o.inspect={key:s,title:p(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:p(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:p(e,"antlers_add_elseif")},{id:"else",label:p(e,"antlers_add_else")}]}}function kr(e,t){if(!vo(e)){o.inspect=null;return}if(!t.src)return;const s=t.id;if(o.inspect={key:s,title:p(e,"component_props_values"),mode:"note",note:p(e,"code_dock_loading")},go()){const n={},a={},i=new Map;for(const[r,c]of ko(O().slice(t.from,t.to))){const v=yo(r);v&&(r!==v||!i.has(v))&&i.set(v,c)}for(const[r,c]of i)c.bound?a[r]=c.value:n[r]=c.value;$t!==s&&($t=s,ye.clear());for(const r of ye)r in a||(a[r]="");o.inspect=null,F.callOpen=!0,F.title=F.title||p(e,"component_props"),F.callTitle=t.klass||t.name||t.src,F.callStore=R.ui,R.ui.canBind=!0,R.ui.dataTitle=p(e,"data_vars_title"),R.ui.exprPlaceholder=p(e,"component_props_expr"),R.ui.onToggleBind=(r,c)=>br(e,r,c),R.ui.onExpr=(r,c)=>At(e,r,c),R.ui.onPickData=(r,c)=>b("dock:data-menu",{anchor:c,at:t.from,onPick:v=>At(e,r,String(v?.var||"").trim())}),R.load(e,{key:`${t.src}::${s}`,src:t.src,params:n,bindings:a,readOnly:b("dock:is-locked")===!0}),R.watch(e,{src:t.src,write:r=>yr(e,r,a)}),dt(e);return}bo(e,t.src).then(n=>{if(o.inspect?.key===s){if(!n.length){o.inspect={key:s,title:p(e,"component_props_values"),mode:"note",note:p(e,"component_props_values_none")};return}o.inspect={key:s,title:p(e,"component_props_values"),mode:"props",inheritLabel:p(e,"component_props_inherit"),rows:_o(n,O().slice(t.from,t.to))}}})}function yr(e,t,s={}){const n=o.rows.find(r=>r.id===I);if(n?.kind!=="component"||b("dock:is-locked"))return;let a=O(),i=n.to;for(const[r,c]of Object.entries(t||{})){if(r in s)continue;const v=a.length,m=ut(a,{from:n.from,to:i},r,c);m!==a&&(i+=m.length-v,a=m)}a!==O()&&(de(a,{save:!0}),L(e))}function br(e,t,s){s?ye.add(t):ye.delete(t),Tn(e,t,"",s),L(e)}function At(e,t,s){ye.add(t),Tn(e,t,s,!0),L(e)}function Tn(e,t,s,n){const a=o.rows.find(c=>c.id===I);if(a?.kind!=="component"||b("dock:is-locked"))return;const i=O(),r=ut(i,a,t,s,{bound:n});r!==i&&de(r,{save:!0})}function Be(){const e=o.rows.find(t=>t.id===I);return e?.kind==="antlers"&&!b("dock:is-locked")?e:null}function ee(e,t){const s=Be();if(!s)return;const n=O(),a=t(n,s);a!==n&&(de(a),L(e))}function Mt(e,t,s,n){const a=o.rows.find(c=>c.id===I);if(a?.kind!=="component"||b("dock:is-locked"))return;const i=O(),r=ut(i,a,t,s,{bound:n});r!==i&&(de(r,{save:!0}),L(e))}function _r(e,t){ee(e,(s,n)=>n.antlers==="loop"?Je(s,n,n.loopKind==="collection"?"collection":"field",t):Ba(s,n,t))}function xr(e,t){const s=Be();if(!s||s.antlers!=="loop")return;const n=s.loopKind==="collection"?"collection":"field";if(t!==n){if(t==="collection"){const a=xn(e)[0]?.handle;if(!a)return;ee(e,(i,r)=>Je(i,r,"collection",a));return}ee(e,(a,i)=>Je(a,i,"field",i.handle||"items"))}}function Tr(e,t){ee(e,(s,n)=>Va(s,n,t))}function Sr(e,t){if(!e||!t||t.kind==="component"||Yt(t.tag))return null;const s=fo(e,t);if(s<t.openTo)return null;const n=e.lastIndexOf(`
`,s-1)+1;return e.slice(n,s).trim()===""&&n>t.openTo?n-1:s}function mt(e,t,s){if(te)return;const n=(s||o.rows).find(a=>a.id===t);n&&(I=t,o.rows.forEach(a=>{a.current=a.id===t}),st(e,n),!pt()&&(b("dock:reveal-html",{from:n.from,to:n.to,caret:Sr(O(),n)}),b("dock:tw-follow"),ce({source:ae,type:se.SVE_HTML_PICK_FOCUS,path:n.path},e)))}function Cr(e,t){if(!t)return"";const s=[],n=(a,i)=>{for(const r of a||[]){const c=i||r.path===e;r.kind==="component"&&r.src===t&&s.push({path:r.path,inside:c}),n(r.children,c)}};return n(_e,!1),(s.find(a=>a.inside)||s[0])?.path||""}function Pr(e,t){if(!t||!j(e.document))return;Se=!1,er(t),L(e);const s=o.rows.find(n=>n.path===t);s&&(mt(e,s.id,o.rows),e.setTimeout(()=>{j(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function at(e){if(He)return;const t=()=>{o.editingId||o.dragging||(e.clearTimeout(Ie),Ie=e.setTimeout(()=>{j(e.document)&&L(e)},80))},s=()=>t();He=Kt("dock:html-changed",t),e.document.addEventListener("sve-page-structure",s),et=()=>{e.document.removeEventListener("sve-page-structure",s)}}function Lr(e){He?.(),He=null,et?.(),et=null,e?.clearTimeout?.(Ie),Ie=0}function vt(e){const t=j(e.document);if(ce({source:ae,type:se.SVE_HTML_PICK,on:!1},e),Lr(e),R.forget(),F.callOpen=!1,F.callStore=null,dt(e),qe(),G(),lo(e),I=null,o.inspect=null,o.editingId=null,o.draft="",o.sections=[],o.pageBuilder=!1,V="",e?.clearTimeout?.(be),!t){We(e);return}t.remove(),rt.headerTab==="html_tree"&&eo(e,null),qn(e),Ft(e),jt(e),We(e)}function Or(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=$e,we(t,en,{title:p(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>vt(e)))}function Br(e){at(e),L(e)}function $r(e){const t=e.document;if(!Vn(e,"html_tree"))return;if(j(t)){at(e),L(e);return}if(!hn(t))return;Se=!0,D.clear(),Nn(e,[$e]);const s=t.createElement("div");s.id=$e,s.style.cssText=zn,we(s,en,{title:p(e,"html_tree")}),s.querySelector("[data-sve-close]")?.addEventListener("click",()=>vt(e)),Un(e,s),Ft(e),jt(e),We(e),at(e),L(e)}function Fr(e){if(j(e.document)){vt(e);return}$r(e)}Nt("html-tree:from-preview",({path:e,src:t}={})=>{Ut(window,e)||Pr(window,Cr(e,t)||e)});Nt("html-tree:arm-pick",e=>{const t=window;return e?(kn(t,je(O())),!0):(j(t.document)||ce({source:ae,type:se.SVE_HTML_PICK,on:!1},t),!0)});function jr(){W.clear(),le.clear(),ne.length=0}export{Na as HTML_TREE_STYLE_ID,Dr as armHtmlTreePrefetch,jr as clearHtmlTreeTemplates,G as closeHtmlTreeMenu,vt as closeHtmlTreePanel,za as ensureHtmlTreeStyles,Or as fillHtmlTreePane,I as htmlTreeActiveId,j as htmlTreePanel,Ie as htmlTreeTimer,He as htmlTreeUnhook,$r as openHtmlTreePanel,L as renderHtmlTree,Br as showHtmlTreePane,Lr as stopWatchHtmlTreeDock,Fr as toggleHtmlTreePanel,at as watchHtmlTreeDock};
