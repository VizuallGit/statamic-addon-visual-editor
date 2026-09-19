const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-D8Xdoe3O.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{_ as me,k as N,l as un,p as St,o as m,a as g,b as S,s as b,t as _,w as je,F as H,d as j,b4 as hn,v as wt,g as C,j as te,h as f,C as pn,y,i as Ct,b5 as it,b6 as lt,b7 as fn,b8 as mn,b9 as vn,ba as Pt,z as ne,ap as gn,bb as o,u as d,f as kn,e as yn,q as z,x as bn,bc as ke,bd as xn,be as Tn,B as ie,c as re,N as _n,G as Sn,aN as Ze,aq as qe,am as wn,aP as $t,aQ as Et,af as Cn,ag as ct,S as ye,V as be,O as Pn,aO as $n,an as En,ao as Ln,bf as dt,bg as Hn,U as Lt,A as Ht,a8 as Ge,J as It,K as Mt,ax as Ke,ay as Ve,I as In,bh as Mn,aS as An,aT as Rn,aw as Dn,bi as Bn,b0 as On,ae as At,aK as Fn,aF as jn}from"./addon-DtVV09zK.js";import{M as oe,S as se}from"./protocol-D3FYhCm9.js";import{D as B,E as qn,F as Je,G as Kn,t as Vn,I as Qe,v as Nn,z as zn,b as Ee,l as ut,J as Rt,q as Un,K as Dt,L as Xn,H as Wn,M as et,N as Bt,O as Yn,h as Zn,c as Gn,Q as Jn,R as Qn,S as eo,T as to,U as no,V as oo,W as so,X as ao,Y as ro,Z as io}from"./tw-classes-uRMJWk6g.js";import{canEditFields as lo,currentSetHandle as co,openFieldsetOverlay as uo}from"./section-fields-C9Yd01eM.js";import{a as ho}from"./html-pick-align-CK-9iH9_.js";import"./ai-text-icon-B7uCWIwa.js";import"./FieldsetOverlay-oPbarUNq.js";const po={class:"sve-dialog__title"},fo={for:"sve-new-section-group"},mo=["value"],vo={for:"sve-new-section-name"},go=["placeholder"],ko={key:0,class:"sve-dialog__note"},yo={class:"sve-dialog__actions"},bo=["disabled"],xo=["disabled"],To={__name:"NewSectionPrompt",props:{heading:{type:String,required:!0},groupLabel:{type:String,required:!0},nameLabel:{type:String,required:!0},placeholder:{type:String,default:""},note:{type:String,default:""},groups:{type:Array,required:!0},cancelLabel:{type:String,required:!0},saveLabel:{type:String,required:!0},onOk:{type:Function,required:!0},onClose:{type:Function,required:!0}},setup(e){const t=e,s=N(""),n=N(t.groups[0]?.key??""),a=N(null),l=N(!1);un(()=>St(()=>a.value?.focus()));function r(){const h=s.value.trim();if(!h||!n.value||l.value){a.value?.focus();return}l.value=!0,t.onOk(h,n.value)}function u(h){h.target===h.currentTarget&&t.onClose()}function k(h){h.key==="Enter"?r():h.key==="Escape"&&t.onClose()}return(h,c)=>(m(),g("div",{class:"sve-dialog-overlay",onClick:u},[S("div",{class:"sve-dialog",onClick:c[3]||(c[3]=b(()=>{},["stop"]))},[S("div",po,_(e.heading),1),S("label",fo,_(e.groupLabel),1),je(S("select",{id:"sve-new-section-group","onUpdate:modelValue":c[0]||(c[0]=i=>n.value=i),onKeydown:k},[(m(!0),g(H,null,j(e.groups,i=>(m(),g("option",{key:i.key,value:i.key},_(i.display),9,mo))),128))],544),[[hn,n.value]]),S("label",vo,_(e.nameLabel),1),je(S("input",{id:"sve-new-section-name",ref_key:"input",ref:a,"onUpdate:modelValue":c[1]||(c[1]=i=>s.value=i),type:"text",placeholder:e.placeholder,onKeydown:k},null,40,go),[[wt,s.value]]),e.note?(m(),g("p",ko,_(e.note),1)):C("",!0),S("div",yo,[S("button",{type:"button",class:"is-cancel",disabled:l.value,onClick:c[2]||(c[2]=(...i)=>e.onClose&&e.onClose(...i))},_(e.cancelLabel),9,bo),S("button",{type:"button",class:"is-primary",disabled:l.value,onClick:r},_(e.saveLabel),9,xo)])])]))}},_o=me(To,[["__scopeId","data-v-d21be545"]]),Ot="/!/sve/section-types",Ft=new Set;async function So(e){const t=await e.fetch(Ot,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!t.ok)throw new Error(`section-types ${t.status}`);const s=await t.json(),n=new Map;for(const a of s.types||[])a?.group&&!n.has(a.group)&&n.set(a.group,a.group_display||a.group);return[...n].map(([a,l])=>({key:a,display:l}))}async function wo(e,{display:t,group:s,static:n=!1}){const a=await e.fetch(Ot,{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Ct(e),Accept:"application/json"},credentials:"same-origin",body:JSON.stringify({display:t,group:s,static:!!n})}),l=await a.json().catch(()=>({}));if(!a.ok){const r=new Error(l.error||`section-types ${a.status}`);throw r.reason=l.error,r}return l}async function Co(e,t,s=null){if(!t||typeof it!="function"||typeof lt!="function")return null;const n=await it(e,t);if(!n)return null;const a=fn(),l=mn(e,"page",{handle:t},n?.defaults,a),r=vn(l,n?.new||{},n?.defaults);return lt(e,e.document,s,l,r)?l:null}const ht=700,Po=17;function $o(e,t){const s=(t||[]).filter(Boolean);if(!s.length)return;let n=0;const a=()=>{n+=1;const l=Pt(e),r=l?s.some(u=>l.querySelector(`[data-sid="${CSS.escape(u)}"]`)):!0;r&&ne({source:se,type:oe.SVE_ACTIVATE,ids:s},e),(r?!l&&n<6:n<Po)&&e.setTimeout(a,ht)};e.setTimeout(a,ht)}function Eo(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function Lo(e){return new Promise(t=>{let s=!1;const n=l=>{s||(s=!0,a.dismiss(),t(l==="static"||l==="fields"?l:null))},a=te(e.document,pn,{title:f(e,"section_new_kind"),body:f(e,"section_new_kind_note"),buttons:[{value:"cancel",label:f(e,"cancel"),variant:"ghost"},{value:"static",label:f(e,"section_new_static"),variant:"primary"},{value:"fields",label:f(e,"section_new_with_fields"),variant:"primary"}],onPick:n,onClose:()=>n(null)})})}const Ho=`<section class="[ ] py-800">
    
</section>
`;function Io(e){const s=`${String(y("dock:html")||"").replace(/\s+$/,"")}

${Ho}`;return y("dock:set-html",s)!==!0?(e.Statamic?.$toast?.error(f(e,"section_new_failed")),!1):(y("dock:save-now"),e.Statamic?.$toast?.success(f(e,"section_new_template_done")),!0)}function Mo(e,{kind:t="fields",afterUid:s=null,onDone:n,onError:a,onClose:l}={}){(async()=>{let r=[];try{r=await So(e)}catch(k){a?.(k),e.Statamic?.$toast?.error(f(e,"section_new_failed"));return}if(!r.length){a?.(new Error("no groups")),e.Statamic?.$toast?.error(f(e,"section_new_failed"));return}const u=te(e.document,_o,{heading:f(e,"section_new"),groupLabel:f(e,"section_new_group"),nameLabel:f(e,"section_new_name"),placeholder:f(e,"section_new_placeholder"),note:f(e,t==="static"?"section_new_static_note":"section_new_note"),groups:r,cancelLabel:f(e,"cancel"),saveLabel:f(e,"section_new_create"),onClose:l,onOk:(k,h)=>{(async()=>{try{const c=await wo(e,{display:k,group:h,static:t==="static"});c.section?.static&&c.section.handle&&Ft.add(c.section.handle),u.dismiss(),e.Statamic?.$toast?.success(f(e,"section_created",{name:c.section?.display||k})),e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"));const i=await Co(e,c.section?.handle,s);!i&&c.section?.handle&&y("dock:open-template",c.section.handle),n?.({...c,uid:i?._visual_id||""})}catch(c){u.dismiss(),e.Statamic?.$toast?.error(f(e,c.reason==="bad_name"?"section_new_bad_name":"section_new_failed")),a?.(c)}})()}})})()}const Ao={key:0,class:"sve-ht-inspect"},Ro={class:"sve-ht-inspect__head"},Do={key:0,class:"sve-ht-inspect__note"},Bo={key:2,class:"sve-ht-inspect__props"},Oo={class:"sve-ht-inspect__proplabel"},Fo={key:0},jo=["value","disabled","onChange"],qo={value:""},Ko=["value"],Vo=["value"],No=["value","placeholder","onChange"],zo=["title","disabled","onClick"],Uo=["title","disabled","onClick"],Xo={key:0,class:"sve-ht-inspect__seg"},Wo=["data-active","disabled","onClick"],Yo=["value","disabled"],Zo={key:0,value:""},Go=["value"],Jo={key:2,class:"sve-ht-inspect__box"},Qo=["value","placeholder","disabled","onKeydown"],es=["title","disabled"],ts={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},ns=["value","disabled"],os=["value"],ss={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},as=["value","placeholder","disabled"],rs=["title","disabled"],is={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},ls=["value","placeholder","disabled"],cs={key:4,class:"sve-ht-inspect__add"},ds=["disabled","onClick"],Me='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',us='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',hs={__name:"HtmlTreeInspector",setup(e){const t=N(null);gn(t,h=>o.onPropHost?.(h||null));const s=N(null),n=N(null);function a(h){o.onInspectCommit?.(h.target.value)}function l(h,c,i){!h||!c||(h.value=c,h.focus(),h.setSelectionRange(c.length,c.length),i(c))}function r(h,c){o.onInspectData?.(h.currentTarget,i=>o.onPropValue?.(c.handle,i,!0))}function u(h){o.onInspectData?.(h.currentTarget,c=>l(s.value,c,i=>o.onInspectCommit?.(i)))}function k(h){o.onInspectData?.(h.currentTarget,c=>l(n.value,c,i=>o.onLoopSortField?.(i)))}return(h,c)=>d(o).inspect?(m(),g("div",Ao,[S("div",Ro,_(d(o).inspect.title),1),d(o).inspect.mode==="note"?(m(),g("div",Do,_(d(o).inspect.note),1)):d(o).inspect.mode==="statamic"?(m(),g("div",{key:1,ref_key:"propHost",ref:t,class:"sve-ht-inspect__form"},null,512)):d(o).inspect.mode==="props"?(m(),g("div",Bo,[(m(!0),g(H,null,j(d(o).inspect.rows,i=>(m(),g("label",{key:i.handle,class:"sve-ht-inspect__prop"},[S("span",Oo,[kn(_(i.label)+" ",1),i.bound?(m(),g("em",Fo,":")):C("",!0)]),S("span",{class:yn(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":i.type==="select"||i.type==="link"}])},[i.type==="select"&&!i.bound?(m(),g("select",{key:0,value:i.value,disabled:!d(o).canEdit,onChange:v=>d(o).onPropValue?.(i.handle,v.target.value,!1)},[S("option",qo,_(i.placeholder||d(o).inspect.inheritLabel),1),i.value&&!i.options.includes(i.value)?(m(),g("option",{key:0,value:i.value},_(i.value),9,Ko)):C("",!0),(m(!0),g(H,null,j(i.options,v=>(m(),g("option",{key:v,value:v},_(v),9,Vo))),128))],40,jo)):(m(),g("input",{key:1,type:"text",value:i.value,placeholder:i.placeholder||d(o).inspect.inheritLabel,onChange:v=>d(o).onPropValue?.(i.handle,v.target.value,i.bound)},null,40,No)),i.type==="link"?(m(),g("button",{key:2,type:"button","data-sve-ht-data":"",title:d(o).pageTitle,disabled:!d(o).canEdit,onClick:v=>d(o).onPropPage?.(v.currentTarget,i.handle),innerHTML:us},null,8,zo)):C("",!0),S("button",{type:"button","data-sve-ht-data":"",title:d(o).dataTitle,disabled:!d(o).canEdit,onClick:v=>r(v,i),innerHTML:Me},null,8,Uo)],2)]))),128))])):(m(),g(H,{key:3},[d(o).inspect.mode==="loop"?(m(),g("div",Xo,[(m(!0),g(H,null,j(d(o).inspect.kinds,i=>(m(),g("button",{key:i.id,type:"button","data-active":i.id===d(o).inspect.loopKind?"":void 0,disabled:!d(o).canEdit,onClick:v=>d(o).onLoopKind?.(i.id)},_(i.label),9,Wo))),128))])):C("",!0),d(o).inspect.mode==="loop"&&d(o).inspect.loopKind==="collection"?(m(),g("select",{key:d(o).inspect.key+":"+d(o).inspect.value,value:d(o).inspect.value,disabled:!d(o).canEdit,onChange:a},[d(o).inspect.value?C("",!0):(m(),g("option",Zo,_(d(o).inspect.placeholder),1)),(m(!0),g(H,null,j(d(o).inspect.collections,i=>(m(),g("option",{key:i.handle,value:i.handle},_(i.title),9,Go))),128))],40,Yo)):(m(),g("div",Jo,[(m(),g("input",{ref_key:"field",ref:s,key:d(o).inspect.key,type:"text",value:d(o).inspect.value,placeholder:d(o).inspect.placeholder,disabled:!d(o).canEdit,spellcheck:"false",onKeydown:[c[0]||(c[0]=b(()=>{},["stop"])),z(b(a,["prevent"]),["enter"])],onBlur:a},null,40,Qo)),S("button",{type:"button","data-sve-ht-data":"",title:d(o).dataTitle,disabled:!d(o).canEdit,innerHTML:Me,onMousedown:c[1]||(c[1]=b(()=>{},["prevent"])),onClick:b(u,["stop","prevent"])},null,40,es)])),d(o).inspect.sort?(m(),g(H,{key:3},[S("div",ts,_(d(o).inspect.sort.title),1),(m(),g("select",{key:d(o).inspect.key+":dir:"+d(o).inspect.sort.dir,value:d(o).inspect.sort.dir,disabled:!d(o).canEdit,onChange:c[2]||(c[2]=i=>d(o).onLoopSortDir?.(i.target.value))},[(m(!0),g(H,null,j(d(o).inspect.sort.dirs,i=>(m(),g("option",{key:i.id,value:i.id},_(i.label),9,os))),128))],40,ns)),d(o).inspect.sort.needsField?(m(),g("div",ss,[(m(),g("input",{ref_key:"sortField",ref:n,key:d(o).inspect.key+":field",type:"text",value:d(o).inspect.sort.field,placeholder:d(o).inspect.sort.placeholder,disabled:!d(o).canEdit,spellcheck:"false",onKeydown:[c[3]||(c[3]=b(()=>{},["stop"])),c[4]||(c[4]=z(b(i=>d(o).onLoopSortField?.(i.target.value),["prevent"]),["enter"]))],onBlur:c[5]||(c[5]=i=>d(o).onLoopSortField?.(i.target.value))},null,40,as)),d(o).inspect.sort.pickable?(m(),g("button",{key:0,type:"button","data-sve-ht-data":"",title:d(o).dataTitle,disabled:!d(o).canEdit,innerHTML:Me,onMousedown:c[6]||(c[6]=b(()=>{},["prevent"])),onClick:b(k,["stop","prevent"])},null,40,rs)):C("",!0)])):C("",!0),S("div",is,_(d(o).inspect.limit.title),1),(m(),g("input",{key:d(o).inspect.key+":limit",type:"number",min:"1",value:d(o).inspect.limit.value,placeholder:d(o).inspect.limit.placeholder,disabled:!d(o).canEdit,onKeydown:[c[7]||(c[7]=b(()=>{},["stop"])),c[8]||(c[8]=z(b(i=>d(o).onLoopLimit?.(i.target.value),["prevent"]),["enter"]))],onBlur:c[9]||(c[9]=i=>d(o).onLoopLimit?.(i.target.value))},null,40,ls))],64)):C("",!0),d(o).inspect.branches?.length?(m(),g("div",cs,[(m(!0),g(H,null,j(d(o).inspect.branches,i=>(m(),g("button",{key:i.id,type:"button",disabled:!d(o).canEdit,onClick:v=>d(o).onAddBranch?.(i.id)},_(i.label),9,ds))),128))])):C("",!0)],64))])):C("",!0)}},ps=me(hs,[["__scopeId","data-v-26254b75"]]),fs={class:"sve-html-tree"},ms={class:"sve-pane-bar","data-sve-pane-bar":""},vs={"data-sve-right-title":""},gs={class:"sve-ht-tools"},ks=["title"],ys=["placeholder","aria-label","value"],bs=["aria-label"],xs=["title","aria-label"],Ts={key:1,class:"sve-tree-exit"},_s=["title"],Ss=["title"],ws='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',Cs='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',Ps='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',$s={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const t=f(window,"html_tree_search"),s=Eo(window),n=f(window,"section_new"),a=N(!1);function l(){a.value=!1}async function r(h){if(h)for(let c=0;c<20;c+=1){await St(),o.onRefresh?.();const i=o.sections.find(v=>v.uid===h);if(i){o.onSection?.(h),$o(window,i.ids);return}await new Promise(v=>setTimeout(v,50))}}function u(){a.value||(a.value=!0,(async()=>{const h=await Lo(window);if(!h){l();return}if(!(o.sections.length||o.pageBuilder)){const c=Io(window);l(),c&&h==="fields"&&Tn(window);return}Mo(window,{kind:h,afterUid:o.sections.length?o.sections[o.sections.length-1].uid:null,onDone:c=>{l(),r(c?.uid)},onError:l,onClose:l})})())}function k(h){const c=!!o.query;o.query=h,c!==!!h&&o.onQuery?.()}return(h,c)=>(m(),g("div",fs,[S("div",ms,[S("div",vs,_(e.title),1),c[5]||(c[5]=bn('<div data-sve-right-actions data-v-757cfaea><button type="button" data-sve-right-pin aria-pressed="false" data-v-757cfaea></button><button type="button" data-sve-close aria-label="Close" data-v-757cfaea><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-757cfaea><path d="M18 6 6 18" data-v-757cfaea></path><path d="m6 6 12 12" data-v-757cfaea></path></svg></button></div>',1))]),S("div",gs,[S("label",{class:"sve-ht-search",title:d(t)},[S("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:Cs}),S("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:d(t),"aria-label":d(t),value:d(o).query,autocomplete:"off",spellcheck:"false",onInput:c[0]||(c[0]=i=>k(i.target.value)),onKeydown:[c[1]||(c[1]=b(()=>{},["stop"])),c[2]||(c[2]=z(b(i=>k(""),["prevent"]),["escape"]))]},null,40,ys),d(o).query?(m(),g("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":d(t),innerHTML:Ps,onClick:c[3]||(c[3]=i=>k(""))},null,8,bs)):C("",!0)],8,ks),d(s)&&(d(o).sections.length||d(o).pageBuilder||d(o).rows.length)?(m(),g("button",{key:0,type:"button",class:"sve-ht-new",title:d(n),"aria-label":d(n),innerHTML:ws,onClick:u},null,8,xs)):C("",!0)]),d(B).inSidebar?C("",!0):(m(),ke(qn,{key:0})),c[6]||(c[6]=S("div",{"data-sve-html-tree-list":""},null,-1)),xn(ps),d(o).exitOpen&&!d(B).inSidebar?(m(),g("div",Ts,[S("span",{class:"sve-tree-exit__name",title:d(o).exitName},_(d(o).exitName),9,_s),S("button",{type:"button",class:"sve-tree-exit__go",title:d(o).exitTitle,onClick:c[4]||(c[4]=i=>d(o).onExit?.())},_(d(o).exitLabel),9,Ss)])):C("",!0)]))}},jt=me($s,[["__scopeId","data-v-757cfaea"]]);function qt(e){return String(e||"").trim().toLowerCase()}function Kt(e,t){return t?[e.name,e.tag,e.klass,e.label,e.src].filter(s=>typeof s=="string"&&s).join(" ").toLowerCase().includes(t):!0}function Es(e,t){const s=qt(t);if(!s)return{rows:e,hits:new Set};const n=new Set;for(const r of e)Kt(r,s)&&n.add(r.path);const a=[...n];return{rows:e.filter(r=>n.has(r.path)||a.some(u=>u.startsWith(`${r.path}/`))),hits:n}}const Ls=["title"],Hs={"data-sve-ht-indent":"","aria-hidden":"true"},Is=["data-sve-ht-cat"],Ms={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},As={key:2,"data-sve-ht-letter":""},Rs=["innerHTML"],Ds=["title"],Bs=["title"],Os={key:1,"data-sve-ht-kind":""},Fs={key:3,"data-sve-ht-name":""},js={key:4,"data-sve-ht-actions":""},qs=["disabled","title","innerHTML"],Ks=["disabled","title"],Vs=["disabled","title"],Ns=["disabled","title"],zs=["data-sve-ht-id"],Us='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',Xs='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',Ws='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Ys='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',Zs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',Gs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',Js={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const t=lo(window),s=f(window,"section_fields");function n(){const c=co();if(!c){window.Statamic?.$toast?.error(f(window,"section_fields_none"));return}uo(window,c)}function a(c){return c.kind==="component"?c.src?`partial:${c.src}`:c.tag:c.name?`${c.tag} ${c.name}`:c.tag}function l(c){return!!c.section}function r(c){return!!c.context}function u(c){if(l(c)){o.onSection?.(c.section);return}if(r(c)){o.onContextRow?.(c.id);return}o.onSelect?.(c.id)}function k(c,i){const v={"data-sve-ht-id":c.id};return c.current&&(v["data-sve-ht-current"]=""),c.hidden&&(v["data-sve-ht-hidden"]=""),v["data-sve-ht-cat"]=c.cat||"other",v["data-sve-ht-depth"]=String(c.depth),i&&(v["data-sve-ht-dim"]=""),r(c)&&(v["data-sve-ht-context"]=c.context),l(c)&&(v["data-sve-ht-sec"]=""),!l(c)&&o.dropId===c.id&&o.dropPlace&&(v["data-sve-ht-drop"]=o.dropPlace),v}function h(c){return!c.hidden||c.wrapFrom!=null}return(c,i)=>(m(),g(H,null,[S("div",ie({"data-sve-ht-row":""},k(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:i[26]||(i[26]=v=>u(e.row)),onDblclick:i[27]||(i[27]=b(v=>l(e.row)||r(e.row)?null:d(o).onRename?.(e.row.id),["prevent"])),onKeydown:[i[28]||(i[28]=z(b(v=>u(e.row),["prevent"]),["enter"])),i[29]||(i[29]=z(b(v=>u(e.row),["prevent"]),["space"]))],onPointerdown:i[30]||(i[30]=v=>l(e.row)||r(e.row)?null:d(o).onPointerDown?.(v,e.row.id)),onContextmenu:i[31]||(i[31]=b(v=>l(e.row)||r(e.row)?null:d(o).onContext?.(v,e.row.id),["prevent","stop"]))}),[S("span",Hs,[(m(!0),g(H,null,j(e.row.guides||[],(v,$)=>(m(),g("i",{key:$,"data-sve-ht-cat":v},null,8,Is))),128))]),e.row.hasChildren||e.row.emptyBlock?(m(),g("button",ie({key:0,type:"button","data-sve-ht-twist":""},e.row.shut?{"data-sve-ht-shut":""}:{},{innerHTML:Xs,onClick:i[0]||(i[0]=b(v=>l(e.row)?d(o).onSection?.(e.row.section):d(o).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:i[1]||(i[1]=b(()=>{},["stop"])),onDblclick:i[2]||(i[2]=b(()=>{},["stop"]))}),null,16)):(m(),g("span",Ms)),e.row.letter?(m(),g("span",As,_(e.row.letter),1)):(m(),g("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Rs)),S("span",{"data-sve-ht-text":"",title:d(o).renameTitle},[!e.row.kind&&!l(e.row)&&!r(e.row)?(m(),g("button",{key:0,type:"button","data-sve-ht-tag":"",title:d(o).tagTitle,onClick:i[3]||(i[3]=b(()=>{},["stop","prevent"])),onPointerdown:i[4]||(i[4]=b(()=>{},["stop"])),onDblclick:i[5]||(i[5]=b(v=>d(o).onTagChange?.(v,e.row.id),["stop","prevent"]))},_(e.row.tag),41,Bs)):(m(),g("span",Os,_(e.row.tag),1)),d(o).editingId===e.row.id&&!l(e.row)?je((m(),g("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":i[6]||(i[6]=v=>d(o).draft=v),onMousedown:i[7]||(i[7]=b(()=>{},["stop"])),onPointerdown:i[8]||(i[8]=b(()=>{},["stop"])),onClick:i[9]||(i[9]=b(()=>{},["stop"])),onDblclick:i[10]||(i[10]=b(()=>{},["stop"])),onKeydown:[i[11]||(i[11]=b(()=>{},["stop"])),i[12]||(i[12]=z(b(v=>d(o).onRenameCommit?.(),["prevent"]),["enter"])),i[13]||(i[13]=z(b(v=>d(o).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:i[14]||(i[14]=v=>d(o).onRenameCommit?.())},null,544)),[[wt,d(o).draft]]):(m(),g("span",Fs,_(e.row.name),1))],8,Ds),!l(e.row)&&!r(e.row)?(m(),g("span",js,[h(e.row)?(m(),g("button",{key:0,type:"button","data-sve-ht-eye":"",disabled:!d(o).canEdit,title:d(o).canEdit?e.row.hidden?d(o).showTitle:d(o).hideTitle:d(o).lockedTitle,innerHTML:e.row.hidden?Ys:Ws,onClick:i[15]||(i[15]=b(v=>d(o).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:i[16]||(i[16]=b(()=>{},["stop"])),onDblclick:i[17]||(i[17]=b(()=>{},["stop"]))},null,40,qs)):C("",!0),d(t)&&e.row.fieldsIcon?(m(),g("button",{key:1,type:"button","data-sve-ht-fields":"",disabled:!d(o).canEdit,title:d(o).canEdit?d(s):d(o).lockedTitle,innerHTML:Us,onClick:b(n,["stop","prevent"]),onPointerdown:i[18]||(i[18]=b(()=>{},["stop"])),onDblclick:i[19]||(i[19]=b(()=>{},["stop"]))},null,40,Ks)):C("",!0),S("button",{type:"button","data-sve-ht-dup":"",disabled:!d(o).canEdit,title:d(o).canEdit?d(o).duplicateTitle:d(o).lockedTitle,innerHTML:Zs,onClick:i[20]||(i[20]=b(v=>d(o).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:i[21]||(i[21]=b(()=>{},["stop"])),onDblclick:i[22]||(i[22]=b(()=>{},["stop"]))},null,40,Vs),S("button",{type:"button","data-sve-ht-del":"",disabled:!d(o).canEdit,title:d(o).canEdit?d(o).deleteTitle:d(o).lockedTitle,innerHTML:Gs,onClick:i[23]||(i[23]=b(v=>d(o).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:i[24]||(i[24]=b(()=>{},["stop"])),onDblclick:i[25]||(i[25]=b(()=>{},["stop"]))},null,40,Ns)])):C("",!0)],16,Ls),e.row.emptyBlock&&!e.row.shut?(m(),g("div",ie({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},d(o).dropId===e.row.id&&d(o).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),_(d(o).slotText),17,zs)):C("",!0)],64))}},Ae=me(Js,[["__scopeId","data-v-e9e0092a"]]),Qs=["data-sve-ht-look"],ea={key:0,class:"sve-ht-empty"},ta={key:1,class:"sve-ht-empty"},na={key:0,class:"sve-ht-empty"},oa={__name:"HtmlTreeList",setup(e){const t=re(()=>qt(o.query)),s=re(()=>Es(o.rows,t.value)),n=re(()=>s.value.rows),a=re(()=>t.value?o.sections.filter(u=>Kt(u.row,t.value)||u.current&&u.ready&&n.value.length>0):o.sections),l=re(()=>!!t.value&&!a.value.length&&!n.value.length);function r(u){return!!t.value&&!s.value.hits.has(u.path)}return(u,k)=>(m(),g("div",ie({class:"sve-ht-root","data-sve-ht-look":d(o).look,style:d(o).familyStyle},d(o).dragging?{"data-sve-ht-dragging":""}:{}),[!d(o).rows.length&&!d(o).sections.length?(m(),g("div",ea,_(d(o).emptyText),1)):l.value?(m(),g("div",ta,_(d(o).searchEmpty),1)):C("",!0),d(o).sections.length?(m(!0),g(H,{key:2},j(a.value,h=>(m(),g("div",ie({key:h.uid},{ref_for:!0},h.current?{"data-sve-ht-branch":""}:{}),[h.ready?(m(),g(H,{key:0},[(m(!0),g(H,null,j(n.value,c=>(m(),ke(Ae,{key:c.id,row:c,dim:r(c)},null,8,["row","dim"]))),128)),d(o).rows.length?C("",!0):(m(),g("div",na,_(d(o).emptyText),1))],64)):(m(),ke(Ae,{key:1,row:h.row,dim:d(o).inComponent},null,8,["row","dim"]))],16))),128)):d(o).rows.length?(m(!0),g(H,{key:3},j(n.value,h=>(m(),ke(Ae,{key:h.id,row:h,dim:r(h)},null,8,["row","dim"]))),128)):C("",!0)],16,Qs))}},pt=me(oa,[["__scopeId","data-v-2240400d"]]);let Re=null;function sa(e){return Re||(Re=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{pages:[]}).then(t=>Array.isArray(t.pages)?t.pages:[]).catch(()=>[])),Re}let xe=null;function De(){xe?.dismiss(),xe=null}function aa(e,t,s){De();const n=t?.getBoundingClientRect?.(),a={x:n?n.left:0,y:n?n.bottom+4:0};sa(e).then(l=>{const r=l.length?l.map(u=>({label:u.title||u.url,onPick:()=>{De(),s(u.url)}})):[{label:f(e,"component_props_pages_none"),onPick:null}];De(),xe=te(e.document,Je,{items:r,x:a.x,y:a.y,onClose:()=>{xe=null}})})}const Vt="sve-html-tree-labels";function Nt(){try{const e=globalThis.localStorage?.getItem(Vt);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function ra(e){try{globalThis.localStorage?.setItem(Vt,JSON.stringify(e))}catch{}}function zt(e){return String(e||"_")}function Ut(e){const t=Nt()[zt(e)];return t&&typeof t=="object"?{...t}:{}}function ia(e,t,s){const n=s?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function la(e,t,s,n){if(!t)return;const a=zt(e),l=Nt(),r={...l[a]||{}},u=String(s||"").replace(/\s+/g," ").trim(),k=String(n||"").trim();!u||u===k?delete r[t]:r[t]=u,Object.keys(r).length?l[a]=r:delete l[a],ra(l)}const ca=/^@(media|supports|container|layer|scope)\b/i;function da(e){const t=String(e||""),s=[];let n=0,a=0;for(;n<t.length;){if(t[n]==="{"&&t[n+1]==="{"){const u=t.indexOf("}}",n+2);n=u===-1?t.length:u+2;continue}if(t[n]==="/"&&t[n+1]==="*"){const u=t.indexOf("*/",n+2);n=u===-1?t.length:u+2;continue}if(t[n]==='"'||t[n]==="'"){const u=t[n];for(n+=1;n<t.length&&t[n]!==u;)n+=t[n]==="\\"?2:1;n+=1;continue}if(t[n]!=="{"){n+=1;continue}let l=1,r=n+1;for(;r<t.length&&l>0;){if(t[r]==="{"&&t[r+1]==="{"){const u=t.indexOf("}}",r+2);r=u===-1?t.length:u+2;continue}if(t[r]==="/"&&t[r+1]==="*"){const u=t.indexOf("*/",r+2);r=u===-1?t.length:u+2;continue}if(t[r]==='"'||t[r]==="'"){const u=t[r];for(r+=1;r<t.length&&t[r]!==u;)r+=t[r]==="\\"?2:1;r+=1;continue}t[r]==="{"?l+=1:t[r]==="}"&&(l-=1),r+=1}s.push({selector:t.slice(a,n).trim(),body:t.slice(n+1,r-1),from:a,to:r,text:t.slice(a,r).trim()}),n=r,a=r}return s}function ft(e){const t=String(e||""),s=new Set,n=new Set,a=new Set;for(const l of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const r of l[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))r&&(s.add(r),s.add(r.replace(/([:./%!#()[\],])/g,"\\$1")));for(const l of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))l[2].trim()&&n.add(l[2].trim());for(const l of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))a.add(l[1].toLowerCase());return{classes:s,ids:n,tags:a}}function mt(e,t){const s=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),n=[...s.matchAll(/\.((?:\\.|[\w-])+)/g)].map(r=>r[1]),a=[...s.matchAll(/#((?:\\.|[\w-])+)/g)].map(r=>r[1]);if(n.length||a.length){const r=u=>u.replace(/\\(.)/g,"$1");return n.every(u=>t.classes.has(u)||t.classes.has(r(u)))&&a.every(u=>t.ids.has(r(u)))}const l=[...s.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(r=>r[2].toLowerCase());return l.length>0&&l.every(r=>t.tags.has(r))}function ua(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function ha(e,t,s){const n=ua(e);if(!n.length)return"keep";const a=n.filter(r=>mt(r,t));return a.length?a.length===n.length&&!n.some(r=>mt(r,s))?"move":"copy":"keep"}function Xt(e,t,s){const n=String(e||""),a=ft(t),l=ft(s),r=[],u=[];let k=0;for(const h of da(n)){const c=n.slice(h.from,h.to),i=c.match(/^\s*/)[0];if(k=h.to,ca.test(h.selector)){const $=Xt(h.body,t,s);$.move.trim()&&r.push(`${h.selector} {
${$.move.trim()}
}`),$.keep.trim()&&u.push(`${i}${h.selector} {
${$.keep.trim()}
}`);continue}const v=h.selector.startsWith("@")?"keep":ha(h.selector,a,l);if(v==="move"){r.push(h.text);continue}v==="copy"&&r.push(h.text),u.push(c)}return u.push(n.slice(k)),{move:r.join(`

