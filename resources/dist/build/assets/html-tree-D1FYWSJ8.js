import{q as u,r as dn,o as m,c as g,a as O,t as I,u as r,e as cn,l as hn,F,i as te,f as S,w,a0 as Pe,L as j,ab as un,a4 as fn,af as be,j as Tt,ad as mn,$ as ie,aC as vn,v as eo,z as pn,V as gn,aD as kn,W as po,aE as yn,A as at,m as $t,p as Ft,U as $e,X as bn,aF as Tn,aG as xn}from"./addon-CroEH7Du.js";import{c as go,a as wn,o as _n,b as Sn,d as Cn,T as Hn,i as En,r as Ln,e as Pn,f as Mn,u as to,l as oo}from"./section-create-CFUsu3g7.js";import{canEditFields as In,currentSetHandle as Rn,openFieldsetOverlay as ko,openGlobalFieldsOverlay as On}from"./section-fields-Dv9ovRc9.js";import{T as t,U as $n,V as X,W as Fn,b,s as Dt,x as ce,j as xt,G as Dn,i as An,D as yo,E as bo,X as no,m as Me,C as Bn,R as Nn,F as jn,Y as Vn,Z as ao,_ as Kn,$ as To,a0 as xo,a1 as wo,a2 as Un,a3 as qn,a4 as _o,a5 as Yn,a6 as So,l as st,a7 as Be,a8 as Co,a9 as zn,aa as At,ab as Xn,ac as Gn,ad as Wn,v as Zn,ae as Jn,af as Qn,ag as ea,ah as ta,ai as oa,aj as Ho,z as na,ak as Bt}from"./lp-cluster-BQvcwZ5X.js";import{H as Ye,j as aa,d as sa}from"./shortcuts-CdrzQFO7.js";import{_ as Nt,o as Ne}from"./ChoiceDialog-Dde3xEbn.js";import{M as Z,S as J}from"./protocol-BVdEmGBQ.js";import{C as ra,H as je,s as jt,c as ia,a as la,b as Eo,t as da,d as Te,h as Lo,e as ca,f as ha,w as Vt,g as ua,i as fa,j as ma,p as va,r as pa,k as ga,l as ka,m as ya,v as ba,n as Ta,o as xa,q as wa,u as _a,x as Sa,y as Ca,z as Ha,A as so,B as Ea,D as La}from"./component-extract-DTrQbBiC.js";import{H as Pa,o as Ma,e as Ia}from"./logic-popup-BVAoqkXd.js";import{p as rt,f as Ra,i as Po,a as Mo,h as Oa,c as $a}from"./css-scope-BZTnmPYa.js";import{b as Fa}from"./html-pick-align-BNtmyz2s.js";import{l as Da,a as Aa,b as Ba,c as Na,d as ja,e as Va,f as Ka,g as Ua,h as qa}from"./loop-inspector-TFnm1m-I.js";import"./FieldsetOverlay-DX-FwnT8.js";import"./ai-text-icon-B7uCWIwa.js";import"./help-styles-Bafr50pq.js";const ut=/\s*([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/y,Ya=/^\s*(?:([A-Za-z_$][\w$]*)|'([^'\\]*)'|"([^"\\]*)")\s*:\s*(true|false)\s*$/;function za(e){const o=String(e||"").replace(/\{\{[\s\S]*?\}\}/g,s=>" ".repeat(s.length)),n=o.match(/^<[a-zA-Z][\w:-]*/);if(!n)return null;let a=n[0].length;for(;a<o.length;){ut.lastIndex=a;const s=ut.exec(o);if(!s){a+=1;continue}if(s[1].toLowerCase()==="x-data")return s[2]??s[3]??s[4]??"";a=ut.lastIndex}return null}function Xa(e,o){const n=e[o];for(let a=o+1;a<e.length;a+=1)if(e[a]==="\\")a+=1;else if(e[a]===n)return a;return e.length-1}function Ga(e){const o=String(e||""),n=o.search(/\S/);if(n===-1||o[n]!=="{")return[];const a=new Map;let s=0,i="";const d=()=>{const h=i.match(Ya);h&&a.set(h[1]??h[2]??h[3],h[4]==="true"),i=""};for(let h=n;h<o.length;h+=1){const p=o[h];if(p==='"'||p==="'"||p==="`"){const k=Xa(o,h);i+=o.slice(h,k+1),h=k;continue}if(p==="/"&&o[h+1]==="/"){const k=o.indexOf(`
`,h);h=k===-1?o.length:k-1;continue}if(p==="/"&&o[h+1]==="*"){const k=o.indexOf("*/",h+2);h=k===-1?o.length:k+1;continue}if(p==="{"||p==="["||p==="("){if(s+=1,s===1)continue}else if(p==="}"||p==="]"||p===")"){if(s-=1,s===0)break}else if(p===","&&s===1){d();continue}i+=p}return d(),[...a].map(([h,p])=>({key:h,value:p}))}const Wa={class:"sve-html-tree"},Za={class:"sve-pane-bar","data-sve-pane-bar":""},Ja={"data-sve-right-title":""},Qa={"data-sve-right-actions":""},es=["aria-pressed","title","aria-label"],ts=["title"],os={class:"sve-ht-used-by__label"},ns={class:"sve-ht-used-by__chips"},as=["title","onClick"],ss={key:1,class:"sve-ht-used-by__chip"},rs={key:0,class:"sve-ht-used-by__empty"},is={class:"sve-ht-tools"},ls=["title"],ds=["placeholder","aria-label","value"],cs=["aria-label"],hs=["title","aria-label"],us=["title","aria-label"],fs={key:3,class:"sve-tree-exit"},ms=["title"],vs=["title"],ps='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',gs='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',ks='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',ys='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',bs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/></svg>',Ts='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',xs={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const o=u(window,"html_tree_search");t.layers=$n(window);const n=u(window,"html_tree_layers_on"),a=u(window,"html_tree_layers_off");function s(){Fn(window,!t.layers)}const i=go(window),d=u(window,"section_new"),h=u(window,"html_tree_add_element"),p=u(window,"html_tree_sections_slot"),k=u(window,"html_tree_sections_no_field");function M(){const c=t.templateSections.length?t.templateSections:[un(window)],f=new Set(t.rows.filter(C=>C.kind==="sections").map(C=>C.tag));return c.filter(C=>!f.has(C)).map(C=>({tag:`sections:${C}`,label:c.length>1?`${p} · ${C}`:p,noField:!t.templateSections.length}))}const T=dn(!1),E=u(window,"section_import");function x(){T.value=!1}async function $(c){if(!c)return;await fn(),t.onRefresh?.();const f=b("html-tree:open-section",c);f&&Ln(window,f.ids)}function _(){const c=t.rows.find(f=>f.current&&!f.context&&!f.synthetic)||null;return c?.lockedIn?t.rows.filter(f=>f.locked&&f.from<=c.from&&f.to>=c.to).sort((f,C)=>f.from-C.from)[0]||null:c}function Q(c){const f=c.getBoundingClientRect(),C=_();let P=null;const N=(D,Se,ae="")=>()=>{P?.dismiss(),P=null,x();const lt=En(window,D,C,Se);lt!==null&&(t.selectFrom={at:lt,left:4},ae&&window.Statamic?.$toast?.info?.(ae))};P=Ne(document,je,{items:[...Hn.map(D=>({label:D,onPick:N(D,`<${D}>`)})),...M().map(D=>({label:D.label,onPick:N(D.tag,D.label,D.noField?k:"")}))],x:Math.round(f.left),y:Math.round(f.bottom+4),onClose:()=>{P=null,x()}})}function ee(c){if(!T.value){if(T.value=!0,!(t.sections.length||t.pageBuilder)){Q(c.currentTarget);return}(async()=>{const f=await wn(window);if(!f){x();return}const C=t.sections.length?t.sections[t.sections.length-1].uid:null,P=N=>{x(),$(N?.uid)};if(f==="static"){_n(window,{afterUid:C,onDone:P,onError:x,onClose:x});return}Sn(window,{afterUid:C,onDone:P,onError:x,onClose:x})})()}}function W(){if(T.value)return;T.value=!0;const c=!!(t.sections.length||t.pageBuilder);Cn(window,{intoTemplate:!c,after:c?null:_(),afterUid:c&&t.sections.length?t.sections[t.sections.length-1].uid:null,onDone:f=>{if(x(),c){$(f?.uid);return}Number.isInteger(f?.at)&&(t.selectFrom={at:f.at,left:4})},onError:x,onClose:x})}function v(c){const f=!!t.query;t.query=c,f!==!!c&&t.onQuery?.()}return(c,f)=>(m(),g("div",Wa,[O("div",Za,[O("div",Ja,I(e.title),1),O("div",Qa,[O("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":r(t).layers?"true":"false",title:r(t).layers?r(a):r(n),"aria-label":r(t).layers?r(a):r(n),innerHTML:ps,onClick:s},null,8,es),f[5]||(f[5]=cn('<button type="button" data-sve-right-pin aria-pressed="false" data-v-919f941f></button><button type="button" data-sve-close aria-label="Close" data-v-919f941f><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-919f941f><path d="M18 6 6 18" data-v-919f941f></path><path d="m6 6 12 12" data-v-919f941f></path></svg></button>',2))])]),r(t).usedBy?(m(),g("div",{key:0,class:"sve-ht-used-by",title:r(t).usedBy.hint||null},[O("span",os,[O("span",{class:"sve-ht-used-by__icon","aria-hidden":"true",innerHTML:bs}),hn(" "+I(r(t).usedBy.label),1)]),O("span",ns,[(m(!0),g(F,null,te(r(t).usedBy.items,C=>(m(),g(F,{key:C.kind+":"+C.name},[C.onOpen?(m(),g("button",{key:0,type:"button",class:"sve-ht-used-by__chip sve-ht-used-by__chip--open",title:C.openLabel,onClick:P=>C.onOpen(P.currentTarget)},I(C.name),9,as)):(m(),g("span",ss,I(C.name),1))],64))),128)),r(t).usedBy.empty?(m(),g("span",rs,I(r(t).usedBy.empty),1)):S("",!0)])],8,ts)):S("",!0),O("div",is,[O("label",{class:"sve-ht-search",title:r(o)},[O("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:ys}),O("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:r(o),"aria-label":r(o),value:r(t).query,autocomplete:"off",spellcheck:"false",onInput:f[0]||(f[0]=C=>v(C.target.value)),onKeydown:[f[1]||(f[1]=w(()=>{},["stop"])),f[2]||(f[2]=Pe(w(C=>v(""),["prevent"]),["escape"]))]},null,40,ds),r(t).query?(m(),g("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":r(o),innerHTML:Ts,onClick:f[3]||(f[3]=C=>v(""))},null,8,cs)):S("",!0)],8,ls),r(i)&&(r(t).sections.length||r(t).pageBuilder||r(t).rows.length&&!r(t).layoutFile)?(m(),g("button",{key:0,type:"button",class:"sve-ht-new",title:r(t).sections.length||r(t).pageBuilder?r(d):r(h),"aria-label":r(t).sections.length||r(t).pageBuilder?r(d):r(h),innerHTML:gs,onClick:ee},null,8,hs)):S("",!0),r(i)&&(r(t).sections.length||r(t).pageBuilder||r(t).rows.length&&!r(t).layoutFile)?(m(),g("button",{key:1,type:"button",class:"sve-ht-import",title:r(E),"aria-label":r(E),innerHTML:ks,onClick:W},null,8,us)):S("",!0)]),r(X).inSidebar?S("",!0):(m(),j(ra,{key:1})),f[6]||(f[6]=O("div",{"data-sve-html-tree-list":""},null,-1)),r(t).inspect?.logic?S("",!0):(m(),j(Pa,{key:2})),r(t).exitOpen&&!r(X).inSidebar?(m(),g("div",fs,[O("span",{class:"sve-tree-exit__name",title:r(t).exitName},I(r(t).exitName),9,ms),O("button",{type:"button",class:"sve-tree-exit__go",title:r(t).exitTitle,onClick:f[4]||(f[4]=C=>r(t).onExit?.())},I(r(t).exitLabel),9,vs)])):S("",!0)]))}},Io=Nt(xs,[["__scopeId","data-v-919f941f"]]);function Ro(e){return String(e||"").trim().toLowerCase()}function wt(e,o){return o?[e.name,e.tag,e.klass,e.label,e.src].filter(n=>typeof n=="string"&&n).join(" ").toLowerCase().includes(o):!0}function ws(e,o){const n=Ro(o);if(!n)return{rows:e,hits:new Set};const a=new Set;for(const d of e)wt(d,n)&&a.add(d.path);const s=[...a];return{rows:e.filter(d=>a.has(d.path)||s.some(h=>h.startsWith(`${d.path}/`))),hits:a}}const _s=["title"],Ss={"data-sve-ht-indent":"","aria-hidden":"true"},Cs=["data-sve-ht-cat"],Hs={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},Es={key:2,"data-sve-ht-letter":""},Ls=["innerHTML"],Ps=["title"],Ms=["data-sve-ht-classes","title"],Is={key:1,"data-sve-ht-kind":""},Rs={key:3,"data-sve-ht-name":""},Os={key:4,"data-sve-ht-actions":""},$s=["data-on","title","innerHTML"],Fs=["title"],Ds={key:5,"data-sve-ht-actions":""},As=["data-on","title","innerHTML"],Bs=["data-on","title","innerHTML"],Ns=["disabled","title","innerHTML"],js=["disabled","title"],Vs=["disabled","title"],Ks=["data-on","disabled","title","aria-pressed","innerHTML"],Us=["disabled","title"],qs=["data-sve-ht-id"],ro='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',Ys='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',zs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Xs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',Gs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',Ws='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',Zs='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',io='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6.5" width="20" height="11" rx="5.5"/><circle cx="7.5" cy="12" r="3" fill="currentColor" stroke="none"/></svg>',lo='<svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M7.5 5.5h9a6.5 6.5 0 0 1 0 13h-9a6.5 6.5 0 0 1 0-13ZM16.5 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6Z"/></svg>',Js='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',Qs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-.9"/></svg>',er='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',tr={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const o=In(window),n=u(window,"section_fields");function a(){const v=Rn();if(!v){window.Statamic?.$toast?.error(u(window,"section_fields_none"));return}ko(window,v)}function s(v){return v.synthetic?v.frame==="main"?t.frameMainTitle:v.frame==="template"?t.frameTemplateTitle:t.frameOpenTitle:v.kind==="component"?v.src?`partial:${v.src}`:v.tag:v.name?`${v.tag} ${v.name}`:v.tag}function i(v){return!!v.section}function d(v){return!!v.frame}function h(v){return v.kind==="slot"}function p(v,c){d(c)||h(c)||(i(c)?t.onSectionPointerDown?.(v,c.section):c.sectionRoot?t.onSectionPointerDown?.(v,c.sectionRoot):t.onPointerDown?.(v,c.id))}function k(v,c){if(v.synthetic){t.onFrame?.(v.frame);return}if(i(v)){t.onSection?.(v.section);return}t.onSelect?.(v.id,c)}function M(v,c){const f={"data-sve-ht-id":v.id};return v.locked&&(f["data-sve-ht-locked"]=""),v.current&&(f["data-sve-ht-current"]=""),v.hidden&&(f["data-sve-ht-hidden"]=""),f["data-sve-ht-cat"]=v.cat||"other",f["data-sve-ht-depth"]=String(v.depth),c&&(f["data-sve-ht-dim"]=""),i(v)&&(f["data-sve-ht-sec"]=""),d(v)&&(f["data-sve-ht-frame"]=v.frame),!i(v)&&t.dropId===v.id&&t.dropPlace&&(f["data-sve-ht-drop"]=t.dropPlace),f}function T(v){return!!v.fixed}function E(v){return v.kind==="sections"}function x(v){return!!(v.locked||v.lockedIn)}function $(v){return!v.lockedIn&&!T(v)}function _(v){return!T(v)&&!E(v)&&!x(v)&&(!v.hidden||v.wrapFrom!=null)}function Q(v){return!!v.sectionRoot||!!v.section}function ee(v){return t.canEdit&&!x(v)||Q(v)}function W(){return t.look==="tags"&&!t.layers}return(v,c)=>(m(),g(F,null,[O("div",be({"data-sve-ht-row":""},M(e.row,e.dim),{role:"button",tabindex:"0",title:s(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:c[41]||(c[41]=f=>k(e.row,f.currentTarget)),onDblclick:c[42]||(c[42]=w(f=>e.row.synthetic?r(t).onFrameEnter?.(e.row.frame):d(e.row)||h(e.row)||i(e.row)?null:r(t).onRename?.(e.row.id),["prevent"])),onKeydown:[c[43]||(c[43]=Pe(w(f=>k(e.row,f.currentTarget),["prevent"]),["enter"])),c[44]||(c[44]=Pe(w(f=>k(e.row,f.currentTarget),["prevent"]),["space"]))],onPointerdown:c[45]||(c[45]=f=>p(f,e.row)),onPointerenter:c[46]||(c[46]=f=>i(e.row)?r(t).onSectionHover?.(e.row.section):null),onContextmenu:c[47]||(c[47]=w(f=>d(e.row)||h(e.row)||i(e.row)?null:r(t).onContext?.(f,e.row.id),["prevent","stop"]))}),[O("span",Ss,[(m(!0),g(F,null,te(e.row.guides||[],(f,C)=>(m(),g("i",{key:C,"data-sve-ht-cat":f},null,8,Cs))),128))]),e.row.hasChildren||e.row.emptyBlock?(m(),g("button",be({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?r(t).mainShut:e.row.shut)?{"data-sve-ht-shut":""}:{},{innerHTML:Ys,onClick:c[0]||(c[0]=w(f=>e.row.synthetic?r(t).onFrameTwist?.():i(e.row)?r(t).onSection?.(e.row.section):r(t).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:c[1]||(c[1]=w(()=>{},["stop"])),onDblclick:c[2]||(c[2]=w(()=>{},["stop"]))}),null,16)):(m(),g("span",Hs)),e.row.letter?(m(),g("span",Es,I(e.row.letter),1)):(m(),g("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Ls)),O("span",{"data-sve-ht-text":"",title:r(t).renameTitle},[!e.row.kind&&!i(e.row)&&!d(e.row)?(m(),g("button",{key:0,type:"button","data-sve-ht-tag":"","data-sve-ht-classes":W()&&e.row.classes?e.row.classes:null,title:r(t).tagTitle,onClick:c[3]||(c[3]=w(()=>{},["stop","prevent"])),onPointerdown:c[4]||(c[4]=w(()=>{},["stop"])),onDblclick:c[5]||(c[5]=w(f=>r(t).onTagChange?.(f,e.row.id),["stop","prevent"]))},I(e.row.tag),41,Ms)):(m(),g("span",Is,I(e.row.tag),1)),r(t).editingId===e.row.id&&!i(e.row)?Tt((m(),g("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":c[6]||(c[6]=f=>r(t).draft=f),onMousedown:c[7]||(c[7]=w(()=>{},["stop"])),onPointerdown:c[8]||(c[8]=w(()=>{},["stop"])),onClick:c[9]||(c[9]=w(()=>{},["stop"])),onDblclick:c[10]||(c[10]=w(()=>{},["stop"])),onKeydown:[c[11]||(c[11]=w(()=>{},["stop"])),c[12]||(c[12]=Pe(w(f=>r(t).onRenameCommit?.(),["prevent"]),["enter"])),c[13]||(c[13]=Pe(w(f=>r(t).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:c[14]||(c[14]=f=>r(t).onRenameCommit?.())},null,544)),[[mn,r(t).draft]]):(m(),g("span",Rs,I(W()&&e.row.display?e.row.display:e.row.name),1))],8,Ps),d(e.row)?(m(),g("span",Os,[e.row.alpineNth>=0?(m(),g("button",{key:0,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:r(t).alpineTitle,innerHTML:e.row.alpineSet?lo:io,onClick:c[15]||(c[15]=w(f=>r(t).onAlpineState?.(f,e.row.id),["stop","prevent"])),onPointerdown:c[16]||(c[16]=w(()=>{},["stop"])),onDblclick:c[17]||(c[17]=w(()=>{},["stop"]))},null,40,$s)):S("",!0),e.row.frame!=="main"&&r(o)?(m(),g("button",{key:1,type:"button","data-sve-ht-fields":"",title:r(t).frameFieldsTitle,innerHTML:ro,onClick:c[18]||(c[18]=w(f=>r(t).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:c[19]||(c[19]=w(()=>{},["stop"])),onDblclick:c[20]||(c[20]=w(()=>{},["stop"]))},null,40,Fs)):S("",!0)])):!i(e.row)&&!h(e.row)?(m(),g("span",Ds,[e.row.videoNth>=0?(m(),g("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?r(t).videoPlayTitle:r(t).videoHoldTitle,innerHTML:e.row.videoHeld?Zs:Ws,onClick:c[21]||(c[21]=w(f=>r(t).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:c[22]||(c[22]=w(()=>{},["stop"])),onDblclick:c[23]||(c[23]=w(()=>{},["stop"]))},null,40,As)):S("",!0),e.row.alpineNth>=0?(m(),g("button",{key:1,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:r(t).alpineTitle,innerHTML:e.row.alpineSet?lo:io,onClick:c[24]||(c[24]=w(f=>r(t).onAlpineState?.(f,e.row.id),["stop","prevent"])),onPointerdown:c[25]||(c[25]=w(()=>{},["stop"])),onDblclick:c[26]||(c[26]=w(()=>{},["stop"]))},null,40,Bs)):S("",!0),_(e.row)?(m(),g("button",{key:2,type:"button","data-sve-ht-eye":"",disabled:!r(t).canEdit,title:r(t).canEdit?e.row.hidden?r(t).showTitle:r(t).hideTitle:r(t).lockedTitle,innerHTML:e.row.hidden?Xs:zs,onClick:c[27]||(c[27]=w(f=>r(t).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:c[28]||(c[28]=w(()=>{},["stop"])),onDblclick:c[29]||(c[29]=w(()=>{},["stop"]))},null,40,Ns)):S("",!0),r(o)&&e.row.fieldsIcon?(m(),g("button",{key:3,type:"button","data-sve-ht-fields":"",disabled:!r(t).canEdit,title:r(t).canEdit?r(n):r(t).lockedTitle,innerHTML:ro,onClick:w(a,["stop","prevent"]),onPointerdown:c[30]||(c[30]=w(()=>{},["stop"])),onDblclick:c[31]||(c[31]=w(()=>{},["stop"]))},null,40,js)):S("",!0),!T(e.row)&&!E(e.row)?(m(),g("button",{key:4,type:"button","data-sve-ht-dup":"",disabled:!ee(e.row),title:ee(e.row)?r(t).duplicateTitle:r(t).lockedTitle,innerHTML:Gs,onClick:c[32]||(c[32]=w(f=>r(t).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:c[33]||(c[33]=w(()=>{},["stop"])),onDblclick:c[34]||(c[34]=w(()=>{},["stop"]))},null,40,Vs)):S("",!0),$(e.row)?(m(),g("button",{key:5,type:"button","data-sve-ht-lock":"","data-on":e.row.locked?"":null,disabled:!r(t).canEdit||e.row.locked&&!r(t).canUnlock,title:e.row.locked?r(t).canUnlock?r(t).unlockTitle:r(t).lockedByTitle:r(t).lockTitle,"aria-pressed":e.row.locked?"true":"false",innerHTML:e.row.locked?Js:Qs,onClick:c[35]||(c[35]=w(f=>r(t).onLock?.(e.row.id),["stop","prevent"])),onPointerdown:c[36]||(c[36]=w(()=>{},["stop"])),onDblclick:c[37]||(c[37]=w(()=>{},["stop"]))},null,40,Ks)):S("",!0),T(e.row)?S("",!0):(m(),g("button",{key:6,type:"button","data-sve-ht-del":"",disabled:!ee(e.row),title:ee(e.row)?r(t).deleteTitle:r(t).lockedTitle,innerHTML:er,onClick:c[38]||(c[38]=w(f=>r(t).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:c[39]||(c[39]=w(()=>{},["stop"])),onDblclick:c[40]||(c[40]=w(()=>{},["stop"]))},null,40,Us))])):S("",!0)],16,_s),e.row.emptyBlock&&!e.row.shut?(m(),g("div",be({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},r(t).dropId===e.row.id&&r(t).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),I(r(t).slotText),17,qs)):S("",!0)],64))}},z=Nt(tr,[["__scopeId","data-v-bb48d74a"]]),or=["data-sve-ht-look","data-sve-ht-layers"],nr={key:0,class:"sve-ht-page-template"},ar={key:0,class:"sve-ht-page-template__text"},sr={class:"sve-ht-page-template__note"},rr={key:1,class:"sve-ht-empty"},ir={key:2,class:"sve-ht-empty"},lr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},dr={key:0,class:"sve-ht-empty"},cr={key:0,class:"sve-ht-empty"},hr=["data-sve-ht-under-main"],ur={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},fr={key:0,class:"sve-ht-empty"},mr=["data-sve-ht-under-main"],vr=["data-dim"],pr={key:0,class:"sve-ht-empty"},gr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},kr={key:0,class:"sve-ht-empty"},yr={key:4,"data-sve-ht-branch":"","data-sve-ht-cat":"component"},br={__name:"HtmlTreeList",setup(e){const o=ie(()=>Ro(t.query)),n=ie(()=>ws(t.rows,o.value)),a=ie(()=>n.value.rows),s=ie(()=>o.value?t.sections.filter(x=>wt(x.row,o.value)||x.current&&x.ready&&a.value.length>0):t.sections);function i(x){return!!x&&(!o.value||wt(x,o.value))}function d(x){const $=t.frame?.kind;return t.inComponent||($==="header"||$==="footer")&&$!==x}const h=ie(()=>t.frame?.kind==="header"||t.frame?.kind==="footer"),p=ie(()=>!!t.frame&&["header","main","footer"].some(x=>i(t.frame[x]))),k=ie(()=>!!t.frame&&(t.frame.kind==="main"||i(t.frame.main))),M=ie(()=>!!o.value&&!s.value.length&&!a.value.length&&!p.value);function T(x){return!!o.value&&!n.value.hits.has(x.path)}function E(x){const $={"data-sve-ht-sec-uid":x.uid};return x.current&&($["data-sve-ht-branch"]="",$["data-sve-ht-cat"]=x.row?.cat||"layout"),t.sectionDrop&&t.sectionDrop.uid===x.uid&&($["data-sve-ht-drop"]=t.sectionDrop.place),$}return(x,$)=>(m(),g("div",be({class:"sve-ht-root","data-sve-ht-look":r(t).layers?"tags":r(t).look,"data-sve-ht-layers":r(t).layers?"":null,style:r(t).familyStyle},r(t).dragging?{"data-sve-ht-dragging":""}:{}),[r(t).pageTemplate?(m(),g("div",nr,[r(t).pageTemplate.text?(m(),g("p",ar,I(r(t).pageTemplate.text),1)):S("",!0),O("p",sr,I(r(t).pageTemplate.note),1),r(t).pageTemplate.canOpen?(m(),g("button",{key:1,type:"button",class:"sve-ht-page-template__open",onClick:$[0]||($[0]=_=>r(t).pageTemplate.onOpen(_.currentTarget))},I(r(t).pageTemplate.openLabel),1)):S("",!0)])):!r(t).rows.length&&!r(t).sections.length&&!r(t).frame?(m(),g("div",rr,I(r(t).emptyText),1)):M.value?(m(),g("div",ir,I(r(t).searchEmpty),1)):S("",!0),r(t).frame||r(t).sections.length?(m(),g(F,{key:3},[r(t).frame?(m(),g(F,{key:0},[r(t).frame.kind==="header"?(m(),g("div",lr,[(m(!0),g(F,null,te(a.value,_=>(m(),j(z,{key:_.id,row:_,dim:T(_)},null,8,["row","dim"]))),128)),r(t).rows.length?S("",!0):(m(),g("div",dr,I(r(t).emptyText),1))])):!h.value&&i(r(t).frame.header)?(m(),j(z,{key:1,row:r(t).frame.header,dim:d("header")},null,8,["row","dim"])):S("",!0)],64)):S("",!0),h.value?S("",!0):(m(),g("div",vn(be({key:1},r(t).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[r(t).frame?.kind==="main"?(m(),g(F,{key:0},[(m(!0),g(F,null,te(a.value,_=>(m(),j(z,{key:_.id,row:_,dim:T(_)},null,8,["row","dim"]))),128)),r(t).rows.length?S("",!0):(m(),g("div",cr,I(r(t).emptyText),1))],64)):r(t).frame&&i(r(t).frame.main)?(m(),j(z,{key:1,row:r(t).frame.main,dim:d("main")},null,8,["row","dim"])):S("",!0),r(t).frame?.kind==="template"?Tt((m(),g("div",{key:2,"data-sve-ht-frame-body":"","data-sve-ht-under-main":k.value?"":null},[O("div",ur,[(m(!0),g(F,null,te(a.value,_=>(m(),j(z,{key:_.id,row:_,dim:T(_)},null,8,["row","dim"]))),128)),r(t).rows.length?S("",!0):(m(),g("div",fr,I(r(t).emptyText),1))])],8,hr)),[[eo,!r(t).mainShut]]):S("",!0),r(t).sections.length||r(t).frame?Tt((m(),g("div",{key:3,"data-sve-ht-frame-body":"","data-sve-ht-under-main":k.value?"":null},[r(t).frame?.template&&i(r(t).frame.template)?(m(),j(z,{key:0,row:r(t).frame.template,dim:d("template")},null,8,["row","dim"])):S("",!0),r(t).frame&&!r(t).frame.template&&!r(t).sections.length&&!o.value?(m(),g("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":d("")?"":void 0},I(r(t).frameEmptyText),9,vr)):S("",!0),(m(!0),g(F,null,te(s.value,_=>(m(),g("div",be({key:_.uid},{ref_for:!0},E(_)),[_.ready?(m(),g(F,{key:0},[(m(!0),g(F,null,te(a.value,Q=>(m(),j(z,{key:Q.id,row:Q,dim:T(Q)},null,8,["row","dim"]))),128)),r(t).rows.length?S("",!0):(m(),g("div",pr,I(r(t).emptyText),1))],64)):(m(),j(z,{key:1,row:_.row,dim:d("")},null,8,["row","dim"]))],16))),128))],8,mr)),[[eo,!r(t).frame||!r(t).mainShut]]):S("",!0)],16)),r(t).frame?(m(),g(F,{key:2},[r(t).frame.kind==="footer"?(m(),g("div",gr,[(m(!0),g(F,null,te(a.value,_=>(m(),j(z,{key:_.id,row:_,dim:T(_)},null,8,["row","dim"]))),128)),r(t).rows.length?S("",!0):(m(),g("div",kr,I(r(t).emptyText),1))])):!h.value&&i(r(t).frame.footer)?(m(),j(z,{key:1,row:r(t).frame.footer,dim:d("footer")},null,8,["row","dim"])):S("",!0)],64)):S("",!0)],64)):r(t).inComponent&&r(t).rows.length?(m(),g("div",yr,[(m(!0),g(F,null,te(a.value,_=>(m(),j(z,{key:_.id,row:_,dim:T(_)},null,8,["row","dim"]))),128))])):r(t).rows.length?(m(!0),g(F,{key:5},te(a.value,_=>(m(),j(z,{key:_.id,row:_,dim:T(_)},null,8,["row","dim"]))),128)):S("",!0)],16,or))}},ft=Nt(br,[["__scopeId","data-v-d0376715"]]);let mt=null;function Tr(e){return mt||(mt=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(o=>o.ok?o.json():{pages:[]}).then(o=>Array.isArray(o.pages)?o.pages:[]).catch(()=>[])),mt}let ze=null;function vt(){ze?.dismiss(),ze=null}function xr(e,o,n){vt();const a=o?.getBoundingClientRect?.(),s={x:a?a.left:0,y:a?a.bottom+4:0};Tr(e).then(i=>{const d=i.length?i.map(h=>({label:h.title||h.url,onPick:()=>{vt(),n(h.url)}})):[{label:u(e,"component_props_pages_none"),onPick:null}];vt(),ze=Ne(e.document,je,{items:d,x:s.x,y:s.y,onClose:()=>{ze=null}})})}const Oo="sve-html-tree-labels";function $o(){try{const e=globalThis.localStorage?.getItem(Oo);if(!e)return{};const o=JSON.parse(e);return o&&typeof o=="object"?o:{}}catch{return{}}}function wr(e){try{globalThis.localStorage?.setItem(Oo,JSON.stringify(e))}catch{}}function Fo(e){return String(e||"_")}function Do(e){const o=$o()[Fo(e)];return o&&typeof o=="object"?{...o}:{}}function _r(e,o,n){const a=n?.[o];return typeof a=="string"&&a.trim()?a.replace(/\s+/g," ").trim():String(e||"").trim()}function Sr(e,o,n,a){if(!o)return;const s=Fo(e),i=$o(),d={...i[s]||{}},h=String(n||"").replace(/\s+/g," ").trim(),p=String(a||"").trim();!h||h===p?delete d[o]:d[o]=h,Object.keys(d).length?i[s]=d:delete i[s],wr(i)}const V=ca("sve-call-values"),Cr="__sve-html-tree-style";function Hr(e,o,n){if(o||n)return!1;const a=String(b("dock:chrome-kind")||"");if(a==="header"||a==="footer")return!1;const s=po(e);return!!s&&s!=="create"&&bn(e)!==Tn(e)}function Ao(e){return{sectionLoops:yn(e),sectionsLabel:u(e,"html_tree_sections_slot")}}function Er(e,o){const n={entry:o,text:"",note:u(e,"html_tree_page_template_note"),openLabel:u(e,"html_tree_open_template"),canOpen:!1,onOpen:null};return Co(e,{entry:o}).then(a=>{!a||t.pageTemplate?.entry!==o||(t.pageTemplate={...t.pageTemplate,text:u(e,"html_tree_page_template",{name:a.name}),canOpen:!!a.open,onOpen:a.open?s=>zn(e,s,a.open):null})}),n}function Lr(e,o){const n=o.replace(/^view:/,"");if(!n||b("dock:current-type")!==o){t.usedBy=null,t.templateSections=[];return}t.usedBy?.view!==n&&(t.usedBy=null,Co(e,{view:n}).then(a=>{if(!a||b("dock:current-type")!==o)return;const s=a.everything?[{name:u(e,"html_tree_used_by_everything"),kind:"everything",url:null}]:a.used_by.map(i=>({...i,...Pr(e,i)}));t.templateSections=Array.isArray(a.sections_fields)?a.sections_fields:[],t.usedBy={view:n,label:u(e,"html_tree_used_by"),items:s,empty:s.length?"":u(e,"html_tree_used_by_nobody"),hint:s.length?u(e,"html_tree_used_by_hint",{list:s.map(i=>i.name).join(", ")}):""}}))}function Pr(e,o){if(!o.url)return{openLabel:"",onOpen:null};const n=u(e,"html_tree_used_by_open",{name:o.name});return o.kind==="page"?{openLabel:n,onOpen:a=>Jn(e,a,Qn(e,o.url))}:{openLabel:n,onOpen:a=>ea(e,{anchor:a,url:o.url,subtitle:o.name})}}const K=new Set;let _t="",ye=!1,pt=null,le=!0,U="",ve=0,Bo="";const pe=new Map,Ie=new Set,St=new Map,Xe=new Map;let B="",No=!1,R=null,Ge=null,Ue="",We="",Ze=0,Ct=null,xe=[],me=null,Re=null,Je=null,Qe=null,Ht=null,de=!1,ne=null,Fe=null,Oe=null,et=null,tt=null,Et=null,fe=null;function q(e){return e.getElementById(Ye)}function Mr(e){pn(e,Cr,`
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
      ${no("light")}
      /* How much of a row's own colour its pick takes: a wash, not a fill.
         The row mixes it in below — a mix written up here would read
         --sve-ht-c on the list, where no family is set. */
      --sve-ht-pick-mix: 11%;
      --sve-ht-pick-hover-mix: 18%;
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${no("dark")}
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

    /* ===== The Figma look ==================================================
       The tags look as the owner uses it from 27 Oct 2026: Figma's layer
       list. Every rule hangs off :not([data-sve-ht-layers]), so the layers
       look above — the tags rules plus its own — is exactly what it was.
       1. No box around the open section and no guide lines.
       2. Every row runs the full width; only what is in it steps in with its
          depth (the layers look's way of indenting), so a hover or a pick is
          one band.
       3. The row's name first, in the panel's sans — Heading, Container,
          Column 2 (html-tree.js, lib/element-kind.js) — and after it the tag
          and the classes, faint and in mono, without a chip. The tag is still
          the button a double-click changes.
       4. The picked row in the editor's blue, without a bar at the edge. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) {
      --sve-ht-figma-pick: rgba(56,88,233,.18);
      --sve-ht-figma-pick-ink: #3858e9;
      font: 450 0.75rem/1.35 Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
    }
    html.dark [data-sve-ht-look="tags"]:not([data-sve-ht-layers]),
    .dark [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) {
      --sve-ht-figma-pick: rgba(56,88,233,.28);
      --sve-ht-figma-pick-ink: #b4c1ff;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-branch] {
      border: 0;
      border-radius: 0;
      padding: 0;
      margin: 0;
      background: none;
      --sve-ht-inset: 0.375rem;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-frame-body] {
      margin: 0;
      padding: 0;
      box-shadow: none;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-frame-body][data-sve-ht-under-main] {
      --sve-ht-base: 1;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-indent] { display: none; }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] {
      margin: 0;
      padding-left: calc(var(--sve-ht-inset) + (var(--sve-ht-depth, 0) + var(--sve-ht-base, 0)) * var(--sve-ht-step));
      border-radius: 0.3125rem;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] + [data-sve-ht-row],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-sec] { margin-top: 0; margin-bottom: 0; }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row]:hover { background: rgba(128,128,128,.16); }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-current],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-current]:hover {
      background: var(--sve-ht-figma-pick);
      box-shadow: none;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-drop="before"]::before,
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-drop="after"]::after {
      left: calc(var(--sve-ht-inset) + 0.25rem + (var(--sve-ht-depth, 0) + var(--sve-ht-base, 0)) * var(--sve-ht-step));
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-sec-uid][data-sve-ht-drop="before"]::before,
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-sec-uid][data-sve-ht-drop="after"]::after {
      left: calc(var(--sve-ht-inset) + 0.25rem + var(--sve-ht-base, 0) * var(--sve-ht-step));
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-slot][data-sve-ht-id] {
      margin-left: calc((var(--sve-ht-depth, 0) + var(--sve-ht-base, 0)) * var(--sve-ht-step));
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-frame-slot] {
      margin-left: calc(var(--sve-ht-base, 0) * var(--sve-ht-step) + 0.75rem);
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-text] {
      font-family: inherit;
      font-size: 0.75rem;
      gap: 0.4rem;
    }
    /* The name keeps its room; the tag and the classes after it give way first. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] [data-sve-ht-name],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] [data-sve-ht-rename] {
      order: -1;
      flex: 0 1 auto;
      min-width: 1.5em;
      opacity: 1;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-depth="0"] [data-sve-ht-name] { font-weight: 600; }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] [data-sve-ht-tag],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] [data-sve-ht-kind] {
      flex: 0 100 auto;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0;
      background: none;
      opacity: 1;
      color: color-mix(in srgb, currentColor 45%, transparent);
      font: 400 0.6875rem/1.35 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      letter-spacing: 0;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] [data-sve-ht-tag]:hover {
      background: none;
      color: color-mix(in srgb, currentColor 70%, transparent);
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] [data-sve-ht-tag][data-sve-ht-classes]::after {
      content: " · " attr(data-sve-ht-classes);
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-current] [data-sve-ht-tag],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-current] [data-sve-ht-kind] {
      color: var(--sve-ht-figma-pick-ink);
      background: none;
    }
  `)}function Y(){const e=b("dock:html");return typeof e=="string"?e:""}function jo(e){return!!b("dock:is-open",e)}function _e(e,{save:o=!1,unlock:n=!1}={}){return Kt()||b("dock:set-html",n?{html:e,unlock:!0}:e)!==!0?!1:(o&&b("dock:save-now"),!0)}function gt(e){const o=b("dock:component-exit-state")||{};if(t.exitOpen=!!o.open,!o.open){t.onExit=null;return}t.exitName=o.name||"",t.exitLabel=u(e,"component_exit"),t.exitTitle=u(e,o.back?"component_exit_back":"component_exit_close"),t.onExit=()=>{b("dock:exit-component"),L(e)}}const De=[];let kt=!1;function yt(e,o){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(o,{timeout:2e3});return}e.setTimeout(o,200)}function Ir(e,o){for(const n of o){const a=n.type;!a||pe.has(a)||Ie.has(a)||De.includes(a)||De.push(a)}Dt.htmlTreePrefetchArmed&&Vo(e)}function $i(e){Dt.htmlTreePrefetchArmed=!0,Vo(e)}function Vo(e){if(kt||!De.length)return;kt=!0;const o=()=>{const n=De.shift();if(!n){kt=!1;return}if(pe.has(n)||Ie.has(n)){yt(e,o);return}Ie.add(n),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(n)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(a=>a.ok?a.json():null).then(a=>{if(typeof a?.html=="string"){pe.set(n,a.html);const s=Xe.get(n);Xe.delete(n),s&&s!==Ko(e,n)&&L(e)}}).catch(()=>{}).finally(()=>{Ie.delete(n),yt(e,o)})};yt(e,o)}function Kt(){return!!B}function Ko(e,o){return Uo(o)||xn(e,o)||"section"}function Uo(e){const o=pe.get(e);if(!o)return"";const n=St.get(e);if(n&&n.html===o)return n.tag;const a=Ut(rt(o))?.tag||"";return St.set(e,{html:o,tag:a}),a}function Ve(e,o){const n=at(e)||"page_sections",a=[];for(const s of $t(o)||[]){if(s.name===Yn||s.name===aa)continue;const i=Ft(s.values),d=i&&typeof i=="object"?i[n]:null;if(Array.isArray(d)){d.forEach(h=>{if(!h||typeof h!="object"||Array.isArray(h)||typeof h.type!="string")return;const p=[h._visual_id,h.id,h._id].filter(x=>typeof x=="string"&&x!=="");if(!p.length)return;const k=So(e,h),M=typeof h._sve_label=="string"?h._sve_label.trim():"",T=Ko(e,k);Uo(k)||Xe.set(k,T);const E=Do(k)[`0:${T}`];a.push({uid:p[0],ids:p,type:k,tag:T,label:M||(typeof E=="string"&&E.trim()?E.trim():"")||st(e,k)?.display||$e(k)||k,svg:Lo(T,co(T),null).svg||Te.section,cat:wo(T,co(T)),enabled:h.enabled!==!1,static:Pn(e,k)})});break}}return a}function Rr(e,o,n){if(!n.length)return"";const a=b("dock:current-type")||"",s=b("dock:current-uid"),i=!!b("dock:component-exit-state")?.open;if(s){const d=Be(s,o),h=n.find(p=>p.ids.some(k=>d.includes(k)));if(h&&(i||h.type===a))return h.uid}return n.find(d=>d.type===a)?.uid||""}function Or(e,o,n){const a=b("dock:component-exit-state");if(a?.open)return $e(a.name)||a.name||"";if(n)return o.find(i=>i.uid===n)?.label||"";const s=b("dock:current-type")||"";return String(s).startsWith("view:")?"":st(e,s)?.display||$e(s)||""}function it(e,o,n,a,s){const i=n.find(d=>d.uid===a);i&&a!==s&&(K.clear(),R=null,le=!1,G(),Ke(),U=a,Bo=Y(),B=pe.get(i.type)||"",B&&(R=Pt(rt(B))||null),No=(b("dock:current-type")||"")===i.type,e.clearTimeout(ve),ve=e.setTimeout(()=>{U="",ye=!1,L(e)},4e3),L(e),Zn(e,i.uid,"tree"),ce({source:J,type:Z.SVE_ACTIVATE,ids:i.ids},e),e.setTimeout(()=>L(e),0))}function Lt(e,o){if(!o)return!1;for(const n of e||[])if(n.id===o||Lt(n.children,o))return!0;return!1}function Pt(e){return Ut(e)?.id||""}function Ut(e){for(const o of e||[]){if(qo(o))return o;const n=Ut(o.children);if(n)return n}return null}function qo(e){return!e.kind||e.kind==="component"}function co(e){return e==="component"?"component":""}function $r(e,o){const n=o===0||e.path===We;return K.has(e.path)?n:!n}function Fr(e){const o=new Set,n=(a,s)=>{for(const i of a)i.children.length&&$r(i,s)&&o.add(i.id),n(i.children,s+1)};return n(e,0),o}function L(e){const o=e.document,a=q(o)?.querySelector("[data-sve-html-tree-list]");if(!a)return;Mr(o),la(e);const s=Y();B&&B===s&&(B=""),b("dock:chrome-kind")&&(B="");const i=B||s,d=rt(i,Ao(e));xe=d,We="";const h=b("dock:current-type")||"",p=Do(h),k=kn(e,o),T=!!(b("dock:component-exit-state")||{}).open;h&&s&&!B&&pe.set(h,s);const E=Ve(e,o);Ir(e,E);const x=Rr(e,o,E);if(Hr(e,k,T)){const l=po(e);xe=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!1,t.layoutFile=!1,t.usedBy=null,t.emptyText="",t.pageTemplate?.entry!==l&&(t.pageTemplate=Er(e,l)),t.onRefresh=()=>L(e),t.onSection=null,gt(e),Me(a,ft),bt(e,[]);return}t.pageTemplate=null,Lr(e,String(b("dock:collection-view")||""));const $=String(b("dock:chrome-kind")||"");if(Vn(e),k&&!E.length&&!$){xe=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,t.layoutFile=!1,t.emptyText=u(e,"html_tree_page_empty"),t.canEdit=!b("dock:is-locked"),t.look=ao(e),t.onRefresh=()=>L(e),t.onSection=null,gt(e),Me(a,ft),bt(e,[]);return}t.pageBuilder=k;const _=`${h}|${x}`;let Q=!1;_!==_t&&(_t=_,K.clear(),pt!==null&&i!==pt?Q=!0:ye=i),(Q||ye!==!1&&i!==ye)&&(ye=!1,K.clear(),R=Pt(d)||null),pt=i,U&&(U===x||!E.length)&&(No||i!==Bo)&&(e.clearTimeout(ve),U="",ye=!1,Lt(d,R)||(K.clear(),R=Pt(d)||null));const ee=E.some(l=>l.uid===U)?U:"",W=le?"":ee||x,v=!!(ee||x),c=v||T?"":String(b("dock:chrome-kind")||""),C=k&&(!h&&!v||c==="main"&&b("dock:on-empty-page")===!0),P=C||c==="template"?"":c;t.layoutFile=P==="main",P!=="main"&&(Ue="");const N=P==="main"?ho(d,"main"):null,D=N?ot(d,l=>l.tag==="body"&&Lt(l.children,N.id)):null;We=D?D.path:"",N&&(qe((D||N).path),Ue!==_&&(qe(N.path),K.add(N.path)));const Se=P==="header"||P==="footer"?ot(d,l=>i.slice(l.from,l.openTo).includes(`data-sve-chrome="${P}"`)):null,ae=Se||(P==="header"||P==="footer"?ho(d,P):null);ae&&qe(ae.path);const A=C||!(P==="main"?!!N:P==="header"||P==="footer"?!!ae:!0)?[]:Ra(d,t.query?new Set:Fr(d));!i.trim()&&!jo(o)?t.emptyText=u(e,"html_tree_need_dock"):t.emptyText=u(e,"html_tree_empty"),t.slotText=u(e,"antlers_drop_here"),t.dataTitle=u(e,"data_vars_title"),t.pageTitle=u(e,"component_props_page"),t.renameTitle=u(e,"html_tree_rename"),t.tagTitle=u(e,"tw_tag"),t.hideTitle=u(e,"html_tree_hide"),t.showTitle=u(e,"html_tree_show"),t.duplicateTitle=u(e,"html_tree_duplicate"),t.deleteTitle=u(e,"html_tree_delete"),t.videoHoldTitle=u(e,"html_tree_video_hold"),t.videoPlayTitle=u(e,"html_tree_video_play"),t.alpineTitle=u(e,"html_tree_alpine_state"),t.lockedTitle=u(e,"html_tree_locked"),t.searchEmpty=u(e,"html_tree_search_empty"),t.canEdit=!b("dock:is-locked"),t.look=ao(e),t.onQuery=()=>L(e),gt(e),t.inComponent=T,t.onSelect=(l,y)=>{const H=A.find(Ce=>Ce.id===l);if(H&&Eo(e,H.path))return;const ke=!!y&&H?.kind==="antlers"&&!de&&Kn(e);Ae(e,l,A),ke&&Ma(e,{path:H.path,at:y,beside:q(e.document)})},t.onTwist=l=>{const y=A.find(H=>H.id===l)?.path;y&&(K.has(y)?K.delete(y):K.add(y),L(e))},t.onTagChange=(l,y)=>{const H=t.rows.find(ke=>ke.id===y);H&&!Kt()&&!qt(e,H)&&da(e,l.currentTarget,H)},t.onRename=l=>Kr(e,l),t.onRenameCommit=()=>uo(e,!0),t.onRenameCancel=()=>uo(e,!1),t.onHide=l=>Gr(e,l),t.onLock=l=>Xr(e,l),t.canUnlock=zo(e),t.lockTitle=u(e,"html_tree_lock"),t.unlockTitle=u(e,"html_tree_unlock"),t.lockedByTitle=u(e,"html_tree_locked_by_developer"),t.onVideoHold=l=>qr(e,l),t.onAlpineState=(l,y)=>zr(e,l,y),t.onDuplicate=l=>Wr(e,l),t.onDelete=l=>Jr(e,l),t.onPointerDown=(l,y)=>oi(e,l,y),t.onSectionPointerDown=(l,y)=>si(e,l,y),t.onSectionHover=l=>e.dispatchEvent(new e.CustomEvent("sve-lite-hover",{detail:{uid:l}})),t.onContext=(l,y)=>ei(e,l,y),t.onInspectCommit=l=>ui(e,l),t.onPropValue=(l,y,H)=>vo(e,l,y,H),t.onPropPage=(l,y)=>xr(e,l,H=>vo(e,y,H,!1)),t.onLoopKind=l=>fi(e,l),t.onAddBranch=l=>mi(e,l),t.onLoopSortField=l=>{const y=nt();if(!y)return;const H=fe?.id===y.id?fe.dir:"";fe=null,oe(e,Da(y,l,H))},t.onLoopSortDir=l=>{const y=nt();if(!y)return;const H=Aa(y,l);if(H.draft){fe={id:y.id,dir:H.draft},Rt(e,y);return}fe=null,oe(e,H.edit)},t.onLoopDepth=l=>oe(e,ja(l)),t.onLoopIncludeHome=l=>oe(e,Va(l)),t.onLoopLimit=l=>oe(e,Ka(l)),t.onLoopOffset=l=>oe(e,Ua(l)),t.onPropHost=l=>l?V.mount(l):V.unmount(),t.onInspectData=(l,y)=>{b("dock:data-menu",{anchor:l,at:A.find(H=>H.id===R)?.from,onPick:H=>y(String(H?.var||"").trim())})};const Xt=A.find(qo)?.id,Gt=T?"":Or(e,E,W),he=W&&!T?E.find(l=>l.uid===W):null,on=To(e,String(b("dock:current-type")||""));let nn=0;const an=Yr(Se?[Se]:d,i),sn=xo(e,String(h)),se=P==="header"||P==="footer"?P:"",ge=ae?ae.id:"",ue=N&&A.find(l=>l.id===N.id)||null,Wt=D&&A.find(l=>l.id===D.id)||null,re=Wt||ue||ge&&A.find(l=>l.id===ge)||null,Zt=re?Nr(A,re):-1;if(re&&!A.slice(A.indexOf(re),Zt).some(l=>l.id===R)&&(R=re.id),t.selectFrom){const l=A.find(y=>y.from===t.selectFrom.at&&(!y.kind||y.kind==="sections"));l?(R=l.id,t.selectFrom=null):--t.selectFrom.left<=0&&(t.selectFrom=null)}const Jt=t.layoutFile?Br(e):null;t.rows=A.map(l=>{const y=Jt&&l.kind==="component"&&Jt.get(l.src)||"",H=l.tag==="body"&&!l.kind,ke=y?{svg:Te[y]}:Lo(l.tag,l.kind,l.antlers),Ce=l.tag==="video"&&!l.kind?nn++:-1,He=an.get(l.id),ln=He?sn[He.nth]||{}:{},ct=He?He.booleans.map(({key:Le,value:Qt})=>({key:Le,file:Qt,value:ln[Le]??Qt})):[],ht=l.id===Xt&&Gt?Gt:l.klass,Ee=l.id===Xt;return{...l,tag:y||l.tag,frameCall:y,fixed:!!y||H,base:ht,name:y?u(e,`html_tree_frame_${y}`):se&&l.id===ge?u(e,`html_tree_frame_${se}`):l===ue?u(e,"html_tree_frame_main"):Ee&&he?ht:_r(ht,l.path,p),current:l.id===R,letter:ke.letter||"",svg:se&&l.id===ge?Te[se]:l===ue?Te.main:Ee&&he?he.svg:ke.svg||"",frame:se&&l.id===ge?se:l===ue?"main":"",cat:se&&l.id===ge?se:l===ue||H?"main":y||wo(l.tag,l.kind,l.antlers),componentRoot:Ee&&T,sectionRoot:Ee&&he?he.uid:"",fieldsIcon:!!(Ee&&he&&!he.static),videoNth:Ce,videoHeld:Ce>=0&&on.has(Ce),alpineNth:ct.length?He.nth:-1,alpineKeys:ct,alpineSet:ct.some(Le=>Le.value!==Le.file)}});const rn=Ia(i,d);for(const l of t.rows){const y=l.kind?null:rn.get(l.path);y&&(l.classes=y.classes,y.kind!=="tag"&&!l.frame&&!l.fixed&&!l.sectionRoot&&l.name===l.klass&&(l.display=y.kind==="column"?u(e,"el_column",{n:y.index}):u(e,`el_${y.kind}`)))}Un(e),qn(e);const dt=[];for(const l of t.rows)dt.length=l.depth,l.guides=dt.slice(),dt[l.depth]=l.cat;if(re){const l=A.indexOf(re),y=re.depth;t.rows=t.rows.slice(l,Zt).map(H=>({...H,depth:H.depth-y,guides:H.guides.slice(y)})),ue&&Ue!==_&&(Ue=_,e.setTimeout(()=>Ae(e,ue.id,A),0))}t.sections=k&&!T&&(v||P||C)?E.map(l=>{const y=!!W&&l.uid===W;return{...l,current:y,ready:y&&(!ee||!!B),row:{id:`sec:${l.uid}`,section:l.uid,tag:l.tag,name:l.label,kind:"",svg:l.svg,cat:l.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:y,hidden:!l.enabled}}}):[],t.frame=Ar(e,E,v,T,P,!1,!!Wt),t.frameEmptyText=u(e,"html_tree_frame_no_sections"),Dr(e,P),t.onSection=l=>{de||(Mt(e),it(e,o,E,l,W))},t.onRefresh=()=>L(e),Rt(e,t.rows.find(l=>l.id===R)),Me(a,ft),bt(e,d)}function Dr(e,o){t.frameOpenTitle=u(e,"html_tree_frame_open"),t.frameMainTitle=u(e,"html_tree_frame_main_open"),t.frameTemplateTitle=u(e,"html_tree_frame_template_open"),t.frameFieldsTitle=u(e,"html_tree_frame_fields"),t.onFrame=n=>{o===n?jr(e,n):It(e,n)},t.onFrameEnter=n=>It(e,n),t.onFrameFields=n=>On(e,Gn(e,n),u(e,`html_tree_frame_${n}`)),t.onFrameTwist=()=>{t.mainShut=!t.mainShut}}function Ar(e,o,n,a,s,i=!1,d=!1){if(!s&&!i||d)return null;const h=M=>({id:`frame:${M}`,frame:M,synthetic:!0,tag:M,name:u(e,`html_tree_frame_${M}`),kind:"",svg:Te[M]||"",cat:M,letter:"",depth:0,hasChildren:M==="main"&&(o.length>0||s==="template"),shut:M!=="main",current:!1,hidden:!1}),p={kind:s,header:h("header"),main:h("main"),footer:h("footer"),template:null},k=s&&s!=="template"?String(b("dock:collection-view")||""):"";return k&&(p.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:st(e,k)?.display||$e(k.replace(/^view:/,"")),kind:"",svg:Te.section||"",cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),p}function ho(e,o){return ot(e,n=>n.tag===o)}function ot(e,o){for(const n of e||[]){if(!n.kind&&o(n))return n;const a=ot(n.children,o);if(a)return a}return null}function Br(e){const o=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},n=new Map;for(const a of["header","footer"]){const s=ua(o[a]?.type);s&&n.set(s,a)}return n}function Nr(e,o){let n=e.indexOf(o)+1;for(;n<e.length&&e[n].depth>o.depth;)n+=1;return n}function jr(e,o){const n=Ho(e);(o==="main"||o==="template"?n?.querySelector("main"):n?.querySelector(`[data-sve-chrome="${o}"]`))?.scrollIntoView({behavior:"smooth",block:"start"})}function Mt(e){const o=String(b("dock:chrome-open",e.document)||"");return o!=="header"&&o!=="footer"?!1:(Wn(e),ce({source:J,type:Z.SVE_FORCE_EXIT_CHROME},e),!0)}function Vr(e){e.clearTimeout(ve),U="",B="",K.clear(),R=null,le=!1,G(),Ke()}function It(e,o){if(e.document,String(b("dock:chrome-kind")||"")===o)return;if(Vr(e),o==="main"){Mt(e),b("dock:open-file",sa);return}if(o==="template"){const i=String(b("dock:collection-view")||"");i&&(Mt(e),b("dock:open-file",i));return}if(o!=="header"&&o!=="footer")return;const n=Ho(e)?.querySelector(`[data-sve-chrome="${o}"]`);n?(n.scrollIntoView({block:"nearest"}),n.dispatchEvent(new n.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:J,type:Z.OPEN_CHROME,kind:o},e.location.origin);const a=Date.now(),s=async()=>{if(String(b("dock:chrome-kind")||"")!==o){Date.now()-a<3e4&&e.setTimeout(s,250);return}await(b("dock:load-settled")||null),tn(e)};e.setTimeout(s,250)}function bt(e,o){q(e.document)&&Yo(e,o)}function Yo(e,o){const n=o[0],a=!!b("dock:component-src"),s=a?"":b("dock:current-uid")||"";ce({source:J,type:Z.SVE_HTML_PICK,on:!0,uid:s,uids:s?Be(s,e.document):[],all:a,tag:n?.tag||"",klass:n?.klass||"",nodes:Fa(o)},e)}function qe(e){if(!e)return;const o=(n,a)=>{for(const s of n||[]){if(s.path===e)return!0;if(o(s.children,a+1))return a===0||s.path===We?K.delete(s.path):K.add(s.path),!0}return!1};o(xe,0)}function Kr(e,o){if(de)return;const n=t.rows.find(a=>a.id===o);qt(e,n)||!n||n.kind||(R=o,t.rows.forEach(a=>{a.current=a.id===o}),t.editingId=o,t.draft=n.name,e.setTimeout(()=>{const a=q(e.document)?.querySelector("[data-sve-ht-rename]");a?.focus(),a?.select()},0))}function uo(e,o){const n=t.editingId;if(!n)return;const a=t.rows.find(s=>s.id===n);t.editingId=null,o&&a&&(a.sectionRoot?Ur(e,a.sectionRoot,t.draft):Sr(b("dock:current-type")||"",a.path,t.draft,a.base||a.klass)),t.draft="",L(e)}function Ur(e,o,n){const a=at(e)||"page_sections",s=String(n||"").replace(/\s+/g," ").trim();for(const i of $t(e.document)||[]){const d=Ft(i.values),h=d&&typeof d=="object"?d[a]:null;if(!Array.isArray(h))continue;const p=h.findIndex(E=>E&&typeof E=="object"&&[E._visual_id,E.id,E._id].includes(o));if(p===-1)continue;const k=So(e,h[p]),M=st(e,k)?.display||$e(k)||k,T=JSON.parse(JSON.stringify(h));return T[p]={...T[p]},!s||s===M?delete T[p]._sve_label:T[p]._sve_label=s,i.setFieldValue(a,T),!0}return!1}function qr(e,o){const n=t.rows.find(h=>h.id===o);if(!n||!(n.videoNth>=0))return;const a=String(b("dock:current-type")||""),s=To(e,a),i=!s.has(n.videoNth);i?s.add(n.videoNth):s.delete(n.videoNth);const d=String(b("dock:current-uid")||"");Xn(e,a,s),ce({source:J,type:Z.SVE_VIDEO_HOLD,uid:d,uids:d?Be(d,e.document):[],nth:n.videoNth,on:i},e),L(e)}function Yr(e,o){const n=new Map;let a=0;const s=i=>{for(const d of i){if(d.hidden)continue;const h=d.kind?null:za(o.slice(d.from,d.openTo));h!==null&&n.set(d.id,{nth:a++,booleans:Ga(h)}),s(d.children||[])}};return s(e),n}function zr(e,o,n){const a=t.rows.find(i=>i.id===n);if(!a||!(a.alpineNth>=0))return;if(a.alpineKeys.length===1){fo(e,a,a.alpineKeys[0]);return}const s=o.currentTarget.getBoundingClientRect();G(),ne=Ne(e.document,je,{items:a.alpineKeys.map(i=>({label:i.key,icon:i.value?Go:Wo,onPick:()=>{G(),fo(e,a,i)}})),x:Math.round(s.left),y:Math.round(s.bottom+4),onClose:()=>{ne=null}})}function fo(e,o,n){const a=String(b("dock:current-type")||""),s=xo(e,a),i=!n.value,d=i!==n.file,h={...s[o.alpineNth]||{}};d?h[n.key]=i:delete h[n.key],Object.keys(h).length?s[o.alpineNth]=h:delete s[o.alpineNth];const p=ta(String(b("dock:chrome-kind")||"")),k=p?"":String(b("dock:current-uid")||"");oa(e,a,s),ce({source:J,type:Z.SVE_ALPINE_STATE,uid:k,uids:k?Be(k,e.document):[],chrome:p,nth:o.alpineNth,key:n.key,value:i,on:d},e),L(e)}function qt(e,o){return!o||!(o.locked||o.lockedIn)?!1:(e.Statamic?.$toast?.error(u(e,"html_tree_locked_element")),!0)}function zo(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function Xr(e,o){const n=t.rows.find(a=>a.id===o);if(!(!n||n.lockedIn||b("dock:is-locked"))){if(!n.locked){we(e,o,_a,{lockAction:!0});return}if(!zo(e)){e.Statamic?.$toast?.error(u(e,"html_tree_unlock_denied"));return}At(e,{titleKey:"html_tree_unlock_title",bodyKey:"html_tree_unlock_body",confirmKey:"html_tree_unlock_confirm"},()=>we(e,o,Sa,{lockAction:!0,unlock:!0}))}}function Yt(e){return!!t.rows.find(o=>o.id===e)?.fixed}function Gr(e,o){Yt(o)||we(e,o,Ca)}function Wr(e,o){if(Yt(o))return;const n=t.rows.find(a=>a.id===o)?.sectionRoot;if(n){e.postMessage({source:J,type:Z.DUPLICATE_ROW,uid:n},e.location.origin);return}we(e,o,Ha)}function Xo(e,o){At(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const n=e.document;na({uid:o},n,e)})}function Zr(e,o,n){U===n&&(e.clearTimeout(ve),U="",B=""),R=null,le=!1,_t="";const a=Ve(e,o),s=a.find(i=>i.uid!==n)||a[0];s?it(e,o,a,s.uid,""):(B="",t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,L(e)),e.setTimeout(()=>{q(e.document)&&L(e)},0)}_o("row:removed",({uid:e,parentPath:o,doc:n,win:a})=>{o!==at(a)||!q(a.document)||Zr(a,n,e)});function Jr(e,o){if(Yt(o))return;const n=t.sections?.find(s=>s.row?.id===o),a=n?n.row?.section||n.uid:t.rows.find(s=>s.id===o)?.sectionRoot;if(a){Xo(e,a);return}if(t.rows.find(s=>s.id===o)?.kind==="sections"){At(e,{titleKey:"html_tree_sections_remove_title",bodyKey:"html_tree_sections_remove_body",confirmKey:"html_tree_sections_remove_confirm"},()=>we(e,o,so));return}we(e,o,so)}function we(e,o,n,{lockAction:a=!1,unlock:s=!1}={}){if(b("dock:is-locked"))return;const i=Y(),d=t.rows.find(p=>p.id===o);if(!d||!a&&qt(e,d))return;const h=n(i,d);h!==i&&_e(h,{unlock:s})}function G(){ne?.dismiss(),ne=null}const Go='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',Wo='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>';function Zo(e,o){const n=t.sections?.find(p=>p.uid===o),a=n?.type||"";if(!a||!go(e))return[];const s=n.label||a,i=Mn(e,a),d=()=>e.Statamic?.$toast?.error(u(e,"section_update_failed")),h=[{label:u(e,"static_section_insertable"),icon:i?Wo:Go,onPick:()=>{G(),to(e,{handle:a,hidden:!i}).then(()=>{e.Statamic?.$toast?.success(u(e,i?"section_shown_to_editors":"section_hidden_from_editors",{name:s})),oo(e)}).catch(d)}}];return n.static&&h.push({label:u(e,"section_add_fields"),onPick:()=>{G(),to(e,{handle:a,fields:!0}).then(()=>{e.Statamic?.$toast?.success(u(e,"section_fields_added",{name:s})),oo(e),L(e),ko(e,a)}).catch(d)}}),h}function Qr(e,o,n){const a=n.row?.section||n.uid;a&&(ne=Ne(e.document,je,{items:[...Zo(e,a),{label:u(e,"html_tree_remove_section"),danger:!0,onPick:()=>{G(),Xo(e,a)}}],x:o.clientX,y:o.clientY,onClose:()=>{ne=null}}))}function ei(e,o,n){G();const a=t.sections?.find(h=>h.row?.id===n);if(a){Qr(e,o,a);return}const s=t.rows.find(h=>h.id===n);if(!s)return;Ae(e,n,t.rows);const i={x:o.clientX,y:o.clientY},d=h=>{h.length&&(ne?.dismiss(),ne=Ne(e.document,je,{items:h,x:i.x,y:i.y,onClose:()=>{ne=null}}))};if(s.frameCall){d([{label:u(e,"html_tree_frame_edit",{frame:u(e,`chrome_${s.frameCall}`)}),onPick:()=>{G(),It(e,s.frameCall)}}]);return}if(s.kind==="component"){ti(e,s,d);return}s.kind==="slot"||s.kind==="sections"||s.kind==="svg"||s.locked||s.lockedIn||t.canEdit&&(s.componentRoot||d([...s.sectionRoot?Zo(e,s.sectionRoot):[],{label:u(e,"component_make"),onPick:()=>{G(),ha(e,s,{onDone:()=>L(e),onError:h=>{e.alert(h?.status===409?u(e,"component_exists"):u(e,"component_failed"))}})}}]))}const mo=(e,o)=>{G(),b("dock:open-template",o)};function ti(e,o,n){if(!Oa(o.src)){n([{label:u(e,"component_open_named",{name:$a(o.src)||o.src}),onPick:()=>mo(e,`view:partials/${o.src}`)}]);return}n([{label:u(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(o.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(a=>a.ok?a.json():{items:[]}).then(a=>{const s=Array.isArray(a.items)?a.items:[];n(s.length?s.map(i=>({label:u(e,"component_open_named",{name:i.label}),onPick:()=>mo(e,i.type)})):[{label:u(e,"component_none"),onPick:null}])}).catch(()=>n([{label:u(e,"component_none"),onPick:null}]))}function oi(e,o,n){if(o.button!==0||b("dock:is-locked")||t.editingId)return;const a=t.rows.find(d=>d.id===n);if(a&&(a.locked||a.lockedIn)||o.target?.closest?.("button, input"))return;Ke(),me=n,Re={x:o.clientX,y:o.clientY},Je=o.currentTarget,Qe=o.pointerId;const s=d=>ni(e,d),i=d=>ai(e,d);Ht=()=>{e.document.removeEventListener("pointermove",s,!0),e.document.removeEventListener("pointerup",i,!0),e.document.removeEventListener("pointercancel",i,!0),Ht=null},e.document.addEventListener("pointermove",s,!0),e.document.addEventListener("pointerup",i,!0),e.document.addEventListener("pointercancel",i,!0)}function ni(e,o){if(!me||!Re)return;const n=o.clientX-Re.x,a=o.clientY-Re.y;if(!t.dragging&&n*n+a*a<25)return;if(!t.dragging){t.dragging=!0;try{Je?.setPointerCapture?.(Qe)}catch{}}o.preventDefault();const s=e.document.elementFromPoint(o.clientX,o.clientY),i=s?.closest?.("[data-sve-ht-slot]");if(i){const T=i.getAttribute("data-sve-ht-id");if(T&&T!==me){t.dropId=T,t.dropPlace="inside";return}}const d=s?.closest?.("[data-sve-ht-row]"),h=d?.getAttribute("data-sve-ht-id");if(!h||h===me){t.dropId=null,t.dropPlace=null;return}const p=t.rows.find(T=>T.id===h),k=t.rows.find(T=>T.id===me);if(!p||p.lockedIn||k&&p.path.startsWith(`${k.path}/`)){t.dropId=null,t.dropPlace=null;return}const M=d.getBoundingClientRect();t.dropId=h,t.dropPlace=Ta(o.clientY-M.top,M.height,!Mo(p.tag)&&!Po(p)&&!p.locked)}function ai(e,o){const n=me,a=t.dropId,s=t.dropPlace||"after",i=t.dragging;if(Ke(),i&&(de=!0,e.setTimeout(()=>{de=!1},0)),!i||b("dock:is-locked")||!n||!a||n===a)return;o?.preventDefault?.();const d=Y(),h=xa(d,xe,n,a,s);h!==d&&_e(h)}function Ke(){try{Je?.releasePointerCapture?.(Qe)}catch{}Ht?.(),me=null,Re=null,Je=null,Qe=null,t.dragging=!1,t.dropId=null,t.dropPlace=null}function si(e,o,n){if(o.button!==0||!n||t.editingId||o.target?.closest?.("button, input"))return;Jo(),Fe=n,Oe={x:o.clientX,y:o.clientY},et=o.currentTarget,tt=o.pointerId;const a=i=>ri(e,i),s=i=>ii(e,i);Et=()=>{e.document.removeEventListener("pointermove",a,!0),e.document.removeEventListener("pointerup",s,!0),e.document.removeEventListener("pointercancel",s,!0),Et=null},e.document.addEventListener("pointermove",a,!0),e.document.addEventListener("pointerup",s,!0),e.document.addEventListener("pointercancel",s,!0)}function ri(e,o){if(!Fe||!Oe)return;const n=o.clientX-Oe.x,a=o.clientY-Oe.y;if(!t.dragging&&n*n+a*a<25)return;if(!t.dragging){t.dragging=!0;try{et?.setPointerCapture?.(tt)}catch{}}o.preventDefault();const i=e.document.elementFromPoint(o.clientX,o.clientY)?.closest?.("[data-sve-ht-sec-uid]"),d=i?.getAttribute("data-sve-ht-sec-uid")||"";if(!d||d===Fe){t.sectionDrop=null;return}const h=i.getBoundingClientRect();t.sectionDrop={uid:d,place:o.clientY-h.top<h.height/2?"before":"after"}}function ii(e,o){const n=Fe,a=t.sectionDrop,s=t.dragging;Jo(),s&&(de=!0,e.setTimeout(()=>{de=!1},0)),!(!s||!n||!a?.uid||a.uid===n)&&(o?.preventDefault?.(),li(e,n,a.uid,a.place))}function Jo(){try{et?.releasePointerCapture?.(tt)}catch{}Et?.(),Fe=null,Oe=null,et=null,tt=null,t.dragging=!1,t.sectionDrop=null}function li(e,o,n,a){const s=at(e)||"page_sections";for(const i of $t(e.document)||[]){const d=Ft(i.values),h=d&&typeof d=="object"?d[s]:null;if(!Array.isArray(h))continue;const p=E=>h.findIndex(x=>x&&typeof x=="object"&&[x._visual_id,x.id,x._id].includes(E)),k=p(o),M=p(n);if(k===-1||M===-1||k===M)return!1;let T=a==="before"?M:M+1;return k<T&&(T-=1),T===k?!1:(e.postMessage({source:J,type:Z.MOVE,uid:o,toIndex:T},e.location.origin),e.setTimeout(()=>L(e),60),!0)}return!1}function Rt(e,o){if(o?.kind==="component"){di(e,o);return}if(X.callOpen&&(X.callOpen=!1,X.callStore=null,V.forget(),jt(e)),o?.kind!=="antlers"){t.inspect=null;return}const n=o.id,a={logic:!0,path:o.path};if(o.tag==="else"){t.inspect={key:n,...a,title:u(e,"antlers_condition"),mode:"note",note:u(e,"antlers_else_note")};return}if(o.antlers==="loop"){t.inspect={...Na(e,o,{key:n,draft:fe?.id===o.id?fe.dir:""}),...a};return}t.inspect={key:n,...a,title:u(e,"antlers_condition"),mode:"condition",value:o.expr||"",placeholder:u(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:u(e,"antlers_add_elseif")},{id:"else",label:u(e,"antlers_add_else")}]}}function di(e,o){if(!ma(e)){t.inspect=null;return}if(!o.src)return;const n=o.id;if(t.inspect={key:n,title:u(e,"component_props_values"),mode:"note",note:u(e,"code_dock_loading")},va()){const a={},s={},i=new Map;for(const[d,h]of pa(Y().slice(o.from,o.to))){const p=ga(d);p&&(d!==p||!i.has(p))&&i.set(p,h)}for(const[d,h]of i)h.bound?s[d]=h.value:a[d]=h.value;t.inspect=null,X.callOpen=!0,X.title=X.title||u(e,"component_props"),X.callTitle=o.klass||o.name||o.src,X.callStore=V.ui,V.ui.canBind=!0,V.ui.dataTitle=u(e,"data_vars_title"),V.ui.exprPlaceholder=u(e,"component_props_expr"),V.ui.onBox=(d,h)=>hi(e,d,h),V.ui.onPickData=(d,h)=>b("dock:data-menu",{anchor:h,at:o.from,types:ka(V.ui.fields.find(p=>p.handle===d)?.type),onPick:p=>Qo(e,d,String(p?.var||"").trim())}),V.load(e,{key:`${o.src}::${n}`,src:o.src,params:a,bindings:s,readOnly:b("dock:is-locked")===!0}),V.watch(e,{src:o.src,write:d=>ci(e,d,s)}),jt(e);return}ya(e,o.src).then(a=>{if(t.inspect?.key===n){if(!a.length){t.inspect={key:n,title:u(e,"component_props_values"),mode:"note",note:u(e,"component_props_values_none")};return}t.inspect={key:n,title:u(e,"component_props_values"),mode:"props",inheritLabel:u(e,"component_props_inherit"),rows:ba(a,Y().slice(o.from,o.to))}}})}function ci(e,o,n={}){const a=t.rows.find(d=>d.id===R);if(a?.kind!=="component"||b("dock:is-locked"))return;let s=Y(),i=a.to;for(const[d,h]of Object.entries(o||{})){if(d in n)continue;const p=s.length,k=Vt(s,{from:a.from,to:i},d,h);k!==s&&(i+=k.length-p,s=k)}s!==Y()&&(_e(s,{save:!0}),L(e))}function Qo(e,o,n){en(e,o,n,!0),L(e)}function hi(e,o,n){const a=wa(n);if(a){Qo(e,o,a);return}V.forget(),en(e,o,String(n??"").trim(),!1),L(e)}function en(e,o,n,a){const s=t.rows.find(h=>h.id===R);if(s?.kind!=="component"||b("dock:is-locked"))return;const i=Y(),d=Vt(i,s,o,n,{bound:a});d!==i&&_e(d,{save:!0})}function nt(){const e=t.rows.find(o=>o.id===R);return e?.kind==="antlers"&&!b("dock:is-locked")?e:null}function oe(e,o){const n=nt();if(!n)return;const a=Y(),s=o(a,n);s!==a&&(_e(s),L(e))}function vo(e,o,n,a){const s=t.rows.find(h=>h.id===R);if(s?.kind!=="component"||b("dock:is-locked"))return;const i=Y(),d=Vt(i,s,o,n,{bound:a});d!==i&&(_e(d,{save:!0}),L(e))}function ui(e,o){oe(e,(n,a)=>a.antlers==="loop"?qa(a,o)(n,a):Ea(n,a,o))}function fi(e,o){const n=nt();if(!n||n.antlers!=="loop")return;const a=Ba(e,n,o);a&&oe(e,a)}function mi(e,o){oe(e,(n,a)=>La(n,a,o))}function vi(e,o){if(!e||!o||Po(o)||Mo(o.tag))return null;const n=fa(e,o);if(n<o.openTo)return null;const a=e.lastIndexOf(`
`,n-1)+1;return e.slice(a,n).trim()===""&&a>o.openTo?a-1:n}function Ae(e,o,n,{reveal:a=!0}={}){if(de)return;const s=(n||t.rows).find(i=>i.id===o);s&&(R=o,t.rows.forEach(i=>{i.current=i.id===o}),Rt(e,s),!Kt()&&(a&&(b("dock:reveal-html",{from:s.from,to:s.to,caret:vi(Y(),s)}),b("dock:tw-follow")),ce({source:J,type:Z.SVE_HTML_PICK_FOCUS,path:s.path,src:s.kind==="component"&&s.src||""},e)))}function pi(e,o){if(!o)return"";const n=[],a=(s,i)=>{for(const d of s||[]){const h=i||d.path===e;d.kind==="component"&&d.src===o&&n.push({path:d.path,inside:h}),a(d.children,h)}};return a(xe,!1),(n.find(s=>s.inside)||n[0])?.path||""}function gi(e,o,{reveal:n=!0}={}){if(!o||!q(e.document))return;le=!1;const a=t.rows.find(i=>i.current);if(a&&a.path===o){Ae(e,a.id,t.rows,{reveal:n});return}L(e),qe(o),L(e);const s=t.rows.find(i=>i.path===o);s&&(Ae(e,s.id,t.rows,{reveal:n}),e.setTimeout(()=>{q(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function Ot(e){if(Ge)return;const o=()=>{t.editingId||t.dragging||(e.clearTimeout(Ze),Ze=e.setTimeout(()=>{q(e.document)&&L(e)},80))},n=()=>{if(o(),b("dock:on-empty-page")===!0){const a=Ve(e,e.document);a.length===1&&it(e,e.document,a,a[0].uid,"")}};Ge=_o("dock:html-changed",o),e.document.addEventListener("sve-page-structure",n),Ct=()=>{e.document.removeEventListener("sve-page-structure",n)}}function ki(e){Ge?.(),Ge=null,Ct?.(),Ct=null,e?.clearTimeout?.(Ze),Ze=0}function zt(e){const o=q(e.document);if(ce({source:J,type:Z.SVE_HTML_PICK,on:!1},e),ki(e),V.forget(),X.callOpen=!1,X.callStore=null,jt(e),Ke(),G(),ia(e),R=null,t.inspect=null,t.editingId=null,t.draft="",t.sections=[],t.pageBuilder=!1,t.layoutFile=!1,U="",e?.clearTimeout?.(ve),!o){xt(e);return}o.remove(),Dt.headerTab==="html_tree"&&Dn(e,null),An(e),yo(e),bo(e),xt(e)}function Fi(e,o){o.querySelector("[data-sve-html-tree-list]")||(o.id=Ye,Me(o,Io,{title:u(e,"html_tree")}),o.querySelector("[data-sve-close]")?.addEventListener("click",()=>zt(e)))}function Di(e){Ot(e),L(e)}function tn(e){const o=e.document;if(!gn(e,"html_tree"))return;if(q(o)){Ot(e),L(e);return}if(!jo(o))return;le=!0,K.clear(),Bn(e,[Ye]);const n=o.createElement("div");n.id=Ye,n.style.cssText=Nn,Me(n,Io,{title:u(e,"html_tree")}),n.querySelector("[data-sve-close]")?.addEventListener("click",()=>zt(e)),jn(e,n),yo(e),bo(e),xt(e),Ot(e),L(e)}function Ai(e){if(q(e.document)){zt(e);return}tn(e)}Bt("html-tree:open-section",e=>{const o=window,n=o.document,a=Ve(o,n),s=a.find(i=>i.uid===e||i.ids.includes(e));return s?(it(o,n,a,s.uid,""),{uid:s.uid,ids:s.ids}):null});Bt("html-tree:from-preview",({path:e,src:o,uid:n,reveal:a=!0}={})=>{if(!Eo(window,e)){if(!e){yi(window,n);return}gi(window,pi(e,o)||e,{reveal:a})}});function yi(e,o){if(!o||!q(e.document))return;const n=Ve(e,e.document),a=Be(o,e.document),s=n.find(i=>i.ids.some(d=>a.includes(d)));s&&(le&&(le=!1,K.clear(),R=null),U&&U!==s.uid&&(e.clearTimeout(ve),U="",B=""),!b("dock:load-settled")&&L(e))}Bt("html-tree:arm-pick",e=>{const o=window;return e?(Yo(o,rt(Y(),Ao(o))),!0):(q(o.document)||ce({source:J,type:Z.SVE_HTML_PICK,on:!1},o),!0)});function Bi(){pe.clear(),Ie.clear(),St.clear(),Xe.clear(),De.length=0}export{Cr as HTML_TREE_STYLE_ID,$i as armHtmlTreePrefetch,Bi as clearHtmlTreeTemplates,G as closeHtmlTreeMenu,zt as closeHtmlTreePanel,Mr as ensureHtmlTreeStyles,Fi as fillHtmlTreePane,R as htmlTreeActiveId,q as htmlTreePanel,Ze as htmlTreeTimer,Ge as htmlTreeUnhook,tn as openHtmlTreePanel,L as renderHtmlTree,Di as showHtmlTreePane,ki as stopWatchHtmlTreeDock,Ai as toggleHtmlTreePanel,Ot as watchHtmlTreeDock};
