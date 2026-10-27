import{r as Ye,R as bn,u as s,o as v,c as p,a as $,t as L,F as M,i as A,m as Co,f as _,n as Tn,w as T,$ as J,s as f,e as xn,L as q,N as wn,ab as _n,a4 as Sn,af as Te,j as Xe,ad as ro,Z as ce,aE as Cn,v as io,A as Ln,V as En,aC as Hn,W as Lo,aF as Pn,B as lt,p as Vt,q as jt,U as Re,X as $n,aG as Mn,aH as In}from"./addon-BrJ6DwQX.js";import{c as Eo,a as Rn,o as On,b as Fn,d as Dn,T as An,i as Bn,r as Nn,e as Kn,f as Vn,u as lo,l as co}from"./section-create-Duk0DHiA.js";import{canEditFields as jn,currentSetHandle as Un,openFieldsetOverlay as Ho,openGlobalFieldsOverlay as qn}from"./section-fields-BECTkbEN.js";import{aw as t,ax as Yn,ay as W,az as zn,b as x,s as Ut,i as ue,a4 as Ht,ak as Xn,$ as Gn,ai as Po,aj as $o,W as ho,q as Pe,a3 as Wn,a0 as Zn,a1 as Jn,aA as Qn,aB as uo,aC as Mo,aD as Io,n as Ro,aE as ea,aF as ta,o as Oo,aG as oa,J as Fo,a7 as dt,t as Ae,aH as Do,aI as na,aJ as qt,aK as aa,aL as sa,aM as ra,ad as ia,aN as la,aO as da,aP as ca,aQ as ha,aR as ua,B as Ao,af as va,V as Yt}from"./lp-cluster-gh1T3izP.js";import{H as Ge,j as pa,d as fa}from"./shortcuts-BBrEL-OT.js";import{_ as ct,o as Be}from"./ChoiceDialog-BKpBo5hN.js";import{M as Q,S as ee}from"./protocol-BVdEmGBQ.js";import{C as ma,D as Ne,E as zt,o as ga,A as ka,F as Bo,l as ya,G as No,H as xe,I as ba,J as Ta,K as Xt,c as xa,L as wa,b as _a,M as Sa,N as Ca,O as La,P as Ea,Q as Ha,R as Pa,S as $a,T as Ma,U as Ia,V as Ra,W as Oa,X as Fa,Y as vo,Z as Da,$ as Aa}from"./component-extract-CR86394o.js";import{x as ht,o as Ba,K as Ko,L as Vo,M as Na,N as Ka}from"./css-scope-CvwgFAfm.js";import{b as Va}from"./html-pick-align-CLq5l-p4.js";import{l as ja,a as Ua,b as qa,c as Ya,d as za,e as Xa,f as Ga,g as Wa,h as Za}from"./loop-inspector-B2zHiah7.js";import"./FieldsetOverlay-CKIUwON_.js";import"./ai-text-icon-B7uCWIwa.js";const yt=/\s*([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/y,Ja=/^\s*(?:([A-Za-z_$][\w$]*)|'([^'\\]*)'|"([^"\\]*)")\s*:\s*(true|false)\s*$/;function Qa(e){const o=String(e||"").replace(/\{\{[\s\S]*?\}\}/g,r=>" ".repeat(r.length)),n=o.match(/^<[a-zA-Z][\w:-]*/);if(!n)return null;let a=n[0].length;for(;a<o.length;){yt.lastIndex=a;const r=yt.exec(o);if(!r){a+=1;continue}if(r[1].toLowerCase()==="x-data")return r[2]??r[3]??r[4]??"";a=yt.lastIndex}return null}function es(e,o){const n=e[o];for(let a=o+1;a<e.length;a+=1)if(e[a]==="\\")a+=1;else if(e[a]===n)return a;return e.length-1}function ts(e){const o=String(e||""),n=o.search(/\S/);if(n===-1||o[n]!=="{")return[];const a=new Map;let r=0,i="";const l=()=>{const c=i.match(Ja);c&&a.set(c[1]??c[2]??c[3],c[4]==="true"),i=""};for(let c=n;c<o.length;c+=1){const g=o[c];if(g==='"'||g==="'"||g==="`"){const m=es(o,c);i+=o.slice(c,m+1),c=m;continue}if(g==="/"&&o[c+1]==="/"){const m=o.indexOf(`
`,c);c=m===-1?o.length:m-1;continue}if(g==="/"&&o[c+1]==="*"){const m=o.indexOf("*/",c+2);c=m===-1?o.length:m+1;continue}if(g==="{"||g==="["||g==="("){if(r+=1,r===1)continue}else if(g==="}"||g==="]"||g===")"){if(r-=1,r===0)break}else if(g===","&&r===1){l();continue}i+=g}return l(),[...a].map(([c,g])=>({key:c,value:g}))}const os={key:0,class:"sve-ht-inspect"},ns={class:"sve-ht-inspect__head"},as={key:0,class:"sve-ht-inspect__note"},ss={key:2,class:"sve-ht-inspect__props"},rs={class:"sve-ht-inspect__proplabel"},is={key:0},ls=["value","disabled","onChange"],ds={value:""},cs=["value"],hs=["value"],us=["value","placeholder","onChange"],vs=["title","disabled","onClick"],ps=["title","disabled","onClick"],fs={key:0,class:"sve-ht-inspect__seg"},ms=["data-active","disabled","onClick"],gs=["value","disabled"],ks={key:0,value:""},ys=["value"],bs=["value","disabled"],Ts=["value"],xs={key:3,class:"sve-ht-inspect__box"},ws=["value","placeholder","disabled","onKeydown"],_s=["title","disabled"],Ss={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Cs=["value","disabled"],Ls=["value"],Es={key:0,class:"sve-ht-inspect__tick"},Hs=["checked","disabled"],Ps={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},$s=["value","disabled"],Ms=["value"],Is={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},Rs=["value","placeholder","disabled"],Os=["title","disabled"],Fs={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Ds=["value","placeholder","disabled"],As={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Bs=["value","placeholder","disabled"],Ns={key:6,class:"sve-ht-inspect__add"},Ks=["disabled","onClick"],bt='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',Vs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',js={__name:"HtmlTreeInspector",setup(e){const o=Ye(null);bn(o,m=>t.onPropHost?.(m||null));const n=Ye(null),a=Ye(null);function r(m){t.onInspectCommit?.(m.target.value)}function i(m,k,u){!m||!k||(m.value=k,m.focus(),m.setSelectionRange(k.length,k.length),u(k))}function l(m,k){t.onInspectData?.(m.currentTarget,u=>t.onPropValue?.(k.handle,u,!0))}function c(m){t.onInspectData?.(m.currentTarget,k=>i(n.value,k,u=>t.onInspectCommit?.(u)))}function g(m){t.onInspectData?.(m.currentTarget,k=>i(a.value,k,u=>t.onLoopSortField?.(u)))}return(m,k)=>s(t).inspect?(v(),p("div",os,[$("div",ns,L(s(t).inspect.title),1),s(t).inspect.mode==="note"?(v(),p("div",as,L(s(t).inspect.note),1)):s(t).inspect.mode==="statamic"?(v(),p("div",{key:1,ref_key:"propHost",ref:o,class:"sve-ht-inspect__form"},null,512)):s(t).inspect.mode==="props"?(v(),p("div",ss,[(v(!0),p(M,null,A(s(t).inspect.rows,u=>(v(),p("label",{key:u.handle,class:"sve-ht-inspect__prop"},[$("span",rs,[Co(L(u.label)+" ",1),u.bound?(v(),p("em",is,":")):_("",!0)]),$("span",{class:Tn(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":u.type==="select"||u.type==="link"}])},[u.type==="select"&&!u.bound?(v(),p("select",{key:0,value:u.value,disabled:!s(t).canEdit,onChange:C=>s(t).onPropValue?.(u.handle,C.target.value,!1)},[$("option",ds,L(u.placeholder||s(t).inspect.inheritLabel),1),u.value&&!u.options.includes(u.value)?(v(),p("option",{key:0,value:u.value},L(u.value),9,cs)):_("",!0),(v(!0),p(M,null,A(u.options,C=>(v(),p("option",{key:C,value:C},L(C),9,hs))),128))],40,ls)):(v(),p("input",{key:1,type:"text",value:u.value,placeholder:u.placeholder||s(t).inspect.inheritLabel,onChange:C=>s(t).onPropValue?.(u.handle,C.target.value,u.bound)},null,40,us)),u.type==="link"?(v(),p("button",{key:2,type:"button","data-sve-ht-data":"",title:s(t).pageTitle,disabled:!s(t).canEdit,onClick:C=>s(t).onPropPage?.(C.currentTarget,u.handle),innerHTML:Vs},null,8,vs)):_("",!0),$("button",{type:"button","data-sve-ht-data":"",title:s(t).dataTitle,disabled:!s(t).canEdit,onClick:C=>l(C,u),innerHTML:bt},null,8,ps)],2)]))),128))])):(v(),p(M,{key:3},[s(t).inspect.mode==="loop"?(v(),p("div",fs,[(v(!0),p(M,null,A(s(t).inspect.kinds,u=>(v(),p("button",{key:u.id,type:"button","data-active":u.id===s(t).inspect.loopKind?"":void 0,disabled:!s(t).canEdit,onClick:C=>s(t).onLoopKind?.(u.id)},L(u.label),9,ms))),128))])):_("",!0),s(t).inspect.mode==="loop"&&s(t).inspect.loopKind==="collection"?(v(),p("select",{key:s(t).inspect.key+":"+s(t).inspect.value,value:s(t).inspect.value,disabled:!s(t).canEdit,onChange:r},[s(t).inspect.value?_("",!0):(v(),p("option",ks,L(s(t).inspect.placeholder),1)),(v(!0),p(M,null,A(s(t).inspect.collections,u=>(v(),p("option",{key:u.handle,value:u.handle},L(u.title),9,ys))),128))],40,gs)):s(t).inspect.mode==="loop"&&s(t).inspect.loopKind==="nav"?(v(),p("select",{key:s(t).inspect.key+":nav:"+s(t).inspect.value,value:s(t).inspect.value,disabled:!s(t).canEdit,onChange:r},[(v(!0),p(M,null,A(s(t).inspect.navs,u=>(v(),p("option",{key:u.handle,value:u.handle},L(u.title),9,Ts))),128))],40,bs)):(v(),p("div",xs,[(v(),p("input",{ref_key:"field",ref:n,key:s(t).inspect.key,type:"text",value:s(t).inspect.value,placeholder:s(t).inspect.placeholder,disabled:!s(t).canEdit,spellcheck:"false",onKeydown:[k[0]||(k[0]=T(()=>{},["stop"])),J(T(r,["prevent"]),["enter"])],onBlur:r},null,40,ws)),$("button",{type:"button","data-sve-ht-data":"",title:s(t).dataTitle,disabled:!s(t).canEdit,innerHTML:bt,onMousedown:k[1]||(k[1]=T(()=>{},["prevent"])),onClick:T(c,["stop","prevent"])},null,40,_s)])),s(t).inspect.nav?(v(),p(M,{key:4},[$("div",Ss,L(s(t).inspect.nav.depthTitle),1),(v(),p("select",{key:s(t).inspect.key+":depth:"+s(t).inspect.nav.depth,value:s(t).inspect.nav.depth,disabled:!s(t).canEdit,onChange:k[2]||(k[2]=u=>s(t).onLoopDepth?.(u.target.value))},[(v(!0),p(M,null,A(s(t).inspect.nav.depths,u=>(v(),p("option",{key:u.id,value:u.id},L(u.label),9,Ls))),128))],40,Cs)),s(t).inspect.nav.homeAsked?(v(),p("label",Es,[$("input",{type:"checkbox",checked:s(t).inspect.nav.includeHome,disabled:!s(t).canEdit,onChange:k[3]||(k[3]=u=>s(t).onLoopIncludeHome?.(u.target.checked))},null,40,Hs),$("span",null,L(s(t).inspect.nav.homeLabel),1)])):_("",!0)],64)):_("",!0),s(t).inspect.sort?(v(),p(M,{key:5},[$("div",Ps,L(s(t).inspect.sort.title),1),(v(),p("select",{key:s(t).inspect.key+":dir:"+s(t).inspect.sort.dir,value:s(t).inspect.sort.dir,disabled:!s(t).canEdit,onChange:k[4]||(k[4]=u=>s(t).onLoopSortDir?.(u.target.value))},[(v(!0),p(M,null,A(s(t).inspect.sort.dirs,u=>(v(),p("option",{key:u.id,value:u.id},L(u.label),9,Ms))),128))],40,$s)),s(t).inspect.sort.needsField?(v(),p("div",Is,[(v(),p("input",{ref_key:"sortField",ref:a,key:s(t).inspect.key+":field",type:"text",value:s(t).inspect.sort.field,placeholder:s(t).inspect.sort.placeholder,disabled:!s(t).canEdit,spellcheck:"false",onKeydown:[k[5]||(k[5]=T(()=>{},["stop"])),k[6]||(k[6]=J(T(u=>s(t).onLoopSortField?.(u.target.value),["prevent"]),["enter"]))],onBlur:k[7]||(k[7]=u=>s(t).onLoopSortField?.(u.target.value))},null,40,Rs)),s(t).inspect.sort.pickable?(v(),p("button",{key:0,type:"button","data-sve-ht-data":"",title:s(t).dataTitle,disabled:!s(t).canEdit,innerHTML:bt,onMousedown:k[8]||(k[8]=T(()=>{},["prevent"])),onClick:T(g,["stop","prevent"])},null,40,Os)):_("",!0)])):_("",!0),$("div",Fs,L(s(t).inspect.limit.title),1),(v(),p("input",{key:s(t).inspect.key+":limit",type:"number",min:"1",value:s(t).inspect.limit.value,placeholder:s(t).inspect.limit.placeholder,disabled:!s(t).canEdit,onKeydown:[k[9]||(k[9]=T(()=>{},["stop"])),k[10]||(k[10]=J(T(u=>s(t).onLoopLimit?.(u.target.value),["prevent"]),["enter"]))],onBlur:k[11]||(k[11]=u=>s(t).onLoopLimit?.(u.target.value))},null,40,Ds)),$("div",As,L(s(t).inspect.offset.title),1),(v(),p("input",{key:s(t).inspect.key+":offset",type:"number",min:"0",value:s(t).inspect.offset.value,placeholder:s(t).inspect.offset.placeholder,disabled:!s(t).canEdit,onKeydown:[k[12]||(k[12]=T(()=>{},["stop"])),k[13]||(k[13]=J(T(u=>s(t).onLoopOffset?.(u.target.value),["prevent"]),["enter"]))],onBlur:k[14]||(k[14]=u=>s(t).onLoopOffset?.(u.target.value))},null,40,Bs))],64)):_("",!0),s(t).inspect.branches?.length?(v(),p("div",Ns,[(v(!0),p(M,null,A(s(t).inspect.branches,u=>(v(),p("button",{key:u.id,type:"button",disabled:!s(t).canEdit,onClick:C=>s(t).onAddBranch?.(u.id)},L(u.label),9,Ks))),128))])):_("",!0)],64))])):_("",!0)}},Us=ct(js,[["__scopeId","data-v-7ecb01a5"]]),qs={class:"sve-html-tree"},Ys={class:"sve-pane-bar","data-sve-pane-bar":""},zs={"data-sve-right-title":""},Xs={"data-sve-right-actions":""},Gs=["aria-pressed","title","aria-label"],Ws=["title"],Zs={class:"sve-ht-used-by__label"},Js={class:"sve-ht-used-by__chips"},Qs=["title","onClick"],er={key:1,class:"sve-ht-used-by__chip"},tr={key:0,class:"sve-ht-used-by__empty"},or={class:"sve-ht-tools"},nr=["title"],ar=["placeholder","aria-label","value"],sr=["aria-label"],rr=["title","aria-label"],ir=["title","aria-label"],lr={key:2,class:"sve-tree-exit"},dr=["title"],cr=["title"],hr='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',ur='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',vr='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',pr='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',fr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/></svg>',mr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',gr={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const o=f(window,"html_tree_search");t.layers=Yn(window);const n=f(window,"html_tree_layers_on"),a=f(window,"html_tree_layers_off");function r(){zn(window,!t.layers)}const i=Eo(window),l=f(window,"section_new"),c=f(window,"html_tree_add_element"),g=f(window,"html_tree_sections_slot"),m=f(window,"html_tree_sections_no_field");function k(){const b=t.templateSections.length?t.templateSections:[_n(window)],E=new Set(t.rows.filter(P=>P.kind==="sections").map(P=>P.tag));return b.filter(P=>!E.has(P)).map(P=>({tag:`sections:${P}`,label:b.length>1?`${g} · ${P}`:g,noField:!t.templateSections.length}))}const u=Ye(!1),C=f(window,"section_import");function S(){u.value=!1}async function D(b){if(!b)return;await Sn(),t.onRefresh?.();const E=x("html-tree:open-section",b);E&&Nn(window,E.ids)}function H(){const b=t.rows.find(E=>E.current&&!E.context&&!E.synthetic)||null;return b?.lockedIn?t.rows.filter(E=>E.locked&&E.from<=b.from&&E.to>=b.to).sort((E,P)=>E.from-P.from)[0]||null:b}function te(b){const E=b.getBoundingClientRect(),P=H();let O=null;const V=(B,Ce,re="")=>()=>{O?.dismiss(),O=null,S();const vt=Bn(window,B,P,Ce);vt!==null&&(t.selectFrom={at:vt,left:4},re&&window.Statamic?.$toast?.info?.(re))};O=Be(document,Ne,{items:[...An.map(B=>({label:B,onPick:V(B,`<${B}>`)})),...k().map(B=>({label:B.label,onPick:V(B.tag,B.label,B.noField?m:"")}))],x:Math.round(E.left),y:Math.round(E.bottom+4),onClose:()=>{O=null,S()}})}function oe(b){if(!u.value){if(u.value=!0,!(t.sections.length||t.pageBuilder)){te(b.currentTarget);return}(async()=>{const E=await Rn(window);if(!E){S();return}const P=t.sections.length?t.sections[t.sections.length-1].uid:null,O=V=>{S(),D(V?.uid)};if(E==="static"){On(window,{afterUid:P,onDone:O,onError:S,onClose:S});return}Fn(window,{afterUid:P,onDone:O,onError:S,onClose:S})})()}}function y(){if(u.value)return;u.value=!0;const b=!!(t.sections.length||t.pageBuilder);Dn(window,{intoTemplate:!b,after:b?null:H(),afterUid:b&&t.sections.length?t.sections[t.sections.length-1].uid:null,onDone:E=>{if(S(),b){D(E?.uid);return}Number.isInteger(E?.at)&&(t.selectFrom={at:E.at,left:4})},onError:S,onClose:S})}function d(b){const E=!!t.query;t.query=b,E!==!!b&&t.onQuery?.()}return(b,E)=>(v(),p("div",qs,[$("div",Ys,[$("div",zs,L(e.title),1),$("div",Xs,[$("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":s(t).layers?"true":"false",title:s(t).layers?s(a):s(n),"aria-label":s(t).layers?s(a):s(n),innerHTML:hr,onClick:r},null,8,Gs),E[5]||(E[5]=xn('<button type="button" data-sve-right-pin aria-pressed="false" data-v-9a4a7640></button><button type="button" data-sve-close aria-label="Close" data-v-9a4a7640><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-9a4a7640><path d="M18 6 6 18" data-v-9a4a7640></path><path d="m6 6 12 12" data-v-9a4a7640></path></svg></button>',2))])]),s(t).usedBy?(v(),p("div",{key:0,class:"sve-ht-used-by",title:s(t).usedBy.hint||null},[$("span",Zs,[$("span",{class:"sve-ht-used-by__icon","aria-hidden":"true",innerHTML:fr}),Co(" "+L(s(t).usedBy.label),1)]),$("span",Js,[(v(!0),p(M,null,A(s(t).usedBy.items,P=>(v(),p(M,{key:P.kind+":"+P.name},[P.onOpen?(v(),p("button",{key:0,type:"button",class:"sve-ht-used-by__chip sve-ht-used-by__chip--open",title:P.openLabel,onClick:O=>P.onOpen(O.currentTarget)},L(P.name),9,Qs)):(v(),p("span",er,L(P.name),1))],64))),128)),s(t).usedBy.empty?(v(),p("span",tr,L(s(t).usedBy.empty),1)):_("",!0)])],8,Ws)):_("",!0),$("div",or,[$("label",{class:"sve-ht-search",title:s(o)},[$("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:pr}),$("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:s(o),"aria-label":s(o),value:s(t).query,autocomplete:"off",spellcheck:"false",onInput:E[0]||(E[0]=P=>d(P.target.value)),onKeydown:[E[1]||(E[1]=T(()=>{},["stop"])),E[2]||(E[2]=J(T(P=>d(""),["prevent"]),["escape"]))]},null,40,ar),s(t).query?(v(),p("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":s(o),innerHTML:mr,onClick:E[3]||(E[3]=P=>d(""))},null,8,sr)):_("",!0)],8,nr),s(i)&&(s(t).sections.length||s(t).pageBuilder||s(t).rows.length&&!s(t).layoutFile)?(v(),p("button",{key:0,type:"button",class:"sve-ht-new",title:s(t).sections.length||s(t).pageBuilder?s(l):s(c),"aria-label":s(t).sections.length||s(t).pageBuilder?s(l):s(c),innerHTML:ur,onClick:oe},null,8,rr)):_("",!0),s(i)&&(s(t).sections.length||s(t).pageBuilder||s(t).rows.length&&!s(t).layoutFile)?(v(),p("button",{key:1,type:"button",class:"sve-ht-import",title:s(C),"aria-label":s(C),innerHTML:vr,onClick:y},null,8,ir)):_("",!0)]),s(W).inSidebar?_("",!0):(v(),q(ma,{key:1})),E[6]||(E[6]=$("div",{"data-sve-html-tree-list":""},null,-1)),wn(Us),s(t).exitOpen&&!s(W).inSidebar?(v(),p("div",lr,[$("span",{class:"sve-tree-exit__name",title:s(t).exitName},L(s(t).exitName),9,dr),$("button",{type:"button",class:"sve-tree-exit__go",title:s(t).exitTitle,onClick:E[4]||(E[4]=P=>s(t).onExit?.())},L(s(t).exitLabel),9,cr)])):_("",!0)]))}},jo=ct(gr,[["__scopeId","data-v-9a4a7640"]]);function Uo(e){return String(e||"").trim().toLowerCase()}function Pt(e,o){return o?[e.name,e.tag,e.klass,e.label,e.src].filter(n=>typeof n=="string"&&n).join(" ").toLowerCase().includes(o):!0}function kr(e,o){const n=Uo(o);if(!n)return{rows:e,hits:new Set};const a=new Set;for(const l of e)Pt(l,n)&&a.add(l.path);const r=[...a];return{rows:e.filter(l=>a.has(l.path)||r.some(c=>c.startsWith(`${l.path}/`))),hits:a}}const yr=["title"],br={"data-sve-ht-indent":"","aria-hidden":"true"},Tr=["data-sve-ht-cat"],xr={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},wr={key:2,"data-sve-ht-letter":""},_r=["innerHTML"],Sr=["title"],Cr={key:1,"data-sve-ht-name":""},Lr={"data-sve-ht-detail":""},Er=["title"],Hr={key:1,"data-sve-ht-kind":""},Pr={key:2,"data-sve-ht-classes":""},$r=["title"],Mr={key:1,"data-sve-ht-kind":""},Ir={key:3,"data-sve-ht-name":""},Rr={key:4,"data-sve-ht-actions":""},Or=["data-on","title","innerHTML"],Fr=["title"],Dr={key:5,"data-sve-ht-actions":""},Ar=["data-on","title","innerHTML"],Br=["data-on","title","innerHTML"],Nr=["disabled","title","innerHTML"],Kr=["disabled","title"],Vr=["disabled","title"],jr=["data-on","disabled","title","aria-pressed","innerHTML"],Ur=["disabled","title"],qr=["data-sve-ht-id"],po='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',Yr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',zr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Xr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',Gr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',Wr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',Zr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',fo='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6.5" width="20" height="11" rx="5.5"/><circle cx="7.5" cy="12" r="3" fill="currentColor" stroke="none"/></svg>',mo='<svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M7.5 5.5h9a6.5 6.5 0 0 1 0 13h-9a6.5 6.5 0 0 1 0-13ZM16.5 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6Z"/></svg>',Jr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',Qr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-.9"/></svg>',ei='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',ti={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const o=jn(window),n=f(window,"section_fields");function a(){const y=Un();if(!y){window.Statamic?.$toast?.error(f(window,"section_fields_none"));return}Ho(window,y)}function r(y){return y.synthetic?y.frame==="main"?t.frameMainTitle:y.frame==="template"?t.frameTemplateTitle:t.frameOpenTitle:y.kind==="component"?y.src?`partial:${y.src}`:y.tag:y.name?`${y.tag} ${y.name}`:y.tag}function i(y){return!!y.section}function l(y){return!!y.frame}function c(y){return y.kind==="slot"}function g(y,d){l(d)||c(d)||(i(d)?t.onSectionPointerDown?.(y,d.section):d.sectionRoot?t.onSectionPointerDown?.(y,d.sectionRoot):t.onPointerDown?.(y,d.id))}function m(y){if(y.synthetic){t.onFrame?.(y.frame);return}if(i(y)){t.onSection?.(y.section);return}t.onSelect?.(y.id)}function k(y,d){const b={"data-sve-ht-id":y.id};return y.locked&&(b["data-sve-ht-locked"]=""),y.current&&(b["data-sve-ht-current"]=""),y.hidden&&(b["data-sve-ht-hidden"]=""),b["data-sve-ht-cat"]=y.cat||"other",b["data-sve-ht-depth"]=String(y.depth),d&&(b["data-sve-ht-dim"]=""),i(y)&&(b["data-sve-ht-sec"]=""),l(y)&&(b["data-sve-ht-frame"]=y.frame),!i(y)&&t.dropId===y.id&&t.dropPlace&&(b["data-sve-ht-drop"]=t.dropPlace),b}function u(y){return!!y.fixed}function C(y){return y.kind==="sections"}function S(y){return!!(y.locked||y.lockedIn)}function D(y){return!y.lockedIn&&!u(y)}function H(y){return!u(y)&&!C(y)&&!S(y)&&(!y.hidden||y.wrapFrom!=null)}function te(y){return!!y.sectionRoot||!!y.section}function oe(y){return t.canEdit&&!S(y)||te(y)}return(y,d)=>(v(),p(M,null,[$("div",Te({"data-sve-ht-row":""},k(e.row,e.dim),{role:"button",tabindex:"0",title:r(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:d[53]||(d[53]=b=>m(e.row)),onDblclick:d[54]||(d[54]=T(b=>e.row.synthetic?s(t).onFrameEnter?.(e.row.frame):l(e.row)||c(e.row)||i(e.row)?null:s(t).onRename?.(e.row.id),["prevent"])),onKeydown:[d[55]||(d[55]=J(T(b=>m(e.row),["prevent"]),["enter"])),d[56]||(d[56]=J(T(b=>m(e.row),["prevent"]),["space"]))],onPointerdown:d[57]||(d[57]=b=>g(b,e.row)),onPointerenter:d[58]||(d[58]=b=>i(e.row)?s(t).onSectionHover?.(e.row.section):null),onContextmenu:d[59]||(d[59]=T(b=>l(e.row)||c(e.row)||i(e.row)?null:s(t).onContext?.(b,e.row.id),["prevent","stop"]))}),[$("span",br,[(v(!0),p(M,null,A(e.row.guides||[],(b,E)=>(v(),p("i",{key:E,"data-sve-ht-cat":b},null,8,Tr))),128))]),e.row.hasChildren||e.row.emptyBlock?(v(),p("button",Te({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?s(t).mainShut:e.row.shut)?{"data-sve-ht-shut":""}:{},{innerHTML:Yr,onClick:d[0]||(d[0]=T(b=>e.row.synthetic?s(t).onFrameTwist?.():i(e.row)?s(t).onSection?.(e.row.section):s(t).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:d[1]||(d[1]=T(()=>{},["stop"])),onDblclick:d[2]||(d[2]=T(()=>{},["stop"]))}),null,16)):(v(),p("span",xr)),e.row.letter?(v(),p("span",wr,L(e.row.letter),1)):(v(),p("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,_r)),$("span",{"data-sve-ht-text":"",title:s(t).renameTitle},[!s(t).layers&&s(t).look==="tags"?(v(),p(M,{key:0},[s(t).editingId===e.row.id&&!i(e.row)?Xe((v(),p("input",{key:0,"data-sve-ht-rename":"","onUpdate:modelValue":d[3]||(d[3]=b=>s(t).draft=b),onMousedown:d[4]||(d[4]=T(()=>{},["stop"])),onPointerdown:d[5]||(d[5]=T(()=>{},["stop"])),onClick:d[6]||(d[6]=T(()=>{},["stop"])),onDblclick:d[7]||(d[7]=T(()=>{},["stop"])),onKeydown:[d[8]||(d[8]=T(()=>{},["stop"])),d[9]||(d[9]=J(T(b=>s(t).onRenameCommit?.(),["prevent"]),["enter"])),d[10]||(d[10]=J(T(b=>s(t).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:d[11]||(d[11]=b=>s(t).onRenameCommit?.())},null,544)),[[ro,s(t).draft]]):(v(),p("span",Cr,L(e.row.display),1)),$("span",Lr,[!e.row.kind&&!i(e.row)&&!l(e.row)?(v(),p("button",{key:0,type:"button","data-sve-ht-tag":"",title:s(t).tagTitle,onClick:d[12]||(d[12]=T(()=>{},["stop","prevent"])),onPointerdown:d[13]||(d[13]=T(()=>{},["stop"])),onDblclick:d[14]||(d[14]=T(b=>s(t).onTagChange?.(b,e.row.id),["stop","prevent"]))},L(e.row.tag),41,Er)):e.row.kind!=="antlers"?(v(),p("span",Hr,L(e.row.tag),1)):_("",!0),e.row.detail?(v(),p("span",Pr,L(e.row.detail),1)):_("",!0)])],64)):(v(),p(M,{key:1},[!e.row.kind&&!i(e.row)&&!l(e.row)?(v(),p("button",{key:0,type:"button","data-sve-ht-tag":"",title:s(t).tagTitle,onClick:d[15]||(d[15]=T(()=>{},["stop","prevent"])),onPointerdown:d[16]||(d[16]=T(()=>{},["stop"])),onDblclick:d[17]||(d[17]=T(b=>s(t).onTagChange?.(b,e.row.id),["stop","prevent"]))},L(e.row.tag),41,$r)):(v(),p("span",Mr,L(e.row.tag),1)),s(t).editingId===e.row.id&&!i(e.row)?Xe((v(),p("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":d[18]||(d[18]=b=>s(t).draft=b),onMousedown:d[19]||(d[19]=T(()=>{},["stop"])),onPointerdown:d[20]||(d[20]=T(()=>{},["stop"])),onClick:d[21]||(d[21]=T(()=>{},["stop"])),onDblclick:d[22]||(d[22]=T(()=>{},["stop"])),onKeydown:[d[23]||(d[23]=T(()=>{},["stop"])),d[24]||(d[24]=J(T(b=>s(t).onRenameCommit?.(),["prevent"]),["enter"])),d[25]||(d[25]=J(T(b=>s(t).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:d[26]||(d[26]=b=>s(t).onRenameCommit?.())},null,544)),[[ro,s(t).draft]]):(v(),p("span",Ir,L(e.row.name),1))],64))],8,Sr),l(e.row)?(v(),p("span",Rr,[e.row.alpineNth>=0?(v(),p("button",{key:0,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:s(t).alpineTitle,innerHTML:e.row.alpineSet?mo:fo,onClick:d[27]||(d[27]=T(b=>s(t).onAlpineState?.(b,e.row.id),["stop","prevent"])),onPointerdown:d[28]||(d[28]=T(()=>{},["stop"])),onDblclick:d[29]||(d[29]=T(()=>{},["stop"]))},null,40,Or)):_("",!0),e.row.frame!=="main"&&s(o)?(v(),p("button",{key:1,type:"button","data-sve-ht-fields":"",title:s(t).frameFieldsTitle,innerHTML:po,onClick:d[30]||(d[30]=T(b=>s(t).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:d[31]||(d[31]=T(()=>{},["stop"])),onDblclick:d[32]||(d[32]=T(()=>{},["stop"]))},null,40,Fr)):_("",!0)])):!i(e.row)&&!c(e.row)?(v(),p("span",Dr,[e.row.videoNth>=0?(v(),p("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?s(t).videoPlayTitle:s(t).videoHoldTitle,innerHTML:e.row.videoHeld?Zr:Wr,onClick:d[33]||(d[33]=T(b=>s(t).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:d[34]||(d[34]=T(()=>{},["stop"])),onDblclick:d[35]||(d[35]=T(()=>{},["stop"]))},null,40,Ar)):_("",!0),e.row.alpineNth>=0?(v(),p("button",{key:1,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:s(t).alpineTitle,innerHTML:e.row.alpineSet?mo:fo,onClick:d[36]||(d[36]=T(b=>s(t).onAlpineState?.(b,e.row.id),["stop","prevent"])),onPointerdown:d[37]||(d[37]=T(()=>{},["stop"])),onDblclick:d[38]||(d[38]=T(()=>{},["stop"]))},null,40,Br)):_("",!0),H(e.row)?(v(),p("button",{key:2,type:"button","data-sve-ht-eye":"",disabled:!s(t).canEdit,title:s(t).canEdit?e.row.hidden?s(t).showTitle:s(t).hideTitle:s(t).lockedTitle,innerHTML:e.row.hidden?Xr:zr,onClick:d[39]||(d[39]=T(b=>s(t).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:d[40]||(d[40]=T(()=>{},["stop"])),onDblclick:d[41]||(d[41]=T(()=>{},["stop"]))},null,40,Nr)):_("",!0),s(o)&&e.row.fieldsIcon?(v(),p("button",{key:3,type:"button","data-sve-ht-fields":"",disabled:!s(t).canEdit,title:s(t).canEdit?s(n):s(t).lockedTitle,innerHTML:po,onClick:T(a,["stop","prevent"]),onPointerdown:d[42]||(d[42]=T(()=>{},["stop"])),onDblclick:d[43]||(d[43]=T(()=>{},["stop"]))},null,40,Kr)):_("",!0),!u(e.row)&&!C(e.row)?(v(),p("button",{key:4,type:"button","data-sve-ht-dup":"",disabled:!oe(e.row),title:oe(e.row)?s(t).duplicateTitle:s(t).lockedTitle,innerHTML:Gr,onClick:d[44]||(d[44]=T(b=>s(t).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:d[45]||(d[45]=T(()=>{},["stop"])),onDblclick:d[46]||(d[46]=T(()=>{},["stop"]))},null,40,Vr)):_("",!0),D(e.row)?(v(),p("button",{key:5,type:"button","data-sve-ht-lock":"","data-on":e.row.locked?"":null,disabled:!s(t).canEdit||e.row.locked&&!s(t).canUnlock,title:e.row.locked?s(t).canUnlock?s(t).unlockTitle:s(t).lockedByTitle:s(t).lockTitle,"aria-pressed":e.row.locked?"true":"false",innerHTML:e.row.locked?Jr:Qr,onClick:d[47]||(d[47]=T(b=>s(t).onLock?.(e.row.id),["stop","prevent"])),onPointerdown:d[48]||(d[48]=T(()=>{},["stop"])),onDblclick:d[49]||(d[49]=T(()=>{},["stop"]))},null,40,jr)):_("",!0),u(e.row)?_("",!0):(v(),p("button",{key:6,type:"button","data-sve-ht-del":"",disabled:!oe(e.row),title:oe(e.row)?s(t).deleteTitle:s(t).lockedTitle,innerHTML:ei,onClick:d[50]||(d[50]=T(b=>s(t).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:d[51]||(d[51]=T(()=>{},["stop"])),onDblclick:d[52]||(d[52]=T(()=>{},["stop"]))},null,40,Ur))])):_("",!0)],16,yr),e.row.emptyBlock&&!e.row.shut?(v(),p("div",Te({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},s(t).dropId===e.row.id&&s(t).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),L(s(t).slotText),17,qr)):_("",!0)],64))}},G=ct(ti,[["__scopeId","data-v-b8e388c2"]]),oi=["data-sve-ht-look","data-sve-ht-layers"],ni={key:0,class:"sve-ht-page-template"},ai={key:0,class:"sve-ht-page-template__text"},si={class:"sve-ht-page-template__note"},ri={key:1,class:"sve-ht-empty"},ii={key:2,class:"sve-ht-empty"},li={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},di={key:0,class:"sve-ht-empty"},ci={key:0,class:"sve-ht-empty"},hi=["data-sve-ht-under-main"],ui={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},vi={key:0,class:"sve-ht-empty"},pi=["data-sve-ht-under-main"],fi=["data-dim"],mi={key:0,class:"sve-ht-empty"},gi={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},ki={key:0,class:"sve-ht-empty"},yi={key:4,"data-sve-ht-branch":"","data-sve-ht-cat":"component"},bi={__name:"HtmlTreeList",setup(e){const o=ce(()=>Uo(t.query)),n=ce(()=>kr(t.rows,o.value)),a=ce(()=>n.value.rows),r=ce(()=>o.value?t.sections.filter(S=>Pt(S.row,o.value)||S.current&&S.ready&&a.value.length>0):t.sections);function i(S){return!!S&&(!o.value||Pt(S,o.value))}function l(S){const D=t.frame?.kind;return t.inComponent||(D==="header"||D==="footer")&&D!==S}const c=ce(()=>t.frame?.kind==="header"||t.frame?.kind==="footer"),g=ce(()=>!!t.frame&&["header","main","footer"].some(S=>i(t.frame[S]))),m=ce(()=>!!t.frame&&(t.frame.kind==="main"||i(t.frame.main))),k=ce(()=>!!o.value&&!r.value.length&&!a.value.length&&!g.value);function u(S){return!!o.value&&!n.value.hits.has(S.path)}function C(S){const D={"data-sve-ht-sec-uid":S.uid};return S.current&&(D["data-sve-ht-branch"]="",D["data-sve-ht-cat"]=S.row?.cat||"layout"),t.sectionDrop&&t.sectionDrop.uid===S.uid&&(D["data-sve-ht-drop"]=t.sectionDrop.place),D}return(S,D)=>(v(),p("div",Te({class:"sve-ht-root","data-sve-ht-look":s(t).layers?"tags":s(t).look,"data-sve-ht-layers":s(t).layers?"":null,style:s(t).familyStyle},s(t).dragging?{"data-sve-ht-dragging":""}:{}),[s(t).pageTemplate?(v(),p("div",ni,[s(t).pageTemplate.text?(v(),p("p",ai,L(s(t).pageTemplate.text),1)):_("",!0),$("p",si,L(s(t).pageTemplate.note),1),s(t).pageTemplate.canOpen?(v(),p("button",{key:1,type:"button",class:"sve-ht-page-template__open",onClick:D[0]||(D[0]=H=>s(t).pageTemplate.onOpen(H.currentTarget))},L(s(t).pageTemplate.openLabel),1)):_("",!0)])):!s(t).rows.length&&!s(t).sections.length&&!s(t).frame?(v(),p("div",ri,L(s(t).emptyText),1)):k.value?(v(),p("div",ii,L(s(t).searchEmpty),1)):_("",!0),s(t).frame||s(t).sections.length?(v(),p(M,{key:3},[s(t).frame?(v(),p(M,{key:0},[s(t).frame.kind==="header"?(v(),p("div",li,[(v(!0),p(M,null,A(a.value,H=>(v(),q(G,{key:H.id,row:H,dim:u(H)},null,8,["row","dim"]))),128)),s(t).rows.length?_("",!0):(v(),p("div",di,L(s(t).emptyText),1))])):!c.value&&i(s(t).frame.header)?(v(),q(G,{key:1,row:s(t).frame.header,dim:l("header")},null,8,["row","dim"])):_("",!0)],64)):_("",!0),c.value?_("",!0):(v(),p("div",Cn(Te({key:1},s(t).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[s(t).frame?.kind==="main"?(v(),p(M,{key:0},[(v(!0),p(M,null,A(a.value,H=>(v(),q(G,{key:H.id,row:H,dim:u(H)},null,8,["row","dim"]))),128)),s(t).rows.length?_("",!0):(v(),p("div",ci,L(s(t).emptyText),1))],64)):s(t).frame&&i(s(t).frame.main)?(v(),q(G,{key:1,row:s(t).frame.main,dim:l("main")},null,8,["row","dim"])):_("",!0),s(t).frame?.kind==="template"?Xe((v(),p("div",{key:2,"data-sve-ht-frame-body":"","data-sve-ht-under-main":m.value?"":null},[$("div",ui,[(v(!0),p(M,null,A(a.value,H=>(v(),q(G,{key:H.id,row:H,dim:u(H)},null,8,["row","dim"]))),128)),s(t).rows.length?_("",!0):(v(),p("div",vi,L(s(t).emptyText),1))])],8,hi)),[[io,!s(t).mainShut]]):_("",!0),s(t).sections.length||s(t).frame?Xe((v(),p("div",{key:3,"data-sve-ht-frame-body":"","data-sve-ht-under-main":m.value?"":null},[s(t).frame?.template&&i(s(t).frame.template)?(v(),q(G,{key:0,row:s(t).frame.template,dim:l("template")},null,8,["row","dim"])):_("",!0),s(t).frame&&!s(t).frame.template&&!s(t).sections.length&&!o.value?(v(),p("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":l("")?"":void 0},L(s(t).frameEmptyText),9,fi)):_("",!0),(v(!0),p(M,null,A(r.value,H=>(v(),p("div",Te({key:H.uid},{ref_for:!0},C(H)),[H.ready?(v(),p(M,{key:0},[(v(!0),p(M,null,A(a.value,te=>(v(),q(G,{key:te.id,row:te,dim:u(te)},null,8,["row","dim"]))),128)),s(t).rows.length?_("",!0):(v(),p("div",mi,L(s(t).emptyText),1))],64)):(v(),q(G,{key:1,row:H.row,dim:l("")},null,8,["row","dim"]))],16))),128))],8,pi)),[[io,!s(t).frame||!s(t).mainShut]]):_("",!0)],16)),s(t).frame?(v(),p(M,{key:2},[s(t).frame.kind==="footer"?(v(),p("div",gi,[(v(!0),p(M,null,A(a.value,H=>(v(),q(G,{key:H.id,row:H,dim:u(H)},null,8,["row","dim"]))),128)),s(t).rows.length?_("",!0):(v(),p("div",ki,L(s(t).emptyText),1))])):!c.value&&i(s(t).frame.footer)?(v(),q(G,{key:1,row:s(t).frame.footer,dim:l("footer")},null,8,["row","dim"])):_("",!0)],64)):_("",!0)],64)):s(t).inComponent&&s(t).rows.length?(v(),p("div",yi,[(v(!0),p(M,null,A(a.value,H=>(v(),q(G,{key:H.id,row:H,dim:u(H)},null,8,["row","dim"]))),128))])):s(t).rows.length?(v(!0),p(M,{key:5},A(a.value,H=>(v(),q(G,{key:H.id,row:H,dim:u(H)},null,8,["row","dim"]))),128)):_("",!0)],16,oi))}},Tt=ct(bi,[["__scopeId","data-v-d0376715"]]);let xt=null;function Ti(e){return xt||(xt=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(o=>o.ok?o.json():{pages:[]}).then(o=>Array.isArray(o.pages)?o.pages:[]).catch(()=>[])),xt}let We=null;function wt(){We?.dismiss(),We=null}function xi(e,o,n){wt();const a=o?.getBoundingClientRect?.(),r={x:a?a.left:0,y:a?a.bottom+4:0};Ti(e).then(i=>{const l=i.length?i.map(c=>({label:c.title||c.url,onPick:()=>{wt(),n(c.url)}})):[{label:f(e,"component_props_pages_none"),onPick:null}];wt(),We=Be(e.document,Ne,{items:l,x:r.x,y:r.y,onClose:()=>{We=null}})})}const qo="sve-html-tree-labels";function Yo(){try{const e=globalThis.localStorage?.getItem(qo);if(!e)return{};const o=JSON.parse(e);return o&&typeof o=="object"?o:{}}catch{return{}}}function wi(e){try{globalThis.localStorage?.setItem(qo,JSON.stringify(e))}catch{}}function zo(e){return String(e||"_")}function Xo(e){const o=Yo()[zo(e)];return o&&typeof o=="object"?{...o}:{}}function _i(e,o,n){const a=n?.[o];return typeof a=="string"&&a.trim()?a.replace(/\s+/g," ").trim():String(e||"").trim()}function Si(e,o,n,a){if(!o)return;const r=zo(e),i=Yo(),l={...i[r]||{}},c=String(n||"").replace(/\s+/g," ").trim(),g=String(a||"").trim();!c||c===g?delete l[o]:l[o]=c,Object.keys(l).length?i[r]=l:delete i[r],wi(i)}const He=(e,o)=>String(e||"").split(/\s+/).includes(o);function Ci(e,o="",n=null,a=""){if(!e)return"";if(e.kind==="component")return"component";if(e.kind==="antlers")return e.antlers==="loop"?"loop":"if";const r=String(e.tag||"").toLowerCase();return n&&go(n,a)?"column":r==="section"?"section":r==="div"?He(o,"wrapper")?"container":go(e,o)?"columns":He(o,"grid")?"grid":He(o,"flex")?"flex":"div":/^h[1-6]$/.test(r)?"heading":r==="a"?He(o,"btn")?"button":"link":{p:"text",img:"image",video:"video",ul:"list",ol:"list",hr:"divider"}[r]||"tag"}function go(e,o){const n=e?.children||[];return String(e?.tag||"").toLowerCase()==="div"&&He(o,"grid")&&/(^|\s)grid-cols-/.test(String(o||""))&&n.length>0&&n.every(a=>String(a.tag||"").toLowerCase()==="div"&&!a.kind)}const Y=ba("sve-call-values"),Oe=new Set;let ko=null;const Li="__sve-html-tree-style";function Ei(e,o,n){if(o||n)return!1;const a=String(x("dock:chrome-kind")||"");if(a==="header"||a==="footer")return!1;const r=Lo(e);return!!r&&r!=="create"&&$n(e)!==Mn(e)}function Go(e){return{sectionLoops:Pn(e),sectionsLabel:f(e,"html_tree_sections_slot")}}function Hi(e,o){const n={entry:o,text:"",note:f(e,"html_tree_page_template_note"),openLabel:f(e,"html_tree_open_template"),canOpen:!1,onOpen:null};return Do(e,{entry:o}).then(a=>{!a||t.pageTemplate?.entry!==o||(t.pageTemplate={...t.pageTemplate,text:f(e,"html_tree_page_template",{name:a.name}),canOpen:!!a.open,onOpen:a.open?r=>na(e,r,a.open):null})}),n}function Pi(e,o){const n=o.replace(/^view:/,"");if(!n||x("dock:current-type")!==o){t.usedBy=null,t.templateSections=[];return}t.usedBy?.view!==n&&(t.usedBy=null,Do(e,{view:n}).then(a=>{if(!a||x("dock:current-type")!==o)return;const r=a.everything?[{name:f(e,"html_tree_used_by_everything"),kind:"everything",url:null}]:a.used_by.map(i=>({...i,...$i(e,i)}));t.templateSections=Array.isArray(a.sections_fields)?a.sections_fields:[],t.usedBy={view:n,label:f(e,"html_tree_used_by"),items:r,empty:r.length?"":f(e,"html_tree_used_by_nobody"),hint:r.length?f(e,"html_tree_used_by_hint",{list:r.map(i=>i.name).join(", ")}):""}}))}function $i(e,o){if(!o.url)return{openLabel:"",onOpen:null};const n=f(e,"html_tree_used_by_open",{name:o.name});return o.kind==="page"?{openLabel:n,onOpen:a=>la(e,a,da(e,o.url))}:{openLabel:n,onOpen:a=>ca(e,{anchor:a,url:o.url,subtitle:o.name})}}const j=new Set;let $t="",be=!1,_t=null,he=!0,U="",me=0,Wo="";const ge=new Map,$e=new Set,Mt=new Map,Ze=new Map;let K="",Zo=!1,F=null,Je=null,qe="",Qe="",et=0,It=null,we=[],fe=null,Me=null,tt=null,ot=null,Rt=null,ke=!1,se=null,Fe=null,Ie=null,nt=null,at=null,Ot=null,pe=null;function z(e){return e.getElementById(Ge)}function Mi(e){Ln(e,Li,`
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
      ${ho("light")}
      /* How much of a row's own colour its pick takes: a wash, not a fill.
         The row mixes it in below — a mix written up here would read
         --sve-ht-c on the list, where no family is set. */
      --sve-ht-pick-mix: 11%;
      --sve-ht-pick-hover-mix: 18%;
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${ho("dark")}
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

    /* ===== The Figma look: the tags view ==================================================
       Figma's layers list, in the Build panel's own colours and type
       (BuildPanel.vue, the --bm-* values: the dock's greys, Inter at
       0.75rem, the editor's blue). This is the tags view — the one that
       had the box around the open section. The switch in the tree's top
       bar (HTML_TREE_LAYERS_KEY) puts data-sve-ht-layers on the list and
       takes every rule here off again: the layers look below is untouched,
       and HtmlTreeRow draws the row's text the other way round there.
       - One grey under the list, the panel's text on it. No box around the
         open section, no guide lines; the indent alone says what belongs
         to what, 0.75rem a level, as Figma steps.
       - Every row runs the full width of the list, 1.75rem high; a hover is
         a quiet band, the picked row the editor's blue — no bar at its edge.
       - The row reads as Figma's: the mark in its family colour, then a
         name in the panel's sans — Build's word for the element or the one
         the user gave it (row.display, renderHtmlTree) — and after it, faint
         and in monospace, the tag and the classes (row.detail). The tag is
         still the button that switches the tag; it has only lost its chip.
       The frame body stepped the sections in with its own margin; here it
       hands that level on as --sve-ht-base instead, and a row adds it to its
       depth, so a section's rows still start one level in under main. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) {
      --sve-ht-step: 0.75rem;
      --sve-ht-inset: 0.5rem;
      --sve-ht-ink: #d4d4d4;
      --sve-ht-muted: #9d9d9e;
      --sve-ht-faint: #79797a;
      --sve-ht-hover: rgba(128,128,128,.16);
      --sve-ht-pick: rgba(56,88,233,.28);
      background: #1e1e21;
      color: var(--sve-ht-ink);
      font: 450 0.75rem/1.35 Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-branch] {
      border: 0;
      border-radius: 0;
      padding: 0;
      margin: 0;
      background: none;
      /* No box, so nothing to take back out of the inset: the list's own. */
      --sve-ht-inset: inherit;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-frame-body] {
      margin: 0;
      padding: 0;
      box-shadow: none;
    }
    /* The level under main — only with a main row above to be under. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-frame-body][data-sve-ht-under-main] {
      --sve-ht-base: 1;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-indent] { display: none; }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] {
      margin: 0;
      padding: 0 0.5rem 0 calc(var(--sve-ht-inset) + (var(--sve-ht-depth, 0) + var(--sve-ht-base, 0)) * var(--sve-ht-step));
      min-height: 1.75rem;
      gap: 0.375rem;
      border-radius: 0;
      font: inherit;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] + [data-sve-ht-row] { margin-top: 0; }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-sec] { margin-bottom: 0; }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row]:hover { background: var(--sve-ht-hover); }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-current],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-current]:hover {
      background: var(--sve-ht-pick);
      color: var(--sve-ht-ink);
      box-shadow: none;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row]:focus-visible {
      outline: 1px solid rgba(56,88,233,.55);
      outline-offset: -1px;
    }
    /* A drop line starts where the row's content starts, so a drag still
       shows the level it lands on now that the row itself spans them all. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-drop="before"]::before,
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-drop="after"]::after {
      left: calc(var(--sve-ht-inset) + 0.25rem + (var(--sve-ht-depth, 0) + var(--sve-ht-base, 0)) * var(--sve-ht-step));
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-sec-uid][data-sve-ht-drop="before"]::before,
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-sec-uid][data-sve-ht-drop="after"]::after {
      left: calc(var(--sve-ht-inset) + 0.25rem + var(--sve-ht-base, 0) * var(--sve-ht-step));
    }
    /* The empty slots keep their place: a block's one level under it, and
       main's where the frame body's margin used to put it. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-slot][data-sve-ht-id] {
      margin-left: calc((var(--sve-ht-depth, 0) + var(--sve-ht-base, 0)) * var(--sve-ht-step));
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-frame-slot] {
      margin-left: calc(var(--sve-ht-base, 0) * var(--sve-ht-step) + 0.75rem);
    }
    /* The arrow and the mark, 0.875rem each; the arrow in the muted grey. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-twist],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-twist-gap],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-icon],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-letter] { width: 0.875rem; height: 0.875rem; }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-twist] { color: var(--sve-ht-muted); opacity: 1; }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-twist]:hover { color: var(--sve-ht-ink); }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-twist] svg,
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-icon] svg { width: 0.875rem; height: 0.875rem; }
    /* The text: the name in the panel's sans, then the tag and the classes
       faint and in monospace, with a dot between them. The name gives way
       last; the detail takes what is left and is cut short first. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-text] {
      gap: 0.375rem;
      font: inherit;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-name] {
      flex: 0 1 auto;
      color: var(--sve-ht-ink);
      opacity: 1;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-depth="0"] [data-sve-ht-name] {
      font-weight: 600;
      opacity: 1;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-detail] {
      flex: 1 1 0;
      min-width: 0;
      display: inline-flex;
      align-items: baseline;
      gap: 0.3em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: var(--sve-ht-faint);
      font: 400 0.6875rem/1.35 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-detail] > * + *::before { content: '· '; }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-classes] {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /* The tag, without its chip: faint text in the detail's monospace, the
       family colour kept for the mark alone. Still the button it was. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] [data-sve-ht-tag],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] [data-sve-ht-kind] {
      padding: 0;
      border-radius: 0;
      background: none;
      color: var(--sve-ht-faint);
      opacity: 1;
      font: inherit;
      letter-spacing: 0;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] [data-sve-ht-tag]:hover {
      background: none;
      color: var(--sve-ht-ink);
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-rename] { font: inherit; }
    /* The row's icons, Figma's size. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-eye] svg,
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-fields] svg,
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-dup] svg,
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-lock] svg,
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-alpine] svg,
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-del] svg { width: 0.75rem; height: 0.75rem; }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-video] svg { width: 0.875rem; height: 0.875rem; }

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
  `)}function X(){const e=x("dock:html");return typeof e=="string"?e:""}function Jo(e){return!!x("dock:is-open",e)}function Se(e,{save:o=!1,unlock:n=!1}={}){return Gt()||x("dock:set-html",n?{html:e,unlock:!0}:e)!==!0?!1:(o&&x("dock:save-now"),!0)}function St(e){const o=x("dock:component-exit-state")||{};if(t.exitOpen=!!o.open,!o.open){t.onExit=null;return}t.exitName=o.name||"",t.exitLabel=f(e,"component_exit"),t.exitTitle=f(e,o.back?"component_exit_back":"component_exit_close"),t.onExit=()=>{x("dock:exit-component"),I(e)}}const De=[];let Ct=!1;function Lt(e,o){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(o,{timeout:2e3});return}e.setTimeout(o,200)}function Ii(e,o){for(const n of o){const a=n.type;!a||ge.has(a)||$e.has(a)||De.includes(a)||De.push(a)}Ut.htmlTreePrefetchArmed&&Qo(e)}function Fl(e){Ut.htmlTreePrefetchArmed=!0,Qo(e)}function Qo(e){if(Ct||!De.length)return;Ct=!0;const o=()=>{const n=De.shift();if(!n){Ct=!1;return}if(ge.has(n)||$e.has(n)){Lt(e,o);return}$e.add(n),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(n)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(a=>a.ok?a.json():null).then(a=>{if(typeof a?.html=="string"){ge.set(n,a.html);const r=Ze.get(n);Ze.delete(n),r&&r!==en(e,n)&&I(e)}}).catch(()=>{}).finally(()=>{$e.delete(n),Lt(e,o)})};Lt(e,o)}function Gt(){return!!K}function en(e,o){return tn(o)||In(e,o)||"section"}function tn(e){const o=ge.get(e);if(!o)return"";const n=Mt.get(e);if(n&&n.html===o)return n.tag;const a=Wt(ht(o))?.tag||"";return Mt.set(e,{html:o,tag:a}),a}function Ke(e,o){const n=lt(e)||"page_sections",a=[];for(const r of Vt(o)||[]){if(r.name===oa||r.name===pa)continue;const i=jt(r.values),l=i&&typeof i=="object"?i[n]:null;if(Array.isArray(l)){l.forEach(c=>{if(!c||typeof c!="object"||Array.isArray(c)||typeof c.type!="string")return;const g=[c._visual_id,c.id,c._id].filter(S=>typeof S=="string"&&S!=="");if(!g.length)return;const m=Fo(e,c),k=typeof c._sve_label=="string"?c._sve_label.trim():"",u=en(e,m);tn(m)||Ze.set(m,u);const C=Xo(m)[`0:${u}`];a.push({uid:g[0],ids:g,type:m,tag:u,label:k||(typeof C=="string"&&C.trim()?C.trim():"")||dt(e,m)?.display||Re(m)||m,svg:No(u,yo(u),null).svg||xe.section,cat:Ro(u,yo(u)),enabled:c.enabled!==!1,static:Kn(e,m)})});break}}return a}function Ri(e,o,n){if(!n.length)return"";const a=x("dock:current-type")||"",r=x("dock:current-uid"),i=!!x("dock:component-exit-state")?.open;if(r){const l=Ae(r,o),c=n.find(g=>g.ids.some(m=>l.includes(m)));if(c&&(i||c.type===a))return c.uid}return n.find(l=>l.type===a)?.uid||""}function Oi(e,o,n){const a=x("dock:component-exit-state");if(a?.open)return Re(a.name)||a.name||"";if(n)return o.find(i=>i.uid===n)?.label||"";const r=x("dock:current-type")||"";return String(r).startsWith("view:")?"":dt(e,r)?.display||Re(r)||""}function ut(e,o,n,a,r){const i=n.find(l=>l.uid===a);i&&a!==r&&(j.clear(),F=null,he=!1,Z(),Ve(),U=a,Wo=X(),K=ge.get(i.type)||"",K&&(F=Dt(ht(K))||null),Zo=(x("dock:current-type")||"")===i.type,e.clearTimeout(me),me=e.setTimeout(()=>{U="",be=!1,I(e)},4e3),I(e),ia(e,i.uid,"tree"),ue({source:ee,type:Q.SVE_ACTIVATE,ids:i.ids},e),e.setTimeout(()=>I(e),0))}function Ft(e,o){if(!o)return!1;for(const n of e||[])if(n.id===o||Ft(n.children,o))return!0;return!1}function Dt(e){return Wt(e)?.id||""}function Wt(e){for(const o of e||[]){if(on(o))return o;const n=Wt(o.children);if(n)return n}return null}function on(e){return!e.kind||e.kind==="component"}function yo(e){return e==="component"?"component":""}function Fi(e,o){const n=o===0||e.path===Qe;return j.has(e.path)?n:!n}function Di(e){const o=new Set,n=(a,r)=>{for(const i of a)i.children.length&&Fi(i,r)&&o.add(i.id),n(i.children,r+1)};return n(e,0),o}function I(e){const o=e.document,a=z(o)?.querySelector("[data-sve-html-tree-list]");if(!a)return;Mi(o),ka(e);const r=X();K&&K===r&&(K=""),x("dock:chrome-kind")&&(K="");const i=K||r,l=ht(i,Go(e));we=l,Qe="";const c=x("dock:current-type")||"",g=Xo(c),m=Hn(e,o),u=!!(x("dock:component-exit-state")||{}).open;c&&r&&!K&&ge.set(c,r);const C=Ke(e,o);Ii(e,C);const S=Ri(e,o,C);if(Ei(e,m,u)){const h=Lo(e);we=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!1,t.layoutFile=!1,t.usedBy=null,t.emptyText="",t.pageTemplate?.entry!==h&&(t.pageTemplate=Hi(e,h)),t.onRefresh=()=>I(e),t.onSection=null,St(e),Pe(a,Tt),Et(e,[]);return}t.pageTemplate=null,Pi(e,String(x("dock:collection-view")||""));const D=String(x("dock:chrome-kind")||"");if(Qn(e),m&&!C.length&&!D){we=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,t.layoutFile=!1,t.emptyText=f(e,"html_tree_page_empty"),t.canEdit=!x("dock:is-locked"),t.look=uo(e),t.onRefresh=()=>I(e),t.onSection=null,St(e),Pe(a,Tt),Et(e,[]);return}t.pageBuilder=m;const H=`${c}|${S}`;let te=!1;H!==$t&&($t=H,j.clear(),_t!==null&&i!==_t?te=!0:be=i),(te||be!==!1&&i!==be)&&(be=!1,j.clear(),F=Dt(l)||null),_t=i,U&&(U===S||!C.length)&&(Zo||i!==Wo)&&(e.clearTimeout(me),U="",be=!1,Ft(l,F)||(j.clear(),F=Dt(l)||null));const oe=C.some(h=>h.uid===U)?U:"",y=he?"":oe||S,d=!!(oe||S),b=d||u?"":String(x("dock:chrome-kind")||""),P=m&&(!c&&!d||b==="main"&&x("dock:on-empty-page")===!0),O=P||b==="template"?"":b;t.layoutFile=O==="main",O!=="main"&&(qe="");const V=O==="main"?bo(l,"main"):null,B=V?st(l,h=>h.tag==="body"&&Ft(h.children,V.id)):null;Qe=B?B.path:"",V&&(ze((B||V).path),qe!==H&&(ze(V.path),j.add(V.path)));const Ce=O==="header"||O==="footer"?st(l,h=>i.slice(h.from,h.openTo).includes(`data-sve-chrome="${O}"`)):null,re=Ce||(O==="header"||O==="footer"?bo(l,O):null);re&&ze(re.path);const N=P||!(O==="main"?!!V:O==="header"||O==="footer"?!!re:!0)?[]:Ba(l,t.query?new Set:Di(l));!i.trim()&&!Jo(o)?t.emptyText=f(e,"html_tree_need_dock"):t.emptyText=f(e,"html_tree_empty"),t.slotText=f(e,"antlers_drop_here"),t.dataTitle=f(e,"data_vars_title"),t.pageTitle=f(e,"component_props_page"),t.renameTitle=f(e,"html_tree_rename"),t.tagTitle=f(e,"tw_tag"),t.hideTitle=f(e,"html_tree_hide"),t.showTitle=f(e,"html_tree_show"),t.duplicateTitle=f(e,"html_tree_duplicate"),t.deleteTitle=f(e,"html_tree_delete"),t.videoHoldTitle=f(e,"html_tree_video_hold"),t.videoPlayTitle=f(e,"html_tree_video_play"),t.alpineTitle=f(e,"html_tree_alpine_state"),t.lockedTitle=f(e,"html_tree_locked"),t.searchEmpty=f(e,"html_tree_search_empty"),t.canEdit=!x("dock:is-locked"),t.look=uo(e),t.onQuery=()=>I(e),St(e),t.inComponent=u,t.onSelect=h=>{const w=N.find(R=>R.id===h);w&&Bo(e,w.path)||it(e,h,N)},t.onTwist=h=>{const w=N.find(R=>R.id===h)?.path;w&&(j.has(w)?j.delete(w):j.add(w),I(e))},t.onTagChange=(h,w)=>{const R=t.rows.find(je=>je.id===w);R&&!Gt()&&!Zt(e,R)&&ya(e,h.currentTarget,R)},t.onRename=h=>Yi(e,h),t.onRenameCommit=()=>To(e,!0),t.onRenameCancel=()=>To(e,!1),t.onHide=h=>Ji(e,h),t.onLock=h=>Zi(e,h),t.canUnlock=an(e),t.lockTitle=f(e,"html_tree_lock"),t.unlockTitle=f(e,"html_tree_unlock"),t.lockedByTitle=f(e,"html_tree_locked_by_developer"),t.onVideoHold=h=>Xi(e,h),t.onAlpineState=(h,w)=>Wi(e,h,w),t.onDuplicate=h=>Qi(e,h),t.onDelete=h=>tl(e,h),t.onPointerDown=(h,w)=>sl(e,h,w),t.onSectionPointerDown=(h,w)=>ll(e,h,w),t.onSectionHover=h=>e.dispatchEvent(new e.CustomEvent("sve-lite-hover",{detail:{uid:h}})),t.onContext=(h,w)=>nl(e,h,w),t.onInspectCommit=h=>fl(e,h),t.onPropValue=(h,w,R)=>So(e,h,w,R),t.onPropPage=(h,w)=>xi(e,h,R=>So(e,w,R,!1)),t.onLoopKind=h=>ml(e,h),t.onAddBranch=h=>gl(e,h),t.onLoopSortField=h=>{const w=rt();if(!w)return;const R=pe?.id===w.id?pe.dir:"";pe=null,ae(e,ja(w,h,R))},t.onLoopSortDir=h=>{const w=rt();if(!w)return;const R=Ua(w,h);if(R.draft){pe={id:w.id,dir:R.draft},Nt(e,w);return}pe=null,ae(e,R.edit)},t.onLoopDepth=h=>ae(e,za(h)),t.onLoopIncludeHome=h=>ae(e,Xa(h)),t.onLoopLimit=h=>ae(e,Ga(h)),t.onLoopOffset=h=>ae(e,Wa(h)),t.onPropHost=h=>h?Y.mount(h):Y.unmount(),t.onInspectData=(h,w)=>{x("dock:data-menu",{anchor:h,at:N.find(R=>R.id===F)?.from,onPick:R=>w(String(R?.var||"").trim())})};const eo=N.find(on)?.id,pt=u?"":Oi(e,C,y),ie=y&&!u?C.find(h=>h.uid===y):null,vn=Mo(e,String(x("dock:current-type")||""));let pn=0;const fn=Gi(Ce?[Ce]:l,i),mn=Io(e,String(c)),ne=O==="header"||O==="footer"?O:"",ve=re?re.id:"",le=V&&N.find(h=>h.id===V.id)||null,to=B&&N.find(h=>h.id===B.id)||null,de=to||le||ve&&N.find(h=>h.id===ve)||null,oo=de?ji(N,de):-1;if(de&&!N.slice(N.indexOf(de),oo).some(h=>h.id===F)&&(F=de.id),t.selectFrom){const h=N.find(w=>w.from===t.selectFrom.at&&(!w.kind||w.kind==="sections"));h?(F=h.id,t.selectFrom=null):--t.selectFrom.left<=0&&(t.selectFrom=null)}const no=t.layoutFile?Vi(e):null,gn=Ai(i,l);t.rows=N.map(h=>{const w=no&&h.kind==="component"&&no.get(h.src)||"",R=h.tag==="body"&&!h.kind,je=w?{svg:xe[w]}:No(h.tag,h.kind,h.antlers),mt=h.tag==="video"&&!h.kind?pn++:-1,Le=fn.get(h.id),kn=Le?mn[Le.nth]||{}:{},gt=Le?Le.booleans.map(({key:Ee,value:so})=>({key:Ee,file:so,value:kn[Ee]??so})):[],Ue=h.id===eo&&pt?pt:h.klass,ye=h.id===eo,kt=w?f(e,`html_tree_frame_${w}`):ne&&h.id===ve?f(e,`html_tree_frame_${ne}`):h===le?f(e,"html_tree_frame_main"):ye&&ie?Ue:_i(Ue,h.path,g),yn=!!w||ne&&h.id===ve||h===le||ye&&(!!ie||!!pt)||!!h.kind&&h.kind!=="antlers"||kt!==Ue,ao=gn.get(h.id);return{...h,tag:w||h.tag,frameCall:w,fixed:!!w||R,base:Ue,name:kt,display:yn?kt:Bi(e,ao,h.tag),detail:h.kind==="antlers"?h.klass:ao.classes,current:h.id===F,letter:je.letter||"",svg:ne&&h.id===ve?xe[ne]:h===le?xe.main:ye&&ie?ie.svg:je.svg||"",frame:ne&&h.id===ve?ne:h===le?"main":"",cat:ne&&h.id===ve?ne:h===le||R?"main":w||Ro(h.tag,h.kind,h.antlers),componentRoot:ye&&u,sectionRoot:ye&&ie?ie.uid:"",fieldsIcon:!!(ye&&ie&&!ie.static),videoNth:mt,videoHeld:mt>=0&&vn.has(mt),alpineNth:gt.length?Le.nth:-1,alpineKeys:gt,alpineSet:gt.some(Ee=>Ee.value!==Ee.file)}}),ea(e),ta(e);const ft=[];for(const h of t.rows)ft.length=h.depth,h.guides=ft.slice(),ft[h.depth]=h.cat;if(de){const h=N.indexOf(de),w=de.depth;t.rows=t.rows.slice(h,oo).map(R=>({...R,depth:R.depth-w,guides:R.guides.slice(w)})),le&&qe!==H&&(qe=H,e.setTimeout(()=>it(e,le.id,N),0))}t.sections=m&&!u&&(d||O||P)?C.map(h=>{const w=!!y&&h.uid===y;return{...h,current:w,ready:w&&(!oe||!!K),row:{id:`sec:${h.uid}`,section:h.uid,tag:h.tag,name:h.label,display:h.label,detail:"",kind:"",svg:h.svg,cat:h.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:w,hidden:!h.enabled}}}):[],t.frame=Ki(e,C,d,u,O,!1,!!to),t.frameEmptyText=f(e,"html_tree_frame_no_sections"),Ni(e,O),t.onSection=h=>{ke||(At(e),ut(e,o,C,h,y))},t.onRefresh=()=>I(e),Nt(e,t.rows.find(h=>h.id===F)),Pe(a,Tt),Et(e,l)}function Ai(e,o){const n=new Map,a=i=>i.openTo!=null&&!i.kind&&Ma(e,i.from,i.openTo)?.value||"",r=(i,l,c)=>{for(const g of i){const m=a(g),k=Ci(g,m,l,c),u=k==="column"?i.filter(C=>!C.kind).indexOf(g)+1:0;n.set(g.id,{kind:k,index:u,classes:m}),r(g.children,g,m)}};return r(o,null,""),n}function Bi(e,o,n){return o.kind==="column"?f(e,"el_column",{n:o.index}):o.kind==="tag"?n:f(e,`el_${o.kind}`)}function Ni(e,o){t.frameOpenTitle=f(e,"html_tree_frame_open"),t.frameMainTitle=f(e,"html_tree_frame_main_open"),t.frameTemplateTitle=f(e,"html_tree_frame_template_open"),t.frameFieldsTitle=f(e,"html_tree_frame_fields"),t.onFrame=n=>{o===n?Ui(e,n):Bt(e,n)},t.onFrameEnter=n=>Bt(e,n),t.onFrameFields=n=>qn(e,sa(e,n),f(e,`html_tree_frame_${n}`)),t.onFrameTwist=()=>{t.mainShut=!t.mainShut}}function Ki(e,o,n,a,r,i=!1,l=!1){if(!r&&!i||l)return null;const c=k=>{const u=f(e,`html_tree_frame_${k}`);return{id:`frame:${k}`,frame:k,synthetic:!0,tag:k,name:u,display:u,detail:"",kind:"",svg:xe[k]||"",cat:k,letter:"",depth:0,hasChildren:k==="main"&&(o.length>0||r==="template"),shut:k!=="main",current:!1,hidden:!1}},g={kind:r,header:c("header"),main:c("main"),footer:c("footer"),template:null},m=r&&r!=="template"?String(x("dock:collection-view")||""):"";if(m){const k=dt(e,m)?.display||Re(m.replace(/^view:/,""));g.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:k,display:k,detail:"",kind:"",svg:xe.section,cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}}return g}function bo(e,o){return st(e,n=>n.tag===o)}function st(e,o){for(const n of e||[]){if(!n.kind&&o(n))return n;const a=st(n.children,o);if(a)return a}return null}function Vi(e){const o=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},n=new Map;for(const a of["header","footer"]){const r=xa(o[a]?.type);r&&n.set(r,a)}return n}function ji(e,o){let n=e.indexOf(o)+1;for(;n<e.length&&e[n].depth>o.depth;)n+=1;return n}function Ui(e,o){const n=Ao(e);(o==="main"||o==="template"?n?.querySelector("main"):n?.querySelector(`[data-sve-chrome="${o}"]`))?.scrollIntoView({behavior:"smooth",block:"start"})}function At(e){const o=String(x("dock:chrome-open",e.document)||"");return o!=="header"&&o!=="footer"?!1:(ra(e),ue({source:ee,type:Q.SVE_FORCE_EXIT_CHROME},e),!0)}function qi(e){e.clearTimeout(me),U="",K="",j.clear(),F=null,he=!1,Z(),Ve()}function Bt(e,o){if(e.document,String(x("dock:chrome-kind")||"")===o)return;if(qi(e),o==="main"){At(e),x("dock:open-file",fa);return}if(o==="template"){const i=String(x("dock:collection-view")||"");i&&(At(e),x("dock:open-file",i));return}if(o!=="header"&&o!=="footer")return;const n=Ao(e)?.querySelector(`[data-sve-chrome="${o}"]`);n?(n.scrollIntoView({block:"nearest"}),n.dispatchEvent(new n.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:ee,type:Q.OPEN_CHROME,kind:o},e.location.origin);const a=Date.now(),r=async()=>{if(String(x("dock:chrome-kind")||"")!==o){Date.now()-a<3e4&&e.setTimeout(r,250);return}await(x("dock:load-settled")||null),un(e)};e.setTimeout(r,250)}function Et(e,o){z(e.document)&&nn(e,o)}function nn(e,o){const n=o[0],a=!!x("dock:component-src"),r=a?"":x("dock:current-uid")||"";ue({source:ee,type:Q.SVE_HTML_PICK,on:!0,uid:r,uids:r?Ae(r,e.document):[],all:a,tag:n?.tag||"",klass:n?.klass||"",nodes:Va(o)},e)}function ze(e){if(!e)return;const o=(n,a)=>{for(const r of n||[]){if(r.path===e)return!0;if(o(r.children,a+1))return a===0||r.path===Qe?j.delete(r.path):j.add(r.path),!0}return!1};o(we,0)}function Yi(e,o){if(ke)return;const n=t.rows.find(a=>a.id===o);Zt(e,n)||!n||n.kind||(F=o,t.rows.forEach(a=>{a.current=a.id===o}),t.editingId=o,t.draft=n.name,e.setTimeout(()=>{const a=z(e.document)?.querySelector("[data-sve-ht-rename]");a?.focus(),a?.select()},0))}function To(e,o){const n=t.editingId;if(!n)return;const a=t.rows.find(r=>r.id===n);t.editingId=null,o&&a&&(a.sectionRoot?zi(e,a.sectionRoot,t.draft):Si(x("dock:current-type")||"",a.path,t.draft,a.base||a.klass)),t.draft="",I(e)}function zi(e,o,n){const a=lt(e)||"page_sections",r=String(n||"").replace(/\s+/g," ").trim();for(const i of Vt(e.document)||[]){const l=jt(i.values),c=l&&typeof l=="object"?l[a]:null;if(!Array.isArray(c))continue;const g=c.findIndex(C=>C&&typeof C=="object"&&[C._visual_id,C.id,C._id].includes(o));if(g===-1)continue;const m=Fo(e,c[g]),k=dt(e,m)?.display||Re(m)||m,u=JSON.parse(JSON.stringify(c));return u[g]={...u[g]},!r||r===k?delete u[g]._sve_label:u[g]._sve_label=r,i.setFieldValue(a,u),!0}return!1}function Xi(e,o){const n=t.rows.find(c=>c.id===o);if(!n||!(n.videoNth>=0))return;const a=String(x("dock:current-type")||""),r=Mo(e,a),i=!r.has(n.videoNth);i?r.add(n.videoNth):r.delete(n.videoNth);const l=String(x("dock:current-uid")||"");aa(e,a,r),ue({source:ee,type:Q.SVE_VIDEO_HOLD,uid:l,uids:l?Ae(l,e.document):[],nth:n.videoNth,on:i},e),I(e)}function Gi(e,o){const n=new Map;let a=0;const r=i=>{for(const l of i){if(l.hidden)continue;const c=l.kind?null:Qa(o.slice(l.from,l.openTo));c!==null&&n.set(l.id,{nth:a++,booleans:ts(c)}),r(l.children||[])}};return r(e),n}function Wi(e,o,n){const a=t.rows.find(i=>i.id===n);if(!a||!(a.alpineNth>=0))return;if(a.alpineKeys.length===1){xo(e,a,a.alpineKeys[0]);return}const r=o.currentTarget.getBoundingClientRect();Z(),se=Be(e.document,Ne,{items:a.alpineKeys.map(i=>({label:i.key,icon:i.value?rn:ln,onPick:()=>{Z(),xo(e,a,i)}})),x:Math.round(r.left),y:Math.round(r.bottom+4),onClose:()=>{se=null}})}function xo(e,o,n){const a=String(x("dock:current-type")||""),r=Io(e,a),i=!n.value,l=i!==n.file,c={...r[o.alpineNth]||{}};l?c[n.key]=i:delete c[n.key],Object.keys(c).length?r[o.alpineNth]=c:delete r[o.alpineNth];const g=ha(String(x("dock:chrome-kind")||"")),m=g?"":String(x("dock:current-uid")||"");ua(e,a,r),ue({source:ee,type:Q.SVE_ALPINE_STATE,uid:m,uids:m?Ae(m,e.document):[],chrome:g,nth:o.alpineNth,key:n.key,value:i,on:l},e),I(e)}function Zt(e,o){return!o||!(o.locked||o.lockedIn)?!1:(e.Statamic?.$toast?.error(f(e,"html_tree_locked_element")),!0)}function an(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function Zi(e,o){const n=t.rows.find(a=>a.id===o);if(!(!n||n.lockedIn||x("dock:is-locked"))){if(!n.locked){_e(e,o,Ia,{lockAction:!0});return}if(!an(e)){e.Statamic?.$toast?.error(f(e,"html_tree_unlock_denied"));return}qt(e,{titleKey:"html_tree_unlock_title",bodyKey:"html_tree_unlock_body",confirmKey:"html_tree_unlock_confirm"},()=>_e(e,o,Ra,{lockAction:!0,unlock:!0}))}}function Jt(e){return!!t.rows.find(o=>o.id===e)?.fixed}function Ji(e,o){Jt(o)||_e(e,o,Oa)}function Qi(e,o){if(Jt(o))return;const n=t.rows.find(a=>a.id===o)?.sectionRoot;if(n){e.postMessage({source:ee,type:Q.DUPLICATE_ROW,uid:n},e.location.origin);return}_e(e,o,Fa)}function sn(e,o){qt(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const n=e.document;va({uid:o},n,e)})}function el(e,o,n){U===n&&(e.clearTimeout(me),U="",K=""),F=null,he=!1,$t="";const a=Ke(e,o),r=a.find(i=>i.uid!==n)||a[0];r?ut(e,o,a,r.uid,""):(K="",t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,I(e)),e.setTimeout(()=>{z(e.document)&&I(e)},0)}Oo("row:removed",({uid:e,parentPath:o,doc:n,win:a})=>{o!==lt(a)||!z(a.document)||el(a,n,e)});function tl(e,o){if(Jt(o))return;const n=t.sections?.find(r=>r.row?.id===o),a=n?n.row?.section||n.uid:t.rows.find(r=>r.id===o)?.sectionRoot;if(a){sn(e,a);return}if(t.rows.find(r=>r.id===o)?.kind==="sections"){qt(e,{titleKey:"html_tree_sections_remove_title",bodyKey:"html_tree_sections_remove_body",confirmKey:"html_tree_sections_remove_confirm"},()=>_e(e,o,vo));return}_e(e,o,vo)}function _e(e,o,n,{lockAction:a=!1,unlock:r=!1}={}){if(x("dock:is-locked"))return;const i=X(),l=t.rows.find(g=>g.id===o);if(!l||!a&&Zt(e,l))return;const c=n(i,l);c!==i&&Se(c,{unlock:r})}function Z(){se?.dismiss(),se=null}const rn='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',ln='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>';function dn(e,o){const n=t.sections?.find(g=>g.uid===o),a=n?.type||"";if(!a||!Eo(e))return[];const r=n.label||a,i=Vn(e,a),l=()=>e.Statamic?.$toast?.error(f(e,"section_update_failed")),c=[{label:f(e,"static_section_insertable"),icon:i?ln:rn,onPick:()=>{Z(),lo(e,{handle:a,hidden:!i}).then(()=>{e.Statamic?.$toast?.success(f(e,i?"section_shown_to_editors":"section_hidden_from_editors",{name:r})),co(e)}).catch(l)}}];return n.static&&c.push({label:f(e,"section_add_fields"),onPick:()=>{Z(),lo(e,{handle:a,fields:!0}).then(()=>{e.Statamic?.$toast?.success(f(e,"section_fields_added",{name:r})),co(e),I(e),Ho(e,a)}).catch(l)}}),c}function ol(e,o,n){const a=n.row?.section||n.uid;a&&(se=Be(e.document,Ne,{items:[...dn(e,a),{label:f(e,"html_tree_remove_section"),danger:!0,onPick:()=>{Z(),sn(e,a)}}],x:o.clientX,y:o.clientY,onClose:()=>{se=null}}))}function nl(e,o,n){Z();const a=t.sections?.find(c=>c.row?.id===n);if(a){ol(e,o,a);return}const r=t.rows.find(c=>c.id===n);if(!r)return;it(e,n,t.rows);const i={x:o.clientX,y:o.clientY},l=c=>{c.length&&(se?.dismiss(),se=Be(e.document,Ne,{items:c,x:i.x,y:i.y,onClose:()=>{se=null}}))};if(r.frameCall){l([{label:f(e,"html_tree_frame_edit",{frame:f(e,`chrome_${r.frameCall}`)}),onPick:()=>{Z(),Bt(e,r.frameCall)}}]);return}if(r.kind==="component"){al(e,r,l);return}r.kind==="slot"||r.kind==="sections"||r.locked||r.lockedIn||t.canEdit&&(r.componentRoot||l([...r.sectionRoot?dn(e,r.sectionRoot):[],{label:f(e,"component_make"),onPick:()=>{Z(),Ta(e,r,{onDone:()=>I(e),onError:c=>{e.alert(c?.status===409?f(e,"component_exists"):f(e,"component_failed"))}})}}]))}const wo=(e,o)=>{Z(),x("dock:open-template",o)};function al(e,o,n){if(!Na(o.src)){n([{label:f(e,"component_open_named",{name:Ka(o.src)||o.src}),onPick:()=>wo(e,`view:partials/${o.src}`)}]);return}n([{label:f(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(o.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(a=>a.ok?a.json():{items:[]}).then(a=>{const r=Array.isArray(a.items)?a.items:[];n(r.length?r.map(i=>({label:f(e,"component_open_named",{name:i.label}),onPick:()=>wo(e,i.type)})):[{label:f(e,"component_none"),onPick:null}])}).catch(()=>n([{label:f(e,"component_none"),onPick:null}]))}function sl(e,o,n){if(o.button!==0||x("dock:is-locked")||t.editingId)return;const a=t.rows.find(l=>l.id===n);if(a&&(a.locked||a.lockedIn)||o.target?.closest?.("button, input"))return;Ve(),fe=n,Me={x:o.clientX,y:o.clientY},tt=o.currentTarget,ot=o.pointerId;const r=l=>rl(e,l),i=l=>il(e,l);Rt=()=>{e.document.removeEventListener("pointermove",r,!0),e.document.removeEventListener("pointerup",i,!0),e.document.removeEventListener("pointercancel",i,!0),Rt=null},e.document.addEventListener("pointermove",r,!0),e.document.addEventListener("pointerup",i,!0),e.document.addEventListener("pointercancel",i,!0)}function rl(e,o){if(!fe||!Me)return;const n=o.clientX-Me.x,a=o.clientY-Me.y;if(!t.dragging&&n*n+a*a<25)return;if(!t.dragging){t.dragging=!0;try{tt?.setPointerCapture?.(ot)}catch{}}o.preventDefault();const r=e.document.elementFromPoint(o.clientX,o.clientY),i=r?.closest?.("[data-sve-ht-slot]");if(i){const u=i.getAttribute("data-sve-ht-id");if(u&&u!==fe){t.dropId=u,t.dropPlace="inside";return}}const l=r?.closest?.("[data-sve-ht-row]"),c=l?.getAttribute("data-sve-ht-id");if(!c||c===fe){t.dropId=null,t.dropPlace=null;return}const g=t.rows.find(u=>u.id===c),m=t.rows.find(u=>u.id===fe);if(!g||g.lockedIn||m&&g.path.startsWith(`${m.path}/`)){t.dropId=null,t.dropPlace=null;return}const k=l.getBoundingClientRect();t.dropId=c,t.dropPlace=Pa(o.clientY-k.top,k.height,!Vo(g.tag)&&!Ko(g)&&!g.locked)}function il(e,o){const n=fe,a=t.dropId,r=t.dropPlace||"after",i=t.dragging;if(Ve(),i&&(ke=!0,e.setTimeout(()=>{ke=!1},0)),!i||x("dock:is-locked")||!n||!a||n===a)return;o?.preventDefault?.();const l=X(),c=$a(l,we,n,a,r);c!==l&&Se(c)}function Ve(){try{tt?.releasePointerCapture?.(ot)}catch{}Rt?.(),fe=null,Me=null,tt=null,ot=null,t.dragging=!1,t.dropId=null,t.dropPlace=null}function ll(e,o,n){if(o.button!==0||!n||t.editingId||o.target?.closest?.("button, input"))return;cn(),Fe=n,Ie={x:o.clientX,y:o.clientY},nt=o.currentTarget,at=o.pointerId;const a=i=>dl(e,i),r=i=>cl(e,i);Ot=()=>{e.document.removeEventListener("pointermove",a,!0),e.document.removeEventListener("pointerup",r,!0),e.document.removeEventListener("pointercancel",r,!0),Ot=null},e.document.addEventListener("pointermove",a,!0),e.document.addEventListener("pointerup",r,!0),e.document.addEventListener("pointercancel",r,!0)}function dl(e,o){if(!Fe||!Ie)return;const n=o.clientX-Ie.x,a=o.clientY-Ie.y;if(!t.dragging&&n*n+a*a<25)return;if(!t.dragging){t.dragging=!0;try{nt?.setPointerCapture?.(at)}catch{}}o.preventDefault();const i=e.document.elementFromPoint(o.clientX,o.clientY)?.closest?.("[data-sve-ht-sec-uid]"),l=i?.getAttribute("data-sve-ht-sec-uid")||"";if(!l||l===Fe){t.sectionDrop=null;return}const c=i.getBoundingClientRect();t.sectionDrop={uid:l,place:o.clientY-c.top<c.height/2?"before":"after"}}function cl(e,o){const n=Fe,a=t.sectionDrop,r=t.dragging;cn(),r&&(ke=!0,e.setTimeout(()=>{ke=!1},0)),!(!r||!n||!a?.uid||a.uid===n)&&(o?.preventDefault?.(),hl(e,n,a.uid,a.place))}function cn(){try{nt?.releasePointerCapture?.(at)}catch{}Ot?.(),Fe=null,Ie=null,nt=null,at=null,t.dragging=!1,t.sectionDrop=null}function hl(e,o,n,a){const r=lt(e)||"page_sections";for(const i of Vt(e.document)||[]){const l=jt(i.values),c=l&&typeof l=="object"?l[r]:null;if(!Array.isArray(c))continue;const g=C=>c.findIndex(S=>S&&typeof S=="object"&&[S._visual_id,S.id,S._id].includes(C)),m=g(o),k=g(n);if(m===-1||k===-1||m===k)return!1;let u=a==="before"?k:k+1;return m<u&&(u-=1),u===m?!1:(e.postMessage({source:ee,type:Q.MOVE,uid:o,toIndex:u},e.location.origin),e.setTimeout(()=>I(e),60),!0)}return!1}function Nt(e,o){if(o?.kind==="component"){ul(e,o);return}if(W.callOpen&&(W.callOpen=!1,W.callStore=null,Y.forget(),zt(e)),o?.kind!=="antlers"){t.inspect=null;return}const n=o.id;if(o.tag==="else"){t.inspect={key:n,title:f(e,"antlers_condition"),mode:"note",note:f(e,"antlers_else_note")};return}if(o.antlers==="loop"){t.inspect=Ya(e,o,{key:n,draft:pe?.id===o.id?pe.dir:""});return}t.inspect={key:n,title:f(e,"antlers_condition"),mode:"condition",value:o.expr||"",placeholder:f(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:f(e,"antlers_add_elseif")},{id:"else",label:f(e,"antlers_add_else")}]}}function ul(e,o){if(!_a(e)){t.inspect=null;return}if(!o.src)return;const n=o.id;if(t.inspect={key:n,title:f(e,"component_props_values"),mode:"note",note:f(e,"code_dock_loading")},Sa()){const a={},r={},i=new Map;for(const[l,c]of Ca(X().slice(o.from,o.to))){const g=La(l);g&&(l!==g||!i.has(g))&&i.set(g,c)}for(const[l,c]of i)c.bound?r[l]=c.value:a[l]=c.value;ko!==n&&(ko=n,Oe.clear());for(const l of Oe)l in r||(r[l]="");t.inspect=null,W.callOpen=!0,W.title=W.title||f(e,"component_props"),W.callTitle=o.klass||o.name||o.src,W.callStore=Y.ui,Y.ui.canBind=!0,Y.ui.dataTitle=f(e,"data_vars_title"),Y.ui.exprPlaceholder=f(e,"component_props_expr"),Y.ui.onToggleBind=(l,c)=>pl(e,l,c),Y.ui.onExpr=(l,c)=>_o(e,l,c),Y.ui.onPickData=(l,c)=>x("dock:data-menu",{anchor:c,at:o.from,onPick:g=>_o(e,l,String(g?.var||"").trim())}),Y.load(e,{key:`${o.src}::${n}`,src:o.src,params:a,bindings:r,readOnly:x("dock:is-locked")===!0}),Y.watch(e,{src:o.src,write:l=>vl(e,l,r)}),zt(e);return}Ea(e,o.src).then(a=>{if(t.inspect?.key===n){if(!a.length){t.inspect={key:n,title:f(e,"component_props_values"),mode:"note",note:f(e,"component_props_values_none")};return}t.inspect={key:n,title:f(e,"component_props_values"),mode:"props",inheritLabel:f(e,"component_props_inherit"),rows:Ha(a,X().slice(o.from,o.to))}}})}function vl(e,o,n={}){const a=t.rows.find(l=>l.id===F);if(a?.kind!=="component"||x("dock:is-locked"))return;let r=X(),i=a.to;for(const[l,c]of Object.entries(o||{})){if(l in n)continue;const g=r.length,m=Xt(r,{from:a.from,to:i},l,c);m!==r&&(i+=m.length-g,r=m)}r!==X()&&(Se(r,{save:!0}),I(e))}function pl(e,o,n){n?Oe.add(o):Oe.delete(o),hn(e,o,"",n),I(e)}function _o(e,o,n){Oe.add(o),hn(e,o,n,!0),I(e)}function hn(e,o,n,a){const r=t.rows.find(c=>c.id===F);if(r?.kind!=="component"||x("dock:is-locked"))return;const i=X(),l=Xt(i,r,o,n,{bound:a});l!==i&&Se(l,{save:!0})}function rt(){const e=t.rows.find(o=>o.id===F);return e?.kind==="antlers"&&!x("dock:is-locked")?e:null}function ae(e,o){const n=rt();if(!n)return;const a=X(),r=o(a,n);r!==a&&(Se(r),I(e))}function So(e,o,n,a){const r=t.rows.find(c=>c.id===F);if(r?.kind!=="component"||x("dock:is-locked"))return;const i=X(),l=Xt(i,r,o,n,{bound:a});l!==i&&(Se(l,{save:!0}),I(e))}function fl(e,o){ae(e,(n,a)=>a.antlers==="loop"?Za(a,o)(n,a):Da(n,a,o))}function ml(e,o){const n=rt();if(!n||n.antlers!=="loop")return;const a=qa(e,n,o);a&&ae(e,a)}function gl(e,o){ae(e,(n,a)=>Aa(n,a,o))}function kl(e,o){if(!e||!o||Ko(o)||Vo(o.tag))return null;const n=wa(e,o);if(n<o.openTo)return null;const a=e.lastIndexOf(`
`,n-1)+1;return e.slice(a,n).trim()===""&&a>o.openTo?a-1:n}function it(e,o,n){if(ke)return;const a=(n||t.rows).find(r=>r.id===o);a&&(F=o,t.rows.forEach(r=>{r.current=r.id===o}),Nt(e,a),!Gt()&&(x("dock:reveal-html",{from:a.from,to:a.to,caret:kl(X(),a)}),x("dock:tw-follow"),ue({source:ee,type:Q.SVE_HTML_PICK_FOCUS,path:a.path,src:a.kind==="component"&&a.src||""},e)))}function yl(e,o){if(!o)return"";const n=[],a=(r,i)=>{for(const l of r||[]){const c=i||l.path===e;l.kind==="component"&&l.src===o&&n.push({path:l.path,inside:c}),a(l.children,c)}};return a(we,!1),(n.find(r=>r.inside)||n[0])?.path||""}function bl(e,o){if(!o||!z(e.document))return;he=!1,I(e),ze(o),I(e);const n=t.rows.find(a=>a.path===o);n&&(it(e,n.id,t.rows),e.setTimeout(()=>{z(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function Kt(e){if(Je)return;const o=()=>{t.editingId||t.dragging||(e.clearTimeout(et),et=e.setTimeout(()=>{z(e.document)&&I(e)},80))},n=()=>{if(o(),x("dock:on-empty-page")===!0){const a=Ke(e,e.document);a.length===1&&ut(e,e.document,a,a[0].uid,"")}};Je=Oo("dock:html-changed",o),e.document.addEventListener("sve-page-structure",n),It=()=>{e.document.removeEventListener("sve-page-structure",n)}}function Tl(e){Je?.(),Je=null,It?.(),It=null,e?.clearTimeout?.(et),et=0}function Qt(e){const o=z(e.document);if(ue({source:ee,type:Q.SVE_HTML_PICK,on:!1},e),Tl(e),Y.forget(),W.callOpen=!1,W.callStore=null,zt(e),Ve(),Z(),ga(e),F=null,t.inspect=null,t.editingId=null,t.draft="",t.sections=[],t.pageBuilder=!1,t.layoutFile=!1,U="",e?.clearTimeout?.(me),!o){Ht(e);return}o.remove(),Ut.headerTab==="html_tree"&&Xn(e,null),Gn(e),Po(e),$o(e),Ht(e)}function Dl(e,o){o.querySelector("[data-sve-html-tree-list]")||(o.id=Ge,Pe(o,jo,{title:f(e,"html_tree")}),o.querySelector("[data-sve-close]")?.addEventListener("click",()=>Qt(e)))}function Al(e){Kt(e),I(e)}function un(e){const o=e.document;if(!En(e,"html_tree"))return;if(z(o)){Kt(e),I(e);return}if(!Jo(o))return;he=!0,j.clear(),Wn(e,[Ge]);const n=o.createElement("div");n.id=Ge,n.style.cssText=Zn,Pe(n,jo,{title:f(e,"html_tree")}),n.querySelector("[data-sve-close]")?.addEventListener("click",()=>Qt(e)),Jn(e,n),Po(e),$o(e),Ht(e),Kt(e),I(e)}function Bl(e){if(z(e.document)){Qt(e);return}un(e)}Yt("html-tree:open-section",e=>{const o=window,n=o.document,a=Ke(o,n),r=a.find(i=>i.uid===e||i.ids.includes(e));return r?(ut(o,n,a,r.uid,""),{uid:r.uid,ids:r.ids}):null});Yt("html-tree:from-preview",({path:e,src:o,uid:n}={})=>{if(!Bo(window,e)){if(!e){xl(window,n);return}bl(window,yl(e,o)||e)}});function xl(e,o){if(!o||!z(e.document))return;const n=Ke(e,e.document),a=Ae(o,e.document),r=n.find(i=>i.ids.some(l=>a.includes(l)));r&&(he&&(he=!1,j.clear(),F=null),U&&U!==r.uid&&(e.clearTimeout(me),U="",K=""),!x("dock:load-settled")&&I(e))}Yt("html-tree:arm-pick",e=>{const o=window;return e?(nn(o,ht(X(),Go(o))),!0):(z(o.document)||ue({source:ee,type:Q.SVE_HTML_PICK,on:!1},o),!0)});function Nl(){ge.clear(),$e.clear(),Mt.clear(),Ze.clear(),De.length=0}export{Li as HTML_TREE_STYLE_ID,Fl as armHtmlTreePrefetch,Nl as clearHtmlTreeTemplates,Z as closeHtmlTreeMenu,Qt as closeHtmlTreePanel,Mi as ensureHtmlTreeStyles,Dl as fillHtmlTreePane,F as htmlTreeActiveId,z as htmlTreePanel,et as htmlTreeTimer,Je as htmlTreeUnhook,un as openHtmlTreePanel,I as renderHtmlTree,Al as showHtmlTreePane,Tl as stopWatchHtmlTreeDock,Bl as toggleHtmlTreePanel,Kt as watchHtmlTreeDock};
