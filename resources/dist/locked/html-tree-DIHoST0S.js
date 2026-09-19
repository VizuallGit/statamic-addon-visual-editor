const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-D8Xdoe3O.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{_ as pe,k as V,ap as dn,b4 as o,u,o as m,a as g,b as S,t as _,F as H,d as j,f as un,g as C,e as hn,s as y,q as N,l as pn,p as _t,w as je,b5 as fn,v as St,h as f,j as fe,y as b,i as wt,b6 as rt,b7 as it,b8 as mn,b9 as vn,ba as gn,bb as Ct,z as ee,x as kn,bc as ke,bd as yn,B as ae,c as se,N as bn,G as xn,aM as Ye,aq as qe,am as Tn,aO as Pt,aP as $t,af as _n,ag as lt,S as ye,V as be,O as Sn,aN as wn,an as Cn,ao as Pn,be as ct,bf as $n,U as Lt,A as Et,a8 as Ze,J as Ht,K as It,ax as Mt,ay as Ke,I as Ln,bg as En,aR as Hn,aS as In,aw as Mn,bh as An,b0 as Rn,ae as At,aG as Dn,aJ as Bn}from"./addon-DPa8jwuN.js";import{M as te,S as ne}from"./protocol-D3FYhCm9.js";import{D as B,E as On,F as Ge,G as Fn,t as jn,I as Je,v as qn,z as Kn,b as Le,l as dt,J as Rt,q as Vn,K as Dt,L as Nn,H as zn,M as Qe,N as Bt,O as Un,h as Xn,c as Wn,Q as Yn,R as Zn,S as Gn,T as Jn,U as Qn,V as eo,W as to,X as no,Y as oo,Z as so}from"./tw-classes-BrYGE8KH.js";import{canEditFields as ao,currentSetHandle as ro,openFieldsetOverlay as io}from"./section-fields-BQu-RVnZ.js";import{a as lo}from"./html-pick-align-CK-9iH9_.js";import"./ai-text-icon-B7uCWIwa.js";const co={key:0,class:"sve-ht-inspect"},uo={class:"sve-ht-inspect__head"},ho={key:0,class:"sve-ht-inspect__note"},po={key:2,class:"sve-ht-inspect__props"},fo={class:"sve-ht-inspect__proplabel"},mo={key:0},vo=["value","disabled","onChange"],go={value:""},ko=["value"],yo=["value"],bo=["value","placeholder","onChange"],xo=["title","disabled","onClick"],To=["title","disabled","onClick"],_o={key:0,class:"sve-ht-inspect__seg"},So=["data-active","disabled","onClick"],wo=["value","disabled"],Co={key:0,value:""},Po=["value"],$o={key:2,class:"sve-ht-inspect__box"},Lo=["value","placeholder","disabled","onKeydown"],Eo=["title","disabled"],Ho={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Io=["value","disabled"],Mo=["value"],Ao={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},Ro=["value","placeholder","disabled"],Do=["title","disabled"],Bo={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Oo=["value","placeholder","disabled"],Fo={key:4,class:"sve-ht-inspect__add"},jo=["disabled","onClick"],Me='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',qo='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',Ko={__name:"HtmlTreeInspector",setup(e){const t=V(null);dn(t,h=>o.onPropHost?.(h||null));const s=V(null),n=V(null);function a(h){o.onInspectCommit?.(h.target.value)}function l(h,d,i){!h||!d||(h.value=d,h.focus(),h.setSelectionRange(d.length,d.length),i(d))}function r(h,d){o.onInspectData?.(h.currentTarget,i=>o.onPropValue?.(d.handle,i,!0))}function c(h){o.onInspectData?.(h.currentTarget,d=>l(s.value,d,i=>o.onInspectCommit?.(i)))}function k(h){o.onInspectData?.(h.currentTarget,d=>l(n.value,d,i=>o.onLoopSortField?.(i)))}return(h,d)=>u(o).inspect?(m(),g("div",co,[S("div",uo,_(u(o).inspect.title),1),u(o).inspect.mode==="note"?(m(),g("div",ho,_(u(o).inspect.note),1)):u(o).inspect.mode==="statamic"?(m(),g("div",{key:1,ref_key:"propHost",ref:t,class:"sve-ht-inspect__form"},null,512)):u(o).inspect.mode==="props"?(m(),g("div",po,[(m(!0),g(H,null,j(u(o).inspect.rows,i=>(m(),g("label",{key:i.handle,class:"sve-ht-inspect__prop"},[S("span",fo,[un(_(i.label)+" ",1),i.bound?(m(),g("em",mo,":")):C("",!0)]),S("span",{class:hn(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":i.type==="select"||i.type==="link"}])},[i.type==="select"&&!i.bound?(m(),g("select",{key:0,value:i.value,disabled:!u(o).canEdit,onChange:v=>u(o).onPropValue?.(i.handle,v.target.value,!1)},[S("option",go,_(i.placeholder||u(o).inspect.inheritLabel),1),i.value&&!i.options.includes(i.value)?(m(),g("option",{key:0,value:i.value},_(i.value),9,ko)):C("",!0),(m(!0),g(H,null,j(i.options,v=>(m(),g("option",{key:v,value:v},_(v),9,yo))),128))],40,vo)):(m(),g("input",{key:1,type:"text",value:i.value,placeholder:i.placeholder||u(o).inspect.inheritLabel,onChange:v=>u(o).onPropValue?.(i.handle,v.target.value,i.bound)},null,40,bo)),i.type==="link"?(m(),g("button",{key:2,type:"button","data-sve-ht-data":"",title:u(o).pageTitle,disabled:!u(o).canEdit,onClick:v=>u(o).onPropPage?.(v.currentTarget,i.handle),innerHTML:qo},null,8,xo)):C("",!0),S("button",{type:"button","data-sve-ht-data":"",title:u(o).dataTitle,disabled:!u(o).canEdit,onClick:v=>r(v,i),innerHTML:Me},null,8,To)],2)]))),128))])):(m(),g(H,{key:3},[u(o).inspect.mode==="loop"?(m(),g("div",_o,[(m(!0),g(H,null,j(u(o).inspect.kinds,i=>(m(),g("button",{key:i.id,type:"button","data-active":i.id===u(o).inspect.loopKind?"":void 0,disabled:!u(o).canEdit,onClick:v=>u(o).onLoopKind?.(i.id)},_(i.label),9,So))),128))])):C("",!0),u(o).inspect.mode==="loop"&&u(o).inspect.loopKind==="collection"?(m(),g("select",{key:u(o).inspect.key+":"+u(o).inspect.value,value:u(o).inspect.value,disabled:!u(o).canEdit,onChange:a},[u(o).inspect.value?C("",!0):(m(),g("option",Co,_(u(o).inspect.placeholder),1)),(m(!0),g(H,null,j(u(o).inspect.collections,i=>(m(),g("option",{key:i.handle,value:i.handle},_(i.title),9,Po))),128))],40,wo)):(m(),g("div",$o,[(m(),g("input",{ref_key:"field",ref:s,key:u(o).inspect.key,type:"text",value:u(o).inspect.value,placeholder:u(o).inspect.placeholder,disabled:!u(o).canEdit,spellcheck:"false",onKeydown:[d[0]||(d[0]=y(()=>{},["stop"])),N(y(a,["prevent"]),["enter"])],onBlur:a},null,40,Lo)),S("button",{type:"button","data-sve-ht-data":"",title:u(o).dataTitle,disabled:!u(o).canEdit,innerHTML:Me,onMousedown:d[1]||(d[1]=y(()=>{},["prevent"])),onClick:y(c,["stop","prevent"])},null,40,Eo)])),u(o).inspect.sort?(m(),g(H,{key:3},[S("div",Ho,_(u(o).inspect.sort.title),1),(m(),g("select",{key:u(o).inspect.key+":dir:"+u(o).inspect.sort.dir,value:u(o).inspect.sort.dir,disabled:!u(o).canEdit,onChange:d[2]||(d[2]=i=>u(o).onLoopSortDir?.(i.target.value))},[(m(!0),g(H,null,j(u(o).inspect.sort.dirs,i=>(m(),g("option",{key:i.id,value:i.id},_(i.label),9,Mo))),128))],40,Io)),u(o).inspect.sort.needsField?(m(),g("div",Ao,[(m(),g("input",{ref_key:"sortField",ref:n,key:u(o).inspect.key+":field",type:"text",value:u(o).inspect.sort.field,placeholder:u(o).inspect.sort.placeholder,disabled:!u(o).canEdit,spellcheck:"false",onKeydown:[d[3]||(d[3]=y(()=>{},["stop"])),d[4]||(d[4]=N(y(i=>u(o).onLoopSortField?.(i.target.value),["prevent"]),["enter"]))],onBlur:d[5]||(d[5]=i=>u(o).onLoopSortField?.(i.target.value))},null,40,Ro)),u(o).inspect.sort.pickable?(m(),g("button",{key:0,type:"button","data-sve-ht-data":"",title:u(o).dataTitle,disabled:!u(o).canEdit,innerHTML:Me,onMousedown:d[6]||(d[6]=y(()=>{},["prevent"])),onClick:y(k,["stop","prevent"])},null,40,Do)):C("",!0)])):C("",!0),S("div",Bo,_(u(o).inspect.limit.title),1),(m(),g("input",{key:u(o).inspect.key+":limit",type:"number",min:"1",value:u(o).inspect.limit.value,placeholder:u(o).inspect.limit.placeholder,disabled:!u(o).canEdit,onKeydown:[d[7]||(d[7]=y(()=>{},["stop"])),d[8]||(d[8]=N(y(i=>u(o).onLoopLimit?.(i.target.value),["prevent"]),["enter"]))],onBlur:d[9]||(d[9]=i=>u(o).onLoopLimit?.(i.target.value))},null,40,Oo))],64)):C("",!0),u(o).inspect.branches?.length?(m(),g("div",Fo,[(m(!0),g(H,null,j(u(o).inspect.branches,i=>(m(),g("button",{key:i.id,type:"button",disabled:!u(o).canEdit,onClick:v=>u(o).onAddBranch?.(i.id)},_(i.label),9,jo))),128))])):C("",!0)],64))])):C("",!0)}},Vo=pe(Ko,[["__scopeId","data-v-26254b75"]]),No={class:"sve-dialog__title"},zo={for:"sve-new-section-group"},Uo=["value"],Xo={for:"sve-new-section-name"},Wo=["placeholder"],Yo={key:0,class:"sve-dialog__note"},Zo={class:"sve-dialog__actions"},Go=["disabled"],Jo=["disabled"],Qo={__name:"NewSectionPrompt",props:{heading:{type:String,required:!0},groupLabel:{type:String,required:!0},nameLabel:{type:String,required:!0},placeholder:{type:String,default:""},note:{type:String,default:""},groups:{type:Array,required:!0},cancelLabel:{type:String,required:!0},saveLabel:{type:String,required:!0},onOk:{type:Function,required:!0},onClose:{type:Function,required:!0}},setup(e){const t=e,s=V(""),n=V(t.groups[0]?.key??""),a=V(null),l=V(!1);pn(()=>_t(()=>a.value?.focus()));function r(){const h=s.value.trim();if(!h||!n.value||l.value){a.value?.focus();return}l.value=!0,t.onOk(h,n.value)}function c(h){h.target===h.currentTarget&&t.onClose()}function k(h){h.key==="Enter"?r():h.key==="Escape"&&t.onClose()}return(h,d)=>(m(),g("div",{class:"sve-dialog-overlay",onClick:c},[S("div",{class:"sve-dialog",onClick:d[3]||(d[3]=y(()=>{},["stop"]))},[S("div",No,_(e.heading),1),S("label",zo,_(e.groupLabel),1),je(S("select",{id:"sve-new-section-group","onUpdate:modelValue":d[0]||(d[0]=i=>n.value=i),onKeydown:k},[(m(!0),g(H,null,j(e.groups,i=>(m(),g("option",{key:i.key,value:i.key},_(i.display),9,Uo))),128))],544),[[fn,n.value]]),S("label",Xo,_(e.nameLabel),1),je(S("input",{id:"sve-new-section-name",ref_key:"input",ref:a,"onUpdate:modelValue":d[1]||(d[1]=i=>s.value=i),type:"text",placeholder:e.placeholder,onKeydown:k},null,40,Wo),[[St,s.value]]),e.note?(m(),g("p",Yo,_(e.note),1)):C("",!0),S("div",Zo,[S("button",{type:"button",class:"is-cancel",disabled:l.value,onClick:d[2]||(d[2]=(...i)=>e.onClose&&e.onClose(...i))},_(e.cancelLabel),9,Go),S("button",{type:"button",class:"is-primary",disabled:l.value,onClick:r},_(e.saveLabel),9,Jo)])])]))}},es=pe(Qo,[["__scopeId","data-v-d21be545"]]),Ot="/!/sve/section-types";async function ts(e){const t=await e.fetch(Ot,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!t.ok)throw new Error(`section-types ${t.status}`);const s=await t.json(),n=new Map;for(const a of s.types||[])a?.group&&!n.has(a.group)&&n.set(a.group,a.group_display||a.group);return[...n].map(([a,l])=>({key:a,display:l}))}async function ns(e,{display:t,group:s}){const n=await e.fetch(Ot,{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":wt(e),Accept:"application/json"},credentials:"same-origin",body:JSON.stringify({display:t,group:s})}),a=await n.json().catch(()=>({}));if(!n.ok){const l=new Error(a.error||`section-types ${n.status}`);throw l.reason=a.error,l}return a}async function os(e,t,s=null){if(!t||typeof rt!="function"||typeof it!="function")return null;const n=await rt(e,t);if(!n)return null;const a=mn(),l=vn(e,"page",{handle:t},n?.defaults,a),r=gn(l,n?.new||{},n?.defaults);return it(e,e.document,s,l,r)?l:null}const ut=700,ss=17;function as(e,t){const s=(t||[]).filter(Boolean);if(!s.length)return;let n=0;const a=()=>{n+=1;const l=Ct(e),r=l?s.some(c=>l.querySelector(`[data-sid="${CSS.escape(c)}"]`)):!0;r&&ee({source:ne,type:te.SVE_ACTIVATE,ids:s},e),(r?!l&&n<6:n<ss)&&e.setTimeout(a,ut)};e.setTimeout(a,ut)}function rs(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function is(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){(async()=>{let l=[];try{l=await ts(e)}catch(c){n?.(c),e.Statamic?.$toast?.error(f(e,"section_new_failed"));return}if(!l.length){n?.(new Error("no groups")),e.Statamic?.$toast?.error(f(e,"section_new_failed"));return}const r=fe(e.document,es,{heading:f(e,"section_new"),groupLabel:f(e,"section_new_group"),nameLabel:f(e,"section_new_name"),placeholder:f(e,"section_new_placeholder"),note:f(e,"section_new_note"),groups:l,cancelLabel:f(e,"cancel"),saveLabel:f(e,"section_new_create"),onClose:a,onOk:(c,k)=>{(async()=>{try{const h=await ns(e,{display:c,group:k});r.dismiss(),e.Statamic?.$toast?.success(f(e,"section_created",{name:h.section?.display||c})),e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"));const d=await os(e,h.section?.handle,t);!d&&h.section?.handle&&b("dock:open-template",h.section.handle),s?.({...h,uid:d?._visual_id||""})}catch(h){r.dismiss(),e.Statamic?.$toast?.error(f(e,h.reason==="bad_name"?"section_new_bad_name":"section_new_failed")),n?.(h)}})()}})})()}const ls={class:"sve-html-tree"},cs={class:"sve-pane-bar","data-sve-pane-bar":""},ds={"data-sve-right-title":""},us={class:"sve-ht-tools"},hs=["title"],ps=["placeholder","aria-label","value"],fs=["aria-label"],ms=["title","aria-label"],vs={key:1,class:"sve-tree-exit"},gs=["title"],ks=["title"],ys='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',bs='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',xs='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',Ts={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const t=f(window,"html_tree_search"),s=rs(window),n=f(window,"section_new"),a=V(!1);function l(){a.value=!1}async function r(h){if(h)for(let d=0;d<20;d+=1){await _t(),o.onRefresh?.();const i=o.sections.find(v=>v.uid===h);if(i){o.onSection?.(h),as(window,i.ids);return}await new Promise(v=>setTimeout(v,50))}}function c(){a.value||(a.value=!0,is(window,{afterUid:o.sections.length?o.sections[o.sections.length-1].uid:null,onDone:h=>{l(),r(h?.uid)},onError:l,onClose:l}))}function k(h){const d=!!o.query;o.query=h,d!==!!h&&o.onQuery?.()}return(h,d)=>(m(),g("div",ls,[S("div",cs,[S("div",ds,_(e.title),1),d[5]||(d[5]=kn('<div data-sve-right-actions data-v-fb9a0208><button type="button" data-sve-right-pin aria-pressed="false" data-v-fb9a0208></button><button type="button" data-sve-close aria-label="Close" data-v-fb9a0208><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-fb9a0208><path d="M18 6 6 18" data-v-fb9a0208></path><path d="m6 6 12 12" data-v-fb9a0208></path></svg></button></div>',1))]),S("div",us,[S("label",{class:"sve-ht-search",title:u(t)},[S("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:bs}),S("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:u(t),"aria-label":u(t),value:u(o).query,autocomplete:"off",spellcheck:"false",onInput:d[0]||(d[0]=i=>k(i.target.value)),onKeydown:[d[1]||(d[1]=y(()=>{},["stop"])),d[2]||(d[2]=N(y(i=>k(""),["prevent"]),["escape"]))]},null,40,ps),u(o).query?(m(),g("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":u(t),innerHTML:xs,onClick:d[3]||(d[3]=i=>k(""))},null,8,fs)):C("",!0)],8,hs),u(s)&&(u(o).sections.length||u(o).pageBuilder)?(m(),g("button",{key:0,type:"button",class:"sve-ht-new",title:u(n),"aria-label":u(n),innerHTML:ys,onClick:c},null,8,ms)):C("",!0)]),u(B).inSidebar?C("",!0):(m(),ke(On,{key:0})),d[6]||(d[6]=S("div",{"data-sve-html-tree-list":""},null,-1)),yn(Vo),u(o).exitOpen&&!u(B).inSidebar?(m(),g("div",vs,[S("span",{class:"sve-tree-exit__name",title:u(o).exitName},_(u(o).exitName),9,gs),S("button",{type:"button",class:"sve-tree-exit__go",title:u(o).exitTitle,onClick:d[4]||(d[4]=i=>u(o).onExit?.())},_(u(o).exitLabel),9,ks)])):C("",!0)]))}},Ft=pe(Ts,[["__scopeId","data-v-fb9a0208"]]);function jt(e){return String(e||"").trim().toLowerCase()}function qt(e,t){return t?[e.name,e.tag,e.klass,e.label,e.src].filter(s=>typeof s=="string"&&s).join(" ").toLowerCase().includes(t):!0}function _s(e,t){const s=jt(t);if(!s)return{rows:e,hits:new Set};const n=new Set;for(const r of e)qt(r,s)&&n.add(r.path);const a=[...n];return{rows:e.filter(r=>n.has(r.path)||a.some(c=>c.startsWith(`${r.path}/`))),hits:n}}const Ss=["title"],ws={"data-sve-ht-indent":"","aria-hidden":"true"},Cs=["data-sve-ht-cat"],Ps={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},$s={key:2,"data-sve-ht-letter":""},Ls=["innerHTML"],Es=["title"],Hs=["title"],Is={key:1,"data-sve-ht-kind":""},Ms={key:3,"data-sve-ht-name":""},As={key:4,"data-sve-ht-actions":""},Rs=["disabled","title","innerHTML"],Ds=["disabled","title"],Bs=["disabled","title"],Os=["disabled","title"],Fs=["data-sve-ht-id"],js='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',qs='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',Ks='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Vs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',Ns='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',zs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',Us={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const t=ao(window),s=f(window,"section_fields");function n(){const d=ro();if(!d){window.Statamic?.$toast?.error(f(window,"section_fields_none"));return}io(window,d)}function a(d){return d.kind==="component"?d.src?`partial:${d.src}`:d.tag:d.name?`${d.tag} ${d.name}`:d.tag}function l(d){return!!d.section}function r(d){return!!d.context}function c(d){if(l(d)){o.onSection?.(d.section);return}if(r(d)){o.onContextRow?.(d.id);return}o.onSelect?.(d.id)}function k(d,i){const v={"data-sve-ht-id":d.id};return d.current&&(v["data-sve-ht-current"]=""),d.hidden&&(v["data-sve-ht-hidden"]=""),v["data-sve-ht-cat"]=d.cat||"other",v["data-sve-ht-depth"]=String(d.depth),i&&(v["data-sve-ht-dim"]=""),r(d)&&(v["data-sve-ht-context"]=d.context),l(d)&&(v["data-sve-ht-sec"]=""),!l(d)&&o.dropId===d.id&&o.dropPlace&&(v["data-sve-ht-drop"]=o.dropPlace),v}function h(d){return!d.hidden||d.wrapFrom!=null}return(d,i)=>(m(),g(H,null,[S("div",ae({"data-sve-ht-row":""},k(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:i[26]||(i[26]=v=>c(e.row)),onDblclick:i[27]||(i[27]=y(v=>l(e.row)||r(e.row)?null:u(o).onRename?.(e.row.id),["prevent"])),onKeydown:[i[28]||(i[28]=N(y(v=>c(e.row),["prevent"]),["enter"])),i[29]||(i[29]=N(y(v=>c(e.row),["prevent"]),["space"]))],onPointerdown:i[30]||(i[30]=v=>l(e.row)||r(e.row)?null:u(o).onPointerDown?.(v,e.row.id)),onContextmenu:i[31]||(i[31]=y(v=>l(e.row)||r(e.row)?null:u(o).onContext?.(v,e.row.id),["prevent","stop"]))}),[S("span",ws,[(m(!0),g(H,null,j(e.row.guides||[],(v,$)=>(m(),g("i",{key:$,"data-sve-ht-cat":v},null,8,Cs))),128))]),e.row.hasChildren||e.row.emptyBlock?(m(),g("button",ae({key:0,type:"button","data-sve-ht-twist":""},e.row.shut?{"data-sve-ht-shut":""}:{},{innerHTML:qs,onClick:i[0]||(i[0]=y(v=>l(e.row)?u(o).onSection?.(e.row.section):u(o).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:i[1]||(i[1]=y(()=>{},["stop"])),onDblclick:i[2]||(i[2]=y(()=>{},["stop"]))}),null,16)):(m(),g("span",Ps)),e.row.letter?(m(),g("span",$s,_(e.row.letter),1)):(m(),g("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Ls)),S("span",{"data-sve-ht-text":"",title:u(o).renameTitle},[!e.row.kind&&!l(e.row)&&!r(e.row)?(m(),g("button",{key:0,type:"button","data-sve-ht-tag":"",title:u(o).tagTitle,onClick:i[3]||(i[3]=y(()=>{},["stop","prevent"])),onPointerdown:i[4]||(i[4]=y(()=>{},["stop"])),onDblclick:i[5]||(i[5]=y(v=>u(o).onTagChange?.(v,e.row.id),["stop","prevent"]))},_(e.row.tag),41,Hs)):(m(),g("span",Is,_(e.row.tag),1)),u(o).editingId===e.row.id&&!l(e.row)?je((m(),g("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":i[6]||(i[6]=v=>u(o).draft=v),onMousedown:i[7]||(i[7]=y(()=>{},["stop"])),onPointerdown:i[8]||(i[8]=y(()=>{},["stop"])),onClick:i[9]||(i[9]=y(()=>{},["stop"])),onDblclick:i[10]||(i[10]=y(()=>{},["stop"])),onKeydown:[i[11]||(i[11]=y(()=>{},["stop"])),i[12]||(i[12]=N(y(v=>u(o).onRenameCommit?.(),["prevent"]),["enter"])),i[13]||(i[13]=N(y(v=>u(o).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:i[14]||(i[14]=v=>u(o).onRenameCommit?.())},null,544)),[[St,u(o).draft]]):(m(),g("span",Ms,_(e.row.name),1))],8,Es),!l(e.row)&&!r(e.row)?(m(),g("span",As,[h(e.row)?(m(),g("button",{key:0,type:"button","data-sve-ht-eye":"",disabled:!u(o).canEdit,title:u(o).canEdit?e.row.hidden?u(o).showTitle:u(o).hideTitle:u(o).lockedTitle,innerHTML:e.row.hidden?Vs:Ks,onClick:i[15]||(i[15]=y(v=>u(o).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:i[16]||(i[16]=y(()=>{},["stop"])),onDblclick:i[17]||(i[17]=y(()=>{},["stop"]))},null,40,Rs)):C("",!0),u(t)&&e.row.depth===0?(m(),g("button",{key:1,type:"button","data-sve-ht-fields":"",disabled:!u(o).canEdit,title:u(o).canEdit?u(s):u(o).lockedTitle,innerHTML:js,onClick:y(n,["stop","prevent"]),onPointerdown:i[18]||(i[18]=y(()=>{},["stop"])),onDblclick:i[19]||(i[19]=y(()=>{},["stop"]))},null,40,Ds)):C("",!0),S("button",{type:"button","data-sve-ht-dup":"",disabled:!u(o).canEdit,title:u(o).canEdit?u(o).duplicateTitle:u(o).lockedTitle,innerHTML:Ns,onClick:i[20]||(i[20]=y(v=>u(o).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:i[21]||(i[21]=y(()=>{},["stop"])),onDblclick:i[22]||(i[22]=y(()=>{},["stop"]))},null,40,Bs),S("button",{type:"button","data-sve-ht-del":"",disabled:!u(o).canEdit,title:u(o).canEdit?u(o).deleteTitle:u(o).lockedTitle,innerHTML:zs,onClick:i[23]||(i[23]=y(v=>u(o).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:i[24]||(i[24]=y(()=>{},["stop"])),onDblclick:i[25]||(i[25]=y(()=>{},["stop"]))},null,40,Os)])):C("",!0)],16,Ss),e.row.emptyBlock&&!e.row.shut?(m(),g("div",ae({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},u(o).dropId===e.row.id&&u(o).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),_(u(o).slotText),17,Fs)):C("",!0)],64))}},Ae=pe(Us,[["__scopeId","data-v-1523d757"]]),Xs=["data-sve-ht-look"],Ws={key:0,class:"sve-ht-empty"},Ys={key:1,class:"sve-ht-empty"},Zs={key:0,class:"sve-ht-empty"},Gs={__name:"HtmlTreeList",setup(e){const t=se(()=>jt(o.query)),s=se(()=>_s(o.rows,t.value)),n=se(()=>s.value.rows),a=se(()=>t.value?o.sections.filter(c=>qt(c.row,t.value)||c.current&&c.ready&&n.value.length>0):o.sections),l=se(()=>!!t.value&&!a.value.length&&!n.value.length);function r(c){return!!t.value&&!s.value.hits.has(c.path)}return(c,k)=>(m(),g("div",ae({class:"sve-ht-root","data-sve-ht-look":u(o).look,style:u(o).familyStyle},u(o).dragging?{"data-sve-ht-dragging":""}:{}),[!u(o).rows.length&&!u(o).sections.length?(m(),g("div",Ws,_(u(o).emptyText),1)):l.value?(m(),g("div",Ys,_(u(o).searchEmpty),1)):C("",!0),u(o).sections.length?(m(!0),g(H,{key:2},j(a.value,h=>(m(),g("div",ae({key:h.uid},{ref_for:!0},h.current?{"data-sve-ht-branch":""}:{}),[h.ready?(m(),g(H,{key:0},[(m(!0),g(H,null,j(n.value,d=>(m(),ke(Ae,{key:d.id,row:d,dim:r(d)},null,8,["row","dim"]))),128)),u(o).rows.length?C("",!0):(m(),g("div",Zs,_(u(o).emptyText),1))],64)):(m(),ke(Ae,{key:1,row:h.row,dim:u(o).inComponent},null,8,["row","dim"]))],16))),128)):u(o).rows.length?(m(!0),g(H,{key:3},j(n.value,h=>(m(),ke(Ae,{key:h.id,row:h,dim:r(h)},null,8,["row","dim"]))),128)):C("",!0)],16,Xs))}},ht=pe(Gs,[["__scopeId","data-v-2240400d"]]);let Re=null;function Js(e){return Re||(Re=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{pages:[]}).then(t=>Array.isArray(t.pages)?t.pages:[]).catch(()=>[])),Re}let xe=null;function De(){xe?.dismiss(),xe=null}function Qs(e,t,s){De();const n=t?.getBoundingClientRect?.(),a={x:n?n.left:0,y:n?n.bottom+4:0};Js(e).then(l=>{const r=l.length?l.map(c=>({label:c.title||c.url,onPick:()=>{De(),s(c.url)}})):[{label:f(e,"component_props_pages_none"),onPick:null}];De(),xe=fe(e.document,Ge,{items:r,x:a.x,y:a.y,onClose:()=>{xe=null}})})}const Kt="sve-html-tree-labels";function Vt(){try{const e=globalThis.localStorage?.getItem(Kt);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function ea(e){try{globalThis.localStorage?.setItem(Kt,JSON.stringify(e))}catch{}}function Nt(e){return String(e||"_")}function zt(e){const t=Vt()[Nt(e)];return t&&typeof t=="object"?{...t}:{}}function ta(e,t,s){const n=s?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function na(e,t,s,n){if(!t)return;const a=Nt(e),l=Vt(),r={...l[a]||{}},c=String(s||"").replace(/\s+/g," ").trim(),k=String(n||"").trim();!c||c===k?delete r[t]:r[t]=c,Object.keys(r).length?l[a]=r:delete l[a],ea(l)}const oa=/^@(media|supports|container|layer|scope)\b/i;function sa(e){const t=String(e||""),s=[];let n=0,a=0;for(;n<t.length;){if(t[n]==="{"&&t[n+1]==="{"){const c=t.indexOf("}}",n+2);n=c===-1?t.length:c+2;continue}if(t[n]==="/"&&t[n+1]==="*"){const c=t.indexOf("*/",n+2);n=c===-1?t.length:c+2;continue}if(t[n]==='"'||t[n]==="'"){const c=t[n];for(n+=1;n<t.length&&t[n]!==c;)n+=t[n]==="\\"?2:1;n+=1;continue}if(t[n]!=="{"){n+=1;continue}let l=1,r=n+1;for(;r<t.length&&l>0;){if(t[r]==="{"&&t[r+1]==="{"){const c=t.indexOf("}}",r+2);r=c===-1?t.length:c+2;continue}if(t[r]==="/"&&t[r+1]==="*"){const c=t.indexOf("*/",r+2);r=c===-1?t.length:c+2;continue}if(t[r]==='"'||t[r]==="'"){const c=t[r];for(r+=1;r<t.length&&t[r]!==c;)r+=t[r]==="\\"?2:1;r+=1;continue}t[r]==="{"?l+=1:t[r]==="}"&&(l-=1),r+=1}s.push({selector:t.slice(a,n).trim(),body:t.slice(n+1,r-1),from:a,to:r,text:t.slice(a,r).trim()}),n=r,a=r}return s}function pt(e){const t=String(e||""),s=new Set,n=new Set,a=new Set;for(const l of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const r of l[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))r&&(s.add(r),s.add(r.replace(/([:./%!#()[\],])/g,"\\$1")));for(const l of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))l[2].trim()&&n.add(l[2].trim());for(const l of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))a.add(l[1].toLowerCase());return{classes:s,ids:n,tags:a}}function ft(e,t){const s=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),n=[...s.matchAll(/\.((?:\\.|[\w-])+)/g)].map(r=>r[1]),a=[...s.matchAll(/#((?:\\.|[\w-])+)/g)].map(r=>r[1]);if(n.length||a.length){const r=c=>c.replace(/\\(.)/g,"$1");return n.every(c=>t.classes.has(c)||t.classes.has(r(c)))&&a.every(c=>t.ids.has(r(c)))}const l=[...s.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(r=>r[2].toLowerCase());return l.length>0&&l.every(r=>t.tags.has(r))}function aa(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function ra(e,t,s){const n=aa(e);if(!n.length)return"keep";const a=n.filter(r=>ft(r,t));return a.length?a.length===n.length&&!n.some(r=>ft(r,s))?"move":"copy":"keep"}function Ut(e,t,s){const n=String(e||""),a=pt(t),l=pt(s),r=[],c=[];let k=0;for(const h of sa(n)){const d=n.slice(h.from,h.to),i=d.match(/^\s*/)[0];if(k=h.to,oa.test(h.selector)){const $=Ut(h.body,t,s);$.move.trim()&&r.push(`${h.selector} {
${$.move.trim()}
}`),$.keep.trim()&&c.push(`${i}${h.selector} {
${$.keep.trim()}
}`);continue}const v=h.selector.startsWith("@")?"keep":ra(h.selector,a,l);if(v==="move"){r.push(h.text);continue}v==="copy"&&r.push(h.text),c.push(d)}return c.push(n.slice(k)),{move:r.join(`

`).trim(),keep:c.join("").replace(/\n{3,}/g,`

`).trim()}}const ia="/!/sve/component";function la(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let s=null;for(const n of t){if(!n.trim())continue;const a=n.match(/^[ \t]*/)[0].length;s=s===null?a:Math.min(s,a)}return s?t.map(n=>n.slice(s)).join(`
`):t.join(`
`)}function ca(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function da(e,t){if(!jn(e))return"";try{return await(await xn(()=>import("./tw-compile-D8Xdoe3O.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(s){return console.error("[sve] component tailwind compile",s),""}}async function ua(e,t){const s=await e.fetch(ia,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":wt(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!s.ok){const n=new Error(String(s.status));throw n.status=s.status,n}return s.json()}function mt(e,t){const{from:s,to:n}=Fn(e,t),a=e.slice(s,n);if(!a.trim())return null;const l=e.slice(0,s)+e.slice(n),r=b("dock:css"),c=Ut(typeof r=="string"?r:"",a,l);return{html:la(a),css:c.move,keepCss:c.keep,lead:ca(a),from:s,to:n}}function ha(e,t,{onDone:s,onError:n}={}){if(b("dock:is-locked")===!0)return;const a=b("dock:html");if(typeof a!="string"||!t)return;const l=mt(a,t);if(!l)return;const r=fe(e.document,bn,{heading:f(e,"component_new"),nameLabel:f(e,"component_name"),placeholder:f(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:f(e,"cancel"),saveLabel:f(e,"component_create"),onOk:c=>{r.dismiss(),(async()=>{try{const k=await da(e,l.html),h=b("dock:html"),d=typeof h=="string"&&h===a?l:mt(h,t);if(!d)return;const i=await ua(e,{name:c,html:d.html,css:d.css,js:"",tw:k}),v=b("dock:html"),$=v.slice(0,d.from)+d.lead+i.tag+v.slice(d.to);b("dock:set-html",$),d.css.trim()&&b("dock:set-css",d.keepCss),s?.(i)}catch(k){n?.(k)}})()}})}function pa(e,t,s){const n=String(e||"");if(!t||t.kind!=="antlers")return n;const a=String(s||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?ga(n,t,a):t.tag==="else"||!a?n:n.slice(0,t.from)+`{{ ${t.tag} ${a} }}`+n.slice(t.openTo)}function Ve(e,t,s,n){return re(e,t,{kind:s,name:n})}function re(e,t,s={}){const n=String(e||"");if(!t||t.antlers!=="loop")return n;const a=t.loopKind==="collection"?"collection":"field",l=s.kind??a,r=String(s.name??t.expr??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(r))return n;const c=s.sortDir??t.sortDir??"",k=String(s.sortField??t.sortField??"").trim(),h=String(s.limit??t.limit??"").trim(),d=Xt(n,t);if(!d)return n;const i=l===a?t.params:"",v=l==="collection"?fa(r,k,c,h,i):ma(r,k,c,h,i),$=l==="collection"?"collection":r;return n.slice(0,t.from)+v+n.slice(t.openTo,d.from)+`{{ /${$} }}`+n.slice(d.to)}function fa(e,t,s,n,a){const l=va(a).replace(/\bsort\s*=\s*["'][^"']*["']/g,"").replace(/\blimit\s*=\s*["']?\d+["']?/g,"").replace(/\s+/g," ").trim(),r=[`collection from="${e}"`];return s==="random"?r.push('sort="random"'):t&&r.push(`sort="${t}${s==="desc"?":desc":":asc"}"`),n&&r.push(`limit="${n}"`),l&&r.push(l),`{{ ${r.join(" ")} }}`}function ma(e,t,s,n,a){const l=String(a||"").split("|").map(c=>c.trim()).filter(c=>c&&!/^from\s*=/.test(c)&&!/^sort\s*:/.test(c)&&!/^reverse$/.test(c)&&!/^shuffle$/.test(c)&&!/^limit\s*:/.test(c)),r=[e,...l];return s==="random"?r.push("shuffle"):t&&(r.push(`sort:${t}`),s==="desc"&&r.push("reverse")),n&&r.push(`limit:${n}`),`{{ ${r.join(" | ")} }}`}function va(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function Xt(e,t){const n=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return n?{from:t.from+n.index,to:t.from+n.index+n[0].length}:null}function ga(e,t,s){return re(e,t,{name:s})}function ka(e,t,s){const n=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return n;const a=Xt(n,t);if(!a)return n;const r=(n.slice(0,a.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],c=s==="else"?"{{ else }}":"{{ elseif true }}";return`${n.slice(0,a.from)}${c}
${r}${n.slice(a.from)}`}const M=Nn("sve-call-values"),ce=new Set;let vt=null;const ya="__sve-html-tree-style",A=new Set;let Ne="",J=!1,Be=null,me=!0,q="",de=0,Wt="";const Z=new Map,ie=new Set;let D="",Yt=!1,L=null,Te=null,_e=0,ze=null,ue=[],X=null,le=null,Se=null,we=null,Ue=null,Ce=!1,W=null,U=null;function O(e){return e.getElementById(ye)}function ba(e){_n(e,ya,`
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
      ${lt("light")}
      --sve-ht-pick: rgba(56,88,233,.14);
      --sve-ht-pick-hover: rgba(56,88,233,.22);
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${lt("dark")}
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
  `)}function R(){const e=b("dock:html");return typeof e=="string"?e:""}function Zt(e){return!!b("dock:is-open",e)}function oe(e,{save:t=!1}={}){return et()||b("dock:set-html",e)!==!0?!1:(t&&b("dock:save-now"),!0)}function gt(e){const t=b("dock:component-exit-state")||{};if(o.exitOpen=!!t.open,!t.open){o.onExit=null;return}o.exitName=t.name||"",o.exitLabel=f(e,"component_exit"),o.exitTitle=f(e,t.back?"component_exit_back":"component_exit_close"),o.onExit=()=>{b("dock:exit-component"),P(e)}}function xa(e,t){const s=Hn(e);if(!s||t.type!==s)return"";const n=In(t[s]);return n&&Mn(e,n)?.section_type||""}const he=[];let Oe=!1;function Fe(e,t){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(t,{timeout:2e3});return}e.setTimeout(t,200)}function Ta(e,t){for(const s of t){const n=s.type;!n||Z.has(n)||ie.has(n)||he.includes(n)||he.push(n)}Ye.htmlTreePrefetchArmed&&Gt(e)}function or(e){Ye.htmlTreePrefetchArmed=!0,Gt(e)}function Gt(e){if(Oe||!he.length)return;Oe=!0;const t=()=>{const s=he.shift();if(!s){Oe=!1;return}if(Z.has(s)||ie.has(s)){Fe(e,t);return}ie.add(s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(s)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{typeof n?.html=="string"&&Z.set(s,n.html)}).catch(()=>{}).finally(()=>{ie.delete(s),Fe(e,t)})};Fe(e,t)}function et(){return!!D}function _a(e){const t=new Map,s=Ct(e);if(!s)return t;for(const n of s.querySelectorAll("[data-sid]")){const a=n.getAttribute("data-sid");a&&!t.has(a)&&t.set(a,n.tagName.toLowerCase())}return t}function Sa(e,t){const s=Ze(e)||"page_sections";for(const n of Ht(t)||[]){const a=It(n.values),l=a&&typeof a=="object"?a[s]:null;if(Array.isArray(l))return!0}return!1}function Jt(e,t){const s=Ze(e)||"page_sections",n=_a(e),a=[];for(const l of Ht(t)||[]){const r=It(l.values),c=r&&typeof r=="object"?r[s]:null;if(Array.isArray(c)){c.forEach(k=>{if(!k||typeof k!="object"||Array.isArray(k)||typeof k.type!="string")return;const h=[k._visual_id,k.id,k._id].filter(w=>typeof w=="string"&&w!=="");if(!h.length)return;const d=xa(e,k)||k.type,i=typeof k._sve_label=="string"?k._sve_label.trim():"",v=h.map(w=>n.get(w)).find(Boolean)||"section",$=zt(k.type)[`0:${v}`];a.push({uid:h[0],ids:h,type:k.type,tag:v,label:(typeof $=="string"&&$.trim()?$.trim():"")||i||Mt(e,d)?.display||Ke(d)||d,svg:Dt(v,"",null).svg||zn.section,cat:Lt(v),enabled:k.enabled!==!1})});break}}return a}function wa(e,t,s){if(!s.length)return"";const n=b("dock:current-type")||"",a=b("dock:current-uid"),l=!!b("dock:component-exit-state")?.open;if(a){const r=Ln(a,t),c=s.find(k=>k.ids.some(h=>r.includes(h)));if(c&&(l||c.type===n))return c.uid}return s.find(r=>r.type===n)?.uid||""}function Ca(e,t,s){const n=e.find(w=>w.uid===t),a=n?Z.get(n.type):"",l=b("dock:component-src");if(!n||!a||!l)return null;const r=w=>({...w,id:`ctx:${w.id}`,path:`ctx/${w.path}`,children:w.children.map(r)}),c=Le(a).map(r),k=[],h=(w,I)=>{for(const E of w){if(E.kind==="component"&&E.src===l)return k.push(...I,E),E;const He=h(E.children,[...I,E]);if(He)return He}return null},d=h(c,[]);if(!d)return null;const i=new Set,v=new Set(k.map(w=>w.id)),$=(w,I)=>{for(const E of w)E.children.length&&(v.has(E.id)?A.has(E.path):tn(E,I))&&i.add(E.id),$(E.children,I+1)};$(c,0);for(const w of nn(s))i.add(w);return A.has(d.path)&&i.add(d.id),d.children=s,{tree:c,folds:i,hostId:d.id,rootId:c.find(w=>!w.kind)?.id||"",label:n.label,svg:n.svg,cat:n.cat}}function Pa(e,t,s){const n=b("dock:component-exit-state");if(n?.open)return Ke(n.name)||n.name||"";if(s)return t.find(l=>l.uid===s)?.label||"";const a=b("dock:current-type")||"";return Mt(e,a)?.display||Ke(a)||""}function Qt(e,t,s,n,a){const l=s.find(c=>c.uid===n);if(!l||n===a)return;A.clear(),L=null,me=!1,Q(),Ee(),q=n,Wt=R(),D=Z.get(l.type)||"",D&&(L=Pe(Le(D))||null),Yt=(b("dock:current-type")||"")===l.type,e.clearTimeout(de),de=e.setTimeout(()=>{q="",J=!1,P(e)},4e3),P(e);const r=()=>Dn(l.uid,t,e,{clampToSection:!0});En(l.uid,t,e,r),ee({source:ne,type:te.SVE_ACTIVATE,ids:l.ids},e),e.setTimeout(()=>P(e),0)}function en(e,t){if(!t)return!1;for(const s of e||[])if(s.id===t||en(s.children,t))return!0;return!1}function Pe(e){for(const t of e||[]){if(!t.kind)return t.id;const s=Pe(t.children);if(s)return s}return""}function tn(e,t){return A.has(e.path)?t===0:t>0}function nn(e){const t=new Set,s=(n,a)=>{for(const l of n)l.children.length&&tn(l,a)&&t.add(l.id),s(l.children,a+1)};return s(e,0),t}function P(e){const t=e.document,n=O(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;ba(t),Kn(e);const a=R();D&&D===a&&(D="");const l=D||a,r=Le(l);ue=r;const c=b("dock:current-type")||"",k=zt(c),h=Jt(e,t),d=Sa(e,t);c&&a&&!D&&Z.set(c,a),Ta(e,h);const i=wa(e,t,h);if(d&&!h.length){ue=[],o.rows=[],o.sections=[],o.pageBuilder=!0,o.emptyText=f(e,"html_tree_empty"),o.canEdit=!b("dock:is-locked"),o.look=ct(e),o.onRefresh=()=>P(e),o.onSection=null,gt(e),be(n,ht),kt(e,[]);return}o.pageBuilder=d;const v=`${c}|${i}`;let $=!1;v!==Ne&&(Ne=v,A.clear(),Be!==null&&l!==Be?$=!0:J=l),($||J!==!1&&l!==J)&&(J=!1,A.clear(),L=Pe(r)||null),Be=l,q&&(q===i||!h.length)&&(Yt||l!==Wt)&&(e.clearTimeout(de),q="",J=!1,en(r,L)||(A.clear(),L=Pe(r)||null));const w=h.some(p=>p.uid===q)?q:"",I=me?"":w||i,E=!!(w||i),ve=!!(b("dock:component-exit-state")||{}).open,F=ve?Ca(h,I,r):null,G=F?dt(F.tree,o.query?new Set:F.folds):dt(r,o.query?new Set:nn(r));!l.trim()&&!Zt(t)?o.emptyText=f(e,"html_tree_need_dock"):o.emptyText=f(e,"html_tree_empty"),o.slotText=f(e,"antlers_drop_here"),o.dataTitle=f(e,"data_vars_title"),o.pageTitle=f(e,"component_props_page"),o.renameTitle=f(e,"html_tree_rename"),o.tagTitle=f(e,"tw_tag"),o.hideTitle=f(e,"html_tree_hide"),o.showTitle=f(e,"html_tree_show"),o.duplicateTitle=f(e,"html_tree_duplicate"),o.deleteTitle=f(e,"html_tree_delete"),o.lockedTitle=f(e,"html_tree_locked"),o.searchEmpty=f(e,"html_tree_search_empty"),o.canEdit=!b("dock:is-locked"),o.look=ct(e),$n(e),o.onQuery=()=>P(e),gt(e),o.inComponent=ve,o.onContextRow=p=>{p!==F?.hostId&&o.onExit?.()},o.onSelect=p=>{const x=G.find(T=>T.id===p);x&&Rt(e,x.path)||nt(e,p,G)},o.onTwist=p=>{const x=G.find(T=>T.id===p)?.path;x&&(A.has(x)?A.delete(x):A.add(x),P(e))},o.onTagChange=(p,x)=>{const T=o.rows.find(K=>K.id===x);T&&!et()&&Vn(e,p.currentTarget,T)},o.onRename=p=>La(e,p),o.onRenameCommit=()=>yt(e,!0),o.onRenameCancel=()=>yt(e,!1),o.onHide=p=>Ea(e,p),o.onDuplicate=p=>Ha(e,p),o.onDelete=p=>Ma(e,p),o.onPointerDown=(p,x)=>Ba(e,p,x),o.onContext=(p,x)=>Ra(e,p,x),o.onInspectCommit=p=>Va(e,p),o.onPropValue=(p,x,T)=>Tt(e,p,x,T),o.onPropPage=(p,x)=>Qs(e,p,T=>Tt(e,x,T,!1)),o.onLoopKind=p=>Na(e,p),o.onAddBranch=p=>za(e,p),o.onLoopSortField=p=>{const x=$e(),T=String(p||"").trim();if(!x)return;const K=U?.id===x.id?U.dir:"",z=x.sortDir||K||"asc";U=null,Y(e,(ln,cn)=>re(ln,cn,{sortField:T,sortDir:z}))},o.onLoopSortDir=p=>{const x=$e(),T=String(p||"");if(x){if((T==="asc"||T==="desc")&&!x.sortField){U={id:x.id,dir:T},Xe(e,x);return}U=null,Y(e,(K,z)=>re(K,z,{sortDir:T,sortField:T==="asc"||T==="desc"?z.sortField:""}))}},o.onLoopLimit=p=>Y(e,(x,T)=>re(x,T,{limit:String(p||"").replace(/\D/g,"")})),o.onPropHost=p=>p?M.mount(p):M.unmount(),o.onInspectData=(p,x)=>{b("dock:data-menu",{anchor:p,at:G.find(T=>T.id===L)?.from,onPick:T=>x(String(T?.var||"").trim())})};const st=G.find(p=>!p.kind)?.id,at=ve?"":Pa(e,h,I),ge=I&&!ve?h.find(p=>p.uid===I):null;o.rows=G.map(p=>{const x=Dt(p.tag,p.kind,p.antlers),T=!!F&&p.id===F.rootId,K=p.id===st&&at?at:T?F.label:p.klass,z=p.id===st;return{...p,base:K,name:ta(K,p.path,k),current:p.id===L,letter:T?"":x.letter||"",svg:z&&ge?ge.svg:T?F.svg:x.svg||"",cat:T?F.cat:Lt(p.tag,p.kind,p.antlers),context:F?p.id===F.hostId?"host":p.id.startsWith("ctx:")?"dim":"":"",sectionRoot:z&&ge?ge.uid:""}});const Ie=[];for(const p of o.rows)Ie.length=p.depth,p.guides=Ie.slice(),Ie[p.depth]=p.cat;o.sections=E?h.map(p=>{const x=!!I&&p.uid===I;return{...p,current:x,ready:x&&(!w||!!D),row:{id:`sec:${p.uid}`,section:p.uid,tag:p.tag,name:p.label,kind:"",svg:p.svg,cat:p.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:x,hidden:!p.enabled}}}):[],o.onSection=p=>Qt(e,t,h,p,I),o.onRefresh=()=>P(e),Xe(e,o.rows.find(p=>p.id===L)),be(n,ht),kt(e,r)}function kt(e,t){O(e.document)&&on(e,t)}function on(e,t){const s=t[0],n=!!b("dock:component-src"),a=n?"":b("dock:current-uid")||"";ee({source:ne,type:te.SVE_HTML_PICK,on:!0,uid:a,all:n,tag:s?.tag||"",klass:s?.klass||"",nodes:lo(t)},e)}function $a(e){if(!e)return;const t=(s,n)=>{for(const a of s||[]){if(a.path===e)return!0;if(t(a.children,n+1))return n===0?A.delete(a.path):A.add(a.path),!0}return!1};t(ue,0)}function La(e,t){if(Ce)return;const s=o.rows.find(n=>n.id===t);!s||s.kind||(L=t,o.rows.forEach(n=>{n.current=n.id===t}),o.editingId=t,o.draft=s.name,e.setTimeout(()=>{const n=O(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function yt(e,t){const s=o.editingId;if(!s)return;const n=o.rows.find(a=>a.id===s);o.editingId=null,t&&n&&na(b("dock:current-type")||"",n.path,o.draft,n.base||n.klass),o.draft="",P(e)}function Ea(e,t){tt(e,t,no)}function Ha(e,t){tt(e,t,oo)}function sn(e,t){An(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const s=e.document;Bn({uid:t},s,e)})}function Ia(e,t,s){q===s&&(e.clearTimeout(de),q="",D=""),L=null,me=!1,Ne="";const n=Jt(e,t),a=n.find(l=>l.uid!==s)||n[0];a?Qt(e,t,n,a.uid,""):(D="",o.rows=[],o.sections=[],o.pageBuilder=!0,P(e)),e.setTimeout(()=>{O(e.document)&&P(e)},0)}Et("row:removed",({uid:e,parentPath:t,doc:s,win:n})=>{t!==Ze(n)||!O(n.document)||Ia(n,s,e)});function Ma(e,t){const s=o.sections?.find(a=>a.row?.id===t),n=s?s.row?.section||s.uid:o.rows.find(a=>a.id===t)?.sectionRoot;if(n){sn(e,n);return}tt(e,t,so)}function tt(e,t,s){if(b("dock:is-locked"))return;const n=R(),a=o.rows.find(r=>r.id===t);if(!a)return;const l=s(n,a);l!==n&&oe(l)}function Q(){W?.dismiss(),W=null}function Aa(e,t,s){const n=s.row?.section||s.uid;n&&(W=fe(e.document,Ge,{items:[{label:f(e,"html_tree_remove_section"),danger:!0,onPick:()=>{Q(),sn(e,n)}}],x:t.clientX,y:t.clientY,onClose:()=>{W=null}}))}function Ra(e,t,s){Q();const n=o.sections?.find(c=>c.row?.id===s);if(n){Aa(e,t,n);return}const a=o.rows.find(c=>c.id===s);if(!a)return;nt(e,s,o.rows);const l={x:t.clientX,y:t.clientY},r=c=>{c.length&&(W?.dismiss(),W=fe(e.document,Ge,{items:c,x:l.x,y:l.y,onClose:()=>{W=null}}))};if(a.kind==="component"){Da(e,a,r);return}o.canEdit&&r([{label:f(e,"component_make"),onPick:()=>{Q(),ha(e,a,{onDone:()=>P(e),onError:c=>{e.alert(c?.status===409?f(e,"component_exists"):f(e,"component_failed"))}})}}])}const bt=(e,t)=>{Q(),b("dock:open-template",t)};function Da(e,t,s){if(!Xn(t.src)){s([{label:f(e,"component_open_named",{name:t.name||t.src}),onPick:()=>bt(e,`view:partials/${t.src}`)}]);return}s([{label:f(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const a=Array.isArray(n.items)?n.items:[];s(a.length?a.map(l=>({label:f(e,"component_open_named",{name:l.label}),onPick:()=>bt(e,l.type)})):[{label:f(e,"component_none"),onPick:null}])}).catch(()=>s([{label:f(e,"component_none"),onPick:null}]))}function Ba(e,t,s){if(t.button!==0||b("dock:is-locked")||o.editingId||t.target?.closest?.("button, input"))return;Ee(),X=s,le={x:t.clientX,y:t.clientY},Se=t.currentTarget,we=t.pointerId;const n=l=>Oa(e,l),a=l=>Fa(e,l);Ue=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),Ue=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function Oa(e,t){if(!X||!le)return;const s=t.clientX-le.x,n=t.clientY-le.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{Se?.setPointerCapture?.(we)}catch{}}t.preventDefault();const a=e.document.elementFromPoint(t.clientX,t.clientY),l=a?.closest?.("[data-sve-ht-slot]");if(l){const i=l.getAttribute("data-sve-ht-id");if(i&&i!==X){o.dropId=i,o.dropPlace="inside";return}}const r=a?.closest?.("[data-sve-ht-row]"),c=r?.getAttribute("data-sve-ht-id");if(!c||c===X){o.dropId=null,o.dropPlace=null;return}const k=o.rows.find(i=>i.id===c),h=o.rows.find(i=>i.id===X);if(!k||k.context||h&&k.path.startsWith(`${h.path}/`)){o.dropId=null,o.dropPlace=null;return}const d=r.getBoundingClientRect();o.dropId=c,o.dropPlace=eo(t.clientY-d.top,d.height,!Bt(k.tag)&&k.kind!=="component")}function Fa(e,t){const s=X,n=o.dropId,a=o.dropPlace||"after",l=o.dragging;if(Ee(),l&&(Ce=!0,e.setTimeout(()=>{Ce=!1},0)),!l||b("dock:is-locked")||!s||!n||s===n)return;t?.preventDefault?.();const r=R(),c=to(r,ue,s,n,a);c!==r&&oe(c)}function Ee(){try{Se?.releasePointerCapture?.(we)}catch{}Ue?.(),X=null,le=null,Se=null,we=null,o.dragging=!1,o.dropId=null,o.dropPlace=null}function an(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function Xe(e,t){if(t?.kind==="component"){ja(e,t);return}if(B.callOpen&&(B.callOpen=!1,B.callStore=null,M.forget(),Je(e)),t?.kind!=="antlers"){o.inspect=null;return}const s=t.id;if(t.tag==="else"){o.inspect={key:s,title:f(e,"antlers_condition"),mode:"note",note:f(e,"antlers_else_note")};return}if(t.antlers==="loop"){const n=t.loopKind==="collection",a=U?.id===t.id?U.dir:"",l=t.sortDir||a;o.inspect={key:s,title:f(e,"antlers_loop"),mode:"loop",loopKind:n?"collection":"field",kinds:[{id:"field",label:f(e,"antlers_loop_field")},{id:"collection",label:f(e,"antlers_loop_collection")}],collections:an(e),value:t.expr||"",placeholder:f(e,n?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:f(e,"antlers_sort"),dir:l,needsField:l==="asc"||l==="desc",field:t.sortField||"",pickable:!n,placeholder:f(e,n?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:f(e,"antlers_sort_none")},{id:"asc",label:f(e,"antlers_sort_asc")},{id:"desc",label:f(e,"antlers_sort_desc")},{id:"random",label:f(e,"antlers_sort_random")}]},limit:{title:f(e,"antlers_limit"),value:t.limit||"",placeholder:f(e,"antlers_limit_placeholder")},branches:[]};return}o.inspect={key:s,title:f(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:f(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:f(e,"antlers_add_elseif")},{id:"else",label:f(e,"antlers_add_else")}]}}function ja(e,t){if(!Wn(e)){o.inspect=null;return}if(!t.src)return;const s=t.id;if(o.inspect={key:s,title:f(e,"component_props_values"),mode:"note",note:f(e,"code_dock_loading")},Yn()){const n={},a={},l=new Map;for(const[r,c]of Zn(R().slice(t.from,t.to))){const k=Gn(r);k&&(r!==k||!l.has(k))&&l.set(k,c)}for(const[r,c]of l)c.bound?a[r]=c.value:n[r]=c.value;vt!==s&&(vt=s,ce.clear());for(const r of ce)r in a||(a[r]="");o.inspect=null,B.callOpen=!0,B.title=B.title||f(e,"component_props"),B.callTitle=t.klass||t.name||t.src,B.callStore=M.ui,M.ui.canBind=!0,M.ui.dataTitle=f(e,"data_vars_title"),M.ui.exprPlaceholder=f(e,"component_props_expr"),M.ui.onToggleBind=(r,c)=>Ka(e,r,c),M.ui.onExpr=(r,c)=>xt(e,r,c),M.ui.onPickData=(r,c)=>b("dock:data-menu",{anchor:c,at:t.from,onPick:k=>xt(e,r,String(k?.var||"").trim())}),M.load(e,{key:`${t.src}::${s}`,src:t.src,params:n,bindings:a,readOnly:b("dock:is-locked")===!0}),M.watch(e,{src:t.src,write:r=>qa(e,r,a)}),Je(e);return}Jn(e,t.src).then(n=>{if(o.inspect?.key===s){if(!n.length){o.inspect={key:s,title:f(e,"component_props_values"),mode:"note",note:f(e,"component_props_values_none")};return}o.inspect={key:s,title:f(e,"component_props_values"),mode:"props",inheritLabel:f(e,"component_props_inherit"),rows:Qn(n,R().slice(t.from,t.to))}}})}function qa(e,t,s={}){const n=o.rows.find(r=>r.id===L);if(n?.kind!=="component"||b("dock:is-locked"))return;let a=R(),l=n.to;for(const[r,c]of Object.entries(t||{})){if(r in s)continue;const k=a.length,h=Qe(a,{from:n.from,to:l},r,c);h!==a&&(l+=h.length-k,a=h)}a!==R()&&(oe(a,{save:!0}),P(e))}function Ka(e,t,s){s?ce.add(t):ce.delete(t),rn(e,t,"",s),P(e)}function xt(e,t,s){ce.add(t),rn(e,t,s,!0),P(e)}function rn(e,t,s,n){const a=o.rows.find(c=>c.id===L);if(a?.kind!=="component"||b("dock:is-locked"))return;const l=R(),r=Qe(l,a,t,s,{bound:n});r!==l&&oe(r,{save:!0})}function $e(){const e=o.rows.find(t=>t.id===L);return e?.kind==="antlers"&&!b("dock:is-locked")?e:null}function Y(e,t){const s=$e();if(!s)return;const n=R(),a=t(n,s);a!==n&&(oe(a),P(e))}function Tt(e,t,s,n){const a=o.rows.find(c=>c.id===L);if(a?.kind!=="component"||b("dock:is-locked"))return;const l=R(),r=Qe(l,a,t,s,{bound:n});r!==l&&(oe(r,{save:!0}),P(e))}function Va(e,t){Y(e,(s,n)=>n.antlers==="loop"?Ve(s,n,n.loopKind==="collection"?"collection":"field",t):pa(s,n,t))}function Na(e,t){const s=$e();if(!s||s.antlers!=="loop")return;const n=s.loopKind==="collection"?"collection":"field";if(t!==n){if(t==="collection"){const a=an(e)[0]?.handle;if(!a)return;Y(e,(l,r)=>Ve(l,r,"collection",a));return}Y(e,(a,l)=>Ve(a,l,"field",l.handle||"items"))}}function za(e,t){Y(e,(s,n)=>ka(s,n,t))}function Ua(e,t){if(!e||!t||t.kind==="component"||Bt(t.tag))return null;const s=Un(e,t);if(s<t.openTo)return null;const n=e.lastIndexOf(`
`,s-1)+1;return e.slice(n,s).trim()===""&&n>t.openTo?n-1:s}function nt(e,t,s){if(Ce)return;const n=(s||o.rows).find(a=>a.id===t);n&&(L=t,o.rows.forEach(a=>{a.current=a.id===t}),Xe(e,n),!et()&&(b("dock:reveal-html",{from:n.from,to:n.to,caret:Ua(R(),n)}),b("dock:tw-follow"),ee({source:ne,type:te.SVE_HTML_PICK_FOCUS,path:n.path},e)))}function Xa(e,t){if(!t)return"";const s=[],n=(a,l)=>{for(const r of a||[]){const c=l||r.path===e;r.kind==="component"&&r.src===t&&s.push({path:r.path,inside:c}),n(r.children,c)}};return n(ue,!1),(s.find(a=>a.inside)||s[0])?.path||""}function Wa(e,t){if(!t||!O(e.document))return;me=!1,$a(t),P(e);const s=o.rows.find(n=>n.path===t);s&&(nt(e,s.id,o.rows),e.setTimeout(()=>{O(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function We(e){if(Te)return;const t=()=>{o.editingId||o.dragging||(e.clearTimeout(_e),_e=e.setTimeout(()=>{O(e.document)&&P(e)},80))},s=()=>t();Te=Et("dock:html-changed",t),e.document.addEventListener("sve-page-structure",s),ze=()=>{e.document.removeEventListener("sve-page-structure",s)}}function Ya(e){Te?.(),Te=null,ze?.(),ze=null,e?.clearTimeout?.(_e),_e=0}function ot(e){const t=O(e.document);if(ee({source:ne,type:te.SVE_HTML_PICK,on:!1},e),Ya(e),M.forget(),B.callOpen=!1,B.callStore=null,Je(e),Ee(),Q(),qn(e),L=null,o.inspect=null,o.editingId=null,o.draft="",o.sections=[],o.pageBuilder=!1,q="",e?.clearTimeout?.(de),!t){qe(e);return}t.remove(),Ye.headerTab==="html_tree"&&Rn(e,null),Tn(e),Pt(e),$t(e),qe(e)}function sr(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=ye,be(t,Ft,{title:f(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>ot(e)))}function ar(e){We(e),P(e)}function Za(e){const t=e.document;if(!Sn(e,"html_tree"))return;if(O(t)){We(e),P(e);return}if(!Zt(t))return;me=!0,A.clear(),wn(e,[ye]);const s=t.createElement("div");s.id=ye,s.style.cssText=Cn,be(s,Ft,{title:f(e,"html_tree")}),s.querySelector("[data-sve-close]")?.addEventListener("click",()=>ot(e)),Pn(e,s),Pt(e),$t(e),qe(e),We(e),P(e)}function rr(e){if(O(e.document)){ot(e);return}Za(e)}At("html-tree:from-preview",({path:e,src:t}={})=>{Rt(window,e)||Wa(window,Xa(e,t)||e)});At("html-tree:arm-pick",e=>{const t=window;return e?(on(t,Le(R())),!0):(O(t.document)||ee({source:ne,type:te.SVE_HTML_PICK,on:!1},t),!0)});function ir(){Z.clear(),ie.clear(),he.length=0}export{ya as HTML_TREE_STYLE_ID,or as armHtmlTreePrefetch,ir as clearHtmlTreeTemplates,Q as closeHtmlTreeMenu,ot as closeHtmlTreePanel,ba as ensureHtmlTreeStyles,sr as fillHtmlTreePane,L as htmlTreeActiveId,O as htmlTreePanel,_e as htmlTreeTimer,Te as htmlTreeUnhook,Za as openHtmlTreePanel,P as renderHtmlTree,ar as showHtmlTreePane,Ya as stopWatchHtmlTreeDock,rr as toggleHtmlTreePanel,We as watchHtmlTreeDock};
