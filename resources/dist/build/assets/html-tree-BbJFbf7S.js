import{q as f,f as bn,o as v,c as k,a as O,t as L,u as l,e as Tn,l as xn,F as $,j as te,g as S,w,Y as $e,N as K,aa as wn,a2 as _n,ag as xe,k as _t,ae as Sn,X as ie,aD as Cn,v as so,x as Pn,W as En,aE as Hn,ac as To,aF as Mn,D as it,m as Ft,p as Bt,V as Ne,a8 as Ln,aG as In,aH as On}from"./addon-DGT48uM6.js";import{c as xo,a as Rn,o as $n,b as Dn,d as An,T as Fn,i as Bn,r as Nn,e as Vn,f as jn,u as ro,l as io}from"./section-create-ENXhT-zI.js";import{canEditFields as wo,openGlobalFieldsOverlay as Kn,openFieldsetOverlay as _o}from"./section-fields-CE1i6bQq.js";import{U as t,V as Un,W as J,X as qn,b,s as Nt,y as ue,j as St,H as Yn,i as zn,E as So,F as Co,Y as lo,Z as Po,m as De,D as Xn,R as Wn,G as Gn,_ as lt,$ as Zn,a0 as co,a1 as Jn,a2 as Qn,a3 as Eo,a4 as Ho,a5 as Mo,a6 as ea,a7 as ta,o as Lo,a8 as oa,a9 as Io,l as dt,aa as Ue,ab as Oo,ac as na,ad as Vt,ae as aa,af as sa,ag as ra,x as ia,ah as la,ai as da,aj as ca,ak as Ro,al as $o,am as ha,an as ua,ao as fa,ap as va,aq as Do,ar as ma,as as pa,A as ga,at as jt}from"./lp-cluster-2Fx3PAa1.js";import{H as We,u as ka,d as ya}from"./shortcuts-BIxtNjMb.js";import{_ as Kt,o as Pe}from"./ChoiceDialog-DOjZ8x9F.js";import{M as B,S as W}from"./protocol-BVdEmGBQ.js";import{C as ba,H as Ee,s as Ut,c as Ta,a as xa,b as Ao,t as wa,d as we,h as Fo,e as _a,f as Sa,w as qt,g as Ca,i as Pa,j as Ea,p as Ha,r as Ma,k as La,l as Ia,m as Oa,v as Ra,n as $a,o as Da,q as Aa,u as Fa,x as Ba,y as Na,z as Va,A as ja,B as ho,D as Ka,E as Ua}from"./component-extract-C-DLUPDn.js";import{H as qa,o as Ya,e as za}from"./logic-popup-DkPxDo8l.js";import{b as Xa}from"./html-pick-align-BNtmyz2s.js";import{l as Wa,a as Ga,b as Za,c as Ja,d as Qa,e as es,f as ts,g as os,h as ns}from"./loop-inspector-ClaXCUnL.js";import"./css-scope-DCelI6BX.js";import"./FieldsetOverlay-BZV1Xga4.js";import"./ai-text-icon-B7uCWIwa.js";import"./help-styles-5oPXUpmf.js";const mt=/\s*([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/y,as=/^\s*(?:([A-Za-z_$][\w$]*)|'([^'\\]*)'|"([^"\\]*)")\s*:\s*(true|false)\s*$/;function ss(e){const o=String(e||"").replace(/\{\{[\s\S]*?\}\}/g,s=>" ".repeat(s.length)),a=o.match(/^<[a-zA-Z][\w:-]*/);if(!a)return null;let n=a[0].length;for(;n<o.length;){mt.lastIndex=n;const s=mt.exec(o);if(!s){n+=1;continue}if(s[1].toLowerCase()==="x-data")return s[2]??s[3]??s[4]??"";n=mt.lastIndex}return null}function rs(e,o){const a=e[o];for(let n=o+1;n<e.length;n+=1)if(e[n]==="\\")n+=1;else if(e[n]===a)return n;return e.length-1}function is(e){const o=String(e||""),a=o.search(/\S/);if(a===-1||o[a]!=="{")return[];const n=new Map;let s=0,r="";const i=()=>{const h=r.match(as);h&&n.set(h[1]??h[2]??h[3],h[4]==="true"),r=""};for(let h=a;h<o.length;h+=1){const m=o[h];if(m==='"'||m==="'"||m==="`"){const g=rs(o,h);r+=o.slice(h,g+1),h=g;continue}if(m==="/"&&o[h+1]==="/"){const g=o.indexOf(`
`,h);h=g===-1?o.length:g-1;continue}if(m==="/"&&o[h+1]==="*"){const g=o.indexOf("*/",h+2);h=g===-1?o.length:g+1;continue}if(m==="{"||m==="["||m==="("){if(s+=1,s===1)continue}else if(m==="}"||m==="]"||m===")"){if(s-=1,s===0)break}else if(m===","&&s===1){i();continue}r+=m}return i(),[...n].map(([h,m])=>({key:h,value:m}))}const ls={class:"sve-html-tree"},ds={class:"sve-pane-bar","data-sve-pane-bar":""},cs={"data-sve-right-title":""},hs={"data-sve-right-actions":""},us=["aria-pressed","title","aria-label"],fs=["title"],vs={class:"sve-ht-used-by__label"},ms={class:"sve-ht-used-by__chips"},ps=["title","onClick"],gs={key:1,class:"sve-ht-used-by__chip"},ks={key:0,class:"sve-ht-used-by__empty"},ys={class:"sve-ht-tools"},bs=["title"],Ts=["placeholder","aria-label","value"],xs=["aria-label"],ws=["title","aria-label"],_s=["title","aria-label"],Ss={key:3,class:"sve-tree-exit"},Cs=["title"],Ps=["title"],Es='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',Hs='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',Ms='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',Ls='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',Is='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/></svg>',Os='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',Rs={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const o=f(window,"html_tree_search");t.layers=Un(window);const a=f(window,"html_tree_layers_on"),n=f(window,"html_tree_layers_off");function s(){qn(window,!t.layers)}const r=xo(window),i=f(window,"section_new"),h=f(window,"html_tree_add_element"),m=f(window,"html_tree_sections_slot"),g=f(window,"html_tree_sections_no_field");function E(){const H=t.templateSections.length?t.templateSections:[wn(window)],u=new Set(t.rows.filter(d=>d.kind==="sections").map(d=>d.tag));return H.filter(d=>!u.has(d)).map(d=>({tag:`sections:${d}`,label:H.length>1?`${m} · ${d}`:m,noField:!t.templateSections.length}))}const T=bn(!1),M=f(window,"section_import");function x(){T.value=!1}async function R(H){if(!H)return;await _n(),t.onRefresh?.();const u=b("html-tree:open-section",H);u&&Nn(window,u.ids)}function _(){const H=t.rows.find(u=>u.current&&!u.context&&!u.synthetic)||null;return H?.lockedIn?t.rows.filter(u=>u.locked&&u.from<=H.from&&u.to>=H.to).sort((u,d)=>u.from-d.from)[0]||null:H}function ee(H){const u=H.getBoundingClientRect(),d=_();let p=null;const A=(F,Me,ae="")=>()=>{p?.dismiss(),p=null,x();const ht=Bn(window,F,d,Me);ht!==null&&(t.selectFrom={at:ht,left:4},ae&&window.Statamic?.$toast?.info?.(ae))};p=Pe(document,Ee,{items:[...Fn.map(F=>({label:F,onPick:A(F,`<${F}>`)})),...E().map(F=>({label:F.label,onPick:A(F.tag,F.label,F.noField?g:"")}))],x:Math.round(u.left),y:Math.round(u.bottom+4),onClose:()=>{p=null,x()}})}function ne(H){if(!T.value){if(T.value=!0,!(t.sections.length||t.pageBuilder)){ee(H.currentTarget);return}(async()=>{const u=await Rn(window);if(!u){x();return}const d=t.sections.length?t.sections[t.sections.length-1].uid:null,p=A=>{x(),R(A?.uid)};if(u==="static"){$n(window,{afterUid:d,onDone:p,onError:x,onClose:x});return}Dn(window,{afterUid:d,onDone:p,onError:x,onClose:x})})()}}function G(){if(T.value)return;T.value=!0;const H=!!(t.sections.length||t.pageBuilder);An(window,{intoTemplate:!H,after:H?null:_(),afterUid:H&&t.sections.length?t.sections[t.sections.length-1].uid:null,onDone:u=>{if(x(),H){R(u?.uid);return}Number.isInteger(u?.at)&&(t.selectFrom={at:u.at,left:4})},onError:x,onClose:x})}function N(H){const u=!!t.query;t.query=H,u!==!!H&&t.onQuery?.()}return(H,u)=>(v(),k("div",ls,[O("div",ds,[O("div",cs,L(e.title),1),O("div",hs,[O("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":l(t).layers?"true":"false",title:l(t).layers?l(n):l(a),"aria-label":l(t).layers?l(n):l(a),innerHTML:Es,onClick:s},null,8,us),u[5]||(u[5]=Tn('<button type="button" data-sve-right-pin aria-pressed="false" data-v-2763765f></button><button type="button" data-sve-close aria-label="Close" data-v-2763765f><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-2763765f><path d="M18 6 6 18" data-v-2763765f></path><path d="m6 6 12 12" data-v-2763765f></path></svg></button>',2))])]),l(t).usedBy?(v(),k("div",{key:0,class:"sve-ht-used-by",title:l(t).usedBy.hint||null},[O("span",vs,[O("span",{class:"sve-ht-used-by__icon","aria-hidden":"true",innerHTML:Is}),xn(" "+L(l(t).usedBy.label),1)]),O("span",ms,[(v(!0),k($,null,te(l(t).usedBy.items,d=>(v(),k($,{key:d.kind+":"+d.name},[d.onOpen?(v(),k("button",{key:0,type:"button",class:"sve-ht-used-by__chip sve-ht-used-by__chip--open",title:d.openLabel,onClick:p=>d.onOpen(p.currentTarget)},L(d.name),9,ps)):(v(),k("span",gs,L(d.name),1))],64))),128)),l(t).usedBy.empty?(v(),k("span",ks,L(l(t).usedBy.empty),1)):S("",!0)])],8,fs)):S("",!0),O("div",ys,[O("label",{class:"sve-ht-search",title:l(o)},[O("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:Ls}),O("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:l(o),"aria-label":l(o),value:l(t).query,autocomplete:"off",spellcheck:"false",onInput:u[0]||(u[0]=d=>N(d.target.value)),onKeydown:[u[1]||(u[1]=w(()=>{},["stop"])),u[2]||(u[2]=$e(w(d=>N(""),["prevent"]),["escape"]))]},null,40,Ts),l(t).query?(v(),k("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":l(o),innerHTML:Os,onClick:u[3]||(u[3]=d=>N(""))},null,8,xs)):S("",!0)],8,bs),l(r)&&(l(t).sections.length||l(t).pageBuilder||l(t).rows.length&&!l(t).layoutFile)?(v(),k("button",{key:0,type:"button",class:"sve-ht-new",title:l(t).sections.length||l(t).pageBuilder?l(i):l(h),"aria-label":l(t).sections.length||l(t).pageBuilder?l(i):l(h),innerHTML:Hs,onClick:ne},null,8,ws)):S("",!0),l(r)&&(l(t).sections.length||l(t).pageBuilder||l(t).rows.length&&!l(t).layoutFile)?(v(),k("button",{key:1,type:"button",class:"sve-ht-import",title:l(M),"aria-label":l(M),innerHTML:Ms,onClick:G},null,8,_s)):S("",!0)]),l(J).inSidebar?S("",!0):(v(),K(ba,{key:1})),u[6]||(u[6]=O("div",{"data-sve-html-tree-list":""},null,-1)),l(t).inspect?.logic?S("",!0):(v(),K(qa,{key:2})),l(t).exitOpen&&!l(J).inSidebar?(v(),k("div",Ss,[O("span",{class:"sve-tree-exit__name",title:l(t).exitName},L(l(t).exitName),9,Cs),O("button",{type:"button",class:"sve-tree-exit__go",title:l(t).exitTitle,onClick:u[4]||(u[4]=d=>l(t).onExit?.())},L(l(t).exitLabel),9,Ps)])):S("",!0)]))}},Bo=Kt(Rs,[["__scopeId","data-v-2763765f"]]);function No(e){return String(e||"").trim().toLowerCase()}function Ct(e,o){return o?[e.name,e.tag,e.klass,e.label,e.src].filter(a=>typeof a=="string"&&a).join(" ").toLowerCase().includes(o):!0}function $s(e,o){const a=No(o);if(!a)return{rows:e,hits:new Set};const n=new Set;for(const i of e)Ct(i,a)&&n.add(i.path);const s=[...n];return{rows:e.filter(i=>n.has(i.path)||s.some(h=>h.startsWith(`${i.path}/`))),hits:n}}const Ds=["title"],As={"data-sve-ht-indent":"","aria-hidden":"true"},Fs=["data-sve-ht-cat"],Bs={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},Ns={key:2,"data-sve-ht-letter":""},Vs=["innerHTML"],js=["title"],Ks=["data-sve-ht-classes","title"],Us={key:1,"data-sve-ht-kind":""},qs={key:3,"data-sve-ht-name":""},Ys={key:4,"data-sve-ht-actions":""},zs=["data-on","title","innerHTML"],Xs=["title"],Ws={key:5,"data-sve-ht-actions":""},Gs=["data-on","title","innerHTML"],Zs=["data-on","title","innerHTML"],Js=["disabled","title"],Qs=["disabled","title","innerHTML"],er=["disabled","title"],tr=["disabled","title"],or=["aria-label"],nr=["data-sve-ht-id"],ar='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',sr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',rr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',ir='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',lr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',dr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',cr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',uo='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6.5" width="20" height="11" rx="5.5"/><circle cx="7.5" cy="12" r="3" fill="currentColor" stroke="none"/></svg>',fo='<svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M7.5 5.5h9a6.5 6.5 0 0 1 0 13h-9a6.5 6.5 0 0 1 0-13ZM16.5 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6Z"/></svg>',hr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',ur='<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>',fr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',vr=120,mr={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const o=wo(window);function a(u){return u.synthetic?u.frame==="main"?t.frameMainTitle:u.frame==="template"?t.frameTemplateTitle:t.frameOpenTitle:u.kind==="component"?u.src?`partial:${u.src}`:u.tag:u.name?`${u.tag} ${u.name}`:u.tag}function n(u){return!!u.section}function s(u){return!!u.frame}function r(u){return u.kind==="slot"}function i(u,d){s(d)||r(d)||(n(d)?t.onSectionPointerDown?.(u,d.section):d.sectionRoot?t.onSectionPointerDown?.(u,d.sectionRoot):t.onPointerDown?.(u,d.id))}function h(u,d){if(u.synthetic){t.onFrame?.(u.frame);return}if(n(u)){t.onSection?.(u.section);return}t.onSelect?.(u.id,d)}function m(u,d){const p={"data-sve-ht-id":u.id};return u.locked&&(p["data-sve-ht-locked"]=""),u.current&&(p["data-sve-ht-current"]=""),(u.hidden||u.sectionOff)&&(p["data-sve-ht-hidden"]=""),(u.videoNth>=0||u.alpineNth>=0)&&(p["data-sve-ht-special"]=""),p["data-sve-ht-cat"]=u.cat||"other",p["data-sve-ht-depth"]=String(u.depth),d&&(p["data-sve-ht-dim"]=""),n(u)&&(p["data-sve-ht-sec"]=""),s(u)&&(p["data-sve-ht-frame"]=u.frame),!n(u)&&t.dropId===u.id&&t.dropPlace&&(p["data-sve-ht-drop"]=t.dropPlace),p}function g(u){return!!u.fixed}function E(u){return u.kind==="sections"}function T(u){return!!(u.locked||u.lockedIn)}function M(u){return!u.lockedIn&&!g(u)}function x(u){return G(u)||!g(u)&&!E(u)&&!T(u)&&(!u.hidden||u.wrapFrom!=null)}function R(u){if(!N(u))return t.lockedTitle;const d=u.hidden||u.sectionOff;return G(u)?d?t.sectionShowTitle:t.sectionHideTitle:d?t.showTitle:t.hideTitle}let _=null;function ee(u,d){window.clearTimeout(_),_=window.setTimeout(()=>t.onMore?.(u,d.id),vr)}function ne(){window.clearTimeout(_)}function G(u){return!!u.sectionRoot||!!u.section}function N(u){return t.canEdit&&!T(u)||G(u)}function H(){return t.look==="tags"&&!t.layers}return(u,d)=>(v(),k($,null,[O("div",xe({"data-sve-ht-row":""},m(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:d[43]||(d[43]=p=>h(e.row,p.currentTarget)),onDblclick:d[44]||(d[44]=w(p=>e.row.synthetic?l(t).onFrameEnter?.(e.row.frame):s(e.row)||r(e.row)||n(e.row)?null:l(t).onRename?.(e.row.id),["prevent"])),onKeydown:[d[45]||(d[45]=$e(w(p=>h(e.row,p.currentTarget),["prevent"]),["enter"])),d[46]||(d[46]=$e(w(p=>h(e.row,p.currentTarget),["prevent"]),["space"]))],onPointerdown:d[47]||(d[47]=p=>i(p,e.row)),onPointerenter:d[48]||(d[48]=p=>n(e.row)?l(t).onSectionHover?.(e.row.section):null),onContextmenu:d[49]||(d[49]=w(p=>s(e.row)||r(e.row)||n(e.row)?null:l(t).onContext?.(p,e.row.id),["prevent","stop"]))}),[O("span",As,[(v(!0),k($,null,te(e.row.guides||[],(p,A)=>(v(),k("i",{key:A,"data-sve-ht-cat":p},null,8,Fs))),128))]),e.row.hasChildren||e.row.emptyBlock?(v(),k("button",xe({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?l(t).mainShut:e.row.shut)?{"data-sve-ht-shut":""}:{},{innerHTML:sr,onClick:d[0]||(d[0]=w(p=>e.row.synthetic?l(t).onFrameTwist?.():n(e.row)?l(t).onSection?.(e.row.section):l(t).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:d[1]||(d[1]=w(()=>{},["stop"])),onDblclick:d[2]||(d[2]=w(()=>{},["stop"]))}),null,16)):(v(),k("span",Bs)),e.row.letter?(v(),k("span",Ns,L(e.row.letter),1)):(v(),k("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Vs)),O("span",{"data-sve-ht-text":"",title:l(t).renameTitle},[!e.row.kind&&!n(e.row)&&!s(e.row)?(v(),k("button",{key:0,type:"button","data-sve-ht-tag":"","data-sve-ht-classes":H()&&e.row.classes?e.row.classes:null,title:l(t).tagTitle,onClick:d[3]||(d[3]=w(()=>{},["stop","prevent"])),onPointerdown:d[4]||(d[4]=w(()=>{},["stop"])),onDblclick:d[5]||(d[5]=w(p=>l(t).onTagChange?.(p,e.row.id),["stop","prevent"]))},L(e.row.tag),41,Ks)):(v(),k("span",Us,L(e.row.tag),1)),l(t).editingId===e.row.id&&!n(e.row)?_t((v(),k("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":d[6]||(d[6]=p=>l(t).draft=p),onMousedown:d[7]||(d[7]=w(()=>{},["stop"])),onPointerdown:d[8]||(d[8]=w(()=>{},["stop"])),onClick:d[9]||(d[9]=w(()=>{},["stop"])),onDblclick:d[10]||(d[10]=w(()=>{},["stop"])),onKeydown:[d[11]||(d[11]=w(()=>{},["stop"])),d[12]||(d[12]=$e(w(p=>l(t).onRenameCommit?.(),["prevent"]),["enter"])),d[13]||(d[13]=$e(w(p=>l(t).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:d[14]||(d[14]=p=>l(t).onRenameCommit?.())},null,544)),[[Sn,l(t).draft]]):(v(),k("span",qs,L(H()&&e.row.display?e.row.display:e.row.name),1))],8,js),s(e.row)?(v(),k("span",Ys,[e.row.alpineNth>=0?(v(),k("button",{key:0,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:l(t).alpineTitle,innerHTML:e.row.alpineSet?fo:uo,onClick:d[15]||(d[15]=w(p=>l(t).onAlpineState?.(p,e.row.id),["stop","prevent"])),onPointerdown:d[16]||(d[16]=w(()=>{},["stop"])),onDblclick:d[17]||(d[17]=w(()=>{},["stop"]))},null,40,zs)):S("",!0),e.row.frame!=="main"&&l(o)?(v(),k("button",{key:1,type:"button","data-sve-ht-fields":"",title:l(t).frameFieldsTitle,innerHTML:ar,onClick:d[18]||(d[18]=w(p=>l(t).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:d[19]||(d[19]=w(()=>{},["stop"])),onDblclick:d[20]||(d[20]=w(()=>{},["stop"]))},null,40,Xs)):S("",!0)])):r(e.row)?S("",!0):(v(),k("span",Ws,[e.row.videoNth>=0?(v(),k("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?l(t).videoPlayTitle:l(t).videoHoldTitle,innerHTML:e.row.videoHeld?cr:dr,onClick:d[21]||(d[21]=w(p=>l(t).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:d[22]||(d[22]=w(()=>{},["stop"])),onDblclick:d[23]||(d[23]=w(()=>{},["stop"]))},null,40,Gs)):S("",!0),e.row.alpineNth>=0?(v(),k("button",{key:1,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:l(t).alpineTitle,innerHTML:e.row.alpineSet?fo:uo,onClick:d[24]||(d[24]=w(p=>l(t).onAlpineState?.(p,e.row.id),["stop","prevent"])),onPointerdown:d[25]||(d[25]=w(()=>{},["stop"])),onDblclick:d[26]||(d[26]=w(()=>{},["stop"]))},null,40,Zs)):S("",!0),e.row.locked?(v(),k("button",{key:2,type:"button","data-sve-ht-lock":"","data-on":"",disabled:!l(t).canEdit||!l(t).canUnlock,title:l(t).canUnlock?l(t).unlockTitle:l(t).lockedByTitle,"aria-pressed":"true",innerHTML:hr,onClick:d[27]||(d[27]=w(p=>l(t).onLock?.(e.row.id),["stop","prevent"])),onPointerdown:d[28]||(d[28]=w(()=>{},["stop"])),onDblclick:d[29]||(d[29]=w(()=>{},["stop"]))},null,40,Js)):S("",!0),x(e.row)?(v(),k("button",{key:3,type:"button","data-sve-ht-eye":"",disabled:!N(e.row),title:R(e.row),innerHTML:e.row.hidden||e.row.sectionOff?ir:rr,onClick:d[30]||(d[30]=w(p=>l(t).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:d[31]||(d[31]=w(()=>{},["stop"])),onDblclick:d[32]||(d[32]=w(()=>{},["stop"]))},null,40,Qs)):S("",!0),!g(e.row)&&!E(e.row)?(v(),k("button",{key:4,type:"button","data-sve-ht-dup":"",disabled:!N(e.row),title:N(e.row)?l(t).duplicateTitle:l(t).lockedTitle,innerHTML:lr,onClick:d[33]||(d[33]=w(p=>l(t).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:d[34]||(d[34]=w(()=>{},["stop"])),onDblclick:d[35]||(d[35]=w(()=>{},["stop"]))},null,40,er)):S("",!0),g(e.row)?S("",!0):(v(),k("button",{key:5,type:"button","data-sve-ht-del":"",disabled:!N(e.row),title:N(e.row)?l(t).deleteTitle:l(t).lockedTitle,innerHTML:fr,onClick:d[36]||(d[36]=w(p=>l(t).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:d[37]||(d[37]=w(()=>{},["stop"])),onDblclick:d[38]||(d[38]=w(()=>{},["stop"]))},null,40,tr)),M(e.row)?(v(),k("button",{key:6,type:"button","data-sve-ht-more":"","aria-label":l(t).moreTitle,"aria-haspopup":"menu",innerHTML:ur,onPointerenter:d[39]||(d[39]=p=>ee(p.currentTarget,e.row)),onPointerleave:ne,onClick:d[40]||(d[40]=w(p=>{ne(),l(t).onMore?.(p.currentTarget,e.row.id)},["stop","prevent"])),onPointerdown:d[41]||(d[41]=w(()=>{},["stop"])),onDblclick:d[42]||(d[42]=w(()=>{},["stop"]))},null,40,or)):S("",!0)]))],16,Ds),e.row.emptyBlock&&!e.row.shut?(v(),k("div",xe({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},l(t).dropId===e.row.id&&l(t).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),L(l(t).slotText),17,nr)):S("",!0)],64))}},Z=Kt(mr,[["__scopeId","data-v-4f2157c5"]]),pr=["data-sve-ht-look","data-sve-ht-layers"],gr={key:0,class:"sve-ht-page-template"},kr={key:0,class:"sve-ht-page-template__text"},yr={class:"sve-ht-page-template__note"},br={key:1,class:"sve-ht-empty"},Tr={key:2,class:"sve-ht-empty"},xr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},wr={key:0,class:"sve-ht-empty"},_r={key:0,class:"sve-ht-empty"},Sr=["data-sve-ht-under-main"],Cr={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},Pr={key:0,class:"sve-ht-empty"},Er=["data-sve-ht-under-main"],Hr=["data-dim"],Mr={key:0,class:"sve-ht-empty"},Lr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},Ir={key:0,class:"sve-ht-empty"},Or={key:4,"data-sve-ht-branch":"","data-sve-ht-cat":"component"},Rr={__name:"HtmlTreeList",setup(e){const o=ie(()=>No(t.query)),a=ie(()=>$s(t.rows,o.value)),n=ie(()=>a.value.rows),s=ie(()=>o.value?t.sections.filter(x=>Ct(x.row,o.value)||x.current&&x.ready&&n.value.length>0):t.sections);function r(x){return!!x&&(!o.value||Ct(x,o.value))}function i(x){const R=t.frame?.kind;return t.inComponent||(R==="header"||R==="footer")&&R!==x}const h=ie(()=>t.frame?.kind==="header"||t.frame?.kind==="footer"),m=ie(()=>!!t.frame&&["header","main","footer"].some(x=>r(t.frame[x]))),g=ie(()=>!!t.frame&&(t.frame.kind==="main"||r(t.frame.main))),E=ie(()=>!!o.value&&!s.value.length&&!n.value.length&&!m.value);function T(x){return!!o.value&&!a.value.hits.has(x.path)}function M(x){const R={"data-sve-ht-sec-uid":x.uid};return x.current&&(R["data-sve-ht-branch"]="",R["data-sve-ht-cat"]=x.row?.cat||"layout"),t.sectionDrop&&t.sectionDrop.uid===x.uid&&(R["data-sve-ht-drop"]=t.sectionDrop.place),R}return(x,R)=>(v(),k("div",xe({class:"sve-ht-root","data-sve-ht-look":l(t).layers?"tags":l(t).look,"data-sve-ht-layers":l(t).layers?"":null,style:l(t).familyStyle},l(t).dragging?{"data-sve-ht-dragging":""}:{}),[l(t).pageTemplate?(v(),k("div",gr,[l(t).pageTemplate.text?(v(),k("p",kr,L(l(t).pageTemplate.text),1)):S("",!0),O("p",yr,L(l(t).pageTemplate.note),1),l(t).pageTemplate.canOpen?(v(),k("button",{key:1,type:"button",class:"sve-ht-page-template__open",onClick:R[0]||(R[0]=_=>l(t).pageTemplate.onOpen(_.currentTarget))},L(l(t).pageTemplate.openLabel),1)):S("",!0)])):!l(t).rows.length&&!l(t).sections.length&&!l(t).frame?(v(),k("div",br,L(l(t).emptyText),1)):E.value?(v(),k("div",Tr,L(l(t).searchEmpty),1)):S("",!0),l(t).frame||l(t).sections.length?(v(),k($,{key:3},[l(t).frame?(v(),k($,{key:0},[l(t).frame.kind==="header"?(v(),k("div",xr,[(v(!0),k($,null,te(n.value,_=>(v(),K(Z,{key:_.id,row:_,dim:T(_)},null,8,["row","dim"]))),128)),l(t).rows.length?S("",!0):(v(),k("div",wr,L(l(t).emptyText),1))])):!h.value&&r(l(t).frame.header)?(v(),K(Z,{key:1,row:l(t).frame.header,dim:i("header")},null,8,["row","dim"])):S("",!0)],64)):S("",!0),h.value?S("",!0):(v(),k("div",Cn(xe({key:1},l(t).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[l(t).frame?.kind==="main"?(v(),k($,{key:0},[(v(!0),k($,null,te(n.value,_=>(v(),K(Z,{key:_.id,row:_,dim:T(_)},null,8,["row","dim"]))),128)),l(t).rows.length?S("",!0):(v(),k("div",_r,L(l(t).emptyText),1))],64)):l(t).frame&&r(l(t).frame.main)?(v(),K(Z,{key:1,row:l(t).frame.main,dim:i("main")},null,8,["row","dim"])):S("",!0),l(t).frame?.kind==="template"?_t((v(),k("div",{key:2,"data-sve-ht-frame-body":"","data-sve-ht-under-main":g.value?"":null},[O("div",Cr,[(v(!0),k($,null,te(n.value,_=>(v(),K(Z,{key:_.id,row:_,dim:T(_)},null,8,["row","dim"]))),128)),l(t).rows.length?S("",!0):(v(),k("div",Pr,L(l(t).emptyText),1))])],8,Sr)),[[so,!l(t).mainShut]]):S("",!0),l(t).sections.length||l(t).frame?_t((v(),k("div",{key:3,"data-sve-ht-frame-body":"","data-sve-ht-under-main":g.value?"":null},[l(t).frame?.template&&r(l(t).frame.template)?(v(),K(Z,{key:0,row:l(t).frame.template,dim:i("template")},null,8,["row","dim"])):S("",!0),l(t).frame&&!l(t).frame.template&&!l(t).sections.length&&!o.value?(v(),k("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":i("")?"":void 0},L(l(t).frameEmptyText),9,Hr)):S("",!0),(v(!0),k($,null,te(s.value,_=>(v(),k("div",xe({key:_.uid},{ref_for:!0},M(_)),[_.ready?(v(),k($,{key:0},[(v(!0),k($,null,te(n.value,ee=>(v(),K(Z,{key:ee.id,row:ee,dim:T(ee)},null,8,["row","dim"]))),128)),l(t).rows.length?S("",!0):(v(),k("div",Mr,L(l(t).emptyText),1))],64)):(v(),K(Z,{key:1,row:_.row,dim:i("")},null,8,["row","dim"]))],16))),128))],8,Er)),[[so,!l(t).frame||!l(t).mainShut]]):S("",!0)],16)),l(t).frame?(v(),k($,{key:2},[l(t).frame.kind==="footer"?(v(),k("div",Lr,[(v(!0),k($,null,te(n.value,_=>(v(),K(Z,{key:_.id,row:_,dim:T(_)},null,8,["row","dim"]))),128)),l(t).rows.length?S("",!0):(v(),k("div",Ir,L(l(t).emptyText),1))])):!h.value&&r(l(t).frame.footer)?(v(),K(Z,{key:1,row:l(t).frame.footer,dim:i("footer")},null,8,["row","dim"])):S("",!0)],64)):S("",!0)],64)):l(t).inComponent&&l(t).rows.length?(v(),k("div",Or,[(v(!0),k($,null,te(n.value,_=>(v(),K(Z,{key:_.id,row:_,dim:T(_)},null,8,["row","dim"]))),128))])):l(t).rows.length?(v(!0),k($,{key:5},te(n.value,_=>(v(),K(Z,{key:_.id,row:_,dim:T(_)},null,8,["row","dim"]))),128)):S("",!0)],16,pr))}},pt=Kt(Rr,[["__scopeId","data-v-d0376715"]]);let gt=null;function $r(e){return gt||(gt=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(o=>o.ok?o.json():{pages:[]}).then(o=>Array.isArray(o.pages)?o.pages:[]).catch(()=>[])),gt}let Ge=null;function kt(){Ge?.dismiss(),Ge=null}function Dr(e,o,a){kt();const n=o?.getBoundingClientRect?.(),s={x:n?n.left:0,y:n?n.bottom+4:0};$r(e).then(r=>{const i=r.length?r.map(h=>({label:h.title||h.url,onPick:()=>{kt(),a(h.url)}})):[{label:f(e,"component_props_pages_none"),onPick:null}];kt(),Ge=Pe(e.document,Ee,{items:i,x:s.x,y:s.y,onClose:()=>{Ge=null}})})}const Vo="sve-html-tree-labels";function jo(){try{const e=globalThis.localStorage?.getItem(Vo);if(!e)return{};const o=JSON.parse(e);return o&&typeof o=="object"?o:{}}catch{return{}}}function Ar(e){try{globalThis.localStorage?.setItem(Vo,JSON.stringify(e))}catch{}}function Ko(e){return String(e||"_")}function Uo(e){const o=jo()[Ko(e)];return o&&typeof o=="object"?{...o}:{}}function Fr(e,o,a){const n=a?.[o];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function Br(e,o,a,n){if(!o)return;const s=Ko(e),r=jo(),i={...r[s]||{}},h=String(a||"").replace(/\s+/g," ").trim(),m=String(n||"").trim();!h||h===m?delete i[o]:i[o]=h,Object.keys(i).length?r[s]=i:delete r[s],Ar(r)}function qo(e){for(const o of e||[]){if(o.kind==="component"||o.kind==="svg"&&o.dynamic)continue;const a=o.kind==="antlers"?qo(o.children):o;if(a)return a}return null}const U=_a("sve-call-values"),Nr="__sve-html-tree-style";function Vr(e,o,a){if(o||a)return!1;const n=String(b("dock:chrome-kind")||"");if(n==="header"||n==="footer")return!1;const s=To(e);return!!s&&s!=="create"&&Ln(e)!==In(e)}function Yo(e){return{sectionLoops:Mn(e),sectionsLabel:f(e,"html_tree_sections_slot")}}function jr(e,o){const a={entry:o,text:"",note:f(e,"html_tree_page_template_note"),openLabel:f(e,"html_tree_open_template"),canOpen:!1,onOpen:null};return Oo(e,{entry:o}).then(n=>{!n||t.pageTemplate?.entry!==o||(t.pageTemplate={...t.pageTemplate,text:f(e,"html_tree_page_template",{name:n.name}),canOpen:!!n.open,onOpen:n.open?s=>na(e,s,n.open):null})}),a}function Kr(e,o){const a=o.replace(/^view:/,"");if(!a||b("dock:current-type")!==o){t.usedBy=null,t.templateSections=[];return}t.usedBy?.view!==a&&(t.usedBy=null,Oo(e,{view:a}).then(n=>{if(!n||b("dock:current-type")!==o)return;const s=n.everything?[{name:f(e,"html_tree_used_by_everything"),kind:"everything",url:null}]:n.used_by.map(r=>({...r,...Ur(e,r)}));t.templateSections=Array.isArray(n.sections_fields)?n.sections_fields:[],t.usedBy={view:a,label:f(e,"html_tree_used_by"),items:s,empty:s.length?"":f(e,"html_tree_used_by_nobody"),hint:s.length?f(e,"html_tree_used_by_hint",{list:s.map(r=>r.name).join(", ")}):""}}))}function Ur(e,o){if(!o.url)return{openLabel:"",onOpen:null};const a=f(e,"html_tree_used_by_open",{name:o.name});return o.kind==="page"?{openLabel:a,onOpen:n=>la(e,n,da(e,o.url))}:{openLabel:a,onOpen:n=>ca(e,{anchor:n,url:o.url,subtitle:o.name})}}const q=new Set;let Pt="",Te=!1,yt=null,ce=!0,Y="",ge=0,zo="";const ke=new Map,Ae=new Set,Et=new Map,Ze=new Map;let j="",Xo=!1,I=null,Je=null,ze="",Qe="",et=0,Ht=null,_e=[],pe=null,Fe=null,tt=null,ot=null,Mt=null,he=!1,Q=null,Ve=null,Be=null,nt=null,at=null,Lt=null,me=null;function z(e){return e.getElementById(We)}function qr(e){Pn(e,Nr,`
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
  `)}function X(){const e=b("dock:html");return typeof e=="string"?e:""}function Wo(e){return!!b("dock:is-open",e)}function He(e,{save:o=!1,unlock:a=!1}={}){return Yt()||b("dock:set-html",a?{html:e,unlock:!0}:e)!==!0?!1:(o&&b("dock:save-now"),!0)}function bt(e){const o=b("dock:component-exit-state")||{};if(t.exitOpen=!!o.open,!o.open){t.onExit=null;return}t.exitName=o.name||"",t.exitLabel=f(e,"component_exit"),t.exitTitle=f(e,o.back?"component_exit_back":"component_exit_close"),t.onExit=()=>{b("dock:exit-component"),P(e)}}const je=[];let Tt=!1;function xt(e,o){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(o,{timeout:2e3});return}e.setTimeout(o,200)}function Yr(e,o){for(const a of o){const n=a.type;!n||ke.has(n)||Ae.has(n)||je.includes(n)||je.push(n)}Nt.htmlTreePrefetchArmed&&Go(e)}function Wi(e){Nt.htmlTreePrefetchArmed=!0,Go(e)}function Go(e){if(Tt||!je.length)return;Tt=!0;const o=()=>{const a=je.shift();if(!a){Tt=!1;return}if(ke.has(a)||Ae.has(a)){xt(e,o);return}Ae.add(a),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(a)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{if(typeof n?.html=="string"){ke.set(a,n.html);const s=Ze.get(a);Ze.delete(a),s&&s!==Zo(e,a)&&P(e)}}).catch(()=>{}).finally(()=>{Ae.delete(a),xt(e,o)})};xt(e,o)}function Yt(){return!!j}function Zo(e,o){return Jo(o)||On(e,o)||"section"}function Jo(e){const o=ke.get(e);if(!o)return"";const a=Et.get(e);if(a&&a.html===o)return a.tag;const n=zt(lt(o))?.tag||"";return Et.set(e,{html:o,tag:n}),n}function qe(e,o){const a=it(e)||"page_sections",n=[];for(const s of Ft(o)||[]){if(s.name===oa||s.name===ka)continue;const r=Bt(s.values),i=r&&typeof r=="object"?r[a]:null;if(Array.isArray(i)){i.forEach(h=>{if(!h||typeof h!="object"||Array.isArray(h)||typeof h.type!="string")return;const m=[h._visual_id,h.id,h._id].filter(x=>typeof x=="string"&&x!=="");if(!m.length)return;const g=Io(e,h),E=typeof h._sve_label=="string"?h._sve_label.trim():"",T=Zo(e,g);Jo(g)||Ze.set(g,T);const M=Uo(g)[`0:${T}`];n.push({uid:m[0],ids:m,type:g,tag:T,label:E||(typeof M=="string"&&M.trim()?M.trim():"")||dt(e,g)?.display||Ne(g)||g,svg:Fo(T,vo(T),null).svg||we.section,cat:Mo(T,vo(T)),enabled:h.enabled!==!1,static:Vn(e,g)})});break}}return n}function zr(e,o,a){if(!a.length)return"";const n=b("dock:current-type")||"",s=b("dock:current-uid"),r=!!b("dock:component-exit-state")?.open;if(s){const i=Ue(s,o),h=a.find(m=>m.ids.some(g=>i.includes(g)));if(h&&(r||h.type===n))return h.uid}return a.find(i=>i.type===n)?.uid||""}function Xr(e,o,a){const n=b("dock:component-exit-state");if(n?.open)return Ne(n.name)||n.name||"";if(a)return o.find(r=>r.uid===a)?.label||"";const s=b("dock:current-type")||"";return String(s).startsWith("view:")?"":dt(e,s)?.display||Ne(s)||""}function ct(e,o,a,n,s){const r=a.find(i=>i.uid===n);r&&n!==s&&(q.clear(),I=null,ce=!1,D(),Ye(),Y=n,zo=X(),j=ke.get(r.type)||"",j&&(I=Ot(lt(j))||null),Xo=(b("dock:current-type")||"")===r.type,e.clearTimeout(ge),ge=e.setTimeout(()=>{Y="",Te=!1,P(e)},4e3),P(e),ia(e,r.uid,"tree"),ue({source:W,type:B.SVE_ACTIVATE,ids:r.ids},e),e.setTimeout(()=>P(e),0))}function It(e,o){if(!o)return!1;for(const a of e||[])if(a.id===o||It(a.children,o))return!0;return!1}function Ot(e){return zt(e)?.id||""}function zt(e){for(const o of e||[]){if(Qo(o))return o;const a=zt(o.children);if(a)return a}return null}function Qo(e){return!e.kind||e.kind==="component"}function vo(e){return e==="component"?"component":""}function Wr(e,o){const a=o===0||e.path===Qe;return q.has(e.path)?a:!a}function Gr(e){const o=new Set,a=(n,s)=>{for(const r of n)r.children.length&&Wr(r,s)&&o.add(r.id),a(r.children,s+1)};return a(e,0),o}function P(e){const o=e.document,n=z(o)?.querySelector("[data-sve-html-tree-list]");if(!n)return;qr(o),xa(e);const s=X();j&&j===s&&(j=""),b("dock:chrome-kind")&&(j="");const r=j||s,i=lt(r,Yo(e));_e=i,Qe="";const h=b("dock:current-type")||"",m=Uo(h),g=Hn(e,o),T=!!(b("dock:component-exit-state")||{}).open;h&&s&&!j&&ke.set(h,s);const M=qe(e,o);Yr(e,M);const x=zr(e,o,M);if(Vr(e,g,T)){const c=To(e);_e=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!1,t.layoutFile=!1,t.usedBy=null,t.emptyText="",t.pageTemplate?.entry!==c&&(t.pageTemplate=jr(e,c)),t.onRefresh=()=>P(e),t.onSection=null,bt(e),De(n,pt),wt(e,[]);return}t.pageTemplate=null,Kr(e,String(b("dock:collection-view")||""));const R=String(b("dock:chrome-kind")||"");if(Zn(e),g&&!M.length&&!R){_e=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,t.layoutFile=!1,t.emptyText=f(e,"html_tree_page_empty"),t.canEdit=!b("dock:is-locked"),t.look=co(e),t.onRefresh=()=>P(e),t.onSection=null,bt(e),De(n,pt),wt(e,[]);return}t.pageBuilder=g;const _=`${h}|${x}`;let ee=!1;_!==Pt&&(Pt=_,q.clear(),yt!==null&&r!==yt?ee=!0:Te=r),(ee||Te!==!1&&r!==Te)&&(Te=!1,q.clear(),I=Ot(i)||null),yt=r,Y&&(Y===x||!M.length)&&(Xo||r!==zo)&&(e.clearTimeout(ge),Y="",Te=!1,It(i,I)||(q.clear(),I=Ot(i)||null));const ne=M.some(c=>c.uid===Y)?Y:"",G=ce?"":ne||x,N=!!(ne||x),H=N||T?"":String(b("dock:chrome-kind")||""),d=g&&(!h&&!N||H==="main"&&b("dock:on-empty-page")===!0),p=d||H==="template"?"":H;t.layoutFile=p==="main",p!=="main"&&(ze="");const A=p==="main"?mo(i,"main"):null,F=A?st(i,c=>c.tag==="body"&&It(c.children,A.id)):null;Qe=F?F.path:"",A&&(Xe((F||A).path),ze!==_&&(Xe(A.path),q.add(A.path)));const Me=p==="header"||p==="footer"?st(i,c=>r.slice(c.from,c.openTo).includes(`data-sve-chrome="${p}"`)):null,ae=Me||(p==="header"||p==="footer"?mo(i,p):null);ae&&Xe(ae.path);const V=d||!(p==="main"?!!A:p==="header"||p==="footer"?!!ae:!0)?[]:Jn(i,t.query?new Set:Gr(i));!r.trim()&&!Wo(o)?t.emptyText=f(e,"html_tree_need_dock"):t.emptyText=f(e,"html_tree_empty"),t.slotText=f(e,"antlers_drop_here"),t.dataTitle=f(e,"data_vars_title"),t.pageTitle=f(e,"component_props_page"),t.renameTitle=f(e,"html_tree_rename"),t.tagTitle=f(e,"tw_tag"),t.hideTitle=f(e,"html_tree_hide"),t.showTitle=f(e,"html_tree_show"),t.sectionHideTitle=f(e,"html_tree_section_hide"),t.sectionShowTitle=f(e,"html_tree_section_show"),t.moreTitle=f(e,"html_tree_more"),t.duplicateTitle=f(e,"html_tree_duplicate"),t.deleteTitle=f(e,"html_tree_delete"),t.videoHoldTitle=f(e,"html_tree_video_hold"),t.videoPlayTitle=f(e,"html_tree_video_play"),t.alpineTitle=f(e,"html_tree_alpine_state"),t.lockedTitle=f(e,"html_tree_locked"),t.searchEmpty=f(e,"html_tree_search_empty"),t.canEdit=!b("dock:is-locked"),t.look=co(e),t.onQuery=()=>P(e),bt(e),t.inComponent=T,t.onSelect=(c,y)=>{const C=V.find(Le=>Le.id===c);if(C&&Ao(e,C.path))return;y&&!Fa()&&(t.rowClicks+=1);const be=!!y&&C?.kind==="antlers"&&!he&&Qn(e);Ce(e,c,V),be&&Ya(e,{path:C.path,at:y,beside:z(e.document)})},t.onTwist=c=>{const y=V.find(C=>C.id===c)?.path;y&&(q.has(y)?q.delete(y):q.add(y),P(e))},t.onTagChange=(c,y)=>{const C=t.rows.find(be=>be.id===y);C&&!Yt()&&!Xt(e,C)&&wa(e,c.currentTarget,C)},t.onRename=c=>ni(e,c),t.onRenameCommit=()=>po(e,!0),t.onRenameCancel=()=>po(e,!1),t.onHide=c=>li(e,c),t.onLock=c=>on(e,c),t.onMore=(c,y)=>fi(e,c,y),t.canUnlock=tn(e),t.lockTitle=f(e,"html_tree_lock"),t.unlockTitle=f(e,"html_tree_unlock"),t.lockedByTitle=f(e,"html_tree_locked_by_developer"),t.onVideoHold=c=>si(e,c),t.onAlpineState=(c,y)=>ii(e,c,y),t.onDuplicate=c=>di(e,c),t.onDelete=c=>hi(e,c),t.onPointerDown=(c,y)=>pi(e,c,y),t.onSectionPointerDown=(c,y)=>yi(e,c,y),t.onSectionHover=c=>e.dispatchEvent(new e.CustomEvent("sve-lite-hover",{detail:{uid:c}})),t.onContext=(c,y)=>ln(e,c,y),t.onInspectCommit=c=>Ci(e,c),t.onPropValue=(c,y,C)=>bo(e,c,y,C),t.onPropPage=(c,y)=>Dr(e,c,C=>bo(e,y,C,!1)),t.onLoopKind=c=>Pi(e,c),t.onAddBranch=c=>Ei(e,c),t.onLoopSortField=c=>{const y=rt();if(!y)return;const C=me?.id===y.id?me.dir:"";me=null,oe(e,Wa(y,c,C))},t.onLoopSortDir=c=>{const y=rt();if(!y)return;const C=Ga(y,c);if(C.draft){me={id:y.id,dir:C.draft},Dt(e,y);return}me=null,oe(e,C.edit)},t.onLoopDepth=c=>oe(e,Qa(c)),t.onLoopIncludeHome=c=>oe(e,es(c)),t.onLoopLimit=c=>oe(e,ts(c)),t.onLoopOffset=c=>oe(e,os(c)),t.onPropHost=c=>c?U.mount(c):U.unmount(),t.onInspectData=(c,y)=>{b("dock:data-menu",{anchor:c,at:V.find(C=>C.id===I)?.from,onPick:C=>y(String(C?.var||"").trim())})};const Qt=V.find(Qo)?.id,eo=T?"":Xr(e,M,G),fe=G&&!T?M.find(c=>c.uid===G):null,vn=Eo(e,String(b("dock:current-type")||""));let mn=0;const pn=ri(Me?[Me]:i,r),gn=Ho(e,String(h)),se=p==="header"||p==="footer"?p:"",ye=ae?ae.id:"",ve=A&&V.find(c=>c.id===A.id)||null,to=F&&V.find(c=>c.id===F.id)||null,re=to||ve||ye&&V.find(c=>c.id===ye)||null,oo=re?ei(V,re):-1;if(re&&!V.slice(V.indexOf(re),oo).some(c=>c.id===I)&&(I=re.id),t.selectFrom){const c=V.find(y=>y.from===t.selectFrom.at&&(!y.kind||y.kind==="sections"));c?(I=c.id,t.selectFrom=null):--t.selectFrom.left<=0&&(t.selectFrom=null)}const no=t.layoutFile?Qr(e):null;t.rows=V.map(c=>{const y=no&&c.kind==="component"&&no.get(c.src)||"",C=c.tag==="body"&&!c.kind,be=y?{svg:we[y]}:Fo(c.tag,c.kind,c.antlers),Le=c.tag==="video"&&!c.kind?mn++:-1,Ie=pn.get(c.id),yn=Ie?gn[Ie.nth]||{}:{},ft=Ie?Ie.booleans.map(({key:Re,value:ao})=>({key:Re,file:ao,value:yn[Re]??ao})):[],vt=c.id===Qt&&eo?eo:c.klass,Oe=c.id===Qt;return{...c,tag:y||c.tag,frameCall:y,fixed:!!y||C,base:vt,name:y?f(e,`html_tree_frame_${y}`):se&&c.id===ye?f(e,`html_tree_frame_${se}`):c===ve?f(e,"html_tree_frame_main"):Oe&&fe?vt:Fr(vt,c.path,m),current:c.id===I,letter:be.letter||"",svg:se&&c.id===ye?we[se]:c===ve?we.main:Oe&&fe?fe.svg:be.svg||"",frame:se&&c.id===ye?se:c===ve?"main":"",cat:se&&c.id===ye?se:c===ve||C?"main":y||Mo(c.tag,c.kind,c.antlers),componentRoot:Oe&&T,sectionRoot:Oe&&fe?fe.uid:"",sectionOff:!!(Oe&&fe&&!fe.enabled),videoNth:Le,videoHeld:Le>=0&&vn.has(Le),alpineNth:ft.length?Ie.nth:-1,alpineKeys:ft,alpineSet:ft.some(Re=>Re.value!==Re.file)}});const kn=za(r,i);for(const c of t.rows){const y=c.kind?null:kn.get(c.path);y&&(c.classes=y.classes,y.kind!=="tag"&&!c.frame&&!c.fixed&&!c.sectionRoot&&c.name===c.klass&&(c.display=y.kind==="column"?f(e,"el_column",{n:y.index}):f(e,`el_${y.kind}`)))}ea(e),ta(e);const ut=[];for(const c of t.rows)ut.length=c.depth,c.guides=ut.slice(),ut[c.depth]=c.cat;if(re){const c=V.indexOf(re),y=re.depth;t.rows=t.rows.slice(c,oo).map(C=>({...C,depth:C.depth-y,guides:C.guides.slice(y)})),ve&&ze!==_&&(ze=_,e.setTimeout(()=>Ce(e,ve.id,V),0))}t.sections=g&&!T&&(N||p||d)?M.map(c=>{const y=!!G&&c.uid===G;return{...c,current:y,ready:y&&(!ne||!!j),row:{id:`sec:${c.uid}`,section:c.uid,tag:c.tag,name:c.label,kind:"",svg:c.svg,cat:c.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:y,hidden:!c.enabled}}}):[],t.frame=Jr(e,M,N,T,p,!1,!!to),t.frameEmptyText=f(e,"html_tree_frame_no_sections"),Zr(e,p),t.onSection=c=>{he||(Rt(e),ct(e,o,M,c,G))},t.onRefresh=()=>P(e),Dt(e,t.rows.find(c=>c.id===I)),De(n,pt),wt(e,i)}function Zr(e,o){t.frameOpenTitle=f(e,"html_tree_frame_open"),t.frameMainTitle=f(e,"html_tree_frame_main_open"),t.frameTemplateTitle=f(e,"html_tree_frame_template_open"),t.frameFieldsTitle=f(e,"html_tree_frame_fields"),t.onFrame=a=>{o===a?ti(e,a):$t(e,a)},t.onFrameEnter=a=>$t(e,a),t.onFrameFields=a=>Kn(e,sa(e,a),f(e,`html_tree_frame_${a}`)),t.onFrameTwist=()=>{t.mainShut=!t.mainShut}}function Jr(e,o,a,n,s,r=!1,i=!1){if(!s&&!r||i)return null;const h=E=>({id:`frame:${E}`,frame:E,synthetic:!0,tag:E,name:f(e,`html_tree_frame_${E}`),kind:"",svg:we[E]||"",cat:E,letter:"",depth:0,hasChildren:E==="main"&&(o.length>0||s==="template"),shut:E!=="main",current:!1,hidden:!1}),m={kind:s,header:h("header"),main:h("main"),footer:h("footer"),template:null},g=s&&s!=="template"?String(b("dock:collection-view")||""):"";return g&&(m.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:dt(e,g)?.display||Ne(g.replace(/^view:/,"")),kind:"",svg:we.section||"",cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),m}function mo(e,o){return st(e,a=>a.tag===o)}function st(e,o){for(const a of e||[]){if(!a.kind&&o(a))return a;const n=st(a.children,o);if(n)return n}return null}function Qr(e){const o=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},a=new Map;for(const n of["header","footer"]){const s=Ca(o[n]?.type);s&&a.set(s,n)}return a}function ei(e,o){let a=e.indexOf(o)+1;for(;a<e.length&&e[a].depth>o.depth;)a+=1;return a}function ti(e,o){const a=Do(e);(o==="main"||o==="template"?a?.querySelector("main"):a?.querySelector(`[data-sve-chrome="${o}"]`))?.scrollIntoView({behavior:"smooth",block:"start"})}function Rt(e){const o=String(b("dock:chrome-open",e.document)||"");return o!=="header"&&o!=="footer"?!1:(ra(e),ue({source:W,type:B.SVE_FORCE_EXIT_CHROME},e),!0)}function oi(e){e.clearTimeout(ge),Y="",j="",q.clear(),I=null,ce=!1,D(),Ye()}function $t(e,o){if(e.document,String(b("dock:chrome-kind")||"")===o)return;if(oi(e),o==="main"){Rt(e),b("dock:open-file",ya);return}if(o==="template"){const r=String(b("dock:collection-view")||"");r&&(Rt(e),b("dock:open-file",r));return}if(o!=="header"&&o!=="footer")return;const a=Do(e)?.querySelector(`[data-sve-chrome="${o}"]`);a?(a.scrollIntoView({block:"nearest"}),a.dispatchEvent(new a.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:W,type:B.OPEN_CHROME,kind:o},e.location.origin);const n=Date.now(),s=async()=>{if(String(b("dock:chrome-kind")||"")!==o){Date.now()-n<3e4&&e.setTimeout(s,250);return}await(b("dock:load-settled")||null),fn(e)};e.setTimeout(s,250)}function wt(e,o){z(e.document)&&en(e,o)}function en(e,o){const a=qo(o),n=!!b("dock:component-src"),s=n?"":b("dock:current-uid")||"";ue({source:W,type:B.SVE_HTML_PICK,on:!0,uid:s,uids:s?Ue(s,e.document):[],all:n,tag:a?.tag||"",klass:a?.klass||"",nodes:Xa(o)},e)}function Xe(e){if(!e)return;const o=(a,n)=>{for(const s of a||[]){if(s.path===e)return!0;if(o(s.children,n+1))return n===0||s.path===Qe?q.delete(s.path):q.add(s.path),!0}return!1};o(_e,0)}function ni(e,o){if(he)return;const a=t.rows.find(n=>n.id===o);Xt(e,a)||!a||a.kind||(I=o,t.rows.forEach(n=>{n.current=n.id===o}),t.editingId=o,t.draft=a.name,e.setTimeout(()=>{const n=z(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function po(e,o){const a=t.editingId;if(!a)return;const n=t.rows.find(s=>s.id===a);t.editingId=null,o&&n&&(n.sectionRoot?ai(e,n.sectionRoot,t.draft):Br(b("dock:current-type")||"",n.path,t.draft,n.base||n.klass)),t.draft="",P(e)}function ai(e,o,a){const n=it(e)||"page_sections",s=String(a||"").replace(/\s+/g," ").trim();for(const r of Ft(e.document)||[]){const i=Bt(r.values),h=i&&typeof i=="object"?i[n]:null;if(!Array.isArray(h))continue;const m=h.findIndex(M=>M&&typeof M=="object"&&[M._visual_id,M.id,M._id].includes(o));if(m===-1)continue;const g=Io(e,h[m]),E=dt(e,g)?.display||Ne(g)||g,T=JSON.parse(JSON.stringify(h));return T[m]={...T[m]},!s||s===E?delete T[m]._sve_label:T[m]._sve_label=s,r.setFieldValue(n,T),!0}return!1}function si(e,o){const a=t.rows.find(h=>h.id===o);if(!a||!(a.videoNth>=0))return;const n=String(b("dock:current-type")||""),s=Eo(e,n),r=!s.has(a.videoNth);r?s.add(a.videoNth):s.delete(a.videoNth);const i=String(b("dock:current-uid")||"");aa(e,n,s),ue({source:W,type:B.SVE_VIDEO_HOLD,uid:i,uids:i?Ue(i,e.document):[],nth:a.videoNth,on:r},e),P(e)}function ri(e,o){const a=new Map;let n=0;const s=r=>{for(const i of r){if(i.hidden)continue;const h=i.kind?null:ss(o.slice(i.from,i.openTo));h!==null&&a.set(i.id,{nth:n++,booleans:is(h)}),s(i.children||[])}};return s(e),a}function ii(e,o,a){const n=t.rows.find(r=>r.id===a);if(!n||!(n.alpineNth>=0))return;if(n.alpineKeys.length===1){go(e,n,n.alpineKeys[0]);return}const s=o.currentTarget.getBoundingClientRect();D(),Q=Pe(e.document,Ee,{items:n.alpineKeys.map(r=>({label:r.key,icon:r.value?an:sn,onPick:()=>{D(),go(e,n,r)}})),x:Math.round(s.left),y:Math.round(s.bottom+4),onClose:()=>{Q=null}})}function go(e,o,a){const n=String(b("dock:current-type")||""),s=Ho(e,n),r=!a.value,i=r!==a.file,h={...s[o.alpineNth]||{}};i?h[a.key]=r:delete h[a.key],Object.keys(h).length?s[o.alpineNth]=h:delete s[o.alpineNth];const m=fa(String(b("dock:chrome-kind")||"")),g=m?"":String(b("dock:current-uid")||"");va(e,n,s),ue({source:W,type:B.SVE_ALPINE_STATE,uid:g,uids:g?Ue(g,e.document):[],chrome:m,nth:o.alpineNth,key:a.key,value:r,on:i},e),P(e)}function Xt(e,o){return!o||!(o.locked||o.lockedIn)?!1:(e.Statamic?.$toast?.error(f(e,"html_tree_locked_element")),!0)}function tn(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function on(e,o){const a=t.rows.find(n=>n.id===o);if(!(!a||a.lockedIn||b("dock:is-locked"))){if(!a.locked){Se(e,o,Ba,{lockAction:!0});return}if(!tn(e)){e.Statamic?.$toast?.error(f(e,"html_tree_unlock_denied"));return}Vt(e,{titleKey:"html_tree_unlock_title",bodyKey:"html_tree_unlock_body",confirmKey:"html_tree_unlock_confirm"},()=>Se(e,o,Na,{lockAction:!0,unlock:!0}))}}function Wt(e){return!!t.rows.find(o=>o.id===e)?.fixed}function Gt(e){const o=t.sections?.find(n=>n.row?.id===e);if(o)return o;const a=t.rows.find(n=>n.id===e)?.sectionRoot;return a&&t.sections?.find(n=>n.uid===a)||null}function li(e,o){if(Wt(o))return;const a=Gt(o),n=t.rows.find(s=>s.id===o);if(a&&!(n?.hidden&&n.wrapFrom!=null)){e.postMessage({source:W,type:B.HIDE_ROW,uid:a.uid,show:!a.enabled},e.location.origin),e.setTimeout(()=>P(e),60);return}Se(e,o,Va)}function di(e,o){if(Wt(o))return;const a=Gt(o)?.uid;if(a){e.postMessage({source:W,type:B.DUPLICATE_ROW,uid:a},e.location.origin);return}Se(e,o,ja)}function nn(e,o){Vt(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const a=e.document;ga({uid:o},a,e)})}function ci(e,o,a){Y===a&&(e.clearTimeout(ge),Y="",j=""),I=null,ce=!1,Pt="";const n=qe(e,o),s=n.find(r=>r.uid!==a)||n[0];s?ct(e,o,n,s.uid,""):(j="",t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,P(e)),e.setTimeout(()=>{z(e.document)&&P(e)},0)}Lo("row:removed",({uid:e,parentPath:o,doc:a,win:n})=>{o!==it(n)||!z(n.document)||ci(n,a,e)});function hi(e,o){if(Wt(o))return;const a=t.sections?.find(s=>s.row?.id===o),n=a?a.row?.section||a.uid:t.rows.find(s=>s.id===o)?.sectionRoot;if(n){nn(e,n);return}if(t.rows.find(s=>s.id===o)?.kind==="sections"){Vt(e,{titleKey:"html_tree_sections_remove_title",bodyKey:"html_tree_sections_remove_body",confirmKey:"html_tree_sections_remove_confirm"},()=>Se(e,o,ho));return}Se(e,o,ho)}function Se(e,o,a,{lockAction:n=!1,unlock:s=!1}={}){if(b("dock:is-locked"))return;const r=X(),i=t.rows.find(m=>m.id===o);if(!i||!n&&Xt(e,i))return;const h=a(r,i);h!==r&&He(h,{unlock:s})}let Ke=null;function Zt(){Ke?.closest("[data-sve-ht-row]")?.removeAttribute("data-sve-ht-more-open"),Ke=null}function D(){Q?.dismiss(),Q=null,Zt()}const an='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',sn='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>',le=e=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${e}</svg>`,de={up:le('<path d="M12 19V5M6 11l6-6 6 6"/>'),down:le('<path d="M12 5v14M6 13l6 6 6-6"/>'),save:le('<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/>'),add:le('<path d="M12 5v14M5 12h14"/>'),blueprint:le('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>'),fieldset:le('<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/>'),lock:le('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),unlock:le('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-.9"/>')};function ui(e,o){const a=t.sections||[],n=a.findIndex(i=>i.uid===o.uid),s=(i,h={})=>()=>{D(),e.postMessage({source:W,type:i,uid:o.uid,...h},e.location.origin),e.setTimeout(()=>P(e),60)},r=[{label:f(e,"move_up"),icon:de.up,onPick:n>0?s(B.MOVE,{direction:-1}):null},{label:f(e,"move_down"),icon:de.down,onPick:n>=0&&n<a.length-1?s(B.MOVE,{direction:1}):null},{label:f(e,"html_tree_save_section"),icon:de.save,onPick:s(B.SAVE_SECTION)},{label:f(e,"add_section_below"),icon:de.add,onPick:s(B.ADD_SET)}];if(ha(e)&&r.push({label:f(e,"blueprint"),icon:de.blueprint,onPick:()=>{D(),ua(e)}}),wo(e)&&o.type&&!o.static){const i=o.current&&!t.canEdit;r.push({label:f(e,"html_tree_fieldset"),icon:de.fieldset,onPick:i?null:()=>{D(),_o(e,o.type)}})}return r}function ko(e,o){const a=t.canEdit&&(!o.locked||t.canUnlock);return{label:o.locked?t.canUnlock?t.unlockTitle:t.lockedByTitle:t.lockTitle,icon:o.locked?de.unlock:de.lock,onPick:a?()=>{D(),on(e,o.id)}:null}}function fi(e,o,a){if(!o.isConnected||Q&&Ke===o)return;const n=Gt(a),s=t.rows.find(r=>r.id===a);if(!n){ln(e,null,a,{anchor:o,lead:s?[ko(e,s)]:[]});return}D(),Ke=o,o.closest("[data-sve-ht-row]")?.setAttribute("data-sve-ht-more-open",""),Q=Pe(e.document,Ee,{items:[...ui(e,n),...s?[ko(e,s)]:[]],x:0,y:0,anchor:o,onClose:()=>{Q=null,Zt()}})}function rn(e,o){const a=t.sections?.find(m=>m.uid===o),n=a?.type||"";if(!n||!xo(e))return[];const s=a.label||n,r=jn(e,n),i=()=>e.Statamic?.$toast?.error(f(e,"section_update_failed")),h=[{label:f(e,"static_section_insertable"),icon:r?sn:an,onPick:()=>{D(),ro(e,{handle:n,hidden:!r}).then(()=>{e.Statamic?.$toast?.success(f(e,r?"section_shown_to_editors":"section_hidden_from_editors",{name:s})),io(e)}).catch(i)}}];return a.static&&h.push({label:f(e,"section_add_fields"),onPick:()=>{D(),ro(e,{handle:n,fields:!0}).then(()=>{e.Statamic?.$toast?.success(f(e,"section_fields_added",{name:s})),io(e),P(e),_o(e,n)}).catch(i)}}),h}function vi(e,o,a){const n=a.row?.section||a.uid;n&&(Q=Pe(e.document,Ee,{items:[...rn(e,n),{label:f(e,"html_tree_remove_section"),danger:!0,onPick:()=>{D(),nn(e,n)}}],x:o.clientX,y:o.clientY,onClose:()=>{Q=null}}))}function ln(e,o,a,{anchor:n=null,lead:s=[]}={}){D();const r=t.sections?.find(g=>g.row?.id===a);if(r){vi(e,o,r);return}const i=t.rows.find(g=>g.id===a);if(!i)return;n||Ce(e,a,t.rows);const h=n?{x:0,y:0}:{x:o.clientX,y:o.clientY},m=g=>{const E=[...s,...g.map(T=>n&&T.onPick?{...T,onPick:()=>{Ce(e,a,t.rows),T.onPick()}}:T)];E.length&&(Q?.dismiss(),n&&(Ke=n,n.closest("[data-sve-ht-row]")?.setAttribute("data-sve-ht-more-open","")),Q=Pe(e.document,Ee,{items:E,x:h.x,y:h.y,anchor:n,onClose:()=>{Q=null,Zt()}}))};if(i.frameCall){m([{label:f(e,"html_tree_frame_edit",{frame:f(e,`chrome_${i.frameCall}`)}),onPick:()=>{D(),$t(e,i.frameCall)}}]);return}if(i.kind==="component"){mi(e,i,m);return}if(i.kind==="slot"||i.kind==="sections"||i.kind==="svg"||i.locked||i.lockedIn){m([]);return}if(!t.canEdit){m([]);return}if(i.componentRoot){m([]);return}m([...i.sectionRoot?rn(e,i.sectionRoot):[],{label:f(e,"component_make"),onPick:()=>{D(),Sa(e,i,{onDone:()=>P(e),onError:g=>{e.alert(g?.status===409?f(e,"component_exists"):f(e,"component_failed"))}})}}])}const yo=(e,o)=>{D(),b("dock:open-template",o)};function mi(e,o,a){if(!ma(o.src)){a([{label:f(e,"component_open_named",{name:pa(o.src)||o.src}),onPick:()=>yo(e,`view:partials/${o.src}`)}]);return}a([{label:f(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(o.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const s=Array.isArray(n.items)?n.items:[];a(s.length?s.map(r=>({label:f(e,"component_open_named",{name:r.label}),onPick:()=>yo(e,r.type)})):[{label:f(e,"component_none"),onPick:null}])}).catch(()=>a([{label:f(e,"component_none"),onPick:null}]))}function pi(e,o,a){if(o.button!==0||b("dock:is-locked")||t.editingId)return;const n=t.rows.find(i=>i.id===a);if(n&&(n.locked||n.lockedIn)||o.target?.closest?.("button, input"))return;Ye(),pe=a,Fe={x:o.clientX,y:o.clientY},tt=o.currentTarget,ot=o.pointerId;const s=i=>gi(e,i),r=i=>ki(e,i);Mt=()=>{e.document.removeEventListener("pointermove",s,!0),e.document.removeEventListener("pointerup",r,!0),e.document.removeEventListener("pointercancel",r,!0),Mt=null},e.document.addEventListener("pointermove",s,!0),e.document.addEventListener("pointerup",r,!0),e.document.addEventListener("pointercancel",r,!0)}function gi(e,o){if(!pe||!Fe)return;const a=o.clientX-Fe.x,n=o.clientY-Fe.y;if(!t.dragging&&a*a+n*n<25)return;if(!t.dragging){t.dragging=!0;try{tt?.setPointerCapture?.(ot)}catch{}}o.preventDefault();const s=e.document.elementFromPoint(o.clientX,o.clientY),r=s?.closest?.("[data-sve-ht-slot]");if(r){const T=r.getAttribute("data-sve-ht-id");if(T&&T!==pe){t.dropId=T,t.dropPlace="inside";return}}const i=s?.closest?.("[data-sve-ht-row]"),h=i?.getAttribute("data-sve-ht-id");if(!h||h===pe){t.dropId=null,t.dropPlace=null;return}const m=t.rows.find(T=>T.id===h),g=t.rows.find(T=>T.id===pe);if(!m||m.lockedIn||g&&m.path.startsWith(`${g.path}/`)){t.dropId=null,t.dropPlace=null;return}const E=i.getBoundingClientRect();t.dropId=h,t.dropPlace=$a(o.clientY-E.top,E.height,!$o(m.tag)&&!Ro(m)&&!m.locked)}function ki(e,o){const a=pe,n=t.dropId,s=t.dropPlace||"after",r=t.dragging;if(Ye(),r&&(he=!0,e.setTimeout(()=>{he=!1},0)),!r||b("dock:is-locked")||!a||!n||a===n)return;o?.preventDefault?.();const i=X(),h=Da(i,_e,a,n,s);h!==i&&He(h)}function Ye(){try{tt?.releasePointerCapture?.(ot)}catch{}Mt?.(),pe=null,Fe=null,tt=null,ot=null,t.dragging=!1,t.dropId=null,t.dropPlace=null}function yi(e,o,a){if(o.button!==0||!a||t.editingId||o.target?.closest?.("button, input"))return;dn(),Ve=a,Be={x:o.clientX,y:o.clientY},nt=o.currentTarget,at=o.pointerId;const n=r=>bi(e,r),s=r=>Ti(e,r);Lt=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",s,!0),e.document.removeEventListener("pointercancel",s,!0),Lt=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",s,!0),e.document.addEventListener("pointercancel",s,!0)}function bi(e,o){if(!Ve||!Be)return;const a=o.clientX-Be.x,n=o.clientY-Be.y;if(!t.dragging&&a*a+n*n<25)return;if(!t.dragging){t.dragging=!0;try{nt?.setPointerCapture?.(at)}catch{}}o.preventDefault();const r=e.document.elementFromPoint(o.clientX,o.clientY)?.closest?.("[data-sve-ht-sec-uid]"),i=r?.getAttribute("data-sve-ht-sec-uid")||"";if(!i||i===Ve){t.sectionDrop=null;return}const h=r.getBoundingClientRect();t.sectionDrop={uid:i,place:o.clientY-h.top<h.height/2?"before":"after"}}function Ti(e,o){const a=Ve,n=t.sectionDrop,s=t.dragging;dn(),s&&(he=!0,e.setTimeout(()=>{he=!1},0)),!(!s||!a||!n?.uid||n.uid===a)&&(o?.preventDefault?.(),xi(e,a,n.uid,n.place))}function dn(){try{nt?.releasePointerCapture?.(at)}catch{}Lt?.(),Ve=null,Be=null,nt=null,at=null,t.dragging=!1,t.sectionDrop=null}function xi(e,o,a,n){const s=it(e)||"page_sections";for(const r of Ft(e.document)||[]){const i=Bt(r.values),h=i&&typeof i=="object"?i[s]:null;if(!Array.isArray(h))continue;const m=M=>h.findIndex(x=>x&&typeof x=="object"&&[x._visual_id,x.id,x._id].includes(M)),g=m(o),E=m(a);if(g===-1||E===-1||g===E)return!1;let T=n==="before"?E:E+1;return g<T&&(T-=1),T===g?!1:(e.postMessage({source:W,type:B.MOVE,uid:o,toIndex:T},e.location.origin),e.setTimeout(()=>P(e),60),!0)}return!1}function Dt(e,o){if(o?.kind==="component"){wi(e,o);return}if(J.callOpen&&(J.callOpen=!1,J.callStore=null,U.forget(),Ut(e)),o?.kind!=="antlers"){t.inspect=null;return}const a=o.id,n={logic:!0,path:o.path};if(o.tag==="else"){t.inspect={key:a,...n,title:f(e,"antlers_condition"),mode:"note",note:f(e,"antlers_else_note")};return}if(o.antlers==="loop"){t.inspect={...Ja(e,o,{key:a,draft:me?.id===o.id?me.dir:""}),...n};return}t.inspect={key:a,...n,title:f(e,"antlers_condition"),mode:"condition",value:o.expr||"",placeholder:f(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:f(e,"antlers_add_elseif")},{id:"else",label:f(e,"antlers_add_else")}]}}function wi(e,o){if(!Ea(e)){t.inspect=null;return}if(!o.src)return;const a=o.id;if(t.inspect={key:a,title:f(e,"component_props_values"),mode:"note",note:f(e,"code_dock_loading")},Ha()){const n={},s={},r=new Map;for(const[i,h]of Ma(X().slice(o.from,o.to))){const m=La(i);m&&(i!==m||!r.has(m))&&r.set(m,h)}for(const[i,h]of r)h.bound?s[i]=h.value:n[i]=h.value;t.inspect=null,J.callOpen=!0,J.title=J.title||f(e,"component_props"),J.callTitle=o.klass||o.name||o.src,J.callStore=U.ui,U.ui.canBind=!0,U.ui.dataTitle=f(e,"data_vars_title"),U.ui.exprPlaceholder=f(e,"component_props_expr"),U.ui.onBox=(i,h)=>Si(e,i,h),U.ui.onPickData=(i,h)=>b("dock:data-menu",{anchor:h,at:o.from,types:Ia(U.ui.fields.find(m=>m.handle===i)?.type),onPick:m=>cn(e,i,String(m?.var||"").trim())}),U.load(e,{key:`${o.src}::${a}`,src:o.src,params:n,bindings:s,readOnly:b("dock:is-locked")===!0}),U.watch(e,{src:o.src,write:i=>_i(e,i,s)}),Ut(e);return}Oa(e,o.src).then(n=>{if(t.inspect?.key===a){if(!n.length){t.inspect={key:a,title:f(e,"component_props_values"),mode:"note",note:f(e,"component_props_values_none")};return}t.inspect={key:a,title:f(e,"component_props_values"),mode:"props",inheritLabel:f(e,"component_props_inherit"),rows:Ra(n,X().slice(o.from,o.to))}}})}function _i(e,o,a={}){const n=t.rows.find(i=>i.id===I);if(n?.kind!=="component"||b("dock:is-locked"))return;let s=X(),r=n.to;for(const[i,h]of Object.entries(o||{})){if(i in a)continue;const m=s.length,g=qt(s,{from:n.from,to:r},i,h);g!==s&&(r+=g.length-m,s=g)}s!==X()&&(He(s,{save:!0}),P(e))}function cn(e,o,a){hn(e,o,a,!0),P(e)}function Si(e,o,a){const n=Aa(a);if(n){cn(e,o,n);return}U.forget(),hn(e,o,String(a??"").trim(),!1),P(e)}function hn(e,o,a,n){const s=t.rows.find(h=>h.id===I);if(s?.kind!=="component"||b("dock:is-locked"))return;const r=X(),i=qt(r,s,o,a,{bound:n});i!==r&&He(i,{save:!0})}function rt(){const e=t.rows.find(o=>o.id===I);return e?.kind==="antlers"&&!b("dock:is-locked")?e:null}function oe(e,o){const a=rt();if(!a)return;const n=X(),s=o(n,a);s!==n&&(He(s),P(e))}function bo(e,o,a,n){const s=t.rows.find(h=>h.id===I);if(s?.kind!=="component"||b("dock:is-locked"))return;const r=X(),i=qt(r,s,o,a,{bound:n});i!==r&&(He(i,{save:!0}),P(e))}function Ci(e,o){oe(e,(a,n)=>n.antlers==="loop"?ns(n,o)(a,n):Ka(a,n,o))}function Pi(e,o){const a=rt();if(!a||a.antlers!=="loop")return;const n=Za(e,a,o);n&&oe(e,n)}function Ei(e,o){oe(e,(a,n)=>Ua(a,n,o))}function Hi(e,o){if(!e||!o||Ro(o)||$o(o.tag))return null;const a=Pa(e,o);if(a<o.openTo)return null;const n=e.lastIndexOf(`
`,a-1)+1;return e.slice(n,a).trim()===""&&n>o.openTo?n-1:a}function Ce(e,o,a,{reveal:n=!0}={}){if(he)return;const s=(a||t.rows).find(r=>r.id===o);s&&(I=o,t.rows.forEach(r=>{r.current=r.id===o}),Dt(e,s),!Yt()&&(n&&(b("dock:reveal-html",{from:s.from,to:s.to,caret:Hi(X(),s)}),b("dock:tw-follow")),ue({source:W,type:B.SVE_HTML_PICK_FOCUS,path:s.path,src:s.kind==="component"&&s.src||""},e)))}function Mi(e,o){if(!o)return"";const a=[],n=(s,r)=>{for(const i of s||[]){const h=r||i.path===e;i.kind==="component"&&i.src===o&&a.push({path:i.path,inside:h}),n(i.children,h)}};return n(_e,!1),(a.find(s=>s.inside)||a[0])?.path||""}function Li(e,o,{reveal:a=!0}={}){if(!o||!z(e.document))return;ce=!1;const n=t.rows.find(r=>r.current);if(n&&n.path===o){Ce(e,n.id,t.rows,{reveal:a});return}P(e),Xe(o),P(e);const s=t.rows.find(r=>r.path===o);s&&(Ce(e,s.id,t.rows,{reveal:a}),e.setTimeout(()=>{z(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function At(e){if(Je)return;const o=()=>{t.editingId||t.dragging||(e.clearTimeout(et),et=e.setTimeout(()=>{z(e.document)&&P(e)},80))},a=()=>{if(o(),b("dock:on-empty-page")===!0){const n=qe(e,e.document);n.length===1&&ct(e,e.document,n,n[0].uid,"")}};Je=Lo("dock:html-changed",o),e.document.addEventListener("sve-page-structure",a),Ht=()=>{e.document.removeEventListener("sve-page-structure",a)}}function Ii(e){Je?.(),Je=null,Ht?.(),Ht=null,e?.clearTimeout?.(et),et=0}function Jt(e){const o=z(e.document);if(ue({source:W,type:B.SVE_HTML_PICK,on:!1},e),Ii(e),U.forget(),J.callOpen=!1,J.callStore=null,Ut(e),Ye(),D(),Ta(e),I=null,t.inspect=null,t.editingId=null,t.draft="",t.sections=[],t.pageBuilder=!1,t.layoutFile=!1,Y="",e?.clearTimeout?.(ge),!o){St(e);return}o.remove(),Nt.headerTab==="html_tree"&&Yn(e,null),zn(e),So(e),Co(e),St(e)}const un="button[title], button[data-tip], label[title]";function Gi(e,o){o.querySelector("[data-sve-html-tree-list]")||(o.id=We,Po(e,o,{only:un}),De(o,Bo,{title:f(e,"html_tree")}),o.querySelector("[data-sve-close]")?.addEventListener("click",()=>Jt(e)))}function Zi(e){At(e),P(e)}function fn(e){const o=e.document;if(!En(e,"html_tree"))return;if(z(o)){At(e),P(e);return}if(!Wo(o))return;ce=!0,q.clear(),Xn(e,[We]);const a=o.createElement("div");a.id=We,Po(e,a,{only:un}),a.style.cssText=Wn,De(a,Bo,{title:f(e,"html_tree")}),a.querySelector("[data-sve-close]")?.addEventListener("click",()=>Jt(e)),Gn(e,a),So(e),Co(e),St(e),At(e),P(e)}function Ji(e){if(z(e.document)){Jt(e);return}fn(e)}jt("html-tree:open-section",e=>{const o=window,a=o.document,n=qe(o,a),s=n.find(r=>r.uid===e||r.ids.includes(e));return s?(ct(o,a,n,s.uid,""),{uid:s.uid,ids:s.ids}):null});jt("html-tree:from-preview",({path:e,src:o,uid:a,reveal:n=!0}={})=>{if(!Ao(window,e)){if(!e){Oi(window,a);return}Li(window,Mi(e,o)||e,{reveal:n})}});function Oi(e,o){if(!o||!z(e.document))return;const a=qe(e,e.document),n=Ue(o,e.document),s=a.find(r=>r.ids.some(i=>n.includes(i)));s&&(ce&&(ce=!1,q.clear(),I=null),Y&&Y!==s.uid&&(e.clearTimeout(ge),Y="",j=""),!b("dock:load-settled")&&P(e))}jt("html-tree:arm-pick",e=>{const o=window;return e?(en(o,lt(X(),Yo(o))),!0):(z(o.document)||ue({source:W,type:B.SVE_HTML_PICK,on:!1},o),!0)});function Qi(){ke.clear(),Ae.clear(),Et.clear(),Ze.clear(),je.length=0}export{Nr as HTML_TREE_STYLE_ID,Wi as armHtmlTreePrefetch,Qi as clearHtmlTreeTemplates,D as closeHtmlTreeMenu,Jt as closeHtmlTreePanel,qr as ensureHtmlTreeStyles,Gi as fillHtmlTreePane,I as htmlTreeActiveId,z as htmlTreePanel,et as htmlTreeTimer,Je as htmlTreeUnhook,fn as openHtmlTreePanel,P as renderHtmlTree,Zi as showHtmlTreePane,Ii as stopWatchHtmlTreeDock,Ji as toggleHtmlTreePanel,At as watchHtmlTreeDock};