`).trim(),keep:u.join("").replace(/\n{3,}/g,`

`).trim()}}const pa="/!/sve/component";function fa(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let s=null;for(const n of t){if(!n.trim())continue;const a=n.match(/^[ \t]*/)[0].length;s=s===null?a:Math.min(s,a)}return s?t.map(n=>n.slice(s)).join(`
`):t.join(`
`)}function ma(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function va(e,t){if(!Vn(e))return"";try{return await(await Sn(()=>import("./tw-compile-D8Xdoe3O.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(s){return console.error("[sve] component tailwind compile",s),""}}async function ga(e,t){const s=await e.fetch(pa,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":Ct(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!s.ok){const n=new Error(String(s.status));throw n.status=s.status,n}return s.json()}function vt(e,t){const{from:s,to:n}=Kn(e,t),a=e.slice(s,n);if(!a.trim())return null;const l=e.slice(0,s)+e.slice(n),r=y("dock:css"),u=Xt(typeof r=="string"?r:"",a,l);return{html:fa(a),css:u.move,keepCss:u.keep,lead:ma(a),from:s,to:n}}function ka(e,t,{onDone:s,onError:n}={}){if(y("dock:is-locked")===!0)return;const a=y("dock:html");if(typeof a!="string"||!t)return;const l=vt(a,t);if(!l)return;const r=te(e.document,_n,{heading:f(e,"component_new"),nameLabel:f(e,"component_name"),placeholder:f(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:f(e,"cancel"),saveLabel:f(e,"component_create"),onOk:u=>{r.dismiss(),(async()=>{try{const k=await va(e,l.html),h=y("dock:html"),c=typeof h=="string"&&h===a?l:vt(h,t);if(!c)return;const i=await ga(e,{name:u,html:c.html,css:c.css,js:"",tw:k}),v=y("dock:html"),$=v.slice(0,c.from)+c.lead+i.tag+v.slice(c.to);y("dock:set-html",$),c.css.trim()&&y("dock:set-css",c.keepCss),s?.(i)}catch(k){n?.(k)}})()}})}function ya(e,t,s){const n=String(e||"");if(!t||t.kind!=="antlers")return n;const a=String(s||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?_a(n,t,a):t.tag==="else"||!a?n:n.slice(0,t.from)+`{{ ${t.tag} ${a} }}`+n.slice(t.openTo)}function Ne(e,t,s,n){return le(e,t,{kind:s,name:n})}function le(e,t,s={}){const n=String(e||"");if(!t||t.antlers!=="loop")return n;const a=t.loopKind==="collection"?"collection":"field",l=s.kind??a,r=String(s.name??t.expr??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(r))return n;const u=s.sortDir??t.sortDir??"",k=String(s.sortField??t.sortField??"").trim(),h=String(s.limit??t.limit??"").trim(),c=Wt(n,t);if(!c)return n;const i=l===a?t.params:"",v=l==="collection"?ba(r,k,u,h,i):xa(r,k,u,h,i),$=l==="collection"?"collection":r;return n.slice(0,t.from)+v+n.slice(t.openTo,c.from)+`{{ /${$} }}`+n.slice(c.to)}function ba(e,t,s,n,a){const l=Ta(a).replace(/\bsort\s*=\s*["'][^"']*["']/g,"").replace(/\blimit\s*=\s*["']?\d+["']?/g,"").replace(/\s+/g," ").trim(),r=[`collection from="${e}"`];return s==="random"?r.push('sort="random"'):t&&r.push(`sort="${t}${s==="desc"?":desc":":asc"}"`),n&&r.push(`limit="${n}"`),l&&r.push(l),`{{ ${r.join(" ")} }}`}function xa(e,t,s,n,a){const l=String(a||"").split("|").map(u=>u.trim()).filter(u=>u&&!/^from\s*=/.test(u)&&!/^sort\s*:/.test(u)&&!/^reverse$/.test(u)&&!/^shuffle$/.test(u)&&!/^limit\s*:/.test(u)),r=[e,...l];return s==="random"?r.push("shuffle"):t&&(r.push(`sort:${t}`),s==="desc"&&r.push("reverse")),n&&r.push(`limit:${n}`),`{{ ${r.join(" | ")} }}`}function Ta(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function Wt(e,t){const n=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return n?{from:t.from+n.index,to:t.from+n.index+n[0].length}:null}function _a(e,t,s){return le(e,t,{name:s})}function Sa(e,t,s){const n=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return n;const a=Wt(n,t);if(!a)return n;const r=(n.slice(0,a.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],u=s==="else"?"{{ else }}":"{{ elseif true }}";return`${n.slice(0,a.from)}${u}
${r}${n.slice(a.from)}`}const M=Xn("sve-call-values"),ue=new Set;let gt=null;const wa="__sve-html-tree-style",A=new Set;let ze="",Q=!1,Be=null,ve=!0,q="",he=0,Yt="";const Z=new Map,ce=new Set;let D="",Zt=!1,E=null,Te=null,_e=0,Ue=null,pe=[],X=null,de=null,Se=null,we=null,Xe=null,Ce=!1,W=null,U=null;function O(e){return e.getElementById(ye)}function Ca(e){Cn(e,wa,`
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
      ${ct("light")}
      --sve-ht-pick: rgba(56,88,233,.14);
      --sve-ht-pick-hover: rgba(56,88,233,.22);
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${ct("dark")}
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
  `)}function R(){const e=y("dock:html");return typeof e=="string"?e:""}function Gt(e){return!!y("dock:is-open",e)}function ae(e,{save:t=!1}={}){return tt()||y("dock:set-html",e)!==!0?!1:(t&&y("dock:save-now"),!0)}function kt(e){const t=y("dock:component-exit-state")||{};if(o.exitOpen=!!t.open,!t.open){o.onExit=null;return}o.exitName=t.name||"",o.exitLabel=f(e,"component_exit"),o.exitTitle=f(e,t.back?"component_exit_back":"component_exit_close"),o.onExit=()=>{y("dock:exit-component"),P(e)}}function Pa(e,t){const s=An(e);if(!s||t.type!==s)return"";const n=Rn(t[s]);return n&&Dn(e,n)?.section_type||""}const fe=[];let Oe=!1;function Fe(e,t){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(t,{timeout:2e3});return}e.setTimeout(t,200)}function $a(e,t){for(const s of t){const n=s.type;!n||Z.has(n)||ce.has(n)||fe.includes(n)||fe.push(n)}Ze.htmlTreePrefetchArmed&&Jt(e)}function dr(e){Ze.htmlTreePrefetchArmed=!0,Jt(e)}function Jt(e){if(Oe||!fe.length)return;Oe=!0;const t=()=>{const s=fe.shift();if(!s){Oe=!1;return}if(Z.has(s)||ce.has(s)){Fe(e,t);return}ce.add(s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(s)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{typeof n?.html=="string"&&Z.set(s,n.html)}).catch(()=>{}).finally(()=>{ce.delete(s),Fe(e,t)})};Fe(e,t)}function tt(){return!!D}function Ea(e){const t=new Map,s=Pt(e);if(!s)return t;for(const n of s.querySelectorAll("[data-sid]")){const a=n.getAttribute("data-sid");a&&!t.has(a)&&t.set(a,n.tagName.toLowerCase())}return t}function La(e,t){const s=Ge(e)||"page_sections";for(const n of It(t)||[]){const a=Mt(n.values),l=a&&typeof a=="object"?a[s]:null;if(Array.isArray(l))return!0}return!1}function Qt(e,t){const s=Ge(e)||"page_sections",n=Ea(e),a=[];for(const l of It(t)||[]){const r=Mt(l.values),u=r&&typeof r=="object"?r[s]:null;if(Array.isArray(u)){u.forEach(k=>{if(!k||typeof k!="object"||Array.isArray(k)||typeof k.type!="string")return;const h=[k._visual_id,k.id,k._id].filter(w=>typeof w=="string"&&w!=="");if(!h.length)return;const c=Pa(e,k)||k.type,i=typeof k._sve_label=="string"?k._sve_label.trim():"",v=h.map(w=>n.get(w)).find(Boolean)||"section",$=Ut(k.type)[`0:${v}`];a.push({uid:h[0],ids:h,type:k.type,tag:v,label:(typeof $=="string"&&$.trim()?$.trim():"")||i||Ke(e,c)?.display||Ve(c)||c,svg:Dt(v,"",null).svg||Wn.section,cat:Lt(v),enabled:k.enabled!==!1,static:Ke(e,c)?.static===!0||Ft.has(c)})});break}}return a}function Ha(e,t,s){if(!s.length)return"";const n=y("dock:current-type")||"",a=y("dock:current-uid"),l=!!y("dock:component-exit-state")?.open;if(a){const r=In(a,t),u=s.find(k=>k.ids.some(h=>r.includes(h)));if(u&&(l||u.type===n))return u.uid}return s.find(r=>r.type===n)?.uid||""}function Ia(e,t,s){const n=e.find(w=>w.uid===t),a=n?Z.get(n.type):"",l=y("dock:component-src");if(!n||!a||!l)return null;const r=w=>({...w,id:`ctx:${w.id}`,path:`ctx/${w.path}`,children:w.children.map(r)}),u=Ee(a).map(r),k=[],h=(w,I)=>{for(const L of w){if(L.kind==="component"&&L.src===l)return k.push(...I,L),L;const He=h(L.children,[...I,L]);if(He)return He}return null},c=h(u,[]);if(!c)return null;const i=new Set,v=new Set(k.map(w=>w.id)),$=(w,I)=>{for(const L of w)L.children.length&&(v.has(L.id)?A.has(L.path):nn(L,I))&&i.add(L.id),$(L.children,I+1)};$(u,0);for(const w of on(s))i.add(w);return A.has(c.path)&&i.add(c.id),c.children=s,{tree:u,folds:i,hostId:c.id,rootId:u.find(w=>!w.kind)?.id||"",label:n.label,svg:n.svg,cat:n.cat}}function Ma(e,t,s){const n=y("dock:component-exit-state");if(n?.open)return Ve(n.name)||n.name||"";if(s)return t.find(l=>l.uid===s)?.label||"";const a=y("dock:current-type")||"";return Ke(e,a)?.display||Ve(a)||""}function en(e,t,s,n,a){const l=s.find(u=>u.uid===n);if(!l||n===a)return;A.clear(),E=null,ve=!1,ee(),Le(),q=n,Yt=R(),D=Z.get(l.type)||"",D&&(E=Pe(Ee(D))||null),Zt=(y("dock:current-type")||"")===l.type,e.clearTimeout(he),he=e.setTimeout(()=>{q="",Q=!1,P(e)},4e3),P(e);const r=()=>Fn(l.uid,t,e,{clampToSection:!0});Mn(l.uid,t,e,r),ne({source:se,type:oe.SVE_ACTIVATE,ids:l.ids},e),e.setTimeout(()=>P(e),0)}function tn(e,t){if(!t)return!1;for(const s of e||[])if(s.id===t||tn(s.children,t))return!0;return!1}function Pe(e){for(const t of e||[]){if(!t.kind)return t.id;const s=Pe(t.children);if(s)return s}return""}function nn(e,t){return A.has(e.path)?t===0:t>0}function on(e){const t=new Set,s=(n,a)=>{for(const l of n)l.children.length&&nn(l,a)&&t.add(l.id),s(l.children,a+1)};return s(e,0),t}function P(e){const t=e.document,n=O(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;Ca(t),zn(e);const a=R();D&&D===a&&(D="");const l=D||a,r=Ee(l);pe=r;const u=y("dock:current-type")||"",k=Ut(u),h=Qt(e,t),c=La(e,t);u&&a&&!D&&Z.set(u,a),$a(e,h);const i=Ha(e,t,h);if(c&&!h.length){pe=[],o.rows=[],o.sections=[],o.pageBuilder=!0,o.emptyText=f(e,"html_tree_empty"),o.canEdit=!y("dock:is-locked"),o.look=dt(e),o.onRefresh=()=>P(e),o.onSection=null,kt(e),be(n,pt),yt(e,[]);return}o.pageBuilder=c;const v=`${u}|${i}`;let $=!1;v!==ze&&(ze=v,A.clear(),Be!==null&&l!==Be?$=!0:Q=l),($||Q!==!1&&l!==Q)&&(Q=!1,A.clear(),E=Pe(r)||null),Be=l,q&&(q===i||!h.length)&&(Zt||l!==Yt)&&(e.clearTimeout(he),q="",Q=!1,tn(r,E)||(A.clear(),E=Pe(r)||null));const w=h.some(p=>p.uid===q)?q:"",I=ve?"":w||i,L=!!(w||i),ge=!!(y("dock:component-exit-state")||{}).open,F=ge?Ia(h,I,r):null,G=F?ut(F.tree,o.query?new Set:F.folds):ut(r,o.query?new Set:on(r));!l.trim()&&!Gt(t)?o.emptyText=f(e,"html_tree_need_dock"):o.emptyText=f(e,"html_tree_empty"),o.slotText=f(e,"antlers_drop_here"),o.dataTitle=f(e,"data_vars_title"),o.pageTitle=f(e,"component_props_page"),o.renameTitle=f(e,"html_tree_rename"),o.tagTitle=f(e,"tw_tag"),o.hideTitle=f(e,"html_tree_hide"),o.showTitle=f(e,"html_tree_show"),o.duplicateTitle=f(e,"html_tree_duplicate"),o.deleteTitle=f(e,"html_tree_delete"),o.lockedTitle=f(e,"html_tree_locked"),o.searchEmpty=f(e,"html_tree_search_empty"),o.canEdit=!y("dock:is-locked"),o.look=dt(e),Hn(e),o.onQuery=()=>P(e),kt(e),o.inComponent=ge,o.onContextRow=p=>{p!==F?.hostId&&o.onExit?.()},o.onSelect=p=>{const x=G.find(T=>T.id===p);x&&Rt(e,x.path)||ot(e,p,G)},o.onTwist=p=>{const x=G.find(T=>T.id===p)?.path;x&&(A.has(x)?A.delete(x):A.add(x),P(e))},o.onTagChange=(p,x)=>{const T=o.rows.find(K=>K.id===x);T&&!tt()&&Un(e,p.currentTarget,T)},o.onRename=p=>Ra(e,p),o.onRenameCommit=()=>bt(e,!0),o.onRenameCancel=()=>bt(e,!1),o.onHide=p=>Da(e,p),o.onDuplicate=p=>Ba(e,p),o.onDelete=p=>Fa(e,p),o.onPointerDown=(p,x)=>Va(e,p,x),o.onContext=(p,x)=>qa(e,p,x),o.onInspectCommit=p=>Ya(e,p),o.onPropValue=(p,x,T)=>_t(e,p,x,T),o.onPropPage=(p,x)=>aa(e,p,T=>_t(e,x,T,!1)),o.onLoopKind=p=>Za(e,p),o.onAddBranch=p=>Ga(e,p),o.onLoopSortField=p=>{const x=$e(),T=String(p||"").trim();if(!x)return;const K=U?.id===x.id?U.dir:"",V=x.sortDir||K||"asc";U=null,Y(e,(cn,dn)=>le(cn,dn,{sortField:T,sortDir:V}))},o.onLoopSortDir=p=>{const x=$e(),T=String(p||"");if(x){if((T==="asc"||T==="desc")&&!x.sortField){U={id:x.id,dir:T},We(e,x);return}U=null,Y(e,(K,V)=>le(K,V,{sortDir:T,sortField:T==="asc"||T==="desc"?V.sortField:""}))}},o.onLoopLimit=p=>Y(e,(x,T)=>le(x,T,{limit:String(p||"").replace(/\D/g,"")})),o.onPropHost=p=>p?M.mount(p):M.unmount(),o.onInspectData=(p,x)=>{y("dock:data-menu",{anchor:p,at:G.find(T=>T.id===E)?.from,onPick:T=>x(String(T?.var||"").trim())})};const at=G.find(p=>!p.kind)?.id,rt=ge?"":Ma(e,h,I),J=I&&!ge?h.find(p=>p.uid===I):null;o.rows=G.map(p=>{const x=Dt(p.tag,p.kind,p.antlers),T=!!F&&p.id===F.rootId,K=p.id===at&&rt?rt:T?F.label:p.klass,V=p.id===at;return{...p,base:K,name:ia(K,p.path,k),current:p.id===E,letter:T?"":x.letter||"",svg:V&&J?J.svg:T?F.svg:x.svg||"",cat:T?F.cat:Lt(p.tag,p.kind,p.antlers),context:F?p.id===F.hostId?"host":p.id.startsWith("ctx:")?"dim":"":"",sectionRoot:V&&J?J.uid:"",fieldsIcon:!!(V&&J&&!J.static)}});const Ie=[];for(const p of o.rows)Ie.length=p.depth,p.guides=Ie.slice(),Ie[p.depth]=p.cat;o.sections=L?h.map(p=>{const x=!!I&&p.uid===I;return{...p,current:x,ready:x&&(!w||!!D),row:{id:`sec:${p.uid}`,section:p.uid,tag:p.tag,name:p.label,kind:"",svg:p.svg,cat:p.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:x,hidden:!p.enabled}}}):[],o.onSection=p=>en(e,t,h,p,I),o.onRefresh=()=>P(e),We(e,o.rows.find(p=>p.id===E)),be(n,pt),yt(e,r)}function yt(e,t){O(e.document)&&sn(e,t)}function sn(e,t){const s=t[0],n=!!y("dock:component-src"),a=n?"":y("dock:current-uid")||"";ne({source:se,type:oe.SVE_HTML_PICK,on:!0,uid:a,all:n,tag:s?.tag||"",klass:s?.klass||"",nodes:ho(t)},e)}function Aa(e){if(!e)return;const t=(s,n)=>{for(const a of s||[]){if(a.path===e)return!0;if(t(a.children,n+1))return n===0?A.delete(a.path):A.add(a.path),!0}return!1};t(pe,0)}function Ra(e,t){if(Ce)return;const s=o.rows.find(n=>n.id===t);!s||s.kind||(E=t,o.rows.forEach(n=>{n.current=n.id===t}),o.editingId=t,o.draft=s.name,e.setTimeout(()=>{const n=O(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function bt(e,t){const s=o.editingId;if(!s)return;const n=o.rows.find(a=>a.id===s);o.editingId=null,t&&n&&la(y("dock:current-type")||"",n.path,o.draft,n.base||n.klass),o.draft="",P(e)}function Da(e,t){nt(e,t,ao)}function Ba(e,t){nt(e,t,ro)}function an(e,t){Bn(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const s=e.document;jn({uid:t},s,e)})}function Oa(e,t,s){q===s&&(e.clearTimeout(he),q="",D=""),E=null,ve=!1,ze="";const n=Qt(e,t),a=n.find(l=>l.uid!==s)||n[0];a?en(e,t,n,a.uid,""):(D="",o.rows=[],o.sections=[],o.pageBuilder=!0,P(e)),e.setTimeout(()=>{O(e.document)&&P(e)},0)}Ht("row:removed",({uid:e,parentPath:t,doc:s,win:n})=>{t!==Ge(n)||!O(n.document)||Oa(n,s,e)});function Fa(e,t){const s=o.sections?.find(a=>a.row?.id===t),n=s?s.row?.section||s.uid:o.rows.find(a=>a.id===t)?.sectionRoot;if(n){an(e,n);return}nt(e,t,io)}function nt(e,t,s){if(y("dock:is-locked"))return;const n=R(),a=o.rows.find(r=>r.id===t);if(!a)return;const l=s(n,a);l!==n&&ae(l)}function ee(){W?.dismiss(),W=null}function ja(e,t,s){const n=s.row?.section||s.uid;n&&(W=te(e.document,Je,{items:[{label:f(e,"html_tree_remove_section"),danger:!0,onPick:()=>{ee(),an(e,n)}}],x:t.clientX,y:t.clientY,onClose:()=>{W=null}}))}function qa(e,t,s){ee();const n=o.sections?.find(u=>u.row?.id===s);if(n){ja(e,t,n);return}const a=o.rows.find(u=>u.id===s);if(!a)return;ot(e,s,o.rows);const l={x:t.clientX,y:t.clientY},r=u=>{u.length&&(W?.dismiss(),W=te(e.document,Je,{items:u,x:l.x,y:l.y,onClose:()=>{W=null}}))};if(a.kind==="component"){Ka(e,a,r);return}o.canEdit&&r([{label:f(e,"component_make"),onPick:()=>{ee(),ka(e,a,{onDone:()=>P(e),onError:u=>{e.alert(u?.status===409?f(e,"component_exists"):f(e,"component_failed"))}})}}])}const xt=(e,t)=>{ee(),y("dock:open-template",t)};function Ka(e,t,s){if(!Zn(t.src)){s([{label:f(e,"component_open_named",{name:t.name||t.src}),onPick:()=>xt(e,`view:partials/${t.src}`)}]);return}s([{label:f(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const a=Array.isArray(n.items)?n.items:[];s(a.length?a.map(l=>({label:f(e,"component_open_named",{name:l.label}),onPick:()=>xt(e,l.type)})):[{label:f(e,"component_none"),onPick:null}])}).catch(()=>s([{label:f(e,"component_none"),onPick:null}]))}function Va(e,t,s){if(t.button!==0||y("dock:is-locked")||o.editingId||t.target?.closest?.("button, input"))return;Le(),X=s,de={x:t.clientX,y:t.clientY},Se=t.currentTarget,we=t.pointerId;const n=l=>Na(e,l),a=l=>za(e,l);Xe=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),Xe=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function Na(e,t){if(!X||!de)return;const s=t.clientX-de.x,n=t.clientY-de.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{Se?.setPointerCapture?.(we)}catch{}}t.preventDefault();const a=e.document.elementFromPoint(t.clientX,t.clientY),l=a?.closest?.("[data-sve-ht-slot]");if(l){const i=l.getAttribute("data-sve-ht-id");if(i&&i!==X){o.dropId=i,o.dropPlace="inside";return}}const r=a?.closest?.("[data-sve-ht-row]"),u=r?.getAttribute("data-sve-ht-id");if(!u||u===X){o.dropId=null,o.dropPlace=null;return}const k=o.rows.find(i=>i.id===u),h=o.rows.find(i=>i.id===X);if(!k||k.context||h&&k.path.startsWith(`${h.path}/`)){o.dropId=null,o.dropPlace=null;return}const c=r.getBoundingClientRect();o.dropId=u,o.dropPlace=oo(t.clientY-c.top,c.height,!Bt(k.tag)&&k.kind!=="component")}function za(e,t){const s=X,n=o.dropId,a=o.dropPlace||"after",l=o.dragging;if(Le(),l&&(Ce=!0,e.setTimeout(()=>{Ce=!1},0)),!l||y("dock:is-locked")||!s||!n||s===n)return;t?.preventDefault?.();const r=R(),u=so(r,pe,s,n,a);u!==r&&ae(u)}function Le(){try{Se?.releasePointerCapture?.(we)}catch{}Xe?.(),X=null,de=null,Se=null,we=null,o.dragging=!1,o.dropId=null,o.dropPlace=null}function rn(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function We(e,t){if(t?.kind==="component"){Ua(e,t);return}if(B.callOpen&&(B.callOpen=!1,B.callStore=null,M.forget(),Qe(e)),t?.kind!=="antlers"){o.inspect=null;return}const s=t.id;if(t.tag==="else"){o.inspect={key:s,title:f(e,"antlers_condition"),mode:"note",note:f(e,"antlers_else_note")};return}if(t.antlers==="loop"){const n=t.loopKind==="collection",a=U?.id===t.id?U.dir:"",l=t.sortDir||a;o.inspect={key:s,title:f(e,"antlers_loop"),mode:"loop",loopKind:n?"collection":"field",kinds:[{id:"field",label:f(e,"antlers_loop_field")},{id:"collection",label:f(e,"antlers_loop_collection")}],collections:rn(e),value:t.expr||"",placeholder:f(e,n?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:f(e,"antlers_sort"),dir:l,needsField:l==="asc"||l==="desc",field:t.sortField||"",pickable:!n,placeholder:f(e,n?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:f(e,"antlers_sort_none")},{id:"asc",label:f(e,"antlers_sort_asc")},{id:"desc",label:f(e,"antlers_sort_desc")},{id:"random",label:f(e,"antlers_sort_random")}]},limit:{title:f(e,"antlers_limit"),value:t.limit||"",placeholder:f(e,"antlers_limit_placeholder")},branches:[]};return}o.inspect={key:s,title:f(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:f(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:f(e,"antlers_add_elseif")},{id:"else",label:f(e,"antlers_add_else")}]}}function Ua(e,t){if(!Gn(e)){o.inspect=null;return}if(!t.src)return;const s=t.id;if(o.inspect={key:s,title:f(e,"component_props_values"),mode:"note",note:f(e,"code_dock_loading")},Jn()){const n={},a={},l=new Map;for(const[r,u]of Qn(R().slice(t.from,t.to))){const k=eo(r);k&&(r!==k||!l.has(k))&&l.set(k,u)}for(const[r,u]of l)u.bound?a[r]=u.value:n[r]=u.value;gt!==s&&(gt=s,ue.clear());for(const r of ue)r in a||(a[r]="");o.inspect=null,B.callOpen=!0,B.title=B.title||f(e,"component_props"),B.callTitle=t.klass||t.name||t.src,B.callStore=M.ui,M.ui.canBind=!0,M.ui.dataTitle=f(e,"data_vars_title"),M.ui.exprPlaceholder=f(e,"component_props_expr"),M.ui.onToggleBind=(r,u)=>Wa(e,r,u),M.ui.onExpr=(r,u)=>Tt(e,r,u),M.ui.onPickData=(r,u)=>y("dock:data-menu",{anchor:u,at:t.from,onPick:k=>Tt(e,r,String(k?.var||"").trim())}),M.load(e,{key:`${t.src}::${s}`,src:t.src,params:n,bindings:a,readOnly:y("dock:is-locked")===!0}),M.watch(e,{src:t.src,write:r=>Xa(e,r,a)}),Qe(e);return}to(e,t.src).then(n=>{if(o.inspect?.key===s){if(!n.length){o.inspect={key:s,title:f(e,"component_props_values"),mode:"note",note:f(e,"component_props_values_none")};return}o.inspect={key:s,title:f(e,"component_props_values"),mode:"props",inheritLabel:f(e,"component_props_inherit"),rows:no(n,R().slice(t.from,t.to))}}})}function Xa(e,t,s={}){const n=o.rows.find(r=>r.id===E);if(n?.kind!=="component"||y("dock:is-locked"))return;let a=R(),l=n.to;for(const[r,u]of Object.entries(t||{})){if(r in s)continue;const k=a.length,h=et(a,{from:n.from,to:l},r,u);h!==a&&(l+=h.length-k,a=h)}a!==R()&&(ae(a,{save:!0}),P(e))}function Wa(e,t,s){s?ue.add(t):ue.delete(t),ln(e,t,"",s),P(e)}function Tt(e,t,s){ue.add(t),ln(e,t,s,!0),P(e)}function ln(e,t,s,n){const a=o.rows.find(u=>u.id===E);if(a?.kind!=="component"||y("dock:is-locked"))return;const l=R(),r=et(l,a,t,s,{bound:n});r!==l&&ae(r,{save:!0})}function $e(){const e=o.rows.find(t=>t.id===E);return e?.kind==="antlers"&&!y("dock:is-locked")?e:null}function Y(e,t){const s=$e();if(!s)return;const n=R(),a=t(n,s);a!==n&&(ae(a),P(e))}function _t(e,t,s,n){const a=o.rows.find(u=>u.id===E);if(a?.kind!=="component"||y("dock:is-locked"))return;const l=R(),r=et(l,a,t,s,{bound:n});r!==l&&(ae(r,{save:!0}),P(e))}function Ya(e,t){Y(e,(s,n)=>n.antlers==="loop"?Ne(s,n,n.loopKind==="collection"?"collection":"field",t):ya(s,n,t))}function Za(e,t){const s=$e();if(!s||s.antlers!=="loop")return;const n=s.loopKind==="collection"?"collection":"field";if(t!==n){if(t==="collection"){const a=rn(e)[0]?.handle;if(!a)return;Y(e,(l,r)=>Ne(l,r,"collection",a));return}Y(e,(a,l)=>Ne(a,l,"field",l.handle||"items"))}}function Ga(e,t){Y(e,(s,n)=>Sa(s,n,t))}function Ja(e,t){if(!e||!t||t.kind==="component"||Bt(t.tag))return null;const s=Yn(e,t);if(s<t.openTo)return null;const n=e.lastIndexOf(`
