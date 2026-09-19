const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-D8Xdoe3O.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{_ as J,k as A,ap as dn,b4 as o,u as h,o as m,a as v,b as _,t as S,F as I,d as B,f as xt,g as C,e as St,s as k,q as N,l as wt,p as Ct,w as Oe,b5 as un,v as $t,h as f,j as Q,y as T,i as Pt,b6 as Be,b7 as st,b8 as hn,b9 as pn,ba as Lt,bb as Et,z as ee,x as fn,bc as ye,bd as mn,be as vn,n as gn,bf as yn,Q as kn,J as ke,bg as at,a3 as Ee,M as bn,K as Xe,bh as _n,bi as Tn,B as re,c as ae,N as xn,G as Sn,aJ as Ye,aq as je,aV as wn,am as Cn,aT as Ht,aU as It,af as $n,ag as rt,S as be,V as _e,O as Pn,aS as Ln,an as En,ao as Hn,bj as it,bk as In,U as Mt,A as At,ax as Rt,ay as qe,I as Mn,bl as An,aX as Rn,aY as Dn,aw as Fn,bm as On,ae as Dt,aP as Bn,aF as jn}from"./addon-BympSFHY.js";import{M as te,S as ne}from"./protocol-D3FYhCm9.js";import{D as F,E as qn,F as Ze,G as Kn,t as Vn,I as Ge,v as Nn,z as zn,b as Je,l as Un,J as Ft,q as Wn,K as Ot,L as Xn,H as Yn,M as Qe,N as Bt,O as Zn,h as Gn,c as Jn,Q as Qn,R as eo,S as to,T as no,U as oo,V as so,W as ao,X as ro,Y as io,Z as lo}from"./tw-classes-DOw9lvU-.js";import{a as co}from"./html-pick-align-CK-9iH9_.js";import"./ai-text-icon-B7uCWIwa.js";const uo={key:0,class:"sve-ht-inspect"},ho={class:"sve-ht-inspect__head"},po={key:0,class:"sve-ht-inspect__note"},fo={key:2,class:"sve-ht-inspect__props"},mo={class:"sve-ht-inspect__proplabel"},vo={key:0},go=["value","disabled","onChange"],yo={value:""},ko=["value"],bo=["value"],_o=["value","placeholder","onChange"],To=["title","disabled","onClick"],xo=["title","disabled","onClick"],So={key:0,class:"sve-ht-inspect__seg"},wo=["data-active","disabled","onClick"],Co=["value","disabled"],$o={key:0,value:""},Po=["value"],Lo={key:2,class:"sve-ht-inspect__box"},Eo=["value","placeholder","disabled","onKeydown"],Ho=["title","disabled"],Io={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Mo=["value","disabled"],Ao=["value"],Ro={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},Do=["value","placeholder","disabled"],Fo=["title","disabled"],Oo={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Bo=["value","placeholder","disabled"],jo={key:4,class:"sve-ht-inspect__add"},qo=["disabled","onClick"],Ie='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',Ko='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',Vo={__name:"HtmlTreeInspector",setup(e){const t=A(null);dn(t,u=>o.onPropHost?.(u||null));const s=A(null),n=A(null);function a(u){o.onInspectCommit?.(u.target.value)}function l(u,i,c){!u||!i||(u.value=i,u.focus(),u.setSelectionRange(i.length,i.length),c(i))}function r(u,i){o.onInspectData?.(u.currentTarget,c=>o.onPropValue?.(i.handle,c,!0))}function d(u){o.onInspectData?.(u.currentTarget,i=>l(s.value,i,c=>o.onInspectCommit?.(c)))}function g(u){o.onInspectData?.(u.currentTarget,i=>l(n.value,i,c=>o.onLoopSortField?.(c)))}return(u,i)=>h(o).inspect?(m(),v("div",uo,[_("div",ho,S(h(o).inspect.title),1),h(o).inspect.mode==="note"?(m(),v("div",po,S(h(o).inspect.note),1)):h(o).inspect.mode==="statamic"?(m(),v("div",{key:1,ref_key:"propHost",ref:t,class:"sve-ht-inspect__form"},null,512)):h(o).inspect.mode==="props"?(m(),v("div",fo,[(m(!0),v(I,null,B(h(o).inspect.rows,c=>(m(),v("label",{key:c.handle,class:"sve-ht-inspect__prop"},[_("span",mo,[xt(S(c.label)+" ",1),c.bound?(m(),v("em",vo,":")):C("",!0)]),_("span",{class:St(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":c.type==="select"||c.type==="link"}])},[c.type==="select"&&!c.bound?(m(),v("select",{key:0,value:c.value,disabled:!h(o).canEdit,onChange:b=>h(o).onPropValue?.(c.handle,b.target.value,!1)},[_("option",yo,S(c.placeholder||h(o).inspect.inheritLabel),1),c.value&&!c.options.includes(c.value)?(m(),v("option",{key:0,value:c.value},S(c.value),9,ko)):C("",!0),(m(!0),v(I,null,B(c.options,b=>(m(),v("option",{key:b,value:b},S(b),9,bo))),128))],40,go)):(m(),v("input",{key:1,type:"text",value:c.value,placeholder:c.placeholder||h(o).inspect.inheritLabel,onChange:b=>h(o).onPropValue?.(c.handle,b.target.value,c.bound)},null,40,_o)),c.type==="link"?(m(),v("button",{key:2,type:"button","data-sve-ht-data":"",title:h(o).pageTitle,disabled:!h(o).canEdit,onClick:b=>h(o).onPropPage?.(b.currentTarget,c.handle),innerHTML:Ko},null,8,To)):C("",!0),_("button",{type:"button","data-sve-ht-data":"",title:h(o).dataTitle,disabled:!h(o).canEdit,onClick:b=>r(b,c),innerHTML:Ie},null,8,xo)],2)]))),128))])):(m(),v(I,{key:3},[h(o).inspect.mode==="loop"?(m(),v("div",So,[(m(!0),v(I,null,B(h(o).inspect.kinds,c=>(m(),v("button",{key:c.id,type:"button","data-active":c.id===h(o).inspect.loopKind?"":void 0,disabled:!h(o).canEdit,onClick:b=>h(o).onLoopKind?.(c.id)},S(c.label),9,wo))),128))])):C("",!0),h(o).inspect.mode==="loop"&&h(o).inspect.loopKind==="collection"?(m(),v("select",{key:h(o).inspect.key+":"+h(o).inspect.value,value:h(o).inspect.value,disabled:!h(o).canEdit,onChange:a},[h(o).inspect.value?C("",!0):(m(),v("option",$o,S(h(o).inspect.placeholder),1)),(m(!0),v(I,null,B(h(o).inspect.collections,c=>(m(),v("option",{key:c.handle,value:c.handle},S(c.title),9,Po))),128))],40,Co)):(m(),v("div",Lo,[(m(),v("input",{ref_key:"field",ref:s,key:h(o).inspect.key,type:"text",value:h(o).inspect.value,placeholder:h(o).inspect.placeholder,disabled:!h(o).canEdit,spellcheck:"false",onKeydown:[i[0]||(i[0]=k(()=>{},["stop"])),N(k(a,["prevent"]),["enter"])],onBlur:a},null,40,Eo)),_("button",{type:"button","data-sve-ht-data":"",title:h(o).dataTitle,disabled:!h(o).canEdit,innerHTML:Ie,onMousedown:i[1]||(i[1]=k(()=>{},["prevent"])),onClick:k(d,["stop","prevent"])},null,40,Ho)])),h(o).inspect.sort?(m(),v(I,{key:3},[_("div",Io,S(h(o).inspect.sort.title),1),(m(),v("select",{key:h(o).inspect.key+":dir:"+h(o).inspect.sort.dir,value:h(o).inspect.sort.dir,disabled:!h(o).canEdit,onChange:i[2]||(i[2]=c=>h(o).onLoopSortDir?.(c.target.value))},[(m(!0),v(I,null,B(h(o).inspect.sort.dirs,c=>(m(),v("option",{key:c.id,value:c.id},S(c.label),9,Ao))),128))],40,Mo)),h(o).inspect.sort.needsField?(m(),v("div",Ro,[(m(),v("input",{ref_key:"sortField",ref:n,key:h(o).inspect.key+":field",type:"text",value:h(o).inspect.sort.field,placeholder:h(o).inspect.sort.placeholder,disabled:!h(o).canEdit,spellcheck:"false",onKeydown:[i[3]||(i[3]=k(()=>{},["stop"])),i[4]||(i[4]=N(k(c=>h(o).onLoopSortField?.(c.target.value),["prevent"]),["enter"]))],onBlur:i[5]||(i[5]=c=>h(o).onLoopSortField?.(c.target.value))},null,40,Do)),h(o).inspect.sort.pickable?(m(),v("button",{key:0,type:"button","data-sve-ht-data":"",title:h(o).dataTitle,disabled:!h(o).canEdit,innerHTML:Ie,onMousedown:i[6]||(i[6]=k(()=>{},["prevent"])),onClick:k(g,["stop","prevent"])},null,40,Fo)):C("",!0)])):C("",!0),_("div",Oo,S(h(o).inspect.limit.title),1),(m(),v("input",{key:h(o).inspect.key+":limit",type:"number",min:"1",value:h(o).inspect.limit.value,placeholder:h(o).inspect.limit.placeholder,disabled:!h(o).canEdit,onKeydown:[i[7]||(i[7]=k(()=>{},["stop"])),i[8]||(i[8]=N(k(c=>h(o).onLoopLimit?.(c.target.value),["prevent"]),["enter"]))],onBlur:i[9]||(i[9]=c=>h(o).onLoopLimit?.(c.target.value))},null,40,Bo))],64)):C("",!0),h(o).inspect.branches?.length?(m(),v("div",jo,[(m(!0),v(I,null,B(h(o).inspect.branches,c=>(m(),v("button",{key:c.id,type:"button",disabled:!h(o).canEdit,onClick:b=>h(o).onAddBranch?.(c.id)},S(c.label),9,qo))),128))])):C("",!0)],64))])):C("",!0)}},No=J(Vo,[["__scopeId","data-v-26254b75"]]),zo={class:"sve-dialog__title"},Uo={for:"sve-new-section-group"},Wo=["value"],Xo={for:"sve-new-section-name"},Yo=["placeholder"],Zo={key:0,class:"sve-dialog__note"},Go={class:"sve-dialog__actions"},Jo=["disabled"],Qo=["disabled"],es={__name:"NewSectionPrompt",props:{heading:{type:String,required:!0},groupLabel:{type:String,required:!0},nameLabel:{type:String,required:!0},placeholder:{type:String,default:""},note:{type:String,default:""},groups:{type:Array,required:!0},cancelLabel:{type:String,required:!0},saveLabel:{type:String,required:!0},onOk:{type:Function,required:!0},onClose:{type:Function,required:!0}},setup(e){const t=e,s=A(""),n=A(t.groups[0]?.key??""),a=A(null),l=A(!1);wt(()=>Ct(()=>a.value?.focus()));function r(){const u=s.value.trim();if(!u||!n.value||l.value){a.value?.focus();return}l.value=!0,t.onOk(u,n.value)}function d(u){u.target===u.currentTarget&&t.onClose()}function g(u){u.key==="Enter"?r():u.key==="Escape"&&t.onClose()}return(u,i)=>(m(),v("div",{class:"sve-dialog-overlay",onClick:d},[_("div",{class:"sve-dialog",onClick:i[3]||(i[3]=k(()=>{},["stop"]))},[_("div",zo,S(e.heading),1),_("label",Uo,S(e.groupLabel),1),Oe(_("select",{id:"sve-new-section-group","onUpdate:modelValue":i[0]||(i[0]=c=>n.value=c),onKeydown:g},[(m(!0),v(I,null,B(e.groups,c=>(m(),v("option",{key:c.key,value:c.key},S(c.display),9,Wo))),128))],544),[[un,n.value]]),_("label",Xo,S(e.nameLabel),1),Oe(_("input",{id:"sve-new-section-name",ref_key:"input",ref:a,"onUpdate:modelValue":i[1]||(i[1]=c=>s.value=c),type:"text",placeholder:e.placeholder,onKeydown:g},null,40,Yo),[[$t,s.value]]),e.note?(m(),v("p",Zo,S(e.note),1)):C("",!0),_("div",Go,[_("button",{type:"button",class:"is-cancel",disabled:l.value,onClick:i[2]||(i[2]=(...c)=>e.onClose&&e.onClose(...c))},S(e.cancelLabel),9,Jo),_("button",{type:"button",class:"is-primary",disabled:l.value,onClick:r},S(e.saveLabel),9,Qo)])])]))}},ts=J(es,[["__scopeId","data-v-d21be545"]]),jt="/!/sve/section-types";async function ns(e){const t=await e.fetch(jt,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!t.ok)throw new Error(`section-types ${t.status}`);const s=await t.json(),n=new Map;for(const a of s.types||[])a?.group&&!n.has(a.group)&&n.set(a.group,a.group_display||a.group);return[...n].map(([a,l])=>({key:a,display:l}))}async function os(e,{display:t,group:s}){const n=await e.fetch(jt,{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Pt(e),Accept:"application/json"},credentials:"same-origin",body:JSON.stringify({display:t,group:s})}),a=await n.json().catch(()=>({}));if(!n.ok){const l=new Error(a.error||`section-types ${n.status}`);throw l.reason=a.error,l}return a}async function ss(e,t,s=null){if(!t||typeof Be!="function"||typeof st!="function")return null;const n=await Be(e,t);if(!n)return null;const a=hn(),l=pn(e,"page",{handle:t},n?.defaults,a),r=Lt(l,n?.new||{},n?.defaults);return st(e,e.document,s,l,r)?l:null}const lt=700,as=17;function rs(e,t){const s=(t||[]).filter(Boolean);if(!s.length)return;let n=0;const a=()=>{n+=1;const l=Et(e),r=l?s.some(d=>l.querySelector(`[data-sid="${CSS.escape(d)}"]`)):!0;r&&ee({source:ne,type:te.SVE_ACTIVATE,ids:s},e),(r?!l&&n<6:n<as)&&e.setTimeout(a,lt)};e.setTimeout(a,lt)}function is(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function ls(e,{afterUid:t=null,onDone:s,onError:n,onClose:a}={}){(async()=>{let l=[];try{l=await ns(e)}catch(d){n?.(d),e.Statamic?.$toast?.error(f(e,"section_new_failed"));return}if(!l.length){n?.(new Error("no groups")),e.Statamic?.$toast?.error(f(e,"section_new_failed"));return}const r=Q(e.document,ts,{heading:f(e,"section_new"),groupLabel:f(e,"section_new_group"),nameLabel:f(e,"section_new_name"),placeholder:f(e,"section_new_placeholder"),note:f(e,"section_new_note"),groups:l,cancelLabel:f(e,"cancel"),saveLabel:f(e,"section_new_create"),onClose:a,onOk:(d,g)=>{(async()=>{try{const u=await os(e,{display:d,group:g});r.dismiss(),e.Statamic?.$toast?.success(f(e,"section_created",{name:u.section?.display||d})),e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"));const i=await ss(e,u.section?.handle,t);!i&&u.section?.handle&&T("dock:open-template",u.section.handle),s?.({...u,uid:i?._visual_id||""})}catch(u){r.dismiss(),e.Statamic?.$toast?.error(f(e,u.reason==="bad_name"?"section_new_bad_name":"section_new_failed")),n?.(u)}})()}})})()}const cs={class:"sve-html-tree"},ds={class:"sve-pane-bar","data-sve-pane-bar":""},us={"data-sve-right-title":""},hs={class:"sve-ht-tools"},ps=["title"],fs=["placeholder","aria-label","value"],ms=["aria-label"],vs=["title","aria-label"],gs={key:1,class:"sve-tree-exit"},ys=["title"],ks=["title"],bs='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',_s='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',Ts='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',xs={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const t=f(window,"html_tree_search"),s=is(window),n=f(window,"section_new"),a=A(!1);function l(){a.value=!1}async function r(u){if(u)for(let i=0;i<20;i+=1){await Ct(),o.onRefresh?.();const c=o.sections.find(b=>b.uid===u);if(c){o.onSection?.(u),rs(window,c.ids);return}await new Promise(b=>setTimeout(b,50))}}function d(){a.value||(a.value=!0,ls(window,{afterUid:o.sections.length?o.sections[o.sections.length-1].uid:null,onDone:u=>{l(),r(u?.uid)},onError:l,onClose:l}))}function g(u){const i=!!o.query;o.query=u,i!==!!u&&o.onQuery?.()}return(u,i)=>(m(),v("div",cs,[_("div",ds,[_("div",us,S(e.title),1),i[5]||(i[5]=fn('<div data-sve-right-actions data-v-fb9a0208><button type="button" data-sve-right-pin aria-pressed="false" data-v-fb9a0208></button><button type="button" data-sve-close aria-label="Close" data-v-fb9a0208><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-fb9a0208><path d="M18 6 6 18" data-v-fb9a0208></path><path d="m6 6 12 12" data-v-fb9a0208></path></svg></button></div>',1))]),_("div",hs,[_("label",{class:"sve-ht-search",title:h(t)},[_("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:_s}),_("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:h(t),"aria-label":h(t),value:h(o).query,autocomplete:"off",spellcheck:"false",onInput:i[0]||(i[0]=c=>g(c.target.value)),onKeydown:[i[1]||(i[1]=k(()=>{},["stop"])),i[2]||(i[2]=N(k(c=>g(""),["prevent"]),["escape"]))]},null,40,fs),h(o).query?(m(),v("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":h(t),innerHTML:Ts,onClick:i[3]||(i[3]=c=>g(""))},null,8,ms)):C("",!0)],8,ps),h(s)&&(h(o).sections.length||h(o).pageBuilder)?(m(),v("button",{key:0,type:"button",class:"sve-ht-new",title:h(n),"aria-label":h(n),innerHTML:bs,onClick:d},null,8,vs)):C("",!0)]),h(F).inSidebar?C("",!0):(m(),ye(qn,{key:0})),i[6]||(i[6]=_("div",{"data-sve-html-tree-list":""},null,-1)),mn(No),h(o).exitOpen&&!h(F).inSidebar?(m(),v("div",gs,[_("span",{class:"sve-tree-exit__name",title:h(o).exitName},S(h(o).exitName),9,ys),_("button",{type:"button",class:"sve-tree-exit__go",title:h(o).exitTitle,onClick:i[4]||(i[4]=c=>h(o).onExit?.())},S(h(o).exitLabel),9,ks)])):C("",!0)]))}},qt=J(xs,[["__scopeId","data-v-fb9a0208"]]);function Kt(e){return String(e||"").trim().toLowerCase()}function Vt(e,t){return t?[e.name,e.tag,e.klass,e.label,e.src].filter(s=>typeof s=="string"&&s).join(" ").toLowerCase().includes(t):!0}function Ss(e,t){const s=Kt(t);if(!s)return{rows:e,hits:new Set};const n=new Set;for(const r of e)Vt(r,s)&&n.add(r.path);const a=[...n];return{rows:e.filter(r=>n.has(r.path)||a.some(d=>d.startsWith(`${r.path}/`))),hits:n}}const ws={class:"sve-fs__bar"},Cs={class:"sve-fs__title"},$s={key:0,class:"sve-fs__sub"},Ps=["aria-label","title"],Ls={class:"sve-fs__body"},Es={key:0,class:"sve-fs__loading"},Hs=["src","title"],ct="sve-fieldset-drawer-width",dt=380,Is={__name:"FieldsetOverlay",props:{heading:{type:String,required:!0},subtitle:{type:String,default:""},src:{type:String,required:!0},closeLabel:{type:String,required:!0},onClose:{type:Function,required:!0},onSaved:{type:Function,default:null}},setup(e){const t=e,s=A(!0),n=A(null),a=A(!1);function l(){return Math.max(dt,window.innerWidth-220)}function r(y){return Math.min(Math.max(Math.round(y),dt),l())}function d(){try{const y=Number(window.localStorage.getItem(ct));if(y>0)return r(y)}catch{}return r(Math.min(992,window.innerWidth*.55))}const g=A(d()),u=A(!1);function i(y){g.value=r(window.innerWidth-y.clientX)}function c(y){u.value=!1,y.target?.releasePointerCapture?.(y.pointerId),window.removeEventListener("pointermove",i),window.removeEventListener("pointerup",c);try{window.localStorage.setItem(ct,String(g.value))}catch{}}function b(y){y.preventDefault(),u.value=!0,y.target?.setPointerCapture?.(y.pointerId),window.addEventListener("pointermove",i),window.addEventListener("pointerup",c)}function P(){s.value=!1;try{const y=n.value?.contentDocument;if(!y||y.getElementById("sve-fs-trim"))return;const L=y.createElement("style");L.id="sve-fs-trim",L.textContent=`
      nav.nav-main { display: none !important; }
      header:has(+ main) { display: none !important; }
      main { top: 0 !important; min-height: 100vh !important; }
      /* Our own AI launcher rides along on every Control Panel page. In a panel
         about fields it is one floating button too many, and it covers the
         Save. */
      #__sve-ai-launcher { display: none !important; }
    `,y.head.appendChild(L)}catch{}}function H(y){const L=String(y?.config?.method||"").toUpperCase(),p=String(y?.config?.url||""),x=Number(y?.status||0);return(L==="PATCH"||L==="PUT")&&x>=200&&x<300&&/\/fields\/fieldsets\//.test(p)&&!/\/edit(?:\?|$)/.test(p)}function me(y){const L=y?.Statamic?.$axios||y?.axios;return!L?.interceptors?.response||y.__sveFsSaveWatch?!!y?.__sveFsSaveWatch:(y.__sveFsSaveWatch=!0,L.interceptors.response.use(p=>(H(p)&&t.onSaved?.(),p)),!0)}function K(){P();const y=n.value?.contentWindow;me(y)||y?.setTimeout?.(()=>me(y),0)}function se(y){y.key==="Escape"&&t.onClose()}wt(()=>{document.addEventListener("keydown",se),requestAnimationFrame(()=>{a.value=!0})}),vn(()=>document.removeEventListener("keydown",se));function ve(y){y.target===y.currentTarget&&t.onClose()}return(y,L)=>(m(),v("div",{class:"sve-fs-overlay",onClick:ve},[_("div",{class:St(["sve-fs",{"is-shown":a.value,"is-dragging":u.value}]),style:gn({width:g.value+"px","--sve-fs-grip":h(yn)}),onClick:L[1]||(L[1]=k(()=>{},["stop"]))},[_("div",{class:"sve-fs__grip",role:"separator","aria-orientation":"vertical",onPointerdown:b},null,32),_("div",ws,[_("div",Cs,[xt(S(e.heading)+" ",1),e.subtitle?(m(),v("span",$s,S(e.subtitle),1)):C("",!0)]),_("button",{type:"button","aria-label":e.closeLabel,title:e.closeLabel,onClick:L[0]||(L[0]=(...p)=>e.onClose&&e.onClose(...p))},[...L[2]||(L[2]=[_("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round"},[_("path",{d:"M18 6 6 18"}),_("path",{d:"m6 6 12 12"})],-1)])],8,Ps)]),_("div",Ls,[s.value?(m(),v("div",Es,"…")):C("",!0),_("iframe",{ref_key:"frame",ref:n,src:e.src,title:e.heading,onLoad:K},null,40,Hs)])],6)]))}},Ms=J(Is,[["__scopeId","data-v-9b80a022"]]),As="/!/sve/section-types";function Rs(e){return String(e.Statamic?.$config?.get?.("cpRoot")||"/cp").replace(/\/+$/,"")}function Ds(){const e=T("dock:current-type");return typeof e!="string"||!e||e.startsWith("view:")?null:e}async function Fs(e,t){const s=await e.fetch(As,{headers:{Accept:"application/json"},credentials:"same-origin"});if(!s.ok)throw new Error(`section-types ${s.status}`);const a=((await s.json()).types||[]).find(l=>l?.handle===t);return a?{fieldset:a.fieldset||null,display:a.display||t}:null}function Os(e,t){const s=String(e);let n=s;try{n=decodeURIComponent(s)}catch{}return n===t||n.includes(`set=${t}`)||n.endsWith(`::${t}`)||n.includes(`::${t}::`)}function Bs(e,t){if(e){if(typeof e.keys=="function"&&typeof e.delete=="function"){for(const s of[...e.keys()])Os(s,t)&&e.delete(s);return}e.delete?.(t)}}function js(e,t){Bs(Tn,t),T("dock:reset-data-vars",t)}async function ut(e,t){if(await kn("sections"),!e.sve?.fetchSetMeta||!ke||!at)return 0;js(e,t);const n=await Be(e,t);if(!n)return 0;const a=Ee(e),l=n.defaults&&typeof n.defaults=="object"?n.defaults:{};let r=0;for(const d of ke(e.document)){const g=bn(Xe(d.values),a);if(!Array.isArray(g))continue;let u=!1;const i=g.map(c=>{if(c?.type!==t)return c;const b={};for(const[P,H]of Object.entries(l))P in c||(b[P]=H);return Object.keys(b).length?(u=!0,{...c,...b}):c});u&&d.setFieldValue(a,i);for(const c of u?i:g)c?.type!==t||!c._id||(at(d,a,c,Lt(c,n.new||{},n.defaults)),r++)}return Array.isArray(n.definitions)&&_n(t,n.definitions),r}function qs(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function Ks(e,t,{onClose:s}={}){(async()=>{let n=null;try{n=await Fs(e,t)}catch{e.Statamic?.$toast?.error(f(e,"section_fields_failed"));return}if(!n?.fieldset){e.Statamic?.$toast?.error(f(e,"section_fields_none"));return}let a=Promise.resolve(),l=!1;return Q(e.document,Ms,{heading:f(e,"section_fields"),subtitle:n.display,src:`${Rs(e)}/fields/fieldsets/${encodeURIComponent(n.fieldset)}/edit`,closeLabel:f(e,"close"),onSaved:()=>{a=ut(e,t).then(()=>{l=!0}).catch(()=>{})},onClose:()=>{(async()=>{if(await a,!l)try{await ut(e,t)}catch{}T("dock:refresh-preview"),s?.()})()}})})()}const Vs=["title"],Ns={"data-sve-ht-indent":"","aria-hidden":"true"},zs=["data-sve-ht-cat"],Us={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},Ws={key:2,"data-sve-ht-letter":""},Xs=["innerHTML"],Ys=["title"],Zs=["title"],Gs={key:1,"data-sve-ht-kind":""},Js={key:3,"data-sve-ht-name":""},Qs={key:4,"data-sve-ht-actions":""},ea=["disabled","title","innerHTML"],ta=["disabled","title"],na=["disabled","title"],oa=["disabled","title"],sa=["data-sve-ht-id"],aa='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',ra='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',ia='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',la='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',ca='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',da='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',ua={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const t=qs(window),s=f(window,"section_fields");function n(){const u=Ds();if(!u){window.Statamic?.$toast?.error(f(window,"section_fields_none"));return}Ks(window,u)}function a(u){return u.kind==="component"?u.src?`partial:${u.src}`:u.tag:u.name?`${u.tag} ${u.name}`:u.tag}function l(u){return!!u.section}function r(u){if(l(u)){o.onSection?.(u.section);return}o.onSelect?.(u.id)}function d(u,i){const c={"data-sve-ht-id":u.id};return u.current&&(c["data-sve-ht-current"]=""),u.hidden&&(c["data-sve-ht-hidden"]=""),c["data-sve-ht-cat"]=u.cat||"other",c["data-sve-ht-depth"]=String(u.depth),i&&(c["data-sve-ht-dim"]=""),l(u)&&(c["data-sve-ht-sec"]=""),!l(u)&&o.dropId===u.id&&o.dropPlace&&(c["data-sve-ht-drop"]=o.dropPlace),c}function g(u){return!u.hidden||u.wrapFrom!=null}return(u,i)=>(m(),v(I,null,[_("div",re({"data-sve-ht-row":""},d(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:i[26]||(i[26]=c=>r(e.row)),onDblclick:i[27]||(i[27]=k(c=>l(e.row)?null:h(o).onRename?.(e.row.id),["prevent"])),onKeydown:[i[28]||(i[28]=N(k(c=>r(e.row),["prevent"]),["enter"])),i[29]||(i[29]=N(k(c=>r(e.row),["prevent"]),["space"]))],onPointerdown:i[30]||(i[30]=c=>l(e.row)?null:h(o).onPointerDown?.(c,e.row.id)),onContextmenu:i[31]||(i[31]=k(c=>l(e.row)?null:h(o).onContext?.(c,e.row.id),["prevent","stop"]))}),[_("span",Ns,[(m(!0),v(I,null,B(e.row.guides||[],(c,b)=>(m(),v("i",{key:b,"data-sve-ht-cat":c},null,8,zs))),128))]),e.row.hasChildren||e.row.emptyBlock?(m(),v("button",re({key:0,type:"button","data-sve-ht-twist":""},e.row.shut?{"data-sve-ht-shut":""}:{},{innerHTML:ra,onClick:i[0]||(i[0]=k(c=>l(e.row)?h(o).onSection?.(e.row.section):h(o).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:i[1]||(i[1]=k(()=>{},["stop"])),onDblclick:i[2]||(i[2]=k(()=>{},["stop"]))}),null,16)):(m(),v("span",Us)),e.row.letter?(m(),v("span",Ws,S(e.row.letter),1)):(m(),v("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Xs)),_("span",{"data-sve-ht-text":"",title:h(o).renameTitle},[!e.row.kind&&!l(e.row)?(m(),v("button",{key:0,type:"button","data-sve-ht-tag":"",title:h(o).tagTitle,onClick:i[3]||(i[3]=k(()=>{},["stop","prevent"])),onPointerdown:i[4]||(i[4]=k(()=>{},["stop"])),onDblclick:i[5]||(i[5]=k(c=>h(o).onTagChange?.(c,e.row.id),["stop","prevent"]))},S(e.row.tag),41,Zs)):(m(),v("span",Gs,S(e.row.tag),1)),h(o).editingId===e.row.id&&!l(e.row)?Oe((m(),v("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":i[6]||(i[6]=c=>h(o).draft=c),onMousedown:i[7]||(i[7]=k(()=>{},["stop"])),onPointerdown:i[8]||(i[8]=k(()=>{},["stop"])),onClick:i[9]||(i[9]=k(()=>{},["stop"])),onDblclick:i[10]||(i[10]=k(()=>{},["stop"])),onKeydown:[i[11]||(i[11]=k(()=>{},["stop"])),i[12]||(i[12]=N(k(c=>h(o).onRenameCommit?.(),["prevent"]),["enter"])),i[13]||(i[13]=N(k(c=>h(o).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:i[14]||(i[14]=c=>h(o).onRenameCommit?.())},null,544)),[[$t,h(o).draft]]):(m(),v("span",Js,S(e.row.name),1))],8,Ys),l(e.row)?C("",!0):(m(),v("span",Qs,[g(e.row)?(m(),v("button",{key:0,type:"button","data-sve-ht-eye":"",disabled:!h(o).canEdit,title:h(o).canEdit?e.row.hidden?h(o).showTitle:h(o).hideTitle:h(o).lockedTitle,innerHTML:e.row.hidden?la:ia,onClick:i[15]||(i[15]=k(c=>h(o).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:i[16]||(i[16]=k(()=>{},["stop"])),onDblclick:i[17]||(i[17]=k(()=>{},["stop"]))},null,40,ea)):C("",!0),h(t)&&e.row.depth===0?(m(),v("button",{key:1,type:"button","data-sve-ht-fields":"",disabled:!h(o).canEdit,title:h(o).canEdit?h(s):h(o).lockedTitle,innerHTML:aa,onClick:k(n,["stop","prevent"]),onPointerdown:i[18]||(i[18]=k(()=>{},["stop"])),onDblclick:i[19]||(i[19]=k(()=>{},["stop"]))},null,40,ta)):C("",!0),_("button",{type:"button","data-sve-ht-dup":"",disabled:!h(o).canEdit,title:h(o).canEdit?h(o).duplicateTitle:h(o).lockedTitle,innerHTML:ca,onClick:i[20]||(i[20]=k(c=>h(o).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:i[21]||(i[21]=k(()=>{},["stop"])),onDblclick:i[22]||(i[22]=k(()=>{},["stop"]))},null,40,na),_("button",{type:"button","data-sve-ht-del":"",disabled:!h(o).canEdit,title:h(o).canEdit?h(o).deleteTitle:h(o).lockedTitle,innerHTML:da,onClick:i[23]||(i[23]=k(c=>h(o).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:i[24]||(i[24]=k(()=>{},["stop"])),onDblclick:i[25]||(i[25]=k(()=>{},["stop"]))},null,40,oa)]))],16,Vs),e.row.emptyBlock&&!e.row.shut?(m(),v("div",re({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},h(o).dropId===e.row.id&&h(o).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),S(h(o).slotText),17,sa)):C("",!0)],64))}},Me=J(ua,[["__scopeId","data-v-60e221c4"]]),ha=["data-sve-ht-look"],pa={key:0,class:"sve-ht-empty"},fa={key:1,class:"sve-ht-empty"},ma={key:0,class:"sve-ht-empty"},va={__name:"HtmlTreeList",setup(e){const t=ae(()=>Kt(o.query)),s=ae(()=>Ss(o.rows,t.value)),n=ae(()=>s.value.rows),a=ae(()=>t.value?o.sections.filter(d=>Vt(d.row,t.value)||d.current&&d.ready&&n.value.length>0):o.sections),l=ae(()=>!!t.value&&!a.value.length&&!n.value.length);function r(d){return!!t.value&&!s.value.hits.has(d.path)}return(d,g)=>(m(),v("div",re({class:"sve-ht-root","data-sve-ht-look":h(o).look,style:h(o).familyStyle},h(o).dragging?{"data-sve-ht-dragging":""}:{}),[!h(o).rows.length&&!h(o).sections.length?(m(),v("div",pa,S(h(o).emptyText),1)):l.value?(m(),v("div",fa,S(h(o).searchEmpty),1)):C("",!0),h(o).sections.length?(m(!0),v(I,{key:2},B(a.value,u=>(m(),v("div",re({key:u.uid},{ref_for:!0},u.current?{"data-sve-ht-branch":""}:{}),[u.ready?(m(),v(I,{key:0},[(m(!0),v(I,null,B(n.value,i=>(m(),ye(Me,{key:i.id,row:i,dim:r(i)},null,8,["row","dim"]))),128)),h(o).rows.length?C("",!0):(m(),v("div",ma,S(h(o).emptyText),1))],64)):(m(),ye(Me,{key:1,row:u.row},null,8,["row"]))],16))),128)):h(o).rows.length?(m(!0),v(I,{key:3},B(n.value,u=>(m(),ye(Me,{key:u.id,row:u,dim:r(u)},null,8,["row","dim"]))),128)):C("",!0)],16,ha))}},ht=J(va,[["__scopeId","data-v-dc041b26"]]);let Ae=null;function ga(e){return Ae||(Ae=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{pages:[]}).then(t=>Array.isArray(t.pages)?t.pages:[]).catch(()=>[])),Ae}let Te=null;function Re(){Te?.dismiss(),Te=null}function ya(e,t,s){Re();const n=t?.getBoundingClientRect?.(),a={x:n?n.left:0,y:n?n.bottom+4:0};ga(e).then(l=>{const r=l.length?l.map(d=>({label:d.title||d.url,onPick:()=>{Re(),s(d.url)}})):[{label:f(e,"component_props_pages_none"),onPick:null}];Re(),Te=Q(e.document,Ze,{items:r,x:a.x,y:a.y,onClose:()=>{Te=null}})})}const Nt="sve-html-tree-labels";function zt(){try{const e=globalThis.localStorage?.getItem(Nt);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function ka(e){try{globalThis.localStorage?.setItem(Nt,JSON.stringify(e))}catch{}}function Ut(e){return String(e||"_")}function Wt(e){const t=zt()[Ut(e)];return t&&typeof t=="object"?{...t}:{}}function ba(e,t,s){const n=s?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function _a(e,t,s,n){if(!t)return;const a=Ut(e),l=zt(),r={...l[a]||{}},d=String(s||"").replace(/\s+/g," ").trim(),g=String(n||"").trim();!d||d===g?delete r[t]:r[t]=d,Object.keys(r).length?l[a]=r:delete l[a],ka(l)}const Ta=/^@(media|supports|container|layer|scope)\b/i;function xa(e){const t=String(e||""),s=[];let n=0,a=0;for(;n<t.length;){if(t[n]==="{"&&t[n+1]==="{"){const d=t.indexOf("}}",n+2);n=d===-1?t.length:d+2;continue}if(t[n]==="/"&&t[n+1]==="*"){const d=t.indexOf("*/",n+2);n=d===-1?t.length:d+2;continue}if(t[n]==='"'||t[n]==="'"){const d=t[n];for(n+=1;n<t.length&&t[n]!==d;)n+=t[n]==="\\"?2:1;n+=1;continue}if(t[n]!=="{"){n+=1;continue}let l=1,r=n+1;for(;r<t.length&&l>0;){if(t[r]==="{"&&t[r+1]==="{"){const d=t.indexOf("}}",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==="/"&&t[r+1]==="*"){const d=t.indexOf("*/",r+2);r=d===-1?t.length:d+2;continue}if(t[r]==='"'||t[r]==="'"){const d=t[r];for(r+=1;r<t.length&&t[r]!==d;)r+=t[r]==="\\"?2:1;r+=1;continue}t[r]==="{"?l+=1:t[r]==="}"&&(l-=1),r+=1}s.push({selector:t.slice(a,n).trim(),body:t.slice(n+1,r-1),from:a,to:r,text:t.slice(a,r).trim()}),n=r,a=r}return s}function pt(e){const t=String(e||""),s=new Set,n=new Set,a=new Set;for(const l of t.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const r of l[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))r&&(s.add(r),s.add(r.replace(/([:./%!#()[\],])/g,"\\$1")));for(const l of t.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))l[2].trim()&&n.add(l[2].trim());for(const l of t.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))a.add(l[1].toLowerCase());return{classes:s,ids:n,tags:a}}function ft(e,t){const s=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),n=[...s.matchAll(/\.((?:\\.|[\w-])+)/g)].map(r=>r[1]),a=[...s.matchAll(/#((?:\\.|[\w-])+)/g)].map(r=>r[1]);if(n.length||a.length){const r=d=>d.replace(/\\(.)/g,"$1");return n.every(d=>t.classes.has(d)||t.classes.has(r(d)))&&a.every(d=>t.ids.has(r(d)))}const l=[...s.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(r=>r[2].toLowerCase());return l.length>0&&l.every(r=>t.tags.has(r))}function Sa(e){return String(e||"").split(",").map(t=>t.trim()).filter(Boolean)}function wa(e,t,s){const n=Sa(e);if(!n.length)return"keep";const a=n.filter(r=>ft(r,t));return a.length?a.length===n.length&&!n.some(r=>ft(r,s))?"move":"copy":"keep"}function Xt(e,t,s){const n=String(e||""),a=pt(t),l=pt(s),r=[],d=[];let g=0;for(const u of xa(n)){const i=n.slice(u.from,u.to),c=i.match(/^\s*/)[0];if(g=u.to,Ta.test(u.selector)){const P=Xt(u.body,t,s);P.move.trim()&&r.push(`${u.selector} {
${P.move.trim()}
}`),P.keep.trim()&&d.push(`${c}${u.selector} {
${P.keep.trim()}
}`);continue}const b=u.selector.startsWith("@")?"keep":wa(u.selector,a,l);if(b==="move"){r.push(u.text);continue}b==="copy"&&r.push(u.text),d.push(i)}return d.push(n.slice(g)),{move:r.join(`

`).trim(),keep:d.join("").replace(/\n{3,}/g,`

`).trim()}}const Ca="/!/sve/component";function $a(e){const t=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let s=null;for(const n of t){if(!n.trim())continue;const a=n.match(/^[ \t]*/)[0].length;s=s===null?a:Math.min(s,a)}return s?t.map(n=>n.slice(s)).join(`
`):t.join(`
`)}function Pa(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function La(e,t){if(!Vn(e))return"";try{return await(await Sn(()=>import("./tw-compile-D8Xdoe3O.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,t)||""}catch(s){return console.error("[sve] component tailwind compile",s),""}}async function Ea(e,t){const s=await e.fetch(Ca,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":Pt(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!s.ok){const n=new Error(String(s.status));throw n.status=s.status,n}return s.json()}function mt(e,t){const{from:s,to:n}=Kn(e,t),a=e.slice(s,n);if(!a.trim())return null;const l=e.slice(0,s)+e.slice(n),r=T("dock:css"),d=Xt(typeof r=="string"?r:"",a,l);return{html:$a(a),css:d.move,keepCss:d.keep,lead:Pa(a),from:s,to:n}}function Ha(e,t,{onDone:s,onError:n}={}){if(T("dock:is-locked")===!0)return;const a=T("dock:html");if(typeof a!="string"||!t)return;const l=mt(a,t);if(!l)return;const r=Q(e.document,xn,{heading:f(e,"component_new"),nameLabel:f(e,"component_name"),placeholder:f(e,"component_name_placeholder"),value:t.klass||t.tag||"",cancelLabel:f(e,"cancel"),saveLabel:f(e,"component_create"),onOk:d=>{r.dismiss(),(async()=>{try{const g=await La(e,l.html),u=T("dock:html"),i=typeof u=="string"&&u===a?l:mt(u,t);if(!i)return;const c=await Ea(e,{name:d,html:i.html,css:i.css,js:"",tw:g}),b=T("dock:html"),P=b.slice(0,i.from)+i.lead+c.tag+b.slice(i.to);T("dock:set-html",P),i.css.trim()&&T("dock:set-css",i.keepCss),s?.(c)}catch(g){n?.(g)}})()}})}function Ia(e,t,s){const n=String(e||"");if(!t||t.kind!=="antlers")return n;const a=String(s||"").replace(/\s+/g," ").trim();return t.antlers==="loop"?Da(n,t,a):t.tag==="else"||!a?n:n.slice(0,t.from)+`{{ ${t.tag} ${a} }}`+n.slice(t.openTo)}function Ke(e,t,s,n){return ie(e,t,{kind:s,name:n})}function ie(e,t,s={}){const n=String(e||"");if(!t||t.antlers!=="loop")return n;const a=t.loopKind==="collection"?"collection":"field",l=s.kind??a,r=String(s.name??t.expr??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(r))return n;const d=s.sortDir??t.sortDir??"",g=String(s.sortField??t.sortField??"").trim(),u=String(s.limit??t.limit??"").trim(),i=Yt(n,t);if(!i)return n;const c=l===a?t.params:"",b=l==="collection"?Ma(r,g,d,u,c):Aa(r,g,d,u,c),P=l==="collection"?"collection":r;return n.slice(0,t.from)+b+n.slice(t.openTo,i.from)+`{{ /${P} }}`+n.slice(i.to)}function Ma(e,t,s,n,a){const l=Ra(a).replace(/\bsort\s*=\s*["'][^"']*["']/g,"").replace(/\blimit\s*=\s*["']?\d+["']?/g,"").replace(/\s+/g," ").trim(),r=[`collection from="${e}"`];return s==="random"?r.push('sort="random"'):t&&r.push(`sort="${t}${s==="desc"?":desc":":asc"}"`),n&&r.push(`limit="${n}"`),l&&r.push(l),`{{ ${r.join(" ")} }}`}function Aa(e,t,s,n,a){const l=String(a||"").split("|").map(d=>d.trim()).filter(d=>d&&!/^from\s*=/.test(d)&&!/^sort\s*:/.test(d)&&!/^reverse$/.test(d)&&!/^shuffle$/.test(d)&&!/^limit\s*:/.test(d)),r=[e,...l];return s==="random"?r.push("shuffle"):t&&(r.push(`sort:${t}`),s==="desc"&&r.push("reverse")),n&&r.push(`limit:${n}`),`{{ ${r.join(" | ")} }}`}function Ra(e){return String(e||"").replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/,"").replace(/\s+/g," ").trim()}function Yt(e,t){const n=e.slice(t.from,t.to).match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);return n?{from:t.from+n.index,to:t.from+n.index+n[0].length}:null}function Da(e,t,s){return ie(e,t,{name:s})}function Fa(e,t,s){const n=String(e||"");if(!t||t.antlers!=="if"||t.tag==="else")return n;const a=Yt(n,t);if(!a)return n;const r=(n.slice(0,a.from).split(`
`).pop()||"").match(/^[ \t]*/)[0],d=s==="else"?"{{ else }}":"{{ elseif true }}";return`${n.slice(0,a.from)}${d}
${r}${n.slice(a.from)}`}const M=Xn("sve-call-values"),de=new Set;let vt=null;const Oa="__sve-html-tree-style",j=new Set;let Ve="",Y=!1,fe=!0,q="",ue=0,Zt="";const Z=new Map,le=new Set;let D="",Gt=!1,E=null,xe=null,Se=0,Ne=null,he=[],U=null,ce=null,we=null,Ce=null,ze=null,$e=!1,W=null,z=null;function O(e){return e.getElementById(be)}function Ba(e){$n(e,Oa,`
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
      ${rt("light")}
      --sve-ht-pick: rgba(56,88,233,.14);
      --sve-ht-pick-hover: rgba(56,88,233,.22);
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${rt("dark")}
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
  `)}function R(){const e=T("dock:html");return typeof e=="string"?e:""}function Jt(e){return!!T("dock:is-open",e)}function oe(e){return et()?!1:T("dock:set-html",e)===!0}function gt(e){const t=T("dock:component-exit-state")||{};if(o.exitOpen=!!t.open,!t.open){o.onExit=null;return}o.exitName=t.name||"",o.exitLabel=f(e,"component_exit"),o.exitTitle=f(e,t.back?"component_exit_back":"component_exit_close"),o.onExit=()=>{T("dock:exit-component"),$(e)}}function ja(e,t){const s=Rn(e);if(!s||t.type!==s)return"";const n=Dn(t[s]);return n&&Fn(e,n)?.section_type||""}const pe=[];let De=!1;function Fe(e,t){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(t,{timeout:2e3});return}e.setTimeout(t,200)}function qa(e,t){for(const s of t){const n=s.type;!n||Z.has(n)||le.has(n)||pe.includes(n)||pe.push(n)}Ye.htmlTreePrefetchArmed&&Qt(e)}function Tr(e){Ye.htmlTreePrefetchArmed=!0,Qt(e)}function Qt(e){if(De||!pe.length)return;De=!0;const t=()=>{const s=pe.shift();if(!s){De=!1;return}if(Z.has(s)||le.has(s)){Fe(e,t);return}le.add(s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(s)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{typeof n?.html=="string"&&Z.set(s,n.html)}).catch(()=>{}).finally(()=>{le.delete(s),Fe(e,t)})};Fe(e,t)}function et(){return!!D}function Ka(e){const t=new Map,s=Et(e);if(!s)return t;for(const n of s.querySelectorAll("[data-sid]")){const a=n.getAttribute("data-sid");a&&!t.has(a)&&t.set(a,n.tagName.toLowerCase())}return t}function Va(e,t){const s=Ee(e);for(const n of ke(t)||[]){const a=Xe(n.values),l=a&&typeof a=="object"?a[s]:null;if(Array.isArray(l))return!0}return!1}function en(e,t){const s=Ee(e),n=Ka(e),a=[];for(const l of ke(t)||[]){const r=Xe(l.values),d=r&&typeof r=="object"?r[s]:null;if(Array.isArray(d)){d.forEach(g=>{if(!g||typeof g!="object"||Array.isArray(g)||typeof g.type!="string")return;const u=[g._visual_id,g.id,g._id].filter(H=>typeof H=="string"&&H!=="");if(!u.length)return;const i=ja(e,g)||g.type,c=typeof g._sve_label=="string"?g._sve_label.trim():"",b=u.map(H=>n.get(H)).find(Boolean)||"section",P=Wt(g.type)[`0:${b}`];a.push({uid:u[0],ids:u,type:g.type,tag:b,label:(typeof P=="string"&&P.trim()?P.trim():"")||c||Rt(e,i)?.display||qe(i)||i,svg:Ot(b,"",null).svg||Yn.section,cat:Mt(b),enabled:g.enabled!==!1})});break}}return a}function Na(e,t,s){if(!s.length)return"";const n=T("dock:current-type")||"",a=T("dock:current-uid"),l=!!T("dock:component-exit-state")?.open;if(a){const r=Mn(a,t),d=s.find(g=>g.ids.some(u=>r.includes(u)));if(d&&(l||d.type===n))return d.uid}return s.find(r=>r.type===n)?.uid||""}function za(e,t,s){const n=T("dock:component-exit-state");if(n?.open)return qe(n.name)||n.name||"";if(s)return t.find(l=>l.uid===s)?.label||"";const a=T("dock:current-type")||"";return Rt(e,a)?.display||qe(a)||""}function tn(e,t,s,n,a){const l=s.find(d=>d.uid===n);if(!l||n===a)return;j.clear(),E=null,fe=!1,G(),He(),q=n,Zt=R(),D=Z.get(l.type)||"",D&&(E=Pe(Je(D))||null),Gt=(T("dock:current-type")||"")===l.type,e.clearTimeout(ue),ue=e.setTimeout(()=>{q="",Y=!1,$(e)},4e3),$(e);const r=()=>Bn(l.uid,t,e,{clampToSection:!0});An(l.uid,t,e,r),ee({source:ne,type:te.SVE_ACTIVATE,ids:l.ids},e),e.setTimeout(()=>$(e),0)}function nn(e,t){if(!t)return!1;for(const s of e||[])if(s.id===t||nn(s.children,t))return!0;return!1}function Pe(e){for(const t of e||[]){if(!t.kind)return t.id;const s=Pe(t.children);if(s)return s}return""}function Ua(e,t){return j.has(e.path)?t===0:t>0}function Wa(e){const t=new Set,s=(n,a)=>{for(const l of n)l.children.length&&Ua(l,a)&&t.add(l.id),s(l.children,a+1)};return s(e,0),t}function $(e){const t=e.document,n=O(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;Ba(t),zn(e);const a=R();D&&D===a&&(D="");const l=D||a,r=Je(l);he=r;const d=T("dock:current-type")||"",g=Wt(d),u=en(e,t),i=Va(e,t);d&&a&&!D&&Z.set(d,a),qa(e,u);const c=Na(e,t,u);if(i&&!u.length){he=[],o.rows=[],o.sections=[],o.pageBuilder=!0,o.emptyText=f(e,"html_tree_empty"),o.canEdit=!T("dock:is-locked"),o.look=it(e),o.onRefresh=()=>$(e),o.onSection=null,gt(e),_e(n,ht),yt(e,[]);return}o.pageBuilder=i;const b=`${d}|${c}`;b!==Ve&&(Ve=b,j.clear(),Y=l),Y!==!1&&l!==Y&&(Y=!1,j.clear(),E=Pe(r)||null),q&&(q===c||!u.length)&&(Gt||l!==Zt)&&(e.clearTimeout(ue),q="",Y=!1,nn(r,E)||(j.clear(),E=Pe(r)||null));const P=u.some(p=>p.uid===q)?q:"",H=fe?"":P||c,me=!!(P||c),K=Un(r,o.query?new Set:Wa(r));!l.trim()&&!Jt(t)?o.emptyText=f(e,"html_tree_need_dock"):o.emptyText=f(e,"html_tree_empty"),o.slotText=f(e,"antlers_drop_here"),o.dataTitle=f(e,"data_vars_title"),o.pageTitle=f(e,"component_props_page"),o.renameTitle=f(e,"html_tree_rename"),o.tagTitle=f(e,"tw_tag"),o.hideTitle=f(e,"html_tree_hide"),o.showTitle=f(e,"html_tree_show"),o.duplicateTitle=f(e,"html_tree_duplicate"),o.deleteTitle=f(e,"html_tree_delete"),o.lockedTitle=f(e,"html_tree_locked"),o.searchEmpty=f(e,"html_tree_search_empty"),o.canEdit=!T("dock:is-locked"),o.look=it(e),In(e),o.onQuery=()=>$(e),gt(e),o.onSelect=p=>{const x=K.find(w=>w.id===p);x&&Ft(e,x.path)||nt(e,p,K)},o.onTwist=p=>{const x=K.find(w=>w.id===p)?.path;x&&(j.has(x)?j.delete(x):j.add(x),$(e))},o.onTagChange=(p,x)=>{const w=o.rows.find(V=>V.id===x);w&&!et()&&Wn(e,p.currentTarget,w)},o.onRename=p=>Ya(e,p),o.onRenameCommit=()=>kt(e,!0),o.onRenameCancel=()=>kt(e,!1),o.onHide=p=>Za(e,p),o.onDuplicate=p=>Ga(e,p),o.onDelete=p=>Qa(e,p),o.onPointerDown=(p,x)=>or(e,p,x),o.onContext=(p,x)=>tr(e,p,x),o.onInspectCommit=p=>cr(e,p),o.onPropValue=(p,x,w)=>Tt(e,p,x,w),o.onPropPage=(p,x)=>ya(e,p,w=>Tt(e,x,w,!1)),o.onLoopKind=p=>dr(e,p),o.onAddBranch=p=>ur(e,p),o.onLoopSortField=p=>{const x=Le(),w=String(p||"").trim();if(!x)return;const V=z?.id===x.id?z.dir:"",ge=x.sortDir||V||"asc";z=null,X(e,(ln,cn)=>ie(ln,cn,{sortField:w,sortDir:ge}))},o.onLoopSortDir=p=>{const x=Le(),w=String(p||"");if(x){if((w==="asc"||w==="desc")&&!x.sortField){z={id:x.id,dir:w},Ue(e,x);return}z=null,X(e,(V,ge)=>ie(V,ge,{sortDir:w,sortField:w==="asc"||w==="desc"?ge.sortField:""}))}},o.onLoopLimit=p=>X(e,(x,w)=>ie(x,w,{limit:String(p||"").replace(/\D/g,"")})),o.onPropHost=p=>p?M.mount(p):M.unmount(),o.onInspectData=(p,x)=>{T("dock:data-menu",{anchor:p,at:K.find(w=>w.id===E)?.from,onPick:w=>x(String(w?.var||"").trim())})};const se=K.find(p=>!p.kind)?.id,ve=za(e,u,H),y=H?u.find(p=>p.uid===H):null;o.rows=K.map(p=>{const x=Ot(p.tag,p.kind,p.antlers),w=p.id===se&&ve?ve:p.klass,V=p.id===se;return{...p,base:w,name:ba(w,p.path,g),current:p.id===E,letter:x.letter||"",svg:V&&y?y.svg:x.svg||"",cat:Mt(p.tag,p.kind,p.antlers),sectionRoot:V&&y?y.uid:""}});const L=[];for(const p of o.rows)L.length=p.depth,p.guides=L.slice(),L[p.depth]=p.cat;o.sections=me?u.map(p=>{const x=!!H&&p.uid===H;return{...p,current:x,ready:x&&(!P||!!D),row:{id:`sec:${p.uid}`,section:p.uid,tag:p.tag,name:p.label,kind:"",svg:p.svg,cat:p.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:x,hidden:!p.enabled}}}):[],o.onSection=p=>tn(e,t,u,p,H),o.onRefresh=()=>$(e),Ue(e,o.rows.find(p=>p.id===E)),_e(n,ht),yt(e,r)}function yt(e,t){O(e.document)&&on(e,t)}function on(e,t){const s=t[0],n=!!T("dock:component-src"),a=n?"":T("dock:current-uid")||"";ee({source:ne,type:te.SVE_HTML_PICK,on:!0,uid:a,all:n,tag:s?.tag||"",klass:s?.klass||"",nodes:co(t)},e)}function Xa(e){if(!e)return;const t=(s,n)=>{for(const a of s||[]){if(a.path===e)return!0;if(t(a.children,n+1))return n===0?j.delete(a.path):j.add(a.path),!0}return!1};t(he,0)}function Ya(e,t){if($e)return;const s=o.rows.find(n=>n.id===t);!s||s.kind||(E=t,o.rows.forEach(n=>{n.current=n.id===t}),o.editingId=t,o.draft=s.name,e.setTimeout(()=>{const n=O(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function kt(e,t){const s=o.editingId;if(!s)return;const n=o.rows.find(a=>a.id===s);o.editingId=null,t&&n&&_a(T("dock:current-type")||"",n.path,o.draft,n.base||n.klass),o.draft="",$(e)}function Za(e,t){tt(e,t,ro)}function Ga(e,t){tt(e,t,io)}function sn(e,t){On(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const s=e.document;jn({uid:t},s,e)})}function Ja(e,t,s){q===s&&(e.clearTimeout(ue),q="",D=""),E=null,fe=!1,Ve="";const n=en(e,t),a=n.find(l=>l.uid!==s)||n[0];a?tn(e,t,n,a.uid,""):(D="",o.rows=[],o.sections=[],o.pageBuilder=!0,$(e)),e.setTimeout(()=>{O(e.document)&&$(e)},0)}At("row:removed",({uid:e,parentPath:t,doc:s,win:n})=>{t!==Ee(n)||!O(n.document)||Ja(n,s,e)});function Qa(e,t){const s=o.sections?.find(a=>a.row?.id===t),n=s?s.row?.section||s.uid:o.rows.find(a=>a.id===t)?.sectionRoot;if(n){sn(e,n);return}tt(e,t,lo)}function tt(e,t,s){if(T("dock:is-locked"))return;const n=R(),a=o.rows.find(r=>r.id===t);if(!a)return;const l=s(n,a);l!==n&&oe(l)}function G(){W?.dismiss(),W=null}function er(e,t,s){const n=s.row?.section||s.uid;n&&(W=Q(e.document,Ze,{items:[{label:f(e,"html_tree_remove_section"),danger:!0,onPick:()=>{G(),sn(e,n)}}],x:t.clientX,y:t.clientY,onClose:()=>{W=null}}))}function tr(e,t,s){G();const n=o.sections?.find(d=>d.row?.id===s);if(n){er(e,t,n);return}const a=o.rows.find(d=>d.id===s);if(!a)return;nt(e,s,o.rows);const l={x:t.clientX,y:t.clientY},r=d=>{d.length&&(W?.dismiss(),W=Q(e.document,Ze,{items:d,x:l.x,y:l.y,onClose:()=>{W=null}}))};if(a.kind==="component"){nr(e,a,r);return}o.canEdit&&r([{label:f(e,"component_make"),onPick:()=>{G(),Ha(e,a,{onDone:()=>$(e),onError:d=>{e.alert(d?.status===409?f(e,"component_exists"):f(e,"component_failed"))}})}}])}const bt=(e,t)=>{G(),T("dock:open-template",t)};function nr(e,t,s){if(!Gn(t.src)){s([{label:f(e,"component_open_named",{name:t.name||t.src}),onPick:()=>bt(e,`view:partials/${t.src}`)}]);return}s([{label:f(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const a=Array.isArray(n.items)?n.items:[];s(a.length?a.map(l=>({label:f(e,"component_open_named",{name:l.label}),onPick:()=>bt(e,l.type)})):[{label:f(e,"component_none"),onPick:null}])}).catch(()=>s([{label:f(e,"component_none"),onPick:null}]))}function or(e,t,s){if(t.button!==0||T("dock:is-locked")||o.editingId||t.target?.closest?.("button, input"))return;He(),U=s,ce={x:t.clientX,y:t.clientY},we=t.currentTarget,Ce=t.pointerId;const n=l=>sr(e,l),a=l=>ar(e,l);ze=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",a,!0),e.document.removeEventListener("pointercancel",a,!0),ze=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",a,!0),e.document.addEventListener("pointercancel",a,!0)}function sr(e,t){if(!U||!ce)return;const s=t.clientX-ce.x,n=t.clientY-ce.y;if(!o.dragging&&s*s+n*n<25)return;if(!o.dragging){o.dragging=!0;try{we?.setPointerCapture?.(Ce)}catch{}}t.preventDefault();const a=e.document.elementFromPoint(t.clientX,t.clientY),l=a?.closest?.("[data-sve-ht-slot]");if(l){const c=l.getAttribute("data-sve-ht-id");if(c&&c!==U){o.dropId=c,o.dropPlace="inside";return}}const r=a?.closest?.("[data-sve-ht-row]"),d=r?.getAttribute("data-sve-ht-id");if(!d||d===U){o.dropId=null,o.dropPlace=null;return}const g=o.rows.find(c=>c.id===d),u=o.rows.find(c=>c.id===U);if(!g||u&&g.path.startsWith(`${u.path}/`)){o.dropId=null,o.dropPlace=null;return}const i=r.getBoundingClientRect();o.dropId=d,o.dropPlace=so(t.clientY-i.top,i.height,!Bt(g.tag)&&g.kind!=="component")}function ar(e,t){const s=U,n=o.dropId,a=o.dropPlace||"after",l=o.dragging;if(He(),l&&($e=!0,e.setTimeout(()=>{$e=!1},0)),!l||T("dock:is-locked")||!s||!n||s===n)return;t?.preventDefault?.();const r=R(),d=ao(r,he,s,n,a);d!==r&&oe(d)}function He(){try{we?.releasePointerCapture?.(Ce)}catch{}ze?.(),U=null,ce=null,we=null,Ce=null,o.dragging=!1,o.dropId=null,o.dropPlace=null}function an(e){const t=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(t)?t:[]}function Ue(e,t){if(t?.kind==="component"){rr(e,t);return}if(F.callOpen&&(F.callOpen=!1,F.callStore=null,M.forget(),Ge(e)),t?.kind!=="antlers"){o.inspect=null;return}const s=t.id;if(t.tag==="else"){o.inspect={key:s,title:f(e,"antlers_condition"),mode:"note",note:f(e,"antlers_else_note")};return}if(t.antlers==="loop"){const n=t.loopKind==="collection",a=z?.id===t.id?z.dir:"",l=t.sortDir||a;o.inspect={key:s,title:f(e,"antlers_loop"),mode:"loop",loopKind:n?"collection":"field",kinds:[{id:"field",label:f(e,"antlers_loop_field")},{id:"collection",label:f(e,"antlers_loop_collection")}],collections:an(e),value:t.expr||"",placeholder:f(e,n?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:f(e,"antlers_sort"),dir:l,needsField:l==="asc"||l==="desc",field:t.sortField||"",pickable:!n,placeholder:f(e,n?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:f(e,"antlers_sort_none")},{id:"asc",label:f(e,"antlers_sort_asc")},{id:"desc",label:f(e,"antlers_sort_desc")},{id:"random",label:f(e,"antlers_sort_random")}]},limit:{title:f(e,"antlers_limit"),value:t.limit||"",placeholder:f(e,"antlers_limit_placeholder")},branches:[]};return}o.inspect={key:s,title:f(e,"antlers_condition"),mode:"condition",value:t.expr||"",placeholder:f(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:f(e,"antlers_add_elseif")},{id:"else",label:f(e,"antlers_add_else")}]}}function rr(e,t){if(!Jn(e)){o.inspect=null;return}if(!t.src)return;const s=t.id;if(o.inspect={key:s,title:f(e,"component_props_values"),mode:"note",note:f(e,"code_dock_loading")},Qn()){const n={},a={},l=new Map;for(const[r,d]of eo(R().slice(t.from,t.to))){const g=to(r);g&&(r!==g||!l.has(g))&&l.set(g,d)}for(const[r,d]of l)d.bound?a[r]=d.value:n[r]=d.value;vt!==s&&(vt=s,de.clear());for(const r of de)r in a||(a[r]="");o.inspect=null,F.callOpen=!0,F.title=F.title||f(e,"component_props"),F.callTitle=t.klass||t.name||t.src,F.callStore=M.ui,M.ui.canBind=!0,M.ui.dataTitle=f(e,"data_vars_title"),M.ui.exprPlaceholder=f(e,"component_props_expr"),M.ui.onToggleBind=(r,d)=>lr(e,r,d),M.ui.onExpr=(r,d)=>_t(e,r,d),M.ui.onPickData=(r,d)=>T("dock:data-menu",{anchor:d,at:t.from,onPick:g=>_t(e,r,String(g?.var||"").trim())}),M.load(e,{key:`${t.src}::${s}`,src:t.src,params:n,bindings:a,readOnly:T("dock:is-locked")===!0}),M.watch(e,{src:t.src,write:r=>ir(e,r,a)}),Ge(e);return}no(e,t.src).then(n=>{if(o.inspect?.key===s){if(!n.length){o.inspect={key:s,title:f(e,"component_props_values"),mode:"note",note:f(e,"component_props_values_none")};return}o.inspect={key:s,title:f(e,"component_props_values"),mode:"props",inheritLabel:f(e,"component_props_inherit"),rows:oo(n,R().slice(t.from,t.to))}}})}function ir(e,t,s={}){const n=o.rows.find(r=>r.id===E);if(n?.kind!=="component"||T("dock:is-locked"))return;let a=R(),l=n.to;for(const[r,d]of Object.entries(t||{})){if(r in s)continue;const g=a.length,u=Qe(a,{from:n.from,to:l},r,d);u!==a&&(l+=u.length-g,a=u)}a!==R()&&(oe(a),$(e))}function lr(e,t,s){s?de.add(t):de.delete(t),rn(e,t,"",s),$(e)}function _t(e,t,s){de.add(t),rn(e,t,s,!0),$(e)}function rn(e,t,s,n){const a=o.rows.find(d=>d.id===E);if(a?.kind!=="component"||T("dock:is-locked"))return;const l=R(),r=Qe(l,a,t,s,{bound:n});r!==l&&oe(r)}function Le(){const e=o.rows.find(t=>t.id===E);return e?.kind==="antlers"&&!T("dock:is-locked")?e:null}function X(e,t){const s=Le();if(!s)return;const n=R(),a=t(n,s);a!==n&&(oe(a),$(e))}function Tt(e,t,s,n){const a=o.rows.find(d=>d.id===E);if(a?.kind!=="component"||T("dock:is-locked"))return;const l=R(),r=Qe(l,a,t,s,{bound:n});r!==l&&(oe(r),$(e))}function cr(e,t){X(e,(s,n)=>n.antlers==="loop"?Ke(s,n,n.loopKind==="collection"?"collection":"field",t):Ia(s,n,t))}function dr(e,t){const s=Le();if(!s||s.antlers!=="loop")return;const n=s.loopKind==="collection"?"collection":"field";if(t!==n){if(t==="collection"){const a=an(e)[0]?.handle;if(!a)return;X(e,(l,r)=>Ke(l,r,"collection",a));return}X(e,(a,l)=>Ke(a,l,"field",l.handle||"items"))}}function ur(e,t){X(e,(s,n)=>Fa(s,n,t))}function hr(e,t){if(!e||!t||t.kind==="component"||Bt(t.tag))return null;const s=Zn(e,t);if(s<t.openTo)return null;const n=e.lastIndexOf(`
`,s-1)+1;return e.slice(n,s).trim()===""&&n>t.openTo?n-1:s}function nt(e,t,s){if($e)return;const n=(s||o.rows).find(a=>a.id===t);n&&(E=t,o.rows.forEach(a=>{a.current=a.id===t}),Ue(e,n),!et()&&(T("dock:reveal-html",{from:n.from,to:n.to,caret:hr(R(),n)}),T("dock:tw-follow"),ee({source:ne,type:te.SVE_HTML_PICK_FOCUS,path:n.path},e)))}function pr(e,t){if(!t)return"";const s=[],n=(a,l)=>{for(const r of a||[]){const d=l||r.path===e;r.kind==="component"&&r.src===t&&s.push({path:r.path,inside:d}),n(r.children,d)}};return n(he,!1),(s.find(a=>a.inside)||s[0])?.path||""}function fr(e,t){if(!t||!O(e.document))return;fe=!1,Xa(t),$(e);const s=o.rows.find(n=>n.path===t);s&&(nt(e,s.id,o.rows),e.setTimeout(()=>{O(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function We(e){if(xe)return;const t=()=>{o.editingId||o.dragging||(e.clearTimeout(Se),Se=e.setTimeout(()=>{O(e.document)&&$(e)},80))},s=()=>t();xe=At("dock:html-changed",t),e.document.addEventListener("sve-page-structure",s),Ne=()=>{e.document.removeEventListener("sve-page-structure",s)}}function mr(e){xe?.(),xe=null,Ne?.(),Ne=null,e?.clearTimeout?.(Se),Se=0}function ot(e){const t=O(e.document);if(ee({source:ne,type:te.SVE_HTML_PICK,on:!1},e),mr(e),M.forget(),F.callOpen=!1,F.callStore=null,Ge(e),He(),G(),Nn(e),E=null,o.inspect=null,o.editingId=null,o.draft="",o.sections=[],o.pageBuilder=!1,q="",e?.clearTimeout?.(ue),!t){je(e);return}t.remove(),Ye.headerTab==="html_tree"&&wn(e,null),Cn(e),Ht(e),It(e),je(e)}function xr(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=be,_e(t,qt,{title:f(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>ot(e)))}function Sr(e){We(e),$(e)}function vr(e){const t=e.document;if(!Pn(e,"html_tree"))return;if(O(t)){We(e),$(e);return}if(!Jt(t))return;fe=!0,j.clear(),Ln(e,[be]);const s=t.createElement("div");s.id=be,s.style.cssText=En,_e(s,qt,{title:f(e,"html_tree")}),s.querySelector("[data-sve-close]")?.addEventListener("click",()=>ot(e)),Hn(e,s),Ht(e),It(e),je(e),We(e),$(e)}function wr(e){if(O(e.document)){ot(e);return}vr(e)}Dt("html-tree:from-preview",({path:e,src:t}={})=>{Ft(window,e)||fr(window,pr(e,t)||e)});Dt("html-tree:arm-pick",e=>{const t=window;return e?(on(t,Je(R())),!0):(O(t.document)||ee({source:ne,type:te.SVE_HTML_PICK,on:!1},t),!0)});function Cr(){Z.clear(),le.clear(),pe.length=0}export{Oa as HTML_TREE_STYLE_ID,Tr as armHtmlTreePrefetch,Cr as clearHtmlTreeTemplates,G as closeHtmlTreeMenu,ot as closeHtmlTreePanel,Ba as ensureHtmlTreeStyles,xr as fillHtmlTreePane,E as htmlTreeActiveId,O as htmlTreePanel,Se as htmlTreeTimer,xe as htmlTreeUnhook,vr as openHtmlTreePanel,$ as renderHtmlTree,Sr as showHtmlTreePane,mr as stopWatchHtmlTreeDock,wr as toggleHtmlTreePanel,We as watchHtmlTreeDock};
