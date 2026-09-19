const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-D8Xdoe3O.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{_ as Ce,k as Q,l as Tn,p as At,o as v,a as g,b as S,s as b,t as _,w as Ye,F as H,d as D,b4 as xn,v as Mt,g as P,b5 as Dt,y,h as m,j as ce,C as _n,i as Ot,b6 as gt,b7 as kt,b8 as Sn,b9 as wn,ba as Cn,bb as Bt,z as de,ap as $n,bc as o,u as d,f as Pn,e as Ln,q as ee,x as En,bd as re,be as Hn,B as ye,c as J,N as In,G as Rn,aN as it,aq as Ze,am as An,aP as Ft,aQ as jt,af as Mn,ag as yt,S as Pe,V as Le,O as Dn,aO as On,an as Bn,ao as Fn,bf as bt,bg as jn,U as qt,A as Kt,a8 as Be,J as Vt,K as Nt,ax as zt,ay as Ge,I as qn,bh as Kn,aS as Vn,aT as Nn,aw as zn,bi as Un,b0 as Xn,ae as Ut,aK as Wn,aF as Yn}from"./addon-DK4-TkGO.js";import{M as ue,S as he}from"./protocol-D3FYhCm9.js";import{D as j,E as Zn,F as lt,G as Gn,t as Jn,I as ct,v as Qn,z as eo,b as xe,l as Ke,J as Xt,q as to,K as Wt,L as no,H as oo,M as dt,N as Yt,O as so,h as ao,c as ro,Q as io,R as lo,S as co,T as uo,U as ho,V as po,W as fo,X as mo,Y as vo,Z as go}from"./tw-classes-CNX59OEO.js";import{canEditFields as ko,currentSetHandle as yo,openFieldsetOverlay as bo}from"./section-fields-CTDrfNDp.js";import{a as To}from"./html-pick-align-CK-9iH9_.js";import"./ai-text-icon-B7uCWIwa.js";import"./FieldsetOverlay-CkotYKp3.js";const xo={class:"sve-dialog__title"},_o={for:"sve-new-section-group"},So=["value"],wo={for:"sve-new-section-name"},Co=["placeholder"],$o={key:0,class:"sve-dialog__note"},Po={class:"sve-dialog__actions"},Lo=["disabled"],Eo=["disabled"],Ho={__name:"NewSectionPrompt",props:{heading:{type:String,required:!0},groupLabel:{type:String,required:!0},nameLabel:{type:String,required:!0},placeholder:{type:String,default:""},note:{type:String,default:""},groups:{type:Array,required:!0},cancelLabel:{type:String,required:!0},saveLabel:{type:String,required:!0},onOk:{type:Function,required:!0},onClose:{type:Function,required:!0}},setup(e){const t=e,s=Q(""),n=Q(t.groups[0]?.key??""),a=Q(null),i=Q(!1);Tn(()=>At(()=>a.value?.focus()));function r(){const h=s.value.trim();if(!h||!n.value||i.value){a.value?.focus();return}i.value=!0,t.onOk(h,n.value)}function u(h){h.target===h.currentTarget&&t.onClose()}function k(h){h.key==="Enter"?r():h.key==="Escape"&&t.onClose()}return(h,c)=>(v(),g("div",{class:"sve-dialog-overlay",onClick:u},[S("div",{class:"sve-dialog",onClick:c[3]||(c[3]=b(()=>{},["stop"]))},[S("div",xo,_(e.heading),1),S("label",_o,_(e.groupLabel),1),Ye(S("select",{id:"sve-new-section-group","onUpdate:modelValue":c[0]||(c[0]=l=>n.value=l),onKeydown:k},[(v(!0),g(H,null,D(e.groups,l=>(v(),g("option",{key:l.key,value:l.key},_(l.display),9,So))),128))],544),[[xn,n.value]]),S("label",wo,_(e.nameLabel),1),Ye(S("input",{id:"sve-new-section-name",ref_key:"input",ref:a,"onUpdate:modelValue":c[1]||(c[1]=l=>s.value=l),type:"text",placeholder:e.placeholder,onKeydown:k},null,40,Co),[[Mt,s.value]]),e.note?(v(),g("p",$o,_(e.note),1)):P("",!0),S("div",Po,[S("button",{type:"button",class:"is-cancel",disabled:i.value,onClick:c[2]||(c[2]=(...l)=>e.onClose&&e.onClose(...l))},_(e.cancelLabel),9,Lo),S("button",{type:"button",class:"is-primary",disabled:i.value,onClick:r},_(e.saveLabel),9,Eo)])])]))}},Io=Ce(Ho,[["__scopeId","data-v-d21be545"]]),Zt="/!/sve/section-types";async function Ro(e){const t=await e.fetch(Zt,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!t.ok)throw new Error(`section-types ${t.status}`);const s=await t.json(),n=new Map;for(const a of s.types||[])a?.group&&!n.has(a.group)&&n.set(a.group,a.group_display||a.group);return[...n].map(([a,i])=>({key:a,display:i}))}async function Ao(e,{display:t,group:s}){const n=await e.fetch(Zt,{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Ot(e),Accept:"application/json"},credentials:"same-origin",body:JSON.stringify({display:t,group:s})}),a=await n.json().catch(()=>({}));if(!n.ok){const i=new Error(a.error||`section-types ${n.status}`);throw i.reason=a.error,i}return a}async function Mo(e,t,s=null){if(!t||typeof gt!="function"||typeof kt!="function")return null;const n=await gt(e,t);if(!n)return null;const a=Sn(),i=wn(e,"page",{handle:t},n?.defaults,a),r=Cn(i,n?.new||{},n?.defaults);return kt(e,e.document,s,i,r)?i:null}const Tt=700,Do=17;function Oo(e,t){const s=(t||[]).filter(Boolean);if(!s.length)return;let n=0;const a=()=>{n+=1;const i=Bt(e),r=i?s.some(u=>i.querySelector(`[data-sid="${CSS.escape(u)}"]`)):!0;r&&de({source:he,type:ue.SVE_ACTIVATE,ids:s},e),(r?!i&&n<6:n<Do)&&e.setTimeout(a,Tt)};e.setTimeout(a,Tt)}function Bo(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function Fo(e){return new Promise(t=>{let s=!1;const n=i=>{s||(s=!0,a.dismiss(),t(i==="static"||i==="fields"?i:null))},a=ce(e.document,_n,{title:m(e,"section_new_kind"),body:m(e,"section_new_kind_note"),buttons:[{value:"cancel",label:m(e,"cancel"),variant:"ghost"},{value:"static",label:m(e,"section_new_static"),variant:"primary"},{value:"fields",label:m(e,"section_new_with_fields"),variant:"primary"}],onPick:n,onClose:()=>n(null)})})}const jo=`<section class="[ ] py-800">
    
</section>
`;function xt(e){if(y("dock:is-locked")===!0)return e.Statamic?.$toast?.error(m(e,"code_dock_locked")),!1;const s=`${String(y("dock:html")||"").replace(/\s+$/,"")}

${jo}`;return y("dock:set-html",s)!==!0?(e.Statamic?.$toast?.error(m(e,"section_new_failed")),!1):(y("dock:save-now"),e.Statamic?.$toast?.success(m(e,"section_new_template_done")),!0)}const K={id:"",type:"",promise:null};function Gt(e){const t=Dt(e);return t?(K.id===t&&K.promise||(K.id=t,K.type="",K.promise=e.fetch(`/!/sve/entry-blueprint?id=${encodeURIComponent(t)}`,{headers:{Accept:"application/json"},credentials:"same-origin"}).then(s=>s.ok?s.json():null).then(s=>{const n=String(s?.template||"").replace(/^\/+|\/+$/g,"");return K.type=n?`view:${n}`:"",K.type}).catch(()=>"")),K.promise):Promise.resolve("")}function qo(e){return K.id===Dt(e)?K.type:""}async function Jt(e){const t=await Gt(e);if(!t)return!1;if(y("dock:current-type")===t)return!0;if(y("dock:open-template",t)!==!0)return!1;const s=y("dock:load-settled");return s?.then&&await s,y("dock:current-type")===t&&y("dock:load-settled")===null}function Ko(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){(async()=>{let i=[];try{i=await Ro(e)}catch(u){n?.(u),e.Statamic?.$toast?.error(m(e,"section_new_failed"));return}if(!i.length){n?.(new Error("no groups")),e.Statamic?.$toast?.error(m(e,"section_new_failed"));return}const r=ce(e.document,Io,{heading:m(e,"section_new"),groupLabel:m(e,"section_new_group"),nameLabel:m(e,"section_new_name"),placeholder:m(e,"section_new_placeholder"),note:m(e,"section_new_note"),groups:i,cancelLabel:m(e,"cancel"),saveLabel:m(e,"section_new_create"),onClose:a,onOk:(u,k)=>{(async()=>{try{const h=await Ao(e,{display:u,group:k});r.dismiss(),e.Statamic?.$toast?.success(m(e,"section_created",{name:h.section?.display||u})),e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"));const c=await Mo(e,h.section?.handle,t);!c&&h.section?.handle&&y("dock:open-template",h.section.handle),s?.({...h,uid:c?._visual_id||""})}catch(h){r.dismiss(),e.Statamic?.$toast?.error(m(e,h.reason==="bad_name"?"section_new_bad_name":"section_new_failed")),n?.(h)}})()}})})()}const Vo={key:0,class:"sve-ht-inspect"},No={class:"sve-ht-inspect__head"},zo={key:0,class:"sve-ht-inspect__note"},Uo={key:2,class:"sve-ht-inspect__props"},Xo={class:"sve-ht-inspect__proplabel"},Wo={key:0},Yo=["value","disabled","onChange"],Zo={value:""},Go=["value"],Jo=["value"],Qo=["value","placeholder","onChange"],es=["title","disabled","onClick"],ts=["title","disabled","onClick"],ns={key:0,class:"sve-ht-inspect__seg"},os=["data-active","disabled","onClick"],ss=["value","disabled"],as={key:0,value:""},rs=["value"],is={key:2,class:"sve-ht-inspect__box"},ls=["value","placeholder","disabled","onKeydown"],cs=["title","disabled"],ds={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},us=["value","disabled"],hs=["value"],ps={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},fs=["value","placeholder","disabled"],ms=["title","disabled"],vs={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},gs=["value","placeholder","disabled"],ks={key:4,class:"sve-ht-inspect__add"},ys=["disabled","onClick"],Ve='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',bs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',Ts={__name:"HtmlTreeInspector",setup(e){const t=Q(null);$n(t,h=>o.onPropHost?.(h||null));const s=Q(null),n=Q(null);function a(h){o.onInspectCommit?.(h.target.value)}function i(h,c,l){!h||!c||(h.value=c,h.focus(),h.setSelectionRange(c.length,c.length),l(c))}function r(h,c){o.onInspectData?.(h.currentTarget,l=>o.onPropValue?.(c.handle,l,!0))}function u(h){o.onInspectData?.(h.currentTarget,c=>i(s.value,c,l=>o.onInspectCommit?.(l)))}function k(h){o.onInspectData?.(h.currentTarget,c=>i(n.value,c,l=>o.onLoopSortField?.(l)))}return(h,c)=>d(o).inspect?(v(),g("div",Vo,[S("div",No,_(d(o).inspect.title),1),d(o).inspect.mode==="note"?(v(),g("div",zo,_(d(o).inspect.note),1)):d(o).inspect.mode==="statamic"?(v(),g("div",{key:1,ref_key:"propHost",ref:t,class:"sve-ht-inspect__form"},null,512)):d(o).inspect.mode==="props"?(v(),g("div",Uo,[(v(!0),g(H,null,D(d(o).inspect.rows,l=>(v(),g("label",{key:l.handle,class:"sve-ht-inspect__prop"},[S("span",Xo,[Pn(_(l.label)+" ",1),l.bound?(v(),g("em",Wo,":")):P("",!0)]),S("span",{class:Ln(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":l.type==="select"||l.type==="link"}])},[l.type==="select"&&!l.bound?(v(),g("select",{key:0,value:l.value,disabled:!d(o).canEdit,onChange:f=>d(o).onPropValue?.(l.handle,f.target.value,!1)},[S("option",Zo,_(l.placeholder||d(o).inspect.inheritLabel),1),l.value&&!l.options.includes(l.value)?(v(),g("option",{key:0,value:l.value},_(l.value),9,Go)):P("",!0),(v(!0),g(H,null,D(l.options,f=>(v(),g("option",{key:f,value:f},_(f),9,Jo))),128))],40,Yo)):(v(),g("input",{key:1,type:"text",value:l.value,placeholder:l.placeholder||d(o).inspect.inheritLabel,onChange:f=>d(o).onPropValue?.(l.handle,f.target.value,l.bound)},null,40,Qo)),l.type==="link"?(v(),g("button",{key:2,type:"button","data-sve-ht-data":"",title:d(o).pageTitle,disabled:!d(o).canEdit,onClick:f=>d(o).onPropPage?.(f.currentTarget,l.handle),innerHTML:bs},null,8,es)):P("",!0),S("button",{type:"button","data-sve-ht-data":"",title:d(o).dataTitle,disabled:!d(o).canEdit,onClick:f=>r(f,l),innerHTML:Ve},null,8,ts)],2)]))),128))])):(v(),g(H,{key:3},[d(o).inspect.mode==="loop"?(v(),g("div",ns,[(v(!0),g(H,null,D(d(o).inspect.kinds,l=>(v(),g("button",{key:l.id,type:"button","data-active":l.id===d(o).inspect.loopKind?"":void 0,disabled:!d(o).canEdit,onClick:f=>d(o).onLoopKind?.(l.id)},_(l.label),9,os))),128))])):P("",!0),d(o).inspect.mode==="loop"&&d(o).inspect.loopKind==="collection"?(v(),g("select",{key:d(o).inspect.key+":"+d(o).inspect.value,value:d(o).inspect.value,disabled:!d(o).canEdit,onChange:a},[d(o).inspect.value?P("",!0):(v(),g("option",as,_(d(o).inspect.placeholder),1)),(v(!0),g(H,null,D(d(o).inspect.collections,l=>(v(),g("option",{key:l.handle,value:l.handle},_(l.title),9,rs))),128))],40,ss)):(v(),g("div",is,[(v(),g("input",{ref_key:"field",ref:s,key:d(o).inspect.key,type:"text",value:d(o).inspect.value,placeholder:d(o).inspect.placeholder,disabled:!d(o).canEdit,spellcheck:"false",onKeydown:[c[0]||(c[0]=b(()=>{},["stop"])),ee(b(a,["prevent"]),["enter"])],onBlur:a},null,40,ls)),S("button",{type:"button","data-sve-ht-data":"",title:d(o).dataTitle,disabled:!d(o).canEdit,innerHTML:Ve,onMousedown:c[1]||(c[1]=b(()=>{},["prevent"])),onClick:b(u,["stop","prevent"])},null,40,cs)])),d(o).inspect.sort?(v(),g(H,{key:3},[S("div",ds,_(d(o).inspect.sort.title),1),(v(),g("select",{key:d(o).inspect.key+":dir:"+d(o).inspect.sort.dir,value:d(o).inspect.sort.dir,disabled:!d(o).canEdit,onChange:c[2]||(c[2]=l=>d(o).onLoopSortDir?.(l.target.value))},[(v(!0),g(H,null,D(d(o).inspect.sort.dirs,l=>(v(),g("option",{key:l.id,value:l.id},_(l.label),9,hs))),128))],40,us)),d(o).inspect.sort.needsField?(v(),g("div",ps,[(v(),g("input",{ref_key:"sortField",ref:n,key:d(o).inspect.key+":field",type:"text",value:d(o).inspect.sort.field,placeholder:d(o).inspect.sort.placeholder,disabled:!d(o).canEdit,spellcheck:"false",onKeydown:[c[3]||(c[3]=b(()=>{},["stop"])),c[4]||(c[4]=ee(b(l=>d(o).onLoopSortField?.(l.target.value),["prevent"]),["enter"]))],onBlur:c[5]||(c[5]=l=>d(o).onLoopSortField?.(l.target.value))},null,40,fs)),d(o).inspect.sort.pickable?(v(),g("button",{key:0,type:"button","data-sve-ht-data":"",title:d(o).dataTitle,disabled:!d(o).canEdit,innerHTML:Ve,onMousedown:c[6]||(c[6]=b(()=>{},["prevent"])),onClick:b(k,["stop","prevent"])},null,40,ms)):P("",!0)])):P("",!0),S("div",vs,_(d(o).inspect.limit.title),1),(v(),g("input",{key:d(o).inspect.key+":limit",type:"number",min:"1",value:d(o).inspect.limit.value,placeholder:d(o).inspect.limit.placeholder,disabled:!d(o).canEdit,onKeydown:[c[7]||(c[7]=b(()=>{},["stop"])),c[8]||(c[8]=ee(b(l=>d(o).onLoopLimit?.(l.target.value),["prevent"]),["enter"]))],onBlur:c[9]||(c[9]=l=>d(o).onLoopLimit?.(l.target.value))},null,40,gs))],64)):P("",!0),d(o).inspect.branches?.length?(v(),g("div",ks,[(v(!0),g(H,null,D(d(o).inspect.branches,l=>(v(),g("button",{key:l.id,type:"button",disabled:!d(o).canEdit,onClick:f=>d(o).onAddBranch?.(l.id)},_(l.label),9,ys))),128))])):P("",!0)],64))])):P("",!0)}},xs=Ce(Ts,[["__scopeId","data-v-26254b75"]]),_s={class:"sve-html-tree"},Ss={class:"sve-pane-bar","data-sve-pane-bar":""},ws={"data-sve-right-title":""},Cs={class:"sve-ht-tools"},$s=["title"],Ps=["placeholder","aria-label","value"],Ls=["aria-label"],Es=["title","aria-label"],Hs={key:1,class:"sve-tree-exit"},Is=["title"],Rs=["title"],As='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',Ms='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',Ds='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',Os={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const t=m(window,"html_tree_search"),s=Bo(window),n=m(window,"section_new"),a=Q(!1);function i(){a.value=!1}async function r(h){if(h)for(let c=0;c<20;c+=1){await At(),o.onRefresh?.();const l=o.sections.find(f=>f.uid===h);if(l){o.onSection?.(h),Oo(window,l.ids);return}await new Promise(f=>setTimeout(f,50))}}function u(){a.value||(a.value=!0,(async()=>{if(!(o.sections.length||o.pageBuilder)){xt(window),i();return}const h=await Fo(window);if(!h){i();return}if(h==="static"){await Jt(window)?xt(window):window.Statamic?.$toast?.error(m(window,"section_new_failed")),i();return}Ko(window,{afterUid:o.sections.length?o.sections[o.sections.length-1].uid:null,onDone:c=>{i(),r(c?.uid)},onError:i,onClose:i})})())}function k(h){const c=!!o.query;o.query=h,c!==!!h&&o.onQuery?.()}return(h,c)=>(v(),g("div",_s,[S("div",Ss,[S("div",ws,_(e.title),1),c[5]||(c[5]=En('<div data-sve-right-actions data-v-ab879dbf><button type="button" data-sve-right-pin aria-pressed="false" data-v-ab879dbf></button><button type="button" data-sve-close aria-label="Close" data-v-ab879dbf><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-ab879dbf><path d="M18 6 6 18" data-v-ab879dbf></path><path d="m6 6 12 12" data-v-ab879dbf></path></svg></button></div>',1))]),S("div",Cs,[S("label",{class:"sve-ht-search",title:d(t)},[S("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:Ms}),S("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:d(t),"aria-label":d(t),value:d(o).query,autocomplete:"off",spellcheck:"false",onInput:c[0]||(c[0]=l=>k(l.target.value)),onKeydown:[c[1]||(c[1]=b(()=>{},["stop"])),c[2]||(c[2]=ee(b(l=>k(""),["prevent"]),["escape"]))]},null,40,Ps),d(o).query?(v(),g("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":d(t),innerHTML:Ds,onClick:c[3]||(c[3]=l=>k(""))},null,8,Ls)):P("",!0)],8,$s),d(s)&&(d(o).sections.length||d(o).pageBuilder||d(o).rows.length)?(v(),g("button",{key:0,type:"button",class:"sve-ht-new",title:d(n),"aria-label":d(n),innerHTML:As,onClick:u},null,8,Es)):P("",!0)]),d(j).inSidebar?P("",!0):(v(),re(Zn,{key:0})),c[6]||(c[6]=S("div",{"data-sve-html-tree-list":""},null,-1)),Hn(xs),d(o).exitOpen&&!d(j).inSidebar?(v(),g("div",Hs,[S("span",{class:"sve-tree-exit__name",title:d(o).exitName},_(d(o).exitName),9,Is),S("button",{type:"button",class:"sve-tree-exit__go",title:d(o).exitTitle,onClick:c[4]||(c[4]=l=>d(o).onExit?.())},_(d(o).exitLabel),9,Rs)])):P("",!0)]))}},Qt=Ce(Os,[["__scopeId","data-v-ab879dbf"]]);function en(e){return String(e||"").trim().toLowerCase()}function tn(e,t){return t?[e.name,e.tag,e.klass,e.label,e.src].filter(s=>typeof s=="string"&&s).join(" ").toLowerCase().includes(t):!0}function Bs(e,t){const s=en(t);if(!s)return{rows:e,hits:new Set};const n=new Set;for(const r of e)tn(r,s)&&n.add(r.path);const a=[...n];return{rows:e.filter(r=>n.has(r.path)||a.some(u=>u.startsWith(`${r.path}/`))),hits:n}}const Fs=["title"],js={"data-sve-ht-indent":"","aria-hidden":"true"},qs=["data-sve-ht-cat"],Ks={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},Vs={key:2,"data-sve-ht-letter":""},Ns=["innerHTML"],zs=["title"],Us=["title"],Xs={key:1,"data-sve-ht-kind":""},Ws={key:3,"data-sve-ht-name":""},Ys={key:4,"data-sve-ht-actions":""},Zs=["disabled","title","innerHTML"],Gs=["disabled","title"],Js=["disabled","title"],Qs=["disabled","title"],ea=["data-sve-ht-id"],ta='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',na='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',oa='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',sa='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',aa='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',ra='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',ia={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const t=ko(window),s=m(window,"section_fields");function n(){const c=yo();if(!c){window.Statamic?.$toast?.error(m(window,"section_fields_none"));return}bo(window,c)}function a(c){return c.kind==="component"?c.src?`partial:${c.src}`:c.tag:c.name?`${c.tag} ${c.name}`:c.tag}function i(c){return!!c.section}function r(c){return!!c.context}function u(c){if(i(c)){o.onSection?.(c.section);return}if(r(c)){o.onContextRow?.(c.id);return}o.onSelect?.(c.id)}function k(c,l){const f={"data-sve-ht-id":c.id};return c.current&&(f["data-sve-ht-current"]=""),c.hidden&&(f["data-sve-ht-hidden"]=""),f["data-sve-ht-cat"]=c.cat||"other",f["data-sve-ht-depth"]=String(c.depth),l&&(f["data-sve-ht-dim"]=""),r(c)&&(f["data-sve-ht-context"]=c.context),i(c)&&(f["data-sve-ht-sec"]=""),!i(c)&&o.dropId===c.id&&o.dropPlace&&(f["data-sve-ht-drop"]=o.dropPlace),f}function h(c){return!c.hidden||c.wrapFrom!=null}return(c,l)=>(v(),g(H,null,[S("div",ye({"data-sve-ht-row":""},k(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:l[26]||(l[26]=f=>u(e.row)),onDblclick:l[27]||(l[27]=b(f=>i(e.row)||r(e.row)?null:d(o).onRename?.(e.row.id),["prevent"])),onKeydown:[l[28]||(l[28]=ee(b(f=>u(e.row),["prevent"]),["enter"])),l[29]||(l[29]=ee(b(f=>u(e.row),["prevent"]),["space"]))],onPointerdown:l[30]||(l[30]=f=>i(e.row)||r(e.row)?null:d(o).onPointerDown?.(f,e.row.id)),onContextmenu:l[31]||(l[31]=b(f=>i(e.row)||r(e.row)?null:d(o).onContext?.(f,e.row.id),["prevent","stop"]))}),[S("span",js,[(v(!0),g(H,null,D(e.row.guides||[],(f,$)=>(v(),g("i",{key:$,"data-sve-ht-cat":f},null,8,qs))),128))]),e.row.hasChildren||e.row.emptyBlock?(v(),g("button",ye({key:0,type:"button","data-sve-ht-twist":""},e.row.shut?{"data-sve-ht-shut":""}:{},{innerHTML:na,onClick:l[0]||(l[0]=b(f=>i(e.row)?d(o).onSection?.(e.row.section):d(o).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:l[1]||(l[1]=b(()=>{},["stop"])),onDblclick:l[2]||(l[2]=b(()=>{},["stop"]))}),null,16)):(v(),g("span",Ks)),e.row.letter?(v(),g("span",Vs,_(e.row.letter),1)):(v(),g("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Ns)),S("span",{"data-sve-ht-text":"",title:d(o).renameTitle},[!e.row.kind&&!i(e.row)&&!r(e.row)?(v(),g("button",{key:0,type:"button","data-sve-ht-tag":"",title:d(o).tagTitle,onClick:l[3]||(l[3]=b(()=>{},["stop","prevent"])),onPointerdown:l[4]||(l[4]=b(()=>{},["stop"])),onDblclick:l[5]||(l[5]=b(f=>d(o).onTagChange?.(f,e.row.id),["stop","prevent"]))},_(e.row.tag),41,Us)):(v(),g("span",Xs,_(e.row.tag),1)),d(o).editingId===e.row.id&&!i(e.row)?Ye((v(),g("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":l[6]||(l[6]=f=>d(o).draft=f),onMousedown:l[7]||(l[7]=b(()=>{},["stop"])),onPointerdown:l[8]||(l[8]=b(()=>{},["stop"])),onClick:l[9]||(l[9]=b(()=>{},["stop"])),onDblclick:l[10]||(l[10]=b(()=>{},["stop"])),onKeydown:[l[11]||(l[11]=b(()=>{},["stop"])),l[12]||(l[12]=ee(b(f=>d(o).onRenameCommit?.(),["prevent"]),["enter"])),l[13]||(l[13]=ee(b(f=>d(o).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:l[14]||(l[14]=f=>d(o).onRenameCommit?.())},null,544)),[[Mt,d(o).draft]]):(v(),g("span",Ws,_(e.row.name),1))],8,zs),!i(e.row)&&!r(e.row)?(v(),g("span",Ys,[h(e.row)?(v(),g("button",{key:0,type:"button","data-sve-ht-eye":"",disabled:!d(o).canEdit,title:d(o).canEdit?e.row.hidden?d(o).showTitle:d(o).hideTitle:d(o).lockedTitle,innerHTML:e.row.hidden?sa:oa,onClick:l[15]||(l[15]=b(f=>d(o).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:l[16]||(l[16]=b(()=>{},["stop"])),onDblclick:l[17]||(l[17]=b(()=>{},["stop"]))},null,40,Zs)):P("",!0),d(t)&&e.row.fieldsIcon?(v(),g("button",{key:1,type:"button","data-sve-ht-fields":"",disabled:!d(o).canEdit,title:d(o).canEdit?d(s):d(o).lockedTitle,innerHTML:ta,onClick:b(n,["stop","prevent"]),onPointerdown:l[18]||(l[18]=b(()=>{},["stop"])),onDblclick:l[19]||(l[19]=b(()=>{},["stop"]))},null,40,Gs)):P("",!0),S("button",{type:"button","data-sve-ht-dup":"",disabled:!d(o).canEdit,title:d(o).canEdit?d(o).duplicateTitle:d(o).lockedTitle,innerHTML:aa,onClick:l[20]||(l[20]=b(f=>d(o).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:l[21]||(l[21]=b(()=>{},["stop"])),onDblclick:l[22]||(l[22]=b(()=>{},["stop"]))},null,40,Js),S("button",{type:"button","data-sve-ht-del":"",disabled:!d(o).canEdit,title:d(o).canEdit?d(o).deleteTitle:d(o).lockedTitle,innerHTML:ra,onClick:l[23]||(l[23]=b(f=>d(o).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:l[24]||(l[24]=b(()=>{},["stop"])),onDblclick:l[25]||(l[25]=b(()=>{},["stop"]))},null,40,Qs)])):P("",!0)],16,Fs),e.row.emptyBlock&&!e.row.shut?(v(),g("div",ye({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},d(o).dropId===e.row.id&&d(o).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),_(d(o).slotText),17,ea)):P("",!0)],64))}},ge=Ce(ia,[["__scopeId","data-v-e9e0092a"]]),la=["data-sve-ht-look"],ca={key:0,class:"sve-ht-empty"},da={key:1,class:"sve-ht-empty"},ua={key:0,class:"sve-ht-empty"},ha={__name:"HtmlTreeList",setup(e){const t=J(()=>en(o.query)),s=J(()=>Bs(o.rows,t.value)),n=J(()=>s.value.rows),a=J(()=>t.value?o.sections.filter(c=>tn(c.row,t.value)||c.current&&c.ready&&n.value.length>0):o.sections),i=J(()=>!!t.value&&!a.value.length&&!n.value.length);function r(c){return!!t.value&&!s.value.hits.has(c.path)}const u=J(()=>n.value.filter(c=>c.staticSide==="above")),k=J(()=>n.value.filter(c=>c.staticSide==="below")),h=J(()=>n.value.filter(c=>!c.staticSide));return(c,l)=>(v(),g("div",ye({class:"sve-ht-root","data-sve-ht-look":d(o).look,style:d(o).familyStyle},d(o).dragging?{"data-sve-ht-dragging":""}:{}),[!d(o).rows.length&&!d(o).sections.length?(v(),g("div",ca,_(d(o).emptyText),1)):i.value?(v(),g("div",da,_(d(o).searchEmpty),1)):P("",!0),d(o).sections.length?(v(),g(H,{key:2},[(v(!0),g(H,null,D(u.value,f=>(v(),re(ge,{key:f.id,row:f,dim:r(f)},null,8,["row","dim"]))),128)),(v(!0),g(H,null,D(a.value,f=>(v(),g("div",ye({key:f.uid},{ref_for:!0},f.current?{"data-sve-ht-branch":""}:{}),[f.ready?(v(),g(H,{key:0},[(v(!0),g(H,null,D(h.value,$=>(v(),re(ge,{key:$.id,row:$,dim:r($)},null,8,["row","dim"]))),128)),h.value.length?P("",!0):(v(),g("div",ua,_(d(o).emptyText),1))],64)):(v(),re(ge,{key:1,row:f.row,dim:d(o).inComponent},null,8,["row","dim"]))],16))),128)),(v(!0),g(H,null,D(k.value,f=>(v(),re(ge,{key:f.id,row:f,dim:r(f)},null,8,["row","dim"]))),128))],64)):d(o).rows.length?(v(!0),g(H,{key:3},D(n.value,f=>(v(),re(ge,{key:f.id,row:f,dim:r(f)},null,8,["row","dim"]))),128)):P("",!0)],16,la))}},_t=Ce(ha,[["__scopeId","data-v-9577cc02"]]);let Ne=null;function pa(e){return Ne||(Ne=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{pages:[]}).then(t=>Array.isArray(t.pages)?t.pages:[]).catch(()=>[])),Ne}let Ee=null;function ze(){Ee?.dismiss(),Ee=null}function fa(e,t,s){ze();const n=t?.getBoundingClientRect?.(),a={x:n?n.left:0,y:n?n.bottom+4:0};pa(e).then(i=>{const r=i.length?i.map(u=>({label:u.title||u.url,onPick:()=>{ze(),s(u.url)}})):[{label:m(e,"component_props_pages_none"),onPick:null}];ze(),Ee=ce(e.document,lt,{items:r,x:a.x,y:a.y,onClose:()=>{Ee=null}})})}const nn="sve-html-tree-labels";function on(){try{const e=globalThis.localStorage?.getItem(nn);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function ma(e){try{globalThis.localStorage?.setItem(nn,JSON.stringify(e))}catch{}}function sn(e){return String(e||"_")}function an(e){const t=on()[sn(e)];return t&&typeof t=="object"?{...t}:{}}function va(e,t,s){const n=s?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function ga(e,t,s,n){if(!t)return;const a=sn(e),i=on(),r={...i[a]||{}},u=String(s||"").replace(/\s+/g," ").trim(),k=String(n||"").trim();!u||u===k?delete r[t]:r[t]=u,Object.keys(r).length?i[a]=r:delete i[a],ma(i)}const ka=/^@(media|supports|container|layer|scope)\b/i;function ya(e){const t=String(e||""),s=[];let n=0,a=0;for(;n<t.length;){if(t[n]==="{"&&t[n+1]==="{"){const u=t.indexOf("}}",n+2);n=u===-1?t.length:u+2;continue}if(t[n]==="/"&&t[n+1]==="*"){const u=t.indexOf("*/",n+2);n=u===-1?t.length:u+2;continue}if(t[n]==='"'||t[n]==="'"){const u=t[n];for(n+=1;n<t.length&&t[n]!==u;)n+=t[n]==="\\"?2:1;n+=1;continue}if(t[n]!=="{"){n+=1;continue}let i=1,r=n+1;for(;r<t.length&&i>0;){if(t[r]==="{"&&t[r+1]==="{"){const u=t.indexOf("}}",r+2);r=u===-1?t.length:u+2;continue}if(t[r]==="/"&&t[r+1]==="*"){const u=t.indexOf("*/",r+2);r=u===-1?t.length:u+2;continue}if(t[r]==='"'||t[r]==="'"){const u=t[r];for(r+=1;r<t.length&&t[r]!==u;)r+=t[r]==="\\"?2:1;r+=1;continue}t[r]==="{"?i+=1:t[r]==="}"&&(i-=1),r+=1}s.push({selector:t.slice(a,n).trim(),body:t.slice(n+1,r-1),from:a,to:r,text:t.slice(a,r).trim()}),n=r,a=r}return s}function St(e){const t=String(e||""),s=new Set,n=new Set,a=new Set;for(const i of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const r of i[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))r&&(s.add(r),s.add(r.replace(/([:./%!#()[\],])/g,"\\$1")));for(const i of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))i[2].trim()&&n.add(i[2].trim());for(const i of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))a.add(i[1].toLowerCase());return{classes:s,ids:n,tags:a}}function wt(e,t){const s=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),n=[...s.matchAll(/\.((?:\\.|[\w-])+)/g)].map(r=>r[1]),a=[...s.matchAll(/#((?:\\.|[\w-])+)/g)].map(r=>r[1]);if(n.length||a.length){const r=u=>u.replace(/\\(.)/g,"$1");return n.every(u=>t.classes.has(u)||t.classes.has(r(u)))&&a.every(u=>t.ids.has(r(u)))}const i=[...s.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(r=>r[2].toLowerCase());return i.length>0&&i.every(r=>t.tags.has(r))}function ba(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function Ta(e,t,s){const n=ba(e);if(!n.length)return"keep";const a=n.filter(r=>wt(r,t));return a.length?a.length===n.length&&!n.some(r=>wt(r,s))?"move":"copy":"keep"}function rn(e,t,s){const n=String(e||""),a=St(t),i=St(s),r=[],u=[];let k=0;for(const h of ya(n)){const c=n.slice(h.from,h.to),l=c.match(/^\s*/)[0];if(k=h.to,ka.test(h.selector)){const $=rn(h.body,t,s);$.move.trim()&&r.push(`${h.selector} {
${$.move.trim()}
}`),$.keep.trim()&&u.push(`${l}${h.selector} {
${$.keep.trim()}
}`);continue}const f=h.selector.startsWith("@")?"keep":Ta(h.selector,a,i);if(f==="move"){r.push(h.text);continue}f==="copy"&&r.push(h.text),u.push(c)}return u.push(n.slice(k)),{move:r.join(`

`).trim(),keep:u.join("").replace(/\n{3,}/g,`

`).trim()}}const xa="/!/sve/component";function _a(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let s=null;for(const n of t){if(!n.trim())continue;const a=n.match(/^[ \t]*/)[0].length;s=s===null?a:Math.min(s,a)}return s?t.map(n=>n.slice(s)).join(`
`):t.join(`
`)}function Sa(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function wa(e,t){if(!Jn(e))return"";try{return await(await Rn(()=>import("./tw-compile-D8Xdoe3O.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(s){return console.error("[sve] component tailwind compile",s),""}}async function Ca(e,t){const s=await e.fetch(xa,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":Ot(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!s.ok){const n=new Error(String(s.status));throw n.status=s.status,n}return s.json()}function Ct(e,t){const{from:s,to:n}=Gn(e,t),a=e.slice(s,n);if(!a.trim())return null;const i=e.slice(0,s)+e.slice(n),r=y("dock:css"),u=rn(typeof r=="string"?r:"",a,i);return{html:_a(a),css:u.move,keepCss:u.keep,lead:Sa(a),from:s,to:n}}function $a(e,t,{onDone:s,onError:n}={}){if(y("dock:is-locked")===!0)return;const a=y("dock:html");if(typeof a!="string"||!t)return;const i=Ct(a,t);if(!i)return;const r=ce(e.document,In,{heading:m(e,"component_new"),nameLabel:m(e,"component_name"),placeholder:m(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:m(e,"cancel"),saveLabel:m(e,"component_create"),onOk:u=>{r.dismiss(),(async()=>{try{const k=await wa(e,i.html),h=y("dock:html"),c=typeof h=="string"&&h===a?i:Ct(h,t);if(!c)return;const l=await Ca(e,{name:u,html:c.html,css:c.css,js:"",tw:k}),f=y("dock:html"),$=f.slice(0,c.from)+c.lead+l.tag+f.slice(c.to);y("dock:set-html",$),c.css.trim()&&y("dock:set-css",c.keepCss),s?.(l)}catch(k){n?.(k)}})()}})}function Pa(e,t,s){const n=String(e||"");if(!t||t.kind!=="antlers")return n;const a=String(s||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?Ia(n,t,a):t.tag==="else"||!a?n:n.slice(0,t.from)+`{{ ${t.tag} ${a} }}`+n.slice(t.openTo)}function Je(e,t,s,n){return be(e,t,{kind:s,name:n})}function be(e,t,s={}){const n=String(e||"");if(!t||t.antlers!=="loop")return n;const a=t.loopKind==="collection"?"collection":"field",i=s.kind??a,r=String(s.name??t.expr??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(r))return n;const u=s.sortDir??t.sortDir??"",k=String(s.sortField??t.sortField??"").trim(),h=String(s.limit??t.limit??"").trim(),c=ln(n,t);if(!c)return n;const l=i===a?t.params:"",f=i==="collection"?La(r,k,u,h,l):Ea(r,k,u,h,l),$=i==="collection"?"collection":r;return n.slice(0,t.from)+f+n.slice(t.openTo,c.from)+`{{ /${$} }}`+n.slice(c.to)}function La(e,t,s,n,a){const i=Ha(a).replace(/\bsort\s*=\s*["'][^"']*["']/g,"").replace(/\blimit\s*=\s*["']?\d+["']?/g,"").replace(/\s+/g," ").trim(),r=[`collection from="${e}"`];return s==="random"?r.push('sort="random"'):t&&r.push(`sort="${t}${s==="desc"?":desc":":asc"}"`),n&&r.push(`limit="${n}"`),i&&r.push(i),`{{ ${r.join(" ")} }}`}function Ea(e,t,s,n,a){const i=String(a||"").split("|").map(u=>u.trim()).filter(u=>u&&!/^from\s*=/.test(u)&&!/^sort\s*:/.test(u)&&!/^reverse$/.test(u)&&!/^shuffle$/.test(u)&&!/^limit\s*:/.test(u)),r=[e,...i];return s==="random"?r.push("shuffle"):t&&(r.push(`sort:${t}`),s==="desc"&&r.push("reverse")),n&&r.push(`limit:${n}`),`{{ ${r.join(" | ")} }}`}function Ha(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function ln(e,t){const n=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return n?{from:t.from+n.index,to:t.from+n.index+n[0].length}:null}function Ia(e,t,s){return be(e,t,{name:s})}function Ra(e,t,s){const n=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return n;const a=ln(n,t);if(!a)return n;const r=(n.slice(0,a.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],u=s==="else"?"{{ else }}":"{{ elseif true }}";return`${n.slice(0,a.from)}${u}
${r}${n.slice(a.from)}`}const M=no("sve-call-values"),_e=new Set;let $t=null;const Aa="__sve-html-tree-style",O=new Set;let Qe="",ie=!1,ke=null,Ue=null,$e=!0,W="",Se=0,cn="";const V=new Map,Z=new Set;let F="",dn=!1,I=null,He=null,Ie=0,et=null,we=[],ne=null,Te=null,Re=null,Ae=null,tt=null,Me=!1,oe=null,te=null;function q(e){return e.getElementById(Pe)}function Ma(e){Mn(e,Aa,`
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
  `)}function B(){const e=y("dock:html");return typeof e=="string"?e:""}function un(e){return!!y("dock:is-open",e)}function pe(e,{save:t=!1}={}){return ht()||y("dock:set-html",e)!==!0?!1:(t&&y("dock:save-now"),!0)}function Pt(e){const t=y("dock:component-exit-state")||{};if(o.exitOpen=!!t.open,!t.open){o.onExit=null;return}o.exitName=t.name||"",o.exitLabel=m(e,"component_exit"),o.exitTitle=m(e,t.back?"component_exit_back":"component_exit_close"),o.onExit=()=>{y("dock:exit-component"),C(e)}}function Da(e,t){const s=Vn(e);if(!s||t.type!==s)return"";const n=Nn(t[s]);return n&&zn(e,n)?.section_type||""}const ae=[];let Xe=!1,nt=!1;function We(e,t){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(t,{timeout:2e3});return}e.setTimeout(t,200)}function Oa(e,t){for(const s of t){const n=s.type;!n||V.has(n)||Z.has(n)||ae.includes(n)||ae.push(n)}it.htmlTreePrefetchArmed&&ut(e)}function Tr(e){it.htmlTreePrefetchArmed=!0,ut(e)}function ut(e){if(Xe||!ae.length)return;Xe=!0;const t=()=>{const s=ae.shift();if(!s){Xe=!1;return}if(V.has(s)||Z.has(s)){We(e,t);return}Z.add(s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(s)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{typeof n?.html=="string"&&(V.set(s,n.html),nt&&(nt=!1,C(e)))}).catch(()=>{}).finally(()=>{Z.delete(s),We(e,t)})};We(e,t)}function ht(){return!!F}function Ba(e){const t=new Map,s=Bt(e);if(!s)return t;for(const n of s.querySelectorAll("[data-sid]")){const a=n.getAttribute("data-sid");a&&!t.has(a)&&t.set(a,n.tagName.toLowerCase())}return t}function Fa(e,t){const s=Be(e)||"page_sections";for(const n of Vt(t)||[]){const a=Nt(n.values),i=a&&typeof a=="object"?a[s]:null;if(Array.isArray(i))return!0}return!1}function hn(e,t){const s=Be(e)||"page_sections",n=Ba(e),a=[];for(const i of Vt(t)||[]){const r=Nt(i.values),u=r&&typeof r=="object"?r[s]:null;if(Array.isArray(u)){u.forEach(k=>{if(!k||typeof k!="object"||Array.isArray(k)||typeof k.type!="string")return;const h=[k._visual_id,k.id,k._id].filter(w=>typeof w=="string"&&w!=="");if(!h.length)return;const c=Da(e,k)||k.type,l=typeof k._sve_label=="string"?k._sve_label.trim():"",f=h.map(w=>n.get(w)).find(Boolean)||"section",$=an(k.type)[`0:${f}`];a.push({uid:h[0],ids:h,type:k.type,tag:f,label:(typeof $=="string"&&$.trim()?$.trim():"")||l||zt(e,c)?.display||Ge(c)||c,svg:Wt(f,"",null).svg||oo.section,cat:qt(f),enabled:k.enabled!==!1})});break}}return a}function ja(e,t,s){if(!s.length)return"";const n=y("dock:current-type")||"",a=y("dock:current-uid"),i=!!y("dock:component-exit-state")?.open;if(a){const r=qn(a,t),u=s.find(k=>k.ids.some(h=>r.includes(h)));if(u&&(i||u.type===n))return u.uid}return s.find(r=>r.type===n)?.uid||""}function qa(e,t,s,n){const a=t.find(w=>w.uid===s),i=y("dock:component-src"),r=y("dock:type-stack")||[];if(!a||!i||!r.length)return null;const u=r.map(w=>w.type).filter(w=>!V.get(w));if(u.length)return Ka(e,u),null;const k=[],h=new Set,c=new Set;let l=w=>k.push(...w),f=null,$=0;for(let w=0;w<r.length;w+=1){const N=w+1<r.length?r[w+1].src:i,je=A=>({...A,id:`ctx${w}:${A.id}`,path:`ctx${w}/${A.path}`,ctxLevel:w,children:A.children.map(je)}),z=xe(V.get(r[w].type)).map(je),E=[],R=(A,U)=>{for(const L of A){if(L.kind==="component"&&L.src===N)return E.push(...U,L),L;const me=R(L.children,[...U,L]);if(me)return me}return null};if(f=N?R(z,[]):null,!f)return null;const Y=new Set(E.map(A=>A.id)),fe=(A,U)=>{for(const L of A)L.children.length&&(Y.has(L.id)?O.has(L.path):fn(L,U))&&h.add(L.id),fe(L.children,U+1)};fe(z,$),l(z),c.add(f.id),$+=E.length,l=(A=>U=>{A.children=U})(f)}for(const w of st(n))h.add(w);return O.has(f.path)&&h.add(f.id),f.children=n,{tree:k,folds:h,hostId:f.id,hostIds:c,levels:r.length,rootId:k.find(w=>!w.kind)?.id||"",label:a.label,svg:a.svg,cat:a.cat}}function Ka(e,t){for(const s of t)!ae.includes(s)&&!Z.has(s)&&ae.push(s);nt=!0,ut(e)}function Va(e,t,s){const n=e.findIndex(i=>i.kind==="antlers"&&(i.tag===t||i.handle===t));if(n===-1)return{loop:null,above:[],below:[]};const a=i=>s?i:{...i,id:`tpl:${i.id}`,path:`tpl/${i.path}`,children:i.children.map(a)};return{loop:e[n],above:e.slice(0,n).map(a),below:e.slice(n+1).map(a)}}function Na(e,t,s){const n=y("dock:component-exit-state");if(n?.open)return Ge(n.name)||n.name||"";if(s)return t.find(i=>i.uid===s)?.label||"";const a=y("dock:current-type")||"";return zt(e,a)?.display||Ge(a)||""}function pn(e,t,s,n,a){const i=s.find(u=>u.uid===n);if(!i||n===a)return;O.clear(),I=null,$e=!1,le(),Fe(),W=n,cn=B(),F=V.get(i.type)||"",F&&(I=De(xe(F))||null),dn=(y("dock:current-type")||"")===i.type,e.clearTimeout(Se),Se=e.setTimeout(()=>{W="",ie=!1,C(e)},4e3),C(e);const r=()=>Wn(i.uid,t,e,{clampToSection:!0});Kn(i.uid,t,e,r),de({source:he,type:ue.SVE_ACTIVATE,ids:i.ids},e),e.setTimeout(()=>C(e),0)}function ot(e,t){if(!t)return!1;for(const s of e||[])if(s.id===t||ot(s.children,t))return!0;return!1}function De(e){for(const t of e||[]){if(!t.kind)return t.id;const s=De(t.children);if(s)return s}return""}function fn(e,t){return O.has(e.path)?t===0:t>0}function st(e){const t=new Set,s=(n,a)=>{for(const i of n)i.children.length&&fn(i,a)&&t.add(i.id),s(i.children,a+1)};return s(e,0),t}function C(e){const t=e.document,n=q(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;Ma(t),eo(e);const a=B();F&&F===a&&(F="");const i=F||a,r=xe(i);we=r;const u=y("dock:current-type")||"",k=an(u),h=hn(e,t),c=Fa(e,t);u&&a&&!F&&V.set(u,a),Oa(e,h);const l=ja(e,t,h);if(c&&!h.length){we=[],o.rows=[],o.sections=[],o.pageBuilder=!0,o.emptyText=m(e,"html_tree_empty"),o.canEdit=!y("dock:is-locked"),o.look=bt(e),o.onRefresh=()=>C(e),o.onSection=null,Pt(e),Le(n,_t),Lt(e,[]);return}o.pageBuilder=c;const f=`${u}|${l}`;let $=!1;f!==Qe&&(Qe=f,O.clear(),Ue!==null&&i!==Ue?$=!0:ie=i),($||ie!==!1&&i!==ie)&&(ie=!1,O.clear(),I=(ke&&ot(r,ke)?ke:De(r))||null,ke=null),Ue=i,W&&(W===l||!h.length)&&(dn||i!==cn)&&(e.clearTimeout(Se),W="",ie=!1,ot(r,I)||(O.clear(),I=De(r)||null));const w=h.some(p=>p.uid===W)?W:"",N=$e?"":w||l,z=!!(y("dock:component-exit-state")||{}).open,E=z?qa(e,h,N,r):null,R=c&&!z?qo(e):"";c&&!z&&!R&&Gt(e).then(p=>{p&&C(e)});const Y=!!R&&u===R;R&&!Y&&!V.has(R)&&!Z.has(R)&&(Z.add(R),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(R)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(p=>p.ok?p.json():null).then(p=>{typeof p?.html=="string"&&(V.set(R,p.html),C(e))}).catch(()=>{}).finally(()=>Z.delete(R)));const fe=R?Va(Y?r:xe(V.get(R)||""),Be(e)||"page_sections",Y):{above:[],below:[]},A=!!(w||l)||Y,U=(p,T)=>Ke(p,o.query?new Set:st(p)).map(x=>({...x,staticSide:T,...Y?{}:{context:"page"}})),L=E?Ke(E.tree,o.query?new Set:E.folds):[...U(fe.above,"above"),...Y?[]:Ke(r,o.query?new Set:st(r)),...U(fe.below,"below")];!i.trim()&&!un(t)?o.emptyText=m(e,"html_tree_need_dock"):o.emptyText=m(e,"html_tree_empty"),o.slotText=m(e,"antlers_drop_here"),o.dataTitle=m(e,"data_vars_title"),o.pageTitle=m(e,"component_props_page"),o.renameTitle=m(e,"html_tree_rename"),o.tagTitle=m(e,"tw_tag"),o.hideTitle=m(e,"html_tree_hide"),o.showTitle=m(e,"html_tree_show"),o.duplicateTitle=m(e,"html_tree_duplicate"),o.deleteTitle=m(e,"html_tree_delete"),o.lockedTitle=m(e,"html_tree_locked"),o.searchEmpty=m(e,"html_tree_search_empty"),o.canEdit=!y("dock:is-locked"),o.look=bt(e),jn(e),o.onQuery=()=>C(e),Pt(e),o.inComponent=z,o.onContextRow=p=>{if(String(p).startsWith("tpl:")){const x=String(p).slice(4);Jt(e).then(X=>{X&&(ke=x,I=x,C(e))});return}if(!E||p===E.hostId)return;const T=L.find(x=>x.id===p)?.ctxLevel??E.levels-1;y("dock:exit-component",E.levels-T),C(e)},o.onSelect=p=>{const T=L.find(x=>x.id===p);T&&Xt(e,T.path)||ft(e,p,L)},o.onTwist=p=>{const T=L.find(x=>x.id===p)?.path;T&&(O.has(T)?O.delete(T):O.add(T),C(e))},o.onTagChange=(p,T)=>{const x=o.rows.find(X=>X.id===T);x&&!ht()&&to(e,p.currentTarget,x)},o.onRename=p=>Ua(e,p),o.onRenameCommit=()=>Et(e,!0),o.onRenameCancel=()=>Et(e,!1),o.onHide=p=>Xa(e,p),o.onDuplicate=p=>Wa(e,p),o.onDelete=p=>Za(e,p),o.onPointerDown=(p,T)=>er(e,p,T),o.onContext=(p,T)=>Ja(e,p,T),o.onInspectCommit=p=>rr(e,p),o.onPropValue=(p,T,x)=>Rt(e,p,T,x),o.onPropPage=(p,T)=>fa(e,p,x=>Rt(e,T,x,!1)),o.onLoopKind=p=>ir(e,p),o.onAddBranch=p=>lr(e,p),o.onLoopSortField=p=>{const T=Oe(),x=String(p||"").trim();if(!T)return;const X=te?.id===T.id?te.dir:"",G=T.sortDir||X||"asc";te=null,se(e,(yn,bn)=>be(yn,bn,{sortField:x,sortDir:G}))},o.onLoopSortDir=p=>{const T=Oe(),x=String(p||"");if(T){if((x==="asc"||x==="desc")&&!T.sortField){te={id:T.id,dir:x},at(e,T);return}te=null,se(e,(X,G)=>be(X,G,{sortDir:x,sortField:x==="asc"||x==="desc"?G.sortField:""}))}},o.onLoopLimit=p=>se(e,(T,x)=>be(T,x,{limit:String(p||"").replace(/\D/g,"")})),o.onPropHost=p=>p?M.mount(p):M.unmount(),o.onInspectData=(p,T)=>{y("dock:data-menu",{anchor:p,at:L.find(x=>x.id===I)?.from,onPick:x=>T(String(x?.var||"").trim())})};const me=L.find(p=>!p.kind&&!p.staticSide)?.id,vt=z||Y?"":Na(e,h,N),ve=N&&!z?h.find(p=>p.uid===N):null;o.rows=L.map(p=>{const T=Wt(p.tag,p.kind,p.antlers),x=!!E&&p.id===E.rootId,X=p.id===me&&vt?vt:x?E.label:p.klass,G=p.id===me;return{...p,base:X,name:va(X,p.path,k),current:p.id===I,letter:x?"":T.letter||"",svg:G&&ve?ve.svg:x?E.svg:T.svg||"",cat:x?E.cat:qt(p.tag,p.kind,p.antlers),context:E?E.hostIds.has(p.id)?"host":p.id.startsWith("ctx")?"dim":"":p.context||"",sectionRoot:G&&ve?ve.uid:"",fieldsIcon:!!(G&&ve)}});const qe=[];for(const p of o.rows)qe.length=p.depth,p.guides=qe.slice(),qe[p.depth]=p.cat;o.sections=A?h.map(p=>{const T=!!N&&p.uid===N;return{...p,current:T,ready:T&&(!w||!!F),row:{id:`sec:${p.uid}`,section:p.uid,tag:p.tag,name:p.label,kind:"",svg:p.svg,cat:p.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:T,hidden:!p.enabled}}}):[],o.onSection=p=>pn(e,t,h,p,N),o.onRefresh=()=>C(e),at(e,o.rows.find(p=>p.id===I)),Le(n,_t),Lt(e,r)}function Lt(e,t){q(e.document)&&mn(e,t)}function mn(e,t){const s=t[0],n=!!y("dock:component-src"),a=n?"":y("dock:current-uid")||"";de({source:he,type:ue.SVE_HTML_PICK,on:!0,uid:a,all:n,tag:s?.tag||"",klass:s?.klass||"",nodes:To(t)},e)}function za(e){if(!e)return;const t=(s,n)=>{for(const a of s||[]){if(a.path===e)return!0;if(t(a.children,n+1))return n===0?O.delete(a.path):O.add(a.path),!0}return!1};t(we,0)}function Ua(e,t){if(Me)return;const s=o.rows.find(n=>n.id===t);!s||s.kind||(I=t,o.rows.forEach(n=>{n.current=n.id===t}),o.editingId=t,o.draft=s.name,e.setTimeout(()=>{const n=q(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function Et(e,t){const s=o.editingId;if(!s)return;const n=o.rows.find(a=>a.id===s);o.editingId=null,t&&n&&ga(y("dock:current-type")||"",n.path,o.draft,n.base||n.klass),o.draft="",C(e)}function Xa(e,t){pt(e,t,mo)}function Wa(e,t){pt(e,t,vo)}function vn(e,t){Un(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const s=e.document;Yn({uid:t},s,e)})}function Ya(e,t,s){W===s&&(e.clearTimeout(Se),W="",F=""),I=null,$e=!1,Qe="";const n=hn(e,t),a=n.find(i=>i.uid!==s)||n[0];a?pn(e,t,n,a.uid,""):(F="",o.rows=[],o.sections=[],o.pageBuilder=!0,C(e)),e.setTimeout(()=>{q(e.document)&&C(e)},0)}Kt("row:removed",({uid:e,parentPath:t,doc:s,win:n})=>{t!==Be(n)||!q(n.document)||Ya(n,s,e)});function Za(e,t){const s=o.sections?.find(a=>a.row?.id===t),n=s?s.row?.section||s.uid:o.rows.find(a=>a.id===t)?.sectionRoot;if(n){vn(e,n);return}pt(e,t,go)}function pt(e,t,s){if(y("dock:is-locked"))return;const n=B(),a=o.rows.find(r=>r.id===t);if(!a)return;const i=s(n,a);i!==n&&pe(i)}function le(){oe?.dismiss(),oe=null}function Ga(e,t,s){const n=s.row?.section||s.uid;n&&(oe=ce(e.document,lt,{items:[{label:m(e,"html_tree_remove_section"),danger:!0,onPick:()=>{le(),vn(e,n)}}],x:t.clientX,y:t.clientY,onClose:()=>{oe=null}}))}function Ja(e,t,s){le();const n=o.sections?.find(u=>u.row?.id===s);if(n){Ga(e,t,n);return}const a=o.rows.find(u=>u.id===s);if(!a)return;ft(e,s,o.rows);const i={x:t.clientX,y:t.clientY},r=u=>{u.length&&(oe?.dismiss(),oe=ce(e.document,lt,{items:u,x:i.x,y:i.y,onClose:()=>{oe=null}}))};if(a.kind==="component"){Qa(e,a,r);return}o.canEdit&&r([{label:m(e,"component_make"),onPick:()=>{le(),$a(e,a,{onDone:()=>C(e),onError:u=>{e.alert(u?.status===409?m(e,"component_exists"):m(e,"component_failed"))}})}}])}const Ht=(e,t)=>{le(),y("dock:open-template",t)};function Qa(e,t,s){if(!ao(t.src)){s([{label:m(e,"component_open_named",{name:t.name||t.src}),onPick:()=>Ht(e,`view:partials/${t.src}`)}]);return}s([{label:m(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const a=Array.isArray(n.items)?n.items:[];s(a.length?a.map(i=>({label:m(e,"component_open_named",{name:i.label}),onPick:()=>Ht(e,i.type)})):[{label:m(e,"component_none"),onPick:null}])}).catch(()=>s([{label:m(e,"component_none"),onPick:null}]))}function er(e,t,s){if(t.button!==0||y("dock:is-locked")||o.editingId||t.target?.closest?.("button, input"))return;Fe(),ne=s,Te={x:t.clientX,y:t.clientY},Re=t.currentTarget,Ae=t.pointerId;const n=i=>tr(e,i),a=i=>nr(e,i);tt=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),tt=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function tr(e,t){if(!ne||!Te)return;const s=t.clientX-Te.x,n=t.clientY-Te.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{Re?.setPointerCapture?.(Ae)}catch{}}t.preventDefault();const a=e.document.elementFromPoint(t.clientX,t.clientY),i=a?.closest?.("[data-sve-ht-slot]");if(i){const l=i.getAttribute("data-sve-ht-id");if(l&&l!==ne){o.dropId=l,o.dropPlace="inside";return}}const r=a?.closest?.("[data-sve-ht-row]"),u=r?.getAttribute("data-sve-ht-id");if(!u||u===ne){o.dropId=null,o.dropPlace=null;return}const k=o.rows.find(l=>l.id===u),h=o.rows.find(l=>l.id===ne);if(!k||k.context||h&&k.path.startsWith(`${h.path}/`)){o.dropId=null,o.dropPlace=null;return}const c=r.getBoundingClientRect();o.dropId=u,o.dropPlace=po(t.clientY-c.top,c.height,!Yt(k.tag)&&k.kind!=="component")}function nr(e,t){const s=ne,n=o.dropId,a=o.dropPlace||"after",i=o.dragging;if(Fe(),i&&(Me=!0,e.setTimeout(()=>{Me=!1},0)),!i||y("dock:is-locked")||!s||!n||s===n)return;t?.preventDefault?.();const r=B(),u=fo(r,we,s,n,a);u!==r&&pe(u)}function Fe(){try{Re?.releasePointerCapture?.(Ae)}catch{}tt?.(),ne=null,Te=null,Re=null,Ae=null,o.dragging=!1,o.dropId=null,o.dropPlace=null}function gn(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function at(e,t){if(t?.kind==="component"){or(e,t);return}if(j.callOpen&&(j.callOpen=!1,j.callStore=null,M.forget(),ct(e)),t?.kind!=="antlers"){o.inspect=null;return}const s=t.id;if(t.tag==="else"){o.inspect={key:s,title:m(e,"antlers_condition"),mode:"note",note:m(e,"antlers_else_note")};return}if(t.antlers==="loop"){const n=t.loopKind==="collection",a=te?.id===t.id?te.dir:"",i=t.sortDir||a;o.inspect={key:s,title:m(e,"antlers_loop"),mode:"loop",loopKind:n?"collection":"field",kinds:[{id:"field",label:m(e,"antlers_loop_field")},{id:"collection",label:m(e,"antlers_loop_collection")}],collections:gn(e),value:t.expr||"",placeholder:m(e,n?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:m(e,"antlers_sort"),dir:i,needsField:i==="asc"||i==="desc",field:t.sortField||"",pickable:!n,placeholder:m(e,n?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:m(e,"antlers_sort_none")},{id:"asc",label:m(e,"antlers_sort_asc")},{id:"desc",label:m(e,"antlers_sort_desc")},{id:"random",label:m(e,"antlers_sort_random")}]},limit:{title:m(e,"antlers_limit"),value:t.limit||"",placeholder:m(e,"antlers_limit_placeholder")},branches:[]};return}o.inspect={key:s,title:m(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:m(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:m(e,"antlers_add_elseif")},{id:"else",label:m(e,"antlers_add_else")}]}}function or(e,t){if(!ro(e)){o.inspect=null;return}if(!t.src)return;const s=t.id;if(o.inspect={key:s,title:m(e,"component_props_values"),mode:"note",note:m(e,"code_dock_loading")},io()){const n={},a={},i=new Map;for(const[r,u]of lo(B().slice(t.from,t.to))){const k=co(r);k&&(r!==k||!i.has(k))&&i.set(k,u)}for(const[r,u]of i)u.bound?a[r]=u.value:n[r]=u.value;$t!==s&&($t=s,_e.clear());for(const r of _e)r in a||(a[r]="");o.inspect=null,j.callOpen=!0,j.title=j.title||m(e,"component_props"),j.callTitle=t.klass||t.name||t.src,j.callStore=M.ui,M.ui.canBind=!0,M.ui.dataTitle=m(e,"data_vars_title"),M.ui.exprPlaceholder=m(e,"component_props_expr"),M.ui.onToggleBind=(r,u)=>ar(e,r,u),M.ui.onExpr=(r,u)=>It(e,r,u),M.ui.onPickData=(r,u)=>y("dock:data-menu",{anchor:u,at:t.from,onPick:k=>It(e,r,String(k?.var||"").trim())}),M.load(e,{key:`${t.src}::${s}`,src:t.src,params:n,bindings:a,readOnly:y("dock:is-locked")===!0}),M.watch(e,{src:t.src,write:r=>sr(e,r,a)}),ct(e);return}uo(e,t.src).then(n=>{if(o.inspect?.key===s){if(!n.length){o.inspect={key:s,title:m(e,"component_props_values"),mode:"note",note:m(e,"component_props_values_none")};return}o.inspect={key:s,title:m(e,"component_props_values"),mode:"props",inheritLabel:m(e,"component_props_inherit"),rows:ho(n,B().slice(t.from,t.to))}}})}function sr(e,t,s={}){const n=o.rows.find(r=>r.id===I);if(n?.kind!=="component"||y("dock:is-locked"))return;let a=B(),i=n.to;for(const[r,u]of Object.entries(t||{})){if(r in s)continue;const k=a.length,h=dt(a,{from:n.from,to:i},r,u);h!==a&&(i+=h.length-k,a=h)}a!==B()&&(pe(a,{save:!0}),C(e))}function ar(e,t,s){s?_e.add(t):_e.delete(t),kn(e,t,"",s),C(e)}function It(e,t,s){_e.add(t),kn(e,t,s,!0),C(e)}function kn(e,t,s,n){const a=o.rows.find(u=>u.id===I);if(a?.kind!=="component"||y("dock:is-locked"))return;const i=B(),r=dt(i,a,t,s,{bound:n});r!==i&&pe(r,{save:!0})}function Oe(){const e=o.rows.find(t=>t.id===I);return e?.kind==="antlers"&&!y("dock:is-locked")?e:null}function se(e,t){const s=Oe();if(!s)return;const n=B(),a=t(n,s);a!==n&&(pe(a),C(e))}function Rt(e,t,s,n){const a=o.rows.find(u=>u.id===I);if(a?.kind!=="component"||y("dock:is-locked"))return;const i=B(),r=dt(i,a,t,s,{bound:n});r!==i&&(pe(r,{save:!0}),C(e))}function rr(e,t){se(e,(s,n)=>n.antlers==="loop"?Je(s,n,n.loopKind==="collection"?"collection":"field",t):Pa(s,n,t))}function ir(e,t){const s=Oe();if(!s||s.antlers!=="loop")return;const n=s.loopKind==="collection"?"collection":"field";if(t!==n){if(t==="collection"){const a=gn(e)[0]?.handle;if(!a)return;se(e,(i,r)=>Je(i,r,"collection",a));return}se(e,(a,i)=>Je(a,i,"field",i.handle||"items"))}}function lr(e,t){se(e,(s,n)=>Ra(s,n,t))}function cr(e,t){if(!e||!t||t.kind==="component"||Yt(t.tag))return null;const s=so(e,t);if(s<t.openTo)return null;const n=e.lastIndexOf(`
`,s-1)+1;return e.slice(n,s).trim()===""&&n>t.openTo?n-1:s}function ft(e,t,s){if(Me)return;const n=(s||o.rows).find(a=>a.id===t);n&&(I=t,o.rows.forEach(a=>{a.current=a.id===t}),at(e,n),!ht()&&(y("dock:reveal-html",{from:n.from,to:n.to,caret:cr(B(),n)}),y("dock:tw-follow"),de({source:he,type:ue.SVE_HTML_PICK_FOCUS,path:n.path},e)))}function dr(e,t){if(!t)return"";const s=[],n=(a,i)=>{for(const r of a||[]){const u=i||r.path===e;r.kind==="component"&&r.src===t&&s.push({path:r.path,inside:u}),n(r.children,u)}};return n(we,!1),(s.find(a=>a.inside)||s[0])?.path||""}function ur(e,t){if(!t||!q(e.document))return;$e=!1,za(t),C(e);const s=o.rows.find(n=>n.path===t);s&&(ft(e,s.id,o.rows),e.setTimeout(()=>{q(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function rt(e){if(He)return;const t=()=>{o.editingId||o.dragging||(e.clearTimeout(Ie),Ie=e.setTimeout(()=>{q(e.document)&&C(e)},80))},s=()=>t();He=Kt("dock:html-changed",t),e.document.addEventListener("sve-page-structure",s),et=()=>{e.document.removeEventListener("sve-page-structure",s)}}function hr(e){He?.(),He=null,et?.(),et=null,e?.clearTimeout?.(Ie),Ie=0}function mt(e){const t=q(e.document);if(de({source:he,type:ue.SVE_HTML_PICK,on:!1},e),hr(e),M.forget(),j.callOpen=!1,j.callStore=null,ct(e),Fe(),le(),Qn(e),I=null,o.inspect=null,o.editingId=null,o.draft="",o.sections=[],o.pageBuilder=!1,W="",e?.clearTimeout?.(Se),!t){Ze(e);return}t.remove(),it.headerTab==="html_tree"&&Xn(e,null),An(e),Ft(e),jt(e),Ze(e)}function xr(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=Pe,Le(t,Qt,{title:m(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>mt(e)))}function _r(e){rt(e),C(e)}function pr(e){const t=e.document;if(!Dn(e,"html_tree"))return;if(q(t)){rt(e),C(e);return}if(!un(t))return;$e=!0,O.clear(),On(e,[Pe]);const s=t.createElement("div");s.id=Pe,s.style.cssText=Bn,Le(s,Qt,{title:m(e,"html_tree")}),s.querySelector("[data-sve-close]")?.addEventListener("click",()=>mt(e)),Fn(e,s),Ft(e),jt(e),Ze(e),rt(e),C(e)}function Sr(e){if(q(e.document)){mt(e);return}pr(e)}Ut("html-tree:from-preview",({path:e,src:t}={})=>{Xt(window,e)||ur(window,dr(e,t)||e)});Ut("html-tree:arm-pick",e=>{const t=window;return e?(mn(t,xe(B())),!0):(q(t.document)||de({source:he,type:ue.SVE_HTML_PICK,on:!1},t),!0)});function wr(){V.clear(),Z.clear(),ae.length=0}export{Aa as HTML_TREE_STYLE_ID,Tr as armHtmlTreePrefetch,wr as clearHtmlTreeTemplates,le as closeHtmlTreeMenu,mt as closeHtmlTreePanel,Ma as ensureHtmlTreeStyles,xr as fillHtmlTreePane,I as htmlTreeActiveId,q as htmlTreePanel,Ie as htmlTreeTimer,He as htmlTreeUnhook,pr as openHtmlTreePanel,C as renderHtmlTree,_r as showHtmlTreePane,hr as stopWatchHtmlTreeDock,Sr as toggleHtmlTreePanel,rt as watchHtmlTreeDock};
