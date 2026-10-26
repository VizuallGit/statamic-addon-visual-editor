import{r as je,R as po,u as s,o as h,c as f,a as M,t as H,F as R,i as A,m as Tn,f as w,n as fo,w as T,$ as oe,s as v,e as vo,L as U,N as mo,ab as go,a4 as ko,af as ye,j as St,ad as yo,Z as le,aE as bo,v as on,A as To,V as _o,aC as xo,W as _n,aF as wo,B as at,p as Bt,q as Nt,U as Ie,X as So,aG as Co,aH as Lo}from"./addon-B0aiLomH.js";import{c as xn,a as Eo,o as Ho,b as Po,d as Mo,T as $o,i as Io,r as Oo,e as Ro,f as Do,u as an,l as sn}from"./section-create-CkjXqoxX.js";import{canEditFields as Fo,currentSetHandle as Ao,openFieldsetOverlay as wn,openGlobalFieldsOverlay as Bo}from"./section-fields-DQGnB8il.js";import{aw as t,ax as No,ay as Ko,b as _,s as Kt,i as ce,a4 as Ct,ak as Vo,$ as jo,ai as Sn,aj as Cn,W as rn,q as He,a3 as Uo,a0 as qo,a1 as Yo,az as zo,aA as ln,aB as Ln,aC as En,n as Hn,aD as Xo,aE as Go,o as Pn,aF as Wo,J as Mn,a7 as st,t as rt,aG as $n,aH as Zo,aI as Vt,aJ as Jo,aK as Qo,aL as ea,ad as ta,aM as na,aN as oa,aO as aa,aP as sa,aQ as ra,B as In,af as ia,V as jt}from"./lp-cluster-uKivnHAt.js";import{H as qe,j as la,d as da}from"./shortcuts-BBrEL-OT.js";import{_ as it,o as Fe}from"./ChoiceDialog-BO99B2YP.js";import{M as J,S as Q}from"./protocol-BVdEmGBQ.js";import{C as G,D as ca,E as Ae,F as Ut,o as ua,A as ha,G as On,l as pa,I as Rn,H as be,J as fa,K as va,L as qt,c as ma,M as ga,b as ka,N as ya,O as ba,P as Ta,Q as _a,R as xa,S as wa,T as Sa,U as Ca,V as La,W as Ea,X as Ha,Y as dn,Z as Pa,$ as Ma}from"./component-extract-BEBt9TM7.js";import{x as lt,o as $a,K as Dn,L as Fn,M as Ia,N as Oa}from"./css-scope-CvwgFAfm.js";import{b as Ra}from"./html-pick-align-CLq5l-p4.js";import{l as Da,a as Fa,b as Aa,c as Ba,d as Na,e as Ka,f as Va,g as ja,h as Ua}from"./loop-inspector-BZDM_sZ1.js";import"./FieldsetOverlay-T5IA-rDf.js";import"./ai-text-icon-B7uCWIwa.js";const vt=/\s*([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/y,qa=/^\s*(?:([A-Za-z_$][\w$]*)|'([^'\\]*)'|"([^"\\]*)")\s*:\s*(true|false)\s*$/;function Ya(e){const n=String(e||"").replace(/\{\{[\s\S]*?\}\}/g,r=>" ".repeat(r.length)),o=n.match(/^<[a-zA-Z][\w:-]*/);if(!o)return null;let a=o[0].length;for(;a<n.length;){vt.lastIndex=a;const r=vt.exec(n);if(!r){a+=1;continue}if(r[1].toLowerCase()==="x-data")return r[2]??r[3]??r[4]??"";a=vt.lastIndex}return null}function za(e,n){const o=e[n];for(let a=n+1;a<e.length;a+=1)if(e[a]==="\\")a+=1;else if(e[a]===o)return a;return e.length-1}function Xa(e){const n=String(e||""),o=n.search(/\S/);if(o===-1||n[o]!=="{")return[];const a=new Map;let r=0,i="";const l=()=>{const d=i.match(qa);d&&a.set(d[1]??d[2]??d[3],d[4]==="true"),i=""};for(let d=o;d<n.length;d+=1){const k=n[d];if(k==='"'||k==="'"||k==="`"){const m=za(n,d);i+=n.slice(d,m+1),d=m;continue}if(k==="/"&&n[d+1]==="/"){const m=n.indexOf(`
`,d);d=m===-1?n.length:m-1;continue}if(k==="/"&&n[d+1]==="*"){const m=n.indexOf("*/",d+2);d=m===-1?n.length:m+1;continue}if(k==="{"||k==="["||k==="("){if(r+=1,r===1)continue}else if(k==="}"||k==="]"||k===")"){if(r-=1,r===0)break}else if(k===","&&r===1){l();continue}i+=k}return l(),[...a].map(([d,k])=>({key:d,value:k}))}const Ga={key:0,class:"sve-ht-inspect"},Wa={class:"sve-ht-inspect__head"},Za={key:0,class:"sve-ht-inspect__note"},Ja={key:2,class:"sve-ht-inspect__props"},Qa={class:"sve-ht-inspect__proplabel"},es={key:0},ts=["value","disabled","onChange"],ns={value:""},os=["value"],as=["value"],ss=["value","placeholder","onChange"],rs=["title","disabled","onClick"],is=["title","disabled","onClick"],ls={key:0,class:"sve-ht-inspect__seg"},ds=["data-active","disabled","onClick"],cs=["value","disabled"],us={key:0,value:""},hs=["value"],ps=["value","disabled"],fs=["value"],vs={key:3,class:"sve-ht-inspect__box"},ms=["value","placeholder","disabled","onKeydown"],gs=["title","disabled"],ks={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},ys=["value","disabled"],bs=["value"],Ts={key:0,class:"sve-ht-inspect__tick"},_s=["checked","disabled"],xs={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},ws=["value","disabled"],Ss=["value"],Cs={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},Ls=["value","placeholder","disabled"],Es=["title","disabled"],Hs={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Ps=["value","placeholder","disabled"],Ms={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},$s=["value","placeholder","disabled"],Is={key:6,class:"sve-ht-inspect__add"},Os=["disabled","onClick"],mt='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',Rs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',Ds={__name:"HtmlTreeInspector",setup(e){const n=je(null);po(n,m=>t.onPropHost?.(m||null));const o=je(null),a=je(null);function r(m){t.onInspectCommit?.(m.target.value)}function i(m,y,c){!m||!y||(m.value=y,m.focus(),m.setSelectionRange(y.length,y.length),c(y))}function l(m,y){t.onInspectData?.(m.currentTarget,c=>t.onPropValue?.(y.handle,c,!0))}function d(m){t.onInspectData?.(m.currentTarget,y=>i(o.value,y,c=>t.onInspectCommit?.(c)))}function k(m){t.onInspectData?.(m.currentTarget,y=>i(a.value,y,c=>t.onLoopSortField?.(c)))}return(m,y)=>s(t).inspect?(h(),f("div",Ga,[M("div",Wa,H(s(t).inspect.title),1),s(t).inspect.mode==="note"?(h(),f("div",Za,H(s(t).inspect.note),1)):s(t).inspect.mode==="statamic"?(h(),f("div",{key:1,ref_key:"propHost",ref:n,class:"sve-ht-inspect__form"},null,512)):s(t).inspect.mode==="props"?(h(),f("div",Ja,[(h(!0),f(R,null,A(s(t).inspect.rows,c=>(h(),f("label",{key:c.handle,class:"sve-ht-inspect__prop"},[M("span",Qa,[Tn(H(c.label)+" ",1),c.bound?(h(),f("em",es,":")):w("",!0)]),M("span",{class:fo(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":c.type==="select"||c.type==="link"}])},[c.type==="select"&&!c.bound?(h(),f("select",{key:0,value:c.value,disabled:!s(t).canEdit,onChange:C=>s(t).onPropValue?.(c.handle,C.target.value,!1)},[M("option",ns,H(c.placeholder||s(t).inspect.inheritLabel),1),c.value&&!c.options.includes(c.value)?(h(),f("option",{key:0,value:c.value},H(c.value),9,os)):w("",!0),(h(!0),f(R,null,A(c.options,C=>(h(),f("option",{key:C,value:C},H(C),9,as))),128))],40,ts)):(h(),f("input",{key:1,type:"text",value:c.value,placeholder:c.placeholder||s(t).inspect.inheritLabel,onChange:C=>s(t).onPropValue?.(c.handle,C.target.value,c.bound)},null,40,ss)),c.type==="link"?(h(),f("button",{key:2,type:"button","data-sve-ht-data":"",title:s(t).pageTitle,disabled:!s(t).canEdit,onClick:C=>s(t).onPropPage?.(C.currentTarget,c.handle),innerHTML:Rs},null,8,rs)):w("",!0),M("button",{type:"button","data-sve-ht-data":"",title:s(t).dataTitle,disabled:!s(t).canEdit,onClick:C=>l(C,c),innerHTML:mt},null,8,is)],2)]))),128))])):(h(),f(R,{key:3},[s(t).inspect.mode==="loop"?(h(),f("div",ls,[(h(!0),f(R,null,A(s(t).inspect.kinds,c=>(h(),f("button",{key:c.id,type:"button","data-active":c.id===s(t).inspect.loopKind?"":void 0,disabled:!s(t).canEdit,onClick:C=>s(t).onLoopKind?.(c.id)},H(c.label),9,ds))),128))])):w("",!0),s(t).inspect.mode==="loop"&&s(t).inspect.loopKind==="collection"?(h(),f("select",{key:s(t).inspect.key+":"+s(t).inspect.value,value:s(t).inspect.value,disabled:!s(t).canEdit,onChange:r},[s(t).inspect.value?w("",!0):(h(),f("option",us,H(s(t).inspect.placeholder),1)),(h(!0),f(R,null,A(s(t).inspect.collections,c=>(h(),f("option",{key:c.handle,value:c.handle},H(c.title),9,hs))),128))],40,cs)):s(t).inspect.mode==="loop"&&s(t).inspect.loopKind==="nav"?(h(),f("select",{key:s(t).inspect.key+":nav:"+s(t).inspect.value,value:s(t).inspect.value,disabled:!s(t).canEdit,onChange:r},[(h(!0),f(R,null,A(s(t).inspect.navs,c=>(h(),f("option",{key:c.handle,value:c.handle},H(c.title),9,fs))),128))],40,ps)):(h(),f("div",vs,[(h(),f("input",{ref_key:"field",ref:o,key:s(t).inspect.key,type:"text",value:s(t).inspect.value,placeholder:s(t).inspect.placeholder,disabled:!s(t).canEdit,spellcheck:"false",onKeydown:[y[0]||(y[0]=T(()=>{},["stop"])),oe(T(r,["prevent"]),["enter"])],onBlur:r},null,40,ms)),M("button",{type:"button","data-sve-ht-data":"",title:s(t).dataTitle,disabled:!s(t).canEdit,innerHTML:mt,onMousedown:y[1]||(y[1]=T(()=>{},["prevent"])),onClick:T(d,["stop","prevent"])},null,40,gs)])),s(t).inspect.nav?(h(),f(R,{key:4},[M("div",ks,H(s(t).inspect.nav.depthTitle),1),(h(),f("select",{key:s(t).inspect.key+":depth:"+s(t).inspect.nav.depth,value:s(t).inspect.nav.depth,disabled:!s(t).canEdit,onChange:y[2]||(y[2]=c=>s(t).onLoopDepth?.(c.target.value))},[(h(!0),f(R,null,A(s(t).inspect.nav.depths,c=>(h(),f("option",{key:c.id,value:c.id},H(c.label),9,bs))),128))],40,ys)),s(t).inspect.nav.homeAsked?(h(),f("label",Ts,[M("input",{type:"checkbox",checked:s(t).inspect.nav.includeHome,disabled:!s(t).canEdit,onChange:y[3]||(y[3]=c=>s(t).onLoopIncludeHome?.(c.target.checked))},null,40,_s),M("span",null,H(s(t).inspect.nav.homeLabel),1)])):w("",!0)],64)):w("",!0),s(t).inspect.sort?(h(),f(R,{key:5},[M("div",xs,H(s(t).inspect.sort.title),1),(h(),f("select",{key:s(t).inspect.key+":dir:"+s(t).inspect.sort.dir,value:s(t).inspect.sort.dir,disabled:!s(t).canEdit,onChange:y[4]||(y[4]=c=>s(t).onLoopSortDir?.(c.target.value))},[(h(!0),f(R,null,A(s(t).inspect.sort.dirs,c=>(h(),f("option",{key:c.id,value:c.id},H(c.label),9,Ss))),128))],40,ws)),s(t).inspect.sort.needsField?(h(),f("div",Cs,[(h(),f("input",{ref_key:"sortField",ref:a,key:s(t).inspect.key+":field",type:"text",value:s(t).inspect.sort.field,placeholder:s(t).inspect.sort.placeholder,disabled:!s(t).canEdit,spellcheck:"false",onKeydown:[y[5]||(y[5]=T(()=>{},["stop"])),y[6]||(y[6]=oe(T(c=>s(t).onLoopSortField?.(c.target.value),["prevent"]),["enter"]))],onBlur:y[7]||(y[7]=c=>s(t).onLoopSortField?.(c.target.value))},null,40,Ls)),s(t).inspect.sort.pickable?(h(),f("button",{key:0,type:"button","data-sve-ht-data":"",title:s(t).dataTitle,disabled:!s(t).canEdit,innerHTML:mt,onMousedown:y[8]||(y[8]=T(()=>{},["prevent"])),onClick:T(k,["stop","prevent"])},null,40,Es)):w("",!0)])):w("",!0),M("div",Hs,H(s(t).inspect.limit.title),1),(h(),f("input",{key:s(t).inspect.key+":limit",type:"number",min:"1",value:s(t).inspect.limit.value,placeholder:s(t).inspect.limit.placeholder,disabled:!s(t).canEdit,onKeydown:[y[9]||(y[9]=T(()=>{},["stop"])),y[10]||(y[10]=oe(T(c=>s(t).onLoopLimit?.(c.target.value),["prevent"]),["enter"]))],onBlur:y[11]||(y[11]=c=>s(t).onLoopLimit?.(c.target.value))},null,40,Ps)),M("div",Ms,H(s(t).inspect.offset.title),1),(h(),f("input",{key:s(t).inspect.key+":offset",type:"number",min:"0",value:s(t).inspect.offset.value,placeholder:s(t).inspect.offset.placeholder,disabled:!s(t).canEdit,onKeydown:[y[12]||(y[12]=T(()=>{},["stop"])),y[13]||(y[13]=oe(T(c=>s(t).onLoopOffset?.(c.target.value),["prevent"]),["enter"]))],onBlur:y[14]||(y[14]=c=>s(t).onLoopOffset?.(c.target.value))},null,40,$s))],64)):w("",!0),s(t).inspect.branches?.length?(h(),f("div",Is,[(h(!0),f(R,null,A(s(t).inspect.branches,c=>(h(),f("button",{key:c.id,type:"button",disabled:!s(t).canEdit,onClick:C=>s(t).onAddBranch?.(c.id)},H(c.label),9,Os))),128))])):w("",!0)],64))])):w("",!0)}},Fs=it(Ds,[["__scopeId","data-v-7ecb01a5"]]),As={class:"sve-html-tree"},Bs={class:"sve-pane-bar","data-sve-pane-bar":""},Ns={"data-sve-right-title":""},Ks={"data-sve-right-actions":""},Vs=["aria-pressed","title","aria-label"],js=["title"],Us={class:"sve-ht-used-by__label"},qs={class:"sve-ht-used-by__chips"},Ys=["title","onClick"],zs={key:1,class:"sve-ht-used-by__chip"},Xs={key:0,class:"sve-ht-used-by__empty"},Gs={class:"sve-ht-tools"},Ws=["title"],Zs=["placeholder","aria-label","value"],Js=["aria-label"],Qs=["title","aria-label"],er=["title","aria-label"],tr={key:2,class:"sve-tree-exit"},nr=["title"],or=["title"],ar='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',sr='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',rr='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',ir='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',lr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/></svg>',dr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',cr={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const n=v(window,"html_tree_search");t.layers=No(window);const o=v(window,"html_tree_layers_on"),a=v(window,"html_tree_layers_off");function r(){Ko(window,!t.layers)}const i=xn(window),l=v(window,"section_new"),d=v(window,"html_tree_add_element"),k=v(window,"html_tree_sections_slot"),m=v(window,"html_tree_sections_no_field");function y(){const b=t.templateSections.length?t.templateSections:[go(window)],L=new Set(t.rows.filter(P=>P.kind==="sections").map(P=>P.tag));return b.filter(P=>!L.has(P)).map(P=>({tag:`sections:${P}`,label:b.length>1?`${k} · ${P}`:k,noField:!t.templateSections.length}))}const c=je(!1),C=v(window,"section_import");function S(){c.value=!1}async function F(b){if(!b)return;await ko(),t.onRefresh?.();const L=_("html-tree:open-section",b);L&&Oo(window,L.ids)}function E(){const b=t.rows.find(L=>L.current&&!L.context&&!L.synthetic)||null;return b?.lockedIn?t.rows.filter(L=>L.locked&&L.from<=b.from&&L.to>=b.to).sort((L,P)=>L.from-P.from)[0]||null:b}function ee(b){const L=b.getBoundingClientRect(),P=E();let O=null;const K=(B,Se,se="")=>()=>{O?.dismiss(),O=null,S();const ct=Io(window,B,P,Se);ct!==null&&(t.selectFrom={at:ct,left:4},se&&window.Statamic?.$toast?.info?.(se))};O=Fe(document,Ae,{items:[...$o.map(B=>({label:B,onPick:K(B,`<${B}>`)})),...y().map(B=>({label:B.label,onPick:K(B.tag,B.label,B.noField?m:"")}))],x:Math.round(L.left),y:Math.round(L.bottom+4),onClose:()=>{O=null,S()}})}function te(b){if(!c.value){if(c.value=!0,!(t.sections.length||t.pageBuilder)){ee(b.currentTarget);return}(async()=>{const L=await Eo(window);if(!L){S();return}const P=t.sections.length?t.sections[t.sections.length-1].uid:null,O=K=>{S(),F(K?.uid)};if(L==="static"){Ho(window,{afterUid:P,onDone:O,onError:S,onClose:S});return}Po(window,{afterUid:P,onDone:O,onError:S,onClose:S})})()}}function g(){if(c.value)return;c.value=!0;const b=!!(t.sections.length||t.pageBuilder);Mo(window,{intoTemplate:!b,after:b?null:E(),afterUid:b&&t.sections.length?t.sections[t.sections.length-1].uid:null,onDone:L=>{if(S(),b){F(L?.uid);return}Number.isInteger(L?.at)&&(t.selectFrom={at:L.at,left:4})},onError:S,onClose:S})}function p(b){const L=!!t.query;t.query=b,L!==!!b&&t.onQuery?.()}return(b,L)=>(h(),f("div",As,[M("div",Bs,[M("div",Ns,H(e.title),1),M("div",Ks,[M("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":s(t).layers?"true":"false",title:s(t).layers?s(a):s(o),"aria-label":s(t).layers?s(a):s(o),innerHTML:ar,onClick:r},null,8,Vs),L[5]||(L[5]=vo('<button type="button" data-sve-right-pin aria-pressed="false" data-v-9a4a7640></button><button type="button" data-sve-close aria-label="Close" data-v-9a4a7640><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-9a4a7640><path d="M18 6 6 18" data-v-9a4a7640></path><path d="m6 6 12 12" data-v-9a4a7640></path></svg></button>',2))])]),s(t).usedBy?(h(),f("div",{key:0,class:"sve-ht-used-by",title:s(t).usedBy.hint||null},[M("span",Us,[M("span",{class:"sve-ht-used-by__icon","aria-hidden":"true",innerHTML:lr}),Tn(" "+H(s(t).usedBy.label),1)]),M("span",qs,[(h(!0),f(R,null,A(s(t).usedBy.items,P=>(h(),f(R,{key:P.kind+":"+P.name},[P.onOpen?(h(),f("button",{key:0,type:"button",class:"sve-ht-used-by__chip sve-ht-used-by__chip--open",title:P.openLabel,onClick:O=>P.onOpen(O.currentTarget)},H(P.name),9,Ys)):(h(),f("span",zs,H(P.name),1))],64))),128)),s(t).usedBy.empty?(h(),f("span",Xs,H(s(t).usedBy.empty),1)):w("",!0)])],8,js)):w("",!0),M("div",Gs,[M("label",{class:"sve-ht-search",title:s(n)},[M("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:ir}),M("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:s(n),"aria-label":s(n),value:s(t).query,autocomplete:"off",spellcheck:"false",onInput:L[0]||(L[0]=P=>p(P.target.value)),onKeydown:[L[1]||(L[1]=T(()=>{},["stop"])),L[2]||(L[2]=oe(T(P=>p(""),["prevent"]),["escape"]))]},null,40,Zs),s(t).query?(h(),f("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":s(n),innerHTML:dr,onClick:L[3]||(L[3]=P=>p(""))},null,8,Js)):w("",!0)],8,Ws),s(i)&&(s(t).sections.length||s(t).pageBuilder||s(t).rows.length&&!s(t).layoutFile)?(h(),f("button",{key:0,type:"button",class:"sve-ht-new",title:s(t).sections.length||s(t).pageBuilder?s(l):s(d),"aria-label":s(t).sections.length||s(t).pageBuilder?s(l):s(d),innerHTML:sr,onClick:te},null,8,Qs)):w("",!0),s(i)&&(s(t).sections.length||s(t).pageBuilder||s(t).rows.length&&!s(t).layoutFile)?(h(),f("button",{key:1,type:"button",class:"sve-ht-import",title:s(C),"aria-label":s(C),innerHTML:rr,onClick:g},null,8,er)):w("",!0)]),s(G).inSidebar?w("",!0):(h(),U(ca,{key:1})),L[6]||(L[6]=M("div",{"data-sve-html-tree-list":""},null,-1)),mo(Fs),s(t).exitOpen&&!s(G).inSidebar?(h(),f("div",tr,[M("span",{class:"sve-tree-exit__name",title:s(t).exitName},H(s(t).exitName),9,nr),M("button",{type:"button",class:"sve-tree-exit__go",title:s(t).exitTitle,onClick:L[4]||(L[4]=P=>s(t).onExit?.())},H(s(t).exitLabel),9,or)])):w("",!0)]))}},An=it(cr,[["__scopeId","data-v-9a4a7640"]]);function Bn(e){return String(e||"").trim().toLowerCase()}function Lt(e,n){return n?[e.name,e.tag,e.klass,e.label,e.src].filter(o=>typeof o=="string"&&o).join(" ").toLowerCase().includes(n):!0}function ur(e,n){const o=Bn(n);if(!o)return{rows:e,hits:new Set};const a=new Set;for(const l of e)Lt(l,o)&&a.add(l.path);const r=[...a];return{rows:e.filter(l=>a.has(l.path)||r.some(d=>d.startsWith(`${l.path}/`))),hits:a}}const hr=["title"],pr={"data-sve-ht-indent":"","aria-hidden":"true"},fr=["data-sve-ht-cat"],vr={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},mr={key:2,"data-sve-ht-letter":""},gr=["innerHTML"],kr=["title"],yr=["title"],br={key:1,"data-sve-ht-kind":""},Tr={key:3,"data-sve-ht-name":""},_r={key:4,"data-sve-ht-actions":""},xr=["data-on","title","innerHTML"],wr=["title"],Sr={key:5,"data-sve-ht-actions":""},Cr=["data-on","title","innerHTML"],Lr=["data-on","title","innerHTML"],Er=["disabled","title","innerHTML"],Hr=["disabled","title"],Pr=["disabled","title"],Mr=["data-on","disabled","title","aria-pressed","innerHTML"],$r=["disabled","title"],Ir=["data-sve-ht-id"],cn='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',Or='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',Rr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Dr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',Fr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',Ar='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',Br='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',un='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6.5" width="20" height="11" rx="5.5"/><circle cx="7.5" cy="12" r="3" fill="currentColor" stroke="none"/></svg>',hn='<svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M7.5 5.5h9a6.5 6.5 0 0 1 0 13h-9a6.5 6.5 0 0 1 0-13ZM16.5 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6Z"/></svg>',Nr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',Kr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-.9"/></svg>',Vr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',jr={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const n=Fo(window),o=v(window,"section_fields");function a(){const g=Ao();if(!g){window.Statamic?.$toast?.error(v(window,"section_fields_none"));return}wn(window,g)}function r(g){return g.synthetic?g.frame==="main"?t.frameMainTitle:g.frame==="template"?t.frameTemplateTitle:t.frameOpenTitle:g.kind==="component"?g.src?`partial:${g.src}`:g.tag:g.name?`${g.tag} ${g.name}`:g.tag}function i(g){return!!g.section}function l(g){return!!g.frame}function d(g){return g.kind==="slot"}function k(g,p){l(p)||d(p)||(i(p)?t.onSectionPointerDown?.(g,p.section):p.sectionRoot?t.onSectionPointerDown?.(g,p.sectionRoot):t.onPointerDown?.(g,p.id))}function m(g){if(g.synthetic){t.onFrame?.(g.frame);return}if(i(g)){t.onSection?.(g.section);return}t.onSelect?.(g.id)}function y(g,p){const b={"data-sve-ht-id":g.id};return g.locked&&(b["data-sve-ht-locked"]=""),g.current&&(b["data-sve-ht-current"]=""),g.hidden&&(b["data-sve-ht-hidden"]=""),b["data-sve-ht-cat"]=g.cat||"other",b["data-sve-ht-depth"]=String(g.depth),p&&(b["data-sve-ht-dim"]=""),i(g)&&(b["data-sve-ht-sec"]=""),l(g)&&(b["data-sve-ht-frame"]=g.frame),!i(g)&&t.dropId===g.id&&t.dropPlace&&(b["data-sve-ht-drop"]=t.dropPlace),b}function c(g){return!!g.fixed}function C(g){return g.kind==="sections"}function S(g){return!!(g.locked||g.lockedIn)}function F(g){return!g.lockedIn&&!c(g)}function E(g){return!c(g)&&!C(g)&&!S(g)&&(!g.hidden||g.wrapFrom!=null)}function ee(g){return!!g.sectionRoot||!!g.section}function te(g){return t.canEdit&&!S(g)||ee(g)}return(g,p)=>(h(),f(R,null,[M("div",ye({"data-sve-ht-row":""},y(e.row,e.dim),{role:"button",tabindex:"0",title:r(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:p[41]||(p[41]=b=>m(e.row)),onDblclick:p[42]||(p[42]=T(b=>e.row.synthetic?s(t).onFrameEnter?.(e.row.frame):l(e.row)||d(e.row)||i(e.row)?null:s(t).onRename?.(e.row.id),["prevent"])),onKeydown:[p[43]||(p[43]=oe(T(b=>m(e.row),["prevent"]),["enter"])),p[44]||(p[44]=oe(T(b=>m(e.row),["prevent"]),["space"]))],onPointerdown:p[45]||(p[45]=b=>k(b,e.row)),onPointerenter:p[46]||(p[46]=b=>i(e.row)?s(t).onSectionHover?.(e.row.section):null),onContextmenu:p[47]||(p[47]=T(b=>l(e.row)||d(e.row)||i(e.row)?null:s(t).onContext?.(b,e.row.id),["prevent","stop"]))}),[M("span",pr,[(h(!0),f(R,null,A(e.row.guides||[],(b,L)=>(h(),f("i",{key:L,"data-sve-ht-cat":b},null,8,fr))),128))]),e.row.hasChildren||e.row.emptyBlock?(h(),f("button",ye({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?s(t).mainShut:e.row.shut)?{"data-sve-ht-shut":""}:{},{innerHTML:Or,onClick:p[0]||(p[0]=T(b=>e.row.synthetic?s(t).onFrameTwist?.():i(e.row)?s(t).onSection?.(e.row.section):s(t).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:p[1]||(p[1]=T(()=>{},["stop"])),onDblclick:p[2]||(p[2]=T(()=>{},["stop"]))}),null,16)):(h(),f("span",vr)),e.row.letter?(h(),f("span",mr,H(e.row.letter),1)):(h(),f("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,gr)),M("span",{"data-sve-ht-text":"",title:s(t).renameTitle},[!e.row.kind&&!i(e.row)&&!l(e.row)?(h(),f("button",{key:0,type:"button","data-sve-ht-tag":"",title:s(t).tagTitle,onClick:p[3]||(p[3]=T(()=>{},["stop","prevent"])),onPointerdown:p[4]||(p[4]=T(()=>{},["stop"])),onDblclick:p[5]||(p[5]=T(b=>s(t).onTagChange?.(b,e.row.id),["stop","prevent"]))},H(e.row.tag),41,yr)):(h(),f("span",br,H(e.row.tag),1)),s(t).editingId===e.row.id&&!i(e.row)?St((h(),f("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":p[6]||(p[6]=b=>s(t).draft=b),onMousedown:p[7]||(p[7]=T(()=>{},["stop"])),onPointerdown:p[8]||(p[8]=T(()=>{},["stop"])),onClick:p[9]||(p[9]=T(()=>{},["stop"])),onDblclick:p[10]||(p[10]=T(()=>{},["stop"])),onKeydown:[p[11]||(p[11]=T(()=>{},["stop"])),p[12]||(p[12]=oe(T(b=>s(t).onRenameCommit?.(),["prevent"]),["enter"])),p[13]||(p[13]=oe(T(b=>s(t).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:p[14]||(p[14]=b=>s(t).onRenameCommit?.())},null,544)),[[yo,s(t).draft]]):(h(),f("span",Tr,H(e.row.name),1))],8,kr),l(e.row)?(h(),f("span",_r,[e.row.alpineNth>=0?(h(),f("button",{key:0,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:s(t).alpineTitle,innerHTML:e.row.alpineSet?hn:un,onClick:p[15]||(p[15]=T(b=>s(t).onAlpineState?.(b,e.row.id),["stop","prevent"])),onPointerdown:p[16]||(p[16]=T(()=>{},["stop"])),onDblclick:p[17]||(p[17]=T(()=>{},["stop"]))},null,40,xr)):w("",!0),e.row.frame!=="main"&&s(n)?(h(),f("button",{key:1,type:"button","data-sve-ht-fields":"",title:s(t).frameFieldsTitle,innerHTML:cn,onClick:p[18]||(p[18]=T(b=>s(t).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:p[19]||(p[19]=T(()=>{},["stop"])),onDblclick:p[20]||(p[20]=T(()=>{},["stop"]))},null,40,wr)):w("",!0)])):!i(e.row)&&!d(e.row)?(h(),f("span",Sr,[e.row.videoNth>=0?(h(),f("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?s(t).videoPlayTitle:s(t).videoHoldTitle,innerHTML:e.row.videoHeld?Br:Ar,onClick:p[21]||(p[21]=T(b=>s(t).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:p[22]||(p[22]=T(()=>{},["stop"])),onDblclick:p[23]||(p[23]=T(()=>{},["stop"]))},null,40,Cr)):w("",!0),e.row.alpineNth>=0?(h(),f("button",{key:1,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:s(t).alpineTitle,innerHTML:e.row.alpineSet?hn:un,onClick:p[24]||(p[24]=T(b=>s(t).onAlpineState?.(b,e.row.id),["stop","prevent"])),onPointerdown:p[25]||(p[25]=T(()=>{},["stop"])),onDblclick:p[26]||(p[26]=T(()=>{},["stop"]))},null,40,Lr)):w("",!0),E(e.row)?(h(),f("button",{key:2,type:"button","data-sve-ht-eye":"",disabled:!s(t).canEdit,title:s(t).canEdit?e.row.hidden?s(t).showTitle:s(t).hideTitle:s(t).lockedTitle,innerHTML:e.row.hidden?Dr:Rr,onClick:p[27]||(p[27]=T(b=>s(t).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:p[28]||(p[28]=T(()=>{},["stop"])),onDblclick:p[29]||(p[29]=T(()=>{},["stop"]))},null,40,Er)):w("",!0),s(n)&&e.row.fieldsIcon?(h(),f("button",{key:3,type:"button","data-sve-ht-fields":"",disabled:!s(t).canEdit,title:s(t).canEdit?s(o):s(t).lockedTitle,innerHTML:cn,onClick:T(a,["stop","prevent"]),onPointerdown:p[30]||(p[30]=T(()=>{},["stop"])),onDblclick:p[31]||(p[31]=T(()=>{},["stop"]))},null,40,Hr)):w("",!0),!c(e.row)&&!C(e.row)?(h(),f("button",{key:4,type:"button","data-sve-ht-dup":"",disabled:!te(e.row),title:te(e.row)?s(t).duplicateTitle:s(t).lockedTitle,innerHTML:Fr,onClick:p[32]||(p[32]=T(b=>s(t).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:p[33]||(p[33]=T(()=>{},["stop"])),onDblclick:p[34]||(p[34]=T(()=>{},["stop"]))},null,40,Pr)):w("",!0),F(e.row)?(h(),f("button",{key:5,type:"button","data-sve-ht-lock":"","data-on":e.row.locked?"":null,disabled:!s(t).canEdit||e.row.locked&&!s(t).canUnlock,title:e.row.locked?s(t).canUnlock?s(t).unlockTitle:s(t).lockedByTitle:s(t).lockTitle,"aria-pressed":e.row.locked?"true":"false",innerHTML:e.row.locked?Nr:Kr,onClick:p[35]||(p[35]=T(b=>s(t).onLock?.(e.row.id),["stop","prevent"])),onPointerdown:p[36]||(p[36]=T(()=>{},["stop"])),onDblclick:p[37]||(p[37]=T(()=>{},["stop"]))},null,40,Mr)):w("",!0),c(e.row)?w("",!0):(h(),f("button",{key:6,type:"button","data-sve-ht-del":"",disabled:!te(e.row),title:te(e.row)?s(t).deleteTitle:s(t).lockedTitle,innerHTML:Vr,onClick:p[38]||(p[38]=T(b=>s(t).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:p[39]||(p[39]=T(()=>{},["stop"])),onDblclick:p[40]||(p[40]=T(()=>{},["stop"]))},null,40,$r))])):w("",!0)],16,hr),e.row.emptyBlock&&!e.row.shut?(h(),f("div",ye({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},s(t).dropId===e.row.id&&s(t).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),H(s(t).slotText),17,Ir)):w("",!0)],64))}},X=it(jr,[["__scopeId","data-v-25ebfb99"]]),Ur=["data-sve-ht-look","data-sve-ht-layers"],qr={key:0,class:"sve-ht-page-template"},Yr={key:0,class:"sve-ht-page-template__text"},zr={class:"sve-ht-page-template__note"},Xr={key:1,class:"sve-ht-empty"},Gr={key:2,class:"sve-ht-empty"},Wr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},Zr={key:0,class:"sve-ht-empty"},Jr={key:0,class:"sve-ht-empty"},Qr=["data-sve-ht-under-main"],ei={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},ti={key:0,class:"sve-ht-empty"},ni=["data-sve-ht-under-main"],oi=["data-dim"],ai={key:0,class:"sve-ht-empty"},si={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},ri={key:0,class:"sve-ht-empty"},ii={key:4,"data-sve-ht-branch":"","data-sve-ht-cat":"component"},li={__name:"HtmlTreeList",setup(e){const n=le(()=>Bn(t.query)),o=le(()=>ur(t.rows,n.value)),a=le(()=>o.value.rows),r=le(()=>n.value?t.sections.filter(S=>Lt(S.row,n.value)||S.current&&S.ready&&a.value.length>0):t.sections);function i(S){return!!S&&(!n.value||Lt(S,n.value))}function l(S){const F=t.frame?.kind;return t.inComponent||(F==="header"||F==="footer")&&F!==S}const d=le(()=>t.frame?.kind==="header"||t.frame?.kind==="footer"),k=le(()=>!!t.frame&&["header","main","footer"].some(S=>i(t.frame[S]))),m=le(()=>!!t.frame&&(t.frame.kind==="main"||i(t.frame.main))),y=le(()=>!!n.value&&!r.value.length&&!a.value.length&&!k.value);function c(S){return!!n.value&&!o.value.hits.has(S.path)}function C(S){const F={"data-sve-ht-sec-uid":S.uid};return S.current&&(F["data-sve-ht-branch"]="",F["data-sve-ht-cat"]=S.row?.cat||"layout"),t.sectionDrop&&t.sectionDrop.uid===S.uid&&(F["data-sve-ht-drop"]=t.sectionDrop.place),F}return(S,F)=>(h(),f("div",ye({class:"sve-ht-root","data-sve-ht-look":s(t).layers?"tags":s(t).look,"data-sve-ht-layers":s(t).layers?"":null,style:s(t).familyStyle},s(t).dragging?{"data-sve-ht-dragging":""}:{}),[s(t).pageTemplate?(h(),f("div",qr,[s(t).pageTemplate.text?(h(),f("p",Yr,H(s(t).pageTemplate.text),1)):w("",!0),M("p",zr,H(s(t).pageTemplate.note),1),s(t).pageTemplate.canOpen?(h(),f("button",{key:1,type:"button",class:"sve-ht-page-template__open",onClick:F[0]||(F[0]=E=>s(t).pageTemplate.onOpen(E.currentTarget))},H(s(t).pageTemplate.openLabel),1)):w("",!0)])):!s(t).rows.length&&!s(t).sections.length&&!s(t).frame?(h(),f("div",Xr,H(s(t).emptyText),1)):y.value?(h(),f("div",Gr,H(s(t).searchEmpty),1)):w("",!0),s(t).frame||s(t).sections.length?(h(),f(R,{key:3},[s(t).frame?(h(),f(R,{key:0},[s(t).frame.kind==="header"?(h(),f("div",Wr,[(h(!0),f(R,null,A(a.value,E=>(h(),U(X,{key:E.id,row:E,dim:c(E)},null,8,["row","dim"]))),128)),s(t).rows.length?w("",!0):(h(),f("div",Zr,H(s(t).emptyText),1))])):!d.value&&i(s(t).frame.header)?(h(),U(X,{key:1,row:s(t).frame.header,dim:l("header")},null,8,["row","dim"])):w("",!0)],64)):w("",!0),d.value?w("",!0):(h(),f("div",bo(ye({key:1},s(t).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[s(t).frame?.kind==="main"?(h(),f(R,{key:0},[(h(!0),f(R,null,A(a.value,E=>(h(),U(X,{key:E.id,row:E,dim:c(E)},null,8,["row","dim"]))),128)),s(t).rows.length?w("",!0):(h(),f("div",Jr,H(s(t).emptyText),1))],64)):s(t).frame&&i(s(t).frame.main)?(h(),U(X,{key:1,row:s(t).frame.main,dim:l("main")},null,8,["row","dim"])):w("",!0),s(t).frame?.kind==="template"?St((h(),f("div",{key:2,"data-sve-ht-frame-body":"","data-sve-ht-under-main":m.value?"":null},[M("div",ei,[(h(!0),f(R,null,A(a.value,E=>(h(),U(X,{key:E.id,row:E,dim:c(E)},null,8,["row","dim"]))),128)),s(t).rows.length?w("",!0):(h(),f("div",ti,H(s(t).emptyText),1))])],8,Qr)),[[on,!s(t).mainShut]]):w("",!0),s(t).sections.length||s(t).frame?St((h(),f("div",{key:3,"data-sve-ht-frame-body":"","data-sve-ht-under-main":m.value?"":null},[s(t).frame?.template&&i(s(t).frame.template)?(h(),U(X,{key:0,row:s(t).frame.template,dim:l("template")},null,8,["row","dim"])):w("",!0),s(t).frame&&!s(t).frame.template&&!s(t).sections.length&&!n.value?(h(),f("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":l("")?"":void 0},H(s(t).frameEmptyText),9,oi)):w("",!0),(h(!0),f(R,null,A(r.value,E=>(h(),f("div",ye({key:E.uid},{ref_for:!0},C(E)),[E.ready?(h(),f(R,{key:0},[(h(!0),f(R,null,A(a.value,ee=>(h(),U(X,{key:ee.id,row:ee,dim:c(ee)},null,8,["row","dim"]))),128)),s(t).rows.length?w("",!0):(h(),f("div",ai,H(s(t).emptyText),1))],64)):(h(),U(X,{key:1,row:E.row,dim:l("")},null,8,["row","dim"]))],16))),128))],8,ni)),[[on,!s(t).frame||!s(t).mainShut]]):w("",!0)],16)),s(t).frame?(h(),f(R,{key:2},[s(t).frame.kind==="footer"?(h(),f("div",si,[(h(!0),f(R,null,A(a.value,E=>(h(),U(X,{key:E.id,row:E,dim:c(E)},null,8,["row","dim"]))),128)),s(t).rows.length?w("",!0):(h(),f("div",ri,H(s(t).emptyText),1))])):!d.value&&i(s(t).frame.footer)?(h(),U(X,{key:1,row:s(t).frame.footer,dim:l("footer")},null,8,["row","dim"])):w("",!0)],64)):w("",!0)],64)):s(t).inComponent&&s(t).rows.length?(h(),f("div",ii,[(h(!0),f(R,null,A(a.value,E=>(h(),U(X,{key:E.id,row:E,dim:c(E)},null,8,["row","dim"]))),128))])):s(t).rows.length?(h(!0),f(R,{key:5},A(a.value,E=>(h(),U(X,{key:E.id,row:E,dim:c(E)},null,8,["row","dim"]))),128)):w("",!0)],16,Ur))}},gt=it(li,[["__scopeId","data-v-d0376715"]]);let kt=null;function di(e){return kt||(kt=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():{pages:[]}).then(n=>Array.isArray(n.pages)?n.pages:[]).catch(()=>[])),kt}let Ye=null;function yt(){Ye?.dismiss(),Ye=null}function ci(e,n,o){yt();const a=n?.getBoundingClientRect?.(),r={x:a?a.left:0,y:a?a.bottom+4:0};di(e).then(i=>{const l=i.length?i.map(d=>({label:d.title||d.url,onPick:()=>{yt(),o(d.url)}})):[{label:v(e,"component_props_pages_none"),onPick:null}];yt(),Ye=Fe(e.document,Ae,{items:l,x:r.x,y:r.y,onClose:()=>{Ye=null}})})}const Nn="sve-html-tree-labels";function Kn(){try{const e=globalThis.localStorage?.getItem(Nn);if(!e)return{};const n=JSON.parse(e);return n&&typeof n=="object"?n:{}}catch{return{}}}function ui(e){try{globalThis.localStorage?.setItem(Nn,JSON.stringify(e))}catch{}}function Vn(e){return String(e||"_")}function jn(e){const n=Kn()[Vn(e)];return n&&typeof n=="object"?{...n}:{}}function hi(e,n,o){const a=o?.[n];return typeof a=="string"&&a.trim()?a.replace(/\s+/g," ").trim():String(e||"").trim()}function pi(e,n,o,a){if(!n)return;const r=Vn(e),i=Kn(),l={...i[r]||{}},d=String(o||"").replace(/\s+/g," ").trim(),k=String(a||"").trim();!d||d===k?delete l[n]:l[n]=d,Object.keys(l).length?i[r]=l:delete i[r],ui(i)}const q=fa("sve-call-values"),Oe=new Set;let pn=null;const fi="__sve-html-tree-style";function vi(e,n,o){if(n||o)return!1;const a=String(_("dock:chrome-kind")||"");if(a==="header"||a==="footer")return!1;const r=_n(e);return!!r&&r!=="create"&&So(e)!==Co(e)}function Un(e){return{sectionLoops:wo(e),sectionsLabel:v(e,"html_tree_sections_slot")}}function mi(e,n){const o={entry:n,text:"",note:v(e,"html_tree_page_template_note"),openLabel:v(e,"html_tree_open_template"),canOpen:!1,onOpen:null};return $n(e,{entry:n}).then(a=>{!a||t.pageTemplate?.entry!==n||(t.pageTemplate={...t.pageTemplate,text:v(e,"html_tree_page_template",{name:a.name}),canOpen:!!a.open,onOpen:a.open?r=>Zo(e,r,a.open):null})}),o}function gi(e,n){const o=n.replace(/^view:/,"");if(!o||_("dock:current-type")!==n){t.usedBy=null,t.templateSections=[];return}t.usedBy?.view!==o&&(t.usedBy=null,$n(e,{view:o}).then(a=>{if(!a||_("dock:current-type")!==n)return;const r=a.everything?[{name:v(e,"html_tree_used_by_everything"),kind:"everything",url:null}]:a.used_by.map(i=>({...i,...ki(e,i)}));t.templateSections=Array.isArray(a.sections_fields)?a.sections_fields:[],t.usedBy={view:o,label:v(e,"html_tree_used_by"),items:r,empty:r.length?"":v(e,"html_tree_used_by_nobody"),hint:r.length?v(e,"html_tree_used_by_hint",{list:r.map(i=>i.name).join(", ")}):""}}))}function ki(e,n){if(!n.url)return{openLabel:"",onOpen:null};const o=v(e,"html_tree_used_by_open",{name:n.name});return n.kind==="page"?{openLabel:o,onOpen:a=>na(e,a,oa(e,n.url))}:{openLabel:o,onOpen:a=>aa(e,{anchor:a,url:n.url,subtitle:n.name})}}const V=new Set;let Et="",ke=!1,bt=null,de=!0,Z="",_e=0,qn="";const ve=new Map,Pe=new Set,Ht=new Map,ze=new Map;let j="",Yn=!1,D=null,Xe=null,Ve="",Ge="",We=0,Pt=null,Te=[],fe=null,Me=null,Ze=null,Je=null,Mt=null,me=!1,ae=null,Re=null,$e=null,Qe=null,et=null,$t=null,pe=null;function Y(e){return e.getElementById(qe)}function yi(e){To(e,fi,`
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
      padding-left: calc(var(--sve-ht-step) - 7px);
      box-shadow: inset 1px 0 0 color-mix(in srgb, var(--sve-fam-main) 22%, transparent);
    }
    /* Main names the space between, not a thing to edit: a shade quieter. */
    [data-sve-ht-row][data-sve-ht-frame="main"] [data-sve-ht-name] { opacity: .65; font-weight: 500; }
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
    [data-sve-ht-row][data-sve-ht-hidden] [data-sve-ht-actions],
    [data-sve-ht-row][data-sve-ht-locked] [data-sve-ht-actions] {
      display: inline-flex;
    }
    [data-sve-ht-lock],
    [data-sve-ht-video],
    [data-sve-ht-alpine],
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
    /* Held: lit like a hovered icon, in the row's own text colour — not an accent.
       An Alpine state set away from the file is lit the same way. */
    [data-sve-ht-video][data-on],
    [data-sve-ht-alpine][data-on] { opacity: 1; background: rgba(255,255,255,.14); }
    /* Locked: the padlock shut and lit, on the row that holds the lock. */
    [data-sve-ht-lock][data-on] { opacity: 1; background: rgba(255,255,255,.14); }
    [data-sve-ht-lock][disabled] { cursor: default; }
    [data-sve-ht-lock]:not([disabled]):hover,
    [data-sve-ht-video]:hover,
    [data-sve-ht-alpine]:hover,
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
      ${rn("light")}
      /* How much of a row's own colour its pick takes: a wash, not a fill.
         The row mixes it in below — a mix written up here would read
         --sve-ht-c on the list, where no family is set. */
      --sve-ht-pick-mix: 11%;
      --sve-ht-pick-hover-mix: 18%;
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${rn("dark")}
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
    /* One level is exactly the twist and the air after it (14px + 5px), so
       a row one level in starts where its parent's mark stands: a child
       without a twist has its mark right under the parent's, a child with
       one has its twist there. Every level, every look of these rows. */
    [data-sve-ht-look="tags"] { --sve-ht-step: 19px; }
    [data-sve-ht-look="tags"] [data-sve-ht-row] {
      margin: 0 0 0 calc(var(--sve-ht-depth, 0) * var(--sve-ht-step));
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
      left: calc(var(--sve-ht-inset) - 0.25rem - var(--sve-ht-depth, 0) * var(--sve-ht-step));
      width: calc(var(--sve-ht-depth, 0) * var(--sve-ht-step));
      pointer-events: none;
    }
    [data-sve-ht-look="tags"] [data-sve-ht-indent] i {
      display: block;
      flex: none;
      width: var(--sve-ht-step);
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
    /* No arrow, the arrow's room all the same: a row with nothing to fold
       keeps its mark and tag in the column its siblings' stand in. (The
       owner's call, 12 Oct 2026, reversing 28 Sep — an open section with no
       children stood a step left of the shut sections around it.) */
    [data-sve-ht-look="tags"] [data-sve-ht-twist-gap] {
      display: inline-block;
      flex: none;
      width: 14px;
      height: 14px;
    }
    [data-sve-ht-look="tags"] [data-sve-ht-twist] { opacity: .55; }
    [data-sve-ht-look="tags"] [data-sve-ht-twist]:hover { opacity: 1; }
    [data-sve-ht-look="tags"] [data-sve-ht-slot][data-sve-ht-id] {
      margin-left: calc(var(--sve-ht-depth, 0) * var(--sve-ht-step));
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
    [data-sve-ht-look="tags"] [data-sve-ht-alpine]:hover,
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
      padding-left: calc(var(--sve-ht-inset) + (var(--sve-ht-depth, 0) + var(--sve-ht-base, 0)) * var(--sve-ht-step));
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
      left: calc(var(--sve-ht-inset) + 0.25rem + (var(--sve-ht-depth, 0) + var(--sve-ht-base, 0)) * var(--sve-ht-step));
    }
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-sec-uid][data-sve-ht-drop="before"]::before,
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-sec-uid][data-sve-ht-drop="after"]::after {
      left: calc(var(--sve-ht-inset) + 0.25rem + var(--sve-ht-base, 0) * var(--sve-ht-step));
    }
    /* The empty slots keep their place: a block's one level under it, and
       main's where the frame body's margin used to put it. */
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-slot][data-sve-ht-id] {
      margin-left: calc((var(--sve-ht-depth, 0) + var(--sve-ht-base, 0)) * var(--sve-ht-step));
    }
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-frame-slot] {
      margin-left: calc(var(--sve-ht-base, 0) * var(--sve-ht-step) + 0.75rem);
    }
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-icon] svg { width: 0.75rem; height: 0.75rem; }
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-twist] svg { width: 0.625rem; height: 0.625rem; }
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-eye] svg,
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-fields] svg,
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-dup] svg,
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-lock] svg,
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-alpine] svg,
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-del] svg { width: 0.625rem; height: 0.625rem; }
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-video] svg { width: 0.75rem; height: 0.75rem; }
  `)}function z(){const e=_("dock:html");return typeof e=="string"?e:""}function zn(e){return!!_("dock:is-open",e)}function we(e,{save:n=!1,unlock:o=!1}={}){return Yt()||_("dock:set-html",o?{html:e,unlock:!0}:e)!==!0?!1:(n&&_("dock:save-now"),!0)}function Tt(e){const n=_("dock:component-exit-state")||{};if(t.exitOpen=!!n.open,!n.open){t.onExit=null;return}t.exitName=n.name||"",t.exitLabel=v(e,"component_exit"),t.exitTitle=v(e,n.back?"component_exit_back":"component_exit_close"),t.onExit=()=>{_("dock:exit-component"),I(e)}}const De=[];let _t=!1;function xt(e,n){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(n,{timeout:2e3});return}e.setTimeout(n,200)}function bi(e,n){for(const o of n){const a=o.type;!a||ve.has(a)||Pe.has(a)||De.includes(a)||De.push(a)}Kt.htmlTreePrefetchArmed&&Xn(e)}function Tl(e){Kt.htmlTreePrefetchArmed=!0,Xn(e)}function Xn(e){if(_t||!De.length)return;_t=!0;const n=()=>{const o=De.shift();if(!o){_t=!1;return}if(ve.has(o)||Pe.has(o)){xt(e,n);return}Pe.add(o),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(o)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(a=>a.ok?a.json():null).then(a=>{if(typeof a?.html=="string"){ve.set(o,a.html);const r=ze.get(o);ze.delete(o),r&&r!==Gn(e,o)&&I(e)}}).catch(()=>{}).finally(()=>{Pe.delete(o),xt(e,n)})};xt(e,n)}function Yt(){return!!j}function Gn(e,n){return Wn(n)||Lo(e,n)||"section"}function Wn(e){const n=ve.get(e);if(!n)return"";const o=Ht.get(e);if(o&&o.html===n)return o.tag;const a=zt(lt(n))?.tag||"";return Ht.set(e,{html:n,tag:a}),a}function Be(e,n){const o=at(e)||"page_sections",a=[];for(const r of Bt(n)||[]){if(r.name===Wo||r.name===la)continue;const i=Nt(r.values),l=i&&typeof i=="object"?i[o]:null;if(Array.isArray(l)){l.forEach(d=>{if(!d||typeof d!="object"||Array.isArray(d)||typeof d.type!="string")return;const k=[d._visual_id,d.id,d._id].filter(S=>typeof S=="string"&&S!=="");if(!k.length)return;const m=Mn(e,d),y=typeof d._sve_label=="string"?d._sve_label.trim():"",c=Gn(e,m);Wn(m)||ze.set(m,c);const C=jn(m)[`0:${c}`];a.push({uid:k[0],ids:k,type:m,tag:c,label:y||(typeof C=="string"&&C.trim()?C.trim():"")||st(e,m)?.display||Ie(m)||m,svg:Rn(c,fn(c),null).svg||be.section,cat:Hn(c,fn(c)),enabled:d.enabled!==!1,static:Ro(e,m)})});break}}return a}function Ti(e,n,o){if(!o.length)return"";const a=_("dock:current-type")||"",r=_("dock:current-uid"),i=!!_("dock:component-exit-state")?.open;if(r){const l=rt(r,n),d=o.find(k=>k.ids.some(m=>l.includes(m)));if(d&&(i||d.type===a))return d.uid}return o.find(l=>l.type===a)?.uid||""}function _i(e,n,o){const a=_("dock:component-exit-state");if(a?.open)return Ie(a.name)||a.name||"";if(o)return n.find(i=>i.uid===o)?.label||"";const r=_("dock:current-type")||"";return String(r).startsWith("view:")?"":st(e,r)?.display||Ie(r)||""}function dt(e,n,o,a,r){const i=o.find(l=>l.uid===a);i&&a!==r&&(V.clear(),D=null,de=!1,W(),Ne(),Z=a,qn=z(),j=ve.get(i.type)||"",j&&(D=Ot(lt(j))||null),Yn=(_("dock:current-type")||"")===i.type,e.clearTimeout(_e),_e=e.setTimeout(()=>{Z="",ke=!1,I(e)},4e3),I(e),ta(e,i.uid,"tree"),ce({source:Q,type:J.SVE_ACTIVATE,ids:i.ids},e),e.setTimeout(()=>I(e),0))}function It(e,n){if(!n)return!1;for(const o of e||[])if(o.id===n||It(o.children,n))return!0;return!1}function Ot(e){return zt(e)?.id||""}function zt(e){for(const n of e||[]){if(Zn(n))return n;const o=zt(n.children);if(o)return o}return null}function Zn(e){return!e.kind||e.kind==="component"}function fn(e){return e==="component"?"component":""}function xi(e,n){const o=n===0||e.path===Ge;return V.has(e.path)?o:!o}function wi(e){const n=new Set,o=(a,r)=>{for(const i of a)i.children.length&&xi(i,r)&&n.add(i.id),o(i.children,r+1)};return o(e,0),n}function I(e){const n=e.document,a=Y(n)?.querySelector("[data-sve-html-tree-list]");if(!a)return;yi(n),ha(e);const r=z();j&&j===r&&(j=""),_("dock:chrome-kind")&&(j="");const i=j||r,l=lt(i,Un(e));Te=l,Ge="";const d=_("dock:current-type")||"",k=jn(d),m=xo(e,n),c=!!(_("dock:component-exit-state")||{}).open;d&&r&&!j&&ve.set(d,r);const C=Be(e,n);bi(e,C);const S=Ti(e,n,C);if(vi(e,m,c)){const u=_n(e);Te=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!1,t.layoutFile=!1,t.usedBy=null,t.emptyText="",t.pageTemplate?.entry!==u&&(t.pageTemplate=mi(e,u)),t.onRefresh=()=>I(e),t.onSection=null,Tt(e),He(a,gt),wt(e,[]);return}t.pageTemplate=null,gi(e,String(_("dock:collection-view")||""));const F=String(_("dock:chrome-kind")||"");if(zo(e),m&&!C.length&&!F){Te=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,t.layoutFile=!1,t.emptyText=v(e,"html_tree_page_empty"),t.canEdit=!_("dock:is-locked"),t.look=ln(e),t.onRefresh=()=>I(e),t.onSection=null,Tt(e),He(a,gt),wt(e,[]);return}t.pageBuilder=m;const E=`${d}|${S}`;let ee=!1;E!==Et&&(Et=E,V.clear(),bt!==null&&i!==bt?ee=!0:ke=i),(ee||ke!==!1&&i!==ke)&&(ke=!1,V.clear(),D=Ot(l)||null),bt=i,Z&&(Z===S||!C.length)&&(Yn||i!==qn)&&(e.clearTimeout(_e),Z="",ke=!1,It(l,D)||(V.clear(),D=Ot(l)||null));const te=C.some(u=>u.uid===Z)?Z:"",g=de?"":te||S,p=!!(te||S),b=p||c?"":String(_("dock:chrome-kind")||""),P=m&&(!d&&!p||b==="main"&&_("dock:on-empty-page")===!0),O=P||b==="template"?"":b;t.layoutFile=O==="main",O!=="main"&&(Ve="");const K=O==="main"?vn(l,"main"):null,B=K?tt(l,u=>u.tag==="body"&&It(u.children,K.id)):null;Ge=B?B.path:"",K&&(Ue((B||K).path),Ve!==E&&(Ue(K.path),V.add(K.path)));const Se=O==="header"||O==="footer"?tt(l,u=>i.slice(u.from,u.openTo).includes(`data-sve-chrome="${O}"`)):null,se=Se||(O==="header"||O==="footer"?vn(l,O):null);se&&Ue(se.path);const N=P||!(O==="main"?!!K:O==="header"||O==="footer"?!!se:!0)?[]:$a(l,t.query?new Set:wi(l));!i.trim()&&!zn(n)?t.emptyText=v(e,"html_tree_need_dock"):t.emptyText=v(e,"html_tree_empty"),t.slotText=v(e,"antlers_drop_here"),t.dataTitle=v(e,"data_vars_title"),t.pageTitle=v(e,"component_props_page"),t.renameTitle=v(e,"html_tree_rename"),t.tagTitle=v(e,"tw_tag"),t.hideTitle=v(e,"html_tree_hide"),t.showTitle=v(e,"html_tree_show"),t.duplicateTitle=v(e,"html_tree_duplicate"),t.deleteTitle=v(e,"html_tree_delete"),t.videoHoldTitle=v(e,"html_tree_video_hold"),t.videoPlayTitle=v(e,"html_tree_video_play"),t.alpineTitle=v(e,"html_tree_alpine_state"),t.lockedTitle=v(e,"html_tree_locked"),t.searchEmpty=v(e,"html_tree_search_empty"),t.canEdit=!_("dock:is-locked"),t.look=ln(e),t.onQuery=()=>I(e),Tt(e),t.inComponent=c,t.onSelect=u=>{const x=N.find($=>$.id===u);x&&On(e,x.path)||ot(e,u,N)},t.onTwist=u=>{const x=N.find($=>$.id===u)?.path;x&&(V.has(x)?V.delete(x):V.add(x),I(e))},t.onTagChange=(u,x)=>{const $=t.rows.find(Ke=>Ke.id===x);$&&!Yt()&&!Xt(e,$)&&pa(e,u.currentTarget,$)},t.onRename=u=>Mi(e,u),t.onRenameCommit=()=>mn(e,!0),t.onRenameCancel=()=>mn(e,!1),t.onHide=u=>Fi(e,u),t.onLock=u=>Di(e,u),t.canUnlock=Qn(e),t.lockTitle=v(e,"html_tree_lock"),t.unlockTitle=v(e,"html_tree_unlock"),t.lockedByTitle=v(e,"html_tree_locked_by_developer"),t.onVideoHold=u=>Ii(e,u),t.onAlpineState=(u,x)=>Ri(e,u,x),t.onDuplicate=u=>Ai(e,u),t.onDelete=u=>Ni(e,u),t.onPointerDown=(u,x)=>Ui(e,u,x),t.onSectionPointerDown=(u,x)=>zi(e,u,x),t.onSectionHover=u=>e.dispatchEvent(new e.CustomEvent("sve-lite-hover",{detail:{uid:u}})),t.onContext=(u,x)=>Vi(e,u,x),t.onInspectCommit=u=>el(e,u),t.onPropValue=(u,x,$)=>bn(e,u,x,$),t.onPropPage=(u,x)=>ci(e,u,$=>bn(e,x,$,!1)),t.onLoopKind=u=>tl(e,u),t.onAddBranch=u=>nl(e,u),t.onLoopSortField=u=>{const x=nt();if(!x)return;const $=pe?.id===x.id?pe.dir:"";pe=null,ne(e,Da(x,u,$))},t.onLoopSortDir=u=>{const x=nt();if(!x)return;const $=Fa(x,u);if($.draft){pe={id:x.id,dir:$.draft},Ft(e,x);return}pe=null,ne(e,$.edit)},t.onLoopDepth=u=>ne(e,Na(u)),t.onLoopIncludeHome=u=>ne(e,Ka(u)),t.onLoopLimit=u=>ne(e,Va(u)),t.onLoopOffset=u=>ne(e,ja(u)),t.onPropHost=u=>u?q.mount(u):q.unmount(),t.onInspectData=(u,x)=>{_("dock:data-menu",{anchor:u,at:N.find($=>$.id===D)?.from,onPick:$=>x(String($?.var||"").trim())})};const Zt=N.find(Zn)?.id,Jt=c?"":_i(e,C,g),ue=g&&!c?C.find(u=>u.uid===g):null,io=Ln(e,String(_("dock:current-type")||""));let lo=0;const co=Oi(Se?[Se]:l,i),uo=En(e,String(d)),re=O==="header"||O==="footer"?O:"",ge=se?se.id:"",he=K&&N.find(u=>u.id===K.id)||null,Qt=B&&N.find(u=>u.id===B.id)||null,ie=Qt||he||ge&&N.find(u=>u.id===ge)||null,en=ie?Ei(N,ie):-1;if(ie&&!N.slice(N.indexOf(ie),en).some(u=>u.id===D)&&(D=ie.id),t.selectFrom){const u=N.find(x=>x.from===t.selectFrom.at&&(!x.kind||x.kind==="sections"));u?(D=u.id,t.selectFrom=null):--t.selectFrom.left<=0&&(t.selectFrom=null)}const tn=t.layoutFile?Li(e):null;t.rows=N.map(u=>{const x=tn&&u.kind==="component"&&tn.get(u.src)||"",$=u.tag==="body"&&!u.kind,Ke=x?{svg:be[x]}:Rn(u.tag,u.kind,u.antlers),ht=u.tag==="video"&&!u.kind?lo++:-1,Ce=co.get(u.id),ho=Ce?uo[Ce.nth]||{}:{},pt=Ce?Ce.booleans.map(({key:Ee,value:nn})=>({key:Ee,file:nn,value:ho[Ee]??nn})):[],ft=u.id===Zt&&Jt?Jt:u.klass,Le=u.id===Zt;return{...u,tag:x||u.tag,frameCall:x,fixed:!!x||$,base:ft,name:x?v(e,`html_tree_frame_${x}`):re&&u.id===ge?v(e,`html_tree_frame_${re}`):u===he?v(e,"html_tree_frame_main"):Le&&ue?ft:hi(ft,u.path,k),current:u.id===D,letter:Ke.letter||"",svg:re&&u.id===ge?be[re]:u===he?be.main:Le&&ue?ue.svg:Ke.svg||"",frame:re&&u.id===ge?re:u===he?"main":"",cat:re&&u.id===ge?re:u===he||$?"main":x||Hn(u.tag,u.kind,u.antlers),componentRoot:Le&&c,sectionRoot:Le&&ue?ue.uid:"",fieldsIcon:!!(Le&&ue&&!ue.static),videoNth:ht,videoHeld:ht>=0&&io.has(ht),alpineNth:pt.length?Ce.nth:-1,alpineKeys:pt,alpineSet:pt.some(Ee=>Ee.value!==Ee.file)}}),Xo(e),Go(e);const ut=[];for(const u of t.rows)ut.length=u.depth,u.guides=ut.slice(),ut[u.depth]=u.cat;if(ie){const u=N.indexOf(ie),x=ie.depth;t.rows=t.rows.slice(u,en).map($=>({...$,depth:$.depth-x,guides:$.guides.slice(x)})),he&&Ve!==E&&(Ve=E,e.setTimeout(()=>ot(e,he.id,N),0))}t.sections=m&&!c&&(p||O||P)?C.map(u=>{const x=!!g&&u.uid===g;return{...u,current:x,ready:x&&(!te||!!j),row:{id:`sec:${u.uid}`,section:u.uid,tag:u.tag,name:u.label,kind:"",svg:u.svg,cat:u.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:x,hidden:!u.enabled}}}):[],t.frame=Ci(e,C,p,c,O,!1,!!Qt),t.frameEmptyText=v(e,"html_tree_frame_no_sections"),Si(e,O),t.onSection=u=>{me||(Rt(e),dt(e,n,C,u,g))},t.onRefresh=()=>I(e),Ft(e,t.rows.find(u=>u.id===D)),He(a,gt),wt(e,l)}function Si(e,n){t.frameOpenTitle=v(e,"html_tree_frame_open"),t.frameMainTitle=v(e,"html_tree_frame_main_open"),t.frameTemplateTitle=v(e,"html_tree_frame_template_open"),t.frameFieldsTitle=v(e,"html_tree_frame_fields"),t.onFrame=o=>{n===o?Hi(e,o):Dt(e,o)},t.onFrameEnter=o=>Dt(e,o),t.onFrameFields=o=>Bo(e,Qo(e,o),v(e,`html_tree_frame_${o}`)),t.onFrameTwist=()=>{t.mainShut=!t.mainShut}}function Ci(e,n,o,a,r,i=!1,l=!1){if(!r&&!i||l)return null;const d=y=>({id:`frame:${y}`,frame:y,synthetic:!0,tag:y,name:v(e,`html_tree_frame_${y}`),kind:"",svg:be[y]||"",cat:y,letter:"",depth:0,hasChildren:y==="main"&&(n.length>0||r==="template"),shut:y!=="main",current:!1,hidden:!1}),k={kind:r,header:d("header"),main:d("main"),footer:d("footer"),template:null},m=r&&r!=="template"?String(_("dock:collection-view")||""):"";return m&&(k.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:st(e,m)?.display||Ie(m.replace(/^view:/,"")),kind:"",svg:be.section,cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),k}function vn(e,n){return tt(e,o=>o.tag===n)}function tt(e,n){for(const o of e||[]){if(!o.kind&&n(o))return o;const a=tt(o.children,n);if(a)return a}return null}function Li(e){const n=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},o=new Map;for(const a of["header","footer"]){const r=ma(n[a]?.type);r&&o.set(r,a)}return o}function Ei(e,n){let o=e.indexOf(n)+1;for(;o<e.length&&e[o].depth>n.depth;)o+=1;return o}function Hi(e,n){const o=In(e);(n==="main"||n==="template"?o?.querySelector("main"):o?.querySelector(`[data-sve-chrome="${n}"]`))?.scrollIntoView({behavior:"smooth",block:"start"})}function Rt(e){const n=String(_("dock:chrome-open",e.document)||"");return n!=="header"&&n!=="footer"?!1:(ea(e),ce({source:Q,type:J.SVE_FORCE_EXIT_CHROME},e),!0)}function Pi(e){e.clearTimeout(_e),Z="",j="",V.clear(),D=null,de=!1,W(),Ne()}function Dt(e,n){if(e.document,String(_("dock:chrome-kind")||"")===n)return;if(Pi(e),n==="main"){Rt(e),_("dock:open-file",da);return}if(n==="template"){const i=String(_("dock:collection-view")||"");i&&(Rt(e),_("dock:open-file",i));return}if(n!=="header"&&n!=="footer")return;const o=In(e)?.querySelector(`[data-sve-chrome="${n}"]`);o?(o.scrollIntoView({block:"nearest"}),o.dispatchEvent(new o.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:Q,type:J.OPEN_CHROME,kind:n},e.location.origin);const a=Date.now(),r=async()=>{if(String(_("dock:chrome-kind")||"")!==n){Date.now()-a<3e4&&e.setTimeout(r,250);return}await(_("dock:load-settled")||null),ro(e)};e.setTimeout(r,250)}function wt(e,n){Y(e.document)&&Jn(e,n)}function Jn(e,n){const o=n[0],a=!!_("dock:component-src"),r=a?"":_("dock:current-uid")||"";ce({source:Q,type:J.SVE_HTML_PICK,on:!0,uid:r,uids:r?rt(r,e.document):[],all:a,tag:o?.tag||"",klass:o?.klass||"",nodes:Ra(n)},e)}function Ue(e){if(!e)return;const n=(o,a)=>{for(const r of o||[]){if(r.path===e)return!0;if(n(r.children,a+1))return a===0||r.path===Ge?V.delete(r.path):V.add(r.path),!0}return!1};n(Te,0)}function Mi(e,n){if(me)return;const o=t.rows.find(a=>a.id===n);Xt(e,o)||!o||o.kind||(D=n,t.rows.forEach(a=>{a.current=a.id===n}),t.editingId=n,t.draft=o.name,e.setTimeout(()=>{const a=Y(e.document)?.querySelector("[data-sve-ht-rename]");a?.focus(),a?.select()},0))}function mn(e,n){const o=t.editingId;if(!o)return;const a=t.rows.find(r=>r.id===o);t.editingId=null,n&&a&&(a.sectionRoot?$i(e,a.sectionRoot,t.draft):pi(_("dock:current-type")||"",a.path,t.draft,a.base||a.klass)),t.draft="",I(e)}function $i(e,n,o){const a=at(e)||"page_sections",r=String(o||"").replace(/\s+/g," ").trim();for(const i of Bt(e.document)||[]){const l=Nt(i.values),d=l&&typeof l=="object"?l[a]:null;if(!Array.isArray(d))continue;const k=d.findIndex(C=>C&&typeof C=="object"&&[C._visual_id,C.id,C._id].includes(n));if(k===-1)continue;const m=Mn(e,d[k]),y=st(e,m)?.display||Ie(m)||m,c=JSON.parse(JSON.stringify(d));return c[k]={...c[k]},!r||r===y?delete c[k]._sve_label:c[k]._sve_label=r,i.setFieldValue(a,c),!0}return!1}function Ii(e,n){const o=t.rows.find(d=>d.id===n);if(!o||!(o.videoNth>=0))return;const a=String(_("dock:current-type")||""),r=Ln(e,a),i=!r.has(o.videoNth);i?r.add(o.videoNth):r.delete(o.videoNth);const l=String(_("dock:current-uid")||"");Jo(e,a,r),ce({source:Q,type:J.SVE_VIDEO_HOLD,uid:l,uids:l?rt(l,e.document):[],nth:o.videoNth,on:i},e),I(e)}function Oi(e,n){const o=new Map;let a=0;const r=i=>{for(const l of i){if(l.hidden)continue;const d=l.kind?null:Ya(n.slice(l.from,l.openTo));d!==null&&o.set(l.id,{nth:a++,booleans:Xa(d)}),r(l.children||[])}};return r(e),o}function Ri(e,n,o){const a=t.rows.find(i=>i.id===o);if(!a||!(a.alpineNth>=0))return;if(a.alpineKeys.length===1){gn(e,a,a.alpineKeys[0]);return}const r=n.currentTarget.getBoundingClientRect();W(),ae=Fe(e.document,Ae,{items:a.alpineKeys.map(i=>({label:i.key,icon:i.value?to:no,onPick:()=>{W(),gn(e,a,i)}})),x:Math.round(r.left),y:Math.round(r.bottom+4),onClose:()=>{ae=null}})}function gn(e,n,o){const a=String(_("dock:current-type")||""),r=En(e,a),i=!o.value,l=i!==o.file,d={...r[n.alpineNth]||{}};l?d[o.key]=i:delete d[o.key],Object.keys(d).length?r[n.alpineNth]=d:delete r[n.alpineNth];const k=sa(String(_("dock:chrome-kind")||"")),m=k?"":String(_("dock:current-uid")||"");ra(e,a,r),ce({source:Q,type:J.SVE_ALPINE_STATE,uid:m,uids:m?rt(m,e.document):[],chrome:k,nth:n.alpineNth,key:o.key,value:i,on:l},e),I(e)}function Xt(e,n){return!n||!(n.locked||n.lockedIn)?!1:(e.Statamic?.$toast?.error(v(e,"html_tree_locked_element")),!0)}function Qn(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function Di(e,n){const o=t.rows.find(a=>a.id===n);if(!(!o||o.lockedIn||_("dock:is-locked"))){if(!o.locked){xe(e,n,Ca,{lockAction:!0});return}if(!Qn(e)){e.Statamic?.$toast?.error(v(e,"html_tree_unlock_denied"));return}Vt(e,{titleKey:"html_tree_unlock_title",bodyKey:"html_tree_unlock_body",confirmKey:"html_tree_unlock_confirm"},()=>xe(e,n,La,{lockAction:!0,unlock:!0}))}}function Gt(e){return!!t.rows.find(n=>n.id===e)?.fixed}function Fi(e,n){Gt(n)||xe(e,n,Ea)}function Ai(e,n){if(Gt(n))return;const o=t.rows.find(a=>a.id===n)?.sectionRoot;if(o){e.postMessage({source:Q,type:J.DUPLICATE_ROW,uid:o},e.location.origin);return}xe(e,n,Ha)}function eo(e,n){Vt(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const o=e.document;ia({uid:n},o,e)})}function Bi(e,n,o){Z===o&&(e.clearTimeout(_e),Z="",j=""),D=null,de=!1,Et="";const a=Be(e,n),r=a.find(i=>i.uid!==o)||a[0];r?dt(e,n,a,r.uid,""):(j="",t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,I(e)),e.setTimeout(()=>{Y(e.document)&&I(e)},0)}Pn("row:removed",({uid:e,parentPath:n,doc:o,win:a})=>{n!==at(a)||!Y(a.document)||Bi(a,o,e)});function Ni(e,n){if(Gt(n))return;const o=t.sections?.find(r=>r.row?.id===n),a=o?o.row?.section||o.uid:t.rows.find(r=>r.id===n)?.sectionRoot;if(a){eo(e,a);return}if(t.rows.find(r=>r.id===n)?.kind==="sections"){Vt(e,{titleKey:"html_tree_sections_remove_title",bodyKey:"html_tree_sections_remove_body",confirmKey:"html_tree_sections_remove_confirm"},()=>xe(e,n,dn));return}xe(e,n,dn)}function xe(e,n,o,{lockAction:a=!1,unlock:r=!1}={}){if(_("dock:is-locked"))return;const i=z(),l=t.rows.find(k=>k.id===n);if(!l||!a&&Xt(e,l))return;const d=o(i,l);d!==i&&we(d,{unlock:r})}function W(){ae?.dismiss(),ae=null}const to='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',no='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>';function oo(e,n){const o=t.sections?.find(k=>k.uid===n),a=o?.type||"";if(!a||!xn(e))return[];const r=o.label||a,i=Do(e,a),l=()=>e.Statamic?.$toast?.error(v(e,"section_update_failed")),d=[{label:v(e,"static_section_insertable"),icon:i?no:to,onPick:()=>{W(),an(e,{handle:a,hidden:!i}).then(()=>{e.Statamic?.$toast?.success(v(e,i?"section_shown_to_editors":"section_hidden_from_editors",{name:r})),sn(e)}).catch(l)}}];return o.static&&d.push({label:v(e,"section_add_fields"),onPick:()=>{W(),an(e,{handle:a,fields:!0}).then(()=>{e.Statamic?.$toast?.success(v(e,"section_fields_added",{name:r})),sn(e),I(e),wn(e,a)}).catch(l)}}),d}function Ki(e,n,o){const a=o.row?.section||o.uid;a&&(ae=Fe(e.document,Ae,{items:[...oo(e,a),{label:v(e,"html_tree_remove_section"),danger:!0,onPick:()=>{W(),eo(e,a)}}],x:n.clientX,y:n.clientY,onClose:()=>{ae=null}}))}function Vi(e,n,o){W();const a=t.sections?.find(d=>d.row?.id===o);if(a){Ki(e,n,a);return}const r=t.rows.find(d=>d.id===o);if(!r)return;ot(e,o,t.rows);const i={x:n.clientX,y:n.clientY},l=d=>{d.length&&(ae?.dismiss(),ae=Fe(e.document,Ae,{items:d,x:i.x,y:i.y,onClose:()=>{ae=null}}))};if(r.frameCall){l([{label:v(e,"html_tree_frame_edit",{frame:v(e,`chrome_${r.frameCall}`)}),onPick:()=>{W(),Dt(e,r.frameCall)}}]);return}if(r.kind==="component"){ji(e,r,l);return}r.kind==="slot"||r.kind==="sections"||r.locked||r.lockedIn||t.canEdit&&(r.componentRoot||l([...r.sectionRoot?oo(e,r.sectionRoot):[],{label:v(e,"component_make"),onPick:()=>{W(),va(e,r,{onDone:()=>I(e),onError:d=>{e.alert(d?.status===409?v(e,"component_exists"):v(e,"component_failed"))}})}}]))}const kn=(e,n)=>{W(),_("dock:open-template",n)};function ji(e,n,o){if(!Ia(n.src)){o([{label:v(e,"component_open_named",{name:Oa(n.src)||n.src}),onPick:()=>kn(e,`view:partials/${n.src}`)}]);return}o([{label:v(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(n.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(a=>a.ok?a.json():{items:[]}).then(a=>{const r=Array.isArray(a.items)?a.items:[];o(r.length?r.map(i=>({label:v(e,"component_open_named",{name:i.label}),onPick:()=>kn(e,i.type)})):[{label:v(e,"component_none"),onPick:null}])}).catch(()=>o([{label:v(e,"component_none"),onPick:null}]))}function Ui(e,n,o){if(n.button!==0||_("dock:is-locked")||t.editingId)return;const a=t.rows.find(l=>l.id===o);if(a&&(a.locked||a.lockedIn)||n.target?.closest?.("button, input"))return;Ne(),fe=o,Me={x:n.clientX,y:n.clientY},Ze=n.currentTarget,Je=n.pointerId;const r=l=>qi(e,l),i=l=>Yi(e,l);Mt=()=>{e.document.removeEventListener("pointermove",r,!0),e.document.removeEventListener("pointerup",i,!0),e.document.removeEventListener("pointercancel",i,!0),Mt=null},e.document.addEventListener("pointermove",r,!0),e.document.addEventListener("pointerup",i,!0),e.document.addEventListener("pointercancel",i,!0)}function qi(e,n){if(!fe||!Me)return;const o=n.clientX-Me.x,a=n.clientY-Me.y;if(!t.dragging&&o*o+a*a<25)return;if(!t.dragging){t.dragging=!0;try{Ze?.setPointerCapture?.(Je)}catch{}}n.preventDefault();const r=e.document.elementFromPoint(n.clientX,n.clientY),i=r?.closest?.("[data-sve-ht-slot]");if(i){const c=i.getAttribute("data-sve-ht-id");if(c&&c!==fe){t.dropId=c,t.dropPlace="inside";return}}const l=r?.closest?.("[data-sve-ht-row]"),d=l?.getAttribute("data-sve-ht-id");if(!d||d===fe){t.dropId=null,t.dropPlace=null;return}const k=t.rows.find(c=>c.id===d),m=t.rows.find(c=>c.id===fe);if(!k||k.lockedIn||m&&k.path.startsWith(`${m.path}/`)){t.dropId=null,t.dropPlace=null;return}const y=l.getBoundingClientRect();t.dropId=d,t.dropPlace=wa(n.clientY-y.top,y.height,!Fn(k.tag)&&!Dn(k)&&!k.locked)}function Yi(e,n){const o=fe,a=t.dropId,r=t.dropPlace||"after",i=t.dragging;if(Ne(),i&&(me=!0,e.setTimeout(()=>{me=!1},0)),!i||_("dock:is-locked")||!o||!a||o===a)return;n?.preventDefault?.();const l=z(),d=Sa(l,Te,o,a,r);d!==l&&we(d)}function Ne(){try{Ze?.releasePointerCapture?.(Je)}catch{}Mt?.(),fe=null,Me=null,Ze=null,Je=null,t.dragging=!1,t.dropId=null,t.dropPlace=null}function zi(e,n,o){if(n.button!==0||!o||t.editingId||n.target?.closest?.("button, input"))return;ao(),Re=o,$e={x:n.clientX,y:n.clientY},Qe=n.currentTarget,et=n.pointerId;const a=i=>Xi(e,i),r=i=>Gi(e,i);$t=()=>{e.document.removeEventListener("pointermove",a,!0),e.document.removeEventListener("pointerup",r,!0),e.document.removeEventListener("pointercancel",r,!0),$t=null},e.document.addEventListener("pointermove",a,!0),e.document.addEventListener("pointerup",r,!0),e.document.addEventListener("pointercancel",r,!0)}function Xi(e,n){if(!Re||!$e)return;const o=n.clientX-$e.x,a=n.clientY-$e.y;if(!t.dragging&&o*o+a*a<25)return;if(!t.dragging){t.dragging=!0;try{Qe?.setPointerCapture?.(et)}catch{}}n.preventDefault();const i=e.document.elementFromPoint(n.clientX,n.clientY)?.closest?.("[data-sve-ht-sec-uid]"),l=i?.getAttribute("data-sve-ht-sec-uid")||"";if(!l||l===Re){t.sectionDrop=null;return}const d=i.getBoundingClientRect();t.sectionDrop={uid:l,place:n.clientY-d.top<d.height/2?"before":"after"}}function Gi(e,n){const o=Re,a=t.sectionDrop,r=t.dragging;ao(),r&&(me=!0,e.setTimeout(()=>{me=!1},0)),!(!r||!o||!a?.uid||a.uid===o)&&(n?.preventDefault?.(),Wi(e,o,a.uid,a.place))}function ao(){try{Qe?.releasePointerCapture?.(et)}catch{}$t?.(),Re=null,$e=null,Qe=null,et=null,t.dragging=!1,t.sectionDrop=null}function Wi(e,n,o,a){const r=at(e)||"page_sections";for(const i of Bt(e.document)||[]){const l=Nt(i.values),d=l&&typeof l=="object"?l[r]:null;if(!Array.isArray(d))continue;const k=C=>d.findIndex(S=>S&&typeof S=="object"&&[S._visual_id,S.id,S._id].includes(C)),m=k(n),y=k(o);if(m===-1||y===-1||m===y)return!1;let c=a==="before"?y:y+1;return m<c&&(c-=1),c===m?!1:(e.postMessage({source:Q,type:J.MOVE,uid:n,toIndex:c},e.location.origin),e.setTimeout(()=>I(e),60),!0)}return!1}function Ft(e,n){if(n?.kind==="component"){Zi(e,n);return}if(G.callOpen&&(G.callOpen=!1,G.callStore=null,q.forget(),Ut(e)),n?.kind!=="antlers"){t.inspect=null;return}const o=n.id;if(n.tag==="else"){t.inspect={key:o,title:v(e,"antlers_condition"),mode:"note",note:v(e,"antlers_else_note")};return}if(n.antlers==="loop"){t.inspect=Ba(e,n,{key:o,draft:pe?.id===n.id?pe.dir:""});return}t.inspect={key:o,title:v(e,"antlers_condition"),mode:"condition",value:n.expr||"",placeholder:v(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:v(e,"antlers_add_elseif")},{id:"else",label:v(e,"antlers_add_else")}]}}function Zi(e,n){if(!ka(e)){t.inspect=null;return}if(!n.src)return;const o=n.id;if(t.inspect={key:o,title:v(e,"component_props_values"),mode:"note",note:v(e,"code_dock_loading")},ya()){const a={},r={},i=new Map;for(const[l,d]of ba(z().slice(n.from,n.to))){const k=Ta(l);k&&(l!==k||!i.has(k))&&i.set(k,d)}for(const[l,d]of i)d.bound?r[l]=d.value:a[l]=d.value;pn!==o&&(pn=o,Oe.clear());for(const l of Oe)l in r||(r[l]="");t.inspect=null,G.callOpen=!0,G.title=G.title||v(e,"component_props"),G.callTitle=n.klass||n.name||n.src,G.callStore=q.ui,q.ui.canBind=!0,q.ui.dataTitle=v(e,"data_vars_title"),q.ui.exprPlaceholder=v(e,"component_props_expr"),q.ui.onToggleBind=(l,d)=>Qi(e,l,d),q.ui.onExpr=(l,d)=>yn(e,l,d),q.ui.onPickData=(l,d)=>_("dock:data-menu",{anchor:d,at:n.from,onPick:k=>yn(e,l,String(k?.var||"").trim())}),q.load(e,{key:`${n.src}::${o}`,src:n.src,params:a,bindings:r,readOnly:_("dock:is-locked")===!0}),q.watch(e,{src:n.src,write:l=>Ji(e,l,r)}),Ut(e);return}_a(e,n.src).then(a=>{if(t.inspect?.key===o){if(!a.length){t.inspect={key:o,title:v(e,"component_props_values"),mode:"note",note:v(e,"component_props_values_none")};return}t.inspect={key:o,title:v(e,"component_props_values"),mode:"props",inheritLabel:v(e,"component_props_inherit"),rows:xa(a,z().slice(n.from,n.to))}}})}function Ji(e,n,o={}){const a=t.rows.find(l=>l.id===D);if(a?.kind!=="component"||_("dock:is-locked"))return;let r=z(),i=a.to;for(const[l,d]of Object.entries(n||{})){if(l in o)continue;const k=r.length,m=qt(r,{from:a.from,to:i},l,d);m!==r&&(i+=m.length-k,r=m)}r!==z()&&(we(r,{save:!0}),I(e))}function Qi(e,n,o){o?Oe.add(n):Oe.delete(n),so(e,n,"",o),I(e)}function yn(e,n,o){Oe.add(n),so(e,n,o,!0),I(e)}function so(e,n,o,a){const r=t.rows.find(d=>d.id===D);if(r?.kind!=="component"||_("dock:is-locked"))return;const i=z(),l=qt(i,r,n,o,{bound:a});l!==i&&we(l,{save:!0})}function nt(){const e=t.rows.find(n=>n.id===D);return e?.kind==="antlers"&&!_("dock:is-locked")?e:null}function ne(e,n){const o=nt();if(!o)return;const a=z(),r=n(a,o);r!==a&&(we(r),I(e))}function bn(e,n,o,a){const r=t.rows.find(d=>d.id===D);if(r?.kind!=="component"||_("dock:is-locked"))return;const i=z(),l=qt(i,r,n,o,{bound:a});l!==i&&(we(l,{save:!0}),I(e))}function el(e,n){ne(e,(o,a)=>a.antlers==="loop"?Ua(a,n)(o,a):Pa(o,a,n))}function tl(e,n){const o=nt();if(!o||o.antlers!=="loop")return;const a=Aa(e,o,n);a&&ne(e,a)}function nl(e,n){ne(e,(o,a)=>Ma(o,a,n))}function ol(e,n){if(!e||!n||Dn(n)||Fn(n.tag))return null;const o=ga(e,n);if(o<n.openTo)return null;const a=e.lastIndexOf(`
