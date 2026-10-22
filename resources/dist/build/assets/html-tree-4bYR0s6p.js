const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-BqsL3ULf.js","./tw-candidates-CSP7aVNi.js"])))=>i.map(i=>d[i]);
import{r as Ye,R as wo,u as a,o as p,c as m,a as I,t as P,F as A,i as N,m as $n,f as C,n as So,w,aa as oe,s as f,e as Co,L as Y,N as Lo,a8 as Eo,a2 as Po,ad as Se,j as Ht,ab as Ho,$ as he,aB as $o,v as hn,_ as Mo,x as Io,A as Oo,V as Ao,az as Ro,W as Mn,aC as Do,B as ct,p as Ut,q as zt,U as Fe,X as Fo,aD as Bo,aE as No}from"./addon-DLVbXB-g.js";import{c as In,a as Ko,o as jo,b as Vo,d as qo,T as Uo,i as zo,r as Yo,e as Xo,f as Wo,u as un,l as pn}from"./section-create-KreWS6Io.js";import{canEditFields as Go,currentSetHandle as Zo,openFieldsetOverlay as On,openGlobalFieldsOverlay as Jo}from"./section-fields-Chz3wEv9.js";import{ap as t,aq as Qo,ar as es,b as T,s as Yt,j as ue,Z as $t,ad as ts,R as ns,ab as An,ac as Rn,M as fn,u as Ae,W as os,S as ss,U as as,as as rs,at as mn,au as Dn,av as Fn,q as Bn,aw as is,ax as ls,o as Nn,ay as ds,B as Kn,a0 as ht,t as ut,az as jn,aA as cs,aB as Xt,aC as hs,aD as us,aE as ps,a6 as fs,aF as ms,aG as vs,aH as gs,aI as ks,aJ as ys,X as Vn,a8 as bs,i as Wt}from"./lp-cluster-CQYl4vPn.js";import{H as Ge,e as Ts,a as _s}from"./ids-C1vpT4U6.js";import{_ as pt,o as $e,N as xs}from"./ChoiceDialog-BCNhxB2u.js";import{M as te,S as ne}from"./protocol-YXBURS-N.js";import{y as X,C as ws,z as Ke,A as Ss,t as Cs,B as Gt,n as Ls,v as Es,D as qn,k as Ps,E as Un,H as Ce,F as Hs,G as Zt,c as $s,I as Ms,a as Is,J as Os,K as As,L as Rs,M as Ds,N as Fs,O as Bs,P as Ns,Q as xe,R as Ks,S as js,T as Vs,U as qs,V as vn,W as Xe,X as Us,Y as zs}from"./antlers-edit-D7FJnnZH.js";import{x as je,n as gn,N as Ze,K as zn,L as Yn,a as Ys}from"./css-scope-sgvLGydo.js";import{b as Xs}from"./html-pick-align-CLq5l-p4.js";import"./FieldsetOverlay-Bky82qKg.js";import"./ai-text-icon-B7uCWIwa.js";const bt=/\s*([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/y,Ws=/^\s*(?:([A-Za-z_$][\w$]*)|'([^'\\]*)'|"([^"\\]*)")\s*:\s*(true|false)\s*$/;function Gs(e){const n=String(e||"").replace(/\{\{[\s\S]*?\}\}/g,r=>" ".repeat(r.length)),s=n.match(/^<[a-zA-Z][\w:-]*/);if(!s)return null;let o=s[0].length;for(;o<n.length;){bt.lastIndex=o;const r=bt.exec(n);if(!r){o+=1;continue}if(r[1].toLowerCase()==="x-data")return r[2]??r[3]??r[4]??"";o=bt.lastIndex}return null}function Zs(e,n){const s=e[n];for(let o=n+1;o<e.length;o+=1)if(e[o]==="\\")o+=1;else if(e[o]===s)return o;return e.length-1}function Js(e){const n=String(e||""),s=n.search(/\S/);if(s===-1||n[s]!=="{")return[];const o=new Map;let r=0,l="";const i=()=>{const d=l.match(Ws);d&&o.set(d[1]??d[2]??d[3],d[4]==="true"),l=""};for(let d=s;d<n.length;d+=1){const k=n[d];if(k==='"'||k==="'"||k==="`"){const v=Zs(n,d);l+=n.slice(d,v+1),d=v;continue}if(k==="/"&&n[d+1]==="/"){const v=n.indexOf(`
`,d);d=v===-1?n.length:v-1;continue}if(k==="/"&&n[d+1]==="*"){const v=n.indexOf("*/",d+2);d=v===-1?n.length:v+1;continue}if(k==="{"||k==="["||k==="("){if(r+=1,r===1)continue}else if(k==="}"||k==="]"||k===")"){if(r-=1,r===0)break}else if(k===","&&r===1){i();continue}l+=k}return i(),[...o].map(([d,k])=>({key:d,value:k}))}const Qs={key:0,class:"sve-ht-inspect"},ea={class:"sve-ht-inspect__head"},ta={key:0,class:"sve-ht-inspect__note"},na={key:2,class:"sve-ht-inspect__props"},oa={class:"sve-ht-inspect__proplabel"},sa={key:0},aa=["value","disabled","onChange"],ra={value:""},ia=["value"],la=["value"],da=["value","placeholder","onChange"],ca=["title","disabled","onClick"],ha=["title","disabled","onClick"],ua={key:0,class:"sve-ht-inspect__seg"},pa=["data-active","disabled","onClick"],fa=["value","disabled"],ma={key:0,value:""},va=["value"],ga=["value","disabled"],ka=["value"],ya={key:3,class:"sve-ht-inspect__box"},ba=["value","placeholder","disabled","onKeydown"],Ta=["title","disabled"],_a={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},xa=["value","disabled"],wa=["value"],Sa={key:0,class:"sve-ht-inspect__tick"},Ca=["checked","disabled"],La={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Ea=["value","disabled"],Pa=["value"],Ha={key:0,class:"sve-ht-inspect__box sve-ht-inspect__box--gap"},$a=["value","placeholder","disabled"],Ma=["title","disabled"],Ia={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Oa=["value","placeholder","disabled"],Aa={class:"sve-ht-inspect__head sve-ht-inspect__head--sub"},Ra=["value","placeholder","disabled"],Da={key:6,class:"sve-ht-inspect__add"},Fa=["disabled","onClick"],Tt='<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>',Ba='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',Na={__name:"HtmlTreeInspector",setup(e){const n=Ye(null);wo(n,v=>t.onPropHost?.(v||null));const s=Ye(null),o=Ye(null);function r(v){t.onInspectCommit?.(v.target.value)}function l(v,b,u){!v||!b||(v.value=b,v.focus(),v.setSelectionRange(b.length,b.length),u(b))}function i(v,b){t.onInspectData?.(v.currentTarget,u=>t.onPropValue?.(b.handle,u,!0))}function d(v){t.onInspectData?.(v.currentTarget,b=>l(s.value,b,u=>t.onInspectCommit?.(u)))}function k(v){t.onInspectData?.(v.currentTarget,b=>l(o.value,b,u=>t.onLoopSortField?.(u)))}return(v,b)=>a(t).inspect?(p(),m("div",Qs,[I("div",ea,P(a(t).inspect.title),1),a(t).inspect.mode==="note"?(p(),m("div",ta,P(a(t).inspect.note),1)):a(t).inspect.mode==="statamic"?(p(),m("div",{key:1,ref_key:"propHost",ref:n,class:"sve-ht-inspect__form"},null,512)):a(t).inspect.mode==="props"?(p(),m("div",na,[(p(!0),m(A,null,N(a(t).inspect.rows,u=>(p(),m("label",{key:u.handle,class:"sve-ht-inspect__prop"},[I("span",oa,[$n(P(u.label)+" ",1),u.bound?(p(),m("em",sa,":")):C("",!0)]),I("span",{class:So(["sve-ht-inspect__box",{"sve-ht-inspect__box--pick":u.type==="select"||u.type==="link"}])},[u.type==="select"&&!u.bound?(p(),m("select",{key:0,value:u.value,disabled:!a(t).canEdit,onChange:_=>a(t).onPropValue?.(u.handle,_.target.value,!1)},[I("option",ra,P(u.placeholder||a(t).inspect.inheritLabel),1),u.value&&!u.options.includes(u.value)?(p(),m("option",{key:0,value:u.value},P(u.value),9,ia)):C("",!0),(p(!0),m(A,null,N(u.options,_=>(p(),m("option",{key:_,value:_},P(_),9,la))),128))],40,aa)):(p(),m("input",{key:1,type:"text",value:u.value,placeholder:u.placeholder||a(t).inspect.inheritLabel,onChange:_=>a(t).onPropValue?.(u.handle,_.target.value,u.bound)},null,40,da)),u.type==="link"?(p(),m("button",{key:2,type:"button","data-sve-ht-data":"",title:a(t).pageTitle,disabled:!a(t).canEdit,onClick:_=>a(t).onPropPage?.(_.currentTarget,u.handle),innerHTML:Ba},null,8,ca)):C("",!0),I("button",{type:"button","data-sve-ht-data":"",title:a(t).dataTitle,disabled:!a(t).canEdit,onClick:_=>i(_,u),innerHTML:Tt},null,8,ha)],2)]))),128))])):(p(),m(A,{key:3},[a(t).inspect.mode==="loop"?(p(),m("div",ua,[(p(!0),m(A,null,N(a(t).inspect.kinds,u=>(p(),m("button",{key:u.id,type:"button","data-active":u.id===a(t).inspect.loopKind?"":void 0,disabled:!a(t).canEdit,onClick:_=>a(t).onLoopKind?.(u.id)},P(u.label),9,pa))),128))])):C("",!0),a(t).inspect.mode==="loop"&&a(t).inspect.loopKind==="collection"?(p(),m("select",{key:a(t).inspect.key+":"+a(t).inspect.value,value:a(t).inspect.value,disabled:!a(t).canEdit,onChange:r},[a(t).inspect.value?C("",!0):(p(),m("option",ma,P(a(t).inspect.placeholder),1)),(p(!0),m(A,null,N(a(t).inspect.collections,u=>(p(),m("option",{key:u.handle,value:u.handle},P(u.title),9,va))),128))],40,fa)):a(t).inspect.mode==="loop"&&a(t).inspect.loopKind==="nav"?(p(),m("select",{key:a(t).inspect.key+":nav:"+a(t).inspect.value,value:a(t).inspect.value,disabled:!a(t).canEdit,onChange:r},[(p(!0),m(A,null,N(a(t).inspect.navs,u=>(p(),m("option",{key:u.handle,value:u.handle},P(u.title),9,ka))),128))],40,ga)):(p(),m("div",ya,[(p(),m("input",{ref_key:"field",ref:s,key:a(t).inspect.key,type:"text",value:a(t).inspect.value,placeholder:a(t).inspect.placeholder,disabled:!a(t).canEdit,spellcheck:"false",onKeydown:[b[0]||(b[0]=w(()=>{},["stop"])),oe(w(r,["prevent"]),["enter"])],onBlur:r},null,40,ba)),I("button",{type:"button","data-sve-ht-data":"",title:a(t).dataTitle,disabled:!a(t).canEdit,innerHTML:Tt,onMousedown:b[1]||(b[1]=w(()=>{},["prevent"])),onClick:w(d,["stop","prevent"])},null,40,Ta)])),a(t).inspect.nav?(p(),m(A,{key:4},[I("div",_a,P(a(t).inspect.nav.depthTitle),1),(p(),m("select",{key:a(t).inspect.key+":depth:"+a(t).inspect.nav.depth,value:a(t).inspect.nav.depth,disabled:!a(t).canEdit,onChange:b[2]||(b[2]=u=>a(t).onLoopDepth?.(u.target.value))},[(p(!0),m(A,null,N(a(t).inspect.nav.depths,u=>(p(),m("option",{key:u.id,value:u.id},P(u.label),9,wa))),128))],40,xa)),a(t).inspect.nav.homeAsked?(p(),m("label",Sa,[I("input",{type:"checkbox",checked:a(t).inspect.nav.includeHome,disabled:!a(t).canEdit,onChange:b[3]||(b[3]=u=>a(t).onLoopIncludeHome?.(u.target.checked))},null,40,Ca),I("span",null,P(a(t).inspect.nav.homeLabel),1)])):C("",!0)],64)):C("",!0),a(t).inspect.sort?(p(),m(A,{key:5},[I("div",La,P(a(t).inspect.sort.title),1),(p(),m("select",{key:a(t).inspect.key+":dir:"+a(t).inspect.sort.dir,value:a(t).inspect.sort.dir,disabled:!a(t).canEdit,onChange:b[4]||(b[4]=u=>a(t).onLoopSortDir?.(u.target.value))},[(p(!0),m(A,null,N(a(t).inspect.sort.dirs,u=>(p(),m("option",{key:u.id,value:u.id},P(u.label),9,Pa))),128))],40,Ea)),a(t).inspect.sort.needsField?(p(),m("div",Ha,[(p(),m("input",{ref_key:"sortField",ref:o,key:a(t).inspect.key+":field",type:"text",value:a(t).inspect.sort.field,placeholder:a(t).inspect.sort.placeholder,disabled:!a(t).canEdit,spellcheck:"false",onKeydown:[b[5]||(b[5]=w(()=>{},["stop"])),b[6]||(b[6]=oe(w(u=>a(t).onLoopSortField?.(u.target.value),["prevent"]),["enter"]))],onBlur:b[7]||(b[7]=u=>a(t).onLoopSortField?.(u.target.value))},null,40,$a)),a(t).inspect.sort.pickable?(p(),m("button",{key:0,type:"button","data-sve-ht-data":"",title:a(t).dataTitle,disabled:!a(t).canEdit,innerHTML:Tt,onMousedown:b[8]||(b[8]=w(()=>{},["prevent"])),onClick:w(k,["stop","prevent"])},null,40,Ma)):C("",!0)])):C("",!0),I("div",Ia,P(a(t).inspect.limit.title),1),(p(),m("input",{key:a(t).inspect.key+":limit",type:"number",min:"1",value:a(t).inspect.limit.value,placeholder:a(t).inspect.limit.placeholder,disabled:!a(t).canEdit,onKeydown:[b[9]||(b[9]=w(()=>{},["stop"])),b[10]||(b[10]=oe(w(u=>a(t).onLoopLimit?.(u.target.value),["prevent"]),["enter"]))],onBlur:b[11]||(b[11]=u=>a(t).onLoopLimit?.(u.target.value))},null,40,Oa)),I("div",Aa,P(a(t).inspect.offset.title),1),(p(),m("input",{key:a(t).inspect.key+":offset",type:"number",min:"0",value:a(t).inspect.offset.value,placeholder:a(t).inspect.offset.placeholder,disabled:!a(t).canEdit,onKeydown:[b[12]||(b[12]=w(()=>{},["stop"])),b[13]||(b[13]=oe(w(u=>a(t).onLoopOffset?.(u.target.value),["prevent"]),["enter"]))],onBlur:b[14]||(b[14]=u=>a(t).onLoopOffset?.(u.target.value))},null,40,Ra))],64)):C("",!0),a(t).inspect.branches?.length?(p(),m("div",Da,[(p(!0),m(A,null,N(a(t).inspect.branches,u=>(p(),m("button",{key:u.id,type:"button",disabled:!a(t).canEdit,onClick:_=>a(t).onAddBranch?.(u.id)},P(u.label),9,Fa))),128))])):C("",!0)],64))])):C("",!0)}},Ka=pt(Na,[["__scopeId","data-v-7ecb01a5"]]),ja={class:"sve-html-tree"},Va={class:"sve-pane-bar","data-sve-pane-bar":""},qa={"data-sve-right-title":""},Ua={"data-sve-right-actions":""},za=["aria-pressed","title","aria-label"],Ya=["title"],Xa={class:"sve-ht-used-by__label"},Wa={class:"sve-ht-used-by__chips"},Ga=["title","onClick"],Za={key:1,class:"sve-ht-used-by__chip"},Ja={key:0,class:"sve-ht-used-by__empty"},Qa={class:"sve-ht-tools"},er=["title"],tr=["placeholder","aria-label","value"],nr=["aria-label"],or=["title","aria-label"],sr=["title","aria-label"],ar={key:2,class:"sve-tree-exit"},rr=["title"],ir=["title"],lr='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',dr='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',cr='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',hr='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',ur='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/></svg>',pr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',fr={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const n=f(window,"html_tree_search");t.layers=Qo(window);const s=f(window,"html_tree_layers_on"),o=f(window,"html_tree_layers_off");function r(){es(window,!t.layers)}const l=In(window),i=f(window,"section_new"),d=f(window,"html_tree_add_element"),k=f(window,"html_tree_sections_slot"),v=f(window,"html_tree_sections_no_field");function b(){const c=t.templateSections.length?t.templateSections:[Eo(window)],y=new Set(t.rows.filter(L=>L.kind==="sections").map(L=>L.tag));return c.filter(L=>!y.has(L)).map(L=>({tag:`sections:${L}`,label:c.length>1?`${k} · ${L}`:k,noField:!t.templateSections.length}))}const u=Ye(!1),_=f(window,"section_import");function S(){u.value=!1}async function H(c){if(!c)return;await Po(),t.onRefresh?.();const y=T("html-tree:open-section",c);y&&Yo(window,y.ids)}function $(){const c=t.rows.find(y=>y.current&&!y.context&&!y.synthetic)||null;return c?.lockedIn?t.rows.filter(y=>y.locked&&y.from<=c.from&&y.to>=c.to).sort((y,L)=>y.from-L.from)[0]||null:c}function q(c){const y=c.getBoundingClientRect(),L=$();let D=null;const M=(R,pe,Te="")=>()=>{D?.dismiss(),D=null,S();const re=zo(window,R,L,pe);re!==null&&(t.selectFrom={at:re,left:4},Te&&window.Statamic?.$toast?.info?.(Te))};D=$e(document,Ke,{items:[...Uo.map(R=>({label:R,onPick:M(R,`<${R}>`)})),...b().map(R=>({label:R.label,onPick:M(R.tag,R.label,R.noField?v:"")}))],x:Math.round(y.left),y:Math.round(y.bottom+4),onClose:()=>{D=null,S()}})}function Z(c){if(!u.value){if(u.value=!0,!(t.sections.length||t.pageBuilder)){q(c.currentTarget);return}(async()=>{const y=await Ko(window);if(!y){S();return}const L=t.sections.length?t.sections[t.sections.length-1].uid:null,D=M=>{S(),H(M?.uid)};if(y==="static"){jo(window,{afterUid:L,onDone:D,onError:S,onClose:S});return}Vo(window,{afterUid:L,onDone:D,onError:S,onClose:S})})()}}function B(){if(u.value)return;u.value=!0;const c=!!(t.sections.length||t.pageBuilder);qo(window,{intoTemplate:!c,after:c?null:$(),afterUid:c&&t.sections.length?t.sections[t.sections.length-1].uid:null,onDone:y=>{if(S(),c){H(y?.uid);return}Number.isInteger(y?.at)&&(t.selectFrom={at:y.at,left:4})},onError:S,onClose:S})}function g(c){const y=!!t.query;t.query=c,y!==!!c&&t.onQuery?.()}return(c,y)=>(p(),m("div",ja,[I("div",Va,[I("div",qa,P(e.title),1),I("div",Ua,[I("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":a(t).layers?"true":"false",title:a(t).layers?a(o):a(s),"aria-label":a(t).layers?a(o):a(s),innerHTML:lr,onClick:r},null,8,za),y[5]||(y[5]=Co('<button type="button" data-sve-right-pin aria-pressed="false" data-v-9a4a7640></button><button type="button" data-sve-close aria-label="Close" data-v-9a4a7640><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-9a4a7640><path d="M18 6 6 18" data-v-9a4a7640></path><path d="m6 6 12 12" data-v-9a4a7640></path></svg></button>',2))])]),a(t).usedBy?(p(),m("div",{key:0,class:"sve-ht-used-by",title:a(t).usedBy.hint||null},[I("span",Xa,[I("span",{class:"sve-ht-used-by__icon","aria-hidden":"true",innerHTML:ur}),$n(" "+P(a(t).usedBy.label),1)]),I("span",Wa,[(p(!0),m(A,null,N(a(t).usedBy.items,L=>(p(),m(A,{key:L.kind+":"+L.name},[L.onOpen?(p(),m("button",{key:0,type:"button",class:"sve-ht-used-by__chip sve-ht-used-by__chip--open",title:L.openLabel,onClick:D=>L.onOpen(D.currentTarget)},P(L.name),9,Ga)):(p(),m("span",Za,P(L.name),1))],64))),128)),a(t).usedBy.empty?(p(),m("span",Ja,P(a(t).usedBy.empty),1)):C("",!0)])],8,Ya)):C("",!0),I("div",Qa,[I("label",{class:"sve-ht-search",title:a(n)},[I("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:hr}),I("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:a(n),"aria-label":a(n),value:a(t).query,autocomplete:"off",spellcheck:"false",onInput:y[0]||(y[0]=L=>g(L.target.value)),onKeydown:[y[1]||(y[1]=w(()=>{},["stop"])),y[2]||(y[2]=oe(w(L=>g(""),["prevent"]),["escape"]))]},null,40,tr),a(t).query?(p(),m("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":a(n),innerHTML:pr,onClick:y[3]||(y[3]=L=>g(""))},null,8,nr)):C("",!0)],8,er),a(l)&&(a(t).sections.length||a(t).pageBuilder||a(t).rows.length&&!a(t).layoutFile)?(p(),m("button",{key:0,type:"button",class:"sve-ht-new",title:a(t).sections.length||a(t).pageBuilder?a(i):a(d),"aria-label":a(t).sections.length||a(t).pageBuilder?a(i):a(d),innerHTML:dr,onClick:Z},null,8,or)):C("",!0),a(l)&&(a(t).sections.length||a(t).pageBuilder||a(t).rows.length&&!a(t).layoutFile)?(p(),m("button",{key:1,type:"button",class:"sve-ht-import",title:a(_),"aria-label":a(_),innerHTML:cr,onClick:B},null,8,sr)):C("",!0)]),a(X).inSidebar?C("",!0):(p(),Y(ws,{key:1})),y[6]||(y[6]=I("div",{"data-sve-html-tree-list":""},null,-1)),Lo(Ka),a(t).exitOpen&&!a(X).inSidebar?(p(),m("div",ar,[I("span",{class:"sve-tree-exit__name",title:a(t).exitName},P(a(t).exitName),9,rr),I("button",{type:"button",class:"sve-tree-exit__go",title:a(t).exitTitle,onClick:y[4]||(y[4]=L=>a(t).onExit?.())},P(a(t).exitLabel),9,ir)])):C("",!0)]))}},Xn=pt(fr,[["__scopeId","data-v-9a4a7640"]]);function Wn(e){return String(e||"").trim().toLowerCase()}function Mt(e,n){return n?[e.name,e.tag,e.klass,e.label,e.src].filter(s=>typeof s=="string"&&s).join(" ").toLowerCase().includes(n):!0}function mr(e,n){const s=Wn(n);if(!s)return{rows:e,hits:new Set};const o=new Set;for(const i of e)Mt(i,s)&&o.add(i.path);const r=[...o];return{rows:e.filter(i=>o.has(i.path)||r.some(d=>d.startsWith(`${i.path}/`))),hits:o}}const vr=["title"],gr={"data-sve-ht-indent":"","aria-hidden":"true"},kr=["data-sve-ht-cat"],yr={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},br={key:2,"data-sve-ht-letter":""},Tr=["innerHTML"],_r=["title"],xr=["title"],wr={key:1,"data-sve-ht-kind":""},Sr={key:3,"data-sve-ht-name":""},Cr={key:4,"data-sve-ht-actions":""},Lr=["data-on","title","innerHTML"],Er=["title"],Pr={key:5,"data-sve-ht-actions":""},Hr=["data-on","title","innerHTML"],$r=["data-on","title","innerHTML"],Mr=["disabled","title","innerHTML"],Ir=["disabled","title"],Or=["disabled","title"],Ar=["data-on","disabled","title","aria-pressed","innerHTML"],Rr=["disabled","title"],Dr=["data-sve-ht-id"],kn='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',Fr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',Br='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Nr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',Kr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',jr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',Vr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',yn='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6.5" width="20" height="11" rx="5.5"/><circle cx="7.5" cy="12" r="3" fill="currentColor" stroke="none"/></svg>',bn='<svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M7.5 5.5h9a6.5 6.5 0 0 1 0 13h-9a6.5 6.5 0 0 1 0-13ZM16.5 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6Z"/></svg>',qr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',Ur='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-.9"/></svg>',zr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',Yr={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const n=Go(window),s=f(window,"section_fields");function o(){const g=Zo();if(!g){window.Statamic?.$toast?.error(f(window,"section_fields_none"));return}On(window,g)}function r(g){return g.synthetic?g.frame==="main"?t.frameMainTitle:g.frame==="template"?t.frameTemplateTitle:t.frameOpenTitle:g.kind==="component"?g.src?`partial:${g.src}`:g.tag:g.name?`${g.tag} ${g.name}`:g.tag}function l(g){return!!g.section}function i(g){return!!g.frame}function d(g){return g.kind==="slot"}function k(g){return!!g.context}function v(g,c){k(c)||i(c)||d(c)||(l(c)?t.onSectionPointerDown?.(g,c.section):c.sectionRoot?t.onSectionPointerDown?.(g,c.sectionRoot):t.onPointerDown?.(g,c.id))}function b(g){if(g.synthetic){t.onFrame?.(g.frame);return}if(l(g)){t.onSection?.(g.section);return}if(k(g)){t.onContextRow?.(g.id);return}t.onSelect?.(g.id)}function u(g,c){const y={"data-sve-ht-id":g.id};return g.locked&&(y["data-sve-ht-locked"]=""),g.current&&(y["data-sve-ht-current"]=""),g.hidden&&(y["data-sve-ht-hidden"]=""),y["data-sve-ht-cat"]=g.cat||"other",y["data-sve-ht-depth"]=String(g.depth),c&&(y["data-sve-ht-dim"]=""),k(g)&&(y["data-sve-ht-context"]=g.context),l(g)&&(y["data-sve-ht-sec"]=""),i(g)&&(y["data-sve-ht-frame"]=g.frame),!l(g)&&t.dropId===g.id&&t.dropPlace&&(y["data-sve-ht-drop"]=t.dropPlace),y}function _(g){return!!g.fixed}function S(g){return g.kind==="sections"}function H(g){return!!(g.locked||g.lockedIn)}function $(g){return!g.lockedIn&&!_(g)}function q(g){return!_(g)&&!S(g)&&!H(g)&&(!g.hidden||g.wrapFrom!=null)}function Z(g){return!!g.sectionRoot||!!g.section}function B(g){return t.canEdit&&!H(g)||Z(g)}return(g,c)=>(p(),m(A,null,[I("div",Se({"data-sve-ht-row":""},u(e.row,e.dim),{role:"button",tabindex:"0",title:r(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:c[41]||(c[41]=y=>b(e.row)),onDblclick:c[42]||(c[42]=w(y=>e.row.synthetic?a(t).onFrameEnter?.(e.row.frame):i(e.row)||d(e.row)||l(e.row)||k(e.row)?null:a(t).onRename?.(e.row.id),["prevent"])),onKeydown:[c[43]||(c[43]=oe(w(y=>b(e.row),["prevent"]),["enter"])),c[44]||(c[44]=oe(w(y=>b(e.row),["prevent"]),["space"]))],onPointerdown:c[45]||(c[45]=y=>v(y,e.row)),onPointerenter:c[46]||(c[46]=y=>l(e.row)?a(t).onSectionHover?.(e.row.section):null),onContextmenu:c[47]||(c[47]=w(y=>i(e.row)||d(e.row)||l(e.row)||k(e.row)?null:a(t).onContext?.(y,e.row.id),["prevent","stop"]))}),[I("span",gr,[(p(!0),m(A,null,N(e.row.guides||[],(y,L)=>(p(),m("i",{key:L,"data-sve-ht-cat":y},null,8,kr))),128))]),e.row.hasChildren||e.row.emptyBlock?(p(),m("button",Se({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?a(t).mainShut:e.row.shut)?{"data-sve-ht-shut":""}:{},{innerHTML:Fr,onClick:c[0]||(c[0]=w(y=>e.row.synthetic?a(t).onFrameTwist?.():l(e.row)?a(t).onSection?.(e.row.section):a(t).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:c[1]||(c[1]=w(()=>{},["stop"])),onDblclick:c[2]||(c[2]=w(()=>{},["stop"]))}),null,16)):(p(),m("span",yr)),e.row.letter?(p(),m("span",br,P(e.row.letter),1)):(p(),m("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Tr)),I("span",{"data-sve-ht-text":"",title:a(t).renameTitle},[!e.row.kind&&!l(e.row)&&!k(e.row)&&!i(e.row)?(p(),m("button",{key:0,type:"button","data-sve-ht-tag":"",title:a(t).tagTitle,onClick:c[3]||(c[3]=w(()=>{},["stop","prevent"])),onPointerdown:c[4]||(c[4]=w(()=>{},["stop"])),onDblclick:c[5]||(c[5]=w(y=>a(t).onTagChange?.(y,e.row.id),["stop","prevent"]))},P(e.row.tag),41,xr)):(p(),m("span",wr,P(e.row.tag),1)),a(t).editingId===e.row.id&&!l(e.row)?Ht((p(),m("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":c[6]||(c[6]=y=>a(t).draft=y),onMousedown:c[7]||(c[7]=w(()=>{},["stop"])),onPointerdown:c[8]||(c[8]=w(()=>{},["stop"])),onClick:c[9]||(c[9]=w(()=>{},["stop"])),onDblclick:c[10]||(c[10]=w(()=>{},["stop"])),onKeydown:[c[11]||(c[11]=w(()=>{},["stop"])),c[12]||(c[12]=oe(w(y=>a(t).onRenameCommit?.(),["prevent"]),["enter"])),c[13]||(c[13]=oe(w(y=>a(t).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:c[14]||(c[14]=y=>a(t).onRenameCommit?.())},null,544)),[[Ho,a(t).draft]]):(p(),m("span",Sr,P(e.row.name),1))],8,_r),i(e.row)?(p(),m("span",Cr,[e.row.alpineNth>=0?(p(),m("button",{key:0,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:a(t).alpineTitle,innerHTML:e.row.alpineSet?bn:yn,onClick:c[15]||(c[15]=w(y=>a(t).onAlpineState?.(y,e.row.id),["stop","prevent"])),onPointerdown:c[16]||(c[16]=w(()=>{},["stop"])),onDblclick:c[17]||(c[17]=w(()=>{},["stop"]))},null,40,Lr)):C("",!0),e.row.frame!=="main"&&a(n)?(p(),m("button",{key:1,type:"button","data-sve-ht-fields":"",title:a(t).frameFieldsTitle,innerHTML:kn,onClick:c[18]||(c[18]=w(y=>a(t).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:c[19]||(c[19]=w(()=>{},["stop"])),onDblclick:c[20]||(c[20]=w(()=>{},["stop"]))},null,40,Er)):C("",!0)])):!l(e.row)&&!k(e.row)&&!d(e.row)?(p(),m("span",Pr,[e.row.videoNth>=0?(p(),m("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?a(t).videoPlayTitle:a(t).videoHoldTitle,innerHTML:e.row.videoHeld?Vr:jr,onClick:c[21]||(c[21]=w(y=>a(t).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:c[22]||(c[22]=w(()=>{},["stop"])),onDblclick:c[23]||(c[23]=w(()=>{},["stop"]))},null,40,Hr)):C("",!0),e.row.alpineNth>=0?(p(),m("button",{key:1,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:a(t).alpineTitle,innerHTML:e.row.alpineSet?bn:yn,onClick:c[24]||(c[24]=w(y=>a(t).onAlpineState?.(y,e.row.id),["stop","prevent"])),onPointerdown:c[25]||(c[25]=w(()=>{},["stop"])),onDblclick:c[26]||(c[26]=w(()=>{},["stop"]))},null,40,$r)):C("",!0),q(e.row)?(p(),m("button",{key:2,type:"button","data-sve-ht-eye":"",disabled:!a(t).canEdit,title:a(t).canEdit?e.row.hidden?a(t).showTitle:a(t).hideTitle:a(t).lockedTitle,innerHTML:e.row.hidden?Nr:Br,onClick:c[27]||(c[27]=w(y=>a(t).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:c[28]||(c[28]=w(()=>{},["stop"])),onDblclick:c[29]||(c[29]=w(()=>{},["stop"]))},null,40,Mr)):C("",!0),a(n)&&e.row.fieldsIcon?(p(),m("button",{key:3,type:"button","data-sve-ht-fields":"",disabled:!a(t).canEdit,title:a(t).canEdit?a(s):a(t).lockedTitle,innerHTML:kn,onClick:w(o,["stop","prevent"]),onPointerdown:c[30]||(c[30]=w(()=>{},["stop"])),onDblclick:c[31]||(c[31]=w(()=>{},["stop"]))},null,40,Ir)):C("",!0),!_(e.row)&&!S(e.row)?(p(),m("button",{key:4,type:"button","data-sve-ht-dup":"",disabled:!B(e.row),title:B(e.row)?a(t).duplicateTitle:a(t).lockedTitle,innerHTML:Kr,onClick:c[32]||(c[32]=w(y=>a(t).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:c[33]||(c[33]=w(()=>{},["stop"])),onDblclick:c[34]||(c[34]=w(()=>{},["stop"]))},null,40,Or)):C("",!0),$(e.row)?(p(),m("button",{key:5,type:"button","data-sve-ht-lock":"","data-on":e.row.locked?"":null,disabled:!a(t).canEdit||e.row.locked&&!a(t).canUnlock,title:e.row.locked?a(t).canUnlock?a(t).unlockTitle:a(t).lockedByTitle:a(t).lockTitle,"aria-pressed":e.row.locked?"true":"false",innerHTML:e.row.locked?qr:Ur,onClick:c[35]||(c[35]=w(y=>a(t).onLock?.(e.row.id),["stop","prevent"])),onPointerdown:c[36]||(c[36]=w(()=>{},["stop"])),onDblclick:c[37]||(c[37]=w(()=>{},["stop"]))},null,40,Ar)):C("",!0),_(e.row)?C("",!0):(p(),m("button",{key:6,type:"button","data-sve-ht-del":"",disabled:!B(e.row),title:B(e.row)?a(t).deleteTitle:a(t).lockedTitle,innerHTML:zr,onClick:c[38]||(c[38]=w(y=>a(t).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:c[39]||(c[39]=w(()=>{},["stop"])),onDblclick:c[40]||(c[40]=w(()=>{},["stop"]))},null,40,Rr))])):C("",!0)],16,vr),e.row.emptyBlock&&!e.row.shut?(p(),m("div",Se({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},a(t).dropId===e.row.id&&a(t).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),P(a(t).slotText),17,Dr)):C("",!0)],64))}},J=pt(Yr,[["__scopeId","data-v-2c4b1ff2"]]),Xr=["data-sve-ht-look","data-sve-ht-layers"],Wr={key:0,class:"sve-ht-page-template"},Gr={key:0,class:"sve-ht-page-template__text"},Zr={class:"sve-ht-page-template__note"},Jr={key:1,class:"sve-ht-empty"},Qr={key:2,class:"sve-ht-empty"},ei={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},ti={key:0,class:"sve-ht-empty"},ni={key:0,class:"sve-ht-empty"},oi=["data-sve-ht-under-main"],si={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},ai={key:0,class:"sve-ht-empty"},ri=["data-sve-ht-under-main"],ii=["data-dim"],li={key:0,class:"sve-ht-empty"},di={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},ci={key:0,class:"sve-ht-empty"},hi={__name:"HtmlTreeList",setup(e){const n=he(()=>Wn(t.query)),s=he(()=>mr(t.rows,n.value)),o=he(()=>s.value.rows),r=he(()=>n.value?t.sections.filter(S=>Mt(S.row,n.value)||S.current&&S.ready&&o.value.length>0):t.sections);function l(S){return!!S&&(!n.value||Mt(S,n.value))}function i(S){const H=t.frame?.kind;return t.inComponent||(H==="header"||H==="footer")&&H!==S}const d=he(()=>t.frame?.kind==="header"||t.frame?.kind==="footer"),k=he(()=>!!t.frame&&["header","main","footer"].some(S=>l(t.frame[S]))),v=he(()=>!!t.frame&&(t.frame.kind==="main"||l(t.frame.main))),b=he(()=>!!n.value&&!r.value.length&&!o.value.length&&!k.value);function u(S){return!!n.value&&!s.value.hits.has(S.path)}function _(S){const H={"data-sve-ht-sec-uid":S.uid};return S.current&&(H["data-sve-ht-branch"]="",H["data-sve-ht-cat"]=S.row?.cat||"layout"),t.sectionDrop&&t.sectionDrop.uid===S.uid&&(H["data-sve-ht-drop"]=t.sectionDrop.place),H}return(S,H)=>(p(),m("div",Se({class:"sve-ht-root","data-sve-ht-look":a(t).layers?"tags":a(t).look,"data-sve-ht-layers":a(t).layers?"":null,style:a(t).familyStyle},a(t).dragging?{"data-sve-ht-dragging":""}:{}),[a(t).pageTemplate?(p(),m("div",Wr,[a(t).pageTemplate.text?(p(),m("p",Gr,P(a(t).pageTemplate.text),1)):C("",!0),I("p",Zr,P(a(t).pageTemplate.note),1),a(t).pageTemplate.canOpen?(p(),m("button",{key:1,type:"button",class:"sve-ht-page-template__open",onClick:H[0]||(H[0]=$=>a(t).pageTemplate.onOpen($.currentTarget))},P(a(t).pageTemplate.openLabel),1)):C("",!0)])):!a(t).rows.length&&!a(t).sections.length&&!a(t).frame?(p(),m("div",Jr,P(a(t).emptyText),1)):b.value?(p(),m("div",Qr,P(a(t).searchEmpty),1)):C("",!0),a(t).frame||a(t).sections.length?(p(),m(A,{key:3},[a(t).frame?(p(),m(A,{key:0},[a(t).frame.kind==="header"?(p(),m("div",ei,[(p(!0),m(A,null,N(o.value,$=>(p(),Y(J,{key:$.id,row:$,dim:u($)},null,8,["row","dim"]))),128)),a(t).rows.length?C("",!0):(p(),m("div",ti,P(a(t).emptyText),1))])):!d.value&&l(a(t).frame.header)?(p(),Y(J,{key:1,row:a(t).frame.header,dim:i("header")},null,8,["row","dim"])):C("",!0)],64)):C("",!0),d.value?C("",!0):(p(),m("div",$o(Se({key:1},a(t).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[a(t).frame?.kind==="main"?(p(),m(A,{key:0},[(p(!0),m(A,null,N(o.value,$=>(p(),Y(J,{key:$.id,row:$,dim:u($)},null,8,["row","dim"]))),128)),a(t).rows.length?C("",!0):(p(),m("div",ni,P(a(t).emptyText),1))],64)):a(t).frame&&l(a(t).frame.main)?(p(),Y(J,{key:1,row:a(t).frame.main,dim:i("main")},null,8,["row","dim"])):C("",!0),a(t).frame?.kind==="template"?Ht((p(),m("div",{key:2,"data-sve-ht-frame-body":"","data-sve-ht-under-main":v.value?"":null},[I("div",si,[(p(!0),m(A,null,N(o.value,$=>(p(),Y(J,{key:$.id,row:$,dim:u($)},null,8,["row","dim"]))),128)),a(t).rows.length?C("",!0):(p(),m("div",ai,P(a(t).emptyText),1))])],8,oi)),[[hn,!a(t).mainShut]]):C("",!0),a(t).sections.length||a(t).frame?Ht((p(),m("div",{key:3,"data-sve-ht-frame-body":"","data-sve-ht-under-main":v.value?"":null},[a(t).frame?.template&&l(a(t).frame.template)?(p(),Y(J,{key:0,row:a(t).frame.template,dim:i("template")},null,8,["row","dim"])):C("",!0),a(t).frame&&!a(t).frame.template&&!a(t).sections.length&&!n.value?(p(),m("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":i("")?"":void 0},P(a(t).frameEmptyText),9,ii)):C("",!0),(p(!0),m(A,null,N(r.value,$=>(p(),m("div",Se({key:$.uid},{ref_for:!0},_($)),[$.ready?(p(),m(A,{key:0},[(p(!0),m(A,null,N(o.value,q=>(p(),Y(J,{key:q.id,row:q,dim:u(q)},null,8,["row","dim"]))),128)),a(t).rows.length?C("",!0):(p(),m("div",li,P(a(t).emptyText),1))],64)):(p(),Y(J,{key:1,row:$.row,dim:i("")},null,8,["row","dim"]))],16))),128))],8,ri)),[[hn,!a(t).frame||!a(t).mainShut]]):C("",!0)],16)),a(t).frame?(p(),m(A,{key:2},[a(t).frame.kind==="footer"?(p(),m("div",di,[(p(!0),m(A,null,N(o.value,$=>(p(),Y(J,{key:$.id,row:$,dim:u($)},null,8,["row","dim"]))),128)),a(t).rows.length?C("",!0):(p(),m("div",ci,P(a(t).emptyText),1))])):!d.value&&l(a(t).frame.footer)?(p(),Y(J,{key:1,row:a(t).frame.footer,dim:i("footer")},null,8,["row","dim"])):C("",!0)],64)):C("",!0)],64)):a(t).rows.length?(p(!0),m(A,{key:4},N(o.value,$=>(p(),Y(J,{key:$.id,row:$,dim:u($)},null,8,["row","dim"]))),128)):C("",!0)],16,Xr))}},_t=pt(hi,[["__scopeId","data-v-c77e3964"]]);let xt=null;function ui(e){return xt||(xt=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():{pages:[]}).then(n=>Array.isArray(n.pages)?n.pages:[]).catch(()=>[])),xt}let Je=null;function wt(){Je?.dismiss(),Je=null}function pi(e,n,s){wt();const o=n?.getBoundingClientRect?.(),r={x:o?o.left:0,y:o?o.bottom+4:0};ui(e).then(l=>{const i=l.length?l.map(d=>({label:d.title||d.url,onPick:()=>{wt(),s(d.url)}})):[{label:f(e,"component_props_pages_none"),onPick:null}];wt(),Je=$e(e.document,Ke,{items:i,x:r.x,y:r.y,onClose:()=>{Je=null}})})}const Gn="sve-html-tree-labels";function Zn(){try{const e=globalThis.localStorage?.getItem(Gn);if(!e)return{};const n=JSON.parse(e);return n&&typeof n=="object"?n:{}}catch{return{}}}function fi(e){try{globalThis.localStorage?.setItem(Gn,JSON.stringify(e))}catch{}}function Jn(e){return String(e||"_")}function Qn(e){const n=Zn()[Jn(e)];return n&&typeof n=="object"?{...n}:{}}function mi(e,n,s){const o=s?.[n];return typeof o=="string"&&o.trim()?o.replace(/\s+/g," ").trim():String(e||"").trim()}function vi(e,n,s,o){if(!n)return;const r=Jn(e),l=Zn(),i={...l[r]||{}},d=String(s||"").replace(/\s+/g," ").trim(),k=String(o||"").trim();!d||d===k?delete i[n]:i[n]=d,Object.keys(i).length?l[r]=i:delete l[r],fi(l)}const gi=/^@(media|supports|container|layer|scope)\b/i;function ki(e){const n=String(e||""),s=[];let o=0,r=0;for(;o<n.length;){if(n[o]==="{"&&n[o+1]==="{"){const d=n.indexOf("}}",o+2);o=d===-1?n.length:d+2;continue}if(n[o]==="/"&&n[o+1]==="*"){const d=n.indexOf("*/",o+2);o=d===-1?n.length:d+2;continue}if(n[o]==='"'||n[o]==="'"){const d=n[o];for(o+=1;o<n.length&&n[o]!==d;)o+=n[o]==="\\"?2:1;o+=1;continue}if(n[o]!=="{"){o+=1;continue}let l=1,i=o+1;for(;i<n.length&&l>0;){if(n[i]==="{"&&n[i+1]==="{"){const d=n.indexOf("}}",i+2);i=d===-1?n.length:d+2;continue}if(n[i]==="/"&&n[i+1]==="*"){const d=n.indexOf("*/",i+2);i=d===-1?n.length:d+2;continue}if(n[i]==='"'||n[i]==="'"){const d=n[i];for(i+=1;i<n.length&&n[i]!==d;)i+=n[i]==="\\"?2:1;i+=1;continue}n[i]==="{"?l+=1:n[i]==="}"&&(l-=1),i+=1}s.push({selector:n.slice(r,o).trim(),body:n.slice(o+1,i-1),from:r,to:i,text:n.slice(r,i).trim()}),o=i,r=i}return s}function Tn(e){const n=String(e||""),s=new Set,o=new Set,r=new Set;for(const l of n.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi))for(const i of l[2].replace(/\{\{[\s\S]*?\}\}/g," ").split(/[\s[\]]+/))i&&(s.add(i),s.add(i.replace(/([:./%!#()[\],])/g,"\\$1")));for(const l of n.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi))l[2].trim()&&o.add(l[2].trim());for(const l of n.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g))r.add(l[1].toLowerCase());return{classes:s,ids:o,tags:r}}function _n(e,n){const s=String(e||"").replace(/::?[a-zA-Z-]+(\([^)]*\))?/g," ").replace(/\[[^\]]*\]/g," "),o=[...s.matchAll(/\.((?:\\.|[\w-])+)/g)].map(i=>i[1]),r=[...s.matchAll(/#((?:\\.|[\w-])+)/g)].map(i=>i[1]);if(o.length||r.length){const i=d=>d.replace(/\\(.)/g,"$1");return o.every(d=>n.classes.has(d)||n.classes.has(i(d)))&&r.every(d=>n.ids.has(i(d)))}const l=[...s.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map(i=>i[2].toLowerCase());return l.length>0&&l.every(i=>n.tags.has(i))}function yi(e){return String(e||"").split(",").map(n=>n.trim()).filter(Boolean)}function bi(e,n,s){const o=yi(e);if(!o.length)return"keep";const r=o.filter(i=>_n(i,n));return r.length?r.length===o.length&&!o.some(i=>_n(i,s))?"move":"copy":"keep"}function eo(e,n,s){const o=String(e||""),r=Tn(n),l=Tn(s),i=[],d=[];let k=0;for(const v of ki(o)){const b=o.slice(v.from,v.to),u=b.match(/^\s*/)[0];if(k=v.to,gi.test(v.selector)){const S=eo(v.body,n,s);S.move.trim()&&i.push(`${v.selector} {
${S.move.trim()}
}`),S.keep.trim()&&d.push(`${u}${v.selector} {
${S.keep.trim()}
}`);continue}const _=v.selector.startsWith("@")?"keep":bi(v.selector,r,l);if(_==="move"){i.push(v.text);continue}_==="copy"&&i.push(v.text),d.push(b)}return d.push(o.slice(k)),{move:i.join(`

`).trim(),keep:d.join("").replace(/\n{3,}/g,`

`).trim()}}const Ti="/!/sve/component";function _i(e){const n=String(e||"").replace(/^\n+/,"").replace(/\s+$/,"").split(`
`);let s=null;for(const o of n){if(!o.trim())continue;const r=o.match(/^[ \t]*/)[0].length;s=s===null?r:Math.min(s,r)}return s?n.map(o=>o.slice(s)).join(`
`):n.join(`
`)}function xi(e){return String(e||"").match(/^\n?[ \t]*/)[0]}async function wi(e,n){if(!Cs(e))return"";try{return await(await Mo(()=>import("./tw-compile-BqsL3ULf.js"),__vite__mapDeps([0,1]),import.meta.url)).compileTailwind(e,n)||""}catch(s){return console.error("[sve] component tailwind compile",s),""}}async function Si(e,n){const s=await e.fetch(Ti,{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":Io(e),Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(n)});if(!s.ok){const o=new Error(String(s.status));throw o.status=s.status,o}return s.json()}function xn(e,n){const{from:s,to:o}=Ss(e,n),r=e.slice(s,o);if(!r.trim())return null;const l=e.slice(0,s)+e.slice(o),i=T("dock:css"),d=eo(typeof i=="string"?i:"",r,l);return{html:_i(r),css:d.move,keepCss:d.keep,lead:xi(r),from:s,to:o}}function Ci(e,n,{onDone:s,onError:o}={}){if(T("dock:is-locked")===!0)return;const r=T("dock:html");if(typeof r!="string"||!n)return;const l=xn(r,n);if(!l)return;const i=$e(e.document,xs,{heading:f(e,"component_new"),nameLabel:f(e,"component_name"),placeholder:f(e,"component_name_placeholder"),value:n.klass||n.tag||"",cancelLabel:f(e,"cancel"),saveLabel:f(e,"component_create"),onOk:d=>{i.dismiss(),(async()=>{try{const k=await wi(e,l.html),v=T("dock:html"),b=typeof v=="string"&&v===r?l:xn(v,n);if(!b)return;const u=await Si(e,{name:d,html:b.html,css:b.css,js:"",tw:k}),_=T("dock:html"),S=_.slice(0,b.from)+b.lead+u.tag+_.slice(b.to);T("dock:set-html",S),b.css.trim()&&T("dock:set-css",b.keepCss),s?.(u)}catch(k){o?.(k)}})()}})}const U=Hs("sve-call-values"),Be=new Set;let wn=null;const Li="__sve-html-tree-style";function Ei(e,n,s){if(n||s)return!1;const o=String(T("dock:chrome-kind")||"");if(o==="header"||o==="footer")return!1;const r=Mn(e);return!!r&&r!=="create"&&Fo(e)!==Bo(e)}function to(e){return{sectionLoops:Do(e),sectionsLabel:f(e,"html_tree_sections_slot")}}function Pi(e,n){const s={entry:n,text:"",note:f(e,"html_tree_page_template_note"),openLabel:f(e,"html_tree_open_template"),canOpen:!1,onOpen:null};return jn(e,{entry:n}).then(o=>{!o||t.pageTemplate?.entry!==n||(t.pageTemplate={...t.pageTemplate,text:f(e,"html_tree_page_template",{name:o.name}),canOpen:!!o.open,onOpen:o.open?r=>cs(e,r,o.open):null})}),s}function Hi(e,n){const s=n.replace(/^view:/,"");if(!s||T("dock:current-type")!==n){t.usedBy=null,t.templateSections=[];return}t.usedBy?.view!==s&&(t.usedBy=null,jn(e,{view:s}).then(o=>{if(!o||T("dock:current-type")!==n)return;const r=o.everything?[{name:f(e,"html_tree_used_by_everything"),kind:"everything",url:null}]:o.used_by.map(l=>({...l,...$i(e,l)}));t.templateSections=Array.isArray(o.sections_fields)?o.sections_fields:[],t.usedBy={view:s,label:f(e,"html_tree_used_by"),items:r,empty:r.length?"":f(e,"html_tree_used_by_nobody"),hint:r.length?f(e,"html_tree_used_by_hint",{list:r.map(l=>l.name).join(", ")}):""}}))}function $i(e,n){if(!n.url)return{openLabel:"",onOpen:null};const s=f(e,"html_tree_used_by_open",{name:n.name});return n.kind==="page"?{openLabel:s,onOpen:o=>ms(e,o,vs(e,n.url))}:{openLabel:s,onOpen:o=>gs(e,{anchor:o,url:n.url,subtitle:n.name})}}const j=new Set;let It="",we=!1,St=null,Me=!0,ee="",Pe=0,no="";const ae=new Map,Le=new Set,Ot=new Map,Qe=new Map;let V="",oo=!1,F=null,et=null,ze="",tt="",nt=0,At=null,Ee=[],ke=null,Re=null,ot=null,st=null,Rt=null,ye=!1,se=null,Ne=null,De=null,at=null,rt=null,Dt=null,ge=null;function G(e){return e.getElementById(Ge)}function Mi(e){Oo(e,Li,`
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
      ${fn("light")}
      /* How much of a row's own colour its pick takes: a wash, not a fill.
         The row mixes it in below — a mix written up here would read
         --sve-ht-c on the list, where no family is set. */
      --sve-ht-pick-mix: 11%;
      --sve-ht-pick-hover-mix: 18%;
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${fn("dark")}
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
  `)}function z(){const e=T("dock:html");return typeof e=="string"?e:""}function so(e){return!!T("dock:is-open",e)}function Ie(e,{save:n=!1,unlock:s=!1}={}){return Qt()||T("dock:set-html",s?{html:e,unlock:!0}:e)!==!0?!1:(n&&T("dock:save-now"),!0)}function Ct(e){const n=T("dock:component-exit-state")||{};if(t.exitOpen=!!n.open,!n.open){t.onExit=null;return}t.exitName=n.name||"",t.exitLabel=f(e,"component_exit"),t.exitTitle=f(e,n.back?"component_exit_back":"component_exit_close"),t.onExit=()=>{T("dock:exit-component"),O(e)}}const be=[];let Lt=!1,Ft=!1;function Et(e,n){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(n,{timeout:2e3});return}e.setTimeout(n,200)}function Ii(e,n){for(const s of n){const o=s.type;!o||ae.has(o)||Le.has(o)||be.includes(o)||be.push(o)}Yt.htmlTreePrefetchArmed&&Jt(e)}function Al(e){Yt.htmlTreePrefetchArmed=!0,Jt(e)}function Jt(e){if(Lt||!be.length)return;Lt=!0;const n=()=>{const s=be.shift();if(!s){Lt=!1;return}if(ae.has(s)||Le.has(s)){Et(e,n);return}Le.add(s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(s)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(o=>o.ok?o.json():null).then(o=>{if(typeof o?.html=="string"){ae.set(s,o.html);const r=Qe.get(s);Qe.delete(s);const l=!!r&&r!==ao(e,s);(Ft||l)&&(Ft=!1,O(e))}}).catch(()=>{}).finally(()=>{Le.delete(s),Et(e,n)})};Et(e,n)}function Qt(){return!!V}function ao(e,n){return ro(n)||No(e,n)||"section"}function ro(e){const n=ae.get(e);if(!n)return"";const s=Ot.get(e);if(s&&s.html===n)return s.tag;const o=en(je(n))?.tag||"";return Ot.set(e,{html:n,tag:o}),o}function ft(e,n){const s=ct(e)||"page_sections",o=[];for(const r of Ut(n)||[]){if(r.name===ds||r.name===Ts)continue;const l=zt(r.values),i=l&&typeof l=="object"?l[s]:null;if(Array.isArray(i)){i.forEach(d=>{if(!d||typeof d!="object"||Array.isArray(d)||typeof d.type!="string")return;const k=[d._visual_id,d.id,d._id].filter(S=>typeof S=="string"&&S!=="");if(!k.length)return;const v=Kn(e,d),b=typeof d._sve_label=="string"?d._sve_label.trim():"",u=ao(e,v);ro(v)||Qe.set(v,u);const _=Qn(v)[`0:${u}`];o.push({uid:k[0],ids:k,type:v,tag:u,label:b||(typeof _=="string"&&_.trim()?_.trim():"")||ht(e,v)?.display||Fe(v)||v,svg:Un(u,"",null).svg||Ce.section,cat:Bn(u),enabled:d.enabled!==!1,static:Xo(e,v)})});break}}return o}function Oi(e,n,s){if(!s.length)return"";const o=T("dock:current-type")||"",r=T("dock:current-uid"),l=!!T("dock:component-exit-state")?.open;if(r){const i=ut(r,n),d=s.find(k=>k.ids.some(v=>i.includes(v)));if(d&&(l||d.type===o))return d.uid}return s.find(i=>i.type===o)?.uid||""}function Ai(e,n,s,o){const r=n.find(H=>H.uid===s),l=T("dock:component-src"),i=T("dock:type-stack")||[];if(!r||!l||!i.length)return null;const d=i.map(H=>H.type).filter(H=>!ae.get(H));if(d.length)return Ri(e,d),null;const k=[],v=new Set,b=new Set;let u=H=>k.push(...H),_=null,S=0;for(let H=0;H<i.length;H+=1){const $=H+1<i.length?i[H+1].src:l,q=L=>({...L,id:`ctx${H}:${L.id}`,path:`ctx${H}/${L.path}`,ctxLevel:H,children:L.children.map(q)}),Z=je(ae.get(i[H].type)).map(q),B=[],g=(L,D)=>{for(const M of L){if(M.kind==="component"&&M.src===$)return B.push(...D,M),M;const R=g(M.children,[...D,M]);if(R)return R}return null};if(_=$?g(Z,[]):null,!_)return null;const c=new Set(B.map(L=>L.id)),y=(L,D)=>{for(const M of L)M.children.length&&(c.has(M.id)?j.has(M.path):io(M,D))&&v.add(M.id),y(M.children,D+1)};y(Z,S),u(Z),b.add(_.id),S+=B.length,u=(L=>D=>{L.children=D})(_)}for(const H of lo(o))v.add(H);return j.has(_.path)&&v.add(_.id),_.children=o,{tree:k,folds:v,hostId:_.id,hostIds:b,levels:i.length,rootId:k.find(H=>!H.kind)?.id||"",label:r.label,svg:r.svg,cat:r.cat}}function Ri(e,n){for(const s of n)!be.includes(s)&&!Le.has(s)&&be.push(s);Ft=!0,Jt(e)}function Di(e,n,s){const o=T("dock:component-exit-state");if(o?.open)return Fe(o.name)||o.name||"";if(s)return n.find(l=>l.uid===s)?.label||"";const r=T("dock:current-type")||"";return String(r).startsWith("view:")?"":ht(e,r)?.display||Fe(r)||""}function mt(e,n,s,o,r){const l=s.find(i=>i.uid===o);l&&o!==r&&(j.clear(),F=null,Me=!1,W(),Ve(),ee=o,no=z(),V=ae.get(l.type)||"",V&&(F=Nt(je(V))||null),oo=(T("dock:current-type")||"")===l.type,e.clearTimeout(Pe),Pe=e.setTimeout(()=>{ee="",we=!1,O(e)},4e3),O(e),fs(e,l.uid,"tree"),ue({source:ne,type:te.SVE_ACTIVATE,ids:l.ids},e),e.setTimeout(()=>O(e),0))}function Bt(e,n){if(!n)return!1;for(const s of e||[])if(s.id===n||Bt(s.children,n))return!0;return!1}function Nt(e){return en(e)?.id||""}function en(e){for(const n of e||[]){if(!n.kind)return n;const s=en(n.children);if(s)return s}return null}function io(e,n){const s=n===0||e.path===tt;return j.has(e.path)?s:!s}function lo(e){const n=new Set,s=(o,r)=>{for(const l of o)l.children.length&&io(l,r)&&n.add(l.id),s(l.children,r+1)};return s(e,0),n}function O(e){const n=e.document,o=G(n)?.querySelector("[data-sve-html-tree-list]");if(!o)return;Mi(n),Es(e);const r=z();V&&V===r&&(V=""),T("dock:chrome-kind")&&(V="");const l=V||r,i=je(l,to(e));Ee=i,tt="";const d=T("dock:current-type")||"",k=Qn(d),v=Ro(e,n),u=!!(T("dock:component-exit-state")||{}).open;d&&r&&!V&&ae.set(d,r);const _=ft(e,n);Ii(e,_);const S=Oi(e,n,_);if(Ei(e,v,u)){const h=Mn(e);Ee=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!1,t.layoutFile=!1,t.usedBy=null,t.emptyText="",t.pageTemplate?.entry!==h&&(t.pageTemplate=Pi(e,h)),t.onRefresh=()=>O(e),t.onSection=null,Ct(e),Ae(o,_t),Pt(e,[]);return}t.pageTemplate=null,Hi(e,String(T("dock:collection-view")||""));const H=String(T("dock:chrome-kind")||"");if(rs(e),v&&!_.length&&!H){Ee=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,t.layoutFile=!1,t.emptyText=f(e,"html_tree_page_empty"),t.canEdit=!T("dock:is-locked"),t.look=mn(e),t.onRefresh=()=>O(e),t.onSection=null,Ct(e),Ae(o,_t),Pt(e,[]);return}t.pageBuilder=v;const $=`${d}|${S}`;let q=!1;$!==It&&(It=$,j.clear(),St!==null&&l!==St?q=!0:we=l),(q||we!==!1&&l!==we)&&(we=!1,j.clear(),F=Nt(i)||null),St=l,ee&&(ee===S||!_.length)&&(oo||l!==no)&&(e.clearTimeout(Pe),ee="",we=!1,Bt(i,F)||(j.clear(),F=Nt(i)||null));const Z=_.some(h=>h.uid===ee)?ee:"",B=Me?"":Z||S,g=u?Ai(e,_,B,i):null,c=!!(Z||S),y=c||u?"":String(T("dock:chrome-kind")||""),D=v&&(!d&&!c||y==="main"&&T("dock:on-empty-page")===!0),M=D||y==="template"?"":y;t.layoutFile=M==="main",M!=="main"&&(ze="");const R=M==="main"?Sn(i,"main"):null,pe=R?it(i,h=>h.tag==="body"&&Bt(h.children,R.id)):null;tt=pe?pe.path:"",R&&(We((pe||R).path),ze!==$&&(We(R.path),j.add(R.path)));const Te=M==="header"||M==="footer"?it(i,h=>l.slice(h.from,h.openTo).includes(`data-sve-chrome="${M}"`)):null,re=Te||(M==="header"||M==="footer"?Sn(i,M):null);re&&We(re.path);const K=D||!(M==="main"?!!R:M==="header"||M==="footer"?!!re:!0)?[]:g?gn(g.tree,t.query?new Set:g.folds):gn(i,t.query?new Set:lo(i));!l.trim()&&!so(n)?t.emptyText=f(e,"html_tree_need_dock"):t.emptyText=f(e,"html_tree_empty"),t.slotText=f(e,"antlers_drop_here"),t.dataTitle=f(e,"data_vars_title"),t.pageTitle=f(e,"component_props_page"),t.renameTitle=f(e,"html_tree_rename"),t.tagTitle=f(e,"tw_tag"),t.hideTitle=f(e,"html_tree_hide"),t.showTitle=f(e,"html_tree_show"),t.duplicateTitle=f(e,"html_tree_duplicate"),t.deleteTitle=f(e,"html_tree_delete"),t.videoHoldTitle=f(e,"html_tree_video_hold"),t.videoPlayTitle=f(e,"html_tree_video_play"),t.alpineTitle=f(e,"html_tree_alpine_state"),t.lockedTitle=f(e,"html_tree_locked"),t.searchEmpty=f(e,"html_tree_search_empty"),t.canEdit=!T("dock:is-locked"),t.look=mn(e),t.onQuery=()=>O(e),Ct(e),t.inComponent=u,t.onContextRow=h=>{if(!g||h===g.hostId)return;const x=K.find(E=>E.id===h)?.ctxLevel??g.levels-1;T("dock:exit-component",g.levels-x),O(e)},t.onSelect=h=>{const x=K.find(E=>E.id===h);x&&qn(e,x.path)||dt(e,h,K)},t.onTwist=h=>{const x=K.find(E=>E.id===h)?.path;x&&(j.has(x)?j.delete(x):j.add(x),O(e))},t.onTagChange=(h,x)=>{const E=t.rows.find(de=>de.id===x);E&&!Qt()&&!tn(e,E)&&Ps(e,h.currentTarget,E)},t.onRename=h=>qi(e,h),t.onRenameCommit=()=>Cn(e,!0),t.onRenameCancel=()=>Cn(e,!1),t.onHide=h=>Gi(e,h),t.onLock=h=>Wi(e,h),t.canUnlock=ho(e),t.lockTitle=f(e,"html_tree_lock"),t.unlockTitle=f(e,"html_tree_unlock"),t.lockedByTitle=f(e,"html_tree_locked_by_developer"),t.onVideoHold=h=>zi(e,h),t.onAlpineState=(h,x)=>Xi(e,h,x),t.onDuplicate=h=>Zi(e,h),t.onDelete=h=>Qi(e,h),t.onPointerDown=(h,x)=>ol(e,h,x),t.onSectionPointerDown=(h,x)=>rl(e,h,x),t.onSectionHover=h=>e.dispatchEvent(new e.CustomEvent("sve-lite-hover",{detail:{uid:h}})),t.onContext=(h,x)=>tl(e,h,x),t.onInspectCommit=h=>ml(e,h),t.onPropValue=(h,x,E)=>Hn(e,h,x,E),t.onPropPage=(h,x)=>pi(e,h,E=>Hn(e,x,E,!1)),t.onLoopKind=h=>vl(e,h),t.onAddBranch=h=>gl(e,h),t.onLoopSortField=h=>{const x=lt(),E=String(h||"").trim();if(!x)return;const de=ge?.id===x.id?ge.dir:"",ce=x.sortDir||de||"asc";ge=null,Q(e,(ve,gt)=>xe(ve,gt,{sortField:E,sortDir:ce}))},t.onLoopSortDir=h=>{const x=lt(),E=String(h||"");if(x){if((E==="asc"||E==="desc")&&!x.sortField){ge={id:x.id,dir:E},Vt(e,x);return}ge=null,Q(e,(de,ce)=>xe(de,ce,{sortDir:E,sortField:E==="asc"||E==="desc"?ce.sortField:""}))}},t.onLoopDepth=h=>Q(e,(x,E)=>xe(x,E,{navDepth:String(h||"").replace(/\D/g,"")})),t.onLoopIncludeHome=h=>Q(e,(x,E)=>xe(x,E,{includeHome:!!h})),t.onLoopLimit=h=>Q(e,(x,E)=>xe(x,E,{limit:String(h||"").replace(/\D/g,"")})),t.onLoopOffset=h=>Q(e,(x,E)=>xe(x,E,{offset:String(h||"").replace(/\D/g,"")})),t.onPropHost=h=>h?U.mount(h):U.unmount(),t.onInspectData=(h,x)=>{T("dock:data-menu",{anchor:h,at:K.find(E=>E.id===F)?.from,onPick:E=>x(String(E?.var||"").trim())})};const sn=K.find(h=>!h.kind)?.id,an=u?"":Di(e,_,B),fe=B&&!u?_.find(h=>h.uid===B):null,bo=Dn(e,String(T("dock:current-type")||""));let To=0;const _o=Yi(Te?[Te]:i,l),xo=Fn(e,String(d)),ie=M==="header"||M==="footer"?M:"",_e=re?re.id:"",me=R&&K.find(h=>h.id===R.id)||null,rn=pe&&K.find(h=>h.id===pe.id)||null,le=rn||me||_e&&K.find(h=>h.id===_e)||null,ln=le?Ki(K,le):-1;if(le&&!K.slice(K.indexOf(le),ln).some(h=>h.id===F)&&(F=le.id),t.selectFrom){const h=K.find(x=>x.from===t.selectFrom.at&&(!x.kind||x.kind==="sections"));h?(F=h.id,t.selectFrom=null):--t.selectFrom.left<=0&&(t.selectFrom=null)}const dn=t.layoutFile?Ni(e):null;t.rows=K.map(h=>{const x=dn&&h.kind==="component"&&dn.get(h.src)||"",E=h.tag==="body"&&!h.kind,de=x?{svg:Ce[x]}:Un(h.tag,h.kind,h.antlers),ce=h.tag==="video"&&!h.kind?To++:-1,ve=_o.get(h.id),gt=ve?xo[ve.nth]||{}:{},kt=ve?ve.booleans.map(({key:Oe,value:cn})=>({key:Oe,file:cn,value:gt[Oe]??cn})):[],qe=!!g&&h.id===g.rootId,yt=h.id===sn&&an?an:qe?g.label:h.klass,Ue=h.id===sn;return{...h,tag:x||h.tag,frameCall:x,fixed:!!x||E,base:yt,name:x?f(e,`html_tree_frame_${x}`):ie&&h.id===_e?f(e,`html_tree_frame_${ie}`):h===me?f(e,"html_tree_frame_main"):Ue&&fe?yt:mi(yt,h.path,k),current:h.id===F,letter:qe?"":de.letter||"",svg:ie&&h.id===_e?Ce[ie]:h===me?Ce.main:Ue&&fe?fe.svg:qe?g.svg:de.svg||"",frame:ie&&h.id===_e?ie:h===me?"main":"",cat:ie&&h.id===_e?ie:h===me||E?"main":qe?g.cat:x||Bn(h.tag,h.kind,h.antlers),context:g?g.hostIds.has(h.id)?"host":h.id.startsWith("ctx")?"dim":"":"",sectionRoot:Ue&&fe?fe.uid:"",fieldsIcon:!!(Ue&&fe&&!fe.static),videoNth:ce,videoHeld:ce>=0&&bo.has(ce),alpineNth:kt.length?ve.nth:-1,alpineKeys:kt,alpineSet:kt.some(Oe=>Oe.value!==Oe.file)}}),is(e),ls(e);const vt=[];for(const h of t.rows)vt.length=h.depth,h.guides=vt.slice(),vt[h.depth]=h.cat;if(le){const h=K.indexOf(le),x=le.depth;t.rows=t.rows.slice(h,ln).map(E=>({...E,depth:E.depth-x,guides:E.guides.slice(x)})),me&&ze!==$&&(ze=$,e.setTimeout(()=>dt(e,me.id,K),0))}t.sections=v&&(c||M||D)?_.map(h=>{const x=!!B&&h.uid===B;return{...h,current:x,ready:x&&(!Z||!!V),row:{id:`sec:${h.uid}`,section:h.uid,tag:h.tag,name:h.label,kind:"",svg:h.svg,cat:h.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:x,hidden:!h.enabled}}}):[],t.frame=Bi(e,_,c,u,M,!1,!!rn),t.frameEmptyText=f(e,"html_tree_frame_no_sections"),Fi(e,M),t.onSection=h=>{ye||(Kt(e),mt(e,n,_,h,B))},t.onRefresh=()=>O(e),Vt(e,t.rows.find(h=>h.id===F)),Ae(o,_t),Pt(e,i)}function Fi(e,n){t.frameOpenTitle=f(e,"html_tree_frame_open"),t.frameMainTitle=f(e,"html_tree_frame_main_open"),t.frameTemplateTitle=f(e,"html_tree_frame_template_open"),t.frameFieldsTitle=f(e,"html_tree_frame_fields"),t.onFrame=s=>{n===s?ji(e,s):jt(e,s)},t.onFrameEnter=s=>jt(e,s),t.onFrameFields=s=>Jo(e,us(e,s),f(e,`html_tree_frame_${s}`)),t.onFrameTwist=()=>{t.mainShut=!t.mainShut}}function Bi(e,n,s,o,r,l=!1,i=!1){if(!r&&!l||i)return null;const d=b=>({id:`frame:${b}`,frame:b,synthetic:!0,tag:b,name:f(e,`html_tree_frame_${b}`),kind:"",svg:Ce[b]||"",cat:b,letter:"",depth:0,hasChildren:b==="main"&&(n.length>0||r==="template"),shut:b!=="main",current:!1,hidden:!1}),k={kind:r,header:d("header"),main:d("main"),footer:d("footer"),template:null},v=r&&r!=="template"?String(T("dock:collection-view")||""):"";return v&&(k.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:ht(e,v)?.display||Fe(v.replace(/^view:/,"")),kind:"",svg:Ce.section,cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),k}function Sn(e,n){return it(e,s=>s.tag===n)}function it(e,n){for(const s of e||[]){if(!s.kind&&n(s))return s;const o=it(s.children,n);if(o)return o}return null}function Ni(e){const n=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},s=new Map;for(const o of["header","footer"]){const r=$s(n[o]?.type);r&&s.set(r,o)}return s}function Ki(e,n){let s=e.indexOf(n)+1;for(;s<e.length&&e[s].depth>n.depth;)s+=1;return s}function ji(e,n){const s=Vn(e);(n==="main"||n==="template"?s?.querySelector("main"):s?.querySelector(`[data-sve-chrome="${n}"]`))?.scrollIntoView({behavior:"smooth",block:"start"})}function Kt(e){const n=String(T("dock:chrome-open",e.document)||"");return n!=="header"&&n!=="footer"?!1:(ps(e),ue({source:ne,type:te.SVE_FORCE_EXIT_CHROME},e),!0)}function Vi(e){e.clearTimeout(Pe),ee="",V="",j.clear(),F=null,Me=!1,W(),Ve()}function jt(e,n){if(e.document,String(T("dock:chrome-kind")||"")===n)return;if(Vi(e),n==="main"){Kt(e),T("dock:open-file",_s);return}if(n==="template"){const l=String(T("dock:collection-view")||"");l&&(Kt(e),T("dock:open-file",l));return}if(n!=="header"&&n!=="footer")return;const s=Vn(e)?.querySelector(`[data-sve-chrome="${n}"]`);s?(s.scrollIntoView({block:"nearest"}),s.dispatchEvent(new s.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:ne,type:te.OPEN_CHROME,kind:n},e.location.origin);const o=Date.now(),r=async()=>{if(String(T("dock:chrome-kind")||"")!==n){Date.now()-o<3e4&&e.setTimeout(r,250);return}await(T("dock:load-settled")||null),yo(e)};e.setTimeout(r,250)}function Pt(e,n){G(e.document)&&co(e,n)}function co(e,n){const s=n[0],o=!!T("dock:component-src"),r=o?"":T("dock:current-uid")||"";ue({source:ne,type:te.SVE_HTML_PICK,on:!0,uid:r,uids:r?ut(r,e.document):[],all:o,tag:s?.tag||"",klass:s?.klass||"",nodes:Xs(n)},e)}function We(e){if(!e)return;const n=(s,o)=>{for(const r of s||[]){if(r.path===e)return!0;if(n(r.children,o+1))return o===0||r.path===tt?j.delete(r.path):j.add(r.path),!0}return!1};n(Ee,0)}function qi(e,n){if(ye)return;const s=t.rows.find(o=>o.id===n);tn(e,s)||!s||s.kind||(F=n,t.rows.forEach(o=>{o.current=o.id===n}),t.editingId=n,t.draft=s.name,e.setTimeout(()=>{const o=G(e.document)?.querySelector("[data-sve-ht-rename]");o?.focus(),o?.select()},0))}function Cn(e,n){const s=t.editingId;if(!s)return;const o=t.rows.find(r=>r.id===s);t.editingId=null,n&&o&&(o.sectionRoot?Ui(e,o.sectionRoot,t.draft):vi(T("dock:current-type")||"",o.path,t.draft,o.base||o.klass)),t.draft="",O(e)}function Ui(e,n,s){const o=ct(e)||"page_sections",r=String(s||"").replace(/\s+/g," ").trim();for(const l of Ut(e.document)||[]){const i=zt(l.values),d=i&&typeof i=="object"?i[o]:null;if(!Array.isArray(d))continue;const k=d.findIndex(_=>_&&typeof _=="object"&&[_._visual_id,_.id,_._id].includes(n));if(k===-1)continue;const v=Kn(e,d[k]),b=ht(e,v)?.display||Fe(v)||v,u=JSON.parse(JSON.stringify(d));return u[k]={...u[k]},!r||r===b?delete u[k]._sve_label:u[k]._sve_label=r,l.setFieldValue(o,u),!0}return!1}function zi(e,n){const s=t.rows.find(d=>d.id===n);if(!s||!(s.videoNth>=0))return;const o=String(T("dock:current-type")||""),r=Dn(e,o),l=!r.has(s.videoNth);l?r.add(s.videoNth):r.delete(s.videoNth);const i=String(T("dock:current-uid")||"");hs(e,o,r),ue({source:ne,type:te.SVE_VIDEO_HOLD,uid:i,uids:i?ut(i,e.document):[],nth:s.videoNth,on:l},e),O(e)}function Yi(e,n){const s=new Map;let o=0;const r=l=>{for(const i of l){if(i.hidden)continue;const d=i.kind?null:Gs(n.slice(i.from,i.openTo));d!==null&&s.set(i.id,{nth:o++,booleans:Js(d)}),r(i.children||[])}};return r(e),s}function Xi(e,n,s){const o=t.rows.find(l=>l.id===s);if(!o||!(o.alpineNth>=0))return;if(o.alpineKeys.length===1){Ln(e,o,o.alpineKeys[0]);return}const r=n.currentTarget.getBoundingClientRect();W(),se=$e(e.document,Ke,{items:o.alpineKeys.map(l=>({label:l.key,icon:l.value?po:fo,onPick:()=>{W(),Ln(e,o,l)}})),x:Math.round(r.left),y:Math.round(r.bottom+4),onClose:()=>{se=null}})}function Ln(e,n,s){const o=String(T("dock:current-type")||""),r=Fn(e,o),l=!s.value,i=l!==s.file,d={...r[n.alpineNth]||{}};i?d[s.key]=l:delete d[s.key],Object.keys(d).length?r[n.alpineNth]=d:delete r[n.alpineNth];const k=ks(String(T("dock:chrome-kind")||"")),v=k?"":String(T("dock:current-uid")||"");ys(e,o,r),ue({source:ne,type:te.SVE_ALPINE_STATE,uid:v,uids:v?ut(v,e.document):[],chrome:k,nth:n.alpineNth,key:s.key,value:l,on:i},e),O(e)}function tn(e,n){return!n||!(n.locked||n.lockedIn)?!1:(e.Statamic?.$toast?.error(f(e,"html_tree_locked_element")),!0)}function ho(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function Wi(e,n){const s=t.rows.find(o=>o.id===n);if(!(!s||s.lockedIn||T("dock:is-locked"))){if(!s.locked){He(e,n,Ks,{lockAction:!0});return}if(!ho(e)){e.Statamic?.$toast?.error(f(e,"html_tree_unlock_denied"));return}Xt(e,{titleKey:"html_tree_unlock_title",bodyKey:"html_tree_unlock_body",confirmKey:"html_tree_unlock_confirm"},()=>He(e,n,js,{lockAction:!0,unlock:!0}))}}function nn(e){return!!t.rows.find(n=>n.id===e)?.fixed}function Gi(e,n){nn(n)||He(e,n,Vs)}function Zi(e,n){if(nn(n))return;const s=t.rows.find(o=>o.id===n)?.sectionRoot;if(s){e.postMessage({source:ne,type:te.DUPLICATE_ROW,uid:s},e.location.origin);return}He(e,n,qs)}function uo(e,n){Xt(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const s=e.document;bs({uid:n},s,e)})}function Ji(e,n,s){ee===s&&(e.clearTimeout(Pe),ee="",V=""),F=null,Me=!1,It="";const o=ft(e,n),r=o.find(l=>l.uid!==s)||o[0];r?mt(e,n,o,r.uid,""):(V="",t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,O(e)),e.setTimeout(()=>{G(e.document)&&O(e)},0)}Nn("row:removed",({uid:e,parentPath:n,doc:s,win:o})=>{n!==ct(o)||!G(o.document)||Ji(o,s,e)});function Qi(e,n){if(nn(n))return;const s=t.sections?.find(r=>r.row?.id===n),o=s?s.row?.section||s.uid:t.rows.find(r=>r.id===n)?.sectionRoot;if(o){uo(e,o);return}if(t.rows.find(r=>r.id===n)?.kind==="sections"){Xt(e,{titleKey:"html_tree_sections_remove_title",bodyKey:"html_tree_sections_remove_body",confirmKey:"html_tree_sections_remove_confirm"},()=>He(e,n,vn));return}He(e,n,vn)}function He(e,n,s,{lockAction:o=!1,unlock:r=!1}={}){if(T("dock:is-locked"))return;const l=z(),i=t.rows.find(k=>k.id===n);if(!i||!o&&tn(e,i))return;const d=s(l,i);d!==l&&Ie(d,{unlock:r})}function W(){se?.dismiss(),se=null}const po='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',fo='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>';function mo(e,n){const s=t.sections?.find(k=>k.uid===n),o=s?.type||"";if(!o||!In(e))return[];const r=s.label||o,l=Wo(e,o),i=()=>e.Statamic?.$toast?.error(f(e,"section_update_failed")),d=[{label:f(e,"static_section_insertable"),icon:l?fo:po,onPick:()=>{W(),un(e,{handle:o,hidden:!l}).then(()=>{e.Statamic?.$toast?.success(f(e,l?"section_shown_to_editors":"section_hidden_from_editors",{name:r})),pn(e)}).catch(i)}}];return s.static&&d.push({label:f(e,"section_add_fields"),onPick:()=>{W(),un(e,{handle:o,fields:!0}).then(()=>{e.Statamic?.$toast?.success(f(e,"section_fields_added",{name:r})),pn(e),O(e),On(e,o)}).catch(i)}}),d}function el(e,n,s){const o=s.row?.section||s.uid;o&&(se=$e(e.document,Ke,{items:[...mo(e,o),{label:f(e,"html_tree_remove_section"),danger:!0,onPick:()=>{W(),uo(e,o)}}],x:n.clientX,y:n.clientY,onClose:()=>{se=null}}))}function tl(e,n,s){W();const o=t.sections?.find(d=>d.row?.id===s);if(o){el(e,n,o);return}const r=t.rows.find(d=>d.id===s);if(!r)return;dt(e,s,t.rows);const l={x:n.clientX,y:n.clientY},i=d=>{d.length&&(se?.dismiss(),se=$e(e.document,Ke,{items:d,x:l.x,y:l.y,onClose:()=>{se=null}}))};if(r.frameCall){i([{label:f(e,"html_tree_frame_edit",{frame:f(e,`chrome_${r.frameCall}`)}),onPick:()=>{W(),jt(e,r.frameCall)}}]);return}if(r.kind==="component"){nl(e,r,i);return}r.kind==="slot"||r.kind==="sections"||r.locked||r.lockedIn||t.canEdit&&i([...r.sectionRoot?mo(e,r.sectionRoot):[],{label:f(e,"component_make"),onPick:()=>{W(),Ci(e,r,{onDone:()=>O(e),onError:d=>{e.alert(d?.status===409?f(e,"component_exists"):f(e,"component_failed"))}})}}])}const En=(e,n)=>{W(),T("dock:open-template",n)};function nl(e,n,s){if(!Ys(n.src)){s([{label:f(e,"component_open_named",{name:n.name||n.src}),onPick:()=>En(e,`view:partials/${n.src}`)}]);return}s([{label:f(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(n.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(o=>o.ok?o.json():{items:[]}).then(o=>{const r=Array.isArray(o.items)?o.items:[];s(r.length?r.map(l=>({label:f(e,"component_open_named",{name:l.label}),onPick:()=>En(e,l.type)})):[{label:f(e,"component_none"),onPick:null}])}).catch(()=>s([{label:f(e,"component_none"),onPick:null}]))}function ol(e,n,s){if(n.button!==0||T("dock:is-locked")||t.editingId)return;const o=t.rows.find(i=>i.id===s);if(o&&(o.locked||o.lockedIn)||n.target?.closest?.("button, input"))return;Ve(),ke=s,Re={x:n.clientX,y:n.clientY},ot=n.currentTarget,st=n.pointerId;const r=i=>sl(e,i),l=i=>al(e,i);Rt=()=>{e.document.removeEventListener("pointermove",r,!0),e.document.removeEventListener("pointerup",l,!0),e.document.removeEventListener("pointercancel",l,!0),Rt=null},e.document.addEventListener("pointermove",r,!0),e.document.addEventListener("pointerup",l,!0),e.document.addEventListener("pointercancel",l,!0)}function sl(e,n){if(!ke||!Re)return;const s=n.clientX-Re.x,o=n.clientY-Re.y;if(!t.dragging&&s*s+o*o<25)return;if(!t.dragging){t.dragging=!0;try{ot?.setPointerCapture?.(st)}catch{}}n.preventDefault();const r=e.document.elementFromPoint(n.clientX,n.clientY),l=r?.closest?.("[data-sve-ht-slot]");if(l){const u=l.getAttribute("data-sve-ht-id");if(u&&u!==ke){t.dropId=u,t.dropPlace="inside";return}}const i=r?.closest?.("[data-sve-ht-row]"),d=i?.getAttribute("data-sve-ht-id");if(!d||d===ke){t.dropId=null,t.dropPlace=null;return}const k=t.rows.find(u=>u.id===d),v=t.rows.find(u=>u.id===ke);if(!k||k.context||k.lockedIn||v&&k.path.startsWith(`${v.path}/`)){t.dropId=null,t.dropPlace=null;return}const b=i.getBoundingClientRect();t.dropId=d,t.dropPlace=Bs(n.clientY-b.top,b.height,!Yn(k.tag)&&!zn(k)&&!k.locked)}function al(e,n){const s=ke,o=t.dropId,r=t.dropPlace||"after",l=t.dragging;if(Ve(),l&&(ye=!0,e.setTimeout(()=>{ye=!1},0)),!l||T("dock:is-locked")||!s||!o||s===o)return;n?.preventDefault?.();const i=z(),d=Ns(i,Ee,s,o,r);d!==i&&Ie(d)}function Ve(){try{ot?.releasePointerCapture?.(st)}catch{}Rt?.(),ke=null,Re=null,ot=null,st=null,t.dragging=!1,t.dropId=null,t.dropPlace=null}function rl(e,n,s){if(n.button!==0||!s||t.editingId||n.target?.closest?.("button, input"))return;vo(),Ne=s,De={x:n.clientX,y:n.clientY},at=n.currentTarget,rt=n.pointerId;const o=l=>il(e,l),r=l=>ll(e,l);Dt=()=>{e.document.removeEventListener("pointermove",o,!0),e.document.removeEventListener("pointerup",r,!0),e.document.removeEventListener("pointercancel",r,!0),Dt=null},e.document.addEventListener("pointermove",o,!0),e.document.addEventListener("pointerup",r,!0),e.document.addEventListener("pointercancel",r,!0)}function il(e,n){if(!Ne||!De)return;const s=n.clientX-De.x,o=n.clientY-De.y;if(!t.dragging&&s*s+o*o<25)return;if(!t.dragging){t.dragging=!0;try{at?.setPointerCapture?.(rt)}catch{}}n.preventDefault();const l=e.document.elementFromPoint(n.clientX,n.clientY)?.closest?.("[data-sve-ht-sec-uid]"),i=l?.getAttribute("data-sve-ht-sec-uid")||"";if(!i||i===Ne){t.sectionDrop=null;return}const d=l.getBoundingClientRect();t.sectionDrop={uid:i,place:n.clientY-d.top<d.height/2?"before":"after"}}function ll(e,n){const s=Ne,o=t.sectionDrop,r=t.dragging;vo(),r&&(ye=!0,e.setTimeout(()=>{ye=!1},0)),!(!r||!s||!o?.uid||o.uid===s)&&(n?.preventDefault?.(),dl(e,s,o.uid,o.place))}function vo(){try{at?.releasePointerCapture?.(rt)}catch{}Dt?.(),Ne=null,De=null,at=null,rt=null,t.dragging=!1,t.sectionDrop=null}function dl(e,n,s,o){const r=ct(e)||"page_sections";for(const l of Ut(e.document)||[]){const i=zt(l.values),d=i&&typeof i=="object"?i[r]:null;if(!Array.isArray(d))continue;const k=_=>d.findIndex(S=>S&&typeof S=="object"&&[S._visual_id,S.id,S._id].includes(_)),v=k(n),b=k(s);if(v===-1||b===-1||v===b)return!1;let u=o==="before"?b:b+1;return v<u&&(u-=1),u===v?!1:(e.postMessage({source:ne,type:te.MOVE,uid:n,toIndex:u},e.location.origin),e.setTimeout(()=>O(e),60),!0)}return!1}function go(e){const n=e.Statamic?.$config?.get?.("sveCollections");return Array.isArray(n)?n:[]}function cl(e){const n=e.Statamic?.$config?.get?.("sveNavigations");return Array.isArray(n)?n:[]}function hl(e){return[{handle:Ze,title:f(e,"antlers_nav_pages")},...cl(e).map(n=>({handle:n.handle,title:n.title}))]}function Vt(e,n){if(n?.kind==="component"){ul(e,n);return}if(X.callOpen&&(X.callOpen=!1,X.callStore=null,U.forget(),Gt(e)),n?.kind!=="antlers"){t.inspect=null;return}const s=n.id;if(n.tag==="else"){t.inspect={key:s,title:f(e,"antlers_condition"),mode:"note",note:f(e,"antlers_else_note")};return}if(n.antlers==="loop"){const o=n.loopKind==="collection",r=n.loopKind==="nav",l=ge?.id===n.id?ge.dir:"",i=n.sortDir||l,d=[{id:"field",label:f(e,"antlers_loop_field")},{id:"collection",label:f(e,"antlers_loop_collection")},{id:"nav",label:f(e,"antlers_loop_nav")}];if(r){const k=n.expr||Ze;t.inspect={key:s,title:f(e,"antlers_loop"),mode:"loop",loopKind:"nav",kinds:d,navs:hl(e),value:k,placeholder:f(e,"antlers_pick_nav"),nav:{depthTitle:f(e,"antlers_nav_depth"),depth:n.navDepth||"",depths:[{id:"",label:f(e,"antlers_nav_depth_all")},{id:"1",label:f(e,"antlers_nav_depth_1")},{id:"2",label:f(e,"antlers_nav_depth_2")},{id:"3",label:f(e,"antlers_nav_depth_3")}],homeAsked:k===Ze,homeLabel:f(e,"antlers_nav_include_home"),includeHome:!!n.includeHome},branches:[]};return}t.inspect={key:s,title:f(e,"antlers_loop"),mode:"loop",loopKind:o?"collection":"field",kinds:d,collections:go(e),value:n.expr||"",placeholder:f(e,o?"antlers_pick_collection":"antlers_loop_placeholder"),sort:{title:f(e,"antlers_sort"),dir:i,needsField:i==="asc"||i==="desc",field:n.sortField||"",pickable:!o,placeholder:f(e,o?"antlers_sort_field_entry":"antlers_sort_field"),dirs:[{id:"",label:f(e,"antlers_sort_none")},{id:"asc",label:f(e,"antlers_sort_asc")},{id:"desc",label:f(e,"antlers_sort_desc")},{id:"random",label:f(e,"antlers_sort_random")}]},limit:{title:f(e,n.paginate?"antlers_limit_per_page":"antlers_limit"),value:n.limit||"",placeholder:f(e,"antlers_limit_placeholder")},offset:{title:f(e,"antlers_offset"),value:n.offset||"",placeholder:f(e,"antlers_offset_placeholder")},branches:[]};return}t.inspect={key:s,title:f(e,"antlers_condition"),mode:"condition",value:n.expr||"",placeholder:f(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:f(e,"antlers_add_elseif")},{id:"else",label:f(e,"antlers_add_else")}]}}function ul(e,n){if(!Is(e)){t.inspect=null;return}if(!n.src)return;const s=n.id;if(t.inspect={key:s,title:f(e,"component_props_values"),mode:"note",note:f(e,"code_dock_loading")},Os()){const o={},r={},l=new Map;for(const[i,d]of As(z().slice(n.from,n.to))){const k=Rs(i);k&&(i!==k||!l.has(k))&&l.set(k,d)}for(const[i,d]of l)d.bound?r[i]=d.value:o[i]=d.value;wn!==s&&(wn=s,Be.clear());for(const i of Be)i in r||(r[i]="");t.inspect=null,X.callOpen=!0,X.title=X.title||f(e,"component_props"),X.callTitle=n.klass||n.name||n.src,X.callStore=U.ui,U.ui.canBind=!0,U.ui.dataTitle=f(e,"data_vars_title"),U.ui.exprPlaceholder=f(e,"component_props_expr"),U.ui.onToggleBind=(i,d)=>fl(e,i,d),U.ui.onExpr=(i,d)=>Pn(e,i,d),U.ui.onPickData=(i,d)=>T("dock:data-menu",{anchor:d,at:n.from,onPick:k=>Pn(e,i,String(k?.var||"").trim())}),U.load(e,{key:`${n.src}::${s}`,src:n.src,params:o,bindings:r,readOnly:T("dock:is-locked")===!0}),U.watch(e,{src:n.src,write:i=>pl(e,i,r)}),Gt(e);return}Ds(e,n.src).then(o=>{if(t.inspect?.key===s){if(!o.length){t.inspect={key:s,title:f(e,"component_props_values"),mode:"note",note:f(e,"component_props_values_none")};return}t.inspect={key:s,title:f(e,"component_props_values"),mode:"props",inheritLabel:f(e,"component_props_inherit"),rows:Fs(o,z().slice(n.from,n.to))}}})}function pl(e,n,s={}){const o=t.rows.find(i=>i.id===F);if(o?.kind!=="component"||T("dock:is-locked"))return;let r=z(),l=o.to;for(const[i,d]of Object.entries(n||{})){if(i in s)continue;const k=r.length,v=Zt(r,{from:o.from,to:l},i,d);v!==r&&(l+=v.length-k,r=v)}r!==z()&&(Ie(r,{save:!0}),O(e))}function fl(e,n,s){s?Be.add(n):Be.delete(n),ko(e,n,"",s),O(e)}function Pn(e,n,s){Be.add(n),ko(e,n,s,!0),O(e)}function ko(e,n,s,o){const r=t.rows.find(d=>d.id===F);if(r?.kind!=="component"||T("dock:is-locked"))return;const l=z(),i=Zt(l,r,n,s,{bound:o});i!==l&&Ie(i,{save:!0})}function lt(){const e=t.rows.find(n=>n.id===F);return e?.kind==="antlers"&&!T("dock:is-locked")?e:null}function Q(e,n){const s=lt();if(!s)return;const o=z(),r=n(o,s);r!==o&&(Ie(r),O(e))}function Hn(e,n,s,o){const r=t.rows.find(d=>d.id===F);if(r?.kind!=="component"||T("dock:is-locked"))return;const l=z(),i=Zt(l,r,n,s,{bound:o});i!==l&&(Ie(i,{save:!0}),O(e))}function ml(e,n){Q(e,(s,o)=>o.antlers==="loop"?Xe(s,o,o.loopKind==="collection"?"collection":"field",n):Us(s,o,n))}function vl(e,n){const s=lt();if(!s||s.antlers!=="loop")return;const o=s.loopKind==="collection"?"collection":s.loopKind==="nav"?"nav":"field";if(n!==o){if(n==="nav"){Q(e,(r,l)=>Xe(r,l,"nav",Ze));return}if(n==="collection"){const r=go(e)[0]?.handle;if(!r)return;Q(e,(l,i)=>Xe(l,i,"collection",r));return}Q(e,(r,l)=>Xe(r,l,"field",l.handle||"items"))}}function gl(e,n){Q(e,(s,o)=>zs(s,o,n))}function kl(e,n){if(!e||!n||zn(n)||Yn(n.tag))return null;const s=Ms(e,n);if(s<n.openTo)return null;const o=e.lastIndexOf(`
`,s-1)+1;return e.slice(o,s).trim()===""&&o>n.openTo?o-1:s}function dt(e,n,s){if(ye)return;const o=(s||t.rows).find(r=>r.id===n);o&&(F=n,t.rows.forEach(r=>{r.current=r.id===n}),Vt(e,o),!Qt()&&(T("dock:reveal-html",{from:o.from,to:o.to,caret:kl(z(),o)}),T("dock:tw-follow"),ue({source:ne,type:te.SVE_HTML_PICK_FOCUS,path:o.path},e)))}function yl(e,n){if(!n)return"";const s=[],o=(r,l)=>{for(const i of r||[]){const d=l||i.path===e;i.kind==="component"&&i.src===n&&s.push({path:i.path,inside:d}),o(i.children,d)}};return o(Ee,!1),(s.find(r=>r.inside)||s[0])?.path||""}function bl(e,n){if(!n||!G(e.document))return;Me=!1,We(n),O(e);const s=t.rows.find(o=>o.path===n);s&&(dt(e,s.id,t.rows),e.setTimeout(()=>{G(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function qt(e){if(et)return;const n=()=>{t.editingId||t.dragging||(e.clearTimeout(nt),nt=e.setTimeout(()=>{G(e.document)&&O(e)},80))},s=()=>{if(n(),T("dock:on-empty-page")===!0){const o=ft(e,e.document);o.length===1&&mt(e,e.document,o,o[0].uid,"")}};et=Nn("dock:html-changed",n),e.document.addEventListener("sve-page-structure",s),At=()=>{e.document.removeEventListener("sve-page-structure",s)}}function Tl(e){et?.(),et=null,At?.(),At=null,e?.clearTimeout?.(nt),nt=0}function on(e){const n=G(e.document);if(ue({source:ne,type:te.SVE_HTML_PICK,on:!1},e),Tl(e),U.forget(),X.callOpen=!1,X.callStore=null,Gt(e),Ve(),W(),Ls(e),F=null,t.inspect=null,t.editingId=null,t.draft="",t.sections=[],t.pageBuilder=!1,t.layoutFile=!1,ee="",e?.clearTimeout?.(Pe),!n){$t(e);return}n.remove(),Yt.headerTab==="html_tree"&&ts(e,null),ns(e),An(e),Rn(e),$t(e)}function Rl(e,n){n.querySelector("[data-sve-html-tree-list]")||(n.id=Ge,Ae(n,Xn,{title:f(e,"html_tree")}),n.querySelector("[data-sve-close]")?.addEventListener("click",()=>on(e)))}function Dl(e){qt(e),O(e)}function yo(e){const n=e.document;if(!Ao(e,"html_tree"))return;if(G(n)){qt(e),O(e);return}if(!so(n))return;Me=!0,j.clear(),os(e,[Ge]);const s=n.createElement("div");s.id=Ge,s.style.cssText=ss,Ae(s,Xn,{title:f(e,"html_tree")}),s.querySelector("[data-sve-close]")?.addEventListener("click",()=>on(e)),as(e,s),An(e),Rn(e),$t(e),qt(e),O(e)}function Fl(e){if(G(e.document)){on(e);return}yo(e)}Wt("html-tree:open-section",e=>{const n=window,s=n.document,o=ft(n,s),r=o.find(l=>l.uid===e||l.ids.includes(e));return r?(mt(n,s,o,r.uid,""),{uid:r.uid,ids:r.ids}):null});Wt("html-tree:from-preview",({path:e,src:n}={})=>{qn(window,e)||bl(window,yl(e,n)||e)});Wt("html-tree:arm-pick",e=>{const n=window;return e?(co(n,je(z(),to(n))),!0):(G(n.document)||ue({source:ne,type:te.SVE_HTML_PICK,on:!1},n),!0)});function Bl(){ae.clear(),Le.clear(),Ot.clear(),Qe.clear(),be.length=0}export{Li as HTML_TREE_STYLE_ID,Al as armHtmlTreePrefetch,Bl as clearHtmlTreeTemplates,W as closeHtmlTreeMenu,on as closeHtmlTreePanel,Mi as ensureHtmlTreeStyles,Rl as fillHtmlTreePane,F as htmlTreeActiveId,G as htmlTreePanel,nt as htmlTreeTimer,et as htmlTreeUnhook,yo as openHtmlTreePanel,O as renderHtmlTree,Dl as showHtmlTreePane,Tl as stopWatchHtmlTreeDock,Fl as toggleHtmlTreePanel,qt as watchHtmlTreeDock};
