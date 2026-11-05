import{q as v,f as kn,o as f,c as k,a as R,t as L,u as i,e as yn,l as bn,F as $,j as se,g as C,w,Y as Be,N as K,aa as Tn,a2 as xn,ag as Ee,k as Ht,ae as wn,X as fe,aE as _n,v as ro,x as Sn,W as Cn,aF as Pn,ac as wo,aG as En,D as vt,m as Kt,p as Ut,V as Ue,a8 as Hn,aH as Mn,aI as Ln}from"./addon-BFLrpCOr.js";import{c as _o,a as In,o as Rn,b as On,d as $n,T as Dn,i as An,r as Fn,e as Bn,f as Nn,u as io,l as lo}from"./section-create-DzDSJbw_.js";import{canEditFields as So,openGlobalFieldsOverlay as Vn,openFieldsetOverlay as Co}from"./section-fields-D2c659Bj.js";import{U as t,V as jn,W as Q,X as Kn,b,s as qt,y as ke,j as Mt,H as Un,i as qn,E as Po,F as Eo,Y as co,Z as Ho,m as Ne,D as Yn,R as zn,G as Xn,_ as ft,$ as Wn,a0 as ho,a1 as Gn,a2 as Zn,a3 as Mo,a4 as Lo,a5 as Io,a6 as Qn,a7 as Jn,o as Ro,a8 as ea,a9 as Oo,l as mt,aa as Xe,ab as $o,ac as ta,ad as Yt,ae as oa,af as na,ag as aa,x as sa,ah as ra,ai as ia,aj as la,ak as Do,al as Ao,am as da,an as ca,ao as ha,ap as ua,aq as Fo,ar as va,as as fa,at as ma,A as pa,au as zt}from"./lp-cluster-Dn8nmIja.js";import{H as et,u as ga,d as ka}from"./shortcuts-BIxtNjMb.js";import{_ as Xt,o as Re}from"./ChoiceDialog-BoTfu30Q.js";import{M as B,S as W}from"./protocol-CfmvxZS7.js";import{C as ya,H as Oe,s as Wt,c as ba,a as Ta,b as Bo,t as xa,d as He,h as No,e as wa,f as _a,w as Gt,g as Sa,i as Ca,j as Pa,p as Ea,r as Ha,k as Ma,l as La,m as Ia,v as Ra,n as Oa,o as $a,q as Da,u as Aa,x as Fa,y as Ba,z as Na,A as Va,B as uo,D as ja,E as Ka}from"./component-extract-B05OsGQJ.js";import{H as Ua,r as Vo,o as qa,h as vo,e as Ya,w as za}from"./logic-popup-BOha8PGx.js";import{b as Xa}from"./html-pick-align-BNtmyz2s.js";import{l as Wa,a as Ga,b as Za,c as Qa,d as Ja,e as es,f as ts,g as os,h as ns}from"./loop-inspector-B71qhP-y.js";import"./css-scope-DFRjvNc8.js";import"./FieldsetOverlay-AGwGIlia.js";import"./anim-still-4pEwKCsB.js";import"./container-widths-DWv7tm7u.js";import"./help-styles-CaM5WP-L.js";const bt=/\s*([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/y,as=/^\s*(?:([A-Za-z_$][\w$]*)|'([^'\\]*)'|"([^"\\]*)")\s*:\s*(true|false)\s*$/;function ss(e){const o=String(e||"").replace(/\{\{[\s\S]*?\}\}/g,s=>" ".repeat(s.length)),a=o.match(/^<[a-zA-Z][\w:-]*/);if(!a)return null;let n=a[0].length;for(;n<o.length;){bt.lastIndex=n;const s=bt.exec(o);if(!s){n+=1;continue}if(s[1].toLowerCase()==="x-data")return s[2]??s[3]??s[4]??"";n=bt.lastIndex}return null}function rs(e,o){const a=e[o];for(let n=o+1;n<e.length;n+=1)if(e[n]==="\\")n+=1;else if(e[n]===a)return n;return e.length-1}function is(e){const o=String(e||""),a=o.search(/\S/);if(a===-1||o[a]!=="{")return[];const n=new Map;let s=0,r="";const d=()=>{const h=r.match(as);h&&n.set(h[1]??h[2]??h[3],h[4]==="true"),r=""};for(let h=a;h<o.length;h+=1){const m=o[h];if(m==='"'||m==="'"||m==="`"){const g=rs(o,h);r+=o.slice(h,g+1),h=g;continue}if(m==="/"&&o[h+1]==="/"){const g=o.indexOf(`
`,h);h=g===-1?o.length:g-1;continue}if(m==="/"&&o[h+1]==="*"){const g=o.indexOf("*/",h+2);h=g===-1?o.length:g+1;continue}if(m==="{"||m==="["||m==="("){if(s+=1,s===1)continue}else if(m==="}"||m==="]"||m===")"){if(s-=1,s===0)break}else if(m===","&&s===1){d();continue}r+=m}return d(),[...n].map(([h,m])=>({key:h,value:m}))}const ls={class:"sve-html-tree"},ds={class:"sve-pane-bar","data-sve-pane-bar":""},cs={"data-sve-right-title":""},hs={"data-sve-right-actions":""},us=["aria-pressed","title","aria-label"],vs=["title"],fs={class:"sve-ht-used-by__label"},ms={class:"sve-ht-used-by__chips"},ps=["title","onClick"],gs={key:1,class:"sve-ht-used-by__chip"},ks={key:0,class:"sve-ht-used-by__empty"},ys={class:"sve-ht-tools"},bs=["title"],Ts=["placeholder","aria-label","value"],xs=["aria-label"],ws=["title","aria-label"],_s=["title","aria-label"],Ss={key:3,class:"sve-tree-exit"},Cs=["title"],Ps=["title"],Es='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',Hs='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',Ms='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',Ls='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',Is='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/></svg>',Rs='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',Os={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const o=v(window,"html_tree_search");t.layers=jn(window);const a=v(window,"html_tree_layers_on"),n=v(window,"html_tree_layers_off");function s(){Kn(window,!t.layers)}const r=_o(window),d=v(window,"section_new"),h=v(window,"html_tree_add_element"),m=v(window,"html_tree_sections_slot"),g=v(window,"html_tree_sections_no_field");function E(){const H=t.templateSections.length?t.templateSections:[Tn(window)],u=new Set(t.rows.filter(l=>l.kind==="sections").map(l=>l.tag));return H.filter(l=>!u.has(l)).map(l=>({tag:`sections:${l}`,label:H.length>1?`${m} · ${l}`:m,noField:!t.templateSections.length}))}const T=kn(!1),M=v(window,"section_import");function x(){T.value=!1}async function O(H){if(!H)return;await xn(),t.onRefresh?.();const u=b("html-tree:open-section",H);u&&Fn(window,u.ids)}function _(){const H=t.rows.find(u=>u.current&&!u.context&&!u.synthetic)||null;return H?.lockedIn?t.rows.filter(u=>u.locked&&u.from<=H.from&&u.to>=H.to).sort((u,l)=>u.from-l.from)[0]||null:H}function te(H){const u=H.getBoundingClientRect(),l=_();let p=null;const A=(F,De,ce="")=>()=>{p?.dismiss(),p=null,x();const gt=An(window,F,l,De);gt!==null&&(t.selectFrom={at:gt,left:4},ce&&window.Statamic?.$toast?.info?.(ce))};p=Re(document,Oe,{items:[...Dn.map(F=>({label:F,onPick:A(F,`<${F}>`)})),...E().map(F=>({label:F.label,onPick:A(F.tag,F.label,F.noField?g:"")}))],x:Math.round(u.left),y:Math.round(u.bottom+4),onClose:()=>{p=null,x()}})}function de(H){if(!T.value){if(T.value=!0,!(t.sections.length||t.pageBuilder)){te(H.currentTarget);return}(async()=>{const u=await In(window);if(!u){x();return}const l=t.sections.length?t.sections[t.sections.length-1].uid:null,p=A=>{x(),O(A?.uid)};if(u==="static"){Rn(window,{afterUid:l,onDone:p,onError:x,onClose:x});return}On(window,{afterUid:l,onDone:p,onError:x,onClose:x})})()}}function G(){if(T.value)return;T.value=!0;const H=!!(t.sections.length||t.pageBuilder);$n(window,{intoTemplate:!H,after:H?null:_(),afterUid:H&&t.sections.length?t.sections[t.sections.length-1].uid:null,onDone:u=>{if(x(),H){O(u?.uid);return}Number.isInteger(u?.at)&&(t.selectFrom={at:u.at,left:4})},onError:x,onClose:x})}function N(H){const u=!!t.query;t.query=H,u!==!!H&&t.onQuery?.()}return(H,u)=>(f(),k("div",ls,[R("div",ds,[R("div",cs,L(e.title),1),R("div",hs,[R("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":i(t).layers?"true":"false",title:i(t).layers?i(n):i(a),"aria-label":i(t).layers?i(n):i(a),innerHTML:Es,onClick:s},null,8,us),u[5]||(u[5]=yn('<button type="button" data-sve-right-pin aria-pressed="false" data-v-2763765f></button><button type="button" data-sve-close aria-label="Close" data-v-2763765f><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-2763765f><path d="M18 6 6 18" data-v-2763765f></path><path d="m6 6 12 12" data-v-2763765f></path></svg></button>',2))])]),i(t).usedBy?(f(),k("div",{key:0,class:"sve-ht-used-by",title:i(t).usedBy.hint||null},[R("span",fs,[R("span",{class:"sve-ht-used-by__icon","aria-hidden":"true",innerHTML:Is}),bn(" "+L(i(t).usedBy.label),1)]),R("span",ms,[(f(!0),k($,null,se(i(t).usedBy.items,l=>(f(),k($,{key:l.kind+":"+l.name},[l.onOpen?(f(),k("button",{key:0,type:"button",class:"sve-ht-used-by__chip sve-ht-used-by__chip--open",title:l.openLabel,onClick:p=>l.onOpen(p.currentTarget)},L(l.name),9,ps)):(f(),k("span",gs,L(l.name),1))],64))),128)),i(t).usedBy.empty?(f(),k("span",ks,L(i(t).usedBy.empty),1)):C("",!0)])],8,vs)):C("",!0),R("div",ys,[R("label",{class:"sve-ht-search",title:i(o)},[R("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:Ls}),R("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:i(o),"aria-label":i(o),value:i(t).query,autocomplete:"off",spellcheck:"false",onInput:u[0]||(u[0]=l=>N(l.target.value)),onKeydown:[u[1]||(u[1]=w(()=>{},["stop"])),u[2]||(u[2]=Be(w(l=>N(""),["prevent"]),["escape"]))]},null,40,Ts),i(t).query?(f(),k("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":i(o),innerHTML:Rs,onClick:u[3]||(u[3]=l=>N(""))},null,8,xs)):C("",!0)],8,bs),i(r)&&(i(t).sections.length||i(t).pageBuilder||i(t).rows.length&&!i(t).layoutFile)?(f(),k("button",{key:0,type:"button",class:"sve-ht-new",title:i(t).sections.length||i(t).pageBuilder?i(d):i(h),"aria-label":i(t).sections.length||i(t).pageBuilder?i(d):i(h),innerHTML:Hs,onClick:de},null,8,ws)):C("",!0),i(r)&&(i(t).sections.length||i(t).pageBuilder||i(t).rows.length&&!i(t).layoutFile)?(f(),k("button",{key:1,type:"button",class:"sve-ht-import",title:i(M),"aria-label":i(M),innerHTML:Ms,onClick:G},null,8,_s)):C("",!0)]),i(Q).inSidebar?C("",!0):(f(),K(ya,{key:1})),u[6]||(u[6]=R("div",{"data-sve-html-tree-list":""},null,-1)),i(t).inspect?.logic?C("",!0):(f(),K(Ua,{key:2})),i(t).exitOpen&&!i(Q).inSidebar?(f(),k("div",Ss,[R("span",{class:"sve-tree-exit__name",title:i(t).exitName},L(i(t).exitName),9,Cs),R("button",{type:"button",class:"sve-tree-exit__go",title:i(t).exitTitle,onClick:u[4]||(u[4]=l=>i(t).onExit?.())},L(i(t).exitLabel),9,Ps)])):C("",!0)]))}},jo=Xt(Os,[["__scopeId","data-v-2763765f"]]);function Ko(e){return String(e||"").trim().toLowerCase()}function Lt(e,o){return o?[e.name,e.tag,e.klass,e.label,e.src].filter(a=>typeof a=="string"&&a).join(" ").toLowerCase().includes(o):!0}function $s(e,o){const a=Ko(o);if(!a)return{rows:e,hits:new Set};const n=new Set;for(const d of e)Lt(d,a)&&n.add(d.path);const s=[...n];return{rows:e.filter(d=>n.has(d.path)||s.some(h=>h.startsWith(`${d.path}/`))),hits:n}}const Ds=["title"],As={"data-sve-ht-indent":"","aria-hidden":"true"},Fs=["data-sve-ht-cat"],Bs={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},Ns={key:2,"data-sve-ht-letter":""},Vs=["innerHTML"],js=["title"],Ks=["data-sve-ht-classes","title"],Us={key:1,"data-sve-ht-kind":""},qs={key:3,"data-sve-ht-name":""},Ys={key:4,"data-sve-ht-actions":""},zs=["data-on","title","innerHTML"],Xs=["title"],Ws={key:5,"data-sve-ht-actions":""},Gs=["data-on","title","innerHTML"],Zs=["data-on","title","innerHTML"],Qs=["disabled","title"],Js=["disabled","title","innerHTML"],er=["disabled","title"],tr=["disabled","title"],or=["aria-label"],nr=["data-sve-ht-id"],ar='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',sr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',rr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',ir='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',lr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',dr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',cr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',fo='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6.5" width="20" height="11" rx="5.5"/><circle cx="7.5" cy="12" r="3" fill="currentColor" stroke="none"/></svg>',mo='<svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M7.5 5.5h9a6.5 6.5 0 0 1 0 13h-9a6.5 6.5 0 0 1 0-13ZM16.5 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6Z"/></svg>',hr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',ur='<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>',vr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',fr=120,mr={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const o=So(window);function a(u){return u.synthetic?u.frame==="main"?t.frameMainTitle:u.frame==="template"?t.frameTemplateTitle:t.frameOpenTitle:u.kind==="component"?u.src?`partial:${u.src}`:u.tag:u.name?`${u.tag} ${u.name}`:u.tag}function n(u){return!!u.section}function s(u){return!!u.frame}function r(u){return u.kind==="slot"}function d(u,l){s(l)||r(l)||(n(l)?t.onSectionPointerDown?.(u,l.section):l.sectionRoot?t.onSectionPointerDown?.(u,l.sectionRoot):t.onPointerDown?.(u,l.id))}function h(u,l){if(u.synthetic){t.onFrame?.(u.frame);return}if(n(u)){t.onSection?.(u.section);return}t.onSelect?.(u.id,l)}function m(u,l){const p={"data-sve-ht-id":u.id};return u.locked&&(p["data-sve-ht-locked"]=""),u.current&&(p["data-sve-ht-current"]=""),(u.hidden||u.sectionOff)&&(p["data-sve-ht-hidden"]=""),(u.videoNth>=0||u.alpineNth>=0)&&(p["data-sve-ht-special"]=""),p["data-sve-ht-cat"]=u.cat||"other",p["data-sve-ht-depth"]=String(u.depth),l&&(p["data-sve-ht-dim"]=""),n(u)&&(p["data-sve-ht-sec"]=""),s(u)&&(p["data-sve-ht-frame"]=u.frame),!n(u)&&t.dropId===u.id&&t.dropPlace&&(p["data-sve-ht-drop"]=t.dropPlace),p}function g(u){return!!u.fixed}function E(u){return u.kind==="sections"}function T(u){return!!(u.locked||u.lockedIn)}function M(u){return!u.lockedIn&&!g(u)}function x(u){return G(u)||!g(u)&&!E(u)&&!T(u)&&(!u.hidden||u.wrapFrom!=null)}function O(u){if(!N(u))return t.lockedTitle;const l=u.hidden||u.sectionOff;return G(u)?l?t.sectionShowTitle:t.sectionHideTitle:l?t.showTitle:t.hideTitle}let _=null;function te(u,l){window.clearTimeout(_),_=window.setTimeout(()=>t.onMore?.(u,l.id),fr)}function de(){window.clearTimeout(_)}function G(u){return!!u.sectionRoot||!!u.section}function N(u){return t.canEdit&&!T(u)||G(u)}function H(){return t.look==="tags"&&!t.layers}return(u,l)=>(f(),k($,null,[R("div",Ee({"data-sve-ht-row":""},m(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:l[43]||(l[43]=p=>h(e.row,p.currentTarget)),onDblclick:l[44]||(l[44]=w(p=>e.row.synthetic?i(t).onFrameEnter?.(e.row.frame):s(e.row)||r(e.row)||n(e.row)?null:i(t).onRename?.(e.row.id),["prevent"])),onKeydown:[l[45]||(l[45]=Be(w(p=>h(e.row,p.currentTarget),["prevent"]),["enter"])),l[46]||(l[46]=Be(w(p=>h(e.row,p.currentTarget),["prevent"]),["space"]))],onPointerdown:l[47]||(l[47]=p=>d(p,e.row)),onPointerenter:l[48]||(l[48]=p=>n(e.row)?i(t).onSectionHover?.(e.row.section):null),onContextmenu:l[49]||(l[49]=w(p=>s(e.row)||r(e.row)||n(e.row)?null:i(t).onContext?.(p,e.row.id),["prevent","stop"]))}),[R("span",As,[(f(!0),k($,null,se(e.row.guides||[],(p,A)=>(f(),k("i",{key:A,"data-sve-ht-cat":p},null,8,Fs))),128))]),e.row.hasChildren||e.row.emptyBlock?(f(),k("button",Ee({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?i(t).mainShut:e.row.shut)?{"data-sve-ht-shut":""}:{},{innerHTML:sr,onClick:l[0]||(l[0]=w(p=>e.row.synthetic?i(t).onFrameTwist?.():n(e.row)?i(t).onSection?.(e.row.section):i(t).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:l[1]||(l[1]=w(()=>{},["stop"])),onDblclick:l[2]||(l[2]=w(()=>{},["stop"]))}),null,16)):(f(),k("span",Bs)),e.row.letter?(f(),k("span",Ns,L(e.row.letter),1)):(f(),k("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Vs)),R("span",{"data-sve-ht-text":"",title:i(t).renameTitle},[!e.row.kind&&!n(e.row)&&!s(e.row)?(f(),k("button",{key:0,type:"button","data-sve-ht-tag":"","data-sve-ht-classes":H()&&e.row.classes?e.row.classes:null,title:i(t).tagTitle,onClick:l[3]||(l[3]=w(()=>{},["stop","prevent"])),onPointerdown:l[4]||(l[4]=w(()=>{},["stop"])),onDblclick:l[5]||(l[5]=w(p=>i(t).onTagChange?.(p,e.row.id),["stop","prevent"]))},L(e.row.tag),41,Ks)):(f(),k("span",Us,L(e.row.tag),1)),i(t).editingId===e.row.id&&!n(e.row)?Ht((f(),k("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":l[6]||(l[6]=p=>i(t).draft=p),onMousedown:l[7]||(l[7]=w(()=>{},["stop"])),onPointerdown:l[8]||(l[8]=w(()=>{},["stop"])),onClick:l[9]||(l[9]=w(()=>{},["stop"])),onDblclick:l[10]||(l[10]=w(()=>{},["stop"])),onKeydown:[l[11]||(l[11]=w(()=>{},["stop"])),l[12]||(l[12]=Be(w(p=>i(t).onRenameCommit?.(),["prevent"]),["enter"])),l[13]||(l[13]=Be(w(p=>i(t).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:l[14]||(l[14]=p=>i(t).onRenameCommit?.())},null,544)),[[wn,i(t).draft]]):(f(),k("span",qs,L(H()&&e.row.display?e.row.display:e.row.name),1))],8,js),s(e.row)?(f(),k("span",Ys,[e.row.alpineNth>=0?(f(),k("button",{key:0,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:i(t).alpineTitle,innerHTML:e.row.alpineSet?mo:fo,onClick:l[15]||(l[15]=w(p=>i(t).onAlpineState?.(p,e.row.id),["stop","prevent"])),onPointerdown:l[16]||(l[16]=w(()=>{},["stop"])),onDblclick:l[17]||(l[17]=w(()=>{},["stop"]))},null,40,zs)):C("",!0),e.row.frame!=="main"&&i(o)?(f(),k("button",{key:1,type:"button","data-sve-ht-fields":"",title:i(t).frameFieldsTitle,innerHTML:ar,onClick:l[18]||(l[18]=w(p=>i(t).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:l[19]||(l[19]=w(()=>{},["stop"])),onDblclick:l[20]||(l[20]=w(()=>{},["stop"]))},null,40,Xs)):C("",!0)])):r(e.row)?C("",!0):(f(),k("span",Ws,[e.row.videoNth>=0?(f(),k("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?i(t).videoPlayTitle:i(t).videoHoldTitle,innerHTML:e.row.videoHeld?cr:dr,onClick:l[21]||(l[21]=w(p=>i(t).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:l[22]||(l[22]=w(()=>{},["stop"])),onDblclick:l[23]||(l[23]=w(()=>{},["stop"]))},null,40,Gs)):C("",!0),e.row.alpineNth>=0?(f(),k("button",{key:1,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:i(t).alpineTitle,innerHTML:e.row.alpineSet?mo:fo,onClick:l[24]||(l[24]=w(p=>i(t).onAlpineState?.(p,e.row.id),["stop","prevent"])),onPointerdown:l[25]||(l[25]=w(()=>{},["stop"])),onDblclick:l[26]||(l[26]=w(()=>{},["stop"]))},null,40,Zs)):C("",!0),e.row.locked?(f(),k("button",{key:2,type:"button","data-sve-ht-lock":"","data-on":"",disabled:!i(t).canEdit||!i(t).canUnlock,title:i(t).canUnlock?i(t).unlockTitle:i(t).lockedByTitle,"aria-pressed":"true",innerHTML:hr,onClick:l[27]||(l[27]=w(p=>i(t).onLock?.(e.row.id),["stop","prevent"])),onPointerdown:l[28]||(l[28]=w(()=>{},["stop"])),onDblclick:l[29]||(l[29]=w(()=>{},["stop"]))},null,40,Qs)):C("",!0),x(e.row)?(f(),k("button",{key:3,type:"button","data-sve-ht-eye":"",disabled:!N(e.row),title:O(e.row),innerHTML:e.row.hidden||e.row.sectionOff?ir:rr,onClick:l[30]||(l[30]=w(p=>i(t).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:l[31]||(l[31]=w(()=>{},["stop"])),onDblclick:l[32]||(l[32]=w(()=>{},["stop"]))},null,40,Js)):C("",!0),!g(e.row)&&!E(e.row)?(f(),k("button",{key:4,type:"button","data-sve-ht-dup":"",disabled:!N(e.row),title:N(e.row)?i(t).duplicateTitle:i(t).lockedTitle,innerHTML:lr,onClick:l[33]||(l[33]=w(p=>i(t).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:l[34]||(l[34]=w(()=>{},["stop"])),onDblclick:l[35]||(l[35]=w(()=>{},["stop"]))},null,40,er)):C("",!0),g(e.row)?C("",!0):(f(),k("button",{key:5,type:"button","data-sve-ht-del":"",disabled:!N(e.row),title:N(e.row)?i(t).deleteTitle:i(t).lockedTitle,innerHTML:vr,onClick:l[36]||(l[36]=w(p=>i(t).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:l[37]||(l[37]=w(()=>{},["stop"])),onDblclick:l[38]||(l[38]=w(()=>{},["stop"]))},null,40,tr)),M(e.row)?(f(),k("button",{key:6,type:"button","data-sve-ht-more":"","aria-label":i(t).moreTitle,"aria-haspopup":"menu",innerHTML:ur,onPointerenter:l[39]||(l[39]=p=>te(p.currentTarget,e.row)),onPointerleave:de,onClick:l[40]||(l[40]=w(p=>{de(),i(t).onMore?.(p.currentTarget,e.row.id)},["stop","prevent"])),onPointerdown:l[41]||(l[41]=w(()=>{},["stop"])),onDblclick:l[42]||(l[42]=w(()=>{},["stop"]))},null,40,or)):C("",!0)]))],16,Ds),e.row.emptyBlock&&!e.row.shut?(f(),k("div",Ee({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},i(t).dropId===e.row.id&&i(t).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),L(i(t).slotText),17,nr)):C("",!0)],64))}},Z=Xt(mr,[["__scopeId","data-v-4f2157c5"]]),pr=["data-sve-ht-look","data-sve-ht-layers"],gr={key:0,class:"sve-ht-page-template"},kr={key:0,class:"sve-ht-page-template__text"},yr={class:"sve-ht-page-template__note"},br={key:1,class:"sve-ht-empty"},Tr={key:2,class:"sve-ht-empty"},xr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},wr={key:0,class:"sve-ht-empty"},_r={key:0,class:"sve-ht-empty"},Sr=["data-sve-ht-under-main"],Cr={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},Pr={key:0,class:"sve-ht-empty"},Er=["data-sve-ht-under-main"],Hr=["data-dim"],Mr={key:0,class:"sve-ht-empty"},Lr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},Ir={key:0,class:"sve-ht-empty"},Rr={key:4,"data-sve-ht-branch":"","data-sve-ht-cat":"component"},Or={__name:"HtmlTreeList",setup(e){const o=fe(()=>Ko(t.query)),a=fe(()=>$s(t.rows,o.value)),n=fe(()=>a.value.rows),s=fe(()=>o.value?t.sections.filter(x=>Lt(x.row,o.value)||x.current&&x.ready&&n.value.length>0):t.sections);function r(x){return!!x&&(!o.value||Lt(x,o.value))}function d(x){const O=t.frame?.kind;return t.inComponent||(O==="header"||O==="footer")&&O!==x}const h=fe(()=>t.frame?.kind==="header"||t.frame?.kind==="footer"),m=fe(()=>!!t.frame&&["header","main","footer"].some(x=>r(t.frame[x]))),g=fe(()=>!!t.frame&&(t.frame.kind==="main"||r(t.frame.main))),E=fe(()=>!!o.value&&!s.value.length&&!n.value.length&&!m.value);function T(x){return!!o.value&&!a.value.hits.has(x.path)}function M(x){const O={"data-sve-ht-sec-uid":x.uid};return x.current&&(O["data-sve-ht-branch"]="",O["data-sve-ht-cat"]=x.row?.cat||"layout"),t.sectionDrop&&t.sectionDrop.uid===x.uid&&(O["data-sve-ht-drop"]=t.sectionDrop.place),O}return(x,O)=>(f(),k("div",Ee({class:"sve-ht-root","data-sve-ht-look":i(t).layers?"tags":i(t).look,"data-sve-ht-layers":i(t).layers?"":null,style:i(t).familyStyle},i(t).dragging?{"data-sve-ht-dragging":""}:{}),[i(t).pageTemplate?(f(),k("div",gr,[i(t).pageTemplate.text?(f(),k("p",kr,L(i(t).pageTemplate.text),1)):C("",!0),R("p",yr,L(i(t).pageTemplate.note),1),i(t).pageTemplate.canOpen?(f(),k("button",{key:1,type:"button",class:"sve-ht-page-template__open",onClick:O[0]||(O[0]=_=>i(t).pageTemplate.onOpen(_.currentTarget))},L(i(t).pageTemplate.openLabel),1)):C("",!0)])):!i(t).rows.length&&!i(t).sections.length&&!i(t).frame?(f(),k("div",br,L(i(t).emptyText),1)):E.value?(f(),k("div",Tr,L(i(t).searchEmpty),1)):C("",!0),i(t).frame||i(t).sections.length?(f(),k($,{key:3},[i(t).frame?(f(),k($,{key:0},[i(t).frame.kind==="header"?(f(),k("div",xr,[(f(!0),k($,null,se(n.value,_=>(f(),K(Z,{key:_.id,row:_,dim:T(_)},null,8,["row","dim"]))),128)),i(t).rows.length?C("",!0):(f(),k("div",wr,L(i(t).emptyText),1))])):!h.value&&r(i(t).frame.header)?(f(),K(Z,{key:1,row:i(t).frame.header,dim:d("header")},null,8,["row","dim"])):C("",!0)],64)):C("",!0),h.value?C("",!0):(f(),k("div",_n(Ee({key:1},i(t).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[i(t).frame?.kind==="main"?(f(),k($,{key:0},[(f(!0),k($,null,se(n.value,_=>(f(),K(Z,{key:_.id,row:_,dim:T(_)},null,8,["row","dim"]))),128)),i(t).rows.length?C("",!0):(f(),k("div",_r,L(i(t).emptyText),1))],64)):i(t).frame&&r(i(t).frame.main)?(f(),K(Z,{key:1,row:i(t).frame.main,dim:d("main")},null,8,["row","dim"])):C("",!0),i(t).frame?.kind==="template"?Ht((f(),k("div",{key:2,"data-sve-ht-frame-body":"","data-sve-ht-under-main":g.value?"":null},[R("div",Cr,[(f(!0),k($,null,se(n.value,_=>(f(),K(Z,{key:_.id,row:_,dim:T(_)},null,8,["row","dim"]))),128)),i(t).rows.length?C("",!0):(f(),k("div",Pr,L(i(t).emptyText),1))])],8,Sr)),[[ro,!i(t).mainShut]]):C("",!0),i(t).sections.length||i(t).frame?Ht((f(),k("div",{key:3,"data-sve-ht-frame-body":"","data-sve-ht-under-main":g.value?"":null},[i(t).frame?.template&&r(i(t).frame.template)?(f(),K(Z,{key:0,row:i(t).frame.template,dim:d("template")},null,8,["row","dim"])):C("",!0),i(t).frame&&!i(t).frame.template&&!i(t).sections.length&&!o.value?(f(),k("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":d("")?"":void 0},L(i(t).frameEmptyText),9,Hr)):C("",!0),(f(!0),k($,null,se(s.value,_=>(f(),k("div",Ee({key:_.uid},{ref_for:!0},M(_)),[_.ready?(f(),k($,{key:0},[(f(!0),k($,null,se(n.value,te=>(f(),K(Z,{key:te.id,row:te,dim:T(te)},null,8,["row","dim"]))),128)),i(t).rows.length?C("",!0):(f(),k("div",Mr,L(i(t).emptyText),1))],64)):(f(),K(Z,{key:1,row:_.row,dim:d("")},null,8,["row","dim"]))],16))),128))],8,Er)),[[ro,!i(t).frame||!i(t).mainShut]]):C("",!0)],16)),i(t).frame?(f(),k($,{key:2},[i(t).frame.kind==="footer"?(f(),k("div",Lr,[(f(!0),k($,null,se(n.value,_=>(f(),K(Z,{key:_.id,row:_,dim:T(_)},null,8,["row","dim"]))),128)),i(t).rows.length?C("",!0):(f(),k("div",Ir,L(i(t).emptyText),1))])):!h.value&&r(i(t).frame.footer)?(f(),K(Z,{key:1,row:i(t).frame.footer,dim:d("footer")},null,8,["row","dim"])):C("",!0)],64)):C("",!0)],64)):i(t).inComponent&&i(t).rows.length?(f(),k("div",Rr,[(f(!0),k($,null,se(n.value,_=>(f(),K(Z,{key:_.id,row:_,dim:T(_)},null,8,["row","dim"]))),128))])):i(t).rows.length?(f(!0),k($,{key:5},se(n.value,_=>(f(),K(Z,{key:_.id,row:_,dim:T(_)},null,8,["row","dim"]))),128)):C("",!0)],16,pr))}},Tt=Xt(Or,[["__scopeId","data-v-d0376715"]]);let xt=null;function $r(e){return xt||(xt=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(o=>o.ok?o.json():{pages:[]}).then(o=>Array.isArray(o.pages)?o.pages:[]).catch(()=>[])),xt}let tt=null;function wt(){tt?.dismiss(),tt=null}function Dr(e,o,a){wt();const n=o?.getBoundingClientRect?.(),s={x:n?n.left:0,y:n?n.bottom+4:0};$r(e).then(r=>{const d=r.length?r.map(h=>({label:h.title||h.url,onPick:()=>{wt(),a(h.url)}})):[{label:v(e,"component_props_pages_none"),onPick:null}];wt(),tt=Re(e.document,Oe,{items:d,x:s.x,y:s.y,onClose:()=>{tt=null}})})}function Uo(e){for(const o of e||[]){if(o.kind==="component"||o.kind==="svg"&&o.dynamic)continue;const a=o.kind==="antlers"?Uo(o.children):o;if(a)return a}return null}const U=wa("sve-call-values"),Ar="__sve-html-tree-style";function Fr(e,o,a){if(o||a)return!1;const n=String(b("dock:chrome-kind")||"");if(n==="header"||n==="footer")return!1;const s=wo(e);return!!s&&s!=="create"&&Hn(e)!==Mn(e)}function qo(e){return{sectionLoops:En(e),sectionsLabel:v(e,"html_tree_sections_slot")}}function Br(e,o){const a={entry:o,text:"",note:v(e,"html_tree_page_template_note"),openLabel:v(e,"html_tree_open_template"),canOpen:!1,onOpen:null};return $o(e,{entry:o}).then(n=>{!n||t.pageTemplate?.entry!==o||(t.pageTemplate={...t.pageTemplate,text:v(e,"html_tree_page_template",{name:n.name}),canOpen:!!n.open,onOpen:n.open?s=>ta(e,s,n.open):null})}),a}function Nr(e,o){const a=o.replace(/^view:/,"");if(!a||b("dock:current-type")!==o){t.usedBy=null,t.templateSections=[];return}t.usedBy?.view!==a&&(t.usedBy=null,$o(e,{view:a}).then(n=>{if(!n||b("dock:current-type")!==o)return;const s=n.everything?[{name:v(e,"html_tree_used_by_everything"),kind:"everything",url:null}]:n.used_by.map(r=>({...r,...Vr(e,r)}));t.templateSections=Array.isArray(n.sections_fields)?n.sections_fields:[],t.usedBy={view:a,label:v(e,"html_tree_used_by"),items:s,empty:s.length?"":v(e,"html_tree_used_by_nobody"),hint:s.length?v(e,"html_tree_used_by_hint",{list:s.map(r=>r.name).join(", ")}):""}}))}function Vr(e,o){if(!o.url)return{openLabel:"",onOpen:null};const a=v(e,"html_tree_used_by_open",{name:o.name});return o.kind==="page"?{openLabel:a,onOpen:n=>ra(e,n,ia(e,o.url))}:{openLabel:a,onOpen:n=>la(e,{anchor:n,url:o.url,subtitle:o.name})}}const q=new Set;let It="",Pe=!1,_t=null,ge=!0,Y="",xe=0,Yo="";const we=new Map,Ve=new Set,Rt=new Map,ot=new Map;let j="",zo=!1,I=null,nt=null,Qe="",at="",st=0,Ot=null,Me=[],Te=null,je=null,rt=null,it=null,$t=null,le=!1,J=null,qe=null,Ke=null,lt=null,dt=null,Dt=null,be=null;function z(e){return e.getElementById(et)}function jr(e){Sn(e,Ar,`
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
      ${co("light")}
      /* How much of a row's own colour its pick takes: a wash, not a fill.
         The row mixes it in below — a mix written up here would read
         --sve-ht-c on the list, where no family is set. */
      --sve-ht-pick-mix: 11%;
      --sve-ht-pick-hover-mix: 18%;
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${co("dark")}
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
  `)}function X(){const e=b("dock:html");return typeof e=="string"?e:""}function Xo(e){return!!b("dock:is-open",e)}function $e(e,{save:o=!1,unlock:a=!1}={}){return ct()||b("dock:set-html",a?{html:e,unlock:!0}:e)!==!0?!1:(o&&b("dock:save-now"),!0)}function St(e){const o=b("dock:component-exit-state")||{};if(t.exitOpen=!!o.open,!o.open){t.onExit=null;return}t.exitName=o.name||"",t.exitLabel=v(e,"component_exit"),t.exitTitle=v(e,o.back?"component_exit_back":"component_exit_close"),t.onExit=()=>{b("dock:exit-component"),P(e)}}const Ye=[];let Ct=!1;function Pt(e,o){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(o,{timeout:2e3});return}e.setTimeout(o,200)}function Kr(e,o){for(const a of o){const n=a.type;!n||we.has(n)||Ve.has(n)||Ye.includes(n)||Ye.push(n)}qt.htmlTreePrefetchArmed&&Wo(e)}function zi(e){qt.htmlTreePrefetchArmed=!0,Wo(e)}function Wo(e){if(Ct||!Ye.length)return;Ct=!0;const o=()=>{const a=Ye.shift();if(!a){Ct=!1;return}if(we.has(a)||Ve.has(a)){Pt(e,o);return}Ve.add(a),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(a)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{if(typeof n?.html=="string"){we.set(a,n.html);const s=ot.get(a);ot.delete(a),s&&s!==Go(e,a)&&P(e)}}).catch(()=>{}).finally(()=>{Ve.delete(a),Pt(e,o)})};Pt(e,o)}function ct(){return!!j}function Go(e,o){return Zo(o)||Ln(e,o)||"section"}function Zo(e){const o=we.get(e);if(!o)return"";const a=Rt.get(e);if(a&&a.html===o)return a.tag;const n=Zt(ft(o))?.tag||"";return Rt.set(e,{html:o,tag:n}),n}function We(e,o){const a=vt(e)||"page_sections",n=[];for(const s of Kt(o)||[]){if(s.name===ea||s.name===ga)continue;const r=Ut(s.values),d=r&&typeof r=="object"?r[a]:null;if(Array.isArray(d)){d.forEach(h=>{if(!h||typeof h!="object"||Array.isArray(h)||typeof h.type!="string")return;const m=[h._visual_id,h.id,h._id].filter(x=>typeof x=="string"&&x!=="");if(!m.length)return;const g=Oo(e,h),E=typeof h._sve_label=="string"?h._sve_label.trim():"",T=Go(e,g);Zo(g)||ot.set(g,T);const M=Vo(g)[`0:${T}`];n.push({uid:m[0],ids:m,type:g,tag:T,label:E||(typeof M=="string"&&M.trim()?M.trim():"")||mt(e,g)?.display||Ue(g)||g,svg:No(T,po(T),null).svg||He.section,cat:Io(T,po(T)),enabled:h.enabled!==!1,static:Bn(e,g)})});break}}return n}function Ur(e,o,a){if(!a.length)return"";const n=b("dock:current-type")||"",s=b("dock:current-uid"),r=!!b("dock:component-exit-state")?.open;if(s){const d=Xe(s,o),h=a.find(m=>m.ids.some(g=>d.includes(g)));if(h&&(r||h.type===n))return h.uid}return a.find(d=>d.type===n)?.uid||""}function qr(e,o,a){const n=b("dock:component-exit-state");if(n?.open)return Ue(n.name)||n.name||"";if(a)return o.find(r=>r.uid===a)?.label||"";const s=b("dock:current-type")||"";return String(s).startsWith("view:")?"":mt(e,s)?.display||Ue(s)||""}function pt(e,o,a,n,s){const r=a.find(d=>d.uid===n);r&&n!==s&&(q.clear(),I=null,ge=!1,D(),Ge(),b("build:reveal",{ids:r.ids}),Y=n,Yo=X(),j=we.get(r.type)||"",j&&(I=Ft(ft(j))||null),zo=(b("dock:current-type")||"")===r.type,e.clearTimeout(xe),xe=e.setTimeout(()=>{Y="",Pe=!1,P(e)},4e3),P(e),sa(e,r.uid,"tree"),ke({source:W,type:B.SVE_ACTIVATE,ids:r.ids},e),e.setTimeout(()=>P(e),0))}function At(e,o){if(!o)return!1;for(const a of e||[])if(a.id===o||At(a.children,o))return!0;return!1}function Ft(e){return Zt(e)?.id||""}function Zt(e){for(const o of e||[]){if(Qo(o))return o;const a=Zt(o.children);if(a)return a}return null}function Qo(e){return!e.kind||e.kind==="component"}function po(e){return e==="component"?"component":""}function Yr(e,o){const a=o===0||e.path===at;return q.has(e.path)?a:!a}function zr(e){const o=new Set,a=(n,s)=>{for(const r of n)r.children.length&&Yr(r,s)&&o.add(r.id),a(r.children,s+1)};return a(e,0),o}function P(e){const o=e.document,n=z(o)?.querySelector("[data-sve-html-tree-list]");if(!n)return;jr(o),Ta(e);const s=X();j&&j===s&&(j=""),b("dock:chrome-kind")&&(j="");const r=j||s,d=ft(r,qo(e));Me=d,at="";const h=b("dock:current-type")||"",m=Vo(h),g=Pn(e,o),T=!!(b("dock:component-exit-state")||{}).open;h&&s&&!j&&we.set(h,s);const M=We(e,o);Kr(e,M);const x=Ur(e,o,M);if(Fr(e,g,T)){const c=wo(e);Me=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!1,t.layoutFile=!1,t.usedBy=null,t.emptyText="",t.pageTemplate?.entry!==c&&(t.pageTemplate=Br(e,c)),t.onRefresh=()=>P(e),t.onSection=null,St(e),Ne(n,Tt),Et(e,[]);return}t.pageTemplate=null,Nr(e,String(b("dock:collection-view")||""));const O=String(b("dock:chrome-kind")||"");if(Wn(e),g&&!M.length&&!O){Me=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,t.layoutFile=!1,t.emptyText=v(e,"html_tree_page_empty"),t.canEdit=!b("dock:is-locked"),t.look=ho(e),t.onRefresh=()=>P(e),t.onSection=null,St(e),Ne(n,Tt),Et(e,[]);return}t.pageBuilder=g;const _=`${h}|${x}`;let te=!1;_!==It&&(It=_,q.clear(),_t!==null&&r!==_t?te=!0:Pe=r),(te||Pe!==!1&&r!==Pe)&&(Pe=!1,q.clear(),I=Ft(d)||null),_t=r,Y&&(Y===x||!M.length)&&(zo||r!==Yo)&&(e.clearTimeout(xe),Y="",Pe=!1,At(d,I)||(q.clear(),I=Ft(d)||null));const de=M.some(c=>c.uid===Y)?Y:"",G=ge?"":de||x,N=!!(de||x),H=N||T?"":String(b("dock:chrome-kind")||""),l=g&&(!h&&!N||H==="main"&&b("dock:on-empty-page")===!0),p=l||H==="template"?"":H;t.layoutFile=p==="main",p!=="main"&&(Qe="");const A=p==="main"?go(d,"main"):null,F=A?ht(d,c=>c.tag==="body"&&At(c.children,A.id)):null;at=F?F.path:"",A&&(Je((F||A).path),Qe!==_&&(Je(A.path),q.add(A.path)));const De=p==="header"||p==="footer"?ht(d,c=>r.slice(c.from,c.openTo).includes(`data-sve-chrome="${p}"`)):null,ce=De||(p==="header"||p==="footer"?go(d,p):null);ce&&Je(ce.path);const V=l||!(p==="main"?!!A:p==="header"||p==="footer"?!!ce:!0)?[]:Gn(d,t.query?new Set:zr(d));!r.trim()&&!Xo(o)?t.emptyText=v(e,"html_tree_need_dock"):t.emptyText=v(e,"html_tree_empty"),t.slotText=v(e,"antlers_drop_here"),t.dataTitle=v(e,"data_vars_title"),t.pageTitle=v(e,"component_props_page"),t.renameTitle=v(e,"html_tree_rename"),t.tagTitle=v(e,"tw_tag"),t.hideTitle=v(e,"html_tree_hide"),t.showTitle=v(e,"html_tree_show"),t.sectionHideTitle=v(e,"html_tree_section_hide"),t.sectionShowTitle=v(e,"html_tree_section_show"),t.moreTitle=v(e,"html_tree_more"),t.duplicateTitle=v(e,"html_tree_duplicate"),t.deleteTitle=v(e,"html_tree_delete"),t.videoHoldTitle=v(e,"html_tree_video_hold"),t.videoPlayTitle=v(e,"html_tree_video_play"),t.alpineTitle=v(e,"html_tree_alpine_state"),t.lockedTitle=v(e,"html_tree_locked"),t.searchEmpty=v(e,"html_tree_search_empty"),t.canEdit=!b("dock:is-locked"),t.look=ho(e),t.onQuery=()=>P(e),St(e),t.inComponent=T,t.onSelect=(c,y)=>{const S=V.find(oe=>oe.id===c);if(S&&Bo(e,S.path))return;y&&!Aa()&&(t.rowClicks+=1);const re=!!y&&S?.kind==="antlers"&&!le&&Zn(e);Ie(e,c,V),y&&S&&!le&&!ct()&&b("build:reveal",{path:S.path,section:!!S.sectionRoot}),re&&qa(e,{path:S.path,at:y,beside:z(e.document)})},t.onTwist=c=>{const y=V.find(S=>S.id===c)?.path;y&&(q.has(y)?q.delete(y):q.add(y),P(e))},t.onTagChange=(c,y)=>{const S=t.rows.find(re=>re.id===y);S&&!ct()&&!Qt(e,S)&&xa(e,c.currentTarget,S)},t.onRename=c=>ei(e,c),t.onRenameCommit=()=>ko(e,!0),t.onRenameCancel=()=>ko(e,!1),t.onHide=c=>si(e,c),t.onLock=c=>tn(e,c),t.onMore=(c,y)=>ci(e,c,y),t.canUnlock=en(e),t.lockTitle=v(e,"html_tree_lock"),t.unlockTitle=v(e,"html_tree_unlock"),t.lockedByTitle=v(e,"html_tree_locked_by_developer"),t.onVideoHold=c=>oi(e,c),t.onAlpineState=(c,y)=>ai(e,c,y),t.onDuplicate=c=>ri(e,c),t.onDelete=c=>li(e,c),t.onPointerDown=(c,y)=>vi(e,c,y),t.onSectionPointerDown=(c,y)=>pi(e,c,y),t.onSectionHover=c=>e.dispatchEvent(new e.CustomEvent("sve-lite-hover",{detail:{uid:c}})),t.onContext=(c,y)=>rn(e,c,y),t.onInspectCommit=c=>wi(e,c),t.onPropValue=(c,y,S)=>xo(e,c,y,S),t.onPropPage=(c,y)=>Dr(e,c,S=>xo(e,y,S,!1)),t.onLoopKind=c=>_i(e,c),t.onAddBranch=c=>Si(e,c),t.onLoopSortField=c=>{const y=ut();if(!y)return;const S=be?.id===y.id?be.dir:"";be=null,ie(e,Wa(y,c,S))},t.onLoopSortDir=c=>{const y=ut();if(!y)return;const S=Ga(y,c);if(S.draft){be={id:y.id,dir:S.draft},Vt(e,y);return}be=null,ie(e,S.edit)},t.onLoopDepth=c=>ie(e,Ja(c)),t.onLoopIncludeHome=c=>ie(e,es(c)),t.onLoopLimit=c=>ie(e,ts(c)),t.onLoopOffset=c=>ie(e,os(c)),t.onPropHost=c=>c?U.mount(c):U.unmount(),t.onInspectData=(c,y)=>{b("dock:data-menu",{anchor:c,at:V.find(S=>S.id===I)?.from,onPick:S=>y(String(S?.var||"").trim())})};const kt=V.find(Qo)?.id,Ze=T?"":qr(e,M,G),he=G&&!T?M.find(c=>c.uid===G):null;t.nameAt=(c,y)=>{if(y!==r||!c)return"";const S=ne=>{for(const ae of ne||[]){if(ae.path===c)return ae;const Fe=c.startsWith(`${ae.path}/`)?S(ae.children):null;if(Fe)return Fe}return null},re=t.look==="tags"&&!t.layers,oe=t.rows.find(ne=>ne.path===c&&!ne.kind);if(oe)return re&&oe.display?oe.display:oe.name;const ee=S(d);if(!ee)return"";const Ae=ee.id===kt,Se=Ae&&Ze?Ze:ee.klass,Ce=Ae&&he?Se:vo(Se,ee.path,m);return re&&!Ae&&Ce===ee.klass?"":Ce};const vn=Mo(e,String(b("dock:current-type")||""));let fn=0;const mn=ni(De?[De]:d,r),pn=Lo(e,String(h)),ue=p==="header"||p==="footer"?p:"",_e=ce?ce.id:"",ye=A&&V.find(c=>c.id===A.id)||null,no=F&&V.find(c=>c.id===F.id)||null,ve=no||ye||_e&&V.find(c=>c.id===_e)||null,ao=ve?Zr(V,ve):-1;if(ve&&!V.slice(V.indexOf(ve),ao).some(c=>c.id===I)&&(I=ve.id),t.selectFrom){const c=V.find(y=>y.from===t.selectFrom.at&&(!y.kind||y.kind==="sections"));c?(I=c.id,t.selectFrom=null):--t.selectFrom.left<=0&&(t.selectFrom=null)}const so=t.layoutFile?Gr(e):null;t.rows=V.map(c=>{const y=so&&c.kind==="component"&&so.get(c.src)||"",S=c.tag==="body"&&!c.kind,re=y?{svg:He[y]}:No(c.tag,c.kind,c.antlers),oe=c.tag==="video"&&!c.kind?fn++:-1,ee=mn.get(c.id),Ae=ee?pn[ee.nth]||{}:{},Se=ee?ee.booleans.map(({key:ae,value:Fe})=>({key:ae,file:Fe,value:Ae[ae]??Fe})):[],Ce=c.id===kt&&Ze?Ze:c.klass,ne=c.id===kt;return{...c,tag:y||c.tag,frameCall:y,fixed:!!y||S,base:Ce,name:y?v(e,`html_tree_frame_${y}`):ue&&c.id===_e?v(e,`html_tree_frame_${ue}`):c===ye?v(e,"html_tree_frame_main"):ne&&he?Ce:vo(Ce,c.path,m),current:c.id===I,letter:re.letter||"",svg:ue&&c.id===_e?He[ue]:c===ye?He.main:ne&&he?he.svg:re.svg||"",frame:ue&&c.id===_e?ue:c===ye?"main":"",cat:ue&&c.id===_e?ue:c===ye||S?"main":y||Io(c.tag,c.kind,c.antlers),componentRoot:ne&&T,sectionRoot:ne&&he?he.uid:"",sectionOff:!!(ne&&he&&!he.enabled),videoNth:oe,videoHeld:oe>=0&&vn.has(oe),alpineNth:Se.length?ee.nth:-1,alpineKeys:Se,alpineSet:Se.some(ae=>ae.value!==ae.file)}});const gn=Ya(r,d);for(const c of t.rows){const y=c.kind?null:gn.get(c.path);y&&(c.classes=y.classes,y.kind!=="tag"&&!c.frame&&!c.fixed&&!c.sectionRoot&&c.name===c.klass&&(c.display=y.kind==="column"?v(e,"el_column",{n:y.index}):v(e,`el_${y.kind}`)))}Qn(e),Jn(e);const yt=[];for(const c of t.rows)yt.length=c.depth,c.guides=yt.slice(),yt[c.depth]=c.cat;if(ve){const c=V.indexOf(ve),y=ve.depth;t.rows=t.rows.slice(c,ao).map(S=>({...S,depth:S.depth-y,guides:S.guides.slice(y)})),ye&&Qe!==_&&(Qe=_,e.setTimeout(()=>Ie(e,ye.id,V),0))}t.sections=g&&!T&&(N||p||l)?M.map(c=>{const y=!!G&&c.uid===G;return{...c,current:y,ready:y&&(!de||!!j),row:{id:`sec:${c.uid}`,section:c.uid,tag:c.tag,name:c.label,kind:"",svg:c.svg,cat:c.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:y,hidden:!c.enabled}}}):[],t.frame=Wr(e,M,N,T,p,!1,!!no),t.frameEmptyText=v(e,"html_tree_frame_no_sections"),Xr(e,p),t.onSection=c=>{le||(Bt(e),pt(e,o,M,c,G))},t.onRefresh=()=>P(e),Vt(e,t.rows.find(c=>c.id===I)),Ne(n,Tt),Et(e,d)}function Xr(e,o){t.frameOpenTitle=v(e,"html_tree_frame_open"),t.frameMainTitle=v(e,"html_tree_frame_main_open"),t.frameTemplateTitle=v(e,"html_tree_frame_template_open"),t.frameFieldsTitle=v(e,"html_tree_frame_fields"),t.onFrame=a=>{o===a?Qr(e,a):Nt(e,a)},t.onFrameEnter=a=>Nt(e,a),t.onFrameFields=a=>Vn(e,na(e,a),v(e,`html_tree_frame_${a}`)),t.onFrameTwist=()=>{t.mainShut=!t.mainShut}}function Wr(e,o,a,n,s,r=!1,d=!1){if(!s&&!r||d)return null;const h=E=>({id:`frame:${E}`,frame:E,synthetic:!0,tag:E,name:v(e,`html_tree_frame_${E}`),kind:"",svg:He[E]||"",cat:E,letter:"",depth:0,hasChildren:E==="main"&&(o.length>0||s==="template"),shut:E!=="main",current:!1,hidden:!1}),m={kind:s,header:h("header"),main:h("main"),footer:h("footer"),template:null},g=s&&s!=="template"?String(b("dock:collection-view")||""):"";return g&&(m.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:mt(e,g)?.display||Ue(g.replace(/^view:/,"")),kind:"",svg:He.section||"",cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),m}function go(e,o){return ht(e,a=>a.tag===o)}function ht(e,o){for(const a of e||[]){if(!a.kind&&o(a))return a;const n=ht(a.children,o);if(n)return n}return null}function Gr(e){const o=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},a=new Map;for(const n of["header","footer"]){const s=Sa(o[n]?.type);s&&a.set(s,n)}return a}function Zr(e,o){let a=e.indexOf(o)+1;for(;a<e.length&&e[a].depth>o.depth;)a+=1;return a}function Qr(e,o){const a=Fo(e);(o==="main"||o==="template"?a?.querySelector("main"):a?.querySelector(`[data-sve-chrome="${o}"]`))?.scrollIntoView({behavior:ma(),block:"start"})}function Bt(e){const o=String(b("dock:chrome-open",e.document)||"");return o!=="header"&&o!=="footer"?!1:(aa(e),ke({source:W,type:B.SVE_FORCE_EXIT_CHROME},e),!0)}function Jr(e){e.clearTimeout(xe),Y="",j="",q.clear(),I=null,ge=!1,D(),Ge()}function Nt(e,o){if(e.document,String(b("dock:chrome-kind")||"")===o)return;if(Jr(e),o==="main"){Bt(e),b("dock:open-file",ka);return}if(o==="template"){const r=String(b("dock:collection-view")||"");r&&(Bt(e),b("dock:open-file",r));return}if(o!=="header"&&o!=="footer")return;const a=Fo(e)?.querySelector(`[data-sve-chrome="${o}"]`);a?(a.scrollIntoView({block:"nearest"}),a.dispatchEvent(new a.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:W,type:B.OPEN_CHROME,kind:o},e.location.origin);const n=Date.now(),s=async()=>{if(String(b("dock:chrome-kind")||"")!==o){Date.now()-n<3e4&&e.setTimeout(s,250);return}await(b("dock:load-settled")||null),un(e)};e.setTimeout(s,250)}function Et(e,o){z(e.document)&&Jo(e,o)}function Jo(e,o){const a=Uo(o),n=!!b("dock:component-src"),s=n?"":b("dock:current-uid")||"";ke({source:W,type:B.SVE_HTML_PICK,on:!0,uid:s,uids:s?Xe(s,e.document):[],all:n,tag:a?.tag||"",klass:a?.klass||"",nodes:Xa(o)},e)}function Je(e){if(!e)return;const o=(a,n)=>{for(const s of a||[]){if(s.path===e)return!0;if(o(s.children,n+1))return n===0||s.path===at?q.delete(s.path):q.add(s.path),!0}return!1};o(Me,0)}function ei(e,o){if(le)return;const a=t.rows.find(n=>n.id===o);Qt(e,a)||!a||a.kind||(I=o,t.rows.forEach(n=>{n.current=n.id===o}),t.editingId=o,t.draft=a.name,e.setTimeout(()=>{const n=z(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function ko(e,o){const a=t.editingId;if(!a)return;const n=t.rows.find(s=>s.id===a);t.editingId=null,o&&n&&(n.sectionRoot?ti(e,n.sectionRoot,t.draft):za(b("dock:current-type")||"",n.path,t.draft,n.base||n.klass)),t.draft="",P(e)}function ti(e,o,a){const n=vt(e)||"page_sections",s=String(a||"").replace(/\s+/g," ").trim();for(const r of Kt(e.document)||[]){const d=Ut(r.values),h=d&&typeof d=="object"?d[n]:null;if(!Array.isArray(h))continue;const m=h.findIndex(M=>M&&typeof M=="object"&&[M._visual_id,M.id,M._id].includes(o));if(m===-1)continue;const g=Oo(e,h[m]),E=mt(e,g)?.display||Ue(g)||g,T=JSON.parse(JSON.stringify(h));return T[m]={...T[m]},!s||s===E?delete T[m]._sve_label:T[m]._sve_label=s,r.setFieldValue(n,T),!0}return!1}function oi(e,o){const a=t.rows.find(h=>h.id===o);if(!a||!(a.videoNth>=0))return;const n=String(b("dock:current-type")||""),s=Mo(e,n),r=!s.has(a.videoNth);r?s.add(a.videoNth):s.delete(a.videoNth);const d=String(b("dock:current-uid")||"");oa(e,n,s),ke({source:W,type:B.SVE_VIDEO_HOLD,uid:d,uids:d?Xe(d,e.document):[],nth:a.videoNth,on:r},e),P(e)}function ni(e,o){const a=new Map;let n=0;const s=r=>{for(const d of r){if(d.hidden)continue;const h=d.kind?null:ss(o.slice(d.from,d.openTo));h!==null&&a.set(d.id,{nth:n++,booleans:is(h)}),s(d.children||[])}};return s(e),a}function ai(e,o,a){const n=t.rows.find(r=>r.id===a);if(!n||!(n.alpineNth>=0))return;if(n.alpineKeys.length===1){yo(e,n,n.alpineKeys[0]);return}const s=o.currentTarget.getBoundingClientRect();D(),J=Re(e.document,Oe,{items:n.alpineKeys.map(r=>({label:r.key,icon:r.value?nn:an,onPick:()=>{D(),yo(e,n,r)}})),x:Math.round(s.left),y:Math.round(s.bottom+4),onClose:()=>{J=null}})}function yo(e,o,a){const n=String(b("dock:current-type")||""),s=Lo(e,n),r=!a.value,d=r!==a.file,h={...s[o.alpineNth]||{}};d?h[a.key]=r:delete h[a.key],Object.keys(h).length?s[o.alpineNth]=h:delete s[o.alpineNth];const m=ha(String(b("dock:chrome-kind")||"")),g=m?"":String(b("dock:current-uid")||"");ua(e,n,s),ke({source:W,type:B.SVE_ALPINE_STATE,uid:g,uids:g?Xe(g,e.document):[],chrome:m,nth:o.alpineNth,key:a.key,value:r,on:d},e),P(e)}function Qt(e,o){return!o||!(o.locked||o.lockedIn)?!1:(e.Statamic?.$toast?.error(v(e,"html_tree_locked_element")),!0)}function en(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function tn(e,o){const a=t.rows.find(n=>n.id===o);if(!(!a||a.lockedIn||b("dock:is-locked"))){if(!a.locked){Le(e,o,Fa,{lockAction:!0});return}if(!en(e)){e.Statamic?.$toast?.error(v(e,"html_tree_unlock_denied"));return}Yt(e,{titleKey:"html_tree_unlock_title",bodyKey:"html_tree_unlock_body",confirmKey:"html_tree_unlock_confirm"},()=>Le(e,o,Ba,{lockAction:!0,unlock:!0}))}}function Jt(e){return!!t.rows.find(o=>o.id===e)?.fixed}function eo(e){const o=t.sections?.find(n=>n.row?.id===e);if(o)return o;const a=t.rows.find(n=>n.id===e)?.sectionRoot;return a&&t.sections?.find(n=>n.uid===a)||null}function si(e,o){if(Jt(o))return;const a=eo(o),n=t.rows.find(s=>s.id===o);if(a&&!(n?.hidden&&n.wrapFrom!=null)){e.postMessage({source:W,type:B.HIDE_ROW,uid:a.uid,show:!a.enabled},e.location.origin),e.setTimeout(()=>P(e),60);return}Le(e,o,Na)}function ri(e,o){if(Jt(o))return;const a=eo(o)?.uid;if(a){e.postMessage({source:W,type:B.DUPLICATE_ROW,uid:a},e.location.origin);return}Le(e,o,Va)}function on(e,o){Yt(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const a=e.document;pa({uid:o},a,e)})}function ii(e,o,a){Y===a&&(e.clearTimeout(xe),Y="",j=""),I=null,ge=!1,It="";const n=We(e,o),s=n.find(r=>r.uid!==a)||n[0];s?pt(e,o,n,s.uid,""):(j="",t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,P(e)),e.setTimeout(()=>{z(e.document)&&P(e)},0)}Ro("row:removed",({uid:e,parentPath:o,doc:a,win:n})=>{o!==vt(n)||!z(n.document)||ii(n,a,e)});function li(e,o){if(Jt(o))return;const a=t.sections?.find(s=>s.row?.id===o),n=a?a.row?.section||a.uid:t.rows.find(s=>s.id===o)?.sectionRoot;if(n){on(e,n);return}if(t.rows.find(s=>s.id===o)?.kind==="sections"){Yt(e,{titleKey:"html_tree_sections_remove_title",bodyKey:"html_tree_sections_remove_body",confirmKey:"html_tree_sections_remove_confirm"},()=>Le(e,o,uo));return}Le(e,o,uo)}function Le(e,o,a,{lockAction:n=!1,unlock:s=!1}={}){if(b("dock:is-locked"))return;const r=X(),d=t.rows.find(m=>m.id===o);if(!d||!n&&Qt(e,d))return;const h=a(r,d);h!==r&&$e(h,{unlock:s})}let ze=null;function to(){ze?.closest("[data-sve-ht-row]")?.removeAttribute("data-sve-ht-more-open"),ze=null}function D(){J?.dismiss(),J=null,to()}const nn='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',an='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>',me=e=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${e}</svg>`,pe={up:me('<path d="M12 19V5M6 11l6-6 6 6"/>'),down:me('<path d="M12 5v14M6 13l6 6 6-6"/>'),save:me('<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/>'),add:me('<path d="M12 5v14M5 12h14"/>'),blueprint:me('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>'),fieldset:me('<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/>'),lock:me('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),unlock:me('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-.9"/>')};function di(e,o){const a=t.sections||[],n=a.findIndex(d=>d.uid===o.uid),s=(d,h={})=>()=>{D(),e.postMessage({source:W,type:d,uid:o.uid,...h},e.location.origin),e.setTimeout(()=>P(e),60)},r=[{label:v(e,"move_up"),icon:pe.up,onPick:n>0?s(B.MOVE,{direction:-1}):null},{label:v(e,"move_down"),icon:pe.down,onPick:n>=0&&n<a.length-1?s(B.MOVE,{direction:1}):null},{label:v(e,"html_tree_save_section"),icon:pe.save,onPick:s(B.SAVE_SECTION)},{label:v(e,"add_section_below"),icon:pe.add,onPick:s(B.ADD_SET)}];if(da(e)&&r.push({label:v(e,"blueprint"),icon:pe.blueprint,onPick:()=>{D(),ca(e)}}),So(e)&&o.type&&!o.static){const d=o.current&&!t.canEdit;r.push({label:v(e,"html_tree_fieldset"),icon:pe.fieldset,onPick:d?null:()=>{D(),Co(e,o.type)}})}return r}function bo(e,o){const a=t.canEdit&&(!o.locked||t.canUnlock);return{label:o.locked?t.canUnlock?t.unlockTitle:t.lockedByTitle:t.lockTitle,icon:o.locked?pe.unlock:pe.lock,onPick:a?()=>{D(),tn(e,o.id)}:null}}function ci(e,o,a){if(!o.isConnected||J&&ze===o)return;const n=eo(a),s=t.rows.find(r=>r.id===a);if(!n){rn(e,null,a,{anchor:o,lead:s?[bo(e,s)]:[]});return}D(),ze=o,o.closest("[data-sve-ht-row]")?.setAttribute("data-sve-ht-more-open",""),J=Re(e.document,Oe,{items:[...di(e,n),...s?[bo(e,s)]:[]],x:0,y:0,anchor:o,onClose:()=>{J=null,to()}})}function sn(e,o){const a=t.sections?.find(m=>m.uid===o),n=a?.type||"";if(!n||!_o(e))return[];const s=a.label||n,r=Nn(e,n),d=()=>e.Statamic?.$toast?.error(v(e,"section_update_failed")),h=[{label:v(e,"static_section_insertable"),icon:r?an:nn,onPick:()=>{D(),io(e,{handle:n,hidden:!r}).then(()=>{e.Statamic?.$toast?.success(v(e,r?"section_shown_to_editors":"section_hidden_from_editors",{name:s})),lo(e)}).catch(d)}}];return a.static&&h.push({label:v(e,"section_add_fields"),onPick:()=>{D(),io(e,{handle:n,fields:!0}).then(()=>{e.Statamic?.$toast?.success(v(e,"section_fields_added",{name:s})),lo(e),P(e),Co(e,n)}).catch(d)}}),h}function hi(e,o,a){const n=a.row?.section||a.uid;n&&(J=Re(e.document,Oe,{items:[...sn(e,n),{label:v(e,"html_tree_remove_section"),danger:!0,onPick:()=>{D(),on(e,n)}}],x:o.clientX,y:o.clientY,onClose:()=>{J=null}}))}function rn(e,o,a,{anchor:n=null,lead:s=[]}={}){D();const r=t.sections?.find(g=>g.row?.id===a);if(r){hi(e,o,r);return}const d=t.rows.find(g=>g.id===a);if(!d)return;n||Ie(e,a,t.rows);const h=n?{x:0,y:0}:{x:o.clientX,y:o.clientY},m=g=>{const E=[...s,...g.map(T=>n&&T.onPick?{...T,onPick:()=>{Ie(e,a,t.rows),T.onPick()}}:T)];E.length&&(J?.dismiss(),n&&(ze=n,n.closest("[data-sve-ht-row]")?.setAttribute("data-sve-ht-more-open","")),J=Re(e.document,Oe,{items:E,x:h.x,y:h.y,anchor:n,onClose:()=>{J=null,to()}}))};if(d.frameCall){m([{label:v(e,"html_tree_frame_edit",{frame:v(e,`chrome_${d.frameCall}`)}),onPick:()=>{D(),Nt(e,d.frameCall)}}]);return}if(d.kind==="component"){ui(e,d,m);return}if(d.kind==="slot"||d.kind==="sections"||d.kind==="svg"||d.locked||d.lockedIn){m([]);return}if(!t.canEdit){m([]);return}if(d.componentRoot){m([]);return}m([...d.sectionRoot?sn(e,d.sectionRoot):[],{label:v(e,"component_make"),onPick:()=>{D(),_a(e,d,{onDone:()=>P(e),onError:g=>{e.alert(g?.status===409?v(e,"component_exists"):v(e,"component_failed"))}})}}])}const To=(e,o)=>{D(),b("dock:open-template",o)};function ui(e,o,a){if(!va(o.src)){a([{label:v(e,"component_open_named",{name:fa(o.src)||o.src}),onPick:()=>To(e,`view:partials/${o.src}`)}]);return}a([{label:v(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(o.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const s=Array.isArray(n.items)?n.items:[];a(s.length?s.map(r=>({label:v(e,"component_open_named",{name:r.label}),onPick:()=>To(e,r.type)})):[{label:v(e,"component_none"),onPick:null}])}).catch(()=>a([{label:v(e,"component_none"),onPick:null}]))}function vi(e,o,a){if(o.button!==0||b("dock:is-locked")||t.editingId)return;const n=t.rows.find(d=>d.id===a);if(n&&(n.locked||n.lockedIn)||o.target?.closest?.("button, input"))return;Ge(),Te=a,je={x:o.clientX,y:o.clientY},rt=o.currentTarget,it=o.pointerId;const s=d=>fi(e,d),r=d=>mi(e,d);$t=()=>{e.document.removeEventListener("pointermove",s,!0),e.document.removeEventListener("pointerup",r,!0),e.document.removeEventListener("pointercancel",r,!0),$t=null},e.document.addEventListener("pointermove",s,!0),e.document.addEventListener("pointerup",r,!0),e.document.addEventListener("pointercancel",r,!0)}function fi(e,o){if(!Te||!je)return;const a=o.clientX-je.x,n=o.clientY-je.y;if(!t.dragging&&a*a+n*n<25)return;if(!t.dragging){t.dragging=!0;try{rt?.setPointerCapture?.(it)}catch{}}o.preventDefault();const s=e.document.elementFromPoint(o.clientX,o.clientY),r=s?.closest?.("[data-sve-ht-slot]");if(r){const T=r.getAttribute("data-sve-ht-id");if(T&&T!==Te){t.dropId=T,t.dropPlace="inside";return}}const d=s?.closest?.("[data-sve-ht-row]"),h=d?.getAttribute("data-sve-ht-id");if(!h||h===Te){t.dropId=null,t.dropPlace=null;return}const m=t.rows.find(T=>T.id===h),g=t.rows.find(T=>T.id===Te);if(!m||m.lockedIn||g&&m.path.startsWith(`${g.path}/`)){t.dropId=null,t.dropPlace=null;return}const E=d.getBoundingClientRect();t.dropId=h,t.dropPlace=Oa(o.clientY-E.top,E.height,!Ao(m.tag)&&!Do(m)&&!m.locked)}function mi(e,o){const a=Te,n=t.dropId,s=t.dropPlace||"after",r=t.dragging;if(Ge(),r&&(le=!0,e.setTimeout(()=>{le=!1},0)),!r||b("dock:is-locked")||!a||!n||a===n)return;o?.preventDefault?.();const d=X(),h=$a(d,Me,a,n,s);h!==d&&$e(h)}function Ge(){try{rt?.releasePointerCapture?.(it)}catch{}$t?.(),Te=null,je=null,rt=null,it=null,t.dragging=!1,t.dropId=null,t.dropPlace=null}function pi(e,o,a){if(o.button!==0||!a||t.editingId||o.target?.closest?.("button, input"))return;ln(),qe=a,Ke={x:o.clientX,y:o.clientY},lt=o.currentTarget,dt=o.pointerId;const n=r=>gi(e,r),s=r=>ki(e,r);Dt=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",s,!0),e.document.removeEventListener("pointercancel",s,!0),Dt=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",s,!0),e.document.addEventListener("pointercancel",s,!0)}function gi(e,o){if(!qe||!Ke)return;const a=o.clientX-Ke.x,n=o.clientY-Ke.y;if(!t.dragging&&a*a+n*n<25)return;if(!t.dragging){t.dragging=!0;try{lt?.setPointerCapture?.(dt)}catch{}}o.preventDefault();const r=e.document.elementFromPoint(o.clientX,o.clientY)?.closest?.("[data-sve-ht-sec-uid]"),d=r?.getAttribute("data-sve-ht-sec-uid")||"";if(!d||d===qe){t.sectionDrop=null;return}const h=r.getBoundingClientRect();t.sectionDrop={uid:d,place:o.clientY-h.top<h.height/2?"before":"after"}}function ki(e,o){const a=qe,n=t.sectionDrop,s=t.dragging;ln(),s&&(le=!0,e.setTimeout(()=>{le=!1},0)),!(!s||!a||!n?.uid||n.uid===a)&&(o?.preventDefault?.(),yi(e,a,n.uid,n.place))}function ln(){try{lt?.releasePointerCapture?.(dt)}catch{}Dt?.(),qe=null,Ke=null,lt=null,dt=null,t.dragging=!1,t.sectionDrop=null}function yi(e,o,a,n){const s=vt(e)||"page_sections";for(const r of Kt(e.document)||[]){const d=Ut(r.values),h=d&&typeof d=="object"?d[s]:null;if(!Array.isArray(h))continue;const m=M=>h.findIndex(x=>x&&typeof x=="object"&&[x._visual_id,x.id,x._id].includes(M)),g=m(o),E=m(a);if(g===-1||E===-1||g===E)return!1;let T=n==="before"?E:E+1;return g<T&&(T-=1),T===g?!1:(e.postMessage({source:W,type:B.MOVE,uid:o,toIndex:T},e.location.origin),e.setTimeout(()=>P(e),60),!0)}return!1}function Vt(e,o){if(o?.kind==="component"){bi(e,o);return}if(Q.callOpen&&(Q.callOpen=!1,Q.callStore=null,U.forget(),Wt(e)),o?.kind!=="antlers"){t.inspect=null;return}const a=o.id,n={logic:!0,path:o.path};if(o.tag==="else"){t.inspect={key:a,...n,title:v(e,"antlers_condition"),mode:"note",note:v(e,"antlers_else_note")};return}if(o.antlers==="loop"){t.inspect={...Qa(e,o,{key:a,draft:be?.id===o.id?be.dir:""}),...n};return}t.inspect={key:a,...n,title:v(e,"antlers_condition"),mode:"condition",value:o.expr||"",placeholder:v(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:v(e,"antlers_add_elseif")},{id:"else",label:v(e,"antlers_add_else")}]}}function bi(e,o){if(!Pa(e)){t.inspect=null;return}if(!o.src)return;const a=o.id;if(t.inspect={key:a,title:v(e,"component_props_values"),mode:"note",note:v(e,"code_dock_loading")},Ea()){const n={},s={},r=new Map;for(const[d,h]of Ha(X().slice(o.from,o.to))){const m=Ma(d);m&&(d!==m||!r.has(m))&&r.set(m,h)}for(const[d,h]of r)h.bound?s[d]=h.value:n[d]=h.value;t.inspect=null,Q.callOpen=!0,Q.title=Q.title||v(e,"component_props"),Q.callTitle=o.klass||o.name||o.src,Q.callStore=U.ui,U.ui.canBind=!0,U.ui.dataTitle=v(e,"data_vars_title"),U.ui.exprPlaceholder=v(e,"component_props_expr"),U.ui.onBox=(d,h)=>xi(e,d,h),U.ui.onPickData=(d,h)=>b("dock:data-menu",{anchor:h,at:o.from,types:La(U.ui.fields.find(m=>m.handle===d)?.type),onPick:m=>dn(e,d,String(m?.var||"").trim())}),U.load(e,{key:`${o.src}::${a}`,src:o.src,params:n,bindings:s,readOnly:b("dock:is-locked")===!0}),U.watch(e,{src:o.src,write:d=>Ti(e,d,s)}),Wt(e);return}Ia(e,o.src).then(n=>{if(t.inspect?.key===a){if(!n.length){t.inspect={key:a,title:v(e,"component_props_values"),mode:"note",note:v(e,"component_props_values_none")};return}t.inspect={key:a,title:v(e,"component_props_values"),mode:"props",inheritLabel:v(e,"component_props_inherit"),rows:Ra(n,X().slice(o.from,o.to))}}})}function Ti(e,o,a={}){const n=t.rows.find(d=>d.id===I);if(n?.kind!=="component"||b("dock:is-locked"))return;let s=X(),r=n.to;for(const[d,h]of Object.entries(o||{})){if(d in a)continue;const m=s.length,g=Gt(s,{from:n.from,to:r},d,h);g!==s&&(r+=g.length-m,s=g)}s!==X()&&($e(s,{save:!0}),P(e))}function dn(e,o,a){cn(e,o,a,!0),P(e)}function xi(e,o,a){const n=Da(a);if(n){dn(e,o,n);return}U.forget(),cn(e,o,String(a??"").trim(),!1),P(e)}function cn(e,o,a,n){const s=t.rows.find(h=>h.id===I);if(s?.kind!=="component"||b("dock:is-locked"))return;const r=X(),d=Gt(r,s,o,a,{bound:n});d!==r&&$e(d,{save:!0})}function ut(){const e=t.rows.find(o=>o.id===I);return e?.kind==="antlers"&&!b("dock:is-locked")?e:null}function ie(e,o){const a=ut();if(!a)return;const n=X(),s=o(n,a);s!==n&&($e(s),P(e))}function xo(e,o,a,n){const s=t.rows.find(h=>h.id===I);if(s?.kind!=="component"||b("dock:is-locked"))return;const r=X(),d=Gt(r,s,o,a,{bound:n});d!==r&&($e(d,{save:!0}),P(e))}function wi(e,o){ie(e,(a,n)=>n.antlers==="loop"?ns(n,o)(a,n):ja(a,n,o))}function _i(e,o){const a=ut();if(!a||a.antlers!=="loop")return;const n=Za(e,a,o);n&&ie(e,n)}function Si(e,o){ie(e,(a,n)=>Ka(a,n,o))}function Ci(e,o){if(!e||!o||Do(o)||Ao(o.tag))return null;const a=Ca(e,o);if(a<o.openTo)return null;const n=e.lastIndexOf(`
`,a-1)+1;return e.slice(n,a).trim()===""&&n>o.openTo?n-1:a}function Ie(e,o,a,{reveal:n=!0}={}){if(le)return;const s=(a||t.rows).find(r=>r.id===o);s&&(I=o,t.rows.forEach(r=>{r.current=r.id===o}),Vt(e,s),!ct()&&(n&&(b("dock:reveal-html",{from:s.from,to:s.to,caret:Ci(X(),s)}),b("dock:tw-follow")),ke({source:W,type:B.SVE_HTML_PICK_FOCUS,path:s.path,src:s.kind==="component"&&s.src||""},e)))}function Pi(e,o){if(!o)return"";const a=[],n=(s,r)=>{for(const d of s||[]){const h=r||d.path===e;d.kind==="component"&&d.src===o&&a.push({path:d.path,inside:h}),n(d.children,h)}};return n(Me,!1),(a.find(s=>s.inside)||a[0])?.path||""}function Ei(e,o,{reveal:a=!0}={}){if(!o||!z(e.document))return;ge=!1;const n=t.rows.find(r=>r.current);if(n&&n.path===o){Ie(e,n.id,t.rows,{reveal:a});return}P(e),Je(o),P(e);const s=t.rows.find(r=>r.path===o);s&&(Ie(e,s.id,t.rows,{reveal:a}),e.setTimeout(()=>{z(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function jt(e){if(nt)return;const o=()=>{t.editingId||t.dragging||(e.clearTimeout(st),st=e.setTimeout(()=>{z(e.document)&&P(e)},80))},a=()=>{if(o(),b("dock:on-empty-page")===!0){const n=We(e,e.document);n.length===1&&pt(e,e.document,n,n[0].uid,"")}};nt=Ro("dock:html-changed",o),e.document.addEventListener("sve-page-structure",a),Ot=()=>{e.document.removeEventListener("sve-page-structure",a)}}function Hi(e){nt?.(),nt=null,Ot?.(),Ot=null,e?.clearTimeout?.(st),st=0}function oo(e){const o=z(e.document);if(ke({source:W,type:B.SVE_HTML_PICK,on:!1},e),Hi(e),U.forget(),Q.callOpen=!1,Q.callStore=null,Wt(e),Ge(),D(),ba(e),I=null,t.inspect=null,t.editingId=null,t.draft="",t.sections=[],t.pageBuilder=!1,t.layoutFile=!1,Y="",e?.clearTimeout?.(xe),!o){Mt(e);return}o.remove(),qt.headerTab==="html_tree"&&Un(e,null),qn(e),Po(e),Eo(e),Mt(e)}const hn="button[title], button[data-tip], label[title]";function Xi(e,o){o.querySelector("[data-sve-html-tree-list]")||(o.id=et,Ho(e,o,{only:hn}),Ne(o,jo,{title:v(e,"html_tree")}),o.querySelector("[data-sve-close]")?.addEventListener("click",()=>oo(e)))}function Wi(e){jt(e),P(e)}function un(e){const o=e.document;if(!Cn(e,"html_tree"))return;if(z(o)){jt(e),P(e);return}if(!Xo(o))return;ge=!0,q.clear(),Yn(e,[et]);const a=o.createElement("div");a.id=et,Ho(e,a,{only:hn}),a.style.cssText=zn,Ne(a,jo,{title:v(e,"html_tree")}),a.querySelector("[data-sve-close]")?.addEventListener("click",()=>oo(e)),Xn(e,a),Po(e),Eo(e),Mt(e),jt(e),P(e)}function Gi(e){if(z(e.document)){oo(e);return}un(e)}zt("html-tree:open-section",e=>{const o=window,a=o.document,n=We(o,a),s=n.find(r=>r.uid===e||r.ids.includes(e));return s?(pt(o,a,n,s.uid,""),{uid:s.uid,ids:s.ids}):null});zt("html-tree:from-preview",({path:e,src:o,uid:a,reveal:n=!0}={})=>{if(!Bo(window,e)){if(!e){Mi(window,a);return}Ei(window,Pi(e,o)||e,{reveal:n})}});function Mi(e,o){if(!o||!z(e.document))return;const a=We(e,e.document),n=Xe(o,e.document),s=a.find(r=>r.ids.some(d=>n.includes(d)));s&&(ge&&(ge=!1,q.clear(),I=null),Y&&Y!==s.uid&&(e.clearTimeout(xe),Y="",j=""),!b("dock:load-settled")&&P(e))}zt("html-tree:arm-pick",e=>{const o=window;return e?(Jo(o,ft(X(),qo(o))),!0):(z(o.document)||ke({source:W,type:B.SVE_HTML_PICK,on:!1},o),!0)});function Zi(){we.clear(),Ve.clear(),Rt.clear(),ot.clear(),Ye.length=0}export{Ar as HTML_TREE_STYLE_ID,zi as armHtmlTreePrefetch,Zi as clearHtmlTreeTemplates,D as closeHtmlTreeMenu,oo as closeHtmlTreePanel,jr as ensureHtmlTreeStyles,Xi as fillHtmlTreePane,I as htmlTreeActiveId,z as htmlTreePanel,st as htmlTreeTimer,nt as htmlTreeUnhook,un as openHtmlTreePanel,P as renderHtmlTree,Wi as showHtmlTreePane,Hi as stopWatchHtmlTreeDock,Gi as toggleHtmlTreePanel,jt as watchHtmlTreeDock};
