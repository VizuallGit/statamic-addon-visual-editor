const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-D8Xdoe3O.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{_ as we,k as Z,l as bn,p as Rt,o as v,a as g,b as S,s as b,t as x,F as H,w as We,d as V,b4 as Tn,g as P,v as At,b5 as Mt,y,h as f,j as ae,C as _n,i as ot,b6 as mt,b7 as vt,b8 as xn,b9 as Sn,ba as wn,bb as Dt,z as he,ap as Cn,bc as o,u,f as $n,e as Pn,q as G,x as Ln,bd as Ce,be as En,B as ke,c as ge,N as Hn,G as In,aN as st,aq as Ye,am as Rn,aP as Ot,aQ as Bt,af as An,ag as gt,S as $e,V as Pe,O as Mn,aO as Dn,an as On,ao as Bn,bf as kt,bg as Fn,U as at,A as Ft,a8 as Be,J as jt,K as qt,ax as Kt,ay as Le,I as jn,bh as qn,aS as Kn,aT as Nn,aw as Vn,bi as zn,b0 as Un,ae as Nt,aK as Xn,aF as Wn}from"./addon-DrEPUeuC.js";import{M as pe,S as fe}from"./protocol-D3FYhCm9.js";import{D as j,E as Yn,F as rt,G as Zn,t as Gn,I as it,v as Jn,z as Qn,b as Te,l as yt,J as Vt,q as eo,K as lt,L as to,H as zt,M as ct,N as Ut,O as no,h as oo,c as so,Q as ao,R as ro,S as io,T as lo,U as co,V as uo,W as ho,X as po,Y as fo,Z as mo}from"./tw-classes-D_X2AZ2i.js";import{canEditFields as vo,currentSetHandle as go,openFieldsetOverlay as ko}from"./section-fields-z90csfBR.js";import{a as yo}from"./html-pick-align-CK-9iH9_.js";import"./ai-text-icon-B7uCWIwa.js";import"./FieldsetOverlay-DLEYk3Zv.js";const bo={class:"sve-dialog__title"},To={for:"sve-new-section-group"},_o=["value"],xo={for:"sve-new-section-name"},So=["placeholder"],wo={key:1,class:"sve-dialog__note"},Co={class:"sve-dialog__actions"},$o=["disabled"],Po=["disabled"],Lo={__name:"NewSectionPrompt",props:{heading:{type:String,required:!0},groupLabel:{type:String,required:!0},nameLabel:{type:String,required:!0},placeholder:{type:String,default:""},note:{type:String,default:""},groups:{type:Array,required:!0},cancelLabel:{type:String,required:!0},saveLabel:{type:String,required:!0},onOk:{type:Function,required:!0},onClose:{type:Function,required:!0}},setup(e){const t=e,s=Z(""),n=Z(t.groups[0]?.key??""),a=Z(null),i=Z(!1);bn(()=>Rt(()=>a.value?.focus()));function r(){const h=s.value.trim();if(!h||t.groups.length&&!n.value||i.value){a.value?.focus();return}i.value=!0,t.onOk(h,n.value)}function c(h){h.target===h.currentTarget&&t.onClose()}function k(h){h.key==="Enter"?r():h.key==="Escape"&&t.onClose()}return(h,d)=>(v(),g("div",{class:"sve-dialog-overlay",onClick:c},[S("div",{class:"sve-dialog",onClick:d[3]||(d[3]=b(()=>{},["stop"]))},[S("div",bo,x(e.heading),1),e.groups.length?(v(),g(H,{key:0},[S("label",To,x(e.groupLabel),1),We(S("select",{id:"sve-new-section-group","onUpdate:modelValue":d[0]||(d[0]=l=>n.value=l),onKeydown:k},[(v(!0),g(H,null,V(e.groups,l=>(v(),g("option",{key:l.key,value:l.key},x(l.display),9,_o))),128))],544),[[Tn,n.value]])],64)):P("",!0),S("label",xo,x(e.nameLabel),1),We(S("input",{id:"sve-new-section-name",ref_key:"input",ref:a,"onUpdate:modelValue":d[1]||(d[1]=l=>s.value=l),type:"text",placeholder:e.placeholder,onKeydown:k},null,40,So),[[At,s.value]]),e.note?(v(),g("p",wo,x(e.note),1)):P("",!0),S("div",Co,[S("button",{type:"button",class:"is-cancel",disabled:i.value,onClick:d[2]||(d[2]=(...l)=>e.onClose&&e.onClose(...l))},x(e.cancelLabel),9,$o),S("button",{type:"button",class:"is-primary",disabled:i.value,onClick:r},x(e.saveLabel),9,Po)])])]))}},Xt=we(Lo,[["__scopeId","data-v-f3280273"]]),Wt="/!/sve/section-types";async function Eo(e){const t=await e.fetch(Wt,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!t.ok)throw new Error(`section-types ${t.status}`);const s=await t.json(),n=new Map;for(const a of s.types||[])a?.group&&!n.has(a.group)&&n.set(a.group,a.group_display||a.group);return[...n].map(([a,i])=>({key:a,display:i}))}async function Ho(e,{display:t,group:s}){const n=await e.fetch(Wt,{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":ot(e),Accept:"application/json"},credentials:"same-origin",body:JSON.stringify({display:t,group:s})}),a=await n.json().catch(()=>({}));if(!n.ok){const i=new Error(a.error||`section-types ${n.status}`);throw i.reason=a.error,i}return a}async function Io(e,t,s=null){if(!t||typeof mt!="function"||typeof vt!="function")return null;const n=await mt(e,t);if(!n)return null;const a=xn(),i=Sn(e,"page",{handle:t},n?.defaults,a),r=wn(i,n?.new||{},n?.defaults);return vt(e,e.document,s,i,r)?i:null}const bt=700,Ro=17;function Ao(e,t){const s=(t||[]).filter(Boolean);if(!s.length)return;let n=0;const a=()=>{n+=1;const i=Dt(e),r=i?s.some(c=>i.querySelector(`[data-sid="${CSS.escape(c)}"]`)):!0;r&&he({source:fe,type:pe.SVE_ACTIVATE,ids:s},e),(r?!i&&n<6:n<Ro)&&e.setTimeout(a,bt)};e.setTimeout(a,bt)}function Mo(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function Do(e){return new Promise(t=>{let s=!1;const n=i=>{s||(s=!0,a.dismiss(),t(i==="static"||i==="fields"?i:null))},a=ae(e.document,_n,{title:f(e,"section_new_kind"),body:f(e,"section_new_kind_note"),buttons:[{value:"cancel",label:f(e,"cancel"),variant:"ghost"},{value:"static",label:f(e,"section_new_static"),variant:"primary"},{value:"fields",label:f(e,"section_new_with_fields"),variant:"primary"}],onPick:n,onClose:()=>n(null)})})}const Oo=`<section class="[ ] py-800">
    
</section>
`;function Bo(e){if(y("dock:is-locked")===!0)return e.Statamic?.$toast?.error(f(e,"code_dock_locked")),!1;const s=`${String(y("dock:html")||"").replace(/\s+$/,"")}

${Oo}`;return y("dock:set-html",s)!==!0?(e.Statamic?.$toast?.error(f(e,"section_new_failed")),!1):(y("dock:save-now"),e.Statamic?.$toast?.success(f(e,"section_new_template_done")),!0)}const N={id:"",type:"",promise:null};function Yt(e){const t=Mt(e);return t?(N.id===t&&N.promise||(N.id=t,N.type="",N.promise=e.fetch(`/!/sve/entry-blueprint?id=${encodeURIComponent(t)}`,{headers:{Accept:"application/json"},credentials:"same-origin"}).then(s=>s.ok?s.json():null).then(s=>{const n=String(s?.template||"").replace(/^\/+|\/+$/g,"");return N.type=n?`view:${n}`:"",N.type}).catch(()=>"")),N.promise):Promise.resolve("")}function Fo(e){return N.id===Mt(e)?N.type:""}async function jo(e,{display:t}){const s=await Yt(e),n=s.startsWith("view:")?s.slice(5):"";if(!n)throw new Error("no page template");const a=await e.fetch("/!/sve/static-sections",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":ot(e),Accept:"application/json"},credentials:"same-origin",body:JSON.stringify({display:t,template:n})}),i=await a.json().catch(()=>({}));if(!a.ok){const r=new Error(i.error||`static-sections ${a.status}`);throw r.reason=i.error,r}return i}function qo(e,{onDone:t,onError:s,onClose:n}={}){const a=ae(e.document,Xt,{heading:f(e,"static_section_new"),groupLabel:"",nameLabel:f(e,"section_new_name"),placeholder:f(e,"section_new_placeholder"),note:f(e,"static_section_note"),groups:[],cancelLabel:f(e,"cancel"),saveLabel:f(e,"section_new_create"),onClose:n,onOk:i=>{(async()=>{try{const r=await jo(e,{display:i});a.dismiss(),e.Statamic?.$toast?.success(f(e,"section_created",{name:r.section?.display||i})),t?.(r.section||{})}catch(r){a.dismiss(),e.Statamic?.$toast?.error(f(e,r.reason==="bad_name"?"section_new_bad_name":"section_new_failed")),s?.(r)}})()}})}function Ko(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){(async()=>{let i=[];try{i=await Eo(e)}catch(c){n?.(c),e.Statamic?.$toast?.error(f(e,"section_new_failed"));return}if(!i.length){n?.(new Error("no groups")),e.Statamic?.$toast?.error(f(e,"section_new_failed"));return}const r=ae(e.document,Xt,{heading:f(e,"section_new"),groupLabel:f(e,"section_new_group"),nameLabel:f(e,"section_new_name"),placeholder:f(e,"section_new_placeholder"),note:f(e,"section_new_note"),groups:i,cancelLabel:f(e,"cancel"),saveLabel:f(e,"section_new_create"),onClose:a,onOk:(c,k)=>{(async()=>{try{const h=await Ho(e,{display:c,group:k});r.dismiss(),e.Statamic?.$toast?.success(f(e,"section_created",{name:h.section?.display||c})),e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"));const d=await Io(e,h.section?.handle,t);!d&&h.section?.handle&&y("dock:open-template",h.section.handle),s?.({...h,uid:d?._visual_id||""})}catch(h){r.dismiss(),e.Statamic?.$toast?.error(f(e,h.reason==="bad_name"?"section_new_bad_name":"section_new_failed")),n?.(h)}})()}})})()}const No={key:0,class:"sve-ht-inspect"},Vo={class:"sve-ht-inspect__head"},zo={key:0,class:"sve-ht-inspect__note"},Uo={key:2,class:"sve-ht-inspect__props"},Xo={class:"sve-ht-inspect__proplabel"},Wo={key:0},Yo=["value","disabled","onChange"],Zo={value:""},Go=["value"],Jo=["value"],Qo=["value","placeholder","onChange"],es=["title","disabled","onClick"],ts=["title","disabled","onClick"],ns={key:0,class:"sve-ht-inspect__seg"},os=["data-active","disabled","onClick"],ss=["value","disabled"],as={key:0,value:""},rs=["value"],is={key:2,class:"sve-ht-inspect__box"},ls=["value","placeholder","disabled","onKeydown"],cs=["title","disabled"],ds={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},us=["value","disabled"],hs=["value"],ps={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},fs=["value","placeholder","disabled"],ms=["title","disabled"],vs={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},gs=["value","placeholder","disabled"],ks={key:4,class:"sve-ht-inspect__add"},ys=["disabled","onClick"],qe='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',bs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',Ts={__name:"HtmlTreeInspector",setup(e){const t=Z(null);Cn(t,h=>o.onPropHost?.(h||null));const s=Z(null),n=Z(null);function a(h){o.onInspectCommit?.(h.target.value)}function i(h,d,l){!h||!d||(h.value=d,h.focus(),h.setSelectionRange(d.length,d.length),l(d))}function r(h,d){o.onInspectData?.(h.currentTarget,l=>o.onPropValue?.(d.handle,l,!0))}function c(h){o.onInspectData?.(h.currentTarget,d=>i(s.value,d,l=>o.onInspectCommit?.(l)))}function k(h){o.onInspectData?.(h.currentTarget,d=>i(n.value,d,l=>o.onLoopSortField?.(l)))}return(h,d)=>u(o).inspect?(v(),g("div",No,[S("div",Vo,x(u(o).inspect.title),1),u(o).inspect.mode==="note"?(v(),g("div",zo,x(u(o).inspect.note),1)):u(o).inspect.mode==="statamic"?(v(),g("div",{key:1,ref_key:"propHost",ref:t,class:"sve-ht-inspect__form"},null,512)):u(o).inspect.mode==="props"?(v(),g("div",Uo,[(v(!0),g(H,null,V(u(o).inspect.rows,l=>(v(),g("label",{key:l.handle,class:"sve-ht-inspect__prop"},[S("span",Xo,[$n(x(l.label)+" ",1),l.bound?(v(),g("em",Wo,":")):P("",!0)]),S("span",{class:Pn(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":l.type==="select"||l.type==="link"}])},[l.type==="select"&&!l.bound?(v(),g("select",{key:0,value:l.value,disabled:!u(o).canEdit,onChange:m=>u(o).onPropValue?.(l.handle,m.target.value,!1)},[S("option",Zo,x(l.placeholder||u(o).inspect.inheritLabel),1),l.value&&!l.options.includes(l.value)?(v(),g("option",{key:0,value:l.value},x(l.value),9,Go)):P("",!0),(v(!0),g(H,null,V(l.options,m=>(v(),g("option",{key:m,value:m},x(m),9,Jo))),128))],40,Yo)):(v(),g("input",{key:1,type:"text",value:l.value,placeholder:l.placeholder||u(o).inspect.inheritLabel,onChange:m=>u(o).onPropValue?.(l.handle,m.target.value,l.bound)},null,40,Qo)),l.type==="link"?(v(),g("button",{key:2,type:"button","data-sve-ht-data":"",title:u(o).pageTitle,disabled:!u(o).canEdit,onClick:m=>u(o).onPropPage?.(m.currentTarget,l.handle),innerHTML:bs},null,8,es)):P("",!0),S("button",{type:"button","data-sve-ht-data":"",title:u(o).dataTitle,disabled:!u(o).canEdit,onClick:m=>r(m,l),innerHTML:qe},null,8,ts)],2)]))),128))])):(v(),g(H,{key:3},[u(o).inspect.mode==="loop"?(v(),g("div",ns,[(v(!0),g(H,null,V(u(o).inspect.kinds,l=>(v(),g("button",{key:l.id,type:"button","data-active":l.id===u(o).inspect.loopKind?"":void 0,disabled:!u(o).canEdit,onClick:m=>u(o).onLoopKind?.(l.id)},x(l.label),9,os))),128))])):P("",!0),u(o).inspect.mode==="loop"&&u(o).inspect.loopKind==="collection"?(v(),g("select",{key:u(o).inspect.key+":"+u(o).inspect.value,value:u(o).inspect.value,disabled:!u(o).canEdit,onChange:a},[u(o).inspect.value?P("",!0):(v(),g("option",as,x(u(o).inspect.placeholder),1)),(v(!0),g(H,null,V(u(o).inspect.collections,l=>(v(),g("option",{key:l.handle,value:l.handle},x(l.title),9,rs))),128))],40,ss)):(v(),g("div",is,[(v(),g("input",{ref_key:"field",ref:s,key:u(o).inspect.key,type:"text",value:u(o).inspect.value,placeholder:u(o).inspect.placeholder,disabled:!u(o).canEdit,spellcheck:"false",onKeydown:[d[0]||(d[0]=b(()=>{},["stop"])),G(b(a,["prevent"]),["enter"])],onBlur:a},null,40,ls)),S("button",{type:"button","data-sve-ht-data":"",title:u(o).dataTitle,disabled:!u(o).canEdit,innerHTML:qe,onMousedown:d[1]||(d[1]=b(()=>{},["prevent"])),onClick:b(c,["stop","prevent"])},null,40,cs)])),u(o).inspect.sort?(v(),g(H,{key:3},[S("div",ds,x(u(o).inspect.sort.title),1),(v(),g("select",{key:u(o).inspect.key+":dir:"+u(o).inspect.sort.dir,value:u(o).inspect.sort.dir,disabled:!u(o).canEdit,onChange:d[2]||(d[2]=l=>u(o).onLoopSortDir?.(l.target.value))},[(v(!0),g(H,null,V(u(o).inspect.sort.dirs,l=>(v(),g("option",{key:l.id,value:l.id},x(l.label),9,hs))),128))],40,us)),u(o).inspect.sort.needsField?(v(),g("div",ps,[(v(),g("input",{ref_key:"sortField",ref:n,key:u(o).inspect.key+":field",type:"text",value:u(o).inspect.sort.field,placeholder:u(o).inspect.sort.placeholder,disabled:!u(o).canEdit,spellcheck:"false",onKeydown:[d[3]||(d[3]=b(()=>{},["stop"])),d[4]||(d[4]=G(b(l=>u(o).onLoopSortField?.(l.target.value),["prevent"]),["enter"]))],onBlur:d[5]||(d[5]=l=>u(o).onLoopSortField?.(l.target.value))},null,40,fs)),u(o).inspect.sort.pickable?(v(),g("button",{key:0,type:"button","data-sve-ht-data":"",title:u(o).dataTitle,disabled:!u(o).canEdit,innerHTML:qe,onMousedown:d[6]||(d[6]=b(()=>{},["prevent"])),onClick:b(k,["stop","prevent"])},null,40,ms)):P("",!0)])):P("",!0),S("div",vs,x(u(o).inspect.limit.title),1),(v(),g("input",{key:u(o).inspect.key+":limit",type:"number",min:"1",value:u(o).inspect.limit.value,placeholder:u(o).inspect.limit.placeholder,disabled:!u(o).canEdit,onKeydown:[d[7]||(d[7]=b(()=>{},["stop"])),d[8]||(d[8]=G(b(l=>u(o).onLoopLimit?.(l.target.value),["prevent"]),["enter"]))],onBlur:d[9]||(d[9]=l=>u(o).onLoopLimit?.(l.target.value))},null,40,gs))],64)):P("",!0),u(o).inspect.branches?.length?(v(),g("div",ks,[(v(!0),g(H,null,V(u(o).inspect.branches,l=>(v(),g("button",{key:l.id,type:"button",disabled:!u(o).canEdit,onClick:m=>u(o).onAddBranch?.(l.id)},x(l.label),9,ys))),128))])):P("",!0)],64))])):P("",!0)}},_s=we(Ts,[["__scopeId","data-v-26254b75"]]),xs={class:"sve-html-tree"},Ss={class:"sve-pane-bar","data-sve-pane-bar":""},ws={"data-sve-right-title":""},Cs={class:"sve-ht-tools"},$s=["title"],Ps=["placeholder","aria-label","value"],Ls=["aria-label"],Es=["title","aria-label"],Hs={key:1,class:"sve-tree-exit"},Is=["title"],Rs=["title"],As='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',Ms='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',Ds='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',Os={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const t=f(window,"html_tree_search"),s=Mo(window),n=f(window,"section_new"),a=Z(!1);function i(){a.value=!1}async function r(h){if(h)for(let d=0;d<20;d+=1){await Rt(),o.onRefresh?.();const l=o.sections.find(m=>m.uid===h);if(l){o.onSection?.(h),Ao(window,l.ids);return}await new Promise(m=>setTimeout(m,50))}}function c(){a.value||(a.value=!0,(async()=>{if(!(o.sections.length||o.pageBuilder)){Bo(window),i();return}const h=await Do(window);if(!h){i();return}if(h==="static"){qo(window,{onDone:d=>{i(),o.onStaticMade?.(d)},onError:i,onClose:i});return}Ko(window,{afterUid:o.sections.length?o.sections[o.sections.length-1].uid:null,onDone:d=>{i(),r(d?.uid)},onError:i,onClose:i})})())}function k(h){const d=!!o.query;o.query=h,d!==!!h&&o.onQuery?.()}return(h,d)=>(v(),g("div",xs,[S("div",Ss,[S("div",ws,x(e.title),1),d[5]||(d[5]=Ln('<div data-sve-right-actions data-v-89eb3483><button type="button" data-sve-right-pin aria-pressed="false" data-v-89eb3483></button><button type="button" data-sve-close aria-label="Close" data-v-89eb3483><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-89eb3483><path d="M18 6 6 18" data-v-89eb3483></path><path d="m6 6 12 12" data-v-89eb3483></path></svg></button></div>',1))]),S("div",Cs,[S("label",{class:"sve-ht-search",title:u(t)},[S("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:Ms}),S("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:u(t),"aria-label":u(t),value:u(o).query,autocomplete:"off",spellcheck:"false",onInput:d[0]||(d[0]=l=>k(l.target.value)),onKeydown:[d[1]||(d[1]=b(()=>{},["stop"])),d[2]||(d[2]=G(b(l=>k(""),["prevent"]),["escape"]))]},null,40,Ps),u(o).query?(v(),g("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":u(t),innerHTML:Ds,onClick:d[3]||(d[3]=l=>k(""))},null,8,Ls)):P("",!0)],8,$s),u(s)&&(u(o).sections.length||u(o).pageBuilder||u(o).rows.length)?(v(),g("button",{key:0,type:"button",class:"sve-ht-new",title:u(n),"aria-label":u(n),innerHTML:As,onClick:c},null,8,Es)):P("",!0)]),u(j).inSidebar?P("",!0):(v(),Ce(Yn,{key:0})),d[6]||(d[6]=S("div",{"data-sve-html-tree-list":""},null,-1)),En(_s),u(o).exitOpen&&!u(j).inSidebar?(v(),g("div",Hs,[S("span",{class:"sve-tree-exit__name",title:u(o).exitName},x(u(o).exitName),9,Is),S("button",{type:"button",class:"sve-tree-exit__go",title:u(o).exitTitle,onClick:d[4]||(d[4]=l=>u(o).onExit?.())},x(u(o).exitLabel),9,Rs)])):P("",!0)]))}},Zt=we(Os,[["__scopeId","data-v-89eb3483"]]);function Gt(e){return String(e||"").trim().toLowerCase()}function Jt(e,t){return t?[e.name,e.tag,e.klass,e.label,e.src].filter(s=>typeof s=="string"&&s).join(" ").toLowerCase().includes(t):!0}function Bs(e,t){const s=Gt(t);if(!s)return{rows:e,hits:new Set};const n=new Set;for(const r of e)Jt(r,s)&&n.add(r.path);const a=[...n];return{rows:e.filter(r=>n.has(r.path)||a.some(c=>c.startsWith(`${r.path}/`))),hits:n}}const Fs=["title"],js={"data-sve-ht-indent":"","aria-hidden":"true"},qs=["data-sve-ht-cat"],Ks={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},Ns={key:2,"data-sve-ht-letter":""},Vs=["innerHTML"],zs=["title"],Us=["title"],Xs={key:1,"data-sve-ht-kind":""},Ws={key:3,"data-sve-ht-name":""},Ys={key:4,"data-sve-ht-actions":""},Zs=["disabled","title","innerHTML"],Gs=["disabled","title"],Js=["disabled","title"],Qs=["disabled","title"],ea=["data-sve-ht-id"],ta='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',na='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',oa='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',sa='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',aa='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',ra='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',ia={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const t=vo(window),s=f(window,"section_fields");function n(){const d=go();if(!d){window.Statamic?.$toast?.error(f(window,"section_fields_none"));return}ko(window,d)}function a(d){return d.kind==="component"?d.src?`partial:${d.src}`:d.tag:d.name?`${d.tag} ${d.name}`:d.tag}function i(d){return!!d.section}function r(d){return!!d.context}function c(d){if(i(d)){o.onSection?.(d.section);return}if(r(d)){o.onContextRow?.(d.id);return}o.onSelect?.(d.id)}function k(d,l){const m={"data-sve-ht-id":d.id};return d.current&&(m["data-sve-ht-current"]=""),d.hidden&&(m["data-sve-ht-hidden"]=""),m["data-sve-ht-cat"]=d.cat||"other",m["data-sve-ht-depth"]=String(d.depth),l&&(m["data-sve-ht-dim"]=""),r(d)&&(m["data-sve-ht-context"]=d.context),i(d)&&(m["data-sve-ht-sec"]=""),!i(d)&&o.dropId===d.id&&o.dropPlace&&(m["data-sve-ht-drop"]=o.dropPlace),m}function h(d){return!d.hidden||d.wrapFrom!=null}return(d,l)=>(v(),g(H,null,[S("div",ke({"data-sve-ht-row":""},k(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:l[26]||(l[26]=m=>c(e.row)),onDblclick:l[27]||(l[27]=b(m=>i(e.row)||r(e.row)?null:u(o).onRename?.(e.row.id),["prevent"])),onKeydown:[l[28]||(l[28]=G(b(m=>c(e.row),["prevent"]),["enter"])),l[29]||(l[29]=G(b(m=>c(e.row),["prevent"]),["space"]))],onPointerdown:l[30]||(l[30]=m=>i(e.row)||r(e.row)?null:u(o).onPointerDown?.(m,e.row.id)),onContextmenu:l[31]||(l[31]=b(m=>i(e.row)||r(e.row)?null:u(o).onContext?.(m,e.row.id),["prevent","stop"]))}),[S("span",js,[(v(!0),g(H,null,V(e.row.guides||[],(m,$)=>(v(),g("i",{key:$,"data-sve-ht-cat":m},null,8,qs))),128))]),e.row.hasChildren||e.row.emptyBlock?(v(),g("button",ke({key:0,type:"button","data-sve-ht-twist":""},e.row.shut?{"data-sve-ht-shut":""}:{},{innerHTML:na,onClick:l[0]||(l[0]=b(m=>i(e.row)?u(o).onSection?.(e.row.section):u(o).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:l[1]||(l[1]=b(()=>{},["stop"])),onDblclick:l[2]||(l[2]=b(()=>{},["stop"]))}),null,16)):(v(),g("span",Ks)),e.row.letter?(v(),g("span",Ns,x(e.row.letter),1)):(v(),g("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Vs)),S("span",{"data-sve-ht-text":"",title:u(o).renameTitle},[!e.row.kind&&!i(e.row)&&!r(e.row)?(v(),g("button",{key:0,type:"button","data-sve-ht-tag":"",title:u(o).tagTitle,onClick:l[3]||(l[3]=b(()=>{},["stop","prevent"])),onPointerdown:l[4]||(l[4]=b(()=>{},["stop"])),onDblclick:l[5]||(l[5]=b(m=>u(o).onTagChange?.(m,e.row.id),["stop","prevent"]))},x(e.row.tag),41,Us)):(v(),g("span",Xs,x(e.row.tag),1)),u(o).editingId===e.row.id&&!i(e.row)?We((v(),g("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":l[6]||(l[6]=m=>u(o).draft=m),onMousedown:l[7]||(l[7]=b(()=>{},["stop"])),onPointerdown:l[8]||(l[8]=b(()=>{},["stop"])),onClick:l[9]||(l[9]=b(()=>{},["stop"])),onDblclick:l[10]||(l[10]=b(()=>{},["stop"])),onKeydown:[l[11]||(l[11]=b(()=>{},["stop"])),l[12]||(l[12]=G(b(m=>u(o).onRenameCommit?.(),["prevent"]),["enter"])),l[13]||(l[13]=G(b(m=>u(o).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:l[14]||(l[14]=m=>u(o).onRenameCommit?.())},null,544)),[[At,u(o).draft]]):(v(),g("span",Ws,x(e.row.name),1))],8,zs),!i(e.row)&&!r(e.row)?(v(),g("span",Ys,[h(e.row)?(v(),g("button",{key:0,type:"button","data-sve-ht-eye":"",disabled:!u(o).canEdit,title:u(o).canEdit?e.row.hidden?u(o).showTitle:u(o).hideTitle:u(o).lockedTitle,innerHTML:e.row.hidden?sa:oa,onClick:l[15]||(l[15]=b(m=>u(o).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:l[16]||(l[16]=b(()=>{},["stop"])),onDblclick:l[17]||(l[17]=b(()=>{},["stop"]))},null,40,Zs)):P("",!0),u(t)&&e.row.fieldsIcon?(v(),g("button",{key:1,type:"button","data-sve-ht-fields":"",disabled:!u(o).canEdit,title:u(o).canEdit?u(s):u(o).lockedTitle,innerHTML:ta,onClick:b(n,["stop","prevent"]),onPointerdown:l[18]||(l[18]=b(()=>{},["stop"])),onDblclick:l[19]||(l[19]=b(()=>{},["stop"]))},null,40,Gs)):P("",!0),S("button",{type:"button","data-sve-ht-dup":"",disabled:!u(o).canEdit,title:u(o).canEdit?u(o).duplicateTitle:u(o).lockedTitle,innerHTML:aa,onClick:l[20]||(l[20]=b(m=>u(o).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:l[21]||(l[21]=b(()=>{},["stop"])),onDblclick:l[22]||(l[22]=b(()=>{},["stop"]))},null,40,Js),S("button",{type:"button","data-sve-ht-del":"",disabled:!u(o).canEdit,title:u(o).canEdit?u(o).deleteTitle:u(o).lockedTitle,innerHTML:ra,onClick:l[23]||(l[23]=b(m=>u(o).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:l[24]||(l[24]=b(()=>{},["stop"])),onDblclick:l[25]||(l[25]=b(()=>{},["stop"]))},null,40,Qs)])):P("",!0)],16,Fs),e.row.emptyBlock&&!e.row.shut?(v(),g("div",ke({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},u(o).dropId===e.row.id&&u(o).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),x(u(o).slotText),17,ea)):P("",!0)],64))}},Ke=we(ia,[["__scopeId","data-v-e9e0092a"]]),la=["data-sve-ht-look"],ca={key:0,class:"sve-ht-empty"},da={key:1,class:"sve-ht-empty"},ua={key:0,class:"sve-ht-empty"},ha={__name:"HtmlTreeList",setup(e){const t=ge(()=>Gt(o.query)),s=ge(()=>Bs(o.rows,t.value)),n=ge(()=>s.value.rows),a=ge(()=>t.value?o.sections.filter(c=>Jt(c.row,t.value)||c.current&&c.ready&&n.value.length>0):o.sections),i=ge(()=>!!t.value&&!a.value.length&&!n.value.length);function r(c){return!!t.value&&!s.value.hits.has(c.path)}return(c,k)=>(v(),g("div",ke({class:"sve-ht-root","data-sve-ht-look":u(o).look,style:u(o).familyStyle},u(o).dragging?{"data-sve-ht-dragging":""}:{}),[!u(o).rows.length&&!u(o).sections.length?(v(),g("div",ca,x(u(o).emptyText),1)):i.value?(v(),g("div",da,x(u(o).searchEmpty),1)):P("",!0),u(o).sections.length?(v(!0),g(H,{key:2},V(a.value,h=>(v(),g("div",ke({key:h.uid},{ref_for:!0},h.current?{"data-sve-ht-branch":""}:{}),[h.ready?(v(),g(H,{key:0},[(v(!0),g(H,null,V(n.value,d=>(v(),Ce(Ke,{key:d.id,row:d,dim:r(d)},null,8,["row","dim"]))),128)),u(o).rows.length?P("",!0):(v(),g("div",ua,x(u(o).emptyText),1))],64)):(v(),Ce(Ke,{key:1,row:h.row,dim:u(o).inComponent},null,8,["row","dim"]))],16))),128)):u(o).rows.length?(v(!0),g(H,{key:3},V(n.value,h=>(v(),Ce(Ke,{key:h.id,row:h,dim:r(h)},null,8,["row","dim"]))),128)):P("",!0)],16,la))}},Tt=we(ha,[["__scopeId","data-v-c8612f67"]]);let Ne=null;function pa(e){return Ne||(Ne=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{pages:[]}).then(t=>Array.isArray(t.pages)?t.pages:[]).catch(()=>[])),Ne}let Ee=null;function Ve(){Ee?.dismiss(),Ee=null}function fa(e,t,s){Ve();const n=t?.getBoundingClientRect?.(),a={x:n?n.left:0,y:n?n.bottom+4:0};pa(e).then(i=>{const r=i.length?i.map(c=>({label:c.title||c.url,onPick:()=>{Ve(),s(c.url)}})):[{label:f(e,"component_props_pages_none"),onPick:null}];Ve(),Ee=ae(e.document,rt,{items:r,x:a.x,y:a.y,onClose:()=>{Ee=null}})})}const Qt="sve-html-tree-labels";function en(){try{const e=globalThis.localStorage?.getItem(Qt);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function ma(e){try{globalThis.localStorage?.setItem(Qt,JSON.stringify(e))}catch{}}function tn(e){return String(e||"_")}function nn(e){const t=en()[tn(e)];return t&&typeof t=="object"?{...t}:{}}function va(e,t,s){const n=s?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function ga(e,t,s,n){if(!t)return;const a=tn(e),i=en(),r={...i[a]||{}},c=String(s||"").replace(/\s+/g," ").trim(),k=String(n||"").trim();!c||c===k?delete r[t]:r[t]=c,Object.keys(r).length?i[a]=r:delete i[a],ma(i)}const ka=/^@(media|supports|container|layer|scope)\b/i;function ya(e){const t=String(e||""),s=[];let n=0,a=0;for(;n<t.length;){if(t[n]==="{"&&t[n+1]==="{"){const c=t.indexOf("}}",n+2);n=c===-1?t.length:c+2;continue}if(t[n]==="/"&&t[n+1]==="*"){const c=t.indexOf("*/",n+2);n=c===-1?t.length:c+2;continue}if(t[n]==='"'||t[n]==="'"){const c=t[n];for(n+=1;n<t.length&&t[n]!==c;)n+=t[n]==="\\"?2:1;n+=1;continue}if(t[n]!=="{"){n+=1;continue}let i=1,r=n+1;for(;r<t.length&&i>0;){if(t[r]==="{"&&t[r+1]==="{"){const c=t.indexOf("}}",r+2);r=c===-1?t.length:c+2;continue}if(t[r]==="/"&&t[r+1]==="*"){const c=t.indexOf("*/",r+2);r=c===-1?t.length:c+2;continue}if(t[r]==='"'||t[r]==="'"){const c=t[r];for(r+=1;r<t.length&&t[r]!==c;)r+=t[r]==="\\"?2:1;r+=1;continue}t[r]==="{"?i+=1:t[r]==="}"&&(i-=1),r+=1}s.push({selector:t.slice(a,n).trim(),body:t.slice(n+1,r-1),from:a,to:r,text:t.slice(a,r).trim()}),n=r,a=r}return s}function _t(e){const t=String(e||""),s=new Set,n=new Set,a=new Set;for(const i of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const r of i[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))r&&(s.add(r),s.add(r.replace(/([:./%!#()[\],])/g,"\\$1")));for(const i of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))i[2].trim()&&n.add(i[2].trim());for(const i of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))a.add(i[1].toLowerCase());return{classes:s,ids:n,tags:a}}function xt(e,t){const s=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),n=[...s.matchAll(/\.((?:\\.|[\w-])+)/g)].map(r=>r[1]),a=[...s.matchAll(/#((?:\\.|[\w-])+)/g)].map(r=>r[1]);if(n.length||a.length){const r=c=>c.replace(/\\(.)/g,"$1");return n.every(c=>t.classes.has(c)||t.classes.has(r(c)))&&a.every(c=>t.ids.has(r(c)))}const i=[...s.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(r=>r[2].toLowerCase());return i.length>0&&i.every(r=>t.tags.has(r))}function ba(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function Ta(e,t,s){const n=ba(e);if(!n.length)return"keep";const a=n.filter(r=>xt(r,t));return a.length?a.length===n.length&&!n.some(r=>xt(r,s))?"move":"copy":"keep"}function on(e,t,s){const n=String(e||""),a=_t(t),i=_t(s),r=[],c=[];let k=0;for(const h of ya(n)){const d=n.slice(h.from,h.to),l=d.match(/^\s*/)[0];if(k=h.to,ka.test(h.selector)){const $=on(h.body,t,s);$.move.trim()&&r.push(`${h.selector} {
${$.move.trim()}
}`),$.keep.trim()&&c.push(`${l}${h.selector} {
${$.keep.trim()}
}`);continue}const m=h.selector.startsWith("@")?"keep":Ta(h.selector,a,i);if(m==="move"){r.push(h.text);continue}m==="copy"&&r.push(h.text),c.push(d)}return c.push(n.slice(k)),{move:r.join(`

`).trim(),keep:c.join("").replace(/\n{3,}/g,`

`).trim()}}const _a="/!/sve/component";function xa(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let s=null;for(const n of t){if(!n.trim())continue;const a=n.match(/^[ \t]*/)[0].length;s=s===null?a:Math.min(s,a)}return s?t.map(n=>n.slice(s)).join(`
`):t.join(`
`)}function Sa(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function wa(e,t){if(!Gn(e))return"";try{return await(await In(()=>import("./tw-compile-D8Xdoe3O.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(s){return console.error("[sve] component tailwind compile",s),""}}async function Ca(e,t){const s=await e.fetch(_a,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":ot(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!s.ok){const n=new Error(String(s.status));throw n.status=s.status,n}return s.json()}function St(e,t){const{from:s,to:n}=Zn(e,t),a=e.slice(s,n);if(!a.trim())return null;const i=e.slice(0,s)+e.slice(n),r=y("dock:css"),c=on(typeof r=="string"?r:"",a,i);return{html:xa(a),css:c.move,keepCss:c.keep,lead:Sa(a),from:s,to:n}}function $a(e,t,{onDone:s,onError:n}={}){if(y("dock:is-locked")===!0)return;const a=y("dock:html");if(typeof a!="string"||!t)return;const i=St(a,t);if(!i)return;const r=ae(e.document,Hn,{heading:f(e,"component_new"),nameLabel:f(e,"component_name"),placeholder:f(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:f(e,"cancel"),saveLabel:f(e,"component_create"),onOk:c=>{r.dismiss(),(async()=>{try{const k=await wa(e,i.html),h=y("dock:html"),d=typeof h=="string"&&h===a?i:St(h,t);if(!d)return;const l=await Ca(e,{name:c,html:d.html,css:d.css,js:"",tw:k}),m=y("dock:html"),$=m.slice(0,d.from)+d.lead+l.tag+m.slice(d.to);y("dock:set-html",$),d.css.trim()&&y("dock:set-css",d.keepCss),s?.(l)}catch(k){n?.(k)}})()}})}function Pa(e,t,s){const n=String(e||"");if(!t||t.kind!=="antlers")return n;const a=String(s||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?Ia(n,t,a):t.tag==="else"||!a?n:n.slice(0,t.from)+`{{ ${t.tag} ${a} }}`+n.slice(t.openTo)}function Ze(e,t,s,n){return ye(e,t,{kind:s,name:n})}function ye(e,t,s={}){const n=String(e||"");if(!t||t.antlers!=="loop")return n;const a=t.loopKind==="collection"?"collection":"field",i=s.kind??a,r=String(s.name??t.expr??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(r))return n;const c=s.sortDir??t.sortDir??"",k=String(s.sortField??t.sortField??"").trim(),h=String(s.limit??t.limit??"").trim(),d=sn(n,t);if(!d)return n;const l=i===a?t.params:"",m=i==="collection"?La(r,k,c,h,l):Ea(r,k,c,h,l),$=i==="collection"?"collection":r;return n.slice(0,t.from)+m+n.slice(t.openTo,d.from)+`{{ /${$} }}`+n.slice(d.to)}function La(e,t,s,n,a){const i=Ha(a).replace(/\bsort\s*=\s*["'][^"']*["']/g,"").replace(/\blimit\s*=\s*["']?\d+["']?/g,"").replace(/\s+/g," ").trim(),r=[`collection from="${e}"`];return s==="random"?r.push('sort="random"'):t&&r.push(`sort="${t}${s==="desc"?":desc":":asc"}"`),n&&r.push(`limit="${n}"`),i&&r.push(i),`{{ ${r.join(" ")} }}`}function Ea(e,t,s,n,a){const i=String(a||"").split("|").map(c=>c.trim()).filter(c=>c&&!/^from\s*=/.test(c)&&!/^sort\s*:/.test(c)&&!/^reverse$/.test(c)&&!/^shuffle$/.test(c)&&!/^limit\s*:/.test(c)),r=[e,...i];return s==="random"?r.push("shuffle"):t&&(r.push(`sort:${t}`),s==="desc"&&r.push("reverse")),n&&r.push(`limit:${n}`),`{{ ${r.join(" | ")} }}`}function Ha(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function sn(e,t){const n=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return n?{from:t.from+n.index,to:t.from+n.index+n[0].length}:null}function Ia(e,t,s){return ye(e,t,{name:s})}function Ra(e,t,s){const n=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return n;const a=sn(n,t);if(!a)return n;const r=(n.slice(0,a.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],c=s==="else"?"{{ else }}":"{{ elseif true }}";return`${n.slice(0,a.from)}${c}
${r}${n.slice(a.from)}`}const D=to("sve-call-values"),_e=new Set;let wt=null;const Aa="__sve-html-tree-style",O=new Set;let Ge="",ce=!1,ze=null,de=!0,z="",xe=0,an="";const q=new Map,X=new Set;let F="",rn=!1,I=null,He=null,Ie=0,Je=null,Se=[],te=null,be=null,Re=null,Ae=null,Qe=null,Me=!1,ne=null,ee=null;function K(e){return e.getElementById($e)}function Ma(e){An(e,Aa,`
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
      ${gt("light")}
      --sve-ht-pick: rgba(56,88,233,.14);
      --sve-ht-pick-hover: rgba(56,88,233,.22);
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${gt("dark")}
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
  `)}function B(){const e=y("dock:html");return typeof e=="string"?e:""}function ln(e){return!!y("dock:is-open",e)}function me(e,{save:t=!1}={}){return ut()||y("dock:set-html",e)!==!0?!1:(t&&y("dock:save-now"),!0)}function Ct(e){const t=y("dock:component-exit-state")||{};if(o.exitOpen=!!t.open,!t.open){o.onExit=null;return}o.exitName=t.name||"",o.exitLabel=f(e,"component_exit"),o.exitTitle=f(e,t.back?"component_exit_back":"component_exit_close"),o.onExit=()=>{y("dock:exit-component"),C(e)}}function Da(e,t){const s=Kn(e);if(!s||t.type!==s)return"";const n=Nn(t[s]);return n&&Vn(e,n)?.section_type||""}const se=[];let Ue=!1,et=!1;function Xe(e,t){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(t,{timeout:2e3});return}e.setTimeout(t,200)}function Oa(e,t){for(const s of t){const n=s.type;!n||q.has(n)||X.has(n)||se.includes(n)||se.push(n)}st.htmlTreePrefetchArmed&&dt(e)}function Tr(e){st.htmlTreePrefetchArmed=!0,dt(e)}function dt(e){if(Ue||!se.length)return;Ue=!0;const t=()=>{const s=se.shift();if(!s){Ue=!1;return}if(q.has(s)||X.has(s)){Xe(e,t);return}X.add(s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(s)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{typeof n?.html=="string"&&(q.set(s,n.html),et&&(et=!1,C(e)))}).catch(()=>{}).finally(()=>{X.delete(s),Xe(e,t)})};Xe(e,t)}function ut(){return!!F}function Ba(e){const t=new Map,s=Dt(e);if(!s)return t;for(const n of s.querySelectorAll("[data-sid]")){const a=n.getAttribute("data-sid");a&&!t.has(a)&&t.set(a,n.tagName.toLowerCase())}return t}function Fa(e,t){const s=Be(e)||"page_sections";for(const n of jt(t)||[]){const a=qt(n.values),i=a&&typeof a=="object"?a[s]:null;if(Array.isArray(i))return!0}return!1}function cn(e,t){const s=Be(e)||"page_sections",n=Ba(e),a=[];for(const i of jt(t)||[]){const r=qt(i.values),c=r&&typeof r=="object"?r[s]:null;if(Array.isArray(c)){c.forEach(k=>{if(!k||typeof k!="object"||Array.isArray(k)||typeof k.type!="string")return;const h=[k._visual_id,k.id,k._id].filter(w=>typeof w=="string"&&w!=="");if(!h.length)return;const d=Da(e,k)||k.type,l=typeof k._sve_label=="string"?k._sve_label.trim():"",m=h.map(w=>n.get(w)).find(Boolean)||"section",$=nn(k.type)[`0:${m}`];a.push({uid:h[0],ids:h,type:k.type,tag:m,label:(typeof $=="string"&&$.trim()?$.trim():"")||l||Kt(e,d)?.display||Le(d)||d,svg:lt(m,"",null).svg||zt.section,cat:at(m),enabled:k.enabled!==!1})});break}}return a}function ja(e,t,s){if(!s.length)return"";const n=y("dock:current-type")||"",a=y("dock:current-uid"),i=!!y("dock:component-exit-state")?.open;if(a){const r=jn(a,t),c=s.find(k=>k.ids.some(h=>r.includes(h)));if(c&&(i||c.type===n))return c.uid}return s.find(r=>r.type===n)?.uid||""}function qa(e,t,s,n){const a=t.find(w=>w.uid===s),i=y("dock:component-src"),r=y("dock:type-stack")||[];if(!a||!i||!r.length)return null;const c=r.map(w=>w.type).filter(w=>!q.get(w));if(c.length)return Ka(e,c),null;const k=[],h=new Set,d=new Set;let l=w=>k.push(...w),m=null,$=0;for(let w=0;w<r.length;w+=1){const M=w+1<r.length?r[w+1].src:i,J=A=>({...A,id:`ctx${w}:${A.id}`,path:`ctx${w}/${A.path}`,ctxLevel:w,children:A.children.map(J)}),re=Te(q.get(r[w].type)).map(J),ie=[],le=(A,R)=>{for(const E of A){if(E.kind==="component"&&E.src===M)return ie.push(...R,E),E;const ve=le(E.children,[...R,E]);if(ve)return ve}return null};if(m=M?le(re,[]):null,!m)return null;const U=new Set(ie.map(A=>A.id)),L=(A,R)=>{for(const E of A)E.children.length&&(U.has(E.id)?O.has(E.path):hn(E,R))&&h.add(E.id),L(E.children,R+1)};L(re,$),l(re),d.add(m.id),$+=ie.length,l=(A=>R=>{A.children=R})(m)}for(const w of pn(n))h.add(w);return O.has(m.path)&&h.add(m.id),m.children=n,{tree:k,folds:h,hostId:m.id,hostIds:d,levels:r.length,rootId:k.find(w=>!w.kind)?.id||"",label:a.label,svg:a.svg,cat:a.cat}}function Ka(e,t){for(const s of t)!se.includes(s)&&!X.has(s)&&se.push(s);et=!0,dt(e)}const $t="partials/static/";function Na(e,t){const s=e.findIndex(i=>i.kind==="antlers"&&(i.tag===t||i.handle===t)),n=i=>{const r=String(i.src||"");return i.kind!=="component"||!r.startsWith($t)?null:{uid:`static:${r}`,ids:[],type:`view:${r}`,tag:"section",label:Le(r.slice($t.length)),svg:lt("section","",null).svg||zt.section,cat:at("section"),enabled:!0,static:!0}},a=i=>i.map(n).filter(Boolean);return s===-1?{above:[],below:a(e)}:{above:a(e.slice(0,s)),below:a(e.slice(s+1))}}function Va(e,t,s){const n=y("dock:component-exit-state");if(n?.open)return Le(n.name)||n.name||"";if(s)return t.find(i=>i.uid===s)?.label||"";const a=y("dock:current-type")||"";return Kt(e,a)?.display||Le(a)||""}function dn(e,t,s,n,a){const i=s.find(c=>c.uid===n);if(!i||n===a)return;if(O.clear(),I=null,de=!1,ue(),Fe(),z=n,an=B(),F=q.get(i.type)||"",F&&(I=De(Te(F))||null),rn=(y("dock:current-type")||"")===i.type,e.clearTimeout(xe),xe=e.setTimeout(()=>{z="",ce=!1,C(e)},4e3),C(e),i.static){y("dock:open-template",i.type),e.setTimeout(()=>C(e),0);return}const r=()=>Xn(i.uid,t,e,{clampToSection:!0});qn(i.uid,t,e,r),he({source:fe,type:pe.SVE_ACTIVATE,ids:i.ids},e),e.setTimeout(()=>C(e),0)}function un(e,t){if(!t)return!1;for(const s of e||[])if(s.id===t||un(s.children,t))return!0;return!1}function De(e){for(const t of e||[]){if(!t.kind)return t.id;const s=De(t.children);if(s)return s}return""}function hn(e,t){return O.has(e.path)?t===0:t>0}function pn(e){const t=new Set,s=(n,a)=>{for(const i of n)i.children.length&&hn(i,a)&&t.add(i.id),s(i.children,a+1)};return s(e,0),t}function C(e){const t=e.document,n=K(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;Ma(t),Qn(e);const a=B();F&&F===a&&(F="");const i=F||a,r=Te(i);Se=r;const c=y("dock:current-type")||"",k=nn(c),h=Fa(e,t),l=!!(y("dock:component-exit-state")||{}).open,m=h&&!l?Fo(e):"";h&&!l&&!m&&Yt(e).then(p=>{p&&C(e)});const $=!!m&&c===m;m&&!$&&!q.has(m)&&!X.has(m)&&(X.add(m),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(m)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(p=>p.ok?p.json():null).then(p=>{typeof p?.html=="string"&&(q.set(m,p.html),C(e))}).catch(()=>{}).finally(()=>X.delete(m)));const w=m?Na($?r:Te(q.get(m)||""),Be(e)||"page_sections"):{above:[],below:[]},M=[...w.above,...cn(e,t),...w.below];o.onStaticMade=p=>{m&&q.delete(m),p?.type&&(de=!1,y("dock:open-template",p.type)),C(e)},c&&a&&!F&&q.set(c,a),Oa(e,M);const J=ja(e,t,M);if(h&&!M.length){Se=[],o.rows=[],o.sections=[],o.pageBuilder=!0,o.emptyText=f(e,"html_tree_empty"),o.canEdit=!y("dock:is-locked"),o.look=kt(e),o.onRefresh=()=>C(e),o.onSection=null,Ct(e),Pe(n,Tt),Pt(e,[]);return}o.pageBuilder=h;const re=`${c}|${J}`;let ie=!1;re!==Ge&&(Ge=re,O.clear(),ze!==null&&i!==ze?ie=!0:ce=i),(ie||ce!==!1&&i!==ce)&&(ce=!1,O.clear(),I=De(r)||null),ze=i,z&&(z===J||!M.length)&&(rn||i!==an)&&(e.clearTimeout(xe),z="",ce=!1,un(r,I)||(O.clear(),I=De(r)||null));const le=M.some(p=>p.uid===z)?z:"",U=de?"":le||J,L=l?qa(e,M,U,r):null,A=!!(le||J)||$,R=L?yt(L.tree,o.query?new Set:L.folds):$?[]:yt(r,o.query?new Set:pn(r));!i.trim()&&!ln(t)?o.emptyText=f(e,"html_tree_need_dock"):o.emptyText=f(e,"html_tree_empty"),o.slotText=f(e,"antlers_drop_here"),o.dataTitle=f(e,"data_vars_title"),o.pageTitle=f(e,"component_props_page"),o.renameTitle=f(e,"html_tree_rename"),o.tagTitle=f(e,"tw_tag"),o.hideTitle=f(e,"html_tree_hide"),o.showTitle=f(e,"html_tree_show"),o.duplicateTitle=f(e,"html_tree_duplicate"),o.deleteTitle=f(e,"html_tree_delete"),o.lockedTitle=f(e,"html_tree_locked"),o.searchEmpty=f(e,"html_tree_search_empty"),o.canEdit=!y("dock:is-locked"),o.look=kt(e),Fn(e),o.onQuery=()=>C(e),Ct(e),o.inComponent=l,o.onContextRow=p=>{if(!L||p===L.hostId)return;const T=R.find(_=>_.id===p)?.ctxLevel??L.levels-1;y("dock:exit-component",L.levels-T),C(e)},o.onSelect=p=>{const T=R.find(_=>_.id===p);T&&Vt(e,T.path)||pt(e,p,R)},o.onTwist=p=>{const T=R.find(_=>_.id===p)?.path;T&&(O.has(T)?O.delete(T):O.add(T),C(e))},o.onTagChange=(p,T)=>{const _=o.rows.find(W=>W.id===T);_&&!ut()&&eo(e,p.currentTarget,_)},o.onRename=p=>Ua(e,p),o.onRenameCommit=()=>Lt(e,!0),o.onRenameCancel=()=>Lt(e,!1),o.onHide=p=>Xa(e,p),o.onDuplicate=p=>Wa(e,p),o.onDelete=p=>Za(e,p),o.onPointerDown=(p,T)=>er(e,p,T),o.onContext=(p,T)=>Ja(e,p,T),o.onInspectCommit=p=>rr(e,p),o.onPropValue=(p,T,_)=>It(e,p,T,_),o.onPropPage=(p,T)=>fa(e,p,_=>It(e,T,_,!1)),o.onLoopKind=p=>ir(e,p),o.onAddBranch=p=>lr(e,p),o.onLoopSortField=p=>{const T=Oe(),_=String(p||"").trim();if(!T)return;const W=ee?.id===T.id?ee.dir:"",Y=T.sortDir||W||"asc";ee=null,oe(e,(kn,yn)=>ye(kn,yn,{sortField:_,sortDir:Y}))},o.onLoopSortDir=p=>{const T=Oe(),_=String(p||"");if(T){if((_==="asc"||_==="desc")&&!T.sortField){ee={id:T.id,dir:_},tt(e,T);return}ee=null,oe(e,(W,Y)=>ye(W,Y,{sortDir:_,sortField:_==="asc"||_==="desc"?Y.sortField:""}))}},o.onLoopLimit=p=>oe(e,(T,_)=>ye(T,_,{limit:String(p||"").replace(/\D/g,"")})),o.onPropHost=p=>p?D.mount(p):D.unmount(),o.onInspectData=(p,T)=>{y("dock:data-menu",{anchor:p,at:R.find(_=>_.id===I)?.from,onPick:_=>T(String(_?.var||"").trim())})};const E=R.find(p=>!p.kind)?.id,ve=l||$?"":Va(e,M,U),Q=U&&!l?M.find(p=>p.uid===U):null;o.rows=R.map(p=>{const T=lt(p.tag,p.kind,p.antlers),_=!!L&&p.id===L.rootId,W=p.id===E&&ve?ve:_?L.label:p.klass,Y=p.id===E;return{...p,base:W,name:va(W,p.path,k),current:p.id===I,letter:_?"":T.letter||"",svg:Y&&Q?Q.svg:_?L.svg:T.svg||"",cat:_?L.cat:at(p.tag,p.kind,p.antlers),context:L?L.hostIds.has(p.id)?"host":p.id.startsWith("ctx")?"dim":"":"",sectionRoot:Y&&Q&&!Q.static?Q.uid:"",fieldsIcon:!!(Y&&Q&&!Q.static)}});const je=[];for(const p of o.rows)je.length=p.depth,p.guides=je.slice(),je[p.depth]=p.cat;o.sections=A?M.map(p=>{const T=!!U&&p.uid===U;return{...p,current:T,ready:T&&(!le||!!F),row:{id:`sec:${p.uid}`,section:p.uid,tag:p.tag,name:p.label,kind:"",svg:p.svg,cat:p.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:T,hidden:!p.enabled}}}):[],o.onSection=p=>dn(e,t,M,p,U),o.onRefresh=()=>C(e),tt(e,o.rows.find(p=>p.id===I)),Pe(n,Tt),Pt(e,r)}function Pt(e,t){K(e.document)&&fn(e,t)}function fn(e,t){const s=t[0],n=!!y("dock:component-src"),a=n?"":y("dock:current-uid")||"";he({source:fe,type:pe.SVE_HTML_PICK,on:!0,uid:a,all:n,tag:s?.tag||"",klass:s?.klass||"",nodes:yo(t)},e)}function za(e){if(!e)return;const t=(s,n)=>{for(const a of s||[]){if(a.path===e)return!0;if(t(a.children,n+1))return n===0?O.delete(a.path):O.add(a.path),!0}return!1};t(Se,0)}function Ua(e,t){if(Me)return;const s=o.rows.find(n=>n.id===t);!s||s.kind||(I=t,o.rows.forEach(n=>{n.current=n.id===t}),o.editingId=t,o.draft=s.name,e.setTimeout(()=>{const n=K(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function Lt(e,t){const s=o.editingId;if(!s)return;const n=o.rows.find(a=>a.id===s);o.editingId=null,t&&n&&ga(y("dock:current-type")||"",n.path,o.draft,n.base||n.klass),o.draft="",C(e)}function Xa(e,t){ht(e,t,po)}function Wa(e,t){ht(e,t,fo)}function mn(e,t){zn(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const s=e.document;Wn({uid:t},s,e)})}function Ya(e,t,s){z===s&&(e.clearTimeout(xe),z="",F=""),I=null,de=!1,Ge="";const n=cn(e,t),a=n.find(i=>i.uid!==s)||n[0];a?dn(e,t,n,a.uid,""):(F="",o.rows=[],o.sections=[],o.pageBuilder=!0,C(e)),e.setTimeout(()=>{K(e.document)&&C(e)},0)}Ft("row:removed",({uid:e,parentPath:t,doc:s,win:n})=>{t!==Be(n)||!K(n.document)||Ya(n,s,e)});function Za(e,t){const s=o.sections?.find(a=>a.row?.id===t),n=s?s.row?.section||s.uid:o.rows.find(a=>a.id===t)?.sectionRoot;if(n){mn(e,n);return}ht(e,t,mo)}function ht(e,t,s){if(y("dock:is-locked"))return;const n=B(),a=o.rows.find(r=>r.id===t);if(!a)return;const i=s(n,a);i!==n&&me(i)}function ue(){ne?.dismiss(),ne=null}function Ga(e,t,s){const n=s.row?.section||s.uid;n&&(ne=ae(e.document,rt,{items:[{label:f(e,"html_tree_remove_section"),danger:!0,onPick:()=>{ue(),mn(e,n)}}],x:t.clientX,y:t.clientY,onClose:()=>{ne=null}}))}function Ja(e,t,s){ue();const n=o.sections?.find(c=>c.row?.id===s);if(n){Ga(e,t,n);return}const a=o.rows.find(c=>c.id===s);if(!a)return;pt(e,s,o.rows);const i={x:t.clientX,y:t.clientY},r=c=>{c.length&&(ne?.dismiss(),ne=ae(e.document,rt,{items:c,x:i.x,y:i.y,onClose:()=>{ne=null}}))};if(a.kind==="component"){Qa(e,a,r);return}o.canEdit&&r([{label:f(e,"component_make"),onPick:()=>{ue(),$a(e,a,{onDone:()=>C(e),onError:c=>{e.alert(c?.status===409?f(e,"component_exists"):f(e,"component_failed"))}})}}])}const Et=(e,t)=>{ue(),y("dock:open-template",t)};function Qa(e,t,s){if(!oo(t.src)){s([{label:f(e,"component_open_named",{name:t.name||t.src}),onPick:()=>Et(e,`view:partials/${t.src}`)}]);return}s([{label:f(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const a=Array.isArray(n.items)?n.items:[];s(a.length?a.map(i=>({label:f(e,"component_open_named",{name:i.label}),onPick:()=>Et(e,i.type)})):[{label:f(e,"component_none"),onPick:null}])}).catch(()=>s([{label:f(e,"component_none"),onPick:null}]))}function er(e,t,s){if(t.button!==0||y("dock:is-locked")||o.editingId||t.target?.closest?.("button, input"))return;Fe(),te=s,be={x:t.clientX,y:t.clientY},Re=t.currentTarget,Ae=t.pointerId;const n=i=>tr(e,i),a=i=>nr(e,i);Qe=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),Qe=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function tr(e,t){if(!te||!be)return;const s=t.clientX-be.x,n=t.clientY-be.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{Re?.setPointerCapture?.(Ae)}catch{}}t.preventDefault();const a=e.document.elementFromPoint(t.clientX,t.clientY),i=a?.closest?.("[data-sve-ht-slot]");if(i){const l=i.getAttribute("data-sve-ht-id");if(l&&l!==te){o.dropId=l,o.dropPlace="inside";return}}const r=a?.closest?.("[data-sve-ht-row]"),c=r?.getAttribute("data-sve-ht-id");if(!c||c===te){o.dropId=null,o.dropPlace=null;return}const k=o.rows.find(l=>l.id===c),h=o.rows.find(l=>l.id===te);if(!k||k.context||h&&k.path.startsWith(`${h.path}/`)){o.dropId=null,o.dropPlace=null;return}const d=r.getBoundingClientRect();o.dropId=c,o.dropPlace=uo(t.clientY-d.top,d.height,!Ut(k.tag)&&k.kind!=="component")}function nr(e,t){const s=te,n=o.dropId,a=o.dropPlace||"after",i=o.dragging;if(Fe(),i&&(Me=!0,e.setTimeout(()=>{Me=!1},0)),!i||y("dock:is-locked")||!s||!n||s===n)return;t?.preventDefault?.();const r=B(),c=ho(r,Se,s,n,a);c!==r&&me(c)}function Fe(){try{Re?.releasePointerCapture?.(Ae)}catch{}Qe?.(),te=null,be=null,Re=null,Ae=null,o.dragging=!1,o.dropId=null,o.dropPlace=null}function vn(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function tt(e,t){if(t?.kind==="component"){or(e,t);return}if(j.callOpen&&(j.callOpen=!1,j.callStore=null,D.forget(),it(e)),t?.kind!=="antlers"){o.inspect=null;return}const s=t.id;if(t.tag==="else"){o.inspect={key:s,title:f(e,"antlers_condition"),mode:"note",note:f(e,"antlers_else_note")};return}if(t.antlers==="loop"){const n=t.loopKind==="collection",a=ee?.id===t.id?ee.dir:"",i=t.sortDir||a;o.inspect={key:s,title:f(e,"antlers_loop"),mode:"loop",loopKind:n?"collection":"field",kinds:[{id:"field",label:f(e,"antlers_loop_field")},{id:"collection",label:f(e,"antlers_loop_collection")}],collections:vn(e),value:t.expr||"",placeholder:f(e,n?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:f(e,"antlers_sort"),dir:i,needsField:i==="asc"||i==="desc",field:t.sortField||"",pickable:!n,placeholder:f(e,n?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:f(e,"antlers_sort_none")},{id:"asc",label:f(e,"antlers_sort_asc")},{id:"desc",label:f(e,"antlers_sort_desc")},{id:"random",label:f(e,"antlers_sort_random")}]},limit:{title:f(e,"antlers_limit"),value:t.limit||"",placeholder:f(e,"antlers_limit_placeholder")},branches:[]};return}o.inspect={key:s,title:f(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:f(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:f(e,"antlers_add_elseif")},{id:"else",label:f(e,"antlers_add_else")}]}}function or(e,t){if(!so(e)){o.inspect=null;return}if(!t.src)return;const s=t.id;if(o.inspect={key:s,title:f(e,"component_props_values"),mode:"note",note:f(e,"code_dock_loading")},ao()){const n={},a={},i=new Map;for(const[r,c]of ro(B().slice(t.from,t.to))){const k=io(r);k&&(r!==k||!i.has(k))&&i.set(k,c)}for(const[r,c]of i)c.bound?a[r]=c.value:n[r]=c.value;wt!==s&&(wt=s,_e.clear());for(const r of _e)r in a||(a[r]="");o.inspect=null,j.callOpen=!0,j.title=j.title||f(e,"component_props"),j.callTitle=t.klass||t.name||t.src,j.callStore=D.ui,D.ui.canBind=!0,D.ui.dataTitle=f(e,"data_vars_title"),D.ui.exprPlaceholder=f(e,"component_props_expr"),D.ui.onToggleBind=(r,c)=>ar(e,r,c),D.ui.onExpr=(r,c)=>Ht(e,r,c),D.ui.onPickData=(r,c)=>y("dock:data-menu",{anchor:c,at:t.from,onPick:k=>Ht(e,r,String(k?.var||"").trim())}),D.load(e,{key:`${t.src}::${s}`,src:t.src,params:n,bindings:a,readOnly:y("dock:is-locked")===!0}),D.watch(e,{src:t.src,write:r=>sr(e,r,a)}),it(e);return}lo(e,t.src).then(n=>{if(o.inspect?.key===s){if(!n.length){o.inspect={key:s,title:f(e,"component_props_values"),mode:"note",note:f(e,"component_props_values_none")};return}o.inspect={key:s,title:f(e,"component_props_values"),mode:"props",inheritLabel:f(e,"component_props_inherit"),rows:co(n,B().slice(t.from,t.to))}}})}function sr(e,t,s={}){const n=o.rows.find(r=>r.id===I);if(n?.kind!=="component"||y("dock:is-locked"))return;let a=B(),i=n.to;for(const[r,c]of Object.entries(t||{})){if(r in s)continue;const k=a.length,h=ct(a,{from:n.from,to:i},r,c);h!==a&&(i+=h.length-k,a=h)}a!==B()&&(me(a,{save:!0}),C(e))}function ar(e,t,s){s?_e.add(t):_e.delete(t),gn(e,t,"",s),C(e)}function Ht(e,t,s){_e.add(t),gn(e,t,s,!0),C(e)}function gn(e,t,s,n){const a=o.rows.find(c=>c.id===I);if(a?.kind!=="component"||y("dock:is-locked"))return;const i=B(),r=ct(i,a,t,s,{bound:n});r!==i&&me(r,{save:!0})}function Oe(){const e=o.rows.find(t=>t.id===I);return e?.kind==="antlers"&&!y("dock:is-locked")?e:null}function oe(e,t){const s=Oe();if(!s)return;const n=B(),a=t(n,s);a!==n&&(me(a),C(e))}function It(e,t,s,n){const a=o.rows.find(c=>c.id===I);if(a?.kind!=="component"||y("dock:is-locked"))return;const i=B(),r=ct(i,a,t,s,{bound:n});r!==i&&(me(r,{save:!0}),C(e))}function rr(e,t){oe(e,(s,n)=>n.antlers==="loop"?Ze(s,n,n.loopKind==="collection"?"collection":"field",t):Pa(s,n,t))}function ir(e,t){const s=Oe();if(!s||s.antlers!=="loop")return;const n=s.loopKind==="collection"?"collection":"field";if(t!==n){if(t==="collection"){const a=vn(e)[0]?.handle;if(!a)return;oe(e,(i,r)=>Ze(i,r,"collection",a));return}oe(e,(a,i)=>Ze(a,i,"field",i.handle||"items"))}}function lr(e,t){oe(e,(s,n)=>Ra(s,n,t))}function cr(e,t){if(!e||!t||t.kind==="component"||Ut(t.tag))return null;const s=no(e,t);if(s<t.openTo)return null;const n=e.lastIndexOf(`
`,s-1)+1;return e.slice(n,s).trim()===""&&n>t.openTo?n-1:s}function pt(e,t,s){if(Me)return;const n=(s||o.rows).find(a=>a.id===t);n&&(I=t,o.rows.forEach(a=>{a.current=a.id===t}),tt(e,n),!ut()&&(y("dock:reveal-html",{from:n.from,to:n.to,caret:cr(B(),n)}),y("dock:tw-follow"),he({source:fe,type:pe.SVE_HTML_PICK_FOCUS,path:n.path},e)))}function dr(e,t){if(!t)return"";const s=[],n=(a,i)=>{for(const r of a||[]){const c=i||r.path===e;r.kind==="component"&&r.src===t&&s.push({path:r.path,inside:c}),n(r.children,c)}};return n(Se,!1),(s.find(a=>a.inside)||s[0])?.path||""}function ur(e,t){if(!t||!K(e.document))return;de=!1,za(t),C(e);const s=o.rows.find(n=>n.path===t);s&&(pt(e,s.id,o.rows),e.setTimeout(()=>{K(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function nt(e){if(He)return;const t=()=>{o.editingId||o.dragging||(e.clearTimeout(Ie),Ie=e.setTimeout(()=>{K(e.document)&&C(e)},80))},s=()=>t();He=Ft("dock:html-changed",t),e.document.addEventListener("sve-page-structure",s),Je=()=>{e.document.removeEventListener("sve-page-structure",s)}}function hr(e){He?.(),He=null,Je?.(),Je=null,e?.clearTimeout?.(Ie),Ie=0}function ft(e){const t=K(e.document);if(he({source:fe,type:pe.SVE_HTML_PICK,on:!1},e),hr(e),D.forget(),j.callOpen=!1,j.callStore=null,it(e),Fe(),ue(),Jn(e),I=null,o.inspect=null,o.editingId=null,o.draft="",o.sections=[],o.pageBuilder=!1,z="",e?.clearTimeout?.(xe),!t){Ye(e);return}t.remove(),st.headerTab==="html_tree"&&Un(e,null),Rn(e),Ot(e),Bt(e),Ye(e)}function _r(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=$e,Pe(t,Zt,{title:f(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>ft(e)))}function xr(e){nt(e),C(e)}function pr(e){const t=e.document;if(!Mn(e,"html_tree"))return;if(K(t)){nt(e),C(e);return}if(!ln(t))return;de=!0,O.clear(),Dn(e,[$e]);const s=t.createElement("div");s.id=$e,s.style.cssText=On,Pe(s,Zt,{title:f(e,"html_tree")}),s.querySelector("[data-sve-close]")?.addEventListener("click",()=>ft(e)),Bn(e,s),Ot(e),Bt(e),Ye(e),nt(e),C(e)}function Sr(e){if(K(e.document)){ft(e);return}pr(e)}Nt("html-tree:from-preview",({path:e,src:t}={})=>{Vt(window,e)||ur(window,dr(e,t)||e)});Nt("html-tree:arm-pick",e=>{const t=window;return e?(fn(t,Te(B())),!0):(K(t.document)||he({source:fe,type:pe.SVE_HTML_PICK,on:!1},t),!0)});function wr(){q.clear(),X.clear(),se.length=0}export{Aa as HTML_TREE_STYLE_ID,Tr as armHtmlTreePrefetch,wr as clearHtmlTreeTemplates,ue as closeHtmlTreeMenu,ft as closeHtmlTreePanel,Ma as ensureHtmlTreeStyles,_r as fillHtmlTreePane,I as htmlTreeActiveId,K as htmlTreePanel,Ie as htmlTreeTimer,He as htmlTreeUnhook,pr as openHtmlTreePanel,C as renderHtmlTree,xr as showHtmlTreePane,hr as stopWatchHtmlTreeDock,Sr as toggleHtmlTreePanel,nt as watchHtmlTreeDock};