`,o-1)+1;return e.slice(a,o).trim()===""&&a>n.openTo?a-1:o}function ot(e,n,o){if(me)return;const a=(o||t.rows).find(r=>r.id===n);a&&(D=n,t.rows.forEach(r=>{r.current=r.id===n}),Ft(e,a),!Yt()&&(_("dock:reveal-html",{from:a.from,to:a.to,caret:ol(z(),a)}),_("dock:tw-follow"),ce({source:Q,type:J.SVE_HTML_PICK_FOCUS,path:a.path},e)))}function al(e,n){if(!n)return"";const o=[],a=(r,i)=>{for(const l of r||[]){const d=i||l.path===e;l.kind==="component"&&l.src===n&&o.push({path:l.path,inside:d}),a(l.children,d)}};return a(Te,!1),(o.find(r=>r.inside)||o[0])?.path||""}function sl(e,n){if(!n||!Y(e.document))return;de=!1,Ue(n),I(e);const o=t.rows.find(a=>a.path===n);o&&(ot(e,o.id,t.rows),e.setTimeout(()=>{Y(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function At(e){if(Xe)return;const n=()=>{t.editingId||t.dragging||(e.clearTimeout(We),We=e.setTimeout(()=>{Y(e.document)&&I(e)},80))},o=()=>{if(n(),_("dock:on-empty-page")===!0){const a=Be(e,e.document);a.length===1&&dt(e,e.document,a,a[0].uid,"")}};Xe=Pn("dock:html-changed",n),e.document.addEventListener("sve-page-structure",o),Pt=()=>{e.document.removeEventListener("sve-page-structure",o)}}function rl(e){Xe?.(),Xe=null,Pt?.(),Pt=null,e?.clearTimeout?.(We),We=0}function Wt(e){const n=Y(e.document);if(ce({source:Q,type:J.SVE_HTML_PICK,on:!1},e),rl(e),q.forget(),G.callOpen=!1,G.callStore=null,Ut(e),Ne(),W(),ua(e),D=null,t.inspect=null,t.editingId=null,t.draft="",t.sections=[],t.pageBuilder=!1,t.layoutFile=!1,Z="",e?.clearTimeout?.(_e),!n){Ct(e);return}n.remove(),Kt.headerTab==="html_tree"&&Vo(e,null),jo(e),Sn(e),Cn(e),Ct(e)}function _l(e,n){n.querySelector("[data-sve-html-tree-list]")||(n.id=qe,He(n,An,{title:v(e,"html_tree")}),n.querySelector("[data-sve-close]")?.addEventListener("click",()=>Wt(e)))}function xl(e){At(e),I(e)}function ro(e){const n=e.document;if(!_o(e,"html_tree"))return;if(Y(n)){At(e),I(e);return}if(!zn(n))return;de=!0,V.clear(),Uo(e,[qe]);const o=n.createElement("div");o.id=qe,o.style.cssText=qo,He(o,An,{title:v(e,"html_tree")}),o.querySelector("[data-sve-close]")?.addEventListener("click",()=>Wt(e)),Yo(e,o),Sn(e),Cn(e),Ct(e),At(e),I(e)}function wl(e){if(Y(e.document)){Wt(e);return}ro(e)}jt("html-tree:open-section",e=>{const n=window,o=n.document,a=Be(n,o),r=a.find(i=>i.uid===e||i.ids.includes(e));return r?(dt(n,o,a,r.uid,""),{uid:r.uid,ids:r.ids}):null});jt("html-tree:from-preview",({path:e,src:n,uid:o}={})=>{if(!On(window,e)){if(!e){il(window,o);return}sl(window,al(e,n)||e)}});function il(e,n){!n||!de||!Y(e.document)||!Be(e,e.document).some(a=>a.uid===n||a.ids.includes(n))||(de=!1,V.clear(),D=null,I(e))}jt("html-tree:arm-pick",e=>{const n=window;return e?(Jn(n,lt(z(),Un(n))),!0):(Y(n.document)||ce({source:Q,type:J.SVE_HTML_PICK,on:!1},n),!0)});function Sl(){ve.clear(),Pe.clear(),Ht.clear(),ze.clear(),De.length=0}export{fi as HTML_TREE_STYLE_ID,Tl as armHtmlTreePrefetch,Sl as clearHtmlTreeTemplates,W as closeHtmlTreeMenu,Wt as closeHtmlTreePanel,yi as ensureHtmlTreeStyles,_l as fillHtmlTreePane,D as htmlTreeActiveId,Y as htmlTreePanel,We as htmlTreeTimer,Xe as htmlTreeUnhook,ro as openHtmlTreePanel,I as renderHtmlTree,xl as showHtmlTreePane,rl as stopWatchHtmlTreeDock,wl as toggleHtmlTreePanel,At as watchHtmlTreeDock};
