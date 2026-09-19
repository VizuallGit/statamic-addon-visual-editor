const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-D8Xdoe3O.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{_ as ce,k as j,ap as tn,b4 as o,u as c,o as m,a as v,b as x,t as _,F as L,d as D,f as nn,g as C,e as on,s as k,q,l as sn,p as vt,w as Me,b5 as an,v as gt,h as f,j as de,y,i as kt,b6 as et,b7 as tt,b8 as rn,b9 as ln,ba as cn,bb as yt,z as Z,x as dn,bc as fe,bd as un,B as te,c as ee,N as hn,G as pn,aM as Ke,aq as Ae,am as fn,aO as bt,aP as Tt,af as mn,ag as nt,S as me,V as ve,O as vn,aN as gn,an as kn,ao as yn,be as ot,bf as bn,U as _t,A as xt,a8 as Ve,J as St,K as Ct,ax as wt,ay as Re,I as Tn,bg as _n,aR as xn,aS as Sn,aw as Cn,bh as wn,b0 as Pn,ae as Pt,aG as $n,aJ as Ln}from"./addon-C5-rypYL.js";import{M as G,S as J}from"./protocol-D3FYhCm9.js";import{D as M,E as En,F as Ne,G as Hn,t as In,I as ze,v as Mn,z as An,b as Ue,l as Rn,J as $t,q as Dn,K as Lt,L as Bn,H as On,M as Xe,N as Et,O as Fn,h as jn,c as qn,Q as Kn,R as Vn,S as Nn,T as zn,U as Un,V as Xn,W as Yn,X as Wn,Y as Zn,Z as Gn}from"./tw-classes-7QKeIjiI.js";import{canEditFields as Jn,currentSetHandle as Qn,openFieldsetOverlay as eo}from"./section-fields-Splj_3P5.js";import{a as to}from"./html-pick-align-CK-9iH9_.js";import"./ai-text-icon-B7uCWIwa.js";const no={key:0,class:"sve-ht-inspect"},oo={class:"sve-ht-inspect__head"},so={key:0,class:"sve-ht-inspect__note"},ao={key:2,class:"sve-ht-inspect__props"},ro={class:"sve-ht-inspect__proplabel"},io={key:0},lo=["value","disabled","onChange"],co={value:""},uo=["value"],ho=["value"],po=["value","placeholder","onChange"],fo=["title","disabled","onClick"],mo=["title","disabled","onClick"],vo={key:0,class:"sve-ht-inspect__seg"},go=["data-active","disabled","onClick"],ko=["value","disabled"],yo={key:0,value:""},bo=["value"],To={key:2,class:"sve-ht-inspect__box"},_o=["value","placeholder","disabled","onKeydown"],xo=["title","disabled"],So={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Co=["value","disabled"],wo=["value"],Po={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},$o=["value","placeholder","disabled"],Lo=["title","disabled"],Eo={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Ho=["value","placeholder","disabled"],Io={key:4,class:"sve-ht-inspect__add"},Mo=["disabled","onClick"],Pe='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',Ao='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',Ro={__name:"HtmlTreeInspector",setup(e){const t=j(null);tn(t,h=>o.onPropHost?.(h||null));const s=j(null),n=j(null);function a(h){o.onInspectCommit?.(h.target.value)}function l(h,i,u){!h||!i||(h.value=i,h.focus(),h.setSelectionRange(i.length,i.length),u(i))}function r(h,i){o.onInspectData?.(h.currentTarget,u=>o.onPropValue?.(i.handle,u,!0))}function d(h){o.onInspectData?.(h.currentTarget,i=>l(s.value,i,u=>o.onInspectCommit?.(u)))}function g(h){o.onInspectData?.(h.currentTarget,i=>l(n.value,i,u=>o.onLoopSortField?.(u)))}return(h,i)=>c(o).inspect?(m(),v("div",no,[x("div",oo,_(c(o).inspect.title),1),c(o).inspect.mode==="note"?(m(),v("div",so,_(c(o).inspect.note),1)):c(o).inspect.mode==="statamic"?(m(),v("div",{key:1,ref_key:"propHost",ref:t,class:"sve-ht-inspect__form"},null,512)):c(o).inspect.mode==="props"?(m(),v("div",ao,[(m(!0),v(L,null,D(c(o).inspect.rows,u=>(m(),v("label",{key:u.handle,class:"sve-ht-inspect__prop"},[x("span",ro,[nn(_(u.label)+" ",1),u.bound?(m(),v("em",io,":")):C("",!0)]),x("span",{class:on(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":u.type==="select"||u.type==="link"}])},[u.type==="select"&&!u.bound?(m(),v("select",{key:0,value:u.value,disabled:!c(o).canEdit,onChange:T=>c(o).onPropValue?.(u.handle,T.target.value,!1)},[x("option",co,_(u.placeholder||c(o).inspect.inheritLabel),1),u.value&&!u.options.includes(u.value)?(m(),v("option",{key:0,value:u.value},_(u.value),9,uo)):C("",!0),(m(!0),v(L,null,D(u.options,T=>(m(),v("option",{key:T,value:T},_(T),9,ho))),128))],40,lo)):(m(),v("input",{key:1,type:"text",value:u.value,placeholder:u.placeholder||c(o).inspect.inheritLabel,onChange:T=>c(o).onPropValue?.(u.handle,T.target.value,u.bound)},null,40,po)),u.type==="link"?(m(),v("button",{key:2,type:"button","data-sve-ht-data":"",title:c(o).pageTitle,disabled:!c(o).canEdit,onClick:T=>c(o).onPropPage?.(T.currentTarget,u.handle),innerHTML:Ao},null,8,fo)):C("",!0),x("button",{type:"button","data-sve-ht-data":"",title:c(o).dataTitle,disabled:!c(o).canEdit,onClick:T=>r(T,u),innerHTML:Pe},null,8,mo)],2)]))),128))])):(m(),v(L,{key:3},[c(o).inspect.mode==="loop"?(m(),v("div",vo,[(m(!0),v(L,null,D(c(o).inspect.kinds,u=>(m(),v("button",{key:u.id,type:"button","data-active":u.id===c(o).inspect.loopKind?"":void 0,disabled:!c(o).canEdit,onClick:T=>c(o).onLoopKind?.(u.id)},_(u.label),9,go))),128))])):C("",!0),c(o).inspect.mode==="loop"&&c(o).inspect.loopKind==="collection"?(m(),v("select",{key:c(o).inspect.key+":"+c(o).inspect.value,value:c(o).inspect.value,disabled:!c(o).canEdit,onChange:a},[c(o).inspect.value?C("",!0):(m(),v("option",yo,_(c(o).inspect.placeholder),1)),(m(!0),v(L,null,D(c(o).inspect.collections,u=>(m(),v("option",{key:u.handle,value:u.handle},_(u.title),9,bo))),128))],40,ko)):(m(),v("div",To,[(m(),v("input",{ref_key:"field",ref:s,key:c(o).inspect.key,type:"text",value:c(o).inspect.value,placeholder:c(o).inspect.placeholder,disabled:!c(o).canEdit,spellcheck:"false",onKeydown:[i[0]||(i[0]=k(()=>{},["stop"])),q(k(a,["prevent"]),["enter"])],onBlur:a},null,40,_o)),x("button",{type:"button","data-sve-ht-data":"",title:c(o).dataTitle,disabled:!c(o).canEdit,innerHTML:Pe,onMousedown:i[1]||(i[1]=k(()=>{},["prevent"])),onClick:k(d,["stop","prevent"])},null,40,xo)])),c(o).inspect.sort?(m(),v(L,{key:3},[x("div",So,_(c(o).inspect.sort.title),1),(m(),v("select",{key:c(o).inspect.key+":dir:"+c(o).inspect.sort.dir,value:c(o).inspect.sort.dir,disabled:!c(o).canEdit,onChange:i[2]||(i[2]=u=>c(o).onLoopSortDir?.(u.target.value))},[(m(!0),v(L,null,D(c(o).inspect.sort.dirs,u=>(m(),v("option",{key:u.id,value:u.id},_(u.label),9,wo))),128))],40,Co)),c(o).inspect.sort.needsField?(m(),v("div",Po,[(m(),v("input",{ref_key:"sortField",ref:n,key:c(o).inspect.key+":field",type:"text",value:c(o).inspect.sort.field,placeholder:c(o).inspect.sort.placeholder,disabled:!c(o).canEdit,spellcheck:"false",onKeydown:[i[3]||(i[3]=k(()=>{},["stop"])),i[4]||(i[4]=q(k(u=>c(o).onLoopSortField?.(u.target.value),["prevent"]),["enter"]))],onBlur:i[5]||(i[5]=u=>c(o).onLoopSortField?.(u.target.value))},null,40,$o)),c(o).inspect.sort.pickable?(m(),v("button",{key:0,type:"button","data-sve-ht-data":"",title:c(o).dataTitle,disabled:!c(o).canEdit,innerHTML:Pe,onMousedown:i[6]||(i[6]=k(()=>{},["prevent"])),onClick:k(g,["stop","prevent"])},null,40,Lo)):C("",!0)])):C("",!0),x("div",Eo,_(c(o).inspect.limit.title),1),(m(),v("input",{key:c(o).inspect.key+":limit",type:"number",min:"1",value:c(o).inspect.limit.value,placeholder:c(o).inspect.limit.placeholder,disabled:!c(o).canEdit,onKeydown:[i[7]||(i[7]=k(()=>{},["stop"])),i[8]||(i[8]=q(k(u=>c(o).onLoopLimit?.(u.target.value),["prevent"]),["enter"]))],onBlur:i[9]||(i[9]=u=>c(o).onLoopLimit?.(u.target.value))},null,40,Ho))],64)):C("",!0),c(o).inspect.branches?.length?(m(),v("div",Io,[(m(!0),v(L,null,D(c(o).inspect.branches,u=>(m(),v("button",{key:u.id,type:"button",disabled:!c(o).canEdit,onClick:T=>c(o).onAddBranch?.(u.id)},_(u.label),9,Mo))),128))])):C("",!0)],64))])):C("",!0)}},Do=ce(Ro,[["__scopeId","data-v-26254b75"]]),Bo={class:"sve-dialog__title"},Oo={for:"sve-new-section-group"},Fo=["value"],jo={for:"sve-new-section-name"},qo=["placeholder"],Ko={key:0,class:"sve-dialog__note"},Vo={class:"sve-dialog__actions"},No=["disabled"],zo=["disabled"],Uo={__name:"NewSectionPrompt",props:{heading:{type:String,required:!0},groupLabel:{type:String,required:!0},nameLabel:{type:String,required:!0},placeholder:{type:String,default:""},note:{type:String,default:""},groups:{type:Array,required:!0},cancelLabel:{type:String,required:!0},saveLabel:{type:String,required:!0},onOk:{type:Function,required:!0},onClose:{type:Function,required:!0}},setup(e){const t=e,s=j(""),n=j(t.groups[0]?.key??""),a=j(null),l=j(!1);sn(()=>vt(()=>a.value?.focus()));function r(){const h=s.value.trim();if(!h||!n.value||l.value){a.value?.focus();return}l.value=!0,t.onOk(h,n.value)}function d(h){h.target===h.currentTarget&&t.onClose()}function g(h){h.key==="Enter"?r():h.key==="Escape"&&t.onClose()}return(h,i)=>(m(),v("div",{class:"sve-dialog-overlay",onClick:d},[x("div",{class:"sve-dialog",onClick:i[3]||(i[3]=k(()=>{},["stop"]))},[x("div",Bo,_(e.heading),1),x("label",Oo,_(e.groupLabel),1),Me(x("select",{id:"sve-new-section-group","onUpdate:modelValue":i[0]||(i[0]=u=>n.value=u),onKeydown:g},[(m(!0),v(L,null,D(e.groups,u=>(m(),v("option",{key:u.key,value:u.key},_(u.display),9,Fo))),128))],544),[[an,n.value]]),x("label",jo,_(e.nameLabel),1),Me(x("input",{id:"sve-new-section-name",ref_key:"input",ref:a,"onUpdate:modelValue":i[1]||(i[1]=u=>s.value=u),type:"text",placeholder:e.placeholder,onKeydown:g},null,40,qo),[[gt,s.value]]),e.note?(m(),v("p",Ko,_(e.note),1)):C("",!0),x("div",Vo,[x("button",{type:"button",class:"is-cancel",disabled:l.value,onClick:i[2]||(i[2]=(...u)=>e.onClose&&e.onClose(...u))},_(e.cancelLabel),9,No),x("button",{type:"button",class:"is-primary",disabled:l.value,onClick:r},_(e.saveLabel),9,zo)])])]))}},Xo=ce(Uo,[["__scopeId","data-v-d21be545"]]),Ht="/!/sve/section-types";async function Yo(e){const t=await e.fetch(Ht,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!t.ok)throw new Error(`section-types ${t.status}`);const s=await t.json(),n=new Map;for(const a of s.types||[])a?.group&&!n.has(a.group)&&n.set(a.group,a.group_display||a.group);return[...n].map(([a,l])=>({key:a,display:l}))}async function Wo(e,{display:t,group:s}){const n=await e.fetch(Ht,{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":kt(e),Accept:"application/json"},credentials:"same-origin",body:JSON.stringify({display:t,group:s})}),a=await n.json().catch(()=>({}));if(!n.ok){const l=new Error(a.error||`section-types ${n.status}`);throw l.reason=a.error,l}return a}async function Zo(e,t,s=null){if(!t||typeof et!="function"||typeof tt!="function")return null;const n=await et(e,t);if(!n)return null;const a=rn(),l=ln(e,"page",{handle:t},n?.defaults,a),r=cn(l,n?.new||{},n?.defaults);return tt(e,e.document,s,l,r)?l:null}const st=700,Go=17;function Jo(e,t){const s=(t||[]).filter(Boolean);if(!s.length)return;let n=0;const a=()=>{n+=1;const l=yt(e),r=l?s.some(d=>l.querySelector(`[data-sid="${CSS.escape(d)}"]`)):!0;r&&Z({source:J,type:G.SVE_ACTIVATE,ids:s},e),(r?!l&&n<6:n<Go)&&e.setTimeout(a,st)};e.setTimeout(a,st)}function Qo(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function es(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){(async()=>{let l=[];try{l=await Yo(e)}catch(d){n?.(d),e.Statamic?.$toast?.error(f(e,"section_new_failed"));return}if(!l.length){n?.(new Error("no groups")),e.Statamic?.$toast?.error(f(e,"section_new_failed"));return}const r=de(e.document,Xo,{heading:f(e,"section_new"),groupLabel:f(e,"section_new_group"),nameLabel:f(e,"section_new_name"),placeholder:f(e,"section_new_placeholder"),note:f(e,"section_new_note"),groups:l,cancelLabel:f(e,"cancel"),saveLabel:f(e,"section_new_create"),onClose:a,onOk:(d,g)=>{(async()=>{try{const h=await Wo(e,{display:d,group:g});r.dismiss(),e.Statamic?.$toast?.success(f(e,"section_created",{name:h.section?.display||d})),e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"));const i=await Zo(e,h.section?.handle,t);!i&&h.section?.handle&&y("dock:open-template",h.section.handle),s?.({...h,uid:i?._visual_id||""})}catch(h){r.dismiss(),e.Statamic?.$toast?.error(f(e,h.reason==="bad_name"?"section_new_bad_name":"section_new_failed")),n?.(h)}})()}})})()}const ts={class:"sve-html-tree"},ns={class:"sve-pane-bar","data-sve-pane-bar":""},os={"data-sve-right-title":""},ss={class:"sve-ht-tools"},as=["title"],rs=["placeholder","aria-label","value"],is=["aria-label"],ls=["title","aria-label"],cs={key:1,class:"sve-tree-exit"},ds=["title"],us=["title"],hs='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',ps='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',fs='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',ms={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const t=f(window,"html_tree_search"),s=Qo(window),n=f(window,"section_new"),a=j(!1);function l(){a.value=!1}async function r(h){if(h)for(let i=0;i<20;i+=1){await vt(),o.onRefresh?.();const u=o.sections.find(T=>T.uid===h);if(u){o.onSection?.(h),Jo(window,u.ids);return}await new Promise(T=>setTimeout(T,50))}}function d(){a.value||(a.value=!0,es(window,{afterUid:o.sections.length?o.sections[o.sections.length-1].uid:null,onDone:h=>{l(),r(h?.uid)},onError:l,onClose:l}))}function g(h){const i=!!o.query;o.query=h,i!==!!h&&o.onQuery?.()}return(h,i)=>(m(),v("div",ts,[x("div",ns,[x("div",os,_(e.title),1),i[5]||(i[5]=dn('<div data-sve-right-actions data-v-fb9a0208><button type="button" data-sve-right-pin aria-pressed="false" data-v-fb9a0208></button><button type="button" data-sve-close aria-label="Close" data-v-fb9a0208><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-fb9a0208><path d="M18 6 6 18" data-v-fb9a0208></path><path d="m6 6 12 12" data-v-fb9a0208></path></svg></button></div>',1))]),x("div",ss,[x("label",{class:"sve-ht-search",title:c(t)},[x("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:ps}),x("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:c(t),"aria-label":c(t),value:c(o).query,autocomplete:"off",spellcheck:"false",onInput:i[0]||(i[0]=u=>g(u.target.value)),onKeydown:[i[1]||(i[1]=k(()=>{},["stop"])),i[2]||(i[2]=q(k(u=>g(""),["prevent"]),["escape"]))]},null,40,rs),c(o).query?(m(),v("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":c(t),innerHTML:fs,onClick:i[3]||(i[3]=u=>g(""))},null,8,is)):C("",!0)],8,as),c(s)&&(c(o).sections.length||c(o).pageBuilder)?(m(),v("button",{key:0,type:"button",class:"sve-ht-new",title:c(n),"aria-label":c(n),innerHTML:hs,onClick:d},null,8,ls)):C("",!0)]),c(M).inSidebar?C("",!0):(m(),fe(En,{key:0})),i[6]||(i[6]=x("div",{"data-sve-html-tree-list":""},null,-1)),un(Do),c(o).exitOpen&&!c(M).inSidebar?(m(),v("div",cs,[x("span",{class:"sve-tree-exit__name",title:c(o).exitName},_(c(o).exitName),9,ds),x("button",{type:"button",class:"sve-tree-exit__go",title:c(o).exitTitle,onClick:i[4]||(i[4]=u=>c(o).onExit?.())},_(c(o).exitLabel),9,us)])):C("",!0)]))}},It=ce(ms,[["__scopeId","data-v-fb9a0208"]]);function Mt(e){return String(e||"").trim().toLowerCase()}function At(e,t){return t?[e.name,e.tag,e.klass,e.label,e.src].filter(s=>typeof s=="string"&&s).join(" ").toLowerCase().includes(t):!0}function vs(e,t){const s=Mt(t);if(!s)return{rows:e,hits:new Set};const n=new Set;for(const r of e)At(r,s)&&n.add(r.path);const a=[...n];return{rows:e.filter(r=>n.has(r.path)||a.some(d=>d.startsWith(`${r.path}/`))),hits:n}}const gs=["title"],ks={"data-sve-ht-indent":"","aria-hidden":"true"},ys=["data-sve-ht-cat"],bs={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},Ts={key:2,"data-sve-ht-letter":""},_s=["innerHTML"],xs=["title"],Ss=["title"],Cs={key:1,"data-sve-ht-kind":""},ws={key:3,"data-sve-ht-name":""},Ps={key:4,"data-sve-ht-actions":""},$s=["disabled","title","innerHTML"],Ls=["disabled","title"],Es=["disabled","title"],Hs=["disabled","title"],Is=["data-sve-ht-id"],Ms='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',As='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',Rs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Ds='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',Bs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',Os='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',Fs={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const t=Jn(window),s=f(window,"section_fields");function n(){const h=Qn();if(!h){window.Statamic?.$toast?.error(f(window,"section_fields_none"));return}eo(window,h)}function a(h){return h.kind==="component"?h.src?`partial:${h.src}`:h.tag:h.name?`${h.tag} ${h.name}`:h.tag}function l(h){return!!h.section}function r(h){if(l(h)){o.onSection?.(h.section);return}o.onSelect?.(h.id)}function d(h,i){const u={"data-sve-ht-id":h.id};return h.current&&(u["data-sve-ht-current"]=""),h.hidden&&(u["data-sve-ht-hidden"]=""),u["data-sve-ht-cat"]=h.cat||"other",u["data-sve-ht-depth"]=String(h.depth),i&&(u["data-sve-ht-dim"]=""),l(h)&&(u["data-sve-ht-sec"]=""),!l(h)&&o.dropId===h.id&&o.dropPlace&&(u["data-sve-ht-drop"]=o.dropPlace),u}function g(h){return!h.hidden||h.wrapFrom!=null}return(h,i)=>(m(),v(L,null,[x("div",te({"data-sve-ht-row":""},d(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:i[26]||(i[26]=u=>r(e.row)),onDblclick:i[27]||(i[27]=k(u=>l(e.row)?null:c(o).onRename?.(e.row.id),["prevent"])),onKeydown:[i[28]||(i[28]=q(k(u=>r(e.row),["prevent"]),["enter"])),i[29]||(i[29]=q(k(u=>r(e.row),["prevent"]),["space"]))],onPointerdown:i[30]||(i[30]=u=>l(e.row)?null:c(o).onPointerDown?.(u,e.row.id)),onContextmenu:i[31]||(i[31]=k(u=>l(e.row)?null:c(o).onContext?.(u,e.row.id),["prevent","stop"]))}),[x("span",ks,[(m(!0),v(L,null,D(e.row.guides||[],(u,T)=>(m(),v("i",{key:T,"data-sve-ht-cat":u},null,8,ys))),128))]),e.row.hasChildren||e.row.emptyBlock?(m(),v("button",te({key:0,type:"button","data-sve-ht-twist":""},e.row.shut?{"data-sve-ht-shut":""}:{},{innerHTML:As,onClick:i[0]||(i[0]=k(u=>l(e.row)?c(o).onSection?.(e.row.section):c(o).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:i[1]||(i[1]=k(()=>{},["stop"])),onDblclick:i[2]||(i[2]=k(()=>{},["stop"]))}),null,16)):(m(),v("span",bs)),e.row.letter?(m(),v("span",Ts,_(e.row.letter),1)):(m(),v("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,_s)),x("span",{"data-sve-ht-text":"",title:c(o).renameTitle},[!e.row.kind&&!l(e.row)?(m(),v("button",{key:0,type:"button","data-sve-ht-tag":"",title:c(o).tagTitle,onClick:i[3]||(i[3]=k(()=>{},["stop","prevent"])),onPointerdown:i[4]||(i[4]=k(()=>{},["stop"])),onDblclick:i[5]||(i[5]=k(u=>c(o).onTagChange?.(u,e.row.id),["stop","prevent"]))},_(e.row.tag),41,Ss)):(m(),v("span",Cs,_(e.row.tag),1)),c(o).editingId===e.row.id&&!l(e.row)?Me((m(),v("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":i[6]||(i[6]=u=>c(o).draft=u),onMousedown:i[7]||(i[7]=k(()=>{},["stop"])),onPointerdown:i[8]||(i[8]=k(()=>{},["stop"])),onClick:i[9]||(i[9]=k(()=>{},["stop"])),onDblclick:i[10]||(i[10]=k(()=>{},["stop"])),onKeydown:[i[11]||(i[11]=k(()=>{},["stop"])),i[12]||(i[12]=q(k(u=>c(o).onRenameCommit?.(),["prevent"]),["enter"])),i[13]||(i[13]=q(k(u=>c(o).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:i[14]||(i[14]=u=>c(o).onRenameCommit?.())},null,544)),[[gt,c(o).draft]]):(m(),v("span",ws,_(e.row.name),1))],8,xs),l(e.row)?C("",!0):(m(),v("span",Ps,[g(e.row)?(m(),v("button",{key:0,type:"button","data-sve-ht-eye":"",disabled:!c(o).canEdit,title:c(o).canEdit?e.row.hidden?c(o).showTitle:c(o).hideTitle:c(o).lockedTitle,innerHTML:e.row.hidden?Ds:Rs,onClick:i[15]||(i[15]=k(u=>c(o).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:i[16]||(i[16]=k(()=>{},["stop"])),onDblclick:i[17]||(i[17]=k(()=>{},["stop"]))},null,40,$s)):C("",!0),c(t)&&e.row.depth===0?(m(),v("button",{key:1,type:"button","data-sve-ht-fields":"",disabled:!c(o).canEdit,title:c(o).canEdit?c(s):c(o).lockedTitle,innerHTML:Ms,onClick:k(n,["stop","prevent"]),onPointerdown:i[18]||(i[18]=k(()=>{},["stop"])),onDblclick:i[19]||(i[19]=k(()=>{},["stop"]))},null,40,Ls)):C("",!0),x("button",{type:"button","data-sve-ht-dup":"",disabled:!c(o).canEdit,title:c(o).canEdit?c(o).duplicateTitle:c(o).lockedTitle,innerHTML:Bs,onClick:i[20]||(i[20]=k(u=>c(o).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:i[21]||(i[21]=k(()=>{},["stop"])),onDblclick:i[22]||(i[22]=k(()=>{},["stop"]))},null,40,Es),x("button",{type:"button","data-sve-ht-del":"",disabled:!c(o).canEdit,title:c(o).canEdit?c(o).deleteTitle:c(o).lockedTitle,innerHTML:Os,onClick:i[23]||(i[23]=k(u=>c(o).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:i[24]||(i[24]=k(()=>{},["stop"])),onDblclick:i[25]||(i[25]=k(()=>{},["stop"]))},null,40,Hs)]))],16,gs),e.row.emptyBlock&&!e.row.shut?(m(),v("div",te({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},c(o).dropId===e.row.id&&c(o).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),_(c(o).slotText),17,Is)):C("",!0)],64))}},$e=ce(Fs,[["__scopeId","data-v-60e221c4"]]),js=["data-sve-ht-look"],qs={key:0,class:"sve-ht-empty"},Ks={key:1,class:"sve-ht-empty"},Vs={key:0,class:"sve-ht-empty"},Ns={__name:"HtmlTreeList",setup(e){const t=ee(()=>Mt(o.query)),s=ee(()=>vs(o.rows,t.value)),n=ee(()=>s.value.rows),a=ee(()=>t.value?o.sections.filter(d=>At(d.row,t.value)||d.current&&d.ready&&n.value.length>0):o.sections),l=ee(()=>!!t.value&&!a.value.length&&!n.value.length);function r(d){return!!t.value&&!s.value.hits.has(d.path)}return(d,g)=>(m(),v("div",te({class:"sve-ht-root","data-sve-ht-look":c(o).look,style:c(o).familyStyle},c(o).dragging?{"data-sve-ht-dragging":""}:{}),[!c(o).rows.length&&!c(o).sections.length?(m(),v("div",qs,_(c(o).emptyText),1)):l.value?(m(),v("div",Ks,_(c(o).searchEmpty),1)):C("",!0),c(o).sections.length?(m(!0),v(L,{key:2},D(a.value,h=>(m(),v("div",te({key:h.uid},{ref_for:!0},h.current?{"data-sve-ht-branch":""}:{}),[h.ready?(m(),v(L,{key:0},[(m(!0),v(L,null,D(n.value,i=>(m(),fe($e,{key:i.id,row:i,dim:r(i)},null,8,["row","dim"]))),128)),c(o).rows.length?C("",!0):(m(),v("div",Vs,_(c(o).emptyText),1))],64)):(m(),fe($e,{key:1,row:h.row},null,8,["row"]))],16))),128)):c(o).rows.length?(m(!0),v(L,{key:3},D(n.value,h=>(m(),fe($e,{key:h.id,row:h,dim:r(h)},null,8,["row","dim"]))),128)):C("",!0)],16,js))}},at=ce(Ns,[["__scopeId","data-v-dc041b26"]]);let Le=null;function zs(e){return Le||(Le=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{pages:[]}).then(t=>Array.isArray(t.pages)?t.pages:[]).catch(()=>[])),Le}let ge=null;function Ee(){ge?.dismiss(),ge=null}function Us(e,t,s){Ee();const n=t?.getBoundingClientRect?.(),a={x:n?n.left:0,y:n?n.bottom+4:0};zs(e).then(l=>{const r=l.length?l.map(d=>({label:d.title||d.url,onPick:()=>{Ee(),s(d.url)}})):[{label:f(e,"component_props_pages_none"),onPick:null}];Ee(),ge=de(e.document,Ne,{items:r,x:a.x,y:a.y,onClose:()=>{ge=null}})})}const Rt="sve-html-tree-labels";function Dt(){try{const e=globalThis.localStorage?.getItem(Rt);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function Xs(e){try{globalThis.localStorage?.setItem(Rt,JSON.stringify(e))}catch{}}function Bt(e){return String(e||"_")}function Ot(e){const t=Dt()[Bt(e)];return t&&typeof t=="object"?{...t}:{}}function Ys(e,t,s){const n=s?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function Ws(e,t,s,n){if(!t)return;const a=Bt(e),l=Dt(),r={...l[a]||{}},d=String(s||"").replace(/\s+/g," ").trim(),g=String(n||"").trim();!d||d===g?delete r[t]:r[t]=d,Object.keys(r).length?l[a]=r:delete l[a],Xs(l)}const Zs=/^@(media|supports|container|layer|scope)\b/i;function Gs(e){const t=String(e||""),s=[];let n=0,a=0;for(;n<t.length;){if(t[n]==="{"&&t[n+1]==="{"){const d=t.indexOf("}}",n+2);n=d===-1?t.length:d+2;continue}if(t[n]==="/"&&t[n+1]==="*"){const d=t.indexOf("*/",n+2);n=d===-1?t.length:d+2;continue}if(t[n]==='"'||t[n]==="'"){const d=t[n];for(n+=1;n<t.length&&t[n]!==d;)n+=t[n]==="\\"?2:1;n+=1;continue}if(t[n]!=="{"){n+=1;continue}let l=1,r=n+1;for(;r<t.length&&l>0;){if(t[r]==="{"&&t[r+1]==="{"){const d=t.indexOf("}}",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==="/"&&t[r+1]==="*"){const d=t.indexOf("*/",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==='"'||t[r]==="'"){const d=t[r];for(r+=1;r<t.length&&t[r]!==d;)r+=t[r]==="\\"?2:1;r+=1;continue}t[r]==="{"?l+=1:t[r]==="}"&&(l-=1),r+=1}s.push({selector:t.slice(a,n).trim(),body:t.slice(n+1,r-1),from:a,to:r,text:t.slice(a,r).trim()}),n=r,a=r}return s}function rt(e){const t=String(e||""),s=new Set,n=new Set,a=new Set;for(const l of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const r of l[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))r&&(s.add(r),s.add(r.replace(/([:./%!#()[\],])/g,"\\$1")));for(const l of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))l[2].trim()&&n.add(l[2].trim());for(const l of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))a.add(l[1].toLowerCase());return{classes:s,ids:n,tags:a}}function it(e,t){const s=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),n=[...s.matchAll(/\.((?:\\.|[\w-])+)/g)].map(r=>r[1]),a=[...s.matchAll(/#((?:\\.|[\w-])+)/g)].map(r=>r[1]);if(n.length||a.length){const r=d=>d.replace(/\\(.)/g,"$1");return n.every(d=>t.classes.has(d)||t.classes.has(r(d)))&&a.every(d=>t.ids.has(r(d)))}const l=[...s.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(r=>r[2].toLowerCase());return l.length>0&&l.every(r=>t.tags.has(r))}function Js(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function Qs(e,t,s){const n=Js(e);if(!n.length)return"keep";const a=n.filter(r=>it(r,t));return a.length?a.length===n.length&&!n.some(r=>it(r,s))?"move":"copy":"keep"}function Ft(e,t,s){const n=String(e||""),a=rt(t),l=rt(s),r=[],d=[];let g=0;for(const h of Gs(n)){const i=n.slice(h.from,h.to),u=i.match(/^\s*/)[0];if(g=h.to,Zs.test(h.selector)){const P=Ft(h.body,t,s);P.move.trim()&&r.push(`${h.selector} {
${P.move.trim()}
}`),P.keep.trim()&&d.push(`${u}${h.selector} {
${P.keep.trim()}
}`);continue}const T=h.selector.startsWith("@")?"keep":Qs(h.selector,a,l);if(T==="move"){r.push(h.text);continue}T==="copy"&&r.push(h.text),d.push(i)}return d.push(n.slice(g)),{move:r.join(`

`).trim(),keep:d.join("").replace(/\n{3,}/g,`

`).trim()}}const ea="/!/sve/component";function ta(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let s=null;for(const n of t){if(!n.trim())continue;const a=n.match(/^[ \t]*/)[0].length;s=s===null?a:Math.min(s,a)}return s?t.map(n=>n.slice(s)).join(`
`):t.join(`
`)}function na(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function oa(e,t){if(!In(e))return"";try{return await(await pn(()=>import("./tw-compile-D8Xdoe3O.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(s){return console.error("[sve] component tailwind compile",s),""}}async function sa(e,t){const s=await e.fetch(ea,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":kt(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!s.ok){const n=new Error(String(s.status));throw n.status=s.status,n}return s.json()}function lt(e,t){const{from:s,to:n}=Hn(e,t),a=e.slice(s,n);if(!a.trim())return null;const l=e.slice(0,s)+e.slice(n),r=y("dock:css"),d=Ft(typeof r=="string"?r:"",a,l);return{html:ta(a),css:d.move,keepCss:d.keep,lead:na(a),from:s,to:n}}function aa(e,t,{onDone:s,onError:n}={}){if(y("dock:is-locked")===!0)return;const a=y("dock:html");if(typeof a!="string"||!t)return;const l=lt(a,t);if(!l)return;const r=de(e.document,hn,{heading:f(e,"component_new"),nameLabel:f(e,"component_name"),placeholder:f(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:f(e,"cancel"),saveLabel:f(e,"component_create"),onOk:d=>{r.dismiss(),(async()=>{try{const g=await oa(e,l.html),h=y("dock:html"),i=typeof h=="string"&&h===a?l:lt(h,t);if(!i)return;const u=await sa(e,{name:d,html:i.html,css:i.css,js:"",tw:g}),T=y("dock:html"),P=T.slice(0,i.from)+i.lead+u.tag+T.slice(i.to);y("dock:set-html",P),i.css.trim()&&y("dock:set-css",i.keepCss),s?.(u)}catch(g){n?.(g)}})()}})}function ra(e,t,s){const n=String(e||"");if(!t||t.kind!=="antlers")return n;const a=String(s||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?da(n,t,a):t.tag==="else"||!a?n:n.slice(0,t.from)+`{{ ${t.tag} ${a} }}`+n.slice(t.openTo)}function De(e,t,s,n){return ne(e,t,{kind:s,name:n})}function ne(e,t,s={}){const n=String(e||"");if(!t||t.antlers!=="loop")return n;const a=t.loopKind==="collection"?"collection":"field",l=s.kind??a,r=String(s.name??t.expr??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(r))return n;const d=s.sortDir??t.sortDir??"",g=String(s.sortField??t.sortField??"").trim(),h=String(s.limit??t.limit??"").trim(),i=jt(n,t);if(!i)return n;const u=l===a?t.params:"",T=l==="collection"?ia(r,g,d,h,u):la(r,g,d,h,u),P=l==="collection"?"collection":r;return n.slice(0,t.from)+T+n.slice(t.openTo,i.from)+`{{ /${P} }}`+n.slice(i.to)}function ia(e,t,s,n,a){const l=ca(a).replace(/\bsort\s*=\s*["'][^"']*["']/g,"").replace(/\blimit\s*=\s*["']?\d+["']?/g,"").replace(/\s+/g," ").trim(),r=[`collection from="${e}"`];return s==="random"?r.push('sort="random"'):t&&r.push(`sort="${t}${s==="desc"?":desc":":asc"}"`),n&&r.push(`limit="${n}"`),l&&r.push(l),`{{ ${r.join(" ")} }}`}function la(e,t,s,n,a){const l=String(a||"").split("|").map(d=>d.trim()).filter(d=>d&&!/^from\s*=/.test(d)&&!/^sort\s*:/.test(d)&&!/^reverse$/.test(d)&&!/^shuffle$/.test(d)&&!/^limit\s*:/.test(d)),r=[e,...l];return s==="random"?r.push("shuffle"):t&&(r.push(`sort:${t}`),s==="desc"&&r.push("reverse")),n&&r.push(`limit:${n}`),`{{ ${r.join(" | ")} }}`}function ca(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function jt(e,t){const n=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return n?{from:t.from+n.index,to:t.from+n.index+n[0].length}:null}function da(e,t,s){return ne(e,t,{name:s})}function ua(e,t,s){const n=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return n;const a=jt(n,t);if(!a)return n;const r=(n.slice(0,a.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],d=s==="else"?"{{ else }}":"{{ elseif true }}";return`${n.slice(0,a.from)}${d}
${r}${n.slice(a.from)}`}const E=Bn("sve-call-values"),ae=new Set;let ct=null;const ha="__sve-html-tree-style",B=new Set;let Be="",X=!1,ue=!0,O="",re=0,qt="";const Y=new Map,oe=new Set;let I="",Kt=!1,$=null,ke=null,ye=0,Oe=null,ie=[],V=null,se=null,be=null,Te=null,Fe=null,_e=!1,N=null,K=null;function A(e){return e.getElementById(me)}function pa(e){mn(e,ha,`
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
      ${nt("light")}
      --sve-ht-pick: rgba(56,88,233,.14);
      --sve-ht-pick-hover: rgba(56,88,233,.22);
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${nt("dark")}
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

    /* Flat rows: no card, no indent margin — the spacer below does the
       stepping, so the hover and the pick run the full width of the panel. */
    [data-sve-ht-look="tags"] [data-sve-ht-row] {
      margin: 0;
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

    /* One guide per level, drawn on the spacer: 14px per level with the line
       7px in, so each sits under the twist of the row it descends from — in
       that row's family colour, held back. The negative margin cancels the
       row gap, so a depth-0 row starts flush. */
    [data-sve-ht-look="tags"] [data-sve-ht-indent] {
      display: flex;
      flex: none;
      align-self: stretch;
      width: calc(var(--sve-ht-depth, 0) * 14px);
      margin-right: -5px;
      pointer-events: none;
    }
    [data-sve-ht-look="tags"] [data-sve-ht-indent] i {
      display: block;
      flex: none;
      width: 14px;
      background: linear-gradient(to right, transparent 7px, var(--sve-ht-c) 7px, var(--sve-ht-c) 8px, transparent 8px);
      opacity: .5;
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
      margin-left: calc(4px + var(--sve-ht-depth, 0) * 14px);
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
  `)}function H(){const e=y("dock:html");return typeof e=="string"?e:""}function Vt(e){return!!y("dock:is-open",e)}function Q(e){return Ye()?!1:y("dock:set-html",e)===!0}function dt(e){const t=y("dock:component-exit-state")||{};if(o.exitOpen=!!t.open,!t.open){o.onExit=null;return}o.exitName=t.name||"",o.exitLabel=f(e,"component_exit"),o.exitTitle=f(e,t.back?"component_exit_back":"component_exit_close"),o.onExit=()=>{y("dock:exit-component"),w(e)}}function fa(e,t){const s=xn(e);if(!s||t.type!==s)return"";const n=Sn(t[s]);return n&&Cn(e,n)?.section_type||""}const le=[];let He=!1;function Ie(e,t){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(t,{timeout:2e3});return}e.setTimeout(t,200)}function ma(e,t){for(const s of t){const n=s.type;!n||Y.has(n)||oe.has(n)||le.includes(n)||le.push(n)}Ke.htmlTreePrefetchArmed&&Nt(e)}function Ga(e){Ke.htmlTreePrefetchArmed=!0,Nt(e)}function Nt(e){if(He||!le.length)return;He=!0;const t=()=>{const s=le.shift();if(!s){He=!1;return}if(Y.has(s)||oe.has(s)){Ie(e,t);return}oe.add(s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(s)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{typeof n?.html=="string"&&Y.set(s,n.html)}).catch(()=>{}).finally(()=>{oe.delete(s),Ie(e,t)})};Ie(e,t)}function Ye(){return!!I}function va(e){const t=new Map,s=yt(e);if(!s)return t;for(const n of s.querySelectorAll("[data-sid]")){const a=n.getAttribute("data-sid");a&&!t.has(a)&&t.set(a,n.tagName.toLowerCase())}return t}function ga(e,t){const s=Ve(e)||"page_sections";for(const n of St(t)||[]){const a=Ct(n.values),l=a&&typeof a=="object"?a[s]:null;if(Array.isArray(l))return!0}return!1}function zt(e,t){const s=Ve(e)||"page_sections",n=va(e),a=[];for(const l of St(t)||[]){const r=Ct(l.values),d=r&&typeof r=="object"?r[s]:null;if(Array.isArray(d)){d.forEach(g=>{if(!g||typeof g!="object"||Array.isArray(g)||typeof g.type!="string")return;const h=[g._visual_id,g.id,g._id].filter(R=>typeof R=="string"&&R!=="");if(!h.length)return;const i=fa(e,g)||g.type,u=typeof g._sve_label=="string"?g._sve_label.trim():"",T=h.map(R=>n.get(R)).find(Boolean)||"section",P=Ot(g.type)[`0:${T}`];a.push({uid:h[0],ids:h,type:g.type,tag:T,label:(typeof P=="string"&&P.trim()?P.trim():"")||u||wt(e,i)?.display||Re(i)||i,svg:Lt(T,"",null).svg||On.section,cat:_t(T),enabled:g.enabled!==!1})});break}}return a}function ka(e,t,s){if(!s.length)return"";const n=y("dock:current-type")||"",a=y("dock:current-uid"),l=!!y("dock:component-exit-state")?.open;if(a){const r=Tn(a,t),d=s.find(g=>g.ids.some(h=>r.includes(h)));if(d&&(l||d.type===n))return d.uid}return s.find(r=>r.type===n)?.uid||""}function ya(e,t,s){const n=y("dock:component-exit-state");if(n?.open)return Re(n.name)||n.name||"";if(s)return t.find(l=>l.uid===s)?.label||"";const a=y("dock:current-type")||"";return wt(e,a)?.display||Re(a)||""}function Ut(e,t,s,n,a){const l=s.find(d=>d.uid===n);if(!l||n===a)return;B.clear(),$=null,ue=!1,W(),Ce(),O=n,qt=H(),I=Y.get(l.type)||"",I&&($=xe(Ue(I))||null),Kt=(y("dock:current-type")||"")===l.type,e.clearTimeout(re),re=e.setTimeout(()=>{O="",X=!1,w(e)},4e3),w(e);const r=()=>$n(l.uid,t,e,{clampToSection:!0});_n(l.uid,t,e,r),Z({source:J,type:G.SVE_ACTIVATE,ids:l.ids},e),e.setTimeout(()=>w(e),0)}function Xt(e,t){if(!t)return!1;for(const s of e||[])if(s.id===t||Xt(s.children,t))return!0;return!1}function xe(e){for(const t of e||[]){if(!t.kind)return t.id;const s=xe(t.children);if(s)return s}return""}function ba(e,t){return B.has(e.path)?t===0:t>0}function Ta(e){const t=new Set,s=(n,a)=>{for(const l of n)l.children.length&&ba(l,a)&&t.add(l.id),s(l.children,a+1)};return s(e,0),t}function w(e){const t=e.document,n=A(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;pa(t),An(e);const a=H();I&&I===a&&(I="");const l=I||a,r=Ue(l);ie=r;const d=y("dock:current-type")||"",g=Ot(d),h=zt(e,t),i=ga(e,t);d&&a&&!I&&Y.set(d,a),ma(e,h);const u=ka(e,t,h);if(i&&!h.length){ie=[],o.rows=[],o.sections=[],o.pageBuilder=!0,o.emptyText=f(e,"html_tree_empty"),o.canEdit=!y("dock:is-locked"),o.look=ot(e),o.onRefresh=()=>w(e),o.onSection=null,dt(e),ve(n,at),ut(e,[]);return}o.pageBuilder=i;const T=`${d}|${u}`;T!==Be&&(Be=T,B.clear(),X=l),X!==!1&&l!==X&&(X=!1,B.clear(),$=xe(r)||null),O&&(O===u||!h.length)&&(Kt||l!==qt)&&(e.clearTimeout(re),O="",X=!1,Xt(r,$)||(B.clear(),$=xe(r)||null));const P=h.some(p=>p.uid===O)?O:"",R=ue?"":P||u,Jt=!!(P||u),U=Rn(r,o.query?new Set:Ta(r));!l.trim()&&!Vt(t)?o.emptyText=f(e,"html_tree_need_dock"):o.emptyText=f(e,"html_tree_empty"),o.slotText=f(e,"antlers_drop_here"),o.dataTitle=f(e,"data_vars_title"),o.pageTitle=f(e,"component_props_page"),o.renameTitle=f(e,"html_tree_rename"),o.tagTitle=f(e,"tw_tag"),o.hideTitle=f(e,"html_tree_hide"),o.showTitle=f(e,"html_tree_show"),o.duplicateTitle=f(e,"html_tree_duplicate"),o.deleteTitle=f(e,"html_tree_delete"),o.lockedTitle=f(e,"html_tree_locked"),o.searchEmpty=f(e,"html_tree_search_empty"),o.canEdit=!y("dock:is-locked"),o.look=ot(e),bn(e),o.onQuery=()=>w(e),dt(e),o.onSelect=p=>{const b=U.find(S=>S.id===p);b&&$t(e,b.path)||Ze(e,p,U)},o.onTwist=p=>{const b=U.find(S=>S.id===p)?.path;b&&(B.has(b)?B.delete(b):B.add(b),w(e))},o.onTagChange=(p,b)=>{const S=o.rows.find(F=>F.id===b);S&&!Ye()&&Dn(e,p.currentTarget,S)},o.onRename=p=>xa(e,p),o.onRenameCommit=()=>ht(e,!0),o.onRenameCancel=()=>ht(e,!1),o.onHide=p=>Sa(e,p),o.onDuplicate=p=>Ca(e,p),o.onDelete=p=>Pa(e,p),o.onPointerDown=(p,b)=>Ha(e,p,b),o.onContext=(p,b)=>La(e,p,b),o.onInspectCommit=p=>Ba(e,p),o.onPropValue=(p,b,S)=>mt(e,p,b,S),o.onPropPage=(p,b)=>Us(e,p,S=>mt(e,b,S,!1)),o.onLoopKind=p=>Oa(e,p),o.onAddBranch=p=>Fa(e,p),o.onLoopSortField=p=>{const b=Se(),S=String(p||"").trim();if(!b)return;const F=K?.id===b.id?K.dir:"",pe=b.sortDir||F||"asc";K=null,z(e,(Qt,en)=>ne(Qt,en,{sortField:S,sortDir:pe}))},o.onLoopSortDir=p=>{const b=Se(),S=String(p||"");if(b){if((S==="asc"||S==="desc")&&!b.sortField){K={id:b.id,dir:S},je(e,b);return}K=null,z(e,(F,pe)=>ne(F,pe,{sortDir:S,sortField:S==="asc"||S==="desc"?pe.sortField:""}))}},o.onLoopLimit=p=>z(e,(b,S)=>ne(b,S,{limit:String(p||"").replace(/\D/g,"")})),o.onPropHost=p=>p?E.mount(p):E.unmount(),o.onInspectData=(p,b)=>{y("dock:data-menu",{anchor:p,at:U.find(S=>S.id===$)?.from,onPick:S=>b(String(S?.var||"").trim())})};const Je=U.find(p=>!p.kind)?.id,Qe=ya(e,h,R),he=R?h.find(p=>p.uid===R):null;o.rows=U.map(p=>{const b=Lt(p.tag,p.kind,p.antlers),S=p.id===Je&&Qe?Qe:p.klass,F=p.id===Je;return{...p,base:S,name:Ys(S,p.path,g),current:p.id===$,letter:b.letter||"",svg:F&&he?he.svg:b.svg||"",cat:_t(p.tag,p.kind,p.antlers),sectionRoot:F&&he?he.uid:""}});const we=[];for(const p of o.rows)we.length=p.depth,p.guides=we.slice(),we[p.depth]=p.cat;o.sections=Jt?h.map(p=>{const b=!!R&&p.uid===R;return{...p,current:b,ready:b&&(!P||!!I),row:{id:`sec:${p.uid}`,section:p.uid,tag:p.tag,name:p.label,kind:"",svg:p.svg,cat:p.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:b,hidden:!p.enabled}}}):[],o.onSection=p=>Ut(e,t,h,p,R),o.onRefresh=()=>w(e),je(e,o.rows.find(p=>p.id===$)),ve(n,at),ut(e,r)}function ut(e,t){A(e.document)&&Yt(e,t)}function Yt(e,t){const s=t[0],n=!!y("dock:component-src"),a=n?"":y("dock:current-uid")||"";Z({source:J,type:G.SVE_HTML_PICK,on:!0,uid:a,all:n,tag:s?.tag||"",klass:s?.klass||"",nodes:to(t)},e)}function _a(e){if(!e)return;const t=(s,n)=>{for(const a of s||[]){if(a.path===e)return!0;if(t(a.children,n+1))return n===0?B.delete(a.path):B.add(a.path),!0}return!1};t(ie,0)}function xa(e,t){if(_e)return;const s=o.rows.find(n=>n.id===t);!s||s.kind||($=t,o.rows.forEach(n=>{n.current=n.id===t}),o.editingId=t,o.draft=s.name,e.setTimeout(()=>{const n=A(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function ht(e,t){const s=o.editingId;if(!s)return;const n=o.rows.find(a=>a.id===s);o.editingId=null,t&&n&&Ws(y("dock:current-type")||"",n.path,o.draft,n.base||n.klass),o.draft="",w(e)}function Sa(e,t){We(e,t,Wn)}function Ca(e,t){We(e,t,Zn)}function Wt(e,t){wn(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const s=e.document;Ln({uid:t},s,e)})}function wa(e,t,s){O===s&&(e.clearTimeout(re),O="",I=""),$=null,ue=!1,Be="";const n=zt(e,t),a=n.find(l=>l.uid!==s)||n[0];a?Ut(e,t,n,a.uid,""):(I="",o.rows=[],o.sections=[],o.pageBuilder=!0,w(e)),e.setTimeout(()=>{A(e.document)&&w(e)},0)}xt("row:removed",({uid:e,parentPath:t,doc:s,win:n})=>{t!==Ve(n)||!A(n.document)||wa(n,s,e)});function Pa(e,t){const s=o.sections?.find(a=>a.row?.id===t),n=s?s.row?.section||s.uid:o.rows.find(a=>a.id===t)?.sectionRoot;if(n){Wt(e,n);return}We(e,t,Gn)}function We(e,t,s){if(y("dock:is-locked"))return;const n=H(),a=o.rows.find(r=>r.id===t);if(!a)return;const l=s(n,a);l!==n&&Q(l)}function W(){N?.dismiss(),N=null}function $a(e,t,s){const n=s.row?.section||s.uid;n&&(N=de(e.document,Ne,{items:[{label:f(e,"html_tree_remove_section"),danger:!0,onPick:()=>{W(),Wt(e,n)}}],x:t.clientX,y:t.clientY,onClose:()=>{N=null}}))}function La(e,t,s){W();const n=o.sections?.find(d=>d.row?.id===s);if(n){$a(e,t,n);return}const a=o.rows.find(d=>d.id===s);if(!a)return;Ze(e,s,o.rows);const l={x:t.clientX,y:t.clientY},r=d=>{d.length&&(N?.dismiss(),N=de(e.document,Ne,{items:d,x:l.x,y:l.y,onClose:()=>{N=null}}))};if(a.kind==="component"){Ea(e,a,r);return}o.canEdit&&r([{label:f(e,"component_make"),onPick:()=>{W(),aa(e,a,{onDone:()=>w(e),onError:d=>{e.alert(d?.status===409?f(e,"component_exists"):f(e,"component_failed"))}})}}])}const pt=(e,t)=>{W(),y("dock:open-template",t)};function Ea(e,t,s){if(!jn(t.src)){s([{label:f(e,"component_open_named",{name:t.name||t.src}),onPick:()=>pt(e,`view:partials/${t.src}`)}]);return}s([{label:f(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const a=Array.isArray(n.items)?n.items:[];s(a.length?a.map(l=>({label:f(e,"component_open_named",{name:l.label}),onPick:()=>pt(e,l.type)})):[{label:f(e,"component_none"),onPick:null}])}).catch(()=>s([{label:f(e,"component_none"),onPick:null}]))}function Ha(e,t,s){if(t.button!==0||y("dock:is-locked")||o.editingId||t.target?.closest?.("button, input"))return;Ce(),V=s,se={x:t.clientX,y:t.clientY},be=t.currentTarget,Te=t.pointerId;const n=l=>Ia(e,l),a=l=>Ma(e,l);Fe=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),Fe=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function Ia(e,t){if(!V||!se)return;const s=t.clientX-se.x,n=t.clientY-se.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{be?.setPointerCapture?.(Te)}catch{}}t.preventDefault();const a=e.document.elementFromPoint(t.clientX,t.clientY),l=a?.closest?.("[data-sve-ht-slot]");if(l){const u=l.getAttribute("data-sve-ht-id");if(u&&u!==V){o.dropId=u,o.dropPlace="inside";return}}const r=a?.closest?.("[data-sve-ht-row]"),d=r?.getAttribute("data-sve-ht-id");if(!d||d===V){o.dropId=null,o.dropPlace=null;return}const g=o.rows.find(u=>u.id===d),h=o.rows.find(u=>u.id===V);if(!g||h&&g.path.startsWith(`${h.path}/`)){o.dropId=null,o.dropPlace=null;return}const i=r.getBoundingClientRect();o.dropId=d,o.dropPlace=Xn(t.clientY-i.top,i.height,!Et(g.tag)&&g.kind!=="component")}function Ma(e,t){const s=V,n=o.dropId,a=o.dropPlace||"after",l=o.dragging;if(Ce(),l&&(_e=!0,e.setTimeout(()=>{_e=!1},0)),!l||y("dock:is-locked")||!s||!n||s===n)return;t?.preventDefault?.();const r=H(),d=Yn(r,ie,s,n,a);d!==r&&Q(d)}function Ce(){try{be?.releasePointerCapture?.(Te)}catch{}Fe?.(),V=null,se=null,be=null,Te=null,o.dragging=!1,o.dropId=null,o.dropPlace=null}function Zt(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function je(e,t){if(t?.kind==="component"){Aa(e,t);return}if(M.callOpen&&(M.callOpen=!1,M.callStore=null,E.forget(),ze(e)),t?.kind!=="antlers"){o.inspect=null;return}const s=t.id;if(t.tag==="else"){o.inspect={key:s,title:f(e,"antlers_condition"),mode:"note",note:f(e,"antlers_else_note")};return}if(t.antlers==="loop"){const n=t.loopKind==="collection",a=K?.id===t.id?K.dir:"",l=t.sortDir||a;o.inspect={key:s,title:f(e,"antlers_loop"),mode:"loop",loopKind:n?"collection":"field",kinds:[{id:"field",label:f(e,"antlers_loop_field")},{id:"collection",label:f(e,"antlers_loop_collection")}],collections:Zt(e),value:t.expr||"",placeholder:f(e,n?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:f(e,"antlers_sort"),dir:l,needsField:l==="asc"||l==="desc",field:t.sortField||"",pickable:!n,placeholder:f(e,n?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:f(e,"antlers_sort_none")},{id:"asc",label:f(e,"antlers_sort_asc")},{id:"desc",label:f(e,"antlers_sort_desc")},{id:"random",label:f(e,"antlers_sort_random")}]},limit:{title:f(e,"antlers_limit"),value:t.limit||"",placeholder:f(e,"antlers_limit_placeholder")},branches:[]};return}o.inspect={key:s,title:f(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:f(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:f(e,"antlers_add_elseif")},{id:"else",label:f(e,"antlers_add_else")}]}}function Aa(e,t){if(!qn(e)){o.inspect=null;return}if(!t.src)return;const s=t.id;if(o.inspect={key:s,title:f(e,"component_props_values"),mode:"note",note:f(e,"code_dock_loading")},Kn()){const n={},a={},l=new Map;for(const[r,d]of Vn(H().slice(t.from,t.to))){const g=Nn(r);g&&(r!==g||!l.has(g))&&l.set(g,d)}for(const[r,d]of l)d.bound?a[r]=d.value:n[r]=d.value;ct!==s&&(ct=s,ae.clear());for(const r of ae)r in a||(a[r]="");o.inspect=null,M.callOpen=!0,M.title=M.title||f(e,"component_props"),M.callTitle=t.klass||t.name||t.src,M.callStore=E.ui,E.ui.canBind=!0,E.ui.dataTitle=f(e,"data_vars_title"),E.ui.exprPlaceholder=f(e,"component_props_expr"),E.ui.onToggleBind=(r,d)=>Da(e,r,d),E.ui.onExpr=(r,d)=>ft(e,r,d),E.ui.onPickData=(r,d)=>y("dock:data-menu",{anchor:d,at:t.from,onPick:g=>ft(e,r,String(g?.var||"").trim())}),E.load(e,{key:`${t.src}::${s}`,src:t.src,params:n,bindings:a,readOnly:y("dock:is-locked")===!0}),E.watch(e,{src:t.src,write:r=>Ra(e,r,a)}),ze(e);return}zn(e,t.src).then(n=>{if(o.inspect?.key===s){if(!n.length){o.inspect={key:s,title:f(e,"component_props_values"),mode:"note",note:f(e,"component_props_values_none")};return}o.inspect={key:s,title:f(e,"component_props_values"),mode:"props",inheritLabel:f(e,"component_props_inherit"),rows:Un(n,H().slice(t.from,t.to))}}})}function Ra(e,t,s={}){const n=o.rows.find(r=>r.id===$);if(n?.kind!=="component"||y("dock:is-locked"))return;let a=H(),l=n.to;for(const[r,d]of Object.entries(t||{})){if(r in s)continue;const g=a.length,h=Xe(a,{from:n.from,to:l},r,d);h!==a&&(l+=h.length-g,a=h)}a!==H()&&(Q(a),w(e))}function Da(e,t,s){s?ae.add(t):ae.delete(t),Gt(e,t,"",s),w(e)}function ft(e,t,s){ae.add(t),Gt(e,t,s,!0),w(e)}function Gt(e,t,s,n){const a=o.rows.find(d=>d.id===$);if(a?.kind!=="component"||y("dock:is-locked"))return;const l=H(),r=Xe(l,a,t,s,{bound:n});r!==l&&Q(r)}function Se(){const e=o.rows.find(t=>t.id===$);return e?.kind==="antlers"&&!y("dock:is-locked")?e:null}function z(e,t){const s=Se();if(!s)return;const n=H(),a=t(n,s);a!==n&&(Q(a),w(e))}function mt(e,t,s,n){const a=o.rows.find(d=>d.id===$);if(a?.kind!=="component"||y("dock:is-locked"))return;const l=H(),r=Xe(l,a,t,s,{bound:n});r!==l&&(Q(r),w(e))}function Ba(e,t){z(e,(s,n)=>n.antlers==="loop"?De(s,n,n.loopKind==="collection"?"collection":"field",t):ra(s,n,t))}function Oa(e,t){const s=Se();if(!s||s.antlers!=="loop")return;const n=s.loopKind==="collection"?"collection":"field";if(t!==n){if(t==="collection"){const a=Zt(e)[0]?.handle;if(!a)return;z(e,(l,r)=>De(l,r,"collection",a));return}z(e,(a,l)=>De(a,l,"field",l.handle||"items"))}}function Fa(e,t){z(e,(s,n)=>ua(s,n,t))}function ja(e,t){if(!e||!t||t.kind==="component"||Et(t.tag))return null;const s=Fn(e,t);if(s<t.openTo)return null;const n=e.lastIndexOf(`
`,s-1)+1;return e.slice(n,s).trim()===""&&n>t.openTo?n-1:s}function Ze(e,t,s){if(_e)return;const n=(s||o.rows).find(a=>a.id===t);n&&($=t,o.rows.forEach(a=>{a.current=a.id===t}),je(e,n),!Ye()&&(y("dock:reveal-html",{from:n.from,to:n.to,caret:ja(H(),n)}),y("dock:tw-follow"),Z({source:J,type:G.SVE_HTML_PICK_FOCUS,path:n.path},e)))}function qa(e,t){if(!t)return"";const s=[],n=(a,l)=>{for(const r of a||[]){const d=l||r.path===e;r.kind==="component"&&r.src===t&&s.push({path:r.path,inside:d}),n(r.children,d)}};return n(ie,!1),(s.find(a=>a.inside)||s[0])?.path||""}function Ka(e,t){if(!t||!A(e.document))return;ue=!1,_a(t),w(e);const s=o.rows.find(n=>n.path===t);s&&(Ze(e,s.id,o.rows),e.setTimeout(()=>{A(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function qe(e){if(ke)return;const t=()=>{o.editingId||o.dragging||(e.clearTimeout(ye),ye=e.setTimeout(()=>{A(e.document)&&w(e)},80))},s=()=>t();ke=xt("dock:html-changed",t),e.document.addEventListener("sve-page-structure",s),Oe=()=>{e.document.removeEventListener("sve-page-structure",s)}}function Va(e){ke?.(),ke=null,Oe?.(),Oe=null,e?.clearTimeout?.(ye),ye=0}function Ge(e){const t=A(e.document);if(Z({source:J,type:G.SVE_HTML_PICK,on:!1},e),Va(e),E.forget(),M.callOpen=!1,M.callStore=null,ze(e),Ce(),W(),Mn(e),$=null,o.inspect=null,o.editingId=null,o.draft="",o.sections=[],o.pageBuilder=!1,O="",e?.clearTimeout?.(re),!t){Ae(e);return}t.remove(),Ke.headerTab==="html_tree"&&Pn(e,null),fn(e),bt(e),Tt(e),Ae(e)}function Ja(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=me,ve(t,It,{title:f(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>Ge(e)))}function Qa(e){qe(e),w(e)}function Na(e){const t=e.document;if(!vn(e,"html_tree"))return;if(A(t)){qe(e),w(e);return}if(!Vt(t))return;ue=!0,B.clear(),gn(e,[me]);const s=t.createElement("div");s.id=me,s.style.cssText=kn,ve(s,It,{title:f(e,"html_tree")}),s.querySelector("[data-sve-close]")?.addEventListener("click",()=>Ge(e)),yn(e,s),bt(e),Tt(e),Ae(e),qe(e),w(e)}function er(e){if(A(e.document)){Ge(e);return}Na(e)}Pt("html-tree:from-preview",({path:e,src:t}={})=>{$t(window,e)||Ka(window,qa(e,t)||e)});Pt("html-tree:arm-pick",e=>{const t=window;return e?(Yt(t,Ue(H())),!0):(A(t.document)||Z({source:J,type:G.SVE_HTML_PICK,on:!1},t),!0)});function tr(){Y.clear(),oe.clear(),le.length=0}export{ha as HTML_TREE_STYLE_ID,Ga as armHtmlTreePrefetch,tr as clearHtmlTreeTemplates,W as closeHtmlTreeMenu,Ge as closeHtmlTreePanel,pa as ensureHtmlTreeStyles,Ja as fillHtmlTreePane,$ as htmlTreeActiveId,A as htmlTreePanel,ye as htmlTreeTimer,ke as htmlTreeUnhook,Na as openHtmlTreePanel,w as renderHtmlTree,Qa as showHtmlTreePane,Va as stopWatchHtmlTreeDock,er as toggleHtmlTreePanel,qe as watchHtmlTreeDock};
