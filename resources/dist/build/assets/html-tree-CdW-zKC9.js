import{r as Ue,R as fo,u as s,o as h,c as f,a as M,t as E,F as D,i as A,m as wn,f as w,n as mo,w as T,$ as oe,s as v,e as go,L as j,N as ko,aa as yo,a4 as bo,ad as Te,j as Et,ac as _o,Z as ce,aC as To,v as ln,A as xo,V as wo,aA as So,W as Sn,aD as Co,B as it,p as jt,q as Ut,U as Re,X as Lo,aE as Ho,aF as Eo}from"./addon-CSZnsACU.js";import{c as Cn,a as Po,o as $o,b as Mo,d as Io,T as Do,i as Oo,r as Ro,e as Fo,f as Ao,u as dn,l as cn}from"./section-create-VZvdHfng.js";import{canEditFields as Bo,currentSetHandle as No,openFieldsetOverlay as Ln,openGlobalFieldsOverlay as Ko}from"./section-fields-CPXvA66i.js";import{ap as t,aq as Vo,ar as jo,b as x,s as qt,i as ue,Z as Pt,ad as Uo,U as qo,ab as Hn,ac as En,O as un,q as Me,Y as Yo,V as zo,W as Xo,as as Go,at as hn,au as Pn,av as $n,n as Mn,aw as Wo,ax as Zo,o as In,ay as Jo,C as Dn,a0 as lt,t as dt,az as On,aA as Qo,aB as Yt,aC as ea,aD as ta,aE as na,a6 as oa,aF as aa,aG as sa,aH as ra,aI as ia,aJ as la,u as Rn,a8 as da,N as zt}from"./lp-cluster-80h5pxy0.js";import{H as ze,e as ca,a as ua}from"./ids-w-uWXFhx.js";import{_ as ct,o as Ne}from"./ChoiceDialog--4DtodLU.js";import{M as Q,S as ee}from"./protocol-YXBURS-N.js";import{C as X,D as ha,E as Ke,F as Xt,o as pa,A as va,G as Fn,l as fa,I as An,H as xe,J as ma,K as ga,L as Gt,c as ka,M as ya,b as ba,N as _a,O as Ta,P as xa,Q as wa,R as Sa,S as Ca,T as La,U as be,V as Ha,W as Ea,X as Pa,Y as $a,Z as pn,$ as qe,a0 as Ma,a1 as Ia}from"./component-extract-DiWjwYjn.js";import{w as ut,l as Da,N as Xe,J as Bn,K as Nn,L as Oa}from"./css-scope-DBNBIYn8.js";import{b as Ra}from"./html-pick-align-CLq5l-p4.js";import"./FieldsetOverlay-B58yfr5r.js";import"./ai-text-icon-B7uCWIwa.js";const yt=/\s*([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/y,Fa=/^\s*(?:([A-Za-z_$][\w$]*)|'([^'\\]*)'|"([^"\\]*)")\s*:\s*(true|false)\s*$/;function Aa(e){const n=String(e||"").replace(/\{\{[\s\S]*?\}\}/g,r=>" ".repeat(r.length)),o=n.match(/^<[a-zA-Z][\w:-]*/);if(!o)return null;let a=o[0].length;for(;a<n.length;){yt.lastIndex=a;const r=yt.exec(n);if(!r){a+=1;continue}if(r[1].toLowerCase()==="x-data")return r[2]??r[3]??r[4]??"";a=yt.lastIndex}return null}function Ba(e,n){const o=e[n];for(let a=n+1;a<e.length;a+=1)if(e[a]==="\\")a+=1;else if(e[a]===o)return a;return e.length-1}function Na(e){const n=String(e||""),o=n.search(/\S/);if(o===-1||n[o]!=="{")return[];const a=new Map;let r=0,i="";const l=()=>{const d=i.match(Fa);d&&a.set(d[1]??d[2]??d[3],d[4]==="true"),i=""};for(let d=o;d<n.length;d+=1){const k=n[d];if(k==='"'||k==="'"||k==="`"){const m=Ba(n,d);i+=n.slice(d,m+1),d=m;continue}if(k==="/"&&n[d+1]==="/"){const m=n.indexOf(`
`,d);d=m===-1?n.length:m-1;continue}if(k==="/"&&n[d+1]==="*"){const m=n.indexOf("*/",d+2);d=m===-1?n.length:m+1;continue}if(k==="{"||k==="["||k==="("){if(r+=1,r===1)continue}else if(k==="}"||k==="]"||k===")"){if(r-=1,r===0)break}else if(k===","&&r===1){l();continue}i+=k}return l(),[...a].map(([d,k])=>({key:d,value:k}))}const Ka={key:0,class:"sve-ht-inspect"},Va={class:"sve-ht-inspect__head"},ja={key:0,class:"sve-ht-inspect__note"},Ua={key:2,class:"sve-ht-inspect__props"},qa={class:"sve-ht-inspect__proplabel"},Ya={key:0},za=["value","disabled","onChange"],Xa={value:""},Ga=["value"],Wa=["value"],Za=["value","placeholder","onChange"],Ja=["title","disabled","onClick"],Qa=["title","disabled","onClick"],es={key:0,class:"sve-ht-inspect__seg"},ts=["data-active","disabled","onClick"],ns=["value","disabled"],os={key:0,value:""},as=["value"],ss=["value","disabled"],rs=["value"],is={key:3,class:"sve-ht-inspect__box"},ls=["value","placeholder","disabled","onKeydown"],ds=["title","disabled"],cs={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},us=["value","disabled"],hs=["value"],ps={key:0,class:"sve-ht-inspect__tick"},vs=["checked","disabled"],fs={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},ms=["value","disabled"],gs=["value"],ks={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},ys=["value","placeholder","disabled"],bs=["title","disabled"],_s={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Ts=["value","placeholder","disabled"],xs={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},ws=["value","placeholder","disabled"],Ss={key:6,class:"sve-ht-inspect__add"},Cs=["disabled","onClick"],bt='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',Ls='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',Hs={__name:"HtmlTreeInspector",setup(e){const n=Ue(null);fo(n,m=>t.onPropHost?.(m||null));const o=Ue(null),a=Ue(null);function r(m){t.onInspectCommit?.(m.target.value)}function i(m,y,u){!m||!y||(m.value=y,m.focus(),m.setSelectionRange(y.length,y.length),u(y))}function l(m,y){t.onInspectData?.(m.currentTarget,u=>t.onPropValue?.(y.handle,u,!0))}function d(m){t.onInspectData?.(m.currentTarget,y=>i(o.value,y,u=>t.onInspectCommit?.(u)))}function k(m){t.onInspectData?.(m.currentTarget,y=>i(a.value,y,u=>t.onLoopSortField?.(u)))}return(m,y)=>s(t).inspect?(h(),f("div",Ka,[M("div",Va,E(s(t).inspect.title),1),s(t).inspect.mode==="note"?(h(),f("div",ja,E(s(t).inspect.note),1)):s(t).inspect.mode==="statamic"?(h(),f("div",{key:1,ref_key:"propHost",ref:n,class:"sve-ht-inspect__form"},null,512)):s(t).inspect.mode==="props"?(h(),f("div",Ua,[(h(!0),f(D,null,A(s(t).inspect.rows,u=>(h(),f("label",{key:u.handle,class:"sve-ht-inspect__prop"},[M("span",qa,[wn(E(u.label)+" ",1),u.bound?(h(),f("em",Ya,":")):w("",!0)]),M("span",{class:mo(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":u.type==="select"||u.type==="link"}])},[u.type==="select"&&!u.bound?(h(),f("select",{key:0,value:u.value,disabled:!s(t).canEdit,onChange:C=>s(t).onPropValue?.(u.handle,C.target.value,!1)},[M("option",Xa,E(u.placeholder||s(t).inspect.inheritLabel),1),u.value&&!u.options.includes(u.value)?(h(),f("option",{key:0,value:u.value},E(u.value),9,Ga)):w("",!0),(h(!0),f(D,null,A(u.options,C=>(h(),f("option",{key:C,value:C},E(C),9,Wa))),128))],40,za)):(h(),f("input",{key:1,type:"text",value:u.value,placeholder:u.placeholder||s(t).inspect.inheritLabel,onChange:C=>s(t).onPropValue?.(u.handle,C.target.value,u.bound)},null,40,Za)),u.type==="link"?(h(),f("button",{key:2,type:"button","data-sve-ht-data":"",title:s(t).pageTitle,disabled:!s(t).canEdit,onClick:C=>s(t).onPropPage?.(C.currentTarget,u.handle),innerHTML:Ls},null,8,Ja)):w("",!0),M("button",{type:"button","data-sve-ht-data":"",title:s(t).dataTitle,disabled:!s(t).canEdit,onClick:C=>l(C,u),innerHTML:bt},null,8,Qa)],2)]))),128))])):(h(),f(D,{key:3},[s(t).inspect.mode==="loop"?(h(),f("div",es,[(h(!0),f(D,null,A(s(t).inspect.kinds,u=>(h(),f("button",{key:u.id,type:"button","data-active":u.id===s(t).inspect.loopKind?"":void 0,disabled:!s(t).canEdit,onClick:C=>s(t).onLoopKind?.(u.id)},E(u.label),9,ts))),128))])):w("",!0),s(t).inspect.mode==="loop"&&s(t).inspect.loopKind==="collection"?(h(),f("select",{key:s(t).inspect.key+":"+s(t).inspect.value,value:s(t).inspect.value,disabled:!s(t).canEdit,onChange:r},[s(t).inspect.value?w("",!0):(h(),f("option",os,E(s(t).inspect.placeholder),1)),(h(!0),f(D,null,A(s(t).inspect.collections,u=>(h(),f("option",{key:u.handle,value:u.handle},E(u.title),9,as))),128))],40,ns)):s(t).inspect.mode==="loop"&&s(t).inspect.loopKind==="nav"?(h(),f("select",{key:s(t).inspect.key+":nav:"+s(t).inspect.value,value:s(t).inspect.value,disabled:!s(t).canEdit,onChange:r},[(h(!0),f(D,null,A(s(t).inspect.navs,u=>(h(),f("option",{key:u.handle,value:u.handle},E(u.title),9,rs))),128))],40,ss)):(h(),f("div",is,[(h(),f("input",{ref_key:"field",ref:o,key:s(t).inspect.key,type:"text",value:s(t).inspect.value,placeholder:s(t).inspect.placeholder,disabled:!s(t).canEdit,spellcheck:"false",onKeydown:[y[0]||(y[0]=T(()=>{},["stop"])),oe(T(r,["prevent"]),["enter"])],onBlur:r},null,40,ls)),M("button",{type:"button","data-sve-ht-data":"",title:s(t).dataTitle,disabled:!s(t).canEdit,innerHTML:bt,onMousedown:y[1]||(y[1]=T(()=>{},["prevent"])),onClick:T(d,["stop","prevent"])},null,40,ds)])),s(t).inspect.nav?(h(),f(D,{key:4},[M("div",cs,E(s(t).inspect.nav.depthTitle),1),(h(),f("select",{key:s(t).inspect.key+":depth:"+s(t).inspect.nav.depth,value:s(t).inspect.nav.depth,disabled:!s(t).canEdit,onChange:y[2]||(y[2]=u=>s(t).onLoopDepth?.(u.target.value))},[(h(!0),f(D,null,A(s(t).inspect.nav.depths,u=>(h(),f("option",{key:u.id,value:u.id},E(u.label),9,hs))),128))],40,us)),s(t).inspect.nav.homeAsked?(h(),f("label",ps,[M("input",{type:"checkbox",checked:s(t).inspect.nav.includeHome,disabled:!s(t).canEdit,onChange:y[3]||(y[3]=u=>s(t).onLoopIncludeHome?.(u.target.checked))},null,40,vs),M("span",null,E(s(t).inspect.nav.homeLabel),1)])):w("",!0)],64)):w("",!0),s(t).inspect.sort?(h(),f(D,{key:5},[M("div",fs,E(s(t).inspect.sort.title),1),(h(),f("select",{key:s(t).inspect.key+":dir:"+s(t).inspect.sort.dir,value:s(t).inspect.sort.dir,disabled:!s(t).canEdit,onChange:y[4]||(y[4]=u=>s(t).onLoopSortDir?.(u.target.value))},[(h(!0),f(D,null,A(s(t).inspect.sort.dirs,u=>(h(),f("option",{key:u.id,value:u.id},E(u.label),9,gs))),128))],40,ms)),s(t).inspect.sort.needsField?(h(),f("div",ks,[(h(),f("input",{ref_key:"sortField",ref:a,key:s(t).inspect.key+":field",type:"text",value:s(t).inspect.sort.field,placeholder:s(t).inspect.sort.placeholder,disabled:!s(t).canEdit,spellcheck:"false",onKeydown:[y[5]||(y[5]=T(()=>{},["stop"])),y[6]||(y[6]=oe(T(u=>s(t).onLoopSortField?.(u.target.value),["prevent"]),["enter"]))],onBlur:y[7]||(y[7]=u=>s(t).onLoopSortField?.(u.target.value))},null,40,ys)),s(t).inspect.sort.pickable?(h(),f("button",{key:0,type:"button","data-sve-ht-data":"",title:s(t).dataTitle,disabled:!s(t).canEdit,innerHTML:bt,onMousedown:y[8]||(y[8]=T(()=>{},["prevent"])),onClick:T(k,["stop","prevent"])},null,40,bs)):w("",!0)])):w("",!0),M("div",_s,E(s(t).inspect.limit.title),1),(h(),f("input",{key:s(t).inspect.key+":limit",type:"number",min:"1",value:s(t).inspect.limit.value,placeholder:s(t).inspect.limit.placeholder,disabled:!s(t).canEdit,onKeydown:[y[9]||(y[9]=T(()=>{},["stop"])),y[10]||(y[10]=oe(T(u=>s(t).onLoopLimit?.(u.target.value),["prevent"]),["enter"]))],onBlur:y[11]||(y[11]=u=>s(t).onLoopLimit?.(u.target.value))},null,40,Ts)),M("div",xs,E(s(t).inspect.offset.title),1),(h(),f("input",{key:s(t).inspect.key+":offset",type:"number",min:"0",value:s(t).inspect.offset.value,placeholder:s(t).inspect.offset.placeholder,disabled:!s(t).canEdit,onKeydown:[y[12]||(y[12]=T(()=>{},["stop"])),y[13]||(y[13]=oe(T(u=>s(t).onLoopOffset?.(u.target.value),["prevent"]),["enter"]))],onBlur:y[14]||(y[14]=u=>s(t).onLoopOffset?.(u.target.value))},null,40,ws))],64)):w("",!0),s(t).inspect.branches?.length?(h(),f("div",Ss,[(h(!0),f(D,null,A(s(t).inspect.branches,u=>(h(),f("button",{key:u.id,type:"button",disabled:!s(t).canEdit,onClick:C=>s(t).onAddBranch?.(u.id)},E(u.label),9,Cs))),128))])):w("",!0)],64))])):w("",!0)}},Es=ct(Hs,[["__scopeId","data-v-7ecb01a5"]]),Ps={class:"sve-html-tree"},$s={class:"sve-pane-bar","data-sve-pane-bar":""},Ms={"data-sve-right-title":""},Is={"data-sve-right-actions":""},Ds=["aria-pressed","title","aria-label"],Os=["title"],Rs={class:"sve-ht-used-by__label"},Fs={class:"sve-ht-used-by__chips"},As=["title","onClick"],Bs={key:1,class:"sve-ht-used-by__chip"},Ns={key:0,class:"sve-ht-used-by__empty"},Ks={class:"sve-ht-tools"},Vs=["title"],js=["placeholder","aria-label","value"],Us=["aria-label"],qs=["title","aria-label"],Ys=["title","aria-label"],zs={key:2,class:"sve-tree-exit"},Xs=["title"],Gs=["title"],Ws='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',Zs='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',Js='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',Qs='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',er='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/></svg>',tr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',nr={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const n=v(window,"html_tree_search");t.layers=Vo(window);const o=v(window,"html_tree_layers_on"),a=v(window,"html_tree_layers_off");function r(){jo(window,!t.layers)}const i=Cn(window),l=v(window,"section_new"),d=v(window,"html_tree_add_element"),k=v(window,"html_tree_sections_slot"),m=v(window,"html_tree_sections_no_field");function y(){const b=t.templateSections.length?t.templateSections:[yo(window)],L=new Set(t.rows.filter($=>$.kind==="sections").map($=>$.tag));return b.filter($=>!L.has($)).map($=>({tag:`sections:${$}`,label:b.length>1?`${k} · ${$}`:k,noField:!t.templateSections.length}))}const u=Ue(!1),C=v(window,"section_import");function S(){u.value=!1}async function F(b){if(!b)return;await bo(),t.onRefresh?.();const L=x("html-tree:open-section",b);L&&Ro(window,L.ids)}function H(){const b=t.rows.find(L=>L.current&&!L.context&&!L.synthetic)||null;return b?.lockedIn?t.rows.filter(L=>L.locked&&L.from<=b.from&&L.to>=b.to).sort((L,$)=>L.from-$.from)[0]||null:b}function te(b){const L=b.getBoundingClientRect(),$=H();let I=null;const K=(B,Ee,se="")=>()=>{I?.dismiss(),I=null,S();const vt=Oo(window,B,$,Ee);vt!==null&&(t.selectFrom={at:vt,left:4},se&&window.Statamic?.$toast?.info?.(se))};I=Ne(document,Ke,{items:[...Do.map(B=>({label:B,onPick:K(B,`<${B}>`)})),...y().map(B=>({label:B.label,onPick:K(B.tag,B.label,B.noField?m:"")}))],x:Math.round(L.left),y:Math.round(L.bottom+4),onClose:()=>{I=null,S()}})}function ne(b){if(!u.value){if(u.value=!0,!(t.sections.length||t.pageBuilder)){te(b.currentTarget);return}(async()=>{const L=await Po(window);if(!L){S();return}const $=t.sections.length?t.sections[t.sections.length-1].uid:null,I=K=>{S(),F(K?.uid)};if(L==="static"){$o(window,{afterUid:$,onDone:I,onError:S,onClose:S});return}Mo(window,{afterUid:$,onDone:I,onError:S,onClose:S})})()}}function g(){if(u.value)return;u.value=!0;const b=!!(t.sections.length||t.pageBuilder);Io(window,{intoTemplate:!b,after:b?null:H(),afterUid:b&&t.sections.length?t.sections[t.sections.length-1].uid:null,onDone:L=>{if(S(),b){F(L?.uid);return}Number.isInteger(L?.at)&&(t.selectFrom={at:L.at,left:4})},onError:S,onClose:S})}function p(b){const L=!!t.query;t.query=b,L!==!!b&&t.onQuery?.()}return(b,L)=>(h(),f("div",Ps,[M("div",$s,[M("div",Ms,E(e.title),1),M("div",Is,[M("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":s(t).layers?"true":"false",title:s(t).layers?s(a):s(o),"aria-label":s(t).layers?s(a):s(o),innerHTML:Ws,onClick:r},null,8,Ds),L[5]||(L[5]=go('<button type="button" data-sve-right-pin aria-pressed="false" data-v-9a4a7640></button><button type="button" data-sve-close aria-label="Close" data-v-9a4a7640><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-9a4a7640><path d="M18 6 6 18" data-v-9a4a7640></path><path d="m6 6 12 12" data-v-9a4a7640></path></svg></button>',2))])]),s(t).usedBy?(h(),f("div",{key:0,class:"sve-ht-used-by",title:s(t).usedBy.hint||null},[M("span",Rs,[M("span",{class:"sve-ht-used-by__icon","aria-hidden":"true",innerHTML:er}),wn(" "+E(s(t).usedBy.label),1)]),M("span",Fs,[(h(!0),f(D,null,A(s(t).usedBy.items,$=>(h(),f(D,{key:$.kind+":"+$.name},[$.onOpen?(h(),f("button",{key:0,type:"button",class:"sve-ht-used-by__chip sve-ht-used-by__chip--open",title:$.openLabel,onClick:I=>$.onOpen(I.currentTarget)},E($.name),9,As)):(h(),f("span",Bs,E($.name),1))],64))),128)),s(t).usedBy.empty?(h(),f("span",Ns,E(s(t).usedBy.empty),1)):w("",!0)])],8,Os)):w("",!0),M("div",Ks,[M("label",{class:"sve-ht-search",title:s(n)},[M("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:Qs}),M("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:s(n),"aria-label":s(n),value:s(t).query,autocomplete:"off",spellcheck:"false",onInput:L[0]||(L[0]=$=>p($.target.value)),onKeydown:[L[1]||(L[1]=T(()=>{},["stop"])),L[2]||(L[2]=oe(T($=>p(""),["prevent"]),["escape"]))]},null,40,js),s(t).query?(h(),f("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":s(n),innerHTML:tr,onClick:L[3]||(L[3]=$=>p(""))},null,8,Us)):w("",!0)],8,Vs),s(i)&&(s(t).sections.length||s(t).pageBuilder||s(t).rows.length&&!s(t).layoutFile)?(h(),f("button",{key:0,type:"button",class:"sve-ht-new",title:s(t).sections.length||s(t).pageBuilder?s(l):s(d),"aria-label":s(t).sections.length||s(t).pageBuilder?s(l):s(d),innerHTML:Zs,onClick:ne},null,8,qs)):w("",!0),s(i)&&(s(t).sections.length||s(t).pageBuilder||s(t).rows.length&&!s(t).layoutFile)?(h(),f("button",{key:1,type:"button",class:"sve-ht-import",title:s(C),"aria-label":s(C),innerHTML:Js,onClick:g},null,8,Ys)):w("",!0)]),s(X).inSidebar?w("",!0):(h(),j(ha,{key:1})),L[6]||(L[6]=M("div",{"data-sve-html-tree-list":""},null,-1)),ko(Es),s(t).exitOpen&&!s(X).inSidebar?(h(),f("div",zs,[M("span",{class:"sve-tree-exit__name",title:s(t).exitName},E(s(t).exitName),9,Xs),M("button",{type:"button",class:"sve-tree-exit__go",title:s(t).exitTitle,onClick:L[4]||(L[4]=$=>s(t).onExit?.())},E(s(t).exitLabel),9,Gs)])):w("",!0)]))}},Kn=ct(nr,[["__scopeId","data-v-9a4a7640"]]);function Vn(e){return String(e||"").trim().toLowerCase()}function $t(e,n){return n?[e.name,e.tag,e.klass,e.label,e.src].filter(o=>typeof o=="string"&&o).join(" ").toLowerCase().includes(n):!0}function or(e,n){const o=Vn(n);if(!o)return{rows:e,hits:new Set};const a=new Set;for(const l of e)$t(l,o)&&a.add(l.path);const r=[...a];return{rows:e.filter(l=>a.has(l.path)||r.some(d=>d.startsWith(`${l.path}/`))),hits:a}}const ar=["title"],sr={"data-sve-ht-indent":"","aria-hidden":"true"},rr=["data-sve-ht-cat"],ir={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},lr={key:2,"data-sve-ht-letter":""},dr=["innerHTML"],cr=["title"],ur=["title"],hr={key:1,"data-sve-ht-kind":""},pr={key:3,"data-sve-ht-name":""},vr={key:4,"data-sve-ht-actions":""},fr=["data-on","title","innerHTML"],mr=["title"],gr={key:5,"data-sve-ht-actions":""},kr=["data-on","title","innerHTML"],yr=["data-on","title","innerHTML"],br=["disabled","title","innerHTML"],_r=["disabled","title"],Tr=["disabled","title"],xr=["data-on","disabled","title","aria-pressed","innerHTML"],wr=["disabled","title"],Sr=["data-sve-ht-id"],vn='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',Cr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',Lr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Hr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',Er='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',Pr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',$r='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',fn='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6.5" width="20" height="11" rx="5.5"/><circle cx="7.5" cy="12" r="3" fill="currentColor" stroke="none"/></svg>',mn='<svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M7.5 5.5h9a6.5 6.5 0 0 1 0 13h-9a6.5 6.5 0 0 1 0-13ZM16.5 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6Z"/></svg>',Mr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',Ir='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-.9"/></svg>',Dr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',Or={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const n=Bo(window),o=v(window,"section_fields");function a(){const g=No();if(!g){window.Statamic?.$toast?.error(v(window,"section_fields_none"));return}Ln(window,g)}function r(g){return g.synthetic?g.frame==="main"?t.frameMainTitle:g.frame==="template"?t.frameTemplateTitle:t.frameOpenTitle:g.kind==="component"?g.src?`partial:${g.src}`:g.tag:g.name?`${g.tag} ${g.name}`:g.tag}function i(g){return!!g.section}function l(g){return!!g.frame}function d(g){return g.kind==="slot"}function k(g,p){l(p)||d(p)||(i(p)?t.onSectionPointerDown?.(g,p.section):p.sectionRoot?t.onSectionPointerDown?.(g,p.sectionRoot):t.onPointerDown?.(g,p.id))}function m(g){if(g.synthetic){t.onFrame?.(g.frame);return}if(i(g)){t.onSection?.(g.section);return}t.onSelect?.(g.id)}function y(g,p){const b={"data-sve-ht-id":g.id};return g.locked&&(b["data-sve-ht-locked"]=""),g.current&&(b["data-sve-ht-current"]=""),g.hidden&&(b["data-sve-ht-hidden"]=""),b["data-sve-ht-cat"]=g.cat||"other",b["data-sve-ht-depth"]=String(g.depth),p&&(b["data-sve-ht-dim"]=""),i(g)&&(b["data-sve-ht-sec"]=""),l(g)&&(b["data-sve-ht-frame"]=g.frame),!i(g)&&t.dropId===g.id&&t.dropPlace&&(b["data-sve-ht-drop"]=t.dropPlace),b}function u(g){return!!g.fixed}function C(g){return g.kind==="sections"}function S(g){return!!(g.locked||g.lockedIn)}function F(g){return!g.lockedIn&&!u(g)}function H(g){return!u(g)&&!C(g)&&!S(g)&&(!g.hidden||g.wrapFrom!=null)}function te(g){return!!g.sectionRoot||!!g.section}function ne(g){return t.canEdit&&!S(g)||te(g)}return(g,p)=>(h(),f(D,null,[M("div",Te({"data-sve-ht-row":""},y(e.row,e.dim),{role:"button",tabindex:"0",title:r(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:p[41]||(p[41]=b=>m(e.row)),onDblclick:p[42]||(p[42]=T(b=>e.row.synthetic?s(t).onFrameEnter?.(e.row.frame):l(e.row)||d(e.row)||i(e.row)?null:s(t).onRename?.(e.row.id),["prevent"])),onKeydown:[p[43]||(p[43]=oe(T(b=>m(e.row),["prevent"]),["enter"])),p[44]||(p[44]=oe(T(b=>m(e.row),["prevent"]),["space"]))],onPointerdown:p[45]||(p[45]=b=>k(b,e.row)),onPointerenter:p[46]||(p[46]=b=>i(e.row)?s(t).onSectionHover?.(e.row.section):null),onContextmenu:p[47]||(p[47]=T(b=>l(e.row)||d(e.row)||i(e.row)?null:s(t).onContext?.(b,e.row.id),["prevent","stop"]))}),[M("span",sr,[(h(!0),f(D,null,A(e.row.guides||[],(b,L)=>(h(),f("i",{key:L,"data-sve-ht-cat":b},null,8,rr))),128))]),e.row.hasChildren||e.row.emptyBlock?(h(),f("button",Te({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?s(t).mainShut:e.row.shut)?{"data-sve-ht-shut":""}:{},{innerHTML:Cr,onClick:p[0]||(p[0]=T(b=>e.row.synthetic?s(t).onFrameTwist?.():i(e.row)?s(t).onSection?.(e.row.section):s(t).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:p[1]||(p[1]=T(()=>{},["stop"])),onDblclick:p[2]||(p[2]=T(()=>{},["stop"]))}),null,16)):(h(),f("span",ir)),e.row.letter?(h(),f("span",lr,E(e.row.letter),1)):(h(),f("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,dr)),M("span",{"data-sve-ht-text":"",title:s(t).renameTitle},[!e.row.kind&&!i(e.row)&&!l(e.row)?(h(),f("button",{key:0,type:"button","data-sve-ht-tag":"",title:s(t).tagTitle,onClick:p[3]||(p[3]=T(()=>{},["stop","prevent"])),onPointerdown:p[4]||(p[4]=T(()=>{},["stop"])),onDblclick:p[5]||(p[5]=T(b=>s(t).onTagChange?.(b,e.row.id),["stop","prevent"]))},E(e.row.tag),41,ur)):(h(),f("span",hr,E(e.row.tag),1)),s(t).editingId===e.row.id&&!i(e.row)?Et((h(),f("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":p[6]||(p[6]=b=>s(t).draft=b),onMousedown:p[7]||(p[7]=T(()=>{},["stop"])),onPointerdown:p[8]||(p[8]=T(()=>{},["stop"])),onClick:p[9]||(p[9]=T(()=>{},["stop"])),onDblclick:p[10]||(p[10]=T(()=>{},["stop"])),onKeydown:[p[11]||(p[11]=T(()=>{},["stop"])),p[12]||(p[12]=oe(T(b=>s(t).onRenameCommit?.(),["prevent"]),["enter"])),p[13]||(p[13]=oe(T(b=>s(t).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:p[14]||(p[14]=b=>s(t).onRenameCommit?.())},null,544)),[[_o,s(t).draft]]):(h(),f("span",pr,E(e.row.name),1))],8,cr),l(e.row)?(h(),f("span",vr,[e.row.alpineNth>=0?(h(),f("button",{key:0,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:s(t).alpineTitle,innerHTML:e.row.alpineSet?mn:fn,onClick:p[15]||(p[15]=T(b=>s(t).onAlpineState?.(b,e.row.id),["stop","prevent"])),onPointerdown:p[16]||(p[16]=T(()=>{},["stop"])),onDblclick:p[17]||(p[17]=T(()=>{},["stop"]))},null,40,fr)):w("",!0),e.row.frame!=="main"&&s(n)?(h(),f("button",{key:1,type:"button","data-sve-ht-fields":"",title:s(t).frameFieldsTitle,innerHTML:vn,onClick:p[18]||(p[18]=T(b=>s(t).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:p[19]||(p[19]=T(()=>{},["stop"])),onDblclick:p[20]||(p[20]=T(()=>{},["stop"]))},null,40,mr)):w("",!0)])):!i(e.row)&&!d(e.row)?(h(),f("span",gr,[e.row.videoNth>=0?(h(),f("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?s(t).videoPlayTitle:s(t).videoHoldTitle,innerHTML:e.row.videoHeld?$r:Pr,onClick:p[21]||(p[21]=T(b=>s(t).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:p[22]||(p[22]=T(()=>{},["stop"])),onDblclick:p[23]||(p[23]=T(()=>{},["stop"]))},null,40,kr)):w("",!0),e.row.alpineNth>=0?(h(),f("button",{key:1,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:s(t).alpineTitle,innerHTML:e.row.alpineSet?mn:fn,onClick:p[24]||(p[24]=T(b=>s(t).onAlpineState?.(b,e.row.id),["stop","prevent"])),onPointerdown:p[25]||(p[25]=T(()=>{},["stop"])),onDblclick:p[26]||(p[26]=T(()=>{},["stop"]))},null,40,yr)):w("",!0),H(e.row)?(h(),f("button",{key:2,type:"button","data-sve-ht-eye":"",disabled:!s(t).canEdit,title:s(t).canEdit?e.row.hidden?s(t).showTitle:s(t).hideTitle:s(t).lockedTitle,innerHTML:e.row.hidden?Hr:Lr,onClick:p[27]||(p[27]=T(b=>s(t).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:p[28]||(p[28]=T(()=>{},["stop"])),onDblclick:p[29]||(p[29]=T(()=>{},["stop"]))},null,40,br)):w("",!0),s(n)&&e.row.fieldsIcon?(h(),f("button",{key:3,type:"button","data-sve-ht-fields":"",disabled:!s(t).canEdit,title:s(t).canEdit?s(o):s(t).lockedTitle,innerHTML:vn,onClick:T(a,["stop","prevent"]),onPointerdown:p[30]||(p[30]=T(()=>{},["stop"])),onDblclick:p[31]||(p[31]=T(()=>{},["stop"]))},null,40,_r)):w("",!0),!u(e.row)&&!C(e.row)?(h(),f("button",{key:4,type:"button","data-sve-ht-dup":"",disabled:!ne(e.row),title:ne(e.row)?s(t).duplicateTitle:s(t).lockedTitle,innerHTML:Er,onClick:p[32]||(p[32]=T(b=>s(t).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:p[33]||(p[33]=T(()=>{},["stop"])),onDblclick:p[34]||(p[34]=T(()=>{},["stop"]))},null,40,Tr)):w("",!0),F(e.row)?(h(),f("button",{key:5,type:"button","data-sve-ht-lock":"","data-on":e.row.locked?"":null,disabled:!s(t).canEdit||e.row.locked&&!s(t).canUnlock,title:e.row.locked?s(t).canUnlock?s(t).unlockTitle:s(t).lockedByTitle:s(t).lockTitle,"aria-pressed":e.row.locked?"true":"false",innerHTML:e.row.locked?Mr:Ir,onClick:p[35]||(p[35]=T(b=>s(t).onLock?.(e.row.id),["stop","prevent"])),onPointerdown:p[36]||(p[36]=T(()=>{},["stop"])),onDblclick:p[37]||(p[37]=T(()=>{},["stop"]))},null,40,xr)):w("",!0),u(e.row)?w("",!0):(h(),f("button",{key:6,type:"button","data-sve-ht-del":"",disabled:!ne(e.row),title:ne(e.row)?s(t).deleteTitle:s(t).lockedTitle,innerHTML:Dr,onClick:p[38]||(p[38]=T(b=>s(t).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:p[39]||(p[39]=T(()=>{},["stop"])),onDblclick:p[40]||(p[40]=T(()=>{},["stop"]))},null,40,wr))])):w("",!0)],16,ar),e.row.emptyBlock&&!e.row.shut?(h(),f("div",Te({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},s(t).dropId===e.row.id&&s(t).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),E(s(t).slotText),17,Sr)):w("",!0)],64))}},z=ct(Or,[["__scopeId","data-v-25ebfb99"]]),Rr=["data-sve-ht-look","data-sve-ht-layers"],Fr={key:0,class:"sve-ht-page-template"},Ar={key:0,class:"sve-ht-page-template__text"},Br={class:"sve-ht-page-template__note"},Nr={key:1,class:"sve-ht-empty"},Kr={key:2,class:"sve-ht-empty"},Vr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},jr={key:0,class:"sve-ht-empty"},Ur={key:0,class:"sve-ht-empty"},qr=["data-sve-ht-under-main"],Yr={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},zr={key:0,class:"sve-ht-empty"},Xr=["data-sve-ht-under-main"],Gr=["data-dim"],Wr={key:0,class:"sve-ht-empty"},Zr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},Jr={key:0,class:"sve-ht-empty"},Qr={key:4,"data-sve-ht-branch":"","data-sve-ht-cat":"component"},ei={__name:"HtmlTreeList",setup(e){const n=ce(()=>Vn(t.query)),o=ce(()=>or(t.rows,n.value)),a=ce(()=>o.value.rows),r=ce(()=>n.value?t.sections.filter(S=>$t(S.row,n.value)||S.current&&S.ready&&a.value.length>0):t.sections);function i(S){return!!S&&(!n.value||$t(S,n.value))}function l(S){const F=t.frame?.kind;return t.inComponent||(F==="header"||F==="footer")&&F!==S}const d=ce(()=>t.frame?.kind==="header"||t.frame?.kind==="footer"),k=ce(()=>!!t.frame&&["header","main","footer"].some(S=>i(t.frame[S]))),m=ce(()=>!!t.frame&&(t.frame.kind==="main"||i(t.frame.main))),y=ce(()=>!!n.value&&!r.value.length&&!a.value.length&&!k.value);function u(S){return!!n.value&&!o.value.hits.has(S.path)}function C(S){const F={"data-sve-ht-sec-uid":S.uid};return S.current&&(F["data-sve-ht-branch"]="",F["data-sve-ht-cat"]=S.row?.cat||"layout"),t.sectionDrop&&t.sectionDrop.uid===S.uid&&(F["data-sve-ht-drop"]=t.sectionDrop.place),F}return(S,F)=>(h(),f("div",Te({class:"sve-ht-root","data-sve-ht-look":s(t).layers?"tags":s(t).look,"data-sve-ht-layers":s(t).layers?"":null,style:s(t).familyStyle},s(t).dragging?{"data-sve-ht-dragging":""}:{}),[s(t).pageTemplate?(h(),f("div",Fr,[s(t).pageTemplate.text?(h(),f("p",Ar,E(s(t).pageTemplate.text),1)):w("",!0),M("p",Br,E(s(t).pageTemplate.note),1),s(t).pageTemplate.canOpen?(h(),f("button",{key:1,type:"button",class:"sve-ht-page-template__open",onClick:F[0]||(F[0]=H=>s(t).pageTemplate.onOpen(H.currentTarget))},E(s(t).pageTemplate.openLabel),1)):w("",!0)])):!s(t).rows.length&&!s(t).sections.length&&!s(t).frame?(h(),f("div",Nr,E(s(t).emptyText),1)):y.value?(h(),f("div",Kr,E(s(t).searchEmpty),1)):w("",!0),s(t).frame||s(t).sections.length?(h(),f(D,{key:3},[s(t).frame?(h(),f(D,{key:0},[s(t).frame.kind==="header"?(h(),f("div",Vr,[(h(!0),f(D,null,A(a.value,H=>(h(),j(z,{key:H.id,row:H,dim:u(H)},null,8,["row","dim"]))),128)),s(t).rows.length?w("",!0):(h(),f("div",jr,E(s(t).emptyText),1))])):!d.value&&i(s(t).frame.header)?(h(),j(z,{key:1,row:s(t).frame.header,dim:l("header")},null,8,["row","dim"])):w("",!0)],64)):w("",!0),d.value?w("",!0):(h(),f("div",To(Te({key:1},s(t).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[s(t).frame?.kind==="main"?(h(),f(D,{key:0},[(h(!0),f(D,null,A(a.value,H=>(h(),j(z,{key:H.id,row:H,dim:u(H)},null,8,["row","dim"]))),128)),s(t).rows.length?w("",!0):(h(),f("div",Ur,E(s(t).emptyText),1))],64)):s(t).frame&&i(s(t).frame.main)?(h(),j(z,{key:1,row:s(t).frame.main,dim:l("main")},null,8,["row","dim"])):w("",!0),s(t).frame?.kind==="template"?Et((h(),f("div",{key:2,"data-sve-ht-frame-body":"","data-sve-ht-under-main":m.value?"":null},[M("div",Yr,[(h(!0),f(D,null,A(a.value,H=>(h(),j(z,{key:H.id,row:H,dim:u(H)},null,8,["row","dim"]))),128)),s(t).rows.length?w("",!0):(h(),f("div",zr,E(s(t).emptyText),1))])],8,qr)),[[ln,!s(t).mainShut]]):w("",!0),s(t).sections.length||s(t).frame?Et((h(),f("div",{key:3,"data-sve-ht-frame-body":"","data-sve-ht-under-main":m.value?"":null},[s(t).frame?.template&&i(s(t).frame.template)?(h(),j(z,{key:0,row:s(t).frame.template,dim:l("template")},null,8,["row","dim"])):w("",!0),s(t).frame&&!s(t).frame.template&&!s(t).sections.length&&!n.value?(h(),f("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":l("")?"":void 0},E(s(t).frameEmptyText),9,Gr)):w("",!0),(h(!0),f(D,null,A(r.value,H=>(h(),f("div",Te({key:H.uid},{ref_for:!0},C(H)),[H.ready?(h(),f(D,{key:0},[(h(!0),f(D,null,A(a.value,te=>(h(),j(z,{key:te.id,row:te,dim:u(te)},null,8,["row","dim"]))),128)),s(t).rows.length?w("",!0):(h(),f("div",Wr,E(s(t).emptyText),1))],64)):(h(),j(z,{key:1,row:H.row,dim:l("")},null,8,["row","dim"]))],16))),128))],8,Xr)),[[ln,!s(t).frame||!s(t).mainShut]]):w("",!0)],16)),s(t).frame?(h(),f(D,{key:2},[s(t).frame.kind==="footer"?(h(),f("div",Zr,[(h(!0),f(D,null,A(a.value,H=>(h(),j(z,{key:H.id,row:H,dim:u(H)},null,8,["row","dim"]))),128)),s(t).rows.length?w("",!0):(h(),f("div",Jr,E(s(t).emptyText),1))])):!d.value&&i(s(t).frame.footer)?(h(),j(z,{key:1,row:s(t).frame.footer,dim:l("footer")},null,8,["row","dim"])):w("",!0)],64)):w("",!0)],64)):s(t).inComponent&&s(t).rows.length?(h(),f("div",Qr,[(h(!0),f(D,null,A(a.value,H=>(h(),j(z,{key:H.id,row:H,dim:u(H)},null,8,["row","dim"]))),128))])):s(t).rows.length?(h(!0),f(D,{key:5},A(a.value,H=>(h(),j(z,{key:H.id,row:H,dim:u(H)},null,8,["row","dim"]))),128)):w("",!0)],16,Rr))}},_t=ct(ei,[["__scopeId","data-v-d0376715"]]);let Tt=null;function ti(e){return Tt||(Tt=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():{pages:[]}).then(n=>Array.isArray(n.pages)?n.pages:[]).catch(()=>[])),Tt}let Ge=null;function xt(){Ge?.dismiss(),Ge=null}function ni(e,n,o){xt();const a=n?.getBoundingClientRect?.(),r={x:a?a.left:0,y:a?a.bottom+4:0};ti(e).then(i=>{const l=i.length?i.map(d=>({label:d.title||d.url,onPick:()=>{xt(),o(d.url)}})):[{label:v(e,"component_props_pages_none"),onPick:null}];xt(),Ge=Ne(e.document,Ke,{items:l,x:r.x,y:r.y,onClose:()=>{Ge=null}})})}const jn="sve-html-tree-labels";function Un(){try{const e=globalThis.localStorage?.getItem(jn);if(!e)return{};const n=JSON.parse(e);return n&&typeof n=="object"?n:{}}catch{return{}}}function oi(e){try{globalThis.localStorage?.setItem(jn,JSON.stringify(e))}catch{}}function qn(e){return String(e||"_")}function Yn(e){const n=Un()[qn(e)];return n&&typeof n=="object"?{...n}:{}}function ai(e,n,o){const a=o?.[n];return typeof a=="string"&&a.trim()?a.replace(/\s+/g," ").trim():String(e||"").trim()}function si(e,n,o,a){if(!n)return;const r=qn(e),i=Un(),l={...i[r]||{}},d=String(o||"").replace(/\s+/g," ").trim(),k=String(a||"").trim();!d||d===k?delete l[n]:l[n]=d,Object.keys(l).length?i[r]=l:delete i[r],oi(i)}const U=ma("sve-call-values"),Fe=new Set;let gn=null;const ri="__sve-html-tree-style";function ii(e,n,o){if(n||o)return!1;const a=String(x("dock:chrome-kind")||"");if(a==="header"||a==="footer")return!1;const r=Sn(e);return!!r&&r!=="create"&&Lo(e)!==Ho(e)}function zn(e){return{sectionLoops:Co(e),sectionsLabel:v(e,"html_tree_sections_slot")}}function li(e,n){const o={entry:n,text:"",note:v(e,"html_tree_page_template_note"),openLabel:v(e,"html_tree_open_template"),canOpen:!1,onOpen:null};return On(e,{entry:n}).then(a=>{!a||t.pageTemplate?.entry!==n||(t.pageTemplate={...t.pageTemplate,text:v(e,"html_tree_page_template",{name:a.name}),canOpen:!!a.open,onOpen:a.open?r=>Qo(e,r,a.open):null})}),o}function di(e,n){const o=n.replace(/^view:/,"");if(!o||x("dock:current-type")!==n){t.usedBy=null,t.templateSections=[];return}t.usedBy?.view!==o&&(t.usedBy=null,On(e,{view:o}).then(a=>{if(!a||x("dock:current-type")!==n)return;const r=a.everything?[{name:v(e,"html_tree_used_by_everything"),kind:"everything",url:null}]:a.used_by.map(i=>({...i,...ci(e,i)}));t.templateSections=Array.isArray(a.sections_fields)?a.sections_fields:[],t.usedBy={view:o,label:v(e,"html_tree_used_by"),items:r,empty:r.length?"":v(e,"html_tree_used_by_nobody"),hint:r.length?v(e,"html_tree_used_by_hint",{list:r.map(i=>i.name).join(", ")}):""}}))}function ci(e,n){if(!n.url)return{openLabel:"",onOpen:null};const o=v(e,"html_tree_used_by_open",{name:n.name});return n.kind==="page"?{openLabel:o,onOpen:a=>aa(e,a,sa(e,n.url))}:{openLabel:o,onOpen:a=>ra(e,{anchor:a,url:n.url,subtitle:n.name})}}const q=new Set;let Mt="",_e=!1,wt=null,Le=!0,J="",Se=0,Xn="";const ge=new Map,Ie=new Set,It=new Map,We=new Map;let V="",Gn=!1,R=null,Ze=null,je="",Je="",Qe=0,Dt=null,we=[],me=null,De=null,et=null,tt=null,Ot=null,ke=!1,ae=null,Ae=null,Oe=null,nt=null,ot=null,Rt=null,fe=null;function W(e){return e.getElementById(ze)}function ui(e){xo(e,ri,`
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
  `)}function Y(){const e=x("dock:html");return typeof e=="string"?e:""}function Wn(e){return!!x("dock:is-open",e)}function He(e,{save:n=!1,unlock:o=!1}={}){return Wt()||x("dock:set-html",o?{html:e,unlock:!0}:e)!==!0?!1:(n&&x("dock:save-now"),!0)}function St(e){const n=x("dock:component-exit-state")||{};if(t.exitOpen=!!n.open,!n.open){t.onExit=null;return}t.exitName=n.name||"",t.exitLabel=v(e,"component_exit"),t.exitTitle=v(e,n.back?"component_exit_back":"component_exit_close"),t.onExit=()=>{x("dock:exit-component"),O(e)}}const Be=[];let Ct=!1;function Lt(e,n){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(n,{timeout:2e3});return}e.setTimeout(n,200)}function hi(e,n){for(const o of n){const a=o.type;!a||ge.has(a)||Ie.has(a)||Be.includes(a)||Be.push(a)}qt.htmlTreePrefetchArmed&&Zn(e)}function pl(e){qt.htmlTreePrefetchArmed=!0,Zn(e)}function Zn(e){if(Ct||!Be.length)return;Ct=!0;const n=()=>{const o=Be.shift();if(!o){Ct=!1;return}if(ge.has(o)||Ie.has(o)){Lt(e,n);return}Ie.add(o),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(o)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(a=>a.ok?a.json():null).then(a=>{if(typeof a?.html=="string"){ge.set(o,a.html);const r=We.get(o);We.delete(o),r&&r!==Jn(e,o)&&O(e)}}).catch(()=>{}).finally(()=>{Ie.delete(o),Lt(e,n)})};Lt(e,n)}function Wt(){return!!V}function Jn(e,n){return Qn(n)||Eo(e,n)||"section"}function Qn(e){const n=ge.get(e);if(!n)return"";const o=It.get(e);if(o&&o.html===n)return o.tag;const a=Zt(ut(n))?.tag||"";return It.set(e,{html:n,tag:a}),a}function ht(e,n){const o=it(e)||"page_sections",a=[];for(const r of jt(n)||[]){if(r.name===Jo||r.name===ca)continue;const i=Ut(r.values),l=i&&typeof i=="object"?i[o]:null;if(Array.isArray(l)){l.forEach(d=>{if(!d||typeof d!="object"||Array.isArray(d)||typeof d.type!="string")return;const k=[d._visual_id,d.id,d._id].filter(S=>typeof S=="string"&&S!=="");if(!k.length)return;const m=Dn(e,d),y=typeof d._sve_label=="string"?d._sve_label.trim():"",u=Jn(e,m);Qn(m)||We.set(m,u);const C=Yn(m)[`0:${u}`];a.push({uid:k[0],ids:k,type:m,tag:u,label:y||(typeof C=="string"&&C.trim()?C.trim():"")||lt(e,m)?.display||Re(m)||m,svg:An(u,"",null).svg||xe.section,cat:Mn(u),enabled:d.enabled!==!1,static:Fo(e,m)})});break}}return a}function pi(e,n,o){if(!o.length)return"";const a=x("dock:current-type")||"",r=x("dock:current-uid"),i=!!x("dock:component-exit-state")?.open;if(r){const l=dt(r,n),d=o.find(k=>k.ids.some(m=>l.includes(m)));if(d&&(i||d.type===a))return d.uid}return o.find(l=>l.type===a)?.uid||""}function vi(e,n,o){const a=x("dock:component-exit-state");if(a?.open)return Re(a.name)||a.name||"";if(o)return n.find(i=>i.uid===o)?.label||"";const r=x("dock:current-type")||"";return String(r).startsWith("view:")?"":lt(e,r)?.display||Re(r)||""}function pt(e,n,o,a,r){const i=o.find(l=>l.uid===a);i&&a!==r&&(q.clear(),R=null,Le=!1,G(),Ve(),J=a,Xn=Y(),V=ge.get(i.type)||"",V&&(R=At(ut(V))||null),Gn=(x("dock:current-type")||"")===i.type,e.clearTimeout(Se),Se=e.setTimeout(()=>{J="",_e=!1,O(e)},4e3),O(e),oa(e,i.uid,"tree"),ue({source:ee,type:Q.SVE_ACTIVATE,ids:i.ids},e),e.setTimeout(()=>O(e),0))}function Ft(e,n){if(!n)return!1;for(const o of e||[])if(o.id===n||Ft(o.children,n))return!0;return!1}function At(e){return Zt(e)?.id||""}function Zt(e){for(const n of e||[]){if(!n.kind)return n;const o=Zt(n.children);if(o)return o}return null}function fi(e,n){const o=n===0||e.path===Je;return q.has(e.path)?o:!o}function mi(e){const n=new Set,o=(a,r)=>{for(const i of a)i.children.length&&fi(i,r)&&n.add(i.id),o(i.children,r+1)};return o(e,0),n}function O(e){const n=e.document,a=W(n)?.querySelector("[data-sve-html-tree-list]");if(!a)return;ui(n),va(e);const r=Y();V&&V===r&&(V=""),x("dock:chrome-kind")&&(V="");const i=V||r,l=ut(i,zn(e));we=l,Je="";const d=x("dock:current-type")||"",k=Yn(d),m=So(e,n),u=!!(x("dock:component-exit-state")||{}).open;d&&r&&!V&&ge.set(d,r);const C=ht(e,n);hi(e,C);const S=pi(e,n,C);if(ii(e,m,u)){const c=Sn(e);we=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!1,t.layoutFile=!1,t.usedBy=null,t.emptyText="",t.pageTemplate?.entry!==c&&(t.pageTemplate=li(e,c)),t.onRefresh=()=>O(e),t.onSection=null,St(e),Me(a,_t),Ht(e,[]);return}t.pageTemplate=null,di(e,String(x("dock:collection-view")||""));const F=String(x("dock:chrome-kind")||"");if(Go(e),m&&!C.length&&!F){we=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,t.layoutFile=!1,t.emptyText=v(e,"html_tree_page_empty"),t.canEdit=!x("dock:is-locked"),t.look=hn(e),t.onRefresh=()=>O(e),t.onSection=null,St(e),Me(a,_t),Ht(e,[]);return}t.pageBuilder=m;const H=`${d}|${S}`;let te=!1;H!==Mt&&(Mt=H,q.clear(),wt!==null&&i!==wt?te=!0:_e=i),(te||_e!==!1&&i!==_e)&&(_e=!1,q.clear(),R=At(l)||null),wt=i,J&&(J===S||!C.length)&&(Gn||i!==Xn)&&(e.clearTimeout(Se),J="",_e=!1,Ft(l,R)||(q.clear(),R=At(l)||null));const ne=C.some(c=>c.uid===J)?J:"",g=Le?"":ne||S,p=!!(ne||S),b=p||u?"":String(x("dock:chrome-kind")||""),$=m&&(!d&&!p||b==="main"&&x("dock:on-empty-page")===!0),I=$||b==="template"?"":b;t.layoutFile=I==="main",I!=="main"&&(je="");const K=I==="main"?kn(l,"main"):null,B=K?at(l,c=>c.tag==="body"&&Ft(c.children,K.id)):null;Je=B?B.path:"",K&&(Ye((B||K).path),je!==H&&(Ye(K.path),q.add(K.path)));const Ee=I==="header"||I==="footer"?at(l,c=>i.slice(c.from,c.openTo).includes(`data-sve-chrome="${I}"`)):null,se=Ee||(I==="header"||I==="footer"?kn(l,I):null);se&&Ye(se.path);const N=$||!(I==="main"?!!K:I==="header"||I==="footer"?!!se:!0)?[]:Da(l,t.query?new Set:mi(l));!i.trim()&&!Wn(n)?t.emptyText=v(e,"html_tree_need_dock"):t.emptyText=v(e,"html_tree_empty"),t.slotText=v(e,"antlers_drop_here"),t.dataTitle=v(e,"data_vars_title"),t.pageTitle=v(e,"component_props_page"),t.renameTitle=v(e,"html_tree_rename"),t.tagTitle=v(e,"tw_tag"),t.hideTitle=v(e,"html_tree_hide"),t.showTitle=v(e,"html_tree_show"),t.duplicateTitle=v(e,"html_tree_duplicate"),t.deleteTitle=v(e,"html_tree_delete"),t.videoHoldTitle=v(e,"html_tree_video_hold"),t.videoPlayTitle=v(e,"html_tree_video_play"),t.alpineTitle=v(e,"html_tree_alpine_state"),t.lockedTitle=v(e,"html_tree_locked"),t.searchEmpty=v(e,"html_tree_search_empty"),t.canEdit=!x("dock:is-locked"),t.look=hn(e),t.onQuery=()=>O(e),St(e),t.inComponent=u,t.onSelect=c=>{const _=N.find(P=>P.id===c);_&&Fn(e,_.path)||rt(e,c,N)},t.onTwist=c=>{const _=N.find(P=>P.id===c)?.path;_&&(q.has(_)?q.delete(_):q.add(_),O(e))},t.onTagChange=(c,_)=>{const P=t.rows.find(le=>le.id===_);P&&!Wt()&&!Jt(e,P)&&fa(e,c.currentTarget,P)},t.onRename=c=>xi(e,c),t.onRenameCommit=()=>yn(e,!0),t.onRenameCancel=()=>yn(e,!1),t.onHide=c=>Ei(e,c),t.onLock=c=>Hi(e,c),t.canUnlock=to(e),t.lockTitle=v(e,"html_tree_lock"),t.unlockTitle=v(e,"html_tree_unlock"),t.lockedByTitle=v(e,"html_tree_locked_by_developer"),t.onVideoHold=c=>Si(e,c),t.onAlpineState=(c,_)=>Li(e,c,_),t.onDuplicate=c=>Pi(e,c),t.onDelete=c=>Mi(e,c),t.onPointerDown=(c,_)=>Ri(e,c,_),t.onSectionPointerDown=(c,_)=>Bi(e,c,_),t.onSectionHover=c=>e.dispatchEvent(new e.CustomEvent("sve-lite-hover",{detail:{uid:c}})),t.onContext=(c,_)=>Di(e,c,_),t.onInspectCommit=c=>Xi(e,c),t.onPropValue=(c,_,P)=>xn(e,c,_,P),t.onPropPage=(c,_)=>ni(e,c,P=>xn(e,_,P,!1)),t.onLoopKind=c=>Gi(e,c),t.onAddBranch=c=>Wi(e,c),t.onLoopSortField=c=>{const _=st(),P=String(c||"").trim();if(!_)return;const le=fe?.id===_.id?fe.dir:"",de=_.sortDir||le||"asc";fe=null,Z(e,(ve,mt)=>be(ve,mt,{sortField:P,sortDir:de}))},t.onLoopSortDir=c=>{const _=st(),P=String(c||"");if(_){if((P==="asc"||P==="desc")&&!_.sortField){fe={id:_.id,dir:P},Kt(e,_);return}fe=null,Z(e,(le,de)=>be(le,de,{sortDir:P,sortField:P==="asc"||P==="desc"?de.sortField:""}))}},t.onLoopDepth=c=>Z(e,(_,P)=>be(_,P,{navDepth:String(c||"").replace(/\D/g,"")})),t.onLoopIncludeHome=c=>Z(e,(_,P)=>be(_,P,{includeHome:!!c})),t.onLoopLimit=c=>Z(e,(_,P)=>be(_,P,{limit:String(c||"").replace(/\D/g,"")})),t.onLoopOffset=c=>Z(e,(_,P)=>be(_,P,{offset:String(c||"").replace(/\D/g,"")})),t.onPropHost=c=>c?U.mount(c):U.unmount(),t.onInspectData=(c,_)=>{x("dock:data-menu",{anchor:c,at:N.find(P=>P.id===R)?.from,onPick:P=>_(String(P?.var||"").trim())})};const tn=N.find(c=>!c.kind)?.id,nn=u?"":vi(e,C,g),he=g&&!u?C.find(c=>c.uid===g):null,uo=Pn(e,String(x("dock:current-type")||""));let ho=0;const po=Ci(Ee?[Ee]:l,i),vo=$n(e,String(d)),re=I==="header"||I==="footer"?I:"",ye=se?se.id:"",pe=K&&N.find(c=>c.id===K.id)||null,on=B&&N.find(c=>c.id===B.id)||null,ie=on||pe||ye&&N.find(c=>c.id===ye)||null,an=ie?bi(N,ie):-1;if(ie&&!N.slice(N.indexOf(ie),an).some(c=>c.id===R)&&(R=ie.id),t.selectFrom){const c=N.find(_=>_.from===t.selectFrom.at&&(!_.kind||_.kind==="sections"));c?(R=c.id,t.selectFrom=null):--t.selectFrom.left<=0&&(t.selectFrom=null)}const sn=t.layoutFile?yi(e):null;t.rows=N.map(c=>{const _=sn&&c.kind==="component"&&sn.get(c.src)||"",P=c.tag==="body"&&!c.kind,le=_?{svg:xe[_]}:An(c.tag,c.kind,c.antlers),de=c.tag==="video"&&!c.kind?ho++:-1,ve=po.get(c.id),mt=ve?vo[ve.nth]||{}:{},gt=ve?ve.booleans.map(({key:$e,value:rn})=>({key:$e,file:rn,value:mt[$e]??rn})):[],kt=c.id===tn&&nn?nn:c.klass,Pe=c.id===tn;return{...c,tag:_||c.tag,frameCall:_,fixed:!!_||P,base:kt,name:_?v(e,`html_tree_frame_${_}`):re&&c.id===ye?v(e,`html_tree_frame_${re}`):c===pe?v(e,"html_tree_frame_main"):Pe&&he?kt:ai(kt,c.path,k),current:c.id===R,letter:le.letter||"",svg:re&&c.id===ye?xe[re]:c===pe?xe.main:Pe&&he?he.svg:le.svg||"",frame:re&&c.id===ye?re:c===pe?"main":"",cat:re&&c.id===ye?re:c===pe||P?"main":_||Mn(c.tag,c.kind,c.antlers),componentRoot:Pe&&u,sectionRoot:Pe&&he?he.uid:"",fieldsIcon:!!(Pe&&he&&!he.static),videoNth:de,videoHeld:de>=0&&uo.has(de),alpineNth:gt.length?ve.nth:-1,alpineKeys:gt,alpineSet:gt.some($e=>$e.value!==$e.file)}}),Wo(e),Zo(e);const ft=[];for(const c of t.rows)ft.length=c.depth,c.guides=ft.slice(),ft[c.depth]=c.cat;if(ie){const c=N.indexOf(ie),_=ie.depth;t.rows=t.rows.slice(c,an).map(P=>({...P,depth:P.depth-_,guides:P.guides.slice(_)})),pe&&je!==H&&(je=H,e.setTimeout(()=>rt(e,pe.id,N),0))}t.sections=m&&!u&&(p||I||$)?C.map(c=>{const _=!!g&&c.uid===g;return{...c,current:_,ready:_&&(!ne||!!V),row:{id:`sec:${c.uid}`,section:c.uid,tag:c.tag,name:c.label,kind:"",svg:c.svg,cat:c.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:_,hidden:!c.enabled}}}):[],t.frame=ki(e,C,p,u,I,!1,!!on),t.frameEmptyText=v(e,"html_tree_frame_no_sections"),gi(e,I),t.onSection=c=>{ke||(Bt(e),pt(e,n,C,c,g))},t.onRefresh=()=>O(e),Kt(e,t.rows.find(c=>c.id===R)),Me(a,_t),Ht(e,l)}function gi(e,n){t.frameOpenTitle=v(e,"html_tree_frame_open"),t.frameMainTitle=v(e,"html_tree_frame_main_open"),t.frameTemplateTitle=v(e,"html_tree_frame_template_open"),t.frameFieldsTitle=v(e,"html_tree_frame_fields"),t.onFrame=o=>{n===o?_i(e,o):Nt(e,o)},t.onFrameEnter=o=>Nt(e,o),t.onFrameFields=o=>Ko(e,ta(e,o),v(e,`html_tree_frame_${o}`)),t.onFrameTwist=()=>{t.mainShut=!t.mainShut}}function ki(e,n,o,a,r,i=!1,l=!1){if(!r&&!i||l)return null;const d=y=>({id:`frame:${y}`,frame:y,synthetic:!0,tag:y,name:v(e,`html_tree_frame_${y}`),kind:"",svg:xe[y]||"",cat:y,letter:"",depth:0,hasChildren:y==="main"&&(n.length>0||r==="template"),shut:y!=="main",current:!1,hidden:!1}),k={kind:r,header:d("header"),main:d("main"),footer:d("footer"),template:null},m=r&&r!=="template"?String(x("dock:collection-view")||""):"";return m&&(k.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:lt(e,m)?.display||Re(m.replace(/^view:/,"")),kind:"",svg:xe.section,cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),k}function kn(e,n){return at(e,o=>o.tag===n)}function at(e,n){for(const o of e||[]){if(!o.kind&&n(o))return o;const a=at(o.children,n);if(a)return a}return null}function yi(e){const n=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},o=new Map;for(const a of["header","footer"]){const r=ka(n[a]?.type);r&&o.set(r,a)}return o}function bi(e,n){let o=e.indexOf(n)+1;for(;o<e.length&&e[o].depth>n.depth;)o+=1;return o}function _i(e,n){const o=Rn(e);(n==="main"||n==="template"?o?.querySelector("main"):o?.querySelector(`[data-sve-chrome="${n}"]`))?.scrollIntoView({behavior:"smooth",block:"start"})}function Bt(e){const n=String(x("dock:chrome-open",e.document)||"");return n!=="header"&&n!=="footer"?!1:(na(e),ue({source:ee,type:Q.SVE_FORCE_EXIT_CHROME},e),!0)}function Ti(e){e.clearTimeout(Se),J="",V="",q.clear(),R=null,Le=!1,G(),Ve()}function Nt(e,n){if(e.document,String(x("dock:chrome-kind")||"")===n)return;if(Ti(e),n==="main"){Bt(e),x("dock:open-file",ua);return}if(n==="template"){const i=String(x("dock:collection-view")||"");i&&(Bt(e),x("dock:open-file",i));return}if(n!=="header"&&n!=="footer")return;const o=Rn(e)?.querySelector(`[data-sve-chrome="${n}"]`);o?(o.scrollIntoView({block:"nearest"}),o.dispatchEvent(new o.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:ee,type:Q.OPEN_CHROME,kind:n},e.location.origin);const a=Date.now(),r=async()=>{if(String(x("dock:chrome-kind")||"")!==n){Date.now()-a<3e4&&e.setTimeout(r,250);return}await(x("dock:load-settled")||null),co(e)};e.setTimeout(r,250)}function Ht(e,n){W(e.document)&&eo(e,n)}function eo(e,n){const o=n[0],a=!!x("dock:component-src"),r=a?"":x("dock:current-uid")||"";ue({source:ee,type:Q.SVE_HTML_PICK,on:!0,uid:r,uids:r?dt(r,e.document):[],all:a,tag:o?.tag||"",klass:o?.klass||"",nodes:Ra(n)},e)}function Ye(e){if(!e)return;const n=(o,a)=>{for(const r of o||[]){if(r.path===e)return!0;if(n(r.children,a+1))return a===0||r.path===Je?q.delete(r.path):q.add(r.path),!0}return!1};n(we,0)}function xi(e,n){if(ke)return;const o=t.rows.find(a=>a.id===n);Jt(e,o)||!o||o.kind||(R=n,t.rows.forEach(a=>{a.current=a.id===n}),t.editingId=n,t.draft=o.name,e.setTimeout(()=>{const a=W(e.document)?.querySelector("[data-sve-ht-rename]");a?.focus(),a?.select()},0))}function yn(e,n){const o=t.editingId;if(!o)return;const a=t.rows.find(r=>r.id===o);t.editingId=null,n&&a&&(a.sectionRoot?wi(e,a.sectionRoot,t.draft):si(x("dock:current-type")||"",a.path,t.draft,a.base||a.klass)),t.draft="",O(e)}function wi(e,n,o){const a=it(e)||"page_sections",r=String(o||"").replace(/\s+/g," ").trim();for(const i of jt(e.document)||[]){const l=Ut(i.values),d=l&&typeof l=="object"?l[a]:null;if(!Array.isArray(d))continue;const k=d.findIndex(C=>C&&typeof C=="object"&&[C._visual_id,C.id,C._id].includes(n));if(k===-1)continue;const m=Dn(e,d[k]),y=lt(e,m)?.display||Re(m)||m,u=JSON.parse(JSON.stringify(d));return u[k]={...u[k]},!r||r===y?delete u[k]._sve_label:u[k]._sve_label=r,i.setFieldValue(a,u),!0}return!1}function Si(e,n){const o=t.rows.find(d=>d.id===n);if(!o||!(o.videoNth>=0))return;const a=String(x("dock:current-type")||""),r=Pn(e,a),i=!r.has(o.videoNth);i?r.add(o.videoNth):r.delete(o.videoNth);const l=String(x("dock:current-uid")||"");ea(e,a,r),ue({source:ee,type:Q.SVE_VIDEO_HOLD,uid:l,uids:l?dt(l,e.document):[],nth:o.videoNth,on:i},e),O(e)}function Ci(e,n){const o=new Map;let a=0;const r=i=>{for(const l of i){if(l.hidden)continue;const d=l.kind?null:Aa(n.slice(l.from,l.openTo));d!==null&&o.set(l.id,{nth:a++,booleans:Na(d)}),r(l.children||[])}};return r(e),o}function Li(e,n,o){const a=t.rows.find(i=>i.id===o);if(!a||!(a.alpineNth>=0))return;if(a.alpineKeys.length===1){bn(e,a,a.alpineKeys[0]);return}const r=n.currentTarget.getBoundingClientRect();G(),ae=Ne(e.document,Ke,{items:a.alpineKeys.map(i=>({label:i.key,icon:i.value?oo:ao,onPick:()=>{G(),bn(e,a,i)}})),x:Math.round(r.left),y:Math.round(r.bottom+4),onClose:()=>{ae=null}})}function bn(e,n,o){const a=String(x("dock:current-type")||""),r=$n(e,a),i=!o.value,l=i!==o.file,d={...r[n.alpineNth]||{}};l?d[o.key]=i:delete d[o.key],Object.keys(d).length?r[n.alpineNth]=d:delete r[n.alpineNth];const k=ia(String(x("dock:chrome-kind")||"")),m=k?"":String(x("dock:current-uid")||"");la(e,a,r),ue({source:ee,type:Q.SVE_ALPINE_STATE,uid:m,uids:m?dt(m,e.document):[],chrome:k,nth:n.alpineNth,key:o.key,value:i,on:l},e),O(e)}function Jt(e,n){return!n||!(n.locked||n.lockedIn)?!1:(e.Statamic?.$toast?.error(v(e,"html_tree_locked_element")),!0)}function to(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function Hi(e,n){const o=t.rows.find(a=>a.id===n);if(!(!o||o.lockedIn||x("dock:is-locked"))){if(!o.locked){Ce(e,n,Ha,{lockAction:!0});return}if(!to(e)){e.Statamic?.$toast?.error(v(e,"html_tree_unlock_denied"));return}Yt(e,{titleKey:"html_tree_unlock_title",bodyKey:"html_tree_unlock_body",confirmKey:"html_tree_unlock_confirm"},()=>Ce(e,n,Ea,{lockAction:!0,unlock:!0}))}}function Qt(e){return!!t.rows.find(n=>n.id===e)?.fixed}function Ei(e,n){Qt(n)||Ce(e,n,Pa)}function Pi(e,n){if(Qt(n))return;const o=t.rows.find(a=>a.id===n)?.sectionRoot;if(o){e.postMessage({source:ee,type:Q.DUPLICATE_ROW,uid:o},e.location.origin);return}Ce(e,n,$a)}function no(e,n){Yt(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const o=e.document;da({uid:n},o,e)})}function $i(e,n,o){J===o&&(e.clearTimeout(Se),J="",V=""),R=null,Le=!1,Mt="";const a=ht(e,n),r=a.find(i=>i.uid!==o)||a[0];r?pt(e,n,a,r.uid,""):(V="",t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,O(e)),e.setTimeout(()=>{W(e.document)&&O(e)},0)}In("row:removed",({uid:e,parentPath:n,doc:o,win:a})=>{n!==it(a)||!W(a.document)||$i(a,o,e)});function Mi(e,n){if(Qt(n))return;const o=t.sections?.find(r=>r.row?.id===n),a=o?o.row?.section||o.uid:t.rows.find(r=>r.id===n)?.sectionRoot;if(a){no(e,a);return}if(t.rows.find(r=>r.id===n)?.kind==="sections"){Yt(e,{titleKey:"html_tree_sections_remove_title",bodyKey:"html_tree_sections_remove_body",confirmKey:"html_tree_sections_remove_confirm"},()=>Ce(e,n,pn));return}Ce(e,n,pn)}function Ce(e,n,o,{lockAction:a=!1,unlock:r=!1}={}){if(x("dock:is-locked"))return;const i=Y(),l=t.rows.find(k=>k.id===n);if(!l||!a&&Jt(e,l))return;const d=o(i,l);d!==i&&He(d,{unlock:r})}function G(){ae?.dismiss(),ae=null}const oo='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',ao='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>';function so(e,n){const o=t.sections?.find(k=>k.uid===n),a=o?.type||"";if(!a||!Cn(e))return[];const r=o.label||a,i=Ao(e,a),l=()=>e.Statamic?.$toast?.error(v(e,"section_update_failed")),d=[{label:v(e,"static_section_insertable"),icon:i?ao:oo,onPick:()=>{G(),dn(e,{handle:a,hidden:!i}).then(()=>{e.Statamic?.$toast?.success(v(e,i?"section_shown_to_editors":"section_hidden_from_editors",{name:r})),cn(e)}).catch(l)}}];return o.static&&d.push({label:v(e,"section_add_fields"),onPick:()=>{G(),dn(e,{handle:a,fields:!0}).then(()=>{e.Statamic?.$toast?.success(v(e,"section_fields_added",{name:r})),cn(e),O(e),Ln(e,a)}).catch(l)}}),d}function Ii(e,n,o){const a=o.row?.section||o.uid;a&&(ae=Ne(e.document,Ke,{items:[...so(e,a),{label:v(e,"html_tree_remove_section"),danger:!0,onPick:()=>{G(),no(e,a)}}],x:n.clientX,y:n.clientY,onClose:()=>{ae=null}}))}function Di(e,n,o){G();const a=t.sections?.find(d=>d.row?.id===o);if(a){Ii(e,n,a);return}const r=t.rows.find(d=>d.id===o);if(!r)return;rt(e,o,t.rows);const i={x:n.clientX,y:n.clientY},l=d=>{d.length&&(ae?.dismiss(),ae=Ne(e.document,Ke,{items:d,x:i.x,y:i.y,onClose:()=>{ae=null}}))};if(r.frameCall){l([{label:v(e,"html_tree_frame_edit",{frame:v(e,`chrome_${r.frameCall}`)}),onPick:()=>{G(),Nt(e,r.frameCall)}}]);return}if(r.kind==="component"){Oi(e,r,l);return}r.kind==="slot"||r.kind==="sections"||r.locked||r.lockedIn||t.canEdit&&(r.componentRoot||l([...r.sectionRoot?so(e,r.sectionRoot):[],{label:v(e,"component_make"),onPick:()=>{G(),ga(e,r,{onDone:()=>O(e),onError:d=>{e.alert(d?.status===409?v(e,"component_exists"):v(e,"component_failed"))}})}}]))}const _n=(e,n)=>{G(),x("dock:open-template",n)};function Oi(e,n,o){if(!Oa(n.src)){o([{label:v(e,"component_open_named",{name:n.name||n.src}),onPick:()=>_n(e,`view:partials/${n.src}`)}]);return}o([{label:v(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(n.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(a=>a.ok?a.json():{items:[]}).then(a=>{const r=Array.isArray(a.items)?a.items:[];o(r.length?r.map(i=>({label:v(e,"component_open_named",{name:i.label}),onPick:()=>_n(e,i.type)})):[{label:v(e,"component_none"),onPick:null}])}).catch(()=>o([{label:v(e,"component_none"),onPick:null}]))}function Ri(e,n,o){if(n.button!==0||x("dock:is-locked")||t.editingId)return;const a=t.rows.find(l=>l.id===o);if(a&&(a.locked||a.lockedIn)||n.target?.closest?.("button, input"))return;Ve(),me=o,De={x:n.clientX,y:n.clientY},et=n.currentTarget,tt=n.pointerId;const r=l=>Fi(e,l),i=l=>Ai(e,l);Ot=()=>{e.document.removeEventListener("pointermove",r,!0),e.document.removeEventListener("pointerup",i,!0),e.document.removeEventListener("pointercancel",i,!0),Ot=null},e.document.addEventListener("pointermove",r,!0),e.document.addEventListener("pointerup",i,!0),e.document.addEventListener("pointercancel",i,!0)}function Fi(e,n){if(!me||!De)return;const o=n.clientX-De.x,a=n.clientY-De.y;if(!t.dragging&&o*o+a*a<25)return;if(!t.dragging){t.dragging=!0;try{et?.setPointerCapture?.(tt)}catch{}}n.preventDefault();const r=e.document.elementFromPoint(n.clientX,n.clientY),i=r?.closest?.("[data-sve-ht-slot]");if(i){const u=i.getAttribute("data-sve-ht-id");if(u&&u!==me){t.dropId=u,t.dropPlace="inside";return}}const l=r?.closest?.("[data-sve-ht-row]"),d=l?.getAttribute("data-sve-ht-id");if(!d||d===me){t.dropId=null,t.dropPlace=null;return}const k=t.rows.find(u=>u.id===d),m=t.rows.find(u=>u.id===me);if(!k||k.lockedIn||m&&k.path.startsWith(`${m.path}/`)){t.dropId=null,t.dropPlace=null;return}const y=l.getBoundingClientRect();t.dropId=d,t.dropPlace=Ca(n.clientY-y.top,y.height,!Nn(k.tag)&&!Bn(k)&&!k.locked)}function Ai(e,n){const o=me,a=t.dropId,r=t.dropPlace||"after",i=t.dragging;if(Ve(),i&&(ke=!0,e.setTimeout(()=>{ke=!1},0)),!i||x("dock:is-locked")||!o||!a||o===a)return;n?.preventDefault?.();const l=Y(),d=La(l,we,o,a,r);d!==l&&He(d)}function Ve(){try{et?.releasePointerCapture?.(tt)}catch{}Ot?.(),me=null,De=null,et=null,tt=null,t.dragging=!1,t.dropId=null,t.dropPlace=null}function Bi(e,n,o){if(n.button!==0||!o||t.editingId||n.target?.closest?.("button, input"))return;ro(),Ae=o,Oe={x:n.clientX,y:n.clientY},nt=n.currentTarget,ot=n.pointerId;const a=i=>Ni(e,i),r=i=>Ki(e,i);Rt=()=>{e.document.removeEventListener("pointermove",a,!0),e.document.removeEventListener("pointerup",r,!0),e.document.removeEventListener("pointercancel",r,!0),Rt=null},e.document.addEventListener("pointermove",a,!0),e.document.addEventListener("pointerup",r,!0),e.document.addEventListener("pointercancel",r,!0)}function Ni(e,n){if(!Ae||!Oe)return;const o=n.clientX-Oe.x,a=n.clientY-Oe.y;if(!t.dragging&&o*o+a*a<25)return;if(!t.dragging){t.dragging=!0;try{nt?.setPointerCapture?.(ot)}catch{}}n.preventDefault();const i=e.document.elementFromPoint(n.clientX,n.clientY)?.closest?.("[data-sve-ht-sec-uid]"),l=i?.getAttribute("data-sve-ht-sec-uid")||"";if(!l||l===Ae){t.sectionDrop=null;return}const d=i.getBoundingClientRect();t.sectionDrop={uid:l,place:n.clientY-d.top<d.height/2?"before":"after"}}function Ki(e,n){const o=Ae,a=t.sectionDrop,r=t.dragging;ro(),r&&(ke=!0,e.setTimeout(()=>{ke=!1},0)),!(!r||!o||!a?.uid||a.uid===o)&&(n?.preventDefault?.(),Vi(e,o,a.uid,a.place))}function ro(){try{nt?.releasePointerCapture?.(ot)}catch{}Rt?.(),Ae=null,Oe=null,nt=null,ot=null,t.dragging=!1,t.sectionDrop=null}function Vi(e,n,o,a){const r=it(e)||"page_sections";for(const i of jt(e.document)||[]){const l=Ut(i.values),d=l&&typeof l=="object"?l[r]:null;if(!Array.isArray(d))continue;const k=C=>d.findIndex(S=>S&&typeof S=="object"&&[S._visual_id,S.id,S._id].includes(C)),m=k(n),y=k(o);if(m===-1||y===-1||m===y)return!1;let u=a==="before"?y:y+1;return m<u&&(u-=1),u===m?!1:(e.postMessage({source:ee,type:Q.MOVE,uid:n,toIndex:u},e.location.origin),e.setTimeout(()=>O(e),60),!0)}return!1}function io(e){const n=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(n)?n:[]}function ji(e){const n=e.Statamic?.$config?.get?.("sveNavigations");return Array.isArray(n)?n:[]}function Ui(e){return[{handle:Xe,title:v(e,"antlers_nav_pages")},...ji(e).map(n=>({handle:n.handle,title:n.title}))]}function Kt(e,n){if(n?.kind==="component"){qi(e,n);return}if(X.callOpen&&(X.callOpen=!1,X.callStore=null,U.forget(),Xt(e)),n?.kind!=="antlers"){t.inspect=null;return}const o=n.id;if(n.tag==="else"){t.inspect={key:o,title:v(e,"antlers_condition"),mode:"note",note:v(e,"antlers_else_note")};return}if(n.antlers==="loop"){const a=n.loopKind==="collection",r=n.loopKind==="nav",i=fe?.id===n.id?fe.dir:"",l=n.sortDir||i,d=[{id:"field",label:v(e,"antlers_loop_field")},{id:"collection",label:v(e,"antlers_loop_collection")},{id:"nav",label:v(e,"antlers_loop_nav")}];if(r){const k=n.expr||Xe;t.inspect={key:o,title:v(e,"antlers_loop"),mode:"loop",loopKind:"nav",kinds:d,navs:Ui(e),value:k,placeholder:v(e,"antlers_pick_nav"),nav:{depthTitle:v(e,"antlers_nav_depth"),depth:n.navDepth||"",depths:[{id:"",label:v(e,"antlers_nav_depth_all")},{id:"1",label:v(e,"antlers_nav_depth_1")},{id:"2",label:v(e,"antlers_nav_depth_2")},{id:"3",label:v(e,"antlers_nav_depth_3")}],homeAsked:k===Xe,homeLabel:v(e,"antlers_nav_include_home"),includeHome:!!n.includeHome},branches:[]};return}t.inspect={key:o,title:v(e,"antlers_loop"),mode:"loop",loopKind:a?"collection":"field",kinds:d,collections:io(e),value:n.expr||"",placeholder:v(e,a?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:v(e,"antlers_sort"),dir:l,needsField:l==="asc"||l==="desc",field:n.sortField||"",pickable:!a,placeholder:v(e,a?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:v(e,"antlers_sort_none")},{id:"asc",label:v(e,"antlers_sort_asc")},{id:"desc",label:v(e,"antlers_sort_desc")},{id:"random",label:v(e,"antlers_sort_random")}]},limit:{title:v(e,n.paginate?"antlers_limit_per_page":"antlers_limit"),value:n.limit||"",placeholder:v(e,"antlers_limit_placeholder")},offset:{title:v(e,"antlers_offset"),value:n.offset||"",placeholder:v(e,"antlers_offset_placeholder")},branches:[]};return}t.inspect={key:o,title:v(e,"antlers_condition"),mode:"condition",value:n.expr||"",placeholder:v(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:v(e,"antlers_add_elseif")},{id:"else",label:v(e,"antlers_add_else")}]}}function qi(e,n){if(!ba(e)){t.inspect=null;return}if(!n.src)return;const o=n.id;if(t.inspect={key:o,title:v(e,"component_props_values"),mode:"note",note:v(e,"code_dock_loading")},_a()){const a={},r={},i=new Map;for(const[l,d]of Ta(Y().slice(n.from,n.to))){const k=xa(l);k&&(l!==k||!i.has(k))&&i.set(k,d)}for(const[l,d]of i)d.bound?r[l]=d.value:a[l]=d.value;gn!==o&&(gn=o,Fe.clear());for(const l of Fe)l in r||(r[l]="");t.inspect=null,X.callOpen=!0,X.title=X.title||v(e,"component_props"),X.callTitle=n.klass||n.name||n.src,X.callStore=U.ui,U.ui.canBind=!0,U.ui.dataTitle=v(e,"data_vars_title"),U.ui.exprPlaceholder=v(e,"component_props_expr"),U.ui.onToggleBind=(l,d)=>zi(e,l,d),U.ui.onExpr=(l,d)=>Tn(e,l,d),U.ui.onPickData=(l,d)=>x("dock:data-menu",{anchor:d,at:n.from,onPick:k=>Tn(e,l,String(k?.var||"").trim())}),U.load(e,{key:`${n.src}::${o}`,src:n.src,params:a,bindings:r,readOnly:x("dock:is-locked")===!0}),U.watch(e,{src:n.src,write:l=>Yi(e,l,r)}),Xt(e);return}wa(e,n.src).then(a=>{if(t.inspect?.key===o){if(!a.length){t.inspect={key:o,title:v(e,"component_props_values"),mode:"note",note:v(e,"component_props_values_none")};return}t.inspect={key:o,title:v(e,"component_props_values"),mode:"props",inheritLabel:v(e,"component_props_inherit"),rows:Sa(a,Y().slice(n.from,n.to))}}})}function Yi(e,n,o={}){const a=t.rows.find(l=>l.id===R);if(a?.kind!=="component"||x("dock:is-locked"))return;let r=Y(),i=a.to;for(const[l,d]of Object.entries(n||{})){if(l in o)continue;const k=r.length,m=Gt(r,{from:a.from,to:i},l,d);m!==r&&(i+=m.length-k,r=m)}r!==Y()&&(He(r,{save:!0}),O(e))}function zi(e,n,o){o?Fe.add(n):Fe.delete(n),lo(e,n,"",o),O(e)}function Tn(e,n,o){Fe.add(n),lo(e,n,o,!0),O(e)}function lo(e,n,o,a){const r=t.rows.find(d=>d.id===R);if(r?.kind!=="component"||x("dock:is-locked"))return;const i=Y(),l=Gt(i,r,n,o,{bound:a});l!==i&&He(l,{save:!0})}function st(){const e=t.rows.find(n=>n.id===R);return e?.kind==="antlers"&&!x("dock:is-locked")?e:null}function Z(e,n){const o=st();if(!o)return;const a=Y(),r=n(a,o);r!==a&&(He(r),O(e))}function xn(e,n,o,a){const r=t.rows.find(d=>d.id===R);if(r?.kind!=="component"||x("dock:is-locked"))return;const i=Y(),l=Gt(i,r,n,o,{bound:a});l!==i&&(He(l,{save:!0}),O(e))}function Xi(e,n){Z(e,(o,a)=>a.antlers==="loop"?qe(o,a,a.loopKind==="collection"?"collection":"field",n):Ma(o,a,n))}function Gi(e,n){const o=st();if(!o||o.antlers!=="loop")return;const a=o.loopKind==="collection"?"collection":o.loopKind==="nav"?"nav":"field";if(n!==a){if(n==="nav"){Z(e,(r,i)=>qe(r,i,"nav",Xe));return}if(n==="collection"){const r=io(e)[0]?.handle;if(!r)return;Z(e,(i,l)=>qe(i,l,"collection",r));return}Z(e,(r,i)=>qe(r,i,"field",i.handle||"items"))}}function Wi(e,n){Z(e,(o,a)=>Ia(o,a,n))}function Zi(e,n){if(!e||!n||Bn(n)||Nn(n.tag))return null;const o=ya(e,n);if(o<n.openTo)return null;const a=e.lastIndexOf(`
`,o-1)+1;return e.slice(a,o).trim()===""&&a>n.openTo?a-1:o}function rt(e,n,o){if(ke)return;const a=(o||t.rows).find(r=>r.id===n);a&&(R=n,t.rows.forEach(r=>{r.current=r.id===n}),Kt(e,a),!Wt()&&(x("dock:reveal-html",{from:a.from,to:a.to,caret:Zi(Y(),a)}),x("dock:tw-follow"),ue({source:ee,type:Q.SVE_HTML_PICK_FOCUS,path:a.path},e)))}function Ji(e,n){if(!n)return"";const o=[],a=(r,i)=>{for(const l of r||[]){const d=i||l.path===e;l.kind==="component"&&l.src===n&&o.push({path:l.path,inside:d}),a(l.children,d)}};return a(we,!1),(o.find(r=>r.inside)||o[0])?.path||""}function Qi(e,n){if(!n||!W(e.document))return;Le=!1,Ye(n),O(e);const o=t.rows.find(a=>a.path===n);o&&(rt(e,o.id,t.rows),e.setTimeout(()=>{W(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function Vt(e){if(Ze)return;const n=()=>{t.editingId||t.dragging||(e.clearTimeout(Qe),Qe=e.setTimeout(()=>{W(e.document)&&O(e)},80))},o=()=>{if(n(),x("dock:on-empty-page")===!0){const a=ht(e,e.document);a.length===1&&pt(e,e.document,a,a[0].uid,"")}};Ze=In("dock:html-changed",n),e.document.addEventListener("sve-page-structure",o),Dt=()=>{e.document.removeEventListener("sve-page-structure",o)}}function el(e){Ze?.(),Ze=null,Dt?.(),Dt=null,e?.clearTimeout?.(Qe),Qe=0}function en(e){const n=W(e.document);if(ue({source:ee,type:Q.SVE_HTML_PICK,on:!1},e),el(e),U.forget(),X.callOpen=!1,X.callStore=null,Xt(e),Ve(),G(),pa(e),R=null,t.inspect=null,t.editingId=null,t.draft="",t.sections=[],t.pageBuilder=!1,t.layoutFile=!1,J="",e?.clearTimeout?.(Se),!n){Pt(e);return}n.remove(),qt.headerTab==="html_tree"&&Uo(e,null),qo(e),Hn(e),En(e),Pt(e)}function vl(e,n){n.querySelector("[data-sve-html-tree-list]")||(n.id=ze,Me(n,Kn,{title:v(e,"html_tree")}),n.querySelector("[data-sve-close]")?.addEventListener("click",()=>en(e)))}function fl(e){Vt(e),O(e)}function co(e){const n=e.document;if(!wo(e,"html_tree"))return;if(W(n)){Vt(e),O(e);return}if(!Wn(n))return;Le=!0,q.clear(),Yo(e,[ze]);const o=n.createElement("div");o.id=ze,o.style.cssText=zo,Me(o,Kn,{title:v(e,"html_tree")}),o.querySelector("[data-sve-close]")?.addEventListener("click",()=>en(e)),Xo(e,o),Hn(e),En(e),Pt(e),Vt(e),O(e)}function ml(e){if(W(e.document)){en(e);return}co(e)}zt("html-tree:open-section",e=>{const n=window,o=n.document,a=ht(n,o),r=a.find(i=>i.uid===e||i.ids.includes(e));return r?(pt(n,o,a,r.uid,""),{uid:r.uid,ids:r.ids}):null});zt("html-tree:from-preview",({path:e,src:n}={})=>{Fn(window,e)||Qi(window,Ji(e,n)||e)});zt("html-tree:arm-pick",e=>{const n=window;return e?(eo(n,ut(Y(),zn(n))),!0):(W(n.document)||ue({source:ee,type:Q.SVE_HTML_PICK,on:!1},n),!0)});function gl(){ge.clear(),Ie.clear(),It.clear(),We.clear(),Be.length=0}export{ri as HTML_TREE_STYLE_ID,pl as armHtmlTreePrefetch,gl as clearHtmlTreeTemplates,G as closeHtmlTreeMenu,en as closeHtmlTreePanel,ui as ensureHtmlTreeStyles,vl as fillHtmlTreePane,R as htmlTreeActiveId,W as htmlTreePanel,Qe as htmlTreeTimer,Ze as htmlTreeUnhook,co as openHtmlTreePanel,O as renderHtmlTree,fl as showHtmlTreePane,el as stopWatchHtmlTreeDock,ml as toggleHtmlTreePanel,Vt as watchHtmlTreeDock};