`,s-1)+1;return e.slice(n,s).trim()===""&&n>t.openTo?n-1:s}function ot(e,t,s){if(Ce)return;const n=(s||o.rows).find(a=>a.id===t);n&&(E=t,o.rows.forEach(a=>{a.current=a.id===t}),We(e,n),!tt()&&(y("dock:reveal-html",{from:n.from,to:n.to,caret:Ja(R(),n)}),y("dock:tw-follow"),ne({source:se,type:oe.SVE_HTML_PICK_FOCUS,path:n.path},e)))}function Qa(e,t){if(!t)return"";const s=[],n=(a,l)=>{for(const r of a||[]){const u=l||r.path===e;r.kind==="component"&&r.src===t&&s.push({path:r.path,inside:u}),n(r.children,u)}};return n(pe,!1),(s.find(a=>a.inside)||s[0])?.path||""}function er(e,t){if(!t||!O(e.document))return;ve=!1,Aa(t),P(e);const s=o.rows.find(n=>n.path===t);s&&(ot(e,s.id,o.rows),e.setTimeout(()=>{O(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function Ye(e){if(Te)return;const t=()=>{o.editingId||o.dragging||(e.clearTimeout(_e),_e=e.setTimeout(()=>{O(e.document)&&P(e)},80))},s=()=>t();Te=Ht("dock:html-changed",t),e.document.addEventListener("sve-page-structure",s),Ue=()=>{e.document.removeEventListener("sve-page-structure",s)}}function tr(e){Te?.(),Te=null,Ue?.(),Ue=null,e?.clearTimeout?.(_e),_e=0}function st(e){const t=O(e.document);if(ne({source:se,type:oe.SVE_HTML_PICK,on:!1},e),tr(e),M.forget(),B.callOpen=!1,B.callStore=null,Qe(e),Le(),ee(),Nn(e),E=null,o.inspect=null,o.editingId=null,o.draft="",o.sections=[],o.pageBuilder=!1,q="",e?.clearTimeout?.(he),!t){qe(e);return}t.remove(),Ze.headerTab==="html_tree"&&On(e,null),wn(e),$t(e),Et(e),qe(e)}function ur(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=ye,be(t,jt,{title:f(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>st(e)))}function hr(e){Ye(e),P(e)}function nr(e){const t=e.document;if(!Pn(e,"html_tree"))return;if(O(t)){Ye(e),P(e);return}if(!Gt(t))return;ve=!0,A.clear(),$n(e,[ye]);const s=t.createElement("div");s.id=ye,s.style.cssText=En,be(s,jt,{title:f(e,"html_tree")}),s.querySelector("[data-sve-close]")?.addEventListener("click",()=>st(e)),Ln(e,s),$t(e),Et(e),qe(e),Ye(e),P(e)}function pr(e){if(O(e.document)){st(e);return}nr(e)}At("html-tree:from-preview",({path:e,src:t}={})=>{Rt(window,e)||er(window,Qa(e,t)||e)});At("html-tree:arm-pick",e=>{const t=window;return e?(sn(t,Ee(R())),!0):(O(t.document)||ne({source:se,type:oe.SVE_HTML_PICK,on:!1},t),!0)});function fr(){Z.clear(),ce.clear(),fe.length=0}export{wa as HTML_TREE_STYLE_ID,dr as armHtmlTreePrefetch,fr as clearHtmlTreeTemplates,ee as closeHtmlTreeMenu,st as closeHtmlTreePanel,Ca as ensureHtmlTreeStyles,ur as fillHtmlTreePane,E as htmlTreeActiveId,O as htmlTreePanel,_e as htmlTreeTimer,Te as htmlTreeUnhook,nr as openHtmlTreePanel,P as renderHtmlTree,hr as showHtmlTreePane,tr as stopWatchHtmlTreeDock,pr as toggleHtmlTreePanel,Ye as watchHtmlTreeDock};
