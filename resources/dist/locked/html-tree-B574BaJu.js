import{q as v,f as yn,o as m,c as k,a as $,t as L,u as i,e as bn,l as Tn,F as D,j as ne,g as C,w as _,Y as Ae,N as q,aa as xn,a2 as wn,ag as He,k as Ht,ae as _n,X as me,aE as Sn,v as lo,x as Cn,W as Pn,aF as Hn,ac as Co,aG as En,D as vt,m as jt,p as Kt,V as je,a8 as Mn,aH as Ln,aI as In}from"./addon-YmZVZwPJ.js";import{c as Po,a as Rn,o as On,b as $n,d as Dn,i as An,r as Fn,e as Bn,f as Nn,u as co,l as ho}from"./section-create-DWeukFl0.js";import{canEditFields as Ho,openGlobalFieldsOverlay as Vn,openFieldsetOverlay as Eo}from"./section-fields-Baxov-k5.js";import{U as t,V as jn,W as J,X as Kn,b,Y as Un,Z as qn,_ as zn,$ as Ut,s as qt,y as ke,j as Et,H as Yn,i as Xn,E as Mo,F as Lo,a0 as uo,a1 as Io,m as Fe,D as Wn,R as Gn,G as Zn,a2 as Ye,a3 as Qn,a4 as vo,a5 as Jn,a6 as ea,a7 as Ro,a8 as Oo,a9 as $o,aa as ta,ab as oa,o as Do,ac as na,ad as Ao,l as ft,ae as Xe,af as Fo,ag as aa,ah as zt,ai as sa,aj as ra,ak as ia,x as la,al as da,am as ca,an as ha,ao as Bo,ap as No,aq as ua,ar as va,as as Vo,at as fa,au as ma,av as pa,A as ga,aw as Yt}from"./lp-cluster-iHudfjCr.js";import{H as tt,u as ka,d as ya}from"./shortcuts-BIxtNjMb.js";import{_ as Xt,o as Ie}from"./ChoiceDialog-tNw_5vRS.js";import{M as B,S as G}from"./protocol-CfmvxZS7.js";import{C as ba,H as Re,s as Wt,c as Ta,a as xa,b as jo,t as wa,d as Ee,h as Ko,e as _a,f as Sa,w as Gt,g as Ca,i as Pa,j as Ha,p as Ea,r as Ma,k as La,l as Ia,m as Ra,v as Oa,n as $a,o as Da,q as Aa,u as fo,x as Fa,y as Ba,z as Na,A as Va,B as ja,D as Ka,E as mo,F as Ua,G as qa}from"./component-extract-CiFQtwIG.js";import{H as za,r as Uo,o as Ya,h as po,w as Xa}from"./logic-popup-Bx3fbMgV.js";import{T as Wa}from"./template-elements-4Giz_iEm.js";import{b as Ga}from"./html-pick-align-BNtmyz2s.js";import{l as Za,a as Qa,b as Ja,c as es,d as ts,e as os,f as ns,g as as,h as ss}from"./loop-inspector-bOBBotEP.js";import"./FieldsetOverlay-CJ_eloKH.js";import"./anim-still-4pEwKCsB.js";import"./help-styles-C893cLet.js";const yt=/\s*([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/y,rs=/^\s*(?:([A-Za-z_$][\w$]*)|'([^'\\]*)'|"([^"\\]*)")\s*:\s*(true|false)\s*$/;function is(e){const o=String(e||"").replace(/\{\{[\s\S]*?\}\}/g,s=>" ".repeat(s.length)),a=o.match(/^<[a-zA-Z][\w:-]*/);if(!a)return null;let n=a[0].length;for(;n<o.length;){yt.lastIndex=n;const s=yt.exec(o);if(!s){n+=1;continue}if(s[1].toLowerCase()==="x-data")return s[2]??s[3]??s[4]??"";n=yt.lastIndex}return null}function ls(e,o){const a=e[o];for(let n=o+1;n<e.length;n+=1)if(e[n]==="\\")n+=1;else if(e[n]===a)return n;return e.length-1}function ds(e){const o=String(e||""),a=o.search(/\S/);if(a===-1||o[a]!=="{")return[];const n=new Map;let s=0,l="";const r=()=>{const h=l.match(rs);h&&n.set(h[1]??h[2]??h[3],h[4]==="true"),l=""};for(let h=a;h<o.length;h+=1){const f=o[h];if(f==='"'||f==="'"||f==="`"){const g=ls(o,h);l+=o.slice(h,g+1),h=g;continue}if(f==="/"&&o[h+1]==="/"){const g=o.indexOf(`
`,h);h=g===-1?o.length:g-1;continue}if(f==="/"&&o[h+1]==="*"){const g=o.indexOf("*/",h+2);h=g===-1?o.length:g+1;continue}if(f==="{"||f==="["||f==="("){if(s+=1,s===1)continue}else if(f==="}"||f==="]"||f===")"){if(s-=1,s===0)break}else if(f===","&&s===1){r();continue}l+=f}return r(),[...n].map(([h,f])=>({key:h,value:f}))}const cs={class:"sve-html-tree"},hs={class:"sve-pane-bar","data-sve-pane-bar":""},us={"data-sve-right-title":""},vs={"data-sve-right-actions":""},fs=["aria-pressed","title","aria-label"],ms=["title"],ps={class:"sve-ht-used-by__label"},gs={class:"sve-ht-used-by__chips"},ks=["title","onClick"],ys={key:1,class:"sve-ht-used-by__chip"},bs={key:0,class:"sve-ht-used-by__empty"},Ts={class:"sve-ht-tools"},xs=["title"],ws=["placeholder","aria-label","value"],_s=["aria-label"],Ss=["title","aria-label"],Cs=["title","aria-label"],Ps={key:3,class:"sve-tree-exit"},Hs=["title"],Es=["title"],Ms='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',Ls='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',Is='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',Rs='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',Os='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/></svg>',$s='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',Ds={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const o=v(window,"html_tree_search");t.layers=jn(window);const a=v(window,"html_tree_layers_on"),n=v(window,"html_tree_layers_off");function s(){Kn(window,!t.layers)}const l=Po(window),r=v(window,"section_new"),h=v(window,"html_tree_add_element"),f=v(window,"html_tree_sections_slot"),g=v(window,"html_tree_sections_no_field");function P(){const M=t.templateSections.length?t.templateSections:[xn(window)],u=new Set(t.rows.filter(d=>d.kind==="sections").map(d=>d.tag));return M.filter(d=>!u.has(d)).map(d=>({tag:`sections:${d}`,label:M.length>1?`${f} · ${d}`:f,noField:!t.templateSections.length}))}const y=yn(!1),E=v(window,"section_import");function x(){y.value=!1}async function R(M){if(!M)return;await wn(),t.onRefresh?.();const u=b("html-tree:open-section",M);u&&Fn(window,u.ids)}function w(){const M=t.rows.find(u=>u.current&&!u.context&&!u.synthetic)||null;return M?.lockedIn?t.rows.filter(u=>u.locked&&u.from<=M.from&&u.to>=M.to).sort((u,d)=>u.from-d.from)[0]||null:M}function V(M){const u=M.getBoundingClientRect(),d=w();let p=null;const A=(F,$e,ie="")=>()=>{p?.dismiss(),p=null,x();const pt=An(window,F,d,$e);pt!==null&&(t.selectFrom={at:pt,left:4},ie&&window.Statamic?.$toast?.info?.(ie))};p=Ie(document,Re,{items:[...Wa.map(F=>({label:F,onPick:A(F,`<${F}>`)})),...P().map(F=>({label:F.label,onPick:A(F.tag,F.label,F.noField?g:"")}))],x:Math.round(u.left),y:Math.round(u.bottom+4),onClose:()=>{p=null,x()}})}function te(M){if(!y.value){if(y.value=!0,!(t.sections.length||t.pageBuilder)){V(M.currentTarget);return}(async()=>{const u=await Rn(window);if(!u){x();return}const d=t.sections.length?t.sections[t.sections.length-1].uid:null,p=A=>{x(),R(A?.uid)};if(u==="static"){On(window,{afterUid:d,onDone:p,onError:x,onClose:x});return}$n(window,{afterUid:d,onDone:p,onError:x,onClose:x})})()}}function Z(){if(y.value)return;y.value=!0;const M=!!(t.sections.length||t.pageBuilder);Dn(window,{intoTemplate:!M,after:M?null:w(),afterUid:M&&t.sections.length?t.sections[t.sections.length-1].uid:null,onDone:u=>{if(x(),M){R(u?.uid);return}Number.isInteger(u?.at)&&(t.selectFrom={at:u.at,left:4})},onError:x,onClose:x})}function j(M){const u=!!t.query;t.query=M,u!==!!M&&t.onQuery?.()}return(M,u)=>(m(),k("div",cs,[$("div",hs,[$("div",us,L(e.title),1),$("div",vs,[$("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":i(t).layers?"true":"false",title:i(t).layers?i(n):i(a),"aria-label":i(t).layers?i(n):i(a),innerHTML:Ms,onClick:s},null,8,fs),u[5]||(u[5]=bn('<button type="button" data-sve-right-pin aria-pressed="false" data-v-2763765f></button><button type="button" data-sve-close aria-label="Close" data-v-2763765f><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-2763765f><path d="M18 6 6 18" data-v-2763765f></path><path d="m6 6 12 12" data-v-2763765f></path></svg></button>',2))])]),i(t).usedBy?(m(),k("div",{key:0,class:"sve-ht-used-by",title:i(t).usedBy.hint||null},[$("span",ps,[$("span",{class:"sve-ht-used-by__icon","aria-hidden":"true",innerHTML:Os}),Tn(" "+L(i(t).usedBy.label),1)]),$("span",gs,[(m(!0),k(D,null,ne(i(t).usedBy.items,d=>(m(),k(D,{key:d.kind+":"+d.name},[d.onOpen?(m(),k("button",{key:0,type:"button",class:"sve-ht-used-by__chip sve-ht-used-by__chip--open",title:d.openLabel,onClick:p=>d.onOpen(p.currentTarget)},L(d.name),9,ks)):(m(),k("span",ys,L(d.name),1))],64))),128)),i(t).usedBy.empty?(m(),k("span",bs,L(i(t).usedBy.empty),1)):C("",!0)])],8,ms)):C("",!0),$("div",Ts,[$("label",{class:"sve-ht-search",title:i(o)},[$("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:Rs}),$("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:i(o),"aria-label":i(o),value:i(t).query,autocomplete:"off",spellcheck:"false",onInput:u[0]||(u[0]=d=>j(d.target.value)),onKeydown:[u[1]||(u[1]=_(()=>{},["stop"])),u[2]||(u[2]=Ae(_(d=>j(""),["prevent"]),["escape"]))]},null,40,ws),i(t).query?(m(),k("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":i(o),innerHTML:$s,onClick:u[3]||(u[3]=d=>j(""))},null,8,_s)):C("",!0)],8,xs),i(l)&&(i(t).sections.length||i(t).pageBuilder||i(t).rows.length&&!i(t).layoutFile)?(m(),k("button",{key:0,type:"button",class:"sve-ht-new",title:i(t).sections.length||i(t).pageBuilder?i(r):i(h),"aria-label":i(t).sections.length||i(t).pageBuilder?i(r):i(h),innerHTML:Ls,onClick:te},null,8,Ss)):C("",!0),i(l)&&(i(t).sections.length||i(t).pageBuilder||i(t).rows.length&&!i(t).layoutFile)?(m(),k("button",{key:1,type:"button",class:"sve-ht-import",title:i(E),"aria-label":i(E),innerHTML:Is,onClick:Z},null,8,Cs)):C("",!0)]),i(J).inSidebar?C("",!0):(m(),q(ba,{key:1})),u[6]||(u[6]=$("div",{"data-sve-html-tree-list":""},null,-1)),i(t).inspect?.logic?C("",!0):(m(),q(za,{key:2})),i(t).exitOpen&&!i(J).inSidebar?(m(),k("div",Ps,[$("span",{class:"sve-tree-exit__name",title:i(t).exitName},L(i(t).exitName),9,Hs),$("button",{type:"button",class:"sve-tree-exit__go",title:i(t).exitTitle,onClick:u[4]||(u[4]=d=>i(t).onExit?.())},L(i(t).exitLabel),9,Es)])):C("",!0)]))}},qo=Xt(Ds,[["__scopeId","data-v-2763765f"]]);function zo(e){return String(e||"").trim().toLowerCase()}function Mt(e,o){return o?[e.name,e.tag,e.klass,e.label,e.src].filter(a=>typeof a=="string"&&a).join(" ").toLowerCase().includes(o):!0}function As(e,o){const a=zo(o);if(!a)return{rows:e,hits:new Set};const n=new Set;for(const r of e)Mt(r,a)&&n.add(r.path);const s=[...n];return{rows:e.filter(r=>n.has(r.path)||s.some(h=>h.startsWith(`${r.path}/`))),hits:n}}const Fs=["title"],Bs={"data-sve-ht-indent":"","aria-hidden":"true"},Ns=["data-sve-ht-cat"],Vs={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},js={key:2,"data-sve-ht-letter":""},Ks=["innerHTML"],Us=["title"],qs=["title"],zs={key:1,"data-sve-ht-kind":""},Ys={key:3,"data-sve-ht-name":""},Xs={key:4,"data-sve-ht-actions":""},Ws=["data-on","title","innerHTML"],Gs=["title"],Zs={key:5,"data-sve-ht-actions":""},Qs=["data-on","title","innerHTML"],Js=["data-on","title","innerHTML"],er=["disabled","title"],tr=["disabled","title","innerHTML"],or=["disabled","title"],nr=["disabled","title"],ar=["aria-label"],sr=["data-sve-ht-id"],rr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',ir='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',lr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',dr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',cr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',hr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',ur='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',go='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6.5" width="20" height="11" rx="5.5"/><circle cx="7.5" cy="12" r="3" fill="currentColor" stroke="none"/></svg>',ko='<svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M7.5 5.5h9a6.5 6.5 0 0 1 0 13h-9a6.5 6.5 0 0 1 0-13ZM16.5 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6Z"/></svg>',vr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',fr='<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>',mr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',pr=120,gr={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const o=Ho(window);function a(u){return u.synthetic?u.frame==="main"?t.frameMainTitle:u.frame==="template"?t.frameTemplateTitle:t.frameOpenTitle:u.kind==="component"?u.src?`partial:${u.src}`:u.tag:u.name?`${u.tag} ${u.name}`:u.tag}function n(u){return!!u.section}function s(u){return!!u.frame}function l(u){return u.kind==="slot"}function r(u,d){s(d)||l(d)||(n(d)?t.onSectionPointerDown?.(u,d.section):d.sectionRoot?t.onSectionPointerDown?.(u,d.sectionRoot):t.onPointerDown?.(u,d.id))}function h(u,d){if(u.synthetic){t.onFrame?.(u.frame);return}if(n(u)){t.onSection?.(u.section);return}t.onSelect?.(u.id,d)}function f(u,d){const p={"data-sve-ht-id":u.id};return u.locked&&(p["data-sve-ht-locked"]=""),u.current&&(p["data-sve-ht-current"]=""),(u.hidden||u.sectionOff)&&(p["data-sve-ht-hidden"]=""),(u.videoNth>=0||u.alpineNth>=0)&&(p["data-sve-ht-special"]=""),p["data-sve-ht-cat"]=u.cat||"other",p["data-sve-ht-depth"]=String(u.depth),d&&(p["data-sve-ht-dim"]=""),n(u)&&(p["data-sve-ht-sec"]=""),s(u)&&(p["data-sve-ht-frame"]=u.frame),!n(u)&&t.dropId===u.id&&t.dropPlace&&(p["data-sve-ht-drop"]=t.dropPlace),p}function g(u){return!!u.fixed}function P(u){return u.kind==="sections"}function y(u){return!!(u.locked||u.lockedIn)}function E(u){return!u.lockedIn&&!g(u)}function x(u){return Z(u)||!g(u)&&!P(u)&&!y(u)&&(!u.hidden||u.wrapFrom!=null)}function R(u){if(!j(u))return t.lockedTitle;const d=u.hidden||u.sectionOff;return Z(u)?d?t.sectionShowTitle:t.sectionHideTitle:d?t.showTitle:t.hideTitle}let w=null;function V(u,d){window.clearTimeout(w),w=window.setTimeout(()=>t.onMore?.(u,d.id),pr)}function te(){window.clearTimeout(w)}function Z(u){return!!u.sectionRoot||!!u.section}function j(u){return t.canEdit&&!y(u)||Z(u)}function M(u){const d=u.name||"";return Ut()&&d.toLowerCase()===String(u.tag||"").toLowerCase()?"":d}return(u,d)=>(m(),k(D,null,[$("div",He({"data-sve-ht-row":""},f(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:d[43]||(d[43]=p=>h(e.row,p.currentTarget)),onDblclick:d[44]||(d[44]=_(p=>e.row.synthetic?i(t).onFrameEnter?.(e.row.frame):s(e.row)||l(e.row)||n(e.row)?null:i(t).onRename?.(e.row.id),["prevent"])),onKeydown:[d[45]||(d[45]=Ae(_(p=>h(e.row,p.currentTarget),["prevent"]),["enter"])),d[46]||(d[46]=Ae(_(p=>h(e.row,p.currentTarget),["prevent"]),["space"]))],onPointerdown:d[47]||(d[47]=p=>r(p,e.row)),onPointerenter:d[48]||(d[48]=p=>n(e.row)?i(t).onSectionHover?.(e.row.section):null),onContextmenu:d[49]||(d[49]=_(p=>s(e.row)||l(e.row)||n(e.row)?null:i(t).onContext?.(p,e.row.id),["prevent","stop"]))}),[$("span",Bs,[(m(!0),k(D,null,ne(e.row.guides||[],(p,A)=>(m(),k("i",{key:A,"data-sve-ht-cat":p},null,8,Ns))),128))]),e.row.hasChildren||i(Un)(e.row)?(m(),k("button",He({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?i(t).mainShut:i(qn)(e.row))?{"data-sve-ht-shut":""}:{},{innerHTML:ir,onClick:d[0]||(d[0]=_(p=>e.row.synthetic?i(t).onFrameTwist?.():n(e.row)?i(t).onSection?.(e.row.section):i(t).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:d[1]||(d[1]=_(()=>{},["stop"])),onDblclick:d[2]||(d[2]=_(()=>{},["stop"]))}),null,16)):(m(),k("span",Vs)),e.row.letter?(m(),k("span",js,L(e.row.letter),1)):(m(),k("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Ks)),$("span",{"data-sve-ht-text":"",title:i(t).renameTitle},[!e.row.kind&&!n(e.row)&&!s(e.row)?(m(),k("button",{key:0,type:"button","data-sve-ht-tag":"",title:i(t).tagTitle,onClick:d[3]||(d[3]=_(()=>{},["stop","prevent"])),onPointerdown:d[4]||(d[4]=_(()=>{},["stop"])),onDblclick:d[5]||(d[5]=_(p=>i(t).onTagChange?.(p,e.row.id),["stop","prevent"]))},L(e.row.tag),41,qs)):(m(),k("span",zs,L(e.row.tag),1)),i(t).editingId===e.row.id&&!n(e.row)?Ht((m(),k("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":d[6]||(d[6]=p=>i(t).draft=p),onMousedown:d[7]||(d[7]=_(()=>{},["stop"])),onPointerdown:d[8]||(d[8]=_(()=>{},["stop"])),onClick:d[9]||(d[9]=_(()=>{},["stop"])),onDblclick:d[10]||(d[10]=_(()=>{},["stop"])),onKeydown:[d[11]||(d[11]=_(()=>{},["stop"])),d[12]||(d[12]=Ae(_(p=>i(t).onRenameCommit?.(),["prevent"]),["enter"])),d[13]||(d[13]=Ae(_(p=>i(t).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:d[14]||(d[14]=p=>i(t).onRenameCommit?.())},null,544)),[[_n,i(t).draft]]):(m(),k("span",Ys,L(M(e.row)),1))],8,Us),s(e.row)?(m(),k("span",Xs,[e.row.alpineNth>=0?(m(),k("button",{key:0,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:i(t).alpineTitle,innerHTML:e.row.alpineSet?ko:go,onClick:d[15]||(d[15]=_(p=>i(t).onAlpineState?.(p,e.row.id),["stop","prevent"])),onPointerdown:d[16]||(d[16]=_(()=>{},["stop"])),onDblclick:d[17]||(d[17]=_(()=>{},["stop"]))},null,40,Ws)):C("",!0),e.row.frame!=="main"&&i(o)?(m(),k("button",{key:1,type:"button","data-sve-ht-fields":"",title:i(t).frameFieldsTitle,innerHTML:rr,onClick:d[18]||(d[18]=_(p=>i(t).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:d[19]||(d[19]=_(()=>{},["stop"])),onDblclick:d[20]||(d[20]=_(()=>{},["stop"]))},null,40,Gs)):C("",!0)])):l(e.row)?C("",!0):(m(),k("span",Zs,[e.row.videoNth>=0?(m(),k("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?i(t).videoPlayTitle:i(t).videoHoldTitle,innerHTML:e.row.videoHeld?ur:hr,onClick:d[21]||(d[21]=_(p=>i(t).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:d[22]||(d[22]=_(()=>{},["stop"])),onDblclick:d[23]||(d[23]=_(()=>{},["stop"]))},null,40,Qs)):C("",!0),e.row.alpineNth>=0?(m(),k("button",{key:1,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:i(t).alpineTitle,innerHTML:e.row.alpineSet?ko:go,onClick:d[24]||(d[24]=_(p=>i(t).onAlpineState?.(p,e.row.id),["stop","prevent"])),onPointerdown:d[25]||(d[25]=_(()=>{},["stop"])),onDblclick:d[26]||(d[26]=_(()=>{},["stop"]))},null,40,Js)):C("",!0),e.row.locked?(m(),k("button",{key:2,type:"button","data-sve-ht-lock":"","data-on":"",disabled:!i(t).canEdit||!i(t).canUnlock,title:i(t).canUnlock?i(t).unlockTitle:i(t).lockedByTitle,"aria-pressed":"true",innerHTML:vr,onClick:d[27]||(d[27]=_(p=>i(t).onLock?.(e.row.id),["stop","prevent"])),onPointerdown:d[28]||(d[28]=_(()=>{},["stop"])),onDblclick:d[29]||(d[29]=_(()=>{},["stop"]))},null,40,er)):C("",!0),x(e.row)?(m(),k("button",{key:3,type:"button","data-sve-ht-eye":"",disabled:!j(e.row),title:R(e.row),innerHTML:e.row.hidden||e.row.sectionOff?dr:lr,onClick:d[30]||(d[30]=_(p=>i(t).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:d[31]||(d[31]=_(()=>{},["stop"])),onDblclick:d[32]||(d[32]=_(()=>{},["stop"]))},null,40,tr)):C("",!0),!g(e.row)&&!P(e.row)?(m(),k("button",{key:4,type:"button","data-sve-ht-dup":"",disabled:!j(e.row),title:j(e.row)?i(t).duplicateTitle:i(t).lockedTitle,innerHTML:cr,onClick:d[33]||(d[33]=_(p=>i(t).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:d[34]||(d[34]=_(()=>{},["stop"])),onDblclick:d[35]||(d[35]=_(()=>{},["stop"]))},null,40,or)):C("",!0),g(e.row)?C("",!0):(m(),k("button",{key:5,type:"button","data-sve-ht-del":"",disabled:!j(e.row),title:j(e.row)?i(t).deleteTitle:i(t).lockedTitle,innerHTML:mr,onClick:d[36]||(d[36]=_(p=>i(t).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:d[37]||(d[37]=_(()=>{},["stop"])),onDblclick:d[38]||(d[38]=_(()=>{},["stop"]))},null,40,nr)),E(e.row)?(m(),k("button",{key:6,type:"button","data-sve-ht-more":"","aria-label":i(t).moreTitle,"aria-haspopup":"menu",innerHTML:fr,onPointerenter:d[39]||(d[39]=p=>V(p.currentTarget,e.row)),onPointerleave:te,onClick:d[40]||(d[40]=_(p=>{te(),i(t).onMore?.(p.currentTarget,e.row.id)},["stop","prevent"])),onPointerdown:d[41]||(d[41]=_(()=>{},["stop"])),onDblclick:d[42]||(d[42]=_(()=>{},["stop"]))},null,40,ar)):C("",!0)]))],16,Fs),i(zn)(e.row)?(m(),k("div",He({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},i(t).dropId===e.row.id&&i(t).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),L(i(t).slotText),17,sr)):C("",!0)],64))}},Q=Xt(gr,[["__scopeId","data-v-cafb8411"]]),kr=["data-sve-ht-look","data-sve-ht-layers"],yr={key:0,class:"sve-ht-page-template"},br={key:0,class:"sve-ht-page-template__text"},Tr={class:"sve-ht-page-template__note"},xr={key:1,class:"sve-ht-empty"},wr={key:2,class:"sve-ht-empty"},_r={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},Sr={key:0,class:"sve-ht-empty"},Cr={key:0,class:"sve-ht-empty"},Pr=["data-sve-ht-under-main"],Hr={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},Er={key:0,class:"sve-ht-empty"},Mr=["data-sve-ht-under-main"],Lr=["data-dim"],Ir={key:0,class:"sve-ht-empty"},Rr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},Or={key:0,class:"sve-ht-empty"},$r={key:4,"data-sve-ht-branch":"","data-sve-ht-cat":"component"},Dr={__name:"HtmlTreeList",setup(e){const o=me(()=>zo(t.query)),a=me(()=>As(t.rows,o.value)),n=me(()=>a.value.rows),s=me(()=>o.value?t.sections.filter(x=>Mt(x.row,o.value)||x.current&&x.ready&&n.value.length>0):t.sections);function l(x){return!!x&&(!o.value||Mt(x,o.value))}function r(x){const R=t.frame?.kind;return t.inComponent||(R==="header"||R==="footer")&&R!==x}const h=me(()=>t.frame?.kind==="header"||t.frame?.kind==="footer"),f=me(()=>!!t.frame&&["header","main","footer"].some(x=>l(t.frame[x]))),g=me(()=>!!t.frame&&(t.frame.kind==="main"||l(t.frame.main))),P=me(()=>!!o.value&&!s.value.length&&!n.value.length&&!f.value);function y(x){return!!o.value&&!a.value.hits.has(x.path)}function E(x){const R={"data-sve-ht-sec-uid":x.uid};return x.current&&(R["data-sve-ht-branch"]="",R["data-sve-ht-cat"]=x.row?.cat||"layout"),t.sectionDrop&&t.sectionDrop.uid===x.uid&&(R["data-sve-ht-drop"]=t.sectionDrop.place),R}return(x,R)=>(m(),k("div",He({class:"sve-ht-root","data-sve-ht-look":i(t).layers?"tags":i(t).look,"data-sve-ht-layers":i(t).layers?"":null,style:i(t).familyStyle},i(t).dragging?{"data-sve-ht-dragging":""}:{}),[i(t).pageTemplate?(m(),k("div",yr,[i(t).pageTemplate.text?(m(),k("p",br,L(i(t).pageTemplate.text),1)):C("",!0),$("p",Tr,L(i(t).pageTemplate.note),1),i(t).pageTemplate.canOpen?(m(),k("button",{key:1,type:"button",class:"sve-ht-page-template__open",onClick:R[0]||(R[0]=w=>i(t).pageTemplate.onOpen(w.currentTarget))},L(i(t).pageTemplate.openLabel),1)):C("",!0)])):!i(t).rows.length&&!i(t).sections.length&&!i(t).frame?(m(),k("div",xr,L(i(t).emptyText),1)):P.value?(m(),k("div",wr,L(i(t).searchEmpty),1)):C("",!0),i(t).frame||i(t).sections.length?(m(),k(D,{key:3},[i(t).frame?(m(),k(D,{key:0},[i(t).frame.kind==="header"?(m(),k("div",_r,[(m(!0),k(D,null,ne(n.value,w=>(m(),q(Q,{key:w.id,row:w,dim:y(w)},null,8,["row","dim"]))),128)),i(t).rows.length?C("",!0):(m(),k("div",Sr,L(i(t).emptyText),1))])):!h.value&&l(i(t).frame.header)?(m(),q(Q,{key:1,row:i(t).frame.header,dim:r("header")},null,8,["row","dim"])):C("",!0)],64)):C("",!0),h.value?C("",!0):(m(),k("div",Sn(He({key:1},i(t).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[i(t).frame?.kind==="main"?(m(),k(D,{key:0},[(m(!0),k(D,null,ne(n.value,w=>(m(),q(Q,{key:w.id,row:w,dim:y(w)},null,8,["row","dim"]))),128)),i(t).rows.length?C("",!0):(m(),k("div",Cr,L(i(t).emptyText),1))],64)):i(t).frame&&l(i(t).frame.main)?(m(),q(Q,{key:1,row:i(t).frame.main,dim:r("main")},null,8,["row","dim"])):C("",!0),i(t).frame?.kind==="template"?Ht((m(),k("div",{key:2,"data-sve-ht-frame-body":"","data-sve-ht-under-main":g.value?"":null},[$("div",Hr,[(m(!0),k(D,null,ne(n.value,w=>(m(),q(Q,{key:w.id,row:w,dim:y(w)},null,8,["row","dim"]))),128)),i(t).rows.length?C("",!0):(m(),k("div",Er,L(i(t).emptyText),1))])],8,Pr)),[[lo,!i(t).mainShut]]):C("",!0),i(t).sections.length||i(t).frame?Ht((m(),k("div",{key:3,"data-sve-ht-frame-body":"","data-sve-ht-under-main":g.value?"":null},[i(t).frame?.template&&l(i(t).frame.template)?(m(),q(Q,{key:0,row:i(t).frame.template,dim:r("template")},null,8,["row","dim"])):C("",!0),i(t).frame&&!i(t).frame.template&&!i(t).sections.length&&!o.value?(m(),k("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":r("")?"":void 0},L(i(t).frameEmptyText),9,Lr)):C("",!0),(m(!0),k(D,null,ne(s.value,w=>(m(),k("div",He({key:w.uid},{ref_for:!0},E(w)),[w.ready?(m(),k(D,{key:0},[(m(!0),k(D,null,ne(n.value,V=>(m(),q(Q,{key:V.id,row:V,dim:y(V)},null,8,["row","dim"]))),128)),i(t).rows.length?C("",!0):(m(),k("div",Ir,L(i(t).emptyText),1))],64)):(m(),q(Q,{key:1,row:w.row,dim:r("")},null,8,["row","dim"]))],16))),128))],8,Mr)),[[lo,!i(t).frame||!i(t).mainShut]]):C("",!0)],16)),i(t).frame?(m(),k(D,{key:2},[i(t).frame.kind==="footer"?(m(),k("div",Rr,[(m(!0),k(D,null,ne(n.value,w=>(m(),q(Q,{key:w.id,row:w,dim:y(w)},null,8,["row","dim"]))),128)),i(t).rows.length?C("",!0):(m(),k("div",Or,L(i(t).emptyText),1))])):!h.value&&l(i(t).frame.footer)?(m(),q(Q,{key:1,row:i(t).frame.footer,dim:r("footer")},null,8,["row","dim"])):C("",!0)],64)):C("",!0)],64)):i(t).inComponent&&i(t).rows.length?(m(),k("div",$r,[(m(!0),k(D,null,ne(n.value,w=>(m(),q(Q,{key:w.id,row:w,dim:y(w)},null,8,["row","dim"]))),128))])):i(t).rows.length?(m(!0),k(D,{key:5},ne(n.value,w=>(m(),q(Q,{key:w.id,row:w,dim:y(w)},null,8,["row","dim"]))),128)):C("",!0)],16,kr))}},bt=Xt(Dr,[["__scopeId","data-v-d0376715"]]);let Tt=null;function Ar(e){return Tt||(Tt=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(o=>o.ok?o.json():{pages:[]}).then(o=>Array.isArray(o.pages)?o.pages:[]).catch(()=>[])),Tt}let ot=null;function xt(){ot?.dismiss(),ot=null}function Fr(e,o,a){xt();const n=o?.getBoundingClientRect?.(),s={x:n?n.left:0,y:n?n.bottom+4:0};Ar(e).then(l=>{const r=l.length?l.map(h=>({label:h.title||h.url,onPick:()=>{xt(),a(h.url)}})):[{label:v(e,"component_props_pages_none"),onPick:null}];xt(),ot=Ie(e.document,Re,{items:r,x:s.x,y:s.y,onClose:()=>{ot=null}})})}function Yo(e){for(const o of e||[]){if(o.kind==="component"||o.kind==="svg"&&o.dynamic)continue;const a=o.kind==="antlers"?Yo(o.children):o;if(a)return a}return null}const z=_a("sve-call-values"),Br="__sve-html-tree-style";function Nr(e,o,a){if(o||a)return!1;const n=String(b("dock:chrome-kind")||"");if(n==="header"||n==="footer")return!1;const s=Co(e);return!!s&&s!=="create"&&Mn(e)!==Ln(e)}function Zt(e){return{sectionLoops:En(e),sectionsLabel:v(e,"html_tree_sections_slot")}}function Vr(e,o){const a={entry:o,text:"",note:v(e,"html_tree_page_template_note"),openLabel:v(e,"html_tree_open_template"),canOpen:!1,onOpen:null};return Fo(e,{entry:o}).then(n=>{!n||t.pageTemplate?.entry!==o||(t.pageTemplate={...t.pageTemplate,text:v(e,"html_tree_page_template",{name:n.name}),canOpen:!!n.open,onOpen:n.open?s=>aa(e,s,n.open):null})}),a}function jr(e,o){const a=o.replace(/^view:/,"");if(!a||b("dock:current-type")!==o){t.usedBy=null,t.templateSections=[];return}t.usedBy?.view!==a&&(t.usedBy=null,Fo(e,{view:a}).then(n=>{if(!n||b("dock:current-type")!==o)return;const s=n.everything?[{name:v(e,"html_tree_used_by_everything"),kind:"everything",url:null}]:n.used_by.map(l=>({...l,...Kr(e,l)}));t.templateSections=Array.isArray(n.sections_fields)?n.sections_fields:[],t.usedBy={view:a,label:v(e,"html_tree_used_by"),items:s,empty:s.length?"":v(e,"html_tree_used_by_nobody"),hint:s.length?v(e,"html_tree_used_by_hint",{list:s.map(l=>l.name).join(", ")}):""}}))}function Kr(e,o){if(!o.url)return{openLabel:"",onOpen:null};const a=v(e,"html_tree_used_by_open",{name:o.name});return o.kind==="page"?{openLabel:a,onOpen:n=>da(e,n,ca(e,o.url))}:{openLabel:a,onOpen:n=>ha(e,{anchor:n,url:o.url,subtitle:o.name})}}const O=new Set;let Lt="",Pe=!1,wt=null,ge=!0,Y="",_e=0,Xo="";const Se=new Map,Be=new Set,It=new Map,nt=new Map;let U="",Wo=!1,I=null,at=null,Je="",Ke="",st=0,Rt=null,pe=[],we=null,Ne=null,rt=null,it=null,Ot=null,re=!1,ee=null,Ue=null,Ve=null,lt=null,dt=null,$t=null,Te=null;function X(e){return e.getElementById(tt)}function Ur(e){Cn(e,Br,`
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
      ${uo("light")}
      /* How much of a row's own colour its pick takes: a wash, not a fill.
         The row mixes it in below — a mix written up here would read
         --sve-ht-c on the list, where no family is set. */
      --sve-ht-pick-mix: 11%;
      --sve-ht-pick-hover-mix: 18%;
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${uo("dark")}
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
  `)}function W(){const e=b("dock:html");return typeof e=="string"?e:""}function Go(e){return!!b("dock:is-open",e)}function Oe(e,{save:o=!1,unlock:a=!1}={}){return ct()||b("dock:set-html",a?{html:e,unlock:!0}:e)!==!0?!1:(o&&b("dock:save-now"),!0)}function _t(e){const o=b("dock:component-exit-state")||{};if(t.exitOpen=!!o.open,!o.open){t.onExit=null;return}t.exitName=o.name||"",t.exitLabel=v(e,"component_exit"),t.exitTitle=v(e,o.back?"component_exit_back":"component_exit_close"),t.onExit=()=>{b("dock:exit-component"),H(e)}}const qe=[];let St=!1;function Ct(e,o){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(o,{timeout:2e3});return}e.setTimeout(o,200)}function qr(e,o){for(const a of o){const n=a.type;!n||Se.has(n)||Be.has(n)||qe.includes(n)||qe.push(n)}qt.htmlTreePrefetchArmed&&Zo(e)}function Wi(e){qt.htmlTreePrefetchArmed=!0,Zo(e)}function Zo(e){if(St||!qe.length)return;St=!0;const o=()=>{const a=qe.shift();if(!a){St=!1;return}if(Se.has(a)||Be.has(a)){Ct(e,o);return}Be.add(a),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(a)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{if(typeof n?.html=="string"){Se.set(a,n.html);const s=nt.get(a);nt.delete(a),s&&s!==Qo(e,a)&&H(e)}}).catch(()=>{}).finally(()=>{Be.delete(a),Ct(e,o)})};Ct(e,o)}function ct(){return!!U}function Qo(e,o){return Jo(o)||In(e,o)||"section"}function Jo(e){const o=Se.get(e);if(!o)return"";const a=It.get(e);if(a&&a.html===o)return a.tag;const n=Qt(Ye(o))?.tag||"";return It.set(e,{html:o,tag:n}),n}function We(e,o){const a=vt(e)||"page_sections",n=[];for(const s of jt(o)||[]){if(s.name===na||s.name===ka)continue;const l=Kt(s.values),r=l&&typeof l=="object"?l[a]:null;if(Array.isArray(r)){r.forEach(h=>{if(!h||typeof h!="object"||Array.isArray(h)||typeof h.type!="string")return;const f=[h._visual_id,h.id,h._id].filter(x=>typeof x=="string"&&x!=="");if(!f.length)return;const g=Ao(e,h),P=typeof h._sve_label=="string"?h._sve_label.trim():"",y=Qo(e,g);Jo(g)||nt.set(g,y);const E=Uo(g)[`0:${y}`];n.push({uid:f[0],ids:f,type:g,tag:y,label:P||(typeof E=="string"&&E.trim()?E.trim():"")||ft(e,g)?.display||je(g)||g,svg:Ko(y,yo(y),null).svg||Ee.section,cat:$o(y,yo(y)),enabled:h.enabled!==!1,static:Bn(e,g)})});break}}return n}function zr(e,o,a){if(!a.length)return"";const n=b("dock:current-type")||"",s=b("dock:current-uid"),l=!!b("dock:component-exit-state")?.open;if(s){const r=Xe(s,o),h=a.find(f=>f.ids.some(g=>r.includes(g)));if(h&&(l||h.type===n))return h.uid}return a.find(r=>r.type===n)?.uid||""}function Yr(e,o,a){const n=b("dock:component-exit-state");if(n?.open)return je(n.name)||n.name||"";if(a)return o.find(l=>l.uid===a)?.label||"";const s=b("dock:current-type")||"";return String(s).startsWith("view:")?"":ft(e,s)?.display||je(s)||""}function mt(e,o,a,n,s){const l=a.find(r=>r.uid===n);l&&n!==s&&(O.clear(),I=null,ge=!1,N(),Ge(),b("build:reveal",{ids:l.ids}),Y=n,Xo=W(),U=Se.get(l.type)||"",U&&(I=At(Ye(U))||null),Wo=(b("dock:current-type")||"")===l.type,e.clearTimeout(_e),_e=e.setTimeout(()=>{Y="",Pe=!1,H(e)},4e3),H(e),la(e,l.uid,"tree"),ke({source:G,type:B.SVE_ACTIVATE,ids:l.ids},e),e.setTimeout(()=>H(e),0))}function Dt(e,o){if(!o)return!1;for(const a of e||[])if(a.id===o||Dt(a.children,o))return!0;return!1}function At(e){return Qt(e)?.id||""}function Qt(e){for(const o of e||[]){if(en(o))return o;const a=Qt(o.children);if(a)return a}return null}function en(e){return!e.kind||e.kind==="component"}function yo(e){return e==="component"?"component":""}function Xr(e,o){const a=o===0||e.path===Ke;return O.has(e.path)?a:!a}function Wr(e){const o=new Set,a=Ut(),n=(s,l)=>{for(const r of s)(r.children.length?Xr(r,l):a&&(r.kind==="antlers"||r.hollow)&&O.has(r.path))&&o.add(r.id),n(r.children,l+1)};return n(e,0),o}function H(e){const o=e.document,n=X(o)?.querySelector("[data-sve-html-tree-list]");if(!n)return;Ur(o),xa(e);const s=W();U&&U===s&&(U=""),b("dock:chrome-kind")&&(U="");const l=U||s,r=Ye(l,Zt(e));pe=r,Ke="";const h=b("dock:current-type")||"",f=Uo(h),g=Hn(e,o),y=!!(b("dock:component-exit-state")||{}).open;h&&s&&!U&&Se.set(h,s);const E=We(e,o);qr(e,E);const x=zr(e,o,E);if(Nr(e,g,y)){const c=Co(e);pe=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!1,t.layoutFile=!1,t.usedBy=null,t.emptyText="",t.pageTemplate?.entry!==c&&(t.pageTemplate=Vr(e,c)),t.onRefresh=()=>H(e),t.onSection=null,_t(e),Fe(n,bt),Pt(e,[]);return}t.pageTemplate=null,jr(e,String(b("dock:collection-view")||""));const R=String(b("dock:chrome-kind")||"");if(Qn(e),g&&!E.length&&!R){pe=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,t.layoutFile=!1,t.emptyText=v(e,"html_tree_page_empty"),t.canEdit=!b("dock:is-locked"),t.look=vo(e),t.onRefresh=()=>H(e),t.onSection=null,_t(e),Fe(n,bt),Pt(e,[]);return}t.pageBuilder=g;const w=`${h}|${x}`;let V=!1;w!==Lt&&(Lt=w,O.clear(),wt!==null&&l!==wt?V=!0:Pe=l),(V||Pe!==!1&&l!==Pe)&&(Pe=!1,O.clear(),I=At(r)||null),wt=l,Y&&(Y===x||!E.length)&&(Wo||l!==Xo)&&(e.clearTimeout(_e),Y="",Pe=!1,Dt(r,I)||(O.clear(),I=At(r)||null));const te=E.some(c=>c.uid===Y)?Y:"",Z=ge?"":te||x,j=!!(te||x),M=j||y?"":String(b("dock:chrome-kind")||""),d=g&&(!h&&!j||M==="main"&&b("dock:on-empty-page")===!0),p=d||M==="template"?"":M;t.layoutFile=p==="main",p!=="main"&&(Je="");const A=p==="main"?bo(r,"main"):null,F=A?ht(r,c=>c.tag==="body"&&Dt(c.children,A.id)):null;Ke=F?F.path:"",A&&(et((F||A).path),Je!==w&&(et(A.path),O.add(A.path)));const $e=p==="header"||p==="footer"?ht(r,c=>l.slice(c.from,c.openTo).includes(`data-sve-chrome="${p}"`)):null,ie=$e||(p==="header"||p==="footer"?bo(r,p):null);ie&&et(ie.path);const K=d||!(p==="main"?!!A:p==="header"||p==="footer"?!!ie:!0)?[]:Jn(r,t.query?new Set:Wr(r));!l.trim()&&!Go(o)?t.emptyText=v(e,"html_tree_need_dock"):t.emptyText=v(e,"html_tree_empty"),t.slotText=v(e,"antlers_drop_here"),t.dataTitle=v(e,"data_vars_title"),t.pageTitle=v(e,"component_props_page"),t.renameTitle=v(e,"html_tree_rename"),t.tagTitle=v(e,"tw_tag"),t.hideTitle=v(e,"html_tree_hide"),t.showTitle=v(e,"html_tree_show"),t.sectionHideTitle=v(e,"html_tree_section_hide"),t.sectionShowTitle=v(e,"html_tree_section_show"),t.moreTitle=v(e,"html_tree_more"),t.duplicateTitle=v(e,"html_tree_duplicate"),t.deleteTitle=v(e,"html_tree_delete"),t.videoHoldTitle=v(e,"html_tree_video_hold"),t.videoPlayTitle=v(e,"html_tree_video_play"),t.alpineTitle=v(e,"html_tree_alpine_state"),t.lockedTitle=v(e,"html_tree_locked"),t.searchEmpty=v(e,"html_tree_search_empty"),t.canEdit=!b("dock:is-locked"),t.look=vo(e),t.onQuery=()=>H(e),_t(e),t.inComponent=y,t.onSelect=(c,T)=>{const S=K.find(oe=>oe.id===c);if(S&&jo(e,S.path))return;T&&!Ba()&&(t.rowClicks+=1);const ae=!!T&&S?.kind==="antlers"&&!re&&ea(e);Le(e,c,K),T&&S&&!re&&!ct()&&b("build:reveal",{path:S.path,section:!!S.sectionRoot}),ae&&Ya(e,{path:S.path,at:T,beside:X(e.document)})},t.onTwist=c=>{const T=K.find(S=>S.id===c)?.path;T&&(O.has(T)?O.delete(T):O.add(T),H(e))},t.onTagChange=(c,T)=>{const S=t.rows.find(ae=>ae.id===T);S&&!ct()&&!Jt(e,S)&&wa(e,c.currentTarget,S)},t.onRename=c=>oi(e,c),t.onRenameCommit=()=>To(e,!0),t.onRenameCancel=()=>To(e,!1),t.onHide=c=>ii(e,c),t.onLock=c=>nn(e,c),t.onMore=(c,T)=>ui(e,c,T),t.canUnlock=on(e),t.lockTitle=v(e,"html_tree_lock"),t.unlockTitle=v(e,"html_tree_unlock"),t.lockedByTitle=v(e,"html_tree_locked_by_developer"),t.onVideoHold=c=>ai(e,c),t.onAlpineState=(c,T)=>ri(e,c,T),t.onDuplicate=c=>li(e,c),t.onDelete=c=>ci(e,c),t.onPointerDown=(c,T)=>mi(e,c,T),t.onSectionPointerDown=(c,T)=>yi(e,c,T),t.onSectionHover=c=>e.dispatchEvent(new e.CustomEvent("sve-lite-hover",{detail:{uid:c}})),t.onContext=(c,T)=>dn(e,c,T),t.onInspectCommit=c=>Ci(e,c),t.onPropValue=(c,T,S)=>So(e,c,T,S),t.onPropPage=(c,T)=>Fr(e,c,S=>So(e,T,S,!1)),t.onLoopKind=c=>Pi(e,c),t.onAddBranch=c=>Hi(e,c),t.onLoopSortField=c=>{const T=ut();if(!T)return;const S=Te?.id===T.id?Te.dir:"";Te=null,se(e,Za(T,c,S))},t.onLoopSortDir=c=>{const T=ut();if(!T)return;const S=Qa(T,c);if(S.draft){Te={id:T.id,dir:S.draft},Nt(e,T);return}Te=null,se(e,S.edit)},t.onLoopDepth=c=>se(e,ts(c)),t.onLoopIncludeHome=c=>se(e,os(c)),t.onLoopLimit=c=>se(e,ns(c)),t.onLoopOffset=c=>se(e,as(c)),t.onPropHost=c=>c?z.mount(c):z.unmount(),t.onInspectData=(c,T)=>{b("dock:data-menu",{anchor:c,at:K.find(S=>S.id===I)?.from,onPick:S=>T(String(S?.var||"").trim())})};const gt=K.find(en)?.id,Ze=y?"":Yr(e,E,Z),le=Z&&!y?E.find(c=>c.uid===Z):null;t.nameAt=(c,T)=>{if(T!==l||!c)return"";const S=ue=>{for(const ve of ue||[]){if(ve.path===c)return ve;const fe=c.startsWith(`${ve.path}/`)?S(ve.children):null;if(fe)return fe}return null},ae=t.rows.find(ue=>ue.path===c&&!ue.kind);if(ae)return ae.name;const oe=S(r);if(!oe)return"";const he=oe.id===gt,Qe=he&&Ze?Ze:oe.klass;return he&&le?Qe:po(Qe,oe.path,f)};const mn=Ro(e,String(b("dock:current-type")||""));let pn=0;const gn=si($e?[$e]:r,l),kn=Oo(e,String(h)),de=p==="header"||p==="footer"?p:"",Ce=ie?ie.id:"",ye=A&&K.find(c=>c.id===A.id)||null,ao=F&&K.find(c=>c.id===F.id)||null,ce=ao||ye||Ce&&K.find(c=>c.id===Ce)||null,so=ce?Jr(K,ce):-1;if(ce&&!K.slice(K.indexOf(ce),so).some(c=>c.id===I)&&(I=ce.id),t.selectFrom){const c=K.find(T=>T.from===t.selectFrom.at&&(!T.kind||T.kind==="sections"));c?(I=c.id,t.selectFrom=null):--t.selectFrom.left<=0&&(t.selectFrom=null)}const ro=t.layoutFile?Qr(e):null;t.rows=K.map(c=>{const T=ro&&c.kind==="component"&&ro.get(c.src)||"",S=c.tag==="body"&&!c.kind,ae=T?{svg:Ee[T]}:Ko(c.tag,c.kind,c.antlers),oe=c.tag==="video"&&!c.kind?pn++:-1,he=gn.get(c.id),Qe=he?kn[he.nth]||{}:{},ue=he?he.booleans.map(({key:De,value:io})=>({key:De,file:io,value:Qe[De]??io})):[],ve=c.id===gt&&Ze?Ze:c.klass,fe=c.id===gt;return{...c,tag:T||c.tag,frameCall:T,fixed:!!T||S,base:ve,name:T?v(e,`html_tree_frame_${T}`):de&&c.id===Ce?v(e,`html_tree_frame_${de}`):c===ye?v(e,"html_tree_frame_main"):fe&&le?ve:po(ve,c.path,f),current:c.id===I,letter:ae.letter||"",svg:de&&c.id===Ce?Ee[de]:c===ye?Ee.main:fe&&le?le.svg:ae.svg||"",frame:de&&c.id===Ce?de:c===ye?"main":"",cat:de&&c.id===Ce?de:c===ye||S?"main":T||$o(c.tag,c.kind,c.antlers),componentRoot:fe&&y,sectionRoot:fe&&le?le.uid:"",sectionOff:!!(fe&&le&&!le.enabled),videoNth:oe,videoHeld:oe>=0&&mn.has(oe),alpineNth:ue.length?he.nth:-1,alpineKeys:ue,alpineSet:ue.some(De=>De.value!==De.file)}}),ta(e),oa(e);const kt=[];for(const c of t.rows)kt.length=c.depth,c.guides=kt.slice(),kt[c.depth]=c.cat;if(ce){const c=K.indexOf(ce),T=ce.depth;t.rows=t.rows.slice(c,so).map(S=>({...S,depth:S.depth-T,guides:S.guides.slice(T)})),ye&&Je!==w&&(Je=w,e.setTimeout(()=>Le(e,ye.id,K),0))}t.sections=g&&!y&&(j||p||d)?E.map(c=>{const T=!!Z&&c.uid===Z;return{...c,current:T,ready:T&&(!te||!!U),row:{id:`sec:${c.uid}`,section:c.uid,tag:c.tag,name:c.label,kind:"",svg:c.svg,cat:c.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:T,hidden:!c.enabled}}}):[],t.frame=Zr(e,E,j,y,p,!1,!!ao),t.frameEmptyText=v(e,"html_tree_frame_no_sections"),Gr(e,p),t.onSection=c=>{re||(Ft(e),mt(e,o,E,c,Z))},t.onRefresh=()=>H(e),Nt(e,t.rows.find(c=>c.id===I)),Fe(n,bt),Pt(e,r)}function Gr(e,o){t.frameOpenTitle=v(e,"html_tree_frame_open"),t.frameMainTitle=v(e,"html_tree_frame_main_open"),t.frameTemplateTitle=v(e,"html_tree_frame_template_open"),t.frameFieldsTitle=v(e,"html_tree_frame_fields"),t.onFrame=a=>{o===a?ei(e,a):Bt(e,a)},t.onFrameEnter=a=>Bt(e,a),t.onFrameFields=a=>Vn(e,ra(e,a),v(e,`html_tree_frame_${a}`)),t.onFrameTwist=()=>{t.mainShut=!t.mainShut}}function Zr(e,o,a,n,s,l=!1,r=!1){if(!s&&!l||r)return null;const h=P=>({id:`frame:${P}`,frame:P,synthetic:!0,tag:P,name:v(e,`html_tree_frame_${P}`),kind:"",svg:Ee[P]||"",cat:P,letter:"",depth:0,hasChildren:P==="main"&&(o.length>0||s==="template"),shut:P!=="main",current:!1,hidden:!1}),f={kind:s,header:h("header"),main:h("main"),footer:h("footer"),template:null},g=s&&s!=="template"?String(b("dock:collection-view")||""):"";return g&&(f.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:ft(e,g)?.display||je(g.replace(/^view:/,"")),kind:"",svg:Ee.section||"",cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),f}function bo(e,o){return ht(e,a=>a.tag===o)}function ht(e,o){for(const a of e||[]){if(!a.kind&&o(a))return a;const n=ht(a.children,o);if(n)return n}return null}function Qr(e){const o=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},a=new Map;for(const n of["header","footer"]){const s=Ca(o[n]?.type);s&&a.set(s,n)}return a}function Jr(e,o){let a=e.indexOf(o)+1;for(;a<e.length&&e[a].depth>o.depth;)a+=1;return a}function ei(e,o){const a=Vo(e);(o==="main"||o==="template"?a?.querySelector("main"):a?.querySelector(`[data-sve-chrome="${o}"]`))?.scrollIntoView({behavior:pa(),block:"start"})}function Ft(e){const o=String(b("dock:chrome-open",e.document)||"");return o!=="header"&&o!=="footer"?!1:(ia(e),ke({source:G,type:B.SVE_FORCE_EXIT_CHROME},e),!0)}function ti(e){e.clearTimeout(_e),Y="",U="",O.clear(),I=null,ge=!1,N(),Ge()}function Bt(e,o){if(e.document,String(b("dock:chrome-kind")||"")===o)return;if(ti(e),o==="main"){Ft(e),b("dock:open-file",ya);return}if(o==="template"){const l=String(b("dock:collection-view")||"");l&&(Ft(e),b("dock:open-file",l));return}if(o!=="header"&&o!=="footer")return;const a=Vo(e)?.querySelector(`[data-sve-chrome="${o}"]`);a?(a.scrollIntoView({block:"nearest"}),a.dispatchEvent(new a.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:G,type:B.OPEN_CHROME,kind:o},e.location.origin);const n=Date.now(),s=async()=>{if(String(b("dock:chrome-kind")||"")!==o){Date.now()-n<3e4&&e.setTimeout(s,250);return}await(b("dock:load-settled")||null),fn(e)};e.setTimeout(s,250)}function Pt(e,o){X(e.document)&&tn(e,o)}function tn(e,o){const a=Yo(o),n=!!b("dock:component-src"),s=n?"":b("dock:current-uid")||"";ke({source:G,type:B.SVE_HTML_PICK,on:!0,uid:s,uids:s?Xe(s,e.document):[],all:n,tag:a?.tag||"",klass:a?.klass||"",nodes:Ga(o)},e)}function et(e){if(!e)return;const o=(a,n)=>{for(const s of a||[]){if(s.path===e)return!0;if(o(s.children,n+1))return n===0||s.path===Ke?O.delete(s.path):O.add(s.path),!0}return!1};o(pe,0)}function oi(e,o){if(re)return;const a=t.rows.find(n=>n.id===o);Jt(e,a)||!a||a.kind||(I=o,t.rows.forEach(n=>{n.current=n.id===o}),t.editingId=o,t.draft=a.name,e.setTimeout(()=>{const n=X(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function To(e,o){const a=t.editingId;if(!a)return;const n=t.rows.find(s=>s.id===a);t.editingId=null,o&&n&&(n.sectionRoot?ni(e,n.sectionRoot,t.draft):Xa(b("dock:current-type")||"",n.path,t.draft,n.base||n.klass)),t.draft="",H(e)}function ni(e,o,a){const n=vt(e)||"page_sections",s=String(a||"").replace(/\s+/g," ").trim();for(const l of jt(e.document)||[]){const r=Kt(l.values),h=r&&typeof r=="object"?r[n]:null;if(!Array.isArray(h))continue;const f=h.findIndex(E=>E&&typeof E=="object"&&[E._visual_id,E.id,E._id].includes(o));if(f===-1)continue;const g=Ao(e,h[f]),P=ft(e,g)?.display||je(g)||g,y=JSON.parse(JSON.stringify(h));return y[f]={...y[f]},!s||s===P?delete y[f]._sve_label:y[f]._sve_label=s,l.setFieldValue(n,y),!0}return!1}function ai(e,o){const a=t.rows.find(h=>h.id===o);if(!a||!(a.videoNth>=0))return;const n=String(b("dock:current-type")||""),s=Ro(e,n),l=!s.has(a.videoNth);l?s.add(a.videoNth):s.delete(a.videoNth);const r=String(b("dock:current-uid")||"");sa(e,n,s),ke({source:G,type:B.SVE_VIDEO_HOLD,uid:r,uids:r?Xe(r,e.document):[],nth:a.videoNth,on:l},e),H(e)}function si(e,o){const a=new Map;let n=0;const s=l=>{for(const r of l){if(r.hidden)continue;const h=r.kind?null:is(o.slice(r.from,r.openTo));h!==null&&a.set(r.id,{nth:n++,booleans:ds(h)}),s(r.children||[])}};return s(e),a}function ri(e,o,a){const n=t.rows.find(l=>l.id===a);if(!n||!(n.alpineNth>=0))return;if(n.alpineKeys.length===1){xo(e,n,n.alpineKeys[0]);return}const s=o.currentTarget.getBoundingClientRect();N(),ee=Ie(e.document,Re,{items:n.alpineKeys.map(l=>({label:l.key,icon:l.value?sn:rn,onPick:()=>{N(),xo(e,n,l)}})),x:Math.round(s.left),y:Math.round(s.bottom+4),onClose:()=>{ee=null}})}function xo(e,o,a){const n=String(b("dock:current-type")||""),s=Oo(e,n),l=!a.value,r=l!==a.file,h={...s[o.alpineNth]||{}};r?h[a.key]=l:delete h[a.key],Object.keys(h).length?s[o.alpineNth]=h:delete s[o.alpineNth];const f=ua(String(b("dock:chrome-kind")||"")),g=f?"":String(b("dock:current-uid")||"");va(e,n,s),ke({source:G,type:B.SVE_ALPINE_STATE,uid:g,uids:g?Xe(g,e.document):[],chrome:f,nth:o.alpineNth,key:a.key,value:l,on:r},e),H(e)}function Jt(e,o){return!o||!(o.locked||o.lockedIn)?!1:(e.Statamic?.$toast?.error(v(e,"html_tree_locked_element")),!0)}function on(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function nn(e,o){const a=t.rows.find(n=>n.id===o);if(!(!a||a.lockedIn||b("dock:is-locked"))){if(!a.locked){Me(e,o,Na,{lockAction:!0});return}if(!on(e)){e.Statamic?.$toast?.error(v(e,"html_tree_unlock_denied"));return}zt(e,{titleKey:"html_tree_unlock_title",bodyKey:"html_tree_unlock_body",confirmKey:"html_tree_unlock_confirm"},()=>Me(e,o,Va,{lockAction:!0,unlock:!0}))}}function eo(e){return!!t.rows.find(o=>o.id===e)?.fixed}function to(e){const o=t.sections?.find(n=>n.row?.id===e);if(o)return o;const a=t.rows.find(n=>n.id===e)?.sectionRoot;return a&&t.sections?.find(n=>n.uid===a)||null}function ii(e,o){if(eo(o))return;const a=to(o),n=t.rows.find(s=>s.id===o);if(a&&!(n?.hidden&&n.wrapFrom!=null)){e.postMessage({source:G,type:B.HIDE_ROW,uid:a.uid,show:!a.enabled},e.location.origin),e.setTimeout(()=>H(e),60);return}Me(e,o,ja)}function li(e,o){if(eo(o))return;const a=to(o)?.uid;if(a){e.postMessage({source:G,type:B.DUPLICATE_ROW,uid:a},e.location.origin);return}Me(e,o,Ka)}function an(e,o){zt(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const a=e.document;ga({uid:o},a,e)})}function di(e,o,a){Y===a&&(e.clearTimeout(_e),Y="",U=""),I=null,ge=!1,Lt="";const n=We(e,o),s=n.find(l=>l.uid!==a)||n[0];s?mt(e,o,n,s.uid,""):(U="",t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,H(e)),e.setTimeout(()=>{X(e.document)&&H(e)},0)}Do("row:removed",({uid:e,parentPath:o,doc:a,win:n})=>{o!==vt(n)||!X(n.document)||di(n,a,e)});function ci(e,o){if(eo(o))return;const a=t.sections?.find(s=>s.row?.id===o),n=a?a.row?.section||a.uid:t.rows.find(s=>s.id===o)?.sectionRoot;if(n){an(e,n);return}if(t.rows.find(s=>s.id===o)?.kind==="sections"){zt(e,{titleKey:"html_tree_sections_remove_title",bodyKey:"html_tree_sections_remove_body",confirmKey:"html_tree_sections_remove_confirm"},()=>Me(e,o,mo));return}Me(e,o,mo)}function Me(e,o,a,{lockAction:n=!1,unlock:s=!1}={}){if(b("dock:is-locked"))return;const l=W(),r=t.rows.find(f=>f.id===o);if(!r||!n&&Jt(e,r))return;const h=a(l,r);h!==l&&Oe(h,{unlock:s})}let ze=null;function oo(){ze?.closest("[data-sve-ht-row]")?.removeAttribute("data-sve-ht-more-open"),ze=null}function N(){ee?.dismiss(),ee=null,oo()}const sn='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',rn='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>',be=e=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${e}</svg>`,xe={up:be('<path d="M12 19V5M6 11l6-6 6 6"/>'),down:be('<path d="M12 5v14M6 13l6 6 6-6"/>'),save:be('<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/>'),add:be('<path d="M12 5v14M5 12h14"/>'),fieldset:be('<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/>'),lock:be('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),unlock:be('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-.9"/>')};function hi(e,o){const a=t.sections||[],n=a.findIndex(r=>r.uid===o.uid),s=(r,h={})=>()=>{N(),e.postMessage({source:G,type:r,uid:o.uid,...h},e.location.origin),e.setTimeout(()=>H(e),60)},l=[{label:v(e,"move_up"),icon:xe.up,onPick:n>0?s(B.MOVE,{direction:-1}):null},{label:v(e,"move_down"),icon:xe.down,onPick:n>=0&&n<a.length-1?s(B.MOVE,{direction:1}):null},{label:v(e,"html_tree_save_section"),icon:xe.save,onPick:s(B.SAVE_SECTION)},{label:v(e,"add_section_below"),icon:xe.add,onPick:s(B.ADD_SET)}];if(Ho(e)&&o.type&&!o.static){const r=o.current&&!t.canEdit;l.push({label:v(e,"html_tree_fieldset"),icon:xe.fieldset,onPick:r?null:()=>{N(),Eo(e,o.type)}})}return l}function wo(e,o){const a=t.canEdit&&(!o.locked||t.canUnlock);return{label:o.locked?t.canUnlock?t.unlockTitle:t.lockedByTitle:t.lockTitle,icon:o.locked?xe.unlock:xe.lock,onPick:a?()=>{N(),nn(e,o.id)}:null}}function ui(e,o,a){if(!o.isConnected||ee&&ze===o)return;const n=to(a),s=t.rows.find(l=>l.id===a);if(!n){dn(e,null,a,{anchor:o,lead:s?[wo(e,s)]:[]});return}N(),ze=o,o.closest("[data-sve-ht-row]")?.setAttribute("data-sve-ht-more-open",""),ee=Ie(e.document,Re,{items:[...hi(e,n),...s?[wo(e,s)]:[]],x:0,y:0,anchor:o,onClose:()=>{ee=null,oo()}})}function ln(e,o){const a=t.sections?.find(f=>f.uid===o),n=a?.type||"";if(!n||!Po(e))return[];const s=a.label||n,l=Nn(e,n),r=()=>e.Statamic?.$toast?.error(v(e,"section_update_failed")),h=[{label:v(e,"static_section_insertable"),icon:l?rn:sn,onPick:()=>{N(),co(e,{handle:n,hidden:!l}).then(()=>{e.Statamic?.$toast?.success(v(e,l?"section_shown_to_editors":"section_hidden_from_editors",{name:s})),ho(e)}).catch(r)}}];return a.static&&h.push({label:v(e,"section_add_fields"),onPick:()=>{N(),co(e,{handle:n,fields:!0}).then(()=>{e.Statamic?.$toast?.success(v(e,"section_fields_added",{name:s})),ho(e),H(e),Eo(e,n)}).catch(r)}}),h}function vi(e,o,a){const n=a.row?.section||a.uid;n&&(ee=Ie(e.document,Re,{items:[...ln(e,n),{label:v(e,"html_tree_remove_section"),danger:!0,onPick:()=>{N(),an(e,n)}}],x:o.clientX,y:o.clientY,onClose:()=>{ee=null}}))}function dn(e,o,a,{anchor:n=null,lead:s=[]}={}){N();const l=t.sections?.find(g=>g.row?.id===a);if(l){vi(e,o,l);return}const r=t.rows.find(g=>g.id===a);if(!r)return;n||Le(e,a,t.rows);const h=n?{x:0,y:0}:{x:o.clientX,y:o.clientY},f=g=>{const P=[...s,...g.map(y=>n&&y.onPick?{...y,onPick:()=>{Le(e,a,t.rows),y.onPick()}}:y)];P.length&&(ee?.dismiss(),n&&(ze=n,n.closest("[data-sve-ht-row]")?.setAttribute("data-sve-ht-more-open","")),ee=Ie(e.document,Re,{items:P,x:h.x,y:h.y,anchor:n,onClose:()=>{ee=null,oo()}}))};if(r.frameCall){f([{label:v(e,"html_tree_frame_edit",{frame:v(e,`chrome_${r.frameCall}`)}),onPick:()=>{N(),Bt(e,r.frameCall)}}]);return}if(r.kind==="component"){fi(e,r,f);return}if(r.kind==="slot"||r.kind==="sections"||r.kind==="svg"||r.locked||r.lockedIn){f([]);return}if(!t.canEdit){f([]);return}if(r.componentRoot){f([]);return}f([...r.sectionRoot?ln(e,r.sectionRoot):[],{label:v(e,"component_make"),onPick:()=>{N(),Sa(e,r,{onDone:()=>H(e),onError:g=>{e.alert(g?.status===409?v(e,"component_exists"):v(e,"component_failed"))}})}}])}const _o=(e,o)=>{N(),b("dock:open-template",o)};function fi(e,o,a){if(!fa(o.src)){a([{label:v(e,"component_open_named",{name:ma(o.src)||o.src}),onPick:()=>_o(e,`view:partials/${o.src}`)}]);return}a([{label:v(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(o.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const s=Array.isArray(n.items)?n.items:[];a(s.length?s.map(l=>({label:v(e,"component_open_named",{name:l.label}),onPick:()=>_o(e,l.type)})):[{label:v(e,"component_none"),onPick:null}])}).catch(()=>a([{label:v(e,"component_none"),onPick:null}]))}function mi(e,o,a){if(o.button!==0||b("dock:is-locked")||t.editingId)return;const n=t.rows.find(r=>r.id===a);if(n&&(n.locked||n.lockedIn)||o.target?.closest?.("button, input"))return;Ge(),we=a,Ne={x:o.clientX,y:o.clientY},rt=o.currentTarget,it=o.pointerId;const s=r=>pi(e,r),l=r=>gi(e,r);Ot=()=>{e.document.removeEventListener("pointermove",s,!0),e.document.removeEventListener("pointerup",l,!0),e.document.removeEventListener("pointercancel",l,!0),Ot=null},e.document.addEventListener("pointermove",s,!0),e.document.addEventListener("pointerup",l,!0),e.document.addEventListener("pointercancel",l,!0)}function pi(e,o){if(!we||!Ne)return;const a=o.clientX-Ne.x,n=o.clientY-Ne.y;if(!t.dragging&&a*a+n*n<25)return;if(!t.dragging){t.dragging=!0;try{rt?.setPointerCapture?.(it)}catch{}}o.preventDefault();const s=e.document.elementFromPoint(o.clientX,o.clientY),l=s?.closest?.("[data-sve-ht-slot]");if(l){const y=l.getAttribute("data-sve-ht-id");if(y&&y!==we){t.dropId=y,t.dropPlace="inside";return}}const r=s?.closest?.("[data-sve-ht-row]"),h=r?.getAttribute("data-sve-ht-id");if(!h||h===we){t.dropId=null,t.dropPlace=null;return}const f=t.rows.find(y=>y.id===h),g=t.rows.find(y=>y.id===we);if(!f||f.lockedIn||g&&f.path.startsWith(`${g.path}/`)){t.dropId=null,t.dropPlace=null;return}const P=r.getBoundingClientRect();t.dropId=h,t.dropPlace=$a(o.clientY-P.top,P.height,!No(f.tag)&&!Bo(f)&&!f.locked)}function gi(e,o){const a=we,n=t.dropId,s=t.dropPlace||"after",l=t.dragging;if(Ge(),l&&(re=!0,e.setTimeout(()=>{re=!1},0)),!l||b("dock:is-locked")||!a||!n||a===n)return;o?.preventDefault?.();const r=W(),h=Da(r,pe,a,n,s);if(h!==r){const f=s==="inside"&&Ut()?ki(e,r,h,a,n):null;Oe(h)||f?.()}}function ki(e,o,a,n,s){const l=fo(pe,n),r=fo(pe,s);if(!l||!r||r.children.length||!(r.kind==="antlers"||r.hollow))return null;const h=Fa(o,l),f=h.from<r.from?r.from-(h.to-h.from):r.from,g=(R,w)=>{for(const V of R){if(V.from===f&&V.tag===r.tag)return{node:V,depth:w};const te=g(V.children,w+1);if(te)return te}return null},P=g(Ye(a,Zt(e)),0);if(!P)return null;const{path:y}=P.node,E=P.depth===0||y===Ke,x=O.has(y);return E?O.delete(y):O.add(y),()=>{x?O.add(y):O.delete(y)}}function Ge(){try{rt?.releasePointerCapture?.(it)}catch{}Ot?.(),we=null,Ne=null,rt=null,it=null,t.dragging=!1,t.dropId=null,t.dropPlace=null}function yi(e,o,a){if(o.button!==0||!a||t.editingId||o.target?.closest?.("button, input"))return;cn(),Ue=a,Ve={x:o.clientX,y:o.clientY},lt=o.currentTarget,dt=o.pointerId;const n=l=>bi(e,l),s=l=>Ti(e,l);$t=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",s,!0),e.document.removeEventListener("pointercancel",s,!0),$t=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",s,!0),e.document.addEventListener("pointercancel",s,!0)}function bi(e,o){if(!Ue||!Ve)return;const a=o.clientX-Ve.x,n=o.clientY-Ve.y;if(!t.dragging&&a*a+n*n<25)return;if(!t.dragging){t.dragging=!0;try{lt?.setPointerCapture?.(dt)}catch{}}o.preventDefault();const l=e.document.elementFromPoint(o.clientX,o.clientY)?.closest?.("[data-sve-ht-sec-uid]"),r=l?.getAttribute("data-sve-ht-sec-uid")||"";if(!r||r===Ue){t.sectionDrop=null;return}const h=l.getBoundingClientRect();t.sectionDrop={uid:r,place:o.clientY-h.top<h.height/2?"before":"after"}}function Ti(e,o){const a=Ue,n=t.sectionDrop,s=t.dragging;cn(),s&&(re=!0,e.setTimeout(()=>{re=!1},0)),!(!s||!a||!n?.uid||n.uid===a)&&(o?.preventDefault?.(),xi(e,a,n.uid,n.place))}function cn(){try{lt?.releasePointerCapture?.(dt)}catch{}$t?.(),Ue=null,Ve=null,lt=null,dt=null,t.dragging=!1,t.sectionDrop=null}function xi(e,o,a,n){const s=vt(e)||"page_sections";for(const l of jt(e.document)||[]){const r=Kt(l.values),h=r&&typeof r=="object"?r[s]:null;if(!Array.isArray(h))continue;const f=E=>h.findIndex(x=>x&&typeof x=="object"&&[x._visual_id,x.id,x._id].includes(E)),g=f(o),P=f(a);if(g===-1||P===-1||g===P)return!1;let y=n==="before"?P:P+1;return g<y&&(y-=1),y===g?!1:(e.postMessage({source:G,type:B.MOVE,uid:o,toIndex:y},e.location.origin),e.setTimeout(()=>H(e),60),!0)}return!1}function Nt(e,o){if(o?.kind==="component"){wi(e,o);return}if(J.callOpen&&(J.callOpen=!1,J.callStore=null,z.forget(),Wt(e)),o?.kind!=="antlers"){t.inspect=null;return}const a=o.id,n={logic:!0,path:o.path};if(o.tag==="else"){t.inspect={key:a,...n,title:v(e,"antlers_condition"),mode:"note",note:v(e,"antlers_else_note")};return}if(o.antlers==="loop"){t.inspect={...es(e,o,{key:a,draft:Te?.id===o.id?Te.dir:""}),...n};return}t.inspect={key:a,...n,title:v(e,"antlers_condition"),mode:"condition",value:o.expr||"",placeholder:v(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:v(e,"antlers_add_elseif")},{id:"else",label:v(e,"antlers_add_else")}]}}function wi(e,o){if(!Ha(e)){t.inspect=null;return}if(!o.src)return;const a=o.id;if(t.inspect={key:a,title:v(e,"component_props_values"),mode:"note",note:v(e,"code_dock_loading")},Ea()){const n={},s={},l=new Map;for(const[r,h]of Ma(W().slice(o.from,o.to))){const f=La(r);f&&(r!==f||!l.has(f))&&l.set(f,h)}for(const[r,h]of l)h.bound?s[r]=h.value:n[r]=h.value;t.inspect=null,J.callOpen=!0,J.title=J.title||v(e,"component_props"),J.callTitle=o.klass||o.name||o.src,J.callStore=z.ui,z.ui.canBind=!0,z.ui.dataTitle=v(e,"data_vars_title"),z.ui.exprPlaceholder=v(e,"component_props_expr"),z.ui.onBox=(r,h)=>Si(e,r,h),z.ui.onPickData=(r,h)=>b("dock:data-menu",{anchor:h,at:o.from,types:Ia(z.ui.fields.find(f=>f.handle===r)?.type),onPick:f=>hn(e,r,String(f?.var||"").trim())}),z.load(e,{key:`${o.src}::${a}`,src:o.src,params:n,bindings:s,readOnly:b("dock:is-locked")===!0}),z.watch(e,{src:o.src,write:r=>_i(e,r,s)}),Wt(e);return}Ra(e,o.src).then(n=>{if(t.inspect?.key===a){if(!n.length){t.inspect={key:a,title:v(e,"component_props_values"),mode:"note",note:v(e,"component_props_values_none")};return}t.inspect={key:a,title:v(e,"component_props_values"),mode:"props",inheritLabel:v(e,"component_props_inherit"),rows:Oa(n,W().slice(o.from,o.to))}}})}function _i(e,o,a={}){const n=t.rows.find(r=>r.id===I);if(n?.kind!=="component"||b("dock:is-locked"))return;let s=W(),l=n.to;for(const[r,h]of Object.entries(o||{})){if(r in a)continue;const f=s.length,g=Gt(s,{from:n.from,to:l},r,h);g!==s&&(l+=g.length-f,s=g)}s!==W()&&(Oe(s,{save:!0}),H(e))}function hn(e,o,a){un(e,o,a,!0),H(e)}function Si(e,o,a){const n=Aa(a);if(n){hn(e,o,n);return}z.forget(),un(e,o,String(a??"").trim(),!1),H(e)}function un(e,o,a,n){const s=t.rows.find(h=>h.id===I);if(s?.kind!=="component"||b("dock:is-locked"))return;const l=W(),r=Gt(l,s,o,a,{bound:n});r!==l&&Oe(r,{save:!0})}function ut(){const e=t.rows.find(o=>o.id===I);return e?.kind==="antlers"&&!b("dock:is-locked")?e:null}function se(e,o){const a=ut();if(!a)return;const n=W(),s=o(n,a);s!==n&&(Oe(s),H(e))}function So(e,o,a,n){const s=t.rows.find(h=>h.id===I);if(s?.kind!=="component"||b("dock:is-locked"))return;const l=W(),r=Gt(l,s,o,a,{bound:n});r!==l&&(Oe(r,{save:!0}),H(e))}function Ci(e,o){se(e,(a,n)=>n.antlers==="loop"?ss(n,o)(a,n):Ua(a,n,o))}function Pi(e,o){const a=ut();if(!a||a.antlers!=="loop")return;const n=Ja(e,a,o);n&&se(e,n)}function Hi(e,o){se(e,(a,n)=>qa(a,n,o))}function Ei(e,o){if(!e||!o||Bo(o)||No(o.tag))return null;const a=Pa(e,o);if(a<o.openTo)return null;const n=e.lastIndexOf(`
`,a-1)+1;return e.slice(n,a).trim()===""&&n>o.openTo?n-1:a}function Le(e,o,a,{reveal:n=!0}={}){if(re)return;const s=(a||t.rows).find(l=>l.id===o);s&&(I=o,t.rows.forEach(l=>{l.current=l.id===o}),Nt(e,s),!ct()&&(n&&(b("dock:reveal-html",{from:s.from,to:s.to,caret:Ei(W(),s)}),b("dock:tw-follow")),ke({source:G,type:B.SVE_HTML_PICK_FOCUS,path:s.path,src:s.kind==="component"&&s.src||""},e)))}function Mi(e,o){if(!o)return"";const a=[],n=(s,l)=>{for(const r of s||[]){const h=l||r.path===e;r.kind==="component"&&r.src===o&&a.push({path:r.path,inside:h}),n(r.children,h)}};return n(pe,!1),(a.find(s=>s.inside)||a[0])?.path||""}function Li(e,o,{reveal:a=!0}={}){if(!o||!X(e.document))return;ge=!1;const n=t.rows.find(l=>l.current);if(n&&n.path===o){Le(e,n.id,t.rows,{reveal:a});return}H(e),et(o),H(e);const s=t.rows.find(l=>l.path===o);s&&(Le(e,s.id,t.rows,{reveal:a}),e.setTimeout(()=>{X(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function Vt(e){if(at)return;const o=()=>{t.editingId||t.dragging||(e.clearTimeout(st),st=e.setTimeout(()=>{X(e.document)&&H(e)},80))},a=()=>{if(o(),b("dock:on-empty-page")===!0){const n=We(e,e.document);n.length===1&&mt(e,e.document,n,n[0].uid,"")}};at=Do("dock:html-changed",o),e.document.addEventListener("sve-page-structure",a),Rt=()=>{e.document.removeEventListener("sve-page-structure",a)}}function Ii(e){at?.(),at=null,Rt?.(),Rt=null,e?.clearTimeout?.(st),st=0}function no(e){const o=X(e.document);if(ke({source:G,type:B.SVE_HTML_PICK,on:!1},e),Ii(e),z.forget(),J.callOpen=!1,J.callStore=null,Wt(e),Ge(),N(),Ta(e),I=null,t.inspect=null,t.editingId=null,t.draft="",t.sections=[],t.pageBuilder=!1,t.layoutFile=!1,Y="",e?.clearTimeout?.(_e),!o){Et(e);return}o.remove(),qt.headerTab==="html_tree"&&Yn(e,null),Xn(e),Mo(e),Lo(e),Et(e)}const vn="button[title], button[data-tip], label[title]";function Gi(e,o){o.querySelector("[data-sve-html-tree-list]")||(o.id=tt,Io(e,o,{only:vn}),Fe(o,qo,{title:v(e,"html_tree")}),o.querySelector("[data-sve-close]")?.addEventListener("click",()=>no(e)))}function Zi(e){Vt(e),H(e)}function fn(e){const o=e.document;if(!Pn(e,"html_tree"))return;if(X(o)){Vt(e),H(e);return}if(!Go(o))return;ge=!0,O.clear(),Wn(e,[tt]);const a=o.createElement("div");a.id=tt,Io(e,a,{only:vn}),a.style.cssText=Gn,Fe(a,qo,{title:v(e,"html_tree")}),a.querySelector("[data-sve-close]")?.addEventListener("click",()=>no(e)),Zn(e,a),Mo(e),Lo(e),Et(e),Vt(e),H(e)}function Qi(e){if(X(e.document)){no(e);return}fn(e)}Yt("html-tree:open-section",e=>{const o=window,a=o.document,n=We(o,a),s=n.find(l=>l.uid===e||l.ids.includes(e));return s?(mt(o,a,n,s.uid,""),{uid:s.uid,ids:s.ids}):null});Yt("html-tree:from-preview",({path:e,src:o,uid:a,reveal:n=!0}={})=>{if(!jo(window,e)){if(!e){Ri(window,a);return}Li(window,Mi(e,o)||e,{reveal:n})}});function Ri(e,o){if(!o||!X(e.document))return;const a=We(e,e.document),n=Xe(o,e.document),s=a.find(l=>l.ids.some(r=>n.includes(r)));s&&(ge&&(ge=!1,O.clear(),I=null),Y&&Y!==s.uid&&(e.clearTimeout(_e),Y="",U=""),!b("dock:load-settled")&&H(e))}Yt("html-tree:arm-pick",e=>{const o=window;return e?(tn(o,Ye(W(),Zt(o))),!0):(X(o.document)||ke({source:G,type:B.SVE_HTML_PICK,on:!1},o),!0)});function Ji(){Se.clear(),Be.clear(),It.clear(),nt.clear(),qe.length=0}export{Br as HTML_TREE_STYLE_ID,Wi as armHtmlTreePrefetch,Ji as clearHtmlTreeTemplates,N as closeHtmlTreeMenu,no as closeHtmlTreePanel,Ur as ensureHtmlTreeStyles,Gi as fillHtmlTreePane,I as htmlTreeActiveId,X as htmlTreePanel,st as htmlTreeTimer,at as htmlTreeUnhook,fn as openHtmlTreePanel,H as renderHtmlTree,Zi as showHtmlTreePane,Ii as stopWatchHtmlTreeDock,Qi as toggleHtmlTreePanel,Vt as watchHtmlTreeDock};
