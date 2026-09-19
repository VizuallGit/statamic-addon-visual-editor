const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-D8Xdoe3O.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{_ as ke,k as Y,ap as hn,b4 as o,u as d,o as v,a as g,b as S,t as _,F as A,d as q,f as pn,g as P,e as fn,s as b,q as W,l as mn,p as Ct,w as Ke,b5 as vn,v as Pt,y,h as f,j as ae,C as gn,b6 as kn,i as $t,b7 as lt,b8 as ct,b9 as yn,ba as bn,bb as xn,bc as Et,z as re,x as Tn,bd as Te,be as _n,B as he,c as ue,N as Sn,G as wn,aN as Je,aq as Ve,am as Cn,aP as Lt,aQ as Ht,af as Pn,ag as dt,S as _e,V as Se,O as $n,aO as En,an as Ln,ao as Hn,bf as ut,bg as In,U as It,A as At,a8 as Qe,J as Mt,K as Rt,ax as Dt,ay as Ne,I as An,bh as Mn,aS as Rn,aT as Dn,aw as On,bi as Bn,b0 as Fn,ae as Ot,aK as jn,aF as qn}from"./addon-su47rlva.js";import{M as ie,S as le}from"./protocol-D3FYhCm9.js";import{D as F,E as Kn,F as et,G as Vn,t as Nn,I as tt,v as zn,z as Un,b as Ae,l as ht,J as Bt,q as Xn,K as Ft,L as Yn,H as Wn,M as nt,N as jt,O as Zn,h as Gn,c as Jn,Q as Qn,R as eo,S as to,T as no,U as oo,V as so,W as ao,X as ro,Y as io,Z as lo}from"./tw-classes-Cvln-LJO.js";import{canEditFields as co,currentSetHandle as uo,openFieldsetOverlay as ho}from"./section-fields-D2OT4vSz.js";import{a as po}from"./html-pick-align-CK-9iH9_.js";import"./ai-text-icon-B7uCWIwa.js";import"./FieldsetOverlay-7KWNd344.js";const fo={key:0,class:"sve-ht-inspect"},mo={class:"sve-ht-inspect__head"},vo={key:0,class:"sve-ht-inspect__note"},go={key:2,class:"sve-ht-inspect__props"},ko={class:"sve-ht-inspect__proplabel"},yo={key:0},bo=["value","disabled","onChange"],xo={value:""},To=["value"],_o=["value"],So=["value","placeholder","onChange"],wo=["title","disabled","onClick"],Co=["title","disabled","onClick"],Po={key:0,class:"sve-ht-inspect__seg"},$o=["data-active","disabled","onClick"],Eo=["value","disabled"],Lo={key:0,value:""},Ho=["value"],Io={key:2,class:"sve-ht-inspect__box"},Ao=["value","placeholder","disabled","onKeydown"],Mo=["title","disabled"],Ro={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Do=["value","disabled"],Oo=["value"],Bo={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},Fo=["value","placeholder","disabled"],jo=["title","disabled"],qo={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Ko=["value","placeholder","disabled"],Vo={key:4,class:"sve-ht-inspect__add"},No=["disabled","onClick"],Re='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',zo='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',Uo={__name:"HtmlTreeInspector",setup(e){const t=Y(null);hn(t,h=>o.onPropHost?.(h||null));const s=Y(null),n=Y(null);function a(h){o.onInspectCommit?.(h.target.value)}function l(h,c,i){!h||!c||(h.value=c,h.focus(),h.setSelectionRange(c.length,c.length),i(c))}function r(h,c){o.onInspectData?.(h.currentTarget,i=>o.onPropValue?.(c.handle,i,!0))}function u(h){o.onInspectData?.(h.currentTarget,c=>l(s.value,c,i=>o.onInspectCommit?.(i)))}function k(h){o.onInspectData?.(h.currentTarget,c=>l(n.value,c,i=>o.onLoopSortField?.(i)))}return(h,c)=>d(o).inspect?(v(),g("div",fo,[S("div",mo,_(d(o).inspect.title),1),d(o).inspect.mode==="note"?(v(),g("div",vo,_(d(o).inspect.note),1)):d(o).inspect.mode==="statamic"?(v(),g("div",{key:1,ref_key:"propHost",ref:t,class:"sve-ht-inspect__form"},null,512)):d(o).inspect.mode==="props"?(v(),g("div",go,[(v(!0),g(A,null,q(d(o).inspect.rows,i=>(v(),g("label",{key:i.handle,class:"sve-ht-inspect__prop"},[S("span",ko,[pn(_(i.label)+" ",1),i.bound?(v(),g("em",yo,":")):P("",!0)]),S("span",{class:fn(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":i.type==="select"||i.type==="link"}])},[i.type==="select"&&!i.bound?(v(),g("select",{key:0,value:i.value,disabled:!d(o).canEdit,onChange:m=>d(o).onPropValue?.(i.handle,m.target.value,!1)},[S("option",xo,_(i.placeholder||d(o).inspect.inheritLabel),1),i.value&&!i.options.includes(i.value)?(v(),g("option",{key:0,value:i.value},_(i.value),9,To)):P("",!0),(v(!0),g(A,null,q(i.options,m=>(v(),g("option",{key:m,value:m},_(m),9,_o))),128))],40,bo)):(v(),g("input",{key:1,type:"text",value:i.value,placeholder:i.placeholder||d(o).inspect.inheritLabel,onChange:m=>d(o).onPropValue?.(i.handle,m.target.value,i.bound)},null,40,So)),i.type==="link"?(v(),g("button",{key:2,type:"button","data-sve-ht-data":"",title:d(o).pageTitle,disabled:!d(o).canEdit,onClick:m=>d(o).onPropPage?.(m.currentTarget,i.handle),innerHTML:zo},null,8,wo)):P("",!0),S("button",{type:"button","data-sve-ht-data":"",title:d(o).dataTitle,disabled:!d(o).canEdit,onClick:m=>r(m,i),innerHTML:Re},null,8,Co)],2)]))),128))])):(v(),g(A,{key:3},[d(o).inspect.mode==="loop"?(v(),g("div",Po,[(v(!0),g(A,null,q(d(o).inspect.kinds,i=>(v(),g("button",{key:i.id,type:"button","data-active":i.id===d(o).inspect.loopKind?"":void 0,disabled:!d(o).canEdit,onClick:m=>d(o).onLoopKind?.(i.id)},_(i.label),9,$o))),128))])):P("",!0),d(o).inspect.mode==="loop"&&d(o).inspect.loopKind==="collection"?(v(),g("select",{key:d(o).inspect.key+":"+d(o).inspect.value,value:d(o).inspect.value,disabled:!d(o).canEdit,onChange:a},[d(o).inspect.value?P("",!0):(v(),g("option",Lo,_(d(o).inspect.placeholder),1)),(v(!0),g(A,null,q(d(o).inspect.collections,i=>(v(),g("option",{key:i.handle,value:i.handle},_(i.title),9,Ho))),128))],40,Eo)):(v(),g("div",Io,[(v(),g("input",{ref_key:"field",ref:s,key:d(o).inspect.key,type:"text",value:d(o).inspect.value,placeholder:d(o).inspect.placeholder,disabled:!d(o).canEdit,spellcheck:"false",onKeydown:[c[0]||(c[0]=b(()=>{},["stop"])),W(b(a,["prevent"]),["enter"])],onBlur:a},null,40,Ao)),S("button",{type:"button","data-sve-ht-data":"",title:d(o).dataTitle,disabled:!d(o).canEdit,innerHTML:Re,onMousedown:c[1]||(c[1]=b(()=>{},["prevent"])),onClick:b(u,["stop","prevent"])},null,40,Mo)])),d(o).inspect.sort?(v(),g(A,{key:3},[S("div",Ro,_(d(o).inspect.sort.title),1),(v(),g("select",{key:d(o).inspect.key+":dir:"+d(o).inspect.sort.dir,value:d(o).inspect.sort.dir,disabled:!d(o).canEdit,onChange:c[2]||(c[2]=i=>d(o).onLoopSortDir?.(i.target.value))},[(v(!0),g(A,null,q(d(o).inspect.sort.dirs,i=>(v(),g("option",{key:i.id,value:i.id},_(i.label),9,Oo))),128))],40,Do)),d(o).inspect.sort.needsField?(v(),g("div",Bo,[(v(),g("input",{ref_key:"sortField",ref:n,key:d(o).inspect.key+":field",type:"text",value:d(o).inspect.sort.field,placeholder:d(o).inspect.sort.placeholder,disabled:!d(o).canEdit,spellcheck:"false",onKeydown:[c[3]||(c[3]=b(()=>{},["stop"])),c[4]||(c[4]=W(b(i=>d(o).onLoopSortField?.(i.target.value),["prevent"]),["enter"]))],onBlur:c[5]||(c[5]=i=>d(o).onLoopSortField?.(i.target.value))},null,40,Fo)),d(o).inspect.sort.pickable?(v(),g("button",{key:0,type:"button","data-sve-ht-data":"",title:d(o).dataTitle,disabled:!d(o).canEdit,innerHTML:Re,onMousedown:c[6]||(c[6]=b(()=>{},["prevent"])),onClick:b(k,["stop","prevent"])},null,40,jo)):P("",!0)])):P("",!0),S("div",qo,_(d(o).inspect.limit.title),1),(v(),g("input",{key:d(o).inspect.key+":limit",type:"number",min:"1",value:d(o).inspect.limit.value,placeholder:d(o).inspect.limit.placeholder,disabled:!d(o).canEdit,onKeydown:[c[7]||(c[7]=b(()=>{},["stop"])),c[8]||(c[8]=W(b(i=>d(o).onLoopLimit?.(i.target.value),["prevent"]),["enter"]))],onBlur:c[9]||(c[9]=i=>d(o).onLoopLimit?.(i.target.value))},null,40,Ko))],64)):P("",!0),d(o).inspect.branches?.length?(v(),g("div",Vo,[(v(!0),g(A,null,q(d(o).inspect.branches,i=>(v(),g("button",{key:i.id,type:"button",disabled:!d(o).canEdit,onClick:m=>d(o).onAddBranch?.(i.id)},_(i.label),9,No))),128))])):P("",!0)],64))])):P("",!0)}},Xo=ke(Uo,[["__scopeId","data-v-26254b75"]]),Yo={class:"sve-dialog__title"},Wo={for:"sve-new-section-group"},Zo=["value"],Go={for:"sve-new-section-name"},Jo=["placeholder"],Qo={key:0,class:"sve-dialog__note"},es={class:"sve-dialog__actions"},ts=["disabled"],ns=["disabled"],os={__name:"NewSectionPrompt",props:{heading:{type:String,required:!0},groupLabel:{type:String,required:!0},nameLabel:{type:String,required:!0},placeholder:{type:String,default:""},note:{type:String,default:""},groups:{type:Array,required:!0},cancelLabel:{type:String,required:!0},saveLabel:{type:String,required:!0},onOk:{type:Function,required:!0},onClose:{type:Function,required:!0}},setup(e){const t=e,s=Y(""),n=Y(t.groups[0]?.key??""),a=Y(null),l=Y(!1);mn(()=>Ct(()=>a.value?.focus()));function r(){const h=s.value.trim();if(!h||!n.value||l.value){a.value?.focus();return}l.value=!0,t.onOk(h,n.value)}function u(h){h.target===h.currentTarget&&t.onClose()}function k(h){h.key==="Enter"?r():h.key==="Escape"&&t.onClose()}return(h,c)=>(v(),g("div",{class:"sve-dialog-overlay",onClick:u},[S("div",{class:"sve-dialog",onClick:c[3]||(c[3]=b(()=>{},["stop"]))},[S("div",Yo,_(e.heading),1),S("label",Wo,_(e.groupLabel),1),Ke(S("select",{id:"sve-new-section-group","onUpdate:modelValue":c[0]||(c[0]=i=>n.value=i),onKeydown:k},[(v(!0),g(A,null,q(e.groups,i=>(v(),g("option",{key:i.key,value:i.key},_(i.display),9,Zo))),128))],544),[[vn,n.value]]),S("label",Go,_(e.nameLabel),1),Ke(S("input",{id:"sve-new-section-name",ref_key:"input",ref:a,"onUpdate:modelValue":c[1]||(c[1]=i=>s.value=i),type:"text",placeholder:e.placeholder,onKeydown:k},null,40,Jo),[[Pt,s.value]]),e.note?(v(),g("p",Qo,_(e.note),1)):P("",!0),S("div",es,[S("button",{type:"button",class:"is-cancel",disabled:l.value,onClick:c[2]||(c[2]=(...i)=>e.onClose&&e.onClose(...i))},_(e.cancelLabel),9,ts),S("button",{type:"button",class:"is-primary",disabled:l.value,onClick:r},_(e.saveLabel),9,ns)])])]))}},ss=ke(os,[["__scopeId","data-v-d21be545"]]),qt="/!/sve/section-types";async function as(e){const t=await e.fetch(qt,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!t.ok)throw new Error(`section-types ${t.status}`);const s=await t.json(),n=new Map;for(const a of s.types||[])a?.group&&!n.has(a.group)&&n.set(a.group,a.group_display||a.group);return[...n].map(([a,l])=>({key:a,display:l}))}async function rs(e,{display:t,group:s}){const n=await e.fetch(qt,{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":$t(e),Accept:"application/json"},credentials:"same-origin",body:JSON.stringify({display:t,group:s})}),a=await n.json().catch(()=>({}));if(!n.ok){const l=new Error(a.error||`section-types ${n.status}`);throw l.reason=a.error,l}return a}async function is(e,t,s=null){if(!t||typeof lt!="function"||typeof ct!="function")return null;const n=await lt(e,t);if(!n)return null;const a=yn(),l=bn(e,"page",{handle:t},n?.defaults,a),r=xn(l,n?.new||{},n?.defaults);return ct(e,e.document,s,l,r)?l:null}const pt=700,ls=17;function cs(e,t){const s=(t||[]).filter(Boolean);if(!s.length)return;let n=0;const a=()=>{n+=1;const l=Et(e),r=l?s.some(u=>l.querySelector(`[data-sid="${CSS.escape(u)}"]`)):!0;r&&re({source:le,type:ie.SVE_ACTIVATE,ids:s},e),(r?!l&&n<6:n<ls)&&e.setTimeout(a,pt)};e.setTimeout(a,pt)}function ds(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function us(e){return new Promise(t=>{let s=!1;const n=l=>{s||(s=!0,a.dismiss(),t(l==="static"||l==="fields"?l:null))},a=ae(e.document,gn,{title:f(e,"section_new_kind"),body:f(e,"section_new_kind_note"),buttons:[{value:"cancel",label:f(e,"cancel"),variant:"ghost"},{value:"static",label:f(e,"section_new_static"),variant:"primary"},{value:"fields",label:f(e,"section_new_with_fields"),variant:"primary"}],onPick:n,onClose:()=>n(null)})})}const hs=`<section class="[ ] py-800">
    
</section>
`;function ft(e){if(y("dock:is-locked")===!0)return e.Statamic?.$toast?.error(f(e,"code_dock_locked")),!1;const s=`${String(y("dock:html")||"").replace(/\s+$/,"")}

${hs}`;return y("dock:set-html",s)!==!0?(e.Statamic?.$toast?.error(f(e,"section_new_failed")),!1):(y("dock:save-now"),e.Statamic?.$toast?.success(f(e,"section_new_template_done")),!0)}const ps=100,fs=80;async function ms(e){const t=kn(e);if(!t)return!1;let s="";try{const a=await e.fetch(`/!/sve/entry-blueprint?id=${encodeURIComponent(t)}`,{headers:{Accept:"application/json"},credentials:"same-origin"});s=a.ok?String((await a.json())?.template||""):""}catch{s=""}if(!s)return!1;const n=`view:${s.replace(/^\/+|\/+$/g,"")}`;if(y("dock:current-type")===n)return!0;if(y("dock:open-template",n)!==!0)return!1;for(let a=0;a<fs;a+=1){if(y("dock:current-type")===n)return!0;await new Promise(l=>e.setTimeout(l,ps))}return!1}function vs(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){(async()=>{let l=[];try{l=await as(e)}catch(u){n?.(u),e.Statamic?.$toast?.error(f(e,"section_new_failed"));return}if(!l.length){n?.(new Error("no groups")),e.Statamic?.$toast?.error(f(e,"section_new_failed"));return}const r=ae(e.document,ss,{heading:f(e,"section_new"),groupLabel:f(e,"section_new_group"),nameLabel:f(e,"section_new_name"),placeholder:f(e,"section_new_placeholder"),note:f(e,"section_new_note"),groups:l,cancelLabel:f(e,"cancel"),saveLabel:f(e,"section_new_create"),onClose:a,onOk:(u,k)=>{(async()=>{try{const h=await rs(e,{display:u,group:k});r.dismiss(),e.Statamic?.$toast?.success(f(e,"section_created",{name:h.section?.display||u})),e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"));const c=await is(e,h.section?.handle,t);!c&&h.section?.handle&&y("dock:open-template",h.section.handle),s?.({...h,uid:c?._visual_id||""})}catch(h){r.dismiss(),e.Statamic?.$toast?.error(f(e,h.reason==="bad_name"?"section_new_bad_name":"section_new_failed")),n?.(h)}})()}})})()}const gs={class:"sve-html-tree"},ks={class:"sve-pane-bar","data-sve-pane-bar":""},ys={"data-sve-right-title":""},bs={class:"sve-ht-tools"},xs=["title"],Ts=["placeholder","aria-label","value"],_s=["aria-label"],Ss=["title","aria-label"],ws={key:1,class:"sve-tree-exit"},Cs=["title"],Ps=["title"],$s='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',Es='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',Ls='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',Hs={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const t=f(window,"html_tree_search"),s=ds(window),n=f(window,"section_new"),a=Y(!1);function l(){a.value=!1}async function r(h){if(h)for(let c=0;c<20;c+=1){await Ct(),o.onRefresh?.();const i=o.sections.find(m=>m.uid===h);if(i){o.onSection?.(h),cs(window,i.ids);return}await new Promise(m=>setTimeout(m,50))}}function u(){a.value||(a.value=!0,(async()=>{if(!(o.sections.length||o.pageBuilder)){ft(window),l();return}const h=await us(window);if(!h){l();return}if(h==="static"){await ms(window)?ft(window):window.Statamic?.$toast?.error(f(window,"section_new_failed")),l();return}vs(window,{afterUid:o.sections.length?o.sections[o.sections.length-1].uid:null,onDone:c=>{l(),r(c?.uid)},onError:l,onClose:l})})())}function k(h){const c=!!o.query;o.query=h,c!==!!h&&o.onQuery?.()}return(h,c)=>(v(),g("div",gs,[S("div",ks,[S("div",ys,_(e.title),1),c[5]||(c[5]=Tn('<div data-sve-right-actions data-v-ab879dbf><button type="button" data-sve-right-pin aria-pressed="false" data-v-ab879dbf></button><button type="button" data-sve-close aria-label="Close" data-v-ab879dbf><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-ab879dbf><path d="M18 6 6 18" data-v-ab879dbf></path><path d="m6 6 12 12" data-v-ab879dbf></path></svg></button></div>',1))]),S("div",bs,[S("label",{class:"sve-ht-search",title:d(t)},[S("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:Es}),S("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:d(t),"aria-label":d(t),value:d(o).query,autocomplete:"off",spellcheck:"false",onInput:c[0]||(c[0]=i=>k(i.target.value)),onKeydown:[c[1]||(c[1]=b(()=>{},["stop"])),c[2]||(c[2]=W(b(i=>k(""),["prevent"]),["escape"]))]},null,40,Ts),d(o).query?(v(),g("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":d(t),innerHTML:Ls,onClick:c[3]||(c[3]=i=>k(""))},null,8,_s)):P("",!0)],8,xs),d(s)&&(d(o).sections.length||d(o).pageBuilder||d(o).rows.length)?(v(),g("button",{key:0,type:"button",class:"sve-ht-new",title:d(n),"aria-label":d(n),innerHTML:$s,onClick:u},null,8,Ss)):P("",!0)]),d(F).inSidebar?P("",!0):(v(),Te(Kn,{key:0})),c[6]||(c[6]=S("div",{"data-sve-html-tree-list":""},null,-1)),_n(Xo),d(o).exitOpen&&!d(F).inSidebar?(v(),g("div",ws,[S("span",{class:"sve-tree-exit__name",title:d(o).exitName},_(d(o).exitName),9,Cs),S("button",{type:"button",class:"sve-tree-exit__go",title:d(o).exitTitle,onClick:c[4]||(c[4]=i=>d(o).onExit?.())},_(d(o).exitLabel),9,Ps)])):P("",!0)]))}},Kt=ke(Hs,[["__scopeId","data-v-ab879dbf"]]);function Vt(e){return String(e||"").trim().toLowerCase()}function Nt(e,t){return t?[e.name,e.tag,e.klass,e.label,e.src].filter(s=>typeof s=="string"&&s).join(" ").toLowerCase().includes(t):!0}function Is(e,t){const s=Vt(t);if(!s)return{rows:e,hits:new Set};const n=new Set;for(const r of e)Nt(r,s)&&n.add(r.path);const a=[...n];return{rows:e.filter(r=>n.has(r.path)||a.some(u=>u.startsWith(`${r.path}/`))),hits:n}}const As=["title"],Ms={"data-sve-ht-indent":"","aria-hidden":"true"},Rs=["data-sve-ht-cat"],Ds={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},Os={key:2,"data-sve-ht-letter":""},Bs=["innerHTML"],Fs=["title"],js=["title"],qs={key:1,"data-sve-ht-kind":""},Ks={key:3,"data-sve-ht-name":""},Vs={key:4,"data-sve-ht-actions":""},Ns=["disabled","title","innerHTML"],zs=["disabled","title"],Us=["disabled","title"],Xs=["disabled","title"],Ys=["data-sve-ht-id"],Ws='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',Zs='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',Gs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Js='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',Qs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',ea='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',ta={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const t=co(window),s=f(window,"section_fields");function n(){const c=uo();if(!c){window.Statamic?.$toast?.error(f(window,"section_fields_none"));return}ho(window,c)}function a(c){return c.kind==="component"?c.src?`partial:${c.src}`:c.tag:c.name?`${c.tag} ${c.name}`:c.tag}function l(c){return!!c.section}function r(c){return!!c.context}function u(c){if(l(c)){o.onSection?.(c.section);return}if(r(c)){o.onContextRow?.(c.id);return}o.onSelect?.(c.id)}function k(c,i){const m={"data-sve-ht-id":c.id};return c.current&&(m["data-sve-ht-current"]=""),c.hidden&&(m["data-sve-ht-hidden"]=""),m["data-sve-ht-cat"]=c.cat||"other",m["data-sve-ht-depth"]=String(c.depth),i&&(m["data-sve-ht-dim"]=""),r(c)&&(m["data-sve-ht-context"]=c.context),l(c)&&(m["data-sve-ht-sec"]=""),!l(c)&&o.dropId===c.id&&o.dropPlace&&(m["data-sve-ht-drop"]=o.dropPlace),m}function h(c){return!c.hidden||c.wrapFrom!=null}return(c,i)=>(v(),g(A,null,[S("div",he({"data-sve-ht-row":""},k(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:i[26]||(i[26]=m=>u(e.row)),onDblclick:i[27]||(i[27]=b(m=>l(e.row)||r(e.row)?null:d(o).onRename?.(e.row.id),["prevent"])),onKeydown:[i[28]||(i[28]=W(b(m=>u(e.row),["prevent"]),["enter"])),i[29]||(i[29]=W(b(m=>u(e.row),["prevent"]),["space"]))],onPointerdown:i[30]||(i[30]=m=>l(e.row)||r(e.row)?null:d(o).onPointerDown?.(m,e.row.id)),onContextmenu:i[31]||(i[31]=b(m=>l(e.row)||r(e.row)?null:d(o).onContext?.(m,e.row.id),["prevent","stop"]))}),[S("span",Ms,[(v(!0),g(A,null,q(e.row.guides||[],(m,$)=>(v(),g("i",{key:$,"data-sve-ht-cat":m},null,8,Rs))),128))]),e.row.hasChildren||e.row.emptyBlock?(v(),g("button",he({key:0,type:"button","data-sve-ht-twist":""},e.row.shut?{"data-sve-ht-shut":""}:{},{innerHTML:Zs,onClick:i[0]||(i[0]=b(m=>l(e.row)?d(o).onSection?.(e.row.section):d(o).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:i[1]||(i[1]=b(()=>{},["stop"])),onDblclick:i[2]||(i[2]=b(()=>{},["stop"]))}),null,16)):(v(),g("span",Ds)),e.row.letter?(v(),g("span",Os,_(e.row.letter),1)):(v(),g("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Bs)),S("span",{"data-sve-ht-text":"",title:d(o).renameTitle},[!e.row.kind&&!l(e.row)&&!r(e.row)?(v(),g("button",{key:0,type:"button","data-sve-ht-tag":"",title:d(o).tagTitle,onClick:i[3]||(i[3]=b(()=>{},["stop","prevent"])),onPointerdown:i[4]||(i[4]=b(()=>{},["stop"])),onDblclick:i[5]||(i[5]=b(m=>d(o).onTagChange?.(m,e.row.id),["stop","prevent"]))},_(e.row.tag),41,js)):(v(),g("span",qs,_(e.row.tag),1)),d(o).editingId===e.row.id&&!l(e.row)?Ke((v(),g("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":i[6]||(i[6]=m=>d(o).draft=m),onMousedown:i[7]||(i[7]=b(()=>{},["stop"])),onPointerdown:i[8]||(i[8]=b(()=>{},["stop"])),onClick:i[9]||(i[9]=b(()=>{},["stop"])),onDblclick:i[10]||(i[10]=b(()=>{},["stop"])),onKeydown:[i[11]||(i[11]=b(()=>{},["stop"])),i[12]||(i[12]=W(b(m=>d(o).onRenameCommit?.(),["prevent"]),["enter"])),i[13]||(i[13]=W(b(m=>d(o).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:i[14]||(i[14]=m=>d(o).onRenameCommit?.())},null,544)),[[Pt,d(o).draft]]):(v(),g("span",Ks,_(e.row.name),1))],8,Fs),!l(e.row)&&!r(e.row)?(v(),g("span",Vs,[h(e.row)?(v(),g("button",{key:0,type:"button","data-sve-ht-eye":"",disabled:!d(o).canEdit,title:d(o).canEdit?e.row.hidden?d(o).showTitle:d(o).hideTitle:d(o).lockedTitle,innerHTML:e.row.hidden?Js:Gs,onClick:i[15]||(i[15]=b(m=>d(o).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:i[16]||(i[16]=b(()=>{},["stop"])),onDblclick:i[17]||(i[17]=b(()=>{},["stop"]))},null,40,Ns)):P("",!0),d(t)&&e.row.fieldsIcon?(v(),g("button",{key:1,type:"button","data-sve-ht-fields":"",disabled:!d(o).canEdit,title:d(o).canEdit?d(s):d(o).lockedTitle,innerHTML:Ws,onClick:b(n,["stop","prevent"]),onPointerdown:i[18]||(i[18]=b(()=>{},["stop"])),onDblclick:i[19]||(i[19]=b(()=>{},["stop"]))},null,40,zs)):P("",!0),S("button",{type:"button","data-sve-ht-dup":"",disabled:!d(o).canEdit,title:d(o).canEdit?d(o).duplicateTitle:d(o).lockedTitle,innerHTML:Qs,onClick:i[20]||(i[20]=b(m=>d(o).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:i[21]||(i[21]=b(()=>{},["stop"])),onDblclick:i[22]||(i[22]=b(()=>{},["stop"]))},null,40,Us),S("button",{type:"button","data-sve-ht-del":"",disabled:!d(o).canEdit,title:d(o).canEdit?d(o).deleteTitle:d(o).lockedTitle,innerHTML:ea,onClick:i[23]||(i[23]=b(m=>d(o).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:i[24]||(i[24]=b(()=>{},["stop"])),onDblclick:i[25]||(i[25]=b(()=>{},["stop"]))},null,40,Xs)])):P("",!0)],16,As),e.row.emptyBlock&&!e.row.shut?(v(),g("div",he({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},d(o).dropId===e.row.id&&d(o).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),_(d(o).slotText),17,Ys)):P("",!0)],64))}},De=ke(ta,[["__scopeId","data-v-e9e0092a"]]),na=["data-sve-ht-look"],oa={key:0,class:"sve-ht-empty"},sa={key:1,class:"sve-ht-empty"},aa={key:0,class:"sve-ht-empty"},ra={__name:"HtmlTreeList",setup(e){const t=ue(()=>Vt(o.query)),s=ue(()=>Is(o.rows,t.value)),n=ue(()=>s.value.rows),a=ue(()=>t.value?o.sections.filter(u=>Nt(u.row,t.value)||u.current&&u.ready&&n.value.length>0):o.sections),l=ue(()=>!!t.value&&!a.value.length&&!n.value.length);function r(u){return!!t.value&&!s.value.hits.has(u.path)}return(u,k)=>(v(),g("div",he({class:"sve-ht-root","data-sve-ht-look":d(o).look,style:d(o).familyStyle},d(o).dragging?{"data-sve-ht-dragging":""}:{}),[!d(o).rows.length&&!d(o).sections.length?(v(),g("div",oa,_(d(o).emptyText),1)):l.value?(v(),g("div",sa,_(d(o).searchEmpty),1)):P("",!0),d(o).sections.length?(v(!0),g(A,{key:2},q(a.value,h=>(v(),g("div",he({key:h.uid},{ref_for:!0},h.current?{"data-sve-ht-branch":""}:{}),[h.ready?(v(),g(A,{key:0},[(v(!0),g(A,null,q(n.value,c=>(v(),Te(De,{key:c.id,row:c,dim:r(c)},null,8,["row","dim"]))),128)),d(o).rows.length?P("",!0):(v(),g("div",aa,_(d(o).emptyText),1))],64)):(v(),Te(De,{key:1,row:h.row,dim:d(o).inComponent},null,8,["row","dim"]))],16))),128)):d(o).rows.length?(v(!0),g(A,{key:3},q(n.value,h=>(v(),Te(De,{key:h.id,row:h,dim:r(h)},null,8,["row","dim"]))),128)):P("",!0)],16,na))}},mt=ke(ra,[["__scopeId","data-v-2240400d"]]);let Oe=null;function ia(e){return Oe||(Oe=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{pages:[]}).then(t=>Array.isArray(t.pages)?t.pages:[]).catch(()=>[])),Oe}let we=null;function Be(){we?.dismiss(),we=null}function la(e,t,s){Be();const n=t?.getBoundingClientRect?.(),a={x:n?n.left:0,y:n?n.bottom+4:0};ia(e).then(l=>{const r=l.length?l.map(u=>({label:u.title||u.url,onPick:()=>{Be(),s(u.url)}})):[{label:f(e,"component_props_pages_none"),onPick:null}];Be(),we=ae(e.document,et,{items:r,x:a.x,y:a.y,onClose:()=>{we=null}})})}const zt="sve-html-tree-labels";function Ut(){try{const e=globalThis.localStorage?.getItem(zt);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function ca(e){try{globalThis.localStorage?.setItem(zt,JSON.stringify(e))}catch{}}function Xt(e){return String(e||"_")}function Yt(e){const t=Ut()[Xt(e)];return t&&typeof t=="object"?{...t}:{}}function da(e,t,s){const n=s?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function ua(e,t,s,n){if(!t)return;const a=Xt(e),l=Ut(),r={...l[a]||{}},u=String(s||"").replace(/\s+/g," ").trim(),k=String(n||"").trim();!u||u===k?delete r[t]:r[t]=u,Object.keys(r).length?l[a]=r:delete l[a],ca(l)}const ha=/^@(media|supports|container|layer|scope)\b/i;function pa(e){const t=String(e||""),s=[];let n=0,a=0;for(;n<t.length;){if(t[n]==="{"&&t[n+1]==="{"){const u=t.indexOf("}}",n+2);n=u===-1?t.length:u+2;continue}if(t[n]==="/"&&t[n+1]==="*"){const u=t.indexOf("*/",n+2);n=u===-1?t.length:u+2;continue}if(t[n]==='"'||t[n]==="'"){const u=t[n];for(n+=1;n<t.length&&t[n]!==u;)n+=t[n]==="\\"?2:1;n+=1;continue}if(t[n]!=="{"){n+=1;continue}let l=1,r=n+1;for(;r<t.length&&l>0;){if(t[r]==="{"&&t[r+1]==="{"){const u=t.indexOf("}}",r+2);r=u===-1?t.length:u+2;continue}if(t[r]==="/"&&t[r+1]==="*"){const u=t.indexOf("*/",r+2);r=u===-1?t.length:u+2;continue}if(t[r]==='"'||t[r]==="'"){const u=t[r];for(r+=1;r<t.length&&t[r]!==u;)r+=t[r]==="\\"?2:1;r+=1;continue}t[r]==="{"?l+=1:t[r]==="}"&&(l-=1),r+=1}s.push({selector:t.slice(a,n).trim(),body:t.slice(n+1,r-1),from:a,to:r,text:t.slice(a,r).trim()}),n=r,a=r}return s}function vt(e){const t=String(e||""),s=new Set,n=new Set,a=new Set;for(const l of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const r of l[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))r&&(s.add(r),s.add(r.replace(/([:./%!#()[\],])/g,"\\$1")));for(const l of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))l[2].trim()&&n.add(l[2].trim());for(const l of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))a.add(l[1].toLowerCase());return{classes:s,ids:n,tags:a}}function gt(e,t){const s=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),n=[...s.matchAll(/\.((?:\\.|[\w-])+)/g)].map(r=>r[1]),a=[...s.matchAll(/#((?:\\.|[\w-])+)/g)].map(r=>r[1]);if(n.length||a.length){const r=u=>u.replace(/\\(.)/g,"$1");return n.every(u=>t.classes.has(u)||t.classes.has(r(u)))&&a.every(u=>t.ids.has(r(u)))}const l=[...s.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(r=>r[2].toLowerCase());return l.length>0&&l.every(r=>t.tags.has(r))}function fa(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function ma(e,t,s){const n=fa(e);if(!n.length)return"keep";const a=n.filter(r=>gt(r,t));return a.length?a.length===n.length&&!n.some(r=>gt(r,s))?"move":"copy":"keep"}function Wt(e,t,s){const n=String(e||""),a=vt(t),l=vt(s),r=[],u=[];let k=0;for(const h of pa(n)){const c=n.slice(h.from,h.to),i=c.match(/^\s*/)[0];if(k=h.to,ha.test(h.selector)){const $=Wt(h.body,t,s);$.move.trim()&&r.push(`${h.selector} {
${$.move.trim()}
}`),$.keep.trim()&&u.push(`${i}${h.selector} {
${$.keep.trim()}
}`);continue}const m=h.selector.startsWith("@")?"keep":ma(h.selector,a,l);if(m==="move"){r.push(h.text);continue}m==="copy"&&r.push(h.text),u.push(c)}return u.push(n.slice(k)),{move:r.join(`

`).trim(),keep:u.join("").replace(/\n{3,}/g,`

`).trim()}}const va="/!/sve/component";function ga(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let s=null;for(const n of t){if(!n.trim())continue;const a=n.match(/^[ \t]*/)[0].length;s=s===null?a:Math.min(s,a)}return s?t.map(n=>n.slice(s)).join(`
`):t.join(`
`)}function ka(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function ya(e,t){if(!Nn(e))return"";try{return await(await wn(()=>import("./tw-compile-D8Xdoe3O.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(s){return console.error("[sve] component tailwind compile",s),""}}async function ba(e,t){const s=await e.fetch(va,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":$t(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!s.ok){const n=new Error(String(s.status));throw n.status=s.status,n}return s.json()}function kt(e,t){const{from:s,to:n}=Vn(e,t),a=e.slice(s,n);if(!a.trim())return null;const l=e.slice(0,s)+e.slice(n),r=y("dock:css"),u=Wt(typeof r=="string"?r:"",a,l);return{html:ga(a),css:u.move,keepCss:u.keep,lead:ka(a),from:s,to:n}}function xa(e,t,{onDone:s,onError:n}={}){if(y("dock:is-locked")===!0)return;const a=y("dock:html");if(typeof a!="string"||!t)return;const l=kt(a,t);if(!l)return;const r=ae(e.document,Sn,{heading:f(e,"component_new"),nameLabel:f(e,"component_name"),placeholder:f(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:f(e,"cancel"),saveLabel:f(e,"component_create"),onOk:u=>{r.dismiss(),(async()=>{try{const k=await ya(e,l.html),h=y("dock:html"),c=typeof h=="string"&&h===a?l:kt(h,t);if(!c)return;const i=await ba(e,{name:u,html:c.html,css:c.css,js:"",tw:k}),m=y("dock:html"),$=m.slice(0,c.from)+c.lead+i.tag+m.slice(c.to);y("dock:set-html",$),c.css.trim()&&y("dock:set-css",c.keepCss),s?.(i)}catch(k){n?.(k)}})()}})}function Ta(e,t,s){const n=String(e||"");if(!t||t.kind!=="antlers")return n;const a=String(s||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?Ca(n,t,a):t.tag==="else"||!a?n:n.slice(0,t.from)+`{{ ${t.tag} ${a} }}`+n.slice(t.openTo)}function ze(e,t,s,n){return pe(e,t,{kind:s,name:n})}function pe(e,t,s={}){const n=String(e||"");if(!t||t.antlers!=="loop")return n;const a=t.loopKind==="collection"?"collection":"field",l=s.kind??a,r=String(s.name??t.expr??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(r))return n;const u=s.sortDir??t.sortDir??"",k=String(s.sortField??t.sortField??"").trim(),h=String(s.limit??t.limit??"").trim(),c=Zt(n,t);if(!c)return n;const i=l===a?t.params:"",m=l==="collection"?_a(r,k,u,h,i):Sa(r,k,u,h,i),$=l==="collection"?"collection":r;return n.slice(0,t.from)+m+n.slice(t.openTo,c.from)+`{{ /${$} }}`+n.slice(c.to)}function _a(e,t,s,n,a){const l=wa(a).replace(/\bsort\s*=\s*["'][^"']*["']/g,"").replace(/\blimit\s*=\s*["']?\d+["']?/g,"").replace(/\s+/g," ").trim(),r=[`collection from="${e}"`];return s==="random"?r.push('sort="random"'):t&&r.push(`sort="${t}${s==="desc"?":desc":":asc"}"`),n&&r.push(`limit="${n}"`),l&&r.push(l),`{{ ${r.join(" ")} }}`}function Sa(e,t,s,n,a){const l=String(a||"").split("|").map(u=>u.trim()).filter(u=>u&&!/^from\s*=/.test(u)&&!/^sort\s*:/.test(u)&&!/^reverse$/.test(u)&&!/^shuffle$/.test(u)&&!/^limit\s*:/.test(u)),r=[e,...l];return s==="random"?r.push("shuffle"):t&&(r.push(`sort:${t}`),s==="desc"&&r.push("reverse")),n&&r.push(`limit:${n}`),`{{ ${r.join(" | ")} }}`}function wa(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function Zt(e,t){const n=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return n?{from:t.from+n.index,to:t.from+n.index+n[0].length}:null}function Ca(e,t,s){return pe(e,t,{name:s})}function Pa(e,t,s){const n=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return n;const a=Zt(n,t);if(!a)return n;const r=(n.slice(0,a.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],u=s==="else"?"{{ else }}":"{{ elseif true }}";return`${n.slice(0,a.from)}${u}
${r}${n.slice(a.from)}`}const R=Yn("sve-call-values"),me=new Set;let yt=null;const $a="__sve-html-tree-style",D=new Set;let Ue="",ne=!1,Fe=null,ye=!0,V="",ve=0,Gt="";const Z=new Map,oe=new Set;let B="",Jt=!1,H=null,Ce=null,Pe=0,Xe=null,ge=[],J=null,fe=null,$e=null,Ee=null,Ye=null,Le=!1,Q=null,G=null;function j(e){return e.getElementById(_e)}function Ea(e){Pn(e,$a,`
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
      ${dt("light")}
      --sve-ht-pick: rgba(56,88,233,.14);
      --sve-ht-pick-hover: rgba(56,88,233,.22);
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${dt("dark")}
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
  `)}function O(){const e=y("dock:html");return typeof e=="string"?e:""}function Qt(e){return!!y("dock:is-open",e)}function ce(e,{save:t=!1}={}){return st()||y("dock:set-html",e)!==!0?!1:(t&&y("dock:save-now"),!0)}function bt(e){const t=y("dock:component-exit-state")||{};if(o.exitOpen=!!t.open,!t.open){o.onExit=null;return}o.exitName=t.name||"",o.exitLabel=f(e,"component_exit"),o.exitTitle=f(e,t.back?"component_exit_back":"component_exit_close"),o.onExit=()=>{y("dock:exit-component"),C(e)}}function La(e,t){const s=Rn(e);if(!s||t.type!==s)return"";const n=Dn(t[s]);return n&&On(e,n)?.section_type||""}const te=[];let je=!1,We=!1;function qe(e,t){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(t,{timeout:2e3});return}e.setTimeout(t,200)}function Ha(e,t){for(const s of t){const n=s.type;!n||Z.has(n)||oe.has(n)||te.includes(n)||te.push(n)}Je.htmlTreePrefetchArmed&&ot(e)}function fr(e){Je.htmlTreePrefetchArmed=!0,ot(e)}function ot(e){if(je||!te.length)return;je=!0;const t=()=>{const s=te.shift();if(!s){je=!1;return}if(Z.has(s)||oe.has(s)){qe(e,t);return}oe.add(s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(s)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{typeof n?.html=="string"&&(Z.set(s,n.html),We&&(We=!1,C(e)))}).catch(()=>{}).finally(()=>{oe.delete(s),qe(e,t)})};qe(e,t)}function st(){return!!B}function Ia(e){const t=new Map,s=Et(e);if(!s)return t;for(const n of s.querySelectorAll("[data-sid]")){const a=n.getAttribute("data-sid");a&&!t.has(a)&&t.set(a,n.tagName.toLowerCase())}return t}function Aa(e,t){const s=Qe(e)||"page_sections";for(const n of Mt(t)||[]){const a=Rt(n.values),l=a&&typeof a=="object"?a[s]:null;if(Array.isArray(l))return!0}return!1}function en(e,t){const s=Qe(e)||"page_sections",n=Ia(e),a=[];for(const l of Mt(t)||[]){const r=Rt(l.values),u=r&&typeof r=="object"?r[s]:null;if(Array.isArray(u)){u.forEach(k=>{if(!k||typeof k!="object"||Array.isArray(k)||typeof k.type!="string")return;const h=[k._visual_id,k.id,k._id].filter(w=>typeof w=="string"&&w!=="");if(!h.length)return;const c=La(e,k)||k.type,i=typeof k._sve_label=="string"?k._sve_label.trim():"",m=h.map(w=>n.get(w)).find(Boolean)||"section",$=Yt(k.type)[`0:${m}`];a.push({uid:h[0],ids:h,type:k.type,tag:m,label:(typeof $=="string"&&$.trim()?$.trim():"")||i||Dt(e,c)?.display||Ne(c)||c,svg:Ft(m,"",null).svg||Wn.section,cat:It(m),enabled:k.enabled!==!1})});break}}return a}function Ma(e,t,s){if(!s.length)return"";const n=y("dock:current-type")||"",a=y("dock:current-uid"),l=!!y("dock:component-exit-state")?.open;if(a){const r=An(a,t),u=s.find(k=>k.ids.some(h=>r.includes(h)));if(u&&(l||u.type===n))return u.uid}return s.find(r=>r.type===n)?.uid||""}function Ra(e,t,s,n){const a=t.find(w=>w.uid===s),l=y("dock:component-src"),r=y("dock:type-stack")||[];if(!a||!l||!r.length)return null;const u=r.map(w=>w.type).filter(w=>!Z.get(w));if(u.length)return Da(e,u),null;const k=[],h=new Set,c=new Set;let i=w=>k.push(...w),m=null,$=0;for(let w=0;w<r.length;w+=1){const K=w+1<r.length?r[w+1].src:l,be=I=>({...I,id:`ctx${w}:${I.id}`,path:`ctx${w}/${I.path}`,ctxLevel:w,children:I.children.map(be)}),xe=Ae(Z.get(r[w].type)).map(be),z=[],E=(I,M)=>{for(const L of I){if(L.kind==="component"&&L.src===K)return z.push(...M,L),L;const p=E(L.children,[...M,L]);if(p)return p}return null};if(m=K?E(xe,[]):null,!m)return null;const N=new Set(z.map(I=>I.id)),de=(I,M)=>{for(const L of I)L.children.length&&(N.has(L.id)?D.has(L.path):on(L,M))&&h.add(L.id),de(L.children,M+1)};de(xe,$),i(xe),c.add(m.id),$+=z.length,i=(I=>M=>{I.children=M})(m)}for(const w of sn(n))h.add(w);return D.has(m.path)&&h.add(m.id),m.children=n,{tree:k,folds:h,hostId:m.id,hostIds:c,levels:r.length,rootId:k.find(w=>!w.kind)?.id||"",label:a.label,svg:a.svg,cat:a.cat}}function Da(e,t){for(const s of t)!te.includes(s)&&!oe.has(s)&&te.push(s);We=!0,ot(e)}function Oa(e,t,s){const n=y("dock:component-exit-state");if(n?.open)return Ne(n.name)||n.name||"";if(s)return t.find(l=>l.uid===s)?.label||"";const a=y("dock:current-type")||"";return Dt(e,a)?.display||Ne(a)||""}function tn(e,t,s,n,a){const l=s.find(u=>u.uid===n);if(!l||n===a)return;D.clear(),H=null,ye=!1,se(),Me(),V=n,Gt=O(),B=Z.get(l.type)||"",B&&(H=He(Ae(B))||null),Jt=(y("dock:current-type")||"")===l.type,e.clearTimeout(ve),ve=e.setTimeout(()=>{V="",ne=!1,C(e)},4e3),C(e);const r=()=>jn(l.uid,t,e,{clampToSection:!0});Mn(l.uid,t,e,r),re({source:le,type:ie.SVE_ACTIVATE,ids:l.ids},e),e.setTimeout(()=>C(e),0)}function nn(e,t){if(!t)return!1;for(const s of e||[])if(s.id===t||nn(s.children,t))return!0;return!1}function He(e){for(const t of e||[]){if(!t.kind)return t.id;const s=He(t.children);if(s)return s}return""}function on(e,t){return D.has(e.path)?t===0:t>0}function sn(e){const t=new Set,s=(n,a)=>{for(const l of n)l.children.length&&on(l,a)&&t.add(l.id),s(l.children,a+1)};return s(e,0),t}function C(e){const t=e.document,n=j(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;Ea(t),Un(e);const a=O();B&&B===a&&(B="");const l=B||a,r=Ae(l);ge=r;const u=y("dock:current-type")||"",k=Yt(u),h=en(e,t),c=Aa(e,t);u&&a&&!B&&Z.set(u,a),Ha(e,h);const i=Ma(e,t,h);if(c&&!h.length){ge=[],o.rows=[],o.sections=[],o.pageBuilder=!0,o.emptyText=f(e,"html_tree_empty"),o.canEdit=!y("dock:is-locked"),o.look=ut(e),o.onRefresh=()=>C(e),o.onSection=null,bt(e),Se(n,mt),xt(e,[]);return}o.pageBuilder=c;const m=`${u}|${i}`;let $=!1;m!==Ue&&(Ue=m,D.clear(),Fe!==null&&l!==Fe?$=!0:ne=l),($||ne!==!1&&l!==ne)&&(ne=!1,D.clear(),H=He(r)||null),Fe=l,V&&(V===i||!h.length)&&(Jt||l!==Gt)&&(e.clearTimeout(ve),V="",ne=!1,nn(r,H)||(D.clear(),H=He(r)||null));const w=h.some(p=>p.uid===V)?V:"",K=ye?"":w||i,be=!!(w||i),z=!!(y("dock:component-exit-state")||{}).open,E=z?Ra(e,h,K,r):null,N=E?ht(E.tree,o.query?new Set:E.folds):ht(r,o.query?new Set:sn(r));!l.trim()&&!Qt(t)?o.emptyText=f(e,"html_tree_need_dock"):o.emptyText=f(e,"html_tree_empty"),o.slotText=f(e,"antlers_drop_here"),o.dataTitle=f(e,"data_vars_title"),o.pageTitle=f(e,"component_props_page"),o.renameTitle=f(e,"html_tree_rename"),o.tagTitle=f(e,"tw_tag"),o.hideTitle=f(e,"html_tree_hide"),o.showTitle=f(e,"html_tree_show"),o.duplicateTitle=f(e,"html_tree_duplicate"),o.deleteTitle=f(e,"html_tree_delete"),o.lockedTitle=f(e,"html_tree_locked"),o.searchEmpty=f(e,"html_tree_search_empty"),o.canEdit=!y("dock:is-locked"),o.look=ut(e),In(e),o.onQuery=()=>C(e),bt(e),o.inComponent=z,o.onContextRow=p=>{if(!E||p===E.hostId)return;const x=N.find(T=>T.id===p)?.ctxLevel??E.levels-1;y("dock:exit-component",E.levels-x),C(e)},o.onSelect=p=>{const x=N.find(T=>T.id===p);x&&Bt(e,x.path)||rt(e,p,N)},o.onTwist=p=>{const x=N.find(T=>T.id===p)?.path;x&&(D.has(x)?D.delete(x):D.add(x),C(e))},o.onTagChange=(p,x)=>{const T=o.rows.find(U=>U.id===x);T&&!st()&&Xn(e,p.currentTarget,T)},o.onRename=p=>Fa(e,p),o.onRenameCommit=()=>Tt(e,!0),o.onRenameCancel=()=>Tt(e,!1),o.onHide=p=>ja(e,p),o.onDuplicate=p=>qa(e,p),o.onDelete=p=>Va(e,p),o.onPointerDown=(p,x)=>Xa(e,p,x),o.onContext=(p,x)=>za(e,p,x),o.onInspectCommit=p=>Qa(e,p),o.onPropValue=(p,x,T)=>wt(e,p,x,T),o.onPropPage=(p,x)=>la(e,p,T=>wt(e,x,T,!1)),o.onLoopKind=p=>er(e,p),o.onAddBranch=p=>tr(e,p),o.onLoopSortField=p=>{const x=Ie(),T=String(p||"").trim();if(!x)return;const U=G?.id===x.id?G.dir:"",X=x.sortDir||U||"asc";G=null,ee(e,(dn,un)=>pe(dn,un,{sortField:T,sortDir:X}))},o.onLoopSortDir=p=>{const x=Ie(),T=String(p||"");if(x){if((T==="asc"||T==="desc")&&!x.sortField){G={id:x.id,dir:T},Ze(e,x);return}G=null,ee(e,(U,X)=>pe(U,X,{sortDir:T,sortField:T==="asc"||T==="desc"?X.sortField:""}))}},o.onLoopLimit=p=>ee(e,(x,T)=>pe(x,T,{limit:String(p||"").replace(/\D/g,"")})),o.onPropHost=p=>p?R.mount(p):R.unmount(),o.onInspectData=(p,x)=>{y("dock:data-menu",{anchor:p,at:N.find(T=>T.id===H)?.from,onPick:T=>x(String(T?.var||"").trim())})};const de=N.find(p=>!p.kind)?.id,I=z?"":Oa(e,h,K),M=K&&!z?h.find(p=>p.uid===K):null;o.rows=N.map(p=>{const x=Ft(p.tag,p.kind,p.antlers),T=!!E&&p.id===E.rootId,U=p.id===de&&I?I:T?E.label:p.klass,X=p.id===de;return{...p,base:U,name:da(U,p.path,k),current:p.id===H,letter:T?"":x.letter||"",svg:X&&M?M.svg:T?E.svg:x.svg||"",cat:T?E.cat:It(p.tag,p.kind,p.antlers),context:E?E.hostIds.has(p.id)?"host":p.id.startsWith("ctx")?"dim":"":"",sectionRoot:X&&M?M.uid:"",fieldsIcon:!!(X&&M)}});const L=[];for(const p of o.rows)L.length=p.depth,p.guides=L.slice(),L[p.depth]=p.cat;o.sections=be?h.map(p=>{const x=!!K&&p.uid===K;return{...p,current:x,ready:x&&(!w||!!B),row:{id:`sec:${p.uid}`,section:p.uid,tag:p.tag,name:p.label,kind:"",svg:p.svg,cat:p.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:x,hidden:!p.enabled}}}):[],o.onSection=p=>tn(e,t,h,p,K),o.onRefresh=()=>C(e),Ze(e,o.rows.find(p=>p.id===H)),Se(n,mt),xt(e,r)}function xt(e,t){j(e.document)&&an(e,t)}function an(e,t){const s=t[0],n=!!y("dock:component-src"),a=n?"":y("dock:current-uid")||"";re({source:le,type:ie.SVE_HTML_PICK,on:!0,uid:a,all:n,tag:s?.tag||"",klass:s?.klass||"",nodes:po(t)},e)}function Ba(e){if(!e)return;const t=(s,n)=>{for(const a of s||[]){if(a.path===e)return!0;if(t(a.children,n+1))return n===0?D.delete(a.path):D.add(a.path),!0}return!1};t(ge,0)}function Fa(e,t){if(Le)return;const s=o.rows.find(n=>n.id===t);!s||s.kind||(H=t,o.rows.forEach(n=>{n.current=n.id===t}),o.editingId=t,o.draft=s.name,e.setTimeout(()=>{const n=j(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function Tt(e,t){const s=o.editingId;if(!s)return;const n=o.rows.find(a=>a.id===s);o.editingId=null,t&&n&&ua(y("dock:current-type")||"",n.path,o.draft,n.base||n.klass),o.draft="",C(e)}function ja(e,t){at(e,t,ro)}function qa(e,t){at(e,t,io)}function rn(e,t){Bn(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const s=e.document;qn({uid:t},s,e)})}function Ka(e,t,s){V===s&&(e.clearTimeout(ve),V="",B=""),H=null,ye=!1,Ue="";const n=en(e,t),a=n.find(l=>l.uid!==s)||n[0];a?tn(e,t,n,a.uid,""):(B="",o.rows=[],o.sections=[],o.pageBuilder=!0,C(e)),e.setTimeout(()=>{j(e.document)&&C(e)},0)}At("row:removed",({uid:e,parentPath:t,doc:s,win:n})=>{t!==Qe(n)||!j(n.document)||Ka(n,s,e)});function Va(e,t){const s=o.sections?.find(a=>a.row?.id===t),n=s?s.row?.section||s.uid:o.rows.find(a=>a.id===t)?.sectionRoot;if(n){rn(e,n);return}at(e,t,lo)}function at(e,t,s){if(y("dock:is-locked"))return;const n=O(),a=o.rows.find(r=>r.id===t);if(!a)return;const l=s(n,a);l!==n&&ce(l)}function se(){Q?.dismiss(),Q=null}function Na(e,t,s){const n=s.row?.section||s.uid;n&&(Q=ae(e.document,et,{items:[{label:f(e,"html_tree_remove_section"),danger:!0,onPick:()=>{se(),rn(e,n)}}],x:t.clientX,y:t.clientY,onClose:()=>{Q=null}}))}function za(e,t,s){se();const n=o.sections?.find(u=>u.row?.id===s);if(n){Na(e,t,n);return}const a=o.rows.find(u=>u.id===s);if(!a)return;rt(e,s,o.rows);const l={x:t.clientX,y:t.clientY},r=u=>{u.length&&(Q?.dismiss(),Q=ae(e.document,et,{items:u,x:l.x,y:l.y,onClose:()=>{Q=null}}))};if(a.kind==="component"){Ua(e,a,r);return}o.canEdit&&r([{label:f(e,"component_make"),onPick:()=>{se(),xa(e,a,{onDone:()=>C(e),onError:u=>{e.alert(u?.status===409?f(e,"component_exists"):f(e,"component_failed"))}})}}])}const _t=(e,t)=>{se(),y("dock:open-template",t)};function Ua(e,t,s){if(!Gn(t.src)){s([{label:f(e,"component_open_named",{name:t.name||t.src}),onPick:()=>_t(e,`view:partials/${t.src}`)}]);return}s([{label:f(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const a=Array.isArray(n.items)?n.items:[];s(a.length?a.map(l=>({label:f(e,"component_open_named",{name:l.label}),onPick:()=>_t(e,l.type)})):[{label:f(e,"component_none"),onPick:null}])}).catch(()=>s([{label:f(e,"component_none"),onPick:null}]))}function Xa(e,t,s){if(t.button!==0||y("dock:is-locked")||o.editingId||t.target?.closest?.("button, input"))return;Me(),J=s,fe={x:t.clientX,y:t.clientY},$e=t.currentTarget,Ee=t.pointerId;const n=l=>Ya(e,l),a=l=>Wa(e,l);Ye=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),Ye=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function Ya(e,t){if(!J||!fe)return;const s=t.clientX-fe.x,n=t.clientY-fe.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{$e?.setPointerCapture?.(Ee)}catch{}}t.preventDefault();const a=e.document.elementFromPoint(t.clientX,t.clientY),l=a?.closest?.("[data-sve-ht-slot]");if(l){const i=l.getAttribute("data-sve-ht-id");if(i&&i!==J){o.dropId=i,o.dropPlace="inside";return}}const r=a?.closest?.("[data-sve-ht-row]"),u=r?.getAttribute("data-sve-ht-id");if(!u||u===J){o.dropId=null,o.dropPlace=null;return}const k=o.rows.find(i=>i.id===u),h=o.rows.find(i=>i.id===J);if(!k||k.context||h&&k.path.startsWith(`${h.path}/`)){o.dropId=null,o.dropPlace=null;return}const c=r.getBoundingClientRect();o.dropId=u,o.dropPlace=so(t.clientY-c.top,c.height,!jt(k.tag)&&k.kind!=="component")}function Wa(e,t){const s=J,n=o.dropId,a=o.dropPlace||"after",l=o.dragging;if(Me(),l&&(Le=!0,e.setTimeout(()=>{Le=!1},0)),!l||y("dock:is-locked")||!s||!n||s===n)return;t?.preventDefault?.();const r=O(),u=ao(r,ge,s,n,a);u!==r&&ce(u)}function Me(){try{$e?.releasePointerCapture?.(Ee)}catch{}Ye?.(),J=null,fe=null,$e=null,Ee=null,o.dragging=!1,o.dropId=null,o.dropPlace=null}function ln(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function Ze(e,t){if(t?.kind==="component"){Za(e,t);return}if(F.callOpen&&(F.callOpen=!1,F.callStore=null,R.forget(),tt(e)),t?.kind!=="antlers"){o.inspect=null;return}const s=t.id;if(t.tag==="else"){o.inspect={key:s,title:f(e,"antlers_condition"),mode:"note",note:f(e,"antlers_else_note")};return}if(t.antlers==="loop"){const n=t.loopKind==="collection",a=G?.id===t.id?G.dir:"",l=t.sortDir||a;o.inspect={key:s,title:f(e,"antlers_loop"),mode:"loop",loopKind:n?"collection":"field",kinds:[{id:"field",label:f(e,"antlers_loop_field")},{id:"collection",label:f(e,"antlers_loop_collection")}],collections:ln(e),value:t.expr||"",placeholder:f(e,n?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:f(e,"antlers_sort"),dir:l,needsField:l==="asc"||l==="desc",field:t.sortField||"",pickable:!n,placeholder:f(e,n?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:f(e,"antlers_sort_none")},{id:"asc",label:f(e,"antlers_sort_asc")},{id:"desc",label:f(e,"antlers_sort_desc")},{id:"random",label:f(e,"antlers_sort_random")}]},limit:{title:f(e,"antlers_limit"),value:t.limit||"",placeholder:f(e,"antlers_limit_placeholder")},branches:[]};return}o.inspect={key:s,title:f(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:f(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:f(e,"antlers_add_elseif")},{id:"else",label:f(e,"antlers_add_else")}]}}function Za(e,t){if(!Jn(e)){o.inspect=null;return}if(!t.src)return;const s=t.id;if(o.inspect={key:s,title:f(e,"component_props_values"),mode:"note",note:f(e,"code_dock_loading")},Qn()){const n={},a={},l=new Map;for(const[r,u]of eo(O().slice(t.from,t.to))){const k=to(r);k&&(r!==k||!l.has(k))&&l.set(k,u)}for(const[r,u]of l)u.bound?a[r]=u.value:n[r]=u.value;yt!==s&&(yt=s,me.clear());for(const r of me)r in a||(a[r]="");o.inspect=null,F.callOpen=!0,F.title=F.title||f(e,"component_props"),F.callTitle=t.klass||t.name||t.src,F.callStore=R.ui,R.ui.canBind=!0,R.ui.dataTitle=f(e,"data_vars_title"),R.ui.exprPlaceholder=f(e,"component_props_expr"),R.ui.onToggleBind=(r,u)=>Ja(e,r,u),R.ui.onExpr=(r,u)=>St(e,r,u),R.ui.onPickData=(r,u)=>y("dock:data-menu",{anchor:u,at:t.from,onPick:k=>St(e,r,String(k?.var||"").trim())}),R.load(e,{key:`${t.src}::${s}`,src:t.src,params:n,bindings:a,readOnly:y("dock:is-locked")===!0}),R.watch(e,{src:t.src,write:r=>Ga(e,r,a)}),tt(e);return}no(e,t.src).then(n=>{if(o.inspect?.key===s){if(!n.length){o.inspect={key:s,title:f(e,"component_props_values"),mode:"note",note:f(e,"component_props_values_none")};return}o.inspect={key:s,title:f(e,"component_props_values"),mode:"props",inheritLabel:f(e,"component_props_inherit"),rows:oo(n,O().slice(t.from,t.to))}}})}function Ga(e,t,s={}){const n=o.rows.find(r=>r.id===H);if(n?.kind!=="component"||y("dock:is-locked"))return;let a=O(),l=n.to;for(const[r,u]of Object.entries(t||{})){if(r in s)continue;const k=a.length,h=nt(a,{from:n.from,to:l},r,u);h!==a&&(l+=h.length-k,a=h)}a!==O()&&(ce(a,{save:!0}),C(e))}function Ja(e,t,s){s?me.add(t):me.delete(t),cn(e,t,"",s),C(e)}function St(e,t,s){me.add(t),cn(e,t,s,!0),C(e)}function cn(e,t,s,n){const a=o.rows.find(u=>u.id===H);if(a?.kind!=="component"||y("dock:is-locked"))return;const l=O(),r=nt(l,a,t,s,{bound:n});r!==l&&ce(r,{save:!0})}function Ie(){const e=o.rows.find(t=>t.id===H);return e?.kind==="antlers"&&!y("dock:is-locked")?e:null}function ee(e,t){const s=Ie();if(!s)return;const n=O(),a=t(n,s);a!==n&&(ce(a),C(e))}function wt(e,t,s,n){const a=o.rows.find(u=>u.id===H);if(a?.kind!=="component"||y("dock:is-locked"))return;const l=O(),r=nt(l,a,t,s,{bound:n});r!==l&&(ce(r,{save:!0}),C(e))}function Qa(e,t){ee(e,(s,n)=>n.antlers==="loop"?ze(s,n,n.loopKind==="collection"?"collection":"field",t):Ta(s,n,t))}function er(e,t){const s=Ie();if(!s||s.antlers!=="loop")return;const n=s.loopKind==="collection"?"collection":"field";if(t!==n){if(t==="collection"){const a=ln(e)[0]?.handle;if(!a)return;ee(e,(l,r)=>ze(l,r,"collection",a));return}ee(e,(a,l)=>ze(a,l,"field",l.handle||"items"))}}function tr(e,t){ee(e,(s,n)=>Pa(s,n,t))}function nr(e,t){if(!e||!t||t.kind==="component"||jt(t.tag))return null;const s=Zn(e,t);if(s<t.openTo)return null;const n=e.lastIndexOf(`
`,s-1)+1;return e.slice(n,s).trim()===""&&n>t.openTo?n-1:s}function rt(e,t,s){if(Le)return;const n=(s||o.rows).find(a=>a.id===t);n&&(H=t,o.rows.forEach(a=>{a.current=a.id===t}),Ze(e,n),!st()&&(y("dock:reveal-html",{from:n.from,to:n.to,caret:nr(O(),n)}),y("dock:tw-follow"),re({source:le,type:ie.SVE_HTML_PICK_FOCUS,path:n.path},e)))}function or(e,t){if(!t)return"";const s=[],n=(a,l)=>{for(const r of a||[]){const u=l||r.path===e;r.kind==="component"&&r.src===t&&s.push({path:r.path,inside:u}),n(r.children,u)}};return n(ge,!1),(s.find(a=>a.inside)||s[0])?.path||""}function sr(e,t){if(!t||!j(e.document))return;ye=!1,Ba(t),C(e);const s=o.rows.find(n=>n.path===t);s&&(rt(e,s.id,o.rows),e.setTimeout(()=>{j(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function Ge(e){if(Ce)return;const t=()=>{o.editingId||o.dragging||(e.clearTimeout(Pe),Pe=e.setTimeout(()=>{j(e.document)&&C(e)},80))},s=()=>t();Ce=At("dock:html-changed",t),e.document.addEventListener("sve-page-structure",s),Xe=()=>{e.document.removeEventListener("sve-page-structure",s)}}function ar(e){Ce?.(),Ce=null,Xe?.(),Xe=null,e?.clearTimeout?.(Pe),Pe=0}function it(e){const t=j(e.document);if(re({source:le,type:ie.SVE_HTML_PICK,on:!1},e),ar(e),R.forget(),F.callOpen=!1,F.callStore=null,tt(e),Me(),se(),zn(e),H=null,o.inspect=null,o.editingId=null,o.draft="",o.sections=[],o.pageBuilder=!1,V="",e?.clearTimeout?.(ve),!t){Ve(e);return}t.remove(),Je.headerTab==="html_tree"&&Fn(e,null),Cn(e),Lt(e),Ht(e),Ve(e)}function mr(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=_e,Se(t,Kt,{title:f(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>it(e)))}function vr(e){Ge(e),C(e)}function rr(e){const t=e.document;if(!$n(e,"html_tree"))return;if(j(t)){Ge(e),C(e);return}if(!Qt(t))return;ye=!0,D.clear(),En(e,[_e]);const s=t.createElement("div");s.id=_e,s.style.cssText=Ln,Se(s,Kt,{title:f(e,"html_tree")}),s.querySelector("[data-sve-close]")?.addEventListener("click",()=>it(e)),Hn(e,s),Lt(e),Ht(e),Ve(e),Ge(e),C(e)}function gr(e){if(j(e.document)){it(e);return}rr(e)}Ot("html-tree:from-preview",({path:e,src:t}={})=>{Bt(window,e)||sr(window,or(e,t)||e)});Ot("html-tree:arm-pick",e=>{const t=window;return e?(an(t,Ae(O())),!0):(j(t.document)||re({source:le,type:ie.SVE_HTML_PICK,on:!1},t),!0)});function kr(){Z.clear(),oe.clear(),te.length=0}export{$a as HTML_TREE_STYLE_ID,fr as armHtmlTreePrefetch,kr as clearHtmlTreeTemplates,se as closeHtmlTreeMenu,it as closeHtmlTreePanel,Ea as ensureHtmlTreeStyles,mr as fillHtmlTreePane,H as htmlTreeActiveId,j as htmlTreePanel,Pe as htmlTreeTimer,Ce as htmlTreeUnhook,rr as openHtmlTreePanel,C as renderHtmlTree,vr as showHtmlTreePane,ar as stopWatchHtmlTreeDock,gr as toggleHtmlTreePanel,Ge as watchHtmlTreeDock};
