import{r as qe,R as go,u as s,o as h,c as v,a as M,t as E,F as R,i as A,m as Sn,f as w,n as ko,w as T,$ as oe,s as f,e as yo,L as U,N as bo,ab as _o,a4 as To,ae as xe,j as Et,ad as xo,Z as ce,aD as wo,v as ln,A as So,V as Co,aB as Lo,W as Cn,aE as Ho,B as lt,p as jt,q as Ut,U as Oe,X as Eo,aF as Po,aG as $o}from"./addon-DbI5ZvGN.js";import{c as Ln,a as Mo,o as Io,b as Do,d as Ro,T as Oo,i as Fo,r as Ao,e as Bo,f as No,u as dn,l as cn}from"./section-create-DijN8E2R.js";import{canEditFields as Ko,currentSetHandle as Vo,openFieldsetOverlay as Hn,openGlobalFieldsOverlay as jo}from"./section-fields-b487Y9U-.js";import{ap as t,aq as Uo,ar as qo,b as x,s as qt,i as he,Z as Pt,ad as Yo,U as zo,ab as En,ac as Pn,O as un,q as Me,Y as Go,V as Xo,W as Wo,as as Zo,at as hn,au as $n,av as Mn,n as In,aw as Jo,ax as Qo,o as Dn,ay as ea,C as Rn,a0 as dt,t as ct,az as On,aA as ta,aB as Yt,aC as na,aD as oa,aE as aa,a6 as sa,aF as ra,aG as ia,aH as la,aI as da,aJ as ca,u as Fn,a8 as ua,N as zt}from"./lp-cluster-CnVKmYDk.js";import{H as Ge,e as ha,a as pa}from"./ids-w-uWXFhx.js";import{_ as ut,o as Ne}from"./ChoiceDialog-DjlDZjej.js";import{M as Q,S as ee}from"./protocol-tRwnpd8X.js";import{C as X,D as fa,E as Ke,F as Gt,o as va,A as ma,G as An,l as ga,I as Bn,H as we,J as ka,K as ya,L as Xt,c as ba,M as _a,b as Ta,N as xa,O as wa,P as Sa,Q as Ca,R as La,S as Ha,T as Ea,U as _e,V as Pa,W as $a,X as Ma,Y as Ia,Z as pn,$ as Ye,a0 as Da,a1 as Ra}from"./component-extract-CxCcy3KP.js";import{w as ht,l as Oa,N as Xe,J as Nn,K as Kn,L as Fa,M as Aa}from"./css-scope-BpRgAt-g.js";import{b as Ba}from"./html-pick-align-CLq5l-p4.js";import"./FieldsetOverlay-DX_J2Phk.js";import"./ai-text-icon-B7uCWIwa.js";const yt=/\s*([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/y,Na=/^\s*(?:([A-Za-z_$][\w$]*)|'([^'\\]*)'|"([^"\\]*)")\s*:\s*(true|false)\s*$/;function Ka(e){const n=String(e||"").replace(/\{\{[\s\S]*?\}\}/g,r=>" ".repeat(r.length)),o=n.match(/^<[a-zA-Z][\w:-]*/);if(!o)return null;let a=o[0].length;for(;a<n.length;){yt.lastIndex=a;const r=yt.exec(n);if(!r){a+=1;continue}if(r[1].toLowerCase()==="x-data")return r[2]??r[3]??r[4]??"";a=yt.lastIndex}return null}function Va(e,n){const o=e[n];for(let a=n+1;a<e.length;a+=1)if(e[a]==="\\")a+=1;else if(e[a]===o)return a;return e.length-1}function ja(e){const n=String(e||""),o=n.search(/\S/);if(o===-1||n[o]!=="{")return[];const a=new Map;let r=0,i="";const l=()=>{const d=i.match(Na);d&&a.set(d[1]??d[2]??d[3],d[4]==="true"),i=""};for(let d=o;d<n.length;d+=1){const k=n[d];if(k==='"'||k==="'"||k==="`"){const m=Va(n,d);i+=n.slice(d,m+1),d=m;continue}if(k==="/"&&n[d+1]==="/"){const m=n.indexOf(`
`,d);d=m===-1?n.length:m-1;continue}if(k==="/"&&n[d+1]==="*"){const m=n.indexOf("*/",d+2);d=m===-1?n.length:m+1;continue}if(k==="{"||k==="["||k==="("){if(r+=1,r===1)continue}else if(k==="}"||k==="]"||k===")"){if(r-=1,r===0)break}else if(k===","&&r===1){l();continue}i+=k}return l(),[...a].map(([d,k])=>({key:d,value:k}))}const Ua={key:0,class:"sve-ht-inspect"},qa={class:"sve-ht-inspect__head"},Ya={key:0,class:"sve-ht-inspect__note"},za={key:2,class:"sve-ht-inspect__props"},Ga={class:"sve-ht-inspect__proplabel"},Xa={key:0},Wa=["value","disabled","onChange"],Za={value:""},Ja=["value"],Qa=["value"],es=["value","placeholder","onChange"],ts=["title","disabled","onClick"],ns=["title","disabled","onClick"],os={key:0,class:"sve-ht-inspect__seg"},as=["data-active","disabled","onClick"],ss=["value","disabled"],rs={key:0,value:""},is=["value"],ls=["value","disabled"],ds=["value"],cs={key:3,class:"sve-ht-inspect__box"},us=["value","placeholder","disabled","onKeydown"],hs=["title","disabled"],ps={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},fs=["value","disabled"],vs=["value"],ms={key:0,class:"sve-ht-inspect__tick"},gs=["checked","disabled"],ks={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},ys=["value","disabled"],bs=["value"],_s={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},Ts=["value","placeholder","disabled"],xs=["title","disabled"],ws={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Ss=["value","placeholder","disabled"],Cs={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Ls=["value","placeholder","disabled"],Hs={key:6,class:"sve-ht-inspect__add"},Es=["disabled","onClick"],bt='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',Ps='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',$s={__name:"HtmlTreeInspector",setup(e){const n=qe(null);go(n,m=>t.onPropHost?.(m||null));const o=qe(null),a=qe(null);function r(m){t.onInspectCommit?.(m.target.value)}function i(m,y,c){!m||!y||(m.value=y,m.focus(),m.setSelectionRange(y.length,y.length),c(y))}function l(m,y){t.onInspectData?.(m.currentTarget,c=>t.onPropValue?.(y.handle,c,!0))}function d(m){t.onInspectData?.(m.currentTarget,y=>i(o.value,y,c=>t.onInspectCommit?.(c)))}function k(m){t.onInspectData?.(m.currentTarget,y=>i(a.value,y,c=>t.onLoopSortField?.(c)))}return(m,y)=>s(t).inspect?(h(),v("div",Ua,[M("div",qa,E(s(t).inspect.title),1),s(t).inspect.mode==="note"?(h(),v("div",Ya,E(s(t).inspect.note),1)):s(t).inspect.mode==="statamic"?(h(),v("div",{key:1,ref_key:"propHost",ref:n,class:"sve-ht-inspect__form"},null,512)):s(t).inspect.mode==="props"?(h(),v("div",za,[(h(!0),v(R,null,A(s(t).inspect.rows,c=>(h(),v("label",{key:c.handle,class:"sve-ht-inspect__prop"},[M("span",Ga,[Sn(E(c.label)+" ",1),c.bound?(h(),v("em",Xa,":")):w("",!0)]),M("span",{class:ko(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":c.type==="select"||c.type==="link"}])},[c.type==="select"&&!c.bound?(h(),v("select",{key:0,value:c.value,disabled:!s(t).canEdit,onChange:C=>s(t).onPropValue?.(c.handle,C.target.value,!1)},[M("option",Za,E(c.placeholder||s(t).inspect.inheritLabel),1),c.value&&!c.options.includes(c.value)?(h(),v("option",{key:0,value:c.value},E(c.value),9,Ja)):w("",!0),(h(!0),v(R,null,A(c.options,C=>(h(),v("option",{key:C,value:C},E(C),9,Qa))),128))],40,Wa)):(h(),v("input",{key:1,type:"text",value:c.value,placeholder:c.placeholder||s(t).inspect.inheritLabel,onChange:C=>s(t).onPropValue?.(c.handle,C.target.value,c.bound)},null,40,es)),c.type==="link"?(h(),v("button",{key:2,type:"button","data-sve-ht-data":"",title:s(t).pageTitle,disabled:!s(t).canEdit,onClick:C=>s(t).onPropPage?.(C.currentTarget,c.handle),innerHTML:Ps},null,8,ts)):w("",!0),M("button",{type:"button","data-sve-ht-data":"",title:s(t).dataTitle,disabled:!s(t).canEdit,onClick:C=>l(C,c),innerHTML:bt},null,8,ns)],2)]))),128))])):(h(),v(R,{key:3},[s(t).inspect.mode==="loop"?(h(),v("div",os,[(h(!0),v(R,null,A(s(t).inspect.kinds,c=>(h(),v("button",{key:c.id,type:"button","data-active":c.id===s(t).inspect.loopKind?"":void 0,disabled:!s(t).canEdit,onClick:C=>s(t).onLoopKind?.(c.id)},E(c.label),9,as))),128))])):w("",!0),s(t).inspect.mode==="loop"&&s(t).inspect.loopKind==="collection"?(h(),v("select",{key:s(t).inspect.key+":"+s(t).inspect.value,value:s(t).inspect.value,disabled:!s(t).canEdit,onChange:r},[s(t).inspect.value?w("",!0):(h(),v("option",rs,E(s(t).inspect.placeholder),1)),(h(!0),v(R,null,A(s(t).inspect.collections,c=>(h(),v("option",{key:c.handle,value:c.handle},E(c.title),9,is))),128))],40,ss)):s(t).inspect.mode==="loop"&&s(t).inspect.loopKind==="nav"?(h(),v("select",{key:s(t).inspect.key+":nav:"+s(t).inspect.value,value:s(t).inspect.value,disabled:!s(t).canEdit,onChange:r},[(h(!0),v(R,null,A(s(t).inspect.navs,c=>(h(),v("option",{key:c.handle,value:c.handle},E(c.title),9,ds))),128))],40,ls)):(h(),v("div",cs,[(h(),v("input",{ref_key:"field",ref:o,key:s(t).inspect.key,type:"text",value:s(t).inspect.value,placeholder:s(t).inspect.placeholder,disabled:!s(t).canEdit,spellcheck:"false",onKeydown:[y[0]||(y[0]=T(()=>{},["stop"])),oe(T(r,["prevent"]),["enter"])],onBlur:r},null,40,us)),M("button",{type:"button","data-sve-ht-data":"",title:s(t).dataTitle,disabled:!s(t).canEdit,innerHTML:bt,onMousedown:y[1]||(y[1]=T(()=>{},["prevent"])),onClick:T(d,["stop","prevent"])},null,40,hs)])),s(t).inspect.nav?(h(),v(R,{key:4},[M("div",ps,E(s(t).inspect.nav.depthTitle),1),(h(),v("select",{key:s(t).inspect.key+":depth:"+s(t).inspect.nav.depth,value:s(t).inspect.nav.depth,disabled:!s(t).canEdit,onChange:y[2]||(y[2]=c=>s(t).onLoopDepth?.(c.target.value))},[(h(!0),v(R,null,A(s(t).inspect.nav.depths,c=>(h(),v("option",{key:c.id,value:c.id},E(c.label),9,vs))),128))],40,fs)),s(t).inspect.nav.homeAsked?(h(),v("label",ms,[M("input",{type:"checkbox",checked:s(t).inspect.nav.includeHome,disabled:!s(t).canEdit,onChange:y[3]||(y[3]=c=>s(t).onLoopIncludeHome?.(c.target.checked))},null,40,gs),M("span",null,E(s(t).inspect.nav.homeLabel),1)])):w("",!0)],64)):w("",!0),s(t).inspect.sort?(h(),v(R,{key:5},[M("div",ks,E(s(t).inspect.sort.title),1),(h(),v("select",{key:s(t).inspect.key+":dir:"+s(t).inspect.sort.dir,value:s(t).inspect.sort.dir,disabled:!s(t).canEdit,onChange:y[4]||(y[4]=c=>s(t).onLoopSortDir?.(c.target.value))},[(h(!0),v(R,null,A(s(t).inspect.sort.dirs,c=>(h(),v("option",{key:c.id,value:c.id},E(c.label),9,bs))),128))],40,ys)),s(t).inspect.sort.needsField?(h(),v("div",_s,[(h(),v("input",{ref_key:"sortField",ref:a,key:s(t).inspect.key+":field",type:"text",value:s(t).inspect.sort.field,placeholder:s(t).inspect.sort.placeholder,disabled:!s(t).canEdit,spellcheck:"false",onKeydown:[y[5]||(y[5]=T(()=>{},["stop"])),y[6]||(y[6]=oe(T(c=>s(t).onLoopSortField?.(c.target.value),["prevent"]),["enter"]))],onBlur:y[7]||(y[7]=c=>s(t).onLoopSortField?.(c.target.value))},null,40,Ts)),s(t).inspect.sort.pickable?(h(),v("button",{key:0,type:"button","data-sve-ht-data":"",title:s(t).dataTitle,disabled:!s(t).canEdit,innerHTML:bt,onMousedown:y[8]||(y[8]=T(()=>{},["prevent"])),onClick:T(k,["stop","prevent"])},null,40,xs)):w("",!0)])):w("",!0),M("div",ws,E(s(t).inspect.limit.title),1),(h(),v("input",{key:s(t).inspect.key+":limit",type:"number",min:"1",value:s(t).inspect.limit.value,placeholder:s(t).inspect.limit.placeholder,disabled:!s(t).canEdit,onKeydown:[y[9]||(y[9]=T(()=>{},["stop"])),y[10]||(y[10]=oe(T(c=>s(t).onLoopLimit?.(c.target.value),["prevent"]),["enter"]))],onBlur:y[11]||(y[11]=c=>s(t).onLoopLimit?.(c.target.value))},null,40,Ss)),M("div",Cs,E(s(t).inspect.offset.title),1),(h(),v("input",{key:s(t).inspect.key+":offset",type:"number",min:"0",value:s(t).inspect.offset.value,placeholder:s(t).inspect.offset.placeholder,disabled:!s(t).canEdit,onKeydown:[y[12]||(y[12]=T(()=>{},["stop"])),y[13]||(y[13]=oe(T(c=>s(t).onLoopOffset?.(c.target.value),["prevent"]),["enter"]))],onBlur:y[14]||(y[14]=c=>s(t).onLoopOffset?.(c.target.value))},null,40,Ls))],64)):w("",!0),s(t).inspect.branches?.length?(h(),v("div",Hs,[(h(!0),v(R,null,A(s(t).inspect.branches,c=>(h(),v("button",{key:c.id,type:"button",disabled:!s(t).canEdit,onClick:C=>s(t).onAddBranch?.(c.id)},E(c.label),9,Es))),128))])):w("",!0)],64))])):w("",!0)}},Ms=ut($s,[["__scopeId","data-v-7ecb01a5"]]),Is={class:"sve-html-tree"},Ds={class:"sve-pane-bar","data-sve-pane-bar":""},Rs={"data-sve-right-title":""},Os={"data-sve-right-actions":""},Fs=["aria-pressed","title","aria-label"],As=["title"],Bs={class:"sve-ht-used-by__label"},Ns={class:"sve-ht-used-by__chips"},Ks=["title","onClick"],Vs={key:1,class:"sve-ht-used-by__chip"},js={key:0,class:"sve-ht-used-by__empty"},Us={class:"sve-ht-tools"},qs=["title"],Ys=["placeholder","aria-label","value"],zs=["aria-label"],Gs=["title","aria-label"],Xs=["title","aria-label"],Ws={key:2,class:"sve-tree-exit"},Zs=["title"],Js=["title"],Qs='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',er='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',tr='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',nr='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',or='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/></svg>',ar='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',sr={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const n=f(window,"html_tree_search");t.layers=Uo(window);const o=f(window,"html_tree_layers_on"),a=f(window,"html_tree_layers_off");function r(){qo(window,!t.layers)}const i=Ln(window),l=f(window,"section_new"),d=f(window,"html_tree_add_element"),k=f(window,"html_tree_sections_slot"),m=f(window,"html_tree_sections_no_field");function y(){const b=t.templateSections.length?t.templateSections:[_o(window)],L=new Set(t.rows.filter($=>$.kind==="sections").map($=>$.tag));return b.filter($=>!L.has($)).map($=>({tag:`sections:${$}`,label:b.length>1?`${k} · ${$}`:k,noField:!t.templateSections.length}))}const c=qe(!1),C=f(window,"section_import");function S(){c.value=!1}async function F(b){if(!b)return;await To(),t.onRefresh?.();const L=x("html-tree:open-section",b);L&&Ao(window,L.ids)}function H(){const b=t.rows.find(L=>L.current&&!L.context&&!L.synthetic)||null;return b?.lockedIn?t.rows.filter(L=>L.locked&&L.from<=b.from&&L.to>=b.to).sort((L,$)=>L.from-$.from)[0]||null:b}function te(b){const L=b.getBoundingClientRect(),$=H();let D=null;const K=(B,Ee,se="")=>()=>{D?.dismiss(),D=null,S();const ft=Fo(window,B,$,Ee);ft!==null&&(t.selectFrom={at:ft,left:4},se&&window.Statamic?.$toast?.info?.(se))};D=Ne(document,Ke,{items:[...Oo.map(B=>({label:B,onPick:K(B,`<${B}>`)})),...y().map(B=>({label:B.label,onPick:K(B.tag,B.label,B.noField?m:"")}))],x:Math.round(L.left),y:Math.round(L.bottom+4),onClose:()=>{D=null,S()}})}function ne(b){if(!c.value){if(c.value=!0,!(t.sections.length||t.pageBuilder)){te(b.currentTarget);return}(async()=>{const L=await Mo(window);if(!L){S();return}const $=t.sections.length?t.sections[t.sections.length-1].uid:null,D=K=>{S(),F(K?.uid)};if(L==="static"){Io(window,{afterUid:$,onDone:D,onError:S,onClose:S});return}Do(window,{afterUid:$,onDone:D,onError:S,onClose:S})})()}}function g(){if(c.value)return;c.value=!0;const b=!!(t.sections.length||t.pageBuilder);Ro(window,{intoTemplate:!b,after:b?null:H(),afterUid:b&&t.sections.length?t.sections[t.sections.length-1].uid:null,onDone:L=>{if(S(),b){F(L?.uid);return}Number.isInteger(L?.at)&&(t.selectFrom={at:L.at,left:4})},onError:S,onClose:S})}function p(b){const L=!!t.query;t.query=b,L!==!!b&&t.onQuery?.()}return(b,L)=>(h(),v("div",Is,[M("div",Ds,[M("div",Rs,E(e.title),1),M("div",Os,[M("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":s(t).layers?"true":"false",title:s(t).layers?s(a):s(o),"aria-label":s(t).layers?s(a):s(o),innerHTML:Qs,onClick:r},null,8,Fs),L[5]||(L[5]=yo('<button type="button" data-sve-right-pin aria-pressed="false" data-v-9a4a7640></button><button type="button" data-sve-close aria-label="Close" data-v-9a4a7640><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-9a4a7640><path d="M18 6 6 18" data-v-9a4a7640></path><path d="m6 6 12 12" data-v-9a4a7640></path></svg></button>',2))])]),s(t).usedBy?(h(),v("div",{key:0,class:"sve-ht-used-by",title:s(t).usedBy.hint||null},[M("span",Bs,[M("span",{class:"sve-ht-used-by__icon","aria-hidden":"true",innerHTML:or}),Sn(" "+E(s(t).usedBy.label),1)]),M("span",Ns,[(h(!0),v(R,null,A(s(t).usedBy.items,$=>(h(),v(R,{key:$.kind+":"+$.name},[$.onOpen?(h(),v("button",{key:0,type:"button",class:"sve-ht-used-by__chip sve-ht-used-by__chip--open",title:$.openLabel,onClick:D=>$.onOpen(D.currentTarget)},E($.name),9,Ks)):(h(),v("span",Vs,E($.name),1))],64))),128)),s(t).usedBy.empty?(h(),v("span",js,E(s(t).usedBy.empty),1)):w("",!0)])],8,As)):w("",!0),M("div",Us,[M("label",{class:"sve-ht-search",title:s(n)},[M("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:nr}),M("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:s(n),"aria-label":s(n),value:s(t).query,autocomplete:"off",spellcheck:"false",onInput:L[0]||(L[0]=$=>p($.target.value)),onKeydown:[L[1]||(L[1]=T(()=>{},["stop"])),L[2]||(L[2]=oe(T($=>p(""),["prevent"]),["escape"]))]},null,40,Ys),s(t).query?(h(),v("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":s(n),innerHTML:ar,onClick:L[3]||(L[3]=$=>p(""))},null,8,zs)):w("",!0)],8,qs),s(i)&&(s(t).sections.length||s(t).pageBuilder||s(t).rows.length&&!s(t).layoutFile)?(h(),v("button",{key:0,type:"button",class:"sve-ht-new",title:s(t).sections.length||s(t).pageBuilder?s(l):s(d),"aria-label":s(t).sections.length||s(t).pageBuilder?s(l):s(d),innerHTML:er,onClick:ne},null,8,Gs)):w("",!0),s(i)&&(s(t).sections.length||s(t).pageBuilder||s(t).rows.length&&!s(t).layoutFile)?(h(),v("button",{key:1,type:"button",class:"sve-ht-import",title:s(C),"aria-label":s(C),innerHTML:tr,onClick:g},null,8,Xs)):w("",!0)]),s(X).inSidebar?w("",!0):(h(),U(fa,{key:1})),L[6]||(L[6]=M("div",{"data-sve-html-tree-list":""},null,-1)),bo(Ms),s(t).exitOpen&&!s(X).inSidebar?(h(),v("div",Ws,[M("span",{class:"sve-tree-exit__name",title:s(t).exitName},E(s(t).exitName),9,Zs),M("button",{type:"button",class:"sve-tree-exit__go",title:s(t).exitTitle,onClick:L[4]||(L[4]=$=>s(t).onExit?.())},E(s(t).exitLabel),9,Js)])):w("",!0)]))}},Vn=ut(sr,[["__scopeId","data-v-9a4a7640"]]);function jn(e){return String(e||"").trim().toLowerCase()}function $t(e,n){return n?[e.name,e.tag,e.klass,e.label,e.src].filter(o=>typeof o=="string"&&o).join(" ").toLowerCase().includes(n):!0}function rr(e,n){const o=jn(n);if(!o)return{rows:e,hits:new Set};const a=new Set;for(const l of e)$t(l,o)&&a.add(l.path);const r=[...a];return{rows:e.filter(l=>a.has(l.path)||r.some(d=>d.startsWith(`${l.path}/`))),hits:a}}const ir=["title"],lr={"data-sve-ht-indent":"","aria-hidden":"true"},dr=["data-sve-ht-cat"],cr={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},ur={key:2,"data-sve-ht-letter":""},hr=["innerHTML"],pr=["title"],fr=["title"],vr={key:1,"data-sve-ht-kind":""},mr={key:3,"data-sve-ht-name":""},gr={key:4,"data-sve-ht-actions":""},kr=["data-on","title","innerHTML"],yr=["title"],br={key:5,"data-sve-ht-actions":""},_r=["data-on","title","innerHTML"],Tr=["data-on","title","innerHTML"],xr=["disabled","title","innerHTML"],wr=["disabled","title"],Sr=["disabled","title"],Cr=["data-on","disabled","title","aria-pressed","innerHTML"],Lr=["disabled","title"],Hr=["data-sve-ht-id"],fn='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',Er='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',Pr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',$r='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',Mr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',Ir='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',Dr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',vn='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6.5" width="20" height="11" rx="5.5"/><circle cx="7.5" cy="12" r="3" fill="currentColor" stroke="none"/></svg>',mn='<svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M7.5 5.5h9a6.5 6.5 0 0 1 0 13h-9a6.5 6.5 0 0 1 0-13ZM16.5 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6Z"/></svg>',Rr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',Or='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-.9"/></svg>',Fr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',Ar={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const n=Ko(window),o=f(window,"section_fields");function a(){const g=Vo();if(!g){window.Statamic?.$toast?.error(f(window,"section_fields_none"));return}Hn(window,g)}function r(g){return g.synthetic?g.frame==="main"?t.frameMainTitle:g.frame==="template"?t.frameTemplateTitle:t.frameOpenTitle:g.kind==="component"?g.src?`partial:${g.src}`:g.tag:g.name?`${g.tag} ${g.name}`:g.tag}function i(g){return!!g.section}function l(g){return!!g.frame}function d(g){return g.kind==="slot"}function k(g,p){l(p)||d(p)||(i(p)?t.onSectionPointerDown?.(g,p.section):p.sectionRoot?t.onSectionPointerDown?.(g,p.sectionRoot):t.onPointerDown?.(g,p.id))}function m(g){if(g.synthetic){t.onFrame?.(g.frame);return}if(i(g)){t.onSection?.(g.section);return}t.onSelect?.(g.id)}function y(g,p){const b={"data-sve-ht-id":g.id};return g.locked&&(b["data-sve-ht-locked"]=""),g.current&&(b["data-sve-ht-current"]=""),g.hidden&&(b["data-sve-ht-hidden"]=""),b["data-sve-ht-cat"]=g.cat||"other",b["data-sve-ht-depth"]=String(g.depth),p&&(b["data-sve-ht-dim"]=""),i(g)&&(b["data-sve-ht-sec"]=""),l(g)&&(b["data-sve-ht-frame"]=g.frame),!i(g)&&t.dropId===g.id&&t.dropPlace&&(b["data-sve-ht-drop"]=t.dropPlace),b}function c(g){return!!g.fixed}function C(g){return g.kind==="sections"}function S(g){return!!(g.locked||g.lockedIn)}function F(g){return!g.lockedIn&&!c(g)}function H(g){return!c(g)&&!C(g)&&!S(g)&&(!g.hidden||g.wrapFrom!=null)}function te(g){return!!g.sectionRoot||!!g.section}function ne(g){return t.canEdit&&!S(g)||te(g)}return(g,p)=>(h(),v(R,null,[M("div",xe({"data-sve-ht-row":""},y(e.row,e.dim),{role:"button",tabindex:"0",title:r(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:p[41]||(p[41]=b=>m(e.row)),onDblclick:p[42]||(p[42]=T(b=>e.row.synthetic?s(t).onFrameEnter?.(e.row.frame):l(e.row)||d(e.row)||i(e.row)?null:s(t).onRename?.(e.row.id),["prevent"])),onKeydown:[p[43]||(p[43]=oe(T(b=>m(e.row),["prevent"]),["enter"])),p[44]||(p[44]=oe(T(b=>m(e.row),["prevent"]),["space"]))],onPointerdown:p[45]||(p[45]=b=>k(b,e.row)),onPointerenter:p[46]||(p[46]=b=>i(e.row)?s(t).onSectionHover?.(e.row.section):null),onContextmenu:p[47]||(p[47]=T(b=>l(e.row)||d(e.row)||i(e.row)?null:s(t).onContext?.(b,e.row.id),["prevent","stop"]))}),[M("span",lr,[(h(!0),v(R,null,A(e.row.guides||[],(b,L)=>(h(),v("i",{key:L,"data-sve-ht-cat":b},null,8,dr))),128))]),e.row.hasChildren||e.row.emptyBlock?(h(),v("button",xe({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?s(t).mainShut:e.row.shut)?{"data-sve-ht-shut":""}:{},{innerHTML:Er,onClick:p[0]||(p[0]=T(b=>e.row.synthetic?s(t).onFrameTwist?.():i(e.row)?s(t).onSection?.(e.row.section):s(t).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:p[1]||(p[1]=T(()=>{},["stop"])),onDblclick:p[2]||(p[2]=T(()=>{},["stop"]))}),null,16)):(h(),v("span",cr)),e.row.letter?(h(),v("span",ur,E(e.row.letter),1)):(h(),v("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,hr)),M("span",{"data-sve-ht-text":"",title:s(t).renameTitle},[!e.row.kind&&!i(e.row)&&!l(e.row)?(h(),v("button",{key:0,type:"button","data-sve-ht-tag":"",title:s(t).tagTitle,onClick:p[3]||(p[3]=T(()=>{},["stop","prevent"])),onPointerdown:p[4]||(p[4]=T(()=>{},["stop"])),onDblclick:p[5]||(p[5]=T(b=>s(t).onTagChange?.(b,e.row.id),["stop","prevent"]))},E(e.row.tag),41,fr)):(h(),v("span",vr,E(e.row.tag),1)),s(t).editingId===e.row.id&&!i(e.row)?Et((h(),v("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":p[6]||(p[6]=b=>s(t).draft=b),onMousedown:p[7]||(p[7]=T(()=>{},["stop"])),onPointerdown:p[8]||(p[8]=T(()=>{},["stop"])),onClick:p[9]||(p[9]=T(()=>{},["stop"])),onDblclick:p[10]||(p[10]=T(()=>{},["stop"])),onKeydown:[p[11]||(p[11]=T(()=>{},["stop"])),p[12]||(p[12]=oe(T(b=>s(t).onRenameCommit?.(),["prevent"]),["enter"])),p[13]||(p[13]=oe(T(b=>s(t).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:p[14]||(p[14]=b=>s(t).onRenameCommit?.())},null,544)),[[xo,s(t).draft]]):(h(),v("span",mr,E(e.row.name),1))],8,pr),l(e.row)?(h(),v("span",gr,[e.row.alpineNth>=0?(h(),v("button",{key:0,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:s(t).alpineTitle,innerHTML:e.row.alpineSet?mn:vn,onClick:p[15]||(p[15]=T(b=>s(t).onAlpineState?.(b,e.row.id),["stop","prevent"])),onPointerdown:p[16]||(p[16]=T(()=>{},["stop"])),onDblclick:p[17]||(p[17]=T(()=>{},["stop"]))},null,40,kr)):w("",!0),e.row.frame!=="main"&&s(n)?(h(),v("button",{key:1,type:"button","data-sve-ht-fields":"",title:s(t).frameFieldsTitle,innerHTML:fn,onClick:p[18]||(p[18]=T(b=>s(t).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:p[19]||(p[19]=T(()=>{},["stop"])),onDblclick:p[20]||(p[20]=T(()=>{},["stop"]))},null,40,yr)):w("",!0)])):!i(e.row)&&!d(e.row)?(h(),v("span",br,[e.row.videoNth>=0?(h(),v("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?s(t).videoPlayTitle:s(t).videoHoldTitle,innerHTML:e.row.videoHeld?Dr:Ir,onClick:p[21]||(p[21]=T(b=>s(t).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:p[22]||(p[22]=T(()=>{},["stop"])),onDblclick:p[23]||(p[23]=T(()=>{},["stop"]))},null,40,_r)):w("",!0),e.row.alpineNth>=0?(h(),v("button",{key:1,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:s(t).alpineTitle,innerHTML:e.row.alpineSet?mn:vn,onClick:p[24]||(p[24]=T(b=>s(t).onAlpineState?.(b,e.row.id),["stop","prevent"])),onPointerdown:p[25]||(p[25]=T(()=>{},["stop"])),onDblclick:p[26]||(p[26]=T(()=>{},["stop"]))},null,40,Tr)):w("",!0),H(e.row)?(h(),v("button",{key:2,type:"button","data-sve-ht-eye":"",disabled:!s(t).canEdit,title:s(t).canEdit?e.row.hidden?s(t).showTitle:s(t).hideTitle:s(t).lockedTitle,innerHTML:e.row.hidden?$r:Pr,onClick:p[27]||(p[27]=T(b=>s(t).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:p[28]||(p[28]=T(()=>{},["stop"])),onDblclick:p[29]||(p[29]=T(()=>{},["stop"]))},null,40,xr)):w("",!0),s(n)&&e.row.fieldsIcon?(h(),v("button",{key:3,type:"button","data-sve-ht-fields":"",disabled:!s(t).canEdit,title:s(t).canEdit?s(o):s(t).lockedTitle,innerHTML:fn,onClick:T(a,["stop","prevent"]),onPointerdown:p[30]||(p[30]=T(()=>{},["stop"])),onDblclick:p[31]||(p[31]=T(()=>{},["stop"]))},null,40,wr)):w("",!0),!c(e.row)&&!C(e.row)?(h(),v("button",{key:4,type:"button","data-sve-ht-dup":"",disabled:!ne(e.row),title:ne(e.row)?s(t).duplicateTitle:s(t).lockedTitle,innerHTML:Mr,onClick:p[32]||(p[32]=T(b=>s(t).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:p[33]||(p[33]=T(()=>{},["stop"])),onDblclick:p[34]||(p[34]=T(()=>{},["stop"]))},null,40,Sr)):w("",!0),F(e.row)?(h(),v("button",{key:5,type:"button","data-sve-ht-lock":"","data-on":e.row.locked?"":null,disabled:!s(t).canEdit||e.row.locked&&!s(t).canUnlock,title:e.row.locked?s(t).canUnlock?s(t).unlockTitle:s(t).lockedByTitle:s(t).lockTitle,"aria-pressed":e.row.locked?"true":"false",innerHTML:e.row.locked?Rr:Or,onClick:p[35]||(p[35]=T(b=>s(t).onLock?.(e.row.id),["stop","prevent"])),onPointerdown:p[36]||(p[36]=T(()=>{},["stop"])),onDblclick:p[37]||(p[37]=T(()=>{},["stop"]))},null,40,Cr)):w("",!0),c(e.row)?w("",!0):(h(),v("button",{key:6,type:"button","data-sve-ht-del":"",disabled:!ne(e.row),title:ne(e.row)?s(t).deleteTitle:s(t).lockedTitle,innerHTML:Fr,onClick:p[38]||(p[38]=T(b=>s(t).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:p[39]||(p[39]=T(()=>{},["stop"])),onDblclick:p[40]||(p[40]=T(()=>{},["stop"]))},null,40,Lr))])):w("",!0)],16,ir),e.row.emptyBlock&&!e.row.shut?(h(),v("div",xe({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},s(t).dropId===e.row.id&&s(t).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),E(s(t).slotText),17,Hr)):w("",!0)],64))}},G=ut(Ar,[["__scopeId","data-v-25ebfb99"]]),Br=["data-sve-ht-look","data-sve-ht-layers"],Nr={key:0,class:"sve-ht-page-template"},Kr={key:0,class:"sve-ht-page-template__text"},Vr={class:"sve-ht-page-template__note"},jr={key:1,class:"sve-ht-empty"},Ur={key:2,class:"sve-ht-empty"},qr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},Yr={key:0,class:"sve-ht-empty"},zr={key:0,class:"sve-ht-empty"},Gr=["data-sve-ht-under-main"],Xr={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},Wr={key:0,class:"sve-ht-empty"},Zr=["data-sve-ht-under-main"],Jr=["data-dim"],Qr={key:0,class:"sve-ht-empty"},ei={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},ti={key:0,class:"sve-ht-empty"},ni={key:4,"data-sve-ht-branch":"","data-sve-ht-cat":"component"},oi={__name:"HtmlTreeList",setup(e){const n=ce(()=>jn(t.query)),o=ce(()=>rr(t.rows,n.value)),a=ce(()=>o.value.rows),r=ce(()=>n.value?t.sections.filter(S=>$t(S.row,n.value)||S.current&&S.ready&&a.value.length>0):t.sections);function i(S){return!!S&&(!n.value||$t(S,n.value))}function l(S){const F=t.frame?.kind;return t.inComponent||(F==="header"||F==="footer")&&F!==S}const d=ce(()=>t.frame?.kind==="header"||t.frame?.kind==="footer"),k=ce(()=>!!t.frame&&["header","main","footer"].some(S=>i(t.frame[S]))),m=ce(()=>!!t.frame&&(t.frame.kind==="main"||i(t.frame.main))),y=ce(()=>!!n.value&&!r.value.length&&!a.value.length&&!k.value);function c(S){return!!n.value&&!o.value.hits.has(S.path)}function C(S){const F={"data-sve-ht-sec-uid":S.uid};return S.current&&(F["data-sve-ht-branch"]="",F["data-sve-ht-cat"]=S.row?.cat||"layout"),t.sectionDrop&&t.sectionDrop.uid===S.uid&&(F["data-sve-ht-drop"]=t.sectionDrop.place),F}return(S,F)=>(h(),v("div",xe({class:"sve-ht-root","data-sve-ht-look":s(t).layers?"tags":s(t).look,"data-sve-ht-layers":s(t).layers?"":null,style:s(t).familyStyle},s(t).dragging?{"data-sve-ht-dragging":""}:{}),[s(t).pageTemplate?(h(),v("div",Nr,[s(t).pageTemplate.text?(h(),v("p",Kr,E(s(t).pageTemplate.text),1)):w("",!0),M("p",Vr,E(s(t).pageTemplate.note),1),s(t).pageTemplate.canOpen?(h(),v("button",{key:1,type:"button",class:"sve-ht-page-template__open",onClick:F[0]||(F[0]=H=>s(t).pageTemplate.onOpen(H.currentTarget))},E(s(t).pageTemplate.openLabel),1)):w("",!0)])):!s(t).rows.length&&!s(t).sections.length&&!s(t).frame?(h(),v("div",jr,E(s(t).emptyText),1)):y.value?(h(),v("div",Ur,E(s(t).searchEmpty),1)):w("",!0),s(t).frame||s(t).sections.length?(h(),v(R,{key:3},[s(t).frame?(h(),v(R,{key:0},[s(t).frame.kind==="header"?(h(),v("div",qr,[(h(!0),v(R,null,A(a.value,H=>(h(),U(G,{key:H.id,row:H,dim:c(H)},null,8,["row","dim"]))),128)),s(t).rows.length?w("",!0):(h(),v("div",Yr,E(s(t).emptyText),1))])):!d.value&&i(s(t).frame.header)?(h(),U(G,{key:1,row:s(t).frame.header,dim:l("header")},null,8,["row","dim"])):w("",!0)],64)):w("",!0),d.value?w("",!0):(h(),v("div",wo(xe({key:1},s(t).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[s(t).frame?.kind==="main"?(h(),v(R,{key:0},[(h(!0),v(R,null,A(a.value,H=>(h(),U(G,{key:H.id,row:H,dim:c(H)},null,8,["row","dim"]))),128)),s(t).rows.length?w("",!0):(h(),v("div",zr,E(s(t).emptyText),1))],64)):s(t).frame&&i(s(t).frame.main)?(h(),U(G,{key:1,row:s(t).frame.main,dim:l("main")},null,8,["row","dim"])):w("",!0),s(t).frame?.kind==="template"?Et((h(),v("div",{key:2,"data-sve-ht-frame-body":"","data-sve-ht-under-main":m.value?"":null},[M("div",Xr,[(h(!0),v(R,null,A(a.value,H=>(h(),U(G,{key:H.id,row:H,dim:c(H)},null,8,["row","dim"]))),128)),s(t).rows.length?w("",!0):(h(),v("div",Wr,E(s(t).emptyText),1))])],8,Gr)),[[ln,!s(t).mainShut]]):w("",!0),s(t).sections.length||s(t).frame?Et((h(),v("div",{key:3,"data-sve-ht-frame-body":"","data-sve-ht-under-main":m.value?"":null},[s(t).frame?.template&&i(s(t).frame.template)?(h(),U(G,{key:0,row:s(t).frame.template,dim:l("template")},null,8,["row","dim"])):w("",!0),s(t).frame&&!s(t).frame.template&&!s(t).sections.length&&!n.value?(h(),v("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":l("")?"":void 0},E(s(t).frameEmptyText),9,Jr)):w("",!0),(h(!0),v(R,null,A(r.value,H=>(h(),v("div",xe({key:H.uid},{ref_for:!0},C(H)),[H.ready?(h(),v(R,{key:0},[(h(!0),v(R,null,A(a.value,te=>(h(),U(G,{key:te.id,row:te,dim:c(te)},null,8,["row","dim"]))),128)),s(t).rows.length?w("",!0):(h(),v("div",Qr,E(s(t).emptyText),1))],64)):(h(),U(G,{key:1,row:H.row,dim:l("")},null,8,["row","dim"]))],16))),128))],8,Zr)),[[ln,!s(t).frame||!s(t).mainShut]]):w("",!0)],16)),s(t).frame?(h(),v(R,{key:2},[s(t).frame.kind==="footer"?(h(),v("div",ei,[(h(!0),v(R,null,A(a.value,H=>(h(),U(G,{key:H.id,row:H,dim:c(H)},null,8,["row","dim"]))),128)),s(t).rows.length?w("",!0):(h(),v("div",ti,E(s(t).emptyText),1))])):!d.value&&i(s(t).frame.footer)?(h(),U(G,{key:1,row:s(t).frame.footer,dim:l("footer")},null,8,["row","dim"])):w("",!0)],64)):w("",!0)],64)):s(t).inComponent&&s(t).rows.length?(h(),v("div",ni,[(h(!0),v(R,null,A(a.value,H=>(h(),U(G,{key:H.id,row:H,dim:c(H)},null,8,["row","dim"]))),128))])):s(t).rows.length?(h(!0),v(R,{key:5},A(a.value,H=>(h(),U(G,{key:H.id,row:H,dim:c(H)},null,8,["row","dim"]))),128)):w("",!0)],16,Br))}},_t=ut(oi,[["__scopeId","data-v-d0376715"]]);let Tt=null;function ai(e){return Tt||(Tt=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():{pages:[]}).then(n=>Array.isArray(n.pages)?n.pages:[]).catch(()=>[])),Tt}let We=null;function xt(){We?.dismiss(),We=null}function si(e,n,o){xt();const a=n?.getBoundingClientRect?.(),r={x:a?a.left:0,y:a?a.bottom+4:0};ai(e).then(i=>{const l=i.length?i.map(d=>({label:d.title||d.url,onPick:()=>{xt(),o(d.url)}})):[{label:f(e,"component_props_pages_none"),onPick:null}];xt(),We=Ne(e.document,Ke,{items:l,x:r.x,y:r.y,onClose:()=>{We=null}})})}const Un="sve-html-tree-labels";function qn(){try{const e=globalThis.localStorage?.getItem(Un);if(!e)return{};const n=JSON.parse(e);return n&&typeof n=="object"?n:{}}catch{return{}}}function ri(e){try{globalThis.localStorage?.setItem(Un,JSON.stringify(e))}catch{}}function Yn(e){return String(e||"_")}function zn(e){const n=qn()[Yn(e)];return n&&typeof n=="object"?{...n}:{}}function ii(e,n,o){const a=o?.[n];return typeof a=="string"&&a.trim()?a.replace(/\s+/g," ").trim():String(e||"").trim()}function li(e,n,o,a){if(!n)return;const r=Yn(e),i=qn(),l={...i[r]||{}},d=String(o||"").replace(/\s+/g," ").trim(),k=String(a||"").trim();!d||d===k?delete l[n]:l[n]=d,Object.keys(l).length?i[r]=l:delete i[r],ri(i)}const q=ka("sve-call-values"),Fe=new Set;let gn=null;const di="__sve-html-tree-style";function ci(e,n,o){if(n||o)return!1;const a=String(x("dock:chrome-kind")||"");if(a==="header"||a==="footer")return!1;const r=Cn(e);return!!r&&r!=="create"&&Eo(e)!==Po(e)}function Gn(e){return{sectionLoops:Ho(e),sectionsLabel:f(e,"html_tree_sections_slot")}}function ui(e,n){const o={entry:n,text:"",note:f(e,"html_tree_page_template_note"),openLabel:f(e,"html_tree_open_template"),canOpen:!1,onOpen:null};return On(e,{entry:n}).then(a=>{!a||t.pageTemplate?.entry!==n||(t.pageTemplate={...t.pageTemplate,text:f(e,"html_tree_page_template",{name:a.name}),canOpen:!!a.open,onOpen:a.open?r=>ta(e,r,a.open):null})}),o}function hi(e,n){const o=n.replace(/^view:/,"");if(!o||x("dock:current-type")!==n){t.usedBy=null,t.templateSections=[];return}t.usedBy?.view!==o&&(t.usedBy=null,On(e,{view:o}).then(a=>{if(!a||x("dock:current-type")!==n)return;const r=a.everything?[{name:f(e,"html_tree_used_by_everything"),kind:"everything",url:null}]:a.used_by.map(i=>({...i,...pi(e,i)}));t.templateSections=Array.isArray(a.sections_fields)?a.sections_fields:[],t.usedBy={view:o,label:f(e,"html_tree_used_by"),items:r,empty:r.length?"":f(e,"html_tree_used_by_nobody"),hint:r.length?f(e,"html_tree_used_by_hint",{list:r.map(i=>i.name).join(", ")}):""}}))}function pi(e,n){if(!n.url)return{openLabel:"",onOpen:null};const o=f(e,"html_tree_used_by_open",{name:n.name});return n.kind==="page"?{openLabel:o,onOpen:a=>ra(e,a,ia(e,n.url))}:{openLabel:o,onOpen:a=>la(e,{anchor:a,url:n.url,subtitle:n.name})}}const V=new Set;let Mt="",Te=!1,wt=null,ue=!0,J="",Ce=0,Xn="";const ke=new Map,Ie=new Set,It=new Map,Ze=new Map;let j="",Wn=!1,O=null,Je=null,Ue="",Qe="",et=0,Dt=null,Se=[],ge=null,De=null,tt=null,nt=null,Rt=null,ye=!1,ae=null,Ae=null,Re=null,ot=null,at=null,Ot=null,me=null;function Y(e){return e.getElementById(Ge)}function fi(e){So(e,di,`
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
      ${un("light")}
      /* How much of a row's own colour its pick takes: a wash, not a fill.
         The row mixes it in below — a mix written up here would read
         --sve-ht-c on the list, where no family is set. */
      --sve-ht-pick-mix: 11%;
      --sve-ht-pick-hover-mix: 18%;
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${un("dark")}
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
  `)}function z(){const e=x("dock:html");return typeof e=="string"?e:""}function Zn(e){return!!x("dock:is-open",e)}function He(e,{save:n=!1,unlock:o=!1}={}){return Wt()||x("dock:set-html",o?{html:e,unlock:!0}:e)!==!0?!1:(n&&x("dock:save-now"),!0)}function St(e){const n=x("dock:component-exit-state")||{};if(t.exitOpen=!!n.open,!n.open){t.onExit=null;return}t.exitName=n.name||"",t.exitLabel=f(e,"component_exit"),t.exitTitle=f(e,n.back?"component_exit_back":"component_exit_close"),t.onExit=()=>{x("dock:exit-component"),I(e)}}const Be=[];let Ct=!1;function Lt(e,n){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(n,{timeout:2e3});return}e.setTimeout(n,200)}function vi(e,n){for(const o of n){const a=o.type;!a||ke.has(a)||Ie.has(a)||Be.includes(a)||Be.push(a)}qt.htmlTreePrefetchArmed&&Jn(e)}function gl(e){qt.htmlTreePrefetchArmed=!0,Jn(e)}function Jn(e){if(Ct||!Be.length)return;Ct=!0;const n=()=>{const o=Be.shift();if(!o){Ct=!1;return}if(ke.has(o)||Ie.has(o)){Lt(e,n);return}Ie.add(o),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(o)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(a=>a.ok?a.json():null).then(a=>{if(typeof a?.html=="string"){ke.set(o,a.html);const r=Ze.get(o);Ze.delete(o),r&&r!==Qn(e,o)&&I(e)}}).catch(()=>{}).finally(()=>{Ie.delete(o),Lt(e,n)})};Lt(e,n)}function Wt(){return!!j}function Qn(e,n){return eo(n)||$o(e,n)||"section"}function eo(e){const n=ke.get(e);if(!n)return"";const o=It.get(e);if(o&&o.html===n)return o.tag;const a=Zt(ht(n))?.tag||"";return It.set(e,{html:n,tag:a}),a}function Ve(e,n){const o=lt(e)||"page_sections",a=[];for(const r of jt(n)||[]){if(r.name===ea||r.name===ha)continue;const i=Ut(r.values),l=i&&typeof i=="object"?i[o]:null;if(Array.isArray(l)){l.forEach(d=>{if(!d||typeof d!="object"||Array.isArray(d)||typeof d.type!="string")return;const k=[d._visual_id,d.id,d._id].filter(S=>typeof S=="string"&&S!=="");if(!k.length)return;const m=Rn(e,d),y=typeof d._sve_label=="string"?d._sve_label.trim():"",c=Qn(e,m);eo(m)||Ze.set(m,c);const C=zn(m)[`0:${c}`];a.push({uid:k[0],ids:k,type:m,tag:c,label:y||(typeof C=="string"&&C.trim()?C.trim():"")||dt(e,m)?.display||Oe(m)||m,svg:Bn(c,kn(c),null).svg||we.section,cat:In(c,kn(c)),enabled:d.enabled!==!1,static:Bo(e,m)})});break}}return a}function mi(e,n,o){if(!o.length)return"";const a=x("dock:current-type")||"",r=x("dock:current-uid"),i=!!x("dock:component-exit-state")?.open;if(r){const l=ct(r,n),d=o.find(k=>k.ids.some(m=>l.includes(m)));if(d&&(i||d.type===a))return d.uid}return o.find(l=>l.type===a)?.uid||""}function gi(e,n,o){const a=x("dock:component-exit-state");if(a?.open)return Oe(a.name)||a.name||"";if(o)return n.find(i=>i.uid===o)?.label||"";const r=x("dock:current-type")||"";return String(r).startsWith("view:")?"":dt(e,r)?.display||Oe(r)||""}function pt(e,n,o,a,r){const i=o.find(l=>l.uid===a);i&&a!==r&&(V.clear(),O=null,ue=!1,W(),je(),J=a,Xn=z(),j=ke.get(i.type)||"",j&&(O=At(ht(j))||null),Wn=(x("dock:current-type")||"")===i.type,e.clearTimeout(Ce),Ce=e.setTimeout(()=>{J="",Te=!1,I(e)},4e3),I(e),sa(e,i.uid,"tree"),he({source:ee,type:Q.SVE_ACTIVATE,ids:i.ids},e),e.setTimeout(()=>I(e),0))}function Ft(e,n){if(!n)return!1;for(const o of e||[])if(o.id===n||Ft(o.children,n))return!0;return!1}function At(e){return Zt(e)?.id||""}function Zt(e){for(const n of e||[]){if(to(n))return n;const o=Zt(n.children);if(o)return o}return null}function to(e){return!e.kind||e.kind==="component"}function kn(e){return e==="component"?"component":""}function ki(e,n){const o=n===0||e.path===Qe;return V.has(e.path)?o:!o}function yi(e){const n=new Set,o=(a,r)=>{for(const i of a)i.children.length&&ki(i,r)&&n.add(i.id),o(i.children,r+1)};return o(e,0),n}function I(e){const n=e.document,a=Y(n)?.querySelector("[data-sve-html-tree-list]");if(!a)return;fi(n),ma(e);const r=z();j&&j===r&&(j=""),x("dock:chrome-kind")&&(j="");const i=j||r,l=ht(i,Gn(e));Se=l,Qe="";const d=x("dock:current-type")||"",k=zn(d),m=Lo(e,n),c=!!(x("dock:component-exit-state")||{}).open;d&&r&&!j&&ke.set(d,r);const C=Ve(e,n);vi(e,C);const S=mi(e,n,C);if(ci(e,m,c)){const u=Cn(e);Se=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!1,t.layoutFile=!1,t.usedBy=null,t.emptyText="",t.pageTemplate?.entry!==u&&(t.pageTemplate=ui(e,u)),t.onRefresh=()=>I(e),t.onSection=null,St(e),Me(a,_t),Ht(e,[]);return}t.pageTemplate=null,hi(e,String(x("dock:collection-view")||""));const F=String(x("dock:chrome-kind")||"");if(Zo(e),m&&!C.length&&!F){Se=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,t.layoutFile=!1,t.emptyText=f(e,"html_tree_page_empty"),t.canEdit=!x("dock:is-locked"),t.look=hn(e),t.onRefresh=()=>I(e),t.onSection=null,St(e),Me(a,_t),Ht(e,[]);return}t.pageBuilder=m;const H=`${d}|${S}`;let te=!1;H!==Mt&&(Mt=H,V.clear(),wt!==null&&i!==wt?te=!0:Te=i),(te||Te!==!1&&i!==Te)&&(Te=!1,V.clear(),O=At(l)||null),wt=i,J&&(J===S||!C.length)&&(Wn||i!==Xn)&&(e.clearTimeout(Ce),J="",Te=!1,Ft(l,O)||(V.clear(),O=At(l)||null));const ne=C.some(u=>u.uid===J)?J:"",g=ue?"":ne||S,p=!!(ne||S),b=p||c?"":String(x("dock:chrome-kind")||""),$=m&&(!d&&!p||b==="main"&&x("dock:on-empty-page")===!0),D=$||b==="template"?"":b;t.layoutFile=D==="main",D!=="main"&&(Ue="");const K=D==="main"?yn(l,"main"):null,B=K?st(l,u=>u.tag==="body"&&Ft(u.children,K.id)):null;Qe=B?B.path:"",K&&(ze((B||K).path),Ue!==H&&(ze(K.path),V.add(K.path)));const Ee=D==="header"||D==="footer"?st(l,u=>i.slice(u.from,u.openTo).includes(`data-sve-chrome="${D}"`)):null,se=Ee||(D==="header"||D==="footer"?yn(l,D):null);se&&ze(se.path);const N=$||!(D==="main"?!!K:D==="header"||D==="footer"?!!se:!0)?[]:Oa(l,t.query?new Set:yi(l));!i.trim()&&!Zn(n)?t.emptyText=f(e,"html_tree_need_dock"):t.emptyText=f(e,"html_tree_empty"),t.slotText=f(e,"antlers_drop_here"),t.dataTitle=f(e,"data_vars_title"),t.pageTitle=f(e,"component_props_page"),t.renameTitle=f(e,"html_tree_rename"),t.tagTitle=f(e,"tw_tag"),t.hideTitle=f(e,"html_tree_hide"),t.showTitle=f(e,"html_tree_show"),t.duplicateTitle=f(e,"html_tree_duplicate"),t.deleteTitle=f(e,"html_tree_delete"),t.videoHoldTitle=f(e,"html_tree_video_hold"),t.videoPlayTitle=f(e,"html_tree_video_play"),t.alpineTitle=f(e,"html_tree_alpine_state"),t.lockedTitle=f(e,"html_tree_locked"),t.searchEmpty=f(e,"html_tree_search_empty"),t.canEdit=!x("dock:is-locked"),t.look=hn(e),t.onQuery=()=>I(e),St(e),t.inComponent=c,t.onSelect=u=>{const _=N.find(P=>P.id===u);_&&An(e,_.path)||it(e,u,N)},t.onTwist=u=>{const _=N.find(P=>P.id===u)?.path;_&&(V.has(_)?V.delete(_):V.add(_),I(e))},t.onTagChange=(u,_)=>{const P=t.rows.find(le=>le.id===_);P&&!Wt()&&!Jt(e,P)&&ga(e,u.currentTarget,P)},t.onRename=u=>Ci(e,u),t.onRenameCommit=()=>bn(e,!0),t.onRenameCancel=()=>bn(e,!1),t.onHide=u=>Mi(e,u),t.onLock=u=>$i(e,u),t.canUnlock=oo(e),t.lockTitle=f(e,"html_tree_lock"),t.unlockTitle=f(e,"html_tree_unlock"),t.lockedByTitle=f(e,"html_tree_locked_by_developer"),t.onVideoHold=u=>Hi(e,u),t.onAlpineState=(u,_)=>Pi(e,u,_),t.onDuplicate=u=>Ii(e,u),t.onDelete=u=>Ri(e,u),t.onPointerDown=(u,_)=>Bi(e,u,_),t.onSectionPointerDown=(u,_)=>Vi(e,u,_),t.onSectionHover=u=>e.dispatchEvent(new e.CustomEvent("sve-lite-hover",{detail:{uid:u}})),t.onContext=(u,_)=>Fi(e,u,_),t.onInspectCommit=u=>Zi(e,u),t.onPropValue=(u,_,P)=>wn(e,u,_,P),t.onPropPage=(u,_)=>si(e,u,P=>wn(e,_,P,!1)),t.onLoopKind=u=>Ji(e,u),t.onAddBranch=u=>Qi(e,u),t.onLoopSortField=u=>{const _=rt(),P=String(u||"").trim();if(!_)return;const le=me?.id===_.id?me.dir:"",de=_.sortDir||le||"asc";me=null,Z(e,(ve,mt)=>_e(ve,mt,{sortField:P,sortDir:de}))},t.onLoopSortDir=u=>{const _=rt(),P=String(u||"");if(_){if((P==="asc"||P==="desc")&&!_.sortField){me={id:_.id,dir:P},Kt(e,_);return}me=null,Z(e,(le,de)=>_e(le,de,{sortDir:P,sortField:P==="asc"||P==="desc"?de.sortField:""}))}},t.onLoopDepth=u=>Z(e,(_,P)=>_e(_,P,{navDepth:String(u||"").replace(/\D/g,"")})),t.onLoopIncludeHome=u=>Z(e,(_,P)=>_e(_,P,{includeHome:!!u})),t.onLoopLimit=u=>Z(e,(_,P)=>_e(_,P,{limit:String(u||"").replace(/\D/g,"")})),t.onLoopOffset=u=>Z(e,(_,P)=>_e(_,P,{offset:String(u||"").replace(/\D/g,"")})),t.onPropHost=u=>u?q.mount(u):q.unmount(),t.onInspectData=(u,_)=>{x("dock:data-menu",{anchor:u,at:N.find(P=>P.id===O)?.from,onPick:P=>_(String(P?.var||"").trim())})};const tn=N.find(to)?.id,nn=c?"":gi(e,C,g),pe=g&&!c?C.find(u=>u.uid===g):null,po=$n(e,String(x("dock:current-type")||""));let fo=0;const vo=Ei(Ee?[Ee]:l,i),mo=Mn(e,String(d)),re=D==="header"||D==="footer"?D:"",be=se?se.id:"",fe=K&&N.find(u=>u.id===K.id)||null,on=B&&N.find(u=>u.id===B.id)||null,ie=on||fe||be&&N.find(u=>u.id===be)||null,an=ie?xi(N,ie):-1;if(ie&&!N.slice(N.indexOf(ie),an).some(u=>u.id===O)&&(O=ie.id),t.selectFrom){const u=N.find(_=>_.from===t.selectFrom.at&&(!_.kind||_.kind==="sections"));u?(O=u.id,t.selectFrom=null):--t.selectFrom.left<=0&&(t.selectFrom=null)}const sn=t.layoutFile?Ti(e):null;t.rows=N.map(u=>{const _=sn&&u.kind==="component"&&sn.get(u.src)||"",P=u.tag==="body"&&!u.kind,le=_?{svg:we[_]}:Bn(u.tag,u.kind,u.antlers),de=u.tag==="video"&&!u.kind?fo++:-1,ve=vo.get(u.id),mt=ve?mo[ve.nth]||{}:{},gt=ve?ve.booleans.map(({key:$e,value:rn})=>({key:$e,file:rn,value:mt[$e]??rn})):[],kt=u.id===tn&&nn?nn:u.klass,Pe=u.id===tn;return{...u,tag:_||u.tag,frameCall:_,fixed:!!_||P,base:kt,name:_?f(e,`html_tree_frame_${_}`):re&&u.id===be?f(e,`html_tree_frame_${re}`):u===fe?f(e,"html_tree_frame_main"):Pe&&pe?kt:ii(kt,u.path,k),current:u.id===O,letter:le.letter||"",svg:re&&u.id===be?we[re]:u===fe?we.main:Pe&&pe?pe.svg:le.svg||"",frame:re&&u.id===be?re:u===fe?"main":"",cat:re&&u.id===be?re:u===fe||P?"main":_||In(u.tag,u.kind,u.antlers),componentRoot:Pe&&c,sectionRoot:Pe&&pe?pe.uid:"",fieldsIcon:!!(Pe&&pe&&!pe.static),videoNth:de,videoHeld:de>=0&&po.has(de),alpineNth:gt.length?ve.nth:-1,alpineKeys:gt,alpineSet:gt.some($e=>$e.value!==$e.file)}}),Jo(e),Qo(e);const vt=[];for(const u of t.rows)vt.length=u.depth,u.guides=vt.slice(),vt[u.depth]=u.cat;if(ie){const u=N.indexOf(ie),_=ie.depth;t.rows=t.rows.slice(u,an).map(P=>({...P,depth:P.depth-_,guides:P.guides.slice(_)})),fe&&Ue!==H&&(Ue=H,e.setTimeout(()=>it(e,fe.id,N),0))}t.sections=m&&!c&&(p||D||$)?C.map(u=>{const _=!!g&&u.uid===g;return{...u,current:_,ready:_&&(!ne||!!j),row:{id:`sec:${u.uid}`,section:u.uid,tag:u.tag,name:u.label,kind:"",svg:u.svg,cat:u.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:_,hidden:!u.enabled}}}):[],t.frame=_i(e,C,p,c,D,!1,!!on),t.frameEmptyText=f(e,"html_tree_frame_no_sections"),bi(e,D),t.onSection=u=>{ye||(Bt(e),pt(e,n,C,u,g))},t.onRefresh=()=>I(e),Kt(e,t.rows.find(u=>u.id===O)),Me(a,_t),Ht(e,l)}function bi(e,n){t.frameOpenTitle=f(e,"html_tree_frame_open"),t.frameMainTitle=f(e,"html_tree_frame_main_open"),t.frameTemplateTitle=f(e,"html_tree_frame_template_open"),t.frameFieldsTitle=f(e,"html_tree_frame_fields"),t.onFrame=o=>{n===o?wi(e,o):Nt(e,o)},t.onFrameEnter=o=>Nt(e,o),t.onFrameFields=o=>jo(e,oa(e,o),f(e,`html_tree_frame_${o}`)),t.onFrameTwist=()=>{t.mainShut=!t.mainShut}}function _i(e,n,o,a,r,i=!1,l=!1){if(!r&&!i||l)return null;const d=y=>({id:`frame:${y}`,frame:y,synthetic:!0,tag:y,name:f(e,`html_tree_frame_${y}`),kind:"",svg:we[y]||"",cat:y,letter:"",depth:0,hasChildren:y==="main"&&(n.length>0||r==="template"),shut:y!=="main",current:!1,hidden:!1}),k={kind:r,header:d("header"),main:d("main"),footer:d("footer"),template:null},m=r&&r!=="template"?String(x("dock:collection-view")||""):"";return m&&(k.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:dt(e,m)?.display||Oe(m.replace(/^view:/,"")),kind:"",svg:we.section,cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),k}function yn(e,n){return st(e,o=>o.tag===n)}function st(e,n){for(const o of e||[]){if(!o.kind&&n(o))return o;const a=st(o.children,n);if(a)return a}return null}function Ti(e){const n=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},o=new Map;for(const a of["header","footer"]){const r=ba(n[a]?.type);r&&o.set(r,a)}return o}function xi(e,n){let o=e.indexOf(n)+1;for(;o<e.length&&e[o].depth>n.depth;)o+=1;return o}function wi(e,n){const o=Fn(e);(n==="main"||n==="template"?o?.querySelector("main"):o?.querySelector(`[data-sve-chrome="${n}"]`))?.scrollIntoView({behavior:"smooth",block:"start"})}function Bt(e){const n=String(x("dock:chrome-open",e.document)||"");return n!=="header"&&n!=="footer"?!1:(aa(e),he({source:ee,type:Q.SVE_FORCE_EXIT_CHROME},e),!0)}function Si(e){e.clearTimeout(Ce),J="",j="",V.clear(),O=null,ue=!1,W(),je()}function Nt(e,n){if(e.document,String(x("dock:chrome-kind")||"")===n)return;if(Si(e),n==="main"){Bt(e),x("dock:open-file",pa);return}if(n==="template"){const i=String(x("dock:collection-view")||"");i&&(Bt(e),x("dock:open-file",i));return}if(n!=="header"&&n!=="footer")return;const o=Fn(e)?.querySelector(`[data-sve-chrome="${n}"]`);o?(o.scrollIntoView({block:"nearest"}),o.dispatchEvent(new o.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:ee,type:Q.OPEN_CHROME,kind:n},e.location.origin);const a=Date.now(),r=async()=>{if(String(x("dock:chrome-kind")||"")!==n){Date.now()-a<3e4&&e.setTimeout(r,250);return}await(x("dock:load-settled")||null),ho(e)};e.setTimeout(r,250)}function Ht(e,n){Y(e.document)&&no(e,n)}function no(e,n){const o=n[0],a=!!x("dock:component-src"),r=a?"":x("dock:current-uid")||"";he({source:ee,type:Q.SVE_HTML_PICK,on:!0,uid:r,uids:r?ct(r,e.document):[],all:a,tag:o?.tag||"",klass:o?.klass||"",nodes:Ba(n)},e)}function ze(e){if(!e)return;const n=(o,a)=>{for(const r of o||[]){if(r.path===e)return!0;if(n(r.children,a+1))return a===0||r.path===Qe?V.delete(r.path):V.add(r.path),!0}return!1};n(Se,0)}function Ci(e,n){if(ye)return;const o=t.rows.find(a=>a.id===n);Jt(e,o)||!o||o.kind||(O=n,t.rows.forEach(a=>{a.current=a.id===n}),t.editingId=n,t.draft=o.name,e.setTimeout(()=>{const a=Y(e.document)?.querySelector("[data-sve-ht-rename]");a?.focus(),a?.select()},0))}function bn(e,n){const o=t.editingId;if(!o)return;const a=t.rows.find(r=>r.id===o);t.editingId=null,n&&a&&(a.sectionRoot?Li(e,a.sectionRoot,t.draft):li(x("dock:current-type")||"",a.path,t.draft,a.base||a.klass)),t.draft="",I(e)}function Li(e,n,o){const a=lt(e)||"page_sections",r=String(o||"").replace(/\s+/g," ").trim();for(const i of jt(e.document)||[]){const l=Ut(i.values),d=l&&typeof l=="object"?l[a]:null;if(!Array.isArray(d))continue;const k=d.findIndex(C=>C&&typeof C=="object"&&[C._visual_id,C.id,C._id].includes(n));if(k===-1)continue;const m=Rn(e,d[k]),y=dt(e,m)?.display||Oe(m)||m,c=JSON.parse(JSON.stringify(d));return c[k]={...c[k]},!r||r===y?delete c[k]._sve_label:c[k]._sve_label=r,i.setFieldValue(a,c),!0}return!1}function Hi(e,n){const o=t.rows.find(d=>d.id===n);if(!o||!(o.videoNth>=0))return;const a=String(x("dock:current-type")||""),r=$n(e,a),i=!r.has(o.videoNth);i?r.add(o.videoNth):r.delete(o.videoNth);const l=String(x("dock:current-uid")||"");na(e,a,r),he({source:ee,type:Q.SVE_VIDEO_HOLD,uid:l,uids:l?ct(l,e.document):[],nth:o.videoNth,on:i},e),I(e)}function Ei(e,n){const o=new Map;let a=0;const r=i=>{for(const l of i){if(l.hidden)continue;const d=l.kind?null:Ka(n.slice(l.from,l.openTo));d!==null&&o.set(l.id,{nth:a++,booleans:ja(d)}),r(l.children||[])}};return r(e),o}function Pi(e,n,o){const a=t.rows.find(i=>i.id===o);if(!a||!(a.alpineNth>=0))return;if(a.alpineKeys.length===1){_n(e,a,a.alpineKeys[0]);return}const r=n.currentTarget.getBoundingClientRect();W(),ae=Ne(e.document,Ke,{items:a.alpineKeys.map(i=>({label:i.key,icon:i.value?so:ro,onPick:()=>{W(),_n(e,a,i)}})),x:Math.round(r.left),y:Math.round(r.bottom+4),onClose:()=>{ae=null}})}function _n(e,n,o){const a=String(x("dock:current-type")||""),r=Mn(e,a),i=!o.value,l=i!==o.file,d={...r[n.alpineNth]||{}};l?d[o.key]=i:delete d[o.key],Object.keys(d).length?r[n.alpineNth]=d:delete r[n.alpineNth];const k=da(String(x("dock:chrome-kind")||"")),m=k?"":String(x("dock:current-uid")||"");ca(e,a,r),he({source:ee,type:Q.SVE_ALPINE_STATE,uid:m,uids:m?ct(m,e.document):[],chrome:k,nth:n.alpineNth,key:o.key,value:i,on:l},e),I(e)}function Jt(e,n){return!n||!(n.locked||n.lockedIn)?!1:(e.Statamic?.$toast?.error(f(e,"html_tree_locked_element")),!0)}function oo(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function $i(e,n){const o=t.rows.find(a=>a.id===n);if(!(!o||o.lockedIn||x("dock:is-locked"))){if(!o.locked){Le(e,n,Pa,{lockAction:!0});return}if(!oo(e)){e.Statamic?.$toast?.error(f(e,"html_tree_unlock_denied"));return}Yt(e,{titleKey:"html_tree_unlock_title",bodyKey:"html_tree_unlock_body",confirmKey:"html_tree_unlock_confirm"},()=>Le(e,n,$a,{lockAction:!0,unlock:!0}))}}function Qt(e){return!!t.rows.find(n=>n.id===e)?.fixed}function Mi(e,n){Qt(n)||Le(e,n,Ma)}function Ii(e,n){if(Qt(n))return;const o=t.rows.find(a=>a.id===n)?.sectionRoot;if(o){e.postMessage({source:ee,type:Q.DUPLICATE_ROW,uid:o},e.location.origin);return}Le(e,n,Ia)}function ao(e,n){Yt(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const o=e.document;ua({uid:n},o,e)})}function Di(e,n,o){J===o&&(e.clearTimeout(Ce),J="",j=""),O=null,ue=!1,Mt="";const a=Ve(e,n),r=a.find(i=>i.uid!==o)||a[0];r?pt(e,n,a,r.uid,""):(j="",t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,I(e)),e.setTimeout(()=>{Y(e.document)&&I(e)},0)}Dn("row:removed",({uid:e,parentPath:n,doc:o,win:a})=>{n!==lt(a)||!Y(a.document)||Di(a,o,e)});function Ri(e,n){if(Qt(n))return;const o=t.sections?.find(r=>r.row?.id===n),a=o?o.row?.section||o.uid:t.rows.find(r=>r.id===n)?.sectionRoot;if(a){ao(e,a);return}if(t.rows.find(r=>r.id===n)?.kind==="sections"){Yt(e,{titleKey:"html_tree_sections_remove_title",bodyKey:"html_tree_sections_remove_body",confirmKey:"html_tree_sections_remove_confirm"},()=>Le(e,n,pn));return}Le(e,n,pn)}function Le(e,n,o,{lockAction:a=!1,unlock:r=!1}={}){if(x("dock:is-locked"))return;const i=z(),l=t.rows.find(k=>k.id===n);if(!l||!a&&Jt(e,l))return;const d=o(i,l);d!==i&&He(d,{unlock:r})}function W(){ae?.dismiss(),ae=null}const so='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',ro='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>';function io(e,n){const o=t.sections?.find(k=>k.uid===n),a=o?.type||"";if(!a||!Ln(e))return[];const r=o.label||a,i=No(e,a),l=()=>e.Statamic?.$toast?.error(f(e,"section_update_failed")),d=[{label:f(e,"static_section_insertable"),icon:i?ro:so,onPick:()=>{W(),dn(e,{handle:a,hidden:!i}).then(()=>{e.Statamic?.$toast?.success(f(e,i?"section_shown_to_editors":"section_hidden_from_editors",{name:r})),cn(e)}).catch(l)}}];return o.static&&d.push({label:f(e,"section_add_fields"),onPick:()=>{W(),dn(e,{handle:a,fields:!0}).then(()=>{e.Statamic?.$toast?.success(f(e,"section_fields_added",{name:r})),cn(e),I(e),Hn(e,a)}).catch(l)}}),d}function Oi(e,n,o){const a=o.row?.section||o.uid;a&&(ae=Ne(e.document,Ke,{items:[...io(e,a),{label:f(e,"html_tree_remove_section"),danger:!0,onPick:()=>{W(),ao(e,a)}}],x:n.clientX,y:n.clientY,onClose:()=>{ae=null}}))}function Fi(e,n,o){W();const a=t.sections?.find(d=>d.row?.id===o);if(a){Oi(e,n,a);return}const r=t.rows.find(d=>d.id===o);if(!r)return;it(e,o,t.rows);const i={x:n.clientX,y:n.clientY},l=d=>{d.length&&(ae?.dismiss(),ae=Ne(e.document,Ke,{items:d,x:i.x,y:i.y,onClose:()=>{ae=null}}))};if(r.frameCall){l([{label:f(e,"html_tree_frame_edit",{frame:f(e,`chrome_${r.frameCall}`)}),onPick:()=>{W(),Nt(e,r.frameCall)}}]);return}if(r.kind==="component"){Ai(e,r,l);return}r.kind==="slot"||r.kind==="sections"||r.locked||r.lockedIn||t.canEdit&&(r.componentRoot||l([...r.sectionRoot?io(e,r.sectionRoot):[],{label:f(e,"component_make"),onPick:()=>{W(),ya(e,r,{onDone:()=>I(e),onError:d=>{e.alert(d?.status===409?f(e,"component_exists"):f(e,"component_failed"))}})}}]))}const Tn=(e,n)=>{W(),x("dock:open-template",n)};function Ai(e,n,o){if(!Fa(n.src)){o([{label:f(e,"component_open_named",{name:Aa(n.src)||n.src}),onPick:()=>Tn(e,`view:partials/${n.src}`)}]);return}o([{label:f(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(n.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(a=>a.ok?a.json():{items:[]}).then(a=>{const r=Array.isArray(a.items)?a.items:[];o(r.length?r.map(i=>({label:f(e,"component_open_named",{name:i.label}),onPick:()=>Tn(e,i.type)})):[{label:f(e,"component_none"),onPick:null}])}).catch(()=>o([{label:f(e,"component_none"),onPick:null}]))}function Bi(e,n,o){if(n.button!==0||x("dock:is-locked")||t.editingId)return;const a=t.rows.find(l=>l.id===o);if(a&&(a.locked||a.lockedIn)||n.target?.closest?.("button, input"))return;je(),ge=o,De={x:n.clientX,y:n.clientY},tt=n.currentTarget,nt=n.pointerId;const r=l=>Ni(e,l),i=l=>Ki(e,l);Rt=()=>{e.document.removeEventListener("pointermove",r,!0),e.document.removeEventListener("pointerup",i,!0),e.document.removeEventListener("pointercancel",i,!0),Rt=null},e.document.addEventListener("pointermove",r,!0),e.document.addEventListener("pointerup",i,!0),e.document.addEventListener("pointercancel",i,!0)}function Ni(e,n){if(!ge||!De)return;const o=n.clientX-De.x,a=n.clientY-De.y;if(!t.dragging&&o*o+a*a<25)return;if(!t.dragging){t.dragging=!0;try{tt?.setPointerCapture?.(nt)}catch{}}n.preventDefault();const r=e.document.elementFromPoint(n.clientX,n.clientY),i=r?.closest?.("[data-sve-ht-slot]");if(i){const c=i.getAttribute("data-sve-ht-id");if(c&&c!==ge){t.dropId=c,t.dropPlace="inside";return}}const l=r?.closest?.("[data-sve-ht-row]"),d=l?.getAttribute("data-sve-ht-id");if(!d||d===ge){t.dropId=null,t.dropPlace=null;return}const k=t.rows.find(c=>c.id===d),m=t.rows.find(c=>c.id===ge);if(!k||k.lockedIn||m&&k.path.startsWith(`${m.path}/`)){t.dropId=null,t.dropPlace=null;return}const y=l.getBoundingClientRect();t.dropId=d,t.dropPlace=Ha(n.clientY-y.top,y.height,!Kn(k.tag)&&!Nn(k)&&!k.locked)}function Ki(e,n){const o=ge,a=t.dropId,r=t.dropPlace||"after",i=t.dragging;if(je(),i&&(ye=!0,e.setTimeout(()=>{ye=!1},0)),!i||x("dock:is-locked")||!o||!a||o===a)return;n?.preventDefault?.();const l=z(),d=Ea(l,Se,o,a,r);d!==l&&He(d)}function je(){try{tt?.releasePointerCapture?.(nt)}catch{}Rt?.(),ge=null,De=null,tt=null,nt=null,t.dragging=!1,t.dropId=null,t.dropPlace=null}function Vi(e,n,o){if(n.button!==0||!o||t.editingId||n.target?.closest?.("button, input"))return;lo(),Ae=o,Re={x:n.clientX,y:n.clientY},ot=n.currentTarget,at=n.pointerId;const a=i=>ji(e,i),r=i=>Ui(e,i);Ot=()=>{e.document.removeEventListener("pointermove",a,!0),e.document.removeEventListener("pointerup",r,!0),e.document.removeEventListener("pointercancel",r,!0),Ot=null},e.document.addEventListener("pointermove",a,!0),e.document.addEventListener("pointerup",r,!0),e.document.addEventListener("pointercancel",r,!0)}function ji(e,n){if(!Ae||!Re)return;const o=n.clientX-Re.x,a=n.clientY-Re.y;if(!t.dragging&&o*o+a*a<25)return;if(!t.dragging){t.dragging=!0;try{ot?.setPointerCapture?.(at)}catch{}}n.preventDefault();const i=e.document.elementFromPoint(n.clientX,n.clientY)?.closest?.("[data-sve-ht-sec-uid]"),l=i?.getAttribute("data-sve-ht-sec-uid")||"";if(!l||l===Ae){t.sectionDrop=null;return}const d=i.getBoundingClientRect();t.sectionDrop={uid:l,place:n.clientY-d.top<d.height/2?"before":"after"}}function Ui(e,n){const o=Ae,a=t.sectionDrop,r=t.dragging;lo(),r&&(ye=!0,e.setTimeout(()=>{ye=!1},0)),!(!r||!o||!a?.uid||a.uid===o)&&(n?.preventDefault?.(),qi(e,o,a.uid,a.place))}function lo(){try{ot?.releasePointerCapture?.(at)}catch{}Ot?.(),Ae=null,Re=null,ot=null,at=null,t.dragging=!1,t.sectionDrop=null}function qi(e,n,o,a){const r=lt(e)||"page_sections";for(const i of jt(e.document)||[]){const l=Ut(i.values),d=l&&typeof l=="object"?l[r]:null;if(!Array.isArray(d))continue;const k=C=>d.findIndex(S=>S&&typeof S=="object"&&[S._visual_id,S.id,S._id].includes(C)),m=k(n),y=k(o);if(m===-1||y===-1||m===y)return!1;let c=a==="before"?y:y+1;return m<c&&(c-=1),c===m?!1:(e.postMessage({source:ee,type:Q.MOVE,uid:n,toIndex:c},e.location.origin),e.setTimeout(()=>I(e),60),!0)}return!1}function co(e){const n=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(n)?n:[]}function Yi(e){const n=e.Statamic?.$config?.get?.("sveNavigations");return Array.isArray(n)?n:[]}function zi(e){return[{handle:Xe,title:f(e,"antlers_nav_pages")},...Yi(e).map(n=>({handle:n.handle,title:n.title}))]}function Kt(e,n){if(n?.kind==="component"){Gi(e,n);return}if(X.callOpen&&(X.callOpen=!1,X.callStore=null,q.forget(),Gt(e)),n?.kind!=="antlers"){t.inspect=null;return}const o=n.id;if(n.tag==="else"){t.inspect={key:o,title:f(e,"antlers_condition"),mode:"note",note:f(e,"antlers_else_note")};return}if(n.antlers==="loop"){const a=n.loopKind==="collection",r=n.loopKind==="nav",i=me?.id===n.id?me.dir:"",l=n.sortDir||i,d=[{id:"field",label:f(e,"antlers_loop_field")},{id:"collection",label:f(e,"antlers_loop_collection")},{id:"nav",label:f(e,"antlers_loop_nav")}];if(r){const k=n.expr||Xe;t.inspect={key:o,title:f(e,"antlers_loop"),mode:"loop",loopKind:"nav",kinds:d,navs:zi(e),value:k,placeholder:f(e,"antlers_pick_nav"),nav:{depthTitle:f(e,"antlers_nav_depth"),depth:n.navDepth||"",depths:[{id:"",label:f(e,"antlers_nav_depth_all")},{id:"1",label:f(e,"antlers_nav_depth_1")},{id:"2",label:f(e,"antlers_nav_depth_2")},{id:"3",label:f(e,"antlers_nav_depth_3")}],homeAsked:k===Xe,homeLabel:f(e,"antlers_nav_include_home"),includeHome:!!n.includeHome},branches:[]};return}t.inspect={key:o,title:f(e,"antlers_loop"),mode:"loop",loopKind:a?"collection":"field",kinds:d,collections:co(e),value:n.expr||"",placeholder:f(e,a?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:f(e,"antlers_sort"),dir:l,needsField:l==="asc"||l==="desc",field:n.sortField||"",pickable:!a,placeholder:f(e,a?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:f(e,"antlers_sort_none")},{id:"asc",label:f(e,"antlers_sort_asc")},{id:"desc",label:f(e,"antlers_sort_desc")},{id:"random",label:f(e,"antlers_sort_random")}]},limit:{title:f(e,n.paginate?"antlers_limit_per_page":"antlers_limit"),value:n.limit||"",placeholder:f(e,"antlers_limit_placeholder")},offset:{title:f(e,"antlers_offset"),value:n.offset||"",placeholder:f(e,"antlers_offset_placeholder")},branches:[]};return}t.inspect={key:o,title:f(e,"antlers_condition"),mode:"condition",value:n.expr||"",placeholder:f(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:f(e,"antlers_add_elseif")},{id:"else",label:f(e,"antlers_add_else")}]}}function Gi(e,n){if(!Ta(e)){t.inspect=null;return}if(!n.src)return;const o=n.id;if(t.inspect={key:o,title:f(e,"component_props_values"),mode:"note",note:f(e,"code_dock_loading")},xa()){const a={},r={},i=new Map;for(const[l,d]of wa(z().slice(n.from,n.to))){const k=Sa(l);k&&(l!==k||!i.has(k))&&i.set(k,d)}for(const[l,d]of i)d.bound?r[l]=d.value:a[l]=d.value;gn!==o&&(gn=o,Fe.clear());for(const l of Fe)l in r||(r[l]="");t.inspect=null,X.callOpen=!0,X.title=X.title||f(e,"component_props"),X.callTitle=n.klass||n.name||n.src,X.callStore=q.ui,q.ui.canBind=!0,q.ui.dataTitle=f(e,"data_vars_title"),q.ui.exprPlaceholder=f(e,"component_props_expr"),q.ui.onToggleBind=(l,d)=>Wi(e,l,d),q.ui.onExpr=(l,d)=>xn(e,l,d),q.ui.onPickData=(l,d)=>x("dock:data-menu",{anchor:d,at:n.from,onPick:k=>xn(e,l,String(k?.var||"").trim())}),q.load(e,{key:`${n.src}::${o}`,src:n.src,params:a,bindings:r,readOnly:x("dock:is-locked")===!0}),q.watch(e,{src:n.src,write:l=>Xi(e,l,r)}),Gt(e);return}Ca(e,n.src).then(a=>{if(t.inspect?.key===o){if(!a.length){t.inspect={key:o,title:f(e,"component_props_values"),mode:"note",note:f(e,"component_props_values_none")};return}t.inspect={key:o,title:f(e,"component_props_values"),mode:"props",inheritLabel:f(e,"component_props_inherit"),rows:La(a,z().slice(n.from,n.to))}}})}function Xi(e,n,o={}){const a=t.rows.find(l=>l.id===O);if(a?.kind!=="component"||x("dock:is-locked"))return;let r=z(),i=a.to;for(const[l,d]of Object.entries(n||{})){if(l in o)continue;const k=r.length,m=Xt(r,{from:a.from,to:i},l,d);m!==r&&(i+=m.length-k,r=m)}r!==z()&&(He(r,{save:!0}),I(e))}function Wi(e,n,o){o?Fe.add(n):Fe.delete(n),uo(e,n,"",o),I(e)}function xn(e,n,o){Fe.add(n),uo(e,n,o,!0),I(e)}function uo(e,n,o,a){const r=t.rows.find(d=>d.id===O);if(r?.kind!=="component"||x("dock:is-locked"))return;const i=z(),l=Xt(i,r,n,o,{bound:a});l!==i&&He(l,{save:!0})}function rt(){const e=t.rows.find(n=>n.id===O);return e?.kind==="antlers"&&!x("dock:is-locked")?e:null}function Z(e,n){const o=rt();if(!o)return;const a=z(),r=n(a,o);r!==a&&(He(r),I(e))}function wn(e,n,o,a){const r=t.rows.find(d=>d.id===O);if(r?.kind!=="component"||x("dock:is-locked"))return;const i=z(),l=Xt(i,r,n,o,{bound:a});l!==i&&(He(l,{save:!0}),I(e))}function Zi(e,n){Z(e,(o,a)=>a.antlers==="loop"?Ye(o,a,a.loopKind==="collection"?"collection":"field",n):Da(o,a,n))}function Ji(e,n){const o=rt();if(!o||o.antlers!=="loop")return;const a=o.loopKind==="collection"?"collection":o.loopKind==="nav"?"nav":"field";if(n!==a){if(n==="nav"){Z(e,(r,i)=>Ye(r,i,"nav",Xe));return}if(n==="collection"){const r=co(e)[0]?.handle;if(!r)return;Z(e,(i,l)=>Ye(i,l,"collection",r));return}Z(e,(r,i)=>Ye(r,i,"field",i.handle||"items"))}}function Qi(e,n){Z(e,(o,a)=>Ra(o,a,n))}function el(e,n){if(!e||!n||Nn(n)||Kn(n.tag))return null;const o=_a(e,n);if(o<n.openTo)return null;const a=e.lastIndexOf(`
`,o-1)+1;return e.slice(a,o).trim()===""&&a>n.openTo?a-1:o}function it(e,n,o){if(ye)return;const a=(o||t.rows).find(r=>r.id===n);a&&(O=n,t.rows.forEach(r=>{r.current=r.id===n}),Kt(e,a),!Wt()&&(x("dock:reveal-html",{from:a.from,to:a.to,caret:el(z(),a)}),x("dock:tw-follow"),he({source:ee,type:Q.SVE_HTML_PICK_FOCUS,path:a.path},e)))}function tl(e,n){if(!n)return"";const o=[],a=(r,i)=>{for(const l of r||[]){const d=i||l.path===e;l.kind==="component"&&l.src===n&&o.push({path:l.path,inside:d}),a(l.children,d)}};return a(Se,!1),(o.find(r=>r.inside)||o[0])?.path||""}function nl(e,n){if(!n||!Y(e.document))return;ue=!1,ze(n),I(e);const o=t.rows.find(a=>a.path===n);o&&(it(e,o.id,t.rows),e.setTimeout(()=>{Y(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function Vt(e){if(Je)return;const n=()=>{t.editingId||t.dragging||(e.clearTimeout(et),et=e.setTimeout(()=>{Y(e.document)&&I(e)},80))},o=()=>{if(n(),x("dock:on-empty-page")===!0){const a=Ve(e,e.document);a.length===1&&pt(e,e.document,a,a[0].uid,"")}};Je=Dn("dock:html-changed",n),e.document.addEventListener("sve-page-structure",o),Dt=()=>{e.document.removeEventListener("sve-page-structure",o)}}function ol(e){Je?.(),Je=null,Dt?.(),Dt=null,e?.clearTimeout?.(et),et=0}function en(e){const n=Y(e.document);if(he({source:ee,type:Q.SVE_HTML_PICK,on:!1},e),ol(e),q.forget(),X.callOpen=!1,X.callStore=null,Gt(e),je(),W(),va(e),O=null,t.inspect=null,t.editingId=null,t.draft="",t.sections=[],t.pageBuilder=!1,t.layoutFile=!1,J="",e?.clearTimeout?.(Ce),!n){Pt(e);return}n.remove(),qt.headerTab==="html_tree"&&Yo(e,null),zo(e),En(e),Pn(e),Pt(e)}function kl(e,n){n.querySelector("[data-sve-html-tree-list]")||(n.id=Ge,Me(n,Vn,{title:f(e,"html_tree")}),n.querySelector("[data-sve-close]")?.addEventListener("click",()=>en(e)))}function yl(e){Vt(e),I(e)}function ho(e){const n=e.document;if(!Co(e,"html_tree"))return;if(Y(n)){Vt(e),I(e);return}if(!Zn(n))return;ue=!0,V.clear(),Go(e,[Ge]);const o=n.createElement("div");o.id=Ge,o.style.cssText=Xo,Me(o,Vn,{title:f(e,"html_tree")}),o.querySelector("[data-sve-close]")?.addEventListener("click",()=>en(e)),Wo(e,o),En(e),Pn(e),Pt(e),Vt(e),I(e)}function bl(e){if(Y(e.document)){en(e);return}ho(e)}zt("html-tree:open-section",e=>{const n=window,o=n.document,a=Ve(n,o),r=a.find(i=>i.uid===e||i.ids.includes(e));return r?(pt(n,o,a,r.uid,""),{uid:r.uid,ids:r.ids}):null});zt("html-tree:from-preview",({path:e,src:n,uid:o}={})=>{if(!An(window,e)){if(!e){al(window,o);return}nl(window,tl(e,n)||e)}});function al(e,n){!n||!ue||!Y(e.document)||!Ve(e,e.document).some(a=>a.uid===n||a.ids.includes(n))||(ue=!1,V.clear(),O=null,I(e))}zt("html-tree:arm-pick",e=>{const n=window;return e?(no(n,ht(z(),Gn(n))),!0):(Y(n.document)||he({source:ee,type:Q.SVE_HTML_PICK,on:!1},n),!0)});function _l(){ke.clear(),Ie.clear(),It.clear(),Ze.clear(),Be.length=0}export{di as HTML_TREE_STYLE_ID,gl as armHtmlTreePrefetch,_l as clearHtmlTreeTemplates,W as closeHtmlTreeMenu,en as closeHtmlTreePanel,fi as ensureHtmlTreeStyles,kl as fillHtmlTreePane,O as htmlTreeActiveId,Y as htmlTreePanel,et as htmlTreeTimer,Je as htmlTreeUnhook,ho as openHtmlTreePanel,I as renderHtmlTree,yl as showHtmlTreePane,ol as stopWatchHtmlTreeDock,bl as toggleHtmlTreePanel,Vt as watchHtmlTreeDock};
