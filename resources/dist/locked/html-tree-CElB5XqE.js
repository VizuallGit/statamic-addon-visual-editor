import{q as v,f as Sn,o as m,c as k,a as O,t as R,u as i,e as Cn,l as Mt,F as A,j as oe,g as _,w,Y as Ae,N as q,aa as Pn,a2 as Hn,ag as Ee,k as Lt,ae as En,X as se,aE as Mn,v as fo,x as Ln,W as In,aF as Rn,ac as ot,aG as On,D as mt,m as zt,p as Yt,V as je,a8 as $n,aH as Fn,aI as An}from"./addon-DMiGp-RA.js";import{c as Io,a as Dn,o as Bn,b as Nn,d as Vn,i as Ro,r as jn,e as Kn,f as Un,u as mo,l as po}from"./section-create-B_kMnTPU.js";import{canEditFields as Oo,openGlobalFieldsOverlay as qn,openFieldsetOverlay as $o}from"./section-fields-BOr45Juh.js";import{U as t,V as zn,W as ee,X as Yn,b as y,Y as Xn,Z as Wn,_ as Gn,$ as Xt,s as Wt,y as ke,j as It,H as Zn,i as Qn,E as Fo,F as Ao,a0 as go,a1 as Do,m as De,D as Jn,R as ea,G as ta,a2 as Ye,a3 as oa,a4 as ko,a5 as na,a6 as aa,a7 as Bo,a8 as No,a9 as Vo,aa as sa,ab as ra,o as jo,ac as Gt,ad as ia,ae as Ko,l as pt,af as Xe,ag as la,ah as Zt,ai as da,aj as ca,ak as ha,x as ua,al as va,am as fa,an as ma,ao as Uo,ap as qo,aq as pa,ar as ga,as as zo,at as ka,au as ya,av as ba,A as Ta,aw as Qt}from"./lp-cluster-IjjwZ_9W.js";import{H as nt,u as xa,d as wa}from"./shortcuts-BIxtNjMb.js";import{_ as Jt,o as Ie}from"./ChoiceDialog-BXOWANoq.js";import{M as V,S as Q}from"./protocol-CfmvxZS7.js";import{C as _a,H as Re,s as eo,c as Sa,a as Ca,b as Yo,t as Pa,d as _e,h as Xo,e as Ha,o as Wo,f as We,r as Go,g as Ea,w as to,i as Ma,j as La,k as Ia,p as Ra,l as Oa,m as $a,n as Fa,q as Aa,v as Da,u as Ba,x as Na,y as Va,z as yo,A as ja,B as Ka,D as Ua,E as qa,F as za,G as Ya,I as bo,J as Xa,K as Wa}from"./component-extract-COU1H0yd.js";import{H as Ga,r as Zo,o as Za,h as To,w as Qa}from"./logic-popup-eOiubeFu.js";import{T as Ja}from"./template-elements-Dmb8YFil.js";import{b as es}from"./html-pick-align-BDjVGiSh.js";import{l as ts,a as os,b as ns,c as as,d as ss,e as rs,f as is,g as ls,h as ds}from"./loop-inspector-DgmeD4-R.js";import"./FieldsetOverlay-B0d7V5ke.js";import"./anim-still-4pEwKCsB.js";import"./help-styles-CE8pOm8q.js";const Tt=/\s*([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/y,cs=/^\s*(?:([A-Za-z_$][\w$]*)|'([^'\\]*)'|"([^"\\]*)")\s*:\s*(true|false)\s*$/;function hs(e){const o=String(e||"").replace(/\{\{[\s\S]*?\}\}/g,s=>" ".repeat(s.length)),a=o.match(/^<[a-zA-Z][\w:-]*/);if(!a)return null;let n=a[0].length;for(;n<o.length;){Tt.lastIndex=n;const s=Tt.exec(o);if(!s){n+=1;continue}if(s[1].toLowerCase()==="x-data")return s[2]??s[3]??s[4]??"";n=Tt.lastIndex}return null}function us(e,o){const a=e[o];for(let n=o+1;n<e.length;n+=1)if(e[n]==="\\")n+=1;else if(e[n]===a)return n;return e.length-1}function vs(e){const o=String(e||""),a=o.search(/\S/);if(a===-1||o[a]!=="{")return[];const n=new Map;let s=0,d="";const r=()=>{const h=d.match(cs);h&&n.set(h[1]??h[2]??h[3],h[4]==="true"),d=""};for(let h=a;h<o.length;h+=1){const f=o[h];if(f==='"'||f==="'"||f==="`"){const g=us(o,h);d+=o.slice(h,g+1),h=g;continue}if(f==="/"&&o[h+1]==="/"){const g=o.indexOf(`
`,h);h=g===-1?o.length:g-1;continue}if(f==="/"&&o[h+1]==="*"){const g=o.indexOf("*/",h+2);h=g===-1?o.length:g+1;continue}if(f==="{"||f==="["||f==="("){if(s+=1,s===1)continue}else if(f==="}"||f==="]"||f===")"){if(s-=1,s===0)break}else if(f===","&&s===1){r();continue}d+=f}return r(),[...n].map(([h,f])=>({key:h,value:f}))}const fs={class:"sve-html-tree"},ms={class:"sve-pane-bar","data-sve-pane-bar":""},ps={"data-sve-right-title":""},gs={"data-sve-right-actions":""},ks=["aria-pressed","title","aria-label"],ys=["title"],bs={class:"sve-ht-used-by__label"},Ts={class:"sve-ht-used-by__chips"},xs=["title","onClick"],ws={key:1,class:"sve-ht-used-by__chip"},_s={key:0,class:"sve-ht-used-by__empty"},Ss={class:"sve-ht-tools"},Cs=["title"],Ps=["placeholder","aria-label","value"],Hs=["aria-label"],Es=["title","aria-label"],Ms=["title","aria-label"],Ls={key:3,class:"sve-tree-exit"},Is=["title"],Rs=["title"],Os='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',$s='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',Fs='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',As='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',Ds='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/></svg>',Bs='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',Ns={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const o=v(window,"html_tree_search");t.layers=zn(window);const a=v(window,"html_tree_layers_on"),n=v(window,"html_tree_layers_off");function s(){Yn(window,!t.layers)}const d=Io(window),r=v(window,"section_new"),h=v(window,"html_tree_add_element"),f=v(window,"html_tree_sections_slot"),g=v(window,"html_tree_sections_no_field");function P(){const E=t.templateSections.length?t.templateSections:[Pn(window)],u=new Set(t.rows.filter(l=>l.kind==="sections").map(l=>l.tag));return E.filter(l=>!u.has(l)).map(l=>({tag:`sections:${l}`,label:E.length>1?`${f} · ${l}`:f,noField:!t.templateSections.length}))}const T=Sn(!1),C=v(window,"section_import");function M(){T.value=!1}async function I(E){if(!E)return;await Hn(),t.onRefresh?.();const u=y("html-tree:open-section",E);u&&jn(window,u.ids)}function L(){const E=t.rows.find(u=>u.current&&!u.context&&!u.synthetic)||null;return E?.lockedIn?t.rows.filter(u=>u.locked&&u.from<=E.from&&u.to>=E.to).sort((u,l)=>u.from-l.from)[0]||null:E}function x(E){const u=E.getBoundingClientRect(),l=L();let p=null;const B=(N,$e,le="")=>()=>{p?.dismiss(),p=null,M();const kt=Ro(window,N,l,$e);kt!==null&&(t.selectFrom={at:kt,left:4},le&&window.Statamic?.$toast?.info?.(le))};p=Ie(document,Re,{items:[...Ja.map(N=>({label:N,onPick:B(N,`<${N}>`)})),...P().map(N=>({label:N.label,onPick:B(N.tag,N.label,N.noField?g:"")}))],x:Math.round(u.left),y:Math.round(u.bottom+4),onClose:()=>{p=null,M()}})}function D(E){if(!T.value){if(T.value=!0,!(t.sections.length||t.pageBuilder)){x(E.currentTarget);return}(async()=>{const u=await Dn(window);if(!u){M();return}const l=t.sections.length?t.sections[t.sections.length-1].uid:null,p=B=>{M(),I(B?.uid)};if(u==="static"){Bn(window,{afterUid:l,onDone:p,onError:M,onClose:M});return}Nn(window,{afterUid:l,onDone:p,onError:M,onClose:M})})()}}function J(){if(T.value)return;T.value=!0;const E=!!(t.sections.length||t.pageBuilder);Vn(window,{intoTemplate:!E,after:E?null:L(),afterUid:E&&t.sections.length?t.sections[t.sections.length-1].uid:null,onDone:u=>{if(M(),E){I(u?.uid);return}Number.isInteger(u?.at)&&(t.selectFrom={at:u.at,left:4})},onError:M,onClose:M})}function K(E){const u=!!t.query;t.query=E,u!==!!E&&t.onQuery?.()}return(E,u)=>(m(),k("div",fs,[O("div",ms,[O("div",ps,R(e.title),1),O("div",gs,[O("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":i(t).layers?"true":"false",title:i(t).layers?i(n):i(a),"aria-label":i(t).layers?i(n):i(a),innerHTML:Os,onClick:s},null,8,ks),u[5]||(u[5]=Cn('<button type="button" data-sve-right-pin aria-pressed="false" data-v-c232a908></button><button type="button" data-sve-close aria-label="Close" data-v-c232a908><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-c232a908><path d="M18 6 6 18" data-v-c232a908></path><path d="m6 6 12 12" data-v-c232a908></path></svg></button>',2))])]),i(t).usedBy?(m(),k("div",{key:0,class:"sve-ht-used-by",title:i(t).usedBy.hint||null},[O("span",bs,[O("span",{class:"sve-ht-used-by__icon","aria-hidden":"true",innerHTML:Ds}),Mt(" "+R(i(t).usedBy.label),1)]),O("span",Ts,[(m(!0),k(A,null,oe(i(t).usedBy.items,l=>(m(),k(A,{key:l.kind+":"+l.name},[l.onOpen?(m(),k("button",{key:0,type:"button",class:"sve-ht-used-by__chip sve-ht-used-by__chip--open",title:l.openLabel,onClick:p=>l.onOpen(p.currentTarget)},R(l.name),9,xs)):(m(),k("span",ws,R(l.name),1))],64))),128)),i(t).usedBy.empty?(m(),k("span",_s,R(i(t).usedBy.empty),1)):_("",!0)])],8,ys)):_("",!0),O("div",Ss,[O("label",{class:"sve-ht-search",title:i(o)},[O("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:As}),O("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:i(o),"aria-label":i(o),value:i(t).query,autocomplete:"off",spellcheck:"false",onInput:u[0]||(u[0]=l=>K(l.target.value)),onKeydown:[u[1]||(u[1]=w(()=>{},["stop"])),u[2]||(u[2]=Ae(w(l=>K(""),["prevent"]),["escape"]))]},null,40,Ps),i(t).query?(m(),k("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":i(o),innerHTML:Bs,onClick:u[3]||(u[3]=l=>K(""))},null,8,Hs)):_("",!0)],8,Cs),i(d)&&(i(t).sections.length||i(t).pageBuilder||i(t).rows.length&&!i(t).layoutFile||i(t).emptyFile)?(m(),k("button",{key:0,type:"button",class:"sve-ht-new",title:i(t).sections.length||i(t).pageBuilder?i(r):i(h),"aria-label":i(t).sections.length||i(t).pageBuilder?i(r):i(h),innerHTML:$s,onClick:D},null,8,Es)):_("",!0),i(d)&&(i(t).sections.length||i(t).pageBuilder||i(t).rows.length&&!i(t).layoutFile||i(t).emptyFile)?(m(),k("button",{key:1,type:"button",class:"sve-ht-import",title:i(C),"aria-label":i(C),innerHTML:Fs,onClick:J},null,8,Ms)):_("",!0)]),i(ee).inSidebar?_("",!0):(m(),q(_a,{key:1})),u[6]||(u[6]=O("div",{"data-sve-html-tree-list":""},null,-1)),i(t).inspect?.logic?_("",!0):(m(),q(Ga,{key:2})),i(t).exitOpen&&!i(ee).inSidebar?(m(),k("div",Ls,[O("span",{class:"sve-tree-exit__name",title:i(t).exitName},R(i(t).exitName),9,Is),O("button",{type:"button",class:"sve-tree-exit__go",title:i(t).exitTitle,onClick:u[4]||(u[4]=l=>i(t).onExit?.())},R(i(t).exitLabel),9,Rs)])):_("",!0)]))}},Qo=Jt(Ns,[["__scopeId","data-v-c232a908"]]);function Jo(e){return String(e||"").trim().toLowerCase()}function Rt(e,o){return o?[e.name,e.tag,e.klass,e.label,e.src].filter(a=>typeof a=="string"&&a).join(" ").toLowerCase().includes(o):!0}function Vs(e,o){const a=Jo(o);if(!a)return{rows:e,hits:new Set};const n=new Set;for(const r of e)Rt(r,a)&&n.add(r.path);const s=[...n];return{rows:e.filter(r=>n.has(r.path)||s.some(h=>h.startsWith(`${r.path}/`))),hits:n}}const js=["title"],Ks={"data-sve-ht-indent":"","aria-hidden":"true"},Us=["data-sve-ht-cat"],qs={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},zs={key:2,"data-sve-ht-letter":""},Ys=["innerHTML"],Xs=["title"],Ws=["title"],Gs={key:1,"data-sve-ht-kind":""},Zs={key:3,"data-sve-ht-name":""},Qs={key:4,"data-sve-ht-actions":""},Js=["data-on","title","innerHTML"],er=["title"],tr={key:5,"data-sve-ht-actions":""},or=["data-on","title","innerHTML"],nr=["data-on","title","innerHTML"],ar=["disabled","title"],sr=["disabled","title","innerHTML"],rr=["disabled","title"],ir=["disabled","title"],lr=["aria-label"],dr=["data-sve-ht-id"],cr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',hr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',ur='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',vr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',fr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',mr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',pr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',xo='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6.5" width="20" height="11" rx="5.5"/><circle cx="7.5" cy="12" r="3" fill="currentColor" stroke="none"/></svg>',wo='<svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M7.5 5.5h9a6.5 6.5 0 0 1 0 13h-9a6.5 6.5 0 0 1 0-13ZM16.5 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6Z"/></svg>',gr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',kr='<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>',yr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',br=120,Tr={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const o=Oo(window);function a(u){return u.synthetic?u.frame==="main"?t.frameMainTitle:u.frame==="template"?t.frameTemplateTitle:t.frameOpenTitle:u.kind==="component"?u.src?`partial:${u.src}`:u.tag:u.name?`${u.tag} ${u.name}`:u.tag}function n(u){return!!u.section}function s(u){return!!u.frame}function d(u){return u.kind==="slot"}function r(u,l){s(l)||d(l)||(n(l)?t.onSectionPointerDown?.(u,l.section):l.sectionRoot?t.onSectionPointerDown?.(u,l.sectionRoot):t.onPointerDown?.(u,l.id))}function h(u,l){if(u.synthetic){t.onFrame?.(u.frame);return}if(n(u)){t.onSection?.(u.section);return}t.onSelect?.(u.id,l)}function f(u,l){const p={"data-sve-ht-id":u.id};return u.locked&&(p["data-sve-ht-locked"]=""),u.current&&(p["data-sve-ht-current"]=""),(u.hidden||u.sectionOff)&&(p["data-sve-ht-hidden"]=""),(u.videoNth>=0||u.alpineNth>=0)&&(p["data-sve-ht-special"]=""),p["data-sve-ht-cat"]=u.cat||"other",p["data-sve-ht-depth"]=String(u.depth),l&&(p["data-sve-ht-dim"]=""),n(u)&&(p["data-sve-ht-sec"]=""),s(u)&&(p["data-sve-ht-frame"]=u.frame),!n(u)&&t.dropId===u.id&&t.dropPlace&&(p["data-sve-ht-drop"]=t.dropPlace),p}function g(u){return!!u.fixed}function P(u){return u.kind==="sections"}function T(u){return!!(u.locked||u.lockedIn)}function C(u){return!u.lockedIn&&!g(u)}function M(u){return J(u)||!g(u)&&!P(u)&&!T(u)&&(!u.hidden||u.wrapFrom!=null)}function I(u){if(!K(u))return t.lockedTitle;const l=u.hidden||u.sectionOff;return J(u)?l?t.sectionShowTitle:t.sectionHideTitle:l?t.showTitle:t.hideTitle}let L=null;function x(u,l){window.clearTimeout(L),L=window.setTimeout(()=>t.onMore?.(u,l.id),br)}function D(){window.clearTimeout(L)}function J(u){return!!u.sectionRoot||!!u.section}function K(u){return t.canEdit&&!T(u)||J(u)}function E(u){const l=u.name||"";return Xt()&&l.toLowerCase()===String(u.tag||"").toLowerCase()?"":l}return(u,l)=>(m(),k(A,null,[O("div",Ee({"data-sve-ht-row":""},f(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:l[43]||(l[43]=p=>h(e.row,p.currentTarget)),onDblclick:l[44]||(l[44]=w(p=>e.row.synthetic?i(t).onFrameEnter?.(e.row.frame):s(e.row)||d(e.row)||n(e.row)?null:i(t).onRename?.(e.row.id),["prevent"])),onKeydown:[l[45]||(l[45]=Ae(w(p=>h(e.row,p.currentTarget),["prevent"]),["enter"])),l[46]||(l[46]=Ae(w(p=>h(e.row,p.currentTarget),["prevent"]),["space"]))],onPointerdown:l[47]||(l[47]=p=>r(p,e.row)),onPointerenter:l[48]||(l[48]=p=>n(e.row)?i(t).onSectionHover?.(e.row.section):null),onContextmenu:l[49]||(l[49]=w(p=>s(e.row)||d(e.row)||n(e.row)?null:i(t).onContext?.(p,e.row.id),["prevent","stop"]))}),[O("span",Ks,[(m(!0),k(A,null,oe(e.row.guides||[],(p,B)=>(m(),k("i",{key:B,"data-sve-ht-cat":p},null,8,Us))),128))]),e.row.hasChildren||i(Xn)(e.row)?(m(),k("button",Ee({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?i(t).mainShut:i(Wn)(e.row))?{"data-sve-ht-shut":""}:{},{innerHTML:hr,onClick:l[0]||(l[0]=w(p=>e.row.synthetic?i(t).onFrameTwist?.():n(e.row)?i(t).onSection?.(e.row.section):i(t).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:l[1]||(l[1]=w(()=>{},["stop"])),onDblclick:l[2]||(l[2]=w(()=>{},["stop"]))}),null,16)):(m(),k("span",qs)),e.row.letter?(m(),k("span",zs,R(e.row.letter),1)):(m(),k("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Ys)),O("span",{"data-sve-ht-text":"",title:i(t).renameTitle},[!e.row.kind&&!n(e.row)&&!s(e.row)?(m(),k("button",{key:0,type:"button","data-sve-ht-tag":"",title:i(t).tagTitle,onClick:l[3]||(l[3]=w(()=>{},["stop","prevent"])),onPointerdown:l[4]||(l[4]=w(()=>{},["stop"])),onDblclick:l[5]||(l[5]=w(p=>i(t).onTagChange?.(p,e.row.id),["stop","prevent"]))},R(e.row.tag),41,Ws)):(m(),k("span",Gs,R(e.row.tag),1)),i(t).editingId===e.row.id&&!n(e.row)?Lt((m(),k("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":l[6]||(l[6]=p=>i(t).draft=p),onMousedown:l[7]||(l[7]=w(()=>{},["stop"])),onPointerdown:l[8]||(l[8]=w(()=>{},["stop"])),onClick:l[9]||(l[9]=w(()=>{},["stop"])),onDblclick:l[10]||(l[10]=w(()=>{},["stop"])),onKeydown:[l[11]||(l[11]=w(()=>{},["stop"])),l[12]||(l[12]=Ae(w(p=>i(t).onRenameCommit?.(),["prevent"]),["enter"])),l[13]||(l[13]=Ae(w(p=>i(t).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:l[14]||(l[14]=p=>i(t).onRenameCommit?.())},null,544)),[[En,i(t).draft]]):(m(),k("span",Zs,R(E(e.row)),1))],8,Xs),s(e.row)?(m(),k("span",Qs,[e.row.alpineNth>=0?(m(),k("button",{key:0,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:i(t).alpineTitle,innerHTML:e.row.alpineSet?wo:xo,onClick:l[15]||(l[15]=w(p=>i(t).onAlpineState?.(p,e.row.id),["stop","prevent"])),onPointerdown:l[16]||(l[16]=w(()=>{},["stop"])),onDblclick:l[17]||(l[17]=w(()=>{},["stop"]))},null,40,Js)):_("",!0),e.row.frame!=="main"&&i(o)?(m(),k("button",{key:1,type:"button","data-sve-ht-fields":"",title:i(t).frameFieldsTitle,innerHTML:cr,onClick:l[18]||(l[18]=w(p=>i(t).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:l[19]||(l[19]=w(()=>{},["stop"])),onDblclick:l[20]||(l[20]=w(()=>{},["stop"]))},null,40,er)):_("",!0)])):d(e.row)?_("",!0):(m(),k("span",tr,[e.row.videoNth>=0?(m(),k("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?i(t).videoPlayTitle:i(t).videoHoldTitle,innerHTML:e.row.videoHeld?pr:mr,onClick:l[21]||(l[21]=w(p=>i(t).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:l[22]||(l[22]=w(()=>{},["stop"])),onDblclick:l[23]||(l[23]=w(()=>{},["stop"]))},null,40,or)):_("",!0),e.row.alpineNth>=0?(m(),k("button",{key:1,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:i(t).alpineTitle,innerHTML:e.row.alpineSet?wo:xo,onClick:l[24]||(l[24]=w(p=>i(t).onAlpineState?.(p,e.row.id),["stop","prevent"])),onPointerdown:l[25]||(l[25]=w(()=>{},["stop"])),onDblclick:l[26]||(l[26]=w(()=>{},["stop"]))},null,40,nr)):_("",!0),e.row.locked?(m(),k("button",{key:2,type:"button","data-sve-ht-lock":"","data-on":"",disabled:!i(t).canEdit||!i(t).canUnlock,title:i(t).canUnlock?i(t).unlockTitle:i(t).lockedByTitle,"aria-pressed":"true",innerHTML:gr,onClick:l[27]||(l[27]=w(p=>i(t).onLock?.(e.row.id),["stop","prevent"])),onPointerdown:l[28]||(l[28]=w(()=>{},["stop"])),onDblclick:l[29]||(l[29]=w(()=>{},["stop"]))},null,40,ar)):_("",!0),M(e.row)?(m(),k("button",{key:3,type:"button","data-sve-ht-eye":"",disabled:!K(e.row),title:I(e.row),innerHTML:e.row.hidden||e.row.sectionOff?vr:ur,onClick:l[30]||(l[30]=w(p=>i(t).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:l[31]||(l[31]=w(()=>{},["stop"])),onDblclick:l[32]||(l[32]=w(()=>{},["stop"]))},null,40,sr)):_("",!0),!g(e.row)&&!P(e.row)?(m(),k("button",{key:4,type:"button","data-sve-ht-dup":"",disabled:!K(e.row),title:K(e.row)?i(t).duplicateTitle:i(t).lockedTitle,innerHTML:fr,onClick:l[33]||(l[33]=w(p=>i(t).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:l[34]||(l[34]=w(()=>{},["stop"])),onDblclick:l[35]||(l[35]=w(()=>{},["stop"]))},null,40,rr)):_("",!0),g(e.row)?_("",!0):(m(),k("button",{key:5,type:"button","data-sve-ht-del":"",disabled:!K(e.row),title:K(e.row)?i(t).deleteTitle:i(t).lockedTitle,innerHTML:yr,onClick:l[36]||(l[36]=w(p=>i(t).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:l[37]||(l[37]=w(()=>{},["stop"])),onDblclick:l[38]||(l[38]=w(()=>{},["stop"]))},null,40,ir)),C(e.row)?(m(),k("button",{key:6,type:"button","data-sve-ht-more":"","aria-label":i(t).moreTitle,"aria-haspopup":"menu",innerHTML:kr,onPointerenter:l[39]||(l[39]=p=>x(p.currentTarget,e.row)),onPointerleave:D,onClick:l[40]||(l[40]=w(p=>{D(),i(t).onMore?.(p.currentTarget,e.row.id)},["stop","prevent"])),onPointerdown:l[41]||(l[41]=w(()=>{},["stop"])),onDblclick:l[42]||(l[42]=w(()=>{},["stop"]))},null,40,lr)):_("",!0)]))],16,js),i(Gn)(e.row)?(m(),k("div",Ee({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},i(t).dropId===e.row.id&&i(t).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),R(i(t).slotText),17,dr)):_("",!0)],64))}},G=Jt(Tr,[["__scopeId","data-v-cafb8411"]]),xr=["data-sve-ht-look","data-sve-ht-layers"],wr={key:0,class:"sve-ht-page-template"},_r={key:0,class:"sve-ht-page-template__text"},Sr={class:"sve-ht-page-template__note"},Cr={key:1,class:"sve-ht-empty"},Pr={key:2,class:"sve-ht-empty"},Hr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},Er={key:0,class:"sve-ht-empty"},Mr={key:0,class:"sve-ht-empty"},Lr=["data-sve-ht-under-main"],Ir={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},Rr={key:0,class:"sve-ht-empty"},Or=["data-sve-ht-under-main"],$r=["data-dim"],Fr={key:0,class:"sve-ht-empty"},Ar={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},Dr={key:0,class:"sve-ht-empty"},Br={key:4,"data-sve-ht-branch":"","data-sve-ht-cat":"component"},Nr=["data-sve-ht-field"],Vr=["onClick"],jr={__name:"HtmlTreeList",setup(e){const o=se(()=>Jo(t.query)),a=se(()=>Vs(t.rows,o.value)),n=se(()=>a.value.rows),s=se(()=>o.value?[]:t.sectionsMissing||[]),d=se(()=>o.value?t.sections.filter(I=>Rt(I.row,o.value)||I.current&&I.ready&&n.value.length>0):t.sections);function r(I){return!!I&&(!o.value||Rt(I,o.value))}function h(I){const L=t.frame?.kind;return t.inComponent||(L==="header"||L==="footer")&&L!==I}const f=se(()=>t.frame?.kind==="header"||t.frame?.kind==="footer"),g=se(()=>!!t.frame&&["header","main","footer"].some(I=>r(t.frame[I]))),P=se(()=>!!t.frame&&(t.frame.kind==="main"||r(t.frame.main))),T=se(()=>!!o.value&&!d.value.length&&!n.value.length&&!g.value);function C(I){return!!o.value&&!a.value.hits.has(I.path)}function M(I){const L={"data-sve-ht-sec-uid":I.uid};return I.current&&(L["data-sve-ht-branch"]="",L["data-sve-ht-cat"]=I.row?.cat||"layout"),t.sectionDrop&&t.sectionDrop.uid===I.uid&&(L["data-sve-ht-drop"]=t.sectionDrop.place),L}return(I,L)=>(m(),k("div",Ee({class:"sve-ht-root","data-sve-ht-look":i(t).layers?"tags":i(t).look,"data-sve-ht-layers":i(t).layers?"":null,style:i(t).familyStyle},i(t).dragging?{"data-sve-ht-dragging":""}:{}),[i(t).pageTemplate?(m(),k("div",wr,[i(t).pageTemplate.text?(m(),k("p",_r,R(i(t).pageTemplate.text),1)):_("",!0),O("p",Sr,R(i(t).pageTemplate.note),1),i(t).pageTemplate.canOpen?(m(),k("button",{key:1,type:"button",class:"sve-ht-page-template__open",onClick:L[0]||(L[0]=x=>i(t).pageTemplate.onOpen(x.currentTarget))},R(i(t).pageTemplate.openLabel),1)):_("",!0)])):!i(t).rows.length&&!i(t).sections.length&&!i(t).frame?(m(),k("div",Cr,R(i(t).emptyText),1)):T.value?(m(),k("div",Pr,R(i(t).searchEmpty),1)):_("",!0),i(t).frame||i(t).sections.length?(m(),k(A,{key:3},[i(t).ownFile&&!o.value?(m(),q(G,{key:0,row:i(t).ownFile},null,8,["row"])):_("",!0),i(t).frame?(m(),k(A,{key:1},[i(t).frame.kind==="header"?(m(),k("div",Hr,[(m(!0),k(A,null,oe(n.value,x=>(m(),q(G,{key:x.id,row:x,dim:C(x)},null,8,["row","dim"]))),128)),i(t).rows.length?_("",!0):(m(),k("div",Er,R(i(t).emptyText),1))])):!f.value&&r(i(t).frame.header)?(m(),q(G,{key:1,row:i(t).frame.header,dim:h("header")},null,8,["row","dim"])):_("",!0)],64)):_("",!0),f.value?_("",!0):(m(),k("div",Mn(Ee({key:2},i(t).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[i(t).frame?.kind==="main"?(m(),k(A,{key:0},[(m(!0),k(A,null,oe(n.value,x=>(m(),q(G,{key:x.id,row:x,dim:C(x)},null,8,["row","dim"]))),128)),i(t).rows.length?_("",!0):(m(),k("div",Mr,R(i(t).emptyText),1))],64)):i(t).frame&&r(i(t).frame.main)?(m(),q(G,{key:1,row:i(t).frame.main,dim:h("main")},null,8,["row","dim"])):_("",!0),i(t).frame?.kind==="template"?Lt((m(),k("div",{key:2,"data-sve-ht-frame-body":"","data-sve-ht-under-main":P.value?"":null},[O("div",Ir,[(m(!0),k(A,null,oe(n.value,x=>(m(),q(G,{key:x.id,row:x,dim:C(x)},null,8,["row","dim"]))),128)),i(t).rows.length?_("",!0):(m(),k("div",Rr,R(i(t).emptyText),1))])],8,Lr)),[[fo,!i(t).mainShut]]):_("",!0),i(t).sections.length||i(t).frame?Lt((m(),k("div",{key:3,"data-sve-ht-frame-body":"","data-sve-ht-under-main":P.value?"":null},[i(t).frame?.template&&r(i(t).frame.template)?(m(),q(G,{key:0,row:i(t).frame.template,dim:h("template")},null,8,["row","dim"])):_("",!0),i(t).frame&&!i(t).frame.template&&!i(t).sections.length&&!o.value?(m(),k("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":h("")?"":void 0},R(i(t).frameEmptyText),9,$r)):_("",!0),(m(!0),k(A,null,oe(d.value,x=>(m(),k("div",Ee({key:x.uid},{ref_for:!0},M(x)),[x.ready?(m(),k(A,{key:0},[(m(!0),k(A,null,oe(n.value,D=>(m(),q(G,{key:D.id,row:D,dim:C(D)},null,8,["row","dim"]))),128)),i(t).rows.length?_("",!0):(m(),k("div",Fr,R(i(t).emptyText),1))],64)):(m(),q(G,{key:1,row:x.row,dim:h("")},null,8,["row","dim"]))],16))),128))],8,Or)),[[fo,!i(t).frame||!i(t).mainShut]]):_("",!0)],16)),i(t).frame?(m(),k(A,{key:3},[i(t).frame.kind==="footer"?(m(),k("div",Ar,[(m(!0),k(A,null,oe(n.value,x=>(m(),q(G,{key:x.id,row:x,dim:C(x)},null,8,["row","dim"]))),128)),i(t).rows.length?_("",!0):(m(),k("div",Dr,R(i(t).emptyText),1))])):!f.value&&r(i(t).frame.footer)?(m(),q(G,{key:1,row:i(t).frame.footer,dim:h("footer")},null,8,["row","dim"])):_("",!0)],64)):_("",!0)],64)):i(t).inComponent&&i(t).rows.length?(m(),k("div",Br,[(m(!0),k(A,null,oe(n.value,x=>(m(),q(G,{key:x.id,row:x,dim:C(x)},null,8,["row","dim"]))),128))])):i(t).rows.length?(m(!0),k(A,{key:5},oe(n.value,x=>(m(),q(G,{key:x.id,row:x,dim:C(x)},null,8,["row","dim"]))),128)):_("",!0),(m(!0),k(A,null,oe(s.value,x=>(m(),k("div",{key:x,"data-sve-ht-sections-missing":"","data-sve-ht-field":x},[O("span",null,[Mt(R(i(t).sectionsMissingText),1),i(t).sectionsMissing.length>1?(m(),k(A,{key:0},[L[1]||(L[1]=Mt(" · ",-1)),O("code",null,R(x),1)],64)):_("",!0)]),O("button",{type:"button","data-sve-ht-sections-add":"",onClick:D=>i(t).onAddSections?.(x)},R(i(t).sectionsAddText),9,Vr)],8,Nr))),128))],16,xr))}},xt=Jt(jr,[["__scopeId","data-v-065c6b37"]]);let wt=null;function Kr(e){return wt||(wt=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(o=>o.ok?o.json():{pages:[]}).then(o=>Array.isArray(o.pages)?o.pages:[]).catch(()=>[])),wt}let at=null;function _t(){at?.dismiss(),at=null}function Ur(e,o,a){_t();const n=o?.getBoundingClientRect?.(),s={x:n?n.left:0,y:n?n.bottom+4:0};Kr(e).then(d=>{const r=d.length?d.map(h=>({label:h.title||h.url,onPick:()=>{_t(),a(h.url)}})):[{label:v(e,"component_props_pages_none"),onPick:null}];_t(),at=Ie(e.document,Re,{items:r,x:s.x,y:s.y,onClose:()=>{at=null}})})}function en(e){for(const o of e||[]){if(o.kind==="component"||o.kind==="svg"&&o.dynamic)continue;const a=o.kind==="antlers"?en(o.children):o;if(a)return a}return null}const Y=Ha("sve-call-values"),qr="__sve-html-tree-style";function zr(e,o,a){if(o||a)return!1;const n=String(y("dock:chrome-kind")||"");if(n==="header"||n==="footer")return!1;const s=ot(e);return We(e)?!1:!!s&&s!=="create"&&$n(e)!==Fn(e)}function oo(e){return{sectionLoops:[...new Set([...On(e),...Wo(e),...t.templateSections])],sectionsLabel:v(e,"html_tree_sections_slot")}}const _o=new Set;function Yr(e){const o=ot(e);!o||o==="create"||_o.has(o)||We(e)||(_o.add(o),Gt(e,{entry:o}).then(a=>{!a?.own_page||!a.view||ot(e)!==o||(Go(o,a.view,a.sections_fields),y("dock:current-type")||y("dock:open-file",`view:${a.view}`),H(e))}))}function Xr(e,o){const a={entry:o,text:"",note:v(e,"html_tree_page_template_note"),openLabel:v(e,"html_tree_open_template"),canOpen:!1,onOpen:null};return Gt(e,{entry:o}).then(n=>{if(!(!n||t.pageTemplate?.entry!==o)){if(n.own_page&&n.view){Go(o,n.view,n.sections_fields),y("dock:open-file",`view:${n.view}`),H(e);return}t.pageTemplate={...t.pageTemplate,text:v(e,"html_tree_page_template",{name:n.name}),canOpen:!!n.open,onOpen:n.open?s=>la(e,s,n.open):null}}}),a}function Wr(e,o){const a=We(e);if(a&&y("dock:current-type")===a){t.usedBy=null,t.templateSections=Wo(e);return}const n=o.replace(/^view:/,"");if(!n||y("dock:current-type")!==o){t.usedBy=null,t.templateSections=[];return}t.usedBy?.view!==n&&(t.usedBy=null,Gt(e,{view:n}).then(s=>{if(!s||y("dock:current-type")!==o)return;const d=s.everything?[{name:v(e,"html_tree_used_by_everything"),kind:"everything",url:null}]:s.used_by.map(f=>({...f,...Zr(e,f)})),r=Array.isArray(s.sections_fields)?s.sections_fields:[],h=r.join()!==t.templateSections.join();t.templateSections=r,t.usedBy={view:n,label:v(e,"html_tree_used_by"),items:d,empty:d.length?"":v(e,"html_tree_used_by_nobody"),hint:d.length?v(e,"html_tree_used_by_hint",{list:d.map(f=>f.name).join(", ")}):""},h&&H(e)}))}function Gr(e){const o=new Set,a=n=>{for(const s of n||[])s.kind==="sections"&&o.add(s.tag),a(s.children)};return a(e),t.templateSections.filter(n=>!o.has(n))}function Zr(e,o){if(!o.url)return{openLabel:"",onOpen:null};const a=v(e,"html_tree_used_by_open",{name:o.name});return o.kind==="page"?{openLabel:a,onOpen:n=>va(e,n,fa(e,o.url))}:{openLabel:a,onOpen:n=>ma(e,{anchor:n,url:o.url,subtitle:o.name})}}const F=new Set;let Ot="",He=!1,St=null,ge=!0,X="",Se=0,tn="";const Ce=new Map,Be=new Set,$t=new Map,st=new Map;let z="",on=!1,$=null,rt=null,et="",Ke="",it=0,Ft=null,pe=[],we=null,Ne=null,lt=null,dt=null,At=null,ie=!1,te=null,Ue=null,Ve=null,ct=null,ht=null,Dt=null,Te=null;function W(e){return e.getElementById(nt)}function Qr(e){Ln(e,qr,`
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
      ${go("light")}
      /* How much of a row's own colour its pick takes: a wash, not a fill.
         The row mixes it in below — a mix written up here would read
         --sve-ht-c on the list, where no family is set. */
      --sve-ht-pick-mix: 11%;
      --sve-ht-pick-hover-mix: 18%;
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${go("dark")}
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
  `)}function Z(){const e=y("dock:html");return typeof e=="string"?e:""}function Bt(e){return!!y("dock:is-open",e)}function Oe(e,{save:o=!1,unlock:a=!1}={}){return ut()||y("dock:set-html",a?{html:e,unlock:!0}:e)!==!0?!1:(o&&y("dock:save-now"),!0)}function Ct(e){const o=y("dock:component-exit-state")||{};if(t.exitOpen=!!o.open,!o.open){t.onExit=null;return}t.exitName=o.name||"",t.exitLabel=v(e,"component_exit"),t.exitTitle=v(e,o.back?"component_exit_back":"component_exit_close"),t.onExit=()=>{y("dock:exit-component"),H(e)}}const qe=[];let Pt=!1;function Ht(e,o){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(o,{timeout:2e3});return}e.setTimeout(o,200)}function Jr(e,o){for(const a of o){const n=a.type;!n||Ce.has(n)||Be.has(n)||qe.includes(n)||qe.push(n)}Wt.htmlTreePrefetchArmed&&nn(e)}function al(e){Wt.htmlTreePrefetchArmed=!0,nn(e)}function nn(e){if(Pt||!qe.length)return;Pt=!0;const o=()=>{const a=qe.shift();if(!a){Pt=!1;return}if(Ce.has(a)||Be.has(a)){Ht(e,o);return}Be.add(a),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(a)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{if(typeof n?.html=="string"){Ce.set(a,n.html);const s=st.get(a);st.delete(a),s&&s!==an(e,a)&&H(e)}}).catch(()=>{}).finally(()=>{Be.delete(a),Ht(e,o)})};Ht(e,o)}function ut(){return!!z}function an(e,o){return sn(o)||An(e,o)||"section"}function sn(e){const o=Ce.get(e);if(!o)return"";const a=$t.get(e);if(a&&a.html===o)return a.tag;const n=no(Ye(o))?.tag||"";return $t.set(e,{html:o,tag:n}),n}function Ge(e,o){const a=mt(e)||"page_sections",n=[];for(const s of zt(o)||[]){if(s.name===ia||s.name===xa)continue;const d=Yt(s.values),r=d&&typeof d=="object"?d[a]:null;if(Array.isArray(r)){r.forEach(h=>{if(!h||typeof h!="object"||Array.isArray(h)||typeof h.type!="string")return;const f=[h._visual_id,h.id,h._id].filter(M=>typeof M=="string"&&M!=="");if(!f.length)return;const g=Ko(e,h),P=typeof h._sve_label=="string"?h._sve_label.trim():"",T=an(e,g);sn(g)||st.set(g,T);const C=Zo(g)[`0:${T}`];n.push({uid:f[0],ids:f,type:g,tag:T,label:P||(typeof C=="string"&&C.trim()?C.trim():"")||pt(e,g)?.display||je(g)||g,svg:Xo(T,So(T),null).svg||_e.section,cat:Vo(T,So(T)),enabled:h.enabled!==!1,static:Kn(e,g)})});break}}return n}function ei(e,o,a){if(!a.length)return"";const n=y("dock:current-type")||"",s=y("dock:current-uid"),d=!!y("dock:component-exit-state")?.open;if(s){const r=Xe(s,o),h=a.find(f=>f.ids.some(g=>r.includes(g)));if(h&&(d||h.type===n))return h.uid}return a.find(r=>r.type===n)?.uid||""}function ti(e,o,a){const n=y("dock:component-exit-state");if(n?.open)return je(n.name)||n.name||"";if(a)return o.find(d=>d.uid===a)?.label||"";const s=y("dock:current-type")||"";return String(s).startsWith("view:")?"":pt(e,s)?.display||je(s)||""}function gt(e,o,a,n,s){const d=a.find(r=>r.uid===n);d&&n!==s&&(F.clear(),$=null,ge=!1,j(),Ze(),y("build:reveal",{ids:d.ids}),X=n,tn=Z(),z=Ce.get(d.type)||"",z&&($=Vt(Ye(z))||null),on=(y("dock:current-type")||"")===d.type,e.clearTimeout(Se),Se=e.setTimeout(()=>{X="",He=!1,H(e)},4e3),H(e),ua(e,d.uid,"tree"),ke({source:Q,type:V.SVE_ACTIVATE,ids:d.ids},e),e.setTimeout(()=>H(e),0))}function Nt(e,o){if(!o)return!1;for(const a of e||[])if(a.id===o||Nt(a.children,o))return!0;return!1}function Vt(e){return no(e)?.id||""}function no(e){for(const o of e||[]){if(rn(o))return o;const a=no(o.children);if(a)return a}return null}function rn(e){return!e.kind||e.kind==="component"}function So(e){return e==="component"?"component":""}function oi(e,o){const a=o===0||e.path===Ke;return F.has(e.path)?a:!a}function ni(e){const o=new Set,a=Xt(),n=(s,d)=>{for(const r of s)(r.children.length?oi(r,d):a&&(r.kind==="antlers"||r.hollow)&&F.has(r.path))&&o.add(r.id),n(r.children,d+1)};return n(e,0),o}function H(e){const o=e.document,n=W(o)?.querySelector("[data-sve-html-tree-list]");if(!n)return;Qr(o),Ca(e);const s=Z();z&&z===s&&(z=""),y("dock:chrome-kind")&&(z="");const d=z||s,r=Ye(d,oo(e));pe=r,Ke="";const h=y("dock:current-type")||"",f=Zo(h),g=Rn(e,o);g&&Yr(e);const T=!!(y("dock:component-exit-state")||{}).open;h&&s&&!z&&Ce.set(h,s);const C=Ge(e,o);Jr(e,C);const M=ei(e,o,C);if(zr(e,g,T)){const c=ot(e);pe=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!1,t.layoutFile=!1,t.emptyFile=!1,t.sectionsMissing=[],t.ownFile=null,t.usedBy=null,t.emptyText="",t.pageTemplate?.entry!==c&&(t.pageTemplate=Xr(e,c)),t.onRefresh=()=>H(e),t.onSection=null,Ct(e),De(n,xt),Et(e,[]);return}t.pageTemplate=null,Wr(e,String(y("dock:collection-view")||""));const I=String(y("dock:chrome-kind")||"");if(oa(e),g&&!C.length&&!I){pe=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,t.layoutFile=!1,t.emptyFile=!1,t.sectionsMissing=[],t.ownFile=null,t.emptyText=v(e,"html_tree_page_empty"),t.canEdit=!y("dock:is-locked"),t.look=ko(e),t.onRefresh=()=>H(e),t.onSection=null,Ct(e),De(n,xt),Et(e,[]);return}t.pageBuilder=g;const L=`${h}|${M}`;let x=!1;L!==Ot&&(Ot=L,F.clear(),St!==null&&d!==St?x=!0:He=d),(x||He!==!1&&d!==He)&&(He=!1,F.clear(),$=Vt(r)||null),St=d,X&&(X===M||!C.length)&&(on||d!==tn)&&(e.clearTimeout(Se),X="",He=!1,Nt(r,$)||(F.clear(),$=Vt(r)||null));const D=C.some(c=>c.uid===X)?X:"",J=ge?"":D||M,K=!!(D||M),E=K||T?"":String(y("dock:chrome-kind")||"");E==="template"&&(t.pageBuilder=!1);const l=g&&(!h&&!K||E==="main"&&y("dock:on-empty-page")===!0),p=l||E==="template"?"":E;t.layoutFile=p==="main",p!=="main"&&(et="");const B=p==="main"?Co(r,"main"):null,N=B?vt(r,c=>c.tag==="body"&&Nt(c.children,B.id)):null;Ke=N?N.path:"",B&&(tt((N||B).path),et!==L&&(tt(B.path),F.add(B.path)));const $e=p==="header"||p==="footer"?vt(r,c=>d.slice(c.from,c.openTo).includes(`data-sve-chrome="${p}"`)):null,le=$e||(p==="header"||p==="footer"?Co(r,p):null);le&&tt(le.path);const U=l||!(p==="main"?!!B:p==="header"||p==="footer"?!!le:!0)?[]:na(r,t.query?new Set:ni(r));t.emptyFile=!d.trim()&&E==="template"&&Bt(o),t.sectionsMissing=E==="template"?Gr(r):[],t.sectionsMissingText=v(e,"html_tree_sections_missing"),t.sectionsAddText=v(e,"html_tree_sections_add_here"),t.onAddSections=c=>{const b=Ro(e,`sections:${c}`,null,v(e,"html_tree_sections_slot"));b!==null&&(t.selectFrom={at:b,left:4})},!d.trim()&&!Bt(o)?t.emptyText=v(e,"html_tree_need_dock"):t.emptyFile?t.emptyText=v(e,"html_tree_page_no_html"):t.emptyText=v(e,"html_tree_empty"),t.slotText=v(e,"antlers_drop_here"),t.dataTitle=v(e,"data_vars_title"),t.pageTitle=v(e,"component_props_page"),t.renameTitle=v(e,"html_tree_rename"),t.tagTitle=v(e,"tw_tag"),t.hideTitle=v(e,"html_tree_hide"),t.showTitle=v(e,"html_tree_show"),t.sectionHideTitle=v(e,"html_tree_section_hide"),t.sectionShowTitle=v(e,"html_tree_section_show"),t.moreTitle=v(e,"html_tree_more"),t.duplicateTitle=v(e,"html_tree_duplicate"),t.deleteTitle=v(e,"html_tree_delete"),t.videoHoldTitle=v(e,"html_tree_video_hold"),t.videoPlayTitle=v(e,"html_tree_video_play"),t.alpineTitle=v(e,"html_tree_alpine_state"),t.lockedTitle=v(e,"html_tree_locked"),t.searchEmpty=v(e,"html_tree_search_empty"),t.canEdit=!y("dock:is-locked"),t.look=ko(e),t.onQuery=()=>H(e),Ct(e),t.inComponent=T,t.onSelect=(c,b)=>{const S=U.find(ne=>ne.id===c);if(S&&Yo(e,S.path))return;b&&!Ka()&&(t.rowClicks+=1);const ae=!!b&&S?.kind==="antlers"&&!ie&&aa(e);Le(e,c,U),b&&S&&!ie&&!ut()&&y("build:reveal",{path:S.path,section:!!S.sectionRoot}),ae&&Za(e,{path:S.path,at:b,beside:W(e.document)})},t.onTwist=c=>{const b=U.find(S=>S.id===c)?.path;b&&(F.has(b)?F.delete(b):F.add(b),H(e))},t.onTagChange=(c,b)=>{const S=t.rows.find(ae=>ae.id===b);S&&!ut()&&!ao(e,S)&&Pa(e,c.currentTarget,S)},t.onRename=c=>hi(e,c),t.onRenameCommit=()=>Po(e,!0),t.onRenameCancel=()=>Po(e,!1),t.onHide=c=>pi(e,c),t.onLock=c=>cn(e,c),t.onMore=(c,b)=>Ti(e,c,b),t.canUnlock=dn(e),t.lockTitle=v(e,"html_tree_lock"),t.unlockTitle=v(e,"html_tree_unlock"),t.lockedByTitle=v(e,"html_tree_locked_by_developer"),t.onVideoHold=c=>vi(e,c),t.onAlpineState=(c,b)=>mi(e,c,b),t.onDuplicate=c=>gi(e,c),t.onDelete=c=>yi(e,c),t.onPointerDown=(c,b)=>_i(e,c,b),t.onSectionPointerDown=(c,b)=>Hi(e,c,b),t.onSectionHover=c=>e.dispatchEvent(new e.CustomEvent("sve-lite-hover",{detail:{uid:c}})),t.onContext=(c,b)=>mn(e,c,b),t.onInspectCommit=c=>$i(e,c),t.onPropValue=(c,b,S)=>Lo(e,c,b,S),t.onPropPage=(c,b)=>Ur(e,c,S=>Lo(e,b,S,!1)),t.onLoopKind=c=>Fi(e,c),t.onAddBranch=c=>Ai(e,c),t.onLoopSortField=c=>{const b=ft();if(!b)return;const S=Te?.id===b.id?Te.dir:"";Te=null,re(e,ts(b,c,S))},t.onLoopSortDir=c=>{const b=ft();if(!b)return;const S=os(b,c);if(S.draft){Te={id:b.id,dir:S.draft},Ut(e,b);return}Te=null,re(e,S.edit)},t.onLoopDepth=c=>re(e,ss(c)),t.onLoopIncludeHome=c=>re(e,rs(c)),t.onLoopLimit=c=>re(e,is(c)),t.onLoopOffset=c=>re(e,ls(c)),t.onPropHost=c=>c?Y.mount(c):Y.unmount(),t.onInspectData=(c,b)=>{y("dock:data-menu",{anchor:c,at:U.find(S=>S.id===$)?.from,onPick:S=>b(String(S?.var||"").trim())})};const yt=U.find(rn)?.id,Qe=T?"":ti(e,C,J),de=J&&!T?C.find(c=>c.uid===J):null;t.nameAt=(c,b)=>{if(b!==d||!c)return"";const S=ve=>{for(const fe of ve||[]){if(fe.path===c)return fe;const me=c.startsWith(`${fe.path}/`)?S(fe.children):null;if(me)return me}return null},ae=t.rows.find(ve=>ve.path===c&&!ve.kind);if(ae)return ae.name;const ne=S(r);if(!ne)return"";const ue=ne.id===yt,Je=ue&&Qe?Qe:ne.klass;return ue&&de?Je:To(Je,ne.path,f)};const Tn=Bo(e,String(y("dock:current-type")||""));let xn=0;const wn=fi($e?[$e]:r,d),_n=No(e,String(h)),ce=p==="header"||p==="footer"?p:"",Pe=le?le.id:"",ye=B&&U.find(c=>c.id===B.id)||null,co=N&&U.find(c=>c.id===N.id)||null,he=co||ye||Pe&&U.find(c=>c.id===Pe)||null,ho=he?li(U,he):-1;if(he&&!U.slice(U.indexOf(he),ho).some(c=>c.id===$)&&($=he.id),t.selectFrom){const c=U.find(b=>b.from===t.selectFrom.at&&(!b.kind||b.kind==="sections"));c?($=c.id,t.selectFrom=null):--t.selectFrom.left<=0&&(t.selectFrom=null)}const uo=t.layoutFile?ii(e):null;t.rows=U.map(c=>{const b=uo&&c.kind==="component"&&uo.get(c.src)||"",S=c.tag==="body"&&!c.kind,ae=b?{svg:_e[b]}:Xo(c.tag,c.kind,c.antlers),ne=c.tag==="video"&&!c.kind?xn++:-1,ue=wn.get(c.id),Je=ue?_n[ue.nth]||{}:{},ve=ue?ue.booleans.map(({key:Fe,value:vo})=>({key:Fe,file:vo,value:Je[Fe]??vo})):[],fe=c.id===yt&&Qe?Qe:c.klass,me=c.id===yt;return{...c,tag:b||c.tag,frameCall:b,fixed:!!b||S,base:fe,name:b?v(e,`html_tree_frame_${b}`):ce&&c.id===Pe?v(e,`html_tree_frame_${ce}`):c===ye?v(e,"html_tree_frame_main"):me&&de?fe:To(fe,c.path,f),current:c.id===$,letter:ae.letter||"",svg:ce&&c.id===Pe?_e[ce]:c===ye?_e.main:me&&de?de.svg:ae.svg||"",frame:ce&&c.id===Pe?ce:c===ye?"main":"",cat:ce&&c.id===Pe?ce:c===ye||S?"main":b||Vo(c.tag,c.kind,c.antlers),componentRoot:me&&T,sectionRoot:me&&de?de.uid:"",sectionOff:!!(me&&de&&!de.enabled),videoNth:ne,videoHeld:ne>=0&&Tn.has(ne),alpineNth:ve.length?ue.nth:-1,alpineKeys:ve,alpineSet:ve.some(Fe=>Fe.value!==Fe.file)}}),sa(e),ra(e);const bt=[];for(const c of t.rows)bt.length=c.depth,c.guides=bt.slice(),bt[c.depth]=c.cat;if(he){const c=U.indexOf(he),b=he.depth;t.rows=t.rows.slice(c,ho).map(S=>({...S,depth:S.depth-b,guides:S.guides.slice(b)})),ye&&et!==L&&(et=L,e.setTimeout(()=>Le(e,ye.id,U),0))}t.sections=g&&!T&&(K||p||l)?C.map(c=>{const b=!!J&&c.uid===J;return{...c,current:b,ready:b&&(!D||!!z),row:{id:`sec:${c.uid}`,section:c.uid,tag:c.tag,name:c.label,kind:"",svg:c.svg,cat:c.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:b,hidden:!c.enabled}}}):[],t.frame=si(e,C,K,T,p,!1,!!co),t.ownFile=ri(e,t.sections.length>0),t.frameEmptyText=v(e,"html_tree_frame_no_sections"),ai(e,p),t.onSection=c=>{ie||(jt(e),gt(e,o,C,c,J))},t.onRefresh=()=>H(e),Ut(e,t.rows.find(c=>c.id===$)),De(n,xt),Et(e,r)}function ai(e,o){t.frameOpenTitle=v(e,"html_tree_frame_open"),t.frameMainTitle=v(e,"html_tree_frame_main_open"),t.frameTemplateTitle=v(e,"html_tree_frame_template_open"),t.frameFieldsTitle=v(e,"html_tree_frame_fields"),t.onFrame=a=>{o===a?di(e,a):Kt(e,a)},t.onFrameEnter=a=>Kt(e,a),t.onFrameFields=a=>qn(e,ca(e,a),v(e,`html_tree_frame_${a}`)),t.onFrameTwist=()=>{t.mainShut=!t.mainShut}}function si(e,o,a,n,s,d=!1,r=!1){if(!s&&!d||r)return null;const h=P=>({id:`frame:${P}`,frame:P,synthetic:!0,tag:P,name:v(e,`html_tree_frame_${P}`),kind:"",svg:_e[P]||"",cat:P,letter:"",depth:0,hasChildren:P==="main"&&(o.length>0||s==="template"),shut:P!=="main",current:!1,hidden:!1}),f={kind:s,header:h("header"),main:h("main"),footer:h("footer"),template:null},g=s&&s!=="template"?String(y("dock:collection-view")||""):"";return g&&(f.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:pt(e,g)?.display||je(g.replace(/^view:/,"")),kind:"",svg:_e.section||"",cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),f}function ri(e,o){return!o||!We(e)?null:{id:"frame:own",frame:"template",synthetic:!0,tag:"template",name:v(e,"html_tree_own_file"),kind:"",svg:_e.section||"",cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}}function Co(e,o){return vt(e,a=>a.tag===o)}function vt(e,o){for(const a of e||[]){if(!a.kind&&o(a))return a;const n=vt(a.children,o);if(n)return n}return null}function ii(e){const o=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},a=new Map;for(const n of["header","footer"]){const s=Ma(o[n]?.type);s&&a.set(s,n)}return a}function li(e,o){let a=e.indexOf(o)+1;for(;a<e.length&&e[a].depth>o.depth;)a+=1;return a}function di(e,o){const a=zo(e);(o==="main"||o==="template"?a?.querySelector("main"):a?.querySelector(`[data-sve-chrome="${o}"]`))?.scrollIntoView({behavior:ba(),block:"start"})}function jt(e){const o=String(y("dock:chrome-open",e.document)||"");return o!=="header"&&o!=="footer"?!1:(ha(e),ke({source:Q,type:V.SVE_FORCE_EXIT_CHROME},e),!0)}function ci(e){e.clearTimeout(Se),X="",z="",F.clear(),$=null,ge=!1,j(),Ze()}function Kt(e,o){if(e.document,String(y("dock:chrome-kind")||"")===o)return;if(ci(e),o==="main"){jt(e),y("dock:open-file",wa);return}if(o==="template"){const d=String(y("dock:collection-view")||"")||We(e);d&&(jt(e),y("dock:open-file",d));return}if(o!=="header"&&o!=="footer")return;const a=zo(e)?.querySelector(`[data-sve-chrome="${o}"]`);a?(a.scrollIntoView({block:"nearest"}),a.dispatchEvent(new a.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:Q,type:V.OPEN_CHROME,kind:o},e.location.origin);const n=Date.now(),s=async()=>{if(String(y("dock:chrome-kind")||"")!==o){Date.now()-n<3e4&&e.setTimeout(s,250);return}await(y("dock:load-settled")||null),bn(e)};e.setTimeout(s,250)}function Et(e,o){W(e.document)&&ln(e,o)}function ln(e,o){const a=en(o),n=!!y("dock:component-src"),s=n?"":y("dock:current-uid")||"";ke({source:Q,type:V.SVE_HTML_PICK,on:!0,uid:s,uids:s?Xe(s,e.document):[],all:n,tag:a?.tag||"",klass:a?.klass||"",nodes:es(o)},e)}function tt(e){if(!e)return;const o=(a,n)=>{for(const s of a||[]){if(s.path===e)return!0;if(o(s.children,n+1))return n===0||s.path===Ke?F.delete(s.path):F.add(s.path),!0}return!1};o(pe,0)}function hi(e,o){if(ie)return;const a=t.rows.find(n=>n.id===o);ao(e,a)||!a||a.kind||($=o,t.rows.forEach(n=>{n.current=n.id===o}),t.editingId=o,t.draft=a.name,e.setTimeout(()=>{const n=W(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function Po(e,o){const a=t.editingId;if(!a)return;const n=t.rows.find(s=>s.id===a);t.editingId=null,o&&n&&(n.sectionRoot?ui(e,n.sectionRoot,t.draft):Qa(y("dock:current-type")||"",n.path,t.draft,n.base||n.klass)),t.draft="",H(e)}function ui(e,o,a){const n=mt(e)||"page_sections",s=String(a||"").replace(/\s+/g," ").trim();for(const d of zt(e.document)||[]){const r=Yt(d.values),h=r&&typeof r=="object"?r[n]:null;if(!Array.isArray(h))continue;const f=h.findIndex(C=>C&&typeof C=="object"&&[C._visual_id,C.id,C._id].includes(o));if(f===-1)continue;const g=Ko(e,h[f]),P=pt(e,g)?.display||je(g)||g,T=JSON.parse(JSON.stringify(h));return T[f]={...T[f]},!s||s===P?delete T[f]._sve_label:T[f]._sve_label=s,d.setFieldValue(n,T),!0}return!1}function vi(e,o){const a=t.rows.find(h=>h.id===o);if(!a||!(a.videoNth>=0))return;const n=String(y("dock:current-type")||""),s=Bo(e,n),d=!s.has(a.videoNth);d?s.add(a.videoNth):s.delete(a.videoNth);const r=String(y("dock:current-uid")||"");da(e,n,s),ke({source:Q,type:V.SVE_VIDEO_HOLD,uid:r,uids:r?Xe(r,e.document):[],nth:a.videoNth,on:d},e),H(e)}function fi(e,o){const a=new Map;let n=0;const s=d=>{for(const r of d){if(r.hidden)continue;const h=r.kind?null:hs(o.slice(r.from,r.openTo));h!==null&&a.set(r.id,{nth:n++,booleans:vs(h)}),s(r.children||[])}};return s(e),a}function mi(e,o,a){const n=t.rows.find(d=>d.id===a);if(!n||!(n.alpineNth>=0))return;if(n.alpineKeys.length===1){Ho(e,n,n.alpineKeys[0]);return}const s=o.currentTarget.getBoundingClientRect();j(),te=Ie(e.document,Re,{items:n.alpineKeys.map(d=>({label:d.key,icon:d.value?un:vn,onPick:()=>{j(),Ho(e,n,d)}})),x:Math.round(s.left),y:Math.round(s.bottom+4),onClose:()=>{te=null}})}function Ho(e,o,a){const n=String(y("dock:current-type")||""),s=No(e,n),d=!a.value,r=d!==a.file,h={...s[o.alpineNth]||{}};r?h[a.key]=d:delete h[a.key],Object.keys(h).length?s[o.alpineNth]=h:delete s[o.alpineNth];const f=pa(String(y("dock:chrome-kind")||"")),g=f?"":String(y("dock:current-uid")||"");ga(e,n,s),ke({source:Q,type:V.SVE_ALPINE_STATE,uid:g,uids:g?Xe(g,e.document):[],chrome:f,nth:o.alpineNth,key:a.key,value:d,on:r},e),H(e)}function ao(e,o){return!o||!(o.locked||o.lockedIn)?!1:(e.Statamic?.$toast?.error(v(e,"html_tree_locked_element")),!0)}function dn(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function cn(e,o){const a=t.rows.find(n=>n.id===o);if(!(!a||a.lockedIn||y("dock:is-locked"))){if(!a.locked){Me(e,o,Ua,{lockAction:!0});return}if(!dn(e)){e.Statamic?.$toast?.error(v(e,"html_tree_unlock_denied"));return}Zt(e,{titleKey:"html_tree_unlock_title",bodyKey:"html_tree_unlock_body",confirmKey:"html_tree_unlock_confirm"},()=>Me(e,o,qa,{lockAction:!0,unlock:!0}))}}function so(e){return!!t.rows.find(o=>o.id===e)?.fixed}function ro(e){const o=t.sections?.find(n=>n.row?.id===e);if(o)return o;const a=t.rows.find(n=>n.id===e)?.sectionRoot;return a&&t.sections?.find(n=>n.uid===a)||null}function pi(e,o){if(so(o))return;const a=ro(o),n=t.rows.find(s=>s.id===o);if(a&&!(n?.hidden&&n.wrapFrom!=null)){e.postMessage({source:Q,type:V.HIDE_ROW,uid:a.uid,show:!a.enabled},e.location.origin),e.setTimeout(()=>H(e),60);return}Me(e,o,za)}function gi(e,o){if(so(o))return;const a=ro(o)?.uid;if(a){e.postMessage({source:Q,type:V.DUPLICATE_ROW,uid:a},e.location.origin);return}Me(e,o,Ya)}function hn(e,o){Zt(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const a=e.document;Ta({uid:o},a,e)})}function ki(e,o,a){X===a&&(e.clearTimeout(Se),X="",z=""),$=null,ge=!1,Ot="";const n=Ge(e,o),s=n.find(d=>d.uid!==a)||n[0];s?gt(e,o,n,s.uid,""):(z="",t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,H(e)),e.setTimeout(()=>{W(e.document)&&H(e)},0)}jo("row:removed",({uid:e,parentPath:o,doc:a,win:n})=>{o!==mt(n)||!W(n.document)||ki(n,a,e)});function yi(e,o){if(so(o))return;const a=t.sections?.find(s=>s.row?.id===o),n=a?a.row?.section||a.uid:t.rows.find(s=>s.id===o)?.sectionRoot;if(n){hn(e,n);return}if(t.rows.find(s=>s.id===o)?.kind==="sections"){Zt(e,{titleKey:"html_tree_sections_remove_title",bodyKey:"html_tree_sections_remove_body",confirmKey:"html_tree_sections_remove_confirm"},()=>Me(e,o,bo));return}Me(e,o,bo)}function Me(e,o,a,{lockAction:n=!1,unlock:s=!1}={}){if(y("dock:is-locked"))return;const d=Z(),r=t.rows.find(f=>f.id===o);if(!r||!n&&ao(e,r))return;const h=a(d,r);h!==d&&Oe(h,{unlock:s})}let ze=null;function io(){ze?.closest("[data-sve-ht-row]")?.removeAttribute("data-sve-ht-more-open"),ze=null}function j(){te?.dismiss(),te=null,io()}const un='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',vn='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>',be=e=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${e}</svg>`,xe={up:be('<path d="M12 19V5M6 11l6-6 6 6"/>'),down:be('<path d="M12 5v14M6 13l6 6 6-6"/>'),save:be('<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/>'),add:be('<path d="M12 5v14M5 12h14"/>'),fieldset:be('<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/>'),lock:be('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),unlock:be('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-.9"/>')};function bi(e,o){const a=t.sections||[],n=a.findIndex(r=>r.uid===o.uid),s=(r,h={})=>()=>{j(),e.postMessage({source:Q,type:r,uid:o.uid,...h},e.location.origin),e.setTimeout(()=>H(e),60)},d=[{label:v(e,"move_up"),icon:xe.up,onPick:n>0?s(V.MOVE,{direction:-1}):null},{label:v(e,"move_down"),icon:xe.down,onPick:n>=0&&n<a.length-1?s(V.MOVE,{direction:1}):null},{label:v(e,"html_tree_save_section"),icon:xe.save,onPick:s(V.SAVE_SECTION)},{label:v(e,"add_section_below"),icon:xe.add,onPick:s(V.ADD_SET)}];if(Oo(e)&&o.type&&!o.static){const r=o.current&&!t.canEdit;d.push({label:v(e,"html_tree_fieldset"),icon:xe.fieldset,onPick:r?null:()=>{j(),$o(e,o.type)}})}return d}function Eo(e,o){const a=t.canEdit&&(!o.locked||t.canUnlock);return{label:o.locked?t.canUnlock?t.unlockTitle:t.lockedByTitle:t.lockTitle,icon:o.locked?xe.unlock:xe.lock,onPick:a?()=>{j(),cn(e,o.id)}:null}}function Ti(e,o,a){if(!o.isConnected||te&&ze===o)return;const n=ro(a),s=t.rows.find(d=>d.id===a);if(!n){mn(e,null,a,{anchor:o,lead:s?[Eo(e,s)]:[]});return}j(),ze=o,o.closest("[data-sve-ht-row]")?.setAttribute("data-sve-ht-more-open",""),te=Ie(e.document,Re,{items:[...bi(e,n),...s?[Eo(e,s)]:[]],x:0,y:0,anchor:o,onClose:()=>{te=null,io()}})}function fn(e,o){const a=t.sections?.find(f=>f.uid===o),n=a?.type||"";if(!n||!Io(e))return[];const s=a.label||n,d=Un(e,n),r=()=>e.Statamic?.$toast?.error(v(e,"section_update_failed")),h=[{label:v(e,"static_section_insertable"),icon:d?vn:un,onPick:()=>{j(),mo(e,{handle:n,hidden:!d}).then(()=>{e.Statamic?.$toast?.success(v(e,d?"section_shown_to_editors":"section_hidden_from_editors",{name:s})),po(e)}).catch(r)}}];return a.static&&h.push({label:v(e,"section_add_fields"),onPick:()=>{j(),mo(e,{handle:n,fields:!0}).then(()=>{e.Statamic?.$toast?.success(v(e,"section_fields_added",{name:s})),po(e),H(e),$o(e,n)}).catch(r)}}),h}function xi(e,o,a){const n=a.row?.section||a.uid;n&&(te=Ie(e.document,Re,{items:[...fn(e,n),{label:v(e,"html_tree_remove_section"),danger:!0,onPick:()=>{j(),hn(e,n)}}],x:o.clientX,y:o.clientY,onClose:()=>{te=null}}))}function mn(e,o,a,{anchor:n=null,lead:s=[]}={}){j();const d=t.sections?.find(g=>g.row?.id===a);if(d){xi(e,o,d);return}const r=t.rows.find(g=>g.id===a);if(!r)return;n||Le(e,a,t.rows);const h=n?{x:0,y:0}:{x:o.clientX,y:o.clientY},f=g=>{const P=[...s,...g.map(T=>n&&T.onPick?{...T,onPick:()=>{Le(e,a,t.rows),T.onPick()}}:T)];P.length&&(te?.dismiss(),n&&(ze=n,n.closest("[data-sve-ht-row]")?.setAttribute("data-sve-ht-more-open","")),te=Ie(e.document,Re,{items:P,x:h.x,y:h.y,anchor:n,onClose:()=>{te=null,io()}}))};if(r.frameCall){f([{label:v(e,"html_tree_frame_edit",{frame:v(e,`chrome_${r.frameCall}`)}),onPick:()=>{j(),Kt(e,r.frameCall)}}]);return}if(r.kind==="component"){wi(e,r,f);return}if(r.kind==="slot"||r.kind==="sections"||r.kind==="svg"||r.locked||r.lockedIn){f([]);return}if(!t.canEdit){f([]);return}if(r.componentRoot){f([]);return}f([...r.sectionRoot?fn(e,r.sectionRoot):[],{label:v(e,"component_make"),onPick:()=>{j(),Ea(e,r,{onDone:()=>H(e),onError:g=>{e.alert(g?.status===409?v(e,"component_exists"):v(e,"component_failed"))}})}}])}const Mo=(e,o)=>{j(),y("dock:open-template",o)};function wi(e,o,a){if(!ka(o.src)){a([{label:v(e,"component_open_named",{name:ya(o.src)||o.src}),onPick:()=>Mo(e,`view:partials/${o.src}`)}]);return}a([{label:v(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(o.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const s=Array.isArray(n.items)?n.items:[];a(s.length?s.map(d=>({label:v(e,"component_open_named",{name:d.label}),onPick:()=>Mo(e,d.type)})):[{label:v(e,"component_none"),onPick:null}])}).catch(()=>a([{label:v(e,"component_none"),onPick:null}]))}function _i(e,o,a){if(o.button!==0||y("dock:is-locked")||t.editingId)return;const n=t.rows.find(r=>r.id===a);if(n&&(n.locked||n.lockedIn)||o.target?.closest?.("button, input"))return;Ze(),we=a,Ne={x:o.clientX,y:o.clientY},lt=o.currentTarget,dt=o.pointerId;const s=r=>Si(e,r),d=r=>Ci(e,r);At=()=>{e.document.removeEventListener("pointermove",s,!0),e.document.removeEventListener("pointerup",d,!0),e.document.removeEventListener("pointercancel",d,!0),At=null},e.document.addEventListener("pointermove",s,!0),e.document.addEventListener("pointerup",d,!0),e.document.addEventListener("pointercancel",d,!0)}function Si(e,o){if(!we||!Ne)return;const a=o.clientX-Ne.x,n=o.clientY-Ne.y;if(!t.dragging&&a*a+n*n<25)return;if(!t.dragging){t.dragging=!0;try{lt?.setPointerCapture?.(dt)}catch{}}o.preventDefault();const s=e.document.elementFromPoint(o.clientX,o.clientY),d=s?.closest?.("[data-sve-ht-slot]");if(d){const T=d.getAttribute("data-sve-ht-id");if(T&&T!==we){t.dropId=T,t.dropPlace="inside";return}}const r=s?.closest?.("[data-sve-ht-row]"),h=r?.getAttribute("data-sve-ht-id");if(!h||h===we){t.dropId=null,t.dropPlace=null;return}const f=t.rows.find(T=>T.id===h),g=t.rows.find(T=>T.id===we);if(!f||f.lockedIn||g&&f.path.startsWith(`${g.path}/`)){t.dropId=null,t.dropPlace=null;return}const P=r.getBoundingClientRect();t.dropId=h,t.dropPlace=Ba(o.clientY-P.top,P.height,!qo(f.tag)&&!Uo(f)&&!f.locked)}function Ci(e,o){const a=we,n=t.dropId,s=t.dropPlace||"after",d=t.dragging;if(Ze(),d&&(ie=!0,e.setTimeout(()=>{ie=!1},0)),!d||y("dock:is-locked")||!a||!n||a===n)return;o?.preventDefault?.();const r=Z(),h=Na(r,pe,a,n,s);if(h!==r){const f=s==="inside"&&Xt()?Pi(e,r,h,a,n):null;Oe(h)||f?.()}}function Pi(e,o,a,n,s){const d=yo(pe,n),r=yo(pe,s);if(!d||!r||r.children.length||!(r.kind==="antlers"||r.hollow))return null;const h=ja(o,d),f=h.from<r.from?r.from-(h.to-h.from):r.from,g=(I,L)=>{for(const x of I){if(x.from===f&&x.tag===r.tag)return{node:x,depth:L};const D=g(x.children,L+1);if(D)return D}return null},P=g(Ye(a,oo(e)),0);if(!P)return null;const{path:T}=P.node,C=P.depth===0||T===Ke,M=F.has(T);return C?F.delete(T):F.add(T),()=>{M?F.add(T):F.delete(T)}}function Ze(){try{lt?.releasePointerCapture?.(dt)}catch{}At?.(),we=null,Ne=null,lt=null,dt=null,t.dragging=!1,t.dropId=null,t.dropPlace=null}function Hi(e,o,a){if(o.button!==0||!a||t.editingId||o.target?.closest?.("button, input"))return;pn(),Ue=a,Ve={x:o.clientX,y:o.clientY},ct=o.currentTarget,ht=o.pointerId;const n=d=>Ei(e,d),s=d=>Mi(e,d);Dt=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",s,!0),e.document.removeEventListener("pointercancel",s,!0),Dt=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",s,!0),e.document.addEventListener("pointercancel",s,!0)}function Ei(e,o){if(!Ue||!Ve)return;const a=o.clientX-Ve.x,n=o.clientY-Ve.y;if(!t.dragging&&a*a+n*n<25)return;if(!t.dragging){t.dragging=!0;try{ct?.setPointerCapture?.(ht)}catch{}}o.preventDefault();const d=e.document.elementFromPoint(o.clientX,o.clientY)?.closest?.("[data-sve-ht-sec-uid]"),r=d?.getAttribute("data-sve-ht-sec-uid")||"";if(!r||r===Ue){t.sectionDrop=null;return}const h=d.getBoundingClientRect();t.sectionDrop={uid:r,place:o.clientY-h.top<h.height/2?"before":"after"}}function Mi(e,o){const a=Ue,n=t.sectionDrop,s=t.dragging;pn(),s&&(ie=!0,e.setTimeout(()=>{ie=!1},0)),!(!s||!a||!n?.uid||n.uid===a)&&(o?.preventDefault?.(),Li(e,a,n.uid,n.place))}function pn(){try{ct?.releasePointerCapture?.(ht)}catch{}Dt?.(),Ue=null,Ve=null,ct=null,ht=null,t.dragging=!1,t.sectionDrop=null}function Li(e,o,a,n){const s=mt(e)||"page_sections";for(const d of zt(e.document)||[]){const r=Yt(d.values),h=r&&typeof r=="object"?r[s]:null;if(!Array.isArray(h))continue;const f=C=>h.findIndex(M=>M&&typeof M=="object"&&[M._visual_id,M.id,M._id].includes(C)),g=f(o),P=f(a);if(g===-1||P===-1||g===P)return!1;let T=n==="before"?P:P+1;return g<T&&(T-=1),T===g?!1:(e.postMessage({source:Q,type:V.MOVE,uid:o,toIndex:T},e.location.origin),e.setTimeout(()=>H(e),60),!0)}return!1}function Ut(e,o){if(o?.kind==="component"){Ii(e,o);return}if(ee.callOpen&&(ee.callOpen=!1,ee.callStore=null,Y.forget(),eo(e)),o?.kind!=="antlers"){t.inspect=null;return}const a=o.id,n={logic:!0,path:o.path};if(o.tag==="else"){t.inspect={key:a,...n,title:v(e,"antlers_condition"),mode:"note",note:v(e,"antlers_else_note")};return}if(o.antlers==="loop"){t.inspect={...as(e,o,{key:a,draft:Te?.id===o.id?Te.dir:""}),...n};return}t.inspect={key:a,...n,title:v(e,"antlers_condition"),mode:"condition",value:o.expr||"",placeholder:v(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:v(e,"antlers_add_elseif")},{id:"else",label:v(e,"antlers_add_else")}]}}function Ii(e,o){if(!Ia(e)){t.inspect=null;return}if(!o.src)return;const a=o.id;if(t.inspect={key:a,title:v(e,"component_props_values"),mode:"note",note:v(e,"code_dock_loading")},Ra()){const n={},s={},d=new Map;for(const[r,h]of Oa(Z().slice(o.from,o.to))){const f=$a(r);f&&(r!==f||!d.has(f))&&d.set(f,h)}for(const[r,h]of d)h.bound?s[r]=h.value:n[r]=h.value;t.inspect=null,ee.callOpen=!0,ee.title=ee.title||v(e,"component_props"),ee.callTitle=o.klass||o.name||o.src,ee.callStore=Y.ui,Y.ui.canBind=!0,Y.ui.dataTitle=v(e,"data_vars_title"),Y.ui.exprPlaceholder=v(e,"component_props_expr"),Y.ui.onBox=(r,h)=>Oi(e,r,h),Y.ui.onPickData=(r,h)=>y("dock:data-menu",{anchor:h,at:o.from,types:Fa(Y.ui.fields.find(f=>f.handle===r)?.type),onPick:f=>gn(e,r,String(f?.var||"").trim())}),Y.load(e,{key:`${o.src}::${a}`,src:o.src,params:n,bindings:s,readOnly:y("dock:is-locked")===!0}),Y.watch(e,{src:o.src,write:r=>Ri(e,r,s)}),eo(e);return}Aa(e,o.src).then(n=>{if(t.inspect?.key===a){if(!n.length){t.inspect={key:a,title:v(e,"component_props_values"),mode:"note",note:v(e,"component_props_values_none")};return}t.inspect={key:a,title:v(e,"component_props_values"),mode:"props",inheritLabel:v(e,"component_props_inherit"),rows:Da(n,Z().slice(o.from,o.to))}}})}function Ri(e,o,a={}){const n=t.rows.find(r=>r.id===$);if(n?.kind!=="component"||y("dock:is-locked"))return;let s=Z(),d=n.to;for(const[r,h]of Object.entries(o||{})){if(r in a)continue;const f=s.length,g=to(s,{from:n.from,to:d},r,h);g!==s&&(d+=g.length-f,s=g)}s!==Z()&&(Oe(s,{save:!0}),H(e))}function gn(e,o,a){kn(e,o,a,!0),H(e)}function Oi(e,o,a){const n=Va(a);if(n){gn(e,o,n);return}Y.forget(),kn(e,o,String(a??"").trim(),!1),H(e)}function kn(e,o,a,n){const s=t.rows.find(h=>h.id===$);if(s?.kind!=="component"||y("dock:is-locked"))return;const d=Z(),r=to(d,s,o,a,{bound:n});r!==d&&Oe(r,{save:!0})}function ft(){const e=t.rows.find(o=>o.id===$);return e?.kind==="antlers"&&!y("dock:is-locked")?e:null}function re(e,o){const a=ft();if(!a)return;const n=Z(),s=o(n,a);s!==n&&(Oe(s),H(e))}function Lo(e,o,a,n){const s=t.rows.find(h=>h.id===$);if(s?.kind!=="component"||y("dock:is-locked"))return;const d=Z(),r=to(d,s,o,a,{bound:n});r!==d&&(Oe(r,{save:!0}),H(e))}function $i(e,o){re(e,(a,n)=>n.antlers==="loop"?ds(n,o)(a,n):Xa(a,n,o))}function Fi(e,o){const a=ft();if(!a||a.antlers!=="loop")return;const n=ns(e,a,o);n&&re(e,n)}function Ai(e,o){re(e,(a,n)=>Wa(a,n,o))}function Di(e,o){if(!e||!o||Uo(o)||qo(o.tag))return null;const a=La(e,o);if(a<o.openTo)return null;const n=e.lastIndexOf(`
`,a-1)+1;return e.slice(n,a).trim()===""&&n>o.openTo?n-1:a}function Le(e,o,a,{reveal:n=!0}={}){if(ie)return;const s=(a||t.rows).find(d=>d.id===o);s&&($=o,t.rows.forEach(d=>{d.current=d.id===o}),Ut(e,s),!ut()&&(n&&(y("dock:reveal-html",{from:s.from,to:s.to,caret:Di(Z(),s)}),y("dock:tw-follow")),ke({source:Q,type:V.SVE_HTML_PICK_FOCUS,path:s.path,src:s.kind==="component"&&s.src||""},e)))}function Bi(e,o){if(!o)return"";const a=[],n=(s,d)=>{for(const r of s||[]){const h=d||r.path===e;r.kind==="component"&&r.src===o&&a.push({path:r.path,inside:h}),n(r.children,h)}};return n(pe,!1),(a.find(s=>s.inside)||a[0])?.path||""}function Ni(e,o,{reveal:a=!0}={}){if(!o||!W(e.document))return;ge=!1;const n=t.rows.find(d=>d.current);if(n&&n.path===o){Le(e,n.id,t.rows,{reveal:a});return}H(e),tt(o),H(e);const s=t.rows.find(d=>d.path===o);s&&(Le(e,s.id,t.rows,{reveal:a}),e.setTimeout(()=>{W(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function qt(e){if(rt)return;const o=()=>{t.editingId||t.dragging||(e.clearTimeout(it),it=e.setTimeout(()=>{W(e.document)&&H(e)},80))},a=()=>{if(o(),y("dock:on-empty-page")===!0){const n=Ge(e,e.document);n.length===1&&gt(e,e.document,n,n[0].uid,"")}};rt=jo("dock:html-changed",o),e.document.addEventListener("sve-page-structure",a),Ft=()=>{e.document.removeEventListener("sve-page-structure",a)}}function Vi(e){rt?.(),rt=null,Ft?.(),Ft=null,e?.clearTimeout?.(it),it=0}function lo(e){const o=W(e.document);if(ke({source:Q,type:V.SVE_HTML_PICK,on:!1},e),Vi(e),Y.forget(),ee.callOpen=!1,ee.callStore=null,eo(e),Ze(),j(),Sa(e),$=null,t.inspect=null,t.editingId=null,t.draft="",t.sections=[],t.pageBuilder=!1,t.layoutFile=!1,X="",e?.clearTimeout?.(Se),!o){It(e);return}o.remove(),Wt.headerTab==="html_tree"&&Zn(e,null),Qn(e),Fo(e),Ao(e),It(e)}const yn="button[title], button[data-tip], label[title]";function sl(e,o){o.querySelector("[data-sve-html-tree-list]")||(o.id=nt,Do(e,o,{only:yn}),De(o,Qo,{title:v(e,"html_tree")}),o.querySelector("[data-sve-close]")?.addEventListener("click",()=>lo(e)))}function rl(e){qt(e),H(e)}function bn(e){const o=e.document;if(!In(e,"html_tree"))return;if(W(o)){qt(e),H(e);return}if(!Bt(o))return;ge=!0,F.clear(),Jn(e,[nt]);const a=o.createElement("div");a.id=nt,Do(e,a,{only:yn}),a.style.cssText=ea,De(a,Qo,{title:v(e,"html_tree")}),a.querySelector("[data-sve-close]")?.addEventListener("click",()=>lo(e)),ta(e,a),Fo(e),Ao(e),It(e),qt(e),H(e)}function il(e){if(W(e.document)){lo(e);return}bn(e)}Qt("html-tree:open-section",e=>{const o=window,a=o.document,n=Ge(o,a),s=n.find(d=>d.uid===e||d.ids.includes(e));return s?(gt(o,a,n,s.uid,""),{uid:s.uid,ids:s.ids}):null});Qt("html-tree:from-preview",({path:e,src:o,uid:a,reveal:n=!0}={})=>{if(!Yo(window,e)){if(!e){ji(window,a);return}Ni(window,Bi(e,o)||e,{reveal:n})}});function ji(e,o){if(!o||!W(e.document))return;const a=Ge(e,e.document),n=Xe(o,e.document),s=a.find(d=>d.ids.some(r=>n.includes(r)));s&&(ge&&(ge=!1,F.clear(),$=null),X&&X!==s.uid&&(e.clearTimeout(Se),X="",z=""),!y("dock:load-settled")&&H(e))}Qt("html-tree:arm-pick",e=>{const o=window;return e?(ln(o,Ye(Z(),oo(o))),!0):(W(o.document)||ke({source:Q,type:V.SVE_HTML_PICK,on:!1},o),!0)});function ll(){Ce.clear(),Be.clear(),$t.clear(),st.clear(),qe.length=0}export{qr as HTML_TREE_STYLE_ID,al as armHtmlTreePrefetch,ll as clearHtmlTreeTemplates,j as closeHtmlTreeMenu,lo as closeHtmlTreePanel,Qr as ensureHtmlTreeStyles,sl as fillHtmlTreePane,$ as htmlTreeActiveId,W as htmlTreePanel,it as htmlTreeTimer,rt as htmlTreeUnhook,bn as openHtmlTreePanel,H as renderHtmlTree,rl as showHtmlTreePane,Vi as stopWatchHtmlTreeDock,il as toggleHtmlTreePanel,qt as watchHtmlTreeDock};
