import{q as v,f as Ln,o as p,c as k,a as R,t as I,u as r,e as Hn,l as It,F,j as J,g as _,w,Y as Ae,N as j,aa as En,a2 as Mn,ag as Ee,k as Ot,ae as In,X as se,aE as On,v as po,P as Rn,x as $n,W as Fn,aF as An,ac as nt,D as Ye,aG as Dn,m as Xt,p as Wt,V as je,a8 as Bn,aH as Nn,aI as Vn}from"./addon-DKmhFDuA.js";import{c as $o,o as jn,a as Kn,b as Un,d as qn,i as Fo,r as zn,e as Yn,f as Xn,u as go,l as ko}from"./section-create-Qm3rCTgp.js";import{canEditFields as Ao,openGlobalFieldsOverlay as Wn,openFieldsetOverlay as Do}from"./section-fields-DM9flqGg.js";import{U as t,V as Gn,W as ee,X as Zn,b as y,Y as Qn,Z as Jn,_ as ea,$ as Gt,s as Zt,y as ke,j as Rt,H as ta,i as oa,E as Bo,F as No,a0 as yo,a1 as Vo,m as De,D as na,R as aa,G as sa,a2 as Xe,a3 as ra,a4 as bo,a5 as ia,a6 as la,a7 as jo,a8 as Ko,a9 as Uo,aa as da,ab as ca,o as qo,ac as Qt,ad as ha,ae as zo,l as pt,af as We,ag as ua,ah as Jt,ai as va,aj as fa,ak as ma,x as pa,al as ga,am as ka,an as ya,ao as Yo,ap as Xo,aq as ba,ar as Ta,as as xa,at as Wo,au as wa,av as _a,aw as Sa,A as Pa,ax as eo}from"./lp-cluster-CGt736WF.js";import{H as at,u as Ca,d as La}from"./shortcuts-BIxtNjMb.js";import{_ as to,o as Oe}from"./ChoiceDialog-DJ4t8Ccv.js";import{M as N,S as Q}from"./protocol-CfmvxZS7.js";import{C as Ha,H as Re,s as oo,c as Ea,a as Ma,b as Go,t as Ia,d as Se,h as Zo,e as Oa,o as Qo,f as Ge,r as Jo,g as Ra,w as no,i as $a,j as Fa,k as Aa,p as Da,l as Ba,m as Na,n as Va,q as ja,v as Ka,u as Ua,x as qa,y as za,z as To,A as Ya,B as Xa,D as Wa,E as Ga,F as Za,G as Qa,I as xo,J as Ja,K as es}from"./component-extract-QpHN8Hzi.js";import{H as ts,r as en,o as os,h as wo,w as ns}from"./logic-popup-C_FIscd1.js";import{T as as}from"./template-elements-C8aQvDwk.js";import{b as ss}from"./html-pick-align-BDjVGiSh.js";import{l as rs,a as is,b as ls,c as ds,d as cs,e as hs,f as us,g as vs,h as fs}from"./loop-inspector-2luZmLh2.js";import"./FieldsetOverlay-CB-fJgml.js";import"./anim-still-4pEwKCsB.js";import"./help-styles-DibN9Xyu.js";const wt=/\s*([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/y,ms=/^\s*(?:([A-Za-z_$][\w$]*)|'([^'\\]*)'|"([^"\\]*)")\s*:\s*(true|false)\s*$/;function ps(e){const o=String(e||"").replace(/\{\{[\s\S]*?\}\}/g,s=>" ".repeat(s.length)),a=o.match(/^<[a-zA-Z][\w:-]*/);if(!a)return null;let n=a[0].length;for(;n<o.length;){wt.lastIndex=n;const s=wt.exec(o);if(!s){n+=1;continue}if(s[1].toLowerCase()==="x-data")return s[2]??s[3]??s[4]??"";n=wt.lastIndex}return null}function gs(e,o){const a=e[o];for(let n=o+1;n<e.length;n+=1)if(e[n]==="\\")n+=1;else if(e[n]===a)return n;return e.length-1}function ks(e){const o=String(e||""),a=o.search(/\S/);if(a===-1||o[a]!=="{")return[];const n=new Map;let s=0,d="";const i=()=>{const h=d.match(ms);h&&n.set(h[1]??h[2]??h[3],h[4]==="true"),d=""};for(let h=a;h<o.length;h+=1){const m=o[h];if(m==='"'||m==="'"||m==="`"){const g=gs(o,h);d+=o.slice(h,g+1),h=g;continue}if(m==="/"&&o[h+1]==="/"){const g=o.indexOf(`
`,h);h=g===-1?o.length:g-1;continue}if(m==="/"&&o[h+1]==="*"){const g=o.indexOf("*/",h+2);h=g===-1?o.length:g+1;continue}if(m==="{"||m==="["||m==="("){if(s+=1,s===1)continue}else if(m==="}"||m==="]"||m===")"){if(s-=1,s===0)break}else if(m===","&&s===1){i();continue}d+=m}return i(),[...n].map(([h,m])=>({key:h,value:m}))}const ys={class:"sve-html-tree"},bs={class:"sve-pane-bar","data-sve-pane-bar":""},Ts={"data-sve-right-title":""},xs={"data-sve-right-actions":""},ws=["aria-pressed","title","aria-label"],_s=["title"],Ss={class:"sve-ht-used-by__label"},Ps={class:"sve-ht-used-by__chips"},Cs=["title","onClick"],Ls={key:1,class:"sve-ht-used-by__chip"},Hs={key:0,class:"sve-ht-used-by__empty"},Es={class:"sve-ht-tools"},Ms=["title"],Is=["placeholder","aria-label","value"],Os=["aria-label"],Rs=["title","aria-label"],$s=["title","aria-label"],Fs={key:3,class:"sve-tree-exit"},As=["title"],Ds=["title"],Bs='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',Ns='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',Vs='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',js='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',Ks='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/></svg>',Us='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',qs={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const o=v(window,"html_tree_search");t.layers=Gn(window);const a=v(window,"html_tree_layers_on"),n=v(window,"html_tree_layers_off");function s(){Zn(window,!t.layers)}const d=$o(window),i=v(window,"section_new"),h=v(window,"html_tree_add_element"),m=v(window,"html_tree_sections_slot"),g=v(window,"html_tree_sections_no_field");function L(){const u=t.templateSections.length?t.templateSections:[En(window)],l=new Set(t.rows.filter(f=>f.kind==="sections").map(f=>f.tag));return u.filter(f=>!l.has(f)).map(f=>({tag:`sections:${f}`,label:u.length>1?`${m} · ${f}`:m,noField:!t.templateSections.length}))}const b=Ln(!1),E=v(window,"section_import");function P(){b.value=!1}async function oe(u){if(!u)return;await Mn(),t.onRefresh?.();const l=y("html-tree:open-section",u);l&&zn(window,l.ids)}function C(){const u=t.rows.find(l=>l.current&&!l.context&&!l.synthetic)||null;return u?.lockedIn?t.rows.filter(l=>l.locked&&l.from<=u.from&&l.to>=u.to).sort((l,f)=>l.from-f.from)[0]||null:u}function M(u){const l=u.getBoundingClientRect(),f=C();let O=null;const le=(q,ye,kt="")=>()=>{O?.dismiss(),O=null,P();const B=Fo(window,q,f,ye);B!==null&&(t.selectFrom={at:B,left:4},kt&&window.Statamic?.$toast?.info?.(kt))};O=Oe(document,Re,{items:[...t.newSectionToo?[{label:i,onPick:()=>{O?.dismiss(),O=null,$(t.lastSectionUid||null)}}]:[],...as.map(q=>({label:q,onPick:le(q,`<${q}>`)})),...L().map(q=>({label:q.label,onPick:le(q.tag,q.label,q.noField?g:"")}))],x:Math.round(l.left),y:Math.round(l.bottom+4),onClose:()=>{O=null,P()}})}function x(u){if(!b.value){if(b.value=!0,!(t.sections.length&&!t.sectionsInLoop||t.pageBuilder)){M(u.currentTarget);return}$(t.sections.length?t.sections[t.sections.length-1].uid:null)}}function $(u){(async()=>{const l=await Kn(window);if(!l){P();return}const f=O=>{P(),oe(O?.uid)};if(l==="static"){Un(window,{afterUid:u,onDone:f,onError:P,onClose:P});return}qn(window,{afterUid:u,onDone:f,onError:P,onClose:P})})()}function G(){if(b.value)return;b.value=!0;const u=!!(t.sections.length&&!t.sectionsInLoop||t.pageBuilder);jn(window,{intoTemplate:!u,after:u?null:C(),afterUid:u&&t.sections.length?t.sections[t.sections.length-1].uid:null,onDone:l=>{if(P(),u){oe(l?.uid);return}Number.isInteger(l?.at)&&(t.selectFrom={at:l.at,left:4})},onError:P,onClose:P})}function U(u){const l=!!t.query;t.query=u,l!==!!u&&t.onQuery?.()}return(u,l)=>(p(),k("div",ys,[R("div",bs,[R("div",Ts,I(e.title),1),R("div",xs,[R("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":r(t).layers?"true":"false",title:r(t).layers?r(n):r(a),"aria-label":r(t).layers?r(n):r(a),innerHTML:Bs,onClick:s},null,8,ws),l[5]||(l[5]=Hn('<button type="button" data-sve-right-pin aria-pressed="false" data-v-e040f58b></button><button type="button" data-sve-close aria-label="Close" data-v-e040f58b><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-e040f58b><path d="M18 6 6 18" data-v-e040f58b></path><path d="m6 6 12 12" data-v-e040f58b></path></svg></button>',2))])]),r(t).usedBy?(p(),k("div",{key:0,class:"sve-ht-used-by",title:r(t).usedBy.hint||null},[R("span",Ss,[R("span",{class:"sve-ht-used-by__icon","aria-hidden":"true",innerHTML:Ks}),It(" "+I(r(t).usedBy.label),1)]),R("span",Ps,[(p(!0),k(F,null,J(r(t).usedBy.items,f=>(p(),k(F,{key:f.kind+":"+f.name},[f.onOpen?(p(),k("button",{key:0,type:"button",class:"sve-ht-used-by__chip sve-ht-used-by__chip--open",title:f.openLabel,onClick:O=>f.onOpen(O.currentTarget)},I(f.name),9,Cs)):(p(),k("span",Ls,I(f.name),1))],64))),128)),r(t).usedBy.empty?(p(),k("span",Hs,I(r(t).usedBy.empty),1)):_("",!0)])],8,_s)):_("",!0),R("div",Es,[R("label",{class:"sve-ht-search",title:r(o)},[R("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:js}),R("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:r(o),"aria-label":r(o),value:r(t).query,autocomplete:"off",spellcheck:"false",onInput:l[0]||(l[0]=f=>U(f.target.value)),onKeydown:[l[1]||(l[1]=w(()=>{},["stop"])),l[2]||(l[2]=Ae(w(f=>U(""),["prevent"]),["escape"]))]},null,40,Is),r(t).query?(p(),k("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":r(o),innerHTML:Us,onClick:l[3]||(l[3]=f=>U(""))},null,8,Os)):_("",!0)],8,Ms),r(d)&&(r(t).sections.length&&!r(t).sectionsInLoop||r(t).pageBuilder||r(t).rows.length&&!r(t).layoutFile||r(t).emptyFile)?(p(),k("button",{key:0,type:"button",class:"sve-ht-new",title:r(t).sections.length&&!r(t).sectionsInLoop||r(t).pageBuilder?r(i):r(h),"aria-label":r(t).sections.length&&!r(t).sectionsInLoop||r(t).pageBuilder?r(i):r(h),innerHTML:Ns,onClick:x},null,8,Rs)):_("",!0),r(d)&&(r(t).sections.length&&!r(t).sectionsInLoop||r(t).pageBuilder||r(t).rows.length&&!r(t).layoutFile||r(t).emptyFile)?(p(),k("button",{key:1,type:"button",class:"sve-ht-import",title:r(E),"aria-label":r(E),innerHTML:Vs,onClick:G},null,8,$s)):_("",!0)]),r(ee).inSidebar?_("",!0):(p(),j(Ha,{key:1})),l[6]||(l[6]=R("div",{"data-sve-html-tree-list":""},null,-1)),r(t).inspect?.logic?_("",!0):(p(),j(ts,{key:2})),r(t).exitOpen&&!r(ee).inSidebar?(p(),k("div",Fs,[R("span",{class:"sve-tree-exit__name",title:r(t).exitName},I(r(t).exitName),9,As),R("button",{type:"button",class:"sve-tree-exit__go",title:r(t).exitTitle,onClick:l[4]||(l[4]=f=>r(t).onExit?.())},I(r(t).exitLabel),9,Ds)])):_("",!0)]))}},tn=to(qs,[["__scopeId","data-v-e040f58b"]]);function on(e){return String(e||"").trim().toLowerCase()}function $t(e,o){return o?[e.name,e.tag,e.klass,e.label,e.src].filter(a=>typeof a=="string"&&a).join(" ").toLowerCase().includes(o):!0}function zs(e,o){const a=on(o);if(!a)return{rows:e,hits:new Set};const n=new Set;for(const i of e)$t(i,a)&&n.add(i.path);const s=[...n];return{rows:e.filter(i=>n.has(i.path)||s.some(h=>h.startsWith(`${i.path}/`))),hits:n}}const Ys=["title"],Xs={"data-sve-ht-indent":"","aria-hidden":"true"},Ws=["data-sve-ht-cat"],Gs={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},Zs={key:2,"data-sve-ht-letter":""},Qs=["innerHTML"],Js=["title"],er=["title"],tr={key:1,"data-sve-ht-kind":""},or={key:3,"data-sve-ht-name":""},nr={key:4,"data-sve-ht-actions":""},ar=["data-on","title","innerHTML"],sr=["title"],rr={key:5,"data-sve-ht-actions":""},ir=["data-on","title","innerHTML"],lr=["data-on","title","innerHTML"],dr=["disabled","title"],cr=["disabled","title","innerHTML"],hr=["disabled","title"],ur=["disabled","title"],vr=["aria-label"],fr=["data-sve-ht-id"],mr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',pr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',gr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',kr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',yr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',br='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',Tr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',_o='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6.5" width="20" height="11" rx="5.5"/><circle cx="7.5" cy="12" r="3" fill="currentColor" stroke="none"/></svg>',So='<svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M7.5 5.5h9a6.5 6.5 0 0 1 0 13h-9a6.5 6.5 0 0 1 0-13ZM16.5 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6Z"/></svg>',xr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',wr='<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>',_r='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',Sr=120,Pr={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const o=Ao(window);function a(u){return u.synthetic?u.frame==="main"?t.frameMainTitle:u.frame==="template"?t.frameTemplateTitle:t.frameOpenTitle:u.kind==="component"?u.src?`partial:${u.src}`:u.tag:u.name?`${u.tag} ${u.name}`:u.tag}function n(u){return!!u.section}function s(u){return!!u.frame}function d(u){return u.kind==="slot"}function i(u,l){s(l)||d(l)||(n(l)?t.onSectionPointerDown?.(u,l.section):l.sectionRoot?t.onSectionPointerDown?.(u,l.sectionRoot):t.onPointerDown?.(u,l.id))}function h(u,l){if(u.synthetic){t.onFrame?.(u.frame);return}if(n(u)){t.onSection?.(u.section);return}t.onSelect?.(u.id,l)}function m(u,l){const f={"data-sve-ht-id":u.id};return u.locked&&(f["data-sve-ht-locked"]=""),u.current&&(f["data-sve-ht-current"]=""),(u.hidden||u.sectionOff)&&(f["data-sve-ht-hidden"]=""),(u.videoNth>=0||u.alpineNth>=0)&&(f["data-sve-ht-special"]=""),f["data-sve-ht-cat"]=u.cat||"other",f["data-sve-ht-depth"]=String(u.depth),l&&(f["data-sve-ht-dim"]=""),n(u)&&(f["data-sve-ht-sec"]=""),s(u)&&(f["data-sve-ht-frame"]=u.frame),!n(u)&&t.dropId===u.id&&t.dropPlace&&(f["data-sve-ht-drop"]=t.dropPlace),f}function g(u){return!!u.fixed}function L(u){return u.kind==="sections"}function b(u){return!!(u.locked||u.lockedIn)}function E(u){return!u.lockedIn&&!g(u)}function P(u){return $(u)||!g(u)&&!L(u)&&!b(u)&&(!u.hidden||u.wrapFrom!=null)}function oe(u){if(!G(u))return t.lockedTitle;const l=u.hidden||u.sectionOff;return $(u)?l?t.sectionShowTitle:t.sectionHideTitle:l?t.showTitle:t.hideTitle}let C=null;function M(u,l){window.clearTimeout(C),C=window.setTimeout(()=>t.onMore?.(u,l.id),Sr)}function x(){window.clearTimeout(C)}function $(u){return!!u.sectionRoot||!!u.section}function G(u){return t.canEdit&&!b(u)||$(u)}function U(u){const l=u.name||"";return Gt()&&l.toLowerCase()===String(u.tag||"").toLowerCase()?"":l}return(u,l)=>(p(),k(F,null,[R("div",Ee({"data-sve-ht-row":""},m(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:l[43]||(l[43]=f=>h(e.row,f.currentTarget)),onDblclick:l[44]||(l[44]=w(f=>e.row.synthetic?r(t).onFrameEnter?.(e.row.frame):s(e.row)||d(e.row)||n(e.row)?null:r(t).onRename?.(e.row.id),["prevent"])),onKeydown:[l[45]||(l[45]=Ae(w(f=>h(e.row,f.currentTarget),["prevent"]),["enter"])),l[46]||(l[46]=Ae(w(f=>h(e.row,f.currentTarget),["prevent"]),["space"]))],onPointerdown:l[47]||(l[47]=f=>i(f,e.row)),onPointerenter:l[48]||(l[48]=f=>n(e.row)?r(t).onSectionHover?.(e.row.section):null),onContextmenu:l[49]||(l[49]=w(f=>s(e.row)||d(e.row)||n(e.row)?null:r(t).onContext?.(f,e.row.id),["prevent","stop"]))}),[R("span",Xs,[(p(!0),k(F,null,J(e.row.guides||[],(f,O)=>(p(),k("i",{key:O,"data-sve-ht-cat":f},null,8,Ws))),128))]),e.row.hasChildren||r(Qn)(e.row)?(p(),k("button",Ee({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?r(t).mainShut:r(Jn)(e.row))?{"data-sve-ht-shut":""}:{},{innerHTML:pr,onClick:l[0]||(l[0]=w(f=>e.row.synthetic?r(t).onFrameTwist?.():n(e.row)?r(t).onSection?.(e.row.section):r(t).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:l[1]||(l[1]=w(()=>{},["stop"])),onDblclick:l[2]||(l[2]=w(()=>{},["stop"]))}),null,16)):(p(),k("span",Gs)),e.row.letter?(p(),k("span",Zs,I(e.row.letter),1)):(p(),k("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Qs)),R("span",{"data-sve-ht-text":"",title:r(t).renameTitle},[!e.row.kind&&!n(e.row)&&!s(e.row)?(p(),k("button",{key:0,type:"button","data-sve-ht-tag":"",title:r(t).tagTitle,onClick:l[3]||(l[3]=w(()=>{},["stop","prevent"])),onPointerdown:l[4]||(l[4]=w(()=>{},["stop"])),onDblclick:l[5]||(l[5]=w(f=>r(t).onTagChange?.(f,e.row.id),["stop","prevent"]))},I(e.row.tag),41,er)):(p(),k("span",tr,I(e.row.tag),1)),r(t).editingId===e.row.id&&!n(e.row)?Ot((p(),k("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":l[6]||(l[6]=f=>r(t).draft=f),onMousedown:l[7]||(l[7]=w(()=>{},["stop"])),onPointerdown:l[8]||(l[8]=w(()=>{},["stop"])),onClick:l[9]||(l[9]=w(()=>{},["stop"])),onDblclick:l[10]||(l[10]=w(()=>{},["stop"])),onKeydown:[l[11]||(l[11]=w(()=>{},["stop"])),l[12]||(l[12]=Ae(w(f=>r(t).onRenameCommit?.(),["prevent"]),["enter"])),l[13]||(l[13]=Ae(w(f=>r(t).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:l[14]||(l[14]=f=>r(t).onRenameCommit?.())},null,544)),[[In,r(t).draft]]):(p(),k("span",or,I(U(e.row)),1))],8,Js),s(e.row)?(p(),k("span",nr,[e.row.alpineNth>=0?(p(),k("button",{key:0,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:r(t).alpineTitle,innerHTML:e.row.alpineSet?So:_o,onClick:l[15]||(l[15]=w(f=>r(t).onAlpineState?.(f,e.row.id),["stop","prevent"])),onPointerdown:l[16]||(l[16]=w(()=>{},["stop"])),onDblclick:l[17]||(l[17]=w(()=>{},["stop"]))},null,40,ar)):_("",!0),e.row.frame!=="main"&&r(o)?(p(),k("button",{key:1,type:"button","data-sve-ht-fields":"",title:r(t).frameFieldsTitle,innerHTML:mr,onClick:l[18]||(l[18]=w(f=>r(t).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:l[19]||(l[19]=w(()=>{},["stop"])),onDblclick:l[20]||(l[20]=w(()=>{},["stop"]))},null,40,sr)):_("",!0)])):d(e.row)?_("",!0):(p(),k("span",rr,[e.row.videoNth>=0?(p(),k("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?r(t).videoPlayTitle:r(t).videoHoldTitle,innerHTML:e.row.videoHeld?Tr:br,onClick:l[21]||(l[21]=w(f=>r(t).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:l[22]||(l[22]=w(()=>{},["stop"])),onDblclick:l[23]||(l[23]=w(()=>{},["stop"]))},null,40,ir)):_("",!0),e.row.alpineNth>=0?(p(),k("button",{key:1,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:r(t).alpineTitle,innerHTML:e.row.alpineSet?So:_o,onClick:l[24]||(l[24]=w(f=>r(t).onAlpineState?.(f,e.row.id),["stop","prevent"])),onPointerdown:l[25]||(l[25]=w(()=>{},["stop"])),onDblclick:l[26]||(l[26]=w(()=>{},["stop"]))},null,40,lr)):_("",!0),e.row.locked?(p(),k("button",{key:2,type:"button","data-sve-ht-lock":"","data-on":"",disabled:!r(t).canEdit||!r(t).canUnlock,title:r(t).canUnlock?r(t).unlockTitle:r(t).lockedByTitle,"aria-pressed":"true",innerHTML:xr,onClick:l[27]||(l[27]=w(f=>r(t).onLock?.(e.row.id),["stop","prevent"])),onPointerdown:l[28]||(l[28]=w(()=>{},["stop"])),onDblclick:l[29]||(l[29]=w(()=>{},["stop"]))},null,40,dr)):_("",!0),P(e.row)?(p(),k("button",{key:3,type:"button","data-sve-ht-eye":"",disabled:!G(e.row),title:oe(e.row),innerHTML:e.row.hidden||e.row.sectionOff?kr:gr,onClick:l[30]||(l[30]=w(f=>r(t).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:l[31]||(l[31]=w(()=>{},["stop"])),onDblclick:l[32]||(l[32]=w(()=>{},["stop"]))},null,40,cr)):_("",!0),!g(e.row)&&!L(e.row)?(p(),k("button",{key:4,type:"button","data-sve-ht-dup":"",disabled:!G(e.row),title:G(e.row)?r(t).duplicateTitle:r(t).lockedTitle,innerHTML:yr,onClick:l[33]||(l[33]=w(f=>r(t).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:l[34]||(l[34]=w(()=>{},["stop"])),onDblclick:l[35]||(l[35]=w(()=>{},["stop"]))},null,40,hr)):_("",!0),g(e.row)?_("",!0):(p(),k("button",{key:5,type:"button","data-sve-ht-del":"",disabled:!G(e.row),title:G(e.row)?r(t).deleteTitle:r(t).lockedTitle,innerHTML:_r,onClick:l[36]||(l[36]=w(f=>r(t).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:l[37]||(l[37]=w(()=>{},["stop"])),onDblclick:l[38]||(l[38]=w(()=>{},["stop"]))},null,40,ur)),E(e.row)?(p(),k("button",{key:6,type:"button","data-sve-ht-more":"","aria-label":r(t).moreTitle,"aria-haspopup":"menu",innerHTML:wr,onPointerenter:l[39]||(l[39]=f=>M(f.currentTarget,e.row)),onPointerleave:x,onClick:l[40]||(l[40]=w(f=>{x(),r(t).onMore?.(f.currentTarget,e.row.id)},["stop","prevent"])),onPointerdown:l[41]||(l[41]=w(()=>{},["stop"])),onDblclick:l[42]||(l[42]=w(()=>{},["stop"]))},null,40,vr)):_("",!0)]))],16,Ys),r(ea)(e.row)?(p(),k("div",Ee({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},r(t).dropId===e.row.id&&r(t).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),I(r(t).slotText),17,fr)):_("",!0)],64))}},z=to(Pr,[["__scopeId","data-v-cafb8411"]]),Cr=["data-sve-ht-look","data-sve-ht-layers"],Lr={key:0,class:"sve-ht-page-template"},Hr={key:0,class:"sve-ht-page-template__text"},Er={class:"sve-ht-page-template__note"},Mr={key:1,class:"sve-ht-empty"},Ir={key:2,class:"sve-ht-empty"},Or={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},Rr={key:0,class:"sve-ht-empty"},$r={key:0,class:"sve-ht-empty"},Fr=["data-sve-ht-under-main"],Ar={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},Dr={key:0,class:"sve-ht-empty"},Br=["data-sve-ht-under-main"],Nr=["data-dim"],Vr={key:0,class:"sve-ht-empty"},jr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},Kr={key:0,class:"sve-ht-empty"},Ur={key:4,"data-sve-ht-branch":"","data-sve-ht-cat":"component"},qr=["data-sve-ht-field"],zr=["onClick"],Yr={__name:"HtmlTreeList",setup(e){const o=se(()=>on(t.query)),a=se(()=>zs(t.rows,o.value)),n=se(()=>a.value.rows);function s(C,M){return{...C,depth:M.depth+1,guides:[...M.guides||[],M.cat]}}const d=se(()=>o.value?[]:t.sectionsMissing||[]),i=se(()=>o.value?t.sections.filter(C=>$t(C.row,o.value)||C.current&&C.ready&&n.value.length>0):t.sections);function h(C){return!!C&&(!o.value||$t(C,o.value))}function m(C){const M=t.frame?.kind;return t.inComponent||(M==="header"||M==="footer")&&M!==C}const g=se(()=>t.frame?.kind==="header"||t.frame?.kind==="footer"),L=se(()=>!!t.frame&&["header","main","footer"].some(C=>h(t.frame[C]))),b=se(()=>!!t.frame&&(t.frame.kind==="main"||h(t.frame.main))),E=se(()=>!!o.value&&!i.value.length&&!n.value.length&&!L.value);function P(C){return!!o.value&&!a.value.hits.has(C.path)}function oe(C){const M={"data-sve-ht-sec-uid":C.uid};return C.current&&(M["data-sve-ht-branch"]="",M["data-sve-ht-cat"]=C.row?.cat||"layout"),t.sectionDrop&&t.sectionDrop.uid===C.uid&&(M["data-sve-ht-drop"]=t.sectionDrop.place),M}return(C,M)=>(p(),k("div",Ee({class:"sve-ht-root","data-sve-ht-look":r(t).layers?"tags":r(t).look,"data-sve-ht-layers":r(t).layers?"":null,style:r(t).familyStyle},r(t).dragging?{"data-sve-ht-dragging":""}:{}),[r(t).pageTemplate?(p(),k("div",Lr,[r(t).pageTemplate.text?(p(),k("p",Hr,I(r(t).pageTemplate.text),1)):_("",!0),R("p",Er,I(r(t).pageTemplate.note),1),r(t).pageTemplate.canOpen?(p(),k("button",{key:1,type:"button",class:"sve-ht-page-template__open",onClick:M[0]||(M[0]=x=>r(t).pageTemplate.onOpen(x.currentTarget))},I(r(t).pageTemplate.openLabel),1)):_("",!0)])):!r(t).rows.length&&!r(t).sections.length&&!r(t).frame?(p(),k("div",Mr,I(r(t).emptyText),1)):E.value?(p(),k("div",Ir,I(r(t).searchEmpty),1)):_("",!0),(r(t).frame||r(t).sections.length)&&!r(t).sectionsInLoop?(p(),k(F,{key:3},[r(t).ownFile&&!o.value?(p(),j(z,{key:0,row:r(t).ownFile},null,8,["row"])):_("",!0),r(t).frame?(p(),k(F,{key:1},[r(t).frame.kind==="header"?(p(),k("div",Or,[(p(!0),k(F,null,J(n.value,x=>(p(),j(z,{key:x.id,row:x,dim:P(x)},null,8,["row","dim"]))),128)),r(t).rows.length?_("",!0):(p(),k("div",Rr,I(r(t).emptyText),1))])):!g.value&&h(r(t).frame.header)?(p(),j(z,{key:1,row:r(t).frame.header,dim:m("header")},null,8,["row","dim"])):_("",!0)],64)):_("",!0),g.value?_("",!0):(p(),k("div",On(Ee({key:2},r(t).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[r(t).frame?.kind==="main"?(p(),k(F,{key:0},[(p(!0),k(F,null,J(n.value,x=>(p(),j(z,{key:x.id,row:x,dim:P(x)},null,8,["row","dim"]))),128)),r(t).rows.length?_("",!0):(p(),k("div",$r,I(r(t).emptyText),1))],64)):r(t).frame&&h(r(t).frame.main)?(p(),j(z,{key:1,row:r(t).frame.main,dim:m("main")},null,8,["row","dim"])):_("",!0),r(t).frame?.kind==="template"?Ot((p(),k("div",{key:2,"data-sve-ht-frame-body":"","data-sve-ht-under-main":b.value?"":null},[R("div",Ar,[(p(!0),k(F,null,J(n.value,x=>(p(),j(z,{key:x.id,row:x,dim:P(x)},null,8,["row","dim"]))),128)),r(t).rows.length?_("",!0):(p(),k("div",Dr,I(r(t).emptyText),1))])],8,Fr)),[[po,!r(t).mainShut]]):_("",!0),r(t).sections.length||r(t).frame?Ot((p(),k("div",{key:3,"data-sve-ht-frame-body":"","data-sve-ht-under-main":b.value?"":null},[r(t).frame?.template&&h(r(t).frame.template)?(p(),j(z,{key:0,row:r(t).frame.template,dim:m("template")},null,8,["row","dim"])):_("",!0),r(t).frame&&!r(t).frame.template&&!r(t).sections.length&&!o.value?(p(),k("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":m("")?"":void 0},I(r(t).frameEmptyText),9,Nr)):_("",!0),(p(!0),k(F,null,J(i.value,x=>(p(),k("div",Ee({key:x.uid},{ref_for:!0},oe(x)),[x.ready?(p(),k(F,{key:0},[(p(!0),k(F,null,J(n.value,$=>(p(),j(z,{key:$.id,row:$,dim:P($)},null,8,["row","dim"]))),128)),r(t).rows.length?_("",!0):(p(),k("div",Vr,I(r(t).emptyText),1))],64)):(p(),j(z,{key:1,row:x.row,dim:m("")},null,8,["row","dim"]))],16))),128))],8,Br)),[[po,!r(t).frame||!r(t).mainShut]]):_("",!0)],16)),r(t).frame?(p(),k(F,{key:3},[r(t).frame.kind==="footer"?(p(),k("div",jr,[(p(!0),k(F,null,J(n.value,x=>(p(),j(z,{key:x.id,row:x,dim:P(x)},null,8,["row","dim"]))),128)),r(t).rows.length?_("",!0):(p(),k("div",Kr,I(r(t).emptyText),1))])):!g.value&&h(r(t).frame.footer)?(p(),j(z,{key:1,row:r(t).frame.footer,dim:m("footer")},null,8,["row","dim"])):_("",!0)],64)):_("",!0)],64)):r(t).inComponent&&r(t).rows.length?(p(),k("div",Ur,[(p(!0),k(F,null,J(n.value,x=>(p(),j(z,{key:x.id,row:x,dim:P(x)},null,8,["row","dim"]))),128))])):r(t).rows.length?(p(!0),k(F,{key:5},J(n.value,x=>(p(),k(F,{key:x.id},[Rn(z,{row:x,dim:P(x)},null,8,["row","dim"]),!o.value&&r(t).sectionsInLoop&&x.kind==="sections"&&x.tag===r(t).sectionsInLoop?(p(!0),k(F,{key:0},J(r(t).sections,$=>(p(),j(z,{key:$.uid,row:s($.row,x)},null,8,["row"]))),128)):_("",!0)],64))),128)):_("",!0),(p(!0),k(F,null,J(d.value,x=>(p(),k("div",{key:x,"data-sve-ht-sections-missing":"","data-sve-ht-field":x},[R("span",null,[It(I(r(t).sectionsMissingText),1),r(t).sectionsMissing.length>1?(p(),k(F,{key:0},[M[1]||(M[1]=It(" · ",-1)),R("code",null,I(x),1)],64)):_("",!0)]),R("button",{type:"button","data-sve-ht-sections-add":"",onClick:$=>r(t).onAddSections?.(x)},I(r(t).sectionsAddText),9,zr)],8,qr))),128))],16,Cr))}},_t=to(Yr,[["__scopeId","data-v-8ca94f11"]]);let St=null;function Xr(e){return St||(St=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(o=>o.ok?o.json():{pages:[]}).then(o=>Array.isArray(o.pages)?o.pages:[]).catch(()=>[])),St}let st=null;function Pt(){st?.dismiss(),st=null}function Wr(e,o,a){Pt();const n=o?.getBoundingClientRect?.(),s={x:n?n.left:0,y:n?n.bottom+4:0};Xr(e).then(d=>{const i=d.length?d.map(h=>({label:h.title||h.url,onPick:()=>{Pt(),a(h.url)}})):[{label:v(e,"component_props_pages_none"),onPick:null}];Pt(),st=Oe(e.document,Re,{items:i,x:s.x,y:s.y,onClose:()=>{st=null}})})}function nn(e){for(const o of e||[]){if(o.kind==="component"||o.kind==="svg"&&o.dynamic)continue;const a=o.kind==="antlers"?nn(o.children):o;if(a)return a}return null}const Y=Oa("sve-call-values"),Gr="__sve-html-tree-style";function Zr(e,o,a){if(o||a)return!1;const n=String(y("dock:chrome-kind")||"");if(n==="header"||n==="footer")return!1;const s=nt(e);return Ge(e)?!1:!!s&&s!=="create"&&Bn(e)!==Nn(e)}function ao(e){return{sectionLoops:[...new Set([...Dn(e),...Qo(e),...t.templateSections])],sectionsLabel:v(e,"html_tree_sections_slot")}}const Po=new Set;function Qr(e){const o=nt(e);!o||o==="create"||Po.has(o)||Ge(e)||(Po.add(o),Qt(e,{entry:o}).then(a=>{!a?.own_page||!a.view||nt(e)!==o||(Jo(o,a.view,a.sections_fields),y("dock:current-type")||y("dock:open-file",`view:${a.view}`),H(e))}))}function Jr(e,o){const a={entry:o,text:"",note:v(e,"html_tree_page_template_note"),openLabel:v(e,"html_tree_open_template"),canOpen:!1,onOpen:null};return Qt(e,{entry:o}).then(n=>{if(!(!n||t.pageTemplate?.entry!==o)){if(n.own_page&&n.view){Jo(o,n.view,n.sections_fields),y("dock:open-file",`view:${n.view}`),H(e);return}t.pageTemplate={...t.pageTemplate,text:v(e,"html_tree_page_template",{name:n.name}),canOpen:!!n.open,onOpen:n.open?s=>ua(e,s,n.open):null}}}),a}function ei(e,o){const a=Ge(e);if(a&&y("dock:current-type")===a){t.usedBy=null,t.templateSections=Qo(e);return}const n=o.replace(/^view:/,"");if(!n||y("dock:current-type")!==o){t.usedBy=null,t.templateSections=[];return}t.usedBy?.view!==n&&(t.usedBy=null,Qt(e,{view:n}).then(s=>{if(!s||y("dock:current-type")!==o)return;const d=s.everything?[{name:v(e,"html_tree_used_by_everything"),kind:"everything",url:null}]:s.used_by.map(m=>({...m,...ti(e,m)})),i=Array.isArray(s.sections_fields)?s.sections_fields:[],h=i.join()!==t.templateSections.join();t.templateSections=i,t.usedBy={view:n,label:v(e,"html_tree_used_by"),items:d,empty:d.length?"":v(e,"html_tree_used_by_nobody"),hint:d.length?v(e,"html_tree_used_by_hint",{list:d.map(m=>m.name).join(", ")}):""},h&&H(e)}))}function Co(e,o=t.templateSections){const a=new Set,n=s=>{for(const d of s||[])d.kind==="sections"&&a.add(d.tag),n(d.children)};return n(e),o.filter(s=>!a.has(s))}function ti(e,o){if(!o.url)return{openLabel:"",onOpen:null};const a=v(e,"html_tree_used_by_open",{name:o.name});return o.kind==="page"?{openLabel:a,onOpen:n=>ga(e,n,ka(e,o.url))}:{openLabel:a,onOpen:n=>ya(e,{anchor:n,url:o.url,subtitle:o.name})}}const D=new Set;let Ft="",He=!1,Ct=null,ge=!0,X="",Pe=0,an="";const Ce=new Map,Be=new Set,At=new Map,rt=new Map;let K="",sn=!1,A=null,it=null,tt="",Ke="",lt=0,Dt=null,pe=[],_e=null,Ne=null,dt=null,ct=null,Bt=null,ie=!1,te=null,Ue=null,Ve=null,ht=null,ut=null,Nt=null,xe=null;function W(e){return e.getElementById(at)}function oi(e){$n(e,Gr,`
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
      ${yo("light")}
      /* How much of a row's own colour its pick takes: a wash, not a fill.
         The row mixes it in below — a mix written up here would read
         --sve-ht-c on the list, where no family is set. */
      --sve-ht-pick-mix: 11%;
      --sve-ht-pick-hover-mix: 18%;
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${yo("dark")}
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
       The tags look with the layers switch off: the one the tree opens in,
       after Etch's structure panel (6 Nov 2026). Every rule hangs off
       :not([data-sve-ht-layers]), so the layers look above (the tags rules
       plus its own) is exactly what it was.
       1. Every row is a card of its own, stepped in by its depth. Nothing
          is drawn around a parent's children but the step: one background,
          the row's (the owner's call; a box behind them as well was two).
       2. An empty div, section or list shows its room (the dashed slot an
          empty loop shows) one level in, and folds like a parent.
       3. The tag in its family's colour (Live Preview settings), as the icon
          is, then the name: the one given, else the first class, else none
          (HtmlTreeRow shownName). No list of classes.
       4. The picked row in the search field's grey; the arrow the layers
          look's chevron, at its size. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) {
      --sve-ht-gap: 0.25rem;
      --sve-ht-radius: 0.3125rem;
      --sve-ht-card: rgba(128,128,128,.07);
      --sve-ht-card-hover: rgba(128,128,128,.11);
      /* The search field's and the top buttons' own grey (HtmlTreePane.vue). */
      --sve-ht-card-pick: rgba(128,128,128,.14);
      font: 450 0.75rem/1.35 Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
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
    /* The level under main, only with a main row above to be under. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-frame-body][data-sve-ht-under-main] {
      --sve-ht-base: 1;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-indent] { display: none; }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] + [data-sve-ht-row],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-sec] {
      margin: 0 0 var(--sve-ht-gap) calc((var(--sve-ht-depth, 0) + var(--sve-ht-base, 0)) * var(--sve-ht-step));
      padding: 0.0625rem 0.375rem 0.0625rem var(--sve-ht-inset);
      min-height: 1.75rem;
      border-radius: var(--sve-ht-radius);
      background: var(--sve-ht-card);
      box-shadow: none;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row]:hover { background: var(--sve-ht-card-hover); }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-current],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-current]:hover {
      background: var(--sve-ht-card-pick);
      box-shadow: none;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-drop="before"]::before {
      top: calc(-0.5 * var(--sve-ht-gap) - 1px);
      left: 0.25rem;
      right: 0.25rem;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-drop="after"]::after {
      bottom: calc(-0.5 * var(--sve-ht-gap) - 1px);
      left: 0.25rem;
      right: 0.25rem;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-sec-uid][data-sve-ht-drop="before"]::before,
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-sec-uid][data-sve-ht-drop="after"]::after {
      left: calc(0.25rem + var(--sve-ht-base, 0) * var(--sve-ht-step));
    }
    /* The room inside an empty element: one level in, under its row. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-slot][data-sve-ht-id] {
      display: flex;
      align-items: center;
      margin: 0 0 var(--sve-ht-gap) calc((var(--sve-ht-depth, 0) + var(--sve-ht-base, 0)) * var(--sve-ht-step));
      min-height: 2.25rem;
      padding: 0 0.625rem;
      border-color: rgba(128,128,128,.4);
      border-radius: var(--sve-ht-radius);
      font-size: 0.6875rem;
      opacity: 1;
      color: color-mix(in srgb, currentColor 45%, transparent);
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-slot][data-sve-ht-id][data-sve-ht-over] {
      border-color: #93c5fd;
      border-style: solid;
      color: inherit;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-frame-slot] {
      margin-left: calc(var(--sve-ht-base, 0) * var(--sve-ht-step) + 0.75rem);
    }
    /* The arrow the layers look wears, at its size (the owner's call, 7 Nov). */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-twist] svg { width: 0.625rem; height: 0.625rem; }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-text] {
      font-family: inherit;
      font-size: 0.75rem;
      gap: 0.3125rem;
    }
    /* The tag in its family's colour, as the icon is: no chip, one face with
       the name. Still the button a double-click changes. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] [data-sve-ht-tag],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] [data-sve-ht-kind],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] [data-sve-ht-tag]:hover,
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-current] [data-sve-ht-tag],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-current] [data-sve-ht-kind] {
      flex: none;
      padding: 0;
      background: none;
      opacity: 1;
      color: var(--sve-ht-c);
      font: inherit;
      font-weight: 400;
      letter-spacing: 0;
    }
    /* Brackets on what is a tag: a tag row's, a shut section's, the frame's. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-tag]::before,
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-sec] [data-sve-ht-kind]::before,
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-frame] [data-sve-ht-kind]::before { content: '<'; }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-tag]::after,
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-sec] [data-sve-ht-kind]::after,
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-frame] [data-sve-ht-kind]::after { content: '>'; }
    /* The name, in the panel's own colour; an empty one takes no room. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] [data-sve-ht-name],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-depth="0"] [data-sve-ht-name],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] [data-sve-ht-rename] {
      flex: 0 1 auto;
      min-width: 0;
      opacity: 1;
      font-weight: inherit;
    }
  `)}function Z(){const e=y("dock:html");return typeof e=="string"?e:""}function Vt(e){return!!y("dock:is-open",e)}function $e(e,{save:o=!1,unlock:a=!1}={}){return vt()||y("dock:set-html",a?{html:e,unlock:!0}:e)!==!0?!1:(o&&y("dock:save-now"),!0)}function Lt(e){const o=y("dock:component-exit-state")||{};if(t.exitOpen=!!o.open,!o.open){t.onExit=null;return}t.exitName=o.name||"",t.exitLabel=v(e,"component_exit"),t.exitTitle=v(e,o.back?"component_exit_back":"component_exit_close"),t.onExit=()=>{y("dock:exit-component"),H(e)}}const qe=[];let Ht=!1;function Et(e,o){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(o,{timeout:2e3});return}e.setTimeout(o,200)}function ni(e,o){for(const a of o){const n=a.type;!n||Ce.has(n)||Be.has(n)||qe.includes(n)||qe.push(n)}Zt.htmlTreePrefetchArmed&&rn(e)}function ll(e){Zt.htmlTreePrefetchArmed=!0,rn(e)}function rn(e){if(Ht||!qe.length)return;Ht=!0;const o=()=>{const a=qe.shift();if(!a){Ht=!1;return}if(Ce.has(a)||Be.has(a)){Et(e,o);return}Be.add(a),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(a)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{if(typeof n?.html=="string"){Ce.set(a,n.html);const s=rt.get(a);rt.delete(a),s&&s!==ln(e,a)&&H(e)}}).catch(()=>{}).finally(()=>{Be.delete(a),Et(e,o)})};Et(e,o)}function vt(){return!!K}function ln(e,o){return dn(o)||Vn(e,o)||"section"}function dn(e){const o=Ce.get(e);if(!o)return"";const a=At.get(e);if(a&&a.html===o)return a.tag;const n=so(Xe(o))?.tag||"";return At.set(e,{html:o,tag:n}),n}function Ze(e,o){const a=Ye(e)||"page_sections",n=[];for(const s of Xt(o)||[]){if(s.name===ha||s.name===Ca)continue;const d=Wt(s.values),i=d&&typeof d=="object"?d[a]:null;if(Array.isArray(i)){i.forEach(h=>{if(!h||typeof h!="object"||Array.isArray(h)||typeof h.type!="string")return;const m=[h._visual_id,h.id,h._id].filter(P=>typeof P=="string"&&P!=="");if(!m.length)return;const g=zo(e,h),L=typeof h._sve_label=="string"?h._sve_label.trim():"",b=ln(e,g);dn(g)||rt.set(g,b);const E=en(g)[`0:${b}`];n.push({uid:m[0],ids:m,type:g,tag:b,label:L||(typeof E=="string"&&E.trim()?E.trim():"")||pt(e,g)?.display||je(g)||g,svg:Zo(b,Lo(b),null).svg||Se.section,cat:Uo(b,Lo(b)),enabled:h.enabled!==!1,static:Yn(e,g)})});break}}return n}function ai(e,o,a){if(!a.length)return"";const n=y("dock:current-type")||"",s=y("dock:current-uid"),d=!!y("dock:component-exit-state")?.open;if(s){const i=We(s,o),h=a.find(m=>m.ids.some(g=>i.includes(g)));if(h&&(d||h.type===n))return h.uid}return a.find(i=>i.type===n)?.uid||""}function si(e,o,a){const n=y("dock:component-exit-state");if(n?.open)return je(n.name)||n.name||"";if(a)return o.find(d=>d.uid===a)?.label||"";const s=y("dock:current-type")||"";return String(s).startsWith("view:")?"":pt(e,s)?.display||je(s)||""}function gt(e,o,a,n,s){const d=a.find(i=>i.uid===n);d&&n!==s&&(D.clear(),A=null,ge=!1,V(),Qe(),y("build:reveal",{ids:d.ids}),X=n,an=Z(),K=Ce.get(d.type)||"",K&&(A=Kt(Xe(K))||null),sn=(y("dock:current-type")||"")===d.type,e.clearTimeout(Pe),Pe=e.setTimeout(()=>{X="",He=!1,H(e)},4e3),H(e),pa(e,d.uid,"tree"),ke({source:Q,type:N.SVE_ACTIVATE,ids:d.ids},e),e.setTimeout(()=>H(e),0))}function jt(e,o){if(!o)return!1;for(const a of e||[])if(a.id===o||jt(a.children,o))return!0;return!1}function Kt(e){return so(e)?.id||""}function so(e){for(const o of e||[]){if(cn(o))return o;const a=so(o.children);if(a)return a}return null}function cn(e){return!e.kind||e.kind==="component"}function Lo(e){return e==="component"?"component":""}function ri(e,o){const a=o===0||e.path===Ke;return D.has(e.path)?a:!a}function ii(e){const o=new Set,a=Gt(),n=(s,d)=>{for(const i of s)(i.children.length?ri(i,d):a&&(i.kind==="antlers"||i.hollow)&&D.has(i.path))&&o.add(i.id),n(i.children,d+1)};return n(e,0),o}function H(e){const o=e.document,n=W(o)?.querySelector("[data-sve-html-tree-list]");if(!n)return;oi(o),Ma(e);const s=Z();K&&K===s&&(K=""),y("dock:chrome-kind")&&(K="");const d=K||s,i=Xe(d,ao(e));pe=i,Ke="";const h=y("dock:current-type")||"",m=en(h),g=An(e,o);g&&Qr(e);const b=!!(y("dock:component-exit-state")||{}).open;h&&s&&!K&&Ce.set(h,s);const E=Ze(e,o);ni(e,E);const P=ai(e,o,E);if(Zr(e,g,b)){const c=nt(e);pe=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!1,t.layoutFile=!1,t.emptyFile=!1,t.sectionsMissing=[],t.ownFile=null,t.newSectionToo=!1,t.sectionsInLoop="",t.usedBy=null,t.emptyText="",t.pageTemplate?.entry!==c&&(t.pageTemplate=Jr(e,c)),t.onRefresh=()=>H(e),t.onSection=null,Lt(e),De(n,_t),Mt(e,[]);return}t.pageTemplate=null,ei(e,String(y("dock:collection-view")||""));const oe=String(y("dock:chrome-kind")||"");if(ra(e),g&&!E.length&&!oe){pe=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,t.layoutFile=!1,t.emptyFile=!1,t.sectionsMissing=[],t.ownFile=null,t.newSectionToo=!1,t.sectionsInLoop="",t.emptyText=v(e,"html_tree_page_empty"),t.canEdit=!y("dock:is-locked"),t.look=bo(e),t.onRefresh=()=>H(e),t.onSection=null,Lt(e),De(n,_t),Mt(e,[]);return}t.pageBuilder=g;const C=`${h}|${P}`;let M=!1;C!==Ft&&(Ft=C,D.clear(),Ct!==null&&d!==Ct?M=!0:He=d),(M||He!==!1&&d!==He)&&(He=!1,D.clear(),A=Kt(i)||null),Ct=d,X&&(X===P||!E.length)&&(sn||d!==an)&&(e.clearTimeout(Pe),X="",He=!1,jt(i,A)||(D.clear(),A=Kt(i)||null));const x=E.some(c=>c.uid===X)?X:"",$=ge?"":x||P,G=!!(x||P),U=G||b?"":String(y("dock:chrome-kind")||"");U==="template"&&(t.pageBuilder=!1),t.newSectionToo=g&&U==="template"&&!b,t.lastSectionUid=E.length?E[E.length-1].uid:"";const l=g&&(!h&&!G||U==="main"&&y("dock:on-empty-page")===!0),f=l||U==="template"?"":U;t.layoutFile=f==="main",f!=="main"&&(tt="");const O=f==="main"?Ho(i,"main"):null,le=O?ft(i,c=>c.tag==="body"&&jt(c.children,O.id)):null;Ke=le?le.path:"",O&&(ot((le||O).path),tt!==C&&(ot(O.path),D.add(O.path)));const q=f==="header"||f==="footer"?ft(i,c=>d.slice(c.from,c.openTo).includes(`data-sve-chrome="${f}"`)):null,ye=q||(f==="header"||f==="footer"?Ho(i,f):null);ye&&ot(ye.path);const B=l||!(f==="main"?!!O:f==="header"||f==="footer"?!!ye:!0)?[]:ia(i,t.query?new Set:ii(i));t.emptyFile=!d.trim()&&U==="template"&&Vt(o),t.sectionsMissing=U==="template"?Co(i):[],t.sectionsMissingText=v(e,"html_tree_sections_missing"),t.sectionsAddText=v(e,"html_tree_sections_add_here"),t.onAddSections=c=>{const T=Fo(e,`sections:${c}`,null,v(e,"html_tree_sections_slot"));T!==null&&(t.selectFrom={at:T,left:4})},!d.trim()&&!Vt(o)?t.emptyText=v(e,"html_tree_need_dock"):t.emptyFile?t.emptyText=v(e,"html_tree_page_no_html"):t.emptyText=v(e,"html_tree_empty"),t.slotText=v(e,"antlers_drop_here"),t.dataTitle=v(e,"data_vars_title"),t.pageTitle=v(e,"component_props_page"),t.renameTitle=v(e,"html_tree_rename"),t.tagTitle=v(e,"tw_tag"),t.hideTitle=v(e,"html_tree_hide"),t.showTitle=v(e,"html_tree_show"),t.sectionHideTitle=v(e,"html_tree_section_hide"),t.sectionShowTitle=v(e,"html_tree_section_show"),t.moreTitle=v(e,"html_tree_more"),t.duplicateTitle=v(e,"html_tree_duplicate"),t.deleteTitle=v(e,"html_tree_delete"),t.videoHoldTitle=v(e,"html_tree_video_hold"),t.videoPlayTitle=v(e,"html_tree_video_play"),t.alpineTitle=v(e,"html_tree_alpine_state"),t.lockedTitle=v(e,"html_tree_locked"),t.searchEmpty=v(e,"html_tree_search_empty"),t.canEdit=!y("dock:is-locked"),t.look=bo(e),t.onQuery=()=>H(e),Lt(e),t.inComponent=b,t.onSelect=(c,T)=>{const S=B.find(ne=>ne.id===c);if(S&&Go(e,S.path))return;T&&!Xa()&&(t.rowClicks+=1);const ae=!!T&&S?.kind==="antlers"&&!ie&&la(e);Ie(e,c,B),T&&S&&!ie&&!vt()&&y("build:reveal",{path:S.path,section:!!S.sectionRoot}),ae&&os(e,{path:S.path,at:T,beside:W(e.document)})},t.onTwist=c=>{const T=B.find(S=>S.id===c)?.path;T&&(D.has(T)?D.delete(T):D.add(T),H(e))},t.onTagChange=(c,T)=>{const S=t.rows.find(ae=>ae.id===T);S&&!vt()&&!ro(e,S)&&Ia(e,c.currentTarget,S)},t.onRename=c=>mi(e,c),t.onRenameCommit=()=>Eo(e,!0),t.onRenameCancel=()=>Eo(e,!1),t.onHide=c=>bi(e,c),t.onLock=c=>vn(e,c),t.onMore=(c,T)=>Si(e,c,T),t.canUnlock=un(e),t.lockTitle=v(e,"html_tree_lock"),t.unlockTitle=v(e,"html_tree_unlock"),t.lockedByTitle=v(e,"html_tree_locked_by_developer"),t.onVideoHold=c=>gi(e,c),t.onAlpineState=(c,T)=>yi(e,c,T),t.onDuplicate=c=>Ti(e,c),t.onDelete=c=>wi(e,c),t.onPointerDown=(c,T)=>Li(e,c,T),t.onSectionPointerDown=(c,T)=>Ii(e,c,T),t.onSectionHover=c=>e.dispatchEvent(new e.CustomEvent("sve-lite-hover",{detail:{uid:c}})),t.onContext=(c,T)=>kn(e,c,T),t.onInspectCommit=c=>Bi(e,c),t.onPropValue=(c,T,S)=>Ro(e,c,T,S),t.onPropPage=(c,T)=>Wr(e,c,S=>Ro(e,T,S,!1)),t.onLoopKind=c=>Ni(e,c),t.onAddBranch=c=>Vi(e,c),t.onLoopSortField=c=>{const T=mt();if(!T)return;const S=xe?.id===T.id?xe.dir:"";xe=null,re(e,rs(T,c,S))},t.onLoopSortDir=c=>{const T=mt();if(!T)return;const S=is(T,c);if(S.draft){xe={id:T.id,dir:S.draft},zt(e,T);return}xe=null,re(e,S.edit)},t.onLoopDepth=c=>re(e,cs(c)),t.onLoopIncludeHome=c=>re(e,hs(c)),t.onLoopLimit=c=>re(e,us(c)),t.onLoopOffset=c=>re(e,vs(c)),t.onPropHost=c=>c?Y.mount(c):Y.unmount(),t.onInspectData=(c,T)=>{y("dock:data-menu",{anchor:c,at:B.find(S=>S.id===A)?.from,onPick:S=>T(String(S?.var||"").trim())})};const yt=B.find(cn)?.id,Je=b?"":si(e,E,$),de=$&&!b?E.find(c=>c.uid===$):null;t.nameAt=(c,T)=>{if(T!==d||!c)return"";const S=ve=>{for(const fe of ve||[]){if(fe.path===c)return fe;const me=c.startsWith(`${fe.path}/`)?S(fe.children):null;if(me)return me}return null},ae=t.rows.find(ve=>ve.path===c&&!ve.kind);if(ae)return ae.name;const ne=S(i);if(!ne)return"";const ue=ne.id===yt,et=ue&&Je?Je:ne.klass;return ue&&de?et:wo(et,ne.path,m)};const _n=jo(e,String(y("dock:current-type")||""));let Sn=0;const Pn=ki(q?[q]:i,d),Cn=Ko(e,String(h)),ce=f==="header"||f==="footer"?f:"",Le=ye?ye.id:"",be=O&&B.find(c=>c.id===O.id)||null,uo=le&&B.find(c=>c.id===le.id)||null,he=uo||be||Le&&B.find(c=>c.id===Le)||null,vo=he?ui(B,he):-1;if(he&&!B.slice(B.indexOf(he),vo).some(c=>c.id===A)&&(A=he.id),t.selectFrom){const c=B.find(T=>T.from===t.selectFrom.at&&(!T.kind||T.kind==="sections"));c?(A=c.id,t.selectFrom=null):--t.selectFrom.left<=0&&(t.selectFrom=null)}const fo=t.layoutFile?hi(e):null;t.rows=B.map(c=>{const T=fo&&c.kind==="component"&&fo.get(c.src)||"",S=c.tag==="body"&&!c.kind,ae=T?{svg:Se[T]}:Zo(c.tag,c.kind,c.antlers),ne=c.tag==="video"&&!c.kind?Sn++:-1,ue=Pn.get(c.id),et=ue?Cn[ue.nth]||{}:{},ve=ue?ue.booleans.map(({key:Fe,value:mo})=>({key:Fe,file:mo,value:et[Fe]??mo})):[],fe=c.id===yt&&Je?Je:c.klass,me=c.id===yt;return{...c,tag:T||c.tag,frameCall:T,fixed:!!T||S,base:fe,name:T?v(e,`html_tree_frame_${T}`):ce&&c.id===Le?v(e,`html_tree_frame_${ce}`):c===be?v(e,"html_tree_frame_main"):me&&de?fe:wo(fe,c.path,m),current:c.id===A,letter:ae.letter||"",svg:ce&&c.id===Le?Se[ce]:c===be?Se.main:me&&de?de.svg:ae.svg||"",frame:ce&&c.id===Le?ce:c===be?"main":"",cat:ce&&c.id===Le?ce:c===be||S?"main":T||Uo(c.tag,c.kind,c.antlers),componentRoot:me&&b,sectionRoot:me&&de?de.uid:"",sectionOff:!!(me&&de&&!de.enabled),videoNth:ne,videoHeld:ne>=0&&_n.has(ne),alpineNth:ve.length?ue.nth:-1,alpineKeys:ve,alpineSet:ve.some(Fe=>Fe.value!==Fe.file)}}),da(e),ca(e);const bt=[];for(const c of t.rows)bt.length=c.depth,c.guides=bt.slice(),bt[c.depth]=c.cat;if(he){const c=B.indexOf(he),T=he.depth;t.rows=t.rows.slice(c,vo).map(S=>({...S,depth:S.depth-T,guides:S.guides.slice(T)})),be&&tt!==C&&(tt=C,e.setTimeout(()=>Ie(e,be.id,B),0))}const Tt=g&&!b&&U==="template"&&Ye(e)||"",xt=Tt&&Co(i,[Tt]).length===0?Tt:"";t.sectionsInLoop=xt,t.sections=g&&!b&&(G||f||l||xt)?E.map(c=>{const T=!!$&&c.uid===$;return{...c,current:T,ready:T&&(!x||!!K),row:{id:`sec:${c.uid}`,section:c.uid,tag:c.tag,name:c.label,kind:"",svg:c.svg,cat:c.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:T,hidden:!c.enabled}}}):[],t.frame=di(e,E,G,b,f,!1,!!uo),t.ownFile=ci(e,t.sections.length>0&&!xt),t.frameEmptyText=v(e,"html_tree_frame_no_sections"),li(e,f),t.onSection=c=>{ie||(Ut(e),gt(e,o,E,c,$))},t.onRefresh=()=>H(e),zt(e,t.rows.find(c=>c.id===A)),De(n,_t),Mt(e,i)}function li(e,o){t.frameOpenTitle=v(e,"html_tree_frame_open"),t.frameMainTitle=v(e,"html_tree_frame_main_open"),t.frameTemplateTitle=v(e,"html_tree_frame_template_open"),t.frameFieldsTitle=v(e,"html_tree_frame_fields"),t.onFrame=a=>{o===a?vi(e,a):qt(e,a)},t.onFrameEnter=a=>qt(e,a),t.onFrameFields=a=>Wn(e,fa(e,a),v(e,`html_tree_frame_${a}`)),t.onFrameTwist=()=>{t.mainShut=!t.mainShut}}function di(e,o,a,n,s,d=!1,i=!1){if(!s&&!d||i)return null;const h=L=>({id:`frame:${L}`,frame:L,synthetic:!0,tag:L,name:v(e,`html_tree_frame_${L}`),kind:"",svg:Se[L]||"",cat:L,letter:"",depth:0,hasChildren:L==="main"&&(o.length>0||s==="template"),shut:L!=="main",current:!1,hidden:!1}),m={kind:s,header:h("header"),main:h("main"),footer:h("footer"),template:null},g=s&&s!=="template"?String(y("dock:collection-view")||""):"";return g&&(m.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:pt(e,g)?.display||je(g.replace(/^view:/,"")),kind:"",svg:Se.section||"",cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),m}function ci(e,o){return!o||!Ge(e)?null:{id:"frame:own",frame:"template",synthetic:!0,tag:"template",name:v(e,"html_tree_own_file"),kind:"",svg:Se.section||"",cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}}function Ho(e,o){return ft(e,a=>a.tag===o)}function ft(e,o){for(const a of e||[]){if(!a.kind&&o(a))return a;const n=ft(a.children,o);if(n)return n}return null}function hi(e){const o=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},a=new Map;for(const n of["header","footer"]){const s=$a(o[n]?.type);s&&a.set(s,n)}return a}function ui(e,o){let a=e.indexOf(o)+1;for(;a<e.length&&e[a].depth>o.depth;)a+=1;return a}function vi(e,o){const a=Wo(e);(o==="main"||o==="template"?a?.querySelector("main"):a?.querySelector(`[data-sve-chrome="${o}"]`))?.scrollIntoView({behavior:Sa(),block:"start"})}function Ut(e){const o=String(y("dock:chrome-open",e.document)||"");return o!=="header"&&o!=="footer"?!1:(ma(e),ke({source:Q,type:N.SVE_FORCE_EXIT_CHROME},e),!0)}function fi(e){e.clearTimeout(Pe),X="",K="",D.clear(),A=null,ge=!1,V(),Qe()}function qt(e,o){if(e.document,String(y("dock:chrome-kind")||"")===o)return;if(fi(e),o==="main"){Ut(e),y("dock:open-file",La);return}if(o==="template"){const d=String(y("dock:collection-view")||""),i=d||Ge(e);i&&(Ut(e),y("dock:open-file",i),d||xa(e,"tree"));return}if(o!=="header"&&o!=="footer")return;const a=Wo(e)?.querySelector(`[data-sve-chrome="${o}"]`);a?(a.scrollIntoView({block:"nearest"}),a.dispatchEvent(new a.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:Q,type:N.OPEN_CHROME,kind:o},e.location.origin);const n=Date.now(),s=async()=>{if(String(y("dock:chrome-kind")||"")!==o){Date.now()-n<3e4&&e.setTimeout(s,250);return}await(y("dock:load-settled")||null),wn(e)};e.setTimeout(s,250)}function Mt(e,o){W(e.document)&&hn(e,o)}function hn(e,o){const a=nn(o),n=!!y("dock:component-src"),s=n?"":y("dock:current-uid")||"";ke({source:Q,type:N.SVE_HTML_PICK,on:!0,uid:s,uids:s?We(s,e.document):[],all:n,tag:a?.tag||"",klass:a?.klass||"",nodes:ss(o)},e)}function ot(e){if(!e)return;const o=(a,n)=>{for(const s of a||[]){if(s.path===e)return!0;if(o(s.children,n+1))return n===0||s.path===Ke?D.delete(s.path):D.add(s.path),!0}return!1};o(pe,0)}function mi(e,o){if(ie)return;const a=t.rows.find(n=>n.id===o);ro(e,a)||!a||a.kind||(A=o,t.rows.forEach(n=>{n.current=n.id===o}),t.editingId=o,t.draft=a.name,e.setTimeout(()=>{const n=W(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function Eo(e,o){const a=t.editingId;if(!a)return;const n=t.rows.find(s=>s.id===a);t.editingId=null,o&&n&&(n.sectionRoot?pi(e,n.sectionRoot,t.draft):ns(y("dock:current-type")||"",n.path,t.draft,n.base||n.klass)),t.draft="",H(e)}function pi(e,o,a){const n=Ye(e)||"page_sections",s=String(a||"").replace(/\s+/g," ").trim();for(const d of Xt(e.document)||[]){const i=Wt(d.values),h=i&&typeof i=="object"?i[n]:null;if(!Array.isArray(h))continue;const m=h.findIndex(E=>E&&typeof E=="object"&&[E._visual_id,E.id,E._id].includes(o));if(m===-1)continue;const g=zo(e,h[m]),L=pt(e,g)?.display||je(g)||g,b=JSON.parse(JSON.stringify(h));return b[m]={...b[m]},!s||s===L?delete b[m]._sve_label:b[m]._sve_label=s,d.setFieldValue(n,b),!0}return!1}function gi(e,o){const a=t.rows.find(h=>h.id===o);if(!a||!(a.videoNth>=0))return;const n=String(y("dock:current-type")||""),s=jo(e,n),d=!s.has(a.videoNth);d?s.add(a.videoNth):s.delete(a.videoNth);const i=String(y("dock:current-uid")||"");va(e,n,s),ke({source:Q,type:N.SVE_VIDEO_HOLD,uid:i,uids:i?We(i,e.document):[],nth:a.videoNth,on:d},e),H(e)}function ki(e,o){const a=new Map;let n=0;const s=d=>{for(const i of d){if(i.hidden)continue;const h=i.kind?null:ps(o.slice(i.from,i.openTo));h!==null&&a.set(i.id,{nth:n++,booleans:ks(h)}),s(i.children||[])}};return s(e),a}function yi(e,o,a){const n=t.rows.find(d=>d.id===a);if(!n||!(n.alpineNth>=0))return;if(n.alpineKeys.length===1){Mo(e,n,n.alpineKeys[0]);return}const s=o.currentTarget.getBoundingClientRect();V(),te=Oe(e.document,Re,{items:n.alpineKeys.map(d=>({label:d.key,icon:d.value?mn:pn,onPick:()=>{V(),Mo(e,n,d)}})),x:Math.round(s.left),y:Math.round(s.bottom+4),onClose:()=>{te=null}})}function Mo(e,o,a){const n=String(y("dock:current-type")||""),s=Ko(e,n),d=!a.value,i=d!==a.file,h={...s[o.alpineNth]||{}};i?h[a.key]=d:delete h[a.key],Object.keys(h).length?s[o.alpineNth]=h:delete s[o.alpineNth];const m=ba(String(y("dock:chrome-kind")||"")),g=m?"":String(y("dock:current-uid")||"");Ta(e,n,s),ke({source:Q,type:N.SVE_ALPINE_STATE,uid:g,uids:g?We(g,e.document):[],chrome:m,nth:o.alpineNth,key:a.key,value:d,on:i},e),H(e)}function ro(e,o){return!o||!(o.locked||o.lockedIn)?!1:(e.Statamic?.$toast?.error(v(e,"html_tree_locked_element")),!0)}function un(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function vn(e,o){const a=t.rows.find(n=>n.id===o);if(!(!a||a.lockedIn||y("dock:is-locked"))){if(!a.locked){Me(e,o,Wa,{lockAction:!0});return}if(!un(e)){e.Statamic?.$toast?.error(v(e,"html_tree_unlock_denied"));return}Jt(e,{titleKey:"html_tree_unlock_title",bodyKey:"html_tree_unlock_body",confirmKey:"html_tree_unlock_confirm"},()=>Me(e,o,Ga,{lockAction:!0,unlock:!0}))}}function io(e){return!!t.rows.find(o=>o.id===e)?.fixed}function lo(e){const o=t.sections?.find(n=>n.row?.id===e);if(o)return o;const a=t.rows.find(n=>n.id===e)?.sectionRoot;return a&&t.sections?.find(n=>n.uid===a)||null}function bi(e,o){if(io(o))return;const a=lo(o),n=t.rows.find(s=>s.id===o);if(a&&!(n?.hidden&&n.wrapFrom!=null)){e.postMessage({source:Q,type:N.HIDE_ROW,uid:a.uid,show:!a.enabled},e.location.origin),e.setTimeout(()=>H(e),60);return}Me(e,o,Za)}function Ti(e,o){if(io(o))return;const a=lo(o)?.uid;if(a){e.postMessage({source:Q,type:N.DUPLICATE_ROW,uid:a},e.location.origin);return}Me(e,o,Qa)}function fn(e,o){Jt(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const a=e.document;Pa({uid:o},a,e)})}function xi(e,o,a){X===a&&(e.clearTimeout(Pe),X="",K=""),A=null,ge=!1,Ft="";const n=Ze(e,o),s=n.find(d=>d.uid!==a)||n[0];s?gt(e,o,n,s.uid,""):(K="",t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,H(e)),e.setTimeout(()=>{W(e.document)&&H(e)},0)}qo("row:removed",({uid:e,parentPath:o,doc:a,win:n})=>{o!==Ye(n)||!W(n.document)||xi(n,a,e)});function wi(e,o){if(io(o))return;const a=t.sections?.find(s=>s.row?.id===o),n=a?a.row?.section||a.uid:t.rows.find(s=>s.id===o)?.sectionRoot;if(n){fn(e,n);return}if(t.rows.find(s=>s.id===o)?.kind==="sections"){Jt(e,{titleKey:"html_tree_sections_remove_title",bodyKey:"html_tree_sections_remove_body",confirmKey:"html_tree_sections_remove_confirm"},()=>Me(e,o,xo));return}Me(e,o,xo)}function Me(e,o,a,{lockAction:n=!1,unlock:s=!1}={}){if(y("dock:is-locked"))return;const d=Z(),i=t.rows.find(m=>m.id===o);if(!i||!n&&ro(e,i))return;const h=a(d,i);h!==d&&$e(h,{unlock:s})}let ze=null;function co(){ze?.closest("[data-sve-ht-row]")?.removeAttribute("data-sve-ht-more-open"),ze=null}function V(){te?.dismiss(),te=null,co()}const mn='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',pn='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>',Te=e=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${e}</svg>`,we={up:Te('<path d="M12 19V5M6 11l6-6 6 6"/>'),down:Te('<path d="M12 5v14M6 13l6 6 6-6"/>'),save:Te('<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/>'),add:Te('<path d="M12 5v14M5 12h14"/>'),fieldset:Te('<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/>'),lock:Te('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),unlock:Te('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-.9"/>')};function _i(e,o){const a=t.sections||[],n=a.findIndex(i=>i.uid===o.uid),s=(i,h={})=>()=>{V(),e.postMessage({source:Q,type:i,uid:o.uid,...h},e.location.origin),e.setTimeout(()=>H(e),60)},d=[{label:v(e,"move_up"),icon:we.up,onPick:n>0?s(N.MOVE,{direction:-1}):null},{label:v(e,"move_down"),icon:we.down,onPick:n>=0&&n<a.length-1?s(N.MOVE,{direction:1}):null},{label:v(e,"html_tree_save_section"),icon:we.save,onPick:s(N.SAVE_SECTION)},{label:v(e,"add_section_below"),icon:we.add,onPick:s(N.ADD_SET)}];if(Ao(e)&&o.type&&!o.static){const i=o.current&&!t.canEdit;d.push({label:v(e,"html_tree_fieldset"),icon:we.fieldset,onPick:i?null:()=>{V(),Do(e,o.type)}})}return d}function Io(e,o){const a=t.canEdit&&(!o.locked||t.canUnlock);return{label:o.locked?t.canUnlock?t.unlockTitle:t.lockedByTitle:t.lockTitle,icon:o.locked?we.unlock:we.lock,onPick:a?()=>{V(),vn(e,o.id)}:null}}function Si(e,o,a){if(!o.isConnected||te&&ze===o)return;const n=lo(a),s=t.rows.find(d=>d.id===a);if(!n){kn(e,null,a,{anchor:o,lead:s?[Io(e,s)]:[]});return}V(),ze=o,o.closest("[data-sve-ht-row]")?.setAttribute("data-sve-ht-more-open",""),te=Oe(e.document,Re,{items:[..._i(e,n),...s?[Io(e,s)]:[]],x:0,y:0,anchor:o,onClose:()=>{te=null,co()}})}function gn(e,o){const a=t.sections?.find(m=>m.uid===o),n=a?.type||"";if(!n||!$o(e))return[];const s=a.label||n,d=Xn(e,n),i=()=>e.Statamic?.$toast?.error(v(e,"section_update_failed")),h=[{label:v(e,"static_section_insertable"),icon:d?pn:mn,onPick:()=>{V(),go(e,{handle:n,hidden:!d}).then(()=>{e.Statamic?.$toast?.success(v(e,d?"section_shown_to_editors":"section_hidden_from_editors",{name:s})),ko(e)}).catch(i)}}];return a.static&&h.push({label:v(e,"section_add_fields"),onPick:()=>{V(),go(e,{handle:n,fields:!0}).then(()=>{e.Statamic?.$toast?.success(v(e,"section_fields_added",{name:s})),ko(e),H(e),Do(e,n)}).catch(i)}}),h}function Pi(e,o,a){const n=a.row?.section||a.uid;n&&(te=Oe(e.document,Re,{items:[...gn(e,n),{label:v(e,"html_tree_remove_section"),danger:!0,onPick:()=>{V(),fn(e,n)}}],x:o.clientX,y:o.clientY,onClose:()=>{te=null}}))}function kn(e,o,a,{anchor:n=null,lead:s=[]}={}){V();const d=t.sections?.find(g=>g.row?.id===a);if(d){Pi(e,o,d);return}const i=t.rows.find(g=>g.id===a);if(!i)return;n||Ie(e,a,t.rows);const h=n?{x:0,y:0}:{x:o.clientX,y:o.clientY},m=g=>{const L=[...s,...g.map(b=>n&&b.onPick?{...b,onPick:()=>{Ie(e,a,t.rows),b.onPick()}}:b)];L.length&&(te?.dismiss(),n&&(ze=n,n.closest("[data-sve-ht-row]")?.setAttribute("data-sve-ht-more-open","")),te=Oe(e.document,Re,{items:L,x:h.x,y:h.y,anchor:n,onClose:()=>{te=null,co()}}))};if(i.frameCall){m([{label:v(e,"html_tree_frame_edit",{frame:v(e,`chrome_${i.frameCall}`)}),onPick:()=>{V(),qt(e,i.frameCall)}}]);return}if(i.kind==="component"){Ci(e,i,m);return}if(i.kind==="slot"||i.kind==="sections"||i.kind==="svg"||i.locked||i.lockedIn){m([]);return}if(!t.canEdit){m([]);return}if(i.componentRoot){m([]);return}m([...i.sectionRoot?gn(e,i.sectionRoot):[],{label:v(e,"component_make"),onPick:()=>{V(),Ra(e,i,{onDone:()=>H(e),onError:g=>{e.alert(g?.status===409?v(e,"component_exists"):v(e,"component_failed"))}})}}])}const Oo=(e,o)=>{V(),y("dock:open-template",o)};function Ci(e,o,a){if(!wa(o.src)){a([{label:v(e,"component_open_named",{name:_a(o.src)||o.src}),onPick:()=>Oo(e,`view:partials/${o.src}`)}]);return}a([{label:v(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(o.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const s=Array.isArray(n.items)?n.items:[];a(s.length?s.map(d=>({label:v(e,"component_open_named",{name:d.label}),onPick:()=>Oo(e,d.type)})):[{label:v(e,"component_none"),onPick:null}])}).catch(()=>a([{label:v(e,"component_none"),onPick:null}]))}function Li(e,o,a){if(o.button!==0||y("dock:is-locked")||t.editingId)return;const n=t.rows.find(i=>i.id===a);if(n&&(n.locked||n.lockedIn)||o.target?.closest?.("button, input"))return;Qe(),_e=a,Ne={x:o.clientX,y:o.clientY},dt=o.currentTarget,ct=o.pointerId;const s=i=>Hi(e,i),d=i=>Ei(e,i);Bt=()=>{e.document.removeEventListener("pointermove",s,!0),e.document.removeEventListener("pointerup",d,!0),e.document.removeEventListener("pointercancel",d,!0),Bt=null},e.document.addEventListener("pointermove",s,!0),e.document.addEventListener("pointerup",d,!0),e.document.addEventListener("pointercancel",d,!0)}function Hi(e,o){if(!_e||!Ne)return;const a=o.clientX-Ne.x,n=o.clientY-Ne.y;if(!t.dragging&&a*a+n*n<25)return;if(!t.dragging){t.dragging=!0;try{dt?.setPointerCapture?.(ct)}catch{}}o.preventDefault();const s=e.document.elementFromPoint(o.clientX,o.clientY),d=s?.closest?.("[data-sve-ht-slot]");if(d){const b=d.getAttribute("data-sve-ht-id");if(b&&b!==_e){t.dropId=b,t.dropPlace="inside";return}}const i=s?.closest?.("[data-sve-ht-row]"),h=i?.getAttribute("data-sve-ht-id");if(!h||h===_e){t.dropId=null,t.dropPlace=null;return}const m=t.rows.find(b=>b.id===h),g=t.rows.find(b=>b.id===_e);if(!m||m.lockedIn||g&&m.path.startsWith(`${g.path}/`)){t.dropId=null,t.dropPlace=null;return}const L=i.getBoundingClientRect();t.dropId=h,t.dropPlace=Ua(o.clientY-L.top,L.height,!Xo(m.tag)&&!Yo(m)&&!m.locked)}function Ei(e,o){const a=_e,n=t.dropId,s=t.dropPlace||"after",d=t.dragging;if(Qe(),d&&(ie=!0,e.setTimeout(()=>{ie=!1},0)),!d||y("dock:is-locked")||!a||!n||a===n)return;o?.preventDefault?.();const i=Z(),h=qa(i,pe,a,n,s);if(h!==i){const m=s==="inside"&&Gt()?Mi(e,i,h,a,n):null;$e(h)||m?.()}}function Mi(e,o,a,n,s){const d=To(pe,n),i=To(pe,s);if(!d||!i||i.children.length||!(i.kind==="antlers"||i.hollow))return null;const h=Ya(o,d),m=h.from<i.from?i.from-(h.to-h.from):i.from,g=(oe,C)=>{for(const M of oe){if(M.from===m&&M.tag===i.tag)return{node:M,depth:C};const x=g(M.children,C+1);if(x)return x}return null},L=g(Xe(a,ao(e)),0);if(!L)return null;const{path:b}=L.node,E=L.depth===0||b===Ke,P=D.has(b);return E?D.delete(b):D.add(b),()=>{P?D.add(b):D.delete(b)}}function Qe(){try{dt?.releasePointerCapture?.(ct)}catch{}Bt?.(),_e=null,Ne=null,dt=null,ct=null,t.dragging=!1,t.dropId=null,t.dropPlace=null}function Ii(e,o,a){if(o.button!==0||!a||t.editingId||o.target?.closest?.("button, input"))return;yn(),Ue=a,Ve={x:o.clientX,y:o.clientY},ht=o.currentTarget,ut=o.pointerId;const n=d=>Oi(e,d),s=d=>Ri(e,d);Nt=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",s,!0),e.document.removeEventListener("pointercancel",s,!0),Nt=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",s,!0),e.document.addEventListener("pointercancel",s,!0)}function Oi(e,o){if(!Ue||!Ve)return;const a=o.clientX-Ve.x,n=o.clientY-Ve.y;if(!t.dragging&&a*a+n*n<25)return;if(!t.dragging){t.dragging=!0;try{ht?.setPointerCapture?.(ut)}catch{}}o.preventDefault();const d=e.document.elementFromPoint(o.clientX,o.clientY)?.closest?.("[data-sve-ht-sec-uid]"),i=d?.getAttribute("data-sve-ht-sec-uid")||"";if(!i||i===Ue){t.sectionDrop=null;return}const h=d.getBoundingClientRect();t.sectionDrop={uid:i,place:o.clientY-h.top<h.height/2?"before":"after"}}function Ri(e,o){const a=Ue,n=t.sectionDrop,s=t.dragging;yn(),s&&(ie=!0,e.setTimeout(()=>{ie=!1},0)),!(!s||!a||!n?.uid||n.uid===a)&&(o?.preventDefault?.(),$i(e,a,n.uid,n.place))}function yn(){try{ht?.releasePointerCapture?.(ut)}catch{}Nt?.(),Ue=null,Ve=null,ht=null,ut=null,t.dragging=!1,t.sectionDrop=null}function $i(e,o,a,n){const s=Ye(e)||"page_sections";for(const d of Xt(e.document)||[]){const i=Wt(d.values),h=i&&typeof i=="object"?i[s]:null;if(!Array.isArray(h))continue;const m=E=>h.findIndex(P=>P&&typeof P=="object"&&[P._visual_id,P.id,P._id].includes(E)),g=m(o),L=m(a);if(g===-1||L===-1||g===L)return!1;let b=n==="before"?L:L+1;return g<b&&(b-=1),b===g?!1:(e.postMessage({source:Q,type:N.MOVE,uid:o,toIndex:b},e.location.origin),e.setTimeout(()=>H(e),60),!0)}return!1}function zt(e,o){if(o?.kind==="component"){Fi(e,o);return}if(ee.callOpen&&(ee.callOpen=!1,ee.callStore=null,Y.forget(),oo(e)),o?.kind!=="antlers"){t.inspect=null;return}const a=o.id,n={logic:!0,path:o.path};if(o.tag==="else"){t.inspect={key:a,...n,title:v(e,"antlers_condition"),mode:"note",note:v(e,"antlers_else_note")};return}if(o.antlers==="loop"){t.inspect={...ds(e,o,{key:a,draft:xe?.id===o.id?xe.dir:""}),...n};return}t.inspect={key:a,...n,title:v(e,"antlers_condition"),mode:"condition",value:o.expr||"",placeholder:v(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:v(e,"antlers_add_elseif")},{id:"else",label:v(e,"antlers_add_else")}]}}function Fi(e,o){if(!Aa(e)){t.inspect=null;return}if(!o.src)return;const a=o.id;if(t.inspect={key:a,title:v(e,"component_props_values"),mode:"note",note:v(e,"code_dock_loading")},Da()){const n={},s={},d=new Map;for(const[i,h]of Ba(Z().slice(o.from,o.to))){const m=Na(i);m&&(i!==m||!d.has(m))&&d.set(m,h)}for(const[i,h]of d)h.bound?s[i]=h.value:n[i]=h.value;t.inspect=null,ee.callOpen=!0,ee.title=ee.title||v(e,"component_props"),ee.callTitle=o.klass||o.name||o.src,ee.callStore=Y.ui,Y.ui.canBind=!0,Y.ui.dataTitle=v(e,"data_vars_title"),Y.ui.exprPlaceholder=v(e,"component_props_expr"),Y.ui.onBox=(i,h)=>Di(e,i,h),Y.ui.onPickData=(i,h)=>y("dock:data-menu",{anchor:h,at:o.from,types:Va(Y.ui.fields.find(m=>m.handle===i)?.type),onPick:m=>bn(e,i,String(m?.var||"").trim())}),Y.load(e,{key:`${o.src}::${a}`,src:o.src,params:n,bindings:s,readOnly:y("dock:is-locked")===!0}),Y.watch(e,{src:o.src,write:i=>Ai(e,i,s)}),oo(e);return}ja(e,o.src).then(n=>{if(t.inspect?.key===a){if(!n.length){t.inspect={key:a,title:v(e,"component_props_values"),mode:"note",note:v(e,"component_props_values_none")};return}t.inspect={key:a,title:v(e,"component_props_values"),mode:"props",inheritLabel:v(e,"component_props_inherit"),rows:Ka(n,Z().slice(o.from,o.to))}}})}function Ai(e,o,a={}){const n=t.rows.find(i=>i.id===A);if(n?.kind!=="component"||y("dock:is-locked"))return;let s=Z(),d=n.to;for(const[i,h]of Object.entries(o||{})){if(i in a)continue;const m=s.length,g=no(s,{from:n.from,to:d},i,h);g!==s&&(d+=g.length-m,s=g)}s!==Z()&&($e(s,{save:!0}),H(e))}function bn(e,o,a){Tn(e,o,a,!0),H(e)}function Di(e,o,a){const n=za(a);if(n){bn(e,o,n);return}Y.forget(),Tn(e,o,String(a??"").trim(),!1),H(e)}function Tn(e,o,a,n){const s=t.rows.find(h=>h.id===A);if(s?.kind!=="component"||y("dock:is-locked"))return;const d=Z(),i=no(d,s,o,a,{bound:n});i!==d&&$e(i,{save:!0})}function mt(){const e=t.rows.find(o=>o.id===A);return e?.kind==="antlers"&&!y("dock:is-locked")?e:null}function re(e,o){const a=mt();if(!a)return;const n=Z(),s=o(n,a);s!==n&&($e(s),H(e))}function Ro(e,o,a,n){const s=t.rows.find(h=>h.id===A);if(s?.kind!=="component"||y("dock:is-locked"))return;const d=Z(),i=no(d,s,o,a,{bound:n});i!==d&&($e(i,{save:!0}),H(e))}function Bi(e,o){re(e,(a,n)=>n.antlers==="loop"?fs(n,o)(a,n):Ja(a,n,o))}function Ni(e,o){const a=mt();if(!a||a.antlers!=="loop")return;const n=ls(e,a,o);n&&re(e,n)}function Vi(e,o){re(e,(a,n)=>es(a,n,o))}function ji(e,o){if(!e||!o||Yo(o)||Xo(o.tag))return null;const a=Fa(e,o);if(a<o.openTo)return null;const n=e.lastIndexOf(`
`,a-1)+1;return e.slice(n,a).trim()===""&&n>o.openTo?n-1:a}function Ie(e,o,a,{reveal:n=!0}={}){if(ie)return;const s=(a||t.rows).find(d=>d.id===o);s&&(A=o,t.rows.forEach(d=>{d.current=d.id===o}),zt(e,s),!vt()&&(n&&(y("dock:reveal-html",{from:s.from,to:s.to,caret:ji(Z(),s)}),y("dock:tw-follow")),ke({source:Q,type:N.SVE_HTML_PICK_FOCUS,path:s.path,src:s.kind==="component"&&s.src||""},e)))}function Ki(e,o){if(!o)return"";const a=[],n=(s,d)=>{for(const i of s||[]){const h=d||i.path===e;i.kind==="component"&&i.src===o&&a.push({path:i.path,inside:h}),n(i.children,h)}};return n(pe,!1),(a.find(s=>s.inside)||a[0])?.path||""}function Ui(e,o,{reveal:a=!0}={}){if(!o||!W(e.document))return;ge=!1;const n=t.rows.find(d=>d.current);if(n&&n.path===o){Ie(e,n.id,t.rows,{reveal:a});return}H(e),ot(o),H(e);const s=t.rows.find(d=>d.path===o);s&&(Ie(e,s.id,t.rows,{reveal:a}),e.setTimeout(()=>{W(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function Yt(e){if(it)return;const o=()=>{t.editingId||t.dragging||(e.clearTimeout(lt),lt=e.setTimeout(()=>{W(e.document)&&H(e)},80))},a=()=>{if(o(),y("dock:on-empty-page")===!0){const n=Ze(e,e.document);n.length===1&&gt(e,e.document,n,n[0].uid,"")}};it=qo("dock:html-changed",o),e.document.addEventListener("sve-page-structure",a),Dt=()=>{e.document.removeEventListener("sve-page-structure",a)}}function qi(e){it?.(),it=null,Dt?.(),Dt=null,e?.clearTimeout?.(lt),lt=0}function ho(e){const o=W(e.document);if(ke({source:Q,type:N.SVE_HTML_PICK,on:!1},e),qi(e),Y.forget(),ee.callOpen=!1,ee.callStore=null,oo(e),Qe(),V(),Ea(e),A=null,t.inspect=null,t.editingId=null,t.draft="",t.sections=[],t.pageBuilder=!1,t.layoutFile=!1,X="",e?.clearTimeout?.(Pe),!o){Rt(e);return}o.remove(),Zt.headerTab==="html_tree"&&ta(e,null),oa(e),Bo(e),No(e),Rt(e)}const xn="button[title], button[data-tip], label[title]";function dl(e,o){o.querySelector("[data-sve-html-tree-list]")||(o.id=at,Vo(e,o,{only:xn}),De(o,tn,{title:v(e,"html_tree")}),o.querySelector("[data-sve-close]")?.addEventListener("click",()=>ho(e)))}function cl(e){Yt(e),H(e)}function wn(e){const o=e.document;if(!Fn(e,"html_tree"))return;if(W(o)){Yt(e),H(e);return}if(!Vt(o))return;ge=!0,D.clear(),na(e,[at]);const a=o.createElement("div");a.id=at,Vo(e,a,{only:xn}),a.style.cssText=aa,De(a,tn,{title:v(e,"html_tree")}),a.querySelector("[data-sve-close]")?.addEventListener("click",()=>ho(e)),sa(e,a),Bo(e),No(e),Rt(e),Yt(e),H(e)}function hl(e){if(W(e.document)){ho(e);return}wn(e)}eo("html-tree:open-section",e=>{const o=window,a=o.document,n=Ze(o,a),s=n.find(d=>d.uid===e||d.ids.includes(e));return s?(gt(o,a,n,s.uid,""),{uid:s.uid,ids:s.ids}):null});eo("html-tree:from-preview",({path:e,src:o,uid:a,reveal:n=!0}={})=>{if(!Go(window,e)){if(!e){zi(window,a);return}Ui(window,Ki(e,o)||e,{reveal:n})}});function zi(e,o){if(!o||!W(e.document))return;const a=Ze(e,e.document),n=We(o,e.document),s=a.find(d=>d.ids.some(i=>n.includes(i)));s&&(ge&&(ge=!1,D.clear(),A=null),X&&X!==s.uid&&(e.clearTimeout(Pe),X="",K=""),!y("dock:load-settled")&&H(e))}eo("html-tree:arm-pick",e=>{const o=window;return e?(hn(o,Xe(Z(),ao(o))),!0):(W(o.document)||ke({source:Q,type:N.SVE_HTML_PICK,on:!1},o),!0)});function ul(){Ce.clear(),Be.clear(),At.clear(),rt.clear(),qe.length=0}export{Gr as HTML_TREE_STYLE_ID,ll as armHtmlTreePrefetch,ul as clearHtmlTreeTemplates,V as closeHtmlTreeMenu,ho as closeHtmlTreePanel,oi as ensureHtmlTreeStyles,dl as fillHtmlTreePane,A as htmlTreeActiveId,W as htmlTreePanel,lt as htmlTreeTimer,it as htmlTreeUnhook,wn as openHtmlTreePanel,H as renderHtmlTree,cl as showHtmlTreePane,qi as stopWatchHtmlTreeDock,hl as toggleHtmlTreePanel,Yt as watchHtmlTreeDock};
