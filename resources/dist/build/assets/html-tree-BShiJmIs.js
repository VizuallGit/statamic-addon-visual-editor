const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-BqsL3ULf.js","./tw-candidates-CSP7aVNi.js"])))=>i.map(i=>d[i]);
import{r as qe,R as yo,u as s,o as h,c as m,a as M,t as P,F as A,i as F,m as Ln,f as C,n as bo,w as x,$ as oe,s as p,e as _o,L as j,N as To,aa as xo,a4 as wo,ad as Te,j as Pt,ac as So,Z as ce,aC as Co,v as ln,_ as Lo,x as Eo,A as Po,V as Ho,aA as $o,W as En,aD as Mo,B as it,p as jt,q as qt,U as De,X as Io,aE as Ao,aF as Oo}from"./addon-OSeir1d8.js";import{c as Pn,a as Ro,o as Do,b as Fo,d as Bo,T as No,i as Ko,r as Vo,e as jo,f as qo,u as dn,l as cn}from"./section-create-CgOaCXsa.js";import{canEditFields as Uo,currentSetHandle as zo,openFieldsetOverlay as Hn,openGlobalFieldsOverlay as Yo}from"./section-fields-Cn4W70xJ.js";import{ap as t,aq as Xo,ar as Wo,b as _,s as Ut,i as ue,Z as Ht,ad as Go,R as Zo,ab as $n,ac as Mn,M as un,q as Ie,W as Jo,S as Qo,U as ea,as as ta,at as hn,au as In,av as An,n as On,aw as na,ax as oa,o as Rn,ay as aa,A as Dn,a0 as lt,t as dt,az as Fn,aA as sa,aB as zt,aC as ra,aD as ia,aE as la,a6 as da,aF as ca,aG as ua,aH as ha,aI as pa,aJ as fa,X as Bn,a8 as ma,L as Yt}from"./lp-cluster-BB1zkIU6.js";import{H as Ye,e as va,a as ga}from"./ids-w-uWXFhx.js";import{_ as ct,o as Le,N as ka}from"./ChoiceDialog-pLkaoLpS.js";import{M as Q,S as ee}from"./protocol-YXBURS-N.js";import{y as X,C as ya,z as Ke,A as ba,t as _a,B as Xt,n as Ta,v as xa,D as Nn,k as wa,E as Kn,H as xe,F as Sa,G as Wt,c as Ca,I as La,a as Ea,J as Pa,K as Ha,L as $a,M as Ma,N as Ia,O as Aa,P as Oa,Q as be,R as Ra,S as Da,T as Fa,U as Ba,V as pn,W as Ue,X as Na,Y as Ka}from"./antlers-edit-B-2up7GW.js";import{x as ut,n as Va,N as Xe,K as Vn,L as jn,a as ja}from"./css-scope-o8ImqNAi.js";import{b as qa}from"./html-pick-align-CLq5l-p4.js";import"./FieldsetOverlay-e3OmwGZh.js";import"./ai-text-icon-B7uCWIwa.js";const yt=/\s*([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/y,Ua=/^\s*(?:([A-Za-z_$][\w$]*)|'([^'\\]*)'|"([^"\\]*)")\s*:\s*(true|false)\s*$/;function za(e){const n=String(e||"").replace(/\{\{[\s\S]*?\}\}/g,r=>" ".repeat(r.length)),a=n.match(/^<[a-zA-Z][\w:-]*/);if(!a)return null;let o=a[0].length;for(;o<n.length;){yt.lastIndex=o;const r=yt.exec(n);if(!r){o+=1;continue}if(r[1].toLowerCase()==="x-data")return r[2]??r[3]??r[4]??"";o=yt.lastIndex}return null}function Ya(e,n){const a=e[n];for(let o=n+1;o<e.length;o+=1)if(e[o]==="\\")o+=1;else if(e[o]===a)return o;return e.length-1}function Xa(e){const n=String(e||""),a=n.search(/\S/);if(a===-1||n[a]!=="{")return[];const o=new Map;let r=0,l="";const i=()=>{const d=l.match(Ua);d&&o.set(d[1]??d[2]??d[3],d[4]==="true"),l=""};for(let d=a;d<n.length;d+=1){const k=n[d];if(k==='"'||k==="'"||k==="`"){const v=Ya(n,d);l+=n.slice(d,v+1),d=v;continue}if(k==="/"&&n[d+1]==="/"){const v=n.indexOf(`
`,d);d=v===-1?n.length:v-1;continue}if(k==="/"&&n[d+1]==="*"){const v=n.indexOf("*/",d+2);d=v===-1?n.length:v+1;continue}if(k==="{"||k==="["||k==="("){if(r+=1,r===1)continue}else if(k==="}"||k==="]"||k===")"){if(r-=1,r===0)break}else if(k===","&&r===1){i();continue}l+=k}return i(),[...o].map(([d,k])=>({key:d,value:k}))}const Wa={key:0,class:"sve-ht-inspect"},Ga={class:"sve-ht-inspect__head"},Za={key:0,class:"sve-ht-inspect__note"},Ja={key:2,class:"sve-ht-inspect__props"},Qa={class:"sve-ht-inspect__proplabel"},es={key:0},ts=["value","disabled","onChange"],ns={value:""},os=["value"],as=["value"],ss=["value","placeholder","onChange"],rs=["title","disabled","onClick"],is=["title","disabled","onClick"],ls={key:0,class:"sve-ht-inspect__seg"},ds=["data-active","disabled","onClick"],cs=["value","disabled"],us={key:0,value:""},hs=["value"],ps=["value","disabled"],fs=["value"],ms={key:3,class:"sve-ht-inspect__box"},vs=["value","placeholder","disabled","onKeydown"],gs=["title","disabled"],ks={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},ys=["value","disabled"],bs=["value"],_s={key:0,class:"sve-ht-inspect__tick"},Ts=["checked","disabled"],xs={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},ws=["value","disabled"],Ss=["value"],Cs={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},Ls=["value","placeholder","disabled"],Es=["title","disabled"],Ps={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Hs=["value","placeholder","disabled"],$s={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Ms=["value","placeholder","disabled"],Is={key:6,class:"sve-ht-inspect__add"},As=["disabled","onClick"],bt='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',Os='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',Rs={__name:"HtmlTreeInspector",setup(e){const n=qe(null);yo(n,v=>t.onPropHost?.(v||null));const a=qe(null),o=qe(null);function r(v){t.onInspectCommit?.(v.target.value)}function l(v,g,c){!v||!g||(v.value=g,v.focus(),v.setSelectionRange(g.length,g.length),c(g))}function i(v,g){t.onInspectData?.(v.currentTarget,c=>t.onPropValue?.(g.handle,c,!0))}function d(v){t.onInspectData?.(v.currentTarget,g=>l(a.value,g,c=>t.onInspectCommit?.(c)))}function k(v){t.onInspectData?.(v.currentTarget,g=>l(o.value,g,c=>t.onLoopSortField?.(c)))}return(v,g)=>s(t).inspect?(h(),m("div",Wa,[M("div",Ga,P(s(t).inspect.title),1),s(t).inspect.mode==="note"?(h(),m("div",Za,P(s(t).inspect.note),1)):s(t).inspect.mode==="statamic"?(h(),m("div",{key:1,ref_key:"propHost",ref:n,class:"sve-ht-inspect__form"},null,512)):s(t).inspect.mode==="props"?(h(),m("div",Ja,[(h(!0),m(A,null,F(s(t).inspect.rows,c=>(h(),m("label",{key:c.handle,class:"sve-ht-inspect__prop"},[M("span",Qa,[Ln(P(c.label)+" ",1),c.bound?(h(),m("em",es,":")):C("",!0)]),M("span",{class:bo(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":c.type==="select"||c.type==="link"}])},[c.type==="select"&&!c.bound?(h(),m("select",{key:0,value:c.value,disabled:!s(t).canEdit,onChange:S=>s(t).onPropValue?.(c.handle,S.target.value,!1)},[M("option",ns,P(c.placeholder||s(t).inspect.inheritLabel),1),c.value&&!c.options.includes(c.value)?(h(),m("option",{key:0,value:c.value},P(c.value),9,os)):C("",!0),(h(!0),m(A,null,F(c.options,S=>(h(),m("option",{key:S,value:S},P(S),9,as))),128))],40,ts)):(h(),m("input",{key:1,type:"text",value:c.value,placeholder:c.placeholder||s(t).inspect.inheritLabel,onChange:S=>s(t).onPropValue?.(c.handle,S.target.value,c.bound)},null,40,ss)),c.type==="link"?(h(),m("button",{key:2,type:"button","data-sve-ht-data":"",title:s(t).pageTitle,disabled:!s(t).canEdit,onClick:S=>s(t).onPropPage?.(S.currentTarget,c.handle),innerHTML:Os},null,8,rs)):C("",!0),M("button",{type:"button","data-sve-ht-data":"",title:s(t).dataTitle,disabled:!s(t).canEdit,onClick:S=>i(S,c),innerHTML:bt},null,8,is)],2)]))),128))])):(h(),m(A,{key:3},[s(t).inspect.mode==="loop"?(h(),m("div",ls,[(h(!0),m(A,null,F(s(t).inspect.kinds,c=>(h(),m("button",{key:c.id,type:"button","data-active":c.id===s(t).inspect.loopKind?"":void 0,disabled:!s(t).canEdit,onClick:S=>s(t).onLoopKind?.(c.id)},P(c.label),9,ds))),128))])):C("",!0),s(t).inspect.mode==="loop"&&s(t).inspect.loopKind==="collection"?(h(),m("select",{key:s(t).inspect.key+":"+s(t).inspect.value,value:s(t).inspect.value,disabled:!s(t).canEdit,onChange:r},[s(t).inspect.value?C("",!0):(h(),m("option",us,P(s(t).inspect.placeholder),1)),(h(!0),m(A,null,F(s(t).inspect.collections,c=>(h(),m("option",{key:c.handle,value:c.handle},P(c.title),9,hs))),128))],40,cs)):s(t).inspect.mode==="loop"&&s(t).inspect.loopKind==="nav"?(h(),m("select",{key:s(t).inspect.key+":nav:"+s(t).inspect.value,value:s(t).inspect.value,disabled:!s(t).canEdit,onChange:r},[(h(!0),m(A,null,F(s(t).inspect.navs,c=>(h(),m("option",{key:c.handle,value:c.handle},P(c.title),9,fs))),128))],40,ps)):(h(),m("div",ms,[(h(),m("input",{ref_key:"field",ref:a,key:s(t).inspect.key,type:"text",value:s(t).inspect.value,placeholder:s(t).inspect.placeholder,disabled:!s(t).canEdit,spellcheck:"false",onKeydown:[g[0]||(g[0]=x(()=>{},["stop"])),oe(x(r,["prevent"]),["enter"])],onBlur:r},null,40,vs)),M("button",{type:"button","data-sve-ht-data":"",title:s(t).dataTitle,disabled:!s(t).canEdit,innerHTML:bt,onMousedown:g[1]||(g[1]=x(()=>{},["prevent"])),onClick:x(d,["stop","prevent"])},null,40,gs)])),s(t).inspect.nav?(h(),m(A,{key:4},[M("div",ks,P(s(t).inspect.nav.depthTitle),1),(h(),m("select",{key:s(t).inspect.key+":depth:"+s(t).inspect.nav.depth,value:s(t).inspect.nav.depth,disabled:!s(t).canEdit,onChange:g[2]||(g[2]=c=>s(t).onLoopDepth?.(c.target.value))},[(h(!0),m(A,null,F(s(t).inspect.nav.depths,c=>(h(),m("option",{key:c.id,value:c.id},P(c.label),9,bs))),128))],40,ys)),s(t).inspect.nav.homeAsked?(h(),m("label",_s,[M("input",{type:"checkbox",checked:s(t).inspect.nav.includeHome,disabled:!s(t).canEdit,onChange:g[3]||(g[3]=c=>s(t).onLoopIncludeHome?.(c.target.checked))},null,40,Ts),M("span",null,P(s(t).inspect.nav.homeLabel),1)])):C("",!0)],64)):C("",!0),s(t).inspect.sort?(h(),m(A,{key:5},[M("div",xs,P(s(t).inspect.sort.title),1),(h(),m("select",{key:s(t).inspect.key+":dir:"+s(t).inspect.sort.dir,value:s(t).inspect.sort.dir,disabled:!s(t).canEdit,onChange:g[4]||(g[4]=c=>s(t).onLoopSortDir?.(c.target.value))},[(h(!0),m(A,null,F(s(t).inspect.sort.dirs,c=>(h(),m("option",{key:c.id,value:c.id},P(c.label),9,Ss))),128))],40,ws)),s(t).inspect.sort.needsField?(h(),m("div",Cs,[(h(),m("input",{ref_key:"sortField",ref:o,key:s(t).inspect.key+":field",type:"text",value:s(t).inspect.sort.field,placeholder:s(t).inspect.sort.placeholder,disabled:!s(t).canEdit,spellcheck:"false",onKeydown:[g[5]||(g[5]=x(()=>{},["stop"])),g[6]||(g[6]=oe(x(c=>s(t).onLoopSortField?.(c.target.value),["prevent"]),["enter"]))],onBlur:g[7]||(g[7]=c=>s(t).onLoopSortField?.(c.target.value))},null,40,Ls)),s(t).inspect.sort.pickable?(h(),m("button",{key:0,type:"button","data-sve-ht-data":"",title:s(t).dataTitle,disabled:!s(t).canEdit,innerHTML:bt,onMousedown:g[8]||(g[8]=x(()=>{},["prevent"])),onClick:x(k,["stop","prevent"])},null,40,Es)):C("",!0)])):C("",!0),M("div",Ps,P(s(t).inspect.limit.title),1),(h(),m("input",{key:s(t).inspect.key+":limit",type:"number",min:"1",value:s(t).inspect.limit.value,placeholder:s(t).inspect.limit.placeholder,disabled:!s(t).canEdit,onKeydown:[g[9]||(g[9]=x(()=>{},["stop"])),g[10]||(g[10]=oe(x(c=>s(t).onLoopLimit?.(c.target.value),["prevent"]),["enter"]))],onBlur:g[11]||(g[11]=c=>s(t).onLoopLimit?.(c.target.value))},null,40,Hs)),M("div",$s,P(s(t).inspect.offset.title),1),(h(),m("input",{key:s(t).inspect.key+":offset",type:"number",min:"0",value:s(t).inspect.offset.value,placeholder:s(t).inspect.offset.placeholder,disabled:!s(t).canEdit,onKeydown:[g[12]||(g[12]=x(()=>{},["stop"])),g[13]||(g[13]=oe(x(c=>s(t).onLoopOffset?.(c.target.value),["prevent"]),["enter"]))],onBlur:g[14]||(g[14]=c=>s(t).onLoopOffset?.(c.target.value))},null,40,Ms))],64)):C("",!0),s(t).inspect.branches?.length?(h(),m("div",Is,[(h(!0),m(A,null,F(s(t).inspect.branches,c=>(h(),m("button",{key:c.id,type:"button",disabled:!s(t).canEdit,onClick:S=>s(t).onAddBranch?.(c.id)},P(c.label),9,As))),128))])):C("",!0)],64))])):C("",!0)}},Ds=ct(Rs,[["__scopeId","data-v-7ecb01a5"]]),Fs={class:"sve-html-tree"},Bs={class:"sve-pane-bar","data-sve-pane-bar":""},Ns={"data-sve-right-title":""},Ks={"data-sve-right-actions":""},Vs=["aria-pressed","title","aria-label"],js=["title"],qs={class:"sve-ht-used-by__label"},Us={class:"sve-ht-used-by__chips"},zs=["title","onClick"],Ys={key:1,class:"sve-ht-used-by__chip"},Xs={key:0,class:"sve-ht-used-by__empty"},Ws={class:"sve-ht-tools"},Gs=["title"],Zs=["placeholder","aria-label","value"],Js=["aria-label"],Qs=["title","aria-label"],er=["title","aria-label"],tr={key:2,class:"sve-tree-exit"},nr=["title"],or=["title"],ar='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',sr='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',rr='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',ir='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',lr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/></svg>',dr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',cr={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const n=p(window,"html_tree_search");t.layers=Xo(window);const a=p(window,"html_tree_layers_on"),o=p(window,"html_tree_layers_off");function r(){Wo(window,!t.layers)}const l=Pn(window),i=p(window,"section_new"),d=p(window,"html_tree_add_element"),k=p(window,"html_tree_sections_slot"),v=p(window,"html_tree_sections_no_field");function g(){const b=t.templateSections.length?t.templateSections:[xo(window)],L=new Set(t.rows.filter($=>$.kind==="sections").map($=>$.tag));return b.filter($=>!L.has($)).map($=>({tag:`sections:${$}`,label:b.length>1?`${k} · ${$}`:k,noField:!t.templateSections.length}))}const c=qe(!1),S=p(window,"section_import");function w(){c.value=!1}async function D(b){if(!b)return;await wo(),t.onRefresh?.();const L=_("html-tree:open-section",b);L&&Vo(window,L.ids)}function E(){const b=t.rows.find(L=>L.current&&!L.context&&!L.synthetic)||null;return b?.lockedIn?t.rows.filter(L=>L.locked&&L.from<=b.from&&L.to>=b.to).sort((L,$)=>L.from-$.from)[0]||null:b}function te(b){const L=b.getBoundingClientRect(),$=E();let I=null;const K=(B,He,se="")=>()=>{I?.dismiss(),I=null,w();const ft=Ko(window,B,$,He);ft!==null&&(t.selectFrom={at:ft,left:4},se&&window.Statamic?.$toast?.info?.(se))};I=Le(document,Ke,{items:[...No.map(B=>({label:B,onPick:K(B,`<${B}>`)})),...g().map(B=>({label:B.label,onPick:K(B.tag,B.label,B.noField?v:"")}))],x:Math.round(L.left),y:Math.round(L.bottom+4),onClose:()=>{I=null,w()}})}function ne(b){if(!c.value){if(c.value=!0,!(t.sections.length||t.pageBuilder)){te(b.currentTarget);return}(async()=>{const L=await Ro(window);if(!L){w();return}const $=t.sections.length?t.sections[t.sections.length-1].uid:null,I=K=>{w(),D(K?.uid)};if(L==="static"){Do(window,{afterUid:$,onDone:I,onError:w,onClose:w});return}Fo(window,{afterUid:$,onDone:I,onError:w,onClose:w})})()}}function y(){if(c.value)return;c.value=!0;const b=!!(t.sections.length||t.pageBuilder);Bo(window,{intoTemplate:!b,after:b?null:E(),afterUid:b&&t.sections.length?t.sections[t.sections.length-1].uid:null,onDone:L=>{if(w(),b){D(L?.uid);return}Number.isInteger(L?.at)&&(t.selectFrom={at:L.at,left:4})},onError:w,onClose:w})}function f(b){const L=!!t.query;t.query=b,L!==!!b&&t.onQuery?.()}return(b,L)=>(h(),m("div",Fs,[M("div",Bs,[M("div",Ns,P(e.title),1),M("div",Ks,[M("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":s(t).layers?"true":"false",title:s(t).layers?s(o):s(a),"aria-label":s(t).layers?s(o):s(a),innerHTML:ar,onClick:r},null,8,Vs),L[5]||(L[5]=_o('<button type="button" data-sve-right-pin aria-pressed="false" data-v-9a4a7640></button><button type="button" data-sve-close aria-label="Close" data-v-9a4a7640><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-9a4a7640><path d="M18 6 6 18" data-v-9a4a7640></path><path d="m6 6 12 12" data-v-9a4a7640></path></svg></button>',2))])]),s(t).usedBy?(h(),m("div",{key:0,class:"sve-ht-used-by",title:s(t).usedBy.hint||null},[M("span",qs,[M("span",{class:"sve-ht-used-by__icon","aria-hidden":"true",innerHTML:lr}),Ln(" "+P(s(t).usedBy.label),1)]),M("span",Us,[(h(!0),m(A,null,F(s(t).usedBy.items,$=>(h(),m(A,{key:$.kind+":"+$.name},[$.onOpen?(h(),m("button",{key:0,type:"button",class:"sve-ht-used-by__chip sve-ht-used-by__chip--open",title:$.openLabel,onClick:I=>$.onOpen(I.currentTarget)},P($.name),9,zs)):(h(),m("span",Ys,P($.name),1))],64))),128)),s(t).usedBy.empty?(h(),m("span",Xs,P(s(t).usedBy.empty),1)):C("",!0)])],8,js)):C("",!0),M("div",Ws,[M("label",{class:"sve-ht-search",title:s(n)},[M("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:ir}),M("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:s(n),"aria-label":s(n),value:s(t).query,autocomplete:"off",spellcheck:"false",onInput:L[0]||(L[0]=$=>f($.target.value)),onKeydown:[L[1]||(L[1]=x(()=>{},["stop"])),L[2]||(L[2]=oe(x($=>f(""),["prevent"]),["escape"]))]},null,40,Zs),s(t).query?(h(),m("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":s(n),innerHTML:dr,onClick:L[3]||(L[3]=$=>f(""))},null,8,Js)):C("",!0)],8,Gs),s(l)&&(s(t).sections.length||s(t).pageBuilder||s(t).rows.length&&!s(t).layoutFile)?(h(),m("button",{key:0,type:"button",class:"sve-ht-new",title:s(t).sections.length||s(t).pageBuilder?s(i):s(d),"aria-label":s(t).sections.length||s(t).pageBuilder?s(i):s(d),innerHTML:sr,onClick:ne},null,8,Qs)):C("",!0),s(l)&&(s(t).sections.length||s(t).pageBuilder||s(t).rows.length&&!s(t).layoutFile)?(h(),m("button",{key:1,type:"button",class:"sve-ht-import",title:s(S),"aria-label":s(S),innerHTML:rr,onClick:y},null,8,er)):C("",!0)]),s(X).inSidebar?C("",!0):(h(),j(ya,{key:1})),L[6]||(L[6]=M("div",{"data-sve-html-tree-list":""},null,-1)),To(Ds),s(t).exitOpen&&!s(X).inSidebar?(h(),m("div",tr,[M("span",{class:"sve-tree-exit__name",title:s(t).exitName},P(s(t).exitName),9,nr),M("button",{type:"button",class:"sve-tree-exit__go",title:s(t).exitTitle,onClick:L[4]||(L[4]=$=>s(t).onExit?.())},P(s(t).exitLabel),9,or)])):C("",!0)]))}},qn=ct(cr,[["__scopeId","data-v-9a4a7640"]]);function Un(e){return String(e||"").trim().toLowerCase()}function $t(e,n){return n?[e.name,e.tag,e.klass,e.label,e.src].filter(a=>typeof a=="string"&&a).join(" ").toLowerCase().includes(n):!0}function ur(e,n){const a=Un(n);if(!a)return{rows:e,hits:new Set};const o=new Set;for(const i of e)$t(i,a)&&o.add(i.path);const r=[...o];return{rows:e.filter(i=>o.has(i.path)||r.some(d=>d.startsWith(`${i.path}/`))),hits:o}}const hr=["title"],pr={"data-sve-ht-indent":"","aria-hidden":"true"},fr=["data-sve-ht-cat"],mr={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},vr={key:2,"data-sve-ht-letter":""},gr=["innerHTML"],kr=["title"],yr=["title"],br={key:1,"data-sve-ht-kind":""},_r={key:3,"data-sve-ht-name":""},Tr={key:4,"data-sve-ht-actions":""},xr=["data-on","title","innerHTML"],wr=["title"],Sr={key:5,"data-sve-ht-actions":""},Cr=["data-on","title","innerHTML"],Lr=["data-on","title","innerHTML"],Er=["disabled","title","innerHTML"],Pr=["disabled","title"],Hr=["disabled","title"],$r=["data-on","disabled","title","aria-pressed","innerHTML"],Mr=["disabled","title"],Ir=["data-sve-ht-id"],fn='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',Ar='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',Or='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Rr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',Dr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',Fr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',Br='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',mn='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6.5" width="20" height="11" rx="5.5"/><circle cx="7.5" cy="12" r="3" fill="currentColor" stroke="none"/></svg>',vn='<svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M7.5 5.5h9a6.5 6.5 0 0 1 0 13h-9a6.5 6.5 0 0 1 0-13ZM16.5 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6Z"/></svg>',Nr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',Kr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-.9"/></svg>',Vr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',jr={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const n=Uo(window),a=p(window,"section_fields");function o(){const y=zo();if(!y){window.Statamic?.$toast?.error(p(window,"section_fields_none"));return}Hn(window,y)}function r(y){return y.synthetic?y.frame==="main"?t.frameMainTitle:y.frame==="template"?t.frameTemplateTitle:t.frameOpenTitle:y.kind==="component"?y.src?`partial:${y.src}`:y.tag:y.name?`${y.tag} ${y.name}`:y.tag}function l(y){return!!y.section}function i(y){return!!y.frame}function d(y){return y.kind==="slot"}function k(y,f){i(f)||d(f)||(l(f)?t.onSectionPointerDown?.(y,f.section):f.sectionRoot?t.onSectionPointerDown?.(y,f.sectionRoot):t.onPointerDown?.(y,f.id))}function v(y){if(y.synthetic){t.onFrame?.(y.frame);return}if(l(y)){t.onSection?.(y.section);return}t.onSelect?.(y.id)}function g(y,f){const b={"data-sve-ht-id":y.id};return y.locked&&(b["data-sve-ht-locked"]=""),y.current&&(b["data-sve-ht-current"]=""),y.hidden&&(b["data-sve-ht-hidden"]=""),b["data-sve-ht-cat"]=y.cat||"other",b["data-sve-ht-depth"]=String(y.depth),f&&(b["data-sve-ht-dim"]=""),l(y)&&(b["data-sve-ht-sec"]=""),i(y)&&(b["data-sve-ht-frame"]=y.frame),!l(y)&&t.dropId===y.id&&t.dropPlace&&(b["data-sve-ht-drop"]=t.dropPlace),b}function c(y){return!!y.fixed}function S(y){return y.kind==="sections"}function w(y){return!!(y.locked||y.lockedIn)}function D(y){return!y.lockedIn&&!c(y)}function E(y){return!c(y)&&!S(y)&&!w(y)&&(!y.hidden||y.wrapFrom!=null)}function te(y){return!!y.sectionRoot||!!y.section}function ne(y){return t.canEdit&&!w(y)||te(y)}return(y,f)=>(h(),m(A,null,[M("div",Te({"data-sve-ht-row":""},g(e.row,e.dim),{role:"button",tabindex:"0",title:r(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:f[41]||(f[41]=b=>v(e.row)),onDblclick:f[42]||(f[42]=x(b=>e.row.synthetic?s(t).onFrameEnter?.(e.row.frame):i(e.row)||d(e.row)||l(e.row)?null:s(t).onRename?.(e.row.id),["prevent"])),onKeydown:[f[43]||(f[43]=oe(x(b=>v(e.row),["prevent"]),["enter"])),f[44]||(f[44]=oe(x(b=>v(e.row),["prevent"]),["space"]))],onPointerdown:f[45]||(f[45]=b=>k(b,e.row)),onPointerenter:f[46]||(f[46]=b=>l(e.row)?s(t).onSectionHover?.(e.row.section):null),onContextmenu:f[47]||(f[47]=x(b=>i(e.row)||d(e.row)||l(e.row)?null:s(t).onContext?.(b,e.row.id),["prevent","stop"]))}),[M("span",pr,[(h(!0),m(A,null,F(e.row.guides||[],(b,L)=>(h(),m("i",{key:L,"data-sve-ht-cat":b},null,8,fr))),128))]),e.row.hasChildren||e.row.emptyBlock?(h(),m("button",Te({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?s(t).mainShut:e.row.shut)?{"data-sve-ht-shut":""}:{},{innerHTML:Ar,onClick:f[0]||(f[0]=x(b=>e.row.synthetic?s(t).onFrameTwist?.():l(e.row)?s(t).onSection?.(e.row.section):s(t).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:f[1]||(f[1]=x(()=>{},["stop"])),onDblclick:f[2]||(f[2]=x(()=>{},["stop"]))}),null,16)):(h(),m("span",mr)),e.row.letter?(h(),m("span",vr,P(e.row.letter),1)):(h(),m("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,gr)),M("span",{"data-sve-ht-text":"",title:s(t).renameTitle},[!e.row.kind&&!l(e.row)&&!i(e.row)?(h(),m("button",{key:0,type:"button","data-sve-ht-tag":"",title:s(t).tagTitle,onClick:f[3]||(f[3]=x(()=>{},["stop","prevent"])),onPointerdown:f[4]||(f[4]=x(()=>{},["stop"])),onDblclick:f[5]||(f[5]=x(b=>s(t).onTagChange?.(b,e.row.id),["stop","prevent"]))},P(e.row.tag),41,yr)):(h(),m("span",br,P(e.row.tag),1)),s(t).editingId===e.row.id&&!l(e.row)?Pt((h(),m("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":f[6]||(f[6]=b=>s(t).draft=b),onMousedown:f[7]||(f[7]=x(()=>{},["stop"])),onPointerdown:f[8]||(f[8]=x(()=>{},["stop"])),onClick:f[9]||(f[9]=x(()=>{},["stop"])),onDblclick:f[10]||(f[10]=x(()=>{},["stop"])),onKeydown:[f[11]||(f[11]=x(()=>{},["stop"])),f[12]||(f[12]=oe(x(b=>s(t).onRenameCommit?.(),["prevent"]),["enter"])),f[13]||(f[13]=oe(x(b=>s(t).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:f[14]||(f[14]=b=>s(t).onRenameCommit?.())},null,544)),[[So,s(t).draft]]):(h(),m("span",_r,P(e.row.name),1))],8,kr),i(e.row)?(h(),m("span",Tr,[e.row.alpineNth>=0?(h(),m("button",{key:0,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:s(t).alpineTitle,innerHTML:e.row.alpineSet?vn:mn,onClick:f[15]||(f[15]=x(b=>s(t).onAlpineState?.(b,e.row.id),["stop","prevent"])),onPointerdown:f[16]||(f[16]=x(()=>{},["stop"])),onDblclick:f[17]||(f[17]=x(()=>{},["stop"]))},null,40,xr)):C("",!0),e.row.frame!=="main"&&s(n)?(h(),m("button",{key:1,type:"button","data-sve-ht-fields":"",title:s(t).frameFieldsTitle,innerHTML:fn,onClick:f[18]||(f[18]=x(b=>s(t).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:f[19]||(f[19]=x(()=>{},["stop"])),onDblclick:f[20]||(f[20]=x(()=>{},["stop"]))},null,40,wr)):C("",!0)])):!l(e.row)&&!d(e.row)?(h(),m("span",Sr,[e.row.videoNth>=0?(h(),m("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?s(t).videoPlayTitle:s(t).videoHoldTitle,innerHTML:e.row.videoHeld?Br:Fr,onClick:f[21]||(f[21]=x(b=>s(t).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:f[22]||(f[22]=x(()=>{},["stop"])),onDblclick:f[23]||(f[23]=x(()=>{},["stop"]))},null,40,Cr)):C("",!0),e.row.alpineNth>=0?(h(),m("button",{key:1,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:s(t).alpineTitle,innerHTML:e.row.alpineSet?vn:mn,onClick:f[24]||(f[24]=x(b=>s(t).onAlpineState?.(b,e.row.id),["stop","prevent"])),onPointerdown:f[25]||(f[25]=x(()=>{},["stop"])),onDblclick:f[26]||(f[26]=x(()=>{},["stop"]))},null,40,Lr)):C("",!0),E(e.row)?(h(),m("button",{key:2,type:"button","data-sve-ht-eye":"",disabled:!s(t).canEdit,title:s(t).canEdit?e.row.hidden?s(t).showTitle:s(t).hideTitle:s(t).lockedTitle,innerHTML:e.row.hidden?Rr:Or,onClick:f[27]||(f[27]=x(b=>s(t).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:f[28]||(f[28]=x(()=>{},["stop"])),onDblclick:f[29]||(f[29]=x(()=>{},["stop"]))},null,40,Er)):C("",!0),s(n)&&e.row.fieldsIcon?(h(),m("button",{key:3,type:"button","data-sve-ht-fields":"",disabled:!s(t).canEdit,title:s(t).canEdit?s(a):s(t).lockedTitle,innerHTML:fn,onClick:x(o,["stop","prevent"]),onPointerdown:f[30]||(f[30]=x(()=>{},["stop"])),onDblclick:f[31]||(f[31]=x(()=>{},["stop"]))},null,40,Pr)):C("",!0),!c(e.row)&&!S(e.row)?(h(),m("button",{key:4,type:"button","data-sve-ht-dup":"",disabled:!ne(e.row),title:ne(e.row)?s(t).duplicateTitle:s(t).lockedTitle,innerHTML:Dr,onClick:f[32]||(f[32]=x(b=>s(t).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:f[33]||(f[33]=x(()=>{},["stop"])),onDblclick:f[34]||(f[34]=x(()=>{},["stop"]))},null,40,Hr)):C("",!0),D(e.row)?(h(),m("button",{key:5,type:"button","data-sve-ht-lock":"","data-on":e.row.locked?"":null,disabled:!s(t).canEdit||e.row.locked&&!s(t).canUnlock,title:e.row.locked?s(t).canUnlock?s(t).unlockTitle:s(t).lockedByTitle:s(t).lockTitle,"aria-pressed":e.row.locked?"true":"false",innerHTML:e.row.locked?Nr:Kr,onClick:f[35]||(f[35]=x(b=>s(t).onLock?.(e.row.id),["stop","prevent"])),onPointerdown:f[36]||(f[36]=x(()=>{},["stop"])),onDblclick:f[37]||(f[37]=x(()=>{},["stop"]))},null,40,$r)):C("",!0),c(e.row)?C("",!0):(h(),m("button",{key:6,type:"button","data-sve-ht-del":"",disabled:!ne(e.row),title:ne(e.row)?s(t).deleteTitle:s(t).lockedTitle,innerHTML:Vr,onClick:f[38]||(f[38]=x(b=>s(t).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:f[39]||(f[39]=x(()=>{},["stop"])),onDblclick:f[40]||(f[40]=x(()=>{},["stop"]))},null,40,Mr))])):C("",!0)],16,hr),e.row.emptyBlock&&!e.row.shut?(h(),m("div",Te({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},s(t).dropId===e.row.id&&s(t).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),P(s(t).slotText),17,Ir)):C("",!0)],64))}},Y=ct(jr,[["__scopeId","data-v-25ebfb99"]]),qr=["data-sve-ht-look","data-sve-ht-layers"],Ur={key:0,class:"sve-ht-page-template"},zr={key:0,class:"sve-ht-page-template__text"},Yr={class:"sve-ht-page-template__note"},Xr={key:1,class:"sve-ht-empty"},Wr={key:2,class:"sve-ht-empty"},Gr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},Zr={key:0,class:"sve-ht-empty"},Jr={key:0,class:"sve-ht-empty"},Qr=["data-sve-ht-under-main"],ei={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},ti={key:0,class:"sve-ht-empty"},ni=["data-sve-ht-under-main"],oi=["data-dim"],ai={key:0,class:"sve-ht-empty"},si={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},ri={key:0,class:"sve-ht-empty"},ii={key:4,"data-sve-ht-branch":"","data-sve-ht-cat":"component"},li={__name:"HtmlTreeList",setup(e){const n=ce(()=>Un(t.query)),a=ce(()=>ur(t.rows,n.value)),o=ce(()=>a.value.rows),r=ce(()=>n.value?t.sections.filter(w=>$t(w.row,n.value)||w.current&&w.ready&&o.value.length>0):t.sections);function l(w){return!!w&&(!n.value||$t(w,n.value))}function i(w){const D=t.frame?.kind;return t.inComponent||(D==="header"||D==="footer")&&D!==w}const d=ce(()=>t.frame?.kind==="header"||t.frame?.kind==="footer"),k=ce(()=>!!t.frame&&["header","main","footer"].some(w=>l(t.frame[w]))),v=ce(()=>!!t.frame&&(t.frame.kind==="main"||l(t.frame.main))),g=ce(()=>!!n.value&&!r.value.length&&!o.value.length&&!k.value);function c(w){return!!n.value&&!a.value.hits.has(w.path)}function S(w){const D={"data-sve-ht-sec-uid":w.uid};return w.current&&(D["data-sve-ht-branch"]="",D["data-sve-ht-cat"]=w.row?.cat||"layout"),t.sectionDrop&&t.sectionDrop.uid===w.uid&&(D["data-sve-ht-drop"]=t.sectionDrop.place),D}return(w,D)=>(h(),m("div",Te({class:"sve-ht-root","data-sve-ht-look":s(t).layers?"tags":s(t).look,"data-sve-ht-layers":s(t).layers?"":null,style:s(t).familyStyle},s(t).dragging?{"data-sve-ht-dragging":""}:{}),[s(t).pageTemplate?(h(),m("div",Ur,[s(t).pageTemplate.text?(h(),m("p",zr,P(s(t).pageTemplate.text),1)):C("",!0),M("p",Yr,P(s(t).pageTemplate.note),1),s(t).pageTemplate.canOpen?(h(),m("button",{key:1,type:"button",class:"sve-ht-page-template__open",onClick:D[0]||(D[0]=E=>s(t).pageTemplate.onOpen(E.currentTarget))},P(s(t).pageTemplate.openLabel),1)):C("",!0)])):!s(t).rows.length&&!s(t).sections.length&&!s(t).frame?(h(),m("div",Xr,P(s(t).emptyText),1)):g.value?(h(),m("div",Wr,P(s(t).searchEmpty),1)):C("",!0),s(t).frame||s(t).sections.length?(h(),m(A,{key:3},[s(t).frame?(h(),m(A,{key:0},[s(t).frame.kind==="header"?(h(),m("div",Gr,[(h(!0),m(A,null,F(o.value,E=>(h(),j(Y,{key:E.id,row:E,dim:c(E)},null,8,["row","dim"]))),128)),s(t).rows.length?C("",!0):(h(),m("div",Zr,P(s(t).emptyText),1))])):!d.value&&l(s(t).frame.header)?(h(),j(Y,{key:1,row:s(t).frame.header,dim:i("header")},null,8,["row","dim"])):C("",!0)],64)):C("",!0),d.value?C("",!0):(h(),m("div",Co(Te({key:1},s(t).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[s(t).frame?.kind==="main"?(h(),m(A,{key:0},[(h(!0),m(A,null,F(o.value,E=>(h(),j(Y,{key:E.id,row:E,dim:c(E)},null,8,["row","dim"]))),128)),s(t).rows.length?C("",!0):(h(),m("div",Jr,P(s(t).emptyText),1))],64)):s(t).frame&&l(s(t).frame.main)?(h(),j(Y,{key:1,row:s(t).frame.main,dim:i("main")},null,8,["row","dim"])):C("",!0),s(t).frame?.kind==="template"?Pt((h(),m("div",{key:2,"data-sve-ht-frame-body":"","data-sve-ht-under-main":v.value?"":null},[M("div",ei,[(h(!0),m(A,null,F(o.value,E=>(h(),j(Y,{key:E.id,row:E,dim:c(E)},null,8,["row","dim"]))),128)),s(t).rows.length?C("",!0):(h(),m("div",ti,P(s(t).emptyText),1))])],8,Qr)),[[ln,!s(t).mainShut]]):C("",!0),s(t).sections.length||s(t).frame?Pt((h(),m("div",{key:3,"data-sve-ht-frame-body":"","data-sve-ht-under-main":v.value?"":null},[s(t).frame?.template&&l(s(t).frame.template)?(h(),j(Y,{key:0,row:s(t).frame.template,dim:i("template")},null,8,["row","dim"])):C("",!0),s(t).frame&&!s(t).frame.template&&!s(t).sections.length&&!n.value?(h(),m("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":i("")?"":void 0},P(s(t).frameEmptyText),9,oi)):C("",!0),(h(!0),m(A,null,F(r.value,E=>(h(),m("div",Te({key:E.uid},{ref_for:!0},S(E)),[E.ready?(h(),m(A,{key:0},[(h(!0),m(A,null,F(o.value,te=>(h(),j(Y,{key:te.id,row:te,dim:c(te)},null,8,["row","dim"]))),128)),s(t).rows.length?C("",!0):(h(),m("div",ai,P(s(t).emptyText),1))],64)):(h(),j(Y,{key:1,row:E.row,dim:i("")},null,8,["row","dim"]))],16))),128))],8,ni)),[[ln,!s(t).frame||!s(t).mainShut]]):C("",!0)],16)),s(t).frame?(h(),m(A,{key:2},[s(t).frame.kind==="footer"?(h(),m("div",si,[(h(!0),m(A,null,F(o.value,E=>(h(),j(Y,{key:E.id,row:E,dim:c(E)},null,8,["row","dim"]))),128)),s(t).rows.length?C("",!0):(h(),m("div",ri,P(s(t).emptyText),1))])):!d.value&&l(s(t).frame.footer)?(h(),j(Y,{key:1,row:s(t).frame.footer,dim:i("footer")},null,8,["row","dim"])):C("",!0)],64)):C("",!0)],64)):s(t).inComponent&&s(t).rows.length?(h(),m("div",ii,[(h(!0),m(A,null,F(o.value,E=>(h(),j(Y,{key:E.id,row:E,dim:c(E)},null,8,["row","dim"]))),128))])):s(t).rows.length?(h(!0),m(A,{key:5},F(o.value,E=>(h(),j(Y,{key:E.id,row:E,dim:c(E)},null,8,["row","dim"]))),128)):C("",!0)],16,qr))}},_t=ct(li,[["__scopeId","data-v-d0376715"]]);let Tt=null;function di(e){return Tt||(Tt=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():{pages:[]}).then(n=>Array.isArray(n.pages)?n.pages:[]).catch(()=>[])),Tt}let We=null;function xt(){We?.dismiss(),We=null}function ci(e,n,a){xt();const o=n?.getBoundingClientRect?.(),r={x:o?o.left:0,y:o?o.bottom+4:0};di(e).then(l=>{const i=l.length?l.map(d=>({label:d.title||d.url,onPick:()=>{xt(),a(d.url)}})):[{label:p(e,"component_props_pages_none"),onPick:null}];xt(),We=Le(e.document,Ke,{items:i,x:r.x,y:r.y,onClose:()=>{We=null}})})}const zn="sve-html-tree-labels";function Yn(){try{const e=globalThis.localStorage?.getItem(zn);if(!e)return{};const n=JSON.parse(e);return n&&typeof n=="object"?n:{}}catch{return{}}}function ui(e){try{globalThis.localStorage?.setItem(zn,JSON.stringify(e))}catch{}}function Xn(e){return String(e||"_")}function Wn(e){const n=Yn()[Xn(e)];return n&&typeof n=="object"?{...n}:{}}function hi(e,n,a){const o=a?.[n];return typeof o=="string"&&o.trim()?o.replace(/\s+/g," ").trim():String(e||"").trim()}function pi(e,n,a,o){if(!n)return;const r=Xn(e),l=Yn(),i={...l[r]||{}},d=String(a||"").replace(/\s+/g," ").trim(),k=String(o||"").trim();!d||d===k?delete i[n]:i[n]=d,Object.keys(i).length?l[r]=i:delete l[r],ui(l)}const fi=/^@(media|supports|container|layer|scope)\b/i;function mi(e){const n=String(e||""),a=[];let o=0,r=0;for(;o<n.length;){if(n[o]==="{"&&n[o+1]==="{"){const d=n.indexOf("}}",o+2);o=d===-1?n.length:d+2;continue}if(n[o]==="/"&&n[o+1]==="*"){const d=n.indexOf("*/",o+2);o=d===-1?n.length:d+2;continue}if(n[o]==='"'||n[o]==="'"){const d=n[o];for(o+=1;o<n.length&&n[o]!==d;)o+=n[o]==="\\"?2:1;o+=1;continue}if(n[o]!=="{"){o+=1;continue}let l=1,i=o+1;for(;i<n.length&&l>0;){if(n[i]==="{"&&n[i+1]==="{"){const d=n.indexOf("}}",i+2);i=d===-1?n.length:d+2;continue}if(n[i]==="/"&&n[i+1]==="*"){const d=n.indexOf("*/",i+2);i=d===-1?n.length:d+2;continue}if(n[i]==='"'||n[i]==="'"){const d=n[i];for(i+=1;i<n.length&&n[i]!==d;)i+=n[i]==="\\"?2:1;i+=1;continue}n[i]==="{"?l+=1:n[i]==="}"&&(l-=1),i+=1}a.push({selector:n.slice(r,o).trim(),body:n.slice(o+1,i-1),from:r,to:i,text:n.slice(r,i).trim()}),o=i,r=i}return a}function gn(e){const n=String(e||""),a=new Set,o=new Set,r=new Set;for(const l of n.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const i of l[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))i&&(a.add(i),a.add(i.replace(/([:./%!#()[\],])/g,"\\$1")));for(const l of n.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))l[2].trim()&&o.add(l[2].trim());for(const l of n.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))r.add(l[1].toLowerCase());return{classes:a,ids:o,tags:r}}function kn(e,n){const a=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),o=[...a.matchAll(/\.((?:\\.|[\w-])+)/g)].map(i=>i[1]),r=[...a.matchAll(/#((?:\\.|[\w-])+)/g)].map(i=>i[1]);if(o.length||r.length){const i=d=>d.replace(/\\(.)/g,"$1");return o.every(d=>n.classes.has(d)||n.classes.has(i(d)))&&r.every(d=>n.ids.has(i(d)))}const l=[...a.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(i=>i[2].toLowerCase());return l.length>0&&l.every(i=>n.tags.has(i))}function vi(e){return String(e||"").split(",").map(n=>n.trim()).filter(Boolean)}function gi(e,n,a){const o=vi(e);if(!o.length)return"keep";const r=o.filter(i=>kn(i,n));return r.length?r.length===o.length&&!o.some(i=>kn(i,a))?"move":"copy":"keep"}function Gn(e,n,a){const o=String(e||""),r=gn(n),l=gn(a),i=[],d=[];let k=0;for(const v of mi(o)){const g=o.slice(v.from,v.to),c=g.match(/^\s*/)[0];if(k=v.to,fi.test(v.selector)){const w=Gn(v.body,n,a);w.move.trim()&&i.push(`${v.selector} {
${w.move.trim()}
}`),w.keep.trim()&&d.push(`${c}${v.selector} {
${w.keep.trim()}
}`);continue}const S=v.selector.startsWith("@")?"keep":gi(v.selector,r,l);if(S==="move"){i.push(v.text);continue}S==="copy"&&i.push(v.text),d.push(g)}return d.push(o.slice(k)),{move:i.join(`

`).trim(),keep:d.join("").replace(/\n{3,}/g,`

`).trim()}}const ki="/!/sve/component";function yi(e){const n=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let a=null;for(const o of n){if(!o.trim())continue;const r=o.match(/^[ \t]*/)[0].length;a=a===null?r:Math.min(a,r)}return a?n.map(o=>o.slice(a)).join(`
`):n.join(`
`)}function bi(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function _i(e,n){if(!_a(e))return"";try{return await(await Lo(()=>import("./tw-compile-BqsL3ULf.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,n)||""}catch(a){return console.error("[sve] component tailwind compile",a),""}}async function Ti(e,n){const a=await e.fetch(ki,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":Eo(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(n)});if(!a.ok){const o=new Error(String(a.status));throw o.status=a.status,o}return a.json()}function yn(e,n){const{from:a,to:o}=ba(e,n),r=e.slice(a,o);if(!r.trim())return null;const l=e.slice(0,a)+e.slice(o),i=_("dock:css"),d=Gn(typeof i=="string"?i:"",r,l);return{html:yi(r),css:d.move,keepCss:d.keep,lead:bi(r),from:a,to:o}}function xi(e,n,{onDone:a,onError:o}={}){if(_("dock:is-locked")===!0)return;const r=_("dock:html");if(typeof r!="string"||!n)return;const l=yn(r,n);if(!l)return;const i=Le(e.document,ka,{heading:p(e,"component_new"),nameLabel:p(e,"component_name"),placeholder:p(e,"component_name_placeholder"),value:n.klass||n.tag||"",cancelLabel:p(e,"cancel"),saveLabel:p(e,"component_create"),onOk:d=>{i.dismiss(),(async()=>{try{const k=await _i(e,l.html),v=_("dock:html"),g=typeof v=="string"&&v===r?l:yn(v,n);if(!g)return;const c=await Ti(e,{name:d,html:g.html,css:g.css,js:"",tw:k}),S=_("dock:html"),w=S.slice(0,g.from)+g.lead+c.tag+S.slice(g.to);_("dock:set-html",w),g.css.trim()&&_("dock:set-css",g.keepCss),a?.(c)}catch(k){o?.(k)}})()}})}const q=Sa("sve-call-values"),Fe=new Set;let bn=null;const wi="__sve-html-tree-style";function Si(e,n,a){if(n||a)return!1;const o=String(_("dock:chrome-kind")||"");if(o==="header"||o==="footer")return!1;const r=En(e);return!!r&&r!=="create"&&Io(e)!==Ao(e)}function Zn(e){return{sectionLoops:Mo(e),sectionsLabel:p(e,"html_tree_sections_slot")}}function Ci(e,n){const a={entry:n,text:"",note:p(e,"html_tree_page_template_note"),openLabel:p(e,"html_tree_open_template"),canOpen:!1,onOpen:null};return Fn(e,{entry:n}).then(o=>{!o||t.pageTemplate?.entry!==n||(t.pageTemplate={...t.pageTemplate,text:p(e,"html_tree_page_template",{name:o.name}),canOpen:!!o.open,onOpen:o.open?r=>sa(e,r,o.open):null})}),a}function Li(e,n){const a=n.replace(/^view:/,"");if(!a||_("dock:current-type")!==n){t.usedBy=null,t.templateSections=[];return}t.usedBy?.view!==a&&(t.usedBy=null,Fn(e,{view:a}).then(o=>{if(!o||_("dock:current-type")!==n)return;const r=o.everything?[{name:p(e,"html_tree_used_by_everything"),kind:"everything",url:null}]:o.used_by.map(l=>({...l,...Ei(e,l)}));t.templateSections=Array.isArray(o.sections_fields)?o.sections_fields:[],t.usedBy={view:a,label:p(e,"html_tree_used_by"),items:r,empty:r.length?"":p(e,"html_tree_used_by_nobody"),hint:r.length?p(e,"html_tree_used_by_hint",{list:r.map(l=>l.name).join(", ")}):""}}))}function Ei(e,n){if(!n.url)return{openLabel:"",onOpen:null};const a=p(e,"html_tree_used_by_open",{name:n.name});return n.kind==="page"?{openLabel:a,onOpen:o=>ca(e,o,ua(e,n.url))}:{openLabel:a,onOpen:o=>ha(e,{anchor:o,url:n.url,subtitle:n.name})}}const U=new Set;let Mt="",_e=!1,wt=null,Ee=!0,J="",Se=0,Jn="";const ge=new Map,Ae=new Set,It=new Map,Ge=new Map;let V="",Qn=!1,R=null,Ze=null,je="",Je="",Qe=0,At=null,we=[],ve=null,Oe=null,et=null,tt=null,Ot=null,ke=!1,ae=null,Be=null,Re=null,nt=null,ot=null,Rt=null,me=null;function G(e){return e.getElementById(Ye)}function Pi(e){Po(e,wi,`
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
  `)}function z(){const e=_("dock:html");return typeof e=="string"?e:""}function eo(e){return!!_("dock:is-open",e)}function Pe(e,{save:n=!1,unlock:a=!1}={}){return Gt()||_("dock:set-html",a?{html:e,unlock:!0}:e)!==!0?!1:(n&&_("dock:save-now"),!0)}function St(e){const n=_("dock:component-exit-state")||{};if(t.exitOpen=!!n.open,!n.open){t.onExit=null;return}t.exitName=n.name||"",t.exitLabel=p(e,"component_exit"),t.exitTitle=p(e,n.back?"component_exit_back":"component_exit_close"),t.onExit=()=>{_("dock:exit-component"),O(e)}}const Ne=[];let Ct=!1;function Lt(e,n){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(n,{timeout:2e3});return}e.setTimeout(n,200)}function Hi(e,n){for(const a of n){const o=a.type;!o||ge.has(o)||Ae.has(o)||Ne.includes(o)||Ne.push(o)}Ut.htmlTreePrefetchArmed&&to(e)}function $l(e){Ut.htmlTreePrefetchArmed=!0,to(e)}function to(e){if(Ct||!Ne.length)return;Ct=!0;const n=()=>{const a=Ne.shift();if(!a){Ct=!1;return}if(ge.has(a)||Ae.has(a)){Lt(e,n);return}Ae.add(a),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(a)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(o=>o.ok?o.json():null).then(o=>{if(typeof o?.html=="string"){ge.set(a,o.html);const r=Ge.get(a);Ge.delete(a),r&&r!==no(e,a)&&O(e)}}).catch(()=>{}).finally(()=>{Ae.delete(a),Lt(e,n)})};Lt(e,n)}function Gt(){return!!V}function no(e,n){return oo(n)||Oo(e,n)||"section"}function oo(e){const n=ge.get(e);if(!n)return"";const a=It.get(e);if(a&&a.html===n)return a.tag;const o=Zt(ut(n))?.tag||"";return It.set(e,{html:n,tag:o}),o}function ht(e,n){const a=it(e)||"page_sections",o=[];for(const r of jt(n)||[]){if(r.name===aa||r.name===va)continue;const l=qt(r.values),i=l&&typeof l=="object"?l[a]:null;if(Array.isArray(i)){i.forEach(d=>{if(!d||typeof d!="object"||Array.isArray(d)||typeof d.type!="string")return;const k=[d._visual_id,d.id,d._id].filter(w=>typeof w=="string"&&w!=="");if(!k.length)return;const v=Dn(e,d),g=typeof d._sve_label=="string"?d._sve_label.trim():"",c=no(e,v);oo(v)||Ge.set(v,c);const S=Wn(v)[`0:${c}`];o.push({uid:k[0],ids:k,type:v,tag:c,label:g||(typeof S=="string"&&S.trim()?S.trim():"")||lt(e,v)?.display||De(v)||v,svg:Kn(c,"",null).svg||xe.section,cat:On(c),enabled:d.enabled!==!1,static:jo(e,v)})});break}}return o}function $i(e,n,a){if(!a.length)return"";const o=_("dock:current-type")||"",r=_("dock:current-uid"),l=!!_("dock:component-exit-state")?.open;if(r){const i=dt(r,n),d=a.find(k=>k.ids.some(v=>i.includes(v)));if(d&&(l||d.type===o))return d.uid}return a.find(i=>i.type===o)?.uid||""}function Mi(e,n,a){const o=_("dock:component-exit-state");if(o?.open)return De(o.name)||o.name||"";if(a)return n.find(l=>l.uid===a)?.label||"";const r=_("dock:current-type")||"";return String(r).startsWith("view:")?"":lt(e,r)?.display||De(r)||""}function pt(e,n,a,o,r){const l=a.find(i=>i.uid===o);l&&o!==r&&(U.clear(),R=null,Ee=!1,W(),Ve(),J=o,Jn=z(),V=ge.get(l.type)||"",V&&(R=Ft(ut(V))||null),Qn=(_("dock:current-type")||"")===l.type,e.clearTimeout(Se),Se=e.setTimeout(()=>{J="",_e=!1,O(e)},4e3),O(e),da(e,l.uid,"tree"),ue({source:ee,type:Q.SVE_ACTIVATE,ids:l.ids},e),e.setTimeout(()=>O(e),0))}function Dt(e,n){if(!n)return!1;for(const a of e||[])if(a.id===n||Dt(a.children,n))return!0;return!1}function Ft(e){return Zt(e)?.id||""}function Zt(e){for(const n of e||[]){if(!n.kind)return n;const a=Zt(n.children);if(a)return a}return null}function Ii(e,n){const a=n===0||e.path===Je;return U.has(e.path)?a:!a}function Ai(e){const n=new Set,a=(o,r)=>{for(const l of o)l.children.length&&Ii(l,r)&&n.add(l.id),a(l.children,r+1)};return a(e,0),n}function O(e){const n=e.document,o=G(n)?.querySelector("[data-sve-html-tree-list]");if(!o)return;Pi(n),xa(e);const r=z();V&&V===r&&(V=""),_("dock:chrome-kind")&&(V="");const l=V||r,i=ut(l,Zn(e));we=i,Je="";const d=_("dock:current-type")||"",k=Wn(d),v=$o(e,n),c=!!(_("dock:component-exit-state")||{}).open;d&&r&&!V&&ge.set(d,r);const S=ht(e,n);Hi(e,S);const w=$i(e,n,S);if(Si(e,v,c)){const u=En(e);we=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!1,t.layoutFile=!1,t.usedBy=null,t.emptyText="",t.pageTemplate?.entry!==u&&(t.pageTemplate=Ci(e,u)),t.onRefresh=()=>O(e),t.onSection=null,St(e),Ie(o,_t),Et(e,[]);return}t.pageTemplate=null,Li(e,String(_("dock:collection-view")||""));const D=String(_("dock:chrome-kind")||"");if(ta(e),v&&!S.length&&!D){we=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,t.layoutFile=!1,t.emptyText=p(e,"html_tree_page_empty"),t.canEdit=!_("dock:is-locked"),t.look=hn(e),t.onRefresh=()=>O(e),t.onSection=null,St(e),Ie(o,_t),Et(e,[]);return}t.pageBuilder=v;const E=`${d}|${w}`;let te=!1;E!==Mt&&(Mt=E,U.clear(),wt!==null&&l!==wt?te=!0:_e=l),(te||_e!==!1&&l!==_e)&&(_e=!1,U.clear(),R=Ft(i)||null),wt=l,J&&(J===w||!S.length)&&(Qn||l!==Jn)&&(e.clearTimeout(Se),J="",_e=!1,Dt(i,R)||(U.clear(),R=Ft(i)||null));const ne=S.some(u=>u.uid===J)?J:"",y=Ee?"":ne||w,f=!!(ne||w),b=f||c?"":String(_("dock:chrome-kind")||""),$=v&&(!d&&!f||b==="main"&&_("dock:on-empty-page")===!0),I=$||b==="template"?"":b;t.layoutFile=I==="main",I!=="main"&&(je="");const K=I==="main"?_n(i,"main"):null,B=K?at(i,u=>u.tag==="body"&&Dt(u.children,K.id)):null;Je=B?B.path:"",K&&(ze((B||K).path),je!==E&&(ze(K.path),U.add(K.path)));const He=I==="header"||I==="footer"?at(i,u=>l.slice(u.from,u.openTo).includes(`data-sve-chrome="${I}"`)):null,se=He||(I==="header"||I==="footer"?_n(i,I):null);se&&ze(se.path);const N=$||!(I==="main"?!!K:I==="header"||I==="footer"?!!se:!0)?[]:Va(i,t.query?new Set:Ai(i));!l.trim()&&!eo(n)?t.emptyText=p(e,"html_tree_need_dock"):t.emptyText=p(e,"html_tree_empty"),t.slotText=p(e,"antlers_drop_here"),t.dataTitle=p(e,"data_vars_title"),t.pageTitle=p(e,"component_props_page"),t.renameTitle=p(e,"html_tree_rename"),t.tagTitle=p(e,"tw_tag"),t.hideTitle=p(e,"html_tree_hide"),t.showTitle=p(e,"html_tree_show"),t.duplicateTitle=p(e,"html_tree_duplicate"),t.deleteTitle=p(e,"html_tree_delete"),t.videoHoldTitle=p(e,"html_tree_video_hold"),t.videoPlayTitle=p(e,"html_tree_video_play"),t.alpineTitle=p(e,"html_tree_alpine_state"),t.lockedTitle=p(e,"html_tree_locked"),t.searchEmpty=p(e,"html_tree_search_empty"),t.canEdit=!_("dock:is-locked"),t.look=hn(e),t.onQuery=()=>O(e),St(e),t.inComponent=c,t.onSelect=u=>{const T=N.find(H=>H.id===u);T&&Nn(e,T.path)||rt(e,u,N)},t.onTwist=u=>{const T=N.find(H=>H.id===u)?.path;T&&(U.has(T)?U.delete(T):U.add(T),O(e))},t.onTagChange=(u,T)=>{const H=t.rows.find(le=>le.id===T);H&&!Gt()&&!Jt(e,H)&&wa(e,u.currentTarget,H)},t.onRename=u=>Ki(e,u),t.onRenameCommit=()=>Tn(e,!0),t.onRenameCancel=()=>Tn(e,!1),t.onHide=u=>Yi(e,u),t.onLock=u=>zi(e,u),t.canUnlock=so(e),t.lockTitle=p(e,"html_tree_lock"),t.unlockTitle=p(e,"html_tree_unlock"),t.lockedByTitle=p(e,"html_tree_locked_by_developer"),t.onVideoHold=u=>ji(e,u),t.onAlpineState=(u,T)=>Ui(e,u,T),t.onDuplicate=u=>Xi(e,u),t.onDelete=u=>Gi(e,u),t.onPointerDown=(u,T)=>el(e,u,T),t.onSectionPointerDown=(u,T)=>ol(e,u,T),t.onSectionHover=u=>e.dispatchEvent(new e.CustomEvent("sve-lite-hover",{detail:{uid:u}})),t.onContext=(u,T)=>Ji(e,u,T),t.onInspectCommit=u=>hl(e,u),t.onPropValue=(u,T,H)=>Cn(e,u,T,H),t.onPropPage=(u,T)=>ci(e,u,H=>Cn(e,T,H,!1)),t.onLoopKind=u=>pl(e,u),t.onAddBranch=u=>fl(e,u),t.onLoopSortField=u=>{const T=st(),H=String(u||"").trim();if(!T)return;const le=me?.id===T.id?me.dir:"",de=T.sortDir||le||"asc";me=null,Z(e,(fe,vt)=>be(fe,vt,{sortField:H,sortDir:de}))},t.onLoopSortDir=u=>{const T=st(),H=String(u||"");if(T){if((H==="asc"||H==="desc")&&!T.sortField){me={id:T.id,dir:H},Kt(e,T);return}me=null,Z(e,(le,de)=>be(le,de,{sortDir:H,sortField:H==="asc"||H==="desc"?de.sortField:""}))}},t.onLoopDepth=u=>Z(e,(T,H)=>be(T,H,{navDepth:String(u||"").replace(/\D/g,"")})),t.onLoopIncludeHome=u=>Z(e,(T,H)=>be(T,H,{includeHome:!!u})),t.onLoopLimit=u=>Z(e,(T,H)=>be(T,H,{limit:String(u||"").replace(/\D/g,"")})),t.onLoopOffset=u=>Z(e,(T,H)=>be(T,H,{offset:String(u||"").replace(/\D/g,"")})),t.onPropHost=u=>u?q.mount(u):q.unmount(),t.onInspectData=(u,T)=>{_("dock:data-menu",{anchor:u,at:N.find(H=>H.id===R)?.from,onPick:H=>T(String(H?.var||"").trim())})};const tn=N.find(u=>!u.kind)?.id,nn=c?"":Mi(e,S,y),he=y&&!c?S.find(u=>u.uid===y):null,mo=In(e,String(_("dock:current-type")||""));let vo=0;const go=qi(He?[He]:i,l),ko=An(e,String(d)),re=I==="header"||I==="footer"?I:"",ye=se?se.id:"",pe=K&&N.find(u=>u.id===K.id)||null,on=B&&N.find(u=>u.id===B.id)||null,ie=on||pe||ye&&N.find(u=>u.id===ye)||null,an=ie?Fi(N,ie):-1;if(ie&&!N.slice(N.indexOf(ie),an).some(u=>u.id===R)&&(R=ie.id),t.selectFrom){const u=N.find(T=>T.from===t.selectFrom.at&&(!T.kind||T.kind==="sections"));u?(R=u.id,t.selectFrom=null):--t.selectFrom.left<=0&&(t.selectFrom=null)}const sn=t.layoutFile?Di(e):null;t.rows=N.map(u=>{const T=sn&&u.kind==="component"&&sn.get(u.src)||"",H=u.tag==="body"&&!u.kind,le=T?{svg:xe[T]}:Kn(u.tag,u.kind,u.antlers),de=u.tag==="video"&&!u.kind?vo++:-1,fe=go.get(u.id),vt=fe?ko[fe.nth]||{}:{},gt=fe?fe.booleans.map(({key:Me,value:rn})=>({key:Me,file:rn,value:vt[Me]??rn})):[],kt=u.id===tn&&nn?nn:u.klass,$e=u.id===tn;return{...u,tag:T||u.tag,frameCall:T,fixed:!!T||H,base:kt,name:T?p(e,`html_tree_frame_${T}`):re&&u.id===ye?p(e,`html_tree_frame_${re}`):u===pe?p(e,"html_tree_frame_main"):$e&&he?kt:hi(kt,u.path,k),current:u.id===R,letter:le.letter||"",svg:re&&u.id===ye?xe[re]:u===pe?xe.main:$e&&he?he.svg:le.svg||"",frame:re&&u.id===ye?re:u===pe?"main":"",cat:re&&u.id===ye?re:u===pe||H?"main":T||On(u.tag,u.kind,u.antlers),componentRoot:$e&&c,sectionRoot:$e&&he?he.uid:"",fieldsIcon:!!($e&&he&&!he.static),videoNth:de,videoHeld:de>=0&&mo.has(de),alpineNth:gt.length?fe.nth:-1,alpineKeys:gt,alpineSet:gt.some(Me=>Me.value!==Me.file)}}),na(e),oa(e);const mt=[];for(const u of t.rows)mt.length=u.depth,u.guides=mt.slice(),mt[u.depth]=u.cat;if(ie){const u=N.indexOf(ie),T=ie.depth;t.rows=t.rows.slice(u,an).map(H=>({...H,depth:H.depth-T,guides:H.guides.slice(T)})),pe&&je!==E&&(je=E,e.setTimeout(()=>rt(e,pe.id,N),0))}t.sections=v&&!c&&(f||I||$)?S.map(u=>{const T=!!y&&u.uid===y;return{...u,current:T,ready:T&&(!ne||!!V),row:{id:`sec:${u.uid}`,section:u.uid,tag:u.tag,name:u.label,kind:"",svg:u.svg,cat:u.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:T,hidden:!u.enabled}}}):[],t.frame=Ri(e,S,f,c,I,!1,!!on),t.frameEmptyText=p(e,"html_tree_frame_no_sections"),Oi(e,I),t.onSection=u=>{ke||(Bt(e),pt(e,n,S,u,y))},t.onRefresh=()=>O(e),Kt(e,t.rows.find(u=>u.id===R)),Ie(o,_t),Et(e,i)}function Oi(e,n){t.frameOpenTitle=p(e,"html_tree_frame_open"),t.frameMainTitle=p(e,"html_tree_frame_main_open"),t.frameTemplateTitle=p(e,"html_tree_frame_template_open"),t.frameFieldsTitle=p(e,"html_tree_frame_fields"),t.onFrame=a=>{n===a?Bi(e,a):Nt(e,a)},t.onFrameEnter=a=>Nt(e,a),t.onFrameFields=a=>Yo(e,ia(e,a),p(e,`html_tree_frame_${a}`)),t.onFrameTwist=()=>{t.mainShut=!t.mainShut}}function Ri(e,n,a,o,r,l=!1,i=!1){if(!r&&!l||i)return null;const d=g=>({id:`frame:${g}`,frame:g,synthetic:!0,tag:g,name:p(e,`html_tree_frame_${g}`),kind:"",svg:xe[g]||"",cat:g,letter:"",depth:0,hasChildren:g==="main"&&(n.length>0||r==="template"),shut:g!=="main",current:!1,hidden:!1}),k={kind:r,header:d("header"),main:d("main"),footer:d("footer"),template:null},v=r&&r!=="template"?String(_("dock:collection-view")||""):"";return v&&(k.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:lt(e,v)?.display||De(v.replace(/^view:/,"")),kind:"",svg:xe.section,cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),k}function _n(e,n){return at(e,a=>a.tag===n)}function at(e,n){for(const a of e||[]){if(!a.kind&&n(a))return a;const o=at(a.children,n);if(o)return o}return null}function Di(e){const n=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},a=new Map;for(const o of["header","footer"]){const r=Ca(n[o]?.type);r&&a.set(r,o)}return a}function Fi(e,n){let a=e.indexOf(n)+1;for(;a<e.length&&e[a].depth>n.depth;)a+=1;return a}function Bi(e,n){const a=Bn(e);(n==="main"||n==="template"?a?.querySelector("main"):a?.querySelector(`[data-sve-chrome="${n}"]`))?.scrollIntoView({behavior:"smooth",block:"start"})}function Bt(e){const n=String(_("dock:chrome-open",e.document)||"");return n!=="header"&&n!=="footer"?!1:(la(e),ue({source:ee,type:Q.SVE_FORCE_EXIT_CHROME},e),!0)}function Ni(e){e.clearTimeout(Se),J="",V="",U.clear(),R=null,Ee=!1,W(),Ve()}function Nt(e,n){if(e.document,String(_("dock:chrome-kind")||"")===n)return;if(Ni(e),n==="main"){Bt(e),_("dock:open-file",ga);return}if(n==="template"){const l=String(_("dock:collection-view")||"");l&&(Bt(e),_("dock:open-file",l));return}if(n!=="header"&&n!=="footer")return;const a=Bn(e)?.querySelector(`[data-sve-chrome="${n}"]`);a?(a.scrollIntoView({block:"nearest"}),a.dispatchEvent(new a.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:ee,type:Q.OPEN_CHROME,kind:n},e.location.origin);const o=Date.now(),r=async()=>{if(String(_("dock:chrome-kind")||"")!==n){Date.now()-o<3e4&&e.setTimeout(r,250);return}await(_("dock:load-settled")||null),fo(e)};e.setTimeout(r,250)}function Et(e,n){G(e.document)&&ao(e,n)}function ao(e,n){const a=n[0],o=!!_("dock:component-src"),r=o?"":_("dock:current-uid")||"";ue({source:ee,type:Q.SVE_HTML_PICK,on:!0,uid:r,uids:r?dt(r,e.document):[],all:o,tag:a?.tag||"",klass:a?.klass||"",nodes:qa(n)},e)}function ze(e){if(!e)return;const n=(a,o)=>{for(const r of a||[]){if(r.path===e)return!0;if(n(r.children,o+1))return o===0||r.path===Je?U.delete(r.path):U.add(r.path),!0}return!1};n(we,0)}function Ki(e,n){if(ke)return;const a=t.rows.find(o=>o.id===n);Jt(e,a)||!a||a.kind||(R=n,t.rows.forEach(o=>{o.current=o.id===n}),t.editingId=n,t.draft=a.name,e.setTimeout(()=>{const o=G(e.document)?.querySelector("[data-sve-ht-rename]");o?.focus(),o?.select()},0))}function Tn(e,n){const a=t.editingId;if(!a)return;const o=t.rows.find(r=>r.id===a);t.editingId=null,n&&o&&(o.sectionRoot?Vi(e,o.sectionRoot,t.draft):pi(_("dock:current-type")||"",o.path,t.draft,o.base||o.klass)),t.draft="",O(e)}function Vi(e,n,a){const o=it(e)||"page_sections",r=String(a||"").replace(/\s+/g," ").trim();for(const l of jt(e.document)||[]){const i=qt(l.values),d=i&&typeof i=="object"?i[o]:null;if(!Array.isArray(d))continue;const k=d.findIndex(S=>S&&typeof S=="object"&&[S._visual_id,S.id,S._id].includes(n));if(k===-1)continue;const v=Dn(e,d[k]),g=lt(e,v)?.display||De(v)||v,c=JSON.parse(JSON.stringify(d));return c[k]={...c[k]},!r||r===g?delete c[k]._sve_label:c[k]._sve_label=r,l.setFieldValue(o,c),!0}return!1}function ji(e,n){const a=t.rows.find(d=>d.id===n);if(!a||!(a.videoNth>=0))return;const o=String(_("dock:current-type")||""),r=In(e,o),l=!r.has(a.videoNth);l?r.add(a.videoNth):r.delete(a.videoNth);const i=String(_("dock:current-uid")||"");ra(e,o,r),ue({source:ee,type:Q.SVE_VIDEO_HOLD,uid:i,uids:i?dt(i,e.document):[],nth:a.videoNth,on:l},e),O(e)}function qi(e,n){const a=new Map;let o=0;const r=l=>{for(const i of l){if(i.hidden)continue;const d=i.kind?null:za(n.slice(i.from,i.openTo));d!==null&&a.set(i.id,{nth:o++,booleans:Xa(d)}),r(i.children||[])}};return r(e),a}function Ui(e,n,a){const o=t.rows.find(l=>l.id===a);if(!o||!(o.alpineNth>=0))return;if(o.alpineKeys.length===1){xn(e,o,o.alpineKeys[0]);return}const r=n.currentTarget.getBoundingClientRect();W(),ae=Le(e.document,Ke,{items:o.alpineKeys.map(l=>({label:l.key,icon:l.value?io:lo,onPick:()=>{W(),xn(e,o,l)}})),x:Math.round(r.left),y:Math.round(r.bottom+4),onClose:()=>{ae=null}})}function xn(e,n,a){const o=String(_("dock:current-type")||""),r=An(e,o),l=!a.value,i=l!==a.file,d={...r[n.alpineNth]||{}};i?d[a.key]=l:delete d[a.key],Object.keys(d).length?r[n.alpineNth]=d:delete r[n.alpineNth];const k=pa(String(_("dock:chrome-kind")||"")),v=k?"":String(_("dock:current-uid")||"");fa(e,o,r),ue({source:ee,type:Q.SVE_ALPINE_STATE,uid:v,uids:v?dt(v,e.document):[],chrome:k,nth:n.alpineNth,key:a.key,value:l,on:i},e),O(e)}function Jt(e,n){return!n||!(n.locked||n.lockedIn)?!1:(e.Statamic?.$toast?.error(p(e,"html_tree_locked_element")),!0)}function so(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function zi(e,n){const a=t.rows.find(o=>o.id===n);if(!(!a||a.lockedIn||_("dock:is-locked"))){if(!a.locked){Ce(e,n,Ra,{lockAction:!0});return}if(!so(e)){e.Statamic?.$toast?.error(p(e,"html_tree_unlock_denied"));return}zt(e,{titleKey:"html_tree_unlock_title",bodyKey:"html_tree_unlock_body",confirmKey:"html_tree_unlock_confirm"},()=>Ce(e,n,Da,{lockAction:!0,unlock:!0}))}}function Qt(e){return!!t.rows.find(n=>n.id===e)?.fixed}function Yi(e,n){Qt(n)||Ce(e,n,Fa)}function Xi(e,n){if(Qt(n))return;const a=t.rows.find(o=>o.id===n)?.sectionRoot;if(a){e.postMessage({source:ee,type:Q.DUPLICATE_ROW,uid:a},e.location.origin);return}Ce(e,n,Ba)}function ro(e,n){zt(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const a=e.document;ma({uid:n},a,e)})}function Wi(e,n,a){J===a&&(e.clearTimeout(Se),J="",V=""),R=null,Ee=!1,Mt="";const o=ht(e,n),r=o.find(l=>l.uid!==a)||o[0];r?pt(e,n,o,r.uid,""):(V="",t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,O(e)),e.setTimeout(()=>{G(e.document)&&O(e)},0)}Rn("row:removed",({uid:e,parentPath:n,doc:a,win:o})=>{n!==it(o)||!G(o.document)||Wi(o,a,e)});function Gi(e,n){if(Qt(n))return;const a=t.sections?.find(r=>r.row?.id===n),o=a?a.row?.section||a.uid:t.rows.find(r=>r.id===n)?.sectionRoot;if(o){ro(e,o);return}if(t.rows.find(r=>r.id===n)?.kind==="sections"){zt(e,{titleKey:"html_tree_sections_remove_title",bodyKey:"html_tree_sections_remove_body",confirmKey:"html_tree_sections_remove_confirm"},()=>Ce(e,n,pn));return}Ce(e,n,pn)}function Ce(e,n,a,{lockAction:o=!1,unlock:r=!1}={}){if(_("dock:is-locked"))return;const l=z(),i=t.rows.find(k=>k.id===n);if(!i||!o&&Jt(e,i))return;const d=a(l,i);d!==l&&Pe(d,{unlock:r})}function W(){ae?.dismiss(),ae=null}const io='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',lo='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>';function co(e,n){const a=t.sections?.find(k=>k.uid===n),o=a?.type||"";if(!o||!Pn(e))return[];const r=a.label||o,l=qo(e,o),i=()=>e.Statamic?.$toast?.error(p(e,"section_update_failed")),d=[{label:p(e,"static_section_insertable"),icon:l?lo:io,onPick:()=>{W(),dn(e,{handle:o,hidden:!l}).then(()=>{e.Statamic?.$toast?.success(p(e,l?"section_shown_to_editors":"section_hidden_from_editors",{name:r})),cn(e)}).catch(i)}}];return a.static&&d.push({label:p(e,"section_add_fields"),onPick:()=>{W(),dn(e,{handle:o,fields:!0}).then(()=>{e.Statamic?.$toast?.success(p(e,"section_fields_added",{name:r})),cn(e),O(e),Hn(e,o)}).catch(i)}}),d}function Zi(e,n,a){const o=a.row?.section||a.uid;o&&(ae=Le(e.document,Ke,{items:[...co(e,o),{label:p(e,"html_tree_remove_section"),danger:!0,onPick:()=>{W(),ro(e,o)}}],x:n.clientX,y:n.clientY,onClose:()=>{ae=null}}))}function Ji(e,n,a){W();const o=t.sections?.find(d=>d.row?.id===a);if(o){Zi(e,n,o);return}const r=t.rows.find(d=>d.id===a);if(!r)return;rt(e,a,t.rows);const l={x:n.clientX,y:n.clientY},i=d=>{d.length&&(ae?.dismiss(),ae=Le(e.document,Ke,{items:d,x:l.x,y:l.y,onClose:()=>{ae=null}}))};if(r.frameCall){i([{label:p(e,"html_tree_frame_edit",{frame:p(e,`chrome_${r.frameCall}`)}),onPick:()=>{W(),Nt(e,r.frameCall)}}]);return}if(r.kind==="component"){Qi(e,r,i);return}r.kind==="slot"||r.kind==="sections"||r.locked||r.lockedIn||t.canEdit&&(r.componentRoot||i([...r.sectionRoot?co(e,r.sectionRoot):[],{label:p(e,"component_make"),onPick:()=>{W(),xi(e,r,{onDone:()=>O(e),onError:d=>{e.alert(d?.status===409?p(e,"component_exists"):p(e,"component_failed"))}})}}]))}const wn=(e,n)=>{W(),_("dock:open-template",n)};function Qi(e,n,a){if(!ja(n.src)){a([{label:p(e,"component_open_named",{name:n.name||n.src}),onPick:()=>wn(e,`view:partials/${n.src}`)}]);return}a([{label:p(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(n.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(o=>o.ok?o.json():{items:[]}).then(o=>{const r=Array.isArray(o.items)?o.items:[];a(r.length?r.map(l=>({label:p(e,"component_open_named",{name:l.label}),onPick:()=>wn(e,l.type)})):[{label:p(e,"component_none"),onPick:null}])}).catch(()=>a([{label:p(e,"component_none"),onPick:null}]))}function el(e,n,a){if(n.button!==0||_("dock:is-locked")||t.editingId)return;const o=t.rows.find(i=>i.id===a);if(o&&(o.locked||o.lockedIn)||n.target?.closest?.("button, input"))return;Ve(),ve=a,Oe={x:n.clientX,y:n.clientY},et=n.currentTarget,tt=n.pointerId;const r=i=>tl(e,i),l=i=>nl(e,i);Ot=()=>{e.document.removeEventListener("pointermove",r,!0),e.document.removeEventListener("pointerup",l,!0),e.document.removeEventListener("pointercancel",l,!0),Ot=null},e.document.addEventListener("pointermove",r,!0),e.document.addEventListener("pointerup",l,!0),e.document.addEventListener("pointercancel",l,!0)}function tl(e,n){if(!ve||!Oe)return;const a=n.clientX-Oe.x,o=n.clientY-Oe.y;if(!t.dragging&&a*a+o*o<25)return;if(!t.dragging){t.dragging=!0;try{et?.setPointerCapture?.(tt)}catch{}}n.preventDefault();const r=e.document.elementFromPoint(n.clientX,n.clientY),l=r?.closest?.("[data-sve-ht-slot]");if(l){const c=l.getAttribute("data-sve-ht-id");if(c&&c!==ve){t.dropId=c,t.dropPlace="inside";return}}const i=r?.closest?.("[data-sve-ht-row]"),d=i?.getAttribute("data-sve-ht-id");if(!d||d===ve){t.dropId=null,t.dropPlace=null;return}const k=t.rows.find(c=>c.id===d),v=t.rows.find(c=>c.id===ve);if(!k||k.lockedIn||v&&k.path.startsWith(`${v.path}/`)){t.dropId=null,t.dropPlace=null;return}const g=i.getBoundingClientRect();t.dropId=d,t.dropPlace=Aa(n.clientY-g.top,g.height,!jn(k.tag)&&!Vn(k)&&!k.locked)}function nl(e,n){const a=ve,o=t.dropId,r=t.dropPlace||"after",l=t.dragging;if(Ve(),l&&(ke=!0,e.setTimeout(()=>{ke=!1},0)),!l||_("dock:is-locked")||!a||!o||a===o)return;n?.preventDefault?.();const i=z(),d=Oa(i,we,a,o,r);d!==i&&Pe(d)}function Ve(){try{et?.releasePointerCapture?.(tt)}catch{}Ot?.(),ve=null,Oe=null,et=null,tt=null,t.dragging=!1,t.dropId=null,t.dropPlace=null}function ol(e,n,a){if(n.button!==0||!a||t.editingId||n.target?.closest?.("button, input"))return;uo(),Be=a,Re={x:n.clientX,y:n.clientY},nt=n.currentTarget,ot=n.pointerId;const o=l=>al(e,l),r=l=>sl(e,l);Rt=()=>{e.document.removeEventListener("pointermove",o,!0),e.document.removeEventListener("pointerup",r,!0),e.document.removeEventListener("pointercancel",r,!0),Rt=null},e.document.addEventListener("pointermove",o,!0),e.document.addEventListener("pointerup",r,!0),e.document.addEventListener("pointercancel",r,!0)}function al(e,n){if(!Be||!Re)return;const a=n.clientX-Re.x,o=n.clientY-Re.y;if(!t.dragging&&a*a+o*o<25)return;if(!t.dragging){t.dragging=!0;try{nt?.setPointerCapture?.(ot)}catch{}}n.preventDefault();const l=e.document.elementFromPoint(n.clientX,n.clientY)?.closest?.("[data-sve-ht-sec-uid]"),i=l?.getAttribute("data-sve-ht-sec-uid")||"";if(!i||i===Be){t.sectionDrop=null;return}const d=l.getBoundingClientRect();t.sectionDrop={uid:i,place:n.clientY-d.top<d.height/2?"before":"after"}}function sl(e,n){const a=Be,o=t.sectionDrop,r=t.dragging;uo(),r&&(ke=!0,e.setTimeout(()=>{ke=!1},0)),!(!r||!a||!o?.uid||o.uid===a)&&(n?.preventDefault?.(),rl(e,a,o.uid,o.place))}function uo(){try{nt?.releasePointerCapture?.(ot)}catch{}Rt?.(),Be=null,Re=null,nt=null,ot=null,t.dragging=!1,t.sectionDrop=null}function rl(e,n,a,o){const r=it(e)||"page_sections";for(const l of jt(e.document)||[]){const i=qt(l.values),d=i&&typeof i=="object"?i[r]:null;if(!Array.isArray(d))continue;const k=S=>d.findIndex(w=>w&&typeof w=="object"&&[w._visual_id,w.id,w._id].includes(S)),v=k(n),g=k(a);if(v===-1||g===-1||v===g)return!1;let c=o==="before"?g:g+1;return v<c&&(c-=1),c===v?!1:(e.postMessage({source:ee,type:Q.MOVE,uid:n,toIndex:c},e.location.origin),e.setTimeout(()=>O(e),60),!0)}return!1}function ho(e){const n=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(n)?n:[]}function il(e){const n=e.Statamic?.$config?.get?.("sveNavigations");return Array.isArray(n)?n:[]}function ll(e){return[{handle:Xe,title:p(e,"antlers_nav_pages")},...il(e).map(n=>({handle:n.handle,title:n.title}))]}function Kt(e,n){if(n?.kind==="component"){dl(e,n);return}if(X.callOpen&&(X.callOpen=!1,X.callStore=null,q.forget(),Xt(e)),n?.kind!=="antlers"){t.inspect=null;return}const a=n.id;if(n.tag==="else"){t.inspect={key:a,title:p(e,"antlers_condition"),mode:"note",note:p(e,"antlers_else_note")};return}if(n.antlers==="loop"){const o=n.loopKind==="collection",r=n.loopKind==="nav",l=me?.id===n.id?me.dir:"",i=n.sortDir||l,d=[{id:"field",label:p(e,"antlers_loop_field")},{id:"collection",label:p(e,"antlers_loop_collection")},{id:"nav",label:p(e,"antlers_loop_nav")}];if(r){const k=n.expr||Xe;t.inspect={key:a,title:p(e,"antlers_loop"),mode:"loop",loopKind:"nav",kinds:d,navs:ll(e),value:k,placeholder:p(e,"antlers_pick_nav"),nav:{depthTitle:p(e,"antlers_nav_depth"),depth:n.navDepth||"",depths:[{id:"",label:p(e,"antlers_nav_depth_all")},{id:"1",label:p(e,"antlers_nav_depth_1")},{id:"2",label:p(e,"antlers_nav_depth_2")},{id:"3",label:p(e,"antlers_nav_depth_3")}],homeAsked:k===Xe,homeLabel:p(e,"antlers_nav_include_home"),includeHome:!!n.includeHome},branches:[]};return}t.inspect={key:a,title:p(e,"antlers_loop"),mode:"loop",loopKind:o?"collection":"field",kinds:d,collections:ho(e),value:n.expr||"",placeholder:p(e,o?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:p(e,"antlers_sort"),dir:i,needsField:i==="asc"||i==="desc",field:n.sortField||"",pickable:!o,placeholder:p(e,o?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:p(e,"antlers_sort_none")},{id:"asc",label:p(e,"antlers_sort_asc")},{id:"desc",label:p(e,"antlers_sort_desc")},{id:"random",label:p(e,"antlers_sort_random")}]},limit:{title:p(e,n.paginate?"antlers_limit_per_page":"antlers_limit"),value:n.limit||"",placeholder:p(e,"antlers_limit_placeholder")},offset:{title:p(e,"antlers_offset"),value:n.offset||"",placeholder:p(e,"antlers_offset_placeholder")},branches:[]};return}t.inspect={key:a,title:p(e,"antlers_condition"),mode:"condition",value:n.expr||"",placeholder:p(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:p(e,"antlers_add_elseif")},{id:"else",label:p(e,"antlers_add_else")}]}}function dl(e,n){if(!Ea(e)){t.inspect=null;return}if(!n.src)return;const a=n.id;if(t.inspect={key:a,title:p(e,"component_props_values"),mode:"note",note:p(e,"code_dock_loading")},Pa()){const o={},r={},l=new Map;for(const[i,d]of Ha(z().slice(n.from,n.to))){const k=$a(i);k&&(i!==k||!l.has(k))&&l.set(k,d)}for(const[i,d]of l)d.bound?r[i]=d.value:o[i]=d.value;bn!==a&&(bn=a,Fe.clear());for(const i of Fe)i in r||(r[i]="");t.inspect=null,X.callOpen=!0,X.title=X.title||p(e,"component_props"),X.callTitle=n.klass||n.name||n.src,X.callStore=q.ui,q.ui.canBind=!0,q.ui.dataTitle=p(e,"data_vars_title"),q.ui.exprPlaceholder=p(e,"component_props_expr"),q.ui.onToggleBind=(i,d)=>ul(e,i,d),q.ui.onExpr=(i,d)=>Sn(e,i,d),q.ui.onPickData=(i,d)=>_("dock:data-menu",{anchor:d,at:n.from,onPick:k=>Sn(e,i,String(k?.var||"").trim())}),q.load(e,{key:`${n.src}::${a}`,src:n.src,params:o,bindings:r,readOnly:_("dock:is-locked")===!0}),q.watch(e,{src:n.src,write:i=>cl(e,i,r)}),Xt(e);return}Ma(e,n.src).then(o=>{if(t.inspect?.key===a){if(!o.length){t.inspect={key:a,title:p(e,"component_props_values"),mode:"note",note:p(e,"component_props_values_none")};return}t.inspect={key:a,title:p(e,"component_props_values"),mode:"props",inheritLabel:p(e,"component_props_inherit"),rows:Ia(o,z().slice(n.from,n.to))}}})}function cl(e,n,a={}){const o=t.rows.find(i=>i.id===R);if(o?.kind!=="component"||_("dock:is-locked"))return;let r=z(),l=o.to;for(const[i,d]of Object.entries(n||{})){if(i in a)continue;const k=r.length,v=Wt(r,{from:o.from,to:l},i,d);v!==r&&(l+=v.length-k,r=v)}r!==z()&&(Pe(r,{save:!0}),O(e))}function ul(e,n,a){a?Fe.add(n):Fe.delete(n),po(e,n,"",a),O(e)}function Sn(e,n,a){Fe.add(n),po(e,n,a,!0),O(e)}function po(e,n,a,o){const r=t.rows.find(d=>d.id===R);if(r?.kind!=="component"||_("dock:is-locked"))return;const l=z(),i=Wt(l,r,n,a,{bound:o});i!==l&&Pe(i,{save:!0})}function st(){const e=t.rows.find(n=>n.id===R);return e?.kind==="antlers"&&!_("dock:is-locked")?e:null}function Z(e,n){const a=st();if(!a)return;const o=z(),r=n(o,a);r!==o&&(Pe(r),O(e))}function Cn(e,n,a,o){const r=t.rows.find(d=>d.id===R);if(r?.kind!=="component"||_("dock:is-locked"))return;const l=z(),i=Wt(l,r,n,a,{bound:o});i!==l&&(Pe(i,{save:!0}),O(e))}function hl(e,n){Z(e,(a,o)=>o.antlers==="loop"?Ue(a,o,o.loopKind==="collection"?"collection":"field",n):Na(a,o,n))}function pl(e,n){const a=st();if(!a||a.antlers!=="loop")return;const o=a.loopKind==="collection"?"collection":a.loopKind==="nav"?"nav":"field";if(n!==o){if(n==="nav"){Z(e,(r,l)=>Ue(r,l,"nav",Xe));return}if(n==="collection"){const r=ho(e)[0]?.handle;if(!r)return;Z(e,(l,i)=>Ue(l,i,"collection",r));return}Z(e,(r,l)=>Ue(r,l,"field",l.handle||"items"))}}function fl(e,n){Z(e,(a,o)=>Ka(a,o,n))}function ml(e,n){if(!e||!n||Vn(n)||jn(n.tag))return null;const a=La(e,n);if(a<n.openTo)return null;const o=e.lastIndexOf(`
`,a-1)+1;return e.slice(o,a).trim()===""&&o>n.openTo?o-1:a}function rt(e,n,a){if(ke)return;const o=(a||t.rows).find(r=>r.id===n);o&&(R=n,t.rows.forEach(r=>{r.current=r.id===n}),Kt(e,o),!Gt()&&(_("dock:reveal-html",{from:o.from,to:o.to,caret:ml(z(),o)}),_("dock:tw-follow"),ue({source:ee,type:Q.SVE_HTML_PICK_FOCUS,path:o.path},e)))}function vl(e,n){if(!n)return"";const a=[],o=(r,l)=>{for(const i of r||[]){const d=l||i.path===e;i.kind==="component"&&i.src===n&&a.push({path:i.path,inside:d}),o(i.children,d)}};return o(we,!1),(a.find(r=>r.inside)||a[0])?.path||""}function gl(e,n){if(!n||!G(e.document))return;Ee=!1,ze(n),O(e);const a=t.rows.find(o=>o.path===n);a&&(rt(e,a.id,t.rows),e.setTimeout(()=>{G(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function Vt(e){if(Ze)return;const n=()=>{t.editingId||t.dragging||(e.clearTimeout(Qe),Qe=e.setTimeout(()=>{G(e.document)&&O(e)},80))},a=()=>{if(n(),_("dock:on-empty-page")===!0){const o=ht(e,e.document);o.length===1&&pt(e,e.document,o,o[0].uid,"")}};Ze=Rn("dock:html-changed",n),e.document.addEventListener("sve-page-structure",a),At=()=>{e.document.removeEventListener("sve-page-structure",a)}}function kl(e){Ze?.(),Ze=null,At?.(),At=null,e?.clearTimeout?.(Qe),Qe=0}function en(e){const n=G(e.document);if(ue({source:ee,type:Q.SVE_HTML_PICK,on:!1},e),kl(e),q.forget(),X.callOpen=!1,X.callStore=null,Xt(e),Ve(),W(),Ta(e),R=null,t.inspect=null,t.editingId=null,t.draft="",t.sections=[],t.pageBuilder=!1,t.layoutFile=!1,J="",e?.clearTimeout?.(Se),!n){Ht(e);return}n.remove(),Ut.headerTab==="html_tree"&&Go(e,null),Zo(e),$n(e),Mn(e),Ht(e)}function Ml(e,n){n.querySelector("[data-sve-html-tree-list]")||(n.id=Ye,Ie(n,qn,{title:p(e,"html_tree")}),n.querySelector("[data-sve-close]")?.addEventListener("click",()=>en(e)))}function Il(e){Vt(e),O(e)}function fo(e){const n=e.document;if(!Ho(e,"html_tree"))return;if(G(n)){Vt(e),O(e);return}if(!eo(n))return;Ee=!0,U.clear(),Jo(e,[Ye]);const a=n.createElement("div");a.id=Ye,a.style.cssText=Qo,Ie(a,qn,{title:p(e,"html_tree")}),a.querySelector("[data-sve-close]")?.addEventListener("click",()=>en(e)),ea(e,a),$n(e),Mn(e),Ht(e),Vt(e),O(e)}function Al(e){if(G(e.document)){en(e);return}fo(e)}Yt("html-tree:open-section",e=>{const n=window,a=n.document,o=ht(n,a),r=o.find(l=>l.uid===e||l.ids.includes(e));return r?(pt(n,a,o,r.uid,""),{uid:r.uid,ids:r.ids}):null});Yt("html-tree:from-preview",({path:e,src:n}={})=>{Nn(window,e)||gl(window,vl(e,n)||e)});Yt("html-tree:arm-pick",e=>{const n=window;return e?(ao(n,ut(z(),Zn(n))),!0):(G(n.document)||ue({source:ee,type:Q.SVE_HTML_PICK,on:!1},n),!0)});function Ol(){ge.clear(),Ae.clear(),It.clear(),Ge.clear(),Ne.length=0}export{wi as HTML_TREE_STYLE_ID,$l as armHtmlTreePrefetch,Ol as clearHtmlTreeTemplates,W as closeHtmlTreeMenu,en as closeHtmlTreePanel,Pi as ensureHtmlTreeStyles,Ml as fillHtmlTreePane,R as htmlTreeActiveId,G as htmlTreePanel,Qe as htmlTreeTimer,Ze as htmlTreeUnhook,fo as openHtmlTreePanel,O as renderHtmlTree,Il as showHtmlTreePane,kl as stopWatchHtmlTreeDock,Al as toggleHtmlTreePanel,Vt as watchHtmlTreeDock};
