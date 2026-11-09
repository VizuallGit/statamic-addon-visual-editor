import{q as v,f as ka,o as f,c as k,a as $,t as L,u as i,e as ya,l as ba,F,j as ae,g as C,w as _,Y as De,N as q,aa as Ta,a2 as xa,ag as He,k as Ht,ae as wa,X as fe,aE as _a,v as co,x as Sa,W as Ca,aF as Pa,ac as Po,aG as Ha,D as vt,m as Kt,p as Ut,V as je,a8 as Ea,aH as Ma,aI as La}from"./addon-CDvUFMe9.js";import{c as Ho,a as Ia,o as Ra,b as Oa,d as $a,i as Fa,r as Da,e as Aa,f as Ba,u as ho,l as uo}from"./section-create-CTZiMMq9.js";import{canEditFields as Eo,openGlobalFieldsOverlay as Na,openFieldsetOverlay as Mo}from"./section-fields-CuAOtt0U.js";import{U as t,V as Va,W as J,X as ja,b,Y as Ka,Z as Ua,_ as qa,$ as qt,s as zt,y as ke,j as Et,H as za,i as Ya,E as Lo,F as Io,a0 as vo,a1 as Ro,m as Ae,D as Xa,R as Wa,G as Ga,a2 as Ye,a3 as Za,a4 as mo,a5 as Qa,a6 as Ja,a7 as Oo,a8 as $o,a9 as Fo,aa as en,ab as tn,o as Do,ac as on,ad as Ao,l as mt,ae as Xe,af as Bo,ag as an,ah as Yt,ai as nn,aj as sn,ak as rn,x as ln,al as dn,am as cn,an as hn,ao as No,ap as Vo,aq as un,ar as vn,as as jo,at as mn,au as fn,av as pn,A as gn,aw as Xt}from"./lp-cluster-C4I6l2uZ.js";import{H as tt,u as kn,d as yn}from"./shortcuts-BIxtNjMb.js";import{_ as Wt,o as Ie}from"./ChoiceDialog-_tYCmdK8.js";import{M as B,S as G}from"./protocol-CfmvxZS7.js";import{C as bn,H as Re,s as Gt,c as Tn,a as xn,b as Ko,t as wn,d as Ee,h as Uo,e as _n,o as Sn,r as Cn,f as Pn,w as Zt,g as Hn,i as En,j as Mn,p as Ln,k as In,l as Rn,m as On,n as $n,v as Fn,q as Dn,u as An,x as Bn,y as fo,z as Nn,A as Vn,B as jn,D as Kn,E as Un,F as qn,G as po,I as zn,J as Yn}from"./component-extract-8WezYwwf.js";import{H as Xn,r as qo,o as Wn,h as go,w as Gn}from"./logic-popup-CZKlTbKk.js";import{T as Zn}from"./template-elements-Bzd3fkLX.js";import{b as Qn}from"./html-pick-align-BDjVGiSh.js";import{l as Jn,a as es,b as ts,c as os,d as as,e as ns,f as ss,g as rs,h as is}from"./loop-inspector-DRKEIQZE.js";import"./FieldsetOverlay-Dp4Us3aB.js";import"./anim-still-4pEwKCsB.js";import"./help-styles-D9NREk3N.js";const yt=/\s*([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/y,ls=/^\s*(?:([A-Za-z_$][\w$]*)|'([^'\\]*)'|"([^"\\]*)")\s*:\s*(true|false)\s*$/;function ds(e){const o=String(e||"").replace(/\{\{[\s\S]*?\}\}/g,s=>" ".repeat(s.length)),n=o.match(/^<[a-zA-Z][\w:-]*/);if(!n)return null;let a=n[0].length;for(;a<o.length;){yt.lastIndex=a;const s=yt.exec(o);if(!s){a+=1;continue}if(s[1].toLowerCase()==="x-data")return s[2]??s[3]??s[4]??"";a=yt.lastIndex}return null}function cs(e,o){const n=e[o];for(let a=o+1;a<e.length;a+=1)if(e[a]==="\\")a+=1;else if(e[a]===n)return a;return e.length-1}function hs(e){const o=String(e||""),n=o.search(/\S/);if(n===-1||o[n]!=="{")return[];const a=new Map;let s=0,l="";const r=()=>{const h=l.match(ls);h&&a.set(h[1]??h[2]??h[3],h[4]==="true"),l=""};for(let h=n;h<o.length;h+=1){const m=o[h];if(m==='"'||m==="'"||m==="`"){const g=cs(o,h);l+=o.slice(h,g+1),h=g;continue}if(m==="/"&&o[h+1]==="/"){const g=o.indexOf(`
`,h);h=g===-1?o.length:g-1;continue}if(m==="/"&&o[h+1]==="*"){const g=o.indexOf("*/",h+2);h=g===-1?o.length:g+1;continue}if(m==="{"||m==="["||m==="("){if(s+=1,s===1)continue}else if(m==="}"||m==="]"||m===")"){if(s-=1,s===0)break}else if(m===","&&s===1){r();continue}l+=m}return r(),[...a].map(([h,m])=>({key:h,value:m}))}const us={class:"sve-html-tree"},vs={class:"sve-pane-bar","data-sve-pane-bar":""},ms={"data-sve-right-title":""},fs={"data-sve-right-actions":""},ps=["aria-pressed","title","aria-label"],gs=["title"],ks={class:"sve-ht-used-by__label"},ys={class:"sve-ht-used-by__chips"},bs=["title","onClick"],Ts={key:1,class:"sve-ht-used-by__chip"},xs={key:0,class:"sve-ht-used-by__empty"},ws={class:"sve-ht-tools"},_s=["title"],Ss=["placeholder","aria-label","value"],Cs=["aria-label"],Ps=["title","aria-label"],Hs=["title","aria-label"],Es={key:3,class:"sve-tree-exit"},Ms=["title"],Ls=["title"],Is='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',Rs='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',Os='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',$s='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',Fs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/></svg>',Ds='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',As={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const o=v(window,"html_tree_search");t.layers=Va(window);const n=v(window,"html_tree_layers_on"),a=v(window,"html_tree_layers_off");function s(){ja(window,!t.layers)}const l=Ho(window),r=v(window,"section_new"),h=v(window,"html_tree_add_element"),m=v(window,"html_tree_sections_slot"),g=v(window,"html_tree_sections_no_field");function P(){const M=t.templateSections.length?t.templateSections:[Ta(window)],u=new Set(t.rows.filter(d=>d.kind==="sections").map(d=>d.tag));return M.filter(d=>!u.has(d)).map(d=>({tag:`sections:${d}`,label:M.length>1?`${m} · ${d}`:m,noField:!t.templateSections.length}))}const y=ka(!1),E=v(window,"section_import");function x(){y.value=!1}async function R(M){if(!M)return;await xa(),t.onRefresh?.();const u=b("html-tree:open-section",M);u&&Da(window,u.ids)}function w(){const M=t.rows.find(u=>u.current&&!u.context&&!u.synthetic)||null;return M?.lockedIn?t.rows.filter(u=>u.locked&&u.from<=M.from&&u.to>=M.to).sort((u,d)=>u.from-d.from)[0]||null:M}function V(M){const u=M.getBoundingClientRect(),d=w();let p=null;const D=(A,$e,ie="")=>()=>{p?.dismiss(),p=null,x();const pt=Fa(window,A,d,$e);pt!==null&&(t.selectFrom={at:pt,left:4},ie&&window.Statamic?.$toast?.info?.(ie))};p=Ie(document,Re,{items:[...Zn.map(A=>({label:A,onPick:D(A,`<${A}>`)})),...P().map(A=>({label:A.label,onPick:D(A.tag,A.label,A.noField?g:"")}))],x:Math.round(u.left),y:Math.round(u.bottom+4),onClose:()=>{p=null,x()}})}function te(M){if(!y.value){if(y.value=!0,!(t.sections.length||t.pageBuilder)){V(M.currentTarget);return}(async()=>{const u=await Ia(window);if(!u){x();return}const d=t.sections.length?t.sections[t.sections.length-1].uid:null,p=D=>{x(),R(D?.uid)};if(u==="static"){Ra(window,{afterUid:d,onDone:p,onError:x,onClose:x});return}Oa(window,{afterUid:d,onDone:p,onError:x,onClose:x})})()}}function Z(){if(y.value)return;y.value=!0;const M=!!(t.sections.length||t.pageBuilder);$a(window,{intoTemplate:!M,after:M?null:w(),afterUid:M&&t.sections.length?t.sections[t.sections.length-1].uid:null,onDone:u=>{if(x(),M){R(u?.uid);return}Number.isInteger(u?.at)&&(t.selectFrom={at:u.at,left:4})},onError:x,onClose:x})}function j(M){const u=!!t.query;t.query=M,u!==!!M&&t.onQuery?.()}return(M,u)=>(f(),k("div",us,[$("div",vs,[$("div",ms,L(e.title),1),$("div",fs,[$("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":i(t).layers?"true":"false",title:i(t).layers?i(a):i(n),"aria-label":i(t).layers?i(a):i(n),innerHTML:Is,onClick:s},null,8,ps),u[5]||(u[5]=ya('<button type="button" data-sve-right-pin aria-pressed="false" data-v-c232a908></button><button type="button" data-sve-close aria-label="Close" data-v-c232a908><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-c232a908><path d="M18 6 6 18" data-v-c232a908></path><path d="m6 6 12 12" data-v-c232a908></path></svg></button>',2))])]),i(t).usedBy?(f(),k("div",{key:0,class:"sve-ht-used-by",title:i(t).usedBy.hint||null},[$("span",ks,[$("span",{class:"sve-ht-used-by__icon","aria-hidden":"true",innerHTML:Fs}),ba(" "+L(i(t).usedBy.label),1)]),$("span",ys,[(f(!0),k(F,null,ae(i(t).usedBy.items,d=>(f(),k(F,{key:d.kind+":"+d.name},[d.onOpen?(f(),k("button",{key:0,type:"button",class:"sve-ht-used-by__chip sve-ht-used-by__chip--open",title:d.openLabel,onClick:p=>d.onOpen(p.currentTarget)},L(d.name),9,bs)):(f(),k("span",Ts,L(d.name),1))],64))),128)),i(t).usedBy.empty?(f(),k("span",xs,L(i(t).usedBy.empty),1)):C("",!0)])],8,gs)):C("",!0),$("div",ws,[$("label",{class:"sve-ht-search",title:i(o)},[$("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:$s}),$("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:i(o),"aria-label":i(o),value:i(t).query,autocomplete:"off",spellcheck:"false",onInput:u[0]||(u[0]=d=>j(d.target.value)),onKeydown:[u[1]||(u[1]=_(()=>{},["stop"])),u[2]||(u[2]=De(_(d=>j(""),["prevent"]),["escape"]))]},null,40,Ss),i(t).query?(f(),k("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":i(o),innerHTML:Ds,onClick:u[3]||(u[3]=d=>j(""))},null,8,Cs)):C("",!0)],8,_s),i(l)&&(i(t).sections.length||i(t).pageBuilder||i(t).rows.length&&!i(t).layoutFile||i(t).emptyFile)?(f(),k("button",{key:0,type:"button",class:"sve-ht-new",title:i(t).sections.length||i(t).pageBuilder?i(r):i(h),"aria-label":i(t).sections.length||i(t).pageBuilder?i(r):i(h),innerHTML:Rs,onClick:te},null,8,Ps)):C("",!0),i(l)&&(i(t).sections.length||i(t).pageBuilder||i(t).rows.length&&!i(t).layoutFile||i(t).emptyFile)?(f(),k("button",{key:1,type:"button",class:"sve-ht-import",title:i(E),"aria-label":i(E),innerHTML:Os,onClick:Z},null,8,Hs)):C("",!0)]),i(J).inSidebar?C("",!0):(f(),q(bn,{key:1})),u[6]||(u[6]=$("div",{"data-sve-html-tree-list":""},null,-1)),i(t).inspect?.logic?C("",!0):(f(),q(Xn,{key:2})),i(t).exitOpen&&!i(J).inSidebar?(f(),k("div",Es,[$("span",{class:"sve-tree-exit__name",title:i(t).exitName},L(i(t).exitName),9,Ms),$("button",{type:"button",class:"sve-tree-exit__go",title:i(t).exitTitle,onClick:u[4]||(u[4]=d=>i(t).onExit?.())},L(i(t).exitLabel),9,Ls)])):C("",!0)]))}},zo=Wt(As,[["__scopeId","data-v-c232a908"]]);function Yo(e){return String(e||"").trim().toLowerCase()}function Mt(e,o){return o?[e.name,e.tag,e.klass,e.label,e.src].filter(n=>typeof n=="string"&&n).join(" ").toLowerCase().includes(o):!0}function Bs(e,o){const n=Yo(o);if(!n)return{rows:e,hits:new Set};const a=new Set;for(const r of e)Mt(r,n)&&a.add(r.path);const s=[...a];return{rows:e.filter(r=>a.has(r.path)||s.some(h=>h.startsWith(`${r.path}/`))),hits:a}}const Ns=["title"],Vs={"data-sve-ht-indent":"","aria-hidden":"true"},js=["data-sve-ht-cat"],Ks={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},Us={key:2,"data-sve-ht-letter":""},qs=["innerHTML"],zs=["title"],Ys=["title"],Xs={key:1,"data-sve-ht-kind":""},Ws={key:3,"data-sve-ht-name":""},Gs={key:4,"data-sve-ht-actions":""},Zs=["data-on","title","innerHTML"],Qs=["title"],Js={key:5,"data-sve-ht-actions":""},er=["data-on","title","innerHTML"],tr=["data-on","title","innerHTML"],or=["disabled","title"],ar=["disabled","title","innerHTML"],nr=["disabled","title"],sr=["disabled","title"],rr=["aria-label"],ir=["data-sve-ht-id"],lr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',dr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',cr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',hr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',ur='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',vr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',mr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',ko='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6.5" width="20" height="11" rx="5.5"/><circle cx="7.5" cy="12" r="3" fill="currentColor" stroke="none"/></svg>',yo='<svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M7.5 5.5h9a6.5 6.5 0 0 1 0 13h-9a6.5 6.5 0 0 1 0-13ZM16.5 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6Z"/></svg>',fr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',pr='<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>',gr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',kr=120,yr={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const o=Eo(window);function n(u){return u.synthetic?u.frame==="main"?t.frameMainTitle:u.frame==="template"?t.frameTemplateTitle:t.frameOpenTitle:u.kind==="component"?u.src?`partial:${u.src}`:u.tag:u.name?`${u.tag} ${u.name}`:u.tag}function a(u){return!!u.section}function s(u){return!!u.frame}function l(u){return u.kind==="slot"}function r(u,d){s(d)||l(d)||(a(d)?t.onSectionPointerDown?.(u,d.section):d.sectionRoot?t.onSectionPointerDown?.(u,d.sectionRoot):t.onPointerDown?.(u,d.id))}function h(u,d){if(u.synthetic){t.onFrame?.(u.frame);return}if(a(u)){t.onSection?.(u.section);return}t.onSelect?.(u.id,d)}function m(u,d){const p={"data-sve-ht-id":u.id};return u.locked&&(p["data-sve-ht-locked"]=""),u.current&&(p["data-sve-ht-current"]=""),(u.hidden||u.sectionOff)&&(p["data-sve-ht-hidden"]=""),(u.videoNth>=0||u.alpineNth>=0)&&(p["data-sve-ht-special"]=""),p["data-sve-ht-cat"]=u.cat||"other",p["data-sve-ht-depth"]=String(u.depth),d&&(p["data-sve-ht-dim"]=""),a(u)&&(p["data-sve-ht-sec"]=""),s(u)&&(p["data-sve-ht-frame"]=u.frame),!a(u)&&t.dropId===u.id&&t.dropPlace&&(p["data-sve-ht-drop"]=t.dropPlace),p}function g(u){return!!u.fixed}function P(u){return u.kind==="sections"}function y(u){return!!(u.locked||u.lockedIn)}function E(u){return!u.lockedIn&&!g(u)}function x(u){return Z(u)||!g(u)&&!P(u)&&!y(u)&&(!u.hidden||u.wrapFrom!=null)}function R(u){if(!j(u))return t.lockedTitle;const d=u.hidden||u.sectionOff;return Z(u)?d?t.sectionShowTitle:t.sectionHideTitle:d?t.showTitle:t.hideTitle}let w=null;function V(u,d){window.clearTimeout(w),w=window.setTimeout(()=>t.onMore?.(u,d.id),kr)}function te(){window.clearTimeout(w)}function Z(u){return!!u.sectionRoot||!!u.section}function j(u){return t.canEdit&&!y(u)||Z(u)}function M(u){const d=u.name||"";return qt()&&d.toLowerCase()===String(u.tag||"").toLowerCase()?"":d}return(u,d)=>(f(),k(F,null,[$("div",He({"data-sve-ht-row":""},m(e.row,e.dim),{role:"button",tabindex:"0",title:n(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:d[43]||(d[43]=p=>h(e.row,p.currentTarget)),onDblclick:d[44]||(d[44]=_(p=>e.row.synthetic?i(t).onFrameEnter?.(e.row.frame):s(e.row)||l(e.row)||a(e.row)?null:i(t).onRename?.(e.row.id),["prevent"])),onKeydown:[d[45]||(d[45]=De(_(p=>h(e.row,p.currentTarget),["prevent"]),["enter"])),d[46]||(d[46]=De(_(p=>h(e.row,p.currentTarget),["prevent"]),["space"]))],onPointerdown:d[47]||(d[47]=p=>r(p,e.row)),onPointerenter:d[48]||(d[48]=p=>a(e.row)?i(t).onSectionHover?.(e.row.section):null),onContextmenu:d[49]||(d[49]=_(p=>s(e.row)||l(e.row)||a(e.row)?null:i(t).onContext?.(p,e.row.id),["prevent","stop"]))}),[$("span",Vs,[(f(!0),k(F,null,ae(e.row.guides||[],(p,D)=>(f(),k("i",{key:D,"data-sve-ht-cat":p},null,8,js))),128))]),e.row.hasChildren||i(Ka)(e.row)?(f(),k("button",He({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?i(t).mainShut:i(Ua)(e.row))?{"data-sve-ht-shut":""}:{},{innerHTML:dr,onClick:d[0]||(d[0]=_(p=>e.row.synthetic?i(t).onFrameTwist?.():a(e.row)?i(t).onSection?.(e.row.section):i(t).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:d[1]||(d[1]=_(()=>{},["stop"])),onDblclick:d[2]||(d[2]=_(()=>{},["stop"]))}),null,16)):(f(),k("span",Ks)),e.row.letter?(f(),k("span",Us,L(e.row.letter),1)):(f(),k("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,qs)),$("span",{"data-sve-ht-text":"",title:i(t).renameTitle},[!e.row.kind&&!a(e.row)&&!s(e.row)?(f(),k("button",{key:0,type:"button","data-sve-ht-tag":"",title:i(t).tagTitle,onClick:d[3]||(d[3]=_(()=>{},["stop","prevent"])),onPointerdown:d[4]||(d[4]=_(()=>{},["stop"])),onDblclick:d[5]||(d[5]=_(p=>i(t).onTagChange?.(p,e.row.id),["stop","prevent"]))},L(e.row.tag),41,Ys)):(f(),k("span",Xs,L(e.row.tag),1)),i(t).editingId===e.row.id&&!a(e.row)?Ht((f(),k("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":d[6]||(d[6]=p=>i(t).draft=p),onMousedown:d[7]||(d[7]=_(()=>{},["stop"])),onPointerdown:d[8]||(d[8]=_(()=>{},["stop"])),onClick:d[9]||(d[9]=_(()=>{},["stop"])),onDblclick:d[10]||(d[10]=_(()=>{},["stop"])),onKeydown:[d[11]||(d[11]=_(()=>{},["stop"])),d[12]||(d[12]=De(_(p=>i(t).onRenameCommit?.(),["prevent"]),["enter"])),d[13]||(d[13]=De(_(p=>i(t).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:d[14]||(d[14]=p=>i(t).onRenameCommit?.())},null,544)),[[wa,i(t).draft]]):(f(),k("span",Ws,L(M(e.row)),1))],8,zs),s(e.row)?(f(),k("span",Gs,[e.row.alpineNth>=0?(f(),k("button",{key:0,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:i(t).alpineTitle,innerHTML:e.row.alpineSet?yo:ko,onClick:d[15]||(d[15]=_(p=>i(t).onAlpineState?.(p,e.row.id),["stop","prevent"])),onPointerdown:d[16]||(d[16]=_(()=>{},["stop"])),onDblclick:d[17]||(d[17]=_(()=>{},["stop"]))},null,40,Zs)):C("",!0),e.row.frame!=="main"&&i(o)?(f(),k("button",{key:1,type:"button","data-sve-ht-fields":"",title:i(t).frameFieldsTitle,innerHTML:lr,onClick:d[18]||(d[18]=_(p=>i(t).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:d[19]||(d[19]=_(()=>{},["stop"])),onDblclick:d[20]||(d[20]=_(()=>{},["stop"]))},null,40,Qs)):C("",!0)])):l(e.row)?C("",!0):(f(),k("span",Js,[e.row.videoNth>=0?(f(),k("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?i(t).videoPlayTitle:i(t).videoHoldTitle,innerHTML:e.row.videoHeld?mr:vr,onClick:d[21]||(d[21]=_(p=>i(t).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:d[22]||(d[22]=_(()=>{},["stop"])),onDblclick:d[23]||(d[23]=_(()=>{},["stop"]))},null,40,er)):C("",!0),e.row.alpineNth>=0?(f(),k("button",{key:1,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:i(t).alpineTitle,innerHTML:e.row.alpineSet?yo:ko,onClick:d[24]||(d[24]=_(p=>i(t).onAlpineState?.(p,e.row.id),["stop","prevent"])),onPointerdown:d[25]||(d[25]=_(()=>{},["stop"])),onDblclick:d[26]||(d[26]=_(()=>{},["stop"]))},null,40,tr)):C("",!0),e.row.locked?(f(),k("button",{key:2,type:"button","data-sve-ht-lock":"","data-on":"",disabled:!i(t).canEdit||!i(t).canUnlock,title:i(t).canUnlock?i(t).unlockTitle:i(t).lockedByTitle,"aria-pressed":"true",innerHTML:fr,onClick:d[27]||(d[27]=_(p=>i(t).onLock?.(e.row.id),["stop","prevent"])),onPointerdown:d[28]||(d[28]=_(()=>{},["stop"])),onDblclick:d[29]||(d[29]=_(()=>{},["stop"]))},null,40,or)):C("",!0),x(e.row)?(f(),k("button",{key:3,type:"button","data-sve-ht-eye":"",disabled:!j(e.row),title:R(e.row),innerHTML:e.row.hidden||e.row.sectionOff?hr:cr,onClick:d[30]||(d[30]=_(p=>i(t).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:d[31]||(d[31]=_(()=>{},["stop"])),onDblclick:d[32]||(d[32]=_(()=>{},["stop"]))},null,40,ar)):C("",!0),!g(e.row)&&!P(e.row)?(f(),k("button",{key:4,type:"button","data-sve-ht-dup":"",disabled:!j(e.row),title:j(e.row)?i(t).duplicateTitle:i(t).lockedTitle,innerHTML:ur,onClick:d[33]||(d[33]=_(p=>i(t).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:d[34]||(d[34]=_(()=>{},["stop"])),onDblclick:d[35]||(d[35]=_(()=>{},["stop"]))},null,40,nr)):C("",!0),g(e.row)?C("",!0):(f(),k("button",{key:5,type:"button","data-sve-ht-del":"",disabled:!j(e.row),title:j(e.row)?i(t).deleteTitle:i(t).lockedTitle,innerHTML:gr,onClick:d[36]||(d[36]=_(p=>i(t).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:d[37]||(d[37]=_(()=>{},["stop"])),onDblclick:d[38]||(d[38]=_(()=>{},["stop"]))},null,40,sr)),E(e.row)?(f(),k("button",{key:6,type:"button","data-sve-ht-more":"","aria-label":i(t).moreTitle,"aria-haspopup":"menu",innerHTML:pr,onPointerenter:d[39]||(d[39]=p=>V(p.currentTarget,e.row)),onPointerleave:te,onClick:d[40]||(d[40]=_(p=>{te(),i(t).onMore?.(p.currentTarget,e.row.id)},["stop","prevent"])),onPointerdown:d[41]||(d[41]=_(()=>{},["stop"])),onDblclick:d[42]||(d[42]=_(()=>{},["stop"]))},null,40,rr)):C("",!0)]))],16,Ns),i(qa)(e.row)?(f(),k("div",He({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},i(t).dropId===e.row.id&&i(t).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),L(i(t).slotText),17,ir)):C("",!0)],64))}},Q=Wt(yr,[["__scopeId","data-v-cafb8411"]]),br=["data-sve-ht-look","data-sve-ht-layers"],Tr={key:0,class:"sve-ht-page-template"},xr={key:0,class:"sve-ht-page-template__text"},wr={class:"sve-ht-page-template__note"},_r={key:1,class:"sve-ht-empty"},Sr={key:2,class:"sve-ht-empty"},Cr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},Pr={key:0,class:"sve-ht-empty"},Hr={key:0,class:"sve-ht-empty"},Er=["data-sve-ht-under-main"],Mr={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},Lr={key:0,class:"sve-ht-empty"},Ir=["data-sve-ht-under-main"],Rr=["data-dim"],Or={key:0,class:"sve-ht-empty"},$r={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},Fr={key:0,class:"sve-ht-empty"},Dr={key:4,"data-sve-ht-branch":"","data-sve-ht-cat":"component"},Ar={__name:"HtmlTreeList",setup(e){const o=fe(()=>Yo(t.query)),n=fe(()=>Bs(t.rows,o.value)),a=fe(()=>n.value.rows),s=fe(()=>o.value?t.sections.filter(x=>Mt(x.row,o.value)||x.current&&x.ready&&a.value.length>0):t.sections);function l(x){return!!x&&(!o.value||Mt(x,o.value))}function r(x){const R=t.frame?.kind;return t.inComponent||(R==="header"||R==="footer")&&R!==x}const h=fe(()=>t.frame?.kind==="header"||t.frame?.kind==="footer"),m=fe(()=>!!t.frame&&["header","main","footer"].some(x=>l(t.frame[x]))),g=fe(()=>!!t.frame&&(t.frame.kind==="main"||l(t.frame.main))),P=fe(()=>!!o.value&&!s.value.length&&!a.value.length&&!m.value);function y(x){return!!o.value&&!n.value.hits.has(x.path)}function E(x){const R={"data-sve-ht-sec-uid":x.uid};return x.current&&(R["data-sve-ht-branch"]="",R["data-sve-ht-cat"]=x.row?.cat||"layout"),t.sectionDrop&&t.sectionDrop.uid===x.uid&&(R["data-sve-ht-drop"]=t.sectionDrop.place),R}return(x,R)=>(f(),k("div",He({class:"sve-ht-root","data-sve-ht-look":i(t).layers?"tags":i(t).look,"data-sve-ht-layers":i(t).layers?"":null,style:i(t).familyStyle},i(t).dragging?{"data-sve-ht-dragging":""}:{}),[i(t).pageTemplate?(f(),k("div",Tr,[i(t).pageTemplate.text?(f(),k("p",xr,L(i(t).pageTemplate.text),1)):C("",!0),$("p",wr,L(i(t).pageTemplate.note),1),i(t).pageTemplate.canOpen?(f(),k("button",{key:1,type:"button",class:"sve-ht-page-template__open",onClick:R[0]||(R[0]=w=>i(t).pageTemplate.onOpen(w.currentTarget))},L(i(t).pageTemplate.openLabel),1)):C("",!0)])):!i(t).rows.length&&!i(t).sections.length&&!i(t).frame?(f(),k("div",_r,L(i(t).emptyText),1)):P.value?(f(),k("div",Sr,L(i(t).searchEmpty),1)):C("",!0),i(t).frame||i(t).sections.length?(f(),k(F,{key:3},[i(t).frame?(f(),k(F,{key:0},[i(t).frame.kind==="header"?(f(),k("div",Cr,[(f(!0),k(F,null,ae(a.value,w=>(f(),q(Q,{key:w.id,row:w,dim:y(w)},null,8,["row","dim"]))),128)),i(t).rows.length?C("",!0):(f(),k("div",Pr,L(i(t).emptyText),1))])):!h.value&&l(i(t).frame.header)?(f(),q(Q,{key:1,row:i(t).frame.header,dim:r("header")},null,8,["row","dim"])):C("",!0)],64)):C("",!0),h.value?C("",!0):(f(),k("div",_a(He({key:1},i(t).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[i(t).frame?.kind==="main"?(f(),k(F,{key:0},[(f(!0),k(F,null,ae(a.value,w=>(f(),q(Q,{key:w.id,row:w,dim:y(w)},null,8,["row","dim"]))),128)),i(t).rows.length?C("",!0):(f(),k("div",Hr,L(i(t).emptyText),1))],64)):i(t).frame&&l(i(t).frame.main)?(f(),q(Q,{key:1,row:i(t).frame.main,dim:r("main")},null,8,["row","dim"])):C("",!0),i(t).frame?.kind==="template"?Ht((f(),k("div",{key:2,"data-sve-ht-frame-body":"","data-sve-ht-under-main":g.value?"":null},[$("div",Mr,[(f(!0),k(F,null,ae(a.value,w=>(f(),q(Q,{key:w.id,row:w,dim:y(w)},null,8,["row","dim"]))),128)),i(t).rows.length?C("",!0):(f(),k("div",Lr,L(i(t).emptyText),1))])],8,Er)),[[co,!i(t).mainShut]]):C("",!0),i(t).sections.length||i(t).frame?Ht((f(),k("div",{key:3,"data-sve-ht-frame-body":"","data-sve-ht-under-main":g.value?"":null},[i(t).frame?.template&&l(i(t).frame.template)?(f(),q(Q,{key:0,row:i(t).frame.template,dim:r("template")},null,8,["row","dim"])):C("",!0),i(t).frame&&!i(t).frame.template&&!i(t).sections.length&&!o.value?(f(),k("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":r("")?"":void 0},L(i(t).frameEmptyText),9,Rr)):C("",!0),(f(!0),k(F,null,ae(s.value,w=>(f(),k("div",He({key:w.uid},{ref_for:!0},E(w)),[w.ready?(f(),k(F,{key:0},[(f(!0),k(F,null,ae(a.value,V=>(f(),q(Q,{key:V.id,row:V,dim:y(V)},null,8,["row","dim"]))),128)),i(t).rows.length?C("",!0):(f(),k("div",Or,L(i(t).emptyText),1))],64)):(f(),q(Q,{key:1,row:w.row,dim:r("")},null,8,["row","dim"]))],16))),128))],8,Ir)),[[co,!i(t).frame||!i(t).mainShut]]):C("",!0)],16)),i(t).frame?(f(),k(F,{key:2},[i(t).frame.kind==="footer"?(f(),k("div",$r,[(f(!0),k(F,null,ae(a.value,w=>(f(),q(Q,{key:w.id,row:w,dim:y(w)},null,8,["row","dim"]))),128)),i(t).rows.length?C("",!0):(f(),k("div",Fr,L(i(t).emptyText),1))])):!h.value&&l(i(t).frame.footer)?(f(),q(Q,{key:1,row:i(t).frame.footer,dim:r("footer")},null,8,["row","dim"])):C("",!0)],64)):C("",!0)],64)):i(t).inComponent&&i(t).rows.length?(f(),k("div",Dr,[(f(!0),k(F,null,ae(a.value,w=>(f(),q(Q,{key:w.id,row:w,dim:y(w)},null,8,["row","dim"]))),128))])):i(t).rows.length?(f(!0),k(F,{key:5},ae(a.value,w=>(f(),q(Q,{key:w.id,row:w,dim:y(w)},null,8,["row","dim"]))),128)):C("",!0)],16,br))}},bt=Wt(Ar,[["__scopeId","data-v-d0376715"]]);let Tt=null;function Br(e){return Tt||(Tt=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(o=>o.ok?o.json():{pages:[]}).then(o=>Array.isArray(o.pages)?o.pages:[]).catch(()=>[])),Tt}let ot=null;function xt(){ot?.dismiss(),ot=null}function Nr(e,o,n){xt();const a=o?.getBoundingClientRect?.(),s={x:a?a.left:0,y:a?a.bottom+4:0};Br(e).then(l=>{const r=l.length?l.map(h=>({label:h.title||h.url,onPick:()=>{xt(),n(h.url)}})):[{label:v(e,"component_props_pages_none"),onPick:null}];xt(),ot=Ie(e.document,Re,{items:r,x:s.x,y:s.y,onClose:()=>{ot=null}})})}function Xo(e){for(const o of e||[]){if(o.kind==="component"||o.kind==="svg"&&o.dynamic)continue;const n=o.kind==="antlers"?Xo(o.children):o;if(n)return n}return null}const z=_n("sve-call-values"),Vr="__sve-html-tree-style";function jr(e,o,n){if(o||n)return!1;const a=String(b("dock:chrome-kind")||"");if(a==="header"||a==="footer")return!1;const s=Po(e);return Sn(e)?!1:!!s&&s!=="create"&&Ea(e)!==Ma(e)}function Qt(e){return{sectionLoops:Ha(e),sectionsLabel:v(e,"html_tree_sections_slot")}}function Kr(e,o){const n={entry:o,text:"",note:v(e,"html_tree_page_template_note"),openLabel:v(e,"html_tree_open_template"),canOpen:!1,onOpen:null};return Bo(e,{entry:o}).then(a=>{if(!(!a||t.pageTemplate?.entry!==o)){if(a.own_page&&a.view){Cn(o,a.view),b("dock:open-file",`view:${a.view}`),H(e);return}t.pageTemplate={...t.pageTemplate,text:v(e,"html_tree_page_template",{name:a.name}),canOpen:!!a.open,onOpen:a.open?s=>an(e,s,a.open):null}}}),n}function Ur(e,o){const n=o.replace(/^view:/,"");if(!n||b("dock:current-type")!==o){t.usedBy=null,t.templateSections=[];return}t.usedBy?.view!==n&&(t.usedBy=null,Bo(e,{view:n}).then(a=>{if(!a||b("dock:current-type")!==o)return;const s=a.everything?[{name:v(e,"html_tree_used_by_everything"),kind:"everything",url:null}]:a.used_by.map(l=>({...l,...qr(e,l)}));t.templateSections=Array.isArray(a.sections_fields)?a.sections_fields:[],t.usedBy={view:n,label:v(e,"html_tree_used_by"),items:s,empty:s.length?"":v(e,"html_tree_used_by_nobody"),hint:s.length?v(e,"html_tree_used_by_hint",{list:s.map(l=>l.name).join(", ")}):""}}))}function qr(e,o){if(!o.url)return{openLabel:"",onOpen:null};const n=v(e,"html_tree_used_by_open",{name:o.name});return o.kind==="page"?{openLabel:n,onOpen:a=>dn(e,a,cn(e,o.url))}:{openLabel:n,onOpen:a=>hn(e,{anchor:a,url:o.url,subtitle:o.name})}}const O=new Set;let Lt="",Pe=!1,wt=null,ge=!0,Y="",_e=0,Wo="";const Se=new Map,Be=new Set,It=new Map,at=new Map;let U="",Go=!1,I=null,nt=null,Je="",Ke="",st=0,Rt=null,pe=[],we=null,Ne=null,rt=null,it=null,Ot=null,re=!1,ee=null,Ue=null,Ve=null,lt=null,dt=null,$t=null,Te=null;function X(e){return e.getElementById(tt)}function zr(e){Sa(e,Vr,`
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
      ${vo("light")}
      /* How much of a row's own colour its pick takes: a wash, not a fill.
         The row mixes it in below — a mix written up here would read
         --sve-ht-c on the list, where no family is set. */
      --sve-ht-pick-mix: 11%;
      --sve-ht-pick-hover-mix: 18%;
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${vo("dark")}
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
  `)}function W(){const e=b("dock:html");return typeof e=="string"?e:""}function Ft(e){return!!b("dock:is-open",e)}function Oe(e,{save:o=!1,unlock:n=!1}={}){return ct()||b("dock:set-html",n?{html:e,unlock:!0}:e)!==!0?!1:(o&&b("dock:save-now"),!0)}function _t(e){const o=b("dock:component-exit-state")||{};if(t.exitOpen=!!o.open,!o.open){t.onExit=null;return}t.exitName=o.name||"",t.exitLabel=v(e,"component_exit"),t.exitTitle=v(e,o.back?"component_exit_back":"component_exit_close"),t.onExit=()=>{b("dock:exit-component"),H(e)}}const qe=[];let St=!1;function Ct(e,o){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(o,{timeout:2e3});return}e.setTimeout(o,200)}function Yr(e,o){for(const n of o){const a=n.type;!a||Se.has(a)||Be.has(a)||qe.includes(a)||qe.push(a)}zt.htmlTreePrefetchArmed&&Zo(e)}function Zi(e){zt.htmlTreePrefetchArmed=!0,Zo(e)}function Zo(e){if(St||!qe.length)return;St=!0;const o=()=>{const n=qe.shift();if(!n){St=!1;return}if(Se.has(n)||Be.has(n)){Ct(e,o);return}Be.add(n),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(n)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(a=>a.ok?a.json():null).then(a=>{if(typeof a?.html=="string"){Se.set(n,a.html);const s=at.get(n);at.delete(n),s&&s!==Qo(e,n)&&H(e)}}).catch(()=>{}).finally(()=>{Be.delete(n),Ct(e,o)})};Ct(e,o)}function ct(){return!!U}function Qo(e,o){return Jo(o)||La(e,o)||"section"}function Jo(e){const o=Se.get(e);if(!o)return"";const n=It.get(e);if(n&&n.html===o)return n.tag;const a=Jt(Ye(o))?.tag||"";return It.set(e,{html:o,tag:a}),a}function We(e,o){const n=vt(e)||"page_sections",a=[];for(const s of Kt(o)||[]){if(s.name===on||s.name===kn)continue;const l=Ut(s.values),r=l&&typeof l=="object"?l[n]:null;if(Array.isArray(r)){r.forEach(h=>{if(!h||typeof h!="object"||Array.isArray(h)||typeof h.type!="string")return;const m=[h._visual_id,h.id,h._id].filter(x=>typeof x=="string"&&x!=="");if(!m.length)return;const g=Ao(e,h),P=typeof h._sve_label=="string"?h._sve_label.trim():"",y=Qo(e,g);Jo(g)||at.set(g,y);const E=qo(g)[`0:${y}`];a.push({uid:m[0],ids:m,type:g,tag:y,label:P||(typeof E=="string"&&E.trim()?E.trim():"")||mt(e,g)?.display||je(g)||g,svg:Uo(y,bo(y),null).svg||Ee.section,cat:Fo(y,bo(y)),enabled:h.enabled!==!1,static:Aa(e,g)})});break}}return a}function Xr(e,o,n){if(!n.length)return"";const a=b("dock:current-type")||"",s=b("dock:current-uid"),l=!!b("dock:component-exit-state")?.open;if(s){const r=Xe(s,o),h=n.find(m=>m.ids.some(g=>r.includes(g)));if(h&&(l||h.type===a))return h.uid}return n.find(r=>r.type===a)?.uid||""}function Wr(e,o,n){const a=b("dock:component-exit-state");if(a?.open)return je(a.name)||a.name||"";if(n)return o.find(l=>l.uid===n)?.label||"";const s=b("dock:current-type")||"";return String(s).startsWith("view:")?"":mt(e,s)?.display||je(s)||""}function ft(e,o,n,a,s){const l=n.find(r=>r.uid===a);l&&a!==s&&(O.clear(),I=null,ge=!1,N(),Ge(),b("build:reveal",{ids:l.ids}),Y=a,Wo=W(),U=Se.get(l.type)||"",U&&(I=At(Ye(U))||null),Go=(b("dock:current-type")||"")===l.type,e.clearTimeout(_e),_e=e.setTimeout(()=>{Y="",Pe=!1,H(e)},4e3),H(e),ln(e,l.uid,"tree"),ke({source:G,type:B.SVE_ACTIVATE,ids:l.ids},e),e.setTimeout(()=>H(e),0))}function Dt(e,o){if(!o)return!1;for(const n of e||[])if(n.id===o||Dt(n.children,o))return!0;return!1}function At(e){return Jt(e)?.id||""}function Jt(e){for(const o of e||[]){if(ea(o))return o;const n=Jt(o.children);if(n)return n}return null}function ea(e){return!e.kind||e.kind==="component"}function bo(e){return e==="component"?"component":""}function Gr(e,o){const n=o===0||e.path===Ke;return O.has(e.path)?n:!n}function Zr(e){const o=new Set,n=qt(),a=(s,l)=>{for(const r of s)(r.children.length?Gr(r,l):n&&(r.kind==="antlers"||r.hollow)&&O.has(r.path))&&o.add(r.id),a(r.children,l+1)};return a(e,0),o}function H(e){const o=e.document,a=X(o)?.querySelector("[data-sve-html-tree-list]");if(!a)return;zr(o),xn(e);const s=W();U&&U===s&&(U=""),b("dock:chrome-kind")&&(U="");const l=U||s,r=Ye(l,Qt(e));pe=r,Ke="";const h=b("dock:current-type")||"",m=qo(h),g=Pa(e,o),y=!!(b("dock:component-exit-state")||{}).open;h&&s&&!U&&Se.set(h,s);const E=We(e,o);Yr(e,E);const x=Xr(e,o,E);if(jr(e,g,y)){const c=Po(e);pe=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!1,t.layoutFile=!1,t.emptyFile=!1,t.usedBy=null,t.emptyText="",t.pageTemplate?.entry!==c&&(t.pageTemplate=Kr(e,c)),t.onRefresh=()=>H(e),t.onSection=null,_t(e),Ae(a,bt),Pt(e,[]);return}t.pageTemplate=null,Ur(e,String(b("dock:collection-view")||""));const R=String(b("dock:chrome-kind")||"");if(Za(e),g&&!E.length&&!R){pe=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,t.layoutFile=!1,t.emptyFile=!1,t.emptyText=v(e,"html_tree_page_empty"),t.canEdit=!b("dock:is-locked"),t.look=mo(e),t.onRefresh=()=>H(e),t.onSection=null,_t(e),Ae(a,bt),Pt(e,[]);return}t.pageBuilder=g;const w=`${h}|${x}`;let V=!1;w!==Lt&&(Lt=w,O.clear(),wt!==null&&l!==wt?V=!0:Pe=l),(V||Pe!==!1&&l!==Pe)&&(Pe=!1,O.clear(),I=At(r)||null),wt=l,Y&&(Y===x||!E.length)&&(Go||l!==Wo)&&(e.clearTimeout(_e),Y="",Pe=!1,Dt(r,I)||(O.clear(),I=At(r)||null));const te=E.some(c=>c.uid===Y)?Y:"",Z=ge?"":te||x,j=!!(te||x),M=j||y?"":String(b("dock:chrome-kind")||""),d=g&&(!h&&!j||M==="main"&&b("dock:on-empty-page")===!0),p=d||M==="template"?"":M;t.layoutFile=p==="main",p!=="main"&&(Je="");const D=p==="main"?To(r,"main"):null,A=D?ht(r,c=>c.tag==="body"&&Dt(c.children,D.id)):null;Ke=A?A.path:"",D&&(et((A||D).path),Je!==w&&(et(D.path),O.add(D.path)));const $e=p==="header"||p==="footer"?ht(r,c=>l.slice(c.from,c.openTo).includes(`data-sve-chrome="${p}"`)):null,ie=$e||(p==="header"||p==="footer"?To(r,p):null);ie&&et(ie.path);const K=d||!(p==="main"?!!D:p==="header"||p==="footer"?!!ie:!0)?[]:Qa(r,t.query?new Set:Zr(r));t.emptyFile=!l.trim()&&M==="template"&&Ft(o),!l.trim()&&!Ft(o)?t.emptyText=v(e,"html_tree_need_dock"):t.emptyFile?t.emptyText=v(e,"html_tree_page_no_html"):t.emptyText=v(e,"html_tree_empty"),t.slotText=v(e,"antlers_drop_here"),t.dataTitle=v(e,"data_vars_title"),t.pageTitle=v(e,"component_props_page"),t.renameTitle=v(e,"html_tree_rename"),t.tagTitle=v(e,"tw_tag"),t.hideTitle=v(e,"html_tree_hide"),t.showTitle=v(e,"html_tree_show"),t.sectionHideTitle=v(e,"html_tree_section_hide"),t.sectionShowTitle=v(e,"html_tree_section_show"),t.moreTitle=v(e,"html_tree_more"),t.duplicateTitle=v(e,"html_tree_duplicate"),t.deleteTitle=v(e,"html_tree_delete"),t.videoHoldTitle=v(e,"html_tree_video_hold"),t.videoPlayTitle=v(e,"html_tree_video_play"),t.alpineTitle=v(e,"html_tree_alpine_state"),t.lockedTitle=v(e,"html_tree_locked"),t.searchEmpty=v(e,"html_tree_search_empty"),t.canEdit=!b("dock:is-locked"),t.look=mo(e),t.onQuery=()=>H(e),_t(e),t.inComponent=y,t.onSelect=(c,T)=>{const S=K.find(oe=>oe.id===c);if(S&&Ko(e,S.path))return;T&&!Vn()&&(t.rowClicks+=1);const ne=!!T&&S?.kind==="antlers"&&!re&&Ja(e);Le(e,c,K),T&&S&&!re&&!ct()&&b("build:reveal",{path:S.path,section:!!S.sectionRoot}),ne&&Wn(e,{path:S.path,at:T,beside:X(e.document)})},t.onTwist=c=>{const T=K.find(S=>S.id===c)?.path;T&&(O.has(T)?O.delete(T):O.add(T),H(e))},t.onTagChange=(c,T)=>{const S=t.rows.find(ne=>ne.id===T);S&&!ct()&&!eo(e,S)&&wn(e,c.currentTarget,S)},t.onRename=c=>ni(e,c),t.onRenameCommit=()=>xo(e,!0),t.onRenameCancel=()=>xo(e,!1),t.onHide=c=>di(e,c),t.onLock=c=>aa(e,c),t.onMore=(c,T)=>mi(e,c,T),t.canUnlock=oa(e),t.lockTitle=v(e,"html_tree_lock"),t.unlockTitle=v(e,"html_tree_unlock"),t.lockedByTitle=v(e,"html_tree_locked_by_developer"),t.onVideoHold=c=>ri(e,c),t.onAlpineState=(c,T)=>li(e,c,T),t.onDuplicate=c=>ci(e,c),t.onDelete=c=>ui(e,c),t.onPointerDown=(c,T)=>gi(e,c,T),t.onSectionPointerDown=(c,T)=>Ti(e,c,T),t.onSectionHover=c=>e.dispatchEvent(new e.CustomEvent("sve-lite-hover",{detail:{uid:c}})),t.onContext=(c,T)=>la(e,c,T),t.onInspectCommit=c=>Hi(e,c),t.onPropValue=(c,T,S)=>Co(e,c,T,S),t.onPropPage=(c,T)=>Nr(e,c,S=>Co(e,T,S,!1)),t.onLoopKind=c=>Ei(e,c),t.onAddBranch=c=>Mi(e,c),t.onLoopSortField=c=>{const T=ut();if(!T)return;const S=Te?.id===T.id?Te.dir:"";Te=null,se(e,Jn(T,c,S))},t.onLoopSortDir=c=>{const T=ut();if(!T)return;const S=es(T,c);if(S.draft){Te={id:T.id,dir:S.draft},Vt(e,T);return}Te=null,se(e,S.edit)},t.onLoopDepth=c=>se(e,as(c)),t.onLoopIncludeHome=c=>se(e,ns(c)),t.onLoopLimit=c=>se(e,ss(c)),t.onLoopOffset=c=>se(e,rs(c)),t.onPropHost=c=>c?z.mount(c):z.unmount(),t.onInspectData=(c,T)=>{b("dock:data-menu",{anchor:c,at:K.find(S=>S.id===I)?.from,onPick:S=>T(String(S?.var||"").trim())})};const gt=K.find(ea)?.id,Ze=y?"":Wr(e,E,Z),le=Z&&!y?E.find(c=>c.uid===Z):null;t.nameAt=(c,T)=>{if(T!==l||!c)return"";const S=ue=>{for(const ve of ue||[]){if(ve.path===c)return ve;const me=c.startsWith(`${ve.path}/`)?S(ve.children):null;if(me)return me}return null},ne=t.rows.find(ue=>ue.path===c&&!ue.kind);if(ne)return ne.name;const oe=S(r);if(!oe)return"";const he=oe.id===gt,Qe=he&&Ze?Ze:oe.klass;return he&&le?Qe:go(Qe,oe.path,m)};const ma=Oo(e,String(b("dock:current-type")||""));let fa=0;const pa=ii($e?[$e]:r,l),ga=$o(e,String(h)),de=p==="header"||p==="footer"?p:"",Ce=ie?ie.id:"",ye=D&&K.find(c=>c.id===D.id)||null,so=A&&K.find(c=>c.id===A.id)||null,ce=so||ye||Ce&&K.find(c=>c.id===Ce)||null,ro=ce?ti(K,ce):-1;if(ce&&!K.slice(K.indexOf(ce),ro).some(c=>c.id===I)&&(I=ce.id),t.selectFrom){const c=K.find(T=>T.from===t.selectFrom.at&&(!T.kind||T.kind==="sections"));c?(I=c.id,t.selectFrom=null):--t.selectFrom.left<=0&&(t.selectFrom=null)}const io=t.layoutFile?ei(e):null;t.rows=K.map(c=>{const T=io&&c.kind==="component"&&io.get(c.src)||"",S=c.tag==="body"&&!c.kind,ne=T?{svg:Ee[T]}:Uo(c.tag,c.kind,c.antlers),oe=c.tag==="video"&&!c.kind?fa++:-1,he=pa.get(c.id),Qe=he?ga[he.nth]||{}:{},ue=he?he.booleans.map(({key:Fe,value:lo})=>({key:Fe,file:lo,value:Qe[Fe]??lo})):[],ve=c.id===gt&&Ze?Ze:c.klass,me=c.id===gt;return{...c,tag:T||c.tag,frameCall:T,fixed:!!T||S,base:ve,name:T?v(e,`html_tree_frame_${T}`):de&&c.id===Ce?v(e,`html_tree_frame_${de}`):c===ye?v(e,"html_tree_frame_main"):me&&le?ve:go(ve,c.path,m),current:c.id===I,letter:ne.letter||"",svg:de&&c.id===Ce?Ee[de]:c===ye?Ee.main:me&&le?le.svg:ne.svg||"",frame:de&&c.id===Ce?de:c===ye?"main":"",cat:de&&c.id===Ce?de:c===ye||S?"main":T||Fo(c.tag,c.kind,c.antlers),componentRoot:me&&y,sectionRoot:me&&le?le.uid:"",sectionOff:!!(me&&le&&!le.enabled),videoNth:oe,videoHeld:oe>=0&&ma.has(oe),alpineNth:ue.length?he.nth:-1,alpineKeys:ue,alpineSet:ue.some(Fe=>Fe.value!==Fe.file)}}),en(e),tn(e);const kt=[];for(const c of t.rows)kt.length=c.depth,c.guides=kt.slice(),kt[c.depth]=c.cat;if(ce){const c=K.indexOf(ce),T=ce.depth;t.rows=t.rows.slice(c,ro).map(S=>({...S,depth:S.depth-T,guides:S.guides.slice(T)})),ye&&Je!==w&&(Je=w,e.setTimeout(()=>Le(e,ye.id,K),0))}t.sections=g&&!y&&(j||p||d)?E.map(c=>{const T=!!Z&&c.uid===Z;return{...c,current:T,ready:T&&(!te||!!U),row:{id:`sec:${c.uid}`,section:c.uid,tag:c.tag,name:c.label,kind:"",svg:c.svg,cat:c.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:T,hidden:!c.enabled}}}):[],t.frame=Jr(e,E,j,y,p,!1,!!so),t.frameEmptyText=v(e,"html_tree_frame_no_sections"),Qr(e,p),t.onSection=c=>{re||(Bt(e),ft(e,o,E,c,Z))},t.onRefresh=()=>H(e),Vt(e,t.rows.find(c=>c.id===I)),Ae(a,bt),Pt(e,r)}function Qr(e,o){t.frameOpenTitle=v(e,"html_tree_frame_open"),t.frameMainTitle=v(e,"html_tree_frame_main_open"),t.frameTemplateTitle=v(e,"html_tree_frame_template_open"),t.frameFieldsTitle=v(e,"html_tree_frame_fields"),t.onFrame=n=>{o===n?oi(e,n):Nt(e,n)},t.onFrameEnter=n=>Nt(e,n),t.onFrameFields=n=>Na(e,sn(e,n),v(e,`html_tree_frame_${n}`)),t.onFrameTwist=()=>{t.mainShut=!t.mainShut}}function Jr(e,o,n,a,s,l=!1,r=!1){if(!s&&!l||r)return null;const h=P=>({id:`frame:${P}`,frame:P,synthetic:!0,tag:P,name:v(e,`html_tree_frame_${P}`),kind:"",svg:Ee[P]||"",cat:P,letter:"",depth:0,hasChildren:P==="main"&&(o.length>0||s==="template"),shut:P!=="main",current:!1,hidden:!1}),m={kind:s,header:h("header"),main:h("main"),footer:h("footer"),template:null},g=s&&s!=="template"?String(b("dock:collection-view")||""):"";return g&&(m.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:mt(e,g)?.display||je(g.replace(/^view:/,"")),kind:"",svg:Ee.section||"",cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),m}function To(e,o){return ht(e,n=>n.tag===o)}function ht(e,o){for(const n of e||[]){if(!n.kind&&o(n))return n;const a=ht(n.children,o);if(a)return a}return null}function ei(e){const o=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},n=new Map;for(const a of["header","footer"]){const s=Hn(o[a]?.type);s&&n.set(s,a)}return n}function ti(e,o){let n=e.indexOf(o)+1;for(;n<e.length&&e[n].depth>o.depth;)n+=1;return n}function oi(e,o){const n=jo(e);(o==="main"||o==="template"?n?.querySelector("main"):n?.querySelector(`[data-sve-chrome="${o}"]`))?.scrollIntoView({behavior:pn(),block:"start"})}function Bt(e){const o=String(b("dock:chrome-open",e.document)||"");return o!=="header"&&o!=="footer"?!1:(rn(e),ke({source:G,type:B.SVE_FORCE_EXIT_CHROME},e),!0)}function ai(e){e.clearTimeout(_e),Y="",U="",O.clear(),I=null,ge=!1,N(),Ge()}function Nt(e,o){if(e.document,String(b("dock:chrome-kind")||"")===o)return;if(ai(e),o==="main"){Bt(e),b("dock:open-file",yn);return}if(o==="template"){const l=String(b("dock:collection-view")||"");l&&(Bt(e),b("dock:open-file",l));return}if(o!=="header"&&o!=="footer")return;const n=jo(e)?.querySelector(`[data-sve-chrome="${o}"]`);n?(n.scrollIntoView({block:"nearest"}),n.dispatchEvent(new n.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:G,type:B.OPEN_CHROME,kind:o},e.location.origin);const a=Date.now(),s=async()=>{if(String(b("dock:chrome-kind")||"")!==o){Date.now()-a<3e4&&e.setTimeout(s,250);return}await(b("dock:load-settled")||null),va(e)};e.setTimeout(s,250)}function Pt(e,o){X(e.document)&&ta(e,o)}function ta(e,o){const n=Xo(o),a=!!b("dock:component-src"),s=a?"":b("dock:current-uid")||"";ke({source:G,type:B.SVE_HTML_PICK,on:!0,uid:s,uids:s?Xe(s,e.document):[],all:a,tag:n?.tag||"",klass:n?.klass||"",nodes:Qn(o)},e)}function et(e){if(!e)return;const o=(n,a)=>{for(const s of n||[]){if(s.path===e)return!0;if(o(s.children,a+1))return a===0||s.path===Ke?O.delete(s.path):O.add(s.path),!0}return!1};o(pe,0)}function ni(e,o){if(re)return;const n=t.rows.find(a=>a.id===o);eo(e,n)||!n||n.kind||(I=o,t.rows.forEach(a=>{a.current=a.id===o}),t.editingId=o,t.draft=n.name,e.setTimeout(()=>{const a=X(e.document)?.querySelector("[data-sve-ht-rename]");a?.focus(),a?.select()},0))}function xo(e,o){const n=t.editingId;if(!n)return;const a=t.rows.find(s=>s.id===n);t.editingId=null,o&&a&&(a.sectionRoot?si(e,a.sectionRoot,t.draft):Gn(b("dock:current-type")||"",a.path,t.draft,a.base||a.klass)),t.draft="",H(e)}function si(e,o,n){const a=vt(e)||"page_sections",s=String(n||"").replace(/\s+/g," ").trim();for(const l of Kt(e.document)||[]){const r=Ut(l.values),h=r&&typeof r=="object"?r[a]:null;if(!Array.isArray(h))continue;const m=h.findIndex(E=>E&&typeof E=="object"&&[E._visual_id,E.id,E._id].includes(o));if(m===-1)continue;const g=Ao(e,h[m]),P=mt(e,g)?.display||je(g)||g,y=JSON.parse(JSON.stringify(h));return y[m]={...y[m]},!s||s===P?delete y[m]._sve_label:y[m]._sve_label=s,l.setFieldValue(a,y),!0}return!1}function ri(e,o){const n=t.rows.find(h=>h.id===o);if(!n||!(n.videoNth>=0))return;const a=String(b("dock:current-type")||""),s=Oo(e,a),l=!s.has(n.videoNth);l?s.add(n.videoNth):s.delete(n.videoNth);const r=String(b("dock:current-uid")||"");nn(e,a,s),ke({source:G,type:B.SVE_VIDEO_HOLD,uid:r,uids:r?Xe(r,e.document):[],nth:n.videoNth,on:l},e),H(e)}function ii(e,o){const n=new Map;let a=0;const s=l=>{for(const r of l){if(r.hidden)continue;const h=r.kind?null:ds(o.slice(r.from,r.openTo));h!==null&&n.set(r.id,{nth:a++,booleans:hs(h)}),s(r.children||[])}};return s(e),n}function li(e,o,n){const a=t.rows.find(l=>l.id===n);if(!a||!(a.alpineNth>=0))return;if(a.alpineKeys.length===1){wo(e,a,a.alpineKeys[0]);return}const s=o.currentTarget.getBoundingClientRect();N(),ee=Ie(e.document,Re,{items:a.alpineKeys.map(l=>({label:l.key,icon:l.value?sa:ra,onPick:()=>{N(),wo(e,a,l)}})),x:Math.round(s.left),y:Math.round(s.bottom+4),onClose:()=>{ee=null}})}function wo(e,o,n){const a=String(b("dock:current-type")||""),s=$o(e,a),l=!n.value,r=l!==n.file,h={...s[o.alpineNth]||{}};r?h[n.key]=l:delete h[n.key],Object.keys(h).length?s[o.alpineNth]=h:delete s[o.alpineNth];const m=un(String(b("dock:chrome-kind")||"")),g=m?"":String(b("dock:current-uid")||"");vn(e,a,s),ke({source:G,type:B.SVE_ALPINE_STATE,uid:g,uids:g?Xe(g,e.document):[],chrome:m,nth:o.alpineNth,key:n.key,value:l,on:r},e),H(e)}function eo(e,o){return!o||!(o.locked||o.lockedIn)?!1:(e.Statamic?.$toast?.error(v(e,"html_tree_locked_element")),!0)}function oa(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function aa(e,o){const n=t.rows.find(a=>a.id===o);if(!(!n||n.lockedIn||b("dock:is-locked"))){if(!n.locked){Me(e,o,jn,{lockAction:!0});return}if(!oa(e)){e.Statamic?.$toast?.error(v(e,"html_tree_unlock_denied"));return}Yt(e,{titleKey:"html_tree_unlock_title",bodyKey:"html_tree_unlock_body",confirmKey:"html_tree_unlock_confirm"},()=>Me(e,o,Kn,{lockAction:!0,unlock:!0}))}}function to(e){return!!t.rows.find(o=>o.id===e)?.fixed}function oo(e){const o=t.sections?.find(a=>a.row?.id===e);if(o)return o;const n=t.rows.find(a=>a.id===e)?.sectionRoot;return n&&t.sections?.find(a=>a.uid===n)||null}function di(e,o){if(to(o))return;const n=oo(o),a=t.rows.find(s=>s.id===o);if(n&&!(a?.hidden&&a.wrapFrom!=null)){e.postMessage({source:G,type:B.HIDE_ROW,uid:n.uid,show:!n.enabled},e.location.origin),e.setTimeout(()=>H(e),60);return}Me(e,o,Un)}function ci(e,o){if(to(o))return;const n=oo(o)?.uid;if(n){e.postMessage({source:G,type:B.DUPLICATE_ROW,uid:n},e.location.origin);return}Me(e,o,qn)}function na(e,o){Yt(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const n=e.document;gn({uid:o},n,e)})}function hi(e,o,n){Y===n&&(e.clearTimeout(_e),Y="",U=""),I=null,ge=!1,Lt="";const a=We(e,o),s=a.find(l=>l.uid!==n)||a[0];s?ft(e,o,a,s.uid,""):(U="",t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,H(e)),e.setTimeout(()=>{X(e.document)&&H(e)},0)}Do("row:removed",({uid:e,parentPath:o,doc:n,win:a})=>{o!==vt(a)||!X(a.document)||hi(a,n,e)});function ui(e,o){if(to(o))return;const n=t.sections?.find(s=>s.row?.id===o),a=n?n.row?.section||n.uid:t.rows.find(s=>s.id===o)?.sectionRoot;if(a){na(e,a);return}if(t.rows.find(s=>s.id===o)?.kind==="sections"){Yt(e,{titleKey:"html_tree_sections_remove_title",bodyKey:"html_tree_sections_remove_body",confirmKey:"html_tree_sections_remove_confirm"},()=>Me(e,o,po));return}Me(e,o,po)}function Me(e,o,n,{lockAction:a=!1,unlock:s=!1}={}){if(b("dock:is-locked"))return;const l=W(),r=t.rows.find(m=>m.id===o);if(!r||!a&&eo(e,r))return;const h=n(l,r);h!==l&&Oe(h,{unlock:s})}let ze=null;function ao(){ze?.closest("[data-sve-ht-row]")?.removeAttribute("data-sve-ht-more-open"),ze=null}function N(){ee?.dismiss(),ee=null,ao()}const sa='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',ra='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>',be=e=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${e}</svg>`,xe={up:be('<path d="M12 19V5M6 11l6-6 6 6"/>'),down:be('<path d="M12 5v14M6 13l6 6 6-6"/>'),save:be('<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/>'),add:be('<path d="M12 5v14M5 12h14"/>'),fieldset:be('<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/>'),lock:be('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),unlock:be('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-.9"/>')};function vi(e,o){const n=t.sections||[],a=n.findIndex(r=>r.uid===o.uid),s=(r,h={})=>()=>{N(),e.postMessage({source:G,type:r,uid:o.uid,...h},e.location.origin),e.setTimeout(()=>H(e),60)},l=[{label:v(e,"move_up"),icon:xe.up,onPick:a>0?s(B.MOVE,{direction:-1}):null},{label:v(e,"move_down"),icon:xe.down,onPick:a>=0&&a<n.length-1?s(B.MOVE,{direction:1}):null},{label:v(e,"html_tree_save_section"),icon:xe.save,onPick:s(B.SAVE_SECTION)},{label:v(e,"add_section_below"),icon:xe.add,onPick:s(B.ADD_SET)}];if(Eo(e)&&o.type&&!o.static){const r=o.current&&!t.canEdit;l.push({label:v(e,"html_tree_fieldset"),icon:xe.fieldset,onPick:r?null:()=>{N(),Mo(e,o.type)}})}return l}function _o(e,o){const n=t.canEdit&&(!o.locked||t.canUnlock);return{label:o.locked?t.canUnlock?t.unlockTitle:t.lockedByTitle:t.lockTitle,icon:o.locked?xe.unlock:xe.lock,onPick:n?()=>{N(),aa(e,o.id)}:null}}function mi(e,o,n){if(!o.isConnected||ee&&ze===o)return;const a=oo(n),s=t.rows.find(l=>l.id===n);if(!a){la(e,null,n,{anchor:o,lead:s?[_o(e,s)]:[]});return}N(),ze=o,o.closest("[data-sve-ht-row]")?.setAttribute("data-sve-ht-more-open",""),ee=Ie(e.document,Re,{items:[...vi(e,a),...s?[_o(e,s)]:[]],x:0,y:0,anchor:o,onClose:()=>{ee=null,ao()}})}function ia(e,o){const n=t.sections?.find(m=>m.uid===o),a=n?.type||"";if(!a||!Ho(e))return[];const s=n.label||a,l=Ba(e,a),r=()=>e.Statamic?.$toast?.error(v(e,"section_update_failed")),h=[{label:v(e,"static_section_insertable"),icon:l?ra:sa,onPick:()=>{N(),ho(e,{handle:a,hidden:!l}).then(()=>{e.Statamic?.$toast?.success(v(e,l?"section_shown_to_editors":"section_hidden_from_editors",{name:s})),uo(e)}).catch(r)}}];return n.static&&h.push({label:v(e,"section_add_fields"),onPick:()=>{N(),ho(e,{handle:a,fields:!0}).then(()=>{e.Statamic?.$toast?.success(v(e,"section_fields_added",{name:s})),uo(e),H(e),Mo(e,a)}).catch(r)}}),h}function fi(e,o,n){const a=n.row?.section||n.uid;a&&(ee=Ie(e.document,Re,{items:[...ia(e,a),{label:v(e,"html_tree_remove_section"),danger:!0,onPick:()=>{N(),na(e,a)}}],x:o.clientX,y:o.clientY,onClose:()=>{ee=null}}))}function la(e,o,n,{anchor:a=null,lead:s=[]}={}){N();const l=t.sections?.find(g=>g.row?.id===n);if(l){fi(e,o,l);return}const r=t.rows.find(g=>g.id===n);if(!r)return;a||Le(e,n,t.rows);const h=a?{x:0,y:0}:{x:o.clientX,y:o.clientY},m=g=>{const P=[...s,...g.map(y=>a&&y.onPick?{...y,onPick:()=>{Le(e,n,t.rows),y.onPick()}}:y)];P.length&&(ee?.dismiss(),a&&(ze=a,a.closest("[data-sve-ht-row]")?.setAttribute("data-sve-ht-more-open","")),ee=Ie(e.document,Re,{items:P,x:h.x,y:h.y,anchor:a,onClose:()=>{ee=null,ao()}}))};if(r.frameCall){m([{label:v(e,"html_tree_frame_edit",{frame:v(e,`chrome_${r.frameCall}`)}),onPick:()=>{N(),Nt(e,r.frameCall)}}]);return}if(r.kind==="component"){pi(e,r,m);return}if(r.kind==="slot"||r.kind==="sections"||r.kind==="svg"||r.locked||r.lockedIn){m([]);return}if(!t.canEdit){m([]);return}if(r.componentRoot){m([]);return}m([...r.sectionRoot?ia(e,r.sectionRoot):[],{label:v(e,"component_make"),onPick:()=>{N(),Pn(e,r,{onDone:()=>H(e),onError:g=>{e.alert(g?.status===409?v(e,"component_exists"):v(e,"component_failed"))}})}}])}const So=(e,o)=>{N(),b("dock:open-template",o)};function pi(e,o,n){if(!mn(o.src)){n([{label:v(e,"component_open_named",{name:fn(o.src)||o.src}),onPick:()=>So(e,`view:partials/${o.src}`)}]);return}n([{label:v(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(o.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(a=>a.ok?a.json():{items:[]}).then(a=>{const s=Array.isArray(a.items)?a.items:[];n(s.length?s.map(l=>({label:v(e,"component_open_named",{name:l.label}),onPick:()=>So(e,l.type)})):[{label:v(e,"component_none"),onPick:null}])}).catch(()=>n([{label:v(e,"component_none"),onPick:null}]))}function gi(e,o,n){if(o.button!==0||b("dock:is-locked")||t.editingId)return;const a=t.rows.find(r=>r.id===n);if(a&&(a.locked||a.lockedIn)||o.target?.closest?.("button, input"))return;Ge(),we=n,Ne={x:o.clientX,y:o.clientY},rt=o.currentTarget,it=o.pointerId;const s=r=>ki(e,r),l=r=>yi(e,r);Ot=()=>{e.document.removeEventListener("pointermove",s,!0),e.document.removeEventListener("pointerup",l,!0),e.document.removeEventListener("pointercancel",l,!0),Ot=null},e.document.addEventListener("pointermove",s,!0),e.document.addEventListener("pointerup",l,!0),e.document.addEventListener("pointercancel",l,!0)}function ki(e,o){if(!we||!Ne)return;const n=o.clientX-Ne.x,a=o.clientY-Ne.y;if(!t.dragging&&n*n+a*a<25)return;if(!t.dragging){t.dragging=!0;try{rt?.setPointerCapture?.(it)}catch{}}o.preventDefault();const s=e.document.elementFromPoint(o.clientX,o.clientY),l=s?.closest?.("[data-sve-ht-slot]");if(l){const y=l.getAttribute("data-sve-ht-id");if(y&&y!==we){t.dropId=y,t.dropPlace="inside";return}}const r=s?.closest?.("[data-sve-ht-row]"),h=r?.getAttribute("data-sve-ht-id");if(!h||h===we){t.dropId=null,t.dropPlace=null;return}const m=t.rows.find(y=>y.id===h),g=t.rows.find(y=>y.id===we);if(!m||m.lockedIn||g&&m.path.startsWith(`${g.path}/`)){t.dropId=null,t.dropPlace=null;return}const P=r.getBoundingClientRect();t.dropId=h,t.dropPlace=Dn(o.clientY-P.top,P.height,!Vo(m.tag)&&!No(m)&&!m.locked)}function yi(e,o){const n=we,a=t.dropId,s=t.dropPlace||"after",l=t.dragging;if(Ge(),l&&(re=!0,e.setTimeout(()=>{re=!1},0)),!l||b("dock:is-locked")||!n||!a||n===a)return;o?.preventDefault?.();const r=W(),h=An(r,pe,n,a,s);if(h!==r){const m=s==="inside"&&qt()?bi(e,r,h,n,a):null;Oe(h)||m?.()}}function bi(e,o,n,a,s){const l=fo(pe,a),r=fo(pe,s);if(!l||!r||r.children.length||!(r.kind==="antlers"||r.hollow))return null;const h=Nn(o,l),m=h.from<r.from?r.from-(h.to-h.from):r.from,g=(R,w)=>{for(const V of R){if(V.from===m&&V.tag===r.tag)return{node:V,depth:w};const te=g(V.children,w+1);if(te)return te}return null},P=g(Ye(n,Qt(e)),0);if(!P)return null;const{path:y}=P.node,E=P.depth===0||y===Ke,x=O.has(y);return E?O.delete(y):O.add(y),()=>{x?O.add(y):O.delete(y)}}function Ge(){try{rt?.releasePointerCapture?.(it)}catch{}Ot?.(),we=null,Ne=null,rt=null,it=null,t.dragging=!1,t.dropId=null,t.dropPlace=null}function Ti(e,o,n){if(o.button!==0||!n||t.editingId||o.target?.closest?.("button, input"))return;da(),Ue=n,Ve={x:o.clientX,y:o.clientY},lt=o.currentTarget,dt=o.pointerId;const a=l=>xi(e,l),s=l=>wi(e,l);$t=()=>{e.document.removeEventListener("pointermove",a,!0),e.document.removeEventListener("pointerup",s,!0),e.document.removeEventListener("pointercancel",s,!0),$t=null},e.document.addEventListener("pointermove",a,!0),e.document.addEventListener("pointerup",s,!0),e.document.addEventListener("pointercancel",s,!0)}function xi(e,o){if(!Ue||!Ve)return;const n=o.clientX-Ve.x,a=o.clientY-Ve.y;if(!t.dragging&&n*n+a*a<25)return;if(!t.dragging){t.dragging=!0;try{lt?.setPointerCapture?.(dt)}catch{}}o.preventDefault();const l=e.document.elementFromPoint(o.clientX,o.clientY)?.closest?.("[data-sve-ht-sec-uid]"),r=l?.getAttribute("data-sve-ht-sec-uid")||"";if(!r||r===Ue){t.sectionDrop=null;return}const h=l.getBoundingClientRect();t.sectionDrop={uid:r,place:o.clientY-h.top<h.height/2?"before":"after"}}function wi(e,o){const n=Ue,a=t.sectionDrop,s=t.dragging;da(),s&&(re=!0,e.setTimeout(()=>{re=!1},0)),!(!s||!n||!a?.uid||a.uid===n)&&(o?.preventDefault?.(),_i(e,n,a.uid,a.place))}function da(){try{lt?.releasePointerCapture?.(dt)}catch{}$t?.(),Ue=null,Ve=null,lt=null,dt=null,t.dragging=!1,t.sectionDrop=null}function _i(e,o,n,a){const s=vt(e)||"page_sections";for(const l of Kt(e.document)||[]){const r=Ut(l.values),h=r&&typeof r=="object"?r[s]:null;if(!Array.isArray(h))continue;const m=E=>h.findIndex(x=>x&&typeof x=="object"&&[x._visual_id,x.id,x._id].includes(E)),g=m(o),P=m(n);if(g===-1||P===-1||g===P)return!1;let y=a==="before"?P:P+1;return g<y&&(y-=1),y===g?!1:(e.postMessage({source:G,type:B.MOVE,uid:o,toIndex:y},e.location.origin),e.setTimeout(()=>H(e),60),!0)}return!1}function Vt(e,o){if(o?.kind==="component"){Si(e,o);return}if(J.callOpen&&(J.callOpen=!1,J.callStore=null,z.forget(),Gt(e)),o?.kind!=="antlers"){t.inspect=null;return}const n=o.id,a={logic:!0,path:o.path};if(o.tag==="else"){t.inspect={key:n,...a,title:v(e,"antlers_condition"),mode:"note",note:v(e,"antlers_else_note")};return}if(o.antlers==="loop"){t.inspect={...os(e,o,{key:n,draft:Te?.id===o.id?Te.dir:""}),...a};return}t.inspect={key:n,...a,title:v(e,"antlers_condition"),mode:"condition",value:o.expr||"",placeholder:v(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:v(e,"antlers_add_elseif")},{id:"else",label:v(e,"antlers_add_else")}]}}function Si(e,o){if(!Mn(e)){t.inspect=null;return}if(!o.src)return;const n=o.id;if(t.inspect={key:n,title:v(e,"component_props_values"),mode:"note",note:v(e,"code_dock_loading")},Ln()){const a={},s={},l=new Map;for(const[r,h]of In(W().slice(o.from,o.to))){const m=Rn(r);m&&(r!==m||!l.has(m))&&l.set(m,h)}for(const[r,h]of l)h.bound?s[r]=h.value:a[r]=h.value;t.inspect=null,J.callOpen=!0,J.title=J.title||v(e,"component_props"),J.callTitle=o.klass||o.name||o.src,J.callStore=z.ui,z.ui.canBind=!0,z.ui.dataTitle=v(e,"data_vars_title"),z.ui.exprPlaceholder=v(e,"component_props_expr"),z.ui.onBox=(r,h)=>Pi(e,r,h),z.ui.onPickData=(r,h)=>b("dock:data-menu",{anchor:h,at:o.from,types:On(z.ui.fields.find(m=>m.handle===r)?.type),onPick:m=>ca(e,r,String(m?.var||"").trim())}),z.load(e,{key:`${o.src}::${n}`,src:o.src,params:a,bindings:s,readOnly:b("dock:is-locked")===!0}),z.watch(e,{src:o.src,write:r=>Ci(e,r,s)}),Gt(e);return}$n(e,o.src).then(a=>{if(t.inspect?.key===n){if(!a.length){t.inspect={key:n,title:v(e,"component_props_values"),mode:"note",note:v(e,"component_props_values_none")};return}t.inspect={key:n,title:v(e,"component_props_values"),mode:"props",inheritLabel:v(e,"component_props_inherit"),rows:Fn(a,W().slice(o.from,o.to))}}})}function Ci(e,o,n={}){const a=t.rows.find(r=>r.id===I);if(a?.kind!=="component"||b("dock:is-locked"))return;let s=W(),l=a.to;for(const[r,h]of Object.entries(o||{})){if(r in n)continue;const m=s.length,g=Zt(s,{from:a.from,to:l},r,h);g!==s&&(l+=g.length-m,s=g)}s!==W()&&(Oe(s,{save:!0}),H(e))}function ca(e,o,n){ha(e,o,n,!0),H(e)}function Pi(e,o,n){const a=Bn(n);if(a){ca(e,o,a);return}z.forget(),ha(e,o,String(n??"").trim(),!1),H(e)}function ha(e,o,n,a){const s=t.rows.find(h=>h.id===I);if(s?.kind!=="component"||b("dock:is-locked"))return;const l=W(),r=Zt(l,s,o,n,{bound:a});r!==l&&Oe(r,{save:!0})}function ut(){const e=t.rows.find(o=>o.id===I);return e?.kind==="antlers"&&!b("dock:is-locked")?e:null}function se(e,o){const n=ut();if(!n)return;const a=W(),s=o(a,n);s!==a&&(Oe(s),H(e))}function Co(e,o,n,a){const s=t.rows.find(h=>h.id===I);if(s?.kind!=="component"||b("dock:is-locked"))return;const l=W(),r=Zt(l,s,o,n,{bound:a});r!==l&&(Oe(r,{save:!0}),H(e))}function Hi(e,o){se(e,(n,a)=>a.antlers==="loop"?is(a,o)(n,a):zn(n,a,o))}function Ei(e,o){const n=ut();if(!n||n.antlers!=="loop")return;const a=ts(e,n,o);a&&se(e,a)}function Mi(e,o){se(e,(n,a)=>Yn(n,a,o))}function Li(e,o){if(!e||!o||No(o)||Vo(o.tag))return null;const n=En(e,o);if(n<o.openTo)return null;const a=e.lastIndexOf(`
`,n-1)+1;return e.slice(a,n).trim()===""&&a>o.openTo?a-1:n}function Le(e,o,n,{reveal:a=!0}={}){if(re)return;const s=(n||t.rows).find(l=>l.id===o);s&&(I=o,t.rows.forEach(l=>{l.current=l.id===o}),Vt(e,s),!ct()&&(a&&(b("dock:reveal-html",{from:s.from,to:s.to,caret:Li(W(),s)}),b("dock:tw-follow")),ke({source:G,type:B.SVE_HTML_PICK_FOCUS,path:s.path,src:s.kind==="component"&&s.src||""},e)))}function Ii(e,o){if(!o)return"";const n=[],a=(s,l)=>{for(const r of s||[]){const h=l||r.path===e;r.kind==="component"&&r.src===o&&n.push({path:r.path,inside:h}),a(r.children,h)}};return a(pe,!1),(n.find(s=>s.inside)||n[0])?.path||""}function Ri(e,o,{reveal:n=!0}={}){if(!o||!X(e.document))return;ge=!1;const a=t.rows.find(l=>l.current);if(a&&a.path===o){Le(e,a.id,t.rows,{reveal:n});return}H(e),et(o),H(e);const s=t.rows.find(l=>l.path===o);s&&(Le(e,s.id,t.rows,{reveal:n}),e.setTimeout(()=>{X(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function jt(e){if(nt)return;const o=()=>{t.editingId||t.dragging||(e.clearTimeout(st),st=e.setTimeout(()=>{X(e.document)&&H(e)},80))},n=()=>{if(o(),b("dock:on-empty-page")===!0){const a=We(e,e.document);a.length===1&&ft(e,e.document,a,a[0].uid,"")}};nt=Do("dock:html-changed",o),e.document.addEventListener("sve-page-structure",n),Rt=()=>{e.document.removeEventListener("sve-page-structure",n)}}function Oi(e){nt?.(),nt=null,Rt?.(),Rt=null,e?.clearTimeout?.(st),st=0}function no(e){const o=X(e.document);if(ke({source:G,type:B.SVE_HTML_PICK,on:!1},e),Oi(e),z.forget(),J.callOpen=!1,J.callStore=null,Gt(e),Ge(),N(),Tn(e),I=null,t.inspect=null,t.editingId=null,t.draft="",t.sections=[],t.pageBuilder=!1,t.layoutFile=!1,Y="",e?.clearTimeout?.(_e),!o){Et(e);return}o.remove(),zt.headerTab==="html_tree"&&za(e,null),Ya(e),Lo(e),Io(e),Et(e)}const ua="button[title], button[data-tip], label[title]";function Qi(e,o){o.querySelector("[data-sve-html-tree-list]")||(o.id=tt,Ro(e,o,{only:ua}),Ae(o,zo,{title:v(e,"html_tree")}),o.querySelector("[data-sve-close]")?.addEventListener("click",()=>no(e)))}function Ji(e){jt(e),H(e)}function va(e){const o=e.document;if(!Ca(e,"html_tree"))return;if(X(o)){jt(e),H(e);return}if(!Ft(o))return;ge=!0,O.clear(),Xa(e,[tt]);const n=o.createElement("div");n.id=tt,Ro(e,n,{only:ua}),n.style.cssText=Wa,Ae(n,zo,{title:v(e,"html_tree")}),n.querySelector("[data-sve-close]")?.addEventListener("click",()=>no(e)),Ga(e,n),Lo(e),Io(e),Et(e),jt(e),H(e)}function el(e){if(X(e.document)){no(e);return}va(e)}Xt("html-tree:open-section",e=>{const o=window,n=o.document,a=We(o,n),s=a.find(l=>l.uid===e||l.ids.includes(e));return s?(ft(o,n,a,s.uid,""),{uid:s.uid,ids:s.ids}):null});Xt("html-tree:from-preview",({path:e,src:o,uid:n,reveal:a=!0}={})=>{if(!Ko(window,e)){if(!e){$i(window,n);return}Ri(window,Ii(e,o)||e,{reveal:a})}});function $i(e,o){if(!o||!X(e.document))return;const n=We(e,e.document),a=Xe(o,e.document),s=n.find(l=>l.ids.some(r=>a.includes(r)));s&&(ge&&(ge=!1,O.clear(),I=null),Y&&Y!==s.uid&&(e.clearTimeout(_e),Y="",U=""),!b("dock:load-settled")&&H(e))}Xt("html-tree:arm-pick",e=>{const o=window;return e?(ta(o,Ye(W(),Qt(o))),!0):(X(o.document)||ke({source:G,type:B.SVE_HTML_PICK,on:!1},o),!0)});function tl(){Se.clear(),Be.clear(),It.clear(),at.clear(),qe.length=0}export{Vr as HTML_TREE_STYLE_ID,Zi as armHtmlTreePrefetch,tl as clearHtmlTreeTemplates,N as closeHtmlTreeMenu,no as closeHtmlTreePanel,zr as ensureHtmlTreeStyles,Qi as fillHtmlTreePane,I as htmlTreeActiveId,X as htmlTreePanel,st as htmlTreeTimer,nt as htmlTreeUnhook,va as openHtmlTreePanel,H as renderHtmlTree,Ji as showHtmlTreePane,Oi as stopWatchHtmlTreeDock,el as toggleHtmlTreePanel,jt as watchHtmlTreeDock};
