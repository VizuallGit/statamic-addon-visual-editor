import{q as f,r as un,o as v,c as g,a as $,t as M,u as r,e as fn,l as vn,F as O,i as ee,f as _,w,a0 as Le,L as N,ab as mn,a4 as pn,af as be,j as xt,ad as gn,$ as re,aC as kn,v as to,z as yn,V as bn,aD as Tn,W as bo,aE as xn,A as st,m as Dt,p as Ft,U as Oe,X as wn,aF as Sn,aG as _n}from"./addon-DvqLgLEG.js";import{c as To,a as Cn,o as Hn,b as Pn,d as En,i as Ln,r as Mn,e as In,f as Rn,u as oo,l as no}from"./section-create-BYP-upWO.js";import{canEditFields as $n,currentSetHandle as On,openFieldsetOverlay as xo,openGlobalFieldsOverlay as Dn}from"./section-fields-CLnCntCL.js";import{T as t,U as Fn,V as X,W as An,b,X as ao,s as At,x as de,j as wt,G as Bn,i as Nn,D as wo,E as So,Y as so,m as Me,C as jn,R as Vn,F as Kn,Z as Un,_ as ro,$ as qn,a0 as _o,a1 as Co,a2 as Ho,a3 as zn,a4 as Yn,a5 as Po,a6 as Xn,a7 as Eo,l as rt,a8 as Be,a9 as Lo,aa as Gn,ab as Bt,ac as Wn,ad as Zn,ae as Jn,v as Qn,af as ea,ag as ta,ah as oa,ai as na,aj as aa,ak as Mo,z as sa,al as Nt}from"./lp-cluster-9cd0ckbJ.js";import{H as ze,j as ra,d as ia}from"./shortcuts-Czfut3rE.js";import{_ as jt,o as Ne}from"./ChoiceDialog-J71d3Mbf.js";import{M as W,S as Z}from"./protocol-BVdEmGBQ.js";import{C as la,H as je,s as Vt,c as da,a as ca,b as Io,t as ha,d as Te,h as Ro,e as ua,f as fa,w as Kt,g as va,i as ma,j as pa,p as ga,r as ka,k as ya,l as ba,v as Ta,m as xa,n as wa,o as Sa,u as _a,q as Ca,x as Ha,y as io,z as Pa,A as Ea}from"./component-extract-CnHGiTau.js";import{H as La,o as Ma,e as Ia}from"./logic-popup-CF__JDKx.js";import{T as Ra}from"./template-elements-BWxmzMAz.js";import{p as it,f as $a,i as $o,a as Oo,h as Oa,c as Da}from"./css-scope-SjmXh_-l.js";import{b as Fa}from"./html-pick-align-CLq5l-p4.js";import{l as Aa,a as Ba,b as Na,c as ja,d as Va,e as Ka,f as Ua,g as qa,h as za}from"./loop-inspector-ymPlH8E9.js";import"./FieldsetOverlay-00VZfqCy.js";import"./ai-text-icon-B7uCWIwa.js";import"./help-styles-DdlsOq8q.js";const ft=/\s*([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/y,Ya=/^\s*(?:([A-Za-z_$][\w$]*)|'([^'\\]*)'|"([^"\\]*)")\s*:\s*(true|false)\s*$/;function Xa(e){const o=String(e||"").replace(/\{\{[\s\S]*?\}\}/g,s=>" ".repeat(s.length)),n=o.match(/^<[a-zA-Z][\w:-]*/);if(!n)return null;let a=n[0].length;for(;a<o.length;){ft.lastIndex=a;const s=ft.exec(o);if(!s){a+=1;continue}if(s[1].toLowerCase()==="x-data")return s[2]??s[3]??s[4]??"";a=ft.lastIndex}return null}function Ga(e,o){const n=e[o];for(let a=o+1;a<e.length;a+=1)if(e[a]==="\\")a+=1;else if(e[a]===n)return a;return e.length-1}function Wa(e){const o=String(e||""),n=o.search(/\S/);if(n===-1||o[n]!=="{")return[];const a=new Map;let s=0,d="";const h=()=>{const l=d.match(Ya);l&&a.set(l[1]??l[2]??l[3],l[4]==="true"),d=""};for(let l=n;l<o.length;l+=1){const m=o[l];if(m==='"'||m==="'"||m==="`"){const k=Ga(o,l);d+=o.slice(l,k+1),l=k;continue}if(m==="/"&&o[l+1]==="/"){const k=o.indexOf(`
`,l);l=k===-1?o.length:k-1;continue}if(m==="/"&&o[l+1]==="*"){const k=o.indexOf("*/",l+2);l=k===-1?o.length:k+1;continue}if(m==="{"||m==="["||m==="("){if(s+=1,s===1)continue}else if(m==="}"||m==="]"||m===")"){if(s-=1,s===0)break}else if(m===","&&s===1){h();continue}d+=m}return h(),[...a].map(([l,m])=>({key:l,value:m}))}const Za={class:"sve-html-tree"},Ja={class:"sve-pane-bar","data-sve-pane-bar":""},Qa={"data-sve-right-title":""},es={"data-sve-right-actions":""},ts=["aria-pressed","title","aria-label"],os=["title"],ns={class:"sve-ht-used-by__label"},as={class:"sve-ht-used-by__chips"},ss=["title","onClick"],rs={key:1,class:"sve-ht-used-by__chip"},is={key:0,class:"sve-ht-used-by__empty"},ls={class:"sve-ht-tools"},ds=["title"],cs=["placeholder","aria-label","value"],hs=["aria-label"],us=["title","aria-label"],fs=["title","aria-label"],vs={key:3,class:"sve-tree-exit"},ms=["title"],ps=["title"],gs='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',ks='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',ys='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',bs='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',Ts='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/></svg>',xs='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',ws={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const o=f(window,"html_tree_search");t.layers=Fn(window);const n=f(window,"html_tree_layers_on"),a=f(window,"html_tree_layers_off");function s(){An(window,!t.layers)}const d=To(window),h=f(window,"section_new"),l=f(window,"html_tree_add_element"),m=f(window,"html_tree_sections_slot"),k=f(window,"html_tree_sections_no_field");function L(){const H=t.templateSections.length?t.templateSections:[mn(window)],u=new Set(t.rows.filter(i=>i.kind==="sections").map(i=>i.tag));return H.filter(i=>!u.has(i)).map(i=>({tag:`sections:${i}`,label:H.length>1?`${m} · ${i}`:m,noField:!t.templateSections.length}))}const T=un(!1),E=f(window,"section_import");function x(){T.value=!1}async function R(H){if(!H)return;await pn(),t.onRefresh?.();const u=b("html-tree:open-section",H);u&&Mn(window,u.ids)}function S(){const H=t.rows.find(u=>u.current&&!u.context&&!u.synthetic)||null;return H?.lockedIn?t.rows.filter(u=>u.locked&&u.from<=H.from&&u.to>=H.to).sort((u,i)=>u.from-i.from)[0]||null:H}function J(H){const u=H.getBoundingClientRect(),i=S();let p=null;const D=(F,_e,ne="")=>()=>{p?.dismiss(),p=null,x();const dt=Ln(window,F,i,_e);dt!==null&&(t.selectFrom={at:dt,left:4},ne&&window.Statamic?.$toast?.info?.(ne))};p=Ne(document,je,{items:[...Ra.map(F=>({label:F,onPick:D(F,`<${F}>`)})),...L().map(F=>({label:F.label,onPick:D(F.tag,F.label,F.noField?k:"")}))],x:Math.round(u.left),y:Math.round(u.bottom+4),onClose:()=>{p=null,x()}})}function ce(H){if(!T.value){if(T.value=!0,!(t.sections.length||t.pageBuilder)){J(H.currentTarget);return}(async()=>{const u=await Cn(window);if(!u){x();return}const i=t.sections.length?t.sections[t.sections.length-1].uid:null,p=D=>{x(),R(D?.uid)};if(u==="static"){Hn(window,{afterUid:i,onDone:p,onError:x,onClose:x});return}Pn(window,{afterUid:i,onDone:p,onError:x,onClose:x})})()}}function Q(){if(T.value)return;T.value=!0;const H=!!(t.sections.length||t.pageBuilder);En(window,{intoTemplate:!H,after:H?null:S(),afterUid:H&&t.sections.length?t.sections[t.sections.length-1].uid:null,onDone:u=>{if(x(),H){R(u?.uid);return}Number.isInteger(u?.at)&&(t.selectFrom={at:u.at,left:4})},onError:x,onClose:x})}function U(H){const u=!!t.query;t.query=H,u!==!!H&&t.onQuery?.()}return(H,u)=>(v(),g("div",Za,[$("div",Ja,[$("div",Qa,M(e.title),1),$("div",es,[$("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":r(t).layers?"true":"false",title:r(t).layers?r(a):r(n),"aria-label":r(t).layers?r(a):r(n),innerHTML:gs,onClick:s},null,8,ts),u[5]||(u[5]=fn('<button type="button" data-sve-right-pin aria-pressed="false" data-v-919f941f></button><button type="button" data-sve-close aria-label="Close" data-v-919f941f><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-919f941f><path d="M18 6 6 18" data-v-919f941f></path><path d="m6 6 12 12" data-v-919f941f></path></svg></button>',2))])]),r(t).usedBy?(v(),g("div",{key:0,class:"sve-ht-used-by",title:r(t).usedBy.hint||null},[$("span",ns,[$("span",{class:"sve-ht-used-by__icon","aria-hidden":"true",innerHTML:Ts}),vn(" "+M(r(t).usedBy.label),1)]),$("span",as,[(v(!0),g(O,null,ee(r(t).usedBy.items,i=>(v(),g(O,{key:i.kind+":"+i.name},[i.onOpen?(v(),g("button",{key:0,type:"button",class:"sve-ht-used-by__chip sve-ht-used-by__chip--open",title:i.openLabel,onClick:p=>i.onOpen(p.currentTarget)},M(i.name),9,ss)):(v(),g("span",rs,M(i.name),1))],64))),128)),r(t).usedBy.empty?(v(),g("span",is,M(r(t).usedBy.empty),1)):_("",!0)])],8,os)):_("",!0),$("div",ls,[$("label",{class:"sve-ht-search",title:r(o)},[$("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:bs}),$("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:r(o),"aria-label":r(o),value:r(t).query,autocomplete:"off",spellcheck:"false",onInput:u[0]||(u[0]=i=>U(i.target.value)),onKeydown:[u[1]||(u[1]=w(()=>{},["stop"])),u[2]||(u[2]=Le(w(i=>U(""),["prevent"]),["escape"]))]},null,40,cs),r(t).query?(v(),g("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":r(o),innerHTML:xs,onClick:u[3]||(u[3]=i=>U(""))},null,8,hs)):_("",!0)],8,ds),r(d)&&(r(t).sections.length||r(t).pageBuilder||r(t).rows.length&&!r(t).layoutFile)?(v(),g("button",{key:0,type:"button",class:"sve-ht-new",title:r(t).sections.length||r(t).pageBuilder?r(h):r(l),"aria-label":r(t).sections.length||r(t).pageBuilder?r(h):r(l),innerHTML:ks,onClick:ce},null,8,us)):_("",!0),r(d)&&(r(t).sections.length||r(t).pageBuilder||r(t).rows.length&&!r(t).layoutFile)?(v(),g("button",{key:1,type:"button",class:"sve-ht-import",title:r(E),"aria-label":r(E),innerHTML:ys,onClick:Q},null,8,fs)):_("",!0)]),r(X).inSidebar?_("",!0):(v(),N(la,{key:1})),u[6]||(u[6]=$("div",{"data-sve-html-tree-list":""},null,-1)),r(t).inspect?.logic?_("",!0):(v(),N(La,{key:2})),r(t).exitOpen&&!r(X).inSidebar?(v(),g("div",vs,[$("span",{class:"sve-tree-exit__name",title:r(t).exitName},M(r(t).exitName),9,ms),$("button",{type:"button",class:"sve-tree-exit__go",title:r(t).exitTitle,onClick:u[4]||(u[4]=i=>r(t).onExit?.())},M(r(t).exitLabel),9,ps)])):_("",!0)]))}},Do=jt(ws,[["__scopeId","data-v-919f941f"]]);function Fo(e){return String(e||"").trim().toLowerCase()}function St(e,o){return o?[e.name,e.tag,e.klass,e.label,e.src].filter(n=>typeof n=="string"&&n).join(" ").toLowerCase().includes(o):!0}function Ss(e,o){const n=Fo(o);if(!n)return{rows:e,hits:new Set};const a=new Set;for(const h of e)St(h,n)&&a.add(h.path);const s=[...a];return{rows:e.filter(h=>a.has(h.path)||s.some(l=>l.startsWith(`${h.path}/`))),hits:a}}const _s=["title"],Cs={"data-sve-ht-indent":"","aria-hidden":"true"},Hs=["data-sve-ht-cat"],Ps={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},Es={key:2,"data-sve-ht-letter":""},Ls=["innerHTML"],Ms=["title"],Is=["data-sve-ht-classes","title"],Rs={key:1,"data-sve-ht-kind":""},$s={key:3,"data-sve-ht-name":""},Os={key:4,"data-sve-ht-actions":""},Ds=["data-on","title","innerHTML"],Fs=["title"],As={key:5,"data-sve-ht-actions":""},Bs=["disabled","title"],Ns=["data-on","title","innerHTML"],js=["data-on","title","innerHTML"],Vs=["disabled","title","innerHTML"],Ks=["disabled","title"],Us=["disabled","title"],qs=["data-on","disabled","title","aria-pressed","innerHTML"],zs=["disabled","title"],Ys=["data-sve-ht-id"],lo='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',Xs='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',Gs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Ws='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',Zs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',Js='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',Qs='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',co='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6.5" width="20" height="11" rx="5.5"/><circle cx="7.5" cy="12" r="3" fill="currentColor" stroke="none"/></svg>',ho='<svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M7.5 5.5h9a6.5 6.5 0 0 1 0 13h-9a6.5 6.5 0 0 1 0-13ZM16.5 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6Z"/></svg>',er='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',tr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-.9"/></svg>',or='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',nr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',ar={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const o=$n(window),n=f(window,"section_fields");function a(){const u=On();if(!u){window.Statamic?.$toast?.error(f(window,"section_fields_none"));return}xo(window,u)}const s=window.Statamic?.$config?.get?.("sveBuildStrings")?.tree_plus||"+";function d(u){ao.plusPath=u.path,t.onSelect?.(u.id)}function h(u){return u.synthetic?u.frame==="main"?t.frameMainTitle:u.frame==="template"?t.frameTemplateTitle:t.frameOpenTitle:u.kind==="component"?u.src?`partial:${u.src}`:u.tag:u.name?`${u.tag} ${u.name}`:u.tag}function l(u){return!!u.section}function m(u){return!!u.frame}function k(u){return u.kind==="slot"}function L(u,i){m(i)||k(i)||(l(i)?t.onSectionPointerDown?.(u,i.section):i.sectionRoot?t.onSectionPointerDown?.(u,i.sectionRoot):t.onPointerDown?.(u,i.id))}function T(u,i){if(u.synthetic){t.onFrame?.(u.frame);return}if(l(u)){t.onSection?.(u.section);return}t.onSelect?.(u.id,i)}function E(u,i){const p={"data-sve-ht-id":u.id};return u.locked&&(p["data-sve-ht-locked"]=""),u.current&&(p["data-sve-ht-current"]=""),u.hidden&&(p["data-sve-ht-hidden"]=""),p["data-sve-ht-cat"]=u.cat||"other",p["data-sve-ht-depth"]=String(u.depth),i&&(p["data-sve-ht-dim"]=""),l(u)&&(p["data-sve-ht-sec"]=""),m(u)&&(p["data-sve-ht-frame"]=u.frame),!l(u)&&t.dropId===u.id&&t.dropPlace&&(p["data-sve-ht-drop"]=t.dropPlace),p}function x(u){return!!u.fixed}function R(u){return u.kind==="sections"}function S(u){return!!(u.locked||u.lockedIn)}function J(u){return!u.lockedIn&&!x(u)}function ce(u){return!x(u)&&!R(u)&&!S(u)&&(!u.hidden||u.wrapFrom!=null)}function Q(u){return!!u.sectionRoot||!!u.section}function U(u){return t.canEdit&&!S(u)||Q(u)}function H(){return t.look==="tags"&&!t.layers}return(u,i)=>(v(),g(O,null,[$("div",be({"data-sve-ht-row":""},E(e.row,e.dim),{role:"button",tabindex:"0",title:h(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:i[44]||(i[44]=p=>T(e.row,p.currentTarget)),onDblclick:i[45]||(i[45]=w(p=>e.row.synthetic?r(t).onFrameEnter?.(e.row.frame):m(e.row)||k(e.row)||l(e.row)?null:r(t).onRename?.(e.row.id),["prevent"])),onKeydown:[i[46]||(i[46]=Le(w(p=>T(e.row,p.currentTarget),["prevent"]),["enter"])),i[47]||(i[47]=Le(w(p=>T(e.row,p.currentTarget),["prevent"]),["space"]))],onPointerdown:i[48]||(i[48]=p=>L(p,e.row)),onPointerenter:i[49]||(i[49]=p=>l(e.row)?r(t).onSectionHover?.(e.row.section):null),onContextmenu:i[50]||(i[50]=w(p=>m(e.row)||k(e.row)||l(e.row)?null:r(t).onContext?.(p,e.row.id),["prevent","stop"]))}),[$("span",Cs,[(v(!0),g(O,null,ee(e.row.guides||[],(p,D)=>(v(),g("i",{key:D,"data-sve-ht-cat":p},null,8,Hs))),128))]),e.row.hasChildren||e.row.emptyBlock?(v(),g("button",be({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?r(t).mainShut:e.row.shut)?{"data-sve-ht-shut":""}:{},{innerHTML:Xs,onClick:i[0]||(i[0]=w(p=>e.row.synthetic?r(t).onFrameTwist?.():l(e.row)?r(t).onSection?.(e.row.section):r(t).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:i[1]||(i[1]=w(()=>{},["stop"])),onDblclick:i[2]||(i[2]=w(()=>{},["stop"]))}),null,16)):(v(),g("span",Ps)),e.row.letter?(v(),g("span",Es,M(e.row.letter),1)):(v(),g("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Ls)),$("span",{"data-sve-ht-text":"",title:r(t).renameTitle},[!e.row.kind&&!l(e.row)&&!m(e.row)?(v(),g("button",{key:0,type:"button","data-sve-ht-tag":"","data-sve-ht-classes":H()&&e.row.classes?e.row.classes:null,title:r(t).tagTitle,onClick:i[3]||(i[3]=w(()=>{},["stop","prevent"])),onPointerdown:i[4]||(i[4]=w(()=>{},["stop"])),onDblclick:i[5]||(i[5]=w(p=>r(t).onTagChange?.(p,e.row.id),["stop","prevent"]))},M(e.row.tag),41,Is)):(v(),g("span",Rs,M(e.row.tag),1)),r(t).editingId===e.row.id&&!l(e.row)?xt((v(),g("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":i[6]||(i[6]=p=>r(t).draft=p),onMousedown:i[7]||(i[7]=w(()=>{},["stop"])),onPointerdown:i[8]||(i[8]=w(()=>{},["stop"])),onClick:i[9]||(i[9]=w(()=>{},["stop"])),onDblclick:i[10]||(i[10]=w(()=>{},["stop"])),onKeydown:[i[11]||(i[11]=w(()=>{},["stop"])),i[12]||(i[12]=Le(w(p=>r(t).onRenameCommit?.(),["prevent"]),["enter"])),i[13]||(i[13]=Le(w(p=>r(t).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:i[14]||(i[14]=p=>r(t).onRenameCommit?.())},null,544)),[[gn,r(t).draft]]):(v(),g("span",$s,M(H()&&e.row.display?e.row.display:e.row.name),1))],8,Ms),m(e.row)?(v(),g("span",Os,[e.row.alpineNth>=0?(v(),g("button",{key:0,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:r(t).alpineTitle,innerHTML:e.row.alpineSet?ho:co,onClick:i[15]||(i[15]=w(p=>r(t).onAlpineState?.(p,e.row.id),["stop","prevent"])),onPointerdown:i[16]||(i[16]=w(()=>{},["stop"])),onDblclick:i[17]||(i[17]=w(()=>{},["stop"]))},null,40,Ds)):_("",!0),e.row.frame!=="main"&&r(o)?(v(),g("button",{key:1,type:"button","data-sve-ht-fields":"",title:r(t).frameFieldsTitle,innerHTML:lo,onClick:i[18]||(i[18]=w(p=>r(t).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:i[19]||(i[19]=w(()=>{},["stop"])),onDblclick:i[20]||(i[20]=w(()=>{},["stop"]))},null,40,Fs)):_("",!0)])):!l(e.row)&&!k(e.row)?(v(),g("span",As,[r(ao).on&&!x(e.row)&&!R(e.row)?(v(),g("button",{key:0,type:"button","data-sve-ht-plus":"",disabled:!r(t).canEdit||S(e.row),title:r(s),innerHTML:or,onClick:i[21]||(i[21]=w(p=>d(e.row),["stop","prevent"])),onPointerdown:i[22]||(i[22]=w(()=>{},["stop"])),onDblclick:i[23]||(i[23]=w(()=>{},["stop"]))},null,40,Bs)):_("",!0),e.row.videoNth>=0?(v(),g("button",{key:1,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?r(t).videoPlayTitle:r(t).videoHoldTitle,innerHTML:e.row.videoHeld?Qs:Js,onClick:i[24]||(i[24]=w(p=>r(t).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:i[25]||(i[25]=w(()=>{},["stop"])),onDblclick:i[26]||(i[26]=w(()=>{},["stop"]))},null,40,Ns)):_("",!0),e.row.alpineNth>=0?(v(),g("button",{key:2,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:r(t).alpineTitle,innerHTML:e.row.alpineSet?ho:co,onClick:i[27]||(i[27]=w(p=>r(t).onAlpineState?.(p,e.row.id),["stop","prevent"])),onPointerdown:i[28]||(i[28]=w(()=>{},["stop"])),onDblclick:i[29]||(i[29]=w(()=>{},["stop"]))},null,40,js)):_("",!0),ce(e.row)?(v(),g("button",{key:3,type:"button","data-sve-ht-eye":"",disabled:!r(t).canEdit,title:r(t).canEdit?e.row.hidden?r(t).showTitle:r(t).hideTitle:r(t).lockedTitle,innerHTML:e.row.hidden?Ws:Gs,onClick:i[30]||(i[30]=w(p=>r(t).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:i[31]||(i[31]=w(()=>{},["stop"])),onDblclick:i[32]||(i[32]=w(()=>{},["stop"]))},null,40,Vs)):_("",!0),r(o)&&e.row.fieldsIcon?(v(),g("button",{key:4,type:"button","data-sve-ht-fields":"",disabled:!r(t).canEdit,title:r(t).canEdit?r(n):r(t).lockedTitle,innerHTML:lo,onClick:w(a,["stop","prevent"]),onPointerdown:i[33]||(i[33]=w(()=>{},["stop"])),onDblclick:i[34]||(i[34]=w(()=>{},["stop"]))},null,40,Ks)):_("",!0),!x(e.row)&&!R(e.row)?(v(),g("button",{key:5,type:"button","data-sve-ht-dup":"",disabled:!U(e.row),title:U(e.row)?r(t).duplicateTitle:r(t).lockedTitle,innerHTML:Zs,onClick:i[35]||(i[35]=w(p=>r(t).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:i[36]||(i[36]=w(()=>{},["stop"])),onDblclick:i[37]||(i[37]=w(()=>{},["stop"]))},null,40,Us)):_("",!0),J(e.row)?(v(),g("button",{key:6,type:"button","data-sve-ht-lock":"","data-on":e.row.locked?"":null,disabled:!r(t).canEdit||e.row.locked&&!r(t).canUnlock,title:e.row.locked?r(t).canUnlock?r(t).unlockTitle:r(t).lockedByTitle:r(t).lockTitle,"aria-pressed":e.row.locked?"true":"false",innerHTML:e.row.locked?er:tr,onClick:i[38]||(i[38]=w(p=>r(t).onLock?.(e.row.id),["stop","prevent"])),onPointerdown:i[39]||(i[39]=w(()=>{},["stop"])),onDblclick:i[40]||(i[40]=w(()=>{},["stop"]))},null,40,qs)):_("",!0),x(e.row)?_("",!0):(v(),g("button",{key:7,type:"button","data-sve-ht-del":"",disabled:!U(e.row),title:U(e.row)?r(t).deleteTitle:r(t).lockedTitle,innerHTML:nr,onClick:i[41]||(i[41]=w(p=>r(t).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:i[42]||(i[42]=w(()=>{},["stop"])),onDblclick:i[43]||(i[43]=w(()=>{},["stop"]))},null,40,zs))])):_("",!0)],16,_s),e.row.emptyBlock&&!e.row.shut?(v(),g("div",be({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},r(t).dropId===e.row.id&&r(t).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),M(r(t).slotText),17,Ys)):_("",!0)],64))}},Y=jt(ar,[["__scopeId","data-v-827f7be9"]]),sr=["data-sve-ht-look","data-sve-ht-layers"],rr={key:0,class:"sve-ht-page-template"},ir={key:0,class:"sve-ht-page-template__text"},lr={class:"sve-ht-page-template__note"},dr={key:1,class:"sve-ht-empty"},cr={key:2,class:"sve-ht-empty"},hr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},ur={key:0,class:"sve-ht-empty"},fr={key:0,class:"sve-ht-empty"},vr=["data-sve-ht-under-main"],mr={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},pr={key:0,class:"sve-ht-empty"},gr=["data-sve-ht-under-main"],kr=["data-dim"],yr={key:0,class:"sve-ht-empty"},br={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},Tr={key:0,class:"sve-ht-empty"},xr={key:4,"data-sve-ht-branch":"","data-sve-ht-cat":"component"},wr={__name:"HtmlTreeList",setup(e){const o=re(()=>Fo(t.query)),n=re(()=>Ss(t.rows,o.value)),a=re(()=>n.value.rows),s=re(()=>o.value?t.sections.filter(x=>St(x.row,o.value)||x.current&&x.ready&&a.value.length>0):t.sections);function d(x){return!!x&&(!o.value||St(x,o.value))}function h(x){const R=t.frame?.kind;return t.inComponent||(R==="header"||R==="footer")&&R!==x}const l=re(()=>t.frame?.kind==="header"||t.frame?.kind==="footer"),m=re(()=>!!t.frame&&["header","main","footer"].some(x=>d(t.frame[x]))),k=re(()=>!!t.frame&&(t.frame.kind==="main"||d(t.frame.main))),L=re(()=>!!o.value&&!s.value.length&&!a.value.length&&!m.value);function T(x){return!!o.value&&!n.value.hits.has(x.path)}function E(x){const R={"data-sve-ht-sec-uid":x.uid};return x.current&&(R["data-sve-ht-branch"]="",R["data-sve-ht-cat"]=x.row?.cat||"layout"),t.sectionDrop&&t.sectionDrop.uid===x.uid&&(R["data-sve-ht-drop"]=t.sectionDrop.place),R}return(x,R)=>(v(),g("div",be({class:"sve-ht-root","data-sve-ht-look":r(t).layers?"tags":r(t).look,"data-sve-ht-layers":r(t).layers?"":null,style:r(t).familyStyle},r(t).dragging?{"data-sve-ht-dragging":""}:{}),[r(t).pageTemplate?(v(),g("div",rr,[r(t).pageTemplate.text?(v(),g("p",ir,M(r(t).pageTemplate.text),1)):_("",!0),$("p",lr,M(r(t).pageTemplate.note),1),r(t).pageTemplate.canOpen?(v(),g("button",{key:1,type:"button",class:"sve-ht-page-template__open",onClick:R[0]||(R[0]=S=>r(t).pageTemplate.onOpen(S.currentTarget))},M(r(t).pageTemplate.openLabel),1)):_("",!0)])):!r(t).rows.length&&!r(t).sections.length&&!r(t).frame?(v(),g("div",dr,M(r(t).emptyText),1)):L.value?(v(),g("div",cr,M(r(t).searchEmpty),1)):_("",!0),r(t).frame||r(t).sections.length?(v(),g(O,{key:3},[r(t).frame?(v(),g(O,{key:0},[r(t).frame.kind==="header"?(v(),g("div",hr,[(v(!0),g(O,null,ee(a.value,S=>(v(),N(Y,{key:S.id,row:S,dim:T(S)},null,8,["row","dim"]))),128)),r(t).rows.length?_("",!0):(v(),g("div",ur,M(r(t).emptyText),1))])):!l.value&&d(r(t).frame.header)?(v(),N(Y,{key:1,row:r(t).frame.header,dim:h("header")},null,8,["row","dim"])):_("",!0)],64)):_("",!0),l.value?_("",!0):(v(),g("div",kn(be({key:1},r(t).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[r(t).frame?.kind==="main"?(v(),g(O,{key:0},[(v(!0),g(O,null,ee(a.value,S=>(v(),N(Y,{key:S.id,row:S,dim:T(S)},null,8,["row","dim"]))),128)),r(t).rows.length?_("",!0):(v(),g("div",fr,M(r(t).emptyText),1))],64)):r(t).frame&&d(r(t).frame.main)?(v(),N(Y,{key:1,row:r(t).frame.main,dim:h("main")},null,8,["row","dim"])):_("",!0),r(t).frame?.kind==="template"?xt((v(),g("div",{key:2,"data-sve-ht-frame-body":"","data-sve-ht-under-main":k.value?"":null},[$("div",mr,[(v(!0),g(O,null,ee(a.value,S=>(v(),N(Y,{key:S.id,row:S,dim:T(S)},null,8,["row","dim"]))),128)),r(t).rows.length?_("",!0):(v(),g("div",pr,M(r(t).emptyText),1))])],8,vr)),[[to,!r(t).mainShut]]):_("",!0),r(t).sections.length||r(t).frame?xt((v(),g("div",{key:3,"data-sve-ht-frame-body":"","data-sve-ht-under-main":k.value?"":null},[r(t).frame?.template&&d(r(t).frame.template)?(v(),N(Y,{key:0,row:r(t).frame.template,dim:h("template")},null,8,["row","dim"])):_("",!0),r(t).frame&&!r(t).frame.template&&!r(t).sections.length&&!o.value?(v(),g("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":h("")?"":void 0},M(r(t).frameEmptyText),9,kr)):_("",!0),(v(!0),g(O,null,ee(s.value,S=>(v(),g("div",be({key:S.uid},{ref_for:!0},E(S)),[S.ready?(v(),g(O,{key:0},[(v(!0),g(O,null,ee(a.value,J=>(v(),N(Y,{key:J.id,row:J,dim:T(J)},null,8,["row","dim"]))),128)),r(t).rows.length?_("",!0):(v(),g("div",yr,M(r(t).emptyText),1))],64)):(v(),N(Y,{key:1,row:S.row,dim:h("")},null,8,["row","dim"]))],16))),128))],8,gr)),[[to,!r(t).frame||!r(t).mainShut]]):_("",!0)],16)),r(t).frame?(v(),g(O,{key:2},[r(t).frame.kind==="footer"?(v(),g("div",br,[(v(!0),g(O,null,ee(a.value,S=>(v(),N(Y,{key:S.id,row:S,dim:T(S)},null,8,["row","dim"]))),128)),r(t).rows.length?_("",!0):(v(),g("div",Tr,M(r(t).emptyText),1))])):!l.value&&d(r(t).frame.footer)?(v(),N(Y,{key:1,row:r(t).frame.footer,dim:h("footer")},null,8,["row","dim"])):_("",!0)],64)):_("",!0)],64)):r(t).inComponent&&r(t).rows.length?(v(),g("div",xr,[(v(!0),g(O,null,ee(a.value,S=>(v(),N(Y,{key:S.id,row:S,dim:T(S)},null,8,["row","dim"]))),128))])):r(t).rows.length?(v(!0),g(O,{key:5},ee(a.value,S=>(v(),N(Y,{key:S.id,row:S,dim:T(S)},null,8,["row","dim"]))),128)):_("",!0)],16,sr))}},vt=jt(wr,[["__scopeId","data-v-d0376715"]]);let mt=null;function Sr(e){return mt||(mt=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(o=>o.ok?o.json():{pages:[]}).then(o=>Array.isArray(o.pages)?o.pages:[]).catch(()=>[])),mt}let Ye=null;function pt(){Ye?.dismiss(),Ye=null}function _r(e,o,n){pt();const a=o?.getBoundingClientRect?.(),s={x:a?a.left:0,y:a?a.bottom+4:0};Sr(e).then(d=>{const h=d.length?d.map(l=>({label:l.title||l.url,onPick:()=>{pt(),n(l.url)}})):[{label:f(e,"component_props_pages_none"),onPick:null}];pt(),Ye=Ne(e.document,je,{items:h,x:s.x,y:s.y,onClose:()=>{Ye=null}})})}const Ao="sve-html-tree-labels";function Bo(){try{const e=globalThis.localStorage?.getItem(Ao);if(!e)return{};const o=JSON.parse(e);return o&&typeof o=="object"?o:{}}catch{return{}}}function Cr(e){try{globalThis.localStorage?.setItem(Ao,JSON.stringify(e))}catch{}}function No(e){return String(e||"_")}function jo(e){const o=Bo()[No(e)];return o&&typeof o=="object"?{...o}:{}}function Hr(e,o,n){const a=n?.[o];return typeof a=="string"&&a.trim()?a.replace(/\s+/g," ").trim():String(e||"").trim()}function Pr(e,o,n,a){if(!o)return;const s=No(e),d=Bo(),h={...d[s]||{}},l=String(n||"").replace(/\s+/g," ").trim(),m=String(a||"").trim();!l||l===m?delete h[o]:h[o]=l,Object.keys(h).length?d[s]=h:delete d[s],Cr(d)}const q=ua("sve-call-values"),De=new Set;let uo=null;const Er="__sve-html-tree-style";function Lr(e,o,n){if(o||n)return!1;const a=String(b("dock:chrome-kind")||"");if(a==="header"||a==="footer")return!1;const s=bo(e);return!!s&&s!=="create"&&wn(e)!==Sn(e)}function Vo(e){return{sectionLoops:xn(e),sectionsLabel:f(e,"html_tree_sections_slot")}}function Mr(e,o){const n={entry:o,text:"",note:f(e,"html_tree_page_template_note"),openLabel:f(e,"html_tree_open_template"),canOpen:!1,onOpen:null};return Lo(e,{entry:o}).then(a=>{!a||t.pageTemplate?.entry!==o||(t.pageTemplate={...t.pageTemplate,text:f(e,"html_tree_page_template",{name:a.name}),canOpen:!!a.open,onOpen:a.open?s=>Gn(e,s,a.open):null})}),n}function Ir(e,o){const n=o.replace(/^view:/,"");if(!n||b("dock:current-type")!==o){t.usedBy=null,t.templateSections=[];return}t.usedBy?.view!==n&&(t.usedBy=null,Lo(e,{view:n}).then(a=>{if(!a||b("dock:current-type")!==o)return;const s=a.everything?[{name:f(e,"html_tree_used_by_everything"),kind:"everything",url:null}]:a.used_by.map(d=>({...d,...Rr(e,d)}));t.templateSections=Array.isArray(a.sections_fields)?a.sections_fields:[],t.usedBy={view:n,label:f(e,"html_tree_used_by"),items:s,empty:s.length?"":f(e,"html_tree_used_by_nobody"),hint:s.length?f(e,"html_tree_used_by_hint",{list:s.map(d=>d.name).join(", ")}):""}}))}function Rr(e,o){if(!o.url)return{openLabel:"",onOpen:null};const n=f(e,"html_tree_used_by_open",{name:o.name});return o.kind==="page"?{openLabel:n,onOpen:a=>ea(e,a,ta(e,o.url))}:{openLabel:n,onOpen:a=>oa(e,{anchor:a,url:o.url,subtitle:o.name})}}const j=new Set;let _t="",ye=!1,gt=null,ie=!0,V="",me=0,Ko="";const pe=new Map,Ie=new Set,Ct=new Map,Xe=new Map;let B="",Uo=!1,I=null,Ge=null,Ue="",We="",Ze=0,Ht=null,xe=[],ve=null,Re=null,Je=null,Qe=null,Pt=null,le=!1,oe=null,Fe=null,$e=null,et=null,tt=null,Et=null,fe=null;function K(e){return e.getElementById(ze)}function $r(e){yn(e,Er,`
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
      ${so("light")}
      /* How much of a row's own colour its pick takes: a wash, not a fill.
         The row mixes it in below — a mix written up here would read
         --sve-ht-c on the list, where no family is set. */
      --sve-ht-pick-mix: 11%;
      --sve-ht-pick-hover-mix: 18%;
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${so("dark")}
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

    /* Build mode's + on a row (HtmlTreeRow.vue), drawn as the icons beside it. */
    [data-sve-ht-plus] {
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
    [data-sve-ht-plus]:not([disabled]):hover { opacity: 1; background: rgba(128,128,128,.25); }
    [data-sve-ht-plus][disabled] { opacity: .3; cursor: default; }
  `)}function z(){const e=b("dock:html");return typeof e=="string"?e:""}function qo(e){return!!b("dock:is-open",e)}function Se(e,{save:o=!1,unlock:n=!1}={}){return Ut()||b("dock:set-html",n?{html:e,unlock:!0}:e)!==!0?!1:(o&&b("dock:save-now"),!0)}function kt(e){const o=b("dock:component-exit-state")||{};if(t.exitOpen=!!o.open,!o.open){t.onExit=null;return}t.exitName=o.name||"",t.exitLabel=f(e,"component_exit"),t.exitTitle=f(e,o.back?"component_exit_back":"component_exit_close"),t.onExit=()=>{b("dock:exit-component"),P(e)}}const Ae=[];let yt=!1;function bt(e,o){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(o,{timeout:2e3});return}e.setTimeout(o,200)}function Or(e,o){for(const n of o){const a=n.type;!a||pe.has(a)||Ie.has(a)||Ae.includes(a)||Ae.push(a)}At.htmlTreePrefetchArmed&&zo(e)}function Bi(e){At.htmlTreePrefetchArmed=!0,zo(e)}function zo(e){if(yt||!Ae.length)return;yt=!0;const o=()=>{const n=Ae.shift();if(!n){yt=!1;return}if(pe.has(n)||Ie.has(n)){bt(e,o);return}Ie.add(n),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(n)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(a=>a.ok?a.json():null).then(a=>{if(typeof a?.html=="string"){pe.set(n,a.html);const s=Xe.get(n);Xe.delete(n),s&&s!==Yo(e,n)&&P(e)}}).catch(()=>{}).finally(()=>{Ie.delete(n),bt(e,o)})};bt(e,o)}function Ut(){return!!B}function Yo(e,o){return Xo(o)||_n(e,o)||"section"}function Xo(e){const o=pe.get(e);if(!o)return"";const n=Ct.get(e);if(n&&n.html===o)return n.tag;const a=qt(it(o))?.tag||"";return Ct.set(e,{html:o,tag:a}),a}function Ve(e,o){const n=st(e)||"page_sections",a=[];for(const s of Dt(o)||[]){if(s.name===Xn||s.name===ra)continue;const d=Ft(s.values),h=d&&typeof d=="object"?d[n]:null;if(Array.isArray(h)){h.forEach(l=>{if(!l||typeof l!="object"||Array.isArray(l)||typeof l.type!="string")return;const m=[l._visual_id,l.id,l._id].filter(x=>typeof x=="string"&&x!=="");if(!m.length)return;const k=Eo(e,l),L=typeof l._sve_label=="string"?l._sve_label.trim():"",T=Yo(e,k);Xo(k)||Xe.set(k,T);const E=jo(k)[`0:${T}`];a.push({uid:m[0],ids:m,type:k,tag:T,label:L||(typeof E=="string"&&E.trim()?E.trim():"")||rt(e,k)?.display||Oe(k)||k,svg:Ro(T,fo(T),null).svg||Te.section,cat:Ho(T,fo(T)),enabled:l.enabled!==!1,static:In(e,k)})});break}}return a}function Dr(e,o,n){if(!n.length)return"";const a=b("dock:current-type")||"",s=b("dock:current-uid"),d=!!b("dock:component-exit-state")?.open;if(s){const h=Be(s,o),l=n.find(m=>m.ids.some(k=>h.includes(k)));if(l&&(d||l.type===a))return l.uid}return n.find(h=>h.type===a)?.uid||""}function Fr(e,o,n){const a=b("dock:component-exit-state");if(a?.open)return Oe(a.name)||a.name||"";if(n)return o.find(d=>d.uid===n)?.label||"";const s=b("dock:current-type")||"";return String(s).startsWith("view:")?"":rt(e,s)?.display||Oe(s)||""}function lt(e,o,n,a,s){const d=n.find(h=>h.uid===a);d&&a!==s&&(j.clear(),I=null,ie=!1,G(),Ke(),V=a,Ko=z(),B=pe.get(d.type)||"",B&&(I=Mt(it(B))||null),Uo=(b("dock:current-type")||"")===d.type,e.clearTimeout(me),me=e.setTimeout(()=>{V="",ye=!1,P(e)},4e3),P(e),Qn(e,d.uid,"tree"),de({source:Z,type:W.SVE_ACTIVATE,ids:d.ids},e),e.setTimeout(()=>P(e),0))}function Lt(e,o){if(!o)return!1;for(const n of e||[])if(n.id===o||Lt(n.children,o))return!0;return!1}function Mt(e){return qt(e)?.id||""}function qt(e){for(const o of e||[]){if(Go(o))return o;const n=qt(o.children);if(n)return n}return null}function Go(e){return!e.kind||e.kind==="component"}function fo(e){return e==="component"?"component":""}function Ar(e,o){const n=o===0||e.path===We;return j.has(e.path)?n:!n}function Br(e){const o=new Set,n=(a,s)=>{for(const d of a)d.children.length&&Ar(d,s)&&o.add(d.id),n(d.children,s+1)};return n(e,0),o}function P(e){const o=e.document,a=K(o)?.querySelector("[data-sve-html-tree-list]");if(!a)return;$r(o),ca(e);const s=z();B&&B===s&&(B=""),b("dock:chrome-kind")&&(B="");const d=B||s,h=it(d,Vo(e));xe=h,We="";const l=b("dock:current-type")||"",m=jo(l),k=Tn(e,o),T=!!(b("dock:component-exit-state")||{}).open;l&&s&&!B&&pe.set(l,s);const E=Ve(e,o);Or(e,E);const x=Dr(e,o,E);if(Lr(e,k,T)){const c=bo(e);xe=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!1,t.layoutFile=!1,t.usedBy=null,t.emptyText="",t.pageTemplate?.entry!==c&&(t.pageTemplate=Mr(e,c)),t.onRefresh=()=>P(e),t.onSection=null,kt(e),Me(a,vt),Tt(e,[]);return}t.pageTemplate=null,Ir(e,String(b("dock:collection-view")||""));const R=String(b("dock:chrome-kind")||"");if(Un(e),k&&!E.length&&!R){xe=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,t.layoutFile=!1,t.emptyText=f(e,"html_tree_page_empty"),t.canEdit=!b("dock:is-locked"),t.look=ro(e),t.onRefresh=()=>P(e),t.onSection=null,kt(e),Me(a,vt),Tt(e,[]);return}t.pageBuilder=k;const S=`${l}|${x}`;let J=!1;S!==_t&&(_t=S,j.clear(),gt!==null&&d!==gt?J=!0:ye=d),(J||ye!==!1&&d!==ye)&&(ye=!1,j.clear(),I=Mt(h)||null),gt=d,V&&(V===x||!E.length)&&(Uo||d!==Ko)&&(e.clearTimeout(me),V="",ye=!1,Lt(h,I)||(j.clear(),I=Mt(h)||null));const ce=E.some(c=>c.uid===V)?V:"",Q=ie?"":ce||x,U=!!(ce||x),H=U||T?"":String(b("dock:chrome-kind")||""),i=k&&(!l&&!U||H==="main"&&b("dock:on-empty-page")===!0),p=i||H==="template"?"":H;t.layoutFile=p==="main",p!=="main"&&(Ue="");const D=p==="main"?vo(h,"main"):null,F=D?ot(h,c=>c.tag==="body"&&Lt(c.children,D.id)):null;We=F?F.path:"",D&&(qe((F||D).path),Ue!==S&&(qe(D.path),j.add(D.path)));const _e=p==="header"||p==="footer"?ot(h,c=>d.slice(c.from,c.openTo).includes(`data-sve-chrome="${p}"`)):null,ne=_e||(p==="header"||p==="footer"?vo(h,p):null);ne&&qe(ne.path);const A=i||!(p==="main"?!!D:p==="header"||p==="footer"?!!ne:!0)?[]:$a(h,t.query?new Set:Br(h));!d.trim()&&!qo(o)?t.emptyText=f(e,"html_tree_need_dock"):t.emptyText=f(e,"html_tree_empty"),t.slotText=f(e,"antlers_drop_here"),t.dataTitle=f(e,"data_vars_title"),t.pageTitle=f(e,"component_props_page"),t.renameTitle=f(e,"html_tree_rename"),t.tagTitle=f(e,"tw_tag"),t.hideTitle=f(e,"html_tree_hide"),t.showTitle=f(e,"html_tree_show"),t.duplicateTitle=f(e,"html_tree_duplicate"),t.deleteTitle=f(e,"html_tree_delete"),t.videoHoldTitle=f(e,"html_tree_video_hold"),t.videoPlayTitle=f(e,"html_tree_video_play"),t.alpineTitle=f(e,"html_tree_alpine_state"),t.lockedTitle=f(e,"html_tree_locked"),t.searchEmpty=f(e,"html_tree_search_empty"),t.canEdit=!b("dock:is-locked"),t.look=ro(e),t.onQuery=()=>P(e),kt(e),t.inComponent=T,t.onSelect=(c,y)=>{const C=A.find(Ce=>Ce.id===c);if(C&&Io(e,C.path))return;const ke=!!y&&C?.kind==="antlers"&&!le&&qn(e);at(e,c,A),ke&&Ma(e,{path:C.path,at:y,beside:K(e.document)})},t.onTwist=c=>{const y=A.find(C=>C.id===c)?.path;y&&(j.has(y)?j.delete(y):j.add(y),P(e))},t.onTagChange=(c,y)=>{const C=t.rows.find(ke=>ke.id===y);C&&!Ut()&&!zt(e,C)&&ha(e,c.currentTarget,C)},t.onRename=c=>zr(e,c),t.onRenameCommit=()=>mo(e,!0),t.onRenameCancel=()=>mo(e,!1),t.onHide=c=>Jr(e,c),t.onLock=c=>Zr(e,c),t.canUnlock=Zo(e),t.lockTitle=f(e,"html_tree_lock"),t.unlockTitle=f(e,"html_tree_unlock"),t.lockedByTitle=f(e,"html_tree_locked_by_developer"),t.onVideoHold=c=>Xr(e,c),t.onAlpineState=(c,y)=>Wr(e,c,y),t.onDuplicate=c=>Qr(e,c),t.onDelete=c=>ti(e,c),t.onPointerDown=(c,y)=>si(e,c,y),t.onSectionPointerDown=(c,y)=>li(e,c,y),t.onSectionHover=c=>e.dispatchEvent(new e.CustomEvent("sve-lite-hover",{detail:{uid:c}})),t.onContext=(c,y)=>ni(e,c,y),t.onInspectCommit=c=>mi(e,c),t.onPropValue=(c,y,C)=>yo(e,c,y,C),t.onPropPage=(c,y)=>_r(e,c,C=>yo(e,y,C,!1)),t.onLoopKind=c=>pi(e,c),t.onAddBranch=c=>gi(e,c),t.onLoopSortField=c=>{const y=nt();if(!y)return;const C=fe?.id===y.id?fe.dir:"";fe=null,te(e,Aa(y,c,C))},t.onLoopSortDir=c=>{const y=nt();if(!y)return;const C=Ba(y,c);if(C.draft){fe={id:y.id,dir:C.draft},$t(e,y);return}fe=null,te(e,C.edit)},t.onLoopDepth=c=>te(e,Va(c)),t.onLoopIncludeHome=c=>te(e,Ka(c)),t.onLoopLimit=c=>te(e,Ua(c)),t.onLoopOffset=c=>te(e,qa(c)),t.onPropHost=c=>c?q.mount(c):q.unmount(),t.onInspectData=(c,y)=>{b("dock:data-menu",{anchor:c,at:A.find(C=>C.id===I)?.from,onPick:C=>y(String(C?.var||"").trim())})};const Gt=A.find(Go)?.id,Wt=T?"":Fr(e,E,Q),he=Q&&!T?E.find(c=>c.uid===Q):null,sn=_o(e,String(b("dock:current-type")||""));let rn=0;const ln=Gr(_e?[_e]:h,d),dn=Co(e,String(l)),ae=p==="header"||p==="footer"?p:"",ge=ne?ne.id:"",ue=D&&A.find(c=>c.id===D.id)||null,Zt=F&&A.find(c=>c.id===F.id)||null,se=Zt||ue||ge&&A.find(c=>c.id===ge)||null,Jt=se?Kr(A,se):-1;if(se&&!A.slice(A.indexOf(se),Jt).some(c=>c.id===I)&&(I=se.id),t.selectFrom){const c=A.find(y=>y.from===t.selectFrom.at&&(!y.kind||y.kind==="sections"));c?(I=c.id,t.selectFrom=null):--t.selectFrom.left<=0&&(t.selectFrom=null)}const Qt=t.layoutFile?Vr(e):null;t.rows=A.map(c=>{const y=Qt&&c.kind==="component"&&Qt.get(c.src)||"",C=c.tag==="body"&&!c.kind,ke=y?{svg:Te[y]}:Ro(c.tag,c.kind,c.antlers),Ce=c.tag==="video"&&!c.kind?rn++:-1,He=ln.get(c.id),hn=He?dn[He.nth]||{}:{},ht=He?He.booleans.map(({key:Ee,value:eo})=>({key:Ee,file:eo,value:hn[Ee]??eo})):[],ut=c.id===Gt&&Wt?Wt:c.klass,Pe=c.id===Gt;return{...c,tag:y||c.tag,frameCall:y,fixed:!!y||C,base:ut,name:y?f(e,`html_tree_frame_${y}`):ae&&c.id===ge?f(e,`html_tree_frame_${ae}`):c===ue?f(e,"html_tree_frame_main"):Pe&&he?ut:Hr(ut,c.path,m),current:c.id===I,letter:ke.letter||"",svg:ae&&c.id===ge?Te[ae]:c===ue?Te.main:Pe&&he?he.svg:ke.svg||"",frame:ae&&c.id===ge?ae:c===ue?"main":"",cat:ae&&c.id===ge?ae:c===ue||C?"main":y||Ho(c.tag,c.kind,c.antlers),componentRoot:Pe&&T,sectionRoot:Pe&&he?he.uid:"",fieldsIcon:!!(Pe&&he&&!he.static),videoNth:Ce,videoHeld:Ce>=0&&sn.has(Ce),alpineNth:ht.length?He.nth:-1,alpineKeys:ht,alpineSet:ht.some(Ee=>Ee.value!==Ee.file)}});const cn=Ia(d,h);for(const c of t.rows){const y=c.kind?null:cn.get(c.path);y&&(c.classes=y.classes,y.kind!=="tag"&&!c.frame&&!c.fixed&&!c.sectionRoot&&c.name===c.klass&&(c.display=y.kind==="column"?f(e,"el_column",{n:y.index}):f(e,`el_${y.kind}`)))}zn(e),Yn(e);const ct=[];for(const c of t.rows)ct.length=c.depth,c.guides=ct.slice(),ct[c.depth]=c.cat;if(se){const c=A.indexOf(se),y=se.depth;t.rows=t.rows.slice(c,Jt).map(C=>({...C,depth:C.depth-y,guides:C.guides.slice(y)})),ue&&Ue!==S&&(Ue=S,e.setTimeout(()=>at(e,ue.id,A),0))}t.sections=k&&!T&&(U||p||i)?E.map(c=>{const y=!!Q&&c.uid===Q;return{...c,current:y,ready:y&&(!ce||!!B),row:{id:`sec:${c.uid}`,section:c.uid,tag:c.tag,name:c.label,kind:"",svg:c.svg,cat:c.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:y,hidden:!c.enabled}}}):[],t.frame=jr(e,E,U,T,p,!1,!!Zt),t.frameEmptyText=f(e,"html_tree_frame_no_sections"),Nr(e,p),t.onSection=c=>{le||(It(e),lt(e,o,E,c,Q))},t.onRefresh=()=>P(e),$t(e,t.rows.find(c=>c.id===I)),Me(a,vt),Tt(e,h)}function Nr(e,o){t.frameOpenTitle=f(e,"html_tree_frame_open"),t.frameMainTitle=f(e,"html_tree_frame_main_open"),t.frameTemplateTitle=f(e,"html_tree_frame_template_open"),t.frameFieldsTitle=f(e,"html_tree_frame_fields"),t.onFrame=n=>{o===n?Ur(e,n):Rt(e,n)},t.onFrameEnter=n=>Rt(e,n),t.onFrameFields=n=>Dn(e,Zn(e,n),f(e,`html_tree_frame_${n}`)),t.onFrameTwist=()=>{t.mainShut=!t.mainShut}}function jr(e,o,n,a,s,d=!1,h=!1){if(!s&&!d||h)return null;const l=L=>({id:`frame:${L}`,frame:L,synthetic:!0,tag:L,name:f(e,`html_tree_frame_${L}`),kind:"",svg:Te[L]||"",cat:L,letter:"",depth:0,hasChildren:L==="main"&&(o.length>0||s==="template"),shut:L!=="main",current:!1,hidden:!1}),m={kind:s,header:l("header"),main:l("main"),footer:l("footer"),template:null},k=s&&s!=="template"?String(b("dock:collection-view")||""):"";return k&&(m.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:rt(e,k)?.display||Oe(k.replace(/^view:/,"")),kind:"",svg:Te.section||"",cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),m}function vo(e,o){return ot(e,n=>n.tag===o)}function ot(e,o){for(const n of e||[]){if(!n.kind&&o(n))return n;const a=ot(n.children,o);if(a)return a}return null}function Vr(e){const o=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},n=new Map;for(const a of["header","footer"]){const s=va(o[a]?.type);s&&n.set(s,a)}return n}function Kr(e,o){let n=e.indexOf(o)+1;for(;n<e.length&&e[n].depth>o.depth;)n+=1;return n}function Ur(e,o){const n=Mo(e);(o==="main"||o==="template"?n?.querySelector("main"):n?.querySelector(`[data-sve-chrome="${o}"]`))?.scrollIntoView({behavior:"smooth",block:"start"})}function It(e){const o=String(b("dock:chrome-open",e.document)||"");return o!=="header"&&o!=="footer"?!1:(Jn(e),de({source:Z,type:W.SVE_FORCE_EXIT_CHROME},e),!0)}function qr(e){e.clearTimeout(me),V="",B="",j.clear(),I=null,ie=!1,G(),Ke()}function Rt(e,o){if(e.document,String(b("dock:chrome-kind")||"")===o)return;if(qr(e),o==="main"){It(e),b("dock:open-file",ia);return}if(o==="template"){const d=String(b("dock:collection-view")||"");d&&(It(e),b("dock:open-file",d));return}if(o!=="header"&&o!=="footer")return;const n=Mo(e)?.querySelector(`[data-sve-chrome="${o}"]`);n?(n.scrollIntoView({block:"nearest"}),n.dispatchEvent(new n.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:Z,type:W.OPEN_CHROME,kind:o},e.location.origin);const a=Date.now(),s=async()=>{if(String(b("dock:chrome-kind")||"")!==o){Date.now()-a<3e4&&e.setTimeout(s,250);return}await(b("dock:load-settled")||null),an(e)};e.setTimeout(s,250)}function Tt(e,o){K(e.document)&&Wo(e,o)}function Wo(e,o){const n=o[0],a=!!b("dock:component-src"),s=a?"":b("dock:current-uid")||"";de({source:Z,type:W.SVE_HTML_PICK,on:!0,uid:s,uids:s?Be(s,e.document):[],all:a,tag:n?.tag||"",klass:n?.klass||"",nodes:Fa(o)},e)}function qe(e){if(!e)return;const o=(n,a)=>{for(const s of n||[]){if(s.path===e)return!0;if(o(s.children,a+1))return a===0||s.path===We?j.delete(s.path):j.add(s.path),!0}return!1};o(xe,0)}function zr(e,o){if(le)return;const n=t.rows.find(a=>a.id===o);zt(e,n)||!n||n.kind||(I=o,t.rows.forEach(a=>{a.current=a.id===o}),t.editingId=o,t.draft=n.name,e.setTimeout(()=>{const a=K(e.document)?.querySelector("[data-sve-ht-rename]");a?.focus(),a?.select()},0))}function mo(e,o){const n=t.editingId;if(!n)return;const a=t.rows.find(s=>s.id===n);t.editingId=null,o&&a&&(a.sectionRoot?Yr(e,a.sectionRoot,t.draft):Pr(b("dock:current-type")||"",a.path,t.draft,a.base||a.klass)),t.draft="",P(e)}function Yr(e,o,n){const a=st(e)||"page_sections",s=String(n||"").replace(/\s+/g," ").trim();for(const d of Dt(e.document)||[]){const h=Ft(d.values),l=h&&typeof h=="object"?h[a]:null;if(!Array.isArray(l))continue;const m=l.findIndex(E=>E&&typeof E=="object"&&[E._visual_id,E.id,E._id].includes(o));if(m===-1)continue;const k=Eo(e,l[m]),L=rt(e,k)?.display||Oe(k)||k,T=JSON.parse(JSON.stringify(l));return T[m]={...T[m]},!s||s===L?delete T[m]._sve_label:T[m]._sve_label=s,d.setFieldValue(a,T),!0}return!1}function Xr(e,o){const n=t.rows.find(l=>l.id===o);if(!n||!(n.videoNth>=0))return;const a=String(b("dock:current-type")||""),s=_o(e,a),d=!s.has(n.videoNth);d?s.add(n.videoNth):s.delete(n.videoNth);const h=String(b("dock:current-uid")||"");Wn(e,a,s),de({source:Z,type:W.SVE_VIDEO_HOLD,uid:h,uids:h?Be(h,e.document):[],nth:n.videoNth,on:d},e),P(e)}function Gr(e,o){const n=new Map;let a=0;const s=d=>{for(const h of d){if(h.hidden)continue;const l=h.kind?null:Xa(o.slice(h.from,h.openTo));l!==null&&n.set(h.id,{nth:a++,booleans:Wa(l)}),s(h.children||[])}};return s(e),n}function Wr(e,o,n){const a=t.rows.find(d=>d.id===n);if(!a||!(a.alpineNth>=0))return;if(a.alpineKeys.length===1){po(e,a,a.alpineKeys[0]);return}const s=o.currentTarget.getBoundingClientRect();G(),oe=Ne(e.document,je,{items:a.alpineKeys.map(d=>({label:d.key,icon:d.value?Qo:en,onPick:()=>{G(),po(e,a,d)}})),x:Math.round(s.left),y:Math.round(s.bottom+4),onClose:()=>{oe=null}})}function po(e,o,n){const a=String(b("dock:current-type")||""),s=Co(e,a),d=!n.value,h=d!==n.file,l={...s[o.alpineNth]||{}};h?l[n.key]=d:delete l[n.key],Object.keys(l).length?s[o.alpineNth]=l:delete s[o.alpineNth];const m=na(String(b("dock:chrome-kind")||"")),k=m?"":String(b("dock:current-uid")||"");aa(e,a,s),de({source:Z,type:W.SVE_ALPINE_STATE,uid:k,uids:k?Be(k,e.document):[],chrome:m,nth:o.alpineNth,key:n.key,value:d,on:h},e),P(e)}function zt(e,o){return!o||!(o.locked||o.lockedIn)?!1:(e.Statamic?.$toast?.error(f(e,"html_tree_locked_element")),!0)}function Zo(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function Zr(e,o){const n=t.rows.find(a=>a.id===o);if(!(!n||n.lockedIn||b("dock:is-locked"))){if(!n.locked){we(e,o,Sa,{lockAction:!0});return}if(!Zo(e)){e.Statamic?.$toast?.error(f(e,"html_tree_unlock_denied"));return}Bt(e,{titleKey:"html_tree_unlock_title",bodyKey:"html_tree_unlock_body",confirmKey:"html_tree_unlock_confirm"},()=>we(e,o,_a,{lockAction:!0,unlock:!0}))}}function Yt(e){return!!t.rows.find(o=>o.id===e)?.fixed}function Jr(e,o){Yt(o)||we(e,o,Ca)}function Qr(e,o){if(Yt(o))return;const n=t.rows.find(a=>a.id===o)?.sectionRoot;if(n){e.postMessage({source:Z,type:W.DUPLICATE_ROW,uid:n},e.location.origin);return}we(e,o,Ha)}function Jo(e,o){Bt(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const n=e.document;sa({uid:o},n,e)})}function ei(e,o,n){V===n&&(e.clearTimeout(me),V="",B=""),I=null,ie=!1,_t="";const a=Ve(e,o),s=a.find(d=>d.uid!==n)||a[0];s?lt(e,o,a,s.uid,""):(B="",t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,P(e)),e.setTimeout(()=>{K(e.document)&&P(e)},0)}Po("row:removed",({uid:e,parentPath:o,doc:n,win:a})=>{o!==st(a)||!K(a.document)||ei(a,n,e)});function ti(e,o){if(Yt(o))return;const n=t.sections?.find(s=>s.row?.id===o),a=n?n.row?.section||n.uid:t.rows.find(s=>s.id===o)?.sectionRoot;if(a){Jo(e,a);return}if(t.rows.find(s=>s.id===o)?.kind==="sections"){Bt(e,{titleKey:"html_tree_sections_remove_title",bodyKey:"html_tree_sections_remove_body",confirmKey:"html_tree_sections_remove_confirm"},()=>we(e,o,io));return}we(e,o,io)}function we(e,o,n,{lockAction:a=!1,unlock:s=!1}={}){if(b("dock:is-locked"))return;const d=z(),h=t.rows.find(m=>m.id===o);if(!h||!a&&zt(e,h))return;const l=n(d,h);l!==d&&Se(l,{unlock:s})}function G(){oe?.dismiss(),oe=null}const Qo='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',en='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>';function tn(e,o){const n=t.sections?.find(m=>m.uid===o),a=n?.type||"";if(!a||!To(e))return[];const s=n.label||a,d=Rn(e,a),h=()=>e.Statamic?.$toast?.error(f(e,"section_update_failed")),l=[{label:f(e,"static_section_insertable"),icon:d?en:Qo,onPick:()=>{G(),oo(e,{handle:a,hidden:!d}).then(()=>{e.Statamic?.$toast?.success(f(e,d?"section_shown_to_editors":"section_hidden_from_editors",{name:s})),no(e)}).catch(h)}}];return n.static&&l.push({label:f(e,"section_add_fields"),onPick:()=>{G(),oo(e,{handle:a,fields:!0}).then(()=>{e.Statamic?.$toast?.success(f(e,"section_fields_added",{name:s})),no(e),P(e),xo(e,a)}).catch(h)}}),l}function oi(e,o,n){const a=n.row?.section||n.uid;a&&(oe=Ne(e.document,je,{items:[...tn(e,a),{label:f(e,"html_tree_remove_section"),danger:!0,onPick:()=>{G(),Jo(e,a)}}],x:o.clientX,y:o.clientY,onClose:()=>{oe=null}}))}function ni(e,o,n){G();const a=t.sections?.find(l=>l.row?.id===n);if(a){oi(e,o,a);return}const s=t.rows.find(l=>l.id===n);if(!s)return;at(e,n,t.rows);const d={x:o.clientX,y:o.clientY},h=l=>{l.length&&(oe?.dismiss(),oe=Ne(e.document,je,{items:l,x:d.x,y:d.y,onClose:()=>{oe=null}}))};if(s.frameCall){h([{label:f(e,"html_tree_frame_edit",{frame:f(e,`chrome_${s.frameCall}`)}),onPick:()=>{G(),Rt(e,s.frameCall)}}]);return}if(s.kind==="component"){ai(e,s,h);return}s.kind==="slot"||s.kind==="sections"||s.locked||s.lockedIn||t.canEdit&&(s.componentRoot||h([...s.sectionRoot?tn(e,s.sectionRoot):[],{label:f(e,"component_make"),onPick:()=>{G(),fa(e,s,{onDone:()=>P(e),onError:l=>{e.alert(l?.status===409?f(e,"component_exists"):f(e,"component_failed"))}})}}]))}const go=(e,o)=>{G(),b("dock:open-template",o)};function ai(e,o,n){if(!Oa(o.src)){n([{label:f(e,"component_open_named",{name:Da(o.src)||o.src}),onPick:()=>go(e,`view:partials/${o.src}`)}]);return}n([{label:f(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(o.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(a=>a.ok?a.json():{items:[]}).then(a=>{const s=Array.isArray(a.items)?a.items:[];n(s.length?s.map(d=>({label:f(e,"component_open_named",{name:d.label}),onPick:()=>go(e,d.type)})):[{label:f(e,"component_none"),onPick:null}])}).catch(()=>n([{label:f(e,"component_none"),onPick:null}]))}function si(e,o,n){if(o.button!==0||b("dock:is-locked")||t.editingId)return;const a=t.rows.find(h=>h.id===n);if(a&&(a.locked||a.lockedIn)||o.target?.closest?.("button, input"))return;Ke(),ve=n,Re={x:o.clientX,y:o.clientY},Je=o.currentTarget,Qe=o.pointerId;const s=h=>ri(e,h),d=h=>ii(e,h);Pt=()=>{e.document.removeEventListener("pointermove",s,!0),e.document.removeEventListener("pointerup",d,!0),e.document.removeEventListener("pointercancel",d,!0),Pt=null},e.document.addEventListener("pointermove",s,!0),e.document.addEventListener("pointerup",d,!0),e.document.addEventListener("pointercancel",d,!0)}function ri(e,o){if(!ve||!Re)return;const n=o.clientX-Re.x,a=o.clientY-Re.y;if(!t.dragging&&n*n+a*a<25)return;if(!t.dragging){t.dragging=!0;try{Je?.setPointerCapture?.(Qe)}catch{}}o.preventDefault();const s=e.document.elementFromPoint(o.clientX,o.clientY),d=s?.closest?.("[data-sve-ht-slot]");if(d){const T=d.getAttribute("data-sve-ht-id");if(T&&T!==ve){t.dropId=T,t.dropPlace="inside";return}}const h=s?.closest?.("[data-sve-ht-row]"),l=h?.getAttribute("data-sve-ht-id");if(!l||l===ve){t.dropId=null,t.dropPlace=null;return}const m=t.rows.find(T=>T.id===l),k=t.rows.find(T=>T.id===ve);if(!m||m.lockedIn||k&&m.path.startsWith(`${k.path}/`)){t.dropId=null,t.dropPlace=null;return}const L=h.getBoundingClientRect();t.dropId=l,t.dropPlace=xa(o.clientY-L.top,L.height,!Oo(m.tag)&&!$o(m)&&!m.locked)}function ii(e,o){const n=ve,a=t.dropId,s=t.dropPlace||"after",d=t.dragging;if(Ke(),d&&(le=!0,e.setTimeout(()=>{le=!1},0)),!d||b("dock:is-locked")||!n||!a||n===a)return;o?.preventDefault?.();const h=z(),l=wa(h,xe,n,a,s);l!==h&&Se(l)}function Ke(){try{Je?.releasePointerCapture?.(Qe)}catch{}Pt?.(),ve=null,Re=null,Je=null,Qe=null,t.dragging=!1,t.dropId=null,t.dropPlace=null}function li(e,o,n){if(o.button!==0||!n||t.editingId||o.target?.closest?.("button, input"))return;on(),Fe=n,$e={x:o.clientX,y:o.clientY},et=o.currentTarget,tt=o.pointerId;const a=d=>di(e,d),s=d=>ci(e,d);Et=()=>{e.document.removeEventListener("pointermove",a,!0),e.document.removeEventListener("pointerup",s,!0),e.document.removeEventListener("pointercancel",s,!0),Et=null},e.document.addEventListener("pointermove",a,!0),e.document.addEventListener("pointerup",s,!0),e.document.addEventListener("pointercancel",s,!0)}function di(e,o){if(!Fe||!$e)return;const n=o.clientX-$e.x,a=o.clientY-$e.y;if(!t.dragging&&n*n+a*a<25)return;if(!t.dragging){t.dragging=!0;try{et?.setPointerCapture?.(tt)}catch{}}o.preventDefault();const d=e.document.elementFromPoint(o.clientX,o.clientY)?.closest?.("[data-sve-ht-sec-uid]"),h=d?.getAttribute("data-sve-ht-sec-uid")||"";if(!h||h===Fe){t.sectionDrop=null;return}const l=d.getBoundingClientRect();t.sectionDrop={uid:h,place:o.clientY-l.top<l.height/2?"before":"after"}}function ci(e,o){const n=Fe,a=t.sectionDrop,s=t.dragging;on(),s&&(le=!0,e.setTimeout(()=>{le=!1},0)),!(!s||!n||!a?.uid||a.uid===n)&&(o?.preventDefault?.(),hi(e,n,a.uid,a.place))}function on(){try{et?.releasePointerCapture?.(tt)}catch{}Et?.(),Fe=null,$e=null,et=null,tt=null,t.dragging=!1,t.sectionDrop=null}function hi(e,o,n,a){const s=st(e)||"page_sections";for(const d of Dt(e.document)||[]){const h=Ft(d.values),l=h&&typeof h=="object"?h[s]:null;if(!Array.isArray(l))continue;const m=E=>l.findIndex(x=>x&&typeof x=="object"&&[x._visual_id,x.id,x._id].includes(E)),k=m(o),L=m(n);if(k===-1||L===-1||k===L)return!1;let T=a==="before"?L:L+1;return k<T&&(T-=1),T===k?!1:(e.postMessage({source:Z,type:W.MOVE,uid:o,toIndex:T},e.location.origin),e.setTimeout(()=>P(e),60),!0)}return!1}function $t(e,o){if(o?.kind==="component"){ui(e,o);return}if(X.callOpen&&(X.callOpen=!1,X.callStore=null,q.forget(),Vt(e)),o?.kind!=="antlers"){t.inspect=null;return}const n=o.id,a={logic:!0,path:o.path};if(o.tag==="else"){t.inspect={key:n,...a,title:f(e,"antlers_condition"),mode:"note",note:f(e,"antlers_else_note")};return}if(o.antlers==="loop"){t.inspect={...ja(e,o,{key:n,draft:fe?.id===o.id?fe.dir:""}),...a};return}t.inspect={key:n,...a,title:f(e,"antlers_condition"),mode:"condition",value:o.expr||"",placeholder:f(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:f(e,"antlers_add_elseif")},{id:"else",label:f(e,"antlers_add_else")}]}}function ui(e,o){if(!pa(e)){t.inspect=null;return}if(!o.src)return;const n=o.id;if(t.inspect={key:n,title:f(e,"component_props_values"),mode:"note",note:f(e,"code_dock_loading")},ga()){const a={},s={},d=new Map;for(const[h,l]of ka(z().slice(o.from,o.to))){const m=ya(h);m&&(h!==m||!d.has(m))&&d.set(m,l)}for(const[h,l]of d)l.bound?s[h]=l.value:a[h]=l.value;uo!==n&&(uo=n,De.clear());for(const h of De)h in s||(s[h]="");t.inspect=null,X.callOpen=!0,X.title=X.title||f(e,"component_props"),X.callTitle=o.klass||o.name||o.src,X.callStore=q.ui,q.ui.canBind=!0,q.ui.dataTitle=f(e,"data_vars_title"),q.ui.exprPlaceholder=f(e,"component_props_expr"),q.ui.onToggleBind=(h,l)=>vi(e,h,l),q.ui.onExpr=(h,l)=>ko(e,h,l),q.ui.onPickData=(h,l)=>b("dock:data-menu",{anchor:l,at:o.from,onPick:m=>ko(e,h,String(m?.var||"").trim())}),q.load(e,{key:`${o.src}::${n}`,src:o.src,params:a,bindings:s,readOnly:b("dock:is-locked")===!0}),q.watch(e,{src:o.src,write:h=>fi(e,h,s)}),Vt(e);return}ba(e,o.src).then(a=>{if(t.inspect?.key===n){if(!a.length){t.inspect={key:n,title:f(e,"component_props_values"),mode:"note",note:f(e,"component_props_values_none")};return}t.inspect={key:n,title:f(e,"component_props_values"),mode:"props",inheritLabel:f(e,"component_props_inherit"),rows:Ta(a,z().slice(o.from,o.to))}}})}function fi(e,o,n={}){const a=t.rows.find(h=>h.id===I);if(a?.kind!=="component"||b("dock:is-locked"))return;let s=z(),d=a.to;for(const[h,l]of Object.entries(o||{})){if(h in n)continue;const m=s.length,k=Kt(s,{from:a.from,to:d},h,l);k!==s&&(d+=k.length-m,s=k)}s!==z()&&(Se(s,{save:!0}),P(e))}function vi(e,o,n){n?De.add(o):De.delete(o),nn(e,o,"",n),P(e)}function ko(e,o,n){De.add(o),nn(e,o,n,!0),P(e)}function nn(e,o,n,a){const s=t.rows.find(l=>l.id===I);if(s?.kind!=="component"||b("dock:is-locked"))return;const d=z(),h=Kt(d,s,o,n,{bound:a});h!==d&&Se(h,{save:!0})}function nt(){const e=t.rows.find(o=>o.id===I);return e?.kind==="antlers"&&!b("dock:is-locked")?e:null}function te(e,o){const n=nt();if(!n)return;const a=z(),s=o(a,n);s!==a&&(Se(s),P(e))}function yo(e,o,n,a){const s=t.rows.find(l=>l.id===I);if(s?.kind!=="component"||b("dock:is-locked"))return;const d=z(),h=Kt(d,s,o,n,{bound:a});h!==d&&(Se(h,{save:!0}),P(e))}function mi(e,o){te(e,(n,a)=>a.antlers==="loop"?za(a,o)(n,a):Pa(n,a,o))}function pi(e,o){const n=nt();if(!n||n.antlers!=="loop")return;const a=Na(e,n,o);a&&te(e,a)}function gi(e,o){te(e,(n,a)=>Ea(n,a,o))}function ki(e,o){if(!e||!o||$o(o)||Oo(o.tag))return null;const n=ma(e,o);if(n<o.openTo)return null;const a=e.lastIndexOf(`
`,n-1)+1;return e.slice(a,n).trim()===""&&a>o.openTo?a-1:n}function at(e,o,n){if(le)return;const a=(n||t.rows).find(s=>s.id===o);a&&(I=o,t.rows.forEach(s=>{s.current=s.id===o}),$t(e,a),!Ut()&&(b("dock:reveal-html",{from:a.from,to:a.to,caret:ki(z(),a)}),b("dock:tw-follow"),de({source:Z,type:W.SVE_HTML_PICK_FOCUS,path:a.path,src:a.kind==="component"&&a.src||""},e)))}function yi(e,o){if(!o)return"";const n=[],a=(s,d)=>{for(const h of s||[]){const l=d||h.path===e;h.kind==="component"&&h.src===o&&n.push({path:h.path,inside:l}),a(h.children,l)}};return a(xe,!1),(n.find(s=>s.inside)||n[0])?.path||""}function bi(e,o){if(!o||!K(e.document))return;ie=!1,P(e),qe(o),P(e);const n=t.rows.find(a=>a.path===o);n&&(at(e,n.id,t.rows),e.setTimeout(()=>{K(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function Ot(e){if(Ge)return;const o=()=>{t.editingId||t.dragging||(e.clearTimeout(Ze),Ze=e.setTimeout(()=>{K(e.document)&&P(e)},80))},n=()=>{if(o(),b("dock:on-empty-page")===!0){const a=Ve(e,e.document);a.length===1&&lt(e,e.document,a,a[0].uid,"")}};Ge=Po("dock:html-changed",o),e.document.addEventListener("sve-page-structure",n),Ht=()=>{e.document.removeEventListener("sve-page-structure",n)}}function Ti(e){Ge?.(),Ge=null,Ht?.(),Ht=null,e?.clearTimeout?.(Ze),Ze=0}function Xt(e){const o=K(e.document);if(de({source:Z,type:W.SVE_HTML_PICK,on:!1},e),Ti(e),q.forget(),X.callOpen=!1,X.callStore=null,Vt(e),Ke(),G(),da(e),I=null,t.inspect=null,t.editingId=null,t.draft="",t.sections=[],t.pageBuilder=!1,t.layoutFile=!1,V="",e?.clearTimeout?.(me),!o){wt(e);return}o.remove(),At.headerTab==="html_tree"&&Bn(e,null),Nn(e),wo(e),So(e),wt(e)}function Ni(e,o){o.querySelector("[data-sve-html-tree-list]")||(o.id=ze,Me(o,Do,{title:f(e,"html_tree")}),o.querySelector("[data-sve-close]")?.addEventListener("click",()=>Xt(e)))}function ji(e){Ot(e),P(e)}function an(e){const o=e.document;if(!bn(e,"html_tree"))return;if(K(o)){Ot(e),P(e);return}if(!qo(o))return;ie=!0,j.clear(),jn(e,[ze]);const n=o.createElement("div");n.id=ze,n.style.cssText=Vn,Me(n,Do,{title:f(e,"html_tree")}),n.querySelector("[data-sve-close]")?.addEventListener("click",()=>Xt(e)),Kn(e,n),wo(e),So(e),wt(e),Ot(e),P(e)}function Vi(e){if(K(e.document)){Xt(e);return}an(e)}Nt("html-tree:open-section",e=>{const o=window,n=o.document,a=Ve(o,n),s=a.find(d=>d.uid===e||d.ids.includes(e));return s?(lt(o,n,a,s.uid,""),{uid:s.uid,ids:s.ids}):null});Nt("html-tree:from-preview",({path:e,src:o,uid:n}={})=>{if(!Io(window,e)){if(!e){xi(window,n);return}bi(window,yi(e,o)||e)}});function xi(e,o){if(!o||!K(e.document))return;const n=Ve(e,e.document),a=Be(o,e.document),s=n.find(d=>d.ids.some(h=>a.includes(h)));s&&(ie&&(ie=!1,j.clear(),I=null),V&&V!==s.uid&&(e.clearTimeout(me),V="",B=""),!b("dock:load-settled")&&P(e))}Nt("html-tree:arm-pick",e=>{const o=window;return e?(Wo(o,it(z(),Vo(o))),!0):(K(o.document)||de({source:Z,type:W.SVE_HTML_PICK,on:!1},o),!0)});function Ki(){pe.clear(),Ie.clear(),Ct.clear(),Xe.clear(),Ae.length=0}export{Er as HTML_TREE_STYLE_ID,Bi as armHtmlTreePrefetch,Ki as clearHtmlTreeTemplates,G as closeHtmlTreeMenu,Xt as closeHtmlTreePanel,$r as ensureHtmlTreeStyles,Ni as fillHtmlTreePane,I as htmlTreeActiveId,K as htmlTreePanel,Ze as htmlTreeTimer,Ge as htmlTreeUnhook,an as openHtmlTreePanel,P as renderHtmlTree,ji as showHtmlTreePane,Ti as stopWatchHtmlTreeDock,Vi as toggleHtmlTreePanel,Ot as watchHtmlTreeDock};
