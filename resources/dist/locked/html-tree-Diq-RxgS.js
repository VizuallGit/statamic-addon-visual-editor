import{q as v,f as gn,o as f,c as k,a as O,t as L,u as i,e as kn,l as yn,F as $,j as te,g as S,w,Y as $e,N as K,aa as bn,a2 as Tn,ag as xe,k as _t,ae as xn,X as ie,aE as wn,v as so,x as _n,W as Sn,aF as Cn,ac as To,aG as Pn,D as it,m as Ft,p as Bt,V as Ne,a8 as En,aH as Hn,aI as Mn}from"./addon-BVvQGZmc.js";import{c as xo,a as Ln,o as In,b as On,d as Rn,T as $n,i as Dn,r as An,e as Fn,f as Bn,u as ro,l as io}from"./section-create-zG70jKks.js";import{canEditFields as wo,openGlobalFieldsOverlay as Nn,openFieldsetOverlay as _o}from"./section-fields-L6xdSiR9.js";import{U as t,V as Vn,W as Q,X as jn,b,s as Nt,y as ue,j as St,H as Kn,i as Un,E as So,F as Co,Y as lo,Z as Po,m as De,D as qn,R as Yn,G as zn,_ as lt,$ as Xn,a0 as co,a1 as Wn,a2 as Gn,a3 as Eo,a4 as Ho,a5 as Mo,a6 as Zn,a7 as Qn,o as Lo,a8 as Jn,a9 as Io,l as dt,aa as Ue,ab as Oo,ac as ea,ad as Vt,ae as ta,af as oa,ag as na,x as aa,ah as sa,ai as ra,aj as ia,ak as Ro,al as $o,am as la,an as da,ao as ca,ap as ha,aq as Do,ar as ua,as as va,A as fa,at as jt}from"./lp-cluster-CtQJxDLS.js";import{H as We,u as ma,d as pa}from"./shortcuts-BIxtNjMb.js";import{_ as Kt,o as Pe}from"./ChoiceDialog-oJSRJadQ.js";import{M as B,S as W}from"./protocol-BVdEmGBQ.js";import{C as ga,H as Ee,s as Ut,c as ka,a as ya,b as Ao,t as ba,d as we,h as Fo,e as Ta,f as xa,w as qt,g as wa,i as _a,j as Sa,p as Ca,r as Pa,k as Ea,l as Ha,m as Ma,v as La,n as Ia,o as Oa,q as Ra,u as $a,x as Da,y as Aa,z as Fa,A as Ba,B as ho,D as Na,E as Va}from"./component-extract-CRNsL-U8.js";import{H as ja,r as Bo,o as Ka,h as Ua,e as qa,w as Ya}from"./logic-popup-VhyeaaKf.js";import{b as za}from"./html-pick-align-BNtmyz2s.js";import{l as Xa,a as Wa,b as Ga,c as Za,d as Qa,e as Ja,f as es,g as ts,h as os}from"./loop-inspector-CBDtd4y_.js";import"./css-scope-CjYW0rgU.js";import"./FieldsetOverlay-lbWocLS_.js";import"./ai-text-icon-B7uCWIwa.js";import"./help-styles-Cc-cqpAH.js";const mt=/\s*([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/y,ns=/^\s*(?:([A-Za-z_$][\w$]*)|'([^'\\]*)'|"([^"\\]*)")\s*:\s*(true|false)\s*$/;function as(e){const o=String(e||"").replace(/\{\{[\s\S]*?\}\}/g,s=>" ".repeat(s.length)),a=o.match(/^<[a-zA-Z][\w:-]*/);if(!a)return null;let n=a[0].length;for(;n<o.length;){mt.lastIndex=n;const s=mt.exec(o);if(!s){n+=1;continue}if(s[1].toLowerCase()==="x-data")return s[2]??s[3]??s[4]??"";n=mt.lastIndex}return null}function ss(e,o){const a=e[o];for(let n=o+1;n<e.length;n+=1)if(e[n]==="\\")n+=1;else if(e[n]===a)return n;return e.length-1}function rs(e){const o=String(e||""),a=o.search(/\S/);if(a===-1||o[a]!=="{")return[];const n=new Map;let s=0,r="";const d=()=>{const h=r.match(ns);h&&n.set(h[1]??h[2]??h[3],h[4]==="true"),r=""};for(let h=a;h<o.length;h+=1){const p=o[h];if(p==='"'||p==="'"||p==="`"){const g=ss(o,h);r+=o.slice(h,g+1),h=g;continue}if(p==="/"&&o[h+1]==="/"){const g=o.indexOf(`
`,h);h=g===-1?o.length:g-1;continue}if(p==="/"&&o[h+1]==="*"){const g=o.indexOf("*/",h+2);h=g===-1?o.length:g+1;continue}if(p==="{"||p==="["||p==="("){if(s+=1,s===1)continue}else if(p==="}"||p==="]"||p===")"){if(s-=1,s===0)break}else if(p===","&&s===1){d();continue}r+=p}return d(),[...n].map(([h,p])=>({key:h,value:p}))}const is={class:"sve-html-tree"},ls={class:"sve-pane-bar","data-sve-pane-bar":""},ds={"data-sve-right-title":""},cs={"data-sve-right-actions":""},hs=["aria-pressed","title","aria-label"],us=["title"],vs={class:"sve-ht-used-by__label"},fs={class:"sve-ht-used-by__chips"},ms=["title","onClick"],ps={key:1,class:"sve-ht-used-by__chip"},gs={key:0,class:"sve-ht-used-by__empty"},ks={class:"sve-ht-tools"},ys=["title"],bs=["placeholder","aria-label","value"],Ts=["aria-label"],xs=["title","aria-label"],ws=["title","aria-label"],_s={key:3,class:"sve-tree-exit"},Ss=["title"],Cs=["title"],Ps='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',Es='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',Hs='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',Ms='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',Ls='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/></svg>',Is='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',Os={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const o=v(window,"html_tree_search");t.layers=Vn(window);const a=v(window,"html_tree_layers_on"),n=v(window,"html_tree_layers_off");function s(){jn(window,!t.layers)}const r=xo(window),d=v(window,"section_new"),h=v(window,"html_tree_add_element"),p=v(window,"html_tree_sections_slot"),g=v(window,"html_tree_sections_no_field");function E(){const H=t.templateSections.length?t.templateSections:[bn(window)],u=new Set(t.rows.filter(l=>l.kind==="sections").map(l=>l.tag));return H.filter(l=>!u.has(l)).map(l=>({tag:`sections:${l}`,label:H.length>1?`${p} · ${l}`:p,noField:!t.templateSections.length}))}const T=gn(!1),M=v(window,"section_import");function x(){T.value=!1}async function R(H){if(!H)return;await Tn(),t.onRefresh?.();const u=b("html-tree:open-section",H);u&&An(window,u.ids)}function _(){const H=t.rows.find(u=>u.current&&!u.context&&!u.synthetic)||null;return H?.lockedIn?t.rows.filter(u=>u.locked&&u.from<=H.from&&u.to>=H.to).sort((u,l)=>u.from-l.from)[0]||null:H}function ee(H){const u=H.getBoundingClientRect(),l=_();let m=null;const A=(F,Me,ae="")=>()=>{m?.dismiss(),m=null,x();const ht=Dn(window,F,l,Me);ht!==null&&(t.selectFrom={at:ht,left:4},ae&&window.Statamic?.$toast?.info?.(ae))};m=Pe(document,Ee,{items:[...$n.map(F=>({label:F,onPick:A(F,`<${F}>`)})),...E().map(F=>({label:F.label,onPick:A(F.tag,F.label,F.noField?g:"")}))],x:Math.round(u.left),y:Math.round(u.bottom+4),onClose:()=>{m=null,x()}})}function ne(H){if(!T.value){if(T.value=!0,!(t.sections.length||t.pageBuilder)){ee(H.currentTarget);return}(async()=>{const u=await Ln(window);if(!u){x();return}const l=t.sections.length?t.sections[t.sections.length-1].uid:null,m=A=>{x(),R(A?.uid)};if(u==="static"){In(window,{afterUid:l,onDone:m,onError:x,onClose:x});return}On(window,{afterUid:l,onDone:m,onError:x,onClose:x})})()}}function G(){if(T.value)return;T.value=!0;const H=!!(t.sections.length||t.pageBuilder);Rn(window,{intoTemplate:!H,after:H?null:_(),afterUid:H&&t.sections.length?t.sections[t.sections.length-1].uid:null,onDone:u=>{if(x(),H){R(u?.uid);return}Number.isInteger(u?.at)&&(t.selectFrom={at:u.at,left:4})},onError:x,onClose:x})}function N(H){const u=!!t.query;t.query=H,u!==!!H&&t.onQuery?.()}return(H,u)=>(f(),k("div",is,[O("div",ls,[O("div",ds,L(e.title),1),O("div",cs,[O("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":i(t).layers?"true":"false",title:i(t).layers?i(n):i(a),"aria-label":i(t).layers?i(n):i(a),innerHTML:Ps,onClick:s},null,8,hs),u[5]||(u[5]=kn('<button type="button" data-sve-right-pin aria-pressed="false" data-v-2763765f></button><button type="button" data-sve-close aria-label="Close" data-v-2763765f><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-2763765f><path d="M18 6 6 18" data-v-2763765f></path><path d="m6 6 12 12" data-v-2763765f></path></svg></button>',2))])]),i(t).usedBy?(f(),k("div",{key:0,class:"sve-ht-used-by",title:i(t).usedBy.hint||null},[O("span",vs,[O("span",{class:"sve-ht-used-by__icon","aria-hidden":"true",innerHTML:Ls}),yn(" "+L(i(t).usedBy.label),1)]),O("span",fs,[(f(!0),k($,null,te(i(t).usedBy.items,l=>(f(),k($,{key:l.kind+":"+l.name},[l.onOpen?(f(),k("button",{key:0,type:"button",class:"sve-ht-used-by__chip sve-ht-used-by__chip--open",title:l.openLabel,onClick:m=>l.onOpen(m.currentTarget)},L(l.name),9,ms)):(f(),k("span",ps,L(l.name),1))],64))),128)),i(t).usedBy.empty?(f(),k("span",gs,L(i(t).usedBy.empty),1)):S("",!0)])],8,us)):S("",!0),O("div",ks,[O("label",{class:"sve-ht-search",title:i(o)},[O("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:Ms}),O("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:i(o),"aria-label":i(o),value:i(t).query,autocomplete:"off",spellcheck:"false",onInput:u[0]||(u[0]=l=>N(l.target.value)),onKeydown:[u[1]||(u[1]=w(()=>{},["stop"])),u[2]||(u[2]=$e(w(l=>N(""),["prevent"]),["escape"]))]},null,40,bs),i(t).query?(f(),k("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":i(o),innerHTML:Is,onClick:u[3]||(u[3]=l=>N(""))},null,8,Ts)):S("",!0)],8,ys),i(r)&&(i(t).sections.length||i(t).pageBuilder||i(t).rows.length&&!i(t).layoutFile)?(f(),k("button",{key:0,type:"button",class:"sve-ht-new",title:i(t).sections.length||i(t).pageBuilder?i(d):i(h),"aria-label":i(t).sections.length||i(t).pageBuilder?i(d):i(h),innerHTML:Es,onClick:ne},null,8,xs)):S("",!0),i(r)&&(i(t).sections.length||i(t).pageBuilder||i(t).rows.length&&!i(t).layoutFile)?(f(),k("button",{key:1,type:"button",class:"sve-ht-import",title:i(M),"aria-label":i(M),innerHTML:Hs,onClick:G},null,8,ws)):S("",!0)]),i(Q).inSidebar?S("",!0):(f(),K(ga,{key:1})),u[6]||(u[6]=O("div",{"data-sve-html-tree-list":""},null,-1)),i(t).inspect?.logic?S("",!0):(f(),K(ja,{key:2})),i(t).exitOpen&&!i(Q).inSidebar?(f(),k("div",_s,[O("span",{class:"sve-tree-exit__name",title:i(t).exitName},L(i(t).exitName),9,Ss),O("button",{type:"button",class:"sve-tree-exit__go",title:i(t).exitTitle,onClick:u[4]||(u[4]=l=>i(t).onExit?.())},L(i(t).exitLabel),9,Cs)])):S("",!0)]))}},No=Kt(Os,[["__scopeId","data-v-2763765f"]]);function Vo(e){return String(e||"").trim().toLowerCase()}function Ct(e,o){return o?[e.name,e.tag,e.klass,e.label,e.src].filter(a=>typeof a=="string"&&a).join(" ").toLowerCase().includes(o):!0}function Rs(e,o){const a=Vo(o);if(!a)return{rows:e,hits:new Set};const n=new Set;for(const d of e)Ct(d,a)&&n.add(d.path);const s=[...n];return{rows:e.filter(d=>n.has(d.path)||s.some(h=>h.startsWith(`${d.path}/`))),hits:n}}const $s=["title"],Ds={"data-sve-ht-indent":"","aria-hidden":"true"},As=["data-sve-ht-cat"],Fs={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},Bs={key:2,"data-sve-ht-letter":""},Ns=["innerHTML"],Vs=["title"],js=["data-sve-ht-classes","title"],Ks={key:1,"data-sve-ht-kind":""},Us={key:3,"data-sve-ht-name":""},qs={key:4,"data-sve-ht-actions":""},Ys=["data-on","title","innerHTML"],zs=["title"],Xs={key:5,"data-sve-ht-actions":""},Ws=["data-on","title","innerHTML"],Gs=["data-on","title","innerHTML"],Zs=["disabled","title"],Qs=["disabled","title","innerHTML"],Js=["disabled","title"],er=["disabled","title"],tr=["aria-label"],or=["data-sve-ht-id"],nr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',ar='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',sr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',rr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',ir='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',lr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',dr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',uo='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6.5" width="20" height="11" rx="5.5"/><circle cx="7.5" cy="12" r="3" fill="currentColor" stroke="none"/></svg>',vo='<svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M7.5 5.5h9a6.5 6.5 0 0 1 0 13h-9a6.5 6.5 0 0 1 0-13ZM16.5 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6Z"/></svg>',cr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',hr='<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>',ur='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',vr=120,fr={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const o=wo(window);function a(u){return u.synthetic?u.frame==="main"?t.frameMainTitle:u.frame==="template"?t.frameTemplateTitle:t.frameOpenTitle:u.kind==="component"?u.src?`partial:${u.src}`:u.tag:u.name?`${u.tag} ${u.name}`:u.tag}function n(u){return!!u.section}function s(u){return!!u.frame}function r(u){return u.kind==="slot"}function d(u,l){s(l)||r(l)||(n(l)?t.onSectionPointerDown?.(u,l.section):l.sectionRoot?t.onSectionPointerDown?.(u,l.sectionRoot):t.onPointerDown?.(u,l.id))}function h(u,l){if(u.synthetic){t.onFrame?.(u.frame);return}if(n(u)){t.onSection?.(u.section);return}t.onSelect?.(u.id,l)}function p(u,l){const m={"data-sve-ht-id":u.id};return u.locked&&(m["data-sve-ht-locked"]=""),u.current&&(m["data-sve-ht-current"]=""),(u.hidden||u.sectionOff)&&(m["data-sve-ht-hidden"]=""),(u.videoNth>=0||u.alpineNth>=0)&&(m["data-sve-ht-special"]=""),m["data-sve-ht-cat"]=u.cat||"other",m["data-sve-ht-depth"]=String(u.depth),l&&(m["data-sve-ht-dim"]=""),n(u)&&(m["data-sve-ht-sec"]=""),s(u)&&(m["data-sve-ht-frame"]=u.frame),!n(u)&&t.dropId===u.id&&t.dropPlace&&(m["data-sve-ht-drop"]=t.dropPlace),m}function g(u){return!!u.fixed}function E(u){return u.kind==="sections"}function T(u){return!!(u.locked||u.lockedIn)}function M(u){return!u.lockedIn&&!g(u)}function x(u){return G(u)||!g(u)&&!E(u)&&!T(u)&&(!u.hidden||u.wrapFrom!=null)}function R(u){if(!N(u))return t.lockedTitle;const l=u.hidden||u.sectionOff;return G(u)?l?t.sectionShowTitle:t.sectionHideTitle:l?t.showTitle:t.hideTitle}let _=null;function ee(u,l){window.clearTimeout(_),_=window.setTimeout(()=>t.onMore?.(u,l.id),vr)}function ne(){window.clearTimeout(_)}function G(u){return!!u.sectionRoot||!!u.section}function N(u){return t.canEdit&&!T(u)||G(u)}function H(){return t.look==="tags"&&!t.layers}return(u,l)=>(f(),k($,null,[O("div",xe({"data-sve-ht-row":""},p(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:l[43]||(l[43]=m=>h(e.row,m.currentTarget)),onDblclick:l[44]||(l[44]=w(m=>e.row.synthetic?i(t).onFrameEnter?.(e.row.frame):s(e.row)||r(e.row)||n(e.row)?null:i(t).onRename?.(e.row.id),["prevent"])),onKeydown:[l[45]||(l[45]=$e(w(m=>h(e.row,m.currentTarget),["prevent"]),["enter"])),l[46]||(l[46]=$e(w(m=>h(e.row,m.currentTarget),["prevent"]),["space"]))],onPointerdown:l[47]||(l[47]=m=>d(m,e.row)),onPointerenter:l[48]||(l[48]=m=>n(e.row)?i(t).onSectionHover?.(e.row.section):null),onContextmenu:l[49]||(l[49]=w(m=>s(e.row)||r(e.row)||n(e.row)?null:i(t).onContext?.(m,e.row.id),["prevent","stop"]))}),[O("span",Ds,[(f(!0),k($,null,te(e.row.guides||[],(m,A)=>(f(),k("i",{key:A,"data-sve-ht-cat":m},null,8,As))),128))]),e.row.hasChildren||e.row.emptyBlock?(f(),k("button",xe({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?i(t).mainShut:e.row.shut)?{"data-sve-ht-shut":""}:{},{innerHTML:ar,onClick:l[0]||(l[0]=w(m=>e.row.synthetic?i(t).onFrameTwist?.():n(e.row)?i(t).onSection?.(e.row.section):i(t).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:l[1]||(l[1]=w(()=>{},["stop"])),onDblclick:l[2]||(l[2]=w(()=>{},["stop"]))}),null,16)):(f(),k("span",Fs)),e.row.letter?(f(),k("span",Bs,L(e.row.letter),1)):(f(),k("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Ns)),O("span",{"data-sve-ht-text":"",title:i(t).renameTitle},[!e.row.kind&&!n(e.row)&&!s(e.row)?(f(),k("button",{key:0,type:"button","data-sve-ht-tag":"","data-sve-ht-classes":H()&&e.row.classes?e.row.classes:null,title:i(t).tagTitle,onClick:l[3]||(l[3]=w(()=>{},["stop","prevent"])),onPointerdown:l[4]||(l[4]=w(()=>{},["stop"])),onDblclick:l[5]||(l[5]=w(m=>i(t).onTagChange?.(m,e.row.id),["stop","prevent"]))},L(e.row.tag),41,js)):(f(),k("span",Ks,L(e.row.tag),1)),i(t).editingId===e.row.id&&!n(e.row)?_t((f(),k("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":l[6]||(l[6]=m=>i(t).draft=m),onMousedown:l[7]||(l[7]=w(()=>{},["stop"])),onPointerdown:l[8]||(l[8]=w(()=>{},["stop"])),onClick:l[9]||(l[9]=w(()=>{},["stop"])),onDblclick:l[10]||(l[10]=w(()=>{},["stop"])),onKeydown:[l[11]||(l[11]=w(()=>{},["stop"])),l[12]||(l[12]=$e(w(m=>i(t).onRenameCommit?.(),["prevent"]),["enter"])),l[13]||(l[13]=$e(w(m=>i(t).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:l[14]||(l[14]=m=>i(t).onRenameCommit?.())},null,544)),[[xn,i(t).draft]]):(f(),k("span",Us,L(H()&&e.row.display?e.row.display:e.row.name),1))],8,Vs),s(e.row)?(f(),k("span",qs,[e.row.alpineNth>=0?(f(),k("button",{key:0,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:i(t).alpineTitle,innerHTML:e.row.alpineSet?vo:uo,onClick:l[15]||(l[15]=w(m=>i(t).onAlpineState?.(m,e.row.id),["stop","prevent"])),onPointerdown:l[16]||(l[16]=w(()=>{},["stop"])),onDblclick:l[17]||(l[17]=w(()=>{},["stop"]))},null,40,Ys)):S("",!0),e.row.frame!=="main"&&i(o)?(f(),k("button",{key:1,type:"button","data-sve-ht-fields":"",title:i(t).frameFieldsTitle,innerHTML:nr,onClick:l[18]||(l[18]=w(m=>i(t).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:l[19]||(l[19]=w(()=>{},["stop"])),onDblclick:l[20]||(l[20]=w(()=>{},["stop"]))},null,40,zs)):S("",!0)])):r(e.row)?S("",!0):(f(),k("span",Xs,[e.row.videoNth>=0?(f(),k("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?i(t).videoPlayTitle:i(t).videoHoldTitle,innerHTML:e.row.videoHeld?dr:lr,onClick:l[21]||(l[21]=w(m=>i(t).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:l[22]||(l[22]=w(()=>{},["stop"])),onDblclick:l[23]||(l[23]=w(()=>{},["stop"]))},null,40,Ws)):S("",!0),e.row.alpineNth>=0?(f(),k("button",{key:1,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:i(t).alpineTitle,innerHTML:e.row.alpineSet?vo:uo,onClick:l[24]||(l[24]=w(m=>i(t).onAlpineState?.(m,e.row.id),["stop","prevent"])),onPointerdown:l[25]||(l[25]=w(()=>{},["stop"])),onDblclick:l[26]||(l[26]=w(()=>{},["stop"]))},null,40,Gs)):S("",!0),e.row.locked?(f(),k("button",{key:2,type:"button","data-sve-ht-lock":"","data-on":"",disabled:!i(t).canEdit||!i(t).canUnlock,title:i(t).canUnlock?i(t).unlockTitle:i(t).lockedByTitle,"aria-pressed":"true",innerHTML:cr,onClick:l[27]||(l[27]=w(m=>i(t).onLock?.(e.row.id),["stop","prevent"])),onPointerdown:l[28]||(l[28]=w(()=>{},["stop"])),onDblclick:l[29]||(l[29]=w(()=>{},["stop"]))},null,40,Zs)):S("",!0),x(e.row)?(f(),k("button",{key:3,type:"button","data-sve-ht-eye":"",disabled:!N(e.row),title:R(e.row),innerHTML:e.row.hidden||e.row.sectionOff?rr:sr,onClick:l[30]||(l[30]=w(m=>i(t).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:l[31]||(l[31]=w(()=>{},["stop"])),onDblclick:l[32]||(l[32]=w(()=>{},["stop"]))},null,40,Qs)):S("",!0),!g(e.row)&&!E(e.row)?(f(),k("button",{key:4,type:"button","data-sve-ht-dup":"",disabled:!N(e.row),title:N(e.row)?i(t).duplicateTitle:i(t).lockedTitle,innerHTML:ir,onClick:l[33]||(l[33]=w(m=>i(t).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:l[34]||(l[34]=w(()=>{},["stop"])),onDblclick:l[35]||(l[35]=w(()=>{},["stop"]))},null,40,Js)):S("",!0),g(e.row)?S("",!0):(f(),k("button",{key:5,type:"button","data-sve-ht-del":"",disabled:!N(e.row),title:N(e.row)?i(t).deleteTitle:i(t).lockedTitle,innerHTML:ur,onClick:l[36]||(l[36]=w(m=>i(t).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:l[37]||(l[37]=w(()=>{},["stop"])),onDblclick:l[38]||(l[38]=w(()=>{},["stop"]))},null,40,er)),M(e.row)?(f(),k("button",{key:6,type:"button","data-sve-ht-more":"","aria-label":i(t).moreTitle,"aria-haspopup":"menu",innerHTML:hr,onPointerenter:l[39]||(l[39]=m=>ee(m.currentTarget,e.row)),onPointerleave:ne,onClick:l[40]||(l[40]=w(m=>{ne(),i(t).onMore?.(m.currentTarget,e.row.id)},["stop","prevent"])),onPointerdown:l[41]||(l[41]=w(()=>{},["stop"])),onDblclick:l[42]||(l[42]=w(()=>{},["stop"]))},null,40,tr)):S("",!0)]))],16,$s),e.row.emptyBlock&&!e.row.shut?(f(),k("div",xe({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},i(t).dropId===e.row.id&&i(t).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),L(i(t).slotText),17,or)):S("",!0)],64))}},Z=Kt(fr,[["__scopeId","data-v-4f2157c5"]]),mr=["data-sve-ht-look","data-sve-ht-layers"],pr={key:0,class:"sve-ht-page-template"},gr={key:0,class:"sve-ht-page-template__text"},kr={class:"sve-ht-page-template__note"},yr={key:1,class:"sve-ht-empty"},br={key:2,class:"sve-ht-empty"},Tr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},xr={key:0,class:"sve-ht-empty"},wr={key:0,class:"sve-ht-empty"},_r=["data-sve-ht-under-main"],Sr={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},Cr={key:0,class:"sve-ht-empty"},Pr=["data-sve-ht-under-main"],Er=["data-dim"],Hr={key:0,class:"sve-ht-empty"},Mr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},Lr={key:0,class:"sve-ht-empty"},Ir={key:4,"data-sve-ht-branch":"","data-sve-ht-cat":"component"},Or={__name:"HtmlTreeList",setup(e){const o=ie(()=>Vo(t.query)),a=ie(()=>Rs(t.rows,o.value)),n=ie(()=>a.value.rows),s=ie(()=>o.value?t.sections.filter(x=>Ct(x.row,o.value)||x.current&&x.ready&&n.value.length>0):t.sections);function r(x){return!!x&&(!o.value||Ct(x,o.value))}function d(x){const R=t.frame?.kind;return t.inComponent||(R==="header"||R==="footer")&&R!==x}const h=ie(()=>t.frame?.kind==="header"||t.frame?.kind==="footer"),p=ie(()=>!!t.frame&&["header","main","footer"].some(x=>r(t.frame[x]))),g=ie(()=>!!t.frame&&(t.frame.kind==="main"||r(t.frame.main))),E=ie(()=>!!o.value&&!s.value.length&&!n.value.length&&!p.value);function T(x){return!!o.value&&!a.value.hits.has(x.path)}function M(x){const R={"data-sve-ht-sec-uid":x.uid};return x.current&&(R["data-sve-ht-branch"]="",R["data-sve-ht-cat"]=x.row?.cat||"layout"),t.sectionDrop&&t.sectionDrop.uid===x.uid&&(R["data-sve-ht-drop"]=t.sectionDrop.place),R}return(x,R)=>(f(),k("div",xe({class:"sve-ht-root","data-sve-ht-look":i(t).layers?"tags":i(t).look,"data-sve-ht-layers":i(t).layers?"":null,style:i(t).familyStyle},i(t).dragging?{"data-sve-ht-dragging":""}:{}),[i(t).pageTemplate?(f(),k("div",pr,[i(t).pageTemplate.text?(f(),k("p",gr,L(i(t).pageTemplate.text),1)):S("",!0),O("p",kr,L(i(t).pageTemplate.note),1),i(t).pageTemplate.canOpen?(f(),k("button",{key:1,type:"button",class:"sve-ht-page-template__open",onClick:R[0]||(R[0]=_=>i(t).pageTemplate.onOpen(_.currentTarget))},L(i(t).pageTemplate.openLabel),1)):S("",!0)])):!i(t).rows.length&&!i(t).sections.length&&!i(t).frame?(f(),k("div",yr,L(i(t).emptyText),1)):E.value?(f(),k("div",br,L(i(t).searchEmpty),1)):S("",!0),i(t).frame||i(t).sections.length?(f(),k($,{key:3},[i(t).frame?(f(),k($,{key:0},[i(t).frame.kind==="header"?(f(),k("div",Tr,[(f(!0),k($,null,te(n.value,_=>(f(),K(Z,{key:_.id,row:_,dim:T(_)},null,8,["row","dim"]))),128)),i(t).rows.length?S("",!0):(f(),k("div",xr,L(i(t).emptyText),1))])):!h.value&&r(i(t).frame.header)?(f(),K(Z,{key:1,row:i(t).frame.header,dim:d("header")},null,8,["row","dim"])):S("",!0)],64)):S("",!0),h.value?S("",!0):(f(),k("div",wn(xe({key:1},i(t).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[i(t).frame?.kind==="main"?(f(),k($,{key:0},[(f(!0),k($,null,te(n.value,_=>(f(),K(Z,{key:_.id,row:_,dim:T(_)},null,8,["row","dim"]))),128)),i(t).rows.length?S("",!0):(f(),k("div",wr,L(i(t).emptyText),1))],64)):i(t).frame&&r(i(t).frame.main)?(f(),K(Z,{key:1,row:i(t).frame.main,dim:d("main")},null,8,["row","dim"])):S("",!0),i(t).frame?.kind==="template"?_t((f(),k("div",{key:2,"data-sve-ht-frame-body":"","data-sve-ht-under-main":g.value?"":null},[O("div",Sr,[(f(!0),k($,null,te(n.value,_=>(f(),K(Z,{key:_.id,row:_,dim:T(_)},null,8,["row","dim"]))),128)),i(t).rows.length?S("",!0):(f(),k("div",Cr,L(i(t).emptyText),1))])],8,_r)),[[so,!i(t).mainShut]]):S("",!0),i(t).sections.length||i(t).frame?_t((f(),k("div",{key:3,"data-sve-ht-frame-body":"","data-sve-ht-under-main":g.value?"":null},[i(t).frame?.template&&r(i(t).frame.template)?(f(),K(Z,{key:0,row:i(t).frame.template,dim:d("template")},null,8,["row","dim"])):S("",!0),i(t).frame&&!i(t).frame.template&&!i(t).sections.length&&!o.value?(f(),k("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":d("")?"":void 0},L(i(t).frameEmptyText),9,Er)):S("",!0),(f(!0),k($,null,te(s.value,_=>(f(),k("div",xe({key:_.uid},{ref_for:!0},M(_)),[_.ready?(f(),k($,{key:0},[(f(!0),k($,null,te(n.value,ee=>(f(),K(Z,{key:ee.id,row:ee,dim:T(ee)},null,8,["row","dim"]))),128)),i(t).rows.length?S("",!0):(f(),k("div",Hr,L(i(t).emptyText),1))],64)):(f(),K(Z,{key:1,row:_.row,dim:d("")},null,8,["row","dim"]))],16))),128))],8,Pr)),[[so,!i(t).frame||!i(t).mainShut]]):S("",!0)],16)),i(t).frame?(f(),k($,{key:2},[i(t).frame.kind==="footer"?(f(),k("div",Mr,[(f(!0),k($,null,te(n.value,_=>(f(),K(Z,{key:_.id,row:_,dim:T(_)},null,8,["row","dim"]))),128)),i(t).rows.length?S("",!0):(f(),k("div",Lr,L(i(t).emptyText),1))])):!h.value&&r(i(t).frame.footer)?(f(),K(Z,{key:1,row:i(t).frame.footer,dim:d("footer")},null,8,["row","dim"])):S("",!0)],64)):S("",!0)],64)):i(t).inComponent&&i(t).rows.length?(f(),k("div",Ir,[(f(!0),k($,null,te(n.value,_=>(f(),K(Z,{key:_.id,row:_,dim:T(_)},null,8,["row","dim"]))),128))])):i(t).rows.length?(f(!0),k($,{key:5},te(n.value,_=>(f(),K(Z,{key:_.id,row:_,dim:T(_)},null,8,["row","dim"]))),128)):S("",!0)],16,mr))}},pt=Kt(Or,[["__scopeId","data-v-d0376715"]]);let gt=null;function Rr(e){return gt||(gt=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(o=>o.ok?o.json():{pages:[]}).then(o=>Array.isArray(o.pages)?o.pages:[]).catch(()=>[])),gt}let Ge=null;function kt(){Ge?.dismiss(),Ge=null}function $r(e,o,a){kt();const n=o?.getBoundingClientRect?.(),s={x:n?n.left:0,y:n?n.bottom+4:0};Rr(e).then(r=>{const d=r.length?r.map(h=>({label:h.title||h.url,onPick:()=>{kt(),a(h.url)}})):[{label:v(e,"component_props_pages_none"),onPick:null}];kt(),Ge=Pe(e.document,Ee,{items:d,x:s.x,y:s.y,onClose:()=>{Ge=null}})})}function jo(e){for(const o of e||[]){if(o.kind==="component"||o.kind==="svg"&&o.dynamic)continue;const a=o.kind==="antlers"?jo(o.children):o;if(a)return a}return null}const U=Ta("sve-call-values"),Dr="__sve-html-tree-style";function Ar(e,o,a){if(o||a)return!1;const n=String(b("dock:chrome-kind")||"");if(n==="header"||n==="footer")return!1;const s=To(e);return!!s&&s!=="create"&&En(e)!==Hn(e)}function Ko(e){return{sectionLoops:Pn(e),sectionsLabel:v(e,"html_tree_sections_slot")}}function Fr(e,o){const a={entry:o,text:"",note:v(e,"html_tree_page_template_note"),openLabel:v(e,"html_tree_open_template"),canOpen:!1,onOpen:null};return Oo(e,{entry:o}).then(n=>{!n||t.pageTemplate?.entry!==o||(t.pageTemplate={...t.pageTemplate,text:v(e,"html_tree_page_template",{name:n.name}),canOpen:!!n.open,onOpen:n.open?s=>ea(e,s,n.open):null})}),a}function Br(e,o){const a=o.replace(/^view:/,"");if(!a||b("dock:current-type")!==o){t.usedBy=null,t.templateSections=[];return}t.usedBy?.view!==a&&(t.usedBy=null,Oo(e,{view:a}).then(n=>{if(!n||b("dock:current-type")!==o)return;const s=n.everything?[{name:v(e,"html_tree_used_by_everything"),kind:"everything",url:null}]:n.used_by.map(r=>({...r,...Nr(e,r)}));t.templateSections=Array.isArray(n.sections_fields)?n.sections_fields:[],t.usedBy={view:a,label:v(e,"html_tree_used_by"),items:s,empty:s.length?"":v(e,"html_tree_used_by_nobody"),hint:s.length?v(e,"html_tree_used_by_hint",{list:s.map(r=>r.name).join(", ")}):""}}))}function Nr(e,o){if(!o.url)return{openLabel:"",onOpen:null};const a=v(e,"html_tree_used_by_open",{name:o.name});return o.kind==="page"?{openLabel:a,onOpen:n=>sa(e,n,ra(e,o.url))}:{openLabel:a,onOpen:n=>ia(e,{anchor:n,url:o.url,subtitle:o.name})}}const q=new Set;let Pt="",Te=!1,yt=null,ce=!0,Y="",ge=0,Uo="";const ke=new Map,Ae=new Set,Et=new Map,Ze=new Map;let j="",qo=!1,I=null,Qe=null,ze="",Je="",et=0,Ht=null,_e=[],pe=null,Fe=null,tt=null,ot=null,Mt=null,he=!1,J=null,Ve=null,Be=null,nt=null,at=null,Lt=null,me=null;function z(e){return e.getElementById(We)}function Vr(e){_n(e,Dr,`
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
    [data-sve-ht-row][data-sve-ht-locked] [data-sve-ht-actions],
    [data-sve-ht-row][data-sve-ht-special] [data-sve-ht-actions],
    [data-sve-ht-row][data-sve-ht-more-open] [data-sve-ht-actions] {
      display: inline-flex;
    }
    /* A video or an Alpine state shows on its own; the rest waits for the pointer. */
    [data-sve-ht-row][data-sve-ht-special]:not(:hover, [data-sve-ht-current], [data-sve-ht-hidden], [data-sve-ht-locked], [data-sve-ht-more-open]) [data-sve-ht-actions] > :not([data-sve-ht-video], [data-sve-ht-alpine]) {
      display: none;
    }
    [data-sve-ht-more],
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
    [data-sve-ht-more]:hover,
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
      ${lo("light")}
      /* How much of a row's own colour its pick takes: a wash, not a fill.
         The row mixes it in below — a mix written up here would read
         --sve-ht-c on the list, where no family is set. */
      --sve-ht-pick-mix: 11%;
      --sve-ht-pick-hover-mix: 18%;
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${lo("dark")}
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
    [data-sve-ht-look="tags"] [data-sve-ht-more]:hover,
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
    [data-sve-ht-look="tags"][data-sve-ht-layers] [data-sve-ht-more] svg,
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
  `)}function X(){const e=b("dock:html");return typeof e=="string"?e:""}function Yo(e){return!!b("dock:is-open",e)}function He(e,{save:o=!1,unlock:a=!1}={}){return Yt()||b("dock:set-html",a?{html:e,unlock:!0}:e)!==!0?!1:(o&&b("dock:save-now"),!0)}function bt(e){const o=b("dock:component-exit-state")||{};if(t.exitOpen=!!o.open,!o.open){t.onExit=null;return}t.exitName=o.name||"",t.exitLabel=v(e,"component_exit"),t.exitTitle=v(e,o.back?"component_exit_back":"component_exit_close"),t.onExit=()=>{b("dock:exit-component"),P(e)}}const je=[];let Tt=!1;function xt(e,o){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(o,{timeout:2e3});return}e.setTimeout(o,200)}function jr(e,o){for(const a of o){const n=a.type;!n||ke.has(n)||Ae.has(n)||je.includes(n)||je.push(n)}Nt.htmlTreePrefetchArmed&&zo(e)}function qi(e){Nt.htmlTreePrefetchArmed=!0,zo(e)}function zo(e){if(Tt||!je.length)return;Tt=!0;const o=()=>{const a=je.shift();if(!a){Tt=!1;return}if(ke.has(a)||Ae.has(a)){xt(e,o);return}Ae.add(a),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(a)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{if(typeof n?.html=="string"){ke.set(a,n.html);const s=Ze.get(a);Ze.delete(a),s&&s!==Xo(e,a)&&P(e)}}).catch(()=>{}).finally(()=>{Ae.delete(a),xt(e,o)})};xt(e,o)}function Yt(){return!!j}function Xo(e,o){return Wo(o)||Mn(e,o)||"section"}function Wo(e){const o=ke.get(e);if(!o)return"";const a=Et.get(e);if(a&&a.html===o)return a.tag;const n=zt(lt(o))?.tag||"";return Et.set(e,{html:o,tag:n}),n}function qe(e,o){const a=it(e)||"page_sections",n=[];for(const s of Ft(o)||[]){if(s.name===Jn||s.name===ma)continue;const r=Bt(s.values),d=r&&typeof r=="object"?r[a]:null;if(Array.isArray(d)){d.forEach(h=>{if(!h||typeof h!="object"||Array.isArray(h)||typeof h.type!="string")return;const p=[h._visual_id,h.id,h._id].filter(x=>typeof x=="string"&&x!=="");if(!p.length)return;const g=Io(e,h),E=typeof h._sve_label=="string"?h._sve_label.trim():"",T=Xo(e,g);Wo(g)||Ze.set(g,T);const M=Bo(g)[`0:${T}`];n.push({uid:p[0],ids:p,type:g,tag:T,label:E||(typeof M=="string"&&M.trim()?M.trim():"")||dt(e,g)?.display||Ne(g)||g,svg:Fo(T,fo(T),null).svg||we.section,cat:Mo(T,fo(T)),enabled:h.enabled!==!1,static:Fn(e,g)})});break}}return n}function Kr(e,o,a){if(!a.length)return"";const n=b("dock:current-type")||"",s=b("dock:current-uid"),r=!!b("dock:component-exit-state")?.open;if(s){const d=Ue(s,o),h=a.find(p=>p.ids.some(g=>d.includes(g)));if(h&&(r||h.type===n))return h.uid}return a.find(d=>d.type===n)?.uid||""}function Ur(e,o,a){const n=b("dock:component-exit-state");if(n?.open)return Ne(n.name)||n.name||"";if(a)return o.find(r=>r.uid===a)?.label||"";const s=b("dock:current-type")||"";return String(s).startsWith("view:")?"":dt(e,s)?.display||Ne(s)||""}function ct(e,o,a,n,s){const r=a.find(d=>d.uid===n);r&&n!==s&&(q.clear(),I=null,ce=!1,D(),Ye(),Y=n,Uo=X(),j=ke.get(r.type)||"",j&&(I=Ot(lt(j))||null),qo=(b("dock:current-type")||"")===r.type,e.clearTimeout(ge),ge=e.setTimeout(()=>{Y="",Te=!1,P(e)},4e3),P(e),aa(e,r.uid,"tree"),ue({source:W,type:B.SVE_ACTIVATE,ids:r.ids},e),e.setTimeout(()=>P(e),0))}function It(e,o){if(!o)return!1;for(const a of e||[])if(a.id===o||It(a.children,o))return!0;return!1}function Ot(e){return zt(e)?.id||""}function zt(e){for(const o of e||[]){if(Go(o))return o;const a=zt(o.children);if(a)return a}return null}function Go(e){return!e.kind||e.kind==="component"}function fo(e){return e==="component"?"component":""}function qr(e,o){const a=o===0||e.path===Je;return q.has(e.path)?a:!a}function Yr(e){const o=new Set,a=(n,s)=>{for(const r of n)r.children.length&&qr(r,s)&&o.add(r.id),a(r.children,s+1)};return a(e,0),o}function P(e){const o=e.document,n=z(o)?.querySelector("[data-sve-html-tree-list]");if(!n)return;Vr(o),ya(e);const s=X();j&&j===s&&(j=""),b("dock:chrome-kind")&&(j="");const r=j||s,d=lt(r,Ko(e));_e=d,Je="";const h=b("dock:current-type")||"",p=Bo(h),g=Cn(e,o),T=!!(b("dock:component-exit-state")||{}).open;h&&s&&!j&&ke.set(h,s);const M=qe(e,o);jr(e,M);const x=Kr(e,o,M);if(Ar(e,g,T)){const c=To(e);_e=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!1,t.layoutFile=!1,t.usedBy=null,t.emptyText="",t.pageTemplate?.entry!==c&&(t.pageTemplate=Fr(e,c)),t.onRefresh=()=>P(e),t.onSection=null,bt(e),De(n,pt),wt(e,[]);return}t.pageTemplate=null,Br(e,String(b("dock:collection-view")||""));const R=String(b("dock:chrome-kind")||"");if(Xn(e),g&&!M.length&&!R){_e=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,t.layoutFile=!1,t.emptyText=v(e,"html_tree_page_empty"),t.canEdit=!b("dock:is-locked"),t.look=co(e),t.onRefresh=()=>P(e),t.onSection=null,bt(e),De(n,pt),wt(e,[]);return}t.pageBuilder=g;const _=`${h}|${x}`;let ee=!1;_!==Pt&&(Pt=_,q.clear(),yt!==null&&r!==yt?ee=!0:Te=r),(ee||Te!==!1&&r!==Te)&&(Te=!1,q.clear(),I=Ot(d)||null),yt=r,Y&&(Y===x||!M.length)&&(qo||r!==Uo)&&(e.clearTimeout(ge),Y="",Te=!1,It(d,I)||(q.clear(),I=Ot(d)||null));const ne=M.some(c=>c.uid===Y)?Y:"",G=ce?"":ne||x,N=!!(ne||x),H=N||T?"":String(b("dock:chrome-kind")||""),l=g&&(!h&&!N||H==="main"&&b("dock:on-empty-page")===!0),m=l||H==="template"?"":H;t.layoutFile=m==="main",m!=="main"&&(ze="");const A=m==="main"?mo(d,"main"):null,F=A?st(d,c=>c.tag==="body"&&It(c.children,A.id)):null;Je=F?F.path:"",A&&(Xe((F||A).path),ze!==_&&(Xe(A.path),q.add(A.path)));const Me=m==="header"||m==="footer"?st(d,c=>r.slice(c.from,c.openTo).includes(`data-sve-chrome="${m}"`)):null,ae=Me||(m==="header"||m==="footer"?mo(d,m):null);ae&&Xe(ae.path);const V=l||!(m==="main"?!!A:m==="header"||m==="footer"?!!ae:!0)?[]:Wn(d,t.query?new Set:Yr(d));!r.trim()&&!Yo(o)?t.emptyText=v(e,"html_tree_need_dock"):t.emptyText=v(e,"html_tree_empty"),t.slotText=v(e,"antlers_drop_here"),t.dataTitle=v(e,"data_vars_title"),t.pageTitle=v(e,"component_props_page"),t.renameTitle=v(e,"html_tree_rename"),t.tagTitle=v(e,"tw_tag"),t.hideTitle=v(e,"html_tree_hide"),t.showTitle=v(e,"html_tree_show"),t.sectionHideTitle=v(e,"html_tree_section_hide"),t.sectionShowTitle=v(e,"html_tree_section_show"),t.moreTitle=v(e,"html_tree_more"),t.duplicateTitle=v(e,"html_tree_duplicate"),t.deleteTitle=v(e,"html_tree_delete"),t.videoHoldTitle=v(e,"html_tree_video_hold"),t.videoPlayTitle=v(e,"html_tree_video_play"),t.alpineTitle=v(e,"html_tree_alpine_state"),t.lockedTitle=v(e,"html_tree_locked"),t.searchEmpty=v(e,"html_tree_search_empty"),t.canEdit=!b("dock:is-locked"),t.look=co(e),t.onQuery=()=>P(e),bt(e),t.inComponent=T,t.onSelect=(c,y)=>{const C=V.find(Le=>Le.id===c);if(C&&Ao(e,C.path))return;y&&!$a()&&(t.rowClicks+=1);const be=!!y&&C?.kind==="antlers"&&!he&&Gn(e);Ce(e,c,V),be&&Ka(e,{path:C.path,at:y,beside:z(e.document)})},t.onTwist=c=>{const y=V.find(C=>C.id===c)?.path;y&&(q.has(y)?q.delete(y):q.add(y),P(e))},t.onTagChange=(c,y)=>{const C=t.rows.find(be=>be.id===y);C&&!Yt()&&!Xt(e,C)&&ba(e,c.currentTarget,C)},t.onRename=c=>Jr(e,c),t.onRenameCommit=()=>po(e,!0),t.onRenameCancel=()=>po(e,!1),t.onHide=c=>ai(e,c),t.onLock=c=>Jo(e,c),t.onMore=(c,y)=>di(e,c,y),t.canUnlock=Qo(e),t.lockTitle=v(e,"html_tree_lock"),t.unlockTitle=v(e,"html_tree_unlock"),t.lockedByTitle=v(e,"html_tree_locked_by_developer"),t.onVideoHold=c=>ti(e,c),t.onAlpineState=(c,y)=>ni(e,c,y),t.onDuplicate=c=>si(e,c),t.onDelete=c=>ii(e,c),t.onPointerDown=(c,y)=>ui(e,c,y),t.onSectionPointerDown=(c,y)=>mi(e,c,y),t.onSectionHover=c=>e.dispatchEvent(new e.CustomEvent("sve-lite-hover",{detail:{uid:c}})),t.onContext=(c,y)=>an(e,c,y),t.onInspectCommit=c=>xi(e,c),t.onPropValue=(c,y,C)=>bo(e,c,y,C),t.onPropPage=(c,y)=>$r(e,c,C=>bo(e,y,C,!1)),t.onLoopKind=c=>wi(e,c),t.onAddBranch=c=>_i(e,c),t.onLoopSortField=c=>{const y=rt();if(!y)return;const C=me?.id===y.id?me.dir:"";me=null,oe(e,Xa(y,c,C))},t.onLoopSortDir=c=>{const y=rt();if(!y)return;const C=Wa(y,c);if(C.draft){me={id:y.id,dir:C.draft},Dt(e,y);return}me=null,oe(e,C.edit)},t.onLoopDepth=c=>oe(e,Qa(c)),t.onLoopIncludeHome=c=>oe(e,Ja(c)),t.onLoopLimit=c=>oe(e,es(c)),t.onLoopOffset=c=>oe(e,ts(c)),t.onPropHost=c=>c?U.mount(c):U.unmount(),t.onInspectData=(c,y)=>{b("dock:data-menu",{anchor:c,at:V.find(C=>C.id===I)?.from,onPick:C=>y(String(C?.var||"").trim())})};const Jt=V.find(Go)?.id,eo=T?"":Ur(e,M,G),ve=G&&!T?M.find(c=>c.uid===G):null,hn=Eo(e,String(b("dock:current-type")||""));let un=0;const vn=oi(Me?[Me]:d,r),fn=Ho(e,String(h)),se=m==="header"||m==="footer"?m:"",ye=ae?ae.id:"",fe=A&&V.find(c=>c.id===A.id)||null,to=F&&V.find(c=>c.id===F.id)||null,re=to||fe||ye&&V.find(c=>c.id===ye)||null,oo=re?Gr(V,re):-1;if(re&&!V.slice(V.indexOf(re),oo).some(c=>c.id===I)&&(I=re.id),t.selectFrom){const c=V.find(y=>y.from===t.selectFrom.at&&(!y.kind||y.kind==="sections"));c?(I=c.id,t.selectFrom=null):--t.selectFrom.left<=0&&(t.selectFrom=null)}const no=t.layoutFile?Wr(e):null;t.rows=V.map(c=>{const y=no&&c.kind==="component"&&no.get(c.src)||"",C=c.tag==="body"&&!c.kind,be=y?{svg:we[y]}:Fo(c.tag,c.kind,c.antlers),Le=c.tag==="video"&&!c.kind?un++:-1,Ie=vn.get(c.id),pn=Ie?fn[Ie.nth]||{}:{},vt=Ie?Ie.booleans.map(({key:Re,value:ao})=>({key:Re,file:ao,value:pn[Re]??ao})):[],ft=c.id===Jt&&eo?eo:c.klass,Oe=c.id===Jt;return{...c,tag:y||c.tag,frameCall:y,fixed:!!y||C,base:ft,name:y?v(e,`html_tree_frame_${y}`):se&&c.id===ye?v(e,`html_tree_frame_${se}`):c===fe?v(e,"html_tree_frame_main"):Oe&&ve?ft:Ua(ft,c.path,p),current:c.id===I,letter:be.letter||"",svg:se&&c.id===ye?we[se]:c===fe?we.main:Oe&&ve?ve.svg:be.svg||"",frame:se&&c.id===ye?se:c===fe?"main":"",cat:se&&c.id===ye?se:c===fe||C?"main":y||Mo(c.tag,c.kind,c.antlers),componentRoot:Oe&&T,sectionRoot:Oe&&ve?ve.uid:"",sectionOff:!!(Oe&&ve&&!ve.enabled),videoNth:Le,videoHeld:Le>=0&&hn.has(Le),alpineNth:vt.length?Ie.nth:-1,alpineKeys:vt,alpineSet:vt.some(Re=>Re.value!==Re.file)}});const mn=qa(r,d);for(const c of t.rows){const y=c.kind?null:mn.get(c.path);y&&(c.classes=y.classes,y.kind!=="tag"&&!c.frame&&!c.fixed&&!c.sectionRoot&&c.name===c.klass&&(c.display=y.kind==="column"?v(e,"el_column",{n:y.index}):v(e,`el_${y.kind}`)))}Zn(e),Qn(e);const ut=[];for(const c of t.rows)ut.length=c.depth,c.guides=ut.slice(),ut[c.depth]=c.cat;if(re){const c=V.indexOf(re),y=re.depth;t.rows=t.rows.slice(c,oo).map(C=>({...C,depth:C.depth-y,guides:C.guides.slice(y)})),fe&&ze!==_&&(ze=_,e.setTimeout(()=>Ce(e,fe.id,V),0))}t.sections=g&&!T&&(N||m||l)?M.map(c=>{const y=!!G&&c.uid===G;return{...c,current:y,ready:y&&(!ne||!!j),row:{id:`sec:${c.uid}`,section:c.uid,tag:c.tag,name:c.label,kind:"",svg:c.svg,cat:c.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:y,hidden:!c.enabled}}}):[],t.frame=Xr(e,M,N,T,m,!1,!!to),t.frameEmptyText=v(e,"html_tree_frame_no_sections"),zr(e,m),t.onSection=c=>{he||(Rt(e),ct(e,o,M,c,G))},t.onRefresh=()=>P(e),Dt(e,t.rows.find(c=>c.id===I)),De(n,pt),wt(e,d)}function zr(e,o){t.frameOpenTitle=v(e,"html_tree_frame_open"),t.frameMainTitle=v(e,"html_tree_frame_main_open"),t.frameTemplateTitle=v(e,"html_tree_frame_template_open"),t.frameFieldsTitle=v(e,"html_tree_frame_fields"),t.onFrame=a=>{o===a?Zr(e,a):$t(e,a)},t.onFrameEnter=a=>$t(e,a),t.onFrameFields=a=>Nn(e,oa(e,a),v(e,`html_tree_frame_${a}`)),t.onFrameTwist=()=>{t.mainShut=!t.mainShut}}function Xr(e,o,a,n,s,r=!1,d=!1){if(!s&&!r||d)return null;const h=E=>({id:`frame:${E}`,frame:E,synthetic:!0,tag:E,name:v(e,`html_tree_frame_${E}`),kind:"",svg:we[E]||"",cat:E,letter:"",depth:0,hasChildren:E==="main"&&(o.length>0||s==="template"),shut:E!=="main",current:!1,hidden:!1}),p={kind:s,header:h("header"),main:h("main"),footer:h("footer"),template:null},g=s&&s!=="template"?String(b("dock:collection-view")||""):"";return g&&(p.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:dt(e,g)?.display||Ne(g.replace(/^view:/,"")),kind:"",svg:we.section||"",cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),p}function mo(e,o){return st(e,a=>a.tag===o)}function st(e,o){for(const a of e||[]){if(!a.kind&&o(a))return a;const n=st(a.children,o);if(n)return n}return null}function Wr(e){const o=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},a=new Map;for(const n of["header","footer"]){const s=wa(o[n]?.type);s&&a.set(s,n)}return a}function Gr(e,o){let a=e.indexOf(o)+1;for(;a<e.length&&e[a].depth>o.depth;)a+=1;return a}function Zr(e,o){const a=Do(e);(o==="main"||o==="template"?a?.querySelector("main"):a?.querySelector(`[data-sve-chrome="${o}"]`))?.scrollIntoView({behavior:"smooth",block:"start"})}function Rt(e){const o=String(b("dock:chrome-open",e.document)||"");return o!=="header"&&o!=="footer"?!1:(na(e),ue({source:W,type:B.SVE_FORCE_EXIT_CHROME},e),!0)}function Qr(e){e.clearTimeout(ge),Y="",j="",q.clear(),I=null,ce=!1,D(),Ye()}function $t(e,o){if(e.document,String(b("dock:chrome-kind")||"")===o)return;if(Qr(e),o==="main"){Rt(e),b("dock:open-file",pa);return}if(o==="template"){const r=String(b("dock:collection-view")||"");r&&(Rt(e),b("dock:open-file",r));return}if(o!=="header"&&o!=="footer")return;const a=Do(e)?.querySelector(`[data-sve-chrome="${o}"]`);a?(a.scrollIntoView({block:"nearest"}),a.dispatchEvent(new a.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:W,type:B.OPEN_CHROME,kind:o},e.location.origin);const n=Date.now(),s=async()=>{if(String(b("dock:chrome-kind")||"")!==o){Date.now()-n<3e4&&e.setTimeout(s,250);return}await(b("dock:load-settled")||null),cn(e)};e.setTimeout(s,250)}function wt(e,o){z(e.document)&&Zo(e,o)}function Zo(e,o){const a=jo(o),n=!!b("dock:component-src"),s=n?"":b("dock:current-uid")||"";ue({source:W,type:B.SVE_HTML_PICK,on:!0,uid:s,uids:s?Ue(s,e.document):[],all:n,tag:a?.tag||"",klass:a?.klass||"",nodes:za(o)},e)}function Xe(e){if(!e)return;const o=(a,n)=>{for(const s of a||[]){if(s.path===e)return!0;if(o(s.children,n+1))return n===0||s.path===Je?q.delete(s.path):q.add(s.path),!0}return!1};o(_e,0)}function Jr(e,o){if(he)return;const a=t.rows.find(n=>n.id===o);Xt(e,a)||!a||a.kind||(I=o,t.rows.forEach(n=>{n.current=n.id===o}),t.editingId=o,t.draft=a.name,e.setTimeout(()=>{const n=z(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function po(e,o){const a=t.editingId;if(!a)return;const n=t.rows.find(s=>s.id===a);t.editingId=null,o&&n&&(n.sectionRoot?ei(e,n.sectionRoot,t.draft):Ya(b("dock:current-type")||"",n.path,t.draft,n.base||n.klass)),t.draft="",P(e)}function ei(e,o,a){const n=it(e)||"page_sections",s=String(a||"").replace(/\s+/g," ").trim();for(const r of Ft(e.document)||[]){const d=Bt(r.values),h=d&&typeof d=="object"?d[n]:null;if(!Array.isArray(h))continue;const p=h.findIndex(M=>M&&typeof M=="object"&&[M._visual_id,M.id,M._id].includes(o));if(p===-1)continue;const g=Io(e,h[p]),E=dt(e,g)?.display||Ne(g)||g,T=JSON.parse(JSON.stringify(h));return T[p]={...T[p]},!s||s===E?delete T[p]._sve_label:T[p]._sve_label=s,r.setFieldValue(n,T),!0}return!1}function ti(e,o){const a=t.rows.find(h=>h.id===o);if(!a||!(a.videoNth>=0))return;const n=String(b("dock:current-type")||""),s=Eo(e,n),r=!s.has(a.videoNth);r?s.add(a.videoNth):s.delete(a.videoNth);const d=String(b("dock:current-uid")||"");ta(e,n,s),ue({source:W,type:B.SVE_VIDEO_HOLD,uid:d,uids:d?Ue(d,e.document):[],nth:a.videoNth,on:r},e),P(e)}function oi(e,o){const a=new Map;let n=0;const s=r=>{for(const d of r){if(d.hidden)continue;const h=d.kind?null:as(o.slice(d.from,d.openTo));h!==null&&a.set(d.id,{nth:n++,booleans:rs(h)}),s(d.children||[])}};return s(e),a}function ni(e,o,a){const n=t.rows.find(r=>r.id===a);if(!n||!(n.alpineNth>=0))return;if(n.alpineKeys.length===1){go(e,n,n.alpineKeys[0]);return}const s=o.currentTarget.getBoundingClientRect();D(),J=Pe(e.document,Ee,{items:n.alpineKeys.map(r=>({label:r.key,icon:r.value?tn:on,onPick:()=>{D(),go(e,n,r)}})),x:Math.round(s.left),y:Math.round(s.bottom+4),onClose:()=>{J=null}})}function go(e,o,a){const n=String(b("dock:current-type")||""),s=Ho(e,n),r=!a.value,d=r!==a.file,h={...s[o.alpineNth]||{}};d?h[a.key]=r:delete h[a.key],Object.keys(h).length?s[o.alpineNth]=h:delete s[o.alpineNth];const p=ca(String(b("dock:chrome-kind")||"")),g=p?"":String(b("dock:current-uid")||"");ha(e,n,s),ue({source:W,type:B.SVE_ALPINE_STATE,uid:g,uids:g?Ue(g,e.document):[],chrome:p,nth:o.alpineNth,key:a.key,value:r,on:d},e),P(e)}function Xt(e,o){return!o||!(o.locked||o.lockedIn)?!1:(e.Statamic?.$toast?.error(v(e,"html_tree_locked_element")),!0)}function Qo(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function Jo(e,o){const a=t.rows.find(n=>n.id===o);if(!(!a||a.lockedIn||b("dock:is-locked"))){if(!a.locked){Se(e,o,Da,{lockAction:!0});return}if(!Qo(e)){e.Statamic?.$toast?.error(v(e,"html_tree_unlock_denied"));return}Vt(e,{titleKey:"html_tree_unlock_title",bodyKey:"html_tree_unlock_body",confirmKey:"html_tree_unlock_confirm"},()=>Se(e,o,Aa,{lockAction:!0,unlock:!0}))}}function Wt(e){return!!t.rows.find(o=>o.id===e)?.fixed}function Gt(e){const o=t.sections?.find(n=>n.row?.id===e);if(o)return o;const a=t.rows.find(n=>n.id===e)?.sectionRoot;return a&&t.sections?.find(n=>n.uid===a)||null}function ai(e,o){if(Wt(o))return;const a=Gt(o),n=t.rows.find(s=>s.id===o);if(a&&!(n?.hidden&&n.wrapFrom!=null)){e.postMessage({source:W,type:B.HIDE_ROW,uid:a.uid,show:!a.enabled},e.location.origin),e.setTimeout(()=>P(e),60);return}Se(e,o,Fa)}function si(e,o){if(Wt(o))return;const a=Gt(o)?.uid;if(a){e.postMessage({source:W,type:B.DUPLICATE_ROW,uid:a},e.location.origin);return}Se(e,o,Ba)}function en(e,o){Vt(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const a=e.document;fa({uid:o},a,e)})}function ri(e,o,a){Y===a&&(e.clearTimeout(ge),Y="",j=""),I=null,ce=!1,Pt="";const n=qe(e,o),s=n.find(r=>r.uid!==a)||n[0];s?ct(e,o,n,s.uid,""):(j="",t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,P(e)),e.setTimeout(()=>{z(e.document)&&P(e)},0)}Lo("row:removed",({uid:e,parentPath:o,doc:a,win:n})=>{o!==it(n)||!z(n.document)||ri(n,a,e)});function ii(e,o){if(Wt(o))return;const a=t.sections?.find(s=>s.row?.id===o),n=a?a.row?.section||a.uid:t.rows.find(s=>s.id===o)?.sectionRoot;if(n){en(e,n);return}if(t.rows.find(s=>s.id===o)?.kind==="sections"){Vt(e,{titleKey:"html_tree_sections_remove_title",bodyKey:"html_tree_sections_remove_body",confirmKey:"html_tree_sections_remove_confirm"},()=>Se(e,o,ho));return}Se(e,o,ho)}function Se(e,o,a,{lockAction:n=!1,unlock:s=!1}={}){if(b("dock:is-locked"))return;const r=X(),d=t.rows.find(p=>p.id===o);if(!d||!n&&Xt(e,d))return;const h=a(r,d);h!==r&&He(h,{unlock:s})}let Ke=null;function Zt(){Ke?.closest("[data-sve-ht-row]")?.removeAttribute("data-sve-ht-more-open"),Ke=null}function D(){J?.dismiss(),J=null,Zt()}const tn='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',on='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>',le=e=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${e}</svg>`,de={up:le('<path d="M12 19V5M6 11l6-6 6 6"/>'),down:le('<path d="M12 5v14M6 13l6 6 6-6"/>'),save:le('<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/>'),add:le('<path d="M12 5v14M5 12h14"/>'),blueprint:le('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>'),fieldset:le('<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/>'),lock:le('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),unlock:le('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-.9"/>')};function li(e,o){const a=t.sections||[],n=a.findIndex(d=>d.uid===o.uid),s=(d,h={})=>()=>{D(),e.postMessage({source:W,type:d,uid:o.uid,...h},e.location.origin),e.setTimeout(()=>P(e),60)},r=[{label:v(e,"move_up"),icon:de.up,onPick:n>0?s(B.MOVE,{direction:-1}):null},{label:v(e,"move_down"),icon:de.down,onPick:n>=0&&n<a.length-1?s(B.MOVE,{direction:1}):null},{label:v(e,"html_tree_save_section"),icon:de.save,onPick:s(B.SAVE_SECTION)},{label:v(e,"add_section_below"),icon:de.add,onPick:s(B.ADD_SET)}];if(la(e)&&r.push({label:v(e,"blueprint"),icon:de.blueprint,onPick:()=>{D(),da(e)}}),wo(e)&&o.type&&!o.static){const d=o.current&&!t.canEdit;r.push({label:v(e,"html_tree_fieldset"),icon:de.fieldset,onPick:d?null:()=>{D(),_o(e,o.type)}})}return r}function ko(e,o){const a=t.canEdit&&(!o.locked||t.canUnlock);return{label:o.locked?t.canUnlock?t.unlockTitle:t.lockedByTitle:t.lockTitle,icon:o.locked?de.unlock:de.lock,onPick:a?()=>{D(),Jo(e,o.id)}:null}}function di(e,o,a){if(!o.isConnected||J&&Ke===o)return;const n=Gt(a),s=t.rows.find(r=>r.id===a);if(!n){an(e,null,a,{anchor:o,lead:s?[ko(e,s)]:[]});return}D(),Ke=o,o.closest("[data-sve-ht-row]")?.setAttribute("data-sve-ht-more-open",""),J=Pe(e.document,Ee,{items:[...li(e,n),...s?[ko(e,s)]:[]],x:0,y:0,anchor:o,onClose:()=>{J=null,Zt()}})}function nn(e,o){const a=t.sections?.find(p=>p.uid===o),n=a?.type||"";if(!n||!xo(e))return[];const s=a.label||n,r=Bn(e,n),d=()=>e.Statamic?.$toast?.error(v(e,"section_update_failed")),h=[{label:v(e,"static_section_insertable"),icon:r?on:tn,onPick:()=>{D(),ro(e,{handle:n,hidden:!r}).then(()=>{e.Statamic?.$toast?.success(v(e,r?"section_shown_to_editors":"section_hidden_from_editors",{name:s})),io(e)}).catch(d)}}];return a.static&&h.push({label:v(e,"section_add_fields"),onPick:()=>{D(),ro(e,{handle:n,fields:!0}).then(()=>{e.Statamic?.$toast?.success(v(e,"section_fields_added",{name:s})),io(e),P(e),_o(e,n)}).catch(d)}}),h}function ci(e,o,a){const n=a.row?.section||a.uid;n&&(J=Pe(e.document,Ee,{items:[...nn(e,n),{label:v(e,"html_tree_remove_section"),danger:!0,onPick:()=>{D(),en(e,n)}}],x:o.clientX,y:o.clientY,onClose:()=>{J=null}}))}function an(e,o,a,{anchor:n=null,lead:s=[]}={}){D();const r=t.sections?.find(g=>g.row?.id===a);if(r){ci(e,o,r);return}const d=t.rows.find(g=>g.id===a);if(!d)return;n||Ce(e,a,t.rows);const h=n?{x:0,y:0}:{x:o.clientX,y:o.clientY},p=g=>{const E=[...s,...g.map(T=>n&&T.onPick?{...T,onPick:()=>{Ce(e,a,t.rows),T.onPick()}}:T)];E.length&&(J?.dismiss(),n&&(Ke=n,n.closest("[data-sve-ht-row]")?.setAttribute("data-sve-ht-more-open","")),J=Pe(e.document,Ee,{items:E,x:h.x,y:h.y,anchor:n,onClose:()=>{J=null,Zt()}}))};if(d.frameCall){p([{label:v(e,"html_tree_frame_edit",{frame:v(e,`chrome_${d.frameCall}`)}),onPick:()=>{D(),$t(e,d.frameCall)}}]);return}if(d.kind==="component"){hi(e,d,p);return}if(d.kind==="slot"||d.kind==="sections"||d.kind==="svg"||d.locked||d.lockedIn){p([]);return}if(!t.canEdit){p([]);return}if(d.componentRoot){p([]);return}p([...d.sectionRoot?nn(e,d.sectionRoot):[],{label:v(e,"component_make"),onPick:()=>{D(),xa(e,d,{onDone:()=>P(e),onError:g=>{e.alert(g?.status===409?v(e,"component_exists"):v(e,"component_failed"))}})}}])}const yo=(e,o)=>{D(),b("dock:open-template",o)};function hi(e,o,a){if(!ua(o.src)){a([{label:v(e,"component_open_named",{name:va(o.src)||o.src}),onPick:()=>yo(e,`view:partials/${o.src}`)}]);return}a([{label:v(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(o.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const s=Array.isArray(n.items)?n.items:[];a(s.length?s.map(r=>({label:v(e,"component_open_named",{name:r.label}),onPick:()=>yo(e,r.type)})):[{label:v(e,"component_none"),onPick:null}])}).catch(()=>a([{label:v(e,"component_none"),onPick:null}]))}function ui(e,o,a){if(o.button!==0||b("dock:is-locked")||t.editingId)return;const n=t.rows.find(d=>d.id===a);if(n&&(n.locked||n.lockedIn)||o.target?.closest?.("button, input"))return;Ye(),pe=a,Fe={x:o.clientX,y:o.clientY},tt=o.currentTarget,ot=o.pointerId;const s=d=>vi(e,d),r=d=>fi(e,d);Mt=()=>{e.document.removeEventListener("pointermove",s,!0),e.document.removeEventListener("pointerup",r,!0),e.document.removeEventListener("pointercancel",r,!0),Mt=null},e.document.addEventListener("pointermove",s,!0),e.document.addEventListener("pointerup",r,!0),e.document.addEventListener("pointercancel",r,!0)}function vi(e,o){if(!pe||!Fe)return;const a=o.clientX-Fe.x,n=o.clientY-Fe.y;if(!t.dragging&&a*a+n*n<25)return;if(!t.dragging){t.dragging=!0;try{tt?.setPointerCapture?.(ot)}catch{}}o.preventDefault();const s=e.document.elementFromPoint(o.clientX,o.clientY),r=s?.closest?.("[data-sve-ht-slot]");if(r){const T=r.getAttribute("data-sve-ht-id");if(T&&T!==pe){t.dropId=T,t.dropPlace="inside";return}}const d=s?.closest?.("[data-sve-ht-row]"),h=d?.getAttribute("data-sve-ht-id");if(!h||h===pe){t.dropId=null,t.dropPlace=null;return}const p=t.rows.find(T=>T.id===h),g=t.rows.find(T=>T.id===pe);if(!p||p.lockedIn||g&&p.path.startsWith(`${g.path}/`)){t.dropId=null,t.dropPlace=null;return}const E=d.getBoundingClientRect();t.dropId=h,t.dropPlace=Ia(o.clientY-E.top,E.height,!$o(p.tag)&&!Ro(p)&&!p.locked)}function fi(e,o){const a=pe,n=t.dropId,s=t.dropPlace||"after",r=t.dragging;if(Ye(),r&&(he=!0,e.setTimeout(()=>{he=!1},0)),!r||b("dock:is-locked")||!a||!n||a===n)return;o?.preventDefault?.();const d=X(),h=Oa(d,_e,a,n,s);h!==d&&He(h)}function Ye(){try{tt?.releasePointerCapture?.(ot)}catch{}Mt?.(),pe=null,Fe=null,tt=null,ot=null,t.dragging=!1,t.dropId=null,t.dropPlace=null}function mi(e,o,a){if(o.button!==0||!a||t.editingId||o.target?.closest?.("button, input"))return;sn(),Ve=a,Be={x:o.clientX,y:o.clientY},nt=o.currentTarget,at=o.pointerId;const n=r=>pi(e,r),s=r=>gi(e,r);Lt=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",s,!0),e.document.removeEventListener("pointercancel",s,!0),Lt=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",s,!0),e.document.addEventListener("pointercancel",s,!0)}function pi(e,o){if(!Ve||!Be)return;const a=o.clientX-Be.x,n=o.clientY-Be.y;if(!t.dragging&&a*a+n*n<25)return;if(!t.dragging){t.dragging=!0;try{nt?.setPointerCapture?.(at)}catch{}}o.preventDefault();const r=e.document.elementFromPoint(o.clientX,o.clientY)?.closest?.("[data-sve-ht-sec-uid]"),d=r?.getAttribute("data-sve-ht-sec-uid")||"";if(!d||d===Ve){t.sectionDrop=null;return}const h=r.getBoundingClientRect();t.sectionDrop={uid:d,place:o.clientY-h.top<h.height/2?"before":"after"}}function gi(e,o){const a=Ve,n=t.sectionDrop,s=t.dragging;sn(),s&&(he=!0,e.setTimeout(()=>{he=!1},0)),!(!s||!a||!n?.uid||n.uid===a)&&(o?.preventDefault?.(),ki(e,a,n.uid,n.place))}function sn(){try{nt?.releasePointerCapture?.(at)}catch{}Lt?.(),Ve=null,Be=null,nt=null,at=null,t.dragging=!1,t.sectionDrop=null}function ki(e,o,a,n){const s=it(e)||"page_sections";for(const r of Ft(e.document)||[]){const d=Bt(r.values),h=d&&typeof d=="object"?d[s]:null;if(!Array.isArray(h))continue;const p=M=>h.findIndex(x=>x&&typeof x=="object"&&[x._visual_id,x.id,x._id].includes(M)),g=p(o),E=p(a);if(g===-1||E===-1||g===E)return!1;let T=n==="before"?E:E+1;return g<T&&(T-=1),T===g?!1:(e.postMessage({source:W,type:B.MOVE,uid:o,toIndex:T},e.location.origin),e.setTimeout(()=>P(e),60),!0)}return!1}function Dt(e,o){if(o?.kind==="component"){yi(e,o);return}if(Q.callOpen&&(Q.callOpen=!1,Q.callStore=null,U.forget(),Ut(e)),o?.kind!=="antlers"){t.inspect=null;return}const a=o.id,n={logic:!0,path:o.path};if(o.tag==="else"){t.inspect={key:a,...n,title:v(e,"antlers_condition"),mode:"note",note:v(e,"antlers_else_note")};return}if(o.antlers==="loop"){t.inspect={...Za(e,o,{key:a,draft:me?.id===o.id?me.dir:""}),...n};return}t.inspect={key:a,...n,title:v(e,"antlers_condition"),mode:"condition",value:o.expr||"",placeholder:v(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:v(e,"antlers_add_elseif")},{id:"else",label:v(e,"antlers_add_else")}]}}function yi(e,o){if(!Sa(e)){t.inspect=null;return}if(!o.src)return;const a=o.id;if(t.inspect={key:a,title:v(e,"component_props_values"),mode:"note",note:v(e,"code_dock_loading")},Ca()){const n={},s={},r=new Map;for(const[d,h]of Pa(X().slice(o.from,o.to))){const p=Ea(d);p&&(d!==p||!r.has(p))&&r.set(p,h)}for(const[d,h]of r)h.bound?s[d]=h.value:n[d]=h.value;t.inspect=null,Q.callOpen=!0,Q.title=Q.title||v(e,"component_props"),Q.callTitle=o.klass||o.name||o.src,Q.callStore=U.ui,U.ui.canBind=!0,U.ui.dataTitle=v(e,"data_vars_title"),U.ui.exprPlaceholder=v(e,"component_props_expr"),U.ui.onBox=(d,h)=>Ti(e,d,h),U.ui.onPickData=(d,h)=>b("dock:data-menu",{anchor:h,at:o.from,types:Ha(U.ui.fields.find(p=>p.handle===d)?.type),onPick:p=>rn(e,d,String(p?.var||"").trim())}),U.load(e,{key:`${o.src}::${a}`,src:o.src,params:n,bindings:s,readOnly:b("dock:is-locked")===!0}),U.watch(e,{src:o.src,write:d=>bi(e,d,s)}),Ut(e);return}Ma(e,o.src).then(n=>{if(t.inspect?.key===a){if(!n.length){t.inspect={key:a,title:v(e,"component_props_values"),mode:"note",note:v(e,"component_props_values_none")};return}t.inspect={key:a,title:v(e,"component_props_values"),mode:"props",inheritLabel:v(e,"component_props_inherit"),rows:La(n,X().slice(o.from,o.to))}}})}function bi(e,o,a={}){const n=t.rows.find(d=>d.id===I);if(n?.kind!=="component"||b("dock:is-locked"))return;let s=X(),r=n.to;for(const[d,h]of Object.entries(o||{})){if(d in a)continue;const p=s.length,g=qt(s,{from:n.from,to:r},d,h);g!==s&&(r+=g.length-p,s=g)}s!==X()&&(He(s,{save:!0}),P(e))}function rn(e,o,a){ln(e,o,a,!0),P(e)}function Ti(e,o,a){const n=Ra(a);if(n){rn(e,o,n);return}U.forget(),ln(e,o,String(a??"").trim(),!1),P(e)}function ln(e,o,a,n){const s=t.rows.find(h=>h.id===I);if(s?.kind!=="component"||b("dock:is-locked"))return;const r=X(),d=qt(r,s,o,a,{bound:n});d!==r&&He(d,{save:!0})}function rt(){const e=t.rows.find(o=>o.id===I);return e?.kind==="antlers"&&!b("dock:is-locked")?e:null}function oe(e,o){const a=rt();if(!a)return;const n=X(),s=o(n,a);s!==n&&(He(s),P(e))}function bo(e,o,a,n){const s=t.rows.find(h=>h.id===I);if(s?.kind!=="component"||b("dock:is-locked"))return;const r=X(),d=qt(r,s,o,a,{bound:n});d!==r&&(He(d,{save:!0}),P(e))}function xi(e,o){oe(e,(a,n)=>n.antlers==="loop"?os(n,o)(a,n):Na(a,n,o))}function wi(e,o){const a=rt();if(!a||a.antlers!=="loop")return;const n=Ga(e,a,o);n&&oe(e,n)}function _i(e,o){oe(e,(a,n)=>Va(a,n,o))}function Si(e,o){if(!e||!o||Ro(o)||$o(o.tag))return null;const a=_a(e,o);if(a<o.openTo)return null;const n=e.lastIndexOf(`
`,a-1)+1;return e.slice(n,a).trim()===""&&n>o.openTo?n-1:a}function Ce(e,o,a,{reveal:n=!0}={}){if(he)return;const s=(a||t.rows).find(r=>r.id===o);s&&(I=o,t.rows.forEach(r=>{r.current=r.id===o}),Dt(e,s),!Yt()&&(n&&(b("dock:reveal-html",{from:s.from,to:s.to,caret:Si(X(),s)}),b("dock:tw-follow")),ue({source:W,type:B.SVE_HTML_PICK_FOCUS,path:s.path,src:s.kind==="component"&&s.src||""},e)))}function Ci(e,o){if(!o)return"";const a=[],n=(s,r)=>{for(const d of s||[]){const h=r||d.path===e;d.kind==="component"&&d.src===o&&a.push({path:d.path,inside:h}),n(d.children,h)}};return n(_e,!1),(a.find(s=>s.inside)||a[0])?.path||""}function Pi(e,o,{reveal:a=!0}={}){if(!o||!z(e.document))return;ce=!1;const n=t.rows.find(r=>r.current);if(n&&n.path===o){Ce(e,n.id,t.rows,{reveal:a});return}P(e),Xe(o),P(e);const s=t.rows.find(r=>r.path===o);s&&(Ce(e,s.id,t.rows,{reveal:a}),e.setTimeout(()=>{z(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function At(e){if(Qe)return;const o=()=>{t.editingId||t.dragging||(e.clearTimeout(et),et=e.setTimeout(()=>{z(e.document)&&P(e)},80))},a=()=>{if(o(),b("dock:on-empty-page")===!0){const n=qe(e,e.document);n.length===1&&ct(e,e.document,n,n[0].uid,"")}};Qe=Lo("dock:html-changed",o),e.document.addEventListener("sve-page-structure",a),Ht=()=>{e.document.removeEventListener("sve-page-structure",a)}}function Ei(e){Qe?.(),Qe=null,Ht?.(),Ht=null,e?.clearTimeout?.(et),et=0}function Qt(e){const o=z(e.document);if(ue({source:W,type:B.SVE_HTML_PICK,on:!1},e),Ei(e),U.forget(),Q.callOpen=!1,Q.callStore=null,Ut(e),Ye(),D(),ka(e),I=null,t.inspect=null,t.editingId=null,t.draft="",t.sections=[],t.pageBuilder=!1,t.layoutFile=!1,Y="",e?.clearTimeout?.(ge),!o){St(e);return}o.remove(),Nt.headerTab==="html_tree"&&Kn(e,null),Un(e),So(e),Co(e),St(e)}const dn="button[title], button[data-tip], label[title]";function Yi(e,o){o.querySelector("[data-sve-html-tree-list]")||(o.id=We,Po(e,o,{only:dn}),De(o,No,{title:v(e,"html_tree")}),o.querySelector("[data-sve-close]")?.addEventListener("click",()=>Qt(e)))}function zi(e){At(e),P(e)}function cn(e){const o=e.document;if(!Sn(e,"html_tree"))return;if(z(o)){At(e),P(e);return}if(!Yo(o))return;ce=!0,q.clear(),qn(e,[We]);const a=o.createElement("div");a.id=We,Po(e,a,{only:dn}),a.style.cssText=Yn,De(a,No,{title:v(e,"html_tree")}),a.querySelector("[data-sve-close]")?.addEventListener("click",()=>Qt(e)),zn(e,a),So(e),Co(e),St(e),At(e),P(e)}function Xi(e){if(z(e.document)){Qt(e);return}cn(e)}jt("html-tree:open-section",e=>{const o=window,a=o.document,n=qe(o,a),s=n.find(r=>r.uid===e||r.ids.includes(e));return s?(ct(o,a,n,s.uid,""),{uid:s.uid,ids:s.ids}):null});jt("html-tree:from-preview",({path:e,src:o,uid:a,reveal:n=!0}={})=>{if(!Ao(window,e)){if(!e){Hi(window,a);return}Pi(window,Ci(e,o)||e,{reveal:n})}});function Hi(e,o){if(!o||!z(e.document))return;const a=qe(e,e.document),n=Ue(o,e.document),s=a.find(r=>r.ids.some(d=>n.includes(d)));s&&(ce&&(ce=!1,q.clear(),I=null),Y&&Y!==s.uid&&(e.clearTimeout(ge),Y="",j=""),!b("dock:load-settled")&&P(e))}jt("html-tree:arm-pick",e=>{const o=window;return e?(Zo(o,lt(X(),Ko(o))),!0):(z(o.document)||ue({source:W,type:B.SVE_HTML_PICK,on:!1},o),!0)});function Wi(){ke.clear(),Ae.clear(),Et.clear(),Ze.clear(),je.length=0}export{Dr as HTML_TREE_STYLE_ID,qi as armHtmlTreePrefetch,Wi as clearHtmlTreeTemplates,D as closeHtmlTreeMenu,Qt as closeHtmlTreePanel,Vr as ensureHtmlTreeStyles,Yi as fillHtmlTreePane,I as htmlTreeActiveId,z as htmlTreePanel,et as htmlTreeTimer,Qe as htmlTreeUnhook,cn as openHtmlTreePanel,P as renderHtmlTree,zi as showHtmlTreePane,Ei as stopWatchHtmlTreeDock,Xi as toggleHtmlTreePanel,At as watchHtmlTreeDock};
